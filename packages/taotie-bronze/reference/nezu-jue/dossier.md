# Dossier — nezu-jue 饕餮文爵 · Jue with Taotie Design (Nezu Museum 90105)

Compact dossier in the shape of reference/met-fangding and reference/nezu-fangyi. Everything is read off the
project owner's ONE photograph of the object (photo-02.jpg; card-01.jpg is the label). **M** = measured on the
photograph, **I** = inferred (argued, not seen), **H** = hidden (no evidence).

## Label (card-01.jpg)
饕餮文爵 · Jue with Taotie Design · Bronze · China, Shang dynasty, 13th–11th centuries BC · Nezu Museum · 90105 ·
exhibit 2. No dimensions, no findspot, no designation on the card.
Pairing: the card is numbered 01 and the object 02 — the reverse of the owner's usual order (object, then card).
The card names a jue and photo-02 shows a jue, and no other jue is in the upload, so the pairing stands.

## The photograph and its camera
- photo-02: a three-quarter view from BEHIND THE HANDLE side, the tail coming toward the camera on the right, the
  spout running away to the upper left; plain grey wall, white plinth, no other object or person in frame.
- Camera solved (least squares, pinhole, .work/r8-jue/scripts/solve.py + facepts.py) on 8 landmarks: the near and
  right leg tips, the two post caps, the spout and tail tips, the top and bottom of the tail flange.
  Result: azimuth θ ≈ 122° (0 = the spout, 90 = the handle), **elevation ≈ 12°**, distance ≈ 1.33 m with a ≈ 10°
  vertical lens (the owner zoomed; a wide 0.4 m camera fits 3–5× worse), rms ≈ 16 px (≈ 2 mm).
  Elevation is the weakest number: the near/right leg tips (only 44 px apart vertically) argue for 9–12°, the view
  into the cup (mouth oval ≈ 157 px deep) for 12–17°; 12° is the compromise used everywhere (side view, faces).
- How the elevation is corrected: every measurement below is a model point pushed through the solved camera and
  compared with the photograph, not a pixel span divided by a scale; vertical spans at the band are foreshortened
  by cos 12° = 0.978, which the faces carry explicitly (y = 120.75 + v / 0.978).
- Azimuths: handle 90 (perpendicular to the spout–tail axis, by type: I); legs 90 (under the handle: M, the near
  leg), 210 (M, the right leg), 330 (H, hidden behind the cup); posts ±45 from the spout axis (M ± 6°: the solve
  gives 40–51 depending on the camera azimuth); flanges 0 and 180 (180: M; 0: I).

## Scale (inferred)
No dimension on the label, and no object of known size in frame (the plinth and the card are not in the same
picture). **The cup (band) diameter is ASSUMED to be 69 mm**, which with the measured proportions gives 206 mm to the
post caps and a rim 175 mm long from spout tip to tail tip — inside the 18–25 cm range of Anyang jue (research/03
§1.4: rim length ≈ 0.85–1.0 H; measured here 0.84). Cross-check: the squared spirals on the bands then read ≈ 2.5–3
mm cells, the usual size on 20 cm vessels. Treat every absolute size as ± 20 %.

## Proportions (M, in mm at the assumed scale, through the solved camera)
| item | value |
| --- | --- |
| leg tips | on a circle ρ ≈ 44 (solve 43–46), y 0 |
| bowl bottom | y ≈ 69 (near-hemispherical, ≈ 32 mm below the band; fix pass r8 — was 77, ≈ 8 mm too high against a landmark overlay of the side silhouette on photo-02) |
| band (décor field incl. borders) | y 101 → 140 (39 mm; the flange ends 102 → 139.5) |
| upper wall | band top → side rim at y ≈ 161, flaring from r 34.7 to ≈ 44 (concave) |
| spout | tip ρ ≈ 95 (solve 89–101), rim at the tip y ≈ 189, channel ≈ 28 mm wide outside (I ± 4), ≈ 13 mm deep |
| tail | tip ρ ≈ 77, y ≈ 193, pointed, narrow; concave underside |
| posts | at ±45°, standing on the lip, cap tops y ≈ 205; stem Ø ≈ 9 (M on the far post); umbrella cap Ø ≈ 24, ≈ 11 tall with a knob Ø 6 (M on both caps) |
| handle | a strap loop at θ 90 from y ≈ 147 down to y ≈ 100, reaching ρ ≈ 62; outer face ≈ 11 mm wide (M ± 2) |
| legs | blade legs of triangular section, ≈ 25 × 19 mm at the top, tapering to ≈ 4 mm, sharp edge outward, splay ≈ 13° |

## Registers, flanges (M)
- One décor band (39 mm) round the cup, framed by plain fillets top and bottom; below it the plain round bowl,
  above it the plain flaring upper wall.
- Flanges: a notched flange on the band at the tail axis (θ 180, ≈ 3.5 mm proud, ≈ 10 teeth over the band:
  pitch ≈ 3.7 mm, M); its twin under the spout (θ 0) is H (assumed by type and symmetry).
