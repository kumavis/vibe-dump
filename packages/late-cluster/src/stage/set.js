// The studio: reusable vector set pieces drawn in WORLD coordinates (a 2000 × 1125 studio floor
// plan seen from the audience; the wide shot shows all of it). Shots are camera framings of this
// world. Layout, left to right:
//
//   x   40 – 700   the bandstand (Hy Oid & The Formants), the announcer's mic at its right end
//   x  760 – 1180  the curtain (monologue mark in front of it), the APPLAUSE sign above
//   x 1220 – 1960  the big window with the simcluster skyline, ON AIR light, the guest couch and
//                  chair, and Larry's desk (mug, desk mic, name plate)
//
// Back pieces draw before the puppets, front pieces (desk, chair arms, instruments) after them.
// Every piece is a function (ctx, S, show) where S is this module's prebuilt state; toggle pieces
// per segment with show.set.<piece> = false (see SET_PIECES).
import { beam, beamPts, seg, ring, dot, label, labelWidth, occlude, rectPath, roundPath, box, butterfly, P, mix, glowText } from '../kit/draw.js'
import { rng, noise1, clamp, smoothstep, ease } from '../kit/ease.js'
import { lectern, crow, keycap } from '../kit/props.js'

export const WORLD = { w: 2000, h: 1125, floor: 960 }

/** pieces a segment can hide: show.set.window = false */
export const SET_PIECES = ['truss', 'wall', 'window', 'curtain', 'bandstand', 'desk', 'chair', 'couch', 'onair', 'sign', 'floor', 'crow', 'eKey', 'dim']

const WIN = { x: 1220, y: 140, w: 740, h: 500 }
const CURTAIN = { x: 760, y: 110, w: 420, h: 850 }
export const DESK = { x: 1600, top: 728, w: 360 }
/** the giant PRESS E TO LEAVE key on the desk's front-left corner (world; `keycap` centre + scale) */
export const EKEY = { x: DESK.x + 34, y: DESK.top - 30, scale: 0.8 }
export const CHAIR = { x: 1475 }
export const COUCH = { x0: 1150, x1: 1400 }
export const BAND = { x0: 40, x1: 700, top: 800 }

// ---------------------------------------------------------------- prebuilt geometry

export function buildSet() {
  const r = rng('late-cluster-skyline')
  // the skyline: towers whose floors are clusters of nodes
  const hues = [P.bsky, P.sky, P.cyan, P.violet, P.magenta, P.gold]
  const towers = []
  let x = WIN.x + 14
  while (x < WIN.x + WIN.w - 40) {
    const w = r.range(34, 78)
    const h = r.range(110, 330) * (0.7 + 0.5 * Math.sin(((x - WIN.x) / WIN.w) * Math.PI))
    towers.push({ x, w, h: Math.min(h, WIN.h - 120), c: r.pick(hues), spire: r() < 0.3 })
    x += w + r.range(4, 18)
  }
  const nodes = []
  const edgesByColor = new Map()
  const addEdge = (c, a, b) => {
    if (!edgesByColor.has(c)) edgesByColor.set(c, new Path2D())
    const p = edgesByColor.get(c)
    p.moveTo(a.x, a.y)
    p.lineTo(b.x, b.y)
  }
  const bottom = WIN.y + WIN.h - 6
  const outline = new Path2D()
  for (const T of towers) {
    const cols = Math.max(2, Math.round(T.w / 20))
    const rows = Math.max(3, Math.round(T.h / 24))
    const grid = []
    for (let j = 0; j < rows; j++) {
      const row = []
      for (let i = 0; i < cols; i++) {
        const n = { x: T.x + ((i + 0.5) * T.w) / cols + r.range(-2, 2), y: bottom - 12 - (j * (T.h - 18)) / (rows - 1) + r.range(-2, 2), c: T.c, r: r.range(1.1, 2.4), ph: r.range(0, 20), on: r() < 0.82 }
        row.push(n)
        nodes.push(n)
      }
      grid.push(row)
    }
    for (let j = 0; j < rows; j++)
      for (let i = 0; i < cols; i++) {
        const n = grid[j][i]
        if (j + 1 < rows) addEdge(T.c, n, grid[j + 1][i])
        if (i + 1 < cols && r() < 0.5) addEdge(T.c, n, grid[j][i + 1])
        if (j + 1 < rows && i + 1 < cols && r() < 0.3) addEdge(T.c, n, grid[j + 1][i + 1])
      }
    const top = bottom - T.h - 4
    outline.moveTo(T.x - 3, bottom)
    outline.lineTo(T.x - 3, top)
    outline.lineTo(T.x + T.w + 3, top)
    outline.lineTo(T.x + T.w + 3, bottom)
    if (T.spire) {
      outline.moveTo(T.x + T.w / 2, top)
      outline.lineTo(T.x + T.w / 2, top - 30)
      T.beacon = { x: T.x + T.w / 2, y: top - 30 }
    }
    T.top = { x: T.x + T.w / 2, y: top }
  }
  // far skyline (a dim layer behind)
  const far = new Path2D()
  let fx = WIN.x
  far.moveTo(fx, bottom)
  while (fx < WIN.x + WIN.w) {
    const h = r.range(60, 190)
    const w = r.range(20, 50)
    far.lineTo(fx, bottom - h)
    far.lineTo(fx + w, bottom - h)
    fx += w
    far.lineTo(fx, bottom - r.range(30, 60))
  }
  far.lineTo(WIN.x + WIN.w, bottom)
  // the follow graph between rooftops: arcs that pulse
  const links = []
  for (let i = 0; i < 9; i++) {
    const a = r.pick(towers), b = r.pick(towers)
    if (a === b) continue
    links.push({ a: a.top, b: b.top, c: r.pick([P.bsky, P.sky, P.magenta]), ph: r.range(0, 1), sp: r.range(0.15, 0.35) })
  }
  const stars = []
  for (let i = 0; i < 70; i++) stars.push({ x: WIN.x + r.range(8, WIN.w - 8), y: WIN.y + r.range(8, WIN.h * 0.45), r: r.range(0.5, 1.4), ph: r.range(0, 9) })
  // audience heads (screen space)
  const aud = []
  for (let i = 0, x = -20; x < 1300; i++) {
    const w = r.range(54, 74)
    aud.push({ x: x + w / 2, w, h: r.range(46, 62), ph: r.range(0, 6), hair: r.int(4) })
    x += w * r.range(0.82, 1.0)
  }
  return { towers, nodes, edgesByColor, outline, far, links, stars, aud }
}

