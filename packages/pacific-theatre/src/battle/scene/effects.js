// The effects (ENGINEERING.md §7): splashes in the firing ship's dye by day
// and white at night, smoke and fire, gun flashes, flak, explosions, star
// shells, searchlights, tracer, wakes, and the projectiles in flight; drawn
// as two instanced billboard families (alpha and additive) and one instanced
// streak, written relative to an origin near the camera each frame. The sim
// pushes what happened into its effects ring; the scene drains it once a
// frame here, and keeps the emitters that run on (a burning ship's smoke, a
// falling aircraft's trail, a ship's wake) from the sim's state. The eight
// point lights of the night (star shells, searchlight pools, gun flashes,
// fires) are chosen here, nearest the camera first.

import * as THREE from 'three'
import { constants, noise } from '../../render/shaders/common.glsl.js'
import { logDepthParsVertex, logDepthVertex, logDepthParsFragment, logDepthFragment } from '../../render/shaders/logdepth.glsl.js'
import { FX, DYES } from '../sim/effects.js'

// particle kinds (the shader draws each its own way)
const K = { smoke: 0, fire: 1, splash: 2, flash: 3, fireball: 4, flak: 5, star: 6, foam: 7, spark: 8, steam: 9 }
const DYE_RGB = { white: [0.95, 0.97, 1], red: [0.95, 0.35, 0.3], black: [0.25, 0.27, 0.3], blue: [0.4, 0.6, 1], yellow: [1, 0.9, 0.4], green: [0.45, 0.9, 0.5], orange: [1, 0.6, 0.25] }

const vert = /* glsl */ `
${logDepthParsVertex}
in vec3 iPos;      // relative to the origin
in vec4 iData;     // x size (m), y age 0..1, z kind, w seed
in vec4 iColor;    // rgb, a opacity
out vec2 vUv;
out vec4 vData;
out vec4 vColor;
out vec3 vWorld;
uniform float uMinPx;
uniform float uPxPerRad;
void main() {
  vUv = uv;
  vData = iData;
  vColor = iColor;
  float kind = iData.z;
  vec3 c = (modelMatrix * vec4(iPos, 1.0)).xyz;
  float size = iData.x;
  // never smaller than a pixel or two, so a distant splash still reads
  float dist = max(1.0, distance(cameraPosition, c));
  size = max(size, uMinPx * dist / uPxPerRad);
  vec3 right;
  vec3 up;
  if (kind > 6.5 && kind < 7.5) {
    // foam lies on the water
    right = vec3(1.0, 0.0, 0.0);
    up = vec3(0.0, 0.0, 1.0);
    c.y = 0.15;
  } else if (kind > 1.5 && kind < 2.5) {
    // a splash: a column standing up, facing the camera about the vertical
    vec3 toCam = normalize(vec3(cameraPosition.x - c.x, 0.0, cameraPosition.z - c.z));
    right = normalize(cross(vec3(0.0, 1.0, 0.0), toCam));
    up = vec3(0.0, 1.0, 0.0);
  } else {
    right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
    up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  }
  vec2 q = position.xy;
  float h = 1.0;
  if (kind > 1.5 && kind < 2.5) {
    // the column rises and falls: tall and narrow
    float a = iData.y;
    h = 2.6 * sin(min(1.0, a * 1.6) * 3.14159);
    q.y = (q.y + 0.5) * h;
    q.x *= 0.55 + a * 0.6;
  }
  vec3 w = c + right * q.x * size + up * q.y * size;
  vWorld = w;
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
  ${logDepthVertex}
}
`

