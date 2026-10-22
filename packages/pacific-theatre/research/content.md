# Content: what was read, how the front and the routes were traced, where the tellings part

The content workflow's notes (ENGINEERING.md §13): the gazetteer, the events,
the clocks and chapters, the sources, the routes, the front, the table's
labels, and the three checks that hold them. Everything here is in
`public/data/` (`chapters`, `clocks`, `places`, `events`, `sources`,
`routes`, `fronts/`, `table/labels.json`) and `tools/check/{gazetteer,
routes,fronts}.mjs`. The authoring scripts and the downloads stayed outside
the repository; what they did is written down below so it can be done
again.

## 1. What was read

**160 sources, 115 opened, 45 not** (`sources.json`: `opened`, and `read`
full 25, part 78, title 12). By licence: 79 US government works, 3 public
domain marks (Natural Earth among them), 30 cited only, 20 held by NIDS
(cited by RefCode), 18 CC BY-SA, 3 CC BY-NC, 7 unknown.

- **The record of the battles**: the Nagumo report (*The Japanese Story of
  the Battle of Midway*) with its track chart; CINCPAC's, Spruance's and
  ComCruPac's Midway reports; the Naval War College's 1948 analysis; the
  ONI Combat Narratives of Midway and the Naval Battle of Guadalcanal (Parts
  I–III, with their zone statements quoted in `clocks.json`); South
  Dakota's report and the BuShips damage report; Hoel's and Johnston's
  reports; Morison V and XII; Kimmel's narrative and the Pearl Harbor
  Attack hearings' exhibits; the combinedfleet.com tables of movement;
  JACAR's Atago and Inazuma reports for the clock they keep.
- **The campaigns**: the Green Books (Morton's *Strategy and Command* and
  *Fall of the Philippines*, Milner, Smith, Appleman, Cannon, Crowl), read
  in part; the USSBS *Campaigns of the Pacific War* and its plates; the
  Navy's chronology of the war, turned into a dated list (one line per day)
  and used to date the islands' holders and many events; Japanese
  Monograph 97.
- **The people's cards**: the National Park Service on the Unangax̂
  removal (opened in full) and on Pearl Harbor's dead; the Hiroshima and
  Nagasaki cities' own pages; the Okinawa Prefectural Peace Memorial
  Museum and the Cornerstone of Peace; the JACL's *Power of Words*; the
  speeches and statements R8 names.
- **The front**: the War Department's *Atlas of the World Battle Fronts in
  Semimonthly Phases to August 15, 1945* (the Command and General Staff
  College's copy, scanned on archive.org: Commons answered 429 to every
  request); the Green Books' Maps 1, I, 9 and 14; General Order No. 1's
  text; Natural Earth's 1:50m land and admin-0 countries.

**Not reached**: Washington's action report (on no reachable host; known
through ONI, Morison and Lundgren); CTU 77.4.3's Samar report; the Japanese
Monographs too large to fetch (84, 98); the *Senshi Sōsho* volumes (tables
of contents only; reuse needs NIDS's permission); NPS's page on Tinta and
Faha and the Sandakan pages (unreachable from here); MOFA's text of the
2015 announcement (403); the lending-only books (Parshall and Tully,
Hornfischer, Frank), whose figures appear only as tellings "at second hand".

## 2. Clocks, times and dates

Every time names its clock (`when.clock`, 42 events on the nine frozen
clocks) or an ISO offset (`when.zone`, 48 events) where no frozen clock
fits: the local offsets of China and the Philippines (+08:00), Burma
(+06:30), Java (+07:30), Hong Kong (+08:30), Ceylon (+06:00), New Guinea
and the Solomons' Allied side (+10:00), Washington (−04:00). Most of those
events are dated to the day, where the offset only settles the date. A reading taken from a source on another clock carries
`sourceClock`, `sourceZone` and `sourceDate`, and the check recomputes them:
48 such readings, all within a minute. The navy's zone descriptions (zone
plus 12 is UTC−12) are written out in each zone note; the Midway, Ironbottom
Sound and Samar boxes keep the clocks R5 and R4 chose (zone plus 12, zone
minus 11, Item).

Chapters abut: each chapter's `to` is the next one's `from`, so the slider
has no gap; the keyframe is the front's date for the chapter.

## 3. How the front was traced

