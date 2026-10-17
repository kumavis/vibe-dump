#!/usr/bin/env bash
# Rebuild every number in results/ (about 60 min on 4 cores). Every run is seeded; reruns are exact.
set -euo pipefail
cd "$(dirname "$0")"
node prepare.mjs                                   # patch Jukugo's board.js / field.js into .build/
node mklex.mjs                                     # in-between sizes as prefix slices of curve-*-905 → lex/
mkdir -p jobs results
T=roots/.cache/tiers
{ echo -e "lex\twords\tdeg1\tdeg5\tcore2\tgiant2\tcore2deg5\tcollide\tcollide2\tlinkAuto"
  LEX=jukugo NAME=jukugo node lexstats.mjs
  for o in realistic random best; do for n in 128 175 225 300 400 500 650 905; do LEX=$T/curve-$o-$n.json NAME=$o-$n node lexstats.mjs; done; done; } > lexstats.tsv
# exploration (in the order it was run; engines.mjs has since gained names, the configs these use are unchanged)
node gen-explore1.mjs jobs/explore1.json && node run-matrix.mjs jobs/explore1.json results/explore1.tsv
node gen-explore2.mjs jobs/explore2.json && node run-matrix.mjs jobs/explore2.json results/explore2.tsv
node gen-linkrule.mjs jobs/linkrule.json && node run-matrix.mjs jobs/linkrule.json results/linkrule.tsv
node gen-dir1.mjs jobs/dir1.json && node dsim-run.mjs jobs/dir1.json results/dir1.tsv
# ablation / interaction check, both simulators
node gen-ablation.mjs jobs/ablation.json && node run-matrix.mjs jobs/ablation.json results/ablation.tsv
node gen-ablation.mjs jobs/dablation.json dir && node dsim-run.mjs jobs/dablation.json results/dablation.tsv
node gen-ablation-extra.mjs jobs/ablation-extra.json && node run-matrix.mjs jobs/ablation-extra.json results/ablation-extra.tsv
node gen-ablation-extra.mjs jobs/dablation-extra.json dir && node dsim-run.mjs jobs/dablation-extra.json results/dablation-extra.tsv
# the full curve: 3 orders x 14 sizes x 4 grids x 4 engines, 10 seeds, both simulators; Jukugo reference
node gen-curve.mjs jobs/curve.json sim 'stock,REC,REC+ret,REC+ret -prune' '9x8,6x5,5x4,auto'
node run-matrix.mjs jobs/curve.json results/curve.tsv
node gen-curve.mjs jobs/dcurve.json dir 'stock,REC,REC+ret,REC+ret -prune' '9x8,6x5,5x4,auto'
node dsim-run.mjs jobs/dcurve.json results/dcurve.tsv
node gen-steerview.mjs jobs/dsteerview.json && node dsim-run.mjs jobs/dsteerview.json results/dsteerview.tsv
# the final engine (POHAKU = REC+ret, + steerView in the Director model) and its grammar-clean fallback
node gen-curve.mjs jobs/curve2.json sim 'POHAKU,POHAKU -ret' '9x8,6x5,5x4,auto' && node run-matrix.mjs jobs/curve2.json results/curve2.tsv
node gen-curve.mjs jobs/dcurve2.json dir 'POHAKU,POHAKU -ret' '9x8,6x5,5x4,auto' && node dsim-run.mjs jobs/dcurve2.json results/dcurve2.tsv
node gen-ref.mjs jobs/ref.json sim && node run-matrix.mjs jobs/ref.json results/ref.tsv
node gen-ref.mjs jobs/ref-long.json sim 10 6000 && node run-matrix.mjs jobs/ref-long.json results/ref-long.tsv
node gen-ref.mjs jobs/dref.json dir && node dsim-run.mjs jobs/dref.json results/dref.tsv
node gen-ref.mjs jobs/dref-long.json dir 10 7200 && node dsim-run.mjs jobs/dref-long.json results/dref-long.tsv
# the 128 attested words on tiny boards (30 seeds)
node gen-128.mjs jobs/w128.json sim && node run-matrix.mjs jobs/w128.json results/w128.tsv
node gen-128.mjs jobs/dw128.json dir && node dsim-run.mjs jobs/dw128.json results/dw128.tsv
# min viable sizes, then boundary checks (30 seeds and 4x-long runs) at those cells
node analyze.mjs results/minviable-sim.tsv results/curve.tsv results/curve2.tsv
node analyze.mjs results/minviable-dir.tsv results/dcurve.tsv results/dcurve2.tsv
node gen-boundary.mjs && node run-matrix.mjs jobs/boundary.json results/boundary.tsv && node dsim-run.mjs jobs/dboundary.json results/dboundary.tsv
node gen-boundary2.mjs && node run-matrix.mjs jobs/boundary2.json results/boundary2.tsv && node dsim-run.mjs jobs/dboundary2.json results/dboundary2.tsv
node gen-stocklong.mjs jobs/stocklong.json && node run-matrix.mjs jobs/stocklong.json results/stocklong.tsv
node merge.mjs                                     # → results.tsv (every row of every run, with a `run` column)
