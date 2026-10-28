import * as THREE from 'three'
import { FUR_ORDER } from '../models/splat/splats.js'

// ---------------------------------------------------------------------------
// (V3d, DESIGN §4.2.11) Smoke and fire: the Powder Field's wrecks burning.
//
// A vent is a place on the table where something burns (a deck's corner, a
// chimney's top, a pyre, a cart), registered by the TerrainView as the
// chunk that holds it comes onto the table and dropped as it leaves or
// breaks (view/terrain.js ventOn / ventOff), from what the chunk's look
// records (core/terrain/recipes.js: `burn` and `vents`): so where the smoke
// rises is the board's, the same on every screen and in every snap, and
// how it billows is free, on Math.random, as every effect's motion is.
// `burn` 1 smoulders (a grey column and a few embers), 2 burns (flames
// licking up, a thick black column, sparks), 3 is a powder keg's fuse
// sputtering (a spark now and then, no smoke).
//
// Two clouds of camera-facing points, each one draw call whatever the
// number of fires: the smoke (soft discs, blended over what is behind them,
// drawn in the splat furs' renderOrder with the other see-through things in
// the air, view/effects/fx.js's note) and the fire (flames and embers,
// added on, unlit, so they glow). A point is sized in inches, its pixels
// worked out per frame from the camera (uScale), so a column reads the same
// from any distance. Each cloud's particles live in fixed arrays; when a
// cloud is full the oldest goes. Nothing is made until the first vent: a
// table with nothing burning (every set but the Powder Field) makes no
// object (three.js draws Math.random for every object's uuid: the title's
// draws stay where they were).
// ---------------------------------------------------------------------------

const MAX_SMOKE = 1000
const MAX_FIRE = 700
// the wind: where the smoke leans as it rises (inches a second)
const WIND = { x: 0.6, z: 0.22 }

const VERT = /* glsl */ `
attribute float aSize;
attribute vec4 aColor;
uniform float uScale;
varying vec4 vColor;
#include <fog_pars_vertex>
void main() {
  vColor = aColor;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * uScale / max(0.5, -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`
const FRAG = /* glsl */ `
uniform float uSoft;
varying vec4 vColor;
#include <fog_pars_fragment>
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float r = length(d) * 2.0;
  if (r > 1.0) discard;
  float a = vColor.a * pow(1.0 - r, uSoft);
  gl_FragColor = vec4(vColor.rgb, a);
  #include <fog_fragment>
}`

