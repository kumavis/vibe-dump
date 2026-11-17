# Dossier — nezu-fanghu (鳳文方壺, Nezu Museum 90097-98)

Ground truth: the project owner's two photographs of the object, `photo-08.jpg` (the broad face, near head-on, a
little to the right and above) and `photo-09.jpg` (three-quarter from the front right, higher; the twin vessel of the
pair at the left edge), and the label `card-10.jpg`. Nothing else about this object was reachable. Tags:
**[measured]** back-projected from photo-08 through the assumed camera (≈ ±3 % of H); **[est]** read obliquely,
partly hidden, dark or worn (≈ ±10 %); **[inferred]** not visible.

## a. Identity

1. **Label** (transcribed in SOURCES.md): 鳳文方壺 · Square Hu with Phoenix Design · Bronze · China, Western Zhou
   dynasty, 9th century BC · Nezu Museum · 90097・98 · exhibit 16. No findspot, no designation, no dimension.
2. **A pair.** The double number and photo-09 (a second hu with the same rings, triangles and straps at its left edge)
   say the museum shows two; this model is the one in front of the camera in both photographs. Which of 90097 / 90098 it
   is cannot be told.
3. **Scale [inferred].** No dimension on the label; the card is not in either object photograph, the plinth is a plain
   block. H = 500 mm is assumed. Two weak checks agree: the spiral ground packed in the upper cartouches measures
   ≈ 2.9 px centre to centre on photo-08 (3.27 px/mm at H = 500 → ≈ 0.9 mm, a normal 9th-century pitch), and the
   hanging ring then measures ≈ 75 mm across, the size of the rings on Western Zhou hu of 45–60 cm. A 45 cm vessel
   (0.8 mm pitch) or a 55 cm one (1.0 mm) cannot be excluded. **Every other number is a proportion measured on the
   photographs, so the whole model scales with that one guess.**

## b. Form (mm at H = 500; Y up, front +Z = the broad face of photo-08; handles on ±X)

1. **Camera (assumed, then fitted).** A pinhole, f = 3000 px (the owner's phone at the zoom used for the other Nezu
   pieces), looking at (0, 250, 0): azimuth 4.4°, distance 965 mm, image offset and roll fitted
   (`.work/r8-fanghu/solve/fit08.py`, LM) to the silhouette's left and right edges at 11 levels plus four centre-line
   landmarks (crown rim, neck-frieze divider, diamond stud, foot); 7.9 px rms. The **elevation is not determined by
   these landmarks** (it trades against the image offset) and was set to 6° — the foot plate's top face shows as a
   ≈ 35 px band, the crown's mouth is not seen into. Correction for the elevation: every level is the height at which a
   point on the FRONT surface (z = 0.55 × the half width there) projects onto the photo row read, so a register on the
   receding upper belly is placed at its own depth before its height is read (`prof.py`).
2. **Plan depth [measured, photo-09]: 0.55 × the width (± 0.07).** Second camera fitted on photo-09
   (`fit09.py`: az ≈ 38°, el ≈ 7.5°): the foot plate's three visible bottom corners (rounded-rectangle plate 0.564 :
   1), the diamond and triangle studs on the centre line, three silhouette rows. The task brief calls the section
   "rounded-square"; **the photograph wins**: a rounded RECTANGLE, nearly 2 : 1 — the narrow sides carry the handles.
3. **Levels [measured]** (y): foot plate 0–13 (it overhangs the foot band); foot band 13–66 (concave, a frieze 20–56);
   lower cartouches 71–162; horizontal strap 165–196 (diamond studs centred at 180); upper cartouches 197–283;
   plain shoulder band 291–309; neck frieze 310–357; band of rising triangles 359–416; neck top 419; lid lip 419–421 (r8 fix: a thin
   overhanging edge — photo-08 shows no plain band under the lid cartouches);
   domed lid band 421–464 (cartouches 434–462); crown 464–500.
4. **Half widths (x) [measured]** (silhouette, photo-08): foot band 107.5 @13 → 103.4 @50; belly 112 @72, 122.3 @88,
   125.2 @100, **126.7 @132 (widest: the lower cartouches)**, 124.6 @162, 118.8 @192, 114.3 @207, 107.8 @222,
   101.6 @237, 95.8 @252, 90.2 @267, 85.6 @282, 81.6 @297; neck 78.6 @310, 75.1 @340, **74.6 @358 (waist)**, 76.8 @388,
   79.9 @419; lid 81.6 @421 (the lip overhangs the neck), 80.6 @428, 76.4 @440, 71.5 @448, 64 @455, 50 @463; crown 45.5 @465 flaring to 50.2 @500 (walls ≈ 3.6).
   Foot plate 117 × 66 (half), corner radius ≈ 12 [est].
