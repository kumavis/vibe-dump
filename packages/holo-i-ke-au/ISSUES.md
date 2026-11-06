# Issues — what was seen, what it came from, what was done

A running record of problems seen in the app, by whoever looks: reported as
they were put, with what the shots showed, the cause where it is known, and
the fix or the open question. Newest at the bottom; an item stays until its
fix has landed in `dist/` and been looked at again.

## 2026-11-06

### 1. The app opens on chapter 1; nothing points to the prologue

- **Reported:** "how to get to the prologue? starts on chapter 1".
- **Seen:** the prologue was reachable only by Back from chapter 1's card or
  `,` five times; no link, no line in the help.
- **Fix:** the tour opens on Prologue I where the data has a geology
  (`ui/tour.js begin()`); the help names the prologue; DESIGN.md §13.
- **Status:** landed; to be looked at in the published build.

### 2. The Clark avalanche slide draws a white screen

- **Reported:** "The Clark avalanche slide the screen is just white".
- **Seen:** Prologue III step 3; the step's view without its slide draws
  (Lānaʻi, the two Clark fields lit); every frame with the slide running is
  white. Wailau, the step before, runs cleanly.
- **Cause:** the Clark fields have no scar polygon, and the slide's axis fell
  back to a tour place by the volcano's id, which does not exist, so the
  axis ran from the field's centre to itself: zero length and width, and the
  shader divided by both.
- **Fix:** the axis runs from the volcano's summit (`volcanoes.json`) where a
  field has no scar, from the centre toward the farthest edge where it has
  neither; length and width never under a world unit; the shader's divisions
  guarded. DESIGN.md §13 says what a field without a scar runs.
- **Status:** landed; Clark re-shot.

### 3. Diffuse housing on Kauaʻi and Niʻihau in Māʻilikūkahi's era

- **Reported:** "in Māʻilikūkahi 1410–1550, there's a lot of diffuse housing
  on Kauaʻi and on Niʻihau. Do these population areas make sense?"
- **Seen (1480, land view):** settlement dots spread over the whole south
  and east lowlands of Kauaʻi, the Kōloa–Līhuʻe plain included, with little
  weight on the valleys; Niʻihau needs a closer shot.
- **Open:** whether the settlement keyframe for the era puts people where the
  record does (the windward and southern valleys, the shore), and what
  Niʻihau should carry.

### 4. Modern harbour works show around Honolulu before contact

- **Reported:** "around Honolulu there appears a lot of artificial ports and
  piers and dredged coral, which doesn't seem right".
- **Seen (1480, 6 km and 3 km):** the patches do take the harbour, Keʻehi,
  Sand Island and the reef runway back to reef flat, but the restored flat is
  drawn as a mottled white-and-grey surface that reads as dredged coral; the
  harbour's pier slips remain as finger inlets in the shore; a rectangular
  fill at Keʻehi and a small round islet are left standing; the runway and
  channel edges still show faintly through the mottling.
- **Open:** the pre-contact shore and reef flat of Kou–Kalihi–Keʻehi as the
  early surveys draw them; the reef flat drawn as the natural one beside it.

### 5. Scars of H-1 and H-3 in the early eras

- **Reported:** "there's also scars from the removal of H1 and H3".
- **Seen:** today's terrain carries the freeways' cuts and embankments at
  every date; the works feature removes the road surface before its date but
  not the ground it was cut into.
- **Open:** dated terrain patches that restore the ground across the
  corridors (an interpolated surface, not a flat), on the Oʻahu pack and the
  district packs; the Pali, Likelike, H-2 and Moanalua corridors likely the
  same.

### 6. The Kailua pond walls in 1690–1730 look wrong, and may not belong

- **Reported:** "kailua ponds in 1690–1730 have bugged looking walls. Not
  sure if these would even historically have walls".
- **Open:** what the pond-wall feature draws at Kawainui and Kaʻelepulu in
  the Koʻolaupoko district in those years, and what the record says each
  pond was: a kuapā of stone, an earthen bank, or an open lagoon.
