# ECS dimension: which entity/component/system model holds the world

Researcher: "ecs". Date: 2026-10-28. Node 22.22.0, Chromium (Playwright) for the browser check.
Every number below comes from code in this directory:
`/tmp/claude-0/-home-user-vibe-dump/f580ed5c-7e6e-5a9a-b50f-88ecc42cf4d9/scratchpad/research/ecs/`

| file | what it is |
| --- | --- |
| `core/world.mjs` | the hand-rolled doc-backed ECS core (96 lines) |
| `core/content.mjs` | generic components and systems: transform, billboard, mesh, animator, hunts, flees, attack, health/dead (59 lines) |
| `core/test-core.mjs` | 21-check scenario across two Automerge peers: PASS 21/21 |
| `core/test-repo.mjs` | the same World driven by an automerge-repo `DocHandle` `change` event |
| `compare.mjs` | one scenario run against hand-rolled, miniplex, objecs, koota and bitecs, with timings |
| `am-semantics.mjs`, `am-cost.mjs`, `am-cost2.mjs` | Automerge CRDT semantics and write-cost measurements |
| `becsy-probe2.mjs`, `ecsy-probe.mjs`, `koota-probe.mjs`, `hooks-probe.mjs` | per-library property probes |
| `scale.mjs` | scaling of brute-force chase/flee |
| `bundle/` | Vite 5.4.21 builds, one per library |
| `browser/` | Vite build plus Playwright run of the core with three.js and Automerge slim (`shot.png`) |

## Versions tested

| package | version | npm weekly downloads (2026-10) |
| --- | --- | --- |
| miniplex | 2.0.0 (last release 2023-07) | 8.5k |
| koota | 0.6.6 (2026-04) | 60k |
| bitecs | 0.4.0 (2025-12) | 22k |
| @lastolivegames/becsy | 0.16.1 (2026-10) | 1.8k |
| ecsy | 0.4.3 | 341 |
| objecs | 0.2.1 (2026-07) | 28 |
| @automerge/automerge | 3.5.0 | |
| @automerge/automerge-repo (+ network-messagechannel) | 2.6.0-alpha.3 (the current `latest` tag) | |
| three | 0.186.1 | |
| vite | 5.4.21 | |

Other libraries were looked at but not tried, because they are dormant: ape-ecs (last release 2022), geotic (2022), @javelin/ecs (2023 alpha), harmony-ecs, wolf-ecs and piecs (2022), sim-ecs (2023). @thi.ng/ecs pulls in 10 @thi.ng dependencies and uses typed-array memory pools, which is the wrong shape for JSON data.

---

## 0. The headline finding: the library does not matter, the split between authored and live state does

### 0.1 Per-frame simulation state cannot live in the Automerge doc (verified)

Results from `am-cost.mjs` and `am-cost2.mjs` (Node, Automerge 3.5.0, wasm):

| write pattern per `A.change` | ms per change |
| --- | --- |
| 900 scalar writes (300 entities × x, z, ry) | **60–62 ms** |
| 300 scalar writes | 25 ms |
| 30 writes | 2.1 ms |
| 1 write | 0.23 ms |
| 300 *reads* through the change proxy | 7.6 ms |

So a write costs about 70 µs and a proxied read about 25 µs. History grows with every change:

- 300 entities × 600 frames (10 s at 60 Hz) takes the saved doc from **3.5 KB to 585 KB**.
- `A.load` of that doc takes **881 ms**.
- Each frame's incremental change is about 3.1 KB on the wire.

The patch callback adds nothing measurable; the cost is in the writes themselves.

**Consequence for the ECS:** the world needs two layers.

1. **Authored state** lives in the doc and changes at human or agent edit rate, plus low-rate gameplay events. It covers which components an entity has and their parameters: spawn pose, speeds, asset URLs, hp, and the `dead` tag.
2. **Live state** is local to each peer and never written to the doc. It covers the simulated pose and velocity, AI target, cooldowns, three.js objects and animation mixers.

Every library option below needs this split. None of them provides it, and with it in place the library's own storage holds almost nothing.

### 0.2 Reading the materialized doc is free, and untouched subtrees keep their identity (verified)

- `A.change` returns plain JS objects (`Object.getPrototypeOf === Object.prototype`). Reading all 300 transforms from the materialized doc takes 13 µs.
- **Structural sharing:** after a change to entity `t`, `doc.entities.s` is still the same object (`===`). So is `doc.entities.t.billboard` when only `t.transform` changed. A reconciler can therefore detect a changed component with `prev !== next`, the same way you would with immutable data. My core relies on this.
- **Hazard (verified):** the materialized objects are *not* frozen by default. Mutating one outside `change()` leaves the CRDT untouched: a fresh load returns 1 while the view says 99. Worse, the mutated object stays in later views because of structural sharing, so the local view quietly diverges from the CRDT.
- `A.init({freeze:true})` freezes the materialized objects. `A.from(x, {freeze:true})` does **not** keep freezing after the next `change` (verified).
- Deep-freezing the ingested component subtrees yourself is compatible with change, merge and Counter (verified), so the core does that.

