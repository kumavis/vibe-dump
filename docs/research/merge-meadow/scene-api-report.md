# Scene API research: (A) direct three.js vs (B) react-three-fiber vs (C) JSON ECS + hand reconciler

Dimension: **scene-api**. All numbers come from code in this directory, run 2026-10-28.

**Versions tested:** three@0.186.1, @react-three/fiber@9.8.2, react@19.3.1, react-dom@19.3.1,
@automerge/automerge@3.5.0, vite@5.4.21 (+ vite-plugin-wasm@3.6.0, needed for Automerge's
`browser` export), playwright@1.63.0 with the pre-installed chromium-1243 (SwiftShader WebGL), Node 22.22.0.

Layout:
```
shared/harness.js   leak tracker (wraps .dispose() on BufferGeometry/Material/Texture; records everything
                    ever reachable from the scene; leaked = seen - reachable - disposed) + renderer.info cross-check
shared/edits.js     the ONE scripted edit sequence (8 steps) as JSON ops
shared/amdoc.js     Automerge store wrapper: re-entrant change(), patches handed to subscribers, merge()+diff()
shared/amdiff.js    deep-merge plain JSON into an Automerge object (uuid-keyed for arrays of objects)
protoA/             direct three.js: the agent sends JS source; doc = scene.toJSON(); peers use ObjectLoader
protoB/             R3F v9: the doc is the truth; React components map ECS JSON to <group>/<mesh>/<sprite>
protoC/             ECS JSON + hand reconciler (reconciler.js, handlers.js, api.js, kinds-extra.js)
size/*              bundles used only for size measurement (no test harness, no Automerge)
node/am*.mjs        Automerge semantics and cost tests in Node
out-{A,B,C}.json    raw results from the Playwright runs
serve-and-run.cjs   static server + Playwright driver that calls window.runAll()
```
Reproduce: `PROTO=protoC npx vite build && node serve-and-run.cjs protoC`. Use the same commands for protoA and protoB, and `node node/am.mjs` for the Node tests.

## 1. The scripted edit sequence (same for all three)

1. add a billboard sprite entity (sheep, with `health` + `brain` behaviour components)
2. move it
3. change its colour
4. replace its representation: billboard → box mesh (behaviour must survive)
5. resize the box (changing geometry args forces a new geometry)
6. add a child entity
7. swap the representation back to a billboard **while the child is attached**
8. delete the entity (cascade to the child)

### How an agent writes each edit (literal)

**C (and B: B's driver imports `protoC/api.js` without changes):** JSON ops. This is what a CapTP
message or an LLM tool call carries:
```js
['addEntity','e1',{ name:'sheep', parent:null, components:{
   transform:{position:[0,1,0],rotation:[0,0,0],scale:[1,1,1]},
   representation:{kind:'billboard',image:'sheep.png',color:'#ff0000',size:1},
   health:{hp:10,max:10}, brain:{flees:['predator'],speed:2} }}]
['setComponent','e1','transform',{position:[2,1,0]}]
['setComponent','e1','representation',{color:'#0000ff'}]
['replaceComponent','e1','representation',{kind:'box',size:[1,1,1],color:'#0000ff'}]
['setComponent','e1','representation',{size:[2,1,1]}]
['addEntity','e2',{parent:'e1',components:{...sphere...}}]
['replaceComponent','e1','representation',{kind:'billboard',image:'sheep2.png',color:'#ffffff',size:1}]
['removeEntity','e1']
// over CapTP the same thing is: E(scene).setComponent('e1','transform',{position:[2,1,0]})
// declarative alternative for any step: E(scene).defineEntity('e1', wholeSpec)  (deep-diffed into the doc)
```
**A:** JS source run against live objects (careful version, which knows the conventions):
```js
`const e = scene.getObjectByName('e1'); const old = e.getObjectByName('rep'); old.removeFromParent(); h.disposeDeep(old);
 const m = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshStandardMaterial({ color: '#0000ff' })); m.name='rep'; e.add(m)`
```
The naive version, the kind an LLM writes without being told the conventions:
`const old = scene.getObjectByName('e1'); scene.remove(old); const m = new THREE.Mesh(...); m.name='e1'; m.position.copy(old.position); scene.add(m)`.

## 2. Results table

