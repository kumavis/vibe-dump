#!/bin/bash
# the round's frames, in order of need; each run gated and short
W=/tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/world
run() { local dist=$1 prefix=$2; shift 2; for c in "$@"; do DIST=$W/$dist PREFIX=$prefix $W/go.sh ${prefix}-${c//:/_} $c | grep -E "^(shot|info|rc|start|measure|.*Error)"; done; }
mon() { DIST=$W/$1 $W/gom.sh m-$2-$3-$4 $2 $3 ${4} ${@:5} | grep -E "^(sheet|rc|start|.*Error)"; }
run distC s4 skirm-classic-s411 skirm-classic-s1 skirm-fort-s4 grand-fort-s5 mid-powder title
run distC s4 measure:classic:classic:411 measure:classic:classic:1 measure:classic:fortified:4 measure:grand:fortified:5 measure:powder:powder:3 measure:grand:open:7
mon distC classic classic s4a 1 2 3 4 5
mon distC classic classic s4b 6 7 8 9 10
mon distC classic fortified s4a 1 2 3 4 5
mon distC classic fortified s4b 6 7 8 9 10
mon distC field open s4a 1 2 3 4 5
mon distC field open s4b 6 7 8 9 10
mon distC keg keg s4a 1 2 3 4 5
mon distC keg keg s4b 6 7 8 9 10
mon distC powder powder s4a 1 2 3 4 5
mon distC powder powder s4b 6 7 8 9 10
run distC s4 skirm-fort-s30 field-open-s7 lowfi phone
run distB s3 skirm-classic-s411 skirm-fort-s4 grand-fort-s5 skirm-classic-s1 title skirm-fort-s30 field-open-s7 mid-powder lowfi phone
run distA a skirm-fort-s4 skirm-classic-s411
echo QUEUEDONE
