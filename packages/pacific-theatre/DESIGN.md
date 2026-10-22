# Pacific Theatre: design notes

A war room kept a **sand table**: a tray of modelled ground on which a staff
moved blocks for ships and squadrons, and on which, after the fact, a battle
was walked through to see what had happened. This app is one for the Pacific
theatre of the Second World War, with one thing the war room never had: you
may pick up a block and be it.

This is the working design for a new vibe that grows out of
[`holo-i-ke-au`](../holo-i-ke-au/) (the Hawaiian history diorama, on its own
branch): the same map-and-timeline diorama with sourced cards and battles
choreographed from the record, moved to the whole Pacific from December 1941
to September 1945, and given a third layer, the **sortie**, in which you take
one aircraft or one ship inside a battle and can turn its tide. It was written
in October 2026 by the project's designer from the owner's direction (*"map
and timeline, viewable battles that you can jump into and control planes and
battleships"*), four decisions the owner made on reading the first draft
(§11), and a research pass of nine reports (RESEARCH.md). Everything here is
a plan, not a record of what was built. Where a fact is quoted it is marked
as checked or as *verify*; nothing in it should be treated as sourced until
the gazetteer carries the citation.

---

## 1. What it is

Three layers, one world, one clock.

- **The table (far).** The Pacific from Burma to Hawaiʻi and from the
  Aleutians to the Coral Sea, as a relief map on a table: the sea floor in
  tinted depths, the land in shaded relief, coastlines inked, seas and islands
  named. Over it, by date: the front (who holds what), the routes (fleet
  tracks, the island-hopping drive, the bomber and submarine lanes) and pins
  for events, each with a sourced card. A timeline of chapters drives it, and
  Next walks it chapter by chapter, event by event, as the Hawaiian app does.
- **The battle box (near).** One battle at a time, a few hundred kilometres
  on a side, with its islands from real terrain, its sea, the sky and weather
  of that hour, and the ships and aircraft as toy models at true size, placed
  and moved as the record tells it: the fleets on their tracks, the strikes
  arriving when they did, the hits landing when they landed. Choosing a
  battle's pin on the table flies the camera down into its box. You can watch
  it, orbit it, scrub its clock. **Watching is always enough**; nothing asks
  you to play.
- **The sortie (playable).** At a **moment** of a battle (a tour stop with a
  clock), you take one unit: a dive bomber pushing over on a carrier, a
  battleship's main battery at night, a destroyer's torpedo run, a torpedo
  bomber over an anchorage, a fighter climbing to meet a raid. You start
  already in position, with the record's situation around you, on either
  side. **Inside the box you can turn the tide**: your hits are real, a
  carrier you save launches her next strike, a battleship you sink is gone,
  and the box plays out the consequences. **Nothing outside the box moves**:
  the table, the timeline, the next battle and the history are the record's,
  always. The after-card sets your battle beside the record's.

The example that drives the design is the dive on the Japanese carriers at
Midway between 10:22 and 10:28 on 4 June 1942 (§8). It should read as a pin
and two tracks converging on the table, as thirty ships and a hundred aircraft
in a box, and as forty seconds of dive with a flight deck growing in the
sight.

### What it is not

- **Not a wargame.** No fleet command, no supply, no strategy layer, no
  campaign; a battle's result changes nothing beyond its own box.
- **Not a simulator.** Arcade control; honest speeds, sizes and ranges, but a
  flight model and a ship model you can pick up in a minute.
- **Not a site of glory.** Both navies are drawn with the same care and both
  are playable; the dead are counted on cards, in ranges, with sources;
  nothing is drawn as spectacle (§7.4).
- **Not a replacement for `holo-i-ke-au`.** It copies what it wants (the
  monorepo rule is no cross-package imports) and diverges (§4).

---

## 2. The thesis: three layers trade against each other

The Hawaiian app's thesis was two continuous axes, zoom and time, with the
depth of time shrinking as you zoom in. That holds here and gains a third
layer.

- **Time is cheap on the table.** A date is a front, a set of routes, a set of
  pins. The whole war is a few megabytes of lines and JSON over one relief
  pack.
- **Time is expensive in a box.** A battle box is its own terrain, its own
  weather, its own order of battle, and above all its own **choreography**:
  tracks with times for every ship and strike, from the record. Each box is a
  research project the size of the Hawaiian app's Nuʻuanu.
- **Agency is the most expensive of all.** A sortie needs a flight model, a
  ship model, AI for everything around the player, aiming aids, damage and
  consequences, scoring and an after-card that is true. So agency is given at
  **moments**, not everywhere: a box has a handful, each entered in position,
  each with a checkpoint a few minutes in and the sortie running on from
  there as long as the unit and the battle last.

So the three layers nest: the table has many pins; a few pins open boxes; a
box has a few moments. The count at each level is the scope control (§3).

**Views are overlays that fade with zoom** on the table, as in the Hawaiian
app; the box is a separate scene the camera flies into (§5.6), not a zoom
level of the table, because its projection, its units and its clock differ.

| overlay | where | time |
| --- | --- | --- |
| the front: held, contested, besieged, bypassed | table | by keyframe, cross-faded |
| routes: fleet tracks, strikes, lanes, the drive across the Central Pacific | table | the dates of each route; the current step's always |
| pins and clusters | table | the window around the date |
| labels: seas, island groups, bases | table | all dates (1940s names, §7.3) |
| the diorama: terrain, sea, weather, the fleets on their tracks | box | the battle's clock |
| the sortie: the player's unit, the HUD, the consequences | box, from a moment | the battle's clock, from the moment on |

---

## 3. Scope

### 3.1 The span

**7/8 December 1941 to 2 September 1945**, with a **prologue** of cards from
the Mukden incident of 18 September 1931 to the Hull note and the Kidō
Butai's sailing, drawn on the table with the front of 6 December 1941: the
empire on the eve. The cards start in 1931 because East Asia dates the war
from there (the "Fifteen Years' War"); the map starts in 1941 because the
China front is a land war this table does not otherwise draw (R3 D1). The
prologue is cards only; its purpose is that the first chapter does not begin
out of nowhere.

The chapters are keyframes, as the Hawaiian app's eras are, **eight of
them**, each on a date a public-domain map shows the front (R3 D2):

| chapter | keyframe | span |
| --- | --- | --- |
| the long war in China (prologue) | 6 December 1941 | 1931 to 6 December 1941 |
| the first six months | 8 May 1942 | 7 December 1941 to 31 May 1942 |
| the turn | 15 September 1942 | 1 June 1942 to 9 February 1943 |
| up the Solomons and New Guinea | 1 November 1943 | 10 February to 19 November 1943 |
| across the Central Pacific | 15 August 1944 | 20 November 1943 to 14 September 1944 |
| the return to the Philippines | 15 January 1945 | 15 September 1944 to 18 February 1945 |
| the approaches to Japan | 1 July 1945 | 19 February to 25 July 1945 |
| the end of the war | 2 September 1945 | 26 July to 2 September 1945 |

Each keyframe has its front and its routes; between keyframes the land
polygons cross-fade and the islands switch on their own dates (§5.4). The
last keyframe is not a front at all: at the surrender Japan still held most of
what it held in July, and the honest map of 2 September is General Order
No. 1's surrender zones and the Soviet advance (R3 D5).

Every date here is known to the day and most hours to the minute, so the
timeline is a true date axis, not an index of eras (§5.5), and the window of
events around the chosen date is weeks, not decades. But **the clocks
disagree**: Japanese records keep Tokyo time and the Tokyo date; at Midway the
shore forces kept zone +12 and the US carriers zone +10, so one dive is 10:22,
12:22 and 07:22 the next day in three honest records (R2 §3, R4 §2). Every
instant in the data carries its source's clock and zone and an absolute time
(DATA.md §4); each box shows its own named local clock and the card shows the
others beside it.

### 3.2 The extent

The table runs from **78°E to 155°W and 42°S to 56°N** (R3 D3): Ceylon and
the Bay of Bengal at the west edge, so the Indian Ocean raid of April 1942
and the Hump have somewhere to be; the whole Aleutian chain and the tip of
Kamchatka at the north; Hawaiʻi Island just inside the east; Tasmania's north
and New Zealand's North Island at the south. The antimeridian runs through
the middle of it and is unremarkable. What falls off the table is a card at
its edge with a marker pointing the way, as the Hawaiian app's Kahiki marker
does: Washington, Potsdam, the West Coast and the internment camps, British
Columbia, Funter Bay, Madagascar (R3 D12).

The table is drawn in an **azimuthal equidistant projection centred on 7°N
141.5°E**, between Yap and Woleai. R1 measured the three candidates:
equirectangular stretches the Aleutians 1.7 times; equal-area has half again
the shape error; azimuthal equidistant keeps every place named in the
research within 12° of angular distortion (Dutch Harbor is the worst, where
north leans 35° to the left, which is what an azimuthal chart does) and the
v1 battles within 6°, and looks like an ocean chart of the period, with the
meridians converging north. The table is 14,170 km across, 6.9 km to a texel
at 2048. Its corners reach past the lat/lon box and fill with real terrain,
which is better than blank wedges.

### 3.3 The scales

| scale | extent | texels | ground per texel | what carries the picture |
| --- | --- | --- | --- | --- |
| table | ~14,200 × 12,700 km | one 2048 pack | ~7 km | the relief pack, coastlines as vectors, labels, the front, routes, pins |
| theatre (zoomed on the table) | 500–3,000 km | the same pack, coastlines at full 10 m detail | ~6 km | the same, with routes and pins resolving; small islands as inked outlines over a sub-texel relief |
| box | 50–400 km | one pack per box, 1024 (2048 where a sortie flies low over land) | 50–200 m, land from 30 m data | the diorama: terrain, sea, weather, the fleets |
| sortie | 1–30 km around the player | the box's pack | the same | the kits at true size, wakes, smoke, splashes, tracer |

The table is a map, not a terrain: an atoll is a pixel at 6 km per texel, so
small land is drawn from the coastline vectors (inked outline, a flat fill
lifted a hair above the sea) rather than from the heights. Zoomed in on the
table, the relief stays soft and the ink stays sharp, like a printed chart.
Land on the table is land only where Natural Earth says so; ETOPO's heights
fill it in and never decide it, because ETOPO paints shoals as land (Salmon
Bank near Midway stands 19 m out of the water in it; R1 §3.3).

### 3.4 The battles

Boxes, in order of building. **v1 is the first four**, which between them
need every kind of sortie: a dive bomber, a torpedo bomber, a fighter, a
battleship, a destroyer and an escort carrier, on both sides.

| # | battle | date | box | moments |
| --- | --- | --- | --- | --- |
| 1 | **Midway** ミッドウェー海戦 | 4 June 1942 | the atoll, the Kidō Butai and TF 16/17 across the date line, ~370 × 490 km, 04:00–18:00 Midway time | the dive on Kaga (SBD, VS-6/VB-6, 10:22); Best's section on Akagi (10:26); the dive on Sōryū (VB-3, 10:25); Hiryū's Zero CAP against VT-3 (10:09); Thach's escort (F4F, 10:05); Hiryū's D3As on Yorktown (12:05); the F4F CAP over Yorktown (11:59); the B5N run on Yorktown (14:40); Torpedo Eight is a stop with a card |
| 2 | **Pearl Harbor** 真珠湾攻撃 | 7 December 1941 | Oʻahu and its waters, ~100 km, the carriers off the box, 06:30–10:00 Hawaiian time | a Kaga B5N's torpedo run over Southeast Loch (07:56); Nevada's helm and AA down the channel (08:40–09:10) and its mirror, a Kaga D3A of the second wave on Nevada; Welch and Taylor's P-40s over ʻEwa (08:33); Helm, the one destroyer under way (07:58–08:22); later, Shōkaku's D3As on Ford Island's hangars, Sanders's P-36s, Helena's AA; no level-bomber moment (§3.5); Ward's attack on the midget submarine is a watched stop |
| 3 | **Second Naval Battle of Guadalcanal** 第三次ソロモン海戦 (second night) | 14–15 November 1942 | Ironbottom Sound: Savo, Guadalcanal's north coast, Nggela and Tulagi, ~100 km | Washington's bridge, 23:58–00:10 (75 rounds of 16-inch at Kirishima from 8,400 yards under radar); Kirishima's bridge from 23:51; Gwin in the van at 23:24; Ayanami at 23:24 |
| 4 | **Samar** サマール沖海戦 | 25 October 1944 | off Samar's east coast, ~200 km | Johnston's torpedo run on Kumano (07:10–07:31); Yamato's main battery on Taffy 3 (06:58–07:10); Gambier Bay's helm under fire (07:45); Samuel B. Roberts's run (07:50); Tone of CruDiv 7 closing the carriers (07:58); the box's clock closes with the surface action, before the attack on St. Lo |
| 5 | Ten-Gō 坊ノ岬沖海戦 | 7 April 1945 | the East China Sea south of Kyūshū | Yamato's helm and AA under the first wave (12:32); a TBM of the first wave |
| 6 | Philippine Sea マリアナ沖海戦 | 19 June 1944 | west of the Marianas | an F6F against Raid II; a D4Y or B6N of Raid II |
| 7 | Santa Cruz 南太平洋海戦 | 26 October 1942 | north of the Santa Cruz Islands | Widhelm's SBDs on Shōkaku (10:30); Shōkaku's D3As on Hornet (10:10) |
| 8 | Surigao Strait スリガオ海峡海戦 | 25 October 1944 | the strait | a destroyer torpedo attack; West Virginia's radar gunnery; Yamashiro's bridge |

Candidates after those: Savo Island, Coral Sea, the First Naval Battle of
Guadalcanal, Tassafaronga, Empress Augusta Bay, Kula Gulf, the Bismarck Sea,
Okinawa's picket line.

Every battle on the table that has no box is a pin with a card and, where the
record gives tracks, routes. Every box is also viewable with no sortie at
all: the record plays, you watch. Some moments the record allows are not
offered because no sortie-terms success exists in them and almost every run
ends in the player's death (Torpedo Eight at Midway; the last run on a
Yamato already on her beam ends): they are stops with a card (R4 D3).

