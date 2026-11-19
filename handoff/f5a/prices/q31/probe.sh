#!/bin/bash
# usage: probe.sh <name> <races> <specs...>: a copy, then a small --check on seed 2222 (n 300, fit 600)
Q=/tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/f5a/prices/q31
name=$1; races=$2; shift 2
cd $Q && node mk3.mjs $name "$@" > /dev/null || exit 9
echo "$name: $*" >> $Q/probes.txt
node lists.mjs $Q/$name/packages/tails-and-scales | grep -A1 "^insect\|^bird" | grep -v field >> $Q/probes.txt
$Q/r.sh $name node sim/army-sim.mjs --check --mission classic --races $races --n 300 --fit-n 600 --seed 2222 --jobs 2 --dir $Q/$name/packages/tails-and-scales
grep -E "^  (ok|FAIL) +classic score|FAIL the per|^  (Hivekin|Windfolk): |edge|heroes. diff" $Q/logs/$name.log | grep -v "  –  " | sed 's/ (within/ (w/' >> $Q/probes.txt
