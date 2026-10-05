import * as THREE from 'three'
import { tween, easeOut, clock } from './util.js'

// ---------------------------------------------------------------------------
// Effects: pooled instanced particles (debris cubes, unlit glow motes, smoke
// puffs), lobbed projectiles, blast flashes, scorch marks, template rings and
// floating damage numbers. Nothing here knows any rules.
// ---------------------------------------------------------------------------

const MAX_CUBES = 900
const MAX_GLOW = 700
const MAX_PUFF = 260
const tmpM = new THREE.Matrix4()
const tmpQ = new THREE.Quaternion()
const tmpE = new THREE.Euler()
const tmpV = new THREE.Vector3()
const tmpS = new THREE.Vector3()
const tmpC = new THREE.Color()

class Pool {
  constructor(mesh, max) {
    this.mesh = mesh
    this.max = max
    this.items = []
    this.free = []
    for (let i = max - 1; i >= 0; i--) this.free.push(i)
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    mesh.frustumCulled = false
    tmpM.makeScale(0, 0, 0)
    for (let i = 0; i < max; i++) {
      mesh.setMatrixAt(i, tmpM)
      mesh.setColorAt(i, tmpC.set(0xffffff))
    }
  }
  spawn(p) {
    if (!this.free.length) {
      // recycle the oldest so a huge blast never silently drops its debris
      const old = this.items.shift()
      this.free.push(old.i)
    }
    p.i = this.free.pop()
    this.mesh.setColorAt(p.i, tmpC.set(p.color))
    this.mesh.instanceColor.needsUpdate = true
    this.items.push(p)
  }
  update(dt) {
    const keep = []
    for (const p of this.items) {
      p.age += dt
      if (p.age >= p.life) {
        tmpM.makeScale(0, 0, 0)
        this.mesh.setMatrixAt(p.i, tmpM)
        this.free.push(p.i)
        continue
      }
      p.vy -= p.g * dt
      const drag = Math.exp(-p.drag * dt)
      p.vx *= drag
      p.vz *= drag
      if (p.g < 0) p.vy *= drag
      p.x += p.vx * dt
      p.y += p.vy * dt
      p.z += p.vz * dt
      if (p.y < p.floor) {
        p.y = p.floor
        p.vy = -p.vy * p.bounce
        p.vx *= 0.55
        p.vz *= 0.55
        p.spin *= 0.5
      }
      p.rx += p.spin * dt
      p.ry += p.spin * 0.7 * dt
      const k = p.age / p.life
      const s = p.size * (p.grow ? 0.4 + k * p.grow : 1) * (k > p.fadeAt ? 1 - (k - p.fadeAt) / (1 - p.fadeAt) : 1)
      tmpQ.setFromEuler(tmpE.set(p.rx, p.ry, 0))
      tmpM.compose(tmpV.set(p.x, p.y, p.z), tmpQ, tmpS.set(s * p.sx, s * p.sy, s * p.sz))
      this.mesh.setMatrixAt(p.i, tmpM)
      keep.push(p)
    }
    this.items = keep
    this.mesh.instanceMatrix.needsUpdate = true
  }
}

function particle(o) {
  return {
    x: o.x, y: o.y, z: o.z,
    vx: o.vx || 0, vy: o.vy || 0, vz: o.vz || 0,
    g: o.g ?? 22, drag: o.drag ?? 0.6, bounce: o.bounce ?? 0.3, floor: o.floor ?? 0.04,
    size: o.size ?? 0.15, sx: o.sx ?? 1, sy: o.sy ?? 1, sz: o.sz ?? 1,
    rx: Math.random() * 6, ry: Math.random() * 6, spin: o.spin ?? (Math.random() - 0.5) * 18,
    age: 0, life: o.life ?? 1.5, fadeAt: o.fadeAt ?? 0.7, grow: o.grow || 0, color: o.color,
  }
}

