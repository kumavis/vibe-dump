// Splat Siege — a first-person rocket launcher in a town made of Gaussian
// splats. The splats are the only representation of the world: a coarse voxel
// grid, filled from the splat centres, is what rockets and the player collide
// with, and an explosion simply turns the splats inside its radius into
// tumbling debris and clears their cells.
import * as THREE from 'three'
import { SplatStore, KIND } from './splats.js'
import { buildTown, mulberry32, SUN, WORLD_HALF } from './town.js'
import { Sfx } from './audio.js'

const CAPACITY = 120000
const POOL = 9000 // effect splats: fire, smoke, sparks, dust, trails
const CELL = 0.5
const GRID_HALF = 48
const GRID_H = 32
const ROCKET_SPEED = 44
const ROCKET_RADIUS = 5.2
const ROCKET_POWER = 13
const FIRE_INTERVAL = 0.55
const GRAVITY = 18
const DEBRIS_GRAVITY = 13
const EYE = 1.6
const FOG = new THREE.Color(0.80, 0.84, 0.90)
const SPAWN = new THREE.Vector3(7.5, 0, 5)
const SPAWN_YAW = 0.03
const INTRO_TARGET = new THREE.Vector3(6.5, 7, -22)

const $ = (id) => document.getElementById(id)

// ---------------------------------------------------------------- voxel grid

class Grid {
  constructor() {
    this.nx = Math.ceil((2 * GRID_HALF) / CELL)
    this.ny = Math.ceil(GRID_H / CELL)
    this.nz = this.nx
    this.cells = new Uint8Array(this.nx * this.ny * this.nz)
  }
  index(x, y, z) {
    const ix = Math.floor((x + GRID_HALF) / CELL), iy = Math.floor(y / CELL), iz = Math.floor((z + GRID_HALF) / CELL)
    if (ix < 0 || iy < 0 || iz < 0 || ix >= this.nx || iy >= this.ny || iz >= this.nz) return -1
    return (iy * this.nz + iz) * this.nx + ix
  }
  add(x, y, z) {
    const i = this.index(x, y, z)
    if (i >= 0 && this.cells[i] < 255) this.cells[i]++
  }
  remove(x, y, z) {
    const i = this.index(x, y, z)
    if (i >= 0 && this.cells[i] > 0) this.cells[i]--
  }
  solid(x, y, z) {
    const i = this.index(x, y, z)
    return i >= 0 && this.cells[i] > 0
  }
  boxSolid(x0, y0, z0, x1, y1, z1) {
    const ix0 = Math.max(0, Math.floor((x0 + GRID_HALF) / CELL)), ix1 = Math.min(this.nx - 1, Math.floor((x1 + GRID_HALF) / CELL))
    const iy0 = Math.max(0, Math.floor(y0 / CELL)), iy1 = Math.min(this.ny - 1, Math.floor(y1 / CELL))
    const iz0 = Math.max(0, Math.floor((z0 + GRID_HALF) / CELL)), iz1 = Math.min(this.nz - 1, Math.floor((z1 + GRID_HALF) / CELL))
    const c = this.cells, nx = this.nx, nz = this.nz
    for (let iy = iy0; iy <= iy1; iy++)
      for (let iz = iz0; iz <= iz1; iz++) {
        const row = (iy * nz + iz) * nx
        for (let ix = ix0; ix <= ix1; ix++) if (c[row + ix] > 0) return true
      }
    return false
  }
}

// ---------------------------------------------------------------- effects

// A pool of short-lived splats for fire, smoke, sparks and dust. They live in
// the same store as the town so they sort and blend with everything else.
class Effects {
  constructor(store, size, rng) {
    this.store = store
    this.size = size
    this.rng = rng
    this.start = store.count
    for (let k = 0; k < size; k++) {
      const i = store.add(0, 0, 0, 0.1, 0.1, 0.1, 0, 0, 0, 1, 0, 0, 0, 0, KIND.EFFECT)
      store.alive[i] = 0
    }
    this.freeList = new Int32Array(size)
    for (let k = 0; k < size; k++) this.freeList[k] = this.start + size - 1 - k
    this.freeCount = size
    this.active = new Int32Array(size)
    this.activeCount = 0
    this.vel = new Float32Array(size * 3)
    this.age = new Float32Array(size)
    this.life = new Float32Array(size)
    this.s0 = new Float32Array(size)
    this.s1 = new Float32Array(size)
    this.c0 = new Float32Array(size * 3)
    this.c1 = new Float32Array(size * 3)
    this.a0 = new Float32Array(size)
    this.drag = new Float32Array(size)
    this.grav = new Float32Array(size)
    this.fade = new Float32Array(size)
  }

