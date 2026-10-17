# Director family — notes

Working dir: this folder. Nothing under /home/user/vibe-dump was modified.

## Files

| file | what |
| --- | --- |
| `prepare.mjs` | copy of the harness's, with absolute src path, plus three patches: `SIM.linkMax`, `SIM.scaleFloor` (floor shrinks with the grid so pair spacing stays Jukugo's), and `chooseTurn(pair, opt)` where `opt.weight(entry, index, pair)` multiplies an option's weight (no `opt` = unchanged) |
| `lexicon.sim.js` | the harness's, jukugo import made absolute |
| `sim.mjs`, `run.sh` | the original harness, unchanged apart from the paths; `oldsim.sh` runs it for the comparison rows |
| `dsim.mjs` | **the Director model** — the real Board driven by a line-for-line model of `director.js` + the camera drift of `main.js` + `Scene3D.project`; all knobs documented in its header |
| `runall.mjs` | runs a batch file in parallel → JSONL |
| `batches/*.mjs` | every batch that produced a number below (`configs.mjs` holds the reported configs) |
| `results/*.jsonl` | raw rows; `eval.mjs` → `results.tsv` + `min_viable.json`; `table.mjs` / `show.mjs` print tables |

Rerun everything (≈1.5 h on 4 cores; explore1–4 are 4-seed scouting runs, everything reported
below is 10 seeds × 3600 s):

```bash
node prepare.mjs
for b in explore1 explore2 explore3 explore4 matrix ablation views views_full explore5 release best final; do
  rm -f results/$b.jsonl; node runall.mjs batches/$b.mjs results/$b.jsonl 4
done
grep -v '"view":"full"' results/views.jsonl > v && mv v results/views.jsonl   # full rows superseded by views_full (bug below)
./oldsim.sh                                   # original harness, for comparison → results/oldsim.jsonl, oldsim.tsv
node eval.mjs results/{matrix,ablation,views,views_full,explore5,release,best,final}.jsonl > min_viable.txt   # → results.tsv, min_viable.json
node table.mjs results/final.jsonl --order=realistic                                # any table below
```

Later knobs default to off, so earlier batches rerun identically on the final `dsim.mjs`. One
bug was found and fixed mid-way: with `view: "full"` the camera's ppu was NaN, so every note score
after the first was NaN and only one note could open; the full-view rows were rerun
(`views_full.mjs`). No 1280×800 / 1920×1080 / 390×844 row was affected.

`chooseTurn` and the Director draw from `Math.random`, which `dsim.mjs` replaces with a seeded
mulberry32 per seed, so a rerun gives the same numbers (the deal is already seeded by the Board).

## The model (what `sim.mjs` simplified away)

`sim.mjs` turns one random pair per tick from all 65, 3-tick cooldown, no notes. The real Director:

- **turns only pairs in view** — `inView(0.1)` of a drifting orthographic camera. At 1280×800
  that is ~17 pairs at a time; 35 of 65 are ever in view in an hour, 29 never are (they keep
  their dealt word for good, which also takes that word out of everyone else's reach);
- **background pulse** every 1.5–2.6 s (first at 3.6 s), from visible, un-noted, idle pairs that
  last turned > 6 s ago;
- **notes** (capacity 3 at 1280 px, 4 at ≥ 1440, 1 on a phone): a card opens on an inner pair,
  turns it at +1.15 s and again 4.2–5.8 s later, closes 3.4 s after; it **retires the first time
  its pair can't turn**. Notes make ~55 % of all turns (Jukugo: 65 turns/min, 36 of them on notes);
- `rolling()` blocks a pair for 0.98 s after each turn and during the drop-in.

So each in-view pair turns ~3.7×/min — about ten times as often per pair as in `sim.mjs` — and
that is what exposes the failure mode below.

## Metrics (all per seed, then averaged over 10 seeds; 3600 s ≈ 1,750 background beats)

- **beatsLost** — background beats on which nothing turned / all background beats. Includes
  `lostEmpty` (no idle in-view pair at all — a pace problem, ~0 everywhere here) and `lostNoTurn`
  (the chosen pair, after any retries, had no legal turn).
- **frozen** — share of all pairs that cannot turn under the config's *own* rules (with
  `allowPrev`, a pair that can bounce back is not frozen), sampled every 10 s. **frozenVis** —
  the same among in-view pairs. **stuck (for the thresholds) = max(frozen, frozenVis).**
  `dead` = share of pairs whose word has no turn in the whole lexicon except back to the word it
  just left (permanent under stock rules).
