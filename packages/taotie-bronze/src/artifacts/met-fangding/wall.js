// Met fangding 49.135.2 — the décor of one wall, TRACED from the flattened photographs.
//
// trace-data.js is written by reference/met-fangding/trace.py from reference/met-fangding/faces/*.jpg:
// the pale plateaus and the incised lines on them are thresholded out of the photograph and stored as
// polygons in face mm. Nothing here is composed from memory of the style; this file only decides the
// relief: heights, shoulders, the eye bosses and frieze heads (measured on the same flattened faces),
// the leiwen ground (kit leiwen at the measured 1.0 mm pitch) and the T / I marks on the corner margins.

import TRACE from './trace-data.js'

// relief (mm). The décor field is a recessed panel: the plain margins stand at the plateau level.
export const RELIEF = { plateau: 1.15, eye: 1.15, head: 0.6, joint: 0.45, line: 0.3, leiwen: 0.32 }

// measured on faces/face-long.jpg and faces/face-short.jpg (face mm: x from the centre line, y vessel mm)
const BOSSES = {
  long: {
    eyes: [[-31.6, 126.1, 5.6, 4.3], [28.0, 125.9, 6.0, 4.3]],
    heads: [[-46.0, 169.4, 3.3, 3.1], [-37.2, 169.4, 3.3, 3.1], [35.0, 169.4, 3.3, 3.1], [43.6, 169.2, 3.3, 3.1]],
    joints: [[-50.5, 163.0, 2.1, 2.1], [-34.2, 161.6, 2.0, 2.0], [29.5, 163.0, 2.1, 2.1], [46.8, 161.6, 2.0, 2.0]],
  },
  short: {
    eyes: [[-28.7, 126.6, 5.1, 4.1], [29.2, 126.1, 5.3, 4.1]],
    heads: [[-25.8, 169.3, 3.3, 3.1], [22.5, 169.3, 3.3, 3.1]],
    joints: [[-27.5, 162.7, 2.0, 2.0], [28.3, 162.7, 2.0, 2.0]],
  },
}
// the décor fields (face mm), shared by both kinds of wall apart from their half-width
const FIELD = { mask: [103.1, 148.9], frieze: [152.9, 172.8] }

/** delta-coded int loops (0.05 mm) → [[x, y], …] */
function decode(loops) {
  return loops.map((f) => {
    const pts = [[f[0] / 20, f[1] / 20]]
    for (let i = 2; i < f.length; i += 2) {
      const [x, y] = pts[pts.length - 1]
      pts.push([x + f[i] / 20, y + f[i + 1] / 20])
    }
    return pts
  })
}

/**
 * One wall panel. cell = the fangBody cell (w × h, panel x 0 at the left corner, y 0 at the body
 * underside); kind 'long' | 'short'; y0 = vessel y of the panel bottom (the leg height).
 */
