// screen.js — how big the machine's own screen is.
//
// The panel used to be 1440x900 forever, centred in the page with black
// around it. It is the window's size now: open the app on a 21:9 monitor and
// the OS is 21:9, in a portrait phone it is portrait. One number is kept back
// from that — a floor, below which the chrome stops being chrome — and under
// it the panel holds MIN and the page scales the whole layer down to fit,
// which is the old letterbox behaviour surviving in the only case it was
// ever really for.
//
// The consequence worth knowing about lives two directories over: the 3D
// monitor's screen is built to whatever shape this reports, because the
// reveal hands the panel from the page to that monitor without a cut and a
// seam only stays invisible while both are the same rectangle.

/** Below this the desktop stops fitting an app bar, a window and its chrome. */
export const MIN = { w: 900, h: 560 }

/**
 * The live panel geometry.
 *
 *   w, h   logical screen pixels — what the OS lays itself out in
 *   scale  logical pixels to page pixels; 1 whenever the window clears MIN
 *
 * `w * scale` is the window width, to within the rounding on w.
 */
export const SCREEN = { w: MIN.w, h: MIN.h, scale: 1 }

/** Re-read the window. Pure apart from writing SCREEN, and safe to call at any
 *  point in a resize — nothing downstream depends on who calls it first. */
export function measure(width = window.innerWidth, height = window.innerHeight) {
  const w = Math.max(1, width)
  const h = Math.max(1, height)
  // Scale first, then divide: clamping the two axes independently would hand
  // back a panel whose aspect is no longer the window's, and the whole reveal
  // rests on those two being the same shape.
  const scale = Math.min(1, w / MIN.w, h / MIN.h)
  SCREEN.scale = scale
  SCREEN.w = Math.round(w / scale)
  SCREEN.h = Math.round(h / scale)
  return SCREEN
}

/**
 * "1440 x 900, 16:10" — for the machine's own About box, which is the only
 * place it ever admits to a resolution.
 *
 * Named ratios first, because 1707:1067 is arithmetically perfect and tells
 * nobody anything. Anything that does not land on one gets a decimal.
 */
export function aspectLabel(w = SCREEN.w, h = SCREEN.h) {
  const r = w / h
  const named = [
    [16 / 10, '16:10'],
    [16 / 9, '16:9'],
    [4 / 3, '4:3'],
    [3 / 2, '3:2'],
    [5 / 4, '5:4'],
    [21 / 9, '21:9'],
    [32 / 9, '32:9'],
    [1, '1:1'],
    [10 / 16, '10:16'],
    [9 / 16, '9:16'],
    [3 / 4, '3:4'],
    [2 / 3, '2:3'],
  ]
  for (const [value, label] of named) if (Math.abs(r - value) < 0.012) return label
  return r >= 1 ? `${r.toFixed(2)}:1` : `1:${(1 / r).toFixed(2)}`
}
