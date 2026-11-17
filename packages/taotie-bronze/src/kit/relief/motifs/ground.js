// Leiwen ground on its own, as a Motif Atlas entry (research/01 §3). The
// presets bracket what Anyang foundries actually cut: ~1 mm pitch on a 20–40 cm
// vessel, ~2.4 mm on the Houmuwu ding, thread relief, and the rounded 云纹
// variant. 'leftover' raises a few dummy motif blobs first so the
// contour-following packing (and the secondary fill on a plateau) is visible.

import { leiwenFillMask } from '../leiwen.js'

export const schema = {
  pitch: { type: 'range', min: 0.6, max: 3, step: 0.05, default: 1.3, label: 'Pitch', unit: 'mm' },
  line: { type: 'range', min: 0.3, max: 0.7, step: 0.02, default: 0.5, label: 'Groove : pitch' },
  cellMin: { type: 'range', min: 3, max: 8, step: 0.1, default: 4.2, label: 'Cell min (× pitch)' },
  cellMax: { type: 'range', min: 4, max: 12, step: 0.1, default: 7.8, label: 'Cell max (× pitch)' },
  roundness: { type: 'range', min: 0, max: 1, step: 0.05, default: 0.15, label: 'Roundness' },
  jitter: { type: 'range', min: 0, max: 0.3, step: 0.01, default: 0.08, label: 'Jitter' },
  pairs: { type: 'range', min: 0, max: 1, step: 0.05, default: 0.75, label: 'S-pairs' },
  hand: { type: 'enum', options: ['alternate', 'random', 'left', 'right'], default: 'alternate', label: 'Handedness' },
  eyes: { type: 'range', min: 0, max: 1, step: 0.05, default: 0, label: 'Eyed centres' },
  echo: { type: 'range', min: 0, max: 3, step: 1, default: 0, label: 'Contour echoes' },
  follow: { type: 'range', min: 0, max: 1, step: 0.05, default: 1, label: 'Follow contours' },
  mode: { type: 'enum', options: ['sunk', 'thread'], default: 'sunk', label: 'Mode' },
  depth: { type: 'range', min: 0.1, max: 1.2, step: 0.05, default: 0.45, label: 'Depth', unit: 'mm' },
  demo: { type: 'enum', options: ['none', 'blobs'], default: 'none', label: 'Dummy motif' },
  secondary: { type: 'bool', default: false, label: 'Fill plateau tops' },
}

export const presets = {
  // a 20–40 cm Anyang vessel: Met zun / gu foot, Fu Hao fangyi (§1.3: 0.8–1.6, typical 1.0–1.4)
  fine: { pitch: 1.0, depth: 0.35 },
  standard: {},
  // Houmuwu-scale (§1.3 monumental: pitch 1.6–3.0, groove 0.6–1.2 deep)
  monumental: { pitch: 2.4, depth: 0.9, jitter: 0.1 },
  'thread-relief': { mode: 'thread', depth: 0.35, pitch: 1.4, line: 0.42 },
  // 云纹: the rounded variant
  cloud: { roundness: 0.85, pitch: 1.3, pairs: 0.9 },
  // contour-following around raised dummy motifs, plus spirals on their tops
  leftover: { demo: 'blobs', pitch: 1.1, echo: 1, secondary: true },
}

/** The leiwen options a resolved param set stands for. */
export function leiwenParams(p) {
  const cmin = p.cellMin * p.pitch
  return {
    pitch: p.pitch,
    line: p.line,
    cell: [cmin, Math.max(cmin, p.cellMax * p.pitch)],
    roundness: p.roundness,
    jitter: p.jitter,
    pairs: p.pairs,
    hand: p.hand,
    eyes: p.eyes,
    echo: p.echo,
    follow: p.follow,
    mode: p.mode,
    depth: p.depth,
  }
}

/** Dummy "motif" shapes in rect-relative units: a squared-round band, an oval, a blade, a boss. */
function blobs(rect) {
  const X = (t) => rect.x + t * rect.w
  const Y = (t) => rect.y + t * rect.h
  const S = Math.min(rect.w, rect.h)
  return (ctx) => {
    // a C-shaped motif band with squared-round corners (the usual taotie plateau)
    const bw = 0.075 * S
    ctx.save()
    ctx.lineWidth = bw
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    const r = 0.06 * S
    ctx.moveTo(X(0.36), Y(0.78))
    ctx.arcTo(X(0.1), Y(0.78), X(0.1), Y(0.5), r)
    ctx.arcTo(X(0.1), Y(0.3), X(0.3), Y(0.3), r)
    ctx.lineTo(X(0.3), Y(0.3))
    ctx.lineTo(X(0.3), Y(0.48))
    ctx.stroke()
    ctx.restore()
    // an oval eye-like plateau
    ctx.beginPath()
    ctx.ellipse(X(0.56), Y(0.62), 0.13 * rect.w, 0.12 * rect.h, -0.25, 0, Math.PI * 2)
    ctx.fill()
    // a rising blade (triangle) on the right
    ctx.beginPath()
    ctx.moveTo(X(0.74), Y(0.08))
    ctx.lineTo(X(0.94), Y(0.08))
    ctx.lineTo(X(0.86), Y(0.6))
    ctx.closePath()
    ctx.fill()
    // a round boss
    ctx.beginPath()
    ctx.arc(X(0.48), Y(0.2), 0.07 * S, 0, Math.PI * 2)
    ctx.fill()
  }
}

/** Whole-rect ground (it carries its own symmetry, so nothing to mirror). */
export function draw(panel, rect, p) {
  const opts = leiwenParams(p)
  if (p.demo === 'blobs') {
    const shapes = blobs(rect)
    const height = Math.max(1.2, p.pitch * 1.3)
    panel.raise(shapes, { height, shoulder: 0.45 })
    panel.fillGround(opts, { rect, avoid: 'raised', margin: p.pitch * 0.5 })
    if (p.secondary) {
      // secondary line work on the plateau tops: one echo groove, then spirals/hooks
      leiwenFillMask(panel, shapes, { ...opts, echo: 1, eyes: 0, mode: 'sunk', depth: Math.min(p.depth, 0.4) }, { margin: p.pitch * 0.5, level: height })
    }
    return
  }
  panel.fillGround(opts, { rect, avoid: 'raised', margin: p.pitch * 0.5 })
}

export default { name: 'leiwen', label: 'Leiwen ground', schema, presets, draw, symmetric: false, ground: false, plaque: { w: 120, h: 80 } }
