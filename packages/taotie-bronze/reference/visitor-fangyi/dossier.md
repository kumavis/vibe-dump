# Dossier — visitor-fangyi (方彝 with coiled-horn taotie and hooked flanges)

Ground truth: `three-quarter.jpg`, the owner's photograph. Two open-licence photos of the same object support it: `aic-harrsch-three-quarter.jpg` and `aic-sailko-front.jpg` (see §a and SOURCES.md).

Confidence tags: **[firm]** read directly and repeatably from the photos. **[good]** measured through the camera solve, about ±5 %. **[est]** inferred, one view, or the views disagree, about ±10–15 %. **[guess]** typological default, not visible.

## Part names used in spec.json

Each name is a `userData.part`. Tag every mesh with exactly one of them. Do not nest a tagged part inside another tagged part.

| part | what it is | y range (fraction of total H) |
| ---- | ---------- | ------------------------------ |
| `base` | the plain stepped plinth slab, including its up-facing ledge | 0 – 0.035 |
| `foot` | the foot register: foot frieze plus the plain dark band under it, set back from the plinth edge | 0.035 – 0.140 |
| `belly` | the bulging main register (鼓腹), from its lower plain border to the small top ledge | 0.140 – 0.390 |
| `neck` | the neck frieze plus the plain mouth band above it, on which the lid sits | 0.390 – 0.530 |
| `body` | optional: use it only if foot, belly and neck are built as one mesh. spec.json does not test it | 0.035 – 0.530 |
| `lid` | the hipped roof, from the eaves underside and plain eaves lip to the ridge beams. Includes any inner lid flange, but no flanges or knob | 0.530 – 0.825 |
| `knob` | the square post plus the miniature hipped roof | 0.825 – 1.000 |
| `flanges` | every flange strip on body, lid and knob, including the lid's centre-flange pegs and the foot-centre tab | — |

---

## a. Identity

**Identification: strong.** This is the Western Zhou fangyi in the **Art Institute of Chicago (AIC)**. AIC's own label, as photographed, reads "Western Zhou dynasty, late 11th century BCE" (Harrsch) and "c. 1020–1000 BC" (Sailko). Two independent Commons photographs taken in the AIC galleries show an object identical to ours in every specific feature I could compare:

1. The lid's upper kui frieze matches line for line: same crest curl, same boss eye and the same three-pronged body hooks (pair crop `p_lid.jpg` in the work dir).
2. A squared **peg** stands on the lid's front centre flange at the top of the upper frieze, with a second smaller block where the flange crosses into the main lid panel.
3. The **knob** is a miniature hipped roof with a mini-taotie (two pellet eyes over two inward C-scrolls) and downward-hooked eaves tips.
4. The belly mask has a **large squared spiral horn above a low, rounded-rectangular boss eye**, and a row of C-curls along the bottom.
5. A short rectangular tab hangs from the foot's front centre flange down onto the plinth ledge.
6. The corner-flange silhouettes match: a top cap-hook, one rectangular tooth in the upper third, and a pointed lower end.

Caveats:

- The accession number is **unverified**: the AIC API was not on the allowed host list.
- The owner's photo shows a dark grey wall, while the 2016 photos show beige linen walls. That fits a gallery reinstallation, or a loan, by 2026.
- Western Zhou fangyi were occasionally cast as near-twins. Every compared detail matches, so I treat the identification as strong, but a mould-sibling cannot be excluded from photographs alone.

**Date:** Western Zhou, late 11th c. BC (c. 1020–1000 BC, the reign of King Cheng or King Kang). **[firm, museum label]**

The style agrees independently with that date:

- the swelling 鼓腹 belly profile;
- the hooked F2/F3 flanges whose ends project beyond the register edges and the eaves;
- the **V-b / sculptural** treatment: big, smooth, high plateaus with few incised lines, and leiwen confined to narrow channels rather than a continuous sea;
- huge coiled horns that take over the upper half of the mask, with the eye pushed down;
- the steep, tall lid with a ridge beam and upturned ridge ends.

All of these are post-Anyang traits. **This vessel sits roughly a century later than the project's 13th–12th c. BC core.** It is a Zhou continuation of the Shang fangyi, not an Anyang piece. Label it that way rather than stretching the project's "late Shang" framing.

**Proposed label**

