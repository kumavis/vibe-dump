# Dossier — nezu-fanglei (饕餮文方罍, Nezu Museum 90081)

Ground truth: the project owner's two photographs, `photo-37.jpg` (front, near head-on) and `photo-36.jpg`
(three-quarter from the front-right), and the label `card-38.jpg`. Nothing else about this object was reachable.
Tags: **[measured]** read from a photograph through a solved camera (≈ ±3 %); **[est]** read obliquely or
partly hidden (≈ ±10 %); **[inferred]** not visible, typological or a repeat of a seen face.

## a. Identity

1. **Label** (card-38, transcribed in SOURCES.md): 饕餮文方罍 · Square Lei with Taotie Design · Bronze · China, Shang
   dynasty, 12th–11th centuries BC · Nezu Museum · 90081 · exhibit 13. No dimensions, findspot or provenance.
2. **Not** the nezu-fangyi (a squat fangyi) and **not** `nezu-fanglei-dasikong` (90079, a domed-lid square lei in
   the same gallery): different objects. The second was looked at for the type only.
3. **Scale [inferred].** The label gives none; the label card and plinth are never in the same frame as the
   vessel at a usable angle, so they cannot serve as a ruler. Square lei of this lidded, hipped-roof type are
   commonly 45–60 cm with the lid. **H = 503 mm is assumed**; every other number is a proportion of it measured on
   the photographs, so the whole model scales with that one guess.

## b. Form (all mm at H = 503; Y up, front +Z = the broad face with the low lug)

1. **Cameras solved, not guessed** (`.work/r7-lei/solve/`: cam.py, fit37.py, fit36.py, gen_faces.py). A pinhole
   camera (azimuth, elevation, roll, distance, focal length, image shift) was fitted by least squares to 14–23
   landmarks read at 1:1 off photo-37 (knob, eave and skirt corners, collar corners, belly-top corners, register
   lines on the centre flange, foot corners), with the shape parameters free: **photo-37: az ≈ −1…3°, el ≈ 10–12°,
   roll ≈ −1°, f ≈ 13 000 px at ≈ 3.7 m** — a long lens, so perspective is weak and the 12° elevation is what had
   to be corrected (a feature set back by Δz shows Δz·sin 12° higher). rms 9 px ≈ 2.5 mm. **photo-36: az ≈ 69°,
   el ≈ 5°** from the collar box and eave corners. The collar's two visible faces (220 px front, 430 px side, same
   180 px height) give the **plan ratio depth : width = 0.75 [measured, ±0.05]** — superseded in round 10b: 0.65 ± 0.05, §e.1: the ±X faces (with the handles)
   are the narrow ones.
2. **Levels [measured]** (y): foot 0–21.5 (plain base strip 0–4); belly 21.5–263: plain border 21.5–35, narrow frieze
   35–50.5, low register 50.5–101 (lozenge band 51–62), second register 101–≈169, main register ≈169–253, plain top
   band 253–263; shoulder 263–325 (frieze 266–310, plain above, rounding into a flat ledge at 325); collar 325–376;
   lid skirt 376–384, eave edge 384–388, roof 388–458; knob post 458–485, knob roof 485–503.
   The **roof rise is the weakest number**: photo-37's flattened slope ends at ≈ 455–458 (rise ≈ 70) while photo-36
   read naively gives ≈ 90 (its apex is a flange ear, its eave corners flange tips). **The photograph seen head-on
   wins: rise 70**; photo-36's three-quarter compare shows the model's roof a little lower than the photo's.
