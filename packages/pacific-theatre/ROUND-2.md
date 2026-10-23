# Round two: free take-over, assisted flight, the prologue front

The owner played the first build and asked for three things. This file is
the contract for the round: the design (§1–2), the engineering (§3–6), the
data (§7), the checks (§8) and who builds what (§9). It adds to DESIGN.md,
ENGINEERING.md and DATA.md and wins where it differs from them; the
integrator folds its "as built" into those files at the end.

## 0. What the owner asked for

1. *"Instead of discrete actions, a playable and watchable simulation of the
   whole day will feel more cohesive. You should be able to watch and select
   any unit on either side and take control. Some units may have multiple
   stations to switch through."*
2. *"The Japanese plane was very difficult to fly. That might be realistic,
   but I don't want to alienate casual players."*
3. The prologue: Korea, Formosa and Manchuria read as if Japan were only
   beginning to take them, because the front has no keyframe before
   6 December 1941 and the slider runs from 1931.

## 1. Design

### 1.1 Any unit, any time, either side

The box already runs the whole battle as the record tells it, from the
clock's `from` to its `to`. The moments were the only doors in. Now every
unit is a door:

- **Select.** A click (or tap) on a ship or an aircraft in the box selects
  it; so does picking it from the **unit list**, a panel by side (ships,
  then air groups, in the record's order) that greys what cannot be taken
  and says why in three words ("fate is fixed", "hospital ship", "tokkō
  unit", "on the ground", "not yet airborne"). The camera follows the
  selection; a bracket marks it. Selecting never changes the sim.
- **The unit card** (the card's seventh mode, `unit`): the name in both
  languages, the kit's short name, the side, what the record has it doing
  now and next ("steaming 310° at 20 kn; at 07:57 she is hit by two
  torpedoes" from the unit's events and track, in the voice of the stops),
  its state (afloat, listing, on fire; airborne, height, fuel), and the
  stations it offers, each a button: **Take the controls** at the current
  time, at that station.
- **Stations.** A ship: *helm* (the bridge), *main battery* (the director
  with its sights), *anti-aircraft* (the AA director: aim the ship's AA at
  an aircraft) and, where the kit has tubes, *torpedoes*. An aircraft:
  *pilot* and, where the kit has a crew of two or more with a rear gun,
  *gunner*; a level bomber on its run-in also *bombardier*. Tab (or the
  station bar) switches; the stations you are not at are run by the AI as
  they are now, holding the course or the target you left them on.
- **Release** (Backspace, or the bar) gives the unit back. A unit you did
  not change returns to the record; a unit you did change keeps the AI
  driving it from where you left it (the saved carrier's rule generalised),
  and the record's events that named it as cause or target stay unscripted.
- **Moments become bookmarks.** The twenty-three curated sorties stay, as
  marks on the box's bar ("the record's turning points") that select the
  unit and the station and start where they always did, with their
  objective, beats, checkpoint and after-card. A visitor who wants a shaped
  sortie still has one; a visitor who wants the day has the day.
- **The after-card** opens whenever you release (or your unit's fate
  resolves): *Your sortie* from the time you took the controls to the time
  you let go; *Your battle* is what left the record while you held them, in
  the sim's words only; *The record* is the unit's own record over that
  span (its events, in the stops' voice); *What came next* as now. A
  bookmark's after-card keeps its written `after` text.
- **Watching stays the default.** Nothing prompts you to take anything.

### 1.2 Assisted flight, the default

Two settings, on the box's bar and the briefing, kept in the browser:
**Assisted** (default) and **Pilot**. No sliders.

- **Assisted flight** (aircraft, the player's only): coordinated turns (yaw
  follows roll), a bank limit of 60° and pitch limits of +25°/−30°, an
  angle-of-attack limiter in place of the stall, an overspeed limiter in
  place of the break-up, the nose held level and the height held when the
  stick is centred, the instructor's gains scaled down with speed, and a
  **floor**: the assist will not fly you into the ground or the sea (60 m
  over land, 15 m over the sea, suspended only on a weapon run below).
  Keyboard and touch get the same.
- **Assisted weapons**: approaching a drop or a release (a torpedo run's
  last 1,500 m; a dive's last 800 m of height; a level run's last 20 s)
  the assist settles height and speed into the envelope while you steer,
  and the cue says *release now* through a window twice the record's. In
  Pilot the envelope and the window are the record's.
- **Half time for aircraft.** Taking an aircraft runs the sim at 0.5× by
  default in Assisted (the ships keep their record; the whole battle slows),
  so a run-in lasts long enough to learn. The speed control offers ×0.5,
  ×1, ×2 for aircraft; the threat-interrupted drop-back works as now.
- **The first take-over shows the controls once**: four lines on the HUD
  for eight seconds (stick, throttle, fire or release, Backspace to give the
  controls back), then never again in that session.
- **A gentle first door.** Each box names one easy take-over on its
  briefing, *Start here*: at Pearl Harbor a P-40 over Haleʻiwa with nothing
  to release (or a destroyer's helm), at Midway a Wildcat of the CAP, at
  Ironbottom Sound Gwin's helm, off Samar Johnston's helm. The torpedo run
  comes after.
- **Ships are not hard** and keep their controls; Assisted adds only
  "hold course" when the helm is centred, which they nearly have.

### 1.3 The prologue front

Six keyframes before 6 December 1941, schematic, by the hand-region method
the 1942 keyframes use, each with its sources: **1931-09-18** (the eve of
Mukden: Korea, Taiwan, Karafuto, the Kwantung leased territory and the
South Manchuria Railway zone, the Mandate islands), **1932-03-01**
(Manchukuo proclaimed: Manchuria held), **1937-12-31** (after Marco Polo
Bridge: Jehol, Chahar and Hebei, the Shanghai–Nanjing corridor, Shanxi's
railways), **1938-12-31** (Wuhan and Canton taken: the coast and the
railways of eastern China), **1940-09-30** (northern Indochina garrisoned),
**1941-07-31** (southern Indochina garrisoned). The prologue chapter's
keyframe becomes 1931-09-18, so the map moves through the prologue and the
word "beginning" never reads where a thing was done.

## 2. The rules that hold

- Nothing that is a person is a target; the never-list of DESIGN.md §7.4
  and R8 §5 governs every new string (the unit list's reasons, the unit
  card, the station names, the HUD's hints, the after-card's new parts).
- **Never takeable**: a `fixed` unit (Arizona, Oklahoma, Utah), a `hospital`
  unit, a `tokko` unit, a parked aircraft, an aircraft before its take-off
  or after its landing, a unit past its fate, a site, and the named leader's
  aircraft of a group (index 0; `namedCrews` groups give a spare). The
  reason is shown; the button is not.
- **Targets**: the AA station and the gunner fire at aircraft only; the main
  battery and torpedoes at ships only; a fighter's guns at aircraft, parked
  aircraft and hangars, never at a site with `target: false`, never at
  anything in the water that is not a ship. A hit on a ship past her fatal,
  a hospital ship or a sunk ship registers nothing, as now.
- Nothing outside the box moves; the settings are the only thing the
  browser keeps.

## 3. Engineering: the sim (`src/battle/sim/`)

- `sim.units()` → `[{ index, id, kind: 'ship' | 'aircraft', side, name, ja,
  kit, group, alive, takeable: true | string, stations: string[], now:
  string, next: string }]`, cheap, for the list and the card. `takeable` is
  the reason when false (the words of §1.1). `now`/`next` are built from the
  unit's track, station or route and its events, in the stops' voice; an
  aircraft's from its group.
- `sim.takeControl(role)` accepts `{ unit, station }` for a ship, `{ group,
  station }` or `{ group, index, station }` for an aircraft (never index 0;
  `namedCrews` as now), at the current `sim.t`; it throws with §2's reason
  when not takeable. `sim.setStation(name)` switches; the AI keeps the other
  stations (helm holds course and speed; main battery keeps its target; AA
  keeps firing by the hazard model; the pilot flies the record's path or,
  if diverged, the AI's).
- `sim.releaseControl()`: a unit untouched by input (no non-zero level or
  counter since the take) returns to the record and `diverged` is
  unchanged; a touched unit stays AI-driven on the sim's models from its
  state (`touch()` records it as now), and the record's events naming it
  stay unscripted.
- **Stations**, derived by rule from the kit, overridable by `kit.stations`:
  ship → `helm`, `main` if it has a main battery, `aa` if it has AA mounts,
  `torpedoes` if it has tubes; aircraft → `pilot`, `gunner` if crew ≥ 2 and
  the kit has a rear gun (`guns` with `arc: 'rear'` or the type is torpedo,
  dive or level and crew ≥ 2), `bombardier` if the type is level.
- **The AA station**: `player.input.aimAz/aimEl` (or `aa` as a point) aims
  the ship's AA at an aircraft; the mounts that bear fire real tracer
  (effects) at the aim point, and hits on the aimed aircraft are drawn from
  the hazard model with the ship's λ concentrated on it, scaled by the
  player's lead error (a cone: full at 0 mil, zero beyond 40 mil for the
  heavy mounts, 80 for the machine guns). An aircraft the player fires at is
  touched (the player is cause): its fate is the sim's, and its scripted
  attack obeys the group rule as now.
- **The gunner station**: the rear gun aimed with the mouse, same resolution
  against fighters attacking the player's aircraft; the pilot flies on.
- **The bombardier station**: the level sight (a drift line and the
  predicted impact from the ballistics module), `bombCount` releases the
  stick; the pilot station holds the run-in.
- **Assist** (`sim.assist = 'assisted' | 'pilot'`, default assisted,
  `params.js`): applied in the player's aircraft physics step only, as
  limits and holds on the commanded state, never on the record's aircraft;
  the floor samples the ground as `record.js` does now; the weapon envelope
  assist reads the current objective's profile (a bookmark's) or the
  kit's default for the station's weapon. In `pilot` the step is today's.
- **Time**: `timeScale` may be 0.5; `Battle.play` and `maxScale` take it;
  the aircraft list is `[0.5, 1, 2]` in Assisted and `[1]` in Pilot; a
  take-over of an aircraft sets 0.5 in Assisted. The ship list stays.
- **Score and outcome** over a sortie span `[tTake, tRelease]`:
  `sim.sortie` holds the span, the unit, hits, releases, damage taken,
  survived, and `divergedDuring` (the units that left the record in the
  span, with the reason). A bookmark's checkpoint logic is unchanged.

## 4. Engineering: the scene, the controls and Battle

- **Picking** (`scene/pick.js`): on click or tap, the nearest unit within
  24 px of the pointer by its projected position (ships by hull, aircraft by
  slot), a bracket on the selection, the orbit camera following it;
  `scene.select(index | null)` and `scene.selected`.
- **HUD**: a station bar (the stations, the active one marked; Tab cycles),
  the first-take hints (§1.2, `localStorage` `pt.hints`), the AA and
  gunner reticles, the level sight, the release cue's window.
- **Controls** (`controls/`): Tab to switch stations (and the bar); the AA
  and gunner stations aim with the mouse (relative, with lock) or touch
  drag; `bindings.js` gains them; touch gains the station bar and a fire
  button at the gun stations.
- **Battle** (`index.js`): `select(index)`, `take({ unit | group, station,
  t? })`, `setStation(name)`, `release()` (opens the after-card through
  `link.js` with `sim.sortie`), `bookmarks` (the moments), `takeMoment` as
  now, `assist` get/set (persisted by App), `firstDoor` from the battle
  file. Watch keys gain the list (L), the unit card (Enter on a selection)
  and Tab. `state` gains `selected`, `station`, `assist`, `sortie`.

## 5. Engineering: the UI (`src/ui/`, `src/link.js`)

- `ui/unitlist.js`: the panel by side, greyed rows with reasons, filter by
  kind, keyboard-navigable; opens from the bar (Units) and L.
- `ui/card.js` mode `unit` (§1.1), fed by `link.js` from `sim.units()` and
  the battle file; the station buttons call `battle.take`.
- `ui/boxbar.js`: Units, the station bar when a unit is held, the speed
  list per kind, the bookmarks as marks on the stop strip (hover: the title;
  click: select and start), Assisted/Pilot.
- `ui/briefing.js`: *Start here* (the first door) before the bookmark
  list; the setting's one-line explanation.
- `ui/after.js`: the span in the title ("At the controls of a Dauntless of
  Bombing Six, 10:21–10:24"), the four parts as §1.1; the bookmark's
  `after` text where there is one.
- `link.js`: `onSelect`, `onTake(role)`, `onStation`, `onRelease`,
  `onAssist`, `onFirstDoor`; the after-card from `sim.sortie`; the URL gains
  `unit=<id>&station=<name>` for a held unit (a bookmark keeps `moment=`).

## 6. Engineering: tests (`tools/`)

- `smoke-battle.mjs` part 4, **random take-overs**: seeded, in all four
  boxes, 12 per box across both sides and every station type, 20 s each of
  scripted input, then release; assert the sim finite, no console error,
  the after-card data complete, a touched unit AI-driven after release, an
  untouched one back on the record, `diverged` empty for an untouched box.
- Part 5, **casual hands**: in Assisted, a scripted casual pilot (bank ≤
  30°, pitch within ±10°, throttle 0.7, steering toward the objective by
  bearing only, release on the cue) completes every aircraft bookmark and
  8 random aircraft take-overs per box without a crash and reaches each
  bookmark's checkpoint; in Pilot the same script is allowed to fail. Part 3
  (every bookmark with the old autopilot) must still pass in Pilot.
- Part 6, **stations**: a sample of ships at each station, scripted input,
  finite, the AI holding the other stations.
- `replay.mjs` unchanged and green; `record-heights.mjs` unchanged.
- `smoke.mjs`: the unit list opens, a row selects, the unit card offers the
  stations, Take the controls works on a real box, the setting persists,
  the bookmarks mark the strip, the prologue front moves between 1931 and
  1941 (the state at Mukden differs from the state at 1941-12-06).

## 7. Data

- **battle.json** (DATA.md §9) gains `firstDoor: { role: { kind, unit |
  group, station }, t, title, text }` per box; `namedCrews` and the
  not-takeable flags are as they are (nothing new to add: takeability is
  derived by §2's rules). Optional `unit.takeable: false` with `why` where
  the rule cannot know (none expected in v1).
- **kits** (DATA.md §8): optional `stations: [...]` override; `guns[].arc:
  'rear'` where a kit has a rear gun (the engine adds it to the aircraft
  that have one: B5N2, D3A1, D4Y1, B6N2, SBD-3, SB2U-3, TBD-1, TBF-1,
  TBM-1C, E13A1, F1M2, PBY-5, B-17E, B-26, B-18, A-20).
- **fronts** (DATA.md §6): the six prologue keyframes of §1.3 in
  `fronts/manifest.json` with their sources and notes; `chapters.json`'s
  prologue keyframe `1931-09-18`; `tools/check/ids.json` keyframes are
  frozen with them (done by the project manager with this file).
- **Sources** for the prologue front (content-2 reads and cites them): the
  Green Books (Morton, *Strategy and Command*, ch. 1–2 and Map 1; Romanus
  and Sunderland, *Stilwell's Mission to China*, Map 1 "The Japanese in
  China, 1941"), Japanese Monograph 144 (*Political Strategy prior to the
  Outbreak of War*) for the dates, the Lytton Report's map (1932, public
  domain) for Manchuria, and the State Department's *Peace and War* (1943)
  for Indochina; Wikipedia only to find them.

## 8. Checks

- `tools/check/battle.mjs`: `firstDoor` present, its role takeable by §2 at
  its `t`, its station one the kit offers; every bookmark's role still
  valid; the not-takeable rules recomputed and every unit the list would
  grey has a reason.
- `tools/check/kits.mjs`: `stations` overrides within the vocabulary
  (`helm`, `main`, `aa`, `torpedoes`, `pilot`, `gunner`, `bombardier`);
  `arc: 'rear'` only on aircraft with crew ≥ 2.
- `tools/check/fronts.mjs`: the fourteen keyframes in order; the prologue
  ones schematic with sources; Korea, Taiwan, Karafuto and the Mandates
  `held` on every keyframe; Manchuria `held` from 1932-03-01; the
  garrison test unchanged.
- The voice rules on every new string (the words check runs over the new
  files too).

## 9. Who builds what (three worktrees, then one integrator)

| workflow | owns (only these) | runs on |
| --- | --- | --- |
| **engine-2** | `src/battle/**` (sim, scene, controls, index.js), `tools/smoke-battle.mjs`, `tools/fake-battle.mjs`, `tools/check/kits.mjs`, `public/data/kits/*.json` (the `arc: 'rear'` guns), `research/engine-2.md` | the real boxes through `battle.html` and the smoke test |
| **ui-2** | `src/ui/**`, `src/link.js`, `style.css`, `index.html`, `src/app.js` (the setting's persistence and the URL's `unit`/`station` only), `tools/smoke.mjs`, `tools/shoot.mjs`, a dev page `ui.html` with `src/ui/mock-battle.js` (a stub of §4's Battle API over the real `sim.units()` shape, not in the build), `research/ui-2.md` | the mock on the dev server, and the real table |
| **content-2** | `tools/fronts/**`, `public/data/fronts/**`, `public/data/chapters.json`, `public/data/sources.json` (additions), `public/data/boxes/*/battle.json` (`firstDoor` only), `tools/check/fronts.mjs`, `tools/check/battle.mjs` (the `firstDoor` rules), `research/content-2.md` | its own checks and the built table |

Merge order: content-2, engine-2, ui-2; then **integrate-2** wires
`link.js` to the real Battle, runs every gate (§6, §8, replay, smoke on
real data), folds the "as built" into DESIGN/ENGINEERING/DATA, rebuilds
`dist/`, and reports. The same trailers, commit style, no push, no
`package-lock.json` as before.
