// Streams and waterfalls, fed by the weather.
//
// Every traced stream is a ribbon of water laid along its channel. How full it
// runs depends on where it rises and on the rain: big windward streams flow all
// year; leeward gulches are dry beds until a Kona storm fills them. Where a
// channel drops steeply the water turns white, and after heavy rain the
// windward pali streams with ribbons of waterfalls that are gone by the next
// dry afternoon — one of the sights of a Hawaiian windward coast.

import * as THREE from 'three'
import { Y_PER_M } from '../config.js'
import { constants, noise, heightFetch, lighting } from '../render/shaders/common.glsl.js'
import { chaikin } from '../gen/division.js'

const vertex = /* glsl */ `
${constants}
in vec3 aFlow; // x along-stream distance, y perennial (0..1), z steepness (0..1)
in float aSide;
uniform sampler2D uWeather;
uniform vec4 uWeatherRect;
out vec3 vWorld;
out vec3 vFlow;
out float vSide;
out float vWet;
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
void main() {
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
  float a = edge * mix(0.7, 0.55, steep) * streaks * smoothstep(0.06, 0.3, flow);
  // fade with distance so far-off falls are a sheen, not a painted line
  a *= 1.0 - smoothstep(12.0, 60.0, distance(cameraPosition, vWorld)) * 0.8;
  gl_FragColor = vec4(col, a);
}
`

export class Streams {
  constructor(app) {
    const meta = app.island.meta
    const T = app.terrain
    const pos = []
    const flow = []
    const side = []
    const idx = []
    let v = 0
    // Biggest first; a smaller stream ends where it meets one already laid.
    // On a flat valley floor D8 runs parallel paths a cell apart, and without
    // this they'd draw as twin lines all the way to the sea.
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
    const sorted = meta.streams.filter((s) => s.area >= 0.9 && s.pts.length >= 3).sort((a, b) => b.area - a.area)
    for (const s of sorted) {
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
      // perennial: by how much rain drains through (area is rain-weighted)
      const per = Math.min(1, Math.max(0, (Math.log10(s.area) - 0.35) / 0.9))
      let along = 0
      const half = Math.min(0.11, 0.009 * Math.sqrt(s.area) + 0.012)
      for (let i = 0; i < pts.length; i++) {
        const a = pts[Math.max(0, i - 1)]
        const b = pts[Math.min(pts.length - 1, i + 1)]
        const dx = b[0] - a[0]
        const dz = b[1] - a[1]
        const l = Math.hypot(dx, dz) || 1
        const nx = -dz / l
        const nz = dx / l
        if (i > 0) along += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
        const x = pts[i][0]
        const z = pts[i][1]
        const hm = T.metresAt(x, z)
        if (hm < -0.5) break
        // steepness from the drop over ~60 m downstream
        const ahead = pts[Math.min(pts.length - 1, i + 2)]
        const drop = (hm - T.metresAt(ahead[0], ahead[1])) / Math.max(10, Math.hypot(ahead[0] - x, ahead[1] - z) * 100)
        const steep = Math.min(1, Math.max(0, (drop - 0.08) / 0.5))
        const w = half * (1 + steep * 0.4)
        const y = Math.max(hm, 0) * Y_PER_M + 0.012 + steep * 0.03
        for (const sd of [-1, 1]) {
          const px = x + nx * w * sd
          const pz = z + nz * w * sd
          // hug the bank: never sink under the ground beside the channel
          const yb = Math.max(y, Math.max(0, T.metresAt(px, pz)) * Y_PER_M + 0.003)
          pos.push(px, yb, pz)
          flow.push(along, per, steep)
          side.push(sd)
        }
        if (i > 0) idx.push(v - 2, v - 1, v, v - 1, v + 1, v)
        v += 2
      }
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    g.setAttribute('aFlow', new THREE.Float32BufferAttribute(flow, 3))
    g.setAttribute('aSide', new THREE.Float32BufferAttribute(side, 1))
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
