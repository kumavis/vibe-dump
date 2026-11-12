// Paints the cut face of the eye and optic nerve as a flat scientific
// section. The same routine paints four nested plates, from the whole globe
// down to a 0.3 mm window, adding finer structure as the scale allows — so
// the picture stays sharp through a 100x zoom.
import {
  D2R, RE, WALL_C, R_SCL_IN, R_CHOR_IN, R_RET_IN, DISC_R, LAM_T, R_SAS, R_DURA, NERVE_END,
  LANES, PORE, laneY, lamFront, nerveR, discSurface, bundle, THETA, wallX,
} from './anat.js'
import { rng } from './util.js'

export const C = {
  sclera: '#e7e1d3', scleraLine: '#cfc7b6', choroid: '#8a3a2e', lumen: '#c9503f', rpe: '#3b2419',
  rod: '#e9bfa6', nuc: '#b58fb0', plex: '#f1d6c6', rnfl: '#f3e2a4',
  glia: '#efd2ba', lamina: '#dfe3ea', beam: '#8794ab', beamDark: '#66738c',
  myelin: '#f5ecc9', septum: '#9aa5ba', pia: '#63728d', csf: '#cfe5f3', arach: '#9fbcd4', dura: '#b8b0a2', duraLine: '#9c9486',
  cupBack: '#a9532a', bundle: '#eedc98', bundleEdge: '#cdb96e', axon: '#b79f52', cornea: '#bfdfe8', astro: '#7d5a9a', endo: '#a8322c',
}

const arc = (g, cx, r, a0, a1, n = 96) => { for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; g.lineTo(cx + r * Math.cos(a), r * Math.sin(a)) } }
function ring(g, cxOut, rOut, cxIn, rIn, a0, a1) {
  g.beginPath(); arc(g, cxOut, rOut, a0, a1); arc(g, cxIn, rIn, a1, a0); g.closePath()
}

/**
 * @param g      2-D context
 * @param px     canvas size in pixels
 * @param b      {x, y, w} — the square region painted, in mm (x,y = lower-left corner)
 * @param hole   optional {x, y, w} region left empty for the next, finer plate
 */