### 3.5 What is playable, and what is cards only

The owner's rule: **a battle between military forces is playable on both
sides; an attack whose victims were civilians is never playable.** Pearl
Harbor was an attack on a fleet and its airfields, so its attack and its
defence are both sorties. The firebombing of Japanese cities, Hiroshima and
Nagasaki, the Bataan march, the sack of Manila, Okinawa's civilians, the
"comfort women" system, the incarceration of Japanese Americans, the POW
camps and the hell ships, the reprisals in China after the Doolittle raid:
cards, never a box, never a moment, never drawn as a picture on the table (a
bombing raid is a pin and a card). Tokkō (special attack, "kamikaze")
attacks are never a playable role and never a moment's objective to shoot
down; where one falls inside a box's clock it is on the card, and the Samar
box's clock closes with the surface action, before the Shikishima unit's
attack on St. Lo, which is the box's closing card (R8 D3).

Four rules the owner's decisions make necessary (R8 §5.2):

- **Fixed fates.** Arizona, Oklahoma and Utah keep their record fates in
  every run; no player unit is ever their cause, so there is no high-level
  bomber moment at Pearl Harbor, and the torpedo run's targets are the other
  battleships. Two of the three are war graves today, and no card will ever
  read "you saved 1,177".
- **People only in the record.** The after-card's account of the player's
  battle speaks of ships and aircraft only; the dead appear only in the
  record's part, as sourced ranges, never beside or subtracted from
  anything the player did.
