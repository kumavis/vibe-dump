// Viability check on harness-mode (sim2) results.
// GOOD:        dealt every seed; stallRate <= 0.05; stuck <= 0.10; repeat <= 0.20; 0.35 <= linked <= 0.70
// JUKUGO-LIKE: dealt every seed; stallRate <= 0.02; stuck <= 0.03; repeat <= 0.13; 0.40 <= linked <= 0.65
// usage: node judge.mjs res.jsonl [res2.jsonl ...]   -> matrix of G/J/. per (tag, grid) x lexicon
import { readFileSync } from 'node:fs'
export function verdict(r) {
  if (!r.dealt || r.dealt.split('/')[0] !== r.dealt.split('/')[1] || r.dealt.startsWith('0/')) return 'x'
  const good = r.stallRate <= 0.05 && r.stuck <= 0.1 && r.repeatRate <= 0.2 && r.linked >= 0.35 && r.linked <= 0.7
  const juk = r.stallRate <= 0.02 && r.stuck <= 0.03 && r.repeatRate <= 0.13 && r.linked >= 0.4 && r.linked <= 0.65
  return juk && good ? 'J' : good ? 'G' : juk ? 'j?' : '.'
}
if (import.meta.url === `file://${process.argv[1]}`) {
  const rows = process.argv.slice(2).flatMap((f) => readFileSync(f, 'utf8').trim().split('\n').map(JSON.parse)).filter((r) => r.driver === 'sim2')
  const key = (r) => `${r.tag}\t${r.cfg.gridName ?? r.grid}`
  const lexes = [...new Set(rows.map((r) => r.lexFile))].sort((a, b) => (a.split('-')[1] + a.split('-').at(-1).padStart(4, '0')).localeCompare(b.split('-')[1] + b.split('-').at(-1).padStart(4, '0')))
  const keys = [...new Set(rows.map(key))]
  console.log(['config', 'grid', ...lexes.map((l) => l.replace('curve-', ''))].join('\t'))
  for (const k of keys) console.log([k, ...lexes.map((l) => { const r = rows.find((x) => key(x) === k && x.lexFile === l); return r ? verdict(r) : '' })].join('\t'))
}
