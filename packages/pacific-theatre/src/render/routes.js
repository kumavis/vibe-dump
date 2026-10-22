// Routes over the sea: the fleets' tracks, the strikes, the air and sea lanes,
// the convoys and the schematic arrows of the drives (DATA.md §5), drawn on
// the table while the WarClock's window holds their dates.
//
// How the table uses it (this module reads nothing else of the app):
//
//   import { Routes } from '../render/routes.js'
//   this.routes = new Routes({ routes: data.routes, proj: data.proj, uniforms, camera, renderer,
//     maxSeg: 15, lift: [0.02, 0.0024], height: 300 })
//   scene.add(this.routes.group)
//   // once a frame:
//   this.routes.update(clock.date, rig.state.distance, { window: clock.windowAt(), light, fade, focus })
//   // in settle(), so a screenshot doesn't catch a route halfway faded in:
//   this.routes.settle(clock.date, distance, { window, fade, focus })
//
// `window` is [from, to] in ms UTC (time.js WarClock.windowAt); `fade` is the
// overlays' strength (1 on the table, easing to 0 over the last third of a
// fly-down into a box); `focus` is the id of the event the tour stands on,
// whose own routes are its story and stay.
//
// The lines are drawn as lines.js draws the coast: instanced quads widened in
// screen space and draped on the ground, so a landing at the end of a route
// climbs the beach with the terrain. Styled by how the points are known
// (`pointPrecision`): a report's or a chart's track sits solid; orders and a
// narrative are solid but finer; a schematic one, or a schematic stretch of
// another, is a quiet dashed line. A soft arrowhead marks where each route
// ends (both ends, for one there and back), and a brightening runs along it
// in the direction of travel; dashes march the same way.
//
// Copied from holo-i-ke-au's render/routes.js (b480c27) and adapted: dates in
// ms through time.js's spanOf and the WarClock's window (the year parser
// `routeSpan` carried is gone), the vocabularies of DATA.md §5, the split
// length, lift and bounds in the caller's units, long legs densified in
// lon/lat before projecting, the log-depth chunks, no polygonOffset (it does
// nothing under log depth), and no fade by zoom: on the table routes show at
// every distance and fade only with the fly-down. In a box the same RouteLine
// can draw a unit's recorded track in metres.

import * as THREE from 'three'
import { constants } from './shaders/common.glsl.js'
import { world, ground } from './shaders/ground.glsl.js'
import { logDepthParsVertex, logDepthVertex, logDepthParsFragment, logDepthFragment } from './shaders/logdepth.glsl.js'
import { spanOf } from '../time.js'
import { densifyLonLat } from '../geo.js'

const PULSE_PERIOD = 9 // seconds for the brightening to run a route end to end

// in the family of the coast's ink, in the scene's linear light: fleets a
// warm signal red, strikes amber, the lanes muted, the drives a pale chart
// blue, the schematic quietest
const COLOURS = {
  fleet: [1.45, 0.62, 0.42],
  strike: [1.55, 1.05, 0.45],
  air: [1.1, 1.05, 1.15],
  convoy: [1.0, 1.15, 1.25],
  lane: [0.95, 1.05, 1.1],
  campaign: [0.75, 1.05, 1.45],
  schematic: [1.05, 1.08, 1.12],
}
// by how a route's points are known: line width (px at DPR 1), opacity, pulse strength
const STYLE = {
  report: { width: 2.0, opacity: 0.92, pulse: 1.0 },
  chart: { width: 2.0, opacity: 0.9, pulse: 1.0 },
  orders: { width: 1.6, opacity: 0.8, pulse: 0.8 },
  narrative: { width: 1.7, opacity: 0.82, pulse: 0.9 },
  schematic: { width: 1.4, opacity: 0.62, pulse: 0.45 },
}

