// Sheet → ReliefPanel: the height-map recipe of research/01 §8 step 7.
//
//   relief (Loehr V): plateau +motif (flat; `crown` domes it a little, V-b),
//     contour-echo grooves inset from every outline (§3.3, from the plateau's
//     own distance field, so they follow every join), centre lines on long
//     bands, explicit line work, then L2 bosses (domed eyes) and pupil cuts.
//   flush (Loehr IV): the motif stays in the ground plane (lifted a hair so
//     the leiwen packer sees it), outlined by a groove of the line weight; the
//     ground's finer, denser spirals are what tell it apart.

import { PROFILES } from '../../panel.js'
import { drawShape, mapShape, strokeLine, polyLength, trim } from '../../shapes.js'

const FLUSH_LIFT = 0.12 // mm: invisible at any viewing distance, enough for fillGround's 'raised' test

/** Paint every plateau island; dissolved masks erase a gap around each island first. */
function plateauDraw(C, shapes) {
  const f = C.f
  const gap = C.dissolved ? Math.max(C.u(0.03), C.lw * 2.2) : 0
  return (ctx) => {
    ctx.save()
    f.apply(ctx)
    clipHalf(ctx, C)
    for (const isl of shapes) {
      if (gap) {
        ctx.globalCompositeOperation = 'destination-out'
        for (const s of isl.shapes) drawShape(ctx, s, gap)
        ctx.globalCompositeOperation = 'source-over'
      }
      for (const s of isl.shapes) drawShape(ctx, s, 0)
    }
    ctx.restore()
  }
}

/** Creature-space clip: from just across the axis to the panel's (tapered) outer edge. */
function clipHalf(ctx, C) {
  const f = C.f
  const H = f.H
  ctx.beginPath()
  ctx.moveTo(-C.ext, 0)
  ctx.lineTo(f.widthAt(0), 0)
  ctx.lineTo(f.widthAt(H), H)
  ctx.lineTo(-C.ext, H)
  ctx.closePath()
  ctx.clip()
}

const grooveX = (x, hw) => (Math.abs(x) >= hw ? 0 : Math.sqrt(1 - (x / hw) * (x / hw)))

/**
 * Render a filled Sheet into the panel (left half of C.rect; the caller mirrors).
 * Exported so an artifact can build a Sheet by hand with taotieParts.
 */
