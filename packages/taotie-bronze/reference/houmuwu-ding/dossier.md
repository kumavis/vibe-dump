# Dossier: houmuwu-ding (后母戊鼎 / 司母戊鼎, the Houmuwu fangding)

**Ground truth.** Every measurement and décor reading here comes from the photos in this folder. See `SOURCES.md` for licences. The work scripts are in `.work/dossier-houmuwu-ding/`.

**Confidence tags**

| tag | meaning |
| --- | ------- |
| **[pub]** | published figure |
| **[firm]** | read directly and repeatably from several photos |
| **[good]** | measured through a solved camera, about ±4 % |
| **[est]** | inferred or oblique, about ±10–20 % |
| **[guess]** | typological default, not visible |

## Frame and part names (use these exactly)

**Axes**

- Units are mm. Y is up. The vessel stands on y = 0 (the plinth top).
- The **long axis is X**. The handles stand on the two **short end faces at ±X**.
- The **front long face faces +Z**. All four walls are framed the same way: long faces = `long`, end faces = `short` in fangBody terms.
- **Azimuth convention.** This follows `src/app/stage.js`, which places the camera at `target + dist·(sin az·cos el, sin el, cos az·cos el)`. So az 0 looks at the +Z long face. Positive az moves the camera toward +X, which is screen-right in the front view, and the +X end (handle) face comes into view on the right. That is the object's own left. az +90 looks straight at the +X end face. `fov` is the vertical field of view. `fit` multiplies the bbox-fitting distance (1 = bbox touches the frame).

**Part names (`userData.part`)**

Tag each mesh with exactly one of these. Do not nest a tagged part inside another tagged part.

| part | what it is | y range (mm) | fraction of H |
| ---- | ---------- | ------------ | ------------- |
| `body` | box walls, floor and the **rim slab**. No flanges. It may be one mesh. If you split off the rim slab, tag it `rim`; spec.json does not test `rim` | 465 – 1043 | 0.350 – 0.784 |
| `legs` | 4 hollow columnar legs. Include their own short flanges (on the mask zone) and the mask relief | 0 – 465 (+ embed) | 0 – 0.350 |
| `handles` | 2 upright handles, **including the root blocks** that hang down over the rim's outer face to the wall top | 985 – 1330 | 0.741 – 1.000 |
| `flanges` | 4 full-height corner flanges, plus 8 short mid-wall flanges (top and bottom frieze on each face). Body only | 465 – 985 | 0.350 – 0.741 |

There is no `lid`, `knob`, `foot`, `neck` or `waist` on this vessel. Do not invent them.

---

## a. Identity

| field | value |
| ----- | ----- |
| Title | **Houmuwu ding** (formerly read **Simuwu ding**). Chinese 后母戊鼎 / 司母戊鼎, also 后母戊大方鼎. The 1949 rubbing is mounted as 安陽大鼎. **[pub]** |
| Type | fangding 方鼎: rectangular cauldron on four legs, with two upright handles (立耳) |
| Date | c. 1200 BC (13th–12th c. BC). The usual attribution is to the reigns of Zu Geng / Zu Jia, sons of Wu Ding. Mother Wu (母戊) is identified as Wu Ding's consort Fu Jing (妇妌). |
| Period | Late Shang, Anyang (Yinxu) phase II |
| Findspot | Wuguan village (武官村), Anyang, Henan. Found by villagers 19 March 1939, reburied, recovered 1946. Its tomb is identified as M260 of the royal cemetery (Xibeigang). |
| Collection | National Museum of China, Beijing (in its collection since 1959) |
| Accession | not published on any source reachable here — **unknown** |
| Published dimensions | H **133 cm** including handles. Mouth **110 × 79 cm** (also given as 112 × 79.2). Legs **46 cm**. Wall **6 cm** thick. **832.84 kg** (older figure 875 kg). **[pub]** (zh.wikipedia) |
| Inscription | 后母戊 (or 司母戊), 3 characters cast in intaglio on the **inner wall** (腹内壁). The rubbing shows the inscription cartouche, roughly 9 × 16 cm if it is printed at the same scale as the wall **[est]**. Not visible in any photo here, because the mouth is covered by glass in the gallery. |
| Casting | The body was cast in **one pour from 28 clay mould sections**. The **handles were pre-cast and set into the body mould** (先铸成后嵌入鼎范), so they are not cast on afterwards; research/03 §1.1 should be corrected on this point. When found, **only one handle survived**. The other is a **modern replica**; the photos do not show which one. |

**Label blurb (2–3 sentences).** The heaviest bronze vessel to survive from ancient China. This rectangular cauldron, 133 cm high and 832 kg, was cast in about 1200 BC at the Shang royal capital, Anyang, for the cult of a royal mother, "Mother Wu", whose name is cast inside its wall. Each wall carries a plain central panel. It is framed by confronted dragons on a dense thunder-pattern ground, with ox-headed masks at the upper corners. Tigers about to devour a human head crown the handles.

