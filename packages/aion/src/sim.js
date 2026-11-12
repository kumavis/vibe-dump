// One shared story model. `t` runs 0..1 across the six stages in content.js;
// every visualization reads the same numbers so they stay in step.

const sm = (a, b, x) => {
  const k = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return k * k * (3 - 2 * k)
}

export const STAGE_COUNT = 6

export function simulate(t) {
  const u = Math.min(0.9999, Math.max(0, t)) * STAGE_COUNT
  const night = sm(2, 2.5, u) * (1 - sm(4.1, 4.7, u))
  const flowAll = 1 - 0.4 * night //            whole nerve head
  const squeeze = sm(3.1, 4, u) * (1 - 0.45 * sm(5, 6, u))
  const flow = Math.min(flowAll, 1 - 0.92 * squeeze) // affected sector
  const swelling = sm(3, 4, u) * (1 - 0.9 * sm(5, 5.9, u))
  const damage = sm(3.9, 5, u)
  const pallor = sm(5, 6, u)
  const crowd = sm(1, 1.5, u) * (1 - sm(2, 2.4, u)) // "look at the crowding" emphasis
  return { t, u, stage: Math.floor(u), night, flowAll, flow, swelling, damage, pallor, crowd }
}
