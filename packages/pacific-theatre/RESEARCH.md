# Pacific Theatre: the research record

What was read, by whom, what it settled, what it could not reach and what
still needs a person, for everything in `DESIGN.md`, `DATA.md` and
`ENGINEERING.md`. This file is the index and the designer's synthesis; the
reports themselves are under [`research/`](./research/), one per
researcher, and are the record. Each report follows the Hawaiian standard
(`../holo-i-ke-au/RESEARCH.md`): what was opened against what is believed,
every number with its source, every disagreement as tellings, and an honest
account of the walls. `ACCESS.md` consolidates the walls.

Written 22 October 2026. The research pass was run as ten Opus agents in
parallel from one brief (`research/BRIEF.md`), each writing one report, and
a critic over all of them; the designer read every report and made the
decisions recorded in the design documents and below.

## 1. The reports

| report | topic | size | what it settled |
| --- | --- | --- | --- |
| [R1 terrain and bathymetry](./research/R1-terrain-data.md) | the data pipeline: ETOPO 2022 over OPeNDAP, Copernicus GLO-30 by range reads, GMRT, Natural Earth, the projection, the budget, a proof-of-concept bake | 52 KB | the sources and readers for every pack; the azimuthal equidistant table; the half-land rule; the PNG budget (DATA.md §§1–3, 7, 11) |
| [R2 sources](./research/R2-sources.md) | the open corpus and the ledger: HyperWar, archive.org, the War College analyses, the Australian histories, the Japanese official history and action reports, the TROMs, the print syntheses, copyright, the clocks | 110 KB | a draft `sources.json` of 78 entries; the backbone records for each v1 battle; the zone on every time; the licence rules; names both ways (DATA.md §4; DESIGN.md §7) |
| [R3 timeline](./research/R3-timeline.md) | the chapters, 109 events and 13 prologue cards, the table's extent, the front by keyframe, the routes, calendars and clocks | 163 KB | eight keyframes on dated public-domain maps; the 78°E–155°W box centred at 7°N 141.5°E; the Green Books' way of drawing control; `clocks.json`; the event vocabularies (DESIGN.md §3; DATA.md §§4–6) |
| [R4 the air battles](./research/R4-air-battles.md) | Midway minute by minute from the primaries on both sides; Pearl Harbor, Ten-Gō, the Philippine Sea and Santa Cruz in outline; the moments | 109 KB | about 110 timed beats for Midway; TF 17's screen to the yard; the Kidō Butai's box as schematic; which moments to offer and which not (DESIGN.md §8) |
| [R5 the surface battles](./research/R5-surface-battles.md) | Guadalcanal's second night and Samar in full; Surigao, Savo, the first night, Tassafaronga and Empress Augusta Bay in outline; the mechanics the sim needs | 120 KB | Washington's fire salvo by salvo; the two clocks inside one official document; Kirishima's hits by telling (8 to 21) and the wreck survey; Kurita's own disposition sketch (public domain); Taffy 3's track from a public-domain chart; Kumano's hit at 07:27 by a run-time check; nine moments with every field (DESIGN.md §3.4; DATA.md §9) |
| [R6 kits](./research/R6-kits.md) | the ship classes and aircraft types of the v1 battles: dimensions, batteries, silhouettes from the recognition manuals, colours and markings by date, the fatal calibration | 105 KB | eight parseable tables for 22 ship classes and 18 aircraft types; block positions measured off the public-domain plates (±0.02), with the unmeasured rows named; the manuals' numbers rejected for post-war figures; the carrier hangar as the fatal variable; AP over-penetration of thin hulls; the dated torpedo failure rates; the insignia dates; NACA's roll-rate and dive-flap tests (DATA.md §8) |
| [R7 game design](./research/R7-game-design.md) | the precedents, and numbers for the flight and ship models, AA, CAP, damage, the HUD, the controls and the budget | 123 KB | true distances, compressed time with a bounded player speed-up; a shell drag model within 2 % of the range tables; physical ship time constants; the group rule against the record's own survivors; the two-track damage model with a hangar hazard, calibrated to Kaga, Yorktown, Kirishima, South Dakota and Johnston; AA as a calibrated hazard; mouse-aim; restartable checkpoints; the cascade bounded and labelled (ENGINEERING.md §5, §8, §12) |
| [R8 tone](./research/R8-tone.md) | how each side's museums frame the war; the terms; the named people and the living; the rules the app practises; the hard cases the owner's decisions create; licensing; the name | 105 KB | the never-list; the four rules for the hard cases; the words for the dead; family name first; tokkō; the incarceration; the credits panel and the GLO-30 wording; the gallery card (DESIGN.md §§3.5, 7.3–7.4, 12; DATA.md §10) |
| [R9 reuse](./research/R9-reuse.md) | the audit of the staged Hawaiian code module by module; units, precision and depth; the architecture reviewed as lead engineer; the order of work | 125 KB | Stage 0 before the fork; Float64 in the sim; the log-depth chunk rule; one ground interface; the clock rewrite; the hand-over as a cut; the five workflows' files (ENGINEERING.md throughout) |
| [R10 Pearl Harbor](./research/R10-pearl-harbor.md) | the attack in full on both sides: the waves, the geometry, the berths, the minute-by-minute record, the defence, the box, the moments | 131 KB | the 1941 offset (UTC−10:30) proved from the record; the launch point measured from Lānaʻi, not Oʻahu; the six carriers' air group records in JACAR; the berths from ComBatShips; the BuShips damage summary as the authority; the NPS's current 2,390 dead; a 100 km island box baked for 1941 from CUDEM; ten moments on both sides, the level bomber held to Akagi's group so Arizona's explosion is never the player's (DESIGN.md §3.4–3.5; DATA.md §7, §9) |
| the critic | gaps and contradictions across the reports and the documents | the report in `tasks/` | eighteen gaps and twenty-nine contradictions, every one taken into the documents before the fork: the four boxes' ids, bounds and clocks; a weapons file and the kit ids the boxes need; the aircraft kits' flight-model fields; a sight model; entry points for off-box groups; the surface record's event kinds; kebab-case clock ids and one side vocabulary; `year` precision; the Pearl Harbor box's terrain and credits; the convergence at Midway; the tone questions left open |
| [bake](./research/bake.md) | the table and the four boxes as baked: what was fetched, the coast, the boxes' sources, Pearl Harbor set back to 7 December 1941, the measured statistics | 25 KB | ETOPO 2022 60″ for the table, GLO-30, GMRT and CUDEM for the boxes; the 1941 shore undone work by work on the dated record; summits within a texel of R1's; 15.7 MB of packs (DATA.md §§2–3, 7, 11) |
| [content](./research/content.md) | the clocks, chapters, places, events, routes, sources, fronts and labels: what was read and how the front and the routes were traced | 14 KB | 160 sources (115 opened), 230 places, 90 events, 40 routes, eight front keyframes, 255 labels; the box battles' fleet routes laid onto the boxes' tracks (DATA.md §§4–6) |
| [table](./research/table.md) | the far view: the relief as a chart, the ink, the DOM labels, the front's two masks, the pins, the tour, the cards, SwiftShader | 13 KB | the decisions D1–D11 of the table workflow (ENGINEERING.md §§10–11) |
| [engine](./research/engine.md) | the kits, what was ported from R7's scripts, the sim, the parameters and the calibration | 18 KB | 56 ship and 25 aircraft kits with sources; R7 §8's calibration cases passing in bands; the engine's departures, now in ENGINEERING.md §5 "As built" |
| [battles](./research/battles.md) | what the four battle files follow: conventions, each battle's positions, schedule and moments, the check | 21 KB | 423 units, 86 groups, 518 events, 53 stops and 23 moments on both sides from the primaries (DATA.md §9) |
| [engine-2](./research/engine-2.md) | round two's engine as built: the sim's rows, takes, stations, sortie and assist, Battle's calls and events, the AA director, the gunner, the bombardier, the release cue, the casual hands, the departures | 48 KB | any unit taken at any station with a soft take and spares; Assisted flight's limits, floor and easing; parts 4–6 of the gate (ENGINEERING.md §§5, 8, 9 "As built (round two)"; DATA.md §8) |
| [ui-2](./research/ui-2.md) | round two's interface: the unit list, the unit card, the box's bar, Start here, the after-card over a span, the URL's unit and station, the setting, every call into Battle, the mock and its dev page | 23 KB | one row an air group; `#unit` offers and never takes; the bar at the top while a unit is held (ENGINEERING.md §11 "As built (round two)"; DESIGN.md §5.7) |
| [content-2](./research/content-2.md) | the prologue front and the first doors: what each of the six keyframes stands on, the hand regions, the sources, the four doors | 17 KB | six schematic keyframes from Mukden to southern Indochina; the prologue's keyframe 1931-09-18; one gentle take-over a box (DATA.md §§6, 9; DESIGN.md §3.1) |
| the integration | the five merged: the ledger, the wiring, the cross-references, the replay test, the font, the thumbnail | this file, §2 and §3 | `tools/replay.mjs` (every box replays its record untouched), `tools/check/cross.mjs`, `src/link.js`; the tuning and the fixes listed in §2 |
| [content-3](./research/content-3.md) | round three's scenarios: Samar, Midway and Ironbottom Sound as wargames, what each rests on, the formations from the record's first contact, the aircraft on deck, the check | 27 KB | three scenario files with every unit from the boxes, Taffy 3's aircraft carrier by carrier from the captains' reports (two squadrons stand-ins), the side names with a leader line, the goals' extra fields (DATA.md §13; DESIGN.md §5.11) |
| [engine-3](./research/engine-3.md) | round three's arena as built: the surface, the arcade models, weapons and damage, the AI's ranging, the admiral, smoke, squalls and night, the objectives, the departures, the balance | 43 KB | a sim of its own in the record's state layout; the AI's gunnery walked in and paced; the balance by the integrator (§8: Samar 50 % and 45 %, the other two not shipped) (ENGINEERING.md §§5, 7–9 "As built (round three)") |
| [ui-3](./research/ui-3.md) | round three's interface: the doors, the start sheet, the HUD layer, the markers, the respawn line, the end card with its reel, every call into the arena and Battle, the mock | 25 KB | a tally is what a side did; `#wargame` offers and never starts; Japan's bar on the left; the bar's wargame mode (ENGINEERING.md §11 "As built (round three)") |

