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

- `trex` — tags predator; body speed 6; perception 25; drives hunt `{act:'pursue', match:{tags:['prey']}, weight:2, range:15}` (past 15 m it gives up), idle wander; attack 25/1.5 m/1.2 s; health 200; look `billboard 🦖`.
- `sheep` — tags prey; body speed 6.5 (faster than the T-rex: it catches unaware or cornered sheep, not every sheep); perception 15; drives flee `{act:'flee', match:{tags:['predator']}, weight:3, range:12}`, idle wander; health 30; look `billboard 🐑`.
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
- Nothing from a doc or an agent ever reaches `localStorage` of this origin,
  with one exception (§18.1): the launcher's worlds list stores each world's
  title (text only, ≤ 200 characters, shown with `textContent`), and its agent
  key, which every page of this shared origin can read.

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

## 17. Rigs: data-driven articulated looks (v1.2, 2026-11-01)

**Why.** The `critter` kind was a generator: a closed function of six numbers
that baked the body shape, the skeleton and the motion clips into renderer
code. Twelve zodiac animals built with it showed the ceiling: a snake was a
stick, a dragon was a red T-rex, a rooster and a monkey were one biped in two
colours. It is removed. In its place the three layers it fused become
**document data interpreted by one small renderer**, the way Minecraft
Bedrock's geometry / animation / animation-controller files do. Nothing in the
renderer knows what an animal is; generators (a serpent with N segments) are
scripts or agents that *write* models into the doc.

### 17.1 The three layers

1. **Geometry = the node tree, with names.** A `rig` model's `nodes` are the
   existing `tree` nodes plus `name`. A named node is a bone: its children
   move with it. Legs are nested nodes (hip → knee → foot); a snake is a chain
   of segments; a bird has wing nodes. Articulation comes from nesting, so
   there is no body-plan enum. The `tree` kind is kept as an alias of `rig`
   with no animations, so animating a sculpt is *adding tracks to the same
   component*, never a kind swap.
2. **Animation = clips of tracks over named bones**, additive to the rest
   pose. A track is a channel of one node (`<node>.rx|ry|rz` degrees,
   `px|py|pz` metres, `sx|sy|sz` scale factor) whose value is either
   - an **expression** string in a tiny safe language, or
   - **keyframes** `[[t, v], …]` (seconds, linear, wrapping when the clip loops).
   Rotation and position tracks add to the node's rest `r`/`p`; scale tracks
   multiply its rest `s`. Because everything is additive, clips **layer**: a
   `walk` state can play `gait` + `tailwag` + `breathe` at once.
3. **Controller = semantic state → clip layers.** The sim keeps writing
   `live.anim` (idle/walk/run/attack/die/sit) and `live.v`; the controller is
   a table `{ states: { walk: ['gait','breathe'], attack: 'bite', die: 'fall' }, blend: 0.15 }`
   with crossfades over `blend` seconds and the existing fallback chain
   (run → walk → idle, attack → idle, sit → idle; no `die` clip halts).
   A clip marked `once: true` plays from state entry and clamps.

### 17.2 Expressions

Grammar: numbers; `+ - * / %`; unary `-`; parentheses; comparisons
`< <= > >= == !=`; `&& || !`; the ternary `a ? b : c`; calls to
`sin cos tan abs min max clamp lerp smoothstep floor ceil round sign sqrt pow saturate step`;
constants `pi tau`. Variables the renderer supplies every frame:

| var | meaning |
| --- | --- |
| `t` | seconds since the look was created |
| `st` | seconds since the current state was entered (for `once` clips) |
| `phase` | stride phase in cycles: distance travelled ÷ `stride` (model field, default 1 m) |
| `speed` | horizontal speed, m/s |
| `gait` | `clamp(speed / runSpeed, 0, 1)` with `runSpeed` a model field (default 4) |
| `turn` | yaw rate, rad/s |
| `hp` | health fraction 0..1 (1 when no health) |
| `rand`, `idx` | a per-entity constant in 0..1 and a per-entity integer, for variety |

Compiled by **our own parser** to closures, once per model revision; unknown
identifiers are compile errors reported at `defineModel` time; the result is
guarded (`NaN` → 0). No `eval`, no `Function`, so it runs under lockdown and
is deterministic per peer. An agent asked to "wag the tail faster" edits one
number in one string.

### 17.3 Where it lives

```js
doc.models[name] = {
  extends: ImmutableString,            // '' or another model: nodes patch by name, clips merge by name, controller shallow-merges; depth ≤ 8, cycles rejected
  stride: 1.0, runSpeed: 4,             // locomotion scaling for `phase` and `gait`
  nodes: [ { name, shape, p, r, s, color, roughness, metalness, anchor, children } ],
  animations: { [clip]: { loop: true, once: false, duration?, tracks: { 'hips.py': 'sin(t*2)*0.01', 'leg_fl.rx': [[0,-30],[0.5,30],[1,-30]] } } },
  controller: { states: { idle: 'idle', walk: ['gait'], run: ['gait','lean'], attack: 'bite', die: 'fall', sit: 'sit' }, blend: 0.15 },
  rev: n,
}
representation = { kind: 'rig', model: ImmutableString, color: '#ffffff' /* multiplies node colours */, scale: 1 }
             |  { kind: 'rig', nodes, animations?, controller? }      // inline, what `tree` is an alias for
```

A **shared library** with `extends` is what the zodiac lineup lacked: twelve
animals shared nothing, and improving the horse improved one horse. The seed
library ships as data (`src/doc/models.js`, written into `doc.models` by the
seed and by `ensureLibrary` on open): `quadruped`, `biped`, `serpent`, `bird`
as bases, and `horse`, `sheep`, `trex` extending them with species parts
(neck, mane, ears, wool, big head, long tail). Seed presets stay billboards;
upgrading a horse is `replace representation { kind:'rig', model:'horse' }`.
Resources key on `model:<name>:<rev>` (geometry template) and node materials,
so 300 instances of one model share one template as the critters did.