// ---------------------------------------------------------------- back pieces

function truss(ctx) {
  const y0 = 34, y1 = 64
  const p = new Path2D()
  p.moveTo(0, y0)
  p.lineTo(WORLD.w, y0)
  p.moveTo(0, y1)
  p.lineTo(WORLD.w, y1)
  for (let x = 0; x < WORLD.w; x += 30) {
    p.moveTo(x, y0)
    p.lineTo(x + 15, y1)
    p.lineTo(x + 30, y0)
  }
  beam(ctx, p, P.blueDim, 1, { alpha: 0.5 })
  // cans
  for (let x = 120; x < WORLD.w; x += 260) {
    const c = new Path2D()
    c.moveTo(x - 9, y1 + 4)
    c.lineTo(x + 9, y1 + 4)
    c.lineTo(x + 12, y1 + 30)
    c.lineTo(x - 12, y1 + 30)
    c.closePath()
    beam(ctx, c, P.blueMid, 1.1, { alpha: 0.7 })
    seg(ctx, x, y1, x, y1 + 4, P.blueMid, 1, { alpha: 0.7 })
  }
}

function wall(ctx) {
  const p = new Path2D()
  for (let x = 40; x < WORLD.w; x += 160) {
    if (x > CURTAIN.x - 10 && x < CURTAIN.x + CURTAIN.w + 10) continue
    if (x > WIN.x - 4 && x < WIN.x + WIN.w + 4) continue
    p.moveTo(x, 90)
    p.lineTo(x, WORLD.floor)
  }
  beam(ctx, p, P.blueDim, 1, { alpha: 0.18 })
  seg(ctx, 0, 690, CURTAIN.x, 690, P.blueDim, 1, { alpha: 0.2 })
}

function floor(ctx) {
  const F = WORLD.floor
  seg(ctx, 0, F, WORLD.w, F, P.blueMid, 1.4, { alpha: 0.8 })
  const p = new Path2D()
  const vx = 1000, vy = 380
  for (let x = -1600; x <= 3600; x += 160) {
    const tF = 1
    const xb = vx + (x - vx) * ((WORLD.h + 200 - vy) / (F - vy)) * tF
    p.moveTo(vx + (x - vx), F)
    p.lineTo(xb, WORLD.h + 200)
  }
  for (const y of [990, 1035, 1100]) {
    p.moveTo(0, y)
    p.lineTo(WORLD.w, y)
  }
  beam(ctx, p, P.blueDim, 1, { alpha: 0.32 })
}

function windowPiece(ctx, S, show) {
  const t = show.wall
  const { x, y, w, h } = WIN
  // sky: stars and a crescent moon
  for (const s of S.stars) dot(ctx, s.x, s.y, s.r, P.white, 0.25 + 0.35 * (0.5 + 0.5 * Math.sin(t * 1.3 + s.ph)))
  const mx = x + w * 0.82, my = y + 70
  const moon = new Path2D()
  moon.arc(mx, my, 26, -Math.PI * 0.62, Math.PI * 0.62, true)
  moon.arc(mx - 13, my, 22, Math.PI * 0.5, -Math.PI * 0.5, false)
  beam(ctx, moon, P.gold, 1.6, { hot: true, alpha: 0.85 })
  // far skyline, then the cluster towers
  beam(ctx, S.far, P.blueDim, 1, { alpha: 0.35 })
  beam(ctx, S.outline, P.blueDim, 1, { alpha: 0.45 })
  for (const [c, p] of S.edgesByColor) beam(ctx, p, c, 0.8, { alpha: 0.32 })
  for (const n of S.nodes) {
    if (!n.on) continue
    const tw = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * (0.7 + (n.ph % 1.3)) + n.ph))
    dot(ctx, n.x, n.y, n.r, n.c, tw * 0.9)
  }
  for (const T of S.towers) if (T.beacon) dot(ctx, T.beacon.x, T.beacon.y, 2.6, P.red, 0.4 + 0.6 * (Math.sin(t * 3 + T.x) > 0.6 ? 1 : 0.2))
  // the follow graph: arcs over the rooftops with a pulse running along each
  for (const L of S.links) {
    const mxl = (L.a.x + L.b.x) / 2, myl = Math.min(L.a.y, L.b.y) - 40 - Math.abs(L.a.x - L.b.x) * 0.18
    const p = new Path2D()
    p.moveTo(L.a.x, L.a.y)
    p.quadraticCurveTo(mxl, myl, L.b.x, L.b.y)
    beam(ctx, p, L.c, 0.9, { alpha: 0.28 })
    const u = (t * L.sp + L.ph) % 1
    const qx = (1 - u) * (1 - u) * L.a.x + 2 * (1 - u) * u * mxl + u * u * L.b.x
    const qy = (1 - u) * (1 - u) * L.a.y + 2 * (1 - u) * u * myl + u * u * L.b.y
    dot(ctx, qx, qy, 2.4, L.c, 0.9)
  }
  // the frame and mullions
  const f = new Path2D()
  f.rect(x, y, w, h)
  for (let i = 1; i < 4; i++) {
    f.moveTo(x + (w * i) / 4, y)
    f.lineTo(x + (w * i) / 4, y + h)
  }
  f.moveTo(x, y + h * 0.3)
  f.lineTo(x + w, y + h * 0.3)
  beam(ctx, f, P.blueMid, 1.6, { alpha: 0.9 })
  beam(ctx, rectPath(x - 10, y - 10, w + 20, h + 20), P.blueDim, 1.2, { alpha: 0.7 })
  // sill
  seg(ctx, x - 22, y + h + 12, x + w + 22, y + h + 12, P.blueMid, 1.4)
}

