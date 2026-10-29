# merge-meadow — architecture contract

This file is the contract between the parallel build tracks. Each track owns
the directories listed in §1 and may not change another track's files;
anything it needs from another track is requested through the interfaces in
§3. The design and its reasons live in
[`docs/design-merge-meadow.md`](../../docs/design-merge-meadow.md) — read it
first, including §16 (the amendments the four integration spikes forced);
this file only pins down what the code must look like so four tracks can
build at once and meet in `main.js`.

Vocabulary: **doc** = the Automerge document (authored state); **world** = the
ECS mirror of the doc plus per-entity `live` state; **ops** = the only way
anything writes to the doc; **owner** = the one peer that simulates an entity.

## 1. Layout and ownership

```
packages/merge-meadow/
  package.json vite.config.js          (PM; dependencies are pre-declared, nobody runs npm install)
  ARCHITECTURE.md README.md STATUS.md  (PM / integration)
  index.html main.js style.css         track D
  src/boot/entry.js lockdown.js        track D   the ONE module script: static lockdown, dynamic import(main)
  src/doc/                             track A   schema, seed, presets, ops, read, validate, watch
  src/core/                            track A   world (ECS), tick, filters, events
  src/sim/                             track A   the built-in systems
  src/scripts/                         track A   doc-stored systems: lower, compartment host, script world API, safe-mode marker
  src/net/                             track B   repo, link, presence, ownership, pose stream, checkpoints
  src/agent/                           track B   captp caps, sealed transport, page-side host, BroadcastChannel handle
  agent/                               track B   Node: lib/connect.mjs, lib/tools.mjs, mcp.mjs, cli.mjs
  public/agent.js                      track B   same-origin page-tool guest (claude-code-web custom tool)
  src/render/                          track C   scene, reconciler, resources, animation, kinds/*, emoji/*
  src/xr/                              track C   rig, pointer, controllers, vr-button, interact
  src/editor/                          track D   DOM editor panels, forms, kind switcher, undo, share, agent panel
  test/unit/<a|b|c|d>-*.test.mjs       each track, node --test, no browser
  test/e2e.mjs test/xr.mjs             integration (C seeds xr.mjs)
  scripts/boundaries.mjs               track A   import-boundary lint (§2)
```

## 2. Rules every track follows

1. **Only authored state goes in the doc; never per-frame state.** Systems
   write `entity.live`; durable effects are queued as ops and flushed once per
   tick by the app. (One Automerge write ≈ 70 µs and ~3 bytes of permanent
   history; 300 poses per frame would be 60 ms per change.)
2. **One write path.** Everything that changes the doc is an op list through
   `applyOps` (§3.1). No `handle.change` anywhere else.
3. **One read path for consumers.** Every doc subscriber uses
   `watch(handle, fn)` (§3.1), never `handle.on('change')` directly: a throwing
   listener stops automerge-repo 2.5.6 advancing its patch base (measured),
   after which later events net out.
4. **Reads that leave the core are fresh plain data.** `world` deep-freezes
   component data it ingests. Code that hands data to the editor, the agent or
   a script returns copies from `src/doc/read.js`, never a doc proxy, never a
   three object. (CapTP's marshal hardens what it sends: a live `Vector3`
   returned once froze `Vector3.prototype` in the spike.)
5. **Enums, ids and URLs are `ImmutableString`** — the fixed list is
   `name, parent, preset, owner, type, from, kind, rig, shape, image, url, act`
   plus every key of `tags`/`groups` maps; compare with `String(x)`. Health is
   a ledger `{max, armor, hits: {[hitId]: amount}}`; hp via `read.hp()`.
6. **`set` merges fields; `replace` swaps identity.** Inspector and agent
   edits are `set`. `replace` is for kind swaps and explicit redefinition.
7. **Key order is not preserved.** Sort by key or `order` before iterating
   anything that affects behaviour (drives, groups, systems, components).
