// Nezu you 饕餮文卣 (90086) — the BELLY MASK, redrawn for the slimmed belly (365 × 119 mm developed).
//
// Read off photo-31 developed onto THIS form's belly register (.work/ridge-nezu-you/develop.py: x = developed mm from the
// face's centre line, y = arc mm above the register's lower edge, 8 px/mm), both halves averaged after a 5.3 mm
// centring shift (the fitted camera puts the left half ≈ 10 mm further out than the right), and checked against
// photo-32 (three-quarter.jpg, the right half and the outer field seen from the front right).
//
// LANGUAGE (photo-31 enlarged, photo-32): this mask is drawn in BROAD HIGH PLATES, not thread bundles — round-shouldered
// masses ≈ 3 mm proud with two incised lines running parallel inside every edge (the "banded" plates), a deep dark slot
// in the horn, a flat-domed eye disc with a deep pupil in a sunk socket ring, the lower body band's top packed with
// spirals, and every gap between them a ground of raised square spirals (≈ 1.2 mm pitch: the scale rests on it).
// So: kit.tracedPlates on outlines built from kit.roundStroke / roundPoly (one creature = one continuous band or mass),
// kit.pillowBoss for the eye, kit.ridgeGround (fat round threads) for the ground.
//
// Elements (RIGHT half, mirrored; mm in the developed frame):
//   horn   one G mass — the inner block hooks down from the top bar, the bar runs out, down the outer column, back
//          along the bottom and up into the coiled island; the deep slot parts the bar from the island; a ground
//          notch between the block and the island. Island: three concentric incised rings; block: a hooked line.
//   brow   the long banded band under the horns, from the centre to the end flange
//   eye    Ø 38 disc boss, pupil pit Ø 9.4, sunk socket ring
//   cheek  three nested lancet bands sweeping down beside the centre (the face's banded cheek)
//   jaw    two banded bands under the eye, the inner one hooked up at its outer end
//   post   the upright plate between the eye and the outer C-block
//   C-block the outer G-block beside the eye: a rounded block with a deep pocket and a coiled curl
//   body   the lower body band running out to the end flange, its left end rolled into a curl, spirals on its top
//   kui    the upright side kui under the end flange (photo-32): squared head with a round eye and a hooked snout,
//          a fat body down the field ending in a rolled tail, two quills, a hooked lower jaw
// The outer field (x > 100) is laid in a frame whose edge is the end flange at the register's widest row and is
// squeezed per row onto the register's own half-width (the belly narrows to 142 mm at the bottom, 155 at the top):
// control points are mapped, then the bands are built, so band widths stay constant.

const EDGE0 = 178 // design frame: the outer field's edge (end flange, less its half thickness) at the widest row