---

## b. Form — measured

### b.1 Method

1. **Camera solve.** `front.jpg` (Canon 500D, f = 21 mm, APS-C, vertical fov 39.0°) and `side.jpg` (500D, f = 28 mm in portrait, vertical fov 43.4°) were solved by hand from image rows. The inputs were:
   - rim top, wall top and body bottom on the near face;
   - handle tops one plane further back;
   - near and far leg feet.

   Both solve to the **same camera height, 668 ± 10 mm above the plinth**. That is the height of the bbox centre, so both have elevation about 0°.

   **front.jpg:** near face at 1.88 m; front leg feet predicted at y 603 px vs 605 observed; back feet 485 vs 500; handle tops 113 vs 112. The checks agree.

   **side.jpg:** near face at about 1.81 m, with mild barrel distortion.

2. **Rubbing.** `rubbing-long-face.jpg` is orthographic by construction (a flat wall). It gives the frame fractions on the long face. Its handle and leg parts are separate sheets, so its overall proportions were **not** used.

3. **Scale.** The photos give mouth/H about 4.5 % smaller than the published 1100/1330 on both axes. Plan dimensions below are **scaled to the published mouth**; heights use the camera-solved fractions of H = 1330. Expect a 3–5 % disagreement between a render at published dimensions and the photos in plan. spec.json tolerances allow for it.

4. **Segmentation.** Automatic segmentation was not usable: the gallery backgrounds are crowded with visitors and display cases. All edges were read with gridded crops and row-gradient profiles (`grid.py`, `edges.py`, `prof.py`). An FFT measured the leiwen pitch (`pitch.py`).

### b.2 Heights (y in mm, fraction of H = 1330)

