#!/usr/bin/env bash
# Rebuild every number in this directory. Node only; reads Jukugo's src and the tier lists from
# /home/user/vibe-dump by absolute path, writes only here. Simulation rows are seeded (simx.mjs), so
# a rerun gives the same numbers. Total ~1-2 h on 4 free cores.
set -euo pipefail
cd "$(dirname "$0")"
node prepare.mjs                 # .build  (Jukugo board.js/field.js patched; knobs default to Jukugo's values)
BUILD=.build2 node prepare.mjs   # .build2 (same files; the LINK_MAX batches were run against this copy)
node graph.mjs                   # graph.tsv   turn-graph structure of every curve list
node prune.mjs                   # lex/*.k{0,2,3,4}.json  k-core-pruned curve lists
rm -f results-*.jsonl
node batch.mjs jobs-main.mjs results-main.jsonl            # curve lists x k0/k2/k3/k4 x stock/fix/jukugo5 x 5 grids
node bridges.mjs S6 777 bridges-S6-full.tsv               # greedy bridge orders (full) -> lex/bridge-*-order.json
node bridges.mjs core2 777 bridges-core2-full.tsv
node bridgerep.mjs 400                                     # walk-targeted bridge order -> lex/bridge-rep-order.json
node ladder.mjs                  # lex/ladder/<order>-<size>.{k0,k2,k2g}.json
node struct.mjs                  # struct.tsv  degree / walk-repeat / root-collision per ladder list
node walkcheck.mjs               # walkcheck.tsv  walk-repeat proxy vs sim repeat
node robust.mjs                  # robust.tsv  bridge order under partial confirmation (structure only)
node annotate-bridges.mjs        # bridges.tsv  top 60 bridges, annotated
# The ladder was run as jobs-ladder.mjs (interrupted after the `best` order) + jobs-ladder2.mjs (the
# rest, trimmed). jobs-ladder2.mjs on an empty file reproduces all of it except the best-order
# stock+k2g rows.
node batch.mjs jobs-ladder2.mjs results-ladder.jsonl
BUILD=.build2 node batch.mjs jobs-linkmax.mjs results-linkmax.jsonl
BUILD=.build2 node batch.mjs jobs-rep.mjs results-rep.jsonl
BUILD=.build2 node batch.mjs jobs-confirm.mjs results-confirm.jsonl   # 20-seed reruns at the min_viable boundaries
node partial.mjs && BUILD=.build2 node batch.mjs jobs-partial.mjs results-partial.jsonl && node partialsum.mjs
node batch.mjs jobs-j5.mjs results-j5.jsonl                # Jukugo's engine exactly, on pruned lists
node batch.mjs jobs-long.mjs results-long.jsonl            # 15,000-tick runs
node tsv.mjs                                               # results.tsv  (every row, with verdicts)
node minviable.mjs results-ladder.jsonl results-linkmax.jsonl results-rep.jsonl   # minviable.tsv
