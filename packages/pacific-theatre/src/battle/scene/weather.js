// The weather of a box (ENGINEERING.md §7 "Sky"): cloud as a layer of
// instanced puffs at the record's cloud base with its cover, squalls as grey
// curtains over their polygons (moving with their velocity, there only in
// their hours), and the haze from the record's visibility (the box's fog()).
// The puffs are lit by the shared light bag, so a dated dawn or a moonless
// night colours them as it does the sea.

import * as THREE from 'three'
import { constants, noise } from '../../render/shaders/common.glsl.js'
import { logDepthParsVertex, logDepthVertex, logDepthParsFragment, logDepthFragment } from '../../render/shaders/logdepth.glsl.js'

const cloudVert = /* glsl */ `
${logDepthParsVertex}
in vec3 iPos;
in vec2 iSize;   // x width, y height (m)
in float iSeed;
out vec2 vUv;
out float vSeed;
out vec3 vWorld;
void main() {
  vUv = uv;
  vSeed = iSeed;
  vec3 c = (modelMatrix * vec4(iPos, 1.0)).xyz;
  vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
  vec3 up = vec3(0.0, 1.0, 0.0);
  vec3 w = c + right * position.x * iSize.x + up * position.y * iSize.y;
  vWorld = w;
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
  ${logDepthVertex}
}
`
const cloudFrag = /* glsl */ `
${constants}
${noise}
${logDepthParsFragment}
uniform vec3 uSunColor;
uniform vec3 uSkyColor;
uniform vec3 uSunDir;
uniform vec3 uMoonColor;
uniform float uOpacity;
in vec2 vUv;
in float vSeed;
in vec3 vWorld;
void main() {
  ${logDepthFragment}
  vec2 p = vUv * 2.0 - 1.0;
  float n = fbm2(p * 1.6 + vSeed * 31.0);
  float d = length(p * vec2(1.0, 1.6)) + (n - 0.5) * 0.7;
  float a = smoothstep(1.0, 0.45, d) * uOpacity;
  if (a < 0.01) discard;
  // lit from above, shaded below; the sun's colour on the top
  float top = smoothstep(-0.6, 0.8, p.y);
  vec3 col = uSkyColor * (1.1 + 0.4 * top) + uSunColor * max(uSunDir.y, 0.0) * (0.35 + 0.65 * top) + uMoonColor * 0.4 * top;
  gl_FragColor = vec4(col, a);
}
`

const curtainFrag = /* glsl */ `
${constants}
${noise}
${logDepthParsFragment}
uniform vec3 uSkyColor;
uniform vec3 uSunColor;
uniform vec3 uSunDir;
uniform float uTime;
in vec3 vWorld;
in float vH;
void main() {
  ${logDepthFragment}
  // rain: streaks falling through a ragged curtain, densest low down, thin and broken overall
  float along = (vWorld.x + vWorld.z) * 0.02;
  float streak = vnoise(vec2(along * 3.0, vWorld.y * 0.01 + uTime * 0.8));
  float body = fbm2(vec2(along * 0.05, vWorld.y * 0.002 - uTime * 0.01));
  float a = (0.05 + 0.16 * smoothstep(0.35, 0.8, body) + 0.06 * smoothstep(0.55, 0.9, streak));
  a *= (1.0 - smoothstep(0.6, 1.0, vH)) * (0.6 + 0.4 * (1.0 - vH));
  vec3 col = (uSkyColor * 0.9 + uSunColor * max(uSunDir.y, 0.0) * 0.2) * 0.5;
  gl_FragColor = vec4(col, a);
}
`
const curtainVert = /* glsl */ `
${logDepthParsVertex}
in float aH;
out vec3 vWorld;
out float vH;
void main() {
  vH = aH;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
  ${logDepthVertex}
}
`