function curtain(ctx, S, show) {
  const t = show.wall
  const { x, y, w, h } = CURTAIN
  const col = '#ff3d6e'
  const n = 16
  const p = new Path2D()
  for (let i = 0; i <= n; i++) {
    const x0 = x + (w * i) / n
    const sway = 3 * noise1(t * 0.3 + i * 0.7, 3)
    p.moveTo(x0, y + 40)
    for (let yy = y + 40; yy <= y + h; yy += 20) {
      const fold = Math.sin(yy * 0.012 + i * 1.7) * 4 * (yy - y) / h
      p.lineTo(x0 + fold + sway * ((yy - y) / h), yy)
    }
  }
  beam(ctx, p, col, 1.2, { alpha: 0.55 })
  // shading folds: brighter every other
  const q = new Path2D()
  for (let i = 0; i < n; i++) {
    const x0 = x + (w * (i + 0.5)) / n
    q.moveTo(x0, y + 60)
    q.lineTo(x0 + Math.sin(i) * 3, y + h - 10)
  }
  beam(ctx, q, col, 0.8, { alpha: 0.22 })
  // valance with scallops and gold fringe
  const v = new Path2D()
  v.moveTo(x - 20, y)
  v.lineTo(x + w + 20, y)
  const k = 7
  for (let i = 0; i < k; i++) {
    const a = x - 20 + ((w + 40) * i) / k, b = x - 20 + ((w + 40) * (i + 1)) / k
    v.moveTo(a, y)
    v.quadraticCurveTo((a + b) / 2, y + 70, b, y)
  }
  occlude(ctx, v)
  beam(ctx, v, col, 1.6, { hot: true })
  const fr = new Path2D()
  for (let i = 0; i < k; i++) {
    const a = x - 20 + ((w + 40) * i) / k, b = x - 20 + ((w + 40) * (i + 1)) / k
    for (let j = 1; j < 12; j++) {
      const u = j / 12, xx = a + (b - a) * u
      const yy = y + 4 * 70 * u * (1 - u) * 0.5 * 2
      fr.moveTo(xx, yy)
      fr.lineTo(xx, yy + 8)
    }
  }
  beam(ctx, fr, P.gold, 1, { alpha: 0.8 })
  // the spot on the floor at the monologue mark
  const sp = new Path2D()
  sp.ellipse(970, WORLD.floor + 6, 120, 16, 0, 0, Math.PI * 2)
  beam(ctx, sp, P.gold, 1.4, { alpha: 0.6 })
  const sp2 = new Path2D()
  sp2.ellipse(970, WORLD.floor + 6, 80, 10, 0, 0, Math.PI * 2)
  beam(ctx, sp2, P.gold, 1, { alpha: 0.35 })
}

function onAir(ctx, S, show) {
  const x = 1250, y = 82, w = 120, h = 38
  const lit = show.onAir ? 1 : 0.18
  box(ctx, x, y, w, h, { color: P.onair, radius: 6, width: 1.6, alpha: 0.4 + 0.6 * lit, hot: lit > 0.5 })
  label(ctx, 'ON AIR', x + w / 2, y + 26, { size: 19, align: 'center', color: P.onair, alpha: lit, weight: 'm', ls: 0.25 })
  seg(ctx, x + w / 2, 64, x + w / 2, y, P.blueDim, 1)
}

/** the APPLAUSE / LAUGH sign hung above the curtain */
function sign(ctx, S, show) {
  const x = 970, y = 64, w = 250, h = 46
  const lv = show.laughing
  const kind = show.signText
  const flash = lv > 0 ? 0.55 + 0.45 * (Math.sin(show.wall * 9) > -0.2 ? 1 : 0) : 0
  const lit = clamp(lv * flash)
  box(ctx, x - w / 2, y, w, h, { color: P.amber, cut: 8, width: 1.6, alpha: 0.35 + 0.65 * lit, hot: lit > 0.5 })
  label(ctx, kind, x, y + 32, { size: 24, align: 'center', color: P.amber, alpha: 0.15 + 0.85 * lit, weight: 'm', ls: 0.3 })
  seg(ctx, x - w / 2 + 20, 64, x - w / 2 + 20, y, P.blueDim, 1)
  seg(ctx, x + w / 2 - 20, 64, x + w / 2 - 20, y, P.blueDim, 1)
}