- **Nothing that is a person is a target.** A ship past its fatal threshold
  leaves the target list; hospital ships (Solace lay in Pearl Harbor) are
  never targets; nothing is drawn in the water to strafe; buildings are
  terrain that registers nothing, so a dive bomber over Hickam has the
  aircraft on the ramps and the AA positions as its targets.
- **The player is never a named person**: "an SBD of Bombing Six", "a B5N2
  of Hiryū's second strike"; the leaders' aircraft are always AI and always
  follow the record.

The rule is practised, not announced: no card says what the app does not
draw.

---

## 4. What it borrows from `holo-i-ke-au`

The monorepo rule is **no cross-package imports**, so this package *copies*
what it wants and then diverges. Provenance goes in the commit message; the
copy was made at `b480c27` on the Hawaiian branch. R9's module table
(RESEARCH.md §9) is the authority; the summary:

| take as is, or nearly | adapt | not needed |
| --- | --- | --- |
| `data/load.js`, the `PackDecoder`, the pack manifest and PNG format (DATA.md §2) | `geo.js`: the projection becomes an interface with two implementations, the table's azimuthal equidistant and a box's local tangent plane (the Hawaiian one) | `render/world.js`'s eight-island slots and the district hand-over: the table is one pack and a box is one pack |
| `render/camera.js`, the rig (target, distance, yaw, pitch), with limits per scene | `time.js`: a date axis with chapters as ticks, a window of weeks, and instants with zones | `features/*` (settlements, vegetation, soldiers, sprites), `overlay/land.js`, patches, layers, the Māhele and zoning: the land is not the subject |
| `render/sky.js`, `stars.js`, `shadow.js`, `pipeline.js` | `render/ocean.js`: near-field swell inside a box as is; on the table a "chart sea", the relief seen through depth-tinted water | the terrain shaders' rain and vegetation bands |
| `render/routes.js` (fleet tracks are exactly routes) and `render/lines.js` (coast ink, fronts, the date line, the equator) | `overlay/polity.js` becomes the front overlay: per-keyframe polygons cross-faded, not moku coloured by era | `tools/bake-layers`, `bake-patches`, `bake-zoning` |
| `ui/pins.js` and clustering, `ui/card.js`, `ui/tour.js`, `ui/timeline.js`, `ui/dom.js`, `ui/icons.js` | the card gains the battle briefing and the after-card; the tour gains "enter this battle" and "take this moment" | |
| `src/fonts/` and `FONTS.md`, plus a subset of Noto Sans JP for the kanji the data uses (§7.3) | `style.css`: the same tokens, a cooler palette (chart blues and sand, not kapa and gold) | |
| `tools/lib/` (fetch with ledger, png, raster, simplify, geo, bake-run), `tools/check-data.mjs` as the pattern, `tools/smoke.mjs` and `tools/shoot.mjs` as harnesses | | |

The single most reusable *idea* is again that **a tour stop is the event
model**: text plus a camera plus a clock. A battle is an event whose stops
have a box; a moment is a stop with a role.

---

## 5. Architecture

ENGINEERING.md is the contract between the modules and the parallel builders;
this is the shape.

### 5.1 Offline data pipeline

A by-hand `tools/bake` step, like `npm run thumbnails`: run locally, output
committed, nothing fetched at runtime. R1 proved each source from this
container (RESEARCH.md §1):

- **The table's relief**: ETOPO 2022 at 60 arc-seconds (NOAA, public
  domain), read over the THREDDS OPeNDAP service in two pieces either side of
  180° with a thirty-line DAP2 reader, forward-binned into the projected
  2048 grid. Bathymetry matters here as much as land.
- **Coastlines and small islands**: Natural Earth 10 m land, minor islands,
  reefs and coastline (public domain), clipped to the table, the antimeridian
  splits merged, simplified by zoom. Positions only: Natural Earth's names
  are modern and its diacritics wrong, so the gazetteer owns every label.
