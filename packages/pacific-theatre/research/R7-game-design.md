# R7: game design precedents and the mechanics of the playable sortie

Researcher R7, 22 October 2026, for the designer of **Pacific Theatre**. Brief
read: `BRIEF.md`; drafts read and taken as superseding it: `design/DESIGN.md`
(§5.5, §5.7, §8, §9, §11) and `design/ENGINEERING.md` (§2, §5, §7, §8), plus
`design/DATA.md` §8–§9 and R4's air-battle report for the record's numbers.
The owner's decisions are taken as given: both sides playable in any battle
between military forces (Pearl Harbor's attack included; the firebombing and
the atomic bombings are cards only); inside a battle the player can turn its
tide and nothing outside it changes; watching is always the alternative; v1 is
Midway, the Second Naval Battle of Guadalcanal, Samar and Pearl Harbor.

**How to read the marks.** *opened* = I fetched and read the page or file named
in §11. *computed* = I worked it out with a script in
`research/r7-scripts/` from opened numbers (the scripts are there to rerun).
*memory* = my own knowledge of the game or subject, not checked against a
source in this pass. *verify* = not opened, or a number I could not confirm;
treat as a placeholder. A game I describe from memory is marked so in the
survey table's "basis" column.

---

## 0. Headline findings

1. **Do not compress distance inside a box; compress time.** Every precedent
   that compresses distance does it because players spawn far apart and must
   meet within minutes: World of Warships draws ships "roughly twice as large
   than they should be; put another way, each map is twice as small as it
   should be ... to condense gameplay" (its wiki, *opened*). Pacific Theatre
   enters every sortie already in position at the record's ranges, so true
   size and true distance cost nothing in the moment itself, and they keep
   the record's ranges, times of flight and tracks honest. What remains slow
   (shells in flight, torpedo runs, transits after the checkpoint) is a time
   problem: ships' moments at **2×** (gunnery) or **3×** (torpedo runs, helm),
   aircraft at **1×** in combat, plus a bounded player-controlled compression
   that drops itself to the default when a threat appears (§4.1).
2. **A single drag model reproduces the published times of flight to within
   2 %.** A point-mass shell with one Mach-dependent drag curve, the standard
   atmosphere and *one* form factor per shell fitted to the published maximum
   range matches the BuOrd/NavWeaps time-of-flight tables for the US 16"/45,
   the Japanese 46 cm, the US 8"/55 and the US 5"/38 within ±2 % at every
   tabulated range (*computed*, §4.4). It confirms ENGINEERING's check value:
   Washington's 16-inch at 8,400 yd is **11.9 s** (the table interpolates to
   12.0 s). The same fit gives the guns no table was found for (Kirishima's
   36 cm, the Japanese 20 cm and 12.7 cm, Yamato's 15.5 cm).
3. **ENGINEERING's group-loss rule would cancel the record's own hits.** As
   written, "a `hit` by a group that has lost more than half its aircraft
   fires with its count scaled by the survivors and drops to nothing below a
   quarter". Hiryū's strike on Yorktown had already lost 11 of 18 dive
   bombers to the CAP when its three hits landed (seven broke through; R4
   §3.10–3.11), and VT-3 had lost 7 of 12 before it dropped. Scaling must be
   against **the record's own survivors at the attack**, not against launch
   strength (§3, item 1; §4.7).
4. **"Fatal" needs two tracks, not one number.** Kaga was finished by 10:25
   and sank at 19:25; Yorktown survived three bombs at 12:05 and was steaming
   at 19–20 knots by 14:00; South Dakota took 26 hits on 15 November and came
   home; Kirishima took 9 or 20 heavy hits and capsized about two and a half
   hours later. One 0..1 "damage" with a single `fatal` threshold cannot
   produce all four. Recommended: a **fight** track (what the ship can still
   do) and a **float** track (whether it sinks), with a **doomed** state and
   a sinking time, and on carriers a **hangar hazard** (fuelled and armed
   aircraft below) that decides whether bomb fires run away. Per-hit values
   and calibration tests are in §4.8.
5. **AA can be a calibrated hazard, not ballistics.** COMINCH's own 1945
   summary gives "rounds per bird" by weapon (5-inch common 960, 5-inch VT
   470–624, 40 mm 2,272–3,361, 20 mm 8,972–15,139, 1.1-inch 2,231–7,152;
   *opened*) and a planning table of 60 % of attackers lost to CAP and a third
   of the rest to AA. Turned into a kill rate per barrel per second and scaled
   by era, alertness and how the fire is shared, it gives **27 %** for a D3A
   diving on Yorktown (the record: about 2 of the 7 that dived), **2–3 %** for
   an SBD over Kaga at 10:22 (the record: AA "slow to start", few losses over
   the target), **31 %** for a B5N's run on Yorktown at 14:43, and **10 %**
   for a first-wave torpedo plane at Pearl Harbor (*computed*, §4.6). AA
   rounds become tracer for the eye only.
6. **The drafts' ship acceleration is two to four times too quick.** From
   displacement, shaft horsepower and top speed, the time constant of a
   battleship's speed is 150–220 s (90 % of full speed from rest in 220–320
   s), a fleet carrier's 140–165 s, a heavy cruiser's about 70 s and a
   destroyer's 36–40 s (*computed*). ENGINEERING has "BB 90 s, CV 60 s, CA
   45 s, DD 25 s to 90 %". Keep physics: ships start at the record's speed,
   the helm matters more than the telegraph, and at 2–3× the felt times halve
   or third (§4.4).
7. **For flying, the browser precedent is War Thunder's mouse aim, and the
   touch precedent is Ace Combat's "Normal" stick.** War Thunder's arcade has
   a lead marker, no spins and no structural failure, and its "instructor"
   flies the aircraft toward the pointer (wiki *opened*; instructor from forum
   reports). Make mouse-aim the default on keyboard and mouse and a
   bank-to-turn stick that levels itself the default on touch; keep direct
   pitch/roll as an option (§4.2, §4.12).
8. **Give the aircraft their historical characters from NACA's own chart.**
   NACA Report 868 (1947, *opened*, fig. 47) plots roll rate against speed
   with a 50-lb stick force: the P-40F peaks near **95°/s** at 260–300 mph,
   the F4F-3 near **75°/s** at 240 mph falling to about 63°/s at 300 mph, and
   the Japanese Zero near **55°/s** at 245 mph falling to about **40°/s** by
   310 mph. With computed sustained turns (A6M2 about 14 s for 360°, F4F-4
   and P-40B about 21 s), the Zero out-turns everyone slow and cannot roll
   with anyone fast. That is the Thach lesson, and it falls out of the
   numbers (§4.2).
9. **Reviewers punished the same four things every time:** hauling slow ships
   across a map, long missions with no checkpoint, being forced into a unit
   "because it makes the mission harder", and tutorials that teach controls
   instead of the situation. They praised bombing runs ("never get old",
   IGN), the sky full of aircraft, and a strong opening set piece (Medal of
   Honor: Rising Sun's Pearl Harbor). Eurogamer on Battlestations: Midway: a
   lost 40-minute mission is "hellishly annoying"; on Battlestations:
   Pacific: "too many missions involve hauling flotillas of ships sloooowly
   across the map" (*opened*). The moment-plus-checkpoint design answers all
   four, if the checkpoint is real (§2.3).
10. **Playing the Japanese side has precedent, and so does avoiding the
    wrong kind of it.** Battlestations: Pacific opened its Japanese campaign
    at Pearl Harbor (Eurogamer: "rather boldly ... a welcome addition"; Game
    Informer: a "peculiar direction" that "relives the bombing of Pearl
    Harbor from the eyes of the aggressors") and made the Ohka and Kaiten
    playable, which Game Informer reduced to "giving a kamikaze plane a test
    run" (*opened*). Pacific Theatre's rule (both sides in fights between
    forces, never a tokkō role) sits between the two.
11. **Japan's reception is mixed and documented.** Both Battlestations games
    were published in Japan by Spike (Famitsu 27/40 and 30/40 for Midway, 29/40
    for Pacific). Medal of Honor: Rising Sun's Japanese edition removed the
    hinomaru from the box logo and the rising-sun flag from the titles and
    re-recorded the Japanese soldiers' shouts. Call of Duty: World at War had
    no Japanese release until a 2024 storefront listing. World of Warships
    removed the rising-sun naval ensign from every server in 2015 and flies
    the national flag on Japanese ships instead (ja.wikipedia, *opened*).
    How the app draws IJN ensigns is a decision (§7, D13).
12. **The design's remaining hole is the cascade.** A saved Kaga relaunches
    on the record's cycle times, but the record says nothing about what her
    strike then does, or what TF 16 does about it. "Nothing else deviates"
    cannot hold once the player saves a carrier. Bound it (the strike that
    was actually spotted, aimed at the last contact the record gives), label
    it on the after-card as the sim's guess, and make a new moment always
    start again from the record (§6).

---

## 1. Method

- Read the brief, the drafts, DATA.md §§7–9 and R4 (air battles) first, so
  that every number recommended here can be checked against the record's
  numbers already gathered.
- Surveyed the named games from Wikipedia's article source (`action=raw`
  through curl), from English and Japanese Wikipedia for Japanese releases,
  and from reviews where the hosts answered (Eurogamer, IGN, Game Informer,
  Subsim). GameSpot, Giant Bomb, StrategyWiki, MobyGames and TrueAchievements
  refused (§12).
- Read the mechanics from the games' own wikis where they answered: World of
  Warships (`wiki.worldofwarships.com`, raw pages) and War Thunder
  (`wiki.warthunder.com`, through WebFetch).
- Took gun, torpedo and turret numbers from NavWeaps (BuOrd range tables and
  the US Naval Technical Mission to Japan reports as NavWeaps quotes them),
  the battle damage from Robert Lundgren's analyses on NavWeaps, roll rates
  from NACA Report 868, and AA effectiveness from COMINCH P-009 on HyperWar.
- Computed what the sources did not tabulate, with three scripts in
  `research/r7-scripts/`: `ballistics.py` (times of flight), `aero.py`
  (stall, turn and climb from weight, wing and power), `gunnery_mc.py` (hit
  probability per shell) and `aa_calib.py` (AA kill probability). Each
  prints its inputs; rerun them to change an assumption.
- Downloads are under `research/downloads/R7/` and small, except one
  duplicate NACA scan (110 MB) that came down by mistake and was deleted at
  once; the 8.9 MB copy used is kept.

---
## 2. The precedents

### 2.1 At a glance

Basis: **O** opened (§11 has the URL), **M** memory, **O+M** both. A cell
marked *verify* is a claim I could not check.

