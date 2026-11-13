# Taotie Kit — design system contract

A reusable procedural design system for late-Shang (Anyang, 13th–12th c. BC)
ritual bronze: **relief décor** ("greebling"), **vessel geometry**, and a
**parameterizable patina** material. Everything under `src/kit/` is the kit; it
must never import from `src/artifacts/` or `src/app/`. Artifacts and the app are
consumers.

The kit is organised the way a Shang foundry organised a vessel, because that is
what makes the output read as Shang rather than as "Chinese pattern":

```
Vessel ─ Register (horizontal band) ─ Panel (one mould section, between two flanges)
            └─ Units (taotie mask, kui pair, blade, cicada, whorl, boss …)
                 └─ Ground (leiwen spirals packed into whatever is left over)
```

Relief levels are a fixed vocabulary (heights in mm, scaled per vessel):

| level | name      | what lives there                                            |
| ----- | --------- | ----------------------------------------------------------- |
| L0    | ground    | the vessel wall; leiwen is *sunk into it* as fine grooves   |
| L1    | motif     | flat-topped plateaus (bands of the mask) with steep, slightly rounded shoulders; carries its own incised line work |
| L2    | boss      | domed eyes, horn tips, nipples — rounded, highest 2D relief |
| L3    | sculpture | flanges, animal heads, handles, posts — real geometry, never a height map |

## Units and axes

- **All kit geometry is in millimetres.** Y is up, the vessel stands on y = 0,
  its vertical axis is the Y axis, "front" faces +Z.
- Relief panels are 2D, origin bottom-left, x right, y up, in mm.
- Height values are mm above the ground level (negative = sunk).

## Module map

```
src/kit/
  index.js              public surface — re-exports everything below
  relief/
    panel.js            ReliefPanel: the 2D height-field canvas
    edt.js              exact Euclidean distance transform (Felzenszwalb)
    bake.js             height → normal map, cavity/edge map, THREE textures
    leiwen.js           thunder-pattern ground fill
    shapes.js           the band-ends-in-a-hook vocabulary (Turtle, fillet, curls, hooks, bands) + halfMaskFrame
    motifs/
      taotie.js         the parametric mask (schema, presets, draw) — components in taotie/parts.js, renderer in taotie/render.js
      ground.js         leiwen on its own (atlas entry 'leiwen')
      kui.js cicada.js blade.js whorl.js boss.js bands.js …
      list.js           ONE LINE PER MOTIF, alphabetical: export { default as taotie } from './taotie.js'
      schema.js         motifDefaults(schema)
      index.js          registry: MOTIFS[name] = { draw(panel, rect, params), params schema, presets }
    compose.js          register / panel layout helpers (mirror, repeat, frieze)
  geometry/
    surface.js          ParamSurface → displaced, UV'd BufferGeometry
    lathe.js            profile of revolution with wall thickness
    fang.js             rectangular/square-section bodies (fangding, fangyi)
    flange.js           notched / hooked flange strips along a path
    parts.js            columnar leg, upright loop handle, ring foot, lid, knob, posts
  material/
    patina.js           PatinaMaterial + PATINA_PRESETS + shared uniforms
    noise.glsl.js       3D simplex / worley / fbm chunks
  util/
    rng.js              seeded PRNG (mulberry32) — no Math.random anywhere in the kit
    canvas.js           createCanvas(w, h): the one Canvas2D factory (OffscreenCanvas → <canvas>);
                        setCanvasFactory(fn) swaps it (workers, node-canvas)
```

Status: `util/*`, `relief/{edt,panel,bake}.js`, `geometry/surface.js` and
`material/*` are production. Every other module opens with a `STATUS: first
pass` comment: keep its exported signature, replace the internals.

## relief/panel.js — `ReliefPanel`