const frag = /* glsl */ `
${constants}
${noise}
${logDepthParsFragment}
uniform vec3 uSunColor;
uniform vec3 uSkyColor;
uniform vec3 uSunDir;
uniform float uTime;
uniform float uAdditive;
in vec2 vUv;
in vec4 vData;
in vec4 vColor;
in vec3 vWorld;
void main() {
  ${logDepthFragment}
  vec2 p = vUv * 2.0 - 1.0;
  float r = length(p);
  float age = vData.y;
  float kind = vData.z;
  float seed = vData.w;
  float n = vnoise(p * 2.5 + seed * 17.0 + uTime * 0.2);
  float a;
  vec3 col = vColor.rgb;
  vec3 lit = uSunColor * max(uSunDir.y, 0.0) * 0.8 + uSkyColor * 1.2 + vec3(0.02);
  if (kind < 0.5) {
    // smoke: a soft lumpy puff, darkening the dye it was given, fading with age
    a = smoothstep(1.0, 0.35, r + (n - 0.5) * 0.5) * (1.0 - age) * vColor.a;
    col = col * lit;
  } else if (kind < 1.5) {
    // fire: a flickering orange core
    a = smoothstep(1.0, 0.0, r + (n - 0.5) * 0.6) * (1.0 - age);
    col = mix(vec3(1.0, 0.85, 0.4), vec3(1.0, 0.3, 0.05), r) * 3.0;
  } else if (kind < 2.5) {
    // a splash column: white water (or dyed), denser at its foot
    float x = abs(p.x);
    float yy = vUv.y;
    a = smoothstep(1.0, 0.3, x + (n - 0.5) * 0.5) * (1.0 - smoothstep(0.5, 1.0, yy)) * (1.0 - age * age) * vColor.a;
    col = col * (lit + vec3(0.05));
  } else if (kind < 3.5) {
    // a gun flash: brief and blinding
    a = smoothstep(1.0, 0.0, r) * (1.0 - age);
    col = vec3(1.0, 0.75, 0.4) * 6.0;
  } else if (kind < 4.5) {
    // a fireball turning to smoke
    a = smoothstep(1.0, 0.2, r + (n - 0.5) * 0.4) * (1.0 - age);
    col = mix(vec3(1.0, 0.55, 0.15) * 4.0, vec3(0.08) * lit, smoothstep(0.1, 0.5, age));
  } else if (kind < 5.5) {
    // flak: a small dark burst
    a = smoothstep(1.0, 0.4, r + (n - 0.5) * 0.6) * (1.0 - age) * 0.85;
    col = vec3(0.07) * lit + vec3(1.0, 0.6, 0.2) * 4.0 * smoothstep(0.08, 0.0, age) * smoothstep(0.6, 0.0, r);
  } else if (kind < 6.5) {
    // a star shell: a hard white light with a halo
    a = smoothstep(1.0, 0.0, r) * (0.3 + 0.7 * smoothstep(0.25, 0.0, r));
    col = vec3(1.0, 0.97, 0.9) * 8.0;
  } else if (kind < 7.5) {
    // foam on the water: a ragged pale patch
    a = smoothstep(1.0, 0.2, r + (n - 0.5) * 0.7) * (1.0 - age) * vColor.a;
    col = vec3(0.85) * lit;
  } else if (kind < 8.5) {
    // a spark (tracer, a hit)
    a = smoothstep(1.0, 0.0, r) * (1.0 - age);
    col = vColor.rgb * 5.0;
  } else {
    // steam over a sinking ship
    a = smoothstep(1.0, 0.3, r + (n - 0.5) * 0.5) * (1.0 - age) * 0.5;
    col = vec3(0.9) * lit;
  }
  if (a < 0.01) discard;
  gl_FragColor = uAdditive > 0.5 ? vec4(col * a, a) : vec4(col, a);
}
`

