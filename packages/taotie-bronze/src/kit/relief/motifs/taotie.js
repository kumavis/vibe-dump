// STATUS: first pass — a recognisable basic mask (eyes, horns, nose ridge,
// jaw, brows, body band). The grammar specialist replaces the shapes with ones
// built from research/01-…; keep the export shape { name, schema, presets, draw }.
//
// The taotie is a frontal animal face that is also two profile animals meeting
// nose to nose. The mould carver laid it out from the centre line, so it is
// authored here as a half mask in normalised space and mirrored:
//   x: 0 at the central axis → 1 at the panel edge, y: 0 bottom → 1 top.
// Positions are normalised (so a mask stretches to any band the way the
// originals do); band widths and eye radii are fractions of the band HEIGHT,
// because a wide panel gets a longer body, not fatter features.

import { smoothPath } from '../shapes.js'

export const schema = {
  style: { type: 'enum', options: ['relief', 'flush'], default: 'relief', label: 'Style' },
  horn: { type: 'enum', options: ['c', 'ram', 'buffalo', 'bottle', 't'], default: 'c', label: 'Horn' },
  eye: { type: 'enum', options: ['chen', 'oval', 'round'], default: 'chen', label: 'Eye' },
  eyeSize: { type: 'range', min: 0.6, max: 1.5, step: 0.05, default: 1, label: 'Eye size' },
  pupil: { type: 'enum', options: ['slit', 'dot'], default: 'slit', label: 'Pupil' },
  brow: { type: 'enum', options: ['band', 'hooked', 'none'], default: 'hooked', label: 'Brow' },
  ear: { type: 'bool', default: true, label: 'Ear' },
  crest: { type: 'bool', default: true, label: 'Crest' },
  nose: { type: 'enum', options: ['ridge', 'flange', 'plain'], default: 'ridge', label: 'Nose' },
  jaw: { type: 'enum', options: ['hooked', 'split', 'fanged'], default: 'hooked', label: 'Jaw' },
  body: { type: 'enum', options: ['band', 'kui', 'dissolved', 'none'], default: 'band', label: 'Body' },
  leg: { type: 'bool', default: true, label: 'Leg & claw' },
  quills: { type: 'bool', default: true, label: 'Dorsal quills' },
  lineWeight: { type: 'range', min: 0.3, max: 1.6, step: 0.05, default: 0.7, label: 'Line weight', unit: 'mm' },
  relief: {
    type: 'group',
    label: 'Relief levels',
    fields: {
      motif: { type: 'range', min: 0.2, max: 4, step: 0.1, default: 1.4, label: 'Motif (L1)', unit: 'mm' },
      boss: { type: 'range', min: 0.5, max: 8, step: 0.1, default: 3.2, label: 'Boss (L2)', unit: 'mm' },
      groove: { type: 'range', min: 0.1, max: 1.2, step: 0.05, default: 0.45, label: 'Groove', unit: 'mm' },
    },
  },
}

export const presets = {
  'yinxu-relief': {},
  'erligang-flush': { style: 'flush', horn: 'c', eye: 'oval', body: 'dissolved', quills: false, leg: false, lineWeight: 1.1, relief: { motif: 0.35, boss: 1.2, groove: 0.5 } },
  'ram-horned': { horn: 'ram', jaw: 'fanged', brow: 'band' },
  'buffalo': { horn: 'buffalo', eyeSize: 1.2, body: 'kui', crest: false },
  'bottle-horn': { horn: 'bottle', eye: 'round', pupil: 'dot', body: 'none', leg: false, quills: false },
}

/**
 * Draw the LEFT half of a taotie into rect (panel mm). The caller mirrors
 * (compose.drawMotif does: draw → ground → mirrorX(rect)).
 */
