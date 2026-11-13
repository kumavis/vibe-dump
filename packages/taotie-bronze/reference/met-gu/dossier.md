# Dossier: met-gu, Wine beaker (gu) 觚, Met 1985.214.4

This is the measuring curator's ground truth for modellers and reviewers. All numbers are in mm, with
Y up and the ground at y = 0. H = 311 (published). Fractions are of H unless stated otherwise.

Confidence tags:

- **[firm]**: published, or measured to ±1 %.
- **[meas]**: measured from the photos, ±2–4 % (the stated ± where given).
- **[est]**: estimated from shading or texture, ±25 %.
- **[unc]**: an interpretation that could be wrong.

Measuring scripts are in `.work/dossier-met-gu/py/` (`seg.py`, `edges.py`, `cam.py`, `fitprof.py`,
`final.py`, `colors.py`, `pitch*.py`, `fftbox.py`).

## 0. Conventions and part names (use these exact names)

- **Axes.** Front (+Z, azimuth 0) is the **nose flange of taotie A**. The vessel carries two taotie per
  décor register. Their noses sit on the flanges at **0° and 180°**. The flanges at **90° and 270°** sit on
  the seams between the two masks. Azimuth is positive toward +X, as in kit `lathe`.
- **Part names** (`userData.part`; `spec.json` uses them):
  - `body`: the entire lathe, standing on y = 0. It runs from the foot ring through the apron, the foot cone,
    the collar ribs, the waist drum, the neck and the trumpet to the lip. It includes the relief panels and
    **excludes the flanges**. Do not split the foot off as its own part: the spec expects `body` to span the
    full H.
  - `flanges`: all **8** flange strips: 4 on the waist drum and 4 on the foot (each foot flange ends in an
    outward spur). Each strip is its own mesh root, as `latheFlanges` returns them, so
    `parts.flanges.count = 8`.
- **Register names**, bottom to top (the `profile.json` labels use the same words): `footRing`, `apron`,
  `foot`, `collar`, `waist` (the drum, 腹), `neckFillet`, `neckBand`, `blades` (the trumpet), `lip`.
- **Photo naming.** Both full-length Met photographs face a **seam** flange. I named them `side.jpg` and
  `side-left.jpg` because each shows the taotie in profile. Only `detail-foot-front.jpg` faces a nose
  flange.

## a. Identity

| | |
|---|---|
| Title | Wine beaker (gu) / 觚 |
| Type | gu 觚, a trumpet-mouthed wine beaker: lathed, with a 4-sector piece mould |
| Date | 13th–11th century BCE (Met; objectBeginDate −1300, objectEndDate −1000) [firm]. By style, late Shang, Anyang, Yinxu II–III [unc] |
| Period | Shang dynasty (ca. 1600–1046 BCE) |
| Findspot | Not documented (unprovenanced). The Anyang attribution rests on style alone |
| Collection | The Metropolitan Museum of Art, New York. Gift of Ernest Erickson Foundation, 1985. Not currently on view (no gallery number) |
| Accession | 1985.214.4 (Met object ID 61322; Wikidata Q116313179) |
| Published dimensions | H 12¼ in. (31.1 cm); Diam. 6 11/16 in. (17 cm). The API gives Diameter 16.9863 cm, the **rim** [firm] |
| Weight | not published |
| Inscription | none recorded, and none visible. The inner foot wall cannot be seen in the photos |

**Label blurb.** A tall, slender beaker for offering wine. Its trumpet mouth opens to more than half its
height. Four long blades of fine thunder-pattern climb the trumpet. Below them, the narrow waist and the
flaring foot each carry a pair of flat-band animal masks with bulging eyes, split by saw-toothed flanges.
Late Shang casters made it in a piece mould of four sections. Each flange marks a joint between sections or
the nose of a mask.

## b. FORM (lathe), measured

### b.1 How it was measured

1. **Segmentation.** The studio background is exactly neutral (R = G = B), so pixels with chroma ≥ 4 after a
   5 px median are bronze. Flood-filling from the corners gives the outline. On the shadowed right side
   of the neck, the bronze is dark and grey, so a luminance-step edge, read against the flat background
   25 px further out, replaces the chroma edge there.
2. **Camera.** I solved a pinhole camera for each full photo from two ellipses:
   - the **rim** ellipse, using the published diameter 169.9;
   - the **foot-ring** ellipse, with H = 311.

   Result for `side.jpg`: camera ≈ 0.84 m from the axis and 0.42 m above the ground, pitched down 16°,
   vertical FOV ≈ 26°. A second solve that uses the ring-top arris gives D 1.1 m and FOV 20°. Heights
   from the two solves agree within 1–3 mm.

   Measured ellipse ratios (minor/major) in `side.jpg`:

   | ellipse | ratio | apparent elevation |
   | --- | --- | --- |
   | rim | 0.127 | 7.3° |
   | ring top | 0.34 | 20° |
   | ring bottom | 0.45 | 27°; the lower outline may be inflated by the contact shadow |

   `side-left.jpg` gives a rim ratio of 0.185 (10.7°). The difference between the two photos is real: see
   b.6, lean.
