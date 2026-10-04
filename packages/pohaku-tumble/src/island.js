// The made island (DESIGN §3): one high shield and a lower, older shoulder,
// cut by valleys — many deep ones on the windward side, a few shallow gulches
// on the dry leeward slope — and divided ridge by ridge into ahupuaʻa, with
// the eight places set into it and the star compass out at sea. It is built
// once from the seed, in world units, as plain data: floor.js draws it and
// links.js lands field lines on its places.
//
// x runs east and z toward the viewer, so map north is −z. Directions are
// compass bearings, clockwise from north: bearing β points along
// (sin β, −cos β) on the floor.

const TAU = Math.PI * 2
const DEG = Math.PI / 180

// The shield's profile, h = 1 − ρ^SHIELD from the summit (ρ = 0, h = 1) to
// the coast (ρ = 1, h = 0): a dome that steepens toward the sea.
const SHIELD = 1.35
// The unmarked upland — wao akua and the summit zones above it — reaches this
// fraction of the way from the summit to the coast. The board keeps every
// stone off it and the cloud band round it, so it is a clearing of two or
// three cells, not more.
const UPLAND = 0.21
const H_UP = 1 - Math.pow(UPLAND, SHIELD)
// The trade swell comes from the northeast, out of the compass's Koʻolau quarter.
const SWELL_FROM = 45 * DEG
// The compass is read at about the islands' latitude.
const LATITUDE = 21 * DEG

// ── the star compass (research/TERMS.md) ─────────────────────────────────
// Thirty-two houses of 11.25°: the four cardinal points are houses too, and
// each quadrant holds the same seven names counted from the east or west point
// toward the north or south one, so the order is mirrored, not rotated, from
// quadrant to quadrant. The house names are Nainoa Thompson's (PVS).
const CARDINALS = [
  ['ʻĀkau', 0],
  ['Hikina', 90],
  ['Hema', 180],
  ['Komohana', 270],
]
const HOUSE_NAMES = ['Lā', 'ʻĀina', 'Noio', 'Manu', 'Nālani', 'Nā Leo', 'Haka']
const QUADRANTS = [
  // name, the east or west point it counts from, which way
  ['Koʻolau', 90, -1],
  ['Malanai', 90, 1],
  ['Kona', 270, -1],
  ['Hoʻolua', 270, 1],
]

export function buildIsland(seed, bounds) {
  const rand = rng(seed * 7919 + 101)
  const W = bounds.x1 - bounds.x0
  const D = bounds.z1 - bounds.z0
  // u is 1 on Jukugo's 9×8 floor and shrinks with a smaller board. k sizes the
  // things drawn on the map; it stops shrinking where a place would get
  // smaller than a stone.
  const u = Math.min(W / 42, D / 29)
  const k = Math.max(0.62, u)

  const compass = placeCompass(bounds, k, rand)
  const margin = Math.max(2.2 * k, compass.over + 0.9 * k)
  const sheet = { x0: bounds.x0 - margin, x1: bounds.x1 + margin, z0: bounds.z0 - margin, z1: bounds.z1 + margin }

  const shape = shapeIsland(bounds, compass, k, rand)
  const valleys = cutValleys(shape, u, rand)
  const heightAt = heightFunction(shape, valleys, seed)
  const upland = uplandOf(shape, heightAt, k)

  const streams = valleys.map((v) => traceValley(shape, heightAt, v, v.head * shape.rcAt(v.bearing), k))
  const ridges = valleys.map((v, i) => traceRidge(shape, heightAt, upland, v, valleys[(i + 1) % valleys.length], k))

  const sites = chooseSites(valleys, rand)
  const grid = heightGrid(sheet, heightAt, k)
  const lava = lavaFlow(shape, heightAt, upland, valleys[sites.lava], k, rand)
  raiseInside(grid, lava.line, 0.02)

  const coast = isolines(grid, 0).filter((l) => l.closed && Math.abs(area(l.pts)) > 1.2 * k * k)
  coast.sort((a, b) => Math.abs(area(b.pts)) - Math.abs(area(a.pts)))
  const shore = coast[0].pts

  const pond = fishpond(grid, shore, streams[sites.fishpond].at(-1), k, rand)
  const halau = canoeHouse(grid, shore, streams[sites.halau].at(-1), k, rand)
  const kauhale = houseLots(grid, shore, streams[sites.kauhale].at(-1), k, rand)
  const loi = taroTerraces(streams[sites.loi], shape, k, rand)

  // Distance from land out to sea, with the fishpond's wall counted as land so
  // the waterlines run round it; and from the sea in over the land.
  const land = new Uint8Array(grid.n)
  for (let i = 0; i < grid.n; i++) land[i] = grid.h[i] > 0 ? 1 : 0
  stampLine(grid, land, pond.line, 0.06 * k)
  const seaDist = distanceField(grid, land, 1)
  const landDist = distanceField(grid, land, 0)

  const waterlines = [0.16, 0.36, 0.6, 0.9, 1.26, 1.7, 2.22, 2.8].map((d) => ({
    d: d * k,
    lines: isolines({ ...grid, h: seaDist }, d * k).map((l) => smoothLine(l, 1, 0.012 * k)),
  }))

  const reefAt = 0.82 * k
  const reef = fringingReef(grid, seaDist, shape, reefAt, lava, pond, k, rand)

  const trail = isolines({ ...grid, h: landDist }, 0.5 * k)
    .filter((l) => l.closed)
    .sort((a, b) => b.pts.length - a.pts.length)
    .map((l) => smoothLine(l, 2, 0.01 * k))[0]

  // Ridge i runs between valleys i and i + 1. The two where the windward run
  // of valleys meets the leeward one are the moku line.
  const nk = valleys.filter((v) => v.windward).length
  const boundaries = ridges.map((line, i) => ({
    line,
    sea: offshore(grid, seaDist, line, reefAt + 0.25 * k, k),
    moku: i === nk - 1 || i === valleys.length - 1,
  }))
  const ahu = boundaries.map((b) => crossing(b.line, trail.pts)).filter(Boolean)

  const levels = Math.max(10, Math.min(24, Math.round(shape.meanR / 0.62)))
  const contours = []
  for (let j = 1; j < levels; j++) {
    const level = j / levels
    contours.push({
      level,
      major: j % 5 === 0,
      lines: isolines(grid, level)
        .filter((l) => l.pts.length > 4)
        .map((l) => smoothLine(l, 1, 0.012 * k)),
    })
  }

  const cloud = cloudBand(shape, upland, k, rand)
  const main = mainStream(shape, heightAt, upland, valleys[sites.stream], k)

  const places = [
    starCompassPlace(compass, rand),
    { ...pond, field: 'kai', kind: 'fishpond' },
    { ...lava, field: 'ʻāina', kind: 'lava' },
    { ...loi, field: 'ulu', kind: 'loi' },
    { ...kauhale, field: 'kanaka', kind: 'kauhale' },
    { ...halau, field: 'hana', kind: 'halau' },
    { ...cloud, field: 'naʻau', kind: 'cloud' },
    { ...main, field: 'hele', kind: 'stream' },
  ]

  return {
    seed,
    k,
    sheet,
    summit: [shape.S[0], shape.S[1]],
    height: { x0: grid.x0, z0: grid.z0, step: grid.step, nx: grid.nx, nz: grid.nz, h: grid.h },
    coast: coast.map((l) => smoothLine(l, 1, 0.008 * k)),
    contours,
    waterlines,
    boundaries,
    trail,
    ahu,
    streams: streams
      .map((pts, i) => ({ pts: simplify(chaikin(pts, false, 2), 0.01 * k), windward: valleys[i].windward }))
      .filter((s, i) => i !== sites.lava && i !== sites.stream),
    reef,
    upland,
    moku: [
      { name: 'Koʻolau', bearing: wrap(shape.mokuSplit[0] + angleSpan(shape.mokuSplit[0], shape.mokuSplit[1]) / 2) },
      { name: 'Kona', bearing: wrap(shape.mokuSplit[1] + angleSpan(shape.mokuSplit[1], shape.mokuSplit[0]) / 2) },
    ],
    swell: swellField(sheet, grid, seaDist, reefAt, k),
    compass: places[0],
    places,
  }
}

// Whether a floor rectangle reaches into the unmarked upland — for keeping
// stones, and so their captions and lines, off it.
export function touchesUpland(island, x0, z0, x1, z1) {
  const { ring, x, z, r } = island.upland
  if (x1 < x - r || x0 > x + r || z1 < z - r || z0 > z + r) return false
  if (inside(ring, (x0 + x1) / 2, (z0 + z1) / 2)) return true
  for (const [px, pz] of ring) if (px >= x0 && px <= x1 && pz >= z0 && pz <= z1) return true
  const box = [
    [x0, z0],
    [x1, z0],
    [x1, z1],
    [x0, z1],
  ]
  return box.some(([px, pz]) => inside(ring, px, pz))
}

