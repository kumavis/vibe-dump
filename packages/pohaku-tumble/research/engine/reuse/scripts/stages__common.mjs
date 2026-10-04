// Shared pieces for stage files.
export const POHAKU = { horizontalOnly: true, slab: 1.5, seeds: 10, ticks: 1500 }
// Grids. "fixed" keeps Jukugo's floor (42 x 29) and scales LINK_MAX and the
// deal's near radius with the cell size; "scaled" shrinks the floor so the
// spacing (and LINK_MAX) stay Jukugo's.
export const GRIDS = {
  '9x8': { cols: 9, rows: 8 },
  '7x6': { cols: 7, rows: 6, linkMax: +(11.5 * Math.sqrt((9 * 8) / (7 * 6))).toFixed(2), nearMax: +(9 * Math.sqrt((9 * 8) / (7 * 6))).toFixed(2) },
  '7x6s': { cols: 7, rows: 6, scaleBounds: true },
  '6x5s': { cols: 6, rows: 5, scaleBounds: true },
}
export const REAL = [128, 175, 225, 300, 400, 500].map((n) => `curve-realistic-${n}`)
export const STOCK = { dealMin: 1 }
export function job(name, lex, grid, rules) {
  return { name, lex, cfg: { ...POHAKU, ...GRIDS[grid], ...rules } }
}