- **Title (en):** Fangyi Wine Container with Coiled-horn Masks
- **Title (zh):** 卷角兽面纹方彝 (西周早期)
- `type: 'fangyi'`, `date: 'c. 1020–1000 BC'`, `period: 'Early Western Zhou'`, `collection: 'Art Institute of Chicago (identification from photographs)'`
- **Blurb:** A lidded wine box from the first generations of the Zhou, cast a century after Anyang yet still speaking the Shang vocabulary, louder. The belly swells outward and the masks' coiled horns have grown until they crowd the eyes down toward the bottom of the field. Heavy hooked flanges break at every register and spring past the roof's eaves, the house-shaped lid carries a second, miniature house as its handle, and every gap between the deep-cut creatures is packed with thunder-spirals.

---

## b. Form

### b.1 Camera of the owner's photo (solved)

I solved a pinhole camera jointly against these landmarks: three plinth corners, the foot-centre tab, the knob's top edge and both hip-top ends of the ridge. The solve, with the aspect ratio left free, gave:

- **azimuth −25° ± 3** (camera on the front-left; we see the broad face and the left narrow face)
- **elevation +10° ± 3** (measured from the target at 0.48 H)
- **vertical fov 36° ± 3** on the 1350 × 1800 portrait frame, which is about a 2× phone tele crop
- **distance 2.3 H ± 0.2** to the target, so about 75 cm for H = 330 mm

Reprojection residuals are ≤ 20 px, with a median of about 5 px. The **horizon (eye level) falls at image y ≈ 585, about 0.62 H**, between the lid eaves and the ridge. That is why the ridge reads level while the plinth edges slope steeply. "Slightly from above" is true only for the lower body: the camera looks *up* at the knob. **[good]**

The inverted register heights below come from intersecting pixel rays with each register's face plane. They agree with the near-frontal Sailko view to within about 0.01–0.02 H once its high camera is allowed for.

### b.2 Overall size (assumption)

The object's dimensions are unpublished here. **I assume total H = 330 mm** (comparanda: Met 43.24.5 is 279 mm, the Ling fangyi 356 mm, early Western Zhou bulging fangyi are typically 280–410 mm). Every mm figure below scales with that assumption; the fractions do not.

| quantity | fraction | mm at H = 330 | conf. |
| -------- | -------- | ------------- | ----- |
| plinth front width W (broad face) | 0.533 H | 176 | [good] |
| plinth depth D (narrow face) | W / 1.17 | 150 | [est] |
| **plan aspect W : D (broad : narrow)** | **1.17 ± 0.12** | — | [est] |
| overall bbox (with flanges) w × d × h | 0.685 × 0.56 × 1 H | ≈ 226 × 186 × 330 | [est] |

The free plan-aspect fit gave 1.16–1.17. A cruder plinth-only solve gave 0.95, and the ridge running parallel to the broad face argues for > 1. The photos establish that the broad face is the one carrying the lid kui frieze and the face-centre peg, so treat that face as **front (+Z)**.

### b.3 Vertical stack (front centre line), bottom to top

```
 1.000 ┬ knob roof top (flat, slightly dished)          ─┐
       │  knob roof (mini hipped roof, hooked eaves tips)│ knob 0.175 H (58 mm)
 0.865 ┤  knob eaves (tips hang to ≈0.85)                │
       │  square post (plain)                            │
 0.825 ┼ ridge beam top (upturned ends)                 ─┤
       │  upper lid frieze (kui pair)        0.185 of slope
       │  separator bar                       0.035      │ lid roof 0.295 H (97 mm)
       │  main lid taotie panel               0.64       │ slope ≈ 50° front, ≈ 65° narrow sides
 0.566 ┤  plain eaves lip (powder ledge)      0.086      │
 0.530 ┼ eaves underside / lid joint (dark gap line)    ─┘
       │  plain mouth band, recessed ≈2 mm               ─┐
 0.478 ┤  neck frieze (kui/bird pairs)                    │ neck 0.140 H (46 mm)
 0.400 ┤  small up-facing ledge (belly top steps out)     │
 0.390 ┼ belly top edge                                  ─┘
       │  belly: coiled-horn taotie, deep relief          │ belly 0.250 H (83 mm)
       │  max swell at ≈0.32 H                            │
 0.160 ┤  plain lower border of belly, curving under      │
 0.140 ┼ belly bottom / foot top (hidden by overhang)    ─┘
       │  foot frieze (kui)                    ≈0.070 H   │ foot 0.105 H (35 mm)
       │  plain dark band                      ≈0.030 H   │
 0.047 ┤  foot meets plinth ledge                         │
 0.035 ┼ plinth top edge (ledge, ≈5 mm wide)             ─┤
 0.000 ┴ plinth bottom                                    │ base 0.035 H (12 mm)
```

