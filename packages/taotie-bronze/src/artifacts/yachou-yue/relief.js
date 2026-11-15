// Yachou yue — the face in relief (round 7 redraw). Traced from the CC0 head-on photograph flattened to plate mm
// (reference/yachou-yue/faces/face-mask.jpg, 8 px/mm; plate frame as form.js; the flattened photo's own 0.5 mm offset
// of the plate axis removed), the volumes read off the top-lit low view (three-quarter.jpg, 3840 px original) and
// cross-checked against the owner's evenly lit press image (private, never committed).
//
// The bronze is SCULPTURE, not embossed sheet: fat masses 5–7.5 mm proud with rounded shoulders, convex tops and deep
// pockets between them, and no ground pattern. So every part here is a MASS — a drawn outline raised to a height
// FUNCTION of position (and of the distance to its own edges: rolled rings, sloping lids, a lip that crests at its inner
// edge) behind a rounded wall — and every pocket is CARVED down to a floor, not stamped as a groove (`sculpt` below).
// Openings are cut by the geometry (form.js, traced.js); a mass that frames a hole runs past it, and its height is held
// even along the hole's edge so the cut wall comes out crisp.
//
// Everything is authored in PLATE mm (x = 0 on the plate axis, y = 0 at the lowest point of the edge). The face is not
// symmetric on the bronze — the nose and mouth sit ≈ 3–4 mm right of the eyes' axis, the ears, brows and nostrils differ
// — so the two sides are drawn from their own measurements.

import { EYE, MASK_DX, smoothClosed, smoothOpen, circle } from './form.js'
import { EAR_CUT_L, EAR_CUT_R, BROW_CUT_L } from './traced.js'

/** the panel lies over the whole plate; front and back both read it at the same plate x (form and holes line up) */
export const RECT = { x: -178, y: -3, w: 356, h: 333 }

const EYE_L = [MASK_DX - EYE.c[0], EYE.c[1]]
const EYE_R = [MASK_DX + EYE.c[0], EYE.c[1]]
const BROW_CUT_R = BROW_CUT_L.map(([x, y]) => [2 * MASK_DX - x, y]).reverse()

const clamp01 = (t) => (t < 0 ? 0 : t > 1 ? 1 : t)
const smooth = (t) => { t = clamp01(t); return t * t * (3 - 2 * t) }
/** quarter-ellipse wall: 0 at the outline, 1 at `w` inside it — steep foot, rounded shoulder */
const wallAt = (s, w) => (s >= w ? 1 : s <= 0 ? 0 : Math.sqrt(1 - (1 - s / w) * (1 - s / w)))

// ------------------------------------------------------------------ the sculpting primitive

/**
 * Raise (or carve) a region to a height FUNCTION.
 * spec.shape: [[x, y]…] | [[[x, y]…]…] | (ctx) => {} in plate mm (filled nonzero); spec.cut: the same, subtracted.
 * spec.aux: extra shapes whose signed distances (mm, + inside) are handed to g, for two-edged profiles.
 * spec.g(x, y, s, aux): height (mm) at a plate point, s = distance inside the outline (mm).
 * spec.wall: mm of rounded shoulder at the outline (0: g is used as is).
 * spec.mode: 'max' (default, field = max(field, h)) | 'carve' (blend the field down to h behind the wall) | 'add'.
 */
