# Jhāna Book — design & contracts

A pop-up book of the eight jhānas, rendered in Three.js. The reader opens a
book lying on a dark table. Each **spread** (a pair of facing pages) hosts a
cut-paper scene that physically **unfolds as the spread opens and folds flat as
it closes** — real pop-up mechanics (V-folds, parallel folds) driven by the
dihedral angle between the two pages, plus ambient light and particles that fade
with openness. Ten spreads: an intro, the eight jhānas, an outro. Minimal text,
printed on the paper itself. You should be able to sit with a page, breathe with
it, and turn it when you are ready.

This file is the contract between the engine, the fold library and the scenes.
Scene authors: read **Spread space**, **The scene module**, **The `paper`
library** and **Art direction**. Engine/paper implementers: everything.

---

## Files

```
packages/jhana-book/
  index.html            entry (canvas + minimal HUD)        ← engine
  style.css                                                 ← engine
  main.js               boot: query params, Book, loop      ← engine
  src/book.js           the Book: leaves, turns, camera,
                        page text, spread mounting          ← engine
  src/breath.js         breath clock                        ← engine
  src/audio.js          drone synth (Web Audio, optional)   ← engine
  src/hud.js            dots / arrows / sound / breath ring ← engine
  src/paper.js          fold mechanisms (Paper class)       ← paper lib
  src/scenes/index.js   ordered list of spread modules      ← engine
  src/scenes/<id>.js    one module per spread               ← scene authors
  tools/shot.mjs        screenshot helper (Playwright)
  DESIGN.md             this file
```

Scene authors own **only** `src/scenes/<their-id>.js` (plus, if they need
helpers, `src/scenes/<their-id>/*.js`). Never edit engine files or `paper.js`;
if something is missing there, say so in your report.

## Units, axes, sizes

Book units are arbitrary but think "metres on a small desk". Constants exported
from `src/book.js`:

| const | value | meaning |
| --- | --- | --- |
| `W` | `1.0` | width of **one** page, spine to outer edge |
| `H` | `1.4` | height of a page (far edge to near edge) |
| `LEAF` | `0.012` | thickness of one leaf |
| `COVER` | `0.03` | thickness of a cover; covers overhang pages by `0.03` |

