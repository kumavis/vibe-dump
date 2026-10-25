// Streams and waterfalls, fed by the weather.
//
// Every traced stream is a ribbon of water laid along its channel. How full it
// runs depends on where it rises and on the rain: big windward streams flow all
// year; leeward gulches are dry beds until a Kona storm fills them. Where a
// channel drops steeply the water turns white. Where it drops off a cliff the
// waterfalls (waterfalls.js) take over: the ribbon fades out over the last
// few metres to the brink as the fall fades in over the same stretch, and
// fades back in below it, churned white for a little way.
//
// The water's pattern rides downstream in travel time: each vertex knows how
// many seconds water takes to get there from the source (faster down the
// steeps), and the pattern at a point belongs to the water that passed the
// source that long ago. So it can race down a steep reach and dawdle across
// a flat one and still never be seen to back up, however long the app has
// been open; and every point's pattern changes at the same gentle rate, slow
// enough not to strobe backwards at the frame rates a laptop or phone gets.
//
// A tributary ends on the centreline of the stream it joins, coming down to
// that stream's water (never climbing to it), and gives way to that water
// across its wetted width, so the two read as one sheet of water rather than
// a seam or a bright patch where both are drawn. Where the tributary runs
// through that stream's bank, over a ridge the terrain as drawn leaves
// across its cut, it is drawn over the ridge rather than under it.

import * as THREE from 'three'
import { Y_PER_M } from '../config.js'
import { constants, noise, heightFetch, lighting } from '../render/shaders/common.glsl.js'
import { layStreams } from '../gen/channels.js'
import { drawnHeight } from './index.js'

// (the drawn lines are laid in the generator's terms, so that the beds it cuts
// and the ribbons drawn here are the same lines)
export { layStreams }

const vertex = /* glsl */ `
${constants}
in vec3 aFlow; // x along-stream distance, y perennial (0..1), z steepness (0..1)
in float aSide;
in float aFade; // 1, or less where a waterfall takes over
in float aTau; // seconds the water takes to get here from the source
in vec4 aJoin; // in a confluence: x signed distance off the joined stream's centre, in its half-widths; y its perennial; z its fade there; w how far the drawn ground stands over this water
uniform sampler2D uWeather;
uniform vec4 uWeatherRect;
out vec3 vWorld;
out vec3 vFlow;
out float vSide;
out float vWet;
out float vFade;
out float vTau;
out vec3 vJoin;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorld = wp.xyz;
  // far off, the terrain's coarser LOD fills the narrow channels in; draw the
  // water a little toward the eye so it isn't swallowed by its own valley
  vec3 toCam = cameraPosition - wp.xyz;
  float dc = length(toCam);
  float lift = min(dc * 0.015, 1.2);
  // and where a tributary runs through the bank of the stream it joins,
  // over a ridge only the drawn terrain has (the beds are cut through it,
  // but the mesh through the texel corners can't show a cut that narrow),
  // draw it over the ridge rather than under it
  lift += aJoin.w * 1.3 * dc / max(toCam.y, 0.25 * dc);
  // (never so far it reaches the eye, close up and nearly level with it)
  wp.xyz += toCam / max(dc, 1e-3) * min(lift, dc * 0.8);
  vFlow = aFlow;
  vSide = aSide;
  vFade = aFade;
  vTau = aTau;
  vJoin = aJoin.xyz;
  vec4 w = texture(uWeather, (wp.xz - uWeatherRect.xy) / uWeatherRect.zw);
  vWet = w.b; // the ground's memory of recent rain
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`