// Where a field line from (px, pz) lands on a place: the nearest point of its
// outline — a polyline (the stream, the lava's edge, the pond wall), a
// rectangle, or a circle.
export function featureAnchor(place, px, pz) {
  if (place.line) return nearestOnLine(place.line, px, pz)
  const dx = px - place.x
  const dz = pz - place.z
  if (place.hw != null) {
    const inBox = Math.abs(dx) <= place.hw && Math.abs(dz) <= place.hh
    if (!inBox) {
      return [place.x + clamp(dx, -place.hw, place.hw), place.z + clamp(dz, -place.hh, place.hh)]
    }
    // Inside: out to the nearest side.
    const gx = place.hw - Math.abs(dx)
    const gz = place.hh - Math.abs(dz)
    return gx < gz ? [place.x + Math.sign(dx || 1) * place.hw, pz] : [px, place.z + Math.sign(dz || 1) * place.hh]
  }
  const d = Math.hypot(dx, dz) || 1
  return [place.x + (dx / d) * place.r, place.z + (dz / d) * place.r]
}

// ── the island's shape ──────────────────────────────────────────────────

// The compass sits in open water off a near corner of the floor, where the
// opening view and the gallery card can see it, hanging a little past the
// stones' edge.
function placeCompass(bounds, k, rand) {
  const r = clamp(0.15 * Math.min(bounds.x1 - bounds.x0, bounds.z1 - bounds.z0), 2.1, 3.6)
  const sx = rand() < 0.5 ? -1 : 1
  const inset = 0.7 * r
  return {
    x: sx < 0 ? bounds.x0 + inset : bounds.x1 - inset,
    z: bounds.z1 - inset,
    r,
    sx,
    sz: 1,
    over: r - inset,
  }
}

// The coast before the valleys cut it: an ellipse, pushed out on the older
// shoulder's side and roughened, seen from an off-centre summit. Its radius
// from the summit is tabulated by bearing, then the whole shape is scaled and
// placed to fit the floor, clear of the compass.
function shapeIsland(bounds, compass, k, rand) {
  const N = 720
  const m = 1.4 * k
  const R = { x0: bounds.x0 + m, x1: bounds.x1 - m, z0: bounds.z0 + m, z1: bounds.z1 - m }
  const A = 1
  const B = ((R.z1 - R.z0) / (R.x1 - R.x0)) * (0.92 + 0.12 * rand())
  const so = [(rand() - 0.5) * 0.3, (rand() - 0.5) * 0.24 * B]
  const shoulder = rand() * TAU
  const lobe = 0.1 + 0.08 * rand()
  const harmonics = [2, 3, 4, 5, 7].map((n) => [n, (0.05 + 0.04 * rand()) / Math.sqrt(n), rand() * TAU])
  const unit = new Float64Array(N)
  const pts = []
  for (let i = 0; i < N; i++) {
    const b = (i / N) * TAU
    const [dx, dz] = dir(b)
    // The ray from the summit to the ellipse.
    const qa = (dx * dx) / (A * A) + (dz * dz) / (B * B)
    const qb = 2 * ((so[0] * dx) / (A * A) + (so[1] * dz) / (B * B))
    const qc = (so[0] * so[0]) / (A * A) + (so[1] * so[1]) / (B * B) - 1
    let t = (-qb + Math.sqrt(qb * qb - 4 * qa * qc)) / (2 * qa)
    t *= 1 + lobe * Math.pow(Math.max(0, Math.cos(b - shoulder)), 3)
    for (const [n, a, p] of harmonics) t *= 1 + a * Math.cos(n * b + p)
    unit[i] = t
    pts.push([so[0] + t * dx, so[1] + t * dz])
  }
  const xs = pts.map((p) => p[0])
  const zs = pts.map((p) => p[1])
  const bx0 = Math.min(...xs)
  const bx1 = Math.max(...xs)
  const bz0 = Math.min(...zs)
  const bz1 = Math.max(...zs)

  // Largest scale that fits, then push the island away from the compass with
  // whatever room is left; shrink until the compass has open water round it.
  let sc = Math.min((R.x1 - R.x0) / (bx1 - bx0), (R.z1 - R.z0) / (bz1 - bz0))
  let ox = 0
  let oz = 0
  for (let tries = 0; tries < 60; tries++) {
    const fx = R.x1 - R.x0 - sc * (bx1 - bx0)
    const fz = R.z1 - R.z0 - sc * (bz1 - bz0)
    ox = (R.x0 + R.x1) / 2 - sc * ((bx0 + bx1) / 2) - (compass.sx * fx) / 2
    oz = (R.z0 + R.z1) / 2 - sc * ((bz0 + bz1) / 2) - (compass.sz * fz) / 2
    let clear = Infinity
    for (const [px, pz] of pts) clear = Math.min(clear, Math.hypot(ox + sc * px - compass.x, oz + sc * pz - compass.z))
    if (clear >= compass.r + 1.25 * k) break
    sc *= 0.97
  }

  const S = [ox + sc * so[0], oz + sc * so[1]]
  const rc = unit.map((t) => t * sc)
  const rcAt = (b) => {
    const f = (wrap(b) / TAU) * N
    const i = Math.floor(f)
    const t = f - i
    return rc[i % N] * (1 - t) + rc[(i + 1) % N] * t
  }
  const coastAt = (b) => {
    const [dx, dz] = dir(b)
    const r = rcAt(b)
    return [S[0] + dx * r, S[1] + dz * r]
  }
  const sh = rcAt(shoulder) * 0.58
  const [shx, shz] = dir(shoulder)

  // Two moku: Koʻolau on the windward northeast, Kona on the leeward
  // southwest, split along a line from northwest to southeast.
  const mokuSplit = [(315 + (rand() - 0.5) * 24) * DEG, (135 + (rand() - 0.5) * 24) * DEG]

  let meanR = 0
  for (const r of rc) meanR += r / N
  return {
    S,
    rcAt,
    coastAt,
    meanR,
    shoulder: { x: S[0] + shx * sh, z: S[1] + shz * sh, s: rcAt(shoulder) * 0.3, k: 0.16 + 0.05 * rand() },
    mokuSplit,
  }
}

