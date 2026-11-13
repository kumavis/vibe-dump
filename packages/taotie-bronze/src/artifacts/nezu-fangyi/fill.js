// nezu-fangyi — the crowd of small hooks.
//
// What makes the Nezu fangyi's surface read as "packed" (the owner's
// "incredible details and greebling") is not the leiwen: it is that every gap
// between the big masses of a mask (horn coil, eye frame, body bands) is
// filled by a smaller raised band ending in a squared-round C- or S-hook, each
// with its own incised centre line, and only what is left after THAT gets the
// fine leiwen. fillHooks() does that second step for a sheet: it rasterises
// what is already on the sheet into a coarse occupancy grid, then greedily
// drops the largest hook that fits into the largest free gap, until no gap
// is wider than rMin. Hooks are squared spirals (Turtle.curl) or round
// C-scrolls, turned in 90° steps, sense alternating — never Math.random
// (seeded mulberry32 from the kit).

const D2R = Math.PI / 180

function rot(c, a, p) {
  const ca = Math.cos(a * D2R), sa = Math.sin(a * D2R)
  return [c[0] + p[0] * ca - p[1] * sa, c[1] + p[0] * sa + p[1] * ca]
}

/** one hook spine centred at c, outer spine half-size a, pitch p, rotation ang (deg), sense dir */
export function hookSpineAt(kit, c, a, p, ang, dir, { round = false, turns = 1.25 } = {}) {
  if (round) {
    // a round C-scroll with a short straight lead (the Shang hook "ending in a curl")
    const sc = kit.shapes.cScroll(c, a, { start: ang, sweep: turns * 360, dir, shrink: Math.min(0.32, p / a / 1.6) })
    const p0 = sc[0], t = [-Math.sin(ang * D2R) * dir, Math.cos(ang * D2R) * dir]
    return [[p0[0] - t[0] * a * 0.7, p0[1] - t[1] * a * 0.7], ...sc]
  }
  const start = rot(c, ang, [-a, -a * dir])
  const T = new kit.shapes.Turtle(start, ang)
  T.fwd(2 * a)
  T.curl({ dir, size: [2 * a, 2 * a - p], pitch: p, turns, r: Math.min(a * 0.45, p * 0.55) })
  return T.spine(0.3)
}

/**
 * Fill the free space of a sheet's region with hooks.
 * region: { u0, u1, v0, v1 } (half-space mm); o: { rMin, rMax, gap, wMin, wMax, seed, round (0..1 share of round
 * scrolls), keep: [{u0,u1,v0,v1}] areas to leave empty, max }
 */
