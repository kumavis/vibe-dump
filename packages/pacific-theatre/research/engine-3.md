# Engine, round three: the wargame's arena

The engine-3 workflow, 27 October 2026, for **Pacific Theatre**: what was
built under `src/battle/` for ROUND-3.md §3–4 and §7 (the arena sim, its
admirals and units, the objectives, the player's possession, hops and
respawn, the scene's shake, slow motion, sinking and snapshots, Battle's
`enterWargame`, `restart` and hops), the surface as built, the numbers and
why, the balance as measured, where the build departs from the contract,
and what the integrator must wire. Read with ROUND-3.md (the contract),
research/engine-2.md (the stations this reuses) and research/content-3.md
(the scenario files, whose extensions the arena reads).

**How to read the marks**, as in engine-2.md: *contract* = ROUND-3's
number; *content-3* = a field of content-3's scenario files beyond §6;
*estimate* = the arena's own, set by the headless balance runs and by
looking at the box, never sourced.

---

## 1. What was read and decided

Read: ROUND-3.md whole; engine.md and engine-2.md; ENGINEERING §§5, 7–9;
R7 §4 (the flight model, weapons from the air, the AA hazard, the AI);
DESIGN §3.5, §7.3–7.4 and DATA §10 (the words); the four battle files and
the kits; near the end, content-3's three scenario files, its
research/content-3.md and its `tools/check/wargames.mjs` (from its
worktree, read only), and ui-3's `src/link.js` and `src/ui/mock-arena.js`
(read only), so the arena's surface meets the HUD layer's reading.

The decisions that shape everything else:

1. **A sim of its own, in the record's state layout.** `createArena` fills
   the record sim's typed arrays (`pos`, `quat`, `vel`, `speed`, `heading`,
   `damage`, `fire`, `list`, `alive` 0/1/2, `kitIndex`, `version`), its
   `kits` list, `capacityByKit`, `effects` (the EffectsRing and its FX
   kinds) and `projectiles`, and keeps each unit's model at `_X[i].model`
   with its batteries' mounts, so `scene/units.js`, `effects.js`,
   `cameras.js` and `hud.js` draw it unchanged. While a wargame runs,
   `battle.sim` *is* the arena, so the unit list, the card, the station bar
   and the touch controls work on it as on the record's.