```js
const p = new ReliefPanel({ width: 180, height: 120, ppmm: 8, maxSize: 4096, seed: 1 })
// width/height in mm. ppmm is clamped so neither side exceeds maxSize.

p.raise(draw, { height: 1.2, shoulder: 0.5, profile: 'plateau' })
//   draw(ctx) fills paths on a Canvas2D context already scaled to mm, y-up.
//   The filled region becomes a mask → signed distance → profile → max() into the field.
//   profile: 'plateau' (flat top, rounded shoulder of width `shoulder`)
//            'dome'    (rises with distance from the edge to `height`, spherical)
//            'ridge'   (triangular/rounded crest)
p.sink(draw, { depth: 0.5, shoulder: 0.25, profile: 'u' | 'v' })
//   same, but subtracts. Strokes drawn with ctx.lineWidth in mm are the usual input
//   (incised lines, leiwen grooves).
p.add(draw, opts) // additive variant (lines raised on top of a plateau: thread relief)
//   Shoulder defaults: plateau 0.5 mm, sink 0.25 mm; dome / ridge / v default to
//   "all the way to the medial axis" (the deepest inside point of THAT call), so
//   draw domes of different sizes in separate calls, or pass `shoulder` as the radius.
//   The shoulder lies INSIDE the drawn outline: the outline is the footprint at the ground.
//   `profile` may also be a function (s_mm, w_mm) → 0..1; built-ins live in PROFILES.
//   draw() is called once, against a recording proxy (a low-res probe finds the
//   bbox, the recording is replayed full-res into that bbox only). So draw may
//   consume randomness, but must not call setTransform/resetTransform — use
//   save/translate/rotate/scale/restore.
p.mask(draw)      // → { data: Float32Array (cols×rows, row 0 = bottom), cols, rows, ppmm }, field untouched
p.fillGround(leiwenOpts, { avoid: mask | 'raised', margin: 0.6, rect })   // rect defaults to the whole panel
p.mirrorX(rect?)  // copy left half of rect (default: whole panel) onto its right half
p.heightAt(x, y)  // mm
p.bake(opts) → ReliefMap   // snapshot (arrays copied): the panel may keep drawing
// fields: width/height (mm), cols/rows (px), ppmm, field (Float32 mm), groove (Float32 0..1), rng (Rng)
```

`ReliefMap` = `{ width, height, widthMM, heightMM, ppmm, data: Float32Array (mm), min, max }`
plus lazily-built THREE textures:

- `heightTexture` — R: height normalised to 0..1 over `[min,max]` (mip-mapped, linear)
- `normalTexture` — tangent-space normal from the full-res field (Sobel, in mm so slopes are physically right)
- `dataTexture` — **R** height01, **G** cavity (0 deep recess → 1 fully exposed; a wide-blur minus field measure),
  **B** edge/convexity (1 on sharp raised arrises, where wear polishes first), **A** groove mask (1 inside sunk lines — drives inlay paste)
- `macro(sizeMM)` — a low-passed copy for geometric displacement (fine leiwen stays in the normal map):
  `{ cols, rows, data, sample(u, v) }`, cached per size
- also: `sample(u, v)` (mm, bilinear), `channels()` → the four masks as Float32Arrays,
  `setAnisotropy(n)` (static default `ReliefMap.anisotropy`, raised by the app), `dispose()`

Textures are RGBA8 `DataTexture`s, `NoColorSpace`, mip-mapped, clamp-to-edge;
row 0 = panel bottom = v 0, so no flip anywhere. The groove channel is exact,
not inferred: `sink()` records its own coverage.

Rule: **the same ReliefMap drives geometry displacement, the normal map, and the
patina masks.** Corrosion collecting in the leiwen is not painted; it falls out
of the cavity channel.

## relief/leiwen.js

Contour-following packer (research/01 §3). Free region → advancing front of
oriented rectangles (each takes the local wall direction mod 90° where the wall
is straight, else squares up to the frame; grows until it touches its
neighbours; slivers too thin for another cell are absorbed) → one unit per cell:
squared spiral (pitch adapted ±15 % so turns fit), S-/mirror pair (aspect
1.6–3.2), chain (> 3.2), C-hook / stub fillers; thin strips get contour-parallel
grooves instead. All strokes go through ONE `panel.sink` (or `panel.add`).

