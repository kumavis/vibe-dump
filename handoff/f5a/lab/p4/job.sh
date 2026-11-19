#!/bin/bash
# one phase-4 cell: job.sh <label> <TS_X or base> <TS_SP file or -> <mission> <set> <pair> <n> <start> <seed>
export TMPDIR=/tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/f5a/lab/tmp
cd /tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/f5a/lab
f=p4/data/$1-$4-$5-${6/,/-}-$8-$9.jsonl
[ -s "$f.done" ] && exit 0
while awk '{exit !($1 > 7)}' /proc/loadavg; do timeout 30 tail -f /dev/null; done
rm -f "$f"
X=$2; [ "$X" = base ] && X=
SP=$3; [ "$SP" = - ] && SP=
TS_X=$X TS_SP=$SP node probe.mjs --dir /tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/f5a/lab/p2/pkg --mission $4 --set $5 --pair $6 --n $7 --start $8 --seed $9 --out "$f" --quiet > "$f.done" 2>>p4/err.log
