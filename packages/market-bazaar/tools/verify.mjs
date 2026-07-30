// Run the whole headless verification battery. From the package dir:
//   node tools/verify.mjs
// Exits non-zero if any family fails. Families live in tools/checks/.

import { spawnSync } from 'node:child_process'
import { readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const checksDir = join(here, 'checks')
const checks = readdirSync(checksDir).filter((f) => f.endsWith('.mjs')).sort()

let failed = 0
const t0 = performance.now()
for (const file of checks) {
  const t = performance.now()
  const res = spawnSync(process.execPath, [join(checksDir, file)], { encoding: 'utf8' })
  const ms = (performance.now() - t).toFixed(0)
  const ok = res.status === 0
  if (!ok) failed++
  console.log(`${ok ? '✓' : '✗'} ${file} (${ms} ms)`)
  const out = (res.stdout + res.stderr).trim()
  if (out) console.log(out.split('\n').map((l) => '    ' + l).join('\n'))
}
console.log(`\n${checks.length - failed}/${checks.length} check families passed in ${(performance.now() - t0).toFixed(0)} ms`)
process.exit(failed ? 1 : 0)
