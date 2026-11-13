# Dossier: met-zun, Wine container (zun) 尊, Met 43.25.1

This is the measuring curator's ground truth for modellers and reviewers. All numbers are in mm, with
Y up, the ground at y = 0 and H = 400. Where it helps, a number is also given as a fraction of H.
Confidence labels:

- **[firm]**: published, or measured to ±2 %.
- **[meas]**: measured from the photos, ±3–5 %.
- **[est]**: estimated from shading, ±25 % or as stated.
- **[unc]**: an interpretation that could be wrong.

## 0. Conventions and part names (use these exact names)

- **This vessel is THREE-fold, not four-fold.** It is cast in 3 mould sectors of 120°.
  `src/artifacts/_study-lathe.js` uses 4 sectors, 4 heads and 4 flanges. That is wrong for this
  object. The evidence is in §b.6.
- **Axes:** front (+Z, azimuth 0) is a **nose line**. On it sit the belly nose flange, the foot nose
  flange, the front animal head on the shoulder, and the symmetric neck blade, so `front.jpg` looks
  straight at one taotie. The **mould seams** (join flanges) are at azimuth ±60° and 180°. The other
  two nose lines are at ±120°. Azimuth is in degrees, positive toward +X (the stage/kit convention).
- **Part names** (`userData.part`; `spec.json` uses them):
  - `body`: the whole lathe. This is foot + waist + belly + shoulder + neck + trumpet + lip,
    including the low relief, eye bosses, dentil band and the thin neck seam ridges.
  - `flanges`: the 12 slab flanges (6 on the belly, 6 on the foot: one per 60° per register) plus
    the 3 low plain shoulder strips on the seams, built as **15 separate meshes**. If you build the
    shoulder strips inside `body`, set `flangeCount` to 12 and `flangeTop` to 0.61 in spec.json.
  - `heads`: the 3 sculpted bovine heads on the shoulder at azimuths 0, 120 and 240.
- **Register names** (profile.json `registers`), bottom to top: `footPlain`, `dentils`, `foot`,
  `waist`, `bellyLower`, `belly`, `bellyKui`, `bellyUpper`, `shoulder`, `neckKui`, `bladeBorder`,
  `blades`, `rimBand`.

## a. Identity

| | |
|---|---|
| Title | Wine container (zun) / 尊 (shouldered three-section zun 有肩尊; also called a 觚形尊 with shoulder) |
| Type | zun 尊: round shouldered wine vessel with a trumpet mouth, a compressed belly and a high flaring foot |
| Date | 13th century BCE [firm, Met] (API date range −1400…−1199). Anyang, roughly Yinxu I–II by style [unc] |
| Period | Shang dynasty (ca. 1600–1046 BCE), late Shang (Anyang) style |
| Findspot | not documented (unprovenanced). The Anyang attribution rests on style alone |
| Collection | The Metropolitan Museum of Art, New York. Rogers Fund, 1943. Gallery 207 |
| Accession | 43.25.1 (Met object ID 49383) |
| Medium | "Bronze inlaid with black pigment" (Met) |
| Published dimensions | H 40.0 cm (15¾ in); rim diameter 35.2 cm (13⅞ in); base diameter 22.5 cm (8⅞ in) [firm] |
| Weight | not published |
| Inscription | a cast clan sign on the interior floor: a ladder-like frame of two tall verticals with crossbars, around a rounded cartouche that holds an X with triangles in the four spaces between its arms. Reading uncertain [unc] |

**Label blurb:** A tall wine container in three tiers: a wide trumpet mouth, a squat belly with three
ox heads on its shoulder, and a high flaring foot. Broad, flat bands form the horned masks and
dragons, and they stand out silver-grey against fine thunder spirals filled with black pigment.
Notched flanges divide the vessel into three identical sections, which mark the joins of the
ceramic piece-mould it was cast in during the 13th century BCE.

## b. FORM (lathed)

### b.1 How it was measured (and the camera)

- Silhouettes come from chroma segmentation. The studio background is exactly neutral
  (R = G = B, chroma 0), and the bronze almost never is. The mask is the chroma box-mean
  (r = 5 px) above 0.8, closed, then flood-filled from the border.
  Scripts are in `.work/dossier-met-zun/py/`: `seg3.py`, `deroll.py`, `cam.py`, `profile2.py`,
  `rowy*.py`, `mkprofile.py`, `pitch.py`, `colors*.py`.