export function wallPanel(kit, cell, { kind, y0, ppmm, seed, q = 1 }) {
  const W = cell.w, H = cell.h
  const p = new kit.ReliefPanel({ width: W, height: H, ppmm, seed })
  const cx = W / 2
  const P = ([x, y]) => [x + cx, y - y0]
  const T = kind === 'long' ? { main: TRACE.longMain, frieze: TRACE.longFrieze, hw: [74.5, 75.0] } : { main: TRACE.shortMain, frieze: TRACE.shortFrieze, hw: [58.0, 58.8] }
  const fields = [
    { x: cx - T.hw[0], y: FIELD.mask[0] - y0, w: 2 * T.hw[0], h: FIELD.mask[1] - FIELD.mask[0] },
    { x: cx - T.hw[1], y: FIELD.frieze[0] - y0, w: 2 * T.hw[1], h: FIELD.frieze[1] - FIELD.frieze[0] },
  ]
  const path = (ctx, loops) => {
    ctx.beginPath()
    for (const l of loops) {
      l.forEach((pt, i) => {
        const [x, y] = P(pt)
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)
      })
      ctx.closePath()
    }
  }
  const plateau = [...decode(T.main.plateau), ...decode(T.frieze.plateau)]
  const lines = [...decode(T.main.lines), ...decode(T.frieze.lines)]

  // 1. plain wall (margins, fillet between the registers, the strip under the centre flange) at plateau level:
  //    the décor fields read as sunk panels, as on the bronze
  p.raise((ctx) => {
    ctx.beginPath()
    ctx.rect(0, 0, W, H)
    for (const f of fields) ctx.rect(f.x, f.y, f.w, f.h)
    ctx.fill('evenodd')
    ctx.fillRect(cx - 3.2, fields[0].y, 6.4, fields[1].y + fields[1].h - fields[0].y)
  }, { height: RELIEF.plateau, shoulder: 0.35, profile: 'plateau' })
  // 2. the traced bands: fat, rounded, pillow-section (a 0.8 mm round shoulder, no knife edge)
  p.raise((ctx) => {
    path(ctx, plateau)
    ctx.fill('evenodd')
  }, { height: RELIEF.plateau, shoulder: 1.3, profile: 'dome' })
  // 3. bosses: the eyes stand proud of the plateau, pillow-shaped (flat crown, round edge);
  //    the frieze dragons' frontal heads and body joints are domed higher than their bodies
  const B = BOSSES[kind]
  const ell = (list) => (ctx) => {
    for (const [x, y, rx, ry] of list) {
      const [px, py] = P([x, y])
      ctx.beginPath()
      ctx.ellipse(px, py, rx, ry, 0, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  p.raise(ell(B.eyes), { height: RELIEF.plateau + RELIEF.eye, shoulder: 2.6, profile: 'dome' })
  p.raise(ell(B.heads), { height: RELIEF.plateau + RELIEF.head, shoulder: 2.2, profile: 'dome' })
  p.raise(ell(B.joints), { height: RELIEF.plateau + RELIEF.joint, shoulder: 1.6, profile: 'dome' })
  // 4. the incised lines on the plateaus (and the slit pupils), as traced
  p.sink((ctx) => {
    path(ctx, lines)
    ctx.fill('evenodd')
  }, { depth: RELIEF.line, shoulder: 0.15, profile: 'u' })
  // 5. T and I marks incised on the plain corner margins (face-long / face-short: alternating, ≈ 11 mm apart)
  const mx = kind === 'long' ? 77.9 : 61.6
  p.sink((ctx) => {
    ctx.lineWidth = 0.75
    ctx.lineCap = 'round'
    for (const s of [-1, 1]) {
      const marks = [[170.5, 'T'], [158.5, 'I'], [146, 'T'], [134, 'I'], [121.5, 'T'], [109.5, 'T']]
      for (const [y, m] of marks) {
        const [px, py] = P([s * mx, y])
        ctx.beginPath()
        ctx.moveTo(px - 2.4, py)
        ctx.lineTo(px + 2.4, py)
        if (m === 'T') {
          ctx.moveTo(px + s * 1.6, py)
          ctx.lineTo(px + s * 1.6, py - 6.5)
        }
        ctx.stroke()
      }
    }
  }, { depth: 0.35, profile: 'u' })
  // 6. the ground: fine squared leiwen at the measured 1.0 mm pitch, packed into what is left of each field
  for (const f of fields) {
    p.fillGround({ pitch: 0.8, line: 0.5, cell: [3.2, 5.2], turns: 3, roundness: 0.04, jitter: 0.04, depth: RELIEF.leiwen, maxAspect: 1.5, follow: 1, fillers: true, pairs: 0.4, seed: seed + 7 }, { rect: f, avoid: 'raised', margin: 0.4 })
  }
  // the field border line: a thin groove where the sunk field meets the margin
  p.sink((ctx) => {
    ctx.lineWidth = 0.4
    for (const f of fields) ctx.strokeRect(f.x + 0.25, f.y + 0.25, f.w - 0.5, f.h - 0.5)
  }, { depth: 0.15, profile: 'u' })
  return p.bake()
}