## 2. The decisions, and where each came from

The owner's four (DESIGN.md §11): both sides playable in any battle between
military forces, Pearl Harbor included, the attacks on civilians cards only;
inside a battle the player can turn its tide and nothing outside it moves;
the name Pacific Theatre; v1 is Midway, the Second Naval Battle of
Guadalcanal, Samar and Pearl Harbor.

The designer's, from the reports:

| decision | from | recorded in |
| --- | --- | --- |
| azimuthal equidistant table, centred 7°N 141.5°E, box 78°E–155°W, 42°S–56°N | R1 §5, R3 §4 | DESIGN §3.2; DATA §1 |
| ETOPO 2022 60″ over OPeNDAP for the table; GLO-30 by range reads for box land; GMRT with ETOPO 15″ fallback for box sea; Natural Earth for coastlines and positions only; land decided by Natural Earth or GLO-30, never by ETOPO | R1 §§1–4 | DATA §§2–3, 7, 11 |
| packs: table `0.5 m, −11000`; boxes `0.25 m, −11000`; boxes at 1024 by default, 2048 for Ironbottom Sound | R1 §6 | DATA §2 |
| cards from 1931, the map from 6 December 1941; eight keyframes on dated maps | R3 D1–D2 | DESIGN §3.1 |
| the front as filled land by state, islands as dated intervals with cut-off garrisons, dashed perimeters, no sea fill, declared lines | R3 D4 | DESIGN §5.4; DATA §6 |
| the last keyframe as General Order No. 1's zones | R3 D5 | DESIGN §3.1 |
| every time with its source's offset; `clocks.json`; ISO offsets only (zone +12 is `-12:00`); UTC computed | R2 D1, R3 D7, R9 §2.6 | DATA §4; ENGINEERING §4 |
| each box shows one named local clock (Midway +12; Guadalcanal −11; Samar Item; Pearl Harbor HST) with the others on the card | R2 D1, R4 D1, R3 §7.4 | DESIGN §5.5 |
| the backbone records per v1 battle: a US primary, a Japanese primary, an official analysis | R2 D2 | DESIGN §7.1 |
| Morison and the TROMs cited and never copied; nothing traced from Commons; NIDS images cited and never shown; fronts and tracks only from public-domain US charts | R2 D4–D6, R8 §6 | DATA §4, §6 |
| casualty figures as ranges with the scope of each | R2 D7, R4 D10 | DESIGN §7.4 |
| kits' silhouettes from ONI 41-42, ONI 222-J and TAIC No. 1 | R2 D8 | DESIGN §5.8 |
| family name first in capitals with kanji; macrons; the Pacific War / 太平洋戦争; tokkō; the incarceration; the words for the dead | R8 D8–D13, D18 | DESIGN §7.3 |
| the Kidō Butai's box at 10:20 drawn schematic until a person reads *Shattered Sword* | R4 D2 | DESIGN §8; ACCESS.md |
| Torpedo Eight is a stop with a card, not a sortie | R4 D3 | DESIGN §3.4 |
| the scripted beats follow the target's own report; the other tellings on the card | R4 D6 | DATA §9 |
| no compression inside a sortie; moments begin at the contact point | R4 D7 | DESIGN §5.5 |
| fixed fates for Arizona, Oklahoma and Utah; no high-level bomber moment at Pearl Harbor | R8 D1, D4 | DESIGN §3.5; DATA §9 |
| the after-card in four parts; people only in the record | R8 D2 | DESIGN §5.7; ENGINEERING §11 |
| the Samar clock closes before the attack on St. Lo | R8 D3 | DATA §9 |
| nothing that is a person is a target; no figures, parachutes, flags, voices or named-person roles | R8 D5–D7 | DESIGN §7.4; ENGINEERING §5 |
| the credits panel, the briefing footer and `NOTICE.md` with the GLO-30 wording and liability sentence | R8 D14 | DATA §7; ENGINEERING §11; NOTICE.md |
| post-war numbers for the sim, the recognition plates for the silhouettes only; `blocksPrecision`; metric tonnes; the turning rule where unsourced; dated torpedo failure rates; `star-no-red` at Midway | R6 D1–D11 | DATA §8 |
| true distances and sizes; time scales 1×/2×/3× with a bounded, threat-interrupted player speed-up; `maxTimeScale` | R7 D1–D2 | ENGINEERING §5; DATA §9 |
| the group rule against the record's own survivors; `attack.reached` | R7 D7 | ENGINEERING §5; DATA §9 |
| the two-track damage model (fight, float, list, fires, hangar hazard, systems, doomed); `crippledAt`; the calibration cases as tests | R7 §4.8, §8 | ENGINEERING §5, §12; DATA §8–9 |
| physical ship time constants; Nomoto helm; historical dispersion; the firing table precomputed | R7 D3, §4.4 | ENGINEERING §5 |
| AA as a Poisson hazard calibrated to four record events; rounds as effects only | R7 §4.6 | ENGINEERING §5 |
| mouse-aim default; R/F throttle; Backspace releases; touch in v1 with Guided aids | R7 D4, D8, §3 item 7 | ENGINEERING §8 |
| a moment always restarts the box from the record; a saved carrier bounded and labelled "the sim's guess"; fly home at 32× | R7 D10–D12 | ENGINEERING §5 |
| no points total, medals, ranks or grades; personal bests kept locally | R7 D9 | DESIGN §5.7 |
| Guadalcanal's box clock UTC+11, the −12 primaries converted; Kirishima calibrated to the wreck survey's 17–21 hits with the loss hours later; Preston's shooter unnamed; the TROMs' Samar times anchored to a US event; Kurita's own sketch for the disposition; Kumano hit at 07:27 | R5 D1–D6 | DATA §9; the battles' data |
| the Pearl Harbor box as a 100 km island box at 2048, baked for 1941 from CUDEM and GLO-30, carriers off the box, clock 06:30–10:00 HST; the BuShips summary as damage authority; the NPS's 2,390; the level-bomber role held to Akagi's group and deferred; the midget submarines never playable; `sites` for the ground's targets; the flown counts (183 and 167) | R10 D1–D14 | DATA §7, §9; DESIGN §3.4 |
| Stage 0 before the fork; frozen ids; `check-data` split per workflow | R9 E5, E15 | ENGINEERING §13 |
| the logarithmic depth buffer with the chunk rule; Float64 in the sim; camera-relative instancing | R9 E1–E2 | ENGINEERING §2 |
| box exaggeration fixed at 1.0; v1 boxes sized to hold every coast seen (R9 E7's Oʻahu-pack footprint for Pearl Harbor superseded by R10 D1–D2's 100 km box baked from CUDEM) | R9 E3, E6 | DATA §7 |
| the hand-over as a fly-down and a cut, never two scenes at once | R9 E4 | DESIGN §5.6; ENGINEERING §9 |
| DOM labels; a fixed war-room light on the table; the prologue a tenth of the slider; a dated ephemeris in a box; point lights for the night | R9 E9–E13 | ENGINEERING §§7, 10 |
| one Japanese font weight, subset at integration; `geotiff` 2.1.3 pinned | R9 E16–E17 | ENGINEERING §0, §12 |

