# merge-meadow — architecture contract

This file is the contract between the parallel build tracks. Each track owns
the directories listed in §1 and may not change another track's files;
anything it needs from another track is requested through the interfaces in
§3. The design and its reasons live in
[`docs/design-merge-meadow.md`](../../docs/design-merge-meadow.md) — read it
first; this file only pins down what the code must look like so four tracks
can build at once and meet in `main.js`.

Vocabulary: **doc** = the Automerge document (authored state); **world** = the
ECS mirror of the doc plus per-entity `live` state; **ops** = the only way
anything writes to the doc; **owner** = the one peer that simulates an entity.

## 1. Layout and ownership

```
packages/merge-meadow/
  package.json vite.config.js          (PM; dependencies are pre-declared, nobody runs npm install)
  ARCHITECTURE.md README.md STATUS.md  (PM / integration)
  index.html main.js style.css         track D
  src/boot/lockdown.js                 track D   SES lockdown, the first module script
  src/doc/                             track A   schema, seed, presets, ops, read, validate
  src/core/                            track A   world (ECS), tick, filters, events
  src/sim/                             track A   the built-in systems
  src/scripts/                         track A   doc-stored systems: lower, compartment host, script world API
  src/net/                             track B   repo, link, presence, ownership, pose stream, checkpoints
  src/agent/                           track B   captp caps, sealed transport, page-side host
  agent/                               track B   Node: lib/connect.mjs, mcp.mjs, cli.mjs
  src/render/                          track C   scene, reconciler, resources, kinds/*
  src/xr/                              track C   rig, pointer, controllers, vr-button, interact
  src/editor/                          track D   DOM editor panels, forms, undo, share, agent panel
  test/unit/<track>-*.test.mjs         each track, node --test, no browser
  test/e2e.mjs test/xr.mjs             integration
  scripts/boundaries.mjs               track A   import-boundary lint (§2)
```

## 2. Rules every track follows

1. **Only authored state goes in the doc; never per-frame state.** Systems
   write `entity.live`; durable effects are queued as ops and flushed once per
   tick by the app. (One Automerge write ≈ 70 µs and ~3 bytes of permanent
   history; 300 poses per frame would be 60 ms per change.)
2. **One write path.** Everything that changes the doc is an op list through
   `applyOps` (§3.1). No `handle.change` anywhere else.
3. **Reads of the doc are frozen.** `world` deep-freezes component data it
   ingests. Code that hands data to the editor, the agent or a script returns
   fresh plain copies from `src/doc/read.js`, never a doc proxy, never a three
   object. (CapTP's marshal hardens what it sends: a live `Vector3` returned
   once froze `Vector3.prototype` in the research.)
4. **Enums, ids and URLs are `ImmutableString`**; compare with `String(x)`.
   Counters are `Counter`s (`health.damage`); hp is `max − damage`, clamped.
5. **`set` merges fields; `replace` swaps identity.** Inspector and agent
   edits are `set`. `replace` is for kind swaps and explicit redefinition.
6. **Key order is not preserved.** Sort by key or `order` before iterating
   anything that affects behaviour (drives, groups, systems, components).
7. **Module boundaries** (enforced by `scripts/boundaries.mjs`, run in
   `npm test`):
   - `src/doc`, `src/core`, `src/sim`, `src/scripts` import no `three`, no
     DOM globals (`document`, `window`, `localStorage`, `requestAnimationFrame`),
     no `@automerge/*-repo*`. `src/doc` may import `@automerge/automerge/slim`
     for `Counter`, `ImmutableString`, `updateText` only.
   - only `src/render` and `src/xr` import `three`.
   - only `src/net`, `src/agent` and `agent/` import `@automerge/*-repo*`.
   - `src/editor` imports nothing from `three`; it talks to the scene through
     `reconciler` and `interaction` (§3.3).
8. **Every public function in §3 has a unit test in its track**, runnable
   with `node --test` and no browser. Tracks C and D test what they can in
   Node (pure helpers) and leave browser checks to `test/e2e.mjs`.
9. **No dependency changes.** A track that needs another package reports it
   in its result; the PM adds it.
10. **Lockdown-safe code.** The page runs under SES `lockdown()`
    (`overrideTaming: 'severe'`). Do not assign to built-in prototypes, do
    not rely on `Object.prototype` being writable, do not use `Function()`.
    Objects you intend to mutate later must not pass through `harden`.

## 3. Interfaces

Signatures are JS; types are described in comments. Options objects may grow
with defaults; positional parameters may not change.

### 3.1 Track A — doc

