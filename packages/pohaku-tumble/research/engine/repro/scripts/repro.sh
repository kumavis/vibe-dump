#!/usr/bin/env bash
# Rerun every number in results.tsv / compare.tsv. ~10 min on 4 cores.
#  1. build: copies Jukugo's board.js/field.js (absolute path) into .build/ (stock, as the original harness)
#     and .build/pohaku/ (the POHAKU engine written from the spec)
#  2. prefix lexicons lex/<order>-<n>.json = first n entries of curve-<order>-905.json
#  3. harness plans (simx.mjs) and Director-model plans (dmodel.mjs) -> results/*.jsonl
#  4. verdicts.mjs -> results.tsv + minimum viable table; compare.mjs -> compare.tsv
set -euo pipefail
cd "$(dirname "$0")"
node prepare.mjs
mkdir -p lex results
node -e '
const fs=require("fs"); const T="roots/.cache/tiers";
for (const o of ["realistic","random","best"]) { const big=JSON.parse(fs.readFileSync(`${T}/curve-${o}-905.json`,"utf8"));
  for (let n=125;n<=900;n+=25) { const m = n===125?128:n; fs.writeFileSync(`lex/${o}-${m}.json`, JSON.stringify(big.slice(0,m))); }
  fs.writeFileSync(`lex/${o}-905.json`, JSON.stringify(big)); }'
for p in curve robust small128 grid65 ret ret6000 tick extra dcurve drobust; do node batch.mjs $p results/$p.jsonl; done
node verdicts.mjs
node compare.mjs