function bandstandBack(ctx, S, show) {
  const { x0, x1, top } = BAND
  // two-tier riser
  const p = new Path2D()
  p.rect(x0, top, x1 - x0, WORLD.floor - top)
  p.moveTo(x0 + 220, top - 60)
  p.lineTo(x1 - 220, top - 60)
  p.lineTo(x1 - 220, top)
  p.moveTo(x0 + 220, top - 60)
  p.lineTo(x0 + 220, top)
  occlude(ctx, p)
  beam(ctx, p, P.magenta, 1.4, { alpha: 0.75 })
  // riser front: lights that chase on the beat
  const b = show.music ? show.music.beat : -1
  for (let i = 0; i < 14; i++) {
    const lx = x0 + 24 + ((x1 - x0 - 48) * i) / 13
    const on = b >= 0 ? ((Math.floor(b) + i) % 4 === 0 ? 1 : 0.25) : 0.3 + 0.2 * Math.sin(show.wall * 1.5 + i)
    dot(ctx, lx, top + 22, 3, i % 2 ? P.gold : P.magenta, on)
  }
  // stripes
  const s = new Path2D()
  for (let y = top + 50; y < WORLD.floor; y += 26) {
    s.moveTo(x0, y)
    s.lineTo(x1, y)
  }
  beam(ctx, s, P.magenta, 0.8, { alpha: 0.25 })
}

function chairBack(ctx) {
  const x = CHAIR.x
  const p = roundPath(x - 80, 560, 160, 230, 40)
  occlude(ctx, p)
  beam(ctx, p, P.violet, 1.6, { alpha: 0.9 })
  // tufting
  const q = new Path2D()
  for (const [dx, dy] of [[-40, 620], [0, 610], [40, 620], [-40, 680], [0, 670], [40, 680]]) {
    q.moveTo(x + dx - 3, dy)
    q.lineTo(x + dx + 3, dy)
  }
  beam(ctx, q, P.violet, 1.2, { alpha: 0.5 })
}

function couchBack(ctx) {
  const { x0, x1 } = COUCH
  const p = roundPath(x0, 610, x1 - x0, 180, 30)
  occlude(ctx, p)
  beam(ctx, p, P.cyan, 1.5, { alpha: 0.75 })
  const q = new Path2D()
  q.moveTo((x0 + x1) / 2, 625)
  q.lineTo((x0 + x1) / 2, 780)
  beam(ctx, q, P.cyan, 1, { alpha: 0.35 })
}

// ---------------------------------------------------------------- front pieces

function desk(ctx, S, show) {
  const { x, top, w } = DESK
  const F = WORLD.floor
  // top surface
  const surf = new Path2D()
  surf.moveTo(x + 20, top - 22)
  surf.lineTo(x + w - 10, top - 22)
  surf.lineTo(x + w, top)
  surf.lineTo(x, top)
  surf.closePath()
  occlude(ctx, surf)
  beam(ctx, surf, P.gold, 1.6, { hot: true })
  // front panel
  const front = new Path2D()
  front.moveTo(x, top)
  front.lineTo(x + w, top)
  front.lineTo(x + w - 14, F)
  front.lineTo(x + 14, F)
  front.closePath()
  occlude(ctx, front)
  beam(ctx, front, P.gold, 1.6)
  const inset = new Path2D()
  inset.moveTo(x + 30, top + 22)
  inset.lineTo(x + w - 30, top + 22)
  inset.lineTo(x + w - 40, F - 22)
  inset.lineTo(x + 40, F - 22)
  inset.closePath()
  beam(ctx, inset, P.goldMid, 1, { alpha: 0.55 })
  // the show's emblem on the desk front: a small cluster in a ring
  const ex = x + w / 2, ey = top + 120
  ring(ctx, ex, ey, 46, P.gold, 1.4, { alpha: 0.7 })
  ring(ctx, ex, ey, 40, P.gold, 0.9, { alpha: 0.35 })
  const em = [[0, -18], [16, -6], [10, 14], [-12, 12], [-18, -8], [0, 0]]
  const ep = new Path2D()
  for (const [i, j] of [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [5, 0], [5, 2], [5, 3], [5, 1]]) {
    ep.moveTo(ex + em[i][0], ey + em[i][1])
    ep.lineTo(ex + em[j][0], ey + em[j][1])
  }
  beam(ctx, ep, P.gold, 1, { alpha: 0.6 })
  for (const [dx, dy] of em) dot(ctx, ex + dx, ey + dy, 2.6, P.gold, 0.9)
  label(ctx, 'LC', ex, ey + 74, { size: 16, align: 'center', color: P.gold, alpha: 0.6, ls: 0.4 })

  // the mug (right of the E key's corner): steam curls rise from it
  const mx = x + 96, my = top - 14
  const mug = new Path2D()
  mug.moveTo(mx - 15, my - 40)
  mug.lineTo(mx - 13, my)
  mug.lineTo(mx + 13, my)
  mug.lineTo(mx + 15, my - 40)
  mug.closePath()
  occlude(ctx, mug)
  beam(ctx, mug, P.sky, 1.5)
  const rim = new Path2D()
  rim.ellipse(mx, my - 40, 15, 4, 0, 0, Math.PI * 2)
  beam(ctx, rim, P.sky, 1.2)
  const hd = new Path2D()
  hd.moveTo(mx + 14, my - 32)
  hd.bezierCurveTo(mx + 30, my - 32, mx + 30, my - 10, mx + 13, my - 10)
  beam(ctx, hd, P.sky, 1.4)
  butterfly(ctx, mx, my - 20, 14, P.bsky, { width: 1, hot: false })
  const tt = show.wall
  for (let i = 0; i < 2; i++) {
    const st = new Path2D()
    const ph = tt * 0.8 + i * 1.7
    for (let k = 0; k <= 12; k++) {
      const u = k / 12
      const sx = mx - 4 + i * 8 + Math.sin(ph * 2 + u * 6) * 4 * u
      const sy = my - 46 - u * 44
      k ? st.lineTo(sx, sy) : st.moveTo(sx, sy)
    }
    beam(ctx, st, P.white, 1, { alpha: 0.3 * (0.6 + 0.4 * Math.sin(ph)) })
  }

  // the desk mic: base, gooseneck, capsule aimed at the host
  const dx = x + w - 34, dy = top - 14
  const base = new Path2D()
  base.ellipse(dx, dy, 22, 6, 0, 0, Math.PI * 2)
  occlude(ctx, base)
  beam(ctx, base, P.white, 1.3, { alpha: 0.85 })
  const neck = new Path2D()
  neck.moveTo(dx, dy - 4)
  neck.bezierCurveTo(dx + 2, dy - 34, dx - 10, dy - 52, dx - 30, dy - 58)
  beam(ctx, neck, P.white, 1.4, { alpha: 0.8 })
  const cap = new Path2D()
  cap.ellipse(dx - 40, dy - 61, 13, 7.5, -0.35, 0, Math.PI * 2)
  occlude(ctx, cap)
  beam(ctx, cap, P.white, 1.5, { hot: true })
  for (let k = -2; k <= 2; k++) seg(ctx, dx - 40 + k * 4 - 2, dy - 67 + k * 1.3, dx - 40 + k * 4 + 2, dy - 55 + k * 1.3, P.white, 0.8, { alpha: 0.5 })

  // the name plate, on the desk's front edge
  const nx = x + w / 2 + 10, ny = top - 4
  const plate = new Path2D()
  plate.moveTo(nx - 70, ny)
  plate.lineTo(nx + 70, ny)
  plate.lineTo(nx + 62, ny - 30)
  plate.lineTo(nx - 62, ny - 30)
  plate.closePath()
  occlude(ctx, plate)
  beam(ctx, plate, P.gold, 1.4, { hot: true })
  label(ctx, show.nameplate ?? 'LARRY NX', nx, ny - 9, { size: 15, align: 'center', color: P.gold, weight: 'm', ls: 0.22 })
  // blue cards, squared up on the corner (unless the E key sits there)
  if ((show.setNow ?? show.set).eKey) return
  const cards = new Path2D()
  cards.moveTo(x + 22, top - 6)
  cards.lineTo(x + 72, top - 6)
  cards.lineTo(x + 68, top - 14)
  cards.lineTo(x + 26, top - 14)
  cards.closePath()
  beam(ctx, cards, P.bsky, 1.1, { alpha: 0.8 })
}

