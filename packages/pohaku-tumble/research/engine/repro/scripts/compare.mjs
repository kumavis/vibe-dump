// Claimed POHAKU rows (copied from the task's CLAIMED CURVE, realistic order) vs my measurements.
// Writes compare.tsv. Tolerance: +-0.02 absolute on rates; verdicts compared separately.
// "stuck" is compared against sFree (no turn onto ANY off-board word, previous word allowed regardless of the
// 6 s rest), which is the definition the claimed numbers fit; sLegal and sStrict are listed alongside.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const C = [
  ['H', 128, '9x8', 1, 1, 0, 0.444, 0.305], ['H', 175, '9x8', 0, 0.337, 0.511, 0.484, 0.474], ['H', 225, '9x8', 0, 0.035, 0.251, 0.494, 0.622],
  ['H', 300, '9x8', 0, 0.003, 0.079, 0.546, 0.689], ['H', 400, '9x8', 0, 0.001, 0.031, 0.57, 0.721], ['H', 500, '9x8', 0, 0, 0.013, 0.558, 0.715],
  ['H', 650, '9x8', 0, 0, 0.005, 0.545, 0.702], ['H', 905, '9x8', 0, 0, 0.001, 0.535, 0.682],
  ['H', 128, '5x4s', 0, 0.045, 0.378, 0.472, 0.305], ['H', 175, '5x4s', 0, 0.004, 0.163, 0.46, 0.474], ['H', 225, '5x4s', 0, 0.001, 0.083, 0.469, 0.617],
  ['H', 300, '5x4s', 0, 0, 0.016, 0.523, 0.655], ['H', 400, '5x4s', 0, 0, 0.01, 0.543, 0.65], ['H', 500, '5x4s', 0, 0, 0.004, 0.528, 0.651],
  ['H', 650, '5x4s', 0, 0, 0.001, 0.511, 0.656], ['H', 905, '5x4s', 0, 0, 0, 0.502, 0.627],
  ['D', 128, '9x8', 1, 1, 0, 0.425, 0.305], ['D', 175, '9x8', 0.047, 0.544, 0.842, 0.606, 0.439], ['D', 225, '9x8', 0, 0.101, 0.452, 0.617, 0.511],
  ['D', 300, '9x8', 0, 0.006, 0.109, 0.569, 0.676], ['D', 400, '9x8', 0, 0, 0.043, 0.62, 0.748], ['D', 500, '9x8', 0, 0, 0.016, 0.61, 0.77],
  ['D', 650, '9x8', 0, 0.001, 0.004, 0.576, 0.791], ['D', 905, '9x8', 0, 0.001, 0.007, 0.555, 0.819],
  ['D', 128, '5x4s', 0, 0.055, 0.326, 0.487, 0.305], ['D', 175, '5x4s', 0, 0.005, 0.154, 0.448, 0.474], ['D', 225, '5x4s', 0, 0.001, 0.078, 0.47, 0.622],
  ['D', 300, '5x4s', 0, 0, 0.016, 0.524, 0.688], ['D', 400, '5x4s', 0, 0, 0.011, 0.54, 0.731], ['D', 500, '5x4s', 0, 0, 0.004, 0.531, 0.746],
  ['D', 650, '5x4s', 0, 0, 0.002, 0.511, 0.771], ['D', 905, '5x4s', 0, 0, 0.001, 0.499, 0.796],
]
const tsv = readFileSync(join(here, 'results.tsv'), 'utf8').trim().split('\n').map((l) => l.split('\t'))
const head = tsv[0]
const rows = tsv.slice(1).map((r) => Object.fromEntries(head.map((h, i) => [h, r[i]])))
const GOOD = (st, s, rep, l) => st <= 0.05 && s <= 0.1 && rep <= 0.2 && l >= 0.35 && l <= 0.7
const JL = (st, s, rep, l) => st <= 0.02 && s <= 0.03 && rep <= 0.13 && l >= 0.4 && l <= 0.65
const V = (st, s, rep, l) => (JL(st, s, rep, l) ? 'JL' : GOOD(st, s, rep, l) ? 'GOOD' : 'fail')
const out = [['model', 'size', 'grid', 'metric', 'claimed', 'measured', 'diff', 'within_0.02', 'claimed_verdict', 'measured_verdict(sFree)', 'measured sLegal', 'measured sStrict'].join('\t')]
for (const [m, size, grid, st, s, rep, l, seen] of C) {
  const label = `${m === 'H' ? '' : 'D-'}POHAKU realistic ${size} ${grid}`
  const r = rows.find((x) => x.label === label)
  if (!r) continue
  const meas = { stall: +r.stall, stuck: +r.sFree, repeat: +r.rep, linked: +r.lnk, seen: +r.seen }
  const cv = V(st, s, rep, l)
  const mv = V(meas.stall, meas.stuck, meas.repeat, meas.linked)
  for (const [k, c] of [['stall', st], ['stuck', s], ['repeat', rep], ['linked', l], ['seen', seen]]) {
    const d = +(meas[k] - c).toFixed(3)
    out.push([m === 'H' ? 'harness' : 'Director model', size, grid, k, c, meas[k], d, Math.abs(d) <= 0.02 + 1e-9 ? 'yes' : 'NO', cv, mv, k === 'stuck' ? r.sLegal : '', k === 'stuck' ? r.sStrict : ''].join('\t'))
  }
}
writeFileSync(join(here, 'compare.tsv'), out.join('\n') + '\n')
console.log(out.filter((l) => l.includes('NO') || l.startsWith('model')).join('\n'))
console.log(`\n${out.length - 1} comparisons, ${out.filter((l) => l.includes('\tNO\t')).length} outside +-0.02`)
const vd = out.slice(1).map((l) => l.split('\t')).filter((x) => x[3] === 'stuck' && x[8] !== x[9])
console.log('verdict mismatches:', vd.map((x) => `${x[0]} ${x[1]} ${x[2]} claimed ${x[8]} measured ${x[9]}`).join('; ') || 'none')
