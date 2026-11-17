# Dossier — nezu-you (饕餮文卣, Nezu Museum 90086)

Ground truth: the project owner's two photographs, `photo-31.jpg` (head-on at the face that carries the bail's pivot
head, the bail seen edge-on) and `photo-32.jpg` (three-quarter from the front right, higher). `photo-47.jpg` is a
byte-identical copy of `photo-32.jpg`. Label: `card-33.jpg`. No outside source was consulted (none reachable).

Confidence tags: **[label]** read off the card · **[firm]** read directly and repeatably off a photograph ·
**[good]** measured through the fitted camera, ≈ ±5 % · **[est]** inferred or seen obliquely, ≈ ±10–15 % ·
**[guess]** typological default, not visible.

## Part names used in spec.json

| part | what it is |
| ---- | ---------- |
| `body` | foot, belly, neck as one lathe (ring foot with its plain flared base band and frieze, the pear-shaped belly, the straight neck) |
| `lid` | the lid shell: skirt with its frieze, the flaring eave, the domed top |
| `knob` | the mushroom knob: a grooved cap on a short stalk |
| `horns` | the two upturned prongs at the lid's ends (±X) |
| `heads` | the two animal heads at the bail's pivots (front and back neck centres) |
| `handles` | the bail strap |
| `flanges` | every flange: belly / neck / lid-skirt / foot at the ends (±X), belly and foot at the face centres, the lid's notched ridge flanges |

## a. Identity [label]

- 饕餮文卣 · *You with Taotie Design* · 中国・殷時代 / China, Shang dynasty, 12th–11th centuries BC · 青銅 / Bronze ·
  根津美術館 / Nezu Museum · 重要美術品 / Important Art Object · number on the card 90086 · exhibit 4.
- The label gives **no dimensions, no findspot and no inscription**. Everything else below is from the photographs.

## b. Form

### b.1 The cameras (fitted)

The model's silhouette was rendered through candidate cameras and overlaid on the photographs' outlines (an
automatic background mask, row-by-row half-widths, `.work/r8-you/rows.py`, `overlay.py`) until the outline rows
agreed. **photo-31:** azimuth 0, the phone ≈ 1 m away at about the lid's height (vertical fov ≈ 24°, ≈ 5.5° above
the target at y 195): the foot is seen ≈ 13–15° from above, the neck and lid skirt almost level. A narrow-lens
camera (fov 10°, 2.3 m) fitted the outline as well but put the friezes' décor 8–10 mm off their registers when
developed — the strong perspective of a close phone is what makes the foot ellipse deep while the eave's is shallow.
Outline rows now agree within ±1.5 mm (flange teeth aside). **photo-32:** azimuth ≈ +40° (front right), ≈ 15–18°
above, also close. **[good]**

### b.2 Scale (INFERRED)

The label has no size, the vitrine shows no object of known size, so the scale rests on the décor: the leiwen of the
belly ground measures **5.7 px per groove pitch** on photo-31 at the front plane; taking 1.2 mm (the middle of the
1.0–1.4 mm range for 20–40 cm Anyang vessels, research/01 §1.3) gives **4.75 px/mm** and, cross-checked by the eye
bosses (≈ 36 mm, usual for a you of this size), **H ≈ 389 mm to the top of the bail held upright, ≈ 347 mm to the
top of the knob, body width ≈ 248 mm**. Every mm figure below scales with that inference; the proportions do not.
Uncertainty ±15 %. **[est]**

### b.3 Plan: round, not oval

The brief expected an oval body. The photographs do not show one: at azimuth +40° (photo-32) the outline's
width at the belly is what a round plan gives (an oval 1.3 : 1 with the long axis across photo-31 came out 14 %
too narrow; Z/X = 1.0 fits within 3 %, 0.88 overshoots), and the positions of the pivot head, the eye boss and
the end flange in photo-32 are consistent with a round section to within the reading error. **Plan ratio
1.0 (measured 0.94–1.06).** The bail's pivots sit at the centres of the two faces carrying the masks (±Z), the lid's
horns and the long ridge flanges at ±X. **[good]** (`OVAL` in form.js; the kit's lathe now handles an oval correctly
if a better photograph ever shows one.)