| | A direct three.js | B R3F v9 | C JSON ECS + reconciler |
|---|---|---|---|
| glue LOC (non-blank, non-comment) | 23 glue + 23 keyed-diff = **46** | 35 scene.js + 16 root setup + 18 api = **69** | 57 reconciler + 41 handlers + 18 api = **116** (+45 for the optional generic `tree` + async `model` kinds) |
| bundle, gzip (no Automerge) | 192.8 KB (+62 vs baseline). The agent's eval gets the THREE namespace, so all of three ships | `extend(THREE)`: 248.6 KB (+118). Selective `extend({...})`: 187.9 KB (+57). Usual `react-dom` + `<Canvas>`: **318.4 KB (+187)** | **132.7 KB (+1.7)** |
| baseline (three, only the classes used) | 131.0 KB | | |
| Automerge (every option) | JS 11.8 KB gz + wasm 3,644 KB raw / 1,110 KB gz | same | same |
| leaks after the 8 steps | careful: 0. **naive: 3 geometries, 4 materials, 2 textures leaked** | 0 once React's idle-priority disposal runs; geometry and material are still undisposed right after the commit. **Textures passed as props are never disposed** (naive billboard leaked 2) | **0 at every step**, synchronously |
| representation swap keeps root and behaviour | only by convention. Naive code lost `userData` behaviour **and the child** | yes: `key=rep.kind` remounts only the rep subtree; the group and the child survive | yes, verified: same root Object3D, same system-side brain object, child still attached |
| reparent (setParent) | manual | **remount**: new Object3D and new geometry (sameObject=false) | same Object3D is moved (sameObject=true) |
| remote peer applies an edit | full `ObjectLoader.parse` of the scene. Patch paths are array indices (`scene.object.children.5.matrix.12`) | patch → store → memo'd entity re-render | patch → dirty (entity, component) → handler.update |
| at 300 entities, one edit, cost beyond the doc write | **~500 ms** (toJSON 44 ms + diff into the doc 455 ms) | 0.2 ms React | 0.17 ms reconcile |

## 3. Option A: the direct three.js API, with `Object3D.toJSON` / `ObjectLoader` as the persisted shape

Verified behaviour:
- **Persisting is the problem, not mutating.** You get data into Automerge by calling `scene.toJSON()` after every edit and
  diffing it into the doc. With a naive diff (arrays of objects replaced wholesale), moving one of 300 entities
  produced a **914 KB change**. three's format keeps `geometries[]`, `materials[]`, `textures[]`, `images[]` and `children[]` as
  arrays, so you need a uuid-keyed list differ (`shared/amdiff.js`). With that differ the change is 120 B and has 1 patch, but each
  edit still costs **toJSON 44 ms + diff walk 455 ms** at 300 entities (794 KB of JSON), because reading every field
  through Automerge's proxies is slow. Diffing against the previous plain JSON instead of the doc would cut the 455 ms. The
  44 ms toJSON per edit stays.
- **Stale-matrix gotcha:** toJSON serialises `.matrix`, not position/rotation/scale. A `position.set()` is not persisted until
  `updateMatrixWorld()` runs; my first patch-shape test recorded **0 patches for a move**.
- **Textures are inlined as data URLs.** 150 64×64 canvases gave 794 KB of JSON (save() 121 KB). A real image would bloat
  the CRDT history permanently.
- **Remote peers can only rebuild.** Patch paths are index-based (`put scene.materials.1.color=16711680`,
  `del scene.object.children.0`). Turning them back into object mutations means writing a reconciler for three's own
  schema (uuid lookups, matrix decomposition, shared-resource refcounts), which is harder than C. A full
  `ObjectLoader.parse` rebuild of 300 entities took 9.8 ms + a 30 ms first render (every GPU resource re-uploaded), and images
  decode asynchronously: Chromium logged "Texture marked for update but image is incomplete" on the remote peer, so a rebuilt
  sprite renders without its texture for a frame or more.
- **Agent correctness relies on discipline.** The naive script leaked 3/4/2 (geometry/material/texture), dropped the behaviour
  `userData` and lost the child on the representation swap. Executing agent-written JS also needs a sandbox (SES
  Compartment). That is the CapTP researcher's dimension.
- Bundle: handing the agent `THREE` (an eval scope) defeats tree-shaking: +62 KB gz.

Verdict: three's JSON is a fine **export/import/bake format** (e.g. "bake this entity to a static mesh asset") but a
poor live CRDT shape. Direct object mutation is a fine *implementation detail inside handlers*, not an agent surface.

## 4. Option B: react-three-fiber v9 + React 19

Verified:
- R3F 9.8.2 works with three 0.186.1 and React 19.3.1 under Vite 5.4.21 (no peer-dependency errors; the peer range is `react >=19 <19.4`,
  `three >=0.156`). It logs `THREE.Clock: This module has been deprecated` on every root (R3F still uses Clock).
- **Gotcha:** `createRoot(canvas)` without `<Canvas>` throws `R3F: AmbientLight is not part of the THREE namespace! Did you forget
  to extend?`. You must call `extend(THREE)`, which pulls in all of three, or `extend({...})` with a selective list.