**Rebuilding it.** The front is rebuilt with the content workflow's own
scripts, kept in `tools/fronts/`: `build.py` writes the eight keyframes,
`lines.py` then writes `lines.geojson` and `manifest.json`, and `preview.py`
draws a contact sheet to look at (`--bbox=w,s,e,n --k=<px per degree>` for one
place up close). They read their downloads from the directory the
`FRONTS_DOWNLOADS` environment variable names, outside the repository:
`atlas/jp2/` (the Atlas's leaves, archive.org's jp2 zip unpacked) and `ne/`
(Natural Earth's 1:50m land and admin-0 countries as GeoJSON). They need
numpy, shapely 2 and Pillow; under `python3 -I`, which ignores `PYTHONPATH`,
`FRONTS_PYLIB` puts a directory holding them on the path, and `FRONTS_OUT`
writes somewhere other than `public/data/fronts` (`tools/fronts/paths.py`).
`classify.py` and `perimeters.py` are `build.py`'s; `atlas_register.py` made
each leaf's registration in `tools/fronts/fits/`. Run from the same downloads,
`build.py` and `lines.py` reproduce the committed files byte for byte:

```bash
FRONTS_DOWNLOADS=/path/to/downloads python3 -I tools/fronts/build.py
python3 -I tools/fronts/lines.py
python3 -I tools/fronts/preview.py 1944-08-15 --bbox=141.5,-5,146,-2.6 --k=90
```

`fronts/manifest.json` carries the method in its `method` field; in short:

- **Land only, large land only.** Natural Earth 1:50m land of 2,500 km² and
  more, grown 0.08° into the sea so the table's coast texels are covered
  (the table tints land only), on a 0.1° grid; the smaller islands are left
  to `places.json`'s held intervals, which the table draws as marks.
- **Territories.** Natural Earth's admin-0 countries place each cell in a
  territory, today's borders standing in for those of the 1940s, with
  Manchukuo (south to the Great Wall line, with Jehol and the Hsingan
  provinces), Tibet, Karafuto with the Kurils, and the Andamans drawn by
  hand. The territory says which of Japan's states a Japanese-held cell is:
  `held`; `garrisoned` for French Indochina until the coup of 9 March 1945;
  `allied-with-japan` for Thailand from 21 December 1941; occupied China
  `held` with `pointsAndLines`.
- **The Atlas keyframes** (1943-11-01, 1944-08-15, 1945-01-15, 1945-07-01;
  pages 20, 58, 78 and 98, and page 100 for the surrender): each page is a
  Mercator map. A quadratic fit to 23 points read by hand off page 20
  started the registration; then Natural Earth's coast was drawn where the
  fit put it, matched to the page's own line work in some 230 windows, and
  a cubic fitted to the matches (about 2 px residual, some 8 km on the
  page's coast); the other pages started from page 20's fit and one global
  shift. Each cell takes the page's colour by majority in a small window:
  white enemy-held, pink or deep red Allied, grey neutral, solid black the
  period's enemy gains. Page 78's inset map of central Luzon covers Java and
  is masked; the binding's shadow past the page's right edge is cut off.
  Where the page has no answer (off its map, under the inset) the territory's
  holder by date stands. The polygons are `mapped` where most of their cells
  came from the page.
- **Where the record overrides the page**: the Soviet Union is `soviet`;
  Mongolia `neutral` (the page paints it with China) until it declares war on
  10 August 1945; Tibet, Nepal and Bhutan neutral; India, Ceylon and
  Australia Allied; the page's pink along the coasts of Thailand and
  Indochina is the sea's, not ground held. These are `schematic`.
- **Before the Atlas** (1941-12-06, 1942-05-08, 1942-09-15) the keyframes
  are `schematic`: the territories' holders by date; occupied China taken
  from the Atlas's first page (to 1 July 1943), the nearest public-domain
  map of that front; and hand regions for 1942's own fronts: Mindanao and
  the Visayas contested until the surrenders of May, Dutch New Guinea and
  Portuguese Timor contested, Lae and Salamaua, New Britain, New Ireland
  and Bougainville held, the Kokoda Track and Buna contested, Guadalcanal
  contested in September.
- **The surrender** (1945-09-02): General Order No. 1's zones laid over the
  land Japan still held on page 100, by territory and by the 16th and 38th
  parallels: China, Formosa and Indochina north of 16° to Chiang Kai-shek;
  Manchuria, Korea north of 38°, Karafuto and the Kurils to the Soviet
  command; Burma, Thailand, Malaya, Indochina south of 16°, the Andamans,
  Sumatra and Java to South East Asia Command; Japan, Korea south of 38°
  and the Philippines to MacArthur (`zone-swpa`). Paragraph 1(c) leaves the
  split between SEAC and the Australian forces "to be arranged"; Borneo, the
  islands east of Bali, New Guinea, the Bismarcks and the Solomons are drawn
  `zone-swpa` (the Australian forces, under SWPA), as the surrenders were
  taken. `zone-cincpac` covers only islands, which the held intervals draw.
- **Perimeters**: on the Atlas keyframes, the edge of the page's white sea
  where it meets the pink, away from land and from the page's frame (the
  Atlas paints "ocean areas in the wake of our advance" as Allied); in 1942,
  the limit of advance from Morton's Map I and Map 9 with the Gilberts,
  Nauru, Ocean Island, the Aleutians and the Kai, Aru and Tanimbar groups at
  the record's dates.
- **Declared lines** (`lines.geojson`): Japan's planned perimeter (Morton's
  Map 1, "approximate limit of objective area", shown from 7 December 1941
  until Midway); the Absolute National Defence Zone, 絶対国防圏 (Maps 9 and
  14, from 30 September 1943 until Tōjō's cabinet falls in July 1944); the
  16th and 38th parallels on the day of the surrender.

**Weaknesses a reader should know**: today's borders (Thailand's wartime
annexations in Laos, Cambodia, Malaya and the Shan States are not drawn);
1941–42's China from a 1943 map; the Atlas's own simplification (it paints
the interior of New Guinea as enemy-held until the Allies hold the coast);
page 100 is the situation to 1 August 1945, not 15 August.