5. **Section [est]:** rounded corners, radius ≈ 0.45 × the half depth (≈ 32 on the belly; r8 fix — it was 0.7, which
   made the three-quarter view ≈ 10–13 % narrower and boxier than photo-09: the silhouette extent at 36° is
   (a − r)·cos + (b − r)·sin + r, and the photograph's 0.55 × H needs the smaller radius). The cartouches still wrap
   round the corner, and the side studs stand on the silhouette in photo-08 (≈ 2/3 as proud as the broad face's).
6. **Sculpture [est]:** two animal heads on the narrow sides of the neck (y ≈ 320–372, ≈ 40 mm out from the wall): a
   broad skull, round eyes, two ears / horns standing up and back, a muzzle hanging down with a loop under the chin;
   a loose ring ≈ 75 mm across, bar ≈ 5.6 mm, hangs from it in a plane parallel to the side and rests on the upper
   belly (photo-08: rings at both silhouettes, edge-on; photo-09: the +X ring at ≈ 45°). **Studs:** on every face a
   four-sided pyramid on the strap crossing (lozenge base ≈ 50 wide × 58 tall, ≈ 17 proud) and a three-sided one under
   the shoulder band (top edge ≈ 44 wide at y 290, apex on the wall at y ≈ 266, ≈ 13 proud: a level top facet); the side
   studs show on both silhouettes of photo-08 and on the right silhouette of photo-09.
7. **Crown [est]:** an open flaring rectangular collar (its mouth seen in photo-09), near-black. Its rim is a saddle:
   full height on the broad faces, rolling down round the corners in a quarter-round of ≈ 10 mm (the rounded upper
   corners of photo-08's front view), the narrow side ≈ 10 mm lower, split by a deep U slot (photo-09) — modelled
   (r8 fix) as a deformation of the crown loft. The flare is kept: photo-08 measures 345 px at the base and 410 px at
   the rim (≈ 1.19), so the crown is NOT a near-vertical tablet.
8. **Not visible:** the back, the left (−X) side face square-on, the inside, the underside, any inscription.

## c. Décor (relief heights in mm; traced on faces/dev-*.jpg — photo-08 developed onto the model surface)

The language is **not** Anyang taotie-and-leiwen: it is **sunk-then-embossed** (round 9 redo). Each cartouche is a
field SUNK below the wall — ≈ 1.4 mm [est: the shadow under the cartouche's upper edge is 1.2–1.8 mm wide on
dev-low.jpg (s 55–95, y 161.6–163.8) under a light ≈ 45° to the wall] — its edge stepping down through two or three
parallel ribs at ≈ 1.3–1.5 mm pitch [measured: dark lines at s 17.1 / 18.4 / 23.2 / 24.7 across the inner edge, y
157.5 / 158.6 at the top]; inside it the bird is EMBOSSED back up as flat-topped ribbons 3–6 mm wide [measured: e.g.
3.4 and 4.4 mm plateaus at y 85–95, s 19–31] rising ≈ 1.4 mm from the floor to the wall's level [est: side shadows
0.6–1.2 mm], soft shoulders, channels 1–2.5 mm between them; the remaining floor pockets hold fine spirals (≈ 0.9–1
mm pitch); the eyes are a raised ring round a domed centre in their own small round recess (Ø 8–8.5 belly, 7.8 neck
frieze). Model: `kit.sunkCartouche` (depth 1.4, 3 rim ribs × 1.25 mm, ribbons flush, 0.7 mm shoulders; neck frieze
1.2 / 2 × 1.2; lid 1.0 / 2 × 0.8), ribbons traced as `band` hints by `ribbons.py` (faces/dev-<zone>.bird.json →
dev-<zone>.ribbons.json, raised 68 % of the lower cartouche inside its rim, 57 % upper, 63 % frieze, 43 % lid).

| zone | photograph | what [measured unless tagged] |
| --- | --- | --- |
| lower cartouches (4 per broad face) | photo-08, both clear; photo-09 | a bird facing the vertical strap: crest plumes in concentric arcs over the eye (59, 129), a curled beak with a hollow, a breast column of four hooked feathers, a big spiral wing low inside, the long tail plumes curling up the outer side round the corner |
| upper cartouches (4) | photo-08 | crested bird facing the centre: a G-hooked head, the eye (45, 259), a tall U crest plume with a spiral-filled window, the body rolling into a big spiral (50, 222), feet / tail bars below, spiral ground in four hollows |
| neck frieze 310–357 | photo-08 | confronted birds either side of a centre line: beak column, head block with the eye (±26, 343), G-crest, a row of three small scrolls, claw, tail curling at the corner |
| triangles 359–416 | photo-08, photo-09 (dark) | per face two rising triangles centred at ±Qh/3 and two halves straddling the corners; double outline, a scroll pair over a spiral hollow in the foot of each [est: the interior is dark] |
| lid band 425–464 | photo-08/09 (domed, foreshortened) | a bird cartouche either side of a plain centre strip, head with the eye toward the centre, parallel feather ribbons [est] |
| foot band 13–66 | photo-08 (dark, oblique) | a central roundel (an eye in a rounded square) and long hooked S-bands (qiequ) [est, low trust] |
| narrow sides | photo-09 (oblique) | the same scheme compressed to their width [inferred] |

## d. Patina (photo-08/09)

Mottled grey-green: dark olive and blue-grey territories on the plain straps, pale grey-green crust islands, bright
emerald specks everywhere; pinkish red-brown earth packed in the cut channels of the birds; the crown, handles and
rings near-black olive. Preset `nezu-fanghu`.

## e. Known differences (model vs photographs)

Round 8 fix (r8-fanghu-fix): the upper cartouche bird was RETRACED (faces/dev-up.trace.json) over the groove network
that `grooves.py` reads off faces/dev-up.jpg (Hessian line detector on shadowed and earth-filled grooves, the hollows by
their earth-red colour; faces/dev-<zone>.grooves.json are those reads, kept as tracing evidence, not drawn); the lower
cartouche got its earth-filled sunk columns and spiral hollows; the hollows of every zone are packed with ROUND coils
(decor.js spiralFill), not squared leiwen; the band edges roll down into the channels. Note: the upper birds ARE a
mirror pair, like the lower ones (photo-08 crop checked: the U crest is on the outer side of each field). Before that,
see the final report of round 8 (r8-fanghu) and the compare images; in short: the ribbons read thinner and the
channel network sparser than the photograph, the triangle and foot friezes are schematic, the crown cut-outs and
the back are not modelled, scale is a guess.

Round 9 (fanghu-bird): the body cartouches, the neck frieze and the lid cartouches redrawn in the bronze's own
language — sunk field, stepped rim, embossed ribbons (kit.sunkCartouche) — from `band`-hint tracings of the lower,
upper, frieze and lid birds (ribbons.py; the dev-*.trace.json channel tracings are kept as the earlier evidence and
still drive the foot frieze and the triangles, which keep the cut-ribbon language). Still different: the ribbons are
read off a ≈ 3.2 px/mm photograph (± 0.5 mm, and the lid ± 1.5 mm: soft and foreshortened); the ribbon tops carry no
incised contour lines; the upper birds' crest plumes and tail bars are simplified; the floor spirals are the kit's
packed leiwen (rounded), not the photograph's individual coils.

Round 9b (fanghu-bird follow-up): the foot frieze (a sunk band between its cut border lines: roundel = rounded-square
ribbon round a ring-and-dome eye, hooked S-ribbons either side; faces/dev-foot.bird.json, low trust) and the rising
triangles (one unit traced at s 23.5 on faces/dev-tri.jpg — a double-ribbed sunk triangle, two C-scrolls rolling up
from the base centre into their eyes, a stem to the apex with a small ring bud — laid at ±Qh/3 and ±Qh of each side)
now use the same sunk-and-embossed construction, so the whole vessel speaks one language. Body and neck-frieze ribbons
carry the photograph's fine contour line (0.55 mm, 0.8 mm in from the edge, ribbons 2.7–6 mm wide only). Upper bird
and lid ribbons thickened: raised inside the rim upper 57 → 59 %, lid 51 → 60 %. Recesses: preset crevice 0.8, earth
0.85 '#b48470', recessDirt 0.45 (photo-08 earth in the lower cartouche: median RGB 120 / 102 / 79).

Round 9c (fanghu-bird, layout): MEASURED on the rectified faces (face-lower, face-upper, same mm grid as the model's
face renders), on photo-08's silhouette rows and on photo-09. Body cartouches: on the broad face the model already
sat within ≈ 2–3 mm of the photograph (inner edges ±19.6 / ±20.4 against ±17 / ±18; tops 162.2 / ≈ 281 against
162.8 / ≈ 280), but the tracings stopped where photo-08 stops seeing: the lower field 2–5 mm, the upper field's foot
20 mm (s 89.6 at y 203 against the corner diagonal at 109.5) short of the corner, and photo-09 shows the broad-face and
narrow-face cartouches meeting AT the corner with only their rims between. Now each traced bird is refitted in s
(decor.js `refitter`): inner edge 17 / 18 mm (× 0.85 on the narrow sides), outer edge 1.5 mm short of each side's
corner diagonal at every height, the ribbons widened with it (lower × 1.07; upper × 1.03 at its head to × 1.30 at its
foot). Straps = everything the fields leave: vertical 34 / 36 mm on the broad faces (was 39 / 41), 29 / 31 on the
narrow ones, horizontal 165–196; the fields are sunk 1.6 mm (was 1.4) so the straps stand proud with a stronger step.
Lid and crown (photo-08 silhouette rows ÷ 0.98): dome half widths 79.7 @422.5, 77.9 @431.6, 73.5 @440.7, 68.9 @446.8,
59.6 @452.9; the crown shows from y ≈ 455, waist 46.5 @459, 51.9 @474–480, its top corners rounding from ≈ 489. Model:
lid band 421–457.5 (was 464), crown 457.5–500 (42.5 tall, was 36), waist 46.2 → 51.6 at the rim, the flare in its
lower half. The crown is plain on both photographs (no relief can be read on it).
