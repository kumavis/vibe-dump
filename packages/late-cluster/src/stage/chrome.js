// Broadcast chrome drawn on the stage (stage units): the show logo, lower-third chyrons, the
// caption bar.
import { beam, seg, ring, dot, label, labelWidth, wrapLabel, box, occlude, rectPath, butterfly, glowText, P, mix } from '../kit/draw.js'
import { clamp, ease, smoothstep, rng } from '../kit/ease.js'
import { confetti } from '../kit/props.js'

// ---------------------------------------------------------------- the logo

const EMBLEM = (() => {
  const r = rng('emblem')
  const nodes = []
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2 + r.range(-0.2, 0.2)
    const d = i === 0 ? 0 : r.range(0.45, 0.95)
    nodes.push([Math.cos(a) * d, Math.sin(a) * d])
  }
  const edges = []
  for (let i = 1; i < 9; i++) {
    edges.push([0, i])
    edges.push([i, i === 8 ? 1 : i + 1])
  }
  edges.push([2, 6], [3, 7])
  return { nodes, edges }
})()

/** the cluster emblem: a ring of linked nodes (a moon, a network, a mic grille — take your pick) */
export function emblem(ctx, x, y, r, t = 0, color = P.gold, o = {}) {
  ring(ctx, x, y, r, color, 1.8, { hot: true, alpha: o.alpha })
  ring(ctx, x, y, r * 1.12, color, 0.9, { alpha: 0.4 * (o.alpha ?? 1) })
  const p = new Path2D()
  for (const [a, b] of EMBLEM.edges) {
    const A = EMBLEM.nodes[a], B = EMBLEM.nodes[b]
    p.moveTo(x + A[0] * r * 0.82, y + A[1] * r * 0.82)
    p.lineTo(x + B[0] * r * 0.82, y + B[1] * r * 0.82)
  }
  beam(ctx, p, color, 1, { alpha: 0.55 * (o.alpha ?? 1) })
  EMBLEM.nodes.forEach(([nx, ny], i) => dot(ctx, x + nx * r * 0.82, y + ny * r * 0.82, r * (i === 0 ? 0.09 : 0.06), i % 3 === 0 ? P.sky : color, (0.6 + 0.4 * Math.sin(t * 2 + i * 1.7)) * (o.alpha ?? 1)))
}

/**
 * THE LATE CLUSTER / with Larry Nx. (x, y) = left end of the CLUSTER baseline; s = scale (1 ≈ 600
 * stage units wide). o: { alpha, t, sub (false to omit "with Larry Nx"), align: 'left'|'center' }
 */
export function logo(ctx, x, y, s = 1, o = {}) {
  const t = o.t ?? 0
  const a = o.alpha ?? 1
  if (a <= 0) return
  const big = 104 * s
  const w = labelWidth(ctx, 'CLUSTER', { size: big, weight: 'm', ls: 0.06 })
  if (o.align === 'center') x -= w / 2
  ctx.save()
  ctx.globalAlpha = a
  // THE LATE, letter-spaced over the left of CLUSTER
  glowText(ctx, 'THE LATE', x + 4 * s, y - big * 0.92, { size: 34 * s, color: P.sky, ls: 0.62, weight: 'm', alpha: a, glow: 0.5 })
  // the emblem sits on the right of THE LATE
  emblem(ctx, x + w - 44 * s, y - big * 1.06, 30 * s, t, P.gold, { alpha: a })
  glowText(ctx, 'CLUSTER', x, y, { size: big, weight: 'm', color: P.gold, ls: 0.06, alpha: a, glow: 0.9 })
  // a scan line under it
  const sw = w * clamp(o.sweep ?? 1)
  seg(ctx, x, y + 16 * s, x + sw, y + 16 * s, P.gold, 2 * s, { hot: true, alpha: a })
  seg(ctx, x, y + 24 * s, x + sw * 0.7, y + 24 * s, P.goldMid, 1 * s, { alpha: 0.6 * a })
  if (o.sub !== false) {
    ctx.save()
    ctx.translate(x + w - 4 * s, y + 66 * s)
    ctx.transform(1, 0, -0.22, 1, 0, 0)
    glowText(ctx, 'with Larry Nx', 0, 0, { size: 40 * s, color: P.white, align: 'right', ls: 0.06, alpha: a, glow: 0.4 })
    ctx.restore()
  }
  ctx.restore()
}

