// Board statistics by set (boards/): detours, terrain shares, openness.  node bstats.mjs > boards.md
import { load, mean, f2, f1, pc } from './load.mjs'
const bs = load('boards')
const seen = new Set(), uniq = bs.filter((b) => { const k = `${b.mission}|${b.set}|${b.board}`; if (seen.has(k)) return false; seen.add(k); return true })
const out = ['# Board statistics (bstats.mjs, board.mjs output, distinct boards)\n', 'Detour: the nav\'s reach cost over the straight line from 5 points inside each zone to each objective (a 1"-disc; walk climbs ladders and stairs; burrow under soft/difficult scenery, never fortifications). Flank = the non-centre objectives.\n',
  '| size | set | boards | centre: tower / rockbox / open / keep % | walk detour flanks | burrow detour flanks | walk detour centre (reachable) | burrow detour centre (reachable) | centre unreachable walk / burrow % | NML difficult / walker-blocked / burrower-blocked / raised % | clear 18" / 24" from inside zones |', '|---|---|---|---|---|---|---|---|---|---|---|']
for (const m of ['classic', 'field', 'grand']) for (const s of m === 'classic' ? ['classic', 'fortified'] : ['open', 'fortified']) {
  const q = uniq.filter((b) => b.mission === m && b.set === s); if (!q.length) continue
  const fl = (k) => mean(q.map((b) => mean(b.travel.flatMap((row) => row.slice(1).map((o) => o[k]).filter((x) => x != null)))))
  const ce = (k) => mean(q.flatMap((b) => b.travel.map((row) => row[0][k]).filter((x) => x != null)))
  const un = (k) => mean(q.map((b) => (b.travel.every((row) => row[0][k] === 5) ? 1 : 0)))
  const kinds = ['tower', 'rockbox', 'open', 'keep'].map((k) => pc(mean(q.map((b) => (b.centre === k ? 1 : 0))))).join(' / ')
  out.push(`| ${m} | ${s} | ${q.length} | ${kinds} | ${f2(fl('walk'))} | ${f2(fl('burrow'))} | ${f2(ce('walk'))} | ${f2(ce('burrow'))} | ${pc(un('wUnreach'))} / ${pc(un('bUnreach'))} | ${['diff', 'wblock', 'bblock', 'raised'].map((k) => pc(mean(q.map((b) => b.terr[k])))).join(' / ')} | ${pc(mean(q.map((b) => b.open[18].clear)))} / ${pc(mean(q.map((b) => b.open[24].clear)))} |`)
}
console.log(out.join('\n'))