export function draw(panel, rect, p) {
  const H = rect.h
  const cx = rect.x + rect.w / 2
  const hw = rect.w / 2
  const P = (nx, ny) => [cx - nx * hw, rect.y + ny * H]
  const flush = p.style === 'flush'
  const lvl = p.relief
  const motifH = flush ? Math.min(lvl.motif, 0.4) : lvl.motif
  const band = 0.085 * H // width of a motif band
  const shoulder = Math.max(0.25, Math.min(band * 0.22, motifH * 0.6))

  const bands = [] // [points, width] stroked plateaus
  const fills = [] // closed point lists, filled plateaus
  const domes = [] // [centre, radius]
  const lines = [] // [points] incised centre lines

  // --- nose: a vertical bridge on the axis, flaring into nostrils at the bottom
  if (p.nose === 'ridge' || p.nose === 'plain') {
    const top = p.nose === 'ridge' ? 0.78 : 0.62
    fills.push([P(0, 0.14), P(0.11, 0.14), P(0.13, 0.22), P(0.075, 0.3), P(0.06, top), P(0, top + 0.03)])
    lines.push([P(0.03, 0.32), P(0.03, top - 0.05)])
  }

  // --- crest: forehead lozenge on the axis
  if (p.crest) fills.push([P(0, 0.79), P(0.065, 0.87), P(0, 0.95)])

  // --- eye
  const E = P(0.27, 0.55)
  const r = 0.12 * H * p.eyeSize
  const socket = []
  if (p.eye === 'chen') {
    // 臣-shaped: long almond, inner canthus hooking down toward the nose,
    // outer corner lifting toward the ear
    const ex = (dx, dy) => [E[0] - dx * r, E[1] + dy * r] // +dx = outward
    socket.push(
      ex(-1.9, -0.75), ex(-1.55, -0.1), ex(-1.1, 0.55), ex(0, 0.9), ex(1.1, 0.75), ex(1.85, 0.45),
      ex(1.55, 0.05), ex(0.9, -0.6), ex(0, -0.85), ex(-1.0, -0.6), ex(-1.45, -0.55),
    )
  } else {
    const rx = p.eye === 'oval' ? 1.45 : 1.05
    for (let i = 0; i < 20; i++) {
      const a = (i / 20) * Math.PI * 2
      socket.push([E[0] + Math.cos(a) * r * rx, E[1] + Math.sin(a) * r * (p.eye === 'oval' ? 0.85 : 1.05)])
    }
  }
  fills.push(socket)
  domes.push([E, r * 0.62])

  // --- brow
  if (p.brow !== 'none') {
    const b = [P(0.07, 0.73), P(0.2, 0.79), P(0.34, 0.79), P(0.44, 0.74)]
    if (p.brow === 'hooked') b.push(P(0.47, 0.66), P(0.43, 0.62))
    bands.push([b, band * 0.75])
    lines.push(b)
  }

  // --- horns rise from the forehead
  const horn = HORNS[p.horn] || HORNS.c
  horn(P, band, bands, fills, lines)

  // --- ear, behind the eye
  if (p.ear) fills.push([P(0.46, 0.5), P(0.53, 0.6), P(0.57, 0.72), P(0.52, 0.66), P(0.45, 0.58)])

  // --- upper jaw: runs out under the eye and curls back
  const jaw = [P(0.1, 0.3), P(0.24, 0.31), P(0.38, 0.3), P(0.45, 0.24), P(0.43, 0.14), P(0.35, 0.13)]
  bands.push([jaw, band])
  lines.push(jaw.slice(0, 5))
  if (p.jaw === 'split') {
    const lower = [P(0.12, 0.15), P(0.24, 0.1), P(0.3, 0.05)]
    bands.push([lower, band * 0.7])
  }
  if (p.jaw === 'fanged') {
    for (const fx of [0.16, 0.27]) fills.push([P(fx - 0.035, 0.27), P(fx + 0.035, 0.27), P(fx + 0.005, 0.15)])
  }

  // --- body: the profile animal running out to the panel edge
  if (p.body === 'band' || p.body === 'kui') {
    const tailUp = p.body === 'band'
    const body = [P(0.5, 0.46), P(0.66, 0.5), P(0.82, 0.52), P(0.92, 0.55)]
    body.push(tailUp ? P(0.96, 0.7) : P(0.97, 0.4), tailUp ? P(0.9, 0.78) : P(0.9, 0.32))
    bands.push([body, band * 0.9])
    lines.push(body.slice(0, 4))
    if (p.body === 'kui') domes.push([P(0.86, 0.6), r * 0.3])
    if (p.quills) {
      for (let i = 0; i < 4; i++) {
        const qx = 0.58 + i * 0.09
        bands.push([[P(qx, 0.6), P(qx + 0.03, 0.7), P(qx + 0.075, 0.71)], band * 0.45])
      }
    }
  } else if (p.body === 'dissolved') {
    // Loehr's "dissolved" style: the body broken into floating hooks
    const rng = panel.rng.fork('taotie:dissolved')
    for (let i = 0; i < 5; i++) {
      const x = 0.55 + i * 0.085 + rng.jitter(0.01)
      const y = i % 2 ? 0.62 : 0.4
      bands.push([[P(x, y), P(x + 0.05, y + 0.06), P(x + 0.02, y + 0.12)], band * 0.55])
    }
  }
  if (p.leg && p.body !== 'none') {
    const leg = [P(0.6, 0.46), P(0.62, 0.3), P(0.6, 0.18), P(0.68, 0.12), P(0.73, 0.18)]
    bands.push([leg, band * 0.8])
  }

  // ---- render: L1 plateaus, then L2 domes on top, then incised line work
  panel.raise((ctx) => {
    for (const pts of fills) {
      smoothPath(ctx, pts, true)
      ctx.fill()
    }
    for (const [pts, w] of bands) {
      ctx.lineWidth = w
      smoothPath(ctx, pts, false)
      ctx.stroke()
    }
  }, { height: motifH, shoulder, profile: 'plateau' })

  panel.raise((ctx) => {
    for (const [c, rr] of domes) {
      ctx.beginPath()
      ctx.arc(c[0], c[1], rr, 0, Math.PI * 2)
      ctx.fill()
    }
  }, { height: flush ? lvl.boss * 0.4 : lvl.boss, profile: 'dome' })

  const lw = p.lineWeight * (flush ? 1.2 : 1)
  panel.sink((ctx) => {
    ctx.lineWidth = lw
    for (const pts of lines) {
      smoothPath(ctx, pts, false)
      ctx.stroke()
    }
    // pupil, cut into the eyeball
    const [ex, ey] = E
    ctx.beginPath()
    if (p.pupil === 'dot') ctx.arc(ex, ey, r * 0.16, 0, Math.PI * 2)
    else ctx.ellipse(ex, ey, r * 0.42, r * 0.1, 0, 0, Math.PI * 2)
    ctx.fill()
  }, { depth: lvl.groove, shoulder: lw * 0.35, profile: 'u' })
}