function chairFront(ctx) {
  const x = CHAIR.x
  const p = new Path2D()
  // arms
  for (const s of [-1, 1]) {
    const a = roundPath(x + s * 90 - 22, 720, 44, 120, 16)
    occlude(ctx, a)
    beam(ctx, a, P.violet, 1.5)
  }
  // seat cushion and skirt
  p.moveTo(x - 70, 790)
  p.lineTo(x + 70, 790)
  p.lineTo(x + 76, 860)
  p.lineTo(x - 76, 860)
  p.closePath()
  occlude(ctx, p)
  beam(ctx, p, P.violet, 1.5)
  const legs = new Path2D()
  for (const s of [-1, 1]) {
    legs.moveTo(x + s * 96, 840)
    legs.lineTo(x + s * 104, WORLD.floor)
  }
  beam(ctx, legs, P.violet, 1.4, { alpha: 0.8 })
}

function couchFront(ctx) {
  const { x0, x1 } = COUCH
  const p = new Path2D()
  p.moveTo(x0 - 10, 780)
  p.lineTo(x1 + 10, 780)
  p.lineTo(x1 + 16, 870)
  p.lineTo(x0 - 16, 870)
  p.closePath()
  occlude(ctx, p)
  beam(ctx, p, P.cyan, 1.5, { alpha: 0.85 })
  for (const s of [x0 - 20, x1 - 16]) {
    const a = roundPath(s, 700, 36, 150, 14)
    occlude(ctx, a)
    beam(ctx, a, P.cyan, 1.4, { alpha: 0.85 })
  }
  seg(ctx, (x0 + x1) / 2, 790, (x0 + x1) / 2, 865, P.cyan, 1, { alpha: 0.4 })
  const legs = new Path2D()
  for (const s of [x0, x1]) {
    legs.moveTo(s, 870)
    legs.lineTo(s, WORLD.floor)
  }
  beam(ctx, legs, P.cyan, 1.3, { alpha: 0.7 })
}