// Radial valleys from mid-slope to the sea, one per ahupuaʻa. They are spaced
// along the coast: close together and deep on the windward side, wide apart
// and shallow on the dry leeward kula.
function cutValleys(shape, u, rand) {
  const N = 1440
  const pts = []
  for (let i = 0; i <= N; i++) pts.push(shape.coastAt(shape.mokuSplit[0] + (i / N) * TAU))
  const cum = [0]
  for (let i = 1; i <= N; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
  const koolauSpan = angleSpan(shape.mokuSplit[0], shape.mokuSplit[1])
  const split = Math.round((koolauSpan / TAU) * N)
  const stretches = [
    { from: 0, to: cum[split], spacing: Math.max(2.8, 3.4 * u), windward: true },
    { from: cum[split], to: cum[N], spacing: Math.max(4.4, 5.2 * u), windward: false },
  ]
  const valleys = []
  for (const st of stretches) {
    const len = st.to - st.from
    const n = Math.max(4, Math.round(len / st.spacing))
    const spacing = len / n
    for (let j = 0; j < n; j++) {
      const at = st.from + (j + 0.5 + (rand() - 0.5) * 0.45) * spacing
      let i = 0
      while (cum[i + 1] < at) i++
      const bearing = wrap(shape.mokuSplit[0] + ((i + (at - cum[i]) / (cum[i + 1] - cum[i])) / N) * TAU)
      valleys.push(
        st.windward
          ? {
              bearing,
              windward: true,
              depth: 0.13 + 0.07 * rand(),
              head: UPLAND + 0.1 + 0.14 * rand(),
              width: spacing * (0.22 + 0.06 * rand()),
            }
          : {
              bearing,
              windward: false,
              depth: 0.04 + 0.03 * rand(),
              head: 0.5 + 0.14 * rand(),
              width: spacing * (0.17 + 0.05 * rand()),
            },
      )
    }
  }
  for (const v of valleys) {
    // A valley wanders a little on its way down.
    v.wobble = 0.02 + 0.03 * rand()
    v.phase = rand() * TAU
    v.freq = 4 + 4 * rand()
    // Beyond this far across, the valley no longer cuts the slope.
    v.reach = 3 * v.width * 1.2
  }
  return valleys
}

const axisOf = (v, rho) => v.bearing + v.wobble * Math.sin(rho * v.freq + v.phase)

// Height at any point: the two shields, a little low-frequency noise, and the
// valleys cut into them. 1 at the summit, 0 at the coast, negative at sea.
function heightFunction(shape, valleys, seed) {
  const { S, shoulder } = shape
  const noise = valueNoise(seed * 31 + 7)
  const scale = shape.meanR / 3.2
  return (x, z) => {
    const dx = x - S[0]
    const dz = z - S[1]
    const r = Math.hypot(dx, dz)
    const b = bearingOf(dx, dz)
    const rho = r / shape.rcAt(b)
    let h = 1 - Math.pow(rho, SHIELD)
    const sx = x - shoulder.x
    const sz = z - shoulder.z
    h += shoulder.k * Math.exp(-(sx * sx + sz * sz) / (shoulder.s * shoulder.s)) * smoothstep(1.02, 0.6, rho)
    h += 0.035 * (noise(x / scale, z / scale) + 0.5 * noise(x / (scale * 0.45) + 17, z / (scale * 0.45) - 9))
    for (const v of valleys) {
      if (rho < v.head || Math.abs(adiff(b, v.bearing)) * r > v.reach + v.wobble * r) continue
      const across = r * adiff(b, axisOf(v, rho))
      const sigma = v.width * (0.5 + 0.6 * rho)
      if (Math.abs(across) > 3 * sigma) continue
      const along =
        smoothstep(v.head, v.head + 0.16, rho) * (1 - 0.5 * smoothstep(0.82, 1, rho)) * (1 - smoothstep(1.04, 1.16, rho))
      h -= v.depth * along * Math.exp(-((across / sigma) ** 2))
    }
    return h
  }
}

// The upland: everything above H_UP, as a ring of radii from the summit.
function uplandOf(shape, heightAt, k) {
  const N = 240
  const radii = []
  for (let i = 0; i < N; i++) {
    const b = (i / N) * TAU
    const [dx, dz] = dir(b)
    let r = 0
    const step = 0.05 * k
    while (heightAt(shape.S[0] + dx * (r + step), shape.S[1] + dz * (r + step)) > H_UP) r += step
    radii.push(r + step / 2)
  }
  // Smooth out single-ray noise: this ring is never drawn, but the cloud band
  // follows it.
  const sm = radii.map((_, i) => {
    let s = 0
    for (let j = -3; j <= 3; j++) s += radii[(i + j + N) % N]
    return s / 7
  })
  const ring = sm.map((r, i) => {
    const [dx, dz] = dir((i / N) * TAU)
    return [shape.S[0] + dx * r, shape.S[1] + dz * r]
  })
  const radiusAt = (b) => {
    const f = (wrap(b) / TAU) * N
    const i = Math.floor(f)
    const t = f - i
    return sm[i % N] * (1 - t) + sm[(i + 1) % N] * t
  }
  return { x: shape.S[0], z: shape.S[1], r: Math.max(...sm), ring, radiusAt }
}

// Follow a valley floor down from radius r0 to the sea: step outward, and at
// each step take the lowest point near where the last one was.
function traceValley(shape, heightAt, v, r0, k) {
  const { S } = shape
  const step = 0.12 * k
  const pts = []
  let b = axisOf(v, r0 / shape.rcAt(v.bearing))
  let prev = null
  for (let r = r0; r < shape.rcAt(b) * 1.3; r += step) {
    let best = Infinity
    let bb = b
    for (let j = -6; j <= 6; j++) {
      const c = b + (j / 6) * (0.5 * step) / Math.max(r, step)
      const [dx, dz] = dir(c)
      const lateral = (c - b) * r
      const h = heightAt(S[0] + dx * r, S[1] + dz * r) + 0.002 * lateral * lateral
      if (h < best) {
        best = h
        bb = c
      }
    }
    // Pull gently back toward the axis so a flat valley head doesn't drift.
    b = bb + 0.15 * adiff(axisOf(v, r / shape.rcAt(bb)), bb)
    const [dx, dz] = dir(b)
    const p = [S[0] + dx * r, S[1] + dz * r]
    const h = heightAt(p[0], p[1])
    if (h <= 0 && prev) {
      const t = prev.h / (prev.h - h)
      pts.push([prev.p[0] + (p[0] - prev.p[0]) * t, prev.p[1] + (p[1] - prev.p[1]) * t])
      break
    }
    pts.push(p)
    prev = { p, h }
  }
  return pts
}

// The ridge between valleys a and b: from the edge of the upland down along
// the crest to the shore — the ahupuaʻa boundary.
function traceRidge(shape, heightAt, upland, a, b, k) {
  const { S } = shape
  const step = 0.12 * k
  const gap = angleSpan(a.bearing, b.bearing)
  let c = wrap(a.bearing + gap / 2)
  const pts = []
  let prev = null
  for (let r = upland.radiusAt(c); r < shape.rcAt(c) * 1.3; r += step) {
    const lo = axisOf(a, r / shape.rcAt(c)) + gap * 0.22
    const span = gap * 0.56
    const off = angleSpan(lo, c)
    if (off > span) c = off - span < TAU - off ? lo + span : lo
    let best = -Infinity
    let bc = c
    for (let j = -6; j <= 6; j++) {
      const t = c + (j / 6) * (0.6 * step) / r
      if (angleSpan(lo, t) > span) continue
      const [dx, dz] = dir(t)
      const lateral = (t - c) * r
      const h = heightAt(S[0] + dx * r, S[1] + dz * r) - 0.003 * lateral * lateral
      if (h > best) {
        best = h
        bc = t
      }
    }
    c = bc
    const [dx, dz] = dir(c)
    const p = [S[0] + dx * r, S[1] + dz * r]
    const h = heightAt(p[0], p[1])
    if (h <= 0 && prev) {
      const t = prev.h / (prev.h - h)
      pts.push([prev.p[0] + (p[0] - prev.p[0]) * t, prev.p[1] + (p[1] - prev.p[1]) * t])
      break
    }
    pts.push(p)
    prev = { p, h }
  }
  return simplify(chaikin(pts, false, 2), 0.008 * k)
}

// A boundary runs on past the shore across the shallows to the reef: the
// ahupuaʻa's fishing grounds. It leaves the coast square to it.
function offshore(grid, seaDist, line, reach, k) {
  const [x, z] = line.at(-1)
  const [gx, gz] = gradient(grid, seaDist, x, z)
  const len = Math.hypot(gx, gz) || 1
  const [px, pz] = line.at(-2)
  let dx = gx / len + (x - px) * 2
  let dz = gz / len + (z - pz) * 2
  const dl = Math.hypot(dx, dz) || 1
  dx /= dl
  dz /= dl
  const pts = [[x, z]]
  for (let s = 0.1 * k; s < 4 * reach; s += 0.1 * k) {
    const p = [x + dx * s, z + dz * s]
    pts.push(p)
    if (sample(grid, seaDist, p[0], p[1]) >= reach) break
  }
  return pts
}

// ── the eight places ────────────────────────────────────────────────────

// Which valley each place goes in: the stream and the loʻi in windward
// valleys, the lava down a leeward gulch, the pond on the sheltered leeward
// shore, the canoe house and the houses at valley mouths. Each in its own
// ahupuaʻa, with another between them where the island allows.
function chooseSites(valleys, rand) {
  const n = valleys.length
  const used = []
  const jitter = () => (rand() - 0.5) * 30
  const apart = (i, j) => Math.min(Math.abs(i - j), n - Math.abs(i - j))
  const pick = (want, ok) => {
    for (const gap of [2, 1]) {
      let best = -1
      let bestScore = Infinity
      valleys.forEach((v, i) => {
        if (!ok(v) || used.some((j) => apart(i, j) < gap)) return
        const score = Math.abs(adiff(v.bearing, want * DEG)) + (v.windward ? -v.depth : 0)
        if (score < bestScore) {
          best = i
          bestScore = score
        }
      })
      if (best >= 0) {
        used.push(best)
        return best
      }
    }
    throw new Error('island: no valley left for a place')
  }
  const stream = pick(60 + jitter(), (v) => v.windward)
  const loi = pick(rand() < 0.5 ? 105 : 15, (v) => v.windward)
  const lava = pick(245 + jitter(), (v) => !v.windward)
  const fishpond = pick(195 + jitter(), (v) => !v.windward)
  const halau = pick(160 + jitter(), () => true)
  const kauhale = pick(130 + jitter(), () => true)
  return { stream, loi, lava, fishpond, halau, kauhale }
}

// The hele place: the largest stream, from the edge of the upland to the sea.
function mainStream(shape, heightAt, upland, v, k) {
  const r0 = upland.radiusAt(v.bearing) + 0.25 * k
  const line = simplify(chaikin(traceValley(shape, heightAt, v, r0, k), false, 2), 0.008 * k)
  return { ...circleAround(line), line }
}

// A recent flow down a leeward gulch to the sea, building a little new land
// where it entered the water: smooth pāhoehoe near the vent, breaking up into
// rough ʻaʻā below.
function lavaFlow(shape, heightAt, upland, v, k, rand) {
  const r0 = upland.radiusAt(v.bearing) + 0.2 * (shape.rcAt(v.bearing) - upland.radiusAt(v.bearing))
  const path = traceValley(shape, heightAt, v, r0, k)
  const [ex, ez] = path.at(-1)
  const [px, pz] = path.at(-3)
  const el = Math.hypot(ex - px, ez - pz) || 1
  for (let s = 0.12 * k; s <= 0.7 * k; s += 0.12 * k) path.push([ex + ((ex - px) / el) * s, ez + ((ez - pz) / el) * s])
  const axis = resample(chaikin(path, false, 2), 0.06 * k)
  const L = (axis.length - 1) * 0.06 * k
  const split = 0.42
  const ln = noise1(rand() * 1000)
  const rn = noise1(rand() * 1000)
  const width = (s, side) => {
    const f = s / L
    const w = k * (0.22 + 0.62 * smoothstep(0, 0.75, f))
    const n = side < 0 ? ln : rn
    // Pāhoehoe edges swell into lobes; ʻaʻā edges are ragged.
    const lobes = f < split ? 0.17 * Math.pow(Math.abs(Math.sin(s / (0.32 * k) + side)), 0.7) : 0
    const rough = f >= split ? 0.06 * n(s / (0.07 * k)) : 0
    return w * (1 + 0.12 * n(s / (0.9 * k)) + lobes + rough)
  }
  const frame = axisFrames(axis)
  const left = frame.map(([x, z, nx, nz], i) => {
    const w = width(i * 0.06 * k, -1)
    return [x - nx * w, z - nz * w]
  })
  const right = frame.map(([x, z, nx, nz], i) => {
    const w = width(i * 0.06 * k, 1)
    return [x + nx * w, z + nz * w]
  })
  // Round the vent end, and a ragged front where the ʻaʻā met the sea.
  const cap = (a, b, c, bulge, rough) => {
    const out = []
    for (let i = 1; i < 12; i++) {
      const t = i / 12
      const j = rough ? (rand() - 0.5) * rough : 0
      const s = Math.sin(t * Math.PI) * (bulge + j)
      out.push([a[0] + (b[0] - a[0]) * t + c[0] * s, a[1] + (b[1] - a[1]) * t + c[1] * s])
    }
    return out
  }
  const [hx, hz, hnx, hnz] = frame[0]
  const [fx, fz, fnx, fnz] = frame.at(-1)
  const back = [-hnz, hnx] // up the flow, behind the vent
  const fwd = [fnz, -fnx]
  const line = [
    ...cap(right[0], left[0], back, 0.6 * dist(right[0], left[0]) * 0.5, 0),
    ...left,
    ...cap(left.at(-1), right.at(-1), fwd, 0.35 * dist(left.at(-1), right.at(-1)), 0.12 * k),
    ...right.slice().reverse(),
  ]
  line.push(line[0])

  // Pāhoehoe: lobe fronts bowed downstream with rope folds behind them.
  const lobes = []
  const ropes = []
  const at = (s, t) => {
    const i = clamp(Math.round(s / (0.06 * k)), 0, frame.length - 1)
    const [x, z, nx, nz] = frame[i]
    const w = (width(s, -1) + width(s, 1)) / 2
    return [x + nx * t * w, z + nz * t * w]
  }
  for (let s = 0.5 * k; s < L * split; s += 0.55 * k + rand() * 0.25 * k) {
    const t0 = (rand() - 0.5) * 0.9
    const span = 0.35 + 0.25 * rand()
    const arc = (behind, sc) => {
      const pts = []
      for (let i = 0; i <= 8; i++) {
        const t = (i / 8 - 0.5) * 2
        pts.push(at(s - behind + 0.22 * k * sc * (1 - t * t), t0 + t * span * sc))
      }
      return pts
    }
    lobes.push(arc(0, 1))
    for (let j = 1; j <= 3; j++) ropes.push(arc(0.07 * k * j, 1 - j * 0.2))
  }
  // ʻAʻā: a stipple of clinker, on a jittered lattice so it reads even.
  const stipple = []
  const ds = 0.1 * k
  for (let s = L * split; s < L; s += ds) {
    const w = (width(s, -1) + width(s, 1)) / 2
    const n = Math.max(2, Math.round((2 * w) / ds))
    for (let j = 0; j < n; j++) {
      const t = ((j + 0.2 + 0.6 * rand()) / n) * 2 - 1
      if (Math.abs(t) > 0.92) continue
      stipple.push(at(s + (rand() - 0.5) * ds, t))
    }
  }
  return { ...circleAround(line), line, axis, lobes, ropes, stipple }
}

// A walled pond (loko kuapā) on the reef flat at a stream mouth: a curved
// stone wall from shore to shore, with sluice gates (mākāhā) in it.
function fishpond(grid, shore, mouth, k, rand) {
  const [mx, mz] = nearestOnLine(shore, mouth[0], mouth[1])
  const [nx, nz] = seaward(grid, mx, mz)
  const tx = -nz
  const tz = nx
  const r = 1.35 * k
  const cx = mx - nx * 0.25 * r
  const cz = mz - nz * 0.25 * r
  const arc = []
  for (let i = 0; i <= 90; i++) {
    const a = ((i / 90) * 2 - 1) * 115 * DEG
    arc.push([cx + r * (Math.cos(a) * nx + Math.sin(a) * tx), cz + r * (Math.cos(a) * nz + Math.sin(a) * tz)])
  }
  const wet = arc.map(([x, z]) => sample(grid, grid.h, x, z) < 0)
  let a = 45
  let b = 45
  while (a > 0 && wet[a - 1]) a--
  while (b < 90 && wet[b + 1]) b++
  const wall = simplify(arc.slice(Math.max(0, a - 1), Math.min(90, b + 1) + 1), 0.004 * k)
  const wallLen = length(wall)
  const gates = (wallLen > 2.4 * k ? [0.3, 0.7] : [0.5]).map((f) => {
    const [x, z, dx, dz] = alongLine(wall, f * wallLen + (rand() - 0.5) * 0.1 * wallLen)
    return { x, z, dx, dz, w: 0.16 * k }
  })
  // Where fish rise inside the pond.
  const rings = []
  for (let tries = 0; tries < 200 && rings.length < 5; tries++) {
    const a = rand() * TAU
    const d = Math.sqrt(rand()) * r * 0.8
    const x = cx + Math.cos(a) * d
    const z = cz + Math.sin(a) * d
    if (sample(grid, grid.h, x, z) > -0.01) continue
    if (rings.some((p) => Math.hypot(p.x - x, p.z - z) < 0.45 * k)) continue
    rings.push({ x, z, phase: rand() * 7, period: 5 + 3 * rand() })
  }
  return { x: cx + nx * 0.4 * r, z: cz + nz * 0.4 * r, r: 0.85 * r, line: wall, gates, rings }
}

// A canoe house (hālau waʻa) back from a beach beside a stream mouth, and a
// double-hulled canoe drawn up on the sand in front of it, bows to the sea.
function canoeHouse(grid, shore, mouth, k, rand) {
  const side = rand() < 0.5 ? -1 : 1
  const [ax, az] = nearestOnLine(shore, mouth[0], mouth[1])
  const [x0, z0] = walkLine(shore, ax, az, side * 0.8 * k)
  const [nx, nz] = seaward(grid, x0, z0)
  const tx = -nz
  const tz = nx
  const at = (along, across) => [x0 + nx * along + tx * across, z0 + nz * along + tz * across]
  // The shed: open to the sea, its ridge running inland.
  const len = 1.1 * k
  const wid = 0.46 * k
  const front = -1.05 * k
  const shed = [at(front, -wid / 2), at(front, wid / 2), at(front - len, wid / 2), at(front - len, -wid / 2)]
  const ridge = [at(front, 0), at(front - len, 0)]
  const thatch = []
  for (let i = 1; i < 12; i++) {
    const a = front - (len * i) / 12
    thatch.push([at(a, -wid / 2), at(a, -wid * 0.06)], [at(a, wid * 0.06), at(a, wid / 2)])
  }
  // The canoe: two hulls lashed by crossbeams (ʻiako), a deck between.
  const clen = 0.88 * k
  const bow = -0.14 * k
  const hulls = [-1, 1].map((s) => {
    const off = s * 0.14 * k
    const pts = []
    for (let i = 0; i <= 16; i++) {
      const t = i / 16
      const w = 0.042 * k * Math.pow(Math.sin(t * Math.PI), 0.7) * (t < 0.5 ? 1 : 1 - 0.15 * (t - 0.5))
      pts.push(at(bow - clen * t, off - w))
    }
    for (let i = 16; i >= 0; i--) {
      const t = i / 16
      const w = 0.042 * k * Math.pow(Math.sin(t * Math.PI), 0.7) * (t < 0.5 ? 1 : 1 - 0.15 * (t - 0.5))
      pts.push(at(bow - clen * t, off + w))
    }
    return pts
  })
  const beams = [0.3, 0.5, 0.7].map((t) => [at(bow - clen * t, -0.2 * k), at(bow - clen * t, 0.2 * k)])
  const deck = [
    at(bow - clen * 0.42, -0.09 * k),
    at(bow - clen * 0.42, 0.09 * k),
    at(bow - clen * 0.58, 0.09 * k),
    at(bow - clen * 0.58, -0.09 * k),
  ]
  const sand = []
  for (let a = -1.5 * k; a <= 1.5 * k; a += 0.08 * k) {
    const [x, z] = walkLine(shore, x0, z0, a)
    const [sx, sz] = seaward(grid, x, z)
    for (let d = 0.03 * k; d < 0.5 * k; d += 0.08 * k) {
      const p = [x - sx * (d + rand() * 0.06 * k), z - sz * (d + rand() * 0.06 * k)]
      if (sample(grid, grid.h, p[0], p[1]) <= 0) continue
      // Thinning toward the ends and inland, so the beach has no hard edge.
      if (rand() > (1 - Math.abs(a) / (1.6 * k)) * (1 - d / (0.55 * k)) * 1.6) continue
      if (inside(shed, p[0], p[1])) continue
      sand.push(p)
    }
  }
  const line = [...shed, shed[0]]
  const all = [...shed, ...hulls[0], ...hulls[1]]
  return { ...circleAround(all), line, shed, ridge, thatch, hulls, beams, deck, sand }
}

// A kauhale: a few house platforms (paepae) near the shore, some with
// thatched hale on them, each house to its own use.
function houseLots(grid, shore, mouth, k, rand) {
  const side = rand() < 0.5 ? -1 : 1
  const [ax, az] = nearestOnLine(shore, mouth[0], mouth[1])
  const [x0, z0] = walkLine(shore, ax, az, side * 0.95 * k)
  const [nx, nz] = seaward(grid, x0, z0)
  const cx = x0 - nx * 0.95 * k
  const cz = z0 - nz * 0.95 * k
  const base = Math.atan2(nx, -nz) // along the shore
  const lots = []
  for (let tries = 0; tries < 400 && lots.length < 5; tries++) {
    const a = rand() * TAU
    const d = Math.sqrt(rand()) * 0.75 * k
    const x = cx + Math.cos(a) * d
    const z = cz + Math.sin(a) * d
    const w = (0.34 + 0.18 * rand()) * k
    const h = (0.22 + 0.12 * rand()) * k
    const ang = base + (rand() - 0.5) * 0.4
    const lot = { x, z, w, h, ang }
    const corners = box(lot)
    if (corners.some(([px, pz]) => sample(grid, grid.h, px, pz) < 0.004)) continue
    if (lots.some((o) => Math.hypot(o.x - x, o.z - z) < (Math.max(o.w, o.h) + Math.max(w, h)) * 0.55 + 0.05 * k)) continue
    lots.push(lot)
  }
  const houses = lots.map((lot, i) => {
    const paepae = box(lot)
    if (i >= 3) return { paepae }
    // A hale pili on the platform: a hipped roof in plan, thatched.
    const inner = { ...lot, w: lot.w * 0.72, h: lot.h * 0.62 }
    const roof = box(inner)
    const c = Math.cos(lot.ang)
    const s = Math.sin(lot.ang)
    const half = (inner.w - inner.h) / 2
    const ridge = [
      [lot.x - c * half, lot.z - s * half],
      [lot.x + c * half, lot.z + s * half],
    ]
    const hips = [
      [roof[0], ridge[0]],
      [roof[3], ridge[0]],
      [roof[1], ridge[1]],
      [roof[2], ridge[1]],
    ]
    return { paepae, roof, ridge, hips }
  })
  const all = houses.flatMap((h) => h.paepae)
  const xs = all.map((p) => p[0])
  const zs = all.map((p) => p[1])
  const x = (Math.min(...xs) + Math.max(...xs)) / 2
  const z = (Math.min(...zs) + Math.max(...zs)) / 2
  const hw = (Math.max(...xs) - Math.min(...xs)) / 2 + 0.12 * k
  const hh = (Math.max(...zs) - Math.min(...zs)) / 2 + 0.12 * k
  return { x, z, r: Math.hypot(hw, hh), hw, hh, houses }
}

// Loʻi kalo stepping down a windward valley floor beside its stream, fed by
// an ʻauwai taken off the stream above them and draining back into it below.
function taroTerraces(stream, shape, k, rand) {
  const line = resample(stream, 0.04 * k)
  const frame = axisFrames(line)
  const side = rand() < 0.5 ? -1 : 1
  const rhoOf = ([x, z]) => {
    const dx = x - shape.S[0]
    const dz = z - shape.S[1]
    return Math.hypot(dx, dz) / shape.rcAt(bearingOf(dx, dz))
  }
  let ia = frame.findIndex((p) => rhoOf(p) > 0.62)
  if (ia < 0) ia = Math.floor(frame.length * 0.5)
  const span = Math.min(frame.length - 1 - ia - Math.round((0.5 * k) / (0.04 * k)), Math.round((2.3 * k) / (0.04 * k)))
  const ib = ia + Math.max(span, Math.round((1.0 * k) / (0.04 * k)))
  const at = (i, o) => {
    const [x, z, nx, nz] = frame[clamp(Math.round(i), 0, frame.length - 1)]
    return [x + nx * o * side, z + nz * o * side]
  }
  const rows = clamp(Math.round(((ib - ia) * 0.04) / 0.42), 3, 6)
  const cols = [
    [0.1 * k, 0.56 * k],
    [0.62 * k, 1.04 * k],
  ]
  const terraces = []
  cols.forEach(([o0, o1]) => {
    // Banks in neighbouring columns don't line up.
    const cuts = [ia]
    for (let r = 1; r < rows; r++) cuts.push(ia + ((ib - ia) * (r + (rand() - 0.5) * 0.35)) / rows)
    cuts.push(ib)
    for (let r = 0; r < rows; r++) {
      const g = 0.03 * k / 0.04 / k
      const a = cuts[r] + g
      const b = cuts[r + 1] - g
      terraces.push([at(a, o0), at(b, o0), at(b, o1), at(a, o1)])
    }
  })
  const out = 1.14 * k
  const intake = ia - (0.6 * k) / (0.04 * k)
  const auwai = [at(intake, 0.02 * k)]
  for (let i = intake + 3; i <= ib - 4; i += 3) {
    const f = clamp((i - intake) / ((0.45 * k) / (0.04 * k)), 0, 1)
    auwai.push(at(i, 0.02 * k + (out - 0.02 * k) * smoothstep(0, 1, f)))
  }
  const drain = [at(ib + 1, 0.35 * k), at(ib + (0.2 * k) / (0.04 * k), 0.12 * k), at(ib + (0.36 * k) / (0.04 * k), 0)]
  const hull = convexHull(terraces.flat())
  hull.push(hull[0])
  return { ...circleAround(hull), line: hull, terraces, auwai: chaikin(auwai, false, 2), drain }
}

// The naʻau place: a band of cloud round the upland — around it, never in it.
function cloudBand(shape, upland, k, rand) {
  const inner = (b) => upland.radiusAt(b) + 0.15 * k
  const outer = (b) => upland.radiusAt(b) + 0.85 * k
  const ring = (f) => {
    const pts = []
    for (let i = 0; i <= 180; i++) {
      const b = (i / 180) * TAU
      const [dx, dz] = dir(b)
      const r = f(b)
      pts.push([shape.S[0] + dx * r, shape.S[1] + dz * r])
    }
    return pts
  }
  // Fine hatching on a jittered lattice, each stroke tagged with where it
  // sits in the band so the drawing can thin it into drifting cloud.
  const strokes = []
  const R = upland.r + 0.9 * k
  const ang = -32 * DEG
  const hx = Math.cos(ang) * 0.15 * k
  const hz = Math.sin(ang) * 0.15 * k
  const step = 0.11 * k
  let row = 0
  for (let gz = -R; gz <= R; gz += step, row++) {
    for (let gx = -R; gx <= R; gx += step * 2.4) {
      const x = shape.S[0] + gx + (row % 2) * step * 1.2 + (rand() - 0.5) * step * 1.2
      const z = shape.S[1] + gz + (rand() - 0.5) * step * 0.6
      const dx = x - shape.S[0]
      const dz = z - shape.S[1]
      const b = bearingOf(dx, dz)
      const r = Math.hypot(dx, dz)
      const f = (r - inner(b)) / (outer(b) - inner(b))
      if (f < 0 || f > 1) continue
      // Keep the strokes' ends out of the upland too.
      if (Math.hypot(dx - hx, dz - hz) < inner(bearingOf(dx - hx, dz - hz)) + 0.02 * k) continue
      if (Math.hypot(dx + hx, dz + hz) < inner(bearingOf(dx + hx, dz + hz)) + 0.02 * k) continue
      strokes.push({ x0: x - hx, z0: z - hz, x1: x + hx, z1: z + hz, b, f })
    }
  }
  const line = ring(outer)
  let r = 0
  for (const [x, z] of line) r = Math.max(r, Math.hypot(x - shape.S[0], z - shape.S[1]))
  return { x: shape.S[0], z: shape.S[1], r, line, inner: ring(inner), strokes }
}

function starCompassPlace(c, rand) {
  const houses = CARDINALS.map(([name, b]) => ({ name, bearing: b * DEG, cardinal: true }))
  for (const [quadrant, from, sense] of QUADRANTS) {
    HOUSE_NAMES.forEach((name, j) => houses.push({ name, quadrant, bearing: (from + sense * 11.25 * (j + 1)) * DEG }))
  }
  houses.sort((a, b) => a.bearing - b.bearing)
  // One star at a time, each rising in a house of Koʻolau or Malanai and
  // setting in the house of the same name in Hoʻolua or Kona. Haka is left
  // out: its stars barely clear the horizon round the pole.
  const stars = []
  for (const quadrant of ['Koʻolau', 'Malanai']) {
    for (const name of HOUSE_NAMES.slice(0, 6)) {
      const rise = houses.find((h) => h.quadrant === quadrant && h.name === name)
      const setsIn = quadrant === 'Koʻolau' ? 'Hoʻolua' : 'Kona'
      stars.push({ name, rises: quadrant, sets: setsIn, path: starPath(rise.bearing) })
    }
  }
  for (let i = stars.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[stars[i], stars[j]] = [stars[j], stars[i]]
  }
  return {
    field: 'lani',
    kind: 'compass',
    x: c.x,
    z: c.z,
    r: c.r,
    horizon: 0.56 * c.r,
    houses,
    quadrants: QUADRANTS.map(([name], i) => ({ name, bearing: (45 + 90 * i) * DEG })),
    stars,
  }
}

// A star's path across the sky from rising to setting, as the navigator's
// horizon diagram shows it: bearing round the ring, and the zenith at the
// centre (radius 1 − altitude / 90°). Unit radius; the drawing scales it.
function starPath(riseBearing) {
  const sinDec = Math.cos(riseBearing) * Math.cos(LATITUDE)
  const dec = Math.asin(sinDec)
  const h0 = Math.acos(clamp(-Math.tan(LATITUDE) * Math.tan(dec), -1, 1))
  const pts = []
  for (let i = 0; i <= 64; i++) {
    const H = -h0 + (2 * h0 * i) / 64
    const east = -Math.cos(dec) * Math.sin(H)
    const north = sinDec * Math.cos(LATITUDE) - Math.cos(dec) * Math.cos(H) * Math.sin(LATITUDE)
    const up = sinDec * Math.sin(LATITUDE) + Math.cos(dec) * Math.cos(H) * Math.cos(LATITUDE)
    const az = Math.atan2(east, north)
    const rr = 1 - Math.asin(clamp(up, -1, 1)) / (Math.PI / 2)
    pts.push([Math.sin(az) * rr, -Math.cos(az) * rr])
  }
  // Exactly on the horizon at both ends.
  for (const p of [pts[0], pts.at(-1)]) {
    const l = Math.hypot(p[0], p[1])
    p[0] /= l
    p[1] /= l
  }
  return pts
}

// ── reef and swell ──────────────────────────────────────────────────────

// A fringing reef on stretches of the coast, drawn as a band of dots, with
// surf marks where the swell breaks on its outer edge. None where the lava
// has only just made the shore; always under the fishpond.
function fringingReef(grid, seaDist, shape, at, lava, pond, k, rand) {
  const rings = isolines({ ...grid, h: seaDist }, at).filter((l) => l.closed)
  rings.sort((a, b) => b.pts.length - a.pts.length)
  const ring = resample(rings[0].pts, 0.02 * k)
  const phases = [rand(), rand(), rand()].map((p) => p * TAU)
  const stretch = (b) => Math.sin(2 * b + phases[0]) + 0.6 * Math.sin(3 * b + phases[1]) + 0.4 * Math.sin(5 * b + phases[2])
  const lavaEnd = lava.axis.at(-1)
  const keep = ring.map(([x, z]) => {
    if (Math.hypot(x - lavaEnd[0], z - lavaEnd[1]) < 2.6 * k) return false
    if (Math.hypot(x - pond.x, z - pond.z) < pond.r + 1.4 * k) return true
    return stretch(bearingOf(x - shape.S[0], z - shape.S[1])) > -0.25
  })
  const dots = []
  const surf = []
  const from = dir(SWELL_FROM)
  let next = 0
  let nextSurf = 0
  let walked = 0
  for (let i = 1; i < ring.length; i++) {
    walked += 0.02 * k
    if (!keep[i]) continue
    const [x, z] = ring[i]
    const [gx, gz] = gradient(grid, seaDist, x, z)
    const gl = Math.hypot(gx, gz) || 1
    const nx = gx / gl
    const nz = gz / gl
    if (walked >= next) {
      const o = (rand() - 0.5) * 0.08 * k
      dots.push([x + nx * o, z + nz * o])
      if (rand() < 0.55) dots.push([x - nx * (0.13 + rand() * 0.06) * k, z - nz * (0.13 + rand() * 0.06) * k])
      next = walked + (0.1 + rand() * 0.07) * k
    }
    // Surf breaks on the side the swell comes from.
    if (walked >= nextSurf && nx * from[0] + nz * from[1] > 0.2) {
      const tx = -nz
      const tz = nx
      for (const [o, half] of [
        [0.17, 0.16],
        [0.3, 0.1],
      ]) {
        const cx = x + nx * o * k
        const cz = z + nz * o * k
        surf.push({
          x: cx,
          z: cz,
          pts: [-1, -0.5, 0, 0.5, 1].map((t) => [
            cx + tx * t * half * k - nx * (1 - t * t) * 0.04 * k,
            cz + tz * t * half * k - nz * (1 - t * t) * 0.04 * k,
          ]),
        })
      }
      nextSurf = walked + (0.5 + rand() * 0.25) * k
    }
  }
  return { at, dots, surf }
}

// The trade swell: arrival time over the sea, from a plane wave out of the
// northeast that slows in shallow water and bends round the island into its
// lee. Crests are its level sets; floor.js draws them as the time runs on.
// `energy` fades them in the island's shadow and close to the reef.
function swellField(sheet, grid, seaDist, reefAt, k) {
  const step = Math.max(0.24, 0.3 * Math.min(1.2, k))
  const nx = Math.ceil((sheet.x1 - sheet.x0) / step) + 1
  const nz = Math.ceil((sheet.z1 - sheet.z0) / step) + 1
  const n = nx * nz
  const toward = dir(SWELL_FROM + Math.PI)
  const depth = new Float32Array(n)
  for (let j = 0; j < nz; j++) {
    for (let i = 0; i < nx; i++) {
      depth[j * nx + i] = sample(grid, seaDist, sheet.x0 + i * step, sheet.z0 + j * step)
    }
  }
  const blocked = (c) => depth[c] <= 0.02 * k
  const speed = (c) => 0.5 + 0.5 * smoothstep(0, 3 * k, depth[c])
  const plane = (i, j) => (sheet.x0 + i * step - sheet.x1) * toward[0] + (sheet.z0 + j * step - sheet.z0) * toward[1]

  const T = new Float64Array(n).fill(Infinity)
  const heap = new MinHeap(n)
  for (let j = 0; j < nz; j++) {
    for (let i = 0; i < nx; i++) {
      if (i !== nx - 1 && j !== 0) continue
      const c = j * nx + i
      if (blocked(c)) continue
      T[c] = plane(i, j)
      heap.push(c, T[c])
    }
  }
  const moves = [
    [1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1],
    [1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1],
  ]
  while (heap.size) {
    const [c, t0] = heap.pop()
    if (t0 > T[c]) continue // a stale entry: c was reached sooner since
    const i = c % nx
    const j = (c - i) / nx
    for (const [di, dj] of moves) {
      const ii = i + di
      const jj = j + dj
      if (ii < 0 || jj < 0 || ii >= nx || jj >= nz) continue
      const cc = jj * nx + ii
      if (blocked(cc)) continue
      const t = t0 + (Math.hypot(di, dj) * step * 2) / (speed(c) + speed(cc))
      if (t < T[cc]) {
        T[cc] = t
        heap.push(cc, t)
      }
    }
  }

  // The island's shadow, carried downwind and slowly filling back in.
  const order = []
  for (let c = 0; c < n; c++) order.push(c)
  const along = (c) => plane(c % nx, Math.floor(c / nx))
  order.sort((a, b) => along(a) - along(b))
  const shadow = new Float32Array(n)
  const fill = Math.exp(-step / (7 * k))
  for (const c of order) {
    if (blocked(c)) {
      shadow[c] = 1
      continue
    }
    const i = c % nx
    const j = (c - i) / nx
    const ui = Math.round(i - toward[0])
    const uj = Math.round(j - toward[1])
    shadow[c] = ui >= 0 && uj >= 0 && ui < nx && uj < nz ? shadow[uj * nx + ui] * fill : 0
  }
  const lambda = 2.4 * k
  const energy = new Float32Array(n)
  for (let c = 0; c < n; c++) {
    if (!Number.isFinite(T[c])) continue
    const late = Math.max(0, T[c] - plane(c % nx, Math.floor(c / nx)))
    energy[c] =
      (1 - 0.92 * shadow[c]) * Math.exp(-late / (1.4 * lambda)) * smoothstep(reefAt + 0.3 * k, reefAt + 1.6 * k, depth[c])
  }
  return { x0: sheet.x0, z0: sheet.z0, step, nx, nz, T: Float32Array.from(T), energy, lambda, period: 42 }
}

// ── grids ───────────────────────────────────────────────────────────────

function heightGrid(sheet, heightAt, k) {
  const step = clamp((sheet.x1 - sheet.x0) / 320, 0.1, 0.15)
  const nx = Math.ceil((sheet.x1 - sheet.x0) / step) + 1
  const nz = Math.ceil((sheet.z1 - sheet.z0) / step) + 1
  const h = new Float32Array(nx * nz)
  for (let j = 0; j < nz; j++) {
    for (let i = 0; i < nx; i++) h[j * nx + i] = heightAt(sheet.x0 + i * step, sheet.z0 + j * step)
  }
  return { x0: sheet.x0, z0: sheet.z0, step, nx, nz, n: nx * nz, h }
}

// Lift the sea floor inside a polygon to just above sea level: the land the
// lava flow made.
function raiseInside(grid, poly, to) {
  const xs = poly.map((p) => p[0])
  const zs = poly.map((p) => p[1])
  const i0 = Math.max(0, Math.floor((Math.min(...xs) - grid.x0) / grid.step))
  const i1 = Math.min(grid.nx - 1, Math.ceil((Math.max(...xs) - grid.x0) / grid.step))
  const j0 = Math.max(0, Math.floor((Math.min(...zs) - grid.z0) / grid.step))
  const j1 = Math.min(grid.nz - 1, Math.ceil((Math.max(...zs) - grid.z0) / grid.step))
  for (let j = j0; j <= j1; j++) {
    for (let i = i0; i <= i1; i++) {
      const c = j * grid.nx + i
      if (grid.h[c] < to && inside(poly, grid.x0 + i * grid.step, grid.z0 + j * grid.step)) grid.h[c] = to
    }
  }
}

// Mark the cells within `r` of a polyline.
function stampLine(grid, mask, line, r) {
  for (let i = 1; i < line.length; i++) {
    const [ax, az] = line[i - 1]
    const [bx, bz] = line[i]
    const steps = Math.ceil(Math.hypot(bx - ax, bz - az) / (grid.step * 0.5))
    for (let s = 0; s <= steps; s++) {
      const x = ax + ((bx - ax) * s) / steps
      const z = az + ((bz - az) * s) / steps
      const ri = Math.ceil(r / grid.step)
      const ci = Math.round((x - grid.x0) / grid.step)
      const cj = Math.round((z - grid.z0) / grid.step)
      for (let dj = -ri; dj <= ri; dj++) {
        for (let di = -ri; di <= ri; di++) {
          const ii = ci + di
          const jj = cj + dj
          if (ii < 0 || jj < 0 || ii >= grid.nx || jj >= grid.nz) continue
          if (Math.hypot(di, dj) * grid.step <= r + grid.step * 0.5) mask[jj * grid.nx + ii] = 1
        }
      }
    }
  }
}

// Euclidean distance (world units) from every cell to the nearest cell whose
// mask equals `to` — Felzenszwalb and Huttenlocher's exact transform.
function distanceField(grid, mask, to) {
  const { nx, nz, n } = grid
  const BIG = 1e20
  const d = new Float64Array(n)
  for (let c = 0; c < n; c++) d[c] = mask[c] === to ? 0 : BIG
  const m = Math.max(nx, nz)
  const f = new Float64Array(m)
  const out = new Float64Array(m)
  const v = new Int32Array(m)
  const zz = new Float64Array(m + 1)
  const pass = (len, get, set) => {
    for (let q = 0; q < len; q++) f[q] = get(q)
    let kk = 0
    v[0] = 0
    zz[0] = -BIG
    zz[1] = BIG
    for (let q = 1; q < len; q++) {
      let s = (f[q] + q * q - (f[v[kk]] + v[kk] * v[kk])) / (2 * q - 2 * v[kk])
      while (s <= zz[kk]) {
        kk--
        s = (f[q] + q * q - (f[v[kk]] + v[kk] * v[kk])) / (2 * q - 2 * v[kk])
      }
      kk++
      v[kk] = q
      zz[kk] = s
      zz[kk + 1] = BIG
    }
    kk = 0
    for (let q = 0; q < len; q++) {
      while (zz[kk + 1] < q) kk++
      out[q] = (q - v[kk]) * (q - v[kk]) + f[v[kk]]
    }
    for (let q = 0; q < len; q++) set(q, out[q])
  }
  for (let i = 0; i < nx; i++) pass(nz, (q) => d[q * nx + i], (q, val) => (d[q * nx + i] = val))
  for (let j = 0; j < nz; j++) pass(nx, (q) => d[j * nx + q], (q, val) => (d[j * nx + q] = val))
  const res = new Float32Array(n)
  for (let c = 0; c < n; c++) res[c] = Math.sqrt(d[c]) * grid.step
  return res
}

function sample(grid, field, x, z) {
  const fx = clamp((x - grid.x0) / grid.step, 0, grid.nx - 1.001)
  const fz = clamp((z - grid.z0) / grid.step, 0, grid.nz - 1.001)
  const i = Math.floor(fx)
  const j = Math.floor(fz)
  const tx = fx - i
  const tz = fz - j
  const c = j * grid.nx + i
  return (
    (field[c] * (1 - tx) + field[c + 1] * tx) * (1 - tz) +
    (field[c + grid.nx] * (1 - tx) + field[c + grid.nx + 1] * tx) * tz
  )
}

function gradient(grid, field, x, z) {
  const e = grid.step
  return [
    sample(grid, field, x + e, z) - sample(grid, field, x - e, z),
    sample(grid, field, x, z + e) - sample(grid, field, x, z - e),
  ]
}

// Unit vector pointing out to sea at a shore point: downhill.
function seaward(grid, x, z) {
  const e = grid.step * 3
  const gx = sample(grid, grid.h, x - e, z) - sample(grid, grid.h, x + e, z)
  const gz = sample(grid, grid.h, x, z - e) - sample(grid, grid.h, x, z + e)
  const l = Math.hypot(gx, gz) || 1
  return [gx / l, gz / l]
}

// Marching squares: the polylines where `grid.h` crosses `level`, joined up,
// in world units. Closed lines repeat their first point.
export function isolines(grid, level) {
  const { nx, nz, x0, z0, step, h } = grid
  // Each grid edge is crossed by at most two segments, one from the cell on
  // either side: index them by edge so lines can be joined up after.
  const first = new Int32Array(nx * nz * 2).fill(-1)
  const second = new Int32Array(nx * nz * 2).fill(-1)
  const segA = []
  const segB = []
  const add = (a, b) => {
    const s = segA.length
    segA.push(a)
    segB.push(b)
    for (const e of [a, b]) {
      if (first[e] < 0) first[e] = s
      else second[e] = s
    }
  }
  for (let j = 0; j < nz - 1; j++) {
    for (let i = 0; i < nx - 1; i++) {
      const c = j * nx + i
      const v0 = h[c]
      const v1 = h[c + 1]
      const v2 = h[c + nx + 1]
      const v3 = h[c + nx]
      const code = (v0 > level) | ((v1 > level) << 1) | ((v2 > level) << 2) | ((v3 > level) << 3)
      if (code === 0 || code === 15) continue
      const T = c * 2
      const R = (c + 1) * 2 + 1
      const B = (c + nx) * 2
      const L = c * 2 + 1
      if (code === 5 || code === 10) {
        // A saddle: the average in the middle decides which corners join.
        const high = (v0 + v1 + v2 + v3) / 4 > level
        if ((code === 5) === high) {
          add(T, R)
          add(B, L)
        } else {
          add(L, T)
          add(R, B)
        }
        continue
      }
      let a = -1
      const edge = (e) => (a < 0 ? (a = e) : add(a, e))
      if ((code & 1) !== (code & 2) >> 1) edge(T)
      if ((code & 2) >> 1 !== (code & 4) >> 2) edge(R)
      if ((code & 4) >> 2 !== (code & 8) >> 3) edge(B)
      if ((code & 8) >> 3 !== (code & 1)) edge(L)
    }
  }
  const point = (e) => {
    const c = e >> 1
    const i = c % nx
    const j = (c - i) / nx
    const a = h[c]
    if (e & 1) {
      const t = (level - a) / (h[c + nx] - a)
      return [x0 + i * step, z0 + (j + t) * step]
    }
    const t = (level - a) / (h[c + 1] - a)
    return [x0 + (i + t) * step, z0 + j * step]
  }
  const used = new Uint8Array(segA.length)
  const follow = (start, edge, out) => {
    let s = start
    let e = edge
    for (;;) {
      const next = first[e] === s ? second[e] : first[e]
      if (next < 0 || used[next]) return e
      used[next] = 1
      e = segA[next] === e ? segB[next] : segA[next]
      out.push(e)
      s = next
    }
  }
  const lines = []
  for (let s = 0; s < segA.length; s++) {
    if (used[s]) continue
    used[s] = 1
    const fwd = [segB[s]]
    const end = follow(s, segB[s], fwd)
    const back = []
    follow(s, segA[s], back)
    const edges = [...back.reverse(), segA[s], ...fwd]
    lines.push({ pts: edges.map(point), closed: edges[0] === end && edges.length > 3 })
  }
  return lines
}

// ── polylines ───────────────────────────────────────────────────────────

function smoothLine(l, iterations, tolerance) {
  return { closed: l.closed, pts: simplify(chaikin(l.pts, l.closed, iterations), tolerance) }
}

function chaikin(pts, closed, iterations) {
  let p = pts
  for (let it = 0; it < iterations; it++) {
    const out = closed ? [] : [p[0]]
    for (let i = 0; i < p.length - 1; i++) {
      const [ax, az] = p[i]
      const [bx, bz] = p[i + 1]
      out.push([ax * 0.75 + bx * 0.25, az * 0.75 + bz * 0.25], [ax * 0.25 + bx * 0.75, az * 0.25 + bz * 0.75])
    }
    if (closed) out.push(out[0])
    else out.push(p.at(-1))
    p = out
  }
  return p
}

// Ramer–Douglas–Peucker, iteratively.
function simplify(pts, tol) {
  if (pts.length < 3) return pts
  const keep = new Uint8Array(pts.length)
  keep[0] = keep[pts.length - 1] = 1
  const stack = [[0, pts.length - 1]]
  while (stack.length) {
    const [a, b] = stack.pop()
    const [ax, az] = pts[a]
    const [bx, bz] = pts[b]
    const dx = bx - ax
    const dz = bz - az
    const len = Math.hypot(dx, dz)
    let worst = -1
    let wd = tol
    for (let i = a + 1; i < b; i++) {
      const [px, pz] = pts[i]
      const d = len > 1e-9 ? Math.abs((px - ax) * dz - (pz - az) * dx) / len : Math.hypot(px - ax, pz - az)
      if (d > wd) {
        wd = d
        worst = i
      }
    }
    if (worst >= 0) {
      keep[worst] = 1
      stack.push([a, worst], [worst, b])
    }
  }
  return pts.filter((_, i) => keep[i])
}

function resample(pts, step) {
  const out = [pts[0]]
  let carry = 0
  for (let i = 1; i < pts.length; i++) {
    const [ax, az] = pts[i - 1]
    const [bx, bz] = pts[i]
    const len = Math.hypot(bx - ax, bz - az)
    let s = step - carry
    while (s <= len) {
      out.push([ax + ((bx - ax) * s) / len, az + ((bz - az) * s) / len])
      s += step
    }
    carry = len - (s - step)
  }
  return out
}

// Each point of a polyline with its unit normal (to the right of travel).
function axisFrames(pts) {
  return pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)]
    const b = pts[Math.min(pts.length - 1, i + 1)]
    const dx = b[0] - a[0]
    const dz = b[1] - a[1]
    const l = Math.hypot(dx, dz) || 1
    return [p[0], p[1], -dz / l, dx / l]
  })
}