class Particles {
  constructor(light, cap, additive) {
    this.cap = cap
    this.n = 0
    this.list = []
    const quad = new THREE.PlaneGeometry(1, 1)
    const g = new THREE.InstancedBufferGeometry()
    g.index = quad.index
    g.setAttribute('position', quad.attributes.position)
    g.setAttribute('uv', quad.attributes.uv)
    this.iPos = new THREE.InstancedBufferAttribute(new Float32Array(cap * 3), 3).setUsage(THREE.DynamicDrawUsage)
    this.iData = new THREE.InstancedBufferAttribute(new Float32Array(cap * 4), 4).setUsage(THREE.DynamicDrawUsage)
    this.iColor = new THREE.InstancedBufferAttribute(new Float32Array(cap * 4), 4).setUsage(THREE.DynamicDrawUsage)
    g.setAttribute('iPos', this.iPos)
    g.setAttribute('iData', this.iData)
    g.setAttribute('iColor', this.iColor)
    g.instanceCount = 0
    this.material = new THREE.ShaderMaterial({
      name: additive ? 'effects-additive' : 'effects-alpha',
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: { uSunColor: light.uSunColor, uSkyColor: light.uSkyColor, uSunDir: light.uSunDir, uTime: light.uTime, uAdditive: { value: additive ? 1 : 0 }, uMinPx: { value: 1.5 }, uPxPerRad: { value: 900 } },
      transparent: true,
      depthWrite: false,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    })
    this.mesh = new THREE.Mesh(g, this.material)
    this.mesh.frustumCulled = false
    this.mesh.renderOrder = additive ? 4 : 3
    this.geometry = g
  }

  /** A particle: { x, y, z, vx, vy, vz, born, life, s0, s1, kind, r, g, b, a, rise, drag } (world metres, s). */
  add(p) {
    if (this.list.length >= this.cap) this.list.shift()
    this.list.push(p)
  }

  update(t, dt, origin) {
    const L = this.list
    let w = 0
    for (let i = 0; i < L.length; i++) {
      const p = L[i]
      const age = (t - p.born) / p.life
      if (age >= 1 || age < -0.01) continue
      L[w++] = p
      const d = p.drag ?? 0
      p.vx *= 1 - d * dt
      p.vz *= 1 - d * dt
      p.vy = p.vy * (1 - d * dt) + (p.rise ?? 0) * dt
      p.x += p.vx * dt
      p.y += p.vy * dt
      p.z += p.vz * dt
    }
    L.length = w
    const n = Math.min(this.cap, L.length)
    const P = this.iPos.array
    const D = this.iData.array
    const C = this.iColor.array
    for (let i = 0; i < n; i++) {
      const p = L[i]
      const age = Math.max(0, (t - p.born) / p.life)
      P[3 * i] = p.x - origin.x
      P[3 * i + 1] = p.y
      P[3 * i + 2] = p.z - origin.z
      D[4 * i] = p.s0 + (p.s1 - p.s0) * Math.sqrt(age)
      D[4 * i + 1] = age
      D[4 * i + 2] = p.kind
      D[4 * i + 3] = p.seed ?? (i * 0.137) % 1
      C[4 * i] = p.r ?? 1
      C[4 * i + 1] = p.g ?? 1
      C[4 * i + 2] = p.b ?? 1
      C[4 * i + 3] = p.a ?? 1
    }
    this.geometry.instanceCount = n
    this.iPos.needsUpdate = true
    this.iData.needsUpdate = true
    this.iColor.needsUpdate = true
    this.mesh.position.copy(origin)
  }

  dispose() {
    this.geometry.dispose()
    this.material.dispose()
  }
}

