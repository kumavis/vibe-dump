#!/usr/bin/env bash
# Rebuild every number in NOTES.md. Reads Jukugo's src and the tier files by absolute
# path; writes only inside this directory. ~25 min on 4 cores. Runs are seeded
# (Math.random is replaced per seed), so a rerun reproduces results/ exactly.
set -euo pipefail
cd "$(dirname "$0")"
T=roots/.cache/tiers
node prepare.mjs                 # .build/: Jukugo board.js + field.js, patched (see prepare.mjs header)
node make-curves.mjs             # lexicons/: curve prefixes at 25-word steps (checked against the tier files)
node lexstats.mjs $T/attested-WA.json $(for o in realistic random best; do for n in 175 225 300 400 500 650 905; do echo $T/curve-$o-$n.json; done; done) > lexstats.tsv
node corecost.mjs $T/attested-WA.json $T/curve-realistic-{175,225}.json lexicons/curve-realistic-{250,275}.json $T/curve-realistic-300.json \
  lexicons/curve-realistic-{325,350}.json $T/curve-realistic-{400,500}.json lexicons/curve-realistic-{525,550,575}.json $T/curve-realistic-650.json \
  lexicons/curve-realistic-900.json $T/curve-realistic-905.json > results/corecost.tsv
mkdir -p results
for e in e1-stock e2-prune e3-deal e4-floor e5-fine e6-auto e7-confirm; do
  node sweep.mjs jobs/$e.mjs results/$e.jsonl
done
node totsv.mjs results/e{1-stock,2-prune,3-deal,4-floor,5-fine,6-auto,7-confirm}.jsonl > results.tsv
node minviable.mjs results/e5-fine.jsonl > results/minviable-e5.tsv
node minviable.mjs results/e6-auto.jsonl > results/minviable-e6.tsv
node boardlimit.mjs results/e5-fine.jsonl > results/boardlimit-e5.tsv
node occupancy.mjs results/e2-prune.jsonl results/e5-fine.jsonl > results/occupancy.tsv
# matrices for reading: node show.mjs results/e5-fine.jsonl '^core2\|realistic$'
