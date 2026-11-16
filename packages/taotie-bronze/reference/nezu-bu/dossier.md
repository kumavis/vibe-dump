# Dossier — nezu-bu (饕餮文瓿, Nezu Museum 90082)

Ground truth: ONE photograph by the project owner, `photo-06.jpg` (head-on at a belly mask, the phone at about the
height of the lid's ledge, ≈ 0.6 m away); label `card-07.jpg`. No outside source was consulted (none reachable).
Everything the photograph does not show — the back, the far side of the lid, the inside, the outer third of each
mask half — is INFERRED (the back repeats the front, as on every two-mask bu).

Confidence tags: **[label]** read off the card · **[firm]** read directly off the photograph · **[good]** measured
through the fitted camera, ≈ ±3 % · **[est]** inferred or seen obliquely, ≈ ±10–15 % · **[guess]** not visible.

## Part names used in spec.json

| part | what it is |
| ---- | ---------- |
| `body` | the whole lathe: plain base band, foot frieze (with four openings), foot collar, sloping underside, belly mask, divider band, shoulder frieze, plain shoulder slope with two raised lines, rounded lip, mouth under the lid |
| `lid` | ledge and domed lid (shell of revolution) |
| `knob` | the bud on two posts |
| `flanges` | 2 tall hooked divider flanges (±90°, shoulder + belly), 2 low beaded ridges (0°, 180°, mask centres), 4 foot flanges, 4 lid flanges |

## a. Identity [label]

- 饕餮文瓿 · *Bu with Taotie Design* · Shang–Western Zhou dynasty, 11th century BC · Nezu Museum · number on the
  card 90082 · exhibit 14. The label gives **no dimensions, findspot, designation or inscription**.

## b. Form

### b.1 The camera (fitted)

A pinhole camera (elevation, distance, target height, focal length, roll, principal point) and three profile rings —
foot base (y = 0, radius fixed at 100 units), the lid ledge's outer lower edge, the body's lip — plus the knob tip on
the axis were fitted by least squares to outline points read on 1:1 gridded crops (`.work/r8-bu/fit2.py`):
**1.6 px rms**, elevation 9.3°, focal ≈ 2050 px (a mildly zoomed phone), camera ≈ 0.61 m from the axis at ≈ 180 mm
above the plinth. The elevation is what makes the foot-base ellipse deep (b/a ≈ 0.3) and the lid ledge nearly
straight: the correction for it is built into every height below (heights come from intersecting rays with the
profile, not from pixel rows). The belly silhouette was read row by row behind the divider flanges' roots and
converted to rings (radius from the half width). **The belly reads ≈ 15 px left of the lid / foot axis** (its half
widths are consistent, its centre is not): either the bronze is cast slightly off-axis, the lid sits off-centre, or
the edge reading behind the flanges is biased — the body's faces and developments use the body's own principal
point (624 px vs 640). [good]

### b.2 Scale (INFERRED)

Nothing of known size is in frame. The fine ground lines of the shoulder repeat at ≈ 5 px on the front, where the
camera gives ≈ 4 px/mm at 1 unit = 0.8 mm; taking **≈ 1.25 mm** for the ground pitch (research/01 §1.3: 1.0–1.4 on
20–40 cm vessels; also ≈ 0.0044 × H, the usual ratio) gives **1 unit = 0.8 mm: H ≈ 282 mm to the knob tip (≈ 228 to
the lid crown, ≈ 177 to the body's lip), belly Ø ≈ 210 mm, ≈ 236 mm over the divider flanges, foot Ø ≈ 160 mm, lid
Ø ≈ 162 mm**. Uncertainty **±20 %**; proportions do not depend on it. [est]

### b.3 Plan and divisions

Round. **Two masks** (front and back) — the photograph shows the belly mask's eyes at θ ≈ ±30° (± 205 px) about the
low beaded ridge on the front centre line, and the divider flanges in profile ON the silhouette left and right, i.e.
at ±90° (a three-fold layout would hide them inside the outline). Shoulder dragons, lid mask and foot units are
symmetric about the same 0° line. The back (180°) is assumed identical. [firm for the front half; guess for the back]

### b.4 Vertical stack (mm, from the fitted camera)

```
 281.5  knob tip; bud widest Ø ≈ 27 at 261; on TWO posts (Ø ≈ 9, a gap between them) from the crown    [good / firm]
 227.6  lid crown; dome down to r 76 at 194.6; projecting ledge r 81 at 188–194                          [good]
 187.6  underside of the lid ledge; the body's mouth (r ≈ 71, dark) between it and the lip                 [good]
 175.4  body lip: a thick rounded rim r 75, a raised line at its foot (170)                               [good]
 158.6–171 plain sloping shoulder (r 93 → 79) with a faint dotted band and a raised line at 160.6        [good / est]
 127.4–158.6 shoulder frieze (dragons), r 103 → 93                                                         [good]
 123.6–127.4 narrow plain divider band                                                                       [good]
 77–123.6 belly mask (r 102 → 104.8 → 104)                                                                   [good]
 64–77  sloping underside to the foot (r 101 → 80)                                                           [good]
 54.4–64 foot collar: a convex ring (r up to ≈ 81)                                                           [good]
 19–54.4 foot frieze in three rows; openings centred at 34                                                   [good]
 0–19   plain base band, flaring to r 80                                                                     [good]
```

### b.5 Sculpted parts

- **Divider flanges** (±90°, y ≈ 66–154): ≈ 13 mm proud, ≈ 11 blocky teeth at ≈ 9.6 mm pitch on a solid spine
  (≈ 0.6 of the height); each tooth's upper outer corner rises in a short beak curling back over the narrow, C-shaped
  slot above it; the top rounds off into the shoulder (no spike) (photo-06, both in profile; 1:1 gridded crop of the
  left one). Thickness not visible (5.6 mm assumed). [good / est]
- **Mask ridges** (0°, 180°, y ≈ 78–158 across mask and shoulder): low (≈ 3 mm), narrow (≈ 3 mm), cut into beads
  every ≈ 4 mm. [firm]
- **Foot flanges** (0°, ±90°, 180°): the side ones show four teeth over the collar and the top of the frieze
  (y ≈ 34–63); the front one (and the back, inferred) is a low narrow notched ridge running down the frieze to the
  base band, no teeth (detail-foot). [good]
- **Lid flanges** (0°, ±90°, 180°, from the ledge to r ≈ 22): three chunky teeth each, ≈ 12–14 mm proud on a very
  low body, deep slots; each tooth a broad stem carrying a T-shaped bird head (crest notch on top, the hooked beak
  pointing toward the knob and curling over the next slot) (the right one in profile, 1:1 gridded crop). [good]
- **Knob**: an ogival bud on two posts side by side; the front lid flange runs up to them. Read on a 1:1 gridded crop
  (3.44 px/mm at the lid): bud Ø ≈ 26 mm (90 px), widest ≈ 22 mm below the tip, straight-sided ogive above, a round
  bulb below closing into a neck Ø ≈ 15 mm at ≈ 34 mm below the tip (bud h/w ≈ 1.3); the posts ≈ 7 mm wide each with
  a hairline slot (≈ 1–1.5 mm) between them, together the neck's width. [firm / good]
- **Openings**: four small squarish openings ≈ 6 × 5 mm in the foot, ≈ 17 mm (±12.5°) either side of each mask
  centre, each in a raised frame ≈ 1.5 mm wide. Whether they pierce the wall is not visible (dark): modelled as through-holes. [est]

## c. Relief (read off the developed photograph, faces/dev-*.jpg)

- **Belly mask** (47 mm tall, ≈ 164 mm of arc per half): broad flat-topped bands ≈ 4–7 mm wide, ≈ 2 mm proud
  [est from shading], cut along their length with two or three lines; a rounded-square eye frame (x 27–61 mm from
  the ridge) holding a big pillow eye (≈ 12 × 11 mm at x 55) and a squared hook; an oval nostril pocket under it
  (x 35); a nose column beside the ridge; a vertical band (x 68) and a huge rounded-square spiral HORN of three laps
  (x 73–127, ≈ 6.3 mm between laps); a row of C-hooks along the foot of the field; a fine squared-spiral ground
  (≈ 1.25 mm pitch). Beyond x ≈ 127 the wall turns away: an upright band and a C-hook up to the flange are INFERRED.
- **Shoulder frieze** (33.5 mm): a long-bodied dragon per half facing the ridge — a squarish head (eye boss ≈ 5 mm)
  with curled snout, jaw and a thin crest curling over; a FAT, smooth, domed S-shaped body (≈ 4–5 mm) sweeping over
  and round two low discs (Ø ≈ 13 and 11 mm) each studded with five or six dots; ground of fine lines following the
  creature. The tail beyond x ≈ 122 is INFERRED.
- **Foot frieze** (35 mm): fine raised threads — cartouches in three rows with squared spirals and C-hooks; the lower
  row is a pale band of squared spirals; the openings sit in the middle row by the flanges.
- **Lid** (legible only within ≈ 45 mm of the front flange): a fine leiwen strip along the ledge, a mask whose eye
  sits in a rounded frame and a G-horn running out toward the side flanges. Most of it INFERRED.

## d. Patina (photo-06)

Grey-green skin; the raised bands of mask and dragons worn paler grey-green; bright malachite powder in the belly's
pockets; reddish-brown patches on the plain shoulder; lid darker olive, the knob near-black and glossy; the foot's
plain base band pale. Preset `nezu-bu`.

## e. Where the dossier and the photograph disagree

There is only the photograph: nothing to disagree with. Where the research's typology would expect three masks
(many bu are three-fold), the photograph shows two (flanges on the silhouette at ±90°): the photograph wins.