### 17.4 Per-frame evaluation

For each rig instance: compute the variables from `live` (speed from
`live.v`, phase accumulated from distance moved, state and `st` from
`live.anim`), take the controller's current and previous layer sets with
crossfade weights, evaluate each active clip's tracks (expression or sampled
keyframes), sum the offsets per node channel, and write rest + offset into the
node groups. Cost: ~20 tracks × 300 entities ≈ 6000 closure calls, well under a
millisecond; the transforms are the ~20 rigid parts per entity the critters
already paid for.

### 17.5 What changes elsewhere

- Ops: `defineModel {name, model}`, `removeModel {name}`; `validateOps`
  compiles every expression and checks node names, track targets, `extends`
  chains and limits (≤ 200 nodes, ≤ 400 tracks). Agent verbs `defineModel`,
  `models`, `removeModel`; MCP `define_model`, `models`, `remove_model`.
- Editor: the kind switcher offers `rig` with a model dropdown from
  `doc.models`; the inspector for a rig shows the model, a **Fork** button
  (copies the resolved model into `doc.models` under a new name and points
  the entity at it), the node tree, clips and controller as `x-json` fields
  with live preview, and a **preview state** selector that forces
  `live.anim` on the selected entity so clips can be watched without the sim.
- The `critter` kind is deleted. A doc that still names it renders the
  unknown-kind placeholder; the editor's kind switcher converts it to `rig`
  with the matching library model. Existing worlds are migrated by hand.
- `model` (glTF) stays for external assets; the same skeleton idea lets a
  future skinned mesh be driven by a rig's nodes, which is how the two paths
  would merge.

### 17.6 Verification

Unit: parser precedence, functions, errors and the absence of any global
access (also under `lockdown()`); keyframe sampling with wrap and `once`;
additive layering restores the rest pose when a clip stops; `extends`
resolution (node patch by name, clip merge, controller merge, cycle and depth
rejection); the seed library validates and every clip targets existing
nodes; `defineModel` with a bad expression leaves heads unchanged. E2E: the
upgrade path becomes billboard → primitive → tree → **tree + animations (same
root, same meshes)** → rig model → model(glTF) → billboard with zero leaks;
300 rigs animating with CPU ms/frame reported; the dead group tints a rig;
preview state drives clips with the sim idle.

## 18. Launcher and templates (v1.3, 2026-11-01)

**Today** a bare URL plants a new seeded world at once and rewrites the hash.
That hides two things people want: their earlier worlds, and a choice of what
a new world contains.

### 18.1 The launcher

A bare URL (no `doc` in the fragment) shows a full-screen launcher over an
uninitialised scene; nothing is created until the person chooses. Sections:

- **Your worlds** — worlds this browser has opened, newest first, from a local
  list: title, last opened, Open, Copy link, Forget. Forget removes the entry
  only; the document stays in IndexedDB and in the sync server.
- **New world** — one card per template (§18.2); a click creates the document
  from the template, writes the recent entry and rewrites the hash with a
  fresh key, as today.
- **Open a file** — the existing `.automerge` import.
- **Paste a link** — a field that navigates to a pasted world link.

`#new=<template>` creates that template at once (for links, docs and tests);
`#safe` and `&sync=` keep working. The recent list lives in
`localStorage['mm:worlds']` (max 50 entries of `{ docUrl, key, view, sync,
title, at }`), written only by the app on open/create and on title change,
rendered with `textContent` only. It holds the agent key of each world, which
the browser history already holds; the Security notes say so and Forget
removes it.

### 18.2 Templates

`src/doc/templates.js`: every template seeds the same library (component
defs, presets with their `icon`, rig models) and differs in the entities it
places and the world settings:

- **Blank meadow** — ground and sky, one lamp, no creatures. The palette has
  everything; the field is yours.
- **Animal meadow** — the current starter scene (trees, rocks, lamp, T-rex,
  three sheep, horse) plus the wizard by the lamp and a few zodiac animals,
  so a new visitor sees the chase, a rider's mount and a person at once.

The gallery thumbnail is shot through the launcher: the hint clicks **New
world → Animal meadow**, then hides the panels.

### 18.3 Palette icons

A preset may carry `icon` (an emoji string) at its top level. The palette
uses it first, then the billboard emoji as today, then a generic glyph, so rig
presets get a readable card.

### 18.4 Decisions that changed while building it (round 1, 2026-11-01)

- **Seed presets are rigs.** §17.3 said the seed presets stay billboards; the
  content pass makes the `trex`, `sheep` and `horse` presets look like their
  library rigs, and adds twelve rig presets (the wizard and eleven zodiac
  animals: rat, ox, tiger, rabbit, dragon, snake, goat, monkey, rooster, dog,
  pig; the core `horse` is the zodiac horse). The library is nineteen models.
  The billboard stays the first rung of the ladder: switching a rig to
  `billboard` shows the preset's `icon`.
- **The library is added only to a world with no `doc.models`.** §17.3 had
  `ensureLibrary` fill in missing library models on every open, which put back
  a model someone had removed. Now the page (and the agent's local mode) adds
  the library only to a world made before rigs. Worlds made before this round
  keep their seven models and their billboard presets; the zoo comes with new
  worlds.
- **Launcher navigation.** A launcher choice creates or opens the world in
  place and pushes the new address, so Back returns to the launcher;
  `#new=<template>` replaces it, so Back does not plant a second world. A
  failed choice returns to the launcher with the reason; a failed link in the
  address is still a boot error. A `#new=` link creates on the sync server it
  names and keeps its `&safe`, however it arrives (boot, a hash change, Paste
  a link); a template card and Open a file use the page's own sync server,
  which a failed choice never changes. Addresses the launcher writes keep
  `&safe`, so a reload after a hang stays safe.
- A world created from a template takes the template's title (Animal meadow,
  Blank meadow), so entries in Your worlds can be told apart.