| game (year) | what it is | scale and time | control and aiming | damage | camera, structure | basis |
| --- | --- | --- | --- | --- | --- | --- |
| **Battlestations: Midway** (Eidos Hungary, 2007) | action plus real-time tactics: command a fleet on a map, or take any unit | map compressed; ranges short (a Battlestations: Pacific achievement asks for a battleship kill "at over 2800 meters", search snippet only, *verify*); weapons restock over time (Pacific, O) | ships: speed steps, rudder, a reticle with zoom; "fire torpedoes ahead and behind ships to bracket them"; aircraft: "learn to lead ships with bombs" (IGN, O); dual-stick on pad | ship repair screen for "leakages, fires, mechanical issues or weapons failure" (Eurogamer, O) | chase; tactical map; 11 missions, 1-hour tutorial, no checkpoints; 40-minute missions | O+M |
| **Battlestations: Pacific** (2009) | the sequel; a US campaign and a Japanese "what if" campaign | as above | as above; Ohka and Kaiten playable (O) | ships "split in two" (O) | checkpoints added but no restart from them in-game (Eurogamer, O) | O |
| **World of Warships** (Lesta/Wargaming, 2015–) | PvP naval arcade | ships about **2×** too big for the map, maps 24–48 km square (O); speeds and shell times "creative licence" (bit-tech preview via search, *verify*; the often-quoted 5.22 and 2.61 factors not found) | throttle in six steps (W/S), rudder held (A/D) or set in steps (Q/E) that stays until countered; shell time shown under the crosshair; horizontal dispersion = R(km)×10+60 m for US battleships, ×7.2+84 for Japanese (O); torpedo "white cone" lead aid, narrow/wide spread (O) | hit points; fires 0.3 %/s for 60 s (battleships) or 30 s, four fire zones; floods 0.25–0.5 %/s for 40 s and −30 % speed (O) | third person; matches about 20 min | O |
| **War Thunder**, naval and air arcade (Gaijin) | PvP combined arms | ships near true scale; arcade ships get "a large boost to engine power and traverse speed"; torpedo speed **×3 up to 4 km**, falling to ×1 at 8 km (O) | naval arcade: "will always aim where your cursor is pointed", gunners auto-correct range after a close hit, horizontal targeting ×2 (O); air arcade: lead marker, no spin or structural failure, ammunition replenished in the air (O); mouse aim through an "instructor" that blocks stalls and spins (forum reports, O; mechanism *verify*) | ship crew and compartments, fire and flooding as player actions (dev blog via search, *verify*) | air spawns in the air near the fight (M) | O+M |
| **Task Force 1942** (MicroProse, 1992) | surface actions around Guadalcanal, either side | campaign on a map, battles in time compression (M) | bridge stations; star shell, searchlights and radar at night (M, *verify*) | — | Dragon gave it "X" because it would not install (O) | O+M |
| **Great Naval Battles** (SSI, 1992–95; Vol. II is Guadalcanal) | fleet command plus individual ship stations | — | "individual ship views and fleet command views ... individual stations" (O); Vol. III's air combat "problematic" (O) | — | — | O |
| **Fighting Steel** (SSI, 1999) (added as a night-surface precedent) | surface actions 1939–42 | "several speeds above normal but you won't use them much once battle starts" (O) | torpedo spread chosen; guns allocated; star shell; an option for the US torpedoes' "80 % dud rate" (O) | complaint: "ships should take more than 40 seconds to sink"; wanted "an actual radar scope" (O) | a camera that "glides" from ship to ship and cuts to action automatically, with an interruption setting (O) | O |
| **Pacific Fighters / IL-2 1946** (1C:Maddox, 2004/2006) | full simulator, either side | true scale, real time, time compression (M) | full flight model; difficulty is a panel of toggles (stalls and spins, blackouts, vulnerability, realistic gunnery, limited ammunition, icons) (M) | component damage (M) | either side in missions and campaigns (O) | O+M |
| **Heroes of the Pacific** (IR Gurus, 2005) | arcade flight, US campaign from Pearl Harbor to Iwo Jima | compressed (M) | "Arcade" (single stick, automatic rudder) or "Professional" (separate pitch, roll, yaw) (O) | — | four difficulties; higher ones unlock aircraft (O) | O |
| **Secret Weapons Over Normandy** (Totally Games, 2003) | arcade flight; includes Midway | "the player can slow down or speed up the time at any moment" (O) | third person; unlimited fuel, limited ammunition (O) | — | wingmen orders; challenges; promotions and medals (O) | O |
| **Blazing Angels** (Ubisoft, 2006) | arcade flight; Pearl Harbor and Midway missions | compressed (M) | arcade; a target-tracking view (M, *verify*) | — | Famitsu 27/40 (O) | O+M |
| **Ace Combat 7** (Bandai Namco, 2019) | arcade jet combat | — | "Normal" (simplified) and "Expert" controls (O); in Normal the stick banks and turns and the aircraft levels itself (M); clouds cause icing and stalls (O) | — | briefings on a 3D map; mission scoring by rank (M) | O+M |
| **Sky Rogue** (Fractal Phase, 2017) | procedural arcade jet roguelite | — | "immediately welcoming and then tougher than you'd expect" (Rock Paper Shotgun on its store page, O) | — | — | O |
| **Carrier Command** (Rainbird, 1988) | strategy plus direct control of a carrier's drones | true-ish; drones lost beyond link range (O) | direct control of each vehicle (O) | — | "a splendid mixture of strategic planning and arcade action" (PC Format, O) | O |
| **Victory at Sea Pacific** (Evil Twin, 2018) | open-world naval RTS | "switch between commanding the entire Pacific theatre to zooming down to take control of individual ships and flights of planes" (O) | — | — | — | O |
| **Pacific Storm** (Lesta, 2005/06) | grand strategy plus RTS battles | — | direct control of units; man an AA mount or a bomber's guns in first person (O) | — | criticised for inaccuracies (two Colorados at Singapore) (O) | O |
| **"Midway (the 1980 Atari arcade)"** | not found | — | — | — | — | see §2.2 |
| **Midway Campaign** (Avalon Hill, 1980) | text wargame in BASIC | one-hour turns; task forces moved by bearing; strikes, CAP (O) | — | — | — | O |
| **1943: The Battle of Midway** (Capcom, 1987) | vertical-scrolling shooter | — | the player flies an American P-38 "seeking revenge" against the Japanese fleet; final boss Yamato; the American framing was "for Western markets" (O) | a fuel bar as life (O) | — | O |

### 2.2 Notes by game, on the questions asked

**Battlestations: Midway and Pacific.** The nearest precedent in spirit: a
battle runs around the player, who may take any unit at any time while the
AI flies or steers the rest. What reviewers said, verbatim (*opened*):

- On the hybrid: "one of the real master-strokes of the game's design is that
  it always gives you the option of taking direct control of any of the units
  whenever you see fit" (Eurogamer, Midway). Against it: "Trying to fire
  artillery, line-up torpedo strikes, steer, manage speed, perform repair
  tasks, evade incoming torpedoes and manage other units turns your average
  battle into the kind of plate spinning task that quickly ends in disaster",
  and the AI "generally [is] a lot better at getting them on target than you
  will be, particularly naval units", because "the optimal time to strike
  might be when enemy units are distant specks on the horizon" (the same).
- On pace: "too many missions involve hauling flotillas of ships sloooowly
  across the map, before swapping to a shooting gallery" (Eurogamer,
  Pacific); "navigating slow ships with even slower ammo reloads and
  babysitting units doesn't add up to a riveting experience" (Game Informer,
  Pacific, 6/10).
- On structure: an 11-part tutorial "fully an hour"; missions that "sprawl
  to 40 minutes or more" with no checkpoint (Eurogamer, Midway); in the
  sequel, checkpoints but no restart from one in the pause menu.
- On being forced: a mission gives "only a solitary squadron of three
  fighters" though "a vast invasion force" is on the map; "being forced into
  dogfighting feels like an intrusion rather than a thrill" (Eurogamer,
  Pacific).
- On what worked: "Bombing runs never get old"; "you learn to lead ships
  with bombs and to lead enemy fighter planes with your guns ... to fire
  torpedoes ahead and behind ships to bracket them"; "the slow-lumbering
  turning radius of carriers"; "no slowdown even with 40 planes in the air"
  (IGN, Midway, Xbox 360). "Seeing a good couple of dozen planes flying in
  formation ... literally filling the sky - and then scattering as you swoop
  in" (GamesRadar, the part that loaded).
- The scale itself: map scale, weapon ranges and time compression were not
  found. StrategyWiki's weapons page (ranges "in nautical miles and metres")
  refused the container; the "2800 metres" achievement is a search snippet.
  From memory, ranges are a few kilometres and ships cross a map in minutes
  (*verify*).