**Table space** (the engine's world): the book lies on `y = 0`, spine along the
**z axis** at `x = 0`. `+y` is up, `+z` points **toward the reader** (the near /
bottom edge of the pages is at `z = +H/2`, the far / top edge at `z = −H/2`).
Right pages lie at `x > 0`, turned pages at `x < 0`.

A leaf's angle `ψ` is measured from the flat right position (`ψ = 0`) rotating
up over the spine to the flat left position (`ψ = π`). A page turn animates
`ψ: 0 → π`.

## Spread space (what scenes are built in)

Each spread gets a `THREE.Group` — its **spread group**. The engine positions
it so that the spread's two pages are **symmetric about the group's local
`x = 0` plane**, hinged on the group's local **z axis**:

- the spine runs along local `z`, `z = 0` at the middle of the page height,
  `+z` toward the reader;
- the **dihedral angle** between the two pages is `θ ∈ [0, π]`;
  `openness = θ / π`;
- the right page's in-plane outward direction is `uR = (sin θ/2, cos θ/2, 0)`
  and the left page's is `uL = (−sin θ/2, cos θ/2, 0)`;
- at `θ = π` (fully open) the right page lies along `+x`, the left page along
  `−x`, and the page normal — the direction pop-ups rise — is `+y`;
- at `θ = 0` the two pages coincide, standing along `+y`; everything glued to
  them must lie flat between them.

So in spread space, "up" is the bisector of the two pages and the pop-up
mechanism must flatten into the `x = 0` plane as `θ → 0`. The engine handles
the rotation that lines this frame up with the physical leaves (for the
closing spread `group.rotation.z = ψ/2`, for the opening one `ψ/2 − π/2`); a
scene never needs to know which leaf is moving.

The right page covers `x ∈ [0, W]`, `z ∈ [−H/2, +H/2]` in its own plane; the
left page mirrors it. Pages are thin boxes owned by the engine; anything a scene
draws **on** a page should sit at `y ≥ 0.002` above it (use the page frames from
`paper.root`, see below) to avoid z-fighting.

**Keep the near strip clear.** The engine prints the title on the left page and
the one-line text on the right page in the near 18 % of the page (`z > 0.45`).
Glued mechanisms should stay at `z ≤ 0.45`. Floating ambient effects may go
anywhere, including off the page.

**Scale of the pop-up.** Mechanisms should rise to roughly `0.5–0.9` above the
pages when open, and the whole scene must fit, when folded flat (θ = 0), within
the page outline: nothing further than `W` from the spine along a page, nothing
outside `z ∈ [−H/2, H/2]`. Ambient particles may exceed that but should fade
out below `openness ≈ 0.2`.

## The scene module

`src/scenes/<id>.js` default-exports a plain object:

```js
export default {
  id: 'jhana-1',                 // == file name; used by ?page=
  label: '1',                    // numeral printed in the page's outer top corner ('' for none)
  title: 'First Jhāna',          // printed on the left page
  pali: 'paṭhama jhāna',         // printed small under the title ('' for none)
  line: 'Rapture rises, born of letting go.',   // printed on the right page
  palette: {
    bg: '#1a0a08',               // the void around the book while this spread is open
    paper: '#f1e4cc',            // tint of this spread's two pages
    ink: '#3a2418',              // text ink
    accent: '#ffb24a',           // engine's accent light + HUD tint for this spread
  },
  audio: {                       // the drone while this spread is open (see Audio)
    root: 110,                   // Hz
    intervals: [0, 7, 12, 19],   // semitones above root, one voice each (≤ 5)
    brightness: 0.5,             // 0..1 lowpass openness
    shimmer: 0.3,                // 0..1 amount of slow detune/tremolo motion
    breathe: 0.6,                // 0..1 how much the breath opens the filter
  },
  build(ctx) {
    // create meshes, add them to ctx.group, create mechanisms via ctx.paper
    return {
      update(frame) {},          // every frame while the spread is visible
      dispose() {},              // free geometries/materials/textures you made
    }
  },
}
```

`ctx`:

| field | what |
| --- | --- |
| `THREE` | the three module (also fine to `import * as THREE from 'three'`) |
| `group` | the spread group. Add everything here (or to frames inside it). |
| `paper` | a `Paper` instance bound to this group — see below |
| `W`, `H` | page width / height |
| `palette` | the module's own palette (parsed `THREE.Color`s in `ctx.colors`) |
| `quality` | `'high'` or `'low'` (low: mobile / `?quality=low`; halve particle counts) |

`frame` (passed to `update`):

| field | what |
| --- | --- |
| `dt` | seconds since the last frame, clamped to `≤ 0.1` |
| `time` | seconds since this spread was first built |
| `theta` | dihedral angle of this spread, `0..π` |
| `openness` | `theta / π`, `0..1` |
| `reveal` | `smoothstep(0.08, 0.7, openness)` — use for fading ambient effects |
| `breath` | `0..1`, the breath clock: 0 empty, 1 full (see Breath) |
| `breathPhase` | `'in'` or `'out'` |
| `breathVel` | d(breath)/dt, positive while breathing in |
| `pointer` | `{ x, y }` in `−1..1`, viewport-normalised, `0,0` when idle |
| `active` | `true` once the turn that opens this spread has finished and until the turn that closes it begins |

Rules for scenes:

- **Everything glued to a page must fold flat at θ = 0.** Build mechanisms with
  `paper` so this is automatic. Free-floating objects (particles, glows, lights)
  must scale/fade with `reveal` so nothing hangs in the air when the pages are
  closed.
- The engine calls `paper.update(theta)` before `update(frame)`; mechanisms are
  already posed when your `update` runs.
- Lights: at most **two** extra lights per scene, none casting shadows. The
  engine provides a key light with shadows, a hemisphere fill and an accent
  point light tinted `palette.accent`.
- Budget: ≤ 60 k triangles, ≤ 20 draw calls for the pop-up, particles as
  `THREE.Points` or `InstancedMesh`. 60 fps on a laptop, graceful on a phone.
- No external assets, no network. Textures are generated with Canvas.
  Procedural everything.
- Call `renderOrder` / `depthWrite` carefully for transparent sprites: keep
  transparent things after the paper.
- Deterministic start: no `Math.random()` at module top level; use a seeded
  helper so the thumbnail is stable (small helper in paper: `paper.rng(seed)`).

## Breath

`src/breath.js` — a free-running clock, period 10 s (4.5 s in, 1 s hold, 4.5 s
out, roughly; a smooth curve, not a square). Exposes `breath ∈ [0,1]`,
`phase`, `vel`. Everything meditative in the book keys off it: scenes pulse,
glow, swell with it; the drone's filter opens with the in-breath; the HUD's
breath ring swells. One clock for the whole app — spreads do not restart it.

## The `paper` library — `src/paper.js`

Pop-up geometry, posed from a dihedral angle. The core idea:

> A **hinge** is two flat panels sharing a crease line, meeting at dihedral
> angle `θ`. The book's spine is the root hinge. Every mechanism is built on a
> hinge and yields new hinges you can build further mechanisms on.

### Hinge frame (an `Object3D`)

Every hinge has a `crease` object whose **local frame** is defined as:

- origin on the crease line, local **`+z` along the crease axis**;
- local **`+y` is the bisector of the two panels** — the panels extend from the
  crease at angles `±θ/2` from `+y`; the right panel toward `+x`, the left
  toward `−x`. (The right panel's in-plane direction is `(sin θ/2, cos θ/2, 0)`,
  the left panel's `(−sin θ/2, cos θ/2, 0)`, exactly like the spread.)
- `θ` may exceed `π` for an *outside* hinge (below).

**Mechanisms rise toward the `+y` of the hinge they are built on**, into the
wedge between its panels. For the root that is up out of the book. For a
fold's own crease, that is *into* the fold (a smaller piece hanging inside a
tent). Every fold also exposes its **outside** hinge — the same crease rotated
`π` about `z`, so `+y` points out of the fold and `θ_out = 2π − θ_in` — for
nesting a piece that rises *above* a ridge. (Rotation about z swaps which
physical panel is "left"/"right" in that frame; document in code.)

```ts
interface Hinge {
  crease: THREE.Object3D   // the hinge frame
  left:   THREE.Object3D   // panel frame of the left panel
  right:  THREE.Object3D   // panel frame of the right panel
  readonly theta: number   // current dihedral (radians)
  readonly outside: Hinge  // the reversed hinge (lazily created)
}
```

### Panel frame (an `Object3D`)

A frame attached to one flat panel, origin on the panel's glue line (its hinge
line with the thing it is attached to):

