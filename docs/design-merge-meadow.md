# Merge Meadow — a shared, agent-editable three.js world

**Package:** `packages/merge-meadow` · **Status:** design v1.1 (2026-10-29): research done, four integration spikes done (§16 holds their amendments), implementation next
**One-liner:** A three.js scene whose entire authored state is an Automerge
document: open the link and you are in the same world as everyone else; edit
it from a desktop editor, from inside WebXR, or hand an AI agent a CapTP
capability and let it live-edit. Entities are JSON components; behaviour
emerges from components (add an aggressive T-rex, add a sheep, the T-rex
chases and the sheep flees); health, damage, mounts and NPCs are presets over
the same general vocabulary; and an entity's look can be upgraded in place
from a billboarded emoji to a mesh to an animated rig without touching its
behaviour.

This document is the system design. It is written from eight research
reports in [`research/merge-meadow/`](./research/merge-meadow/) — every
load-bearing number below was measured there with real code (Automerge 3.5,
automerge-repo 2.5.6, three r186, @endo/captp 4.5, SES 2.3, Vite 5, headless
Chromium, the public sync server). Where the reports disagreed, the decision
and its reason are stated inline.

## 0. Decisions in one screen

| question | decision | why (report) |
| --- | --- | --- |
| Pull in an engine? | **No.** Own core in vanilla ESM on plain three.js; borrow ideas | every candidate needs its own server, is GPL/closed, or fights "the doc is the truth" (prior-art) |
| Direct three API vs react-three-fiber vs JSON spec? | **JSON entity/component spec + hand-written reconciler.** three.js is touched only by the reconciler; R3F buys the agent nothing and costs 57–187 KB gz plus late disposal | scene-api: 0 leaks, 116 lines of glue, both imperative and declarative agent entry points are thin writers onto the doc |
| ECS library? | **Hand-rolled ~150-line doc-backed core** (A-Frame-style component lifecycle, live `Set` queries) | ecs: every library needed the same glue; becsy can't add types at runtime; sizes are noise next to Automerge's wasm |
| What goes in the doc? | **Authored state only.** Never per-frame state | one Automerge write ≈ 70 µs, 300 poses/frame = 60 ms/change and ~1 KB/frame of permanent history (ecs, automerge, scene-api, behaviors all measured it) |
| Live motion / avatars? | **automerge-repo ephemeral `broadcast()`** at 10–20 Hz from the entity's owner; rest-pose checkpoints into the doc every few seconds | public server delivered 100/100 ephemeral frames at 20 Hz, p50 19–42 ms, doc heads unchanged (webxr, automerge) |
| Who simulates what? | **One writer per entity.** Players own themselves, a ridden mount follows its rider's peer, everything else belongs to the elected host (lowest live peer id) or an explicit owner pin. Damage goes through the victim's inbox; only the victim's owner applies it | behaviors, prior-art, ecs: otherwise N peers apply damage N times |
| Behaviour vocabulary? | **`brain.drives`**: utility-scored drives with structured filters and a fixed set of steering verbs; presets with `extends`; component groups toggled by events | behaviors: T-rex/sheep/horse/rider emerged from ~10 general components; riderless horse fled with no code for it |
| Runtime extensibility? | Systems and component schemas **stored in the doc as source/JSON**, compiled per peer in **SES Compartments**, hot-swapped on change, errors isolated | runtime-extensibility: peer B ran peer A's new system 89 ms later; `new Function` on the shared `kumavis.github.io` origin is unacceptable (localStorage of other apps) |
| Where do sandboxed systems run? | **Main thread under `lockdown()` in v1**, behind a `SystemHost` interface so a Worker host can replace it | spike S1 measured the real cost: matrix math 0.048→0.095 ms/frame at 300 objects, 0.58→1.0 ms at 3000; `renderer.render` of 300 sprites 0.55→0.89 ms; `lockdown()` 10–14 ms. A Worker doubles the architecture (two mirrors, async editor). Revisit if scenes grow |
| Agent interface? | **@endo/captp**, Far `World`/`Entity` objects over the same ops module the editor uses; **transport = sealed frames over the scene doc's ephemeral channel** (public server), plus BroadcastChannel for same-origin page tools; **a stdio MCP server and a one-shot CLI** ship in the package | spike S3 ran the whole chain: MCP tool call through a rendering browser host p50 87–117 ms, a batch of 50 ops 145 ms, BroadcastChannel 1–30 ms (bounded by the host's frame time) |
| Security posture? | The doc URL **is** edit access (public server has no auth). The agent secret in the link fragment gates only what the live page exposes beyond the doc (`capture`, `logs`, `eval`). Page runs under SES; doc-stored code never sees three, DOM or handles | captp, runtime-extensibility, automerge |
| Desktop + XR? | One `PlayerRig`, one `Pointer` abstraction, `renderer.xr.enabled` always, **three@0.186.1**, custom Enter-VR button hidden unless `immersive-vr` is supported; players are local entities fed by presence, not doc entities | webxr: `Raycaster.setFromXRController` needs ≥0.162; the stock VRButton's "not supported" pill lands in thumbnails |

## 1. Three planes of data

