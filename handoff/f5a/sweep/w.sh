#!/bin/bash
# waits up to 580 s for the next line(s) of summary.txt, prints them and the load
S=/tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/f5a/sweep
timeout 580 tail -n0 -f $S/summary.txt | head -n ${1:-1} | cut -c1-170
echo "load $(cut -d' ' -f1-3 /proc/loadavg); max 10 min: $(tail -20 $S/load.txt | awk "{if(\$2>m)m=\$2}END{print m}"); $(date +%H:%M)"
