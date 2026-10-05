// "Board-limited" min size: as minviable.mjs, but with the repeat threshold dropped,
// i.e. the smallest list at which deal + board (stall, stuck, linked, dealt) stop
// being the binding constraint. Repeat is set by the turn rules, not by the board.
// Usage: node boardlimit.mjs results/e5-fine.jsonl
import fs from 'node:fs'
const rows = process.argv.slice(2).flatMap((f) => fs.readFileSync(f, 'utf8').trim().split('\n').map(JSON.parse))
const ok = (r, k) => {
  const [d, n] = r.dealt.split('/').map(Number)
  if (d !== n) return false
  return k === 'good' ? r.stallRate <= 0.05 && r.stuck <= 0.1 && r.linked >= 0.35 && r.linked <= 0.7
    : r.stallRate <= 0.02 && r.stuck <= 0.03 && r.linked >= 0.4 && r.linked <= 0.65
}
const g = new Map()
for (const r of rows) { const k = `${r.name}\t${r.grid}`; (g.get(k) ?? g.set(k, []).get(k)).push(r) }
console.log('config\torder\tgrid\tpairs\tgood_norepeat_stable\tjl_norepeat_stable\trepeat_at_that_size(jl)')
for (const [k, rs] of g) {
  rs.sort((a, b) => a.full - b.full)
  const st = (kind) => { let s = null; for (let i = rs.length - 1; i >= 0 && ok(rs[i], kind); i--) s = rs[i]; return s }
  const a = st('good'), b = st('jl')
  const [name, grid] = k.split('\t')
  console.log([...name.split('|'), grid, Math.max(...rs.map((r) => r.pairs)), a?.full ?? '', b?.full ?? '', b?.repeatRate ?? ''].join('\t'))
}
