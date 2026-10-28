# merge-meadow research — scene-api

_Structured summary returned by the research agent (Opus 5.5), 2026-10-28. Every finding is graded verified / likely / speculative by what the agent actually ran._

## Summary

I built three prototypes and drove each one through the same 8 scripted edits in headless Chromium: add a billboard, move it, recolor it, swap it to a box, resize the box, add a child, swap back to a billboard with the child attached, and delete with cascade. I counted leaks by wrapping dispose() and cross-checking renderer.info, and measured bundle sizes with vite build.

**(C) JSON ECS plus a small hand-written reconciler is the clear core.**
- The doc is `entities[id].components[type]`, all plain JSON.
- Automerge patches only tell the reconciler which (entity, component) pairs changed; the handler then reads the current value from the doc.
- Representation is a single component whose `kind` picks a handler from an open registry. That makes billboard → mesh → model → generic node tree a `replaceComponent` call, with no hardcoded upgrade path.
- Results: 0 leaks at every step, checked synchronously. Swapping the representation kept the same root object, the systems' per-entity state and the attached child.
- Cost: 116 lines of glue and +1.7 KB gzip over bare three.

**(B) react-three-fiber v9 works but buys the agent nothing.** It runs fine with three 0.186.1, React 19.3.1 and Vite 5. My B prototype used C's doc API unchanged, so the agent writes the same doc data either way and React only sits behind the doc. Its costs:
- +57 to +187 KB gzip.
- Unused geometries and materials are disposed late, during idle time, not at commit.
- Textures passed as props are never disposed (2 leaked in the naive version).
- Changing an entity's parent rebuilds its whole visual subtree.
- Using `createRoot` without `<Canvas>` throws unless you call `extend(THREE)`, which then ships all of three.

**(A) Direct three.js is fine inside handlers but bad as the stored format or the agent's API.**
- Saving `toJSON` into Automerge costs about 500 ms per edit at 300 entities.
- Other peers get patches addressed by array index, so they can only rebuild the whole scene.
- Textures end up embedded as data URLs.
- Moves are lost unless `updateMatrixWorld()` runs before saving.
- Plausible agent code leaked 3 geometries, 4 materials and 2 textures, and lost both the behavior data and the child.

**Two Automerge rules apply whichever option you pick.**
- Writing a whole new definition must be a deep diff, not an assignment. Assigning wiped a concurrent damage edit (hp came back 10 instead of 3).
- Per-frame movement must not go through the doc. 300 position writes cost about 30 ms per change, and the saved doc grows about 530 B per tick.

**Rebuild vs fine-grained updates at 300 entities.** Fine-grained reconcile takes about 1.5 ms. Rebuilding the changed component takes 27 ms plus a 44 ms GPU re-upload, and rebuilding the whole entity takes 57–91 ms. Rebuilding is fine for a single edit; recommended design: a handler can leave out `update` and fall back to rebuilding.

**Offering both entry points is nearly free.** The imperative methods and the declarative "set definition" are both thin writers onto the doc (the whole API is 18 lines).

## Findings

- **[verified]** Option C (JSON ECS + hand reconciler) had 0 leaked geometries, materials and textures at every one of the 8 steps, checked synchronously, and in a two-peer concurrent edit/merge.
  - _Evidence:_ out-C.json script: leaked g/m/t = 0/0/0 at all steps; the GPU count drops to 1 texture, which is three r186's shared DFG LUT for MeshStandardMaterial (confirmed in WebGLRenderer.js getDFGLUT). In the remote test both peers converged to pos [5,0,0], Sprite, #0000ff, with 0 leaks on each.
- **[verified]** In C, replacing the representation (billboard→box→billboard) keeps the same root Object3D, the system-side per-entity state, the behavior data and the attached child.
  - _Evidence:_ C steps 4 and 7: sameRoot=true, sameBrain=true, behaviorData={hp:10,max:10}{flees:[predator],speed:2}, childStillAttached=true, repType Mesh then Sprite.
- **[verified]** R3F 9.8.2 works with three 0.186.1, React 19.3.1 and Vite 5.4.21, and a tree generated from the Automerge doc with the doc as the source of truth works. A generic JSON node tree ({type, props, children} → createElement) reconciles in place.
  - _Evidence:_ protoB ran the whole script. In the tree representation, a color edit kept the same mesh and material (sameMeshAfterColorEdit=true, sameMaterial=true). The peer-dependency range is react >=19 <19.4 and three >=0.156. Each root logs a THREE.Clock deprecation warning.