// projectiles in flight: thin streaks along their velocity
const streakVert = /* glsl */ `
${logDepthParsVertex}
in vec3 iPos;
in vec3 iVel;     // the streak's direction and length (m)
in vec4 iColor;
out vec4 vColor;
out float vT;
uniform float uMinPx;
uniform float uPxPerRad;
void main() {
  vColor = iColor;
  vec3 c = (modelMatrix * vec4(iPos, 1.0)).xyz;
  float dist = max(1.0, distance(cameraPosition, c));
  float wpx = max(0.25, uMinPx * dist / uPxPerRad);
  vec3 dir = iVel;
  float len = length(dir);
  vec3 d = len > 1e-4 ? dir / len : vec3(0.0, 1.0, 0.0);
  vec3 toCam = normalize(cameraPosition - c);
  vec3 side = normalize(cross(d, toCam) + vec3(1e-5));
  vT = position.y + 0.5;
  vec3 w = c - d * len * (position.y + 0.5) + side * position.x * wpx;
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
  ${logDepthVertex}
}
`
const streakFrag = /* glsl */ `
${logDepthParsFragment}
in vec4 vColor;
in float vT;
void main() {
  ${logDepthFragment}
  float a = vColor.a * (1.0 - vT);
  gl_FragColor = vec4(vColor.rgb * a, a);
}
`

class Streaks {
  constructor(cap) {
    this.cap = cap
    const quad = new THREE.PlaneGeometry(1, 1)
    const g = new THREE.InstancedBufferGeometry()
    g.index = quad.index
    g.setAttribute('position', quad.attributes.position)
    this.iPos = new THREE.InstancedBufferAttribute(new Float32Array(cap * 3), 3).setUsage(THREE.DynamicDrawUsage)
    this.iVel = new THREE.InstancedBufferAttribute(new Float32Array(cap * 3), 3).setUsage(THREE.DynamicDrawUsage)
    this.iColor = new THREE.InstancedBufferAttribute(new Float32Array(cap * 4), 4).setUsage(THREE.DynamicDrawUsage)
    g.setAttribute('iPos', this.iPos)
    g.setAttribute('iVel', this.iVel)
    g.setAttribute('iColor', this.iColor)
    g.instanceCount = 0
    this.material = new THREE.ShaderMaterial({ name: 'streaks', vertexShader: streakVert, fragmentShader: streakFrag, uniforms: { uMinPx: { value: 1.2 }, uPxPerRad: { value: 900 } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide })
    this.mesh = new THREE.Mesh(g, this.material)
    this.mesh.frustumCulled = false
    this.mesh.renderOrder = 5
    this.geometry = g
  }

  dispose() {
    this.geometry.dispose()
    this.material.dispose()
  }
}

export class EffectsRenderer {
  /** light: the shared light uniforms (app.light.uniforms). */
  constructor(light, sim, { lowQuality = false } = {}) {
    this.light = light
    this.sim = sim
    this.group = new THREE.Group()
    this.group.name = 'effects'
    this.alpha = new Particles(light, lowQuality ? 900 : 2400, false)
    this.add = new Particles(light, lowQuality ? 300 : 900, true)
    this.streaks = new Streaks(1024)
    this.group.add(this.alpha.mesh, this.add.mesh, this.streaks.mesh)
    this.lights = [] // { x, y, z, r, col: [r, g, b], until }
    this.trails = new Map() // slot → next emission t (falling aircraft, damaged aircraft)
    this.wakeT = new Float64Array(sim.capacity)
    this.smokeT = new Float64Array(sim.capacity)
    this.foamT = new Float64Array(sim.projectiles.capacity)
    this.beams = []
    this.rng = 1
    this.t = 0
    this.night = 0
    this.origin = new THREE.Vector3()
  }

  rand() {
    this.rng = (this.rng * 16807) % 2147483647
    return this.rng / 2147483647
  }

  /** The sim's effects for this frame. */
  drain(sim, wallT) {
    sim.effects.drain((e) => this.effect(e, wallT))
  }

