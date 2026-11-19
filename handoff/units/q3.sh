#!/bin/bash
N=/tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/units/n.sh
$N data-check-3 node sim/data-check.mjs
$N self-test-3 node sim/self-test.mjs
$N present-check-3 node sim/present-check.mjs
$N present-check-st-3 node sim/present-check.mjs --self-test --mutations no-advance-roll,no-charge-result,no-charge-face,no-charge-failed,no-move,walk-speed
$N property-3 node sim/property.mjs
$N property-anchors-3 node sim/property.mjs --self-test --mutations ward-anywhere,board-any-base
$N replay-check-3 node sim/replay-check.mjs
$N merge-sim-3 node sim/merge-sim.mjs
$N mutation-3 node sim/mutation.mjs
$N mutation-core-3 node sim/mutation.mjs --core
$N parity-page-3 node sim/parity.mjs --page
echo QDONE >> /tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/units/summary.txt
