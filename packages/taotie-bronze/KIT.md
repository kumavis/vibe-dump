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
    rounded.js          TRACED vocabulary: fat round-cornered strokes, plates, decorated plateau tops, pillow eyes (§ Rounded bands)
    lozenge.js          lattice grounds: diagonal lozenges / 回 squares, nested · squared · spiral · dot cells (§ Rounded bands)
    motifs/
      taotie.js         the parametric mask (schema, presets, draw) — components in taotie/parts.js, renderer in taotie/render.js
      ground.js         leiwen on its own (atlas entry 'leiwen')
      kui.js cicada.js blade.js whorl.js boss.js bands.js bird.js eyeband.js snake.js silkworm.js scales.js
                        companion motifs (§ Companion motifs); _strokes.js = their Pen/Sheet/renderer
      rounded.js lozenge.js pillow.js   atlas sheets of the traced vocabulary (§ Rounded bands)
      frieze.js         composed friezes & registers as atlas plaques (compose.js demos)
      list.js           ONE LINE PER MOTIF, alphabetical: export { default as taotie } from './taotie.js'
      schema.js         motifDefaults(schema)
      index.js          registry: MOTIFS[name] = { draw(panel, rect, params), params schema, presets }
    compose.js          mould-section layout: drawMotif, frieze, mirrorPair, register, bladeRow, frame, bowstrings
  geometry/
    surface.js          ParamSurface → displaced, UV'd BufferGeometry
    profile.js          Profile: (r, y) outline, arc-length, corners, named registers, bowstrings; measured tables
    lathe.js            vessel body of revolution: sector × register cells, wall, lip, floor, hollow foot, holes
    fang.js             rectangular-section bodies: décor-cell grid, rim, inner skin, floor, notched foot, cast tolerances
    flange.js           flanges along a path (lathe meridian or straight edge): notches, hooks, spurs, incised faces
    heads.js            sculpted animal heads in the round (SDF → surface nets), mounted on a lathe wall
    legs.js             columnLeg (taper, entasis, rings, collar, wrapped relief, hollow, splay), bladeLeg
    handles.js          uprightHandle 立耳 (relief on outer face / edge / root blocks, channel, lean)
    lid.js              hippedLid (four relief slopes, skirt, seat) + roofKnob
    parts.js            legacy columnarLeg / loopHandle, ringFoot; re-exports legs/handles/lid
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
// ReliefPanel.maxSize (static, 4096) is the default maxSize; ReliefPanel.maxSizeCap (static,
// Infinity) caps every panel side even when maxSize is passed — the app sets 2048 on phones.

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
  maxAspect: undefined,   // optional, e.g. 1.3: no long cells; any cell beyond it is cut into near-square spirals
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

### Companion motifs (research/01 §4) — `kui cicada blade whorl boss bands bird eyeband snake silkworm scales`

All draw Style V relief (plateau + contour echo + domed L2 eyes) and share these render params
(`_strokes.reliefSchema`): `style 'relief'|'flush'`, `carving 'dense'|'sparse'|'spirals'` (V-a: echo +
leiwen packed ON the plateau) `|'none'`, `lineWeight`, `echoInset` (mm), `irregularity`, `seed`,
`relief { motif, boss, groove }` (mm). Creatures are authored facing +x in a frame whose height is 1
(the band height), so a longer rect gives a longer body, not a fatter one. Motifs that can turn honour
`facing: 'left'|'right'` (+ `arrangement: 'single'`) — compose.frieze sets these. `symmetric` may be a
function of the params; `groundOptions(p, rect)` gives default leiwen opts (pitch scaled to the band).

```
kui      arrangement 'pair' (two meeting at the centre line; mirrored) | 'single' + facing
         orient 'horizontal' | 'up' | 'down' (vertical K5 kui, head up/down)    head 'gaping' | 'beaked' | 'trunked'
         turned (回首, head looks back)  tail 'up' | 'down' | 'forked' (歧尾)  crest 't' | 'bottle' | 'hook' | 'none'
         eye 'round' | 'square' | 'chen', pupil 'dot' | 'slit' | 'none', eyeSize   quills 0–4  leg
         bandWidth (× H, 0.23)  square  marks 'none' | 'c-marks'  centreGap mm
         presets k1-tail-up k2-tail-down k3-trunked k4-beaked carved-plateau turned-back single
                 vertical-head-up forked flush fangyi-band houmuwu
cicada   orient 'right'|'left'|'up'|'down' (head toward)  length (2–4 : 1)  chevrons  eyeSize  legs  concave
         presets standard row-unit blade-fill slender flush
blade    direction 'rising' | 'hanging'  shape 'triangle' | 'ogive'  concave  border 'band' | 'lines' | 'none'
         borderLines  borderWidth mm  fill 'mask' (stretched T10) | 'cicada' | 'leiwen'  maskHeight  eye  pupil
         pitch mm  leiwenTop (above it only nested contour lines — the Met gu)   ground: false (fills itself)
         presets rising-mask hanging-mask rising-cicada leiwen-only gu-trumpet zun-neck;  blade.outline(ctx, rect, p)
whorl    kind 'whorl' | 'petal' (四瓣目纹)  spokes 3–7  turn 'ccw'|'cw'  sweep °  size  centre 'circle'|'boss'|'ring'  dome
         presets five-spokes four-spokes six-spokes post-cap petal flush        (rotational: symmetric false)
boss     layout 'lattice' (乳钉雷纹) | 'grid' (fangding U-frame) | 'row' | 'single'  side mm  angle °  lines 'double'|'single'
         ridge ridgeHeight nipple nippleHeight (mm)  shape 'pointed' | 'dome'  rows
         presets lattice single-lines gui-belly fangding-frame row single;  boss.nipples(panel, [[x,y]…], p)
bands    kind 'bowstrings' | 'border' | 'step'  count width height spacing (mm)  profile 'round'|'flat'  vertical
         presets two-bowstrings three-bowstrings single-bowstring monumental gu-waist border step
bird     arrangement 'pair' | 'single' + facing  crest 'hook'|'t'|'none'  tail 'hook'|'fork'  eye  length  bandWidth
eyeband  eyes (count)  eye 'chen'|'round'  eyeSize  slope °  rib          (目雷纹, symmetric by construction)
snake    form 'sinuous' | 'coiled'  facing waves amplitude bandWidth marks 'c-hooks'|'scales'|'none'
silkworm facing segments bend girth          scales  scale mm  open 'down'|'up'  body (bool)
```
`presetPlaques[preset]` (mm) on each module = the panel size a preset was matched at. Hand-building a new
creature: `kit.companions` exposes `makeFrame(rect, { rot, flip })`, `Pen` (fd / arc / to / spiral / curl),
`Sheet` (band / taper / poly / circle / rrect / boss / line / groundLine) and `renderSheet(panel, sheet, p, { clip })`;
`buildKui(S, A, p)`, `buildCicada`, `buildBird` are exported from their modules.