/** the belly's design, right half. hw(y): the register's developed half-width at arc height y. */
export function bellyDesign(kit, hw) {
  const out = (x, y) => {
    if (x <= 100) return [x, y]
    const e = Math.max(110, hw(y) - 4.6)
    return [100 + ((x - 100) * (e - 100)) / (EDGE0 - 100), y]
  }
  const M = (pts) => pts.map(([x, y]) => out(x, y))
  const S = (pts, o) => kit.roundStroke(M(pts), { round: 0.55, inner: 0.2, ...o })
  const P = (pts, round) => kit.roundPoly(M(pts), { round })

  // ---------------------------------------------------------------- the horn: one G mass, the slot a hole in it
  const horn = [
    {
      outer: P([[31.5, 71.5], [60.5, 69.5], [61, 92.5], [72, 93.5], [72, 75.5], [99.5, 75.5], [99.5, 110.5], [42, 110.5], [31.5, 100]],
        [7, 3, 1.5, 1.5, 4, 6, 6, 7, 6]),
      holes: [S([[52.5, 93.2], [58, 96.3], [64, 98.6], [71, 99.9], [86.5, 100.2], [89.6, 97.4], [89.8, 86]], { width: 3.4, start: 'round', end: 'round', round: 0.9, inner: 0.9 })],
    },
  ]
  // ---------------------------------------------------------------- the face bands
  const bands = [
    // brow: banded band from the centre to the end flange
    { outer: S([[3.5, 51], [11, 58.5], [28, 64.6], [55, 67.2], [85, 67.6], [140, 70.2], [EDGE0 + 3, 71.4]], { width: [4.4, 5.6, 6.2, 6.4, 6.4, 6.2, 6], start: 'point', end: 'flat', round: 0.9, inner: 0.9 }) },
    // cheek lancets, nested, sweeping down beside the centre
    { outer: S([[34, 58.6], [26, 54], [21, 45], [19.6, 31], [21, 17.5]], { width: [3.8, 4.8, 5.2, 5.2, 4.6], start: 'round', end: 'round', round: 0.9, inner: 0.9 }) },
    { outer: S([[25.5, 58.8], [17.5, 53], [13.4, 43], [12.6, 28], [14, 9]], { width: [3.8, 4.8, 5.2, 5.2, 4.6], start: 'round', end: 'round', round: 0.9, inner: 0.9 }) },
    { outer: S([[16, 57.2], [10, 51.5], [6.6, 41], [6, 26], [6.6, 4]], { width: [3.6, 4.4, 4.8, 4.8, 4.4], start: 'round', end: 'round', round: 0.9, inner: 0.9 }) },
    // jaw: under the eye, the inner band hooked up beside it
    { outer: S([[25, 22.6], [36, 21.2], [54, 15.4], [70, 15.6], [79.5, 21]], { width: [4.2, 5, 5.4, 5.4, 4.6], start: 'round', end: 'spiral', spiral: { turns: 0.8, dir: 1, R: 3.2 }, round: 0.9, inner: 0.9 }) },
    { outer: S([[21.5, 13.4], [38, 11.6], [58, 8.4], [76, 8.8]], { width: [4, 5, 5, 4.4], start: 'round', end: 'round', round: 0.9, inner: 0.9 }) },
    { outer: S([[24, 3.2], [48, 2.6], [72, 2.4]], { width: [3.2, 3.8, 3.4], start: 'round', end: 'round' }) },
    // post between the eye and the C-block
    { outer: P([[77.5, 30.5], [88, 32.5], [88, 62.4], [78.5, 63.4]], [2.5, 3, 3, 2.5]) },
  ]
  // the outer C-block: a rounded block with a deep pocket and a coiled curl
  const cblock = [{
    outer: P([[90.5, 36.5], [122, 36.5], [122, 62.6], [90.5, 62.6]], [4, 5, 5, 4]),
    holes: [S([[118.5, 57.2], [101, 57.2], [99, 54.5]], { width: 5, start: 'round', end: 'round', round: 0.9, inner: 0.9 })],
  }]
  // the lower body band: rolled curl at its inner end, spirals on its top, out to the end flange
  const body = [
    { outer: S([[98, 25.6], [92.5, 28.8], [84.5, 26], [83, 19], [88, 15.2], [93, 17.6]], { width: [5, 5, 5, 5, 4.6, 4], start: 'flat', end: 'round', round: 1, inner: 0.9 }) },
    { outer: P([[96.5, 13.6], [EDGE0 + 2, 15.4], [EDGE0 + 2, 33.2], [96.5, 31.2]], [3, 2, 2, 5]) },
  ]
  // the upright side kui under the end flange (photo-32)
  const kui = [
    { outer: P([[136, 91], [171, 91], [171, 114], [136, 114]], [4, 5, 5, 4]) }, // squared head
    { outer: S([[137, 107], [128.5, 107], [127.5, 94]], { width: 5.4, start: 'flat', end: 'spiral', spiral: { turns: 0.85, dir: 1, R: 3 } }) }, // snout
    { outer: S([[136, 86.5], [129, 82], [129.5, 74.5]], { width: 4.6, start: 'flat', end: 'spiral', spiral: { turns: 0.8, dir: 1, R: 2.8 } }) }, // lower jaw
    { outer: S([[152, 89], [146.5, 70], [141, 52], [139.5, 38], [144, 24], [158, 21.5]], { width: [8.4, 8.6, 8.4, 8, 7.4, 6], start: 'flat', end: 'spiral', spiral: { turns: 1, dir: 1, R: 4.4, taper: 0.75 } }) }, // body → tail
    { outer: S([[151, 65], [165, 64.5], [172, 72]], { width: 4.6, start: 'flat', end: 'spiral', spiral: { turns: 0.8, dir: 1, R: 2.8 } }) }, // quill
    { outer: S([[146, 44], [163, 42.5], [171, 50]], { width: 4.6, start: 'flat', end: 'spiral', spiral: { turns: 0.8, dir: 1, R: 2.8 } }) }, // quill
  ]
  // sunk lines on the plate tops: the island's rings, the block's hook, the C-block's curl
  const rr = (cx, cy, w, h, r) => { // a closed rounded rectangle, as a polyline
    const o = []
    for (const [qx, qy, a0] of [[1, -1, -90], [1, 1, 0], [-1, 1, 90], [-1, -1, 180]]) {
      for (let k = 0; k <= 6; k++) { const a = ((a0 + 15 * k) * Math.PI) / 180; o.push([cx + qx * (w / 2 - r) + r * Math.cos(a), cy + qy * (h / 2 - r) + r * Math.sin(a)]) }
    }
    o.push(o[0])
    return o
  }
  const lines = [
    { c: rr(84, 88.4, 12.6, 13.6, 3.6), w: 0.8 },
    { c: rr(84, 88.4, 7.4, 8, 2), w: 0.8 },
    { c: [[82.4, 88.4], [85.6, 88.4]], w: 0.6 },
    { c: [[46, 99], [45.2, 82], [48, 78.6], [53.6, 78.6], [56, 81.6], [54.4, 85], [50.4, 84.6]], w: 1.3, deep: true }, // the hook dividing the block
    { c: [[97, 41], [96.5, 49.5], [101, 51.4], [104, 48], [101, 45.6]], w: 1.1, deep: true },
  ].map((l) => ({ ...l, c: M(l.c) }))
  const eye = { c: [55, 39.6], d: 39, pupil: { c: [56.2, 43.2], r: 4.7 }, socket: 20.6 }
  const kuiEye = { c: out(160.5, 103), d: 9 }
  return { horn, bands, cblock, body, kui, lines, eye, kuiEye }
}

