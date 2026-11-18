#!/usr/bin/env node
// Measure built artifacts and check proportions against reference specs.
//
//   node tools/metrics.mjs [--a id[,id]] [--all] [--q 1] [--json]
//
//   (default)  every registered artifact; those with a spec.json are checked
//   --all      every artifact that has a reference/<id>/spec.json
//   --json     print the raw metrics too
//
// Prints a PASS/FAIL table per artifact and a summary; exits 1 if any ratio
// fails, an expression cannot be evaluated, a build fails or the page logs an
// error.
//
// reference/<id>/spec.json:
//   { "ratios": { "legShare": { "expr": "parts.legs.h / overall.h", "expected": 0.38, "tol": 0.03 } } }
//
// `expr` is deliberately tiny — no eval: an operand is a number or a dotted
// path into the metrics object (overall.h, parts.legs.w, parts.legs.count …),
// optionally followed by ONE operator (/ * + -) and a second operand.
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { args, session, PKG } from './lib.mjs'

const specPath = (id) => join(PKG, 'reference', id, 'spec.json')

async function main() {
  const opt = args()
  const s = await session()
  const first = opt.a ? String(opt.a).split(',')[0] : null
  const { page, errors } = await s.open({ ui: '0', q: String(opt.q || 1), ...(first ? { a: first } : {}) })
  await s.waitReady(page)
  let ids = opt.a ? String(opt.a).split(',') : await page.evaluate(() => window.__taotie.artifacts.slice())
  if (opt.all) ids = ids.filter((id) => existsSync(specPath(id)))

  const rows = [] // { id, name, value, expected, tol, ok, note }
  const summary = []
  for (const id of ids) {
    let m
    try {
      await page.evaluate((id) => window.__taotie.show(id), id)
      m = await page.evaluate(() => window.__taotie.metrics())
    } catch (e) {
      rows.push({ id, name: '(build)', ok: false, note: e.message.split('\n')[0] })
      summary.push({ id, pass: 0, fail: 1 })
      continue
    }
    if (opt.json) console.log(JSON.stringify(m, null, 2))
    console.log(`\n${id}  (build ${m.buildMs} ms)`)
    console.log(`  overall      ${fmtBox(m.overall)}`)
    for (const [k, b] of Object.entries(m.parts)) console.log(`  ${k.padEnd(12)} ${fmtBox(b)}  ×${b.count}`)
    const sp = specPath(id)
    if (!existsSync(sp)) {
      console.log('  (no spec.json)')
      continue
    }
    const spec = JSON.parse(readFileSync(sp, 'utf8'))
    let pass = 0
    let fail = 0
    for (const [name, r] of Object.entries(spec.ratios || {})) {
      const tol = r.tol ?? 0.05 * Math.abs(r.expected)
      let v = null
      let note = r.expr
      try {
        v = evaluate(r.expr, m)
      } catch (e) {
        note = e.message
      }
      const ok = v != null && Number.isFinite(v) && Math.abs(v - r.expected) <= tol
      ok ? pass++ : fail++
      rows.push({ id, name, value: v, expected: r.expected, tol, ok, note })
    }
    summary.push({ id, pass, fail })
  }
  await s.close()

  // ---- the table
  const w = { id: Math.max(8, ...rows.map((r) => r.id.length)), name: Math.max(6, ...rows.map((r) => r.name.length)) }
  const num = (v) => (v == null || !Number.isFinite(v) ? '—' : v.toFixed(3))
  console.log('\n' + ['    ', 'artifact'.padEnd(w.id), 'ratio'.padEnd(w.name), 'measured'.padStart(9), 'expected'.padStart(9), '± tol'.padStart(7), '  expression'].join(' '))
  console.log('-'.repeat(w.id + w.name + 50))
  for (const r of rows)
    console.log(
      [r.ok ? 'PASS' : 'FAIL', r.id.padEnd(w.id), r.name.padEnd(w.name), num(r.value).padStart(9), (r.expected ?? '—').toString().padStart(9), (r.tol == null ? '—' : String(+r.tol.toFixed(4))).padStart(7), '  ' + (r.note || '')].join(' '),
    )
  console.log('')
  let failures = 0
  for (const x of summary) {
    failures += x.fail
    console.log(`${x.fail ? 'FAIL' : 'PASS'}  ${x.id.padEnd(w.id)}  ${x.pass}/${x.pass + x.fail} ratios`)
  }
  for (const e of errors) {
    failures++
    console.error('FAIL  console: ' + e)
  }
  if (!summary.length) console.log('(no artifact with a spec.json was measured)')
  console.log(failures ? `\n${failures} failure(s)` : '\nall ratios within tolerance')
  process.exit(failures ? 1 : 0)
}

function fmtBox(b) {
  return `w ${b.w} · h ${b.h} · d ${b.d} mm   y ${b.min[1]}…${b.max[1]}`
}

/** "a", "a / b", "a * b", "a + b", "a - b"; a and b are numbers or dotted paths. */
export function evaluate(expr, metrics) {
  const m = String(expr).trim().match(/^(\S+)\s*(?:([/*+-])\s*(\S+))?$/)
  if (!m) throw new Error(`cannot parse "${expr}"`)
  const val = (tok) => {
    if (/^-?\d+(\.\d+)?$/.test(tok)) return parseFloat(tok)
    if (!/^[A-Za-z_][\w-]*(\.[\w-]+)*$/.test(tok)) throw new Error(`bad operand "${tok}"`)
    let o = metrics
    for (const k of tok.split('.')) {
      if (o == null || !Object.prototype.hasOwnProperty.call(o, k)) throw new Error(`no "${tok}" in metrics`)
      o = o[k]
    }
    if (typeof o !== 'number') throw new Error(`"${tok}" is not a number`)
    return o
  }
  const a = val(m[1])
  if (!m[2]) return a
  const b = val(m[3])
  switch (m[2]) {
    case '/': return a / b
    case '*': return a * b
    case '+': return a + b
    case '-': return a - b
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) await main()
