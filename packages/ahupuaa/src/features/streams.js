// Streams and waterfalls, fed by the weather.
//
// Every traced stream is a ribbon of water laid along its channel. How full it
// runs depends on where it rises and on the rain: big windward streams flow all
// year; leeward gulches are dry beds until a Kona storm fills them. Where a
// channel drops steeply the water turns white. Where it drops off a cliff the
// waterfalls (waterfalls.js) take over: the ribbon fades out over the last
// few metres to the brink as the fall fades in over the same stretch, and
// fades back in below it, churned white for a little way.

import * as THREE from 'three'
import { Y_PER_M, WORLD, HALF, HYDRO_RES } from '../config.js'
import { constants, noise, heightFetch, lighting } from '../render/shaders/common.glsl.js'
import { chaikin } from '../gen/division.js'

const vertex = /* glsl */ `
${constants}
in vec3 aFlow; // x along-stream distance, y perennial (0..1), z steepness (0..1)
in float aSide;
in float aFade; // 1, or less where a waterfall takes over
uniform sampler2D uWeather;
uniform vec4 uWeatherRect;
out vec3 vWorld;
out vec3 vFlow;
out float vSide;
out float vWet;
out float vFade;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorld = wp.xyz;
  // far off, the terrain's coarser LOD fills the narrow channels in; draw the
  // water a little toward the eye so it isn't swallowed by its own valley
  vec3 toCam = cameraPosition - wp.xyz;
  float dc = length(toCam);
  wp.xyz += toCam / max(dc, 1e-3) * min(dc * 0.015, 1.2);
  vFlow = aFlow;
  vSide = aSide;
  vFade = aFade;
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
void main() {
  if (vFade < 0.003) discard;
  float flow = clamp(vFlow.y + vWet * 1.4 + uFlowAll * 0.5, 0.0, 1.0);
  if (flow < 0.06) discard;
  // the wetted width grows with the flow; edges thin out
  float edge = 1.0 - smoothstep(flow * 0.3, flow * 0.55 + 0.4, abs(vSide));
  if (edge <= 0.01) discard;
  float steep = vFlow.z;
  vec3 V = normalize(cameraPosition - vWorld);
  vec2 q = vec2(vFlow.x * 18.0 - uTime * (2.0 + steep * 6.0), vSide * 3.0);
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
  float streaks = mix(1.0, 0.45 + 0.55 * smoothstep(0.2, 0.7, vnoise(vec2(vSide * 9.0, vFlow.x * 4.0 - uTime * 3.0))), steep);
  float a = edge * mix(0.7, 0.55, steep) * streaks * smoothstep(0.06, 0.3, flow) * vFade;
  // fade with distance so far-off falls are a sheen, not a painted line
  a *= 1.0 - smoothstep(12.0, 60.0, distance(cameraPosition, vWorld)) * 0.8;
  gl_FragColor = vec4(col, a);
}
`

/**
 * The stream lines as they are drawn: biggest first, each smaller one ending
 * where it meets one already laid (on a flat valley floor D8 runs parallel
 * paths a cell apart, and without this they'd draw as twin lines all the way to
 * the sea), then smoothed. Shared with the waterfall planner, so both agree to
 * the centimetre on where a fall starts along its stream.
 *
 * Each line carries its cumulative length (`along`, world units), the area
 * the generator gave the whole line (`lineA`, which sizes the ribbon), and the
 * drainage area at every point (`area`, for the waterfalls: a traced line only
 * knows the area where it ends, which for a tributary is the junction with
 * something far bigger, so it is read off the grid instead — the best cell
 * around each point, never shrinking downstream).
 */
export function layStreams(meta, data) {
  const laid = new Set()
  const C = 0.2
  const key = (x, z) => Math.floor(x / C) * 100003 + Math.floor(z / C)
  const near = (x, z) => {
    for (let dz = -2; dz <= 2; dz++) for (let dx = -2; dx <= 2; dx++) if (laid.has(key(x + dx * C, z + dz * C))) return true
    return false
  }
  const lay = (pts) => {
    for (let i = 1; i < pts.length; i++) {
      const [ax, az] = pts[i - 1]
      const [bx, bz] = pts[i]
      const n = Math.ceil(Math.hypot(bx - ax, bz - az) / (C * 0.5))
      for (let k = 0; k <= n; k++) laid.add(key(ax + ((bx - ax) * k) / n, az + ((bz - az) * k) / n))
    }
  }
  const N = HYDRO_RES
  const cell = WORLD / N
  const areaAt = (x, z) => {
    const ci = Math.floor((x + HALF) / cell)
    const cj = Math.floor((z + HALF) / cell)
    let best = 0
    for (let j = Math.max(0, cj - 1); j <= Math.min(N - 1, cj + 1); j++) for (let i = Math.max(0, ci - 1); i <= Math.min(N - 1, ci + 1); i++) best = Math.max(best, data.area[j * N + i])
    return best
  }
  const out = []
  const sorted = meta.streams.map((s, k) => ({ s, k })).filter(({ s }) => s.area >= 0.9 && s.pts.length >= 3).sort((a, b) => b.s.area - a.s.area)
  for (const { s, k } of sorted) {
    let cut = s.pts.length
    for (let i = 0; i < s.pts.length; i++) {
      if (near(s.pts[i][0], s.pts[i][1])) {
        cut = i + 1 // run on into the confluence
        break
      }
    }
    if (cut < 3) continue
    let pts = s.pts.slice(0, cut)
    lay(pts)
    pts = chaikin(pts, 2)
    const along = new Float32Array(pts.length)
    const area = new Float32Array(pts.length)
    let run = 0
    for (let i = 0; i < pts.length; i++) {
      if (i > 0) along[i] = along[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
      run = Math.max(run, areaAt(pts[i][0], pts[i][1]))
      area[i] = run
    }
    out.push({ src: k, pts, along, area, lineA: s.area })
  }
  return out
}

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

function applyCuts(line, cuts) {
  const pts = []
  const along = []
  const gone = []
  const fade = []
  const inCut = (s) => cuts.some((c) => s > c.h0 + 1e-6 && s < c.h1 - 1e-6)
  const marks = cuts.flatMap((c) => [c.h0 - c.r0, c.h0 - c.r0 * 0.85, c.h0 - c.r0 * 0.45, c.h0, c.h1, c.h1 + c.r1 * 0.4, c.h1 + c.r1 * 0.85, c.h1 + c.r1]).sort((a, b) => a - b)
  const push = (p, s, g) => {
    pts.push(p)
    along.push(s)
    gone.push(g)
    fade.push(g ? 0 : cutFade(cuts, s))
  }
  for (let i = 0; i < line.pts.length; i++) {
    if (i > 0) {
      const s0 = line.along[i - 1]
      const s1 = line.along[i]
      for (const m of marks) {
        if (m <= s0 + 1e-6 || m >= s1 - 1e-6) continue
        const t = (m - s0) / (s1 - s0)
        const a = line.pts[i - 1]
        const b = line.pts[i]
        push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], m, false)
      }
    }
    push(line.pts[i], line.along[i], inCut(line.along[i]))
  }
  return { pts, along, gone, fade }
}

