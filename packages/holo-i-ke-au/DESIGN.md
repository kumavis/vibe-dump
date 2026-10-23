# Holo i ke Au: design notes

*Holo i ke au*: sail on the current, into the era. Pukui and Elbert give **au** as
both *a period of time, age, era, epoch* and *current; to flow, as a current; to
drift*. Time and flow are one word, and the title rides it.

This is the working design for a new vibe that grows out of
[`ahupuaʻa`](../ahupuaa/): the same mountain-to-sea diorama, but on the real
islands and across real time, with real events in real places. It was written in
October 2026 from three rounds of brainstorming, before any code. Everything
here is a plan, not a record of what was built. Where a fact is quoted it is
marked as checked or as *verify*; nothing in it should be treated as sourced
until the gazetteer (§6) carries the citation.

---

## 1. What it is

One continuous world: the eight main islands from real terrain, with a time
axis from Polynesian settlement to the annexation of 1898, and a thin coda to
the present. The same event should be legible at every zoom. Zoomed out, you
see which chiefdom holds which district, where the land is cultivated, where
people live. Zoomed in, you stand in a valley in a given year the way the
ahupuaʻa app lets you stand in one around 1700.

The example that drives the design is the battle of Nuʻuanu in 1795 (§8). It
should read as a fleet crossing on the archipelago view, as a landing and a
march on the island view, and as a line of advance up one valley at ground
level.

Why Hawaiʻi suits this: the scale and the isolation. The whole polity fits in
one frame, roughly 600 km from Niʻihau to Kaʻū, and the land is under a tenth of
that box. Everything that ever arrived, the voyagers from the south and Cook
from the east, came in across the ocean from off the map.

### What it is not

- **Not a site map.** It never publishes exact coordinates of burials or of
  sacred sites that are not already public landmarks (§7.4).
- **Not a year-by-year simulation.** Time is keyframed eras with interpolation,
  plus the specific moments that events need (§5.5).
- **Not a game.** No agency over outcomes; a diorama you move through, in space
  and in time, with sourced cards.
- **Not a replacement for `ahupuaʻa`.** That app stays as the composite island.
  This one forks from it (§4).

---

## 2. The thesis: two continuous axes

Zoom and time are both continuous, and they trade against each other.

- **Time is cheap zoomed out.** At archipelago scale an era is a set of coloured
  districts, a cultivation mask, a settlement density, some routes and some
  pins. No new trees, no new houses.
- **Time is expensive zoomed in.** Every era at ground level is its own asset
  set (hale, then churches, mills, ships) and its own land (forest line, loʻi in
  use or abandoned, fishponds silted, shoreline filled).

So **depth of time shrinks as you zoom in**: the full timeline at archipelago
scale; a few keyframe eras per island; one era deep per close-up district, which
is exactly what the ahupuaʻa app already does, plus the specific years that
events need.

**Views are overlays that fade with zoom, not separate scenes.** The ahupuaʻa app
has this in miniature: each tour stop sets overlay weights, and the moku and
land-zone colours are baked textures (`ZONE_COLORS`, `MOKU_COLORS`, the `region`
map). Generalized, each overlay declares the zoom range and the era range in
which it makes sense, and the UI shows what is available at the current zoom and
year.

| overlay | zoom | time |
| --- | --- | --- |
| chiefdom / kingdom coverage, by moku | far | all eras |
| cultivation (loʻi, field systems, fishponds in use) | far, mid | all eras |
| settlement and population | far, mid | all eras |
| forest extent | far, mid | all eras |
| moku and ahupuaʻa lines | mid, near | all eras (lines barely move) |
| voyaging and fleet routes, ship tracks | far | only the step the tour is on: that event's routes and nothing on a chapter card; the routes toggle overrides to every route of the year |
| battle lines and movements | near | one event |
| the diorama itself: terrain, vegetation, structures, people, weather | near | the keyframe nearest the chosen year |

---

## 3. Scope

### 3.1 The span

Settlement of Hawaiʻi is now dated to roughly 1000 to 1300 CE: the two
radiocarbon schools give about 940–1130 and about 1190–1290 (RESEARCH.md §3
has the papers), so the whole span is eight or nine centuries. Eras are keyframes, not a slider of
years. For the pre-contact centuries, index time by reigns, not years: the dates
are genealogical estimates anyway, and "in the time of ʻUmi, about 1600" is both
more honest and more Hawaiian than a bare number.

