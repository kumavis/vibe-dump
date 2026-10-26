# Round three: the Wargame

The owner found the battles not fun: *"we're leaning more on simulation and
realism instead of video game fun design. Give me something more fast paced
and on the fun side, a proper naval and airplane confrontation."* This file
is the contract for that: a second way into each battle, beside the record,
called the **Wargame**. The record's boxes stay as they are. ROUND-2.md's
stations, assist, picking and unit list carry over and are reused.

## 0. The diagnosis, so the fix is aimed

The record drives everything in a box, so a player's actions barely matter
and the ending is known; the enemy is a schedule, not an opponent; the
fights happen at real distances where everything is a speck; a sortie is
one release after minutes of flying straight; feedback is a report at the
end. Every one of those is reversed below.

## 1. Design

- **A what-if with the real forces.** The same ships, aircraft and terrain,
  both sides, fought in a compressed arena 6 km across, with you hopping
  between units and an AI admiral on the other side who fights back. Ten
  minutes; restart instantly; play the other side. Labelled as such on its
  door and its end card: *A wargame played with the real forces. The record
  is on the other side of the table.*
- **Possess anything, instantly.** Tap a ship or aircraft, pick it from the
  unit list, or press Tab (next friendly unit of the same kind) or 1–4
  (nearest friendly carrier, battleship or cruiser, destroyer, aircraft): a
  cut, and you are in it at its current station. No fly-in, no briefing.
  Lose your aircraft and you are in the next one of the flight two seconds
  later, with one line (*Your Avenger did not return. The next one is
  yours.*). Lose your ship and you are in the nearest friendly ship.
- **Arcade handling.** Aircraft: point-to-fly, no stall, a speed band from
  half to full of the kit's top speed, auto-level when the stick is
  centred, a floor over sea and land, turn rates by class (fighters fast,
  bombers slow). Ships: three times the real turn rate and twice the
  acceleration. Guns with a lead reticle and tracer; bombs with an impact
  reticle; torpedoes with a spread preview and a wide window; big hitboxes.
  The stations of ROUND-2 (helm, main, anti-aircraft, torpedoes; pilot,
  gunner, bombardier) are the same stations.
- **A loop every 30 to 60 seconds.** Fly a strike through the flak, release,
  pull out and watch the hit; hop to a destroyer's guns and break up the
  counterstrike; hop to a battleship and duel another at 5 km with visible
  shells and splashes; hop to a destroyer and run a torpedo attack. The
  scenario's **phases** hand you a short goal with a timer every minute or
  two (*The destroyers go in: put a torpedo into a cruiser, 1:30*), on top of
  the side's **main goal** (*Keep four of six carriers afloat until 10:00* /
  *Sink four carriers before 10:00*).
- **An opponent.** The AI admiral keeps formation, launches strikes in
  waves every 60–90 s while it has aircraft, keeps a combat air patrol up,
  screens its carriers, sends its destroyers in with torpedoes when the
  enemy's main body is within 4 km or when it is losing after the fifth
  minute, zigzags under air attack, makes smoke, and turns away at half
  strength. Waves grow through the ten minutes.
- **Feedback.** Hit markers in machine words at the target (*Kumano: hit
  forward, fire*); a second of slow motion on your torpedo hit, your bomb
  on a carrier, or a magazine; camera shake on hits taken and near misses;
  ships that list, burn and go down over twenty seconds; both fleets'
  strength as bars at the top with the timer and the goal line between
  them (*2 of 4*); a running tally of ships sunk and aircraft shot down for
  each side.
- **The end card.** The result in one line; both tallies; a reel of up to
  six snapshots taken at the highlights (your hits, the sinkings, your
  losses) with their captions; one sentence on how the record went; *Play
  again*, *Play the other side*, *Back to the table*.
- **Time** runs at 1× (pause allowed); the compression does the pacing.
- **Tone.** Machines, not people: *shot down*, *sunk*, *hit*, *did not
  return*; never *kill*, never *score* (it is a *tally*), never a count of
  people; DESIGN.md §7.3–7.4 hold for every string. The pacing, the
  tallies, the slow motion and the shake are game design and are not held
  back.

## 2. Scenarios (v1: three, Samar first)

| id | arena | sides and forces (from the box's own units and kits) | main goals (US / Japan) |
| --- | --- | --- | --- |
| `samar` | off Samar's east coast, the box's own sea and shore under it | Taffy 3: 6 escort carriers (Casablanca), 3 Fletchers, 4 John C. Butlers, their Wildcats (FM-2) and Avengers (TBM-1C); Kurita: Yamato, Nagato, 2 Kongō, 4 heavy cruisers (Tone ×2, Mogami ×2), Haguro, Chōkai, 2 Agano, 11 destroyers | keep 4 of 6 carriers afloat until 10:00 / sink 4 carriers before 10:00 |
| `midway` | open sea | TF 16 and 17: Yorktown, Enterprise, Hornet with screens, their SBDs, TBDs, F4Fs; Kidō Butai: Akagi, Kaga, Sōryū, Hiryū with screens, their D3As, B5Ns, A6Ms | put 3 of 4 carriers out of action before 10:00 / put 2 of 3 out of action before 10:00 |
| `ironbottom-sound` | the sound, night, star shells | Lee: Washington, South Dakota, 4 destroyers; Kondō: Kirishima, Atago, Takao, Nagara, Sendai, destroyers | sink Kirishima and 2 cruisers before 10:00 / sink a battleship before 10:00 |

Each scenario gives, per side, 5–7 **phases** (t, title, sub-goal with a
count and a timer, in the voice above), the **formations** (a guide ship, a
screen ring radius, the enemy 5 km away on a bearing), the **aircraft on
deck** per carrier (kit, count, profile) and the **launch cycle**, the
admiral's parameters (aggression, turn-away strength, launch interval,
wave growth), the **footnote** sentence from the record, and sources.