8. **Module boundaries** (enforced by `scripts/boundaries.mjs`, run in
   `npm test`):
   - `src/doc`, `src/core`, `src/sim`, `src/scripts` import no `three`, no
     DOM globals (`document`, `window`, `requestAnimationFrame`), no
     `@automerge/*-repo*`. `src/doc` may import `@automerge/automerge/slim`
     (`Counter`, `ImmutableString`, `updateText`, `diff`, `getHeads`).
     `src/scripts/safe-mode.js` may touch `localStorage` behind a guard.
   - only `src/render` and `src/xr` import `three`.
   - only `src/net`, `src/agent` and `agent/` import `@automerge/*-repo*`.
   - `src/editor` imports nothing from `three`; it talks to the scene through
     `reconciler` and `interaction` (§3.3).
9. **Every public function in §3 has a unit test in its track**, runnable
   with `node --test` and no browser. Tracks C and D test what they can in
   Node (pure helpers) and leave browser checks to `test/e2e.mjs`.
10. **No dependency changes.** A track that needs another package reports it
    in its result; the PM adds it.
11. **Lockdown-safe code.** The page runs under SES `lockdown()`
    (`overrideTaming: 'severe'`). Do not assign to built-in prototypes, do
    not rely on `Object.prototype` being writable, do not use `Function()` or
    `eval`, do not check `constructor.name` (minification). Objects you intend
    to mutate later must not pass through `harden`. No top-level `await` in
    page code (the shared Vite config has no es2022 target).
12. **Determinism inside a peer.** Systems use `world.rand()` (seeded per
    entity/tick) and `world.time`; a Compartment's `Math.random`/`Date.now`
    throw by design.

## 3. Interfaces

Signatures are JS; types are in comments. Options objects may grow with
defaults; positional parameters may not change.

### 3.1 Track A — doc

```js
// src/doc/schema.js
export const SCHEMA_VERSION = 1
export const IMMUTABLE_KEYS                     // the §2.5 list
export function newId(prefix = 'e')            // 'prefix-xxxxx', url-safe
export function isName(s)                       // /^[A-Za-z_][A-Za-z0-9_-]{0,63}$/
export function initDoc(d, { title })           // mutate a fresh doc proxy into schema v1 (empty maps, meta, world)
export function migrate(d)                      // no-op at v1

// src/doc/presets.js
export const COMPONENT_DEFS                     // { [name]: { description, order, defaults, schema } }  (seed of doc.components; representation kinds' schemas come from track C's KINDS but the def for 'representation' here lists kind as an enum of the five names)
export const PRESETS                            // { creature, trex, sheep, horse, tree, rock, lamp } (seed of doc.presets; design §3.3)
export function effectiveComponents(doc, idOrEntity)   // preset chain (extends) -> own -> active groups; null removes; PLAIN copy? no: returns doc-backed references (structural sharing) for the world; read.js wraps in plain()

// src/doc/seed.js
export function seedDoc(d, { title })           // initDoc + COMPONENT_DEFS + PRESETS + starter scene: ground/sky settings, 6 trees, 2 rocks, 1 lamp, 1 trex, 3 sheep, 1 horse (positions spread over ±15 m)

// src/doc/ops.js   — THE write path. Pure on the doc proxy so Node and browser share it.
//   ops: spawn {preset?, name?, components?, parent?, at?: [x,y,z], id?}  despawn {id}
//        set {id, component, patch}   replace {id, component, data}   remove {id, component}
//        define {id, entity}  setParent {id, parent}  setName {id, name}
//        addGroup / removeGroup {id, group}   push {id, event}  drain {id, eventIds}
//        hit {id, hitId, amount}   pin {id, owner, ifOwner?}  unpin {id, ifOwner}
//        checkpoint {id, p, r}     transform {id, p?, r?, s?}
//        definePreset {name, preset} removePreset {name}  defineComponent {name, def} removeComponent {name}
//        defineSystem {name, source, order?, enabled?}  setSystem {name, patch}  removeSystem {name}
//        setWorld {patch}  setMeta {patch}
//   batches may reference earlier spawn results as '$0', '$1' in id fields
export function validateOps(doc, ops, { componentDefs } = {})   // -> [] or throws TypeError listing every problem (names, filters, schemas, missing ids); must not mutate
export function changeDoc(d, ops, ctx = {})     // apply inside a change; returns { results, inverse }; re-reads proxies after every assignment ((d.a ||= {})[k] = v writes into the literal, not the doc)
export function applyOps(handle, ops, { message, peerId, checkSource } = {})
                                                // validateOps(handle.doc(), ops) then handle.change(d => changeDoc(d, ops, ctx)); returns { results, inverse }
                                                // checkSource(source): throws before the change if a defineSystem source does not compile (injected by the app)
// results[i]: spawn -> id; define -> { changed: [paths] }; others -> true

// src/doc/read.js   — every read that leaves the core goes through here
export function plain(x)                        // deep copy: Counter -> number, ImmutableString -> string, Text -> string (instanceof, never constructor.name)
export function entityData(doc, id)             // { id, name, parent, preset, owner, components (own), effective (resolved), groups: [names], inbox: {...} } or null
export function listEntities(doc, { has, tags, name, parent, preset } = {})   // filters on EFFECTIVE components; returns entityData rows
export function presetData(doc, name)
export function hp(health)                      // max - Σ max(0, amount - armor), clamped to [0, max]
export function docSummary(doc)                 // { title, entities: n, presets: [names], components: [names], systems: [{name, order, enabled, rev}], world }

// src/doc/watch.js
export function watch(handle, fn, { immediate = true } = {})
//   subscribes to handle 'change' + 'delete'; keeps its own last heads; calls fn({ doc, patches, heads }) with patches = Automerge.diff(doc, lastHeads, heads)
//   wraps fn in try/catch and reports to console.error; returns unsubscribe()

// src/doc/validate.js
export function validateComponent(def, data)    // JSON-Schema subset: object/number(min,max,step)/string/boolean/enum/array of numbers or strings/nested object; x-immutable, x-json honoured; returns problems[]
export function validateFilter(filter, componentDefs)   // problems[]
export function validateSystemMeta({ order, enabled })
```