- **Battle boxes**: land from Copernicus GLO-30 (free, with its attribution
  notice in every box's sources), read by HTTP range through the `geotiff`
  package; every island the v1 and later battles need is present, Midway and
  Wake included. Sea depth from GMRT (CC BY) with ETOPO 2022 15″ as the
  fallback; sea clamped to −1 m or deeper; land only from GLO-30, except
  that the Pearl Harbor box takes the harbour and the south shore from
  NOAA's 3 m topobathymetry, because the lochs are the sortie's ground, and
  is baked for 1941 (the later fill, drydocks and piers taken out on the
  dated record the Hawaiian app already holds for Oʻahu). Each box is one
  pack in the Hawaiian format, baked for its battle's date, rendered in its
  own frame, with its placement on the table (centre and the projection's
  local Jacobian) in its manifest.
- **The front and the routes** are hand-written GeoJSON and JSON from the
  record, traced only from public-domain US government charts (the USSBS
  plates, CINCPAC's composite tracks, the Naval War College diagrams, the
  Green Book and Marine Corps maps), never from Commons or Morison (R2 D6).

Outputs: `public/data/table/`, `public/data/boxes/<id>/`, and the
hand-written files beside them. DATA.md is the contract.

**Budget.** `dist/` is committed, so the git history pays for every byte. R1
measured the Hawaiian PNG format on real data: the table at 2048 is 5.5 to
7 MB; a box at 1024 is 0.5 to 1 MB and at 2048 about 3 MB; coastlines under
1.5 MB; the gazetteer and the scenarios under 1 MB. v1 lands near 12 to
15 MB with Ironbottom Sound at 2048 (the one sortie that flies low over
land); eight boxes near 20 MB; the ceiling stays the Hawaiian app's 40 MB.
The kits are code, not assets.

### 5.2 The table

One pack, drawn as a relief map: a hypsometric tint for land and a
bathymetric tint for sea, both from the heights, with hillshade from the
baked normals, the sea floor seen through water tinted by its depth; the
coastlines inked on top as screen-space lines (`lines.js`), small islands
filled flat a hair above the sea; labels as DOM text, crisp at any zoom,
kanji through CSS, thinned by rank and collision. The table's light is
fixed, a war room's afternoon: a map that went dark with the date would be
hard to read and say nothing; the battle's real sky lives only in a box.
The camera is the Hawaiian rig over a flat table: the whole theatre fills
the frame at the far limit, a single island group at the near limit; the
near limit is where a box's pin invites you down. World units on the table
are kilometres; the projection module is the one thing that knows the table
is azimuthal.

### 5.3 The battle box

A separate Three.js scene, one renderer, one scene drawn per frame. Its
pack is a few hundred kilometres across; its projection is the Hawaiian
tangent plane; its world units are metres with the origin at the box's
centre, the sim keeping positions in double precision because single
precision was measured to slow a ship by a tenth; a logarithmic depth
buffer carries the range from a deck fitting to the horizon; its vertical
exaggeration is one constant, 1.0, shared by the renderer and the sim, so
the terrain an aircraft hits is the terrain on screen. The sea is the
Hawaiian swell shader, with the wind and sea
state the record gives (a 4 to 5 knot breeze from the south-east and a
smooth sea with an easterly swell at Midway; a flat calm at Guadalcanal; rain
squalls at Samar). The sky is the Hawaiian sky at the battle's hour and
latitude, with the cloud the record describes (scattered cumulus from 1,500
to 2,500 ft over the Kidō Butai at 10:22, which hid the dive bombers; 8/10
at 3,000 ft over Yamato).

Everything in a box is a **unit** with a **kit** and a **track**:

- A **kit** is a procedural model built in code from a dozen numbers (§5.8).
- A **track** is the record: time-stamped positions, courses and speeds with
  a precision mark, from action reports, the official analyses and the
  Japanese reports (R4, R5). Between fixes a unit steers smoothly; a
  formation keeps station on its guide. Aircraft tracks are coarser: a
  strike is a group with a launch time, a route and an attack time; its
  members fly formation on it and break on their attack profile.
- **Events** are the record's beats: a hit, a fire, a flooding, a sinking, a
  launch, a turn, a signal, a sighting, with a time, a cause and a source.
  The box plays them on its clock, subject to the rule of §5.7.

The box has three uses: **watch** (the camera free, the clock scrubbable, the
tour's stops walk it), **sortie** (a moment taken; the player has a unit),
and **briefing** (the card that opens with the box: the situation at this
minute, the forces, the moments on offer, the sources).

### 5.4 The front

The Green Books already solved how to draw control that is not a line, and
the table draws it their way (R3 D4):

- **Land held is a filled area**: polygons per keyframe with a `state`
  (`held`, `garrisoned` for Indochina under treaty, `allied-with-japan` for
  Thailand, `contested`, `allied`, `neutral`, `soviet`) and a precision mark,
  hand-digitized from the public-domain maps: the Army's semimonthly *Atlas
  of the World Battle Fronts* from July 1943, the Green Books' dated
  situation maps before it. Occupied China is a hatch, not a fill: Japan held
  its cities and railways, 点と線, points and lines.
- **Islands are dated intervals, not polygon slices.** Each island or atoll
  in the gazetteer carries who held it from when to when; the table at any
  date is computed, so the bulk of the Pacific's changes need no
  interpolation. A garrison cut off behind the advance (Rabaul and Truk from
  February 1944, the Marshalls' bypassed atolls, Wake, Nauru) stays drawn in
  the old colour with a mark, which is itself a fact worth seeing; the Green
  Books drew them as black specks inside a dashed ring.
- **Groups of islands get a dashed perimeter**, a LineString per keyframe.
- **The sea is not filled.** The Army's atlas paints the ocean behind the US
  advance as Allied, which is one side's framing of a contested sea; here
  the routes and the battles show who used it.
- **Declared lines are their own layer**, dashed, labelled and dated: Japan's
  planned perimeter of 1941, the Absolute National Defence Zone of September
  1943, General Order No. 1's lines at 16°N and 38°N.

Between keyframes the land polygons cross-fade; they do not morph, because a
morph would draw a front where none was. The overlay fades out as the camera
drops into a box.

### 5.5 Time

The clock is one thing with three resolutions.

- **On the table**, a date. The slider gives the ten-year prologue a tenth
  of its length and runs linearly over the war's days after that; the
  chapters are ticks and the pill names the chapter. The window around the
  date, in which pins and routes show, is a week to three weeks either side,
  an eighth of the chapter's length, and the whole prologue inside the
  prologue. Every event has a `when` at day precision or better and most
  have an hour.
- **In a box**, a battle clock in a named zone (Midway: zone +12, the Midway
  local time most English and many Japanese tellings use; Guadalcanal: zone
  −11; Samar: Item, which is also Tokyo time; Pearl Harbor: Hawaiian time),
  with the date fixed. The watch mode scrubs it; the tour's stops set it.
- **In a sortie**, seconds. A moment is `[t, t + duration]` on the battle
  clock as its checkpoint, and may run at a time scale (ships' moments at two
  or three times real time so a torpedo run fits a few minutes; aircraft at
  one; R7 advises).

**Dates and zones.** Data stores every instant with its source's clock, the
source's zone and an absolute UTC instant (R2 D1); cards show the local date
and time of the battle's clock and name the zone; `check-data` refuses a time
without one.

### 5.6 Jumping in and out

A battle's pin on the table, or its step in the tour, offers *Enter the
battle*. The camera flies down on the table to a pose over the box's outline
while the box's pack streams and its units are built, holds there if the box
is not ready, then cuts through the haze colour in half a second to the
box's camera at the matched pose (never two scenes drawn at once); the
briefing card opens on the far side. Inside, the tour's stops
walk the battle on its clock; a stop with a role offers *Take the controls*.
Leaving a sortie returns to watch mode with the box in whatever state the
sortie left it; leaving the box flies back up to the table at the battle's
date, and the box's state is forgotten. The URL carries all of it
(`#battle=midway&t=10:22&moment=vb6-kaga`), as the Hawaiian app's `?cam=` and
`?year=` do.

### 5.7 The sortie: the record is the default, the sim is the truth

The owner's rule: inside a battle you can turn its tide; nothing outside the
battle moves. So:

- **Untouched, a box replays the record.** Every unit the player has not
  touched follows its track, its station, its route and its scripted
  events, deterministically, every time.
- **Where the player stands, the record gives way to the sim.** A scripted
  event has a cause and a target. When the player's unit is either, the
  event is not scripted; the sim resolves it with its own models. With
  Washington, her nine-to-twenty hits on Kirishima are the player's real
  salvos; with Kirishima, an AI Washington aims and fires the real gunnery
  model at the player, who may evade. Flying in Bombing Six, the player's
  bombs are the player's; the rest of the squadron's are still scripted
  against their own count, scaled by how many of them are still flying.
- **Consequences follow.** A strike from a carrier that is burning at its
  launch time does not launch. A hit by a group that has lost more than half
  its aircraft lands with its count scaled, and below a quarter not at all.
  A ship sinks when its damage reaches its kit's fatal threshold, from
  scripted hits or real ones, so Kaga's four or five bombs take her past it
  by 10:30 untouched, and a Kaga the player saved recovers and relaunches her
  groups on the record's cycle times, run by the sim's AI.
- **The AI reacts to the player and only to the player**, within bounds the
  kit and the record set: a ship fired on by the player evades within thirty
  degrees of its course and returns fire with its real battery; CAP within
  range engages the player; AA engages the player's aircraft; a scripted
  strike whose target is the player's ship attacks it with the real attack
  model. Nothing else deviates, so the battle stays recognisable.
- **The player can be shot down or sunk.** An aircraft hit falls as a trail
  and the sortie ends with the card; a ship takes damage that slows it,
  silences a turret, jams its steering, starts a fire, and the sortie ends
  when the ship can no longer fight.
- **A moment is a way in, not a cage.** Its duration is a checkpoint: there
  the HUD offers the card or to keep going, and the sortie then runs until
  the unit is lost, the aircraft is out of endurance or ammunition, the
  player leaves, or the battle clock ends.

Scoring is in **sortie terms**: hits, torpedoes on target, aircraft downed,
whether you came back, the time you took; never in people. The after-card
has four parts, each labelled in both languages (R8 D2): **Your sortie**
(あなたの出撃), the score; **Your battle** (あなたの戦い), what sank, burned
and was lost in your box, ships and aircraft only; **The record** (記録),
what the sources say happened, the people they name, the losses by source as
ranges; **What came next** (その後), the history, which your battle did not
change. The parts never share a row or a sum, and the words "saved", "what
if" and "victory" do not appear.

### 5.8 Kits: ships and aircraft from numbers

No model files. Each class is a **kit**: a JSON record of a dozen numbers and
a short list of named blocks (R6 gathers the numbers; the silhouettes and
proportions come from the period's own public-domain recognition manuals,
ONI 41-42 and ONI 222-J for the Japanese ships and TAIC No. 1 for the
aircraft, with print references as *verify*; R2 D8) from which code builds a
low-poly, flat-shaded model at true size: hull length, beam, freeboard fore
and aft, sheer, bow shape; superstructure blocks; pagoda mast height and
shape; funnel count, position and shape; turret count, positions and
calibre; island side and flight deck for carriers; colour and camouflage
measure at the date. Aircraft kits the same: span, length, engine, wing
position, tail shape, canopy, gear, national marking at the date. The point
is silhouettes: Yamato's pagoda and single funnel, Akagi's port-side island,
Kaga's long flat deck, Washington's tower, a Fletcher's two stacks, a Zero's
long canopy against a Wildcat's stubby one. Recognisable from a kilometre
away, honest in size, plainly a model.

Everything that moves fast or is many is instanced: aircraft, shells,
tracer, splashes, smoke puffs, wakes. R7 sets the live-unit budget.

### 5.9 Boot

The table pack, the coastlines, the labels and the gazetteer load before the
curtain lifts (the Hawaiian app's boot pattern: a bar, a stage name, four
quiet frames). Boxes stream on entry behind the briefing card. Kits are built
on entry and cached. The thumbnail is of the table at the war's middle, with
the front and routes up: the gallery opens the app with no hash, so the
package's thumbnail block waits out the boot and clicks a mid-war chapter
tick before the shot.

### 5.10 Performance

Targets: the table at 60 fps on an integrated GPU and usable under
SwiftShader for the smoke test and the thumbnail; a box at 60 fps on an
integrated GPU with Midway's morning live (about 30 ships and 100 aircraft)
and a reduced setting that halves the aircraft and the particles when the
frame time says so. Draw calls under 200 on the table and under 500 in a box.
The sim runs on a fixed step (60 Hz) with a seeded RNG, so a sortie replays
and a smoke test can assert what happened.

---

## 6. Data model

DATA.md is the contract; this is the shape. Everything hand-written carries
sources, precisions and tellings as the Hawaiian gazetteer does, and
`tools/check-data.mjs` enforces it.

```jsonc
// a chapter (chapters.json)
{ "id": "turn", "label": "the turn", "from": "1942-06-01", "to": "1943-02-09",
  "keyframe": "1942-09-15", "note": "...", "sources": ["..."] }

// a place (places.json)
{ "id": "midway", "name": "Midway Atoll", "ja": { "kanji": "ミッドウェー島", "romaji": "Middowē-tō" }, "kind": "atoll",
  "geometry": { "type": "Point", "coordinates": [-177.37, 28.2] }, "placePrecision": "ex", "held": [ ... ], "sources": ["..."] }

// an event (events.json)
{ "id": "midway-1942", "title": "The Battle of Midway", "ja": { "kanji": "ミッドウェー海戦", "romaji": "Middowē kaisen" },
  "when": { "from": "1942-06-04T04:30-12:00", "to": "1942-06-07T05:01-12:00", "precision": "minute", "clock": "usn-zp12" },
  "chapter": "turn", "where": [ { "place": "midway", "role": "near" } ], "kind": "battle", "flag": "box", "sides": ["jp", "us"],
  "zoom": ["table", "box"], "box": "midway", "summary": "...", "stops": [ ... ],
  "sources": [ { "id": "nwc-midway-1948", "where": "pp. 120–143" } ], "confidence": { "date": "firm", "place": "firm", "numbers": "soft" },
  "tellings": [ ... ], "routes": ["kido-butai-midway", "tf16-tf17-midway"] }

// a battle box (boxes/midway/battle.json)
{ "id": "midway", "event": "midway-1942", "clock": { "id": "usn-zp12", "zone": "-12:00", "name": "Midway time (zone +12)", "from": "1942-06-04T04:00-12:00", "to": "1942-06-04T18:00-12:00" },
  "weather": { "wind": { "fromDeg": 135, "kn": 5 }, "sea": 2, "cloud": { "baseM": 460, "topsM": 760, "cover": 0.3 }, "visibilityM": 60000 },
  "units": [ { "id": "kaga", "kit": "kaga", "side": "jp", "name": "Kaga", "ja": "加賀",
               "track": [ { "t": "10:00", "lonlat": [181.0, 30.0], "courseDeg": 30, "speedKn": 24, "precision": "report", "source": "nagumo-1947", "sourceClock": "0700", "sourceZone": "+09:00", "sourceDate": "1942-06-05" } ],
               "events": [ { "t": "10:22", "kind": "hit", "by": "vb-6", "count": [4, 5], "sources": [ ... ], "tellings": [ ... ] },
                           { "t": "19:25", "kind": "sinks", "sources": [ ... ] } ], "hangarHazard": [ { "t": "10:20", "h": 0.8 } ] } ],
  "groups": [ { "id": "vb-6", "kit": "sbd-3", "side": "us", "count": 15, "from": "enterprise", "launch": "07:45",
                "attack": { "t": "10:22", "target": "kaga", "profile": "dive", "pushOverM": 5800, "releaseM": 760, "reached": [13, 15] } } ],
  "moments": [ { "id": "vb6-kaga", "role": { "kind": "aircraft", "kit": "sbd-3", "side": "us", "group": "vb-6", "name": "a Dauntless of Bombing Six" }, "t": "10:21:30", "durationS": 180, "timeScale": 1, "maxTimeScale": 4,
                 "start": { "from": "kaga", "bearingDeg": 200, "rangeM": 3000, "altM": 5800, "speedMs": 78 }, "after": { "text": "...", "sources": [ ... ] } } ] }

// a kit (kits/ships.json, kits/aircraft.json, kits/weapons.json)
{ "id": "kaga", "class": "Kaga", "type": "cv", "side": "jp", "loa": 247.6, "beam": 32.5, "speedKn": 28, "shp": 127400,
  "blocks": [ { "kind": "flight-deck", "at": [0.02, 1.0], "w": 30.5 }, { "kind": "island", "at": 0.45, "side": "starboard" }, { "kind": "funnel", "shape": "downturned", "at": 0.5, "side": "starboard" } ],
  "blocksPrecision": "measured", "guns": [ ... ], "aa": [ { "weapon": "jp-25-t96", "mounts": 11, "barrels": 2 } ], "crippledAt": 0.5, "fatal": 1.0,
  "colour": { "hull": "ijn-kure-grey", "deck": "wood", "deckMarking": "hinomaru-forward" }, "sources": [ ... ] }
```

Rules the schema enforces, beyond the Hawaiian ones (every date a precision,
every place a precision, every card cites, numbers only in tellings as
ranges):

- Every instant carries its zone; `check-data` rejects one without, rejects
  a battle whose units' tracks fall outside its clock, and a moment outside
  its battle's clock.
- A unit's track has at least two fixes with a precision each (`report`,
  `chart`, `narrative`, `schematic`); a `schematic` track is drawn finer and
  the briefing says so.
- Every scripted event names its cause where it has one, so the sim can tell
  whether the player stands in its path.
- Every unit names a kit that exists; every kit cites a source for its
  dimensions and carries a `fatal` threshold.
- A moment names a role whose kit exists, starts inside its battle's clock,
  and carries an after-card with at least one opened source.
- Sources carry `language`, `licence` and an archive `ref` (R2 D9); the
  check refuses an image or a traced layer from any source that is not
  public domain.
- No user-facing text contains the phrases of §7.4 (the copy rule), no
  summary contains a count, and no score field speaks in people.

---

## 7. Sources and research

### 7.1 Open and digital

R2 compiled the ledger (RESEARCH.md §2); the backbone for each v1 battle is
a US primary record, a Japanese primary record and an official analysis, all
reachable now (R2 D2):

| what | where | notes |
| --- | --- | --- |
| US official histories and reports | HyperWar (ibiblio): the ONI Combat Narratives, USSBS *Campaigns of the Pacific War* and the *Interrogations of Japanese Officials* (a Japanese witness for each v1 battle), the Japanese Monographs, the Army's Green Books, the USMC monographs, CINCPAC's and the carriers' action reports, the ONI translation of the Nagumo report with its tables and charts | public domain (US government); NHHC itself is blocked from the build container |
| the Naval War College analyses (Midway 1948, Coral Sea 1947 on archive.org; Savo 1950 and Leyte I–III, V on HyperWar) | opened | public domain; the best plotted tracks for Midway; none covers Samar |
| the Johnston and Hoel action reports | the survivors' association site | times from memory; the logs went down |
| the Japanese official history, *Senshi Sōsho* 戦史叢書 | the NIDS viewer, every relevant volume | Japanese; a reader needed |
| the Japanese action reports 戦闘詳報 | JACAR, by keyword: Kaga's, the Nagumo force's, Atago's and Inazuma's for the night of 14–15 November, CruDiv 7's for Samar, Yamato's for Ten-Gō | Japanese; facts may be cited, images may not be shown without NIDS's permission (R2 D5) |
| Morison's fifteen volumes | in copyright, renewals filed | read for facts, cited as print, never copied or linked (R2 D4) |
| the Australian official history | awm.gov.au | open |
| ship movements, Japanese side | combinedfleet.com TROMs | copyrighted compilations: finding aids and tellings, not the record |
| ship and aircraft data | ONI 41-42, ONI 222-J, TAIC No. 1, SAC sheets on archive.org | public domain |
| terrain, bathymetry, coastlines | ETOPO 2022, GMRT, Copernicus GLO-30, Natural Earth | public domain, CC BY, attribution, public domain |
| tertiary | Wikipedia (article pages and `action=raw`; the API rate-limits), Wikimedia Commons | finding aids; nothing traced from a CC BY-SA map |

### 7.2 Not open

The syntheses that did the work are print: Parshall and Tully (*Shattered
Sword*, whose diagram of the Kidō Butai's box at 10:20 everyone cites and no
open source gives), Lundstrom, Frank (*Guadalcanal*), Hornfischer (*The Last
Stand of the Tin Can Sailors*), Tully (*Surigao Strait*), Toll, Prange,
Willmott, Evans and Peattie (*Kaigun*), Ienaga, Dower; Skulski's *Anatomy*
volumes and Lacroix and Wells for the kits. Each is cited as *verify* where
its reading is known at second hand. Washington's own action report for the
night of 14–15 November was not found on any reachable host, so her bridge
moment rests for now on Morison, the South Dakota damage report and the
Japanese reports (R2 D3). ACCESS.md keeps the standing list of walls, scans,
books and archive requests for the owner to pull.

### 7.3 Language and names

The record is in two languages and the app names things in both (R2 D10,
R8 §3): the war is **the Pacific War** in English and **太平洋戦争** in
Japanese, with 大東亜戦争 and アジア・太平洋戦争 named once, on the prologue
card, with whose names they are; ships and operations in romaji with macrons
and kanji beside (Sōryū 蒼龍; Kidō Butai 機動部隊; Shō-ichi-gō 捷一号作戦);
Japanese personal names family name first, the family name in capitals with
the kanji on first mention (YAMAMOTO Isoroku 山本五十六), as Japan's own
2019 rule has it; macrons on every romaji word except Tokyo, Kyoto, Osaka and
Kobe; American ships with hull numbers; Allied forces by their nations. A
battle's title is its English name with the Japanese name and its reading on
a line beneath. In the app's own voice the word is **tokkō (special
attack)**, with "kamikaze" glossed once per card; **the incarceration of
Japanese Americans**, not internment; the "comfort women" system in quotation
marks, led by the Japanese government's own 2015 wording. Words for the dead
are the museums' plain ones: crews **lost their lives** (命を落とした);
civilians killed deliberately **were killed**; prisoners **died**; aircraft
**did not return** (未帰還); never "gave their lives", "sacrifice", 英霊 or
散華. The fonts carry Latin with diacritics; a subset of Noto Sans JP holding
only the characters the data uses is fetched at build time and committed
(FONTS.md). Place names on the table are the 1940s names the record uses,
with today's name on the card where it differs (Formosa / Taiwan; the Dutch
East Indies / Indonesia; Truk / Chuuk). Slurs are never in the app's own
voice; one is quoted only when the quotation itself is the point, exactly
and attributed, in a quote field, in either language.