// A cloud of points: position, size (inches) and colour (rgb, alpha) per
// particle, updated on the CPU each frame.
class Cloud {
  constructor(max, { additive, soft }) {
    this.max = max
    this.n = 0
    this.p = []
    const geo = new THREE.BufferGeometry()
    this.pos = new Float32Array(max * 3)
    this.size = new Float32Array(max)
    this.color = new Float32Array(max * 4)
    geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage))
    geo.setAttribute('aSize', new THREE.BufferAttribute(this.size, 1).setUsage(THREE.DynamicDrawUsage))
    geo.setAttribute('aColor', new THREE.BufferAttribute(this.color, 4).setUsage(THREE.DynamicDrawUsage))
    geo.setDrawRange(0, 0)
    const uniforms = THREE.UniformsUtils.merge([THREE.UniformsLib.fog, { uScale: { value: 600 }, uSoft: { value: soft } }])
    const material = new THREE.ShaderMaterial({
      uniforms, vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: false, fog: true,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    })
    this.points = new THREE.Points(geo, material)
    this.points.frustumCulled = false
    this.points.renderOrder = FUR_ORDER
    // the pixels an inch is at a unit's distance: the canvas's height over
    // twice the tangent of half the field of view
    const v = new THREE.Vector2()
    this.points.onBeforeRender = (renderer, scene, camera) => {
      renderer.getDrawingBufferSize(v)
      material.uniforms.uScale.value = v.y / (2 * Math.tan(((camera.fov ?? 45) * Math.PI) / 360))
    }
  }

  spawn(o) {
    if (this.p.length >= this.max) this.p.shift()
    this.p.push(o)
  }

  update(dt) {
    const keep = []
    for (const q of this.p) {
      q.age += dt
      if (q.age >= q.life) continue
      q.vx += (q.ax ?? 0) * dt
      q.vz += (q.az ?? 0) * dt
      q.vy *= Math.exp(-(q.drag ?? 0) * dt)
      q.x += q.vx * dt
      q.y += q.vy * dt
      q.z += q.vz * dt
      keep.push(q)
    }
    this.p = keep
    const { pos, size, color } = this
    let i = 0
    for (const q of keep) {
      const k = q.age / q.life
      pos[i * 3] = q.x
      pos[i * 3 + 1] = q.y
      pos[i * 3 + 2] = q.z
      size[i] = q.s0 + (q.s1 - q.s0) * k
      // (a colour from c0 to c1 over its life; in, out)
      const c0 = q.c0, c1 = q.c1
      color[i * 4] = c0[0] + (c1[0] - c0[0]) * k
      color[i * 4 + 1] = c0[1] + (c1[1] - c0[1]) * k
      color[i * 4 + 2] = c0[2] + (c1[2] - c0[2]) * k
      color[i * 4 + 3] = q.a * Math.min(1, k / (q.fadeIn ?? 0.12)) * (k > q.fadeAt ? 1 - (k - q.fadeAt) / (1 - q.fadeAt) : 1)
      i++
    }
    const geo = this.points.geometry
    geo.setDrawRange(0, i)
    geo.attributes.position.needsUpdate = geo.attributes.aSize.needsUpdate = geo.attributes.aColor.needsUpdate = true
    this.n = i
  }

  dispose() {
    this.points.geometry.dispose()
    this.points.material.dispose()
  }
}

// a colour as [r, g, b] in 0..1, linear (the shader writes it as it is)
const rgb = (hex) => {
  const c = new THREE.Color(hex)
  return [c.r, c.g, c.b]
}
const SMOKE = { burn: [rgb('#26211e'), rgb('#57514c')], smoulder: [rgb('#6f6964'), rgb('#a8a29b')] }
const FLAME = [rgb('#fff1b0'), rgb('#ff4a10')]
const EMBER = [rgb('#ffd27a'), rgb('#ff5a14')]

export class Plumes {
  constructor(scene) {
    this.scene = scene
    // key → [{ x, y, z, burn, t: [smoke, flame, ember] }]: the vents
    // burning, by the chunk that holds them
    this.vents = new Map()
    this.smoke = null
    this.fire = null
  }

  // the clouds, made at the first vent (above: not as the module loads)
  ensure() {
    if (this.smoke) return
    this.smoke = new Cloud(MAX_SMOKE, { additive: false, soft: 1.4 })
    this.fire = new Cloud(MAX_FIRE, { additive: true, soft: 1.8 })
    this.scene.add(this.smoke.points, this.fire.points)
  }

  // `list`: [{ x, y, z, burn }], where chunk `key`'s fires are on the table
  vent(key, list) {
    if (!list.length) return this.unvent(key)
    this.ensure()
    // (each vent's clocks start at a random point of their beat: fires lit
    // together don't puff in step)
    this.vents.set(key, list.map((v) => ({ ...v, t: [Math.random(), Math.random(), Math.random()] })))
  }

  unvent(key) {
    this.vents.delete(key)
  }

  // how many vents burn and particles fly (?debug's view.drawing)
  count() {
    return { vents: [...this.vents.values()].reduce((n, l) => n + l.length, 0), smoke: this.smoke?.n ?? 0, fire: this.fire?.n ?? 0 }
  }

