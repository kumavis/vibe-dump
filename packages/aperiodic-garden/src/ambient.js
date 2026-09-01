// The things that live in the garden.
//
// Everything here is deliberately small and occasional: a heron crossing, one
// kayak on the river, deer that show up in a meadow for eleven seconds and then
// are not there any more. If you notice them every time, they are too loud.

import * as THREE from 'three'
import { KEY_A, KEY_B, KEY_K, kiteCentre } from './hat.js'
import { PLAINS, FOREST, HILLS, VILLAGE, SCREE } from './board.js'
import { W, hubOf } from './geometry.js'

const lin = (hex) => new THREE.Color(hex).convertSRGBToLinear()

// --- shared little bodies ---------------------------------------------------

function birdGeo() {
  // a shallow V: two thin triangles, read as a bird at any distance
  const g = new THREE.BufferGeometry()
  const v = new Float32Array([
    0, 0, 0, -0.16, 0.05, -0.07, -0.13, 0.0, 0.04,
    0, 0, 0, 0.13, 0.0, 0.04, 0.16, 0.05, -0.07,
  ])
  g.setAttribute('position', new THREE.BufferAttribute(v, 3))
  g.computeVertexNormals()
  return g
}

function bodyGeo(rx, ry, rz) {
  const g = new THREE.IcosahedronGeometry(1, 0)
  g.scale(rx, ry, rz)
  return g
}

function kayakGeo() {
  const hull = new THREE.IcosahedronGeometry(1, 0)
  hull.scale(0.055, 0.03, 0.13)
  return hull
}

class Pool {
  constructor(parent, geo, mat, cap) {
    this.mesh = new THREE.InstancedMesh(geo, mat, cap)
    this.mesh.frustumCulled = false
    this.mesh.count = 0
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    parent.add(this.mesh)
    this.m = new THREE.Matrix4()
    this.q = new THREE.Quaternion()
    this.p = new THREE.Vector3()
    this.s = new THREE.Vector3()
    this.n = 0
  }
  begin() {
    this.n = 0
  }
  put(x, y, z, rot, sx, sy, sz) {
    if (this.n >= this.mesh.instanceMatrix.count) return
    this.p.set(x, y, z)
    this.q.setFromAxisAngle(UP, rot)
    this.s.set(sx, sy ?? sx, sz ?? sx)
    this.m.compose(this.p, this.q, this.s)
    this.mesh.setMatrixAt(this.n++, this.m)
  }
  end() {
    this.mesh.count = this.n
    this.mesh.instanceMatrix.needsUpdate = true
  }
}
const UP = new THREE.Vector3(0, 1, 0)

/**
 * Stitch the mesh builder's per-tile river branches into walkable polylines.
 * Two branches of one tile meet at its hub; two branches of neighbouring tiles
 * meet at the midpoint of the edge they share. Both meetings are exact — the
 * same point, computed the same way — so joining on rounded coordinates finds
 * every one of them.
 */
function chainBranches(branches) {
  const key = (p) => `${p[0].toFixed(3)},${p[1].toFixed(3)}`
  const ends = new Map()
  branches.forEach((b, i) => {
    for (const p of [b[0], b[b.length - 1]]) {
      const k = key(p)
      if (!ends.has(k)) ends.set(k, [])
      ends.get(k).push(i)
    }
  })
  const used = new Set()
  const paths = []
  for (let i = 0; i < branches.length; i++) {
    if (used.has(i)) continue
    used.add(i)
    let path = branches[i].slice()
    for (let step = 0; step < 60; step++) {
      const k = key(path[path.length - 1])
      const next = (ends.get(k) ?? []).find((j) => !used.has(j))
      if (next === undefined) break
      used.add(next)
      const b = branches[next]
      const seg = key(b[0]) === k ? b : b.slice().reverse()
      path = path.concat(seg.slice(1))
    }
    if (path.length >= 8) paths.push(path)
  }
  paths.sort((a, b) => b.length - a.length)
  return paths
}

