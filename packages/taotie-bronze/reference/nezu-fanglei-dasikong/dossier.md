# Dossier — nezu-fanglei-dasikong (饕餮文方罍, Nezu Museum 90079)

Ground truth: the project owner's two photographs of the FRONT, `photo-34.jpg` (near head-on, slightly above) and
`photo-03.jpg` (a little to the left and higher; the description card in frame), and the label `card-04/05/35.jpg`.
Nothing else about this object was reachable. Tags: **[measured]** back-projected from photo-34 through the assumed
camera (≈ ±3 % of H); **[est]** read obliquely, partly hidden or worn (≈ ±10 %); **[inferred]** not visible.

## a. Identity

1. **Label** (transcribed in SOURCES.md): 饕餮文方罍 · Square Lei with Taotie Design · Bronze · China, Shang dynasty,
   13th–12th centuries BC · said to have been excavated from the Dasikong site, Anyang city, Henan
   (伝河南省安陽殷墟大司空村出土) · Important Cultural Property · Nezu Museum · 90079 · exhibit 12. The description card
   beside it (partly in frame) speaks of broad shoulders, a body narrowing downward, strongly projecting ornaments in a
   row, a massive impression, and a belly taotie "provided with every part, down to the feet".
2. **Not** `nezu-fanglei` (90081, the roof-lidded flanged lei in the same gallery). That model's form code (flanged fang
   stack, hipped lid) does not fit this vessel: no flanges, rounded corners, a domed lid.
3. **Scale [inferred].** No dimension on the label, and the label card stands at the plinth's front edge, in a
   different plane from the vessel, so it is no ruler. Two weak arguments agree on ≈ 50 cm: square lei of this
   lidded type are commonly 40–55 cm (research/03 §1.7), and the ground spirals measure ≈ 5.5 px centre to centre on
   photo-34 (autocorrelation of four ground patches), which at H = 500 mm is ≈ 1.6 mm — the upper end of the
   20–40 cm range and the start of the monumental one (research/01 §1.3), as a heavy 50 cm jar should be. A 40 cm
   vessel would need a 1.3 mm pitch, a 55 cm one 1.8 mm; neither can be excluded. **H = 500 mm is assumed; every
   other number is a proportion measured on the photograph, so the whole model scales with that one guess.**

## b. Form (mm at H = 500; Y up, front +Z = the face with the low lug)

1. **Camera (assumed, then checked).** photo-34 is a phone photograph; no landmark set of the kind used for the
   other lei exists (no flanges, rounded corners). A pinhole camera was assumed — 900 mm from (0, 250, 0), elevation
   10° (the knob's top face and the shoulder's top surface are both seen from above; the base outline curves up at
   its corners), azimuth 3.5° (the centre line drifts from x 685 px at the knob to 655 px on the belly: nearer points
   shift left, so the camera stands a little to the right) — and its focal length (2983 px, vfov 38°) and image
   offset fitted to two centre-line points: the knob top (685, 40) and the foot's front edge (684, 1766). Every
   silhouette row and register line was then back-projected through it (`.work/r8-dsk/solve/cam.py`), so the
   elevation correction is exact under that camera: a register on the receding shoulder is placed at its own depth
   (z = 0.9 × its half width) before its height is read. Check: the model rendered from the same camera overlays the
   photograph's silhouette within ≈ 2–4 % except where noted in §e.