const fragment = /* glsl */ `
${constants}
${noise}
${heightFetch}
${lighting}
uniform float uFlowAll; // island-wide recent rain
in vec3 vWorld;
in vec3 vFlow;
in float vSide;
in float vWet;
in float vFade;
in float vTau;
in vec3 vJoin;
void main() {
  if (vFade < 0.003) discard;
  float flow = clamp(vFlow.y + vWet * 1.4 + uFlowAll * 0.5, 0.0, 1.0);
  if (flow < 0.06) discard;
  // the wetted width grows with the flow; edges thin out
  float edge = 1.0 - smoothstep(flow * 0.3, flow * 0.55 + 0.4, abs(vSide));
  if (edge <= 0.01) discard;
  float steep = vFlow.z;
  vec3 V = normalize(cameraPosition - vWorld);
  // the pattern rides with the water: its phase is when the water passing
  // here left the source (so it is drawn out where the stream runs fast)
  float left = uTime - vTau;
  vec2 q = vec2(left * 2.0, vSide * 3.0);
  float n = vnoise(q) * 0.6 + vnoise(q * 2.7 + 3.0) * 0.4;
  vec3 N = normalize(vec3((n - 0.5) * 0.3, 1.0, (vnoise(q + 7.0) - 0.5) * 0.3));
  float F = 0.04 + 0.96 * pow(1.0 - max(dot(N, V), 0.0), 5.0);
  float vis = sunVisibility(vWorld);
  vec3 light = uSunColor * max(uSunDir.y, 0.0) * vis + uSkyColor;
  vec3 water = mix(vec3(0.05, 0.07, 0.06) * light, skyMap(reflect(-V, N)) * 0.7, F * 0.6);
  // whitewater on the steeps and in spate
  float white = smoothstep(0.35, 0.8, steep + flow * 0.15) * (0.4 + 0.6 * n);
  white = max(white, smoothstep(0.75, 1.0, flow) * 0.25 * n);
  vec3 foam = vec3(0.72, 0.76, 0.78) * light;
  vec3 col = mix(water, foam, clamp(white, 0.0, 1.0));
  // falls break up into streaks and spray; flat reaches are glassy
  float streaks = mix(1.0, 0.45 + 0.55 * smoothstep(0.2, 0.7, vnoise(vec2(vSide * 9.0, left * 1.3))), steep);
  float a = edge * mix(0.7, 0.55, steep) * streaks * smoothstep(0.06, 0.3, flow) * vFade;
  // fade with distance so far-off falls are a sheen, not a painted line
  a *= 1.0 - smoothstep(12.0, 60.0, distance(cameraPosition, vWorld)) * 0.8;
  // a tributary gives way to the stream it runs into across that stream's
  // wetted width: drawn over it at a (1 - c) / (1 - c a), where the stream
  // covers c, the two together come to what either alone would be, with no
  // bright overlap and no thin seam between them
  // (the distance comes signed, so that it interpolates true across a
  // triangle the stream's centreline runs through)
  float dj = abs(vJoin.x);
  if (dj < 4.0) {
    float flowJ = clamp(vJoin.y + vWet * 1.4 + uFlowAll * 0.5, 0.0, 1.0);
    float c = (1.0 - smoothstep(flowJ * 0.3, flowJ * 0.55 + 0.4, dj)) * smoothstep(0.06, 0.3, flowJ) * vJoin.z;
    a *= (1.0 - c) / max(1.0 - c * a, 1e-3);
  }
  gl_FragColor = vec4(col, a);
}
`

// A cut hides a line between h0 and h1 (where a waterfall is drawn instead),
// fading it out over r0 before h0 and back in over r1 after h1, so the ribbon
// and the fall cross-fade rather than butt together. (Each fades over 85% of
// the stretch, the ribbon a little behind the fall, so that the two
// together stay about as bright as either: neither a faint neck between
// them nor a bright band where they overlap.) Split the line at every boundary
// (inserting the exact point there), and give each point its fade (0
// strictly inside a cut: those points are dropped).
function cutFade(cuts, s) {
  let f = 1
  for (const c of cuts) {
    if (s > c.h0 && s < c.h1) return 0
    if (s <= c.h0 && c.r0 > 0) f = Math.min(f, 1 - smooth01(((s - (c.h0 - c.r0)) / c.r0 - 0.15) / 0.85))
    if (s >= c.h1 && c.r1 > 0) f = Math.min(f, smooth01((s - c.h1) / c.r1 / 0.85))
  }
  return f
}
const smooth01 = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t))