3. **Profile.** The profile was fitted as the **union of projected horizontal discs**, which gives a
   perspective-correct silhouette. Near the rim and on the foot flare, the outline at a given image row
   belongs to a higher or lower disc, so a naive width-to-radius reading would be wrong there.
   - Residual on the trumpet, neck and drum: **< 2 px ≈ 0.2 mm**.
   - `side.jpg` and `side-left.jpg` agree to **≤ 0.5 mm** in r between y 100 and 292.
4. **Flanges on the outline.** On the drum and the foot, the flanges stand on the outline in every photo.
   There, r is the **flange-root line**: the flange plane contains the axis and faces the camera, so its
   root is a true meridian. I read these lines by hand at 5 heights per side, ±1 mm.
5. **Hidden zones.**
   - y 292–307: the rim lip hides the trumpet flare in both photos. I fixed it by fitting the front
     underside and lip rows (±2 mm in r).
   - Ring and apron: these come from the ring-top and ring-bottom ellipses and the front edge rows.

### b.2 Profile of revolution (outer surface, flanges excluded) — also in `profile.json` (63 points + a 2 mm dense table)

```
 r_mm   y_mm  join  label            note
 46.5    0.0   C   footBottom       ring underside edge (≈0.8 mm round)
 47.1    6.0
 47.7   12.0                        ring face leans in ~6° going DOWN (Ø 96.6 top → 93.0 bottom) [meas ±1]
 48.3   17.5   C   ringTop          fine raised arris (bead ~0.6 mm) = top of the ring
 47.0   18.3                        broad plain apron, dished, rising inward
 44.5   19.8
 42.0   21.6
 39.5   23.4                        flange spurs land here (underside r≈39, y≈23.5)
 36.8   25.5       footDecorBottom  smooth join into the concave foot cone
 34.0   27.6
 32.4   30.5
 30.4   35.5
 28.6   42.0                        (foot eyes at y≈42)
 27.0   47.5
 25.4   53.3
 24.2   58.5
 23.2   64.5
 22.5   70.0
 22.0   75.5
 21.8   78.2   C   footTop          crease: foot cone → collar
 19.6   78.6   C                    collar (plain, Ø 39.2) with 3 round ribs:
 19.6 → 20.6 → 19.6 at y 79.6/80.5/81.5, 83.0/84.0/85.0, 87.0/88.0/89.0   (ribs ~1.6 wide, ~1.0 high)
 19.6   94.6   C   collarTop
 21.7   95.0   C   drumBottom       step out 2.1 mm (flat underside of the drum)
 21.6  105.0                        drum: true cylinder, very slight inward lean (21.7 → 21.4)
 21.5  120.0
 21.4  135.0
 21.4  146.4   C   drumTop          flat shoulder 2.9 mm wide
 18.5  146.8   C   neckBottom       plain fillet up to 153.4
 18.4  153.0
 18.3  160.0
 18.2  171.5       bandTop          neck frieze 153.4–171.5; blades start here
 18.2  185.0                        neck minimum Ø 36.4 at y≈165–190
 18.4  198.0
 18.7  205.0
 19.1  212.0
 19.9  220.0
 20.7  228.0
 22.0  236.0
 23.6  244.0
 25.7  252.0
 28.2  260.0
 31.6  268.0
 36.0  276.0
 41.5  284.0
 45.0  288.0
 49.0  292.0                        ↓ hidden behind the lip in both photos (±2 mm)
 53.0  296.0
 57.5  299.5
 63.0  302.5
 70.0  305.0
 77.0  306.8
 83.6  307.8   C   lipBottom        lip: a short vertical outer band
 85.0  308.6
 85.0  311.0   L   rim              flat top, Ø 170.0 [firm]
```

**Carinations vs smooth joins.**

- Hard creases (C): ring bottom, ring-top arris, foot top/collar, collar/drum, drum top shoulder, neck
  bottom, lip bottom.
- Smooth joins:
  - the apron into the foot cone (a continuous concave sweep);
  - the whole neck into the trumpet (no break at the blade base);
  - the trumpet into the lip underside.

**Key dimensions:**

| what | value | /H | conf |
|---|---|---|---|
| H | 311 | 1 | [firm] |
| rim Ø (outer lip) | 170.0 | 0.547 | [firm] |
| neck minimum Ø | 36.4 (y 165–190) | 0.117 | [meas ±0.5] |
| waist drum Ø | 43.0, height 51.4 (y 95.0–146.4) | 0.138 / 0.165 | [meas ±0.5] |
| waist flanges, crest to crest | 56.4 | 0.181 | [meas ±1] |
| collar Ø / with ribs | 39.2 / 41.2 | 0.126 | [meas ±1] |
| foot top Ø | 43.6 | 0.140 | [meas ±1] |
| foot décor bottom Ø | 73.6 | 0.237 | [meas ±2] |
| ring top Ø (arris) / ring bottom Ø | 96.6 / 93.0 | 0.311 / 0.299 | [meas ±1.5] |
| foot spurs, tip to tip | ≈ 104.6 | 0.336 | [meas ±3] |
| rim / foot-ring Ø | 1.83 | | |
| H / rim Ø | 1.83 | | (research/03 gives 1.6–2.0 for gu) |