function length(pts) {
  let s = 0
  for (let i = 1; i < pts.length; i++) s += dist(pts[i - 1], pts[i])
  return s
}

// The point at arc length s along a polyline, with its unit direction.
function alongLine(pts, s) {
  for (let i = 1; i < pts.length; i++) {
    const l = dist(pts[i - 1], pts[i])
    if (s <= l || i === pts.length - 1) {
      const t = l ? clamp(s / l, 0, 1) : 0
      const [ax, az] = pts[i - 1]
      const [bx, bz] = pts[i]
      return [ax + (bx - ax) * t, az + (bz - az) * t, (bx - ax) / (l || 1), (bz - az) / (l || 1)]
    }
    s -= l
  }
  return [...pts[0], 1, 0]
}

// From the point of a closed line nearest (x, z), walk `s` along it (either way).
function walkLine(ring, x, z, s) {
  let best = 0
  let bd = Infinity
  ring.forEach(([px, pz], i) => {
    const d = Math.hypot(px - x, pz - z)
    if (d < bd) {
      bd = d
      best = i
    }
  })
  const n = ring.length - 1
  let i = best
  let left = Math.abs(s)
  const stepDir = s < 0 ? -1 : 1
  while (left > 0) {
    const j = (i + stepDir + n) % n
    const l = dist(ring[i], ring[j])
    if (l >= left) {
      const t = left / l
      return [ring[i][0] + (ring[j][0] - ring[i][0]) * t, ring[i][1] + (ring[j][1] - ring[i][1]) * t]
    }
    left -= l
    i = j
  }
  return ring[i]
}