// (`extra` are more places to split it at: a tributary's last stretch, so its
// hand-over to the stream it joins is drawn finely enough to be smooth. Each
// is dropped where it would land within `gap` of a station already there, and
// a traced point within a few millimetres of a fall's boundary gives way to
// it: a sliver of a quad between two stations a hair apart only shows as a
// needle across the water. So, too, do the last traced points before either
// end, which the smoothing leaves a few millimetres from it.)
function applyCuts(line, cuts, extra = [], gap = 0) {
  const n = line.pts.length
  const total = line.along[n - 1]
  const inCut = (s) => cuts.some((c) => s > c.h0 + 1e-6 && s < c.h1 - 1e-6)
  const marks = cuts.length ? cuts.flatMap((c) => [c.h0 - c.r0, c.h0 - c.r0 * 0.85, c.h0 - c.r0 * 0.45, c.h0, c.h1, c.h1 + c.r1 * 0.4, c.h1 + c.r1 * 0.85, c.h1 + c.r1]).filter((m) => m > 1e-6 && m < total - 1e-6).sort((a, b) => a - b) : marks0
  // the traced points (each an index into the line) merged with the marks
  // (-1), both already in order
  const S = []
  const I = []
  let q = 0
  for (let i = 0; i < n; i++) {
    const s = line.along[i]
    if (i > 0 && i < n - 1 && (s <= 0.008 || s >= total - 0.008 || within(marks, s, 0.004))) continue
    for (; q < marks.length && marks[q] < s; q++) S.push(marks[q]), I.push(-1)
    S.push(s)
    I.push(i)
  }
  // and the extra splits, between them
  let S2 = S
  let I2 = I
  if (extra.length) {
    S2 = []
    I2 = []
    let k = 0
    for (const m of extra) {
      if (m <= 1e-6 || m >= total - 1e-6 || within(S, m, gap)) continue
      for (; k < S.length && S[k] < m; k++) S2.push(S[k]), I2.push(I[k])
      S2.push(m)
      I2.push(-1)
    }
    for (; k < S.length; k++) S2.push(S[k]), I2.push(I[k])
  }
  const pts = []
  const along = []
  const gone = []
  const fade = []
  let last = -Infinity
  for (let k = 0; k < S2.length; k++) {
    const s = S2[k]
    if (s - last < 1e-6) continue
    last = s
    const g = inCut(s)
    pts.push(I2[k] >= 0 ? line.pts[I2[k]] : pointOn(line, s, [0, 0]))
    along.push(s)
    gone.push(g)
    fade.push(g ? 0 : cutFade(cuts, s))
  }
  return { pts, along, gone, fade }
}
const marks0 = []

/** Whether sorted array a has a value within d of v. */
function within(a, v, d) {
  let lo = 0
  let hi = a.length
  while (lo < hi) {
    const m = (lo + hi) >> 1
    if (a[m] < v) lo = m + 1
    else hi = m
  }
  return (lo < a.length && a[lo] - v < d) || (lo > 0 && v - a[lo - 1] < d)
}

/** The point at arc length s on segment k of a line (pts, along), written into o. */
function lerpOn(pts, along, k, s, o) {
  const t = Math.min(1, Math.max(0, (s - along[k]) / (along[k + 1] - along[k] || 1)))
  o[0] = pts[k][0] + (pts[k + 1][0] - pts[k][0]) * t
  o[1] = pts[k][1] + (pts[k + 1][1] - pts[k][1]) * t
  return o
}

/** The point at arc length s along a line (clamped to it), written into o. */
function pointOn(line, s, o) {
  const { pts, along } = line
  let lo = 0
  let hi = pts.length - 1
  if (s <= 0) lo = hi = 0
  else if (s >= along[hi]) lo = hi
  else {
    while (hi - lo > 1) {
      const m = (lo + hi) >> 1
      if (along[m] <= s) lo = m
      else hi = m
    }
  }
  const t = hi === lo ? 0 : (s - along[lo]) / (along[hi] - along[lo])
  o[0] = pts[lo][0] + (pts[hi][0] - pts[lo][0]) * t
  o[1] = pts[lo][1] + (pts[hi][1] - pts[lo][1]) * t
  return o
}

