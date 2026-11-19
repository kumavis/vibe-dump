#!/bin/bash
W=/tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/world
P=$1; shift
for c in "$@"; do PREFIX=$P $W/go.sh ${P}-$c $c | grep -E "^(shot|info|rc|start|.*Error)" ; done
echo BATCHDONE