function radialTexture(inner, outer) {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(64, 64, 4, 64, 64, 62)
  grad.addColorStop(0, inner)
  grad.addColorStop(0.55, inner)
  grad.addColorStop(1, outer)
  g.fillStyle = grad
  g.fillRect(0, 0, 128, 128)
  // ragged speckle so scorches don't read as perfect discs
  for (let i = 0; i < 90; i++) {
    const a = Math.random() * Math.PI * 2, r = 30 + Math.random() * 30
    g.fillStyle = inner
    g.globalAlpha = Math.random() * 0.5
    g.beginPath()
    g.arc(64 + Math.cos(a) * r, 64 + Math.sin(a) * r, 2 + Math.random() * 6, 0, Math.PI * 2)
    g.fill()
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

export class FX {
  constructor(scene, camera, overlay) {
    this.scene = scene
    this.camera = camera
    this.overlay = overlay
    this.shake = 0

    const cubes = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ roughness: 0.85 }), MAX_CUBES)
    cubes.castShadow = true
    const glow = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 0), new THREE.MeshBasicMaterial({ toneMapped: false }), MAX_GLOW)
    const puff = new THREE.InstancedMesh(
      new THREE.IcosahedronGeometry(1, 1),
      new THREE.MeshLambertMaterial({ transparent: true, opacity: 0.55, depthWrite: false }),
      MAX_PUFF,
    )
    scene.add(cubes, glow, puff)
    this.cubes = new Pool(cubes, MAX_CUBES)
    this.glow = new Pool(glow, MAX_GLOW)
    this.puff = new Pool(puff, MAX_PUFF)

    // A fixed set of lights whose intensity we animate. Adding and removing
    // lights would force every material to recompile mid-battle.
    this.lights = []
    for (let i = 0; i < 3; i++) {
      const l = new THREE.PointLight(0xffaa55, 0, 14, 1.6)
      l.position.set(0, -50, 0)
      scene.add(l)
      this.lights.push({ l, until: 0 })
    }

    this.scorchTex = radialTexture('rgba(20,14,8,0.85)', 'rgba(20,14,8,0)')
    this.acidTex = radialTexture('rgba(90,220,60,0.75)', 'rgba(40,120,20,0)')
    this.decals = []
    this.decalGeo = new THREE.CircleGeometry(1, 28)
    this.decalGeo.rotateX(-Math.PI / 2)
    this.texts = []
    this.flashGeo = new THREE.SphereGeometry(1, 20, 12)
    this.ringGeo = new THREE.RingGeometry(0.93, 1, 64)
    this.ringGeo.rotateX(-Math.PI / 2)
    this.discGeo = new THREE.CircleGeometry(1, 48)
    this.discGeo.rotateX(-Math.PI / 2)
  }

  cube(o) {
    this.cubes.spawn(particle(o))
  }
  mote(o) {
    this.glow.spawn(particle({ g: -1, drag: 2.5, bounce: 0, floor: -99, spin: 0, ...o }))
  }
  smoke(o) {
    this.puff.spawn(particle({ g: -2.2, drag: 1.8, bounce: 0, floor: 0.1, spin: 0, grow: 2.2, fadeAt: 0.4, ...o }))
  }

  // Debris flying away from (fx, fz) — chunks of whatever just broke.
  debris(x, y, z, colors, n, { from, power = 7, size = 0.16 } = {}) {
    for (let i = 0; i < n; i++) {
      let dx = Math.random() - 0.5, dz = Math.random() - 0.5
      if (from) {
        dx += (x - from.x) * 0.35
        dz += (z - from.z) * 0.35
      }
      const L = Math.hypot(dx, dz) || 1
      const sp = power * (0.4 + Math.random() * 0.8)
      this.cube({
        x: x + (Math.random() - 0.5) * 0.4, y: y + Math.random() * 0.3, z: z + (Math.random() - 0.5) * 0.4,
        vx: (dx / L) * sp, vy: 3 + Math.random() * power, vz: (dz / L) * sp,
        size: size * (0.5 + Math.random()), sy: 0.6 + Math.random() * 0.8,
        color: colors[(Math.random() * colors.length) | 0], life: 2.4 + Math.random() * 1.5, fadeAt: 0.75,
      })
    }
  }

  leaves(x, y, z, colors, n, spread = 1) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, s = 1 + Math.random() * 4 * spread
      this.cube({
        x: x + Math.cos(a) * 0.5 * spread, y: y + Math.random() * spread, z: z + Math.sin(a) * 0.5 * spread,
        vx: Math.cos(a) * s, vy: 2 + Math.random() * 4, vz: Math.sin(a) * s,
        g: 5, drag: 2.4, size: 0.1 + Math.random() * 0.08, sy: 0.25, spin: (Math.random() - 0.5) * 10,
        color: colors[(Math.random() * colors.length) | 0], life: 1.6 + Math.random() * 1.6,
      })
    }
  }

  flashLight(x, y, z, color, intensity, dur) {
    const slot = this.lights.reduce((a, b) => (a.until < b.until ? a : b))
    slot.until = clock.time + dur
    slot.l.color.set(color)
    slot.l.position.set(x, y, z)
    tween(dur, (k) => (slot.l.intensity = intensity * (1 - k) * (1 - k)))
  }

  decal(x, z, r, tex, opacity = 0.8) {
    const m = new THREE.Mesh(this.decalGeo, new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, opacity, polygonOffset: true, polygonOffsetFactor: -2 }))
    m.position.set(x, 0.015 + this.decals.length * 0.0004, z)
    m.rotation.y = Math.random() * 6
    m.scale.setScalar(r)
    m.renderOrder = 1
    this.scene.add(m)
    this.decals.push(m)
    if (this.decals.length > 40) {
      const old = this.decals.shift()
      this.scene.remove(old)
      old.material.dispose()
    }
    return m
  }

  // A ring on the table: blast templates, scatter landings, objective pings.
  ring(x, z, r, color, { life = 1.2, fill = 0.18, hold = false } = {}) {
    const g = new THREE.Group()
    const ring = new THREE.Mesh(this.ringGeo, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.95, depthWrite: false, toneMapped: false }))
    const disc = new THREE.Mesh(this.discGeo, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: fill, depthWrite: false, toneMapped: false }))
    g.add(ring, disc)
    g.position.set(x, 0.05, z)
    g.scale.setScalar(r)
    g.renderOrder = 3
    this.scene.add(g)
    const remove = () => {
      this.scene.remove(g)
      ring.material.dispose()
      disc.material.dispose()
    }
    if (!hold) {
      tween(life, (k) => {
        ring.material.opacity = 0.95 * (1 - k)
        disc.material.opacity = fill * (1 - k)
      }).then(remove)
    }
    g.userData.remove = remove
    return g
  }

  // Explosion at (x, z) with a blast of radius r. style picks the palette.
  explode(x, z, r, style = 'fire') {
    const pal = {
      fire: { flash: 0xffc46b, glow: ['#ffd36e', '#ff8a2a', '#ff5a1f', '#fff2b0'], light: 0xff9a4a, smoke: '#4a4038' },
      acid: { flash: 0x9dff6a, glow: ['#b8ff6a', '#5be04a', '#d8ff9a', '#2fbf4a'], light: 0x8aff5a, smoke: '#3f5a2a' },
      thorns: { flash: 0xc8ff9a, glow: ['#9be36a', '#e4ffb0', '#5ab04a'], light: 0xbaff8a, smoke: '#3a4a2a' },
      dust: { flash: 0xfff0d0, glow: ['#ffe9b0', '#ffd080'], light: 0xffe0a0, smoke: '#8a7a64' },
    }[style]
    const flash = new THREE.Mesh(this.flashGeo, new THREE.MeshBasicMaterial({ color: pal.flash, transparent: true, opacity: 0.9, toneMapped: false, depthWrite: false }))
    flash.position.set(x, 0.3, z)
    this.scene.add(flash)
    tween(0.45, (k) => {
      flash.scale.setScalar(0.2 + r * 0.85 * easeOut(k))
      flash.material.opacity = 0.9 * (1 - k)
    }).then(() => {
      this.scene.remove(flash)
      flash.material.dispose()
    })
    this.flashLight(x, 1.5, z, pal.light, 9 + r * 6, 0.7)
    const n = Math.round(18 + r * 14)
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, s = (2 + Math.random() * 6) * (0.6 + r * 0.25)
      this.mote({
        x, y: 0.3, z, vx: Math.cos(a) * s, vy: 2 + Math.random() * 6, vz: Math.sin(a) * s, g: 9, drag: 2.2,
        size: 0.07 + Math.random() * 0.12, color: pal.glow[i % pal.glow.length], life: 0.5 + Math.random() * 0.7,
      })
    }
    for (let i = 0; i < 6 + r * 3; i++) {
      const a = Math.random() * Math.PI * 2, d = Math.random() * r * 0.6
      this.smoke({
        x: x + Math.cos(a) * d, y: 0.3 + Math.random() * 0.4, z: z + Math.sin(a) * d,
        vx: Math.cos(a) * 1.2, vy: 1 + Math.random() * 1.5, vz: Math.sin(a) * 1.2,
        size: 0.25 + Math.random() * 0.25 * r, color: pal.smoke, life: 1.6 + Math.random() * 1.4,
      })
    }
    this.debris(x, 0.1, z, ['#5b4630', '#6f8a3a', '#4a3a28'], Math.round(6 + r * 4), { power: 5 + r, size: 0.1 })
    this.decal(x, z, r * 0.7, style === 'acid' ? this.acidTex : this.scorchTex, style === 'acid' ? 0.6 : 0.45)
    this.shake = Math.max(this.shake, 0.05 + r * 0.06)
  }

  // Lob (or fling) a mesh from a to b. Resolves on impact.
  async projectile(a, b, { mesh, arc = 0.25, speed = 22, trail = null, spin = 10 } = {}) {
    const dist = Math.hypot(b.x - a.x, b.z - a.z)
    const h = dist * arc
    this.scene.add(mesh)
    let last = 0
    await tween(Math.max(0.12, dist / speed), (k) => {
      mesh.position.set(a.x + (b.x - a.x) * k, a.y + (b.y - a.y) * k + 4 * h * k * (1 - k), a.z + (b.z - a.z) * k)
      mesh.rotation.x += spin * 0.016
      mesh.rotation.z += spin * 0.011
      if (trail && k - last > 0.03) {
        last = k
        trail(mesh.position)
      }
    })
    this.scene.remove(mesh)
  }

  text(pos, str, color = '#ffffff', { size = 18, life = 1.3, rise = 1.4 } = {}) {
    const el = document.createElement('div')
    el.className = 'float-text'
    el.textContent = str
    el.style.color = color
    el.style.fontSize = size + 'px'
    this.overlay.appendChild(el)
    this.texts.push({ el, x: pos.x, y: pos.y, z: pos.z, age: 0, life, rise })
  }

  update(dt) {
    this.cubes.update(dt)
    this.glow.update(dt)
    this.puff.update(dt)
    this.shake *= Math.exp(-dt * 6)
    const w = innerWidth, hgt = innerHeight
    this.texts = this.texts.filter((t) => {
      t.age += dt
      if (t.age > t.life) {
        t.el.remove()
        return false
      }
      const k = t.age / t.life
      tmpV.set(t.x, t.y + t.rise * easeOut(k), t.z).project(this.camera)
      t.el.style.transform = `translate(${(tmpV.x * 0.5 + 0.5) * w}px, ${(-tmpV.y * 0.5 + 0.5) * hgt}px) translate(-50%, -50%) scale(${1 + 0.3 * (1 - Math.min(1, k * 5))})`
      t.el.style.opacity = k > 0.6 ? 1 - (k - 0.6) / 0.4 : 1
      return true
    })
  }
}