function nearestOnLine(pts, px, pz) {
  let best = pts[0]
  let bd = Infinity
  for (let i = 1; i < pts.length; i++) {
    const [ax, az] = pts[i - 1]
    const [bx, bz] = pts[i]
    const dx = bx - ax
    const dz = bz - az
    const l2 = dx * dx + dz * dz
    const t = l2 ? clamp(((px - ax) * dx + (pz - az) * dz) / l2, 0, 1) : 0
    const x = ax + dx * t
    const z = az + dz * t
    const d = (x - px) ** 2 + (z - pz) ** 2
    if (d < bd) {
      bd = d
      best = [x, z]
    }
  }
  return best
}

// Where polyline a first crosses polyline b, walking along a.
function crossing(a, b) {
  for (let i = 1; i < a.length; i++) {
    const [p0, p1] = [a[i - 1], a[i]]
    for (let j = 1; j < b.length; j++) {
      const [q0, q1] = [b[j - 1], b[j]]
      const rx = p1[0] - p0[0]
      const rz = p1[1] - p0[1]
      const sx = q1[0] - q0[0]
      const sz = q1[1] - q0[1]
      const den = rx * sz - rz * sx
      if (!den) continue
      const t = ((q0[0] - p0[0]) * sz - (q0[1] - p0[1]) * sx) / den
      const v = ((q0[0] - p0[0]) * rz - (q0[1] - p0[1]) * rx) / den
      if (t >= 0 && t <= 1 && v >= 0 && v <= 1) return [p0[0] + rx * t, p0[1] + rz * t]
    }
  }
  return null
}

