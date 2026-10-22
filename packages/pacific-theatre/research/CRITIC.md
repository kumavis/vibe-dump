# The critic's report
Written by one Opus agent on 22 October 2026 after reading the brief, the ten reports and the documents as they then stood. Every gap and contradiction below was taken into DESIGN.md, DATA.md, ENGINEERING.md, ACCESS.md and NOTICE.md before the build forked; the entries are kept as the record of what was found.

## Verdict
No. Stage 0 cannot freeze tools/check/ids.json from these documents: three of the four boxes have no id, bounds or clock and the candidates conflict, there is no kit id list and R6 lacks about twenty classes the boxes use, and the side, event-kind and clock-id vocabularies contradict each other inside DATA.md. Fix three things first. (1) Write the four boxes' ids, bounds, sizes and clocks into DATA.md §7: Ironbottom Sound about 159°20′–160°27′E by 8°50′–9°35′S, 14 Nov 20:00 to 15 Nov 03:30 at +11:00; Samar's west edge near 125°20′E, clock ending before 10:50 at +09:00; Midway holding both the atoll and the Kidō Butai's 04:00 position across 180°, 04:00–18:00 at -12:00. (2) Freeze the kit id list with types, add the missing classes and weapon, torpedo and AA ids, and add shp. (3) Settle the vocabularies and fields: one side code set (jp/us), the §10 kinds (atrocity, captivity and people, not massacre and internment), kebab-case clock ids, `year` precision, R5's event kinds including `torpedoes-fired`, group `enter` points for off-box origins, and the source-id list. Also make the PM decisions on a sight, smoke and squall model and on Pearl Harbor's level-bomber moment.
## Gaps

### 1. Box ids, bounds, sizes and clocks for three of the four v1 boxes

ENGINEERING.md §13 freezes each box's id, lon0, lat0, bounds and size in tools/check/ids.json before the fork. Bake needs the bounds, and battles needs the ids and clocks. Only pearl-harbor is written down: DATA.md §7 gives [201.45, 21.15, 202.45, 22.05] at 2048 and a 06:30–10:00 clock at -10:30. Midway has only an example (projection lon0 181.0, lat0 30.0; bounds example [179, 27, 184, 33]; clock 04:00–18:00). Guadalcanal and Samar have no id (the text says only 'Ironbottom Sound' and 'Samar's box'), no bounds and no clock. The candidates conflict: R1 POC 159.55–160.45E, 8.85–9.65S; R5 D13 159°20′–160°05′E, 8°50′–9°35′S and 125°45′–126°50′E, 11°00′–12°05′N; R1's indicative Samar box 10.5–13N, 125–127E; R5 §7 clocks of 14 Nov 20:00 to 15 Nov 03:30 (+11:00) and 06:15–11:30 (+09:00). See the contradictions.

**Follow-up:** Write into DATA.md §7 and ids.json the four ids (for example midway, guadalcanal, samar, pearl-harbor), their bounds, size and clock from/to. Each box must satisfy both the 10 km track rule and the 'every coast seen' rule. Guadalcanal ≈159°20′–160°27′E keeps Washington's 00:20–00:40 track at 159°29′–159°31′E and Tulagi at 160.15E. Samar needs a west edge near 125°20′E. Midway must hold the atoll at 28.2N 177.37W (Tomonaga's strike 06:30–06:43 and the shore-based groups) and the Kidō Butai at 04:00 near 31.5N 179.6E. Confirm the result with the bake's --preview. (*project manager (Stage 0), checked by the bake workflow*)

### 2. No frozen kit id list, and R6 lacks classes the four boxes use

ENGINEERING.md §13 promises 'the kit ids and types for every ship class and aircraft type the four v1 battles use' in ids.json, but no document lists them. R6's 44 ship rows and 24 aircraft rows omit many types:
- Midway: the US heavy cruisers (Portland and Astoria are in TF 17's noon circle 'to the yard', R4 §3.2; also Northampton, Pensacola, Minneapolis, New Orleans and Vincennes), Atlanta (Atlanta class), Balch and Phelps (Porter class), Maury (Gridley class).
- Guadalcanal: Asagumo (Asashio class), Samidare (Shiratsuyu class), Inazuma (Akatsuki class) (R5 §3.1).
- Samar: Shimakaze (R5 §4.1).
- Pearl Harbor: Ward (Wickes class); New Orleans and San Francisco; the auxiliaries Vestal, Neosho, Oglala, Curtiss, Tangier and Solace (Solace with target: false); the Type A midget submarine.
- Aircraft: the B-26, SB2U and F2A of Midway's shore groups (R4 §3.1, §3.5); the E13A and F1M floatplanes (Tone 4, Yamato's spotter); B-18 and A-20 parked at Hickam.
DATA.md §8's ship `type` vocabulary (bb|cv|cvl|cve|ca|cl|dd|de|ss|ap|pt) has no value for a repair ship, oiler, minelayer, tender or hospital ship.

