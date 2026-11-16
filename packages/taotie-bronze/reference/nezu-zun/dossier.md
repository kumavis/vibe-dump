# Dossier — nezu-zun (饕餮文尊, Nezu Museum 90075)

Ground truth: the project owner's photographs `photo-26.jpg` (head-on at a shoulder head, from about the height of
the foot top — the trumpet is seen from underneath) and `photo-28.jpg` (from about rim height, turned ≈ 55° to look at
a divider flange between two heads). Label: `card-27.jpg`. No outside source was consulted (none reachable).

Confidence tags: **[label]** read off the card · **[firm]** read directly and repeatably off a photograph ·
**[good]** measured through the fitted camera, ≈ ±3 % · **[est]** inferred or seen obliquely, ≈ ±10–15 % ·
**[guess]** typological default, not visible.

## Part names used in spec.json

| part | what it is |
| ---- | ---------- |
| `body` | the whole lathe: foot (base band, frieze, bowstrings, openings), belly (circle bands, mask), rolled belly top, collar, shoulder slope, neck, trumpet mouth |
| `heads` | the three animal heads in the round on the shoulder (0°, 120°, 240°) |
| `flanges` | six notched belly flanges, six foot flanges (0°, 60°, … 300°), three hooked slab flanges on the shoulder (60°, 180°, 300°) |
| `studs` | small square knobs on the rolled belly top |

## a. Identity [label]

- 饕餮文尊 · *Zun with Taotie Design* · 中国・殷時代 / China, Shang dynasty, 12th–11th centuries BC · 青銅 / Bronze ·
  根津美術館 / Nezu Museum · number on the card 90075 · exhibit 10.
- The label gives **no dimensions, no findspot, no designation and no inscription**.

## b. Form

### b.1 The cameras (fitted)

A pinhole camera per photograph (distance, height, pitch, roll, focal length, horizontal principal point) and seven
profile rings (lip tip, neck minimum, belly ledge, belly maximum, lower circle band, foot junction, foot base on
y = 0) were fitted together by least squares to hand-read outline points (left / right extremes and front-centre
rows, read on 1:1 gridded crops; `.work/r8-zun/fit*.py`, `cam.py`). **photo-26: 8.4 px rms** — camera ≈ 0.67 m from
the axis, ≈ 110 mm above the plinth, looking up 5°, focal ≈ 2230 px (a mildly zoomed phone, vertical fov ≈ 49°);
the camera's elevation explains the deep ellipse of the lip seen from below (b/a ≈ 0.39) against the flat foot
ellipse (≈ 0.10) — the stack below corrects for it. The band borders on photo-26's front centre line were then
converted to heights through the same camera, and the trumpet was fitted free-form to photo-26's silhouette (ten
rows a side). **photo-28** was refitted with the profile held: ≈ 1.03 m from the axis, at rim height (the lip is
nearly edge-on), roll −6.6°, **18 px rms** — weaker; used for the azimuths and the three-quarter view, not for
heights. **[good]**

### b.2 Scale (INFERRED)

The label has no size and nothing of known size is in frame (plinth and card are not measurable). The scale rests
on the line work: the mask's lines repeat at **≈ 9.5 px** on photo-26's belly front (autocorrelation, five
places), where the camera gives 6.2 px per fitted unit; taking **≈ 2.1 mm** for the line pitch of this kind of
dense line décor gives **1 unit = 1.45 mm**: **H ≈ 348 mm (rim), mouth Ø ≈ 355 mm, belly Ø ≈ 290 mm, foot Ø ≈
178 mm**; cross-checks: eye bosses ≈ 19.5 mm, circle-band discs ≈ 13–14 mm, both usual for a zun of this size.
Every mm figure scales with this inference; the proportions do not. Uncertainty **±20 %**. **[est]**

### b.3 Plan and divisions

Round. **Three-fold with six divisions**: heads at 0° / 120° / 240° (photo-26 front; photo-28's two heads flank its
centre); shoulder slab flanges, belly and foot divider flanges and the foot openings at 60° / 180° / 300°;
mask-centre flanges on belly and foot at 0° / 120° / 240°. Checked by projecting candidate azimuths through the
photo-26 camera: the openings fall at ±60° to within 3–7 px, the side flanges at ±60° to within 10–20 px. **[good]**
Studs: two seen at ±48° (photo-26) and one at ≈ 41° (photo-28); four at 45° + 90° k are ASSUMED. **[est]**

