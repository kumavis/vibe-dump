# Prior art: adopt an engine, adopt a core, or write our own?

Dimension: **prior-art**. Researcher scratch: `/tmp/claude-0/-home-user-vibe-dump/f580ed5c-7e6e-5a9a-b50f-88ecc42cf4d9/scratchpad/research/prior-art/`
(`bench/` = installs, Vite builds, experiments; `src/` = shallow clones of upstream source that I read; `needle/`, `bench/af/` = test apps).

Date: 2026-10-28. Node 22.22.0, npm 10.9.4, Vite 5.4.21, Playwright Chromium (pre-installed).

Grades: **[V] verified** (I ran it or read the current source line), **[L] likely** (docs / strong inference), **[S] speculative**.

---

## 0. Verdict (TL;DR)

**Write our own small core, in vanilla JS on plain three.js — and borrow heavily.** No candidate can be adopted wholesale, and no candidate's core
can be lifted out without fighting its sync model. The reasons are structural, not cosmetic:

| Blocker | Who it kills |
|---|---|
| Needs a server of its own (authoritative world server / signalling / relay) | Hyperfy (fastify + sqlite + ws, GPL-3.0), Hubs (Reticulum/Phoenix + Dialog), networked-aframe (socket.io/easyrtc/uws server), Needle (networking-2.needle.tools), Croquet/Multisynq (their reflector network + API key), PlayCanvas Editor (proprietary backend + ShareDB) |
| Not open source / proprietary editor | Needle (own EULA, "not open source"), Spline (SaaS), Rogue Engine (proprietary, free < $80k), Wonderland (EULA, editor desktop app) |
| Not three.js | Wonderland (C++/WASM), PlayCanvas, Babylon (+ Electron editor), Decentraland (Unity/Bevy explorers) |
| Sync model contradicts "Automerge doc is the source of truth" | Croquet (replicated deterministic VM, session id = hash of model code), Hyperfy (server DB is truth, rebuild-on-modify), NAF/Hubs (owner broadcasts ephemeral component state; persistence is a server pin) |
| Its scene format is unsafe under CRDT merge | three.js editor / `Object3D.toJSON` (matrix arrays corrupt on concurrent merge — measured, §3.1), nested children arrays (duplicate entities on concurrent reparent — measured) |

But every one of these systems solved a piece of our problem well, and the 10 ideas in §5 add up to almost the whole architecture. In particular,
**Croquet Microverse** (behaviours-as-source-in-the-shared-model, hot-swapped), **networked-aframe / Hubs** (single owner simulates each entity),
**Decentraland SDK7** (CRDT granularity = one (entity, component) pair; events as append-only sets), **PlayCanvas Editor** (flat entity map
synced path-by-path + an agent-facing "driver" API exposed over MCP), **Hyperfy** (SES Compartment scripts, crash-block fallback, blueprint
vs instance) and **the in-repo `tails-and-scales`** (the Automerge-repo + wss://sync.automerge.org + IndexedDB + ephemeral presence bootstrap that
already ships in this monorepo).

