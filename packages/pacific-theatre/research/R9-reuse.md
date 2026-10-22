# R9: the reuse audit of the Hawaiian app, and a review of the engineering contract

Researcher R9, 22 October 2026. Read against `BRIEF.md`, the designer's
drafts in `design/` (`DESIGN.md`, `DATA.md` as of 08:09, `ENGINEERING.md` as
of 07:20) and the owner's decisions (both sides playable in any battle
between military forces; the tide turns only inside the box; watching is
always the alternative; the name is Pacific Theatre, slug `pacific-theatre`;
v1 is Midway, the Second Naval Battle of Guadalcanal, Samar and Pearl
Harbor).

What I read, all of it line by line unless noted:

- every file staged in `packages/pacific-theatre/` (it is byte-identical to
  `packages/holo-i-ke-au/` at `b480c27` on `origin/claude/funny-cannon-vy1pyf`;
  I compared every file with `cmp`);
- the unstaged Hawaiian modules that matter for reuse, exported to
  `research/downloads/R9/`: `features/sprites.js`, `features/kit.js`,
  `features/labels.js`, `features/soldiers.js` (header and API),
  `render/shaders/sprite.glsl.js` (header), `overlay/polity.js` (API);
- the Hawaiian `DATA.md` (§§1–4, Routes, District packs, Patches) and
  `DESIGN.md` §§3.3–5.8;
- three.js r160.1's own source in the root `node_modules/three` for the
  logarithmic depth buffer (`WebGLProgram.js`, `WebGLPrograms.js`,
  `WebGLRenderer.js`, the four `logdepthbuf_*` chunks) and for reversed depth
  (absent in r160);
- the Hawaiian `dist/` sizes from `git ls-tree -l` on its branch;
- the npm registry for `geotiff`, `shapefile`, `three`, `subset-font`;
- R1 (§§0, 5, 6) and R3 (§§2, 7) for the projection, the budget, the
  chapters and the clocks.

What I ran: two scripts. `research/r9-scripts/checks.mjs` measures float32
resolution at the scales in play, float32 rounding of a 1/60 s sim step,
and the moon age the Hawaiian sky model gives on the four v1 battle dates
against a mean-lunation reference. `research/r9-scripts/subset.mjs`
measures a Noto Sans JP woff2 subset with `subset-font` 2.4.0 (the font
and the package were fetched into the scratchpad and deleted afterwards). I
did not build or run the app: there is no `package.json` staged, and a
build would write into the repository. §9 lists every URL and file.

---

## 0. Headline findings

1. **The staged copy does not build.** Seven relative imports name files
   that were not staged: `src/app.js` → `render/district.js`,
   `render/patches.js`, `overlay/polity.js`, `overlay/land.js`;
   `src/render/world.js` → `render/patches.js`; `tools/lib/bake-run.mjs` →
   `boundaries.mjs`, `sources.mjs`. There is no `package.json` or
   `vite.config.js`. About half of the staged source bytes carry over with
   parameter-level edits (decoder, CDLOD, camera rig, sky, pipeline, lines,
   routes, pins, card, fonts, tools/lib); the other half is Hawaiian wiring
   (islands, district, patches, polity, land view) to be rewritten or
   dropped.
2. **Units are module constants, and two scenes need two of them.** The
   100 m world unit is baked into `geo.js`, `load.js` (`mx`, `mz`),
   `world.js` (`uVert = exag / 100`), the ocean's wave dispersion
   (`sqrt(9.8·k·100)`), every noise frequency in the terrain and ocean
   shaders, and about forty distance constants (§2.1 lists them). With the
   table in kilometres and a box in metres in one page, each must become a
   per-scene parameter (`proj.unit`, `ground.vert = exaggeration / unit`),
   never a literal.
3. **The projection change is narrow.** Only `geo.js` and `load.js`'s
   `describePack` assume a linear lon/lat projection; every renderer works in
   world xz after `proj.toWorld`. The table needs one new class
   (`TableProjection`, aeqd), one branch in `describePack` (use the
   manifest's `extent` instead of `proj.rect(bounds)`), and one longitude
   normalisation of every coordinate at load. The CDLOD quadtree is fine
   with the table pack because the pack is regular in projected space.
4. **`world.js` and `common.glsl.js` are the deepest coupling**: five island
   slots, a district, 32 patches, and the ocean, lines, routes and shadow
   shaders all compile against them through `groundMetres()`. A single-pack
   ground chunk of about sixty lines that keeps the same function names lets
   those four shaders compile unchanged in both scenes.
5. **The table's relief cannot use the island terrain as is.** `pack.js`
   skips every node wholly below −0.5 m (`SEA_CULL`), which is the whole sea
   floor the table is meant to show; the vertex shader sinks the seabed
   25 m; normals are baked at `NORMAL_EXAG = 2`, which in 8 bits bands the
   abyssal plain once the table's exaggeration is near 20; the land texture
   (drainage, sand) costs about a second and 15 MB for nothing on the table.
6. **Float precision**: ENGINEERING §2's storage figures hold (float32
   resolves 1.6 cm at ±200 km and 3.1 cm at 300 km; 0.5 m at the table's
   7,085 km edge), but **the sim must integrate in Float64**. In float32 at
   150 km from the box origin, a ship at 2 knots runs 9 % slow over a minute
   and a ship under 0.9 knots never moves (measured). Instanced units should
   be written camera-relative so the player's own aircraft does not shimmer.
7. **The logarithmic depth buffer works, but not the way §2 says.** In
   three r160 it defines `USE_LOGDEPTHBUF` in every ShaderMaterial and does
   **not** add the code: each Hawaiian custom shader (terrain, ocean, lines,
   routes) would keep writing ordinary depth while built-in materials write
   log depth. It also turns off `polygonOffset` (which lines, routes and the
   ocean use), disables early depth rejection, and breaks the composite
   pass's fog, which rebuilds distance from the depth texture through the
   inverse projection. "The table does not mind" is wrong as written. The
   fixes are small and listed in §3; including three's `<common>` chunk to
   get `isPerspectiveMatrix` would redefine `PI` against the Hawaiian
   `constants` chunk, so use a four-line chunk of our own.
