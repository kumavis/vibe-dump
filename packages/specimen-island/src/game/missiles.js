import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { MISSILES, SEEKER, HEAT } from '../data/missiles.js'
import { clamp, damp } from '../core/mathx.js'
import { bodyHeat, closestApproach, flyMissile, track } from './guidance.js'
import { blast } from './blast.js'

// Heat-seeking missiles as a system: what is hot on the island right now
// (animals by body size, burning flares, engines that have been running), a
// Seeker any launcher can carry to find a lock in a cone along its sight, and
// the missiles themselves — off the rail, motor, proportional navigation
// (game/guidance.js), smoke trail, proximity and contact fuses — each warhead
// going off through game/blast.js, so an animal it kills is the player's kill
// and the ledger charges for it. Every launch is billed to the ledger too.
//
// A missile flies only at what it was locked onto when it left the rail: it
// can be decoyed by something hotter in its own seeker's view (a flare), and
// it loses the lock for good when the target stays out of view, after which
// it flies on until its warhead self-destructs. Unlocked, it dumbfires.

const _o = new THREE.Vector3()
const _d = new THREE.Vector3()
const _p = new THREE.Vector3()
const _v = new THREE.Vector3()
const _n = new THREE.Vector3()
const _prev = new THREE.Vector3()
const NOSE = new THREE.Vector3(0, 0, -1)

// ---------------------------------------------------------------- model

let _shared = null
// One missile, nose to -Z: a slim body, a dark seeker dome, a yellow band
// (live warhead), cruciform canards and tail fins. Shared by the gunship's
// rails and everything in flight.
function sharedModel() {
  if (_shared) return _shared
  const L = 1.7
  const R = 0.085
  const body = [new THREE.CylinderGeometry(R, R, L, 10).rotateX(Math.PI / 2)]
  const dark = [new THREE.SphereGeometry(R, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2).rotateX(-Math.PI / 2).translate(0, 0, -L / 2)]
  dark.push(new THREE.CylinderGeometry(R * 0.7, R * 0.9, 0.06, 10).rotateX(Math.PI / 2).translate(0, 0, L / 2 + 0.03))
  const band = [new THREE.CylinderGeometry(R * 1.02, R * 1.02, 0.07, 10).rotateX(Math.PI / 2).translate(0, 0, -L / 2 + 0.34)]
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2 + Math.PI / 4
    body.push(new THREE.BoxGeometry(0.008, 0.2, 0.22).translate(0, R + 0.1, L / 2 - 0.14).rotateZ(a))
    body.push(new THREE.BoxGeometry(0.006, 0.08, 0.1).translate(0, R + 0.04, -L / 2 + 0.22).rotateZ(a))
  }
  const L_ = (o) => new THREE.MeshLambertMaterial(o)
  _shared = {
    parts: [
      [mergeGeometries(body, false), L_({ color: 0xc9c8bc })],
      [mergeGeometries(dark, false), L_({ color: 0x23272a })],
      [mergeGeometries(band, false), L_({ color: 0xd8b83a })],
    ],
    flame: [new THREE.ConeGeometry(0.09, 0.9, 8, 1, true).rotateX(-Math.PI / 2).translate(0, 0, L / 2 + 0.5), new THREE.MeshBasicMaterial({ color: 0xffb860, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false })],
  }
  return _shared
}

export function missileModel() {
  const g = new THREE.Group()
  for (const [geo, mat] of sharedModel().parts) {
    const m = new THREE.Mesh(geo, mat)
    m.castShadow = true
    g.add(m)
  }
  return g
}

// ---------------------------------------------------------------- seeker

// A launcher's seeker. Each sweep (SEEKER.scan) it looks along `axis` from
// `origin` — the owner sets both before update() — and holds on to the
// strongest heat source in view; a held source locks once `progress` reaches
// 1, quicker for a strong signal. `mode` is off | search | track | locked,
// which is also what the lock tone plays.
export class Seeker {
  constructor(G, launcher, S = SEEKER) {
    this.G = G
    this.launcher = launcher
    this.S = S
    this.mode = 'off'
    this.lock = { ref: null, src: null, signal: 0, lostT: 0, acquire: true }
    this.progress = 0
    this.scanT = 0
    this.origin = new THREE.Vector3()
    this.axis = new THREE.Vector3(0, 0, -1)
  }

  get locked() {
    return this.mode === 'locked'
  }
  get target() {
    return this.lock.src
  }

