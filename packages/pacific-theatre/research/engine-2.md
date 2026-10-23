# Engine, round two: any unit at a station, assisted flight

The engine-2 workflow, 23 October 2026, for **Pacific Theatre**: what was
built under `src/battle/` for ROUND-2.md §3–4 and §6–8 (the sim's take-over
of any unit at a station, the stations' resolution and their AI, assisted
flight, the Battle API the UI builds against, the scene's picking and
sights, the controls), the API as built, the parameters and why, the tests,
where the build departs from the contract, and what the integrator must
wire. Read with ROUND-2.md (the contract), ENGINEERING.md §§5, 7–9 and
research/engine.md (the first round).

**How to read the marks**, as in engine.md: *contract* = ROUND-2's number;
*R7* = research/R7-game-design.md; *computed* = the sim's own; *estimate* =
the engine's, unsourced, to be tuned by a person flying it.

---

## 1. What was read and decided

Read: ROUND-2.md whole; ENGINEERING §§5–9 with their "As built"; engine.md;
R7 §4.2 (the flight model), §4.3 (weapons from the air: the CCIP, the
torpedo envelope), §4.6 (the AA hazard and the player directing it), §4.7
(the AI), §5 (the moments' numbers), §8 (the calibration tests); R8 §5.1
(the never-list) and §3 (terms); R6 table A3 (the rear guns); DESIGN §3.5,
§7.3, §7.4; the four battle files and the kits.

The decisions that shape everything else:

1. **A take is soft until the player acts.** `sim.takeControl` leaves the
   unit on the record (its motion, its scripted events, its fate) with a
   shadow body the HUD reads, and the first non-zero level or counter
   engages it (ai.js `inputTouched`): from then on it is the player's, on
   the sim's models, `sim.diverged` is true, and the authority rule's "the
   player's unit is cause or target" applies. This is the only way the
   contract's untouched rule can hold exactly: a unit given back untouched
   *never left* the record, so it "returns to the record and `diverged` is
   unchanged", and part 4 asserts the box's outcome undiverged afterwards.
   A take that engaged at once would have made the record's events naming
   the unit unscripted for the whole hold, which no release could undo.
2. **Bookmarks take hard at once**, as the first build did (`startMoment`
   → `takeControl(moment.role)`), with `allStations`: the bookmark's input
   drives every station until the player's first Tab, so the twenty-three
   sorties and smoke part 3 behave as before.
3. **`sim.units` became a function** (the contract's `sim.units()`); the
   engine's slot array is `sim.slots`, and `sim.units[i]` and
   `sim.units.length` still read the slots (the function carries them as
   indexed properties), because `tools/replay.mjs` and `src/link.js`, which
   this workflow does not own, read `sim.units[i]`.
4. **The stations are gated in the sim**, not only in the controls: at a
   free take the helm's levels drive the ship only at the helm, the main
   battery's aim only at the main battery, and so on; the station left is
   the AI's (§3 below).

## 2. The API as built

### 2.1 The sim (`src/battle/sim/`)

```js
sim.units() → Row[]                         // takeover.js unitRows; about 2 ms (17 ms the first call, which builds the static part)
sim.slots                                   // the slot array (the first build's sim.units); sim.units[i] still reads it
sim.takeControl(role) → player              // throws Error(reason) when not takeable; reason also on err.reason
sim.setStation(name) → player               // throws when nobody holds a unit, or the unit offers no such station
sim.releaseControl() → sortie | null        // null when nobody held a unit
sim.sortie                                  // the open sortie (held: true) or the last one closed; null before the first take
sim.assist                                  // 'assisted' (default) | 'pilot'; createSim(…, { assist })
sim.stationsOf(i) → string[]                // the stations slot i offers (by rule, or its kit's override)
sim.takeable(i) → true | reason
sim.roleOf(i, station?) → { unit, station } | { group, index, station } | null   // the role that takes slot i
sim.groupTakeable(id) → true | reason       // a take as a group ({ group, station }); true also where every row is greyed but a spare flies (a namedCrews group, a lone aircraft's)
```

**Row** (one per unit the list can show: the record's ships in their
order, then every group's aircraft group by group, then the parked
aircraft, then a spare in use):

```js
{
  index,             // the slot
  id,                // a ship's id ('nevada'); an aircraft's slot id ('kaga-level#3'); a spare's 'spare-0'
  kind,              // 'ship' | 'aircraft'
  side,              // 'us' | 'jp'
  name,              // a ship's name; an aircraft's group's name ("Kaga’s level bombers (2nd Attack Unit)")
  label,             // the HUD's one-aircraft form ("a Type 97 carrier attack plane of Kaga’s level bombers …"); a ship's name
  ja,                // the unit's (or the group's) ja, or null
  kit, kitName,      // the kit id; its short name ("Fletcher class", "Zero", "Dauntless")
  group, groupName,  // an aircraft's group id and name (a ship's formation id, or null)
  groupIndex, k,     // an aircraft's index in its group (0 is the leader), −1 for a ship; k is the same (ui-2's name)
  spare,             // true for a spare (a namedCrews group's, or a lone aircraft's)
  alive,             // 0 gone, 1 afloat or flying, 2 sinking or falling
  takeable,          // true, or the reason (§2.2)
  stations,          // ['helm', 'main', 'aa', 'torpedoes'] or ['pilot', 'gunner', 'bombardier'] by rule; [] parked
  now, next,         // in the stops' voice (§2.3)
  state,             // ship: { afloat, sinking, sunk, onFire, listing, listDeg, speedKn, headingDeg, damage, aground }
                     // aircraft: { airborne, falling, altM, speedKn, headingDeg, fuelS, damage, parked }
  held,              // true for the player's unit
  authority,         // 'record' | 'ai' | 'player'
}
```

**takeControl(role)**. A free take: `{ unit, station }` (a ship's id, or a
slot's id or index), `{ group, station }` (a member in the air that has not
yet reached its attack, the soonest first, never the leader; a
`namedCrews` group, or one with no other member left, flies a spare 120 m
out on the right of a member in the air and 60 m back; soft like any take,
it keeps that place until the player acts, and given back untouched it
goes and the box is undiverged), `{ group, index, station }` (that
aircraft). An aircraft's body starts at its speed on the record, but never
under 0.8 of its kit's cruise nor over its top speed (its dive's limit
when diving). `station` defaults to the unit's first. The role is
resolved and checked before anything changes: a refused take leaves the
sim as it was (the held unit, if any, is still held). A bookmark's role
(`{ kind, kit, side, unit | group, name }`, no station or index) takes as
the first build did. Throws:

- the reason (§2.2) when §2 forbids the unit now, as `Error(reason)` with
  `err.reason`;
- `takeControl: no unit “x”`, `no group “x”`, `x has no aircraft n`,
  `a role names a unit or a group`, `no slot free`;
- `takeControl: no station “x” on this unit (it offers …)`.

The player object (`sim.player`) keeps the first build's fields (`kind`,
`unitIndex`, `scripted`, `input`, `state`, `role`) and gains: `station`,
`stations`, `engaged` (false while soft), `engagedAt`, `allStations`
(a bookmark until its first Tab), `tTake`, `hold` ({ heading, speed, alt,
mainTarget }: what the AI holds), `steered`, `flown`, `director` (the main
battery's held solution). `player.state` gains `station`, `stations`,
`engaged`, `allStations`, `assist`, `assisting` (the limits acting this
step: 'bank', 'pitch', 'lift', 'speed', 'overspeed', 'envelope', 'floor'),
and per kind: an aircraft's `cue` (§4.3), `gun` (the gunner's sight:
{ dir, eye, bears, aimed, firing, cone, rounds, lead, range }) and `sight`
(the level sight: { x, z, tof, drift: [dx, dz], onTarget, target,
heading }); a ship's `director` (the AA director's sight: { dir, eye,
aimed, firing, cone, reach, lead, leadLight, range }), `helmHeld`
('record' or { heading, speed }) and `mainTarget` (the slot the main
battery holds, −1).