8. **`time.js` would show an empty timeline.** `Timeline` keeps only eras
   with a numeric `year`, and `chapters.json` has `from`/`to`, so every
   chapter is filtered out. `parseDate` drops the day, the time and the
   offset (`1942-06-04T04:30-12:00` reads as 1 June) and reads a battle time
   `10:22` as the year 10. "Half an era either side" on R3's chapters is a
   window of three to seven months. ENGINEERING §4's replacement window,
   `min(21 days, half the gap to the nearest chapter edge)`, collapses to
   zero on every chapter boundary. DATA.md §4's example writes Midway's
   clock as `+12:00` (it is ISO `−12:00`, the navy's "zone +12") and says
   Tokyo is 21 hours "behind" (it is ahead).
9. **The sky has no year and no place.** `sky.js` anchors the moon on a new
   moon of 12 August 2026 (right by coincidence at Midway and Guadalcanal,
   about ten days wrong at Pearl Harbor and Samar), fixes the latitude at
   21° N in module scope, and takes a local solar hour rather than a zoned
   clock. The night battle also needs point lights (star shells,
   searchlights, gun flashes) that the Hawaiian lighting model does not
   have.
10. **ENGINEERING §13 cannot run in parallel as drafted.** `render/**`,
    `geo.js`, `time.js`, `config.js`, `data/**` and `package.json` belong
    to `table`, but `engine` needs every one of them adapted for metres on
    its first day; `package.json` is claimed by both `bake` and `table`;
    `labels.json` by both `bake` and `content`; `RESEARCH.md` by three
    workflows. A short Stage 0 ("core", plus the lockfile in its own commit)
    before the fork, frozen id lists for kits and boxes, and a check script
    split into per-workflow modules make the five streams disjoint (§6).
11. **Interfaces a blind builder would trip on**: the typed-array layout and
    capacity, the order of work inside a step, how the scene learns of a
    spawn or a sinking, input levels against one-shot presses (the smoke
    test's scripted input is lost if the controls zero `input` each frame),
    who owns the battle clock, what scrubbing means after the player has
    changed the battle, where the sim gets its terrain, which uniforms the
    two scenes share, and key arbitration: Q/E, the arrows, Space and Esc
    are each bound by two or three of the camera rig, `ui.js` and the
    sortie controls. The camera rig has no `dispose()`, so every box visit
    would leak a rig's listeners on the shared canvas.
12. **Size and dependencies.** v1 `dist/pacific-theatre/` lands near 13 to
    21 MB, about 15.5 in the middle (data 11–19 MB, JavaScript 0.75–0.95
    MB, Latin fonts 0.2 MB, and a Japanese subset measured at about 120 KB
    per weight for 526 characters). Pin `three` `^0.160.0` (0.160.1 is in the
    root lockfile), `geotiff` **2.1.3 exactly** (R1's curl client subclasses
    its 2.x `BaseClient`; 3.x is ESM-only and untested here) and `shapefile`
    0.6.6; `subset-font` 2.4.0 only if the font is subset with npm rather
    than fonttools. The lockfile change goes in its own commit.

---

## 1. Method, and the state of the staged copy

- **Identity.** All 45 staged files compare equal to the Hawaiian package at
  `b480c27`. Nothing has been adapted yet.
- **What was staged** (`src/`, `tools/lib/`, four tools, `style.css`,
  `index.html`, `main.js`, `FONTS.md`) is the shared core; what was left
  behind is `features/` (vegetation, settlements, soldiers, sprites, the
  geometry kit), `overlay/` (polity, land), the district (`data/district*`,
  `render/district.js`, `shaders/district.glsl.js`), the patches
  (`data/patches.js`, `render/patches.js`), the layers, and the bakes
  (`bake*.mjs`, most of `tools/lib`).
- **Broken imports in the staged copy** (found with a resolver loop over
  every relative import):

  | file | import | consequence |
  | --- | --- | --- |
  | `src/app.js` | `./render/district.js`, `./render/patches.js`, `./overlay/polity.js`, `./overlay/land.js` | `app.js` cannot load; it is rewritten anyway |
  | `src/render/world.js` | `./patches.js` (`patchUniforms`) | world.js cannot load; replaced by a single-pack ground (§2.3) |
  | `tools/lib/bake-run.mjs` | `./boundaries.mjs`, `./sources.mjs` | the Hawaiian bake driver; a pattern, not a module to keep |

- **Missing files the build needs**: `package.json`, `vite.config.js`
  (`export { default } from '../../vite.config.shared.js'`), and a root
  `.gitignore` line for `packages/pacific-theatre/test-data/` (the Hawaiian
  branch added its own; `main` has neither that nor the
  `/.claude/worktrees/` line the parallel worktrees will want).

## 2. The module table

Verdicts: **copy** (as is, header comment and provenance only), **adapt**
(say what), **new** (write from scratch, maybe borrowing an idea), **not
needed**. "Reaches into" lists what the module reads of the app or of other
modules beyond its imports. Sizes are bytes of the staged file.

### 2.0 `src/`

| file | purpose | size | imports | reaches into | table scene | battle box |
| --- | --- | --- | --- | --- | --- | --- |
| `main.js` | boot: gazetteer, archipelago pack, then islands, patches, districts, land layers behind the curtain | 3,069 | config, data/load, app, ui/ui | `app.world.archPack`, `.islandPacks`, `app.addIsland`, `app.patches`, `app.districts`, `app.land`, `app.rig.state.target` | **adapt**: keep the progress bar, `warn`, "four frames before the curtain lifts"; boot = manifest → table pack → `App` → `UI`; drop the island queue, patches, districts, land | **not needed** (the box streams on entry; `battle.html` has its own few lines) |
| `index.html` | canvas `#scene`, `#boot` curtain | 1,391 | `style.css`, `main.js` | — | **adapt**: title, description, boot art; keep `#boot` (the thumbnail waits on `!#boot`) | — |
| `src/app.js` | renderer, pipeline, light bag, World, Ocean, Sky, rig, lines, routes, polity, land, quality governor, frame loop, `settle()` | 13,972 | three, World, Districts†, Patches†, Ocean, Sky, Pipeline, CameraRig, Boundaries, Routes, PolityOverlay†, LandOverlay†, Timeline († not staged) | everything | **adapt heavily**: keep the renderer setup, the `light` and shared-uniform bag (split, §4.7), `govern`/`applyQuality`, `resize`, the frame loop, `settle`; drop views, polity, land, islands, districts, patches, `islandFill` | owner of the active-scene switch and the hand-over (integrate) |
| `src/config.js` | `UNIT = 100`, zoom limits, exaggeration curve, `NORMAL_EXAG`, `SLOTS`, patch counts, `DISTRICT`, `FEATURE_S`, `dataBase()` | 4,180 | — | — | **adapt**: one object per scene: `TABLE = { unit: 1000, minD, maxD, exag: { near, far, dNear, dFar }, normalExag }`, `BOX = { unit: 1, … }`; keep `dataBase()` and the smoothstep-on-log-distance curve shape; drop slots, patches, district, `FEATURE_S` | **adapt** (the `BOX` object; a fixed exaggeration, §3.1) |
| `src/geo.js` | linear equirect `Projection` (x, z, `toWorld` → `[x, z]`, `toLonLat`, `rect`), `islandKey`, `geometryPoint` | 2,521 | config (`UNIT`) | — | **adapt**: add `TableProjection` (aeqd/laea/equirect, Snyder spherical), `wrapLon`, `jacobianAt`, `convergenceAt`, `placement`; keep `geometryPoint` (call it only on normalised coordinates); drop `islandKey`; import nothing (the sim uses it) | **copy** `Projection` as `TangentProjection` with `unit` from the constructor and a longitude wrap |
| `src/time.js` | eras as keyframes over a slider index `s`; `parseDate` to fractional years; `eventSpan`, `formatWhen`, `Timeline` (half an era either side) | 5,156 | — | — | **new** (keep the API shape: `onChange`, `pair`, `window`, `formatWhen`); §2.6 has the exact change | **new** `BattleClock` |
| `src/data/load.js` | `loadData` (manifest, boundaries, gazetteer), `describePack`, `PackDecoder` (worker pool, main-thread fallback) | 5,721 | config (`UNIT`), geo, image, decode | — | **adapt** `loadData` (new file list; normalise longitudes) and `describePack` (§2.2); **copy** `PackDecoder` | **copy** `PackDecoder`; **new** `loadBox(desc)` with the same `describePack` |
| `src/data/decode.js` | split-byte heights → metres; flat-sea shelf; AO; packed normals at `NORMAL_EXAG`; drainage, sand and rain "land" map | 12,487 | config (`NEAR_EXAG`, `NORMAL_EXAG`) | — | **adapt**: `normalExag` and `aoExag` as parameters (table ≈ 16–20, §2.3); `land: false` skips `landTexture` | **copy** with the parameters (2 and 1.0) |
| `src/data/image.js` | PNG → exact bytes via `createImageBitmap` + 2D canvas | 1,100 | — | — | **copy** | **copy** |
| `src/data/worker.js` | the decode worker | 1,163 | image, decode | — | **adapt**: pass `normalExag`, `land` | same |
| `src/render/pack.js` | CDLOD terrain over one pack (`PackTerrain`), min/max pyramid, `metresAt`, `heightTexture` | 12,954 | three, terrain shaders, shadow | `world.uniforms` (shared bag), `world.arch`, `world.app.renderer` | **adapt**: `opts.seaCull = -Infinity` (the sea floor is the picture), `opts.vertexShader/fragmentShader` for the relief shader; node-box margins (−0.3/+0.1 world units, ±40 m) by unit | **copy** through `opts` |
| `src/render/world.js` | archipelago + five island slots + district hand-over; `metresAt`, `heightAt`, `maxY`, exaggeration as `uVert = exag/100` | 11,647 | three, config, pack, patches† | `app.patches`, `app.renderer`, `app.light.sunDir`, `district` | **not needed** as is; a `TableGround` of about 80 lines replaces it (one `PackTerrain`, `vert = exag/unit`, `metresAt`, `heightAt`, `maxY`, `bounds`) | same, as `BoxGround` (fixed exaggeration) |
| `src/render/shaders/common.glsl.js` | `constants` (PI, SLOTS…), `noise`, `world` (arch + slots), `patches`, `ground` (`groundMetres` over slots, district, patches), `lighting`, `polity`, `land` | 23,337 | config | — | **adapt**: copy `noise` and `lighting`; replace `world`/`patches`/`ground` with a single-pack chunk keeping the same names (§2.3); drop `polity` and `land` (the front is its own chunk) | same; `lighting` gains point lights (§4.7) |
| `src/render/shaders/terrain.glsl.js` | island vegetation by rain, pali, coast; CDLOD geomorph; normals rebuilt at the exaggeration of the moment; polity and land overlays | 15,962 | common | — | **not needed** except two pieces to copy into the relief shader: the vertex geomorph (lines 202–237) and the gradient rebuild (lines 282–285) | **adapt**: keep `groundAlbedo` fed with a per-box `uRain` constant (or drop to a ramp), rescale every `xz` frequency by `unit/100`, drop slot/district discards, `applyLand`, `applyPolity` |
| `src/render/shaders/ocean.glsl.js` | sea surface: depth colour from the ground, sky reflection, glint, swell and chop faded by pixel size, swash, caps, reef mottle | 7,859 | common | `groundMetres`, `distPond`, `patchReef` | **not needed** (the chart sea is a tint in the relief shader, §2.10) | **adapt**: Hawaiian units inside (`vec2 p = xz * UNIT_M / 100.0`), pixel thresholds by the same factor, wind and swell from `weather`, point-light glints |
| `src/render/ocean.js` | the camera-following disc of sea, rings growing geometrically to 250,000 units | 2,175 | three, ocean shaders | shared uniforms | **not needed** | **adapt**: radius ≥ far (1,000 km in metres), no reliance on `polygonOffset` |
| `src/render/camera.js` | orbit rig: zoom to cursor, pitch by distance, flights with a mid-flight hop and a `ready` hold, `fit`, ground-riding target, picking by ray march, dynamic near/far | 22,529 | three, config (`MIN/MAX_DISTANCE`) | `world.bounds`, `world.maxY`, `world.heightAt`, `world.metresAt`, `world.uniforms.uVert` | **adapt**: limits, pitch curve, clearances, near/far clamps and target margin as constructor options; a ground interface (§2.4); `dispose()`; `keys: false` option | same rig for watch mode, metres; the chase/bridge/director cameras are new (`battle/scene/cameras.js`) |
| `src/render/lines.js` | draped screen-width lines (`LineSet`), batched per island; `Boundaries` (moku, ahupuaʻa) | 7,679 | three, common (`world`, `ground`), geo (`islandKey`) | shared uniforms (`uVert`) | **adapt**: keep `LineSet` (coast strokes, front outlines, perimeters, declared lines, the date line); `MAX_SEG`, lift and bounds by unit; batch key as an option; drop `Boundaries` | **optional** (a box outline, bearing lines) |
| `src/render/routes.js` | routes drawn as draped lines with arrowheads, dashes for schematic stretches, a pulse along the direction of travel, fade by year window, zoom and island fill | 16,797 | three, common | `proj`, shared uniforms, eras | **adapt**: dates in ms and the window from `WarClock`; `MAX_SEG` 10–25 km; fade with the fly-down, not `ZOOM_IN`; vocab (`fleet`, `strike`, `convoy`, `lane`, `drive`, `schematic`; precision `report`, `chart`, `narrative`, `schematic`); densify long legs in lon/lat before projecting | **optional, recommended**: `RouteLine` draws a unit's recorded track, styled by fix precision, in watch mode (the open decision "how uncertainty looks in a box") |
| `src/render/sky.js` | Preetham sky in GLSL and JS, sun and moon, Milky Way, bright and faint stars, the radiance map, the light colours | 18,037 | three, stars, pipeline | — | **adapt**: `astronomy(utcMs, lat, lon)` from a dated ephemeris; latitude per instance; drop `MOON_NIGHTS` | same, at the box's lat/lon and the battle clock's UTC instant |
| `src/render/stars.js` | bright stars (J2000) | 2,975 | — | — | **copy** (precession to 1942 is about 0.8°; rewrite the Hawaiian comment) | same |
| `src/render/shadow.js` | per-pack heightfield sun shadows, redrawn a strip a frame | 4,812 | three, common (`constants`, `world`), pipeline | the pack's uniforms | **optional** (off: the table's relief is hillshaded) | **copy** over the single-pack chunk |
| `src/render/pipeline.js` | HDR MSAA scene target with depth, composite: height fog from depth, clouds slot, night tint, exposure, ACES, sRGB | 6,033 | three | — | **adapt**: log-depth decode in the composite (§3.3), `uFade` for the hand-over, fog parameters set by the active scene | same |
| `src/ui/dom.js` | `$`, `h`, `esc` | 679 | — | — | **copy** | **copy** (HUD) |
| `src/ui/icons.js` | line icons, one per Hawaiian event kind, plus tools | 3,292 | — | — | **adapt**: icons for the Pacific kinds and for enter, watch, take the controls | the HUD may share it |
| `src/ui/pins.js` | DOM pins following the ground, halo by place precision, per-frame clustering by union-find, cluster list tooltip | 14,182 | three, dom, icons, geo, time | `app.data.{places,events,proj}`, `app.timeline.{yearAt,s,window}`, `app.rig.state.distance`, `app.world.heightAt`, `app.camera`, `app.warn` | **adapt**: window in ms; halo radii for `exact`/`area`/`sea` in km (`area` from the polygon); size curve constants by unit; a distinct marker for events with a box | **not needed** |
| `src/ui/card.js` | event, era-as-chapter and cluster cards; sources with "verify"; footer Back/Next | 10,664 | dom, icons, time | `app.data.{places,sources,events}`, `ui.tour` | **adapt**: Pacific `KIND`, the `ja` line, the zoned `formatWhen`, chapter dates; *Enter the battle* button | briefing and after-card as new modes or modules (`ui/briefing.js`, `ui/after.js`) |
| `src/ui/timeline.js` | slider over era index, evenly spaced ticks, era label, tour pill | 5,602 | dom, icons, time | `app.timeline`, `ui.tour`, `ui.onScrub` | **adapt**: slider over `WarClock.s`, ticks at each chapter's `from` placed by date, a date label | hidden in a box |
| `src/ui/tour.js` | the chapter tour: chapters from eras, events by start date, stops, views (chain, island, point, stop camera), prefetch of districts | 18,342 | geo, time, camera (`preferredPitch`) | `app.data`, `app.world.archPack`, `app.timeline`, `app.rig`, `app.districts`, `app.viewChosen`, `ui.pins`, `ui.card`, `ui.timeline`, `ui.freeBox` | **adapt**: chapters from `chapters.json`; zooms `table`/`box`; a box stop hands to `app.battle`; `prefetch` starts the box decode; drop island gathering, the land/chiefdom view switch, districts | box stops scrub the battle (`battle.scrub(t)`, `scene.setCamera`) |
| `src/ui/ui.js` | the interface shell: brand, tools, legend with view switch, moku inspector, help, keyboard, `freeBox` | 18,799 | dom, icons, app (`landZoom`, `polityZoom`: a cyclic import), timeline, pins, card, tour | `app.{overlay,view,land,polity,districts,world,rig,timeline,shared,params,updaters}` | **adapt heavily**: keep tools, help, `freeBox`, the keyboard handler (with arbitration, §4.6), the pins/card/tour wiring; drop the legend, inspector, polity, land; break the import of `app.js` | the HUD is the engine's |
| `style.css` | fonts, tokens, boot, panels, card, timeline, pins, legend, help | 32,292 | the eight woff2 files | — | **adapt**: tokens to a chart palette; `:lang(ja)` face for the Noto subset; drop legend and inspector rules | the engine's `battle/scene/hud.css`, imported by `hud.js` |
| `src/fonts/*` (8 files) + `FONTS.md` | Fraunces 600 and 400 italic, Inter 400 and 600, latin and latin-ext | 198,604 | — | — | **copy**, plus a Noto Sans JP subset (OFL 1.1) | same |

### 2.0b `tools/`

| file | purpose | size | imports | reaches into | verdict |
| --- | --- | --- | --- | --- | --- |
| `tools/lib/fetch.mjs` | curl with retries and a ledger (`fetched.json`: URL, date, bytes, SHA-256); `fetchText` | 3,539 | node | — | **copy**, plus a `{ globoff: true }` option that passes `-g` for OPeNDAP brackets (DATA.md §11 says so; `fetchTo` lacks it). COG range reads stay in R1's `curlclient.mjs` (move it to `lib/cog.mjs`) |
| `tools/lib/png.mjs` | 8-bit RGB/grey PNG writer with adaptive filters; reader | 6,272 | node | — | **copy** |
| `tools/lib/raster.mjs` | `axisWeights`, `DemMosaic` (USGS 3DEP 1″ tiles), `readAsciiGrid` (GMRT, rain), `resampleGrid`, `fillThroughMask` | 9,907 | node, geotiff (lazy) | — | **adapt**: copy `axisWeights`, `readAsciiGrid`, `resampleGrid`, `fillThroughMask` as is; `DemMosaic` is 3DEP-specific (replace with a GLO-30 COG window reader) |
| `tools/lib/simplify.mjs` | topology-preserving Douglas–Peucker over shared arcs | 13,840 | geo.mjs (`KX`, `KZ`) | — | **adapt**: distances in a projection passed in (the Hawaiian `KX` is cos 20.5°, 46 % off at 50° N); the vertex key `(X + 200·10⁶)·10⁹ + Y` exceeds 2⁵³ (4.3·10¹⁷ at 231° E; 4.25·10¹⁶ already in Hawaiʻi), so keys lose 3–6 bits and can merge vertices metres apart; use a string or two-level key; add polyline simplification for the stroke collection |
| `tools/lib/geo.mjs` | Hawaiian projection constants, island table, `packGrid`, `gridFromBounds`, `bboxOf` | 3,689 | — | — | **adapt**: `packGrid` and `gridFromBounds` for box packs (regular lon/lat) with `KX` from the box's own `lat0`; aeqd forward/inverse for the table bake; drop the islands |
| `tools/lib/bake-run.mjs` | the Hawaiian `--bake` step (3DEP + GMRT + rain + boundaries) | 9,345 | boundaries†, fetch, geo, png, raster, sources† | — | **not needed** as a module (two imports missing); keep its land/sea loop (`bakePack`: half-land rule, land mean ≥ 0.25 m, sea ≤ −1 m, stats) as the pattern for `bake-box.mjs` |
| `tools/check-data.mjs` | the gazetteer, routes, districts, Māhele and layers audit | 71,517 | png | the data files | **adapt**: keep the helpers (`load`, `checkIds`, `checkCopy`, `checkNoNumbers`, `landTest`, `seaHits`, `bad`/`warn` reporting); rewrite vocabularies and rules for DATA.md §10; fix `kmBetween` across 180°; give `landTest` a grid index (Natural Earth's Australia ring alone is tens of thousands of vertices and every Coral Sea sample falls in its bounding box); allow times (`10:22`), hull numbers (`CV-6`), unit designators (`VB-6`, `TF 16`, `Taffy 3`, `CarDiv 1`) and calibres in `checkNoNumbers`; split into modules (§6) |
| `tools/smoke.mjs` | headless SwiftShader drive of the whole Hawaiian UI, then heap and frame time | 113,741 | playwright, node | `window.__app` (dozens of handles) | **adapt**: keep the harness (lines 1–90: server, browser, `check`, `ui`, `run`, `expect`, `frames`) and the perf block (CDP heap, wall-time frames); rewrite the checks |
| `tools/shoot.mjs` | screenshots from a list of shots without reloading | 12,497 | playwright, node | `app.tour`, `app.rig`, `app.timeline`, `app.world`, `app.districts`, `app.land` | **adapt**: keep the server, launch and shot loop; shot fields `date`, `cam`, `battle`, `t`, `moment`; wait on `app.ready` not `islandsLoaded`; drop the Hawaiian presets |
| `tools/fake-data.mjs` | a synthetic dataset in the Hawaiian contract's shape | 28,387 | png (reader), node | — | **adapt**: keep the noise and shield-dome island generator (use `lib/png.mjs` to write); new content for DATA.md (§6.4 lists the fixtures) |

### 2.0c Unstaged modules worth taking

| file | verdict | why |
| --- | --- | --- |
| `features/kit.js` `Builder` (lines 35–275) | **copy into `battle/kits/blocks.js`** | boxes, tapered cylinders, hexagonal prisms, quads, ribbons, blobs, all flat-shaded with per-vertex colour and a material code, transformed by `at(x, y, z, rot, scale)`; `indexed()` dedupes. It is the ship and aircraft kit generator's toolbox already. Set the default scale to 1 (it defaults to `FEATURE_S` 0.024) and add a lofted hull (`loft(sections)`); drop `objectMaterial` (district-bound) |
| `overlay/polity.js` `fill()` | **copy the scanline fill** for the front | rasterises polygons in world coordinates into an index grid; the land-held polygons per keyframe can be rasterised over the table rect the same way and cross-faded in the relief shader (as `applyPolity` does), with the perimeters and declared lines as `LineSet`s and the islands' dated holders as instanced marks |
| `features/labels.js` | **copy the pattern** for table labels | DOM text that follows the ground's projection, thinned with distance, the same loop as the pins; crisp at every zoom, and the Japanese subset renders through CSS with no glyph atlas |
| `features/sprites.js`, `shaders/sprite.glsl.js` | **not needed** | 8×16 pixel people with two facings, snapped to the pixel grid, feet on the exaggerated ground. An aircraft needs heading, bank and pitch to read. The useful idea is the minimum on-screen size: scale each aircraft instance in its vertex shader so its span never drops below two or three pixels, keeping the silhouette rather than swapping to a sprite |
| `render/patches.js` | **not needed** | patches are Hawaiian harbour history; `world.js`'s only use is `patchUniforms` |

### 2.1 Projection and units, function by function

**Where a linear lon/lat projection or an axis-aligned lon/lat rect is
assumed:**

| where | assumption | what it needs instead |
| --- | --- | --- |
| `geo.js` `Projection` | `x = (lon − lon0)·kx`, `z = −(lat − lat0)·kz`, `kx`, `kz` divided by the 100 m `UNIT` | `TangentProjection` (this, with `unit` from the constructor and `wrapLon`) for boxes; `TableProjection` (aeqd) for the table |
| `geo.js` `Projection.rect(bounds)` | a pack's lon/lat bounds are a world rectangle | boxes: unchanged. Table: no `rect`; the pack's world rectangle is `manifest.table.extent` |
| `load.js` `describePack` | `rect = proj.rect(d.bounds)`; `mx = (x1 − x0)·UNIT / W` | `rect = d.extent ? {x0, z0, x1, z1} from extent : proj.rect(d.bounds)`; `mx = (x1 − x0)·proj.unit / W` (patch in §2.2) |
| `decode.js` | none: it works on a grid with texel sizes `mx`, `mz` in metres | nothing, given the right `mx`, `mz` |
| `pack.js` | the pack is an axis-aligned world rectangle sampled bilinearly | true for both packs (the table grid is regular in projected space by contract); nothing |
| `world.js` | archipelago and island rects all axis-aligned in one world | moot (replaced by one pack per scene) |
| `lines.js` `buildSegments` | `proj.toWorld` per vertex, straight segments split to 150 m | split in world units (`MAX_SEG` by unit); for long lon/lat edges (front polygons, declared lines) densify in lon/lat first (every ≤ 50 km) so a line drawn straight on a Mercator source map is not a chord on the aeqd table |
| `routes.js` `RouteLine` | the same | the same densification; a noon-position leg of 500 km is fine as a chord |
| `pins.js` | `proj.toWorld(geometryPoint(...))` | `geometryPoint` of a polygon that straddles 180° is wrong unless longitudes are normalised first; normalise once at load |
| `camera.js` | none: it works in world xz | units (below) |
| `check-data.mjs` `kmBetween`, `seaHits` | equirectangular distance on raw lon | wrap Δλ (179° to −179° is 2°, not 358°) |
| `simplify.mjs` | metres from Hawaiian `KX`, `KZ` | project first (aeqd km) and simplify there |

**Every constant that encodes the 100 m unit** (the value is in Hawaiian
world units; "table" and "box" give what it must become):

| file | constant | Hawaiian value (meaning) | table (km) | box (m) |
| --- | --- | --- | --- | --- |
| `config.js` | `UNIT`, `METRE` | 100 m per unit | 1000 | 1 |
| `config.js` | `MIN_DISTANCE`, `MAX_DISTANCE` | 8, 9000 (0.8–900 km) | about 60 and 20,000 | 15 and 600,000 (the hand-over height) |
| `config.js` | `exaggeration(d)`: `NEAR_EXAG` 1.3, `FAR_EXAG` 5.5 between `EXAG_NEAR_D` 100 and `EXAG_FAR_D` 6000 | 1.3 at 10 km to 5.5 at 600 km | near 1.0–1.3 at the hand-over distance (150–600 km) to far ≈ 25–35 at 15,000 km (tune by eye: the trench and Fuji both read) | constant per box (1.0 recommended, §3.1) |
| `config.js` | `NORMAL_EXAG` 2 | normals baked at 2× | per pack: ≈ 16–20 on the table | 2 |
| `decode.js` | AO at `NEAR_EXAG`; `synthShelf` in km; sand within 260 m | metres | AO meaningless at 6.9 km texels (harmless); skip `landTexture` | as is |
| `world.js` | `uVert = exag / 100`; island margin `min(15, …)` | — | `exag / 1000` | `exag / 1` |
| `pack.js` | `SEA_CULL = −0.5` m; node box −0.3/+0.1 world units; ±40 m | — | `SEA_CULL = −Infinity` | as is (the deep sea floor never shows through the box's water) |
| `terrain.glsl.js` | noise at `xz·0.35` (≈ 285 m cells), `·2.1`, `·18`; crowns `xz·6`; pixel thresholds 0.02–0.07 and 0.1–0.3 units/px | — | (relief shader) | multiply `xz` and `px` by `unit / 100` before use |
| `terrain.glsl.js` | seabed sunk 25 m below 0 | metres | off | keep |
| `ocean.glsl.js` | swell `k = 2.2`/unit (≈ 285 m), `ω = sqrt(9.8·k·100)·0.01`; chop `f = 1.6`…; caustics below 0.012 units/px at `xz·70`; caps 0.3–1.2 units/px | — | not used | `xz·unit/100` and `px·unit/100` throughout; depths stay metres |
| `ocean.js` | disc radius 250,000 units (25,000 km) | — | not used | ≥ the far plane: 1,000,000 m |
| `camera.js` | `preferredPitch` from `log 40` to `log 4500` (4–450 km) | — | 40–4,500 km happens to suit the table | 100 m–40 km |
| `camera.js` | target margin 150 (15 km); clearance `0.12 + 0.03·d`; floor gap ≤ 0.04; `groundAhead` ≤ 20 | — | margin 500 km; clearance by unit | margin 5 km; clearance 3 m + 3 % |
| `camera.js` | `near = clamp(min(alt, d)·0.12, 0.02, 300)`, `far = clamp(30·d + 60·alt, 8000, 3e5)` | 2 m–30 km and 800–30,000 km | near ≥ 0.1, far ≤ 50,000 | near ≥ 0.5, far = 450,000 (log depth, §3) |
| `camera.js` | `marchRay` limit 4e5, min step 0.02; flight hop pitch `/300` | — | as is | limit 1e6 m, min step 0.5 m, hop `/30000` |
| `lines.js` | `MAX_SEG` 1.5 (150 m); lift `0.015 + 0.0022·d`; bounding sphere y 60, pad 300/+10; fades `s(800, 4000)`, `s(1500, 6000)`, `s(220, 650)` | — | `MAX_SEG` 25; lift 0.015 km → by unit; fades by the table's own distances | by unit |
| `routes.js` | `MAX_SEG` 4 (400 m); `ZOOM_IN` [300, 1000]; lift `0.02 + 0.0024·d`; widen `s(800, 4000)` | — | `MAX_SEG` 10–25; drop `ZOOM_IN` (routes show at every table distance; they fade with the fly-down) | `MAX_SEG` 200 m for recorded tracks |
| `app.js` | camera far 9000; fog `0.09/max(30, d)`, `2.0/max(30, d)`; polity and land zooms | — | fog constants by unit | fog from `weather.visibilityM`: density ≈ 3.912 / visibility (Koschmieder), falloff from the cloud base |
| `pins.js` | halo radii `exact 0, ahupuaa 22, moku 90, island 260, sea 160`; size `1.18 − 0.13·log(d/120)`; `near` below 260; lift 0.02 | 2.2–26 km | `exact 0`, `sea 20` km, `area` from the polygon's equivalent radius; size curve on km | — |
| `tour.js` | `ZOOM = { far 2600, island 520, near 70 }`; lean 900; district prefetch below 130 | — | `{ table: fit the chapter's events, area: ~1,500 km, point: ~600 km }` | stops carry their own `distance` in metres |
| `ui.js` | island name below 1400 | — | the place nearest the target | — |
| `check-data.mjs` | `BOX` lon/lat, `CAMERA_DISTANCE` [8, 9000], `NEAR_CAMERA_MAX` 150, sample every 0.25 km | — | the theatre box; distances in km; sample every 2 km for 5,000 km routes | box stop distances in metres |
| `sky.js` | dome radius 1, stars at 100, `sky.group` follows the camera | unitless (camera-relative) | as is | as is |

### 2.2 `PackDecoder` and the manifest

`PackDecoder` (worker pool with a main-thread fallback) needs nothing but a
described pack `{ heightUrl, W, H, scale, offset, mx, mz }`; it does not
care which projection made the rectangle. Reuse it as is for the table and
for every box. The table pack needs `extent`, which `describePack` must
honour, and two decode options:

```js
// data/load.js
export function describePack(d, proj, abs, { normalExag = 2, land = true } = {}) {
  const rect = d.extent
    ? { x0: d.extent[0], z0: d.extent[1], x1: d.extent[2], z1: d.extent[3] }  // the table: projected texel edges, km
    : proj.rect(d.bounds)                                                       // a box: lon/lat edges through the tangent plane
  const [W, H] = d.size
  return {
    id: d.id, kind: d.kind ?? (d.extent ? 'table' : 'box'), name: d.name || d.id, desc: d, rect, W, H,
    mx: ((rect.x1 - rect.x0) * proj.unit) / W,   // metres per texel, from the rectangle the renderer will draw
    mz: ((rect.z1 - rect.z0) * proj.unit) / H,
    heightUrl: abs(d.height.file), rainUrl: null,
    scale: d.height.scale, offset: d.height.offset,   // no defaults: DATA.md makes both mandatory
    normalExag, land, sources: d.sources || [], data: null,
  }
}
```

`worker.js` and `PackDecoder.pump()` pass `normalExag` and `land` through to
`derivePack`, which skips `landTexture` when `land` is false and calls
`packNormals(…, normalExag)`. A box keeps `normalExag: 2, land: true` (the
box terrain shader reads sand and drainage). Memory on the table: heights
and normals are 15 MB each on the CPU; the land map and the distance
transform's Float64 scratch (about 30 MB) are saved by `land: false`.

### 2.3 `render/world.js` and the terrain shaders

**Coupling.** `world.js` owns the archipelago pack, five island slots with
detail weights, the district's uniforms (11 of them), the patches' uniforms
(`patchUniforms` from an unstaged module), the exaggeration of the moment
and the CPU copy of `groundMetres`. The terrain fragment shader discards
every fragment not owned by its slot or covered by a district. The ocean,
lines, routes and shadow shaders all include `world` and `ground` and call
`groundMetres(xz)`, `distPond(xz)` and `patchReef(xz)`.

**What a single pack needs** is a ground chunk with the same names:

```js
// render/shaders/ground.glsl.js: one pack per scene, the Hawaiian names kept so ocean, lines, routes and shadow compile unchanged
export const world = /* glsl */ `
uniform float uVert;        // world Y per metre: exaggeration / unit
uniform float uExag;
uniform float uNormalE;     // the exaggeration the pack's normals were baked at
uniform sampler2D uArchH;   // the scene's pack, metres (R32F, nearest)
uniform vec4 uArchRect;     // its world rect
uniform float uOutside;     // metres beyond the pack's edge (−4000: open ocean)
vec2 rectUv(vec4 r, vec2 xz) { return (xz - r.xy) / (r.zw - r.xy); }
float edgeDist(vec4 r, vec2 xz) { vec2 a = min(xz - r.xy, r.zw - xz); return min(a.x, a.y); }
float rectMetres(sampler2D t, vec4 r, vec2 xz) { /* the Hawaiian manual bilinear, unchanged */ }
float archMetres(vec2 xz) { return edgeDist(uArchRect, xz) < 0.0 ? uOutside : rectMetres(uArchH, uArchRect, xz); }
int ownerAt(vec2 xz) { return -1; }
float slotWeight(int s, vec2 xz) { return 0.0; }
float distWeight(vec2 xz) { return 0.0; }
bool distDraws(vec2 xz) { return false; }
`
export const ground = /* glsl */ `
float gPatchReef = 0.0;
float patchedMetres(int s, vec2 xz, float h) { return h; }
float groundMetres(vec2 xz) { return archMetres(xz); }
float distPond(vec2 xz) { return 0.0; }
float patchReef(vec2 xz) { return 0.0; }
`
```

(`uOutside` is −4000 m in the Hawaiian code: the open ocean beyond the pack.
On the table it is never reached; in a box it is what lies past the box's
edge, see the decision in §7 on boxes whose coasts run off their edge.)

**The table's relief** is a new fragment shader on the same CDLOD mesh:
hypsometric tint above 0 m, bathymetric tint below, hillshade from the
gradient rebuilt at `uExag` from normals baked at `uNormalE`, the front's
rasterised held-land mask cross-faded (`polity.js`'s pattern), and the ink
as `LineSet`s on top. Three changes to the Hawaiian path it must make:

1. `PackTerrain` with `opts.seaCull = -Infinity`: `select()` skips nodes
   whose highest point is below −0.5 m (`SEA_CULL`), which on the table is
   every node of open ocean.
2. No seabed sink (`if (mt < 0.0) mt -= 25.0 * …`): on the table the sea
   floor is the subject.
3. Normals baked at `normalExag ≈ 16–20` for the table pack. With
   `NORMAL_E = 2`, 8-bit normals resolve slopes down to about 0.4 %
   (27 m over a 6.9 km texel); rebuilt at an exaggeration of 30 the
   hillshade then steps by about 12 % slope at a time, which terraces the
   abyssal plains and continental slopes. Baked near the display
   exaggeration the step falls to about 1 %. Steep slopes lose nothing,
   because the rebuild already clamps `n.y`.

**A box's terrain** can keep the Hawaiian shader: copy `terrain.glsl.js`,
include the single-pack chunk, delete the slot, district and land/polity
branches (all in `main()`: lines 265 and 268, 303–307, 313, 318–319), and feed
`groundAlbedo` a per-box constant rain (`uRain`) instead of the land map's
red channel. Its vegetation-by-rain is tuned for high Pacific islands and
reads plausibly for Guadalcanal and Samar (wet: forest to the ridges, open
lowland where the "farmed and burned" band sits, which matches the coastal
plantations and kunai grass) and for Oʻahu (the Hawaiian pack's own rain
image could even be carried along); Midway is sand and scrub at 0–12 m and
is mostly the `beach` and `seabed` branches. **The vegetation and rain
bands can be switched off cleanly**: `groundAlbedo` is one function; a
`#define BOX_RAMP` that returns a sand/green/rock ramp by height and slope
instead is about fifteen lines. Every `xz` and `px` inside it must be
scaled by `unit / 100` first, or the noise is 100 times too fine in metres.

### 2.4 The camera rig

**What it assumes about its ground**: an object with `bounds`
(`{x0, z0, x1, z1}`), `maxY` (world Y of the highest ground now),
`heightAt(x, z)` (world Y of ground or sea, never below 0), `metresAt(x, z)`
and `uniforms.uVert.value`. Write that down as an interface (§4.7) and both
`TableGround` and `BoxGround` implement it.

**Limits and pitch**: `minDistance`/`maxDistance` come from `config.js`
(module constants: two rigs in two units cannot share them);
`preferredPitch` tilts from 0.6 rad (oblique) at 40 units to 1.12 rad
(steep) at 4,500 units; pitch is clamped to 0.06–1.52 rad. The target is
clamped to `bounds ± 150` units. Near and far are set in `apply()` every
frame from altitude and distance, which overrides any near/far a scene sets.
All of these become constructor options.

**Input**: `bind()` adds pointer listeners on the canvas and a `keydown`
listener on `window` (WASD and the arrows pan, Q/E turn, +/− zoom) and never
removes them. Two rigs on one canvas both respond unless one is disabled;
a rig built per box visit leaks. Add `dispose()` (an `AbortController`
passed to every `addEventListener`) and a `keys: false` option.

**What it already has that the fly-down wants**: `flyTo(to, duration, {
ready })` slows the last fifth of a flight until `ready()` holds, for up to
six seconds. That is exactly "fly down while the box streams in". And
`fit()` frames a world rectangle beside the card.

**Two rigs handing over** need a common pose and the box's placement:

- pose = `{ target: {x, y, z}, distance, yaw, pitch }` in each scene's own
  units; `rig.pose()` and `rig.jump(pose)` (jump exists).
- table → box: `target_box = Jinv·(target_table − centre)`;
  `distance_box = distance_table / s` with `s = sqrt(|det J|)` (km per m);
  `yaw_box = yaw_table + α` where `α = atan2(J[1][0], J[0][0])`; pitch
  unchanged. Box → table is the inverse. Derivation, so nobody guesses a
  sign: the rig puts the camera at `target + d·(cos p·sin ψ, sin p, cos p·cos ψ)`,
  so the camera's offset makes the angle `π/2 − ψ` from +x toward +z; the
  box's +x axis maps to a table direction at angle `α` from the table's +x
  toward +z; so `ψ_table = ψ_box − α`. At Midway `α ≈ −13°` (true north
  leans west, counter-clockwise on a north-up table), which equals the
  manifest's `convergenceDeg` if that is defined as the clockwise angle
  from grid north to true north.
- y: each scene computes its own target height from its own ground; the
  exaggerations must agree at the hand-over (the table's curve must have
  come down to the box's value by the hand-over distance, or the descent
  eases `uExag` itself), or Guadalcanal's ridges jump from five times to
  once their height at the cut.

### 2.5 `ui/pins.js` and clustering

The clustering is generic and cheap: every visible pair compared every
frame in typed arrays, union-find, a marker pool. With about 80–110 events
in v1 and a 7–21 day window, a few dozen pins at most are visible. Changes:
the window in ms from `WarClock.windowAt`; halo radii by DATA.md's
`placePrecision` (`exact`, `area`, `sea`) in km, with `area` taken from the
place's polygon (equivalent radius) rather than a constant; the size curve
(`1.18 − 0.13·log(d/120)`) and `near` threshold re-tuned on km; `heightAt`
from the table ground; a distinct marker (and the card's *Enter the battle*)
for `zoom` containing `box`; and the current tour step's pin drawn alone as
now. Pins are not used inside a box (units are 3D and picked through
`sim.pick`).

### 2.6 `time.js`: what it does now, and the exact change

**What the staged `parseDate` does** (regex
`(-?\d{1,4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?`, unanchored, result in fractional
years; the third group is matched and never used):

| input | result | should be |
| --- | --- | --- |
| `"1942-06-04"` | 1942.4167 (1 June); as an end, 1942.5 (1 July) | 4 June 1942, a day long |
| `"1942-06-04T04:30-12:00"` | 1942.4167: day, time and offset ignored | 1942-06-04 16:30 UTC |
| `"1942-11-15T00:07+11:00"` | 1942.8333 (1 November) | 1942-11-14 13:07 UTC |
| `"10:22"` (a battle time) | **10** (the year 10) | not a date: `BattleClock.parse` |
| `"-12:00"` | year −12 | not a date |

**What "half an era either side" does to this war.** `Timeline` filters
eras by `Number.isFinite(e.year)`; `chapters.json` has `from` and `to` and
no `year`, so the timeline has no keyframes at all and hides itself. Given
years, the slider gives every chapter the same width (R3's chapters run
from 38 days to ten years), and the window is half the gap to the
neighbouring keyframes: about ±4 months in "the turn" (Coral Sea in May
through Santa Cruz in October all at once, with their routes) and ±5 years
in the prologue.

**ENGINEERING §4's window** — `min(21 days, half the gap to the nearest
chapter edge)` — is zero at a chapter's `from` and `to`, so the tour's
first step of every chapter (which sets the date to the chapter's start)
would show no pins. Use the chapter's length, not the distance to its edge.

**The exact change** (replaces `parseDate`, `eventSpan`, `eventStart`,
`eventYear`, `formatWhen`, `Timeline`):

```js
// src/time.js — instants in ms UTC; zones in ISO sign (+09:00 is Tokyo; the US Navy's "zone +12" is -12:00)
export const DAY = 86400000
const ISO = /^(\d{4})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2}))?(Z|[+-]\d{2}:\d{2}))?)?)?$/

