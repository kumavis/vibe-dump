// The hall, in metres. One table read by both sides: the shaders get it as
// #defines, and the walking camera uses it to stay out of the walls and piers.
//
// +y up, the floor at y = 0. The hall runs along z; the viewer starts near the
// +z end looking down its length, toward the light.
export const ROOM = {
  HALF_W: 46, // walls at x = ±46
  Z0: -128, // far end wall
  Z1: 72, // near end wall
  H: 30, // the underside of the ceiling slab
  SLAB: 1.1, // its thickness, which the opening is cut through
  // two rows of square piers, floor to ceiling, leaving a clear nave
  PIER_X: 27,
  PIER_HALF: 1.8,
  PIER_Z0: -119,
  PIER_DZ: 19,
  PIER_N: 11,
  // the opening: the centre of the square of ceiling the figure is cut into
  HOLE_X: 4,
  HOLE_Z: -16,
  HOLE_SPAN: 26, // side of that square
}

// how many metres of hall one metre of the figure becomes
export const FIGURE_SCALE = 9

export function roomDefines() {
  return Object.entries(ROOM)
    .map(([k, v]) => (Number.isInteger(v) && k.endsWith('_N') ? `#define ROOM_${k} ${v}\n` : `#define ROOM_${k} ${v.toFixed(4)}\n`))
    .join('')
}

const PIER_CLEAR = 0.9 // how close the eye may come to concrete

// Push a point out of the walls and piers, keeping its height inside the hall.
export function confine(p) {
  const R = ROOM
  const m = PIER_CLEAR
  let [x, y, z] = p
  x = Math.max(-R.HALF_W + m, Math.min(R.HALF_W - m, x))
  z = Math.max(R.Z0 + m, Math.min(R.Z1 - m, z))
  y = Math.max(0.6, Math.min(R.H - 1.5, y))
  for (const px of [-R.PIER_X, R.PIER_X]) {
    const k = Math.round((z - R.PIER_Z0) / R.PIER_DZ)
    if (k < 0 || k >= R.PIER_N) continue
    const pz = R.PIER_Z0 + k * R.PIER_DZ
    const h = R.PIER_HALF + m
    const dx = x - px, dz = z - pz
    if (Math.abs(dx) < h && Math.abs(dz) < h) {
      // out by the nearest face
      if (h - Math.abs(dx) < h - Math.abs(dz)) x = px + Math.sign(dx || 1) * h
      else z = pz + Math.sign(dz || 1) * h
    }
  }
  return [x, y, z]
}
