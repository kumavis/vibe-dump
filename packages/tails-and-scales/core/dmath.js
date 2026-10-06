// Deterministic maths for rules code. The engine's own hypot is
// implementation-defined: these are V8's formulas (src/builtins/math.tq,
// FastMathHypot) in plain JS over exact IEEE operations, so every engine
// computes the same bits, and they match V8's own bit for bit, so the switch
// changes no battle.

export function hypot(x, y) {
  const a = Math.abs(x), b = Math.abs(y)
  if (a === Infinity || b === Infinity) return Infinity
  const max = Math.max(a, b)
  if (max !== max) return NaN
  if (max === 0) return 0
  return Math.sqrt((a / max) * (a / max) + (b / max) * (b / max)) * max
}

export function hypot3(x, y, z) {
  const a = Math.abs(x), b = Math.abs(y), c = Math.abs(z)
  if (a === Infinity || b === Infinity || c === Infinity) return Infinity
  const max = Math.max(Math.max(a, b), c)
  if (max !== max) return NaN
  if (max === 0) return 0
  const pa = (a / max) * (a / max)
  const pb = (b / max) * (b / max)
  const comp = (pa + pb) - pa - pb
  const pc = (c / max) * (c / max) - comp
  return Math.sqrt(pa + pb + pc) * max
}
