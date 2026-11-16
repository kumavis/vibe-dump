// Nezu jue — décor panels (placeholder skeleton; traced data in trace.js)
import { REG } from './form.js'

export const PANEL = { r: 34.4, y0: 98, y1: 164 }
PANEL.w = 2 * Math.PI * PANEL.r
PANEL.h = PANEL.y1 - PANEL.y0

export function bandPanel(kit, { ppmm, seed }) {
  const p = new kit.ReliefPanel({ width: PANEL.w, height: PANEL.h, ppmm, seed, maxSize: 4096 })
  const yb0 = REG.band[0] - PANEL.y0, yb1 = REG.band[1] - PANEL.y0
  p.raise((ctx) => { ctx.fillRect(0, yb0 - 1.2, PANEL.w, 1.0); ctx.fillRect(0, yb1 + 0.2, PANEL.w, 1.0) }, { height: 0.6, shoulder: 0.3 })
  return p.bake()
}

export function whorlPanel(kit, { ppmm, seed }) {
  const p = new kit.ReliefPanel({ width: 23.8, height: 23.8, ppmm, seed })
  return p.bake()
}