**Proportions of the main zones:**

| zone | y range | share of H |
| --- | --- | --- |
| trumpet with blades | 171.5–311 | **0.45** |
| neck band | 153–171.5 | 0.06 |
| waist | 95–146 | 0.165 |
| collar | 78–95 | 0.05 |
| foot (cone + apron + ring) | 0–78 | **0.25** |

**Wall thickness [est].** Nothing is published and no interior section is visible.

- Trumpet wall: 2–2.5 mm.
- Lip: radial thickness ≈ 3 mm, vertical outer face 3.2 mm (y 307.8–311).
- Foot ring wall: ≈ 2.5–3 mm.
- The cup floor is not visible. As on comparable gu, put it at the waist, y ≈ 100–110 (inside the drum).
  The foot is hollow below it.
- **No cruciform holes are visible** in any of the three photos. Together the photos show every
  quadrant of the collar and the foot top, including all four 45° azimuths. Do **not** add holes.
  research/03 lists them as optional.

### b.3 Register boundaries (y in mm and /H)

| register | y | /H | content |
|---|---|---|---|
| footRing | 0–17.5 | 0–0.056 | plain vertical band, slight inward lean downward |
| apron | 17.5–25.5 | 0.056–0.082 | plain dished ledge; flange spurs land on it |
| foot | 25.5–77.5 | 0.082–0.249 | 2 taotie, 4 flanges with spurs; meridian length 55 mm |
| footTop crease | 78.2 | 0.251 | |
| collar | 78.2–94.6 | 0.251–0.304 | plain, 3 ribs at y ≈ 80.5 / 84.0 / 88.0 |
| waist | 95.0–146.4 (décor 96.5–145.5) | 0.305–0.471 | 2 taotie, 4 ladder flanges |
| neckFillet | 146.8–153.4 | 0.472–0.493 | plain |
| neckBand | 153.4–171.5 | 0.493–0.551 | flush frieze, 4 units, bounded by fine lines |
| blades | 171.5 → apex ≈ 305.5 | 0.551–0.982 | 4 blades on the flange azimuths; leiwen fill up to y ≈ 250–255 (0.81) |
| lip | 307.8–311 | 0.990–1 | plain |

### b.4 Flanges (8 strips at 0/90/180/270; all scored the same way)

**Waist flanges (4).**

- Extent: y 94.5–146.5, so the ends are flush with the drum ends (overhang ≤ 1.5 mm). Corners are rounded,
  r ≈ 1.5–2 mm, with a slight rounded swelling at the top end.
- Projection beyond the drum: **6.7 mm** (crest at r 28.2) [meas ±0.5].
- Thickness: **4.4–4.6 mm** (from the edge-on front flange) [meas ±0.5].
- Crest: straight and vertical. Each one is a rectangular slab, 52 × 6.7 mm in side view.

**Foot flanges (4).**

- Top: y ≈ 78, square to the foot top.
- Path: they follow the concave foot with a slowly growing projection — 7.5 mm at y 76, 7.1 mm at y 64,
  8.2 mm at y 53, 8.6 mm at y 42 — then **sweep out into a spur**.
- Crest radius r(y) from the silhouette, as (r, y):
  (29.4, 75.7), (30.4, 64.5), (33.6, 53.3), (37.3, 41.9), (41.6, 35.0), (45.4, 30.9), (49.8, 28.0),
  (52.3, 26.0 = spur tip).
- Spur: the tip is blunt and rounded, about 3 mm tall. It points outward and very slightly down, and
  stands **≈ 4 mm outside the ring arris**. The underside runs back almost horizontally to land on the
  apron at r ≈ 39, y ≈ 23.5.
- Thickness: ≈ **5 mm** [meas ±1].
- All four foot flanges have the same spur. The seam flanges and the nose flanges look the same. On the
  edge-on flange of each photo, the spur points at the camera and is invisible: it is not missing.

**Scoring ("ladder", kit `notches: { shape: 'score' }`).**

- Horizontal grooves cross both side faces from crest to root.
- **Pitch 3.7 mm** [meas ±0.2]: FFT of `side.jpg` and `side-left.jpg` gives 34.6 px → 3.5 mm, divided by
  cos 17°. That is **≈ 14 rungs on a waist flange** and ≈ 12 + 4 on a foot flange, the extra 4 on the spur.
- Grooves: ≈ 1.1 mm wide, ≈ 0.8 mm deep [est].
- Lands: ≈ 2.6 mm, flat.
- The grooves nick the crest, so the crest reads finely beaded or scalloped when seen edge-on. Notch
  depth ≈ 0.7 mm, about 0.1 × the projection: shallow, not the deep F1 notches.

The pitch is **finer than the 4.2–4.6 mm** used in `_study-lathe.js`.

### b.5 Waist and foot panel sizes (developed, for 1:1 relief)

| register | panel per quadrant (flange centre to flange centre) | height (meridian) |
| --- | --- | --- |
| waist | 33.6–34.1 mm wide | 49 mm |
| foot | fan: 34.3 mm at the top (r 21.8), 57.8 mm at the bottom (r 36.8) | 55.1 mm |
| neck band | 28.6–28.9 mm wide | 18.1 mm |
| blades | quadrant 28.6 mm at the base, 41.8 mm at y 255 | blade meridian ≈ 155 mm (171.5 → apex) |

