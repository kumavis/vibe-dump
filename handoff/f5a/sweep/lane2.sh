#!/bin/bash
# usage: lane2.sh <file>: each line "name|command", run through n.sh (or c.sh for C:name) in turn,
# each started only once the 1-minute load is at most 6 (the sweep's load discipline)
D=/tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/f5a/sweep
while IFS='|' read -r name cmd; do
  [ -z "$name" ] && continue
  case "$name" in \#*) continue;; esac
  while awk '{exit !($1 > 6)}' /proc/loadavg; do sleep 20; done
  if [ "${name#C:}" != "$name" ]; then bash $D/c.sh "${name#C:}" bash -c "$cmd" < /dev/null; else bash $D/n.sh "$name" bash -c "$cmd" < /dev/null; fi
done < "$1"