**Follow-up:** Compile the list from R6 Tables S1 and A1 plus the unit lists in R4 §3.1, R5 §3.1 and §4.1, and R10 §3.1 and §7.1. Add type values (ar, ao, cm, av, ah, ag) to DATA.md §8, or map each auxiliary to an existing type. The engine workflow then fills the new rows from FM 30-50 and the Wikipedia infoboxes, marked blocksPrecision 'estimated'. (*project manager (Stage 0), then the engine workflow*)

### 3. Weapons have no shared tables or ids: torpedo types, AA kinds and guns

DATA.md §8 now says 'a torpedo type carries its dated failure rate (failRate...)', but it defines no file for torpedo types: §0 lists only kits/ships.json and kits/aircraft.json. The example ids 'type-93' and 'type-91' do not match R6's type-93-m1, type-93-m3, mk15, mk14, type-91-m2, type-91-m3 and mk13-1942 (R6 §3.5, §6). A kit's `aa[].kind` is free text ('127mm', '25mm'), while R6 uses gun ids (jp-127-t89, jp-25-t96, us-28-1.1in) and ENGINEERING §5's AA hazard needs a λ per weapon (R7 §4.6). Failure rates exist only for the Mark 13. No report gives the Mark 15's rate for November 1942 or October 1944 (R6 D6 says '*verify* a rate'), or the Type 93's for November 1942, although ENGINEERING §5 asks for the Mark 15 rate 'as a kit number for the battle's date'.

**Follow-up:** Add kits/weapons.json (guns, AA, torpedoes, bombs) to DATA.md §0 and §8, keyed by R6's ids, with R7's λbarrel and range on the AA entries. Kits then reference these ids. The engine records the missing failure rates as verify in config.js until a person reads Friedman or the BuOrd records. (*project manager (DATA.md §8), then the engine workflow; a person for the rates*)

### 4. Shaft horsepower and turning data for most kits

DATA.md §8 requires `shp`, `displacementFullT`, `turn.tacticalDiameterM` and `turn.rudderS`; §12 says only torpedoes, aircraft, ja, catapult blocks and notes are optional. ENGINEERING §5 derives each ship's time constant from displacement and shaft horsepower. R6 gives no shp for any class, sources only two tactical diameters (Nevada, Oklahoma) and no rudderS. R7 §4.4 computed shp for 14 ships, which it says 'R6 should confirm'. Every other kit would fail the check or carry invented numbers.

**Follow-up:** The engine fills shp from the Wikipedia infoboxes as estimates, with an shpPrecision flag like turnPrecision. Resolve the rudderS rule (see the contradictions). Ask a person with Friedman, or Garzke and Dulin, to confirm. (*engine workflow; a person for print checks*)

### 5. The aircraft kit schema lacks the flight-model parameters R7 and ENGINEERING's tests use

R7 §4.2's model needs wing area, CD0, CLmax and k, a roll-rate table against airspeed, a G limit, vShake and vBreak, dive-flap or dive-brake drag, and a rated altitude. ENGINEERING §5 tests each kit's turn and roll within ±10 % of R7's tables, and roll falls with speed (F4F 75°/s falling to 63; Zero 55 falling to about 40). DATA.md §8 offers only `handling.rollDegS` (one number), `turnS` and `speedKmh.diveLimit`.

**Follow-up:** Add `wingM2`, `cd0`, `clMax`, `rollTable: [[iasMs, degS], ...]`, `gLimit`, `vShakeMs`, `vBreakMs` and `diveDrag` to DATA.md §8's aircraft kit, seeded from R7 §4.2's table. (*project manager (DATA.md §8), then the engine workflow*)

### 6. No model for detection, visibility, smoke and squalls

Two v1 boxes turn on who can see whom. In R5 §3.13 G1, Kondō's column 'does not see Washington unless she shows a light or closes inside about 5,000 yards'; Kirishima has no radar. At Samar, smoke and rain squalls hid the escort carriers (R5 §6.5; Hoel's report: the Japanese ceased fire in the squall). ENGINEERING §5 has no sight, detection or plot module: `player.state` carries no contacts and the HUD has no plot. DATA.md §9 has static squall polygons but no smoke volume that drifts with the wind and no moving squall. R7 §4.9's numbers are memory or *verify*: optics 6–10 km unlit and 15 km or more lit; SG radar 18,000–20,000 yd; star shell 30–60 s (R5: the US 5-inch illumination round burns about 50 s).

**Follow-up:** Add a sim/sight.js contract to ENGINEERING §5. It should cover sight lines blocked by smoke and squalls, radar against optics, light from star shell, searchlights and gun flashes, and a radar or lookout plot in player.state. Add smoke-screen events with drift and moving squalls to DATA.md §9. The engine implements it, with R7's ranges in config.js marked verify. (*project manager (contract), then the engine and battles workflows*)