| level | y mm | y / H | conf | note |
| ----- | ---- | ----- | ---- | ---- |
| ground (leg soles) | 0 | 0 | | soles flat, no swelling foot |
| top of lower-leg "sleeve" step | ≈ 157 | 0.118 | [est] | a crisp horizontal step, ~3 mm proud below; see §d |
| bowstring 1 (lowest) | ≈ 172 | 0.129 | [good] | raised ribs ≈ 8–10 wide, ≈ 3–4 high |
| bowstring 2 | ≈ 200 | 0.150 | [good] | pitch ≈ 27–28 mm |
| bowstring 3 (highest) | ≈ 228 | 0.171 | [good] | |
| bottom of leg-mask zone | ≈ 250 | 0.188 | [good] | the mask zone is the top ≈ 46 % of the leg |
| **leg top = body underside** | **465** | **0.350** | [good] | matches the published leg height of 46 cm |
| bottom frieze | 465 – 591 | 0.350 – 0.444 | [good] | 126 mm, about 0.245 of the wall |
| plain field | 591 – 857 | 0.444 – 0.644 | [good] | 266 mm, about 0.517 of the wall |
| top frieze | 857 – 980 | 0.644 – 0.737 | [good] | 123 mm, about 0.238 of the wall |
| wall top (in the rim's shadow) | ≈ 985 | 0.741 | [est] | about 5 mm of plain wall above the frieze |
| **rim slab** | **985 – 1043** | **0.741 – 0.784** | [good] | slab outer face ≈ 58 mm tall |
| **rim top** | **1043** | **0.784** | [good] | |
| top of handle aperture | ≈ 1240 | 0.932 | [good] | aperture ≈ 197 mm tall above the rim top |
| **handle tops** | **1330** | **1.000** | [pub] | **handles rise 287 mm above the rim (0.216 H)** [good] |

| zone | height | fraction of H |
| ---- | ------ | ------------- |
| legs | 465 | 0.350 |
| body incl. rim | 578 | 0.435 |
| wall (body minus rim) | ≈ 520 | 0.39 |
| handles above rim | 287 | 0.216 |

The scout note gave the body as ≈ 0.45 and the legs as ≈ 0.35. The legs check out. The body is 0.435 and the handles are 0.216.

### b.3 Plan

| item | long (X) | short (Z) | conf |
| ---- | -------- | --------- | ---- |
| rim, outer | **1100** | **790** | [pub] |
| rim overhang beyond the wall face | ≈ 28 | ≈ 30 | [est] (the photos agree on 27–28; the rubbing suggests up to 55, but rubbings wrap the rim) |
| wall outer face at the top (under the rim) | ≈ 1042 | ≈ 731 | [good] |
| wall outer face at the bottom | ≈ 1001 | ≈ 723 | [est] |
| wall lean (outward going up) | **≈ 2.2°** (end walls) | **≈ 0.5°** (long walls) | [est] ±1°. The box is nearly vertical-walled, much steeper than the 3–7° default in research/03. |
| wall thickness | 60 (published "壁厚6公分"); model the inner skin as a plain offset of 55–60 | | [pub] |
| rim top width (outer edge to mouth) | ≈ 90–110 = overhang plus wall | | [est] (the mouth is never seen uncovered) |
| corners | **sharp arris, covered by a full-height diagonal corner flange** | | [firm] |
| floor / underside | flat; the legs join directly under the corners | | [firm] (`detail-frieze-bottom-centre.jpg`, `side.jpg`) |

**Rim section.** A thick flat slab 58 tall, overhanging the wall by about 28 mm all round, with square-ish arrises softened to r ≈ 4–6 mm by corrosion. The top surface is flat and rough (pitted, about 1–2 mm pits). The slab's outer face is plain. Use fangBody `rim: { kind: 'slab', height: 58, overhang: 28, inner: ~0, round: 5 }`. The **rim is not perfectly straight**: `side.jpg` and `detail-handle.jpg` show about 5–8 mm of waviness along it [est].

### b.4 Legs (4)

| item | value | conf |
| ---- | ----- | ---- |
| form | straight **cylinders** with no entasis that can be measured. The mask zone reads ≈ 8–10 mm fatter because of the relief. There is no flared foot; the sole is flat and worn. | [firm] |
| diameter | shaft ≈ **160** (0.12 H, 0.145 × rim long side); over the mask relief ≈ 175 | [good] |
| centres | x = **±429**, z = **±260** (centre-to-centre ≈ 858 × 520) | [good] ±15 |
| relation to the body | outer surfaces about flush with the end walls in X and ≈ 20 mm inside the long walls in Z, so each leg sits under its corner | [est] |
| hollow | published as hollow. The lower legs show small breaks and holes into the cavity: front-left in `front.jpg`, and in `detail-leg-b.jpg` and `detail-leg-d.jpg`. Use `hollow: { wall: ~25, open: 'bottom' }`. | [pub] / [firm] |
| leg flange | one short notched flange on the leg's **outward diagonal** (pointing away from the vessel centre), running only over the mask zone (y ≈ 250–465). Projection ≈ 20–25, thickness ≈ 15, about 4–5 rectangular notches at ≈ 40 pitch. | [est] |
| bowstrings | 3 raised rings (§b.2) | [firm] |
| sleeve step | below the bowstrings (y ≈ 157) the leg has a slightly larger "sleeve" (+2–4 mm radius) with a crisp upper edge, on all visible legs | [firm] that it exists; [est] for the size |

The sleeve step is probably a mould joint or a cast-on repair of the lower leg. It has a rougher, pitted surface.

### b.5 Handles (2, on the ±X end walls)

| item | value | conf |
| ---- | ----- | ---- |
| outline | inverted U with **flat top and rounded outer corners (r ≈ 25)**. The aperture has rounded top corners (r ≈ 18). | [firm] |
| outer width (along Z) | ≈ **290** (0.37 × short side, 0.218 H) | [good] |
| height above rim top | **287** (0.216 H) | [good] |
| aperture | ≈ **116 wide × 197 tall**, from the rim top | [good] |
| upright width | ≈ 84 | [good] |
| top-bar height | ≈ 90 | [good] |
| depth (thickness along X) | ≈ **100 ± 10**, i.e. a chunky bar | [est] |
| position | centred on z = 0. The handle sits on the full rim width, with its outer face about flush with (≈ 5 proud of) the rim's outer face at x ≈ ±550; centre-plane x ≈ ±500. | [est] |
| lean | none visible: vertical within ±2° | [firm] |
| root blocks | each upright continues **down over the rim's outer face to the wall top** as a block ≈ 84 wide × ≈ 60–70 tall. It is topped by a plain raised collar band ≈ 15–20 tall at the rim-top level. | [firm] |

### b.6 Flanges (body)

**Corner flanges (4)**

| item | value | conf |
| ---- | ----- | ---- |
| run | full wall height y 465 → ≈ 985, tucking under the rim slab | [firm] |
| placement | on the corner arris, bisecting the corner (diagonal) | [good] |
| projection p | ≈ 30 (range 25–40) | [est] |
| thickness t | ≈ 20 (range 15–25) | [est] |
| outer edge | plain flat crest, softened | [est] |
| notches | **rectangular slots cut into the crest**, ≈ 10 wide (range 7–12) × ≈ 15 deep (≈ 0.5 p) | [est] |
| notch pitch | ≈ 40 (35–55): **11–13 notches** per corner, sometimes in pairs | [good] count |
| profile type | **F1, plain notched**. No hooks and no incised T/L scoring visible at this resolution. | [firm] |

These are much plainer and blockier than the hooked flanges of a fangyi. From the side they read as a "comb" with dark square gaps.

**Mid-wall top flanges (4, one per face, on the face axis)**

- Narrow vertical bar, thickness ≈ 15, projection ≈ 20 [est].
- Runs from the wall top through the whole top frieze and **≈ 40 mm below it into the plain field** (bottom end ≈ y 817). Total length ≈ 165 [good].
- The **top end hooks outward**: a small beak (`detail-handle-roots.jpg`).
- The lower end has a short crossbar at the frieze's lower border, then a rounded stub in the field (`detail-frieze-top-centre.jpg`).
- 1–2 shallow notches.
- Type F1/F2.

**Mid-wall bottom flanges (4)**

- Only within the bottom frieze, y 465 → 591, length ≈ 125, thickness ≈ 15–18, projection ≈ 15–20 [est].
- **Segmented into 4–5 blocks** by notches at ≈ 23 mm pitch (`detail-frieze-bottom-centre.jpg`, `detail-short-wall.jpg`).

**Correction to the brief.** The mid-wall flanges do **not** run full height. Only the corner flanges do.

### b.7 Other geometry notes

- **Relief levels** (§c gives the details):
  - leiwen ground: grooves ≈ 0.8 deep;
  - motif plateau (L1): ≈ 3 mm above the ground, flat-topped;
  - eye bosses (L2): ≈ +4–5 above the plateau (7–8 above the ground);
  - leg masks (V-b): 6–10 mm;
  - the human head on the handle (L3): projects ≈ 15–20.
- **Field recess.** The plain field is **lightly recessed, ≈ 2–4 mm** below the frieze surfaces. Each frieze has a narrow plain raised border (≈ 6–8 wide) along its field side, which casts a shadow line onto the field [est].
- **Cracks and repairs.** Both short-face fields show old cracks or repair seams running across the plain panel (`detail-short-wall.jpg`, `detail-handle-roots.jpg`). The long faces show fewer.
- **Mouth cover.** In every gallery photo the mouth is covered by **glass** (it shows reflections in `side-low.jpg`). Do not show an open dark interior in the matching views. The interior is undocumented here: smooth walls, flat floor, inscription on one inner wall [guess for its position].

---

## c. Décor map

### c.1 Overview of the scheme

**All four walls share one scheme**, differing only in length:

- a frame of four friezes (top, bottom, two side columns) around a plain recessed field;
- **corner squares** where the friezes meet;
- every motif on a squared leiwen ground (雷纹, pitch ≈ 1.9 mm).

The relief is **Loehr V-a with sparse carving**: flat plateaus at L1 with one incised contour line, domed round boss eyes, squared spiral terminals. The ground spirals are packed inside the big tail spirals too. Faces are mirror-symmetric about the mid-wall flange. **Opposite faces are identical** (long = long, short = short) [firm for the faces seen; the back long face is seen only obliquely].

### c.2 Your brief versus the photos

| brief | photos |
| ----- | ------ |
| "plain central rectangle framed by friezes" | correct, and the field is **slightly recessed** |
| "taotie centred on the top/bottom borders with kui dragons" | **partly wrong.** The top and bottom friezes each hold **two long kui confronted at the short mid-wall flange**. Their heads (eye boss, squared crest, jaws) meet at the flange and read together as a split-body taotie face (grammar **T8, two-kui**). There is **no separate frontal mask** there. The only real masks on the walls are the **corner masks**: **ox-head (牛首) masks at the four upper corners and taotie at the four lower corners**, each split across the corner arris with the corner flange as its nose. This agrees with zh.wikipedia: 扉棱上为牛首，下为饕餮. |
| "kui columns on the sides" | correct: **one tall vertical kui per column** |
| "flanges at corners and mid-wall" | correct, but the mid-wall flanges are short (§b.6) |
| "leg tops carry taotie masks above bowstrings" | correct: **three** bowstrings; the mask is centred on the leg's outward diagonal flange |
| "handle sides carry paired tigers devouring a human head" | **location wrong.** The tigers and the head are on the **outer broad face** of each handle, the one facing away along X. The narrow **side edges carry fish** (鱼纹), and the **inner face is plain**. |

### c.3 Long face (front and back): wall ≈ 1020 wide at mid height, 520 tall

```
x (mm from left arris):  0     120                       510                        900   1020
                         ┌─────┬──────────────────────────╥──────────────────────────┬─────┐ y 980
          TOP FRIEZE     │ OX  │ tail▣═══quills═══╗eye● C ║ C ●eye╔═══quills═══▣tail │ OX  │
          123 mm         │head½│  (sq.spiral) body ╚ ∩jaw ║ jaw∩ ╝ body (sq.spiral)  │head½│
                         ├─────┼──────────────────────────╨──────────────────────────┼─────┤ y 857
                         │  ⌐  │                          ┃ (stub ≈40 into field)    │  ⌐  │
          SIDE COLUMNS   │ K5  │                                                     │ K5  │
          120 wide       │kui  │            PLAIN FIELD 780 × 266                    │kui  │
          (head up,      │ ●   │            (recessed 2–4 mm, mottled red/green)     │  ●  │
          facing corner) │ ⟲   │                                                     │  ⟲  │
                         ├─────┼──────────────────────────╥──────────────────────────┼─────┤ y 591
          BOTTOM FRIEZE  │TAO- │ tail▣═══quills═══╗eye● C ║ C ●eye╔═══quills═══▣tail │TAO- │
          126 mm         │TIE½ │       legs ⌐⌐ claws  ⟆   ║   ⟅  claws ⌐⌐ legs      │TIE½ │
                         └─────┴──────────────────────────╨──────────────────────────┴─────┘ y 465
                           ▲ corner flange (full height)   ▲ mid flange (top / bottom frieze only)
```

**Top frieze, kui unit (one per half, 390 × 123 mm, head at the flange)**

| element | x from the flange axis (mm) | y in the frieze from its bottom (mm) | notes |
| ------- | --------------------------- | ------------------------------------ | ----- |
| eye | centre ≈ 45–55 | ≈ 55 (0.45) | round domed boss Ø ≈ 16–20, flattened dome (height ≈ 0.4 r); no slit visible, at most a faint central dot |
| crest / horn above the eye | 30 → 105 | 65 → 113 | squared C-scroll ≈ 75 × 45, opening downward and outward, ending in an inward squared curl. Grammar: squared **C-horn (H1)** or kui crest, `square` ≈ 0.85 |
| jaws below the eye | 10 → 100 | 10 → 45 | a squared ∩ arch whose two legs end in inward hooks: the open upper and lower jaw (`jaw: 'hooked'`). The ∩ of each half sits beside the flange, so the pair reads as a mask's mouth. |
| body | 110 → 300 | centreline ≈ 0.5, band ≈ 15–18 wide | straight band carrying a row of 6–8 small squared C-hooks (quills) above and below it |
| tail | 300 → 385 | | a **large squared spiral** ≈ 75–90 mm square, 3 turns, attached by a long bar |

**Bottom frieze, kui unit (390 × 126 mm)**

- The head is the same, but the eye is a little lower (y ≈ 0.55 from the frieze top).
- Instead of the ∩ jaws there are **two short legs with hooked claws (toes pointing toward the flange)**, plus a **trunk or snout that curls down at the flange foot** (`detail-frieze-bottom-centre.jpg`).
- The body carries quills; the tail is the same large squared spiral.

**Short-face friezes.** The same units at 243 mm per half. The body is shortened to a single bar with 3–4 hooks. The tail spiral is ≈ 60–70 mm and sits right next to the corner square.

**Corner squares (120 × 123 top, 120 × 126 bottom)**

These are half-masks whose axis is the corner flange. The other half is on the adjacent face.

- **Top (牛首, ox-head):**
  - a broad **crescent ox horn (H3 'buffalo')** along the top of the square, with **transverse ribbing** (comb-like incisions), curving away from the corner;
  - a round boss eye Ø ≈ 15 about 40–45 from the arris, at mid height;
  - a short ∩ jaw with a hooked fang below.
- **Bottom (饕餮):** a squared C-horn, a round boss eye, a hooked jaw and squared spiral fillers.

**Side columns (120 × 266)**

- One vertical **K5 kui, head UP at the top of the column, facing the corner flange** (outward).
- Round boss eye Ø ≈ 15–18 at ≈ 0.33 of the column height from its top, ≈ 35 mm from the corner side.
- Squared crest above the eye, jaw opening toward the corner.
- The body descends in squared hooks to a **large squared tail spiral at ≈ 0.8** of the column height.
- Leiwen ground [good: `detail-short-wall.jpg`, `rubbing-long-face.jpg`].

**Mapping onto the kit.** Use `frame(panel, rect, { width: { t: 123, b: 126, l: 120, r: 120 }, top: kui pair facing centre, bottom: kui pair facing centre, sides: 'kui', sideHeads: 'up' })`. Two differences from the current `houmuwu-wall` frieze preset:

- `sideHeads` is **'up'**, not 'down';
- the column width is 0.12 of the wall, not 0.14.

The kui preset `houmuwu` is close. Change `crest` from 't' to a squared C-hook, and keep `eye: 'round'` and `pupil: 'none' | 'dot'`. The corner squares need a half-mask whose axis lies on the panel **edge**: `taotie` with `horn: 'buffalo'` for the top squares (ox-head) and `horn: 'c'` for the bottom ones, drawn as one half against the corner.

### c.4 Mould sections

The décor is consistent with **4 wall sections split at the corners**, under the corner flanges. Each face is carved as two mirror halves meeting at the mid flange; the halves differ by ±3–5 % in positions (hand-carved). Use a per-half seed.

The published total of 28 mould pieces also covers the legs (2–3 each), the floor and the core pieces, so the walls may also be split horizontally at the frieze borders. A fine line under the top-frieze border is visible on the long face [est].

### c.5 Leg mask (one per leg, × 4, identical)

- **Size:** zone y 250 → 465 (215 tall), wrapping ≈ 200–220° of the leg, ≈ 290–300 mm of arc. **Style V-b sculptural**, high relief 6–10 mm, sparse carving with a single contour line. Leiwen only in small leftover areas.
- **Axis:** the leg flange, on the outward diagonal.

Components of each half, in x = fraction of the half-width from the axis and y = fraction of the zone height from its bottom:

| component | description | x | y | conf |
| --------- | ----------- | - | - | ---- |
| horn | **ram-type, inward curl (H2 'ram')**. A broad band starts at the top beside the flange, runs outward along the top edge, turns down at the outer side and sweeps back toward the axis, ending in a tight spiral just above and inside the eye | spiral centre ≈ 0.3 | ≈ 0.68 | [good] |
| eye | rounded-square / oval boss ≈ 30 × 24 mm, with a sunk ring or dot pupil (`eye: 'oval'`, `pupil: 'ring'`) | ≈ 0.35 | ≈ 0.45 | [firm] |
| ear / outer C | outside the eye, a C-shaped plateau with a hollow centre | ≈ 0.7 | ≈ 0.5 | [good] |
| jaw / nostril | below the eye, a big S-band leaving the axis bottom and curling outward into a spiral (`jaw: 'double'`) | ≈ 0.3–0.5 | ≈ 0.1 | [good] |

The kit preset `houmuwu-leg` (horn 'c', oval ring eye, jaw 'double', V-b) is close. Change **horn to 'ram'**.

### c.6 Handles

**Outer face (one per handle; the relief is ≈ 5–8 above the face, the head ≈ 15–20)**

- **Two tigers in profile**, mirror pair.
  - Each **head sits at an upper outer corner**: a big C-scroll ear in the corner, a domed boss eye Ø ≈ 22 at ≈ 60 from the axis and ≈ 30 below the top edge.
  - **Open jaws face the centre.** The upper-jaw S-bands reach toward the head.
  - Each **body runs down one upright**, back on the outer edge. It is patterned with C-hook stripes ("scales").
  - A foreleg with claws at mid height and a hind leg lower down, both toward the aperture.
  - The **tail curls up at the bottom** just above the root collar.
- **Human head:** frontal, ≈ 40 wide × 50 tall, in the round at the top centre between the tiger jaws, right above the aperture. A small crest or mask sits above it.
- **Ground:** leiwen.

**Root blocks.** Below the collar band, on the rim face, each upright's root carries a small mask:

- crescent horns with **transverse ribbing** (ox type) across its top;
- **two ring-eyes** (Ø ≈ 12, a sunk ring around a dot);
- scrolls beneath.

**Edges (narrow sides, ≈ 100 wide).** Fish (鱼纹), about 2 per upright edge, stacked vertically on leiwen [good: front.jpg, rubbing]. Facing direction [est]: heads up.

**Inner face (toward the mouth).** Plain [good: `three-quarter.jpg`, far handle].

```
 HANDLE OUTER FACE (290 × 287 above rim; aperture 116 × 197)
 ┌────────────────────────────────┐ y 1330
 │ @ear  ●eye  ≈≈(☺)≈≈  eye●  ear@│  ← tiger heads, jaws open toward the human head
 │ ┌─────┐ ┌────────────┐ ┌─────┐│ y 1240
 │ │tiger│ │            │ │tiger││
 │ │body ││ │  aperture  │ ││body││  (stripes = rows of C-hooks)
 │ │ leg⌐│ │            │ │⌐leg ││
 │ │tail@│ │            │ │@tail││
 │ ├═════┤ │            │ ├═════┤│ ← plain collar band ~15–20 tall
 └─┤mask ├─┘            └─┤mask ├┘ y 1043 rim top
   │◎ ◎  │   rim face       │ ◎ ◎ │   root masks, down to y ≈ 985
   └─────┘                  └─────┘
```

### c.7 Ground and relief numbers

| item | value | conf |
| ---- | ----- | ---- |
| leiwen pitch | **1.9 mm ± 0.3**, squared (`roundness` ≈ 0.1), 4–5 turns per typical spiral | [good] FFT on `detail-frieze-top-centre.jpg` at 0.317 mm/px |
| leiwen cells | 15–35 mm, the largest under the kui bodies | |
| leiwen grooves | ≈ 0.8 wide, ≈ 0.8 deep | [est] |
| motif bands | ≈ 8–10 wide (crest and jaw bands), body ≈ 15–18 | |
| plateau height | ≈ 3 mm | |
| contour groove | one, inset ≈ 2–2.5 mm, ≈ 0.8 wide | |
| eye bosses | ≈ 7–8 above the ground | |

The kit's `monumental` leiwen preset (2.4 mm) is slightly too coarse. Use about 1.9–2.0 mm.

---

## d. Surface

**Swatches.** Sampled with numpy from representative patches (`swatch.py`, `swatch_jobs.json`).

The Gary Todd photos are tungsten-lit: their raw colours are warm, and their white balance was corrected against the white plinth. The Mlogic `three-quarter.jpg` is cool and teal. The truth sits between them. Suggested targets are given, with the extremes in brackets.

| role | suggested sRGB | range seen | where |
| ---- | -------------- | ---------- | ----- |
| **dominant** (field and walls) | `#8a8f8a` grey-green | WB `#918c8a` … teal `#87a19d` … warm raw `#b3896d` | the plain fields, rim |
| field **red mottle** (cuprite) | `#9a7a70` | WB `#9d8182`, raw `#b88366` | blotches 10–40 mm across the fields, densest on the long faces |
| field **green mottle** | `#7fa29c` | `#859f9f` … `#77a9a5` | interleaved with the red; a fine speckle, ~5–15 mm |
| **mauve / lilac grey** | `#958e93` | `#94918d` (short fields) | the short-face fields read violet-grey (lime film over cuprite) |
| **recess** (leiwen grooves, under the rim) | `#2a2216` | `#24150e` … `#302c1b` | every groove in the friezes is near-black brown |
| **high points** (plateau tops, arrises) | `#a9b4b0` pale grey-green | `#aeb9b9`, `#c1cecf` | frieze plateaus, eye bosses, flange crests |
| **legs** | `#565c4c` dark olive | `#4d493a` … `#4f6551` | legs are darker and greener than the body |
| **accent: bright crust** | `#8fc0bf` pale blue-green | `#bad9e3` / `#72a6a5` | small malachite and chloride spots on handles, legs and rim |
| **accent: cuprite spots** | `#a0786a` | raw `#aa795f` | pink-red spots on the handle tigers and root masks |

**Distribution**

- **Fields.** Fine **red-and-green mottle** on the long faces; a more lilac-grey, smoother patina on the short faces. No thick crust; the original surface is preserved as a thin, fairly even skin.
- **Friezes.** Greener and paler on the plateaus. Grooves dark (soil and recessDirt). Leiwen fully legible, so the crust is thin.
- **Rim slab.** Rough, pitted, pale grey-green, with a few pink spots.
- **Legs.** Darkest. Olive-green with bright teal crust spots. The lower sleeve is rough and pitted, with holes.
- **Handles.** As the friezes, plus pronounced pink cuprite spots.

**Other surface properties**

- **No bare metal anywhere.**
- **Gloss:** matte to faintly satin. A slight sheen on the relief tops from handling and old wax.
- **Casting flaws:** pitting on the rim top and lower legs (1–3 mm); small holes and breaks into the hollow legs near the feet (≈ 10–25 mm); a rough "sleeve" texture below the leg step.
- **Repairs:** old **cracks or repair seams across both short-face fields** (thin raised or dark lines, irregular); one handle is a modern replica.
- **Mould seams:** hidden under the corner flanges. None visible on the plain fields.

**Patina preset.** The closest is **`excavated-green`**, which the kit already labels Houmuwu. Suggested nudges:

| parameter | change | reason |
| --------- | ------ | ------ |
| `malachite` | 0.74 → **0.55** | the green is greyer and thinner than a crust |
| `malachiteTone` | 0.62 → **0.72** | paler, earthier green |
| `crust` | 1.1 → **0.7** | relief and leiwen stay crisp |
| `cuprite` | 0.9 (keep) | the red mottle in the fields depends on it |
| `mottleScale` | 8 → **12** mm | |
| `patchScale` | 60 → **120** mm | large territories on a 1.3 m vessel |
| `calcite` | 0.85 → **0.7** | |
| `recessDirt` | 0.3 → **0.45** | near-black grooves |
| `chloride` | 0.12 → **0.08** | |
| `wax` | 0 → **0.1** | |
| `wear` | 0.15 → **0.22** | rim top and handle tops |
| `soot` | 0.1 → **0.05** | |

A slightly greener per-mesh bias on the legs is fine. They read darker partly because they are in the shade under the body.

---

## e. Cameras (stage.js view objects)

Coordinates are in the frame defined at the top. The bbox is about 1110 × 1330 × 790, and its centre is about [0, 665, 0]. **Photos are 3:2 or portrait; renders are 4:3.** `fov` is matched to the vertical framing, so expect extra or missing air at the sides. No render reproduces lens distortion: `side.jpg` and `three-quarter.jpg` have mild barrel distortion.

| ref | view object | confidence / notes |
| --- | ----------- | ------------------ |
| `front.jpg` | `{ azimuth: 0, elevation: 0, fov: 39, fit: 1.0 }` | [good]. Solved: camera 1.88 m from the long face, 0.67 m above the plinth (EXIF 21 mm, APS-C). The near legs look much larger than the back legs; that is real perspective, keep fov 39. |
| `side.jpg` | `{ azimuth: 90, elevation: 0, fov: 43, fit: 1.04 }` | [good]. EXIF 28 mm portrait; camera ≈ 1.8 m from the end face, 0.67 m high. |
| `three-quarter.jpg` | `{ azimuth: -55, elevation: 1, fov: 40, fit: 0.97 }` | [good]. The −X end face shows on the left. Camera 2.44 m from the centre, ≈ 0.69 m high, so the rim's top edges fall away on both sides (the camera is below the rim). EXIF 38 mm full frame, cropped. |
| `three-quarter-left-low.jpg` | `{ azimuth: -27, elevation: 3, fov: 40, fit: 1.0 }` | [est] |
| `three-quarter-right.jpg` | `{ azimuth: 46, elevation: 5, fov: 40, fit: 1.0 }` | [est] |
| `three-quarter-right-b.jpg` | `{ azimuth: 43, elevation: 5, fov: 40, fit: 1.05 }` | [est] |
| `side-low.jpg` | `{ azimuth: 70, elevation: 2, fov: 45, fit: 0.95 }` | [est]. Behind glass, red plinth. |
| `detail-short-wall.jpg` | `{ azimuth: 90, elevation: 2, fov: 30, fit: 0.32, target: [500, 725, 0] }` | [good] |
| `detail-frieze-top-centre.jpg` | `{ azimuth: 0, elevation: 4, fov: 20, fit: 0.2, target: [0, 900, 395] }` | [good] |
| `detail-frieze-bottom-centre.jpg` | `{ azimuth: 90, elevation: 1, fov: 22, fit: 0.24, target: [490, 520, 0] }` | [est]. The real camera looks up from about −10° under the body; stage.js caps the polar angle, so 1° is the closest it can do. |
| `detail-handle-front.jpg` | `{ azimuth: 90, elevation: 3, fov: 20, fit: 0.24, target: [520, 1170, 0] }` | [good] |
| `detail-handle.jpg` | `{ azimuth: 90, elevation: 1, fov: 18, fit: 0.22, target: [520, 1160, 0] }` | [good]. Shot from slightly below. |
| `detail-handle-roots.jpg` | `{ azimuth: 90, elevation: 1, fov: 20, fit: 0.22, target: [520, 990, 0] }` | [good] |
| `detail-leg.jpg`, `-b`, `-c`, `-d` | `{ azimuth: 45, elevation: 2, fov: 22, fit: 0.22, target: [429, 300, 260] }` | [est]. Each shows the leg mask with its diagonal flange at the silhouette, so azimuth is about 45° ± 20 off the leg's diagonal. Use the +X+Z leg. |
| `rubbing-long-face.jpg` | none: an orthographic unrolled rubbing | Use it for décor layout only. |

---

## f. What a knowledgeable viewer checks first (prioritised)

1. **Proportions of the mass:** a squat box on tall legs. Legs 0.35 H, body with rim 0.435 H, handles 0.216 H. A nearly vertical-walled box (≈ 2° and ½°), mouth 1100 × 790.
2. **The plain recessed field** framed on all four sides by friezes of about equal height (≈ 0.24 of the wall each) and side columns ≈ 120 wide. A taotie in the middle of the wall is the classic error.
3. **Rim:** a thick flat slab (≈ 58 tall) overhanging by ≈ 28 mm, with the handles standing on it and their root blocks dropping over its face.
4. **Handle outline and size:** a flat-topped inverted U ≈ 290 wide × 287 high, a chunky bar ≈ 100 thick, vertical. **Tigers and human head on the outer face**, fish on the edges, plain inner face.
5. **Corner flanges:** full height, blocky, with rectangular slot notches at ≈ 40 mm pitch (a comb in silhouette), no hooks.
6. **Corner masks:** ox-head masks with ribbed crescent horns at the upper corners, taotie at the lower corners, split across the arris.
7. **Confronted kui pairs** in the top and bottom friezes meeting at **short** mid-wall flanges. The top flange pokes ≈ 40 mm into the field; the bottom one is segmented. Round boss eyes beside the flange.
8. **Legs:** straight cylinders Ø ≈ 160 with **three bowstrings** under a big V-b mask (ram horn, oval ring eye) centred on a diagonal notched flange, and the lower sleeve step.
9. **Leg placement:** under the corners, nearly flush with the end walls. Centre-to-centre ≈ 858 × 520.
10. **Leiwen:** fine (≈ 1.9 mm pitch), squared, and filling every frieze. A coarse meander would be wrong.
11. **Vertical side-column kui:** head up, facing the corner, big tail spiral at the bottom.
12. **Patina:** grey-green with red cuprite mottle on the fields, darker olive legs, near-black grooves, and no glossy emerald crust.
13. **Handle root masks** with two ring eyes and ribbed horns on the rim face.
14. **Casting realism:** pitted rim, holes in the lower legs, cracks across the short-face fields, and slight asymmetry between the mirror halves.

---

## Uncertainties for the modeller

- **Photos vs published size.** The photos give mouth/H ≈ 4–5 % smaller than the published 1100 × 790 / 1330. Plan numbers here are scaled to the published mouth, and spec.json tolerances cover the gap.
- **Corner flange cross-section:** p ≈ 30, t ≈ 20, diagonal, [est]. The only fully frontal views are oblique to it.
- **Rim top width and the interior** are never visible (the mouth is under glass). The 60 mm wall is published.
- **Which handle is the replica** is not determinable from these photos.
- **Back long face** is seen only obliquely. It is assumed identical to the front.
- **Fish on the handle edges and the human-head details** are at the limit of resolution.
