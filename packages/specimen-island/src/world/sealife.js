import * as THREE from 'three'
import { clamp, damp, lerp } from '../core/mathx.js'
import { SEA_LIFE, SEA_TIERS } from '../data/sea.js'

// Ambient sea life: schools of fish milling about, jellies pulsing near the
// surface, ammonites jetting over the bed, and now and then a marine reptile
// crossing in the murk at the edge of sight. It is scenery, not ecology — no
// records, no science, nothing the Full Survey counts, nothing that bites —
// so it lives round the camera only while the camera is under the sea, a
// few instanced meshes drawn in one call each. A school that the sub comes
// close to, or that hears its sonar, scatters.

const L = SEA_LIFE
const _m = new THREE.Matrix4()
const _q = new THREE.Quaternion()
const _e = new THREE.Euler(0, 0, 0, 'YXZ')
const _p = new THREE.Vector3()
const _s = new THREE.Vector3()
const _c = new THREE.Color()
const rand = (a, b) => a + Math.random() * (b - a)

// A wag that travels down the body (local +Z is the tail): fish, the
// reptile's segments are posed on the CPU instead.
function wagShader(amount, rate) {
  return (shader) => {
    shader.uniforms.uTime = SeaLife.clock
    shader.vertexShader = shader.vertexShader.replace('#include <common>', `#include <common>
      uniform float uTime;`).replace('#include <begin_vertex>', `#include <begin_vertex>
      #ifdef USE_INSTANCING
        float wagId = float(gl_InstanceID);
      #else
        float wagId = 0.0;
      #endif
      transformed.x += sin(uTime * ${rate.toFixed(1)} + wagId * 2.17 - position.z * 5.0) * ${amount.toFixed(3)} * smoothstep(-0.2, 0.5, position.z);`)
  }
}

// A small fish, nose at -Z: a lozenge body with a forked tail, dark on the
// back and pale underneath (tinted per school by instance colour).
function fishGeometry() {
  const P = []
  const C = []
  const back = [0.55, 0.6, 0.62]
  const belly = [1.1, 1.1, 1.05]
  const v = (p, c) => {
    P.push(...p)
    C.push(...c)
  }
  const nose = [0, 0, -0.5]
  const top = [0, 0.13, -0.05]
  const bot = [0, -0.11, -0.05]
  const L_ = [-0.07, 0.01, -0.05]
  const R_ = [0.07, 0.01, -0.05]
  const tail = [0, 0.01, 0.32]
  const tris = [
    [nose, top, R_, back, back, belly],
    [nose, R_, bot, belly, belly, belly],
    [nose, L_, top, belly, back, back],
    [nose, bot, L_, belly, belly, belly],
    [tail, R_, top, back, belly, back],
    [tail, bot, R_, belly, belly, belly],
    [tail, top, L_, back, back, belly],
    [tail, L_, bot, belly, belly, belly],
  ]
  for (const [a, b, c, ca, cb, cc] of tris) {
    v(a, ca)
    v(b, cb)
    v(c, cc)
  }
  // the fork, both faces
  const t0 = [0, 0.01, 0.28]
  const tu = [0, 0.17, 0.52]
  const td = [0, -0.14, 0.5]
  const tm = [0, 0.01, 0.42]
  for (const [a, b, c] of [
    [t0, tu, tm],
    [t0, tm, tu],
    [t0, tm, td],
    [t0, td, tm],
  ]) {
    v(a, back)
    v(b, back)
    v(c, back)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3))
  g.setAttribute('color', new THREE.Float32BufferAttribute(C, 3))
  g.computeVertexNormals()
  return g
}

