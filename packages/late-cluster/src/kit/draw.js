// The drawing kit: chimera's vector-display helpers (beams, Hershey labels, the glow pass) plus the
// show's own drawables (panels, charts, typewriter text, skeet cards, the butterfly, node graphs).
// Everything draws in whatever units the context is in (segments get 1280×720 stage units).
// Beams add up ("lighter"), so draw a black fill first wherever something should hide what's behind.

import { beam, beamPts, seg, ring, dot, label, labelWidth, wrapLabel, labelBlock, pathOf, chaikin, hfont, HERSHEY, Glow } from '../../chimera/ui/render/vector.ts'
import { mix, core } from '../../chimera/ui/colors.ts'
import { HOUSE } from '../engine/palette.js'
import { clamp, unlerp, ease, rng } from './ease.js'

export { beam, beamPts, seg, ring, dot, label, labelWidth, wrapLabel, labelBlock, pathOf, chaikin, hfont, HERSHEY, Glow, mix, core }

/** The show palette: chimera's vector colours plus the show's own. */
export const P = Object.freeze({
  ...HOUSE,
  gold: '#ffc861',
  goldMid: '#d39a3c',
  goldDim: '#6e4f1c',
  bsky: '#3f8cff',
  sky: '#7cc4ff',
  cyan: '#58f0e8',
  violet: '#a98bff',
  magenta: '#ff5fd2',
  lime: '#b6ff5c',
  coral: '#ff7a5c',
  onair: '#ff3b30',
  dim: '#0d2234',
  black: '#000000',
})

// ---------------------------------------------------------------- primitives

/** a rectangle path, optionally with cut (chamfered) corners */
export function rectPath(x, y, w, h, cut = 0) {
  const p = new Path2D()
  if (cut <= 0) {
    p.rect(x, y, w, h)
    return p
  }
  const c = Math.min(cut, w / 2, h / 2)
  p.moveTo(x + c, y)
  p.lineTo(x + w - c, y)
  p.lineTo(x + w, y + c)
  p.lineTo(x + w, y + h - c)
  p.lineTo(x + w - c, y + h)
  p.lineTo(x + c, y + h)
  p.lineTo(x, y + h - c)
  p.lineTo(x, y + c)
  p.closePath()
  return p
}

/** a rounded rectangle path */
export function roundPath(x, y, w, h, r = 8) {
  const p = new Path2D()
  r = Math.min(r, w / 2, h / 2)
  p.moveTo(x + r, y)
  p.arcTo(x + w, y, x + w, y + h, r)
  p.arcTo(x + w, y + h, x, y + h, r)
  p.arcTo(x, y + h, x, y, r)
  p.arcTo(x, y, x + w, y, r)
  p.closePath()
  return p
}

/** fill a path black (or `color`): hides the beams behind it */
export function occlude(ctx, path, color = '#000', alpha = 1) {
  ctx.save()
  ctx.globalCompositeOperation = 'source-over'
  ctx.globalAlpha = alpha
  ctx.fillStyle = color
  ctx.fill(path)
  ctx.restore()
}

/**
 * A framed box. o: { color, width, fill ('#000' default, null for none), cut (chamfer), radius,
 * alpha, hot, corners (draw only corner brackets of this length) }
 */
export function box(ctx, x, y, w, h, o = {}) {
  const color = o.color ?? P.blue
  const path = o.radius ? roundPath(x, y, w, h, o.radius) : rectPath(x, y, w, h, o.cut ?? 0)
  if (o.fill !== null) occlude(ctx, path, o.fill ?? '#000', o.fillAlpha ?? 1)
  if (o.corners) {
    const c = o.corners
    const p = new Path2D()
    for (const [cx, cy, sx, sy] of [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]]) {
      p.moveTo(cx + sx * c, cy)
      p.lineTo(cx, cy)
      p.lineTo(cx, cy + sy * c)
    }
    beam(ctx, p, color, o.width ?? 1.6, { alpha: o.alpha, hot: o.hot })
  } else beam(ctx, path, color, o.width ?? 1.4, { alpha: o.alpha, hot: o.hot })
  return path
}

