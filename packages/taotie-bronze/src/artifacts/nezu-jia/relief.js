// Nezu jia — the décor panels. Every element is TRACED from the photographs developed onto the panel's own
// coordinates (.work/r8-jia/scripts/develop.py: the fitted cameras of photo-21 / photo-22 unroll each register
// at 8 px/mm, x = developed mm from the sector's centre line, y = arc mm above the register's lower edge) and
// read on a 2 mm grid. Data in trace.js; this file renders them with the kit's traced vocabulary
// (roundStroke / roundPlate / roundPoly → carve, pillowBoss, leiwenFill).
//
// The idiom of THIS bronze (photo-21, photo-22) is two-level:
//   * the lower drum: a big mask in HIGH, FAT relief — broad round-shouldered bands ≈ 2.4 mm proud with deep dark
//     pockets between them, comb-ribbed brows, a squared pillow eye with a sunk socket over it, C-hook jaws — on a
//     fine squared leiwen (≈ 0.7 mm pitch) that fills every gap;
//   * the upper wall: the same grammar drawn FLAT — bands ≈ 0.5 mm proud carrying one sunk line, small eyes, a
//     sparse leiwen ground — and above it tall ogive blades outlined by a raised double line.
import { FRIEZE, BAND, BLADE_PLAIN, BLADE_FLANGED, LEGFACE, CAPFLANK, STEMFACE } from './trace.js'

/** stroke / plate / poly data → kit elements, mirrored about x = cx (data x is measured from the centre line) */
function elements(kit, data, cx, { mirror = true, sx = 1, sy = 1, dy = 0 } = {}) {
  const els = []
  const sides = mirror ? [1, -1] : [1]
  for (const side of sides) {
    const X = ([x, y]) => [cx + side * x * sx, y * sy + dy]
    for (const b of data.bands || []) {
      els.push(kit.roundStroke(b.c.map(X), {
        width: Array.isArray(b.w) ? b.w.map((w) => w * sx) : b.w * sx, round: b.round ?? 0.5, inner: b.inner ?? 0.15,
        start: b.start ?? 'blunt', end: b.end ?? 'blunt', capRound: b.capRound ?? 0.35,
        spiral: b.spiral && { ...b.spiral, dir: (b.spiral.dir ?? 1) * side },
        startSpiral: b.startSpiral && { ...b.startSpiral, dir: (b.startSpiral.dir ?? 1) * side },
        contour: b.contour, fill: b.fill, ticks: b.ticks && { ...b.ticks, side: side < 0 && b.ticks.side !== 'both' && b.ticks.side !== 'outer' ? (b.ticks.side === 'left' ? 'right' : 'left') : b.ticks.side },
      }))
    }
    for (const p of data.plates || []) els.push(kit.roundPlate({ c: X(p.c), w: p.w * sx, h: p.h * sy, r: p.r ?? 2, rot: (p.rot ?? 0) * side, contour: p.contour, fill: p.fill }))
    for (const p of data.polys || []) els.push(kit.roundPoly(p.pts.map(X), { round: p.round ?? 1.2, contour: p.contour, fill: p.fill }))
  }
  return els
}

function eyes(kit, panel, data, cx, { mirror = true, sx = 1, sy = 1, dy = 0, base } = {}) {
  for (const side of mirror ? [1, -1] : [1]) {
    for (const e of data.eyes || []) {
      kit.pillowBoss(panel, {
        c: [cx + side * e.c[0] * sx, e.c[1] * sy + dy], w: e.w * sx, h: e.h * sy, round: e.round ?? 0.45, height: e.height ?? 2,
        crown: e.crown ?? 0.7, rot: (e.rot ?? 0) * side, base: base ?? e.base,
        slit: e.slit === false ? false : { len: e.slit?.len ?? e.w * 0.36, width: e.slit?.width ?? 0.9, depth: e.slit?.depth ?? 0.7, rot: (e.slit?.rot ?? 0) * side, offset: [(e.slit?.offset?.[0] ?? 0) * side, e.slit?.offset?.[1] ?? 0] },
        ring: e.ring ?? false,
      })
    }
  }
}

function sinkLines(panel, lines, cx, { mirror = true, depth = 0.3, sx = 1, sy = 1, dy = 0 } = {}) {
  if (!lines?.length) return
  panel.sink((ctx) => {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'
    for (const side of mirror ? [1, -1] : [1]) for (const l of lines) {
      ctx.lineWidth = l.w ?? 0.5
      ctx.beginPath()
      l.c.forEach(([x, y], i) => (i ? ctx.lineTo(cx + side * x * sx, y * sy + dy) : ctx.moveTo(cx + side * x * sx, y * sy + dy)))
      if (l.closed) ctx.closePath()
      ctx.stroke()
    }
  }, { depth, shoulder: 0.2, profile: 'u' })
}