**setStation(name)** switches; the station left is held (§3). The first
Tab of a bookmark ends its `allStations`.

**releaseControl()**: untouched (never engaged), the unit was never off the
record (its shadow body goes); touched, the AI drives it on from its state
(`authority 'ai'`; an aircraft keeps the AI's and never rejoins the
record: `x.keepAI`), it joins `sim._released`, and the record's events
naming it as cause or target stay unscripted: a hit it caused or took is
resolved by the sim (its cause, an AI ship, engages the real gunnery at
the target; a strike sent at a released ship is flown for real from 150 s
before its attack). Closes the sortie and returns it.

**sim.sortie** (outcome.js `sortieOf`):

```js
{
  held,                 // true while the unit is held (t1 then is now)
  t0, t1, span,         // battle seconds: the take and the release (or the unit's fate); span is [t0, t1] (ui-2's name)
  from, to,             // clock labels ("10:21", "10:24")
  durationS,
  unit: { index, id, name, ja, label, kind, side, kit, group, groupName },
  role,                 // the role taken with ({ unit | group, index?, station, kind, name }, or the bookmark's)
  station, stations,    // the station at the end; every station used, in order
  momentId,             // the bookmark's id, or null
  touched, engagedAt,   // whether the player acted (and when)
  hits,                 // [{ unit, name, kind: 'bomb' | 'torpedo' | 'shell' | 'near-miss' | 'aircraft', count, where }]: an aircraft the player brought down is one 'aircraft' entry, by its one-aircraft name
  downed, torpedoesHit,
  releases: { bombs, torpedoes, salvos, shells, rounds, aaBursts, releaseM, envelope },
  damageTaken,          // ship: { fight, float, list, fires, hits, systemsOut }; aircraft: { damage } (fractions of fatal)
  survived,             // true, false, or null (still in the battle)
  how,                  // 'landed' | 'ditched' | 'lost' | null
  divergedDuring,       // [{ unit, index, name, kind, side, why, reason, t, at }]: who left the record in the span, the player's own unit excepted (reason = why, ui-2's name)
}
```

`why` is the sim's own words: "fired on by the player", "hit by the
player’s AA", "hit by the player’s gunner", "engaged the player",
"turned into the attacker", "its attack flown for real", "group rule: …",
"player", "ai", "near miss", "not launched: …", "spared: its loss did not
come", "sank". No person is counted anywhere in it.

### 2.2 Takeability (takeover.js `takeability`, §2's rules, the list's words)

| case | reason |
| --- | --- |
| a `fixed` unit (Arizona, Oklahoma, Utah) | `fate is fixed` |
| a `hospital` unit (Solace) | `hospital ship` |
| a `tokko` unit or group (the midget submarines, the Shikishima unit) | `tokkō unit` |
| a parked aircraft | `on the ground` |
| an aircraft before its take-off or entry | `not yet airborne` |
| an aircraft after its landing | `has landed` |
| an aircraft lost (in the record or the sim), falling | `did not return` |
| an aircraft gone out of the box | `left the area` |
| a group's leader (index 0) | `flies the lead` |
| any aircraft of a `namedCrews` group | `a named crew` (the group itself is takeable: a spare) |
| a group not launched (its carrier burning or sunk) | `not launched` |
| a ship sunk, or going down | `no longer afloat`, `going down` |
| a ship past her fate (the record's damage past her kit's fatal; the sim's foundering, sinking or own doom) | `fate is sealed` |
| a site (a take that names one) | `a site, not a unit` |
| `unit.takeable: false` in the battle file | its `why` |

### 2.3 Now and next

A ship's `now`: "steaming 310° at 20 kn", "moored", "stopped, heading
264°", "aground", with ", on fire" and ", listing 12°"; "going down";
"sank at 08:08". Her `next`: the record's next event inside the clock with
its own text ("At 07:30: Johnston is hit by heavy shells, then medium
ones: …") or, without text, a phrase from its kind ("Kaga is hit
(amidships).", "Hiryū is hit by two torpedoes."), else her next turn of
10° or more ("At 08:42: Neosho comes to 170°."). An aircraft's `now`: "on
its dive on Kaga" (in its last 60 s before the release; 90 s for a torpedo
run), "on its torpedo run at Oklahoma", "on its bombing run over West
Virginia", "strafing Ewa", "on combat air patrol at 1,500 m", "escorting
Bombing Six at 13,000 ft", "coming in to land aboard Akagi", "returning to
Kaga at 3,000 m", "flying 196° at 3,000 m"; "not yet airborne; on
Akagi", "landed aboard Hiryū", "did not return". Heights in the side's
units (feet for the US, metres for Japan, as the HUD has them). Its
`next`: the plan's next action ("At 07:57 it drops its torpedo at
Oklahoma.", "it releases its bomb over …", "it strafes …", "it lands
aboard …", "it leaves the area", "it takes off from …", "it enters the
area"). No individual loss is ever foretold (the record's losses are the
seed's draw, not the record's word about one aircraft).