function sculpt(kit, panel, spec) {
  const { g, wall = 2.5, mode = 'max', margin = 1 } = spec
  const pp = panel.ppmm
  const bb = bbox(spec.shape)
  const pad = 4
  const x0 = Math.max(0, Math.floor((bb[0] - margin - RECT.x) * pp) - pad)
  const y0 = Math.max(0, Math.floor((bb[1] - margin - RECT.y) * pp) - pad)
  const x1 = Math.min(panel.cols, Math.ceil((bb[2] + margin - RECT.x) * pp) + pad)
  const y1 = Math.min(panel.rows, Math.ceil((bb[3] + margin - RECT.y) * pp) + pad)
  const bw = x1 - x0, bh = y1 - y0
  if (bw < 2 || bh < 2) return
  const frame = { x0, y0, bw, bh, pp }
  const sd = kit.signedDistance(raster(kit, frame, spec.shape, spec.cut), bw, bh)
  const aux = (spec.aux || []).map((a) => kit.signedDistance(raster(kit, frame, a), bw, bh))
  const av = new Array(aux.length)
  const F = panel.field, cols = panel.cols, inv = 1 / pp
  for (let j = 0; j < bh; j++) {
    const Y = RECT.y + (y0 + j + 0.5) * inv
    for (let i = 0; i < bw; i++) {
      const k = j * bw + i
      const s = sd[k] * inv
      if (s <= 0) continue
      const X = RECT.x + (x0 + i + 0.5) * inv
      for (let a = 0; a < aux.length; a++) av[a] = aux[a][k] * inv
      const h = g(X, Y, s, av)
      const w = wall > 0 ? wallAt(s, wall) : 1
      const f = (y0 + j) * cols + x0 + i
      if (mode === 'max') { const v = h * w; if (v > F[f]) F[f] = v }
      else if (mode === 'carve') F[f] = F[f] + (h - F[f]) * w
      else F[f] += h * w
    }
  }
}

function bbox(shape) {
  const b = [Infinity, Infinity, -Infinity, -Infinity]
  const walk = (s) => {
    if (typeof s === 'function') { const e = s.bbox; b[0] = Math.min(b[0], e[0]); b[1] = Math.min(b[1], e[1]); b[2] = Math.max(b[2], e[2]); b[3] = Math.max(b[3], e[3]); return }
    if (typeof s[0] === 'number') { b[0] = Math.min(b[0], s[0]); b[1] = Math.min(b[1], s[1]); b[2] = Math.max(b[2], s[0]); b[3] = Math.max(b[3], s[1]); return }
    for (const t of s) walk(t)
  }
  walk(shape)
  return b
}

const polys = (shape) => (typeof shape === 'function' || typeof shape[0][0] !== 'number' ? shape : [shape])

/** coverage (0..1, row 0 = bottom) of shape − cut over a panel-pixel frame */
function raster(kit, { x0, y0, bw, bh, pp }, shape, cut) {
  const cv = kit.createCanvas(bw, bh)
  const ctx = cv.getContext('2d', { willReadFrequently: true })
  ctx.setTransform(pp, 0, 0, -pp, -RECT.x * pp - x0, y0 + bh + RECT.y * pp)
  ctx.fillStyle = '#fff'
  ctx.strokeStyle = '#fff'
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  const paint = (s) => {
    if (typeof s === 'function') { s(ctx); return }
    ctx.beginPath()
    for (const P of polys(s)) { ctx.moveTo(P[0][0], P[0][1]); for (let i = 1; i < P.length; i++) ctx.lineTo(P[i][0], P[i][1]); ctx.closePath() }
    ctx.fill()
  }
  paint(shape)
  if (cut) { ctx.globalCompositeOperation = 'destination-out'; paint(cut); ctx.globalCompositeOperation = 'source-over' }
  const d = ctx.getImageData(0, 0, bw, bh).data
  const cov = new Float32Array(bw * bh)
  for (let r = 0; r < bh; r++) {
    const src = r * bw * 4, dst = (bh - 1 - r) * bw
    for (let c = 0; c < bw; c++) cov[dst + c] = d[src + c * 4 + 3] / 255
  }
  return cov
}

/** a stroked polyline as a shape (plate mm), with its bbox for `sculpt` */
function strokeShape(pts, w) {
  const f = (ctx) => {
    ctx.lineWidth = w
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1])
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1])
    ctx.stroke()
  }
  const b = bbox(pts)
  f.bbox = [b[0] - w, b[1] - w, b[2] + w, b[3] + w]
  return f
}

