#!/bin/bash
S=/tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/f5a/sweep
tail -${1:-6} $S/summary.txt | cut -c1-160
echo "load now $(cut -d' ' -f1-3 /proc/loadavg); max since $(date -d '-10 min' +%H:%M): $(awk -v t=$(date -d '-10 min' +%H:%M:%S) '$1>t{if($2>m)m=$2}END{print m}' $S/load.txt)"
ps -eo args | grep -oE '^node sim/[a-z-]+\.mjs.{0,60}' | sort -u
