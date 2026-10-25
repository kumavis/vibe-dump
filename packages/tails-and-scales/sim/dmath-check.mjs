// Is core/dmath.js still the engine-independent maths it claims to be? (N0)
// Rules code takes hypot, hypot3, sin, cos, atan and atan2 from it, never
// from the engine's Math, whose results are implementation-defined:
// Chromium's build of V8 rounds sin and cos differently from Node's for a
// few inputs in a hundred. The corpus's shadow is Node's, so dmath must
//   1. equal Node's own Math bit for bit (sin, cos, atan, atan2 and hypot;
//      hypot3 against Math.hypot of three, the formula V8 uses), over a few
//      hundred thousand inputs per range: angles, small, medium and huge
//      arguments (the large-argument reduction), random bit patterns,
//      subnormals and the special values (±0, ±∞, NaN, the range edges);
//   2. with --browser, compute the very same bits in Chromium: the same
//      seeded inputs, built from exact bit patterns (never with ** or
//      Math.pow, which the engines also round their own ways), digested in
//      the page and in Node.
// A mismatch in 1 on a future Node means its V8 changed its trig, which the
// corpus's shadow rests on: say so before blaming dmath.
//
//   node sim/dmath-check.mjs [--n 200000] [--browser]
//
// Exit 0 when every result matches, 1 otherwise.
import { parseArgs } from 'node:util'
import { readFileSync } from 'node:fs'
import * as D from '../core/dmath.js'

const { values: a } = parseArgs({ options: { n: { type: 'string' }, browser: { type: 'boolean' } } })
const N = Number(a.n ?? 200000)

// Shared with the page (as source text): seeded inputs from exact bits, and
// a digest of each function's results over them
function probe(D, n) {
  let s = 0x9e3779b9
  const rnd = () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296)
  const dv = new DataView(new ArrayBuffer(8))
  const pow2 = (e) => (dv.setUint32(0, (e + 1023) << 20), dv.setUint32(4, 0), dv.getFloat64(0))
  const bits = () => (dv.setUint32(0, (rnd() * 4294967296) >>> 0), dv.setUint32(4, (rnd() * 4294967296) >>> 0), dv.getFloat64(0))
  const RANGES = {
    angle: () => rnd() * 6.283185307179586,
    small: () => (rnd() - 0.5) * 20,
    medium: () => (rnd() - 0.5) * pow2(Math.floor(rnd() * 40)),
    huge: () => (rnd() - 0.5) * pow2(20 + Math.floor(rnd() * 1000)),
    tiny: () => (rnd() - 0.5) * pow2(-Math.floor(rnd() * 1070)),
    bits,
  }
  const SPECIAL = [0, -0, 1, -1, 0.5, 1.5, Infinity, -Infinity, NaN, 5e-324, -5e-324, 1.7976931348623157e308, Math.PI, Math.PI / 2, Math.PI / 4, 0.4375, 0.6875, 1.1875, 2.4375, pow2(-27), pow2(66), 1e300]
  const out = {}
  for (const f of ['sin', 'cos', 'atan', 'atan2', 'hypot', 'hypot3']) {
    let h = 0
    const take = (v) => {
      dv.setFloat64(0, v)
      h = (Math.imul(h ^ dv.getUint32(0), 0x01000193) ^ dv.getUint32(4)) >>> 0
    }
    const one = (x, y, z) => take(f === 'atan2' ? D.atan2(y, x) : f === 'hypot' ? D.hypot(x, y) : f === 'hypot3' ? D.hypot3(x, y, z) : D[f](x))
    for (const gen of Object.values(RANGES)) for (let i = 0; i < n; i++) one(gen(), gen(), gen())
    for (const x of SPECIAL) for (const y of SPECIAL) one(x, y, x)
    out[f] = h.toString(16)
  }
  return out
}

// 1. Node's Math, input by input
const same = (x, y) => Object.is(x, y) || (x !== x && y !== y)
const REF = {
  sin: (x) => Math.sin(x), cos: (x) => Math.cos(x), atan: (x) => Math.atan(x), atan2: (x, y) => Math.atan2(y, x),
  hypot: (x, y) => Math.hypot(x, y), hypot3: (x, y, z) => Math.hypot(x, y, z),
}
const OURS = { sin: D.sin, cos: D.cos, atan: D.atan, atan2: (x, y) => D.atan2(y, x), hypot: D.hypot, hypot3: D.hypot3 }
const misses = Object.fromEntries(Object.keys(REF).map((f) => [f, []]))
{
  // the probe's own inputs, replayed here with the reference beside them
  const seen = []
  probe(new Proxy({}, { get: (_, f) => (...args) => (seen.push([f, args]), 0) }), Math.min(N, 20000))
  let s = 1
  const rnd = () => ((s = (Math.imul(s, 1103515245) + 12345) >>> 0) / 4294967296)
  const dv = new DataView(new ArrayBuffer(8))
  const bits = () => (dv.setUint32(0, (rnd() * 4294967296) >>> 0), dv.setUint32(4, (rnd() * 4294967296) >>> 0), dv.getFloat64(0))
  const check = (f, args) => {
    const [x, y, z] = f === 'atan2' ? [args[1], args[0]] : args
    const want = REF[f](x, y, z), got = OURS[f](x, y, z)
    if (!same(want, got) && misses[f].length < 5) misses[f].push(`${f}(${[x, y, z].slice(0, f === 'hypot3' ? 3 : f === 'hypot' || f === 'atan2' ? 2 : 1).join(', ')}): Math ${want}, dmath ${got}`)
    if (!same(want, got)) misses[f].n = (misses[f].n ?? 0) + 1
  }
  for (const [f, args] of seen) check(f, args)
  // and as many again of raw bit patterns, scaled into every range
  for (let i = 0; i < N; i++) {
    const x = bits(), y = bits(), z = bits()
    for (const f of Object.keys(REF)) check(f, [x, y, z])
    const t = (rnd() - 0.5) * 1e6
    for (const f of ['sin', 'cos', 'atan']) check(f, [t])
  }
}
let bad = 0
for (const [f, m] of Object.entries(misses)) {
  console.log(`  ${f.padEnd(7)} ${m.n ? `${m.n} results differ from Node's Math.${f === 'hypot3' ? 'hypot' : f}` : 'Node\'s bits'}`)
  for (const x of m) console.log(`      ${x}`)
  bad += m.n ?? 0
}

// 2. the same bits in Chromium
if (a.browser) {
  const { chromium } = await import('playwright')
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined })
  const page = await browser.newPage()
  const src = readFileSync(new URL('../core/dmath.js', import.meta.url), 'utf8').replace(/^export /gm, '')
  const web = JSON.parse(await page.evaluate(`(() => { ${src}\n${probe.toString()}\nreturn JSON.stringify(probe({ sin, cos, atan, atan2, hypot, hypot3 }, ${N})) })()`))
  const node = probe(D, N)
  console.log(`\n  Chromium ${browser.version()}, ${N} inputs per range and the special values:`)
  for (const f of Object.keys(node)) {
    const ok = web[f] === node[f]
    if (!ok) bad++
    console.log(`  ${f.padEnd(7)} ${ok ? 'the same bits as Node' : `DIFFERS: digest ${web[f]} in Chromium, ${node[f]} in Node`}`)
  }
  await browser.close()
}

console.log(bad ? '\ndmath-check FAILED' : `\ndmath-check passed: core/dmath.js computes Node's own bits${a.browser ? ', and the same bits in Chromium' : ''}`)
process.exit(bad ? 1 : 0)