- **Camera roll 1.8° ±0.4** in both DP140764 and DP140765. The vessel's axis leans with its top to
  the image left, and the rim ellipse's right end rides higher. Both views show the same lean,
  although the vessel was turned 60° between them, so the camera is rolled; the vessel is not
  tilted. I rotated the images by −1.8° before measuring. **Model the vessel upright.**
- **Perspective is significant.** I fitted a pinhole camera (principal point at the image centre)
  to four things: the foot ellipse (published D 225), its near edge, the rim ellipse (D 352) and the
  rim's far edge.

| photo | camera distance from axis | camera height | vertical FOV (3:4 portrait frame) | local elevation at rim / centre / foot |
|---|---|---|---|---|
| DP140765 (front) | 1875 mm | 580 mm | 20.3° | ≈ 6° / 11.5° / 16.9° |
| DP140764 (three-quarter) | 1894 mm | 637 mm | 20.2° | 7.2° / 13° / 17.5° |

  The elevations come from the minor/major axis ratios of the ellipses: foot b/a = 0.29–0.30
  [meas]; rim b/a = 0.125 in DP140764 [meas]. The rim in DP140765 gives only ≈ 0.09 because the
  rim is warped (see below).
- Scale at the belly ≈ 5.85 px/mm in the 3000×4000 originals, and 11.8 px/mm at the foot in DT2853.
- Each silhouette row was converted to (r, y) through that camera. That gives the true radius of
  the circle whose extreme point lands on that row. The profile is checked against both photos;
  the residuals are in `profile.json` (`measured_silhouette_A/B`).
- **Rim irregularity [meas]:**
  - The rim is slightly out of round. It measures 352 mm across in one view and ≈ 358 mm in the
    view rotated 60°, about 1.5 % ovality.
  - It is also not planar, by ±3 mm: the front of the rim in DP140765 sits ≈ 4 mm lower than a flat
    rim would.
  - Use `tolerance: { ovality: 0.012, rim: 0.008 }`.

### b.2 Profile of revolution (outer wall between flanges)

The full 64-point table is `profile.json` → `points` (`[r, y, join?, label?]`, bottom → top). Pass
it to `new kit.Profile(points)`. Key stations:

| landmark | y mm | y/H | r mm | Ø mm | join | conf |
|---|---|---|---|---|---|---|
| foot edge (ground) | 0 | 0 | 112.5 | 225 | C (2.5 mm vertical bevel) | [firm] Ø |
| top of plain foot band / dentil bottom | 27 | 0.068 | 105.6 | 211 | S | [meas] |
| dentil top = foot décor bottom | 36 | 0.090 | 103.2 | 206 | S | [meas] |
| foot décor top | 120 | 0.300 | 78.4 | 157 | S | [meas] |
| **waist (min)** | 128 | 0.320 | 76.6 | 153 | C (concave) | [meas] |
| belly underside (quarter-round, R ≈ 8–10) | 128–137 | 0.32–0.34 | 77 → 93 | | S, tight | [meas] |
| belly décor bottom | 152 | 0.380 | 98.2 | 196 | S | [meas] |
| belly kui frieze bottom / top | 218 / 241 | 0.545 / 0.603 | 112.5 / 115.4 | | S | [meas] |
| **carination (belly max)** | 254 | 0.635 | 116.0 | 232 | **C** | [meas ±2] |
| neck base (shoulder → neck) | 281 | 0.703 | 84.5 | 169 | **C** | [meas ±3] |
| **neck minimum** | 290 | 0.725 | 80.8 | 162 | S | [meas] |
| neck kui top / blade border | 315 | 0.788 | 88.3 | 177 | S | [meas] |
| blade bases | 323 | 0.808 | 92.5 | 185 | S | [meas] |
| blade tips | 389–391 | 0.975 | 160 | 320 | S | [meas ±3] |
| **rim (lip)** | 400 | 1.000 | 176.0 | 352 | L | [firm] Ø |

- **Foot:** an almost straight cone from Ø 225 at the ground to Ø 157 at y 120. The wall leans
  inward going up at **16–17° from vertical**, very slightly concave. At y 65–105 the two photos
  disagree by ±3 mm in r, from ovality or segmentation [meas ±3]. There is no stepped base ring:
  the plain band simply ends in a 2–3 mm vertical bevel.
- **Waist:** a short concave neck, Ø 153, between the foot and the belly. Above it the belly starts
  with a **rounded underside**, a quarter-round that turns from horizontal to vertical within
  ≈ 9 mm of height. In silhouette it reads as a step of 16 mm in radius.