- **Rails and agency**: missions have scripted objectives, enemy waves and
  fail states; inside a mission the AI fights dynamically and the player can
  change its course by taking units (O+M). The Japanese campaign of
  Battlestations: Pacific is a scripted alternate history ("Japan is
  victorious at the Battle of Midway ... invade Hawaii ... MacArthur signing
  a peace treaty on the Yamato in San Francisco Bay", Wikipedia, *opened*),
  not a history the player's results bend.

**World of Warships.** The source of the ship-scale question. Its wiki
states the 2× inflation and its reason (above). Mechanics worth copying:
the throttle as steps that persist and the rudder as a held or stepped order
that persists (WoWs "Maneuvering", *opened*: "Rudder movement is not
instantaneous ... a major turn, e.g. 180°, can take 30 seconds or more");
time of flight printed under the crosshair; a dispersion ellipse per turret,
Gaussian, with the in-port number as one probable error at maximum range;
the torpedo cone that shows where a spread meets a target holding course
and speed. Mechanics not to copy: hit points that fire and flooding drain
as fixed percentages per second, which turn a sinking into a bar emptying.
The "fake ranges" (shell flight shortened by a constant, and ship speeds
multiplied, so that 30 knots looks like 30 knots on a half-size map) are
community lore here: the 5.22 and 2.61 factors were not found in anything
opened (*verify*).

**War Thunder.** The browser-relevant precedents are its arcade aids,
quoted from its wiki (*opened*): ships' engines and turret traverse boosted
(traverse "doubled"), aim "where your cursor is pointed", gunners who
auto-correct range after a close hit, the torpedo speed multiplier (×3 to
4 km, ×1 beyond 8 km), a lead marker for aircraft guns, no spins or
structural failure in arcade air, ammunition replenished in flight. Its
mouse aim (memory, with forum confirmation that the "instructor" blocks
stalls and spins) is the best-known solution to flying with a mouse: the
pointer sets where the nose should go and a controller flies the aircraft
there with real control limits.

**Task Force 1942, Great Naval Battles, Fighting Steel.** The night-surface
precedents. Task Force 1942 is the Guadalcanal surface battles, either side,
with a campaign (*opened*); that it modelled star shell, searchlights and
radar at night is memory (*verify*). Great Naval Battles let the player stand
at individual stations or command the fleet (*opened*). Fighting Steel,
added because its review is specific: a camera that glides between ships
and cuts to action on its own with a setting for how often; star shells;
torpedo spreads; the reviewer's wishes for "an actual radar scope" and for
ships that take longer than 40 seconds to sink (*opened*).

**Pacific Fighters / IL-2 1946.** The simulator end: both sides, carriers,
real time. Its difficulty panel (from memory: separate toggles for stalls and
spins, blackouts, vulnerability, realistic gunnery, limited ammunition and
fuel, icons, outside views) is the model for exposing aids as named
switches rather than a single slider.

**Heroes of the Pacific, Secret Weapons Over Normandy, Blazing Angels.**
The arcade-flight end. Heroes offers "Arcade" (one stick, automatic rudder)
and "Professional" controls and four difficulties (*opened*). Secret
Weapons lets the player speed up or slow time "at any moment" and
removes voice when it does (*opened*): the precedent for bounded player time
compression. All three open their Pacific campaigns at Pearl Harbor on the
American side.

**Ace Combat, Sky Rogue.** Ace Combat 7's two control settings (*opened*)
and its Normal stick that banks and levels by itself (memory) are the touch
precedent. Clouds in Ace Combat 7 "hinder vision ... cause aircraft to ice
up and stall" (*opened*); at Midway the scattered cumulus over the Kidō
Butai is part of the record and could hide a diver the same way.

**Carrier Command, Victory at Sea Pacific, Pacific Storm.** Strategy games
that let the player drop into a unit. They show the hand-over (map to
cockpit and back) is old and well liked, and that the strategic layer is
what Pacific Theatre has chosen not to have.

**"Midway (the 1980 Atari arcade)".** No such game was found. What exists:
*Midway Campaign* (Avalon Hill, 1980, a text wargame in BASIC with one-hour
turns, which also came to Atari 8-bit computers, memory), Capcom's *1942*
(1984) and *1943: The Battle of Midway* (1987) arcade shooters, and a
MobyGames entry for an arcade shoot-'em-up called *Midway* whose page refused
the container (§12). The designer may have had *1943* in mind: a Japanese
company's game in which the player is American and the last boss is Yamato.

### 2.3 Rails plus agency: how scripted battles let a player change them

| game | the battle around the player | what the player can change | what reviewers found fun / tedious | basis |
| --- | --- | --- | --- | --- |
| Battlestations: Midway / Pacific | scripted objectives and spawns; the AI fights dynamically | anything in the mission: units live or die by the player's play; the mission is won or lost; the campaign does not branch | fun: bombing runs, the hop between units, the sky full of aircraft; tedious: transits, plate-spinning, no checkpoints, forced units, long tutorial | O |
| Battlestations: Pacific's Japanese campaign | a scripted alternate history from Pearl Harbor to San Francisco | nothing beyond each mission | "peculiar direction" (Game Informer); "rather boldly ... a welcome addition" (Eurogamer) | O |
| Call of Duty: World at War, Pacific levels | linear set pieces; one level puts the player in a PBY's turrets during Ten-Gō, "fighting off ... torpedo boats and Zeroes" until Corsairs arrive (Wikipedia plot) | only the immediate fight | not opened | O+M |
| Medal of Honor: Rising Sun | opens on USS California at Pearl Harbor: fires, AA, then a PT boat | the immediate fight | "the opening Pearl Harbor missions was a great introduction ... the later missions ... sub-par" (Wikipedia summary of reviews) | O |
| Medal of Honor: Pacific Assault | Makin, Guadalcanal (with a turn as an SBD gunner-pilot), Tarawa; a Pearl Harbor level from memory | the immediate fight | not opened | O+M |
| Heroes of the Pacific | 26 missions from Pearl Harbor to Iwo Jima | mission objectives | not opened | O |
| Order of Battle: Pacific | turn-based hex campaigns, Allied and Japanese | the campaign's battles (branching by result: memory, *verify*) | "fast, smart strategy" (Kotaku via Wikipedia) | O+M |
| P.T.O. / Teitoku no Ketsudan (Koei, 1989) | scenarios that "begin in the midst of a certain major Pacific conflict"; "if a scenario's goal is achieved, the player can continue with the full campaign" | everything | — | O |

**What follows for Pacific Theatre.** Its rule (the record is the default,
the sim is the truth, nothing outside the box changes) has no exact
precedent: the action games keep history fixed and give agency only inside
a set piece; the wargames let the whole war change. P.T.O.'s "achieve the
scenario, then keep going" is the closest to "a moment, then keep going".
The lesson from the reviews is practical: start in position (no transits),
keep each moment short with a real checkpoint and an instant retry from it,
never take away a weapon the unit had to make it harder, and teach the
situation in the briefing rather than the controls in a tutorial.

### 2.4 The Japanese side, Pearl Harbor from the attacker's seat, kamikaze, and Japan

| question | precedent | basis |
| --- | --- | --- |
| Playing the Japanese side | IL-2/Pacific Fighters (either side in missions and campaigns), Battlestations multiplayer (either side) and Battlestations: Pacific's Japanese campaign; P.T.O. (a Japanese studio) either side; Task Force 1942 either side | O |
| Pearl Harbor from the attacker's seat | Battlestations: Pacific opens its Japanese campaign there; the player can even sink the first game's hero's PT boat ("His name was Henry. This is not his story.") | O |
| Reception of that | Eurogamer: "Opening, rather boldly, with the bombing of Pearl Harbor, to which you contribute, it's a welcome addition"; Game Informer: a "peculiar direction" few Americans would want, reliving "the bombing of Pearl Harbor from the eyes of the aggressors" | O |
| Kamikaze | Battlestations: Pacific made the Ohka and Kaiten playable units; Game Informer: the Japanese campaign's appeal is mostly "giving a kamikaze plane a test run". Pacific Theatre never offers the role (owner's rule), and the check rejects a tokkō group as a role (DATA §10) | O |
| Japan: Battlestations | Midway ported and published by Spike, 7 February 2008, Famitsu one six and three sevens (27/40), Famitsu X360 30/40; Pacific by Spike, 28 May 2009, Famitsu 29/40 | O |
| Japan: Medal of Honor: Rising Sun | Japanese edition: the hinomaru removed from the package logo; the sixteen-ray rising-sun flag removed from the demo and opening titles; Japanese soldiers' shouted lines "substantially changed"; ja.wikipedia lists the game's misunderstandings (sword charges, a Zen garden in a Thai temple, a carrier named "Toshikaze" against the IJN's naming rules) | O |
| Japan: Call of Duty: World at War | "日本語版は未発売" (no Japanese release); on the Microsoft Store with Japan-region support from 24 December 2024 | O |
| Japan: World of Warships | after a 2015 dispute the rising-sun ensign was removed from all servers under a guideline on historical symbols; Japanese ships fly the national flag; Wargaming's CEO: an entertainment, not a place for political argument, "even if it becomes historically inaccurate"; anime collaborations (Arpeggio of Blue Steel, High School Fleet, Azur Lane) | O |
| Japan: other | Secret Weapons Over Normandy 30/40 (EA, PS2); Blazing Angels 27/40; Kantai Collection's huge success drew a South Korean charge of glorifying the IJN and Japanese replies (Japan Times; an Asahi piece arguing its permanent sinkings teach war's brutality) | O |
| A Japanese studio's American framing | Capcom's 1942 and 1943: the player is American "for Western markets" | O |

Nothing found records a public controversy in Japan over Battlestations:
Pacific's Pearl Harbor or its kamikaze units; I did not search the Japanese
press (§13). The pattern in what was found: publishers changed or removed
national and naval symbols, not the act of playing a side. For the app: name
ships and units in their own language with the same care on both sides (the
drafts already do), avoid the misnaming Rising Sun was mocked for (the check
should hold kit names to the IJN's naming rules), and decide the ensign
question once (D13).

---
## 3. Where the drafts are wrong, inconsistent or short of numbers

Numbered for reference; each points to the recommendation that fixes it.

1. **Group-loss scaling against launch strength (ENGINEERING §5, DESIGN
   §5.7).** "A `hit` by a group that has lost more than half its aircraft
   fires with its count scaled by the survivors and drops to nothing below a
   quarter." The record's own groups break this: Hiryū's first strike, 18
   D3A, seven through, three hits; VT-3, 12 TBD, five drops (R4). Scale by
   **survivors now ÷ the record's survivors at that beat**, and add a base
   rate for attackers beyond the record's count (§4.7). DATA §9's group
   needs `attack.reached` (a count range: how many reached the release in
   the record) for this to work.
2. **One `fatal` number (DATA §8, ENGINEERING §5 damage).** It cannot be
   both "Kaga's four or five bombs take her past fatal by 10:30" and "a
   `sinks` at 19:25 sinks at 19:25", nor separate Yorktown (three bombs,
   survived) from Kaga (four bombs, lost), nor Kirishima (lost) from South
   Dakota (26 hits, survived). Split into fight and float tracks with a
   doomed state and a hangar hazard (§4.8). Keep `fatal` as the float
   threshold and add `crippledAt`.
3. **Ship acceleration constants (ENGINEERING §5 ships).** "BB 90 s, CV 60 s,
   CA 45 s, DD 25 s to 90 %" are 2.5–3.5 times faster than displacement and
   power allow (§4.4 table). Use the physical values; the time scale already
   compresses them.
4. **Evasion bound.** An earlier draft had ±30° in the authority rule and
   ±20° in `cap.js`; the current ENGINEERING (re-read 22 October, after it
   changed on disk) says ±30° in one place and "evasion as above" in the
   other. Keep ±30°, add ±5 knots, and a return to the track within three
   minutes of the last salvo (§4.7).
5. **"Shells follow a ballistic arc ... with drag so time of flight ≈ the
   historical".** True, and now specified: one drag curve, the standard
   atmosphere and a fitted form factor per shell reproduce the tables to 2 %
   (§4.4). The check value holds (11.9 s at 8,400 yd).
6. **AA "hit chance per second from the fit and range".** Now specified:
   per-barrel kill rates from COMINCH's rounds per bird, a range fall-off, an
   era factor, an alertness ramp and a share of fire, calibrated against
   four record events (§4.6). Do not fly AA rounds as projectiles: at Pearl
   Harbor a hundred ships' guns would swamp the 4,096-slot buffer and the
   kill rate would depend on frame rate; draw tracer as effects only.
7. **Controls (ENGINEERING §8).**
   - **Ctrl for throttle down is unsafe in a browser:** with W held for
     pitch, Ctrl+W closes the tab, and Chrome does not let a page prevent
     Ctrl+W, Ctrl+T or Ctrl+N (memory). Use R/F or PageUp/PageDown.
   - **Esc to release the controls collides with the browser's own Esc,**
     which exits pointer lock and full screen; the page may not see that key
     press. Treat losing pointer lock as "pause and offer release", and put
     release on another key (Backspace, with a confirm).
   - Space must `preventDefault` or it scrolls; Tab moves focus.
   - Mouse-aim should be the default for aircraft, not optional (§4.12).
8. **Scene budget (ENGINEERING §7).** "Hulls as one mesh each" and "about
   60 to 80 draw calls for Midway's morning" are right for Midway; Pearl
   Harbor has about 96 ships in the harbour plus small craft (*verify* the
   count with R4/R5), which is 96 hull draws before anything else. Instance
   hulls per kit there (one material is already the rule), or use three.js
   `BatchedMesh` (in r160 by memory, *verify* against the pinned version).
   "Under 500 always" is a desktop number; a phone wants under 150 (§4.14).
9. **Depth and precision (ENGINEERING §2).** The current draft already
   writes instance matrices camera-relative and names a fallback for log
   depth. One addition: log depth writes fragment depth, which switches off
   early depth rejection, and the sea and the smoke are the two largest
   overdraw costs on a phone (memory); measure on a phone, not only on an
   integrated GPU, before the first sortie.
10. **Time scale (DATA §9: "1 for aircraft moments; ship moments may use 2
    or 3; nothing else").** Right as defaults. Add `maxTimeScale` for the
    bounded player compression (§4.1), and allow 4 for helm-only moments, or
    split Nevada's 30-minute sortie (08:40–09:10) into two moments.
11. **Moment start speed (DATA §9 example).** `speedMs: 70` at 4,500 m for
    the SBD is 1.4 times its stall speed at that height (computed: about
    49 m/s true at 5,800 m); start at 75–80 m/s true, which is the record's
    "about 115 knots" climbing approach (R4) at altitude.
12. **Determinism (ENGINEERING §2).** A seeded RNG and a fixed step make a
    sortie replay in one browser. `Math.sin`, `Math.exp` and friends are not
    required to be bit-identical across JavaScript engines (memory), so a
    replay may diverge between Chrome and Safari, and the smoke test should
    assert outcomes within bands (e.g. "Kaga doomed by 10:30"), not exact
    positions.
13. **A clock to reconcile (for R5, not this report).** Lundgren's Kirishima
    analysis has Washington open fire on Kirishima "at 0100 ... range 8,400
    yards" and cease at 0107; Wikipedia and DESIGN §3.4 put the bridge moment
    at 23:58–00:10; NavWeaps' 16-inch page says Washington "opened fire at a
    gun range of 18,500 yards" in her battle with Kirishima, which may be the
    23:17 opening on the Sendai group (*opened*, all three). One hour apart is
    a zone; the range difference is a telling.

---
## 4. Recommendations for v1

### 4.1 World scale inside a box

**Sizes: true, 1:1, no inflation.** Kits are already true size in metres
(ENGINEERING §6). World of Warships doubles ships because its PvP maps must
bring strangers into range quickly; nothing here needs that.

**Distances: true, no compression.** The record's tracks, the ranges in the
action reports and the times of flight are the subject; a compressed sea
would make every one of them false, and the table's placement of the box
(DATA §7) would stop agreeing with what is inside it. Entering in position
removes the reason to compress: every v1 moment starts within 3–40 km of its
fight (§5).

**Readability without inflation** (what WoWs buys with 2×):

| problem | what it looks like at true scale | aid |
| --- | --- | --- |
| a ship far off | Kirishima broadside at 16.9 km subtends 0.75°, about 16 px across a 1280 px, 60° view; an escort carrier at 30 km is about 6 px | a zoom sight (4×, 8×, 16×) in gunnery views; a minimum on-screen length of 6 px, below which the ship is drawn as its own silhouette sprite; a bracket on the target |
| aircraft far off | an SBD (12.7 m span) at 3 km is under 4 px | contact markers (a small chevron per aircraft beyond 2 km, a group label beyond 8 km), off by choice on Record difficulty |
| where things are | a 400 km box | a corner plot (the chart, at the box's scale, with own unit, target, group markers, own carrier or "Point Option") |
| how far | ranges invisible at sea | the HUD's range readout and a scale bar on the plot, in the unit's own system (yards and knots for US, metres and km/h for IJN, with a toggle) |

**Time.**

| what | default scale | player may compress to | drops back to default when |
| --- | --- | --- | --- |
| aircraft moment, in combat | 1× | 1× | — |
| aircraft, transit or after the checkpoint | 1× | 4× (in the box), 32× (after the checkpoint, flying home) | an enemy aircraft within 8 km, AA engaging, a dive or torpedo run begun |
| ship moment, gunnery (Washington, Kirishima, Yamato, CruDiv 7) | 2× | 4× | a salvo lands within 1 km of own ship, a torpedo track within 3 km, or own salvo is in its last 5 s of flight (so every fall is seen at the default) |
| ship moment, torpedo run or helm (Johnston, Samuel B. Roberts, an escort carrier, Nevada) | 3× | 8× | as above, plus an enemy ship within 5 km |
| watch mode | any | 1–60× | — |

**A strike's flight to the target is never flown in real time.** Every air
moment starts minutes from contact (§5). After the checkpoint, "fly home"
runs at up to 32× and ends with landing, ditching or the clock's end as a
summary line; nothing is gained by flying 150 km of empty sea at 1×.

### 4.2 The aircraft flight model

**Structure.** An energy-and-rates model, not aerodynamics:

- Roll rate `p = pMax(IAS) × input`, with `pMax` a short table per kit (below).
- Pitch commands a load factor `n = 1 + input × (nMax(IAS) − 1)`, capped by
  lift (`n ≤ q·S·CLmax / W`) and by the kit's G limit. Turn rate follows:
  `ω = g·√(n² − 1) / V`.
- Speed: `m·dV/dt = T − D(n) − m·g·sin γ`, with `T = η·P / max(V, 30)` and
  `D = q·S·(CD0 + k·CL²)`; `CD0` and `k` from the table below, so sustained
  turn rate, climb and top speed come out of one polar.
- Rudder is automatic (coordinated), as Heroes of the Pacific's Arcade mode
  and Ace Combat's Normal mode do; Q/E yaw only nudges the nose (useful for
  the last metres of a dive or a gun pass).
- **Stall:** when the commanded `n` needs `CL > CLmax`, `n` is capped; when
  `V < Vs(1 g)` the nose drops toward −20° at 30°/s, roll authority falls
  to 30 %, and control returns above 1.15 Vs. No spin (War Thunder's arcade
  has none); on Record difficulty a wing drops if the player rolls hard in
  the stall.
- **Dive limit:** above `vShake` the airframe buffets (camera shake, HUD
  warning); above `vBreak` the controls stiffen to 30 % and then a control
  surface fails (the sortie ends with the aircraft falling as a trail).
  Dive flaps (SBD) and dive brakes (D3A) add drag so a 70° dive settles near
  the historical speed.
- **Black-out** (no G-suits in 1942, memory): vision narrows from 4.5 g held
  for 2 s, goes dark at 6 g held for 3 s, returns 3 s after the load drops
  below 3 g; the controls keep working (the arcade convention). Off on
  Guided.
- **Ceiling and power:** power constant to the kit's rated altitude, then
  falling with density; climb is checked against the published figure.

**Parameters.** Speeds are true airspeed in m/s unless marked IAS; "comp."
is computed by `aero.py` (polar fitted to top speed with η = 0.8, e = 0.75,
the listed CLmax, at 1,500 m); "pub." is the commonly published figure,
*verify* against R6's kits. Roll curves are read from NACA Report 868
fig. 47 (*opened*), at 10,000 ft with a 50-lb stick force; IAS in mph is
converted (160 mph = 72 m/s, 240 = 107, 300 = 134, 380 = 170).

| | SBD-3 Dauntless | A6M2 Zero (Model 21) | F4F-4 Wildcat | B5N2 "Kate" | D3A1 "Val" (needed for Hiryū's strike and Pearl) | P-40B |
| --- | --- | --- | --- | --- | --- | --- |
| mass used, kg | 4,350 with the 1,000-lb bomb; 3,900 after | 2,410 | 3,610 | 4,000 with torpedo; 3,200 after | 3,650 with bomb | 3,450 |
| wing, m² / span, m | 30.19 / 12.66 | 22.44 / 12.0 | 24.15 / 11.58 | 37.7 / 15.52 | 34.9 / 14.37 | 21.92 / 11.38 |
| top speed (pub.) | 113 at 4,900 m (410 km/h) | 148 at 4,550 m (533 km/h; published values run 316–345 mph, j-aircraft) | 142 at 5,900 m (512 km/h) | 105 at 3,600 m (378 km/h); about 100 with torpedo | 106 at 3,000 m (about 385 km/h) | 157 at 4,600 m (566 km/h) |
| cruise / approach | 75–83 | 92 | 72–80 | 72 | 75 | 90 |
| stall, 1 g clean (comp.) | 42 with bomb, 40 after | 36 | 45 | 36 with torpedo | 37 | 47 |
| CD0 (comp.) | 0.031 | 0.019 | 0.027 | 0.033 | 0.031 | 0.017 |
| sustained 360° at 1,500 m (comp.) | 25 s with bomb, 21 s after | **14 s** | 21 s | comp. 17 s; **use 22 s** (no control-force limit in the model) | comp. 16 s; **use 20 s** | 21.5 s |
| best instantaneous turn (comp.) | 34°/s at 98 m/s | 40°/s at 96 | 33°/s at 118 | 30°/s at 72 | 37°/s at 90 | 32°/s at 123 |
| roll rate vs IAS | not in NACA 868; use 50°/s at 70 m/s rising to 60°/s at 100 and holding (estimate) | **43°/s at 78 m/s, 55 at 110, 40 at 139, 32 at 170** (NACA, "force limits unknown") | **55 at 72, 75 at 107, 63 at 134, 57 at 152** (F4F-3, NACA) | 40°/s flat (estimate) | 50°/s flat (estimate) | **57 at 72, 85 at 98, 95 at 116–134, 90 at 152** (P-40F, NACA) |
| climb (pub., *verify*) | 8.5 m/s (comp. 8–10) | 15.7 (comp. 20: too high) | 11 (comp. 15) | 6.5–7 | 8 | 13 |
| G limit (arcade) | 6.5 | 7 | 7 | 4.5 | 6.5 | 7 |
| dive | split flaps hold a 70° dive near 120–125 (memory, *verify*); vShake 145, vBreak 156 (DATA example's 560 km/h) | vShake 165, vBreak 175 IAS (629 km/h, memory, *verify*); ailerons stiffen above about 103 IAS ("froze up above 200 knots", Sanders via a secondary article) | vShake 190, vBreak 215 (*verify*) | vShake 115, vBreak 125 (*verify*) | brakes hold 60–80° near 105–110 (*verify*) | vShake 200, vBreak 215 IAS (*verify*) |
| guns | 2 × 12.7 mm fixed, 360 rpg; 2 × 7.62 mm flexible | 2 × 20 mm, 60 rpg; 2 × 7.7 mm, 500 rpg (memory) | 6 × 12.7 mm, 240 rpg (Yorktown report via R4) | 1 × 7.7 mm flexible | 2 × 7.7 mm fixed, 1 flexible | 2 × 12.7 mm, 4 × 7.62 mm (memory) |

**Characters this produces, and should keep:** the Zero turns a full circle
seven seconds faster than a Wildcat or a P-40 but rolls at about half the
P-40's rate above 300 km/h; the Wildcat out-dives and out-rolls it fast;
the P-40 rolls best of all and turns worst; the SBD with its bomb is slow
and wide, and light and lively after release. A playability multiplier of
1.2 on roll rates is acceptable; flattening the curves is not.

**Mouse-aim (the default on keyboard and mouse).** The pointer, in pointer
lock, moves a target direction on a sphere around the aircraft; a
controller rolls to put that direction in the aircraft's plane of symmetry
and pulls `n` to bring the nose onto it, within the roll and `n` limits
above, never past 0.9 of the stall `CL` (War Thunder's instructor, by its
behaviour). Holding a key (Alt) frees the view without moving the target.
Direct WASD flying stays available.

### 4.3 Weapons from the air

**Dive bombing.**

- **The dive.** Push over at the record's height (VB-6: approach from 19,000
  ft, NWC; VB-3 from 14,500 ft; DATA's example 4,500 m), split flaps, 70°
  (the doctrinal figure, *verify*; Akagi's lookouts saw 50°). From 4,500 m to
  a 600 m release at 110–125 m/s the dive lasts **about 35–40 s**: the
  "forty seconds of dive" of DESIGN §1 is right.
- **The bomb.** From 600 m at 125 m/s and 70° the bomb falls for **4.4 s**
  and travels 190 m forward of the release point (computed, drag ignored);
  Kaga at 28 knots moves 63 m in that time, a quarter of her length. So the
  aim point must lead the bow on a crossing target and sit short on one
  steaming toward the diver.
- **The cue.** Every frame, integrate the bomb from the current state to the
  sea (a few dozen steps), and the target from its current velocity over the
  same fall time: a continuously computed impact point (CCIP). The release
  light comes on when that point lies inside the target's hull outline and
  the aircraft is above the safe pull-out height
  `h = V²/(g·(n − cos θ))·(1 − cos θ) + 100 m` (at 125 m/s, 70° and 5 g:
  224 m of height lost in the pull-out, so a 600 m release bottoms near
  375 m). Guided shows the CCIP marker all the way; Standard shows it below
  1,500 m; Record shows only the telescopic sight's rings and altitude
  calls (every 1,000 ft for US, every 500 m for IJN).
- **Release heights in the record** (R4): VB-3 averaged 2,500 ft (760 m);
  Akagi saw release at 500 m; Hiryū's D3As released at about 500 ft on
  Yorktown; Shōkaku's at about 800 ft at Santa Cruz. The cue accepts
  anything above the safe pull-out height and scores the height.

**Torpedo bombing.**

| | Mark 13 (US, 1942) | Type 91 Mod 2 / Mod 3 (IJN) |
| --- | --- | --- |
| speed and range (NavWeaps, *opened*) | 5,210 m at 30 knots (Mod 0) | 2,000 m at 41–43 knots |
| warhead | 178–183 kg (Mod 0) | 205 kg (Mod 2), 240 kg (Mod 3) |
| drop envelope (game) | ≤ 57 m/s (110 knots), ≤ 15 m (50 ft): NavWeaps' "low and slow"; wings level ±10°, pitch −5° to +3° | ≤ 90 m/s, ≤ 50 m (*verify*; Pearl Harbor's shallow-water drops were "from very low altitudes, and at very short distances", CINCPAC via R4) |
| arming run | 200 yd (183 m), running depth after 300 yd (R4 via NavWeaps) | 200 m (*verify*) |
| the record's drop range | VT-3 at about 150 ft under attack (R4) | about 800 yd from Yorktown (CINCPAC via R4) |
| time to target from 730 m | **42 s** | **34 s** |

A drop outside the envelope breaks the torpedo (a splash, then nothing),
and the HUD's drop light says which condition failed. Guided shows an
intercept marker (where to point so a straight run meets the target holding
course and speed: WoWs' cone); Standard shows the target's course and speed
only; Record shows neither. Ships comb tracks: an AI ship that sees a
torpedo turns toward or away within its evasion bound (§4.7), which is why
the anvil attack (two groups, both bows) exists, and why the run is fun.

**Gunnery from the air.** Tracer, convergence at the kit's value (250 m by
default; ENGINEERING §5), and a lead pip on the current target computed
from its velocity, own velocity and bullet time of flight (two iterations).
Bullets as projectiles for the player and for AI fighters engaging the
player (dozens alive, not thousands). Damage per round as a share of the
target's `fatal` (estimates, to calibrate in play): 20 mm HE 0.25 on an
F4F or SBD, 0.40 on an A6M; 12.7 mm 0.06 on an F4F, 0.12 on an A6M or B5N
or D3A; 7.7 mm 0.015 and 0.03. A hit on an unprotected fuel tank (A6M, B5N,
D3A) starts a fire with 15 % chance, on a self-sealed one (F4F, SBD, P-40)
3 %. No pilot hits: a "control lost" result stands for whatever the record
says happened.

### 4.4 The ship model

**Speed.** `m·dV/dt = Tmax·(u − (V/Vmax)²)` with `u` the telegraph (−0.6 to 1),
`Tmax = Peff/Vmax`, `Peff = 0.6 × shp`, `m` the full-load displacement plus 5 %
added mass. Then `V(t) = Vmax·tanh(t/τ)` from rest with `τ = m·Vmax²/Peff`,
and coasting with engines stopped halves the speed in `τ`. Values from
displacements and powers that R6 should confirm (*computed*; the tonnages are
*verify*):

| ship | full load, t | shp | top, kn | τ, s | 90 % from rest, s | coast to half, s | yaw T at top speed, s |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Yamato | 72,800 | 150,000 | 27 | 220 | 323 | 220 | 57 |
| Washington (North Carolina) | 44,800 | 121,000 | 28 | 180 | 265 | 180 | 46 |
| South Dakota | 44,500 | 130,000 | 27.5 | 161 | 236 | 161 | 44 |
| Kirishima (Kongō, rebuilt) | 36,600 | 136,000 | 30 | 150 | 221 | 150 | 43 |
| Nevada (1941) | 31,000 | 26,500 | 20.5 | 305 | 449 | 305 | 51 |
| Kaga | 42,500 | 127,400 | 28 | 162 | 239 | 162 | 52 |
| Akagi | 41,300 | 133,000 | 31 | 185 | 272 | 185 | 49 |
| Sōryū / Hiryū | about 20,000 | 152,000 | 34.5 | 96 | 142 | 96 | 39 |
| Yorktown | 25,500 | 120,000 | 32.5 | 139 | 205 | 139 | 45 |
| Kumano (Mogami, as heavy cruiser) | 15,000 | 152,000 | 34.5 | 73 | 107 | 73 | 34 |
| Takao class | 15,800 | 133,000 | 34 | 85 | 125 | 85 | 35 |
| Johnston (Fletcher) | 2,924 | 60,000 | 36.5 | 40 | 59 | 40 | 18 |
| Kagerō | 2,490 | 52,000 | 35 | 36 | 54 | 36 | 20 |
| Gambier Bay (Casablanca escort carrier) | 10,900 | 9,000 | 19 | 271 | 399 | 271 | 48 |

So the escort carriers at Samar and Nevada at Pearl Harbor really are
sluggish, a destroyer answers in under a minute, and a battleship in four to
five. Reverse: back full gives 60 % of forward thrust (estimate); World of
Warships uses a reverse top speed of `Vmax/4 + 4.9 knots` (*opened*), a fair
target for the steady state.

**Helm.** A rudder order moves the rudder at a fixed rate (`rudderS`, hard over
to hard over: 30 s for battleships and carriers, 20 s for cruisers, 15 s for
destroyers; *verify*, the modern requirement is 28 s for 35° to 30°), and the
yaw rate follows Nomoto's first-order model, `T·dr/dt + r = K·δ`: `K` is set so
full rudder at speed gives the steady turning radius `R = 0.45 × tactical
diameter`, and `T ≈ 3L/V` (the right-hand column above; a rule of thumb,
memory). In a steady hard turn speed falls 25–35 % for big ships and 30–40 %
for destroyers (*verify*), modelled as extra drag ∝ `r²`. The persistent
helm of World of Warships (an order stays until countered) is right for a
ship: the player sets "hard a-port" and lets go.

Tactical diameters were not found in anything opened. Defaults until R6
sources them (*verify*, all): Yamato 640 m at 26 knots (memory); North
Carolina and Kongō about 3.5 ship lengths; carriers about 3.5–4 lengths
(DATA's Kaga example has 900 m); heavy cruisers about 4 lengths; Fletcher
and Kagerō about 6 lengths; Casablanca about 4 lengths. With `T` from the
table, a Fletcher's 180° turn takes about a minute and a Yamato's about two
and a half, which is the felt difference that matters.

**Guns.** Turret and gun data (NavWeaps, *opened*):

| gun (ship) | shell | MV, m/s | max range | rate of fire | train | elevate |
| --- | --- | --- | --- | --- | --- | --- |
| 16"/45 Mark 6 (Washington, South Dakota) | AP Mark 8, 1,225 kg | 701 | 33,741 m at 45.4° | 2 rpm; Washington managed 1.54–1.56 rounds per gun per minute on 15 November | 4°/s | 12°/s |
| 46 cm/45 Type 94 (Yamato) | APC Type 91 / Type 1, 1,460 kg | 780 | 42,030 m at 45° | 1.5–2 rpm; a cycle of about 35 s at battle elevations, 30 s at the loading angle | **2°/s** | 8°/s |
| 36 cm/45 41st Year Type (Kongō, Kirishima) | APC Type 91 / Type 1, 673.5 kg | 770–775 | 35,450 m at 43° | 2 rpm | 3°/s | 5°/s |
| 20 cm/50 3rd Year No. 2 (CruDiv 7, Takao) | AP Type 91, 125.85 kg | 840 | 29,400 m at 45° | 3–4 rpm (2–3 at high elevation) | 4°/s | 6°/s (Models C, D) or 12°/s (E) |
| 8"/55 Mark 12–15 (US heavy cruisers) | AP Mark 19, 118 kg | 823 | 27,889 m at 41.9° | 3–4 rpm | 3–5.3°/s | 8–10°/s |
| 5"/38 Mark 12 (Johnston, the US screens) | AA common, 25 kg | 792 new, 762 average | 16,642 m at 43.3° | 12–15 rpm (pedestal), 15–22 (base ring with hoists) | 25–28.75°/s | — |
| 12.7 cm/50 3rd Year Type (Kagerō, Fubuki) | common, 23 kg | 915 | 18,380 m at 45° | 5–10 rpm (5 for the Type A twin) | **4–6°/s** | — |
| 15.5 cm/60 3rd Year Type (Yamato's secondaries) | AP Type 91, 55.87 kg | 920–925 | about 27,400 m | 5–6 rpm | 5–6°/s | — |
| 15.2 cm/50 41st Year Type (Kongō's casemates) | common, 45.36 kg | 850–855 | 21,000 m at 45° | effective 5–6 rpm | manual | manual |

**Shells.** Fly them: a point mass with drag `½ρv²·Cd(M)·A·i/m`, ISA density
and speed of sound by height, and this `Cd(M)` (a G7-like curve, my choice):
0.120 to Mach 0.7; 0.128 at 0.85; 0.170 at 0.95; 0.250 at 1.0; 0.300 at
1.05; 0.315 at 1.1; 0.310 at 1.2; 0.285 at 1.5; 0.250 at 2.0; 0.225 at 2.5;
0.205 at 3.0; 0.185 at 4.0. The form factor `i` per shell is fitted to the
published maximum range (`ballistics.py`): 16" AP 1.30, 46 cm APC 1.14, 36 cm
APC 1.26, US 8" AP 1.22, Japanese 20 cm AP 1.28, 5"/38 AAC 1.48, 12.7 cm/50
1.44, 15.5 cm AP 1.32. Checked against the published times of flight: US 16"
at 5,000 to 35,000 yd within +1 %; Yamato at 16,830, 27,920, 35,830 and
40,700 m within −1 %; US 8" within +2 % (one published value, 20.41 s at
16,000 yd, is inconsistent with its neighbours and with the HC table's 26.93 s,
probably a misprint); 5"/38 within +2 % at 2,000 to 16,000 yd. Precompute
each gun's firing table (range → elevation, time of flight, angle of fall)
at load for the aiming aids; fly each shell at 60 Hz for the hit test (a few
dozen operations per shell per step).

**Times of flight and gun elevation by range** (*computed*; published values
where they exist agree within 2 %):

| gun | 4,000 yd | 8,000 yd | 8,400 yd | 10,000 yd | 12,000 yd | 15,000 yd | 18,500 yd | 20,000 yd | 25,000 yd | 30,000 yd | 35,000 yd |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| US 16"/45 (Washington) | 5.4 s / 2.2° | 11.3 s / 4.7° | **11.9 s / 4.9°** | 14.5 s / 6.0° | 17.8 s / 7.4° | 23.0 s / 9.8° | 29.7 s / 12.8° | 32.7 s / 14.2° | 43.8 s / 19.6° | 57.0 s / 26.4° | 74.8 s / 36.3° |
| Japanese 46 cm (Yamato) | 4.9 s / 1.8° | 10.1 s / 3.7° | 10.6 s / 3.9° | 12.8 s / 4.8° | 15.7 s / 5.9° | 20.3 s / 7.7° | 25.9 s / 10.0° | 28.5 s / 11.0° | 37.6 s / 14.9° | 47.8 s / 19.3° | 59.2 s / 24.6° |
| Japanese 36 cm (Kirishima, Kongō) | 5.0 s / 1.8° | 10.5 s / 3.9° | 11.1 s / 4.2° | 13.5 s / 5.1° | 16.6 s / 6.4° | 21.8 s / 8.5° | 28.3 s / 11.3° | 31.4 s / 12.6° | 42.5 s / 17.7° | 55.5 s / 24.1° | 71.4 s / 32.4° |
| US 8"/55 (AP Mark 19) | 4.9 s / 1.7° | 10.7 s / 3.9° | 11.4 s / 4.2° | 14.1 s / 5.3° | 17.9 s / 6.8° | 24.4 s / 9.6° | 33.3 s / 13.8° | 37.6 s / 15.9° | 54.3 s / 24.9° | 78.8 s / 39.3° | — |
| Japanese 20 cm (CruDiv 7) | 4.8 s / 1.6° | 10.5 s / 3.7° | 11.1 s / 4.0° | 13.8 s / 5.0° | 17.4 s / 6.5° | 23.6 s / 9.1° | 32.2 s / 13.0° | 36.3 s / 15.0° | 52.2 s / 23.2° | 73.4 s / 35.1° | — |
| US 5"/38 (Johnston) | 5.7 s / 2.2° | 15.0 s / 6.5° | 16.1 s / 7.1° | 21.1 s / 9.9° | 28.0 s / 14.4° | 40.4 s / 23.3° | — | — | — | — | — |
| Japanese 12.7 cm/50 | 5.0 s / 1.6° | 12.9 s / 4.8° | 14.0 s / 5.3° | 18.6 s / 7.5° | 25.0 s / 11.1° | 36.3 s / 18.4° | 53.7 s / 31.0° | — | — | — | — |
| Japanese 15.5 cm (Yamato's secondaries) | 4.5 s / 1.4° | 10.1 s / 3.4° | 10.8 s / 3.6° | 13.6 s / 4.7° | 17.5 s / 6.2° | 24.6 s / 9.2° | 34.5 s / 13.8° | 39.2 s / 16.3° | 57.5 s / 26.5° | — | — |

What this means in the moments: Washington's opening at 8,400 yd puts a
salvo on Kirishima 12 s after the trigger (6 s felt at 2×); at the 18,500 yd
of NavWeaps' telling it is 30 s. Yamato at Samar fired from about 32 km
(memory, *verify*): about 60 s in the air, 30 s felt at 2×, and she fired at
Johnston at 20,300 yd (Wikipedia) with about 29 s of flight. Johnston's 5"
at 10,300 yd reaches Kumano in about 22 s.

**Dispersion.** Per shell, Gaussian about the salvo's mean point of impact,
`σ_range = pattern / 3.5`, `σ_deflection = mils / 3.5 × range`. From the
sources:

| gun | record | at 8,000 yd (7.3 km) | at 30,000 yd (27.4 km) |
| --- | --- | --- | --- |
| US 16"/45 | Massachusetts, November 1942: "about 2 mils in deflection and about 200 to 300 yards in range" (NavWeaps, *opened*; the ranges at Casablanca not given) | pattern about 80 yd in range (1 % of range, scaled), 16 yd across: σ 21 m by 4 m | pattern about 300 yd, 60 yd across: σ 80 m by 16 m |
| Japanese 46 cm | "spreads of 440 to 550 yards (400 to 500 m) at maximum range"; US reports at Samar "comment on the small patterns" (NavWeaps) | about 90 m: σ 25 m by 5 m (2 mils assumed) | about 300 m: σ 85 m by 16 m |
| Japanese 20 cm | Myōkō class, 1936: 280–330 m at 20–22 km, earlier 350 m; "very small" at Samar | about 110 m: σ 30 m by 6 m | about 420 m (beyond normal range): σ 120 m by 22 m |
| US 8"/55, US and Japanese 5", 36 cm | not found | use 1.2 % (8"), 1.5 % (5"), 1.1 % (36 cm) of range, 2–3 mils (*verify*) | — |

World of Warships, for contrast, uses horizontal dispersion of 10 m per km
plus 60 m for US battleships and 7.2 m per km plus 84 m for Japanese ones
(*opened*): about five times the historical deflection, which is how a game
on a half-size map keeps hit rates down. Pacific Theatre keeps the
historical patterns and puts the difficulty where it was: in the fire-control
solution (§4.5).

**Hit rates this produces** (`gunnery_mc.py`, *computed*): with the
historical patterns, a solution error per salvo of about 3–4 % of range in
range and 3–4 mils in deflection gives Washington about **20–26 %** hits at
8,400 yd on a broadside Kirishima, matching 9 to 20 hits from 75 rounds; at
30 km a solution error of 2–2.7 % gives Yamato about **3–5 %** on an escort
carrier. Those are the AI's settings at "record" skill; the player's own
error replaces them (§4.5).

**Torpedoes from ships** (NavWeaps, *opened*):

| torpedo | settings | warhead | time to run 9,400 m (Johnston on Kumano) |
| --- | --- | --- | --- |
| Mark 15 Mod 0 (US destroyers) | 5,500 m at 45 knots; 9,150 m at 33.5; 13,700 m at 26.5 (Mod 3: 4,100 / 8,200 / 12,800 m) | 224 kg (Mod 0), 363–373 kg (Mod 3) | at 26.5 knots: **690 s, 11.5 minutes** (Kumano saw them "at 27 knots", Wikipedia; fired about 07:16, hit 07:27) |
| Type 93 Model 1 (IJN destroyers, cruisers) | 20,000 m at 48–50 knots; 32,000 m at 40–42; 40,000 m at 36–38 | 490 kg | at 49 knots: 375 s |

Spread: 1–2° between torpedoes for a destroyer's salvo (memory, *verify*);
World of Warships offers a narrow and a wide spread (*opened*), which is the
right choice to give the player. The Mark 15's failures are a kit number
(DATA §8); Fighting Steel offered its "80 % dud rate" as an option. For v1,
make it the record's number for the battle's date and do not offer a switch.

### 4.5 Aiming aids

The difficulty is in the solution, as it was. Three levels, chosen on the
briefing card (Standard by default; Guided offered first on touch):

| aid | Guided | Standard | Record |
| --- | --- | --- | --- |
| **ship gunnery** | click a target; the director tracks it and the solution converges over 20 s (error falling from 3 % to 0.5 % of range); the reticle shows where the salvo will fall; splashes auto-spotted and corrected (War Thunder's gunners do this, *opened*) | the player lays the reticle on the target; the rangefinder (radar by night for US ships) gives range with an error (radar 0.3 %, optical 1 % beyond 15 km, 0.5 % inside 10 km); a lead mark from the director's estimate of course and speed (with its own lag); the player spots splashes and corrects | rangefinder range only, no lead mark; spotting by eye in the sight and the fall-of-shot view |
| range ladder | — | mouse wheel steps the range ±100 m, Shift+wheel ±400 m: the "up 400, down 400" ladder of the doctrine | the same |
| fall of shot | a small inset follows the salvo and shows the fall at the target, tagged over, short, straddle or hit | inset with tags | inset without tags |
| time of flight | countdown on the reticle | countdown | countdown |
| splashes | dye colours by day (below) | dye | dye |
| **torpedoes (ship)** | the intercept cone (WoWs) | target course and speed estimate | none |
| **dive bombing** | CCIP marker throughout; release light | CCIP below 1,500 m; release light | sight rings and altitude calls only |
| **torpedo bombing** | intercept marker; envelope light | envelope light | envelope gauges only |
| **air gunnery** | lead pip on target | lead pip within 400 m | none (the period sight) |
| **flight** | stall protection, ground avoidance, auto-level, black-out off | stall and black-out softened | full |
| AI lethality against the player | AA and CAP kill rates × 0.5 | × 1 (calibrated to the record) | × 1 |

**Dye.** By day, colour the splashes by the firing ship's dye, which the
record gives: Kirishima blue at this battle (Lundgren), Kongō red, Haruna
black (NavWeaps) or yellow (Lundgren), Hiei none; Yamato yellow, Musashi
green; Washington orange, South Dakota blue, North Carolina and
Massachusetts green, Indiana red, Alabama none (the US list is "as assigned
in 1945", so its use in 1942 is *verify*). At Samar the coloured splashes
are a famous detail and the best reading aid there is: the player sees whose
salvo is walking onto whom. At night dye is invisible; splashes are white
in the glare of star shell and searchlight.

**The rhythm.** Each turret shows a ready ring that fills over its loading
cycle (16-inch: about 38 s per gun at Washington's rate; 46 cm: about 35 s;
20 cm: 15–20 s; 5"/38: 3–4 s). "Salvo" fires every ready gun at once;
holding the key fires each turret as it comes ready ("fire when ready"),
the practice at short range. The time-of-flight countdown and the
fall-of-shot inset close the loop: lay, fire, wait, see the fall, correct,
fire. At 2× the wait at 8,400 yd is 6 s; at 30 km it is 24–30 s.

### 4.6 The AA model

**Form.** A Poisson hazard on each aircraft the AI is shooting at (the
player's, and any aircraft whose fate the sim decides because the record's
cause was removed):

`λ(t) = Σ over bearing mounts of λbarrel × barrels × f(range) × era × alert(t) × aspect ÷ share`

and the chance of being brought down over an attack is `1 − exp(−∫λ dt)`.
A "hit" event rather than a kill gives better feedback: draw hit events at
`λ/pKill` and let each do damage from the weapon (20 mm 0.25–0.4, 40 mm 0.6,
5-inch burst 0.5–1.0 of an aircraft's `fatal`), so the player sees smoke, a
dead engine, a holed wing, before the end. AA rounds are effects only
(tracer every few rounds, bursts at fuze range), never projectiles.

**Per-barrel rates** from COMINCH P-009's "rounds per bird" (October 1944 to
January 1945; *opened*) divided into a practical rate of fire (memory,
*verify*):

| weapon | rounds per bird (suicide / non-suicide actions) | practical rounds/s per barrel | λ per barrel, per s | effective range used |
| --- | --- | --- | --- | --- |
| 5-inch, time fuze ("common") | 1,162 / 960 | 0.25 | 2.6 × 10⁻⁴ | 7,300 m |
| 5-inch, VT fuze (not before 1943) | 310 / 624 | 0.25 | 5.3 × 10⁻⁴ | 7,300 m |
| 3"/50 | 710 / 752 | — | — | — |
| 40 mm (not on Yorktown in 1942) | 2,272 / 3,361 | 2.0 | 7.1 × 10⁻⁴ | 3,200 m |
| 1.1-inch | 2,231 / 7,152 | 1.5 | 3.2 × 10⁻⁴ | 2,700 m |
| 20 mm | 8,972 / 15,139 | 5.0 | 4.2 × 10⁻⁴ | 1,800 m |
| .50 cal | 28,069 / — | 8.0 | 2.9 × 10⁻⁴ | 1,100 m |
| 5"/25 (1941 battleships, cruisers) | not given | 0.25 | 2.3 × 10⁻⁴ (estimate) | 6,400 m |
| Japanese 25 mm Type 96 | not given | 2.3 | 1.5 × 10⁻⁴ (estimate: worse than the Oerlikon) | 2,000 m |
| Japanese 12.7 cm/40 Type 89 HA | not given | 0.2 | 1.3 × 10⁻⁴ (estimate) | 6,400 m |

`f(range)` is 1 inside 30 % of the effective range, falling linearly to 0 at
it. `aspect`: 0.8 for a diving or head-on target, 1.0 crossing, 1.1 for a
low, straight torpedo run. `share`: how many attackers the screen is
splitting its fire between at that moment (2 for a stream of divers spaced
10–20 s apart, 3–4 for a coordinated torpedo attack from both bows). `era`:
the factor that turns 1944–45 US numbers into 1941–42 and Japanese ones,
**fitted**, below. `alert`: 0 to 1, ramping from the first sighting.

**Calibration against the record** (`aa_calib.py`, *computed*):

| event | fit and assumptions | result | the record |
| --- | --- | --- | --- |
| a D3A diving on Yorktown, 12:05 (TF 17: Yorktown's starboard battery, two cruisers, five destroyers bearing) | era 0.85 (USN 1942), share 2, aspect 0.8, full alert | **27 %** per diver | seven dived, about two were shot down by AA (Yorktown report via R4: "the first ... cut into at least 3 large pieces"); 13 of 18 lost in all, most to the CAP |
| an SBD diving on Kaga, 10:22 (Kaga's bearing battery, one destroyer close) | era 0.6 (IJN 1942), alert ramping over 60 s from the first dive, share 1.5 | **1.7 %** (first diver), **2.5 %** (fourth), **2.6 %** (ninth) | "little anti-aircraft fire" (NWC via R4); VB-3: "The first plane to dive received no anti-aircraft fire"; VS-6/VB-6's losses that morning were mostly fuel and fighters |
| a B5N's torpedo run on Yorktown, 14:43 (screen reinforced to four cruisers and seven destroyers) | era 0.85, share 4, aspect 1.1 | **31 %** from AA alone | five of ten lost to CAP and AA together (Nagumo Table 8 via R4) |
| a first-wave torpedo run at Pearl Harbor, about 07:57 (a dozen ships' .50s, 5"/25s and a few 1.1-inch in reach) | era 0.5 (peacetime crews), alert 0.45 | **10 %** | the first wave lost 9 of 183, the second 20 of 167 (USSBS via R4); torpedo planes and dive bombers low over the harbour took most; losses by type *verify* |
| the same at 08:05, and in the second wave | alert 0.8; alert 1.0 | **18 %**; **22 %** | second-wave dive bombers took heavy losses (*verify* by type) |

The fitted era factors are the model's least sourced numbers (§9, risk 4);
the calibrations are the test that keeps them honest. Put these five cases
in `smoke-battle.mjs` as bands (e.g. "of 1,000 seeded D3A dives on TF 17,
between 20 % and 35 % are lost to AA").

**The player directing AA** (`player.input.aa`): Space on a ship points
every mount that bears at the pointer's aircraft for 5 s; for that aircraft
`share` is 1 and the others get the remainder. It is the honest form of the
"burst of attention" ENGINEERING asks for, and it makes a ship's AA a
playable role at Pearl Harbor (§5).

**Japanese CAP direction without radar.** Ships "fired AA bursts and laid
smoke to point fighters at raids" (Yorktown's VF report via R4). Draw it:
an AI Japanese ship that sights a raid fires two bursts in its direction,
and the CAP turns toward them. The player as a Zero sees the same bursts.

### 4.7 CAP and AI behaviours the authority rule needs

**The group rule, restated so the record survives it.** Every scripted
count (hits by a group, kills by a CAP, torpedoes dropped) belongs to a
cause group. At the beat:

`count = recordCount × min(1, S / Srec) + baseRate × max(0, S − Srec)`

where `S` is the cause group's survivors now, `Srec` the record's survivors at
that beat (`attack.reached` in DATA §9, a new field), `recordCount` the
record's count drawn from its range by the seed, and `baseRate` a per-attacker
rate for attackers the record never had (dive: 0.3 hits each against a
carrier, 0.15 against a destroyer; torpedo: 0.15; level bombing: 0.02;
estimates from the record's own ratios: Hiryū's D3As 3 of 7, VB-3 3 of 13 on
Sōryū, Kaga's attackers 4 of 9). Below `0.25 × Srec` the beat does not fire.
Examples:

- **The player flies an F4F on CAP at 11:59.** The record's CAP takes 11 of
  18 D3As (`Srec` at the dive = 7). The scripted kills continue at the
  record's rate, scaled by the CAP group's own survivors; each D3A the
  player shoots down is subtracted from the attackers. If the player downs
  three before the dive, `S = 4` and the hits on Yorktown become `3 × 4/7 ≈
  1.7`, drawn as 1 or 2 by the seed. Yorktown may not stop at 12:20.
- **The player flies Thach's escort over VT-3 at 10:05.** Each Zero the
  player downs scales the CAP's scripted kills on VT-3 down; if more than
  five TBDs reach the drop, the extra ones use the base rate, so a torpedo
  hit on Hiryū becomes possible though the record has none. The after-card
  says so.
- **The player is one of Bombing Six.** As the drafts say: the player's bomb
  is real; the squadron's other hits are `recordCount × S/Srec` with `S`
  counting the squadron's survivors other than the player and `recordCount`
  reduced by one if the record's count included the player's slot (pick the
  record count minus one, so a miss by the player leaves 3–4 hits on Kaga,
  still enough to doom her; a hit makes 4–5).

**AI fighters (CAP and escorts engaging the player).** Same flight model as
the player. Skill parameters (estimates for "record" skill): reaction time
0.6 s (veteran) to 1.0 s (green); lead error σ 2 mils (veteran) to 4 mils;
uses up to 5 g (6 g veteran Japanese pilots of 1942); fires 1–2 s bursts when
inside 300 m (ENGINEERING) and the lead is within 1°; breaks off when hit or
out of ammunition. Tactics from the record: Zeros "concentrated most of
their attacks on the rear plane, making beam and astern runs and pulling
clear after each run" (Yorktown report via R4); US CAP intercepts 15–20
miles out at 8,000–10,000 ft at noon and 10,000–12,000 ft at 14:30 (R4). The
F4F's answer (scissors with a wingman, the "beam defence") can be the
wingman AI's behaviour when the player is in an F4F at Midway: when a Zero
gets on the player's tail, the wingman turns into it.

**Scripted kills look real.** When the record removes an aircraft that the
player is not involved with, a nearby enemy fighter (or the AA) is assigned
to it, flies a short pursuit, fires tracer, and the victim falls as a trail
on the record's minute. No dice, no physics: choreography, so watching
replays the record exactly.

**AI ships under the player's fire.** Within ±30° of the record's course and
±5 knots of its speed: when straddled, turn toward the last fall of shot
("chasing salvos", memory) with probability 0.5, else away; return to the
track within three minutes of the last salvo; return fire with the battery
that bears, at the player, using the AI gunnery settings of §4.4 (solution
error 2.5 % of range and 3 mils at first, improving 30 % per corrected salvo
to a floor of 1 % and 1.5 mils; a turn of more than 20° or a speed change of
more than 5 knots by the target resets half of the improvement, because the
director's estimate of course and speed lags by 30–60 s, memory). That last
rule is what makes the player's evasion as Kirishima, Johnston or an escort
carrier mean something.

**AI strikes on the player's ship.** The record's strike flies its route and
attack profile at the record's time with the real attack model: dive bombers
pick release points from the profile (`pushOverM`, `releaseM`), torpedo
planes split for an anvil when the record says so ("splitting into two
divisions of six for an anvil", R4), and they aim with the AI's errors (dive:
CCIP error σ 25 m at release for veterans, 40 m for green; torpedo: lead
error 3°). The player's helm and AA decide the rest.

**A saved carrier.** If the player's battle leaves a carrier not doomed
that the record lost, the sim runs her: she recovers what is aloft on the
record's cycle (30–45 minutes to recover a deckload, and 30–45 minutes to
spot and launch one, *verify* with R4's sources), and launches what the
record says was ready (Nagumo's readiness signal: CarDiv 1's strike ready at
10:30, CarDiv 2's at 10:30–11:00; R4), at the last contact the record gives
her side (Tone 4's report). Its attack is resolved like any strike. The
after-card labels everything that follows "the sim's guess; the record has
no such strike".

### 4.8 The damage model, and the thresholds that make the record's hits sink what the record sank

**State per ship** (replacing the single 0..1 `damage`):

| state | range | what it does |
| --- | --- | --- |
| `fight` | 0 → 1 and beyond | at `crippledAt` (kit; default 0.5) speed is capped at half and half the turrets or the flight deck are out; at 1 the ship is out of action (dead in the water, guns silent, no flight operations) |
| `float` | 0 → 1 | at 1 the ship sinks: founders over 3–10 minutes, or capsizes if the list passes 35° (not Fighting Steel's 40 seconds) |
| `list` | degrees | from asymmetric flooding; damage control counter-floods at 1°/min (USN) or 0.5°/min (IJN 1942), estimates; at 20° the crew may abandon (Yorktown at 26°) |
| `fires` | four zones (bow, forward, aft, stern, as World of Warships has four), each burning or not | each burning zone adds `fight` at 0.0005/s × (1 + 6H); spreads to a neighbour at H/120 per second on a carrier (1/900 on other ships); damage control puts one out at 1/600 per second (USN 1942), 1/900 (IJN 1942), 1/400 (USN 1944) |
| `H`, the hangar hazard (carriers) | 0..1 | fuelled and armed aircraft below or on deck and avgas lines charged; set from the record at the battle's clock: the Kidō Butai at 10:20, 0.8 (CarDiv 1's strike ready at 10:30, R4); Hiryū at 17:03, 0.6 (a dusk strike planned); Yorktown at 12:05, 0.15 ("refuelling stopped, gasoline lines drained and filled with CO₂", R4); Yorktown at 14:40, 0.3 |
| systems | per kit | rudder (jams at a random angle), engines or boilers (a speed cap, or zero for a repair time), each turret, director, radar, flight deck, AA groups, searchlights, bow (lost: speed capped at 12 knots) |
| `doomed` | flag | set when three or more fire zones burn on a carrier with H ≥ 0.4, or when flooding outruns damage control; the ship then sinks at the record's time if the record has a `sinks` or `scuttled` for it, otherwise after a sim time (carriers burning: 4–9 hours, the record's range; battleships: from the flood rate) |

The kit's `fatal` stays as the `float` threshold (1.0); add `crippledAt`.
Untouched units take the record's outcome by construction (the replay test in
ENGINEERING §13's integration step passes because their doomed flags and sinkings come from
`fate`); the stochastic model runs only where the player is the cause or the
target, and its *expected* result is what the calibration below checks.

**Per hit** (fight / float), penetrating hits, starting values to tune in the
calibration tests (estimates built from the record below, not sourced):

| weapon | battleship | fleet carrier | heavy cruiser | destroyer | escort carrier |
| --- | --- | --- | --- | --- | --- |
| 14"–18.1" AP, hull above the waterline | 0.07 / 0.02 | 0.10 / 0.03 | 0.15 / 0.05 | over-penetrates: 0.06 / 0.03, 40 % a system | over-penetrates: 0.05 / 0.03 |
| the same, at or below the waterline | 0.07 / 0.06 + a hole | 0.10 / 0.08 + hole | 0.15 / 0.10 + hole | 0.08 / 0.08 + hole | 0.06 / 0.08 + hole |
| any heavy shell in the superstructure | 0.03 / 0, 60 % a system (director, radar, bridge) | same | same | same | same |
| 8" AP or HE | 0.015 / 0 (mostly superstructure) | 0.05 / 0.02 | 0.06 / 0.03 | 0.10 / 0.05 (AP over-penetrating 0.05 / 0.03) | 0.06 HE, 0.04 AP / 0.02 |
| 5"–6" | 0.003 (5") – 0.008 (6") / 0 | 0.01–0.02 / 0 | 0.012–0.03 / 0.005 | 0.035–0.07 / 0.02 at the waterline | 0.02–0.04 / 0.01 |
| 1,000-lb bomb (454 kg) | 0.02 / 0, fire 30 % | 0.06 / 0, fire 90 % | 0.15 / 0.03, fire 60 % | 0.40 / 0.30 | 0.15 / 0.05, fire 70 % |
| 500-lb or 250-kg bomb | 0.01 / 0 | 0.03 / 0, fire 80 % | 0.08 / 0.02, fire 50 % | 0.25 / 0.15 | 0.08 / 0.03, fire 60 % |
| aerial torpedo (Mark 13, Type 91) | 0.03 / 0.08, list 3° | 0.06 / 0.18, list 10° | 0.08 / 0.22, list 8° | 0.40 / 0.60 | 0.15 / 0.30, list 8° |
| Type 93 | 0.05 / 0.12 | 0.10 / 0.35 | 0.12 / 0.35 | 0.50 / 0.90 | 0.20 / 0.50 |
| Mark 15 (Mod 3) | 0.04 / 0.10 | 0.08 / 0.25 | 0.10 / 0.25; forward: bow lost | 0.45 / 0.80 | 0.18 / 0.40 |

A hole raises `float` by 2 × 10⁻⁵ per second until damage control patches it
(USN at 1/1,200 per second per hole, IJN 1942 at 1/2,400), estimates. A
magazine detonation is scripted where the record has one (Arizona) and, for
the player's hits, a 1 % chance per heavy AP shell that penetrates into a
magazine zone inside 10 km (estimate): a flash, the ship breaks, `float` = 1.

**Calibration against the record** (what the tests must reproduce):

| case | the record | the model with the values above |
| --- | --- | --- |
| **Kaga**, 10:22–10:24 | four hits in Nagumo's report, "a minimum of one 1,000-lb and three 500-lb" in the TROM (R4); fire from 10:25; sank 19:25 | fight 0.06 + 3 × 0.03 = 0.15 direct; three or four fires with H = 0.8: doomed at once; the fires take `fight` to 1 in about 75 s; sinks at the record's 19:25 |
| **Akagi**, 10:26 | one hit (Parshall and Tully) or two (Nagumo); a near miss jammed the rudder about 20° | one fire with H = 0.8: spreads before it is put out with chance 0.86 per step, so about 0.73 to reach three zones: doomed about three times in four; the near miss is a rudder system hit |
| **Sōryū**, 10:25–10:28 | three 1,000-lb hits; engines stopped 10:40; abandoned 10:45; sank 19:13 | three fires, H 0.8: doomed; out of action within two minutes |
| **Hiryū**, 17:03 | four hits | doomed (H 0.6) |
| **Yorktown**, 12:05 | three hits (250 kg); stopped about 12:20–12:40 by the uptake hit; under way again 13:40, 19–20 knots by 14:00 | fight 0.09 + fires that cannot run away (H 0.15 < 0.4); a boiler-uptake system hit stops her for a repair time of 60–80 minutes; not doomed |
| **Yorktown**, 14:43 | two Type 91 torpedoes on the port side; list 17°, then 23°, then about 26°; abandoned from 15:14; afloat until I-168's torpedoes on 6 June | float 0.36, list about 20° growing with the holes; power lost (system); abandoned at list ≥ 20°; not sunk |
| **Kirishima**, 15 November | nine 16" and forty 5" hits (Horishi, consistent with Lee's eight) or 20 heavy and 17 secondary (Ikeda's sketch, which Lundgren prefers); rudder jammed; turned 500° to port; capsized about 03:25 (Wikipedia) | nine heavy (three below the waterline) and forty 5": fight 0.75, float 0.30 and three holes: crippled at once, capsizes about three hours later; twenty heavy: out of action at once, float 0.68 and seven holes: capsizes within one to three hours depending on patching. Both tellings capsize her that night |
| **South Dakota**, same night | 26 hits: one 14", eighteen 8", six 6", one 5", mostly superstructure (BuShips via Lundgren) | fight about 0.35 plus radar, fire control and radio systems out: blind but afloat and steaming |
| **Johnston**, 07:30 | three heavy AP (three 14-inch from Kongō in the older telling; three 18.1-inch from Yamato in the current Wikipedia text, which calls the Kongō version a "myth") and three 6-inch or 6.1-inch; speed to 17 knots, power to the 5-inch lost and restored to two mounts within ten minutes; fought on; dead in the water near 09:40; sank 10:10 | over-penetrating heavy AP 3 × 0.06 plus 3 × 0.07 = fight 0.39, float 0.09; systems: engine room (speed cap 17 knots), 5-inch power (repair 10 minutes), gyro. Afloat and fighting; the later 5"–8" hits (twenty-odd) bring `fight` past 1 and the waterline holes sink her within half an hour |
| **Kumano**, 07:27 | one Mark 15 forward: "blew off her entire bow"; 12 knots | Mark 15 forward: bow lost (speed cap 12 knots), fight 0.10: out of the fight, afloat |
| **Gambier Bay** | hit repeatedly by 8-inch from about 08:10; sank about 09:07–09:11 | over-penetrating 8" AP 0.04 each and a few HE: 20–25 hits to the end, which is the order the record describes (*verify* the count) |

That Johnston survived three battleship shells and Kaga did not survive four
bombs is the point of the model: armour-piercing shells pass through thin
ships, and carriers die of their own fuel and ordnance. The after-card can
say both in a sentence.

**How a sinking is shown.** The drafts' rule stands (a silhouette going
down, no figures). Give it time: a doomed carrier burns (smoke column, fires
by zone, list) for hours of battle time, which watch mode compresses; a
foundering ship settles over minutes; only a magazine detonation is quick.
The record's sinking times are the default, the sim's only where the record
has none.

### 4.9 Night: making the Guadalcanal fight readable and fun

The night of 14–15 November is mostly darkness, sudden light and waiting.
What the record gives the scene (Lundgren and NavWeaps, *opened*): Atago's
searchlights at 01:00 (his clock) lit South Dakota; Washington's director 4
gave star shell from mount 9 after her second main-battery salvo, 62 star
shells in all; she fired about 39 rounds in 2 min 39 s, checked fire for
1 min 30 s on a false report that the target had sunk, then fired 36 more in
2 min 45 s, plus 107 5-inch AA common at Kirishima; her fire-control radar
saw no splashes at all; Kirishima turned 500° to port. Japanese
illumination rounds: the 20 cm Shōmeidan B, 1.6 million candelas, effective
to 16,000 m; the 12.7 cm illumination round, 680,000 candlepower, to
15,540 m (NavWeaps).

| tool | how | why |
| --- | --- | --- |
| **the plot** | for US ships an SG-radar PPI inset (contacts as blips with bearing and range, the island of Savo a smear); for Japanese ships a lookout plot that shows only what has been seen, with bearing lines from gun flashes | the night battle was fought from plots; Fighting Steel's reviewer asked for exactly this |
| **light as information** | star shells as real point lights (up to six at once; the rest as sprites), hanging and drifting for their burn time (30–60 s, *verify*); searchlights as additive cones; burning ships as flickering lights | a ship is seen when lit; the player learns to fear the searchlight and to use the star shell |
| **gun flashes** | a large additive flash and a pulse of light on the water, visible at 25 km or more; distant flashes give a bearing on the plot | the Japanese located the Americans by flashes; it is also the best image of the night |
| **detection** | big ships seen optically at 6–10 km unlit (the Japanese lookouts' 20 cm binoculars, memory), 15 km and more when lit; radar at 18,000–20,000 yd for the SG (memory, *verify*) | asymmetry: radar against eyes is the battle's subject |
| **splashes** | white, visible only when lit or close; none on the radar (as Washington found) | spotting at night is hard; the fall-of-shot inset still helps |
| **tracer** | AA and secondary tracer drawn; colours from the record if R5 or R6 finds them, else one neutral colour for both sides with the HUD marking sides (do not invent national colours) | readability without inventing a fact |
| **exposure** | tone mapping that lets a flash bloom briefly without blinding the frame for seconds | flash-blindness is real but unreadable |
| **time** | 2× default, auto-dropping to the default when a salvo is in its last 5 s or a torpedo is within 3 km | the waits between salvos are short at 8,400 yd (12 s); the long wait is the 1 min 30 s check fire, which is a beat, not a dead spot |

The fun is in the asymmetry: as Washington, find Kirishima on the plot while
she is busy with South Dakota and get three salvos away before she turns;
as Kirishima, see South Dakota lit by Atago's searchlights, hammer her, and
not know Washington is there until the first 16-inch salvo lands.

### 4.10 The camera

| mode | for | settings |
| --- | --- | --- |
| chase | aircraft (default) | 18 m behind and 4 m above for fighters, 25 m and 5 m for bombers; 0.15 s lag; 65° field of view |
| sight | dive bombing, gunnery from the air | the SBD's telescope (about 25° field; *verify* its magnification) or the reflector sight; Record difficulty lives here |
| target view | air combat | hold a key: the camera looks from behind the pilot at the target (a padlock) |
| bridge | ship helm moments (default) | eye height from the kit; 60° field; free look with the mouse |
| director | ship gunnery (default) | the main director's height; zoom 4×, 8×, 16× (fields of 15°, 7.5°, 3.75°) |
| high chase | ships, for awareness | 300 m behind, 100 m up |
| fall of shot | inset, both | a picture-in-picture a third of the width that rides the salvo and holds on the target for 3 s after the fall |
| orbit, free | watch | the Hawaiian rig in metres |
| director (cinematic) | watch | Fighting Steel's model: glides (flies, does not cut) to events by priority (a hit, a launch, a sinking, a strike arriving), shots of at least 4 s, with an interruption setting; never takes the main view during a moment |

### 4.11 The HUD

- **Aircraft.** Airspeed and altitude in the unit's own system (knots and
  feet for US aircraft, km/h and metres for Japanese; a toggle), heading
  tape, throttle, G meter with a black-out vignette, stall warning, ammunition
  by gun group, bombs or torpedo, the target box with range and lead pip,
  the CCIP marker and release light in a dive, the torpedo envelope light
  with the failing condition named, an arrow to the objective and one to home
  (the carrier or Point Option), damage (engine, fuel, controls) as small
  icons, fuel as time remaining (DATA's `enduranceS`).
- **Ships.** Helm (ordered and actual rudder), telegraph (ordered and actual
  speed), a turret ring (bearing, elevation, a ready ring per turret), target
  data (range, bearing, time of flight, estimated course and speed and
  aspect), the time-of-flight countdown, spotting tags on the last salvo, the
  plot inset (radar or lookout), torpedo tubes and spread, a damage strip
  (fight, float, list, fires by zone, systems out), the AA director's current
  target.
- **Both.** The record's beats as one-line subtitles (`sim.beats`), the
  battle clock in its zone, the checkpoint countdown, and the bindings for
  the first three seconds (ENGINEERING §8).

### 4.12 Controls

**Keyboard and mouse.**

| action | aircraft | ship |
| --- | --- | --- |
| steer | **mouse-aim** (pointer lock; the nose follows), or W/S pitch and A/D roll; Q/E yaw | A/D rudder: tap to step (hard a-port, half, amidships, half, hard a-starboard), stays until countered (WoWs) |
| speed | R/F throttle (not Shift/Ctrl: Ctrl+W closes the tab) | W/S telegraph in steps (back full, stop, one third, two thirds, standard, full, flank) |
| fire | left mouse or Space guns | left mouse salvo; hold for "fire when ready" |
| ordnance | B bomb, T torpedo | T torpedoes; G toggles narrow and wide spread |
| aim | the pointer | the pointer lays the reticle; wheel ±100 m range, Shift+wheel ±400 m |
| AA | — | Space: every bearing mount at the pointer's aircraft for 5 s |
| view | C camera, V sight, hold Alt free look, hold X target view | C camera, Z zoom steps |
| time | — (1× in combat) | + / − time compression within the moment's bounds |
| release | Backspace, with a confirm; losing pointer lock pauses and offers release | the same |

**Touch** (Pointer Events, at least 48 px targets, two thumbs):

| | aircraft | ship |
| --- | --- | --- |
| left thumb | a virtual stick, **bank-to-turn**: sideways sets bank up to 60° and turns, up and down set the pull; let go and the aircraft levels (Ace Combat's Normal stick) | the helm: a horizontal slider with five detents |
| right thumb | fire (hold), a context button (bomb in a dive, torpedo in the envelope), throttle as a short vertical slider at the edge | salvo button (never tap-anywhere: a stray tap is a wasted salvo); drag on the sea lays the aim; pinch zooms the director |
| extras | camera button; sight toggle | telegraph as a vertical slider with seven detents; AA button (directs at the nearest attacker) |
| defaults | Guided aids, quality tier Low | the same |

The input layer already reduces everything to intents (`player.input`), so
touch costs little: recommend it in v1 for both kinds of moment (D8).

### 4.13 Session length, checkpoints, difficulty, scoring and the after-card

- **Length.** Every v1 moment reaches its checkpoint in 3–6 minutes of real
  time (§5). Keep going is open-ended to the clock's end.
- **Checkpoints.** The moment's start and its checkpoint are both restart
  points, offered on the pause card and on the end card ("retry from the
  push-over", "retry from the checkpoint"). Battlestations: Pacific's lack of
  an in-game restart from its checkpoints is the lesson.
- **Difficulty.** Guided, Standard, Record (§4.5), as named switches
  underneath (IL-2's model), with Standard calibrated to the record.
- **Scoring in sortie terms**, no points total, no medals, ranks or letter
  grades (Secret Weapons' promotions and Ace Combat's ranks do not belong in
  a memorial): the objective met or not; hits and where (Kaga: "one 1,000-lb
  hit, aft of the island"); release height against the record's (760 m,
  500 m); torpedoes dropped in the envelope and on target; aircraft downed;
  salvos fired, straddles, hits; came back, ditched, landed, afloat, lost;
  time to the objective. A personal best per moment kept in `localStorage`
  (a per-viewer convenience, wrapped in try/catch).
- **The after-card's comparison**, two columns, divergences only:

  | | the record | your battle |
  | --- | --- | --- |
  | your unit's role | Bombing Six: 4 of 9 hits on Kaga (Nagumo) | 5 hits; one yours |
  | Kaga | burning from 10:25, sank 19:25 | burning from 10:24, doomed; sinks 19:25 as in the record |
  | Hiryū's strike | 18 D3A, 7 through, 3 hits | — (no change) |

  then "everything else followed the record", the record's text and sources,
  and, where the sim invented something, the line "the sim's guess; the
  record has no such event". The score speaks of aircraft and hits; people
  are counted only on the record's side of the card, in ranges, with sources
  (DESIGN §7.4).

### 4.14 What the WebGL budget allows

**Live counts.** Midway's morning is about 20 ships in the Kidō Butai and 25
in TF 16 and 17, with 120–130 aircraft aloft near 10:20 (VB-6/VS-6 about
32, VB-3 17, VT-3 12, VF-3 6, about 30–40 Zeros, the US CAP) and deck parks
on the carriers; Pearl Harbor's first wave is 183 aircraft over about 96
ships plus small craft and some 390 aircraft on the ground (*verify* both
counts with R4/R5). Recommended capacities: **128 ships and 512 aircraft as
sim units**; parked aircraft are static scene decoration, not units.

**Draw calls** (desktop under 120, phone under 80):

| family | technique | draws |
| --- | --- | --- |
| hulls | one mesh each at Midway (ENGINEERING); instanced per kit or `BatchedMesh` at Pearl Harbor | 20–45 |
| turrets | instanced per calibre | 5–8 |
| aircraft | instanced per kit × 3 LODs (600 triangles under 300 m, 120 to 3 km, a 3-px sprite beyond; ENGINEERING's minimum span) | 12–24 |
| parked aircraft | instanced per kit, LOD1 only | 4–8 |
| shells, tracer, bombs, torpedoes | one instanced quad set (4,096), one small mesh set (256) | 2 |
| splashes, smoke, fire, flak, flashes | instanced billboards by family | 6–10 |
| wakes | one dynamic ribbon buffer for all ships | 1 |
| terrain, sea, sky, clouds | as the Hawaiian app | 5–8 |

**Particles.** Desktop: 1,500 smoke puffs, 300 fire sprites, 500 splashes,
256 flak bursts. Phone: 400, 100, 200, 64. Overdraw, not count, is the phone's
limit: cap each billboard's screen size and use few large soft sprites for
the burning carriers' smoke columns.

**Sim cost.** 4,096 shells with drag at 60 Hz is about a million operations a
second, under a millisecond a frame; 512 aircraft on the rates model is
trivial; hit tests against 128 oriented boxes through a 500 m grid. AA as a
hazard costs nothing per round. None of this needs a worker in v1.

**What to cut on a phone, in order:** shadows; post-processing; device pixel
ratio to 1; particle caps to the phone column; aircraft LOD distances
halved; ships beyond 15 km as silhouette sprites; cloud puffs halved; the
sea's swell to a flat shaded plane; render aggregation of distant groups
(one instance per group, formation offsets in the vertex shader) while the
sim keeps every unit. Under SwiftShader (the smoke test) expect a few frames
a second; it must not throw (ENGINEERING §0).

---