- local **`+z` runs along the glue line** (for parallel structures this equals
  the parent hinge's `+z`; for a V-fold panel it runs from the apex outward
  along the glue line);
- local **`+y` is the panel's normal, on the face that looks toward the `+y` of
  the hinge the panel belongs to** (for pages: up, the face pop-ups are glued
  on; for a parallel fold's panels: the outward, visible faces);
- local `+x = y × z`. The panel's body lies on the side `x · dir ≥ 0`, where
  **`frame.userData.dir` is `+1` or `−1`**. `card()` and `place()` take care of
  this; use them instead of reasoning about the sign.
- `frame.userData.length` is the panel's extent from the glue line to its
  crease (or the page width for a page).

For the root hinge, `paper.root.right` / `paper.root.left` are the **page
frames** (`dir = +1` for right, `−1` for left), so a flat decoration lies at
`place(paper.root.right, { x: 0.5, y: 0.002, z: -0.2 })`.

### API

```js
import { Paper } from '../paper.js'   // scenes receive an instance as ctx.paper

class Paper {
  constructor(spreadGroup)             // engine does this; the group is the root crease
  root: Hinge                          // the spine; root.theta = book dihedral
  update(theta)                        // engine calls each frame; poses every mechanism in creation order

  // ---- mechanisms ------------------------------------------------------
  parallelFold({ on = root, a, b, p, q, z0 = -0.5, z1 = 0.5 }) → Fold
  vFold({ on = root, z = 0.3, alpha, gamma, length, toward = 'far' }) → Fold
  flap({ on = root, side, x, z = 0, alpha = 0, length, lift }) → Flap

  // ---- helpers ----------------------------------------------------------
  card(frame, { length, z0, z1, material, shape, thickness = 0 }) → THREE.Mesh
  place(frame, { x = 0, y = 0, z = 0 }) → THREE.Object3D   // child of frame at body-side x
  material({ color, roughness = 0.92, metalness = 0, side = THREE.DoubleSide, ...rest }) → MeshStandardMaterial (cached by key)
  rng(seed) → () => number             // deterministic 0..1
  dispose()                            // geometries/materials this Paper created
}

interface Fold {
  left:  THREE.Object3D   // panel frame (origin on the left glue line)
  right: THREE.Object3D   // panel frame (origin on the right glue line)
  ridge: THREE.Object3D   // frame on the fold's own crease: +z along the crease, +y pointing OUT of the fold (up, away from the pages for a fold on the root), +x = y × z
  inner: Hinge            // the fold's crease as a hinge whose +y points into the fold
  outer: Hinge            // same crease, +y pointing out (== inner.outside)
  readonly theta: number  // dihedral between the fold's two panels (inner)
  readonly height: number // current rise of the crease above the parent hinge's crease line, along the parent's +y
}

interface Flap {
  panel: THREE.Object3D   // panel frame hinged on the glue line
  readonly angle: number  // current lift (radians)
}
```

#### `parallelFold({ on, a, b, p, q, z0, z1 })`

A piece creased parallel to the hinge, its left panel (length `p`) glued to
`on.left` at distance `a` from the crease line, its right panel (length `q`)
glued to `on.right` at distance `b`. In the hinge frame the glue points are
`a·uL` and `b·uR` (with the hinge's θ); the crease point is the intersection of
the circles of radii `p` and `q` about them, on the `+y` side. Choose
`p + q > a + b` for a piece that rises (`a = b = 0.35, p = q = 0.5` is a tent
0.36 high when open and lying flat up to `0.85` from the spine when closed);
`a ≠ b` or `p ≠ q` gives slanted roofs and steps. Degenerate inputs must not
NaN: clamp. `z0..z1` are only stored as the default card extents (the mechanism
itself is a profile in the `xy` plane, extruded along `z`). `fold.theta` is the
angle between the panels at the crease; it closes to `0` as the book closes.

#### `vFold({ on, z, alpha, gamma, length, toward })`

The classic V-fold: a piece whose crease stands in the hinge's symmetry plane
(`x = 0`), glued along two lines that meet at an **apex** on the crease axis at
`z` and run at angle `alpha` from the axis into each panel (`toward: 'far'`
runs them toward `−z`, away from the reader when built on the root; `'near'`
toward `+z`). `gamma` (with `alpha < gamma ≤ π/2`) is the piece's own cut angle
between its glue edge and its crease edge, fixed by the paper. With the hinge's
θ, the right glue direction is `g = (sin α sin θ/2, sin α cos θ/2, ±cos α)` and
the crease direction is `c = (0, sin β, ±cos β)` with `β` solved from
`g · c = cos γ`: `A = sin α cos θ/2`, `B = cos α`, `β = atan2(A, B) +
acos(clamp(cos γ / hypot(A, B)))`. Check: at θ = π, `β = acos(cos γ / cos α)`
(rises; `γ = π/2` stands the crease straight up); at θ = 0, `β = α + γ` (lies
flat in the page plane). Each panel's frame has `+z` along its glue line (from
the apex outward), `+y` the panel normal facing the parent hinge's `+y` side,
body on the crease side. `length` is the length of the crease edge; the glue
edge is trimmed so the panel's far edge is perpendicular-ish — `card(frame,
{ shape: 'tri' })` gives the triangle apex / glue end / crease end,
`'quad'` a four-sided card whose outer edge is parallel to the crease at
distance `length·sin γ`... keep the shapes simple and documented; authors can
pass a `THREE.Shape` in panel coordinates `(s, t)`, `t` along the glue line,
`s` toward the crease (always positive; the library maps `s → dir·x`).

#### `flap({ on, side, x, z, alpha, length, lift })`

A one-panel flap hinged on one page (`side: 'left' | 'right'`) along a glue line
at distance `x` from the hinge crease (offset `z` along it, rotated `alpha`
from the crease axis). Its lift angle is **not** physical: `lift(theta)` returns
radians, `0` = flat on the page, positive = rising toward the panel's normal.
Authors use it for petals, wings and doors that should open with the page;
they must return `0` at `theta = 0` and keep the flap inside the page outline
when flat.

#### `card(frame, opts)`

Adds a paper mesh to a panel frame: for parallel/page frames a rectangle
`x ∈ dir·[0, length]`, `z ∈ [z0, z1]`, lying in the frame's `xz` plane at
`y = 0` (`thickness > 0` makes a thin box instead of a plane). `shape` may be
`'rect'` (default), `'tri'`, `'quad'` or a `THREE.Shape` in `(s, t)` as above.
`castShadow = receiveShadow = true`. Default material is `paper.material({
color: '#f2e9d8' })`. Returns the mesh (already added).

#### Invariants (the implementer tests these in Node with three's math)

1. Every mechanism is flat at θ = 0: all panel normals parallel to `±x` of the
   hinge frame, all crease points on the `x = 0` plane.
2. Rigid lengths: the distance glue→crease of each panel is constant for all θ.
3. Continuity: posing at θ and θ+1e-3 moves every frame by `O(1e-3)` — no
   branch flips.
4. Nesting: a `parallelFold` built `on: fold.inner` or `on: fold.outer`
   satisfies 1–3 against its parent's panels.
5. No `NaN` for any θ in `[0, π]` and any inputs satisfying the documented
   constraints; clamped (not NaN) outside them.

## Engine — `src/book.js`, `main.js`, `src/hud.js`

### The physical book

- A back cover (board) on the table, a front cover, ten leaves between them.
  Covers overhang by `0.03`, are `COVER` thick, dark cloth-like
  (`#2b2320`-ish, roughness 0.8) with the title **embossed/printed** on the
  front via a CanvasTexture: `THE JHĀNAS` in a quiet serif, small `a pop-up
  book` beneath, and a thin drawn emblem (an ensō or a lotus line drawing).
  Back cover: blank but for a tiny mark.