### 3.2 Track A — core, sim, scripts

```js
// src/core/world.js
export class World {
  constructor({ peerId = 'local' } = {})
  registerComponent(name, { order = 0, add, change, remove })   // add(e, data, world), change(e, data, prev, world), remove(e, world)
  unregisterComponent(name)
  addSystem({ name, order, query, update })      // update(world, dt, entities?)
  removeSystem(name)
  query(...terms)                                // 'a', 'b', '!c' -> live Set<entity> (cached)
  load(doc)                                      // full reconcile
  applyPatches(doc, patches)                     // dirty ids from patch paths (+ presets -> instances, + components defs), then reconcile
  get(id)
  has(id, component)
  addLocal(id, { name, components })             // local-only entities (players): same shape, local: true
  removeLocal(id)
  setOwnership({ owns, owner })                  // injected by net; default owns -> true, owner -> peerId
  owns(id); owner(id)
  queueOps(ops); drainOps()                      // durable effects from systems; flushed by the app each tick via applyOps
  tick(dt)                                       // run systems in order (skips names in doc.world.disabledSystems)
  rand(id)                                       // deterministic per entity+tick (xorshift seeded from id hash + tick count)
  time; tickCount; entities /* Map */; doc
}
// entity = { id, c: {frozen effective components}, live: {}, groups: Set, preset, owner, local }
// live keys used by built-ins: p[3], v[3], yaw, sensed[], intent{act,target,from,speedMul,drive,score}, input{move:[x,z]}, desired[2],
//                               anim (string), cooldown, hitSeq, wanderA, ground

// src/core/tick.js
export function makeTicker({ hz = 30, maxSteps = 4, step })   // -> { advance(nowMs) -> alpha, hz, dt }

// src/core/filters.js
export function compileFilter(filter)           // -> (ctx: { self, other, world }) => boolean   (structured JSON, design §3.3)
export const RELATIONS                          // { targetsMe, myRider, myMount, isMounted }

// src/core/events.js
export function makeEvents()                    // { emit(ev), events(type?), swap() } — double-buffered per tick

// src/sim/index.js
export const ORDER                              // { lifecycle:0, perceive:100, decide:200, control:300, steer:400, integrate:500, mount:600, attack:700, health:800, events:900, scripts:950, animate:1000, net:1100 }
export function installSim(world, { inputs, ground, events, peerId })
//   inputs: () => Map<entityId, { move:[x,z] }>   ground: (x, z) => y
//   attack: writes `hit` ops (hitId = `${peerId}:${seq}`) for the victim; health: owner of victim observes hp<=0 -> addGroup dead (+ emits died once); inbox: owner drains `move` etc.
export function simHash(world)                  // deterministic hash of owned entities' live p/yaw/intent (tests)
export function explain(world, id)              // { owner, intent, drives: [{name, score, target}], sensed: n, hp } plain

// src/scripts/lower.js
export function lowerModule(source)             // 'export default {...}' -> script returning the object; SyntaxError otherwise
// src/scripts/world-api.js
export function makeScriptWorld(world, { log }) // hardened API of design §7.2 (query/get/owns/nearby/spawn/despawn/set/emit/events/rand/time/dt/log)
// src/scripts/host.js
export function makeSystemHost({ world, makeCompartment, log })
//   -> { sync(doc) -> report[], tick(dt), status() -> [{ name, order, enabled, ok, suspended, errors, lastError, compileMs, rev }], setEnabled(bool), enabled, check(source) }
//   makeCompartment: (endowments) => ({ evaluate(src) }); tests pass a Function-based stand-in; the app passes new Compartment under lockdown
// src/scripts/safe-mode.js
export function makeSafeMode({ docId, systemsHash, storage = globalThis.localStorage })   // { shouldStartSafe(), arm(), disarm(), onPageShow(), onPageHide() }
```

