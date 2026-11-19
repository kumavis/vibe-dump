#!/bin/bash
N=/tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/units/n.sh
$N property-4 node sim/property.mjs
$N property-anchors-4 node sim/property.mjs --self-test --mutations ward-anywhere,board-any-base
echo QDONE >> /tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/units/summary.txt
