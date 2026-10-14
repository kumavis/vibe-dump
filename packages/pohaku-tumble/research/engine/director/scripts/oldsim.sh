#!/usr/bin/env bash
# The original harness (sim.mjs: random pair each tick, 3-tick cooldown, no notes, all pairs eligible),
# stock rules with dealMin 1, for comparison with the faithful Director model. → results/oldsim.jsonl
set -euo pipefail
cd "$(dirname "$0")"
node prepare.mjs
T=roots/.cache/tiers
: > results/oldsim.jsonl
for n in attested-WA curve-realistic-175 curve-realistic-225 curve-realistic-300 curve-realistic-400 curve-realistic-500 curve-realistic-650 curve-realistic-905; do
  for r in 0 6; do
    LEX=$T/$n.json CFG="{\"name\":\"oldsim retry=$r\",\"cols\":9,\"rows\":8,\"horizontalOnly\":true,\"slab\":1.5,\"seeds\":10,\"ticks\":1500,\"dealMin\":1,\"retry\":$r}" node sim.mjs | node -e "const r=JSON.parse(require('fs').readFileSync(0,'utf8'));r.lexName='$n';console.log(JSON.stringify(r))" >> results/oldsim.jsonl
  done
done
LEX=jukugo CFG='{"name":"oldsim retry=0","cols":9,"rows":8,"horizontalOnly":false,"slab":1,"seeds":10,"ticks":1500}' node sim.mjs | node -e "const r=JSON.parse(require('fs').readFileSync(0,'utf8'));r.lexName='jukugo';console.log(JSON.stringify(r))" >> results/oldsim.jsonl