| element | y0–y1 / H | height mm | conf. |
| ------- | --------- | --------- | ----- |
| base (plinth slab) | 0 – 0.035 | 12 | [good] |
| foot register | 0.035 – 0.140 | 35 | [good] |
| belly register | 0.140 – 0.390 | 83 | [good] |
| neck frieze | 0.400 – 0.478 | 26 | [good] |
| mouth band | 0.478 – 0.530 | 17 | [est]; the band belongs to the body (a gap line runs above it in the Harrsch photo) |
| lid eaves lip | 0.530 – 0.566 | 12 | [good] |
| lid slope (eaves to ridge) | 0.530 – 0.825 | 97 | [good] |
| knob post (visible) | 0.825 – 0.865 | 13 | [est] |
| knob roof | 0.865 – 1.000 | 45 | [est] |
| body (base → mouth top) | 0 – 0.530 | 175 | [good] |
| lid + knob | 0.530 – 1.000 | 155 | [good]; **taller than the Anyang norm of 0.33–0.40 H**, a deliberate Zhou-period trait |

### b.4 Plan widths (broad face W, narrow face D = W / 1.17)

| level | W / plinth W | W mm | D mm | conf. |
| ----- | ------------ | ---- | ---- | ----- |
| base | 1.00 | 176 | 150 | [good] |
| foot (set back to leave a ≈5 mm ledge) | 0.94 | 165 | 141 | [good] |
| belly bottom edge | 0.97 | 171 | 146 | [est] |
| belly max (0.32 H) | **1.10** | 194 | 166 | [est]; our photo gives 1.07 and the Sailko front view 1.15 after perspective correction |
| belly top edge | 1.066 | 188 | 160 | [est] |
| neck | 0.98 | 172 | 147 | [good] |
| mouth band | 0.96 | 169 | 144 | [est] |
| lid eaves | 1.07 | 188 | 161 | [est] |
| ridge length (along X) | 0.74 | 131 (0.396 H) | ridge beam ≈ 8 thick | [est]; the Sailko view suggests 0.65 of the eaves |
| knob roof eaves (tip to tip) | 0.42 | 74 | ≈ 50 [guess] | [good] W, [guess] D |
| knob roof top | 0.25 | 45 | ≈ 30 [guess] | [est] |
| knob post (square) | 0.15 | 26 | ≈ 20 [guess] | [est] |

- **Eaves overhang** past the mouth band: about 10 mm per side on the broad faces and about 8 mm on the narrow faces. **[est]**
- The eaves line is **slightly concave**: the corners turn up by about 3 mm, so do not measure the plan from the eave corners.
- **Lid slope:** the broad faces rise about 97 mm over a run of about 76 mm, roughly **50° ± 6°**. The narrow faces rise 97 mm over about 29 mm, roughly **65–70°**, nearly a gable. **[est]** Both are steep for a fangyi; the photos show it clearly (the front-left hip line projects almost vertically at this azimuth).

### b.5 Belly bulge profile (鼓腹)

Use the same profile on all four faces. Faces are planar across their width; the bulge is in elevation only.

- `s` runs 0 to 1 bottom to top of the belly register.
- "offset" is measured outward from the neck wall plane.
- The narrow faces use the same factor divided by 1.17.

| s | y / H | y mm | half-W broad (x) mm | half-D narrow (z) mm | offset vs neck wall mm |
| --- | --- | --- | --- | --- | --- |
| 0.00 | 0.140 | 46 | 85.3 | 72.9 | −0.9 |
| 0.05 | 0.153 | 50 | 86.6 | 74.0 | +0.4 |
| 0.10 | 0.165 | 54 | 87.9 | 75.2 | +1.8 |
| 0.20 | 0.190 | 63 | 90.6 | 77.4 | +4.4 |
| 0.30 | 0.215 | 71 | 92.8 | 79.3 | +6.6 |
| 0.40 | 0.240 | 79 | 94.5 | 80.8 | +8.4 |
| 0.50 | 0.265 | 87 | 95.7 | 81.8 | +9.5 |
| 0.60 | 0.290 | 96 | 96.5 | 82.5 | +10.3 |
| 0.70 | 0.315 | 104 | 96.7 | 82.7 | +10.6 |
| 0.80 | 0.340 | 112 | 96.6 | 82.5 | +10.4 |
| 0.87 | 0.358 | 118 | 95.9 | 81.9 | +9.7 |
| 0.93 | 0.373 | 123 | 95.0 | 81.2 | +8.8 |
| 0.97 | 0.383 | 126 | 94.3 | 80.6 | +8.1 |
| 1.00 | 0.390 | 129 | 93.7 | 80.1 | +7.6 → steps back to the neck (≈7 mm ledge, up-facing, powder-filled) |