## 3. Engineering: the arena sim (`src/battle/arena/`)

A sim of its own beside the record's, sharing the kits, the box scene, the
effects, the cameras, the controls and ROUND-2's station surface, so the
unit list, the card, the station bar and the touch controls work unchanged:

- `createArena(scenario, kits, box, { side, seed })` → an object with the
  record sim's **public surface where the UI touches it**: `units()` rows
  (with `takeable` always true for a friendly unit alive, and the enemy's
  rows marked `enemy`), `takeControl`, `setStation`, `releaseControl`,
  `player`, `sortie`, `advance(dt)`, `effects`, `beats`, `capacityByKit`,
  `state` arrays in the same layout (`units.js` instancing reads them), plus
  its own: `hop(kind | index)`, `objective`, `strength`, `tally`, `phase`,
  `result`, `highlights` (the events the reel snapshots), `shake`, `slowmo`.
- **Physics** (`arena/physics.js`): the arcade models of §1; AI aircraft and
  ships use the same models; ground and sea floor from the box pack.
- **Weapons** (`arena/weapons.js`): shells from the ballistics module with
  dispersion ×0.3 and the AI's lead solved exactly; AA as the hazard model
  ×3 with tracer, the player's AA as ROUND-2's director; torpedoes at 1.5×
  their speed with a 6 km run; bombs with the impact point; hit boxes 1.5×
  the hull. A hit on a sinking ship registers nothing.
- **Damage** (`arena/damage.js`): hit points by type (escort carrier 10,
  destroyer 6, cruiser 14, battleship 30, fleet carrier 18) with a bomb 2,
  a torpedo 5, a 16"/18" shell 4, 14" 3, 8" 2, 5"/6" 1; fire under half,
  listing under a quarter, sinking at zero over 20 s; aircraft 1 hit
  (fighters 2 bursts); carriers stop launching when burning.
- **The admiral** (`arena/admiral.js`): one per side, ticking every 2 s, the
  behaviours of §1 as a small state machine with the scenario's parameters;
  unit AI (`arena/ai.js`): station keeping, gunnery target choice (nearest
  in arc, damaged first), evasion under attack, strike profiles compressed
  (approach 1,500 m, push-over 1,200 m, torpedo run from 800 m at 40 m),
  CAP intercept within 3 km, a pursuit-and-lead dogfight, escorts.
- **Objectives** (`arena/objectives.js`): the main goal and the phases,
  their timers and counts, the end conditions, the result.
- **The player**: possession, hops, respawn, the tally of the player's own
  hits, `highlights` pushed on the player's hits, every sinking and the
  player's losses.
- **Determinism**: seeded; `tools/smoke-arena.mjs` runs each scenario
  headless for both admirals without a player and asserts the sim finite,
  both sides take losses, no unit leaves the arena by more than 1 km, and
  the main goal resolves within the clock for each side in 40–75 % of 20
  seeds (the balance band; tune the admiral's parameters, not the record).

## 4. Engineering: scene, Battle and controls

- `Battle.enterWargame(scenarioId, { side })` loads the box and the scenario,
  builds the arena, cuts to the player's first unit (the scenario names it
  per side), and runs; `Battle.leave` as now; `Battle.restart({ side })`.
  The URL: `#wargame=<id>&side=<jp|us>`.