/** distance from (x, y) to a polyline */
function polyDist(P, x, y) {
  let best = Infinity
  for (let i = 0; i < P.length - 1; i++) {
    const ax = P[i][0], ay = P[i][1], dx = P[i + 1][0] - ax, dy = P[i + 1][1] - ay
    const t = clamp01(((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy || 1))
    const d = Math.hypot(x - ax - t * dx, y - ay - t * dy)
    if (d < best) best = d
  }
  return best
}

const mirrorAbout = (pts, ax) => pts.map(([x, y]) => [2 * ax - x, y])

// ------------------------------------------------------------------ the face

export function drawFace(kit, panel, { back = false } = {}) {
  mouth(kit, panel)
  nose(kit, panel)
  for (const s of [-1, 1]) eye(kit, panel, s)
  for (const s of [-1, 1]) ear(kit, panel, s)
  for (const s of [-1, 1]) brow(kit, panel, s)
  inscriptions(kit, panel, back)
}

// ---- eyes: a fat convex ring round each hole, and under it a pear-shaped mass falling toward the cheek, below and
// outside. The ring crests (7.2) a third of the way out and rolls over steeply into the hole, whose edge stands at an
// even 2.2 all round; the pear slopes from ≈ 6 under the ring to ≈ 2.6 at its rounded lower edge.
const PEAR = {
  [-1]: [[-74.4, 186], [-74.6, 175], [-73, 165], [-69.5, 157.5], [-64, 152.6], [-57, 151.2], [-49.5, 152.8], [-43.5, 157.6],
    [-38.4, 165], [-35.2, 174], [-34.4, 186]],
  [1]: [[37.4, 186], [37.8, 175], [40, 165.5], [44, 158.5], [50, 154.2], [57.5, 152.8], [65, 154.4], [71.4, 159.5],
    [75.6, 166.5], [77.4, 175], [77.4, 186]],
}

function eye(kit, panel, s) {
  const [cx, cy] = s > 0 ? EYE_R : EYE_L
  const R0 = EYE.r, R1 = 20.2, RC = 14.4
  const ring = (x, y) => {
    const r = Math.hypot(x - cx, y - cy)
    if (r < RC) { const t = clamp01((RC - r) / (RC - R0 + 0.55)); return 2.2 + 5.0 * Math.sqrt(1 - t * t) }
    const t = clamp01((r - RC) / (R1 - RC)); return 7.2 * Math.sqrt(1 - Math.pow(t, 2.4))
  }
  // the pear: the ring's disc carried down into the teardrop outline
  const pear = smoothClosed(PEAR[s].concat(circle([cx, cy], R1 - 0.6, 36).filter(([, y]) => y > cy + 1).sort((a, b) => b[0] - a[0])), 4)
  const yBot = Math.min(...PEAR[s].map((p) => p[1]))
  sculpt(kit, panel, {
    shape: pear, cut: [circle([cx, cy], R0 - 0.4, 48)], wall: 3.2,
    g: (x, y, d) => {
      const t = smooth((y - yBot) / (cy - 9 - yBot))
      return (2.6 + 3.6 * t) * (0.86 + 0.14 * clamp01(d / 7))
    },
  })
  sculpt(kit, panel, { shape: circle([cx, cy], R1, 96), cut: [circle([cx, cy], R0 - 1.5, 48)], wall: 0, g: ring })
}

// ---- ears: a thick ROLLED C round the ragged traced hole — it crests near its outer edge and rolls over and down into
// the hole (down to 0.8 at the hole's edge, so the opening reads as the deep dark cavity of the photographs, ≈ 13 × 28 mm,
// round a through-hole of ≈ 11 × 21 — the through-hole is what the backdrop shows in the head-on photograph; the larger
// figure is the roll's dark underside), swelling into a broad lobe at the bottom
const EAR_OUT = {
  [-1]: [[-93, 201.4], [-87.4, 200.4], [-83.9, 196.8], [-82.4, 190], [-82.4, 182], [-83.4, 175], [-85.6, 168.6], [-89.4, 164.2],
    [-94.2, 162.6], [-99.6, 163.8], [-103.6, 168], [-105.4, 176], [-105.6, 186], [-104.4, 194.6], [-100.2, 199.6]],
  [1]: [[99.4, 200.2], [104.6, 199], [108.4, 195.6], [109.8, 188], [109.8, 178], [108.6, 170], [105.8, 164], [101, 160.6],
    [96, 160.6], [92.4, 163.6], [90.4, 169], [89.6, 177], [89.6, 186], [90.6, 193.6], [94.2, 198.6]],
}

function ear(kit, panel, s) {
  const hole = s > 0 ? EAR_CUT_R : EAR_CUT_L
  const out = smoothClosed(EAR_OUT[s], 5)
  const lobeY = s > 0 ? 166 : 168
  sculpt(kit, panel, {
    shape: out, cut: [hole], aux: [hole], wall: 0,
    g: (x, y, a, [dh]) => {
      const b = -dh // distance from the hole's edge
      const t = a / (a + b) // 0 outer edge … 1 hole edge
      const crest = 0.42
      const H = 6.8 + 0.7 * smooth((lobeY - y) / 6)
      if (t < crest) { const u = 1 - t / crest; return H * Math.sqrt(1 - u * u) * wallAt(a, 1.2) }
      const u = (t - crest) / (1 - crest)
      return 0.8 + (H - 0.8) * Math.pow(Math.cos(u * Math.PI / 2), 1.1)
    },
  })
}

// ---- brows: ONE swollen mass each — a fat arched band (crest 7.4) over the through-slit, its outer end turned down
// and its inner end hooked, and under the slit a solid lid that slopes from ≈ 6 at the slit to ≈ 2.8 at its lower
// edge (in the top-lit photograph it lies in the band's shadow, so it reads dark). No rim round the lid.
const BROW = {
  [-1]: {
    out: [[-93.8, 231.2], [-91.2, 234.6], [-86, 236.2], [-76, 236.6], [-66, 236], [-56, 234.8], [-48, 232.8], [-41.6, 229.8],
      [-35, 226.2], [-30.8, 223], [-28.8, 219.4], [-29.8, 216.4], [-33.4, 214.8], [-40, 213.6], [-50, 211], [-60, 208.6], [-70, 207.4],
      [-80, 206.8], [-86.4, 205.8], [-90.8, 207.4], [-93.6, 211], [-94.8, 218], [-94.8, 226]],
    band: [[-91.4, 212], [-92, 222], [-91.4, 228.6], [-88.8, 232.6], [-83, 233.8], [-70, 234], [-58, 232.6], [-49, 230.2],
      [-42, 226.6], [-36.4, 222.8], [-32.2, 219]],
  },
  [1]: {
    out: [[36, 213], [38.4, 219.4], [42, 224.8], [47, 229.2], [53, 232.4], [60, 234], [70, 235.2], [80, 235.2], [87.6, 233.8],
      [92.2, 231.4], [95.4, 227.4], [96.2, 221], [95.6, 214], [93.2, 208.8], [89, 205.8], [80, 205.2], [70, 205],
      [60, 205.2], [50, 206.2], [42, 207.8], [37.4, 209.8]],
    band: [[38.6, 214.6], [41.6, 220.6], [46, 225.8], [52, 229.6], [60, 231.6], [70, 232.8], [80, 232.8], [87, 231.4],
      [91.4, 228.4], [92.8, 223], [92.4, 213.5]],
  },
}

function brow(kit, panel, s) {
  const B = BROW[s]
  const slit = s > 0 ? BROW_CUT_R : BROW_CUT_L
  const band = smoothOpen(B.band, 6)
  // the band's arch as y(x): its upper run only (the turned-down ends excluded), extended flat past its ends
  const arch = band.filter(([, y]) => y > 224).sort((p, q) => p[0] - q[0])
  const archY = (x) => {
    if (x <= arch[0][0]) return arch[0][1]
    for (let i = 1; i < arch.length; i++) if (x <= arch[i][0]) { const [x0, y0] = arch[i - 1], [x1, y1] = arch[i]; return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0 || 1) }
    return arch[arch.length - 1][1]
  }
  sculpt(kit, panel, {
    shape: smoothClosed(B.out, 5), cut: [slit], aux: [slit], wall: 1.4,
    g: (x, y, a, [ds]) => {
      // one mass: highest along the band, falling away below it in a long convex slope to the lid's lower edge (the
      // fall is measured straight down from the band's arch, so the lid is one smooth ramp); the band a rounded crown
      const db = polyDist(band, x, y)
      const hb = db < 4.4 ? 7.1 + 0.5 * Math.sqrt(1 - (db / 4.4) * (db / 4.4)) : 0
      const dy = Math.max(0, archY(x) - y)
      const slope = 7.0 - 5.4 * Math.pow(clamp01(dy / 24), 1.25)
      const b = Math.max(0, -ds) // distance from the slit
      const lip = 0.25 * (1 - smooth(b / 2.5)) // the lid's edge along the slit rounds up a little
      return Math.max(hb, slope + lip) * Math.sqrt(smooth(a / 2.4))
    },
  })
}