- Spreads, in order (`src/scenes/index.js`): `intro`, `jhana-1` … `jhana-8`,
  `outro`. Spread `k` is the back of leaf `k` and the front of leaf `k+1`,
  where leaf 0 is the front cover and leaf 11 is the back cover. So there are
  11 turns: cover → intro → … → outro, the last turn closing onto the back
  cover (book closed, back cover up, "begin again" affordance).
- **States**: `closedFront` → spread 0 … spread 9 → `closedBack`. A **turn**
  animates one leaf (or a block of leaves, when jumping via the dots) with
  `ψ: 0 → π` over `2.6 s` (ease-in-out, slightly slower at the start like a
  real page lifting) — reverse for turning back. The two spreads touching the
  moving leaf are both mounted during the turn: the closing one gets
  `θ = π − ψ`, the opening one `θ = ψ`. Only those spreads are visible; all
  others are hidden (`visible = false`) and not updated.
- Leaves are stiff cards (it's a pop-up book: card stock). Stacks: draw the
  turned stack (left) and the remaining stack (right) as thin blocks whose
  heights follow the counts, so the moving leaf lands on top of its stack. Pages
  on the stacks show the current spread's paper tint and printed text (see
  below); the moving leaf shows the closing spread's page on its front and the
  opening spread's page on its back.