const vertexShader = /* glsl */ `
${constants}
${world}
${ground}
${logDepthParsVertex}
in vec4 aSeg;    // the segment's ends: ax, az, bx, bz
in vec4 aInfo;   // distance along the route at A and at B (world units), dashed (0/1), arrowhead at B (0/1)
uniform vec2 uResolution;  // drawing buffer, px
uniform float uWidth;      // px
uniform float uHead;       // arrowhead length, px
uniform vec2 uLift;        // world units off the ground: x + y × the distance to the camera
uniform vec3 uCamPos;
out float vS;
out float vDash;
out float vHead;

vec3 draped(vec2 xz) {
  vec3 p = vec3(xz.x, max(groundMetres(xz), 0.0) * uVert, xz.y);
  p.y += uLift.x + distance(uCamPos, p) * uLift.y;
  return p;
}

void main() {
  vec3 A = draped(aSeg.xy);
  vec3 B = draped(aSeg.zw);
  mat4 pv = projectionMatrix * viewMatrix;
  vec4 ca = pv * vec4(A, 1.0);
  vec4 cb = pv * vec4(B, 1.0);
  vDash = aInfo.z;
  const float W0 = 1e-3;
  if (ca.w < W0 && cb.w < W0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); vS = 0.0; vHead = -1.0; ${logDepthVertex} return; }
  if (ca.w < W0) ca = mix(ca, cb, (W0 - ca.w) / (cb.w - ca.w));
  if (cb.w < W0) cb = mix(cb, ca, (W0 - cb.w) / (ca.w - cb.w));
  vec2 sa = ca.xy / ca.w;
  vec2 sb = cb.xy / cb.w;
  vec2 d = (sb - sa) * uResolution;
  float len = length(d);
  vec2 dir = len > 1e-5 ? d / len : vec2(1.0, 0.0);
  vec2 nrm = vec2(-dir.y, dir.x);
  bool atB = position.x > 0.5;
  if (aInfo.w > 0.5) {
    // a soft arrowhead at B, pointing along A -> B: the tip a little past B,
    // the base corners behind it (the quad's two B corners meet at the tip)
    vec4 c = cb;
    vec2 px = atB ? dir * uHead * 0.3 : -dir * uHead * 0.7 + nrm * position.y * uHead * 0.42;
    c.xy += px * 2.0 / uResolution * c.w;
    gl_Position = c;
    vS = aInfo.y;
    vHead = atB ? 1.0 : 0.0;
  } else {
    vec4 c = atB ? cb : ca;
    // half the width either side, and as far again past each end so the joins close
    vec2 off = (nrm * position.y + dir * (atB ? 0.5 : -0.5)) * uWidth / uResolution;
    c.xy += off * c.w;
    gl_Position = c;
    vS = atB ? aInfo.y : aInfo.x;
    vHead = -1.0;
  }
  ${logDepthVertex}
}
`

