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
- **Cause:** the era draws the 1778 keyframe whole, and that keyframe's bake
  gave every habitable texel a floor weighted by rain, which carried a third
  of Kauaʻi's people evenly over the wet Līhuʻe–Kapaʻa plateau, and gave
  Niʻihau King's ten thousand, a figure he made from the length of its coast
  rather than a count (the 1832 census found 1,047).
- **Fix so far:** the floor fades inland from the sea, the shore weighs
  twice what it did, agroforestry counts at half, and Niʻihau is back-cast
  from the 1832 census as Kahoʻolawe already was. Land over 10 people per
  km² falls from 79% to 46% of Kauaʻi and from 98% to 44% of Niʻihau, whose
  people now sit in a ring along the shore. The same rule runs on every
  island. Sources in `methods.contact.settlement` and RESEARCH.md §9.
- **Then:** Kauaʻi's 1778 people are shared by its ahupuaʻa in the
  proportions of the 1835–36 counts (Ke Kumu Hawaii, Thrum), the rule
  placing people within each; the years before 1450 thin by Dye's population
  curve (1994, after Dye and Komori 1992: about 20,000 people in 1150,
  tenfold growth to a maximum by 1450, an equilibrium to 1778), so 1480 holds
  the whole of 1778 on the long chronology, with Kirch's short chronology
  recorded as wanted. The short orange dashes on Niʻihau at the close zoom
  are the ground drawing, not houses.
- **Status:** landed on the branch.

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
- **Status:** landed; shots at 1480, 1850, 1900, 1950 and 2000 show the
  natural shore until the first basin by 1900, and the piers, Sand Island
  and Keʻehi's runways in place by 1950. The Kalihi entrance crosses the
  flat as a fairly straight channel, as the 1881 trace has it.

### 5. Scars of H-1 and H-3 in the early eras

- **Reported:** "there's also scars from the removal of H1 and H3".
- **Seen:** today's terrain carries the freeways' cuts and embankments at
  every date; the works feature removes the road surface before its date but
  not the ground it was cut into.
