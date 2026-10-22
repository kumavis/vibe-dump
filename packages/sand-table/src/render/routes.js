// Routes over the sea: the voyaging canoes, the war fleets, Cook's ships and
// the trade lanes of public/data/routes.json (DATA.md "Routes"), drawn on the
// far view while the chosen year falls within their dates.
//
// How the app uses it (src/app.js; this module reads nothing else of the app):
//
//   import { Routes, loadRoutes } from './render/routes.js'
//
//   // in start(), after the boundary lines are added to the scene:
//   this.routes = new Routes({ proj: this.data.proj, uniforms: this.shared.uniforms,
//     camera: this.camera, renderer: this.renderer, eras: this.data.eras })
//   this.scene.add(this.routes.group)
//   loadRoutes(this.data, this.warn).then((r) => this.routes.setRoutes(r))
//
//   // in update(dt), after this.lines.update(...):
//   this.routes.visible = this.overlay.routes !== false
//   this.routes.update(this.timeline.year, d, { window: this.timeline.window, light: lightLevel, fill, focus })
//
//   // in settle(), so a screenshot doesn't catch a route halfway faded in:
//   this.routes?.settle(this.timeline.year, g.distance, { window: this.timeline.window, fill, focus })
//
//   // and on teardown: this.routes.dispose()
//
// `window` is the stretch of years whose events show (time.js); without it the
// module works out the same half-an-era-either-side window from the eras.
// `fill` is how much of the screen the island under the camera's target fills
// (0 over open sea, about 1 edge to edge; app.islandFill()), and `focus` the id
// of the event the tour stands on, whose own routes are its story and stay.
//
// The lines are drawn as lines.js draws the boundaries: instanced quads
// widened in screen space and draped on whatever ground is showing, so a
// landing at the end of a route climbs the beach with the terrain. A route
// whose course is a journal's sits solid; one drawn from a narrative is solid
// but finer; a schematic one, or a schematic stretch of another, is a quiet
// dashed line. A soft arrowhead marks where each route ends (both ends, for
// one sailed there and back), and a brightening runs along it in the
// direction of travel, out and back again for a return; dashes march the same
// way, except on a return. The whole layer belongs to the far view:
// it fades in as the chain comes into frame and is gone by the time one
// island fills the screen (by that island's size, not a fixed distance, since
// Hawaiʻi fills the screen from four times as far out as Lānaʻi), all but
// the routes of the event the tour stands on.

import * as THREE from 'three'
import { constants, world, ground } from './shaders/common.glsl.js'

const MAX_SEG = 4 // world units (400 m): long sea crossings need few vertices; the ends still follow the land
const ZOOM_IN = [300, 1000] // camera distance over which routes fade in as the view widens
const FILL_OUT = [0.4, 0.7] // share of the screen one island fills over which the routes fade out
const PULSE_PERIOD = 9 // seconds for the brightening to run a route end to end

// in the family of the boundary lines (lines.js), in the scene's linear light:
// canoes warm sand, war fleets ochre, foreign ships a cool white, lanes muted
const COLOURS = {
  voyage: [1.38, 1.18, 0.86],
  fleet: [1.6, 0.9, 0.52],
  ship: [1.0, 1.1, 1.26],
  trade: [1.15, 1.1, 0.96],
  schematic: [1.25, 1.18, 1.02],
}
// by how a route's points are known: line width (px at DPR 1), opacity, pulse strength
const STYLE = {
  journal: { width: 2.0, opacity: 0.92, pulse: 1.0 },
  narrative: { width: 1.7, opacity: 0.82, pulse: 0.9 },
  schematic: { width: 1.4, opacity: 0.62, pulse: 0.45 },
}
const SPREAD = { day: 0, month: 0, year: 0, decade: 5, generation: 12, century: 50 } // as time.js widens events

const smooth = (a, b, x) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

