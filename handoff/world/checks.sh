#!/bin/bash
# the Node checks for a commit: parity (one CPU), then dressing-check 1,000 a set
W=/tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/world
cd /home/user/vibe-dump-wt/world/packages/tails-and-scales
SWEEP_CPUS=1 NODE_OPTIONS="--require $W/cpus1.cjs" nice -n 19 node sim/parity.mjs 2>&1 | tail -1; echo "parity rc ${PIPESTATUS[0]}"
nice -n 19 node sim/dressing-check.mjs 2>&1 | tail -8; echo "dressing-check rc ${PIPESTATUS[0]}"