```js
leiwenFill(panel, region, opts) → { cells, spirals, pairs, fillers, ms, planMs }
// region: { rect?: {x,y,w,h} (default whole panel),
//           avoid?: 'raised' (field > 0.05) | mask {data} | draw(ctx) | null   (default 'raised'; null when `level` is set)
//           include?: mask {data} | draw(ctx)   only fill where coverage ≥ 0.5
//           level?: mm                          only where field ≈ level (a plateau top; skips shoulders and bosses)
//           margin?: mm (0.6)                   clear land between any boundary and the nearest groove EDGE }
leiwenFillMask(panel, include, opts, { rect?, margin = 0.5, level?, avoid = null })
//   secondary fill ON a plateau: include = mask or draw(ctx) of the plateau; level defaults to the
//   most common height under it (the flat top); works on the mask's bbox only. Taotie: call it after raise().
leiwenOptions(opts) → resolved options      LEIWEN_DEFAULTS
panel.fillGround(opts, { avoid, margin, rect }) is leiwenFill on the ground.

opts: { pitch: 1.3,       // mm centre-to-centre (§1.3: 1.0–1.4 on 20–40 cm vessels; ≈ 0.004 × vessel H, 0.8–3)
  line: 0.5,              // groove width / pitch (line ≈ gap)
  cell: 'auto',           // [min, max] mm; auto = [4.2, 7.8] × pitch, typical = middle ±22 %
  turns: 'auto',          // number → caps cell size at (2·turns + 1.2)·pitch
  roundness: 0.15,        // 0 squared 雷纹 (keeps a 0.12 p casting fillet) → 1 round 云纹
  jitter: 0.08,           // vertex jitter (× pitch) and ±1.5° cell skew per 0.08
  mode: 'sunk' | 'thread', depth: 0.4,
  fillers: true,          // C-hooks, stubs, contour lines in slivers
  pairs: 0.75,            // chance a 1.6–3.2 aspect cell is an S/mirror pair (else one long spiral)
  hand: 'alternate' | 'random' | 'left' | 'right',   // neighbours alternate; mirrorX flips the right half
  eyes: 0,                // chance a ≥ 6 p spiral gets an eye ring at its centre
  echo: 0,                // contour-echo grooves around every motif outline before the spirals (1–2 typical)
  follow: 1,              // 0 = all cells squared to the frame, 1 = follow straight walls
  seed: 0 }
```

Atlas presets (`motifs/ground.js`): `fine` (1.0 mm), `standard` (1.3), `monumental`
(2.4 mm, 0.9 deep — Houmuwu scale), `thread-relief`, `cloud` (rounded 云纹), `leftover`
(dummy raised motifs: contour-following ground + echo + secondary fill on the plateau tops).
`ground.leiwenParams(params)` maps the atlas schema (cell sizes in pitches) to leiwen opts.
Cost: a 4096×2048 panel at 60 % free, pitch 1 mm: ~0.9 s planning + ~1.5 s for the one sink.

## relief/motifs — the unit vocabulary

Every motif module default-exports `{ name, label, schema, presets, draw(panel, rect, params), plaque?: { w, h }, symmetric?, ground? }`
(registered by one line in `motifs/list.js`)
where `rect = { x, y, w, h }` in panel mm, and `schema` is a plain object the
Motif Atlas UI can turn into controls: `{ horn: { type: 'enum', options: [...], default }, eyeSize: { type: 'range', min, max, step, default }, … }`.
Shapes are authored as bezier/polyline paths in a **normalised half-mask space**
(x: 0 at the central axis → 1 at the panel edge; y: 0 bottom → 1 top), so a
motif stretches to any panel aspect ratio the way the originals do. `draw`
renders the left half and the panel mirrors it.