function circleAround(pts) {
  const xs = pts.map((p) => p[0])
  const zs = pts.map((p) => p[1])
  const x = (Math.min(...xs) + Math.max(...xs)) / 2
  const z = (Math.min(...zs) + Math.max(...zs)) / 2
  let r = 0
  for (const [px, pz] of pts) r = Math.max(r, Math.hypot(px - x, pz - z))
  return { x, z, r }
}

function box({ x, z, w, h, ang }) {
  const c = Math.cos(ang)
  const s = Math.sin(ang)
  return [
    [-w / 2, -h / 2],
    [w / 2, -h / 2],
    [w / 2, h / 2],
    [-w / 2, h / 2],
  ].map(([a, b]) => [x + a * c - b * s, z + a * s + b * c])
}

function convexHull(points) {
  const p = points.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const lower = []
  for (const q of p) {
    while (lower.length >= 2 && cross(lower.at(-2), lower.at(-1), q) <= 0) lower.pop()
    lower.push(q)
  }
  const upper = []
  for (const q of p.reverse()) {
    while (upper.length >= 2 && cross(upper.at(-2), upper.at(-1), q) <= 0) upper.pop()
    upper.push(q)
  }
  return lower.slice(0, -1).concat(upper.slice(0, -1))
}

function inside(poly, x, z) {
  let c = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, zi] = poly[i]
    const [xj, zj] = poly[j]
    if (zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) c = !c
  }
  return c
}