- **noteEarly** — notes that retired because their pair couldn't turn, before making both turns /
  notes opened. `noteZero` — of those, the ones that never turned at all (a card that opens and
  closes on an unchanged word).
- **linked** — `Board.linkedFraction()` (all pairs), every 2 s. `linkedVis` — share of in-view
  pairs on a root line.
- **repeat** — share of turns landing on a word the pair showed in its previous 6 (bounces count).
  `bounce` — share of turns back to the word the pair just left.
- **fairness**: among pairs ever in view at a background beat, **top20** = share of all turns
  made by the busiest 20 % of them (Jukugo itself: 0.50, because centre pairs are in view more);
  `top20rate` = the same on turns per beat-in-view; `idle` = share that never turned.
  **still60** = mean share of in-view pairs that have not turned for 60 s (sampled every 10 s
  after the first 120 s) — the direct "nothing is moving here" measure.

## What the faithful Director shows

**Stock Jukugo rules fail at every list size, on every grid**, and not mainly because the deal is
too strict: with `dealMin 1` every lexicon deals on every grid (10/10). They fail because pairs in
view get **trapped**. A word whose only other turn is back to the word it just left is frozen
for good under "never return to the previous word". The same holds when its other turns all sit on
pairs that never move (the ~29 never-in-view pairs on 9×8). Pairs walk into these traps, and the
board's frozen share keeps climbing for as long as the page is open:

| stock, 9×8 | frozen at 10 min | 30 min | 60 min | 120 min |
| --- | --- | --- | --- | --- |
| realistic-300 | 0.21 | 0.27 | 0.30 | 0.34 |
| realistic-500 | 0.09 | 0.16 | 0.21 | 0.26 |
| realistic-905 | 0.03 | 0.06 | 0.09 | — |

(all pairs; in-view pairs are worse, e.g. 0.41 at 500 words). Even 905 words: beats lost 0.22,
stuck 0.18, notes retiring early 0.37. Jukugo's own lexicon under the same model: 0.010 / 0.008 /
0.027. The original harness put stock 905 at stall 0.049 / stuck 0.046 (`oldsim.tsv`), so
ROOTS.md's "~900 ≈ Jukugo" holds only for that simplified scheduler.

## Ablation (9×8, 1280×800, realistic curve; `results/ablation.jsonl`)

At realistic-300 (lost / stuck / noteEarly / repeat / linked / top20 / still60):

| config | lost | stuck | noteEarly | repeat | linked | top20 | still60 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| stock | 0.635 | 0.576 | 0.793 | 0.388 | 0.531 | 0.732 | 0.652 |
| retry 6 other pairs | 0.273 | 0.682 | 0.865 | 0.420 | 0.512 | 0.722 | 0.701 |
| pick only pairs with a legal turn | 0.102 | 0.631 | 0.844 | 0.419 | 0.523 | 0.701 | 0.649 |
| notes prefer ≥ 2 legal turns | 0.716 | 0.623 | 0.627 | 0.409 | 0.529 | 0.758 | 0.692 |
| bounce fallback (allowPrev) alone | 0.022 | 0.044 | 0.029 | 0.434 | 0.581 | 0.514 | 0.116 |
| + legal pick + note filters + noteFresh | 0.000 | 0.046 | 0.000 | 0.408 | 0.587 | 0.543 | 0.125 |
| + history weight 0.01 (= **D**) | 0.000 | 0.049 | 0.001 | 0.195 | 0.561 | 0.542 | 0.128 |
| **FINAL** (D + look 0.1 + bounceW 0.25 + release 2 s) | 0.000 | 0.041 | 0.000 | 0.173 | 0.551 | 0.549 | 0.154 |
| Jukugo lexicon, stock | 0.010 | 0.008 | 0.027 | 0.120 | 0.545 | 0.516 | 0.112 |

