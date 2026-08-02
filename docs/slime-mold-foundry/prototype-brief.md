# Slime Mold Foundry — prototype build brief

Companion to `design.md` (the full design doc). This brief defines the batch of
gameplay prototypes built as packages in this monorepo. Each prototype attacks
one **low-confidence design area** — a place where the design is new and we
need evidence, not more prose.

The two questions this batch exists to answer:

1. **Natural ascent.** Can the player be led to each higher automation tier
   *without forcing it* — no tutorial popups, no locked doors — purely by
   making the current tier's manual verb saturate and offering the next tier
   as relief, gated on demonstrated fluency?
2. **Performance scaling.** Does the "rates, not items" + tile-LOD
   architecture actually deliver the fantasy of *wielding a massive factory* —
   a continental organism that still ticks fast and still answers to
   player-scale verbs?

## The batch

| Package | Roadmap # | Low-confidence area it tests |
|---------|-----------|------------------------------|
| `smf-dying-patch` | 01 | (port of the existing prototype — baseline, already validated) |
| `smf-graduation` | 00 | L0→L1 ascent: earning the blueprint by repetition; context-mismatch failure; descent to hand-fix |
| `smf-the-jam` | 02 | L2→L3 ascent: toil saturation → alert routing as relief; alert storm; hysteresis-by-tank |
| `smf-parts-bench` | 03 | Signal computation as plumbing: is the parts list expressive enough without a language? |
| `smf-the-seal` | 05 | L4 seal ceremony and the blast-radius preview UI for breaking a seal |
| `smf-continental` | — | Performance scaling: 50k+ structures, big field, LOD, fast-forward, player verbs at continent scale |

## Shared conventions (all packages)

### Repo mechanics

- Standard package layout per the repo `CLAUDE.md`: `package.json` (with a real
  `gallery` field), `vite.config.js` re-exporting `../../vite.config.shared.js`,
  `index.html` entry, relative asset paths only.
- No runtime network requests (no CDN scripts, no webfont imports). System
  font stack: `ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace`.
  (Exception: `smf-dying-patch` keeps its original Google-Fonts import — it is
  a faithful port, and its fallbacks degrade fine.)
- Vanilla JS + Canvas 2D for all new prototypes. No frameworks, no three.js —
  these are gameplay/architecture prototypes, and 2D keeps iteration honest.
  (`smf-dying-patch` is the exception: React + three.js, ported as-is.)

### Architecture (non-negotiable — these are the design doc's commitments)

- **Hard data/view split.** `src/sim.js` is pure JS: no DOM, no canvas, no
  timers. It exports `createSim(opts?)` returning
  `{ state, step(dt), act(action) }`. `src/view.js` renders the sim to canvas
  and owns zero game state. `src/main.js` is the shell (RAF loop with a fixed
  accumulator, HUD, input → `act()`).
- **All player verbs go through `act(action)`** — the UI dispatches actions,
  and the headless harness dispatches the *same* actions. If the mouse can do
  it, the harness can do it.
- **Fixed tick** `DT = 0.1`s. Fast-forward = more ticks, never a bigger dt.
- **Determinism.** No `Math.random()` in the sim. Prefer authored schedules;
  where variety is needed use a seeded mulberry32 with a fixed default seed.
- **Rates, not items.** The sim moves continuous rates. Discrete tokens/items
  exist only in the view, drawn at `frac(time · speed)` along paths. Bots and
  timed processes are job records `(t0, duration)` — position/progress is
  derived, never stored per-frame.
- **Milestones as flags.** `state.flags` (ordered dict of named booleans) +
  `state.events` (ring buffer of `{t, msg}`). The HUD checklist and the
  harness assertions both read these — a scenario is simultaneously a design
  test, a regression test, and a tutorial level.

### Headless harness (every package, including the port)

`harness.mjs` at the package root, run with `node harness.mjs` (add
`"test": "node harness.mjs"` to package scripts):

