# 04 — Motif inventory: the surface vocabulary actually used on these bronzes

A foundry pattern-book for the seven reference bronzes: every distinct KIND of surface element, not every
instance, measured off the photographs and checked against what the Taotie Kit draws. Written in round 5
after the project owner compared the Met fangyi with its photograph and found the surfaces' design
language "differs dramatically": fat, rounded, organic shapes on the bronze; squared, evenly spaced,
typographic bars on the model.

**Sources and precision.** Measurements in mm come from the FLATTENED faces (`reference/<id>/faces/`,
§ Flat faces in KIT.md): Met fangyi 8 px/mm from 11–12 px/mm originals, read to ± 0.3 mm on crisp
edges; Nezu fangyi 6 px/mm from a soft phone photo (± 1 mm); Houmuwu 2 px/mm from museum-lit photos
(± 2 mm). Elements seen only on DETAIL photographs (Met zun, Met gu, and the two new pieces, Met gui
62.217 and the Met fangding) are given as fractions of a named reference or marked **[est]** with the
scale their dossier / notes give. Relief heights are not measurable from photographs; where given they
are read from shading and the dossiers and marked [est]. Each entry has a crop in `research/inventory/`
(≤ 600 px; from a flattened face where one exists, so its scale is known: crop px ÷ 8 = mm for the Met
fangyi crops, ÷ 6 Nezu, ÷ 2 Houmuwu at the crop's native size, which is ≤ 600 px except where noted).

Photograph vs dossier: where they disagree, the photograph is taken. Two cases matter here and are said
again in place: (1) the Met fangyi's ground is NOT a diagonal lozenge-and-spiral lattice (§ G1) — it is
big squared spirals whose mitred corners read as diagonals; (2) the Met fangyi's horns are not squared
"C" bars (as the round-4 model and research/01 §2.6's "fangyi: squared" note have it) but fat
round-cornered G-shapes whose tops carry spirals.

## Headline findings — what the kit lacked

1. **Band outline: outer and inner corners are independent.** On every Style V piece the outer corner of
   a band is round (radius ≈ 0.4–0.6 × the band width) while the inner corner is nearly square
   (≈ 0.1–0.2 ×). The kit's brush strokes (shapes.band, _strokes.Sheet.band) can only give outer = R + w/2,
   inner = max(0, R − w/2): round outside means round inside, or square inside means a w/2 outside.
   That single coupling is most of the "typographic" look. → **built: `roundStroke` (round / inner).**
2. **Bands are fat and vary in width.** Met fangyi horn bands are 9–11 mm wide on a 100 mm-tall mask
   (≈ 0.1 × mask height; the kit drew ≈ 0.05); they swell at corners and into the curl block, taper to
   points on hooks. → **built: per-control-point width.**
3. **Tops are drawn on.** A raised band almost never has a bare top: a thin sunk contour line runs
   0.6–2.9 mm inside the edge (wider on the outer side), the outer margin is often notched with short
   ticks, and the field inside carries a CHAIN of small round spirals (Met fangyi), parallel lines
   following the curl (horn blocks, ears, kui tails), scales (Houmuwu dragons) or leiwen (Met zun bottle
   horn). The kit had echo lines and a generic leiwen-on-plateau; no spiral chain, no per-side insets,
   no ticks, no coil. → **built: `carve` contour / fill / ticks.**
4. **Ends roll.** Hooks end in a rolled coil whose turns are separated by a narrow sunk gap (≈ 1 mm) —
   not a squared leiwen curl. → **built: `end: 'spiral'`.**
5. **Eyes are pillows.** The fangyi / gui / fangding eye is a convex rounded rectangle, steep at the foot,
   domed across the top, with a short sunk slit. The kit's L2 boss (distance-field dome) gives a
   hip-roof crease on a rectangle and a flat mesa with 'square'. → **built: `pillowBoss`.**
6. **Grounds are bigger than the kit's.** The Met fangyi ground is squared spirals in 6–11 mm cells
   (6–8 turns at ≈ 0.65–0.75 mm pitch), near-square, with NO S-pairs; the kit default packs 3–6 mm cells
   with 75 % S-pairs. No new code needed: `leiwenFill({ cell: [6, 11], pairs: 0, maxAspect: 1.35 })`.
   A true lozenge lattice exists only as a filler (Met gui) → **built: `lozengeFill`.**
7. **Absent from this set, present in the kit:** cicadas, whorl bosses, free-standing birds, silkworms,
   snakes, boss lattices. The kit's companion motifs are not wrong, they are simply not on these seven
   pieces. Do not add them to these vessels.

## How to trace a face (the recipe)

1. **Get the face flat.** `node tools/faces.mjs --list`; open `reference/<id>/faces/<face>.jpg`. It is
   orthographic at a fixed px/mm (8 for the Met fangyi): x mm = px / ppmm from the left edge, y mm =
   (image height − py) / ppmm from the bottom edge. Note the face's `center`, `width`, `height` in
   faces.json: face mm (0..width) ↔ the vessel panel you draw in is a translation (and, for a mould
   section, the half you mirror).
2. **Put a mm grid on it.** `.work/<you>/…/gridcrop.py`-style: crop the element, scale ×2.5, rule a
   line every 2 mm and label every 10 mm (the script used for this document is
   `.work/r5-motifs/scripts/gridcrop.py`; copy it). Read from the grid, never from memory.
3. **Read the centre line, not the outline.** For each band: walk its middle from one end to the other
   and write a control point at every corner and at every place its width changes (a collinear point
   is free: use it to hold a width or a margin along a segment). Read the band width at each control
   point (outer edge to inner edge). Note which side is outside (the side away from the turn).
4. **Corners.** Read the outer corner radius and the inner one, divide by the width: `round`, `inner`.
   Read each end: blunt (and its corner radius ÷ width → `capRound`), round, point, or rolled (count the
   turns, read the gap between them).
5. **Tops.** Read the contour line's distance from each edge (outer and inner separately: `inset:
   [left, right]`, left = left of your direction of travel), its width (`line`), whether the outer
   margin is ticked (pitch), and what fills the middle: spirals (their Ø, turns, line spacing → `pitch`,
   the land between them → `gap`, how square → `square`), lines (pitch), a coil (pitch, where its centre
   sits), scales, leiwen.
6. **Draw** `roundStroke` / `roundPlate` / `roundPoly` → `carve(panel, [...], { height, depth })` → eyes
   with `pillowBoss` → the ground last (`leiwenFill` with the measured cell size, or `lozengeFill`).
7. **Compare at the same scale.** Render the panel in clay with the key raking from the upper left and
   put it beside the crop (`tools/faces.mjs` on the vessel, or for a unit alone the harness in
   `.work/r5-motifs/scripts/field.mjs` + `shade.py`). Write down what differs; fix; repeat.

### Worked example — Met fangyi long face, main mask, left horn

Source: `reference/met-fangyi/faces/face-long-main.jpg` (152 × 100 mm, 8 px/mm); crop
`research/inventory/horn-g-spiral-chain.jpg` = face mm x 10..56, y 56..92.

Reading the grid (face mm):
- The horn is ONE plateau shaped like a G. Centre line: up the outer column from its blunt bottom end
  (50.4, 57.6) to the top-right corner (50.4, 83.05), along the top to (17.0, 83.05), down the inner
  column to (17.0, 62.8), and a short return to (22.6, 62.8) where it meets the curl block.
- Widths: outer column 9.4 (outer edge x 55.1, inner x 45.7); top 11.1 (88.6 → 77.5); inner column 10.4
  narrowing to 9.6; bottom return 6.4. A collinear point at y 77 on each column holds its width and
  margin before the corner changes them.
- Corners: outer radius ≈ 5 mm on a 10–11 mm band → `round: 0.5`; inner ≈ 1.8 mm → `inner: 0.18`. The
  bottom end is blunt with ≈ 3 mm corners → `capRound: 0.3`; the return ends flat against the block.
- Top: the contour line sits 0.6 mm inside the inner (left-of-travel: the G is drawn counter-clockwise)
  edge and 1.4 (columns) – 2.5 (top) mm inside the outer edge; line 0.5 mm. The outer margin carries
  short ticks every ≈ 4.2 mm. Inside, a chain of rounded-square spirals ≈ 5.5–6.5 mm across, three
  turns at ≈ 0.95 mm, 0.3 mm of land between neighbours.
- The curl block: 16 × 18.6 mm centred (30.6, 69.8), corner radius ≈ 6, cut with a concentric
  squared-round coil at 1.35 mm whose centre sits 1.2 left and 1.4 above the block centre.

```js
const P = (pts) => pts.map(([x, y]) => [x - X0, y - Y0])     // face mm → your panel (X0, Y0: the panel origin in face mm)
const band = kit.roundStroke(P([[50.4, 57.6], [50.4, 77], [50.4, 83.05], [17.0, 83.05], [17.0, 77], [17.0, 62.8], [22.6, 62.8]]), {
  width: [9.4, 9.4, 11.1, 10.4, 9.6, 6.4, 6.4], round: 0.5, inner: 0.18, start: 'blunt', end: 'flat', capRound: 0.3,
  contour: { inset: [0.6, [1.4, 1.4, 2.5, 2.5, 1.8, 1.6, 1.6]], line: 0.5 },
  ticks: { side: 'right', pitch: 4.2, line: 0.42 },
  fill: { kind: 'spirals', line: 0.5, pitch: 0.95, gap: 0.3, square: 0.3, tail: false, min: 3.6 } })
const block = kit.roundPlate({ c: P([[30.6, 69.8]])[0], w: 16, h: 18.6, r: 6, contour: false,
  fill: { kind: 'coil', pitch: 1.35, line: 0.45, offset: [-1.2, 1.4] } })
kit.carve(panel, [band, block], { height: 1.2, depth: 0.32 })
kit.pillowBoss(panel, { c: P([[45.1, 36.5]])[0], w: 14.4, h: 13.5, round: 0.42, height: 2.4, crown: 0.9,
  slit: { len: 4.8, width: 0.95, depth: 0.7, offset: [-0.5, -0.9] } })
kit.leiwenFill(panel, { margin: 0.5 }, { pitch: 0.72, depth: 0.3, line: 0.5, cell: [6, 11], pairs: 0, maxAspect: 1.35 })
```
The same data is the atlas preset `rounded / met-fangyi-horn` (`MET_FANGYI_HORN` in
`src/kit/relief/motifs/rounded.js`). What still differs from the photograph after tracing: the photo's
spirals are a little larger and tighter (3 full turns, almost touching the contour line) where the
kit's leave a little more land; the curl block's coil on the bronze runs on out of the bottom return
into the inner column (one continuous set of rings), where ours closes the return with a groove; the
photo's ticks are irregular in length and pitch. Those are tuning, not vocabulary.

## Entries

Format: **name** (Chinese) — crop · where · geometry · top · neighbours · **kit**.

### Horns (角)

**H1 G-horn with spiral chain** (卷角 / "G 形角") — `horn-g-spiral-chain.jpg` · Met fangyi main masks
(long and end faces, lid inverted). · Fat G (above). Band 9.4–11.1 mm; outer radius 0.5 w, inner 0.18 w;
blunt end 0.3 w; relief ≈ 1–1.5 mm [est], flat top, steep wall with a softly rounded arris (≈ 0.3–0.5 mm).
· Top: contour line 0.5 mm wide, 0.6 mm in from the inner edge and 1.4–2.5 from the outer; ticked outer
margin (≈ 4 mm pitch); chain of rounded-square spirals Ø 5.5–6.5, 3 turns at 0.95; curl block with a
concentric coil at 1.35. · Separated from the ground by ≈ 0.5 mm of clear land, from the block by a
single groove. · **Kit: was drawn wrongly** (taotie horn 'c' / 'crook': squared constant bar, inner
radius = outer − w, top with 1–2 echo lines and no spirals). **Now: roundStroke + roundPlate + carve.**

**H2 C-horn** (C 形角) — `mask-flush-zun.jpg` (upper horns), `band-plump-contour-fangding.jpg` · Met zun
belly, Met fangding long face, Met gui. · A C open downward/outward; on the zun the band is ≈ 0.11 × mask
height [est], round 0.4 / inner 0.15, flush (Style IV-V, lifted ≲ 0.3 mm) and outlined by a groove; on
the fangding a plump plateau with ONE sunk contour line and no fill. · **Kit: drawn squared (taotie
'c').** Now roundStroke with `contour` only (fangding) or with `style`-flush relief (`height` 0.15–0.3).

**H3 Bottle horn with leiwen panel** (瓶形角) — `horn-bottle-leiwen-zun.jpg` · Met zun belly (and foot).
· A rounded-rectangle frame (≈ 0.35 × 0.5 of the mask's half width [est]) standing on a stem that splits
into two J-feet curling outward. Frame band ≈ 0.1 × mask height; outer radius ≈ 0.6 w, inner ≈ 0.2 w.
· Top: flush; the frame's INSIDE is a sunk panel filled with two stacked squared spirals (leiwen
pitch ≈ 1 mm [est]) — i.e. leiwen on the ground inside a closed band. The J-feet carry a single centre
line. · **Kit: taotie horn 'bottle' exists but is drawn as a squared bar outline without the inner leiwen
panel.** Now: the frame as two roundStrokes (a ⊏ and a ⊐ whose blunt ends overlap; there is no closed-ring
stroke yet) + two J strokes; the inner panel = leiwenFill with `include` the frame's inside.

**H4 Coiled horn, deep pocket** (盘角) — `horn-coiled-nezu.jpg` · Nezu fangyi belly. · A thick C that
curls into a deep, round, sunk pocket (Ø ≈ 8 mm on a ≈ 30 mm horn); high relief (≈ 3–5 mm [est]),
ROUNDED section (domed, not flat-topped); top carries short feather ticks along the upper edge
(≈ 2.5 mm pitch). · **Kit: taotie horn 'coiled' — squared spiral, flat top, no pocket.** Now:
roundStroke `end: 'spiral'` with a large `gap` (the pocket) and carve `shoulder` ≈ w/2 (domed section),
`ticks`. The deep pocket is relief below the ground (≈ −1 mm): not representable by carve (ground is 0);
use `panel.sink` of a disc after carve.

**H5 Recumbent-S / sinuous horn** (S 形角) — `kui-houmuwu-frieze.jpg`, `kui-houmuwu-bottom.jpg` ·
Houmuwu friezes (the kui crests), Met fangding frieze. · An S lying on its side, two rolled ends of
opposite sense; band ≈ 0.15 × frieze height; rolled ends 0.6–1 turn. · **Kit: kui crest 'hook' is a single
squared hook.** Now: roundStroke with `start` and `end` 'spiral' (opposite `dir`), see atlas `shapes`.

### Eyes (目)

**E1 Pillow boss with slit** (方目 / 枕形目) — `eye-pillow-slit.jpg` · Met fangyi (main 14.4 × 13.5 mm;
frieze kui 5.6 × 5), Met gui, Met fangding, Met gu foot. · Superellipse ≈ exponent 5 (round 0.42); relief
≈ 2–2.5 mm [est] above the ground, steep foot, broadly domed top (crown ≈ 0.9). Slit 4.8 × 0.95 mm
(0.33 × w), sunk ≈ 0.7, set 0.5 mm left of and 0.9 mm below centre on the left eye. · Sits directly on the
ground: 0.5 mm of land, then leiwen. · **Kit: taotie eye 'square' / Sheet.boss 'square' = rounded rect
mesa (flat top, distance-field shoulder).** Now `pillowBoss` (atlas `pillow`).

**E2 Eye in a socket with canthus** (臣字目 framed) — `eye-socket-gu.jpg` · Met gu foot half-mask, Met zun
belly, Met gui. · A pillow boss (gu: ≈ 0.3 × the half-mask width [est]) inside a rounded-square socket
band ≈ 0.4 × boss width, whose outer corners are round 0.5 w and whose inner (canthus) corners extend
into short pointed hooks left and right. · **Kit: taotie eye 'chen' draws the canthus as squared hooks; no
round socket.** Now: roundPlate (socket, `contour`) + pillowBoss `base: 'field'` + two pointed roundStrokes.

**E3 Round eye with ring / dot pupil** (圆目) — `mask-flush-zun.jpg` · Met zun belly, Nezu. · Round boss,
Ø ≈ 0.12 × mask height on the zun [est], with a sunk ring or a dot. · **Kit: Sheet.boss 'round' + pupil
'ring' / 'dot' — draws this correctly.**

**E4 Lozenge eye with canthus** — not on these seven pieces (the kit's 'chen' is its stand-in).

### Brows, ears, nose, jaws, fangs

**B1 Hooked brow bar** (眉) — `brow-hooked-bar.jpg` · Met fangyi above each eye. · A bar 15 × 4 mm
(face x 37–52, y 49.5–53.5), round left end, right end turning down 90° into a 3 mm hook; outer radius
0.6 w, inner 0.15 w. Top: one contour line 0.5 mm inside. · **Kit: brow 'L' / 'hooked' — squared, thin
(≈ 2 mm).** Now roundStroke [[37, 51.5], [50, 51.5], [50, 47]] width 4, `end: 'round'`.

**R1 Ear / side C-curl** (耳) — `ear-c-curl.jpg` · Met fangyi beside the eye (face x 14–27, y 33–55).
· A C whose upper end rolls into a round spiral Ø ≈ 7 mm (3–4 turns at 1.0) and whose lower lobe is a
fat 8 mm band cut with parallel lines at ≈ 1 mm following its curve. · **Kit: ear 'c' — a squared C.**
Now: roundStroke `end: 'spiral'` + `fill: { kind: 'lines', pitch: 1 }`.

**N1 Nose ridge / central column** (鼻 / 扉棱侧) — `nose-ridge-end.jpg`, `body-column-spirals.jpg` · Met
fangyi end face (a central strip of stacked round spirals); long face (a vertical band beside the
flange, 8–9 mm wide, with a column of round spirals Ø ≈ 6 at ≈ 7 mm pitch). · **Kit: nose 'ridge' (ladder
ticks) / 'flange'.** Now: a vertical roundStroke with `fill: spirals` (the chain).

**N2 Nostril curls** — the Met fangyi end face shows two small C curls flanking the nose foot (Ø ≈ 6);
Met gu foot shows round-ended C hooks (`eye-socket-gu.jpg`, below the eye). · **Kit: nostril 'scroll'
(squared).** Now roundStroke C, `round` 0.8.

**J1 Jaw / cheek G** (颚) — `jaw-c-hooks.jpg` · Met fangyi main mask, bottom (face x 26–58, y 0–28): the
mirror of the horn, a fat G whose curl block sits under the eye. Same band widths (8–10 mm) and tops
(contour + spiral chain + coil). · **Kit: jaw 'hooked' — a thin squared hook.** Now as H1, mirrored.

**F1 Fangs / pointed hooks** (牙) — Met fangding (`band-plump-contour-fangding.jpg`, the barbed lower
hooks), Met gui, Houmuwu leg masks. · Tapering hook ending in a point, width 1 → 0 over ≈ 1.5 w. ·
**Kit: fanged jaw / quills draw squared barbs.** Now roundStroke `end: 'point'` with a width array.

### Bodies, tails, claws, quills

**K1 Jointed kui body with spiral chain** (夔龙身) — `kui-jointed-frieze.jpg`, `kui-foot-frieze.jpg` · Met
fangyi upper, foot and lid friezes. · Body band 8 mm on a 38 mm frieze (≈ 0.21 × H), running 45 mm,
divided into ≈ 5.5 mm segments each holding one round spiral Ø ≈ 4.5; a sunk joint line between
segments; the tail rises into a fat C (band 6) that rolls into a coil (≈ 0.9 turn). Head: a pillow eye
5.6 × 5 with slit, square snout, upturned lip hook, crest of two hooks. Claws: two short C legs ending in
round curls. · **Kit: kui 'fangyi-band' preset — squared, thin (0.23 H band but drawn as an outline
with echo lines), no spirals, no joints.** Now: roundStroke + `fill: { kind: 'spirals', joints: true }`,
`end: 'spiral'`; see `.work/r5-motifs/units/kui-body-vs-photo.png`.

**K2 Kui with scaled / C-hook striped body** (鳞身) — `kui-houmuwu-frieze.jpg`, `kui-houmuwu-bottom.jpg`
· Houmuwu friezes (dossier: "patterned with C-hook stripes"). · Body band ≈ 0.18 × frieze height (≈ 25 mm
on 140 [est]); top cut with transverse C-hooks / scales at ≈ 8 mm pitch [est]. · **Kit: kui marks
'c-marks' (squared), scales motif (rectangular band).** Now `fill: { kind: 'scales' }` along the body.

**K3 Kui with plain plateau and one contour line** — `kui-frieze-fangding.jpg` · Met fangding friezes.
· **Kit: kui 'carved-plateau' is close in idea, squared in shape.** Now roundStroke `contour` only.

**T1 Tails: rolled (卷尾) and upturned hook** — `tail-hook-lower.jpg` · Met fangyi main mask lower
corners: a fat band (7 mm) whose end rolls into a round spiral (1.2 turns). · Kit: tail 'spiral' squared →
`end: 'spiral'`.

**C1 Claws** (爪) — Met fangyi frieze kui (two per creature): a short J band 3.5 mm wide ending in a round
curl Ø 3. · Kit: Sheet claws squared → roundStroke J, `end: 'spiral'` turns 0.6.

**Q1 Quills / feather rows / margin ticks** (羽 / 刺) — `horn-g-spiral-chain.jpg` (ticks), Nezu horn
(feather ticks), Met fangding barbs. · Short sunk cross lines 0.4–0.5 mm wide at 2.5–4.5 mm pitch in the
outer margin of a band, or free barbs (tapering hooks) off a band's back. · **Kit: quills (taotie 0–6) are
free squared hooks; no margin ticks.** Now `ticks` (margin) / pointed roundStrokes (barbs).

### Birds, cicadas, blades, whorls

**Birds** — none free-standing; bird-headed kui crests only (Met fangyi foot frieze [unc]; Nezu neck).
Kit `bird` not needed on these pieces.
**Cicadas** (蝉纹) — none on these pieces. Kit `cicada` unused here.
**BL1 Rising blades** (蕉叶纹) — `blade-gu.jpg` · Met gu trumpet; Met gui under the lip (notes). · Long
narrow triangles, flush, outline groove + inner mask; see research/03 and the gu dossier for sizes. ·
**Kit: blade 'gu-trumpet' — correct in kind.**
**Whorl bosses** (涡纹) — none on these pieces.

### Grounds (地纹)

**G1 Big squared spirals, near-square cells** (雷纹) — `ground-leiwen-big.jpg` · Met fangyi everywhere. ·
Cells 6–11 mm (largest in open fields, ≈ 5 mm in strips), near square (aspect ≤ 1.35), each one squared
spiral of 6–8 turns at 0.65–0.75 mm pitch, groove ≈ 0.35 mm, corners mitred so that the concentric
rings line up into DIAGONALS — this is what reads as a "diagonal lozenge" ground in the photographs. No
S-pairs, few fillers. **Photograph vs brief:** the brief describes a diagonal lattice of lozenges with a
spiral or dot in each; the flattened photographs show no such lattice on the Met fangyi (look at
`ground-leiwen-big.jpg` and the right of `eye-pillow-slit.jpg`). · **Kit: drawn wrongly by default (cells
3–6 mm, 75 % S-pairs); correct with `leiwenFill({ pitch: 0.72, cell: [6, 11], pairs: 0, maxAspect: 1.35 })`
(see `.work/r5-motifs/units/eye-vs-photo.png`).**

**G2 Fine squared leiwen with S-pairs** (雷纹 / 双联) — Met zun, Met gu (`mask-flush-zun.jpg`,
`eye-socket-gu.jpg`), Met gui, Met fangding. · Pitch ≈ 0.8–1.0 mm [est], cells 4–7 mm, many S-pairs and
chains in strips; on the zun/gu the ground is inlaid black and the motif is flush. · **Kit: leiwenFill
defaults — correct.**

**G3 Nested lozenge filler** (菱形雷纹) — `ground-lozenge-nested-gui.jpg` · Met gui 62.217, the lower field
beside the jaw: one big lozenge ≈ 19 mm [est from the 159 mm rim], ≈ 9 concentric rings at ≈ 1 mm, cut
off by the motif. · **Kit: lacked.** Now `lozengeFill({ size: 19, fill: 'nested', pitch: 1, levels: 1 })`
(atlas `lozenge / met-gui-nested`).

**G4 Round spirals** (云纹) — only as fill ON raised bands (Met fangyi spiral chains), never as a ground on
these pieces. Kit `leiwen` 'cloud' exists; not needed as ground here.

**G5 T-hooks** — short T / L hooks fill the narrowest slivers on the Met fangyi and Met gu
(`eye-socket-gu.jpg` right edge). Kit leiwen fillers (C-hooks / stubs) — close enough.

**G6 Scale fill** — not a ground on these pieces (Houmuwu bodies only: K2).

### Fills on top of raised bands (summary)

| fill | where | measured | kit now |
| --- | --- | --- | --- |
| sunk contour line | every Style V band; fangding / gui: the only fill | line 0.4–0.6 mm; 0.6–1.1 mm in (inner), 1.4–2.9 (outer) | `contour: { inset: [l, r] }` |
| ticked margin | Met fangyi horns, Nezu horns | 0.4 mm lines, 2.5–4.5 mm pitch | `ticks` |
| chain of round spirals | Met fangyi horns, jaws, columns, kui bodies | Ø 4.5–6.5, 3 turns at 0.95, land 0.3 | `fill: spirals` (`joints` for kui) |
| parallel lines following a curl | Met fangyi ears, curl blocks, rolled tails | pitch 1.0–1.35 | `fill: lines` / `coil` |
| leiwen inside a closed band | Met zun bottle horn | pitch ≈ 1 [est] | leiwenFill `include` |
| scales / C-hook stripes | Houmuwu dragon bodies | ≈ 8 mm [est] | `fill: scales` |

### Flange notch rhythms (扉棱)

**FL1 Fangyi corner/centre flanges** — `flange-notches-fangyi.jpg` · Met fangyi: dense rectangular teeth,
pitch ≈ 3.2 mm on a ≈ 6 mm-deep flange [est from the 8 px/mm faces: ≈ 50 teeth over 166 mm], tooth ≈ 0.55 ×
pitch, notch depth ≈ 0.45 × flange depth; plain faces. · Kit: flange `notches: 'square'` — correct in kind
(owned by the vessel engineers' flange parameters).
**FL2 Gu ladder** — `flange-ladder-gu.jpg` · Met gu: 'score' ladder, rungs crest → root. · Kit: flange
`notches: 'score', rungs: 'full'` — correct.
**FL3 Houmuwu / fangding** — short flanges with sparse T / L notches. · Kit 'T' / 'L' — correct in kind.

## Element × vessel

✓ present · (✓) present in a variant · — absent. Kit column: ✓ correct · ✗ was wrong / lacking → now built
(the function) · = not needed here.

| element | Met fangyi | Nezu fangyi | Houmuwu | Met zun | Met gu | Met gui | Met fangding | kit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| G-horn + spiral chain (H1) | ✓ | — | — | — | — | — | — | ✗ → roundStroke + carve spirals |
| C-horn (H2) | — | (✓) | — | ✓ | (✓) | ✓ | ✓ | ✗ → roundStroke |
| bottle horn + leiwen panel (H3) | — | — | — | ✓ | (✓) | — | — | ✗ → roundStroke + leiwenFill include |
| coiled horn, pocket (H4) | — | ✓ | — | — | — | — | — | ✗ → end 'spiral' + shoulder + sink |
| recumbent-S (H5) | — | (✓) | ✓ | — | — | — | ✓ | ✗ → spiral ends |
| pillow eye + slit (E1) | ✓ | (✓) | — | — | ✓ | ✓ | ✓ | ✗ → pillowBoss |
| eye in socket + canthus (E2) | — | — | (✓) | ✓ | ✓ | ✓ | — | ✗ → roundPlate + pillowBoss |
| round eye ring/dot (E3) | — | ✓ | ✓ | ✓ | — | — | — | ✓ |
| hooked brow (B1) | ✓ | ✓ | — | (✓) | ✓ | ✓ | ✓ | ✗ → roundStroke |
| ear C-curl (R1) | ✓ | (✓) | — | — | — | — | (✓) | ✗ → spiral end + lines |
| spiral nose column (N1) | ✓ | — | — | — | — | — | — | ✗ → roundStroke spirals |
| nostril curls (N2) | ✓ | (✓) | (✓) | ✓ | ✓ | ✓ | ✓ | ✗ → roundStroke C |
| jaw / cheek G (J1) | ✓ | (✓) | — | (✓) | — | ✓ | ✓ | ✗ → as H1 |
| fangs / pointed hooks (F1) | — | (✓) | ✓ | — | — | ✓ | ✓ | ✗ → end 'point' |
| jointed kui body (K1) | ✓ | (✓) | — | — | — | — | — | ✗ → spirals + joints |
| scaled / striped body (K2) | — | — | ✓ | — | — | — | — | (✓) → fill scales |
| plain kui + contour (K3) | — | — | — | (✓) | (✓) | ✓ | ✓ | ✗ → contour only |
| rolled tail (T1) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ → end 'spiral' |
| claws (C1) | ✓ | (✓) | ✓ | — | — | — | (✓) | ✗ → J + spiral end |
| margin ticks / quills (Q1) | ✓ | ✓ | (✓) | — | — | (✓) | ✓ | ✗ → ticks / point |
| birds | — | (✓) crest | — | — | — | — | — | = |
| cicadas | — | — | — | — | — | — | — | = |
| rising blades (BL1) | — | — | — | ✓ neck | ✓ | ✓ | — | ✓ |
| whorl bosses | — | — | — | — | — | — | — | = |
| big squared leiwen (G1) | ✓ | (✓) | ✓ (2.4 mm) | — | — | — | — | ✓ with params |
| fine leiwen + S-pairs (G2) | — | ✓ | — | ✓ | ✓ | ✓ | ✓ | ✓ |
| nested lozenge (G3) | — | — | — | — | — | ✓ | — | ✗ → lozengeFill |
| T-hook fillers (G5) | ✓ | — | — | ✓ | ✓ | ✓ | ✓ | ✓ (fillers) |
| square-tooth flange (FL1) | ✓ | ✓ | (✓) | ✓ | — | — | ✓ | ✓ |
| ladder flange (FL2) | — | — | — | — | ✓ | — | — | ✓ |

Rows with (✓) for Nezu / Houmuwu rest on soft photographs; treat them as "probably".