- **JSON → React tree with the doc as the truth works.** `reactStore()` adapts the Automerge store to
  `useSyncExternalStore`. Automerge 3 gives **structural sharing** (verified in Node: after changing e1, `doc.entities.e2` is
  the same reference), so `memo` + per-entity subscription re-renders only the changed entity. A generic element tree
  (`{type:'mesh', props, children:[{type:'torusGeometry', props:{args}}, ...]}` → `createElement`) is 1 line
  (`toElement`) and reconciles in place: a colour edit kept the same mesh and material.
- `flushSync` (exported by R3F) makes commits synchronous, so they can be measured and are deterministic.
- **Disposal is deferred.** R3F disposes unmounted geometry and materials via `scheduler` at IdlePriority. Immediately after the
  commit, 1–2 geometries/materials are still undisposed. They clear after about 100 ms idle. Not a leak, but nondeterministic for a test
  harness. **Textures created in `useMemo` and passed as `map={tex}` are never disposed** (2 leaked in the naive
  billboard). You need an explicit `useEffect(() => () => tex.dispose(), [tex])`.
- **Reparenting remounts** the whole subtree (new Object3D, new geometry). React cannot move a fiber between parents.
  Mounting an entity on a horse or beast via `parent` would rebuild its visuals and drop any per-object runtime state stored on them.
- Perf at 300 entities (memo + subscription): React work 0.2 ms (move one) / 2.2 ms (move all) / 1.8 ms (recolour all).
  A naive root re-render of everything costs 3.6 ms per change regardless of size. React is **not** a performance problem.
- Bundle is the main cost: +57 KB gz (selective extend) to **+187 KB gz** (normal react-dom + `<Canvas>` app) over C.
- What B buys: a JSX authoring style for humans, plus the pmndrs ecosystem (drei, @react-three/xr, rapier bindings). What it
  does not buy: the agent-facing API. **The B prototype uses exactly the same doc API as C.** React sits behind the doc,
  so the agent never sees it. Systems with cross-entity queries (T-rex finds the nearest sheep) don't fit per-component
  `useFrame` hooks either. You would still keep a world-level system loop outside React.

## 5. Option C: JSON ECS + hand reconciler (recommended core)

Doc shape: `{ entities: { [id]: { parent, name, components: { [type]: plainJSON } } } }`.
The reconciler (57 LOC) uses Automerge patches **only to find dirty (entityId, componentType) pairs** (`path[1]`, `path[3]`),
then reads the current value from the doc. This matters because Automerge 3 strings are collaborative text by default, so a
colour assignment arrives as `put …color=""` followed by `splice …color.0 "#f00"`. Interpreting patches literally would be fragile.
Handlers are `{create(data, entity) → handle, update(handle, data, prev) → false-means-recreate, dispose(handle)}`.
`representation` dispatches on `kind` through an open registry (`kinds.billboard/box/sphere`, plus `tree` and `model` registered at runtime).
Components without a handler (`health`, `brain`, `rideable`, …) are pure data for systems. Systems keep runtime state in
side tables keyed by entity id, never on the Object3D.

Verified in the browser (out-C.json):
- 0 leaks at every step, synchronously. renderer.info matches. One persistent GPU texture is three r186's shared **DFG LUT** for
  MeshStandardMaterial, not a leak. Sprites share a module-level geometry, so `disposeDeep` must skip `o.isSprite`. My first version
  disposed it, and R3F correctly doesn't.
- Representation swap billboard → box → billboard: **same root Group, same system-side brain object**, behaviour data intact,
  child still attached (`childStillAttached: true`).
- Reparent keeps object identity. Deleting a parent orphans any surviving child to the scene root instead of losing it. That covers the
  concurrent "add child / delete parent" case. Verified in Node: Automerge keeps a child whose parent was concurrently deleted, so
  `e3.parent` dangles.
- Generic `tree` kind (an R3F-equivalent declarative node tree with an allowlisted `CATALOG` of three classes, no React, 45 LOC
  together with `model`): a colour edit keeps the same mesh and material; changing geometry args swaps only the geometry (radius 1→2), 0 leaks.
- Async `model` kind (stand-in for glTF): replacing the rep while the load is in flight leaves **0 stray models in the scene**.
  The late result is disposed. The happy path loads.
- Two-peer concurrency: A recolours while B moves and redefines the entity, then they merge. Both scenes converge (pos [5,0,0],
  Sprite, same colour) with 0 leaks on both.
- Bundle +1.7 KB gz over bare three.

### Rebuild per entity vs fine-grained per field, at 300 entities (C, Chromium, mean of 20 runs)