2. **Levels [measured]** (y): base 0; centre blade tip 28 (the lug's pendant point 31); corner blades end ≈ 45;
   lug hole 86–101, its strap ≈ 84; blade register top 207, fillet 207–212; main register 213–271 (border 271–275,
   plain band 275–285); whorl-boss band 285–306.5; kui frieze 307–336 on the shoulder slope; two bowstrings 338–345;
   shoulder top 346, flat ledge to the collar 348; collar 348–397.5; lid lip 397.5–400; lid dome 400–466 (boss row
   403–420, mask 422–462); knob post 466–469, knob cap 469–485 (vertical sides), its low hipped top to ≈ 500.
3. **Half widths (x) [measured]** (silhouette): base 77.5; 84 @23.5; 95 @58.6; 105.5 @92.7; 114.5 @125; 122.6 @156;
   129.9 @186; 136.4 @215.5; 141.2 @243.6; **141.9 @257–270 (widest: the main register)**; 140.9 @283.5; 137.1 @309;
   133.3 @322; 124.6 @334; 113 @342; 100.5 @346 (shoulder edge); collar 87; lid eave 88.5, 85.4 @412, 82 @425,
   77.3 @438, 70.8 @452, 61 @459, 40 @466 (crown, rounded); knob cap 20 (40 across).
   **Depth (z) = 0.9 × width [inferred]**: neither photograph shows a side face (fanglei plans run 1.05–1.2 : 1).
4. **Section [est]**: a rounded square, NOT a flanged box — corner radius ≈ 0.15 W + 10 (≈ 31 on the belly, ≈ 22 at
   the base; read off how far the corner blades' axes sit inside the silhouette, 20–32 px). The collar is a crisp box
   (r ≈ 3); the lid dome's corners round from ≈ 7 at the eave to ≈ 31 at the crown. **No flanges anywhere** except a
   plain bar down the centre of the front lid slope, ≈ 8–10 mm proud, rising to the knob (photo-34); the lid's side
   silhouettes show none, the back one is inferred.
5. **Sculpture [est]**: a horned head on the centre of the front shoulder (y ≈ 294–345, ≈ 55 mm across its horns:
   two fat curled horns form its crown, round bulging eyes under a brow, a heavy blunt snout thrusting out and down);
   the back head [inferred]. Two loop handles on ±X (photo-34 edges, photo-03 right): a beast head lying along the
   handle top, snout out to x ≈ 160 at y ≈ 330, short horns at its back; a round bar ≈ 11 mm thick loops down into
   the wall at y ≈ 300. The low lug on the front (photo-34, photo-03): a U strap ≈ 34 mm across standing ≈ 17 mm out
   at y ≈ 81–88 over a dark opening (the lug's hole, y 86–101), carrying a pendant head that tapers back into the wall
   to a point at y ≈ 31 (C horns, eyes, a nose ridge).
6. **Not visible**: both sides (±X faces), the back, the inside, the underside, the knob's back, any inscription.
   Sides and back repeat the front (without the lug) — **inferred**.

## c. Décor (traced from the flattened faces — faces.json, faces/*.jpg; elements in nezu-fanglei-dasikong/relief.js)

Flattened from photo-34 onto each zone's chord plane (face-lid, face-collar, face-shoulder, face-main, face-blades) at
5–6 px/mm from ≈ 3.3–3.8 px/mm, read on mm grids (`.work/r8-dsk/solve/grid.py`). The flattened centre line lands at
x ≈ −3 mm on face-main and ≈ −2 mm on face-blades (the assumed camera's residual); readings were taken from it.

- **Main register (213–271)**, per half: a FAT 冂 horn (band 7–8 mm; top 263–270, outer column at x ≈ 56–63, bottom
  243–249) with a thinner second 冂 nested inside and leiwen in its hollow; a convex pillow eye (≈ 17 × 13.5) at
  (±27.5, 233.5) in a sunk ring; a body band (≈ 10 mm) from the eye to x ≈ 92 cut with C-hooks, its end rolled; a big
  curl under the eye (the jaw), a hook beside the centre strip; at the corner side a band rolled into a big spiral
  (the "ear", centre ≈ ±98, 251) and a lower hook (the foot). A plain centre strip ≈ 7 mm with a sunk centre line.
- **Blades (28–207)**: a centre blade (top ±65, tip 28) and a blade centred on every corner (top ±57 developed, tip
  ≈ 45): each with a raised border strip carrying three fine grooves, a strip of C-scrolls inside it (≈ 7 mm pitch),
  and in the upper part a mask: two stacked bands under the top, a "7" horn per half (band ≈ 7 mm, C-hooks cut on it)
  enclosing a squared coil (the eye), a big squared coil below (the cheek), leiwen elsewhere; a narrow ridge down the
  axis. Between the blades the wall is PLAIN (pale in the photograph).
- **Whorl-boss band (285–306.5)**: domed whorl bosses Ø ≈ 20 at x = 0 (under the head), ±37, ±74, ±111, four comma
  grooves round a ring, on leiwen.
- **Kui frieze (307–336)**: per half a kui facing the head: crest band with a spiral chain (333), jointed body (324)
  running to the corner and rolling up, leg/tail hooks (315.5), a head block and a small eye boss at x ≈ 24–36.
- **Collar (348–397.5)**: very dark and worn; a flush, thin-line kui frieze either side of a plain centre plate
  (≈ 9 mm, vertical lines) — **[est]**, low fidelity.
- **Lid (400–466)**: five whorl bosses Ø ≈ 14 at x = 0, ±30, ±60 (403–420); above them a mask round the centre
  flange: a fat horn band out along the top and down the side, a rectangular pillow eye (±18, 442.5), a big C below it.
- **Relief heights [est]** (shading in the photographs; the card's "strongly projecting ornaments"): plateaus ≈ 2.3 mm,
  eyes ≈ 3.2–3.4 mm, lid mask 2.7 mm, blade borders 1.3 mm, coils 0.7 mm, leiwen ≈ 0.4 mm deep at ≈ 1.2 mm pitch.

## d. Patina (photographs)

Dark grey-olive bronze, the raised bands worn to a silvery grey-brown; bright malachite in broad blotches (belly right,
shoulder, lid right); a little red-brown cuprite in the ground; the plain lower body between the blades pale
grey-beige mottled green; collar and lid much darker, the collar near-black. Preset `nezu-fanglei-dasikong`.

## e. Known differences (model vs photographs)

See the final report of round r8-dsk; in short: the décor is traced at control-point level (not pixel-traced), the
sides and back are inferred repeats, the depth is inferred, the head and handles are SDF approximations.