For the waist and foot, subtract about 2.3 mm on each side for the half flange.

One taotie spans **two quadrants**, nose flange to nose flange 180° apart.

### b.6 Cast irregularity [meas]

- **Lean.** The axis leans ≈ 0.8° (the rim centre is offset from the foot centre by 38 px in `side.jpg`
  and 51 px in `side-left.jpg`, in opposite directions, which proves it is the object and not camera
  roll).
- **Rim out of level.** The rim plane is tilted ≈ 1.5–2° against the foot: the rim ellipse ratio differs
  between the two opposite views, 0.127 vs 0.185.
- The lip edge is slightly irregular, with small chips and losses on the lip band.
- Suggested kit tolerance: `{ ovality: 0.006, rim: 0.006, lean: 0.8 }`.

## c. DÉCOR MAP

**Overall scheme.**

- **4 mould sectors**, seams under all four flanges.
- Waist and foot each carry **2 taotie** (A centred on az 0, B on az 180). Each half-mask fills one
  quadrant from the nose flange to a seam flange.
- A and B are identical within each register. The left and right halves mirror. I found no sector-to-sector
  differences beyond hand-carving jitter, apart from pupil wear (below).
- Waist and foot noses are on the same azimuths. For the foot this is confirmed by `detail-foot-front`
  (nose) against `side` (seam). For the waist it is inferred from the eye positions [unc].
- **Style.** The **foot, waist and neck bands use broad flat bands that are flush or barely raised
  (≤ 0.3–0.5 mm)**. Grooves outline the bands, and fine sunk leiwen fills every leftover area. This is
  Loehr IV, edging toward V. Only the **eye bosses** stand up (L2). The trumpet blades are pure line work.
  In kit terms: `style: 'flush'`, `carving: 'none'` on the foot and `'sparse'` (one echo line) on the
  waist, `square ≈ 0.95`.

**Ground (leiwen).**

- Squared 雷纹 with corner radius ≈ 0.1 p.
- **Pitch ≈ 0.85–0.95 mm** on the waist and blades (FFT 8.6–9.2 px at 0.10 mm/px) and **≈ 0.7–0.8 mm on
  the foot** (FFT 14.5–16 px at 0.046 mm/px).
- Line ≈ gap.
- Grooves ≈ 0.3 mm deep [est].
- Cells are mostly **single squared spirals, 3–4 turns, 3.5–7 mm**. They sit in **framed cells**, each
  spiral boxed by its own outline, and are often stacked in columns or strung in rows along band edges.
  They are less a free packing than in the fangyi/zun.

**Relief heights [est].**

| element | height |
| --- | --- |
| foot bands | 0–0.3 mm above the ground lands |
| waist bands | 0.3–0.6 mm |
| eye bosses | 1.5–2.0 mm above the band (≈ 2 mm total) |
| bowstring ribs | ≈ 1.0 mm |
| flanges | L3 geometry |

### c.1 Foot register (y 25.5–77.5): taotie A/B, kit preset ≈ `gu-foot`

Coordinates are developed: x is the arc distance in mm from the **nose-flange centre** outward, and v is
the meridian distance in mm up from the décor bottom (y 25.5).

At the eye level, the quadrant is ≈ 45 mm wide and the panel is 55 mm tall. The panel is a trapezoid that
narrows upward: 57.8 mm wide at v 0 and 34.3 mm at v 55.

**Elements, bottom to top:**

| element | x (mm) | v (mm) | description |
|---|---|---|---|
| bottom border | full width | 0–3 | one row of framed leiwen cells (≈ 3 × 3.5 mm) |
| nose column | 2.3–8 | 3–38 | one-cell-wide column of framed leiwen beside the flange (no nose ridge; the flange is the nose: `nose: 'flange'`) |
| **jaw** | 12–24 | 7–14 | squared C-scroll curling up and back toward the axis, spiral centre ≈ (17.7, 8): `jaw: 'hooked'`, `jawTurns ≈ 1.2`; a short down-hook below its outer end |
| leg / claw | 22–34 | 6–15 | two small T/hook bands below the outer side of the eye, pointing toward the axis [unc: reads as claw/leg fragments] |
| **eye** | centre **16.7** (0.37 of the half-width), size **6.0 × 6.0** | centre **17** (**0.32** of the panel height) | **rounded-square domed boss** (corner r ≈ 1.8, dome height ≈ 1.8) with a **sunk horizontal slot pupil ≈ 2.6 × 1.4**; on some eyes the slot is worn to a dot. A flat band frames it as a rounded rectangle ≈ 10.5 × 9.5 (eye socket), with an outer groove. Kit: `eye: 'square'`, `pupil: 'slit'` (or `'dot'`) |
| ear | centre (26, 19) | | small C-spiral ear just outside and above the eye, opening downward: `ear: 'c'` |
| outer edge column | 36–45 (to the seam flange) | 5–35 | vertical band of hooks plus one column of framed leiwen ("Ǝ" shapes): kit `edge: 'scrolls'` |
| **horn** | inner leg 13–15, outer leg 20–24 | 24–38 | **squared crook horn**: the root (outer leg) rises from just above the ear, the top bar runs at v ≈ 34–37 toward the axis, and the inner leg drops beside the nose column to end in a **tight inward spiral at v ≈ 25, just above the eye** (H2-type, fully squared). Band ≈ 3.5 mm wide. A separate small T-hook ("ㄱ", quill-like) sits just outside the outer leg at v 28–35. Kit: `horn: 'crook'`, `square: 0.95` |
| separator | full width | 38–40.5 | one row of framed leiwen cells, roughly level, across the half-panel |
| **upper sub-band** | 3–34 | 40.5–53 | horizontal squared band (body or tail-like) with two framed spiral cells inside its loops; its end turns down beside the nose column; small C-hooks at the outer top corner [unc: a body band displaced above the horn, or a separate mini-frieze; render it as part of the mask panel] |
| top border | full width | 53–55 | narrow plain or leiwen edge under the foot top |