/** the instruments sit in front of the band (drawn per mark so they follow the players) */
export function drawInstrument(ctx, kind, x, y, show, who) {
  const t = show.wall
  const beatPulse = show.music ? show.music.pulse : 0
  if (kind === 'lectern') {
    const top = y + 150
    lectern(ctx, x, top, { w: 130, h: WORLD.floor - top, color: P.violet, label: show.lecternLabel ?? 'THE LATE CLUSTER', labelColor: P.gold })
    seg(ctx, x - 20, top - 2, x - 34, top - 40, P.white, 1.3, { alpha: 0.8 })
    ring(ctx, x - 36, top - 44, 5, P.white, 1.3, { hot: true })
    return
  }
  if (kind === 'stand') {
    const top = y + 160
    const name = who ? (show.puppets.get(who)?.name ?? who) : ''
    lectern(ctx, x, top, { w: 150, h: WORLD.floor - top, color: P.cyan, label: name, labelColor: P.white, lights: true, t })
    return
  }
  if (kind === 'sportsdesk') {
    const top = y + 128
    const w = 460
    const p = new Path2D()
    p.moveTo(x - w / 2, top)
    p.lineTo(x + w / 2, top)
    p.lineTo(x + w / 2 - 20, WORLD.floor)
    p.lineTo(x - w / 2 + 20, WORLD.floor)
    p.closePath()
    occlude(ctx, p)
    beam(ctx, p, P.coral, 1.8, { hot: true })
    seg(ctx, x - w / 2 + 10, top + 30, x + w / 2 - 10, top + 30, P.coral, 1, { alpha: 0.6 })
    label(ctx, 'SPORTS', x, top + 78, { size: 40, align: 'center', color: P.coral, weight: 'm', ls: 0.3 })
    label(ctx, 'THE LATE CLUSTER', x, top + 106, { size: 14, align: 'center', color: P.gold, ls: 0.4 })
    for (let i = 0; i < 9; i++) dot(ctx, x - 180 + i * 45, top + 16, 3, i % 2 ? P.gold : P.coral, 0.4 + 0.6 * (Math.floor(t * 3 + i) % 3 === 0 ? 1 : 0.3))
    return
  }
  if (kind === 'keys') {
    // a synth on an X stand at waist height
    const ky = y + 128
    const kb = new Path2D()
    kb.moveTo(x - 78, ky)
    kb.lineTo(x + 78, ky)
    kb.lineTo(x + 84, ky + 20)
    kb.lineTo(x - 84, ky + 20)
    kb.closePath()
    occlude(ctx, kb)
    beam(ctx, kb, P.magenta, 1.5)
    const keys = new Path2D()
    for (let i = -10; i <= 10; i++) {
      keys.moveTo(x + i * 7.4, ky + 6)
      keys.lineTo(x + i * 7.8, ky + 19)
    }
    beam(ctx, keys, P.white, 0.8, { alpha: 0.55 })
    for (let i = 0; i < 4; i++) dot(ctx, x - 66 + i * 9, ky + 3, 1.4, [P.green, P.amber, P.red, P.cyan][i], 0.5 + 0.5 * beatPulse)
    const st = new Path2D()
    st.moveTo(x - 50, ky + 20)
    st.lineTo(x + 44, WORLD.floor - 160)
    st.moveTo(x + 50, ky + 20)
    st.lineTo(x - 44, WORLD.floor - 160)
    beam(ctx, st, P.magenta, 1.2, { alpha: 0.8 })
  } else if (kind === 'bass') {
    // an electric bass slung across the body: double-cutaway body, long neck up to the right
    const bx = x - 14, by = y + 150
    const g = new Path2D()
    g.moveTo(bx - 30, by - 4)
    g.bezierCurveTo(bx - 36, by - 30, bx - 10, by - 34, bx + 2, by - 22)
    g.bezierCurveTo(bx + 10, by - 40, bx + 30, by - 36, bx + 22, by - 18)
    g.bezierCurveTo(bx + 40, by - 2, bx + 34, by + 30, bx + 4, by + 32)
    g.bezierCurveTo(bx - 26, by + 34, bx - 40, by + 18, bx - 30, by - 4)
    g.closePath()
    occlude(ctx, g)
    beam(ctx, g, P.cyan, 1.6, { hot: true })
    const nk = new Path2D()
    const ang = -0.72, len = 128
    const ca = Math.cos(ang), sa = Math.sin(ang)
    const nx0 = bx + 8, ny0 = by - 12
    nk.moveTo(nx0 - sa * 4, ny0 + ca * 4)
    nk.lineTo(nx0 + ca * len - sa * 4, ny0 + sa * len + ca * 4)
    nk.lineTo(nx0 + ca * (len + 22) - sa * 6, ny0 + sa * (len + 22) + ca * 6)
    nk.lineTo(nx0 + ca * (len + 22) + sa * 6, ny0 + sa * (len + 22) - ca * 6)
    nk.lineTo(nx0 + ca * len + sa * 4, ny0 + sa * len - ca * 4)
    nk.lineTo(nx0 + sa * 4, ny0 - ca * 4)
    occlude(ctx, nk)
    beam(ctx, nk, P.cyan, 1.3)
    for (let i = -1.5; i <= 1.5; i++) seg(ctx, bx - 14 - sa * i * 2, by + 14 + ca * i * 2, nx0 + ca * len - sa * i * 2, ny0 + sa * len + ca * i * 2, P.white, 0.6, { alpha: 0.35 + 0.45 * beatPulse })
    seg(ctx, bx - 6, by + 4, bx + 10, by - 10, P.white, 1.6, { alpha: 0.6 })
  } else if (kind === 'mic') {
    // a stand mic beside the singer's face
    const mx = x - 52, my = y + 34
    const m = new Path2D()
    m.moveTo(mx - 20, WORLD.floor - 160)
    m.lineTo(mx - 20, my + 50)
    m.lineTo(mx - 2, my + 6)
    beam(ctx, m, P.white, 1.4, { alpha: 0.8 })
    const c = new Path2D()
    c.ellipse(mx, my, 8, 5.5, -1.1, 0, Math.PI * 2)
    occlude(ctx, c)
    beam(ctx, c, P.white, 1.4, { hot: true })
  } else if (kind === 'drums') {
    // the kit; the bass drum carries the band's name
    const r = 92, cx = x, cy = WORLD.floor - 160 - r + 4
    const hit = beatPulse
    for (const s of [-1, 1]) {
      const tom = new Path2D()
      tom.ellipse(x + s * 70, cy - r - 10, 30, 12, 0, 0, Math.PI * 2)
      tom.moveTo(x + s * 70 - 30, cy - r - 10)
      tom.lineTo(x + s * 70 - 30, cy - r + 16)
      tom.moveTo(x + s * 70 + 30, cy - r - 10)
      tom.lineTo(x + s * 70 + 30, cy - r + 16)
      occlude(ctx, tom)
      beam(ctx, tom, P.gold, 1.3)
      const cym = new Path2D()
      cym.ellipse(x + s * 140, cy - r - 70 + (s > 0 ? hit * 3 : 0), 40, 6, s * 0.12, 0, Math.PI * 2)
      cym.moveTo(x + s * 140, cy - r - 64)
      cym.lineTo(x + s * 150, WORLD.floor - 160)
      beam(ctx, cym, P.gold, 1.2, { alpha: 0.8 + 0.2 * hit, hot: hit > 0.5 })
    }
    const d = new Path2D()
    d.arc(cx, cy, r, 0, Math.PI * 2)
    occlude(ctx, d)
    beam(ctx, d, P.magenta, 2, { hot: true })
    ring(ctx, cx, cy, r - 10, P.gold, 1.2, { alpha: 0.7 + 0.3 * hit })
    label(ctx, 'HY OID', cx, cy - 8, { size: 30, align: 'center', color: P.gold, weight: 'm', ls: 0.12 })
    label(ctx, '& THE FORMANTS', cx, cy + 22, { size: 14, align: 'center', color: P.magenta, weight: 'm', ls: 0.12 })
    // a formant curve under the name
    const fc = new Path2D()
    for (let i = 0; i <= 40; i++) {
      const u = i / 40
      const fy = cy + 48 - 14 * (Math.exp(-(((u - 0.25) / 0.07) ** 2)) + 0.7 * Math.exp(-(((u - 0.6) / 0.09) ** 2)) + 0.4 * Math.exp(-(((u - 0.85) / 0.05) ** 2))) * (0.8 + 0.4 * hit)
      i ? fc.lineTo(cx - 54 + u * 108, fy) : fc.moveTo(cx - 54, fy)
    }
    beam(ctx, fc, P.cyan, 1.2)
  }
}

