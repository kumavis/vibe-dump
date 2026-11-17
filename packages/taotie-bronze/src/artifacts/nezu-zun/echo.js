// Nezu zun 饕餮文尊 (90075) — the ECHO renderer for its thread relief.
//
// What the developed photographs show (.work/r8-zun-fix/trace/m0.png, m1.png): the field is not a set of boxed
// compartments with spirals packed in them, it is ONE sheet of raised threads ≈ 1 mm wide at a ≈ 2.1 mm pitch in
// which every line runs parallel to the nearest drawn element — rings round the eye, horizontal lines under the
// borders, slanting lines beside a slanting quill, coils round a spiral — and where two such systems meet they meet
// in a seam (a line, or a sharp V). So the décor is authored as a few SEED lines (borders, the socket sweep, quills,
// spiral cores) and the threads are the iso-distance lines of the distance to the nearest seed, every `pitch` mm.
// At the seams (the medial axis between two seeds) the last pair of lines is merged into one when they would crowd
// (gap < 0.55 pitch), or a seam line is added when they would leave a wide land (gap > 1.45 pitch).
//
// One EDT (kit.nearestFeature) of the seed raster, one separable max filter for the local seam distance, one pass
// writing the field (max). Bosses / discs are then written by kit.pillowBoss on top.

const TAU = Math.PI * 2

/** an Archimedean spiral, outside → in: centre c, outer radii [rx, ry] (or R), `pitch` between turns, from angle a0
 *  (deg, 0 = +x, 90 = +y), dir +1 ccw / −1 cw, `sq` 0 round … 1 squared (superellipse corners), `turns` (default: to
 *  the centre), `rot` (deg). Returns a polyline. */
export function spiral(c, R, { pitch = 2.1, a0 = 90, dir = 1, sq = 0, turns, rot = 0, core = 0.45 } = {}) {
  const [rx, ry] = Array.isArray(R) ? R : [R, R]
  const rmax = Math.max(rx, ry)
  const nt = turns ?? Math.max(0.4, (rmax - pitch * core) / pitch)
  const n = Math.max(12, Math.ceil(nt * 72))
  const ex = 2 + sq * 6
  const cr = Math.cos((rot * Math.PI) / 180), sr = Math.sin((rot * Math.PI) / 180)
  const pts = []
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * nt
    const a = (a0 * Math.PI) / 180 + dir * t * TAU
    const k = 1 - (t * pitch) / rmax // shrink: one pitch per turn on the long axis
    const ca = Math.cos(a), sa = Math.sin(a)
    const q = Math.pow(Math.pow(Math.abs(ca), ex) + Math.pow(Math.abs(sa), ex), -1 / ex)
    const x = rx * k * ca * q, y = ry * k * sa * q
    pts.push([c[0] + x * cr - y * sr, c[1] + x * sr + y * cr])
  }
  return pts
}

/** a comma / hook: a short line ending in a small curl — `from` → `to`, curling `dir` (+1 left of travel) with radius r */
export function hookLine(from, to, r, dir = 1, turns = 0.8) {
  const dx = to[0] - from[0], dy = to[1] - from[1], L = Math.hypot(dx, dy) || 1
  const h = Math.atan2(dy, dx)
  // centre of the curl: to the `dir` side of the end
  const c = [to[0] - (dir * dy * r) / L, to[1] + (dir * dx * r) / L]
  const pts = [from, to]
  const a0 = h - (dir * Math.PI) / 2
  const n = Math.ceil(turns * 40)
  for (let i = 1; i <= n; i++) {
    const t = i / n
    const a = a0 + dir * t * turns * TAU
    const rr = r * (1 - 0.55 * t)
    pts.push([c[0] + rr * Math.cos(a), c[1] + rr * Math.sin(a)])
  }
  return pts
}

/**
 * Render an echo-thread field into `panel` (max into the field).
 * spec = { seeds: [pts[] | { c: pts, closed }], plain: [poly], plainRects: [[x, y, w, h]], rings: [{ c, r }] (circle seeds),
 *          mirror: axis x | null (seeds / plain are drawn again reflected about x = axis) }
 * o = { pitch 2.1, w 1.0 (thread width), h 0.7 (height), shoulder 0.32, rect: { x, y, w, h } (clip),
 *       maxRings: Infinity (how many echoes per seed; 0 = the seeds alone, drawn as threads) }
 */
