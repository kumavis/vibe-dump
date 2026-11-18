# Dossier — nezu-bo (蟠螭文鎛, Bo with Panchi Design)

Ground truth: the owner's two photographs `photo-18.jpg` (head-on at a broad face, the camera at about two thirds of
the bell's height) and `photo-19.jpg` (≈ 30° round toward the left end, the camera at about the top), with the label
`card-20.jpg`. Nothing else was used: the museum's site is not reachable and the label gives no dimensions.

Confidence tags: **[firm]** read directly. **[good]** measured through the camera solve, about ±5 %. **[est]** inferred
or seen obliquely, ±10–20 %. **[guess]** not visible.

## Part names used in spec.json

| part | what it is |
| --- | --- |
| `body` | the bell: two broad faces (each two half-face patches × upper zone / lower field), inner wall, mouth rim, flat top |
| `bosses` | the 36 coiled-serpent bosses (枚), one group |
| `crown` | the openwork suspension crown (钮): plain bar loop and the interlaced dragons, one plate |

## a. Identity (label, `card-20.jpg`) [firm]

蟠螭文鎛 · Bo with *Panchi* Design · Bronze · China, Spring and Autumn period, 6th–5th centuries BC · Nezu Museum ·
number 90120 · exhibit 18. Findspot, inscription, dimensions: not on the label.

## b. Form

### b.1 Camera solve [good]

One pinhole camera per photograph (position, yaw, pitch, roll, focal length; principal point at the frame centre),
fitted by Levenberg–Marquardt TOGETHER with the shape (section depth ratio, the narrowing of the top), the central
panel's four frame corners, the 25 visible boss centres (taken 7 mm out from the wall: the apparent centre of a
13 mm dome), the top and mouth points on the ends and the front centre line, and 11 silhouette rows: 89 residuals,
**9.5 px rms**. Work files: `.work/r8-bo/fitjoint.py` (not committed); the cameras are in the artifact's `front` and
`three-quarter` views and in `faces.json`.

- photo-18: camera at (18.6, 385, 763) mm, pitch 8.3° down, f = 2199 px (vertical field 49.9°).
- photo-19: camera at (−474, 488, 851) mm, yaw −30.1°, pitch 14.3° down, f = 2558 px (43.6°).

### b.2 Section and silhouette

- Pointed-oval section **[good]**: x = A sin θ (1 + 0.15 |sin θ|⁸)/1.15, z = 0.92 A cos θ. The depth ratio D/W is
  the least certain number: the joint fit prefers 0.94–1.03, a prior of 0.78 (a typical bo) costs 1.2 px rms; 0.92
  ± 0.08 is used. The ends are crisp edges (photo-19's left end and the mouth's left corner) **[firm]**, modelled as a
  rounded point of small radius.
- Half-length A(y), read row by row off photo-18's silhouette (the ends lie at z = 0, so the silhouette is the end
  line) with the depth change top → bottom divided out, then the narrowing above y 232 refitted with the cameras
  (factor 0.79) **[good]**: 175.6 at the mouth, 176.6 at y 105–170 (the widest), 176 at 232, 173.4 at 299, 170 at
  344, 167.3 at 373, 162.1 at 418, 155.4 at the top (450). Body near-straight below the boss zone, swelling ≈ 1 %
  above the mouth.
- Flat closed top and flat mouth **[firm]**. Wall thickness 7 mm, top 12 mm **[guess]**: neither photograph shows
  the inside.

### b.3 Scale [est]

No dimension on the label, no ruler in frame. Inferred from (1) the groove pitch of the three-ribbed ribbons
(≈ 2.2 mm rib + 0.6 mm groove, a common Houma-foundry pitch) and (2) the boss diameter (≈ 38 mm, within the range of
large Spring and Autumn bo). Body height **450 mm**, total 563 mm, length across the edges 353 mm, depth 325 mm
(bosses included 333): **±20 %**. All proportions are measured.

### b.4 Crown [good in outline, est in depth]