### 0.3 Patch shapes the reconciler must handle (verified)

- Creating an entity emits `put {}` and then one patch per leaf.
- Assigning a string emits `put ""` followed by `splice`, because Automerge 3 strings are collaborative text by default. `A.ImmutableString` exists for atomic strings.
- Assigning an array emits `put []` followed by `insert`.
- A component swap emits `del` followed by `put`.

The robust strategy is **not** to interpret patches. Collect the set of `path[1]` (entity ids), then re-read `doc.entities[id]` and diff components by identity. That is about 10 lines and handles every patch kind, including merges.

- **Automerge returns map keys sorted alphabetically, not in authoring order** (`['alpha','billboard','transform','zeta']`). As a result, component add hooks fire in alphabetical order: `billboard` fires before `transform` creates the root `Group`. My first test failed on exactly this. The fix is a per-type `order` (A-Frame calls this `dependencies`).
- automerge-repo's `DocHandle.on('change', ({doc, patches}))` fires for remote changes (coalesced: 2 remote changes produced 1 event) and fires **synchronously** for local `handle.change`. So all writes, from the editor, CapTP or gameplay, can go to `handle.change`, and the world reconciles only from that one event stream. Data flows one way. (verified in `test-repo.mjs`)

### 0.4 CRDT semantics that shape the component design (verified in `am-semantics.mjs`)

| concurrent ops | merged result | design implication |
| --- | --- | --- |
| A: delete `billboard` and add `mesh` / B: edit `billboard.size` | billboard gone, mesh present | nested edits inside a deleted component are dropped (good) |
| A: delete `billboard` / B: replace `billboard = {...}` | **billboard comes back** (put beats delete) | two visual components can coexist after a merge. Visuals must be additive and tolerate each other, or use a slot or priority rule. |
| A: delete the entity / B: add a component to it | entity gone | delete-entity wins over nested adds (good) |
| A: add `flees` / B: add `health` | both present | composition merges cleanly (the core reason to use per-component maps) |
| A: x=100 / B: x=200 | one value wins; `getConflicts` exposes both | last-writer-wins per scalar. Write scalars in place; never replace whole objects every edit. |
| A: hp −10 / B: hp −25 with `A.Counter(100)` | **65** (plain number: 75, one hit lost) | use a Counter for hp. JSON shows a number; the JS value is a Counter object, read through `.value`. |

**Counter caveat:** if every peer runs the attack system, every peer applies the damage, and N peers mean N× damage. Gameplay writes (damage, death, spawning) need a single **simulation authority** per entity or per room. That is a networking decision. The ECS supports it as "systems with a `write` side run only on the authority", which is a flag on the system.

---

## 1. Library survey (all actually run)

The test is `compare.mjs`: the same Automerge doc is mirrored into each library through the same dirty-id reconcile. It checks:

- chase and flee from components alone,
- an unknown component being queryable,
- a billboard-to-mesh swap,
- `Not(dead)`,
- deleting an entity,
- re-adding the same id.

It then runs a perf pass with 300 entities (30 hunters, 270 prey).