/**
 * A prop that stands beside a puppet (look.prop). 'contraption': Abel's machine under a dust
 * sheet; params.unveil 0..1 whips the sheet off (it rises and flies away), params.run 0..1 sets it going.
 */
export function drawProp(ctx, kind, x, y, show, params = {}) {
  if (kind !== 'contraption') return
  const t = show.wall
  const bx = x, by = WORLD.floor
  const u = ease.inOutCubic(clamp(params.unveil ?? 0))
  const run = clamp(params.run ?? u)
  // the machine
  if (u > 0.02) {
    const g = new Path2D()
    g.rect(bx - 70, by - 120, 140, 120)
    occlude(ctx, g)
    beam(ctx, g, P.lime, 1.6)
    for (const [gx, gy, gr, dir] of [[bx - 32, by - 70, 26, 1], [bx + 18, by - 52, 18, -1]]) {
      ring(ctx, gx, gy, gr, P.gold, 1.4)
      const a0 = t * 2 * run * dir
      for (let k = 0; k < 8; k++) {
        const a = a0 + (k / 8) * Math.PI * 2
        seg(ctx, gx + Math.cos(a) * gr, gy + Math.sin(a) * gr, gx + Math.cos(a) * (gr + 6), gy + Math.sin(a) * (gr + 6), P.gold, 1.4)
      }
    }
    // a funnel, tubes and a lamp on a stalk
    const f = new Path2D()
    f.moveTo(bx + 30, by - 120)
    f.lineTo(bx + 60, by - 190)
    f.lineTo(bx + 0, by - 190)
    f.closePath()
    beam(ctx, f, P.cyan, 1.4)
    const tb = new Path2D()
    tb.moveTo(bx - 60, by - 120)
    tb.bezierCurveTo(bx - 90, by - 170, bx - 30, by - 200, bx - 20, by - 150)
    beam(ctx, tb, P.magenta, 1.6)
    seg(ctx, bx - 50, by - 120, bx - 50, by - 210, P.white, 1.2)
    ring(ctx, bx - 50, by - 218, 8, P.amber, 1.6, { hot: run > 0.5 && Math.floor(t * 4) % 2 === 0 })
    for (let i = 0; i < 4; i++) dot(ctx, bx + 40, by - 100 + i * 14, 3, [P.green, P.amber, P.red, P.cyan][i], run > 0 ? 0.4 + 0.6 * (Math.floor(t * 5 + i) % 4 === 0 ? 1 : 0.3) : 0.25)
    // a crank
    const ca = t * 3 * run
    seg(ctx, bx + 70, by - 60, bx + 70 + Math.cos(ca) * 22, by - 60 + Math.sin(ca) * 22, P.white, 1.6)
  }
  // the dust sheet: a draped shape that lifts and drifts off
  if (u < 0.98) {
    const lift = u * 260, drift = u * u * 220
    const sh = new Path2D()
    sh.moveTo(bx - 82 + drift, by - lift)
    sh.bezierCurveTo(bx - 90 + drift, by - 120 - lift, bx - 60 + drift, by - 235 - lift * 1.1, bx - 10 + drift, by - 230 - lift)
    sh.bezierCurveTo(bx + 40 + drift, by - 226 - lift, bx + 80 + drift, by - 160 - lift, bx + 84 + drift, by - lift)
    for (let i = 4; i >= 0; i--) sh.lineTo(bx - 82 + i * 41 + drift + (i % 2 ? 6 : -4) * (1 + u * 4), by - lift - (i % 2 ? 10 : 0) * (1 + u * 3))
    sh.closePath()
    if (u < 0.05) occlude(ctx, sh)
    beam(ctx, sh, P.white, 1.6, { alpha: 1 - u })
    const folds = new Path2D()
    for (const k of [-40, 0, 40]) {
      folds.moveTo(bx + k + drift * 0.9, by - 200 - lift)
      folds.quadraticCurveTo(bx + k * 1.3 + drift, by - 100 - lift, bx + k * 1.4 + drift, by - lift - 6)
    }
    beam(ctx, folds, P.white, 0.9, { alpha: 0.4 * (1 - u) })
    if (u < 0.05) label(ctx, '?', bx, by - 110, { size: 40, align: 'center', color: P.white, alpha: 0.5 })
  }
}