/**
 * Who lives where. `on` names the cover a party will only turn up on, `n` how
 * many of them come at once, `hop` how much they bounce as they go, and `every`
 * roughly how long between visits in seconds.
 *
 * Deliberately quiet numbers: a garden with a rabbit in it once a minute reads
 * as somewhere alive, and one with rabbits on every meadow reads as a screensaver.
 */
const SPECIES = [
  { key: 'rabbit', on: 'meadow', size: [0.03, 0.03, 0.042], colour: 0xb9a893, head: 0xcdbda8, n: 3, cap: 4, hop: 0.05, speed: 0.5, every: 26 },
  { key: 'fox', on: 'meadow', size: [0.032, 0.03, 0.075], colour: 0xc4703a, head: 0xd88a4e, n: 1, cap: 2, hop: 0.012, speed: 0.42, every: 52 },
  { key: 'boar', on: 'forest', size: [0.05, 0.045, 0.09], colour: 0x54473e, head: 0x6a5a4d, n: 2, cap: 3, hop: 0.008, speed: 0.26, every: 38 },
  { key: 'goat', on: 'stone', size: [0.036, 0.04, 0.058], colour: 0xe4ded2, head: 0xcabfae, n: 3, cap: 4, hop: 0.02, speed: 0.3, every: 32 },
  { key: 'cow', on: 'meadow', size: [0.055, 0.05, 0.095], colour: 0xd9cfc0, head: 0x8a6a52, n: 2, cap: 3, hop: 0.004, speed: 0.16, every: 44 },
  { key: 'duck', on: 'water', size: [0.022, 0.02, 0.036], colour: 0xf0ead8, head: 0x4d6b46, n: 4, cap: 5, hop: 0.006, speed: 0.18, every: 30 },
]

// --- the ambience -----------------------------------------------------------

