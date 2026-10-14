# deal-and-board — Pōhaku Tumble engine study

Family: the deal's degree bounds, a deal that cannot hang, board size, sizing the
board from the word list, and scaling BOUNDS / LINK_MAX. Turn rules (`chooseTurn`)
and the Director are **stock Jukugo** throughout (retry 0) unless a row says otherwise.

Rerun everything: `./run-all.sh` (~25 min on 4 cores; seeded, reproduces `results/` exactly).
All rows: `results.tsv`. Readable matrices: `node show.mjs results/e5-fine.jsonl '<name regex>'`.

## Harness changes (copy of research/roots/sim, absolute paths)

- `prepare.mjs`: same patches as the original, plus `LINK_MAX` and `BOUNDS` from `SIM`,
  and the whole `deal()` replaced (verbatim-matched) by one with modes
  `stock` (Jukugo, throws DEAL_HANG) / `fill` / `holes` / `weighted`, knobs `dealMin`,
  `matchMin`, `floorMin`, `gamma`, `nearR`, `matchP`. Holes are dropped and pairs renumbered.
- `lexicon.sim.js`: both sources (tier JSON or real Jukugo) go through the same
  keepFirst/keepSecond build; `SIM.prune = k` keeps only the k-core of the turn graph.
- `sim.mjs`: original metrics computed exactly as before (checked against the original
  harness on the Jukugo reference and on realistic-300). `Math.random` seeded per seed.
  `floor: 'scaled'` sizes BOUNDS to keep Jukugo's 4.67 × 3.625 cell; `linkScale` keeps a
  fixed floor and scales LINK_MAX and the deal radius by √(cell area ratio); `auto` sizes
  the grid from the list (`sizing.mjs`).
- `make-curves.mjs`: every curve tier file is a prefix of its `-905` file (checked), so
  25-word steps are prefixes of the 905 file (`lexicons/`).

New metrics (original ones unchanged):
`stuckAll` stuck sampled every 10 ticks whether or not the tick turned; `stuckStart` /
`stallStart` first 20% of ticks; `stuckEnd` / `stallEnd` last 20%; `trappedEnd` share of
pairs at the last tick whose word's only turn is the word they just left (frozen for good
under the no-immediate-return rule); `linked0` linked share of the opening deal;
`holes` pairs the deal left empty; `dealDeg` mean degree dealt; `seenAll` share of the
*full* (unpruned) list shown; `tpp` turns per pair.

## Findings

1. **Under stock turn rules, stuck pairs are trapped pairs.** A word with one turn can
   only turn back to where it came from, which `chooseTurn` forbids, so a pair that lands
   on it never moves again. `stuckEnd ≈ trappedEnd` in every stock row. Traps absorb, so
   stuck grows with run length: realistic-905 on 9×8 is GOOD at 1500 ticks
   (0.044 / 0.042, 30 seeds) and fails at 6000 ticks (stall 0.102, stuck 0.095, stuckEnd 0.149).
   Smaller boards are *worse* in 1500 ticks (each pair turns more often, so it finds a trap sooner).
   Jukugo at 6000 ticks: 0.010 / 0.010 (it has few one-turn words).
   Retry (Director tries other pairs) hides it: realistic-650 9×8, 6000 ticks, retry 6 →
   stall 0.000, stuck 0.172.
