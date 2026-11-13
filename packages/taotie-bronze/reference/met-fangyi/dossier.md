# Dossier: met-fangyi, Rectangular wine container (fangyi) 方彝, Met 1974.268.2a, b

Measuring curator's ground truth for modellers and reviewers. I give every number in mm (Y up, ground y = 0,
H = 254) and as a fraction of the overall height H where useful. Confidence labels:
**[firm]** = published or measured to ±2 %; **[meas]** = measured from the photos, ±3–5 %;
**[est]** = estimated from shading or weight, ±25 % or as stated; **[unc]** = interpretation that
could be wrong.

## 0. Conventions and part names (use these exact names)

- **Axes:** front (+Z) is a **long face**, the one facing the camera in `three-quarter.jpg`.
  +X is the **short end** visible on the right of that photo. x = long axis (W), z = short axis (D).
- **Part names** (`userData.part`; `spec.json` uses them):
  - `body`: the box walls from y 0 to the rim (y 162.2), including the flush foot band, excluding flanges.
  - `foot`: the lowest register (y 0–33). It is flush with the wall and notched on all four sides. Build it as its own part (fangBody foot child) or leave it inside `body`; either way the body bbox starts at y 0.
  - `lid`: the hipped roof and its skirt, excluding flanges and knob.
  - `knob`: the post plus the miniature hipped roof.
  - `flanges`: every flange strip: 8 on the body, 4 on the lid hips, 4 on the lid slope midlines, and 2 ridge segments.
- Register names used below, top to bottom: `rimBorder`, `topFrieze`, `sepUpper`, `main`, `sepLower`, `footFrieze`, `baseBorder`; on the lid, `skirt` and `slope`.

## a. Identity

| | |
|---|---|
| Title | Rectangular wine container (fangyi) / 方彝 (Met title; 商 青銅方彜 on Commons) |
| Type | fangyi 方彝: rectangular lidded wine container with a hipped-roof lid |
| Date | 12th century BCE [firm, Met]; late Shang, Anyang (Yinxu III by style [unc]) |
| Period | Shang dynasty (ca. 1600–1046 BCE) |
| Findspot | not documented (unprovenanced). The Anyang attribution rests on style alone |
| Collection | The Metropolitan Museum of Art, New York. Gallery 207. Purchase, Arthur M. Sackler Gift, 1974 |
| Accession | 1974.268.2a, b (a = vessel, b = lid) |
| Published dimensions | H 25.4 cm (10 in), W 15.2 cm (6 in), D 11.4 cm (4½ in). These are inch-rounded, so allow ±3 mm |
| Weight | vessel 2.211 kg, lid 0.907 kg (Met API "Other" measurements), total 3.12 kg [firm] |
| Inscription | cast inside: a 亞-shaped cartouche (clan frame) beside a zoomorphic clan graph. The graph looks like a crested bird or beast with a plumed tail, standing on legs [unc]. The Met photo does not say whether it is on the floor or under the lid; it is probably the inner floor [unc] |

**Label blurb:** A tall rectangular wine container shaped like a miniature roofed shrine. Its hipped lid
and box-like body carry bold squared horn-masks on a dense ground of thunder spirals. Saw-toothed flanges
run up every corner and every face centre without a break, from the notched foot to the ridge of the lid.
Inside, a cast clan sign inside a 亞-shaped frame names the lineage that commissioned it in the 12th century BCE.

## b. FORM (box form)

### b.1 How it was measured

- Silhouettes come from chroma segmentation. The studio background is exactly neutral (R = G = B), so any
  pixel with chroma ≥ 6 is bronze. Scripts are in `.work/dossier-met-fangyi/py/` (`seg.py`, `profile.py`, `pitch.py`, `colors.py`).
- `side.jpg` (end view) is near-orthographic. Its scale, 0.0900 mm/px in the 3000×4000 original, comes from
  the published H. That gives a D at the body top of 116.6 mm against the published 114, which is within the inch rounding.
- `three-quarter.jpg` has visible perspective. For the long axis I solved a camera from the slopes of the
  base edges and the ridge (§e) and used the published W/D.
- Keystone: both cameras look down slightly, so lower parts read about 1.5 % narrower than they are. The
  tapers below are corrected for that.

### b.2 Overall heights (y from the ground)