- **Belly:** a shallow inverted cone, Ø 196 at its décor bottom and Ø 232 at the carination. The
  wall leans outward going up at ≈ 9° from vertical, slightly convex.
- **Shoulder:** a straight-ish sloping band from the carination (y 254, r 116) up and in to the neck
  base (y 281, r 84.5). That is Δr 31.5 over Δy 27, a slope of **≈ 41° from horizontal**, and the
  band is 41.5 mm along the slope. Both ends are creases [meas ±3; the silhouette is contaminated
  by the heads].
- **Neck / trumpet:** a minimum of Ø 162 at y 290, just above the shoulder. From there the wall
  flares continuously:
  - the wall slope dr/dy is ≈ 0.3 at y 300;
  - ≈ 0.75 at y 350;
  - ≈ 1.3 at y 380;
  - ≈ 2.5 in the last 10 mm, so the lip turns out almost horizontally.

  There is **no carination on the trumpet**: it is one smooth S-curve from the neck base to the
  lip.
- **Lip:** flat-topped and thickened, ≈ 4.5 mm thick [est]. The outer edge is square with a tiny
  bevel.

Overall proportions:

| ratio | value |
|---|---|
| H / rim Ø | 1.136 (rim Ø / H = 0.88) |
| base Ø / rim Ø | 0.639 |
| belly-max Ø / rim Ø | 0.66 |
| neck-min Ø / rim Ø | 0.46 |
| waist Ø / base Ø | 0.68 |
| section heights: foot (0–128) / belly + shoulder (128–281) / neck + trumpet (281–400) | 0.32 / 0.38 / 0.30 of H |

### b.3 Wall, floor, interior [est]

- **Wall:** ≈ 4 mm at the belly, 3.5 mm at the foot and neck, 3 mm in the upper trumpet, with a
  4.5 mm lip. No section is visible, so these are typical values for a 40 cm Anyang zun.
- **Floor:** a flat inner floor at about the waist, **y ≈ 128 ±8, 4 mm thick**. The clan sign is
  cast on it. The foot is hollow and open below. The foot interior was not photographed.
- **No cruciform holes** are visible in any of the four photos at the foot top or waist. The task
  brief mentions "perforations", but I cannot confirm them. If you add any, keep them at the top of
  the foot under the decor (y ≈ 122) on the seams. Otherwise leave them out [unc].

### b.4 Flanges 扉棱 (L3)

| set | count & azimuths | y range | projection p | thickness | notches | conf |
|---|---|---|---|---|---|---|
| belly | 6: nose at 0/120/240, seam at 60/180/300, all alike | 145 → 243 (0.36–0.61) | 16 ±3 | 8 ±1.5 | 'T'-type: short horizontal slots cut in from the outer edge and continued across both faces as scored grooves. Pitch 14 ±2, slot 2–3 wide, depth ≈ 0.35 p. 6–7 segments | [meas] |
| foot | 6, same azimuths | 30 → 122 (0.075–0.305), following the foot slope | 13 ±3 | 7 ±1.5 | same 'T' slots, pitch 12–14, 6–7 segments | [meas] |
| shoulder strips | 3, on the seams only (60/180/300) | 254 → 281, following the shoulder slope | 3–4 | 7 | none, plain | [meas] |
| neck seam ridges (part of body) | 3, on the seams | 283 → ≈ 325, through the kui band, ending between blade bases | ≈ 1 | 1.5–2 | none | [meas] |

- The outer edge of each flange runs **parallel to the wall**, so the projection is constant.
- The ends are square, and they stop 1–3 mm beyond their décor register.
- In silhouette the belly and foot flange tips sit almost exactly on the wall's outline at ±90°.
  That is a useful check: (r + p)·sin 60° ≈ r.
- There is **no flange on the nose line at the shoulder**: the head sits there instead.
- **Nose flanges and seam flanges are the same slab.** Seen face-on (front.jpg centre), a nose
  flange looks plain, because its notches are only on the edge and on the side faces.

### b.5 Animal heads (L3, 3×)

- **Position:** at azimuths 0, 120 and 240, on the shoulder over the belly nose flanges. Each spans
  y ≈ 250–283 (0.625–0.708 H) [meas]. The top of the head merges into the neck base. The snout
  overhangs the carination by 12–20 mm, so the snout tip reaches r ≈ 130–136.
- **Size [meas ±15 %]:**
  - Overall width, including the horns lying flat on the shoulder: **≈ 60 mm**.
  - Face (snout) width: ≈ 26 mm.
  - Length along the slope: ≈ 45 mm.