### 3.3 Track C — render and xr

```js
// src/render/scene.js
export function makeScene({ canvas, pixelRatio })   // -> { renderer, scene, camera, resize(), render(), applyWorldSettings(world), ground(x, z) -> y, dispose() }
                                                // renderer.xr.enabled = true; the animation loop is owned by main.js

// src/render/resources.js
export function makeResources()                 // { acquire(key, make), release(key), use(obj, key, value), releaseAll(obj), emojiTexture(char, px), hasColorEmoji(), stats() }
export const EMOJI_FONT

// src/render/kinds/index.js
export const KINDS                              // open registry { billboard, primitive, tree, model, critter }: each { schema, defaults, create(data, ctx), update(obj, data, prev, ctx) -> false|void, dispose(obj, ctx), anchors?(obj) -> { seat, head } }
export function registerKind(name, handler)

// src/render/animation.js
export function makeAnimator(root, clips)       // { set(state, { fade }), update(dt), dispose() } with the fallback chain of design §8

// src/render/reconciler.js
export function makeReconciler({ world, scene, resources, plain })
//   registers component handlers on world: transform (order -100), representation, light; `animation` is read per frame
//   -> { objectFor(id), idOf(object3d), frame(dt, alpha), pick(raycaster) -> { id, point, object } | null, anchor(id, name) -> Vector3 | null, dispose() }

// src/xr/rig.js
export const EYE_HEIGHT
export class PlayerRig { constructor(renderer, camera); root; head; hands[]; look(dYaw, dPitch); snapTurn(a); move(forward, strafe, dt, speed); teleport(v3); mount(seatObject3d); dismount(); get presenting; pose() -> { p:[3], yaw, head:[7], hands:[[7]|null,[7]|null] } }
// src/xr/pointer.js
export function makePointers({ renderer, camera, rig, dom })  // -> { list(): Pointer[], update() }   Pointer = { id:'mouse'|'xr-0'|'xr-1', ray: Raycaster, down, pressed, released, squeeze, squeezed }
// src/xr/vr-button.js
export function makeVRButton(renderer, { onSessionStart, onSessionEnd })   // DOM button; hidden unless immersive-vr is supported
// src/xr/controllers.js
export function makeControllers(rig, { onMove, onSnapTurn, onSelect, onSqueeze, onMenu })   // procedural meshes, thumbsticks/buttons -> callbacks
// src/xr/interact.js
export function makeInteraction({ world, reconciler, pointers, rig, commit, canGrab, onSelect })
//   hover/select/grab/drag/ride; preview locally; commit(ops, { message }) on release and <=10 Hz during long drags; canGrab(id) -> true | 'held by X' (from ownership)
//   -> { update(dt), selected, select(id), grab(id), release(), abort(), mount(id), dismount() }
```

