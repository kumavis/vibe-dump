#!/bin/bash
# usage: c.sh <name> <command...>: one Chromium run with TMPDIR held short
D=/tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/units
T=$D/tmp
name=$1; shift
bash -c 'exec 9<"$0"; exec setpriv --inh-caps=-all --bounding-set=-all sleep infinity' "$T" & H=$!
trap 'kill $H' EXIT
sleep 1
export TMPDIR=/proc/$H/fd/9
export CHROMIUM_PATH=/opt/pw-browsers/chromium
export PARALLEL=${PARALLEL:-1}
export ORACLE_TIMEOUT_MS=${ORACLE_TIMEOUT_MS:-900000}
export NODE_OPTIONS="--require $D/realtmp.cjs --require $D/cpus2.cjs"
cd /home/user/vibe-dump-wt/units/packages/tails-and-scales || exit 9
l0=$(cut -d' ' -f1 /proc/loadavg); s=$(date +%s)
"$@" > $D/logs/$name.log 2>&1; rc=$?
echo "$name EXIT $rc $(( $(date +%s)-s ))s load $l0-$(cut -d' ' -f1 /proc/loadavg) [chromium] cpus=${SWEEP_CPUS:-2} $*" >> $D/summary.txt
exit $rc