- **Spread groups** are children of the scene at the spine position, lifted by
  the stack height under them, rotated about `z` as given in *Spread space*.
  Each is created lazily (first time its spread is about to show) and kept.

### Page text (printed on the paper)

Each spread has two page textures drawn with Canvas (≈ `1024 × 1434`,
sRGB), paper tint from the palette with a faint grain / fibre noise and a
subtle darker gutter near the spine. Printed in `ink`:

- left page: `label` small in the **top-outer** corner; `title` (serif, ~5 % of
  page height) centred in the near strip, `pali` in small italics beneath;
- right page: `line` centred in the near strip, slightly smaller than the title.

Font stack: `"Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua",
Georgia, serif`. No webfonts, no network. The intro has an empty `label`.

### Camera & light

- Perspective, fov ≈ 34°, looking at the spread from the front and above:
  rest position about `(0, 2.1, 2.9)` targeting `(0, 0.35, 0.05)`, then
  **auto-fitted** so the open spread (`2W + overhang`) plus a 6 % margin fits
  the viewport width *and* the `0.9`-high pop-up volume fits the height; on
  portrait screens tilt further down and pull back rather than cropping.
- Pointer parallax ±`0.12` on x, ±`0.06` on y, eased; a slow breath sway
  (`±0.01 × breath`). Optional: drag to orbit within ±25° yaw / −10..+15°
  pitch, easing back to rest after release. No zoom.