The bands are **2.8–3.5 mm wide**, constant, with squared-round corners (fillet ≈ 0.6 mm). Their tops are
plain. Each band edge is a single sunk groove ≈ 0.45 mm wide. There are **no secondary lines on the foot
bands**.

```
 FOOT, one quadrant (developed; nose flange at the right, seam flange at the left), panel narrows upward
 seam |                                                         | NOSE (flange, az 0)
  v55 +---------------------------------------------------------+
      | top border                                              |
  v53 +---------------------------------------------------------+
      |  c c   [===== upper body/tail band =====]==+  [lw]      |
      |        [ lw ]   [ lw ]    (two spiral cells) |  [lw]    |
  v40 +--- leiwen row ---------------------------------+--------|
      |  Ǝ  [lw]    ㄱ  +=======+ (crook horn top bar)  |  [lw]  |
      |  Ǝ  [lw]    ㄱ  ‖       ‖                      |  [lw]  |   lw = framed leiwen cell
      |  Ǝ          root‖       @ <- inward spiral      |  [lw]  |   ‖  = horn legs
      |  Ǝ   (C ear)       +---------+                  |  [lw]  |   ■  = eye boss (L2)
      |  Ǝ     @           |  ■ ▬ ■  |  eye 6×6, slot   |  [lw]  |
      |  Ǝ                 +---------+                  |  [lw]  |
      |  [lw]  ⊤ ⊤ claws      C== jaw scroll ==@        |  [lw]  |
  v3  +--- leiwen row --------------------------------------------+
  v0  +---------------------------------------------------------+  (decor bottom, y 25.5; plain apron below)
       x≈45 (r·π/2 at the eye)          x≈17 eye        x 0
```

### c.2 Waist register (y 96.5–145.5): taotie A/B, kit preset ≈ `gu-waist`

The panel is a cylinder band, 49 tall × 33.8 per quadrant. Developed x is measured from the nose-flange
centre, and v up from y 96.5. The eyes sit **halfway between the flanges**. Measured from the seam-facing
photos, they are at 44–48° from the seam, which is **x ≈ 16 (0.47 of the half-width)** and
**v ≈ 16 (0.33 of the panel height)** [meas ±1.5]. Eyes this low and this far out are characteristic of the
tall gu-waist mask.

| element | x (mm) | v (mm) | description |
|---|---|---|---|
| **eye** | 13–19 | 13–19 | domed boss, ≈ 6 wide × 5.5 tall, rounded-square to oval; pupil not legible (worn) [unc]. Kit: `eye: 'round'` or `'square'`, `eyeSize` for a ≈ 6 mm boss |
| **jaw** | 7–30 | 1–13 | large squared C/G-scroll under the eye, curling up with its spiral at the seam side (≈ x 24, v 8), plus a short hooked tail toward the nose; on taotie B a fan of 4–5 short parallel vertical grooves sits inside the scroll (fang or claw marks) |
| **horn** | 6–20 | 18–48 | **crook horn**: a band rises from above the eye (x 14–20), runs up to the top border and turns toward the nose, then drops along the nose flange (x 6–12) and ends in a **spiral at the top beside the flange** (v 40–47). It holds 2–3 small spiral cells. Kit: `horn: 'crook'` |
| seam filler | 23–31 | 18–48 | column of **3 framed leiwen squares** (each ≈ 8 wide × 9–10 tall) against the seam flange: `edge: 'scrolls'` / leiwen |
| borders | — | 0–1.5 and 47.5–49 | plain narrow borders top and bottom (the décor stops ≈ 1.5 mm short of the drum ends) |

The waist bands carry **one inner echo groove** (`carving: 'sparse'`). There is no crest or lozenge, and
no body. There is also **no separate nose ridge**: the flange is the nose.

```
 WAIST, one quadrant (developed), 33.8 × 49
 seam |                                     | NOSE flange
  v49 +-------------------------------------+
      | [lw]  ╔════════════════╗ @ spiral   |
      | [lw]  ║   (crook horn) ║ ‖          |
      | [lw]  ║   o  o cells   ║ ‖          |
      | [lw]  ╚═══╗            ║ ‖          |
      |  ...      ║  horn root  ‖           |
  v19 |          ( ■ ) eye ≈6 mm            |
      |  @==== C/G jaw scroll ====╗         |
      |  ||||  (B: fang grooves)  ╝  hook   |
  v0  +-------------------------------------+
     x 33.8          x≈16                    x 0
```

