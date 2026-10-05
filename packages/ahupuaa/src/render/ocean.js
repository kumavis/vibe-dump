import * as THREE from 'three'
import { oceanVertex, oceanFragment, SWELL } from './shaders/ocean.glsl.js'

export { SWELL }

// The set schedule, line for line as swellAt() in ocean.glsl.js (see there).
const mod = (x, y) => x - y * Math.floor(x / y)
const swellHash = (n, a, b, c) => {
  const m = mod(n, 101)
  return mod(m * m * a + m * b + c, 101) / 101
}
const setCount = (n) => 3 + Math.floor(swellHash(n, 37, 11, 5) * 4)
const setGap = (n) => 12 + 4 * swellHash(n, 23, 61, 17)
const setStart = (n) => 12 * swellHash(n, 53, 7, 29)
const swellHeight = (n, k) => 0.5 + 0.5 * swellHash(n * 7 + k * 13, 41, 3, 71)

/**
 * Where the set schedule stands at swell time t: `out.age` seconds since the
 * latest set wave arrived, `out.height` of it (0.5..1), `out.next` seconds
 * until the next, and `out.id`, a number unique to each wave.
 */
export function swellAt(t, out) {
  const L = SWELL.cycle
  const n = Math.floor(t / L)
  const u = t - n * L
  const cnt = setCount(n)
  const gap = setGap(n)
  const st = setStart(n)
  let k = Math.floor((u - st) / gap)
  if (k >= 0) {
    k = Math.min(k, cnt - 1)
    out.age = u - st - k * gap
    out.height = swellHeight(n, k)
    out.next = k + 1 < cnt ? st + (k + 1) * gap - u : L + setStart(n + 1) - u
    out.id = n * 8 + k
  } else {
    const c0 = setCount(n - 1)
    out.age = u + L - setStart(n - 1) - (c0 - 1) * setGap(n - 1)
    out.height = swellHeight(n - 1, c0 - 1)
    out.next = st - u
    out.id = (n - 1) * 8 + c0 - 1
  }
  return out
}

// Concentric rings, dense under the camera and huge at the horizon: small
// triangles where depth precision matters, few where it doesn't.
function ringGeometry(r0, r1, segments, rings) {
  const pos = [0, 0, 0]
  for (let r = 0; r <= rings; r++) {
    const rad = r0 * Math.pow(r1 / r0, r / rings)
    for (let s = 0; s < segments; s++) {
      const a = (s / segments) * Math.PI * 2
      pos.push(Math.cos(a) * rad, 0, Math.sin(a) * rad)
    }
  }
  const idx = []
  for (let s = 0; s < segments; s++) idx.push(0, 1 + ((s + 1) % segments), 1 + s)
  for (let r = 0; r < rings; r++) {
    for (let s = 0; s < segments; s++) {
      const a = 1 + r * segments + s
      const b = 1 + r * segments + ((s + 1) % segments)
      const c = a + segments
      const d = b + segments
      idx.push(a, b, c, b, d, c)
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setIndex(idx)
  return g
}

// One big quad that rides along under the camera, so the sea always reaches the
// horizon. Everything interesting — depth colour, reef breakers, caustics,
// fishpond calm — happens per pixel from the height texture.
export class Ocean {
  constructor(shared, heightTex, seaTex) {
    this.uniforms = {
      ...shared.uniforms,
      uHeight: { value: heightTex },
      uSea: { value: seaTex },
      uCamPos: { value: new THREE.Vector3() },
      uWind: { value: new THREE.Vector2(-0.8, 0.45) },
      uSwellDir: { value: new THREE.Vector2(-0.6, 0.8) },
      uSwell: { value: 0.6 },
      uSwellT: { value: 0 },
      uDebug: { value: 0 },
      uHorizonColor: { value: new THREE.Color() },
      uZenithColor: { value: new THREE.Color() },
    }
    const geo = ringGeometry(1.5, 8000, 96, 72)
    this.material = new THREE.ShaderMaterial({
      vertexShader: oceanVertex,
      fragmentShader: oceanFragment,
      uniforms: this.uniforms,
      transparent: true,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      polygonOffsetUnits: -8,
    })
    this.mesh = new THREE.Mesh(geo, this.material)
    this.mesh.frustumCulled = false
    this.mesh.renderOrder = 1
    // the swell keeps its own clock, so a set can be hurried along for someone
    // who has just come to watch (life.js) without touching anything else
    this.swellT = 0
    const d = this.uniforms.uSwellDir.value
    const l = Math.hypot(d.x + 1e-4, d.y + 1e-4)
    this.swellDir = [(d.x + 1e-4) / l, (d.y + 1e-4) / l]
  }

  /** The swell clock where a wave line reaches (x, z), as swellTime() in the shader. */
  swellTimeAt(x, z) {
    return this.swellT - (x * this.swellDir[0] + z * this.swellDir[1]) / SWELL.speed
  }

  update(camera, dt = 0) {
    this.swellT += dt
    this.uniforms.uSwellT.value = this.swellT
    this.uniforms.uCamPos.value.copy(camera.position)
    this.mesh.position.set(camera.position.x, 0, camera.position.z)
  }
}