### b.4 Vertical stack (true heights, mm, from the fitted camera)

```
 389  top of the bail (outer face), upright                    [good from photo-31; photo-32 suggests ≈ 15 mm lower — see e.]
 347  knob top (ribbed bud ≈ 27 Ø × 25, waisted stem ≈ 13 Ø)    [est: photo-32 only]
 312  lid apex (under the knob)                                [good]
 264–306  decorated lid dome (mask with ring-eyed bosses)       [good]
 257  eave edge (r ≈ 106), horns rise from the ends to ≈ 292   [good]
 216–243  lid skirt frieze (kui)                               [good]
 213  lid / mouth joint
 170–206  neck frieze (kui), r ≈ 94; pivot head centred at 190 [good]
 167  shoulder (belly top), rounded in from r ≈ 104
 57–161  belly mask register; widest r ≈ 124 at y ≈ 119        [good]
 52  foot neck under the belly's overhanging lower roll
 20–47  foot frieze, r ≈ 85                                    [good]
 0–19  plain flared base band, r ≈ 89                          [good]
```

### b.5 Sculpted parts

- **Bail** (photo-31, photo-32): a flat strap 27 mm wide, ≈ 7 mm thick, rising vertically from the pivot heads and
  arched over the lid; its outer face has raised rims and a sinuous dragon with spirals. The arch shape above the
  lid is read from photo-32 (round-topped). **[est]**
- **Pivot heads** (photo-31): ≈ 54 mm across, ≈ 46 mm tall, ≈ 25 mm proud; flat C-horns curling out and down, a
  lozenge on the brow, bulging eyes, a broad snout. **[good]** front; profile **[est]**.
- **Horns** (犄角) at the lid's ends: thick prongs rising from the eave, tips turning in at ≈ 292 mm, a small boss on
  the outer face (photo-32). **[good]** front, depth **[est]**.
- **Knob**: a ribbed bud, ≈ 6 wavy tiers (photo-32 only). **[est]**

### b.6 Flanges

- Ends (±X): belly 57–162 (big square blocks, ≈ 6 teeth, ≈ 8 mm proud), neck 170–208 (3 blocks), lid skirt 216–243
  (2 blocks), foot frieze (2 blocks). **[good]** (photo-31 outline)
- Face centres (±Z): belly below the pivot head (≈ 7 mm proud, notched every ≈ 11 mm), foot frieze. **[good]**
- Lid: a notched ridge flange from the eave to the knob along each end (±X), ≈ 10 mm tall falling to ≈ 8, ≈ 7 blocks.
  **[good]** (photo-31 outline, photo-32)

## c. Relief elements and heights (photo-31 raking light, photo-32)

| element | where | size | height |
| ------- | ----- | ---- | ------ |
| belly horn: a rounded-square G frame round a coiled curl block and an inner block, a deep dark slot under its top bar | 34–95 mm out, y 74–107 of the register | bands 7.5–9.6 mm | ≈ 3 mm (the proudest bands on the vessel) **[est]** |
| belly eye: round domed boss with a round hollow pupil, ringed by a sunk socket line | centre 46 mm out, 43 up | Ø ≈ 36.5 / pupil Ø ≈ 9 | ≈ 6 mm **[est]** |
| brow / jaw / body hooks: fat bands, contour line inside the edge | round the eye | 5–8 mm | ≈ 3 mm |
| outer field: a tall upright side kui with a small round eye, a lower hook (photo-32) | 125–180 mm out | 7–10 mm | ≈ 3 mm **[est]** |
| ground: square leiwen, ≈ 1.2 mm pitch, 5–10 mm cells | everywhere between | | sunk ≈ 0.4 mm |
| friezes (neck, skirt, foot): one long kui per half facing the centre — head with round eye, curled trunk, G-crest, fat body with quills, rolled tail | | bands 3–6.6 mm | 1.5–1.8 mm |
| lid dome: a mask with two pairs of ring-eyed round bosses and G-hooks | | bosses Ø 12–15 | 3.6–4.2 mm |
| strap: rims, sinuous dragon with spiral fill, curls in each bend, a small boss, a head at the crown | | 3–6 mm | ≈ 1.4 mm |

