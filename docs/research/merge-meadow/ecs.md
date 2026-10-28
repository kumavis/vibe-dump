# merge-meadow research — ecs

_Structured summary returned by the research agent (Opus 5.5), 2026-10-28. Every finding is graded verified / likely / speculative by what the agent actually ran._

## Summary

Recommendation: build our own small ECS core (96 lines, 1.6 KB gzip) on top of the Automerge doc, with one rule: authored state lives in the doc, live simulation state stays on each peer. Don't adopt an ECS library.

The deciding fact is not about libraries. Automerge 3.5 writes are too slow for per-frame state:
- One write costs about 70 µs, so updating 300 entity poses per frame takes 60 ms per change.
- The doc also grows by about 1 KB per frame: 10 s of simulation took it from 3.5 KB to 585 KB, and that doc took 881 ms to load.

So the doc holds only authored state, changed at edit rate:
- which components an entity has, and their parameters
- spawn pose
- hp, kept in a Counter
- a `dead` tag

Live state stays on each peer and is never synced: simulated pose and velocity, AI targets, three.js objects and animation mixers.

Reading the materialized doc costs almost nothing, and untouched parts keep the same object identity after a change. That means "has this component changed?" is a reference comparison.

Five libraries passed the same mirror-the-doc scenario: miniplex, objecs, koota, bitecs and the core. Each ticks 300 entities in 0.16–0.57 ms. But every library ended up needing the same glue: component data held by reference, a name-to-type map, an id map and a reconcile loop. That glue is the core itself. Two libraries ruled themselves out:
- becsy cannot add component types once the world exists.
- ecsy copies data out of the doc and is abandoned.

Library sizes (1.6–27 KB gzip) don't matter next to Automerge's 1.64 MB.

The core passes 21/21 checks across two peers:
- The T-rex chases and the sheep flees purely from components (`hunts{target:'prey'}` / `flees{from:'hunts'}`).
- Damage, a Counter for hp, and death via the `dead` tag work.
- An entity can swap billboard → mesh → animated mesh with its behaviour and pose untouched.
- Component types and systems can be added or hot-replaced at runtime, and attach to data already in the doc.
- An unknown component is still queryable before any code registers it.
- Prefab inheritance works, with per-entity overrides.
- A system whose source text lives in the doc runs on the other peer and hot-swaps when edited.
- Component data is frozen, so a write outside a change throws instead of silently desyncing.

It also runs in Chromium in a Vite build with three r186.

Gotchas I verified:
- Automerge returns an entity's components in alphabetical order, not authoring order, so component types need an explicit `order`.
- If one peer deletes a component while another replaces it, the replacement survives the merge. Visual components must therefore tolerate coexisting.
- A Counter is needed for hp: with plain numbers, two simultaneous hits merge to one.
- If every peer applies damage, a Counter takes N× the damage, so gameplay writes need one simulation authority.

## Findings

- **[verified]** Per-frame simulation state cannot be stored in the Automerge doc; the ECS must split authored state (doc) from live state (local per peer).
  - _Evidence:_ am-cost.mjs/am-cost2.mjs, Automerge 3.5.0 on Node 22. 900 scalar writes per change = 60-62 ms; 300 writes = 25 ms; 30 = 2.1 ms; 1 = 0.23 ms; 300 reads through the change proxy = 7.6 ms. 300 entities x 600 frames: saved doc 3.5 KB -> 585 KB, A.load 881 ms, about 3.1 KB per frame on the wire. Adding a patchCallback changes nothing.
- **[verified]** The materialized doc is plain JS and keeps object identity for untouched subtrees, so changed components can be detected by reference (prev !== next). It is not frozen by default, and writing to it outside change() silently desyncs the local view from the CRDT.
  - _Evidence:_ am-semantics.mjs: an untouched entity and an untouched sibling component are === after a change. A mutation to 99 stayed in later views while A.load(A.save()) returned 1. A.init({freeze:true}) keeps freezing; A.from(x,{freeze:true}) does not after the next change. Deep-freezing it ourselves works with change, merge and Counter. Reading 300 transforms takes 13 µs.
- **[verified]** Patch shapes vary (strings arrive as put '' plus splice, arrays as put [] plus insert, a component swap as del plus put). The robust reconcile ignores patch detail: collect the entity ids from path[1], re-read those entities and diff components by identity.
  - _Evidence:_ am-probe.mjs patch dumps. World.applyPatches works unchanged against A.change/applyChanges patch callbacks and against the automerge-repo DocHandle 'change' event ({doc, patches}). That event fires synchronously for local handle.change and coalesces remote changes (2 changes produced 1 event).