`compose.drawMotif(panel, motif, rect, params, { preset, ground, margin })` is
the one call artifacts and the atlas use: resolve params (schema defaults ←
preset ← overrides, `group` params deep-merged) → `draw` (left half) →
leiwen on the left half (`ground: false`, or a motif's `ground: false`, skips
it) → `mirrorX(rect)` (a motif with `symmetric: false` draws the whole rect).
Schema entry types: `range {min,max,step,default,unit?}`, `enum {options,default}`,
`bool {default}`, `group {fields}`; each may carry a `label`.
Registry API: `MOTIFS`, `registerMotif(m)`, `getMotif(name)`, `resolveMotifParams(name, overrides, preset)`.

### relief/shapes.js — primitives for motif authors (research/01 §2.2)

Pure geometry: `[x, y]` arrays in whatever mm frame you draw in; nothing touches a panel.

```js
new Turtle([x, y], headingDeg)          // a band's control polygon, carver-style
  .fwd(mm).turn(deg, filletR).to([x, y], r?).head(deg, r)
  .curl({ dir: ±1, size: a | [a, b], pitch, turns, r })   // inward squared/round spiral
  .spine(step) → dense filleted polyline
fillet(pts, r | [r…], { closed })        // squared-round corners;  resample, trim, subPath, polyLength, normals, headingAt
spline(pts)  arcPts(c, r, a0, a1)  cScroll(c, R, { start, sweep, dir, shrink })
sqSpiral(c, { pitch, turns, dir, rCorner, startHeading })   hookSpine(base, heading, len, { curl, radius, dir })
sScroll(a, b, R)  lens(c, L, H, rot)  wobble(pts, rng, ampMM, wavelengthMM)   // hand-cut irregularity
taper(w0, w1)  tail(w, frac, end)      // width laws t∈[0,1] → mm
band(pts, w | fn, capA, capB)  poly(pts)  circle(c, r)  ellipse(c, rx, ry, rot)  rrect(c, w, h, r, rot)
drawShape(ctx, shape, grow?)  strokeLine(ctx, pts, w)  mapShape(shape, f)
halfMaskFrame(rect, { faceW, spread, reserve, invert, taper })
  // creature space: origin at the bottom of the axis, x OUTWARD (author a right half);
  // { s (face module = min(H, hw/faceW) mm), P(x,y), X, Y, u(v) = v·s, warp, widthAt, toPanel, apply(ctx) }
```
Caps: `'round' | 'flat' | 'square' | 'point'`. Also on the kit surface as `kit.shapes.*`.

### Taotie (research/01 is authoritative)

Layout: anchors are y = fraction of panel height, x = face units (× s × spread); band widths,
eye and curl radii scale with s (slightly more on tall panels). So a 1:2 gu waist stretches,
a 4:1 frieze grows a longer body / more quills; `lineWeight` and `echoInset` stay in mm.