### b.4 Vertical stack (mm; heights from the fitted camera)

```
 347.5  lip tip (outer); the lip is an almost upright band r 171–178 over its top 22 mm   [good]
 276–347 trumpet: cylindrical neck to ≈ 276 (r 102.5), then a quick flare (r 122 at 295, 155 at 313)  [good]
 244.5, 253, 261.5  three bowstrings on the neck                                           [est: rows read at the sides]
 238–241 neck base; the shoulder slope rises ≈ 42° from the collar (r 133, y 214) to it   [good from the slab outlines]
 215.6–238.4 shoulder décor band (between the heads; photo-28 only)                       [est]
 207.8–213.4 collar: a narrow band of C-scrolls                                            [est]
 199    rolled belly top with the studs (r ≈ 143)                                          [good]
 186.5–170 upper circle band (r ≈ 145, the belly's widest)                                 [good]
 170–114 belly mask (r 144 → 123.6)                                                        [good]
 114–100.5 lower circle band, on the underside curving in                                  [good]
 87     foot top (r ≈ 83.5) under the belly's underside                                    [good]
 81.5   three openings (60°, 180°, 300°)                                                   [good]
 76, 71, 62.6  three bowstrings on the foot                                                [good]
 56–14  foot frieze (r 85 → 89)                                                            [good]
 14–0   plain base band, r 89 at the foot                                                  [good]
```

### b.5 Sculpted parts

- **Shoulder heads** (photo-28 two near profile, photo-26 one head-on): lie down the shoulder slope from the neck and
  run out into a long snout that overhangs the belly top, the tip ≈ 180 mm from the axis (≈ 35 mm past the belly),
  turned up a little like a prow; the root is ≈ 40 mm deep and ≈ 40 mm wide, the snout end ≈ 24 mm wide × 24 mm
  tall (photo-26), pale and worn; on top near the neck a raised horn plate on each side, incised with a squared
  spiral; a bead eye behind the snout. **[good]** reach and outline, **[est]** cross-section and the eye.
- **Shoulder flanges** (two side-on in photo-26, one end-on in photo-28): slabs ≈ 11 mm thick on the outer part of
  the slope, top ≈ 230 mm, the outer edge dropping past the collar to a small hook tucked against the rolled belly
  top. **[est]** (photo-26 suggests they reach further in toward the neck than modelled; photo-28 shows a short block)
- **Openings**: in photo-26 the two seen at ±60° read as ragged holes ≈ 11 × 6 mm (foreshortened); photo-28 shows a
  solid black patch exactly where the 60° opening falls — the owner's blackout of a bystander, very likely seen
  THROUGH that opening. The cross shape is the brief's / typological; the photographs do not resolve it. **[guess]**
  shape, **[good]** positions.

### b.6 Flanges

- Belly, six (y ≈ 104–174): ≈ 11 mm proud, ≈ 9.5 mm thick, T-notched every ≈ 11 mm (two columns of small square
  slots on the crest face, photo-26 front; ≈ 6 teeth side-on). **[good]**
- Foot, six (y ≈ 13–57): ≈ 8 mm proud, notched every ≈ 9 mm. **[good]**
- Shoulder: three slabs (b.5).

## c. Relief elements and heights

The idiom is **dense LINE décor** (Loehr III-ish): narrow sunk lines ≈ 0.7 mm wide at a ≈ 2.1 mm pitch between flat
lands, everywhere at one level; the parts of each mask are compartments drawn by one line and filled with parallel
lines and rounded squared spirals that follow their walls. Only the eyes and the circle-band discs rise. There is
**no separate leiwen ground** on the belly: the line work is the whole field. Read off the developed photographs
(`.work/r8-zun/dev/*.png`: panel mm from the mask-centre flange).

