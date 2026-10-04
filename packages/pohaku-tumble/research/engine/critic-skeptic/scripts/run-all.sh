#!/bin/bash
# Rerun every number in NOTES.md (~25 min on 4 cores). Seeded: reruns are exact.
set -e
cd "$(dirname "$0")"
T=roots/.cache/tiers
node prepare.mjs
P='{"w":390,"h":844}'
# 1. long-window repeat + board recurrence (harness and Director), Jukugo vs POHAKU
( ./runx.sh simx stock 9x8 jukugo '{"dealMin":5}'; ./runx.sh simx POHAKU 9x8 jukugo
  for f in lex/curve-realistic-150.json $T/curve-realistic-175.json lex/curve-realistic-200.json $T/curve-realistic-225.json $T/curve-realistic-300.json; do ./runx.sh simx POHAKU auto $f; done ) > results-harness-window.jsonl
( ./runx.sh dsimx stock 9x8 jukugo '{"dealMin":5}' & ./runx.sh dsimx POHAKU 9x8 jukugo & ./runx.sh dsimx POHAKU auto lex/curve-realistic-200.json & ./runx.sh dsimx POHAKU auto $T/curve-realistic-175.json & wait ) > results-dir-window.jsonl
( for n in 225 300 400 500 650 905; do ./runx.sh dsimx POHAKU auto $T/curve-realistic-$n.json & done; wait ) > results-dcurve-recur.jsonl
# 2. board-level recency rules (engine attempt at the recycling)
( for e in POHAKU 'POHAKU br90w' 'POHAKU br90tier' 'POHAKU br180tier'; do ./runx.sh dsimx "$e" auto lex/curve-realistic-200.json & done; wait
  for e in 'POHAKU br90tier' 'POHAKU br180tier'; do ./runx.sh dsimx "$e" auto $T/curve-realistic-300.json & ./runx.sh dsimx "$e" auto $T/curve-realistic-175.json & done; wait ) > results-boardrecent.jsonl
# 3. rest length
( for f in $T/curve-realistic-175.json lex/curve-realistic-200.json; do for e in POHAKU 'POHAKU ret20' 'POHAKU ret30' 'POHAKU ret60'; do ./runx.sh dsimx "$e" auto $f & done; wait; done ) > results-rest.jsonl
( for f in $T/curve-realistic-175.json lex/curve-realistic-200.json; do
   for e in POHAKU 'POHAKU ret20' 'POHAKU ret30'; do ./runx.sh dsimx "$e" auto $f '{"seeds":30,"duration":7200}' & done; wait
   for e in POHAKU 'POHAKU ret20' 'POHAKU ret30'; do ./runx.sh simx "$e" auto $f '{"seeds":30,"ticks":6000}' & done; wait; done ) > results-rest-long.jsonl
( for e in POHAKU 'POHAKU ret20'; do for f in $T/curve-realistic-300.json lex/curve-realistic-275.json; do ./runx.sh dsimx "$e" 9x8 $f & done; done; wait ) > results-rest-9x8.jsonl
( for e in POHAKU 'POHAKU ret20'; do ./runx.sh dsimx "$e" auto $T/curve-realistic-175.json & ./runx.sh dsimx "$e" auto lex/curve-realistic-200.json & done; wait
  for e in POHAKU 'POHAKU ret20'; do ./runx.sh dsimx "$e" 9x8 $T/curve-realistic-300.json & done; ./runx.sh dsimx POHAKU auto $T/curve-realistic-225.json & ./runx.sh dsimx POHAKU 9x8 lex/curve-realistic-275.json & wait ) > results-returnonly.jsonl
# 4. steering and reach cap
( for f in $T/curve-realistic-175.json lex/curve-realistic-200.json $T/curve-realistic-300.json $T/curve-realistic-905.json $T/curve-best-225.json; do for e in POHAKU 'POHAKU noSteer'; do ./runx.sh simx "$e" auto $f; done; done ) > results-nosteer.jsonl
( for f in $T/curve-realistic-175.json lex/curve-realistic-200.json $T/curve-realistic-300.json; do for e in 'POHAKU reachCap10' 'POHAKU reachCap5'; do ./runx.sh simx "$e" auto $f; done; done ) > results-reachcap.jsonl
# 5. viewports
( for v in '{"w":390,"h":844}' '{"w":1920,"h":1080}' '{"w":2560,"h":1440}'; do for f in $T/curve-realistic-175.json lex/curve-realistic-200.json; do ./runx.sh dsimx POHAKU auto $f "{\"view\":$v}" & done; ./runx.sh dsimx stock 9x8 jukugo "{\"dealMin\":5,\"view\":$v}" & wait; done ) > results-views.jsonl
( for f in $T/curve-realistic-175.json lex/curve-realistic-200.json $T/curve-realistic-225.json lex/curve-realistic-250.json; do ./runx.sh dsimx POHAKU auto $f "{\"view\":$P,\"seeds\":30}" & done; wait
  ./runx.sh dsimx 'POHAKU ret20' auto $T/curve-realistic-175.json "{\"view\":$P,\"seeds\":30}" & ./runx.sh dsimx 'POHAKU ret20' auto lex/curve-realistic-200.json "{\"view\":$P,\"seeds\":30}" & wait ) > results-phone30.jsonl
# 6. pruning with a longer rest; homographs; note capacity
( for f in $T/curve-realistic-175.json lex/curve-realistic-200.json; do for e in 'POHAKU -prune' 'POHAKU -prune ret20' 'POHAKU ret20'; do ./runx.sh dsimx "$e" auto $f & done; wait; done
  for e in 'POHAKU -prune' 'POHAKU -prune ret20' 'POHAKU ret20'; do ./runx.sh dsimx "$e" auto $T/curve-realistic-225.json & done; wait ) > results-prune.jsonl
( for f in $T/curve-realistic-175.json lex/curve-realistic-200.json $T/curve-realistic-300.json $T/curve-realistic-905.json; do ./runx.sh simx POHAKU auto $f; done ) > results-homo.jsonl
( for c in 2 1; do ./runx.sh dsimx 'POHAKU ret20' auto lex/curve-realistic-200.json "{\"capacity\":$c}" & ./runx.sh dsimx 'POHAKU ret20' auto $T/curve-realistic-175.json "{\"capacity\":$c}" & done; wait ) > results-capacity.jsonl
node merge.mjs