| landmark | y mm | y/H | conf |
|---|---|---|---|
| ground / base underside | 0 | 0 | |
| top of the foot notches | 14.3 | 0.056 | [meas] |
| top of the foot frieze field | 31.7 | 0.125 | [meas] |
| separator band (plain) | 31.7–34.4 | 0.125–0.135 | [meas] |
| main (taotie) register field | 34.4–127.7 | 0.135–0.503 | [meas] |
| separator band (plain) | 127.7–130.4 | 0.503–0.513 | [meas] |
| top frieze field | 130.4–159.0 | 0.513–0.626 | [meas] |
| plain rim border | 159.0–162.2 | 0.626–0.639 | [meas] |
| **body rim / lid joint** | **162.2–162.8** | **0.639** | [meas] |
| lid skirt (plain vertical band) | 162.8–167.6 (4.8 tall) | 0.641–0.660 | [meas] |
| lid ridge surface | ≈ 223 ±3 | 0.878 | [est] |
| crests of the ridge and hip flanges at the apex | ≈ 230 | 0.906 | [meas] |
| knob roof eave | 235.5 | 0.927 | [meas] |
| knob top | 254 | 1.000 | [firm] |

Shares: body (including the foot band) 162.2 mm = **0.639 H**. Lid without knob 60 mm = 0.237 H. Knob, from the
ridge surface to the top, 31 mm = 0.122 H. Lid with knob 91 mm = 0.36 H.

**The foot is not a stepped ring foot.** The lowest register is in the plane of the wall. The outline runs
straight from the rim to the ground, and only the plain separator band and the notches mark the foot. This
is a deliberate departure from research/03 §1.10 ("foot plan ≈ 0.85–0.92 × body"): do not inset the foot.

### b.3 Plan and taper (wall surface between flanges)

| level | long face (x) | short face (z) | conf |
|---|---|---|---|
| rim y 162 | **139** | **102** | [meas ±3] |
| y 129 (top of main) | 137.4 | 100.4 | [meas] |
| y 33 (foot top) | 132.6 | 95.6 | [meas] |
| ground y 0 | **131** | **94** | [meas ±3] |
| overall incl. flanges, top | 152 (pub. W) | 114–116.6 (pub. D 114) | [firm] |
| overall incl. flanges, ground | ≈ 140 | 104 | [meas] |

- The walls are **straight and lean OUT going up by 1.4° ±0.7° per side on both axes** (kit: `taper: { x: 1.4, z: 1.4 }`, `at: 'bottom'`).
  The measured outline is linear within ±0.5 mm, with no belly and no carination. Corners are **sharp arrises**
  (`cornerRadius: 0`) carrying corner flanges.
- Plan aspect is 1.36 at the rim and 1.39 at the ground. Long-face corners are sharp.
- Rim: hidden by the lid in every photo. The lid skirt sits flush on it, so the rim outer face equals the
  wall-top plan. Use a plain rim (`rim: { kind: 'plain' }`) with no overhang; the lid seat is an internal
  inset of ~3 mm [est].
- Wall thickness: **3 ±1 mm** [est]. Seen at the notch jamb as ~30 px in the three-quarter view. A weight check
  agrees: 2.21 kg of leaded bronze at 8.8 g/cm³ is 251 cm³, minus ~35 cm³ of flanges, spread over ~90 000 mm²
  of wall and floor gives ≈ 2.5 mm, plus relief. **Do not use the kit default `wall: 8`**; use 3.
- Floor: not visible. Put it at the top of the foot band, y ≈ 30 ±8 mm [est], with a hollow foot below.
- **Foot notches**, one centred on every face, cut up from the ground: rectangular with filleted top corners (r ≈ 2 mm).
  - Short face: 14 wide × 14.3 high [meas], 0.14 of the face width.
  - Long face: 16 ±3 wide × 14 high [meas], 0.12 of the face width.
  - The face-centre flange stops on the notch ceiling. The notch removes the bottom border and about half of the foot frieze field.

### b.4 Lid (hipped roof 四阿顶, **convex slopes**)

- Eave plan = wall-top plan, 139 × 102 mm, flush with the body. The skirt is a vertical plain band 4.8 mm tall
  (y 162.8–167.6) [meas].
- **Ridge** along the long axis: **≈ 100 ±6 mm long** (0.72 of the lid length) [meas, three-quarter with perspective
  correction], ≈ 9 mm wide on top [est]. The ridge is long, so:
  - The **end slopes are steep triangles**: base 102, rise ≈ 55, horizontal run ≈ 19.5 mm, about 70° from horizontal.
    They read almost as gables in `side.jpg`.
  - The **long slopes are trapezoids**: slant ≈ 72 mm.
