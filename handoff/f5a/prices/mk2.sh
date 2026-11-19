#!/bin/bash
# usage: mk.sh <name> <unit>=<cost>...: a copy of the Rules commit's package
# with the new races' costs set (unit keys of insect.js and bird.js)
D=/tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/f5a/prices
name=$1; shift
rm -rf $D/$name; mkdir -p $D/$name; cp -r $D/base/packages $D/$name/
P=$D/$name/packages/tails-and-scales
for kv in "$@"; do
  k=${kv%=*}; v=${kv#*=}
  node -e '
    const fs = require("fs"), [p1, p2, k, v] = process.argv.slice(1)
    let hit = 0
    for (const p of [p1, p2]) {
      const lines = fs.readFileSync(p, "utf8").split("\n")
      let inUnit = false
      for (let i = 0; i < lines.length; i++) {
        if (new RegExp(`^    ${k}: \\{`).test(lines[i])) inUnit = true
        else if (/^    [a-z]+: \{/.test(lines[i])) inUnit = false
        if (inUnit && /\bcost: \d+,/.test(lines[i])) { lines[i] = lines[i].replace(/\bcost: \d+,/, `cost: ${v},`); hit++; inUnit = false }
      }
      fs.writeFileSync(p, lines.join("\n"))
    }
    if (hit !== 1) { console.error(`no unique unit ${k}: ${hit}`); process.exit(1) }
  ' $P/data/races/insect.js $P/data/races/bird.js $k $v || exit 1
done
cd $D && TMPDIR=$D/ntmp node lists.mjs $P | grep -E "^(insect|bird)|insect|bird" | head -2
grep -n "cost:" $P/data/races/insect.js $P/data/races/bird.js | sed 's/.*name: .\([^,]*\),.*cost: \([0-9]*\).*/\1 \2/'