  spawn(x, y, z, vx, vy, vz, life, s0, s1, c0, c1, a0, drag, grav, fade = 1) {
    if (this.freeCount === 0) return
    const i = this.freeList[--this.freeCount]
    const s = i - this.start
    this.active[this.activeCount++] = i
    const st = this.store, p = i * 3, q = i * 4
    st.pos[p] = x; st.pos[p + 1] = y; st.pos[p + 2] = z
    st.scale[p] = s0; st.scale[p + 1] = s0; st.scale[p + 2] = s0
    st.quat[q] = 0; st.quat[q + 1] = 0; st.quat[q + 2] = 0; st.quat[q + 3] = 1
    st.color[q] = c0[0] * 255; st.color[q + 1] = c0[1] * 255; st.color[q + 2] = c0[2] * 255; st.color[q + 3] = a0 * 255
    st.alive[i] = 1
    const v = s * 3
    this.vel[v] = vx; this.vel[v + 1] = vy; this.vel[v + 2] = vz
    this.age[s] = 0; this.life[s] = life; this.s0[s] = s0; this.s1[s] = s1
    this.c0[v] = c0[0]; this.c0[v + 1] = c0[1]; this.c0[v + 2] = c0[2]
    this.c1[v] = c1[0]; this.c1[v + 1] = c1[1]; this.c1[v + 2] = c1[2]
    this.a0[s] = a0; this.drag[s] = drag; this.grav[s] = grav; this.fade[s] = fade
    st.pack(i)
  }

  update(dt) {
    const st = this.store
    let w = 0
    for (let k = 0; k < this.activeCount; k++) {
      const i = this.active[k], s = i - this.start
      this.age[s] += dt
      if (this.age[s] >= this.life[s]) {
        st.alive[i] = 0
        this.freeList[this.freeCount++] = i
        continue
      }
      this.active[w++] = i
      const t = this.age[s] / this.life[s]
      const p = i * 3, q = i * 4, v = s * 3
      const dr = Math.max(0, 1 - this.drag[s] * dt)
      this.vel[v + 1] += this.grav[s] * dt
      this.vel[v] *= dr; this.vel[v + 1] *= dr; this.vel[v + 2] *= dr
      st.pos[p] += this.vel[v] * dt; st.pos[p + 1] += this.vel[v + 1] * dt; st.pos[p + 2] += this.vel[v + 2] * dt
      const g = 1 - (1 - t) * (1 - t)
      const sc = this.s0[s] + (this.s1[s] - this.s0[s]) * g
      st.scale[p] = sc; st.scale[p + 1] = sc; st.scale[p + 2] = sc
      const tc = t * t // colour holds near its start and turns late
      st.color[q] = (this.c0[v] + (this.c1[v] - this.c0[v]) * tc) * 255
      st.color[q + 1] = (this.c0[v + 1] + (this.c1[v + 1] - this.c0[v + 1]) * tc) * 255
      st.color[q + 2] = (this.c0[v + 2] + (this.c1[v + 2] - this.c0[v + 2]) * tc) * 255
      st.color[q + 3] = this.a0[s] * Math.pow(1 - t, this.fade[s]) * 255
      st.pack(i)
    }
    this.activeCount = w
  }

  clear() {
    for (let k = 0; k < this.activeCount; k++) {
      const i = this.active[k]
      this.store.alive[i] = 0
      this.freeList[this.freeCount++] = i
    }
    this.activeCount = 0
  }

  dir(out) {
    let x, y, z, l
    do {
      x = this.rng() * 2 - 1; y = this.rng() * 2 - 1; z = this.rng() * 2 - 1
      l = x * x + y * y + z * z
    } while (l > 1 || l < 1e-4)
    l = Math.sqrt(l)
    out[0] = x / l; out[1] = y / l; out[2] = z / l
    return out
  }

  explosion(x, y, z) {
    const r = this.rng, d = [0, 0, 0]
    const lerp = (a, b, t) => a + (b - a) * t
    this.spawn(x, y, z, 0, 0, 0, 0.22, 1.6, 5.5, [1, 1, 0.9], [1, 0.6, 0.25], 0.95, 0, 0, 0.6)
    for (let k = 0; k < 60; k++) {
      this.dir(d)
      const sp = 5 + r() * 12
      const hot = r()
      this.spawn(x, y, z, d[0] * sp, d[1] * sp + 2, d[2] * sp, 0.7 + r() * 0.6, 0.3 + r() * 0.4, 1.5 + r() * 1.3,
        [1, lerp(0.5, 0.92, hot), lerp(0.12, 0.5, hot)], [0.22, 0.19, 0.17], 1, 4, 2.5, 1.2)
    }
    for (let k = 0; k < 34; k++) {
      this.dir(d)
      const sp = 2 + r() * 6
      const shade = 0.25 + r() * 0.12
      this.spawn(x, y, z, d[0] * sp, Math.abs(d[1]) * sp + 1.5, d[2] * sp, 1.8 + r() * 1.6, 0.5 + r() * 0.4, 1.2 + r() * 0.9,
        [shade + 0.05, shade + 0.03, shade], [0.56, 0.56, 0.57], 0.5, 1.8, 1.0, 1.4)
    }
    for (let k = 0; k < 36; k++) {
      this.dir(d)
      const sp = 12 + r() * 16
      this.spawn(x, y, z, d[0] * sp, d[1] * sp + 4, d[2] * sp, 0.4 + r() * 0.7, 0.09, 0.03,
        [1, 0.9, 0.5], [1, 0.35, 0.1], 1, 0.6, -16, 0.5)
    }
    if (y < 1.6) {
      for (let k = 0; k < 30; k++) {
        const a = r() * Math.PI * 2, sp = 7 + r() * 8
        this.spawn(x, 0.3, z, Math.cos(a) * sp, 1 + r() * 2, Math.sin(a) * sp, 1.0 + r() * 0.6, 0.4, 1.2 + r() * 0.6,
          [0.56, 0.5, 0.42], [0.62, 0.59, 0.53], 0.5, 3.5, 0.3, 1.2)
      }
    }
  }

