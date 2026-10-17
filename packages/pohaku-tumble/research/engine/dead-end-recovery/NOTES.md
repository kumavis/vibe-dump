# dead-end-recovery — notes

The question: is it worth bending Pōhaku Tumble's grammar to rescue pairs that
freeze (no legal turn)? Short answer: **no**. Two grammar-clean changes do the
work. The first is a hand-off plus a back-and-onward double tumble. The second
weights `chooseTurn` against recent words. Together they reach GOOD at 225 and
JUKUGO-LIKE at 300 realistic words on a ~27-pair board. On the full 9×8 board
they reach JUKUGO-LIKE at 300. The grammar-bending recoveries buy nothing
measurable on top. Those are a double tumble through a word shown elsewhere,
and a frozen pair taking a duplicate word. Only re-dealing a frozen pair (not a
tumble at all) buys more, about one curve step.

## Files

| file | what |
| --- | --- |
| `prepare.mjs` | the harness's prepare, src path made absolute, plus: `SIM.linkMax`, `SIM.dealNear`, a counting `used` set (`SIM_USED`) so a duplicated word is not freed when one copy leaves, and `SIM.recentW` (a `chooseTurn` weight multiplier for a word in the pair's last 6) |
| `lexicon.sim.js` | unchanged but for the absolute Jukugo import |
| `engine.mjs` | `RBoard extends Board`: `freeExits`, frozen-cause `coverage`, `recover(pair, kind)` for each recovery below; seeded `Math.random`; `dealMin: "auto"` |
| `sim2.mjs` | harness-mode driver: the same scheduler as `sim.mjs` (a tick is a beat: a random pair not turned in the last 3 ticks, `retry` up to N others), plus frozen-spell tracking and recovery. Reproduces `sim.mjs` within seed noise on stock configs (checked) |
| `dir.mjs` | director-mode driver: a time-stepped model of `director.js` (background pulse 1.5–2.6 s, 3 note slots with Jukugo's timings, 6 s cooldown, rolling, camera drift and orthographic view of `main.js` at 1280×800). Gives per-minute rates and what is **in view** |
| `configs.mjs`, `grids.mjs` | the configurations and grid presets of the final runs |
| `jobs-*.mjs` → `runner.mjs` → `res-*.jsonl` | job lists, parallel runner, raw results |
| `results.tsv` | every final row (harness block first, then director block) |
| `verdicts.tsv`, `minviable.tsv`, `tables.txt` | G/J matrix, smallest viable sizes, the tables quoted below |
| `lexstats.mjs/.tsv` | graph facts per tier (dead-end words, 2-core) |
| `run-all.sh` | reruns everything (~40–60 min on 4 shared cores) |

`res-explore*.jsonl` are exploratory and were produced while the code was still
changing: before the `dtprev` fix (below) and before `stuckLong`/`stuckEff`
existed. Rerunning `run-all.sh` regenerates them with the current code. The
final numbers (`res-final`, `res-dir`, `res-linkmax`, `res-ref`) all come from
the current code.

## Definitions

- **frozen**: a pair with no single-block turn to a word that is not on the board and is not its previous word. These are Jukugo's rules, the same test as the harness's `stuck`.
- **stuck**: mean share of pairs frozen. Sampled after every beat, not every 50 as in `sim.mjs`. **All verdicts use this stock-rule definition**, even for configs whose recovery could move the pair. That makes it conservative.
- **stuckLong**: mean share of pairs that have been frozen for ≥ 120 beats. 120 beats is about 2 minutes of Director play.
- **stuckEff**: mean share of pairs that are frozen and that no configured recovery could move either. It ignores the R wait and scheduler eligibility. Sampled every 5 beats.
- **spell**: an unbroken run of beats (harness) or seconds (director) during which one pair stays frozen. A spell still running at the end is counted at its observed length.
- **beats lost** (harness `stallRate`): beats on which nothing turned, after retries and recovery. In director mode it is (background beats with no turn + noted turn attempts that found no turn) / (background beats + noted turn attempts).
- **repeat**: share of landings on a word the pair showed in its last 6. A double tumble counts once, judged on where it lands. A recovery move counts like any turn.
- **linked**: `Board.linkedFraction()`, board-wide. In director mode `linkedVis` is the share of in-view pairs wired to another word.
- **stuck in view** (director): the share of pairs inside the Director's view (margin 0.1) that are frozen, averaged over time.
- **fires**: recovery moves per 1000 beats (harness) or per minute (director).
- **transient dup**: a double tumble whose intermediate word is shown on another pair for one roll.
- **R / seek**: a recovery may fire on a pair only after it has been frozen ≥ R beats (or seconds). With probability `seek`, a beat goes to such a pair if one is eligible. Final configs: R = 5, seek = 0.3.
- **grids**: `9x8` is Jukugo's (~65 pairs). `7x6` is the same floor with fewer pairs (39). `7x6s`/`6x5s`/`5x4s` (39/27/18 pairs) scale LINK_MAX, the deal's near radius and (in director mode) the view by k = √(72/cells). That is the same as shrinking the floor so pairs keep Jukugo's spacing. `6x5s` at Jukugo's density is about one screen.
- Verdicts use the task's GOOD / JUKUGO-LIKE thresholds on harness rows (10 seeds × 1500 ticks). "Smallest viable" is the smallest measured size from which every larger measured size also passes.

## The recoveries and what they bend

| kind | move | grammar impact |
| --- | --- | --- |
| `back` | return to the previous word | none: a legal single-block turn to a real word. It only lifts the engine's no-immediate-return rule, so every firing is a repeat |
| `unblock` (hand-off) | the beat turns a pair Q that sits on one of P's exit words; the next beat gives P the freed word | none: two ordinary turns. The Director chooses which pair turns, not how |
| `dtprev` (clean double tumble) | two single-block turns in a row on one pair, the intermediate never a word shown elsewhere; on a frozen pair that means back to the previous word, then onward to a fresh one | none for the grammar: each step is a legal turn and no duplicate ever shows. Pace: one beat holds two rolls (+3% tumbles per beat inside BEST at 300 words, +12% when it is the only recovery) |
| `dt` (double tumble) | same, but the intermediate may be a word on another pair | minor: that word shows twice for one roll. The links could be held until the second landing, so none would be drawn to it |
| `dup` / `dupfar12` | a frozen pair turns into a real word already on the board (anywhere / only if every copy is ≥ 12 units away, i.e. beyond LINK_MAX, so the copies don't link to each other) | minor: a word shows twice until one copy turns. Within LINK_MAX the two copies wire to each other on both roots |
| `redeal` | lift both stones, drop a fresh word | major: not a tumble |
| off-screen redeal (director only) | one frozen pair outside the view is silently re-dealt per beat | minor: invisible unless the viewer drags to it at that moment |
| `recentW 0.05` (not a recovery) | `chooseTurn` multiplies the weight of a recent word by 0.05 | none |
| `dealMin: "auto"` | the largest bound ≤ 5 that leaves at least one deal word per grid cell (5 from 300 words up) | none: the deal can no longer hang |

`dtprev` had a bug in the first exploratory runs. It allowed the previous word
as the intermediate even when another pair had taken it. It is fixed: the
intermediate must not be on the board at all. Every final row uses the fixed
rule.

## 1. The baseline: how many pairs sit frozen, and for how long

Baseline = dealMin 2, matchMin 2, retry 6 (harness). The director-mode baseline
uses `bgRetry 6` and lets notes open only on pairs that can turn.

Harness, realistic curve (`tables.txt` §A):

| grid | words | stuck | spell mean / p90 (beats) | frozen time in spells ≥150 beats | pairs frozen ≥90% of the run | why frozen: dead end / prev only / board only |
| --- | --- | --- | --- | --- | --- | --- |
| 9x8 | 128 | does not deal (59 words with ≥2 turns < 65 pairs) | | | | |
| 9x8 | 225 | 0.33 | 143 / 578 | 82% | 12% | 54% / 30% / 16% |
| 9x8 | 300 | 0.22 | 229 / 1049 | 88% | 7% | 82% / 12% / 6% |
| 9x8 | 500 | 0.12 | 425 / 1287 | 93% | 4% | 85% / 11% / 4% |
| 6x5s | 225 | 0.41 | 327 / 1108 | 96% | 17% | 76% / 18% / 7% |
| 6x5s | 300 | 0.34 | 493 / 1233 | 97% | 11% | 93% / 4% / 3% |

- *dead end*: the word's only neighbour is the previous word, or it has none.
- *prev only*: the previous word is a neighbour and every other neighbour is on the board.
- *board only*: every neighbour is on the board.

Once a pair freezes it effectively stays frozen. Nothing in the stock rules
moves it. Only luck frees it: a neighbour vacating the right word. Most freezes
are dead ends, and those only a back-step can leave. Retry hides the lost beats
(beats lost → 0) but not the frozen stones.

**What the viewer sees is worse than the harness says** (director mode,
`tables.txt` §B):

- The Director only turns pairs in view, about 17 of 65, so dead ends pile up
  exactly where the camera is.
- At 300 words on 9x8 the baseline has 22% of all pairs frozen but **52% of the
  pairs in view**, with a mean spell of 427 s (p90 23 min).
- The stock Director loses **54% of its beats** there (33.6 tumbles/min against
  Jukugo's 64.5). Jukugo itself in this model: 1% lost, 0.8% of in-view pairs
  frozen.

## 2. Each recovery on its own (baseline + one recovery, R5/seek 0.3)

Realistic 300, 9x8 (harness; full grid in `tables.txt` §C):

| config | stuck | stuckLong | repeat | fires /1000 beats |
| --- | --- | --- | --- | --- |
| base | 0.216 | 0.167 | 0.274 | — |
| +back | 0.058 | 0.016 | 0.406 | 194 |
| +unblock | 0.209 | 0.170 | 0.297 | 31 |
| +dtprev | 0.062 | 0.024 | 0.328 | 115 |
| +dt | 0.048 | 0.024 | 0.329 | 126 (30 transient dups) |
| +dup | 0.221 | 0.181 | 0.287 | 29 |
| +dupfar12 | 0.212 | 0.168 | 0.286 | 20 |
| +redeal | 0.008 | 0.000 | 0.230 | 52 |
| +recentW only | 0.267 | 0.213 | 0.104 | — |

Per minute (director mode, realistic 300 / 225 on 9x8, 300 on 6x5s):

| config | fires/min | in-view stuck (base: 0.52 / 0.67 / 0.41) |
| --- | --- | --- |
| back | 4.1 / 8.3 / 1.8 | 0.07 / 0.24 / 0.03 |
| unblock | 0.14 / 0.43 / 0.09 | 0.56 / 0.65 / 0.40 |
| dtprev | 3.6 / 4.9 / 2.0 | 0.08 / 0.27 / 0.04 |
| dt | 3.9 / 5.7 / 1.9 (transient dups 1.5 / 2.6 / 0.3 per min) | 0.06 / 0.13 / 0.03 |
| dup | 0.76 / 2.7 / 0.58 | 0.50 / 0.51 / 0.40 |
| dupfar12 | 0.41 / 1.4 / 0.42 | 0.49 / 0.52 / 0.38 |
| redeal | 2.0 / 5.4 / 1.3 | 0.02 / 0.06 / 0.01 |
| off-screen redeal | 0.20 / 0.47 / 0 | 0.52 / 0.64 / 0.41 (no effect) |

- **dup is nearly worthless.** Only the "board only" share of freezes (≈ 6–30%)
  has a duplicate to take, so it barely moves stuck.
- **unblock alone** has the same small reach. But it is free in grammar, and it
  is the one recovery that lands on a fresh word without a repeat.
- **back and the double tumbles** cover the dead ends, which are most of the
  freezes. Back costs repeats. The double tumbles cost fewer, because they land
  two steps away.
- **The bending `dt` vs the clean `dtprev`:** at 300 / 9x8 stuck is 0.048 vs
  0.062 with the same repeat. In combination (below) the difference vanishes.
- **Off-screen redeal does nothing measurable.** Off-screen pairs are not turned,
  so they rarely freeze.
- **Recovery alone cuts stuck but raises repeat. `recentW` alone cuts repeat but
  raises stuck,** because pairs walk into dead ends instead of bouncing back.
  Together they work (§3).

## 3. Combined: BEST and its bending variants

- **BEST** = dealMin auto, matchMin 2, retry 6, recentW 0.05, recovery
  [unblock → dtprev → back], R 5, seek 0.3. The Director equivalent also lets
  notes open only on pairs that can turn.
- The variants swap in `dt` (BEST-dt), add `dupfar12` before back (BEST+dup),
  or put `redeal` in place of back (BEST-redeal).
- **redeal+rw** (redeal only) is the major-bend reference.

Harness, realistic, `lost/stuck/repeat/linked`:

| config | grid | 175 | 225 | 300 | 400 | 500 |
| --- | --- | --- | --- | --- | --- | --- |
| stock | 9x8 | .49/.48/.39/.47 | .33/.33/.33/.50 | .25/.24/.26/.51 | .15/.15/.23/.53 | .10/.09/.20/.55 |
| base | 9x8 | .01/.48/.45/.51 | .00/.33/.35/.53 | .00/.22/.27/.53 | .00/.12/.24/.53 | .00/.12/.20/.55 |
| BEST | 9x8 | .00/.36/.35/.61 | .00/.08/.24/.59 | **.00/.02/.12/.60 J** | .00/.01/.07/.59 J | .00/.00/.05/.58 J |
| BEST | 6x5s | .00/.08/.27/.65 | **.00/.02/.15/.56 G** | **.00/.02/.09/.57 J** | J | J |
| redeal+rw | 6x5s | **.00/.04/.12/.65 G** | **.00/.02/.09/.56 J** | J | J | J |

- BEST-dt, BEST+dup and BEST-redeal reach exactly BEST's thresholds on 9x8,
  6x5s and 7x6 (`minviable.tsv`). On 7x6s, BEST+dup and BEST-redeal pass GOOD
  at 225 where BEST misses by 0.002 in repeat (0.202).
- Inside BEST the bending moves rarely fire. At 300 / 9x8, director mode:
  dt's transient dups 1.2/min, dup 0.35/min, redeal 0.3/min.

Director mode, BEST (`lost / in-view stuck / repeat / linked in view / recovery
fires per min`):

| grid | 225 | 300 | 500 |
| --- | --- | --- | --- |
| 9x8 | .01/.23/.38/.68/10.4 | .00/.08/.19/.65/5.7 | .00/.03/.07/.62/1.5 |
| 6x5s | .00/.04/.17/.57/3.6 | .00/.03/.10/.60/2.5 | .00/.01/.04/.59/0.8 |

- At 300 BEST fires: 9x8 unblock 0.7, back 1.4, dtprev 3.6 per min; 6x5s
  unblock 0.2, back 0.06, dtprev 2.3 per min.
- Total tumbles ≈ 66–71/min against Jukugo's 64.5. The extra comes from
  double tumbles.
- Jukugo with BEST: repeat 0.108 → 0.009, recovery 0.02/min, nothing else
  changes. Harness and director rows are in `res-ref.jsonl`.

**On 9x8 the director model is harsher than the harness.** At 300, 9x8 is
GOOD-ish by director measures (repeat 0.19, in-view stuck 0.08). The 27-pair
board is Jukugo-like: repeat 0.10, in-view stuck 0.03, linked 0.60. A board
that fits the view spreads the turns over every pair instead of wearing out
the ~17 in view.

## 4. Smallest viable sizes (harness verdicts, `minviable.tsv`)

| engine | order | grid | GOOD | JUKUGO-LIKE |
| --- | --- | --- | --- | --- |
| stock (dealMin 1) | realistic | 9x8 | 905 | — |
| stock | realistic | 6x5s / 7x6 / 7x6s / 5x4s | — | — |
| stock | random | 9x8 | 905 | — |
| stock | best | 9x8 | 400 | — |
| base (dealMin 2, retry 6) | realistic | 9x8 | 650 | — |
| BEST | realistic | 9x8 | 300 | 300 |
| BEST | realistic | 6x5s, 7x6, 5x4s | 225 | 300 |
| BEST | realistic | 7x6s | 300 | 300 |
| BEST | random | 9x8 | 300 | 400 |
| BEST | random | 6x5s | 225 | 400 |
| BEST | best | 9x8 / 6x5s | 500 / 400 | 500 / 500 |
| BEST, LINK_MAX ×0.55 | best | 9x8 / 6x5s | 225 / 300 | 300 / 300 |
| redeal+rw (major bend) | realistic | 9x8 / 6x5s | 225 / 175 | 300 / 225 |

- On the "best" order, BEST has stuck and repeat near 0 from 175 words up. It
  fails on **linked 0.72–0.87 on 9x8** (0.68–0.87 on 6x5s): hub roots wire
  everything.
- That is a link-reach problem, not a recovery problem. LINK_MAX ×0.55 fixes it
  (`res-linkmax.jsonl`).
- At 128 (any order) nothing reaches GOOD. Only 52 of the 128 words are in the
  2-core (`lexstats.tsv`). 69 words have one turn or none.

## Caveats

- **Deterministic and seeded, but only 10 seeds.** Differences under ~0.01 in
  stuck and ~0.02 in repeat are noise. Example: 7x6s BEST misses GOOD at 225
  with repeat 0.202.
- **The director model is a model.** It has no user clicks, no drop-in, and no
  reserved chrome rectangles. Its view is computed at 1280×800 only. It ignores
  that Pōhaku's 1.5-wide slabs might call for a different zoom.
- **Per-minute figures come from it.** Harness "per 1000 beats" can be converted
  at about 65 beats/min (background 29 + noted 36 in this model), but the
  Director only turns visible pairs.
- **The sim cannot show how a move looks.** That covers a double tumble (two
  rolls back to back), a hand-off (a word "moving" from one pair to another), a
  transient duplicate, or a pair resting for 5+ beats before it recovers. Look
  at them in the app.
- **`recentW` is not a recovery.** It is a `chooseTurn` weight and carries much
  of BEST's repeat gain. Without it, a single recovery reaches GOOD no lower
  than 650 on the realistic curve (500 for the major-bend redeal on 7x6s).
  The pairing is the finding.
- **Two-word lists named "128".** `attested-WA.json` keys roots by spelling.
  `curve-*-128` uses sense ids (the grammar's rule). The verdicts use the curve
  files. Attested-WA rows are in the TSV for reference: BEST never passes on
  them either.
- **Stuck is judged by stock rules.** A pair resting before its R-beat recovery
  counts as stuck. stuckLong and stuckEff show such pairs rarely rest long:
  under BEST, stuckLong ≤ 0.01 from 225 words up on the realistic curve
  (0.025 on random-225, 9x8).