| era | what the land looks like | what happens (examples, to be sourced) |
| --- | --- | --- |
| c. 1000–1400 settlement | voyaging; coastal settlements; windward valley loʻi begin | arrivals from the south; Pāʻao, Moʻikeha; long-distance voyaging ends |
| c. 1400–1778 the chiefdoms | field systems spread on the leeward sides; fishponds; luakini; population rises to a plateau | Māʻilikūkahi, ʻUmi, Piʻilani; the Maui and Hawaiʻi wars; coral-dated heiau on Maui |
| 1778–1819 contact and unification | first cattle and goats; sandalwood cutting begins | Cook at Kealakekua; Mokuʻōhai; 1790 Keanakākoʻi; Kalauao 1794; Nuʻuanu 1795; Kauaʻi by cession 1810; Kuamoʻo 1819 |
| 1820–1893 the kingdom | missions, whaling ports, epidemics, the Māhele, sugar, ditches, rice in the loʻi, cattle on bare hills | Kaʻahumanu; 1843 restoration; Māhele 1848 and Kuleana Act 1850; Kalaupapa; Bayonet Constitution; overthrow |
| 1893–1898 | republic | annexation |
| coda, 1970–now | plantations closing; suburbs; restoration | Kalama Valley; Kahoʻolawe and Hōkūleʻa 1976; Waiāhole-Waikāne; 1978 convention; ʻOnipaʻa 1993; loʻi, fishpond and limu restoration |

### 3.2 Where it ends, and why

Two candidate end points were weighed: contact (1778) and annexation (1898).

- **1778 ends the world the app already draws.** Nothing is written before it
  and everything after, so the record changes character there. Ending at contact
  needs no new asset set. It also leaves the ahupuaʻa intact, which is a happy
  ending the history does not have.
- **1898 ends the ahupuaʻa as a system.** The Māhele of 1848 and the Kuleana Act
  of 1850 dismantle it legally. Depopulation empties it. Sugar and the ditches
  re-plumb it. If the project is about land from mountain to sea, the thing being
  shown stops around 1850 and annexation is the formal close.

**Decision: settlement to 1898, with a thin coda.** The contact-to-annexation
century is the densest, best dated and best documented, so it is the easiest to
research and the hardest to draw. The way through is to draw it mostly zoomed
out: pins, boundaries, villages going dark, the forest line retreating, with a
few close-ups where the land itself changed (Honolulu, Lahaina, Kalaupapa).

