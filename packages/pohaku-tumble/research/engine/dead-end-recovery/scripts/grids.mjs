// Grid presets. "s" = links scaled: LINK_MAX and the deal's near radius grow with the
// cell size, k = sqrt(72 / (cols*rows)) — the same as shrinking the floor so pairs keep
// Jukugo's spacing (and the view, in director mode, by the same factor).
export const GRIDS = {
  '9x8': { cols: 9, rows: 8 },
  '7x6': { cols: 7, rows: 6 },
  '7x6s': scaled(7, 6),
  '6x5s': scaled(6, 5),
  '5x4s': scaled(5, 4),
}
function scaled(cols, rows) {
  const k = Math.sqrt(72 / (cols * rows))
  return { cols, rows, linkMax: +(11.5 * k).toFixed(2), dealNear: +(9 * k).toFixed(2), viewScale: +k.toFixed(3) }
}
export const T = 'roots/.cache/tiers'
export const H = { horizontalOnly: true, slab: 1.5, seeds: 10, ticks: 1500 }
