# Content, third round: the wargames' scenarios

The content-3 workflow of ROUND-3.md §8: the three wargame scenarios
(`public/data/wargames/{samar,midway,ironbottom-sound}.json`), their check
(`tools/check/wargames.mjs`) and one source added to `public/data/sources.json`
(DANFS *White Plains*; nothing changed). A scenario is a what-if with the real
forces: the box's own ships, by their unit ids, and the aircraft their
carriers flew that day, fought in an arena 6 km across for ten minutes. What
each scenario rests on is below, and what is the arena's own (the distances,
the start, the phases, the admiral) is labelled as such.

## 1. What was read

- **ROUND-3.md** (§1, §2 and §6 in full), ROUND-2.md (the stations and the
  takeability rules the first units follow), DATA.md §9–§10, DESIGN.md §3.5
  and §7.3–7.4, R8 §5 (the never-list, the after-card words, the hard case of
  Samar and the first tokkō attack), `tools/check/ids.json` (the frozen
  `wargames` ids and the `wargameGoalKinds`, `wargameGoalTypes`, `hopKinds`,
  `attackProfiles` and `stations` vocabularies).
- **The three boxes' battle files**: every unit (id, kit, side, name, group,
  fate), every group (kit, count, carrier, launch, attack, reached), the
  sightings and the first fire, the tracks at first contact (laid out with a
  scratch script over the tracks and stations: Samar 06:53, Midway 05:52,
  Ironbottom Sound 24:00), and the weather.
- **R5 §3.1–3.2 and §4.1–4.3** (the orders of battle, Taffy 3's formation 5R,
  Kurita's two drawings of his disposition, TF 64's column, Kondō's column at
  23:48 and his plan for the units ahead) and **R4 §3.1–3.5** (Midway's air
  groups and stations).
- **Battle Experience, SIB 22, ch. 78** (HyperWar, the transcription of the
  1945 bulletin; opened again for this round, parts 78.1 and 78.3):
  - *CTU 77.4.3's report*: AA fire bearing 300° at 06:46; "seven minutes later
    a large enemy fleet ... was sighted, bearing 298°, distance about 17 miles";
    launch at 06:55 on an easterly course; smoke from 07:01.
  - *CO Fanshaw Bay*: "An 8-plane local Combat Air Patrol, 7 VF special strike
    group, and one torpedo plane with air observer had been launched prior to
    contact with enemy; 1 remaining fighter and 11 torpedo planes were
    launched" (VC-68: sixteen FM-2, twelve TBM-1C).
  - *CO Kalinin Bay*: by 07:25 "three TBM-1C's loaded with 500-lb. GP bombs and
    8-5" rockets, six TBM-1C's loaded with 10 100-lb. GP bombs and 8-5"
    rockets, one TBM-1C loaded only with service load ammunition, and ten
    FM-2's"; two TBM-1C on the hangar deck "made ready loaded with torpedoes",
    kept aboard by the damaged catapult; three more FM-2 at about 07:50 (VC-3:
    thirteen FM-2, twelve TBM-1C). Also: Kitkun Bay's anti-submarine plane
    reported the Japanese "bearing 270° (T), a distance 20 miles" at 06:54.
  - *CTU 77.4.3*, ¶26: after the surface action Kitkun Bay "launched 4 TBM with
    the torpedoes remaining on board".
  - *ComCarAirGrp 26's comments* (launched from Kitkun Bay at 07:00; the box's
    `vc-5-fm2` and `vc-5-tbm` already rest on them).
- **DANFS *White Plains (CVE-66)*** (HyperWar; new to the ledger): from April
  1944 "her own permanently assigned air unit, Composite Squadron (VC) 4,
  composed of 16 Wildcat fighters and 12 Avenger torpedo bombers".