- The swell over the foot is about **+21 mm per side** (belly max half-W 96.7 against foot 82.5).
- The swell over the neck is about **+10.5 mm** per side.
- The underside from s = 0 to 0.1 curves back under toward the foot, which is why the camera never sees the foot's top. **[est]**

### b.6 Flanges (扉棱)

The layout, **[firm]**:

- **8 axes on the body**: 4 corners and 4 face centres. Each axis is broken into three separate segments (neck, belly, foot).
- **8 on the lid**: 4 hip flanges along the hips and 2 face-centre flanges on each narrow and broad face.
- **4 small plain corner ridges on the knob.**
- **Segments break at every register boundary.** A gap of 3–6 mm (about 0.015 H) leaves the wall visible, so the silhouette shows a notch at the neck/belly and belly/foot joints.

| family | thickness t | projection p | profile | conf. |
| ------ | ----------- | ------------ | ------- | ----- |
| body corner flanges (diagonal, 45°) | 6 mm (0.018 H) | neck 9, belly 14, foot 10 mm | F2 hooked | [est] |
| narrow-face centre flanges | 7 mm | belly 16–18, neck 11, foot 11 mm | F2 hooked, the heaviest flanges on the vessel | [est] |
| broad-face centre flanges | 7–8 mm | 5–7 mm | low blocks (see below) | [est] |
| lid hip flanges | 7 mm | 7 mm | plain bar; lower end projects **12–15 mm past the eave corner** as a downward point; upper end meets the ridge beam's upturned end | [good] |
| lid face-centre flanges | 7 mm | 6 mm | plain bar with **pegs** (broad faces) | [good] |
| knob corner ridges | 4 mm | 3 mm | plain; eaves tips hook down and inward | [est] |

Flange faces carry incised T/L lines and small spirals, visible on the front-right corner flange's flank. They are 0.6 mm wide, 0.4 mm deep, and inset 1.5 mm from the outline. Flange crests are flat with slightly rounded arrises.

**Segment silhouettes** in normalised coordinates: `p` is the outward distance from the wall in units of that segment's projection; `s` runs 0 to 1 along the register height. Polylines run from the wall at the bottom, around the outside, and back to the wall at the top.

```
 belly corner / narrow-centre segment          neck segment              foot segment
   s                                            s                         s
 1.03 ┌──────┐ cap hook (out & slightly up)   1.06 ┌──┐ top hook        1.0 ┌──────┐ top hook
      │     ┌┘                                     │  └┐                    │ ┌────┘
 0.80 │     └──┐ rectangular tooth                 │   │                    │ │
      │        │                               0.62│  ┌┘ notch          0.55│ └──┐ mid tooth
 0.64 │     ┌──┘                               0.50│  └┐                    │ ┌──┘
      │     │                                      │   │                    │ │
      │    /   outer edge curves in                │   │                0.10│ └───┐ lower hook
      │   /    with the belly                  0.00└───┘                    │     ╲ points down
 0.00 │  ╱                                                             -0.10└──────▼ onto ledge
-0.05 └─▼ pointed lower end
 wall  p→
```

Polylines `[p, s]`:

- **Belly corner and narrow-face centre:**
  `[0,1.03] [1.05,1.03] [1.05,0.96] [0.95,0.94] [0.95,0.80] [1.25,0.80] [1.25,0.66] [0.95,0.64] [0.90,0.50] [0.78,0.30] [0.60,0.12] [0.45,0.00] [0.35,-0.05] [0.0,0.02]`
  Scale `p` by 14 mm on corners and 17 mm on the narrow-face centres. The cap rises about 3 mm above the belly top edge and hooks outward, so in the three-quarter view **the belly flanges read as hooks springing out above the belly's shoulder.** **[good]**
- **Neck:** `[0,0] [1,0] [1,0.50] [0.7,0.52] [0.7,0.60] [1,0.62] [1,0.96] [1.2,1.0] [1.2,1.06] [0,1.06]` (top hook rises above the neck top). **[est]**
- **Foot:** `[0,1] [1.15,1] [1.15,0.9] [0.85,0.85] [0.85,0.55] [1.05,0.53] [1.05,0.40] [0.85,0.38] [0.85,0.12] [1.1,0.05] [0.9,-0.10] [0.0,-0.10]` (the lower hook points down onto the plinth ledge). **[est]**
- **Broad-face centre flanges**, with low projection:
  - lid: a plain bar with a **tall squared peg** (about 8 × 8 × 14 mm) standing up from the bar at the top of the upper kui frieze, plus a smaller block (about 7 mm) at the top of the main lid panel;
  - neck: one rectangular block 9 × 26 mm;
  - belly: a bar with a small round **boss at eye level**;
  - foot: a short tab whose lower end (a rounded block) hangs **below the foot frieze onto the plinth ledge**.

  **[good]**