```
style        'relief' (Loehr V) | 'flush' (IV: motif lifted 0.12 mm, outlined by a groove; ground tells it apart)
carving      'dense' (V-a: 2 contour echoes + centre lines) | 'sparse' (V-b: 1 echo) | 'none'
nose         'ridge' (ladder ticks) | 'plain' | 'flange' (narrow plain strip for an L3 flange) | 'stack' | 'none'
nostril      'scroll' | 'bulb' | 'none'          crest  'lozenge' | 'shield' | 'cicada' | 'hooks' | 'none'
eye          'chen' 臣 | 'oval' | 'round' | 'square' (fangyi boss);  eyeSize, eyeX, eyeY;  pupil 'slit' | 'dot' | 'ring' | 'none'
brow         'none' | 'band' | 'hooked' | 'kui' | 'L' (Γ beside the eye, fangyi/gu)
horn         'c' 'ram' 'buffalo' 'bottle' 't' 'kui' 'coiled' 'knob' 'antler' 'crook' 'zigzag' 'leaf' | 'none';  hornSize, hornTip (L2 lift)
ear          'leaf' | 'c' | 'none' (drawn only when there is no body)
jaw          'hooked' | 'double' | 'split' (+ lower jaw) | 'fanged' | 'none';  lipY, mouthCorner, jawTurns
body         'band' | 'kui' (T8 split-body: two profile kui) | 'dissolved' (every part an island, gap ≥ 0.03 s) | 'none'
tail 'up'|'down'|'forked'|'spiral'   leg (bool)   claw 2–3   quills 0–6
edge         'none' | 'scrolls' (corner column of C islands) | 'kui' (vertical kui, head down)
square 0–1 (云纹 → 雷纹 corners)  bandWidth ×  spread ×  taper (−: narrow at bottom, +: at top)  invert (lid)
crown (V-b doming)  irregularity  seed  lineWeight mm  echoInset mm  relief { motif, boss, groove } mm
```
Presets: `T1-classic … T10-blade` (§2.14) and vessel matches `houmuwu-frieze`, `houmuwu-leg`,
`fangyi-body`, `fangyi-lid`, `zun-belly`, `zun-foot`, `gu-waist`, `gu-foot`. `presetPlaques[preset]`
gives the panel size (mm) each was matched at. Booleans from the first-pass schema (`ear`, `crest`,
`quills`) are still accepted.

Hand placement — every component is `taotieParts.<part>(C, opts)` (`nose crest nostril jaw fangs
lowerJaw eye brow horn ear body quills leg kuiHead edge fragments`); opts override params, e.g.
`eye(C, { at: [0.3, 0.48], eye: 'oval', size: 1.2 })`, `horn(C, { horn: 'buffalo', size: 1.2, rootX: 0.2 })`:

```js
const C = kit.taotieContext(panel, rect, kit.resolveMotifParams('taotie', overrides, 'fangyi-body'))
kit.taotieParts.eye(C); kit.taotieParts.horn(C, { horn: 'ram' }); …    // or kit.buildTaotie(C) for the preset's layout
kit.renderTaotie(panel, C)                                              // then fillGround(left half) + mirrorX(rect), as drawMotif does
```

## geometry/surface.js — relief onto 3D

```js
const geo = buildSurface({
  surface: (u, v, out) => …,      // u,v ∈ [0,1] → position in mm (out.pos) and unit outward normal (out.nrm)
  segments: [nu, nv] | { density: 3 },   // density = vertices per mm, capped by maxVerts
  relief: reliefMap | null,       // displaced along the normal by relief.macro()
  reliefRect: { u0, v0, u1, v1 }, // where on the surface the panel sits
  back: { thickness: 4 } | null,  // optional inner wall
})
// geo has position, normal, tangent (vec4), uv (panel UV for the maps)
```

More options: `fade` (mm, default 1.5, or `{ u0, u1, v0, v1 }`) — displacement
ramps to exactly 0 at the reliefRect border, so patches sharing a border curve
are watertight (keep panel edges plain ground for that margin; a full lathe
revolution passes `fade: { u0: 0, u1: 0, … }`); `normals: 'surface' | 'displaced'`;
`maxVerts` (400k); `reliefScale`. `back.rims` lists borders to close (default all four).

**Normals:** the default `'surface'` keeps the smooth, undisplaced surface normal
and lets the full-res normal map carry ALL relief slope; geometry carries only
silhouette and cast shadow. Recomputing normals from the displaced mesh would
count every plateau shoulder twice. `'displaced'` exists for bodies without a map.

**Parametrisation:** u runs left → right seen from outside, v upward, so
dP/du × dP/dv points outward; panel x follows u, panel y follows v. Leave
`out.nrm` untouched to have it derived from the grid (`quadSurface(p00, p10, p01, p11)` does).
Size the panel (mm) to the patch it covers, so the normal map's slopes are real.
The inner wall and rims get uv = (-1, -1), i.e. the panel's corner pixel: keep it plain.

