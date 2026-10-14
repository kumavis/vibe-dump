#!/usr/bin/env bash
# Rebuild every number in NOTES.md / results.tsv from scratch. ~2 h on 4 cores.
# Reads Jukugo's engine and the tier files from /home/user/vibe-dump (read-only).
set -euo pipefail
cd "$(dirname "$0")"
node prepare.mjs          # patch Jukugo's board.js/field.js into .build/
node mklex.mjs            # intermediate curve sizes (prefix slices of curve-*-905)
for s in s1 s2 s3 s4 s5 s5b s6 s7; do node run.mjs $s; done  # uniform-scheduler sim (sim.mjs)
for s in d1 d2 d3; do node dirrun.mjs $s; done              # Director-faithful sim (dirsim.mjs)
node minviable.mjs results/s3.jsonl > results/minviable-s3.tsv
node minviable.mjs results/s5.jsonl > results/minviable-s5.tsv
node minviable.mjs results/s6.jsonl > results/minviable-s6.tsv
node minviable.mjs results/s7.jsonl > results/minviable-s7.tsv
node ablation.mjs results/s2.jsonl > results/ablation-9x8.tsv
node merge.mjs            # results.tsv, dirsim.tsv
node report.mjs > results/report.json