- Lights: warm key `DirectionalLight` from upper-left-front with soft shadows
  (2048 map, bias tuned so thin cards do not acne), `HemisphereLight` fill,
  and an **accent `PointLight`** above the spine tinted the current spread's
  `accent`, intensity swelling slightly with the breath. The table is a large
  dark disc / plane that receives shadows and fades into the background colour
  with fog.
- `scene.background` / fog colour lerp to the current spread's `palette.bg`
  over the turn. Renderer: ACES tone mapping, sRGB output, DPR capped at 2,
  `antialias: true`.

### Interaction

- First interaction opens the cover. Then: **click / tap** the right half of
  the viewport → next, left half → previous; **← / →**, `space` / `enter` →
  next; swipe. Input during a turn is ignored (or queues one turn).
- HUD (`src/hud.js`, DOM, minimal, serif, low-contrast ink that takes the
  spread's `accent` tint): a row of **dots** at the bottom (one per spread,
  current filled; clicking a dot jumps — a multi-leaf turn of the whole block
  in `1.8 s`); **arrows** at the left/right edges that fade in on hover near
  them; a **sound toggle** bottom-right (muted by default); a **breath ring**
  bottom-centre under the dots, 22 px, that swells with the breath. A one-line
  hint on first load ("click the book") fades after the first turn. `Escape`
  hides the HUD (and shows it again).
- Debug/query params read in `main.js`:
  `?page=<id|index>` open directly at a spread (no cover animation);
  `?theta=<0..1>` freeze the turn *into* that spread at that progress (so the
  previous spread is closing and this one is opening — scene authors use this
  to check their folds); `?scrub=1` adds a range slider that drives the same
  progress by hand; `?quality=low`; `?nohud=1`.
- Respect `prefers-reduced-motion`: turns at the same duration but no camera
  sway/parallax.

### Audio — `src/audio.js`

A single drone, created on the first sound-toggle click (autoplay rules). Per
voice (one per `intervals` entry): two detuned oscillators (`sine` + `triangle`,
±4 cents, slow drift), a gain with its own slow LFO (0.04–0.12 Hz) so voices
breathe in and out of each other. All voices → one lowpass whose cutoff follows
`brightness` and the breath (`breathe`) → a convolver reverb built from a
generated noise impulse (≈ 4 s, lowpass-shaped) mixed ~40 % → master gain with
a 2 s fade. On spread change, glide the voice frequencies over 3 s and crossfade
parameters; never click. Keep CPU use tiny.

### Boot & robustness

- Show nothing but the dark table until the book is built; no loading text
  needed (everything is procedural).
- Resize safe; `visibilitychange` pauses the loop; `dispose()` scenes never —
  they stay mounted once built (ten small scenes).
- Thumbnail: the gallery shoots `/` at 1280×800, DPR 2, 1200 ms after load.
  The cover must therefore look good on its own, **and** `package.json`
  `gallery.thumbnail` will click a dot to jump to a spread, so dots must be
  clickable from the closed state (`#dots .dot:nth-child(n)`).

## Art direction

One book, one hand. The language is **cut paper**: layered flat shapes, soft
shadows, a little grain, colours drawn from the spread's palette. Light and
particles are the only "unreal" things and they are what makes each jhāna
*felt*. Nothing figurative that would date it; silhouettes rather than faces.
Every spread should be beautiful **closed, half open and open** — the fold is
the show. Motion is slow and breath-locked; nothing twitches.

Each spread's text is fixed as below (do not improvise copy):

| id | label | title | pali | line |
| --- | --- | --- | --- | --- |
| `intro` | `` | `Breath` | `ānāpānasati` | `Sit. Let the breath find you.` |
| `jhana-1` | `1` | `First Jhāna` | `paṭhama jhāna · pīti` | `Rapture rises, born of letting go.` |
| `jhana-2` | `2` | `Second Jhāna` | `dutiya jhāna · samādhi` | `A spring wells up from within.` |
| `jhana-3` | `3` | `Third Jhāna` | `tatiya jhāna · sukha` | `Lotuses, drinking the cool water.` |
| `jhana-4` | `4` | `Fourth Jhāna` | `catuttha jhāna · upekkhā` | `Still. A white cloth over everything.` |
| `jhana-5` | `5` | `Infinite Space` | `ākāsānañcāyatana` | `Space, without edge.` |
| `jhana-6` | `6` | `Infinite Consciousness` | `viññāṇañcāyatana` | `Knowing, without edge.` |
| `jhana-7` | `7` | `Nothingness` | `ākiñcaññāyatana` | `There is nothing here.` |
| `jhana-8` | `8` | `Neither Perception nor Non-Perception` | `nevasaññānāsaññāyatana` | `Almost nothing. Almost.` |
| `outro` | `` | `Return` | `nirodha · emergence` | `Come back slowly. Carry the quiet.` |