  reset() {
    if (this.mode === 'locked') this.G.events.emit('seeker:lost', { launcher: this.launcher })
    this.mode = 'off'
    this.lock.ref = this.lock.src = null
    this.lock.signal = this.lock.lostT = 0
    this.progress = 0
    this.scanT = 0
  }

  update(dt, on) {
    if (!on) {
      if (this.mode !== 'off') this.reset()
      return
    }
    const S = this.S
    const M = this.G.missiles
    this.scanT -= dt
    if (this.scanT <= 0) {
      this.scanT = S.scan
      const was = this.mode
      const r = track(this.lock, M.sources(), this.origin, this.axis, S.cone, S, S.scan, M.sightFrom(this.origin, this.launcher))
      if (r === 'acquire' || r === 'switch' || r === 'lost') this.progress = 0
      if (r === 'lost' && was === 'locked') this.G.events.emit('seeker:lost', { launcher: this.launcher })
    }
    if (this.lock.ref == null) this.mode = 'search'
    else {
      // only a source in view builds the lock; behind a trunk it waits
      if (this.lock.lostT === 0 && this.progress < 1) {
        const rate = clamp(this.lock.signal / (S.minSignal * S.strong), S.slowest, 1) / S.lockTime
        this.progress = Math.min(1, this.progress + rate * dt)
        if (this.progress >= 1) this.G.events.emit('seeker:lock', { launcher: this.launcher, target: this.lock.src })
      }
      this.mode = this.progress >= 1 ? 'locked' : 'track'
    }
  }
}

// ---------------------------------------------------------------- smoke

const TRAIL_MAX = 256
let _trailMat = null
// Soft across its width, so the ribbon reads as smoke rather than a strip.
function trailMaterial() {
  if (_trailMat) return _trailMat
  const c = document.createElement('canvas')
  c.width = 4
  c.height = 64
  const ctx = c.getContext('2d')
  const g = ctx.createLinearGradient(0, 0, 0, 64)
  g.addColorStop(0, 'rgba(255,255,255,0)')
  g.addColorStop(0.5, 'rgba(255,255,255,1)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 4, 64)
  _trailMat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), vertexColors: true, transparent: true, depthWrite: false, side: THREE.DoubleSide })
  return _trailMat
}

// A missile's smoke trail: a ribbon through the points it has passed, turned
// to face the camera, widening and fading as each point ages. It outlives the
// missile and is dropped once the last of it has faded.
class Trail {
  constructor(scene, T) {
    this.T = T
    this.pts = [] // [x, y, z, born, thickness]
    this.pos = new Float32Array(TRAIL_MAX * 6)
    this.col = new Float32Array(TRAIL_MAX * 8)
    const uv = new Float32Array(TRAIL_MAX * 4)
    const idx = []
    for (let i = 0; i < TRAIL_MAX; i++) {
      uv.set([0.5, 0, 0.5, 1], i * 4)
      if (i < TRAIL_MAX - 1) idx.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2)
    }
    const g = new THREE.BufferGeometry()
    g.setIndex(idx)
    g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage))
    g.setAttribute('color', new THREE.BufferAttribute(this.col, 4).setUsage(THREE.DynamicDrawUsage))
    g.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
    g.setDrawRange(0, 0)
    this.mesh = new THREE.Mesh(g, trailMaterial())
    this.mesh.frustumCulled = false
    this.mesh.renderOrder = 4
    scene.add(this.mesh)
  }

  add(x, y, z, t, thick = 1) {
    if (this.pts.length >= TRAIL_MAX) this.pts.shift()
    this.pts.push([x, y, z, t, thick])
  }

  // Rebuild the strip for this frame; false once it has all faded.
  update(cam, now, light) {
    const T = this.T
    const pts = this.pts
    while (pts.length && now - pts[0][3] > T.life) pts.shift()
    const n = pts.length
    const g = this.mesh.geometry
    if (n < 2) {
      g.setDrawRange(0, 0)
      return n > 0
    }
    for (let i = 0; i < n; i++) {
      const p = pts[i]
      const a = pts[Math.max(0, i - 1)]
      const b = pts[Math.min(n - 1, i + 1)]
      // across the trail and square to the line of sight
      const tx = b[0] - a[0]
      const ty = b[1] - a[1]
      const tz = b[2] - a[2]
      const vx = cam.x - p[0]
      const vy = cam.y - p[1]
      const vz = cam.z - p[2]
      let sx = ty * vz - tz * vy
      let sy = tz * vx - tx * vz
      let sz = tx * vy - ty * vx
      const age = now - p[3]
      const w = ((T.width + T.spread * age) * p[4]) / 2 / (Math.hypot(sx, sy, sz) || 1)
      sx *= w
      sy *= w
      sz *= w
      this.pos.set([p[0] - sx, p[1] - sy, p[2] - sz, p[0] + sx, p[1] + sy, p[2] + sz], i * 6)
      const f = 1 - age / T.life
      const alpha = T.alpha * f * f * Math.min(1, p[4] * 1.4)
      const c = 0.86 * light
      this.col.set([c, c, c * 0.98, alpha, c, c, c * 0.98, alpha], i * 8)
    }
    g.attributes.position.needsUpdate = true
    g.attributes.color.needsUpdate = true
    g.setDrawRange(0, (n - 1) * 6)
    return true
  }

  dispose() {
    this.mesh.removeFromParent()
    this.mesh.geometry.dispose()
  }
}

