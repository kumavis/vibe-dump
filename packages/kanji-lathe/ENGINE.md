# Kanji Lathe — engine contract

Internal spec. Every module below is written against these types; nothing else
is shared. Coordinates are always in **em units on a 0…1024 square, y down**
(`EM = 1024`), matching KanjiVG's grid rescaled.

## Data (already written — do not modify)

- `src/data/loader.js` — `loadCorpus()`, `decodeCorpus(raw)`, `EM`.
  A `KanjiRecord` is `{ char, freq, grade, jlpt, strokeCount, meanings[], on[],
  kun[], strokes[], groups[], radicalGroup }`.
  A record stroke is `{ index, type, base, variant, alt, name, cls, hook,
  cubics: Float64Array, group, ancestry[] }`.
  A group is `{ i, element, position, positionCode, radical, isRadical, depth,
  parent, from, to, variant, phonetic, children[] }` — `[from, to)` is a
  contiguous stroke-index range, groups are depth-first ordered.
- `src/data/strokes.js` — `decodeStrokeType`, `STROKE_TYPES`, `POSITIONS`.
- `src/geom/path.js` — `clamp lerp smoothstep cubicAt flattenStroke
  polylineLength resample arcParam tangents bbox chaikin simplify signedArea
  toPathData mulberry32 hashString makeNoise2D`.
- `src/engine/skeleton.js` — `buildSkeleton recomputeBounds recomputeLengths
  mapPoints affineStrokes xformAbout trimmedPoints trimmedWidths EM`.

### Skeleton — the mutable working copy

```js
skel = {
  char, record, em: 1024, seed, scratch: {},
  bbox: { x0, y0, x1, y1 },            // refreshed by recomputeBounds(skel)
  strokeCount,
  groups: [ { ...recordGroup, bbox } ],
  strokes: [ {
    i,                 // stroke order index, 0-based
    type, base, variant, name,
    cls,               // 'h' | 'v' | 'd' | 'r' | 'dot' | 'turn'
    hook,              // ends in a はね flick
    group, ancestry,   // innermost group index; outermost→innermost chain
    n,                 // sample count
    pts,               // Float64Array[n*2] — uniformly arc-spaced, MUTABLE
    ref,               // Float64Array[n*2] — pristine copy, never mutate
    w,                 // Float64Array[n]   — half-widths, filled by nib stage
    corners,           // indices of sharp turns in the source stroke
    t0, t1,            // arc-length trim, 0..1 (crown shyness retracts ends)
    alive,             // false = drop this stroke entirely
    len, refLen, angle,
  } ]
}
```

Operators **only** mutate `pts`, `w`, `t0`, `t1`, `alive`. Never resize `pts`,
never reorder strokes, never touch `ref`.

## Module contract

Every operator module is a plain ES module exporting exactly two things:

```js
export const params = [ /* ParamSpec, see below */ ]
export function apply(skel, P, ctx) { /* mutate skel in place */ }
```

- `P` — flat object of current parameter values keyed by ParamSpec `id`.
- `ctx` — `{ rng, noise, corpus, record, time, seed, quality }`
  - `rng()` → deterministic 0..1 (seeded per glyph)
  - `noise(x, y)` → smooth value noise in −1..1
  - `time` → seconds, for animated/LFO parameters (0 when static)
  - `quality` → 1 for the main stage, 0.5 for grid thumbnails (skip expensive
    iterations when < 1)

`apply` must be a no-op when its parameters sit at their defaults, and must be
safe to call twice. Cost target: ≤ 1 ms for a 20-stroke glyph.

### ParamSpec

```js
{
  id: 'shyness',              // unique across the whole app, camelCase
  label: 'Crown shyness',
  group: 'Crown shyness',     // panel section, shared between modules is fine
  type: 'range',              // 'range' | 'toggle' | 'select' | 'color' | 'curve' | 'seed'
  min: 0, max: 1, step: 0.01, // range only
  default: 0,
  unit: '',                   // optional suffix shown next to the value
  options: [{ value, label }],// select only
  hint: 'One sentence…',      // tooltip
  when: (P) => P.other > 0,   // optional: dim the control unless true
  bipolar: true,              // optional: render the slider centred on 0
}
```

`type: 'curve'` values are `number[]` of length 9 in 0..1 — a control polygon
sampled by `evalCurve(arr, t)` from `src/engine/curve.js`.

## Pipeline order (src/engine/pipeline.js)

```
buildSkeleton
 10 ops/layout.js      component & radical surgery
 20 ops/warp.js        region compression / density equalisation
 30 ops/structure.js   per-stroke shape: straighten, tension, corners, quantise, rhythm
 40 ops/frame.js       whole-glyph distortion: superellipse, polar, vortex, slant…
 50 ops/noise.js       curl-noise displacement, hand tremor
 60 ops/shyness.js     crown shyness relaxation, junction joinery
 70 ops/fit.js         final em fit, margins, optical centring
    nib.js             fills stroke.w
```

## Downstream contracts

- `src/engine/nib.js` — `export const params`, `export function applyNib(skel, P, ctx)`
  fills every live stroke's `w[i]` with a **half-width in em units** (typical
  24…60). Must never write 0 or negative — clamp to ≥ 0.5.
- `src/engine/outline.js` — `export function strokeOutline(pts, widths, opts)`
  returns `Float64Array[]`, an array of **closed** polygons (first point not
  repeated) tracing the variable-width stroke.
  `opts = { capStart, capEnd, join, miterLimit, closeTol }`;
  caps are `'butt' | 'round' | 'pointed' | 'wedge' | 'slab' | 'bulb' | 'split'`.
- `src/engine/metrics.js` — `export function computeMetrics(skel, P, ctx)` →
  `{ legibility, coverage, gray, minGap, strokesDropped, inkLength, bboxFill }`.
- `src/font/ttf.js` — `export function buildTTF(spec)` → `Uint8Array`.
- `src/render/canvas.js` — `export const params`, `export function renderGlyph(g, skel, P, ctx, box)`.
