#!/usr/bin/env bash
# Run Jukugo's Board against each candidate lexicon at several board sizes and
# write viability.tsv. Needs ../build_lexicon.py to have run (it writes the tiers).
set -euo pipefail
cd "$(dirname "$0")"
node prepare.mjs
T=../.cache/tiers
OUT=../viability.tsv
run() { # name lexicon cols rows [extra json]
  LEX="$2" CFG="{\"name\":\"$1\",\"cols\":$3,\"rows\":$4,\"horizontalOnly\":${HORIZ:-true},\"slab\":${SLAB:-1.5},\"seeds\":${SEEDS:-10}${5:+,$5}}" node sim.mjs
}
{
  HORIZ=false SLAB=1 run "jukugo (reference)" jukugo 9 8
  for tier in attested-W attested-WA attested-WA+hoʻo core-35pct-r0 core-35pct-r1 core-60pct-r0 core-60pct-r1 core-morph; do
    for g in "9 8" "8 6" "7 5" "6 4"; do run "$tier" "$T/$tier.json" $g; done
  done
  for tier in attested-WA core-35pct-r0 core-60pct-r0; do run "$tier, distant duplicates allowed" "$T/$tier.json" 8 6 '"dupFar":14'; done
} | node -e '
  const rows = require("fs").readFileSync(0, "utf8").trim().split("\n").map(JSON.parse)
  const cols = ["name", "grid", "pairs", "lexicon", "deg5", "dealt", "stallRate", "stuck", "linked", "repeatRate", "seenFrac"]
  console.log(cols.join("\t"))
  for (const r of rows) console.log(cols.map((c) => r[c]).join("\t"))
' > "$OUT"
cat "$OUT"