- The box scene gains `shake(amount)`, `slowmo(seconds)` (the scene's
  `update` scales the sim's dt, never the record sim's), a **sinking
  animation** (list, trim, settle over 20 s, from the arena's damage state),
  and `snapshot()` (a 320 × 200 JPEG data URL of the canvas, at most six per
  game, taken on the highlights).
- Controls: Tab and 1–4 as hops while in a wargame; the stations as
  ROUND-2; touch: a hop button beside the unit list's.
- Performance: Samar's wargame is about 40 ships and 80 aircraft at once,
  all AI-driven; the arena sim's step must stay under 2 ms in node on this
  machine.

## 5. Engineering: the UI (`src/ui/wargame.js`, `src/link.js`)

- **The door**: on the battle's card on the table, *Play it as a wargame*
  beside *Enter the battle*; on the briefing; on the box bar (*Wargame*).
  It opens the **start sheet**: the two sides with their forces and their
  main goals, the what-if label, *Japan* / *United States*.
- **The HUD layer** (DOM, over the box's HUD): the strength bars, the timer,
  the goal line with its count, the current phase with its timer, the two
  tallies, the hit markers (positioned by the scene's projection of the
  target, 1.5 s, stacking), the respawn line, the hop hints once.
- **The end card** (§1), reusing the card's frame.
- `link.js`: `onWargame(scenarioId)`, `onWargameStart(side)`,
  `onWargameRestart(side)`, `onHop(kind)`; the URL; the phone layout of
  ROUND-2 with the HUD layer added to the bounding-box check.

## 6. Data (`public/data/wargames/<id>.json`, checked by `tools/check/wargames.mjs`)

```jsonc
{ "id": "samar", "box": "samar", "title": "Samar as a wargame", "label": "A wargame played with the real forces. The record is on the other side of the table.",
  "arena": { "centre": [126.0, 11.45], "radiusM": 3000 },
  "durationS": 600,
  "sides": {
    "japan": { "name": "Kurita's Centre Force", "first": "yamato", "bearingDeg": 345, "guide": "yamato", "screenM": 1200,
               "ships": ["yamato", "nagato", "kongo", "haruna", "tone", "chikuma", ...],      // unit ids of the box's battle.json (kit, name, ja come from there)
               "aircraft": [], "goal": { "kind": "sink", "type": "cve", "count": 4, "text": "Sink four of the six carriers before 10:00." },
               "phases": [ { "t": 0, "title": "Open fire", "goal": { "kind": "hit", "type": "cve", "count": 2, "withinS": 90 }, "text": "Yamato has the range: put two shells into a carrier." }, ... ],
               "admiral": { "aggression": 0.7, "turnAwayAt": 0.5, "launchEveryS": null, "waveGrowth": 0 } },
    "usa":   { "name": "Taffy 3", "first": "johnston", "bearingDeg": 165, "guide": "fanshaw-bay", "screenM": 1500,
               "ships": [ ... ], "aircraft": [ { "carrier": "gambier-bay", "kit": "tbm-1c", "count": 6, "profile": "torpedo" }, { "carrier": "gambier-bay", "kit": "fm-2", "count": 6, "profile": "cap" }, ... ],
               "goal": { "kind": "survive", "type": "cve", "count": 4, "text": "Keep four of the six carriers afloat until 10:00." },
               "phases": [ ... ], "admiral": { "aggression": 0.5, "turnAwayAt": 0.4, "launchEveryS": 75, "waveGrowth": 0.3 } } },
  "footnote": "On 25 October 1944 Taffy 3 lost Gambier Bay, Hoel, Johnston and Samuel B. Roberts, and Kurita turned away at 09:11.",
  "sources": [ ... ] }
```

Goal kinds: `sink | hit | survive | shoot-down | reach`; `type` is a ship
type or `aircraft`; every string in the voice of §1. The check: every unit
id in the box's battle file, every kit in the kits, the arena inside the
box, the phases ordered within `durationS`, the goals satisfiable by the
forces (count ≤ what exists), the footnote one sentence, no word of the
never-list.

## 7. Tests

- `tools/smoke-arena.mjs`: the headless balance runs of §3 for each
  scenario and side; a scripted player who possesses, hops, fires, is lost
  and respawns, in each scenario; the browser part (SwiftShader): enter
  Samar's wargame from the card as each side, the HUD layer up, a hit
  marker, a slow-motion, the end card with its reel after a forced end,
  no console error, frame time and heap.
- `tools/smoke.mjs`: the door, the start sheet, the URL, the phone layout
  with the HUD layer.
- `tools/replay.mjs`, `record-heights.mjs` and the record's smoke parts
  unchanged and green.

## 8. Who builds what (three worktrees, then one integrator)

| workflow | owns (only these) | runs on |
| --- | --- | --- |
| **engine-3** | `src/battle/arena/**`, `src/battle/index.js` (`enterWargame`, `restart`, the hops), `src/battle/scene/**` (shake, slow motion, the sinking animation, snapshots), `src/battle/controls/**` (the hops), `tools/smoke-arena.mjs`, `tools/fake-wargame.mjs` (a fixture scenario on the test box), `research/engine-3.md` | the fixture scenario, then Samar's real one when content-3's file is read from its worktree path `${CONTENT_WORKTREE}` or recreated as the fixture |
| **content-3** | `public/data/wargames/*.json` (samar first, then midway and ironbottom-sound), `tools/check/wargames.mjs`, `public/data/sources.json` (additions), `research/content-3.md` | its check |
| **ui-3** | `src/ui/wargame.js`, `src/ui/card.js`, `src/ui/briefing.js`, `src/ui/boxbar.js` (the door and the hop button), `src/link.js`, `style.css`, `src/ui/mock-arena.js` + `ui.html` (a mock of §3's arena surface), `tools/smoke.mjs`, `tools/shoot.mjs`, `research/ui-3.md` | the mock |

Merge order: content-3, engine-3, ui-3; then **integrate-3** wires
`link.js` to the real arena, balances Samar with the headless runs, plays
each scenario as each side under Playwright, folds the as-built into the
contracts, rebuilds `dist/`. The same trailers, commit style, no push, no
`package-lock.json`.