// ---------------------------------------------------------------- lower thirds

/**
 * A chyron: name + title/handle, slides in from the left. c = { name, title, handle, color }, u
 * from the show: { inU (0..1 in), outU (0..1 out) }; y = top of the bar.
 */
export function chyron(ctx, c, inU, outU, y = 520) {
  const a = ease.outCubic(clamp(inU)) * (1 - ease.inCubic(clamp(outU)))
  if (a <= 0.001) return
  const color = c.color ?? P.sky
  const name = String(c.name ?? '').toUpperCase()
  const sub = String(c.title ?? '').toUpperCase()
  const handle = c.handle ?? ''
  const nw = labelWidth(ctx, name, { size: 34, weight: 'm', ls: 0.1 })
  const sw = labelWidth(ctx, sub + (handle ? '   ' + handle : ''), { size: 15, ls: 0.18 })
  const w = Math.max(nw + (c.parody ? labelWidth(ctx, 'PUPPET · PARODY', { size: 11, ls: 0.22 }) + 40 : 0), sw) + 120
  const x = 56 - (1 - a) * (w + 80)
  box(ctx, x, y, w, 88, { color, cut: 12, width: 1.6, alpha: 0.95 })
  // accent stripe and the butterfly
  seg(ctx, x + 14, y + 14, x + 14, y + 74, color, 4, { hot: true })
  butterfly(ctx, x + w - 34, y + 30, 26, color, { width: 1.3 })
  label(ctx, name, x + 34, y + 44, { size: 34, weight: 'm', color: P.white, ls: 0.1 })
  label(ctx, sub, x + 36, y + 72, { size: 15, color, ls: 0.18 })
  if (c.parody) {
    // these are puppets playing real accounts' posting personas, and the show says so
    const tx = x + 34 + nw + 18, tw = labelWidth(ctx, 'PUPPET · PARODY', { size: 11, ls: 0.22 }) + 16
    box(ctx, tx, y + 23, tw, 22, { color: P.amber, cut: 4, width: 1.1 })
    label(ctx, 'PUPPET · PARODY', tx + 8, y + 38, { size: 11, color: P.amber, ls: 0.22 })
  }
  if (handle) label(ctx, handle, x + 36 + labelWidth(ctx, sub + '   ', { size: 15, ls: 0.18 }), y + 72, { size: 15, color: mix(color, '#ffffff', 0.4), ls: 0.06 })
}

// ---------------------------------------------------------------- captions

const CAP = { size: 25, y: 676, maxW: 1000 }

/**
 * The caption bar: speaker's name in their colour, then the line with the word being said lit.
 * cap = show.captionNow
 */
export function caption(ctx, cap, lift = 0) {
  if (!cap || cap.alpha <= 0.01) return
  const a = cap.alpha
  const tokens = cap.words?.length ? cap.words.map((w) => w[2]) : String(cap.text).split(/\s+/)
  const o = { size: CAP.size, ls: 0.06 }
  // break into lines
  const lines = []
  let cur = [], curW = 0
  const space = labelWidth(ctx, ' ', o)
  tokens.forEach((tok, i) => {
    const w = labelWidth(ctx, tok, o)
    if (cur.length && curW + space + w > CAP.maxW) {
      lines.push(cur)
      cur = []
      curW = 0
    }
    cur.push({ tok, i, w })
    curW += (cur.length > 1 ? space : 0) + w
  })
  if (cur.length) lines.push(cur)
  // show two lines at a time: the pair holding the current word
  const wi = cap.word < 0 ? 0 : cap.word
  let li = lines.findIndex((l) => l.some((x) => x.i === wi))
  if (li < 0) li = cap.done ? lines.length - 1 : 0
  const first = Math.max(0, Math.min(lines.length - 2, li - (li % 2)))
  const shown = lines.slice(first, first + 2)
  const lh = CAP.size * 1.32
  const widths = shown.map((l) => l.reduce((s, x, k) => s + x.w + (k ? space : 0), 0))
  const maxw = Math.max(...widths)
  const name = String(cap.name ?? '').toUpperCase()
  const nameW = name ? labelWidth(ctx, name, { size: 14, weight: 'm', ls: 0.2 }) : 0
  const bw = Math.max(maxw, nameW) + 56
  const bh = shown.length * lh + 40
  const bx = 640 - bw / 2, by = CAP.y - bh + 30 - lift
  box(ctx, bx, by, bw, bh, { color: cap.color ?? P.blue, cut: 8, width: 1.2, alpha: 0.6 * a, fillAlpha: 0.92 * a })
  if (name) {
    occlude(ctx, rectPath(bx + 18, by - 9, nameW + 20, 18), '#000', a)
    label(ctx, name, bx + 28, by + 5, { size: 14, weight: 'm', color: cap.color ?? P.blue, ls: 0.2, alpha: a })
  }
  shown.forEach((l, k) => {
    let x = 640 - widths[k] / 2
    const y = by + 30 + k * lh + CAP.size * 0.55
    for (const it of l) {
      const said = cap.words ? it.i < wi || (it.i === wi && cap.word >= 0) : true
      const now = cap.words && it.i === wi && cap.word >= 0 && !cap.done
      const col = now ? cap.color ?? P.amber : P.white
      label(ctx, it.tok, x, y, { ...o, color: col, alpha: a * (said ? 1 : 0.5), weight: now ? 'm' : 'l' })
      if (now) seg(ctx, x, y + 7, x + it.w, y + 7, col, 2, { hot: true, alpha: a })
      x += it.w + space
    }
  })
}