/** text with a soft extra halo (titles); same options as label() plus `glow` (0..1) */
export function glowText(ctx, text, x, y, o = {}) {
  const g = o.glow ?? 0.6
  if (g > 0) {
    ctx.save()
    ctx.filter = `blur(${((o.size ?? 11) * 0.12).toFixed(1)}px)`
    label(ctx, text, x, y, { ...o, alpha: (o.alpha ?? 1) * g })
    ctx.restore()
  }
  label(ctx, text, x, y, o)
}

/** a word-wrapped paragraph; returns the height used. o: label opts + lineHeight */
export function paragraph(ctx, text, x, y, maxW, o = {}) {
  const size = o.size ?? 16
  const lh = o.lineHeight ?? size * 1.4
  const lines = []
  for (const para of String(text).split('\n')) lines.push(...wrapLabel(ctx, para, maxW, o))
  lines.forEach((l, i) => label(ctx, l, x, y + i * lh, o))
  return lines.length * lh
}

/**
 * Typewriter text: reveals `text` character by character.
 * progress: 0..1 of the text shown (e.g. unlerp(t0, t1, t)); cursor blinks at the end while < 1.
 */
export function typewriter(ctx, text, x, y, progress, o = {}) {
  const n = Math.floor(clamp(progress) * text.length)
  const shown = text.slice(0, n)
  const maxW = o.maxW ?? Infinity
  const size = o.size ?? 18
  let h
  if (maxW < Infinity) h = paragraph(ctx, shown, x, y, maxW, o)
  else {
    label(ctx, shown, x, y, o)
    h = size
  }
  if (progress < 1 || o.cursor) {
    const blink = o.t === undefined || Math.floor(o.t * 2.5) % 2 === 0
    if (blink) {
      // cursor after the last line
      const lines = maxW < Infinity ? shown.split('\n').flatMap((p) => wrapLabel(ctx, p, maxW, o)) : [shown]
      const last = lines[lines.length - 1] ?? ''
      const lh = o.lineHeight ?? size * 1.4
      const cx = x + labelWidth(ctx, last, o) + size * 0.15
      const cy = y + (lines.length - 1) * (maxW < Infinity ? lh : 0)
      seg(ctx, cx, cy + size * 0.12, cx + size * 0.55, cy + size * 0.12, o.color ?? P.green, Math.max(1.5, size * 0.1))
    }
  }
  return h
}