`lathe.js`, `fang.js`, `parts.js` are built on top of this and return
`THREE.Mesh`/`Group` with `.userData.part = '<name>'` so the metrics tool can
measure them. Name parts in the plural the spec files use: `body`, `legs`,
`handles`, `flanges`, `foot`, `lid`.

```js
lathe({ profile: [[r, y] | [r, y, 'corner'], …], material, part, segments, thickness, rims, relief, reliefRect, fade })
latheSurface(profile) / profileCurve(profile)    // u = 0.5 faces +Z
fangBody({ width, depth, height, flare, wall, material, density, panels: { front|back|left|right: { relief, material, reliefRect, fade } } })
  // → Group; userData.walls[name] = { corners: [BL, BR, TL, TR], normal } for placing flanges
flange({ from, to, out, height, thickness, notches: { every, depth, width }, hook, embed, material, part })
columnarLeg({ height, radius, swell, waist, material })   loopHandle({ width, height, bar, thickness, material })
ringFoot({ radius, height, thickness, flare, material })
``` A decorated wall is always: surface patch + ReliefMap + PatinaMaterial.

## material/patina.js

`new PatinaMaterial({ relief: reliefMap | null })` — a `MeshStandardMaterial`
subclass (via `onBeforeCompile`) whose look is driven entirely by **shared
uniforms**, so one slider moves every mesh of a vessel at once:

```js
import { patina, PATINA_PRESETS, setPatina } from './kit'
setPatina(PATINA_PRESETS['excavated-green'])   // or setPatina({ malachite: 0.8 })
```

Parameters (all 0..1 unless noted; `research/02-…` is authoritative for colours):

```
tin            alloy colour: 0 copper-red → 0.5 golden bronze → 1 silvery high-tin
polish         roughness of bare metal
tarnish        thin dark oxide film on the metal
cuprite        red-brown Cu₂O layer under everything
malachite      green carbonate crust        (+ malachiteHue, malachiteScale mm)
azurite        blue carbonate patches
chloride       pale powdery "bronze disease" spots
tinOxide       smooth grey-green/black noble "water patina"
earth          burial soil packed in recesses (+ earthColor)
inlay          black pigment paste in the sunk lines (as-made appearance)
crevice        how strongly corrosion prefers recesses
wear           how far high points are rubbed back to cuprite → metal
patchScale     mm — size of corrosion territories (low-freq 3D noise in object space)
age            master dial: 0 = out of the mould in 1200 BC → 1 = out of the ground in 1939
seed
```

Also exported: `patina` (the shared `{ value }` uniforms), `getPatina()`,
`PATINA_PARAMS` (metadata the drawer is generated from: group, label, min/max/step,
default), `setPatinaMode('beauty' | 'clay' | 'height')` (a shared uniform, no recompile).
Constructor options: `{ relief, cavityAttribute, cavity (constant fallback), normalStrength }`.
Noise runs in **world space, mm** (the app never moves a vessel), so corrosion
territories run continuously across separately built parts, and is faded out
below ~2 px so it never sparkles. Each layer is one GLSL function
(`layerCuprite`, `layerMalachite`, …) returning a coverage from a shared `Surf`
struct. Without a relief map, arrises come from screen-space curvature so flange
and handle edges still wear.

The fragment shader gets: object-space position (mm) for 3D noise, the relief
`dataTexture` (height / cavity / edge / groove) when present, a vertex `cavity`
attribute otherwise, and the normal. Layers stack physically: metal → cuprite →
carbonates → soil; wear removes from the top down; thick crust flattens the
normal map (encrustation softens the line work) and adds its own lumpy bump.

## Artifact contract — `src/artifacts/<id>.js`

