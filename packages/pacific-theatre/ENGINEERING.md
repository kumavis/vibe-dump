# Engineering contract

How the package is laid out, what each module promises the others, and who
builds what. `DESIGN.md` says why, `DATA.md` says what the data is; this
file is the seam between parallel builders who cannot talk to each other.
Every interface here is a promise: a module may do more, never less, and
never differently. R9's audit of the Hawaiian code (RESEARCH.md §9) is
behind most of the numbers; where this file and the staged Hawaiian source
disagree, this file wins and the source is adapted.

## 0. Ground rules (from `CLAUDE.md`, restated where they bite)

- Three.js `^0.160.0` (the root lockfile has 0.160.1); Vite via the shared
  config; relative asset paths; no runtime network; `public/data/` committed.
- No cross-package imports. Code taken from `holo-i-ke-au` is copied with its
  provenance noted in the commit message and in the file's header comment.
- `npm run build && npm run verify` before every push; `dist/` committed;
  the lockfile in its own commit.
- The app must boot and draw the table under SwiftShader (the thumbnail and
  the smoke test run there); a battle may be slow there but must not throw.
- Plain ES modules, no TypeScript, no build-time code generation. One
  renderer, two scenes, one scene drawn per frame.
- Dependencies pinned: `three ^0.160.0`, `geotiff 2.1.3` exactly (R1's
  curl-backed client is proven against its 2.x `BaseClient`; 3.x is an
  untested rewrite), `shapefile 0.6.6`, `subset-font 2.4.0`; the lockfile
  change is its own commit.

## 1. Layout

```
packages/pacific-theatre/
  package.json  vite.config.js  index.html  main.js  style.css
  battle.html                      dev-only entry: boots straight into a box on the Vite dev server (not in the build)
  DESIGN.md  DATA.md  ENGINEERING.md  RESEARCH.md  ACCESS.md  FONTS.md
  research/                        the research reports and each workflow's notes (content.md, engine.md, battles.md)
  public/data/                     DATA.md (kits/{ships,aircraft,weapons}.json among them)
  test-data/                       fixtures from tools/fake-data.mjs (gitignored at the root)
  src/
    config.js                      per-scene units and limits, exaggeration curves, budgets, URL params
    geo.js                         wrapLon, TangentProjection, TableProjection, projectionFor, placement, poseToTable/poseToBox
    time.js                        parseInstant, spanOf, formatWhen, WarClock, BattleClock
    data/                          load.js (manifest, gazetteer, clocks, fronts, boxes, loadBox), decode.js, image.js, worker.js  [copied, adapted]
    render/                        shared: pack.js, camera.js, sky.js, stars.js, pipeline.js, lines.js, routes.js, ocean.js, shadow.js,
                                   shaders/common.glsl.js, shaders/ground.glsl.js, shaders/logdepth.glsl.js, shaders/ocean.glsl.js  [copied, adapted]
    table/                         ground.js (TableGround over one PackTerrain), relief.js (the shader), coast.js, labels.js (DOM),
                                   front.js, index.js (TableScene)
    battle/
      sim/                         pure JS, no three.js import anywhere in this directory
        clock.js  rng.js  world.js  units.js  tracks.js  aircraft.js  ship.js  guns.js  torpedoes.js
        aa.js  cap.js  sight.js  damage.js  events.js  moments.js  score.js  outcome.js  index.js (createSim)
      kits/                        builder.js (the Hawaiian features/kit.js Builder, scale 1, a lofted hull), ships.js, aircraft.js,
                                   palette.js, insignia.js (one atlas), blocks.js
      scene/                       box.js (BoxScene), terrain.js (BoxGround), sea.js, weather.js, units.js (instanced renderers),
                                   effects.js, cameras.js, hud.js, terrain.glsl.js
      controls/                    input.js (levels and counters), keyboard.js, mouse.js, touch.js, bindings.js
      index.js                     Battle: the box's lifecycle (enter, watch, scrub, play, takeMoment, keepGoing, release, leave)
    ui/                            dom.js, icons.js, card.js, timeline.js, tour.js, pins.js, briefing.js, after.js, ui.js
    fonts/                         Fraunces, Inter (copied) and a Noto Sans JP subset, one weight (FONTS.md)
    app.js                         App: renderer, the light bag, one Sky, the two scenes, app.mode, the hand-over, the URL, the frame loop
  tools/
    bake-table.mjs  bake-box.mjs  check-data.mjs  check/  smoke.mjs  smoke-battle.mjs  shoot.mjs  subset-font.mjs  fake-data.mjs  fake-battle.mjs
    test-geo.mjs  test-time.mjs  test-sky.mjs   node checks of geo.js, time.js and sky.js's ephemeris (Stage 0; every workflow runs them)
    lib/                           fetch.mjs, png.mjs, raster.mjs, geo.mjs (a copy of TableProjection), simplify.mjs, etopo.mjs, cog.mjs, ne.mjs
```

## 2. Units, frames, precision and depth

- **Table scene**: world units are kilometres (`proj.unit = 1000`); x east,
  z south, y up; the pack covers `manifest.table.extent`. Heights are metres
  in data, on the CPU and on the GPU; the only conversion to world y is
  `ground.vert = exaggeration / proj.unit` (never a literal 100).
  `config.TABLE.exaggeration(distance)` eases from the box's value at the
  hand-over distance to about 30 with the whole theatre in view; the
  table's normals are baked at an exaggeration of 16 to 20 so the abyssal
  plain does not band.
- **Box scene**: world units are metres (`proj.unit = 1`), origin at the
  box's `lon0, lat0`, x east, z south, y up. The box's exaggeration is one
  constant (`boxes/manifest.json` `exaggeration`, default 1.0) used by the
  renderer and by the sim alike; it never varies with the camera, because
  the terrain the aircraft collides with must be the terrain on screen.
- **Model frame**: metres; bow or nose toward −z at heading 0; origin at the
  waterline amidships (ships) or the centre of gravity (aircraft). Headings
  and courses are compass degrees in data and sim; yaw about +y is −heading
  in radians. Speeds in the sim are m/s; data has knots and km/h and
  `sim/units.js` converts once at load.
- **Precision**: float32 resolves 0.5 m at the table's edge and 1.6 cm at a
  400 km box's edge, which is fine for storage and drawing. The sim
  integrates positions in **Float64Array**: float32 rounding of a 1/60 s
  step is systematic (R9 measured −9 % at 2 knots, and no motion at all
  below 0.9 knots, 150 km from the origin). Instanced renderers write
  instance matrices camera-relative each frame (the camera position
  subtracted in JS, the `InstancedMesh` placed at the camera) so the
  player's own aircraft does not shimmer.
- **Depth**: one `WebGLRenderer({ logarithmicDepthBuffer: true })` for both
  scenes. three r160 defines `USE_LOGDEPTHBUF` in every `ShaderMaterial` but
  adds no code, so **every `ShaderMaterial` drawn into a scene includes the
  four chunks of `render/shaders/logdepth.glsl.js`** (fullscreen passes
  with depth test off do not); the smoke test asserts every scene
  material's compiled source contains `vFragDepth`. `polygonOffset` does
  nothing under log depth, so lines and routes rely on their lift. The
  composite pass decodes distance as `exp2(depth · log2(far + 1)) − 1`.
  Near 0.5 m, far 450 km in a box; near 0.1 km, far 50,000 km on the table;
  the rigs clamp to these. Measure frame time before the first sortie; the
  fallback, if log depth is too slow on an integrated GPU, is a moving near
  plane in watch mode and a two-pass split for the bridge and chase cameras
  only.
- **Time**: the sim steps 1/60 s of battle time; `advance(dt)` runs whole
  steps, at most 8 per call, and carries the rest in `sim.lag` (the battle
  slows rather than the frame stalling under SwiftShader). All randomness
  comes from `sim/rng.js`, seeded from the battle id and the moment id, so a
  sortie replays.

## 3. The projection interface (`src/geo.js`; imports nothing, so the sim may use it)

