// The battles in the district as masses (DESIGN.md §8, the tone rule):
// features.json's `force` lines, each a drift of small soft marks flowing
// along its line in the direction it was taken, Hawaiʻi's in one tone,
// Oʻahu's in another, Maui's (1783) in a third, and its `line` fronts as a
// faint band of their side's colour with a mass standing on it, stirring in
// place. Never individuals and never the dead:
// no figure is drawn, a mark stands for no one, and a mass thins out over the
// last stretch of its line rather than arriving anywhere, so the retreat to
// the head of Nuʻuanu fades before the gap and nothing is drawn at the edge
// of the pali. The one line beyond it, down the old path to Koʻolau (the
// oral account only), is drawn as a thin, faint file that begins below the
// brink.
//
// Which forces show: at a stop of an event's walk, those of that stop. A
// feature that names its stop (`stop`: an index into the event's stops, from
// 0, or a stop's place, or a list of either) shows at the stops it names.
// One that doesn't is placed by inference (stepsAt: the data numbers the
// steps within the event, not by stop, so the stop a step belongs to is found
// from the fronts, each of which stands at the place its stop names). Off the
// tour, in the battle's own year, every one at once, quietly.
//
// The marks are instanced quads facing the camera, laid on the ground of the
// year in the vertex shader (common.glsl.js groundMetres); where each is
// along its line is worked out here each frame, a few thousand of them.

import * as THREE from 'three'
import { constants, noise, world, ground, lighting } from '../render/shaders/common.glsl.js'
import { geometryPoint } from '../geo.js'
import { S } from './kit.js'

// (none of them blue, which on this ground reads as water)
export const ROLE_COLOURS = { hawaii: '#f0ae3c', oahu: '#a88fe6', maui: '#d9703f' }
const FLOW_S = 26 // seconds for a mark to run its line, end to end
const MARK = 3.4 * S // a mark's radius (3.4 m, at the presentation scale): a few pixels at the near zoom

const vertexShader = /* glsl */ `
${constants}
${world}
${ground}
in vec4 aMark;   // x, z, alpha, radius
in vec3 aColour;
uniform float uPxK;    // world units per pixel per unit of distance from the camera
out vec2 vQ;
out float vA;
out vec3 vC;
void main() {
  vQ = position.xy;
  vA = aMark.z;
  vC = aColour;
  if (aMark.z <= 0.002) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  vec3 c = vec3(aMark.x, max(groundMetres(aMark.xy), 0.0) * uVert, aMark.y);
  // (never under a pixel and a half across, however far off)
  float r = max(aMark.w, 1.6 * uPxK * distance(cameraPosition, c));
  // (stood a little off the ground, and facing the camera)
  c.y += r * 0.5;
  vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
  vec3 up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  vec3 p = c + (right * position.x + up * position.y) * r;
  // (a little toward the eye, so the coarser ground mesh away from the camera doesn't swallow it)
  vec3 toCam = cameraPosition - p;
  float dc = length(toCam);
  p += toCam / max(dc, 1e-3) * min(dc * 0.01, 1.0);
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
}
`

const fragmentShader = /* glsl */ `
${constants}
${lighting}
in vec2 vQ;
in float vA;
in vec3 vC;
void main() {
  float r = length(vQ);
  float a = vA * (1.0 - smoothstep(0.35, 1.0, r));
  if (a <= 0.004) discard;
  vec3 light = uSunColor * max(uSunDir.y, 0.0) * 0.7 + uSkyColor * 1.3;
  gl_FragColor = vec4(vC * light * (1.15 - 0.3 * r), a);
}
`

/** A clumped spread of starting points along a line, so a mass has thicker and thinner stretches. */
function clumps(n, rand) {
  const out = new Float32Array(n)
  const centres = Array.from({ length: 5 }, () => rand())
  for (let i = 0; i < n; i++) {
    const c = centres[i % centres.length]
    out[i] = (c + (rand() - 0.5) * (rand() < 0.7 ? 0.16 : 1)) % 1
    if (out[i] < 0) out[i] += 1
  }
  return out
}

