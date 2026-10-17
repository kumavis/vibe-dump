#!/usr/bin/env bash
# Rebuild every number in results.tsv / NOTES.md. ~40-60 min on 4 cores.
# Reads Jukugo's board.js/field.js/lexicon.js and the tier files by absolute path; writes only here.
set -euo pipefail
cd "$(dirname "$0")"
node prepare.mjs                                  # .build/: patched copies of Jukugo's Board + field
node jobs-explore.mjs jobs-explore.json   && node runner.mjs jobs-explore.json  res-explore.jsonl 4   # each recovery alone (R0, no seek)
node jobs-explore2.mjs jobs-explore2.json && node runner.mjs jobs-explore2.json res-explore2.jsonl 4  # seek / R / recentW
node jobs-explore3.mjs jobs-explore3.json && node runner.mjs jobs-explore3.json res-explore3.jsonl 4  # grids x sizes
node jobs-explore4.mjs jobs-explore4.json && node runner.mjs jobs-explore4.json res-explore4.jsonl 4  # tuning
node jobs-final.mjs jobs-final.json       && node runner.mjs jobs-final.json    res-final.jsonl 4     # final harness matrix
node jobs-dir.mjs jobs-dir.json           && node runner.mjs jobs-dir.json      res-dir.jsonl 4       # director-mode, per minute
node jobs-linkmax.mjs jobs-linkmax.json   && node runner.mjs jobs-linkmax.json  res-linkmax.jsonl 4   # best order: LINK_MAX x0.7 / x0.55
node jobs-ref.mjs jobs-ref.json           && node runner.mjs jobs-ref.json      res-ref.jsonl 3       # Jukugo itself, stock/base/BEST
node tsv.mjs results.tsv res-final.jsonl res-linkmax.jsonl res-ref.jsonl res-dir.jsonl
node judge.mjs res-final.jsonl res-linkmax.jsonl > verdicts.tsv
node minviable.mjs res-final.jsonl res-linkmax.jsonl
node tables.mjs > tables.txt
node lexstats.mjs > lexstats.tsv