/** "+09:00" → 540, "-10:30" → -630 (minutes east of UTC). */
export function zoneMinutes(z) {
  if (z === 'Z' || z === '+00:00' || z === '-00:00') return 0
  const m = /^([+-])(\d{2}):(\d{2})$/.exec(z)
  if (!m) throw new Error(`zone ${z}: write it as an ISO offset, e.g. -12:00 for the navy's zone +12`)
  return (m[1] === '-' ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3]))
}

/**
 * An ISO date or instant → ms UTC. "YYYY", "YYYY-MM", "YYYY-MM-DD" mean the start of that period in `zone`
 * (UTC if none). A time must carry its offset: Date.parse would read "1942-06-04T04:30" in the viewer's own zone.
 */
export function parseInstant(s, { zone = null } = {}) {
  const m = ISO.exec(String(s))
  if (!m) throw new Error(`not an ISO date, or a time without an offset: ${s}`)
  const [, Y, Mo = '01', D = '01', h, mi, se = '00', z] = m
  const off = h !== undefined ? zoneMinutes(z) : zone ? zoneMinutes(zone) : 0
  return Date.UTC(+Y, +Mo - 1, +D, h !== undefined ? +h : 0, h !== undefined ? +mi : 0, +se) - off * 60000
}

const PREC = { minute: 60000, hour: 3600000, day: DAY }
/** [from, to) of a `when`, widened by its precision when `to` is absent (month: to the next month's start). */
export function spanOf(w) {
  const a = parseInstant(w.from, { zone: w.zone })
  const end = (s) => {
    const t = parseInstant(s, { zone: w.zone })
    if (w.precision === 'month') { const d = new Date(t + zoneMinutes(w.zone ?? 'Z') * 60000); return Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1) - zoneMinutes(w.zone ?? 'Z') * 60000 }
    return t + (/T/.test(s) ? PREC[w.precision] ?? 60000 : DAY)
  }
  return [a, end(w.to ?? w.from)]
}

