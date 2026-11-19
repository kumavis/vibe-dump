#!/bin/bash
# the sweep's load record: the 1-minute load every 30 s, with what runs
S=/tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/f5a/sweep
while true; do
  echo "$(date +%H:%M:%S) $(cut -d' ' -f1 /proc/loadavg) $(ps -eo args | grep -oE 'node sim/[a-z-]+\.mjs[^|]{0,40}' | grep -v grep | tr '\n' ';')" >> $S/load.txt
  sleep 30
done