// ---------------------------------------------------------------- missiles

export class Missiles {
  constructor(G) {
    this.G = G
    this.flying = []
    this.trails = []
    this.engineTemp = new Map() // vehicle -> 0..1, how hot its engine is
    this.list = []
    this.listFrame = -1
  }

  // ---- heat
  // Everything hot enough to matter, once per frame: { kind, ref, x, y, z,
  // heat, radius }. Seekers filter out their own launcher (sightFrom).
  sources() {
    const G = this.G
    if (this.listFrame === G.frame) return this.list
    this.listFrame = G.frame
    const out = this.list
    out.length = 0
    const isl = G.island
    for (const c of G.ecology.active) {
      if (!c.vitals.alive || c.disposed) continue
      const p = c.center()
      const leaves = isl.sample(isl.d.canopy, p.x, p.z)
      const heat = bodyHeat(c.sp.mass * c.scale ** 3, HEAT.creature) * (1 - HEAT.creature.canopy * clamp(leaves, 0, 1))
      out.push({ kind: 'creature', ref: c, x: p.x, y: p.y, z: p.z, heat, radius: c.radius })
    }
    for (const f of G.projectiles?.flares || []) {
      if (f.t <= 0) continue
      out.push({ kind: 'flare', ref: f, x: f.pos.x, y: f.pos.y + 0.3, z: f.pos.z, heat: HEAT.flare * clamp(f.t / HEAT.flareFade, 0, 1), radius: 0.3 })
    }
    for (const v of G.vehicles || []) {
      const t = this.engineTemp.get(v) || 0
      const heat = (v.tune.heat ?? HEAT.vehicle.default) * t
      if (heat < 0.01) continue
      const p = v.modelPoint(v.tune.enginePoint, _p)
      out.push({ kind: 'vehicle', ref: v, x: p.x, y: p.y, z: p.z, heat, radius: 2 })
    }
    return out
  }

  // A line-of-sight test from `origin` for track(): terrain and statics stop
  // it, short of the source itself (a parked vehicle's own hull does not).
  sightFrom(origin, launcher) {
    const ph = this.G.physics
    return (s) => {
      if (s.ref === launcher) return false
      const dx = s.x - origin.x
      const dy = s.y - origin.y
      const dz = s.z - origin.z
      const d = Math.hypot(dx, dy, dz)
      const reach = d - s.radius - 0.6
      if (reach <= 0) return true
      const hit = ph.raycast(origin.x, origin.y, origin.z, dx / d, dy / d, dz / d, reach)
      return !hit || (s.kind === 'vehicle' && hit.collider?.ref === s.ref)
    }
  }

  // Where a locked thing is now, or null once it is gone (dead, unloaded,
  // burnt out, wrecked) — the seeker then has nothing to see.
  locate(src, out) {
    const r = src.ref
    if (src.kind === 'creature') {
      if (!r.vitals.alive || r.disposed) return null
      const c = r.center()
      return out.copy(c)
    }
    if (src.kind === 'flare') return r.t > 0 ? out.set(r.pos.x, r.pos.y + 0.3, r.pos.z) : null
    if (src.kind === 'vehicle') return r.modelPoint(r.tune.enginePoint, out)
    return null
  }

