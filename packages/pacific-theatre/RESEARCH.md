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
| [R5 the surface battles](./research/R5-surface-battles.md) | Guadalcanal's second night and Samar in full; Surigao, Savo, the first night, Tassafaronga and Empress Augusta Bay in outline; the mechanics the sim needs | *pending* | *to be filled when the report lands* |
| [R6 kits](./research/R6-kits.md) | the ship classes and aircraft types of the v1 battles: dimensions, batteries, silhouettes from the recognition manuals, colours and markings by date, the fatal calibration | *pending* | *to be filled when the report lands* |
| [R7 game design](./research/R7-game-design.md) | the precedents, and numbers for the flight and ship models, AA, CAP, damage, the HUD, the controls and the budget | *pending* | *to be filled when the report lands* |
| [R8 tone](./research/R8-tone.md) | how each side's museums frame the war; the terms; the named people and the living; the rules the app practises; the hard cases the owner's decisions create; licensing; the name | 105 KB | the never-list; the four rules for the hard cases; the words for the dead; family name first; tokkō; the incarceration; the credits panel and the GLO-30 wording; the gallery card (DESIGN.md §§3.5, 7.3–7.4, 12; DATA.md §10) |
| [R9 reuse](./research/R9-reuse.md) | the audit of the staged Hawaiian code module by module; units, precision and depth; the architecture reviewed as lead engineer; the order of work | 125 KB | Stage 0 before the fork; Float64 in the sim; the log-depth chunk rule; one ground interface; the clock rewrite; the hand-over as a cut; the five workflows' files (ENGINEERING.md throughout) |
| [R10 Pearl Harbor](./research/R10-pearl-harbor.md) | the attack in full on both sides: the waves, the geometry, the berths, the minute-by-minute record, the defence, the box, the moments | *pending* | *to be filled when the report lands* |
| the critic | gaps and contradictions across the reports | *pending* | |

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
| Stage 0 before the fork; frozen ids; `check-data` split per workflow | R9 E5, E15 | ENGINEERING §13 |
| the logarithmic depth buffer with the chunk rule; Float64 in the sim; camera-relative instancing | R9 E1–E2 | ENGINEERING §2 |
| box exaggeration fixed at 1.0; v1 boxes sized to hold every coast seen; Pearl Harbor on the Oʻahu pack's footprint | R9 E3, E6–E7 | DATA §7 |
| the hand-over as a fly-down and a cut, never two scenes at once | R9 E4 | DESIGN §5.6; ENGINEERING §9 |
| DOM labels; a fixed war-room light on the table; the prologue a tenth of the slider; a dated ephemeris in a box; point lights for the night | R9 E9–E13 | ENGINEERING §§7, 10 |
| one Japanese font weight, subset at integration; `geotiff` 2.1.3 pinned | R9 E16–E17 | ENGINEERING §0, §12 |

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
