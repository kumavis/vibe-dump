import * as THREE from 'three'
import { softDot } from './textures.js'

// Particles, tracers and flashes from a fixed pool — blood puffs, dust,
// splashes, sparks, flare smoke, dilophosaurus spit. Systems call the named
// emitters; nothing here knows about gameplay.

const MAX = 900

class Pool {
  constructor(scene, blending) {
    this.pos = new Float32Array(MAX * 3)
    this.col = new Float32Array(MAX * 3)
    this.size = new Float32Array(MAX)
    this.alpha = new Float32Array(MAX)
    this.vel = new Float32Array(MAX * 3)
    this.life = new Float32Array(MAX)
    this.max = new Float32Array(MAX)
    this.grav = new Float32Array(MAX)
    this.grow = new Float32Array(MAX)
    this.next = 0
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage))
    g.setAttribute('color', new THREE.BufferAttribute(this.col, 3).setUsage(THREE.DynamicDrawUsage))
    g.setAttribute('size', new THREE.BufferAttribute(this.size, 1).setUsage(THREE.DynamicDrawUsage))
    g.setAttribute('alpha', new THREE.BufferAttribute(this.alpha, 1).setUsage(THREE.DynamicDrawUsage))
    this.geo = g
    const mat = new THREE.ShaderMaterial({
      uniforms: { uMap: { value: softDot() }, uScale: { value: 400 } },
      vertexShader: `
        attribute float size; attribute float alpha; attribute vec3 color;
        varying float vA; varying vec3 vC;
        uniform float uScale;
        void main() {
          vA = alpha; vC = color;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * uScale / max(0.1, -mv.z);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        uniform sampler2D uMap; varying float vA; varying vec3 vC;
        void main() {
          vec4 t = texture2D(uMap, gl_PointCoord);
          gl_FragColor = vec4(vC, t.a * vA);
          if (gl_FragColor.a < 0.01) discard;
        }`,
      transparent: true,
      depthWrite: false,
      blending,
    })
    this.points = new THREE.Points(g, mat)
    this.points.frustumCulled = false
    this.points.renderOrder = 5
    scene.add(this.points)
  }
  emit(x, y, z, vx, vy, vz, life, size, r, g, b, grav = 0, grow = 0) {
    const i = this.next
    this.next = (this.next + 1) % MAX
    this.pos.set([x, y, z], i * 3)
    this.vel.set([vx, vy, vz], i * 3)
    this.col.set([r, g, b], i * 3)
    this.life[i] = life
    this.max[i] = life
    this.size[i] = size
    this.grav[i] = grav
    this.grow[i] = grow
    this.alpha[i] = 1
  }
  update(dt) {
    for (let i = 0; i < MAX; i++) {
      if (this.life[i] <= 0) {
        if (this.alpha[i] !== 0) this.alpha[i] = 0
        continue
      }
      this.life[i] -= dt
      const k = i * 3
      this.vel[k + 1] -= this.grav[i] * dt
      this.vel[k] *= 1 - dt * 1.2
      this.vel[k + 2] *= 1 - dt * 1.2
      this.pos[k] += this.vel[k] * dt
      this.pos[k + 1] += this.vel[k + 1] * dt
      this.pos[k + 2] += this.vel[k + 2] * dt
      this.size[i] += this.grow[i] * dt
      const f = this.life[i] / this.max[i]
      this.alpha[i] = Math.min(1, f * 2.5) * (f > 0 ? 1 : 0)
    }
    for (const n of ['position', 'color', 'size', 'alpha']) this.geo.attributes[n].needsUpdate = true
  }
}

export class FX {
  constructor(scene, camera) {
    this.scene = scene
    this.camera = camera
    this.normal = new Pool(scene, THREE.NormalBlending)
    this.add = new Pool(scene, THREE.AdditiveBlending)
    this.tracers = []
    this.flashes = []
    this.flashLight = new THREE.PointLight(0xffc070, 0, 18, 2)
    scene.add(this.flashLight)
    this.flashT = 0
  }

  setScale(px) {
    this.normal.points.material.uniforms.uScale.value = px
    this.add.points.material.uniforms.uScale.value = px
  }

  burst(pool, p, n, spread, up, life, size, col, grav, grow = 0) {
    for (let i = 0; i < n; i++) {
      pool.emit(
        p.x,
        p.y,
        p.z,
        (Math.random() - 0.5) * spread,
        Math.random() * up,
        (Math.random() - 0.5) * spread,
        life * (0.6 + Math.random() * 0.6),
        size * (0.7 + Math.random() * 0.6),
        col[0],
        col[1],
        col[2],
        grav,
        grow,
      )
    }
  }

