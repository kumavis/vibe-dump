#!/usr/bin/env node
// Measure built artifacts and check proportions against reference specs.
//
//   node tools/metrics.mjs [--a id] [--q 1] [--json]
//
// reference/<id>/spec.json:
//   { "ratios": { "legShare": { "expr": "parts.legs.h / overall.h", "expected": 0.38, "tol": 0.03 } } }
//
// `expr` is deliberately tiny — no eval: an operand is a number or a dotted
// path into the metrics object (overall.h, parts.legs.w, parts.legs.count …),
// optionally followed by ONE operator (/ * + -) and a second operand.
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { args, session, PKG } from './lib.mjs'

const opt = args()
const s = await session()
const { page, errors } = await s.open({ ui: '0', q: String(opt.q || 1), ...(opt.a ? { a: opt.a } : {}) })
await s.waitReady(page)
const ids = opt.a ? [opt.a] : await page.evaluate(() => window.__taotie.artifacts)
let failures = 0

for (const id of ids) {
  await page.evaluate((id) => window.__taotie.show(id), id)
  const m = await page.evaluate(() => window.__taotie.metrics())
  if (opt.json) console.log(JSON.stringify(m, null, 2))
  else {
    console.log(`\n${id}  (build ${m.buildMs} ms)`)
    console.log(`  overall      ${fmtBox(m.overall)}`)
    for (const [k, b] of Object.entries(m.parts)) console.log(`  ${k.padEnd(12)} ${fmtBox(b)}  ×${b.count}`)
  }
  const specPath = join(PKG, 'reference', id, 'spec.json')
  if (!existsSync(specPath)) continue
  const spec = JSON.parse(readFileSync(specPath, 'utf8'))
  console.log(`  — ${specPath.slice(PKG.length + 1)}`)
  for (const [name, r] of Object.entries(spec.ratios || {})) {
    let v
    try {
      v = evaluate(r.expr, m)
    } catch (e) {
      failures++
      console.log(`  ✗ ${name}: ${e.message}`)
      continue
    }
    const tol = r.tol ?? 0.05 * Math.abs(r.expected)
    const ok = Math.abs(v - r.expected) <= tol
    if (!ok) failures++
    console.log(`  ${ok ? '✓' : '✗'} ${name.padEnd(18)} ${v.toFixed(3)}  expected ${r.expected} ± ${tol}   (${r.expr})`)
  }
}

for (const e of errors) {
  failures++
  console.error('console: ' + e)
}
await s.close()
process.exit(failures ? 1 : 0)

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
