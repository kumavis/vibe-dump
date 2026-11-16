// Nezu bu 饕餮文瓿 (90082) — the décor (placeholder while tracing).

export function renderTrace(kit, panel, data, o = {}) {
  const W = panel.width
  if (o.ground !== false) kit.leiwenFill(panel, { margin: 0.5 }, { pitch: 1.25, line: 0.5, depth: 0.35, seed: o.seed ?? 1 })
  return W
}

const make = (kit, size, { ppmm, seed }, data, o = {}) => {
  const panel = new kit.ReliefPanel({ width: size.width, height: size.height, ppmm, seed })
  renderTrace(kit, panel, data, { seed, ...o })
  return panel.bake()
}
export const maskPanel = (kit, size, opts) => make(kit, size, opts, {})
export const shoulderPanel = (kit, size, opts) => make(kit, size, opts, {})
export const footPanel = (kit, size, opts) => make(kit, size, opts, {})
export const lidPanel = (kit, size, opts) => make(kit, size, opts, {})