/** A seeded pseudo-random stream (the clouds are the same every visit). */
function rand(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export class Weather {
  /** light: the shared uniforms; weather: battle.json's; bounds: the box's world rectangle; squalls: the sim's (box metres). */
  constructor(light, weather = {}, bounds, squalls = [], { lowQuality = false } = {}) {
    this.weather = weather
    this.group = new THREE.Group()
    this.group.name = 'weather'
    this.origin = new THREE.Vector3()
    const cloud = weather.cloud || {}
    const cover = Math.max(0, Math.min(1, cloud.cover ?? 0.25))
    const base = cloud.baseM ?? 1200
    const tops = Math.max(base + 200, cloud.topsM ?? base + 800)
    const r = rand(0x5eed + Math.round(base))
    const w = bounds.x1 - bounds.x0
    const h = bounds.z1 - bounds.z0
    const n = Math.round(Math.min(lowQuality ? 300 : 900, cover * 1100))
    const quad = new THREE.PlaneGeometry(1, 1)
    const g = new THREE.InstancedBufferGeometry()
    g.index = quad.index
    g.setAttribute('position', quad.attributes.position)
    g.setAttribute('uv', quad.attributes.uv)
    const pos = new Float32Array(Math.max(1, n) * 3)
    const size = new Float32Array(Math.max(1, n) * 2)
    const seed = new Float32Array(Math.max(1, n))
    // clouds in clumps: a cell centre and a few puffs around it
    this.puffs = []
    for (let i = 0; i < n; i++) {
      const cx = bounds.x0 - w * 0.25 + r() * w * 1.5
      const cz = bounds.z0 - h * 0.25 + r() * h * 1.5
      const sw = 1500 + r() * 2500
      const sh = Math.min(tops - base, 400 + r() * 900)
      this.puffs.push([cx, base + sh * 0.5 + r() * (tops - base - sh) * 0.5, cz])
      size.set([sw, sh], i * 2)
      seed[i] = r()
    }
    this.pos = new THREE.InstancedBufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage)
    g.setAttribute('iPos', this.pos)
    g.setAttribute('iSize', new THREE.InstancedBufferAttribute(size, 2))
    g.setAttribute('iSeed', new THREE.InstancedBufferAttribute(seed, 1))
    g.instanceCount = n
    this.cloudMat = new THREE.ShaderMaterial({ name: 'clouds', vertexShader: cloudVert, fragmentShader: cloudFrag, uniforms: { uSunColor: light.uSunColor, uSkyColor: light.uSkyColor, uSunDir: light.uSunDir, uMoonColor: light.uMoonColor, uOpacity: { value: 0.85 } }, transparent: true, depthWrite: false })
    this.clouds = new THREE.Mesh(g, this.cloudMat)
    this.clouds.frustumCulled = false
    this.clouds.renderOrder = 2
    this.group.add(this.clouds)
    // the wind drifts the clouds
    const wind = weather.wind || {}
    const toward = ((wind.fromDeg ?? 90) + 180) * (Math.PI / 180)
    const kn = wind.kn ?? 8
    this.drift = [Math.sin(toward) * kn * 0.514444, -Math.cos(toward) * kn * 0.514444]
    // squalls: curtains round each polygon, from the sea to the cloud base
    this.squalls = squalls
    this.curtainMat = new THREE.ShaderMaterial({ name: 'squalls', vertexShader: curtainVert, fragmentShader: curtainFrag, uniforms: { uSkyColor: light.uSkyColor, uSunColor: light.uSunColor, uSunDir: light.uSunDir, uTime: light.uTime }, transparent: true, depthWrite: false, side: THREE.DoubleSide })
    this.curtains = squalls.map((sq) => {
      const P = []
      const H = []
      const idx = []
      const poly = sq.poly
      for (let i = 0; i + 1 < poly.length; i++) {
        const [ax, az] = poly[i]
        const [bx, bz] = poly[i + 1]
        const k = P.length / 3
        P.push(ax, 0, az, bx, 0, bz, bx, base, bz, ax, base, az)
        H.push(0, 0, 1, 1)
        idx.push(k, k + 1, k + 2, k, k + 2, k + 3)
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3))
      geo.setAttribute('aH', new THREE.Float32BufferAttribute(H, 1))
      geo.setIndex(idx)
      const mesh = new THREE.Mesh(geo, this.curtainMat)
      mesh.frustumCulled = false
      mesh.renderOrder = 2
      this.group.add(mesh)
      return { mesh, sq }
    })
  }

  /** Once a frame, at battle time t. */
  update(camera, t) {
    this.origin.set(Math.round(camera.position.x / 1024) * 1024, 0, Math.round(camera.position.z / 1024) * 1024)
    const a = this.pos.array
    const dx = this.drift[0] * t * 0.3
    const dz = this.drift[1] * t * 0.3
    for (let i = 0; i < this.puffs.length; i++) {
      const p = this.puffs[i]
      a[3 * i] = p[0] + dx - this.origin.x
      a[3 * i + 1] = p[1]
      a[3 * i + 2] = p[2] + dz - this.origin.z
    }
    this.pos.needsUpdate = true
    this.clouds.position.copy(this.origin)
    for (const c of this.curtains) {
      const sq = c.sq
      c.mesh.visible = t >= sq.t0 && t <= sq.t1
      const d = Number.isFinite(sq.t0) ? t - sq.t0 : 0
      c.mesh.position.set(sq.vx * d, 0, sq.vz * d)
    }
  }

  materials() {
    return [this.cloudMat, this.curtainMat]
  }

  dispose() {
    this.clouds.geometry.dispose()
    this.cloudMat.dispose()
    for (const c of this.curtains) c.mesh.geometry.dispose()
    this.curtainMat.dispose()
  }
}
