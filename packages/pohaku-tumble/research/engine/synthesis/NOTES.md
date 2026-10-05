# synthesis — notes

The synthesis of the six engine-family studies for Pōhaku Tumble. `REPORT.md` has the result;
this file is the map for rerunning it. Nothing under `/home/user/vibe-dump` was modified; Jukugo's
`board.js` / `field.js` / `lexicon.js` and the tier files are read by absolute path.

Rerun everything: `./run-all.sh` (about an hour on 4 cores). Every run is seeded (board seed and
`Math.random` per seed), so a rerun reproduces every row exactly.

## Files

| file | what |
| --- | --- |
| `orig/` | untouched copy of `research/roots/sim/` (prepare, sim, lexicon.sim) |
| `prepare.mjs` | copies Jukugo's real `board.js` / `field.js` into `.build/` and patches in the knobs (header lists them): stock deal guard, `SIM.engine` → `pohaku.js`, `SIM.deal = 'fill'`, `scaleFloor`, `autoGrid`, `linkMax` ('auto' = the LINK_MAX rule), `pair.turnedAt`, `Board.canTurn` |
| `lexicon.sim.js` | the lexicon stand-in: `SIM.prune` (k-core), components, `COLLIDE`, `linkAuto`, 2-core membership |
| `pohaku.js` | **the engine**: `targets` (fresh-first tiers + rested return), reach lookahead, steering, `dealFill` |
| `sim.mjs` | the brief's harness (one random idle pair per 2.05 s beat), seeded; `pick: 'legal'`; extra metrics (header) |
| `dsim.mjs` | the Director model (copy of `../director/dsim.mjs`, made engine-aware; header lists the changes) |
| `engines.mjs` | every named configuration; `POHAKU` = the recommendation, `POHAKU -ret` = its grammar-clean fallback |
| `run-matrix.mjs`, `dsim-run.mjs` | parallel runners → `results/<run>.tsv` + `.jsonl`, with verdicts |
| `gen-*.mjs` | job generators (explore1, explore2, linkrule, dir1, ablation, ablation-extra, curve, ref, 128, steerview, boundary, boundary2, stocklong) |
| `ablation-table.mjs` | the markdown ablation table in REPORT §5 |
| `mklex.mjs` | checks the curves are nested prefixes of `curve-*-905` and writes sizes 150/200/250/275/350/450 to `lex/` |
| `lexstats.mjs` → `lexstats.tsv` | turn-graph facts per list (2-core, giant component, root collision, LINK_MAX rule) |
| `analyze.mjs` | min viable sizes → `results/minviable-{sim,dir}.tsv` |
| `tables.mjs`, `pivot.mjs`, `show.mjs`, `dshow.mjs` | printers (markdown curve tables, compact pivots) |
| `merge.mjs` | → `results.tsv` (every harness row) and `results-dir.tsv` (every Director-model row), `run` column first |

## Metrics

Harness (`sim.mjs`; one tick = one background beat = 2.05 s; 10 seeds × 1500 ticks unless noted):
`stallRate` = beats lost (ticks with no turn); `stuck` = mean share of pairs that cannot turn under
the rules in force even after resting (sampled every 10 ticks, whether or not the tick turned);
`stuckStrict` = the original harness test whatever the engine (no free word but the previous one);
`repeatRate` = turns onto a word in the pair's last 6; `bounce` = turns onto the immediately
previous word (included in repeat); `linked` = mean `linkedFraction()`; `seenAll` = share of the
full list ever shown; `noFresh` = picks whose pair had no free word outside its last 6 (a floor
under repeat that no chooseTurn can beat). Verdict columns `GOOD`/`JUKUGO_LIKE` judge on `stuck`;
`GOODs`/`JUKUGO_LIKEs` judge on `stuckStrict`.

Director model (`dsim.mjs`; 10 seeds × 3600 s at 1280×800): `beatsLost` = background beats with no
turn; `stuck` = max(frozen, frozenVis), frozen = cannot turn even after resting; `repeatRate` over
all turns (notes included); verdicts use `linkedVis` (share of in-view pairs on a root line);
`linkedAll` is the board-wide figure. Also `noteEarly`, `still60`, `top20`, `turnsPerMin`.

## Run order (what each file is)

1. `explore1`, `explore2` — first look at the candidate combinations (LINK_MAX rule pinned at its
   first setting c0 0.015 / floor 6.5). `explore1`'s "prune only" rows were produced with a broken
   config (dealMin 1 below floorMin 2: nothing dealt); `engines.mjs` now has the fixed version, so a
   rerun deals those rows.
2. `linkrule` — calibration of the LINK_MAX rule (c0 × floor). Chosen: c0 0.010, floor 5.
3. `dir1` — first Director-model pass: stock / REC / REC+ret, 4 grids, the 128 on tiny grids.
4. `ablation`, `dablation` — every component of REC+ret removed or swapped, both simulators.
   (The `REC+ret dealMin1` rows of the first pass were a broken config and were deleted; the
   rerun has `dealMin2` / `matchMin2` in their place.)
5. `curve`, `curve2`, `dcurve`, `dcurve2` — the full curve, 3 orders × 14 sizes × 4 grids.
6. `ref`, `ref-long`, `dref`, `dref-long` — Jukugo's own lexicon (30% vertical, cubes).
7. `w128`, `dw128` — the 128 attested words on boards of 5–66 pairs, 30 seeds.
8. `dsteerview` — Director passes the in-view linked share to chooseTurn.
9. `boundary`, `dboundary` — 30-seed and 4×-length reruns at every min-viable cell of POHAKU / POHAKU -ret
   (and the size below); `boundary2`, `dboundary2` — the cells round 1 moved, and POHAKU -ret's steady
   state on the auto board.
10. `stocklong` — stock's only GOOD cells (905 realistic/random, best-400; 9×8) at 30 seeds and 6000 ticks.
11. `ablation-extra`, `dablation-extra` — deal bound 2 and neighbour-match bound 2 (added after round 4).

## Caveats kept here

- In `sim.mjs` the rest rule never binds (a pair turns at most every 4 ticks = 8.2 s > 6 s), so
  `ret 0` = `ret 6` there; in the Director model it keeps a card's two turns from bouncing.
- `REC+ret -prune` computes COLLIDE on the unpruned list, so its LINK_MAX runs longer on the hub-heavy
  'best' lists; that, not liveliness, is why it does worse on 'best'.
- `attested-WA.json` keys roots by spelling (against the grammar); `curve-*-128.json` is the same 128
  words keyed by sense. Verdicts use the curve files; attested-WA rows are for comparison.
- A rerun of `gen-ablation.mjs` also picks up engines added to `engines.mjs` after round 4 (the `POHAKU` aliases, `dealMin2`/`matchMin2`, the steerView variants), so its row count grows; the rows reported here are unchanged.
