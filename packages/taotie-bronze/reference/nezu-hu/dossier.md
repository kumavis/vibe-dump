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
- **Inscription** on the front of the neck: ≈ 9 columns of 3–4 characters, ≈ 15 mm tall, incised and pale-filled,
  partly under lime patches [firm that it exists; NOT transcribed — the photograph does not read reliably]. Not
  modelled in this round.

## d. Patina (photo-11)

Dark grey-brown noble skin; the interlace grey-green, pale green in the ground between ribs, rib tops brown; red-brown
cuprite patches on the lower right of the belly; the plain neck near-black with pale grey lime islands; the foot ring
near-black with a fine pale speckle; the handles greener at the joints. Preset `nezu-hu`.

## e. Where the dossier and the photograph disagree

Only the photograph exists. The research (research/01–04) is about Anyang décor and does not cover Eastern Zhou
pattern-block interlace: its relief grammar (flat plateaus, leiwen ground) does NOT apply here; the photograph wins
(round ribs, plain ground).