// ---- nose: Y crest of two fleshy leaf lobes with dished tops on a thick stem with an incised line down its middle;
// either side of the stem at eye height an upper squarish lump and under it a hooked lump curling round a deep
// pocket; at the foot a heart-shaped bulb flanked by two big nostril scrolls whose curls project past it, and under
// all three a heavy crescent upper lip curving up at both ends. Measured (plate mm) on face-mask.jpg.
const NOSE = {
  // the Y outline: left tip → over the top → right tip → down the stem → back up
  crest: [[-15.8, 229.6], [-11, 229.6], [-5, 228], [0.6, 226.4], [4.4, 225.6], [9, 226.6], [15, 228.2], [20.5, 229], [24.8, 228.4],
    [24.4, 224.6], [20.4, 220.6], [15.4, 216.6], [11.6, 213.2], [10.2, 210.4], [9.8, 200], [9.4, 186], [9.0, 176], [2.0, 175.4],
    [1.0, 184], [-0.2, 198], [-0.8, 210.2], [-2.4, 212.8], [-6.8, 216.4], [-11.6, 220.8], [-15.2, 224.8]],
  dishL: [[-12.4, 226.4], [-7.6, 225.2], [-2.6, 222.8], [0.4, 219.6], [-0.4, 215.8], [-3.6, 216.8], [-8, 219.8], [-11.4, 223.6]],
  dishR: [[21.4, 226.2], [16.6, 225.6], [11.8, 223.6], [8.8, 220.4], [9.4, 216.6], [12.6, 217.8], [16.8, 220.8], [20.2, 223.6]],
  groove: [[7.2, 221.5], [7.0, 210], [6.7, 196], [6.3, 184], [6.1, 176.4]],
  lumpL: [[-18.6, 206.4], [-10, 207.4], [-1.8, 206.6], [-1.2, 201.4], [-2.6, 198.4], [-10, 197.6], [-18.4, 198.4], [-19.6, 202.6]],
  lumpR: [[11, 206.6], [18.5, 207.4], [26.8, 206.6], [28.2, 202.4], [27.4, 198.4], [19, 197.6], [11.8, 198.4], [10.6, 202]],
  // the hooked lumps (left; the right one is its mirror about x = 4.3): solid, their faces falling steeply toward the bulb,
  // and between them and the stem a deep pocket
  lowL: [[-1.8, 197.6], [-10, 197.8], [-17.6, 197.2], [-19.8, 193.8], [-20.2, 188], [-18.6, 183.6], [-14.4, 181.4], [-9.2, 181.6],
    [-6, 183], [-4.6, 186.4], [-4.2, 190.6], [-2.4, 194]],
  pocketL: [[-12.6, 196.0], [-0.4, 196.4], [-0.2, 184.4], [-3.4, 183.2], [-6.6, 185.2], [-9.8, 187.4], [-12.8, 190.6]],
  bulb: [[0.6, 176.2], [3.2, 177.4], [5.4, 175.8], [7.8, 177.4], [10.4, 176.2], [11.4, 172.4], [10.6, 167.6], [8.2, 163],
    [5.4, 160.2], [2.6, 163], [0.2, 167.6], [-0.6, 172.4]],
  nostril: { [-1]: { c: [-12.4, 167.0], r: 9.0 }, [1]: { c: [17.3, 166.8], r: 8.8 } },
  lip: [[-21.4, 162.6], [-17.6, 160.2], [-10, 158.2], [0, 157.8], [5, 157.8], [12, 158.2], [20.4, 159.4], [26, 161], [28.6, 163],
    [29.4, 158.4], [27.6, 151.6], [24, 145.4], [18, 140.6], [11, 138.2], [4.6, 137.4], [-2, 138], [-9, 140.4], [-15.2, 144.6],
    [-19.2, 150.2], [-21.2, 156.4]],
}

