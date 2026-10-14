# critic-skeptic — notes

A skeptical review of the synthesis engine (`../synthesis`, `POHAKU`). Nothing under
`/home/user/vibe-dump` and nothing in other agents' directories was modified. The sim files here
are copies of the synthesis's files, plus extra metrics. Those metrics consume no random draws, so
the brief's metrics reproduce the synthesis rows exactly (checked: Director auto realistic-175 =
`dcurve2` row; harness auto realistic-175 = `curve2` row).

Rerun everything: `./run-all.sh` (about 25 min on 4 cores, seeded, exact). Results:
`results.tsv` (every row; the `file` column names the experiment) and the `results-*.jsonl` files.

## Files

| file | what |
|---|---|
| `prepare.mjs` | synthesis copy, plus one patch: `Board.turn` records `board.leftAt[word]` (used only by the `boardRecent` knob) |
| `pohaku.js` | synthesis copy, plus knobs: `noSteer` (no join/break bonus), `boardRecent {mode:'w'\|'tier', sec, w}` |
| `simx.mjs` | `sim.mjs` (the brief's harness, synthesis version) with the extra metrics below |
| `dsimx.mjs` | `dsim.mjs` (Director model, synthesis version) with the extra metrics below, plus a `cfg.capacity` override |
| `engines.mjs` | synthesis copy, plus variants at the bottom: `ret12/20/30/60`, `noSteer`, `reachCap5/10`, `br90w/br90tier/br180tier`, `-prune`, `-prune ret20/30` |
| `runx.sh` | one run: `runx.sh simx\|dsimx <engine> auto\|CxR <lex> [extra-json]` |
| `fmt.mjs`, `merge.mjs` | print JSON lines as TSV; build `results.tsv` |

## Added metrics (precise)

Harness (`simx.mjs`; time = tick × 2.05 s):
- `rep12`, `rep24`: share of turns landing on a word among the pair's last 12 / 24 shown words.
  This is the same as `repeatRate` (last 6) with a longer window. It uses its own uncapped
  history, not `pair.history`.
- `rec60`: share of turns landing on a word that left the board (any pair) at most 60 s earlier.
  `recOther60` is the same, restricted to words that last sat on a different pair. `gapMed` is the
  median time between successive landings of the same word anywhere.
- `pingOfBounce`: of the returns (landing on the immediately previous word), the share whose own
  previous turn was also a return (A→B→A→B). `top2bounce`: the share of returns made by the two
  pairs that return most.
- `homoNear`: mean share of pairs with a block that has a same-spelling, different-sense block
  on another pair within LINK_MAX (looks like a missing link).

Director model (`dsimx.mjs`):
- `rep12`, `rep24`: as above, over all turns (notes included).
- `recVis60` / `recVis180`: of the landings on an in-view pair, the share whose word sat on an
  in-view pair within the last 60 / 180 s. Sampled every 0.5 s.
- `noteRec300`: share of note (card) landings whose word was shown on a card in the last 300 s. A
  card shows its opening word and each landing.
- `bouncesPerHour`: returns per hour. `bounceGapMed` / `bounceUnder12`: median gap between a return
  and the pair's previous turn, and the share of returns under 12 s. `bounceAfterCard`: share of
  non-note returns within 15 s of a card on that pair turning or closing.
- `maxBounceStreak`: per seed, the longest run of consecutive returns by one pair (mean over
  seeds). `pairsStreak3`: pairs per run with a run of 3 or more consecutive returns. Both are
  per run, so a 2 h run counts twice the time of a 1 h run.
- `returnOnly` / `returnOnlyVis`: share of all / in-view pairs whose only legal move, even after
  resting, is back to the previous word. Each is sampled every 10 s. Strict stuck = `frozenVis +
  returnOnlyVis`, the Director-model counterpart of the harness's `stuckStrict`.
- `turnsPerMin / visible`: turns per minute per pair in view.

## Key measurements (10 seeds unless marked; Director = 1280×800, 1 h)

Recycling (Director): `rep24` / `recVis60` / `noteRec300`
- Jukugo stock: 0.173 / 0.145 / 0.296.
- POHAKU auto at realistic 175: 0.443 / 0.669 / 0.917.
- At 200: 0.265 / 0.577 / 0.880.
- At 225: 0.254 / 0.502 / 0.823.
- At 300: 0.150 / 0.395 / 0.734.
- At 500: 0.096 / 0.251 / 0.581.
- At 905: 0.066 / 0.127 / 0.341.
- Board-level recency rules (`br90tier`) move recVis60 at 200 from 0.58 to 0.42, but noteRec300
  stays at 0.88–0.89.
- Card capacity 1 or 2 (ret20, at 200) gives noteRec300 0.59 / 0.80, but turns/min fall to 41 / 53.

Rest length (Director auto; 30 seeds × 2 h):

| list | rest | frozen | repeat | returns/h | under 12 s | after card | pairsStreak3 (per 2 h run) |
|---|---|---|---|---|---|---|---|
| 175 | 6 s | 0.005 | 0.156 | 84.7 | 0.357 | 0.177 | 6.4 |
| 175 | 20 s | 0.007 | 0.149 | 47.2 | 0 | 0.003 | 1.2 |
| 175 | 30 s | 0.008 | 0.145 | 32.7 | 0 | 0.003 | 0.6 |
| 200 | 6 s | 0.002 | 0.083 | 39.1 | 0.330 | 0.180 | 2.7 |
| 200 | 20 s | 0.002 | 0.078 | 22.0 | 0 | 0.001 | 0.5 |
| 200 | 30 s | 0.002 | 0.076 | 16.0 | 0 | 0.005 | 0.3 |

- Harness, 30 × 6000 ticks:
  - realistic-175, stuck / repeat: 6 s 0.004 / 0.173; 20 s 0.004 / 0.165; 30 s 0.005 / 0.161.
  - realistic-200: 6 s 0.002 / 0.093; 20 s 0.002 / 0.087; 30 s 0.002 / 0.085.
- On fixed 9×8:
  - realistic-275: maxBounceStreak 15.2 (6 s) vs 10.9 (20 s).
  - realistic-300: 11.2 vs 6.8.
  - Frozen and repeat are equal or better with 20 s.

Strict stuck (Director), frozenVis + returnOnlyVis:
- auto 175: 0.047. auto 200: 0.020.
- 9×8 realistic-275: 0.085. 9×8 realistic-300: 0.045, which is above the JUKUGO-LIKE limit of 0.03.

Phone 390×844 (Director, auto board, 30 seeds):
- Only 7 pairs are in view at a time, and 12.3 of 17.9 are ever in view.

| list | repeat | rep24 | verdict |
|---|---|---|---|
| 175 | 0.226 | 0.611 | fails GOOD |
| 200 | 0.115 | — | JUKUGO-LIKE |
| 225 | 0.097 | — | JUKUGO-LIKE |

- 175 with a 20 s rest: repeat 0.205, still fails.
- Turns per minute per visible stone:

| viewport | POHAKU auto | Jukugo |
|---|---|---|
| phone | 5.9 | 3.9 |
| 1280×800 | 4.3 | 3.8 |
| 1920×1080 | 4.6 | 3.5 |
| 2560×1440 | 4.3 | 2.0 |

Linked steering (harness auto): mean linked with / without the join–break bonus

| list | with steering | without steering |
|---|---|---|
| 175 | 0.460 | 0.444 |
| 200 | 0.446 | 0.387 |
| 905 | 0.535 | 0.482 |

- Linked 10th–90th percentile at 175 / 200: 0.29–0.61. Jukugo: 0.46–0.57.
- A 5×4 board at 905 words: 0.40–0.61.
- Capping reach at 5 or 10 does not narrow the band.

Not an issue: `homoNear` ≤ 0.012 on every list measured. Dropping the 2-core with a 20 s rest
shows more of the list: 0.57 vs 0.47 at 175, and 0.70 vs 0.62 at 225. But recycling barely
moves (noteRec300 0.89 vs 0.92) and returns are 3–5× more frequent, so the synthesis's choice
stands.

## What the simulators cannot tell

- How a floor 28% of Jukugo's area carries DESIGN §3's island: 20–26 ahupuaʻa and 8 places.
- How a band-shaped floor looks on a portrait phone.
- Pokes (clicks).