export function fillHooks(kit, S, region, o = {}) {
  const { rMin = 3, rMax = 7, gap = 1.1, wMin = 2, wMax = 3.6, seed = 1, round = 0.35, keep = [], max = 60, wScale = 0.36, line = true, inside = null } = o
  const rnd = kit.mulberry32(seed)
  const g = 0.5
  const { u0, u1, v0, v1 } = region
  const nx = Math.max(2, Math.ceil((u1 - u0) / g)), ny = Math.max(2, Math.ceil((v1 - v0) / g))
  const occ = new Uint8Array(nx * ny)
  const mark = (u, v, r) => {
    const i0 = Math.max(0, Math.floor((u - r - u0) / g)), i1 = Math.min(nx - 1, Math.ceil((u + r - u0) / g))
    const j0 = Math.max(0, Math.floor((v - r - v0) / g)), j1 = Math.min(ny - 1, Math.ceil((v + r - v0) / g))
    for (let j = j0; j <= j1; j++) {
      const y = v0 + (j + 0.5) * g
      for (let i = i0; i <= i1; i++) {
        const x = u0 + (i + 0.5) * g
        if ((x - u) ** 2 + (y - v) ** 2 <= r * r) occ[j * nx + i] = 1
      }
    }
  }
  const markRect = (a0, a1, b0, b1) => {
    for (let j = 0; j < ny; j++) {
      const y = v0 + (j + 0.5) * g
      if (y < b0 || y > b1) continue
      for (let i = 0; i < nx; i++) {
        const x = u0 + (i + 0.5) * g
        if (x >= a0 && x <= a1) occ[j * nx + i] = 1
      }
    }
  }
  const wOf = (w) => (typeof w === 'number' ? w : Math.max(w(0), w(0.5), w(1)))
  for (const b of S.bands) {
    const r = wOf(b.w) / 2 + gap
    for (let k = 0; k < b.pts.length; k += 2) mark(b.pts[k][0], b.pts[k][1], r)
    const L = b.pts[b.pts.length - 1]
    mark(L[0], L[1], r)
  }
  for (const { shape: s } of S.blobs) {
    if (s.kind === 'rrect') markRect(s.c[0] - s.w / 2 - gap, s.c[0] + s.w / 2 + gap, s.c[1] - s.h / 2 - gap, s.c[1] + s.h / 2 + gap)
    else if (s.kind === 'circle') mark(s.c[0], s.c[1], s.r + gap)
    else if (s.kind === 'ellipse') mark(s.c[0], s.c[1], Math.max(s.rx, s.ry) + gap)
    else if (s.pts) {
      let a0 = Infinity, a1 = -Infinity, b0 = Infinity, b1 = -Infinity
      for (const [x, y] of s.pts) { a0 = Math.min(a0, x); a1 = Math.max(a1, x); b0 = Math.min(b0, y); b1 = Math.max(b1, y) }
      markRect(a0 - gap, a1 + gap, b0 - gap, b1 + gap)
    }
  }
  for (const b of S.bosses) mark(b.c[0], b.c[1], Math.max(b.rx, b.ry) + gap)
  for (const k of keep) markRect(k.u0, k.u1, k.v0, k.v1)
  if (inside) {
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) if (!inside(u0 + (i + 0.5) * g, v0 + (j + 0.5) * g)) occ[j * nx + i] = 1
  }

  // distance (mm) to the nearest occupied cell or the region border: two-pass chamfer
  const dist = new Float32Array(nx * ny)
  const dt = () => {
    const BIG = 1e9, a = g, b = g * Math.SQRT2
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const k = j * nx + i
      if (occ[k]) { dist[k] = 0; continue }
      let d = Math.min(i + 1, j + 1, nx - i, ny - j) * g // the border counts as occupied
      if (i > 0) d = Math.min(d, dist[k - 1] + a)
      if (j > 0) {
        d = Math.min(d, dist[k - nx] + a)
        if (i > 0) d = Math.min(d, dist[k - nx - 1] + b)
        if (i < nx - 1) d = Math.min(d, dist[k - nx + 1] + b)
      }
      dist[k] = Math.min(d, BIG)
    }
    for (let j = ny - 1; j >= 0; j--) for (let i = nx - 1; i >= 0; i--) {
      const k = j * nx + i
      if (occ[k]) continue
      let d = dist[k]
      if (i < nx - 1) d = Math.min(d, dist[k + 1] + a)
      if (j < ny - 1) {
        d = Math.min(d, dist[k + nx] + a)
        if (i < nx - 1) d = Math.min(d, dist[k + nx + 1] + b)
        if (i > 0) d = Math.min(d, dist[k + nx - 1] + b)
      }
      dist[k] = d
    }
  }
  const placed = []
  for (let n = 0; n < max; n++) {
    dt()
    let best = -1, bd = 0
    for (let k = 0; k < dist.length; k++) if (dist[k] > bd + 1e-6) { bd = dist[k]; best = k }
    if (best < 0 || bd < rMin) break
    // the free disk is bd (to the nearest OCCUPIED edge, which already includes `gap`)
    const rho = Math.min(bd, rMax)
    const c = [u0 + ((best % nx) + 0.5) * g, v0 + (Math.floor(best / nx) + 0.5) * g]
    const w = Math.min(wMax, Math.max(wMin, rho * wScale))
    const isRound = rnd() < round
    const a = isRound ? rho - w / 2 : (rho - w / 2) * 0.86
    const p = w + Math.max(0.9, 0.28 * w)
    const ang = Math.floor(rnd() * 4) * 90
    const dir = (n + Math.floor(rnd() * 2)) % 2 === 0 ? 1 : -1
    if (a < w * 0.9) { mark(c[0], c[1], rho); continue }
    const turns = 2 * a > 3.2 * p ? 1.25 : 0.75
    const pts = hookSpineAt(kit, c, a, p, ang, dir, { round: isRound, turns: isRound ? (a > 2.2 * p ? 1.1 : 0.8) : turns })
    S.band(pts, w, { capA: 'round', capB: 'round', line: line && w >= 2.4 })
    placed.push({ c, rho, w })
    mark(c[0], c[1], rho + gap)
  }
  return placed
}
