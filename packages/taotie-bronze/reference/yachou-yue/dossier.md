# yachou-yue — dossier (亚醜钺, ceremonial axe with an openwork grinning face, Shandong Museum)

Sources: Gary Todd's CC0 photographs (SOURCES.md), measured on the 3840 px Commons versions with a pixel grid
and a run-length labelling of the through-openings (bright background seen through the plate).
**M** = measured on a photo, **I** = inferred, **H** = hidden in every photo, **P** = published.

## a. Facts
- **P (museum label, detail-label.jpg):** 亚醜(chǒu)钺, "Chopper-axe Inscribed with 'Ya Chou'"; 商代 (BC 1600–1046);
  1965年青州苏埠屯1号墓出土 (excavated 1965, tomb M1, Subutun, Qingzhou); 正背口部两侧各有铭文"亚醜"二字 — the
  two graphs 亚醜 stand on each side of the mouth **on both the front and the back**; 器身透雕人面纹 — the body is
  an openwork human-face design; the label calls an axe this large a symbol of power.
- **P (zh.wikipedia 山东博物馆, 香港文物探知館):** shown in the Shandong Museum's Shandong history gallery; one of its
  "ten treasures"; lent to Hong Kong in 2024 ("禮樂和合 探知齊魯").
- **P (Commons, companion):** a second openwork-face yue from Subutun is in the National Museum of China, 31.7 × 35.8 cm
  (Commons "CMOC … bronze battle axe.jpg", whose description says excavated 1956 — the label of our axe says 1965;
  not resolved here). It differs in every element (SOURCES.md).
- **Not found in any reachable source:** dimensions, weight, accession number. The model uses H 327 × W 345 mm, the
  figures commonly published for this axe (from memory of catalogues — **unverified**). The photographs agree: on the
  head-on photo H : W = 1490 : 1595 px = 0.934, i.e. 1.5 % short of 327 : 345 = 0.948, as expected for a camera a
  little above a plate that leans back a few degrees; the owner's (private) head-on press image gives 0.977. So scale
  = 0.2163 mm/px across, 0.2195 mm/px up the head-on photo.

## b. Form (plate mm: x = 0 on the axis, y = 0 at the lowest point of the edge; the model stands it 12 mm up)
| item | value | how |
| --- | --- | --- |
| overall | 345 tip to tip, 327 high | P? (see a), M ratio |
| tang 内 | plain, 137–140 wide (±68.5 at the top, ±70 at the shoulder), 52 tall (275 → 327), square corners | M ±1 |
| shoulders | level at y 275, out to ±118 | M ±1 |
| sides | flare steadily ±118 (275) → ±130.5 (120) → ±138.8 (76), then sweep out to the tips | M (row extents every 20 px) |
| blade edge | convex, nearly flat in the middle: y 0 / 1.1 / 4.2 / 9 / 17 / 29.6 at x 0 / 43 / 78 / 112 / 147 / 172.5 (tips upturned to y ≈ 30) | M ±1 |
| lashing slots 穿 | one each side under the shoulder, 25 × 11.5, r 2.5 corners, centred (±79, 257) | M ±0.5 |
| side slots | seven a side, **traced** per side off the flattened photo (src/artifacts/yachou-yue/traced.js, `SIDE_L` / `SIDE_R`): a slit ≈ 3–4 high open to the edge, turning at its inner end into a hook (up on some, down on others) ≈ 3–4 wide and 10–12 long, leaving a comb of ≈ 17 mm tabs; left and right are not alike. The acrylic clip glare across the slit at y ≈ 211 was counted as wall | M (sub-px contour of the backdrop seen through) |
| eyes | through-holes Ø 19.4, centres (1.6 ± 55.6, 185.2) — traced centres −53.95 / +57.19, y 184.0–185.5 | M ±1 |
| ears | through-openings **traced** per side (`EAR_CUT_L/R`): ragged kidney shapes ≈ 11 × 22 (left), ≈ 8 × 19 visible on the right (the camera side: parallax hides part) | M |
| brow crescents | through-slit under each brow, **traced** off the LEFT brow (≈ 43 × up to 6, 168 mm² of light) and mirrored about the face axis for the right, whose slit the photo shows only in slivers (parallax) | M |
| mouth | one opening, **traced** (`MOUTH_CUT`): a channel ≈ 5.5 high along the smile, with five gaps standing up (to y ≈ 122.5) and down (to ≈ 105–108) from it between square teeth, and horned ends rising to y ≈ 135 (left) / 133 (right) — the cut-out is the light "centipede" the photographs show; not symmetric | M ±0.3 |
| thickness | 8.5 at the body and tang, thinning from y 95 to 6.5 at y 45, then a bevel 19 mm wide to ≈ 0.9 at the edge | **I** (no edge-on photograph; a centimetre or so is usual for Anyang ceremonial yue; the lighter band along the edge in front.jpg is consistent with a bevel ≈ 15–20 wide) |
| back face | repeats the front at the SAME plate x (every ring stays round its own traced hole); the two small 亚醜 graphs therefore read mirror-reversed from behind (one mesh, one material, one map) | **P** for the inscriptions (label), openings necessarily through; relief of the back **I** |
| mask axis vs plate axis | the face sits ≈ 1.6 mm right of the plate axis (eye-hole centres −53.95 / +57.19 in the flattened photo, after removing its own 0.5 mm offset of the plate); modelled so (`MASK_DX`) | M |

