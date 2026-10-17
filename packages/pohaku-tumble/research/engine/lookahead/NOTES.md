# Engine study — lookahead family (chooseTurn)

Rerun everything: `./run-all.sh` (~30 min on 4 cores). Every run is seeded (board seed and
`Math.random`), so reruns are exact — spot-checked across five result files.

## Files

| file | what |
| --- | --- |
| `prepare.mjs` | copy of the harness's; absolute paths; extra patches: `SIM.la` hook into `chooseTurn`, `pair.lastTurnAt`, `SIM.linkScale` (LINK_MAX and the deal's 9-unit radius), `SIM.dealComp`/`dealDensity`, `Board.prototype.canTurn` |
| `lookahead.js` | the engine: history tiers, fallback/cooldown return, `live`/`fresh`/`look2`/`reach` lookahead factors, courtesy, steering knob, component-aware deal |
| `sim.mjs` | copy of the harness's; seeded; `linkScale` "auto"/"half"; extra metrics; optional `pickFresh` |
| `lexicon.sim.js` | copy, absolute jukugo import |
| `run-matrix.mjs` | runs a job list in parallel → TSV with GOOD / JUKUGO_LIKE verdicts |
| `engines.mjs` | named configs (`stock`, `stock+deal`, `LA-turn`, `LA`, `LA-cool5`, `LA-min`, `LA-min-cool5`, `*+retry6`) and the ablation set |
| `gen-*.mjs` | job generators: `explore1..5` (search, in order), `linkscale`, `final`, `supp`, `lamin`, `ablation`, `steer`, `bestlink`, `long` |
| `analyze.mjs` | → `results/min_viable.tsv`, `results/curves.tsv` |
| `combine.mjs` | → `results/results.tsv` (every run, with a `run` column) |
| `graphstats.mjs`, `comps.mjs` | turn-graph degree and component statistics |
| `show.py` | pretty-printer for a results TSV |

## Metrics (means over dealt seeds; 10 seeds × 1500 ticks unless noted)

- `stallRate` (= beats lost): picked pair (after `retry` retries) made no turn.
- `stuck`: share of pairs that cannot turn **under the engine's own rules** (`Board.canTurn`), sampled
  every 50 ticks. For stock this is the harness's metric.
- `stuckStrict`: the harness's definition whatever the engine — no turn that is unused and not the
  previous word. It shows how many pairs live only on a return.
- `frozen`: share of pairs with no turn at all in the second half of the run.
- `repeatRate`: turn lands on a word in the pair's last 6 (unchanged). `bounce`: lands on the
  immediately previous word (A→B→A); bounces are included in `repeatRate`.
- `linked` (+ `linkedLo`/`linkedHi` = 10th/90th percentile of samples), `seenFrac` (unchanged).
- `noFresh` (diagnostic): share of picks where the pair had no target that is free and not in its
  last 6 — a floor under repeats + stalls that no chooseTurn can beat.
- `sd_*`: standard deviation across seeds (repeat ~0.01, stall/stuck ~0.005–0.02).

## The one structural fact

A turn never leaves its connected component of the turn graph (words one turn apart). The
component a word is dealt into is that pair's whole world for the run. With realistic-175, 99
words sit in one component, and every other component has 5 words or fewer. Stock deals into the
small ones (dealMin 1), and those pairs freeze for good: one-turn words whose only neighbour is
the previous word. That is most of stock's `stuck`, and it gets worse the longer the board runs.

## What each piece buys (ablation, `results/ablation.tsv`; realistic-300 on 9x8 unless noted)

| change | effect |
| --- | --- |
| **return when stuck** (`fallback`, or `cool` 5 turns) | stall 0.112 → 0.008; frozen → 0. The only big stall lever. |
| **history tiers** (`softK 6`, `softPen 0.03`, `strict`) | repeat 0.232 → 0.069. The main repeat lever. |
| **component-aware deal** (`dealComp 12`) | removes doomed pairs; without it, repeat 0.132, stuck 0.016, some frozen. Refuses to deal 65 pairs from 128 words (DEAL_HANG), which is correct. |
| **reach** (fresh words within 3 turns) | repeat −0.015 to −0.03 (lowers noFresh). |
| live-degree / fresh / look2 / courtesy | ≤ 0.01 each on top of reach — noise. Dropped in LA-min. |
| symmetric steering (above 0.55: join +0, break +3) | linked −0.02 to −0.03. |
| hard ban on last 2 / last 6 | worse: stuck rises, repeat falls only by stalling. |
| `pickFresh` (Director retries pairs to avoid a repeat) | hides repeats but starves pairs: frozen 0.17–0.23. Rejected. |
| `retry 6` (Director) | stock: stall → 0, but stuck stays 0.25 at 300 words. On top of LA: min_viable unchanged except one noise flip (realistic-225 5x4, linked 0.402 vs 0.399 at the 0.40 line). |

## min_viable (smallest size meeting the verdict, and every larger size on that curve)

The 128 point is `curve-*-128` (sense-tagged). Small grids use `linkScale "half"` = LINK_MAX ×
(72/cells)^0.25.

| grid (pairs) | stock GOOD / JL (realistic) | LA-min-cool5 GOOD / JL (realistic · random · best) |
| --- | --- | --- |
| 9x8 (65) | 905 / — | 300/300 · 300/400 · 400/400 |
| 7x6 (39) | — / — | 225/300 · 225/300 · 300/300 |
| 6x5 (27) | — / — | 225/225 · 225/300 · 300/300 |
| 5x4 (18) | — / — | 175/300 · 175/225 · 225/300 |
| 4x4 (14) | — / — | 175/300 · 175/225 · 225/300 |

- With `linkScale "auto"` (LINK_MAX × sqrt(72/cells)), realistic-225 is also JUKUGO-LIKE on
  5x4 and 4x4. At "half" it fails only on linked (0.37–0.40).
- The 128 words are never GOOD on any grid tried (best: 4x4, repeat 0.25).
- Stock reaches GOOD on no small grid at any link scale.
- Verdicts at the boundary points hold at 20 seeds × 3000 ticks (`results/long.tsv`).

## Caveats

- **attested-WA.json ≠ curve-*-128.json.** Same 128 words, but attested-WA has spelling-only roots
  (`ala`), while the curves have sense ids (`ala#0`). Both were measured. attested-WA links and
  turns slightly more.
- **"best" order fails on linked, not liveliness.** With LA it runs 0.72–0.84 at 175–300 words
  (stall/repeat ≈ 0). Almost every turn joins something, so no steering weight brings it below
  0.70; even a 10× join penalty only gets 0.83 → 0.80. LINK_MAX × 0.7 fixes best-300, but not
  175/225. LA raises linked by about 0.03–0.15 over stock, because lookahead favours words on
  common roots.
- **Content cost of the component-aware deal:** words outside components of 12+ never appear.
  seenFrac drops by about 0.01–0.07.
- `cool` is counted in global turns. One turn ≈ 2 s in the Director, so 5 ≈ 8–10 s. Noted pairs
  turn every 4–6 s, so the app should use a time-based ≥ 10 s rule.
- The sim's scheduler is uniform over idle pairs. The real Director only turns visible pairs and
  has noted-word beats, so measured stall/stuck are a model.
- How it looks (pacing of returns, link density on a smaller board) cannot be measured here.
