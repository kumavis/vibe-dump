#!/bin/bash
# usage: c.sh <name> <command...>: one Chromium run with TMPDIR held short
D=/tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/world
T=$D/tmp
name=$1; shift
bash -c 'exec 9<"$0"; exec setpriv --inh-caps=-all --bounding-set=-all sleep infinity' "$T" & H=$!
trap 'kill $H' EXIT
sleep 1
export TMPDIR=/proc/$H/fd/9
export CHROMIUM_PATH=/opt/pw-browsers/chromium
export NODE_OPTIONS="--require $D/realtmp.cjs"
cd /home/user/vibe-dump-wt/world/packages/tails-and-scales || exit 9
l0=$(cut -d' ' -f1 /proc/loadavg); s=$(date +%s)
"$@" > $D/logs/$name.log 2>&1; rc=$?
echo "$name EXIT $rc $(( $(date +%s)-s ))s load $l0-$(cut -d' ' -f1 /proc/loadavg) $*" >> $D/summary.txt
exit $rc