| | hand-rolled | miniplex 2.0.0 | objecs 0.2.1 | koota 0.6.6 | bitecs 0.4.0 | becsy 0.16.1 | ecsy 0.4.3 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| scenario checks | 6/6 | 6/6 | 6/6 | 6/6 | 6/6 | n/a (cannot) | not run (probe only) |
| component data = doc subtree by reference | yes | yes (property on a plain object) | yes | yes for AoS traits `trait(()=>({}))`. **SoA schema traits silently drop unknown keys** (verified). | yes (AoS array `C[eid] = ref`) | no (typed schema; `Type.object` is a slow escape hatch) | no (copies data into Component instances) |
| new component *type* at runtime, by name | yes, `registerComponent(name, hooks)`; binds to existing data | implicit (any key) | implicit | yes (`trait()` any time; you keep a name→trait Map) | yes (any ref; you keep a name→array Map) | **no**: "Component Glow not defined; add to world defs". Also no `createEntity` after the first `execute()`, and a component class is bound to one world. | yes, `registerComponent` late works |
| add / change / remove lifecycle hooks | yes (A-Frame-style add/change(prev)/remove) | add/remove per query; **no change event** | archetype add/remove | `onAdd/onChange/onRemove` per trait. A **late `onAdd` does not fire for existing entities** (verified). | `observe(onAdd/onSet/onRemove)` | n/a | system queries with added/removed/changed |
| entity id = doc id (string) | yes | need an id→entity Map | need Map | numeric, need Map | numeric, **recycled immediately**, need Map plus care | numeric | object |
| reconcile 300 new entities | 1.8–2.6 ms | 1.4–3.2 | 1.1–2.3 | 2.2–2.4 | 1.5–1.8 | | |
| tick (hunt + flee + integrate, 300 ents) | **0.16 ms** | 0.19 | 0.26 | 0.51–0.57 | 0.20 | | |
| Vite 5 bundle, gzip (minified raw) | **1.6 KB** (3.8) | 4.1 KB (16.5) | 1.7 KB (4.6) | 11.7 KB (38.9) | 5.3 KB (14.2) | 27.2 KB (112) | 6.9 KB (23.3) |
| status | ours | dormant since 2023-07 | one-person, 28 dl/wk | very active (pmndrs), React-first | active, 0.4 is a full API rewrite | active, closed-world design | effectively abandoned (Mozilla) |

For scale: Automerge (slim + base64 wasm) builds to **1.64 MB gzip** (4.9 MB raw). three.js (renderer, mesh, sprite, mixer) is **139 KB gzip**. Every ECS option is under 1% of the page weight, so bundle size decides nothing.

### Notes per library

**miniplex 2.** Its model already matches ours: an entity is a plain object and a component is a property holding plain data. Mirroring a doc into it is about 10 lines. It has no change events, so you write your own hooks. `addComponent` on an existing key is a silent no-op (from the source), so updates must assign `e[name] = v` directly. It has had no release in 3+ years. Net value over hand-rolled: cached queries with add/remove events, which the hand-rolled core already has.

**objecs.** A miniplex-alike, but `removeEntityComponents` leaves the key in place set to `undefined` (verified), which my first adapter tripped over. Too small a project to depend on.

**koota.** The most capable and most active option: relations (`ChildOf`, `Targeting` with auto-destroy), `Added/Removed/Changed` modifiers, and `onAdd/onChange/onRemove` hooks. But:

1. Traits are keyed by object identity, so a runtime name→trait registry has to be kept on top of it.
2. Only AoS traits can hold doc subtrees. SoA, its fast path, takes flat scalar schemas and drops other keys.
3. It is React-oriented (the `koota/react` hooks).
4. Late hooks do not see existing entities, so a late-registered behavior needs a manual backfill.
5. It was slowest in this AoS-heavy test, at 0.5 ms, which is still trivial.

It becomes worth it only if the project goes to react-three-fiber (see the r3f dimension), where `useQuery` and `useTrait` give reactive React rendering.

**bitecs 0.4.** A clean, functional API. Components are any reference (AoS arrays work with doc refs), and it has relations, `Prefab`/`IsA` inheritance, and observers. Downsides:

1. Numeric eids are recycled immediately, so you need a stable Map from doc id to eid and must never hold an eid across frames without versioning.
2. Reverse lookup (component ref → name) needs its own Map.
3. Its value (SoA typed-array speed and threading) does not apply when data is JSON from a CRDT.

Hubs used bitecs with typed-array SoA components. Networked components went through an explicit `NetworkSchema` registry (`componentName`, `serialize`/`deserialize`, plus optional `serializeForStorage` with **versioned migrations**). That is the same authored/live split, reached the hard way, and the migration idea is worth copying (see §4).

**becsy.** Disqualified for this use. The world is closed at `World.create({defs})`, entities can only be created inside systems once it runs, and a component class cannot be reused in a second world (which rules out hot reload by rebuilding the world).

**ecsy.** Works (late `registerComponent` and `Types.JSON` both function), but it copies data into Component instances, so you lose by-reference structural sharing. The project is abandoned.

**A-Frame (prior art, docs).** It is not usable as a library here, because it bundles its own three.js and is DOM-based. Its *component contract* is the right one to copy:

- `registerComponent(name, {schema, dependencies, multiple, init, update(oldData), remove, tick})`,
- `dependencies` gives init order,
- `update(oldData)` lets a component diff its own data,
- `multiple` allows `sound__1`, `sound__2` on one entity.

My core's `{order, add(e,data), change(e,data,prev), remove(e)}` is that contract, minus the DOM.

---

## 2. The hand-rolled core (recommended)

Doc shape:

