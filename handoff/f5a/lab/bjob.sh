#!/bin/bash
export TMPDIR=/tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/f5a/lab/tmp
cd /tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/f5a/lab
f=boards/$1-$2-${3/,/-}.jsonl
[ -s "$f.done" ] && exit 0
node board.mjs --mission $1 --set $2 --pair $3 --n $4 --seed 2222 --out "$f" 2>>logs/berr.log && echo ok > "$f.done"
