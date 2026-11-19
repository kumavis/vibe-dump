#!/bin/bash
# usage: r.sh <name> <command...>: one Node run from the worktree's package, logged, timed
Q=/tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/f5a/prices/q31
export TMPDIR=$Q/ntmp
export NODE_OPTIONS="--require $Q/cpus2.cjs --v8-pool-size=1"
export ORACLE_TIMEOUT_MS=${ORACLE_TIMEOUT_MS:-900000}
name=$1; shift
cd /home/user/vibe-dump-wt/f5a/packages/tails-and-scales || exit 9
l0=$(cut -d' ' -f1-3 /proc/loadavg); s=$(date +%s)
"$@" > $Q/logs/$name.log 2>&1; rc=$?
echo "$name EXIT $rc $(( $(date +%s)-s ))s load [$l0]->[$(cut -d' ' -f1-3 /proc/loadavg)] $*" >> $Q/summary.txt
exit $rc