```js
// src/doc/schema.js
export const SCHEMA_VERSION = 1
export function newId(prefix = 'e')            // 'prefix-xxxxx', url-safe, sortable enough
export function isName(s)                       // /^[A-Za-z_][A-Za-z0-9_]{0,63}$/
export function initDoc(d, { title })           // mutate a fresh doc into schema v1 (empty maps, meta, world)
export function migrate(d)                      // no-op at v1; the hook future versions use

// src/doc/presets.js
export const COMPONENT_DEFS                     // { [name]: { description, order, defaults, schema } }  — the seed of doc.components
export const PRESETS                            // { creature, trex, sheep, horse, tree, rock, lamp }    — the seed of doc.presets

// src/doc/seed.js
export function seedDoc(d, { title })           // initDoc + COMPONENT_DEFS + PRESETS + a starter scene (ground settings, trees, 1 trex, 3 sheep, 1 horse, 1 lamp)

// src/doc/ops.js   — THE write path. Pure on the doc proxy so Node and browser share it.
//   op shapes (design §5.1): spawn, despawn, set, replace, remove, define, setParent, addGroup, removeGroup,
//   push (inbox append), drain (inbox delete by count), inc (Counter field), definePreset, removePreset,
//   defineComponent, removeComponent, defineSystem, setSystem, removeSystem, setWorld, setMeta
export function validateOps(doc, ops)           // -> [] or throws TypeError listing every problem (names, filters, schemas, ids)
export function changeDoc(d, ops, ctx)          // apply to the doc proxy INSIDE a change; returns { results, inverse }
export function applyOps(handle, ops, { message, peerId } = {})
                                                // validateOps on handle.doc(), then handle.change(d => changeDoc(d, ops)); returns { results, inverse }
// results[i]: spawn -> id; define -> { changed: [paths] }; others -> true

// src/doc/read.js   — every read that leaves the core goes through here (fresh plain data)
export function entityData(doc, id)             // { id, name, parent, preset, owner, components, groups, inbox } or null; Counters -> numbers, ImmutableString -> string
export function effectiveComponents(doc, id)    // preset chain -> own -> active groups, plain copy (null removes)
export function listEntities(doc, { has, tags, name, parent } = {})   // [entityData]
export function presetData(doc, name)           // plain
export function hp(health)                      // max - damage, clamped to [0, max]
export function docSummary(doc)                 // { entities: n, presets: [names], components: [names], systems: [names], world }

// src/doc/validate.js
export function validateComponent(def, data)    // against def.schema (JSON-Schema subset: object/number/string/boolean/enum/array/nested); returns [] or problems
export function validateFilter(filter, componentDefs)
```

### 3.2 Track A — core, sim, scripts

```js
// src/core/world.js
export class World {
  constructor({ peerId })
  registerComponent(name, { order = 0, add, change, remove })   // lifecycle hooks: add(e, data, world), change(e, data, prev, world), remove(e, world)
  unregisterComponent(name)
  addSystem({ name, order, query, update })      // update(world, dt, entities?)
  removeSystem(name)
  query(...terms)                                // 'a', 'b', '!c' -> live Set<entity> (cached)
  load(doc)                                      // full reconcile
  applyPatches(doc, patches)                     // dirty ids from patch paths + preset/group invalidation, then reconcile
  get(id)                                        // entity or undefined
  has(id, component)
  addLocal(id, { name, components })             // local-only entities (players), same shape, not in the doc
  removeLocal(id)
  setOwnership({ owns, owner })                  // injected by net; defaults: owns -> true (single player)
  owns(id)
  owner(id)
  queueOps(ops)                                  // durable effects from systems; flushed by the app each tick via applyOps
  drainOps()                                     // -> ops[] and clears
  tick(dt)                                       // run systems in order
  entities                                       // Map<id, entity>
}
// entity = { id, c: {frozen effective components}, live: {}, groups: Set, preset, owner, local: bool }
// live keys used by built-ins: p[3], v[3], yaw, sensed[], intent{act,target,from,speedMul,drive}, input[2], desired[2],
//                               anim (string), cooldown, mountSeat, rand(), wanderA

// src/core/tick.js
export function makeTicker({ hz = 30, maxSteps = 4, step })   // -> { advance(nowMs) -> alpha(0..1), hz }

// src/core/filters.js
export function compileFilter(filter)           // -> (ctx: { self, other, world }) => boolean ; structured JSON only (design §3.3)
export const RELATIONS                          // { targetsMe, myRider, myMount, isMounted }

// src/core/events.js
export function makeEvents()                    // { emit(ev), events(type?), swap() } — double-buffered per tick

// src/sim/index.js
export const ORDER                              // { lifecycle:0, perceive:100, decide:200, control:300, steer:400, integrate:500, mount:600, attack:700, health:800, events:900, scripts:950, animate:1000, net:1100 }
export function installSim(world, { inputs, ground, events })
//   inputs: () => Map<entityId, { move:[x,z], look?, actions? }>   (players / puppets; provided by the app)
//   ground: (x, z) => y                                              (provided by render; default () => 0)
//   installs every built-in system; respects doc.world.disabledSystems
export function simHash(world)                  // deterministic hash of every owned entity's live pose + intent (tests)

// src/scripts/lower.js
export function lowerModule(source)             // 'export default {...}' module text -> script text returning the object; throws SyntaxError on anything else
// src/scripts/world-api.js
export function makeScriptWorld(world, { log, rand, time })   // hardened API of design §7.2
// src/scripts/host.js
export function makeSystemHost({ world, makeCompartment, log })
//   -> { sync(doc) -> report[], tick(dt), status() -> [{ name, order, enabled, ok, suspended, errors, lastError, compileMs }], setEnabled(bool), enabled }
//   makeCompartment: (endowments) => ({ evaluate(src) })   — the app passes new Compartment(...) under lockdown; tests pass a Function-based stand-in
```