export class Forces {
  /** feats: features.json's features; proj: the app's projection; ribbons: features/ribbons.js. */
  constructor(app, feats, shared, ribbons) {
    this.app = app
    let seed = 2026
    const rand = () => {
      seed = (seed * 16807) % 2147483647
      return seed / 2147483647
    }
    this.forces = []
    this.lines = []
    for (const f of feats) {
      const p = f.properties || {}
      if ((p.kind !== 'force' && p.kind !== 'line') || f.geometry?.type !== 'LineString') continue
      const pts = f.geometry.coordinates.map((c) => app.data.proj.toWorld(c))
      const cum = [0]
      for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
      const total = cum.at(-1)
      const rec = { p, pts, cum, total, event: p.event, step: Number.isFinite(p.step) ? p.step : 0, w: 0, goal: 0, stop: p.stop ?? null }
      if (p.kind === 'line') {
        const side = p.side || (p.role === 'advance' ? 'hawaii' : 'oahu')
        rec.batch = ribbons.add([{ pts, width: 0.75 }], { mode: 'band', colour: new THREE.Color(ROLE_COLOURS[side] || '#ffffff').toArray(), alpha: 0, minPx: 6, lift: 0.01, order: 6, endFade: 1.2 })
        rec.mid = geometryPoint(f.geometry)
        this.lines.push(rec)
        // and on it a mass standing: marks spread along the front, stirring in place
        rec.stand = true
        rec.n = Math.round(Math.max(60, Math.min(220, total * 45)))
        rec.half = 0.2
        rec.u0 = Float32Array.from({ length: rec.n }, () => rand())
        rec.lat = Float32Array.from({ length: rec.n }, () => (rand() + rand() + rand()) / 1.5 - 1)
        rec.size = Float32Array.from({ length: rec.n }, () => MARK * (0.7 + 0.6 * rand()))
        rec.colour = new THREE.Color(ROLE_COLOURS[side] || '#ffffff')
        this.forces.push(rec)
      } else {
        // the path down the pali is a file, not a mass
        const file = /path/i.test(p.name || '') && total < 12
        rec.file = file
        rec.n = Math.round(Math.max(90, Math.min(1400, total * (file ? 12 : 40))))
        rec.half = file ? 0.04 : p.role === 'hawaii' ? 0.36 : 0.28
        rec.u0 = clumps(rec.n, rand)
        rec.lat = Float32Array.from({ length: rec.n }, () => (rand() + rand() + rand()) / 1.5 - 1)
        rec.size = Float32Array.from({ length: rec.n }, () => MARK * (0.7 + 0.6 * rand()))
        rec.colour = new THREE.Color(ROLE_COLOURS[p.role] || '#ffffff')
        this.forces.push(rec)
      }
    }
    // the events they belong to, and the years each holds
    this.events = new Map()
    for (const r of new Set([...this.forces, ...this.lines])) {
      if (!r.event) continue
      let e = this.events.get(r.event)
      if (!e) this.events.set(r.event, (e = { id: r.event, from: Infinity, to: -Infinity, recs: [] }))
      e.recs.push(r)
      if (Number.isFinite(r.p.from)) e.from = Math.min(e.from, r.p.from)
      if (Number.isFinite(r.p.to)) e.to = Math.max(e.to, r.p.to)
    }
    // one mesh for every mark
    const total = this.forces.reduce((s, r) => s + r.n, 0)
    this.count = total
    const g = new THREE.InstancedBufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0]), 3))
    g.setIndex([0, 1, 2, 0, 2, 3])
    this.marks = new Float32Array(Math.max(1, total) * 4)
    this.markAttr = new THREE.InstancedBufferAttribute(this.marks, 4)
    this.markAttr.setUsage(THREE.DynamicDrawUsage)
    g.setAttribute('aMark', this.markAttr)
    const colours = new Float32Array(Math.max(1, total) * 3)
    let o = 0
    for (const r of this.forces) {
      r.o = o
      for (let i = 0; i < r.n; i++) r.colour.toArray(colours, (o + i) * 3)
      o += r.n
    }
    g.setAttribute('aColour', new THREE.InstancedBufferAttribute(colours, 3))
    g.instanceCount = total
    this.material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms: { ...shared.uniforms, uPxK: { value: 0.001 } }, transparent: true, depthWrite: false })
    this.mesh = new THREE.Mesh(g, this.material)
    this.mesh.frustumCulled = false
    this.mesh.renderOrder = 7
    this.group = new THREE.Group()
    this.group.add(this.mesh)
    this.time = 0
    this.showing = { event: null, steps: [], quiet: false }
  }

  /**
   * The steps of an event shown at its stop `i`: the steps whose number,
   * moved by the offset the fronts give (a front stands at the place of its
   * stop), is the stop's; the last stop also takes any steps after it.
   */
  stepsAt(ev, i) {
    const e = this.events.get(ev.id)
    const stops = ev.stops || []
    if (!e || i < 0 || i >= stops.length) return []
    const places = this.app.tour?.places
    const proj = this.app.data.proj
    const offsets = []
    for (const r of e.recs) {
      if (r.p.kind !== 'line' || !r.mid) continue
      const [lx, lz] = proj.toWorld(r.mid)
      let best = -1
      let bd = 6 // world units: the front within 600 m of the stop's place
      stops.forEach((s, k) => {
        const pl = places?.get(s.place)
        const pt = pl && geometryPoint(pl.geometry)
        if (!pt) return
        const [x, z] = proj.toWorld(pt)
        const d = Math.hypot(x - lx, z - lz)
        if (d < bd) {
          bd = d
          best = k
        }
      })
      if (best >= 0) offsets.push(best - r.step)
    }
    offsets.sort((a, b) => a - b)
    const off = offsets.length ? offsets[Math.floor(offsets.length / 2)] : 0
    const steps = new Set()
    for (const r of e.recs) {
      const at = r.step + off
      if (at === i || (i === stops.length - 1 && at > i)) steps.add(r.step)
    }
    return [...steps].sort((a, b) => a - b)
  }

  /** The stops of `ev` a feature names (`stop`), or null when it names none. */
  namedStops(r, ev) {
    if (r.stop === null || r.stop === undefined) return null
    const out = []
    for (const v of Array.isArray(r.stop) ? r.stop : [r.stop]) {
      if (Number.isInteger(v)) out.push(v)
      else if (typeof v === 'string') (ev.stops || []).forEach((s, k) => s.place === v && out.push(k))
    }
    return out
  }

  /**
   * What shows of `ev` at its stop i: each feature that names its stops, at
   * those; the rest by the steps stepsAt infers.
   */
  shownAt(ev, i) {
    const e = this.events.get(ev.id)
    const out = new Set()
    if (!e) return out
    let steps = null
    for (const r of e.recs) {
      const named = this.namedStops(r, ev)
      if (named) {
        if (named.includes(i)) out.add(r)
        continue
      }
      steps ||= this.stepsAt(ev, i)
      if (steps.includes(r.step)) out.add(r)
    }
    return out
  }

  /** What shows now: the tour's stop, or the battle's year off the tour. */
  choose() {
    const tour = this.app.tour
    const ev = tour?.active ? tour.event : null
    if (ev && this.events.has(ev.id) && tour.stop >= 0) {
      const recs = this.shownAt(ev, tour.stop)
      return { event: ev.id, recs, steps: [...new Set([...recs].map((r) => r.step))].sort((a, b) => a - b), quiet: false }
    }
    const y = this.app.timeline.year
    for (const e of this.events.values()) if (y >= e.from && y < e.to + 1) return { event: e.id, recs: null, steps: null, quiet: true }
    return { event: null, recs: new Set(), steps: [], quiet: false }
  }

  update(dt, show, distance = 0) {
    // (the masses belong to the near zoom: gone as the view widens past the valley)
    show *= 1 - smooth(75, 140, distance)
    this.time += dt
    const cam = this.app.camera
    this.material.uniforms.uPxK.value = (2 * Math.tan((cam.fov * Math.PI) / 360)) / Math.max(1, innerHeight)
    const now = this.choose()
    this.showing = now
    const ease = dt > 0 ? 1 - Math.exp(-dt * 2) : 1
    for (const r of new Set([...this.forces, ...this.lines])) {
      const on = r.event === now.event && (now.recs === null || now.recs.has(r))
      r.goal = on ? (now.quiet ? 0.2 : 1) : 0
      r.w += (r.goal - r.w) * ease
      if (Math.abs(r.goal - r.w) < 0.003) r.w = r.goal
    }
    for (const r of this.lines) r.batch && (r.batch.uniforms.uAlpha.value = 0.34 * r.w * show)
    const speed = now.quiet ? 0.5 : 1
    const M = this.marks
    // (with nothing showing, and nothing last time, there is nothing to send)
    const any = show > 0.002 && this.forces.some((r) => r.w > 0.002)
    if (!any && !this.wasShowing) {
      this.mesh.visible = false
      this.marksShown = 0
      return
    }
    this.wasShowing = any
    for (const r of this.forces) {
      const a0 = r.w * show * (r.file ? 0.5 : r.stand ? 0.7 : 0.85)
      for (let i = 0; i < r.n; i++) {
        const k = (r.o + i) * 4
        if (a0 <= 0.002) {
          M[k + 2] = 0
          continue
        }
        // a mass taken along its line flows on and thins out over its last
        // stretch, never arriving; one standing on a front stirs in place
        const u = r.stand
          ? Math.min(0.999, Math.max(0, r.u0[i] + Math.sin(this.time * 0.6 + i * 2.3) * 0.015))
          : (r.u0[i] + (this.time * speed) / FLOW_S) % 1
        const env = r.stand ? smooth(0, 0.12, u) * (1 - smooth(0.88, 1, u)) : r.file ? smooth(0.3, 0.45, u) * (1 - smooth(0.8, 0.97, u)) : smooth(0, 0.12, u) * (1 - smooth(0.72, 0.95, u))
        const s = u * r.total
        let j = 1
        while (j < r.cum.length - 1 && r.cum[j] < s) j++
        const a = r.pts[j - 1]
        const b = r.pts[j]
        const L = r.cum[j] - r.cum[j - 1] || 1
        const t = (s - r.cum[j - 1]) / L
        const dx = (b[0] - a[0]) / L
        const dz = (b[1] - a[1]) / L
        // the band narrows toward the ends, and stirs a little as it goes
        const half = r.stand ? r.half : r.half * (0.45 + 0.55 * Math.sin(Math.PI * Math.min(1, u * 1.15)))
        const wob = Math.sin(this.time * 0.7 + i * 1.7) * 0.15
        const off = (r.lat[i] + wob) * half
        M[k] = a[0] + (b[0] - a[0]) * t - dz * off
        M[k + 1] = a[1] + (b[1] - a[1]) * t + dx * off
        M[k + 2] = a0 * env
        M[k + 3] = r.size[i]
      }
    }
    this.markAttr.needsUpdate = true
    this.mesh.visible = show > 0.002 && this.forces.some((r) => r.w > 0.002)
    this.marksShown = 0
    for (const r of this.forces) if (r.w > 0.002) this.marksShown += r.n
  }

  /** For the tools: which forces show, by name (as the tour and the year stand now, not as last drawn). */
  stats() {
    const now = this.choose()
    const on = (r) => r.event === now.event && (now.recs === null || now.recs.has(r))
    return {
      event: now.event,
      steps: now.steps,
      quiet: now.quiet,
      // (how the stop's forces were found: named by the data, inferred, or both)
      by: now.recs ? [...new Set([...now.recs].map((r) => (r.stop === null || r.stop === undefined ? 'inferred' : 'named')))].join('+') || 'none' : 'year',
      forces: this.forces.filter((r) => on(r) && !r.stand).map((r) => r.p.name),
      lines: this.lines.filter(on).map((r) => r.p.name),
      marks: this.count,
      marksShown: this.marksShown ?? 0,
    }
  }

  dispose() {
    this.mesh.geometry.dispose()
    this.material.dispose()
  }
}

function smooth(a, b, x) {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