- **The long slopes are convex** (a cushion roof, not the concave Chinese eave). Their cross-section, the end-view
  outline less ~6 mm of flange, is about **62° at the eave, 45° mid-slope and 35° at the ridge**. The table is in
  `profile.json → lidSection.surface` as [halfWidth, y], going from (49.6, 171) to (4.2, 224). The bowed midline
  flange in the three-quarter photo is the visible proof. Kit `hippedLid` has `concave`; this lid needs the
  opposite curvature, a convex slope profile. If the kit cannot do it, a straight 50° slope is the fallback, and
  the silhouette will then read wrong by ~3 mm at mid-slope. [meas, conf medium]
- Rise from the eave line (167.6) to the ridge surface (≈ 223): 55 mm.

### b.5 Knob (miniature hipped roof on a post)

| | mm | /H | conf |
|---|---|---|---|
| roof: long × short at the eave | 27 × 21.7 | | [meas, short firm] |
| roof height (eave 235.5 → top 254) | 18.5 | 0.073 | [meas] |
| roof ridge length | ≈ 16 ±3 (end slopes ~75°, long slopes ~58°) | | [est] |
| post section | ≈ 12 (x) × 7.2 (z), rectangular, plain | | [meas] |
| post height above the ridge surface | ≈ 12 (only 5–10 visible between the ridge-flange blocks) | | [est] |

The knob roof carries flat spirals and leiwen on its long faces and a tiny two-eyed mask on its triangular
ends. Its eave edge is a thick plain fillet with no flanges.

### b.6 Flanges 扉棱 (18 strips)

| flange | path | projection p | thickness (base → crest) | segments / notch |
|---|---|---|---|---|
| 4 body face-centre | face centreline, from y 161.5 down to the notch ceiling (14.3) | 6.5 ±1 [meas] | 4.5 → 2.3 [est] | dense ladder ("comb") |
| 4 body corner | **on the corner bisector (45°)** [unc, medium], y ≈ 157 → 1 (to the ground) | 7.5 ±1.5 [meas] | ≈ 5 → 2.5 [est] | dense ladder |
| 4 lid hip | along each hip, from the eave corner (ends in a small step-out tab ~5 mm proud at the eave) to the ridge end | 6 ±1.5 | ≈ 4 | dense ladder |
| 4 lid slope-midline | centreline of each slope, from the eave to the ridge, following the convex slope (curved) | 6 ±1.5 | ≈ 4.5, rounded crest | ladder scored on the crest |
| 2 lid ridge | on the ridge, either side of the knob post, each ≈ 44 long | stands ≈ 4 above the ridge | ≈ 5 | crenellated: square slots cut down from the top |

- **Notch / ladder rhythm, all flanges:**
  - Transverse slots with a pitch of **4.0 ±0.4 mm** [meas]. FFT of the end-view silhouette edges gives 43.6 and 48.6 px (3.9 and 4.4 mm); red-cuprite peak spacing along the flange face gives 3.9–4.1 mm.
  - Slot width ≈ 1.2 ±0.3 mm.
  - Slots run in from the crest **~65–80 % of the projection**, leaving a continuous spine against the wall.
  - The crest notch is shallow: the silhouette shows only ~0.6–1 mm of crenellation.
  - The result reads as a toothed comb (kit `notches: { shape: 'score', pitch: 4, depth: 0.7, width: 1.2 }`). It is not an F1 T/L rhythm and not F2 hooks.
  - That gives about 36 teeth on a face-centre flange and about 39 on a corner flange. **Count matters**: a 10–15 mm pitch looks wrong at once.
- **Continuity:**
  - Flanges run unbroken through all three body registers: they do **not** reset at the separator bands.
  - Body flanges stop just below the rim (corner flanges ~5 mm below, centre flanges ~1 mm below), with rounded square ends.
  - Lid flanges sit directly above the body flanges: hips over corners, slope midlines over face centres.
  - The tops of the body flanges do **not** rise above the rim.
- Slot floors and flank grooves hold the strongest **cuprite red** on the vessel (see §d).

## c. DÉCOR MAP

Global rules:

- **Style V, three levels:** leiwen ground → flat plateau (L1) carrying its own spiral cutting (V-a "spirals on
  the plateau") → square domed eye bosses (L2). Flanges are the L3 elements.
- **Mould sections:** each face is split by its centre flange into two mirror halves, so 8 body sectors.
  - The two long faces are identical. The two short faces are identical, as far as the photos show (the right end in the three-quarter photo matches side.jpg).
  - Long and short faces share **one composition** stretched to the panel width.
  - The two halves of a face mirror each other. The halves of adjacent faces meet at the corner flange, but no corner mask is formed there.
- **Leiwen ground:**
  - Pitch **0.82 ±0.08 mm** (FFT period 8.6–9.2 px at 0.09 mm/px) [meas], groove ≈ 0.4 mm.
  - **Squared** 雷纹 (roundness ≈ 0.1) with nested squares and triangles. In sky-lit oblique views it reads as a fine "diamond" texture: that is foreshortening, not a diamond motif.
  - Kit preset: `fine`, with pitch 0.82.
- **Relief heights [est from shading]:**
  - leiwen depth 0.3–0.4
  - plateau (L1) 1.2 ±0.3, with steep shoulders
  - spiral grooves on the plateau: 0.3 deep, pitch **1.3–1.5 mm** [meas]
  - eye bosses: domed, **2.5–3.5 above the ground** (flattened domes, h/r ≈ 0.45)
  - plain separator and border bands are flush with the plateau top (+1.0–1.2)
- Panel x positions below are mm from the face centre-flange axis, measured outward. Panel y is mm above the register's bottom edge.

### c.1 Body, main register (`main`, y 34.4–127.7, field height 93.3)

Half-panel width: short face 51 at the top and 47 at the ground; long face 69.5 at the top and 65.5 at the ground.
Mask aspect (full face W/H_p): short 1.06, long 1.45.

The configuration is a **head-only, dissolved-island taotie with squared horns** (closest to T5/T7; kit `body: 'dissolved'`).
Every part is a separate plateau island on the leiwen sea.

| component | grammar term | short face: rect x0–x1, y0–y1 (mm) | long face: rect (mm) | notes |
|---|---|---|---|---|
| horn | **H2 inward-curled (ram) horn, fully squared** (kit `horn: 'ram'`, `square: 0.85`) | 13–46, 53–83 (0.57–0.89) | 22–59, 59–85 (0.63–0.91) | The biggest island. A rounded-square ring band (4.5–8 mm wide, corner radius ~6) rises from a root next to the axis (inner lower corner), runs out across the top, comes down the outer side and hooks back inward into a **squared spiral**. The enclosed plateau carries 2 large round spirals. It reads as a big "rounded square C" opening down and in |
| brow | **'L' brow (Γ beside the eye)** | 13–33, 44–52 | 8–33, 50–58 | A horizontal bar from the axis strip outward, turning down at its outer end. It sits between horn and eye |
| eye | **'square' boss (fangyi boss)**, no canthus hooks | centre (23, 32.4) = (0.45, 0.35); boss 12.6 × 9.9 | centre (30.5, 39) = (0.44, 0.42 ±0.03); boss ≈ 11 × 10 | Rounded-rectangle domed boss with a **horizontal slit pupil** ≈ 4 × 1.2 mm. The eyes sit **low**: y 0.35–0.42, below the grammar's 0.42–0.62, because the horns take the top 45 %. Inter-pupil distance is 46 mm on the short face (0.45 of the face width) and 61 mm on the long face (0.44) |
| jaw / mouth | **'hooked' jaw**: upper lip band out from the axis, mouth corner curling in | 13–34, 7–19 | 25–44, 8–25 | Bracket with a squared spiral curl. No fangs, no lower jaw |
| axial strip | nose split by the flange (kit `nose: 'stack'` beside an L3 flange) | 3–12, 1–89 | 2–8, 1–89 | A narrow vertical plateau (≈ 9 mm wide on the short face, ≈ 6 on the long) along the flange, carrying a chain of 7–8 C-spirals, with a short **horizontal crossbar (T cap)** at the top. Separate from the horn |
| outer edge | **edge 'scrolls'**: a column of 3 C-shaped islands | 35–49, 2–80 | 56–65, 2–85 | Islands at y ≈ 10, 40, 70 (stacked C hooks opening toward the axis) |
| crest / shield, ears, body, legs, tail, quills, fangs | **none** | | | No lozenge: the flange takes the axis |

ASCII layout, **short face (end), main register** (102 × 93 mm; the long face is the same, stretched to 139):

```
 x→  -51        -35   -13 -3 0 3 13      35        51   (mm from axis)
 y=93 ┌───────────────────────╥───────────────────────┐ ← sepUpper band
      │ leiwen  ┌───────────┐ ║ ┌───────────┐  leiwen │
   83 │ ┌─┐     │ ╭─squared ╮│ ║ │╭ squared─╮ │    ┌─┐ │
      │ │C│     │ │ spiral  ││▓║▓││ spiral  │ │    │C│ │  ▓ = axial strip
      │ └─┘     │ ╰──╮ HORN ││▓║▓││ HORN ╭──╯ │    └─┘ │      (C-spiral chain,
   53 │         └────┘  root┘▓║▓└root  └────┘        │       T cap at top)
   52 │  ┌─┐    Γ═════════╗  ▓║▓  ╔═════════Γ    ┌─┐  │  Γ = L-brow
   44 │  │C│    ╹          ▓║▓          ╹    │C│  │
   37 │  └─┘      ┌──────┐   ▓║▓   ┌──────┐      └─┘  │
      │           │ ▬▬ ◘ │   ▓║▓   │ ◘ ▬▬ │           │  ◘ = square domed eye
   28 │           └──────┘   ▓║▓   └──────┘           │      boss, slit pupil
   19 │  ┌─┐    ┌─────────┐ ▓║▓ ┌─────────┐   ┌─┐   │
      │  │C│    │ ⟲ jaw   │ ▓║▓ │   jaw ⟳ │   │C│   │
    7 │  └─┘    └─────────┘ ▓║▓ └─────────┘   └─┘   │
    0 └───────────────────────╨───────────────────────┘ ← sepLower band
     corner flange (45°)    ║ = face-centre flange      corner flange
```

### c.2 Body, top frieze (`topFrieze`, y 130.4–159.0, field 28.6 tall)

- **One kui pair per face, both kui facing the centre flange** (kit `frieze { unit: 'kui', count: 2, facing: 'centre' }`).
  The short and long faces carry the same creature, longer on the long face: length/height ≈ 1.65 on the short face and 2.3 on the long.
- Each kui:
  - **Head at the axis**, gaping jaws. The upper jaw runs to the flange and hooks down. The lower jaw is an L that drops to the bottom border (`head: 'gaping'`).
  - **Square-ring eye boss**, about 7 × 4.5 mm, raised to L2 (`eye: 'square'`, `pupil: 'none'`), centred ~19 mm from the axis on the short face and ~22 mm on the long face, at mid-height.
  - Small back-hooked crest above the head (`crest: 'hook'`).
  - Body band ≈ 5–6 mm wide, running outward at y 0.55–0.85 of the field.
  - **Big down-curled squared spiral tail** filling the outer end, 9–16 mm square (`tail: 'down'`).
  - Under the body, a second band with spiral hooks (leg/claw), at y 0.1–0.35.
- Plateau spirals are cut on the head and the tail. The ground is leiwen.

```
  ┌───────────────────────────────╥───────────────────────────────┐
  │ ╭──╮ ═══body═══════╗ ^crest   ║   crest^ ╔═══════body═══ ╭──╮ │ 28.6
  │ │⟳ │tail    ⟲ ⟲    ║[◘] ═jaw╕ ║ ╒jaw═ [◘]║    ⟳ ⟳    tail│ ⟲│ │
  │ ╰──╯ ══leg/claw══⟲═╝    │   ║   │    ╚═⟳══leg/claw══ ╰──╯ │
  └───────────────────────────────╨───────────────────────────────┘ 0
```

### c.3 Body, foot frieze (`footFrieze`, y 4.4–31.7, field 27.3)

- **One kui pair per face, facing the centre** [unc on head detail]. The notch cuts the middle 14–16 mm.
- Each half carries a kui whose **head sits in the inner half of the half-panel**:
  - Eye: an oval/rounded-square ring boss ≈ 6 × 5 mm, about 26 mm from the axis on the short face and 30 on the long, at mid-height.
  - Jaws are squared hooks pointing at the notch.
  - Body and tail run outward and end in a **large squared spiral tail** at the outer edge (down-curled).
  - Riding on the head is a **small beaked crest that looks like a bird's head** (round ring eye, beak pointing outward) [unc]. It may be the kui's own beaked crest; kit: `crest: 'hook'` or a tiny `bird`.
  - Under the body is a leg/claw band with spirals.
- Leiwen fills the gaps. In the separator, bottom border and notch jambs, the field is cut through by the notch.

### c.4 Lid slopes (`slope`): **INVERTED taotie** on each of the 4 slopes

Note: the scout meta.json said "appears upright"; that is wrong. On every slope the **horns sit at the eave
(bottom)** and the jaw hooks sit toward the ridge, so each mask reads upright when the lid is turned over
(research/03 §1.10). Kit: `invert: true`, preset `fangyi-lid`.

- Composition: the same dissolved island set as the body mask, rotated 180° and re-fitted.
  - Squared ram horns: wide rounded rectangles hooking inward, with an inner spiral. **Their rims carry short transverse ticks** [meas, detail-lid-long].
  - Γ brow between horn and eye.
  - Square slit-pupil eye boss.
  - Edge C-scroll islands.
  - Jaw hooks near the ridge.
  - Axial C-spiral strip with a T cap beside the midline flange.
- **Long slope**, a trapezoid 139 at the eave → 100 at the ridge, slant ≈ 72. Positions per half, distance along the slant from the eave:
  - horn 18–60 out × 4–28 up (≈ 42 × 24, 0.06–0.39 of the slant)
  - eye boss centre (≈ 30 out, ≈ 37 up), ≈ 10 × 8
  - Γ brow ≈ 28–33 up
  - jaw hooks 48–66 up
  - edge C at 50–62 out
  - plain eave border ≈ 3 mm
- **End slope**, a triangle 102 at the base × 55 rise (slant ~58). Measured in side.jpg (y overall):
  - horns 9–31 out, y 172.8–190
  - eye bosses at ±16.7, y 198.6, boss 7 × 5.4 with slit
  - jaw hooks y 204–211
  - leiwen fills the apex
  - centre flange from eave to apex

```
 LONG SLOPE (seen from outside, eave at bottom)   END SLOPE (triangle)
 ridge ─────────────────────────────                    /\  apex 223
   ⟲hook  ⟳hook    ║    ⟲hook  ⟳hook                   / ║\
 C   ┌───┐  ◘      ║      ◘  ┌───┐   C                /⟳ ║ ⟲\  jaw hooks 204-211
     └Γ──┘         ║         └──Γ┘                    /◘  ║  ◘\ eyes y 198.6
 ┌──────────────┐  ║  ┌──────────────┐               / Γ   ║   Γ\
 │ ⟲ HORN ⟳   ╭─┘  ║  └─╮   ⟲ HORN ⟳ │              /┌HORN┐║┌HORN┐\ 173-190
 └────────────╯    ║    ╰────────────┘             /_└────┘║└────┘_\
 eave ═══════ skirt (plain, 4.8) ════════          eave 167.6 ════════
```

### c.5 Knob

- **Long faces:** flat C-spirals in a 2 × 3 grid on leiwen, with a plain thick edge fillet.
- **Triangular ends:** a minimal mask of two round ring eyes over a hook.
- The post is plain.

## d. SURFACE (patina)

Swatches are sRGB means sampled with numpy (`py/colors.py`) from the full-resolution originals. Studio light is
neutral, so they can be used as albedo-under-key-light targets.

| role | hex | where sampled |
|---|---|---|
| **dominant** body field | **#666047** (102,96,71) | long face main register, three-quarter |
| dominant, end face | #5e5739 / #524c30 | side.jpg frieze / main right half |
| dominant, lid (lighter, greyer) | **#7b735e** | lid long slope |
| **recess** (leiwen grooves, under-plateau) | **#211b0d – #322b16** | p10 of the face crops |
| **high points** (plateau tops, boss domes, flange crests) | **#aba584 – #b2b08f** | p95 |
| **cuprite accent** (flange slots, notches) | **#8d6440** (lit) / #704c3c (shade), peaks #af8663 | flange strips, R−G > 30 |
| foot band, warmer and redder | #52452d dominant, 36 % warm pixels | side.jpg foot frieze |
| **malachite specks** | **#697a55 – #707a57** | lower end face, flange roots; < 1 % of the area |
| interior (inscription) | #727d66 dominant, #a9b3a2 pale film, #444833 dark | DP151397 |

- **Distribution:**
  - The whole exterior has a thin, even **olive-grey-brown noble skin**. It is darker and browner in the recesses, and greyer and lighter on the lid and on high points.
  - **Cuprite red-brown** concentrates in the flange slots (every slot shows a red floor), the foot notches and jambs, and the foot band and lower 30 mm, where earth and cuprite mix.
  - **Green malachite** appears only as sparse small specks and thin patches: on the lower-left of the end face, at the bases of the corner flanges, and as scattered dots. There is no crust anywhere, and every line of the leiwen stays crisp.
  - The **interior** is the opposite: a pale green malachite skin with whitish calcareous / tin-oxide clouds, scattered dark pits and scratch marks.
- **Gloss:** satin museum sheen (waxed). Plateau tops and boss domes give soft broad highlights. Recesses are matte.
- **Wear:** the flange crests and plateau arrises are slightly polished and pale.
- **Flaws and repairs:**
  - No visible repairs or fills.
  - A few small corrosion pits and chips at the base corners and the flange teeth bottoms.
  - Mould seams are not visible: they hide under the flanges, as expected.
  - The lid sits with a hairline gap, ≈ 0.5 mm.
- **Closest preset: `olive-museum`** (KIT names it for the Met fangyi/zun/gu). Suggested nudges:
  - Crust and malachite: `malachite 0.42 → 0.22`, `crust 0.25 → 0.1` (no crust; relief must stay razor-crisp), `malachiteHue 0.4 → 0.45`, `malachiteScale 1.5 → 1.0`, `mottleScale 9 → 6` (specks, not patches).
  - Cuprite and red-brown: `cuprite 0.45 → 0.6`, so the red shows in slots and notches; `crevice 0.95` keep; `recessDirt 0.55 → 0.7`, so recesses go near-black brown; `earth 0.1 → 0.15` with `earthColor '#5c4630'` (warmer, low on the foot).
  - Noble skin, lid and sheen: `tinOxide 0.88` keep; `tinOxideTone 1.25 → 1.35` (olive-grey); `calcite 0.12 → 0.15` (greyer lid); `wax 0.6 → 0.55`.
  - Placement: `burialSide 0.1 → 0.05`, `wear 0.25 → 0.3` (pale crests).

## e. CAMERA (for `views`)

Stage convention, checked in `src/app/stage.js`: the camera direction is
d = (sin az · cos el, sin el, cos az · cos el). So **azimuth 0 = looking at the front (+Z) face**, and
**positive azimuth moves the camera toward +X**, which is the viewer's right when facing the front (the object's
own left). Elevation is positive when the camera is above. `fov` is the vertical fov in degrees. `fit` 1 puts the
bbox at the frame edge; with `target`, `fit` frames fit × R around it (R = half the bbox diagonal ≈ 159 mm).

