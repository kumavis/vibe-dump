# POHAKU engine: independent reproduction

I built this from the written ENGINE SPEC only. I did not read `engine/synthesis/` or any other explorer's code.
Everything was rerun with `./repro.sh` (about 10 min on 4 cores).

## Files

| file | what |
| --- | --- |
| `prepare.mjs` | The original harness patches (src path made absolute), plus `SIM.scaleFloor` for the stock "s" grids, plus a **POHAKU build** into `.build/pohaku/`. That build is Jukugo's `board.js`/`field.js` with the deal, the TURN rules (`candidates`, `canTurn`, `reach`, `chooseTurn(pair, now, linked)`, `turn(..., now)`) and the scaled layout patched in. |
| `lexicon.pohaku.js` | The POHAKU lexicon: 2-core, component sizes, LINK_MAX rule, `autoGrid(P)`. |
| `lexicon.sim.js`, `sim.mjs`, `run.sh` | The original harness. Only the jukugo import path changed (now absolute). |
| `simx.mjs` | Harness driver: `sim.mjs` plus the POHAKU tick model and extra metrics (see below). |
| `dmodel.mjs` | **My own** Director model, built from jukugo `director.js`/`main.js` and the spec's Director changes. The reference DENGINES model was not part of the spec. |
| `batch.mjs` | The plans (`curve robust small128 grid65 ret ret6000 tick extra dcurve drobust`), run with 4 workers into `results/*.jsonl`. |
| `verdicts.mjs` | Writes `results.tsv` (every run, with verdicts under 3 stuck definitions) and `minviable.txt`. |
| `compare.mjs` | Compares the claimed curve rows with my measurements: `compare.tsv`, `compare.txt`. |
| `probe-lex.mjs` | Prints \|playable\|, LINK_MAX, COLLIDE, auto grid and component sizes for one LEX. |
| `lex/` | Prefix lexicons: `lex/<order>-<n>.json` is the first n entries of `curve-<order>-905.json`. |

## Harness tick model for POHAKU (`simx.mjs`, `engine:'pohaku'`)

Each tick is one beat. The pool is the pairs not turned in the last 3 ticks, filtered by `board.canTurn(p, now)`, as in the
spec's Director background beat. One pair is drawn uniformly. If the pool is empty, the beat is lost.
`now = t * 2 s`, and `chooseTurn(pair, now, board.linkedFraction())`.

## Metrics (all averaged over dealt seeds)

- **stall** (beats lost): ticks with no turn, divided by ticks.
- **sFree**: share of pairs with no turn onto *any* word that is not on the board. The previous word counts as available whatever the 6 s rest timer says, so this is "no legal turn once rested". Sampled every 10th tick. **The claimed "stuck" numbers fit this definition** (e.g. harness 128 5x4s: claimed 0.045, sFree 0.043, sLegal 0.070).
- **sLegal**: share of pairs with `canTurn(p, now)` false, i.e. the rest timer applied. Every 10th tick.
- **sStrict**: the `sim.mjs` definition, a frozen pair. No turn onto a word that is off the board and is not the previous word, so the return is not counted as an escape. Every 10th tick, with no stall bias. The original `sim.mjs` samples only on ticks that turned.
- **rep**: share of turns that land on a word in the pair's history (last 6). **returnRate**: share of turns that land on the immediately previous word.
- **lnk**: `linkedFraction()` every 10th tick, whether or not that tick turned. Needed so that the 128/9x8 row, where nothing ever turns, still has a value (0.444).
- **seen**: distinct words shown, deal included, divided by the *full* list. (128 words give 39/128 = 0.305, which matches the claim.)
- In the Director model, the rows in `results.tsv` use whole-board sFree/sLegal/sStrict (`stuck*Board`) and in-view linked.

GOOD and JUKUGO-LIKE (JL) are applied exactly as stated. **plain** = the smallest size that passes at 10 seeds × 1500 ticks, with every larger size tested also passing.
**robust** = the same, with the 30-seed run and the 6000-tick run (Director model: 12000 s) also passing wherever they exist.

