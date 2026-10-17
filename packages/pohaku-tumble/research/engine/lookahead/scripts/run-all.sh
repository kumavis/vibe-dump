#!/usr/bin/env bash
# Rebuild every number in results/ (about 30 min on 4 cores). Seeded: reruns are exact.
set -euo pipefail
cd "$(dirname "$0")"
node prepare.mjs                                   # patch Jukugo's board.js/field.js into .build/
mkdir -p jobs results
node graphstats.mjs attested-WA curve-realistic-128 $(for o in realistic random best; do for n in 175 225 300 400 500 650 905; do echo curve-$o-$n; done; done) > results/graphstats.tsv
for r in explore1 explore2 explore3 explore4 explore5 linkscale; do                 # exploration rounds, in order
  node gen-$r.mjs jobs/$r.json && node run-matrix.mjs jobs/$r.json results/$r.tsv > /dev/null
done
node gen-final.mjs jobs/final.json && node run-matrix.mjs jobs/final.json results/final.tsv > /dev/null
node gen-supp.mjs jobs/supp.json && node run-matrix.mjs jobs/supp.json results/supp.tsv > /dev/null
node gen-ablation.mjs jobs/ablation.json && node run-matrix.mjs jobs/ablation.json results/ablation.tsv > /dev/null
node gen-lamin.mjs jobs/lamin.json && node run-matrix.mjs jobs/lamin.json results/lamin.tsv > /dev/null
for r in steer bestlink long; do node gen-$r.mjs jobs/$r.json && node run-matrix.mjs jobs/$r.json results/$r.tsv > /dev/null; done
node analyze.mjs
node combine.mjs