### 3.4 Track B — net and agent

```js
// src/net/repo.js
export const DEFAULT_SYNC
export function openRepo(sync = DEFAULT_SYNC)   // -> Promise<{ repo, ws, sync }>  (tails-and-scales pattern, IndexedDB store 'merge-meadow')
export async function findDoc(repo, docUrl, { tries = 8, backoffMs = 400, onWait })   // retries 'unavailable' (share-link race)
export function serverStorageId(ws)             // for synced()
// src/net/link.js
export function parseLink(hashOrUrl)            // -> { docUrl, key, view, sync, heads, safe }
export function buildLink({ docUrl, key, view, sync, heads }, base = location)
export function newKey(); export function peerIdFor()   // 'p_' + random, stable per tab (sessionStorage)
// src/net/presence.js
export function makePresence(handle, { peerId, info, heartbeatMs = 2000, liveMs = 6000, streamTtlMs = 2500, now })
//   any ephemeral message refreshes liveness; hello -> instant reply; bye on pagehide; host election with the design §4.1 candidate rule
//   -> { peers() -> Map<peerId, { info, last, streaming }>, isLive(peerId), host() -> peerId|null, set(info), on(fn) -> off, hello(), bye(), noteMessage(peerId, kind), stop() }
// src/net/ownership.js
export function makeOwnership({ presence, world, peerId })
//   -> { update() -> { gained: [ids], lost: [ids] }, owner(id), owns(id), pinOps(id) -> ops, unpinOps(id) -> ops, canGrab(id) -> true | 'held by <peer>' }
// src/net/stream.js
export function makePoseStream(handle, { world, peerId, owns, hz = 10, playerHz = 20, delayMs = 120, now })
//   frame { t:'po', k, ts, f: Float32Array[idx,x,y,z,yaw,anim]×N, ids? }; table on change + hello + every 10th frame
//   -> { tick(nowMs) (broadcast owned), apply(nowMs) (interpolated remote -> live), hold(id, pose), forget(id), onFrame(fn), stop() }
// src/net/checkpoint.js
export function makeCheckpointer({ world, owns, everyMs = 3000, minMove = 0.1, minTurnDeg = 5, flush })   // flush(ops); -> { tick(nowMs), flushNow() }

// src/agent/transport.js   (S3's transport: duplicate drop, fin, idle sessions)
export function hostCapTP(channel, roles, { log, idleMs })   // channel = DocHandle or bcHandle: { broadcast(msg), on('ephemeral-message', fn), off }
export function connectCapTP(channel, key, { timeoutMs, local })
export function deriveSecret(secret, label); export function aesKey(secret, docId)
// src/agent/bc-handle.js
export function bcHandle(docId)                 // BroadcastChannel wrapper with the DocHandle surface
// src/agent/world-caps.js
export function makeWorldCaps(handle, { applyOps, read, checkSource, host, mode })   // host = { capture, logs, eval, explain, systems } injected by the page; -> { world: Far World, viewer: Far WorldView }
// src/agent/host.js
export function startAgentHost({ handle, docId, key, caps, log })   // editor + viewer roles; ephemeral + BroadcastChannel; -> { sessions(), revoke(role), stop() }

// agent/lib/connect.mjs (Node; imports 'ses/assert-shim.js' and '@endo/eventual-send/shim.js' first)
export async function connect(link, { hostTimeoutMs = 1500, openRepo })   // -> { world, mode: 'live'|'local', fallbackReason, handle, synced(), close() }
// agent/lib/tools.mjs   — the one verb table (zod raw shapes + E(world) calls) shared by mcp.mjs and cli.mjs
// agent/mcp.mjs  — stdio MCP server; MERGE_MEADOW_LINK env or `connect` tool; every result carries { mode, fallbackReason }
// agent/cli.mjs  — node agent/cli.mjs "<link>" <verb> [...args] [--local]
// public/agent.js — guest over BroadcastChannel for a same-origin page tool
```