- **Retry / legal-only alone** hide lost beats but freeze *more* pairs (more turns, more traps).
  They do not concentrate motion beyond what freezing already does (top20 0.70–0.72 vs stock
  0.73; Jukugo's 0.52 is the exposure baseline: centre pairs are in view longer).
- **Note filters alone** cut early retirement (0.79 → 0.63 at 300, 0.37 → 0.00 at 905) but
  nothing else.
- **The bounce fallback is the one that matters**: stuck 0.576 → 0.044, lost 0.635 → 0.022.
  It costs repeats (every bounce is a repeat), which the history weight then pays back.
- With the bounce in, legal-only picking brings top20 back to Jukugo's level (0.51–0.55): **no
  concentration**. What *did* concentrate motion was picking only pairs with a fresh turn
  (`bgRetry: "fresh"`, explore2): repeat 0.18 → 0.11 but still60 0.12 → 0.44, so it was dropped.
  `bounceW 0.25` is a mild version of the same trade (still60 +0.02–0.04).
- **release** matters only where much of the floor is out of view: 9×8 realistic-400 stuck
  0.039 → 0.015 (JUKUGO-LIKE), 7×6 0.043 → 0.005. It makes ≤ 1 hidden turn/min from 300 words up
  (3.6/min at 175) and ~0 on 6×5s / 5×4s.

## Min viable size (smallest curve size from which every larger size also passes; 1280×800)

| engine | grid (pairs) | realistic GOOD / JUKUGO | random | best |
| --- | --- | --- | --- | --- |
| stock | any of 9×8, 7×6, 7×6s, 6×5s, 5×4s | — / — | — / — | — / — |
| D (director only) | 9×8 (65) | 300 / 500 | 400 / 500 | 500 / 650 |
| D | 6×5s (27) | 300 / 300 | 300 / 400 | 400 / 500 |
| **FINAL** | 9×8 (65) | **300 / 400** | 400 / 500 | 500 / 650 |
| FINAL | 7×6 (39, Jukugo floor) | 300 / 300 | 400 / 400 | 175 / 400 |
| FINAL | 7×6s (39) | 300 / 300 | 300 / 400 | 500 / 500 |
| FINAL | 6×5s (27) | **225 / 300** | 300 / 400 | 400 / 500 |
| FINAL | 5×4s (18) | 225 / 300 | 300 / 400 | 400 / 400 |

`s` = floor shrunk with the grid (same pair spacing as Jukugo). The "best" order is non-monotonic:
at 225–400 it fails only on linked > 0.70 (most-connective words share a few roots). LINK_MAX 9.5
fixes that (9×8: GOOD from 300, JUKUGO from 500; `BEST linkMax9.5` rows in `best.jsonl`) and
barely moves realistic-300 (linked 0.56 → 0.51). The 128 attested words pass nowhere (best case
FINAL 5×4s: lost 0, stuck 0.041, repeat 0.311).

Viewport check (FINAL, realistic): 1920×1080 (capacity 4, 77 turns/min) and 390×844 phone
(capacity 1, 41 turns/min) give the same pass sizes on 6×5s, and on 9×8 within one step
(phone 9×8: GOOD needs 400 because repeat at 300 is 0.208). Two-hour runs (BEST = FINAL without
release; `views.jsonl`, "(2h)" rows): the frozen share is flat (9×8 r300: 0.050, 0.052, 0.047,
0.038 at 10/30/60/120 min; 6×5s r225: 0.034, 0.044, 0.041, 0.041) while stock's climbs.

## Recommendation

FINAL, with the board sized from the confirmed list: **6×5 with the floor scaled** (27 pairs; at
1280×800 that is still ~17 pairs in view, as many as Jukugo shows) while the list is 225–400,
Jukugo's 9×8 from ~400 up. Deal `degree ≥ 1`, keep `matchMin 3`. Watch linked once the real
list exists; if it runs above 0.70, lower LINK_MAX to ~9.5.

## Caveats

- Not modelled: user drag, zoom and pokes; DOM/layout timing of cards; frame drops. Step 1/30 s.
- Not measurable here: how a bounce reads on a card ("was X" then back to X); whether a line
  running off screen visibly lets go when `release` turns its far end; how the floor's edge looks
  on a 6×5s / 5×4s floor (28 × 18 / 23 × 14.5 units against a ~27 × 21 view, so the island's
  coast shows).
- `linked` (Board.linkedFraction) includes the never-in-view pairs, which keep their dealt,
  neighbour-matched words; `linkedVis` (in-view pairs only) is in `results.tsv`.
- Means over 10 seeds; seed-to-seed spread is not reported, so rows within ~0.01 of a threshold
  (6×5s r225 repeat 0.182; 7×6s r225 repeat 0.213; 9×8 r400 stuck before release 0.039) should be
  read as borderline.