function area(pts) {
  let a = 0
  for (let i = 1; i < pts.length; i++) a += pts[i - 1][0] * pts[i][1] - pts[i][0] * pts[i - 1][1]
  return a / 2
}

// ── small maths ─────────────────────────────────────────────────────────

function dir(b) {
  return [Math.sin(b), -Math.cos(b)]
}

function bearingOf(dx, dz) {
  return wrap(Math.atan2(dx, -dz))
}

function wrap(a) {
  return ((a % TAU) + TAU) % TAU
}

// Signed difference a − b, in (−π, π].
function adiff(a, b) {
  let d = (a - b) % TAU
  if (d > Math.PI) d -= TAU
  if (d <= -Math.PI) d += TAU
  return d
}

// Clockwise angle from bearing a round to bearing b, in [0, 2π).
function angleSpan(a, b) {
  return wrap(b - a)
}

function dist(a, b) {
  return Math.hypot(b[0] - a[0], b[1] - a[1])
}

function clamp(v, lo, hi) {
  return v < lo ? lo : v > hi ? hi : v
}

function smoothstep(e0, e1, x) {
  const t = clamp((x - e0) / (e1 - e0), 0, 1)
  return t * t * (3 - 2 * t)
}

// The island keeps its own random stream, so it never shifts the deal.
function rng(seed) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x9e3779b9) >>> 0
    let t = s ^ (s >>> 16)
    t = Math.imul(t, 0x21f0aaad)
    t ^= t >>> 15
    t = Math.imul(t, 0x735a2d97)
    t ^= t >>> 15
    return (t >>> 0) / 4294967296
  }
}

