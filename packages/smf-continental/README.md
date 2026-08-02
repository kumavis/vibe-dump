# SMF 06 · Continental

Performance-scaling testbed for the Slime Mold Foundry design
(`docs/slime-mold-foundry/design.md`, prototype brief §6).

## Design question

The whole game bets that *you can wield a massive factory*: that the
architecture validated in Scenario 01 — rates not items, a tile field, LOD,
derived positions — scales to a continent of ~50,000 structures, and that the
player's late-game verb (pouring the value field) still feels like control at
that scale. **Prove the budget and prove the verb.**

## Hypothesis

A continent is a big `Float32Array` and a rate graph, not 50,000 entities. If
per-entity state is near zero and every hot loop touches only typed arrays,
50k structures tick in ~100µs and the whole organism answers a one-brush
gesture within sim-minutes.

## How this prototype tests it

- **World:** 384×256 field cells (98,304) over a 1536×1024 world; 120 ore
  provinces; ≈50,000 structures seeded deterministically (mulberry32, seed in
  the HUD, zero `Math.random` in the sim). Full Scenario 01 rules run
  everywhere: rig tank/gate hysteresis pours the field, the field diffuses
  and decays, structures wake/sleep/resorb by 3×3 neighborhood sensing, with
  commissioning grace and primed rigs. Provinces deplete, collapse, and are
  re-surveyed after regeneration — the continent churns unattended forever.
- **The verb:** the pour brush (`act {type:'pour', x, z, strength}`) paints a
  persistent survey emitter (rate-limited, costs matter); provinces migrate
  toward sustained pour because growth follows the field itself — *policy is
  fluid, not rules*. The starve trench (`act {type:'starve', x, z}`)
  suppresses the field so the organism abandons a region. The HUD counts
  structures relocated toward the last pour.
- **Harness** (`node harness.mjs`, also `npm test`): benchmark at three
  population scales plus a scripted autoplayer that earns every milestone
  through the same `act()` API the mouse uses.

## Controls

drag = pan · wheel = smooth zoom continent↔machine (anchored under cursor) ·
shift+drag or **B** = pour brush · right-drag / ctrl+drag = starve trench ·
speed ⏸ ×1 ×8 ×32 (keys 1–4).

## Milestones

`spawned` (50k built) → `steadyState` (first full minute with births > 0 and
resorptions > 0) → `poured` → `migration` (≥300 structures built inside the
poured province) → `starved` (≥200 resorbed in the trench).

## Perf architecture (what actually ships the budget)

- **Field:** two `Float32Array`s ping-ponged; diffusion+decay as one
  branch-free sliding-window stencil pass every 8th tick (k = 0.24, just
  inside the explicit-stencil stability limit k ≤ 0.25). The pass walks each
  8-row band in one contiguous span from first to last live 8×8 block, so
  empty margins are skipped whole and the inner loop carries no bookkeeping.
- **Structures:** struct-of-arrays typed arrays (x, z, type, state, timer,
  builtAt, province, cell, block); gone slots recycle through a free list.
  No allocation in any per-tick path.
- **Staggered policy round-robin:** each structure is sensed every 10th tick,
  as one contiguous 1/10 segment per tick (sequential over the SoA arrays —
  the prefetcher does the work). The organism's reflexes are slower than its
  heartbeat, and that is precisely why the heartbeat stays fast: a 50k
  organism does 5k policy checks per tick, and a wake/resorb decision
  arriving 1s "late" is invisible against a 12s resorb delay.
- **Analytic block bound:** the policy's neighborhood test is bounded by a
  per-block ceiling maintained *without touching cells*: under pure diffusion
  a block's max cannot exceed the previous max of its 3×3 block neighborhood,
  so `bound = dilate(bound)·decay + pourContribution` stays sound forever.
  Healthy-active structures prove themselves with one centre read; dormant
  structures in starved blocks prove `max < resorb` with zero reads.
- **Spatial buckets:** per-block CSR index (counting sort over 50k ≈ 210µs)
  rebuilt on a 60-tick cadence when dirty — never per frame. The view iterates
  only the buckets under the viewport.
- **LOD:** tier 2 (continent) = field image + 120 province aggregates; tier 1
  = structure quads via buckets; tier 0 = typed structures + clock-derived
  token dots (`frac(t·speed + goldenHash(i))` — tokens are never simulated).
  Structures crossfade in across the zoom band so continent→machine is one
  gesture.