const fragmentShader = /* glsl */ `
${logDepthParsFragment}
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
  ${logDepthFragment}
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

/** A route's [from, to) in ms UTC (time.js spanOf), or null if it has no usable when. */
export function routeSpan(route) {
  try {
    return route.when?.from ? spanOf(route.when) : null
  } catch {
    return null
  }
}

/** One route: its instanced segments and arrowheads, its own uniforms, its fade. */
export class RouteLine {
  /**
   * route: a routes.json entry (normalised longitudes), or { points: [[x, z]...] } with `world` set.
   * opts: { maxSeg, lift, height, densifyKm, world }, in the scene's units.
   */
  constructor(route, proj, shared, { maxSeg = 4, lift = [0.02, 0.0024], height = 60, densifyKm = 50, world: inWorld = false } = {}) {
    this.route = route
    this.span = routeSpan(route)
    const prec = STYLE[route.pointPrecision] ? route.pointPrecision : 'schematic'
    this.style = STYLE[prec]
    this.ret = route.direction === 'return'
    const dashedAll = prec === 'schematic' || route.kind === 'schematic'
    const dashedSeg = new Set(route.schematicSegments || [])
    // (each original leg densified in lon/lat, keeping track of which leg a point came from, for the dashes)
    const pts = []
    const legOf = []
    const src = route.points || []
    for (let i = 0; i + 1 < src.length; i++) {
      const leg = inWorld ? [src[i], src[i + 1]] : densifyLonLat([src[i], src[i + 1]], densifyKm)
      for (let k = i === 0 ? 0 : 1; k < leg.length; k++) {
        pts.push(inWorld ? leg[k] : proj.toWorld(leg[k]))
        legOf.push(i)
      }
    }
    const seg = []
    const info = []
    let s = 0
    for (let i = 0; i + 1 < pts.length; i++) {
      const [ax, az] = pts[i]
      const [bx, bz] = pts[i + 1]
      const L = Math.hypot(bx - ax, bz - az)
      const n = Math.max(1, Math.ceil(L / maxSeg))
      const dash = dashedAll || dashedSeg.has(legOf[i + 1]) ? 1 : 0
      for (let k = 0; k < n; k++) {
        const t0 = k / n
        const t1 = (k + 1) / n
        seg.push(ax + (bx - ax) * t0, az + (bz - az) * t0, ax + (bx - ax) * t1, az + (bz - az) * t1)
        info.push(s + L * t0, s + L * t1, dash, 0)
      }
      s += L
    }
    this.total = s
    // arrowheads: at the end, and at the start too for a route there and back
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
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3((x0 + x1) / 2, height / 2, (z0 + z1) / 2), Math.hypot(x1 - x0, z1 - z0, height) / 2 + maxSeg)
    this.geometry = g
    const colour = COLOURS[route.kind] || COLOURS.schematic
    this.colour = colour
    this.uniforms = {
      ...shared,
      uResolution: { value: new THREE.Vector2(1, 1) },
      uWidth: { value: this.style.width },
      uHead: { value: 9 },
      uLift: { value: new THREE.Vector2(lift[0], lift[1]) },
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
   * @param {object[]} [o.routes] routes.json (normalised by data/load.js)
   * @param {object} o.proj the scene's projection (data.proj on the table)
   * @param {object} o.uniforms the scene's bag, light and ground
   * @param {THREE.Camera} o.camera
   * @param {THREE.WebGLRenderer} o.renderer
   * @param {number} [o.maxSeg] split length, world units (10–25 km on the table)
   * @param {number[]} [o.lift] [base, k]: world units, and per unit of camera distance
   * @param {number} [o.height] the tallest the ground gets, world units (for the bounds)
   */
  constructor({ routes = [], proj, uniforms, camera, renderer, maxSeg = 15, lift = [0.02, 0.0024], height = 300 }) {
    this.proj = proj
    this.shared = uniforms
    this.camera = camera
    this.renderer = renderer
    this.lineOpts = { maxSeg, lift, height }
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
      const l = new RouteLine(r, this.proj, this.shared, this.lineOpts)
      if (!l.span) {
        l.dispose()
        continue
      }
      this.lines.push(l)
      this.group.add(l.mesh)
    }
  }

  /** The routes showing now (faded in more than halfway), for a legend or a card. */
  visibleRoutes() {
    return this.lines.filter((l) => l.k > 0.5 && l.mesh.visible).map((l) => l.route)
  }

  /**
   * Once a frame. `date` is the WarClock's (ms UTC), `cameraDistance` the
   * rig's distance from its target; `window` ([from, to] ms), `light` (0..1),
   * `fade` (0..1, the overlays' strength) and `focus` (see the top).
   */
  update(date, cameraDistance, { window, light = 1, fade = 1, focus = null } = {}) {
    const now = performance.now() / 1000
    const dt = this._last === null ? 1 : Math.max(0, Math.min(0.1, now - this._last))
    this._last = now
    this.apply(date, cameraDistance, { win: window, light, fade, focus }, now, 1 - Math.exp(-dt * 4))
  }

  /** Every route straight to the fade the view and the date ask for (tools, screenshots). */
  settle(date, cameraDistance, { window, light = 1, fade = 1, focus = null } = {}) {
    this.apply(date, cameraDistance, { win: window, light, fade, focus }, performance.now() / 1000, 1)
  }

  apply(date, d, { win, light, fade, focus }, now, ease) {
    const [wa, wb] = win || [date - 14 * 86400000, date + 14 * 86400000]
    this.renderer.getDrawingBufferSize(this._res)
    const dpr = this.renderer.getPixelRatio()
    const on0 = this.visible ? fade : 0
    for (const l of this.lines) {
      const [a, b] = l.span
      // (the routes of the event the tour stands on are its story: always on)
      const mine = focus !== null && l.route.event === focus
      const on = mine || (b >= wa && a <= wb) ? 1 : 0
      l.k += (on - l.k) * ease
      if (Math.abs(on - l.k) < 0.003) l.k = on
      // a route whose own dates hold the date stands out from its neighbours in the window
      const inDate = mine || (date >= a && date <= b) ? 1 : 0.55
      const alpha = l.style.opacity * l.k * on0 * inDate
      l.mesh.visible = alpha > 0.01
      if (!l.mesh.visible) continue
      const u = l.uniforms
      u.uResolution.value.copy(this._res)
      u.uCamPos.value.copy(this.camera.position)
      u.uWidth.value = l.style.width * dpr
      u.uHead.value = 9 * dpr
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