  puff(x, y, z, vx, vy, vz) {
    const r = this.rng
    this.spawn(x + (r() - 0.5) * 0.15, y + (r() - 0.5) * 0.15, z + (r() - 0.5) * 0.15, vx * 0.08 + (r() - 0.5), vy * 0.08 + (r() - 0.5) + 0.4, vz * 0.08 + (r() - 0.5),
      0.8 + r() * 0.5, 0.14, 0.75 + r() * 0.4, [0.8, 0.78, 0.75], [0.6, 0.6, 0.6], 0.5, 2.5, 0.5, 1.3)
  }

  flame(x, y, z, vx, vy, vz) {
    this.spawn(x, y, z, -vx * 0.05, -vy * 0.05, -vz * 0.05, 0.1, 0.22, 0.06, [1, 0.85, 0.35], [1, 0.4, 0.1], 1, 0, 0, 0.6)
  }

  muzzle(x, y, z, dx, dy, dz) {
    const r = this.rng
    this.spawn(x, y, z, 0, 0, 0, 0.09, 0.25, 0.7, [1, 0.95, 0.7], [1, 0.55, 0.2], 1, 0, 0, 0.6)
    for (let k = 0; k < 6; k++) {
      const sp = 2 + r() * 3
      this.spawn(x, y, z, dx * sp + (r() - 0.5) * 2, dy * sp + (r() - 0.5) * 2 + 0.5, dz * sp + (r() - 0.5) * 2,
        0.5 + r() * 0.3, 0.1, 0.5 + r() * 0.3, [0.85, 0.82, 0.78], [0.6, 0.6, 0.6], 0.45, 3, 0.4, 1.2)
    }
  }

  dust(x, y, z) {
    const r = this.rng
    this.spawn(x, y + 0.1, z, (r() - 0.5) * 1.5, 0.6 + r() * 0.6, (r() - 0.5) * 1.5, 0.6 + r() * 0.4, 0.2, 0.9,
      [0.6, 0.55, 0.48], [0.62, 0.6, 0.55], 0.45, 3, 0.3, 1.2)
  }
}

// ---------------------------------------------------------------- world

// Owns the town's splats: which are standing, which are flying, which have
// settled as rubble. Explosions and the debris simulation both live here.
class World {
  constructor(store, grid, sceneCount, rng, effects) {
    this.store = store
    this.grid = grid
    this.sceneCount = sceneCount
    this.rng = rng
    this.effects = effects
    const n = store.capacity
    this.state = new Uint8Array(n) // 0 standing, 1 flying, 2 rubble
    this.vel = new Float32Array(n * 3)
    this.ang = new Float32Array(n * 3)
    this.flying = new Int32Array(n)
    this.flyingCount = 0
    this.destroyed = 0
    this.totalStructure = 0
    for (let i = 0; i < sceneCount; i++) if (store.kind[i] !== KIND.GROUND) this.totalStructure++
    this.snap = {
      pos: store.pos.slice(0, sceneCount * 3),
      scale: store.scale.slice(0, sceneCount * 3),
      quat: store.quat.slice(0, sceneCount * 4),
      color: store.color.slice(0, sceneCount * 4),
    }
    this.populateGrid()
  }

  populateGrid() {
    const { grid, store } = this
    grid.cells.fill(0)
    for (let i = 0; i < this.sceneCount; i++) {
      if (store.kind[i] === KIND.GROUND) continue
      const p = i * 3
      grid.add(store.pos[p], store.pos[p + 1], store.pos[p + 2])
    }
  }

  reset() {
    const { store, snap } = this
    store.pos.set(snap.pos)
    store.scale.set(snap.scale)
    store.quat.set(snap.quat)
    store.color.set(snap.color)
    store.alive.fill(1, 0, this.sceneCount)
    this.state.fill(0)
    this.vel.fill(0)
    this.flyingCount = 0
    this.destroyed = 0
    this.populateGrid()
    this.effects.clear()
    store.packAll()
  }