- **[verified]** Automerge returns an entity's components in alphabetical key order, not authoring order, so component lifecycle hooks need an explicit order or dependencies.
  - _Evidence:_ Object.keys on a materialized map gave ['alpha','billboard','transform','zeta']. The first core test failed because the billboard add hook ran before transform had created the entity root; adding order:-10 on transform fixed it. This mirrors A-Frame's `dependencies`.
- **[verified]** How concurrent edits merge: deleting a component discards concurrent nested edits; delete vs whole-component replace lets the replace win (component comes back); deleting an entity beats concurrent component adds; different components added concurrently both survive; concurrent writes to one scalar keep one value; Counters sum correctly where plain numbers lose an update.
  - _Evidence:_ am-semantics.mjs merges: swap vs nested edit -> mesh only. delete vs replace -> billboard present. delete entity vs add -> undefined. flees+health -> both present. x=100 vs 200 -> 100 with getConflicts showing both. Counter 100 with -10 and -25 -> 65; plain number -> 75.
- **[verified]** miniplex, objecs, koota (AoS traits) and bitecs (AoS arrays) can all hold doc subtrees by reference and pass the same mirror scenario. Performance at our scale is equivalent and negligible.
  - _Evidence:_ compare.mjs: 6/6 checks for each, covering chase/flee, unknown component queryable, swap, Not(dead), entity delete and same-id re-add. Ticking 300 entities: hand-rolled 0.16 ms, miniplex 0.19, bitecs 0.20, objecs 0.26, koota 0.51-0.57. Reconciling 300 new entities: 1.1-3.2 ms for all. Creating the 300 entities in Automerge: 55-100 ms, which dominates.
- **[verified]** becsy cannot accept component types at runtime; ecsy works but copies data and is abandoned; koota's fast SoA traits silently drop unknown keys and a late onAdd hook does not fire for existing entities; miniplex has no change event and addComponent on an existing key is a no-op; objecs leaves removed components as undefined keys; bitecs recycles numeric entity ids immediately.
  - _Evidence:_ becsy-probe2.mjs: 'Component Glow not defined; add to world defs', and 'This method cannot be called after the world has started executing'. ecsy-probe.mjs: late registerComponent OK, Types.JSON copied. koota-probe.mjs: an SoA trait given {x, nested} returned {x}. hooks-probe.mjs: koota late onAdd fired false; miniplex reported only add and remove. miniplex source line 355. objecs probe: keys ['id','a'] with a undefined after removal.
- **[verified]** Bundle size is irrelevant to the choice.
  - _Evidence:_ Vite 5.4.21 builds, gzip -9: hand-rolled 1.6 KB, objecs 1.7, miniplex 4.1, bitecs 5.3, ecsy 6.9, koota 11.7, becsy 27.2. For comparison, Automerge slim + base64 wasm is 1.64 MB gzip (4.9 MB raw) and three.js core is 139 KB gzip. The default Automerge entry fails a plain Vite 5 build; slim+base64 needs build.target esnext for top-level await.
- **[verified]** The hand-rolled core covers every requested case without special-casing: behaviour from component composition, damage and health, incremental billboard -> mesh -> animated mesh, runtime and hot-replaced component types and systems, late binding, prefab inheritance with overrides, and system source code stored in the doc.
  - _Evidence:_ core/test-core.mjs passes 21/21 across two Automerge peers using real three.js objects (Sprite -> Mesh, AnimationMixer). The live pose is preserved across the swap. A prefab-level swap reaches all 3 instances. `mesh:null` removes the inherited mesh for one instance. defs.systems.spin.code runs and hot-swaps on edit (new Function standing in for an SES Compartment). browser/: the Vite build runs in Chromium via Playwright and renders 21 entities with a live swap.
- **[verified]** Brute-force nearest-neighbour steering is fine up to about 1000 agents; beyond that, add a spatial-hash system (no core change).
  - _Evidence:_ scale.mjs ticks: 300 entities 0.17 ms, 1000 entities 1.45 ms, 3000 entities 11.4 ms. Load time for 3000 entities: 8.6 ms.
- **[likely]** Hubs separated networked from local components using an explicit NetworkSchema registry with versioned storage migrations. A-Frame's component contract (schema, dependencies, multiple, update(oldData), remove, tick) is the right shape to copy.
  - _Evidence:_ Read Hubs src/utils/network-schemas.ts (componentName, serialize/deserialize, serializeForStorage, deserializerWithMigrations) and the A-Frame 1.7 component docs. Neither was run.