### 2.4 Battle (`src/battle/index.js`)

```js
battle.select(index | null, { follow = true }?) → Row | null   // the bracket; the orbit follows while watching; event 'select' { index, unit }
battle.take({ unit | group, index?, station?, t? }, { scripted }?) → Promise<{ sortie, score, outcome, reason, momentId: null, restart: null }>
                                            // throws as sim.takeControl; t: go there first (a changed box goes back to the record when t is earlier)
                                            // event 'take' { role, index, station }; the promise resolves at release() or the unit's fate
battle.setStation(name) → name              // throws as sim.setStation; event 'station' { station, index }
battle.cycleStation(dir = 1) → name | null  // Tab
battle.release() → result | null            // a bookmark or a free take: finish('released'); event 'after' { kind, ...result } with result.sortie
battle.bookmarks → [{ id, title, t, label, role, kind, station, objective, durationS, timeScale }]
battle.takeMoment(id, { scripted, atCheckpoint }) → Promise<result>   // as the first build; result gains sortie
battle.assist                               // get/set 'assisted' | 'pilot' (throws on anything else); event 'assist' { assist }; App persists it
battle.firstDoor → { role, t, title, text, at } | null   // the battle file's (content-2), at: t parsed
battle.speeds → number[]                    // the bar's list now (watching: 1…60; an aircraft held: [0.5, 1, 2] Assisted, [1] Pilot, + [4, 8, 16, 32] after a bookmark's checkpoint; a ship: [1, 2, 4, 8] or a bookmark's)
battle.baseScale() → number                 // a held unit's own scale (the threat drop-back's)
battle.selectNext(dir) → Row | null         // Tab while watching
battle.play(timeScale)                      // 0.5 accepted (clamped to the list's ends while a unit is held)
battle.state → { boxId, t, momentId, mode: 'watch' | 'moment', selected, station, held: { index, id, kind, engaged, role } | null, assist, sortie }
```

Events on `app.events` ('battle', `detail.kind`): the first build's
`enter`, `abort`, `moment`, `checkpoint`, `after`, `rebuilt`, `leave`, and
`select`, `take`, `station`, `assist`, `released` (with the sortie, after
`after`, at every release: by the player, by Backspace or by the unit's
fate; ui-2's link opens its after-card on it), `units` (L while watching: open the
list), `unit-card` (Enter on a selection while watching: `{ index, unit }`).
The watch keys ignore a key aimed at a field of the page (an input, a
button, a `.card`, a `.unitlist` or anything in a dialog or listbox).

### 2.5 The scene and the controls

`scene.select(index | null)`, `scene.selected`; `scene/pick.js`
(`pickAt(box, x, y)`, `Picker`): a click or a tap (under 6 px and 450 ms)
in watch mode picks the unit nearest the pointer within 24 px (a ship by
the segment from bow to stern, an aircraft by its slot) and calls
`battle.select`. Camera modes gain `gun` (along a gun station's aim) and
`bombsight` (down at the level sight's impact, the track up the screen).
The HUD (`hud.setStations(pl)`, `hud.firstHints(kind, lines)`) draws the
station bar (top centre; its buttons call `battle.setStation`), the first
take's four lines for eight seconds once a kind, and once for each gun
station and the sight when the first take is at one (localStorage
`pt.hints` = `{ aircraft, ship, gunner, aa, bombardier }`; a touch screen's
lines are keyed by kind), the dashed bracket and name on the
selection, the gun stations' cross, lead pips and bracket, the level sight,
and the cue's window bar.

## 3. The stations, and the AI at the ones the player is not at

| station | the player | the AI while the player is elsewhere |
| --- | --- | --- |
| helm | helm and telegraph (as the first build) | the record's way (a point a minute on along her track, catching up) until the player has steered; then the course and speed she was left on (`helmsman`) |
| main | the aim, the salvo, star shell (as the first build) | the target the player left it on, or the ship the record has her firing at (an opens-fire not yet ceased, its target or the next ship she hits): real salvos with the AI's solution error (ENGINEERING §5), corrected on seen falls; her shells are the player's (the player holds the ship) |
| aa | §4.2 | the AA hazard, as every ship's (aa.js) |
| torpedoes | the aim's bearing, a spread per press | the tubes hold (the record's torpedoes-fired events still run their visual spread) |
| pilot | the stick, the mouse-aim, the throttle; Assisted or Pilot | the record's path (the plan 4 s ahead, its speed; it releases what the record has it release) until the player has flown it; then the heading, height and speed left; a spare holds |
| gunner | §4.3 | the rear gun holds (the first build's rear guns never fired) |
| bombardier | the run-in's heading (A/D, as a pilot's director indicator), the stick's release | the pilot holds the run-in: the height and speed when the bombardier took over, the bombardier's heading |

The AI pilot keeps Assisted's floor whatever the setting (it is the
player's aircraft). A bookmark's input drives every station until its first
Tab.

## 4. The stations' resolution and numbers

### 4.1 Stations by rule (takeover.js)

Ship: `helm`; `main` if a battery has `role: 'main'`; `aa` if the model has
AA (the dated fit, dual-purpose batteries included); `torpedoes` if the kit
has tubes with a weapon. Aircraft: `pilot`; `gunner` with a crew of two or
more and a rear gun (a gun with `arc: 'rear'`, or the type torpedo, dive or
level with a crew of two or more, and a flexible gun to fire); `bombardier`
when the group's attack is a level run (or, without a group, a `level` kit
or a `bomber` with bombs). `kit.stations` overrides (its kind's stations
only; the first is always offered). The sixteen aircraft ROUND-2 §7 lists
carry `arc: 'rear'` on nineteen guns, each citing the kit's own source with
R6 table A3's reading (the Avengers' turret and ventral gun, the
Catalina's waist and tunnel guns, the bombers' turrets).