## Results: harness, realistic order (10 seeds × 1500 ticks; robust adds 30 seeds and 6000 ticks)

| grid | GOOD claimed → measured | JL claimed → measured | notes |
| --- | --- | --- | --- |
| 5x4s | 175 → **175** | 200 → **200** | Same under all 3 stuck definitions. 150 fails on repeat (0.228). |
| auto | 175 → **175** | 200 → **200** | auto = 5x4 up to 225 words (P ≤ 149). |
| 9x8 | 250 → **250** | 275 → **275** | JL at 275 is on the edge at long horizons: repeat 0.111 / 0.116 (30 seeds) / 0.128 and 0.131 (6000 ticks) / 0.130 (30 seeds × 6000). **Under sStrict, 9x8 JL becomes 300** (sStrict 0.043–0.047 at 275). |
| 6x5s | 200 → 200 | 225 → **200** (mismatch) | Repeat at 200 measured 0.126 and 0.130, right on the 0.13 line. A coin-flip verdict. |

Rows: 128/9x8 = 1, 1, 0, 0.444, 0.305 (claimed 1, 1, 0, 0.444, 0.305). Only 39 words reach the component of 12 or more, so 26 pairs become holes. 905/9x8 = 0, 0, 0.001, 0.534, 0.682.
128/5x4s = stall 0, sFree 0.043 (sLegal 0.070, sStrict 0.164), rep 0.371, lnk 0.471 (claimed 0, 0.045, 0.378, 0.472). 905/5x4s = 0, 0, 0.001, 0.502, 0.632.
128 attested words (30 seeds): 3x3s (8 pairs) is GOOD (rep 0.191), 4x3s fails (rep 0.234). Both match the claim.
Across 160 claimed-vs-measured rates, 7 fall outside ±0.02, and **no verdict differs**. Harness 225/9x8 linked is consistently 0.50–0.52 against the claimed 0.494, over 5 disjoint seed sets.
POHAKU -ret (stuck = no legal turn, which with no return is sLegal = sStrict): auto 250/300, 9x8 300/400. Both match the claim. Frozen pairs grow with time: 9x8 at 275 is 0.077 at 1500 ticks and 0.138 at 6000.
Tick-length sensitivity: at 1 s per tick, a pair 4–5 ticks after its last turn may not return. sLegal rises slightly; no verdict changes.

## Results: Director model (my own `dmodel.mjs`, 10 seeds × 3000 s; robust adds 30 seeds and 12000 s)

5x4s 150/200 (claimed 150/200), auto 150 plain and 175 robust / 200 (claimed 150 "marginal, rep 0.198" / 200; I measure rep at 150 as 0.195–0.202), 9x8 275/300 (claimed 275/300).
Repeat, linked and seen match the claimed Director rows closely: 128/9x8 linked 0.424 against 0.425, 175/9x8 rep 0.844 against 0.842.
Seen runs 0.02 lower at 500–905, probably a shorter horizon.

## Assumptions made in dmodel.mjs

The viewport is 1280×800 (capacity 3), with jukugo's camera drift and inView/project formulas reimplemented and no user pan or zoom.
A pair is rolling for 0.98 s after a turn, and for 2 s at the start. A closing note is removed at once. A failed noted turn retires the note.
Linked passed to chooseTurn is the in-view share.

## Spec ambiguities and how I resolved them

