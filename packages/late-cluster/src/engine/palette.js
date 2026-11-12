// Per-character colour for the vendored head renderer.
//
// chimera's palette `V` (chimera/ui/colors.ts) is one module-level object the 3D head reads while
// it draws (and while `buildRest` bakes a body's static geometry). Each puppet has its own palette;
// withPalette() swaps V's fields in for the duration of that puppet's build/update and restores the
// house palette afterwards, so no vendored file needs to change.
import { V, mix } from '../../chimera/ui/colors.ts'

export const HOUSE = Object.freeze({ ...V })

export function withPalette(pal, fn) {
  if (!pal) return fn()
  Object.assign(V, pal)
  try {
    return fn()
  } finally {
    Object.assign(V, HOUSE)
  }
}

/**
 * A head palette from one signature colour: structure in that hue (bright / mid / dim), the
 * articulators (tongue, jaw, lips, velum) kept in chimera's slot colours unless overridden.
 *   headPalette('#ffc861', { green: '#7dffb0' })
 */
export function headPalette(main, over = {}) {
  return {
    ...HOUSE,
    blue: main,
    blueMid: mix(main, '#000000', 0.22),
    blueDim: mix(main, '#000000', 0.45),
    frame: mix(main, '#000000', 0.7),
    ...over,
  }
}

export { V, mix }