const vertexShader = /* glsl */ `
${constants}
${world}
${ground}
in vec4 aSeg;    // the segment's ends: ax, az, bx, bz
in vec4 aInfo;   // distance along the route at A and at B (world units), dashed (0/1), arrowhead at B (0/1)
uniform vec2 uResolution;  // drawing buffer, px
uniform float uWidth;      // px
uniform float uHead;       // arrowhead length, px
uniform vec3 uCamPos;
out float vS;
out float vDash;
out float vHead;

vec3 draped(vec2 xz) {
  vec3 p = vec3(xz.x, max(groundMetres(xz), 0.0) * uVert, xz.y);
  p.y += 0.02 + distance(uCamPos, p) * 0.0024;
  return p;
}

void main() {
  vec3 A = draped(aSeg.xy);
  vec3 B = draped(aSeg.zw);
  mat4 pv = projectionMatrix * viewMatrix;
  vec4 ca = pv * vec4(A, 1.0);
  vec4 cb = pv * vec4(B, 1.0);
  const float W0 = 1e-3;
  if (ca.w < W0 && cb.w < W0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  if (ca.w < W0) ca = mix(ca, cb, (W0 - ca.w) / (cb.w - ca.w));
  if (cb.w < W0) cb = mix(cb, ca, (W0 - cb.w) / (ca.w - cb.w));
  vec2 sa = ca.xy / ca.w;
  vec2 sb = cb.xy / cb.w;
  vec2 d = (sb - sa) * uResolution;
  float len = length(d);
  vec2 dir = len > 1e-5 ? d / len : vec2(1.0, 0.0);
  vec2 nrm = vec2(-dir.y, dir.x);
  bool atB = position.x > 0.5;
  vDash = aInfo.z;
  if (aInfo.w > 0.5) {
    // a soft arrowhead at B, pointing along A -> B: the tip a little past B,
    // the base corners behind it (the quad's two B corners meet at the tip)
    vec4 c = cb;
    vec2 px = atB ? dir * uHead * 0.3 : -dir * uHead * 0.7 + nrm * position.y * uHead * 0.42;
    c.xy += px * 2.0 / uResolution * c.w;
    gl_Position = c;
    vS = aInfo.y;
    vHead = atB ? 1.0 : 0.0;
    return;
  }
  vec4 c = atB ? cb : ca;
  // half the width either side, and as far again past each end so the joins close
  vec2 off = (nrm * position.y + dir * (atB ? 0.5 : -0.5)) * uWidth / uResolution;
  c.xy += off * c.w;
  gl_Position = c;
  vS = atB ? aInfo.y : aInfo.x;
  vHead = -1.0;
}
`

const fragmentShader = /* glsl */ `
uniform vec3 uColor;
uniform float uOpacity;
uniform float uDashLen;   // world units per dash and gap
uniform float uMarch;     // how far the dashes have marched, world units
uniform float uPulse;     // where the brightening is, world units along the route
uniform float uPulseLen;  // its reach either side, world units
uniform float uPulseK;
in float vS;
in float vDash;
in float vHead;
void main() {
  float a = uOpacity;
  if (vHead >= 0.0) {
    a *= mix(0.2, 1.0, vHead);
  } else if (vDash > 0.5) {
    float u = (vS - uMarch) / uDashLen;
    float ph = fract(u);
    float w = max(fwidth(u) * 1.2, 1e-3);
    a *= smoothstep(0.0, w, ph) * (1.0 - smoothstep(0.55 - w, 0.55, ph)) * 0.85;
  }
  float g = uPulseK * exp(-pow((vS - uPulse) / max(uPulseLen, 1e-3), 2.0));
  gl_FragColor = vec4(uColor * (1.0 + 0.7 * g), min(1.0, a * (1.0 + 0.6 * g)));
}
`