3. **Half widths (x) [measured]**: foot 62.5; belly 66.5 @21.5, 69.5 @35, 75.5 @50.5, 85.5 @70, 98.8 @101, 110.5
   @125, 120.5 @150, 127.2 @178, 129.8 @215, 130.4 @245, 130.3 @263 (widest just under the shoulder: the upper
   belly is nearly straight, the lower belly tapers fast); shoulder 130.6 @276, 128 @294, 122 @310, 116 @319,
   108.5 @325; collar 85.5; lid skirt 85.5, eave 88, ridge half 44 [est; round 8: face-lid's field is still ±43 mm at 90 %
   of the slope and photo-36's ridge reads ≈ 45–48; was 38]; knob eave 19.5 × 15 [est], post 17 × 15 [est], knob cap ≈ 21 tall
   with a ≈ 7 mm vertical fascia (photo-37). Depths (z) = 0.65 × these (round 10b; was 0.75).
4. **Flanges [measured / est]**: belly corners: thick slabs (≈ 8 mm) projecting ≈ 23 mm on the 45° bisector,
   17 slots cut in from the crest (≈ 2.8 mm wide, ≈ 9 deep, ≈ 13 mm pitch, counted on the right flange of photo-37),
   a squared cap standing above the belly top, ⊥ marks incised on the flanks; shoulder corners: separate slotted
   slabs (≈ 19 mm, 3 slots) whose tops hook up well above the ledge (photo-36); belly centre flanges: slender ribs
   ≈ 7 mm proud with small slots — the front one stops above the lug (y ≈ 99), the others run to the narrow frieze
   [inferred]; collar corners ≈ 8.5 mm with 2 slots, collar centres ≈ 6 mm; foot corners and centres short tabs;
   lid hips ≈ 11 mm, 7 slots, the tops rising as ears past the ridge, the lower ends stabbing past the eave corners;
   a plain bar down the centre of every roof slope.
5. **Sculpture [est]**: two loop handles on the ±X shoulders (round 8 re-read of photo-37 / photo-36: a flat-topped
   head lying nearly level on the shoulder top, ≈ 45 mm out from the wall, ≈ 25 mm across, spiral horns incised on its top;
   under its outer end a broad flat strap ≈ 23 mm across, ≈ 11 mm thick, curling back into the wall at y ≈ 284); a frontal head on the front shoulder
   (trapezoid ≈ 55 → 32 mm wide, y 276–324: two massive rounded-square C horns with spiral cores over its upper half,
   bulging eyes, small coils, a zigzag tooth row and a projecting flat-faced chin block);
   the back shoulder head [inferred: repeated]; the low lug on the front only: a round-section ring standing
   ≈ 43 mm out of the wall (photo-36) carrying a narrow mask ≈ 48 mm across its C horns (round 8; was 61), hooks on its face, and a long snout with a
   zigzag row of fangs hanging to y ≈ 33 (photo-37).
6. **Not visible**: the back face, the left (−X) face, the inside, the underside, the knob's back, the
   inscription if any. The back repeats the front (without a lug) and the left repeats the right — **inferred**.

## c. Décor (traced from the flattened faces — faces.json, faces/*.jpg; elements in nezu-fanglei/relief.js)

The bands are pale grey-green like the ground, read by their shading, so the thresholding tracer used for the Met
fangding does not separate them (`trace.py` is kept with its debug overlays as the record of that); the décor is
traced BY HAND from mm grids on the flattened faces (`.work/r7-lei/solve/gridface.py`). Relief: plateaus
≈ 2.2 mm proud with round shoulders, one sunk contour line ≈ 0.9 mm inside each edge, spiral chains on the horns
and the nose strips, coils in the curl blocks; round boss eyes ≈ 18 mm Ø, ≈ 2.9 mm proud, ringed, with a pupil
hole ≈ 4.8 mm Ø; leiwen ground ≈ 0.95 mm pitch.

- **Main register (169–253)**: per half a G-shaped horn 7.5–9 mm wide (top bar 243–251, outer column at x 65–73,
  its inner column rolling into a spiral, a squared-coil block 20 × 18 inside it); a brow under it; the round
  boss eye at (±37, 205); a small boss at (±52, 190.5); a trunk band from the eye to a big C "ear" block at
  x ≈ 108; a lower hook; the jaw hook under the eye; a vertical kui at the corner; a strip of hooks beside the
  centre flange.
- **Second register (101–169)**: a big C open to the right (x 24–73, y 132–165), slanting body bands toward the
  corner, a broad lower band with a spiral chain, a hooked crest near the corner.
- **Low register (50.5–101)**: flat eye plates with a slit (x 20–48), a C hook under them, a hooked crest; the lug
  mask over the centre; a band of small lozenges with dots (51–62).
- **Narrow frieze (35–50.5)**: a running snake-like band rolled at both ends with an eye dot.
- **Shoulder (266–310)**: confronted kui either side of the head: crest of two fat C blocks (S–G), thick body
  rolling up into a tail block at the corner, a C jaw below, an eye boss.
- **Collar (325–376)**: thinner (≈ 3.8 mm) kui frieze with two eye dots per half (dark, ≈ 3.5 px/mm: low fidelity).
- **Foot**: S-snakes with eye dots [est].
- **Lid slopes**: upright mask per half: C horn on top, pillow eye with a slit, brow, a band under the eye, a G
  below, bodies along the hips, three small bosses. The triangular end slopes carry a smaller mask (photo-36) [est].

**Round 8 (fix pass) band language.** Belly bands widened to 7.5–9.6 mm with round outer corners (0.8 × w), one sunk
contour line plus parallel incised lines on the tops (no spiral chains), horn ends rolled into spirals, big coil blocks
inside the main G horn and the ear (≈ 21 × 18.5 and 15.5 × 16 mm); the strips beside the centre flange are columns of
small hooks (photo-37), not spiral chains; the ground is a ROUND leiwen at ≈ 0.8 mm pitch. The lid mask was re-read on
face-lid (bosses at x ±6 / ±31 / ±50, U horn at x 12–29, hip bodies running outer-bottom → inner-top).

## d. Patina (photographs)

Pale grey-green body, the raised tops paler and silvery-green, the leiwen ground darker grey-green; rust-brown
cuprite patches across the upper belly and shoulder; emerald specks low; collar, lid and knob much darker
(near-black olive). Preset `nezu-fanglei` (src/kit/material/patina.js).

## e. Round 10 (mid-level details at the three-quarter angle; .work/lei-mid)

1. **photo-36's camera, re-fitted** (`.work/lei-mid/fit36e.py`, pinhole with the principal point at the image centre, 8 px
   rms on the knob tip, near collar corner top/bottom, far-left collar corner, near foot corner): the phone stood
   **≈ 0.73 m from the axis at y ≈ 404 mm** (about lid-skirt height), **az 67.6°**, looking down ≈ 13°, f ≈ 2520 px
   (vfov 41° over the `three-quarter.jpg` crop) — not the long lens (fov 10° at 3.6 m) the view used. The
   `three-quarter` view now reproduces it.
   **Plan ratio (round 10b): depth : width = 0.65 ± 0.05 [measured, photo-36], was 0.75.** With the ratio free and the
   far (back-right) collar corner included the fit gives 0.645–0.651 (12 px rms, `.work/lei-mid/fit36rho.py`); without
   that corner it falls back to ≈ 0.75 because nothing else constrains depth, so 0.75 was never a measurement (the first
   builders read photo-36 with a long-lens camera). Photo-37 fixes the widths only. The same ratio is used for the whole
   stack: foot, belly, shoulder, collar, lid (front-slope run 57 mm, 51°; end slope run 52 mm) and knob (39 × 26) —
   photo-36's lid and collar corners sit on the same solution within the reading error. Depth without flanges 196 → 170 mm.
   faces.json: every z scaled by 0.65/0.75 and the slanted chord planes re-tilted; all seven faces re-rectified.
   The ±X faces now carry the front design at TRUE size in their narrower field: plates mostly outside are dropped, plates
   crossing the edge clipped 2.5 mm inside it (was: squashed in x by 0.75); the lid's triangular end slopes carry the
   same mask scaled uniformly by 0.62.