2. **Reuse by import, not by copy.** The kits' models (`sim/units.js`
   shipModel, aircraftModel), the ship's hull and helmsman (`sim/ship.js`),
   the guns, shells, bombs, torpedoes and their projectiles (`sim/guns.js`,
   `sim/ballistics.js` with each battery's firing table), the collision
   tests (`sim/collide.js`), the AA hazard (`sim/aa.js`), the lead and the
   director's eye (`sim/ai.js`), the stations' rule (`sim/takeover.js`),
   the world's ground (`sim/world.js`), the seeded generator and the
   effects. Nothing of the record's sim is changed; `tools/replay.mjs` and
   `record-heights.mjs` still pass.
3. **Arcade on its own models.** Aircraft fly a point-to-fly model of the
   arena's own (`arena/physics.js`); ships step the record's hull on an
   arcade copy of the model (radius ÷ 3, mass ÷ 2, rudder time ÷ 3, the
   Nomoto lag ÷ 10) with an arcade steering law (§3).
4. **The AI's gunnery walks in, at a pace.** The contract solves the lead
   exactly and keeps dispersion at ×0.3; that alone sank a carrier in the
   first salvo of every seed. The AI keeps the exact lead and adds a
   ranging error that starts wide and closes with each fall it sees, and
   fires a salvo no oftener than every 30–40 s (§4.2): measured on
   content-3's files, the games otherwise ended in three minutes of ten.
5. **One fixed step** (1/60 s, at most eight a call, the rest carried), the
   admirals every 2 s (contract), the units' AI four times a second
   staggered by slot, the AA ten times a second.
6. **content-3's fields are read** (§7): the start's formation, heading and
   separation, the first unit's station, the aircraft airborne at the start
   and the most in the air, the profiles, the first wave's size, the goals'
   weapon, hand, types, reach, out of action and further terms, the night
   and its visibility, and the sky's hour.

## 2. The surface as built

### 2.1 `createArena(scenario, kits, box, { side, seed, warn })` (`src/battle/arena/index.js`)

`scenario` is a wargames/<id>.json (§6, with content-3's fields); `kits` is
`{ ships, aircraft, weapons }`; `box` is what `data/load.js` loadBox
returns (`{ battle, pack, box }`) or `{ battle, ground, proj, exaggeration }`
(the node tools); `side` is the player's, `'jp' | 'us'` (`'japan' | 'usa'`
are read too). The seed is `${scenario.id}:${side}:${seed}`.

| member | what it is |
| --- | --- |
| `state`, `capacity`, `kits`, `capacityByKit`, `effects`, `projectiles`, `beats`, `slots`, `_X[i]` | the record sim's layout (§1.1); `slots[i]` is the unit's static row (id, name, ja, kind, side, kit, group, groupIndex, label) |
| `t`, `durationS`, `clock`, `remainingS` | the game's seconds; the clock labels them `m:ss` (`clock.label(t)`), with the box's date and its light at the scenario's `skyAt` (or the battle's first door) |
| `advance(dt)` / `step()` | the battle's dt in (Battle.tick, scaled by the scene's slow motion) / one 1/60 s step (the tests) |
| `units()` | the unit list's rows (round two's shape, `rows.js`): `takeable` is `true` for a friendly unit alive (an aircraft on a deck that can launch included) and the reason otherwise (`'the other side'`, `'going down'`, `'no longer afloat'`, `'did not return'`, `'lost with its carrier'`, `'its carrier is burning'`); `enemy` marks the other side's rows; `now` in the record's phrases ("steaming 110° at 24 kn", "on its run at Kumano") |
| `takeControl(role)`, `setStation(name)`, `releaseControl()`, `player`, `sortie` | round two's station surface: `role` is `{ unit, station }` (an id or a slot), `{ index }` or `{ group }`; `player.state` is the HUD's mirror (§2.3); `sortie` the held unit's (`releases`, `hits`, `downed`) |
| `first` | the side's first unit: `{ unit, index, station }` from the scenario's `first` (a ship's id, or an aircraft kit: an airborne one of it) and `firstStation` |
| `hop(kind \| index)`, `hopTarget(kind)` | 'carrier', 'capital' (battleship or cruiser), 'destroyer', 'aircraft' (the nearest friendly one), 'next' / 'prev' (the next of the same kind), a slot; returns the new `player` or null |
| `objective`, `objectives` | the played side's main goal / both: `{ kind, type, types, noun, weapon, by, outOfAction, done, count, total, of, status: 'open' \| 'met' \| 'failed', text, line: '2 of 4', terms }` (`done` so far; `count` the goal's own, as the file has it; `terms` with `also`) |
| `phase`, `phases` | the played side's phase now / both: `{ index, of, title, text, goal, t, endsAt, leftS, done, count, status, line }` or null |
| `strength` | `{ jp, us }`, each `{ fraction, hp, hpMax, ships, shipsTotal, aircraft, aircraftTotal }` (the bars read `fraction`: the hit points of the ships afloat over all) |
| `tally` | `{ jp, us, player }`: a side's `sunk`, `downed`, `hits`, `shipsLost`, `aircraftLost`; the player's `hits`, `sunk`, `downed`, `lost` |
| `markers` | `{ t, unit, text, side, player, onPlayer, kind: 'hit' \| 'sinking' \| 'down', weapon }` in machine words ("Kumano: torpedo hit amidships, fire", "Zero: shot down", "Kumano: strafed") |
| `events` | `{ t, kind, ... }`: 'hit' / 'sinking' / 'downed' with `marker: true, target, text, mine` (each marker, where the HUD layer reads them), 'sinking' (`index, by`), 'lost', 'respawn' (`from, to, line, text`), 'hop', 'phase', 'turn-away', 'destroyers', 'wave', 'torpedoes', 'highlight', 'end' (`result`) |
| `highlights` | `{ t, kind: 'hit' \| 'sinking' \| 'lost', unit, name, side, by, player, mine, weapon, caption, text, snap, snapshot }`: the player's hits, every sinking, the player's losses; the scene fills `snapshot` (a JPEG data URL) on those with `snap` |
| `shake`, `slowmo` | the requests: `{ amount, seq, t }`, `{ seconds, seq, t, why }` (the scene acts on a new `seq`) |
| `respawn` | the last `{ t, line, from, to }` |
| `result` | null, then `{ t, reason: 'clock' \| 'goals' \| 'annihilated' \| 'forced', side, goals: { jp, us } (each with its `sentence`), met: { jp, us }, mine, line, text, footnote, tally }` |
| `forceEnd(reason)`, `pick(origin, dir)`, `takeable(i)`, `possess(i, station)`, `airborneOf(side)` | the end now; the unit a ray hits (the scene's picking); the takeable rule; a possession without the role; the aircraft a side has up |

### 2.2 The rules the player meets (`arena/player.js`)

- **Possession** is instant: the unit's AI lets go of the stations the
  player holds and keeps the rest (round two's rule); an aircraft on deck
  is launched there and then. At the helm a ship's captain also fires (a
  click lays the main battery on the pointer, T sends the torpedoes along
  its bearing); the main battery, AA and torpedo stations are round two's.
- **Hops**: Tab is 'next' (Shift+Tab 'prev'), 1–4 the kinds, a unit picked
  in the list or the box is a hop to it (Battle.hop).
- **Loss and respawn** (contract): two seconds after the held unit is lost,
  the next one: the same flight's next aircraft in the air, then its next on
  deck, then any friendly aircraft, else the nearest friendly ship, with
  one line: *Your Avenger did not return. The next one is yours.* /
  *Gambier Bay is going down. Johnston is yours.* With nothing left, the
  player watches.
- **The tally** counts the side's and the player's own; the highlights are
  pushed on the player's hits (the first two shoot-downs snapped), every
  sinking, and the player's losses.

### 2.3 `player.state`, the HUD's mirror

The record's fields, so `scene/hud.js` draws the arena unchanged (an
aircraft's ias, alt, pitch, roll, throttle, ammo, bombs, torpedoes,
target with its lead, ccip, the torpedo cue and track, the home bearing;
a ship's speed, telegraph, rudder, list, fires, turrets with their
bearings, target with its lead, the main battery's time of flight, the
torpedoes ready and their spread), plus `arena: true`, `plotSpan: 8000`
and `contacts` (the plot's). The arena flies no fuel: `endurance` is the
kit's.

### 2.4 Battle (`src/battle/index.js`)

| method | what it does |
| --- | --- |
| `enterWargame(id, { side, seed, from })` | loads the box and wargames/<id>.json (`loadScenario`; a test may hand one in through `globalThis.__wargameScenarios`), builds the arena, flies down from the table (`from: 'table'`) or cuts (`'url'`), takes the side's first unit at its first station; `state.wargame` is `{ id, side, seed, games }`; speeds `[1]`, no scrubbing |
| `hop(kind \| index)` | Tab, 1–4, a pick; returns the new held unit's row; a hop to another kind (a ship to an aircraft) shows that kind's keys and hints and asks the pointer lock for a pilot; 'battle' event `hop` |
| `take(role)`, `release()`, `setStation(name)`, `cycleStation()` | as round two, on the arena; a release gives the unit back to its AI and leaves the box watching (no after-card) |
| `restart({ side, seed })` | a fresh arena on the same box and scene, the same side or the other, the next seed; the HUD's lines, hints and spoken line of the last game cleared; 'battle' event `wargame` with `phase: 'restart'` |
| `endNow(reason)` | the end now (the end card's *Back to the table*, the smoke test) |
| `leave()` | as ever |

The arena's events go to the page as 'battle' events with `wargame: true`
(the markers excepted: they stay in `arena.events` for the HUD layer);
the end is `'wargame-end'` with the result. The camera at the helm and the
torpedoes is the chase camera in a wargame (the bridge view hides the
duel).

### 2.5 The scene and the controls

- `scene.shake(amount)`: a camera jitter (rotation, undone each frame) of
  the strongest request, dying in about a third of a second; the arena asks
  on a hit taken (0.38 + 0.08 × the weapon's hit points), a near miss of
  the held ship (by calibre and distance), the held aircraft hit (0.35),
  the held unit lost (0.5 aircraft, 0.8 ship).
- `scene.slowmo(seconds)`: the arena's dt to a quarter, eased in and out
  (`slowFactor()`), Battle.tick's `simScale`, never the record's; asked for
  1 s on the player's torpedo hit, bomb on a carrier, or a magazine.
- **The sinking animation**: UnitRenderer's `pose` hook, for a ship at
  `alive` 2: the list grows to 32° (18° for a magazine), the trim to 9° by
  the bow or the stern, the hull settles below the sea over her 20 s (12 s
  for a magazine).
- `scene.snapshot()`: a promise of a 320 × 200 JPEG data URL of the canvas,
  grabbed just after the next frame is drawn (the renderer keeps no drawing
  buffer), at most six a game; taken by itself on the highlights with
  `snap`, four seconds apart.
- **The HUD** (arena only, `st.arena`): the main battery's lead diamond,
  the torpedo spread (dashed while the tubes reload), an aircraft's torpedo
  track, the bomb's impact ring, the plot at 8 km.
- **Controls**: in a wargame Tab / Shift+Tab hop (next / prev), 1–4 hop
  by kind (the number row or the keypad), the backquote key cycles the
  station (Tab's round-two job), and the hints say so
  (`wargame-ship`, `wargame-aircraft`, `wargame-touch`).

## 3. The arcade models (`arena/physics.js`, `params.js`)

**Aircraft** (contract: point-to-fly, no stall, a speed band, auto-level, a
floor, turn rates by class). The command is an aim point (or a stick), a
throttle and a dive limit. The speed follows the throttle within 0.5–1.0
of the kit's top speed with a 3 s lag, a climb bleeding it and a dive
adding it (× 0.55 g sin γ). The turn rate is 360° over the kit's turn time
× 1.35, held inside its class's band (fighters 20–34 °/s, dive bombers
15–25, torpedo bombers 13–22, level bombers 10–16); pitch and roll rates by
class; banks to 80°; centred, the bank decays in 0.6 s and the path toward
level in 1.6 s. The floor is 18 m over the sea and 60 m over land, looked
for 2.5 s ahead. Hit points: 1, fighters 2 (contract).

**Ships** (contract: three times the turn rate, twice the acceleration).
The record's hull model on a copy with the turning circle a third
(radius ÷ 3), the mass halved, and two quickenings the contract does not
name: the rudder's time ÷ 3 and the Nomoto yaw lag ÷ 10. At a third of the
radius alone a carrier at 18 kn still took 27 s to start her turn (T =
3L/V), which reads as no turn at all in a 10-minute game. The steering is
an arcade law (helm ∝ the heading error less 0.9 of the yaw rate's lead,
the telegraph from the helmsman). A ship with her bow on the ground stops.

## 4. Weapons and damage (`arena/weapons.js`, `damage.js`)

### 4.1 As the contract has it

Shells fly the ballistics module with each battery's firing table and
dispersion × 0.3; torpedoes run at 1.5× their speed for 6 km, armed after
150 m (estimate), friendly ones passing under; bombs fall from the
aircraft's motion (the impact point is the HUD's ring); hit boxes are
1.5× the hull (for shells, 1.5× the hull's length and beam at the hull's
own height, so a shell passing over the deck is a miss); the AA is the
record's hazard × 3, shared among the aircraft in reach, with tracer and
flak; the player's AA is round two's director. A hit on a ship going down
registers nothing (`hitShip` returns null). A torpedo hit's column (90
across) stands at the side it struck, not at the hull's middle where it
stood hidden inside her.

Damage (contract): hit points escort carrier 10, destroyer and destroyer
escort 6, cruiser 14, battleship 30, fleet carrier 18 (light carrier 14,
anything else 8); a bomb 2, a torpedo 5, a shell of 400 mm and over 4, 330
and over 3, 190 and over 2, 100 and over 1, smaller nothing; fire under
half, a list (7–13°, speed capped at 0.65) under a quarter, sinking at
none over 20 s. A carrier burning launches and recovers nothing; the
aircraft on her deck go down with her. Beyond the contract: a shell of
330 mm and over has a 3 % chance of a magazine (estimate; the sinking at
once, 12 s, the slow motion).

### 4.2 The AI's gunnery (estimate)

The lead is exact (contract). On it, per battery and target, a ranging
error: it starts at 40 % of the range or 80 mils across, closes by a fifth
with each fall the battery sees (to 22 % and 35 mils), and opens again on
a new target or on the firer's own turn of more than 20°; each turret
takes 0.87 of the battery's error plus its own share. A battery waits for
its fall before the next salvo, and fires no oftener than every 30 s (guns
under 150 mm), 40 s (medium and heavy; a heavy battery's reload when
slower, Yamato's 35 s being faster); guns under 150 mm fire at ships only
inside 2.5 km; secondaries take the escorts inside 4.5 km. The target is
the nearest in arc, the damaged first (contract), with a ship of a type
the side's main goal (or its further terms) would have it sink or hit
taken before a nearer one (its score × 0.55): Yamato lays her guns on a
carrier before an escort, Washington on Kirishima before a destroyer; a
side that must keep its ships afloat keeps the nearest threat. A ship
whose last 20 s brought falls within 250 m of her weaves ±30° every 10–18
s: she chases the salvos. A side that has turned away fires only at what
comes within 2.5 km. A cruiser or destroyer outside a destroyer attack
fires torpedoes at a carrier or capital ship on its beam inside the band
no oftener than every 120 s.

Why these numbers (measured with the headless runs, `tools/smoke-arena.mjs`
and the scratch tools of §8): at the first numbers (30 %/60 mils to
6 %/12 mils, salvos every 12–15 s) a game on content-3's files ended in
about three minutes (Midway's carriers burning by 160 s, Kurita's four
carriers sunk by 185 s). The ranging floor alone moved little: about half
the hits are the shells that miss the ship aimed at and find another in a
formation 450–700 m apart, or come in flat under 3.5 km through the hull's
danger space. The volume did: the salvo intervals above and the wider
range the admirals keep (§5) bring the games to 6–9 minutes. The AI's
shells still hit 8–20 % of the time under 3.5 km; a person laying the
diamond fires at the battery's own reload.

### 4.3 Strafing (content-3's `strafe`)

The contract's table has no entry for guns on a ship. A strafing run
(approach at 600 m, in from 1,500 m at up to 35°, the guns from 900 m,
a pull-out at 300 m) does no damage: the ship's AA is beaten down to 0.4
of itself for 8 s and a marker says *Kumano: strafed* when a run first
finds her. The player's rounds on a ship of the other side do the same.

## 5. The admiral and the units' AI (`arena/admiral.js`, `ai.js`)

**The admiral** (contract: one a side, every 2 s, a small state machine on
aggression, turn-away strength, launch interval and wave growth):

```
approach ──(within the range it keeps + 900 m)──▶ engage
approach | engage ──(strength under turnAwayAt)──▶ turn-away (for good)
```

The range it keeps is 5,600 − 3,000 × aggression metres (estimate; 0.6
keeps 3.8 km, 0.2 keeps 5 km: the first numbers, 4,600 − 3,000 ×
aggression, made every scenario a brawl at 2.8 km), a side
whose goal is to keep its ships afloat keeping at least 5,200 m (it runs,
and the arena's edge turns it); it closes 20° off the threat axis, opens
150° off it, or holds the beam, toward the arena's centre, a course kept
14 s unless the edge or a turn of more than 100° asks; turned away, it
steams 160° off the threat. Its standing orders on each tick:

- **the destroyers go in** (contract): when the other side's main body is
  within 4 km of its own (aggression 0.3 and over), or when it is weaker
  after the fifth minute; at most three targets, the goal's type first;
  back when every destroyer has fired or after 150 s; again two minutes
  later while they have torpedoes; a destroyer fires its spread at 1.5–2.6
  km and turns away;
- **zigzag** (contract): while the other side's strike aircraft are within
  3.5 km of the main body, legs of 12–22 s at ±40°; a ship dived on turns
  hard; a ship that sees a torpedo track within 2 km combs it;
- **smoke** (contract): the weaker side for its first 90 s (with half a
  minute of smoke already laid behind its two layers), and either side
  when its main body has been hit in the last 30 s while it is no
  stronger, for 60 s and not again for 60 s after; two escorts at once lay
  it across the threat (never the ship the player holds), and the
  carriers, while their main body is being hit, trail their own from the
  funnels; §6 has what a screen hides; a side that must keep its ships
  afloat makes smoke as it turns away;
- **the air** (contract): a combat air patrol kept up (the `cap` fighters
  when the scenario names them, as many as it had up at the start; else
  half the fighters, at most four), a wave every `launchEveryS` while it
  has strike aircraft: the first of `waveSize` (content-3) or
  max(3, a sixth of the strike aircraft), each after larger by
  `waveGrowth`, the `escort` fighters with it (or the fighters spare from
  the patrol), never more in the air than `maxAirborne` (content-3; 30
  when not given). With nothing in the air or on a deck on the other side
  there is no patrol to keep: the patrol and the escorts strafe. A wave's
  target alternates between the side's two best: the goal's type first,
  the damaged before the whole, the near before the far; a side that must
  keep its ships afloat goes for the ships nearest its main body, the
  cruisers and destroyers before the battleships.

**The units** (contract): station keeping on the formation (the scenario's
when it gives one, §7; else the core in rows behind the guide, the
cruisers on an arc at 0.7 of the screen radius across ±70° of the threat,
the destroyers on the screen ring across ±115°), gunnery (nearest in arc,
damaged first), evasion, the strike profiles compressed (approach at
1,500 m; the dive from 1,200 m, the nose walking the bomb's impact point
onto the target's from 1,400 m down, the release at 380 m or when the
impact point lies inside the target's hit box; the torpedo run from 800 m
at 40 m, rounded to the target's beam on the arena's side, back to the
beam when the run has gone wide (the intercept led an Avenger 1.3 km past
the edge after a carrier running away), a torpedo dropped higher than
150 m or over land breaks), the combat air patrol's intercept within
3 km, the dogfight (pursuit with lead, a burst in a 7° cone inside 380 m,
a break after it, a hard break with an enemy fighter on the tail), the
escorts, the rear gunners, the landing (from astern, low, onto the deck,
rearmed in 40 s), and every aircraft not on its run (a run within
1,600 m of its target) turned back at 150 m beyond the edge.

## 6. Smoke, squalls, night

**Smoke** (estimate; ROUND-3 §1 names it, nothing sizes it). A layer lays
a segment every 5 s; a screen drifts with the wind for 150 s and hides for
the first 100 of them: a ship beyond 1 km whose line of sight passes
within 250 m of a thick segment's middle (plus half its length), more than
200 m from either end, is hidden from the gunnery. It is drawn a line at a
time, every 150 m of trail or 20 s (the effect, the record's, lays two
dozen 150–420 m puffs on each line it is handed: one per segment stood a
white wall along every layer's track). A carrier's own smoke is the ship's
funnel trail and hides nothing. The smoke laid before the start is the two
layers' alone (never the played side's first ship: the chase camera rode
inside Johnston's trail) and is drawn.

Why: at first the weaker side smoked for the whole game with three
escorts and every carrier, the screens hid for 240 s across 300 m, and the
pre-start smoke lay behind every escort and carrier; at Samar every one
of Taffy 3's ships was hidden from Yamato for the whole game (156 screens
at the start, 438 by three minutes), the heavy guns had nothing to fire at
and the Japanese destroyers closed inside a kilometre and did the work.

**Squalls**: the box's are brought into the arena, as many as the box's
weather has, each a drifting disc 700–1,000 m across for 150–220 s, its
middle passing near the arena's middle third; a ship inside one is hidden
from a ship beyond a kilometre and sees out to 2 km. A night box (the
scenario's `night`, or the hour) draws white splashes, and a scenario's
`visibilityM` hides every ship beyond it from the gunnery. Star shells
(content-3's `starShells`) are not drawn.

## 7. The objectives (`arena/objectives.js`) and content-3's fields

Goal kinds (contract): `sink | hit | survive | shoot-down | reach`. A count
is the side's (any of its units). `sink`, `hit`, `shoot-down` and `reach`
are met when the count reaches the goal's within the clock (a phase:
within its timer) and failed when the time runs out, or, for a sink, when
too few of the type are left; `survive` fails the moment fewer of the type
are afloat than the goal's, and is met at the end. The game ends at the
clock, when both main goals are resolved, or when a side has nothing left
afloat or in the air. The result's sentence is in the voice of §1: *The
Centre Force sank four carriers by 4:03.*, *Taffy 3 kept four of the six
carriers afloat to the end.*, *Test Force A did not sink the carrier.*

content-3's fields beyond §6 (research/content-3.md §2), all read:

| field | as the arena reads it |
| --- | --- |
| `arena.separationM` | the guides start half of it from the centre on their bearings (else 2.5 km) |
| `arena.skyAt` | the box's clock time whose light the arena borrows |
| `arena.night`, `visibilityM` | as §6; `starShells` not drawn |
| side `headingDeg` | the start's course |
| side `formation` | every ship's place by `tools/check/wargames.mjs` layout()'s rule (the start agrees with it to the centimetre: smoke-arena checks it when the check is in the tree), then kept as station offsets on the threat axis as the start has it, about whichever ship is the guide |
| side `first` as a kit, `firstStation` | an airborne aircraft of the kit; the station the cut lands at |
| aircraft `airborne`, side `maxAirborne` | that many of the entry in the air at the start: the `cap` on its orbit, the rest in an opening strike on the way in with its escorts; never more than `maxAirborne` up |
| profiles | `cap` the patrol, `escort` with the waves, `strafe` in the waves with guns (§4.3), `dive`, `torpedo`, `level` the strikers (a level bomber dives like a dive bomber); `search` flies only when nothing else is left |
| admiral `waveSize` | the first launched wave's size |
| goal `types`, `weapon`, `by` | the types counted (a cruiser is ca or cl; the sentence says *cruisers*), only hits of that weapon, only hits by aircraft or a ship type of the side's |
| goal `rangeM`, `by` (reach) | the side's units `by` (any ship when none) within rangeM of an enemy ship of the goal's type |
| goal `outOfAction` | a sink of carriers that a carrier burning satisfies as well as one sunk (*put two carriers out of action by 6:40*) |
| goal `also` | more terms of a main goal, each its own state; met when all are, failed when any is; the sentence one per term (*… It sank two cruisers by 8:01.*) |

## 8. The balance

Written by the integrator (integrate-3, 27 October 2026); engine-3's own
measurements were lost with its last report. Measured with
`tools/smoke-arena.mjs`'s headless runs (20 seeds a side, the seeds 0–19
the gate uses, no player) and a scratch script beside it that also notes
when a game was decided and both sides' strength at 3:00. "Met" is the
side's main goal met within the clock in a run seeded for that side.

| scenario | side | on the merged tree | after | the game decided |
| --- | --- | --- | --- | --- |
| Samar | Japan | 100 % (20 of 20), decided at 4:19 median | **50 %** | after 6:00 in 20 of 20 |
| Samar | United States | 0 % (0 of 20), decided at 3:38 median | **45 %** | after 6:00 in 16 of 20 |
| Midway | Japan | 85 %, decided at 2:28 median | 100 % (not shipped) | before 4:00 in every seed |
| Midway | United States | 100 %, decided at 2:20 median | 100 % (not shipped) | before 4:00 in every seed |
| Ironbottom Sound | Japan | 100 %, decided at 4:14 median | 100 % (not shipped) | before 6:00 in most |
| Ironbottom Sound | United States | 0 % | 0 % (not shipped) | — |
| the fixture (test box) | Japan / United States | in the band (engine-3) | 55 % / 50 % | — |

Neither side's strength bar is under 0.48 at 3:00 in any Samar seed after
the tuning (it was at 0.08–0.34 before, when the carriers were going down
from 1:30).

**What moved Samar** (the scenario's admirals, `public/data/wargames/samar.json`):

- Kurita's admiral: aggression 0.7 → 0.2 (he keeps 5 km at first),
  `press` 0.6 (a new optional field: the aggression rises from 2:00 to
  the end, to 0.8 by 10:00, so the pressure grows and a game turns late),
  turn-away 0.5 → 0.81 (Taffy 3's air strikes can turn him: at 0.83 Japan
  met 35 %, at 0.86 20 %; at 0.80 the United States met 40 %).
- Taffy 3's admiral: a wave every 75 → 60 s (the contract's lower bound),
  the first wave 8 → 14, growing 30 → 45 % a wave. The size moved little
  (thirty in the air at most); the interval more.

**What moved every scenario** (the arena's own, `arena/params.js` and the
admiral):

- The AI's medium and heavy guns fire a salvo no oftener than every 45 and
  50 s (40 and 40 before): Samar's first carriers went down in the first
  two minutes to three-turret salvos from 3.6 km; the ranging floor and
  rate (tried at 30 % and 0.15) moved nothing measurable, the volume did.
- An admiral one ship short of a goal of several presses home instead of
  turning away (`admiral.js`): without it a quarter of Samar's games ended
  with Japan three carriers sunk and turned away, neither goal met.
- The AI's guns favour only a goal's terms still open (`ai.js`
  goalTypesOf): Ironbottom Sound's two cruisers sunk no longer draw
  Washington's guns from Kirishima.
- Strafing (the project manager's decision 34): AA at half for 10 s (0.4
  for 8 s) and an escort carrier launching nothing for as long.

**Why Midway and Ironbottom Sound are not shipped** (the project manager's
decision 30: their doors are hidden, their files kept). Nine admiral
settings for Ironbottom Sound and three for Midway (aggression 0 to 0.9,
turn-away 0.2 to 0.85, a launch every 70 to 90 s, waves of 6 to 10,
`press`, the light guns every 45 or 60 s) left both far outside the band. At Midway the two task forces start 5 km apart in a
6 km arena and the screens' heavy cruisers put the carriers out of action
with gunfire at 3 km inside three minutes, both sides' goals met in the
same game; a carrier duel needs either a larger arena or a stance that
keeps the surface ships off (a scenario field the contract does not
have). At Ironbottom Sound the United States must sink Kirishima (30 hit
points) and two cruisers while fourteen ships' 5-inch guns (56 hits in a
probed game) and torpedoes are on Lee's six; Kirishima is never sunk in
the clock. Both want a person to decide the scenario's shape, not its
numbers (research/engine-3.md §12).

## 9. Where the build departs from the contract, and why

A module may do more, never less, never differently; where the build does
more, or reads an unsaid detail one way, it is listed here.

1. **The AI's ranging walks in** (§4.2). The contract's exact lead and
   dispersion × 0.3 are kept; the ranging error on top is the arena's,
   because without it the first salvo at 5 km hit and a carrier was gone in
   26 s of every seed.
2. **The ships turn quicker than three times the rate alone**: the rudder
   time ÷ 3 and the yaw lag ÷ 10 beside the radius ÷ 3 and the mass ÷ 2
   (§3), and an arcade steering law in place of the record's helmsman.
3. **A shell's hit box is 1.5× the hull's length and beam at the hull's
   own height**, not a box 1.5× in height too: a shell clearing the deck
   is a miss, so the plunging fire of a 5 km duel falls about her rather
   than on an invisible roof.
4. **More than §1 asks of the sea**: smoke (a screen that drifts and
   hides, §6), the box's squalls brought into the arena, half a minute of
   smoke already laid by the weaker side's two layers at the start, ships
   chasing the salvos under fire, ships combing torpedo tracks, a ship
   dived on turning hard.
5. **A side whose goal is to keep its ships afloat keeps away** (5,200 m:
   it runs, as Taffy 3 did), makes smoke as it turns away, and sends its
   waves at the ships nearest its main body.
6. **Strafing** (content-3's profile, no entry in the contract's damage
   table) beats a ship's AA down for 8 s and does no damage; with nothing
   of the other side in the air, the patrol and the escorts strafe.
7. **The waves' size**: content-3's `waveSize`, or max(3, a sixth of the
   strike aircraft), × (1 + waveGrowth × the waves before); never more up
   than `maxAirborne` (30 when not given). The contract's 60–90 s is the
   scenario's `launchEveryS`; the first wave goes at 12 s.
8. **A side that has turned away** launches no more waves, fires only at
   what comes within 2.5 km, and calls its destroyers back.
9. **A magazine** (3 % of the hits of 330 mm and over; §4.1) is the
   arena's; the contract names the slow motion "on a magazine" and nothing
   that makes one.
10. **The phases' counts are the side's** (any of its units), not the
    player's alone: a phase met by a destroyer the player was not in is
    met. The contract's "the scenario's phases hand you a short goal"
    reads either way; the side's count keeps the phase line honest when
    the player hops.
11. **The end has four reasons**: the clock, both main goals resolved,
    a side with nothing left afloat or in the air ('annihilated'), or
    forced (`endNow`).
12. **The clock reads 0:00 to 10:00** (`m:ss`), the box's date and light
    behind it: the contract's goals say "before 10:00" of a ten-minute
    game, and a box hour would read as the record's.
13. **At the helm the captain also fires** (a click a salvo of the main
    battery on the pointer, T the torpedoes on its bearing), so a
    destroyer's torpedo attack and a battleship's duel are one station.
14. **The chase camera at the helm and the torpedoes** in a wargame, the
    bridge view hiding a 5 km duel; the backquote key cycles the stations
    there, since Tab is the hop.
15. **An aircraft on deck is takeable** (launched there and then), unless
    its carrier is burning or gone; **the other side's rows** carry
    `takeable: 'the other side'` and `enemy: true`.
16. **No after-card in a wargame**: a release leaves the box watching,
    and the end is the 'wargame-end' event with the result for the UI's
    end card.
17. **`scene.snapshot()` is a promise** of the data URL (the renderer
    keeps no drawing buffer, so the canvas is read just after the next
    frame), and the scene snaps the highlights itself.
18. **The scenario's side keys** are read as `japan` / `usa` or `jp` / `us`.
19. **content-3's fields are read** (§7), from the formation to the goals'
    further terms; a reach's own units are its `by` (content-3's reading,
    so the fixture says `by: 'dd'`), and `search` aircraft fly no mission.
20. **The views name the goal's own count `count` and the count so far
    `done`** (ui-3's HUD layer reads them so; `need` is kept beside), and
    each marker is also an event (`marker: true`, `target`, `text`,
    `mine`) where the HUD layer reads its markers; Battle does not send
    those to the page a second time.
21. **A test may hand Battle a scenario** (`globalThis.__wargameScenarios`)
    before content-3's files are in the tree; the dev page's
    `battle.html?wargame=<id>&side=<jp|us>&seed=` enters one with a panel
    of the hops, the stations, *Play again*, *Play the other side* and
    *End now*.
22. **The HUD's endurance is the kit's**: the arena flies no fuel.
23. **The AI fires at a pace** (§4.2): a salvo no oftener than every 30 s
    (guns under 150 mm) or 40 s (the rest), whatever the gun's reload, and
    torpedoes outside a destroyer attack no oftener than every 120 s. The
    contract says nothing of the AI's rate of fire; at the guns' own rates
    a ten-minute game was over in three. The player's guns keep their
    reload.
24. **The goal's type before the nearest** (§4.2): the contract's
    "nearest in arc, damaged first" is kept as the score, multiplied by
    0.55 for a ship of the type the side's goal names. Without it the
    battleships spent their salvos on the destroyers closing them, and
    Yamato at Samar fired on the escorts while the carriers ran.
25. **The range the admirals keep** is 5,600 − 3,000 × aggression (§5);
    the destroyers' attack at 4 km of the main bodies (contract) needs
    aggression 0.3 and over, so an admiral given less holds its destroyers
    back until it is losing after the fifth minute (contract).
26. **The AI's dive bombers walk the impact point on** and let go when it
    lies in the hit box (§5); its torpedo planes round to the beam again
    when a run goes wide. Behaviour the contract's "strike profiles
    compressed" leaves open.
27. **Slow motion is a second of the page's time** (the scene's clock),
    the arena's dt × 0.25 eased in and out: under SwiftShader at a frame or
    two a second it spans a frame or two; on a real GPU about sixty.

## 10. Looked at, and measured

Under SwiftShader (`battle.html?wargame=<id>&side=<jp|us>`, the page at
a frame every 80 ms for the fixture and Samar), with the battle paused for
each picture and the camera set by hand; `node tools/smoke-arena.mjs
--looks` takes the same pictures into `tools/shots/arena-look-*.png`.

- **Yamato's main battery on a carrier at 4.9 km** (Samar, Japan, 0:05):
  the salvo's flashes and their glow on the water from astern and abeam;
  the fall nine seconds later about Gambier Bay, white columns spread
  wide over a kilometre (the first salvo's 40 % ranging error), the
  carriers' Wildcats and Avengers a swarm overhead. Splashes read plainly
  from 1.3 km, thinly from 2.6 km and against the sun.
- **A Wildcat in a dogfight with a Zero** (the fixture, 4:04): the FM-2 in
  a hard bank, the A6M5 ahead at 350 m; from behind the Zero, the Wildcat
  on its tail, the flak of the fleets' AA about them.
- **A torpedo hit with the slow motion** (the fixture, the United States,
  Test Destroyer B's spread at 2.4 km, 2:32): the scene's factor at 0.25
  in the frame of the hit, the column rising at Test Carrier A's bow, her
  fire's smoke; the HUD's line *Test Carrier A: torpedo hit amidships,
  fire*. The column first stood at the hull's middle, hidden inside her:
  moved to the struck side (§4.1).
- **A carrier burning and going down** (the fixture, Test Carrier A,
  1:21–1:41): burning with dark smoke at 1 s, listed and down by the bow
  with her flight deck awash at 13 s, gone under her smoke at 18 s. At
  Samar a CVE at 2 hit points was looked at paused: no smoke, because the
  effect's fire columns are emitted per frame from `state.fire` and a
  paused page emits none (not a fault of the arena's).
- **The arena from the orbit camera with both fleets** (Samar, 0:40, 8.5
  km out): Kurita's columns, Taffy 3's carriers in their circle, the two
  smoke layers' screens, the air full of Taffy 3's aircraft. At first every
  carrier sat in a white blob of the screen effect (the carriers' own
  smoke): changed to their funnel trail (§6).
- **The entries**: Samar as the United States (Johnston at the helm,
  0:00): the first picture was fog (the chase camera inside Johnston's own
  pre-start smoke): fixed (§6); Midway as the United States (an SBD at
  1,500 m over the task forces); Ironbottom Sound as Japan (Kirishima's
  main battery, the night, Gwin at 2,389 m with the lead diamond).
- **The browser part of the gate** on the fixture (tools/shots/arena-*.png):
  the entry as the United States in an Avenger, a hit and its marker, the
  slow motion at × 0.38–0.44 on a tick, two snapshots of 320 × 200 JPEG,
  the forced end, Play the other side into Test Battleship A and a hop to a
  Kate (the keys and hints now the aircraft's, the last game's end line
  gone); no console error; 74–80 ms a frame under SwiftShader, 66 draw
  calls, 43,500 triangles, 38 MB of heap.

Not looked at: a person flying the arena at 60 frames a second; Midway's
and Ironbottom Sound's fights past the entry (their balance runs only).

## 11. What the integrator must wire

1. **link.js to the real Battle** (ROUND-3 §5): `onWargame(id)` opens
   ui-3's start sheet; `onWargameStart(side)` calls
   `battle.enterWargame(id, { side, from: 'table' })` (or `'url'` from
   `#wargame=<id>&side=<jp|us>`); `onWargameRestart(side)` calls
   `battle.restart({ side })`; `onHop(kind | index)` calls
   `battle.hop(kind | index)`; *Back to the table* is `battle.endNow()`
   if the game runs, then `battle.leave()`. A unit picked in the list or
   the box in a wargame is `battle.hop(index)` for the played side's.
2. **The HUD layer reads the arena** (`battle.arena`, or `battle.sim`
   while a wargame runs) each frame: `strength.jp.fraction`, `tally`,
   `objective` (`text`, `done`, `count`, `line`, `status`), `phase`
   (`title`, `text`, `leftS`, `done`, `count`, `line`, `status`), `t`
   and `clock.label(t)`; the markers from `arena.events` entries with
   `marker: true` (`target` is the slot: project `state.pos` with
   `battle.scene.hud.project(x, y + 25, z)`), or from `arena.markers`;
   the respawn line from the 'respawn' event's `text`.
3. **The end card** on the 'wargame-end' 'battle' event (or
   `arena.result`): `result.line` (or `text`), `result.met[side]`,
   `result.goals.jp/us.sentence`, `arena.tally`, `scenario.footnote` and
   `label`; the reel from `arena.highlights` with their `snapshot` (a
   JPEG data URL once the scene has it: it is filled a frame after the
   highlight; `scene.snapshot()` itself returns a promise).
4. **Balance content-3's scenarios** with the headless runs (§8 has
   them as measured and what moves them); `tools/smoke-arena.mjs` reads
   `public/data/wargames/*.json` once they are in the tree and holds each
   to the band.
5. **Check the start against layout()**: smoke-arena imports
   `tools/check/wargames.mjs` when it is there and fails a ship more than
   a metre from her place.
6. **Re-run** `tools/smoke-battle.mjs --browser-only` and
   `tools/smoke-arena.mjs` on the merged tree (the dev server's port by
   `PORT=`), and fold §2 into ENGINEERING.md and §7's table into DATA.md
   beside content-3's.

## 12. What is not finished, and needs a person

- **The balance of the real scenarios** (§8): Samar sits in the band
  (50 % and 45 %) and ships; Midway and Ironbottom Sound do not, and
  their doors are hidden until a person decides their shape (Midway's
  arena or a stance for the screens; Ironbottom Sound's US goal).
- **Star shells** are not drawn; at night only `visibilityM` acts.
- **Level bombers dive** like dive bombers; there is no level bombing run.
- **A person flying it**: the arcade numbers (§3) and the AI's ranging
  (§4.2) were set by the headless runs and by looking under SwiftShader at
  about a frame a second; how the aircraft feel at 60 frames, and whether
  a duel's straddles read as straddles, wants hands on a real GPU.
- **Performance in the browser on a real GPU** is unmeasured: Midway's
  wargame draws some 45 ships and up to 60 aircraft at once from 373 on
  the decks (instanced per kit, as the record's).