- Upper wall: a decorated triangle (base ≈ 17 mm on the band's top border, ≈ 16 mm tall) at θ ≈ 129 (M); the
  photograph shows only this one; triangles at θ 51, 231, 309 are I (the cup's two mirror planes).
- A DARK HOLE in the upper wall over the handle, θ ≈ 100–110, y ≈ 148–155, ≈ 11 × 6 mm (M): read as a loss or
  casting flaw. NOT modelled (a sunk pocket fills with the pale ground deposit and reads wrong).

## Relief (M where visible; heights estimated from shading)
- The band is a taotie in BROAD RAISED BANDS (≈ 2.5–4.5 mm wide, ≈ 1.8 mm proud [est]) whose flat tops carry
  chains of small SQUARED spirals (the 雷纹 sits on the motif — red-brown in the photograph), over a PLAIN sunk
  ground (pale buff burial deposit) with deep dark pockets in the curls and the eye socket. Two masks, noses on
  the flanges at θ 180 and 0; the photographed half (handle side of the tail mask, θ 116 → 180): an outer column
  full height (≈ 4.6 mm) with a big C curl turned outward low down; a second, shorter column; a horn ('beak')
  band from over the eye to a broad block that rises to the top border; the eye a squared frame, broad on top,
  round a deep socket with a low pillow eyeball (horizontal slit); a squared C right of the eye; the jaw's top arm
  under the eye; a G curl round a pocket in the lower field; a stem and a small curl at lower right; a plain
  nose strip beside the flange.
- Spout mask (θ 0): H, assumed = the tail mask. Fillers at θ 90 (behind the handle: dark and foreshortened in the
  photograph: a vertical band with C hooks is the reading) and θ 270 (H): I.
- Post caps: a whorl of comma ridges on the far cap's top (M); the near cap reads plain (worn?) — both get the whorl.
- Handle: a plain strap with a sunk line along its outer face (M, faint); an animal head on its top with a flat
  plate and two stubby horns (M, soft).
- Legs: plain (M).
- Not visible: the inside (I: plain, round bottom), the bottom of the bowl (soot / casting seams H), any
  inscription (jue are usually inscribed on the wall behind the handle — H).

## Photograph vs dossier vs research
- research/03 §1.4 says the handle sits "90° from the spout axis" and "one leg under the handle": the photograph
  agrees (near leg under the handle).
- research/01 puts jue bands in Style T6/T7 with leiwen GROUND; the photograph shows the reverse — spirals on the
  raised bands, plain ground. THE PHOTOGRAPH WINS: the model carves spirals on the band tops and leaves the ground
  plain.
- research/03 gives posts H 0.12–0.18 of the total and caps Ø 2–2.5× the stem: measured 0.2 and 2.7× — the
  photograph wins.

## Flat faces (faces.json)
face-band (62 × 48 mm, 8 px/mm) and face-upper (62 × 30): one plane through the band at θ 128 seen down the
photograph's line of sight; fit 0.09 mm rms on 8 points (model surface points projected through the camera, so
the fit only checks consistency: the real error is the camera's ≈ 2 mm). Trust: θ 105–170.

## Fix pass r8 (what changed and why)
- Bowl near-hemispherical, bottom y 69 (was 77): a landmark overlay (side silhouette fitted to photo-02 on the leg
  tips, spout and tail tips) put the old bowl ≈ 8 mm too high. spec.json bowlBottom 0.365 → 0.335.
- Posts at ±50 (was ±45: the overlay put the far post ≈ 4 mm toward the spout); caps are low domes with a rolled edge
  and a short cylindrical knob; ONLY the far cap (θ −50) carries the whorl, as fat raised commas (the near cap reads
  plain in the photograph). Stems Ø 9.8 (the far stem measures ≈ 10–11 mm).
- No rolled lip tube: the lip is the wall's own flat 3 mm edge. Spout plan tapers (27 → 19 mm wide) and its section is
  a U (floor curls up 6.5 mm to each wall; the keel stays where the silhouette put it). Tail narrower (base ±13°) with
  a round rib down each side from the tip to the band top at θ ≈ 160 / 200 (the second INFERRED).
- Handle: a bowed D loop reaching ρ ≈ 55 (≈ 5 mm less), rounder strap, a small head with a flat plate and two stubby
  horns. Legs: crisper outward arris, blunter tips, tops cut by the bowl (nothing shows inside the cup).
- Band: no top spiral border (the bottom one stays: the photograph shows squared spirals under the jaw); outer column
  broken by its outward C hook; nose column carries spirals; the filler behind the handle is two large G hooks round
  deep pockets; squared (right-angled) spirals in chains along every band, rounder outer corners, deeper pockets.
  Triangle: one heavy border and a thick cross figure.
- The dark hole over the handle (θ ≈ 93–109, y ≈ 146–154) is now modelled as a deep pocket; the preset keeps earth out
  of grooves and pockets (patina soilGroove), so it and the curl pockets read dark.