### 3.3 Track C — render and xr

```js
// src/render/scene.js
export function makeScene({ canvas, world })    // -> { renderer, scene, camera, resize(), render(), setWorldSettings(worldSettings), ground(x, z) }
                                                // renderer.xr.enabled = true; one setAnimationLoop owned by main.js

// src/render/resources.js
export function makeResources()                 // { texture(key, make), geometry(key, make), release(key), emojiTexture(char, px), stats() }

// src/render/kinds/index.js
export const KINDS                              // open registry { billboard, primitive, tree, model, critter }: each { create(data, ctx), update(obj, data, prev, ctx) -> false|void, dispose(obj, ctx), anim?(obj, state, dt) }
export function registerKind(name, handler)

// src/render/reconciler.js
export function makeReconciler({ world, scene, resources })
//   registers component handlers on world for: transform (order -100), representation, light, animation
//   -> { objectFor(id) -> Object3D|undefined, idOf(object3d) -> id|undefined, update(dt, alpha), pick(raycaster) -> { id, point, object } | null,
//        rootOf(id), dispose() }
//   update(): copies entity.live.p/yaw into roots for entities with live poses, advances mixers from live.anim

// src/xr/rig.js
export const EYE_HEIGHT
export class PlayerRig { constructor(renderer, camera); root; head; hands[]; look(dYaw, dPitch); snapTurn(a); move(forward, strafe, dt, speed); teleport(v3); mount(seatObject3d); dismount(); get presenting; pose() -> { p:[3], yaw, head:[7], hands:[[7],[7]] } }
// src/xr/pointer.js
export function makePointers({ renderer, camera, rig, dom })  // -> { list(): Pointer[], update() }   Pointer = { id:'mouse'|'xr-0'|'xr-1', ray: Raycaster, down, pressed, released, squeeze }
// src/xr/vr-button.js
export function makeVRButton(renderer, { onSession })          // DOM button, hidden unless immersive-vr supported
// src/xr/controllers.js
export function makeControllers(rig, { onMove, onSnapTurn, onSelect, onSqueeze, onMenu })   // thumbsticks / buttons -> callbacks; procedural meshes
// src/xr/interact.js
export function makeInteraction({ world, reconciler, pointers, rig, commit, onSelect })
//   hover/select/grab/drag/ride; preview locally each frame; commit(ops, { message }) on release (and <=10 Hz during long drags)
//   -> { update(dt), selected, select(id), grab(id), release(), mount(id), dismount() }
```

### 3.4 Track B — net and agent

