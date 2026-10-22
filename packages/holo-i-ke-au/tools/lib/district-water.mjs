// Where water runs on a district pack, and the breaches that let it.
//
// Streams are not a file: the app routes water over the pack's heights. A
// bare-earth survey keeps every embankment, so a reservoir dam, or a road
// fill over a culvert, stands across its stream as a wall, and the valley
// behind it is a pit. Routing that fills pits (priority flood, as
// layers-raster.mjs does) still gets the water out, over the lowest point of
// the wall, but it fills the valley behind into a lake first, and simpler
// routing stops there. A breach is a short line cut through such a wall,
// from the pond above to the stream bed below, so the stream runs as it does
// through the culvert or the spillway.
import { distanceTo, routeWater } from './layers-raster.mjs'

const lerp = (a, b, t) => a + (b - a) * t

/** Texel coordinates [u, v] (u east, v south, in texels from the north-west corner) of a lon/lat point. */
export function texelAt(grid, lon, lat) {
  return [(lon - grid.bounds[0]) / grid.dLon, (grid.bounds[3] - lat) / grid.dLat]
}

/** lon/lat of the centre of texel o. */
export function lonLatOf(grid, o) {
  const i = o % grid.W
  const j = (o - i) / grid.W
  return [grid.lonAt(i), grid.latAt(j)]
}

function lowestNear(metres, land, grid, u, v, r) {
  const { W, H } = grid
  let best = Infinity
  for (let j = Math.floor(v) - r; j <= Math.floor(v) + r; j++) {
    for (let i = Math.floor(u) - r; i <= Math.floor(u) + r; i++) {
      if (i < 0 || j < 0 || i >= W || j >= H) continue
      const o = j * W + i
      if (land[o] && metres[o] < best) best = metres[o]
    }
  }
  return best
}

/**
 * Cut each breach into the land heights, in place. A breach is a polyline
 * [[lon, lat], ...] from upstream to downstream. Its bed runs from the lowest
 * land within two texels of its first point to the lowest within two texels
 * of its last, straight in between, and is never allowed to rise: every texel
 * the line crosses is lowered to the smaller of its own height, the bed there
 * and the texel before it. Returns per breach the texels changed and the
 * deepest cut.
 */
export function carveBreaches(metres, land, grid, breaches) {
  const { W, H } = grid
  const out = []
  for (const b of breaches) {
    const pts = b.points.map(([lon, lat]) => texelAt(grid, lon, lat))
    const seg = []
    let total = 0
    for (let k = 1; k < pts.length; k++) {
      const len = Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1])
      seg.push(len)
      total += len
    }
    const [u0, v0] = pts[0]
    const [u1, v1] = pts[pts.length - 1]
    const top = lowestNear(metres, land, grid, u0, v0, 2)
    const bottom = lowestNear(metres, land, grid, u1, v1, 2)
    const high = Math.max(top, bottom)
    const low = Math.min(top, bottom)
    let texels = 0
    let maxCut = 0
    let prev = Infinity
    let last = -1
    let walked = 0
    const visit = (u, v, t) => {
      const i = Math.floor(u)
      const j = Math.floor(v)
      if (i < 0 || j < 0 || i >= W || j >= H) return
      const o = j * W + i
      if (o === last || !land[o]) return
      last = o
      const bed = Math.min(lerp(high, low, t), prev)
      const h = Math.min(metres[o], bed)
      if (h < metres[o]) {
        maxCut = Math.max(maxCut, metres[o] - h)
        metres[o] = h
        texels++
      }
      prev = metres[o]
    }
    if (pts.length === 1) visit(u0, v0, 0)
    for (let k = 1; k < pts.length; k++) {
      const steps = Math.max(1, Math.ceil(seg[k - 1] * 4))
      for (let s = 0; s <= steps; s++) {
        const f = s / steps
        visit(lerp(pts[k - 1][0], pts[k][0], f), lerp(pts[k - 1][1], pts[k][1], f), total ? (walked + f * seg[k - 1]) / total : 0)
      }
      walked += seg[k - 1]
    }
    out.push({ name: b.name, points: b.points, why: b.why, texels, maxCut })
  }
  return out
}