// A jelly: a translucent bell with ribbon tentacles trailing under it.
function jellyGeometry() {
  const bell = new THREE.SphereGeometry(1, 12, 6, 0, Math.PI * 2, 0, Math.PI * 0.5).scale(1, 0.75, 1)
  const parts = [bell.toNonIndexed()]
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * Math.PI * 2
    const strip = new THREE.PlaneGeometry(0.12, 2.2, 1, 4).translate(0, -1.1, 0).rotateY(a).translate(Math.cos(a) * 0.55, 0, Math.sin(a) * 0.55)
    const p = strip.attributes.position
    for (let i = 0; i < p.count; i++) p.setX(i, p.getX(i) + Math.sin(p.getY(i) * 2.5 + k) * 0.12)
    parts.push(strip.toNonIndexed())
  }
  const P = []
  for (const g of parts) P.push(...g.attributes.position.array)
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3))
  g.computeVertexNormals()
  return g
}

// An ammonite: a coiled shell (rings round a widening log spiral) with a
// tuft of tentacles at the aperture, which faces +Z (it jets backwards).
function ammoniteGeometry() {
  const rings = 26
  const seg = 8
  const P = []
  const C = []
  const ring = []
  for (let i = 0; i <= rings; i++) {
    const t = i / rings
    const ang = t * Math.PI * 3.2
    const R = 0.06 * Math.exp(t * 2.1)
    const tube = 0.035 * Math.exp(t * 2.0)
    const cx = Math.cos(ang) * R
    const cy = Math.sin(ang) * R
    // tangent of the spiral and the ring round it, in the XY plane of the coil
    const tx = -Math.sin(ang)
    const ty = Math.cos(ang)
    const pts = []
    for (let k = 0; k < seg; k++) {
      const a = (k / seg) * Math.PI * 2
      const nx = Math.cos(a) * -ty
      const ny = Math.cos(a) * tx
      pts.push([cx + nx * tube, cy + ny * tube, Math.sin(a) * tube * 0.8])
    }
    ring.push({ pts, stripe: i % 3 === 0 })
  }
  const shell = [0.78, 0.66, 0.48]
  const band = [0.45, 0.32, 0.22]
  for (let i = 0; i < rings; i++) {
    for (let k = 0; k < seg; k++) {
      const a = ring[i].pts[k]
      const b = ring[i].pts[(k + 1) % seg]
      const c = ring[i + 1].pts[(k + 1) % seg]
      const d = ring[i + 1].pts[k]
      const col = ring[i].stripe ? band : shell
      P.push(...a, ...c, ...b, ...a, ...d, ...c)
      for (let q = 0; q < 6; q++) C.push(...col)
    }
  }
  // tentacles out of the aperture (the last ring's centre)
  const last = ring[rings].pts
  let ax = 0
  let ay = 0
  for (const p of last) {
    ax += p[0] / seg
    ay += p[1] / seg
  }
  const skin = [0.72, 0.5, 0.42]
  for (let k = 0; k < 7; k++) {
    const a = (k / 7) * Math.PI * 2
    const bx = ax + Math.cos(a) * 0.05
    const by = ay + Math.sin(a) * 0.05
    P.push(bx, by, 0, bx + Math.cos(a) * 0.02, by + Math.sin(a) * 0.02, 0.03, bx + Math.cos(a) * 0.08, by + Math.sin(a) * 0.08, 0.32)
    for (let q = 0; q < 3; q++) C.push(...skin)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3))
  g.setAttribute('color', new THREE.Float32BufferAttribute(C, 3))
  g.computeVertexNormals()
  // stand the coil upright with its aperture trailing
  g.rotateY(Math.PI / 2)
  return g
}

export class SeaLife {
  static clock = { value: 0 }