/** ms UTC shown in a zone: "4 June 1942, 10:22" plus the zone's name from the data. */
export function formatWhen(w, { zone = w.zone ?? 'Z', time = /T/.test(w.from) } = {}) { /* getUTC* of (ms + zoneMinutes(zone)·60000) */ }

export class WarClock {
  /** chapters: chapters.json; s ∈ [0, 1] is the slider: the prologue takes `prologueShare`, the war's days the rest, linearly. */
  constructor(chapters, { prologueShare = 0.1 } = {}) { /* knots [(0, prologue.from), (share, war.from), (1, war.to)] */ }
  dateAt(s) {}  sAt(ms) {}  setS(s) {}  setDate(ms) {}  get date() {}  onChange(fn) {}
  chapterAt(ms) {}
  /** pins' and routes' window: ±clamp(chapter length / 8, 7 d, 21 d); in the prologue, the whole prologue. */
  windowAt(ms) { const c = this.chapterAt(ms); if (c.id === 'prologue') return [c.fromMs, c.toMs]; const h = Math.min(21 * DAY, Math.max(7 * DAY, (c.toMs - c.fromMs) / 8)); return [ms - h, ms + h] }
  /** the front keyframes either side of ms (fronts/manifest.json dates) and how far between: for the cross-fade. */
  frontPair(ms) {}
}
```

With R3's chapters the window is ±21 days in five of them, about ±19.5 days in
"the return" and "the approaches" (157 days each) and ±7 days in "the end"
(39 days). The routes use the same `windowAt` (they carry their own
`routeSpan` copy of the year parser today; delete it). Sort and step the
tour by UTC instant, as R3 §7.1 asks (Kota Bharu sorts before Pearl Harbor),
and show each card in its own zone.

### 2.7 `ui/tour.js`, `ui/card.js`, `ui/timeline.js`

**Tour.** The mechanism carries over whole: chapters, Next/Back, stops,
"the camera is the viewer's between steps", leaving and resuming by the
slider. Change:

- `build()`: chapters from `chapters.json` (`from`/`to`), each event placed
  by its `chapter` field or, failing that, by `chapterAt(spanOf(when)[0])`;
  sort by UTC instant.
- Zooms: DATA.md's `zoom` is `table | box`; `ZOOM` becomes table distances
  (the chapter's events fitted with `rig.fit`, an `area` place at about
  1,500 km, a point at about 600 km). `gathering()` and `islandView()` (the
  island packs) go; `chainView()` becomes "fit the table's extent, or the
  chapter's events' bounds".
- A stop with `zoom: "box"`: the tour calls `app.battle.enter(ev.box, { t })`
  on the first such stop (fly-down, §4.8), then `battle.scrub(t)` and
  `battle.scene.setCamera('orbit', stop.camera)` for the rest; Back out of
  the first box stop calls `battle.leave()`.
- `prefetch(ev)`: instead of districts, start decoding the event's box pack
  and fetching its `battle.json` and kits as soon as the event's card opens,
  so the fly-down rarely waits.
- `stepYear` becomes `stepDate` with `windowAt`; `setYear`/`setS` become
  `clock.setDate` with the bar's easing.
- Drop `viewFor`, `LAND_KINDS`, `applyView` (no far-view modes).

**Card.** `EventCard` is decoupled already (it reads `app.data` and
`ui.tour`). Change: `KIND` and icons to DATA.md's kinds; a second title
line for `ja.kanji` and `ja.romaji` (`lang="ja"` on the kanji so the Noto
subset applies); `formatWhen` in the event's zone, with the other clocks'
readings from `zoneNote` and `sourceClock` beside it; the chapter card's
"c. 1600" becomes the chapter's span ("June 1942 – February 1943"); the
sources line gains `licence` and `lending`. Add *Enter the battle* (events
with a box) and, inside a box, *Take the controls* on a stop that is a
moment. Briefing and after-card are new modes (or `ui/briefing.js`,
`ui/after.js` as §11 says) rendered from `battle.json` and `sim.outcome`.

**Timeline.** Keep the DOM, the tour pill, Back/Next and the easing. The
input runs over `WarClock.s` (`min 0, max 1, step 0.0001`); ticks sit at
each chapter's `from` by `clock.sAt(from)` (not evenly); the label is the
chapter's short name and the date ("4 June 1942"); labels thin by room as
now. Hide the bar inside a box (the box has its own clock in the HUD).

### 2.8 `render/routes.js`

- **MAX_SEG and the 5,000 km tracks.** Four world units is 4 km on the
  table: a 5,000 km fleet track becomes 1,250 instanced segments, each of
  whose four vertices samples the ground twice. A hundred such routes is
  125,000 instances, which is affordable but pointless over open sea; 10–25
  km (two to four table texels) follows the relief where a route crosses
  land and keeps the count near 25,000. One draw call per visible route, as
  now.
- **Straight chords.** Segments are straight in projected space between
  `proj.toWorld` of the points; for noon positions (≤ 500 km apart) that is
  fine; densify longer legs in lon/lat (§2.1).
- **The fade by zoom** (`ZOOM_IN` 300–1,000 units, `FILL_OUT` by island
  fill) hides routes when the camera is closer than 300 km — on the table
  that is the theatre zoom where routes matter most. Replace with: full at
  every table distance, scaled by the overlays' fly-down fade, and the
  current step's routes always on (`focus`, kept).
- **Time**: `routeSpan` parses to fractional years at month resolution;
  use `spanOf` and `windowAt` in ms. `inYear` (a route whose own dates hold
  the date stands out) carries over in ms.
- **Vocabulary**: `COLOURS` by DATA.md §5 kinds; `STYLE` by
  `pointPrecision` (`report` solid, `chart` solid, `narrative` finer,
  `schematic` dashed); arrowheads, dashes and pulse as they are (all sized
  in pixels or as fractions of camera distance, so unit-free).
- **In a box**: the same `RouteLine`, fed a unit's `track` in box metres,
  draws its recorded course styled by each fix's precision, which answers
  the open decision "a schematic track drawn finer" in the table's visual
  language.

### 2.9 `render/lines.js`

`LineSet` is the coast ink, the front outlines, the island groups' dashed
perimeters (dashes need the routes' `aInfo` distance attribute; borrow it),
the declared lines, the date line and the equator. Screen-space width is
unit-free. Change: `MAX_SEG` and the lift (`0.015 + 0.0022·d`) and the
hand-made bounding spheres (y 60, pad 300) by unit; the batch key
(`properties.island`) becomes an option (one batch for the whole coast is
fine: frustum culling buys little on a table seen whole). Natural Earth's
10 m coastline clipped to the envelope and simplified to about 1.5 km is
tens of thousands of segments; with `MAX_SEG` 25 km almost none are split.
Drop `Boundaries`.

### 2.10 `render/ocean.js`: the chart sea and the box sea

The Hawaiian ocean is near-field: swell and chop faded by pixel size,
caustics, swash, caps, sky reflection and glint, every frequency in 100 m
units, on a disc that follows the camera.

- **On the table** a "chart sea" is not a second surface. The relief shader
  draws the sea floor tinted by depth through a stylised water colour (pale
  over shelves, dark over trenches, a faint highlight toward the light), as
  a printed bathymetric chart does. That is cheaper than the ocean pass and
  needs no transparency. ENGINEERING §10 says both ("a plane under the
  relief" and "not a second surface"); the second is right.
- **In a box** the same ocean shader serves, with three edits: Hawaiian
  units inside the shader (`vec2 p = xz * UNIT_M / 100.0` and the pixel
  width likewise; depth stays metres), the disc's radius beyond the far
  plane, wind and swell from `battle.json`'s `weather` (`uWind` scaled so
  caps appear from about Beaufort 4), and point-light glints for star
  shells and searchlights (§4.7). Its depth colour comes from
  `groundMetres`, so it needs the single-pack chunk. `polygonOffset` is a
  no-op under log depth; the seabed sink (25 m) already keeps terrain and
  sea apart.

### 2.11 `sky.js`, `stars.js`, `shadow.js`, `pipeline.js`

- **`sky.js`**: the Preetham dome, the radiance map, the light colours and
  the night sky copy as they are; the dome is camera-relative and
  unit-free. Change the astronomy:
  - `LATITUDE` is a module constant (21° N) used by `toWorld` for the sun
    and moon; v1 needs 30° N (Midway), 9.3° S (Ironbottom Sound), 11.5° N
    (Samar), 21.3° N (Oʻahu). Make it per instance.
  - `astronomy(doy, hour)` takes a day of year and a **local solar** hour,
    with no year. The battle clocks are zone times: Item (UTC+9) at Samar
    runs about 38 minutes ahead of local mean solar time, zone −11 (UTC+11)
    at Guadalcanal about 20 minutes, before the equation of time (about a
    quarter of an hour in late October and November). Take `(utcMs, lat,
    lon)` and compute the hour angle from longitude.
  - The moon's age is anchored on 12 August 2026 (`NEW_MOON_DOY = 224.1`),
    so it repeats every year. Against a mean-lunation reference
    (`r9-scripts/checks.mjs`; ±0.6 d) it is right to a tenth of a day at
    Midway (20.5 d) and Guadalcanal (5.9 d), but 10.6 days wrong at Pearl
    Harbor (18.5 d against 29.1 d) and 8.3 days wrong at Samar (7.5 d
    against 15.8 d). A crescent moon near setting matters at Guadalcanal.
    Use a low-precision ephemeris (the sun from the NOAA/Meeus formulas, the
    moon from Meeus ch. 47 truncated to its main terms, a few hundred lines
    at most) and check the four dates against an almanac.
  - The table needs no sky at a date: give it a fixed war-room light (the
    Hawaiian app's `doy 277, hour 15.6` works) so the map never goes dark.
- **`stars.js`**: copy (J2000; precession to 1942 is under a degree).
- **`shadow.js`**: copy for boxes over the single-pack chunk (`packMetres`
  is then `archMetres`); leave it off on the table, whose relief is
  hillshaded and whose exaggeration changes with zoom (each change redraws
  the map a strip per frame).
- **`pipeline.js`**: the HDR MSAA target, the composite, ACES and the night
  tint copy as they are. Two changes: the fog's distance reconstruction
  under log depth (§3.3) and a `uFade` toward the haze colour for the
  hand-over (§4.8). The clouds slot (`atmosphere`) is empty in the staged
  copy; the box's cloud layer of instanced puffs (ENGINEERING §7) is new.

### 2.12 `data/*.js` and the worker

`image.js` copies as is; `decode.js` and `worker.js` take the two
parameters of §2.2; `load.js` keeps `getJSON` (with its "carry on without
it" fallback for optional files) and `PackDecoder`, and its `loadData`
gains: one longitude normalisation pass over places, events' coordinates,
routes, fronts, labels and coast (with the table's `lon0`), and the new
file list (`chapters.json`, `routes.json`, `fronts/manifest.json`,
`table/coast.json`, `table/labels.json`, `boxes/manifest.json`). Boxes load
on demand through a `loadBox(id)` that fetches `battle.json` and
`kits/*.json` (cached after the first box) and decodes the pack in the same
decoder.

### 2.13 `tools/lib`

| module | reusable as is? | note |
| --- | --- | --- |
| `fetch.mjs` | yes, plus `-g` | the ledger is what the manifests' `fetched` dates come from |
| `png.mjs` | yes | writes exactly the Hawaiian pack format; R1 measured it on real data |
| `raster.mjs` | four of five functions | `DemMosaic` is 3DEP-only |
| `simplify.mjs` | no | Hawaiian metric; key precision; polygons only (§2.0b) |
| `geo.mjs` | `packGrid`, `gridFromBounds`, `bboxOf` | parameterise `KX` by the box's `lat0`; add aeqd |
| `bake-run.mjs` | no | two missing imports; keep the land/sea loop as the pattern |
| new: `etopo.mjs`, `cog.mjs`, `ne.mjs` | — | R1 proved each: the DAP2 reader (`r1-scripts/dods.mjs`), the curl client for geotiff (`curlclient.mjs`), the shapefile reader with the 180° merge |

### 2.14 `tools/check-data.mjs`, `smoke.mjs`, `shoot.mjs`, `fake-data.mjs`

- **`check-data.mjs`**: the structure (load everything, check ids, walk
  every rule, print counts or problems, exit 1) and about 250 lines of
  helpers carry over; the Hawaiian vocabularies (moku keys, place kinds,
  heiau rules, Māhele, districts, loʻi slopes) do not. Two helpers need
  fixing for the Pacific: `kmBetween` across 180° and `landTest`'s speed
  (a coarse grid over the coast polygons, built once). `checkNoNumbers`
  needs an allow-list for battle-clock times, hull numbers, unit
  designators and calibres, or every card that names Task Force 16 fails.
  Split by owner (§6).
- **`smoke.mjs`**: keep the harness and the perf block; the new checks:
  boot on test data and on real data; the tour opens on the prologue's
  card; Next walks a chapter; pins cluster and open; the slider leaves the
  tour; *Enter the battle* flies down and the box is live; scrub; take a
  moment; scripted input for twenty sim seconds (with `player.scripted`);
  `sim.state` finite; leave; heap and frame time; no console errors.
- **`shoot.mjs`**: keep; add shot fields `date`, `battle`, `t`, `moment`,
  `camera` (a box camera mode); `until: 'app.ready'`.
- **`fake-data.mjs`**: §6.4 lists the fixtures; keep the shield-dome
  generator for islands and a trench.

### 2.15 `style.css`, fonts, `index.html`

`style.css` is tokens plus components; the tokens (`--gold`, `--kapa`,
`--sea`) change to a chart palette, the components (boot, glass panels,
card, timeline, pins, help) carry over. Add a `@font-face` for the Noto Sans
JP subset with a CJK `unicode-range` (`U+3000-30FF, U+4E00-9FFF,
U+FF00-FFEF`) and `:lang(ja)` rules. The HUD's styles live with the HUD
(`src/battle/scene/hud.css`, imported by `hud.js`; Vite bundles it), so the
engine never edits `style.css`. The eight Latin woff2 files (199 KB) copy as
is; they carry the macrons (Sōryū, Kidō Butai) through latin-ext.

---

## 3. Float precision, units and depth: ENGINEERING §2 confirmed and corrected

### 3.1 Units

**Confirmed**: kilometres on the table, metres in a box with the origin at
the box's centre, heights in metres everywhere. Three corrections:

- **The box's exaggeration is a constant, not a curve.** DATA.md §1 says
  "a box applies 1.0 to 1.3"; the Hawaiian exaggeration varies with camera
  distance. In a box the sim needs terrain for collisions, groundings and
  lines of sight; if the drawing's exaggeration differs from the sim's, an
  aircraft clears a ridge in the sim and flies through it on screen.
  Recommend 1.0 in every box (true heights; Guadalcanal's 2,300 m ridge
  reads fine from a cockpit) or one fixed value per box carried in
  `boxes/manifest.json` and given to both.
- **`ground.vert = exaggeration / unit`** is the only conversion from metres
  to world y; the literal `/ 100` in `world.js` must go.
- **The model frame** must be in the contract: ships' origin at the
  waterline amidships, aircraft at the centre of gravity, bow or nose
  toward −z at heading 0, metres (§4.5).

### 3.2 Float32 at these scales

Measured with `r9-scripts/checks.mjs`:

| where | largest coordinate | float32 step there |
| --- | --- | --- |
| the table's edge (14,170 km wide) | 7,085 km | 0.49 m |
| a 400 km box's edge | 200,000 m | 1.6 cm |
| a 300 km box's far corner (ENGINEERING's figure) | 300,000 m | 3.1 cm |
| the Hawaiian unit at the table's scale | 64,000 units | 0.4 m |

So storage is fine, as §2 says. Two things are not:

1. **The sim's integration.** A position stored in float32 and advanced
   by `v·dt` every 1/60 s rounds each step to the nearest 1.6 cm at 150 km
   from the origin. Over 60 s of sim time:

   | unit | true speed | float32 speed after 60 s |
   | --- | --- | --- |
   | ship at 2 kn | 1.03 m/s | 0.938 m/s (−9.0 %) |
   | ship at 20 kn | 10.3 m/s | 10.313 m/s (+0.1 %) |
   | aircraft at 70 m/s | 70 m/s | 70.313 m/s (+0.4 %) |
   | shell at 800 m/s | 800 m/s | 799.688 m/s (0.0 %) |

   Below about 0.9 kn a step is under half the float32 step and the ship
   does not move at all (a damaged ship losing way, a ship gathering way
   from a stop). The errors are systematic, not noise, so tracks drift
   from the record. **`sim.state.pos` and `sim.projectiles.pos` must be
   `Float64Array`.** Velocities, quaternions and the rest can stay float32.
2. **Instanced units near the eye.** three composes `modelViewMatrix` in
   doubles on the CPU, so a single `Mesh` is exact wherever it is. An
   `InstancedMesh` multiplies the view matrix (translation ≈ −150 km) by an
   instance matrix (translation ≈ +150 km) on the GPU in float32: the
   residual is about one float32 step, 1.6 cm, which for the player's own
   aircraft seen from 15 m behind (≈ 75 px per metre) is a pixel or more of
   shimmer. The renderers rewrite every instance matrix every frame anyway
   (units move), so write them **camera-relative**: subtract the camera
   position in JS doubles, and place the `InstancedMesh` itself at the
   camera position. Then nothing near the eye moves by more than a
   micrometre. No floating origin is needed for the box as a whole.

The table needs neither: nothing on it moves at sim rates, and 0.5 m at
the edge is far below a pixel.

### 3.3 The logarithmic depth buffer in three r160

**How r160 does it** (read in `node_modules/three/src`):

- `new WebGLRenderer({ logarithmicDepthBuffer: true })` is a renderer-wide
  capability (`WebGLCapabilities.js`). Every program, ShaderMaterial
  included, then gets `#define USE_LOGDEPTHBUF` and, on WebGL2,
  `#define USE_LOGDEPTHBUF_EXT` (`WebGLProgram.js` lines 634–635, 820–821).
- The renderer uploads `logDepthBufFC = 2 / log2(camera.far + 1)` to any
  program that declares it (`WebGLRenderer.js` ~1934).
- Built-in materials include the four chunks (`logdepthbuf_pars_vertex`,
  `logdepthbuf_vertex`, `logdepthbuf_pars_fragment`,
  `logdepthbuf_fragment`). On WebGL2 the fragment chunk writes
  `gl_FragDepth = log2(vFragDepth) · logDepthBufFC · 0.5` with
  `vFragDepth = 1 + gl_Position.w`.
- **A ShaderMaterial gets the defines but not the code.** It must include
  the chunks itself. The chunks call `isPerspectiveMatrix()` and use
  `EPSILON`, which live in three's `<common>` chunk, and `<common>` defines
  `PI` as `3.141592653589793` — the Hawaiian `constants` chunk defines `PI`
  as `3.14159265`, a macro redefinition with a different body, which GLSL
  ES 3.00 rejects. So write our own chunk rather than include `<common>`.

**Costs and consequences, each of which a builder will meet:**

| consequence | where it bites | what to do |
| --- | --- | --- |
| custom shaders without the chunks write ordinary depth while built-ins write log depth: wrong occlusion between them | terrain, relief, ocean, lines, routes, units, effects, labels (if 3D) | every scene ShaderMaterial includes `render/shaders/logdepth.glsl.js` (below); a smoke check that compiles each material and greps its source for `vFragDepth` |
| the composite pass rebuilds view position as `uInvProj · (uv, depth)`: with log depth that is garbage, so the height fog is wrong everywhere | `pipeline.js` | decode: `w = exp2(depth · log2(far + 1)) − 1` (below) |
| `polygonOffset` no longer applies (the fragment writes its own depth) | `lines.js`, `routes.js` (−1, −4), `ocean.js` (−2, −8) | rely on the lines' lift (they have one) and the seabed sink (it exists) |
| early depth rejection is off for every fragment that writes depth | the ocean disc, terrain, smoke and splash quads | draw opaque near to far (three sorts opaque objects front to back already), the sea after the land, particles additive without depth writes |
| sky dome and stars at `gl_Position.xyww` with `depthWrite: false` | `sky.js` | nothing: they test at the cleared depth and write none |
| fullscreen passes (sky map, shadow strips, composite) | — | nothing: `depthTest: false` |

**Precision.** With far = 450 km, 24-bit log depth resolves
`Δw ≈ (1 + w) · ln 2 · log2(far + 1) / 2²⁴ ≈ 7.8·10⁻⁷ · w`: 6 mm at
Kirishima's 7.7 km from Washington's bridge, 8 cm at 100 km. On the table
(far 50,000 km) about 6 m at 10,000 km.

**The alternatives I weighed:**

- *Dynamic near plane only* (the Hawaiian rig's own answer: near = 12 % of
  the altitude). Fine for the orbit camera; fails the bridge and chase
  views, where the near plane must be about a metre: 24-bit standard depth
  then resolves about 3.5 m at 7.7 km, and Kirishima's turrets, barbettes
  and superstructure flicker into one another in the flagship moment.
- *Two passes split at about 2 km* (far scene, clear depth, near scene).
  Excellent precision, but the CDLOD terrain, the ocean disc and the lines
  (all `frustumCulled = false`) draw twice, and the composite's depth
  texture then holds only the near pass, so the fog breaks the same way.
- *Reversed-Z with a float depth buffer*: the best answer, and absent from
  three r160 (no `reverseDepthBuffer` anywhere in its source). Upgrading
  three mid-project to get it would touch every custom shader; not for v1.

**Recommendation: confirm the logarithmic depth buffer for both scenes,
with these exact rules**, and measure it under SwiftShader and on an
integrated GPU before the engine's first sortie. If it costs too much in a
box (the ocean's per-pixel work behind ships is the likely place), fall back
to the dynamic near plane in watch mode and the two-pass split only in the
bridge and chase cameras.

```js
// render/shaders/logdepth.glsl.js — r160 defines USE_LOGDEPTHBUF in every ShaderMaterial but adds no code.
// Not three's <common>: it redefines PI against the Hawaiian constants chunk.
export const logDepthParsVertex = /* glsl */ `
#ifdef USE_LOGDEPTHBUF
out float vFragDepth;
#endif`
export const logDepthVertex = /* glsl */ `
#ifdef USE_LOGDEPTHBUF
vFragDepth = 1.0 + gl_Position.w;   // after gl_Position is written
#endif`
export const logDepthParsFragment = /* glsl */ `
#ifdef USE_LOGDEPTHBUF
uniform float logDepthBufFC;        // three uploads 2 / log2(far + 1)
in float vFragDepth;
#endif`
export const logDepthFragment = /* glsl */ `
#ifdef USE_LOGDEPTHBUF
gl_FragDepth = log2(vFragDepth) * logDepthBufFC * 0.5;
#endif`
```

```glsl
// pipeline.js compositeFragment: distance from a logarithmic depth buffer
uniform float uLogFar;   // log2(camera.far + 1.0), set each frame by Pipeline.render
...
float depth = texture(uDepth, vUv).r;
vec4 farPt = uInvProj * vec4(vUv * 2.0 - 1.0, 1.0, 1.0);
vec3 dirV = farPt.xyz / farPt.w;                    // a view-space point on this pixel's ray
float w = exp2(depth * uLogFar) - 1.0;              // view-space distance along -z
vec3 view = dirV * (w / -dirV.z);
vec3 world = (uCamWorld * vec4(view, 1.0)).xyz;     // the rest of the fog code unchanged; depth < 1.0 still means "not sky"
```

Near and far: 0.5 m and 450 km in a box (the horizon from 7,000 m is about
300 km; the far plane must also exceed the ocean disc's reach, which the
disc's radius then exceeds); 0.1 km and 50,000 km on the table. The rig's
`apply()` must clamp to these instead of computing its own.

### 3.4 Patch text for ENGINEERING §2

```markdown
## 2. Units, frames, precision and depth