/** count up to a number as progress goes 0..1 (with thousands separators) */
export function countUp(value, progress, decimals = 0) {
  const v = value * ease.outCubic(clamp(progress))
  return v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

/** compact counts: 1234 → 1.2K */
export function compact(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(n >= 1e7 ? 0 : 1).replace(/\.0$/, '') + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(n >= 1e4 ? 0 : 1).replace(/\.0$/, '') + 'K'
  return String(Math.round(n))
}

/** an arrow from (x0,y0) to (x1,y1) */
export function arrow(ctx, x0, y0, x1, y1, color = P.white, width = 2, o = {}) {
  const a = Math.atan2(y1 - y0, x1 - x0), h = o.head ?? 10
  const p = new Path2D()
  p.moveTo(x0, y0)
  p.lineTo(x1, y1)
  p.moveTo(x1 - h * Math.cos(a - 0.45), y1 - h * Math.sin(a - 0.45))
  p.lineTo(x1, y1)
  p.lineTo(x1 - h * Math.cos(a + 0.45), y1 - h * Math.sin(a + 0.45))
  beam(ctx, p, color, width, o)
}

// ---------------------------------------------------------------- panels and charts

/**
 * A graphics panel (the `ots` shot's screen, or any inset): black, framed, a title tab.
 * rect: {x,y,w,h}; o: { title, color, appear (0..1 wipe-in), sub }
 */
export function panel(ctx, rect, o = {}) {
  const { x, y, w } = rect
  const appear = ease.outCubic(clamp(o.appear ?? 1))
  if (appear <= 0) return
  const h = rect.h * appear
  const color = o.color ?? P.sky
  box(ctx, x, y, w, h, { color, cut: 10, width: 1.6, alpha: 0.9 })
  // inner hairline
  beam(ctx, rectPath(x + 6, y + 6, w - 12, h - 12, 6), color, 0.8, { alpha: 0.25 })
  if (o.title && appear > 0.6) {
    const tw = labelWidth(ctx, o.title.toUpperCase(), { size: 15, ls: 0.2 }) + 28
    box(ctx, x + 18, y - 13, tw, 26, { color, cut: 6, width: 1.4 })
    label(ctx, o.title.toUpperCase(), x + 32, y + 6, { size: 15, ls: 0.2, color: P.white, alpha: unlerp(0.6, 1, appear) })
  }
  if (o.sub && appear > 0.8) label(ctx, o.sub.toUpperCase(), x + w - 18, y + h - 16, { size: 11, align: 'right', color, alpha: 0.7, ls: 0.2 })
}

/**
 * Bars. rect {x,y,w,h}; data: [{label, value, color?, note?}]; o: { max, progress (0..1 grow),
 * color, horizontal (default true), format(v), labelSize }
 */
export function barChart(ctx, rect, data, o = {}) {
  const { x, y, w, h } = rect
  const max = o.max ?? Math.max(1e-9, ...data.map((d) => d.value))
  const prog = o.progress ?? 1
  const fmt = o.format ?? ((v) => compact(v))
  const ls = o.labelSize ?? 15
  const n = data.length
  if (o.horizontal === false) {
    const bw = (w / n) * 0.6
    data.forEach((d, i) => {
      const p = ease.outCubic(clamp(prog * n - i * 0.6))
      const bx = x + (w / n) * (i + 0.2)
      const bh = (h - 40) * (d.value / max) * p
      const c = d.color ?? o.color ?? P.sky
      box(ctx, bx, y + h - 24 - bh, bw, bh, { color: c, width: 1.6, hot: true })
      for (let k = 6; k < bh; k += 6) seg(ctx, bx + 3, y + h - 24 - k, bx + bw - 3, y + h - 24 - k, c, 0.8, { alpha: 0.25 })
      label(ctx, d.label.toUpperCase(), bx + bw / 2, y + h - 4, { size: ls * 0.8, align: 'center', color: P.white, alpha: 0.85 })
      if (p > 0.1) label(ctx, fmt(d.value * p), bx + bw / 2, y + h - 32 - bh, { size: ls, align: 'center', color: c })
    })
    return
  }
  const lw = o.labelWidth ?? w * 0.3
  const rowH = h / n
  const bh = Math.min(26, rowH * 0.56)
  data.forEach((d, i) => {
    const p = ease.outCubic(clamp(prog * n - i * 0.6))
    const by = y + rowH * i + (rowH - bh) / 2
    const c = d.color ?? o.color ?? P.sky
    label(ctx, d.label.toUpperCase(), x + lw - 12, by + bh * 0.72, { size: ls, align: 'right', color: P.white, alpha: 0.9 })
    const full = (w - lw - 70) * (d.value / max)
    const bw = full * p
    if (bw > 1) {
      box(ctx, x + lw, by, bw, bh, { color: c, width: 1.6, hot: d.hot })
      for (let k = 6; k < bw - 2; k += 7) seg(ctx, x + lw + k, by + 3, x + lw + k, by + bh - 3, c, 0.8, { alpha: 0.22 })
    }
    if (p > 0.05 && d.value > 0) label(ctx, fmt(d.value * p) + (d.note ? ' ' + d.note : ''), x + lw + bw + 10, by + bh * 0.72, { size: ls, color: c })
  })
}

/**
 * A line chart. series: [{ values:[...], color, label }]; o: { progress (0..1 draw-on), min, max,
 * xLabels: [...], grid (true), yFormat }
 */
export function lineChart(ctx, rect, series, o = {}) {
  const { x, y, w, h } = rect
  const all = series.flatMap((s) => s.values)
  const lo = o.min ?? Math.min(...all), hi = o.max ?? Math.max(...all)
  const prog = clamp(o.progress ?? 1)
  if (o.grid !== false) {
    for (let i = 0; i <= 4; i++) {
      const gy = y + h - (h * i) / 4
      seg(ctx, x, gy, x + w, gy, P.blueDim, 0.8, { alpha: i === 0 ? 0.8 : 0.35 })
      if (o.yFormat) label(ctx, o.yFormat(lo + ((hi - lo) * i) / 4), x - 8, gy + 4, { size: 11, align: 'right', color: P.blueMid })
    }
  }
  if (o.xLabels) o.xLabels.forEach((l, i) => label(ctx, String(l).toUpperCase(), x + (w * i) / Math.max(1, o.xLabels.length - 1), y + h + 18, { size: 11, align: 'center', color: P.blueMid }))
  for (const s of series) {
    const n = s.values.length
    const upto = prog * (n - 1)
    const pts = []
    for (let i = 0; i <= Math.min(n - 1, Math.floor(upto)); i++) pts.push([x + (w * i) / (n - 1), y + h - (h * (s.values[i] - lo)) / (hi - lo || 1)])
    const fi = Math.floor(upto)
    if (fi < n - 1) {
      const f = upto - fi
      const a = s.values[fi], b = s.values[fi + 1]
      pts.push([x + (w * upto) / (n - 1), y + h - (h * (a + (b - a) * f - lo)) / (hi - lo || 1)])
    }
    beamPts(ctx, pts, s.color ?? P.amber, 2.2, { hot: true })
    const last = pts[pts.length - 1]
    if (last) {
      ring(ctx, last[0], last[1], 5, s.color ?? P.amber, 1.6)
      if (s.label && prog > 0.95) label(ctx, s.label.toUpperCase(), last[0] + 10, last[1] + 4, { size: 13, color: s.color ?? P.amber })
    }
  }
}

// ---------------------------------------------------------------- Bluesky things

/** the butterfly, centred at (x, y), `s` = wingspan */
export function butterfly(ctx, x, y, s, color = P.bsky, o = {}) {
  const k = s / 2
  const p = new Path2D()
  // a wing: upper lobe then lower lobe, mirrored
  for (const sx of [-1, 1]) {
    p.moveTo(x, y - 0.05 * k)
    p.bezierCurveTo(x + sx * 0.25 * k, y - 0.55 * k, x + sx * 0.95 * k, y - 1.0 * k, x + sx * 0.98 * k, y - 0.62 * k)
    p.bezierCurveTo(x + sx * 1.02 * k, y - 0.2 * k, x + sx * 0.8 * k, y + 0.05 * k, x + sx * 0.45 * k, y + 0.12 * k)
    p.bezierCurveTo(x + sx * 0.85 * k, y + 0.25 * k, x + sx * 0.75 * k, y + 0.8 * k, x + sx * 0.35 * k, y + 0.62 * k)
    p.bezierCurveTo(x + sx * 0.15 * k, y + 0.5 * k, x + sx * 0.05 * k, y + 0.25 * k, x, y + 0.08 * k)
  }
  beam(ctx, p, color, o.width ?? Math.max(1.2, s * 0.045), { hot: o.hot ?? true, alpha: o.alpha })
}

/** a heart outline */
function heartPath(x, y, s) {
  const p = new Path2D()
  p.moveTo(x, y + s * 0.35)
  p.bezierCurveTo(x - s * 0.9, y - s * 0.2, x - s * 0.35, y - s * 0.75, x, y - s * 0.3)
  p.bezierCurveTo(x + s * 0.35, y - s * 0.75, x + s * 0.9, y - s * 0.2, x, y + s * 0.35)
  return p
}

/** the repost arrows */
function repostPath(x, y, s) {
  const p = new Path2D()
  const w = s * 0.7, h = s * 0.32
  p.moveTo(x - w, y + h * 0.2)
  p.lineTo(x - w, y - h)
  p.lineTo(x + w * 0.7, y - h)
  p.moveTo(x + w * 0.45, y - h - s * 0.2)
  p.lineTo(x + w * 0.7, y - h)
  p.lineTo(x + w * 0.45, y - h + s * 0.2)
  p.moveTo(x + w, y - h * 0.2)
  p.lineTo(x + w, y + h)
  p.lineTo(x - w * 0.7, y + h)
  p.moveTo(x - w * 0.45, y + h - s * 0.2)
  p.lineTo(x - w * 0.7, y + h)
  p.lineTo(x - w * 0.45, y + h + s * 0.2)
  return p
}

/** the reply bubble */
function replyPath(x, y, s) {
  const p = new Path2D()
  p.moveTo(x - s * 0.55, y + s * 0.45)
  p.lineTo(x - s * 0.55, y - s * 0.4)
  p.lineTo(x + s * 0.6, y - s * 0.4)
  p.lineTo(x + s * 0.6, y + s * 0.25)
  p.lineTo(x - s * 0.2, y + s * 0.25)
  p.closePath()
  return p
}

/** an avatar: a ring with initials (or a tiny drawn face) */
export function avatar(ctx, x, y, r, o = {}) {
  const c = o.color ?? P.bsky
  occlude(ctx, (() => { const p = new Path2D(); p.arc(x, y, r, 0, Math.PI * 2); return p })())
  ring(ctx, x, y, r, c, Math.max(1.4, r * 0.09), { hot: true })
  ring(ctx, x, y, r * 0.78, c, 0.9, { alpha: 0.4 })
  if (o.initials) label(ctx, o.initials.toUpperCase(), x, y + r * 0.32, { size: r * 0.85, align: 'center', color: P.white, weight: 'm', ls: 0.02 })
}

/**
 * A skeet card: a stylised Bluesky post.
 *   skeetCard(ctx, { x, y, w, name, handle, text, likes, reposts, replies, time, color, initials,
 *                    appear (0..1: drops in), likePulse (0..1: heart pops), reveal (0..1: typewriter),
 *                    t (for the cursor blink), scale })
 * Returns the card's height. Coordinates are its top-left.
 */
export function skeetCard(ctx, o) {
  const s = o.scale ?? 1
  const w = (o.w ?? 460) / s
  const appear = clamp(o.appear ?? 1)
  if (appear <= 0) return 0
  const e = ease.outBack(appear)
  ctx.save()
  ctx.translate(o.x, o.y + (1 - e) * 40)
  ctx.scale(s, s)
  ctx.globalAlpha = Math.min(1, appear * 2)
  const color = o.color ?? P.bsky
  const pad = 18
  const textSize = o.textSize ?? 19
  const textW = w - pad * 2 - 58
  // measure
  const body = String(o.text ?? '')
  const lines = body.split('\n').flatMap((para) => wrapLabel(ctx, para, textW, { size: textSize, ls: 0.04 }))
  const lh = textSize * 1.38
  const h = pad + 26 + lines.length * lh + 52
  box(ctx, 0, 0, w, h, { color, radius: 14, width: 1.6, alpha: 0.95 })
  avatar(ctx, pad + 22, pad + 22, 22, { color: o.avatarColor ?? color, initials: o.initials ?? (o.name ?? '?').slice(0, 1) })
  const nx = pad + 58
  label(ctx, o.name ?? 'Someone', nx, pad + 15, { size: 17, color: P.white, weight: 'm', ls: 0.04 })
  const nw = labelWidth(ctx, o.name ?? 'Someone', { size: 17, weight: 'm', ls: 0.04 })
  label(ctx, `@${o.handle ?? 'someone.bsky.social'}${o.time ? ' · ' + o.time : ''}`, nx + nw + 10, pad + 15, { size: 13, color: o.handleColor ?? P.blueMid, ls: 0.05 })
  butterfly(ctx, w - pad - 10, pad + 10, 22, color, { width: 1.2, hot: false, alpha: 0.7 })
  // text (optionally typed on)
  const total = body.length
  let left = Math.floor(clamp(o.reveal ?? 1) * total)
  lines.forEach((ln, i) => {
    if (left <= 0) return
    const part = ln.slice(0, left)
    left -= ln.length + 1
    label(ctx, part, nx, pad + 26 + (i + 1) * lh - lh * 0.25, { size: textSize, color: o.textColor ?? P.white, ls: 0.04 })
  })
  // footer: reply, repost, like
  const fy = h - 24
  const items = [
    [replyPath, o.replies, P.blueMid],
    [repostPath, o.reposts, o.reposted ? P.green : P.blueMid],
    [heartPath, o.likes, o.liked || (o.likePulse ?? 0) > 0 ? P.magenta : P.blueMid],
  ]
  items.forEach(([fn, n, c], i) => {
    const ix = nx + i * ((w - nx - pad) / 3) + 8
    const pop = i === 2 ? Math.sin(Math.PI * clamp(o.likePulse ?? 0)) : 0
    const sz = 14 * (1 + 0.6 * pop)
    beam(ctx, fn(ix, fy, sz), c, 1.4, { hot: pop > 0.2 })
    if (n !== undefined && n !== null) label(ctx, typeof n === 'number' ? compact(n) : String(n), ix + 16, fy + 5, { size: 14, color: c })
  })
  ctx.restore()
  return h * s
}

// ---------------------------------------------------------------- node graphs (the simcluster)

/**
 * A seeded cluster graph laid out in a rect: `clusters` groups of nodes around centres, edges
 * mostly within a cluster. Returns { nodes:[{x,y,c,r,phase}], edges:[[i,j]] } — build once, draw
 * every frame with drawGraph.
 */
export function makeCluster(seed, rect, o = {}) {
  const r = rng(seed)
  const nC = o.clusters ?? 6
  const per = o.perCluster ?? 14
  const colors = o.colors ?? [P.bsky, P.sky, P.cyan, P.violet, P.magenta, P.gold, P.lime]
  const nodes = [], edges = []
  const centres = []
  for (let c = 0; c < nC; c++) centres.push({ x: rect.x + rect.w * (0.08 + 0.84 * ((c + r.range(0.2, 0.8)) / nC)), y: rect.y + rect.h * r.range(0.25, 0.75), col: colors[c % colors.length] })
  centres.forEach((cc, c) => {
    const base = nodes.length
    const spread = (rect.w / nC) * 0.42
    for (let i = 0; i < per; i++) {
      const a = r.range(0, Math.PI * 2), d = Math.sqrt(r()) * spread
      nodes.push({ x: cc.x + Math.cos(a) * d, y: cc.y + Math.sin(a) * d * (rect.h / rect.w) * 2.2, c: cc.col, cl: c, r: r.range(1.2, 3.2), phase: r.range(0, 10) })
    }
    for (let i = 0; i < per * 1.6; i++) edges.push([base + r.int(per), base + r.int(per)])
  })
  for (let i = 0; i < nC * 3; i++) edges.push([r.int(nodes.length), r.int(nodes.length)])
  return { nodes, edges: edges.filter(([a, b]) => a !== b), centres }
}

/** draw a graph from makeCluster; t animates twinkle; o: { alpha, edgeAlpha, highlight: clusterIndex } */
export function drawGraph(ctx, g, t = 0, o = {}) {
  const al = o.alpha ?? 1
  const byColor = new Map()
  for (const [a, b] of g.edges) {
    const A = g.nodes[a], B = g.nodes[b]
    const c = A.cl === B.cl ? A.c : P.blueDim
    if (!byColor.has(c)) byColor.set(c, new Path2D())
    const p = byColor.get(c)
    p.moveTo(A.x, A.y)
    p.lineTo(B.x, B.y)
  }
  for (const [c, p] of byColor) beam(ctx, p, c, 0.8, { alpha: (o.edgeAlpha ?? 0.3) * al })
  for (const n of g.nodes) {
    const tw = 0.55 + 0.45 * Math.sin(t * (1.3 + (n.phase % 1.7)) + n.phase * 7)
    const hi = o.highlight === n.cl ? 1.6 : 1
    dot(ctx, n.x, n.y, n.r * hi, n.c, al * tw)
    if (n.r > 2.6) ring(ctx, n.x, n.y, n.r * 2.2, n.c, 0.8, { alpha: 0.35 * al * tw })
  }
}

// shared props (crow, chicken, keycap, stamp, ticker, weather glyphs, tvFrame, credits, confetti, …)
export * from './props.js'