## 4. How the routes were traced

40 routes (20 fleet, 11 convoy, 3 lane, 2 strike, 2 air, 2 campaign).

- **Charts** (7, `chart`): the Kidō Butai to Pearl Harbor (USSBS
  *Campaigns* App. 2, north to the right) and to Midway (the Nagumo report's
  track chart, its noon positions re-read on the chart's 170° and 180°
  meridians and 30° and 40° parallels as Mercator, agreeing with R3 within
  0.15°); Kurita, Nishimura, Shima and Ozawa to Leyte Gulf (App. 93,
  Mercator 110–130° E); Ten-gō (App. 100, on Item). Waypoints carry the
  chart's own labels ("0130/5", "00/23") and the clock conversions.
- **Narrative and schematic** routes join named places in the order the
  record gives, with `schematicSegments` for the legs no source fixes.
- **The sea rule**: every sea route was laid round Natural Earth 1:10m land
  and minor islands (a shortest path on a 0.05° grid between the given
  points, then simplified), and checked against the bake's own
  `table/coast.json` on the integration branch: clean, after moving two
  legs off Johor and one off the Indispensable Reefs.
- **The boxes**: the three fleet routes that name box units end where the
  battle workflow's `battle.json` puts those units at the box's start (DATA.md
  §5, 20 km). The Kidō Butai's 04:30 point moved some 65 km south of the
  chart's reading onto the box's track (dead reckoning back from NWC's 07:00
  fix); TF 64's 20:00 point is ONI's (the box's), not Morison's flag
  navigator's fix eighteen miles south; Kondō's force ends at the box's first
  position west of Savo at 22:45. The routes' notes keep the readings they
  left.
- No route is drawn for the atomic missions.

## 5. Where the tellings part

Numbers live in `tellings` only, each with its source, and the summaries and
stops carry none. Seventeen events carry more than one telling; the ones a
reader meets first:

- **Pearl Harbor**: 2,390 American dead (NPS) against the older 2,403;
  Japan's dead 64 against an unexplained 129; the battleships' hits by the
  BuShips summary against the ships' own count of 19 December 1941; Arizona's
  bomb from a dive bomber (CINCPAC) or a level bomber (Hiryū's table, ja
  Wikipedia).
- **Midway**: 307 American dead (CINCPAC); the Japanese dead 2,500 (NWC,
  citing USSBS) against 3,057 (Parshall and Tully, at second hand) and the
  carriers' own tables; the "five minutes" of Fuchida against the Nagumo
  report's readiness signal for 10:30; the CAP drawn down (Spruance) or
  drawn south-east (Parshall and Tully).
- **The Naval Battle of Guadalcanal**: Kirishima's sixteen-inch hits 8
  (Lee), about 9 (Tokuno), 17 to 21 (the 2019 survey of the wreck); South
  Dakota's dead 38, 30 or 39; Kirishima scuttled (Tokuno, Morison) or
  capsized while being abandoned (Lundgren), at 03:20, 03:23 on zone minus
  12, or 03:25.
- **Samar**: Johnston's dead 186 (Morison) or 152 (the survivors'
  association); the losses at second hand; Yamato's first salvo at 05:58 on
  her own clock, an hour behind Item.
- **Bataan**: the march's dead from about 5,500 to more than 18,000.
- **Okinawa**: more than 200,000 lives, more than 100,000 of them civilians
  (the prefecture's museum); 242,225 names on the Cornerstone of Peace.
- **Hiroshima and Nagasaki**: roughly 140,000 by the end of 1945 (the city)
  against USSBS's 70,000–80,000; 73,884 (Nagasaki's 1950 report) against
  35,000–40,000.
- **The comfort system**: 20,000 to 200,000 women by most historians'
  estimates, up to 410,000 by Chinese scholars'; the UN's "military sexual
  slavery" (1996) and the Japanese government's objection (2019).
- Smaller partings: Attu and Kiska's dates (5 and 7 June, or Kiska on 6 June
  on zone plus 10); Nauru's (25, 26 or 29 August 1942); the Ke evacuation's
  span; Yamato's position as she sank; the incarceration's 110,000 or
  120,000.

## 6. What needs a person

- **The Japanese readings above all.** 151 of 156 places' and 76 of 84
  events' `ja` carry `verify: true`; the labels' Japanese names (taken from
  the places or written here) and the planned perimeter's 第一段作戦の攻略範囲
  (a description, not a quotation) want the same reader. Six card-only and
  people's events have no Japanese name at all (the check warns).
- The dates marked `*verify*` in `notes`: Sumatra's Dutch surrender, Timor's
  landings, the Malaya convoys' sailing from Samah, TF 16's and TF 17's
  sailing, the Coral Sea strike area, Kondō's passage east of Santa Isabel,
  and the event notes' figures known only at second hand.
- The front's hand regions (1942) and its territories by today's borders,
  against a period map of each.
- `units` on the five box routes name the battle workflow's ids as read from
  its `battle.json` at the integration branch's head.