function nose(kit, panel) {
  // crescent upper lip: heavy, sloping from ≈ 8 under the nostrils to ≈ 6.4 at its lower edge (it faces down: dark),
  // standing ≈ 1 mm proud of the gum it hangs over
  const lipTop = 158, lipBot = 137.4
  sculpt(kit, panel, {
    shape: smoothClosed(NOSE.lip, 4), wall: 3.0,
    g: (x, y, d) => (6.4 + 1.6 * smooth((y - lipBot) / (lipTop - lipBot))) * (0.9 + 0.1 * clamp01(d / 5)),
  })
  // bulb
  sculpt(kit, panel, { shape: smoothClosed(NOSE.bulb, 4), wall: 2.6, g: (x, y) => 4.4 + 1.6 * smooth((y - 160) / 15) })
  // nostril scrolls: on a low round pad a fat band rolls up from the bulb over the top, down the OUTER side, under,
  // and curls back into itself — a C-scroll whose deep eye opens at its lower inner side
  for (const sd of [-1, 1]) {
    const N = NOSE.nostril[sd]
    sculpt(kit, panel, { shape: circle(N.c, N.r, 64), wall: 2.4, g: () => 4.8 })
    const S = []
    for (let i = 0; i <= 80; i++) {
      const t = i / 80
      const th = ((40 + 420 * t) * Math.PI) / 180
      const k = smooth((t - 0.55) / 0.45)
      const top = Math.max(0, Math.sin(th)) * (1 - k)
      const r = 5.4 - 3.6 * k
      const hw = 3.2 + 0.7 * top - 1.7 * k
      S.push({ x: N.c[0] - sd * r * Math.cos(th), y: N.c[1] - 0.4 + r * Math.sin(th), hw })
    }
    const f = (ctx) => { for (const q of S) { ctx.beginPath(); ctx.arc(q.x, q.y, q.hw, 0, 2 * Math.PI); ctx.fill() } }
    f.bbox = [N.c[0] - 11, N.c[1] - 11, N.c[0] + 11, N.c[1] + 11]
    sculpt(kit, panel, {
      shape: f, wall: 0,
      g: (x, y) => {
        let best = Infinity, hw = 1
        for (const q of S) { const d = Math.hypot(x - q.x, y - q.y) / q.hw; if (d < best) { best = d; hw = q.hw } }
        return (5.8 + 2.0 * clamp01(hw / 3.9)) * Math.pow(Math.max(0, 1 - best * best), 0.35)
      },
    })
  }
  // stem + crest (one Y), rounded across: the crown sits on the stem's middle line
  const groove = smoothOpen(NOSE.groove, 4)
  sculpt(kit, panel, {
    shape: smoothClosed(NOSE.crest, 3), wall: 1.8,
    g: (x, y, d) => (6.9 + 0.5 * smooth((y - 208) / 8)) * (0.88 + 0.12 * clamp01(d / 3)),
  })
  // flank lumps: the upper squarish ones, and under them the hooked ones — solid, their faces sloping down toward
  // the stem and the bulb, so they stand over deep dark pockets beside the stem
  for (const L of [NOSE.lumpL, NOSE.lumpR]) sculpt(kit, panel, { shape: smoothClosed(L, 4), wall: 3.4, g: (x, y, d) => 7.0 * (0.82 + 0.18 * clamp01(d / 3.6)) })
  for (const sd of [-1, 1]) {
    const L = sd < 0 ? NOSE.lowL : mirrorAbout(NOSE.lowL, 4.3)
    sculpt(kit, panel, {
      shape: smoothClosed(L, 4), wall: 1.6,
      g: (x, y, d) => (0.8 + 5.6 * clamp01((y - 182) / 14.5)) * (0.9 + 0.1 * clamp01(d / 3)),
    })
  }

  // ---- carved: the lobes' dished tops, the pockets between the hooked lumps and the stem, the stem's line and its end pit
  for (const D of [NOSE.dishL, NOSE.dishR]) {
    sculpt(kit, panel, { shape: smoothClosed(D, 4), wall: 2.0, mode: 'carve', g: (x, y) => 2.4 + 1.6 * smooth((y - 217) / 10) })
  }
  for (const D of [NOSE.pocketL, mirrorAbout(NOSE.pocketL, 4.3)]) {
    sculpt(kit, panel, { shape: smoothClosed(D, 4), wall: 2.6, mode: 'carve', g: () => -0.8 })
  }
  sculpt(kit, panel, { shape: strokeShape(groove, 1.5), wall: 0.75, mode: 'carve', g: () => 4.6 })
  sculpt(kit, panel, { shape: circle([6.2, 175.6], 1.3, 20), wall: 1.0, mode: 'carve', g: () => 4.0 })
}