// How fast the water's pattern runs, world units a second, from the
// steepness. (At any one point the shader's pattern changes by 2 cells a
// second, so a flat reach shows 2 / 0.11 ≈ 18 cells per unit along it and a
// steep one a third as many, drawn out; and its finer octave moves under a
// fifth of a cell a frame at 30 fps, so it never seems to run backwards.)
const SPEED0 = 0.11
const SPEED1 = 0.22
const SIDES = [-1, 1]

/**
 * Nearest point on line's centreline to (x, z), searching arc lengths s0..s1:
 * { d, s, u } with u the signed distance across (+ toward the ribbon's +1 side).
 */
function nearestOn(line, x, z, s0, s1) {
  const { pts, along } = line
  let lo = 0
  let hi = pts.length - 1
  while (hi - lo > 1) {
    const m = (lo + hi) >> 1
    if (along[m] <= s0) lo = m
    else hi = m
  }
  let bd = Infinity
  let bs = 0
  let bu = 0
  for (let i = lo; i < pts.length - 1 && along[i] <= s1; i++) {
    const ax = pts[i][0]
    const az = pts[i][1]
    const dx = pts[i + 1][0] - ax
    const dz = pts[i + 1][1] - az
    const l2 = dx * dx + dz * dz || 1e-12
    const t = Math.min(1, Math.max(0, ((x - ax) * dx + (z - az) * dz) / l2))
    const ex = x - ax - dx * t
    const ez = z - az - dz * t
    const d2 = ex * ex + ez * ez
    if (d2 < bd) {
      bd = d2
      bs = along[i] + (along[i + 1] - along[i]) * t
      bu = (dx * ez - dz * ex) / Math.sqrt(l2)
    }
  }
  return { d: Math.sqrt(bd), s: bs, u: bu }
}

/**
 * A drawn line's stations (as recorded while building it) interpolated at arc
 * length s; null where it isn't drawn there: inside a fall's cut, past the
 * sea, or beyond the stretches recorded round the places tributaries join.
 */
function stationAt(rec, s) {
  const { s: S } = rec
  const last = S.length - 1
  if (last < 0 || s < S[0] - 0.05 || s > S[last] + 0.05) return null
  let lo = 0
  let hi = last
  if (s <= S[0]) hi = 0
  else if (s >= S[last]) lo = last
  else {
    while (hi - lo > 1) {
      const m = (lo + hi) >> 1
      if (S[m] <= s) lo = m
      else hi = m
    }
    // (a station either side of a cut, or of the sea, isn't water in between)
    if (!rec.joined[hi]) return null
  }
  const t = hi === lo ? 0 : (s - S[lo]) / (S[hi] - S[lo])
  const mix = (a) => a[lo] + (a[hi] - a[lo]) * t
  return { y: mix(rec.y), hm: mix(rec.hm), w: mix(rec.w), steep: mix(rec.steep), fade: mix(rec.fade), y0: mix(rec.y0), y1: mix(rec.y1) }
}

/** A ribbon's half-width for a line's drainage area. */
const halfWidth = (A) => Math.min(0.11, 0.009 * Math.sqrt(A) + 0.012)

// Each station's cross direction comes from the line's heading over a fixed
// stretch either side of it, not from its immediate neighbours, so stations
// close together lie square to one heading rather than twisting the quad
// between them.
const HEADING = 0.03
// how far a line takes to grow to its full width from where it rises
const HEAD = 0.3