Visual briefs (the canonical similes are from the Sāmaññaphala Sutta; use them
as the seed, not a storyboard):

- **intro — Breath.** Dusk-neutral paper. A still pond or a single seated
  silhouette, and the breath itself as a soft orb of light (the *nimitta*) that
  brightens and swells on the in-breath. Pop-up: low, calm — a horizon of two or
  three layered hills (parallel folds), the orb floating above the spine. The
  quietest spread; it teaches the breath ring.
- **jhana-1 — rapture.** Energy born of seclusion: tingling, rising, bright.
  Warm reds and gold. Pop-up: a sunburst / fountain of V-fold rays that fan
  up as the page opens; sparks and bubbles streaming upward, quickening on the
  in-breath. The most *alive* spread.
- **jhana-2 — the spring-fed lake.** "A lake with no inflow… a spring wells
  up from within and pervades it with cool water." Deep blues and teal, a gold
  glow at the centre. Pop-up: concentric rings of water (nested parallel folds
  or stepped arcs) rising around a central welling point; ripples propagate
  outward on each out-breath. Calm but inwardly moving.
- **jhana-3 — lotuses in the water.** "Lotuses born in water, grown in water,
  never rising above it, pervaded by cool water." Pinks, soft greens, pale
  water. Pop-up: lotus blossoms (V-fold petals, flaps that open with the page)
  sitting *in* a translucent water plane, light caustics drifting. Content,
  slow.
- **jhana-4 — equanimity.** "A man sitting covered head to foot in a white
  cloth." White, silver, the palest grey, a single cool shadow. Pop-up: a
  seated draped figure *or* a single pure form (a mountain, a stupa) under a
  moon — monochrome, almost nothing moves except a very slow light. Perfect
  stillness.
- **jhana-5 — infinite space.** The pages open onto depth. Indigo, violet, a
  far star-dust. Pop-up: a paper frame / arch (parallel fold) that acts as a
  window; through and beyond it the spread's background recedes — a
  vanishing grid or layered gradient planes stepping back forever, a few
  stars. Vast.
- **jhana-6 — infinite consciousness.** Awareness everywhere, luminous. Teal
  and violet, bioluminescent. Pop-up: a lattice / Indra's net of thin struts
  (V-folds) with glowing nodes; soft points of light that know each other —
  when one pulses, neighbours answer. Alive but not busy.
- **jhana-7 — nothingness.** The emptiest spread. Near-black paper, charcoal,
  one pale thread. Pop-up: almost none — one slender card standing (a tall
  narrow V-fold with γ = π/2) or an empty frame, a single mote drifting. Restraint
  is the whole point: it must still be beautiful.
- **jhana-8 — neither perception nor non-perception.** Forms at the threshold.
  Grey-mauve, pearl, vellum. Pop-up: translucent panels (parallel folds with
  `transparent`, `opacity ~0.35`) whose overlapping silhouettes almost form
  something and never quite do; ghost shapes that appear on the in-breath and
  dissolve on the out-breath.
- **outro — Return.** Emerging: dawn. Pale rose and gold on warm paper. Pop-up:
  a doorway or window (parallel fold frame) with morning light through it, a
  horizon of hills again (rhyme the intro), one or two birds (flaps). The
  breath orb returns, now steady. Ends with "begin again".

## Workflow for subagents

- Dev server: `cd packages/jhana-book && npx vite --port <your port> --strictPort`
  (ports are assigned in your brief; never use another agent's).
- Look at your work: `node tools/shot.mjs "http://127.0.0.1:<port>/?page=<id>&theta=1" /path/out.png`
  and at `theta=0.15`, `0.5`; read the console output it prints.
- Never run `git`. Never touch files you do not own. Do not run `npm run build`
  at the repo root (it empties shared output); if you must build, use
  `npx vite build --outDir /tmp/<you>` from the package.
