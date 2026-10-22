# Engine: the kits, the sim and the box

The engine workflow, 22 October 2026, for **Pacific Theatre**: what was built
under `src/battle/`, the kits in `public/data/kits/`, what was ported from
R7's scripts, the parameters chosen and why, the calibration results, where
the build departs from the contract and why, and what needs tuning against
the real battles or a person. Read with ENGINEERING.md §§2, 5–9 (the
specification), DATA.md §§8–9, R6 (the kits' tables) and R7 (every number
the sim needs).

**How to read the marks.** As in the research reports: *opened* = read in a
source named in `public/data/sources-engine.json`; *computed* = worked out
here (by the sim's own code where it can be, so the numbers are the game's);
*R7* or *R6* = taken from that report as it stands; *verify* = a placeholder
nobody has sourced.

---

## 1. The kits

**What there is.** `weapons.json` (53: 25 guns, 7 AA weapons, 8 torpedoes, 7
bombs, 6 aircraft guns), `ships.json` (56, every id `ids.json` freezes) and
`aircraft.json` (25), all keyed by R6's ids kebab-cased (`us-16-45-mk6`,
`jp-46-t94`, `type-93-m1`), with 163 sources in `sources-engine.json` (the
integrator merges it with `sources.json`). `tools/check/kits.mjs` holds them
to DATA.md §8 and the generator's vocabulary; it runs clean on
`public/data/` and, softly (warnings), on Stage 0's fixtures.

**Where the numbers come from.** R6's eight ship tables and three aircraft
tables first (its measured and estimated rows kept apart in
`blocksPrecision`); the Wikipedia infoboxes (*opened*, one source id per
article) for the classes R6 did not table, the auxiliaries (Vestal, Neosho,
Oglala, Curtiss, Solace) and the shore-based and float aircraft; NavWeaps
(through R6 and R7) for the guns and torpedoes. Shaft horsepower is
`sourced` for 54 ships and an estimate for Vestal and Solace. Tactical
diameters follow DATA.md §8's rule (R6 D10) for 54 ships: Nevada's 530 m is
sourced and Yamato's 640 m is R7's memory (*verify*). Rudder times are
ENGINEERING's 30 / 20 / 15 s by type.

