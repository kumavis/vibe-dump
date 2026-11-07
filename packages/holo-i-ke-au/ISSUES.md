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
- **Status:** published in version 16; the opening shot shows Prologue I's
  card with the clock in millions of years and Back disabled.

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
- **Status:** published in version 16; Clark re-shot, the mass runs over
  Lānaʻi's two fields.

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
- **Cause:** the sea shader gave every patched reef texel its own look, grey
  coral heads at a screen-fixed size over near-white sand, while the natural
  reef beside it is drawn by its depth alone; the fills were lowered to a
  flat −1 m where the reef round them lies at −2.5 to −4 m; two soft mask
  edges meeting left a rim of land (the ring round Quarantine Island); the
  pier slips, the Esplanade, the Keʻehi fills and the harbour-mouth spit had
  no patch at all.
- **Fix:** the restored flat is drawn as the reef beside it; lowered ground
  goes to the reef round it; six new works (the Esplanade to 1856, the
  harbour piers to 1896, the reef piers to 1900, Keʻehi's fills to 1944,
  Quarantine Island to a cay to 1869, the harbour-mouth fills to 1900) and
  the Kalihi entrance kept open at its surveyed width, from Malden's plan of
  1825, the 1881 and 1927 sheets. DATA.md "Patches" carries the extensions;
  RESEARCH.md §19 the record.
- **Status:** landed on the branch; the after shots at 1850–2000 (the works
  arriving on their dates) still to be looked at.

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

### 7. Towns from the late 1800s on should follow their real streets

- **Reported:** "late 1800s and onward Honolulu and other population centers
  would benefit from knowing the actual road layouts at those times and
  placing buildings around there."
- **Seen:** the settlements lay lots on a modelled grid aligned to the shore
  (features/settlements.js); no town's streets are surveyed ones except the
  Pali road of 1898 among the works.
- **Open:** dated street networks for Honolulu and the other centres (Hilo,
  Lahaina, Wailuku, Kailua-Kona, Līhuʻe …) from the surveys and maps of each
  period, and lots laid along them where they are known.

### 8. More of the historic buildings, the palace first

- **Reported:** "also more historical buildings like the palace in honolulu."
- **Seen:** only the church of 1842 and the clock tower of 1926 are named
  landmarks; everything else is modelled placement.
- **Fix:** `public/data/landmarks.json` (DATA.md "Landmarks, dated"), 18
  named buildings at their footprints with their dates: Hale Aliʻi 1845–79,
  ʻIolani Palace 1882, Aliʻiōlani Hale 1874, Kawaiahaʻo 1842, the Mission
  Houses, Washington Place 1846, St. Andrew's 1902, the Kamehameha statue
  1883, the Barracks at their 1965 site, Honolulu Hale 1929, the Post Office
  1871, Aloha Tower 1926, the Hawaiʻi Theatre 1922, Hawaiian Hall 1898, the
  Moana 1901, the Royal Hawaiian 1927; drawn by `features/landmarks.js` with
  a kit per type, the lots keeping off their ground.
- **Not yet placed:** the Fort, the courthouse of 1852, Kaumakapili, the
  Hawaiian Hotel of 1872, the railway terminal, the Seamen's Bethel, the
  Customs House (no outline or dates read); St. Andrew's only from 1902.
- **Status:** landed on the branch.

### 9. Doubly placed and overlapping buildings read as dotted

- **Reported:** "i also notice theres a lot of doubly placed and overlapping
  buildings which result in the building being dotted out."
- **Cause:** buildings caught mid-fade. A lot changing kind between two
  years swapped its building at a moment of its own, the outgoing and the
  incoming dithered over complementary pixels for about a year, so a view at
  rest caught many lots mid-swap; kauhale yards and their lots changed at
  different moments; the island's town handed over to the district's by the
  same dither; and 67 works blocks boxed too loosely reached over their
  neighbours.
- **Fix:** every lot changes at a half-year, the outgoing building gone
  before the incoming comes; buildings ease to the rounded year the label
  reads; the island/district handover is a switch; works blocks are boxed
  tight and pulled apart. `features/footprints.js` counts what is drawn, and
  a smoke check fails on any ground carrying two buildings at once. Measured
  at Honolulu: 71, 109 and 99 part-faded buildings in 1853, 1896 and 1930
  before, none after.
- **Status:** landed on the branch.

### 10. Too many high-rises in Honolulu in 1978

- **Reported:** "i think there are too many high rises in 1978 honolulu".
- **Seen:** towers come from today's zoning classes from 1960 on, scaled by
  density and value, not from the record of when the towers rose.
- **Open:** a dated count of Honolulu's high-rises by area (Waikīkī, downtown,
  Makiki–Punchbowl, Salt Lake, Kakaʻako) and a ramp that follows it.

### 11. The schools, at the times they existed

- **Reported:** "since students may look at this, lets try to get all the
  schools in at the various times they existed".
- **Open:** every school as a dated, placed landmark: the public schools of
  today with their opening years, the private and mission schools from
  Lahainaluna (1831) on, the government schools of the kingdom and the
  territory where their places are known, with sources.

### 12. Scrubbing the prologue's clock does not move the land

- **Reported:** "using the timeline to navigate in the prologue does not
  update the land forms".
- **Cause:** a step shows its stage held at its age (the geology's keys,
  `from` and `to` the same); the pair of stages drawn kept returning the held
  one whatever the clock said, and only a tour move or leaving the prologue
  cleared it. The slider's scrub reached the clock; the land never followed.
- **Fix:** the held stage lets go as soon as the clock is scrubbed off its
  age, and the stages either side of the age are drawn, crossfading as they
  do when wandering (`render/geology.js pairAt`). A smoke check scrubs the
  slider itself.
- **Status:** fixed; to be published.