## d. Not visible / inferred

- The back face (repeats the front: the pivot head and the mask are certainly there; the details are assumed
  identical) · the ends (±X) between the flanges beyond ≈ 120 mm of arc (read obliquely off photo-32) · the
  underside, the interior, the wall thickness · the lid's underside and its fit · the knob from the front.
- The friezes' kui are read at ≈ 4.8 px/mm through a dark patina: their layout (head toward the centre, crest, quills,
  rolled tail) is clear, the exact small hooks are not. **[est]**

## e. Where the sources disagree

- **Brief vs photographs — plan:** the brief describes an oval section; the photographs fit a round one (b.3). The
  photographs win.
- **Brief vs photographs — "end" view:** photo-31 is not an end view; it is the face that carries the pivot head and
  the mask, with the bail seen edge-on. The model's `front` is that face.
- **photo-31 vs photo-32 — bail height:** with the bail upright, photo-31's strap reaches 389 mm (consistent with
  every other row of its outline). In photo-32 the crown sits only ≈ 18 mm above the knob, which would put it near
  365 mm: the bail is probably swung slightly toward the camera there (it pivots). The model shows it upright.

## f. Round r8-fix: what changed and why (photo-31 developed, photo-32)

The décor is now read off `faces/dev-*.jpg` — photo-31 developed onto each register's OWN panel (developed mm × arc mm),
both halves averaged — and kept as data in `trace/*.json` (right half, panel mm; `src/artifacts/nezu-you/decor.js`
renders them). Corrections to §b–§c, each from the photographs:

- **Centring.** The fitted camera puts every left-half element ≈ 9 mm further out than its right twin: the vessel's
  axis in photo-31 sits ≈ 4.5 mm (≈ 6 px) left of where the camera puts x = 0. Positions below are the average.
- **Belly eye:** centre 54.5 mm out (not 46), 43 up the register; boss Ø ≈ 36, pupil a plain pit Ø ≈ 6.5 (not a
  hollow in a crater). The reviewer's ± 55 mm is right; his Ø 33 is the boss without its socket ring (Ø ≈ 40).
- **Belly horn:** a G of three masses — a broad inner block (32–61 mm out) divided by a deep hooked channel, a top
  bar to 101 mm out with a deep slot under it, an outer column rolling in to a coiled island (70–92) — 72–113 up.
- **Curved bands** (brow, cheek arcs, lancets, jaw) are smooth curves (Catmull-Rom through the traced points).
- **Friezes:** one long generic kui per half was wrong: neck = fat G-curls with spiral ends over bodies with rolled
  tails (no quill row); skirt = squared G-hooks then a body ending in a big rolled curl (≈ 15 mm, x ≈ 60); foot =
  six dense ≈ 18 mm units (G-curl, hooked jaw, quill) per half, bands ≈ 4 mm.
