# The scene today: an inventory (worktree wt/world at 681fcf5)

Paths are under packages/tails-and-scales/.

## What draws what
- **The mat**: view/table.js:257-261, one PlaneGeometry W×H, MeshStandardMaterial over a 2048 px canvas painted by `paintMat` (table.js:29-62: a flat #5b7a36 fill, ~1,040 blots and 14,000 blade strokes, all from Math.random). On boards larger than classic, a 256 px detail tile is multiplied in (`paintDetail`, :67-97, from a fixed hash; `detailMaterial` :101-115).
- **Scorch**: `paintScorch` (:142-218) repaints the mat's canvas for the powder board and blast marks (stream hashed from mark position: already seeded and view-only, the pattern to copy).
- **The wooden table**: :262-265, a 220×220 plane at y −0.62 with a Math.random wood-grain canvas repeated 6×6. **The frame**: :266-286, four boxes plus an under-box, one flat brown.
- **Deployment zones**: :291-311, a 7% tinted plane and a dashed LineSegments per seat.
- **Tufts and flowers**: :313-315, InstancedMesh of 700 three-sided cones and 140 icosahedra (×area on larger boards, capped 2,800 / 560), placed uniformly by Math.random over the whole mat (`scatterTufts`, :418-439), ignoring pieces, zones and objectives.
- **Rules pieces**: view/terrain.js. Builders in PIECES (:111-320: cap, tree, hedge, boulder, crate, barrel, keg, sack, mushroom, floor, rubble, wreck), WRECK_PIECES (:509-715: crater, stump, snag, deadlog, cart, sandbags, pyre, bombs, counterweight), FORT_PIECES (:754-906: deck, stair, ladder, post, parapet), WRECK_DECKS (:951-1107: farm, barn, trebuchet, wagon, engine). Each is built from the chunk's `look` alone (no layout draws); only destruction effects use Math.random. A forest floor is a flat irregular disc at y 0.012 (:290-303). Larger boards merge standing chunks into ~70 tiles (F8b).
- **Objectives**: view/objectives.js:53-68: stone base, glowing gem, pole, cloth flag, range ring.
- **Lights and shadows**: view/stage.js:131-153. HemisphereLight #d6e6ff/#3b2a1a 0.85; one sun DirectionalLight #fff0d6 2.3 at (−16, 34, 20), PCF soft shadows 2048 (1024 medium, none on low and ?lowfi), shadow camera ±27×±22 on classic, fitted to the view on larger boards (`fitShadow`); a fill light #9fb8ff 0.35. ACES tone mapping, exposure 1.05.
- **Sky and backdrop**: there is none. `scene.background` and `scene.fog` are both #1c1712, a near-black brown (stage.js:104-105), fog 70-140 (×board diagonal factor on larger boards, `fit`). Anything above the far edge of the table is that flat colour.
- **Evening state**: `mood(burning)` (stage.js:160-167) warms sky and sun and dims them slightly; called only when a non-powder scorch exists (view/index.js:75). Nothing follows the rounds.
- **Effects**: view/effects/plumes.js (smoke and fire Points clouds from wreck vents, two draw calls), fx.js (decals, particles), shots.js (projectiles).
- **Camera**: view/camera.js:41-56. Far 400 (classic), up to 600 on Grand (`setBoard`, :138); maxDistance 75 or the overview's fit ×1.1; maxPolarAngle 1.32 rad (no lower than ~14° above the horizon); minDistance 5. Title orbit: present/camera-presets.js:42, centre (−5,0,0), radius 25, height 13, 0.035 rad/s.

## Random per viewer today
Math.random in view/: table.js 16 call sites (the mat paint, the wood, tufts and flowers), terrain.js 26 (debris and falls), fx 30, plumes 19, shots 25, units 3, others a few. So two online players, and a replay, already see different mats, grass and tuft layouts. Only `paintDetail` and `paintScorch` are hashed. The figures' flocks and idle phases draw Math.random after the table, so any change in how many draws the table makes shifts them (sim/title-shot.mjs tolerates that, by design).

## Cost today (my frames, renderer.info, main pass, DPR 1, figures in)
| frame | draw calls | triangles* |
|---|---|---|
| title, classic seed 1 | 598 | 619 K |
| Skirmish classic s1 / s411 | 602 / 703 | 619 K / 626 K |
| Skirmish fortified s4 / s30 | 556 / 567 | 612 K / 618 K |
| Field open s7 | 629 | 691 K |
| Grand fortified s5 (tiled) | 260 | 200 K |
| Powder mid-battle (tiled) | 442 | 411 K |
*renderer.info counts each fur splat as two triangles, so these are not the bench's mesh-only figure.

Budgets (sim/render-bench.mjs header, DESIGN §4.2.1): main pass ≤ 600 calls, shadow casters ≤ 600, mesh triangles ≤ 400 K, splats ≤ 150 K, render JS ≤ 1.3× classic, fail above 1.25×. The table's "classic today" is 492 calls and 251 K triangles. **Classic has almost no draw-call headroom**: dressing must cost a handful of calls (instanced or merged, or painted into the mat for nothing). Grand, tiled, has room.

## What reads the scene
- **Minimap** (view/minimap.js): the terrain view's chunk defs, the mirror, unit views, objectives, the camera. It never reads meshes, so dressing is invisible to it (as it should be).
- **Fog ghosts** (view/fog.js): records handed over by present/fog.js; nothing of the scene.
- **Picker** (input/picking.js): the mat's mesh (`view.table.board`) and the terrain's walkable tops. Dressing must stay out of both.
- **Shadow fit** (stage.js `fitShadow`): clipped to the mat, so off-mat dressing gets no shadows on Grand (fine: it should not cast any).

## Checks that pin the look
- sim/title-shot.mjs: the title at 1200 ms, 1280×800 DPR 2, Math.random seeded, frames run by hand; pixel for pixel against a reference build (HEAD by default) with figures hidden. Any dressing on the title fails it until the reference moves.
- sim/terrain-shots.mjs: classic boards against the R0 commit, fortified against 4e416f9, pixel for pixel from a fixed pose (0,30,31), InstancedMeshes and figures hidden. The wooden table and frame are in that frame; replacing them fails it unless the harness hides the dressing.
- sim/snap-check.mjs: the table built event by event equals a fresh snap (units, chunks, markers). Dressing that follows battle events (scars, trampling) must rebuild identically from a snap.
- sim/bake-check.mjs: figure baking only; unaffected.
- sim/camera-check.mjs: the presets' numbers; an opening camera move must add a path, not change a preset.
- sim/render-bench.mjs: the budgets above.
- sim/boundaries.mjs: the view may not import core/rng.js or drawing modules; dressing that hashes the seed itself passes.
- The gallery thumbnail (thumbnail.jpg) is shot by hand from the title.