  blood(p) {
    this.burst(this.normal, p, 10, 2.5, 2, 0.7, 0.12, [0.45, 0.03, 0.02], 6)
  }
  dartHit(p) {
    this.burst(this.normal, p, 4, 0.8, 0.6, 0.4, 0.05, [0.6, 0.1, 0.05], 3)
  }
  dust(p, n = 8) {
    this.burst(this.normal, p, n, 2, 1.5, 0.9, 0.25, [0.45, 0.38, 0.28], 1.5, 0.6)
  }
  splash(p) {
    this.burst(this.normal, p, 14, 2.5, 4, 0.8, 0.12, [0.8, 0.88, 0.92], 9)
  }
  sparks(p) {
    this.burst(this.add, p, 10, 4, 3, 0.4, 0.06, [1, 0.6, 0.2], 9)
  }
  smoke(p, n = 3) {
    this.burst(this.normal, p, n, 0.4, 0.8, 1.6, 0.25, [0.6, 0.6, 0.6], -0.5, 0.5)
  }
  flareSmoke(p) {
    this.normal.emit(p.x, p.y + 0.2, p.z, (Math.random() - 0.5) * 0.4, 1.2, (Math.random() - 0.5) * 0.4, 2.5, 0.35, 0.75, 0.55, 0.55, -0.2, 0.8)
    this.add.emit(p.x, p.y + 0.15, p.z, (Math.random() - 0.5) * 1.5, Math.random() * 2, (Math.random() - 0.5) * 1.5, 0.5, 0.08, 1, 0.35, 0.25, 6)
  }
  rotorDust(p, r) {
    for (let i = 0; i < 3; i++) {
      const a = Math.random() * Math.PI * 2
      this.normal.emit(p.x + Math.cos(a) * r * 0.3, p.y + 0.3, p.z + Math.sin(a) * r * 0.3, Math.cos(a) * 9, 0.6, Math.sin(a) * 9, 1.2, 0.6, 0.55, 0.5, 0.4, 0, 1.5)
    }
  }
  spit(from, to) {
    const dx = to.x - from.x
    const dy = to.y - from.y
    const dz = to.z - from.z
    for (let i = 0; i < 24; i++) {
      const k = 2.4 + Math.random() * 0.6
      this.normal.emit(from.x, from.y, from.z, dx * k * 0.35 + (Math.random() - 0.5), dy * k * 0.35 + 1.5 + Math.random(), dz * k * 0.35 + (Math.random() - 0.5), 0.6, 0.09, 0.45, 0.6, 0.15, 4)
    }
  }
  // game/blast.js: a fireball with a dark column above it and clods thrown
  // out, or on water a spout of spray; `k` scales the lot
  explosion(p, k = 1, wet = false) {
    this.flashLight.position.copy(p)
    this.flashLight.intensity = 400 * k
    this.flashT = 0.12
    if (wet) {
      this.burst(this.normal, p, Math.round(40 * k), 5 * k, 14 * k, 1.4, 0.3 * k, [0.85, 0.9, 0.94], 9, 0.4)
      this.burst(this.normal, p, Math.round(10 * k), 3 * k, 3, 2.2, 0.6 * k, [0.8, 0.86, 0.9], 1, 1.2)
      return
    }
    this.burst(this.add, p, Math.round(26 * k), 7 * k, 5 * k, 0.45, 0.9 * k, [1, 0.55, 0.18], -1, 2.4)
    this.burst(this.add, p, Math.round(12 * k), 3 * k, 3 * k, 0.25, 1.4 * k, [1, 0.85, 0.5], 0, 3)
    this.burst(this.normal, p, Math.round(18 * k), 3 * k, 4 * k, 3.5, 0.8 * k, [0.18, 0.17, 0.16], -0.6, 1.4)
    this.burst(this.normal, p, Math.round(26 * k), 11 * k, 9 * k, 1.4, 0.12 * k, [0.3, 0.25, 0.18], 12)
    this.sparks(p)
  }

  muzzle(p, big) {
    this.flashLight.position.copy(p)
    this.flashLight.intensity = big ? 60 : 8
    this.flashT = 0.06
    this.smoke(p, big ? 4 : 1)
  }

  tracer(a, b) {
    const g = new THREE.BufferGeometry().setFromPoints([a, b])
    const m = new THREE.LineBasicMaterial({ color: 0xfff0c0, transparent: true, opacity: 0.6 })
    const l = new THREE.Line(g, m)
    this.scene.add(l)
    this.tracers.push({ l, t: 0.08 })
  }

  update(dt) {
    this.normal.update(dt)
    this.add.update(dt)
    for (let i = this.tracers.length - 1; i >= 0; i--) {
      const tr = this.tracers[i]
      tr.t -= dt
      tr.l.material.opacity = Math.max(0, tr.t / 0.08) * 0.6
      if (tr.t <= 0) {
        this.scene.remove(tr.l)
        tr.l.geometry.dispose()
        tr.l.material.dispose()
        this.tracers.splice(i, 1)
      }
    }
    this.flashT -= dt
    if (this.flashT <= 0) this.flashLight.intensity = 0
  }
}