export class Streams {
  constructor(app) {
    const meta = app.island.meta
    const T = app.terrain
    const pos = []
    const flow = []
    const side = []
    const fades = []
    const idx = []
    let v = 0
    const lines = app.wailele?.lines || layStreams(meta, app.island.data)
    // where a waterfall is drawn the ribbon gives way to it (and the two
    // overlap only where they cross-fade)
    const allCuts = app.wailele?.cuts
    this.cutTris = 0
    for (let k = 0; k < lines.length; k++) {
      const cuts = allCuts?.get(k) || []
      const { pts, along: alongs, gone, fade } = applyCuts(lines[k], cuts)
      // perennial: by how much rain drains through (area is rain-weighted)
      const A = lines[k].lineA
      const per = Math.min(1, Math.max(0, (Math.log10(A) - 0.35) / 0.9))
      const half = Math.min(0.11, 0.009 * Math.sqrt(A) + 0.012)
      const foamAfter = cuts.map((c) => c.h1)
      let cap = Infinity // a pool's level, held for a little way below it
      let capUntil = -1
      let prevOk = false
      for (let i = 0; i < pts.length; i++) {
        const a = pts[Math.max(0, i - 1)]
        const b = pts[Math.min(pts.length - 1, i + 1)]
        const dx = b[0] - a[0]
        const dz = b[1] - a[1]
        const l = Math.hypot(dx, dz) || 1
        const nx = -dz / l
        const nz = dx / l
        const along = alongs[i]
        const x = pts[i][0]
        const z = pts[i][1]
        let hm = T.metresAt(x, z)
        if (hm < -0.5) break
        if (gone[i]) {
          prevOk = false
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
        // steepness from the drop over ~60 m downstream
        const ahead = pts[Math.min(pts.length - 1, i + 2)]
        const drop = (hm - T.metresAt(ahead[0], ahead[1])) / Math.max(10, Math.hypot(ahead[0] - x, ahead[1] - z) * 100)
        let steep = Math.min(1, Math.max(0, (drop - 0.08) / 0.5))
        // the water leaves a plunge pool churned white
        for (const s1 of foamAfter) if (along > s1 - 1e-6 && along <= s1 + 0.4) steep = Math.max(steep, 1 - (along - s1) / 0.4)
        const w = half * (1 + steep * 0.4)
        const y = Math.max(hm, 0) * Y_PER_M + 0.012 + steep * 0.03
        for (const sd of [-1, 1]) {
          const px = x + nx * w * sd
          const pz = z + nz * w * sd
          // hug the bank: never sink under the ground beside the channel (but
          // where a fall has cut a notch, don't climb its walls either)
          let yb = Math.max(y, Math.max(0, T.metresAt(px, pz)) * Y_PER_M + 0.003)
          if (cuts.length) yb = Math.min(yb, y + 0.04)
          pos.push(px, yb, pz)
          flow.push(along, per, steep)
          side.push(sd)
          fades.push(fade[i])
        }
        if (prevOk) {
          idx.push(v - 2, v - 1, v, v - 1, v + 1, v)
          // (dev check: a quad reaching into a cut would double-draw a fall)
          const sPrev = alongs[i - 1]
          if (cuts.some(({ h0, h1 }) => (sPrev > h0 + 1e-6 && sPrev < h1 - 1e-6) || (along > h0 + 1e-6 && along < h1 - 1e-6) || (sPrev < h0 - 1e-6 && along > h1 + 1e-6))) this.cutTris += 2
        }
        prevOk = true
        v += 2
      }
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    g.setAttribute('aFlow', new THREE.Float32BufferAttribute(flow, 3))
    g.setAttribute('aSide', new THREE.Float32BufferAttribute(side, 1))
    g.setAttribute('aFade', new THREE.Float32BufferAttribute(fades, 1))
    g.setIndex(idx)
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
    const target = Math.min(1, W.rainTotal / 600)
    this.uniforms.uFlowAll.value += (target - this.uniforms.uFlowAll.value) * 0.01
    const cam = this.app.camera.position
    this.mesh.visible = cam.y - Math.max(0, this.app.terrain.heightAt(cam.x, cam.z)) < 90
  }
}