/** A route's span in fractional years, widened by its precision when it gives only one date (as time.js does for events). */
export function routeSpan(route) {
  const w = route.when || {}
  const parse = (v, end) => {
    const m = String(v ?? '').match(/(-?\d{1,4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/)
    if (!m) return null
    const y = Number(m[1])
    if (m[2]) return y + (Number(m[2]) - 1 + (end ? 1 : 0)) / 12
    return y + (end ? 1 : 0)
  }
  let a = parse(w.from, false)
  let b = parse(w.to ?? w.from, true)
  if (a === null && b === null) return null
  if (a === null) a = b - 1
  if (b === null) b = a + 1
  const s = SPREAD[w.precision] ?? 0
  if (s && b - a <= 1.01) {
    a -= s
    b += s
  }
  return [a, b]
}

/** Fetches routes.json from the app's data base (data/load.js's `abs`, or `base`); an empty list if it can't. */
export async function loadRoutes(data, warn = console.warn) {
  const url = data?.abs ? data.abs('routes.json') : new URL('routes.json', new URL(data?.base || './data/', location.href)).href
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const v = await res.json()
    return Array.isArray(v) ? v : Array.isArray(v?.routes) ? v.routes : []
  } catch (err) {
    warn(`${url}: ${err.message} (no routes)`)
    return []
  }
}

/** One route: its instanced segments and arrowheads, its own uniforms, its fade. */
class RouteLine {
  constructor(route, proj, shared) {
    this.route = route
    this.span = routeSpan(route)
    const prec = STYLE[route.pointPrecision] ? route.pointPrecision : 'schematic'
    this.style = STYLE[prec]
    this.ret = route.direction === 'return'
    const dashedAll = prec === 'schematic'
    const dashedSeg = new Set(route.schematicSegments || [])
    const pts = (route.points || []).map((c) => proj.toWorld(c))
    const seg = []
    const info = []
    let s = 0
    for (let i = 0; i + 1 < pts.length; i++) {
      const [ax, az] = pts[i]
      const [bx, bz] = pts[i + 1]
      const L = Math.hypot(bx - ax, bz - az)
      const n = Math.max(1, Math.ceil(L / MAX_SEG))
      const dash = dashedAll || dashedSeg.has(i) ? 1 : 0
      for (let k = 0; k < n; k++) {
        const t0 = k / n
        const t1 = (k + 1) / n
        seg.push(ax + (bx - ax) * t0, az + (bz - az) * t0, ax + (bx - ax) * t1, az + (bz - az) * t1)
        info.push(s + L * t0, s + L * t1, dash, 0)
      }
      s += L
    }
    this.total = s
    // arrowheads: at the end, and at the start too for a route sailed there and back
    const head = (from, to, at) => {
      seg.push(from[0], from[1], to[0], to[1])
      info.push(at, at, 0, 1)
    }
    if (pts.length >= 2) {
      head(pts.at(-2), pts.at(-1), s)
      if (this.ret) head(pts[1], pts[0], 0)
    }
    const g = new THREE.InstancedBufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, -1, 0, 0, 1, 0, 1, -1, 0, 1, 1, 0]), 3))
    g.setIndex([0, 2, 1, 1, 2, 3])
    const segData = new Float32Array(seg)
    g.setAttribute('aSeg', new THREE.InstancedBufferAttribute(segData, 4))
    g.setAttribute('aInfo', new THREE.InstancedBufferAttribute(new Float32Array(info), 4))
    g.instanceCount = segData.length / 4
    // (bounds by hand: three's would only see the unit quad)
    let x0 = Infinity
    let x1 = -Infinity
    let z0 = Infinity
    let z1 = -Infinity
    for (const [x, z] of pts) {
      x0 = Math.min(x0, x)
      x1 = Math.max(x1, x)
      z0 = Math.min(z0, z)
      z1 = Math.max(z1, z)
    }
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3((x0 + x1) / 2, 60, (z0 + z1) / 2), Math.hypot(x1 - x0, z1 - z0, 300) / 2 + 20)
    this.geometry = g
    const colour = COLOURS[route.kind] || COLOURS.schematic
    this.colour = colour
    this.uniforms = {
      ...shared,
      uResolution: { value: new THREE.Vector2(1, 1) },
      uWidth: { value: this.style.width },
      uHead: { value: 9 },
      uCamPos: { value: new THREE.Vector3() },
      uColor: { value: new THREE.Color(...colour) },
      uOpacity: { value: 0 },
      uDashLen: { value: 30 },
      uMarch: { value: 0 },
      uPulse: { value: -1e6 },
      uPulseLen: { value: 60 },
      uPulseK: { value: this.style.pulse },
    }
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -4,
    })
    this.mesh = new THREE.Mesh(g, this.material)
    this.mesh.renderOrder = 4
    this.mesh.visible = false
    this.k = 0 // its fade in time, eased
    // so that routes showing together don't pulse in step
    this.phase = (hash(route.id || '') % 1000) / 1000
  }

  dispose() {
    this.geometry.dispose()
    this.material.dispose()
  }
}

function hash(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return h >>> 0
}

export class Routes {
  /**
   * @param {object} o
   * @param {object[]} [o.routes] routes.json, if already loaded (else setRoutes later)
   * @param {import('../geo.js').Projection} o.proj the app's projection (data.proj)
   * @param {object} o.uniforms the shared uniforms that carry the ground (app.shared.uniforms)
   * @param {THREE.Camera} o.camera
   * @param {THREE.WebGLRenderer} o.renderer
   * @param {object[]} [o.eras] eras.json, for the time window when update() is given none
   */
  constructor({ routes = [], proj, uniforms, camera, renderer, eras = [] }) {
    this.proj = proj
    this.shared = uniforms
    this.camera = camera
    this.renderer = renderer
    this.eras = [...eras].filter((e) => Number.isFinite(e.year)).sort((a, b) => a.year - b.year)
    this.group = new THREE.Group()
    this.group.name = 'routes'
    this.lines = []
    this.visible = true
    this._res = new THREE.Vector2()
    this._last = null
    this.setRoutes(routes)
  }