export function paintSection(g, px, b, hole) {
  const k = px / b.w // pixels per mm
  g.setTransform(k, 0, 0, -k, -b.x * k, (b.y + b.w) * k)
  const hair = 1.3 / k
  const fine = k > 100, micro = k > 1100, ultra = k > 4000
  const rand = rng(7)
  const limb = Math.PI - Math.acos(Math.cos(29.4 * D2R) / Math.cos(THETA)) // where the cornea starts, in this plane
  const edge = r => Math.asin((DISC_R + 0.02) / r)

  // ---- wall of the eye
  for (const s of [1, -1]) {
    g.save(); g.scale(1, s)
    g.fillStyle = C.sclera; ring(g, -RE, RE, WALL_C, R_SCL_IN, 0, limb); g.fill()
    if (k > 40) {
      g.strokeStyle = C.scleraLine; g.lineWidth = Math.max(hair, 0.02)
      for (let j = 1; j < 5; j++) { g.beginPath(); arc(g, -RE - 0.05 * j, RE - 0.2 * j + 0.05 * j, 0.01, limb * 0.98); g.stroke() }
    }
    g.fillStyle = C.choroid; ring(g, WALL_C, R_SCL_IN, WALL_C, R_CHOR_IN, edge(R_SCL_IN), 2.55); g.fill()
    if (k > 40) {
      g.fillStyle = C.lumen
      for (let a = edge(R_SCL_IN) + 0.012; a < 2.5; a += 0.03) {
        const r = R_CHOR_IN + 0.09 + 0.08 * rand()
        g.beginPath(); g.ellipse(WALL_C + r * Math.cos(a), r * Math.sin(a), 0.07, 0.035 + 0.02 * rand(), a + Math.PI / 2, 0, 7); g.fill()
      }
    }
    // retina: from the outside in — photoreceptors, two nuclear layers, ganglion cells, nerve-fibre layer
    const layers = k > 40
      ? [[R_CHOR_IN, C.rod], [10.93, C.nuc], [10.89, C.plex], [10.87, C.nuc], [10.84, C.plex], [10.8, C.nuc], [10.785, C.rnfl]]
      : [[R_CHOR_IN, C.rod]]
    layers.forEach(([rOut, col], j) => {
      const rIn = j + 1 < layers.length ? layers[j + 1][0] : R_RET_IN
      g.fillStyle = col; ring(g, WALL_C, rOut, WALL_C, rIn, edge(rOut), 2.35); g.fill()
    })
    g.strokeStyle = C.rpe; g.lineWidth = Math.max(hair, 0.014)
    g.beginPath(); arc(g, WALL_C, R_CHOR_IN, edge(R_CHOR_IN), 2.45); g.stroke()
    g.restore()
  }
  // cornea, where this plane meets it
  {
    const dc = 5.35, dz = dc * Math.sin(THETA), cx = -RE - dc * Math.cos(THETA)
    const ro = Math.sqrt(7.8 ** 2 - dz ** 2), ri = Math.sqrt(7.25 ** 2 - dz ** 2)
    const lx = -RE + RE * Math.cos(limb), ly = RE * Math.sin(limb)
    const a = Math.atan2(ly, lx - cx)
    g.fillStyle = C.cornea; g.beginPath(); arc(g, cx, ro, a, 2 * Math.PI - a, 48); arc(g, cx, ri, 2 * Math.PI - a + 0.04, a - 0.04, 48); g.closePath(); g.fill()
  }

  // ---- the nerve and its sheaths
  const xs = []; for (let x = -0.62; x <= NERVE_END; x += 0.04) xs.push(x)
  for (const s of [1, -1]) {
    g.save(); g.scale(1, s)
    // dura: continuous with the sclera
    g.fillStyle = C.dura; g.fillRect(-0.3, R_SAS, NERVE_END + 0.3, R_DURA - R_SAS)
    if (fine) { g.strokeStyle = C.duraLine; g.lineWidth = Math.max(hair, 0.012); for (let j = 1; j < 4; j++) { g.beginPath(); g.moveTo(-0.2, R_SAS + j * 0.1); g.lineTo(NERVE_END, R_SAS + j * 0.1); g.stroke() } }
    // subarachnoid space ends blind just behind the eye
    g.fillStyle = C.csf; g.beginPath(); g.moveTo(NERVE_END, R_SAS)
    g.lineTo(0.05, R_SAS); g.quadraticCurveTo(-0.22, R_SAS - 0.05, -0.2, 1.62)
    for (const x of xs) if (x > -0.2) g.lineTo(x, nerveR(x) + 0.05)
    g.closePath(); g.fill()
    if (fine) {
      g.strokeStyle = C.arach; g.lineWidth = Math.max(hair, 0.01)
      for (let x = 0.3; x < NERVE_END; x += 0.33) { g.beginPath(); g.moveTo(x, nerveR(x) + 0.05); g.lineTo(x + 0.12 * (rand() - 0.3), R_SAS - 0.03); g.stroke() }
      g.beginPath(); g.moveTo(0.05, R_SAS - 0.04); g.lineTo(NERVE_END, R_SAS - 0.04); g.stroke()
    }
    g.restore()
  }
  // nerve tissue: prelaminar glia, the lamina, then myelinated nerve
  const outline = (front, back) => {
    g.beginPath()
    const n = 60, lim = 0.89
    for (let i = 0; i <= n; i++) { const y = -lim + 2 * lim * i / n; g.lineTo(front(y), y) }
    for (let i = n; i >= 0; i--) { const y = -lim + 2 * lim * i / n; g.lineTo(back(y), y) }
    g.closePath()
  }
  // the hollow of the cup is open to the gel; give it a backdrop so it does not read as a hole
  g.fillStyle = C.cupBack; outline(y => wallX(R_RET_IN, y) - 0.01, discSurface); g.fill()
  g.fillStyle = C.glia; outline(discSurface, lamFront); g.fill()
  g.fillStyle = C.lamina; outline(lamFront, y => lamFront(y) + LAM_T); g.fill()
  g.fillStyle = C.myelin; g.beginPath()
  for (let i = 0; i <= 40; i++) { const y = -0.9 + 1.8 * i / 40; g.lineTo(lamFront(y) + LAM_T, y) }
  for (const x of xs) g.lineTo(x, nerveR(x))
  for (const x of [...xs].reverse()) g.lineTo(x, -nerveR(x))
  g.closePath(); g.fill()
  // pia
  g.strokeStyle = C.pia; g.lineWidth = Math.max(hair, 0.03)
  for (const s of [1, -1]) { g.beginPath(); for (const x of xs) g.lineTo(x, s * (nerveR(x) + 0.02)); g.stroke() }

  // ---- bundles: a pale ribbon under each 3-D bundle, so the section still reads when those fade
  const lanes = []
  for (const s of [1, -1]) for (let i = 0; i < LANES; i++) lanes.push(bundle(i, s, 8))
  if (k > 30) {
    for (const pts of lanes) {
      g.beginPath()
      const side = []
      pts.forEach((p, j) => {
        const q = pts[Math.min(pts.length - 1, j + 1)], o = pts[Math.max(0, j - 1)]
        const dx = q.x - o.x, dy = q.y - o.y, L = Math.hypot(dx, dy) || 1
        const nx = -dy / L * p.r, ny = dx / L * p.r
        g.lineTo(p.x + nx, p.y + ny); side.push([p.x - nx, p.y - ny])
      })
      for (const [x, y] of side.reverse()) g.lineTo(x, y)
      g.closePath(); g.fillStyle = C.bundle; g.fill()
      if (fine) { g.strokeStyle = C.bundleEdge; g.lineWidth = hair; g.stroke() }
    }
  }
  // septa of pia between the myelinated bundles
  if (fine) {
    g.strokeStyle = C.septum; g.lineWidth = Math.max(hair, 0.008)
    for (const s of [1, -1]) for (let i = 0; i < LANES - 1; i++) {
      const y0 = (laneY(i) + laneY(i + 1)) / 2
      g.beginPath()
      for (let x = lamFront(y0) + LAM_T; x <= NERVE_END; x += 0.06) {
        const f = 1 + 0.25 * Math.min(1, Math.max(0, (x + 0.55) / 0.35)) + 0.37 * Math.min(1, Math.max(0, (x + 0.2) / 0.65))
        g.lineTo(x, s * y0 * f)
      }
      g.stroke()
    }
  }
  // ---- lamina cribrosa: stacked plates of collagen, each pierced by the pores the bundles use
  if (k > 30) {
    const plates = fine ? 7 : 4
    for (const s of [1, -1]) {
      for (let p = 0; p < plates; p++) {
        const off = 0.02 + (LAM_T - 0.04) * p / (plates - 1)
        g.strokeStyle = p % 2 ? C.beam : C.beamDark; g.lineWidth = Math.max(hair, fine ? 0.02 : 0.04)
        for (let i = -1; i < LANES; i++) {
          const ya = i < 0 ? 0.075 : laneY(i) + PORE / 2, yb = i + 1 < LANES ? laneY(i + 1) - PORE / 2 : 0.9
          g.beginPath()
          for (let j = 0; j <= 6; j++) { const y = ya + (yb - ya) * j / 6; g.lineTo(lamFront(y) + off, s * y) }
          g.stroke()
        }
      }
      // where the lamina is anchored into the sclera
      g.strokeStyle = C.beamDark; g.lineWidth = Math.max(hair, 0.02)
      g.beginPath(); g.moveTo(lamFront(0.9), s * 0.9); g.lineTo(lamFront(0.9) + LAM_T, s * 0.9); g.stroke()
    }
  }

  // ---- finest scale: what the tissue between the bundles is made of
  if (micro) {
    for (const s of [1, -1]) for (let i = 0; i < LANES - 1; i++) {
      const y0 = (laneY(i) + laneY(i + 1)) / 2, lf = lamFront(y0)
      // a capillary inside each beam, and running forward in the septum between bundles
      g.strokeStyle = C.endo; g.lineWidth = 0.009; g.lineCap = 'round'
      g.beginPath(); g.moveTo(lf - 0.3, s * y0); g.lineTo(lf + LAM_T * 0.9, s * y0); g.stroke()
      g.strokeStyle = '#f7d9d2'; g.lineWidth = 0.0066
      g.beginPath(); g.moveTo(lf - 0.3, s * y0); g.lineTo(lf + LAM_T * 0.9, s * y0); g.stroke()
      g.lineCap = 'butt'
      // astrocytes lining the bundles in front of the lamina
      g.fillStyle = C.astro
      for (let x = lf - 0.29; x < lf - 0.01; x += 0.034) {
        const up = rand() > 0.5 ? 1 : -1
        g.beginPath(); g.ellipse(x + 0.01 * rand(), s * (y0 + up * 0.0105), 0.0042, 0.0024, 0, 0, 7); g.fill()
      }
    }
    // collagen fibrils in the beams
    g.strokeStyle = 'rgba(70,82,110,0.35)'; g.lineWidth = Math.max(hair, 0.0012)
    for (const s of [1, -1]) for (let i = 0; i < LANES - 1; i++) {
      const ya = laneY(i) + PORE / 2 + 0.001, yb = laneY(i + 1) - PORE / 2 - 0.001
      for (let x = 0.01; x < LAM_T; x += 0.012) { g.beginPath(); g.moveTo(lamFront(ya) + x, s * ya); g.lineTo(lamFront(yb) + x + 0.004, s * yb); g.stroke() }
    }
  }
  if (ultra) {
    // individual axons, about a micrometre across, inside each bundle
    g.strokeStyle = C.axon; g.lineWidth = 0.0005
    for (const pts of lanes) {
      for (let f = -4; f <= 4; f++) {
        g.beginPath()
        pts.forEach((p, j) => {
          if (p.x < b.x - 0.05 || p.x > b.x + b.w + 0.05) return
          const q = pts[Math.min(pts.length - 1, j + 1)], o = pts[Math.max(0, j - 1)]
          const dx = q.x - o.x, dy = q.y - o.y, L = Math.hypot(dx, dy) || 1
          g.lineTo(p.x - dy / L * p.r * f / 4.6, p.y + dx / L * p.r * f / 4.6)
        })
        g.stroke()
      }
    }
  }

  if (hole) { // leave a window for the finer plate, with a small overlap
    const m = hole.w * 0.012
    g.clearRect(hole.x + m, hole.y + m, hole.w - 2 * m, hole.w - 2 * m)
  }
  g.setTransform(1, 0, 0, 1, 0, 0)
}

export const PLATES = [
  { x: -26, y: -20, w: 40 },
  { x: -3.6, y: -4, w: 8 },
  { x: -1.75, y: -0.25, w: 1.5 },
  { x: -1.03, y: 0.355, w: 0.3 },
]