  effect(e, t) {
    const r = () => this.rand()
    const s = this.sim.state
    switch (e.k) {
      case FX.flash: {
        if (e.data === 1) {
          // flak: a dark burst with a spark at its heart
          this.alpha.add({ x: e.x, y: e.y, z: e.z, vx: 0, vy: 0, vz: 0, born: t, life: 5 + r() * 3, s0: 6, s1: 18, kind: K.flak, seed: r() })
          this.lights.push({ x: e.x, y: e.y, z: e.z, r: 250, col: [2, 1.2, 0.5], until: t + 0.15 })
        } else {
          const sz = 8 + e.size * 18
          this.add.add({ x: e.x + e.dx * sz * 0.5, y: e.y, z: e.z + e.dz * sz * 0.5, vx: 0, vy: 0, vz: 0, born: t, life: 0.25, s0: sz, s1: sz * 1.4, kind: K.flash })
          this.alpha.add({ x: e.x + e.dx * sz, y: e.y, z: e.z + e.dz * sz, vx: e.dx * 4, vy: 1.5, vz: e.dz * 4, born: t, life: 12, s0: sz * 0.6, s1: sz * 2.5, kind: K.smoke, r: 0.55, g: 0.55, b: 0.55, a: 0.55, drag: 0.3, seed: r() })
          this.lights.push({ x: e.x, y: e.y + 10, z: e.z, r: 300 + e.size * 300, col: [6, 3.6, 1.6], until: t + 0.2 })
        }
        return
      }
      case FX.splash: {
        const sz = Math.max(2, e.size)
        const dye = this.night > 0.5 ? 'white' : DYES[e.data | 0] || 'white'
        const c = DYE_RGB[dye] || DYE_RGB.white
        this.alpha.add({ x: e.x, y: 0, z: e.z, vx: 0, vy: 0, vz: 0, born: t, life: 3 + sz * 0.05, s0: sz * 0.5, s1: sz * 0.7, kind: K.splash, r: c[0], g: c[1], b: c[2], a: 0.9, seed: r() })
        this.alpha.add({ x: e.x, y: 0, z: e.z, vx: 0, vy: 0, vz: 0, born: t, life: 25, s0: sz * 0.6, s1: sz * 1.8, kind: K.foam, a: 0.7, seed: r() })
        return
      }
      case FX.hit: {
        for (let k = 0; k < 3; k++) this.add.add({ x: e.x, y: e.y, z: e.z, vx: (r() - 0.5) * 30, vy: 10 + r() * 20, vz: (r() - 0.5) * 30, born: t, life: 0.6 + r() * 0.5, s0: 2 + e.size * 4, s1: 1, kind: K.spark, r: 1, g: 0.7, b: 0.3, rise: -9.8 })
        this.add.add({ x: e.x, y: e.y, z: e.z, vx: 0, vy: 0, vz: 0, born: t, life: 0.3, s0: 6 + e.size * 10, s1: 10 + e.size * 14, kind: K.flash })
        this.lights.push({ x: e.x, y: e.y + 5, z: e.z, r: 200, col: [4, 2.4, 1], until: t + 0.25 })
        return
      }
      case FX.explode: {
        const sz = 12 + e.size * 20
        this.add.add({ x: e.x, y: e.y + sz * 0.3, z: e.z, vx: 0, vy: 2, vz: 0, born: t, life: 2.5, s0: sz, s1: sz * 2.2, kind: K.fireball, seed: r() })
        for (let k = 0; k < 3; k++) this.alpha.add({ x: e.x + (r() - 0.5) * sz, y: e.y + sz * 0.5, z: e.z + (r() - 0.5) * sz, vx: (r() - 0.5) * 4, vy: 4 + r() * 4, vz: (r() - 0.5) * 4, born: t + 0.4, life: 40, s0: sz, s1: sz * 4, kind: K.smoke, r: 0.12, g: 0.11, b: 0.1, a: 0.8, drag: 0.1, seed: r() })
        this.lights.push({ x: e.x, y: e.y + sz, z: e.z, r: 700, col: [8, 4, 1.5], until: t + 1.2 })
        return
      }
      case FX.fire:
        return
      case FX.smoke: {
        if (e.data === 1) {
          // a smoke screen laid along a line: big low puffs that drift with the wind
          const n = 24
          for (let k = 0; k <= n; k++) this.alpha.add({ x: e.x + (e.dx * k) / n, y: 25 + r() * 20, z: e.z + (e.dz * k) / n, vx: this.sim.wind.x, vy: 0.2, vz: this.sim.wind.z, born: t, life: Math.min(900, e.size || 600), s0: 150, s1: 420, kind: K.smoke, r: 0.85, g: 0.85, b: 0.85, a: 0.85, seed: r() })
        } else this.trails.set(e.unit, { next: t, until: t + 20, dark: 0.45 })
        return
      }
      case FX.sink:
        for (let k = 0; k < 6; k++) this.alpha.add({ x: e.x + (r() - 0.5) * e.size * 0.6, y: 2, z: e.z + (r() - 0.5) * e.size * 0.6, vx: 0, vy: 1, vz: 0, born: t + k * 3, life: 60, s0: 30, s1: 90, kind: K.steam, seed: r() })
        this.alpha.add({ x: e.x, y: 0, z: e.z, vx: 0, vy: 0, vz: 0, born: t, life: 240, s0: e.size * 0.6, s1: e.size * 1.6, kind: K.foam, a: 0.8, seed: r() })
        return
      case FX.fall:
        this.trails.set(e.unit, { next: t, until: t + 120, dark: e.data === 1 ? 0.7 : 0.15 })
        return
      case FX.gone:
        return
      case FX.starshell:
        this.lights.push({ x: e.x, y: e.y, z: e.z, r: 1800, col: [14, 13, 12], until: t + Math.min(e.size || 45, 60), star: true, vy: -4, born: t })
        return
      case FX.searchlight:
        this.beams.push({ unit: e.unit, dx: e.dx, dz: e.dz, until: t + (e.size || 120) })
        return
      case FX.tracer: {
        // a burst of tracer along a line: a few sparks that fly it
        const len = Math.hypot(e.dx, e.dy, e.dz) || 1
        const isLine = len > 2
        const ux = isLine ? e.dx / len : e.dx
        const uy = isLine ? e.dy / len : e.dy
        const uz = isLine ? e.dz / len : e.dz
        const v = 800
        const n = e.data === 1 ? 6 : 3
        for (let k = 0; k < n; k++) this.add.add({ x: e.x + ux * k * 30, y: e.y + uy * k * 30, z: e.z + uz * k * 30, vx: ux * v, vy: uy * v, vz: uz * v, born: t + k * 0.05, life: Math.min(1.5, (isLine ? len : 600) / v), s0: 1.6, s1: 1.2, kind: K.spark, r: 1, g: 0.85, b: 0.5 })
        return
      }
      case FX.launch:
      case FX.spawn:
      case FX.despawn:
      case FX.wake:
      default:
    }
  }

