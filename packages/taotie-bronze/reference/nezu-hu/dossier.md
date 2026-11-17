# Dossier — nezu-hu (蟠螭文壺, Nezu Museum 90099)

Ground truth: ONE photograph by the project owner, `photo-11.jpg` (the front, the camera a little above the rim, a
long lens from ≈ 2 m: almost orthographic); label `card-12.jpg`. No outside source was consulted (none reachable).
Everything the photograph does not show — the back, the thickness of the handles across, the inside, the floor —
is INFERRED (the back repeats the front, as on every round hu).

Confidence tags: **[label]** read off the card · **[firm]** read directly off the photograph · **[good]** measured
through the fitted camera, ≈ ±3 % · **[est]** inferred or seen obliquely, ≈ ±10–15 % · **[guess]** not visible.

## Part names used in spec.json

| part | what it is |
| ---- | ---------- |
| `body` | the whole lathe: base band, plain convex foot ring, belly band (9 rows of interlace), cords (plain · twisted rope · plain), shoulder band (4 rows), twisted rope, plain neck (inscribed), everted lip |
| `handles` | the two sculpted feline dragons standing on the shoulder at ±90° |

## a. Identity [label]

- 蟠螭文壺 · *Hu with Panchi Design* · Bronze · China, Spring and Autumn period, 7th–6th centuries BC · Nezu Museum
  · number on the card 90099 · exhibit 17. The label gives **no dimensions, findspot, designation or inscription
  reading**.

## b. Form

### b.1 The camera (fitted)

A camera (elevation, distance, target height, focal length, roll, principal point) and five rings were fitted by
least squares (`.work/r8-hu/fit.py`) to points read on 1:1 gridded crops: the rim's FAR edge (the top of the
silhouette, nine points across) and its two side extremes; the base's NEAR edge (eight points; the dark band under
it is the contact shadow on the plinth, recognisable because it vanishes toward the sides); the side extremes of the
neck's waist, the belly and the foot ring (radius and height free). The rim's outer radius is the unit (100). The
fit runs to an almost orthographic camera (focal → ∞; any finite phone focal length of 1500–6000 px fits 3–10×
worse): the owner zoomed in from afar. **Elevation 7.8°, roll −1.0°, ≈ 5 px rms (max 10 px).** The rim ellipse
(b/a 0.105) and the base ellipse (≈ 0.12) agree with a ROUND plan at that elevation [good]. Correction for the
elevation is built into every height below: silhouette rows are ring centres (y = (v₀ − v) / (s cos el)); rows on
the front centre line are converted through the camera with the front point at r(y) (they sit ≈ r sin el lower in
the image). The neck's centre reads ≈ 20 px left of the body's (camera roll plus, perhaps, a slight lean of the
neck): half the FULL width was used wherever both sides are clean.

### b.2 Scale (INFERRED)

Nothing of known size is in frame (label card not in shot, plinth size unknown). Three internal yardsticks:
the stamped interlace's ribs read ≈ 5–6 px = 1.3–1.5 units wide; the inscription's characters ≈ 13 units tall; the
interlace rows ≈ 14.6 units. Taking ribs ≈ 1.6–1.8 mm and characters ≈ 15–16 mm (usual for Eastern Zhou cast or
incised vessel inscriptions) gives **1 unit ≈ 1.2 mm: H ≈ 448 mm to the rim, belly Ø ≈ 341 mm, rim Ø ≈ 238 mm,
neck waist Ø ≈ 176 mm, foot ring Ø ≈ 279 mm, rows ≈ 17.6 mm, the unit ≈ 24 mm**. Uncertainty **±20 %**;
proportions do not depend on it. [est]

### b.3 Vertical stack (mm, from the fitted camera; front centre-line rows → heights)

```
 448.3  rim: everted lip, r 119; the lip band flares from r ≈ 105 at 423                                  [good]
 314–425 plain neck, waist r 88 at ≈ 340–350; an incised inscription on the front (≈ 9 columns)          [good / firm]
 312.6  twisted rope at the foot of the neck                                                               [good]
 238.2–309.1 shoulder band: 4 rows of panchi interlace, r 128 → 91 (≈ 30° slope at mid height)            [good]
 221.2–238.2 cords: plain cord (224.4), twisted rope (229.7), plain cord (236.4); r 146 → 128 (a steep step)  [good]
 63.4–221.2 belly band: 9 rows of panchi interlace; belly widest r 170.4 at y ≈ 133                        [good]
 58–63  a short plain fillet into the foot                                                                 [est]
 7.4–58 plain convex foot ring, widest r 139.6 at y ≈ 29                                                   [good]
 0–7.4  base band r ≈ 131 (a pale up-facing bevel over a dark vertical face)                              [est]
```

### b.4 Plan and divisions

Round [good]. No flanges, no mould-line ornament. The interlace is continuous all round (stamped rows: no sector
centres). Handles at ±90°: both are seen exactly in profile on the silhouette. The back is assumed identical. [firm
for the front half; guess for the back]