### c.3 Neck band (y 153.4–171.5)

- A flush frieze 18 mm tall, bounded above and below by single fine raised or incised lines.
- Short vertical dividers on the 4 flange or blade azimuths split it into **4 units, each ≈ 28.7 mm
  long**.
- **Every unit has the same orientation**: in both `side` and `side-left`, the head is at the right-hand
  end of a unit, just *left* of a divider, and a large squared spiral starts just *right* of the
  divider. This is a **same-direction procession**, not mirrored pairs.

Each unit, as I read it [unc]:

- A profile creature (kui or snake-like), facing the viewer's right (+u, toward increasing azimuth).
- At its head end, two **ring-shaped round eyes** (Ø ≈ 3.4 mm, one with a dot pupil) side by side,
  3.5 and 9 mm from the divider. They are probably the eye plus a curled snout or jaw.
- The rest of the unit is a body of framed squared spirals.
- The tail end is a large squared spiral, ≈ 8 × 8 mm.
- All flush, with pitch ≈ 0.9 mm.

Kit: `frieze` of 4 `kui`, `arrangement: 'single'`, `facing: 'right'`, `style: 'flush'`, head `eye: 'round'`.
The band is not a mirrored pair, so do not use `facing: 'centre'` here.

### c.4 Trumpet blades (y 171.5 → apex ≈ 305.5)

- **Count and position.** There are **4** blades, one per flange azimuth (0/90/180/270). The blade axis
  sits exactly over the flanges below: it is centred in both seam-facing photos.
- **Width.** Developed width is **≈ 22–23 mm and constant** from the base up to y ≈ 276 (r 36). As the
  trumpet widens, the blade fills a shrinking angle: about ±35° at the base and ±18° at y 276.
- **Gaps.** The plain ground between blades widens from ≈ 6 mm at the base to ≈ 30 mm at y 276. The blade
  bases nearly touch.
- **Apex.** Above y 276 the sides converge in a pointed-ogive **apex at y ≈ 305.5**, on the strongly
  flaring underside just below the lip band. The blade meridian length is ≈ 155 mm, which is
  **6.5–7 × its width**: much slenderer than research/01's 2–3.5 : 1.
- **Construction**, outside to inside, all flush or sunk lines with no raised plateau:
  1. Outer border: **4 nested contour lines** ≈ 1.2–1.4 mm apart. They run up both sides and close over
     the apex as concentric ogives.
  2. Lower part only (y 171.5 to ≈ 250–255): just inside the border, a narrow strip of tiny C-hooks
     (≈ 2 mm cells).
  3. Lower part only: **two columns of stacked squared spirals**, each in its own frame. Cells are
     ≈ 6 wide × 7 tall with 3–4 turns, ≈ 11–12 cells per column. The columns are separated by a plain
     ≈ 3 mm strip on the blade axis.
  4. The columns end at y ≈ 250–255 in hooked terminals: a squared T or spiral at the top of each column,
     slightly staggered. This is about **0.6 of the blade's meridian length**. Above that point the
     blade holds only the nested contour lines.
- **No mask.** I can see no mask in the blade base: the columns start straight off the neck band. The kit
  preset `gu-trumpet` uses `fill: 'mask', maskHeight 0.26`. **This vessel reads as `fill: 'leiwen'`
  columns with `leiwenTop ≈ 0.6`** and 4 border lines.

```
 BLADE (developed, ~22 wide; not to vertical scale)
            /\        apex y≈305.5, 4 nested ogive lines
           //\\
          ///\\\
         ||||||||     y≈276: sides start to converge
         ||||  ||||   only contour lines above y≈252
         ||T|  |T||   column terminals (hooks) y≈250–255
         ||▣|  |▣||
         ||▣|  |▣||   two columns of framed squared spirals,
         ||▣|  |▣||   ~11–12 cells each, 6×7 mm, plain 3 mm axis strip,
         ||▣|  |▣||   tiny C-hook strip inside the 4 border lines
         ||▣|  |▣||
 y 171.5 ==========   neck band top line
```

### c.5 Collar, fillet, lip, ring

All plain. The collar has 3 round ribs (bowstrings), ≈ 1.6 wide and ≈ 1.0 high, ≈ 4–4.5 mm apart, at
y ≈ 80.5 / 84 / 88. The neck fillet (146.8–153.4), the apron, the foot ring and the lip carry no décor.

## d. SURFACE

**Swatches.** Median sRGB of representative patches, sampled with numpy from the full-resolution
originals (`colors.py`). Studio light is neutral, but shading is included.

