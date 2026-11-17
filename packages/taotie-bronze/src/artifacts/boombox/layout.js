// boombox — dimensions (mm, chosen, not measured) and small shape helpers shared by form.js and decor.js.
// Y up, the radio stands on y = 0 (its feet), front +Z, centred on x = 0.
//
// A generic portable radio-cassette player of the 1980s, of no particular make: a wide, shallow box (≈ 2.2 : 1) on four
// short feet, two big round speakers at the ends of the front, the tuner window and the cassette door between them,
// piano-key transport buttons on the top front edge, three knobs and two slider slots under the door, a folding carrying
// handle raised over the top, a telescopic antenna raised at the back right.

export const BODY = {
  legH: 12, // feet: to the body's underside
  w: 460, // overall width (the faceplate; the box behind is 4 mm narrower)
  h: 200, // the box (fang body) height above the feet, under the lid
  lidT: 9, // the lid plate on top
  zBack: -62, zSeam: 28, zFront: 62, // the box runs zBack → zSeam, the faceplate zSeam → zFront
  r: 14, // plan radius of the box's vertical arrises
  wall: 6,
  get y0() { return this.legH },
  get y1() { return this.legH + this.h },
  get top() { return this.legH + this.h + this.lidT },
  get boxW() { return this.w - 4 },
  get boxD() { return this.zSeam - this.zBack },
  get zMid() { return (this.zSeam + this.zBack) / 2 },
}

/** the faceplate: a thick plate standing on the box's front, panel frame origin = its bottom-left corner */
export const FACE = {
  w: 464, h: 209, r: 12, t: 34,
  get x0() { return -this.w / 2 },
  get y0() { return BODY.y0 },
  get zMid() { return (BODY.zSeam + BODY.zFront) / 2 },
  get cx() { return this.w / 2 },
}

/** the speakers (faceplate panel mm) */
export const SPK = {
  dx: 148, // centre x from the axis
  y: 100, // centre y in the faceplate panel
  hole: 60, // the opening in the faceplate
  lip: 7, // the opening's lip slopes in over this width (faceplate thickness drops by 2 × lipDrop)
  lipDrop: 6,
  ring: [64, 79], // the surround: a ridge bundle between these radii
  coneR: 60.6, // the cone's rim radius (meets the opening's wall)
  rimZ: 50, // world z of the cone's rim; its floor is just in front of the box's front wall
  floorZ: 29.6,
  cap: 24, // dust cap radius (the coiled-serpent pupil boss)
  capH: 12, // its height above the cone floor
}

/** the centre column (faceplate panel mm, x from the axis) */
export const MID = {
  tuner: { w: 128, y0: 173, y1: 197 }, // the sunk window
  nose: { y0: 147, y1: 169 }, // the short notched flange on the axis
  door: { w: 120, h: 74, y: 107 }, // the cassette door plate (centre y)
  knobs: { x: [-44, 0, 44], y: 44, r: 11 },
  sliders: { x: [-22, 22], y0: 30, y1: 60, w: 5 },
}

/** the cassette door (its own plate; panel origin bottom-left) */
export const DOOR = {
  w: 120, h: 74, r: 6, t: 6,
  window: { x0: 12, y0: 22, x1: 108, y1: 64, r: 7 },
  hubs: [[36, 46], [84, 46]], hubR: 8.5,
}

/** piano-key transport buttons on the faceplate's top edge */
export const KEYS = { n: 6, pitch: 20, w: 16.5, d: 26, h: 7, zFront: BODY.zFront + 3 }

/** the carrying handle: a swept flat bar on two arms pivoting at the body's sides */
export const HANDLE = {
  pivotY: 190, pivotZ: BODY.zMid, // on the side faces
  barY: 296, // centre line of the bar
  armX: 240, // centre line of the arms (|x|)
  bend: 34, // corner radius of the bend
  wide: 26, thick: 12, // section: across (z) × through (in-plane)
}

export const ANTENNA = {
  base: [186, BODY.top, BODY.zBack + 14],
  dir: [-0.8, 0.585, -0.13], // raised, leaning left over the top
  length: 250,
  r0: 5.2, r1: 2.4, // rod radius at the base / tip
}

export const FEET = { x: 188, z: [-38, 18], r: 14 }

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

/** a circle outline, CCW */
export function circle(c, r, n = 72) {
  const out = []
  for (let i = 0; i < n; i++) { const a = (2 * Math.PI * i) / n; out.push([c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)]) }
  return out
}

export const smooth = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t))