### b.5 Sculpted parts — the handles [good in profile, guess across]

Read on a grid in handle-plane mm (`.work/r8-hu/hgrid.py`, the right handle; the left one mirrors it): a feline
dragon climbing the shoulder. Upper part a thick ring (x 97–135 mm from the axis, y 297–338) round a round opening
(Ø ≈ 15 mm, centre r 117.5, y 315.5) whose left side lies against the neck; on the ring's right the head (x 125–139,
y 305–338) looks out, flat-faced, the snout down, a tuft of two short horns on the crown (top y ≈ 338); transverse
ridges where the ring meets the head. The body runs from under the head steeply down and out to the tail — a
squared curl (x 128–151, y 252–275) with a hole through its middle, on a bar clamped to the shoulder; a haunch fills
the angle between body and shoulder, a small gap under the body at y ≈ 273. Incised scrolls and contour lines on the
sides [firm, simplified in the model]. **Thickness across is not visible** (both edge-on): 12 mm assumed, the head
16 mm [guess].

## c. Relief (read off the developed photograph, faces/dev-shoulder.jpg, dev-body.jpg)

- **Panchi interlace** (蟠螭文): narrow ROUND ribs (≈ 1.6–1.8 mm wide, ≈ 1–1.5 mm proud from their cast shadows
  [est]) in straight runs with rounded corners, ending in small blunt knobs, beads where bars meet; the ground between
  them flat and plain (no ground pattern). Rows ≈ 17.6 mm; along a row the autocorrelation of the developed image
  peaks at ≈ 24 and ≈ 48 mm (the unit and its mirror) [good]. Per unit (traced, kit `PANCHI_UNITS['nezu-hu']`): an
  arch (∩) with a G-hook in its bay, tied at mid height to a tall U with a tongue, the U's right limb rolling into
  the next bay; short knobbed bars along the foot of the row. Units per half turn = round(πr / 24) at each row's own
  radius (the cells narrow up the shoulder). [est: the photograph resolves ≈ 3.6 px/mm — enough for the vocabulary
  and the spacing, not for a line-for-line tracing of one block]
- **Cords**: plain round cords ≈ 2.4 mm; the twisted ropes ≈ 3–3.6 mm with strands every ≈ 2.4 mm slanting
  ≈ 50° [good].
- **Inscription** on the front of the neck: see § hu-fix below (7 columns, ≈ 25 graphs, engraved; traced, not read).

## d. Patina (photo-11)

Dark grey-brown noble skin; the interlace grey-green, pale green in the ground between ribs, rib tops brown; red-brown
cuprite patches on the lower right of the belly; the plain neck near-black with pale grey lime islands; the foot ring
near-black with a fine pale speckle; the handles greener at the joints. Preset `nezu-hu`.

## e. Where the dossier and the photograph disagree

Only the photograph exists. The research (research/01–04) is about Anyang décor and does not cover Eastern Zhou
pattern-block interlace: its relief grammar (flat plateaus, leiwen ground) does NOT apply here; the photograph wins
(round ribs, plain ground).

## r8 fix pass — re-readings (photo-11 wins where it disagrees with the first reading)

- **Panchi strands.** Measured on the developed photograph (6–8 px/mm) and on the detail crops: strands ≈ 2–2.2 mm,
  round-shouldered, centre lines ≈ 4.4 mm apart (the dominant stroke period of photo and render now agree within 5 %).
  The blind review's "4–4.5 mm flat strands, 75 % plate" is not what the photograph shows; the unit was redrawn denser
  (∩ loops with apex pellets, U loops, inward hooks, a C with a tongue, stems that interlock the rows) rather than fatter.
