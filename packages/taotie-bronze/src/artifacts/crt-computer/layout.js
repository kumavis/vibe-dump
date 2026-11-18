// crt-computer — dimensions (mm, chosen, not measured) and small shape helpers shared by form.js and decor.js.
// Y up, the set stands on y = 0 (the plinth), front +Z, centred on x = 0.
//
// A generic late-1980s / early-1990s desktop set of no particular make: a wide low system unit on four short
// feet, a 14-inch-class CRT monitor on a swivel foot on top of it, a keyboard lying in front on the plinth.

export const UNIT = {
  legH: 18, // the four stubby ding legs (to the body's underside)
  w: 420, d: 360, h: 112, // the box (fang body) above the legs
  wall: 8,
  lidT: 9, lidOver: 4, // the cover plate on top
  get y0() { return this.legH },
  get y1() { return this.legH + this.h },
  get top() { return this.legH + this.h + this.lidT },
  get zf() { return this.d / 2 }, // front wall plane
}

export const MON = {
  w: 340, h: 306, // housing front section (outer)
  L: 312, // housing depth, bezel back → back of the tube block
  frontFrac: 0.3, taperEnd: 0.88, // straight front box, then the truncated pyramid, then the short tube block
  backW: 196, backH: 190,
  r: 8, // vertical-arris radius of the housing section
  get y0() { return UNIT.top + FOOT.h + FOOT.neckH }, // housing underside
  get yc() { return this.y0 + this.h / 2 },
  zf: 150, // housing front plane (the bezel stands in front of it)
}

export const BEZEL = {
  w: 344, h: 310, r: 14, // outer outline (2 mm proud of the housing all round)
  t: 23, // thickness: back face at MON.zf − 3
  screenW: 262, screenH: 197, screenR: 15, // the opening (4:3)
  screenDy: 10.5, // opening centre above the bezel centre (the deep bottom strip carries the knobs)
  get zb() { return MON.zf - 3 },
  get zFront() { return this.zb + this.t },
}

export const SCREEN = { bulge: 9.5, rimZ: MON.zf + 1.2, over: 3 }

export const FOOT = { r: 104, h: 13, neckR: 46, neckH: 17, z: MON.zf - 108 }

export const KEYB = {
  w: 404, d: 152, r: 9,
  t0: 15, t1: 31, // thickness at the front / back edge (a wedge)
  z: UNIT.d / 2 + 36 + 152 / 2, // centre (plan)
  u: 19.05, // key pitch
}

/** rounded rectangle outline, CCW, centred on c */
export function rrect(c, w, h, r, seg = 6) {
  r = Math.min(r, w / 2, h / 2)
  const out = []
  const corners = [[w / 2 - r, -h / 2 + r, -90], [w / 2 - r, h / 2 - r, 0], [-w / 2 + r, h / 2 - r, 90], [-w / 2 + r, -h / 2 + r, 180]]
  for (const [cx, cy, a0] of corners) {
    for (let i = 0; i <= seg; i++) {
      const a = ((a0 + (90 * i) / seg) * Math.PI) / 180
      out.push([c[0] + cx + r * Math.cos(a), c[1] + cy + r * Math.sin(a)])
    }
  }
  return out
}

/** signed distance to a rounded rectangle centred on c (negative inside) */
export function rrectSD(x, y, c, w, h, r) {
  const qx = Math.abs(x - c[0]) - (w / 2 - r)
  const qy = Math.abs(y - c[1]) - (h / 2 - r)
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r
}

export const smooth = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t))

/** the knob row on the bezel's chin (bezel mm from its centre line; y from the bezel's bottom edge) */
export const KNOB_X = [-40, 0, 40]
export const KNOB_Y = 33
/** unit front: panel mm (x from the left end, y from the body's underside) */
export const UNIT_FRONT = { floppy: { x: 210, y: 82, w: 118, h: 28 }, bay: { x: 210, y: 37, w: 150, h: 40 }, power: [44, 40], lamps: [[362, 40], [390, 40]] }
