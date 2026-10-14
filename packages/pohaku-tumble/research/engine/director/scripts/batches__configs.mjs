// The configurations reported. Deal is the same for all: dealMin 1 (matchMin stays 3).
export const BASE = { dealMin: 1, horizontalOnly: true, slab: 1.5, seeds: 10, duration: 3600 }
export const STOCK = {}
// D: director-only changes
export const D = { bgRetry: 'legal', noteTwo: true, noteLook: true, noteFresh: true, allowPrev: true, hist: 0.01 }
// D+look: plus a Board-side look-ahead weight on every turn (best overall)
export const DL = { ...D, look: 0.1 }
export const GRIDS = {
  '9x8': { cols: 9, rows: 8 },
  '7x6': { cols: 7, rows: 6 },
  '7x6s': { cols: 7, rows: 6, scaleFloor: true },
  '6x5s': { cols: 6, rows: 5, scaleFloor: true },
}
export const SIZES = [128, 175, 225, 300, 400, 500, 650, 905]
export const ORDERS = ['realistic', 'random', 'best']
export const lexName = (order, n) => (n === 128 ? 'attested-WA' : `curve-${order}-${n}`)
// BEST: D+look plus a lower draw weight for background pairs whose only way out is a bounce
export const BEST = { ...DL, bounceW: 0.25 }
export const G5 = { cols: 5, rows: 4, scaleFloor: true }
// FINAL: BEST plus off-screen release every 2 s (frees words held by pairs the camera can't see)
export const FINAL = { ...BEST, release: 2 }