// ---- mouth: a frame round a deep recess — thin, rounded upper frame and sides, a heavy lower lip ≈ 10 mm deep that
// crests (7.4) at its inner edge and rolls down its outer face, the gum (upper teeth block) hanging from the top at ≈ 6,
// and the recess floor (the teeth between the cut's lugs) at 0.8, held level along the cut so its walls run straight.
const MOUTH = {
  out: [[-58.6, 150.4], [-30, 150.8], [4, 151], [40, 150.8], [65.4, 150.6], [66.6, 146], [66.8, 125], [65.8, 108], [63.2, 100],
    [57.4, 95.2], [45, 93.2], [4, 92.4], [-38, 93], [-49.4, 94.6], [-55.6, 99], [-58.2, 106], [-58.8, 125], [-58.8, 146]],
  recess: [[-57, 144.2], [-41.4, 144.2], [-41.2, 136], [-39.6, 130.6], [-36.6, 127.4], [-31, 125.2], [-20, 124.6], [0, 124.3],
    [20, 124.1], [30, 124], [37.4, 124.6], [42.4, 126.4], [45.4, 129], [47.8, 134], [49.6, 140], [50.2, 144.2], [63.8, 144.2],
    [64, 128], [62.8, 118], [59.6, 111.4], [54, 106.4], [46, 103.6], [36, 102.6], [20, 102.2], [0, 101.9], [-20, 102.3],
    [-35, 103.1], [-46, 105.2], [-52.6, 108.8], [-55.8, 114], [-56.8, 121]],
}