| element | where (developed mm from the flange) | size | height |
| ------- | ----- | ---- | ------ |
| large mask (under each head): nose column of five stacked hooks | x 5–14.6 | 10 mm wide | lines only |
| horn: a G-hook frame (inner leg, top, outer leg curling in) round a wide rounded spiral | x 17–60, y 38–53 | spiral 25 × 12 | lines |
| eye: smooth round boss in a plain socket outlined by one line, its lower outer corner sweeping into the jaw | centre (38.6, 26) | Ø 19.5 (socket 35 × 23) | boss ≈ 3.8 mm **[est]** |
| body band running out from the socket: two walls, two big rounded spirals, parallel lines | x 57–102, y 17–38 | | lines |
| crest comb (vertical strokes), claws (stroke groups), jaw spirals | above / below the body | | lines |
| small mask centred on each divider flange: socket and eye 28 mm from the divider, horn spiral, hooks | x 105–146 | eye Ø ≈ 12 | ≈ 2.6 mm **[est]** |
| upper circle band: domed discs with a small ring and a crescent, a disc over each flange, ≈ 32.6 mm pitch; crowded small hooks between | | Ø ≈ 14, band 16.5 | ≈ 1.4 mm |
| lower circle band: the same, offset half a pitch | | Ø ≈ 12.4, band 13.5 | ≈ 1.4 mm |
| foot frieze: one mask per 120° — eye Ø ≈ 12 at 26 mm, a row of G spirals along the top, long parallel body lines to the divider, hooks under | | | eye ≈ 2.6 mm |
| collar: small C-scrolls in boxes (photo-28 only) | | ≈ 8.5 mm units | lines |
| shoulder band: dim on photo-28 (oblique strokes, spirals): a kui facing each head, read only in outline | | | lines **[guess]** |

## d. Not visible / inferred

- The back (repeats the front by the three-fold mould division: assumed identical) · the interior, wall thickness,
  floor height (93 mm assumed) · the shoulder band's exact motif (dark on both photographs) · the cross shape of
  the openings · two of four studs.

## e. Where the sources disagree

- **Brief vs photographs — photo-29 / photo-30.** The brief calls them close-ups of this zun's décor. They are not:
  their mask band sits directly under a C-scroll collar with **no circle bands**, its centre is a **thin plain ridge**
  (this zun has broad notched flanges), and the bands run straight. They show a related vessel of the same style
  (a shoulder head with a squared-spiral horn over a C-scroll band, as here) — kept as **comparanda**, not traced.
  The photographs win.
- **Brief vs photographs — "thread relief … on a leiwen ground".** The belly has no separate ground: the line work
  fills the whole field, and it reads as narrow dark sunk lines between broader light lands, so it is modelled
  incised. The photographs win.
- **Brief vs photographs — mask count.** One taotie per 120° on the belly would put nothing at the dividers; photo-28
  (and photo-26 at ±118 mm) shows a smaller mask with Ø ≈ 12 mm eyes centred on each divider flange. The belly
  therefore alternates three large and three small masks; the foot has three only.
- **photo-26 vs photo-28 — shoulder flanges.** photo-26's side-on blocks seem to reach toward the neck; photo-28's
  end-on block is short and low. The model follows photo-28 (the more direct view).

## Fix pass r8 (after the blind review)

- **Décor re-traced** off photo-26 developed onto the belly panel (eyes at ±39.5 mm from the head flange, Ø 19.6; the
  development's own x is offset 8.3 mm, the midpoint of its two eyes) and photo-28's development for the small mask
  (eye lowered to 16.6 mm above the band foot, 31 mm from the divider). Drawn as seed lines — borders, the socket C, the
  wavy line under the eye, the slanting socket side, quills, spiral cores, comma rows — whose parallels at the 2.1 mm
  pitch fill the field (`src/artifacts/nezu-zun/echo.js`): no boxed compartments, no packer.
- **Circle bands**: flat discs with a raised rim, a ring and three crescents; between them single-thread hooks round a
  small ring (detail-circles.jpg).
- **Heads**: bulbous rounded-trapezoid section narrowing downward, the snout running down from the horns and turning
  up into a prow; the horns are coiled discs incised with a squared-round spiral, leaning out into a V.
- **Shoulder lugs** lowered to ≈ 7 mm over the slope; lip thinned (the flare runs to the edge, rim Ø ≈ 358 mm);
  foot flared ≈ 10 % to its base.
- **Rejected from the review, with evidence**: the trumpet is not ≈ 12 % short and the belly not an upright barrel —
  on compare-three-quarter the rim-to-shoulder / belly-width ratio is ≈ 0.47 on the photograph and ≈ 0.49 on the
  model, and photo-26 and photo-28 both show the belly band tapering toward the foot; the camera solve (§b.1) stands.
  The shoulder height also stands (photo-28 shows a sloping décor band about a third of the mask height tall).