The workflows', after the fork (each workflow's notes under `research/`
say why), and the integration's:

| decision | from | recorded in |
| --- | --- | --- |
| Midway's box widened east to hold TF 16 and TF 17 (179.3°E–184.0°, 1908 × 2048) | battles, the project manager | `tools/check/ids.json`; DATA §7 |
| the 1941 shore at Pearl Harbor undone work by work at the 50 m texel; drydocks No. 2–4 filled; CUDEM for the harbour floor | bake §5 | `boxes/manifest.json` `shore`; NOTICE.md |
| the coast clipped to the table's projected rectangle, not only its lon/lat envelope | the project manager; the integration | `tools/bake-table.mjs` `clipCoastToTable` |
| peoples outside the frozen side codes in `alsoSides`, shown on the card beside the sides | content; the integration | `events.json`; `src/ui/card.js` |
| one source ledger: the engine's and the battles' fragments merged into `sources.json` by id and URL, twelve duplicate ids folded | the integration | `sources.json` (369 sources) |
| the record's hit `damage` is the share of fatal the whole event does; sixteen shares raised so every ship the record sinks is past fatal within ten minutes of her last hit (Kaga past it at 10:23:30) | the integration's replay test | `boxes/*/battle.json`; ENGINEERING §5 "As built" |
| an attack may name a list of targets, its aircraft shared a section each; aircraft that did not reach the release beyond the record's losses turned back, not lost; a CAP's thinning against the record's own now | the integration's replay test | `src/battle/sim/record.js`, `index.js`; ENGINEERING §5 |
| the AI gunnery's blind factor and manoeuvre penalty; the steady Washington band at 60 % of runs, not 80 % | engine §6 | ENGINEERING §5 "As built" |
| Battle keeps both sides of the hand-over; `src/link.js` wires the UI; Esc while flying down aborts; Back leaves a box | the integration | ENGINEERING §9 "As built" |
| the Kidō Butai's Pearl Harbor route laid on the box's carriers at 06:30, about 95 km east of the chart's launch point, the chart's reading kept in its note | the integration (the route–box check) | `routes.json` |
| round two: a group sent at a fixed unit or named as its cause greyed whole; `offBox` units not takeable; a group of one takeable unless its crew is named; `sim.units()` rows carry `state`; bombardier on a `level` attack; `#unit`/`#station` select and never take; one owner for L, Enter and Tab | the project manager's decisions 19–25 | `src/battle/sim/takeover.js`, `src/link.js`; DESIGN §5.7, ENGINEERING §§5, 8, 9 "As built (round two)" |
| round two: a soft take, so an untouched unit given back leaves the box undiverged; Assisted eases what attacks the player as Guided does; the first hints kept across visits | engine-2 §7 | ENGINEERING §5 "As built (round two)" |
| the record's legs held to their kits' top speeds; seven legs retimed (never moved) in the four battle files; the record's late CAP fighters patrol where they were sent rather than chase a strike out of the box | the project manager's decision 28; the integration | `tools/check/battle.mjs`, `boxes/*/battle.json`, `src/battle/sim/record.js`; DATA §9 |
| the prologue front in six schematic keyframes; labels dated (`from`, `to`); "not held by Japan" on a prologue date | content-2; the project manager's decision 26 | `fronts/manifest.json`, `table/labels.json`; DATA §§3, 6; DESIGN §3.1 |