```js
export function wrapLon(lon, lon0) → lon in [lon0 − 180, lon0 + 180)
export class TangentProjection {                 // a box (DATA.md §1), and the Hawaiian Projection generalised
  constructor({ lon0, lat0, unit = 1 })
  kind = 'tangent'; lon0; lat0; unit             // unit: metres per world unit
  toWorld([lon, lat]) → [x, z]                    // an array, as every Hawaiian caller destructures it
  toLonLat(x, z) → [lon, lat]                     // lon in [lon0 − 180, lon0 + 180)
  scaleAt() → 1; convergenceAt() → 0
  rect([w, s, e, n]) → { x0, z0, x1, z1 }         // outer texel edges, row 0 north
}
export class TableProjection {                   // the table: kind 'aeqd' (v1), 'laea' or 'equirect'
  constructor({ kind, lon0, lat0, unit = 1000 })  // Snyder's spherical forms, R = 6,371,008.8 m
  toWorld, toLonLat                               // as above
  jacobianAt([lon, lat]) → [[dx/dE, dx/dS], [dz/dE, dz/dS]]   // world units per metre east and per metre south
  scaleAt([lon, lat]) → sqrt(|det J|) · unit      // the areal scale factor, 1 at the centre
  convergenceAt([lon, lat]) → degrees             // atan2(J[1][0], J[0][0]): grid north to true north; −15.0° at Midway, −17.1° at Pearl Harbor, +1.2° at Guadalcanal, +2.7° at Samar
}
export function projectionFor(desc) → TangentProjection | TableProjection
export function placement(box, table) → {         // box: a boxes/manifest.json entry; table: the TableProjection
  centre: [x, z], J, Jinv, scale, alpha,          // J through the box's tangent plane; scale = sqrt(|det J|) km per m; alpha in radians = convergence (the box's north)
  toTable([x, z]) → [x, z], toBox([x, z]) → [x, z],
  matrix: Float64Array(16)                        // box metres → table km, column-major, y scaled by `scale`
}
export function poseToTable(pose, pl) / poseToBox(pose, pl)   // pose = { target: {x, y, z}, distance, yaw, pitch }:
                                                  // target by toTable/toBox; distance × or ÷ scale; yaw − or + alpha
export function geometryPoint(geometry)           // the Hawaiian one, called on normalised coordinates only
```

`data/load.js` normalises every longitude in places, events, routes, fronts,
labels and coast with `wrapLon(…, table.lon0)` once at load, and every
longitude in a `battle.json` with the box's `lon0`; no other module sees a
raw longitude. `describePack` uses the manifest's `extent` for the table
pack and `proj.rect(bounds)` for a box pack. The bake writes `placement`
from the same formulas (`tools/lib/geo.mjs` holds a copy of
`TableProjection`), and `check-data` recomputes it.

## 4. The clock (`src/time.js`)

Instants are ms UTC. Zones are ISO offsets (`+09:00` Tokyo; `-12:00` is the
US Navy's "zone +12"; `-10:30` Hawaiʻi in 1941); data never writes the navy
form in a `zone` field, only in a clock's `name` (`clocks.json`).

```js
export const DAY = 86400000
export function zoneMinutes(zone) → minutes east of UTC; throws on anything but ±HH:MM or Z
export function parseInstant(s, { zone }) → ms     // YYYY[-MM[-DD]] = the start of that period in `zone` (UTC if none);
                                                  // YYYY-MM-DDTHH:MM[:SS](Z|±HH:MM) exact; a time with no offset throws
export function spanOf(when) → [from, to)          // widened by precision: minute, hour, day, month, year
export function formatWhen(when, { zone }) → "4 June 1942, 10:22 (UTC−12)"
export class WarClock {                           // the table's time; owned by App
  constructor(chapters, { prologueShare = 0.1 })
  s                                               // the slider, 0..1: the prologue in [0, prologueShare], the war's days linear after
  date; dateAt(s); sAt(ms); setDate(ms); setS(s); onChange(fn)
  chapterAt(ms) → chapter
  windowAt(ms) → [from, to]                       // ±clamp(chapter length / 8, 7 d, 21 d); in the prologue, the whole prologue
  frontPair(ms) → { a, b, t }                     // the front keyframes either side, and 0..1 between (for the cross-fade)
}
export class BattleClock {                        // a box's time; owned by the sim
  constructor({ zone, from, to })                 // battle.json clock
  t                                               // seconds since `from`
  parse('10:22' | '10:22:30' | '24:07' | iso) → seconds since `from`   // HH:MM on the date of `from` in `zone`; 24:xx the next day
  utc(t) → ms; label(t) → '10:22'; dateLabel(t) → '4 June 1942'
}
```

While a box is open the WarClock stays at the battle's date and the
timeline bar is hidden; the HUD shows the battle clock. Pins, routes and
the tour sort by UTC instant and show each card in its own zone. The
Hawaiian `time.js` is replaced, not patched: it keeps only eras with a
numeric year and reads `10:22` as the year 10.

## 5. The sim (`src/battle/sim/`)

No `three` import. Pure data in, typed arrays out.

```js
export function createSim(battle, kits, { seed, warn, ground }) → sim   // ground: the decoded box pack (§7), for collisions and AA lines of sight
sim.clock                           // BattleClock
sim.setTime(tSeconds)               // jump; every unit is placed on its track at t, every event up to t applied (O(units) while !sim.diverged)
sim.advance(dtBattleSeconds)        // whole steps of 1/60 s, at most 8; the rest into sim.lag; emits effects
sim.units                           // array of Unit, one per slot, index stable for the box's life
sim.groups                          // air groups, each with its aircraft as Units of kind 'aircraft'
sim.state                           // typed arrays, one slot per unit (layout below)
sim.projectiles                     // typed arrays, capacity 4096 (layout below)
sim.effects                         // a ring (capacity 2048, oldest dropped) with drain(fn); the scene drains it once a frame after advance
sim.beats                           // append-only: { t, unit, kind, text, sources }; each reader keeps its own index
sim.takeControl(role) → player      // role: a moment's role (DATA.md §9); spawns or binds the player's unit; returns the Player
sim.releaseControl()                // the unit goes back to the record (an aircraft rejoins its group's script; a ship rejoins its track)
sim.startMoment(momentId) / sim.momentState → { id, t0, t1, elapsed, checkpoint, done }
sim.diverged                        // true once the player has changed anything
sim.score → { hits: [{ unit, kind, count }], downed, torpedoesHit, survived, timeS }
sim.outcome → { bySide: { jp: { sunk: [ids], damaged: [ids], aircraftLost: n }, us: {...} }, record: { the same, from the data }, diverged: [ { unit, sim: 'sunk 10:31', record: 'survived' } ] }
sim.pick(rayOrigin, rayDir) → unitIndex | -1   // for the scene's picking; sim owns the colliders (oriented boxes per unit)
```

**State layout** (fixed at `createSim`; nothing is reallocated):

- `sim.capacity` = the record's units + every group's aircraft + the parked
  aircraft at the box's sites + `spares` (default 64: the player's own
  aircraft, a saved carrier's relaunched strikes). Pearl Harbor needs about
  900 slots (ninety-odd ships, 350 aircraft in the air, 390 on the ground);
  Midway about 400. `sim.units[i]` exists for every slot; a free slot has
  `alive[i] = 0`. Parked aircraft are units with a `parked` station: they are
  the strafing targets, drawn instanced like any other.
- `sim.state.pos`: Float64Array(3N), x y z interleaved, box metres, y up,
  sea level 0. `quat`: Float32Array(4N), x y z w (THREE.Quaternion order).
  `vel`: Float32Array(3N), m/s. `speed`, `heading` (deg), `damage` (0..1),
  `fire` (0..1), `list` (deg): Float32Array(N). `alive`: Uint8Array(N): 0
  free or gone, 1 alive, 2 sinking or falling (still drawn). `kitIndex`:
  Uint16Array(N) into `sim.kits`; `version`: Uint32Array(N), bumped when a
  slot is (re)assigned.
- `sim.projectiles`: capacity 4096; `pos` Float64Array(3M), `vel`
  Float32Array(3M), `kind` Uint8Array (0 shell, 1 bullet, 2 bomb, 3 torpedo,
  4 AA burst), `calibreMm` Float32Array, `alive` Uint8Array, `owner`
  Int16Array.
- `sim.capacityByKit → { kitId: n }`: the most units of each kit that can
  ever exist, so the scene builds each instanced mesh once.

**One step, in this order** (so a replay is identical): 1 scripted motion
(tracks, stations, routes: pure functions of t), 2 AI decisions, 3 the
player's physics from `player.input`, 4 AI physics, 5 projectiles and hits,
6 damage, 7 scripted events whose t was crossed (subject to the authority
rules), 8 fates (sink, fall, land, despawn), 9 effects and beats pushed,
stamped with the step's t.

**What the scene learns, and how**: effect kinds are `flash | splash | hit |
fire | smoke | explode | sink | fall | gone | wake | starshell | searchlight
| tracer | launch | spawn | despawn`; `spawn` and `despawn` mean a slot was
assigned or freed (re-read `kitIndex` and `version`); `sink` and `fall` mean
`alive` became 2; `gone` means 0.

**Who owns time**: `Battle` holds `running` and `timeScale`;
`BoxScene.update(realDt)` calls `battle.tick(realDt)`, which calls
`sim.advance(realDt · timeScale)` while running. Nothing else advances the
sim.

**Scrubbing**: scripted motion is closed-form in t, so `sim.setTime(t)` is
cheap while `sim.diverged` is false. Once a moment has been taken,
`sim.diverged` is true and `Battle.scrub(t)` asks (one HUD line) whether to
return to the record: yes rebuilds the sim from `battle.json` with the same
seed and sets t; no plays forward only.

**The Player** object the controls write into each frame:

```js
player.kind                          // 'aircraft' | 'ship'
player.input = {                     // levels the controls hold (axes, held keys), never zeroed between sim steps:
  pitch, roll, yaw, throttle,        //   aircraft (throttle 0..1)
  helm, telegraph,                   //   ship: helm −1..1 (port..starboard), telegraph −1..1 (full astern..flank)
  aimAz, aimEl, aa,                  //   ship: main battery aim in compass degrees and elevation; aa = direct the AA at a point
  fireHeld,                          //   guns held
  fireCount, bombCount, torpedoCount, salvoCount,   // one-shot counters the sim consumes, so a press in a frame with no step is not lost
  look: [dx, dy], view,              //   camera hints the scene may read
}
player.scripted                      // true: the controls leave `input` alone (the smoke test writes it)
player.state                         // read-only mirror: alt, speed, heading, pitch, roll, g, stall, endurance, ammo, bombs, torpedoes, damage, turrets: [{ bearing, elevation, ready }], target: { index, range, bearing, tof } | null
player.unitIndex
```

`sim.player` is null until `takeControl`.

**Authority: the record is the default, the sim is the truth.** The owner's
rule is that inside a battle the player can turn its tide, and nothing
outside the battle moves. So:

- Every unit not touched by the player follows the record: its track, its
  station, its route, its scripted events. Untouched, a box replays the
  battle as the sources tell it, every time, deterministically; the replay
  test asserts `sim.outcome.diverged` is empty.
- A scripted event has a cause (`by`) and a target. **When the player's unit
  is the cause or the target, the event is not scripted: the sim resolves it
  with its own models.** Washington's nine-to-twenty hits on Kirishima are
  the player's real salvos when the player has Washington; when the player
  has Kirishima, an AI Washington aims and fires the real gunnery model at
  the player, who may evade. Bombing Six's hits on Kaga are the player's
  bombs when the player flies in Bombing Six; the rest of the squadron's
  bombs are still scripted against their own count, scaled by how many of
  them are still flying.
- A scripted event whose cause has been removed does not fire: a strike from
  a carrier that is burning or sunk at its `launch` does not launch. **The
  group rule** (R7 §4.7): every scripted count belongs to a cause group, and
  at the beat `count = recordCount × min(1, S / Srec) + baseRate × max(0,
  S − Srec)`, where `S` is the cause group's survivors now, `Srec` the
  record's survivors at that beat (`attack.reached` in DATA.md §9: Hiryū's
  strike had 7 of 18 left when it scored its three hits; VT-3 had 5 of 12 at
  the drop, so scaling against launch strength would cancel the record's own
  hits), `recordCount` drawn from the record's range by the seed, and
  `baseRate` a per-attacker rate for attackers the record never had (dive
  0.3 against a carrier, 0.15 against a destroyer; torpedo 0.15; level 0.02).
  Below `0.25 × Srec` the beat does not fire. When the player is one of the
  group, the squadron's other hits use `S` without the player and
  `recordCount` less one, so the player's own bomb is theirs alone.