### Rounded bands — the traced vocabulary (relief/rounded.js, relief/lozenge.js; research/04)

The older strokes tie a band's outer corner to its inner one (R ± w/2) and read as squared typography.
On the bronzes a horn, brow or body is a FAT flat-topped plateau: outer corners round (≈ 0.4–0.6 × band
width), inner corners nearly square (≈ 0.1–0.2 ×), width swelling and tapering, ends blunt-rounded,
pointed or rolled; and its top is drawn on (sunk contour line, chain of spirals, lines, scales, leiwen,
ticks in the margin). Draw these by TRACING: read control points in mm off a flattened face
(§ Flat faces) — recipe and worked example in research/04 § How to trace a face. All mm, panel frame, y up.

```js
const band = kit.roundStroke(ctrl, opts)      // a band along a centre line through control points (corners sharp)
const block = kit.roundPlate({ c, w, h, r | round, rot, …deco })   // rounded-rectangle block (curl block, eye surround)
const blob = kit.roundPoly(pts, { round: mm | [per vertex], …deco })  // any traced closed outline
kit.carve(panel, [band, block, …], opts) → { spirals: [{ c, r }], grooves, ms }   // raise the union + cut every top in ONE sink
kit.pillowBoss(panel, opts)                   // the convex pillow eye with slit pupil (writes the field directly, max)
kit.lozengeFill(panel, region, opts) → { cells, clipped, ms }   // lattice ground; region as leiwenFill
kit.elementContour(el, inset) → closed polyline   kit.paintElements(els, grow) → draw(ctx)   kit.pillowOutline(o)
```

