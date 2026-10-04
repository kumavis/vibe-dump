# lexicon-structure — the word list's shape, not the engine

Family: analyse the turn graph of each list, test k-core pruning, rank "bridge" candidates.
Everything here reruns with `./rerun.sh`. Nothing under /home/user/vibe-dump was modified.

## Harness changes (copies of research/roots/sim)

- `prepare.mjs`: absolute src path; two extra knobs, both defaulting to Jukugo's values:
  `SIM.keepSpacing` (a smaller grid keeps the 9x8 cell size, i.e. the floor shrinks with the pair
  count; grids marked `s`, e.g. `7x6s`) and `SIM.linkMax` (overrides `LINK_MAX` 11.5). `BUILD=` picks
  the output dir. `lexicon.sim.js`: absolute Jukugo import.
- `simx.mjs` = `sim.mjs` plus: `Math.random` seeded per seed (rows rerun to identical numbers, checked),
  and `stuck` split into `stuckPerm` (pair on a word with no turn even on an empty board, i.e. its only
  turn goes back to the word it just left, which `chooseTurn` forbids — under Jukugo's rules that pair
  never turns again) and `stuckBoard` (= stuck − stuckPerm: blocked only because exits are on the board).
  All other metrics exactly as `sim.mjs`: stallRate = beats lost / beats (after `retry`), stuck = mean
  share of pairs with zero legal turns (sampled every 50 ticks), linked = mean linkedFraction (every 10
  ticks), repeatRate = turns landing on a word in the pair's last-6 history / turns, seenFrac.
- Engines: `stock` = Jukugo rules with dealMin 1 (so it deals); `fix` = dealMin 2, matchMin 2, retry 6;
  `jukugo5` = Jukugo exactly (dealMin 5, matchMin 3); `+L<x>` = LINK_MAX x.
- Pruning (`k`): `k0` none; `k2` the 2-core (repeatedly drop words with < 2 turns among those left);
  `k2g` the 2-core's largest component; `k3`, `k4` k-cores.
- Base list: the 128 attested words **sense-keyed** (`curve-realistic-128.json`). `attested-WA.json`
  keys roots by spelling (87 of its 128 rows differ: `ala` vs `ala#0`); it is reported as `attested`
  in results-main but is not the right base for anything sense-keyed.

## 1. Structure (graph.tsv, struct.tsv)

| list | words | dead ends (deg 0/1) | deg >= 5 | 2-core | 2-core comps | mean deg |
| --- | --- | --- | --- | --- | --- | --- |
| attested 128 | 128 | 69 (31/38) | 18 | **52** | 4 (39+7+3+3) | 2.0 |
| realistic 175 | 175 | 75 | 39 | 92 | 4 | 2.7 |
| realistic 225 | 225 | 67 | 70 | 149 | 4 | 3.5 |
| realistic 300 | 300 | 72 | 141 | 224 | 5 | 4.8 |
| realistic 400 | 400 | 72 | 210 | 322 | 3 | 5.8 |
| realistic 500 | 500 | 71 | 299 | 421 | 3 | 6.9 |
| realistic 650 | 650 | 66 | 413 | 576 | 3 | 8.2 |
| full core 905 | 905 | 62 (18/44) | 669 | 834 | 1 | 11.2 |
| Jukugo | 1649 | 10 (2/8) | 1539 | 1637 | 1 | 13.9 |

- Dead ends don't go away as the list grows: ~62–76 at every size. A degree-1 word is an absorbing
  trap under Jukugo's rules (arrive from its only neighbour, and the only exit is the forbidden `prev`).
- The attested 2-core (52 words) is smaller than a 9x8 board (65 pairs): no deal rule can fill a full
  board with words a pair can leave. Two of its components are 3-word triangles (lau·hala/hoe/leʻa;
  wai·maka/ū/hoʻoluʻu): every turn after the second repeats.
- Degeneracy reaches >= 12 (cap of the scan) from 300 words; components shrink to one giant + a few
  3–7-word islands.