**Projection past the eaves and foot:**

- The hip-flange ends are the outermost points of the lid.
- The belly corner and narrow-centre flange caps are the widest points of the silhouette, at about 0.39 H.
- The foot corner hooks reach about 5 mm beyond the plinth edge, with their lower hooks dropping onto the ledge.

---

## c. Décor map

**Coordinates** follow research/01 §2.1: the half-mask has `x` running 0 at the centre flange to 1 at the corner, and `y` running 0 at the register bottom to 1 at its top. On the lid, `y` runs **up the slope** from the eaves.

**Style:** Loehr V, **V-b ("smooth plateau") with sculptural high relief.** Plateaus are broad (band width about 0.07–0.09 of the register height), rounded-shouldered and mostly smooth, with **1 incised contour or spiral line** each. Leiwen fills only the channels between plateaus; it is not a continuous sea.

**Relief levels**, measured from shadow lengths in the owner's photo at about 3.7 px/mm:

| level | height above ground | relative to flange thickness (6–7 mm) |
| ----- | ------------------- | ------------------------------------- |
| L0 leiwen grooves | −0.4 mm, pitch ≈ 0.9 mm (cells 4–6 mm, 2–2.5 turns) | — |
| L1 belly plateaus (horn, eye frame, body bands) | **3.0 ± 0.7 mm** | ≈ 0.45 t |
| L2 belly eye boss | **+2 mm above the plateau (≈ 5 mm total)** | ≈ 0.75 t |
| L1 lid plateaus | 2.5 mm | — |
| L2 lid eye bosses | +2 mm | — |
| neck and foot friezes | 1.2–1.5 mm | ≈ 0.2 t |
| knob mini-mask | 1–1.5 mm, pellet eyes +1 mm | — |

This is **deep relief**. The plateaus cast shadows longer than their own band width under the gallery spot. Leiwen pitch is about **1/90 of the belly register height** and about 1/30 of the neck frieze height. **[est]**

### c.1 Belly, broad face: one coiled-horn taotie centred on the face flange [good]

```
 y=1 ┌──────────────────────────────────────────────┬──── centre flange (x=0, boss at y≈.45)
     │ ░░leiwen░░ ┌──horn root band──────────┐░░░░░│
     │ ear/tail  ┌┘  ╭────────────╮           │░░░░│   x=0.93 spiral (ear / tail curl) at y .75
     │ spiral ◎  │   │  ╭──────╮  │ horn       │░░░░│
     │     ┃ F   │   │  │  ◎   │  │ spiral     │░░░░│   horn spiral centre (0.40, 0.66),
     │ body┣━    │   │  ╰──╮   │  │ R≈0.20     │░░░░│   1.25 turns, squared-round
     │  band     └───╰─────╯───╯                 ░░░│
     │ ┣━━ claws ┐  ┌────────┐ ┌─┐               ░░░│   eye frame: rounded square
     │ ┣━        │  │ ( ═══ )│ │ │ inner canthus  ░░│   centre (0.24, 0.31), 0.19 x × 0.24 y
     │           │  │  boss  │ │ │ runs up to horn ░│   boss dome with slit (L2)
     │ ◎═══C═══C═╧══╧════════╧═╧═C══ lip/jaw row ═══│   y .05–.15: row of C-curls (lip, jaw)
 y=0 └──────────────────────────────────────────────┘
     x=1 (corner flange)                        x=0
```

- **Configuration:** close to grammar T2 (ram-horn), but with the Zhou "big horn" proportions. Body mode `band`: a short body in the outer third. `nose: 'flange'`.
- **Horn:** H2 inward-curled, built as one **wide band** (0.08 H_p).
  - It rises from the forehead next to the flange at the top (x 0.05–0.15, y 0.95), runs outward along the top edge to x ≈ 0.62, turns down, then curls **back toward the axis and up** into a squared-round spiral.
  - Spiral centre (0.40, 0.66), outer radius about 0.20 H_p, 1.25 turns.
  - One incised line follows the band and ends in the spiral eye.
  - It is the largest mass in the panel and occupies the whole upper half.
- **Eye:** a 臣-derived **rounded-rectangular frame eye**: a raised square loop band with corner radius about 0.4 × side.
  - Low in the field: centre (0.24, 0.31), frame 0.19 x-units × 0.24 H_p.
  - It holds a **flattened oval boss** (about 0.10 × 0.08 H_p, height/radius ≈ 0.45) with a **horizontal slit** (groove) across it.
  - The inner canthus is a band running from the frame's upper inner corner **up to the horn root** (an inverted-L), not a downward hook.
  - Pupils sit at 0.48 of the full mask width apart.