- **Shape:**
  - The horns are **flat C-curls (ram/bovine) lying on the shoulder surface** to both sides,
    decorated with incised spirals.
  - The face is a short bovine muzzle with small round eyes, pointing down and out (`droop` ≈ 50°).
  - There are no free-standing ears.
  - Kit: `animalHead({ kind: 'bovine', width: 30, hornSize: 1.0, hornCurl: 0.8, droop: 50,
    projection: 0.5 })` with `mountOnLathe(..., { y: 266, follow: 1 })`. The horns must stay
    flush with the shoulder.

### b.6 Why three-fold (evidence)

- In `front.jpg` the belly shows flanges at the centre and at both silhouette edges. The two eye
  bosses are symmetric about the centre flange, 20° either side, so the centre flange is a nose.
- In `three-quarter.jpg` the centre flange is a seam: the eyes sit 38–40° either side of it. Solving
  both views together gives the eye at δ = 20° from its nose, with the nose 60° from the seam.
  Four sectors would put the eyes 70° from the seam.
- The shoulder heads appear at the front plus ±120° in `front.jpg`, and at ±60° in
  `three-quarter.jpg`.
- The foot detail (DT2853) shows a seam flange **inside** the silhouette, with wall visible beyond
  it, so it is at ±60°, not at ±90°.

## c. DÉCOR MAP

**Style.** Loehr III/IV **"flat band" (T9-like) relief.**

- The motifs are broad, flat, pale bands 3.5–4.5 mm wide, flush with the wall or raised at most
  0.2–0.4 mm [est].
- Each band is outlined by **one sunk contour groove**, 1.2–1.4 mm wide and ≈ 0.5 mm deep.
- The bands carry a single sunk centre line here and there.
- The bands lie on a **sunk leiwen ground**. The ground has pitch **1.3 ±0.15 mm** (measured on
  DT2853 at 11.8 px/mm: dark groove ≈ 0.75 mm, pale land ≈ 0.55 mm), it is **squared** (roundness
  ≈ 0.1), and its depth is ≈ 0.4 mm [est].
- **Every recess is filled with black pigment.** The inlay is what makes the pattern legible, so
  set `inlay` high (§d).
- The eye bosses are the only L2 relief: flattened domes about 8.5–9 mm across and ≈ 2–2.5 mm
  high, with a sunk round pupil about 2 mm across.

Kit mapping: `style: 'flush'`, `carving: 'none'`, `square: 0.85`, leiwen
`{ pitch: 1.3, line: 0.55, roundness: 0.1, depth: 0.4, follow: 1 }`, and
`relief: { motif: 0.3, boss: 2.2, groove: 0.5 }`.

**Mould sections.** The 3 sectors are **identical**. Every register is mirror-symmetric about each
nose line, and each sector repeats around the vessel. So author one half-panel (nose → seam,
60°), mirror it, and repeat it 3×. In the tables below, x = arc length (mm) from the nose line
toward the seam, measured at mid-register, and y = height (mm) above the register's bottom edge.

### c.1 Foot (`foot`, y 36–120; developed panel ≈ 88 mm along the slope)

The half-panel is 82 mm wide at the top (r 78) and 108 mm at the bottom (r 103), 95 mm at mid.
The register is fan-shaped: author it in developed mm and map it with `size.toPanel`.