export class Ambience {
  constructor(scene) {
    this.root = new THREE.Group()
    scene.add(this.root)

    const soft = (hex, opts = {}) => new THREE.MeshLambertMaterial({ color: lin(hex), ...opts })

    this.birds = new Pool(this.root, birdGeo(), new THREE.MeshBasicMaterial({
      color: lin(0x4a5560), side: THREE.DoubleSide, transparent: true, opacity: 0.7,
    }), 9)
    this.deer = new Pool(this.root, bodyGeo(0.05, 0.045, 0.1), soft(0xa9784b), 6)
    this.deerHead = new Pool(this.root, bodyGeo(0.03, 0.03, 0.035), soft(0xb98a5c), 6)
    this.sheep = new Pool(this.root, bodyGeo(0.05, 0.045, 0.062), soft(0xf3efe4), 14)
    this.kayak = new Pool(this.root, kayakGeo(), soft(0xd9603f), 2)
    this.paddler = new Pool(this.root, bodyGeo(0.032, 0.045, 0.032), soft(0x3f6f8c), 2)
    this.smoke = new Pool(
      this.root,
      new THREE.IcosahedronGeometry(1, 0),
      new THREE.MeshBasicMaterial({ color: lin(0xf2f4f2), transparent: true, opacity: 0.2, depthWrite: false }),
      44,
    )
    this.smoke.mesh.renderOrder = 5

    // The rest of the wildlife. One pool per creature, all driven by the same
    // loop below: a party turns up on ground that suits it, mills about for a
    // while, and fades away again. Kept to a handful at a time — the garden is
    // meant to feel inhabited, not stocked.
    this.critters = SPECIES.map((sp) => ({
      spec: sp,
      body: new Pool(this.root, bodyGeo(sp.size[0], sp.size[1], sp.size[2]), soft(sp.colour), sp.cap),
      head: sp.head
        ? new Pool(this.root, bodyGeo(sp.size[0] * 0.6, sp.size[1] * 0.6, sp.size[1] * 0.7), soft(sp.head), sp.cap)
        : null,
      party: null,
      at: 5 + Math.random() * 14,
    }))

    // pollen / midges over the woods
    const moteN = 90
    const mg = new THREE.BufferGeometry()
    mg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(moteN * 3), 3))
    this.motes = new THREE.Points(
      mg,
      new THREE.PointsMaterial({
        color: lin(0xfff3c8),
        size: 0.045,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    )
    this.motes.frustumCulled = false
    this.root.add(this.motes)
    this.moteHome = []
    this.moteN = moteN

    this.reset()
  }

  reset() {
    this.flock = null
    this.flockAt = 6
    this.deerParty = null
    this.deerAt = 9
    this.boat = null
    this.boatAt = 4
    this.flocks = []
    this.sheepSpots = []
    this.chimneys = []
    this.rivers = []
    this.forest = []
    this.grazing = []
    this.stone = []
    this.meadow = []
    this.water = []
    for (const c of this.critters ?? []) {
      c.party = null
      c.at = 5 + Math.random() * 14
    }
    this.t = 0
  }

  /** Re-read the board: where the woods and pastures are, and where the river
   *  runs — the latter comes in as the mesh builder's own ribbon polylines, so
   *  a boat follows exactly the line that is drawn. */
  sync(game, branches = []) {
    const board = game.board
    const at = (key) => {
      const [x, z] = kiteCentre(KEY_A(key), KEY_B(key), KEY_K(key))
      return [x * W, 0, z * W]
    }

    this.forest = []
    this.grazing = []
    this.chimneys = []
    this.stone = []
    this.meadow = []
    for (const key of board.filled) {
      const b = board.biome.get(key)
      if (b === FOREST) this.forest.push(at(key))
      else if (b === PLAINS || b === HILLS) this.grazing.push(at(key))
      else if (b === VILLAGE) this.chimneys.push(at(key))
      if (b === PLAINS) this.meadow.push(at(key))
      else if (b === SCREE || b === HILLS) this.stone.push(at(key))
    }

    this.rivers = chainBranches(branches)
    // Ducks want still water, so the lakes: a tile with one crossing has its
    // pool at the hub, and that is where they sit.
    this.water = []
    for (const t of board.tiles) {
      if (t.ports.size !== 1) continue
      const [x, z] = hubOf(t.cells)
      this.water.push([x, 0.02, z])
    }

    // Sheep settle in one or two pastures and stay there.
    if (this.grazing.length > 3) {
      this.sheepSpots = this.sheepSpots.filter((s) =>
        this.grazing.some((g) => Math.abs(g[0] - s.x) < 0.01 && Math.abs(g[2] - s.z) < 0.01),
      )
      while (this.sheepSpots.length < Math.min(2, Math.floor(this.grazing.length / 8))) {
        const g = this.grazing[Math.floor(Math.random() * this.grazing.length)]
        this.sheepSpots.push({ x: g[0], y: g[1], z: g[2], n: 3 + Math.floor(Math.random() * 3), ph: Math.random() * 9 })
      }
    }

    // Midges hang over the woods.
    this.moteHome = []
    for (let i = 0; i < this.moteN; i++) {
      const f = this.forest.length ? this.forest[Math.floor(Math.random() * this.forest.length)] : null
      this.moteHome.push(f ? [f[0], f[1], f[2]] : null)
    }
  }

  celebrate(res) {
    // carrying the river on is a fine excuse to send a boat down it
    if (res.joined > 0) this.boatAt = Math.min(this.boatAt, 2.0)
    if (res.announce?.length) this.flockAt = Math.min(this.flockAt, 2.5)
  }

  update(dt, t, game) {
    this.t = t
    this._birds(dt, t)
    this._deer(dt, t)
    this._sheep(t)
    this._boat(dt, t)
    this._critters(dt, t)
    this._smoke(t)
    this._motes(t)
  }

  // Herons crossing, high and slow, every twenty-odd seconds.
  _birds(dt, t) {
    this.birds.begin()
    if (!this.flock) {
      this.flockAt -= dt
      if (this.flockAt <= 0) {
        const ang = Math.random() * Math.PI * 2
        const r = 16 + Math.random() * 8
        const cx = Math.cos(ang) * r
        const cz = Math.sin(ang) * r
        this.flock = {
          x: cx,
          z: cz,
          y: 4.4 + Math.random() * 2.6,
          vx: -cx / r,
          vz: -cz / r,
          n: 3 + Math.floor(Math.random() * 4),
          life: 0,
        }
        this.flockAt = 22 + Math.random() * 26
      }
    } else {
      const f = this.flock
      const sp = 2.4
      f.x += f.vx * sp * dt
      f.z += f.vz * sp * dt
      f.life += dt
      const yaw = Math.atan2(f.vx, f.vz)
      for (let i = 0; i < f.n; i++) {
        const lag = i * 0.55
        const side = (i % 2 ? 1 : -1) * Math.ceil(i / 2) * 0.42
        const px = f.x - f.vx * lag + -f.vz * side
        const pz = f.z - f.vz * lag + f.vx * side
        const flap = 1 + Math.sin(t * 7 + i * 1.7) * 0.35
        this.birds.put(px, f.y + Math.sin(t * 0.7 + i) * 0.12, pz, yaw, 1, flap, 1)
      }
      if (f.life > 26) this.flock = null
    }
    this.birds.end()
  }

  // Deer wander into a clearing, browse, and leave.
  _deer(dt, t) {
    this.deer.begin()
    this.deerHead.begin()
    if (!this.deerParty) {
      this.deerAt -= dt
      const pool = this.forest.length ? this.forest : this.grazing
      if (this.deerAt <= 0 && pool.length) {
        const spot = pool[Math.floor(Math.random() * pool.length)]
        this.deerParty = {
          x: spot[0],
          y: spot[1],
          z: spot[2],
          n: 1 + (Math.random() < 0.5 ? 1 : 0),
          life: 0,
          dir: Math.random() * Math.PI * 2,
          ph: Math.random() * 8,
        }
        this.deerAt = 16 + Math.random() * 22
      }
    } else {
      const d = this.deerParty
      d.life += dt
      const fade = Math.min(1, d.life * 2, Math.max(0, (13 - d.life) * 0.7))
      for (let i = 0; i < d.n; i++) {
        const wob = Math.sin(t * 0.5 + d.ph + i * 2.1)
        const ox = Math.cos(d.dir + i * 1.9) * (0.12 + 0.05 * wob)
        const oz = Math.sin(d.dir + i * 1.9) * (0.12 + 0.05 * wob)
        const yaw = d.dir + wob * 0.5
        const y = d.y + 0.055
        this.deer.put(d.x + ox, y, d.z + oz, yaw, fade, fade, fade)
        this.deerHead.put(
          d.x + ox + Math.sin(yaw) * 0.085,
          y + 0.035 + Math.sin(t * 1.3 + d.ph) * 0.012,
          d.z + oz + Math.cos(yaw) * 0.085,
          yaw,
          fade,
          fade,
          fade,
        )
      }
      if (d.life > 14) this.deerParty = null
    }
    this.deer.end()
    this.deerHead.end()
  }

  _sheep(t) {
    this.sheep.begin()
    for (const s of this.sheepSpots) {
      for (let i = 0; i < s.n; i++) {
        const a = s.ph + i * 2.3
        const r = 0.11 + 0.05 * Math.sin(t * 0.13 + a)
        this.sheep.put(
          s.x + Math.cos(a + t * 0.035) * r,
          s.y + 0.045,
          s.z + Math.sin(a + t * 0.035) * r,
          a,
          1,
          1,
          1,
        )
      }
    }
    this.sheep.end()
  }

  // One kayak, on the longest river, now and then.
  _boat(dt, t) {
    this.kayak.begin()
    this.paddler.begin()
    if (!this.boat) {
      this.boatAt -= dt
      if (this.boatAt <= 0 && this.rivers.length) {
        const pick = this.rivers[Math.floor(Math.random() * Math.min(3, this.rivers.length))]
        this.boat = { path: pick, u: 0 }
        this.boatAt = 20 + Math.random() * 28
      }
    } else {
      const p = this.boat.path
      this.boat.u += dt * 1.6
      const i = Math.floor(this.boat.u)
      if (i >= p.length - 1) {
        this.boat = null
      } else {
        const f = this.boat.u - i
        const a = p[i]
        const b = p[i + 1]
        const x = a[0] + (b[0] - a[0]) * f
        const z = a[1] + (b[1] - a[1]) * f
        const y = 0.03
        const yaw = Math.atan2(b[0] - a[0], b[1] - a[1])
        const bob = Math.sin(t * 3.1) * 0.008
        this.kayak.put(x, y + bob, z, yaw, 1, 1, 1)
        this.paddler.put(x, y + 0.045 + bob, z, yaw + Math.sin(t * 4.2) * 0.28, 1, 1, 1)
      }
    }
    this.kayak.end()
    this.paddler.end()
  }

  /**
   * Everything that walks. One party per species at a time: it arrives on
   * ground of its own kind, wanders a small circle for a while, and fades out.
   * The whole thing is one loop over the table rather than a method each,
   * because "a few of these turn up over there and mill about" is the same
   * behaviour for a rabbit, a boar and a duck — only the numbers differ.
   */
  _critters(dt, t) {
    for (const c of this.critters) {
      const sp = c.spec
      c.body.begin()
      c.head?.begin()
      const ground = this[sp.on] ?? []

      if (!c.party) {
        c.at -= dt
        if (c.at <= 0 && ground.length) {
          const home = ground[Math.floor(Math.random() * ground.length)]
          c.party = {
            x: home[0],
            y: home[1],
            z: home[2],
            life: 0,
            span: 14 + Math.random() * 12,
            ph: Math.random() * 9,
            // each one keeps its own offset and its own little orbit
            who: Array.from({ length: sp.n }, () => ({
              a: Math.random() * Math.PI * 2,
              r: 0.06 + Math.random() * 0.18,
              w: (Math.random() < 0.5 ? -1 : 1) * (0.5 + Math.random()),
              b: Math.random() * 7,
            })),
          }
          c.at = sp.every * (0.6 + Math.random() * 0.8)
        }
      } else {
        const p = c.party
        p.life += dt
        // in over the first second, out over the last two
        const fade = Math.min(1, p.life * 1.6, Math.max(0, (p.span - p.life) * 0.5))
        for (const w of p.who) {
          const a = w.a + t * sp.speed * w.w
          const x = p.x + Math.cos(a) * w.r
          const z = p.z + Math.sin(a) * w.r
          const bob = Math.abs(Math.sin(t * 3.4 + w.b)) * sp.hop
          const yaw = a + (w.w > 0 ? Math.PI / 2 : -Math.PI / 2)
          c.body.put(x, p.y + bob, z, yaw, fade)
          // the head out front, so which way it is facing reads at a glance
          if (c.head) {
            c.head.put(
              x + Math.cos(yaw) * sp.size[2] * 0.85,
              p.y + bob + sp.size[1] * 0.55,
              z + Math.sin(yaw) * sp.size[2] * 0.85,
              yaw,
              fade,
            )
          }
        }
        if (p.life > p.span) c.party = null
      }

      c.body.end()
      c.head?.end()
    }
  }

  _smoke(t) {
    this.smoke.begin()
    for (let c = 0; c < this.chimneys.length && c < 11; c++) {
      const [x, y, z] = this.chimneys[c]
      for (let i = 0; i < 4; i++) {
        const ph = ((t * 0.22 + i * 0.25 + c * 0.37) % 1)
        const rise = ph * 0.75
        const grow = 0.02 + ph * 0.055
        const drift = ph * ph * 0.22
        this.smoke.put(x + drift, y + 0.24 + rise, z + drift * 0.4, 0, grow * (1 - ph * 0.35))
      }
    }
    this.smoke.end()
  }

  _motes(t) {
    const arr = this.motes.geometry.attributes.position.array
    let n = 0
    for (let i = 0; i < this.moteN; i++) {
      const h = this.moteHome[i]
      if (!h) continue
      arr[n * 3] = h[0] + Math.sin(t * 0.6 + i * 1.7) * 0.18
      arr[n * 3 + 1] = h[1] + 0.22 + Math.sin(t * 0.9 + i * 2.3) * 0.1
      arr[n * 3 + 2] = h[2] + Math.cos(t * 0.5 + i * 2.9) * 0.18
      n++
    }
    this.motes.geometry.setDrawRange(0, n)
    this.motes.geometry.attributes.position.needsUpdate = true
  }
}
