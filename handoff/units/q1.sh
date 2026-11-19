#!/bin/bash
N=/tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/units/n.sh
$N self-test node sim/self-test.mjs
$N present-check node sim/present-check.mjs
$N present-check-st node sim/present-check.mjs --self-test --mutations no-advance-roll,no-charge-result,no-charge-face,no-charge-failed,no-move,walk-speed
$N property node sim/property.mjs
$N property-anchors node sim/property.mjs --self-test --mutations ward-anywhere,board-any-base
$N mutation node sim/mutation.mjs
$N mutation-core node sim/mutation.mjs --core
$N replay-check node sim/replay-check.mjs
$N merge-sim node sim/merge-sim.mjs
$N fog-check node sim/fog-check.mjs
$N macro-check node sim/macro-check.mjs
$N pilot-check node sim/pilot-check.mjs
$N parity-pre node sim/parity.mjs
echo QDONE >> /tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/units/summary.txt