How the cameras were solved:

- **Three-quarter:**
  - The visible short end is on the right. Front-face width 1220 px against end-face width 340 px, with W/D 1.36, gives az = 21°. A pinhole fit to the base-edge slope (0.122) and the ridge slope (0.02) gives az 22°.
  - The same fit puts the camera ≈ 245 mm above the ground (near knob height) at ≈ 0.81 m. So the elevation toward the bbox centre is **≈ 8°**, and the vertical fov of the frame is ≈ 26°: a fairly strong perspective.
  - Caution: the strong perspective makes the base edges slope much more than the ridge. Match it with fov ≈ 26, not a tele lens.
- **Side:**
  - The view is near-orthographic and symmetric. Only the end face is visible.
  - Elevation ≈ 5 ±4°, judged from the slight top-view of the lid outline and keystone of 1–2 %.
  - Which end it shows is unknown; the two ends are identical, so call it +X.

| view (ref) | azimuth | elevation | fov | fit | target [x,y,z] mm | conf |
|---|---|---|---|---|---|---|
| `three-quarter` (three-quarter.jpg) | 21 | 8 | 26 | 1.08 | — | az ±3, el ±4, fov ±6 |
| `side` (side.jpg) | 90 | 5 | 26 | 1.08 | — | az ±2, el ±4 |
| `detail-face-short` | 90 | 3 | 26 | 0.33 | [68, 81, 0] | |
| `detail-frieze-short` | 90 | 3 | 26 | 0.26 | [69, 145, 0] | |
| `detail-foot-short` | 90 | 4 | 26 | 0.26 | [66, 18, 0] | |
| `detail-lid-end` | 90 | 6 | 26 | 0.33 | [60, 208, 0] | |
| `detail-face-long` | 21 | 8 | 26 | 0.36 | [0, 81, 52] | |
| `detail-frieze-long` | 21 | 8 | 26 | 0.33 | [0, 145, 52] | |
| `detail-foot-long` | 21 | 9 | 26 | 0.33 | [0, 18, 50] | |
| `detail-lid-long` | 21 | 10 | 26 | 0.36 | [0, 208, 25] | |
| `detail-flanges` | 21 | 8 | 26 | 0.27 | [70, 125, 0] | |
| `detail-knob` | 21 | 10 | 26 | 0.14 | [0, 240, 0] | |

