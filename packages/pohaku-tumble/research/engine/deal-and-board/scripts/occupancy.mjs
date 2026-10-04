// Stall / stuck against occupancy = pairs / words in play (after pruning), for every
// core2 row in the given result files. Bins occupancy and reports mean and max stall /
// stuck per bin, so a sizing rule can be read off: pairs <= occMax * |core2|.
// Usage: node occupancy.mjs results/e2-prune.jsonl results/e5-fine.jsonl
import fs from 'node:fs'
const rows = process.argv.slice(2).flatMap((f) => fs.readFileSync(f, 'utf8').trim().split('\n').map(JSON.parse))
  .filter((r) => r.prune === 2 && r.dealt.split('/')[0] === r.dealt.split('/')[1] && r.pairs > 0)
const bins = [0, 0.02, 0.04, 0.06, 0.08, 0.1, 0.12, 0.15, 0.2, 0.25, 0.3, 0.4, 0.6, 1.1]
console.log('occ_lo\tocc_hi\tn\tstall_mean\tstall_max\tstuck_mean\tstuck_max\tshare_stall<=.02&stuck<=.03\tshare_stall<=.05&stuck<=.10')
for (let i = 0; i < bins.length - 1; i++) {
  const rs = rows.filter((r) => r.pairs / r.lexicon >= bins[i] && r.pairs / r.lexicon < bins[i + 1])
  if (!rs.length) continue
  const m = (k) => (rs.reduce((s, r) => s + r[k], 0) / rs.length).toFixed(3)
  const mx = (k) => Math.max(...rs.map((r) => r[k])).toFixed(3)
  const sh = (a, b) => (rs.filter((r) => r.stallRate <= a && r.stuck <= b).length / rs.length).toFixed(2)
  console.log([bins[i], bins[i + 1], rs.length, m('stallRate'), mx('stallRate'), m('stuck'), mx('stuck'), sh(0.02, 0.03), sh(0.05, 0.1)].join('\t'))
}
