// Fixed-step accumulator (design §3.2): simulate at `hz`, render at display rate
// and interpolate with the returned alpha. After a long stall (tab in the
// background) at most `maxSteps` steps run and the rest of the backlog is
// dropped, so a returning tab does not spiral.
export function makeTicker ({ hz = 30, maxSteps = 4, step }) {
  if (typeof step !== 'function') throw new TypeError('makeTicker needs step(dt)')
  const dt = 1 / hz
  const stepMs = 1000 / hz
  let last = null
  let acc = 0
  return {
    hz,
    dt,
    advance (nowMs) {
      if (last === null) { last = nowMs; return 0 }
      const frame = Math.max(0, nowMs - last)
      last = nowMs
      acc += frame
      let n = 0
      while (acc >= stepMs && n < maxSteps) { step(dt); acc -= stepMs; n++ }
      if (n === maxSteps && acc >= stepMs) acc = acc % stepMs
      return acc / stepMs
    },
    reset () { last = null; acc = 0 },
  }
}