### 4.2 The AA director (ai.js `aaDirector`)

- **The aim**: `input.aimAz/aimEl` (compass degrees, degrees above the
  horizon) from the director's eye (ai.js `directorEye`: atop the bridge,
  the superstructure's top × 1.05, 3 m forward of its after end, where the
  scene's director and gun cameras stand), or `input.aa` as a world point
  `[x, y, z]`.
- **The aimed aircraft**: the other side's aircraft nearest the aim's line
  within 8° and inside the AA's reach.
- **Fire**: `fireHeld`, or half a second a `fireCount`. Only while firing.
- **The eye**: every 0.12 s a tracer stream (eight rounds, larger and
  redder than the first build's) from a mount on the bearing side, starting
  40 m out along the aim and running to the aim point (2.5 km at most), and
  with a heavy battery a burst at the aim point (scatter 2 % of the range).
- **The hits**: `λ = Σ_fit λbarrel × barrels × 0.5 (the bearing share) ×
  f(range) × cone(lead error)`, × era × alert × aspect × (½ crippled), with
  share 1 (the whole ship's fire on the aimed aircraft), drawn by aa.js's
  hazard (hit events at λ × 2.5, 40 % of them fatal). The lead error is the
  angle between the aim and the intercept (the round's mean speed taken as
  0.75 of its muzzle velocity, three iterations, own ship's motion
  removed): the cone is 1 at 0 mil, falling to 0 at 40 mil for the heavy
  mounts (75 mm and up) and 80 for the rest (*contract*). The HUD's lead
  pips are the same intercepts (heavy and light). The era factors and the
  alert ramp are R7's (*R7*, the first round's calibration); an aircraft
  first fired on starts its ship's alert ramp then.
- **Touched**: an aircraft inside the cone while firing leaves the record
  ("fired on by the player"): its fate is the sim's (it passes to the AI,
  flying its plan's way); its group's scripted hits obey the group rule as
  before. While the player is at the AA station the ship's own hazard in
  aa.js is off (her guns are on the aimed aircraft).
- **Numbers**, at Pearl Harbor (era 0.5): Nevada's eight 5"/25 and her .50s
  on a first-wave B5N at 2 km, aim on the pip, full alert: λ ≈ 6 × 10⁻⁴ /s
  (computed: about a 2 % chance a minute); at 600 m with the .50s in reach
  about 1.5 × 10⁻³ /s. Off the pip by 20 mil the 5-inch fire halves and the
  .50s keep three quarters; past 40 mil only the .50s count. The ship's
  hazard was calibrated to the record with the fire shared among the
  attackers (R7 §4.6); concentrated, one ship's AA on one aircraft is about
  2 to 4 times what aa.js gives it in a raid, which is R7's own "burst of
  attention" (§4.6, "The player directing AA").

### 4.3 The gunner (ai.js `rearGunner`) and the bombardier

- **The gunner**: the rear gun aimed along `input.aimAz/aimEl` from the
  aircraft; it bears within 80° of the tail and not far below the tail
  plane (the up component ≥ −0.35); fire with `fireHeld` or `fireCount`
  (0.4 s a press); rounds come off the drums at the weapon's rate; tracer
  every 0.1 s; hits on the aimed aircraft (within 10° of the aim, inside
  700 m) from a hazard of 0.006 /s a rifle-calibre barrel and 0.012 a
  12.7 mm one inside 35 % of 700 m, falling to 0 at 700 m (*estimate*: a
  four-second pass on the tail at 300 m by a fighter takes a 2–5 % chance
  from one 7.7 mm, about 9 % from two .30s), scaled by the 80 mil cone
  (*contract*). A hit is damage of about 0.3 of fatal and makes an
  attacking fighter break off for three seconds.
- **The bombardier**: the level sight's predicted impact is the ballistics
  module's bomb (`ballistics.js bombImpact`, the CCIP's own fall), the
  drift line the aircraft's track; the release drops the whole stick, a
  bomb every 0.15 s; the pilot holds the run-in (§3).

### 4.4 The release cue and its window (ai.js `releaseCue`)