## c. Relief (heights over the plate face)

> Superseded in part by the third redraw (see `src/artifacts/yachou-yue/relief.js`): the masses are now solid and
> 5.5–8 mm proud (brow band 7.6, eye rings 7.2, crest 6.9–7.4, upper lip 8 → 6.4, lower lip 7.4), drawn per side in
> plate mm; the mouth cut and side slots are rebuilt square from scans of the photograph. The heights below are the
> earlier, lower reading and are kept for the positions and shapes they record.
Sculptural, no ground pattern: broad FLAT-TOPPED masses with steep, rounded walls (not round tubes) on a plain
plate. Heights are read from the low view (three-quarter.jpg) against the plate edge, ±1 mm; shapes traced on
face-mask.jpg (8 px/mm) and checked on the owner's evenly lit head-on press image (private, never committed).
- eye rings: flat ring, outer r 19.4, **5.2** high with a 3.6 mm rounded shoulder, a 2.4 mm bevel down into the
  hole; below and outside each a teardrop slope (4.4 high, sinking over 11 mm) toward the cheek;
- brows: hooked flat band 8.4 wide, **4.6** high, over the slit; under the slit a smooth convex lid (2.7) down to
  a shallow curved lower edge (y ≈ 206.5) — it lies in the band's shadow in the top-lit photograph;
- ears: a thick ring (5–7 wide, **4.6**, 3 mm rounded shoulder) round each traced hole, swelling into a lobe below;
- nose: leaf-shaped crest — two wedge arms (4.4) rising from a notch on the axis (y ≈ 222) to blunt tips at
  ±21, y ≈ 231 → stem 4.8 wide (3.9) with a centre groove and a groove each side → two hooded cheek curls (4.2)
  over deep pockets open below and toward the stem (sunk 2.8) → a broad pillow bulb (± 26, y 140–179, 4.2) whose
  two volute nostrils (domed +1.6) are hollowed by pockets on their lower inner side;
- mouth: the whole box raised to **4.4** (heavy rim, lower lip ≈ 9–11 wide, horned upper corners); inside it a
  recess cut in two stages (a 1.6 step = the lit inner lip of the lower rim, then 1.9 more) leaving the teeth
  ≈ 1 mm proud of the plate, deep in the shadow of the gum, which stays at full height;
- cartouches: sunk 24 × 38 panels at (±88, 135.5) with a raised frame and the graphs 亚 (cross-shaped frame) and 醜
  (酉 jar + figure) in thread relief 0.55 — the graphs are **drawn, not traced** (too small in the photo: ≈ 5 px/mm).

## d. Not visible / not modelled
The back (H, see b), the top of the tang (H), the hafting (none survives), fine casting seams, the lighter crusty
band along the blade edge (patina, not form).