- **Damage is one model for everyone** (`damage.js`, R7 §4.8), with two
  tracks and a doomed state instead of one threshold, because Johnston
  survived three battleship shells and Kaga did not survive four bombs: per
  ship `fight` (0 → 1 and beyond; at the kit's `crippledAt`, default 0.5,
  speed is capped at half and half the turrets or the flight deck are out;
  at 1 the ship is out of action), `float` (0 → 1; at 1 she founders over 3
  to 10 minutes, or capsizes if `list` passes 35°), `list` (degrees, from
  asymmetric flooding, counter-flooded at 1°/min USN or 0.5°/min IJN 1942),
  `fires` in four zones (each burning zone adds `fight`, spreads at a rate
  multiplied by the hangar hazard, is fought at the navy's and year's rate),
  the **hangar hazard `H`** on carriers (fuelled and armed aircraft below:
  0.8 on the Kidō Butai at 10:20, 0.15 on Yorktown at 12:05 with her lines
  drained; from the record at the clock, `hangarHazard` in the battle file),
  per-kit systems (rudder, engines, turrets, directors, radar, flight deck,
  AA groups, bow), and `doomed`, set when three fire zones burn on a carrier
  with `H ≥ 0.4` or flooding outruns damage control; a doomed ship sinks at
  the record's time where the record has one, else after the sim's own
  hours. Scripted hits apply the per-hit table (R7 §4.8, tuned by the
  calibration tests) like real hits; untouched units take the record's
  outcome by construction. A unit the player damages past `float` sinks
  whatever the record says; a unit the player saved from its scripted hits
  fights on and the sim's AI runs it.
- **The AI reacts to the player and only to the player**, within bounds the
  kit and the record set (R7 §4.7): a ship fired on by the player evades
  within **±30° of its course and ±5 knots**, turning toward or away from the
  last fall of shot, and returns to its track within three minutes of the
  last salvo; it returns fire with the battery that bears, with a solution
  error that starts at 2.5 % of range and 3 mils, improves 30 % per
  corrected salvo to a floor of 1 % and 1.5 mils, and loses half its
  improvement when the target turns more than 20° or changes speed more than
  5 knots (so the player's evasion means something); CAP within range
  engages the player with the same flight model and a skill (reaction 0.6 to
  1.0 s, lead error σ 2 to 4 mils, up to 5 or 6 g, 1 to 2 s bursts inside
  300 m); AA engages the player's aircraft as a calibrated hazard (below); a
  scripted strike whose target is the player's ship flies its route and
  profile with the real attack model and the AI's aiming errors. Scripted
  kills the player is not involved in are choreographed, not rolled: a
  nearby fighter or the AA is assigned, flies a short pursuit, fires tracer,
  and the victim falls on the record's minute. Nothing else deviates, so the
  battle stays recognisable.
- **A saved carrier** (R7 §4.7, D12): if the player's battle leaves a carrier
  not doomed that the record lost, the sim runs her within bounds: she
  recovers what is aloft on the record's cycle times and launches only what
  the record says was ready, at the last contact the record gives her side;
  the strike is resolved like any other. Everything that follows is labelled
  on the after-card "the sim's guess; the record has no such event". A
  moment taken in a box the player has already changed always restarts the
  box from the record at that moment's `t` (R7 D10).
- `sim.outcome` compares the sim's state to the record's at the clock's end
  or when the player leaves: what sank, what burned, what was lost, side by
  side, with the divergences named. The after-card shows the sortie's score
  and the outcome's divergences; the table never changes.
- **Fixed fates and targets** (R8 §5): a unit with `fixed: true` plays its
  record events in every run and the sim never lets a player role be their
  cause; a unit past its kit's `fatal`, a `hospital` unit and anything in
  the water are never targets (hits register nothing, the HUD drops the
  marker, the AI stops firing); buildings are terrain and register nothing;
  bombs and rounds on them score nothing. HUD strings name the ship and what
  happened ("Kaga: fire on the hangar deck"), never "Kill", "Destroyed" or
  "Mission accomplished"; a sinking of either navy sounds and reads the same.
- Moments remain the way in. A moment's `durationS` (real seconds; the
  battle span is `durationS × timeScale`) is a **checkpoint**, not an end: at
  it the HUD offers the card or to keep going; the sortie then runs until
  the player's unit is lost, the aircraft's `enduranceS` or ammo runs out,
  the player leaves, or the battle clock ends. The moment's start and its
  checkpoint are both restart points, offered on the pause card and the end
  card. After the checkpoint an aircraft may "fly home" at up to 32×, ending
  in a landing, a ditching or the clock's end as a summary line (R7 D11).
  Watching is always the alternative: a box with no moment taken replays
  the record.