- **Brow:** absent, because the horn sits on the eye.
- **Ear / tail:** an outer squared spiral at (0.93, 0.75), radius 0.09.
- **Body:** a vertical "F" band at x ≈ 0.75 with two outward hooks (legs or quills), plus a horizontal body band at y ≈ 0.25 running to the corner with 2 downward **claw hooks**.
- **Jaw / lip:** a row of 3 C-curls along y 0.05–0.15, opening upward. There are no visible fangs. **[est]**
- **Crest:** none; the flange takes its place.
- **Ground:** leiwen in the channels: the vertical strip x 0.05–0.15 between flange and horn, the top band above the horn, and the slots between body hooks.
- **Halves** are mirrored about the centre flange with about 3 % carving asymmetry.

### c.2 Belly, narrow face [est]

- The same mask is compressed horizontally: half-panel aspect 0.90, against 1.06 on the broad face.
- The horn spiral moves to (0.36, 0.68) and the eye to (0.25, 0.32).
- The outer F-body is reduced to one hooked band.
- The heavy narrow-face centre flange (p ≈ 17 mm) takes the nose.

### c.3 Neck frieze, both faces [good on the broad face, est on the narrow]

```
 ┌──────────────────────────────────────┬flange┬──────────────── (mirror)
 │ ╭S-crest  ◉eye    ╭S-crest  ◉eye  ▐ │block │ ▌
 │ ╰╮   ╭──╮╰beak    ╰╮   ╭──╮╰beak  ▐ │      │
 │  ╰───╯  ╰──→axis   ╰───╯  ╰──→     │      │
 │ C═══┳═══┳══C     C═══┳═══┳══C       │      │   lower body band, C-spiral tail, hooked feet
 └──────────────────────────────────────┴──────┴────────────────
```

- **Two profile creatures per half-face**, all facing the centre flange; mirrored on the other half.
- Each unit is about 1.35 : 1 (width : height) and is a **kui with a long curled crest**, possibly a bird-headed kui (鸟首夔):
  - a small round boss eye at the head (axis-side top corner);
  - an S-curl crest rising over the head and curling back;
  - a U-shaped neck/body band sweeping back;
  - a long lower band ending in a C-spiral tail, with 2 short hooked feet.
- Flat plateaus with one centre-line groove, about 1.3 mm high, on fine leiwen (pitch ≈ 0.9 mm).
- Register height 26 mm, with a plain border of about 1 mm top and bottom.

### c.4 Foot frieze [est; the foot is the darkest region in all photos]

- One **long-bodied kui per half-face**, facing the centre tab:
  - a C-spiral head with a pellet eye at the outer end;
  - a horizontal body band carrying 3–4 upright hooked fins (the "E/F" shapes);
  - a C-tail near the tab.
- Low relief (≈ 1.2 mm) on leiwen. Frieze height ≈ 0.07 H.
- A plain dark band of about 10 mm runs below it.
- The right half reads as a translated copy rather than a strict mirror. This is visible in the owner's photo; record it as an asymmetry to keep, at low confidence.

### c.5 Lid, broad faces (trapezoidal slope)

The slope is partitioned upward from the eaves: plain eaves lip 0.086, main panel 0.64, separator bar 0.035, upper frieze 0.185, ridge margin 0.058.

```
 ridge ──────────────[ridge beam, upturned ends]──────────────
   ┌ upper frieze ────────────┬PEG┬──────────────────────┐
   │ ~~tail  body═╤═╤═ ◉ crest╯│   │ (mirror)             │   kui pair facing the peg
   ├──────────── separator bar ┼─▪─┼──────────────────────┤
   │ ┃F  hooks    ╭brow╮ ◦boss │   │                      │
   │ ┃            │ ◉  │       │ c │   main panel:        │   eye boss (0.29, 0.69)
   │ ┃━ body   ╭──┴────┴╮      │ e │   eye high,          │   big square spiral (0.44, 0.30)
   │ ┃━        │ ◎ big  │      │ n │   spiral below       │
   │ ◎ tail    ╰ spiral ╯      │ t │                      │
   │   T  T  claws along eaves │ r │                      │
   └───────────────────────────┴ e ┴──────────────────────┘
   ═════ plain eaves lip (pale powder) ═════════════════════  eaves
```

**Main panel** [good]:

- Domed oval eye boss with a slit at (0.29, 0.69), boss about 0.10 × 0.08 of the panel height.
- An arched brow band over it ends in up-curls.
- A small extra boss sits at (0.08, 0.92) by the flange peg.
- Below the eye, a **large squared spiral** centred at (0.44, 0.30), radius ≈ 0.18.
- An outer vertical "F" body at x ≈ 0.85 with hooked arms, ending in a spiral tail at (0.90, 0.25).
- Two or three downward claw hooks along y ≈ 0.05 at x 0.3–0.6.
- Leiwen in the channels.
- Read it either as an **inverted mask** (the normal fangyi-lid convention: right way up when the lid lies upside down) or as an upright profile-body mask. For modelling it does not matter: place the masses at these coordinates.

**Upper frieze** [good]:

- One kui per half, facing the centre peg.
- Round boss eye at x ≈ 0.25 under an up-curled crest.
- Open jaws toward the peg.
- Body band running outward, with 2 down-hooks and a long tail curling up at x ≈ 0.95.

### c.6 Lid, narrow faces [est]

- Steep trapezoids (≈ 65°) with their own centre flange.
- Each half holds a vertically stretched mask: a domed boss eye at about y 0.6, a spiral below it, and hooks to the hip.
- The narrow faces show **no separate upper frieze**. They are too short at the top: the ridge ends there.

### c.7 Knob [good]

- Front face trapezoid: top 45 mm, eaves 74 mm, height 45 mm.
- A **mini-taotie** sits on a plain border of about 3 mm:
  - two pellet eyes (bosses ≈ 4 mm) at (±0.18 of face width, 0.62 of height);
  - a small pellet "crest" between them;
  - two inward C-scrolls below (jaws or horns) at y ≈ 0.30;
  - an incised line on the scrolls.
- Corner ridges are plain. The eaves corners end in **down-and-in hooks**, open loops about 6 mm long.
- The top is flat, slightly dished, with a raised rim.
- The narrow faces of the knob are similar but plainer. **[guess]**

### c.8 Plain bands

- Plinth (front face and ledge), the dark band under the foot frieze, the belly's lower border, the mouth band, the eaves lip and the knob post are all plain.
- The ridge beams are plain bars about 8 mm high, with upturned ends rising about 6 mm and projecting about 8 mm past the hip tops.

---

## d. Surface

The light is a warm gallery spot from the upper right; the pedestal photographs as `#fde0c7`. The "neutral" column below applies 60 % of the pedestal-derived white-balance gain, because the pedestal itself is probably off-white. Values are medians in linear light.

| swatch | share of vessel px | as photographed | neutral-light estimate |
| ------ | ------------------ | --------------- | ---------------------- |
| dominant dark body (recesses, shaded walls) | 26 % | `#2c211a` | `#29211d` |
| mid body (olive-brown metal skin) | 34 % | `#4b3e34` | `#463f39` |
| high points, lit arrises (slightly lustrous) | 18 % | `#928473` | `#88857d` |
| pale green powder (eaves lip, ledges, leiwen) | 3 % | `#87806f` | `#7e8179` |
| blue-green accents (crevices on the lid and flanges) | 3 % | `#857d71` | `#7c7e7b` |
| red-brown cuprite patches (belly lower half, knob) | 10 % | `#453327` | `#40332b` |
| eaves lip (up-facing ledge, powder) | box | `#776e60` | `#6f6f68` |
| plinth ledge (powder) | box | `#756654` | `#6d675b` |
| belly recess ground (darkest 10 %) | box | `#2b1b0f` | `#281b11` |

**Distribution:**

- The metal skin is **dark olive-black** and fairly continuous, so this is a handled, cleaned surface, not an excavated crust.
- **Pale grey-green to blue-green powder** sits in the leiwen grooves, in the channels between plateaus, and on every **up-facing ledge**: eaves lip, belly-top ledge, plinth ledge, the top of the foot tab, and the crests of the lid flanges. It is thin, chalky and matte, never a thick crust.
- **High points are dark and slightly lustrous**: plateau tops, eye bosses, flange crests and ridge beams.
- Local warm red-brown shows through on the belly's lower half and the knob.
- Saturated malachite green is essentially absent (< 0.1 % of pixels).
- **Gloss:** low-medium, satin, with specular sheen only on rounded high points.

**Suggested presets** (names from KIT.md; `malachiteHue` 0 = blue-green, 1 = yellow-green):

Faithful to the photo, `'visitor-olive'`:

```js
{ age: 0.95, tin: 0.5, polish: 0.5, tarnish: 0.9, cuprite: 0.5, malachite: 0.38, malachiteHue: 0.35, malachiteScale: 1.5,
  azurite: 0.05, chloride: 0.3, tinOxide: 0.45, earth: 0.1, earthColor: '#6a6458', inlay: 0.1, crevice: 0.92, wear: 0.4, patchScale: 60 }
```

