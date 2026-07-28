#!/usr/bin/env node
import { readdirSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, join } from 'node:path'

// ---------------------------------------------------------------------------
// The assertion suite.
//
//     npm run verify                 # everything
//     node tools/verify.mjs rig      # one family, or several
//     node tools/verify.mjs -v       # print the detail line for passes too
//
// Every check is numeric forward kinematics over the pose functions and the
// rig. Nothing here renders, so it runs in plain node in about a second and
// tells you *which frame* went wrong, which a screenshot never does.
//
// It exits non-zero if anything fails. That is the whole contract.
// ---------------------------------------------------------------------------

const HERE = dirname(fileURLToPath(import.meta.url))

const argv = process.argv.slice(2)
const verbose = argv.includes('-v') || argv.includes('--verbose')
const only = argv.filter((a) => !a.startsWith('-'))

const files = readdirSync(join(HERE, 'checks'))
  .filter((f) => f.endsWith('.mjs'))
  .sort()

const families = []
for (const file of files) {
  const mod = await import(pathToFileURL(join(HERE, 'checks', file)).href)
  if (!mod.name || !Array.isArray(mod.checks)) {
    throw new Error(`tools/checks/${file} must export "name" and "checks" — see tools/README.md`)
  }
  families.push(mod)
}

const selected = only.length ? families.filter((f) => only.includes(f.name)) : families
if (only.length && selected.length !== only.length) {
  const known = families.map((f) => f.name).join(', ')
  console.error(`unknown family in [${only.join(', ')}] — known families: ${known}`)
  process.exit(2)
}

const t0 = Date.now()
const rows = []
for (const family of selected) {
  for (const check of family.checks) {
    let result
    try {
      result = check.run()
    } catch (err) {
      result = { pass: false, measured: '—', detail: `threw: ${err.message}\n${err.stack?.split('\n')[1]?.trim() ?? ''}` }
    }
    rows.push({ family: family.name, check: check.name, ...result })
  }
}
const ms = Date.now() - t0

// ---- table ----------------------------------------------------------------

const w = (key, min) => Math.max(min, ...rows.map((r) => String(r[key]).length))
const wf = w('family', 6)
const wc = w('check', 5)
const wm = Math.min(w('measured', 8), 78)

const line = (a, b, c, d) => `${a.padEnd(wf)}  ${b.padEnd(wc)}  ${c.padEnd(6)}  ${d}`
console.log(line('family', 'check', 'result', 'measured'))
console.log(line('-'.repeat(wf), '-'.repeat(wc), '-'.repeat(6), '-'.repeat(wm)))
for (const r of rows) {
  console.log(line(r.family, r.check, r.pass ? 'ok' : 'FAIL', r.measured ?? ''))
  if (r.detail && (!r.pass || verbose)) {
    for (const l of String(r.detail).split('\n')) console.log(`${' '.repeat(wf + wc + 12)}${r.pass ? '· ' : '! '}${l}`)
  }
}

const failed = rows.filter((r) => !r.pass)
console.log()
console.log(
  `${rows.length} checks in ${selected.length} famil${selected.length === 1 ? 'y' : 'ies'}, ` +
    `${rows.length - failed.length} ok, ${failed.length} failed  (${ms} ms)`,
)
if (failed.length) {
  console.log()
  for (const f of failed) console.log(`FAIL  ${f.family}/${f.check}: ${f.detail || f.measured}`)
}
process.exit(failed.length ? 1 : 0)