function mouth(kit, panel) {
  const out = smoothClosed(MOUTH.out, 3)
  const rec = smoothClosed(MOUTH.recess, 3)
  sculpt(kit, panel, {
    shape: out, aux: [rec], wall: 2.4,
    g: (x, y, a, [dr]) => {
      const lower = smooth((112 - y) / 10)
      const H = 5.8 + 1.6 * lower
      if (dr > 0) return H // inside the recess outline (carved out below): no step at the outline
      const b = -dr
      const t = a / (a + b + 1e-6) // 0 outer edge … 1 recess edge
      // the lower lip is a heavy roll cresting near its inner edge and rolling down its outer face; the upper frame and
      // the sides, thinner, are rounded the same way
      const crest = 0.8
      const roll = t < crest ? Math.sqrt(1 - Math.pow(1 - t / crest, 2)) : 1
      return H * (0.3 + 0.7 * roll)
    },
  })
  // the recess: the teeth's floor at 0.8, cut down behind rounded walls; the gum (upper middle) is raised again below
  sculpt(kit, panel, { shape: rec, wall: 2.4, mode: 'carve', g: () => 0.8 })
  // the gum: the block between the corner pits, hanging from the upper frame down to the teeth
  sculpt(kit, panel, {
    shape: smoothClosed([[-41.4, 150.6], [-41.4, 144], [-41.2, 136], [-39.6, 130.4], [-36.6, 126.8], [-31, 124.4], [-20, 123.8], [0, 123.6],
      [20, 123.4], [30, 123.4], [37.4, 124], [42.4, 126], [45.4, 128.8], [47.8, 134], [49.6, 140], [50.2, 144], [50.2, 150.6]], 3),
    wall: 3.2, g: (x, y, d) => 5.8 + 0.4 * clamp01(d / 6),
  })
}