### 7.4 What stays off the table

The rule is practised, not announced. R8 §5.1 is the list in full; in short
the app never draws or offers: human figures anywhere, on decks, in the
water, on rafts or under parachutes (aircrew are a tinted canopy at most);
anything that is a person as a target (no rafts or debris are drawn, rounds
into the sea do nothing, buildings are terrain, a ship past its fatal
threshold and a hospital ship leave the target list); a mushroom cloud, a
burning city or a bomber stream onto one (the B-29 lanes end at the coast;
no route for the atomic missions); a tokkō role or a moment whose purpose is
to shoot tokkō aircraft down; a score in people; a celebration (no medals,
ranks, ace titles, kill tallies, fanfares or "Victory" and "Defeat" banners;
a sinking of either navy sounds and reads the same: the ship's name and what
happened); flags or ensigns (only the record's national markings on aircraft
and decks); portraits, likenesses, voices or invented words for anyone; a
slur in its own voice; the player as a named person; any capture, execution
or atrocity. A ship sinks as a silhouette going down and is gone; an
aircraft falls as a trail; a magazine explosion is a flash, smoke and a ship
that breaks, in the model style, with the card carrying what the models
cannot. The dead are counted on cards in ranges with sources and with the
scope of each figure (the battle, the night, the ship), both sides in the
same words, as the Okinawa Cornerstone of Peace and Guam's memorial wall
count them. Named individuals are those the record names; nothing is
invented about anyone, and the last of them died within living memory (the
last known member of the Pearl Harbor attack force, YOSHIOKA Masamitsu, in
2024).