Cost of "write our own": roughly 1.5-3k lines for core + editor (the ECS bookkeeping is ~200 lines; the expensive parts are editor UI,
asset loading, XR input, and the doc<->runtime bridge, which we'd have to write against any of the candidates anyway). What it forecloses: no
ready-made inspector (A-Frame's), no physics/avatars/voice out of the box (Hyperfy), no Unity-style asset pipeline (Needle).

---

## 1. Candidate-by-candidate

Sizes are from my own Vite 5 builds of a minimal entry for each (`bench/e/*.js`, `bench/vite.config.js`), gzip -9 of all emitted JS.

| Candidate | Tested version | License | JS (raw / gz) | Static on Pages? | Sync model | WebXR | Runtime extensibility | Bend toward Automerge-as-truth |
|---|---|---|---|---|---|---|---|---|
| three.js (baseline) | three@0.186.1 | MIT | 515 KB / 128 KB | yes | none | `renderer.xr` | n/a | n/a |
| A-Frame | aframe@1.8.0 (bundles super-three@0.184.0) | MIT | 1,323 KB / 358 KB | yes [V] | none (DOM) | first-class [V] | `registerComponent` at runtime [V]; re-register throws [V] | medium-hard: state lives in object3D, not attributes [V] |
| networked-aframe | 0.14.3 | MIT | 1,395 KB / 375 KB (with A-Frame) | client yes, but needs a server/adapter [V] | single-owner broadcast, `lastOwnerTime` LWW [V] | via A-Frame | templates + schemas | hard: write an Automerge adapter; NAF state is ephemeral |
| Hyperfy v2 | git HEAD 2025-12-18 (pkg 0.16.0); npm `hyperfy@2.40.0` is the old v1 | **GPL-3.0** [V] | not built (see §1.3) | no: fastify + better-sqlite3 + ws server [V] | authoritative server, DB is truth [V] | yes (`systems/XR.js`) [V] | blueprint scripts in SES Compartments, AI writes whole script [V] | very hard + GPL |
| Mozilla Hubs (Hubs Foundation) | git HEAD 2026-08-23 | **MPL-2.0** [V] | not built | no: Reticulum (Phoenix) + Dialog SFU [L] | owner/creator, Phoenix channel, server-pinned persistence [V] | yes (A-Frame fork) | inflators, bitECS systems (forked bitECS/three/aframe) [V] | very hard |
| Needle Engine | @needle-tools/engine@5.1.16 (stable) | **proprietary EULA** [V] | 6,976 KB / 2,216 KB JS + 3.4 MB wasm [V] | builds, but calls cdn.needle.tools + networking-2.needle.tools [V] | Needle's room server [V] | first-class [L] | Unity/Blender-exported components | no (license) |
| Croquet / Multisynq | @croquet/croquet@2.0.4, @multisynq/client@1.1.0 | Apache-2.0 client | 358 KB / 122 KB; 383 KB / 115 KB | client yes, but needs their reflectors + API key [V] | replicated deterministic VM; session id hashes model code [V] | via Worldcore/Microverse | Microverse: behaviours as code in the model [V] | incompatible (would replace Automerge) |
| Croquet Microverse | git HEAD 2025-10-30 | Apache-2.0 [V] | not built | needs Croquet | as above | yes [L] | **behaviour modules, hot-edited live** [V] | idea donor only |
| PlayCanvas engine + Editor | playcanvas@2.23.3; editor git HEAD 2026-10-28 | MIT (editor frontend MIT since Aug 2025) [V] | (not three) | editor needs PlayCanvas backend [V] | ShareDB (OT) path ops on flat entity map [V] | yes | script components; **MCP "driver" API** [V] | idea donor only |
| Babylon.js + Editor | @babylonjs/core@9.32.1 | Apache-2.0 | (not three) | engine yes; editor is Electron desktop [L] | none | yes | editor scripts | n/a |
| Wonderland Engine | @wonderlandengine/api@1.6.1 | API MIT; runtime+editor EULA [L] | (not three, WASM) | yes | none (Croquet integration exists) | first-class | TS components | n/a |
| Decentraland SDK7 | @dcl/ecs@7.31.0 | Apache-2.0 [V] | did not bundle (missing transitive `@protobufjs/utf8`, protobuf schemas) [V] | n/a (runs in explorer) | **CRDT: LWW per (entity, component) + grow-only value sets** [V] | explorer | components are protobuf schemas | idea donor (best CRDT reference) |
| three.js editor | three r186 `editor/` | MIT | — | yes | none; single user | `Viewport.XR.js` | per-object scripts via `new Function` [V] | format unsafe under merge [V] |
| Spline | @splinetool/runtime@2.0.118 | no license field; SaaS | — | runtime yes | Spline cloud | limited | no | no |
| Rogue Engine | not on npm | proprietary, free < $80k/yr [L] | — | exports static | plugins | — | Unity-like components | no |
| bitECS | bitecs@0.4.0 | MPL-2.0 [V] | 12.6 KB / 4.8 KB | yes | none (has serializers) | — | components are any object [V]; observers [V]; `IsA` prefabs [V] | as a runtime index: fine |
| miniplex | miniplex@2.0.0 | MIT | 16.4 KB / 4.1 KB | yes | none | — | entities are plain objects, string component keys [V] | closest to doc shape |
| koota | koota@0.6.6 (pmndrs) | ISC | 37.6 KB / 11.3 KB | yes | none | — | traits | fine |
| becsy | @lastolivegames/becsy@0.16.1 | MIT | 108 KB / 26 KB | yes | none | — | needs declared schemas | stiff |
| Yjs (alt CRDT) | yjs@13.6.33 | MIT | 76 KB / 23 KB | yes | CRDT | — | — | (comparison only) |
| automerge-repo (slim + base64 wasm) | @automerge/automerge-repo@2.5.6 | MIT | 5,064 KB / 1,700 KB (base64-inlined wasm) [V] | yes (in-repo `tails-and-scales` already ships it with `?url` wasm) [V] | CRDT | — | — | the truth |
| @endo/captp + @endo/far | @endo/captp@4.5.1 | Apache-2.0 | 63.7 KB / 22.4 KB | yes | — | — | — | — |

### 1.1 A-Frame + networked-aframe [V]
Built `bench/af/` (Vite, A-Frame 1.8.0) and drove it in Playwright (`bench/af-test.cjs`). Results (verbatim JSON from the run):
```
bootMs 155, threeRev "184" (A-Frame ships its own super-three fork), hasXR true
chase/flee registered at runtime from a source string via (0,eval): after 1s trex [3.99,0,0], sheep [7.99,0,0]
visual swap (innerHTML a-image -> a-box): chase component kept, health hp 100 kept
re-registering 'chase': throws "The component `chase` has been already registered..."
serialized after flushToDOM: <a-entity id="trex" position="0 0 0" ... chase="target: #sheep; speed: 4">
```
- The last line matters: the T-rex had moved to x=3.99 but `position="0 0 0"` — systems that mutate `object3D` directly bypass A-Frame's
  attribute state, so "DOM is the scene definition" stops being true the moment behaviours run. A doc<->DOM bridge would have to choose between
  `setAttribute` every frame (slow, A-Frame docs warn against) or a second channel for simulated transforms — the same split we need anyway.
- Hot-reload of behaviour code needs `delete AFRAME.components[name]` hacks; live instances keep the old prototype [L].
- It locks us to A-Frame's three fork (r184 while the repo's apps use 0.160 and npm has 0.186), +230 KB gz over plain three.
- Inspector (`aframe-inspector`) is fetched from unpkg/aframe.io at runtime by default (`src/components/scene/inspector.js:17-18`), i.e. a CDN
  request, contrary to the repo's offline preference; it can be bundled (+10 MB unpacked package).
- NAF: `src/components/networked.js` — per-entity `owner`/`creator`, `takeOwnership()` stamped with `lastOwnerTime` (server time), incoming
  updates ignored unless from the current owner (lines 489-491), creator re-owns if owner leaves. Adapters (`src/adapters/*`) all assume a
  server (socket.io, easyrtc, uws, WebRTC with signalling). The model is ephemeral; nothing persists without a server.
**Verdict:** borrow NAF's ownership protocol, skip A-Frame as runtime.

### 1.2 Croquet / Multisynq / Microverse [V]
- The Multisynq client computes the session id as `hash(appId | name | options | codeHash)` where `codeHash` hashes the registered Model
  classes' source (`bundled/multisynq-client.esm.js`, function around `computedCodeHash`). Change the model code and you are in a different
  session unless you pass `overrideHash` and migrate snapshots. Agent-authored live code therefore cannot be plain Model code.
- Microverse gets around this by putting behaviour **source text inside the replicated model** and compiling it on every peer
  (`src/code.js:618-700`, `ScriptingBehavior.compileBehavior` -> `new Function("Microverse", code)`; `setCode` publishes the new text;
  `BehaviorModelManager` swaps live with `teardown()` then `setup()`). Cards list `behaviorModules: ["Spin", ...]` (`worlds/default.js`).
  Behaviours are split into **ActorBehavior** (replicated/shared) and **PawnBehavior** (view-local: pointer, rendering)
  (`behaviors/default/spin.js`). `behaviors/croquet/elected.js` elects one peer to do non-deterministic I/O.
- The reflector network is theirs (`wss://api.multisynq.io/depin`, `api.croquet.io/reflector`), API key required, and it replaces the CRDT:
  the persisted thing is a snapshot of the VM, not a document a human/agent can patch. Determinism is also fragile in practice: the in-repo
  `tails-and-scales` DESIGN.md §0.1 records that Node's V8 and Playwright Chromium disagree in the last bit of `Math.sin/cos` for ~3% of inputs
  and `pow` for ~10%, which forced a whole hash/desync machinery. Agent-written behaviours will not be deterministic.
**Verdict:** borrow Microverse's behaviour-module design and the elected-peer idea; reject replicated-VM sync.

### 1.3 Hyperfy v2 [V by source reading; not executed]
I cloned `hyperfy-xyz/hyperfy` (HEAD 2025-12-18) and read it. **License: GPL-3.0** (`LICENSE`). Running its build scripts from the clone was
blocked by this session's sandbox policy (external code), so it was not built; the conclusions below are from source.
- Architecture: `src/core/World.js` registers systems (`register(key, System)`), fixed-step loop (`fixedDeltaTime 1/50`, `maxDeltaTime 1/30`,
  `networkRate 1/8` = 8 Hz), and a "hot" set so only entities that asked for per-frame updates are ticked.
- Data: `Blueprints` (`systems/Blueprints.js`) hold `{id, model, script, props, version, ...}`; entities are `{id, type:'app', blueprint,
  position, quaternion, scale, state, mover, uploader}`. `Blueprints.modify` -> every instance `entity.build()` from scratch.
- `entities/App.js build()`: load glb + script; on failure show `crash-block.glb`; `unbuild()` emits `destroy`, clears listeners, aborts
  fetches; while building, incoming events are queued and replayed only if `event.version <= blueprint.version`.
- Scripts run in an SES `Compartment` with a whitelist (`systems/Scripts.js`; `lockdown.js` uses `errorTaming:'unsafe'`, `__hardenTaming__:'unsafe'`),
  wrapped as `(world, app, fetch, props, setTimeout) => { ...code }`.
- Networking is server-authoritative: `systems/ServerNetwork.js` persists blueprints/entities to SQLite via knex and relays `entityModified`.
- AI: `systems/ServerAI.js` asks an LLM (Anthropic/OpenAI/xAI/Google) to write/edit/fix **the whole script** of a blueprint — coarse-grained
  codegen, not structured edits.
- Also: PhysX wasm (27k-line binding), VRM avatars, LiveKit voice — a lot we don't want.
**Verdict:** borrow SES-compartment scripts, crash fallback, blueprint/instance split, build/unbuild lifecycle; don't take code (GPL, server).

### 1.4 Mozilla Hubs (bitECS client) [V by source reading]
`Hubs-Foundation/hubs` (MPL-2.0) HEAD 2026-08-23; uses forks of three, aframe and bitECS from github (package.json lines 83, 87, 139).
- `src/utils/jsx-entity.ts`: **inflators** — a JSON entity def `{components:{name: props}, attrs, children}` is turned into runtime state by
  `jsxInflators[name](world, eid, props)`; unknown names throw. `addObject3DComponent` / `swapObject3DComponent` keep a side table
  `world.eid2obj` so the three object behind an entity can be replaced without touching its other components.
- `src/bit-systems/network-send-system.ts`: owned+networked query; only owners send; full sync to new joiners from the creator.
- `src/utils/define-network-schema.js`: shadow copies per component to send only changed props.
- `src/bit-systems/entity-persistence-system.ts`: debounced persistence (500 ms after last change, at most 3 s) to the server.
**Verdict:** borrow inflators, eid->Object3D side table/swap, owner-sends, debounced persistence. Not adoptable (server, forks).

### 1.5 Needle Engine [V]
Installed stable 5.1.16, built a minimal `<needle-engine>` + `Behaviour` app with Vite 5: 6.98 MB JS raw / 2.22 MB gz plus 3.4 MB MaterialX wasm
and rapier; bundle references `wss://networking-2.needle.tools/socket` and `cdn.needle.tools` (fonts, branding, skybox). `LICENSE.md`:
"not open source"; commercial use needs eligibility under their EULA. **Reject.**

### 1.6 PlayCanvas Editor (open-sourced frontend, MIT) [V]
- `src/editor/entities/entities-sync.ts`: each entity is an Observer synced at paths `name, tags, parent, children, position, rotation, scale,
  enabled, template, template_id, template_ent_ids, components` under `['entities', resource_id]` via ShareDB json0 ops. Flat map keyed by id.
- `src/editor/driver/*.ts` + `src/editor/mcp/register.ts`: every editor capability is a named driver method (`entities:create`,
  `entities:modify` (batched edits), `entities:components:add/remove`, `entities:reparent`, `entities:scripts:add`, `assets:script:text:set`,
  `viewport:capture` (screenshot), `viewport:focus`, `history:undo/redo`, `editor:logs`, `selection:get/set`, `templates:apply/revert`...), and
  `register.ts` exposes the whole driver to an MCP relay for AI agents. This is the closest existing thing to our CapTP surface.
**Verdict:** borrow the agent API shape (and especially `viewport:capture` + `editor:logs` + undo for the agent's feedback loop).

### 1.7 Decentraland SDK7 `@dcl/ecs` [V]
`dist/engine/lww-element-set-component-definition.js`: each component keeps a Lamport timestamp **per entity**; incoming PUT wins if newer,
ties broken by comparing serialized bytes; DELETE is a tombstone. `grow-only-value-set-component-definition.js`: append-only, timestamp-sorted
value sets for event-like components (pointer results, raycast results). This is the cleanest statement of "what granularity should conflicts
have in a CRDT-synced ECS": the (entity, component) pair, plus append-only channels for events. Automerge gives us per-field LWW for free, so
we can be even finer — but the DCL rule "a component is replaced as a unit unless it's a known mergeable shape" avoids mixed-version components.

### 1.8 three.js editor [V]
- `editor/js/Editor.js toJSON()` => `{metadata, project, camera, controls, scene: scene.toJSON(), scripts: {uuid: [{name, source}]}, history}`.
- `editor/js/libs/app.js:73-115`: scripts are compiled with `new Function('player,renderer,scene,camera,init,start,stop,keydown,...,update', source)`
  bound to the object; events dispatched by name.
- `editor/js/commands/*`: every edit is a Command with `execute/undo/toJSON/fromJSON` — serializable history.
- The scene format is `Object3D.toJSON()`: `object.matrix` (16 floats), `children` arrays, geometry/material tables keyed by uuid.
  See §3.1 for why that is a bad CRDT shape. Two community "collaborative three editor" prototypes exist: `jvera71/ThreejsEditorCollaborative`
  (2026-05; maps editor Commands to LWW path ops over a SignalR server) and `pramishp/space-fe` (2024; React + Yjs maps `objects/geometries/materials`
  keyed by uuid, y-websocket server). I found **no** existing Automerge + three.js engine or editor project. [V for the two repos; L for "none exist"]

### 1.9 In-repo prior art: `packages/tails-and-scales` [V]
Already ships Automerge in this monorepo: `@automerge/automerge@3.5.0` + `automerge-repo@2.5.6` (slim) + websocket (`wss://sync.automerge.org`)
+ BroadcastChannel + IndexedDB, wasm fetched as `?url` and lazily `import()`ed (`net/repo.js`), link = capability (`#m=`), ephemeral presence over
`handle.broadcast` with a 5 s heartbeat and strict validation of peers' messages (`net/presence.js`). Its design (DESIGN.md §0) keeps
**game state out of the doc** — the doc is an append-only command log folded deterministically — and pays for that with the float-determinism
machinery above. For a live-edited world we want the opposite trade (authored state in the doc), but its bootstrap code is directly reusable
(copy, since cross-package imports are banned by CLAUDE.md).

---

## 2. ECS libraries as a runtime index (not as source of truth) [V]
`bench/exp-ecslibs.mjs`:
```
miniplex { predatorsBefore: 0, predatorsAfter: 1, preyAddedEvents: 1, runtimeComponent: 1 }
bitecs   { inheritsHealthComponent: true, predatorObserver: 1, hpVia: undefined }
koota    { q: 1 }
```
- miniplex (4 KB gz): entities are plain objects whose keys are component names; `world.with('predator','transform')` archetype views update on
  `addComponent`; a never-declared component name invented at runtime by an agent "just works". That is the same shape as an Automerge entity
  record, so it is the least-friction index.
- bitECS 0.4 (4.8 KB gz, MPL-2.0): components can be any object; `observe(onAdd(C))` works; `IsA` prefab inheritance makes the instance match
  queries for the prefab's components, but data inheritance is NOT automatic (`hpVia: undefined`) — needs onSet/onGet observers.
- Any of them is ≤ 11 KB gz; none needs to be the truth. Recommendation: a ~150-line in-house index (or miniplex) keyed by doc entity id.

---

## 3. Experiments that decide the data model

### 3.1 three.js JSON format under concurrent Automerge edits [V] (`bench/exp-three-json.mjs`)
50-mesh scene: `toJSON` 20,501 bytes, Automerge `save` 5,458 bytes. Two peers edit the same object concurrently:
```
whole-array replace (pos edit vs scale edit) -> merged matrix [2,0,0,0,0,2,0,0,0,0,2,0,3,0,0,1]  conflicts: true   (position edit lost)
element-wise (pos vs scale)                 -> pos [3,5,0], scale [2,2,2]                        (survives by luck: disjoint cells)
element-wise (rotation vs scale)            -> matrix [0.54,0,-0.841,0, 0,2,0,0, 0.841,0,0.54,0, 3,0,0,1]  det 2.000, expected 8
                                               (a non-uniformly scaled, sheared result neither peer wrote)
ECS fields {p, r, s} separately             -> {"p":[3,0,0],"r":[0,0.479,0,0.878],"s":[2,2,2]}   (both edits kept)
```
**Store decomposed TRS per entity, never matrices.** Treat a quaternion/vec as an atomic value (replace whole array; element-wise writes can
produce non-unit quaternions the same way).

### 3.2 Tree shape under concurrent reparent [V] (`bench/exp-reparent.mjs`)
```
nested children arrays (three JSON / A-Frame DOM / JSX trees): X ends up under BOTH P1 and P2  (entity duplicated)
flat map + parent pointer: X.parent = "P1" (deterministic LWW; conflict visible via getConflicts)
delete entity vs concurrent edit of it: delete wins (edit lost)
```
**Flat `entities: {id: {...}}` map with `parent` field; children order, if needed, as a separate sortable key.** This is also exactly
PlayCanvas's and Hyperfy's shape, and it argues against storing a react-three-fiber/JSX-like nested tree in the doc.

### 3.3 Cost of streaming simulation into the doc [V] (`bench/exp-growth.mjs`)
20 entities, position written at 10 Hz for 60 s:
```
rounded floats, element-wise:  doc 1,315 B -> 39,851 B (+37.6 KB/min), 3.45 ms CPU per change (Node), load 33.5 ms
whole-array replace, raw floats: 155.2 KB after 60 s
```
=> 2.2-9 MB per hour of play for 20 moving actors, forever, on every peer and on the public sync server. This is why NAF/Hubs/Hyperfy all
separate **ephemeral transform streaming** (8-10 Hz to peers) from **persisted state** (debounced). We should do the same: the doc holds authored
state + low-rate checkpoints (Hubs: 500 ms debounce / 3 s max); live sim state goes over `handle.broadcast` (as `tails-and-scales/net/presence.js` does).

### 3.4 SES works with three + Automerge in the browser [V] (`bench/e/seslock.js`, run in Playwright)
`lockdown({errorTaming:'unsafe', overrideTaming:'severe', __hardenTaming__:'unsafe', consoleTaming:'unsafe'})`, then three r186 `WebGLRenderer`
render + automerge-repo create/change + a Compartment-evaluated behaviour:
```
{"hp":2,"rendered":1,"compartmentSeesDocument":"undefined","eHp":4,"xr":true}   warnings: only "Removing intrinsics.%IteratorPrototype%.join"
```
Same in Node (`bench/exp-ses.mjs`), where a Compartment without `fetch` endowment fails `globalThis.fetch(...)`. Hyperfy proves the same in
production. Relevant because @endo/captp is the agent channel: one SES world for both. (Note: `lockdown` must run before three/automerge load.)

### 3.5 The borrowed architecture, end to end, two peers [V] (`bench/exp-borrowed.mjs`)
Pure Node, real Automerge sync protocol between two peers (`generateSyncMessage/receiveSyncMessage`), behaviours stored as source in the doc and
compiled in SES Compartments, systems selected by component presence, each entity simulated only by its `owner`, cross-owner damage through a
per-target `inbox` list that only the target's owner drains:
```
sheep hp after 6s (bitten via inbox written by alice, applied by owner bob): 0
after 6s: {"sheep":"19,0,0","trex":"18,0,0"} {"sheep":"19,0,0","trex":"18,0,0"} heads equal true
trex components now: health,predator,tags,transform,visual,animator        (billboard -> gltf -> +animator; behaviour untouched)
after hot-swap 1s trex moved 1 (speed 4 -> 1, expect ~1.0)                  (agent edited behaviours.predator.source)
alice log compiled predator | compiled prey | teardown predator | compiled predator   (same on bob)
concurrent hp + visual edit merged: {"hp":5,"visual":"gltf"}
sync messages exchanged 248, doc bytes 3798
```
The T-rex chases and the sheep flees purely because of `predator: {eats:['woolly']}` / `prey: {fearRadius}` / `tags: {woolly}` components —
no entity "type". (Caveat: this prototype writes transforms into the doc every tick for simplicity; §3.3 says production must not.)

---

## 4. Answer: adopt X wholesale / adopt X's core / borrow ideas / write our own?

- **Adopt wholesale: none.** Every full engine needs its own server, or is proprietary, or not three.js, or all three (§0 table).
- **Adopt a core: none worth it.** The only adoptable cores are tiny ECS indexes (miniplex 4 KB, bitECS 5 KB, koota 11 KB). Use one only if the
  implementer prefers; a hand-written index of ~150 lines matches the doc shape better and avoids MPL (bitECS) questions. A-Frame would be the
  only "engine core" that is static, MIT and XR-ready, and it costs +230 KB gz, a three fork, DOM-as-state that diverges from simulated state
  (§1.1), and a second bridge anyway.
- **Borrow ideas, write our own: yes.**

---

## 5. The 10 ideas most worth borrowing (with source pointers)

1. **Flat entity map + component bags, decomposed TRS, parent pointer** — PlayCanvas `src/editor/entities/entities-sync.ts` (syncPaths), Hyperfy entity
   data (`src/core/entities/App.js modify()`); validated by §3.1/§3.2. Doc: `entities[id] = {name, parent, owner, components: {transform:{p,r,s}, ...}}`.
2. **Conflict granularity = (entity, component); events as append-only sets** — Decentraland `@dcl/ecs/dist/engine/lww-element-set-component-definition.js`
   and `grow-only-value-set-component-definition.js`. In Automerge: replace small components/vectors atomically; damage/interaction events as
   lists that the target's owner drains (§3.5 `inbox`).
3. **Single owner simulates each entity; ownership is LWW-claimable; creator/elected peer inherits orphans** — networked-aframe
   `src/components/networked.js` (`takeOwnership`, `lastOwnerTime`, lines 227-295, 448-491), Hubs `src/bit-systems/network-send-system.ts`,
   Microverse `behaviors/croquet/elected.js`. Solves "who runs the T-rex AI" without determinism.
4. **Ephemeral streaming vs persisted checkpoints** — Hyperfy `networkRate = 1/8`, NAF lerp on non-owners, Hubs
   `entity-persistence-system.ts` (500 ms debounce / 3 s max). Use `handle.broadcast` for live transforms (pattern already in
   `packages/tails-and-scales/net/presence.js`), write to the doc on rest/debounce. §3.3 numbers.
5. **Behaviours as source text in the shared doc, compiled per peer, hot-swapped with `setup`/`teardown`; actor (shared) vs pawn (local view)
   halves** — Croquet Microverse `src/code.js` (`ScriptingBehavior.compileBehavior/setCode`, `BehaviorModelManager`), `behaviors/default/spin.js`.
   Entities opt in by listing components; a behaviour declares the component query it runs on.
6. **SES Compartment sandbox with an explicit endowment whitelist; crash -> placeholder, not page death** — Hyperfy `src/core/systems/Scripts.js`,
   `src/core/lockdown.js`, `App.js build()` (crash-block). Verified working with three + Automerge (§3.4); shares SES with @endo/captp.
7. **Inflators: component data -> runtime objects through a registry keyed by component name** — Hubs `src/utils/jsx-entity.ts`
   (`jsxInflators`, `renderAsEntity`). The registry itself is extensible at runtime (a doc-stored behaviour can register a new inflator).
8. **Visual is just another component, backed by a swappable Object3D side table** — Hubs `swapObject3DComponent` / `world.eid2obj`,
   Microverse `placeholder*` card fields. `visual: {kind:'billboard'|'gltf'|'prim'|..., ...}` + optional `animator` component; the renderer
   system unbuilds/rebuilds only the visual when `visual` changes. Behaviours never touch the Object3D directly; they read/write `transform`.
9. **Blueprint/prefab vs instance with overrides** — Hyperfy `src/core/systems/Blueprints.js` (modify blueprint -> rebuild all instances),
   PlayCanvas templates (`templates:apply/revert/overrides:get` in `src/editor/driver/asset.ts`), bitECS `IsA` prefabs. Lets "make every sheep
   faster" be one edit; an instance stores only overrides. (bitECS shows data inheritance needs explicit resolution — §2.)
10. **Agent API = the editor's own command set, batched, plus perception (screenshot, logs) and undo** — PlayCanvas `src/editor/driver/entity.ts`
    + `src/editor/mcp/register.ts`; three editor `editor/js/commands/*` (serializable Commands). Expose the same object over CapTP
    (`E(scene).createEntity(...)`, `modify([...edits])`, `defineBehavior(name, source)`, `capture()`, `logs()`, `undo()`), and route both human
    editor and agent through it so they can't diverge. Hyperfy's "LLM rewrites the whole script" (`ServerAI.js`) is the anti-pattern for
    incremental edits.

Bonus (in-repo, copy not import): `packages/tails-and-scales/net/repo.js` (lazy slim automerge-repo, `?url` wasm, IndexedDB, BroadcastChannel,
`wss://sync.automerge.org`, link-as-capability) and `net/presence.js` (validated ephemeral messages).

---

## 6. Risks / open questions
- Ownership handoff under partition: two peers can both believe they own an entity until merge; LWW resolves it but both simulate for a while
  (cosmetic jitter). [L]
- Delete-vs-edit: delete wins in Automerge (§3.2) — an agent editing an entity a human just deleted silently loses its edit; surface it.
- Behaviour code in the doc is code execution from any doc writer: the share link must distinguish view vs edit (sync.automerge.org has no
  access control — anyone with the URL can write). Compartments limit blast radius, not trust. [V for no auth on public server per tails-and-scales notes; L otherwise]
- `lockdown()` must precede three/automerge imports; some libraries mutate intrinsics and break under lockdown (Hyperfy needed
  `__hardenTaming__:'unsafe'` for Monaco). Test every dependency we add. [L]
- Automerge bundle is the heavyweight (1.7 MB gz if base64-inlined; less with `?url` wasm and lazy load as tails-and-scales does).
- Hyperfy could not be built here (sandbox blocked running its scripts); claims about it are from source reading.

## 7. Reproduce
```
cd /tmp/claude-0/-home-user-vibe-dump/f580ed5c-7e6e-5a9a-b50f-88ecc42cf4d9/scratchpad/research/prior-art/bench
for n in three aframe naf bitecs koota miniplex becsy croquet multisynq yjs captp automerge; do N=$n npx vite build; done
node af-test.cjs af/dist          # A-Frame runtime components, visual swap, serialization
node exp-three-json.mjs           # matrix corruption under merge
node exp-reparent.mjs             # nested vs flat tree
node exp-growth.mjs               # doc growth from streaming transforms
node exp-ses.mjs; N=seslock npx vite build && node run-page.cjs out/seslock b/seslock.html
node exp-ecslibs.mjs              # miniplex / bitecs / koota runtime components
node exp-borrowed.mjs             # end-to-end borrowed architecture, two peers
```