Where a report's recommendation was not taken:

- R4 D5 (the record's hits always happen; a player's hit where the record
  has a miss is scored beside it) was written before the owner decided the
  player can turn the tide; the authority rule of ENGINEERING.md §5
  supersedes it.
- R4 D9 and R3 D11 advised against moments on Battleship Row and Yamato's
  helm; the owner's decision admits the Pearl Harbor attack (with R8's four
  rules), and Ten-Gō is deferred with R8's advice that only defensive
  moments be offered (DESIGN.md §11).

## 3. Still needs a person

Consolidated from every report's own list; ACCESS.md has the walls and what
each would unlock.

- **A reader of wartime Japanese** for the JACAR 戦闘詳報 of the v1 battles
  and the Senshi Sōsho chapters R2 §8 names, to extract times, courses,
  positions and losses and check them against the US records and the 1947
  translation of Nagumo's report (R2, R4).
- **A reader of *Shattered Sword* and *The First Team*** for the Kidō Butai's
  stations and spacing at 10:20, the CAP chronology, Best's approach, the
  torpedo squadrons' targets and each carrier's AA fit (R4).
- **Archive requests** for Washington's and Lee's reports of 14–15 November
  1942 and Sprague's of Samar (R2), without which the Washington bridge
  moment rests on Morison, the South Dakota damage report and the Japanese
  side.
