// Vessels and crowds in a district (DESIGN.md §14; DATA.md "Vessels and
// crowds"): features.json's `vessel` tracks and `crowd` polygons, a
// departure or a landing drawn as the record describes it.
//
// A vessel is built from its `design` (structures.js): `waa-kaulua`, the
// double-hulled voyaging canoe, from its `length`, `beam`, `masts` and
// `sails`, its sails furled along the boom while `moored`, `anchor`, `tow` or
// `paddle` and set and drawing while `sail`; `waa`, the kit's outrigger
// canoe, paddled by its crew; `motor`, a motor vessel with a wheelhouse; and
// `ship`. A few crew stand on a deck facing forward, or sit pulling their
// paddles (crowd.js draws them with the crowds). A vessel moving draws its
// wake on the water, and one that tows (`escort` names the vessel it
// escorts or tows) its tow line to the bow of the one towed, while both are
// on a `tow` segment. Close in a vessel is its full model; as the view widens
// it gives way, dissolving, to a small hull on the water, kept a few pixels
// long, and with the near zoom's people it is gone past the island zoom.
//
// Where a vessel is: along its track by time. Each vertex has its moment
// (`times`, when the data gives them), else the moments are shared out
// between `when` and `until` over the segments by their lengths at each
// behaviour's pace (a moored or anchored segment takes what is left over).
// A `moored` or `anchor` segment holds the vessel at its start; it heads
// along the track, smoothed over a few tens of seconds either side, and
// while it holds, the way its next segment goes. At a stop of its event
// (`stop` names which, as for the forces; without one it shows at every
// stop of its `event`), the vessels stand where the stop's moment puts them
// (the stop's `when`; failing that, the principal vessel's, momentOf: a
// feature of its own for the stop, as each of the canoe's at Honolua is,
// under way where it passes nearest what the stop looks at, or at its start
// if it only holds; one track over several stops, at its k-th run of one behaviour for its
// k-th stop) and the scene runs on from there, all its
// vessels on one clock RATE times faster than life, for LOOP seconds or up
// to the next stop's moment, then dissolves and begins again. Off the tour
// nothing of a scene shows: it is a moment, not a year.
//
// The crowds show at their stops the same way, standing on the ground
// (crowd.js).

import * as THREE from 'three'
import { Builder, S, objectMaterial } from './kit.js'
import { waa, waaKaulua, motorVessel, ship, hullMark } from './structures.js'
import { People, footMetres } from './crowd.js'
import { geometryPoint } from '../geo.js'

export const DESIGNS = ['waa-kaulua', 'waa', 'motor', 'ship']
export const MOVES = ['moored', 'paddle', 'tow', 'sail', 'anchor', 'under-way']
const HOLDS = new Set(['moored', 'anchor'])
// each behaviour's pace, m/s, where the data gives no moments of its own
const PACE = { paddle: 1.6, tow: 2.4, sail: 3.0, 'under-way': 3.0, moored: 0, anchor: 0 }
// the vessels drawn larger than life, as the village's canoes are (index.js HALE_S)
export const VESSEL_S = S * 1.4
export const RATE = 2
export const LOOP = 45
const DEFAULT_LENGTH = { 'waa-kaulua': 19, waa: 8, motor: 15, ship: 35 }