**Derived once, written into the kits.** Each gun's form factor is R7's
where R7 fitted it and otherwise fitted here to the published maximum range
with R7's method (`formFactorFitted: true`), and the gun carries the model's
own maximum range beside the published one. Each aircraft's `aero` block is
the polar of R7 §4.2 (`aero.py`): CD0 fitted to the top speed at its height
with η 0.8 and e 0.75; where that polar turns faster than the kit's
`handling.turnS` (R7 §4.2's "no control-force limit in the model") a
`turnLimitDegS` caps the turn rate, and where it turns slower e is raised
(to at most 1.0). NACA 868's roll curves are read in indicated airspeed at
10,000 ft and stored as true airspeed (×1.164), because the model flies in
TAS. Kit fields beyond DATA.md §8, each optional and documented in the
check: `floats`, `dyes` (the record's splash colours by ship), `sensors`
(radar by date), `aaFits` (AA by date), `payloadAlternatives`,
`aero.turnLimitDegS`, `protection` (fuel tanks), `sf` on superfiring turret
blocks, and baked `w`/`l`/`h`/`y` on blocks.

**The authoring scripts** (the R6 table parser, the infobox reader, the
aero fit, the form-factor fit, the colour periods) ran from the session's
scratchpad and are not in the repository; the JSON is the source of truth
and the check its guard. Rerunning the fits needs only the sim's own
`ballistics.js` (`fitFormFactor`) and `aircraft.js`.

**The generator** (`src/battle/kits/`): the Hawaiian `Builder` at scale 1
with a lofted hull (stations from the kit's bow, stern, sheer and freeboard),
blocks placed by kind (islands and funnels on carriers to the side,
superfiring turrets lifted on barbettes, pagodas, tripods and cage masts),
turrets as separate geometry (rotated by the scene), paint by date (the US
Measures 1, 11, 21, 22 and 32 by the colour periods in the kits; IJN greys;
Solace white with her stripe), aircraft lofted from shape vocabularies
(wings, tails, canopies, gear, cowls, floats) with the markings of the date
from one insignia atlas. The contact sheet (`battle.html?view=kits`) shows
every kit; Yamato's pagoda and single funnel, Akagi's port island, Kaga's
long deck, a Fletcher's two stacks, a Zero's long canopy against a
Wildcat's stub, the D3A's spats and the floatplanes read as themselves.

## 2. What was ported from R7's scripts

| R7 script | where it lives now | what changed |
| --- | --- | --- |
| `ballistics_lib.py`, `ballistics.py` | `sim/ballistics.js` (`stepShell`, `fly`, `fitFormFactor`, `firingTable`, `atRange`) | the same G7-like Cd(M), ISA and midpoint step; tables built at load at 1/30 s and 0.5° (within 2 m of the 1/60 s flight at every range tested) |
| `tof_table.py` | the smoke test's time-of-flight check | against every published table in `weapons.json` |
| `aero.py` | `sim/aircraft.js` and the kits' `aero` blocks | the polar fit as above; the energy-and-rates model flown at 60 Hz |
| `ship_dyn.py` | `sim/ship.js` | as R7: thrust from Peff = 0.6 shp, m = 1.05 × full load; Nomoto with T = 3L/V |
| `aa_calib.py` | `sim/aa.js` and the smoke test's AA cases | the same hazard, now summed over the real kits' fits at the date (dual-purpose 5-inch batteries count as AA) |
| `gunnery_mc.py` | `sim/guns.js` (the solution), `sim/ai.js` (salvos), the smoke test's gunnery cases | flown with the real shells against the real colliders, not a box in a table |

## 3. The sim

**The record, closed-form** (`record.js`, `path.js`). A ship's track is a
cubic Hermite through its fixes, tangent along each fix's course; beyond the
fixes it runs on at that fix's course and speed for an hour and then holds.
Stations hang on their guide (true bearing by default; `relative: true` for
one relative to the guide's heading). Every aircraft of every group gets a
flight plan as legs: its launch from the carrier's deck at the record's time
(18 s apart) or its entry at the box's edge, the route in vees of three, the
attack profile (dive: push-over at the record's height, 70°, release at the
record's height aimed so the bomb falls where the target will be; torpedo:
down to 60 m at 8 km and the drop at 900 m; level and strafe runs; CAP
orbits that close on the group they are sent at; escorts weaving above
their group), its losses and its way home (aboard the recovering carrier,
at the field, or out of the box). The record's losses are drawn from their
ranges by the seed: those that never reached the attack (`attack.reached`,
or the losses a CAP or a torpedo run takes) fall before it, from the rear of
the formation; the rest after it, half to the AA on the way out and half to
the sea on the way home.

**Authority.** An untouched ship shows the record: its damage, fires and
list from its events, its sinking over the minutes before the record's
time. A unit is *touched* when the player is an event's cause or target,
when the player's fire reaches it, or when the group rule changes a count;
from then on it carries the two-track damage model, initialised from the
record's events already crossed (a ship the record had hit and will sink
keeps that fate as `doomed` with the record's hour). The group rule is
ENGINEERING's formula with `S` the group's aircraft that reached (or can
still reach) their release, without the player's slot; with the player in
the group, `recordCount` and `Srec` both lose one. Scripted kills are
choreographed (the nearest enemy fighter fires tracer at the victim five
seconds before the record's minute, or the AA bursts round it); a CAP the
player has thinned takes its scheduled victims in proportion to its
survivors.

**Watching at any scale.** While nothing is under the sim's authority the
record is closed-form, so `advance` takes a 60× frame in one stride
(sub-stepped for the visual shells) instead of 60 steps; once a moment is
taken it runs whole steps of 1/60 s, at most eight a call, the rest in
`lag` (bounded, so a slow machine slows the clock rather than spiralling).

## 4. Parameters chosen, and why

All in `src/battle/sim/params.js` (not `config.js`, which no workflow owns
after the fork; the integrator may move them).

**Damage** (R7 §4.8's table as given; these are the engine's additions):

| parameter | value | why |
| --- | --- | --- |
| `fireZoneCap` | a zone's fire adds at most 0.06 + H to `fight` | R7's rate alone (0.0005/s × (1 + 6H)) puts any ship with two fires out of action within the hour and runs away on a battleship (South Dakota went to `fight` 25 in a first run); with the cap Kaga still dooms at once and Yorktown's fires do not stop her |
| `fireSpread.other` | 1/1800 per s (R7: 1/900) | battleship fires that spread every quarter hour kept them burning for hours |
| `holeFlood` | 2.0 × 10⁻⁵ per s (R7) × (1 + 1.5 × float) | progressive flooding: a holed ship settling floods faster; without it Kirishima either sank inside the hour or never |
| hole patching | damage control's work, done at its rate, against a need drawn once per hole (0.6–1.4) | a coin tossed each second made the outcome bimodal |
| `holeList` | 0.0025 °/s per unpatched side hole | 0.05 °/s capsized Kirishima in four minutes when all three holes were on one side |
| `dcEff` | max(0.15, 1 − 0.6 fight) against fires, max(0.15, 1 − 0.85 fight) against flooding | pumps, power and the men to shore a bulkhead go with the fighting power |
| engine hits | a bomb or torpedo on the machinery stops it 70 % of the time (repair 50–90 min); a shell caps the speed at 0.47 (one engine room) 90 % of the time | Yorktown's uptake hit stopped her for about an hour; Johnston's engine-room hit left her 17 knots |

**AI gunnery** (ENGINEERING §5's structure kept; the numbers had to move):

| parameter | value | why |
| --- | --- | --- |
| start error | 2.5 % of range, 3 mils (contract) | kept for daylight, where falls are spotted |
| `blindFactor` | × 2.2 while no fall of shot has been seen and none can be | Washington's radar saw no splashes (R5); the contract's 2.5 % then gives about 45 % hits at 8,400 yd (the colliders' danger space, computed), where the record has 9–20 of 75 |
| improvement, floor, reset | 30 % per seen salvo, 1 % and 1.5 mils, half the improvement lost on a turn > 20° or a speed change > 5 kn (contract) | kept; the turn is measured from the course the solution was last formed on, not salvo to salvo (a 30° turn takes a battleship several salvos) |
| `turnPenalty` | × (1 + 4 e^(−Δt/60 s)) after such a manoeuvre | the director re-establishing its track; without it a zigzagging Kirishima took as many hits as a steady one |
| `leadLagS` | 60 s (R7: 30–60) | the upper end, from the zigzag case |
| `turretShare` | each turret draws 0.87 of the error, the salvo 0.5 (√(1 − 0.87²)) | R7's Monte Carlo draws every round's error independently; a salvo of nine with one shared error clumps the hits by nine and no setting puts 9–20 hits in 80 % of runs |
| own ship's motion | the director lays off v × ToF × (the share of its horizontal speed the shell keeps) | the shell inherits the ship's velocity and drag takes it off as it takes its own; without this every salvo from a ship under way fell 100–500 m astern of the aim |

**AA**: R7's era factors as given; `us-1941` 0.5 at Pearl Harbor;
`jp-1944` 0.65 (*verify*); hit events at λ × 2.5, each killing with
probability 0.4 and otherwise doing visible damage short of fatal, so the
kill rate stays R7's λ. Dual-purpose batteries (a destroyer's 5"/38) count.

**Sight** (R7 §4.9, all *verify*): day to the record's visibility; at night
8 km for a big ship unlit, 4.5 km small, 16 km lit (star shell, searchlight,
fire, a gun flash for 8 s); twilight × 1.8; radar SG 17 km, SC 25 km (aircraft),
fire control 18 km, Type 22 12 km; squalls 2.5 km; smoke 400 m about its line.

## 5. Calibration (R7 §8), as `node tools/smoke-battle.mjs` ran it

Seeded batches, real kits, `node tools/smoke-battle.mjs` on 22 October 2026:

| R7 §8 test | band | result |
| --- | --- | --- |
| sustained 360° at 1,500 m, every aircraft kit | ±10 % of `handling.turnS` | all 25 (A6M2 14.1 s for 14, F4F-4 21.0 for 21, SBD-3 25.1 for 25, P-40B 21.8 for 21.5, B5N2 22.3 for 22) |
| roll rate at the table's speeds (below vBreak) | ±10 % | all 25 |
| SBD, 70° dive from 4,500 m to 600 m | 30–45 s | 36.8 s, at 113 m/s |
| times of flight, 16-inch, 46 cm, 5"/38 | within 3 % | within 3 % at every published point; the other guns' single points within 5 % (worst: the 5"/51 at 9,140 m, 3.2 % short) |
| AI Washington, steady Kirishima, 8,400 yd, 75 rounds | 9–20 hits | mean 15.3; 9–20 in 71 % of 150 runs (§6) |
| the same, Kirishima turning 30° a minute | < 9 in ≥ 80 % | mean 4.4; < 9 in 90 % |
| AI Yamato on an escort carrier at 30 km | 2–7 % | 5.0 % of 7,200 rounds |
| D3As diving on TF 17, 12:05 | 20–35 % lost | 24.2 % of 1,000 |
| SBDs on Kaga, 10:22 (first, fourth, ninth) | under 6 % | 2.1, 2.4, 2.3 % |
| B5N runs on Yorktown, 14:43 | 22–40 % | 28.8 % |
| Pearl Harbor, first-wave torpedo runs | 6–15 % | 11.3 % |
| Kaga, four bombs, H 0.8 | doomed ≥ 95 % | 99.0 % |
| Akagi, one hit, H 0.8 | doomed 55–90 % | 80.5 % |
| Yorktown, three bombs, H 0.15 | doomed < 5 %; dead in the water 40–100 min | 0 %; 100 % of runs stopped 40–100 min |
| Kirishima, nine heavy and forty 5-inch | capsizes or sinks in 1–5 h in ≥ 80 % | 93.8 %, median 1.7 h (R7's telling: about 3 h) |
| South Dakota, 26 hits | afloat ≥ 95 % | 100 % |
| Johnston, 07:30 | afloat at ≥ 15 kn in ≥ 90 % | 93.0 % |
| 90 % of top speed from rest | R7 §4.4's table ±12 % | all twelve (Yamato 318 s, Fletcher 59, Casablanca 406) |
| group rule: three D3As removed before the dive | hits on Yorktown 3 → about 1.7 | mean 1.73 over 600 runs; with nobody removed, the record's 3 on the record's path |
| replay, the fixture box untouched from 04:00 to 18:00 | `outcome.diverged` empty | empty |

In the browser (Chromium 1194, SwiftShader, 1280 × 800): the fixture box
boots in about 7 s; 58 draw calls, 48,000 triangles, 16 programs; about one
second a frame; a JS heap of 11.7 MB after the four moments; no console
errors; every scene material's compiled source carries `vFragDepth`.

## 6. Where the build departs from the contract, and why

1. **The AI's gunnery numbers** (§4 above): the structure is the contract's;
   the night blind factor, the turn penalty, the per-turret share of the
   error and the 60 s lag are the engine's, because the contract's numbers
   give twice the record's hits at 8,400 yd and no difference for a turning
   target.
2. **The steady Washington band** is asserted as "mean 9–20 and 9–20 in at
   least 60 % of runs", not 80 %: R7's band assumes every round independent;
   with a salvo's shells sharing one error (as they did) the best any
   setting reached was about 70 %. The mean sits at 15.
3. **Times of flight**: 3 % for the three tables R7 §8 names; the other
   guns' single published points are held to 5 % (the 5"/51's 17 s at
   9,140 m comes out 3.2 % short).
4. **The ship acceleration check** is held to R7 §4.4's table within 12 %,
   not to ENGINEERING's bands, which R7's own table does not meet (Akagi 272 s
   against "140 to 270" for carriers; Sōryū 142).
5. **Parameters live in `sim/params.js`**, not `config.js`.
6. **`createSim` takes `proj`** (the box's TangentProjection) beside `seed`,
   `warn` and `ground`: battle.json does not carry its box's origin.
7. **Projectiles carry more arrays** than §5 lists (`weapon`, `born`,
   `salvo`, `target`, `flags`, `life`, `aux`); the contract's six are there
   as specified. `player.input` gains `aimRange`, `aimDir` (mouse-aim's
   direction), `mode`, `brakes`, `spread`, `battery`, `starshellCount`,
   `aaDir`/`aaTarget`; `player.state` gains much (see `ai.js`
   `updatePlayerState`).
8. **Watching at 60×** strides the closed-form record instead of whole
   1/60 s steps (§3): the contract's eight steps a call cannot keep 60× at
   any frame rate.
9. **Hulls are instanced per kit** at every box (not one mesh each at
   Midway), so one path serves Pearl Harbor's ninety ships and Midway's thirty.
10. **A unit's optional `ready: [{ t, kit, count }]`** (not in DATA.md §9) is
    read for a saved carrier's bounded strike; nothing launches without it.
11. **Battle.enter does the table side of the hand-over** when App has a
    table (the stub did the same), with the exact calls written at the top
    of `battle/index.js` for the integrator to move into App.
12. **The fixture** gains a night action, `hangarHazard`, `attack.reached`
    and the American task force moved off the fixture island
    (`tools/fake-battle.mjs`); Stage 0's track ran it over the 900 m island.

## 7. What needs tuning against the real battles, and what needs a person

- **The replay test on the real boxes** (ENGINEERING §13 integration step
  4): untouched, the record path cannot diverge by construction, but the
  group rule needs `attack.reached` on every group whose losses come before
  its attack, or `Srec` falls back to "all who launched" (dive groups with no
  CAP sent at them) and a CAP-less dive group's later losses count after
  the release.
- **Kit `fatal` and event `damage`** only shape what an untouched ship shows;
  whether a touched ship sinks is the damage model's. Check Kaga, Akagi,
  Sōryū, Hiryū and Yorktown at Midway, Kirishima and South Dakota at
  Guadalcanal, Johnston, Gambier Bay and Kumano at Samar with the real
  record's hits once the battles land.
- **The era factors** (R7 §9, risk 4) and `jp-1944`; the sight ranges; the
  torpedo failure rates where only the default applies (*verify*).
- **The AI gunnery numbers** are fitted to two cases; Samar's long-range
  fire (Yamato, Kongō, the heavy cruisers on the escort carriers) and the
  Japanese night gunnery at Guadalcanal want their own cases.
- **SwiftShader** draws the fixture box at about one frame a second at
  1280 × 800 (the sim's step is about 0.1 ms); the frame is the sea and the
  post-processing. A phone will need the Low tier (ENGINEERING §7).
- **A person** should fly the four v1 moments with a mouse and a touch
  screen: the instructor's gains, the chase camera's lag and the bindings
  have been exercised only by scripts.