- **Table scene**: world units are kilometres (`proj.unit = 1000`); x east, z south, y up; the pack covers
  `manifest.table.extent`. Heights are metres in data, on the CPU and on the GPU; the only conversion to
  world y is `ground.vert = exaggeration / proj.unit` (never a literal 100). `config.TABLE.exaggeration(distance)`
  eases from the box's value at the hand-over distance to about 30 with the whole theatre in view.
- **Box scene**: world units are metres (`proj.unit = 1`), origin at the box's `lon0, lat0`, x east, z south,
  y up. The box's exaggeration is one constant (`boxes/manifest.json` `exaggeration`, default 1.0) used by
  the renderer and by the sim alike; it never varies with the camera.
- **Model frame**: metres; bow or nose toward −z at heading 0; origin at the waterline amidships (ships) or
  the centre of gravity (aircraft). Headings and courses are compass degrees in data and sim; yaw about +y
  is −heading in radians.
- **Precision**: float32 resolves 0.5 m at the table's edge and 1.6 cm at a 400 km box's edge. The sim
  integrates positions in **Float64Array** (float32 rounding of a 1/60 s step is systematic: −9 % at 2 kn,
  no motion below 0.9 kn at 150 km from the origin). Instanced renderers write instance matrices
  camera-relative each frame (camera position subtracted in JS, the InstancedMesh placed at the camera).
- **Depth**: one `WebGLRenderer({ logarithmicDepthBuffer: true })`. three r160 defines `USE_LOGDEPTHBUF`
  in every ShaderMaterial but adds no code, so **every ShaderMaterial drawn into a scene includes the four
  chunks of `render/shaders/logdepth.glsl.js`** (fullscreen passes with depthTest off do not). `polygonOffset`
  does nothing under it; lines rely on their lift. The composite pass decodes distance as
  `exp2(depth · log2(far + 1)) − 1`. Near 0.5 m, far 450 km in a box; near 0.1 km, far 50,000 km on the
  table; the rigs clamp to these.
- **Time**: the sim steps 1/60 s of battle time; `advance(dt)` runs whole steps, at most 8 per call, and
  carries the rest in `sim.lag` (the battle slows rather than the frame stalling under SwiftShader). All
  randomness comes from `sim/rng.js`, seeded from the battle id and the moment id.
```

---

## 4. ENGINEERING §§3–13 reviewed as the lead engineer

The question for each section: could a builder who cannot ask questions
write against it, and would two such builders' halves meet? Each part says
what is sufficient, what is missing, what is wrong, and gives patch text.

### 4.1 §3 The projection interface

- **Sufficient**: the two classes, `projectionFor`, the longitude wrap.
- **Wrong**: DATA.md §1 says `toWorld → { x, z }`, ENGINEERING §3 says
  `[x, z]`. Every Hawaiian caller destructures an array
  (`const [x, z] = proj.toWorld(c)`, in pins, tour, lines, routes, load,
  polity). Keep the array and correct DATA.md.
- **Missing**: `jacobianAt` and `convergenceAt` (DATA.md §1 names
  `convergenceAt`; ENGINEERING does not); the placement transform the
  fly-down, the box outline on the table and the hand-over need; that
  `geo.js` imports nothing (the sim uses it, and the sim may not import
  three); that `toLonLat` returns longitudes in `[lon0 − 180, lon0 + 180)`;
  and that `load.js` normalises every coordinate once, so nothing downstream
  sees a raw longitude.

```markdown
## 3. The projection interface (`src/geo.js`; imports nothing, so the sim may use it)

    export function wrapLon(lon, lon0) → lon in [lon0 − 180, lon0 + 180)
    export class TangentProjection {                 // a box (DATA.md §1), and the Hawaiian Projection generalised
      constructor({ lon0, lat0, unit = 1 })
      kind = 'tangent'; lon0; lat0; unit             // unit: metres per world unit
      toWorld([lon, lat]) → [x, z]                    // an array, as every Hawaiian caller destructures it
      toLonLat(x, z) → [lon, lat]                     // lon in [lon0 − 180, lon0 + 180)
      scaleAt() → 1; convergenceAt() → 0
      rect([w, s, e, n]) → { x0, z0, x1, z1 }         // outer texel edges, row 0 north
    }
    export class TableProjection {                   // the table: kind 'aeqd' (v1), 'laea' or 'equirect'
      constructor({ kind, lon0, lat0, unit = 1000 })  // Snyder's spherical forms, R = 6,371,008.8 m
      toWorld, toLonLat                               // as above
      jacobianAt([lon, lat]) → [[dx/dE, dx/dS], [dz/dE, dz/dS]]   // world units per metre east and per metre south
      scaleAt([lon, lat]) → sqrt(|det J|) · unit      // the areal scale factor, 1 at the centre
      convergenceAt([lon, lat]) → degrees             // atan2(J[1][0], J[0][0]): clockwise on a north-up table from
                                                      // grid east to true east (= grid north to true north); −13° at Midway
    }
    export function projectionFor(desc) → TangentProjection | TableProjection
    export function placement(box, table) → {         // box: a boxes/manifest.json entry; table: the TableProjection
      centre: [x, z], J, Jinv, scale, alpha,          // scale = sqrt(|det J|) km per m; alpha in radians = convergence
      toTable([x, z]) → [x, z], toBox([x, z]) → [x, z],
      matrix: Float64Array(16)                        // box metres → table km, column-major, y scaled by `scale`
    }
    export function poseToTable(pose, pl) / poseToBox(pose, pl)   // pose = { target: {x, y, z}, distance, yaw, pitch }:
                                                      // target by toTable/toBox; distance × or ÷ scale; yaw − or + alpha
    export function geometryPoint(geometry)           // the Hawaiian one, called on normalised coordinates only