/** "[ LAUGHTER ]" in the caption bar when the room is laughing and nobody's talking */
export function laughCaption(ctx, text, a, lift = 0) {
  ctx.save()
  ctx.translate(0, -lift)
  if (a <= 0.02) return
  const s = `[ ${text} ]`
  const w = labelWidth(ctx, s, { size: 20, ls: 0.3 }) + 50
  box(ctx, 640 - w / 2, 640, w, 44, { color: P.amber, cut: 8, width: 1.2, alpha: 0.6 * a, fillAlpha: 0.75 * a })
  label(ctx, s, 640, 669, { size: 20, align: 'center', color: P.amber, ls: 0.3, alpha: a })
  ctx.restore()
}

// ---------------------------------------------------------------- the BUILT counter, the disclaimer

/**
 * The episode-long runner, top-left: "BUILT DURING THIS EPISODE · n". b = show.builtNow
 * ({ n, age: seconds since the last bump, seed }); a bump pops the number, flashes, and throws confetti.
 */
export function builtCounter(ctx, b, t) {
  const x = 26, y = 24
  const pop = b.age >= 0 && b.age < 0.6 ? Math.sin(Math.PI * Math.min(1, b.age / 0.6)) : 0
  const flash = b.age >= 0 && b.age < 0.9 ? 1 - b.age / 0.9 : 0
  const head = 'BUILT DURING THIS EPISODE'
  const hw = labelWidth(ctx, head, { size: 12, ls: 0.24 })
  const w = hw + 70
  box(ctx, x, y, w, 34, { color: flash > 0 ? mix(P.lime, '#ffffff', flash * 0.5) : P.lime, cut: 6, width: 1.2 + flash * 1.4, alpha: 0.75 + 0.25 * flash, hot: flash > 0.3, fillAlpha: 0.8 })
  label(ctx, head, x + 12, y + 22, { size: 12, color: P.lime, ls: 0.24, alpha: 0.9 })
  const nx = x + 12 + hw + 30
  ctx.save()
  ctx.translate(nx, y + 17)
  ctx.scale(1 + 0.6 * pop, 1 + 0.6 * pop)
  label(ctx, String(b.n), 0, 8, { size: 22, align: 'center', color: flash > 0.2 ? P.white : P.lime, weight: 'm', ls: 0 })
  ctx.restore()
  if (b.age >= 0 && b.age < 1.5) confetti(ctx, nx, y + 14, b.age, { seed: b.seed, count: 18, spread: 0.55 })
}

/** a one-line footer (segment `disclaimer`) along the bottom edge; captions lift above it */
export function disclaimer(ctx, text, a) {
  const s = String(text)
  const w = labelWidth(ctx, s, { size: 13, ls: 0.12 }) + 36
  box(ctx, 640 - w / 2, 686, w, 26, { color: P.blueMid, cut: 5, width: 1, alpha: 0.6 * a, fillAlpha: 0.8 * a })
  label(ctx, s, 640, 704, { size: 13, align: 'center', color: P.white, ls: 0.12, alpha: 0.85 * a })
}