export function echoThreads(kit, panel, spec, o = {}) {
  const pitch = o.pitch ?? 2.1, tw = o.w ?? 1.0, th = o.h ?? 0.7, sh = o.shoulder ?? 0.32
  const { cols, rows, ppmm, field } = panel
  const ax = spec.mirror
  const reflect = (pts) => (ax == null ? [pts] : [pts, pts.map(([x, y]) => [2 * ax - x, y])])
  const seeds = []
  for (const s of spec.seeds || []) {
    const pts = Array.isArray(s) ? s : s.c
    for (const p of reflect(pts)) seeds.push({ pts: p, closed: !Array.isArray(s) && !!s.closed })
  }
  for (const r of spec.rings || []) {
    const pts = Array.from({ length: 73 }, (_, i) => [r.c[0] + r.r * Math.cos((TAU * i) / 72), r.c[1] + (r.ry ?? r.r) * Math.sin((TAU * i) / 72)])
    for (const p of reflect(pts)) seeds.push({ pts: p, closed: true })
  }
  const seedM = panel.mask((ctx) => {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'
    ctx.lineWidth = Math.max(0.22, 1.2 / ppmm)
    for (const s of seeds) {
      ctx.beginPath()
      s.pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
      if (s.closed) ctx.closePath()
      ctx.stroke()
    }
  })
  const plainM = panel.mask((ctx) => {
    for (const pl of spec.plain || []) for (const p of reflect(pl)) {
      ctx.beginPath(); p.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fill()
    }
    for (const [x, y, w, h] of spec.plainRects || []) ctx.fillRect(x, y, w, h)
    for (const pc of spec.plainCircles || []) for (const cx of ax == null ? [pc.c[0]] : [pc.c[0], 2 * ax - pc.c[0]]) {
      ctx.beginPath(); ctx.ellipse(cx, pc.c[1], pc.r, pc.ry ?? pc.r, 0, 0, TAU); ctx.fill()
    }
  })
  const N = cols * rows
  const bin = new Uint8Array(N)
  for (let i = 0; i < N; i++) bin[i] = seedM.data[i] > 0.3 ? 1 : 0
  const { dist2 } = kit.nearestFeature(bin, cols, rows)
  const d = new Float32Array(N)
  for (let i = 0; i < N; i++) d[i] = Math.sqrt(dist2[i]) / ppmm
  // local seam distance: a separable max filter of d (radius 1.6 pitch), then a light box blur
  const R = Math.max(1, Math.round(1.6 * pitch * ppmm))
  const tmp = new Float32Array(N), D = new Float32Array(N)
  for (let y = 0; y < rows; y++) {
    const row = y * cols
    for (let x = 0; x < cols; x++) {
      let m = 0
      const a = Math.max(0, x - R), b = Math.min(cols - 1, x + R)
      for (let k = a; k <= b; k++) if (d[row + k] > m) m = d[row + k]
      tmp[row + x] = m
    }
  }
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      let m = 0
      const a = Math.max(0, y - R), b = Math.min(rows - 1, y + R)
      for (let k = a; k <= b; k++) if (tmp[k * cols + x] > m) m = tmp[k * cols + x]
      D[y * cols + x] = m
    }
  }
  const rect = o.rect
  const rx0 = rect ? Math.max(0, Math.floor(rect.x * ppmm)) : 0, rx1 = rect ? Math.min(cols, Math.ceil((rect.x + rect.w) * ppmm)) : cols
  const ry0 = rect ? Math.max(0, Math.floor(rect.y * ppmm)) : 0, ry1 = rect ? Math.min(rows, Math.ceil((rect.y + rect.h) * ppmm)) : rows
  const half = tw / 2
  const reach = 1.6 * pitch * 0.97
  const maxD = ((o.maxRings ?? Infinity) + 0.5) * pitch
  for (let y = ry0; y < ry1; y++) {
    for (let x = rx0; x < rx1; x++) {
      const i = y * cols + x
      const pm = plainM.data[i]
      if (pm >= 0.999) continue
      const di = d[i]
      if (di > maxD) continue
      let k = Math.round(di / pitch)
      let e = Math.abs(di - k * pitch)
      const Dl = D[i]
      if (Dl - di < reach) {
        // a seam is near: Dl ≈ distance from the seed to the seam
        const kl = Math.floor(Dl / pitch) // the last regular line before the seam
        const gap = 2 * (Dl - kl * pitch)
        if (gap < 0.55 * pitch && kl >= 1) {
          // merge the last pair into one line on the seam
          if (k >= kl) e = Math.abs(di - Dl)
        } else if (gap > 1.45 * pitch) {
          e = Math.min(e, Math.abs(di - Dl)) // add a seam line
        }
      }
      let v = (half - e) / sh + 0.5
      if (v <= 0) continue
      v = v >= 1 ? 1 : v * v * (3 - 2 * v)
      const hh = th * v * (1 - pm)
      if (hh > field[i]) field[i] = hh
    }
  }
  return { seeds: seeds.length }
}