/** One lower-drum sector (120°): the big mask. size = lathe register size (panel W × H in mm). */
export function friezePanel(kit, size, { ppmm, seed }) {
  const p = new kit.ReliefPanel({ width: size.width, height: size.height, ppmm, seed })
  const cx = size.width / 2
  const D = FRIEZE
  const sy = size.height / D.h
  const els = elements(kit, D, cx, { sy })
  kit.carve(p, els, { height: D.height, shoulder: D.shoulder, depth: 0.32, contour: { inset: 1.0, line: 0.45 }, fill: { kind: 'none' }, seed })
  sinkLines(p, D.lines, cx, { sy, depth: 0.45 })
  eyes(kit, p, D, cx, { sy })
  kit.leiwenFill(p, { margin: 0.45 }, { pitch: D.pitch, depth: 0.32, line: 0.5, cell: [3.2, 6.5], pairs: 0.4, maxAspect: 1.8, seed: seed + 3 })
  return p.bake()
}

/** One waist-band sector (60°): a flat mask between two flanges (centred on the plain blade above it). */
export function bandPanel(kit, size, { ppmm, seed }) {
  const p = new kit.ReliefPanel({ width: size.width, height: size.height, ppmm, seed })
  const cx = size.width / 2
  const D = BAND
  const sx = size.width / D.w, sy = size.height / D.h
  const els = elements(kit, D, cx, { sx, sy })
  kit.carve(p, els, { height: D.height, shoulder: 0.25, depth: 0.26, contour: { inset: 0.75, line: 0.4 }, fill: { kind: 'none' }, seed })
  sinkLines(p, D.lines, cx, { sx, sy, depth: 0.3 })
  eyes(kit, p, D, cx, { sx, sy })
  kit.leiwenFill(p, { margin: 0.4 }, { pitch: D.pitch, depth: 0.28, line: 0.5, cell: [3, 6], pairs: 0.5, seed: seed + 3 })
  return p.bake()
}

/** One blade sector (30°): flanged = the flange runs up its axis; plain = a small mask in the blade. */
export function bladePanel(kit, size, { ppmm, seed, flanged }) {
  const p = new kit.ReliefPanel({ width: size.width, height: size.height, ppmm, seed })
  const cx = size.width / 2
  const D = flanged ? BLADE_FLANGED : BLADE_PLAIN
  const sx = size.width / D.w, sy = size.height / D.h
  // the ogive outline: a raised double line (two thin bands), apex near the lip
  const ogive = (inset) => {
    const pts = []
    const hw = (D.base / 2 - inset), top = D.apex - inset * 1.2, y0 = 0
    const n = 24
    for (let i = 0; i <= n; i++) {
      const t = i / n // 0 → the base, 1 → apex
      const yy = y0 + (top - y0) * t
      const x = hw * Math.pow(1 - Math.pow(t, D.ogive), 0.85)
      pts.push([x, yy])
    }
    return pts
  }
  const outline = []
  for (const [k, inset] of D.outlines.entries()) {
    const half = ogive(inset)
    const ctrl = [...half.map(([x, y]) => [-x, y]), ...half.slice(0, -1).reverse().map(([x, y]) => [x, y])]
    outline.push(kit.roundStroke(ctrl.map(([x, y]) => [cx + x * sx, y * sy]), { width: D.outlineW[k], round: 0.5, inner: 0.5, start: 'flat', end: 'flat' }))
  }
  kit.carve(p, outline, { height: D.lineHeight, shoulder: 0.2, contour: false, fill: { kind: 'none' }, seed })
  const els = elements(kit, D, cx, { sx, sy })
  if (els.length) kit.carve(p, els, { height: D.height, shoulder: 0.25, depth: 0.26, contour: { inset: 0.6, line: 0.38 }, fill: { kind: 'none' }, seed: seed + 1 })
  sinkLines(p, D.lines, cx, { sx, sy, depth: 0.3 })
  eyes(kit, p, D, cx, { sx, sy })
  if (D.leiwen) {
    // leiwen only inside the blade, below the eyes
    const inside = (ctx) => {
      const half = ogive(D.outlines[D.outlines.length - 1] + 1.2)
      ctx.beginPath()
      half.forEach(([x, y], i) => (i ? ctx.lineTo(cx - x * sx, y * sy) : ctx.moveTo(cx - x * sx, y * sy)))
      half.slice().reverse().forEach(([x, y]) => ctx.lineTo(cx + x * sx, y * sy))
      ctx.closePath(); ctx.fill()
    }
    kit.leiwenFill(p, { include: inside, margin: 0.4, rect: { x: 0, y: 0, w: size.width, h: D.leiwen * sy } }, { pitch: D.pitch, depth: 0.25, line: 0.5, cell: [2.8, 5.5], pairs: 0.5, seed: seed + 3 })
  }
  return p.bake()
}

