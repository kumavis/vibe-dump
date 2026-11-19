#!/bin/bash
# the load guard: when the 1-minute load passes 7.6, hold (SIGSTOP) the Node lane's
# processes (lane A's, then W's: never the Chromium lane's, nor a check on real time),
# and let them go (SIGCONT) once it is under 6.3; each hold logged to the summary
S=/tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/f5a/sweep
held=""
desc() { local p=$1; echo $p; for c in $(pgrep -P $p); do desc $c; done; }
while true; do
  l=$(cut -d' ' -f1 /proc/loadavg)
  if [ -z "$held" ] && awk -v l=$l 'BEGIN{exit !(l > 7.6)}'; then
    lane=""; for f in A W; do p=$(pgrep -f "lane2.sh $S/$f.lane" | head -1); [ -n "$p" ] && lane="$lane $(desc $p)"; done
    cmd=$(for p in $lane; do cat /proc/$p/cmdline 2>/dev/null | tr '\0' ' '; echo; done | grep -oE 'node sim/[a-z-]+\.mjs' | head -1)
    case "$cmd" in *peers*|*net-check*|*playback*|*fold-cost*|*scale-bench*|"") ;; *)
      held=$(for p in $lane; do grep -q '^node\|node$' /proc/$p/comm 2>/dev/null && echo $p; done | tr '\n' ' ')
      [ -n "$held" ] && kill -STOP $held 2>/dev/null && echo "--- guard $(date +%H:%M:%S): load $l, held ($cmd) $held" >> $S/summary.txt ;;
    esac
  elif [ -n "$held" ] && awk -v l=$l 'BEGIN{exit !(l < 6.3)}'; then
    kill -CONT $held 2>/dev/null; echo "--- guard $(date +%H:%M:%S): load $l, let go $held" >> $S/summary.txt; held=""
  fi
  sleep 10
done
