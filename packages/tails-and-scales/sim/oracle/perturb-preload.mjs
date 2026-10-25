// Preloaded into an oracle child by sim/perturb.mjs (node --import): every
// result of the Math functions named in PERTURB (comma-separated) is moved one
// ULP away from zero, before the game's code loads. Rules code that still
// calls one of them then plays a slightly different battle; code that goes
// through core/dmath.js doesn't notice. The count of nudged calls is written
// to fd 2 at exit, and perturb.mjs refuses a run without it, so a probe that
// never fired can't pass as "no change".
const f64 = new Float64Array(1), i64 = new BigInt64Array(f64.buffer)
const nudge = (v) => {
  if (v === 0 || !Number.isFinite(v)) return v
  f64[0] = v
  i64[0] += 1n
  return f64[0]
}
const names = (process.env.PERTURB ?? '').split(',').filter(Boolean)
let calls = 0
for (const name of names) {
  const orig = Math[name]
  if (typeof orig !== 'function') throw new Error(`PERTURB: Math.${name} is not a function`)
  Math[name] = function (...a) {
    calls++
    return nudge(orig.apply(Math, a))
  }
}
process.on('exit', () => process.stderr.write(`perturb: ${calls} nudged calls to Math.${names.join('/')}\n`))