**Depopulation is the spine of that century** and has to be shown, because it is
why the loʻi are empty. Estimates at contact run from about 200,000 to a
million and are contested; the 1890 census counted about 34,000 Hawaiians and
a further 6,000 part-Hawaiians (sources in RESEARCH.md and in the
`depopulation` event's tellings). It is heavy, and the zoomed-out view can
carry it honestly as settlement fading.

**The coda is nearly free and gives the arc an ending.** At archipelago scale the
Hawaiian Renaissance is a handful of pins. Restoration brings the camera back
down to one ahupuaʻa, which is where the ahupuaʻa app began. The coda is the only
era whose people can be asked, which makes it the easiest to research and the
most delicate to depict.

### 3.3 The scales

| scale | extent | texels | ground per texel | what carries the picture |
| --- | --- | --- | --- | --- |
| archipelago | ~600 × 300 km | one 2048 tile | ~300 m | baked layers, lines, pins, routes; far ocean |
| island | 30–150 km | tiles | ~30 m | terrain shaders with real rain; aggregate marks for villages and loʻi |
| district / valley | 5–20 km | tiles from lidar where it exists | 2–10 m | the full diorama: vegetation, structures, people, weather |

For reference, the ahupuaʻa app is one 36 km square at 17.6 m per texel. Oʻahu
is about twice that width; Hawaiʻi Island is four times it and 4,200 m high.

### 3.4 Depth districts

Districts that get keyframes at ground level, in order:

1. **Nuʻuanu and Honolulu** (Kona, Oʻahu): the vertical slice (§8). One valley
   carries the full arc: loʻi and the village at Kou in 1795, the battle, the
   Royal Mausoleum (1865) and Queen Emma's summer house, the 1898 road cut, the
   highway.
2. **Koʻolaupoko** (Waimānalo, Kailua, Kāneʻohe, Heʻeia): the full arc with the
   coda in one place. A chiefly seat and dense fishponds before contact, Māhele
   parcels, rice, ranching, Hawaiian Homestead land from the 1920s, military on
   Mōkapu and at Bellows, suburbs, then restoration (Heʻeia's loʻi and fishpond
   and its estuarine reserve; the Waimānalo Limu Hui at Kaiona and the Pāhonu
   pond). Best lidar in the state.
3. **Kona and Kohala** (Hawaiʻi Island): the contact-era cluster. Kealakekua
   and Cook, Hōnaunau's puʻuhonua, the Kona field system, Puʻukoholā, Kuamoʻo.
   Everything the ahupuaʻa app draws is real here. Technically hardest: size,
   height above the trade inversion, lava, and only partial lidar.

---

## 4. What it borrows from `ahupuaʻa`

The monorepo rule is **no cross-package imports**, so this package *copies* what
it wants and then diverges. Provenance goes in the commit message.

| take as is, or nearly | replace | drop |
| --- | --- | --- |
| `render/` terrain shaders, ocean, sky, clouds, shadow, pipeline, camera rig | `gen/shape`, `gen/erode`, `gen/finalize`: terrain comes from DEMs via an offline bake (§5.1) | the seed and the single 36 km square (`config.js`) |
| `weather/sim.js` | `gen/division`: moku and ahupuaʻa come from the State GIS layer | the boot-time generator worker (the new app loads baked data) |
| `features/` vegetation species kit, structures kit, life figures, streams, waterfalls | `gen/sites`: sites come from a sourced gazetteer, not inferred from the land | |
| `ui/` cards, the tour mechanism, icons | `ui/views`: stops get real coordinates and a date, per event | |
| `src/fonts/` (ʻokina and kahakō safe) and `FONTS.md` | `ui/content.js`: the tour copy becomes many tours, one per event | |
| `tools/` shoot, smoke, preview | | |
| `FOREST.md` as the standard for research: sourced, adversarially checked, audited by a script | | |

The single most reusable *idea* is that a tour stop is already the event model:
text plus a camera, an overlay, an hour and a weather. An event here is a tour
with real coordinates and a date range, and its pin on the far view is the entry
point.

---

## 5. Architecture

### 5.1 Offline data pipeline

A by-hand `tools/bake` step, like `npm run thumbnails`: run locally, output
committed. Nothing is fetched at runtime (the repo prefers zero external
requests on Pages).

Inputs:

- **Terrain**: USGS 3DEP 1/3 arc-second (~10 m) seamless DEM for all islands;
  NOAA/USGS 2022–2023 lidar at 0.5 m for Oʻahu, Maui, Molokaʻi, Lānaʻi and
  Kahoʻolawe; the 2023 Big Island product covers only the east side; Kauaʻi lidar
  *unconfirmed*. Bathymetry for the near shore and the channels (NOAA).
- **Rain**: the Rainfall Atlas of Hawaiʻi (Giambelluca et al. 2013), 250 m grids.
  Replaces the ahupuaʻa app's climate model outright.
- **Boundaries**: the State GIS ahupuaʻa and moku layers (GeoJSON; the ahupuaʻa
  layer was updated in 2024 and had diacritics corrected by SHPD in 2017).
- **Land awards**: OHA's Kīpuka database and Hawaiʻi County's Land Commission
  Award polygons, for where the loʻi were in 1848.
- **Field systems**: published GIS of the leeward Kohala field system and
  lidar-visible walls elsewhere.
- **Historic maps**: the Hawaiian Government Survey (1870s–1900s) registered
  maps for 19th-century land use; early charts (Cook, Vancouver) for coastlines
  only.
- **Modern land cover** for the coda.

Outputs, per island: height tiles, normals, rain, land class, water routing,
boundary lines, and the per-era layer masks (§5.5). Plus one archipelago tile.

**Budget.** `dist/` is committed, so the git history pays for every byte. One
island at 1024 texels plus procedural fine detail is a few megabytes; eight
islands lazy-loaded on zoom land around 30 to 50 MB. GitHub release assets are
the fallback if lidar-grade districts push past that. Decide early (§11).

**Hybrid detail.** Real coarse shape, procedural fine detail: keep the ahupuaʻa
app's detail and erosion passes but constrain them to the DEM. A diorama may
stylize, and this keeps the look, but Diamond Head has to read as Diamond Head.

### 5.2 Terrain tiles

The ahupuaʻa renderer hands over LOD levels inside one 2048 heightmap. A
continuous zoom from archipelago to valley needs a **quadtree of streamed
tiles** with per-level resolution as in §3.3. Every shader that samples the land
textures (`uLand`, normals, the region map) has to sample the active tile set
instead. This is a known pattern and the single largest technical item.

- World units: the ahupuaʻa app uses 1 unit = 100 m. At 600 km that is 6,000
  units, which float precision handles; a floating origin keeps the valley-scale
  detail stable anyway.
- **The chain view is a diagonal.** The whole-chain framing turns the camera so
  the chain's long axis, Niʻihau to the southeast point of Hawaiʻi Island,
  runs along the screen's own diagonal, Niʻihau top left and Hawaiʻi Island
  bottom right, and fits the chain to that diagonal so the islands are as
  large as the frame allows, at any aspect ratio. A far step that leans
  toward an event's place keeps this orientation and only shifts and zooms.
- **Vertical exaggeration varies with zoom.** 1.3 is right in a valley. Over
  600 km a 4,200 m mountain is a bump of under one percent, so the far view wants
  *more* exaggeration, and the transition has to be smooth during the zoom.
- The lidar districts are tiles with real micro-relief (field walls, terraces,
  fishpond walls are all visible in 0.5 m lidar); elsewhere the fine level is
  procedural.

### 5.3 Overlays

As in §2. Each overlay is a texture or line set per era, blended by zoom weight
and by time weight between keyframes. The ahupuaʻa overlay machinery (`overlay`
weights per view, `MOKU_COLORS`) is the starting point.

### 5.4 Features budgeted by distance

Trees and people exist only near the camera. Mid zoom gets aggregate marks
(loʻi as a texture band, a village as a cluster, a fishpond as its wall). Far
zoom is the baked layers alone. The vegetation and life systems port nearly as
they are, gated by camera distance and by era.

**Settlements by era.** At the near zoom, buildings are placed from the
settlement layer's density for the chosen year (§5.5), not only from the
features file, and their kind follows the era: kauhale of thatched hale on
paepae before contact; thatch beside frame houses, adobe and coral block,
with churches, in the early kingdom; wood-frame houses, stores, masonry
blocks downtown, plantation camps and mills by the 1890s; bungalows and
plantation towns in the territory; towers and suburbs now. Density sets how
close and how large; the era sets what. Where the record gives a town's
extent (the 1881 and 1899 survey sheets for Honolulu) it bounds the placement.

### 5.5 Time: keyframed layers

Each era is a set of masks per island: polity of each moku, cultivation extent,
settlement points with a size, forest extent. Interpolate between keyframes;
hatch what is uncertain. Districts you go deep on get their own keyframes
(c. 1700, 1795, 1850, now for Nuʻuanu; c. 1700, 1850 and now for
Koʻolaupoko) and their own asset sets. Now is the present: the timeline runs
on past the coda's tick to this year, so a loʻi laid again in 2010 stands
at the end of it.

Archaeology gives the pre-contact layers as growth, not as a frozen state:
windward valley loʻi first, dryland field systems expanding after about 1400,
fishponds and luakini after that. Coral offerings dated by uranium-thorium give
calendar dates for heiau construction on Maui (*cite Kirch and Sharp*), so even
the pre-contact span has some hard pins.

**The real island is itself time dependent.** Lava flows of 1790, 1801, 1859,
1960, 1990 and 2018 changed the coast; Waikīkī and the Ala Wai, the Honolulu
waterfront and Pearl Harbor were dredged and filled; Hilo moved after two
tsunamis. The DEM is a 2023 snapshot and the pipeline needs per-era coastline
patches where it matters.

### 5.6 Events and tours

An event is a tour (§4) with a place, a time, a zoom range and a story. See §6
for the schema. The pin is the entry point on the far view; selecting it flies
the camera through the stops at whichever zooms the story needs, setting the
year as it goes.

**The whole app is one tour.** There is no play button: an automatic sweep of
the timeline gives the viewer nothing to look at. Instead a Next button (and
Back) advances to the next chapter and flies the camera to where it happened,
then waits. Chapters are the eras in order; within a chapter, Next steps
through the era's events by date, each at the zoom it asks for, and an event
with stops walks them. The slider stays for free exploration and leaves the
tour; Next resumes it from the nearest chapter. The sequence is built from the
data, never hard-coded, so adding an event adds a step.

**Pins cluster.** Many events share a place (ʻIolani Palace carries the
overthrow, the 1895 rising and ʻOnipaʻa at one point). Pins within a few
dozen screen pixels group into one marker with a count; hovering lists them,
clicking opens a list card; zooming in splits clusters whose places differ,
and identical places stay a list. The current tour step's pin is always drawn
on its own, except at a stop whose own people are drawn (§8), at whatever
zoom: there the scene is the subject and the card names the place, so the pin
and its label stand aside until the people fade, rather than cover the stand
at the pali or the head of the column at Kou.

### 5.7 Ocean

The ahupuaʻa swell-and-surf shader is near-field. The far field needs its own
treatment: the channels between islands are where fleets and canoes move, so the
ocean matters more here than in the current app.

### 5.8 Camera and boot

The camera rig (target, distance, yaw, pitch) extends naturally to a continuous
zoom; what changes is what streams in as distance shrinks. Boot gets faster, not
slower: the ahupuaʻa app spends its load generating an island in a worker, this
one loads baked data.

---

## 6. Data model

The gazetteer and the event list are the real product. Build them, with
citations, before any rendering; the archipelago view can be the first thing
that runs against them. Sketches, not final:

```jsonc
// an era keyframe
{ "id": "umi", "label": "in the time of ʻUmi", "year": 1600, "yearPrecision": 50,
  "layers": { "polity": "...", "cultivation": "...", "settlement": "...", "forest": "..." } }

// a place in the gazetteer
{ "id": "nuuanu", "name": "Nuʻuanu", "alt": ["Nuuanu"], "kind": "valley",
  "ahupuaa": "Honolulu", "moku": "Kona", "island": "Oʻahu",
  "geometry": { "type": "Polygon", "...": "..." }, "placePrecision": "exact|ahupuaa|moku|island",
  "sources": ["pukui-elbert-mookini-1974"] }

// an event
{ "id": "nuuanu-1795", "title": "Kaleleakaʻanae", "gloss": "the battle of Nuʻuanu",
  "when": { "from": "1795-04", "to": "1795-05", "precision": "month", "calendar": "ce" },
  "where": [{ "place": "waikiki", "role": "landing" }, { "place": "nuuanu", "role": "battle" }, { "place": "nuuanu-pali", "role": "end" }],
  "zoom": ["far", "island", "near"],
  "stops": [ /* text, camera, overlay, hour, weather, year: the ahupuaʻa STOPS shape */ ],
  "sources": [{ "id": "kamakau-ruling-chiefs", "pages": "..." }, { "id": "fornander-v2", "pages": "..." }],
  "confidence": { "date": "firm", "place": "firm", "numbers": "soft" },
  "tellings": [ /* where sources disagree, each telling with its source */ ] }
```

Rules the schema enforces:

- Every date has a precision; every place has a precision. Pre-contact dates are
  ranges attached to a reign.
- Every card cites. No source, no pin.
- Numbers (fleet sizes, armies, deaths) are shown as ranges across tellings, not
  as one figure.
- A place marked `placePrecision: ahupuaa` renders at the ahupuaʻa centroid with
  a soft radius, never as a point.

---

## 7. Sources and research

### 7.1 Open and digital

| what | where | notes |
| --- | --- | --- |
| terrain | USGS 3DEP 1/3 arc-second seamless; NOAA/USGS 2022–23 lidar DEMs | lidar: five islands at 0.5 m; Big Island east only; Kauaʻi unconfirmed |
| rainfall | Rainfall Atlas of Hawaiʻi, 250 m | free download |
| ahupuaʻa and moku boundaries | State GIS geoportal, GeoJSON and services | 2024 update; disclaimer: no legal boundaries |
| land awards, historic sites, place names | OHA Kīpuka database; Hawaiʻi County LCA layer | Kīpuka launched with ~5,000 awards and ~10,000 sites placed in GIS |
| Hawaiian-language newspapers | Papakilo database | ~53,000 records from 45+ papers; mostly untranslated |
| Māhele records, Boundary Commission testimony | Papakilo; AVA Konohiki | kamaʻāina describe ahupuaʻa boundaries place name by place name |
| Hawaiian Ethnological Notes | Papakilo | Pukui's translations of newspaper material, 1860s–1940 |
| Kamakau, *Ruling Chiefs of Hawaiʻi* | Ulukau (free, per Kamehameha Publishing; *verify*) | the main Hawaiian account of the chiefly era and the wars |
| Malo, Fornander, ʻĪʻī (Hawaiian originals), Pukui–Elbert dictionary, *Place Names of Hawaiʻi* | Ulukau / Wehewehe | |
| public-domain English accounts | HathiTrust, Internet Archive, eVols | Cook, Vancouver, Ellis, Dibble, Jarves, Bingham, Fornander, Thrum's *Annual*, Hawaiian Historical Society papers |
| early Bishop Museum Bulletins and site surveys | Biodiversity Heritage Library, eVols | Thrum, Stokes, McAllister (Oʻahu 1933), Bennett (Kauaʻi 1931), Emory (Lānaʻi 1924) |
| historic maps | Hawaiʻi State Archives; DAGS registered maps | Government Survey 1870s–1900s is the first accurate mapping |
| field-system GIS | Hawaiʻi Biocomplexity Project publications | leeward Kohala |

### 7.2 Not open

The syntheses that already did the work are print or paywalled: Kuykendall's
three volumes (De Gruyter; no open eVols copy found), Handy's *Native Planters*
(paid ebook), Kirch, Cordy, Sterling and Summers (*Sites of Oahu*),
Kameʻeleihiwa, Osorio, Silva, Beamer, ʻĪʻī's *Fragments*. Some surveys were never
published (Walker's Maui manuscript). Fishponds have no statewide dataset: a
2025 House bill proposed building one and states that none exists; the bill text
estimates about 488 ponds before contact and about 360 in a 1901 inventory.

### 7.3 Language

The richest record is in Hawaiian and mostly untranslated. Machine reading of
ʻōlelo Hawaiʻi is weak enough that it must not be the only reader; the HEN
translations are the shortcut, and a speaker should check anything that reaches
a card. Names carry the ʻokina and kahakō everywhere; the gallery slug drops
them, which is why `na-au` was rejected as a slug (it reads as *naʻau*).

### 7.4 What stays vague

- Burial sites are withheld under HRS §6E-43 and HAR §13-300; lineal descendants
  can have an inventory entry reduced to a parcel number. SHPD site records are
  not public.
- Many communities do not want precise heiau or burial coordinates published.
  This app never does. Pins render at ahupuaʻa precision unless the site is an
  established public landmark (Puʻukoholā, Puʻuhonua o Hōnaunau, ʻIolani Palace,
  Kūkaniloko).
- The Nuʻuanu pali dead are a burial matter (§8), not a spectacle.
- **The rule is practised, not announced.** No card, note, legend or panel
  says what the app does not show, place or draw. A stop that reaches the
  pali says, in the sources' plain words, that many died there, and stops.
  The reasoning lives here and in RESEARCH.md, not in the copy.

### 7.5 Workflow

What an AI assistant can do: mine the open corpora, GIS and public-domain texts;
build and cross-check the gazetteer; write the bake tools; draft cards with
citations. What needs people: the copyrighted syntheses (a library card), the
Hawaiian-language record (a reader), and every card that touches the sacred,
the dead or the living (a cultural practitioner). `FOREST.md` is the standard:
sourced research, an adversarial fact-check, and an audit script that checks
the built thing against the research. Real places raise the bar from plausible
to correct, and that standard is the price.

---

## 8. The vertical slice: Nuʻuanu, 1795

The campaign at three zooms, which is the thesis in one place:

- **Far.** The fleet leaves Hawaiʻi, gathers at Maui and Molokaʻi, lands on
  Oʻahu; Oʻahu changes colour. The pin before it is Kalauao (1794), where
  Kalanikūpule beat Kāʻeo with help from foreign ships. The pin after is the
  failed crossing to Kauaʻi (1796).
- **Island.** Landing between Waiʻalae and Waikīkī; the march through Kou, which
  is Honolulu; up the valley, with the Oʻahu forces drawn up above.
- **Valley.** Puʻiwa and Lāʻimi, Kamehameha's guns, Kaʻiana's death, the
  retreat to the pali and the notch. Honolulu in 1795 is a village at Kou with
  fishponds along the shore, and the valley floor is loʻi well past Lāʻimi.
  The sources read so far put Young and Davis at the guns at Kepaniwai in
  1790; who served the guns at Nuʻuanu is not established. The battle's name
  is spelled *Kalelekaʻanae* in the one source that gives it; a speaker should
  confirm.

| firm | soft |
| --- | --- |
| year and season; the place names; the general line of advance; the cannon; the ending at the pali | every number: fleet, army and the dead vary by a factor of two or more between tellings |
| the valley has 0.5 m lidar; 1880s survey maps still show the loʻi | exact positions of the lines are unknowable |
| | how many went over the pali, and whether any did: Fornander says so, Kamakau does not mention it. The story that the 1898 road cut turned up remains has so far been traced only to a travel guide; no newspaper of the time was reachable. |

**Sources.** Kamakau is the main Hawaiian account (read in the publisher's free
PDF; the Ulukau copy itself was not reachable from the build container).
Fornander's second volume is public domain. ʻĪʻī's *Fragments* is print only. There was no
European eyewitness; the ship journals of the following year are secondhand.

**Tone is the first decision.** The life system is built for work, not war.
The first render showed forces as drifting masses along their lines. The
owner's decision after seeing it: forces are **billboarded pixel-art
soldiers**, small crisp sprites of about 8 by 16 pixels scaled by whole
numbers so they never blur, animated, walking their lines and engaging at
the fronts, the two sides told apart by palette and dress. A later decision
by the owner, after seeing the first figures: the battle is choreographed as
the sources tell it, step by step. At Lāʻimi the Oʻahu forces run up the
valley with Kamehameha's in pursuit; at the valley's head Kamehameha's
forces close around the remaining Oʻahu fighters at the edge, and some go
over, drawn as leaps and falls, without gore and without bodies left on the
ground. Arms follow the record: cannon on Kamehameha's line, muskets sparse
on both sides, spears, clubs, daggers and slings for most. Figures face the
way they move, so a cannon fires at the enemy and a retreat is seen from
behind. This sets the art direction for every battle after it.

**Why first.** The valley has an afterlife that carries the whole arc (§3.4). It
sits on the island with the best data. And it forces all three zoom levels, the
time axis and the event model into existence at once.

---

## 9. Challenges and risks

1. **Terrain streaming** is a rewrite of the terrain mesh and every land-sampling
   shader (§5.2). Largest technical item.
2. **An asset set per era** at ground level. Contain it by drawing the 19th
   century mostly zoomed out and by limiting depth districts to three.
3. **Data size against a committed `dist/`.** Decide the budget and hosting
   before baking anything (§5.1, §11).
4. **The correctness bar.** Composite was deliberately unfalsifiable; real places
   are checkable by everyone who lives there. Every topic costs a `FOREST.md`.
5. **Soft chronology.** Pre-contact dates are genealogical; the settlement date
   moved by centuries in 2011. Precision is in the schema, and the UI must show
   it (hatching, soft radii, ranges).
6. **Language.** The primary record is in Hawaiian.
7. **Sensitive sites.** Rules in §7.4; the risk is a well-meaning pin.
8. **Depopulation and violence** in a toy-figure style. Masses, not individuals;
   fading, not corpses.
9. **Hawaiʻi Island breaks the climate model.** Summits above the trade
   inversion, snow, lava desert; the ahupuaʻa sky and clouds assume one summit
   under a 650 m cloud base.
10. **The terrain changes over time** (lava, fill, tsunami) and the DEM is a
    2023 snapshot.
11. **Performance across eight islands**: vegetation and figures must be gated
    hard by distance.
12. **Names and diacritics** everywhere, including a slug that cannot carry them.
13. **Framing.** "Diorama" has a museum history in Hawaiʻi; the overthrow and
    annexation are politically live; recent events involve living people.
14. **Scope creep.** The archipelago invites everything. The phasing below is the
    guard.

---

## 10. Phasing

0. **This document.**
1. **Data first, no rendering.** Eras, the gazetteer, and the first few dozen
   events with citations and precisions, as JSON. Validate the schema; have the
   cards read.
2. **Archipelago.** Bake the eight islands at low resolution with real lines; the
   reign-indexed timeline; the polity overlay; pins; the voyaging arrival and
   Cook's track. This is the first thing that runs, and it proves the far view
   and the time axis using no new art.
3. **Island zoom.** Medium-resolution tiles with real rain and the ahupuaʻa
   shaders; cultivation, settlement and forest layers for the keyframes.
4. **Nuʻuanu.** The 1795 close-up and its tour; the tone decision made.
5. **Koʻolaupoko.** Keyframes c. 1700, 1850 and now; the coda.
6. **Kona and Kohala.**
7. **Ship.** `package.json` with gallery metadata, thumbnail, `npm run build`,
   `dist/`, per `CLAUDE.md`.

The package stays a directory with this file until step 2 produces an app: app
discovery skips a package with no `package.json`, and `npm run verify` treats a
package with no `index.html` as scaffolding.

---

## 11. Open decisions

- **Tone for battles and for depopulation** (§8). Decide before any figure work.
- **Data budget and hosting**: committed packs under ~50 MB, or release assets.
- **Timeline UI**: reigns with approximate years, or years with reign labels.
  Decided so far: the era label leads with the approximate year beside it,
  and the primary control is Next through chapters, not a play sweep (§5.6).
- **How uncertainty looks**: hatching, soft radii, ranges on cards; one visual
  language for all three.
- **Whether the coda ships in v1** or follows.
- **The name**, checked by a speaker before it goes on a gallery card.
- **Kauaʻi lidar**: confirm coverage, or accept 10 m there.
- **Vertical exaggeration curve** against zoom, decided by looking.

---

## 12. The name

**Holo i ke Au**: *holo*, to go, sail, travel; *i ke au*, on the current, into
the era. Slug `holo-i-ke-au`, URL `/vibe-dump/holo-i-ke-au/`.

Considered and set aside:

- *Ke Au*: the era, the current. Clean, one word like *Ahupuaʻa*; less of a
  voyage.
- *Ka Waʻa o ke Au*: the canoe of the current. The "time canoe", with the pun
  doing the work; long.
- *Nā Au*: the eras, the currents. Its slug `na-au` reads as *naʻau*, the gut
  and the seat of thought. Rejected for the slug.
- *Hoʻokele Manawa*: navigator of time. Literal and flat.
- *Moku Kahe*, "flowing islands": *moku* and *kahe* both also mean to cut, so it
  can read as a sliced district. Rejected.

*Au* has a public history as a title: *Ke Au ʻOkoʻa* ran 1865–1873 and John
H. Wise's *Ke Au Hou* 1910–1912, and part of Kamakau's history first appeared
in *Ke Au ʻOkoʻa*, so the name connects to the app's main source. All of the
above are coinages apart from the dictionary senses; a speaker should look at
the final one.

Draft gallery card, for `package.json` when there is an app:

```json
"gallery": {
  "title": "Holo i ke Au",
  "description": "The Hawaiian Islands as they were, from the first canoes to 1898. Zoom out to watch the chiefdoms and the cultivated land change across the centuries; zoom in to stand in a real valley in a chosen year.",
  "tags": ["simulation", "tutorial", "art"],
  "status": "wip"
}
```

---

## 13. References

Checked during the brainstorm (October 2026). Everything else named above is to
be cited in the gazetteer as it is used.

- Wehewehe, *au*: <https://wehe.hilo.hawaii.edu/?q=au&l>
- State GIS ahupuaʻa layer: <https://geodata.hawaii.gov/arcgis/rest/services/HistoricCultural/MapServer/1>
  and downloads: <https://planning.hawaii.gov/?p=2137>
- USGS 3DEP summary for Hawaiʻi: <https://www.usgs.gov/publications/3d-elevation-program-summary-hawaii>
- NOAA/USGS 2022–23 lidar DEM, five islands: <https://www.fisheries.noaa.gov/inport/item/75971>
- NOAA/USGS 2023 lidar DEM, Big Island: <https://www.fisheries.noaa.gov/inport/item/75960/printable-form>
- OHA Kīpuka database: <https://www.oha.org/resources/kipuka-database/>;
  launch coverage: <https://www.civilbeat.org/2013/04/new-tool-for-researching-native-hawaiian-land-ownership>
- Hawaiʻi County Land Commission Awards layer metadata: <https://gis.hawaiicounty.gov/public/downloads/plhyperlinks/MetadataFiles/Land%20Commission%20Awards.pdf>
- Papakilo sources: <https://www.papakilodatabase.com/main/sourcesearch.php>
- Kamakau on Ulukau, per Kamehameha Publishing: <https://shops.kamehamehapublishing.org/products/978-0-87336-014-2>
- Handy, *Native Planters*, Bishop Museum Press ebook: <https://bishopmuseumpress.org/products/native-planters-in-old-hawaii-their-life-lore-and-environment-ebook>
- Kuykendall on De Gruyter: <https://oeaw.ac.at/resources/Record/9780824845018>;
  his papers at UH Mānoa: <https://archivesspace.library.manoa.hawaii.edu/repositories/4/resources/434>
- SHPD burial inventory practice: <https://dlnr.hawaii.gov/shpd/files/2021/12/MIBC_1996-02-21.pdf>;
  rules and forms: <https://dlnr.hawaii.gov/shpd/forms>
- HB309 (2025), fishpond database: <https://data.capitol.hawaii.gov/sessions/session2025/Bills/HB309_SD1_.HTM>;
  coverage: <https://www.civilbeat.org/2025/04/hawai%ca%bbi-lawmakers-propose-new-effort-to-map-ancient-fishponds/>
- Waimānalo Limu Hui and Pāhonu: <https://www.hawaiipublicradio.org/the-conversation/2022-12-21/community-works-to-restore-a-turtle-pond-and-revive-limu-growth-in-waimanalo>;
  <https://www.khon2.com/local-news/ancient-turtle-pond-in-waimanalo-being-restored/amp/>;
  <https://civilbeat.org/2026/04/replanting-limu-a-civic-ritual-to-save-the-species-and-ourselves/>