The **new bluer preset the owner asked for**, `'visitor-blue'` (the same physics, pushed toward blue-green carbonate, azurite and pale chloride bloom):

```js
{ age: 1, tin: 0.5, polish: 0.45, tarnish: 0.85, cuprite: 0.4, malachite: 0.55, malachiteHue: 0.12, malachiteScale: 1.2,
  azurite: 0.3, chloride: 0.35, tinOxide: 0.35, earth: 0.06, earthColor: '#5f6460', inlay: 0.05, crevice: 0.95, wear: 0.4, patchScale: 55 }
```

Rationale:

- `crevice` close to 1 and a fine `malachiteScale` keep the corrosion as powder in the recesses.
- `tarnish` and `tinOxide` make the dark lustrous high points.
- `wear` 0.4 lets the arrises read lighter.
- A low `earth` keeps it from reading as a fresh excavation.

---

## e. Camera

`views` entry, matching how `src/app/stage.js` interprets the fields:

- `azimuth` 0 is front (+Z, the broad face); a positive value turns toward +X, so the left narrow face needs a negative value.
- `elevation` is measured from the target, which is the bbox centre.
- `fov` is the vertical fov of the canvas.
- `fit` is checked against the bbox corners. `fitScale` is 1 under `ui=0`.

```js
views: {
  'three-quarter': { azimuth: -25, elevation: 10, fov: 36, fit: 1.13, ref: 'three-quarter.jpg' },
  'aic-front':     { azimuth: 0,   elevation: 18, fov: 40, fit: 1.08, ref: 'aic-sailko-front.jpg' },        // rough, not solved
  'aic-three-quarter': { azimuth: -32, elevation: 6, fov: 34, fit: 1.1, ref: 'aic-harrsch-three-quarter.jpg' }, // rough, not solved
}
```

**How `fit` was derived:** with the estimated bbox (226 × 330 × 186 mm), `fov` 36 and the 1400 × 1050 shot canvas, the vertical extent limits the frame. Matching the photo's camera distance of 2.28 H to the 0.48 H target needs `fit` ≈ 1.13. **If the built bbox differs, re-tune `fit` so the vessel spans about 75 % of the frame height.** Keep `fov` at 36: it carries the photo's strong perspective, eye level at 0.62 H looking slightly up at the knob.

The photo is portrait and the shot is landscape, so compare silhouettes, not frame edges. A `target: [0, 0.48*H, 0]` puts the solved aim point exactly; `fit` then means 1.13 × R / tan(fov/2) ≈ the same distance.

---

## f. What a knowledgeable viewer checks first

1. **Swelling belly** about 10 % wider than the neck, widest at about 0.32 H, so the body reads as a squat pot rather than a box.
2. **Tall, steep lid**: the lid plus knob is about 0.47 H, with broad slopes near 50° and narrow slopes near 65°.
3. **Ridge beam with upturned ends** parallel to the broad face. The knob is a miniature hipped roof on a square post.
4. **Flanges broken at every register**, with cap-hooks springing above each segment's top. The belly caps are the widest points of the silhouette.
5. **Hip-flange ends** stab 12–15 mm past the eave corners; the eaves corners curl up slightly.
6. **Belly masks:** a huge squared spiral horn above a *low*, rounded-rectangular eye with a slit boss, not the Anyang "eye at mid-height under a C-horn".
7. **Deep, smooth plateaus** (≈ 3 mm) with single incised lines; leiwen only in channels. No dense V-a hatching.
8. **Pegs on the lid's broad-face centre flange**, and the foot-centre tab dropping onto the plinth ledge.
9. **Neck frieze:** paired crested kui or birds facing the centre block, two per half-face.
10. **Knob mini-taotie** with pellet eyes, C-scrolls and hooked knob eaves.
11. **Stepped plinth** with a visible ledge; the foot is set back under the belly overhang.
12. **Recess-only pale powder** with dark, satin high points, and pale up-facing ledges (eaves lip, belly-top ledge, plinth ledge).
13. **Heavier narrow-face centre flanges** than broad-face ones.
14. **Lid kui frieze** across the top of each broad slope only.

## Uncertainties the modeller must know

- **Absolute size is assumed (H = 330 mm).**
- **Plan aspect 1.17 ± 0.12** comes from a single-view solve; one cruder solve gave 0.95.
- The **narrow-face décor** and the **knob depth** are seen only obliquely.
- The **foot frieze** is the least legible area.
- **Lid mask orientation** is ambiguous; place the masses by the coordinates and ignore the reading.
- The bluer patina is a request, not an observation: the object's real powder is pale grey-green.