/** Priority-flood filled surface (no epsilon): the level water stands at in every pit. */
export function fillPits(metres, land, W, H) {
  const N = W * H
  const fill = new Float32Array(N)
  const done = new Uint8Array(N)
  const heap = new Int32Array(N)
  let size = 0
  const less = (a, b) => fill[a] < fill[b]
  const push = (o) => {
    let i = size++
    heap[i] = o
    while (i > 0) {
      const p = (i - 1) >> 1
      if (!less(heap[i], heap[p])) break
      ;[heap[i], heap[p]] = [heap[p], heap[i]]
      i = p
    }
  }
  const pop = () => {
    const top = heap[0]
    heap[0] = heap[--size]
    let i = 0
    for (;;) {
      const l = 2 * i + 1
      const r = l + 1
      let m = i
      if (l < size && less(heap[l], heap[m])) m = l
      if (r < size && less(heap[r], heap[m])) m = r
      if (m === i) break
      ;[heap[i], heap[m]] = [heap[m], heap[i]]
      i = m
    }
    return top
  }
  for (let j = 0; j < H; j++) {
    for (let i = 0; i < W; i++) {
      const o = j * W + i
      if (!land[o]) continue
      let edge = i === 0 || j === 0 || i === W - 1 || j === H - 1
      for (let dj = -1; dj <= 1 && !edge; dj++) for (let di = -1; di <= 1 && !edge; di++) if (!land[o + dj * W + di]) edge = true
      if (edge) {
        fill[o] = metres[o]
        done[o] = 1
        push(o)
      }
    }
  }
  while (size) {
    const o = pop()
    const i = o % W
    const j = (o - i) / W
    for (let dj = -1; dj <= 1; dj++) {
      for (let di = -1; di <= 1; di++) {
        const ni = i + di
        const nj = j + dj
        if (ni < 0 || nj < 0 || ni >= W || nj >= H) continue
        const n = nj * W + ni
        if (!land[n] || done[n]) continue
        done[n] = 1
        fill[n] = Math.max(metres[n], fill[o])
        push(n)
      }
    }
  }
  return fill
}

/** The State's lines for one stream (every tributary), and its main stem. */
function mappedStream(fc, s) {
  const all = []
  const main = []
  for (const f of fc.features) {
    if (f.properties.stream_nam !== s.stream || !f.geometry) continue
    const g = f.geometry
    const lines = g.type === 'LineString' ? [g.coordinates] : g.type === 'MultiLineString' ? g.coordinates : []
    all.push(...lines)
    if ((f.properties.trib_nam || '') === s.trib) main.push(...lines)
  }
  return { all, main }
}

/** Texels the lines pass through. */
function rasterLines(lines, grid) {
  const { W, H } = grid
  const mask = new Uint8Array(W * H)
  for (const l of lines) {
    for (let k = 1; k < l.length; k++) {
      const [u0, v0] = texelAt(grid, ...l[k - 1])
      const [u1, v1] = texelAt(grid, ...l[k])
      const n = Math.max(1, Math.ceil(Math.hypot(u1 - u0, v1 - v0) * 2))
      for (let q = 0; q <= n; q++) {
        const i = Math.floor(lerp(u0, u1, q / n))
        const j = Math.floor(lerp(v0, v1, q / n))
        if (i >= 0 && j >= 0 && i < W && j < H) mask[j * W + i] = 1
      }
    }
  }
  return mask
}

/**
 * Where a trunk starts: the highest vertex of the stream's mapped main stem
 * that lies at least `margin` texels inside the box, snapped to the texel
 * draining the most area within 30 m.
 */
function trunkStart(route, metres, land, grid, main, margin = 30) {
  const { W, H } = grid
  let best = null
  for (const l of main) {
    for (const p of l) {
      const [u, v] = texelAt(grid, ...p)
      if (u < margin || v < margin || u >= W - margin || v >= H - margin) continue
      const o = Math.floor(v) * W + Math.floor(u)
      if (land[o] && (!best || metres[o] > best.h)) best = { u, v, h: metres[o] }
    }
  }
  if (!best) return -1
  const r = Math.ceil(30 / grid.metresPerTexel[0])
  let start = -1
  for (let j = Math.floor(best.v) - r; j <= Math.floor(best.v) + r; j++) {
    for (let i = Math.floor(best.u) - r; i <= Math.floor(best.u) + r; i++) {
      if (i < 0 || j < 0 || i >= W || j >= H) continue
      const o = j * W + i
      if (land[o] && (start < 0 || route.area[o] > route.area[start])) start = o
    }
  }
  return start
}

/**
 * Route water over the pack and follow each named stream from the top of its
 * mapped main stem (in the box) down the routed path to where it reaches
 * water at sea level. streams: [{ name, stream, trib }] as the State's
 * stream layer names them; mapped: that layer. Reports how much of the
 * trunk keeps within `near` metres of the stream's mapped lines, how far its
 * outlet is from them and from the stream's lowest mapped point (its mouth),
 * its length and catchment, and the deepest pit it passes through (water
 * standing over the bare earth: a dam or a crossing until breached).
 */