| unit | x (from nose) | y | notes |
|---|---|---|---|
| nose band | 4–14 | 30–75 | plain band beside the flange ending in an inward (toward-axis) hook at y ≈ 45. The flange covers the axis. No lozenge crest visible |
| **horn: tall "D" / inverted-U** | 20–48 (0.21–0.50) | 39–77 (0.46–0.92) | a rounded-rectangle band 4 mm wide, open at the bottom, both feet curling **inward** into small hooks. It encloses a **sunk leiwen S-pair inset** (11 × 21 mm at the D's centre). Closest grammar: H4 bottle horn, but much wider. Kit: `horn: 'bottle'`, hornSize ≈ 1.6, with leiwen inside |
| eye | centre (35, 24), x 0.37 / y 0.29 | | round boss Ø 8.5–9, ring-rimmed, dot pupil. **Low on the panel**, directly under the D. A short band leads from it to the nose (inner canthus stub). `eye: 'round'`, `eyeSize` ≈ 0.10 H_p |
| outer vertical C-band | 51–82 (0.54–0.87) | 29–80 | tall band, C-hook at top and bottom (an ear / upturned body). It reads as a vertical, head-down kui [unc] |
| small knob in a square frame | ≈ (90, 26) | | a tiny boss Ø ≈ 4 next to the seam flange: the eye of the edge kui [unc] |
| jaw / claw row | 8–90 | 3–19 | a row of 4–5 S- and C-hooks (lip line, fangs, claws) along the bottom border |
| ground | everywhere else | | sunk leiwen, pitch 1.3 |

Borders: a plain 2 mm land at the top and bottom of the register.

**Dentil band** (`dentils`, y 27–36):

- A continuous row of **raised rounded-rectangle "teeth"**: ≈ 5 mm wide × 7 mm tall, pitch
  6.8 ±0.5, ≈ 96 around (32 per sector). Each tooth is raised ≈ 0.7 mm, with its top edge rounded.
- The teeth sit between two fine lines.
- It is the only décor below the masks. The plain foot band below it (y 0–27) is undecorated.

### c.2 Belly taotie (`belly`, y 152–218; developed height 67 mm)

The half-panel is 103 mm wide at the bottom, 118 mm at the top, 111 mm at mid.

| unit | x (from nose) | y | notes |
|---|---|---|---|
| nose band | 3–22 (0.03–0.20) | 20–55 | vertical band with a snout hook at the bottom (nostril scroll), beside the flange |
| **horn** | 22–71 (0.20–0.64) | 36–63 (0.54–0.95) | **large squared inward-curling horn**. The band rises from beside the nose, runs out along the top, and turns down and **back toward the axis** into a squared spiral of 1½ turns. The spiral centre is at x 0.46, y 0.70. Grammar H2 (ram horn), squared (`horn: 'ram'`, `square` 0.85, hornSize ≈ 1.4) |
| eye | centre (38, 23), x 0.35 / y 0.35 | | round boss Ø 8.5, pupil hole. Below the horn and low in the panel |
| outer C-scroll | 74–108 (0.67–0.98) | 30–61 | vertical C-scroll at the panel's outer edge (ear / upturned tail) |
| body band | 50–108 (0.46–0.98) | 20–28 | horizontal band running out from behind the eye to the seam, with small hooks on its upper edge |
| jaw / claw row | 8–105 | 3–20 | a row of C/S-hooks: the lip line, then claw hooks pointing toward the axis |
| ground | | | sunk leiwen, pitch 1.3 |

Kit approximation: start from the `zun-belly` preset and set:

- `style: 'flush'`, `nose: 'flange'`;
- `eye: 'round'`, `eyeX: 0.35`, `eyeY: 0.35`;
- `horn: 'ram'`, `brow: 'none'`, `crest: 'none'`;
- `body: 'band'`, `tail: 'up'`, `edge: 'scrolls'`;
- `jaw: 'hooked'`, `square: 0.85`.

**The eye low at about a third of the height, under a huge squared horn, is this vessel's
signature.**

### c.3 Belly kui frieze (`bellyKui`, y 218–241, 23 mm high)

- Half-panel ≈ 119 mm long: an aspect of 5:1.
- **One kui per half-panel, facing the nose line.** Its head is near the nose flange, with a round
  eye at x ≈ 14, y ≈ 15. The body runs out to the seam and the tail turns up. Each nose flange
  therefore has a pair of kui meeting at it.
- A second small head or eye near the seam end (x ≈ 100) suggests a two-headed body or a second
  small kui [unc].
- The frieze is separated from the mask by a plain 1.5 mm land. Kui band width ≈ 4 mm.
- Kit: `frieze: { unit: 'kui', count: 2, facing: 'centre' }` on each full 120° sector,
  `kui.head: 'gaping'`, `tail: 'up'`, `style: 'flush'`.

### c.4 Shoulder (`shoulder`, y 254–281 along a 41° slope; developed width 41.5 mm)

- A frieze of **kui on leiwen**, two per sector: one on each side of the animal head, running from
  the head to the seam strip. Their heads are toward the animal head [unc]. Band height
  ≈ 34 mm usable.
- The animal head covers x 0–30 on the nose line, and the plain seam strip sits at the other end.
- Edges: a plain land at the carination (a bright worn arris) and at the neck base.

### c.5 Neck kui band (`neckKui`, y 283–315, 32 mm high)

- The half-sector is ≈ 88 mm long at r 84.
- **A pair of kui facing the nose line.** The heads meet below the nose blade, with eyes ≈ 20 mm
  either side of the axis. The bodies run out to the seam ridge. The squared C-scroll and hook
  bands match the belly style.
- On the seams (±60°, 180°) a thin raised seam ridge crosses the band [meas].
- Below it the neck base is a narrow plain land. Above it sits the `bladeBorder` (y 315–323), a
  narrow leiwen strip that the blades stand on.

### c.6 Rising blades (`blades`, y 323–391; 95 mm along the flare)

- **9 blades at a 40° pitch.** One is centred on each nose line, and the other two in each sector
  are at ±40°. **The mould seams fall in the gaps between blades**: every seam is flanked by two
  blades at ±20° [meas: ±22° and ±36–40° in the two views].
- **Blade shape:** each blade is symmetric. It is ≈ 31–35° wide at the base, which is 50–56 mm at
  r 92.5, leaving gaps of ≈ 8–14 mm. It is a tall pointed arch with gently convex flanks, and the
  apex reaches y ≈ 389.
- On the flaring trumpet the side blades **appear to lean outward** in the photos. That is
  perspective. Do not model them leaning.
- **Fill** (preset `blade.zun-neck` / `gu-trumpet`, `leiwenTop`):
  - In the upper 40 %, only **3–4 nested contour lines** follow the arch.
  - The lower 60 % holds a **vertically stretched mask** (T10): two squared C-spiral "eyes" at
    ≈ 30 % of the blade height from the base, with squared hooks between and below. The lowest
    part is leiwen.
- **Between the blades** the trumpet is **plain**, and so is the band above the tips (y 391–400).

### c.7 ASCII layout: one sector, unrolled (nose line at the centre, seams at the edges)

```
 seam -60°                     nose 0°                       seam +60°
   |      blade(-40°)   gap  blade(0°)  gap   blade(+40°)      |      y 323-391  (9 blades, plain between)
   |     /\ nested     .    /\       .     /\               |
   |    /  \ lines      .  /  \      .    /  \              |
   |   / () \  ()       . / ()()\     .   / () \             |
   |  /______\ mask     ./______\    .  /______\            |
   |======= leiwen border strip 315-323 =====================|
 ridge  kui ------>head   (eyes ±20)  head<------ kui        ridge   y 283-315
   |____________________ neck base 281 ______________________|
 strip  kui ----->   [ ANIMAL HEAD, horns flat ]  <----- kui  strip  y 254-281 (41° slope)
 ======================== carination 254 ======================
 FLANGE   kui ---->head  |NOSE FLANGE|  head<---- kui     FLANGE   y 218-241
 FLANGE | C-scroll | HORN squared spiral|  |HORN squared spiral | C-scroll | FLANGE
 FLANGE | (ear)    |      (H2, x.20-.64) |N|                     |          | FLANGE  y 152-218
 FLANGE | body band----- ( O ) eye x.35  |O|  eye ( O ) -----body band     | FLANGE
 FLANGE | claw / jaw hooks row           |S|            claw / jaw hooks   | FLANGE
 ------- rounded belly underside 132-152 (plain) ---- waist 120-132 (plain) -------
 FLANGE | C-band |  ___  D-horn         |N|        D-horn ___  | C-band | FLANGE  y 36-120
 FLANGE | (kui?) | |lw | x.21-.50       |O|        (mirror)    |        | FLANGE
 FLANGE | o      | ( O ) eye x.37 y.29  |S|            ( O )   |      o | FLANGE
 FLANGE | hooks  hooks  hooks           |E|                    hooks    | FLANGE
 ▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯▯ dentil band y 27-36, 32 teeth per sector ▯▯▯▯▯▯▯▯▯▯▯▯
 ___________________ plain foot band y 0-27, Ø 225 at the ground ____________
```

### c.8 Relief heights (mm) [est from shading]

| feature | height / depth |
|---|---|
| motif bands | 0 to +0.3 over the wall |
| contour grooves | −0.5 |
| leiwen grooves | −0.4 |
| dentils | +0.7 |
| eye bosses | +2–2.5 |
| neck seam ridges | +1 |
| shoulder strips | +3–4 |
| belly flanges | 16 |
| foot flanges | 13 |
| animal heads | up to 20 beyond the shoulder surface; snout 12–20 beyond the carination |

## d. SURFACE (patina)

The swatches are medians of real pixels. They were sampled with numpy from the lit side of the
DP photos (cool, neutral white balance) and from DT2853 (an older, **warmer** transparency scan).
Trust the DP values for hue.

| role | where sampled | sRGB |
|---|---|---|
| dominant plain wall, lit | foot band / belly upper band, front.jpg | `#818b80` / `#9ea1a0` |
| motif bands (high points), lit | belly / foot / shoulder bands | `#878c87` · `#9fa19f` · `#adb0ad` |
| mid tone (worn ground) | belly décor | `#5f635e` |
| recess = black inlay | grooves, leiwen | `#222321` (lit) … `#0d0e0b` (shade); DT2853: `#41332c` |
| malachite accents | spots all over, heaviest on the rim, neck and foot | `#426856` (blue-green) |
| cuprite / red-brown | small blotches, foot rim, inside the rim | `#5c4c40` |
| azurite | rare small islands: foot (three-quarter.jpg, left), interior floor | `#4c6068`; interior `#2e4850` |
| interior soil / buff earth | interior floor, plus pale buff lumps | `#706557` |
| interior overall | DP140766 | `#696761` |

**Distribution:**

- The whole outside is a **silver-grey to grey-green tin-rich noble skin (水银古-like)**. It is
  satiny, not glossy.
- The pale bands read almost silver against the **black-filled recesses**, which gives a strong
  light-on-dark graphic contrast.
- **Malachite** sits in scattered speckles and small crusty patches, 1–15 mm across. It is
  densest on the **rim top and trumpet**, on the head snouts (front head: a bright green snout tip)
  and on the plain foot band, where there is a large blotchy green zone on one side.
- **Red-brown cuprite or earth** shows as small flecks at the foot rim and inside the mouth.
- The **interior** is matt grey with buff soil lumps, malachite and a few azurite patches.
- The plain bands (belly underside, waist, carination arris, foot band) are paler and smoother, as
  if worn or polished.
- **No active chloride pustules** are visible.

**Casting flaws and repairs [unc]:**

- A hairline crack at the root of one shoulder head (three-quarter.jpg, left head).
- A thin pale streak along the front belly and foot nose flanges in front.jpg. It is probably an
  old fill or a mould-seam line.
- The foot edge has small chips and an uneven ground line.
- Mould-seam traces show as the neck seam ridges. The seams are otherwise hidden under the
  flanges.

**Closest preset: `olive-museum`**, pushed toward grey noble skin with inlay:

```js
setPatina({ ...PATINA_PRESETS['olive-museum'],
  tinOxide: 0.95, tinOxideTone: 1.8,          // grey/silver 水银古 instead of olive
  inlay: 0.9,                                 // black pigment in every groove: essential
  malachite: 0.3, malachiteHue: 0.3, malachiteTone: 0.45, malachiteScale: 1.2, crust: 0.12,
  cuprite: 0.3, azurite: 0.04, chloride: 0,
  earth: 0.12, earthColor: '#706557', calcite: 0.1, recessDirt: 0.25,
  polish: 0.45, wear: 0.3, wax: 0.4, patchScale: 60, mottleScale: 6 })
```

## e. CAMERA (views for the artifact)

The stage convention is checked in `src/app/stage.js`:

- **azimuth** 0 puts the camera on +Z looking at the front. A positive azimuth moves the camera
  toward +X, which is the object's own left and the viewer's right.
- **elevation** is the angle of the camera above horizontal, looking down.
- **fov** is the vertical fov of the canvas.
- **fit** multiplies the distance at which the bbox just fits. With `target`, the distance is
  `R·fit / tan(min half-fov)`, where R = half the bbox diagonal ≈ 318 mm.

The photographs were taken from about 1.9 m. On a 4:3 canvas, `fov 20` with `fit 1.25` puts the
camera about 1.86 m away, which reproduces the perspective. The detail views use `fov 7` to keep the
same perspective.

```js
views: {
  front:            { azimuth: 0,   elevation: 12, fov: 20, fit: 1.25, ref: 'front.jpg' },
  'three-quarter':  { azimuth: -60, elevation: 13, fov: 20, fit: 1.25, ref: 'three-quarter.jpg' },  // ±60 or 180 [unc]: all seams look alike
  'belly-mask':     { azimuth: 0,   elevation: 12, fov: 7,  fit: 0.36, target: [0, 190, 0], ref: 'detail-belly-mask.jpg' },
  'belly-seam':     { azimuth: -60, elevation: 13, fov: 7,  fit: 0.36, target: [0, 190, 0], ref: 'detail-belly-seam.jpg' },
  'shoulder-head':  { azimuth: 0,   elevation: 12, fov: 7,  fit: 0.36, target: [0, 262, 0], ref: 'detail-shoulder-head.jpg' },
  'neck-blades':    { azimuth: 0,   elevation: 11, fov: 7,  fit: 0.42, target: [0, 345, 0], ref: 'detail-neck-blades.jpg' },
  'foot-front':     { azimuth: 0,   elevation: 15, fov: 7,  fit: 0.40, target: [0, 65, 0],  ref: 'detail-foot-front.jpg' },
  'foot-mask':      { azimuth: 0,   elevation: 16, fov: 18, fit: 0.41, target: [0, 70, 0],  ref: 'detail-foot-mask.jpg' },   // a nose line: 0 or ±120 [unc]
}
```

Notes:

- A colour-pattern correlation of the plain foot band favours azimuth **−60** for
  `three-quarter.jpg` (r = 0.68). That is weak evidence.
- DT2853 is a different, closer shot. Its foot-ellipse b/a ≈ 0.36 gives a local elevation of about
  21° at the ground, so the camera is ≈ 0.8 m away.
- The photos are rolled by 1.8°. Do not rotate the model to match it.

## f. What a knowledgeable viewer checks first (priority order)

1. **Three-fold symmetry:** 3 heads, 6 flanges per register, 9 blades, with masks centred on the
   nose flanges under the heads. A four-fold zun is the first thing a specialist will flag.
2. **Silhouette:** three clear tiers. The trumpet mouth is widest (rim Ø 0.88 H). The belly is
   small (Ø 232, only 0.66 of the rim). The foot is high and conical (0–128, Ø 225 → 153).
   The neck minimum Ø 162 sits right above the shoulder.
3. **Sharp carination** at y 254 and a **steep 41° shoulder** up to a crease at the neck base;
   a **rounded belly underside** and a short concave waist.
4. **Flat-band style with black inlay:** broad, pale, flush bands with single contour grooves on
   black-filled fine squared leiwen. Raised Style-V plateaus would be wrong.
5. **Belly mask:** a **huge squared inward-curling horn** over a **small round boss eye set low**
   (y ≈ 0.35). The body band and C-scroll run out to the seam, and the claws hook along the
   bottom.
6. **Foot mask:** the **tall D/inverted-U horn filled with leiwen**, a small round eye under it, and
   a vertical C-band at the seam.
7. **Flanges:** substantial slabs (projection 13–16, about 8 thick) with **T-slot notches at a
   12–14 mm pitch**, broken between belly and foot (none on the waist or the underside). There are
   only low plain strips on the shoulder seams and hairline seam ridges on the neck.
8. **Animal heads:** small bovine heads with flat curled horns lying on the shoulder, snout drooping
   over the carination, about 60 mm across. Not big projecting sculptures.
9. **Blades:** tall symmetric pointed arches with nested contour lines on top and a stretched
   mask below. Plain bronze between them, and seams in the gaps.
10. **Kui friezes:** pairs facing the nose line on the neck band, the belly top band and the
    shoulder.
11. **Dentil band** of about 96 small rounded teeth just above the plain foot band, and a
    **plain** foot band below it.
12. **Patina:** silver-grey noble skin with blue-green malachite speckle, black recesses, no thick
    crust and no red-dominant areas.
13. **Proportions of the décor:** the belly mask register is only 66 mm high, under a 23 mm kui
    frieze. The foot mask register (84 mm) is **taller** than the belly's.
14. **Rim:** a thin, flat, slightly warped lip turned out almost horizontally. No thickened
    rolled rim.

## Uncertainties the modeller should know

- **Which seam `three-quarter.jpg` faces** (−60, +60 or 180). The décor is identical, so only
  patina blotches can tell, and the evidence is weak.
- The trumpet above y 385 is hidden by the rim ellipse, so it is interpolated to the published
  Ø 352 (±4 mm). The rim is out of round by about 1.5 % and warped by ±3 mm.
- The shoulder profile is ±3 mm because heads and strips contaminate the silhouette. The slope
  angle is 41° ±6°.
- At y 65–105 the foot radius differs by ±3 mm between the two photos, from ovality or
  segmentation.
- Flange projection (16 / 13 ±3) comes from the apparent width of flanges seen side-on at 60°.
- The floor height (y ≈ 128) and the wall thicknesses are estimates. There are no section photos
  and no published weight.
- The finer décor reading needs care:
  - Whether the belly kui frieze has 1 or 2 creatures per half-panel.
  - Whether the shoulder kui face the head or the seam.
  - The exact identity of the outer C-band on the foot (ear or vertical kui).

  Panel 1:1 crops are in the folder for close-reading.
- Perforations are not seen. The Met calls the medium "inlaid with black pigment", so the dark
  recesses are deliberate pigment, not dirt.
