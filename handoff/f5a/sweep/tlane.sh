#!/bin/bash
# timing lane: each line "name|command" waits for a 1-minute load under 1.8, then runs alone
D=/tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/f5a/sweep
while IFS='|' read -r name cmd; do
  [ -z "$name" ] && continue
  case "$name" in \#*) continue;; esac
  while awk '{exit !($1 >= 1.8)}' /proc/loadavg; do sleep 15; done
  if [ "${name#C:}" != "$name" ]; then bash $D/c.sh "${name#C:}" bash -c "$cmd" < /dev/null; else bash $D/n.sh "$name" bash -c "$cmd" < /dev/null; fi
done < "$1"
