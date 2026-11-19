#!/bin/bash
N=/tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/units/n.sh
$N fog-check node sim/fog-check.mjs
$N macro-check node sim/macro-check.mjs
$N pilot-check node sim/pilot-check.mjs
$N parity-pre node sim/parity.mjs