| edit (one Automerge change) | fine: reconcile / render | rebuild component: reconcile / render | rebuild whole entity: reconcile / render |
|---|---|---|---|
| move 1 | 0.17 / 1.5 ms | 0.14 / 1.6 | 0.10 / 1.3 |
| move all 300 | **1.6 / 1.1** | 1.4 / 2.8 | 57 / 36 |
| recolour all 300 | **1.5 / 1.1** | 27 / 44 | 91 / 29 |
| hp of all 300 (behaviour-only) | 1.2 / 1.0 | 1.3 / 1.2 | 43 / 32 (rebuilds visuals for a data change) |
| *Automerge change itself* | 30–40 ms | same | same |

Rebuild is fine for single edits (<2 ms either way), which covers what an editor or agent does. Fine-grained matters for batch and
remote edits: 25–60x less reconcile time and no GPU re-upload. The pragmatic design: **handlers may omit `update`**. The
reconciler then falls back to dispose+create for that component, so a new kind can start "rebuild-only" and gain fine-grained
updates later. Never rebuild the whole entity on a patch: that also rebuilds visuals when only `health` changed.

## 6. Automerge facts that constrain any option (Node, out of `node/am.mjs`)

- **Declarative set-definition must be a deep diff, never an assignment.** Peer A sets `hp=3` while peer B
  "redefines" the entity:
  `assign → merged hp = 10` (A's damage lost), `diff → merged hp = 3`. The same applies to arrays:
  `position = [5,0,0]` ∥ `position = [0,7,0]` → `[0,7,0]`, while per-index writes → `[5,7,0]`.
- `replaceComponent` (assignment) intentionally creates a new object identity: a concurrent recolour of the old rep is dropped
  (`{"kind":"billboard","image":"x.png","color":"#fff"}`). That is the right semantics for "swap representation". `setComponent`
  merges. Expose both, with clear names.
- Deletion wins over a concurrent edit (`e1 exists? false`).
- **Cost:** 300 deep-path writes in one change take ~30 ms (Node and Chromium alike), a flat map ~11 ms, and 1 write 0.29 ms. The saved doc
  grows ~530 B per 300-position tick. **Per-frame simulation motion (the T-rex chasing the sheep) must not stream
  through the doc.** The doc holds authored state. Simulation state lives in runtime side tables, with occasional low-rate
  authoritative snapshots, or goes over an ephemeral channel. `A.diff` for a 300-patch change: 0.15 ms, so receiving is cheap.

## 7. Recommendation

1. **Core = C.** The Automerge doc holds an ECS JSON map keyed by entity id and component type. A small hand reconciler with
   per-component handlers is the only code that touches three.js. Representation is one component with an open `kind`
   registry: `billboard → box/mesh → model(glTF url) → tree(generic JSON nodes)`, plus later kinds such as `animated`. The upgrade
   path is `replaceComponent(id, 'representation', …)`, and nothing hardcodes it. Animation can be a separate `animation` component
   whose handler finds the rep's mixer, so a mesh upgrade doesn't touch it.
2. **Agent surface: offer both entry points. They're nearly free**, because both are thin doc writers (api.js is 18 LOC):
   imperative `addEntity / setComponent (merge) / replaceComponent / removeComponent / setParent / removeEntity`
   + declarative `defineEntity(id, spec)` (deep-diffed), + `apply(ops[])` for a batch in **one** Automerge change. Expose
   it over CapTP as one `Far` object. The only rule: declarative must diff, never assign (section 6).
3. **Don't adopt R3F for the runtime.** It works, but costs +57–187 KB gz, idle-deferred disposal, manual texture disposal,
   reparent remounts, and an `extend` footgun, and it gives the agent nothing, since the agent writes doc data either way. If human
   JSX authoring is ever wanted, the `tree` kind already gives R3F-shaped JSON nodes without React. Cost of skipping: no
   drei/@react-three/xr ecosystem. WebXR then uses `renderer.xr` directly (another researcher's dimension).
4. **Don't persist three's toJSON.** Keep it for export/"bake" only. Offer raw three.js only as an **escape hatch that is itself
   data**: e.g. a `script`/`code` component whose source lives in the doc and runs (sandboxed) against *its own entity's*
   handle on every peer. Never as one-off mutations of one peer's live objects, which never reach the doc or other peers.
5. Rules for the reconciler, taken from the bugs found here: read values from the doc rather than from patches. Mark reps
   with `userData`, not `name`, because a generic `tree` overwrote `name`. Skip the shared Sprite geometry on dispose. Guard async loads
   with a disposed flag. Orphan a child to the root when its parent is missing. Apply each patch batch once per Automerge change.

What this forecloses: drop-in use of R3F/drei components (they would need wrapping as a `kind` that mounts a tiny R3F root,
which is possible but heavy). Also a "the agent just writes three.js" UX for live edits, which is replaced by the doc-data API plus the
sandboxed script component.