  // ---- launch
  // From `from` along unit `dir`, inheriting `vel` (the aircraft's), at the
  // source `target` held by a locked seeker, or unguided when it is null.
  launch(launcher, from, vel, dir, target = null, M = MISSILES.heatseeker) {
    const G = this.G
    const mesh = missileModel()
    const flame = new THREE.Mesh(...sharedModel().flame)
    flame.visible = false
    mesh.add(flame)
    G.scene.add(mesh)
    const m = {
      M,
      launcher,
      mesh,
      flame,
      pos: { x: from.x, y: from.y, z: from.z },
      vel: { x: vel.x, y: vel.y - M.eject, z: vel.z },
      dir: { x: dir.x, y: dir.y, z: dir.z },
      speed: 0,
      age: 0,
      lit: false,
      lock: { ref: target?.ref ?? null, src: target, signal: 0, lostT: 0, acquire: false },
      aim: target ? { pos: new THREE.Vector3(target.x, target.y, target.z), vel: new THREE.Vector3(), fresh: false } : null,
      scanT: 0,
      trail: 0,
    }
    this.place(m)
    this.flying.push(m)
    G.audio?.play('missile', { pos: from })
    G.events.emit('weapon:fired', { weapon: 'missile' })
    G.events.emit('missile:launched', { missile: m, launcher, target, cost: M.cost })
    return m
  }

  // ---- per frame
  update(dt) {
    const G = this.G
    // engines warm while they run and cool slowly once stopped
    const V = HEAT.vehicle
    for (const v of G.vehicles || []) {
      const running = (v.rpm || 0) > V.running && !v.destroyed
      const t = this.engineTemp.get(v) || 0
      this.engineTemp.set(v, damp(t, running ? 1 : 0, 1 / (running ? V.warm : V.cool), dt))
    }
    for (let i = this.flying.length - 1; i >= 0; i--) {
      const m = this.flying[i]
      if (this.step(m, dt)) this.flying.splice(i, 1)
    }
    // smoke hangs on after the missile has gone, until it has faded
    const light = 0.35 + 0.65 * clamp(G.sky?.light ?? 1, 0, 1)
    for (let i = this.trails.length - 1; i >= 0; i--) {
      if (this.trails[i].update(G.camera.position, G.time, light)) continue
      this.trails[i].dispose()
      this.trails.splice(i, 1)
    }
  }

  // One missile, one frame. Returns true once it is gone.
  step(m, dt) {
    const G = this.G
    const M = m.M
    const isl = G.island
    const S = SEEKER
    // its own seeker: hold the target, be decoyed, or lose it
    if (m.lock.ref != null && m.lit) {
      m.scanT -= dt
      if (m.scanT <= 0) {
        m.scanT = S.missileScan
        const r = track(m.lock, this.sources(), m.pos, m.dir, M.gimbal, S, S.missileScan, this.sightFrom(m.pos, m.launcher))
        if (r === 'switch') {
          m.aim.fresh = false
          m.aim.vel.set(0, 0, 0)
          G.events.emit('missile:decoyed', { missile: m, by: m.lock.src })
        } else if (r === 'lost') {
          m.aim = null
          G.events.emit('missile:lost', { missile: m })
        }
      }
    }
    // where the target is and how it moves, read straight off the thing
    // itself; once it is gone (dead, burnt out) steer for where it was heading
    const aim = m.aim
    if (aim) {
      _prev.copy(aim.pos)
      if (this.locate(m.lock.src, aim.pos)) {
        if (aim.fresh) aim.vel.lerp(_v.subVectors(aim.pos, _prev).divideScalar(Math.max(dt, 1e-4)), 1 - Math.exp(-8 * dt))
        aim.fresh = true
      } else aim.pos.addScaledVector(aim.vel, dt)
    }
    _o.set(m.pos.x, m.pos.y, m.pos.z)
    flyMissile(m, M, dt, aim)

    // proximity fuse on the target, while the seeker can see it: inside the
    // fuse's reach it waits for the closest pass (the nearest point no longer
    // at the end of this step) and goes off there
    if (aim && m.age >= M.arm && m.lock.lostT === 0) {
      const r0 = { x: _o.x - aim.pos.x, y: _o.y - aim.pos.y, z: _o.z - aim.pos.z }
      const r1 = { x: m.pos.x - aim.pos.x, y: m.pos.y - aim.pos.y, z: m.pos.z - aim.pos.z }
      const c = closestApproach(r0, r1)
      if (c.d < M.fuse + (m.lock.src?.radius || 0) && c.t < 1) return this.detonate(m, _p.copy(_o).lerp(_v.set(m.pos.x, m.pos.y, m.pos.z), c.t), 'proximity')
    }
    // contact: terrain, trunks and walls, animals, water
    _d.set(m.pos.x - _o.x, m.pos.y - _o.y, m.pos.z - _o.z)
    const len = _d.length()
    if (len > 1e-6) {
      _d.divideScalar(len)
      const hitW = G.physics.raycast(_o.x, _o.y, _o.z, _d.x, _d.y, _d.z, len)
      const hitC = G.ecology.raycast(_o, _d, len, 0.2)
      const t = Math.min(hitW ? hitW.t : Infinity, hitC ? hitC.t : Infinity)
      if (t < Infinity) return this.detonate(m, _p.copy(_o).addScaledVector(_d, Math.max(0, t - 0.2)), hitC && hitC.t === t ? 'animal' : 'impact')
    }
    const water = isl.waterAt(m.pos.x, m.pos.z)
    if (m.pos.y < water && isl.depthAt(m.pos.x, m.pos.z) > 0) return this.detonate(m, _p.set(m.pos.x, water, m.pos.z), 'water')
    if (Math.abs(m.pos.x) > isl.half || Math.abs(m.pos.z) > isl.half || m.age >= M.life) return this.detonate(m, _p.set(m.pos.x, m.pos.y, m.pos.z), 'selfdestruct')

    this.place(m)
    this.smoke(m, _o, len)
    return false
  }