## Recommendation

Use the hand-rolled, doc-backed core in core/world.mjs (about 100 lines). Its contract, modelled on A-Frame's:
- `registerComponent(name, {order, add, change(prev), remove})`
- `addSystem({name, order, query, update})`
- `world.query('a', 'b', '!c')`, which returns a live `Set<entity>`

Doc shape: `{entities: {id: {comp: {...}, is?: {prefab}}}, prefabs: {}, defs: {systems, components}}`.

Rules to write into the design:
1. **Only authored state goes in the doc.** Never write per-frame state. Coalesce editor drags to pointer-up or at most 10 Hz.
2. **One write path.** Editor, CapTP agent and gameplay all call `handle.change`; the world reconciles only from DocHandle `change` events.
3. **Systems treat component data as read-only (enforced by freezing).** They mutate `e.live`, or queue doc writes that are flushed once per tick in a single change.
4. **hp is a Counter.** Write scalars in place; don't replace whole objects.
5. **Visual components are additive and own one child of the entity root each.** The billboard → mesh path is just remove one component, add another.
6. **Easy cases (T-rex, sheep, rideable beast) are prefabs and recipes over generic components.** Examples: `hunts{target}`, `flees{from}`, `attack`, `health`, `rideable` / `ridden{by}`. None of them is an engine feature.

Cost: we own about 100 lines plus tests. Relations are modelled as data (`ridden{by: id}`, `live.target`) rather than coming from a library. There is no SoA speed, which doesn't matter below about 5k entities.

What it forecloses: almost nothing. If the project moves to react-three-fiber, koota can replace only the live layer under the same reconcile (that mirror adapter is 15 lines). For huge crowds, a bitecs SoA store can back `live.pose` without changing the doc schema.

Two decisions this pushes to other dimensions:
- **Sim authority:** who applies damage and deaths. Otherwise Counter damage multiplies by the number of peers.
- **Live-pose sync:** whether a sim authority broadcasts live poses over ephemeral messages, or each peer re-seats from the authored state.

## Risks

- Gameplay authority is undecided. If every peer runs the attack system, Counter damage is applied N times. A single sim authority per room or entity is needed (networking dimension).
- Live state diverges between peers. Each peer simulates its own sheep positions, so viewers see different poses unless an authority broadcasts live poses over ephemeral messages (automerge-repo handle.broadcast) or periodically re-seats the authored transform. This is the biggest open item the ECS split exposes.
- System and component source stored in the doc is arbitrary JS that every peer executes. It needs an SES Compartment with a narrow endowment and a trust model (CapTP/security dimension); new Function in the prototype is only a stand-in.
- If one peer deletes a component while another replaces it, the replacement wins the merge, so both billboard and mesh can exist after a merge. Renderers must tolerate this, and the editor should surface it.
- Writing to the materialized doc outside change() silently desyncs the local view. The core deep-freezes the data it ingests, but any code reading the doc directly (editor UI, CapTP read API) needs the same discipline, or A.init({freeze:true}). A.from(...,{freeze:true}) does not keep freezing after the next change.
- Schema evolution: old docs will carry old component shapes. Plan a per-component version field plus migrations in the type definition (Hubs does this).
- Editor drags must be throttled or coalesced. Each change is cheap (0.23 ms), but history grows forever and load time grows with it (585 KB doc took 881 ms to load).
- Brute-force nearest-neighbour steering costs 11 ms per tick at 3000 entities. A spatial-hash system is needed if scenes get large.
- automerge-repo's npm 'latest' tag is 2.6.0-alpha.3. Pin it deliberately. The default @automerge/automerge entry also needs wasm handling in Vite 5; slim+base64 works with build.target esnext.

## Versions tested

- `miniplex@2.0.0`
- `koota@0.6.6`
- `bitecs@0.4.0`
- `@lastolivegames/becsy@0.16.1`
- `ecsy@0.4.3`
- `objecs@0.2.1`
- `@automerge/automerge@3.5.0`
- `@automerge/automerge-repo@2.6.0-alpha.3`
- `@automerge/automerge-repo-network-messagechannel@2.6.0-alpha.3`
- `three@0.186.1`
- `vite@5.4.21`
- `node@22.22.0`

Long-form report with code and numbers: [`ecs-report.md`](./ecs-report.md)