  /** Once a frame: the continuous emitters, the particles, the streaks and the night's point lights. */
  update(camera, heightPx, t, dt, light) {
    this.t = t
    this.night = light.night ?? 0
    const sim = this.sim
    const s = sim.state
    const r = () => this.rand()
    this.origin.set(Math.round(camera.position.x / 1024) * 1024, 0, Math.round(camera.position.z / 1024) * 1024)
    const camx = camera.position.x
    const camz = camera.position.z
    // burning ships: smoke columns and fire; ships under way: their wakes
    for (let i = 0; i < sim.capacity; i++) {
      const a = s.alive[i]
      if (!a) continue
      const u = sim.units[i]
      const x = s.pos[3 * i]
      const z = s.pos[3 * i + 2]
      const far = Math.hypot(x - camx, z - camz)
      if (u.kind === 'ship') {
        const m = sim._X[i].model
        const fire = s.fire[i]
        if (fire > 0 && t >= this.smokeT[i]) {
          this.smokeT[i] = t + (far > 30000 ? 3 : 0.8) / Math.max(0.3, fire)
          const [fx, fz] = [Math.sin((s.heading[i] * Math.PI) / 180), -Math.cos((s.heading[i] * Math.PI) / 180)]
          const along = (r() - 0.5) * m.L * 0.6
          const px = x + fx * along
          const pz = z + fz * along
          this.alpha.add({ x: px, y: m.deck + 4, z: pz, vx: sim.wind.x * 0.6, vy: 6 + r() * 4, vz: sim.wind.z * 0.6, born: t, life: 70, s0: 12 + m.B * 0.4, s1: 90 + m.B * 2, kind: K.smoke, r: 0.09, g: 0.085, b: 0.08, a: 0.85, drag: 0.02, seed: r() })
          this.add.add({ x: px, y: m.deck + 3, z: pz, vx: 0, vy: 3, vz: 0, born: t, life: 1.4, s0: 6 + m.B * 0.3, s1: 3, kind: K.fire, seed: r() })
          if (this.night > 0.3) this.lights.push({ x: px, y: m.deck + 10, z: pz, r: 180 + m.B * 3, col: [3, 1.5, 0.5], until: t + 1 })
        }
        if (a === 1 && s.speed[i] > 1 && t >= this.wakeT[i] && far < 40000) {
          this.wakeT[i] = t + (far > 15000 ? 4 : 1.5)
          const h = (s.heading[i] * Math.PI) / 180
          const bx = -Math.sin(h)
          const bz = Math.cos(h)
          const k = s.speed[i] / 15
          this.alpha.add({ x: x + bx * m.L * 0.5, y: 0, z: z + bz * m.L * 0.5, vx: 0, vy: 0, vz: 0, born: t, life: 40 + 30 * k, s0: m.B * 0.9, s1: m.B * (2.5 + 2 * k), kind: K.foam, a: Math.min(0.75, 0.3 + 0.4 * k), seed: r() })
          this.alpha.add({ x: x - bx * m.L * 0.45, y: 0, z: z - bz * m.L * 0.45, vx: 0, vy: 0, vz: 0, born: t, life: 8, s0: m.B * 0.6, s1: m.B * 1.6, kind: K.foam, a: Math.min(0.6, 0.25 * k), seed: r() })
        }
      }
    }
    // trails: falling aircraft and the damaged
    for (const [i, tr] of this.trails) {
      if (t > tr.until || !s.alive[i]) {
        this.trails.delete(i)
        continue
      }
      if (t < tr.next) continue
      tr.next = t + 0.25
      const x = s.pos[3 * i]
      const y = s.pos[3 * i + 1]
      const z = s.pos[3 * i + 2]
      this.alpha.add({ x, y, z, vx: 0, vy: 0.5, vz: 0, born: t, life: 18, s0: 4, s1: 22, kind: K.smoke, r: tr.dark, g: tr.dark, b: tr.dark, a: 0.75, seed: r() })
      if (s.alive[i] === 2 && tr.dark < 0.5) this.add.add({ x, y, z, vx: 0, vy: 0, vz: 0, born: t, life: 0.5, s0: 5, s1: 2, kind: K.fire })
    }
    // projectiles: streaks; torpedoes leave foam
    const pr = sim.projectiles
    const st = this.streaks
    let n = 0
    const SP = st.iPos.array
    const SV = st.iVel.array
    const SC = st.iColor.array
    for (let p = 0; p < pr.capacity && n < st.cap; p++) {
      if (!pr.alive[p]) continue
      const o = 3 * p
      const k = pr.kind[p]
      const x = pr.pos[o]
      const y = pr.pos[o + 1]
      const z = pr.pos[o + 2]
      if (k === 3) {
        if (t >= this.foamT[p]) {
          this.foamT[p] = t + 0.6
          this.alpha.add({ x, y: 0, z, vx: 0, vy: 0, vz: 0, born: t, life: 50, s0: 3, s1: 9, kind: K.foam, a: 0.55, seed: r() })
        }
        continue
      }
      const vx = pr.vel[o]
      const vy = pr.vel[o + 1]
      const vz = pr.vel[o + 2]
      const v = Math.hypot(vx, vy, vz) || 1
      const len = k === 1 ? 25 : k === 0 ? Math.min(60, v * 0.04) : 3
      SP[3 * n] = x - this.origin.x
      SP[3 * n + 1] = y
      SP[3 * n + 2] = z - this.origin.z
      SV[3 * n] = (vx / v) * len
      SV[3 * n + 1] = (vy / v) * len
      SV[3 * n + 2] = (vz / v) * len
      // tracer bright; shells a faint glow by day, brighter by night; bombs dark
      const glow = k === 1 ? 1 : k === 0 ? 0.25 + this.night * 0.6 : 0.05
      SC[4 * n] = 1
      SC[4 * n + 1] = k === 1 ? 0.8 : 0.7
      SC[4 * n + 2] = k === 1 ? 0.45 : 0.5
      SC[4 * n + 3] = glow
      n++
    }
    st.geometry.instanceCount = n
    st.iPos.needsUpdate = true
    st.iVel.needsUpdate = true
    st.iColor.needsUpdate = true
    st.mesh.position.copy(this.origin)
    // star shells hang and drift down; searchlight pools light their target
    this.lights = this.lights.filter((l) => l.until > t)
    for (const l of this.lights) {
      if (l.star) {
        l.y = Math.max(50, l.y + l.vy * dt)
        if (!l.sprite || l.spriteT < t) {
          l.spriteT = t + 0.5
          this.add.add({ x: l.x, y: l.y, z: l.z, vx: 0, vy: l.vy, vz: 0, born: t, life: 0.55, s0: 36, s1: 36, kind: K.star })
        }
      }
    }
    this.beams = this.beams.filter((b) => b.until > t && s.alive[b.unit])
    for (const b of this.beams) {
      const i = b.unit
      const L = Math.hypot(b.dx, b.dz) || 1
      this.lights.push({ x: s.pos[3 * i] + b.dx, y: 20, z: s.pos[3 * i + 2] + b.dz, r: 450, col: [9, 9, 8.5], until: t + 0.05 })
      // the beam itself: a line of faint additive puffs
      if (r() < 0.5) for (let k = 1; k < 8; k++) this.add.add({ x: s.pos[3 * i] + (b.dx * k) / 8, y: 25 - k, z: s.pos[3 * i + 2] + (b.dz * k) / 8, vx: 0, vy: 0, vz: 0, born: t, life: 0.12, s0: 10 + k * 8, s1: 10 + k * 8, kind: K.flash })
    }
    this.alpha.update(t, dt, this.origin)
    this.add.update(t, dt, this.origin)
    for (const m of [this.alpha.material, this.add.material, st.material]) m.uniforms.uPxPerRad.value = heightPx / ((camera.fov * Math.PI) / 180)
    // the eight point lights nearest the camera
    const L = light.uniforms
    const cand = this.lights
      .map((l) => ({ l, d: Math.max(0, Math.hypot(l.x - camx, l.y - camera.position.y, l.z - camz) - l.r) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, L.uPointPos.value.length)
    for (let k = 0; k < L.uPointPos.value.length; k++) {
      const c = cand[k]
      if (c) {
        L.uPointPos.value[k].set(c.l.x, c.l.y, c.l.z, c.l.r)
        L.uPointCol.value[k].set(c.l.col[0], c.l.col[1], c.l.col[2])
      } else L.uPointPos.value[k].set(0, -1e9, 0, 1)
    }
    L.uPointCount.value = cand.length
  }

  materials() {
    return [this.alpha.material, this.add.material, this.streaks.material]
  }

  dispose() {
    this.alpha.dispose()
    this.add.dispose()
    this.streaks.dispose()
    this.light.uPointCount.value = 0
  }
}