## 19. Ownership, identity and who may edit (notes, 2026-11-01)

Notes from reviewing the model as built, with the phoenix session as the
test case. §19.1 and §19.2 describe what exists; §19.3 lists the gaps; §19.4 is
proposed and **not built**. An item becomes normative when it ships and gets
its row in STATUS.

### 19.1 What ownership governs

Ownership (§4.1) decides who **simulates** an entity: who streams its live
pose and who writes the doc entries that follow from simulation (checkpoints,
the `on` reactions that add groups, inbox drains, the hits an attacker lands).
It never gates authored state. Any peer with the doc link, in a tab, through
an agent or with the CLI in local mode, may set or replace components, define
presets, models and systems, spawn and despawn; Automerge merges those edits
field by field and every peer converges. Moving a simulated entity is open
too: a transform write by a non-owner becomes an inbox `move` the owner drains
(§4.4), and a grab pins the entity to the grabbing tab for the drag. The one
refusal is a grab while another live peer holds the pin ("held by X").

| | authored state (the doc) | live state (per frame) |
| --- | --- | --- |
| what | presets, models, systems, components, spawn/despawn, groups | position and yaw while moving, velocity, animation state, controller input |
| who writes | anyone with the doc link | one peer per entity: the rider's peer, else the pin if that peer is live, else the host |
| how it merges | Automerge, field-wise | not merged: the owner streams, the rest interpolate |

### 19.2 Crashes and departures, as built and measured

| event | behaviour | measured (e2e `hidden`, `handoff`, `safe`; unit `b-presence`) |
| --- | --- | --- |
| tab closes or navigates | `bye` after one last checkpoint; removal applies at once | next peer hosts and owns the T-rex in 11 ms |
| tab hidden or backgrounded | says `bye`, simulates nothing, rejoins on resume | handoff in 27 ms, held while hidden |
| tab crashes or hangs | heartbeats stop; a streaming peer is gone after 2.5 s of silence, a silent one after 6 s | 2.46 s on a fake clock; 1.5 s false-triggered on the public server's 1.9 s stalls |
| crashed mid-drag | a pin counts only while its peer is live; the hold evaporates | |
| crashed while riding | the player entity is local and vanishes with its presence; the mount falls back to the host | |
| hung on a doc system | the crash marker puts that tab's next load of the world in safe mode | survives a browser restart |
| new tab joins | cannot self-elect host for 3 s (+250 ms with others present) | stopped a joiner double-applying a hit (S2) |
| partition | two peers may simulate one entity until presence merges; only checkpoints and idempotent writes reach the doc | |

Bounded, not prevented: up to 3 s of motion since the last checkpoint is
re-simulated by the new owner, and during the failover window nobody drives
the dead peer's entities. Hits are written the moment they land.

### 19.3 Gaps

- **Ownership is per tab, not per person.** The peer id is minted per tab and
  kept in that tab's `sessionStorage`: it survives a reload of that tab and
  nothing else. Two tabs of one person are two peers; a duplicated tab copies
  `sessionStorage` and the two share one peer id (STATUS). The display name
  is a label with nothing behind it.
- **Stale pins stay in the doc.** A pin left by a dead peer is ignored but
  remains written, so the inspector still prints it.
- **Nothing shows who drives what.** The inspector shows a pin when one
  exists; there is no "driven by" on an entity and no list of who is present
  and what each peer simulates. Most confusion about the model is
  invisibility, not behaviour.
- **Authored edits merge silently.** Concurrent edits to one field resolve
  deterministically with no attribution and no sign that a value lost. Own
  empty maps at spawn make first writes merge one level deep only (STATUS).
- **Undo is blind to other people.** It applies the inverse patch, so it
  clobbers a later edit of the same field by someone else.
- **Doc systems may write only what their peer owns.** The script facade
  gates `set` by ownership so that N peers do not all write the same op; it
  also stops a system from editing presets or models.
- **No permissions.** The doc link is the only capability; anyone holding it
  can rewrite the systems every peer runs (§6.4). This cannot be added inside
  Automerge.
- **Takeover could flap** between two peers on a bad connection. Not
  observed; the doc stays consistent, only the picture would jitter.

### 19.4 Proposed

1. **An identity above the tab.** A stable per-browser identity (id and name,
   `localStorage`) that presence carries beside the per-tab peer id. Tabs are
   leases under it: "mine" means all my tabs; a grab is held by a person, with
   one tab holding the lease; a duplicated tab detects its twin over the
   BroadcastChannel and mints a fresh peer id. The inspector and the toasts
   name people, not peer ids. When trust is wanted, this identity is where a
   keypair goes, and an authenticating sync server checks the signatures;
   until then it is a label, and the UI says so.
2. **Clear stale pins on takeover.** The host that takes over an entity
   unpins it conditionally (`unpin` with `ifOwner` = the dead peer), the same
   conditional write grabs already use.
3. **Show it.** A presence list (who is here, what each drives, which one is
   host) and a "driven by" badge on the selected entity, fed by the same
   `ownerOf` the inspector already calls.
4. **Attribution and conflicts.** Changes already carry a message; add the
   author (identity) so the inspector can say who last edited a component and
   when. Surface a conflicted field (Automerge keeps the losing values) in the
   panel instead of hiding it; the existing merge toast covers only
   representation.