- **Fix:** a new patch kind, `restore` (DATA.md "Patches", "Accepted
  extensions (restore)"): an RGB image over a box of a pack's texels carrying
  the change from today's height and a weight, applied before the road's
  date, kept in its own atlas apart from the 32 island patch slots. Baked by
  `tools/bake-roads.mjs` from the works' highway lines: the disturbed width
  found from the ground's curvature either side of the road, the surface a
  thin plate held to the undisturbed ground (a membrane where the plate
  would sag), tunnels left alone, the sea and the harbour patches kept off.
  65 patches on the Oʻahu, Nuʻuanu and Koʻolaupoko packs for H-1, H-2, H-3,
  the Pali, Likelike, Kahekili, Kailua, Kamehameha, Kalanianaʻole,
  Farrington and Nimitz highways and the Pali road of 1898, each ending at
  its section's building or opening date in the works.
- **Known looks:** the Moanalua Freeway is not in the works, so its cuts stay;
  a second carriageway or a ramp beyond the works' single line leaves a
  faint line (the Pali Highway, H-1 below Puʻowaina); H-3 is mostly viaduct,
  which the bare-earth terrain never carried, so its corridor changes little.
- **Status:** landed on the branch.

### 6. The Kailua pond walls in 1690–1730 look wrong, and may not belong

- **Reported:** "kailua ponds in 1690–1730 have bugged looking walls. Not
  sure if these would even historically have walls".
- **Seen:** a stacked-stone wall ran round the whole site outline of every
  fishpond whatever its kind, stepping with the ground; at Kaʻelepulu the
  outline ran up the ridge to the west, and the district cut the hillside
  down to the pond's water level, a stepped cliff that read as a sawtooth
  wall; both ponds' floors were drawn as the sea's sand and reef, a pale
  flat under a hand's depth of water.
- **Record:** both were loko wai, inland fresh-water ponds behind the
  Kailua sand barrier with natural banks and no seawall (Kikuchi 1973, C23
  and C67: Type III; Cobb 1905, "dirt sides generally"; Drigot 1982 after
  Summers 1964), the one built wall a dividing wall with a mākāhā between
  the two whose place no opened source gives.
- **Fix:** only a loko kuapā is walled (`pond` set to `kuapa`, `puuone`
  or `wai` in the district data; a pond without the field counts as kuapā);
  a pond's floor is dark silt; Kaʻelepulu's outline is clipped to the ground
  at or below 6 m; the c. 1700 Kawainui stop no longer says "low stone
  wall". Heʻeia keeps its wall. Sources in sources.json, RESEARCH.md §13.
- **Open:** where the dividing wall stood; Kawainui's outline is the
  marsh's 277 ha against the 400–450 acres the sources give the pond;
  Kikuchi's types for the Kāneʻohe and Mōkapu ponds (Kaluapuhi a puʻuone)
  not yet applied.
- **Status:** landed on the branch.

### 7. Towns from the late 1800s on should follow their real streets

- **Reported:** "late 1800s and onward Honolulu and other population centers
  would benefit from knowing the actual road layouts at those times and
  placing buildings around there."
- **Seen:** the settlements lay lots on a modelled grid aligned to the shore
  (features/settlements.js); no town's streets are surveyed ones except the
  Pali road of 1898 among the works.
- **Fix:** `public/data/streets/` (DATA.md "Streets, dated"): today's
  street centrelines from the counties' layers, cut to twelve towns
  (Honolulu, Kailua, Kāneʻohe, Hilo, Kailua-Kona, Lahaina, Wailuku–Kahului,
  Kaunakakai, Līhuʻe, Kōloa, Hanapēpē, Waimea), each street dated "by" the
  oldest georeferenced sheet that draws it (the 1881 and 1899 survey sheets,
  Donn's 1901–03 island maps, Dodge's 1897 Molokaʻi, the 1910–27, 1938, 1943
  and 1963 quadrangles, the sheets of about 2000), 9,899 segments; the
  settlements lay their lots along a town's streets from a street's year and
  the modelled grid gives way within 85 m of one; the streets themselves are
  drawn as packed earth, macadam, then asphalt.
- **Limits:** the 1881–1903 island maps are about 1:60,000, so few streets
  are found on them and a town before about 1910–27 is mostly still on the
  modelled grid; the about-2000 sheets find 56–80% of today's streets, the
  rest dated by the layer's own year; no sheet between 1943 and 2000 on
  Oʻahu; hillside contours give a few false finds; no closed street has a
  `to` year yet (the Sanborn maps and the registered Honolulu surveys are
  recorded as wanted).
- **Status:** landed on the branch; the settlements' real-data checks on the
  merged build still to pass.

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
- **Fix:** `public/data/towers.json` (DATA.md "Towers, dated"): twelve areas,
  each with today's count of towers of ten storeys or 30 m from the City's
  building footprints with lidar heights (OpenStreetMap on the neighbour
  islands) and the share standing by each year from the Census Bureau's
  year-built tables, averaged with the Council on Tall Buildings' completion
  years where it dates enough of an area; nothing before 1955. A year raises
  towers on the best-ranked lots up to the record's share, never past its
  count, in the district and tile by tile on the islands. In 1978 Honolulu's
  core drew 387 towers against a record of 253; it now draws 130, Waikīkī
  well ahead of Kakaʻako, and Kona, Kīhei and Kahului none.
- **Known looks:** Waikīkī and Makiki draw below the record because the model
  has fewer lots that can carry a tower than the record has towers; the
  survey counts homes, not hotels or offices; the area outlines are drawn by
  hand.
- **Status:** landed on the branch.

### 11. The schools, at the times they existed

- **Reported:** "since students may look at this, lets try to get all the
  schools in at the various times they existed".
- **Fix:** `public/data/schools.json` (DATA.md "Schools, dated"), 409
  placements on six islands (258 public, 101 private, 34 charter, 8 colleges,
  7 university campuses, 1 mission), 263 on their mapped grounds, 10 closed
  or moved (the Chiefs' Children's School 1839–50, St. Louis at Kamakela,
  Kamehameha at Kalihi 1887–1931, Maui High at Hāmākuapoko …), drawn by a
  renderer of their own on every island in the kit of each era: a
  schoolhouse, a mission hall, the territory's block, the campus. Dates from
  the Department of Education's school reports, the State's school layers,
  the schools' own histories.
- **Then:** 59 of the 161 dated by year from the schools' own pages, the
  Charter School Commission's report and the articles read; the kingdom's
  government, select and aided schools of the Board of Education's 1882
  report (62) dated by it but not placed, since the report gives each a
  village and the open maps mark no schoolhouses; the Fort Street English
  Day School at Keōua Hale (1869–1906) and McKinley at its three sites newly
  placed. Now 411 placed, 78 dated but not placed, 102 still dated only by a
  first record.
- **Open:** the 102 still stand only from 1999, 2021 or 2024; the 1882
  schools' sites (the registered maps of the 1880s) and closing years (the
  later reports); six schools dated from their move to their present site.
- **Status:** landed on the branch.

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