There is no true front (az 0) photo. A reviewer should compare `front` renders against
`detail-face-long.jpg`, keeping its 21° obliquity in mind.

## f. Features a knowledgeable viewer checks first (priority order)

1. **Silhouette:** a tall box with the body at 0.64 H, a **convex** hipped lid on top with a long ridge
   (≈ 0.72 of the lid length) and near-gable steep ends, and a small house-roof knob on a post. Overall W/H ≈ 0.60.
2. **Walls flare outward slightly going up** (≈ 1.4°/side). The **foot band is flush** with the wall (not a stepped
   ring foot) and has a **rectangular notch ~14 × 14 mm** centred under every face flange.
3. **Eight body flanges, continuous** from just below the rim to the ground or notch, as a **fine comb with a ~4 mm
   pitch** (36–40 slots per flange) and cuprite-red slot floors. They line up exactly with the 4 hip + 4 midline lid
   flanges and the crenellated ridge flanges.
4. **Three body registers in ≈ 0.20 / 0.59 / 0.20** of the body height (frieze 28.6, main 93.3, foot 27.3 mm fields),
   separated by thin plain bands, with no bowstrings.
5. **Main mask = big squared ram horns occupying the top ~45 %** of the panel, enclosing round spirals.
6. **Eyes = rounded-square domed bosses with a horizontal slit**, sitting **low**: y ≈ 0.35 of the field on the
   short face and 0.42 on the long face, ~0.45 of the half-width out. They are the highest relief.