1. **Sizes 150/200/250/275/350 are not tier files.** I used prefixes of `curve-<order>-905.json`. The tier files are exact prefixes of it, and the prefix of 350 gives LINK_MAX 11.05, as the spec says.
2. **Harness clock.** `now = t × 2 s`, from sim.mjs's "COOLDOWN 3 ≈ 6 s". At any tick length ≥ 1.5 s the cooldown means every eligible pair is rested, so in the harness the return is always allowed at tier 2. At 1 s per tick nothing changes in the verdicts.
3. **Harness pool.** It is filtered by `canTurn`, as in the spec's Director beat. That makes stall ≈ 0 by construction, so the `retry` knob does nothing. In the harness, chooseTurn gets the whole-board `linkedFraction()`.
4. **The definition of "stuck" is not given.** The claims fit sFree: no off-board turn, with the previous word counted as available and the rest timer ignored. It matters at one place, the 9x8 JL edge (275 under sFree/sLegal, 300 under sStrict, the sim.mjs "frozen" definition). For -ret the claims fit "no legal turn" (= sStrict).
5. **Sampling.** The claimed 128/9x8 linked value (0.444, with no turns at all) requires sampling linked and stuck regardless of whether the tick turned. sim.mjs samples only on turning ticks.
6. **seenFrac denominator.** It is the full list, not the playable set (0.305 = 39/128).
7. **"robust"** is not defined. I read it as also passing at 30 seeds and at 6000 ticks (Director model: 12000 s). "Min viable" is the smallest size at which it and every larger tested size pass.
8. **Grids.** "Both grids" I read as 9x8 and 5x4s. "5x4s" = 5×4 cells with the floor scaled (cell 4.67 × 3.625), about 18 pairs. I report auto as well.
9. **Layout.** `target` only sets cols/rows. The 8% random layout holes are kept, so a 5x4 board has about 17.9 pairs, not 18. With a fixed grid (9x8, 5x4s), BOUNDS still scale with cols/rows (on 9x8 that is the identity).
10. **Reach N.** Blocked set = words on the board ∪ the pair's history ∪ {current, entry}. BFS runs from the entry over both turn directions, 3 steps deep. Blocked words are neither counted nor walked through. The count stops at 40.
11. **Tiers.** The previous word is also in history. I test prev first: tier 2 if rested, otherwise skipped. `turnedAt` starts at −∞, which is harmless because a pair with no history has no prev.
12. **Deal.** As in stock, the near check comes before the 0.6 draw. The k = 5..2 fallback also runs when the near match finds no option. Pools are filtered by `ok` at pick time, with a uniform pick. Words outside the playable set have compSize 0 and are never dealt.
13. **2-core and links.** These compare parts exactly, sense ids included ("ʻau#0" ≠ "ʻau#1"). A non-playable word's degree, counted among survivors, is always < 2.
14. **chooseTurn.** `near`/`breaks` follow stock exactly: other pairs' tiles within LINK_MAX, with breaks judged on the turning tile's current root. Fields come from the harness's word hash. The weighted draw uses Math.random, as in stock, so harness runs are not reproducible per seed. Noise between 10-seed sets is about ±0.01.
15. **Director.** canTwo = some legal candidate w has a turn to a word not on the board. The current word is on the board, so it is excluded automatically.
16. **The Director model (DENGINES) is not specified** (viewport, camera, note closing, what "in view" means for the metrics). Mine is an independent construction. In it, the claimed POHAKU Director "stuck" fits a whole-board share (175/9x8: 0.539–0.542 against the claimed 0.544; in-view 0.69). The claimed *stock* Director "stuck" fits an in-view share (my first run: 128/9x8 0.881 against 0.874; 175/9x8 0.764 against 0.769; whole-board 0.635 and 0.399). Either the claims use different denominators for the two engines, or my model differs from theirs.
17. **Stock harness calibration.** stock realistic-300 9x8 dealMin 1 gives stall 0.228–0.251 (claimed 0.231). stock realistic-128 5x4s gives stall 0.675–0.689, stuck 0.54 (turn-sampled) or 0.64 (every-10), and linked 0.38, against the claimed 0.718/0.697/0.354. The stock "s" rows were not in my assignment, so I did not chase this.
18. **Unchecked layout parts.** layoutFeatures scaling is applied but unmeasured. main.js user.dx/dz from BOUNDS is not modelled.