- **[verified]** Using R3F createRoot without <Canvas> requires extend(); otherwise it throws 'AmbientLight is not part of the THREE namespace'. extend(THREE) ships all of three.
  - _Evidence:_ pageerror in the first B run. Bundles: B with extend(THREE) 248.6 KB gz; with selective extend 187.9 KB; react-dom + <Canvas> 318.4 KB; C 132.7 KB; baseline three 131.0 KB.
- **[verified]** R3F disposes unmounted geometries and materials late, during idle time, not at commit. Textures passed as props (map={tex} from useMemo) are never disposed without an explicit useEffect cleanup.
  - _Evidence:_ leakedImmediately was 1–2 right after the commit and 0 after about 100 ms (events-*.esm.js line 16767 schedules dispose at IdlePriority). The naive billboard leaked 2 textures (items: 'texture:1009 a', 'texture:1009 b'), with GPU textures at 3 vs 1.
- **[verified]** Changing an entity's parent in R3F rebuilds its whole visual subtree (new Object3D and new geometry); C moves the existing object.
  - _Evidence:_ B extras reparent: sameObject=false, sameGeometry=false. C extras reparent: sameObject=true, parentIsScene=true.
- **[verified]** React is not a performance problem at 300 entities: with memo plus per-entity subscriptions, React work is 0.2 ms (move one), 2.2 ms (move all) and 1.8 ms (recolor all). A naive full re-render from the root is 3.6 ms per change.
  - _Evidence:_ out-B.json bench, reactOnlyMs, mean of 20 runs. Automerge 3 shares unchanged objects between versions (verified in Node: d2.entities.e2 === d.entities.e2), which is what makes memo work.
- **[verified]** Storing three's toJSON in Automerge is impractical for live editing: at 300 entities one move costs toJSON 44 ms plus 455 ms to diff into the doc. A naive diff that replaces whole arrays produced a 914 KB change; a diff keyed by uuid gives 120 B.
  - _Evidence:_ out-A.json bench: jsonKB 794, moveOneWarm {toJSONMs 43.8, diffIntoDocMs 455, changeBytes 120}. 150 tiny 64px canvas textures were embedded as data URLs.
- **[verified]** With three's JSON in the doc, patches are addressed by array index, so a remote peer can only rebuild everything with ObjectLoader. Rebuilt images decode asynchronously, so remote sprites render without their texture at first. A move is lost unless updateMatrixWorld() runs before toJSON.
  - _Evidence:_ Patch paths: 'put scene.materials.1.color=16711680', 'del scene.object.children.0', 'put scene.object.children.5.matrix.12'. Remote rebuild of 300: 9.8 ms plus a 30 ms first render. Chromium logged 'Texture marked for update but image is incomplete'. The first patch-shape test recorded 0 patches for a move until updateMatrixWorld was added.
- **[verified]** Agent code written against the raw three.js API is fragile: plausible naive code leaked resources and lost behavior data and the child.
  - _Evidence:_ out-A.json naive: final leaked 3 geometries, 4 materials, 2 textures; behaviorKept=false from the representation swap on; childKept=false.
- **[verified]** Writing a whole new definition must deep-diff into the doc. Assignment wipes concurrent edits (entity-level and whole arrays).
  - _Evidence:_ node/am.mjs: assign → merged hp=10 (concurrent damage hp=3 lost); diff → hp=3. Assigning position [5,0,0] concurrently with [0,7,0] gives [0,7,0]; per-index writes give [5,7,0]. replaceComponent intentionally drops a concurrent recolor of the old representation.
- **[verified]** Per-frame simulation state must not go through the Automerge doc: 300 position writes in one change take about 30 ms and the saved doc grows about 530 B per tick.
  - _Evidence:_ Node: 300 deep-path writes 29.7–32.8 ms per change; flat map 11 ms; 1 write 0.29 ms; 300 separate changes 43.7 ms. Same about 35 ms in Chromium (moveAllDocOnlyMs). A.diff of a 300-patch change takes 0.15 ms.
- **[verified]** Fine-grained per-component updates are 25–60x cheaper than rebuilds for batch edits at 300 entities; for a single edit the difference doesn't matter.
  - _Evidence:_ C bench reconcile/render ms. Move all: fine 1.6/1.1, rebuild component 1.4/2.8, rebuild entity 57/36. Recolor all: 1.5/1.1, 27/44, 91/29. HP-only change: rebuilding the entity costs 43/32 because it rebuilds visuals. Move one: all modes under 0.2 ms reconcile.