/** norvid's crow living on the set: 'circling' in the skyline window, true (on the sill), 'perched-desk' */
function setCrow(ctx, mode, show) {
  const t = show.wall
  if (mode === 'circling') {
    // circle in whatever part of the window this shot sees (a desk shot only sees its lower half),
    // a little below the top of the frame so it clears the BUILT counter and the APPLAUSE sign
    const a = t * 0.45
    const cam = show.cam ?? { x: 1000, y: 560, zoom: 1 }
    if (cam.zoom > 2.2) return // a head close-up: it would read as perched on the head
    const vx0 = Math.max(WIN.x, cam.x - 640 / cam.zoom), vx1 = Math.min(WIN.x + WIN.w, cam.x + 640 / cam.zoom)
    const top = cam.y - 360 / cam.zoom
    const cx = vx1 > vx0 ? (vx0 + vx1) / 2 : WIN.x + WIN.w * 0.55
    const rx = vx1 > vx0 ? Math.max(60, (vx1 - vx0) * 0.42) : 230
    const cy = Math.min(WIN.y + WIN.h - 110, Math.max(WIN.y + 150, top + (cam.zoom < 1.3 ? 72 : 140) / cam.zoom)) // wide/stage: above the lyric line
    const ry = Math.min(70, 34 / Math.max(0.5, cam.zoom) * 1.6)
    const x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * ry
    crow(ctx, x, y, { scale: 0.7, flap: (t * 2.2) % 1, facing: -Math.sin(a) >= 0 ? 1 : -1 })
  } else if (mode === 'perched-desk') {
    crow(ctx, DESK.x + DESK.w - 92, DESK.top - 33, { scale: 0.75, perched: true, facing: -1 })
  } else {
    const hop = Math.max(0, Math.sin(t * 1.3)) > 0.97 ? 6 : 0
    crow(ctx, WIN.x + 120, WIN.y + WIN.h + 12 - 22 - hop, { scale: 0.85, perched: true, facing: 1 })
  }
}

// ---------------------------------------------------------------- layers

export function drawSetBack(ctx, S, show) {
  const on = show.setNow ?? show.set
  if (on.wall !== false) wall(ctx)
  if (on.truss !== false) truss(ctx)
  if (on.floor !== false) floor(ctx)
  if (on.window !== false) windowPiece(ctx, S, show)
  if (on.curtain !== false) curtain(ctx, S, show)
  if (on.onair !== false) onAir(ctx, S, show)
  if (on.sign !== false) sign(ctx, S, show)
  if (on.bandstand !== false) bandstandBack(ctx, S, show)
  if (on.couch !== false) couchBack(ctx)
  if (on.chair !== false) chairBack(ctx)
  if (on.crow && on.crow !== 'perched-desk') setCrow(ctx, on.crow, show)
}

export function drawSetFront(ctx, S, show) {
  const on = show.setNow ?? show.set
  if (on.couch !== false) couchFront(ctx)
  if (on.chair !== false) chairFront(ctx)
  if (on.desk !== false) desk(ctx, S, show)
  if (on.desk !== false && on.eKey) keycap(ctx, EKEY.x, EKEY.y, { label: 'E', scale: EKEY.scale, glow: 0.4 + 0.3 * Math.sin(show.wall * 3), pressed: typeof on.eKey === 'number' ? on.eKey : 0 })
  if (on.crow === 'perched-desk') setCrow(ctx, on.crow, show)
}

// ---------------------------------------------------------------- screen-space extras

/** the front row of the audience: head-and-shoulder silhouettes along the bottom edge, bobbing on laughs */
export function drawAudience(ctx, S, show, alpha = 1) {
  if (alpha <= 0) return
  const lv = show.laughing
  const t = show.wall
  const base = 724
  const p = new Path2D()
  for (const a of S.aud) {
    const bob = lv * (5 + 4 * Math.sin(t * 11 + a.ph)) + 1.2 * Math.sin(t * 0.8 + a.ph)
    const hx = a.x, hy = base - a.h + 6 - bob
    const hr = a.w * 0.26
    p.moveTo(hx - a.w * 0.5, base + 10)
    p.bezierCurveTo(hx - a.w * 0.5, hy + hr * 2.2, hx - a.w * 0.3, hy + hr * 1.6, hx - hr * 0.7, hy + hr * 1.4)
    p.arc(hx, hy, hr, Math.PI * 0.72, Math.PI * 0.28, false)
    p.bezierCurveTo(hx + a.w * 0.3, hy + hr * 1.6, hx + a.w * 0.5, hy + hr * 2.2, hx + a.w * 0.5, base + 10)
  }
  occlude(ctx, p, '#000', alpha)
  beam(ctx, p, P.blueMid, 1.1, { alpha: 0.6 * alpha })
}

/** in tight shots the APPLAUSE sign is out of frame: a small one at the top edge while it's lit */
export function drawSignOverlay(ctx, show) {
  const lv = show.laughing
  if (lv <= 0.02) return
  const flash = Math.sin(show.wall * 9) > -0.2 ? 1 : 0.55
  const w = 190, x = 640 - w / 2, y = 18
  box(ctx, x, y, w, 36, { color: P.amber, cut: 6, width: 1.5, alpha: lv * flash, hot: true })
  label(ctx, show.signText, 640, y + 26, { size: 19, align: 'center', color: P.amber, alpha: lv * flash, weight: 'm', ls: 0.3 })
}