| role | where | swatch |
|---|---|---|
| **dominant, lit** | trumpet, lit side (`side`) | `#8c937a` rgb(140,147,122) grey-olive |
| dominant, mid | neck front | `#485241` rgb(72,82,65) dark olive-green |
| dominant, shade | trumpet, shadow side | `#272822` |
| **décor high points (silvery)** | foot band tops (`detail-foot-front`) | `#8d8f8b` rgb(141,143,139) — **neutral silver-grey** (tin-rich noble surface) |
| eye boss | foot eye | `#94948d` |
| leiwen lands | foot | `#6e6c67` |
| **recess** | foot leiwen grooves (darkest 15 %) | `#36342f` rgb(54,52,47) — brown-black |
| flange faces | waist flange, lands | `#9b9d80` lands / `#808166` average — **yellow-green, paler than the body** |
| foot ring | dominant | `#585a45` (side) / `#393930` (front, in shade) |
| ring pale crust | lightest 5 % of the ring | `#979788` pale grey-green lime crust |
| **malachite accents** | ring and rim spots (greenest 1–3 %) | `#41624b`, `#537456`, rim spots `#658063` |
| **cuprite accents** | specks on the ring and apron (reddest 0.5 %) | `#7d5449` |
| rim interior | | `#696b5a`, with pink-brown patches `#6c6154` |

**Distribution.**

- **Trumpet and neck**: an even grey-olive noble skin, finely speckled with darker olive and a few bright
  green specks, dark in shade. Some brown-pink patches show on the rim interior and inside the trumpet.
- **Waist and foot décor fields**: strikingly **silver-grey**. Tin-rich surface shows on the flat bands,
  with dark brown-black leiwen grooves, so the décor reads in high contrast, "inlaid" black on silver.
- **Flanges**: greener and yellower than the body, with bright yellow-green lands between dark score
  grooves.
- **Foot ring, apron and rim lip**: the most corroded zones. Mottled dark green and black, with
  **pale grey-green crust islands** (5–20 mm), **emerald malachite spots** (1–5 mm) and a few red cuprite
  specks. On the rim lip, the crust breaks into a speckled band.

**Gloss.** Low to medium, a satin museum sheen. The silvery bands are glossier.

**Casting.**

- No mould seams are visible: the flanges hide them. The trumpet shows no seam between the blades.
- The lip shows small chips and corrosion losses.
- No repairs are visible.

**Closest preset: `olive-museum`.** Suggested nudges:

| parameter | nudge | why |
| --- | --- | --- |
| `tinOxideTone` | 1.25 → **1.6** | toward grey 水银古 on the décor |
| `tinOxide` | 0.88 → **0.9** | |
| `polish` | 0.5 → **0.6** | glossy band tops |
| `malachite` | 0.42 → **0.35** | less crust on the upper body |
| `malachiteScale` | **1.2** | |
| `crust` | 0.25 → **0.2** | |
| `calcite` | 0.12 → **0.2** | pale ring crust |
| `cuprite` | 0.45 → **0.35** | |
| `recessDirt` | 0.55 → **0.7** | black leiwen |
| `crevice` | **0.95** | |
| `patchScale` | 80 → **45** | small territories on the ring |
| `mottleScale` | 9 → **6** | |
| `wax` | **0.55** | |
| `wear` | 0.25 → **0.3** | |
| `azurite`, `chloride` | **0** | |
| `burialSide` | **0.05** | |

Ideally the lower zones (ring, apron, lip) get a heavier malachite and calcite territory than the trumpet.
If the material allows height bias, raise malachite toward the ground. Otherwise let `patchScale` place it.

## e. CAMERA (kit view objects)

**Stage convention**, checked in `src/app/stage.js` `setView`:

- The camera direction is `(sin az·cos el, sin el, cos az·cos el)` from the target.
- **azimuth 0 = camera on +Z, looking at the front**. Positive azimuth moves the camera toward **+X**.
  For a viewer facing the front, that is the viewer's right, which is the object's own left.
- elevation is degrees above horizontal. fov is vertical. The canvas is 4:3 landscape.
- Without `target`, `fit` 1 puts the bbox exactly at the frame edge.
- With `target`, the frame half-height = `fit × R`, where R = half the bbox diagonal. R ≈ 196.5 mm for a
  170 × 311 × 170 bbox.

Here front (az 0) is taotie A's nose flange, and az +90 is the seam flange on +X.

| ref | view object | notes |
|---|---|---|
| `side.jpg` | `{ azimuth: 89, elevation: 17, fov: 26, fit: 0.98, target: [0, 166, 0] }` | faces a seam flange; taotie A's nose is on the left outline, B's on the right. Alt without target: `fit 1.17`. Solved camera: D 836 mm, height 416 mm (cam 2: fov 20). ±3° az, ±2° el, fov 20–26 |
| `side-left.jpg` | `{ azimuth: -97, elevation: 18, fov: 21, fit: 0.97, target: [0, 166, 0] }` | the opposite seam; the flange is 7° right of centre. Whether this is az −97 or +83 relative to `side` cannot be proven; the opposite lean makes 180° apart certain. ±4° |
| `detail-foot-front.jpg` | `{ azimuth: 0, elevation: 21, fov: 12, fit: 0.35, target: [0, 45, 0] }` | nose flange of the foot; ring-bottom ellipse ratio 0.42; landscape like the canvas. ±3° el, fov 10–15 |
| `detail-foot-halfmask.jpg` | `{ azimuth: 0, elevation: 21, fov: 12, fit: 0.17, target: [-16, 48, 21] }` | crop of the above, left half-mask (−X side) |
| `detail-waist.jpg` | `{ azimuth: 89, elevation: 17, fov: 26, fit: 0.16, target: [0, 121, 0] }` | crop of `side` |
| `detail-foot-seam.jpg` | `{ azimuth: 89, elevation: 17, fov: 26, fit: 0.26, target: [0, 50, 0] }` | crop of `side` |
| `detail-blade.jpg` | `{ azimuth: 89, elevation: 17, fov: 26, fit: 0.39, target: [0, 240, 0] }` | crop of `side` |
| `detail-collar.jpg` | `{ azimuth: 0, elevation: 18, fov: 12, fit: 0.07, target: [0, 92, 0] }` | crop of the detail photo |
| (no photo) `front` | `{ azimuth: 0, elevation: 17, fov: 23, fit: 1.17 }` | suggested view facing taotie A; no reference exists |