- **[verified]** Automerge 3 stores strings as collaborative text by default, so a color assignment arrives as a put of '' followed by splice patches. A reconciler should use patches only to find what changed and then read the values from the doc.
  - _Evidence:_ patchCallback output: put representation.color='' then splice representation.color.0 '#f00'. Reading from the doc worked for every edit in C.
- **[verified]** A generic declarative JSON node-tree representation (R3F-like, with an allowlisted catalog of three classes) and a glTF-style async model representation that is safe against being replaced mid-load are both cheap in C without React.
  - _Evidence:_ kinds-extra.js is 45 LOC. Tree: a color edit kept the same mesh and material; changing geometry args swapped only the geometry (radius 1→2); 0 leaks. Async race: 0 stray models in the scene after replacing mid-load; the happy path loads. That the late-loaded model was disposed is from reading the code, since it never entered the scene for the tracker to see.
- **[verified]** Offering both imperative methods and a declarative set-definition costs almost nothing once the doc is the source of truth: the whole API is 18 lines, and it served both B and C unchanged.
  - _Evidence:_ protoC/api.js (18 non-blank LOC) was imported unchanged by protoB/main.js.
- **[likely]** The API object can be exposed over CapTP as a single Far('Scene', api) remotable.
  - _Evidence:_ Not run here; I left it to the CapTP dimension. The API is a flat object of functions that take and return plain JSON.

## Recommendation

Adopt (C) as the scene core. The Automerge doc is `entities[id] = {parent, name, components:{[type]: JSON}}`, and a hand-written reconciler is the only code that touches three.js. Each component type has a handler (create/update/dispose, where update returning false means recreate). Representation is one component whose `kind` picks a handler from an open registry: billboard, box, mesh, model(url), a generic tree of JSON nodes, and later animated kinds. Behavior components are pure data, and systems keep their runtime state in tables keyed by entity id.

Expose one CapTP object with both entry points. Imperative: addEntity, setComponent (merges fields), replaceComponent (new identity), removeComponent, setParent, removeEntity. Declarative: defineEntity, which deep-diffs and never assigns. Plus a batch apply(ops) that writes one Automerge change. The cost is about 116 + 45 lines and +1.7 KB gzip.

Do not adopt R3F for the runtime: +57–187 KB gzip, late and partly manual disposal, rebuilds on reparent. What we give up is drop-in drei and @react-three/xr components; WebXR has to use renderer.xr directly.

Do not store three's toJSON. Use it only for export or "bake this entity". If the agent needs raw three.js, provide it as a component whose source lives in the doc and runs sandboxed against its own entity on every peer. One-off live mutations on one peer never reach the doc or other peers.

Keep per-frame simulation motion out of the doc; 300 writes cost about 30 ms per change. Coordinate this with the sync and simulation researchers.

## Risks

- Automerge write cost (about 0.1 ms per deep write, about 30 ms per 300-write change) means the simulation (chase, flee, movement) needs its own runtime state and a low-rate or ephemeral sync path. Without that, multiplayer motion will stutter or bloat the doc history.
- The Automerge wasm is 3.6 MB raw / 1.1 MB gzip, and the browser export needs vite-plugin-wasm (vite-plugin-top-level-await broke the build with target esnext). This applies to every option and dominates the bundle size.
- C's generic tree representation matches child slots naively by type. Fine-grained updates to deep or reordered node trees fall back to rebuilding; making them smarter adds reconciler complexity.
- Choosing setComponent (merge) or replaceComponent (new identity) changes what survives concurrent edits. The agent and editor must be told which one to use; a wrong default either drops concurrent edits or leaves stale fields behind after a kind swap.
- Any escape hatch that runs code (a script component) needs SES or Compartment sandboxing for agent-written code. I did not evaluate that here.
- Shared resources (textures cached by URL, the shared Sprite geometry, three's DFG LUT) need reference counting or skip rules in disposal. A naive disposeDeep disposed the shared Sprite geometry until I fixed it.
- When a parent is deleted concurrently with a child being added, the child's parent reference dangles. My reconciler moves such children to the scene root; the doc layer should eventually repair or garbage-collect them.

## Versions tested

- `three@0.186.1`
- `@react-three/fiber@9.8.2`
- `react@19.3.1`
- `react-dom@19.3.1`
- `@automerge/automerge@3.5.0`
- `vite@5.4.21`
- `vite-plugin-wasm@3.6.0`
- `playwright@1.63.0 (chromium-1243, SwiftShader)`
- `node@22.22.0`

Long-form report with code and numbers: [`scene-api-report.md`](./scene-api-report.md)
