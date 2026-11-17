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
  (Superseded in the jue-fix pass: θ 123.5, 15° up — see the end of this file.)
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

## Fix pass jue-fix (owner: "inverted surfaces on the legs; top of handle is ram face; mushroom bits should match; spout end more open")
- Legs, a BUG: the leg's swept section was read with `u → (1 − u)`, so its grid ran clockwise round +Y (right → left
  seen from outside); buildSurface derives normals and winding from the grid, so every leg face was wound and lit
  INWARD (front faces culled: the legs rendered see-through, their far insides showing as dark facets and as pale
  "wedge plates" where the tops were cut by the bowl). The three-facet tip cap was wound upward too. Fixed in
  nezu-jue/form.js (no kit change, no double-sided material); the top cut is now a per-column bisection against the
  bowl (the old per-vertex clamp folded the top rows into flaps). A ray-parity check over every mesh (faces buried
  inside another part skipped): legs 228/285 sampled faces inward before → 0/300 after; normal-vs-winding 36 → 0
  per leg; tip caps 3/3 wound inward → 0. Posts, caps, handle, flanges, body (outside and inside) were already
  consistent. Legs now taper near-linearly to a point (tip ≈ 2.8 × 2.4 mm, was 6 × 4.6).
- Camera refitted on 5 landmarks (leg tips 588,1946 / 1210,1832 — the r8 solve had the right leg tip 66 px low on its
  shadow —, finial tops 483,122 / 765,40, the upper-wall triangle's apex 842,585): θ 123.5, 15° up, 1.33 m, 10° lens,
  ≈ 14 px rms (≈ 1.6 mm). 6–14° lenses fit about as well (rms 14–15 px). The detail views now share that station.
- Handle: a ram's head (horns coiled down each side, poll pad, brow, eyes in sockets, snout proud of the strap's
  outer corner, nostrils, mouth groove) replaces the plate-and-stubs block. ≈ 11.6 mm skull, ≈ 19 mm over the horns.
- Posts: ONE design placed twice (turned to ±50): cap Ø 22.6 (was 24.8), dome ≈ 6 mm over a 0.6 mm undercut, rolled
  edge, finial Ø 6.0 × 3.3, whorl on both caps; stems Ø 10 seated on the lip (they hung 4 mm below it). The
  photograph shows the far stem ≈ 11.8 mm and the near one ≈ 7.5 mm across; the near one is read against the spout's
  inside of the same colour, so the difference is not trusted; the near cap reads plain (worn) where the far one shows
  the whorl.
- Spout: a broad U channel flaring from ≈ 30 mm outside where it leaves the cup to ≈ 36 mm at the mouth (was 27 → 19,
  pinched), tip ρ 97 (was 95), lip y 188.5 (was 189), 8 mm deep at the mouth (was 13), wall tops climbing steadily
  ≈ 0.5 mm per mm (the near wall's top back-projected through the camera), a thick rolled rim (Ø ≈ 3.8) along both
  walls. Through the refitted camera the old tip was NOT 8 mm low (that read came from the 12° camera).
- Tail: tip 2.5 mm lower (y 190.5), base ±18° (was ±13), fuller underside (its far wall stood ≈ 8 mm outside the old
  silhouette).
- Still off (through this camera): the spout's far wall top stands ≈ 7 mm higher in the photograph than in the model at
  mid-spout; the bowl hangs ≈ 2–3 mm lower; the loop's outer face ≈ 2–3 mm too far out.