- **A Japanese speaker** to check every reading and romaji in the data and
  to choose the boot screen's third line (R2 D10, R8 §7.4).
- **A historian's eye on both sides** over every card that touches the dead
  or the living, and over the Japanese-side moments and the Pearl Harbor
  attacker's seat before they ship (R4 §13, R8 §11).
- **An almanac check** of sun and moon for the four battle dates, Ironbottom
  Sound on 14–15 November 1942 above all (R9).
- **The owner's call on a repository licence**: without one the app is all
  rights reserved; MIT for code with a separate data notice is the usual
  shape (R8 D15).
- **A check of the inboard and outboard ships on Battleship Row** against
  CINCPAC's harbour chart (R4), and of Solace's berth (R8).

From the workflows and the integration (each workflow's notes say more):

- **A reader of Japanese for the data's readings**: 151 of 156 places' and
  76 of 84 events' `ja` carry `verify`; six people's and card-only events
  have no Japanese name; no battle stop, moment or after-text has a Japanese
  version yet (every moment's `ja` is null but one); the planned perimeter's
  第一段作戦の攻略範囲 is a description, not a quotation (content §6, battles).
- **A reader of the JACAR records in Japanese** for the carriers' action
  reports at Midway, CruDiv 7's detailed report and charts at Samar
  (C08030037100), and the Pearl Harbor air group records; **Senshi Sōsho 43
  and 83** for the Kidō Butai's relative positions at 10:20 and Kondō's
  dispositions on 14–15 November (battles).
- **A person to fly the 23 moments** with a mouse and a touch screen: the
  instructor's gains, the chase camera's lag and the bindings have been
  exercised by scripts only; the smoke test's autopilot loses most dive
  bombers in the pull-out (engine §7; the integration).
- **AI gunnery cases for Samar's long-range fire and the Japanese night
  gunnery** at Guadalcanal; the era factors, sight ranges and the torpedo
  failure rates still at their *verify* defaults (engine §7).
- **Frame time on a real GPU**: every measurement here is SwiftShader's
  (about 0.6–1.3 s a frame on the table and in a box); the Low quality tier
  for phones is not tuned (table §2, engine §7, the integration).
- **The table on the real data, by eye**: `relief.js`'s ramp,
  `labels.js`'s RANK_RANGE, `coast.js`'s size classes and `states.js`'s
  colours were tuned on the fixtures (table §2); the front's colours and
  legend words want a historian's and the designer's eye (table §3).
- **Pearl Harbor's shore**: the Keʻehi airport fill against the 1938 sheet;
  Drydock No. 2 on the day; a georeferenced 1941 harbour chart and
  ComBatShips' berthing plan for the berths (bake §9, battles).
- **The GLO-30 licence** for committed derived packs on a public site, read
  by someone who reads licences (bake §9).
- **The dates marked *verify*** in the content notes, and the front's 1942
  hand regions against period maps (content §6).
- **The schematic positions at Pearl Harbor and Samar** watched against the
  baked terrain in the app (battles); nothing checks a ship against land.
- **The project's owner**: `odbl` and the peoples' side codes are not in the
  frozen vocabularies (`tools/check/ids.json`), so OpenStreetMap is
  `licence: unknown` with a note and 30 events carry `alsoSides`.

## 4. Measured at the integration

Under SwiftShader in the container's Chromium (1280 × 800, MSAA off, DPR 1):
no GPU was measured, so these are the CPU's numbers, for comparing with each
other only.

| where | frame | draw calls | triangles | JS heap |
| --- | --- | --- | --- | --- |
| the table, the whole theatre | about 1.0–1.3 s | 21 | 100,000–118,000 | 19–21 MB (68 MB of buffers once a box has been in) |
| the table, the Solomons at 300 km | about 0.9 s | 16 | 97,000–117,000 | |
| Midway, watching (675 slots) | 0.64–0.73 s | 144 | 87,000 | 20–21 MB |
| Pearl Harbor, watching (769 slots) | 0.72–0.81 s | 213 | 228,000 | 20–22 MB |
| Ironbottom Sound, watching (86 slots) | 0.54–0.65 s | 121 | 51,000 | 18–19 MB |
| Samar, watching (156 slots) | 0.59–0.60 s | 105 | 62,000 | 19–20 MB |

A box boots from its URL in 13–22 s there (the table first). Every box draws
faster than the table, so none is unusable and **the depth fallback of
ENGINEERING §2 is not taken**: one logarithmic depth buffer for both scenes
stays, until a person measures an integrated GPU. The replay test runs the
four boxes untouched at the sim's 1/60 s step in 155 s (Midway), 141 s (Pearl
Harbor), 33 s (Ironbottom Sound) and 71 s (Samar) of node time; the data is
17.8 MiB (`public/data/`), the build 20 MB.

Round three (27 October 2026), the same Chromium: Samar's wargame draws in
0.6–1.3 s a frame with 56–59 units and up to 1,050 particles; the
fixture's in 76 ms (66 draw calls, 43,500 triangles, 38 MB of heap). The
arena's step in node is 0.18 ms mean and 0.63 ms at the 99th percentile
for Samar (the contract asks under 2 ms). A hit marker lives 1.5 s of page
time, so at a frame a second it is seen for a frame or two; the slow
motion likewise. Neither has been seen at sixty frames.