- **Lid slope:** a big fat G rolling into a deep spiral beside the strap (centre ≈ 31 mm out), ONE ring-eyed boss at
  ≈ 79 mm (the "inner boss" of §c was the G's spiral hole), a spiral hook run out to the ridge flange, hooks above.
- **Pivot head:** two big domed C-horn lobes (≈ 22 × 16 mm each, a slot inside), a trapezoid face plate, lozenge
  at y ≈ 184, eyes at y ≈ 178.5 (± 10.3 mm), snout ≈ 166; horn tops ≈ 204 (through the fitted camera, ≈ 5 px/mm).
- **Lid horns:** flat crescent BLADES in the XY plane, ≈ 9 mm thick front to back, one tip (≈ 124 mm out, 286 up),
  a concave inner edge, a boss on each face (photo-31 left horn, photo-32 right horn).
- **Knob:** taller (≈ 49 mm over the apex), widening upward to a rounded top ≈ 29 mm across, ≈ 7 wavy tiers.
- **Flanges:** big blocks cut by narrow full-depth slots (belly ends ≈ 5, neck 3, skirt 2, foot 2, lid ridges ≈ 4–5),
  no incised T on the faces; the face-centre strip narrower (5 mm) with small slits.
- **Strap:** the lower dragon's body ≈ 8–9 mm, plain-topped, swinging once across, a tail rolled low on the left; a
  leaf-shaped head under the boss at ≈ 110 mm along the strap (y ≈ 310); the ground there is ROUND spirals.

## g. Round you-form: the knob, the pivot heads, the outline (owner: "more mushroom", "heads need to protrude")

Read by blending the model's clay render on photo-32 through a REFITTED three-quarter camera and on photo-31 through
the front camera (`.work/you-form/`), so positions are compared in the photograph's own perspective.

- **Three-quarter camera refitted:** azimuth 37.5° (was 42°), elevation 9° (was 16°), fov and distance unchanged (the
  landmarks — foot rim low point and limbs, eye boss, register lines on the facing meridian, horn tips — cannot separate
  distance from lens). At 42°/16° the foot ellipse and register curvature were too deep and the left pivot head
  landed ≈ 60 px low. `detail-lid` moved with it (37.5° / 9°). `front` (0°, 5.5°) was confirmed (rms ≈ 7 px on the
  outline landmarks, elevation 3–8° all equivalent) and left alone.
- **Knob: a mushroom**, not a bud. Cap Ø ≈ 37, stalk Ø ≈ 22 (cap ≈ 0.18 of the lid, stalk ≈ 0.6 of the cap), cap ≈ 23 mm tall, widest
  ≈ 18.5 mm below the crown, under-cut back to the stalk over ≈ 4 mm (≈ 7 mm overhang all round); the stalk shows only
  ≈ 10 mm above the lid; broad round crown. Grooves: one helical wavy groove, pitch 3.3 mm, ≈ 8 turns visible from
  the rim to the crown, 1.5 mm deep. Top at 343 mm (was 358). **[good]** from photo-32 only (photo-31 hides it).
- **Pivot heads: a ram head in the round.** The face plane stands ≈ 30 mm proud of the neck wall, the muzzle ≈ 35
  (was ≈ 16 / 18 — behind the strap's outer face); the head is 10–14 mm in front of the strap face and masks its end.
  47 × 35 mm (horn tops 205 → snout 171), C-horns now spiral tubes in the round with a slot in each curl, brow ridge,
  lozenge 185.5, bulging eyes 181 at ± 10.3, a projecting muzzle with nostrils and a mouth slit. How the strap meets
  the body is NOT visible in either photograph (the head covers it); the strap simply runs into the skull. **[good]**
  front / projection **[est]** (photo-32 is ≈ 50° off the head's axis).
- **Outline:** lower belly ≈ 5–6 mm slimmer per side (widest r ≈ 119 instead of 124), shoulder a straight slope from
  y ≈ 124 into the neck; both overlays now sit on the bronze's outline within a few mm. The belly décor panel is
  pinned at its old size (384.86 × 122.71 mm, `DECOR_SIZE` in form.js) and laid 1:1, so it overruns the slimmer
  register by ≈ 10 mm per side under the end flanges and ≈ 3 % in height — to be resolved when the décor is redrawn.
- **Lid horns:** pulled ≈ 5.5 mm in and their tips ≈ 3 mm lower (both tips stood outside the bronze's in photo-31).
- **Not changed:** the lid's top (the overlay of photo-31 puts its ridge flanges on the bronze's within ≈ 2 mm, so
  the "lower cone" note is not borne out by the photographs at this camera; changing it would also resize the lid
  décor panel).
