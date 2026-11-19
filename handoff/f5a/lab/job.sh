#!/bin/bash
# one probe cell: job.sh <mission> <set> <pair> <n> <start>
export TMPDIR=/tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/f5a/lab/tmp
cd /tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/f5a/lab
f=data/$1-$2-${3/,/-}-$5.jsonl
[ -s "$f.done" ] && exit 0
rm -f "$f"
node probe.mjs --dir /home/user/vibe-dump-wt/f5a/packages/tails-and-scales --mission $1 --set $2 --pair $3 --n $4 --start $5 --seed 2222 --out "$f" --quiet > "$f.done" 2>>logs/err.log