  explode(cx, cy, cz, radius, power) {
    const { store, grid, rng, state, vel, ang } = this
    const pos = store.pos, color = store.color, alive = store.alive, kind = store.kind
    const r2 = radius * radius
    const outer = radius * 1.7, outer2 = outer * outer
    for (let i = 0; i < this.sceneCount; i++) {
      if (alive[i] === 0) continue
      const p = i * 3
      const dx = pos[p] - cx
      if (dx > outer || dx < -outer) continue
      const dz = pos[p + 2] - cz
      if (dz > outer || dz < -outer) continue
      const dy = pos[p + 1] - cy
      const d2 = dx * dx + dy * dy + dz * dz
      if (d2 > outer2) continue
      const d = Math.sqrt(d2)
      const q = i * 4
      const k = kind[i]
      if (d2 < r2) {
        const t = 1 - d / radius
        if (k === KIND.GROUND && state[i] === 0 && d >= radius * 0.6) {
          // crater rim: scorched and pressed down
          const u = (d - radius * 0.6) / (radius * 0.4)
          const dark = 1 - 0.55 * (1 - u)
          color[q] = Math.max(10, color[q] * dark)
          color[q + 1] = Math.max(10, color[q + 1] * dark)
          color[q + 2] = Math.max(10, color[q + 2] * dark)
          pos[p + 1] = Math.max(-0.42, pos[p + 1] - 0.35 * (1 - u))
          store.pack(i)
          continue
        }
        const inv = 1 / Math.max(d, 0.5)
        if (state[i] === 0) {
          if (k === KIND.GROUND) {
            color[q] *= 0.7; color[q + 1] *= 0.6; color[q + 2] *= 0.5
          } else {
            grid.remove(pos[p], pos[p + 1], pos[p + 2])
            this.destroyed++
            color[q] *= 0.9; color[q + 1] *= 0.88; color[q + 2] *= 0.86
          }
        }
        if (state[i] !== 1) {
          this.flying[this.flyingCount++] = i
          if (state[i] === 0) {
            store.scale[p] *= 1.25; store.scale[p + 1] *= 1.25; store.scale[p + 2] = Math.max(store.scale[p + 2] * 3, 0.06)
          }
          state[i] = 1
        }
        const f = power * (0.35 + 0.65 * t) * (0.7 + 0.6 * rng())
        const up = k === KIND.GROUND ? 1.1 : 0.4
        vel[p] += dx * inv * f + (rng() - 0.5) * 5
        vel[p + 1] += (dy * inv + up) * f + rng() * 3
        vel[p + 2] += dz * inv * f + (rng() - 0.5) * 5
        ang[p] = (rng() - 0.5) * 24; ang[p + 1] = (rng() - 0.5) * 24; ang[p + 2] = (rng() - 0.5) * 24
      } else {
        // scorch ring
        const u = (d - radius) / (outer - radius)
        const dark = 1 - 0.45 * (1 - u) * (1 - u)
        color[q] = Math.max(10, color[q] * dark)
        color[q + 1] = Math.max(10, color[q + 1] * dark)
        color[q + 2] = Math.max(10, color[q + 2] * dark)
        store.pack(i)
      }
    }
  }

  update(dt) {
    const { store, grid, rng, state, vel, ang, flying } = this
    const pos = store.pos, quat = store.quat, alive = store.alive
    const drag = Math.max(0, 1 - 0.3 * dt)
    let w = 0
    for (let k = 0; k < this.flyingCount; k++) {
      const i = flying[k], p = i * 3, q = i * 4
      vel[p + 1] -= DEBRIS_GRAVITY * dt
      vel[p] *= drag; vel[p + 1] *= drag; vel[p + 2] *= drag
      const x = pos[p], y = pos[p + 1], z = pos[p + 2]
      let nx = x + vel[p] * dt, ny = y + vel[p + 1] * dt, nz = z + vel[p + 2] * dt
      if (nx < -GRID_HALF - 6 || nx > GRID_HALF + 6 || nz < -GRID_HALF - 6 || nz > GRID_HALF + 6 || ny < -8) {
        alive[i] = 0
        state[i] = 2
        continue
      }
      let rest = false
      if (ny < 0.03) {
        const speed = Math.hypot(vel[p], vel[p + 1], vel[p + 2])
        if (speed > 5 && rng() < 0.12) this.effects.dust(nx, 0, nz)
        ny = 0.03
        vel[p + 1] = -vel[p + 1] * 0.3
        vel[p] *= 0.55; vel[p + 2] *= 0.55
        ang[p] *= 0.5; ang[p + 1] *= 0.5; ang[p + 2] *= 0.5
        if (speed < 1.2) rest = true
      } else if (grid.solid(nx, ny, nz)) {
        // glanced off something still standing
        nx = x; ny = y; nz = z
        vel[p] *= -0.35; vel[p + 1] *= -0.35; vel[p + 2] *= -0.35
        ang[p] *= 0.5; ang[p + 1] *= 0.5; ang[p + 2] *= 0.5
        if (Math.hypot(vel[p], vel[p + 1], vel[p + 2]) < 0.5) rest = true
      }
      pos[p] = nx; pos[p + 1] = ny; pos[p + 2] = nz
      if (rest) {
        vel[p] = 0; vel[p + 1] = 0; vel[p + 2] = 0
        if (ny <= 0.031) pos[p + 1] = 0.02 + rng() * 0.06
        state[i] = 2
        store.pack(i)
        continue
      }
      // integrate the tumble: q += 0.5 * (ω ⊗ q) dt
      const wx = ang[p] * 0.5 * dt, wy = ang[p + 1] * 0.5 * dt, wz = ang[p + 2] * 0.5 * dt
      const qx = quat[q], qy = quat[q + 1], qz = quat[q + 2], qw = quat[q + 3]
      let rx = qx + (wx * qw + wy * qz - wz * qy)
      let ry = qy + (wy * qw + wz * qx - wx * qz)
      let rz = qz + (wz * qw + wx * qy - wy * qx)
      let rw = qw - (wx * qx + wy * qy + wz * qz)
      const il = 1 / Math.hypot(rx, ry, rz, rw)
      quat[q] = rx * il; quat[q + 1] = ry * il; quat[q + 2] = rz * il; quat[q + 3] = rw * il
      store.pack(i)
      flying[w++] = i
    }
    this.flyingCount = w
  }
}