```
┌─ DOC (Automerge, durable, synced, versioned) ───────────────────────────────┐
│ entities (components, presets, groups, inbox), presets, component schemas,  │
│ system source, assets, world settings.  Changed at EDIT rate.               │
└──────────────────────────────────────────────────────────────────────────────┘
┌─ EPHEMERAL (automerge-repo broadcast; lost when nobody listens) ────────────┐
│ presence (peer id, name, colour, XR head/hands), live poses + anim state of  │
│ owned entities at 10–20 Hz, ownership claims, CapTP frames (sealed).        │
└──────────────────────────────────────────────────────────────────────────────┘
┌─ LOCAL (per peer, derived, never leaves the tab) ───────────────────────────┐
│ three.js objects, ECS `live` state (pose, velocity, intent, targets, anim), │
│ caches, undo stack, compiled systems, editor selection.                     │
└──────────────────────────────────────────────────────────────────────────────┘
```

Rule that everything else follows from: **a thing goes in the doc if a late
joiner must see it and a human or agent authored it.** Where an NPC *is right
now* is simulation output; where it *was last parked* is a checkpoint the owner
writes every few seconds, so a late joiner starts close to the truth and the
doc grows by kilobytes per minute, not megabytes.

## 2. The document

Pinned exactly like `packages/tails-and-scales`: `@automerge/automerge@3.5.0`,
every `@automerge/automerge-repo*@2.5.6` (npm's `latest` tag is a prerelease).
Slim entry, wasm via `?url` + `initializeWasm`, IndexedDB storage,
BroadcastChannel + WebSocket (`wss://sync.automerge.org`, `&sync=` override).
`net/repo.js` is a copy of tails-and-scales' bootstrap.

### 2.1 Schema v1

```js
{
  schema: 1,
  meta:   { title: ImmutableString, created: number },
  world:  { bounds: 40, ground: { color }, sky: { color }, disabledSystems: { name: true } },
  entities: {
    [id]: {                                   // id: short random, e.g. "trex-k3f9a"
      name:    ImmutableString,
      parent:  ImmutableString,               // '' = scene root; flat map + parent pointer, never nested arrays
      preset:  ImmutableString,               // '' or a key of doc.presets
      owner:   ImmutableString,               // '' or a peer id: an optional ownership pin
      components: { [name]: { ...plain JSON } },   // e.g. transform, body, brain, health, representation
      groups:  { [name]: true },              // active component groups (see 3.3)
      inbox:   [ { type, from, amount, t } ], // events for this entity's owner to drain (see 4.3)
    }
  },
  presets:    { [name]: { extends: '', components: {...}, groups: { [g]: { components: {...}, remove: [names] } } } },
  components: { [name]: { description, order, schema: <JSON-Schema subset>, defaults: {...} } },
  systems:    { [name]: { source: Text, order: 950, enabled: true, rev: 3 } },
  assets:     { [name]: { kind: 'image'|'model', url: ImmutableString } },
}
```

### 2.2 Modelling rules (all verified against Automerge merges)

- **Transform is a component** `transform: { p:[x,y,z], r:[xDeg,yDeg,zDeg], s:[x,y,z] }`
  registered with order −100 so its lifecycle hook runs before anything that
  needs the entity's root object. Per-axis list writes merge sanely for
  position and scale; rotation is Euler degrees because quaternion components
  edited concurrently merge into a non-unit rotation (norm 1.225).
- **Never store a 4×4 matrix or three's `toJSON`.** Concurrent edits produce a
  skewed matrix neither peer wrote; `toJSON` costs ~500 ms per edit at 300
  entities and patches arrive addressed by array index.
- **Enums, ids and URLs are `ImmutableString`.** A plain string is
  collaborative text: concurrent edits interleave ("T-Rexy"), and every edit
  arrives as `put ""` + `splice` patches. Code compares with `String(x)`.
- **Health is a ledger: `health: { max, armor, hits: { [hitId]: amount } }`**;
  hp = `max − Σ max(0, amount − armor)`, clamped on read. Hit ids are
  `<peerId>:<seq>`. A plain number loses concurrent hits; a Counter sums them but
  double-applies when two partitioned owners drain the same inbox entry (spike
  S2 saw it happen); a keyed put is idempotent and costs 2.6 bytes per hit.
- **Sets are maps of `true`** (`tags: { prey: true }`, `groups`), so
  concurrent adds both survive.
- **`set` merges fields, `replace` swaps identity.** A wholesale component
  replace wins over a concurrent field edit and drops it. The inspector and
  agent `set` write field by field; `replace` is reserved for *meaning*
  changes — swapping `representation.kind`, or an explicit "define this
  entity" that deep-diffs and never assigns.
- **Delete wins over nested edits**, but a concurrent re-put of a whole
  component wins over its delete. Renderers must tolerate two visual
  components coexisting briefly; the editor surfaces it.
- **System source is `Text`**, edited through `updateText`, never assigned as
  a whole string, so two people editing one system merge by characters.
- **Key order is not preserved.** Any iteration over drives, groups, systems
  or components that affects behaviour sorts by key or by an explicit `order`.

### 2.3 Links, saving, versions

- **Share:** `…/merge-meadow/#doc=automerge:<id>&key=<secret>` — the doc URL is
  the edit capability; `key` is the agent secret (§6). A link without `key`
  opens the same editable world but no agent can attach through that tab. A
  view link is `#doc=…&view=<HKDF(key,'view')>`: the role lives in the
  parameter name so the agent's local fallback can attenuate without a host.
  The Share button enables only once the sync server holds the doc (a joiner
  opened earlier gets "unavailable" for ~6 s); joiners retry `find` with
  backoff and show "waiting for the world…".
- **Fork:** `repo.clone(handle)` → a new URL; also how "compact history" works
  (history only grows; ~2.7 bytes per small change, ~1 MB/hour if you commit
  50 entities at 2 Hz, which we don't).
- **Download / open:** `Automerge.save` bytes as a `.automerge` file; import.
- **Version link:** `&heads=<csv>` opens a read-only view at those heads
  (client-enforced only; the doc id still grants write).
- **Undo/redo:** local stack of inverse ops recorded by the ops module (§5.1);
  not CRDT undo.

## 3. The world model (ECS)

### 3.1 Core

`src/core/world.js` — adopted from the ecs report's `core/world.mjs`:

```js
world.registerComponent(name, { order, add(e, data), change(e, data, prev), remove(e) })
world.addSystem({ name, order, query: ['body', '!dead'], update(world, dt, entities) })
world.query('transform', 'brain', '!dead')     // live Set<entity>, cached
world.load(doc); world.applyPatches(doc, patches)  // reconcile; dirty ids from patch paths
entity = { id, c: {frozen effective components}, live: {mutable runtime state}, groups, preset, owner }
```

- **Reconcile from patches, read from the doc.** Patch shapes vary (`put ""` +
  `splice`, `del` + `put`); the reconciler only extracts dirty entity ids
  (`path[1]`) and dirty preset names, re-reads those entities, and compares
  components by reference (Automerge keeps identity for untouched subtrees).
- **Effective components = preset chain → own components → active groups**
  (`null` in an override removes an inherited component). Editing a preset
  dirties every instance.
- **Ingested data is deep-frozen** (Counters excepted): writing to a doc
  proxy outside `change()` silently desyncs the local view.
- **Unknown components are data** — queryable before any code registers a
  type, so an agent can add a component kind and a system in either order.
- **Entities not in the doc:** players (`player:<peerId>`) are injected from
  presence as local entities with the same shape, so perception, attack and
  mounts see them.

### 3.2 Tick

Fixed **30 Hz** simulation tick (accumulator), render at display rate with
interpolation. Every peer runs every system every tick, but **systems only
*write* to entities the peer owns** (§4.1): `world.owns(id)`. Non-owned
entities get their `live` pose from the ephemeral stream (§4.2).

Built-in system order (gaps left for doc systems):

| order | system | reads → writes |
| --- | --- | --- |
| 0 | lifecycle | presets/groups resolution, `dead` tag |
| 100 | perceive | spatial hash → `live.sensed` (ids within `perception.radius`, nearest first) |
| 200 | decide | `brain.drives` utility → `live.intent {act, target, from, speedMul, drive}` |
| 300 | control | `controller.kind=='input'` → `live.input`; a rider in a controlling seat steers the mount |
| 400 | steer | intent → `live.desired` velocity (pursue/flee/seek/wander/steer + containment + separation) |
| 500 | integrate | accel-limited velocity, position, yaw, ground height |
| 600 | mount | riders take their seat transform (first id wins a contested seat) |
| 700 | attack | reach + cooldown → `damage` event into the victim's inbox |
| 800 | health | **owner of victim only**: drain inbox, `damage.increment`, emit `hurt`/`died` |
| 900 | events | `on[event]` → add/remove groups (doc write by owner) |
| 950 | doc systems | default slot for runtime systems (§7) |
| 1000 | animate | intent/velocity → `live.anim` semantic state (idle/walk/run/attack/die/sit) |
| 1100 | net | broadcast owned poses at 10 Hz; checkpoint rest poses every 3 s |

Built-ins live in code (tested, fast, trusted). A doc can switch one off with
`world.disabledSystems` and install a replacement with the same order.

### 3.3 Component vocabulary

All plain JSON. None of these knows what a T-rex is.

| component | data | consumed by |
| --- | --- | --- |
| `transform` | `{p, r, s}` | reconciler (root object), everything |
| `body` | `{speed, accel, radius, turn}` | steer, integrate, separation |
| `tags` | `{name: true}` | filters |
| `perception` | `{radius}` | perceive |
| `brain` | `{drives: {name: Drive}, idle: 'wander'\|'idle', stickiness}` | decide |
| `attack` | `{damage, reach, cooldown, match?: Filter}` | attack |
| `health` | `{max, armor, hits: {[hitId]: amount}}` | health; `dead` when hp ≤ 0 |
| `on` | `{died: {add: ['dead']}, hurt: {...}}` | events → groups |
| `controller` | `{kind: 'input'}` | control (players, agent puppets) |
| `mount` | `{seats: [{offset, controls}], panicPriority}` | mount, control |
| `rider` | `{mount: id, seat}` — the only stored side of the relation | mount; reverse index derived |
| `representation` | `{kind, ...}` (§8) | reconciler only |
| `animation` | `{clips: {idle, walk, run, attack, die}}` | reconciler (model kinds) |
| `light` | `{kind, color, intensity}` | reconciler |

**Drive** = `{ act, match: Filter, range?, weight, priority?, speedMul?, when?: Filter }`
with `act ∈ pursue | flee | seek | wander | steer | follow`. The highest
`weight·(1 − d/range) + priority (+ stickiness if current)` wins. **Filter** is
structured JSON, not a string language:
`{ tags?, anyTags?, notTags?, has?, not?, relation?: 'targetsMe'|'myRider'|'myMount', where?: [{path, lt|gt|eq}] }`.
The editor and agent API validate filters against `doc.components`.

**Groups** are Bedrock's component groups: a preset declares
`groups: { dead: { components: { representation: {tint: '#555'} }, remove: ['brain','attack','perception'] } }`
and `on: { died: { add: ['dead'] } }`. Death is not an engine feature; neither
is "stunned", "sleeping" or "enraged".

**Seed presets** (editable in every doc; `creature` is the base with `on.died`):

- `trex` — tags predator; body speed 6; perception 25; drives hunt `{act:'pursue', match:{tags:['prey']}, weight:2}`, idle wander; attack 25/1.5 m/1.2 s; health 200; look `billboard 🦖`.
- `sheep` — tags prey; body speed 5; perception 15; drives flee `{act:'flee', match:{tags:['predator']}, weight:3}`, idle wander; health 30; look `billboard 🐑`.
- `horse` — tags prey; mount one controlling seat; body speed 9; drives flee predator weight 2; health 80; look `billboard 🐎`.
- `tree`, `rock`, `lamp` — static looks and a light.

Adding a wolf is a new preset. Making sheep afraid of wolves is nothing: the
wolf carries `predator`. Making wolves afraid of the T-rex is one drive.

## 4. Multiplayer

### 4.1 Ownership

Effective owner of an entity, computed locally every tick:

```
owner(e) = riderPeer(e)                  // a ridden mount follows its rider's peer
        ?? (isLive(e.owner) ? e.owner : null)   // an explicit pin, if that peer is present
        ?? host                          // lowest live peer id
```

Presence heartbeats every 2 s; any ephemeral message (presence, pose, CapTP)
refreshes liveness; a peer that was streaming poses and has been silent for
2.5 s is gone (crash failover measured at 2.5 s; 1.5 s would false-trigger on
the 1.9 s stalls the public server shows); a peer that never streamed expires
after 6 s; `bye` is broadcast on `pagehide` after one final checkpoint
(graceful takeover in ~60 ms). The host election needs no doc write and uses
this exact rule (spike S2: the obvious rule self-elects a joiner for 100 ms and
caused a double hit): a remote peer is a host candidate if I first heard it
within my own first 3 s (an incumbent) or I have known it for ≥3 s; I am a
candidate after 3 s + 250 ms when others are present, or after 1.5 s alone; a
peer with no candidate simulates nothing; removal (bye/expiry) applies at
once. Pins are written on grab (so the editor's hand is authoritative while
dragging) under a conditional protocol: a grab is refused while `owner` is
pinned to another live peer ("held by X"); release writes the final transform
and clears the pin in one change only if the pin is still mine; a drag whose
pin is no longer mine aborts and writes nothing. Partition means
two peers may simulate the same entity until their presence merges; the doc
stays consistent because only checkpoints and inbox drains reach it, and both
are idempotent enough (last checkpoint wins; a Counter sums).

### 4.2 Live stream

The owner broadcasts a packed frame at 10 Hz for NPCs and 20 Hz for its own
player: `{t:'po', k, ts, f: Float32Array[idx, x,y,z, yaw, anim]×N, ids?}`
(24 bytes per entity plus a ~190-byte envelope). The id table is sent on
change, on every presence hello, and every 10th frame. Receivers interpolate
120 ms (configured) + one-way latency behind, with extrapolation clamped
(≥50 ms velocity baseline, ≤30 m/s, ≤200 ms) and corrections blended over
~250 ms after a gap. An entity that falls silent holds its last pose; only
after 5 s (longer than the 2.5 s failover) does it snap to its doc transform.
On ownership loss the old owner holds the last simulated pose until the new
owner's first frame; on gain it clears the entity's buffer and seeds from the
displayed pose. Budget (measured): 7 entities 3.7 KB/s, 50 → 14.5 KB/s, 300 →
77 KB/s per owner stream, and automerge-repo 2.5.6 re-gossips every received
ephemeral message, so each receiver uploads what it downloads; skip resting
entities before scaling past ~50 streamed. The same channel carries presence
and CapTP frames, each tagged.

### 4.3 Cross-owner effects: the inbox

Damage is a direct idempotent put: the attacker's owner writes
`entities[victim].components.health.hits[hitId] = amount` (one put per hit,
at most once per cooldown). The victim's owner only observes hp crossing
zero and adds the `dead` group (idempotent too). Other cross-owner effects on
live state (push, tame, `move` = teleport by a non-owner) go through
`entities[id].inbox`, a map keyed by event id, that the owner drains (apply,
then delete the key); those may double-apply during a partition, which is
acceptable for live effects and not for damage. Concurrent puts to the same
key merge to one value; a drained key deleted on one side and re-put on the
other re-applies at most once more.

### 4.4 Checkpoints

Every 3 s the owner writes, in **one** change, the rest pose of each owned
entity that moved more than 0.1 m or turned more than 5° since its last
checkpoint, rounded to mm / 0.1°. Also on ownership release and on `pagehide`.
Measured: 7 entities with a hunting T-rex grew the doc by 46 B/s. Checkpoints
serve resting entities and worlds opened with nobody online; a live joiner
converges from the stream within ~200 ms (the doc pose can be 11 m off for a
running T-rex). The owner ignores doc transform patches for entities it
simulates; a `set transform` on a simulated entity owned by another live peer
travels as an inbox `move` event.

## 5. One write path

### 5.1 `src/doc/ops.js`

Every mutation — editor, agent, gameplay — is a list of ops applied in one
`handle.change`:

```
spawn {preset?, name?, components?, parent?, at?}      -> id
despawn {id}
set {id, component, patch}        // field merge, never replaces the component
replace {id, component, data}     // new identity (kind swaps, explicit redefinition)
remove {id, component}
define {id, entity}               // deep-diff an entity definition; never assigns
setParent {id, parent}
addGroup / removeGroup {id, group}
push {id, event}                  // inbox append
definePreset / removePreset, defineComponent / removeComponent
defineSystem {name, source, order, enabled} / setSystem / removeSystem
```

`apply(handle, ops, {message})` returns results per op and records the
inverse ops for undo. It validates names, filters and schemas before
touching the doc, so a bad agent call fails without a change.

### 5.2 What the editor and the agent share

The editor UI, the CapTP `World`, the Node CLI and the MCP server all call
`apply`. There is no second way to write. Reads go through `src/doc/read.js`
(`entityData(doc, id)` returns a fresh plain copy with Counters resolved to
numbers and ImmutableStrings to strings).

## 6. Agent interface (CapTP)

### 6.1 Capability surface (`src/agent/world-caps.js`)

```
World: describe(), list({has, tags, name}), get(id) -> Entity, spawn(def) -> Entity,
       batch(ops), define(id, entity), definePreset, defineComponent, defineSystem(name, {source, order, enabled}),
       systems() -> status, explain(id) -> why it is doing what it is doing (intent, drive scores, owner),
       subscribe(listener, filter) -> Subscription, snapshot(), url(), viewer() -> WorldView,
       capture() -> data URL (host page only), logs(), eval(src) (editor key only, host page only)
Entity: id(), get(comp?), set(comp, patch), replace(comp, data), remove(comp), link(comp, otherHandle, extra),
        parent(handle|null), groups(), addGroup/removeGroup, destroy()
WorldView: the read-only attenuation (describe/list/get/subscribe/snapshot)
```

**Hard rule:** returns are fresh plain data or Far handles — never a doc
proxy, ECS row or three object. CapTP's marshal hardens whatever it sends; a
live `Vector3` returned once froze `Vector3.prototype` and killed the render
loop in the experiment. `read.js` is the only source of returned data.

### 6.2 Transport

`src/agent/transport.js` (from the captp report): CapTP frames sealed with
AES-GCM under a key derived (HKDF, doc id as salt) from the `key` in the link
fragment, with session ids and sequence numbers, carried as ephemeral
messages on the scene doc. The host tab answers a SYN addressed to `*`; first
ACK wins. The same pipe runs over a `BroadcastChannel` for a same-origin page
tool (e.g. `packages/claude-code-web` custom tools). Measured: ~41–67 ms per
call through the public server, ~1 ms over BroadcastChannel, pipelining
collapses a three-step edit to one round trip.

**Decision (differs from the captp report):** frames ride the scene doc's own
channel, not a separate rendezvous doc. One connection, nothing to derive;
other peers see sealed frames they cannot open and drop them. If fan-out ever
matters, moving to a rendezvous doc is a transport-only change.

**No host tab open:** the agent library falls back to applying ops to the doc
directly through automerge-repo in Node — every verb except `capture`, `logs`,
`eval` and `explain` works without a page.

### 6.3 Agent side (`packages/merge-meadow/agent/`)

- `mcp.mjs` — stdio MCP server: `connect`, `describe`, `list`, `get`, `spawn`,
  `set`, `replace`, `remove`, `despawn`, `batch`, `define_preset`,
  `define_component`, `define_system`, `systems`, `explain`, `events`,
  `capture`, `eval`. `MERGE_MEADOW_LINK` env or the `connect` tool takes the link.
- `cli.mjs` — one-shot: `node agent/cli.mjs "<link>" spawn trex --at 3,0,-5`.
- `lib/connect.mjs` — shared: parse link, open repo (websocket adapter), find
  doc, try the live host, fall back to local ops.
- The editor's Agent panel shows the link with key and a copy-paste
  `claude mcp add merge-meadow -- node <abs path>/agent/mcp.mjs` line.

### 6.4 Security, stated plainly in the UI

- Anyone with the doc URL can edit, including the system code every peer runs.
- Doc-stored code runs in a Compartment with no DOM, no three, no handles.
- The agent key gates `capture`/`logs`/`eval`; a `view` key is derived one-way.
- Nothing from a doc or an agent ever reaches `localStorage` of this origin.

## 7. Runtime extensibility

### 7.1 Doc systems

`doc.systems[name].source` is an ES-module string exporting one object:

```js
export default {
  init(world, hot) {},           // hot = { prev, data }: state that survives a swap
  update(world, dt) {},          // every tick, after the built-ins at `order`
  on(event, world) {},           // optional event hook
  dispose(hot) {},
}
```

Lowered by one regex (`export default` → return), compiled in a fresh SES
`Compartment` per source hash with endowments `{ world, log }` only: the
compartment's own `Math.random()` and `Date.now()` throw in secure mode, which
is what a seeded, owner-simulated world wants (`world.rand()`, `world.time`).
SES rejects source that contains `eval(`, `import(` or HTML comment tokens at
compile time; the editor shows those as compile errors. Swap:
`dispose` → `init` with the previous hot data. A compile error keeps the last
good version and reports; a throwing `update` is caught per system and the
system is suspended locally after 30 consecutive errors. Status (`ok`,
`error`, `suspended`, last error, compile ms) is local, shown in the editor
and returned from `World.systems()`; never written to the doc.

### 7.2 What a system sees

`world` is hardened: `query(...names)`, `get(id)` → `{id, c, live, has, owned}`,
`owns(id)`, `nearby(id, r)`, `spawn(def)`, `despawn(id)`, `set(id, comp,
patch)` (queued, flushed as one change per tick), `emit(event)`,
`events(type)`, `rand()` (seeded), `time`, `dt`, `log`. Systems mutate
`live` of entities they own; everything else is frozen.

### 7.3 Lockdown and recovery

- `index.html` has **one** module script, `src/boot/entry.js`:
  `import './lockdown.js'; import('../../main.js').catch(showBootError)`, where
  `lockdown.js` is `import 'ses'; import '@endo/eventual-send/shim.js';
  lockdown({ overrideTaming: 'severe', errorTaming: 'unsafe', consoleTaming: 'unsafe' })`.
  Spikes S1/S3: two module scripts work until a second Vite entry shares
  `@endo/*`, then harden runs before lockdown; `manualChunks` of statically
  imported three/@endo breaks the order; without the eventual-send shim a
  static captp import dies with `HandledPromise is not defined`, silently
  unless the dynamic import is caught. Main boots inside an async function (the
  shared Vite config has no es2022 target, so no top-level await). Main refuses
  to compile doc systems if `Object.isFrozen(Array.prototype)` is false.
- Crash marker (session style, S1 measured the 2-second variant never recovers
  from a late hang): when doc systems start running in this tab write
  `localStorage['mm:running'] = {docId, systemsHash}`; clear it on `pagehide`,
  re-arm on `pageshow`. At boot, enter safe mode only if the marker's docId is
  this doc, and stay in safe mode while the doc's systems hash equals the
  recorded one, so editing a system re-enables systems. The banner has "Run
  systems anyway". A browser killed with the tab open costs one safe-mode
  boot. `#safe` forces it.
- `SystemHost` interface (`compileAll(doc)`, `tick(dt)`, `status()`) so a
  Worker host with a watchdog can replace the main-thread one later.

### 7.4 Component schemas

`doc.components[name] = { description, order, defaults, schema }` where
`schema` is a JSON-Schema subset (object with typed properties: number with
min/max/step, string, boolean, enum, array of numbers, nested object). The
inspector renders a generic form from it; `defineComponent` over CapTP takes
the same shape; `apply` validates against it when present.

## 8. Rendering and representation

`src/render/reconciler.js` is the only module that creates three.js objects.
Each entity has one root `Object3D` (from `transform`); each visual component
owns one child of it. Handlers: `create(data, entity)`, `update(obj, data,
prev)` (return `false` → dispose and recreate), `dispose(obj)`. Resources are
ref-counted by key (texture URL, emoji, geometry params).

`representation.kind` picks from an **open registry**:

| kind | data | note |
| --- | --- | --- |
| `billboard` | `{image: 'emoji:🦖' \| url, size, color}` | emoji drawn to a canvas texture: zero assets |
| `primitive` | `{shape: box\|sphere\|cone\|cylinder\|capsule, size, color, roughness, metalness}` | |
| `tree` | `{nodes: [{shape, p, r, s, color, children}]}` | a JSON node tree: the "sculpt it" path |
| `model` | `{url, scale}` + `animation.clips` | glTF via GLTFLoader + AnimationMixer; `url` is `asset:<name>` (resolved through `doc.assets`) or https, never `blob:`/`data:`; loader imported lazily on the first model; one template per URL, a SkeletonUtils clone per entity |
| `critter` | `{rig: quadruped\|biped, length, height, color, head, tail}` | procedural low-poly rig with idle/walk/run/attack/die clips built in code: the animated path with zero assets (`rig`, not `kind`: representation is flat). Template shared per quantised proportions; 300 animating critters cost ~3.5 ms CPU/frame |

The simulation writes only `live.anim` (semantic state); the render pass
reads it every frame together with `animation.clips` (which has no handler, so
editing a mapping never rebuilds the look) and maps it to clips: explicit
mapping → case-insensitive clip name → fallbacks (run>walk>idle, attack>idle,
sit>idle); no die clip halts the current action. Billboard and primitive
ignore it. Resources are keyed `tex:<image>`, `spritemat:<image>:<color>`,
`geo:<shape>` (unit shapes, size is scale), `mat:std:<color>:<rough>:<metal>:…`,
`gltf:<url>`, `critter:<rig>:<L>:<H>:<head>:<tail>`; kinds record acquired keys
on `obj.userData.res` and `dispose` releases them generically. `tree` nodes:
`p`/`r` (degrees) place a node group, `s` scales only that node's own shape; a
structure change rebuilds, pose/scale/colour edits patch in place. Emoji: font
stack Apple Color Emoji / Segoe UI Emoji / Noto Color Emoji / Twemoji Mozilla,
glyph anchored at the bottom; a 1 ms boot probe detects a monochrome fallback
and the seed presets then use eight bundled Twemoji SVGs (9 KB gz, CC-BY 4.0).
Upgrading an entity is `replace(id, 'representation', {...})`: same root, same
`live`, same components, same children.

## 9. Desktop and XR

- `src/xr/rig.js` — `PlayerRig`: `root` (locomotion + yaw) → `head` camera
  (desktop: eye height + pitch; XR: headset) + controller/grip/hand children.
  Riding is `seat.add(rig.root)`. Snap turn pivots around the head.
- `src/xr/pointer.js` — one `Pointer` (mouse / xr-0 / xr-1) → one interaction
  system: hover, select, grab (ground-plane drag on desktop, controller
  offset in XR), preview locally every frame, commit to the doc on release
  (and at ≤10 Hz during a long drag, as `set transform`).
- Desktop: editor camera (right-drag look + WASD, click select, G grab,
  Delete, F focus) and play mode (pointer lock, E to mount/dismount).
- XR v1: select, grab/move, ride (squeeze near a mount), spawn from a
  three-item palette on the left controller, thumbstick move / snap turn.
  Text editing stays desktop and agent only.
- Custom Enter-VR button, hidden unless `immersive-vr` is supported.
  Procedural controller meshes (no jsDelivr fetch).
- Thumbnail: the seed scene renders in 2.8 s headless; the button is hidden.

## 10. Editor (desktop DOM)

Top bar: title · peers · Share (copies link with key) · Fork · Download ·
Open · Enter VR · Safe mode indicator. Left: entity tree + preset palette.
Right: inspector (name, parent, preset, owner, groups; schema-driven forms per
component; add/remove component; representation kind switcher) · Systems
(list with status, source editor, Apply, revert to revision) · Agent (link,
MCP snippet, session log) · History (undo/redo). Toasts for system errors,
ownership changes, merge oddities (two visual components).

## 11. Package layout and ownership

```
packages/merge-meadow/
  package.json  vite.config.js  index.html  main.js  style.css
  README.md  ARCHITECTURE.md  STATUS.md
  src/boot/lockdown.js            SES lockdown, first script             (track D)
  src/doc/   schema.js ops.js read.js presets.js seed.js validate.js      (track A)
  src/core/  world.js tick.js filters.js events.js                       (track A)
  src/sim/   perceive.js decide.js control.js steer.js integrate.js
             mount.js attack.js health.js events.js animate.js index.js  (track A)
  src/scripts/ host.js lower.js world-api.js                             (track A)
  src/net/   repo.js link.js presence.js stream.js ownership.js checkpoint.js (track B)
  src/agent/ world-caps.js transport.js host.js                          (track B)
  agent/     mcp.mjs cli.mjs lib/connect.mjs                             (track B)
  src/render/ scene.js reconciler.js resources.js kinds/{billboard,primitive,tree,model,critter}.js animation.js (track C)
  src/xr/    rig.js pointer.js controllers.js vr-button.js interact.js   (track C)
  src/editor/ app.js panels/*.js forms.js systems-panel.js agent-panel.js share.js undo.js (track D)
  test/unit/*.test.mjs   node --test                                     (each track)
  test/e2e.mjs           Playwright, two pages + local sync server + Node agent (integration)
  test/xr.mjs            IWER-driven XR smoke, by hand (track C)
```

Tracks own directories; cross-track needs go through the interfaces in this
document and `ARCHITECTURE.md`. Dependencies are pre-declared; nobody runs
`npm install` inside a track. Module boundaries enforced by a lint script:
`src/core`, `src/doc`, `src/sim`, `src/scripts` import neither `three` nor the
DOM; only `src/render` and `src/xr` import `three`; only `src/net` and
`agent/` import `@automerge/*-repo*`; `src/doc` may import
`@automerge/automerge/slim` for `Counter`/`ImmutableString`.

## 12. Verification plan

- Unit (`node --test`): reconcile from real Automerge patches (add, nested
  edit, delete, preset edit, group toggle); `set` vs `replace` merge
  semantics; headless scenario "trex, two sheep, horse, rider" → trex kills,
  riderless horse flees; representation swap leaves the sim hash identical;
  inbox drain under concurrent appends; ownership election and handoff;
  captp round trip over MessageChannel; sealed transport over
  automerge-repo's messagechannel adapter; doc system compile / hot-swap /
  error isolation; filter validation.
- E2E (Playwright, local `automerge-repo-sync-server`): two pages see each
  other's spawns; the T-rex in A chases the sheep spawned in B; B's position
  error vs A's within 0.5 m; A closes, B becomes host within 6 s; a Node MCP
  client spawns and swaps a representation through the live page; a doc
  system edited in A runs in B; safe mode after an infinite loop.
- XR (by hand): IWER emulated Quest 3 enters VR, grabs, rides, snap-turns.
- Repo: `npm run build`, thumbnail, `npm run verify`.

## 13. Spikes before implementation

Four integration spikes on the chosen design (the research prototypes each
covered one axis; these combine them):

- **S1 boot-and-lockdown** — Vite build order (`lockdown` entry before main),
  three 0.186 + Automerge slim + captp shims + a Compartment system in one
  page; absolute cost of lockdown on three's matrix math at 300 entities;
  crash-marker safe-mode recovery; IWER XR session under lockdown.
- **S2 sync-split** — two browser peers + the public server: ownership,
  10 Hz ephemeral poses, 3 s checkpoints, host handoff; doc growth over 90 s.
- **S3 agent-loop** — Node MCP server → sealed captp over the doc's channel →
  lockdown page → ops → scene; local fallback with no tab open;
  BroadcastChannel path; `defineSystem` with a syntax error leaves the doc
  unchanged.
- **S4 representation-upgrade** — billboard → primitive → tree → model (glTF
  round-tripped in-page with a clip) → critter, zero leaks, `live` survives,
  critter build time.

Each returns go / no-go with numbers and the paths to adopt. Design changes
they force are recorded here before the build starts.

## 16. Amendments from the spikes (normative)

All four spikes (`S1` boot-and-lockdown, `S2` sync-split, `S3` agent-loop,
`S4` representation-upgrade) returned GO-WITH-CHANGES. The changes are folded
into the sections above; this list is the checklist an implementer can grep
for, with the measurement that forced each one.

1. **Boot** (§7.3): one module script `src/boot/entry.js` → static
   `lockdown.js` (ses + eventual-send shim + severe lockdown) → dynamic
   `import('../../main.js').catch(...)`. No `manualChunks`. No top-level await.
   S1: a split build evaluated three before lockdown; S3: two scripts failed
   with "prior harden" as soon as a second entry shared @endo.
2. **Doc watching** (§3.1, §5): every doc consumer subscribes through one
   `watch(handle, fn)` helper that keeps its own last heads, computes
   `Automerge.diff(doc, lastHeads, now)` itself and wraps `fn` in try/catch.
   Never trust `handle.on('change').patches`: S4 showed a throwing listener
   stops automerge-repo 2.5.6 advancing its patch base, after which a
   spawn+despawn nets to zero patches (300 leaked critters).
3. **Damage ledger** (§2.2, §4.3): `health.hits[hitId] = amount` written by the
   attacker's owner; no Counter, no inbox for damage. S2: a Counter
   double-applied a hit during a 6 s partition.
4. **Liveness, election, pins, stream** (§4.1, §4.2, §4.4): exactly as now
   written there (2.5 s stream-silence TTL, the candidate rule, conditional
   grab/release/abort, id table on hello + every 10th frame, hold on loss /
   forget on gain, 5 s snap timeout, clamped extrapolation, owner ignores doc
   transform patches for simulated entities, `move` via inbox).
5. **Inbox is a map keyed by event id**, drained by the owner (apply, delete
   key); used for live-state effects only.
6. **Transport** (§6.2): drop frames with `seq < expected` (duplicates: two
   host tabs in one browser relay the same ephemeral message twice via
   BroadcastChannel and websocket); abort only on a gap; the guest sends a
   sealed `fin` on close and to every host whose ACK lost; hosts drop idle
   sessions and cancel a dead session's subscriptions. Latency: p50 87–117 ms
   per MCP call through a rendering host, bounded by the host's frame time.
7. **Local fallback** (§6.2, §6.3): host timeout 1.5 s (env-overridable);
   local writes return only after the sync server acks
   (`handle.getSyncInfo(serverStorageId).lastHeads` equals `handle.heads()`);
   every tool result reports `mode` (`live`|`local`) and `fallbackReason`; in
   local mode `systems()` lists doc systems with status `unknown` and
   `capture`/`logs`/`eval`/`explain` reject with "needs a live host page".
8. **View links** carry their role in the parameter name (`&view=`); the page
   hosts agents only when it has `key`; `connect.mjs` attenuates to
   `WorldView` locally too.
9. **Filters resolve presets**: `list({tags})` and every `has`/`tags` filter
   use `effectiveComponents` (S3 found 0 of 51 preset-spawned sheep before).
10. **world-caps is one module**, `makeWorldCaps(handle, {checkSource, host,
    mode})`; the page injects host powers (`capture`, `logs`, `eval`,
    `explain`, `systems`); Node gets the same module without them; add
    `heads()`; `eval` runs in a Compartment endowed with `{world, E, Math,
    log}` and JSON-copies its result; returns arrive hardened on the guest.
11. **Compartment endowments** are `{world, log}` only (§7.1).
12. **Crash marker** is the session variant (§7.3).
13. **Representation** (§8): `critter.rig`; `model.url` is `asset:`/https;
    `animation` read per frame, not a handler; resource keys and `tree`
    semantics as written; emoji font probe + bundled Twemoji seed glyphs;
    `kind`, `rig`, `shape`, `image`, `url` are ImmutableString; schemas may
    carry `x-immutable` and `x-json`; the kind switcher writes one `replace`
    from the target's schema defaults plus same-typed carried fields.
14. **Anchors**: kinds may expose named anchors (`seat`, `head`); `mount.seats[i]`
    may name an anchor and falls back to its offset, so a seat follows the look.
15. **Verification** (§12): e2e asserts boot order (an inline `__THREE__`
    setter probe + `Object.isFrozen(Array.prototype)` at the top of main);
    filters console checks on `type === 'error'` (SES warns on every load);
    position error is judged against the owner's pose 160 ms earlier (≤0.1 m
    mean / 0.3 m max); handoff ≤250 ms graceful, ≤3 s crash; a doc-history
    exactly-once check; ≤3 headless pages per box (6 caused 6 s stalls and a
    split brain); Playwright perf loops read back one pixel per frame.
16. **Dependencies**: `@modelcontextprotocol/sdk` and `zod` are declared;
    `agent/lib/connect.mjs` imports `ses/assert-shim.js` and
    `@endo/eventual-send/shim.js` before anything from @endo. GLTFExporter is
    test-only and must not ship.

## 14. Non-goals (v1)

Physics beyond kinematic steering, voice, persistent player state or
accounts, server-side access control, deterministic replay, a full in-XR
text editor, asset hosting (models are URLs or procedural), mobile touch
controls beyond orbit/tap.

## 15. Ideas borrowed, with credit

Croquet Microverse (behaviour modules as code in the shared state, with
setup/teardown hot-swap) · networked-aframe and Hubs (one owner per entity,
ephemeral streaming + debounced persistence, swappable Object3D table) ·
Decentraland SDK7 (per-component LWW granularity) · Minecraft Bedrock
(component groups and events; filters) · Flecs/Bevy (relations as data on the
source side, reverse index derived) · PlayCanvas Editor (an agent "driver"
API with capture, logs and undo) · Hyperfy (SES Compartment scripts, crash
placeholder, blueprint vs instance) · A-Frame (component lifecycle with
`order`/dependencies, schema-driven inspector).