- Root concentration: `collide` = sum over roots of p², p = share of 2-core block faces. Jukugo 0.0039;
  realistic 0.007–0.012; `best` 0.025–0.054 (kū#0 in 38% of best-175's 2-core words), bridge orders 0.013–0.019.

## 2. Pruning (results-main, results-ladder, results-long)

- 2-core pruning removes every permanent trap (stuckPerm = 0 by construction) and that is most of what
  freezes pairs at every size. 9x8, realistic order:

| list | engine | k0 stall/stuck/repeat | k2 stall/stuck/repeat |
| --- | --- | --- | --- |
| 300 | stock | .250/.235/.263 | .059/.058/.285 |
| 300 | fix | .000/.212/.274 | .000/.069/.288 |
| 400 | stock | .152/.143/.233 | .043/.040/.245 |
| 500 | stock | .102/.089/.205 | .015/.013/.218 |
| 650 | stock | .069/.062/.172 | .007/.007/.176 |
| 905 | stock | .047/.044/.126 (stuckPerm .040) | .002/.002/.127 |

- Smaller pruned list beats larger sparse list: the 224-word 2-core of realistic-300 vs the unpruned
  225-word realistic list, fix 9x8: stuck .069 vs .322, repeat .288 vs .347.
- Traps accumulate. 15,000-tick runs (10x): unpruned realistic-905 stock stuck .044 -> .164;
  realistic-550 fix .081 -> .352; Jukugo itself .003 -> .020 (its 8 degree-1 words). Pruned: 905 k2
  .003, 550 k2 .030. A long-running unpruned board slowly freezes.
- Pruning does not touch repeats (+0.00–0.03). Repeat is structural: a board-free random walk on the
  2-core (walk.mjs, chooseTurn's degree weighting, no board) predicts the sim's repeat (r = 0.91 over 79
  lists; walkcheck.tsv) and it is the same on every grid (realistic-400 k2: .239 / .244 / .244 on
  9x8 / 7x6s / 6x4s). After pruning, repeat is what fails GOOD at every size below ~550 (realistic).
- k3/k4 cut stuck further but raise repeat and linked (realistic-400 fix: k2 .054/.239/.582,
  k3 .013/.253/.608, k4 .009/.265/.659); k2g ~ k2, slightly better at small sizes.
- Once pruned, the deal bound barely matters: Jukugo's engine unchanged (dealMin 5) on the 2-core of
  realistic-550 is GOOD on 9x8 (20 seeds: .005/.004/.193, linked .578). dealMin only has to drop when the
  2-core has fewer than ~65 degree-5 words (below ~400 realistic).
- Smaller grids help stuck (less of the list on the board) but not repeat, and at a fixed floor they
  thin the links (realistic-300 k0 linked .53 on 9x8, .32 on 6x4); `keepSpacing` keeps links ~.5.

## 3. Bridges (bridges.tsv, bridges-*-full.tsv, bridges-rep.tsv, robust.tsv, partial.tsv)

- Greedy from the 128: `S6` = sum over 2-core words of min(degree in 2-core, 6)/6 (deterministic);
  `core2` = 2-core size; `bridgeRep` = board-free walk repeat + penalties for hub share > 0.12 and
  collide > 0.012. 41 of the S6 top 60 are in all three top-60s (`consensus` column).
- 60 bridge confirmations take the 2-core from 52 to 152 (deg>=5 18 -> 113, dead ends 69 -> 36). The next
  60 realistic-order words: 105 (48 / 76); random: 94; `best`: 124 but walk-repeat .14 only via a kū clique.
- Sim, fix + 2-core, 9x8: bridgeRep is GOOD from 250 words (20 seeds: stall 0, stuck .020, repeat .199,
  linked .642), robust at 275; bridgeS6/core2 from 275. Realistic order needs 550.
- Partial confirmation (each lookup passes with p, 3 draws): at p = 0.75 the bridge order is GOOD on every
  draw after 300 lookups (~353 words; stuck .008, repeat .180) vs 600 lookups in realistic order. At
  p = 0.5 neither order gets there even after all 777 lookups (repeat ~.245).
- Caveats for the checker: the gain assumes earlier picks confirmed; 13 of the top 60 rest on
  modifier-like second roots (wale "without cause" 5, hewa "wrong" 5, ʻole "not" 3) — the same risk as
  hoʻo- (lines that only mean "both are negated"); 12 carry "homograph root: sense unresolved" (mostly
  kū), 2 "Wiktionary writes it as two words".

## 4. Min viable (minviable.tsv; 20-seed reruns in results-confirm / results-j5)

Smallest curve size meeting the threshold with every larger ladder size also passing (10 seeds;
boundary rows rerun at 20 seeds). 9x8 unless noted.

| engine | realistic GOOD / JL | random | best |
| --- | --- | --- | --- |
| stock, unpruned | 850 / — (750 passes, 800 fails at 20 seeds) | 905 / — | 400 / — |
| stock + 2-core | 550 / 905 | 650 / 905 | 450 / — |
| fix + 2-core | 550 / 905 | 600 / 905 | 450 / 850 |
| fix + 2-core + LINK_MAX 6.5 | 600 / — (≤650 run) | — | 200 / — |
| jukugo5 + 2-core (20 seeds) | 550 / 905 | — | — |
| fix + 2-core, bridgeRep order | 250 / — | | |

JUKUGO-LIKE is only reached at the full 905 after pruning: repeat <= 0.13 needs Jukugo-like mean degree.

## Files

- scripts: prepare.mjs, simx.mjs, lexicon.sim.js, lexgraph.mjs, graph.mjs, prune.mjs, ladder.mjs,
  walk.mjs, walkcheck.mjs, struct.mjs, bridges.mjs, bridgerep.mjs, annotate-bridges.mjs, robust.mjs,
  partial.mjs, partialsum.mjs, batch.mjs, jobs-*.mjs, verdict.mjs, view.mjs, tsv.mjs, minviable.mjs,
  rerun.sh; sim.mjs is the untouched original for reference.
- results: results.tsv (all 4,428 rows, verdicts), results-*.jsonl (raw), minviable.tsv, graph.tsv,
  struct.tsv, walkcheck.tsv, robust.tsv, partial.tsv, bridges.tsv (+ full orders).
- Can't be measured here: how a 2-core-only vocabulary or a hub root looks on the floor; whether the
  bridge words survive Pukui & Elbert; real Director timing (the sim's tick is one turn, ~2 s of display,
  so 1,500 ticks ≈ 50 min and 15,000 ≈ 8 h).
