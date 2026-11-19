#!/bin/bash
# gom.sh <name> <montage args...>: a gated, short montage run
W=/tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/world
name=$1; shift
until awk '{exit !($1 < 6.5)}' /proc/loadavg && ! pgrep -f 'title-shot' >/dev/null && ! pgrep -f 'pw-browsers' >/dev/null; do sleep 5; done
echo "start $(cat /proc/loadavg)"
timeout 190 $W/c.sh $name node $W/montage.mjs "$@"; rc=$?
cat $W/logs/$name.log; echo "rc $rc load $(cat /proc/loadavg)"