- **Cords.** The rope's strands are ≈ 5–5.5 mm long (not 2.5); the plain cords are flat ledges.
- **Belly décor lower edge** raised 5 mm (63.4 → 68.4) after overlaying the render on the photograph through the same
  camera. The silhouette rows confirm the foot ring is widest at mid-ring (0.58 H) and undercut at its top (0.536 H):
  it does NOT flare to the base (the review's claim); the profile was widened ≈ 2 % at the ring and pinched ≈ 3 % at
  the junction.
- **Lip.** A crisp lower edge at y ≈ 440, an 8 mm everted band above it.
- **Handles.** Re-read on a 5 mm handle-plane grid: a fat tube arch (14–17 mm) over the loop into the head; a C-volute
  at the shoulder; a broad foreleg strap down-left to a paw at (111, 281); a broad body strap down-right into a small
  rolled tail volute (142, 265.5); an open squared tail loop (x 116–137, y 244.5–267.5). The loop's foot is at y ≈ 245,
  not 252 (spec.json `handleFoot` updated to 0.546). Thickness across is still a guess.
- **Inscription.** About 8 columns at ≈ 22 mm on the front of the neck, characters ≈ 8–12 mm. Modelled from
  `inscription.json`, a raster extracted from the photograph (not transcribed; some false strokes from patina edges,
  some strokes lost where the photograph is soft, mostly in the lowest 25 mm).

## hu-fix pass — the owner's three points (photo-11 at full resolution; crops in `.work/hu-fix/crops/`)

### Handles: the animal's hind quarter and its horns [good in profile, guess across]

Re-read at 3–4× on a handle-plane grid (both handles; the left mirrored). Each handle is ONE small beast in the round:
the neck arches off the vessel's neck into the head (looking out, snout down); under the chin the chest carries a
C-volute from which the FORELEG (ribbed across) runs down-in to a paw pressed on the shoulder (≈ x 109, y 281); the BODY
runs down the outer side, transverse ribs on its back, into a round HAUNCH (≈ 141, 261) marked by an incised spiral on
its flank (the hip; the tail is rolled tight at the rump's outer lower corner — not separable from the hip volute on
the photograph [est]); a broad dark strap (the thigh / belly side) drops from under the chest straight onto the foot.
From the haunch the shank drops to the HOCK at the bottom outer corner (≈ 137, 248) and the FOOT lies flat along the
shoulder, heel to toes, up-inward to the toes at ≈ (118, 265), a contour line round its side and a curled toe. The
r8 model's "squared tail loop with a hole" (x 116–137, y 244–267) WAS this foot: its "hole" is the incised toe curl,
it is not pierced. Open ground shows only in the small triangle under the foreleg (x 113–122, y 268–277). On the
photograph the foot's outer edge lies ≈ 5 mm farther out than the model's shoulder at z = 0 (the silhouette there is
the shoulder's far side, seen from 7.8° above): the sole is set ON the model's wall.

**Horns**: a PAIR, side by side across the crown (left and right of the mid-line), short stout bottle horns — a stalk
with two rings swelling to a rounded knob ≈ 4.5–5 mm across — tips at y ≈ 336–338, leaning a little back. The left
handle (seen from its other side) shows one knob in profile, the near horn hiding the far one; the right handle shows
two tips ≈ 5 mm apart (the pair seen with a slight turn of the head) [good for shape and height, est for the splay
across, which the photograph cannot show]. The r8 model's three horns in a row were wrong.

### The neck inscription [firm that it exists and where; NOT read]

- **Where**: the front of the plain neck, between the lip band and the rope, from ≈ 2 mm above the neck's foot (arc
  y ≈ 320 mm) to ≈ 100 mm above it (y ≈ 418), across ≈ 145 mm of developed width (x ≈ −85 … +68 mm from the front
  centre line). Nothing shows on the shoulder or in the décor bands.
- **Layout**: SEVEN columns read with confidence, at developed x ≈ +64, +42, +20, −2, −25, −49, −77 mm (pitch ≈ 22–26
  mm), each with 3–5 graphs, ≈ 25 graphs visible in all; graphs ≈ 10–15 mm tall. Read, as usual, right to left. An
  eighth column may lie further right (x ≈ +80 … +95) under a lime patch: only blotches show there.
- **Technique**: ENGRAVED after casting, not cast: the strokes are hairlines of even width (≈ 0.5–0.7 mm, ≈ 2 px on the
  photograph), pale-filled, with sharp ends; they cut across corrosion and wander slightly, nothing of the rounded,
  sunk, wide-shouldered stroke of a mould-cast inscription [good].
- **What is read**: nothing with confidence. Candidates, all uncertain: c1g2 (right column, 2nd graph) is a cross with
  a swelling at the crossing — in bronze script the form of 七 "seven" (or a late 十 "ten"); c2g1 is two horizontals
  joined by two strokes meeting at the top (NOT 五: the strokes do not cross); c6g1 resembles 子 but has a forked head;
  c5g3 is two bars over two tree-like elements (林-like). Several graphs are lost under lime in the lower right.
- **What is modelled**: the strokes as seen, hand-traced on the developed photograph (`inscription.json`: 25 graphs,
  130 polylines, columns numbered from the right), cut as 0.6 mm × 0.3 mm V-lines; no stroke was completed, guessed or
  borrowed from another vessel. Lime-hidden parts are left blank. The r8 raster (with false strokes from lime edges) is
  replaced. View `detail-inscription` (ref `detail-inscription.jpg`).

### Body décor: the median line [good]

At 6× (crops b1, s1: belly and shoulder) every raised band of the interlace reads as TWO pale crests split by a dark
hairline: band ≈ 2.3–2.8 mm (≈ 8–10 px), groove ≈ 0.4–0.5 mm (≈ 1.5 px on the photograph), depth not measurable
(dark like the cast shadows: ≈ 0.3 mm assumed). The groove follows each band round its corners and through the joins,
stops short of the knobbed heads; a few heads show a dark centre (an eye dot) [est]. The same on the shoulder rows and
the belly rows; the cords and ropes are not split. Modelled with `kit.panchiBand(… median)` (KIT.md § Panchi).