  /** (Re)builds the lines from a list of routes. */
  setRoutes(routes) {
    for (const l of this.lines) {
      this.group.remove(l.mesh)
      l.dispose()
    }
    this.lines = []
    for (const r of routes || []) {
      if (!Array.isArray(r.points) || r.points.length < 2) continue
      const l = new RouteLine(r, this.proj, this.shared)
      if (!l.span) continue
      this.lines.push(l)
      this.group.add(l.mesh)
    }
  }

  /** The stretch of years around `year` whose routes show: half an era either side, as time.js. */
  windowAt(year) {
    const E = this.eras
    if (E.length < 2) return [year - 10, year + 10]
    const yearAt = (s) => {
      if (s <= 0) return E[0].year + s * (E[1].year - E[0].year)
      const n = E.length - 1
      if (s >= n) return E[n].year + (s - n) * (E[n].year - E[n - 1].year)
      const i = Math.floor(s)
      return E[i].year + (s - i) * (E[i + 1].year - E[i].year)
    }
    let s = 0
    if (year >= E.at(-1).year) s = E.length - 1
    else if (year > E[0].year) {
      for (let i = 0; i + 1 < E.length; i++) {
        if (year <= E[i + 1].year) {
          s = i + (year - E[i].year) / Math.max(1e-6, E[i + 1].year - E[i].year)
          break
        }
      }
    }
    return [yearAt(s - 0.5), yearAt(s + 0.5)]
  }

  /** The routes showing now (faded in more than halfway), for a legend or a card. */
  visibleRoutes() {
    return this.lines.filter((l) => l.k > 0.5 && l.mesh.visible).map((l) => l.route)
  }

  /**
   * Once a frame. `year` is the timeline's year, `cameraDistance` the rig's
   * distance from its target; `window` (time.js), `light` (0..1, the level
   * the boundary lines are lit by), `fill` and `focus` (see the top) are optional.
   */
  update(year, cameraDistance, { window, light = 1, fill = 0, focus = null } = {}) {
    const now = performance.now() / 1000
    const dt = this._last === null ? 1 : Math.max(0, Math.min(0.1, now - this._last))
    this._last = now
    this.apply(year, cameraDistance, { win: window, light, fill, focus }, now, 1 - Math.exp(-dt * 4))
  }

  /** Every route straight to the fade the view and the year ask for (tools, screenshots). */
  settle(year, cameraDistance, { window, light = 1, fill = 0, focus = null } = {}) {
    this.apply(year, cameraDistance, { win: window, light, fill, focus }, performance.now() / 1000, 1)
  }

  apply(year, d, { win, light, fill, focus }, now, ease) {
    const [wa, wb] = win || this.windowAt(year)
    this.renderer.getDrawingBufferSize(this._res)
    const dpr = this.renderer.getPixelRatio()
    const zoom = this.visible ? smooth(ZOOM_IN[0], ZOOM_IN[1], d) : 0
    const away = 1 - smooth(FILL_OUT[0], FILL_OUT[1], fill)
    const wide = 1 - smooth(800, 4000, d) // a little wider over an island group than over the whole chain
    for (const l of this.lines) {
      const [a, b] = l.span
      const on = b >= wa && a <= wb ? 1 : 0
      l.k += (on - l.k) * ease
      if (Math.abs(on - l.k) < 0.003) l.k = on
      // a route whose own dates hold the year stands out from its neighbours in the window
      const inYear = year >= a && year <= b ? 1 : 0.55
      const mine = focus !== null && l.route.event === focus
      const alpha = l.style.opacity * l.k * zoom * (mine ? 1 : away) * inYear
      l.mesh.visible = alpha > 0.01
      if (!l.mesh.visible) continue
      const u = l.uniforms
      u.uResolution.value.copy(this._res)
      u.uCamPos.value.copy(this.camera.position)
      u.uWidth.value = (l.style.width + 0.6 * wide) * dpr
      u.uHead.value = (8 + 3 * wide) * dpr
      u.uOpacity.value = alpha
      u.uColor.value.setRGB(l.colour[0] * light, l.colour[1] * light, l.colour[2] * light)
      // dashes and the brightening keep a constant size on screen
      u.uDashLen.value = d * 0.016
      u.uPulseLen.value = Math.min(l.total * 0.12, d * 0.035)
      const t = (now / PULSE_PERIOD + l.phase) % 1
      u.uPulse.value = l.ret ? (t < 0.5 ? t * 2 : 2 - t * 2) * l.total : t * l.total
      u.uMarch.value = l.ret ? 0 : (now * d * 0.012) % (d * 0.016)
    }
  }

  dispose() {
    for (const l of this.lines) l.dispose()
    this.lines = []
    this.group.clear()
  }
}