function hash(i, j, seed) {
  let t = Math.imul(i | 0, 0x27d4eb2d) ^ Math.imul(j | 0, 0x165667b1) ^ Math.imul(seed | 0, 0x9e3779b1)
  t = Math.imul(t ^ (t >>> 15), 0x85ebca6b)
  t ^= t >>> 13
  t = Math.imul(t, 0xc2b2ae35)
  t ^= t >>> 16
  return ((t >>> 0) / 4294967296) * 2 - 1
}

// Smooth value noise in [−1, 1].
function valueNoise(seed) {
  return (x, z) => {
    const i = Math.floor(x)
    const j = Math.floor(z)
    const fx = x - i
    const fz = z - j
    const sx = fx * fx * (3 - 2 * fx)
    const sz = fz * fz * (3 - 2 * fz)
    const a = hash(i, j, seed)
    const b = hash(i + 1, j, seed)
    const c = hash(i, j + 1, seed)
    const d = hash(i + 1, j + 1, seed)
    return (a + (b - a) * sx) * (1 - sz) + (c + (d - c) * sx) * sz
  }
}

function noise1(seed) {
  const n = valueNoise(Math.floor(seed))
  return (t) => n(t, 0.5)
}

class MinHeap {
  constructor(cap) {
    this.ids = new Int32Array(cap * 4)
    this.keys = new Float64Array(cap * 4)
    this.size = 0
  }

  push(id, key) {
    if (this.size === this.ids.length) {
      const ids = new Int32Array(this.ids.length * 2)
      const keys = new Float64Array(this.keys.length * 2)
      ids.set(this.ids)
      keys.set(this.keys)
      this.ids = ids
      this.keys = keys
    }
    let i = this.size++
    while (i > 0) {
      const p = (i - 1) >> 1
      if (this.keys[p] <= key) break
      this.ids[i] = this.ids[p]
      this.keys[i] = this.keys[p]
      i = p
    }
    this.ids[i] = id
    this.keys[i] = key
  }

  pop() {
    const top = [this.ids[0], this.keys[0]]
    const id = this.ids[--this.size]
    const key = this.keys[this.size]
    let i = 0
    for (;;) {
      let c = 2 * i + 1
      if (c >= this.size) break
      if (c + 1 < this.size && this.keys[c + 1] < this.keys[c]) c++
      if (this.keys[c] >= key) break
      this.ids[i] = this.ids[c]
      this.keys[i] = this.keys[c]
      i = c
    }
    this.ids[i] = id
    this.keys[i] = key
    return top
  }
}