```js
// src/net/repo.js
export const DEFAULT_SYNC
export function openRepo(sync = DEFAULT_SYNC)   // -> Promise<{ repo, ws, sync }>  (copy of tails-and-scales)
// src/net/link.js
export function parseLink(hashOrUrl)            // -> { docUrl, key, sync, heads, safe }
export function buildLink({ docUrl, key, sync, heads }, base = location)
export function newKey()
export function peerIdFor()                     // stable per tab (sessionStorage), 'p_' + random
// src/net/presence.js
export function makePresence(handle, { peerId, info, heartbeatMs = 2000, liveMs = 6000 })
//   -> { peers() -> Map<peerId, { info, last }>, isLive(peerId), host() -> peerId, set(info), on(fn) -> off, stop() }
// src/net/ownership.js
export function makeOwnership({ presence, world, peerId, hysteresisMs = 3000 })
//   -> { owner(id), owns(id), pin(id), unpin(id) }   // pin/unpin return ops (the app applies them)
// src/net/stream.js
export function makePoseStream(handle, { world, peerId, owns, hz = 10, playerHz = 20 })
//   -> { tick(nowMs), apply(nowMs) (interpolated remote poses -> live), stop() }
//   wire: { t:1, from, time, ids?: [..], poses: Float32Array([idIndex, x,y,z, yaw, animCode]*) } — exact format from spike S2
// src/net/checkpoint.js
export function makeCheckpointer({ world, owns, everyMs = 3000, minMove = 0.1, flush })   // flush(ops) ; -> { tick(nowMs), flushNow() }

// src/agent/transport.js   (from research/captp/lib/transport.mjs, adapted to ride the scene doc's channel)
export function hostCapTP(channel, roles, { log })        // channel: { broadcast(msg), on('ephemeral-message', fn), off } — a DocHandle or a BroadcastChannel wrapper
export function connectCapTP(channel, key, { timeoutMs, local })
export function deriveSecret(secret, label); export function aesKey(secret, docId)
export function broadcastChannelFor(docId)                 // same-origin wrapper with the same channel shape
// src/agent/world-caps.js
export function makeWorldCaps({ handle, applyOps, read, world, systemHost, extras })   // -> { world: Far World, viewer: Far WorldView }
// src/agent/host.js
export function startAgentHost({ handle, key, caps, log })  // wires ephemeral + BroadcastChannel transports; -> { sessions(), revoke(role), stop() }

// agent/lib/connect.mjs (Node)
export async function connect(link, { timeoutMs = 8000 })   // -> { world (Far or local), mode: 'live'|'local', handle, close() }
// agent/mcp.mjs  — stdio MCP server (tools per design §6.3); MERGE_MEADOW_LINK env or `connect` tool
// agent/cli.mjs  — node agent/cli.mjs "<link>" <verb> [...args]
```

### 3.5 Track D — app and editor

```js
// src/boot/lockdown.js — first <script type="module"> in index.html; imports 'ses', calls lockdown(...), sets globalThis.__mmLockedDown = true
// main.js — composition root (order matters):
//   1 parse link (or create a new doc and rewrite the hash)  2 openRepo  3 find/create handle, seedDoc on create
//   4 World + installSim + makeSystemHost  5 makeScene + makeReconciler + rig/pointers/controllers/interaction
//   6 presence/ownership/stream/checkpointer  7 startAgentHost  8 makeEditor  9 the loop:
//      animationLoop(now): alpha = ticker.advance(now) [each step: stream.apply, world.tick, systemHost.tick, flush world.drainOps via applyOps, stream.tick, checkpointer.tick]
//                          interaction.update, reconciler.update(dt, alpha), editor.frame(), scene.render()
//   handle.on('change', ({doc, patches}) => { world.applyPatches(doc, patches); systemHost.sync(doc); editor.docChanged(patches) })

// src/editor/app.js
export function makeEditor({ root, world, handle, applyOps, read, reconciler, interaction, rig, presence, systemHost, agent, link, undo })
//   -> { frame(), docChanged(patches), select(id), toast(msg, level), destroy() }
// src/editor/forms.js
export function renderForm(container, { schema, value, onChange })     // JSON-Schema subset -> inputs; onChange(path, value)
// src/editor/undo.js
export function makeUndo({ applyOps })                                  // { record(inverse, message), undo(), redo(), canUndo, canRedo }
```

## 4. Doc shape (normative)

See design §2.1. Entity:

```js
{ name: ImmutableString, parent: ImmutableString, preset: ImmutableString, owner: ImmutableString,
  components: { transform: { p:[x,y,z], r:[xDeg,yDeg,zDeg], s:[x,y,z] }, ...},
  groups: { [name]: true }, inbox: [ { type: ImmutableString, from: ImmutableString, amount, t } ] }
```

Doc systems: `{ source: Text, order: 950, enabled: true, rev: n }`; source is an
ES-module string exporting `default { init(world, hot), update(world, dt), on(ev, world), dispose(hot) }`.

## 5. How the tracks meet

`main.js` (track D) is written against §3 from day one with stubs where a
track's module does not exist yet. Integration replaces stubs with the real
modules, runs `npm test` per track, then `test/e2e.mjs`. Mismatches are fixed
in the track that owns the module, against this contract; the contract is
amended only by the PM, with the reason recorded in `STATUS.md`.