```js
{
  entities: { <id>: { <componentName>: { ...plain JSON }, is?: { prefab: '<pid>' } } },
  prefabs:  { <pid>: { <componentName>: {...} } },                 // optional species templates
  defs:     { systems: { <name>: { query: [...], order, code } },   // behaviour as data (loader outside core)
              components: { <name>: { order, code } } }
}
```

`core/world.mjs` (96 lines) provides:

- **A presence index and cached queries.** `world.query('transform','hunts','!dead')` returns a live `Set<entity>`, updated as entities gain or lose components.
- **Reconcile from patches.** It collects dirty entity ids, re-resolves each entity, diffs components by identity, and fires `add`, `change(prev)` and `remove` hooks. A change under `prefabs/<pid>` dirties every instance of that prefab.
- **Runtime registry.**
  - `registerComponent(name, {order, add, change, remove})` replaces any existing definition. It runs the old `remove` hooks and then the new `add` hooks for every entity that already carries that component, so **hot reload and late binding are both one call**.
  - `addSystem({name, order, query, update(world, dt, entities)})` replaces by name.
- **Unknown components are first-class data.** They are indexed and queryable before any code knows them, so the doc can lead and code can follow.
- **`e.live`** holds per-entity runtime state (pose, velocity, three.js objects) and is never synced.
- **Ingested component data is deep-frozen**, so a system that accidentally writes `e.c.transform.x = …` throws instead of silently desyncing.
- **Prefab overlay.** Effective components are `{...prefab, ...own}`, and an own `null` removes an inherited component.

`core/test-core.mjs` uses two peers (A edits, B views and runs the sim) and passes 21/21:

1. A remote entity add is indexed into the queries, and its billboard becomes a `THREE.Sprite`.
2. **The T-rex chases and the sheep flees purely from components:**
   - T-rex: `hunts {target:'prey', speed, sight}`.
   - Sheep: `prey {}` plus `flees {from:'hunts', …}`.
   - The query targets are *component names*, so "flee from anything that hunts" needs no species logic.
3. An unknown `glow` component is queryable. Registering the `glow` type later binds to the existing data.
4. **Billboard → mesh in one change:**
   - the scene children go from `[Sprite]` to `[Mesh]`,
   - the live pose is preserved (behavior untouched),
   - adding `animator` creates a mixer through a `(mesh, animator)` system,
   - editing `mesh.url` rebuilds the mesh and the animator rebinds.
5. A runtime-added system and component (`bob`) drive behavior.
6. **Damage and health:** `attack` hits `live.target`, decrements `health.hp` (a Counter) through a batched doc write, and adds a `dead {by}` tag when hp ≤ 0. `!dead` then drops the sheep from the steering queries.
7. Deleting an entity remotely cleans the world, the scene and the queries.
8. Unregistering a type fires `remove`. Re-registering hot-replaces it and rebinds the existing data.
9. **Prefabs:**
   - 3 instances inherit, and a per-instance `flees` override wins,
   - swapping billboard → mesh **on the prefab** reaches all instances,
   - `mesh: null` on one instance removes the inherited mesh for that instance only.
10. Frozen data: an out-of-change write throws.
11. **Behavior as data:** a system whose *source code lives in the doc* (`defs.systems.spin.code`) runs on the peer, and editing that source in the doc hot-swaps it. A 6-line loader uses `new Function` as a stand-in for an SES `Compartment`; sandboxing is the CapTP/agent dimension's call.

Browser check (`browser/`): Vite 5 build plus Chromium. The core, three r186 and Automerge slim render 21 entities, and the billboard-to-mesh swap works live (`shot.png`).

### How the requested cases map to plain components (no special-casing in the core)

| want | components (data) | systems (code, addable at runtime) |
| --- | --- | --- |
| aggressive T-rex | `hunts{target:'prey'}`, `attack{damage,range,cooldown}`, `health{hp:Counter,max}`, `prey{}` too if bigger things eat it | hunt, attack |
| sheep | `prey{}`, `flees{from:'hunts'}`, `health` | flee |
| herd or social animal | `flocks{with:'sheep-ish tag'}` | flock |
| rideable beast or vehicle | `rideable{seat:[x,y,z], speed}` + `ridden{by:<entityId>}` (authored, low rate) | ride: copies the rider's input to the mount's live velocity on the rider's own peer |
| NPC that reacts to players | `prey{}`/`flees{from:'player'}`, or `hunts{target:'player'}`, with players carrying `player{}` | same steering systems |
| billboard → mesh → animated mesh | `billboard{url}` → `mesh{url}` → `+animator{clip, speedFrom:'velocity'}` | each is an independent reconciler; animator is a `(mesh, animator)` system |
| two attacks on one entity | `attack__bite`, `attack__tail` (A-Frame `multiple` naming) | the system queries by prefix, or registers per name |