2. **The deal bounds barely matter after the opening.** dealMin 1–5 and matchMin 1–5 move
   steady-state stall/stuck/repeat/linked by ≤ 0.03 (noise level; `results/e3-deal.txt`).
   Higher dealMin lowers `stuckStart` a little and raises `linked0` (0.6 → 0.85; Jukugo's is 0.70).
   The deal's real jobs are: never hang, and open on lively words.
   - `fill` (draw from the unused pool; when it is empty step the bound down 5 → floorMin;
     only then a hole): always deals, identical to Jukugo when the pool is deep.
   - `holes`: shrinks the board by accident (attested 9×8 at dealMin 5: ~30 holes); scattered gaps.
   - sizing the board first is the right answer; `fill` then never needs a hole.
3. **The fix inside this family: play only the 2-core.** Drop, repeatedly, every word with
   fewer than two turns among the words still in play (Jukugo's "never deal dead ends", applied
   to the whole list). No pair can be trapped (`trappedEnd` = 0 in every row, all horizons).
   Cost: 40–57 words beyond the zero-turn ones (which stock can never show either) —
   `results/corecost.tsv`. Words actually *seen* in a run barely change (realistic-500 9×8:
   seenAll 0.72 stock vs 0.71 core2), because stock's trapped pairs stop showing new words.
   Degenerate case: if pairs ≥ words in play, nothing can turn (attested-WA 2-core = 62 words on a
   65-pair board → stall 1.00). So size the board from the playable set.
4. **Board size then sets stall/stuck, through occupancy = pairs / words in play**
   (`results/occupancy.tsv`): ≤ 0.10 → stall ≤ 0.02 and stuck ≤ 0.03 in 85–96% of rows;
   0.2–0.3 → only ~30%. Rule (`sizing.mjs`): pairs = clamp(round(0.10 × |2-core|), 10, 65),
   grid at Jukugo's 9:8 cell aspect, floor scaled. Realistic: 300 → 5×5 (23 pairs),
   400 → 6×6 (33), 525 → 7×7 (45), 650 → 9×7 (58), ≥ 700 → 9×8.
5. **Fewer pairs on a fixed floor thin the links.** Stock, fixed floor, 6×4: linked 0.23–0.44
   (fails the 0.35 floor on most lists); 4×3: 0.10–0.35. A scaled floor or a fixed floor with
   LINK_MAX ∝ cell size both keep linked at 0.55–0.61 on every grid (`e4`). They give identical
   numbers; which to use is a visual choice (Jukugo density on a smaller island, or fewer stones
   spread out with longer lines).
6. **LINK_MAX is a clean dial for linked** and touches nothing else (2-core, scaled floor):
   6 → ~0.41, 8 → ~0.50, 9 → ~0.53, 10 → ~0.55, 11.5 → ~0.59, 14 → ~0.63. Realistic lists run
   at ~0.58 with Jukugo's 11.5. LINK_MAX 9 brings them to Jukugo's ~0.51–0.53. The "best" curve is
   over-linked (0.7–0.85) and needs ~6–8.
7. **What binds after that is repeat, and repeat belongs to the turn rules, not the board.** On
   the 2-core, repeat depends only on list size: 0.30 at 250, 0.25 at 350, 0.22 at 450,
   0.20 at ~525–550, 0.17 at 650, 0.15 at 750, 0.13 at ~875–905. Grid, deal and LINK_MAX all
   leave it unchanged. Without the repeat threshold, the board side holds GOOD from 250–325
   realistic words on any grid ≤ 9×8, and JUKUGO-LIKE from ~300–325 with auto-sizing
   (`results/boardlimit-e5.tsv`, `e6`, 30-seed check: 325 auto → 0.009 / 0.009).

## Min viable (realistic curve; GOOD / JUKUGO-LIKE; "stable" = holds at every larger step)

| engine | 9×8 | 8×6 | 7×5 | 6×4 | 5×4 | 4×3 | auto (occ 0.10) |
|---|---|---|---|---|---|---|---|
| stock (dealMin 1, fixed floor) | 825 / – | – / – | – / – | – / – | – / – | – / – | n/a |
| fill + scaled, all words | 825 / – | 900 / – | 900 / – | 905 / – | – / – | – / – | n/a |
| 2-core + fill + scaled | 525 / 900 | 525 / – | 550 / – | 550\* / – | 550 / – | 575 / – | 525 / 900 |
| 2-core + fill + scaled + LINK_MAX 9 | 525 / – | 525 / – | 550 / – | 575 / – | 575 / – | 575 / – | 550 / 900\*\* |

"–" = not met at ≤ 905 (stock 8×6/7×5/6×4 first pass GOOD at 900, fail again at 905, stall 0.05–0.07;
30-seed stock 6×4 at 900: stall 0.065). \*10 seeds said 525; 30 seeds give repeat 0.205 at 525, 0.199 at 550.
\*\*900 meets JUKUGO-LIKE (repeat 0.129, 30 seeds); 905 is at 0.133. JUKUGO-LIKE is gated only by repeat ≤ 0.13.
Random curve ≈ realistic (2-core: 525–550 GOOD). Best curve: 2-core 350–425 (fails on linked > 0.70 below),
with LINK_MAX 9: 300–325. Attested 128: no configuration works (2-core = 62 words; 4×3 board:
stall 0.27, stuck 0.19, repeat 0.46).

## Recommended engine change (this family)

1. `lexicon.js`: after building the list, keep only the 2-core of the turn graph
   (iteratively drop words with degree < 2, rebuild keepFirst/keepSecond/BY_CHAR from the rest).
   Keep the full list for the glossary/cards if wanted.
2. `board.js deal()`: no rejection loop. Draw from the unused part of `degree >= 5`; when that
   is empty, step the bound down to 2; if nothing is left, drop the pair (renumber ids before
   any scene objects exist). It cannot hang.
3. `field.js`: grid from the list, `pairs = clamp(round(0.10 × |playable|), minPairs, 65)`
   (suggest minPairs ≈ 18–22 for the look; not measured); `BOUNDS` = cols × 42/9 by
   rows × 29/8, centred; `layoutFeatures` positions scaled by `BOUNDS` (its xs/zs are hard-coded
   for 42 × 29) — or, in Pōhaku, the island generator fits `BOUNDS`.
4. `board.js LINK_MAX` 9 (linked ≈ 0.53) or keep 11.5 (≈ 0.58). Unchanged on a scaled floor; on a
   fixed floor scale it, and the deal radius 9, by √(cell area / 16.9).

### What a scaled floor means for main.js (not measurable in the sim)

- `clampX/clampZ` use `BOUNDS ± 6 / ± 4`: on 4 cols the range is ±3.3, on 3 rows ±1.4. That's smaller
  than the drift amplitude (tx ±3.9, tz ±1.8), so the drift would flat-top against the clamp, and below
  ~2.6 cols / 2.2 rows the clamp inverts. Scale the drift amplitudes by min(1, range / amplitude)
  and guard the range at ≥ 0 (or a small floor so the camera never goes still).
- `user.dx/dz` limits are hard-coded ±18 / ±12 (≈ BOUNDS − 3 / − 2.5); derive them from BOUNDS,
  otherwise a drag past the clamp has a dead zone.
- At 1280×800 the view is ~27 × 21 floor units (ppu ≈ 47, pitch 55°), about 6 × 6 Jukugo cells. Boards
  at or under ~6×6 fit on one screen and show the floor edge (in Pōhaku: the whole island with sea
  round it). Optionally raise ppu to fit, capped at 60.
- Director: the background beat (one turn per 1.5–2.6 s) is board-size independent, but on a board
  that fits the view every pair is a candidate, so each stone turns more often (22 pairs ≈ every ~45 s
  vs ~60 s on 9×8; estimate, not simulated). With 4 notes open on a 10-pair board only ~6 pairs feed
  the background pulse.
- floor.js `marks()` / `border()` already read BOUNDS; scene3d's shadow reach is view-based; fine.

## Caveats

- The sim's scheduler turns any pair, so it overstates turns per pair for pairs the camera never sees;
  the real Director only turns visible pairs. Trap accumulation (stock) is therefore spread differently
  in time, not removed.
- The original `stuck` samples only ticks that turned, so it reads low when stalls are frequent
  (attested-WA stock 6x4: stuck 0.566 vs `stuckAll` 0.633). Where stall <= 0.05 the two agree within
  0.012 (p95 0.002, 2,384 rows). Re-judging every row with `stuckAll` changes no GOOD or JUKUGO-LIKE verdict.
- e1/e2 rows were run before `stuckStart/stallStart/cells` existed (blank in results.tsv); all other
  fields are the same definition.
- Field assignment for Hawaiian words is a hash (as in the original harness); field links are not counted
  in `linked`, so this doesn't affect any metric here.
