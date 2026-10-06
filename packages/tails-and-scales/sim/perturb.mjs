// Does rules code still lean on an engine's own Math? Nudge every result of
// the named Math functions by one ULP (sim/oracle/perturb-preload.mjs) and
// replay the corpus: a battle whose trace, shadow or battle log moves still
// calls one of them somewhere its outcome depends on. The rules' deterministic
// maths (core/dmath.js) is plain IEEE arithmetic, so once a function has moved
// there, no battle should notice.
//
//   node sim/perturb.mjs --fn hypot [--only ai] [--ref <ref> | --dir <dir>] [--no-control]
//
// --fn takes a comma-separated list (hypot, or sin,cos,atan,atan2 for N0).
// Unless --no-control, the same nudge first runs on the PIN code, which still
// calls Math everywhere, to show the probe has teeth there: at least one PIN
// battle must move, or the check is inconclusive (exit 2). Exit 0 when no
// battle of the code under test moves, else 1.
import { parseArgs } from 'node:util'
import { pathToFileURL } from 'node:url'
import { join, resolve } from 'node:path'
import { loadCorpus, select, runOracle, pool, CPUS, verdict, SIM } from './lib.mjs'
import { codeDir, readPin } from './oracle/pin.mjs'

const { values: a } = parseArgs({ options: { fn: { type: 'string' }, only: { type: 'string' }, ref: { type: 'string' }, dir: { type: 'string' }, 'no-control': { type: 'boolean' } } })
if (!a.fn) {
  console.error('--fn names the Math functions to nudge, e.g. --fn hypot')
  process.exit(2)
}
const bad = a.fn.split(',').filter((f) => typeof Math[f] !== 'function')
if (bad.length) {
  console.error(`--fn: Math.${bad.join(', Math.')} is not a function`)
  process.exit(2)
}
const { items: all } = loadCorpus()
const items = select(all, a.only ?? 'ai')
const dir = a.dir ? resolve(a.dir) : codeDir(a.ref ?? 'WORKTREE')

// every child the oracle spawns inherits the preload and the list
process.env.PERTURB = a.fn
process.env.NODE_OPTIONS = `${process.env.NODE_OPTIONS ?? ''} --import ${pathToFileURL(join(SIM, 'oracle', 'perturb-preload.mjs')).href}`.trim()

const moved = async (code) => {
  const res = await pool(items, CPUS, (it) => runOracle(it.job, code).catch((e) => ({ trace: [], error: e.message })))
  return items.map((it, i) => ({ it, r: res[i], v: verdict(it, res[i]) }))
}
const show = (rows) => {
  for (const { it, v, r } of rows) {
    const where = v.ok ? 'unchanged' : r.error ? `stopped: ${r.error.split('\n')[0].slice(0, 80)}` : v.line >= 0 ? `moves at trace line ${v.line + 1}` : v.shadow >= 0 ? `shadow moves at state ${v.shadow + 1}` : `battle log moves at write ${v.written + 1}`
    console.log(`  ${it.id.padEnd(24)} ${where}`)
  }
  return rows.filter((x) => !x.v.ok).length
}

console.log(`perturb: Math.${a.fn.split(',').join(', Math.')} nudged one ULP, ${items.length} battles`)
let teeth = true
if (!a['no-control']) {
  const pin = readPin()
  console.log(`\ncontrol, the PIN code (${pin.slice(0, 12)}):`)
  const n = show(await moved(codeDir(pin)))
  console.log(`  ${n}/${items.length} move`)
  teeth = n > 0
}
console.log(`\n${a.dir ? dir : a.ref ? `ref ${a.ref}` : 'the working tree'}:`)
const n = show(await moved(dir))
console.log(`  ${n}/${items.length} move`)
if (!teeth) {
  console.log(`\nperturb INCONCLUSIVE: the nudge moved no battle even on the PIN code, so it shows nothing about the code under test; pick another --fn or --only.`)
  process.exit(2)
}
console.log(n ? `\nperturb FAILED: rules code still calls Math.${a.fn} where an outcome depends on it` : `\nperturb passed: no battle depends on the engine's Math.${a.fn.split(',').join('/Math.')}`)
process.exit(n ? 1 : 0)