```js
export default {
  id: 'houmuwu-ding',
  title: 'Houmuwu Ding', titleZh: '后母戊鼎',
  type: 'fangding', date: 'c. 1200 BC', period: 'Late Shang, Yinxu II',
  findspot: '…', collection: '…', accession: '…',
  dimensions: { h: 1330, w: 1100, d: 790 },        // mm
  blurb: 'two or three sentences for the label',
  defaultPatina: 'excavated-green',
  views: {                                          // named cameras; the ones matching a reference photo carry `ref`
    front: { azimuth: 0, elevation: 4, fov: 28, fit: 1.15, ref: 'front.jpg' },
    …
  },
  async build(kit, { quality = 1, onProgress }) {   // quality 0.5 = fast preview, 1 = default, 2 = hero
    return { object: THREE.Group, parts: { body, legs: [...], handles: [...] }, panels: { name: ReliefMap } }
  },
}
```

- `await onProgress(fraction, label)` both reports and yields to the event loop —
  call it between panels. Target: < 10 s at q = 1 in headless SwiftShader.
- A view may also carry `target: [x, y, z]` (mm); `fit` then frames `fit × R`
  (R = half the bbox diagonal) around it instead of the whole bbox. Azimuth 0 =
  front (+Z), positive turns toward +X; `fit` 1 puts the bbox exactly at the frame edge.
- `order` (optional number) sorts the vessel list; the demo uses 99.
- Registration: one line in `src/artifacts/index.js`, alphabetical:
  `export { default as houmuwuDing } from './houmuwu-ding.js'`.
- Reference material lives in `reference/<id>/`: photos named by each view's `ref`, and `spec.json`.

## Verification hooks (the app must honour these)

URL parameters, read once at boot:

```
?a=<artifact id>     which vessel
&view=<name>         a named camera from artifact.views (default: first)
&patina=<preset>     preset key
&mode=beauty|clay|silhouette|height   clay = neutral grey lit material (relief only); silhouette = white on black, unlit
&ui=0                hide all chrome, no auto-rotate, deterministic
&q=<quality>         build quality
&tab=vessels|atlas
&motif=<name>&preset=<motif preset>   atlas subject (with tab=atlas)
```

`window.__taotie = { ready: Promise, artifacts: [ids], views(id), metrics() }` where
`metrics()` returns, in mm, the overall bounding box and the bounding box of every
`userData.part`. `document.documentElement.dataset.ready = '1'` once the first
frame of a fully built vessel (or, with `tab=atlas`, plaque) is on screen; it
drops to `'0'` while a new subject builds, and reads `'error'` if boot failed.

Tool hooks on the same object (each resolves after a rendered frame):
`show(id, view?)`, `setView(name)`, `setMode(m)`, `setPatina(presetName | values)`,
`showMotif(name, preset?)`, `frame()`; plus `motifs`, `motifPresets(name)`,
`viewRefs(id)`, `atlasStats()`, `timings`, `kit`, `stage`. `metrics()` returns
`{ id, overall: { min, max, w, h, d }, parts: { <part>: { …, count } }, buildMs }`,
`count` being the number of separate part roots (four legs → 4).

Tools (build first: `npm run build --workspace @vibe-dump/taotie-bronze`;
Chromium from `$CHROMIUM_PATH`, else `/opt/pw-browsers/chromium`):

```
npm run shots   -- [--a id] [--view v,…] [--mode beauty,clay] [--patina p,…] [--q 1] [--atlas] [--ui [--phone]] [--out dir]
npm run metrics -- [--a id] [--json]
npm run check                      # vite build + tools/smoke.mjs (every artifact, view, mode, motif preset)
node tools/bench.mjs               # 4096×2048 panel draw + bake timing
```

`tools/shoot.mjs` renders artifact × view × mode to `tools/shots/<id>/<view>-<mode>.png`
(1400×1050, DPR 1, `ui=0`) and, where a view has a `ref`, writes a side-by-side
`compare-<view>.jpg` with the reference photo from `reference/<id>/`.
`tools/metrics.mjs` checks measured proportions against `reference/<id>/spec.json`:
`{ "ratios": { "<name>": { "expr": "parts.legs.h / overall.h", "expected": 0.38, "tol": 0.03 } } }`.
`expr` is never eval'd: a number or a dotted path into `metrics()`, optionally one
operator (`/ * + -`) and a second operand.
