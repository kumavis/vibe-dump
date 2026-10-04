// Director-mode matrix (dir.mjs): per-minute rates. Harness knobs map over as
// retry -> bgRetry (background beat retries) plus noteSkipFrozen (notes open only on
// pairs that can turn), R in seconds; stock keeps the stock Director (neither).
import { writeFileSync } from 'node:fs'
import { GRIDS, T, H } from './grids.mjs'
import { CONF } from './configs.mjs'
const SIZES = [128, 175, 225, 300, 400, 500, 650]
const DCONF = {}
for (const [tag, c] of Object.entries(CONF)) {
  const d = { ...c }
  if (d.retry) { d.bgRetry = d.retry; d.noteSkipFrozen = true }
  delete d.retry
  DCONF[tag] = d
}
DCONF['BEST+off'] = { ...DCONF.BEST, offRedeal: true }
DCONF['base+off'] = { ...DCONF.base, offRedeal: true }
const jobs = []
for (const n of SIZES) for (const g of ['9x8', '6x5s']) for (const [tag, c] of Object.entries(DCONF))
  jobs.push({ driver: 'dir', lex: `${T}/curve-realistic-${n}.json`, cfg: { ...H, ...GRIDS[g], ...c, minutes: 25, name: tag, gridName: g }, tag })
writeFileSync(process.argv[2] ?? 'jobs-dir.json', JSON.stringify(jobs))
console.log(jobs.length, 'jobs')
