#!/bin/bash
C=/tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/units/c.sh
$C parity-browser node sim/parity.mjs --browser
$C input-check node sim/input-check.mjs
$C input-check-st node sim/input-check.mjs --self-test --mutations ring-at-rider,rays-from-ground,deck-unsaid
$C hud-check node sim/hud-check.mjs
$C hud-check-st node sim/hud-check.mjs --self-test --mutations tip-no-climb,pick-unshaded
$C ui-check node sim/ui-check.mjs
$C play-check node sim/play-check.mjs
$C title-shot node sim/title-shot.mjs --ref 681fcf5c
echo CDONE >> /tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/units/summary.txt