- **Time scales** (R7 §4.1): distances and sizes are true, never
  compressed; time is. Aircraft moments run at 1× in combat; ship gunnery
  moments at 2×; torpedo runs and helm moments at 3×; the player may
  compress up to the moment's `maxTimeScale` (ships 4× or 8×, aircraft 4× in
  transit, 32× flying home), and the scale drops back to the default when a
  threat appears (an enemy aircraft within 8 km, AA engaging, a dive or
  torpedo run begun; a salvo landing within 1 km, a torpedo track within
  3 km, own salvo in its last 5 s of flight, an enemy ship within 5 km).
  Watch mode runs at any scale from 1× to 60×.

Models, as parameters the kits carry (DATA.md §8) and `config.js` scales
(R7 gives the numbers; RESEARCH.md §7):

- **Aircraft** (`aircraft.js`, R7 §4.2): an arcade point-mass model with a
  lift polar and induced drag, thrust from throttle against a power curve
  with altitude, a stall below `stall` speed that drops the nose, a dive
  limit that shakes and then breaks control surfaces, roll and turn rates
  from the kit's `handling` (NACA 868's roll chart: a P-40 about 95°/s at
  its best, an F4F 75°/s falling to 63, a Zero 55°/s falling to about 40 at
  high speed; sustained circles: Zero about 14 s, F4F-4 and P-40B about
  21 s), altitude limited by `ceilingM`; mouse-aim (the nose follows the
  pointer through a coordinated-turn instructor) is the default on keyboard
  and mouse, a bank-to-turn self-levelling stick on touch, direct control an
  option; bombs fall ballistically with the aircraft's velocity (a release
  cue when the computed impact point is within the target's hull); torpedoes
  drop within the kit's `torpedo` envelope or break; guns fire tracer with
  convergence at 250 m and a lead reticle on the current target. Gravity
  9.81. The engine's tests hold each kit's sustained turn and roll rate
  within ±10 % of R7's tables and an SBD's 70° dive from 4,500 m to 600 m
  within 30 to 45 s.
- **Ships** (`ship.js`, R7 §4.4): speed from `m·dV/dt = Tmax·(u −
  (V/Vmax)²)` with the telegraph ordering a speed, so from rest a battleship
  reaches 90 % of top speed in 220 to 320 s, a carrier in 140 to 270, a heavy
  cruiser in 107 to 125, a destroyer in about 55, Nevada and the escort
  carriers slower still (the physical constants from displacement and shaft
  horsepower, which the kits carry; ships start each moment at the record's
  speed, so the helm matters more than the telegraph); a persistent helm
  (an order stays until countered), the rudder moving at `rudderS` (30 s
  hard over to hard over for battleships and carriers, 20 s cruisers, 15 s
  destroyers) and the yaw rate following Nomoto's first-order model with the
  steady radius `0.45 × tacticalDiameterM` and `T ≈ 3L/V`; speed loss in a
  hard turn (25 to 40 %); wake from speed; turrets traverse at `traverseDegS`
  (Yamato's 2°/s is the slowest) toward `aimAz` within their arcs, elevate
  from a **firing table precomputed at load** (range → elevation, time of
  flight, angle of fall), fire a salvo when `salvoCount` and ready, with
  `rofRpm`.
- **Shells** (`guns.js`, R7 §4.4): flown as point masses at 60 Hz with one
  Mach-dependent drag curve, the standard atmosphere and a form factor per
  shell fitted to its published maximum range, which reproduces the
  published times of flight within 2 % (Washington's 16-inch takes 11.9 s at
  8,400 yd; Yamato's 46 cm 47.8 s at 30,000 yd; Johnston's 5-inch 21 s at
  10,000 yd); dispersion per shell is Gaussian about the salvo's mean point
  of impact with the **historical** patterns (about 1 % of range in range
  and 2 mils across for the 16-inch), never inflated; the difficulty lives
  in the fire-control solution; splashes where they fall, in the ship's own
  dye colour by day and white at night; hits by oriented-box test against
  the target. R7's `research/r7-scripts/` hold the reference drag model,
  polar, gunnery Monte Carlo and AA hazard; the engine ports them.
- **Torpedoes** (`torpedoes.js`): straight runs at the type's speed and
  range settings (Johnston's ten Mark 15s, fired at about 07:20 from about
  10,000 yd at low speed on a closing target, ran about 7.4 minutes to the
  07:27 hit on Kumano, R5 §4.6), arming after `armRunM`, a narrow or wide
  spread for a salvo; a scripted `torpedoes-fired` event runs its spread in
  the water with the same model, so the player can be its target; hit by box
  test; failure rates from `weapons.json` for the battle's date (a rate no
  source gives is a *verify* default in `config.js`), with no switch.
- **Sight** (`sight.js`): who can see whom, because two v1 boxes turn on it
  (Kondō's column does not see Washington beyond about 5,000 yards unless
  she shows a light; Kirishima has no radar; Taffy 3 hid in smoke and
  squalls). Each unit has sensors from its kit and the battle (optics with a
  range by light level; SG and fire-control radar where fitted, with their
  ranges; lookouts), sight lines are blocked by smoke screens (volumes that
  drift with the wind) and squalls (moving polygons) and lit by star shells,
  searchlights and gun flashes (which also reveal the firer); the AI aims
  only at what it can see; `player.state.contacts` carries the plot (a radar
  plot on a US ship with SG, a lookout plot on a Japanese one) with range,
  bearing and quality, and the HUD draws it. R7 §4.9's ranges are the
  starting values, marked *verify* in `config.js`.