// ---- the clan sign 亞醜 in a low sunk cartouche either side of the mouth: a soft, low relief-cast figure (as
// detail-inscription.jpg and the three-quarter original show it, as far as they resolve it) — on the mouth side a
// tall body of paired rounded blocks inside a thin outline that rounds under it, a capped round head on top (the masked
// figure of 醜), on the outer side the faint sweep of an arm, all inside a raised 亞-shaped border. Mirrored right of
// the mouth, where the figure also stands on the mouth side. Drawn, not traced: the photographs do not resolve strokes.
const CART = { [-1]: { c: [-87.4, 136], w: 27, h: 39 }, [1]: { c: [92.2, 131.4], w: 26, h: 38 } }

function inscriptions(kit, panel, back) {
  void back
  for (const s of [-1, 1]) {
    const C = CART[s]
    const [cx, cy] = C.c
    const hw = C.w / 2, hh = C.h / 2, k = 3.4
    // 亞 outline: a rectangle with its corners stepped in
    const ya = [[cx - hw + k, cy + hh], [cx + hw - k, cy + hh], [cx + hw - k, cy + hh - k], [cx + hw, cy + hh - k], [cx + hw, cy - hh + k],
      [cx + hw - k, cy - hh + k], [cx + hw - k, cy - hh], [cx - hw + k, cy - hh], [cx - hw + k, cy - hh + k], [cx - hw, cy - hh + k],
      [cx - hw, cy + hh - k], [cx - hw + k, cy + hh - k]]
    sculpt(kit, panel, { shape: [[cx - hw - 1, cy - hh - 1], [cx + hw + 1, cy - hh - 1], [cx + hw + 1, cy + hh + 1], [cx - hw - 1, cy + hh + 1]], wall: 0.5, mode: 'carve', g: () => -0.5 })
    sculpt(kit, panel, { shape: ya, cut: [ya.map(([x, y]) => [cx + (x - cx) * 0.9, cy + (y - cy) * 0.93])], wall: 0.4, g: () => 0.5 })
    // the figure: on the mouth side (−s) a capped round head over a tall body of four pairs of rounded blocks, the body
    // closed by a thin outline that runs down both sides and rounds under it; on the outer side the faint sweep of an arm
    const sx = cx - s * 4.2
    const blob = (x, y, rx, ry, rot = 0) => { const f = (ctx) => { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, 2 * Math.PI); ctx.fill() }; f.bbox = [x - rx - 1, y - ry - 1, x + rx + 1, y + ry + 1]; return f }
    const block = (x, y, w, h) => smoothClosed([[x - w / 2, y - h / 2], [x + w / 2, y - h / 2], [x + w / 2, y + h / 2], [x - w / 2, y + h / 2]], 3)
    const parts = [blob(sx, cy + 14.2, 2.7, 2.4), blob(sx, cy + 17.2, 2.0, 0.9), blob(sx, cy + 10.6, 1.5, 1.3)]
    for (let i = 0; i < 4; i++) {
      const y = cy + 6 - i * 4.5, w = 2.7 + 0.12 * i
      parts.push(block(sx - 1.75, y, w, 3.1), block(sx + 1.75, y, w, 3.1))
    }
    for (const p of parts) sculpt(kit, panel, { shape: p, wall: 0.9, g: () => 0.8 })
    const hull = smoothOpen([[sx - 4.4, cy + 9.4], [sx - 4.6, cy + 1], [sx - 4.2, cy - 8], [sx - 2.6, cy - 12.4], [sx, cy - 13.4],
      [sx + 2.6, cy - 12.4], [sx + 4.2, cy - 8], [sx + 4.6, cy + 1], [sx + 4.4, cy + 9.4]], 6)
    sculpt(kit, panel, { shape: strokeShape(hull, 0.9), wall: 0.45, g: () => 0.6 })
    sculpt(kit, panel, {
      shape: strokeShape(smoothOpen([[sx + s * 3.4, cy + 12.5], [sx + s * 6.6, cy + 8.5], [sx + s * 8.4, cy + 1], [sx + s * 8.6, cy - 8], [sx + s * 7.6, cy - 15]], 6), 1.1),
      wall: 0.55, g: () => 0.4,
    })
  }
}
