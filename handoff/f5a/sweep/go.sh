#!/bin/bash
# waits for the timing lane, then the Node lane A (one child, SWEEP_CPUS=1) beside the Chromium lane C; the wide lane W (both Node lanes, SWEEP_CPUS=2) after A
S=/tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/f5a/sweep
tail --pid=$(cat $S/T1.pid) -f /dev/null
echo "--- the timing lane done; the Node lane A (SWEEP_CPUS=1) beside the Chromium lane C from here" >> $S/summary.txt
SWEEP_CPUS=1 nohup bash $S/lane2.sh $S/A.lane > $S/A.out 2>&1 & echo $! > $S/A.pid
nohup bash $S/lane2.sh $S/C.lane > $S/C.out 2>&1 & echo $! > $S/C.pid
tail --pid=$(cat $S/A.pid) -f /dev/null
echo "--- lane A done; the wide lane W (both Node lanes, SWEEP_CPUS=2) beside the Chromium lane" >> $S/summary.txt
SWEEP_CPUS=2 bash $S/lane2.sh $S/W.lane
echo "--- lane W done" >> $S/summary.txt