### 3.5 Track D — app and editor

```js
// src/boot/lockdown.js — import 'ses'; import '@endo/eventual-send/shim.js'; lockdown({ overrideTaming:'severe', errorTaming:'unsafe', consoleTaming:'unsafe' }); globalThis.__mmLockedDown = true
// src/boot/entry.js    — import './lockdown.js'; import('../../main.js').catch(showBootError)   (the ONLY module script in index.html)
// main.js — async boot(), composition root in this order:
//   1 parseLink (or create: seedDoc, rewrite hash)  2 openRepo + findDoc  3 World + installSim + makeSystemHost (Compartment) + safe mode
//   4 makeScene + makeReconciler + rig/pointers/controllers/interaction + VR button  5 presence/ownership/stream/checkpointer
//   6 startAgentHost (only with `key`)  7 makeEditor  8 watch(handle, ...) -> world.applyPatches, systemHost.sync, editor.docChanged
//   9 setAnimationLoop(now): alpha = ticker.advance(now) [each step: ownership.update -> stream.hold/forget, stream.apply, world.tick, systemHost.tick,
//      flush world.drainOps + queued editor ops via applyOps (one change), stream.tick, checkpointer.tick]; interaction.update; reconciler.frame; editor.frame; scene.render
//   Boot guard: if !Object.isFrozen(Array.prototype) -> systemHost.setEnabled(false) + banner.

// src/editor/app.js
export function makeEditor({ root, world, handle, applyOps, read, reconciler, interaction, rig, presence, ownership, systemHost, agentHost, link, undo, kinds })
//   -> { frame(), docChanged(patches), select(id), toast(msg, level), destroy() }
// src/editor/forms.js
export function renderForm(container, { schema, value, onPatch })      // JSON-Schema subset -> inputs; onPatch(path, value); honours x-immutable / x-json
// src/editor/kind-switcher.js
export function switchKindOps(entityId, current, targetKind, kinds)     // -> one replace op from target defaults + same-typed carried fields
// src/editor/undo.js
export function makeUndo({ applyOps })                                  // { record(inverse, message), undo(), redo(), canUndo, canRedo }
// src/editor/share.js
export function makeShare({ handle, link, repo })                       // { copyLink(), fork(), download(), open(file), versionLink(heads) }
```

## 4. Doc shape (normative)

Design §2.1 with §16. Entity:

```js
{ name, parent, preset, owner,                              // ImmutableString ('' = none)
  components: { transform: { p:[x,y,z], r:[xDeg,yDeg,zDeg], s:[x,y,z] }, health: { max, armor, hits: {} }, ... },
  groups: { [name]: true },
  inbox: { [eventId]: { type, from, ...data } } }
```

Doc systems: `{ source: Text, order: 950, enabled: true, rev: n }`; source is an
ES-module string exporting `default { init(world, hot), update(world, dt), on(ev, world), dispose(hot) }`.

## 5. How the tracks meet

`main.js` (track D) is written against §3 from day one. Integration wires
the real modules, runs `npm test` per track, then `test/e2e.mjs`. Mismatches
are fixed in the track that owns the module, against this contract; the
contract is amended only by the PM, with the reason recorded in `STATUS.md`.