### 7. Units and groups whose origin is off the box

Pearl Harbor's carriers launched 374 km north (R10 §3.4). Their waves are to enter at the box's north edge at about 07:28 and 08:30; the B-17s arrive from the east and Enterprise's SBDs from the west. DATA.md §9 gives a group a `from` unit, a `launch` time and a straight line, or a route, and §7's check rejects any unit track outside the box with 10 km to spare. There is no way to write an entry point.

**Follow-up:** Add `enter: { t, lonlat, headingDeg, altM }` to groups, allow `from` to name an off-box unit, and exempt both from the box-holds-tracks check in DATA.md §9 and §10. (*project manager (DATA.md §9), then the battles workflow*)

### 8. Event kinds the surface record needs

R5 §7 lists kinds that DATA.md §9 lacks: `torpedoes-fired` (count, speed setting and target, so the sim can run a scripted spread such as Ayanami's at 23:30, Atago's at 00:03 or Johnston's at about 07:20), `illuminated` (with `by`), `steering-jammed`, `power-failure`, `radar-lost`, `abandoned` (distinct from `sinks`) and `collision` or `near-collision`. Without `torpedoes-fired` and its `by`, the authority rule cannot tell when the player is the target of a torpedo spread.

**Follow-up:** Add these kinds to DATA.md §9's vocabulary, and say which carry `by`. (*project manager*)

### 9. Samar's air attacks were never researched

R5 §4.1 says Taffy 3's and Taffy 2's 'aircraft are R4's subject', but R4 has no Samar content at all. The Samar beats inside any clock still include aircraft hits: Suzuya's near miss at 07:35, Haguro's turret bombed at 08:00, Chikuma's aerial torpedo at 08:53, Chōkai crippled by Fowler's TBMs at 08:51–09:05. The battles workflow has no groups, counts, launch or attack times, or losses for them.

**Follow-up:** Before writing samar/battle.json, read Battle Experience no. 22 (HyperWar; it includes CTU 77.4.2's report) and Morison XII for the VC squadrons of Taffy 3 and Taffy 2. Kits fm-2 and tbf-1 already exist in R6. (*battles workflow (or a research subagent)*)

### 10. Midway atoll's ground targets and its 1942 shoreline

DESIGN.md §8 puts Tomonaga's strike on Sand and Eastern Islands (06:30–06:43) and Midway's shore-based groups inside the box. No report placed Midway's airfield, seaplane base or AA as `sites`; DATA.md §9's sites were introduced for Pearl Harbor only. R1 §9 notes that Sand Island has been enlarged by fill since, and DATA.md §7 bakes each pack for its battle's date with no source for 1942 Midway.

**Follow-up:** The battles workflow writes Midway's sites from the CINCPAC report and Heinl's 1948 monograph (both on HyperWar). The bake workflow either accepts the modern shoreline at Midway's texel size or flags it. (*battles workflow; bake workflow*)

### 11. Pearl Harbor's 1941 patches and CUDEM are missing from the bake's contract

DATA.md §7 relies on 'the Hawaiian app's dated patch' (Kuahua before its 1943 fill; the later drydocks and piers taken out) and on the CUDEM tiles ncei19_n21x50_w158x00 and …w158x25. But DESIGN.md §4 lists bake-patches as 'not needed'. ENGINEERING §12 and §13 give the bake only etopo, cog, ne and simplify, and DATA.md §11 never mentions CUDEM. R10 D2 asked for a 10 m harbour inset; DATA.md §7 bakes one 2048 pack at about 50 m instead, which leaves the 440 m channel at Hospital Point about 9 texels wide.

**Follow-up:** Add to the bake's files a copy of the Hawaiian 1941 patch masks and a CUDEM reader (`lib/cudem.mjs`). Decide between a single 50 m pack and an inset; an inset would need a field in DATA.md §2. (*project manager; bake workflow*)

### 12. Source ids are not frozen, and the draft ledger is incomplete

Engine (kit sources) and battles (event sources) will cite source ids that content is inventing at the same time, which is the dangling-reference problem R9 §6.1 raised for kits. The ids already differ:
- R2's draft ledger: nagumo-1947, nwc-midway-1948, oni-41-42, taic-1-1945.
- R3's keys: nagumo, ussbs-camp, cincpac-mid, chron42.
- R6: oni-4142, oni-222j, taic-1, bs-wds42.
- R10: bushships-summary-1942, combatships-1941.
- DATA.md's examples: nagumo-report, ussbs-campaigns.
R2's 78-entry draft also lacks the `licence` and `ref` columns that DATA.md §4 requires, and has no Pearl Harbor, kit, chronology or front sources.

**Follow-up:** Freeze one source-id list in ids.json at Stage 0: R2's 78 ids plus the additions from R3, R4, R5, R6 and R10, each with its licence. Alternatively, give each workflow its own sources fragment, merged at integration. (*project manager (Stage 0); content workflow fills the licence and ref fields*)

### 13. Linking routes to tracks, and who owns the box stops

DATA.md §5 says every fleet route of a boxed battle must match a unit track 'at the battle's start'. But a route carries no unit ids to compare against (kido-butai-midway, tf16-tf17-midway). Box stops are written twice: in events.json (§4: camera `bearing`, `distance`, owned by content) and in battle.json (§9: `bearingDeg`, `distanceM`, owned by battles). The events.json camera targets are unit ids that battles invents.

**Follow-up:** Add `units: [...]` to routes. Decide that box-zoom stops live only in battle.json and events.json carries table stops only. Unify the camera field names. (*project manager*)

### 14. Calibration numbers no report gives, and one that disagrees with the record

Several values ENGINEERING §5 needs are unsourced:
- hangarHazard for Taffy 3's escort carriers (they were launching armed TBMs) and for the Kidō Butai before 10:20;
- the Japanese 25 mm λ and the era factors (fitted, R7 §9 risk 4);
- the SBD, B5N and D3A roll curves and every vShake and vBreak (estimates).
One value conflicts with the record. R10 §0.8 has Kaga's torpedo unit losing 5 of 12, while ENGINEERING §5 and R7 calibrate first-wave torpedo planes at about 10 % (band 6–15 %). The Kaga B5N moment's threat would then run far below its own after-card.

**Follow-up:** Keep these values in config.js marked verify. Re-fit the Pearl Harbor AA case to Kaga's late, alerted run. A person with Prange or Zimm should check the losses by unit. (*engine workflow; a person*)

### 15. Licences and notices

NOTICE.md says the Pearl Harbor box's land is the Hawaiian Oʻahu pack (USGS 3DEP). DATA.md §7 uses NOAA CUDEM plus GLO-30, so that box needs the CUDEM credit and the GLO-30 notice and liability sentence; neither is in NOTICE.md or in the Pearl Harbor `sources`. DATA.md §10's credit check covers only GLO-30 and GMRT. R10 placed the F-6 to F-8 berths and the wrecks from OpenStreetMap (ODbL), but the licence vocabulary has no `odbl` and nothing credits OSM. NOTICE.md cites ETOPO '15 Arc-Second' while the table uses the 60″ grid. The repository licence is undecided (R8 D15), and R1 §11 asks someone to confirm the GLO-30 terms for a public Pages site.

**Follow-up:** The project manager fixes NOTICE.md and DATA.md §7's Pearl Harbor sources and adds `odbl` to the licence list. The owner decides the repository licence. A person reads the Copernicus licence's Article 6 against publication on Pages. (*project manager; owner; a person*)

### 16. Tone questions still open that the workflows will hit

No document settles four questions the reports raised:
- whether a card tells how the US fliers captured at Midway died (R4 §3.12);
- whether Lundgren's friendly-fire telling for Preston may appear on a card (R5 D3, R8);
- whether the Bengal famine is in (R3 §11; R3's event bengal-famine-1943 is marked 'R8: include or not');
- the words for men in the water (R5 §12).
The battles and content workflows will draft these cards blind.

**Follow-up:** The designer, with R8's rules, decides each question and records it in DESIGN.md §7.4 or §11. A historian reads every card that touches the dead before ship. (*designer; owner; a person*)

### 17. `year` precision for multi-year events

R3 §3 dates comfort-system (1932→1945), unit-731 (1936→1945) and bengal-famine-1943 to the year, but DATA.md §4's `precision` is minute|hour|day|month, and ENGINEERING §4's spanOf widens only by those four. The content check would reject three tier-1 and tier-2 events.

**Follow-up:** Add `year` to DATA.md §4 and to time.js's parseInstant and spanOf. (*project manager*)

### 18. ACCESS.md and RESEARCH.md are behind the reports

ACCESS.md lacks R6's walls: wwiiaircraftperformance.org (403), shipcamouflage.com (SHIPS-2 behind a JS challenge), BuShips WDR 51 plate V (Johnston), the Escort Carriers report's missing Section III (Gambier Bay) and the USNTMJ ship reports. It also lacks R9's almanac check. RESEARCH.md still shows the critic as pending. R6 itself is complete (§§0–12, 960 lines, last written 08:53).

**Follow-up:** Add R6's walls and the almanac item to ACCESS.md and update RESEARCH.md §1. (*project manager*)

## Contradictions

### 1. A level-bomber moment at Pearl Harbor

- a: DESIGN.md §3.4, Pearl Harbor row: 'later, Akagi's level bombers (the only group whose bombs are not Arizona's)'. This follows R10 M2 and D4 (a B5N2 of Akagi's 1st Attack Unit at 3,000 m, 08:04).
- b: DESIGN.md §3.5: 'there is no high-level bomber moment at Pearl Harbor'. DATA.md §9: a role is 'never the first wave's high-level bombers at Pearl Harbor' (and §10 checks it). R8 D4: 'no high-level bomber moment'. Akagi's level unit flew in the first wave.
- **winner:** DESIGN.md §3.5, DATA.md §9 and R8. This is the tone rule the check enforces, and M2 would fail it. Remove M2 from §3.4, unless the owner explicitly carves out Akagi's group and the check is changed to match.

### 2. Samar box extent

- a: R5 §4.3 and D13: 125°45′–126°50′E, 11°00′–12°05′N (about 120 × 120 km), holding the tracks 06:30–11:30.
- b: DATA.md §7 and ENGINEERING §7: 'Samar's box holds the island's east coast'. DESIGN.md §3.4: '~200 km'. R1's indicative box: 10.5–13N, 125–127E. R5 §4.3 itself puts Fanshaw Bay at 126°11′E 'about 40 miles off the coast of Samar', which places the coast near 125°30′E, outside R5's west edge.
- **winner:** The coast rule (DATA.md §7, ENGINEERING §7, R9 E6). Move the west edge to about 125°20′E and keep R5's other edges for a clock that ends before 10:50.

### 3. Ironbottom Sound box extent

- a: DESIGN.md §3.4: 'Savo, Guadalcanal's north coast, Nggela and Tulagi, ~100 km'. R1's POC box: 159.55–160.45E, 8.85–9.65S.
- b: R5 D13: 159°20′–160°05′E, 8°50′–9°35′S. R1's box misses Washington's 00:20 turn at 159°30.5′E, her 00:33 reversal at 159°29.2′E and TF 64's 20:00 fix at 159°27′E (R5 §3.3). R5's box misses Tulagi (160.15E, R3 §5.3) and most of Nggela.
- **winner:** Neither alone. Use the union, about 159°20′–160°27′E by 8°50′–9°35′S, so that both the 10 km track rule and DESIGN's named coasts hold.

### 4. When the Samar clock ends

- a: DATA.md §9 and DESIGN.md §3.4/§3.5: the clock ends 'before the Shikishima unit's attack on St. Lo (about 10:50)'.
- b: R8 §5.2e and D3: 'close the Samar box's clock with the surface action (Kurita's order to break off, about 09:11–09:20)'. R5 §7: `to` 11:30, to hold St. Lo sinking at 11:25.
- **winner:** DATA.md (before 10:50). It meets R8's purpose of keeping tokkō out of the sim, and Roberts (10:05) and Johnston (10:10) still sink inside the clock. R5's 11:30 breaks the tone rule.

### 5. Johnston's torpedo run time

- a: ENGINEERING §5 (Torpedoes) and R7 §4.4: 'the Mark 15 at 26.5 knots takes 11.5 minutes to run the 9,400 m of Johnston's attack on Kumano', so fired about 07:16 for a hit at 07:27.
- b: R5 §4.6 and D6: Johnston's report gives the firing at 'about 0720' from about 10,000 yd, target angle 040, target speed 25 kn. The collision-course run is about 7.4 minutes, giving 07:27. With ENGINEERING's 11.5 minutes and the report's 07:20, the hit would land at about 07:31.
- **winner:** R5. It comes from the ship's own firing data and agrees with Morison's 07:27. Correct ENGINEERING §5's example.

### 6. Time scales and checkpoints in R5's ship moments

- a: R5 §3.13 and §4.12: S1 Johnston durationS 450 at timeScale 2, checkpoint 07:25; S3 Gambier Bay's helm, S4 Samuel B. Roberts's run, and G3/G4 the destroyer runs, all at 2× (R5 D8).
- b: DATA.md §9: '3 for torpedo runs and helm'. ENGINEERING §5 and R7 D16: Johnston runs to 07:31 at 3×. DESIGN.md §3.4: Johnston 07:10–07:31.
- **winner:** DATA.md, ENGINEERING and DESIGN. For Johnston, durationS 420 at 3× reaches 07:31 and holds the 07:27 hit and the 07:30 shells.

### 7. Washington's opening range on Kirishima

- a: R6 §0 item 4 and Table F1: 'Washington opened on Kirishima at about 5,800 yd (Kirishima TROM), about 8 s'.
- b: R5 §0.2 and §3.7: 8,400 yd on 008° (Washington's report, through ONI Part III and Lundgren). DESIGN.md §3.4 and ENGINEERING §5 (11.9 s at 8,400 yd) agree.
- **winner:** R5. It is nearest the primary, while the TROM is a secondary compilation; 5,800 yd matches South Dakota's 23:47 radar plot of other ships.

### 8. The side vocabulary

- a: DATA.md §4 sides jp|us|…; §6 held.by 'jp'; §9 sites 'side': 'us'; clocks.json side 'us'; ENGINEERING §5 sim.outcome bySide { jp, us }.
- b: DATA.md §8 kit nation and §9 units, `sides` keys and moment roles: 'japan'|'usa'. R5 and R10 moments, and DESIGN.md §6's event sides ['japan','usa'], use the same.
- **winner:** One vocabulary in ids.json: R3 §2.1's codes (jp, us, … plus the peoples' codes), because events need the peoples' codes and the sim already keys on jp and us. Kits' nation maps onto them.

### 9. Event-kind names in the check

- a: DATA.md §10: '`kind: massacre | internment | bombing` events have no `box` and no stop below `table`'.
- b: DATA.md §4 and R3 §2.1 vocabulary: bombing | atrocity | captivity | people, all always cards. There is no massacre or internment kind; ENGINEERING §13's fixture already uses 'atrocity'.
- **winner:** DATA.md §4 and R3. Rewrite the §10 rule with their four kinds.

### 10. Clock ids that are not kebab-case

- a: DATA.md §4 clocks.json ids usn-z+12 and usn-z+10 (from R3 §7.4).
- b: DATA.md §4: 'Ids are kebab-case ASCII'. DATA.md §10: 'every id unique and kebab-case'.
- **winner:** The id rule. Rename the clock ids (for example usn-zp12, usn-zp10, usn-zm11, usn-zm12) before ids.json freezes them.

### 11. The sign and format of the Midway zone

- a: DESIGN.md §6: battle.json 'clock': { 'zone': '+12' } and the event's 'zone': '+12 (Midway)'. R4 §8 sketch: 'zone': 'UTC-12'.
- b: DATA.md §9: 'zone': '-12:00'. ENGINEERING §4: zoneMinutes throws on anything but ±HH:MM; '-12:00 is the US Navy's zone +12'.
- **winner:** DATA.md and ENGINEERING. Read as ISO, '+12' means UTC+12, which puts every Midway beat a day off.

### 12. when.zone or when.clock

- a: DATA.md §4 text: '`zone` is the clock the card shows'. DESIGN.md §6: 'zone': '+12 (Midway)'.
- b: DATA.md §4's own example: 'clock': 'usn-z+12' with a 'zoneNote'.
- **winner:** The example: a `clock` id into clocks.json. Fix the sentence and DESIGN.md §6.

### 13. Who writes labels.json

- a: DATA.md §0: 'labels.json is seeded by the bake from Natural Earth and finished by hand'.
- b: DATA.md §3: 'written by hand from the gazetteer (the bake does not seed it)'. ENGINEERING §13 gives it to content.
- **winner:** DATA.md §3 and ENGINEERING §13. No Natural Earth string should reach the screen.

### 14. Grid convergence at Midway

- a: DATA.md §1 ('true north leans 13° at Midway'), DATA.md §7's example convergenceDeg -13, and ENGINEERING §3 ('−13° at Midway'). These are R1 §5.2's values for a 7.5°N 147.5°E centre.
- b: R3 §4.2: −15.0° at the adopted 7°N 141.5°E centre. Recomputed for this review with the same AEQD formulas: Midway −15.0°, Pearl Harbor −17.1°, Guadalcanal +1.2°, Samar +2.7°.
- **winner:** R3. A test or placement check that uses −13° will fail.

### 15. Source of the Pearl Harbor box's terrain

- a: DATA.md §7 (from R10 D2): CUDEM 1/9″ over the harbour and south shore, GLO-30 elsewhere, GMRT for the sea, at 2048 (about 50 m).
- b: DESIGN.md §5.1: 'Oʻahu's box reuses the Hawaiian app's pack'. NOTICE.md: the land is the Oʻahu pack, USGS 3DEP. R9 E7: the Oʻahu pack's footprint at 68 m and 1024. R8 §6.6: the footer reads 'USGS 3DEP and GMRT instead'. RESEARCH.md §2 lists both decisions.
- **winner:** DATA.md §7 and R10, which measured that at 68 m Southeast Loch is only 3–4 texels wide. Fix DESIGN.md §5.1, NOTICE.md (add CUDEM and the GLO-30 notice) and RESEARCH.md.

### 16. Rudder times and turning circles where unsourced

- a: DATA.md §8 (updated, from R6 D10): 'rudderS 30 s' for every unsourced kit; tactical diameter 4 × loa for destroyers. DATA.md's own Kaga example has rudderS 12.
- b: ENGINEERING §5 (from R7 §4.4): '30 s hard over to hard over for battleships and carriers, 20 s cruisers, 15 s destroyers'. R7 puts Fletcher and Kagerō tactical diameters at about 6 lengths.
- **winner:** ENGINEERING and R7 for rudderS by type; a Fletcher with a battleship's rudder misplays Johnston. Keep R6's 'rule' flag. The tactical-diameter estimate needs a decision either way.

### 17. Time of Arizona's explosion

- a: R8 §5.2a stop card: 'About 08:10' (from the NPS's older study, marked verify).
- b: R10 §8.2 and §9 choose about 08:06 (Hiryū TROM, ja.wp, Pruitt) and give Mugford 08:08, Jarvis 08:10 and Vestal 08:20 as tellings. R6 F1: last bomb 08:06.
- **winner:** R10, which weighed the ships' reports. R8's card text should read 08:06, with the other times as tellings.

### 18. Midway battle clock

- a: DATA.md §9 and DESIGN.md §6: 04:00–18:00.
- b: DESIGN.md §8: 'Box. 04:30 to 18:00 on the Midway clock'.
- **winner:** DATA.md. 04:00 holds the 04:30 launch with a margin.

### 19. Midway weather values

- a: DATA.md §9 example: wind 7 kn, cloud base 600 m, tops 1,500 m, visibility 40,000 m.
- b: R4 §3.4: TF 16 at 04:30, wind 5 kt from the south-east; over the dive, 'scattered cumulus clouds from 1500-2500 feet' (460–760 m); Kaga at 10:30, visibility 60 km. DESIGN.md §5.3 and §6 agree with R4.
- **winner:** R4, which is the record. The battles workflow should not copy DATA.md's example.

### 20. Moment checkpoint arithmetic inside ENGINEERING

- a: ENGINEERING §5, 'Moments (moments.js) … reaches its checkpoint at `t + durationS`'.
- b: ENGINEERING §5, earlier bullet: 'durationS (real seconds; the battle span is durationS × timeScale)'. DATA.md §9 says the same.
- **winner:** durationS × timeScale. Correct the moments.js bullet.

### 21. The `name` field in a moment's role

- a: DATA.md §9's own example role carries 'name': 'a Dauntless of Bombing Six'. R10 M1's role name is 'a Type 97 carrier attack plane of Kaga's 2nd Special Attack Unit (Lt Kitajima Ichirō)'.
- b: DATA.md §9: 'never a person (no `pilot` or `name`)'. R8 §5.5's check fails a role that 'names a person (`pilot`, `name`)'.
- **winner:** Allow a descriptive `name` that contains no personal name, and reword the rule so the check does not reject DATA.md's own example. Drop the officer's name from R10 M1.

### 22. The table's land-fraction check

- a: DATA.md §10: land is plausible 'between 10 and 20 per cent of the texels over the theatre'.
- b: R1 §1.1 measured 28.4 % land for 90–180°E, 40°S–55°N (ETOPO 2022) and 22.2 % for 90–205°E (ETOPO1). The adopted 78°E–155°W rectangle adds India, and its corners reach Central Asia.
- **winner:** R1's measurements. Widen the band (for example 20–35 %) or derive it from the first bake, or a correct bake will fail.

### 23. Precision vocabularies for fronts and routes

- a: R3 §5: front precision firm|soft|contested. R3 §6: route precision `journal`.
- b: DATA.md §6: `mapped|schematic`. DATA.md §5 pointPrecision: report|chart|orders|narrative|schematic.
- **winner:** DATA.md. The content workflow maps R3's marks onto it.

### 24. Start time of the Zero CAP moment against VT-3

- a: DESIGN.md §3.4: 'the Zero CAP against VT-3 (10:15)'.
- b: R4 §3.11 M5 and R7 §5: start 10:09, or 10:17 so the dive begins overhead.
- **winner:** R4.

### 25. Questions DESIGN.md still lists as open

- a: DESIGN.md §11, 'Still open': ship moments' time scale, and touch controls in v1.
- b: ENGINEERING §5 and §8, DATA.md §9 and RESEARCH.md §2 have decided both: 2× gunnery and 3× torpedo and helm, with maxTimeScale; touch in v1 with Guided aids.
- **winner:** ENGINEERING and DATA.md. Close both items in DESIGN.md §11.

### 26. DESIGN.md §6's data examples against DATA.md

- a: DESIGN.md §6: chapter 'turn' from 1942-05-01 to 1942-06-30 with front '1942-06'; placePrecision 'exact'; kit 'fatal': 0.8; moment speedMs 70.
- b: DATA.md §4 and R3: 1942-06-01 to 1943-02-09, keyframe 1942-09-15; placePrecision 'ex'; fatal 1.0 with crippledAt 0.5; speedMs 78 (R7 §3 item 11: 70 m/s is 1.4 × stall at 5,800 m).
- **winner:** DATA.md, which is the contract. Update or strike DESIGN.md §6's examples.

### 27. Type 91 torpedo drop envelope at Pearl Harbor

- a: R10 §0.9 and §5.2: the 'first method' for the shallow harbour, 160 knots at 20 m (ja.wp, tertiary).
- b: R6 §6: Type 91 Mod 2 dropSpeedKn '180 by design' at 20 m. R7 §4.3: at most 90 m/s (175 kn) and 50 m (verify). DATA.md §8's example: 160 kn and 50 m.
- **winner:** R10 for the Pearl Harbor kit, because it is the method trained for that harbour. Mark all values verify.

### 28. Parked aircraft: decoration or units

- a: R7 §4.14: 'parked aircraft are static scene decoration, not units' (sim capacity 128 ships and 512 aircraft).
- b: DATA.md §9 (from R10 D11): 'Aircraft on the ground are units with a `parked` station at a site'. They are the strafing targets, and Pearl Harbor had about 390.
- **winner:** DATA.md. ENGINEERING's sim.capacity must then allow roughly 900 units at Pearl Harbor.

### 29. Why Ironbottom Sound is baked at 2048

- a: DATA.md §2 and DESIGN.md §5.1: 2048 'only where a sortie flies low over land (Ironbottom Sound …)'. The v1 budget of 12–15 MB assumes one 2048 box.
- b: DESIGN.md §3.4: all four Guadalcanal moments are ships. Pearl Harbor, where aircraft fly low over the lochs, is also baked at 2048 (DATA.md §7).
- **winner:** Decide resolution by the moments: Pearl Harbor is the low-flying case. Re-check whether Guadalcanal needs 2048, and re-state the budget.

## The strongest findings

- Every time carries its own clock, and the record proves each offset. At Midway, Japanese times convert by +3 h and a day back, and the US carriers' zone-+10 times by −2 h (R2 §3, R4 §2.1). The Guadalcanal US primaries keep UTC+12: South Dakota's report, the BuShips damage report and ONI Part III. The computed moonset at 23:50–23:58 UTC+11 proves this, so subtract 1 h for the +11 box (R5 §2.1). The Samar TROMs' early entries run an hour behind Item, so Yamato's '0558' is 06:58 (R5 §2.2). Pearl Harbor's 1941 offset is UTC−10:30: Monaghan logs '1821 GCT (0751 LCT)', and HST = JST − 19 h 30 min (R10 §2).

- R1 proved the offline bake end to end. ETOPO 2022 60″ comes over THREDDS OPeNDAP .dods in two pieces either side of 180° (curl -g; about 65 MB at stride 2). GLO-30 is read as COG windows by HTTP range through a curl BaseClient on geotiff 2.1.3, with the PixelIsPoint half-cell shift. Box sea comes from GMRT as ESRI ASCII. Land is decided only by Natural Earth on the table or GLO-30 in a box, with sea clamped to −1 m or deeper, because ETOPO paints Salmon Bank at +19 m and Tarawa's reef flat as land. The Ironbottom Sound proof bake took 14 s.

- The tracks can be drawn from public-domain primaries:
- Nagumo's 1947 report (minute log in JST, Table 3 hits) and the Naval War College 1948 plots D-3 and D-4 at ±5′; they show that Yorktown's '33°5x′N' is a misprint for 30°5x′. TF 17's noon circle is in the record to the yard (R4).
- For the surface battles: the ONI track chart for Guadalcanal (±1′), Battle Experience no. 22's TU 77.4.3 chart (Taffy 3 at 06:45 at 11°47.1′N 126°09.9′E) and Kurita's own Plate 9-3 (R5).
- For Pearl Harbor: ComBatShips' berths and the BuShips Summary of War Damage as the damage authority (R10).

- R7's models reproduce the record:
- One drag curve with a fitted form factor per shell matches the range tables within 2 % (the 16-inch at 8,400 yd takes 11.9 s).
- The group rule, count = recordCount × min(1, S/Srec) + baseRate × max(0, S − Srec), is scaled against the record's own survivors (Hiryū's strike 7 of 18; VT-3 5 of 12).
- Two-track damage with a hangar hazard: Kaga at H 0.8 is doomed; Yorktown at H 0.15 is not.
- AA as a Poisson hazard from COMINCH's rounds per bird, calibrated to 27 % (D3A on TF 17), 2–3 % (SBD on Kaga) and 31 % (B5N on Yorktown).
- Physical ship time constants: a battleship takes 221–323 s to reach 90 % of top speed.

- R9 found the traps that would break the build silently:
- The staged copy does not build: seven imports point at files that were not staged.
- three r160 defines USE_LOGDEPTHBUF but adds no code, so every ShaderMaterial must include the log-depth chunks (the smoke test asserts vFragDepth), and polygonOffset stops working.
- Float32 integration 150 km from the origin runs −9 % slow at 2 kn and never moves below 0.9 kn, so the sim needs Float64.
- The Hawaiian time.js drops offsets and reads '10:22' as the year 10.
- The Hawaiian moon is 8–11 days off at Pearl Harbor and Samar.
Hence Stage 0 must adapt the core before the fork.