2. **Lid**: photo-37 (near-orthographic) shows NO eave overhang beyond the fascia/collar (eave line ≈ fascia box ≈ collar
   body, ±1 mm); photo-36's back corner shows ≈ 4–6 mm of eave plate over the fascia [est] — kept at 2.5. Rise 70 confirmed
   (photo-37: ridge at the projected 458 within 3 mm; photo-36 at the fitted camera: the end hip line within ≈ 15 px).
   **Ridge half 44 → 36** (photo-37: hip-flange ear roots at ±27–35 mm round the post). Hip flanges: ≈ 13.5 mm deep,
   10.5 thick, 7 wide shallow notches (crenellated), the lower end ≈ 8 mm past the eave as an upturned tip. Slope centre
   flanges: 9 mm proud, 5 slots, running 8 mm past the eave (photo-36). Knob: a steeper cap ≈ 25 mm tall (post 458 → 478,
   5 mm fascia, ridge 0.12), post 15 × 13 mm.
3. **Collar**: proportions confirmed (175 × 51, same width as the fascia). Added a plain stepped plinth (2.8 mm proud,
   3.2 tall) round its foot and three turned step-lines on the ledge (photo-36). Frieze redrawn band by band
   (`faces/face-collar.trace.json`).
4. **Shoulder handles** (round 10b): a broad flat-topped head (≈ 48 mm across at the brow, 38 at the snout, ≈ 15 mm
   thick, top y ≈ 324 at the ledge lifting to 327 at the snout, snout end at x ≈ 163 and dropping to y ≈ 301, two low
   horn-ears swept out off its outer corners), carved top (spiral horns, ears, eyes, brow hooks, nose ridge, snout
   scrolls); under the snout a short thick D-loop in the RADIAL (XY) plane, rooted in the wall: photo-37 sees it face-on
   (outer ≈ 36 × 45 mm, x 124 → 160, opening ≈ 12 × 18 → section 12.2 on a 24 × 39 mm centre line), photo-36 obliquely
   (bottom y ≈ 249–251). (Round 10's free-hanging 63 mm ring was wrong.) The ±X belly centre flanges stop at y 230.
5. **Low lug**: D-ring (section 12, 54 × 52 mm, in the YZ plane, centre y 60 / z 84) behind a mask 49 mm across: two C
   horns of two nested fat bands with domed cores, crest, brow, eyes with slits, cheek hooks and curls, a snout with
   interlocking upper and lower fangs in relief over a rounded lip.
6. **Patina** (round 10b): the `nezu-fanglei` preset darkened to a grey-olive body with paler worn relief tops and sparse
   green; lid and collar near-black (upperTone 0.11 above 0.645 H, the collar's foot).