/** A leg face panel (TRUE mm: x across the face, apex edge at x = W for the L face; mirrored for R). */
export function legFacePanel(kit, { w, h }, { ppmm, seed, side = 'L' }) {
  const p = new kit.ReliefPanel({ width: w, height: h, ppmm, seed })
  const D = LEGFACE
  // a column of small units near the apex edge
  const els = []
  const X = (x) => (side === 'L' ? w - x : x) // data x = distance from the apex edge
  for (const u of D.units) {
    const y = u.y
    for (const b of D.unit.bands) {
      els.push(kit.roundStroke(b.c.map(([x, yy]) => [X(x * u.s), y + yy * u.s]), { width: b.w * u.s, round: 0.5, inner: 0.15, start: b.start ?? 'blunt', end: b.end ?? 'blunt', spiral: b.spiral && { ...b.spiral, dir: (b.spiral.dir ?? 1) * (side === 'L' ? -1 : 1) } }))
    }
  }
  kit.carve(p, els, { height: D.height, shoulder: 0.2, depth: 0.25, contour: { inset: 0.55, line: 0.32 }, fill: { kind: 'none' }, seed })
  for (const u of D.units) {
    for (const e of D.unit.eyes) kit.pillowBoss(p, { c: [X(e.c[0] * u.s), u.y + e.c[1] * u.s], w: e.w * u.s, h: e.h * u.s, round: 0.6, height: 0.9, crown: 0.8, slit: false })
  }
  // a frame line down the face beside the units
  p.sink((ctx) => {
    ctx.lineWidth = 0.5
    ctx.beginPath(); ctx.moveTo(X(D.frame), D.units[D.units.length - 1].y - 6); ctx.lineTo(X(D.frame), h - 2); ctx.stroke()
  }, { depth: 0.3, shoulder: 0.15, profile: 'u' })
  kit.leiwenFill(p, { margin: 0.35, rect: { x: side === 'L' ? w - D.frame + 0.4 : 0.4, y: D.units[D.units.length - 1].y - 6, w: D.frame - 0.8, h: h - 2 - (D.units[D.units.length - 1].y - 6) } }, { pitch: D.pitch, depth: 0.22, line: 0.5, cell: [2.4, 4.5], pairs: 0.4, seed: seed + 2 })
  return p.bake()
}

/** One cap flank sector (90° of the bell): a small mask with fat bands on a dark sunk ground. */
export function capFlankPanel(kit, size, { ppmm, seed }) {
  const p = new kit.ReliefPanel({ width: size.w, height: size.h, ppmm, seed })
  const cx = size.w / 2
  const D = CAPFLANK
  const sx = size.w / D.w, sy = size.h / D.h
  kit.carve(p, elements(kit, D, cx, { sx, sy }), { height: D.height, shoulder: 0.3, depth: 0.25, contour: { inset: 0.6, line: 0.35 }, fill: { kind: 'none' }, seed })
  eyes(kit, p, D, cx, { sx, sy })
  kit.leiwenFill(p, { margin: 0.4 }, { pitch: D.pitch, depth: 0.25, line: 0.5, cell: [2.6, 5], pairs: 0.5, seed: seed + 2 })
  return p.bake()
}

/** One stem face: a vertical kui pair / small mask. */
export function stemPanel(kit, size, { ppmm, seed }) {
  const p = new kit.ReliefPanel({ width: size.w, height: size.h, ppmm, seed })
  const cx = size.w / 2
  const D = STEMFACE
  const sx = size.w / D.w, sy = size.h / D.h
  kit.carve(p, elements(kit, D, cx, { sx, sy }), { height: D.height, shoulder: 0.25, depth: 0.25, contour: { inset: 0.55, line: 0.32 }, fill: { kind: 'none' }, seed })
  eyes(kit, p, D, cx, { sx, sy })
  kit.leiwenFill(p, { margin: 0.4 }, { pitch: D.pitch, depth: 0.22, line: 0.5, cell: [2.4, 4.5], pairs: 0.5, seed: seed + 2 })
  return p.bake()
}
