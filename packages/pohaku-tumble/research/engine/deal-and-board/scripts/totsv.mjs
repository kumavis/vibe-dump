// JSON lines from sim.mjs -> TSV, with GOOD / JUKUGO-LIKE verdicts.
// Usage: node totsv.mjs in.jsonl [more.jsonl ...] > out.tsv
//   GOOD:        dealt every seed; stallRate <= 0.05; stuck <= 0.10; repeat <= 0.20; 0.35 <= linked <= 0.70
//   JUKUGO-LIKE: dealt every seed; stallRate <= 0.02; stuck <= 0.03; repeat <= 0.13; 0.40 <= linked <= 0.65
// "stuck" here is the original metric; stuckAll / stuckEnd are reported beside it.
import fs from 'node:fs'

export function verdict(r) {
  const [d, n] = r.dealt.split('/').map(Number)
  if (d !== n || !d) return { good: false, jl: false }
  const good = r.stallRate <= 0.05 && r.stuck <= 0.1 && r.repeatRate <= 0.2 && r.linked >= 0.35 && r.linked <= 0.7
  const jl = r.stallRate <= 0.02 && r.stuck <= 0.03 && r.repeatRate <= 0.13 && r.linked >= 0.4 && r.linked <= 0.65
  return { good, jl }
}
export const COLS = ['name', 'lex', 'lexicon', 'full', 'grid', 'floor', 'linkMax', 'dealMode', 'dealMin', 'matchMin', 'prune', 'retry', 'dealt', 'errors', 'pairs', 'holes',
  'stallRate', 'stuck', 'repeatRate', 'linked', 'GOOD', 'JUKUGO', 'stuckAll', 'stuckStart', 'stallStart', 'stuckEnd', 'stallEnd', 'trappedEnd', 'linked0', 'linkedEnd', 'dealDeg', 'seenFrac', 'seenAll', 'tpp']

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(COLS.join('\t'))
  for (const f of process.argv.slice(2)) {
    for (const line of fs.readFileSync(f, 'utf8').trim().split('\n').filter(Boolean)) {
      const r = JSON.parse(line)
      const v = verdict(r)
      r.GOOD = v.good ? 'Y' : '-'
      r.JUKUGO = v.jl ? 'Y' : '-'
      console.log(COLS.map((c) => r[c] ?? '').join('\t'))
    }
  }
}
