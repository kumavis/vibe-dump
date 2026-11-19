#!/bin/bash
# usage: lane.sh <file>: each line "name|command", run through n.sh in turn
D=/tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/f5a/sweep
while IFS='|' read -r name cmd; do
  [ -z "$name" ] && continue
  case "$name" in \#*) continue;; esac
  if [ "${name#C:}" != "$name" ]; then bash $D/c.sh "${name#C:}" bash -c "$cmd" < /dev/null; else bash $D/n.sh "$name" bash -c "$cmd" < /dev/null; fi
done < "$1"