  place(m) {
    m.mesh.position.set(m.pos.x, m.pos.y, m.pos.z)
    m.mesh.quaternion.setFromUnitVectors(NOSE, _n.set(m.dir.x, m.dir.y, m.dir.z).normalize())
    m.flame.visible = m.lit && m.age < m.M.drop + m.M.motor.burn
    if (m.flame.visible) m.flame.scale.set(1, 1, 0.8 + Math.random() * 0.5)
  }

  // Smoke: the ribbon gets a point every frame at the motor; puffs along it
  // every few metres give it body, thinner once the motor is out.
  smoke(m, from, len) {
    const G = this.G
    if (!m.lit) return
    const T = m.M.trail
    const burning = m.age < m.M.drop + m.M.motor.burn
    // the tail of the missile, a body length behind its centre
    const tx = m.pos.x - m.dir.x * 0.9
    const ty = m.pos.y - m.dir.y * 0.9
    const tz = m.pos.z - m.dir.z * 0.9
    if (!m.ribbon) {
      m.ribbon = new Trail(G.scene, T)
      this.trails.push(m.ribbon)
    }
    m.ribbon.add(tx, ty, tz, G.time, burning ? 1 : 0.55)
    const fx = G.fx
    if (!fx) return
    const P = T.puffs
    const spacing = burning ? P.spacing : P.spacing / P.coast
    m.trail += len
    let n = 0
    while (m.trail >= spacing && n < 4) {
      m.trail -= spacing
      const k = len > 0 ? 1 - m.trail / len : 1
      const g = 0.8 + Math.random() * 0.1
      fx.normal.emit(from.x + (tx - from.x) * k, from.y + (ty - from.y) * k, from.z + (tz - from.z) * k, (Math.random() - 0.5) * 0.6, 0.3 + Math.random() * 0.4, (Math.random() - 0.5) * 0.6, P.life, P.size * (burning ? 1 : 0.7), g, g, g * 0.97, -0.15, P.grow)
      n++
    }
    m.trail = Math.min(m.trail, spacing)
    if (burning) fx.add.emit(tx - m.dir.x * 0.3, ty - m.dir.y * 0.3, tz - m.dir.z * 0.3, 0, 0, 0, 0.09, 0.7, 1, 0.7, 0.35, 0, -2)
  }

  // The warhead goes off (or, before it has armed, the missile breaks up).
  detonate(m, at, cause) {
    const G = this.G
    m.mesh.removeFromParent()
    const armed = m.age >= m.M.arm
    let hits = null
    if (armed) hits = blast(G, at, m.M.blast, { weapon: 'missile', exclude: m.launcher, source: 'player' })
    else {
      G.fx?.dust(at, 10)
      G.fx?.sparks(at)
      G.audio?.play('crash', { pos: at, intensity: 0.3 })
      G.events.emit('noise', { x: at.x, y: at.y, z: at.z, radius: 40, source: 'impact', kind: 'impact' })
    }
    G.events.emit('missile:detonated', {
      missile: m,
      x: at.x,
      y: at.y,
      z: at.z,
      cause,
      armed,
      target: m.lock.src,
      hits: hits ? hits.creatures.length : 0,
      kills: hits ? hits.creatures.filter((h) => !h.creature.vitals.alive).length : 0,
    })
    return true
  }
}
