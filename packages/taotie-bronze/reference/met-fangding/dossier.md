# met-fangding — dossier (Met 49.135.2, rectangular cauldron, fangding)

Sources: the Met's four object photographs (SOURCES.md), measured on the ORIGINALS (DP140736 4000 px,
DP140737 2000 px, DP140735 4000 px) with a pixel grid. Scale: overall height (handle top → foot) = the
published 229 mm → 0.0903 mm/px on the long-face photo, 0.181 mm/px on the short-face photo.
**M** = measured on a photo, **I** = inferred, **H** = hidden in every photo.

## a. Facts (scout notes; Met API)
Shang, 12th–11th c. BCE (Anyang, Yinxu III–IV by style). Findspot not recorded. Bequest of Addie W. Kahn,
1949. Published H 22.9, W 15.2, D 17.8 cm; weight not published. Six cast graphs inside one wall.

## b. Form (mm; y from the ground, front +Z = a long face, handles on ±X)
| item | value | how |
| --- | --- | --- |
| overall | H 229; long span 182 at the flange lugs (published "D" 178); short span 151 (published "W" 152) | M (front 1010→3025 px; side) — the photograph wins: the long face is the published D |
| legs | ground → body underside 98.5; Ø 28.4 at the top, 24.5 at the foot; rounded foot; centres ≈ ±54 × ±42; the outward splay seen in the photos is the close camera, the model's legs splay only 0.5° | M (front: leg tops 1271–1586 px), centres ±3 mm (perspective) |
| body walls | vertical (no measurable taper); outer faces 162 (long) × 131 (short); underside 98.5 → wall top 180.2 | M ±2 (décor field + 7.2 mm margins; corner flange model below) |
| rim | slab 180.2 → 186.5 (6.3 thick), rounded outer edge, outer 174 × 141 (≈ 5.5 overhang) | M (front 1045→2975 px; side 629→1407 px) |
| handles | plain upright loops on the short-side rims, top at 229 (42.5 above the rim), ≈ 44 wide, legs ≈ 13, top bar ≈ 12, depth 15, aperture round-topped ≈ 18 wide; vertical; centred ≈ ±76 (over the wall) | M ±3 (side.jpg face-on; front.jpg edge-on) |
| décor fields (both faces) | frieze y 152.9–172.8 (19.9), plain fillet 148.9–152.9, mask register 103.1–148.9 (45.8), lower margin 98.5–103.1, plain band under the rim 172.8–180.2 | M (field corners, ±0.3 mm; faces.json) |
| field widths | long: frieze ±75, mask ±74.5; short: frieze ±58.8, mask ±58 | M |
| corner flanges | 45° slabs ≈ 8.5 proud of the arris, ≈ 6 thick, from the mask bottom (102.5) to the frieze top (173.2); two lugs ≈ 5 mm further out, one at the top end and one on the fillet (y ≈ 152); incised T marks on both faces. The 7 mm plain margins of the walls next to them carry incised T and I marks too | M: margin + 0.707·P solved from the front (16.7 mm) and three-quarter (19.2 mm) views → P + lug ≈ 13.4, margin ≈ 7.2; thickness I |
| centre flanges | long faces: plain rib 4.6 wide, ≈ 5 proud, a cap block at the top end and a lug on the fillet; short faces: 6.5 wide, ≈ 8 proud, T marks on its sides (three-quarter.jpg) | M ±1 (crest widths), projections from three-quarter.jpg ±2 |
| wall / floor thickness, interior, inscription | ≈ 4.5 / 4.5 | H (I); the six-graph inscription is not modelled |
| back long face, second short face | assumed to repeat the photographed ones | H |

## c. Relief
Style V-b "smooth plateau": fat bands with a rounded (pillow) section and few contour grooves, standing
≈ 1.1 mm above a sunk field; the plain margins are flush with the plateau tops, so each field reads as a
recessed panel (M: shadows at the field borders in both head-on photos). Eye bosses ≈ +1.1 above the plateau,
pillow-shaped, horizontal slit pupil (M). Frieze dragon heads and body joints domed a little higher (M, low
relief I). Leiwen: squared spirals at ≈ 0.8–1.0 mm pitch (FFT of the flattened face: 1.0 along columns,
0.88 across; the spirals look tighter by eye), cells ≈ 4–5 mm, 2–3 turns, black-filled (M). Legs: incised
thread lines only, no relief (M).

## d. Décor reading (traced, not composed)
The décor is TRACED from the flattened faces (faces.json → faces/*.jpg → trace.py → src/artifacts/met-fangding/trace-data.js).
- **Mask (each half):** the horn is the largest element: a broad band leaving the forehead next to the nose,
  running out level along the top and turning down at the outer top corner into a hook, with a sunk strip of
  square spirals under it. Below it an oval pillow eye in a rounded-square socket band whose inner corner hooks
  (tear duct). Outside the eye a C-scroll ear and a feather/leaf element (the latter between eye and nose on the
  inner side), an upright jointed body at the outer edge with dorsal hooks, and below a bent leg ending in a
  claw. At the bottom centre the upper lip curls out from the nose; no lower jaw.
- **The two halves are NOT mirror images:** on the long face the left eye sits at x −31.6, the right at +28.0
  (M, rms fit error 0.17 mm). The model keeps that: each poor half is the mirror of the good half warped through
  landmarks measured on the poor half (trace.py `mirror_half`).
- **Long frieze:** per half, two confronted dragons whose small frontal heads (x −46/−37, +35/+44) meet at a
  thin divider; S-bodies with a round joint, ending in big spirals.
- **Short frieze:** per half one dragon with a frontal head (x −25.8 / +22.5) and a big spiral at the outer end.
- **Legs:** two rings at the top, a band of hooked scrolls, a third ring, pendant blades with scrolls fading
  down to mid-leg (M layout; the line work is redrawn at ≈ 3 px/mm, not traced).

## e. Reliability of the photographs
Long-face photo: near head-on, camera at mid-body; the décor field flattens with 0.17 mm rms. The left half of
every long register is paler and more corroded, and thresholding breaks it up, so it is rebuilt from the right
half (see d). Short-face photo: 2000 px only (≈ 5.5 px/mm on the wall), fit 0.74 mm rms; its leiwen is barely
resolved and its mask trace is coarser. Which short face (±X) is shown is not recorded.