`player.state.cue = { kind: 'dive' | 'level' | 'torpedo', on, value, lo,
hi, miss, half, target, envelope? }`. A bomb's: the predicted impact
against the target's hull with the target moving on through the fall,
`on` inside the hull (Pilot) or a box twice its length and beam
(Assisted): in a dive above the safe pull-out (R7 §4.3), or level in
Assisted or at the bombardier's station. A torpedo's: inside the drop
envelope (the first build's), at a range in the window, and the run's
track meeting the hull (the target holding course and speed): the
record's window is 300–1,500 m (R7 §4.3 and §5: Pearl Harbor's drops at
300–500 m, Hiryū's at about 730 m), Assisted's 150 m to twice 1,500 m
within the torpedo's run (Type 91: 1,800 m) and a hull twice as long.
`player.state.release` is the first build's dive cue in Pilot and the cue
in Assisted. The HUD says "release now" through the window and draws the
window bar.

## 5. Assisted flight (`P.assist` in params.js)

Applied only in the player's aircraft step at the pilot's station
(ai.js `assistedCommand`, `assistAfter`); in Pilot the step is the first
build's (part 3 and the calibration still fly it).

| parameter | value | why |
| --- | --- | --- |
| `bankDeg` | 60 | *contract* |
| `pitchUpDeg`, `pitchDownDeg` | 25, 30 | *contract* (path angle) |
| `diveDeg` | 80 | a dive bomber with bombs whose target lies within 1.6 × its height + 1.2 km may dive (the −30° limit would forbid the dive bomber's weapon run; the fixture's SBD dives to 74° in Assisted, released at 650 m, pulled out by the floor) |
| `clFrac` | 0.82 | the angle-of-attack limiter: the commanded lift never past 0.82 CLmax (the instructor's own 0.9 left the stall reachable in a hard turn at height) |
| `lowSpeed` | 1.25 Vs | below it the nose goes down 0.15 g and the throttle opens; with the limiter the stall does not come |
| `overspeed` | 0.9 vShake | the throttle closes, the brakes open, the nose lifts (10 g per unit over); and `assistAfter` holds the speed under 0.97 vBreak and never lets a control surface fail |
| `holdGain`, `holdMaxDeg` | 0.012 rad/m, 8° | the height hold when the stick is centred: the path angle asked, through a 1.5 s path-angle controller (the load that turns the path at (γwant − γ)/1.5 s) |
| `levelGain` | 2.5 /s | the wings levelled when the roll axis is centred |
| `gainSpeedRef`, `gainFloor` | 1.0, 0.45 | the instructor's gain × min(1, vCruise / V), at least 0.45: the mouse-aim softens at speed |
| `floorLandM`, `floorSeaM` | 60, 15 | *contract* |
| `floorRunLandM`, `floorRunSeaM` | 15, 10 | the floor suspended on a weapon run below it (*contract* "suspended"; a hard floor of 6 m over land and 4 m over the sea stays: the assist never flies the aircraft into either) |
| `floorLookS` | 0–6 s | the floor looks along the path; a shortfall asks a pull of shortfall / 30 m g (0.3 to 3.5), wings levelled past 35° of bank |
| `shipClearM` | 25 | over a hull, its top and 25 m (a slow approach to a carrier's deck is let through: a landing) |
| `torpedoRunM`, `torpedoGlideDeg` | 1,500 m, 5° | *contract* (the run's last 1,500 m: the drop's height (0.8 × the kit's drop height, 16–45 m) and speed (0.95 × its drop speed)); above it the height is held no higher than a 5° glide to the run's start, so a torpedo plane taken at 1,500 m arrives low |
| `diveLastM` | 800 m | *contract*: the dive's speed (the kit's dive speed) in its last 800 m above the release height |
| `levelLastS` | 20 s | *contract*: the height and speed held on a level run's last 20 s |
| `windowK` | 2 | *contract*: the release window twice the record's |
| `halfTime` | 0.5 | *contract* |
| `fightersOnPlayer` | 2 | what is aimed at the player's aircraft in Assisted follows Guided's rule (R7 §4.5): two fighters at most turn on it (four in Pilot) |
| `hitsOnPlayerK` | 0.5 | their rounds do half their damage and half their fire chance; the AA on the player's aircraft is halved (as Guided's) |
| `fighterLeadK`, `fighterReactionK` | 3, 1.5 | their lead error three times, their reaction time one and a half times the AI's |
| `fighterBreakS` | 5 | after each burst they pull clear for 5 s before the next pass (*estimate*: without the five, a casual pilot was lost before the checkpoint in four of Midway's nine bookmarks) |

Coordinated turns are the model's own (the yaw follows the bank); in
Assisted the rudder keys nudge at half strength. Direct control in
Assisted is bank-to-turn about the load that holds the path; mouse-aim
flies the instructor with the softened gain and the same limits. Ships in
Assisted gain only "hold course" when the helm is centred after the player
has steered (*contract*).

## 6. The casual hands (smoke part 5)

```js
// each step: the objective's bearing only (a bookmark's target ship, else the envelope's target, else the nearest aircraft of the other side)
bank = clamp(wrap(bearing − heading) × 1.2, −30°, 30°)
input.mode = 'direct'; input.roll = clamp((bank − roll) / 25°, −1, 1)
input.pitch = pitch > 8° ? −0.25 : pitch < −8° ? 0.25 : 0       // pitch within ±10°; otherwise the stick centred
input.throttle = 0.7
if (state.cue.on) a torpedo or a bomb                              // release on the cue
input.fireHeld = a target within 400 m                             // the guns, when the HUD has one
```

Every aircraft bookmark (seeded with its id, from its start, run to its
checkpoint) and eight random aircraft take-overs a box (ninety seconds each)
in Assisted: no crash (into the ground, the sea or a deck; a ditching
counts) and every checkpoint reached. In Pilot the same hands are run and
reported.

What the last run gave (`node tools/smoke-battle.mjs --takeover-only`;
Ironbottom Sound has no aircraft and is skipped):

| box | Assisted: bookmarks to their checkpoint | Assisted: random take-overs | Pilot (reported) |
| --- | --- | --- | --- |
| Midway | 8 of 9, no crash (vb6-akagi, vb3-soryu with a hit, vb-dive-hiryu and hiryu-b5n-yorktown released; vb6-kaga and hiryu-d3a-yorktown reached their checkpoints with no cue met, so no release; the fighters' and the CAP's reached theirs) | 8, no crash | 5 of 9 to their checkpoints, 3 crashes in 17 sorties |
| Pearl Harbor | 3 of 3, no crash (kaga-b5n-torpedo and kaga-d3a-nevada released; p40-haleiwa-ewa reached ʻEwa) | 8, no crash | 2 of 3, no crash in 11 sorties |
| Samar | none (the box has no aircraft bookmark) | 8, no crash | no crash in 8 sorties |

The one Midway bookmark short of its checkpoint, hiryu-b5n-yorktown, drops
its torpedo and is then brought down by Yorktown's AA on the way out: the
casual hands fly straight through the screen after the release. Part 5
lets one sortie a box end that way (it is reported in the line) and fails
on any crash, on a second sortie lost, and on any non-finite state.

Before the Assisted threat rule (§5, R7 §4.5's Guided halving applied to
Assisted) four of Midway's nine bookmarks lost their casual pilot to
fighters or AA before the checkpoint; with it, one. The hands also turn for
home after a release (the objective's bearing becomes the carrier's), which
the contract's "the objective's bearing only" does not say; without it they
kept circling the target ship's AA.

## 7. Where the build departs from the contract, and why

1. **The soft take** (§1): the contract's words "a unit untouched by input
   returns to the record and `diverged` is unchanged" are met by never
   taking it off the record until the player acts, rather than by putting
   it back at the release. A visible consequence: until the player acts,
   the record moves the unit (a bomber taken at its run-in releases on the
   record's second if nobody touches it).
2. **`sim.units` is a function that still indexes the slots** (`sim.slots`
   is the engine's array).
3. **The helm held by the AI follows the record's way until the player has
   steered**; the contract says "helm holds course and speed". Holding the
   course from the take would run Nevada aground in the channel the moment
   the player took her AA. Once steered, the helm holds the course and speed
   the player left.
4. **The main battery held by the AI fires at the record's target** while
   the record has her firing, when the player never laid it on one: the
   record's events naming the held ship as cause are the sim's to resolve
   while she is held, so without it Washington taken at her AA would never
   hit Kirishima.
5. **The aircraft speed list in Pilot is [1]**, as the contract says, but a
   bookmark's checkpoint still opens the fly-home scales (4×–32×, R7 D11),
   which the first build had.
6. **The threat drop-back** returns to the held unit's own scale (0.5 for an
   aircraft in Assisted), not to the moment's.
7. **Ammunition by the group's profile**: a torpedo group's aircraft carry
   the torpedo and no bomb, a level or dive group's the bombs and no
   torpedo, fighters on CAP, escort or strafing no bombs (the first build
   gave every B5N both its torpedo and its 800 kg bomb).
8. **The stations are gated in the sim** for free takes (§1, 4); bookmarks
   keep every input until their first Tab.
9. **Tab while watching selects the next unit** (the contract lists Tab
   among the watch keys without saying what it does there).
10. **The first take's hints are kept once a kind in localStorage**
    `pt.hints` (the contract says "then never again in that session" and
    names localStorage; localStorage keeps them across sessions).
11. **Parts 4–6 run in node** on the real boxes (the sim imports no three.js;
    four boxes × twelve takes under SwiftShader would take hours); the
    browser side of round two is part 2's take-over through Battle on the
    fixture box (the first door, a ship and an aircraft at each of their
    stations, the station bar, the after-card's sortie, no console error)
    and the shots in §8. Part 2 now flies its moments in Pilot like part 3:
    the old autopilot releases on `state.release`, which in Assisted
    includes the level cue.
12. **Assisted eases what is aimed at the player's aircraft** (§5's last
    five rows): the contract's Assisted is the flying only, but casual
    hands could not reach Midway's checkpoints through the CAP and the
    screen's AA. Guided's rule (R7 §4.5) was the nearest sourced one, so
    Assisted takes it, with the fighters' pull-clear after each burst.
13. **Part 5 lets one sortie a box end by the battle's fire** (its line
    names it), and still fails on any crash into the ground, the sea or a
    deck: hiryu-b5n-yorktown's casual pilot drops and is brought down by
    Yorktown's AA on the way out. The contract asks every checkpoint.
14. **The casual hands turn for home after their release** (the bearing of
    the carrier or field they came from); the contract's hands fly the
    objective's bearing only, which kept them circling the target's AA.
15. **The fixture box has a first door** (tools/fake-battle.mjs), so part 2
    can take it through Battle before content-2's battle files carry theirs.
16. **The first hints are keyed by station at a gun or the sight** (the
    contract's are "once a kind"): a first take at the gunner's, the AA
    director's or the bombardier's station shows that station's four lines,
    since the stick's would be wrong there; the helm and the pilot keep the
    kind's.
17. **A free take's first station gets its first aim**: the gunner's and
    the director's on the nearest aircraft of the other side they bear on
    (the gunner's only aft of the wings), else astern (the gunner) or on the
    beam (the director); before, a take at the gunner's station looked down
    the aircraft's nose until the mouse moved.
18. **A first-round bug fixed in the record's aircraft**: watching, they
    were placed on the last of a frame's sim steps only, and their velocity
    divided the frame's travel by one step's time, so at a few steps a
    frame (SwiftShader's half-second frames) their speed, their bank and
    the speed a take starts from were multiplied by the steps (a
    Devastator of Torpedo Three taken just after a scrub flew at 1,500 kn).
    The velocity now divides by the time since the last placement; a stride
    of over 2 s (watching at speed) takes the plan's own velocity and bank.
19. **A taken ship runs aground only once she has made her own way** (more
    than 0.6 of her length from where the sim took her body): the 30 m
    raster reads shallow under the bow of a ship moored at a quay, and
    Nevada taken at her berth at 07:58 was aground, for good, the moment
    the player fired. The first build's check is otherwise unchanged.
20. **An aircraft taken starts within its kit's speeds** (0.8 of its
    cruise to its top speed, its dive's limit when diving), not at the
    record's: some record legs ask more than the kit gives (below, §10),
    and a Pilot take past the kit's structural limit would fail at once.
21. **A spare's take is soft too** (§2.1): the contract's untouched rule
    holds for it as for any unit; before, a spare engaged at once and
    left the box diverged, so Pearl Harbor's first door could never be
    given back untouched.

## 8. Looked at, and measured

Shots from battle.html on the real data (Chromium 1194, SwiftShader,
1280 × 800, the machine shared with the other workflows' tests, so the
frame times are slower than RESEARCH.md §4's):

| box, view | frame | draw calls | triangles | JS heap | looked at |
| --- | --- | --- | --- | --- | --- |
| Pearl Harbor, Nevada at the AA station, 07:58 | 0.78–0.86 s | 224 | 364,000 | 25.5 MB | the director's view from atop her bridge down Battleship Row; a B5N of Akagi's torpedo unit at 410 yd in the bracket, the heavy and light lead pips ahead of it, tracer from the bearing side; the station bar with Anti-aircraft lit and the AA hints |
| Pearl Harbor, a Zero of Kaga's first wave over ʻEwa, Assisted ×0.5 | 0.70 s | 223 | 387,000 | 25.5 MB | the chase view low over the cane fields, 355 m; the bar's list [0.5, 1, 2] at 0.5; no limit acting in level flight |
| Pearl Harbor, a level bomber of Kaga's 2nd Attack Unit at the bombardier's station, 08:04 | 0.84 s | 220 | 330,000 | 25.5 MB | the level sight straight down from 3,000 m, the track line up the screen, the predicted impact's ring (25 s of fall), Helm bracketed as the nearest hull; the bombardier's four hints under the station bar |
| Midway, a Devastator of Torpedo Three at the gunner's station, 10:11 | 0.46–0.55 s | 147 | 146,000 | 25.0 MB | the rear seat looking aft past the fin at a CAP Zero at 480 yd in the bracket, the rear gun firing (591 of 600 rounds left); the gunner's hints |
| Ironbottom Sound, Washington at the main battery, 23:58 | 0.44 s | 112 | 66,000 | 22.2 MB | the director's view west over the dark sound, the station bar (Helm, Main battery, Anti-aircraft: no tubes), "on the record until you act" |
| Samar, watching, Johnston selected, 07:20 | 0.76 s | 110 | 74,000 | 23.0 MB | the dashed bracket and her name in the orbit view; the row: Fletcher class, takeable, four stations, "steaming 160° at 25 kn", next "At 07:30: Johnston is hit by heavy shells, then medium ones: …" |

Watching each box in the built app (smoke part 3, `dist/index.html`, the
last three runs): Midway 0.30–0.54 s, 20.1–20.2 MB, 144 calls, 87,000
triangles; Pearl Harbor 0.46–0.47 s, 20.8 MB, 213 calls, 228,000;
Ironbottom Sound 0.44–0.48 s, 17.9 MB, 121 calls, 51,000; Samar
0.45–0.48 s, 18.8–18.9 MB, 105 calls, 62,000; the fixture box after its moments
(part 2) 0.66 s and 13.8 MB. The station views draw the near
terrain's finer levels, so a held unit costs 1.5 to 2 times the watch
view's triangles; the heap grows by about 5 MB with the player's bodies,
sights and the station HUD. These are the dev server's unminified modules
under SwiftShader on a four-core machine shared with the other workflows'
tests: for comparing with each other and with RESEARCH.md §4 only.

Shots were looked at as they came, and these were fixed from them: the
gun camera's eye inside Nevada's own superstructure (now the director's
eye atop the bridge, in the sim and the camera alike); a take at the
gunner's station looking down the nose; the first hints over the chased
aircraft (now under the station bar); "Nevada: aground" at her mooring
the moment she was taken (the 30 m raster reads shallow under a moored
bow: a taken ship now runs aground only once she has made her own way).

**The gate**, every part run on this branch's last code: `node tools/smoke-battle.mjs`
in its parts (`--calibration-only`; `--browser-only` against this
worktree's Vite on `PORT=5417`; `--real-only` against the package's own
`vite build` on `REAL_PORT=5419`; `--takeover-only`), every part passed:
the calibration (R7 §8) as before; part 2's fixture box, its four moments
in Pilot, the take-over through Battle and no console error; part 3's
twenty-three bookmarks on the real boxes in Pilot through the integrated
app, as before; parts 4, 5 and 6 as §6 and the lines above say.
`node tools/replay.mjs`: all four boxes replay the record (the same
outcomes as before the round). `node tools/record-heights.mjs`: unchanged
and passing. `node tools/check-data.mjs`: no finding in kits; its six
problems are the prologue front keyframes `tools/check/ids.json` now asks
for, content-2's.

## 9. What the integrator must wire

`src/link.js`, `src/app.js` and `src/ui/**` are ui-2's; the integrator
joins them to this Battle. Every hook, and what to pass:

| the UI's hook (ROUND-2 §5) | call | notes |
| --- | --- | --- |
| the unit list's data | `battle.sim.units()` | every 0.5 s is plenty (about 2 ms); a greyed row's reason is `row.takeable`; filter by `row.kind`; the side by `row.side` |
| `onSelect(index)` | `battle.select(index)` (or `null`) | the 'select' event comes back with the row, also when the player clicks a unit in the box (scene/pick.js) or presses Tab while watching |
| the unit card (mode `unit`) | the row: `name`, `ja`, `kitName`, `side`, `now`, `next`, `state`, `stations`, `takeable` | open it on 'select' and on 'unit-card' (Enter on a selection) |
| `onTake(role)` | `battle.take({ unit \| group, index?, station, t? })` in a `try` | a refused take throws `Error(reason)` with the list's words; the promise resolves with `{ sortie, score, outcome, reason }` when the sortie ends; `sim.roleOf(index, station)` gives the role for a row |
| `onStation(name)` | `battle.setStation(name)` | Tab and the HUD's station bar call it too; the 'station' event follows |
| `onRelease()` | `battle.release()` | resolves the take's promise; the 'after' event carries `{ kind: 'after', sortie, score, outcome, reason, momentId: null }` |
| the after-card | `result.sortie` (or `battle.sim.sortie`) | title "At the controls of {sortie.unit.label}, {sortie.from}–{sortie.to}" (a ship's label is her name); *Your sortie* from `hits`, `releases`, `damageTaken`, `survived`, `how`; *Your battle* from `divergedDuring` (names and `why`, never a count of people); *The record* the unit's own events between `t0` and `t1` from battle.json (a ship's `events`; an aircraft's group's attack and losses), in the stops' voice; a bookmark's (`sortie.momentId`) keeps its written `after` |
| `onAssist(v)` | `battle.assist = v` | App persists it (ui-2: localStorage) and sets it **before** `battle.enter`, so the sim is built with it (Battle passes it to createSim); the 'assist' event follows |
| the bar's speed list | `battle.speeds`, `battle.play(scale)` | 0.5 accepted; the list changes with the held unit and the setting |
| the bookmarks on the stop strip | `battle.bookmarks` | a click: `battle.takeMoment(id)`, as before |
| `onFirstDoor()` | `const fd = battle.firstDoor; battle.take({ ...fd.role, t: fd.t })` | content-2's four first doors (on the base branch now) were each taken with this branch's sim and given back untouched: Midway's Wildcat of the noon CAP at 11:59, Gwin's helm at 23:24, Johnston's at 07:10, and Pearl Harbor's P-40B from Haleʻiwa at 08:31 (a `namedCrews` group, so a spare beside Welch's or Taylor's aircraft); none left the box diverged. On this branch only the fixture box has one (tools/fake-battle.mjs) |
| 'units' (L while watching) | open the unit list | |
| the URL | `battle.state.held.id` and `battle.state.station` → `unit=<id>&station=<name>` | on load, after `battle.enter`: `battle.take({ unit: id, station })`; an aircraft's slot id (`kaga-level#3`) is accepted as `unit` |
| `battle.state` | `{ …, selected, station, held, assist, sortie }` | |

ui-2's notes (research/ui-2.md on the base branch) were read against this
Battle after they landed; what each of their asks finds here:

- **Names**: the rows now carry `k` and `spare`, the sortie `span` and each
  diverged entry `reason`, the brought-down aircraft are `hits` of kind
  `aircraft`, and Battle dispatches `released` with the sortie, so
  link.js's reads find them without a mapping. The row's `state` is an
  object (§2.1), not a list of words: link.js's `Array.isArray` guard
  falls back to its `sim.state` words (no fuel); to show fuel and height,
  read `row.state.fuelS` and `row.state.altM`.
- **The group rows**: link.js greys a group whose members are all greyed;
  a `namedCrews` group (Welch's and Taylor's) and a lone aircraft's group
  (a scout, Chikuma's floatplane) are greyed member by member ("a named
  crew", "flies the lead") but take as a group, flying a spare: the group
  row's takeable should be `sim.groupTakeable(group)`.
- **The fixed fates and the level bombers** (ui-2 §7.1): the first wave's
  level bombers are takeable; a player's bomb or torpedo on a `fixed` unit
  registers nothing (ai.js `bombStrike`, `torpedoStrike`, as the first
  build), and a fixed unit's record events run whatever the player does,
  so no player is ever the cause of Arizona's loss. Greying those groups
  instead is the project manager's call; it would be one line in
  takeover.js `takeability`.
- **Off-box ships** (the Kidō Butai at Pearl Harbor, 280 km north):
  takeable; outside the box the terrain reads its nearest edge's (deep sea
  under the carriers there: 4,000 m), so they steam and fight as on the
  open sea.

Also for the integrator:

- **Smoke part 3** now sets `app.battle.assist = 'pilot'` before
  `app.take(id)`; it needs the integrated app (ui-2's bar, card and
  after-card classes) as before.
- **The watch keys**: Battle listens on `window` for L, Enter (with a
  selection) and Tab while `app.mode === 'watch'` and the key is not aimed
  at a field of the page (an input, a button, a `.card`, a `.unitlist`, a
  dialog or a listbox); if ui-2's list or card binds the same keys, one of
  the two should give way (ui-2's own focus handling is the better owner of
  Enter and Tab inside its panels).
- **The station bar** is the HUD's (top centre, 12 px down, its buttons
  take a click or a tap), and the first hints stand under it (52 px down).
  ui-2's held box bar now stands in the same place on a wide screen
  (style.css `.boxbar[data-mode='held']`, top 12 px): when it shows the
  stations, the page should set `--pt-stations-display: none` (and, to
  keep the hints clear of its two rows, `--pt-hints-top: 112px`) on
  `.pt-hud` or an ancestor, e.g. under `#ui.holding`; both bars call
  `battle.setStation`.
- **The HUD's message line** ("Return to the record at that time?") and
  the new instrument lines ("on the record until you act", "helm: on the
  record's course") use the app's word "the record".
- **`sim.units[i]`** (link.js 276, replay.mjs) still works; new code should
  read `sim.slots[i]` or `sim.units()`.
- **ENGINEERING.md §5, §7–9 and DATA.md §8** take this file's §2–5 as
  their "as built".

## 10. What is not finished, and needs a person

- **A person should fly it**, with a mouse and with a touch screen: the
  assist's gains, the gun stations' mouse rates (70°/s at the screen's edge
  without pointer lock, 0.12° a pixel with it), the touch drag (0.18° a
  pixel) and the fire button have been driven only by scripts and looked at
  in still frames.
- **The gunner's hazard** (0.006 and 0.012 /s a barrel) and the Assisted
  easing of what is aimed at the player (Guided's halving, two fighters at
  most, three times their lead error, a pull-clear after each burst, half
  their rounds' damage) are the engine's estimates, tuned only by the casual
  hands; the AA director's concentration of a ship's whole λ on one aircraft
  is R7's "burst of attention" without a calibration case of its own.
- **One Midway bookmark** (hiryu-b5n-yorktown) loses its casual pilot to
  Yorktown's AA after the drop: part 5 lets one sortie a box end by the
  battle's fire (reported in its line) and fails on any crash.
- **No AI mans the rear gun** while the player is at another station (the
  first build's rear guns never fired either), and an AI pilot does not
  evade: the pilot station held by the AI flies the record's path or holds.
- **Sites are not units**: a role naming one throws "a site, not a unit";
  the list does not show them.
- **The HUD's station bar and ui-2's bar** may both show the stations
  (§9). The first take's hints are kept once a kind (once a station at
  a gun or the sight) in localStorage.
- **Frame times** under SwiftShader on a machine shared with the other
  workflows' tests are two to five times RESEARCH.md §4's; a GPU has not
  been measured.
- **Record legs faster than their kits, and a slow van**: Pearl Harbor's
  Haleʻiwa P-40s (welch-taylor) climb from their entry at 416–507 kn
  around 08:32 (their plan's first point is far from where they enter);
  Gwin's track at Ironbottom Sound has her at 2 kn from 23:20 to 23:30, in
  the van in the action. Both are the battle files' (content's); a take
  bounds an aircraft's speed by its kit (§7, 20).
- **The record’s Torpedo Three at 10:11** flies about 250 kn over the
  ground, past a Devastator’s top speed (about 180 kn): the battle file’s
  timing (content’s), not the engine’s. A take there starts at the kit’s
  top speed (§7, 20); a record speed past a kit’s top speed is worth a
  check in tools/check/battle.mjs.
