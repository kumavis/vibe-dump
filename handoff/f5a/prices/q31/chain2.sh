P=$(pgrep -f "bash chain1.sh" | head -1); [ -n "$P" ] && tail --pid=$P -f /dev/null
./r.sh fin-f4444 node sim/army-sim.mjs --check --mission field --seed 4444 --jobs 2 --dir /tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/f5a/prices/q31/fin/packages/tails-and-scales
./r.sh fin-ffit node sim/army-sim.mjs --fit --mission field --races insect,bird --seed 1111,2222,3333 --jobs 2 --dir /tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/f5a/prices/q31/fin/packages/tails-and-scales