export function streamReport(metres, land, grid, rainMm, streams, mapped, { near: nearAll = 60, share = 0.8, maxPit = 1.5 } = {}) {
  if (!streams.length) return []
  const { W, H } = grid
  const texel = grid.metresPerTexel[0]
  const route = routeWater(metres, land, W, H, texel, rainMm, Infinity)
  const filled = fillPits(metres, land, W, H)
  const metresBetween = ([a, b], [c, d]) => Math.hypot(((a - c) * grid.metresPerTexel[0]) / grid.dLon, ((b - d) * grid.metresPerTexel[1]) / grid.dLat)
  const out = []
  for (const s of streams) {
    // (a stream may carry its own tolerance, with the reason beside it in the district's list)
    const near = s.near ?? nearAll
    const m = mappedStream(mapped, s)
    const dist = distanceTo(rasterLines(m.all, grid), W, H, texel)
    // the mouth: the stream's lowest mapped end
    let mouth = null
    for (const l of m.all) {
      for (const p of [l[0], l[l.length - 1]]) {
        const [u, v] = texelAt(grid, ...p)
        const i = Math.floor(u)
        const j = Math.floor(v)
        const h = i >= 0 && j >= 0 && i < W && j < H ? metres[j * W + i] : Infinity
        if (!mouth || h < mouth.h) mouth = { p, h }
      }
    }
    const start = trunkStart(route, metres, land, grid, m.main)
    if (start < 0 || !mouth) {
      out.push({ name: s.name, summary: 'no mapped main stem inside the box', result: { ok: false } })
      continue
    }
    let o = start
    let length = 0
    let deepest = 0
    let deepestAt = start
    let steps = 0
    let onMap = 0
    const seen = new Set()
    for (;;) {
      seen.add(o)
      steps++
      if (dist[o] <= near) onMap++
      const depth = filled[o] - metres[o]
      if (depth > deepest) {
        deepest = depth
        deepestAt = o
      }
      const n = route.down[o]
      if (n < 0 || seen.has(n)) break
      length += Math.hypot((n % W) - (o % W), Math.floor(n / W) - Math.floor(o / W)) * texel
      o = n
    }
    const i = o % W
    const j = (o - i) / W
    const atEdge = i === 0 || j === 0 || i === W - 1 || j === H - 1
    const outlet = lonLatOf(grid, o)
    const fromMouth = metresBetween(outlet, mouth.p)
    const kept = onMap / steps
    const ok = !atEdge && kept >= share && dist[o] <= near && deepest <= maxPit
    const r6 = (x) => Math.round(x * 1e6) / 1e6
    const f5 = (p) => p.map((x) => x.toFixed(5)).join(', ')
    out.push({
      name: s.name,
      summary:
        `from ${f5(lonLatOf(grid, start))} (${route.area[start].toFixed(2)} km² above), ${(length / 1000).toFixed(2)} km to water at sea level at ${f5(outlet)}, ` +
        `${Math.round(dist[o])} m from the mapped stream and ${Math.round(fromMouth)} m from its mouth; ${(kept * 100).toFixed(0)}% of the trunk within ${Math.round(near)} m of the mapped lines; ` +
        `${route.area[o].toFixed(2)} km² at the outlet; deepest pit ${deepest.toFixed(1)} m at ${f5(lonLatOf(grid, deepestAt))}${atEdge ? '; LEAVES THE BOX' : ''}${ok ? '' : ' (CHECK)'}`,
      result: {
        mapped: `${s.stream} / ${s.trib}`,
        from: lonLatOf(grid, start).map(r6),
        outlet: outlet.map(r6),
        mouth: mouth.p.map(r6),
        outletOffStreamMetres: Math.round(dist[o]),
        outletFromMouthMetres: Math.round(fromMouth),
        withinMappedShare: Math.round(kept * 1000) / 1000,
        lengthKm: Math.round(length) / 1000,
        catchmentKm2: Math.round(route.area[o] * 100) / 100,
        deepestPitMetres: Math.round(deepest * 10) / 10,
        ok,
      },
    })
  }
  return out
}

/**
 * The pits on a stream's routed trunk deeper than minDepth, each as a breach
 * that would let it through: from the lowest texel of the pond on the trunk,
 * down the routed path over the spill, to the first texel lower than that.
 * Returns [{ stream, depth, points: [[lon, lat], ...] }], points every few
 * texels. Used by --find-breaches to propose the district's breach list.
 */
export function trunkBreaches(metres, land, grid, rainMm, streams, mapped, { minDepth = 1.5, every = 4 } = {}) {
  const { W, H } = grid
  const texel = grid.metresPerTexel[0]
  const route = routeWater(metres, land, W, H, texel, rainMm, Infinity)
  const filled = fillPits(metres, land, W, H)
  const out = []
  for (const s of streams) {
    const start = trunkStart(route, metres, land, grid, mappedStream(mapped, s).main)
    if (start < 0) continue
    const path = []
    for (let o = start, n = 0; o >= 0 && n < W * H; o = route.down[o], n++) path.push(o)
    for (let k = 0; k < path.length; k++) {
      if (filled[path[k]] - metres[path[k]] <= 0.05) continue
      // a pond: its stretch of the path, and the lowest texel in it
      let e = k
      while (e < path.length && filled[path[e]] - metres[path[e]] > 0.05) e++
      let low = k
      for (let q = k; q < e; q++) if (metres[path[q]] < metres[path[low]]) low = q
      const depth = filled[path[low]] - metres[path[low]]
      if (depth > minDepth) {
        let end = e
        while (end < path.length - 1 && metres[path[end]] >= metres[path[low]]) end++
        const pts = []
        for (let q = low; q <= end; q += every) pts.push(lonLatOf(grid, path[q]))
        if ((end - low) % every) pts.push(lonLatOf(grid, path[end]))
        out.push({ stream: s.name, depth, points: pts.map(([a, b]) => [Math.round(a * 1e6) / 1e6, Math.round(b * 1e6) / 1e6]) })
      }
      k = e
    }
  }
  return out
}