- Imports `createSim` from `./src/sim.js` (the port slices its source instead,
  per the design doc's appendix).
- Contains an **autoplayer**: a scripted player policy that plays the scenario
  through `act()` with human-ish reaction delays.
- Steps the sim to completion (cap `T_MAX`), prints the milestone timeline
  with timestamps, prints **perf stats** (total ticks, wall ms, µs/tick), and
  asserts: (a) every milestone flag fires, (b) in the expected order, (c)
  scenario-specific quantitative claims (listed per package below).
- Exits non-zero with a clear message on any failure. Must finish in a few
  seconds of wall time.

### Look & feel — the two-color law

Dark industrial telemetry aesthetic, matching Scenario 01:

- bg `#0b0e11`, panel `rgba(13,18,22,.92)`, borders `#1e2a32`, text `#c2ccd2`,
  dim `#566068` / `#5b7482`.
- **Amber `#e0973a` = matter** (ore, machines, throughput, costs).
- **Cyan `#55d6f0` = signal** (probes, traces, tokens, gates, tanks).
- **Blue `#3b9fd9` = value field.** Green `#9fd65a` = bots/success.
  Red `#d96b6b` = fault/resorb. Enforce this everywhere: world, HUD, legend.
- HUD: right-side panel (collapsible) with title block
  (`SLIME MOLD FOUNDRY` / scenario name), speed buttons (⏸ ×1 ×4 ×16), stat
  cards with thin bars, the milestone checklist (□/■), scrolling event log,
  and a color legend. Keep the Scenario 01 CSS vibe: 11px mono, letterspaced
  condensed headers, hairline borders, no rounded-corner-blob styling.
- A one-line help hint bottom-left with the controls.

### Performance discipline (every package)

This game's core fantasy scales to a continental factory, so even small
prototypes must behave like citizens of that architecture:

- Sim cost proportional to *active* entities; no per-frame allocation storms
  (reuse arrays/scratch objects in hot loops).
- View draws only what the camera can see; token drawing is capped and derived
  from the clock, never simulated.
- ×16 fast-forward must hold 60fps in every prototype. The HUD shows
  `sim µs/tick` and `draw ms` (small dim readout) — perf is *visible* in all
  prototypes, because observability-of-cost is itself a theme of this game.

---

## Package specs

### 1) `smf-dying-patch` — port of Scenario 01 (baseline)

**Goal:** get the validated prototype into the gallery unchanged, with its
headless harness, so the other prototypes have a living reference.

- Source `src/Scenario01.jsx` is already in place (verbatim from the design
  upload — do not redesign it; only fix what's needed to build).
- Add `index.html` + `src/main.jsx` (React 18 `createRoot`, render the default
  export full-viewport). Deps: `react`, `react-dom`, `three@^0.160.0`.
  Vite 5 compiles `.jsx` with the automatic runtime out of the box; only add
  esbuild config in `vite.config.js` if the plain re-export genuinely fails.
- `harness.mjs` per the design doc appendix: extract the sim by slicing the
  source between the CONSTANTS banner and the VIEW LAYER banner, evaluate it
  headless (`new Function` — stub nothing; the sim imports nothing), run to
  completion, assert this timeline in order:
  `start → deplete → gateClosed → alphaDorm → grow → resorb1 → done`,
  with `done` before T+180s (the doc says ~98s; leave slack).
- `gallery`: title `SMF 01 · Dying Patch`, description
  "The grow/dorm/resorb organism loop — value field, rig hysteresis, and a
  colony that relocates itself. The original Slime Mold Foundry prototype."
- README: one page — what it proves (already validated), how to run the
  harness, pointer to `docs/slime-mold-foundry/design.md`.

### 2) `smf-graduation` — SMF 00 · Graduation (L0→L1)

**Design question:** can the game *offer* the blueprint tier as relief earned
by repetition — no popup, no forced tutorial — and does the L1 signature
failure (context mismatch) teach descent-to-hand-fix?

**World.** Top-down 2D grid, ~30×18 cells of ~30px. Authored map (no RNG):
ground, impassable rock, and 8–10 ore patches of 3–5 cells in varied
orientations. A depot at the map edge. Camera fixed (whole map visible).

**Economy.** A "line" = extractor placed on an ore cell + furnace placed on an
adjacent buildable cell. Complete lines produce ingots at 1/s (rate-based;
ingots teleport to depot — belts are out of scope for this prototype). Ore
cells deplete slowly. Matter: starts small; income from delivered ingots;
extractor costs 10, furnace 15.

**Demand curve (the pressure).** Contract orders arrive on a schedule:
required delivery rate ramps 1 → 3 → 6 → 10 ingots/s over ~4 minutes. HUD
shows required vs actual rate and a backlog meter; backlog too high shows
`CONTRACT AT RISK` (amber warning, no hard fail — tension, not punishment).

**Player verbs** (`act`): `{type:'select', tool}` (extractor | furnace | echo),
`{type:'place', gx, gz}`, `{type:'rotate'}` (rotates the echo pattern),
`{type:'demolish', gx, gz}`.

**The echo (core hypothesis).** The sim records each *completed* line as a
relative pattern (furnace offset from extractor). When the same relative
pattern completes for the 3rd time, flag `echoUnlocked`: a new palette card
appears — `PATTERN ECHO — earned ×3` — with a soft pulse. No modal, no text
box. Selecting it ghosts the whole pattern under the cursor (green = valid,
red cells = invalid), `rotate` spins it, one click stamps the full line and
spends the combined cost. The card itself is the offer; the ramping demand is
the motive.

**Context mismatch (the L1 signature failure).** At least one later ore patch
is authored so the echo pattern cannot fit in *any* rotation (ore hugging
rock). Stamping near it shows the red-partial ghost; the sim flags
`mismatchSeen` the first time a stamp is rejected for terrain, and
`mismatchResolved` when the player completes a line on that patch by placing
by hand (descent to L0). The event log narrates it plainly
(`ECHO rejected — furnace cell blocked. Placed by hand.`).

**Milestones (in order):** `firstLine` → `thirdLine` → `echoUnlocked` →
`firstStamp` → `surge` (demand hits 6/s) → `mismatchSeen` →
`mismatchResolved` → `contractMet` (sustain required rate 20s at max demand).

**Toil instrumentation (the evidence this prototype exists to produce).** The
sim tracks clicks-per-completed-line, split before/after first stamp. HUD
shows both numbers side by side (`TOIL 3.0 → 1.0 /line`). Harness asserts:
autoplayer finishes; toil after ≥ first stamp is ≤ half toil before; at least
60% of final lines were stamped; `mismatchResolved` happens by hand-placement
actions.

**Gallery:** `SMF 00 · Graduation` — "Place lines by hand until the game
notices your pattern — then stamp. Tests earning automation by repetition,
and the blueprint that doesn't fit."

### 3) `smf-the-jam` — SMF 02 · The Jam (L2→L3)

**Design question:** does manual-toil saturation produce *voluntary* adoption
of alert routing? Is alert-as-physical-token legible? Does the alert storm →
tank/hysteresis fix land?

**World.** Side view-ish 2D: up to 8 horizontal belt lanes, each
`source hopper → belt → smelter`. A lane flows at 2 matter/s. Right side:
smelters feed a shared quota meter (scenario goal: bank 1500 matter). Below
the lanes: the **alert bay** — a responder pad with a runbook hopper (loaded
with the UNJAM runbook) and a parking spot for 1–2 responder bots.

**Jams.** Authored + seeded schedule: a jam spawns on an active lane
(amber clog, pulsing) and the lane's rate drops to 0 until cleared. Interval
starts ~12s and tightens as more lanes are active. Manual clear: click the
jam (`act {type:'clear', laneIx}`). Each active lane also earns matter, so the
player *wants* more lanes: `{type:'buyLane'}` (cost ramps). More lanes = more
income = more jams = the toil curve. HUD shows `HANDS` — manual clears/min,
and it visibly climbs into the red.

**The earned unlock.** After 12 manual clears (`fluency` flag), the signal
palette appears (again: a palette card pulse, no modal): per-lane
`{type:'buyProbe', laneIx}` (probe + threshold gate + trace to the alert bay,
drawn as cyan overlay above the lane) and `{type:'buyBot'}`. A probed lane
that stops flowing stops emitting flow tokens — **absence is the signal** —
its gate trips and mints an **alert token**: a discrete cyan token that
physically travels the trace to the bay, queues, and dispatches a responder
bot which drives to the lane and clears the jam (travel + 1s work). Alert
tokens ARE items in the view; the queue depth is visible at the bay.

**The storm (L3 signature failure).** Mid-game a scripted `degraded belt`
event makes one lane's flow flutter around the gate threshold (rapid
0↔2 oscillation). Its gate chatters: mints alert tokens repeatedly, flooding
the bay queue; responders thrash to a lane that self-recovers before arrival
while *real* jams on other lanes wait. Throughput craters; flag `storm`.
Fix: `{type:'buyTank', laneIx}` — a tank between probe and gate (visible cyan
vessel). The tank's buffered reading gives the gate a hysteresis band; the
chatter stops; flag `stormQuelled`. This is the design doc's load-bearing
example (hysteresis is a *part*, not a config field) in its L3 costume.

**Milestones:** `firstJam` → `firstClear` → `fluency` (12 clears) →
`firstProbe` → `firstAutoClear` → `storm` → `tankInstalled` →
`stormQuelled` → `handsFree` (60 consecutive seconds with zero manual clears
while ≥6 lanes run) → `quota` (1500 banked).

**Harness asserts:** milestone order; clears/min peaks ≥ 4/min pre-automation
and falls to 0 in the final stretch; during the storm the bay queue exceeds 5
and post-tank falls back under 2; quota reached under `T_MAX = 480`s.

**Gallery:** `SMF 02 · The Jam` — "Clear belt jams by hand until your hands
saturate — then wire alerts as physical tokens, survive the alert storm, and
fix flapping with a tank."

### 4) `smf-parts-bench` — SMF 03 · Parts Bench (signal expressiveness)

**Design question:** the design doc's biggest stated risk — is
computation-as-plumbing expressive enough without a scripting language? This
prototype pressure-tests it with real contracts, and *documents where the
parts list fails* (that's a success condition, not a bug).

**World.** A schematic bench: 14×9 cell grid. Left edge: 4 source ports
emitting known deterministic streams (constant 10/s; square wave 0↔12 period
8s; slow sine 2..8 period 20s; triangle 0..10 period 30s). Right edge: one
contract socket. Between: the player places parts and traces.

**Parts** (palette; each occupies 1 cell; traces drawn cell-by-cell with a
direction, bandwidth 20/s):

| Part | Semantics (rate-based, per tick) | Visible failure |
|------|----------------------------------|-----------------|
| trace | carries in→out, cap 20/s | congestion glow when saturated; excess is lost upstream |
| merge | out = a + b (capped by out trace) | saturation glow |
| valve | out = k·in, k∈[0,1] drag-tuned | — (wrong k = everything downstream wrong) |
| ratio gate | out = min(a, b) | starved side glows |
| threshold gate | **two ports: SENSE + FLOW.** NO mode: passes FLOW while SENSE ≥ N; NC mode: passes while SENSE < N. N drag-tuned. Built-in narrow band only (chatter is real) | chatter flicker when SENSE hovers at N |
| tank | level += (in − out)·dt, cap 10; out = drain 4/s while level>0 else in | full/empty state readable at a glance |
| decay pipe | out = in·0.85^cells, adds lag | thinning token stream |

**Deviation to document (a real finding):** the design doc's threshold gate
has *one* input. Building the GUARD contract proves one input cannot
conditionally route a *different* stream — the minimal fix is the SENSE/FLOW
two-port gate above. The README's Findings section must state this precisely;
it is exactly the kind of evidence the Parts Bench exists to produce.

**Contracts (puzzle sequence, selectable tabs).** Each shows target `f(t)` vs
actual on a scrolling scope strip (target band = tolerance). Contract passes
after 12 consecutive seconds inside tolerance → flag.

1. `HALF` — from the 10/s source, deliver 5±0.5. (valve)
2. `BLEND` — deliver 0.5·sine + 0.5·constant ±1. (two valves + merge)
3. `STEADY` — from the square wave, deliver 6±1. (tank as averaging)
4. `GUARD` — deliver the constant stream only while sine < 4, else 0 (±1).
   (NC gate: sine→SENSE, constant→FLOW)
5. `LATCH` — from the triangle wave, deliver 4/s (the tank's drain) when the
   wave has been high recently, 0 when it has been low — i.e. open at ≥6,
   close only below 2 (hysteresis; target precomputed with that band).
   (triangle → valve → tank → gate… the Scenario 01 rig, rebuilt from parts)

**Player verbs:** `{type:'puzzle', ix}`, `{type:'place', part, gx, gz, dir}`,
`{type:'remove', gx, gz}`, `{type:'tune', gx, gz, value}` (valve k / gate N),
`{type:'mode', gx, gz}` (NO↔NC), `{type:'traceRun', cells}`.

**Graph evaluation:** rebuild the dataflow graph on topology change; evaluate
in topological order each tick. Cycles: every part in the cycle carries 0 and
flashes red (`CONFUSED`) — a visible failure, not an error dialog.

**Milestones:** `p1`..`p5` (contract passes) + `firstSaturation` (any trace
saturates) + `firstChatter` (any gate chatters ≥ 3 flips in 2s).

**Harness = existence proof.** The autoplayer *builds a known solution for
all five contracts* through `act()` and asserts each passes. If a contract
can't be solved by the harness, the parts list failed the pressure test —
change the parts (and document it), don't delete the contract.

**Gallery:** `SMF 03 · Parts Bench` — "No code, no nodes: solve five control
contracts with valves, tanks, and gates that jam, saturate, and chatter.
A pressure test of computation-as-plumbing."

### 5) `smf-the-seal` — SMF 05 · The Seal (L4 + blast radius UI)

**Design question:** the seal ceremony, the leaky abstraction, and above all
the **blast-radius preview** — the interaction the design doc calls "most
likely to need UI invention." Does breaking a seal *feel* expensive before
you do it?

**World.** A fixed-layout 2D dependency graph of ~14 modules in four tiers
(raw → intermediate → assembly → product), edges carrying typed rates
(`ORE 12/s`, `PLATE 4/s`, `FRAME 1/s`…). One intermediate module, `PLATE-A`,
starts *open* — its three internal parts visible (crusher → smelter →
buffer). Everything runs; ingot tokens flow along edges.

**Act 1 — the ceremony.** `act {type:'seal'}` (HUD button on the selected
module): a 5s measurement window animates (cyan sweep), the observed
throughput becomes the contract — `PLATE ≥ 4/s (sustained)` — and the module
collapses into a sealed chip with typed port badges. Downstream modules gain
small `assumes PLATE≥4/s` tags. Then the planner (automated) stamps two
copies of the sealed chip to feed a new assembly line — *the planner can only
place what has been sealed* (L5's dependence on L4, shown not told). Flags:
`sealed`, `plannerStamped`.

**Act 2 — the leak.** Scripted event: ore turns coarse. PLATE-A's *average*
holds at 4/s but delivery goes bursty (8/s for 4s, 0 for 4s). The contract
meter still reads PASS (it measures the average); the downstream assembly
starves each trough and its buffer overflows each burst; throughput of the
final product craters. HUD states the paradox in one line:
`CONTRACT: PASS · BEHAVIOR: FAILING` — flag `leak`. This is the L4 signature
failure: the contract is true and the behavior is still wrong.

**Act 3 — the blast radius (the UI experiment).** The player presses and
*holds* BREAK SEAL: a red wave propagates outward along dependency edges from
PLATE-A; every module that assumed the contract gets outlined, haloed, and
counted live in a tally beside the cursor:
`7 modules · 2 planner stamps · 3 contracts downstream · re-verify ≈ 40s`.
Releasing early cancels (flag `radiusPreviewed`); holding 1.2s commits — the
ring closes, the seal breaks (`sealBroken`), every downstream module drops to
`UNVERIFIED` (desaturated, hatched) and the planner's stamps halt.

**Act 4 — descend, fix, reseal.** The chip re-expands to its three parts; the
fix is one act: `{type:'fix'}` installs a surge tank after the buffer
(smooths the bursts). `{type:'reseal'}` runs a new measurement window — and
the new contract is *richer, because the failure taught it*:
`PLATE ≥ 4/s per any 2s window`. A green re-verification wave walks the same
radius the red preview showed, module by module, planner stamps resume, final
product rate recovers. Flags: `fixed`, `resealed`, `reverified`, `done`.

**Radius must be a pure sim function** — `computeRadius(state, moduleId)`
returns the dependent set + counts; the view animates it, the harness asserts
it (exact expected membership).

**Harness:** scripted timeline (seal at T+8, leak at T+30, preview at T+40
with an early release, commit at T+46, fix, reseal); asserts flag order,
radius membership (the exact 7 module ids + 2 stamps), product-rate crater
during the leak (< 40% of nominal) and recovery after reseal (> 90%).

**Gallery:** `SMF 05 · The Seal` — "Seal a module against a measured
contract, watch the contract stay green while the behavior fails, then hold
to preview the blast radius of breaking your own promise."

### 6) `smf-continental` — SMF · Continental (performance & wielding scale)

**Design question:** the whole game bets that *you can wield a massive
factory* — that the architecture (rates not items, tile field, LOD, derived
positions) scales to a continent, and that the player's late-game verb
(pouring the value field) still feels like control at that scale. Prove the
budget and prove the verb.

**World.** A big map: field grid **384×256 at tile size 4** (≈98k field
cells) on a ~1536×1024 world. Deterministic generation (seeded mulberry32,
seed in the HUD): ~120 ore provinces; each province seeded with an outpost
archetype (miners, smelters, rig) — target **≈50,000 structures** total.
Full Scenario-01 dynamics run everywhere: rigs pour where extraction runs,
field diffuses/decays on the big grid, structures wake/sleep/resorb by
neighborhood sensing, gradient reversal relocates dying provinces toward
surveyed ones. (Port the Scenario 01 rules; tune constants so the continent
is alive — always some provinces dying, some growing.)

**Perf architecture (the actual test):**

- Field: two `Float32Array`s, diffusion as a flat two-pass stencil; **no
  allocation per tick**.
- Structures: struct-of-arrays (typed arrays for x, z, type, state, timers),
  not 50k objects. Policy checks **staggered round-robin** (each structure
  sensed every Nth tick, N≈10) — document this as a scaling technique; the
  organism's reflexes are allowed to be slower than its heartbeat.
- View: Canvas 2D, camera pan/zoom across 3 LOD tiers by zoom level —
  (0) close: individual structures + token dots derived from clock;
  (1) mid: structure quads + field; (2) continent: field + province
  aggregates only. Draw only the visible rect; iterate via a coarse spatial
  index (per-tile structure buckets), never the full 50k list per frame.
- Speed buttons ⏸ ×1 ×8 ×32 (and ×128 headless). **Budget: at ×32, sim ≤
  8ms/frame and draw ≤ 8ms/frame at tier 2 on this container.**
- HUD perf card is a first-class citizen: structures alive/dormant/gone,
  µs/tick (rolling), draw ms, LOD tier, field cells. Perf is the content.

**The verb at scale.** The player wields the organism with the **pour brush**:
click-drag anywhere paints a survey emitter footprint (`act {type:'pour', x,
z, strength}` — rate-limited, costs matter income), and provinces migrate
toward it over minutes. One brush stroke redirecting a thousand structures —
that's the fantasy. Also `{type:'starve', x, z}` (dig a field trench) to make
the organism abandon a region. HUD shows a running count of structures that
relocated toward the player's last pour.

**Milestones:** `spawned` (50k built) → `steadyState` (first full minute with
births and resorptions both > 0) → `poured` (first player pour) →
`migration` (≥ 300 structures built inside the pour's province after it) →
`starved` (≥ 200 structures resorbed in the trench region).

**Harness = benchmark + gameplay.** Runs headless at ×128 equivalent: steps
N ticks at three population scales (5k / 20k / 50k) and prints a scaling
table (µs/tick per scale); asserts ≤ 120µs/tick at 50k on this container
(generous; record actuals in README), then runs the autoplayer pour/starve
script and asserts the gameplay milestones. Also asserts zero allocations
growth: `--expose-gc` optional, or simply assert heapUsed growth < 20MB over
the run.

**Gallery:** `SMF · Continental` — "Fifty thousand structures, one brush.
A performance testbed for wielding the whole organism: rates not items,
tile LOD, and a value-field verb that redirects provinces at continent
scale."

---

## Definition of done (each package)

1. `node harness.mjs` green (prints timeline + perf, exits 0).
2. `npx vite build` green from the package dir.
3. Loads with zero console errors; canvas visibly animating within 1.2s (the
   gallery screenshot delay) — the first painted frame must already look like
   the game, not a blank/loading state.
4. README.md: design question · hypothesis · how this prototype tests it ·
   controls · milestone list · **Findings** (real ones, discovered while
   building — especially deviations forced from the design doc).
5. `package.json` gallery field exactly as specced.