// Horn builders: (P, band, bands, fills, lines) push shapes for the left horn.
const HORNS = {
  // C-horn: rises outward and curls down, opening toward the eye
  c(P, band, bands, fills, lines) {
    const pts = [P(0.1, 0.86), P(0.24, 0.94), P(0.38, 0.95), P(0.47, 0.9), P(0.47, 0.82), P(0.4, 0.8)]
    bands.push([pts, band * 1.05])
    lines.push(pts.slice(0, 5))
  },
  // ram: a tight inward coil
  ram(P, band, bands, fills, lines) {
    const pts = [P(0.1, 0.86), P(0.28, 0.95), P(0.44, 0.92), P(0.48, 0.83), P(0.42, 0.78), P(0.37, 0.83), P(0.4, 0.87)]
    bands.push([pts, band * 0.95])
    lines.push(pts.slice(0, 4))
  },
  // buffalo: a broad crescent sweeping up and out to a point
  buffalo(P, band, bands, fills) {
    fills.push([P(0.08, 0.82), P(0.3, 0.86), P(0.5, 0.9), P(0.6, 0.99), P(0.47, 0.97), P(0.28, 0.95), P(0.1, 0.92)])
  },
  // bottle: an upright bottle-shaped plateau
  bottle(P, band, bands, fills, lines) {
    fills.push([P(0.13, 0.8), P(0.27, 0.8), P(0.25, 0.86), P(0.29, 0.93), P(0.24, 0.99), P(0.15, 0.99), P(0.1, 0.93), P(0.14, 0.86)])
    lines.push([P(0.2, 0.83), P(0.2, 0.95)])
  },
  // T: a bar on a short post
  t(P, band, bands) {
    bands.push([[P(0.18, 0.8), P(0.18, 0.92)], band])
    bands.push([[P(0.08, 0.95), P(0.3, 0.95)], band * 0.9])
  },
}

export default { name: 'taotie', label: 'Taotie mask', schema, presets, draw, plaque: { w: 240, h: 120 } }