// Vertex data, filled in order into typed arrays that grow as they need to
// (what three wants in the end, without a long array of numbers to copy)
class Fill {
  constructor(Type, n) {
    this.a = new Type(Math.ceil(n))
    this.n = 0
  }
  room(k) {
    if (this.n + k <= this.a.length) return
    const b = new this.a.constructor(Math.max(this.a.length * 2, this.n + k))
    b.set(this.a)
    this.a = b
  }
  push1(x) {
    this.room(1)
    this.a[this.n++] = x
  }
  push3(x, y, z) {
    this.room(3)
    const a = this.a
    a[this.n] = x
    a[this.n + 1] = y
    a[this.n + 2] = z
    this.n += 3
  }
  push4(x, y, z, w) {
    this.room(4)
    const a = this.a
    a[this.n] = x
    a[this.n + 1] = y
    a[this.n + 2] = z
    a[this.n + 3] = w
    this.n += 4
  }
  done() {
    return this.a.slice(0, this.n)
  }
}

export class Streams {
  constructor(app) {
    const meta = app.island.meta
    const T = app.terrain
    const lines = app.wailele?.lines || layStreams(meta, app.island.data)
    // (about two vertices a traced point, and a few more for the falls and
    // the confluences)
    let est = 64
    for (const l of lines) est += l.pts.length * 2.4
    const pos = new Fill(Float32Array, est * 3)
    const flow = new Fill(Float32Array, est * 3)
    const side = new Fill(Float32Array, est)
    const fades = new Fill(Float32Array, est)
    const taus = new Fill(Float32Array, est)
    const joins = new Fill(Float32Array, est * 4)
    const bury = [] // a tributary's crossing into its stem: [vertex, how far under the drawn ground, ...]
    const idx = new Fill(Uint32Array, est * 3)
    let v = 0
    // where a waterfall is drawn the ribbon gives way to it (and the two
    // overlap only where they cross-fade)
    const allCuts = app.wailele?.cuts
    this.cutTris = 0
    // the drawn stations of each line a tributary runs into, round where it does
    const recs = []
    const wants = []
    for (const l of lines) if (l.join) (wants[l.join.line] ||= []).push(l.join.s)
    const P0 = [0, 0]
    const P1 = [0, 0]
    // (a station's two edges, worked out before either is laid)
    const EX = [0, 0]
    const EZ = [0, 0]
    const EY = [0, 0]
    const EJ = [0, 0]
    const EF = [0, 0]
    for (let k = 0; k < lines.length; k++) {
      const line = lines[k]
      const cuts = allCuts?.get(k) || []
      const total = line.along[line.along.length - 1]
      // A tributary: the stream it runs into, as drawn there. Where that
      // stream's water is drawn at the junction, the tributary runs on into
      // it (its hand-over reaching a couple of that stream's widths out from
      // it, at a slant, split finely enough to be smooth); where it is a fall
      // there (or its water lies well below this one's ground, in a pool),
      // the tributary thins and fades into the fall's spray instead.
      const join = line.join && recs[line.join.line]
      const stem = join && lines[line.join.line]
      const extra = []
      let mode = 0
      let reach = 0
      let wS = 0
      let gap = 0
      if (join) {
        const e = line.pts[line.pts.length - 1]
        const st = stationAt(join, line.join.s)
        mode = st && st.fade > 0.02 && st.hm > T.metresAt(e[0], e[1]) - 2 ? 1 : 2
        wS = st ? st.w : halfWidth(stem.lineA)
        reach = Math.min(total, mode === 1 ? 5 * wS + 0.04 : 2 * wS + 0.04)
        const step = Math.min(0.05, Math.max(0.02, wS * 0.8))
        for (let s = total - reach; s < total - step * 0.5; s += step) extra.push(s)
        gap = Math.max(0.008, step * 0.4)
      }
      const s0 = line.join ? line.join.s - reach - 0.1 : 0
      const s1 = line.join ? line.join.s + 0.15 : 0
      const { pts, along: alongs, gone, fade } = applyCuts(line, cuts, extra, gap)
      // (the side it comes in from, for the distances off that stream it
      // carries: they stay on that side all the way up it)
      let away = 99
      if (mode === 1) {
        const i0 = alongs.findIndex((s) => s >= total - reach - 1e-6)
        if (i0 >= 0 && nearestOn(stem, pts[i0][0], pts[i0][1], s0, s1).u < 0) away = -99
      }
      // perennial: by how much rain drains through (area is rain-weighted)
      const A = line.lineA
      const per = Math.min(1, Math.max(0, (Math.log10(A) - 0.35) / 0.9))
      const half = halfWidth(A)
      const foamAfter = cuts.map((c) => c.h1)
      // (a line is drawn as wide as the drainage where it ends, all the way
      // up; where it rises it grows to that over its first few dozen metres
      // rather than starting square and full-width, unless a fall is drawn
      // there)
      const head = cuts.some((c) => c.h0 - c.r0 < HEAD) ? 0 : HEAD
      const want = wants[k]?.sort((a, b) => a - b)
      const rec = want && { s: [], y: [], hm: [], w: [], steep: [], fade: [], joined: [], y0: [], y1: [], per }
      if (rec) recs[k] = rec
      let wq = 0
      let kept = -2
      let cap = Infinity // a pool's level, held for a little way below it
      let capUntil = -1
      let prevOk = false
      // water never climbs: the generator cut every bed to fall all the way
      // down, so this only irons out what a hero's carve or the last few
      // centimetres of interpolation leave (each stretch between falls on
      // its own: below a fall the water starts again from its pool)
      let run = Infinity
      let runY = Infinity
      const runSide = [Infinity, Infinity]
      // travel time from the source
      let tau = 0
      let tauS = 0
      let tauV = SPEED0
      // (the heading's two ends walk down the line with the stations)
      const LA = line.along
      const LP = line.pts
      const last = LP.length - 1
      let wa = 0
      let wb = 0
      for (let i = 0; i < pts.length; i++) {
        const along = alongs[i]
        const sa = Math.max(0, along - HEADING)
        const sb = Math.min(total, along + HEADING)
        while (wa < last - 1 && LA[wa + 1] < sa) wa++
        while (wb < last - 1 && LA[wb + 1] < sb) wb++
        lerpOn(LP, LA, wa, sa, P0)
        lerpOn(LP, LA, wb, sb, P1)
        const dx = P1[0] - P0[0]
        const dz = P1[1] - P0[1]
        const l = Math.hypot(dx, dz) || 1
        const nx = -dz / l
        const nz = dx / l
        const x = pts[i][0]
        const z = pts[i][1]
        let hm = T.metresAt(x, z)
        if (hm < -0.5) break
        if (gone[i]) {
          prevOk = false
          run = runY = runSide[0] = runSide[1] = Infinity
          continue
        }
        for (const c of cuts) {
          if (c.level !== undefined && Math.abs(along - c.h1) < 1e-6) {
            cap = c.level
            capUntil = c.h1 + 1
          }
        }
        if (along <= capUntil) {
          hm = Math.min(hm, cap)
          cap = hm
        }
        hm = run = Math.min(hm, run)
        // steepness from the drop over ~60 m downstream
        const ahead = pts[Math.min(pts.length - 1, i + 2)]
        const drop = (hm - T.metresAt(ahead[0], ahead[1])) / Math.max(10, Math.hypot(ahead[0] - x, ahead[1] - z) * 100)
        let steep = Math.min(1, Math.max(0, (drop - 0.08) / 0.5))
        // the water leaves a plunge pool churned white
        for (const s1 of foamAfter) if (along > s1 - 1e-6 && along <= s1 + 0.4) steep = Math.max(steep, 1 - (along - s1) / 0.4)
        // running into another stream, it takes on that stream's water (its
        // pace, and its level where that lies lower) over the last couple of
        // that stream's widths, and narrows to a point on its centreline, so
        // that it has no square end to show where that stream runs thin
        let into = null
        let wIn = 0
        let taper = 1
        let out = 1
        let near = null
        if (mode && along >= total - reach - 1e-6) {
          near = nearestOn(stem, x, z, s0, s1)
          if (mode === 1) {
            into = stationAt(join, near.s)
            const wj = into ? into.w : wS
            wIn = 1 - smooth01((near.d / wj - 1) / 1.5)
            taper = smooth01(near.d / wj / 1.2)
            if (into) steep += (into.steep - steep) * wIn
          } else {
            out = smooth01((near.d / wS - 0.3) / 1.5)
            taper = 0.3 + 0.7 * out
          }
        }
        const grow = head ? smooth01(along / head) : 1
        const w = half * (1 + steep * 0.4) * taper * (0.25 + 0.75 * grow)
        // (and gives way as it narrows, so that its last sliver, where that
        // stream's water is taking over, isn't drawn as a fan of needles)
        const thin = smooth01(taper / 0.3)
        if (want) while (wq < want.length && want[wq] + 0.35 < along) wq++
        const keep = want && wq < want.length && want[wq] - 1.1 <= along
        // (whitewater rides a little higher, but not so it climbs)
        let y = Math.max(hm, 0) * Y_PER_M + 0.012 + steep * 0.03
        if (into) y += Math.min(0, into.y - y) * wIn
        y = runY = Math.min(runY, y)
        const speed = SPEED0 + SPEED1 * steep
        tau += (along - tauS) / ((speed + tauV) / 2)
        tauS = along
        tauV = speed
        for (let r = 0; r < 2; r++) {
          const sd = SIDES[r]
          const px = x + nx * w * sd
          const pz = z + nz * w * sd
          // hug the bank: never sink under the ground beside the channel (but
          // where a fall has cut a notch, don't climb its walls either, and
          // never climb downstream: where a bank rises the water lies under
          // its edge). The ground is as it's drawn: the mesh through the
          // texel corners rounds a narrow channel off, and an edge laid on
          // the finer heightfield would be swallowed by it in a jagged line.
          // (A tributary's edges follow the same rule into the stream it
          // joins: over its water they lie on its surface, as far as they
          // can without climbing, and otherwise on the ground in its channel
          // a little under it, where the tributary gives way to it.)
          let yb = Math.max(0, drawnHeight(T, px, pz)) + 0.003
          if (cuts.length) yb = Math.min(yb, y + 0.04)
          let dJ = away
          let fJ = 0
          if (near && mode === 1) {
            const n = nearestOn(stem, px, pz, near.s - 0.2, near.s + 0.2)
            const st = stationAt(join, n.s)
            dJ = n.u / (st ? st.w : wS)
            if (st) {
              fJ = st.fade
              const f = Math.min(1, Math.max(0, 0.5 + 0.5 * dJ))
              yb += Math.max(0, st.y0 + (st.y1 - st.y0) * f - yb) * (1 - smooth01((Math.abs(dJ) - 1) / 0.3))
            }
          }
          EX[r] = px
          EZ[r] = pz
          EY[r] = Math.max(y, Math.min(yb, runSide[r]))
          EJ[r] = dJ
          EF[r] = fJ
        }
        // (as a tributary narrows to a point its higher edge comes down to
        // the other, so that the last of it lies flat rather than standing
        // on edge as a thin sliver)
        if (taper < 1) {
          const hi = EY[0] > EY[1] ? 0 : 1
          EY[hi] = EY[1 - hi] + (EY[hi] - EY[1 - hi]) * taper
        }
        const vf = fade[i] * out * thin * (head ? smooth01(along / (head * 0.3)) : 1)
        for (let r = 0; r < 2; r++) {
          runSide[r] = EY[r]
          if (keep) rec[r ? 'y1' : 'y0'].push(EY[r])
          pos.push3(EX[r], EY[r], EZ[r])
          flow.push3(along, per, steep)
          side.push1(SIDES[r])
          fades.push1(vf)
          taus.push1(tau)
          joins.push4(EJ[r], mode === 1 ? join.per : 0, EF[r], 0)
        }
        if (keep) {
          rec.s.push(along)
          rec.y.push(y)
          rec.hm.push(hm)
          rec.w.push(w)
          rec.steep.push(steep)
          rec.fade.push(fade[i])
          rec.joined.push(prevOk && kept === i - 1)
          kept = i
        }
        if (prevOk) {
          idx.push3(v - 2, v - 1, v)
          idx.push3(v - 1, v + 1, v)
          // (dev check: a quad reaching into a cut would double-draw a fall)
          const sPrev = alongs[i - 1]
          if (cuts.some(({ h0, h1 }) => (sPrev > h0 + 1e-6 && sPrev < h1 - 1e-6) || (along > h0 + 1e-6 && along < h1 - 1e-6) || (sPrev < h0 - 1e-6 && along > h1 + 1e-6))) this.cutTris += 2
        }
        // (how far the drawn ground stands over a tributary's water as it
        // crosses into the stream it joins, here and on the way from the
        // last station, for the shader to draw it over that)
        if (near && mode === 1) {
          const ridge = (x, z, y) => Math.max(0, drawnHeight(T, x, z) - y)
          const P = pos.a
          const yc = (P[v * 3 + 1] + P[v * 3 + 4]) / 2
          let b = Math.max(ridge(x, z, yc), ridge(P[v * 3], P[v * 3 + 2], P[v * 3 + 1]), ridge(P[v * 3 + 3], P[v * 3 + 5], P[v * 3 + 4]))
          if (prevOk && bury.length && bury[bury.length - 2] === v - 2) {
            const q = (v - 2) * 3
            const m = ridge((P[q] + P[q + 3] + x * 2) / 4, (P[q + 2] + P[q + 5] + z * 2) / 4, (P[q + 1] + P[q + 4] + yc * 2) / 4)
            b = Math.max(b, m)
            bury[bury.length - 1] = Math.max(bury[bury.length - 1], m)
          }
          bury.push(v, b)
        }
        prevOk = true
        v += 2
      }
      // (each station takes the most of its own and its neighbours', so that
      // a ridge between two stations is drawn over too; and never so much
      // that a real hill would be drawn through)
      for (let q = 0; q < bury.length; q += 2) {
        let b = bury[q + 1]
        if (q >= 2 && bury[q - 2] === bury[q] - 2) b = Math.max(b, bury[q - 1])
        if (q + 2 < bury.length && bury[q + 2] === bury[q] + 2) b = Math.max(b, bury[q + 3])
        joins.a[bury[q] * 4 + 3] = joins.a[bury[q] * 4 + 7] = Math.min(b, 4 * Y_PER_M)
      }
      bury.length = 0
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos.done(), 3))
    g.setAttribute('aFlow', new THREE.BufferAttribute(flow.done(), 3))
    g.setAttribute('aSide', new THREE.BufferAttribute(side.done(), 1))
    g.setAttribute('aFade', new THREE.BufferAttribute(fades.done(), 1))
    g.setAttribute('aTau', new THREE.BufferAttribute(taus.done(), 1))
    g.setAttribute('aJoin', new THREE.BufferAttribute(joins.done(), 4))
    g.setIndex(new THREE.BufferAttribute(v <= 65536 ? Uint16Array.from(idx.a.subarray(0, idx.n)) : idx.done(), 1))
    g.computeBoundingSphere()
    this.uniforms = { ...app.shared.uniforms, uFlowAll: { value: 0 } }
    this.material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -3,
      polygonOffsetUnits: -10,
    })
    this.mesh = new THREE.Mesh(g, this.material)
    this.mesh.frustumCulled = false
    this.mesh.renderOrder = 2
    this.app = app
  }

  update() {
    const W = this.app.weather
    // island-wide wetness, from how much of the land is raining lately
    // (it starts out as it is, and then follows the weather over a few
    // seconds, at the same pace whatever the frame rate)
    const target = Math.min(1, W.rainTotal / 600)
    const t = this.app.time
    const k = this.lastTime === undefined ? 1 : 1 - Math.exp(-Math.max(0, t - this.lastTime) / 3)
    this.lastTime = t
    this.uniforms.uFlowAll.value += (target - this.uniforms.uFlowAll.value) * k
    const cam = this.app.camera.position
    this.mesh.visible = cam.y - Math.max(0, this.app.terrain.heightAt(cam.x, cam.z)) < 90
  }
}