- **AA** (`aa.js`, R7 §4.6): a Poisson hazard on each aircraft the AI is
  shooting at, `λ = Σ λbarrel × barrels × f(range) × era × alert × aspect ÷
  share` from COMINCH's rounds-per-bird figures per barrel, a range
  fall-off, an era factor fitted to the record (0.85 USN 1942, 0.6 IJN 1942,
  0.5 Pearl Harbor's peacetime crews), an alertness ramp from the first
  sighting, and the fire shared among the attackers; drawn as hit events
  (smoke, a dead engine, a holed wing) before the end; **AA rounds are
  effects only, never projectiles** (a hundred ships' guns at Pearl Harbor
  would swamp the buffer and tie the kill rate to the frame rate). The
  player's `aa` points every bearing mount at the pointer's aircraft for
  5 s. Calibrated against the record: about 27 % of D3As diving on TF 17 at
  12:05 lost to AA, under 3 % of SBDs over Kaga at 10:22, about 31 % of B5Ns
  on Yorktown at 14:43, about 10 % of first-wave torpedo planes at Pearl
  Harbor. A Japanese ship that sights a raid fires two bursts toward it and
  the CAP turns to them, as the record describes.
- **CAP and AI** (`cap.js`): script by default (tracks, stations, routes,
  attack profiles); `cap` units pursue the nearest enemy aircraft within
  their patrol radius with a lead pursuit and fire within 300 m; evasion and
  gunnery as above; a wingman AI that turns into a Zero on the player's
  tail when the player flies an F4F; nothing else deviates from the record.
- **Damage** (`damage.js`): the two-track model above, with the per-hit
  table of R7 §4.8 as the starting values and its calibration cases as the
  tests (Kaga doomed in at least 95 % of runs from her four bombs; Akagi
  from one hit in 55 to 90 %; Yorktown's three bombs dooming her in under
  5 % and stopping her for 40 to 100 minutes; Kirishima's nine heavy hits
  capsizing her within one to five hours in at least 80 %; South Dakota's
  26 hits leaving her afloat in at least 95 %; Johnston's 07:30 hits leaving
  her afloat and making at least 15 knots in at least 90 %). A magazine
  detonation is scripted where the record has one and otherwise a 1 % chance
  per heavy AP shell into a magazine zone inside 10 km.
- **Aiming aids and difficulty** (R7 §4.5): three levels built from named
  switches, Guided, Standard (the default, calibrated to the record) and
  Record (no markers, no lead reticle); Guided halves only what is aimed at
  the player. Readability at true scale comes from zoom sights (4×, 8×, 16×)
  in gunnery views, a minimum on-screen length below which a ship is drawn
  as its silhouette, contact markers for aircraft beyond 2 km, a corner plot
  at the box's scale, and ranges in the unit's own system (yards and knots
  for the US Navy, metres and km/h for the Imperial Navy, with a toggle).
- **Moments** (`moments.js`): starts the clock at `t`, spawns the player per
  `start`, runs the beats, reaches its checkpoint at `t + durationS ×
  timeScale` on the battle clock (`durationS` real seconds), ends when the
  player is lost, out of endurance, leaves, or the clock ends, and computes
  the score; `outcome.js` the comparison.
- **Events** (`events.js`): the record's beats per unit, fired as the clock
  crosses them subject to the authority rules, to the effects ring, the
  beats list and the damage state; each carries its `by` so the sim can tell
  whether the player stands in its path.
- **World** (`world.js`): samples `ground` bilinearly (as the Hawaiian
  `PackTerrain.metresAt`) for collisions, groundings and AA lines of sight.

## 6. Kits (`src/battle/kits/`)

```js
export function buildShipGeometry(kit, { colourDate }) → { hull: BufferGeometry, turrets: [{ geometry, at: [x, y, z], calibreMm, arc }], parts: BufferGeometry, bounds: { length, beam, height }, colours }
export function buildAircraftGeometry(kit, { colourDate }) → { body: BufferGeometry, prop: BufferGeometry, bounds, colours, insignia: 'star-no-red' }
export function paletteFor(name) → [r, g, b]            // 'ijn-kure-grey', 'ms-21-navy-blue', 'blue-grey', ...
export function insigniaAtlas() → { texture, rects: { name: [u0, v0, u1, v1] } }   // one atlas; addressed per instance
```

Geometry is in metres in the model frame of §2 (origin at the waterline
amidships for ships, the centre of gravity for aircraft; bow or nose toward
−z). `turrets[].at` is in that frame. Flat-shaded, vertex-coloured, one
material for every ship and one for every aircraft, so instancing works;
national markings come from one atlas addressed by a per-instance
attribute. The generators are deterministic: the same kit and `colourDate`
give the same geometry, so `battle/kits/` caches by `kit.id + colourDate`.
The helpers are the Hawaiian `features/kit.js` `Builder` (box, tapered
cylinder, prism, quad, ribbon; flat normals, vertex colour), copied with its
scale set to 1 and a lofted hull added. Turrets are separate so the scene
can rotate them; everything else is merged. The generator must produce a
plausible silhouette for every `kind` and `shape` DATA.md §8 names, and
throw on any it does not know (the check catches unknown vocab before the
app does).

## 7. The box scene (`src/battle/scene/`)

```js
export class BoxScene {
  constructor(app)                                   // shares app.renderer, app.light.uniforms, app.sky
  async load(boxDesc, battle, kits) → this           // decodes the pack, builds terrain, sea, weather, unit renderers (kits a few per frame)
  ready                                              // true when the scene can draw
  setSim(sim)                                        // binds the typed arrays
  camera                                             // THREE.PerspectiveCamera; mode: 'free' | 'chase' | 'bridge' | 'director' | 'orbit'
  rig                                                // the Hawaiian CameraRig in metres, with dispose()
  ground                                             // BoxGround (below)
  setCamera(mode, { unitIndex?, target?, bearing?, pitch?, distance? })
  update(realDt)                                     // battle.tick(realDt); drains effects; updates instances; HUD
  hud                                                // HUD (DOM), fed from sim.player.state and sim.beats
  dispose()                                          // frees terrain, kits, instanced meshes, the rig's listeners
}
```

**Ground** (both scenes; the camera rig and the sim read only this):

```js
ground.bounds                // { x0, z0, x1, z1 } world units
ground.maxY                  // world y of the highest ground now
ground.vert                  // world y per metre now (exaggeration / unit)
ground.metresAt(x, z)        // metres, negative at sea; the CPU copy of groundMetres()
ground.heightAt(x, z)        // world y of the ground or the sea surface, never below 0
ground.uniforms              // this scene's own: uVert, uExag, uNormalE, uArchH, uArchRect, uOutside
```

`TableGround` (`src/table/ground.js`) and `BoxGround`
(`src/battle/scene/terrain.js`) implement it over one `PackTerrain` each,
with the single-pack chunk `render/shaders/ground.glsl.js` (about 60 lines
that keep the Hawaiian function names, `groundMetres()` above all, so the
ocean, lines, routes and shadow shaders compile unchanged in both scenes).
The Hawaiian `pack.js` skips terrain nodes wholly below −0.5 m and the
vertex shader sinks the seabed 25 m; both are switched off for the table,
whose picture is the sea floor. Beyond a box's pack the ground is a flat
−4,000 m sea, so v1 boxes are sized to hold every coast seen from the
action (Ironbottom Sound holds Guadalcanal's north coast and Savo's
surroundings; Samar's box holds the island's east coast); a context ring
sampled from the table pack is deferred.

**Shared and per-scene uniforms**: `app.light.uniforms` (uSunDir, uSunColor,
uSkyColor, uGroundColor, uMoonDir, uMoonColor, uTime, uSkyMap, uPointPos[8]
(xyz position, w radius), uPointCol[8], uPointCount) is one bag shared by reference by every material
of both scenes and written each frame by the active scene's sky update.
Each scene's `ground.uniforms` are its own and never merged into the light
bag. A material's uniforms are `{ ...app.light.uniforms, ...ground.uniforms,
...own }`.

**Point lights**: `lighting` gains up to 8 point lights (position in world
units, colour × intensity, radius); `shade()` adds them with an
inverse-square falloff clipped at the radius; the ocean adds their glint.
Star shells, searchlight pools and gun flashes write them each frame (the
nearest 8 to the camera).

**Sky**: the Hawaiian `sky.js` with a dated low-precision ephemeris (the sun
from the NOAA formulas, the moon from Meeus ch. 47 truncated) at the box's
latitude and longitude from `clock.utc(t)`; the Hawaiian moon is anchored on
a 2026 date and would be eight to eleven days wrong at Pearl Harbor and
Samar. Cloud as a layer of instanced puffs at `cloud.baseM` with `cover`;
squalls as grey curtains over their polygons; the fog from the weather's
visibility.

**Units**: hulls as one mesh each (exact at any distance); turrets,
aircraft, shells, tracer, splashes, smoke, wakes as instanced meshes or
points whose instance data is written camera-relative each frame (§2).
Aircraft keep a minimum on-screen span of 3 px (the vertex shader scales the
instance up with distance) so a strike reads at 20 km. Fragments of hulls
and aircraft below y = 0 are discarded (a sinking ship goes under the
surface without depth games). Terrain shading keeps the Hawaiian
`groundAlbedo` with a per-box constant rain. Budget: about 60 to 80 draw
calls for Midway's morning (30 hulls, five or six turret calibres, six
aircraft kits, ten effect families, terrain, ocean, sky); Pearl Harbor's
ninety-odd ships instance hulls per kit; under 500 on a desktop and under
150 on a phone, where the sea's and the smoke's overdraw are the costs to
measure first. The sim's determinism is per browser engine: the smoke test
asserts outcomes in bands ("Kaga doomed by 10:30"), not exact positions.

## 8. Controls (`src/battle/controls/`)

`Input` collects keyboard, mouse and touch into `player.input` each frame
(levels held, counters incremented). Bindings for an aircraft: **mouse-aim
by default** (the nose follows the pointer through the instructor; a held
button or a toggle switches to direct control), W/S or ↑/↓ pitch and A/D or
←/→ roll in direct control, Q/E yaw, **R/F or PageUp/PageDown throttle**
(never Ctrl: Ctrl+W closes the tab and a page cannot prevent it), Space guns
(with `preventDefault`, or the page scrolls), B bomb, T torpedo, C camera, Z
time scale, **Backspace releases the controls** (with a confirm; Esc is the
browser's own key for leaving pointer lock and full screen, so losing
pointer lock pauses and offers release instead). For a ship: A/D helm
(persistent), W/S telegraph, mouse aims the main battery (the reticle shows
range and time of flight from the firing table), click salvo, T torpedoes
(with a narrow or wide spread), Space direct the AA at the pointer's
aircraft, C camera, Z time scale. Touch, in v1 for both: a self-levelling
bank-to-turn stick (left), a throttle slider, fire/bomb/torpedo buttons
(right), camera and time buttons; for a ship, helm and telegraph as two
sliders, the aim by drag, salvo by tap; Guided aids and the Low quality tier
by default on touch. The HUD shows the bindings on the briefing card and on
the first three seconds of a moment.

**Input arbitration**: `app.mode` is one of `table`, `flying`, `watch`,
`moment`. Every keyboard and pointer listener checks it first:

- `table`: the table rig and the UI (tour keys, Esc closes the card).
- `flying` (a fly-down or fly-up): nothing but Esc (abort back to where it
  started).
- `watch`: the box's orbit rig; the UI's tour keys walk the battle's stops;
  Esc closes the card, then leaves the box.
- `moment`: only `battle/controls/`; the rigs are disabled (`rig.enabled =
  false`), the UI's keys are off, Esc releases the controls (to `watch`).
  Pointer lock, if used, is requested on the "Take the controls" click.

The Hawaiian rig binds W/A/S/D, the arrows, Q/E and +/− on `window`, and
`ui.js` binds the arrows, Space, `,`/`.` and Esc; without this arbitration
one key press would steer, pan and advance the tour. `CameraRig` gains
`dispose()` (one AbortController for all its listeners) and the box's rig is
disposed with the box.

## 9. The battle lifecycle (`src/battle/index.js`) and the hand-over (`src/app.js`)

```js
export class Battle {
  constructor(app)
  async enter(boxId, { t, momentId, from: 'table' | 'url' })   // load box + battle.json + kits; build sim at t (the first stop's t by default); fly in; show the briefing
  ready                                                         // true when the scene can draw
  tick(realDt)                                                  // sim.advance(realDt · timeScale) while running
  watch(); scrub(t); play(timeScale); running; timeScale
  takeMoment(momentId) → Promise<{ score, outcome }>            // sim.takeControl, scene camera 'chase' or 'bridge', HUD on, controls bound; resolves on the after-card
  keepGoing()                                                   // past the checkpoint: the sortie runs on until it ends by the sim's rules
  release()                                                     // back to watch at the current t; the sim keeps the diverged state until leave()
  async leave()                                                 // fly out; dispose; table at the battle's date
  state → { boxId, t, momentId, mode: 'watch' | 'moment' }
}
```

**The hand-over** (App owns it; one scene drawn per frame, never a
cross-fade of two rendered scenes, which would render two HDR multisampled
targets while the kits are being built):

1. `battle.enter(boxId)` starts the box pack's decode (PackDecoder, worker),
   fetches `battle.json` and the kits, and builds kit geometry a few kits
   per frame; `battle.ready` turns true when the scene can draw.
2. The table rig flies to the hand-over pose (the box's centre at
   `handoverDistance` = 0.8 × the box's diagonal, km), `flyTo(pose, 2.5,
   { ready: () => battle.ready })` (the Hawaiian rig already slows the last
   fifth of a flight until `ready`). Over the last third the table's
   overlays (front, routes, labels, pins) fade out and its exaggeration
   eases to the box's.
3. On landing: `pipeline.uFade` to the haze colour over 0.25 s;
   `app.setActive(box)` (re-parents `sky.group`, sets the sky to the box's
   lat/lon and `clock.utc(t)`, the fog to the weather's visibility);
   `box.rig.jump(poseToBox(table.rig.pose(), placement))`; fade back in
   over 0.25 s; the briefing card opens. `app.mode = 'watch'`.
4. Leaving reverses it: the box rig flies up to the hand-over pose, fade,
   `setActive(table)`, the table rig jumps to `poseToTable(...)`, the
   WarClock is at the battle's date, overlays fade in. The box is disposed.

**The URL**: the hash carries the view, the query string carries tool
switches (`?data=`, `?q=`, `?fixedq`, `?debug=`), as the Hawaiian app's
tools expect.

```
#date=1942-06-04                          the WarClock's date (a day; the table only)
&cam=x,z,distance,yaw,pitch               the active rig's pose in the active scene's units (km or m), radians, 4 decimals
&battle=midway                            a box id
&t=10:22 | 10:22:30 | 24:07                battle-clock time (BattleClock.parse); default the box's first stop
&moment=vb6-kaga                          offers that moment: the briefing opens on it with "Take the controls" focused
```

`app.fromUrl()` runs at boot (after the table is ready: a URL with a battle
boots the table first, then enters the box with no fly-down) and on
`hashchange`. `app.syncUrl()` writes with `history.replaceState`, debounced
250 ms, only when the serialised hash changed, and remembers what it wrote
so its own change does not re-enter `fromUrl`. Entering and leaving a box
use `history.pushState`, so the browser's Back leaves the box. Unknown keys
are kept. A moment never starts without a click.

`window.__app = app`; handles for the tools: `app.ready`, `app.mode`,
`app.clock`, `app.table`, `app.battle` (`.scene`, `.sim`), `app.tour`,
`app.ui`, `app.settle()`, `app.stats()`.

## 10. The table scene (`src/table/`)

```js
export class TableScene {
  constructor(app, data)                 // data: load.js's result (manifest, table pack decoded, coast, labels, gazetteer, clocks, routes, fronts)
  group, camera, rig, ground             // the Hawaiian CameraRig over the flat table, limits in km; TableGround (§7)
  update(dt)                             // relief, ink, labels, the front for app.clock.date, routes (render/routes.js), pins (ui/pins.js)
  flyTo(view, { duration, ready }) → Promise   // the rig's flight; `view` from a place, an event or a box's bounds
  outline(boxId, on)                     // a box's rectangle on the table, through placement
}
```

The relief shader (`relief.js`): a hypsometric tint over land and a
bathymetric tint over sea, hillshaded from normals baked at an exaggeration
of 16 to 20 and rescaled to the current one; the sea floor is drawn through
depth-tinted water as a function of depth in the shader, not as a second
surface, so the Marianas Trench reads dark and the Yellow Sea pale. The ink
from `coast.js` as `lines.js` lines, the small-island fills as flat
polygons lifted 0.2 km. **Labels are DOM** (`labels.js`), like the Hawaiian
district labels and pins: crisp at any zoom and pixel ratio, kanji through
CSS, thinned by rank against distance and by collision in the same per-frame
loop as the pins, under a hundred on screen. **The table's light is fixed**
(the Hawaiian far view's day 277, hour 15.6): a map that goes dark with the
date is hard to read and says nothing; the battle's real sky lives only in
a box. The front (`front.js`): land held per keyframe as a rasterised mask
cross-faded by `clock.frontPair`, hatched where `contested` or
`pointsAndLines`; the perimeters and declared lines as `lines.js` line sets;
the islands' holders by date as instanced marks from `places.json`.

## 11. The gazetteer UI (`src/ui/`)

Copied from the Hawaiian app and adapted: the card has modes `event`,
`chapter`, `cluster`, `briefing` (`briefing.js`: the situation at `t`, the
forces by side, the moments on offer, the sources, and a footer line with
the box's terrain credit), `after` (`after.js`: four labelled parts, *Your
sortie* / *Your battle* / *The record* / *What came next*, あなたの出撃 /
あなたの戦い / 記録 / その後; people appear only in *The record*; "watch on"
and "back to the table") and `credits` (a Sources and credits panel opened
from a small control on the table, in every box and from the boot screen's
footer, listing every data source with its licence: GLO-30 with its notice
and liability sentence verbatim, GMRT with its citation and "resampled and
clamped", ETOPO 2022 with its DOI, Natural Earth, the Oʻahu pack's USGS
sources, the fonts under the SIL OFL; the same text is `NOTICE.md`). The tour's
step for an event with a box offers *Enter the battle*; inside a box its
stops with `t` scrub the battle; a stop that is also a moment offers *Take
the controls*. The UI raises `ui.onEnter(ev)` and `ui.onTake(momentId)`,
which `integrate` wires to `app.battle`; the after-card reads `score` and
`outcome` only through `Battle.takeMoment()`'s resolved value, so the UI
never imports the sim. The timeline becomes the date axis of §4 with
chapter ticks and the prologue compressed to a tenth.

## 12. Tools

- `bake-table.mjs`, `bake-box.mjs`: DATA.md §11. `lib/etopo.mjs` reads an
  ETOPO 2022 OPeNDAP `.dods` subset (R1's DAP2 reader); `lib/cog.mjs` reads
  a GLO-30 COG window through `geotiff` 2.1.3 with a curl-backed client;
  `lib/ne.mjs` reads Natural Earth shapefiles with `shapefile` 0.6.6 and
  merges at 180°; `lib/geo.mjs` holds `TableProjection` for the placement.
- `check-data.mjs`: a runner that imports every `tools/check/*.mjs` present
  (`packs.mjs`, `gazetteer.mjs`, `routes.mjs`, `fronts.mjs`, `kits.mjs`,
  `battle.mjs`; `common.mjs` holds the shared helpers and `ids.json` the
  frozen ids), so each workflow validates its own data before the merge.
  Exit 1 on problems; counts when clean. DATA.md §10 lists the rules.
- `smoke.mjs`: boots `dist/` under SwiftShader, walks the tour, enters a
  box, scrubs, takes a moment with `player.scripted = true` and writes
  `player.input` for twenty seconds of sim time, asserts no console errors,
  that every scene material's compiled source contains `vFragDepth`, and
  that the sim stayed finite, and prints frame time and heap.
  `smoke-battle.mjs` does the box alone against the Vite dev server
  (`npx vite --port 5297` in the package) before integration and against
  `dist/index.html#battle=…` after, and runs the **calibration tests** of
  R7 §8 as seeded headless batches asserted in bands: the AA cases, the
  gunnery cases (an AI Washington at 8,400 yd makes 9 to 20 hits from 75
  rounds in 80 % of runs against a non-evading Kirishima and fewer against
  one that turns 30° a minute), the times of flight within 3 % of the
  published tables, the damage cases, the group rule (with the player
  absent every scripted count equals the record's), and the flight model
  (turn and roll within ±10 %). `fake-data.mjs` writes `test-data/` (§13);
  `fake-battle.mjs` (engine-owned) may extend the box fixture.
- `shoot.mjs`: the Hawaiian one, with `battle`, `t` and `moment` shot
  parameters.
- `subset-font.mjs`: scans `public/data/**/*.json` for CJK characters and
  writes `src/fonts/noto-sans-jp-subset.woff2` (one static weight, 400) with
  `subset-font` 2.4.0 from the Google Fonts TTF; the result is committed and
  FONTS.md lists the glyph count. Runs at integration, after the content and
  battles have landed.
- The thumbnail: `scripts/thumbnails.mjs` opens the dist with no hash, so
  the package's `gallery.thumbnail` clicks a mid-war chapter tick
  (`"click": ".tl-tick[data-i='4']"`) with a settle long enough for the
  flight, or the default opening view is the shot.

## 13. Who builds what

### Stage 0: the core, one agent, before the fork

The engine and the table both need `render/**`, `geo.js`, `time.js`,
`config.js` and `data/**` adapted from the first hour, and the staged copy
does not build (seven imports point at files that were not staged). So one
agent adapts the shared core and freezes the contracts before anyone forks:

| files | what |
| --- | --- |
| `package.json`, `vite.config.js`, root `.gitignore` lines (`packages/pacific-theatre/test-data/`) | the dependencies of §0; the gallery block with `"status": "wip"` and a `thumbnail` block |
| then `package-lock.json` | its own commit |
| `index.html`, `main.js`, `style.css` (tokens), `src/fonts/**`, `FONTS.md` | retitled skeleton, boot bar, fonts copied |
| `src/config.js`, `src/geo.js`, `src/time.js` | per-scene unit objects; the projections and placement (§3); the clocks (§4) |
| `src/data/{load,decode,image,worker}.js` | `describePack` with `extent`; decode parameters; normalisation; `loadBox` |
| `src/render/{pack,camera,sky,stars,pipeline,lines,routes}.js`, `src/render/shaders/{common,ground,logdepth}.glsl.js` | unit-agnostic, log-depth chunks in every scene shader, the composite's log decode and `uFade`, the dated sky at any latitude, the rig's options, the ground interface and `dispose()`, point lights in `lighting` |
| `src/render/{ocean,shadow}.js`, `src/render/shaders/ocean.glsl.js`, `src/battle/scene/terrain.glsl.js` | the box flavours (metres), handed to `engine` at the fork |
| `src/app.js` | renderer (log depth), pipeline, the light bag, one Sky, the active-scene switch, `app.mode`, the frame loop and quality governor, URL parse and sync (date and cam only until integration), `window.__app` |
| `src/battle/index.js` | a stub `Battle` (enter/leave log and resolve) that `engine` replaces |
| `tools/lib/{fetch,png,raster,geo}.mjs` | copied and adapted |
| `tools/check-data.mjs`, `tools/check/common.mjs`, `tools/check/ids.json` | the runner; shared helpers; the frozen ids |
| `tools/fake-data.mjs`, `tools/smoke.mjs`, `tools/shoot.mjs` | the fixtures below; the harnesses with a boot-and-no-errors check |
| `DATA.md`, `ENGINEERING.md` | patched and frozen: from here on a change to either goes through the project manager |

**Frozen in `tools/check/ids.json`** (and in DATA.md): the four boxes of
DATA.md §7 (id, `lon0`, `lat0`, bounds, size, clock id and span; the bake may
square a grid by less than a texel's worth and reports it); the chapter and
front keyframe ids; the side, kind, flag and precision vocabularies; the
clock ids (`jst`, `usn-zp12`, `usn-zp10`, `usn-zm11`, `usn-zm12`,
`usn-item`, `hst-1941`, `hwt`, `malaya-1941`); and the kit ids with their
types for every class and type the four boxes use:

- ships, Japan: `yamato` (bb), `nagato` (bb), `kongo` (bb: Kongō, Haruna,
  Kirishima), `fuso` (bb), `akagi`, `kaga`, `soryu`, `hiryu`, `shokaku` (cv:
  Shōkaku, Zuikaku), `takao` (ca: Atago, Takao, Chōkai), `myoko` (ca:
  Haguro), `mogami` (ca: Kumano, Suzuya), `tone` (ca: Tone, Chikuma),
  `nagara`, `sendai` (cl), `agano` (cl: Yahagi, Noshiro), `kagero`, `yugumo`,
  `fubuki`, `akizuki`, `shiratsuyu`, `akatsuki`, `asashio`, `shimakaze` (dd),
  `type-a-midget` (ss-midget, `tokko`);
- ships, United States: `north-carolina` (bb: Washington), `south-dakota`,
  `pennsylvania` (bb: Arizona, Pennsylvania), `nevada` (bb: Nevada,
  Oklahoma), `tennessee` (bb: Tennessee, California), `colorado` (bb:
  Maryland, West Virginia), `utah` (bb, target ship), `yorktown` (cv:
  Yorktown, Enterprise, Hornet), `casablanca` (cve), `northampton`,
  `new-orleans` (ca: New Orleans, San Francisco, Vincennes, Minneapolis,
  Astoria), `pensacola`, `portland` (ca: Portland), `atlanta` (cl),
  `brooklyn` (cl: Helena, Honolulu, St. Louis, Phoenix), `omaha` (cl:
  Raleigh, Detroit), `fletcher`, `sims`, `benham`, `mahan`, `gleaves`,
  `farragut`, `porter`, `gridley` (dd: Maury), `wickes` (dd: Ward),
  `john-c-butler` (de), `vestal` (ar), `neosho` (ao), `oglala` (cm),
  `curtiss` (av: Curtiss, Tangier), `solace` (ah, `hospital`);
- aircraft: `a6m2`, `a6m5`, `d3a1`, `b5n2`, `d4y1`, `b6n2`, `e13a1`, `f1m2`,
  `f4f-3`, `f4f-4`, `fm-2`, `f6f-3`, `f2a-3`, `sbd-3`, `sb2u-3`, `tbd-1`,
  `tbf-1`, `tbm-1c`, `p-40b`, `p-36a`, `pby-5`, `b-17e`, `b-26`, `b-18`,
  `a-20`;
- weapons: R6's ids for guns, AA, torpedoes and bombs (DATA.md §8), which
  the engine fills in `kits/weapons.json`.

Source ids are not frozen: content owns `sources.json`; the engine and the
battles each write a fragment (`public/data/sources-engine.json`,
`public/data/sources-battles.json`) with the same schema, and the integrator
merges them, reconciling duplicates by URL.

**Gate**: `npm run build` succeeds; `node tools/smoke.mjs` boots
`dist/index.html?data=../test-data/` under SwiftShader, shows the fake
table, flies to the fake box's outline, and logs no console error; every
scene `ShaderMaterial`'s source contains `vFragDepth`.

### The fixtures `fake-data.mjs` writes (Stage 0)

All in `test-data/` (gitignored), plainly labelled as tests: a 512 × 458
table pack in the real projection with four made-up islands (one straddling
180°, one 3,000 m high), a trench to −10,000 m and shelves; `coast.json` and
`labels.json` to match (a polygon past 180°, every label kind and rank, one
`ja`); `chapters.json` (a prologue and three chapters) and two front
keyframes with `lines.geojson`; `places.json` (twelve, every precision, one
polygon across 180°, islands with `held`), `events.json` (twelve, zones
`+09:00`, `-12:00`, `+11:00`, `-10:30`, precisions minute, day and month, one
with `box: "test-box"` and box stops, one card-only `atrocity`, one across
the date line), `sources.json`, `clocks.json`, `routes.json` (a fleet route
across 180° with dated waypoints, an air route, a schematic campaign);
`boxes/manifest.json` with `test-box` (tangent at 179.5°E 28°N so it
crosses 180°, a 256 × 256 pack with an atoll and a 900 m island, its
`placement` computed with Stage 0's own `geo.js`, `exaggeration` 1);
`boxes/test-box/battle.json` (zone `-12:00`, 04:00–18:00; weather with a
squall; three ships a side with stations; a dive group, a CAP, a torpedo
group; scripted `hit`s with `by`, `fire`, `sinks`; three stops; three
moments: a dive, a gunnery duel, a torpedo run); `kits/ships.json` and
`kits/aircraft.json` using every block `kind`, funnel and turret `shape`,
wing, tail and canopy shape at least once.

### The five workflows after the fork (parallel, separate worktrees, disjoint files)

| workflow | owns (only these) | interfaces it consumes, frozen | runs alone on |
| --- | --- | --- | --- |
| **bake** | `tools/bake-table.mjs`, `tools/bake-box.mjs`, `tools/lib/{etopo,cog,ne,cudem,gmrt,simplify}.mjs` and the Hawaiian 1941 works for Oʻahu copied under `tools/lib/`, `tools/check/packs.mjs`, `research/bake.md`; outputs `public/data/manifest.json`, `public/data/table/height.png`, `public/data/table/coast.json`, `public/data/boxes/manifest.json`, `public/data/boxes/*/height.png` for the four v1 boxes | DATA.md §§1–3, 7, 11; `ids.json` boxes | real downloads (outside the repo, with the ledger); its own `--check` and `--preview` |
| **content** | `public/data/{chapters,clocks,places,events,sources,routes}.json`, `public/data/fronts/**`, `public/data/table/labels.json` (by hand from the gazetteer; the bake does not seed it), `tools/check/{gazetteer,routes,fronts}.mjs`, `research/content.md` | DATA.md §§3–6, 10; `ids.json` boxes, chapters, clocks | its own files and checks |
| **table** | `src/table/**`, `src/ui/**`, `src/render/{pack,camera,sky,stars,pipeline,lines,routes}.js` and `src/render/shaders/{common,ground,logdepth}.glsl.js` (extend, never break the Stage 0 API), `src/app.js` (table side), `main.js`, `index.html`, `style.css`, `tools/smoke.mjs`, `tools/shoot.mjs`, `tools/subset-font.mjs`, `FONTS.md` | ENGINEERING §§2–4, 9–11 | `test-data/` (table and gazetteer) |
| **engine** | `src/battle/**` (replacing the stub), `src/render/{ocean,shadow}.js`, `src/render/shaders/ocean.glsl.js`, `battle.html`, `public/data/kits/**` (ships, aircraft, weapons), `public/data/sources-engine.json`, `tools/smoke-battle.mjs`, `tools/fake-battle.mjs`, `tools/check/kits.mjs`, `research/engine.md` | ENGINEERING §§2, 5–9; DATA.md §§8–9; `ids.json` kits | `test-data/boxes/test-box/**` and `test-data/kits/**` in `battle.html` on the Vite dev server |
| **battles** | `public/data/boxes/*/battle.json`, `public/data/sources-battles.json`, `tools/check/battle.mjs`, `research/battles.md` | DATA.md §9; `ids.json` boxes and kits; `time.js`'s `BattleClock` for its checks | its check validates against `ids.json` until real kits and packs merge |

Each workflow works in its own git worktree on a branch named for it,
commits there, and reports the branch. **Merge order**: Stage 0, then bake,
content, table, engine, battles, then integrate. A workflow that must touch
a file it does not own writes a note in its report instead of editing it.

### Integrate (one agent, after the merge)

1. Assemble `RESEARCH.md` from `research/{content,engine,battles}.md` and
   the research reports.
2. Wire `Battle` into `App`: the active-scene switch, the fly-down and
   fly-up (§9), `app.mode` and its key arbitration (§8), the URL's `battle`,
   `t` and `moment`, the tour's box stops, the card's *Enter the battle*,
   *Take the controls*, briefing and after-card.
3. Run every check on the merged data (`check-data.mjs` now loads all
   modules) and fix the cross-references that only meet here: every event
   `box` names a baked box; every fleet route of a boxed battle matches a
   unit track at the battle's start (DATA.md §5); every kit cited exists and
   has its sources.
4. **The replay test**, per box: create the sim untouched, run it from the
   clock's `from` to `to`, and assert `sim.outcome.diverged` is empty (every
   scripted strike launching when the record says, every ship reaching its
   `fate` when the record has it: Kaga past `fatal` on §5's schedule is the
   first case). Where it fails, tune kit `fatal` and event `damage` with the
   battles' data. This is where the engine's models and the battles' record
   first meet, and it will take the longest.
5. Run `tools/subset-font.mjs` on the final JSON, commit the subset, put the
   glyph count in `FONTS.md`.
6. The thumbnail: `npm run build`, `CHROMIUM_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome
   npm run thumbnails -- pacific-theatre`, look at it, `npm run build` again,
   `npm run verify`, and check `public/data/` stays under 40 MB.
7. Run `tools/smoke.mjs` and `tools/smoke-battle.mjs` on real data under
   SwiftShader; record frame times and heap; decide the depth fallback (§2)
   if a box is unusable.