The `side*` photos are portrait (3:4) and the canvas is landscape, so compare heights, not widths.

## f. What a knowledgeable viewer checks first (priority order)

1. **Silhouette proportions.** The rim (Ø 170) is 0.55 H. The trumpet is a long, slow concave flare:
   still only Ø 44 at y 236 (0.76 H), and over **half the rim radius is gained in the top 25 mm**. The neck
   is Ø 36.4. The H / rim ratio is 1.83.
2. **The lip.** It is thin and plain, with a short 3 mm vertical band and no thickened roll. The flare
   reaches it nearly horizontal.
3. **Four very tall, narrow line-blades** stand on the flange azimuths: constant ≈ 22 mm wide, ogival
   tops of 4 nested lines reaching right under the lip. Their lower 0.6 holds two columns of framed spirals.
   There are no raised blades and no mask in them.
4. **The waist drum is a true cylinder.** It is Ø 43 × 51 mm, stepped out 2–3 mm from the neck above and
   the collar below. It carries **rectangular slab flanges** (6.7 × 52 mm) flush with its ends.
5. **The foot** is a concave bell, Ø 43.6 → 74 at the décor bottom, standing on a plain ring
   (Ø 93–97 × 17.5) with a broad plain apron and a fine arris. The **flange spurs sweep out beyond the
   ring** to Ø ≈ 105. Spurless or ring-flush flanges read wrong.
6. **Two masks per register, not four.** Noses are on the 0/180 flanges and seams on 90/270. Each
   half-mask fills a full quadrant: at the foot the eye is 0.37 out, at the waist 0.47 out and low
   (0.33 up).
7. **The eyes are the only raised relief.** They are rounded-square domed bosses ≈ 6 mm; the foot eyes
   have a horizontal slot pupil. Everything else is **flush flat bands**. Style V plateaus with heavy
   relief would be wrong here.
8. **Squared crook horns.** They rise beside the eye and turn over toward the nose, ending in a spiral.
   There is no lozenge or crest, and no separate nose ridge.
9. **Ladder-scored flanges** at ≈ 3.7 mm pitch (≈ 14 rungs per waist flange). The crest is finely
   beaded, not deeply notched or hooked.
10. **Collar with exactly 3 ribs** between waist and foot; the neck fillet and apron are plain.
11. **The neck frieze**: 18 mm, 4 same-direction creature units with round ring eyes.
12. **Colour logic.** Silvery décor fields with black grooves on the waist and foot, a grey-olive trumpet,
    yellow-green flanges, and a mottled green, black and pale-crust ring and lip with emerald and red
    specks.
13. **Fine squared leiwen**, pitch ≈ 0.8–0.9 mm. It is in framed cells, not a uniform meander.
14. **No cruciform holes.** The vessel leans slightly (≈ 0.8°) and the rim is ≈ 1.5° out of level.

## Things the modeller should know (uncertainties)

- **Hidden flare.** The flare between y 292 and 307 is hidden in every photo (±2 mm in r). The lip's
  radial thickness and all wall thicknesses are estimates.
- **Waist nose azimuth.** Whether the waist mask noses sit on the same flanges as the foot noses is
  inferred, not seen [unc]. Both registers are symmetric enough that a swap would show only in the
  eye-to-flange distances.
- **Neck frieze reading.** The creature identity and the head direction of the neck frieze are uncertain.
  Its 4-fold same-direction repeat is consistent across both photos.
- **Foot upper sub-band.** Its exact band geometry (v 40–53) is the least legible part of the foot mask.
  Use `detail-foot-halfmask.jpg`.
- **Kit presets vs this dossier.** `gu-trumpet` uses `fill: 'mask'`, but this dossier says
  `fill: 'leiwen'` columns. `_study-lathe.js` scores the flanges at 4.2–4.6 mm, but this dossier
  measures 3.7. The study's `GU_PROFILE` agrees with mine on the drum (r 21–21.4), the trumpet (r 21.9 at
  y 236, 43.7 at 286) and the lip. It is **narrower** than my measurement in three places:
  - the foot ring: r 43.5, against 46.5–48.3 here;
  - the collar: r 16.9, against 19.6;
  - the neck bottom: r 16.4–16.6 at y 141–160, against 18.2–18.5.

  Trust the numbers here. They come from flange roots and silhouettes checked in two photos.