- **DANFS *Gambier Bay* and *St. Lo*** (in the ledger): no squadron numbers.
- **Wikipedia, *Battle off Samar*** (a finding aid, as the ledger has it):
  "Each carrier had a squadron composed of twelve to fourteen FM-2 Wildcat
  fighters and an equivalent number of Grumman TBF Avenger torpedo bombers"
  (after Hornfischer), "about 165 aircraft"; St. Lo's four-plane
  anti-submarine patrol at dawn and Brooks's Avenger's sighting at 06:37.
  A request for the ship articles was refused by Wikipedia's rate limit and
  not repeated.

## 2. The file, as built

Every field of ROUND-3.md §6's example is present and means what §6 says.
The scenarios carry more, which a reader of §6 alone may ignore; the check
(§6 below) holds them where present. In order:

| field | meaning |
| --- | --- |
| `ja` | the battle's Japanese name and reading, from the box, for the start sheet's second line (DESIGN.md §7.3) |
| `arena.separationM` | guide to guide at the start: 5,000 (Samar, Midway, as §2 says) or 2,500 (Ironbottom Sound, "at 2–3 km") |
| `arena.skyAt` | the battle-clock time whose sun or moon, cloud and sea the arena borrows from its box: Samar 06:58 (Yamato opens fire), Midway 10:20 (the dive bombers over the Kidō Butai), Ironbottom Sound 24:00 (after moonset) |
| `arena.night`, `starShells`, `visibilityM` | Ironbottom Sound only: night, star shells in the weapons, visibility 5,500 m (the box's weather after moonset: "only very prominent landmarks were visible beyond five miles") |
| `arena.note` | where the centre is and why (not user-facing) |
| side `side` | `jp` or `us`, as the box's `sides` carry it |
| side `name`, `ja`, `leader` | the start sheet's line for the side; `leader` is the commander, a Japanese name in the full form with kanji (§4) |
| side `bearingDeg` | **the bearing of this side's guide from the arena's centre**, at half the separation; the two are reciprocal, so it is equally the bearing on which this side lies from the other (the reading §6's example, Japan 345 and the US 165, supports) |
| side `headingDeg` | the course the side starts on, from the box's tracks at first contact |
| side `screenM` | the screen ring's radius round the guide (§2's words) |
| side `formation` | the exact start, optional: `circle` (the `ring` ships evenly round the guide at `acrossM`/2 from the bow, the `screen` ships evenly on the `screenM` ring starting from the bearing of the other side) or `columns` (each column's first ship at `atM` = [metres to starboard, metres ahead] of the guide, the rest astern at `intervalM`); every ship has one place |
| side `first`, `firstStation` | the unit the cut lands in and its station (ROUND-2's names); an aircraft kit as `first` means an airborne aircraft of that kit |
| aircraft `airborne` | how many of the entry are in the air at the start; the rest launch in the admiral's waves |
| aircraft `note` | what the count rests on (not user-facing) |
| side `maxAirborne` | 30: at most thirty a side in the air at once |
| goal `weapon` | `shell`, `torpedo` or `bomb`: only hits of that weapon count (§1's "put a torpedo into a cruiser") |
| goal `by` | whose hits or whose arrival counts: `aircraft` or one of the side's own ship types |
| goal `types` | widens `type` (a cruiser is `ca` or `cl`; the frozen vocabulary has no "cruiser"); `type` stays the contract's field and is always one of `types` |
| goal `rangeM` | a `reach`: bring `count` of the side's units (`by`) within `rangeM` of an enemy unit of `type` |
| goal `outOfAction` | on a `sink` of carriers: a carrier burning (under half her hit points, launching stopped, ROUND-3 §3's damage) counts as well as one sunk; Midway's "put out of action" |
| goal `also` | more terms of a main goal, every one of which must hold: Ironbottom Sound's "Kirishima and two cruisers" |
| admiral `waveSize` | the first launched wave's size; each wave after grows by `waveGrowth` |

`survive` counts the side's own ships of the type afloat at the end of its
window (the main goal's window is the ten minutes); `sink`, `hit` and
`shoot-down` count the other side's.

## 3. Samar

**Forces.** Every Taffy 3 ship (six Casablancas, three Fletchers, four John
C. Butlers) and every ship of Kurita's force the box has (Yamato, Nagato,
Kongō, Haruna, Haguro, Chōkai, Kumano, Suzuya, Chikuma, Tone, Yahagi, Noshiro
and eleven destroyers): the box's 36 units, all of them. The Japanese side has
no aircraft: the battleships' and cruisers' float planes are in no group of
the box, so none is invented.

**The aircraft on deck** (FM-2 / TBM-1C):

| carrier | squadron | FM-2 | TBM-1C | rests on |
| --- | --- | --- | --- | --- |
| Fanshaw Bay | VC-68 | 16 (8 CAP, 8 strafe) | 12 (4 torpedo, 8 bombs) | CO Fanshaw Bay (SIB 22); the four torpedo Avengers are the box's `taffy3-tbm-tone` |
| Kalinin Bay | VC-3 | 13 (strafe) | 12 (9 bombs, 1 guns only, 2 torpedo) | CO Kalinin Bay (SIB 22), load by load |
| White Plains | VC-4 | 16 (strafe) | 12 (bombs) | DANFS (the April 1944 complement); arming with bombs from 07:01 (Morison, via the box) |
| Kitkun Bay | VC-5 | 11 (escort) | 10 (6 bombs, 4 torpedo) | the box's `vc-5-fm2` and `vc-5-tbm` (ComCarAirGrp 26); the four torpedo Avengers launched after the action (CTU 77.4.3 ¶26) |
| St. Lo | VC-65 | 14 (strafe) | 12 (6 bombs, 6 torpedo) | **stand-in**: "twelve to fourteen ... and an equivalent number" (wp-samar after Hornfischer) |
| Gambier Bay | VC-10 | 14 (strafe) | 12 (6 torpedo, 6 bombs) | **stand-in**, as St. Lo's |

84 Wildcats and 70 Avengers, against "about 165" in the finding aid.
**Airborne at the start, 20**: Fanshaw Bay's eight-plane patrol and seven of
her strike group and her one Avenger (the record), St. Lo's four-plane dawn
patrol (the record has the patrol; its types are not in what was read, so
four Avengers stand in). The rest launch in waves (`launchEveryS` 75, first
wave 8, growing 30 % a wave), thirty at most in the air. Profiles: the
Avengers with GP bombs fly `dive` (they glide-bombed), the torpedo loads
`torpedo` (Morison n. 19, in the box's hangar hazard: Avengers "armed the
night before, many with torpedoes for Surigao Strait"); the Wildcats strafed
(`strafe`), Kitkun Bay's escorted her Avengers (`escort`), Fanshaw Bay's
patrol is `cap`.

**Formations and the place.** Taffy 3 in formation 5R: the carriers on a
circle round Fanshaw Bay 1,500 m across (Morison's 2,500 yards), the screen
on the `screenM` ring (Morison's "outer circle 6000 yards from the center";
1,500 m, the contract example's number), listed from Johnston's station,
"the nearest to the enemy" (Morison), all on 090°, east into the wind to
launch. Kurita in three heavy columns 1,200 m apart (Kurita's own sketch,
USSBS Nav 9 Plate 9-3: BatDiv 1 leading BatDiv 3 in the centre, CruDiv 5 with
Chōkai to starboard, CruDiv 7 to port) with DesRon 2 on the starboard bow and
DesRon 10 on the port bow, all on 110° ("All ships altered course to 110
degrees ... to come up-wind of your formation", Nav 9). The forces 5 km apart
on CTU 77.4.3's sighting bearing, 298° (the BE track chart's fixes give 287°,
the box's tracks 287–290°; the report is the first contact, so it wins), the
centre at their midpoint at 06:53 in the box's tracks, 126.045°E 11.818°N,
some 45 km off Samar over 5,000 m of water.

**Goals.** §2's: the US keeps four of six carriers afloat, Japan sinks four.
The phases follow §2's order and the record's beats: Japan opens fire
(Yamato at 06:58), the destroyers' torpedo attack (Yahagi's DesRon 10, about
09:15–09:25), the cruisers close the carriers' port quarter (CruDiv 7 and Haguro,
08:00–09:00), the Avengers come in (all morning), finish them (Gambier Bay
falls astern from 08:20); the US runs east making smoke (06:55–07:01), the
destroyers go in (Johnston from 07:06, Hoel and Heermann by 07:40), every
aircraft up, hold the cruisers off, and Kurita turns away (09:11).

**First units**: Yamato at the main battery, Johnston at the helm.

**Footnote**: "In the surface action off Samar on 25 October 1944 Taffy 3
lost Gambier Bay, Hoel, Johnston and Samuel B. Roberts; Chōkai, Chikuma and
Suzuya were crippled and lost later that day; and at 09:11 Vice Admiral
KURITA Takeo 栗田健男 turned his force north." It names both navies' losses
in the same words (DESIGN.md §7.4) and is scoped to the surface action:
St. Lo, lost to the Shikishima unit at about 10:50, stays on the box's
closing card and out of the wargame (R8 §5.2 e: the first tokkō attack is
kept out of the sim entirely).

## 4. Midway

**Forces.** The Kidō Butai's four carriers with Haruna, Kirishima, Tone,
Chikuma, Nagara and eleven destroyers; TF 16's and TF 17's three carriers
with seven heavy cruisers, Atlanta and fourteen destroyers: every ship unit
of the box (45).

**The aircraft on deck**, from the box's own groups, carrier by carrier:
Akagi and Kaga each their morning patrol (18 A6M), their Midway strike's
escort (9 A6M) and dive bombers (18 D3A1); Sōryū her escort (9) and the
Midway strike's level bombers (18 B5N2); Hiryū her patrol (18), the escorts of
her two strikes (12) and the strikes themselves (18 D3A1, 10 B5N2). Enterprise
Scouting Six, Bombing Six and its leading section (33 SBD-3), Torpedo Six (14
TBD-1), Fighting Six (10) and the fighters TF 16 sent to TF 17 at noon (16);
Hornet her dive bombers (35), Torpedo Eight (15) and Fighting Eight (10);
Yorktown Bombing Three (17), Scouting Five (10), Torpedo Three (12), Fighting
Three's escort (6) and her two patrols (20). **Invented for the arena**: the
Midway strike's D3As and Sōryū's B5Ns armed against ships (they carried
bombs for the island in the record), Hornet's dive bombers finding the
carriers (they did not), and the airborne counts: the US starts with 30 up
(Torpedo Eight's eight, Torpedo Six's four, eight Dauntlesses, four escorts,
six fighters on patrol), the torpedo planes first, as at 09:20–10:16; Japan
with its three patrols' eighteen Zeros up. The patrols at noon and later in
the box are the same fighters launched again; their counts here are the
groups', so a side's fighters may exceed one squadron's strength by a few
(Yorktown's 26 against VF-3's 25 that day, R4 §3.1).

**Formations and the place.** Each side drawn in to one circle round its
guide (Akagi; Enterprise), the carriers on a ring 1,000 m across, the screen
on a 1,000 m ring; in the record the Kidō Butai's carriers stood 6 to 9 km
from Akagi (the box's stations) and TF 16 and TF 17 steamed apart. Both on
135°, the courses of Akagi and Enterprise at 07:00 in the box (into the
south-east wind). 5 km apart on the bearing between the forces at 05:52, when
the Catalina's report of "carriers and battleships steaming south-east" is
the box's first contact (the Kidō Butai on 252° from the US carriers, the
box's tracks), the centre at their midpoint, 178.262°W 30.954°N, open sea.

**Goals.** §2's: three of four Japanese carriers out of action for the US,
two of three American for Japan, as `sink` with `outOfAction` (§2 above).
Phases from the record's day: the US torpedo squadrons go in, the dive
bombers arrive while the Zeros are low, the counterstrike (Hiryū's), the last
carrier (Hiryū at 17:01), hold on; Japan breaks up the torpedo attacks, keeps
its carriers afloat under the dive bombers, gets the counterstrike through,
the dive bombers on a carrier (12:05 on Yorktown), the torpedo planes (14:44).

**First units**: a Zero of the patrol (Japan), a Dauntless of the strike (US),
both pilot. Neither is a named crew (ROUND-2 §2): the cut lands in an
airborne aircraft of the kit, never a group's leader.

**Footnote**: "On 4 June 1942 dive bombers from Enterprise and Yorktown set
Kaga, Akagi and Sōryū ablaze between 10:22 and 10:26 and Hiryū at about 17:00,
and all four were lost; Yorktown, hit by Hiryū's dive bombers and torpedo
planes, was torpedoed by the submarine I-168 on 6 June and sank the next
morning." (Kaga 10:22–10:24, Sōryū 10:25, Akagi 10:26, Hiryū 17:01, the box's
attacks; Yorktown's end from the box's fates, NWC p. 185 and CV-5's report.)

## 5. Ironbottom Sound

**Forces.** Lee's TF 64 (Washington, South Dakota, Walke, Benham, Preston,
Gwin) and Kondō's Emergency Bombardment Force (Kirishima, Atago, Takao, their
direct escort Teruzuki and Asagumo, Nagara's screening unit with Samidare,
Inazuma, Shirayuki and Hatsuyuki, Sendai's sweeping unit with Shikinami,
Uranami and Ayanami): fourteen. Tanaka's Oyashio and Kagerō, of the
reinforcement unit, which fired at Washington at 00:39, stay out: §2 names
Kondō's force. No aircraft.

**Formations and the place.** Lee's single column, the destroyers ahead (ONI
Part III: "the destroyers keeping station 300 yards apart, with the heavy
ships about 5,000 yards astern"; in the arena 400 m apart, Gwin 800 m ahead of
Washington), on 295°. Kondō's column as Morison has it at 23:48 (Asagumo and
Teruzuki leading Atago, Takao and Kirishima) with the screening and sweeping
units ahead of it, as Kondō's order put them "some 10 kilometers ahead"
(Lundgren, R5 §3.2), on 130°, Kirishima's course at midnight. 2.5 km apart on
008°, the bearing of Washington's fire at midnight ("Bearing 008°, 8,400
yards", ONI Part III), the centre at the midpoint of the two battleships then,
159.654°E 9.139°S, west of Savo in 1,100 m of water, 15 km from Savo and Cape
Esperance, so no island stands in the arena. The sky is the box's after
moonset.

**Goals.** §2's: the US sinks Kirishima and two cruisers (a main goal of
`sink bb 1` and `also: sink 2 of ca/cl`), Japan a battleship. Phases from the
record's night: Washington's radar contact on the leading ship (23:16), the
destroyers' fight (23:22–23:42), the searchlights on South Dakota (23:48,
24:00), Washington unseen (24:00–24:07), the last torpedoes (Tanaka's at 00:39
in the record, Kondō's in the arena); for Japan, Kirishima opens fire (23:52,
her bridge seeing South Dakota "lying dark"), the screen's torpedoes (23:30),
Atago's searchlights (24:00), Atago's and Takao's torpedoes (24:03), finish
her. Two phases name searchlights (South Dakota fixed in them; Atago holding a
battleship): if the arena draws no searchlight, those two texts should say
what it does draw.

**First units**: Kirishima and Washington, each at the main battery.

**Footnote**: "In the night of 14–15 November 1942 Walke and Preston were
sunk, Benham was lost the next afternoon and South Dakota was badly damaged;
Kirishima, wrecked by Washington's radar-directed 16-inch fire, capsized at
about 03:20, and Ayanami was scuttled." (The box's fates: Walke and Preston
23:42, Benham scuttled 17:24 the next day, Kirishima capsized 03:20 after
Morison, Ayanami scuttled at a time not in what was read.)

## 6. The check

`tools/check/wargames.mjs`, under the runner, holds §6's rules and the voice:
the three frozen scenarios present (real data); id, box, title, the label
word for word, durationS; the arena inside the box's frozen bounds, all of it
at sea in the box's pack, reciprocal bearings; every ship a unit of the box on
its side, never fixed, hospital or tokkō, its kit in the kits, on one side
only; the guide one of the ships, the screen radius, the formation naming
every ship once; each side's start laid out from its formation (`layout()`,
exported): no two ships within 150 m, none more than 1 km outside the arena
(the bound smoke-arena holds the sim to), a warning just outside; aircraft on
carriers (a cruiser or battleship only a float plane), kits of the side,
profiles their type can fly, `airborne` within the count, thirty at most in
the air; `first` a ship of the side or an aircraft kit it has (airborne, a
warning otherwise) at a station it offers (`stationsOf`, battle.mjs); the
goals of the frozen vocabularies and satisfiable (sinks and shoot-downs within
what the other side has, survivals within one's own, a reach by units one has,
a weapon one's side carries); 5–7 phases, ordered, each inside the ten
minutes, a warning when one starts before the last has run its timer, and
another when the first count in a goal's order disagrees with its `count`;
the admiral's ranges and a launch interval exactly when the side has aircraft
(a warning outside §1's 60–90 s); the footnote one sentence; the sources in
the ledger, one at least opened; the `skyAt` on the box's clock.

The voice, on every user-facing string (title, label, side name and leader,
goal texts, phase titles and texts, footnote): the copy rule (nothing that
says what the app does not draw); slurs and glory words (common.mjs); the
never-list (kill, score, win, enemy, victory, defeat, destroyed, saved, what
if, alternate history, avenged, hero, glory, sacrifice), applied to every
string in the file, notes too; no count of people, in digits or words, and no
word for the dead (killed, dead, died, casualties, wounded, survivors); a
Japanese name family first, and at a card's first mention in capitals with
the given name and the kanji (the start sheet, whose leader line the HUD's
later "Kurita" leans on, and the end card's footnote on its own); "tokkō
(special attack)" where tokkō is named; and no ship named that the scenario
does not field. Counts of ships in goals are the game's own and allowed
(§1's "Keep four of six carriers afloat"); the no-numbers rule of tellings
does not apply to them.

Against the fixtures (`test-data`) the module checks whatever scenario a
fixture writer left (engine-3's `tools/fake-wargame.mjs` may write one) with
the fixture box and kits, and the rules §6 does not list (the label, the
sources, the 5–7 phases) are warnings there. A fixture scenario on `test-box`
was written, passed and removed while building it.

Every rule was tried against a mutated copy of each scenario (39 mutations:
an unknown ship, a ship on both sides, the arena off the box or on Samar's
coast, too many carriers to sink, four phases, a phase past the clock, a
shoot-down of ships, two sentences, an unknown source, a first unit of the
other side, a station the unit lacks, "kill", "enemy", "1,500 men", "died",
"Takeo Kurita", a lower-case first mention, an announcement, tokkō unglossed,
kamikaze without tokkō, a slur, an absent ship named, 52 airborne, a fighter
on a torpedo run, a fighter on a destroyer, a launch interval without
aircraft, two ships on one spot, a column 5 km out ...); each raised a
problem.

## 7. Where this departs from the contract, and why

- **Side names.** §6's example writes `"name": "Kurita's Centre Force"`. On
  the start sheet that would be the first mention of a Japanese personal name,
  in lower case and without the kanji (DESIGN.md §7.3), so the name is "The
  Centre Force" and the commander is a `leader` line, "Vice Admiral KURITA
  Takeo 栗田健男"; the HUD's later "Kurita's cruisers" leans on it.
- **The arena's centre and the bearings** differ from the example's
  ([126.0, 11.45], 345°/165°): the task asks for the record's first contact,
  and the record's sighting bearing is 298°.
- **"Out of action"** (Midway's goals in §2) has no goal kind in the frozen
  vocabulary: it is `sink` with `outOfAction: true`. An engine that reads only
  §6 would ask for carriers sunk, which is harder; the integrator wires it.
- **Ironbottom Sound's US goal** is two terms ("Kirishima and two cruisers"):
  `sink bb 1` with `also: [sink 2 of ca/cl]`. An engine that ignores `also`
  resolves the goal on Kirishima alone.
- **Ironbottom Sound's separation** is 2,500 m (`separationM`): §2's row says
  "at 2–3 km"; §2's general sentence and §6's example place the enemy 5 km
  away. An engine that does not read `separationM` starts it at 5 km.
- **The Samar footnote** names both navies' losses and is scoped to the surface
  action (§3 above); the example sentence named the US losses only.
- **`screenM`** keeps the example's 1,500 m for Taffy 3 as the screen ring's
  radius (§2's words), with the carriers on their own ring 1,500 m across (the
  task's words); laid out, Taffy 3's far screen ships start 906 m outside the
  arena, inside the 1 km bound, and the check warns of it. If the integrator
  reads the task's "a circle 1,500 m across" as the whole formation, `screenM`
  750 is the number.

## 8. What could not be settled, and what needs a person

- **St. Lo's VC-65 and Gambier Bay's VC-10 on 25 October 1944**: numbers not
  in what was read (Morison XII's appendix, in print, or the squadrons' ACA
  reports at NARA would have them); fourteen and twelve stand in.
  White Plains' VC-4 is DANFS's April complement; Kitkun Bay's VC-5 is what
  the record shows launched (eleven and ten), perhaps short of her full deck.
- **St. Lo's dawn patrol**: four aircraft, types not read; four Avengers stand
  in.
- **The Japanese float planes** at Samar and Ironbottom Sound (Yamato's,
  Tone's, Atago's ...): in no group of the boxes, so in neither scenario.
- **Kondō's force's Japanese name** (and so the side's `ja` at Ironbottom
  Sound) is not settled in anything read; it is left out rather than guessed.
- **A historian's eye** on the phase texts and the three footnotes, and a
  Japanese reader for the side names, as DESIGN.md §7.5 asks of every card.
- **Balance** is the integrator's (ROUND-3 §3: the admiral's parameters, not
  the record). The admirals here are §6's example for Samar and first guesses
  elsewhere: at Ironbottom Sound fourteen ships with torpedoes against six may
  favour Japan heavily; at Midway the US flies more dive bombers into fewer
  fighters than Japan; Samar's Japanese side has no aircraft, so its admiral's
  combat air patrol and launches do nothing and Taffy 3's patrol finds nothing
  to intercept (re-task it to strafing).

## 9. For the integrator

- The engine reads §6's fields; the extensions of §2 above are what make the
  three scenarios play as written: `outOfAction` (Midway's goals), `also`
  (Ironbottom Sound's US goal), `types` (a cruiser is `ca` or `cl`), `by` and
  `weapon` (whose hit, and with what), `rangeM` (a `reach`), `separationM`,
  `formation` and `headingDeg` (the start; `layout()` in the check is the rule
  written out, and the engine's own placement should agree with it or the
  check should change with it), `airborne` and `maxAirborne` (who is up at the
  start), `waveSize`, `firstStation`, `skyAt`, `night`, `starShells` and
  `visibilityM`.
- Strafing: ROUND-3 §3's damage table has no entry for a fighter's guns on a
  ship; the scenarios fly Wildcats on `strafe` as the record has them, and the
  sim decides what a strafing run does (nothing to the hull, perhaps a few
  seconds of the target's AA silenced). Avengers on `dive` carry GP bombs (a
  bomb, 2).
- The start sheet: `name`, `leader` (with the kanji) and `ja`; the label; the
  goals' `text`. The HUD: the phases' `title` and `text`, with the timer from
  `withinS`. The end card: `footnote`. The check holds the first mention of a
  Japanese name to the start sheet and the end card separately, so a UI that
  shows a phase text before the start sheet would break the rule.
- `tools/check/wargames.mjs` imports `stationsOf` and `JAPANESE_NAMES` from
  `tools/check/battle.mjs` (unchanged); a rename there needs the import
  changed.
- Fold into the contracts: DATA.md gains a section on `wargames/<id>.json`
  (§2 above is its table); RESEARCH.md's index gains this file. (The task
  that started this workflow named a ROUND-3 "§9" for the notes file; the
  contract has no §9, and §8's table names `research/content-3.md`.)