"Easy cases" should come from **prefabs and recipes, not engine features.** `doc.prefabs.trex` is a bundle of components that an agent or editor stamps out, live-linked or copied. That keeps the core general.

### Scaling (verified, `scale.mjs`)

These are with brute-force nearest-neighbour search:

| entities | tick |
| --- | --- |
| 300 | 0.17 ms |
| 1000 | 1.45 ms |
| 3000 | 11.4 ms |

Load cost for 3000 entities is 8.6 ms. Beyond about 1000 agents, add a spatial-hash *system*; it is a system, not a core change. Query and archetype machinery never shows up in these numbers.

---

## 3. Recommendation

**Use the hand-rolled, doc-backed core** (about 100 lines, 1.6 KB gzip) with A-Frame-style component lifecycle hooks and a strict authored/live split. Do not adopt an ECS library.

Why:

1. The Automerge doc already *is* the component store. It has structural sharing, maps per entity, and composition that merges cleanly. Every library tested ends up holding doc refs in AoS slots, plus a name→type Map, plus an id→handle Map, plus a reconcile loop. That glue *is* the hand-rolled core. The libraries contribute only query caching, which takes 15 lines.
2. Runtime-defined component kinds by **name**, late binding to existing data, and hot replacement are native here. They are emulated in koota and bitecs and impossible in becsy.
3. Performance is identical within noise at our scale: about 0.2 ms per tick for 300 entities. The Automerge writes cost 100× more, so that is the budget to manage.

What it costs:

- We own about 100 lines plus tests.
- No relations or graph queries out of the box. Model them as data (`ridden{by:id}`, `live.target`) and do lookups through `world.get(id)`.
- No SoA or typed-array speed. That is irrelevant below about 5k entities.

What it forecloses:

- Nothing hard. If the project later moves to react-three-fiber, koota can sit *underneath* the same reconcile: the doc stays authoritative and koota replaces the `live` layer. The mirror adapter in `compare.mjs` is 15 lines.
- If huge crowds are ever needed, a bitecs SoA store can back `live.pose` without touching the doc schema.

Rules the PM should write into the design:

1. **The doc holds authored state only.** Never write per-frame state to it. Coalesce editor drags: write on pointer-up or throttle to 10 Hz or less. One write is 0.23 ms, but history grows forever.
2. **One write path.** Editor, CapTP agent and gameplay all go through `handle.change`. The world reconciles only from `DocHandle` `change` events.
3. **Component data is read-only to systems** (enforced by freezing). Systems mutate `e.live`, or queue doc writes that are flushed once per tick in a single change.
4. **Gameplay writes need a sim authority** (Counter damage multiplies otherwise). This is a networking-dimension decision.
5. **Use a Counter for hp, write scalars in place, and avoid replacing objects or arrays when only a field changes.** Use `ImmutableString` for ids and URLs if collaborative-text overhead matters.
6. **Visual components are additive, each owns one child of the entity root, and they must tolerate coexisting** (put beats delete after a concurrent merge). If exclusivity is needed, add a generic `slot` and `priority` convention, not a billboard/mesh special case.
7. **Each component type has an explicit `order`.** Automerge key order is alphabetical, so `transform` must declare that it goes first.

---

## 4. Risks and open questions

- **Gameplay authority and Counters.** Who applies damage when 3 peers simulate? Without an answer, hp drops N× too fast. (Networking dimension.)
- **Live-state divergence.** Each peer simulates its own sheep positions, so peers see different poses unless the authority broadcasts live poses over ephemeral messages (automerge-repo `handle.broadcast`) or periodically re-seats the authored transform. This is the biggest open design item that the ECS exposes.
- **Code in the doc.** `defs.systems.*.code` is arbitrary JS that every peer executes. It needs an SES `Compartment` with a narrow endowment (`world` read API, `dt`, `entities`, `THREE`?) and probably a per-room trust model. (CapTP and security dimension.)
- **Schema evolution.** Old docs carry old component shapes. Copy Hubs' versioned `serializeForStorage` idea: an optional `v` field per component plus migrations in the type definition.
- **Concurrent visual swap** can leave both billboard and mesh present (verified put-wins). This is cosmetic, but the editor should show it and offer a fix.
- **Prefab live-linking** means an edit to `prefabs.trex` restyles every T-rex, which is wanted for "incremental redesign". Editors must make the distinction between "edit this one" (an override) and "edit the species" clear.
- **automerge-repo's npm `latest` is 2.6.0-alpha.3.** Pin it deliberately.