### 7.5 Workflow

What an AI assistant can do: mine the open corpora; build and cross-check the
gazetteer, the tracks and the kits; write the bake tools and the sim; draft
cards with citations; choreograph from action reports. What needs people:
the print syntheses (a library card); the Japanese record (a reader of
wartime Japanese for the 戦闘詳報); archive requests (NARA RG 38 for
Washington's and Lee's reports and Sprague's for Samar); and every card that
touches the dead or the living (a historian's eye on both sides). The
Hawaiian app's standard holds: sourced research, an adversarial check, and an
audit script that checks the built thing against the research.

---

## 8. The vertical slice: Midway, 10:22

The dive on Kaga at three layers, which is the thesis in one place. R4 read
the record for it (RESEARCH.md §4).

- **Table.** The pin near 30°N 179°W in the first week of June; two routes
  converge on it, the Kidō Butai's from the north-west and TF 16 and TF 17's
  from the north-east out of Pearl Harbor; the front's edge runs just west of
  the atoll. The card: the battle, the four carriers, the tellings on the
  numbers (the Japanese dead 2,500 by the Naval War College or 3,057 by
  Parshall and Tully; the aircraft 234 or 248).
- **Box.** 04:00 to 18:00 on the Midway clock, about a hundred and ten timed
  beats from the primaries on both sides: Tomonaga's strike on the atoll, the
  shore-based attacks, the torpedo squadrons' runs and losses, the two
  dive-bomber groups arriving from the south-west and the south-east at
  10:20, Kaga hit at 10:22–10:24, Sōryū at 10:25–10:28, Akagi at 10:26 (two
  hits and a near miss in Nagumo's report, one hit and two near misses in the
  later telling), Hiryū's two strikes on Yorktown at 12:05 and 14:41, Hiryū
  hit at 17:03. The Kidō Butai's box formation at 10:20 is drawn **schematic**
  (Kaga south-west, Akagi north of her, Sōryū east, Hiryū north-east and
  drawing away, a destroyer close to each, the heavy ships out on the ring),
  because no open source gives the spacing and the primaries fix only the
  relative positions; TF 17's circular screen at noon is in the record to the
  yard. Watchable end to end; the tour's stops walk it.
- **Sortie.** 10:21:30, an SBD-3 of Bombing Six at about 5,800 m, out of the
  south-west, Kaga turning below in scattered cumulus with a destroyer close
  aboard, the Zeros low in the south-east where VT-3 drew them and none at
  altitude. Split the flaps; push over; the deck grows in the sight; release
  at about 760 m; pull out over the wake into the AA; the checkpoint at
  10:24:30 with the card: Nagumo's report counts four hits of nine, Kaga's
  own record at least one 1,000-lb and three 500-lb, and one of them is yours
  if you landed it; keep flying, and Hiryū's Zeros are coming up.

| firm | soft |
| --- | --- |
| the date, the hour, the order of attack, which squadrons dove on which carrier, the heights, the bomb loads, the weather, the outcome | the number of bombs that struck each carrier; which Zeros were where and why; the arming narrative; every casualty figure |
| TF 17's screen at noon to the yard; the Naval War College's plotted tracks (±5′) for both sides | the Kidō Butai's box spacing at 10:20; the exact positions of the US strike groups minute by minute; Hornet's group's track |

**Tone is the first decision**, as it was in Nuʻuanu. Here it is settled by
the kind of thing drawn: no people at this scale, models at true size, smoke
and splashes as the visual language, and the card carrying what the models
cannot.

**Why first.** Midway forces every system into existence at once: the table's
routes and pins, a box with an atoll and open sea, two navies' kits, aircraft
and ships both, the choreography of a long day with three clocks, the sim's
rule of §5.7 in its hardest form (a saved carrier), and the hardest kind of
sortie (a dive with a release cue and AA). It also has the richest open
record of any battle in the war.

---

## 9. Challenges and risks

1. **The record as choreography.** Every box needs minute-by-minute tracks
   from reports written in several clocks and disagreeing with each other,
   some of them "from memory" after the logs went down. Largest research
   item; zones on every instant, precision marks and tellings are the way
   through.
2. **Honest agency.** The rule of §5.7 must feel fair and read true: the
   player must see that their hit counted, that the battle answered it, and
   that the record's beats were going to happen anyway. A saved carrier and
   a sunk one both have to behave.
3. **Scale in a box.** True sizes and distances against sorties measured in
   minutes. Entering in position solves most of it; ships' time scale the
   rest (R7).
4. **Two navies' kits from numbers**, recognisable, at true size, in code.
5. **The AI around the player**: CAP, AA, evasion and the attack models, good
   enough to be a worthy opponent and bounded enough to leave the record
   alone.
6. **Tone.** A game inside a memorial, playable on both sides. The rules of
   §3.5 and §7.4 and the wording of the museums; the owner's decisions in §11.
7. **Performance** with a hundred live aircraft and particles on an
   integrated GPU, and anything at all under SwiftShader.
8. **Language.** Kanji in a UI whose fonts have none; the Japanese record
   unread until a person reads it.
9. **Data size against a committed `dist/`**: boxes multiply; the ceiling
   holds at 40 MB.
10. **Licences**: nothing traced from CC BY-SA maps or Morison; NIDS images
    cited and never shown; combinedfleet's facts, not its text; the GLO-30
    notice in every box.
11. **Scope creep.** Eight boxes invite eighty. The counts in §3.4 are the
    guard.

---

## 10. Phasing

0. **This document**, DATA.md, ENGINEERING.md, RESEARCH.md, ACCESS.md.
1. **Data first.** The chapters, the gazetteer, 80 to 100 events with
   citations, the fronts by keyframe, the routes, the sources ledger, the
   kits for v1; `check-data` green.
2. **The table.** The pack baked; the relief, the ink, the labels; the date
   axis and chapters; the front and the routes; pins and cards; the chapter
   tour. The first thing that runs, and it proves the far view with no new
   art.
3. **A box, watched.** Midway baked; the kits built; the fleets on their
   tracks; the clock scrubbable; the tour's stops. No control yet.
4. **The first sortie.** The flight model, the dive, the AA and CAP, the
   HUD, the consequences, the score and the after-card.
5. **The ship sorties.** The ship model, gunnery with time of flight and
   radar at night, torpedoes, damage; Guadalcanal and Samar baked and
   choreographed; Pearl Harbor on the Hawaiian pack.
6. **Ship.** `package.json` with gallery metadata, the thumbnail, `npm run
   build`, `dist/`, per `CLAUDE.md`; the build published as an artifact.
7. Ten-Gō, the Philippine Sea, the rest of §3.4, one at a time.

Built by parallel agents against DATA.md and ENGINEERING.md: first one
agent adapts the shared core from the staged Hawaiian copy and freezes the
contracts and the ids (ENGINEERING.md §13, Stage 0), then steps 1 to 5 run
side by side in separate worktrees with disjoint files (bake, content,
table, engine, battles), then one integration step by one agent, whose
longest job is the replay test: the untouched record must play out as the
sources tell it before any sortie is tuned. The package stays a directory
with these documents until the integration produces an app.

---

## 11. Decisions

Made by the owner on the first draft (22 October 2026):

- **Sides.** Both sides playable in any battle between military forces.
  Pearl Harbor attacked military targets, so its attack and its defence are
  sorties. The firebombing of Tokyo and the atomic bombings attacked
  civilians and are cards only.
- **Agency.** Inside a battle the player can turn its tide; nothing outside
  the battle changes. Playing is optional; watching is the alternative.
- **Name.** Pacific Theatre (§12).
- **v1.** Midway, the Second Naval Battle of Guadalcanal, Samar and Pearl
  Harbor.

Decided by the designer from the research (the owner may overrule any):

- **Time scales**: ships at two times real time for gunnery and three for
  torpedo runs and helm, aircraft at one in combat, with a bounded speed-up
  that drops back when a threat appears (R7 D2).
- **Touch controls in v1** for aircraft and ships, with the Guided aids and
  the Low quality tier by default (R7 D8).
- **The cards that touch the dead** say what the record says, in the words
  of §7.3: the US fliers captured at Midway were killed, and the card says
  so plainly with its sources (R4 §3.12); Preston's loss carries Lundgren's
  friendly-fire reading as a telling, with no shooter drawn (R5 D3); men in
  the water are never drawn, and the card says who was picked up and who was
  not, counts in tellings (R5 §12); the Bengal famine of 1943 is on the
  table as a card (R3 §11).
- **No level-bomber moment at Pearl Harbor**, whichever group: the rule of
  §3.5 and the check that enforces it win over R10's narrower carve-out.

Still open:

- **Ten-Gō's Japanese role.** Yamato's sortie was itself a surface tokkō
  (水上特攻); R3 and R8 advise only defensive moments or the TBM pilot. Not v1;
  the owner decides before the box is built.
- **How uncertainty looks** in a box: a `schematic` track drawn finer; a
  disputed hit count on the card; one visual language with the table's.
- **The Kidō Butai's box** stays schematic until someone reads *Shattered
  Sword* and Lundstrom; the owner can pull them (ACCESS.md).
- **The repository's licence**: without one the app is all rights reserved
  (R8 D15); the owner's call.

---

## 12. The name

**Pacific Theatre**: slug `pacific-theatre`, URL `/vibe-dump/pacific-theatre/`.
The owner's choice, kept in the British spelling throughout. R8 found it
usable and not unique (a closed Los Angeles cinema chain's service mark;
Koei's 1989 *P.T.O.*); a Japanese reader takes the military sense from 戦域,
not from the English word, so the app's Japanese line is 太平洋戦争 and the
dates, never a katakana title. Nothing a user sees plays on the word.

Gallery card (R8's draft, in the Hawaiian card's register):

```json
"gallery": {
  "title": "Pacific Theatre",
  "description": "The Pacific War as a sand table, from Pearl Harbor to Tokyo Bay. Follow the front and the fleets day by day; drop into a battle to watch it as the record tells it, or take one aircraft or one ship, on either side.",
  "tags": ["game", "simulation", "tutorial"],
  "status": "wip"
}
```

The boot screen's lines, each date true in its own zone:

> **Pacific Theatre**
> The Pacific War, 7 December 1941 – 2 September 1945
> A sand table of the record
>
> 太平洋戦争　1941年12月8日 – 1945年9月2日
> 記録でたどる砂盤（ジオラマ）

A native reader chooses the Japanese third line (ACCESS.md).

---

## 13. References

Checked during the design pass (October 2026); everything else named above is
to be cited in the gazetteer as it is used. RESEARCH.md carries the research
pass's own references by report, with the URLs requested and their status.

- The Hawaiian diorama's design, data contract and research standard:
  `../holo-i-ke-au/DESIGN.md`, `DATA.md`, `RESEARCH.md`, `ACCESS.md`.
- ETOPO 2022 (doi:10.25921/fd45-gt74): <https://www.ncei.noaa.gov/products/etopo-global-relief-model>;
  THREDDS catalog: <https://www.ngdc.noaa.gov/thredds/catalog/global/ETOPO2022/catalog.xml>
- Copernicus DEM GLO-30 on AWS: <https://copernicus-dem-30m.s3.amazonaws.com/>. The licence's wording for adapted data, which every box carries and the credits panel shows: "produced using Copernicus WorldDEM-30 © DLR e.V. 2010-2014 and © Airbus Defence and Space GmbH 2014-2018 provided under COPERNICUS by the European Union and ESA; all rights reserved", with "The organisations in charge of the Copernicus programme by law or by delegation do not incur any liability for any use of the Copernicus WorldDEM-30" (R8 §6.6)
- GMRT GridServer: <https://www.gmrt.org/services/GridServer> (CC BY 4.0)
- Natural Earth 10 m vectors: <https://naciscdn.org/naturalearth/10m/>
- HyperWar: <https://www.ibiblio.org/hyperwar/>; the Nagumo report (ONI Review, 1947): <https://www.ibiblio.org/hyperwar/USN/rep/Midway/Nagumo/>
- Naval War College, *The Battle of Midway … Strategical and Tactical Analysis* (1948), on archive.org
- JACAR: <https://www.jacar.archives.go.jp/>; NIDS Senshi Sōsho viewer: <https://www.nids.mod.go.jp/military_history_search/>
- combinedfleet.com TROMs: <https://www.combinedfleet.com/>
