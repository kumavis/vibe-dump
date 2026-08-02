# SMF 05 · The Seal

Gameplay prototype for the **L4 seal ceremony**, the **leaky abstraction**
(contract PASS while behavior fails), and — above all — the **blast-radius
preview** for breaking a seal: the interaction
[`docs/slime-mold-foundry/design.md`](../../docs/slime-mold-foundry/design.md)
calls "most likely to need UI invention" (§8, *Reopening seals*; §3,
*Downward pressure*).

## Design question

Does breaking your own promise *feel expensive before you do it*? Sealing a
module (L4) creates a proof obligation and a blast radius; the game must show
that radius **before** the seal breaks, and the cost must land in the player's
hand, not in a confirmation dialog.

## Hypothesis

A **hold-to-break** verb — press and hold BREAK SEAL, a red wave propagates
outward along dependency edges, every dependent is outlined and counted live
beside the cursor, release early to cancel — turns the cost into something
physically felt (time under tension) rather than something read. The green
re-verification wave after resealing must walk the **exact same set** the red
preview showed, so the preview is a promise, not an illustration.

## How this prototype tests it

A fixed, authored dependency graph: 14 modules in four tiers
(RAW → INTERMEDIATE → ASSEMBLY → PRODUCT), typed rate edges (`ORE 12/s`,
`PLATE 4/s`, `FRAME 1/s`…), tokens view-derived from the clock. Four acts:

1. **The ceremony** — `seal`: a 5 s measurement window (cyan sweep) writes the
   observed throughput into a contract, `PLATE ≥ 4/s (sustained)`. The open
   module (crusher → smelter → buffer) collapses into a chip with typed port
   badges; downstream modules gain `assumes PLATE ≥ 4/s` tags. The planner then
   stamps **two copies** of the sealed chip onto the MINE-C field to feed
   PANEL-LINE — L5 can only place what L4 sealed, shown not told.
2. **The leak** — scripted: ore turns coarse. Delivery goes 8/s × 4 s, 0 × 4 s.
   The 8 s rolling average is *exactly* 4/s, so the contract meter genuinely
   reads PASS while downstream hoppers oscillate overflow/starve and the final
   product craters. One HUD line states the paradox:
   `CONTRACT: PASS · BEHAVIOR: FAILING`.
3. **The blast radius** — hold BREAK SEAL: red wave by dependency depth, live
   tally beside the cursor (`7 modules · 2 planner stamps · 3 contracts
   downstream · re-verify ≈ 40s`), a closing ring on the chip. Release < 1.2 s
   cancels; holding 1.2 s commits: 9 nodes drop to UNVERIFIED (hatched), the
   planner halts, the line stops.
4. **Descend, fix, reseal** — `fix` installs a surge tank inside the re-opened
   module; `reseal` measures again and writes a **richer contract taught by the
   failure**: `PLATE ≥ 4/s per any 2s window`. A green wave re-verifies the
   same radius, node by node, in the same order.

`computeRadius(state, moduleId)` is a pure sim function returning the exact
dependent set + counts. The view animates it; the harness asserts membership.

## Controls

- **SEAL PLATE-A** (button, or click the module) — start the measurement window
- **BREAK SEAL — HOLD** (button, or hold on the chip) — press & hold; release
  early to cancel, hold 1.2 s to commit
- **INSTALL SURGE TANK / RESEAL** — the fix-and-reseal path
- ⏸ ×1 ×4 ×16 speed · HIDE toggles the telemetry panel

## Milestones

`start → sealed → plannerStamped → leak → radiusPreviewed → sealBroken →
fixed → resealed → reverified → done`

## Harness

```bash
node harness.mjs     # or: npm test
```

Scripted autoplayer (seal T+8, preview with early release T+40, hold-commit
T+46, fix, reseal) through the same `act()` path the mouse uses
(`{type:'breakHold', on:…}` — the sim tracks hold duration). Asserts: flag
order; exact radius membership (`FRAME-SHOP, HULL-YARD, SERVO-LAB, PANEL-LINE,
CORE-ASSY, SHIP-DOCK, EXPORT-BAY` + `STAMP-1, STAMP-2`; 3 contracts; re-verify
estimate ≈ 40 s); product rate < 40 % of nominal during the leak and > 90 %
after re-verification; done < T+150. Typical run: done at T+94.9, ~16 µs/tick.

## Findings

- **The hold works, but only because of the last 0.3 s.** The wave covers the
  full radius by ~0.9 s and commit is at 1.2 s. Early tunings where the wave
  was still spreading at commit felt like the game punishing you for
  curiosity — you broke the seal *while still finding out* what that meant.
  The dead air between "you have now seen everything" and "it breaks" is where
  the hesitation lives. If the radius were larger the hold should lengthen to
  preserve that gap; the constant that matters is *seconds of complete
  information*, not wave speed.
- **The tally is the invention, not the wave.** The red outlines look dramatic
  but read as "lots of stuff over there." The counter beside the cursor —
  `7 modules · 2 planner stamps · 3 contracts downstream · re-verify ≈ 40s` —
  is what converts spectacle into a price, and the **`re-verify ≈ 40s` line is
  the only number that made breaking feel expensive** in play, because it's
  denominated in the player's own time, not in the factory's. It appears last,
  once the radius is fully revealed, which reads as the preview "finishing its
  quote."
- **The stamps forced a rule the design doc doesn't state:** the blast radius
  of a seal is not just its downstream cone — it includes every *instance* the
  planner stamped (same vocabulary word) and *their* cones. The preview draws
  dashed "word links" from PLATE-A to its stamps to explain why two modules
  with no physical connection to the broken chip light up. Without that link
  the stamps flashing red looked like a bug.
- **The leak needed a restart cost to be a leak.** With generous buffers and
  free restarts, bursty 4/s-average delivery was nearly as good as steady
  4/s — the abstraction barely leaked, the crater was ~66 %. The honest fix
  was in the *matter* layer: lean hoppers (~1.3 s of draw) and a re-prime
  delay (1.5 s) after any starvation trip. Then burstiness compounds down the
  four tiers (65 % → ~25 % of nominal at the dock) while the 8 s average
  stays a perfect, green, useless 4/s. Claim extracted: **averages leak
  wherever downstream has state** — the contract vocabulary must be able to
  talk about windows, which is exactly what the reseal writes.
- **Red/green symmetry held up and did real work.** Re-verification walking
  the same nodes in the same depth order (4 s each, ~36 s + the 5 s window ≈
  the previewed 40 s) makes the preview retroactively trustworthy: the second
  time players hold BREAK SEAL, they believe the number because they paid it
  once.

## Run

```bash
npm run dev        # from this package
npx vite build     # bundle to dist/
```
