#!/bin/bash
# one phase-2 cell: pjob.sh <variant: base or a TS_X list with + for ,> <mission> <set> <pair> <n> <start> [seed]
export TMPDIR=/tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/f5a/lab/tmp
cd /tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/f5a/lab
v=$1; seed=${7:-2222}
f=p2/data/$v-$2-$3-${4/,/-}-$6-$seed.jsonl
[ -s "$f.done" ] && exit 0
# wait while the 1-minute load is over 7 (the box is shared)
while awk '{exit !($1 > 7)}' /proc/loadavg; do timeout 30 tail -f /dev/null; done
rm -f "$f"
X=${v//+/,}; [ "$v" = base ] && X=
TS_X=$X node probe.mjs --rich --dir /tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/f5a/lab/p2/pkg --mission $2 --set $3 --pair $4 --n $5 --start $6 --seed $seed --out "$f" --quiet > "$f.done" 2>>p2/err.log