`data/load.js` normalises every longitude in places, events, routes, fronts, labels and coast with `wrapLon(…, table.lon0)`
once at load, and every longitude in a `battle.json` with the box's `lon0`; no other module sees a raw longitude.
The bake writes `placement` from the same formulas (`tools/lib/geo.mjs` holds a copy of `TableProjection`), and
`check-data` recomputes it.
```

### 4.2 §4 The clock

- **Sufficient**: the split into `WarClock` and `BattleClock`, `parseInstant`
  refusing an instant without an offset, `formatWhen` naming the zone.
- **Wrong**: `windowAt`'s "half the gap to the nearest chapter edge" is
  zero at every chapter boundary (§2.6). "`1942-06-04` → midnight UTC of
  that day" puts a day-precision event of zone +11 in the wrong day for its
  first eleven hours; read a bare date in the event's own `zone`.
- **Missing**: the slider mapping (a true date axis would give the
  ten-year prologue 73 % of the slider), the front keyframe pair for the
  cross-fade (the Hawaiian `Timeline.pair` that `app.syncEras` uses), the
  ISO sign convention for zones (the navy's "zone +12" is ISO `−12:00`;
  DATA.md §4's example gets it backwards and says Tokyo is 21 h "behind"
  Midway when it is ahead), `BattleClock.utc(t)` (the sky needs the
  absolute instant), and who holds the WarClock while a box is open.

```markdown
## 4. The clock (`src/time.js`)

Instants are ms UTC. Zones are ISO offsets (`+09:00` Tokyo; `-12:00` is the US Navy's "zone +12"; `-10:30` Hawaiʻi
in 1941); data never writes the navy form in a `zone` field, only in a clock's `name`.

    export const DAY = 86400000
    export function zoneMinutes(zone) → minutes east of UTC; throws on anything but ±HH:MM or Z
    export function parseInstant(s, { zone }) → ms     // YYYY[-MM[-DD]] = the start of that period in `zone` (UTC if none);
                                                      // YYYY-MM-DDTHH:MM[:SS](Z|±HH:MM) exact; a time with no offset throws
    export function spanOf(when) → [from, to)          // widened by precision: minute, hour, day, month
    export function formatWhen(when, { zone }) → "4 June 1942, 10:22 (UTC−12)"
    export class WarClock {                           // the table's time; owned by App
      constructor(chapters, { prologueShare = 0.1 })
      s                                               // the slider, 0..1: the prologue in [0, prologueShare], the war's days linear after
      date; dateAt(s); sAt(ms); setDate(ms); setS(s); onChange(fn)
      chapterAt(ms) → chapter
      windowAt(ms) → [from, to]                       // ±clamp(chapter length / 8, 7 d, 21 d); in the prologue, the whole prologue
      frontPair(ms) → { a, b, t }                     // the front keyframes either side, and 0..1 between (for the cross-fade)
    }
    export class BattleClock {                        // a box's time; owned by the sim
      constructor({ zone, from, to })                 // battle.json clock
      t                                               // seconds since `from`
      parse('10:22' | '10:22:30' | '24:07' | iso) → seconds since `from`   // HH:MM on the date of `from` in `zone`; 24:xx the next day
      utc(t) → ms; label(t) → '10:22'; dateLabel(t) → '4 June 1942'
    }