  constructor(G) {
    this.G = G
    this.group = new THREE.Group()
    this.group.name = 'sealife'
    this.group.visible = false
    G.scene.add(this.group)
    const H = SEA_TIERS.high
    this.tier = SEA_TIERS.medium

    const fishMat = new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide })
    fishMat.onBeforeCompile = wagShader(0.09, 11)
    this.fish = new THREE.InstancedMesh(fishGeometry(), fishMat, H.schools * H.fish)
    this.fish.count = 0
    this.fish.frustumCulled = false
    this.fish.setColorAt(0, _c.set(1, 1, 1))
    this.group.add(this.fish)
    this.schools = []

    const jellyMat = new THREE.MeshLambertMaterial({ color: 0xc8d8f0, emissive: 0x203048, transparent: true, opacity: 0.45, depthWrite: false, side: THREE.DoubleSide })
    this.jellyMesh = new THREE.InstancedMesh(jellyGeometry(), jellyMat, H.jellies)
    this.jellyMesh.count = 0
    this.jellyMesh.frustumCulled = false
    this.jellyMesh.renderOrder = 3
    this.group.add(this.jellyMesh)
    this.jellies = []

    const ammoMat = new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide })
    this.ammoMesh = new THREE.InstancedMesh(ammoniteGeometry(), ammoMat, H.ammonites)
    this.ammoMesh.count = 0
    this.ammoMesh.frustumCulled = false
    this.group.add(this.ammoMesh)
    this.ammonites = []

    this.leviathan = this.buildLeviathan()
    this.levT = L.leviathan.first
    this.pass = null
    this.scareT = 0
    G.events.on('sonar', (e) => this.scatter(e, 60))
  }

  setTier(tier) {
    this.tier = SEA_TIERS[tier] || SEA_TIERS.medium
    this.schools.length = Math.min(this.schools.length, this.tier.schools)
    this.jellies.length = Math.min(this.jellies.length, this.tier.jellies)
    this.ammonites.length = Math.min(this.ammonites.length, this.tier.ammonites)
  }

  // A mosasaur-like marine reptile, twelve metres of it: a chain of body
  // segments the swim wave runs down, a long jaw, four paddles and a fluke.
  // It only ever passes at the edge of the murk, so it is drawn plain and
  // dark — the fog makes it a silhouette.
  buildLeviathan() {
    const mat = new THREE.MeshLambertMaterial({ color: 0x2c3a38 })
    const belly = new THREE.MeshLambertMaterial({ color: 0x5a6660 })
    const root = new THREE.Group()
    const n = 8
    const len = L.leviathan.length
    const segLen = len / n
    let parent = root
    const segs = []
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1)
      const r = lerp(0.75, 0.12, Math.pow(t, 1.3)) * (i === 0 ? 0.9 : 1)
      const seg = new THREE.Group()
      seg.position.z = i === 0 ? 0 : segLen
      const body = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 6), mat)
      body.scale.set(r, r * 0.9, segLen * 0.85) // overlapping, so the body reads as one
      body.position.z = segLen * 0.5
      seg.add(body)
      if (i === 1 || i === 3) {
        for (const s of [-1, 1]) {
          const fl = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.06, 0.55), belly)
          fl.geometry.translate(0.8 * s, 0, 0)
          fl.position.set(s * r * 0.8, -r * 0.4, segLen * 0.4)
          fl.rotation.set(0, s * -0.5, s * -0.35)
          seg.add(fl)
        }
      }
      if (i === n - 1) {
        const fluke = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.5, 0.9), mat)
        fluke.position.set(0, 0.15, segLen * 1.1)
        fluke.rotation.x = 0.5
        seg.add(fluke)
      }
      parent.add(seg)
      parent = seg
      segs.push(seg)
    }
    // the head: a long tapering snout ahead of the first segment
    const head = new THREE.Mesh(new THREE.ConeGeometry(0.55, 2.4, 8), mat)
    head.rotation.x = -Math.PI / 2
    head.scale.set(1, 1, 0.7)
    head.position.set(0, 0.05, -1.1)
    const jaw = new THREE.Mesh(new THREE.ConeGeometry(0.4, 2.0, 8), belly)
    jaw.rotation.x = -Math.PI / 2 - 0.12
    jaw.scale.set(1, 1, 0.5)
    jaw.position.set(0, -0.3, -0.9)
    segs[0].add(head, jaw)
    root.visible = false
    root.userData.segs = segs
    this.group.add(root)
    return root
  }

  // ------------------------------------------------------------ spawning

  // A spot in open water round the camera, `range` m out on the side it
  // faces, between `above` m off the bed and `below` m under the surface.
  // null if the water there is too shallow.
  spot(cam, range, above = 2, below = 2, ahead = true) {
    const isl = this.G.island
    const yaw = this.G.camera.rotation.y
    for (let t = 0; t < 6; t++) {
      const a = (ahead ? -yaw - Math.PI / 2 : 0) + (ahead ? rand(-1.2, 1.2) : rand(0, Math.PI * 2))
      const d = rand(range[0], range[1])
      const x = cam.x + Math.cos(a) * d
      const z = cam.z + Math.sin(a) * d
      const bed = isl.heightAt(x, z)
      const top = isl.sea - below
      if (top - (bed + above) < 1) continue
      return { x, y: clamp(cam.y + rand(-4, 4), bed + above, top), z, bed }
    }
    return null
  }

  // The first of each kind round a fresh dive can appear anywhere in range;
  // after that they turn up at its far end, where the murk hides the arrival.
  far(range) {
    return this.filled ? [lerp(range[0], range[1], 0.7), range[1]] : range
  }

  newSchool(cam) {
    const S = L.school
    const at = this.spot(cam, this.far(S.range), 2, 2.5)
    if (!at) return null
    return {
      ...at,
      yaw: rand(0, Math.PI * 2),
      speed: rand(S.speed[0], S.speed[1]),
      size: rand(S.size[0], S.size[1]),
      radius: rand(S.radius[0], S.radius[1]),
      tone: new THREE.Color(S.tones[Math.floor(Math.random() * S.tones.length)]),
      seed: Math.random() * 100,
      scare: 0,
      spread: 1,
      turn: 0,
    }
  }

  // Everything within `radius` of a ping or a passing hull bolts.
  newJelly(cam) {
    const J = L.jelly
    const at = this.spot(cam, this.far(J.range), 3, J.depth[0], this.filled)
    if (!at) return null
    return { ...at, y: clamp(this.G.island.sea - rand(J.depth[0], J.depth[1]), at.bed + 2, this.G.island.sea - J.depth[0]), size: rand(J.size[0], J.size[1]), ph: Math.random() * 6 }
  }

  newAmmonite(cam) {
    const A = L.ammonite
    const at = this.spot(cam, this.far(A.range), A.above[0], 3)
    if (!at) return null
    return { ...at, yaw: rand(0, 6.28), size: rand(A.size[0], A.size[1]), ph: Math.random() * 6, hover: rand(A.above[0], A.above[1]) }
  }

  scatter(at, radius) {
    for (const s of this.schools) {
      if (!s || Math.hypot(s.x - at.x, s.z - at.z) > radius) continue
      s.scare = L.school.scare.time
      s.yaw = Math.atan2(-(s.x - at.x), -(s.z - at.z)) + Math.PI
      s.spread = 1.8
    }
  }

  // ------------------------------------------------------------ per frame

  update(dt, cam, under) {
    this.group.visible = under
    if (!under) {
      // whatever was about is gone by the next dive
      this.schools.length = this.jellies.length = this.ammonites.length = 0
      this.leviathan.visible = false
      this.pass = null
      this.filled = false
      return
    }
    SeaLife.clock.value += dt
    const T = this.tier
    const isl = this.G.island
    const sea = isl.sea
    const sub = this.G.vehicle?.kind === 'sub' ? this.G.vehicle.pos : null

    // ---- schools
    while (this.schools.length < T.schools) this.schools.push(this.newSchool(cam))
    let k = 0
    const S = L.school
    const t = SeaLife.clock.value
    for (let i = 0; i < this.schools.length; i++) {
      let s = this.schools[i]
      if (!s || Math.hypot(s.x - cam.x, s.z - cam.z) > S.gone) s = this.schools[i] = this.newSchool(cam)
      if (!s) continue
      if (sub && s.scare <= 0 && Math.hypot(s.x - sub.x, s.y - sub.y, s.z - sub.z) < S.scare.radius) this.scatter(sub, S.scare.radius + 2)
      s.scare = Math.max(0, s.scare - dt)
      s.spread = damp(s.spread, 1, 0.8, dt)
      // wander: a slow turn that changes its mind, away from the bed and the surface
      s.turn = damp(s.turn, Math.sin(t * 0.13 + s.seed) * 0.35, 0.5, dt)
      s.yaw += s.turn * dt
      const v = s.speed * (s.scare > 0 ? S.scare.speed : 1)
      s.x += -Math.sin(s.yaw) * v * dt
      s.z += -Math.cos(s.yaw) * v * dt
      const bed = isl.heightAt(s.x, s.z)
      s.y = clamp(s.y + Math.sin(t * 0.3 + s.seed) * dt * 0.3, bed + 1.5, sea - 1.5)
      // nosing into the reef: turn back the way it came
      if (isl.heightAt(s.x - Math.sin(s.yaw) * 6, s.z - Math.cos(s.yaw) * 6) > s.y - 1) s.yaw += dt * 2.5
      for (let f = 0; f < T.fish; f++) {
        const a = f * 2.399 + s.seed
        const r = s.radius * s.spread * (0.35 + 0.65 * ((f * 0.618) % 1))
        const orbit = t * (0.25 + (f % 3) * 0.08) + a
        _p.set(s.x + Math.cos(orbit) * r, s.y + Math.sin(a * 1.7 + t * 0.5) * r * 0.35, s.z + Math.sin(orbit) * r * 0.6)
        _e.set(Math.sin(t * 0.7 + f) * 0.1, s.yaw + Math.sin(orbit) * 0.25, 0)
        _q.setFromEuler(_e)
        const sz = s.size * (0.85 + ((f * 0.37) % 0.3))
        _m.compose(_p, _q, _s.set(sz, sz, sz))
        this.fish.setMatrixAt(k, _m)
        this.fish.setColorAt(k, s.tone)
        k++
      }
    }
    this.fish.count = k
    this.fish.instanceMatrix.needsUpdate = true
    if (this.fish.instanceColor) this.fish.instanceColor.needsUpdate = true

    // ---- jellies: pulse and drift in the upper water
    const J = L.jelly
    while (this.jellies.length < T.jellies) this.jellies.push(this.newJelly(cam))
    k = 0
    for (let i = 0; i < this.jellies.length; i++) {
      let j = this.jellies[i]
      if (!j || Math.hypot(j.x - cam.x, j.z - cam.z) > J.gone) j = this.jellies[i] = this.newJelly(cam)
      if (!j) continue
      const pulse = Math.sin(t * 2.1 + j.ph)
      j.y += (Math.max(0, pulse) * 0.25 - 0.06) * dt
      j.x += Math.sin(t * 0.1 + j.ph) * J.drift * dt
      j.y = Math.min(j.y, sea - 0.8)
      _q.identity()
      _m.compose(_p.set(j.x, j.y, j.z), _q, _s.set(j.size * (1 + pulse * 0.12), j.size * (1 - pulse * 0.15), j.size * (1 + pulse * 0.12)))
      this.jellyMesh.setMatrixAt(k++, _m)
    }
    this.jellyMesh.count = k
    this.jellyMesh.instanceMatrix.needsUpdate = true

    // ---- ammonites: over the bed, jetting along in little surges
    const A = L.ammonite
    while (this.ammonites.length < T.ammonites) this.ammonites.push(this.newAmmonite(cam))
    k = 0
    for (let i = 0; i < this.ammonites.length; i++) {
      let a = this.ammonites[i]
      if (!a || Math.hypot(a.x - cam.x, a.z - cam.z) > A.gone) a = this.ammonites[i] = this.newAmmonite(cam)
      if (!a) continue
      const surge = Math.max(0, Math.sin(t * 1.3 + a.ph)) * A.speed
      // jets backwards: the shell leads, the tentacles trail
      a.x += Math.sin(a.yaw) * surge * dt
      a.z += Math.cos(a.yaw) * surge * dt
      a.yaw += Math.sin(t * 0.2 + a.ph) * dt * 0.3
      const bed = isl.heightAt(a.x, a.z)
      a.y = damp(a.y, Math.min(bed + a.hover, sea - 2), 1, dt)
      _e.set(Math.sin(t * 1.3 + a.ph) * 0.15, a.yaw, 0)
      _q.setFromEuler(_e)
      _m.compose(_p.set(a.x, a.y, a.z), _q, _s.set(a.size, a.size, a.size))
      this.ammoMesh.setMatrixAt(k++, _m)
    }
    this.ammoMesh.count = k
    this.ammoMesh.instanceMatrix.needsUpdate = true

    this.filled = true
    this.updateLeviathan(dt, cam)
  }

  // Now and then, once you are well down: a long shape crossing the murk,
  // side-on, from one edge of the view to the other.
  updateLeviathan(dt, cam) {
    const V = L.leviathan
    const G = this.G
    const lev = this.leviathan
    const depth = G.island.sea - cam.y
    if (!this.pass) {
      lev.visible = false
      this.levT -= dt
      if (this.levT > 0 || depth < V.minDepth) return
      this.levT = rand(V.every[0], V.every[1])
      const d = clamp(V.murk / G.scene.fog.density, V.distance[0], V.distance[1])
      const yaw = G.camera.rotation.y
      const fx = -Math.sin(yaw)
      const fz = -Math.cos(yaw)
      const side = Math.random() < 0.5 ? 1 : -1
      const rx = Math.cos(yaw) * side
      const rz = -Math.sin(yaw) * side
      const span = d * 1.6
      const mid = { x: cam.x + fx * d, z: cam.z + fz * d }
      const bed = G.island.heightAt(mid.x, mid.z)
      const y = clamp(cam.y + rand(-3, 2), bed + 3, G.island.sea - 3)
      if (G.island.sea - bed < 9) return // too shallow there for it
      this.pass = { ax: mid.x - rx * span, az: mid.z - rz * span, bx: mid.x + rx * span, bz: mid.z + rz * span, y, t: 0, len: (span * 2) / V.speed }
    }
    const P = this.pass
    P.t += dt
    const k = P.t / P.len
    if (k >= 1) {
      this.pass = null
      lev.visible = false
      return
    }
    lev.visible = true
    lev.position.set(lerp(P.ax, P.bx, k), P.y + Math.sin(k * 6) * 0.6, lerp(P.az, P.bz, k))
    lev.rotation.y = Math.atan2(-(P.bx - P.ax), -(P.bz - P.az))
    const segs = lev.userData.segs
    const tt = P.t * 2.2
    for (let i = 1; i < segs.length; i++) segs[i].rotation.y = Math.sin(tt - i * 0.7) * 0.12 * (0.4 + i / segs.length)
    segs[0].rotation.y = Math.sin(tt + 0.6) * 0.05
  }

  // The nearest big contact for the sonar: the reptile if it is passing, else
  // the closest school. { kind, x, z, d } or null.
  contact(from) {
    if (this.pass && this.leviathan.visible) {
      const p = this.leviathan.position
      return { kind: 'large', x: p.x, z: p.z, d: Math.hypot(p.x - from.x, p.z - from.z) }
    }
    let best = null
    for (const s of this.schools) {
      if (!s) continue
      const d = Math.hypot(s.x - from.x, s.z - from.z)
      if (!best || d < best.d) best = { kind: 'school', x: s.x, z: s.z, d }
    }
    return best
  }
}