5. **Undo that respects others.** An undo entry records the value it expects
   to find; applying it is conditional on that value, like the pin protocol,
   and a mismatch skips that field with a toast rather than clobbering it.
6. **Authored writes from doc systems, from any peer.** Relax the facade's
   `set` to any entity for components that are not live-derived; an unchanged
   `set` is already a no-op in `mergeInto`, so N peers converge without churn.
   Expose `definePreset` and `defineModel` to systems under the same rule.
   Keep `spawn` host-only.
7. **A takeover hold-down**, only if flapping is ever observed.
8. **Permissions live in the sync layer.** Per-player roles mean an
   authenticating sync server that decides who may push, with the public
   server kept for open worlds. This is the one item here that is a different
   deployment, not a change to this code; §14 keeps server-side access control
   out of v1.

## 20. Document growth (v1.4, 2026-11-01)

Measured on the built app (research track G, report in the session scratchpad
under `design-r3/G-growth.md`; every number has its script). Decisions here
are normative once built; §20.5 lists what is still open.

### 20.1 What was measured

| world | growth | 1 h | 24 h | 30 d |
| --- | --- | --- | --- | --- |
| Animal meadow, sim running, one host tab | 28.5 B/s (1.7 KB/min) | 103 KB | 2.5 MB | 74 MB |
| meadow + 300 wandering creatures | 994 B/s (60 KB/min) | 3.6 MB | 86 MB | |
| meadow with every mover frozen; a blank world | 0 B/s | | | |

- **Checkpoints are the document.** 98.2 % of the bytes in the meadow and
  99.9 % with 300 movers; health hits 1.4 %, groups 0.3 %, inbox, pins and
  edits near zero. Each continuously moving entity costs about 3.2 B/s saved,
  whatever the scene. Wanderers never rest, so the 0.1 m / 5° filter never
  applies to them; resting entities already write nothing.
- **Every cost follows the history, which Automerge never frees.** A fresh
  peer downloads the whole history (2.62 MB for a day of meadow, ready in
  2.9 s on a local server; 4.16 MB for an hour of 300 movers, 4.0 s). A
  returning peer more than about 20–100 changes behind also gets the whole
  doc. Load is linear in ops (about 1 µs/op in Node, 1.15–1.3× in the
  browser); memory is 250–280 B/op, so a month of the meadow (about 23M ops)
  or 14 h of 300 movers likely cannot be loaded at all (4 GB wasm32).
- **The current state is tiny**: 30 KB for the day-old meadow, 50 KB for the
  hour of 300 movers, 83–86× smaller than their histories.
- **automerge-repo's compaction bounds disk only** (IndexedDB and the sync
  server stay at 1.4–1.6× the save size), not history, memory, load or join.
  Each compaction is a full save on the main thread (180 ms at 2.6 MB,
  288 ms at 4.2 MB).
- **Pruning frees nothing.** Deleting 400 hit keys added 47 B; a 100 KB inline
  asset is a permanent cost that deletion cannot recover.
- **Corrections to earlier sections.** §1's "kilobytes per minute" holds for
  the meadow only. §2.3 and `share.js` say Fork compacts history; it does
  not: `repo.clone` is `Automerge.clone` and the saved bytes were identical.
  §2.2's 2.6 B per hit holds only for batched hits; the running sim writes
  one change per hit (19–21 B saved, about 124 B on the wire). §4.1's Counter
  and §2.1's list-shaped inbox are stale: the ledger and the inbox are keyed
  maps.

### 20.2 Decisions

1. **Checkpoint policy: on rest, at most every `movingS` while moving, and on
   ownership loss or `pagehide`.** An owned entity writes a checkpoint when it
   comes to rest (speed below ε for 1 s), at most once every `movingS`
   seconds while it keeps moving, and always on release. `world.checkpoint =
   { movingS: 30, minMove: 0.1 }`, a world setting the panel and the agent
   expose; `movingS: 0` means only on rest and on leave. About 10× less
   growth (meadow 0.25 MB/day, 7.5 MB/month, still loadable; 300 movers
   8.6 MB/day). Only `src/net/checkpoint.js` changes; the per-axis op shape
   and the merge rules of §2.2 stay. Live joiners are unaffected (they take
   the stream). The cost: after a crash with nobody online, a cold-opened
   world can show a creature up to 30 s of motion from where it was.
2. **A size line and a budget**, in the World panel and in the agent's
   `describe`: bytes, changes, growth per minute, from `Automerge.stats`
   (9 µs per call). Advisory: amber at 5 MB, red at 25 MB. The editor and the
   agent do not refuse spawns; they say what the world costs.
3. **"Save as a fresh world."** The only real bound on history: a new document
   built from the current state (`Automerge.from(Automerge.toJS(doc))`, which
   keeps `ImmutableString`; a JSON round trip does not), with
   `meta.successor = <new doc url>` written into the old document and a banner
   there that follows it. It loses history, version links and heads, and the
   old link, recents and agent key move to the new one; it is a person's
   explicit, destructive action with a confirmation that says so. Fork stays
   what it is and is relabelled honestly ("copies the world and its history").
4. **The health ledger stays as it is.** It is bounded per life (hits stop at
   0 hp) and is 1.4 % of the bytes. If its state size ever matters, fold it at
   death or heal; the keys cost nothing in history either way.
5. **Assets never go inline.** Before any `doc.assets` write path ships,
   assets are separate content-addressed Automerge documents (one per asset,
   `assets[name] = { kind, url: 'automerge:<id>' | 'https:…', bytes, sha256 }`
   in the world doc), with a per-asset cap (1 MB) and a per-world cap checked
   in `ops-validate`, and `setAsset` / `removeAsset` ops. A removed asset then
   costs the world a few bytes and no joiner downloads it again.
6. **Checkpoint rate counts as a world rule**: agents may read and set it
   through world settings, as with `disabledSystems`.