## Measured on this container (actuals)

Scaling table (`node harness.mjs`, 1200 ticks after a 900-tick settle, one
process per scale):

| structures | µs/tick |
|-----------:|--------:|
|      5,000 |   77–85 |
|     20,000 |   89–103 |
|     50,000 |  103–115 |

Budget assertion: ≤ 120µs/tick at 50k — **passes** (typical ~108). Note the
sublinear curve: the field pass (~55µs amortized) is the flat floor all
scales share; 45k extra structures cost only ~30µs.

Heap growth across the 50k gameplay run: **< 1 MB** (assert < 20 MB) — the
free-list + preallocated kernels keep steady-state churn allocation-free.

In-page (headless Chromium, 1280×800, ×32 fast-forward at continent zoom):
sim ≈ 117–150µs/tick ⇒ **0.6–0.8 ms/frame** of sim at 60fps (budget 8ms);
draw ≈ **1.6–2.0 ms** at tier 2, 0.3–1.2 ms at tiers 0–1 (budget 8ms).

Gameplay: migration flag (300 builds) lands ~40 sim-seconds after the first
pour — at ×32 the thousand-structure redirection is visible in about one real
second. Starve resorbs 200+ structures within ~15 sim-seconds.

## Findings (discovered while building)

1. **Per-cell bookkeeping cost more than the stencil.** The naive pass
   (measured per-block maxima + lit-cell counting inline) ran ~680µs; the
   arithmetic alone is ~410µs. Every "cheap" per-cell branch doubled the
   field's cost. The fix was to stop measuring: the analytic block bound
   (above) replaced measured maxima with an upper bound that never reads a
   cell, and lit-cell counting moved to the view, which touches every visible
   cell anyway. *Derive, don't measure* turned out to apply to the perf
   scaffolding itself, not just to bot positions.
2. **Block-skipping does not save a healthy continent.** The design doc's
   tile abstraction implies sparse-field optimizations, but a living 120-
   province world keeps ~95% of 8×8 blocks above epsilon — the organism IS
   the map. Skipping only pays at the margins and after regional collapse.
   The real wins were cadence (field every 8th tick) and making the per-cell
   body smaller. Budget honesty: the field pass is a flat ~55µs floor that
   even the 5k world pays.
3. **V8 context specialization distorts multi-world benchmarks.** With one
   sim per process, TurboFan specializes the hot closures against their
   captured typed arrays (effectively compile-time constants). Creating a
   second world in the same isolate forces shared generic code — ~1.7×
   slower for *both*. A browser page runs exactly one world, so the harness
   benchmarks each scale in its own child process. A naive in-process loop
   over scales under-reports the architecture by nearly half.
4. **Kernel shape is load-bearing at scale.** Scenario 01's pour footprint
   (sharp gaussian) left the outer ring of large provinces at equilibrium
   field ≈ the dormancy threshold: thousands of rim structures flickered
   dormant from birth. Neighborhood sensing (design rule 1) was not enough —
   the *pour kernel* had to flatten (sharp 0.55 → 1.0) so a healthy
   province's rim sits safely above `dorm`. The organism's body is defined
   by its field's *shape*, not just its depth.
5. **The field can tick slower than the sim, but the view must hide it.**
   At `fieldEvery: 8` (0.8s cadence, k at the stability limit) the sim is
   correct but the field visibly steps at ×1. The view keeps a display-only
   lerped copy of the field — presentation state, so the data/view split
   survives — and the stepping disappears at every speed.
6. **Chromium clamps `performance.now()` to ~100µs**, so a single-tick burst
   at ×1 cannot be timed honestly (and mostly measures draw-evicted caches
   anyway). The HUD's µs/tick only folds in batched frames (≥3 ticks) and is
   seeded by a warmed 24-tick batch at boot. Perf-as-content needs the same
   care as any other instrument: a probe that lies is worse than none.
7. **Kept from Scenario 01 unchanged:** dormancy 0.5 / resorb 0.22 after 12s
   / decay 0.18/s / gate band 2–6 of 10 all survived a 400× population jump
   with only cadence changes — evidence the organism's temperament constants
   are scale-free, which the design doc hoped but had not shown.

## Run

```bash
node harness.mjs     # benchmark + autoplayer (exits non-zero on failure)
npx vite build       # bundle
npm run dev          # local dev server
```