// ---------------------------------------------------------------- meshes

function makeSky() {
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: { uSun: { value: SUN.clone() }, uFog: { value: FOG } },
    vertexShader: `
      varying vec3 vDir;
      void main() { vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `
      uniform vec3 uSun; uniform vec3 uFog; varying vec3 vDir;
      void main() {
        vec3 d = normalize(vDir);
        vec3 top = vec3(0.22, 0.40, 0.76);
        vec3 c = mix(uFog, top, smoothstep(0.0, 0.55, d.y));
        c = mix(vec3(0.52, 0.56, 0.6), c, smoothstep(-0.12, 0.0, d.y));
        float s = max(0.0, dot(d, uSun));
        c += vec3(1.0, 0.86, 0.62) * pow(s, 180.0) * 1.2 + vec3(1.0, 0.9, 0.7) * pow(s, 6.0) * 0.14;
        gl_FragColor = vec4(c, 1.0);
      }`,
  })
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(450, 32, 16), mat)
  mesh.renderOrder = -10
  mesh.frustumCulled = false
  return mesh
}

function makeRocketMesh() {
  const g = new THREE.Group()
  const white = new THREE.MeshStandardMaterial({ color: 0xe9e6dc, roughness: 0.5 })
  const red = new THREE.MeshStandardMaterial({ color: 0xd63a2f, roughness: 0.5 })
  const dark = new THREE.MeshStandardMaterial({ color: 0x2b2d30, roughness: 0.6 })
  const flame = new THREE.MeshBasicMaterial({ color: 0xffb04a })
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.55, 10).rotateX(Math.PI / 2), white)
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.22, 10).rotateX(Math.PI / 2), red)
  nose.position.z = 0.385
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.36, 8).rotateX(-Math.PI / 2), flame)
  tail.position.z = -0.44
  g.add(body, nose, tail)
  for (let k = 0; k < 4; k++) {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.13, 0.16), dark)
    fin.position.set(0, 0.1, -0.2)
    fin.rotation.z = (k * Math.PI) / 2
    fin.position.applyAxisAngle(new THREE.Vector3(0, 0, 1), (k * Math.PI) / 2)
    g.add(fin)
  }
  return g
}

function makeWeapon() {
  const g = new THREE.Group()
  const olive = new THREE.MeshStandardMaterial({ color: 0x4a5340, roughness: 0.75, metalness: 0.1 })
  const dark = new THREE.MeshStandardMaterial({ color: 0x1f2224, roughness: 0.55, metalness: 0.35 })
  const orange = new THREE.MeshStandardMaterial({ color: 0xe8792b, roughness: 0.6 })
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.085, 1.05, 20).rotateX(Math.PI / 2), olive)
  const muzzle = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.14, 20).rotateX(Math.PI / 2), dark)
  muzzle.position.z = -0.52
  const bore = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.02, 20).rotateX(Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x050505 }))
  bore.position.z = -0.59
  const stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.06, 20).rotateX(Math.PI / 2), orange)
  stripe.position.z = -0.38
  const rear = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.075, 0.14, 20).rotateX(Math.PI / 2), dark)
  rear.position.z = 0.56
  const grip = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.22, 0.09), dark)
  grip.position.set(0, -0.16, 0.12)
  grip.rotation.x = 0.3
  const fore = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.11, 0.18), dark)
  fore.position.set(0, -0.13, -0.26)
  const sight = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.09, 0.14), dark)
  sight.position.set(0, 0.11, -0.12)
  g.add(tube, muzzle, bore, stripe, rear, grip, fore, sight)
  return g
}

// ---------------------------------------------------------------- boot

function fail(msg) {
  const el = $('error')
  el.textContent = msg
  el.classList.add('show')
  $('intro')?.remove()
}

function boot() {
  const canvas = $('c')
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' })
  if (!renderer.capabilities.isWebGL2) throw new Error('Splat Siege needs WebGL 2.')
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.autoClear = false
  renderer.setClearColor(FOG, 1)

  const scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(FOG, 0.0055)
  const weaponScene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, 1, 0.08, 900)

  for (const s of [scene, weaponScene]) {
    const hemi = new THREE.HemisphereLight(0xd8e6ff, 0x5a4b3a, 0.9)
    const sun = new THREE.DirectionalLight(0xfff1dc, 1.7)
    sun.position.copy(SUN).multiplyScalar(50)
    s.add(hemi, sun)
  }

  scene.add(makeSky())
  const soil = new THREE.Mesh(new THREE.PlaneGeometry(2 * WORLD_HALF + 1, 2 * WORLD_HALF + 1).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x2e241b }))
  soil.position.y = -0.5
  scene.add(soil)
  const far = new THREE.Mesh(new THREE.PlaneGeometry(1200, 1200).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x5c6b4e }))
  far.position.y = -0.55
  scene.add(far)

  // --- the town
  const store = new SplatStore(CAPACITY)
  const town = buildTown(store, 1337)
  const rng = mulberry32(99)
  const effects = new Effects(store, POOL, rng)
  const grid = new Grid()
  const world = new World(store, grid, town.count, rng, effects)
  store.packAll()
  store.flush()
  scene.add(store.mesh)

  // --- weapon
  const weaponRig = new THREE.Group()
  const weaponSway = new THREE.Group()
  const weapon = makeWeapon()
  weaponSway.position.set(0.3, -0.3, -0.5)
  weapon.scale.setScalar(0.6)
  weapon.rotation.set(0.02, -0.06, 0)
  weaponSway.add(weapon)
  weaponRig.add(weaponSway)
  weaponScene.add(weaponRig)

  const sfx = new Sfx()

  // --- player
  const player = {
    pos: SPAWN.clone(),
    vel: new THREE.Vector3(),
    yaw: SPAWN_YAW,
    pitch: -0.02,
    onGround: true,
  }
  const keys = new Set()
  let locked = false
  let firing = false
  let fireCooldown = 0
  let rocketsFired = 0
  let recoil = 0
  let shake = 0
  let bobPhase = 0
  let simTime = 0

  const rockets = []
  const flashes = []
  const intro = { fired: false, boomAt: -1, done: false }

  // --- input
  const overlay = $('overlay')
  const hasLock = 'requestPointerLock' in canvas
  canvas.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return
    sfx.unlock()
    if (locked || !hasLock) {
      firing = true
    } else {
      const p = canvas.requestPointerLock()
      if (p && p.catch) p.catch(() => {})
    }
  })
  window.addEventListener('mouseup', (e) => {
    if (e.button === 0) firing = false
  })
  document.addEventListener('pointerlockchange', () => {
    locked = document.pointerLockElement === canvas
    overlay.classList.toggle('hidden', locked)
    if (!locked) {
      firing = false
      keys.clear()
    }
  })
  document.addEventListener('pointerlockerror', () => {})
  window.addEventListener('mousemove', (e) => {
    if (!locked && hasLock) return
    player.yaw -= e.movementX * 0.0022
    player.pitch -= e.movementY * 0.0022
    player.pitch = Math.max(-1.5, Math.min(1.5, player.pitch))
  })
  window.addEventListener('keydown', (e) => {
    if (e.repeat) return
    keys.add(e.code)
    if (e.code === 'KeyR') rebuild()
    if (e.code === 'Space') e.preventDefault()
  })
  window.addEventListener('keyup', (e) => keys.delete(e.code))
  window.addEventListener('blur', () => {
    keys.clear()
    firing = false
  })
  canvas.addEventListener('contextmenu', (e) => e.preventDefault())

  function rebuild() {
    world.reset()
    for (const r of rockets) scene.remove(r.mesh)
    rockets.length = 0
    flashes.length = 0
    player.pos.copy(SPAWN)
    player.vel.set(0, 0, 0)
    player.yaw = SPAWN_YAW
    player.pitch = -0.02
    rocketsFired = 0
    updateHud()
  }

  // --- rockets
  const _fwd = new THREE.Vector3(), _right = new THREE.Vector3(), _up = new THREE.Vector3(), _muzzle = new THREE.Vector3(), _tmp = new THREE.Vector3()
  const Z = new THREE.Vector3(0, 0, 1)

  function muzzleWorld(out) {
    camera.getWorldDirection(_fwd)
    _right.crossVectors(_fwd, camera.up).normalize()
    _up.crossVectors(_right, _fwd).normalize()
    return out.copy(camera.position).addScaledVector(_fwd, 1.1).addScaledVector(_right, 0.34).addScaledVector(_up, -0.3)
  }

  function fireRocket(dir) {
    muzzleWorld(_muzzle)
    const r = {
      mesh: makeRocketMesh(),
      pos: _muzzle.clone(),
      vel: dir.clone().multiplyScalar(ROCKET_SPEED),
      age: 0,
      dist: 0,
      lastPuff: 0,
    }
    r.mesh.position.copy(r.pos)
    r.mesh.quaternion.setFromUnitVectors(Z, dir)
    scene.add(r.mesh)
    rockets.push(r)
    effects.muzzle(_muzzle.x, _muzzle.y, _muzzle.z, dir.x, dir.y, dir.z)
    sfx.launch()
    recoil = 1
    rocketsFired++
    $('crosshair').classList.add('kick')
    setTimeout(() => $('crosshair').classList.remove('kick'), 40)
  }

  function explode(x, y, z) {
    world.explode(x, y, z, ROCKET_RADIUS, ROCKET_POWER)
    effects.explosion(x, y, z)
    flashes.push({ x, y, z, t: simTime })
    if (flashes.length > 4) flashes.shift()
    const d = _tmp.set(x, y, z).distanceTo(camera.position)
    shake += 1.1 / (1 + d * 0.1)
    sfx.explode(d)
    // rocket jump
    const dx = player.pos.x - x, dy = player.pos.y + 0.9 - y, dz = player.pos.z - z
    const dist = Math.hypot(dx, dy, dz)
    if (dist < 7.5) {
      const f = (1 - dist / 7.5) / Math.max(dist, 0.5)
      player.vel.x += dx * f * 18
      player.vel.z += dz * f * 18
      player.vel.y += (dy * f + 0.6 * (1 - dist / 7.5)) * 14
      player.onGround = false
    }
    if (intro.fired && intro.boomAt < 0) intro.boomAt = simTime
  }

  function updateRockets(dt) {
    for (let k = rockets.length - 1; k >= 0; k--) {
      const r = rockets[k]
      r.age += dt
      const speed = r.vel.length()
      const steps = Math.max(1, Math.ceil((speed * dt) / 0.22))
      const sdt = dt / steps
      let hit = null
      for (let s = 0; s < steps && !hit; s++) {
        r.vel.y -= 2.0 * sdt
        r.pos.addScaledVector(r.vel, sdt)
        r.dist += speed * sdt
        if (r.pos.y <= 0.05) hit = [r.pos.x, 0.05, r.pos.z]
        else if (grid.solid(r.pos.x, r.pos.y, r.pos.z)) hit = [r.pos.x, r.pos.y, r.pos.z]
        else if (r.dist - r.lastPuff > 0.45) {
          r.lastPuff = r.dist
          effects.puff(r.pos.x, r.pos.y, r.pos.z, r.vel.x, r.vel.y, r.vel.z)
        }
      }
      if (hit) {
        explode(hit[0], hit[1], hit[2])
        scene.remove(r.mesh)
        rockets.splice(k, 1)
        continue
      }
      if (r.age > 6 || Math.abs(r.pos.x) > GRID_HALF + 12 || Math.abs(r.pos.z) > GRID_HALF + 12 || r.pos.y > 150) {
        scene.remove(r.mesh)
        rockets.splice(k, 1)
        continue
      }
      r.mesh.position.copy(r.pos)
      _tmp.copy(r.vel).normalize()
      r.mesh.quaternion.setFromUnitVectors(Z, _tmp)
      effects.flame(r.pos.x - _tmp.x * 0.4, r.pos.y - _tmp.y * 0.4, r.pos.z - _tmp.z * 0.4, r.vel.x, r.vel.y, r.vel.z)
    }
  }

  // --- player physics against the grid
  const HW = 0.3, PH = 1.7
  const collides = (x, y, z) => grid.boxSolid(x - HW, y + 0.05, z - HW, x + HW, y + PH, z + HW)

  function moveAxis(axis, d) {
    if (d === 0) return
    const steps = Math.ceil(Math.abs(d) / 0.1)
    const dd = d / steps
    const p = player.pos
    for (let s = 0; s < steps; s++) {
      const nx = axis === 'x' ? p.x + dd : p.x
      const nz = axis === 'z' ? p.z + dd : p.z
      if (collides(nx, p.y, nz)) {
        player.vel[axis] = 0
        return
      }
      p.x = nx
      p.z = nz
    }
  }

  function moveY(d) {
    const p = player.pos
    const steps = Math.max(1, Math.ceil(Math.abs(d) / 0.1))
    const dd = d / steps
    for (let s = 0; s < steps; s++) {
      const ny = p.y + dd
      if (dd < 0 && ny <= 0) {
        p.y = 0
        player.vel.y = 0
        player.onGround = true
        return
      }
      if (collides(p.x, ny, p.z)) {
        player.vel.y = 0
        if (dd < 0) player.onGround = true
        return
      }
      p.y = ny
      player.onGround = false
    }
  }

  function stepPlayer(dt) {
    const sy = Math.sin(player.yaw), cy = Math.cos(player.yaw)
    let f = 0, r = 0
    if (keys.has('KeyW') || keys.has('ArrowUp')) f += 1
    if (keys.has('KeyS') || keys.has('ArrowDown')) f -= 1
    if (keys.has('KeyD') || keys.has('ArrowRight')) r += 1
    if (keys.has('KeyA') || keys.has('ArrowLeft')) r -= 1
    let wx = -sy * f + cy * r, wz = -cy * f - sy * r
    const wl = Math.hypot(wx, wz)
    if (wl > 0) {
      wx /= wl
      wz /= wl
    }
    const sprint = keys.has('ShiftLeft') || keys.has('ShiftRight')
    const speed = sprint ? 9.5 : 6
    const k = 1 - Math.exp(-(player.onGround ? 11 : 2.5) * dt)
    player.vel.x += (wx * speed - player.vel.x) * k
    player.vel.z += (wz * speed - player.vel.z) * k
    if (keys.has('Space') && player.onGround) {
      player.vel.y = 6.4
      player.onGround = false
    }
    player.vel.y -= GRAVITY * dt
    moveAxis('x', player.vel.x * dt)
    moveAxis('z', player.vel.z * dt)
    moveY(player.vel.y * dt)
    const lim = WORLD_HALF - 0.6
    player.pos.x = Math.max(-lim, Math.min(lim, player.pos.x))
    player.pos.z = Math.max(-lim, Math.min(lim, player.pos.z))
    const moving = wl > 0 && player.onGround
    bobPhase += dt * (moving ? (sprint ? 13 : 9.5) : 0)
  }

  // --- hud
  const pctEl = $('pct'), splatsEl = $('splats'), rocketsEl = $('rockets'), fpsEl = $('fps')
  function updateHud() {
    const pct = world.totalStructure ? (100 * world.destroyed) / world.totalStructure : 0
    pctEl.textContent = pct.toFixed(1) + '%'
    splatsEl.textContent = world.destroyed.toLocaleString()
    rocketsEl.textContent = String(rocketsFired)
  }
  updateHud()

  // --- resize
  function resize() {
    const w = window.innerWidth, h = window.innerHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    const size = renderer.getDrawingBufferSize(new THREE.Vector2())
    const focal = size.y / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
    store.setViewport(size.x, size.y, focal)
  }
  window.addEventListener('resize', resize)
  resize()

  // --- intro: one scripted rocket into the tower so the page opens on a bang.
  // The #intro marker leaves once the blast is in full bloom (or after a
  // minute of wall-clock time on a machine too slow to get there).
  setTimeout(() => $('intro')?.remove(), 60000)
  function stepIntro() {
    if (intro.done) return
    if (!intro.fired && simTime > 0.15) {
      intro.fired = true
      camera.updateMatrixWorld()
      muzzleWorld(_muzzle)
      fireRocket(_tmp.subVectors(INTRO_TARGET, _muzzle).normalize())
    }
    if ((intro.boomAt >= 0 && simTime - intro.boomAt > 0.04) || simTime > 8) {
      intro.done = true
      $('intro')?.remove()
    }
  }

  // --- frame
  let last = performance.now()
  let fpsFrames = 0, fpsTime = 0, hudTime = 0
  const flashU = store.uniforms.uFlash.value

  function frame(now) {
    requestAnimationFrame(frame)
    const dt = Math.min(0.1, Math.max(0.001, (now - last) / 1000))
    last = now
    simTime += dt

    if (firing && fireCooldown <= 0 && (locked || !hasLock)) {
      camera.getWorldDirection(_fwd)
      fireRocket(_fwd)
      fireCooldown = FIRE_INTERVAL
    }
    fireCooldown -= dt

    stepPlayer(dt)
    stepIntro()
    updateRockets(dt)
    world.update(dt)
    effects.update(dt)

    // camera
    shake *= Math.exp(-5 * dt)
    recoil *= Math.exp(-9 * dt)
    const bob = Math.sin(bobPhase) * 0.035
    const sx = Math.sin(simTime * 61) * shake * 0.035, sz = Math.sin(simTime * 47) * shake * 0.02
    camera.position.set(player.pos.x, player.pos.y + EYE + Math.abs(bob) * 0.6, player.pos.z)
    camera.rotation.set(player.pitch + sx + recoil * 0.04, player.yaw, sz, 'YXZ')
    camera.updateMatrixWorld()
    camera.matrixWorldInverse.copy(camera.matrixWorld).invert()

    weaponRig.position.copy(camera.position)
    weaponRig.quaternion.copy(camera.quaternion)
    weaponSway.position.set(0.3 + Math.sin(bobPhase * 0.5) * 0.02, -0.3 + bob * 0.5 + recoil * 0.05, -0.5 + recoil * 0.14)
    weapon.rotation.set(0.02 - recoil * 0.25, -0.06, 0)

    for (let i = 0; i < 4; i++) {
      const f = flashes[i]
      if (!f) {
        flashU[i].w = 0
        continue
      }
      const age = simTime - f.t
      const s = age < 0.7 ? Math.pow(1 - age / 0.7, 1.6) * 1.5 : 0
      flashU[i].set(f.x, f.y, f.z, s)
    }

    store.flush()
    store.sort(camera.matrixWorldInverse)
    renderer.clear(true, true, false)
    renderer.render(scene, camera)
    renderer.clearDepth()
    renderer.render(weaponScene, camera)

    hudTime += dt
    if (hudTime > 0.2) {
      hudTime = 0
      updateHud()
    }
    fpsFrames++
    if (now - fpsTime > 500) {
      fpsEl.textContent = locked ? `${Math.round((fpsFrames * 1000) / (now - fpsTime))} fps · ${store.drawn.toLocaleString()} splats` : ''
      fpsFrames = 0
      fpsTime = now
    }
  }
  requestAnimationFrame(frame)

  window.__siege = { store, world, effects, player, rockets, explode, fireRocket, grid, get simTime() { return simTime }, get intro() { return intro } }
}

try {
  boot()
} catch (err) {
  console.error(err)
  fail(`Could not start: ${err.message}`)
}