**roundStroke(ctrl, opts)** — `ctrl` [[x, y]…] the band's centre line. `width`: mm | [mm per control
point] | t → mm (swell / taper; linear between control points). `round` (0.5) OUTER corner radius ×
local width, `inner` (0.15) INNER corner radius × width — numbers or per-vertex arrays (0 = square,
1 = a full round of one band width). `start` / `end`: `'blunt'` (default; flat end, corners
`capRound` × w, 0.3) | `'flat'` | `'round'` | `'point'` (pinches the end width to 0) | `'spiral'` (the
centre line rolls on into an Archimedean coil). `spiral` / `startSpiral`: `{ turns 1.25, gap mm
(0.16 w: the sunk gap between turns), dir +1 rolls to the left of travel / −1 right, taper (end width ×),
R (first radius, mm) }`. A stroke may carry its own `contour`, `fill`, `ticks` (they override carve's).
To hold a value (width, inset) along a whole segment, add a collinear control point (no corner there).
```js
const horn = kit.roundStroke([[50, 58], [50, 83], [17, 83], [17, 63], [23, 63]], { width: [9.4, 11, 10.4, 6.4, 6.4],
  round: 0.5, inner: 0.18, end: 'flat', contour: { inset: [0.6, 2.5], line: 0.5 }, ticks: { side: 'right', pitch: 4.2 },
  fill: { kind: 'spirals', line: 0.5, pitch: 0.95, gap: 0.3, square: 0.3, tail: false, min: 3.6 } })
```

**carve(panel, elements, opts)** — `height` (1.2 mm plateau), `shoulder` (height × 0.35; pass ≈ w/2 for
a domed, rounded-section band — the Nezu horns), `depth` (0.35 mm grooves), `irregularity` (hand wobble
±0.05 mm per unit), `seed`, `raise: false` (decorate tops raised elsewhere). Decoration, per element
or for all:
- `contour: { inset: mm | [left, right] (each a number or per-control-point array), line: mm } | false` —
  the thin sunk line inside the edge (left/right of the direction of travel: a C drawn
  counter-clockwise has its INSIDE on the left).
- `fill: { kind, line, pitch, gap, … }`: `'spirals'` (a chain of round spirals along the band, evenly
  spread and as big as the band allows, then largest-first into corners and swells; `size`/`min` Ø mm,
  `pitch` line spacing, `gap` land between neighbours, `square` 0…1 rounded-square spirals, `tail`
  `'merge'` (the outer turn leaves the contour) | `'radial'` | false, `hand` 'left'|'right'|alternate,
  `lead`, `chain: false`, `joints: true` = a cross line between consecutive spirals: the jointed kui body)
  · `'lines'` (parallel to the centre line, `pitch`; on a rolled end they follow the coil)
  · `'coil'` (plates: a concentric squared-round spiral, `pitch`, `offset` [dx, dy] of its centre, `rings`, `hand`)
  · `'scales'` (staggered arches along the band, `pitch`) · `'leiwen'` (leiwenFillMask inside the contour: `pitch`,
  `lineFrac`, `margin`, `leiwen: {…}` extra opts) · `'none'`.
- `ticks: { side: 'left' | 'right' | 'both' | 'outer', pitch, line, length (default: to the contour), skipEnds }` —
  the short cross notches in the outer margin (Met fangyi horns).
```js
const tail = kit.roundStroke([[58, 16], [24, 16]], { width: 8, end: 'spiral', spiral: { turns: 0.9, dir: -1, R: 6.6 } })
kit.carve(panel, [tail], { height: 1.2, contour: { inset: 0.8, line: 0.45 },
  fill: { kind: 'spirals', line: 0.45, pitch: 0.9, joints: true } })     // a jointed kui body ending in a rolled tail
```

**pillowBoss(panel, opts)** — `c`, `w`, `h` (mm), `round` (0.45; superellipse 0 ≈ square … 1 ellipse),
`height` (2 mm), `crown` (0.5; 0 flat top … 1 fully domed), `base` (mm or `'field'`: sit on what is
there, e.g. a plateau), `rot` (deg), `tilt`, `slit: { len (0.32 w), width, depth, rot, offset: [dx, dy] } |
false`, `ring: { gap, line, depth } | false` (a sunk ring round it). Draw it after carve() so the
ground packer avoids it.
```js
kit.pillowBoss(panel, { c: [45.1, 36.5], w: 14.4, h: 13.5, round: 0.42, height: 2.4, crown: 0.9,
  slit: { len: 4.8, width: 0.95, depth: 0.7, offset: [-0.5, -0.9] } })   // Met fangyi main-mask eye
kit.leiwenFill(panel, { margin: 0.5 }, { pitch: 0.72, cell: [6, 11], pairs: 0, maxAspect: 1.35 })   // its big-cell ground
```

**lozengeFill(panel, region, opts)** — `region` exactly as leiwenFill (`rect`, `avoid` 'raised' | mask |
draw, `include`, `level`, `margin`). A regular lattice laid over the field and cut off by the motif.
opts (`LOZENGE_DEFAULTS`): `lattice` 'diagonal' (lozenges, diagonals along x / y) | 'square' (回);
`size` mm or [w, h] (lozenge diagonals / square sides); `fill` 'nested' (concentric rings, mitred — they
line up into diagonals) | 'squared' (a squared spiral in the cell's frame) | 'spiral' (round spiral) |
'dot' | 'plain'; `pitch` (0.9 mm), `line` (0.48 × pitch), `depth`, `outline` (lattice lines), `levels` (2:
a cell the motif cuts is halved into 4, this deep), `clip` (last-level cut cells are cut off at the margin,
else left plain), `minFree`, `roundness`, `jitter`, `offset` [dx, dy] (lattice phase), `mode` 'sunk' | 'thread', `seed`.
```js
kit.lozengeFill(panel, { rect, margin: 0.6 }, { size: 19, fill: 'nested', pitch: 1.0, levels: 1 })   // Met gui lower field
kit.lozengeFill(panel, { rect }, { size: [9, 7], fill: 'spiral', levels: 0 })                       // lozenge-and-spiral
kit.lozengeFill(panel, { rect }, { lattice: 'square', size: 9, fill: 'squared', pitch: 0.75 })      // 回 lattice
```

Atlas: `rounded` (presets `met-fangyi-horn` and `met-fangyi-eye` — tracings of face-long-main at 1:1 in its
face mm, data in `MET_FANGYI_HORN` / `MET_FANGYI_EYE`; `shapes` C · G · S · J · pointed hook; `fills` one C
band cut five ways; `met-fangding-band`, by eye), `lozenge` (`met-gui-nested lozenge-spiral lozenge-dot
lozenge-nested-fine square-squared square-nested`), `pillow` (`met-fangyi met-fangyi-kui met-gui
met-fangding ringed`).

**Cost.** carve = one `raise` + one `sink` for ALL contour / spiral / line / scale / tick grooves of the
call (+ one leiwenFillMask per element with `fill.kind 'leiwen'`) — no more per-pixel work than a
companion motif's renderSheet. Planning is vector work on the outlines: the Met fangyi horn ≈ 0.1 s;
a 300 × 50 mm Houmuwu-scale band with 53 spirals ≈ 0.3 s (+ 0.5–0.7 s for its raise and sink on a
2040 × 720 panel). pillowBoss writes its bbox only (4 samples / px). lozengeFill: one ≈ 0.2 mm planning
grid (as leiwen) + one sink; a 340 × 120 mm panel at 6 px/mm ≈ 0.4 s. No texture-size cost: every unit
renders at whatever ppmm the panel has (phones: 2048 cap).

## relief/compose.js — laying out a mould section

All rects in panel mm. Every helper draws the LEFT half and mirrors where the Shang rule says so.

```js
drawMotif(panel, motif, rect, params?, { preset, ground: leiwenOpts | false, margin: 0.6 })   // one unit (see above)
frieze(panel, rect, { unit: 'kui' | spec | [spec…] (cycled, e.g. ['whorl','kui']), count: 2,
                      facing: 'centre' | 'left' | 'right', gap: mm, centre: spec | null,   // middle slot if count is odd
                      params, preset, ground: leiwenOpts | false, margin })  → { slots }
  // spec = 'kui' | { motif, params?, preset?, w? (mm, or fraction of the band if ≤ 1) }
  // 'centre': left-half units face right, ground on the left half, mirror. A rotational centre unit
  // (whorl) is redrawn after the mirror. Legacy frieze(panel, rect, motif, count, params, opts) still works.
mirrorPair(panel, rect, unit = 'kui', opts)            // frieze with count 2, facing the centre
register(panel, rect, rows, { separator, edges: false, inset: 0.8, ground })  → { rows: [rect], byName }
  // rows TOP → BOTTOM: { name?, h? mm | weight? (share of the rest), and one of motif/params/preset,
  //   frieze: {…}, blades: {…}, draw(panel, rect), plain: true;  sep?: separator below this row }
  // separator { kind: 'bowstrings', count, width, height, spacing } | { kind: 'line' } | { kind: 'plain', h } | { kind: 'none' }
bladeRow(panel, rect, { count: 4, direction: 'rising' | 'hanging', gap, params, preset, between: 'plain' | 'leiwen' })
frame(panel, rect, { width: mm | { t, b, l, r }, top: friezeOpts | 'plain' | 'bosses', bottom, sides: 'kui' | 'bosses' | 'plain',
                     sideHeads: 'down' | 'up', line: true, params, preset, bosses: { radius, height, spacing, rows } })  → inner rect
bowstrings(panel, rect, { count: 2, width: 1.5, height: 0.8, spacing, profile: 'ridge' | 'plateau', vertical })
bossField(panel, rect, { radius, height, spacing, rows })   registers(rect, [{ name, h }])  inset(rect, m)
bossRow(panel, a, b, { count, radius, height })   borderLine(panel, rect, { width, height, sides: 'tblr' })
```
Example — a zun neck/belly wall section (one mould sector, flange on its centre line):
```js
const R = kit.register(panel, rect, [
  { weight: 0.2, frieze: { unit: 'kui', count: 2, facing: 'centre' } },
  { weight: 0.62, motif: 'taotie', preset: 'T1-classic' },
  { weight: 0.18, frieze: { unit: 'bird', count: 4, gap: 2 } },
], { separator: { kind: 'bowstrings', count: 2, width: 1.4, spacing: 3.6 } })
```
The `frieze` atlas motif shows these as presets: `kui-frieze bird-frieze cicada-row whorl-kui eye-band
neck-belly blade-row houmuwu-wall boss-belly fangyi-face` (sizes in its `presetPlaques`).

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

More options: `samples: { u: [...], v: [...] }` (explicit, sorted, non-uniform parameter values in [0,1] —
lathe.js shares one θ column set across patches this way); `fade` (mm, default 1.5, or `{ u0, u1, v0, v1 }`) — displacement
ramps to exactly 0 at the reliefRect border, so patches sharing a border curve
are watertight (keep panel edges plain ground for that margin; a full lathe
revolution passes `fade: { u0: 0, u1: 0, … }`); `normals: 'surface' | 'displaced'`;
`maxVerts` (400k); `reliefScale`. `back.rims` lists borders to close (default all four).
`panelMap(u, v, out)` (optional): a non-linear surface → panel map; `out = [pu, pv, weight]` arrives
holding the reliefRect mapping, overwrite it (weight multiplies displacement — a fade along a slanted
edge). fang/lid/handles use it for 1:1 ("true") panels on trapezoids, triangles and arches.

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
lathe({ profile, … })        // see § Bodies of revolution; the legacy single-Mesh call still works:
lathe({ profile: [[r, y] | [r, y, 'corner'], …], material, part, segments, thickness, rims, relief, reliefRect, fade })
latheSurface(profile) / profileCurve(profile)    // u = 0.5 faces +Z
fangBody({…}) columnLeg({…}) uprightHandle({…}) hippedLid({…}) roofKnob({…})   // see § Box bodies and parts
flange({ from, to, out, height, thickness, notches: { every, depth, width }, hook, embed, material, part })   // + path, ends … (§ Bodies of revolution)
columnarLeg({ height, radius, swell, waist, material })   loopHandle({ width, height, bar, thickness, material })   // legacy
ringFoot({ radius, height, thickness, flare, material })
``` A decorated wall is always: surface patch + ReliefMap + PatinaMaterial.

## Bodies of revolution, flanges, heads — profile.js, lathe.js, flange.js, heads.js (research/03 §1, §3–6)

All mm, Y up, ground y = 0, azimuth θ in DEGREES: 0 = front (+Z), positive toward +X.

```js
const P = new Profile(points, { registers, ridges, mode: 'spline' | 'polyline', smooth, step: 0.15 })
//   points bottom → top on the OUTER surface: [r, y] | [r, y, 'C'|'corner'|'S'|'L'] | [r, y, join, 'label'] | {r, y, join, name}
//   'C' = carination: crease + split normals + band break; others: centripetal Catmull-Rom.
//   registers { name: [y0, y1] | {y0, y1} | {s0, s1} | {from: label|y, to: label|y} }   (stored as arc ranges)
//   ridges [{ y | s, count, width, height, spacing, shape: 'round'|'flat'|'v'|'step' }]   bowstrings 弦纹 as real outline
P.at(s, side?) → { s, r, y, nr, ny, tr, ty }   P.length   P.sAtY(y, { from: 'bottom'|'top' })   P.rAtY(y)
P.register(name)  P.setRegister(name, spec)  P.addRidges(spec)  P.breaks()  P.samples(s0, s1, { maxAngle, maxLen })
P.offset(d | (s, y) => d, { smooth }) → [[r, y, s]…] inward core   P.scaled(k)   P.points   P.bounds { yMin, yMax, rMax }
profile(points | Profile, opts)          // pass-through helper
profileFromTable([[r_mm, y_mm], …], { scale, height, flipY, corners: 'auto' | [indices], cornerAngle: 32, window: 2.5, smooth: 0.8, ground: true })
//   dense measured silhouettes (either direction): auto corners, Gaussian smoothing between them, polyline mode
```

```js
const body = lathe({
  profile,                         // Profile or points
  sectors: 4 | { count, center } | { bounds: [deg…] },   // default mould sectors; sector k centred at center + k·360/count
  registers: { name: { y0,y1 | s0,s1 | from,to | (omit: a register named on the Profile),
                       sectors?, relief?: ReliefMap | ReliefMap[] | (sectorIndex, size) => ReliefMap | null, fade?, material?,
                       map?: 'true' (panel laid 1:1 in developed mm from the sector centre line, not angle-linearly), mapWidth?: mm (panel width for 'true'; default the widest arc) } },
  wall: 3 | (s, y) => mm,          lip: { thickness: 1.6·wall, length, shape: 'round'|'flat', bulge },
  floor: { y, thickness, dome } | null (inner floor; default: flat base for r0 > 0, follow the profile for round bottoms),
  foot: { wall, hollow: true },    holes: [{ shape: 'cross'|'rect', azimuth, y, arm, width, w, h }],
  tolerance: { seed, ovality: 0.005–0.015, rim: 0.003–0.01 (p-p fraction of H), lean: deg },   // §5, foot stays on y = 0
  oval: 1 (major:minor plan ratio, you/hu: Z = X / oval), ridges, density: 1 (verts/mm on decorated cells), quality, chord: 0.05, fade: 1.5,
  material, interiorMaterial, materialFor: (relief, register) => Material, part: 'body' })
// → Group (userData.part), children by role: outer (plain cells merged), panel:<register> (one mesh per distinct
//   ReliefMap — return the SAME map for identical sectors), lip, inner, foot-inner, foot-ring | base, holes.
// Plain cells stay cheap (adaptive rows); every cell shares one θ column set and its band-edge rows: watertight.
```
`size` (the relief callback's 2nd argument, also `body.userData.lathe.registers[name].sectors[k]`):
`{ register, sector, sectors, theta0, theta1, center (deg), width (mm at mid-arc), height (arc mm), widthTop,
widthBottom, rTop, rBottom, rMid, widthAt(yArc), toPanel([x, y], W = width), fromPanel([px, py], W), map(pts, W) }`.
Panels map ANGLE-linearly: on a flaring register the panel is a fan (stretched by `widthAt(y) / width`, as Shang
blades widen with the trumpet). To draw something at TRUE size — straight-sided blades of a given true taper, a
round boss that stays round — author it in developed-surface mm (x from the sector centre line) and pass the
points through `size.toPanel` (or `kit.shapes.mapShape(shape, size.toPanel)`).

`body.userData.lathe` (LatheInfo): `{ profile, height, length, registers, sectors, floorY, wallAt(s), deform(v),
frame(thetaDeg, s, side?) → { p, n (out), d (up the wall), b (= d × n), r, y }, sAtY(y), range(spec) → [s0, s1],
meridian(thetaDeg, rangeSpec) → path }`. Frames include the cast deformation.

```js
flange({ path | from,to,out, height: mm | (f ∈ [0,1]) => mm, thickness, embed, taper: 3 (deg), bevel, waver: 0.5, seed,
         notches: { shape: 'square'|'score'|'T'|'L'|'hook'|'none', pitch (alias every), depth (× height), width (mm), pattern,
                    rungs: 'full' (score: rungs run crest → root, no crest line), groove: { width, depth } (mm, face incisions) },
         ends: { start, end },   // 'square' | 'taper' | { type: 'step'|'hook'|'spur'|'beak'|'taper', length, height, sweep, under }
         hook (legacy ≡ ends.end beak), incise: 'auto', material, part: 'flanges',
         outline: [[σ, t]…] (optional measured silhouette, CCW, root at t = −embed; replaces notches/ends), grooves, grooveStyle: { width, depth } (mm, their incision) }) → Mesh
//   'score' = the dense ladder (Met gu 1985.214.4); 'T'/'L' = F1 notches + scored faces; 'hook' = F2 beaks.
//   'step' overhangs the register end (gu drum); 'spur' curls out (gu foot); 'hook' rises past a rim.
//   Integer number of full segments per span; incised grooves → ReliefMap on both faces (incise needs a PatinaMaterial).
latheFlanges(body, { azimuths: [deg…], ranges: [register | {y0,y1} | {s0,s1} | { range, …overrides }], gap: 1.5, seed, …flangeOpts })
//   one flange per azimuth × range, following the wall, broken at register boundaries → Mesh[] (add them yourself)
flangeOutline(opts) → { points (CCW, σ along path, t outward), grooves, segments }   edgePath(from, to, out) → path
```

```js
animalHead({ kind: 'bovine'|'ram'|'buffalo'|'tiger', width (face mm), projection (× width), droop (deg), hornSize, hornCurl,
             eyeSize, ears, embed (mm), seed, quality, material, part: 'heads' }) → Mesh   // local +Z out of the wall, +Y up
mountOnLathe(body, head, { azimuth, y | s, pitch (deg, + = down), follow (0 radial … 1 wall normal), lift })
headSDF(params) / meshSDF(sdf, { voxel, clipZ })   // the field and the surface-nets mesher, for other sculpture
```
A head on a sloping shoulder: `follow: 1, pitch: 0` lays the horns on the wall; `droop` points the snout out and down.
Worked examples: `src/artifacts/met-gu.js` and `src/artifacts/met-zun.js`.

## Box bodies and parts — fang.js, legs.js, handles.js, lid.js (research/03 §1.1, §1.10, §3, §5, §6)

All mm, Y up, front +Z. Every part with relief slots has a `…Layout(opts)` twin that returns the panel
sizes (mm) BEFORE building, so panels are authored 1:1: lay out → bake panels (with onProgress between)
→ build. A relief slot takes a `ReliefMap` or `{ relief, material?, fade?, density?, map? }`; the
material defaults to a cached `PatinaMaterial({ relief })`. Side keys everywhere: `front | right | back |
left`, falling back to `long` (front/back) / `short` (left/right) / `all`. Seen from outside, panel x
runs left → right, y up (lids: eave at y = 0).

```js
const L = kit.fangLayout(opts)            // L.sides.front.cells[row][col] = { w, h, wMax, wBottom, wTop, outline, s0, s1, y0, y1 }
                                          // L.foot.sides.front = { w, h, notch: { w, h, outline }, panelOutline }
kit.fangBody({
  width, depth, height,                   // outer wall at the bottom (or at the top with at: 'top'); height = underside → wall top
  at: 'bottom'|'top', taper: deg | { x, z },   // walls lean out (+) going up; or top: { width, depth }; legacy flare
  bulge: mm | { x, z }, bulgeAt: 0.5, profile: (t) => ({ dx, dz }),   // belly; extra outline offset by height fraction
  cornerRadius: 0,                        // 0 = sharp arris (flanged Anyang); > 0 = rounded corners on their own patches
  wall: 8, innerRadius: wall/2, floor: { thickness, round },     // inner skin = plain offset; floor + fillet
  rim: { kind: 'slab' | 'plain' | false, height, overhang, inner, round },   // slab = thick everted ledge (fangding)
  grid: { rows: [mm | { weight }…] TOP→BOTTOM, cols: [mm at mid height | { weight }…] } | { long: {…}, short: {…} },
  cells: { long: [[spec…] per row], short: … },   // null = plain (cheap); spec.map: 'stretch' (default) | 'true'
  relief: (cell) => spec,                 // or a callback per cell
  foot: { height, inset, flare, thickness, cornerRadius,  // ring foot below the body (the body then starts at foot.height)
          notch: { width: mm | ≤1 frac, height: mm | ≤1 frac, shape: 'arch' | 'rect', spring, round } | { long: …, short: … },
          relief: { long: spec, short: spec } },   // one 'true' panel per foot side; faded around the notch
  cast: true | { seed, sag: 0.003 (× face span), rim: mm p-p, wave: mm, waveLength: mm, skew: deg },
  material, interiorMaterial, density: 1 (verts/mm on décor cells), plainDensity: 0.06, panels (legacy 1 cell/side),
}) → Group (part 'body'; foot = child Group part 'foot')
```
Cells: `'stretch'` panel = `cell.w × cell.h` (face width at the cell's mid height; stretched on a taper,
as Shang carvers did); `'true'` panel = `cell.wMax × cell.h`, mapped 1:1 in mm, the trapezoid is
`cell.outline` (panel mm) and displacement fades along its slanted sides. Rows are physical mm along the
wall (h = arc length). Keep 1.5 mm of plain ground at cell borders (watertight seams).
`userData`: `walls[side] = { corners: [BL, BR, TL, TR], normal, axis: [bottom, top], registers: [[y0, y1]] (group y),
columns, cells }`, `corners['front-right' | 'right-back' | 'back-left' | 'left-front'] = { bottom, top, out }`
(arris line), `rim = { kind, y (rim top), wallTop, outer {a, b}, inner {a, b} }`, `floorY`, `footHeight`,
`at(side, s, y, d = 0)` (point on the base wall, d mm outward), `rimTop(side, s, f)` (f 0 = outer edge → 1 inner),
`legSeat(corner, inset)`, `layout`; foot: `corners`, `axes[side] = { bottom (notch top), top, normal }`.
All points include the cast deformation (in the group frame) — flanges placed from them sit on the wall.

```js
kit.columnLeg({ height, radius, taper: 0, entasis: 0.04, entasisAt: 0.7,
  foot: { swell, height, step }, top: { flare, height }, collar: { from, to?, amount, shoulder },
  rings: { count, at, width, spacing, height, soft },                // bowstrings (y ≤ 1 = fraction; soft: worn cosine rib, no undercut)
  relief: { map, zone: [y0, y1] mm, arc: 180°, facing: deg (0 = +Z, 90 = +X), fade, material },
  hollow: { wall, open: 'bottom' | 'none' }, flange: { …kit.flange opts },   // flange on the facing axis
  splay: { angle, toward: [x, z] }, cast: { seed, splay: ±deg, length: ±frac, twist: ±deg }, embed: 8 })
  → Group 'legs' standing on y = 0 (position it); userData { radius(y), axis: { bottom, top, out }, panel }
kit.legPanelSize({ …same opts, zone, arc }) → { w, h, rMid }   kit.legRadius(opts) → r(y)
kit.bladeLeg({ height, chord, thickness, tipChord, outCurve, splay })   // jue/jia; first pass
kit.uprightHandle({ width, height (above the rim), bar, barTop, depth, radius, aperture: { radius },
  lean: deg, channel: { width, depth }, embed, root: { width, height, rise, outset, inset },
  faces: { outer, edge, back, root }, cast: { seed, lean, height } })
  → Group 'handles' in its own frame: arch in XY, rim top y = 0, OUTER face +Z (rotate +Z away from the vessel)
kit.handleLayout(opts) → { outer: { w, h, outline: { outer, inner } }, edge: { w (unrolled length), h }, root: { w, h } }
kit.hippedLid({ width, depth (eave line), rise | slope, ridge (≤ 1 frac | mm), concave: 0…0.4,
  skirt: { height, overhang, fascia }, thickness, seat: { depth, clearance, thickness },
  faces: { long, short }, knob: { …roofKnob opts } })
  → Group 'lid' standing on y = 0 (put it at body.userData.rim.y); userData { hips: [pts]×4, midlines[side], ridge, top, knob }
kit.hippedLidLayout(opts) → { faces[side] = { w, h, outline, shape }, rise, top, ridge }
kit.roofKnob({ width, depth, rise | slope, ridge, concave, skirt, post: { height, width, depth, waist }, faces })
```
Flanges along lid hips / leg axes / corners currently use the straight `flange()`; curved
(concave hip, bulged corner) anchors are returned as polylines for the path flange when it lands.

## material/patina.js

`new PatinaMaterial({ relief: reliefMap | null })` — a `MeshStandardMaterial`
subclass (via `onBeforeCompile`) whose look is driven entirely by **shared
uniforms**, so one slider moves every mesh of a vessel at once:

```js
import { patina, PATINA_PRESETS, setPatina } from './kit'
setPatina(PATINA_PRESETS['excavated-green'])   // or setPatina({ malachite: 0.8 })
```

Parameters (all 0..1 unless noted; `research/02-…` is authoritative for colours).
Groups `Alloy` / `Carbonates & blue` / `Other corrosion` / `Surface` (the drawer is generated
from `PATINA_PARAMS`; entries with `key: true` are also shown open under "Main"):

```
age            master dial: 0 = out of the mould in 1200 BC → 1 = out of the ground in 1939.
               Layers arrive in order: tarnish → cuprite → noble sheet → carbonates → azurite /
               blue-green phase / chlorides / soil / lime / streaks. Every preset is its look AT age 1.
Alloy      tin 0–0.30 (Sn wt; F0 from the research table, 0.12 ≈ Houmuwu warm gold) · lead 0–0.25
           (greys / dulls) · polish (relief tops 0.40 → 0.12 roughness; recesses stay as-cast 0.47)
           · tarnish (gold → brown-gold film)
Carbonates malachite (carbonate crust amount) · carbonate (BALANCE: 0 malachite green · 0.5 the pale
 & blue    blue-green chrysocolla-like phase · 1 azurite blue — moves AREA between separate minerals
           per territory, never a hue-rotate / teal blend) · azurite 0–0.6 (islands) · azuriteDepth
           (pale powdery sky → deep crystalline ultramarine; also roughness/F0) · azuriteScale mm ·
           blueHabitat (0 recess / groove-bound → 1 open crust patches; applies to both blue phases)
           · turquoiseTone (the blue-green phase: pale chalky → deep) · malachiteHue (blue-green →
           yellow-green) · malachiteTone (dark compact → pale earthy) · islands (0 thin translucent
           films → 1 sharp-edged crust islands) · malachiteScale mm (botryoid size) · crust mm
           (thickness: flattens the relief normal map, adds lumps)
Other      tinOxide (Type I noble skin; no bare metal is left under it) + tinOxideTone 0–2 (black
           黑漆古 · olive · grey 水银古) · nobleWarmth (olive-green → warm grey-brown skin) · cuprite (liver/oxblood, F0 0.18; outside the noble sheet it
           shows veiled warm brown) + cupriteTone (0 liver · 1 pale powdery brick-pink, unveiled: Houmuwu)
           · chloride (pale pustules over pits, dark ring) · soot · crevice
           · patchScale mm (territories, domain-warped) · mottleScale mm · patchiness (1 broad
           territories / crust islands · 0 every layer breaks up at the mottle size: fine speckle, no blotches)
           · softness (0 crisp layer edges · 1 every cover edge feathers, the grain and its glints drop to a
           whisper and the cell-id territory kind becomes a continuous field: low-contrast mottle, no dots)
           · drift (slow lightness / warmth drift at the territory size, 50–200 mm) · nobleRelief (−1..1,
           default 1: how much paler the noble skin is on raised décor; −1 darker plateaus) · lowerBody +
           lowerHeight + lowerColor (skin below that fraction of the height multiplied by the tint: green-grey
           legs, a warm foot band) · rimCalm (above ~60 % of the height, plain parts and up-facing faces lose
           the wall mottle; plain parts anywhere also lose the fine speckle)
Grain &    speckle + speckleScale/Color/Decor (mm-scale stipple of a second mineral) · crustIsles +
crust      crustScale/Color/Place (pale earthy crust patches, multi-octave; with softness the edges feather
           over several mm and they favour up-facing flats over arrises) · pustules + pustuleScale/Color
           (crisp emerald, lodged in recesses and edges, never on plateau tops, kept saturated through
           dulling) · grain (soft 2.5 + 9 mm lightness / hue / roughness breathing, no threshold: plain
           walls stop reading flat; two simplex taps) · tint (multiplies the whole skin: last hue correction)
Surface    matte (dry, micro-pitted excavated skin: roughness floor, no broad glossy highlights;
           0 = each layer's own sheen, kept only by as-cast / heirloom) · dulling (dust / old wax greys
           every mineral colour) · tops (relief tops — real mm above the L0 ground — rubbed to a darker,
           warmer, smoother skin) + topsTone (0 that · 1 paler silvery bands: flush décor read by colour;
           a map with nothing raised — a flange's incised faces — has no tops, and plain meshes never go pale)
           · earth + earthColor (recesses, ledges, an accretion low on the foot) · calcite (lime: mostly sharp crusty islands
           plus a faint dust) · streaks (gravity runs down the walls + one pale tide line) ·
           burialSide · recessDirt · ledgeMatte (up-facing ledges fully matte: no grazing sheen) · interiorTone (interior = one calm corroded skin: dark grey-brown
           → pale green) · wax · inlay (black paste in sunk lines AND the sunk ground of relief
           panels) · inlayGround (paste fills the whole sunk ground of the décor, over the corrosion:
           light bands on black, Met zun) · wear (erases soil → crust → noble → cuprite → burnished metal) · seed
```

Presets (`PATINA_PRESET_GROUPS` groups them for the drawer):
Vessels `houmuwu`, `met-fangyi`, `met-zun`, `met-gu`, `nezu-olive`, `met-fangding`, `met-gui` · Looks `excavated-green`
(generic dark Anyang excavation), `olive-museum`, `malachite-crust` (Freer F1915.136),
`water-black` (Met fanglei 55.160), `bronze-disease`, `heirloom`, `as-cast` · Blue `nezu-blue`,
`blue-green-excavated`, `azurite-bloom`. A preset is applied over the PATINA_PARAMS defaults.

Also exported: `patina` (the shared `{ value }` uniforms), `getPatina()`,
`PATINA_PARAMS` (group, label, min/max/step, default, unit, hint),
`setPatinaMode('beauty' | 'clay' | 'height' | 'mask')` (shared uniform, no recompile; `mask` =
the top layer per pixel in false colour, unlit: gold metal / white worn metal, red cuprite,
violet noble, black inlay+soot, green malachite, blue azurite, cyan chloride, yellow soil,
pink lime; darker = thicker crust), and `setPatinaVessel(object3D | { min: [x,y,z], max })`.

**Vessel space.** Noise runs in mm in the space of the vessel root: the stage calls
`setPatinaVessel(root)` in `setContent`, which stores the root's inverse world matrix and its
bbox. So territories run continuously across separately built parts, stay glued if the root is
turned, and scales are physical on a 25 cm fangyi and a 1.3 m ding alike (territory size gets a
mild `(H/300 mm)^0.3` bias). The bbox also gives height-above-base (soot, soil at the foot) and
the vertical axis (faces turned toward it count as sheltered). Fields: territories (patchScale,
warped fbm) · second territory (noble-vs-crust split) · territory KIND (warped, ragged Voronoi cells:
noble-skin / cuprite / crust regions with sharp borders) · azurite field (azuriteScale) · gravity streaks · mottle (mottleScale) · speckle
and botryoids (malachiteScale, Worley); each band fades to its mean below ~1.5 px.

Constructor options: `{ relief, cavityAttribute, cavity = 0.8 (constant for plain meshes),
interior = 0 (1 for a bowl's inside / inner wall: one calm corroded skin per interiorTone, no speckle, no wear; ≥ 0.55 is already fully calm), normalStrength }`.
Plain meshes (legs, handles, flanges) get a cavity estimate from signed screen-space curvature
(convex arris → edge/wear, concave crease → recess), undersides and inward faces; the inner wall
of a decorated panel (uv = -1) is treated as interior. Each layer is one GLSL function
(`layerCuprite`, `layerNoble`, `layerMalachite`, `layerCarbonateFilm`, `layerBlueGreen`, `layerAzurite`,
`layerSoil`, `layerSoot`, `layerWear`) over a shared `Surf` struct. Dielectric products carry their own F0 (cuprite 0.18,
SnO₂ 0.075, malachite 0.065).

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
- A view may instead be a **face view**: `face: { center, normal, up, width, height }` (vessel mm) looks
  head-on at that rectangle — see § Flat faces.
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
&mode=beauty|clay|silhouette|height|mask   clay = neutral grey lit material (relief only); silhouette = white on black,
                     unlit; mask = patina layer coverages in false colour (setPatinaMode)
&ui=0                hide all chrome, no auto-rotate, deterministic
&q=<quality>         build quality (default 1; 0.5 on a phone / small viewport; the UI's Detail control overrides)
&dpr=<ratio>         device-pixel-ratio cap (default min(devicePixelRatio, 2))
&tab=vessels|atlas
&motif=<name>&preset=<motif preset>   atlas subject (with tab=atlas)
#<artifact-id> | #atlas   the same subject on a host that strips query strings (letters, digits, hyphens);
                     honoured on load (after ?a / ?tab) and on hashchange, updated as the user switches
```

Artifact modules load lazily (one chunk each, from the files `src/artifacts/index.js` names; a file
is named after its artifact id), so `views(id)` and `viewRefs(id)` return Promises (`page.evaluate`
awaits them). `catalog()` → Promise of `[{ id, title, order }]` once every module is in.
Reference photos shown by the app's "compare" come from `src/app/refs.js`, generated by
`node tools/refs.mjs` from the views' `ref` fields (smoke fails while it is stale).

`window.__taotie = { ready: Promise, artifacts: [ids], views(id), metrics() }` where
`metrics()` returns, in mm, the overall bounding box and the bounding box of every
`userData.part`. `document.documentElement.dataset.ready = '1'` once the first
frame of a fully built vessel (or, with `tab=atlas`, plaque) is on screen; it
drops to `'0'` while a new subject builds, and reads `'error'` if boot failed.

Tool hooks on the same object (each resolves after a rendered frame):
`show(id, view?)`, `setView(name)`, `setMode(m)`, `setPatina(presetName | values)`,
`setFace(face, { fit, fov, light }?)` (frame any face rectangle head-on, § Flat faces), `faceView()`,
`showMotif(name, preset?)`, `frame()`, `setCompare(on)`; plus `motifs`, `motifPresets(name)`, `layout()`,
`viewRefs(id)`, `atlasStats()`, `timings`, `kit`, `stage`. `metrics()` returns
`{ id, overall: { min, max, w, h, d }, parts: { <part>: { …, count } }, buildMs }`,
`count` being the number of separate part roots (four legs → 4).

Tools (build first: `npm run build --workspace @vibe-dump/taotie-bronze`;
Chromium from `$CHROMIUM_PATH`, else `/opt/pw-browsers/chromium`):

```
npm run shots   -- [--a id] [--view v,…] [--mode beauty,clay] [--patina p,…] [--q 1] [--compare-all]
                   [--atlas [--motif m,…] [--preset p,…]] [--ui [--phone] [--size name,…]] [--out dir]
npm run metrics -- [--a id] [--all] [--json]      # PASS/FAIL table; exit 1 on any failure
node tools/refs.mjs [--check]      # regenerate src/app/refs.js after adding a view `ref`
node tools/faces.mjs --a id [--face f,…] [--rectify] [--list] [--views]   # flat faces: photo | model, § Flat faces
npm run check                      # vite build + tools/smoke.mjs (every artifact, view, mode, motif preset)
node tools/bench.mjs               # 4096×2048 panel draw + bake timing
```

`tools/shoot.mjs` renders artifact × view × mode to `tools/shots/<id>/<view>-<mode>.png`
(1400×1050, DPR 1, `ui=0`) and, where a view has a `ref`, writes a side-by-side
`compare-<view>.jpg` with the reference photo from `reference/<id>/` (against beauty, else
whichever mode was shot, labelled); `--compare-all` (one `--a`) shoots every ref view and writes
`<out>/<id>/compare-sheet.jpg`. `--ui` shoots the chrome at 1400×1050 and 1280×800, `--phone`
adds 390×844, 430×932 and 844×390 (touch, DPR 2) with label / list / sheet / compare states.
`tools/metrics.mjs` checks measured proportions against `reference/<id>/spec.json`:
`{ "ratios": { "<name>": { "expr": "parts.legs.h / overall.h", "expected": 0.38, "tol": 0.03 } } }`.
`expr` is never eval'd: a number or a dotted path into `metrics()`, optionally one
operator (`/ * + -`) and a second operand.

## Flat faces — tracing the décor from the photographs (`tools/faces.mjs`)

Compare a photographed face of a bronze with the model's same face **element by element, head-on, at
the same scale**: the photograph is warped (homography) to an orthographic image of the face plane in
mm, the model is rendered down the same face normal at the same pixel size, and the two are put side by
side with the model's relief edges drawn over the photograph. Draw décor by tracing these, not from memory.

**What exists** (`node tools/faces.mjs --list`): `met-fangyi` face-long, face-long-frieze, face-long-main,
face-long-foot, face-lid-long, face-end, face-lid-end (8 px/mm, best: face-end); `nezu-fangyi` face-belly,
face-neck-frieze, face-foot-frieze, face-lid-broad (6 px/mm from a ≈ 3.5 px/mm phone photo); `houmuwu-ding`
face-long, face-long-top-frieze, face-long-bottom-frieze, face-long-column, face-short, face-rubbing-long
(2 px/mm); `met-fangding` face-long, face-long-main, face-long-frieze (10 px/mm, 0.17 mm rms), face-short,
face-short-main (6 px/mm); `met-gui` face-front, face-mask, face-neck, face-foot (8 px/mm; a ROUND vessel: the
plane is taken down the photograph's own 4°-elevated line of sight, so photo and model foreshorten alike; 0.86 mm rms).
Each face's `trust` and `fit` in faces.json say how far to believe it.

### reference/<id>/faces.json

```jsonc
{
  "vessel": "met-fangyi",
  "blur": 0.5,                       // optional: similarity blur, mm (default 0.5; ≥ leiwen pitch / 2 — soft photos want more)
  "sources": {                       // photographs the faces are cut from
    "DP151396": {
      "file": "three-quarter.jpg",   // the committed copy in reference/<id>/ (always used if the original is absent)
      "original": "https://…/DP151396.jpg",   // full-size original, fetched into .work/originals/ (never committed)
      "size": [2882, 3842],          // ORIGINAL px — every point below is in original px
      "fileScale": 0.4685,           // optional: committed px = original px × fileScale (default file width / size[0])
      "fileOffset": [0, 0]           // optional: for a committed crop, its top-left in original px
    }
  },
  "faces": {
    "face-long": {                   // = the artifact view name (face-…)
      "label": "long face (+Z), whole body",
      "source": "DP151396",
      "center": [0, 81, 49.0],       // the face rectangle, vessel mm (model space: Y up, front +Z)
      "normal": [0, -0.0247, 1],     // outward; need not be unit
      "up": [0, 1, 0.0247],          // projected onto the plane; right = up × normal (u runs left → right seen from outside)
      "width": 152, "height": 166,   // mm, centred on `center`
      "ppmm": 8,                     // output scale; the long side is capped at 2400 px (`maxSide`) — px/mm drops to fit
      "points": [[603, 1637, -67.4, 162.2, 51.0], …],   // [photo x, photo y (original px), vessel x, y, z mm]; ≥ 4, no 3 collinear
                                     // or "face-long": reuse another face's points (a sub-rectangle of the same plane)
      "flat": false,                 // true: an already flat image (a rubbing); points are [px, py, u, v] in face mm from `center`
      "light": { "elevation": 35, "azimuth": 135 },   // optional raking key (see below)
      "blur": 0.5,                   // optional per-face similarity blur
      "trust": "free text: how far to believe it", "fit": "rms / max residual of the points"
    }
  }
}
```

Points must lie **in the face plane** (or within a few mm of it): register borders, rim / foot lines,
notch jambs, the root of a face-centre flange, field corners. Never a flange crest, a corner flange
standing out at 45°, or a décor element you are trying to check. The fit is least squares, so 6 points
(three across the top, three across the bottom, including the centre axis) beat 4: `--rectify` prints
the rms / max residual in mm, and per point (`--verbose`, or automatically above 1.5 mm) so a misread
point shows. Then LOOK at the flattened image: register borders straight and level, the centre flange
vertical at x = width/2, the two eyes of a mask at ± the same u. Move points until they are.
Curved faces (a bulging belly, a convex lid slope) are flattened onto their chord plane: say in `trust`
how far the surface leaves it.

### The view property and hooks

A named view with `face` is a face view (`src/artifacts/<id>.js`, generate the lines with `--views`):

```js
'face-long': { face: { center: [0, 81, 49], normal: [0, -0.0247, 1], up: [0, 1, 0.0247], width: 152, height: 166 },
               ref: 'faces/face-long.jpg' },          // optional: fit (1), fov (1°), light { elevation, azimuth }
```

`stage.setView` puts a 1° lens ≈ 57 × the frame height away on the face normal (an orthographic view to
< 0.05 % across ± 15 mm of relief), `camera.up` = the face's up, and frames width × height exactly
(fit 1, letterboxed to the canvas; the UI's usual margin applies with chrome on). The key light then
rakes in from the face's **upper left, 35° above the plane** (`light.azimuth` is in the plane: 0 right,
90 up, 135 upper left), a weak fill from the lower right, no rim — relief reads the way museum
photographs show it, in clay and beauty alike. Face views sit in the app's Details row labelled
"flat …"; their `ref` (a path under reference/<id>/, `faces/<face>.jpg`) shows in Compare like any other
reference photo (run `node tools/refs.mjs` after adding refs; the credit is the source photo's).
Hooks: `window.__taotie.setFace(face, opts)` frames any face rectangle (not a named view);
`faceView()` returns the current face frame `{ center, normal, up, right, width, height }` or null.

### tools/faces.mjs

```
node tools/faces.mjs --list [--a id]                list faces: size, px/mm, source, flat image ✓, view ✓
node tools/faces.mjs --a id --rectify [--face f,…] [--originals dir] [--fetch] [--verbose]
                       write reference/<id>/faces/<face>.jpg (JPEG q88) from faces.json + the originals in
                       .work/originals/ (--fetch downloads missing ones; else the committed copy, scaled)
node tools/faces.mjs --a id --views                 print the `views` lines for the artifact
TAOTIE_DIST=.work/<me>/dist node tools/faces.mjs --a id [--face f,…] [--out dir] [--q 1]
                       render every face in clay + height at the flattened photo's pixel size →
                       <out>/<id>/<face>-clay.png, -height.png, <face>-compare.jpg
                       (photograph | model clay | model relief edges in magenta over the desaturated photo),
                       faces-sheet.jpg (all of them) and similarity.json; prints the similarity per face
```

`<out>` defaults to `.work/faces/`. **Similarity** = normalised cross-correlation of the gradient
magnitude of the photo's luminance and of the model's height render, both blurred at `blur` mm
(σ; then 2σ on the gradient), over the pixels where the model has relief. It is a trend indicator
for one face across iterations — never compare it between faces or vessels, never optimise it on its
own (soft, dark photos — the Nezu neck — score near or below zero whatever the model does). The image
work is `tools/faces_img.py` (python3 + PIL + numpy).

**Adding a face for a new vessel:** (1) put the source photo in reference/<id>/ (committed copy) and its
original URL in `sources`; (2) choose the plane from the model (the probe `window.__taotie.stage.content`
userData — `walls[side].corners`, lid `hips` / `midlines` — gives exact numbers) and a rectangle a few mm
larger than the decorated field; (3) read 6 in-plane landmarks off the original at 1:1 (crop with a pixel
grid); (4) `--rectify`, read the residuals, LOOK, iterate; (5) `--views` → paste into the artifact,
`node tools/refs.mjs`, build; (6) `tools/faces.mjs --a id` and read the compare sheets.

