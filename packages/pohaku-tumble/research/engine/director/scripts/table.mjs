// table.mjs — compact comparison table from result JSONL files (with GOOD / JUKUGO verdicts).
//   node table.mjs <file.jsonl...> [--filter=substring] [--order=realistic]
import { readFileSync } from 'node:fs'
const args = process.argv.slice(2)
const files = args.filter((a) => !a.startsWith('--'))
const opt = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => a.slice(2).split('=')))
const rows = files.flatMap((f) => readFileSync(f, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse))
function judge(r) {
  const [a, b] = r.dealt.split('/').map(Number)
  if (a !== b || !b) return { stuck: NaN, v: 'no deal' }
  const stuck = Math.max(r.frozen, r.frozenVis ?? 0)
  const good = r.beatsLost <= 0.05 && stuck <= 0.1 && r.repeatRate <= 0.2 && r.linked >= 0.35 && r.linked <= 0.7
  const jk = r.beatsLost <= 0.02 && stuck <= 0.03 && r.repeatRate <= 0.13 && r.linked >= 0.4 && r.linked <= 0.65
  return { stuck, v: jk ? 'JUKUGO' : good ? 'GOOD' : '-' }
}
const f = (x) => (x == null || Number.isNaN(x) ? '' : (+x).toFixed(3))
const head = ['variant', 'lex', 'grid', 'view', 'pairs', 'vis', 'lost', 'stuck', 'frzAll', 'frzVis', 'noteEarly', 'linked', 'repeat', 'bounce', 'top20', 'still60', 'turns/min', 'verdict']
const out = [head]
for (const r of rows) {
  if (opt.filter && !JSON.stringify(r).includes(opt.filter)) continue
  if (opt.order && !(r.lexName.includes(opt.order) || r.lexName === 'attested-WA')) continue
  const j = judge(r)
  out.push([r.variant, r.lexName.replace('curve-', ''), r.grid, r.view, r.pairs, r.visible, f(r.beatsLost), f(j.stuck), f(r.frozen), f(r.frozenVis), f(r.noteEarly), f(r.linked), f(r.repeatRate), f(r.bounceRate), f(r.top20), f(r.still60), r.turnsPerMin?.toFixed(1), j.v])
}
const w = head.map((_, i) => Math.max(...out.map((r) => String(r[i] ?? '').length)))
for (const r of out) console.log(r.map((c, i) => String(c ?? '').padEnd(w[i])).join(' '))
