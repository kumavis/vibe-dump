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

Traced on `faces/face-crown.jpg` (photo-18 rectified onto the crown's own plane, 4 px/mm): a plain bar loop (outer
104 × 113 mm, window 60 × 87 mm, bar ≈ 22 mm in the plane, ≈ 16 mm thick from photo-19), flanked per side by a
round-topped arched dragon (strap ≈ 20 mm) carrying two curled heads, and a chain of three fat pierced curls
(Ø 18, 25, 32 mm) climbing to the loop's shoulder; overall width 224 mm. Plate thickness ≈ 13 mm (photo-19). The
foot is hidden behind the front of the top in both photographs: taken to stand straight on the top.

## c. Décor (all from the developed images `faces/dev-*.jpg`)

Layout (body y, mm) **[good]**: mouth margin 0–18 (plain; the lowest row of the field is worn almost flat) · lower
field 18–144.5 · broad raised border 147.5–161.5 · boss row 161.5–215 · ledge · band 222–261 · ledge · boss row
267–319 · ledge · band 326–361.5 · ledge · boss row 370–432 · ledge · top band 437.5–450. Ledges ≈ 5 mm raised
strips with a shadowed foot. Central panel (钲): a trapezoid, half-width 30.5 mm at the top → 32 mm at the foot
(panel mm), 161.5–432. Edge strip: panel x 243 → edge.

- **Bosses** [firm count, good position]: three rows × three per half-face, 36 in all; centres at panel x 59.5 /
  139.5 / 213, rows y 189 / 293 / 401; Ø ≈ 38 mm, ≈ 13 mm proud **[est]**. Each a serpent coiled ≈ 2 turns into a
  dome, inner turns hatched, a small beast head on the crown (kit `coilBoss`).
- **Ribbons** [firm]: every body is a flat raised ribbon ≈ 6.5–7 mm wide cut by two grooves into three equal ribs;
  ribs dark polished metal, grooves and ground packed with pale grey earth. Heads are solid masses with a ringed eye.
- **Bands** (traced on `faces/dev-band.jpg`, band 1, left half; band 2 repeats it): from the panel outward five
  units — x 33–79, 79.5–113, (the O ring, centre 121), 129–170.5, 171–217, 217.5–242 — each a G-frame open at the
  top round a head whose crest runs up to the ledge; snouts face the centre except the second and fifth.
- **Central panel** (`faces/dev-upper-18.jpg`): two mirrored columns of seven cells; the top cell and the fifth are
  big round scrolls, the others G-framed heads.
- **Lower field** (`faces/dev-lower-19.jpg`): a lattice of interlocking G-hooks with heads in the bays, units ≈ 45 ×
  41 mm in three rows and a worn fourth **[est: the photographs are soft here; no single mask axis could be read]**.
- **Top band and edge strip**: twisted pairs of ribbons (guilloche) **[est in detail]**.

## d. Not visible

The back face (repeats the front), the narrow end beyond photo-19's left edge, the inside, the underside of the top,
the crown's back face and foot.

## e. Where the photograph and this dossier's first readings disagreed

The first, eye-read layout put the boss columns at 64 / 133 / 202 mm and a 4-unit band; the developed photographs
moved them to 59.5 / 139.5 / 213 and showed five units plus the ring. The photographs win.
