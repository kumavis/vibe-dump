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
    motifs/
      taotie.js         the parametric mask
      kui.js cicada.js blade.js whorl.js boss.js bands.js …
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
```

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
p.mask(draw)      // returns a Float32 coverage mask without touching the field
p.fillGround(leiwenOpts, { avoid: mask | 'raised', margin: 0.6 })
p.mirrorX()       // copy left half onto right half (bilateral symmetry about x = width/2)
p.bake(opts) → ReliefMap
```

`ReliefMap` = `{ width, height, widthMM, heightMM, ppmm, data: Float32Array (mm), min, max }`
plus lazily-built THREE textures:

- `heightTexture` — R: height normalised to 0..1 over `[min,max]` (mip-mapped, linear)
- `normalTexture` — tangent-space normal from the full-res field (Sobel, in mm so slopes are physically right)
- `dataTexture` — **R** height01, **G** cavity (0 deep recess → 1 fully exposed; a wide-blur minus field measure),
  **B** edge/convexity (1 on sharp raised arrises, where wear polishes first), **A** groove mask (1 inside sunk lines — drives inlay paste)
- `macro(sizeMM)` — a low-passed copy for geometric displacement (fine leiwen stays in the normal map)

Rule: **the same ReliefMap drives geometry displacement, the normal map, and the
patina masks.** Corrosion collecting in the leiwen is not painted; it falls out
of the cavity channel.

## relief/leiwen.js

`leiwenFill(panel, region, opts)` packs squared spirals into an arbitrary region:

```js
{ pitch: 1.6,          // mm centre-to-centre of adjacent grooves (line ≈ gap)
  cell: [6, 14],       // spiral cell size range in mm
  turns: 'auto',
  roundness: 0.25,     // 0 = hard square corners, 1 = round
  jitter: 0.08,        // hand-cut irregularity
  mode: 'sunk' | 'thread',   // grooves cut in, or thread-relief lines standing up
  depth: 0.45,
  fillers: true }      // T-hooks / triangles / C-scrolls in slivers too small for a spiral
```

Quality bar: no visible grid; spirals follow the contour of the neighbouring
motif; cells vary in size; nothing is clipped mid-stroke at a motif edge
(inset the region by `margin` first, then clip).

## relief/motifs — the unit vocabulary

Every motif module exports `{ name, schema, presets, draw(panel, rect, params) }`
where `rect = { x, y, w, h }` in panel mm, and `schema` is a plain object the
Motif Atlas UI can turn into controls: `{ horn: { type: 'enum', options: [...], default }, eyeSize: { type: 'range', min, max, step, default }, … }`.
Shapes are authored as bezier/polyline paths in a **normalised half-mask space**
(x: 0 at the central axis → 1 at the panel edge; y: 0 bottom → 1 top), so a
motif stretches to any panel aspect ratio the way the originals do. `draw`
renders the left half and the panel mirrors it.

Taotie parameters (the grammar document in `research/01-…` is authoritative for
shapes and proportions):

```
style        'relief' (Loehr V: mask raised above leiwen) | 'flush' (Loehr IV: same plane, told apart by line density)
horn         'c' | 'ram' | 'buffalo' | 'bottle' | 'kui' | 't' | 'coiled' …
eye          'chen' (臣-shaped, canthus hooks) | 'oval' | 'round'
eyeSize, pupil ('slit' | 'dot'), brow, ear, crest (forehead lozenge)
nose         'ridge' | 'flange' (a real L3 flange sits here — leave the slot) | 'plain'
jaw          'hooked' | 'split' | 'fanged'
body         'none' | 'band' | 'kui' (split-body: two profile dragons) | 'dissolved'
tail, leg, claw, quills (dorsal hook row)
relief       { motif: mm, boss: mm, groove: mm }   // level heights
lineWeight   mm — incised line work on the plateaus
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
// geo has position, normal (recomputed after displacement), uv (panel UV for the maps), uv1 optional
```

`lathe.js`, `fang.js`, `parts.js` are built on top of this and return
`THREE.Mesh`/`Group` with `.userData.part = '<name>'` so the metrics tool can
measure them. A decorated wall is always: surface patch + ReliefMap + PatinaMaterial.

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
```

`window.__taotie = { ready: Promise, artifacts: [ids], views(id), metrics() }` where
`metrics()` returns, in mm, the overall bounding box and the bounding box of every
`userData.part`. `document.documentElement.dataset.ready = '1'` once the first
frame of a fully built vessel is on screen.

`tools/shoot.mjs` renders artifact × view × mode to `tools/shots/` and, where a
view has a `ref`, writes a side-by-side `compare-<view>.jpg` with the reference
photo from `reference/<id>/`. `tools/metrics.mjs` checks measured proportions
against `reference/<id>/spec.json`.
