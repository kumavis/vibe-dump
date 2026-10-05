# Engine study — working notes

The report is [`../ENGINE.md`](../ENGINE.md). It ends with an independent reproduction and a critic's findings.

| folder | what it explored |
| --- | --- |
| `deal-and-board/` | deal bounds, a never-hang deal, board size from the list, scaled floor, LINK_MAX |
| `director/` | a line-for-line Director model (camera, in-view pairs, notes); retries, legal-only picks, note filters |
| `lookahead/` | chooseTurn weighting by onward reach; history rules |
| `reuse/` | distant duplicates; returning to the previous word |
| `dead-end-recovery/` | grammar-bending recoveries for frozen pairs (re-deal, double tumble, hand-off) |
| `lexicon-structure/` | the turn graph: dead ends, 2-cores, components; `bridges.tsv`, the unconfirmed candidates whose confirmation would most improve connectivity (a priority order for the Pukui & Elbert check) |
| `synthesis/` | the combined engine (`scripts/pohaku.js`, `engines.mjs`, `prepare.mjs`) and the full curves; `lexstats.tsv` |
| `repro/` | the independent re-implementation from the written spec |
| `critic-skeptic/` | the critic's added metrics (rep24, recVis60, strict stuck…) and per-viewport runs |

The `scripts/` folders hold the scripts as run, with folder separators in file names written as `__`. They read Jukugo's real `board.js` and `field.js` from `packages/jukugo-tumble/src/`, and the word lists from `roots/.cache/tiers/` (`../roots/build_lexicon.py`, `../roots/build_curves.py`). Expect to adjust scratch paths (`(scratch)/…`) before re-running. Large result tables were left out; the scripts regenerate them.

This was research only: no engine code in `packages/` was changed, and DESIGN.md is unchanged.