const outlineOf = (kit, el) => kit.elementContour(el, 0)

/** draw the belly into a panel (mm, y up, centre line at W/2) */
export function drawBelly(kit, panel, size, { seed = 0 } = {}) {
  const W = panel.width, H = panel.height, cx = W / 2
  const hw = (y) => (size.widthAt ? size.widthAt(Math.max(0, Math.min(H, y))) / 2 : W / 2)
  const D = bellyDesign(kit, hw)
  const sides = [1, -1]
  const toPanel = (side) => ([x, y]) => [cx + side * x, y]
  const platesOf = (list) => {
    const out = []
    for (const side of sides) {
      const T = toPanel(side)
      for (const p of list) out.push({ outer: outlineOf(kit, p.outer).map(T), holes: (p.holes || []).map((h) => outlineOf(kit, h).map(T)) })
    }
    return out
  }
  // register top edge: a low rounded border band, and the sector edges stay plain under the flanges
  panel.raise((ctx) => ctx.fillRect(0, H - 2.3, W, 1.6), { height: 1.1, shoulder: 0.7, profile: 'plateau' })
  // 1) the masses: banded plates (two incised lines inside every edge), proud with round shoulders
  const banded = { contour: { inset: 1.35, line: 0.95 }, contour2: { inset: 3.05, line: 0.85 }, depth: 0.62 }
  kit.tracedPlates(panel, platesOf(D.horn), { union: true, height: 3.0, shoulder: 1.5, pillow: 0.6, pillowWidth: 4.5, ...banded, seed })
  kit.tracedPlates(panel, platesOf([...D.bands, ...D.cblock, ...D.kui, D.body[0]]), { union: true, height: 2.6, shoulder: 1.35, pillow: 0.45, pillowWidth: 3.5, ...banded, seed: seed + 1 })
  kit.tracedPlates(panel, platesOf([D.body[1]]), { height: 2.6, shoulder: 1.0, contour: { inset: 1.2, line: 0.6 }, contour2: false, depth: 0.42,
    fill: { kind: 'leiwen', inset: 2.3, pitch: 1.1, line: 0.5, cell: [4, 7.5], roundness: 0.35, pairs: 0.3, maxAspect: 1.6 }, seed: seed + 2 })
  // 2) the deep slot and pocket: sunk well below the ground; the incised lines on the tops
  const holes = []
  for (const side of sides) for (const p of [...D.horn, ...D.cblock]) for (const h of p.holes || []) holes.push(outlineOf(kit, h).map(toPanel(side)))
  panel.sink((ctx) => { ctx.beginPath(); for (const L of holes) { L.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath() } ctx.fill() }, { depth: 2.0, shoulder: 0.6, profile: 'u' })
  for (const deep of [false, true]) panel.sink((ctx) => {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'
    for (const side of sides) for (const l of D.lines.filter((l) => !!l.deep === deep)) {
      ctx.lineWidth = l.w
      ctx.beginPath()
      l.c.forEach(([x, y], i) => (i ? ctx.lineTo(cx + side * x, y) : ctx.moveTo(cx + side * x, y)))
      ctx.stroke()
    }
  }, deep ? { depth: 1.2, shoulder: 0.45, profile: 'u' } : { depth: 0.45, shoulder: 0.22, profile: 'u' })
  // 3) the eyes: a broad flat-domed disc in a sunk socket ring, the pupil a deep pit
  for (const side of sides) {
    const e = D.eye, c = [cx + side * e.c[0], e.c[1]]
    panel.sink((ctx) => { ctx.beginPath(); ctx.arc(c[0], c[1], e.socket + 0.45, 0, Math.PI * 2); ctx.arc(c[0], c[1], e.socket - 0.45, 0, Math.PI * 2, true); ctx.fill() }, { depth: 0.6, shoulder: 0.3, profile: 'u' })
    kit.pillowBoss(panel, { c, w: e.d, h: e.d, round: 1, height: 4.2, crown: 0.42, slit: false, ring: false })
    const pc = [cx + side * e.pupil.c[0], e.pupil.c[1]]
    panel.sink((ctx) => { ctx.beginPath(); ctx.arc(pc[0], pc[1], e.pupil.r, 0, Math.PI * 2); ctx.fill() }, { depth: 3.0, shoulder: e.pupil.r * 0.45, profile: 'u' })
    const k = D.kuiEye, kc = [cx + side * k.c[0], k.c[1]]
    kit.pillowBoss(panel, { c: kc, w: k.d, h: k.d, round: 1, height: 1.6, crown: 0.75, slit: false, ring: false, base: 'field' })
  }
  // 4) the ground: raised square spirals of one fat round thread, packed into everything left
  const inside = (ctx) => {
    ctx.beginPath()
    for (let y = 0; y <= H; y += 2) ctx.lineTo(cx + hw(y) - 3.4, y)
    for (let y = H; y >= 0; y -= 2) ctx.lineTo(cx - hw(y) + 3.4, y)
    ctx.closePath(); ctx.fill()
  }
  kit.ridgeGround(panel, { rect: { x: 0, y: 0.4, w: W, h: H - 2.9 }, include: inside, avoid: 'raised' }, {
    pitch: 1.2, width: 0.78, height: 0.62, seed: seed + 3, leiwen: { cell: [4.2, 8.4], pairs: 0.25, maxAspect: 1.7 },
  })
  return D
}