  update(dt) {
    if (!this.smoke) return
    // (a long frame, a tab come back: no burst of a minute's smoke at once)
    const step = Math.min(dt, 0.1)
    for (const list of this.vents.values()) {
      for (const v of list) {
        if (v.burn === 3) {
          v.t[2] += step * 1.6
          while (v.t[2] >= 1) {
            v.t[2] -= 1
            this.spark(v)
          }
          continue
        }
        const hot = v.burn > 1
        v.t[0] += step * (hot ? 7 : 3.6)
        while (v.t[0] >= 1) {
          v.t[0] -= 1
          this.puff(v, hot)
        }
        v.t[1] += step * (hot ? 24 : 0)
        while (v.t[1] >= 1) {
          v.t[1] -= 1
          this.flame(v)
        }
        v.t[2] += step * (hot ? 4.5 : 1.2)
        while (v.t[2] >= 1) {
          v.t[2] -= 1
          this.ember(v)
        }
      }
    }
    this.smoke.update(step)
    this.fire.update(step)
  }

  puff(v, hot) {
    const a = Math.random() * Math.PI * 2, d = Math.random() * 0.18
    const [c0, c1] = hot ? SMOKE.burn : SMOKE.smoulder
    this.smoke.spawn({
      x: v.x + Math.cos(a) * d, y: v.y + 0.1 + Math.random() * 0.2, z: v.z + Math.sin(a) * d,
      vx: (Math.random() - 0.5) * 0.15, vy: (hot ? 1.7 : 1.1) + Math.random() * 0.5, vz: (Math.random() - 0.5) * 0.15,
      ax: WIND.x * 0.2, az: WIND.z * 0.2, drag: 0.1,
      s0: hot ? 0.9 : 0.55, s1: (hot ? 4 : 2.8) + Math.random() * 1.2,
      c0, c1, a: hot ? 0.55 : 0.36, age: 0, life: (hot ? 7.5 : 6) + Math.random() * 2, fadeIn: 0.12, fadeAt: 0.4,
    })
  }

  flame(v) {
    const a = Math.random() * Math.PI * 2, d = Math.random() * 0.25
    this.fire.spawn({
      x: v.x + Math.cos(a) * d, y: v.y + Math.random() * 0.1, z: v.z + Math.sin(a) * d,
      vx: (Math.random() - 0.5) * 0.25, vy: 1.4 + Math.random() * 1, vz: (Math.random() - 0.5) * 0.25,
      drag: 0.6, s0: 0.6 + Math.random() * 0.4, s1: 0.1,
      c0: FLAME[0], c1: FLAME[1], a: 0.85, age: 0, life: 0.45 + Math.random() * 0.35, fadeIn: 0.05, fadeAt: 0.5,
    })
  }

  // a powder keg's fuse sputtering: a bright spark flicked up and off
  spark(v) {
    const a = Math.random() * Math.PI * 2, s = 0.3 + Math.random() * 0.5
    this.fire.spawn({
      x: v.x, y: v.y, z: v.z,
      vx: Math.cos(a) * s, vy: 0.8 + Math.random() * 1.2, vz: Math.sin(a) * s,
      drag: 0.5, s0: 0.14, s1: 0.04,
      c0: FLAME[0], c1: EMBER[1], a: 1, age: 0, life: 0.35 + Math.random() * 0.3, fadeIn: 0.02, fadeAt: 0.5,
    })
  }

  ember(v) {
    const a = Math.random() * Math.PI * 2, s = 0.2 + Math.random() * 0.4
    this.fire.spawn({
      x: v.x + Math.cos(a) * 0.2, y: v.y + 0.15, z: v.z + Math.sin(a) * 0.2,
      vx: Math.cos(a) * s, vy: 1.6 + Math.random() * 1.6, vz: Math.sin(a) * s,
      ax: WIND.x * 0.5, az: WIND.z * 0.5, drag: 0.3, s0: 0.11, s1: 0.05,
      c0: EMBER[0], c1: EMBER[1], a: 1, age: 0, life: 1.4 + Math.random() * 1.2, fadeIn: 0.02, fadeAt: 0.6,
    })
  }
}