7. **Γ brow** bar between horn and eye; hooked jaw curl at the bottom; **no body, legs, tail, fangs or shield**.
8. A **dissolved** layout: every part is an island on the leiwen. The axial **C-spiral strip with a T cap** runs beside the
   flange, and the outer edge has a **column of three C islands**.
9. **Lid masks are inverted**: horns at the eave, jaws at the ridge, on all four slopes.
10. **Plateau carving = round/squared spirals cut into the horn and kui plateaus** (V-a). The ground is **very fine squared
    leiwen at ≈ 0.8 mm pitch**. Coarse leiwen is the fastest giveaway.
11. **Kui friezes face the centre flange**, with square eye bosses and **large down-curled spiral tails at the corners**.
12. **Patina:** an even, waxed olive-grey-brown skin with near-black recesses, pale crests, red-brown only in slots and low
    on the foot, and almost no green outside. Not a malachite-crusted green vessel.
13. Plan proportions: long faces ≈ 1.36 × the short ones. Flanges add ≈ 6–7 mm per side.
14. Knob details: a 27 × 22 roof with flat spirals, a two-eyed micro-mask on the ends, and a plain rectangular post.
15. Interior: a **亞 cartouche + zoomorphic clan graph**, cast in, in a pale-green interior.

## Uncertainties the modeller should know

- **Corner-flange orientation:** I read them as bisecting the corner at 45°, with medium confidence. In the end view the
  outermost silhouette strip may instead be the long-face centre flange seen broadside. If a render looks wrong at the
  corners, compare against `detail-flanges.jpg`.
- **Long-axis numbers** depend on a perspective solve plus the published W. Treat them as ±4 mm.
- **Lid curvature** is real but its exact amount is ±8°, because part of the end-view convexity comes from camera elevation.
- **Lid and ridge heights:** the ridge surface (≈ 223) is inferred from flange crests at 230; the knob post is partly hidden.
- **Foot-frieze creature head:** the small bird-like crest is uncertain.
- **Inscription location:** probably the vessel floor; the lid underside is also possible.
- **No top or underside view exists.** The floor height (~30 mm) and the lid seat are estimates.
