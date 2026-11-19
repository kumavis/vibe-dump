#!/bin/bash
# usage: n.sh <name> <command...>: one Node run, logged, timed
D=/tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/f5a/prices
export TMPDIR=$D/ntmp
# (the sweep) the oracle deadline for a shared box (load 30-40): see summary
export NODE_OPTIONS="--require $D/cpus2.cjs --v8-pool-size=${V8_POOL:-1}"
export ORACLE_TIMEOUT_MS=${ORACLE_TIMEOUT_MS:-900000}
name=$1; shift
cd /home/user/vibe-dump-wt/f5a/packages/tails-and-scales || exit 9
l0=$(cut -d' ' -f1 /proc/loadavg); s=$(date +%s)
"$@" > $D/logs/$name.log 2>&1; rc=$?
echo "$name EXIT $rc $(( $(date +%s)-s ))s load $l0-$(cut -d' ' -f1 /proc/loadavg) cpus=${SWEEP_CPUS:-2} $*" >> $D/summary.txt
exit $rc