export function renderTaotie(panel, C) {
  const p = C.p
  const f = C.f
  const S = C.sheet
  const flush = p.style === 'flush'
  const lvl = p.relief
  const lw = p.lineWeight
  const motifH = flush ? FLUSH_LIFT : lvl.motif
  const carving = p.carving || 'dense'
  const warp = f.taper ? (pt) => f.warp(pt) : null
  const W = (s) => (warp ? mapShape(s, warp) : s)
  const islands = S.islands.map((i) => ({ id: i.id, shapes: i.shapes.map(W) }))
  const bosses = S.bosses.map((b) => ({ ...b, shape: W(b.shape) }))
  const tips = S.tips.map((t) => ({ ...t, shape: W(t.shape) }))
  const cuts = S.cuts.map(W)
  const grooves = S.grooves.map((g) => ({ ...g, pts: warp ? g.pts.map(warp) : g.pts }))
  const centres = S.centres.map((g) => ({ ...g, pts: warp ? g.pts.map(warp) : g.pts }))

  // 1. L1 plateau (V-b: a crowned top)
  const shoulder = flush ? 0.08 : Math.max(0.22, Math.min(0.55, motifH * 0.42))
  const crown = flush ? 0 : p.crown || 0
  const crownW = Math.max(1.5, C.bw * 0.45)
  const plateauProfile = crown
    ? (s, w) => PROFILES.plateau(s, w) * (1 - crown + crown * Math.min(1, s / crownW))
    : 'plateau'
  const paint = plateauDraw(C, islands)
  panel.raise(paint, { height: motifH, shoulder, profile: plateauProfile })

  // 1b. high-relief horn tips (monumental V-b)
  if (!flush && tips.length) {
    for (const t of tips) {
      const h = motifH + t.lift * Math.max(0, lvl.boss - motifH) * 0.7
      panel.raise((ctx) => {
        ctx.save()
        f.apply(ctx)
        clipHalf(ctx, C)
        drawShape(ctx, t.shape)
        ctx.restore()
      }, { height: h, shoulder: Math.max(0.6, C.bw * 0.35), profile: 'plateau' })
    }
  }

  // 2. line work on the plateau
  const e = p.echoInset ?? 1.4
  const ghw = lw / 2
  if (flush) {
    // the reserved band's outline: one groove of the line weight just inside the edge
    panel.sink(paint, { depth: lvl.groove, profile: (s) => grooveX(s - ghw * 1.1, ghw) })
  } else if (carving === 'dense') {
    const e2 = e + Math.max(lw * 2.6, 1.6)
    panel.sink(paint, { depth: lvl.groove, profile: (s) => Math.max(grooveX(s - e, ghw), grooveX(s - e2, ghw)) })
  } else if (carving === 'sparse') {
    panel.sink(paint, { depth: lvl.groove * 0.8, profile: (s) => grooveX(s - e, ghw) })
  }

  // centre lines: only where the echo does not already run down the middle
  const lines = []
  for (const g of grooves) if (!g.boss) lines.push(g.pts)
  if (carving !== 'none') {
    for (const c of centres) {
      const hb = c.w / 2
      let want
      if (flush) want = carving === 'dense' && hb > lw * 2.6
      else if (c.force) want = true
      else if (carving === 'dense') want = hb > e * 2 + lw * 1.5 || (hb < e - lw * 0.9 && hb > lw * 1.6)
      else want = false
      if (!want) continue
      const L = polyLength(c.pts)
      const cut = Math.min(hb * 1.2, L * 0.3)
      const pts = trim(c.pts, cut, cut)
      if (pts.length > 1) lines.push(pts)
    }
  }
  if (lines.length) {
    panel.sink((ctx) => {
      ctx.save()
      f.apply(ctx)
      clipHalf(ctx, C)
      for (const pts of lines) strokeLine(ctx, pts, lw)
      ctx.restore()
    }, { depth: lvl.groove, shoulder: ghw, profile: 'u' })
  }

  // 3. L2 bosses: domes standing on the plateau (or on the ground)
  for (const b of bosses) {
    const r = Math.max(0.5, b.r ?? 2)
    const base = b.base === 'plateau' ? Math.min(0.95, motifH / Math.max(lvl.boss, 1e-3)) : 0.3
    const H = flush ? Math.max(lvl.boss, motifH) : Math.max(lvl.boss, motifH * 1.2)
    const wall = Math.max(0.3, Math.min(0.6, r * 0.12))
    panel.raise((ctx) => {
      ctx.save()
      f.apply(ctx)
      drawShape(ctx, b.shape)
      ctx.restore()
    }, {
      height: H,
      shoulder: r,
      profile: (s, w) => {
        if (s <= 0) return 0
        const t = Math.min(1, s / w)
        const dome = Math.sqrt(1 - (1 - t) * (1 - t))
        return PROFILES.plateau(s, wall) * (base + (1 - base) * dome)
      },
    })
  }

  // 4. pupils and boss rings cut into the bosses
  const bossLines = grooves.filter((g) => g.boss)
  if (cuts.length || bossLines.length) {
    panel.sink((ctx) => {
      ctx.save()
      f.apply(ctx)
      for (const c of cuts) drawShape(ctx, c)
      for (const g of bossLines) strokeLine(ctx, g.pts, lw)
      ctx.restore()
    }, { depth: lvl.groove * 1.4, shoulder: lw * 0.45, profile: 'u' })
  }
}