While a box is open the WarClock stays at the battle's date and the timeline bar is hidden; the HUD shows the battle clock.
Pins, routes and the tour sort by UTC instant and show each card in its own zone.
```

### 4.3 §5 The sim

- **Sufficient**: the authority rules (record by default, the sim where the
  player stands, consequences, bounded AI, outcome compared to the record)
  are clear and testable; the models list is a good brief.
- **Wrong**: `pos (Float32Array ×3)` (§3.2). And "AI evades within ±30°"
  (the authority list) against "evade within ±20°" (the models list):
  pick one.
- **Missing**, each of which two builders would otherwise invent twice:

```markdown
**State layout** (fixed at `createSim`; nothing is reallocated):
- `sim.capacity` = the record's units + every group's aircraft + `spares` (default 64: the player's own aircraft,
  a saved carrier's relaunched strikes). `sim.units[i]` exists for every slot; a free slot has `alive[i] = 0`.
- `sim.state.pos`: Float64Array(3N), x y z interleaved, box metres, y up, sea level 0.
  `quat`: Float32Array(4N), x y z w (THREE.Quaternion order). `vel`: Float32Array(3N), m/s.
  `speed`, `heading` (deg), `damage` (0..1), `fire` (0..1), `list` (deg): Float32Array(N).
  `alive`: Uint8Array(N): 0 free or gone, 1 alive, 2 sinking or falling (still drawn).
  `kitIndex`: Uint16Array(N) into `sim.kits`; `version`: Uint32Array(N), bumped when a slot is (re)assigned.
- `sim.projectiles`: capacity 4096; `pos` Float64Array(3M), `vel` Float32Array(3M), `kind` Uint8Array
  (0 shell, 1 bullet, 2 bomb, 3 torpedo, 4 AA burst), `calibreMm` Float32Array, `alive` Uint8Array, `owner` Int16Array.
- `sim.capacityByKit → { kitId: n }`: the most units of each kit that can ever exist, so the scene builds each
  instanced mesh once.

**One step, in this order** (so a replay is identical): 1 scripted motion (tracks, stations, routes: pure functions
of t), 2 AI decisions, 3 the player's physics from `player.input`, 4 AI physics, 5 projectiles and hits, 6 damage,
7 scripted events whose t was crossed (subject to the authority rules), 8 fates (sink, fall, land, despawn),
9 effects and beats pushed, stamped with the step's t. `advance(dt)` runs whole steps, at most 8 per call, the rest
into `sim.lag`.

**What the scene learns, and how**: `sim.effects` is a ring (capacity 2048, oldest dropped) with `drain(fn)`; the
scene drains it once a frame after `advance`. Kinds add `spawn` and `despawn` (a slot assigned or freed: re-read
`kitIndex` and `version`), `sink` and `fall` (alive becomes 2), `gone` (alive becomes 0). `sim.beats` is append-only;
each reader (the HUD's subtitles, the after-card) keeps its own index.

**Who owns time**: `Battle` holds `running` and `timeScale`; `BoxScene.update(realDt)` calls `battle.tick(realDt)`,
which calls `sim.advance(realDt · timeScale)` while running. Nothing else advances the sim.

**Scrubbing**: scripted motion is closed-form in t, so `sim.setTime(t)` is O(units) while `sim.diverged` is false.
Once a moment has been taken, `sim.diverged` is true and `Battle.scrub(t)` asks (one HUD line) whether to return to
the record: yes rebuilds the sim from `battle.json` with the same seed and sets t; no plays forward only.

**Input**: `player.input` holds levels (axes, held keys) the controls write each frame and never zero between sim
steps; one-shot actions are counters (`fireCount`, `bombCount`, `torpedoCount`, `salvoCount`) the sim consumes, so a
press in a frame with no sim step is not lost. `player.scripted = true` makes the controls leave `input` alone (the
smoke test writes it). `sim.player` is null until `takeControl`.

**Terrain for the sim**: `createSim(battle, kits, { seed, warn, ground })`, `ground = { metres: Float32Array, W, H,
rect, exaggeration }`, the decoded box pack; `sim/world.js` samples it bilinearly (as `PackTerrain.metresAt`) for
collisions, groundings and AA lines of sight.

**Evasion**: one bound, ±30° of the unit's course, in both the authority rules and `cap.js`.
```

### 4.4 §6 Kits

- **Sufficient**: one material per family, turrets separate, throw on
  unknown vocabulary.
- **Wrong**: "`insigniaTexture(name) → DataTexture`" with "one material for
  every aircraft, so instancing works": a texture per insignia means a
  material per insignia. Use one atlas texture and a per-instance (or
  per-vertex) atlas index.
- **Missing**: the origin (waterline amidships; centre of gravity), the
  units (metres), the turret's `at` frame (kit frame, metres from the
  origin), a statement that the generator is deterministic (the same kit
  gives the same geometry, so a cache by kit id is safe), and the source of
  the geometry helpers (`features/kit.js` `Builder`, §2.0c).

```markdown
Geometry is in metres in the model frame of §2 (origin at the waterline amidships for ships, the centre of gravity
for aircraft; bow or nose toward −z). `turrets[].at` is in that frame. The generators are deterministic: the same
kit and `colourDate` give the same geometry, so `battle/kits/` caches by `kit.id + colourDate`. National markings
come from one atlas (`insigniaAtlas() → { texture, rects: { name: [u0, v0, u1, v1] } }`) addressed by a per-instance
attribute, so every aircraft shares one material. The helpers are the Hawaiian `features/kit.js` `Builder` (box,
tapered cylinder, prism, quad, ribbon; flat normals, vertex colour), copied with its scale set to 1 and a lofted hull
added.
```

### 4.5 §7 The box scene

- **Sufficient**: the API (`load`, `setSim`, `setCamera`, `update`,
  `dispose`), the draw-call budget (I count about 60–80 for Midway's
  morning: 30 ship hulls, five or six turret calibres, six aircraft kits,
  ten effect families, terrain 2, ocean 1, sky 2), the reuse of the ocean
  and sky.
- **Wrong**: "shares `app.shared` uniforms": the Hawaiian bag mixes the
  light (sun, sky colours, sky map, time) with the ground (`uVert`, the
  pack, its rect); the table and a box need the same light and different
  ground. "The terrain as the Hawaiian terrain mesh": it needs the
  single-pack chunk and, for v1's Ironbottom Sound and Samar, a plan for
  coasts that run off the box's edge (beyond the pack the ground is a flat
  −4,000 m sea, so Guadalcanal's ridge ends in a cliff into deep water seen
  from Washington's bridge; see the decision in §7). "Night as the Hawaiian
  night with star shells and searchlights as point lights": the Hawaiian
  lighting has the sun and the moon only; point lights must be added to the
  shared `lighting` chunk and to the ocean's glint.
- **Missing**: the ground interface for the rig and the sim; the shared
  versus per-scene uniforms; how units are drawn at distance (a minimum
  on-screen size, not sprites); camera-relative instancing.

```markdown
**Ground** (both scenes; the camera rig reads only this):

    ground.bounds                // { x0, z0, x1, z1 } world units
    ground.maxY                  // world y of the highest ground now
    ground.vert                  // world y per metre now (exaggeration / unit)
    ground.metresAt(x, z)        // metres, negative at sea; the CPU copy of groundMetres()
    ground.heightAt(x, z)        // world y of the ground or the sea surface, never below 0
    ground.uniforms              // this scene's own: uVert, uExag, uNormalE, uArchH, uArchRect, uOutside

`TableGround` (src/table/) and `BoxGround` (src/battle/scene/terrain.js) implement it over one `PackTerrain` each,
with the single-pack chunk `render/shaders/ground.glsl.js`.

**Shared and per-scene uniforms**: `app.light.uniforms` (uSunDir, uSunColor, uSkyColor, uGroundColor, uMoonDir,
uMoonColor, uTime, uSkyMap, uPointPos[8], uPointCol[8], uPointCount) is one bag shared by reference by every material
of both scenes and written each frame by the active scene's sky update. Each scene's `ground.uniforms` are its own and
never merged into the light bag. A material's uniforms are `{ ...app.light.uniforms, ...ground.uniforms, ...own }`.

**Point lights**: `lighting` gains up to 8 point lights (position in world units, colour × intensity, radius);
`shade()` adds them with an inverse-square falloff clipped at the radius; the ocean adds their glint. Star shells,
searchlight pools and gun flashes write them each frame (the nearest 8 to the camera).

**Units**: hulls as one mesh each (exact at any distance); turrets, aircraft, shells, tracer, splashes, smoke, wakes
as instanced meshes or points whose instance data is written camera-relative each frame (§2). Aircraft keep a minimum
on-screen span of 3 px (the vertex shader scales the instance up with distance) so a strike reads at 20 km.
Fragments of hulls and aircraft below y = 0 are discarded (a sinking ship goes under the surface without depth games).
```

### 4.6 §8 Controls

- **Sufficient**: the bindings and the touch layout.
- **Wrong in combination with the copied code**: the Hawaiian camera rig
  binds W/A/S/D, the arrows, Q/E and +/− on `window`; `ui.js` binds
  ArrowRight and Space to the tour's Next, ArrowLeft to Back, `,`/`.` to
  chapter skips and Esc to close the card. The sortie binds W/S/A/D, the
  arrows, Q/E, Space, Esc. Without arbitration one key press steers the
  aircraft, pans the camera and advances the tour. The rig's pointer drag
  pans; the sortie's mouse aims.
- **Missing**: an input mode and who listens in each.

```markdown
**Input arbitration**: `app.mode` is one of `table`, `flying`, `watch`, `moment`. Every keyboard and pointer
listener checks it first:
- `table`: the table rig and the UI (tour keys, Esc closes the card).
- `flying` (a fly-down or fly-up): nothing but Esc (abort back to where it started).
- `watch`: the box's orbit rig; the UI's tour keys walk the battle's stops; Esc closes the card, then leaves the box.
- `moment`: only `battle/controls/`; the rigs are disabled (`rig.enabled = false`), the UI's keys are off, Esc
  releases the controls (to `watch`). Pointer lock, if used, is requested on the "Take the controls" click.
`CameraRig` gains `dispose()` (one AbortController for all its listeners) and the box's rig is disposed with the box.
```

### 4.7 §9 The battle lifecycle and the hand-over

- **Sufficient**: the `Battle` API.
- **Wrong (a cost the Hawaiian code makes expensive)**: "cross-fades the
  two over the fly-down (the table keeps drawing under a fade while the box
  loads)". Both scenes would render every frame of the fade, each into its
  own HDR multisampled target (a second 4× MSAA half-float target at
  1280×800 is about 33 MB of colour and 16 MB of depth, four times that at
  a device pixel ratio of 2), on integrated GPUs and under
  SwiftShader, while the box's kits are being built on the main thread. The
  rig already has what is needed: `flyTo(…, { ready })` slows the last fifth
  of a flight until the box is ready. Do the fly-down on the table, hold if
  needed, then cut through the haze colour in half a second at a matched
  pose. One scene per frame.
- **Missing**: the hand-over's steps and units (§2.4), the URL grammar,
  history behaviour, and the boot path for a URL that names a battle.

```markdown
**The hand-over** (App owns it):
1. `battle.enter(boxId)` starts the box pack's decode (PackDecoder, worker), fetches `battle.json` and the kits, and
   builds kit geometry a few kits per frame; `battle.ready` turns true when the scene can draw.
2. The table rig flies to the hand-over pose (the box's centre at `handoverDistance` = 0.8 × the box's diagonal, km),
   `flyTo(pose, 2.5, { ready: () => battle.ready })`. Over the last third the table's overlays (front, routes, labels,
   pins) fade out and its exaggeration eases to the box's.
3. On landing: `pipeline.uFade` to the haze colour over 0.25 s; `app.setActive(box)` (re-parents `sky.group`, sets
   the sky to the box's lat/lon and `clock.utc(t)`, the fog to the weather's visibility); `box.rig.jump(poseToBox(
   table.rig.pose(), placement))`; fade back in over 0.25 s; the briefing card opens. `app.mode = 'watch'`.
4. Leaving reverses it: the box rig flies up to the hand-over pose, fade, `setActive(table)`, the table rig jumps to
   `poseToTable(...)`, the WarClock is at the battle's date, overlays fade in. The box is disposed.

**The URL**: the hash carries the view, the query string carries tool switches (`?data=`, `?q=`, `?fixedq`,
`?debug=`), as the Hawaiian app's tools expect.

    #date=1942-06-04                          the WarClock's date (a day; the table only)
    &cam=x,z,distance,yaw,pitch               the active rig's pose in the active scene's units (km or m), radians, 4 decimals
    &battle=midway                            a box id
    &t=10:22 | 10:22:30 | 24:07                battle-clock time (BattleClock.parse); default the box's first stop
    &moment=vb6-kaga                          offers that moment: the briefing opens on it with "Take the controls" focused

`app.fromUrl()` runs at boot (after the table is ready: a URL with a battle boots the table first, then enters the box
with no fly-down) and on `hashchange`. `app.syncUrl()` writes with `history.replaceState`, debounced 250 ms, only when
the serialised hash changed, and remembers what it wrote so its own change does not re-enter `fromUrl`. Entering and
leaving a box use `history.pushState`, so the browser's Back leaves the box. Unknown keys are kept. A moment never
starts without a click.

`window.__app = app`; handles for the tools: `app.ready`, `app.mode`, `app.clock`, `app.table`, `app.battle`
(`.scene`, `.sim`), `app.tour`, `app.ui`, `app.settle()`, `app.stats()`.
```

### 4.8 §10 The table scene

- **Wrong**: the chart sea is described twice, as "a plane under the relief
  where the relief is below sea level" and as "not a second surface". The
  second is right (§2.10); delete the first.
- **Questionable**: labels as "billboarded sprites from a canvas atlas in
  Fraunces". A canvas atlas must wait for the fonts (including the Japanese
  subset) before it draws, re-rasterises at each device pixel ratio, and
  as built-in `Sprite`s they join the log-depth rules. DOM labels like the
  Hawaiian district labels and pins (`features/labels.js`) are crisp,
  render kanji through CSS, and thin by rank and collision in the same
  per-frame loop as the pins. With rank-thinning, under a hundred labels
  are on screen at once. Recommend DOM labels; it is a decision for the
  designer (§7).
- **Missing**: `TableScene` implements the ground interface; the relief
  shader's three departures from the island terrain (§2.3); the front as a
  rasterised mask (land held per keyframe, cross-faded by
  `clock.frontPair`) plus `LineSet` perimeters and declared lines plus the
  islands' dated holders as instanced marks; the fixed war-room light.

### 4.9 §11 The gazetteer UI

Sufficient as a list. Add: the card's modes (`event`, `chapter`,
`cluster`, `briefing`, `after`), *Enter the battle* and *Take the controls*
buttons and their events (`ui.onEnter(ev)`, `ui.onTake(momentId)`, which
`integrate` wires to `app.battle`), and that the after-card reads
`sim.score` and `sim.outcome` only through `Battle.takeMoment()`'s resolved
value, so the UI never imports the sim.

### 4.10 §12 Tools

- `smoke.mjs` "feeds scripted input through
  `app.battle.sim.player.input` for twenty seconds of sim time": with the
  controls zeroing input each frame, the scripted input is lost; needs
  `player.scripted` (§4.3).
- `battle.html` is not in the build (Vite builds only `index.html` with the
  shared config), so `tools/smoke-battle.mjs` must run against the Vite dev
  server (`npx vite --port 5297` in the package) before integration, and
  against `dist/index.html#battle=…` after.
- `subset-font.mjs` must run after the content and battles have landed
  (it scans their JSON for kanji): an integration step, not a parallel one.
- `check-data.mjs` split into modules (§6).
- `fake-data.mjs` writes the fixtures listed in §6.4; `tools/fake-battle.mjs`
  (engine-owned) may extend the box fixture without touching the table's.

### 4.11 §13 Who builds what

Corrected in full in §6.

---

## 5. Size of `dist/` for v1, and the dependencies to pin

### 5.1 The estimate

Calibration: the Hawaiian `dist/holo-i-ke-au/` on its branch is 20.3 MB:
19.1 MB of data, one 791 KB JavaScript bundle (three plus the app) and
33 KB of workers, 26 KB of CSS, 199 KB of fonts, a 100 KB thumbnail. Pack
sizes are R1's measurements in the Hawaiian format (R1 §6).

| item | estimate | basis |
| --- | --- | --- |
| `table/height.png` 2048 × 1830 | 5.4–7.0 MB | R1: aeqd 2048 × 2011 at 0.5 m steps 5.95 MB, bilinear and so smoother than a real bake |
| Midway box, 1024 | 0.5–0.7 MB | R1: 908 × 1024, 682 KB |
| Ironbottom Sound box, 2048 | 2.4–2.9 MB | R1: 2,366–2,897 KB |
| Samar box, 1024 | 0.6–1.0 MB | R1's Ironbottom 1024 (921 KB) as the land-heavy bound |
| Pearl Harbor box | 0.8–1.0 MB at 1024 on the Oʻahu pack's footprint; 2.5–3.0 MB at 2048 if it must hold the approach | the Hawaiian Oʻahu pack is 883 KB at 1024 × 801 |
| `table/coast.json` | 0.5–1.5 MB | R1 (*verify*) |
| gazetteer (chapters, places, events, sources, routes, labels) | 0.4–0.8 MB | the Hawaiian events.json is 99 KB for its events; R3 lists 122 cards with Japanese names, tellings and zoned instants, and the routes carry dated waypoints |
| fronts (8 keyframes, lines, island holders) | 0.25–0.8 MB | hand-digitised polygons |
| four `battle.json` | 0.4–1.0 MB | Midway's day has about 110 beats, 30 units with tracks, 20 groups |
| kits | 0.06–0.15 MB | about 25 ship classes and 12 aircraft types |
| **data subtotal** | **11.3–18.9 MB** (central ≈ 14) | |
| JavaScript | 0.75–0.95 MB | the Hawaiian bundle less `features/`, `overlay/`, district and patches (about 330 KB of source), plus the sim, kits, box scene, controls and table (about 350 KB of source) |
| CSS | 25–35 KB | |
| Latin fonts | 199 KB | the eight woff2 files, unchanged |
| Noto Sans JP subset | 120–180 KB per weight | **measured** with `subset-font` 2.4.0 on the Google Fonts variable TTF (9.6 MB): the 526 distinct CJK characters in the design and research documents give 118,748 bytes at weight 400 and 121,728 at 700 as static woff2 instances, 225,932 with the weight axis kept; about 225 bytes a character, so 800 characters ≈ 180 KB |
| thumbnail | ≈ 100 KB | |
| **`dist/pacific-theatre/` total** | **≈ 13–21 MB** (central ≈ 15.5) | inside the 40 MB ceiling with room for four more boxes at 1024 |

Two notes for the budget:

- Git stores identical files once, so `public/data/` and its copy in
  `dist/pacific-theatre/data/` cost one blob each, not two. Each re-bake
  of the table that changes its bytes adds about 6 MB to the history
  forever: tune with `--preview` images before committing a bake.
- One Japanese weight is enough (titles set larger in the regular weight):
  a second weight doubles the font's cost and the variable font costs as
  much as both.

### 5.2 Dependencies to pin

| package | where | pin | published | why this one |
| --- | --- | --- | --- | --- |
| `three` | `dependencies` | `^0.160.0` | 0.160.1 is in the root lockfile (January 2024) | matches the Hawaiian app and the root lockfile; `^0.160.0` stays on 0.160.x in npm's 0.x semver; r160 has no reversed depth (§3.3), so do not upgrade mid-project for it |
| `geotiff` | `devDependencies` | `2.1.3` exactly | 2024-02-06 | what the Hawaiian bake and R1's proof of concept ran; R1's `curlclient.mjs` subclasses its 2.x `BaseClient`/`BaseResponse`. The 3.x line (3.0.0 on 2026-01-25, 3.0.5 on 2026-03-11, 3.1.0-beta since) is ESM-only and was not tested with the curl client |
| `shapefile` | `devDependencies` | `0.6.6` exactly | 2017-09-02 | pure JS, what R1 used for Natural Earth; old dependencies (`commander` 2, `text-encoding` 0.6.4, deprecated) but build-time only |
| `subset-font` | `devDependencies`, only if the font is subset in Node | `2.4.0` exactly | 2024-10-05 | measured here (above); pulls `harfbuzzjs` (WebAssembly) at build time only. The alternative is `pyftsubset` from fonttools with brotli, outside npm |
| `playwright` | root `devDependencies` (already `^1.49.1`) | — | — | `smoke.mjs` and `shoot.mjs` launch `/opt/pw-browsers/chromium-1194` with SwiftShader, as the Hawaiian tools do |

The Noto Sans JP source for the subset is reachable from this container:
`https://raw.githubusercontent.com/google/fonts/main/ofl/notosansjp/NotoSansJP%5Bwght%5D.ttf`
(HTTP 200, 9,589,900 bytes, SIL OFL 1.1); `subset-font.mjs` should fetch it
through `tools/lib/fetch.mjs` into the downloads directory (with the
ledger), never into the repository.

**The lockfile in its own commit.** `CLAUDE.md` requires that a
`package-lock.json` change never share a commit with app code. Since
`package.json` must exist before any workflow forks (§6), the order is: one
commit with `package.json` (all four dependencies above) and the Stage 0
scaffold; `npm install` at the root; a second commit with only
`package-lock.json`. After that no workflow touches either file; a
workflow that needs a package writes it in its report.

---

## 6. The order of implementation for five parallel agents

### 6.1 What is wrong with §13 as drafted

| problem | effect |
| --- | --- |
| `render/**`, `geo.js`, `time.js`, `config.js`, `data/**` are `table`'s, but `engine` needs them adapted for metres, log depth and a single-pack ground from its first hour | engine either waits or copies and diverges; two incompatible adaptations of the same files at merge |
| `package.json`: `table` owns it, `bake` owns "the geotiff and shapefile devDependencies" | two edits of one file plus a lockfile from each |
| `table/labels.json`: seeded by `bake`, edited by `content` | the same file from two branches |
| `RESEARCH.md` §§2–6 written by `content`, `engine` and `battles` | conflicts where sections abut |
| `tools/check-data.mjs` is `content`'s, but it must check kits (`engine`), battles (`battles`) and packs (`bake`) | no validator for `battles` until `content` merges; three workflows' rules in one file |
| `battles` writes kit ids into `battle.json` that `engine` is inventing at the same time; box bounds that `bake` has not computed yet | dangling references found only at integration |
| `subset-font.mjs` is not assigned; it can only run once the content and battles exist | no font until integration |
| the root `.gitignore` (`packages/pacific-theatre/test-data/`, `/.claude/worktrees/`) is nobody's | fixture files committed by accident |
| `table/**` in the bake's row is ambiguous (`public/data/table/**` or `src/table/**`) | |

### 6.2 Stage 0: the core, one agent, before the fork

One agent (or the project manager) adapts the shared core and freezes the
contracts. Everything here is the adaptation work this report specifies;
none of it needs real data.

| files | what |
| --- | --- |
| `package.json`, `vite.config.js`, root `.gitignore` lines | dependencies of §5.2; the gallery block with `"status": "wip"` and `"thumbnail": { "waitFor": "!#boot", … }` |
| then `package-lock.json` | its own commit |
| `index.html`, `main.js`, `style.css` (tokens), `src/fonts/**`, `FONTS.md` | retitled skeleton, boot bar, fonts copied |
| `src/config.js`, `src/geo.js`, `src/time.js` | per-scene unit objects; the projections and placement (§4.1); the clocks (§4.2) |
| `src/data/{load,decode,image,worker}.js` | `describePack` with `extent`; decode parameters; normalisation; `loadBox` |
| `src/render/{pack,camera,sky,stars,pipeline,lines,routes}.js`, `src/render/shaders/{common,ground,logdepth}.glsl.js` | unit-agnostic, log-depth chunks in every scene shader, the composite's log decode and `uFade`, the dated sky at any latitude, the rig's options, ground interface and `dispose()`, point lights in `lighting` |
| `src/render/{ocean,shadow}.js`, `src/render/shaders/ocean.glsl.js`, `src/battle/scene/terrain.glsl.js` | the box flavours (metres), handed to `engine` at the fork |
| `src/app.js` | renderer (log depth), pipeline, light bag, one Sky, the active-scene switch, `app.mode`, the frame loop and quality governor, URL parse and sync for the grammar of §4.7 (date and cam only until integration), `window.__app` |
| `src/battle/index.js` | a stub `Battle` (enter/leave log and resolve) that `engine` replaces |
| `tools/lib/{fetch,png,raster,geo}.mjs` | copied and adapted (§2.13) |
| `tools/check-data.mjs`, `tools/check/common.mjs`, `tools/check/ids.json` | a runner that imports every `tools/check/*.mjs` present; shared helpers (§2.14); the frozen ids (below) |
| `tools/fake-data.mjs`, `tools/smoke.mjs`, `tools/shoot.mjs` | the fixtures of §6.4; the harnesses with a boot-and-no-errors check |
| `DATA.md`, `ENGINEERING.md` | patched and frozen: from here on a change to either goes through the project manager |

**Frozen in `tools/check/ids.json`** (and in DATA.md): the box ids, each
box's `lon0`, `lat0`, bounds and size (DESIGN §3.4 and R1; the bake may
refine bounds by less than a texel's worth and reports it); the kit ids and
types for every ship class and aircraft type the four v1 battles use; the
chapter and front keyframe ids; the side and kind vocabularies.

**Gate**: `npm run build` succeeds; `node tools/smoke.mjs` boots
`dist/index.html?data=../test-data/` under SwiftShader, shows the fake
table, flies to the fake box's outline, and logs no console error; every
scene ShaderMaterial's source contains `vFragDepth`.

### 6.3 The five workflows after the fork

| workflow | owns (only these) | interfaces it consumes, frozen | fixture to run alone |
| --- | --- | --- | --- |
| **bake** | `tools/bake-table.mjs`, `tools/bake-box.mjs`, `tools/lib/{etopo,cog,ne,simplify}.mjs`, `tools/check/packs.mjs`; outputs `public/data/manifest.json`, `public/data/table/height.png`, `public/data/table/coast.json`, `public/data/boxes/manifest.json`, `public/data/boxes/*/height.png` | DATA.md §§1–3, 7, 11; `ids.json` boxes | none: real downloads (outside the repo, with the ledger); its own `--check` and `--preview` |
| **content** | `public/data/{chapters,places,events,sources,routes}.json`, `public/data/fronts/**`, `public/data/table/labels.json` (by hand from the gazetteer; the bake does not seed it), `tools/check/{gazetteer,routes,fronts}.mjs`, `research/content.md` | DATA.md §§3–6, 10; `ids.json` boxes, chapters | none: its own files and checks |
| **table** | `src/table/**`, `src/ui/**`, `src/render/{pack,camera,sky,stars,pipeline,lines,routes}.js` and `src/render/shaders/{common,ground,logdepth}.glsl.js` (extend, never break the Stage 0 API), `src/app.js` (table side), `main.js`, `index.html`, `style.css`, `tools/smoke.mjs`, `tools/shoot.mjs`, `tools/subset-font.mjs`, `FONTS.md` | ENGINEERING §§2–4, 9–11 | `test-data/` table subset (§6.4) |
| **engine** | `src/battle/**` (replacing the stub), `src/render/{ocean,shadow}.js`, `src/render/shaders/ocean.glsl.js`, `battle.html`, `public/data/kits/**`, `tools/smoke-battle.mjs`, `tools/fake-battle.mjs`, `tools/check/kits.mjs`, `research/engine.md` | ENGINEERING §§2, 5–9; DATA.md §§8–9; `ids.json` kits | `test-data/boxes/test-box/**` and `test-data/kits/**` (§6.4), run in `battle.html` on the Vite dev server |
| **battles** | `public/data/boxes/*/battle.json`, `tools/check/battle.mjs`, `research/battles.md` | DATA.md §9; `ids.json` boxes and kits; `time.js`'s `BattleClock` for its checks | none from `fake-data`: its check validates against `ids.json` until real kits and packs merge |

**Merge order**: Stage 0, then bake, content, table, engine, battles, then
integrate (the draft's order, with Stage 0 in front). Data before the
table lets the table's smoke switch to real data on merge; the engine
before the battles lets `battle.json` be checked against the real kits.

### 6.4 The fixtures `fake-data.mjs` writes (Stage 0)

All in `test-data/` (gitignored), plainly labelled as tests, nothing in it
history:

- `manifest.json`: aeqd at 141.5° E 7° N, `unit` 1000; a 512 × 458 table
  pack (the real extent, coarser texels) with four made-up islands from the
  Hawaiian dome generator, one straddling 180°, one high (3,000 m), a
  trench to −10,000 m, shelves; `scale 0.5, offset −11000`.
- `table/coast.json`: the islands as polygons (one with longitudes past
  180) and `strokes`; `kind`, `ne`, `area`. `table/labels.json`: ten labels
  of every `kind` and rank, one with `ja`, the date line.
- `chapters.json`: a prologue and three chapters with `from`, `to`,
  `front`. `fronts/`: two keyframes (held, contested, bypassed) and
  `lines.geojson`.
- `places.json` (12, every precision, one polygon across 180°),
  `events.json` (12: zones `+09:00`, `-12:00`, `+11:00`, `-10:30`;
  precisions minute, day, month; one event with `box: "test-box"` and box
  stops with `t` and `camera`; one card-only `massacre`; one across the
  date line whose two local dates differ), `sources.json` (4),
  `routes.json` (3: a fleet route across 180° with dated waypoints, a
  strike in the air, a schematic drive).
- `boxes/manifest.json`: `test-box` (tangent at 179.5° E 28° N, so it
  crosses 180°), 256 × 256 pack (an atoll and a 900 m island), its
  `placement` computed with Stage 0's own `geo.js` so the hand-over can be
  tested, `exaggeration` 1.
- `boxes/test-box/battle.json`: clock zone `-12:00`, 04:00–18:00; weather
  with a squall; three ships a side (a carrier, a battleship, destroyers
  with stations); a dive group of six on the carrier, a CAP of four, a
  torpedo group of four; scripted `hit`s with `by`, `fire`, `sinks`;
  three stops; three moments (a dive, a gunnery duel, a torpedo run).
- `kits/ships.json`, `kits/aircraft.json`: test kits using every block
  `kind`, funnel and turret `shape`, and every aircraft wing, tail and
  canopy shape at least once, so the generators' "throw on unknown" is
  exercised.

### 6.5 What the integrator will have to do by hand

1. Assemble `RESEARCH.md` from `research/{content,engine,battles}.md` and
   the R1–R9 reports.
2. Wire `Battle` into `App`: the active-scene switch, the fly-down and
   fly-up (§4.7), `app.mode` and its key arbitration (§4.6), the URL's
   `battle`, `t` and `moment`, the tour's box stops, the card's *Enter the
   battle*, *Take the controls*, briefing and after-card.
3. Run every check on the merged data (`tools/check-data.mjs` now loads all
   five modules) and fix the cross-references that only meet here: every
   event `box` names a baked box; every fleet route of a boxed battle
   matches a unit track at the battle's start (DATA.md §5); every kit
   cited exists and has its sources.
4. **The replay test**, per box: create the sim untouched, run it from the
   clock's `from` to `to`, and assert `sim.outcome.diverged` is empty
   (every scripted strike launching when the record says, every ship
   reaching its `fate` when the record has it: Kaga past `fatal` on
   ENGINEERING §5's schedule is the first case). Where it fails, tune kit
   `fatal` and event `damage` with the
   battles' data. This is where the engine's models and the battles'
   record first meet, and it will take the longest.
5. Run `tools/subset-font.mjs` on the final JSON, commit the subset, put
   the glyph count in `FONTS.md`.
6. The thumbnail: the gallery opens `…/pacific-theatre/dist/` with no hash,
   so either the default opening view is the shot, or the package's
   `thumbnail` block clicks to it (`"click": ".tl-tick[data-i='4']"` and a
   `settle` long enough for the flight). Then `npm run build`,
   `CHROMIUM_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome npm run
   thumbnails -- pacific-theatre`, look at it, `npm run build` again,
   `npm run verify`, and check `public/data/` stays under 40 MB.
7. Run `tools/smoke.mjs` and `tools/smoke-battle.mjs` on real data under
   SwiftShader; record frame times and heap; decide the depth fallback
   (§3.3) if a box is unusable.

---

## 7. Decisions for the designer

| # | decision | recommendation | why |
| --- | --- | --- | --- |
| E1 | Depth in a box | **Logarithmic depth buffer for both scenes**, with the chunk rule, the composite decode and no reliance on `polygonOffset` (§3.3); measure before the first sortie; fall back to a dynamic near plane in watch mode plus a two-pass split for the bridge and chase cameras only if it is too slow | the only option in r160 that holds Kirishima's turrets apart at 7.7 km from a bridge camera (6 mm against 3.5 m) without drawing the terrain twice |
| E2 | Sim precision | **Float64 positions in the sim; camera-relative instancing in the scene** | measured systematic drift in float32 (−9 % at 2 kn; no motion under 0.9 kn); shimmer of the player's aircraft |
| E3 | A box's exaggeration | **1.0 in every box, fixed** (or one fixed value per box shared by renderer and sim) | the sim's terrain and the drawn terrain must agree; true heights read well at sortie distances |
| E4 | The hand-over | **Fly down on the table with the rig's `ready` hold, then a half-second cut through the haze colour at a matched pose**; no simultaneous rendering | a true cross-fade renders both scenes into two HDR multisampled targets during the slowest moment (kit building); the rig already waits for readiness |
| E5 | Stage 0 before the fork | **Yes**: one agent adapts the shared core, writes `package.json` and the lockfile (separate commits), freezes DATA.md, ENGINEERING.md and `ids.json`, and writes the fixtures | without it `engine` and `table` adapt the same files two ways at once (§6.1) |
| E6 | Box edges where coasts run off | **Size v1 boxes so every coast seen from the action lies inside** (Ironbottom Sound wide enough to hold Guadalcanal's north coast and Savo's surroundings; Samar's box holding the island's east coast); defer a "context ring" sampled from the table pack through the placement transform | beyond a box's pack the ground is a flat −4,000 m sea: a ridge cut by the box edge shows as a cliff; the ring is elegant (the Hawaiian slot blend, one level down) but is a second CDLOD and an affine sampler: not v1 |
| E7 | Pearl Harbor's box | **The Hawaiian Oʻahu pack's footprint (68 m) with GMRT sea a few tens of kilometres out, at 1024 or its native size; the carriers stay off the box and strikes enter at its edge** | reuses a baked, checked pack; a box holding the carriers 200 nautical miles north would be coarse everywhere or 3 MB |
| E8 | Box terrain shading | **Keep the Hawaiian `groundAlbedo` with a per-box constant rain**; a height/slope ramp behind a define for anything that looks wrong | free, tuned for high Pacific islands; Midway reads as sand and seabed anyway |
| E9 | Table labels | **DOM labels** like the Hawaiian district labels and pins | crisp at any zoom and pixel ratio, kanji through CSS, no glyph atlas, no depth rules; under a hundred visible after rank-thinning |
| E10 | The table's sky | **A fixed war-room light** (the Hawaiian far view's day 277, hour 15.6); the battle's real sky only in a box | a map that goes dark with the date is hard to read and says nothing |
| E11 | The slider | **Prologue compressed to 10 % of the slider, the war's days linear after; window ±clamp(chapter/8, 7 d, 21 d), the whole prologue in the prologue** | a true date axis gives the ten-year prologue 73 % of the slider; the drafted window collapses at chapter edges |
| E12 | Sky astronomy | **A dated low-precision ephemeris** (sun from the NOAA/Meeus formulas, moon from Meeus ch. 47 truncated), at the box's latitude and longitude from the battle clock's UTC instant | the Hawaiian moon repeats yearly and is 8–11 days off at Pearl Harbor and Samar; the night battle depends on the moon |
| E13 | Night lighting | **Up to 8 point lights in the shared `lighting` chunk and the ocean's glint** | star shells, searchlights and gun flashes are the night battle's picture; the Hawaiian lighting has sun and moon only |
| E14 | Distant aircraft | **A minimum on-screen span in the instanced aircraft shader**, not sprites | keeps heading and bank readable; the Hawaiian sprites are two-facing pixel people |
| E15 | `check-data` | **Split into `tools/check/*.mjs` modules, one per owning workflow, under a Stage 0 runner** | each workflow validates its own data before merge; no shared file |
| E16 | Japanese font | **One static weight (400), subset with `subset-font` 2.4.0** from the Google Fonts TTF | about 120–180 KB; a second weight or the variable axis doubles it |
| E17 | `geotiff` version | **2.1.3 exactly** | the version R1's curl client was proven with; 3.x is a rewrite to ESM-only |
| E18 | The thumbnail | **Open the app on the first chapter as the tour does, and let the thumbnail block click a mid-war chapter tick** (or make the mid-war view the default) | `scripts/thumbnails.mjs` opens the dist with no hash; DESIGN §5.9 wants the table at the war's middle |
| E19 | Fix in DATA.md now | **`toWorld` returns `[x, z]`; §4's Midway example uses `-12:00` and "21 hours ahead"; zones are ISO offsets everywhere; `boxes/manifest.json` gains `exaggeration`; ENGINEERING picks one evasion bound (±30°)** | each is copied by a builder who cannot ask |

---

## 8. Risks

| risk | likelihood | effect | mitigation |
| --- | --- | --- | --- |
| a scene shader without the log-depth chunks | high (the Hawaiian shaders have none, and new ones will be written in five worktrees) | wrong occlusion between that material and every built-in one; shows only at integration | the chunk module in Stage 0; a smoke check on every material's compiled source |
| log depth too slow under SwiftShader or on an integrated GPU | medium | box unusable in the smoke test, or below 60 fps | measure early (Stage 0 can render the fake box); the fallback in E1 |
| the record does not replay untouched (Kaga sinks late, a strike launches without its carrier) | high on first integration | the authority rules look broken; the after-card lies | the replay test (§6.5 step 4) in `smoke-battle.mjs` from the engine's first sortie; `damage` and `fatal` as data, tuned with the battles |
| input collisions between the rigs, the UI and the controls | high if unspecified | a key steers, pans and advances the tour at once | `app.mode` arbitration (§4.6) in the contract |
| a second scene or rig leaks listeners and GPU memory per box visit | high (no `dispose()` on the rig) | slower each visit; duplicate key handling | `CameraRig.dispose()`; `BoxScene.dispose()` frees `PackTerrain`, kits, instanced meshes; smoke enters and leaves three times and compares heap |
| kit ids or box bounds change after the fork | medium | `battle.json` references break at merge | `ids.json` frozen in Stage 0; changes only through the project manager |
| the zone sign convention | high (DATA.md's own example has it backwards) | events placed a day off; Midway's beats 24 h out | ISO offsets only in `zone` fields; `check-data` recomputes each `sourceClock` conversion (DATA.md §9 says so already) |
| table decode memory on phones | medium | the boot fails on low-memory devices (heights and normals 15 MB each, worker scratch) | `land: false`; consider a 1536-wide table pack (R1: saves about 2.5 MB of PNG too) if phones matter |
| the sim's catch-up spiral under slow frames | medium (SwiftShader, ship moments at 3×) | frames take longer as the sim takes more steps per frame | at most 8 steps per `advance`, the rest into `sim.lag` |
| `geotiff` 3.x pulled in by a careless `^` | low | the COG reader breaks | exact pin |
| three upgrade temptation (for reversed depth) | low | every custom shader re-tested | stay on r160 for v1 |
| `public/data/` creeping past 40 MB with later boxes at 2048 | low for v1 | the ceiling | boxes at 1024 by default (R1); Ironbottom Sound is the one 2048 |
| the history grows with every re-bake | medium | the repository grows by about 6 MB per table bake | preview before committing; bake the table once |

---

## 9. What I opened, ran and measured

- Repository: `/home/user/vibe-dump/packages/pacific-theatre/` (all 45
  files); `git -C /home/user/vibe-dump archive origin/claude/funny-cannon-vy1pyf
  packages/holo-i-ke-au` into `research/downloads/R9/`; `git ls-tree -r -l
  origin/claude/funny-cannon-vy1pyf dist/holo-i-ke-au` for the built sizes;
  `git show origin/claude/funny-cannon-vy1pyf:.gitignore`.
- three r160.1 source: `node_modules/three/src/renderers/WebGLRenderer.js`
  (lines ~1250–1260 reset `_currentCamera` each render, ~1919–1937 upload
  `projectionMatrix` and `logDepthBufFC`), `renderers/webgl/WebGLProgram.js`
  (lines 145, 634–635, 820–821), `renderers/webgl/WebGLPrograms.js` (16,
  308), `renderers/webgl/WebGLCapabilities.js` (69, 97), the four
  `logdepthbuf_*` chunks, `ShaderChunk/common.glsl.js` (`EPSILON`,
  `isPerspectiveMatrix`); a search for `reverseDepth` (none).
- npm registry (HTTP 200): `geotiff` (versions and dates; 3.x
  `"type": "module"`), `shapefile`, `three`, `subset-font`,
  `@fontsource/noto-sans-jp` (5.3.1, 2026-10-11; not used).
- `https://raw.githubusercontent.com/google/fonts/main/ofl/notosansjp/NotoSansJP%5Bwght%5D.ttf`:
  HTTP 200, 9,589,900 bytes; downloaded to measure the subset, then deleted.
- R1's proof-of-concept `package.json` and `node_modules` (geotiff 2.1.3,
  shapefile 0.6.6) and `curlclient.mjs`.
- `research/r9-scripts/checks.mjs`: float32 steps; float32 integration of
  1/60 s steps at 150 km for 2 kn, 20 kn, 70 m/s and 800 m/s; moon age by
  the Hawaiian `astronomy()` against a mean lunation from the new moon of
  2000-01-06 18:14 UTC (synodic month 29.530588853 d).
- `research/r9-scripts/subset.mjs` with `subset-font` 2.4.0: woff2 sizes
  for 100, 300 and 526 CJK characters at weights 400 and 700 and with the
  weight axis kept. `research/r9-scripts/cjk-sample.txt` holds the 526
  characters (every distinct CJK character in `design/*.md` and
  `research/*.md` as of 08:20).

## 10. Numbers worth keeping beside the contract

| quantity | value |
| --- | --- |
| float32 step at the table's edge (7,085 km) | 0.49 m |
| float32 step at a 400 km box's edge | 1.6 cm |
| float32 integration drift at 150 km, 1/60 s steps | −9.0 % at 2 kn; none moves below 0.9 kn |
| log-depth resolution, far 450 km | ≈ 7.8·10⁻⁷ × distance: 6 mm at 7.7 km, 8 cm at 100 km |
| standard 24-bit depth, near 1 m | ≈ distance² / 1.68·10⁷: 3.5 m at 7.7 km |
| 8-bit normals at `NORMAL_E = 2` | smallest slope ≈ 0.4 %; rebuilt at ×30, steps of ≈ 12 % |
| window on R3's chapters (clamp(len/8, 7, 21) days) | ±21 d in five chapters, about ±19.5 d in two, ±7 d in "the end" |
| moon age, Hawaiian model vs mean lunation | Pearl 29.1 vs 18.5 d; Midway 20.4 vs 20.5; Guadalcanal 5.8 vs 5.9; Samar 15.8 vs 7.5 |
| Noto Sans JP woff2 subset | ≈ 225 bytes a character per static weight; 526 characters ≈ 119 KB |
| Hawaiian `dist/` | 20.3 MB (data 19.1 MB, JS 0.82 MB, fonts 0.2 MB) |

---

## 11. Still needs a person

- **Frame times.** Nothing here was run in a browser: the staged copy does
  not build, and building would write into the repository. The cost of the
  logarithmic depth buffer, the box's draw calls and the table's decode
  time need measuring on SwiftShader and on one integrated GPU (an Intel
  UHD laptop or an Apple M-series) before the depth decision is final.
- **The moon and the sun on the four battle dates.** My moon ages are from
  a mean lunation (±0.6 day), good enough to show the Hawaiian model is
  wrong, not good enough to light a night battle. Someone should check the
  ephemeris that replaces it against an almanac (the US Naval Observatory's
  tables or the Nautical Almanac for 1941–44), especially moonset at
  Ironbottom Sound on the night of 14–15 November 1942.
- **The look of the hand-over.** Whether a half-second cut through haze at
  a matched pose reads as "flying down", or whether the extra cost of a
  real cross-fade is worth it, is a judgement made by watching it.
- **The box edges.** Which coasts the player actually sees from each v1
  moment (Washington's bridge looking south, Johnston's run, a D3A over
  Ford Island) decides the box sizes of E6; that needs the battles' camera
  positions and someone looking.
- **The table's exaggeration curve and the chart-sea palette.** "The trench
  and Fuji should both read" is tuned by eye.
- **The font.** The subset size is measured on the documents' 526
  characters; the final count comes from the final JSON. A reader of
  Japanese should check that the subset renders every name correctly
  (old forms, the kana of ship names).
- **The key bindings on real keyboards and touch screens** once arbitration
  is in: whether Q/E yaw and the camera key collide with browser shortcuts,
  and whether the touch layout works on a phone.
- **geotiff 3.x.** If anyone wants to move off 2.1.3, the curl client must
  be re-proven against it.