const smooth = (a, b, x) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
function mulberry32(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const ms = (s) => {
  const t = typeof s === 'string' ? Date.parse(s) : NaN
  return Number.isFinite(t) ? t : NaN
}
const listOf = (v) => (v === null || v === undefined ? null : Array.isArray(v) ? v : [v])

/** The moments of a track's vertices (ms), from `times`, else from when/until by pace. */
export function trackTimes(p, len) {
  const n = len.length + 1
  if (Array.isArray(p.times) && p.times.length === n) {
    const t = p.times.map(ms)
    if (t.every(Number.isFinite)) return t
  }
  const moves = len.map((_, i) => behaviourAt(p, i))
  const t0 = Number.isFinite(ms(p.when)) ? ms(p.when) : 0
  const need = len.map((l, i) => (HOLDS.has(moves[i]) ? 0 : (l * 100) / (PACE[moves[i]] || 2.5)))
  const moving = need.reduce((a, b) => a + b, 0)
  const total = Number.isFinite(ms(p.until)) ? (ms(p.until) - t0) / 1000 : moving
  const held = moves.filter((m) => HOLDS.has(m)).length
  const spare = Math.max(0, total - moving)
  // (too little time for the pace, or nothing that holds to take what is over: the pace is stretched to fit)
  const k = moving > 0 && (total < moving || !held) ? total / moving : 1
  const out = [t0]
  for (let i = 0; i < len.length; i++) out.push(out[i] + 1000 * (HOLDS.has(moves[i]) ? (held ? spare / held : 0) : need[i] * k))
  return out
}
/** The behaviour of segment i: one for the whole track, or one per segment. */
export function behaviourAt(p, i) {
  const b = p.behaviour
  if (Array.isArray(b)) return b[Math.min(i, b.length - 1)] ?? 'sail'
  return b || 'sail'
}

export class Vessels {
  /** feats: features.json's features; own: the district features' uniforms; ground: today's metres at (x, z). */
  constructor(app, feats, shared, own, ground, settlements = null) {
    this.app = app
    this.group = new THREE.Group()
    this.group.name = 'vessels'
    this.vessels = []
    this.crowds = []
    this.materials = []
    this.geometries = []
    const proj = app.data.proj
    this.crewList = []
    for (const f of feats) {
      const p = f.properties || {}
      if (p.kind === 'vessel' && f.geometry?.type === 'LineString' && f.geometry.coordinates.length >= 2) this.vessels.push(this.plan(f, p, proj))
      else if (p.kind === 'crowd' && (f.geometry?.type === 'Polygon' || f.geometry?.type === 'MultiPolygon')) {
        const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates
        for (const [k, poly] of polys.entries()) this.crowds.push({ id: `${f.id ?? p.name}${k ? `-${k}` : ''}`, p, rings: poly.map((r) => r.map((c) => proj.toWorld(c))), w: 0, goal: 0, event: p.event, stop: p.stop })
      }
    }
    const byId = new Map(this.vessels.map((v) => [v.id, v]))
    for (const v of this.vessels) v.towing = v.p.escort ? byId.get(v.p.escort) || null : null
    // (the principal of each event: the one the others escort, else the first)
    for (const v of this.vessels) v.escorted = this.vessels.some((o) => o.towing === v)
    for (const v of this.vessels) this.build(v, shared, own)
    // the tow lines
    for (const v of this.vessels) {
      if (!v.towing || !v.segs.some((s) => s.move === 'tow')) continue
      const g = new THREE.BufferGeometry()
      g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(17 * 3), 3))
      const m = new THREE.LineBasicMaterial({ color: new THREE.Color('#2a241f'), transparent: true, opacity: 0 })
      const line = new THREE.Line(g, m)
      line.frustumCulled = false
      line.renderOrder = 6
      v.line = line
      this.group.add(line)
      this.geometries.push(g)
      this.materials.push(m)
    }
    this.people = new People(app, shared, this.crowds, this.crewList, ground, settlements, VESSEL_S)
    this.group.add(this.people.group)
    this.clock = NaN
    this.t = 0
    this.showing = null
    this._q = new Float32Array(4)
  }

  /** A vessel's record: its track in world units, the moment of each vertex, each segment's behaviour. */
  plan(f, p, proj) {
    const pts = f.geometry.coordinates.map((c) => proj.toWorld(c))
    const len = []
    for (let i = 1; i < pts.length; i++) len.push(Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
    const times = trackTimes(p, len)
    const segs = len.map((l, i) => ({ move: behaviourAt(p, i), len: l, t0: times[i], t1: times[i + 1] }))
    const design = DESIGNS.includes(p.design) ? p.design : 'waa'
    const v = { id: f.id ?? p.name, p, design, pts, times, segs, event: p.event, stop: p.stop, w: 0, goal: 0, x: pts[0][0], z: pts[0][1], a: 0, speed: 0, move: segs[0].move, length: p.length || DEFAULT_LENGTH[design] }
    v.beam = p.beam || (design === 'waa-kaulua' ? v.length * 0.28 : design === 'waa' ? 2.8 : v.length * 0.3)
    // the runs of one behaviour, for a stop with no moment
    v.runs = []
    segs.forEach((s, i) => {
      if (!i || s.move !== segs[i - 1].move) v.runs.push(s.t0)
    })
    return v
  }

  /** The models: full (hull, sails set, sails furled), the small hull, the wake; and the crew's places. */
  build(v, shared, own) {
    const rand = mulberry32(v.id.length * 7919 + v.pts.length)
    const o = { length: v.length, beam: v.beam, masts: v.p.masts, sails: v.p.sails, colours: v.p.colours, design: v.design }
    const mk = (fn, opts = {}) => {
      const B = new Builder()
      B.at(0, 0, 0, 0, opts.scale ?? VESSEL_S)
      const out = fn(B)
      B.done()
      const g = B.geometry()
      const u = { ...own, uShow: { value: 0 } }
      const m = objectMaterial(shared, u, { fade: [400, 500], doubleSide: true })
      const mesh = new THREE.Mesh(g, m)
      mesh.frustumCulled = false
      mesh.visible = false
      this.geometries.push(g)
      this.materials.push(m)
      return { mesh, u, out }
    }
    const group = new THREE.Group()
    v.parts = {}
    let spots = []
    if (v.design === 'waa-kaulua') {
      const h = mk((B) => waaKaulua(B, rand, o, 'hull'))
      spots = h.out
      v.parts.hull = h
      v.parts.set = mk((B) => waaKaulua(B, rand, o, 'set'))
      v.parts.furled = mk((B) => waaKaulua(B, rand, o, 'furled'))
    } else if (v.design === 'motor') {
      const h = mk((B) => motorVessel(B, rand, o))
      spots = h.out
      v.parts.hull = h
    } else if (v.design === 'ship') {
      const h = mk((B) => ship(B, rand, o))
      spots = h.out
      v.parts.hull = h
    } else {
      // (the kit's waʻa, its hull's foot a little under the water; its paddlers in a file along it)
      v.parts.hull = mk((B) => {
        B.at(0, -0.3 * VESSEL_S, 0, 0, VESSEL_S)
        waa(B, rand, v.length)
        B.done()
      }, { scale: 1 })
      const n = Math.max(2, Math.min(6, Math.round(v.length / 3)))
      for (let k = 0; k < n; k++) spots.push([v.length * (0.3 - (0.6 * k) / Math.max(1, n - 1)), 0.25, 0])
    }
    v.parts.mark = mk((B) => hullMark(B, rand, o, false), { scale: 1 })
    if (v.design === 'waa-kaulua') v.parts.markSail = mk((B) => hullMark(B, rand, o, true), { scale: 1 })
    for (const part of Object.values(v.parts)) group.add(part.mesh)
    // the wake: a fan of foam behind the stern on the water
    const wake = this.wake(v)
    group.add(wake)
    v.wake = wake
    v.group = group
    this.group.add(group)
    // the crew, drawn with the crowds (crowd.js), their places from crewAt
    v.spots = spots
    const body = v.design === 'waa' ? 'paddler' : 'man'
    spots.forEach((s, k) => this.crewList.push({ vessel: v.id, v, k, local: s, body, dress: v.p.dress || '1970s' }))
  }

  wake(v) {
    const g = new THREE.PlaneGeometry(1, 1, 1, 1)
    // (in the vessel's terms: x along it, behind the stern; z across)
    g.rotateX(-Math.PI / 2)
    g.translate(-0.5, 0, 0)
    const m = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { uAlpha: { value: 0 }, uTime: { value: 0 }, uSun: { value: 1 } },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() { vUv = vec2(-position.x, position.z); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */ `
        uniform float uAlpha; uniform float uTime; uniform float uSun;
        varying vec2 vUv;
        float h(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
        void main() {
          float u = vUv.x;           // 0 at the stern, 1 at the wake's end
          float a = abs(vUv.y) * 2.0; // 0 on the line of the keel, 1 at the edge
          // the two arms of the V, spreading from the stern, and the churned water between, fading behind
          float arm = 1.0 - smoothstep(0.0, 0.07, abs(a - (0.1 + 0.9 * u)));
          float mid = (1.0 - smoothstep(0.0, 0.35, a)) * (1.0 - smoothstep(0.0, 0.5, u));
          vec2 q = vec2(u * 140.0 - uTime * 3.0, vUv.y * 60.0);
          vec2 qi = floor(q);
          vec2 qf = fract(q);
          qf = qf * qf * (3.0 - 2.0 * qf);
          float n = mix(mix(h(qi), h(qi + vec2(1.0, 0.0)), qf.x), mix(h(qi + vec2(0.0, 1.0)), h(qi + vec2(1.0, 1.0)), qf.x), qf.y);
          float foam = max(arm * (0.55 + 0.45 * n), mid * (0.5 + 0.5 * n));
          float k = foam * (1.0 - smoothstep(0.4, 1.0, u)) * uAlpha;
          if (k < 0.02) discard;
          gl_FragColor = vec4(vec3(0.86, 0.9, 0.92) * (0.55 + 0.45 * uSun), k * 0.55);
        }`,
    })
    const mesh = new THREE.Mesh(g, m)
    mesh.frustumCulled = false
    mesh.renderOrder = 4
    mesh.visible = false
    this.geometries.push(g)
    this.materials.push(m)
    return mesh
  }

  /** Where vessel v is at moment t (ms): [x, z], the segment it is on and its speed (m/s). */
  at(v, t, out = [0, 0]) {
    const T = v.times
    const P = v.pts
    let i = 0
    if (t <= T[0]) i = 0
    else if (t >= T.at(-1)) i = v.segs.length - 1
    else while (i < v.segs.length - 1 && t > T[i + 1]) i++
    const s = v.segs[i]
    const u = HOLDS.has(s.move) || s.t1 <= s.t0 ? (t >= T.at(-1) && !HOLDS.has(s.move) ? 1 : 0) : Math.max(0, Math.min(1, (t - s.t0) / (s.t1 - s.t0)))
    out[0] = P[i][0] + (P[i + 1][0] - P[i][0]) * u
    out[1] = P[i][1] + (P[i + 1][1] - P[i][1]) * u
    out.seg = i
    out.speed = HOLDS.has(s.move) || t < T[0] || t > T.at(-1) || s.t1 <= s.t0 ? 0 : (s.len * 100) / ((s.t1 - s.t0) / 1000)
    return out
  }

  /** The way it heads at t: along the track, smoothed; holding, the way its next moving segment goes. */
  headingAt(v, t) {
    const a = this.at(v, t - 20000, [0, 0])
    const b = this.at(v, t + 20000, [0, 0])
    let dx = b[0] - a[0]
    let dz = b[1] - a[1]
    if (Math.hypot(dx, dz) < 1e-5) {
      const i = this.at(v, t, [0, 0]).seg
      for (let k = i; k < v.segs.length; k++) {
        if (v.segs[k].len > 1e-5) {
          dx = v.pts[k + 1][0] - v.pts[k][0]
          dz = v.pts[k + 1][1] - v.pts[k][1]
          break
        }
      }
    }
    return Math.hypot(dx, dz) > 1e-9 ? Math.atan2(dz, dx) : v.a
  }

  /** Whether a feature with this event and stop shows at stop i of event ev. */
  shows(r, ev, i) {
    if (r.event && r.event !== ev.id) return false
    if (!r.event) return false
    const named = listOf(r.stop)
    if (!named) return true
    return named.some((s) => (Number.isInteger(s) ? s === i : typeof s === 'string' && ev.stops?.[i]?.place === s))
  }

  /** The stop indexes of ev that r shows at, in order. */
  stopsOf(r, ev) {
    const n = ev.stops?.length || 0
    const out = []
    for (let i = 0; i < n; i++) if (this.shows(r, ev, i)) out.push(i)
    return out
  }

  /** The moment of stop i of ev (ms): its own `when`, else the principal's run for it. */
  momentOf(ev, i) {
    const st = ev.stops?.[i]
    const own = ms(st?.when)
    if (Number.isFinite(own)) return own
    const mine = this.vessels.filter((v) => this.shows(v, ev, i))
    const lead = mine.find((v) => v.escorted && !v.towing && v.design === 'waa-kaulua') || mine.find((v) => v.escorted && !v.towing) || mine.find((v) => !v.towing && v.design === 'waa-kaulua') || mine.find((v) => !v.towing) || mine[0]
    if (!lead) return NaN
    const named = this.stopsOf(lead, ev)
    if (named.length > 1) {
      // one track over several stops: the k-th stop at the start of its k-th run of one behaviour
      const k = named.indexOf(i)
      return lead.runs[Math.max(0, Math.min(lead.runs.length - 1, k))]
    }
    // a feature of its own for this stop: one that only holds, at its start; one that moves, under
    // way, the loop passing, a sixth of the way in, where it comes nearest what the stop looks at (its camera's target,
    // else its place), from its first moving segment on
    const go = lead.segs.find((sg) => !HOLDS.has(sg.move))
    if (!go) return lead.times[0]
    const loop = LOOP * RATE * 1000
    const look = st?.camera?.target || (() => {
      const g = this.app.tour?.places?.get(st?.place)?.geometry
      return g ? geometryPoint(g) : null
    })()
    const t0 = go.t0
    const t1 = lead.times.at(-1)
    if (!look || t1 - t0 <= loop) return t0
    const [lx, lz] = this.app.data.proj.toWorld(look)
    let best = t0
    let bd = Infinity
    const p = [0, 0]
    for (let k = 0; k <= 120; k++) {
      const t = t0 + ((t1 - t0) * k) / 120
      this.at(lead, t, p)
      const d = Math.hypot(p[0] - lx, p[1] - lz)
      if (d < bd) {
        bd = d
        best = t
      }
    }
    return Math.max(t0, Math.min(t1 - loop, best - loop / 6))
  }

  /** What shows now: the tour's stop of an event some vessel or crowd belongs to, or nothing. */
  choose() {
    const tour = this.app.tour
    const ev = tour?.active ? tour.event : null
    if (!ev || tour.stop < 0 || ![...this.vessels, ...this.crowds].some((r) => r.event === ev.id)) return null
    if (this.showing?.ev !== ev || this.showing.stop !== tour.stop) {
      const i = tour.stop
      const base = this.momentOf(ev, i)
      // the scene runs on to LOOP seconds at RATE, or to the next stop's moment
      let end = base + LOOP * RATE * 1000
      const next = this.momentOf(ev, i + 1)
      if (Number.isFinite(next) && next > base + 20000) end = Math.min(end, next)
      this.showing = { ev, stop: i, base, end }
      this.t = 0
      this.wrapped = false
    }
    return this.showing
  }

  update(dt, show, distance) {
    const now = this.choose()
    const ease = dt > 0 ? 1 - Math.exp(-dt * 2) : 1
    // (the people and the full models belong to the near zoom; the small hulls reach out past it)
    // (the people at the scene's own scale: they grow too small to draw on their own as the view widens)
    const nearK = show
    const fullK = 1 - smooth(32, 52, distance)
    const markK = show
    if (now && Number.isFinite(now.base)) {
      if (!this.hold) this.t += dt
      const span = Math.max(1, (now.end - now.base) / 1000 / RATE)
      if (this.t > span) {
        this.t %= span
        this.wrapped = true
      }
      this.clock = now.base + this.t * RATE * 1000
    } else this.clock = NaN
    // (dissolving at either end of the loop)
    const span = now ? Math.max(1, (now.end - now.base) / 1000 / RATE) : 1
    // (a scene opens at once; it dissolves at the loop's end and in again at its start)
    const loopK = now ? (this.wrapped ? smooth(0, 0.6, this.t) : 1) * (1 - smooth(span - 0.6, span, this.t)) : 0
    this.loopK = now && (this.hold || dt === 0) ? 1 : loopK
    const cam = this.app.camera
    const tanH = Math.tan((cam.fov * Math.PI) / 360)
    const pxW = (2 * tanH) / Math.max(1, innerHeight)
    const vert = this.app.world.uniforms.uVert.value
    for (const v of this.vessels) {
      v.goal = now && Number.isFinite(this.clock) && this.shows(v, now.ev, now.stop) ? 1 : 0
      v.w += (v.goal - v.w) * ease
      if (Math.abs(v.goal - v.w) < 0.003) v.w = v.goal
      const on = v.w > 0.002 && markK > 0.002
      v.group.visible = on
      if (!on) {
        v.shown = 0
        continue
      }
      const t = this.clock
      if (!Number.isFinite(t)) {
        v.shown = 0
        v.group.visible = false
        continue
      }
      const p = this.at(v, t, [0, 0])
      v.x = p[0]
      v.z = p[1]
      v.seg = p.seg
      v.move = v.segs[p.seg].move
      v.speed = p.speed
      v.a = this.headingAt(v, t)
      v.group.position.set(v.x, 0, v.z)
      v.group.rotation.y = -v.a
      const w = v.w * this.loopK
      v.shown = w * nearK * fullK
      const sail = v.move === 'sail'
      v.sails = v.design === 'waa-kaulua' ? (sail ? 'set' : 'furled') : null
      const set = (part, k) => {
        if (!part) return
        part.u.uShow.value = k
        part.mesh.visible = k > 0.002
      }
      const full = w * nearK * fullK
      set(v.parts.hull, full)
      set(v.parts.set, sail ? full : 0)
      set(v.parts.furled, sail ? 0 : full)
      // the small hull, kept some ten pixels long at the distance it stands
      const d = Math.max(1, Math.hypot(cam.position.x - v.x, cam.position.y, cam.position.z - v.z))
      const Lw = v.length * VESSEL_S
      const sc = Math.max(Lw, 10 * pxW * d)
      const mk = w * markK * (1 - fullK)
      for (const part of [v.parts.mark, v.parts.markSail]) {
        if (!part) continue
        part.mesh.scale.set(sc, sc, sc)
      }
      set(v.parts.mark, v.parts.markSail && sail ? 0 : mk)
      set(v.parts.markSail, sail ? mk : 0)
      // the wake, as long as the speed makes it
      const wk = Math.min(1, v.speed / 2.5)
      v.wake.visible = wk > 0.02 && w * markK > 0.002
      const len = Math.max(Lw * 1.6, Lw * (1.2 + 2.2 * wk)) * Math.max(1, sc / Lw)
      v.wake.scale.set(len, 1, Lw * (v.design === 'waa-kaulua' ? 0.9 : 0.6) * Math.max(1, sc / Lw) * 1.6)
      v.wake.position.set(-Lw * 0.5, 0.004, 0)
      v.wake.material.uniforms.uAlpha.value = wk * w * markK
      v.wake.material.uniforms.uTime.value = this.t
    }
    // the tow lines: from the stern of the one towing to the bow of the one towed, sagging a little
    for (const v of this.vessels) {
      if (!v.line) continue
      const o = v.towing
      const on = v.group.visible && o.group.visible && v.move === 'tow' && o.move === 'tow'
      const k = on ? Math.min(v.shown, o.shown) : 0
      v.towShown = k
      v.line.visible = k > 0.01
      v.line.material.opacity = k
      if (!v.line.visible) continue
      const sx = v.x - Math.cos(v.a) * v.length * VESSEL_S * 0.5
      const sz = v.z - Math.sin(v.a) * v.length * VESSEL_S * 0.5
      const bx = o.x + Math.cos(o.a) * o.length * VESSEL_S * 0.5
      const bz = o.z + Math.sin(o.a) * o.length * VESSEL_S * 0.5
      const h = 1.2 * VESSEL_S * (vert / 0.013)
      const arr = v.line.geometry.attributes.position.array
      for (let q = 0; q <= 16; q++) {
        const u = q / 16
        arr[q * 3] = sx + (bx - sx) * u
        arr[q * 3 + 1] = h * (1 - 0.8 * Math.sin(Math.PI * u))
        arr[q * 3 + 2] = sz + (bz - sz) * u
      }
      v.line.geometry.attributes.position.needsUpdate = true
      v.tow = [sx, sz, bx, bz]
    }
    // the crowds, by the same stops
    for (const c of this.crowds) {
      c.goal = now && Number.isFinite(now.base) && this.shows(c, now.ev, now.stop) ? 1 : now && !Number.isFinite(now.base) && this.shows(c, now.ev, now.stop) ? 1 : 0
      c.w += (c.goal - c.w) * ease
      if (Math.abs(c.goal - c.w) < 0.003) c.w = c.goal
    }
    this.people.update(dt, nearK, (k, out) => {
      const c = this.people.crews[k]
      const v = c.v
      const [lx, ly, lz] = c.local
      const ca = Math.cos(v.a)
      const sa = Math.sin(v.a)
      out[0] = v.x + (lx * ca - lz * sa) * VESSEL_S
      out[1] = v.z + (lx * sa + lz * ca) * VESSEL_S
      out[2] = footMetres(ly, VESSEL_S)
      out[3] = v.a
      out[4] = v.group.visible ? (v.shown || 0) / Math.max(1e-6, nearK) : 0
      out[5] = v.speed
    })
    // (how strongly the stop's own scene is drawn: the pin stands aside for it, as for the forces)
    this.stopShown = Math.max(0, ...this.vessels.map((v) => v.shown || 0), ...this.crowds.map((c) => c.w * nearK))
  }

  /** For the tools: each vessel and crowd as the clock stands now. */
  stats() {
    return {
      stop: this.showing ? this.showing.stop : null,
      event: this.showing?.ev.id ?? null,
      clock: Number.isFinite(this.clock) ? new Date(this.clock).toISOString() : null,
      vessels: this.vessels.map((v) => ({ id: v.id, design: v.design, shown: +(v.shown || 0).toFixed(2), x: v.x, z: v.z, heading: v.a, move: v.move, speed: +v.speed.toFixed(2), sails: v.sails, hulls: v.design === 'waa-kaulua' ? 2 : 1, sailCount: v.design === 'waa-kaulua' ? Math.min(v.p.masts || 2, v.p.sails ?? v.p.masts ?? 2) : 0, wake: v.wake.visible ? +v.wake.material.uniforms.uAlpha.value.toFixed(2) : 0, tow: v.line ? +(v.towShown || 0).toFixed(2) : null, towing: v.towing?.id ?? null })),
      people: this.people.stats(),
    }
  }

  static SCALE = VESSEL_S

  dispose() {
    for (const g of this.geometries) g.dispose()
    for (const m of this.materials) m.dispose()
    this.people.dispose()
    this.disposed = true
  }
}