### 20.3 Verification

Unit: the came-to-rest test and the interval on a fake clock; a release
always writes. e2e: rerun the growth harness on the meadow and on 300 movers
and assert the bytes per second against the policy; the cold-open pose error
after a host crash without `pagehide`; the fresh-world rebase round-trips the
whole schema (system sources as Text, `ImmutableString`, models, int vs
float) and the successor banner opens the new world; the size line matches
`Automerge.stats`.

### 20.4 Spikes

G1 the policy behind a flag, re-measured; G2 rebase fidelity and the
successor, with a peer offline on the old doc at the cut; G3 the real memory
ceiling in Chromium (synthetic 5M/10M/16M-op docs); G4 a 5–50 MB doc through
`wss://sync.automerge.org` (message limits, join time over a real network);
G5 the main-thread stall of compaction at 5 and 20 MB and whether other
peers see it as a pose gap.

### 20.5 Open

- Whether to offer **ambient movers** as well: a component flag for creatures
  with no durable pose, so a cold open puts them at their authored placement
  (which today's checkpoints overwrite within 3 s) and they cost nothing.
  Worth it if authors want "where I put the sheep" to survive.
- What scale and lifetime are the targets. 300 continuous movers for a day is
  8.6 MB under the new policy; a month of a lively world still wants a fresh
  world now and then.

## 21. The world model (v1.4, 2026-11-01)

Research track W (`design-r3/W-world.md`). Trees, rocks and lamps are not
obstacles today: they have no `body`, so creatures walk through them (20.6 %
of creature samples sat inside a trunk with 300 trees). The only wall is the
world bounds, square in the sim (per-axis clamp) but drawn as a circle. Static
entities leak into the perception grid, the separation counter and the pose
stream. The T-rex corner pin (12 of 12 sheep die in a corner, 4 of 12 in the
open) is a flee-tuning problem that obstacles do not fix: round bounds, a
context flee and an intercept-scored flee were tried and none solved it.

### 21.1 Obstacles and movement: steering over static shapes

- **Data:** an `obstacle` component, `{ shape: 'circle', radius: 0.6 }` or
  `{ shape: 'capsule', a: [x, z], b: [x, z], radius }` for fences and walls,
  scaled by `transform.s` (max of x and z). On the `tree` (trunk radius about
  0.4), `rock` (about 0.7) and `lamp` presets. An entity may carry both `body`
  and `obstacle`; the kernel skips the mover itself.
- **Sim:** a built-in `avoid` system at order 450 (look-ahead steering over a
  static spatial hash rebuilt on obstacle or transform change, 0.05–0.33 ms)
  and a `collide` push-out after `integrate`. The bounds become four implicit
  capsules so walls and trees share one slide rule. Measured 0.045–0.12 ms per
  tick for about 47 movers with 30–300 obstacles, zero penetration; budget
  0.25 ms under lockdown.
- **The three static leaks are fixed in the same change:** `perceive` indexes
  only entities with a `body`; the separation counter moves after the `body`
  check (today four nearby trees disable separation from creatures); the
  stream sends only entities with a `body` (statics follow the doc; 300
  statics were adding 10.5 KB/s).
- **Rejected for v1:** flow fields (3–10 ms per goal, 60–400 KB per field,
  and pursue, flee and follow have moving per-entity goals; kept as a later
  `goto` verb for fixed destinations) and a navmesh (three-pathfinding
  imports three, which `src/sim` may not; Recast is about 190 KB gzipped of
  wasm and glue untested under lockdown and in Node).
- **The corner pin is a separate behaviour ticket** with the research
  harness as its bench: prey speed margin, time-to-intercept flee scoring, a
  juke. Target: corner deaths at or below 50 % with open-field deaths
  unchanged.
- **Bounds are square and drawn square.** The sim's per-axis containment
  stays; the ring becomes a square so what people see is what the sim does.

### 21.2 Terrain: a procedural base plus placed features

- **Data:** `doc.world.terrain = { kind: 'noise', seed, layers: [{ scale, amp }…],
  flat: 12 }` (about 100 bytes; `flat` is a level radius around the origin
  for the spawn area; missing or `kind: 'flat'` is today's world). A feature
  is a component on an ordinary entity: `terrain: { shape: 'hill' | 'pit' |
  'plateau', radius, height, falloff }`, placed by its `transform`, with no
  body and no render, not streamed. Features merge, undo and reach agents
  through the existing ops.
- **One sampler for everyone:** `src/core/terrain.js`, pure, exports
  `makeGround(world) → (x, z) => y`, memoised on the settings plus a feature
  revision (79 ns per sample measured for four octaves). The sim, the render,
  XR, doc systems and Node import the same function; `scene.ground` and the
  closure from `main.js` go away, and `groundHit` becomes a ray march plus
  bisection in `src/core`.
- **Render:** a 128- or 256-segment plane over the bounds, displaced from the
  sampler with vertex normals, rebuilt on change; the outer disc stays flat as
  the horizon. **XR and desktop:** the player rig sets `root.y` from the
  sampler after locomotion and teleport, low-passed over about 0.15 s in XR
  so slopes do not jitter the floor; the editor camera clamps to ground +
  0.3.
- **Statics on terrain: `transform.p[1]` of an entity without a body is
  height above ground when the world has terrain.** Flat ground is y = 0, so
  every existing world is unchanged; the reconciler adds `ground(x, z)` when
  posing a top-level static, and the inspector labels the field "above
  ground". This is the one change of meaning in the schema.
- **Checkpoints and the stream do not change**: y is already carried.
- **Rejected for v1:** a heightfield as one bytes value (a 9×9 brush stroke
  copies 20–82 KB). If authors want a real brush later, 16×16 `Uint16` tiles
  under `world.terrain.tiles["x,z"]` cost 170–190 B per stroke and are the
  v2 shape; concurrent strokes in one tile are last-writer-wins.

### 21.3 Shadows

Measured under SwiftShader at 640×400: a sun shadow adds 15–25 ms on the
meadow (+40–60 %) and 120–200 ms with 300 rigs; draw calls double (230 → 471,
6081 → 12 323); map size barely matters (1024 and 2048 within noise). Rig mesh
merging (the STATUS draw-call gap) is what makes shadows cheap.

- One shadow-casting light, the stage's sun; entity lights never cast in v1.
  PCF, a 1024 map, a camera-following orthographic frustum of ±20 m centred
  8–10 m ahead of the camera, snapped to the texel grid (3.9 cm) so it does
  not shimmer; bias −0.0005, normalBias 0.02.
- Casters: entities with a `body` or an `obstacle`. Billboards cannot cast;
  they get a shared blob disc. Receiver: the ground only.
- **Two settings, because intent and cost differ.** Doc: `world.shadows:
  true | false`, default `true` for new worlds, missing means `false` so old
  worlds look the same. Local, per device: graphics `auto | high | low`;
  `auto` is on for desktop, off while XR is presenting, and off when the
  median frame time over 2 s exceeds 20 ms. Effective = doc and local.
  Switching recompiles materials once (a one-time hitch).
- The thumbnail is re-shot when this ships.

### 21.4 Despawn cascade and the parent rule

- `{ op: 'despawn', id, children: 'delete' | 'detach' }`, `'delete'` the
  default from the editor and the agent. The subtree is expanded **at apply
  time inside the one change** by an exported `subtree(doc, id)` that
  `ops-validate` and `drainOps` also use, children first, so the inverse list
  respawns parents first: one change, one undo entry. `'detach'` re-parents
  children to the despawned entity's parent and rewrites their transforms to
  keep their world pose, through a pure compose helper in `src/core/xform.js`
  (Euler XYZ degrees ↔ matrix) that also gives `setParent` a `keepWorld`
  option the editor's parent picker uses. The editor confirms above five
  children. Orphans from a concurrent re-parent stay rendered at the root and
  marked "parent deleted" in the tree with a one-click clean-up; there is no
  automatic clean-up, because a peer cannot tell "deleted" from "not synced
  yet".
- **`live.p` and `live.yaw` are world space for every entity with a `body`.**
  A doc parent of a body entity is organisational, not kinematic: the
  reconciler converts to parent-local when posing, checkpoints convert back
  on write, and simulated movement never inherits a parent's motion.
  "Carried" is `rider.mount` (seated, world-correct today) or `live.held`,
  never parenting; a moving cart that carries an NPC gets a seat without
  `controls`. Statics keep parent-local semantics, which is already right.

### 21.5 Interest management for the pose stream

The ephemeral channel is broadcast and re-gossiped: every client re-uploads
what it receives, and nothing can be addressed per receiver (W, measured and
read in automerge-repo 2.5.6). On the wire a 10 Hz NPC frame is 1.4 KB for 50
movers (14.9 KB/s), 3.8 KB for 150 (40 KB/s), 7.4 KB for 300 (78 KB/s); the
envelope is 227–229 B, not §4.2's 190 B.

1. **Now:** stream only entities with a `body` (§21.1).
2. **Then, a `po2` frame:** distance tiers set by the owner from the nearest
   player of any peer (near < 20 m at 10 Hz, mid 5 Hz, far 2 Hz, the id table
   at 1 Hz; about −36 % of rows in the meadow with two players), with rows
   tagged by tier so receivers use a per-entity interpolation delay of
   `max(120 ms, 1.2 × period)`; and quantised rows (16-bit x and z at 2 mm
   over ±64 m, 8-bit yaw and anim, y dropped where the receiver can sample
   terrain): 24 → about 8 B per row. Together, 300 movers with eight peers is
   about 40 KB/s per client each way.
3. **Not v1: per-peer WebRTC data channels** with the ephemeral channel as
   signalling. The threshold, an estimate: past about 150 streamed movers
   with eight or more peers, past about 1 MB/s at the server, or worlds past
   about 300 m where players spread out. It needs STUN and a paid TURN
   service, N² connections and a fallback. A self-hosted sync server is the
   cheaper first step if the shared public server is the limit.
4. Region lanes are rejected: they save nothing on a broadcast transport.

### 21.6 Where the code goes (boundaries rule)

| piece | module |
| --- | --- |
| obstacle hash, `avoid`, `collide` | `src/sim/avoid.js` (new) |
| terrain sampler, ray-vs-terrain; transform compose | `src/core/terrain.js`, `src/core/xform.js` (new, pure) |
| `subtree`, cascade expansion, detach rewrite | `src/doc/ops.js`, `ops-validate.js` |
| ground mesh, shadow set-up, blob discs, world-pose placement under a parent | `src/render/scene.js`, `reconciler.js` |
| rig y from the sampler | `src/xr/rig.js`, `desktop.js` |
| body-only rows, tiers, `po2` | `src/net/stream.js` |

### 21.7 Verification and spikes

Unit: the avoid kernel in Node (penetration 0 over 60 s with 50 movers and
300 obstacles; cost); the sampler and feature maths; `subtree` against a
concurrent re-parent in a forked doc and a one-step undo of a three-level
tree; `xform` round trips. e2e: the chase on a meadow with obstacles (the
"not a massacre" bar unchanged in the open); terrain end to end (XR rig y in
`test/xr.mjs`, pose error with y moving, ground rebuild time per edit);
shadows on and off at the thumbnail view; near and far pose-error bounds
split once tiers exist; the 300-entity stream end to end (a STATUS gap).
Spikes: the obstacle kernel in the real app under lockdown; the corner-pin
bench; shadows on a real GPU and a Quest paired with a rig-merge prototype;
stream v2 at 300 movers.

### 21.8 Open

- Shadows on by default for new worlds costs 40–60 % of frame time under
  SwiftShader and doubles draw calls until rigs are merged. The decision
  above says on; say if you would rather ship it off until merging lands.
- Whether a terrain brush (tiles) is a v1 goal or features are enough.

## 22. People in the world (v1.4, 2026-11-01)

Research track P (`design-r3/P-people.md`). Today a player is a local entity
`player:<peer>` with a transform, a controller and `tags.player`; remote
players draw as a flat 🧑 billboard with no colour and no name, and your own
player draws nothing. Five gaps, all measured: XR head and hands never leave
`PlayerRig.pose()` (a wire gap, not a renderer gap); the local player always
streams `idle` with zero velocity, so a person walking at 3 m/s slides in idle
for everyone else; the colour in presence is sent but never read; players
have no health, so no predator ever targets them; and once they have health
the host emits hit events that nobody applies. On the wire a player frame is
202 B and every peer re-gossips every other player's frames, so two standing
players already cost 8.5 KB/s of upload per tab.

### 22.1 Avatars

- **Data:** `info.avatar = { model, color }` in presence. The receiver renders
  a remote player as `{ kind: 'rig', model, color }`, resolved in this order:
  a model of that name in `doc.models` with a `head` anchor; else that name in
  the code library, rendered as an inline rig (so it works in worlds made
  before the library, with no doc write); else the 🧑 billboard tinted with
  the colour. Presence is untrusted: accept a model **name** from those two
  sets and a colour matching `#rrggbb`, never inline nodes.
- **A `traveller` library model**, extending `biped`: named `hand_l` /
  `hand_r` under the elbows, near-white clothing so the look-wide colour
  multiplier reads as the person's colour, a `sit` clip for riding (the biped
  has none, so a rider stands on the saddle today), and an `xr` controller
  state whose clip collapses the arms while the hands float, so XR arm
  handling stays data.
- **Locomotion:** `updateSelf` derives `live.v` from successive rig positions
  (smoothed over about 100 ms) and the player gets `body.speed: 6`, so desktop
  WASD at 4 m/s reads as a fast walk and the XR stick at 3 m/s as a walk; the
  owner decides the state and streams `walk` / `run`. Head pitch on desktop
  is one `int16` in the frame (+6 B). A name sprite over the `head` anchor in
  the person's colour.
- **Yourself:** nothing on desktop, as now (a body at the camera clips, and
  the editor camera flies); the procedural controller meshes in XR. A blob
  shadow while riding or in play mode is the cheap grounding cue, later.

### 22.2 XR presence for others

- **Frame:** the player lane's message grows one optional field; NPC frames
  are unchanged. `b: Int16Array`, desktop `[pitch × 10000]`; XR `[flags, head
  p×3 q×4, left p×3 q×4, right p×3 q×4]` (22 values; p in mm in rig space, q
  × 32767; flags: 1 xr, 2 left present, 4 right present, 8 hand tracking).
  +50 B per frame: **4.9 KB/s per XR peer** at 20 Hz against 8.1 KB/s for a
  separate lane, because the envelope dominates.
- **Receiver:** samples keep `b`; positions lerp, rotations slerp between
  bracketing samples and hold during extrapolation; the decoded pose lands in
  `live.xr = { head, l, r, flags }` and reaches the kind as `vars.pose`.
- **Driving the rig, the smallest change:** in `kinds/rig.js` `animate()`,
  after the clip offsets, an exported `applyPose(root, entityRoot, pose,
  weight)` (about 25 lines) sets the local transform that puts a named bone at
  its target in entity space, blended by `weight`. Spiked in Node on the
  library wizard: exact placement, an exact return to the clip pose, 0.04–
  0.06 ms per avatar. Bones: `head` rotation from the headset; `hand_l` /
  `hand_r` full pose (floating hands; a two-bone arm IK is a 40-line
  follow-up, not v1); the model root as **body under the head**, at `head.xz`
  in rig space with a body yaw that follows the head through a ±35° dead zone
  and about 0.3 s of lag, so glances do not spin the torso. Crouch lowers the
  hips by eye height minus head height, or clips in v1.
- **Dropping to 2D:** the next frame has no xr flag; the override weight fades
  to 0 over 250 ms and the arms come back. A headset taken off stops the
  frame loop; after the 2.5 s stream TTL the avatar is removed, as any silent
  peer is.

### 22.3 Hits on players

- **Authority:** the victim's own peer, consistent with §0; the attacker's
  owner mints the hit id, as for doc entities, so a hit is idempotent.
- **Protocol (ephemeral, addressed, acked):**

  ```
  hit     { t: 'hit', to: '<victimPeer>', id: 'player:<victimPeer>', life: n, hits: [[hitId, amount, fromEntityId], …] }
  hitack  { t: 'hitack', to: '<attackerPeer>', ids: [hitId, …] }
  ```

  The attacker's owner sends at once and re-sends at 200, 400, 800 and
  1600 ms, batched per victim, until acked, until the victim leaves presence
  or after the last try. The victim keeps an LRU of 512 seen ids across lives;
  an unseen id whose `life` matches the current life goes into `live.hits`
  (which `hpOf` already merges); a seen id or an old life is acked and not
  applied, so a retried hit from before a respawn cannot hurt the new life.
  `attack.js` already emits exactly this event and needs no change; the module
  is `src/net/hits.js`, about 80 lines. hp, `dead` and `life` are echoed in
  presence, so every peer's copy of the player takes `tags.dead` and predators
  drop it. Two simulators of one predator during a partition deal double
  damage, the same as for animals today. **No doc writes**, so §14 holds.
- **Opt-in per world through a reserved `player` preset.** When a world
  defines `presets.player`, `makePlayers` merges an allowlist of its
  components into every local player: `health`, `tags`, `attack`, `body`.
  Never `brain`, `perception` or `representation`: a player is never
  AI-driven and the avatar stays the person's choice. A world that wants
  everyone hunted writes `player: { components: { health: { max: 100 }, tags:
  { prey: true } } }`. That is authored world rule, not player state. With no
  `player` preset, players stay invulnerable, which is today's behaviour, and
  the templates do not define one.
- **Death and respawn, on the player's own peer:** the health system already
  emits `died` for your own player; a reaction in `players.js` sets
  `tags.dead`, drops `controller` so input stops, streams `die` so others see
  the rig fall, dismounts (the mount falls back to the host) and echoes
  presence. Desktop: the camera stays, with an overlay ("Knocked out by T-rex,
  back in 5 s"). XR: a grey vignette and never a forced camera move. After
  `world.players.respawnS` (default 5): teleport to `world.players.spawn` or
  the origin edge, `life++`, clear `live.hits` (keep `seen`), restore
  components, echo presence; in XR fade, teleport, fade back. A reload is a
  full heal, by design, and the UI says so.
- **Damage dealt by players:** the `player` preset may carry `attack`; the
  input map gains `attack: <targetId>` (desktop click on the entity under the
  reticle in play mode, XR trigger while the ray hovers one); `control.js`
  sets a one-tick `strike` intent; `attack.js` applies reach and cooldown
  unchanged and writes the doc `hit` for an animal. **v1 is animals only:**
  a player target is ignored, so there is no player-versus-player until it is
  asked for.
- **Rejected:** a per-player doc record (breaks §14, unauthenticated, and
  anyone could damage or heal anyone); players as doc entities (litter per
  session, and the stream is still needed).

### 22.4 The identity link (§19.4, item 1, decided)

Presence v2:

```
{ v: 2, id: 'u_<10 base64url>', name, color, avatar: { model, color }, mode: 'desktop' | 'xr',
  riding: { mount, seat } | null, hp?: [hp, max], dead?: true, life?: n }
```

- **`id` is a per-world pseudonym:** `u_` + 10 characters of
  `SHA-256(secret ‖ docId)`, with `secret` 16 random bytes in
  `localStorage['mm:me']`. Stable for a person across tabs and reloads within
  one world, and not linkable across worlds, because the public sync server
  is one shared room for every world. Name, colour and avatar live beside it
  (`mm:name`, `mm:color`, `mm:avatar`).
- **The stream, ownership and pins are unchanged**: entities stay
  `player:<peerId>` and a pin is a peer id, because simulation is per tab.
  Receivers map peer → person through presence, and the UI renders people:
  one topbar chip per identity with a tab count, coloured with `info.color`
  (which fixes the unused colour); "simulated by Ada" and "held by you
  (another tab)" in the inspector; rename, colour and avatar on your own chip.
- **Two tabs of one person:** a hidden tab already says `bye`, so only the
  visible tab is present; two visible windows are two bodies with one name,
  which is honest. **A duplicated tab** detects its twin over
  `BroadcastChannel('mm:tabs')` with an in-memory nonce and mints a fresh peer
  id before the repo opens (about 100 ms at boot).
- **Trust:** the identity is a label anyone can claim, and the UI says so. A
  later keypair is a non-extractable WebCrypto key in IndexedDB, and it proves
  "this browser on this origin", not "this person": on the shared Pages
  origin any app there can read the secret or ask the key to sign.
- **Attribution in history (§19.4, item 4) uses this pseudonym.** That puts a
  per-world pseudonymous id permanently in shared history: a small, deliberate
  exception to §14, accepted here because the pseudonym cannot be linked
  across worlds.

### 22.5 The persistence boundary, restated

**The doc may hold rules about players, never records of a player.** Name,
colour, avatar and the identity secret are `localStorage`; the `player`
preset, `world.players.spawn` and `respawnS` are doc rules, the same for
everyone; hp, death and the life counter are live and presence, lost on
reload by design. Across the line, and refused: hp that survives a reload,
inventories, currency, score, a home, "my horse" kept by person, roles and
bans. Each is a record per person that an unauthenticated identity cannot
protect, and the last two are permissions in disguise (§19.4, item 8).

### 22.6 Order of work, verification, spikes

Order: (1) the locomotion fix (`live.v`, `body.speed`), since every avatar
slides without it; (2) the `traveller` model and avatars from presence;
(3) the XR block and `applyPose`; (4) hits, opt-in; (5) presence v2 and the
identity UI. Unit: frame encode and decode with the `b` block; `applyPose` on
the library models; the hit protocol in Node over fake channels that drop
30 % and duplicate 10 % of messages (1000 hits applied exactly once, a
respawn mid-retry never hurts the new life). e2e: a remote walker shows
`walk`; an avatar from presence in a pre-library world; a T-rex hurts a
player in a world with a `player` preset and never in one without; death,
respawn and the presence echo on the second tab. `test/xr.mjs`: one page
under IWER streams the block and the second shows floating hands within
160 ms. Spikes: XR avatar end to end (half a day); body-under-head comfort in
a real headset (by hand); re-gossip at 8–16 players, since each tab uploads
every player's frames (about 63 KB/s per tab at 16 players before any NPC),
which caps session size more than XR does.

### 22.7 Open

- Should the Animal meadow template define a `player` preset, so that the
  T-rex threatens people out of the box? Decided above: no template does, so
  worlds are safe by default; say if you want the meadow hunted.
- A costume world that forces a look on every player would put
  `representation` on the allowlist; decided no for v1.