Re-read in bo-fix on `faces/face-crown.jpg` (photo-18 rectified onto the crown's own plane, 10 mm grid) and on
photo-19 at 2×: a plain bar loop (outer 106 × 110 mm, window 60 × 85 mm, ≈ 16 mm thick) standing on a pair of
confronted openwork dragons — CURLS and S-SHAPES, not arches. Per side, from the axis: crook A (foot X −4…−20, rises,
arches outward over a ≈ 29 × 18 mm opening and rolls down into a curl under the loop leg's inner side), crook B (its
confronted twin, foot X −50…−70, rolling inward into a curl under the leg's outer side: the two curls flank the leg's
foot), an S (a small curl hung on the loop's shoulder, the stem dropping onto B and rolling outward into a fat curl
with a pierced eye), the big foot curl (Ø 42, pierced eye Ø 10) and a small curl on the floor of the opening. One
plane of openwork, ≈ 13 mm thick (photo-19); flat-faced straps with rounded edges, an incised line inside every edge,
a spiral line cut on each curl. The feet are hidden behind the front of the top below Y ≈ 16 in both photographs:
taken to land straight on the top; the back is the mirror of the front **[guess]**; overall width 230 mm.

## c. Décor (all from the developed images `faces/dev-*.jpg`)

Layout (body y, mm) **[good]**: mouth margin 0–18 (plain; the lowest row of the field is worn almost flat) · lower
field 18–144.5 · broad raised border 147.5–161.5 · boss row 161.5–215 · ledge · band 222–261 · ledge · boss row
267–319 · ledge · band 326–361.5 · ledge · boss row 370–424.5 · ledge 424.5–431.5 · top band 431.5–450 (bo-fix: the
top band widened from 12.5 to 18.5 mm and the top ledge lowered 7 mm, measured on dev-upper-18 / 19). Ledges ≈ 5 mm raised
strips with a shadowed foot. Central panel (钲): a trapezoid, half-width 30.5 mm at the top → 32 mm at the foot
(panel mm), 161.5–424.5. Edge strip: panel x 243 → edge.

- **Bosses** [firm count, good position]: three rows × three per half-face, 36 in all; centres at panel x 59.5 /
  139.5 / 213, rows y 189 / 293 / 401. **ROUND** (bo-fix): Ø ≈ 37 mm **[good]** (the lit outline on
  `faces/face-bosses.jpg`, 36–39 across a row), ≈ 13 mm proud **[est]** (the bosses on photo-18's silhouette, seen in
  profile, are symmetric top and bottom). The dark tongue under each — read in round 8 as a drop-shaped apron — is the
  boss's own cast shadow under the top light: it changes length with the boss's place, and its edge is soft. Each a
  serpent coiled ≈ 2 stepped turns into the dome, the inner turn hatched by oblique ribs, an eared tiger head upright
  on the crown a little above and left of the centre (kit `coilBoss`, one design for all 36).
- **Ribbons** [firm]: every body is a flat raised ribbon ≈ 6.5–7 mm wide cut by two grooves into three equal ribs;
  ribs dark polished metal, grooves and ground packed with pale grey earth. Heads are solid masses with a ringed eye.
- **Bands** (traced on `faces/dev-band.jpg`, band 1, left half; band 2 repeats it): from the panel outward five
  units — x 33–79, 79.5–113, (the O ring, centre 121), 129–170.5, 171–217, 217.5–242 — each a G-frame open at the
  top round a head whose crest runs up to the ledge; snouts face the centre except the second and fifth. MIRRORED
  about the face centre (photo-18: [edge][A][O][B][C][panel] reads back to front on the right half, each cell
  mirrored). The O ring is two bodies crossing, over at one crossing and under at the other.
- **Central panel** (`faces/dev-upper-18.jpg`, re-read in bo-fix): two columns, one per half, ≈ 24 mm inside the
  frame, of EIGHT cells (scroll 421–399, heads with eyes at ≈ 384, 347, 315, 273, scroll 257–239, heads at ≈ 222,
  192); the head cells turn 180° by turns, S-links between. The two columns are the same column REPEATED, not
  mirrored **[firm: photo-18 at 3×]**.
- **Lower field** (`faces/dev-lower-19.jpg`, re-read in bo-fix): ringed eyes on a lattice 62 mm across × 31.6 mm
  down (eyes at s ≈ 35, 95, 157; rows 131, 98, 66, 36), four rows, the lowest worn almost flat; a straight repeat
  (the eyes are not symmetric about the face centre), alternate rows flipped **[good on the lattice, est on the
  cell's drawing]**.
- **Top band** (re-read in bo-fix, photo-18 at 6×): 18.5 mm wide (431.5–450; the round-8 layout had 12.5 under a
  ledge at 432–437.5), a chain of interlocked C-rings of three-ribbed ribbon, two rings per site, a site every ≈ 39–42
  mm, ribbons running along the top and bottom edges by turns, squared hooks between the sites **[good]**. Edge
  strip: twisted pairs (guilloche) **[est in detail]**.
- The ribbon, everywhere: three ribs (≈ 1.6–1.75 mm) parted by two grooves (≈ 0.55 mm), ≈ 6–6.5 mm; the top band's
  ≈ 5.2 mm. Unit-cell drawings: KIT.md § Woven interlace.

## d. Not visible

The back face (repeats the front), the narrow end beyond photo-19's left edge, the inside, the underside of the top,
the crown's back face and foot.

## e. Where the photograph and this dossier's first readings disagreed

The first, eye-read layout put the boss columns at 64 / 133 / 202 mm and a 4-unit band; the developed photographs
moved them to 59.5 / 139.5 / 213 and showed five units plus the ring. The photographs win.
