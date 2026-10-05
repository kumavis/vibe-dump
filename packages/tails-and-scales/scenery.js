import * as THREE from 'three'
import { mulberry32, pick, rr, tween, easeIn, bounce } from './util.js'

// ---------------------------------------------------------------------------
// The modular battlefield.
//
// Everything on the table is built from a handful of *modules* — a wall
// column (a stack of blocks), a tree, a hedge segment, a boulder, a crate, a
// giant mushroom — and every module is one or more *chunks*: the unit of line
// of sight, cover, movement blocking and destruction. Modules are composed into
// *features* (an L-shaped ruin, a copse, a hedgerow, a ruined tower ring...)
// and features are scattered with point symmetry, so neither army gets the
// better half of the table.
//
// A chunk carries an oriented box (`shape`) used for line of sight and blast
// tests, an optional separate footprint (`nav`) for movement, and hit points.
// Blasts chip them; at zero they break: wall blocks shatter and the blocks
// above drop into the gap, trees topple into logs, hedges and crates burst.
// ---------------------------------------------------------------------------

const BOX = new THREE.BoxGeometry(1, 1, 1)
const LOG = new THREE.CylinderGeometry(0.5, 0.5, 1, 8).rotateZ(Math.PI / 2)
const mats = new Map()
function mat(color, opts = {}) {
  const key = color + JSON.stringify(opts)
  if (!mats.has(key)) mats.set(key, new THREE.MeshStandardMaterial({ color, roughness: 0.9, flatShading: true, ...opts }))
  return mats.get(key)
}
function mesh(geo, material, { shadow = true } = {}) {
  const m = new THREE.Mesh(geo, material)
  m.castShadow = shadow
  m.receiveShadow = true
  return m
}

const STYLES = {
  stone: { colors: ['#8f8b82', '#9c978d', '#7f7b73', '#a7a296', '#878378'], bw: 1, by: 0.72, bt: 0.62, hp: 3, look: 'box' },
  sand: { colors: ['#c9a66b', '#d6b67e', '#b9935b', '#ddc28e', '#c29a60'], bw: 1, by: 0.72, bt: 0.66, hp: 2, look: 'box' },
  log: { colors: ['#7a5232', '#6b4528', '#86603c', '#5f3e24'], bw: 1, by: 0.56, bt: 0.56, hp: 2, look: 'log' },
}
const LEAVES = {
  oak: ['#4f8a34', '#5f9a3c', '#447a2c', '#6aa646'],
  autumn: ['#d08a2c', '#c4622a', '#e0a93a', '#b8481f'],
  pine: ['#2f6a3c', '#3a7a46', '#285c34'],
}
const WOOD = ['#7a5232', '#5f3e24', '#9a7048', '#b08a5a']

let nextId = 1

export class Scenery {
  constructor(scene, fx, W, H) {
    this.scene = scene
    this.fx = fx
    this.W = W
    this.H = H
    this.group = new THREE.Group()
    scene.add(this.group)
    this.chunks = []
    this.features = []
    this.dirty = true
    this.onBreak = null // (chunk) => {} — main hooks sound and nav refresh here
  }

  clear() {
    this.scene.remove(this.group)
    this.group = new THREE.Group()
    this.scene.add(this.group)
    this.chunks = []
    this.features = []
    this.dirty = true
  }

  add(def) {
    const c = {
      id: nextId++, alive: true, destructible: def.hp !== Infinity, hp: def.hp ?? Infinity, maxHp: def.hp ?? Infinity,
      los: null, cover: false, navKind: null, ...def,
    }
    const s = c.shape
    s.reach = Math.hypot(s.hx, s.hz) + 0.05
    if (c.mesh) this.group.add(c.mesh)
    this.chunks.push(c)
    return c
  }

  // ── Generation ────────────────────────────────────────────────────────────
  generate(seed, objectives, deployDepth) {
    this.clear()
    const rng = mulberry32(seed)
    const { W, H } = this
    const placed = []

    // The middle of the table: something wrapped around the centre objective.
    const centre = rng()
    if (centre < 0.55) {
      this.build('tower', { x: 0, z: 0, yaw: rng() * Math.PI }, (rng() * 1e9) | 0)
      placed.push({ x: 0, z: 0, r: 4.6, hollow: true })
    } else if (centre < 0.8) {
      // four little rock piles boxing the objective in, mirrored in pairs
      const a = rng() * Math.PI
      for (const k of [0, 1]) {
        const ang = a + k * (Math.PI / 2)
        const x = Math.cos(ang) * 4.2, z = Math.sin(ang) * 4.2
        const s = (rng() * 1e9) | 0
        this.build('rocks', { x, z, yaw: ang }, s)
        this.build('rocks', { x: -x, z: -z, yaw: ang + Math.PI }, s)
        placed.push({ x, z, r: 1.8 }, { x: -x, z: -z, r: 1.8 })
      }
    }

    const KINDS = [
      ['ruin', 3.2, 4],
      ['wall', 3.6, 2],
      ['forest', 3.2, 3],
      ['hedgerow', 3.4, 2],
      ['rocks', 2.0, 2],
      ['barricade', 2.0, 2],
      ['mushrooms', 2.0, 1.5],
      ['obelisk', 1.6, 1],
    ]
    const total = KINDS.reduce((s, k) => s + k[2], 0)
    const want = 6 + Math.floor(rng() * 3)
    let pairs = 0
    for (let attempt = 0; attempt < 1200 && pairs < want; attempt++) {
      let w = rng() * total, kind = KINDS[0]
      for (const k of KINDS) if ((w -= k[2]) <= 0) { kind = k; break }
      const [name, r] = kind
      const x = rr(rng, -W / 2 + r + 0.5, W / 2 - r - 0.5)
      const z = rr(rng, -H / 2 + r + 0.5, H / 2 - r - 0.5)
      // a feature and its mirror image mustn't overlap each other
      if (Math.hypot(x, z) < r + 1.4) continue
      const inDeploy = Math.abs(x) > W / 2 - deployDepth - 1
      if (inDeploy && (r > 2.1 || name === 'forest')) continue
      if (objectives.some((o) => Math.hypot(o.x - x, o.z - z) < r + 2.2)) continue
      const gap = 2.1
      if (placed.some((p) => Math.hypot(p.x - x, p.z - z) < p.r + r + gap || Math.hypot(p.x + x, p.z + z) < p.r + r + gap)) continue
      const yaw = rng() * Math.PI * 2
      const s = (rng() * 1e9) | 0
      this.build(name, { x, z, yaw }, s)
      this.build(name, { x: -x, z: -z, yaw: yaw + Math.PI }, s)
      placed.push({ x, z, r }, { x: -x, z: -z, r })
      pairs++
    }
    this.features = placed
    this.dirty = true
  }

  // Build feature `name` in frame F from its own seed, so the mirrored copy
  // comes out identical, just turned around.
  build(name, frame, seed) {
    const rng = mulberry32(seed)
    const c = Math.cos(frame.yaw), s = Math.sin(frame.yaw)
    const F = {
      p: (lx, lz) => ({ x: frame.x + c * lx + s * lz, z: frame.z - s * lx + c * lz }),
      yaw: (ly = 0) => frame.yaw + ly,
    }
    this[name](F, rng)
  }

  // ── Modules ───────────────────────────────────────────────────────────────

  // A wall column: a stack of `h` blocks (with optional holes for windows).
  column(F, rng, lx, lz, ly, h, styleKey, { holes = [], cap = false, bw, bt } = {}) {
    const st = STYLES[styleKey]
    const w = bw ?? st.bw, t = bt ?? st.bt
    const p = F.p(lx, lz)
    const yaw = F.yaw(ly)
    const col = { blocks: [], x: p.x, z: p.z, yaw, style: st, rubble: null, w, t }
    for (let k = 0; k < h; k++) {
      if (holes.includes(k)) continue
      const color = pick(st.colors, rng)
      const jy = yaw + (rng() - 0.5) * 0.06
      const m = mesh(st.look === 'log' ? LOG : BOX, mat(color))
      if (st.look === 'log') m.scale.set(w * 1.02, st.by, t)
      else m.scale.set(w * (0.95 + rng() * 0.04), st.by * 0.96, t * (0.9 + rng() * 0.1))
      m.position.set(p.x, st.by * (k + 0.5), p.z)
      m.rotation.y = jy
      const b = this.add({
        kind: 'block', mesh: m, hp: st.hp, color,
        shape: { x: p.x, y: st.by * (k + 0.5), z: p.z, hx: w / 2, hy: st.by / 2, hz: t / 2, yaw },
        navKind: 'soft', los: 'block', cover: true,
      })
      b.col = col
      b.level = k
      col.blocks.push(b)
    }
    if (cap && h > 0) {
      const color = pick(st.colors, rng)
      const m = mesh(new THREE.ConeGeometry(w * 0.72, w * 1.1, 4).rotateY(Math.PI / 4), mat(color))
      const y = st.by * h + w * 0.55
      m.position.set(p.x, y, p.z)
      m.rotation.y = yaw
      const b = this.add({
        kind: 'block', mesh: m, hp: st.hp, color, capH: w * 1.1,
        shape: { x: p.x, y, z: p.z, hx: w / 2, hy: w * 0.55, hz: w / 2, yaw },
        navKind: 'soft', los: 'block', cover: true,
      })
      b.col = col
      b.level = h
      col.blocks.push(b)
    }
    return col
  }

  tree(F, rng, lx, lz, species) {
    const p = F.p(lx, lz)
    const trunkH = rr(rng, 1.5, 2.4), trunkR = rr(rng, 0.17, 0.26)
    const g = new THREE.Group()
    g.position.set(p.x, 0, p.z)
    const trunk = mesh(new THREE.CylinderGeometry(trunkR * 0.75, trunkR, trunkH, 7).translate(0, trunkH / 2, 0), mat(pick(['#6b4a2e', '#5a3d24', '#7a5638'], rng)))
    g.add(trunk)
    const canopy = new THREE.Group()
    g.add(canopy)
    let top
    const leaves = LEAVES[species]
    if (species === 'pine') {
      for (let i = 0; i < 3; i++) {
        const r = 1.05 - i * 0.26, h = 1.3 - i * 0.15
        const cone = mesh(new THREE.ConeGeometry(r, h, 8), mat(pick(leaves, rng)))
        cone.position.y = trunkH * 0.45 + i * 0.75 + h / 2
        cone.rotation.y = rng() * 3
        canopy.add(cone)
      }
      top = trunkH * 0.45 + 2.5
    } else {
      const n = 3 + Math.floor(rng() * 3)
      for (let i = 0; i < n; i++) {
        const r = rr(rng, 0.55, 0.9)
        const blob = mesh(new THREE.IcosahedronGeometry(r, 1), mat(pick(leaves, rng)))
        blob.position.set(rr(rng, -0.5, 0.5), trunkH + rr(rng, -0.1, 0.6), rr(rng, -0.5, 0.5))
        blob.scale.y = 0.8
        canopy.add(blob)
      }
      top = trunkH + 1.2
    }
    g.rotation.y = rng() * 6
    const c = this.add({
      kind: 'tree', mesh: g, hp: 3, leaves,
      shape: { x: p.x, y: top / 2, z: p.z, hx: 0.7, hy: top / 2, hz: 0.7, yaw: 0 },
      nav: { x: p.x, z: p.z, hx: trunkR + 0.12, hz: trunkR + 0.12, yaw: 0 },
      coverShape: { x: p.x, z: p.z, hx: 0.8, hz: 0.8, yaw: 0 },
      navKind: 'soft', los: 'obscure', cover: true,
    })
    c.trunkH = trunkH
    c.trunkR = trunkR
    c.canopy = canopy
    return c
  }

  hedge(F, rng, lx, lz, ly) {
    const p = F.p(lx, lz)
    const yaw = F.yaw(ly)
    const g = new THREE.Group()
    g.position.set(p.x, 0, p.z)
    g.rotation.y = yaw
    const col = pick(['#3f7a34', '#4a8a3a', '#386c2e'], rng)
    const body = mesh(BOX, mat(col))
    body.scale.set(1.15, 0.62, 0.55)
    body.position.y = 0.31
    g.add(body)
    for (let i = 0; i < 3; i++) {
      const b = mesh(new THREE.IcosahedronGeometry(0.3, 0), mat(pick(['#4f8f3e', '#5c9a46', '#3f7a34'], rng)))
      b.position.set(-0.4 + i * 0.4, 0.62 + rng() * 0.08, rr(rng, -0.08, 0.08))
      g.add(b)
    }
    if (rng() < 0.4) {
      // a few berries, because why not
      for (let i = 0; i < 4; i++) {
        const b = mesh(new THREE.SphereGeometry(0.05, 5, 4), mat('#c0302a'), { shadow: false })
        b.position.set(rr(rng, -0.5, 0.5), rr(rng, 0.35, 0.75), 0.29)
        g.add(b)
      }
    }
    return this.add({
      kind: 'hedge', mesh: g, hp: 1, leaves: ['#3f7a34', '#5c9a46', '#2f5f28'],
      shape: { x: p.x, y: 0.42, z: p.z, hx: 0.6, hy: 0.42, hz: 0.3, yaw },
      navKind: 'diff', los: 'obscure', cover: true,
    })
  }

  boulder(F, rng, lx, lz, size) {
    const p = F.p(lx, lz)
    const sy = rr(rng, 0.65, 1.25)
    const m = mesh(new THREE.DodecahedronGeometry(size, 0), mat(pick(['#7d7a74', '#8c8880', '#6e6b66', '#96918a'], rng)))
    m.scale.set(1, sy, rr(rng, 0.75, 1.1))
    m.rotation.set(rng() * 0.6, rng() * 6, rng() * 0.6)
    const h = size * sy
    m.position.set(p.x, h * 0.55, p.z)
    // a lick of moss
    if (rng() < 0.6) {
      const moss = mesh(new THREE.DodecahedronGeometry(size * 0.55, 0), mat('#5d7a3a'), { shadow: false })
      moss.position.set(0, size * 0.55, 0)
      moss.scale.set(1.1, 0.4, 1.1)
      m.add(moss)
    }
    const top = h * 1.5
    return this.add({
      kind: 'rock', mesh: m, hp: Infinity,
      shape: { x: p.x, y: top / 2, z: p.z, hx: size * 0.85, hy: top / 2, hz: size * 0.85, yaw: 0 },
      navKind: 'hard', los: top > 1.2 ? 'block' : 'obscure', cover: true,
    })
  }

  crate(F, rng, lx, lz) {
    const p = F.p(lx, lz)
    const yaw = F.yaw(rng() * 6)
    const kind = rng()
    let m, top
    if (kind < 0.45) {
      m = new THREE.Group()
      const s = rr(rng, 0.55, 0.75)
      const box = mesh(BOX, mat(pick(['#9a7048', '#8a6038', '#a77d50'], rng)))
      box.scale.setScalar(s)
      box.position.y = s / 2
      const band = mesh(BOX, mat('#5f3e24'))
      band.scale.set(s * 1.02, s * 0.14, s * 1.02)
      band.position.y = s / 2
      m.add(box, band)
      if (rng() < 0.4) {
        const box2 = mesh(BOX, mat('#9a7048'))
        box2.scale.setScalar(s * 0.7)
        box2.position.set(0, s + s * 0.35, 0)
        box2.rotation.y = 0.5
        m.add(box2)
        top = s * 1.7
      } else top = s
    } else if (kind < 0.8) {
      m = new THREE.Group()
      const b = mesh(new THREE.CylinderGeometry(0.28, 0.24, 0.75, 10), mat(pick(['#8a5a34', '#7a4c2a'], rng)))
      b.position.y = 0.375
      const hoop = mesh(new THREE.TorusGeometry(0.29, 0.025, 4, 14).rotateX(Math.PI / 2), mat('#3a3a3a', { metalness: 0.4 }))
      hoop.position.y = 0.55
      m.add(b, hoop)
      top = 0.75
    } else {
      // a sack of acorns, split at the top
      m = new THREE.Group()
      const sack = mesh(new THREE.SphereGeometry(0.34, 9, 7), mat('#c2a77a'))
      sack.scale.set(1, 1.15, 0.9)
      sack.position.y = 0.36
      m.add(sack)
      for (let i = 0; i < 4; i++) {
        const a = mesh(new THREE.SphereGeometry(0.08, 6, 5), mat('#8a5a2a'))
        a.position.set(rr(rng, -0.12, 0.12), 0.72, rr(rng, -0.12, 0.12))
        m.add(a)
      }
      top = 0.78
    }
    m.position.set(p.x, 0, p.z)
    m.rotation.y = yaw
    return this.add({
      kind: 'crate', mesh: m, hp: 1, color: '#9a7048',
      shape: { x: p.x, y: top / 2, z: p.z, hx: 0.36, hy: top / 2, hz: 0.36, yaw },
      navKind: 'diff', los: 'obscure', cover: true,
    })
  }

  mushroom(F, rng, lx, lz) {
    const p = F.p(lx, lz)
    const h = rr(rng, 0.9, 1.9), r = rr(rng, 0.5, 0.95), sr = rr(rng, 0.12, 0.2)
    const g = new THREE.Group()
    g.position.set(p.x, 0, p.z)
    const stem = mesh(new THREE.CylinderGeometry(sr * 0.8, sr * 1.2, h, 8).translate(0, h / 2, 0), mat('#efe6d0'))
    const capCol = pick(['#c0392b', '#d35a1f', '#8e44ad', '#b03050'], rng)
    const cap = mesh(new THREE.SphereGeometry(r, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), mat(capCol))
    cap.position.y = h - 0.05
    cap.scale.y = 0.7
    g.add(stem, cap)
    for (let i = 0; i < 6; i++) {
      const a = rng() * 6, e = rr(rng, 0.25, 1.1)
      const dot = mesh(new THREE.SphereGeometry(r * 0.12, 5, 4), mat('#fff6e0'), { shadow: false })
      dot.position.set(Math.cos(a) * Math.sin(e) * r, h - 0.05 + Math.cos(e) * r * 0.7, Math.sin(a) * Math.sin(e) * r)
      g.add(dot)
    }
    g.rotation.z = rr(rng, -0.12, 0.12)
    const top = h + r * 0.7
    return this.add({
      kind: 'mushroom', mesh: g, hp: 2, leaves: [capCol, '#fff6e0', '#efe6d0'],
      shape: { x: p.x, y: top / 2, z: p.z, hx: r * 0.6, hy: top / 2, hz: r * 0.6, yaw: 0 },
      nav: { x: p.x, z: p.z, hx: sr + 0.12, hz: sr + 0.12, yaw: 0 },
      navKind: 'soft', los: 'obscure', cover: true,
    })
  }

  floor(F, rng, r, color) {
    const p = F.p(0, 0)
    const geo = new THREE.CircleGeometry(r, 22)
    const pos = geo.attributes.position
    for (let i = 1; i < pos.count; i++) {
      const k = 0.78 + rng() * 0.3
      pos.setXY(i, pos.getX(i) * k, pos.getY(i) * k)
    }
    geo.rotateX(-Math.PI / 2)
    const m = mesh(geo, mat(color, { flatShading: false }), { shadow: false })
    m.position.set(p.x, 0.012, p.z)
    return this.add({
      kind: 'floor', mesh: m, hp: Infinity,
      shape: { x: p.x, y: 0.01, z: p.z, hx: r * 0.75, hy: 0.01, hz: r * 0.75, yaw: 0 },
      navKind: 'diff', cover: true,
    })
  }

  // ── Features ──────────────────────────────────────────────────────────────

  ruin(F, rng) {
    const style = pick(['stone', 'sand', 'log', 'stone'], rng)
    const A = 4 + Math.floor(rng() * 3), B = 3 + Math.floor(rng() * 3)
    const ox = -A / 2 + 0.5, oz = -B / 2 + 0.5
    const door = 1 + Math.floor(rng() * (A - 2))
    for (let i = 0; i < A; i++) {
      if (i === door) continue
      let h = Math.max(1, Math.min(3, 3 - Math.floor(i / 2) + Math.floor(rng() * 2) - (rng() < 0.3 ? 1 : 0)))
      const holes = h === 3 && rng() < 0.35 ? [1] : []
      this.column(F, rng, ox + i, oz, 0, h, style, { holes })
    }
    for (let j = 1; j <= B; j++) {
      let h = Math.max(1, Math.min(3, 3 - Math.floor(j / 2) + Math.floor(rng() * 2)))
      if (rng() < 0.15) continue
      const holes = h === 3 && rng() < 0.35 ? [1] : []
      this.column(F, rng, ox, oz + 0.3 + 0.5 + (j - 1), Math.PI / 2, h, style, { holes })
    }
    const n = Math.floor(rng() * 3)
    for (let i = 0; i < n; i++) this.crate(F, rng, ox + rr(rng, 1.5, A - 1), oz + rr(rng, 1.6, B - 0.5))
  }

  wall(F, rng) {
    const style = pick(['stone', 'sand', 'log'], rng)
    const n = 5 + Math.floor(rng() * 3)
    const gap = Math.floor(rng() * n)
    for (let i = 0; i < n; i++) {
      if (i === gap && n > 5) continue
      const h = 1 + Math.floor(rng() * 3)
      this.column(F, rng, i - (n - 1) / 2, 0, 0, h, style, { holes: h === 3 && rng() < 0.4 ? [1] : [] })
    }
    if (rng() < 0.6) this.crate(F, rng, rr(rng, -2, 2), rr(rng, 0.9, 1.4))
  }

  tower(F, rng) {
    // a broken ring of columns round the centre objective, its own mirror image
    const style = pick(['stone', 'sand'], rng)
    const n = 18, R = 3.4
    const heights = []
    for (let i = 0; i < n / 2; i++) heights.push(1 + Math.floor(rng() * 3))
    const doors = new Set([0, Math.floor(n / 4) + (rng() < 0.5 ? 0 : 1)])
    const windows = heights.map((h) => h === 3 && rng() < 0.4)
    for (let i = 0; i < n; i++) {
      const k = i % (n / 2)
      if (doors.has(k)) continue
      const a = (i / n) * Math.PI * 2
      const yaw = Math.atan2(-Math.cos(a), -Math.sin(a))
      this.column(F, rng, Math.cos(a) * R, Math.sin(a) * R, yaw, heights[k], style, {
        holes: windows[k] ? [1] : [], bw: 1.12,
      })
    }
  }

  forest(F, rng) {
    const species = rng() < 0.3 ? 'pine' : rng() < 0.4 ? 'autumn' : 'oak'
    this.floor(F, rng, 3.0, species === 'autumn' ? '#5a5a2a' : '#355a2a')
    const pts = []
    const n = 3 + Math.floor(rng() * 3)
    for (let tries = 0; tries < 60 && pts.length < n; tries++) {
      const a = rng() * Math.PI * 2, d = Math.sqrt(rng()) * 2.2
      const x = Math.cos(a) * d, z = Math.sin(a) * d
      if (pts.some((p) => Math.hypot(p.x - x, p.z - z) < 1.55)) continue
      pts.push({ x, z })
    }
    for (const p of pts) this.tree(F, rng, p.x, p.z, species)
  }

  hedgerow(F, rng) {
    const n = 5 + Math.floor(rng() * 3)
    const bend = rr(rng, -0.12, 0.12)
    const gap = 1 + Math.floor(rng() * (n - 2))
    for (let i = 0; i < n; i++) {
      if (i === gap && rng() < 0.7) continue
      const x = (i - (n - 1) / 2) * 1.12
      const z = bend * x * x
      this.hedge(F, rng, x, z, -Math.atan(2 * bend * x))
    }
  }

  rocks(F, rng) {
    const n = 2 + Math.floor(rng() * 3)
    this.boulder(F, rng, 0, 0, rr(rng, 0.8, 1.15))
    for (let i = 1; i < n; i++) {
      const a = rng() * 6
      this.boulder(F, rng, Math.cos(a) * rr(rng, 0.9, 1.4), Math.sin(a) * rr(rng, 0.9, 1.4), rr(rng, 0.35, 0.7))
    }
  }

  barricade(F, rng) {
    const n = 3 + Math.floor(rng() * 3)
    for (let i = 0; i < n; i++) this.crate(F, rng, (i - (n - 1) / 2) * 0.8 + rr(rng, -0.1, 0.1), rr(rng, -0.3, 0.3))
  }

  mushrooms(F, rng) {
    const n = 3 + Math.floor(rng() * 3)
    const pts = []
    for (let tries = 0; tries < 40 && pts.length < n; tries++) {
      const a = rng() * 6, d = Math.sqrt(rng()) * 1.5
      const x = Math.cos(a) * d, z = Math.sin(a) * d
      if (pts.some((p) => Math.hypot(p.x - x, p.z - z) < 0.9)) continue
      pts.push({ x, z })
      this.mushroom(F, rng, x, z)
    }
  }

  obelisk(F, rng) {
    this.column(F, rng, 0, 0, 0, 3 + Math.floor(rng() * 2), 'sand', { cap: true, bw: 0.8, bt: 0.8 })
    if (rng() < 0.7) this.boulder(F, rng, 1.0, 0.4, 0.4)
  }

  // ── Queries ───────────────────────────────────────────────────────────────

  // Line of sight from a to b. Two obscuring things (trees, hedges...) in a
  // row block it; one gives the target cover. Obscurers hugging the shooter
  // are looked over.
  los(a, b, ignoreR = 1.3) {
    let obscure = 0
    const dx = b.x - a.x, dy = b.y - a.y, dz = b.z - a.z
    const L2 = dx * dx + dz * dz
    for (const c of this.chunks) {
      if (!c.alive || !c.los) continue
      const s = c.shape
      // cheap 2D reject: shape's bounding circle vs the segment
      let t = L2 > 0 ? ((s.x - a.x) * dx + (s.z - a.z) * dz) / L2 : 0
      t = t < 0 ? 0 : t > 1 ? 1 : t
      const px = a.x + dx * t - s.x, pz = a.z + dz * t - s.z
      if (px * px + pz * pz > s.reach * s.reach) continue
      if (!segmentHitsBox(a, dx, dy, dz, s)) continue
      if (c.los === 'block') return { blocked: true, obscure }
      if (Math.hypot(s.x - a.x, s.z - a.z) < ignoreR + s.reach * 0.5) continue
      obscure++
    }
    return { blocked: obscure >= 2, obscure }
  }

  // ── Destruction ───────────────────────────────────────────────────────────

  // A blast centred on (x, z): every breakable chunk within r takes `dmg`
  // (half that out at the rim). Returns the chunks that broke.
  blast(x, z, r, dmg, { acid = false } = {}) {
    const broken = []
    for (const c of [...this.chunks]) {
      if (!c.alive || !c.destructible) continue
      const d = distToBox(x, 0.5, z, c.shape)
      if (d > r) continue
      let amount = d < r * 0.6 ? dmg : Math.ceil(dmg / 2)
      if (acid && c.kind === 'block') amount += 1
      this.hurt(c, amount, { x, z }, broken)
    }
    return broken
  }

  hurt(c, amount, from, broken = []) {
    if (!c.alive || !c.destructible) return broken
    c.hp -= amount
    if (c.hp <= 0) {
      this.destroy(c, from)
      broken.push(c)
    } else {
      // scuffed: darken and shudder
      if (c.mesh.isMesh) {
        if (!c.ownMat) {
          c.mesh.material = c.mesh.material.clone()
          c.ownMat = true
        }
        c.mesh.material.color.multiplyScalar(0.8)
      }
      const p0 = c.mesh.position.clone()
      tween(0.25, (k) => {
        const a = (1 - k) * 0.06
        c.mesh.position.set(p0.x + (Math.random() - 0.5) * a, p0.y, p0.z + (Math.random() - 0.5) * a)
      }).then(() => c.mesh.position.copy(p0))
      this.fx.debris(c.shape.x, c.shape.y, c.shape.z, [c.color || '#888', '#666'], 3, { from, power: 3, size: 0.08 })
    }
    return broken
  }

  destroy(c, from) {
    c.alive = false
    this.dirty = true
    const s = c.shape
    const fx = this.fx
    switch (c.kind) {
      case 'block': {
        this.group.remove(c.mesh)
        fx.debris(s.x, s.y, s.z, [c.color, c.color, '#5a5650'], 12, { from, power: 6 })
        fx.smoke({ x: s.x, y: s.y, z: s.z, size: 0.4, color: '#a09a8a', life: 1.5 })
        this.collapse(c.col)
        this.rubble(c.col, from)
        break
      }
      case 'tree':
        this.topple(c, from)
        break
      case 'hedge':
      case 'mushroom':
        this.group.remove(c.mesh)
        fx.leaves(s.x, s.y, s.z, c.leaves, c.kind === 'hedge' ? 22 : 28, c.kind === 'hedge' ? 0.8 : 1.4)
        if (c.kind === 'mushroom') for (let i = 0; i < 16; i++) fx.mote({ x: s.x, y: s.y * 1.5, z: s.z, vx: (Math.random() - 0.5) * 3, vy: Math.random() * 2, vz: (Math.random() - 0.5) * 3, size: 0.05, color: '#f0e0ff', life: 2.5, drag: 1 })
        break
      case 'crate':
      case 'log':
        this.group.remove(c.mesh)
        fx.debris(s.x, s.y, s.z, WOOD, 14, { from, power: 6, size: 0.12 })
        break
    }
    this.onBreak?.(c)
  }

  // Blocks above a broken one fall into the gap.
  collapse(col) {
    col.blocks = col.blocks.filter((b) => b.alive).sort((a, b) => a.level - b.level)
    let next = 0
    for (const b of col.blocks) {
      if (b.level > next) {
        const drop = (b.level - next) * col.style.by
        b.level = next
        b.shape.y -= drop
        const y0 = b.mesh.position.y, y1 = y0 - drop
        tween(0.18 + drop * 0.15, (k) => (b.mesh.position.y = y0 + (y1 - y0) * k), bounce).then(() => {
          this.fx.debris(b.shape.x, b.shape.y - col.style.by / 2, b.shape.z, ['#8a8478'], 3, { power: 2, size: 0.07 })
        })
      }
      next = b.level + 1
    }
  }

  rubble(col, from) {
    const st = col.style
    let r = col.rubble
    if (!r) {
      const g = new THREE.Group()
      g.position.set(col.x, 0, col.z)
      r = col.rubble = this.add({
        kind: 'rubble', mesh: g, hp: Infinity, pieces: 0,
        shape: { x: col.x, y: 0.2, z: col.z, hx: col.w * 0.7, hy: 0.2, hz: 0.6, yaw: col.yaw },
        navKind: 'diff', los: 'obscure', cover: true,
      })
      this.dirty = true
    }
    const g = r.mesh
    const n = 4 + Math.floor(Math.random() * 3)
    for (let i = 0; i < n; i++) {
      const piece = mesh(BOX, mat(pick(st.colors)))
      const s = 0.18 + Math.random() * 0.22
      piece.scale.set(s * (st.look === 'log' ? 2.4 : 1.2), s * 0.7, s)
      const a = Math.random() * 6, d = Math.random() * 0.6
      // spill a little away from the blast
      const ax = from ? (col.x - from.x) : 0, az = from ? (col.z - from.z) : 0
      const L = Math.hypot(ax, az) || 1
      piece.position.set(Math.cos(a) * d + (ax / L) * 0.25, s * 0.3 + Math.min(0.2, r.pieces * 0.012), Math.sin(a) * d + (az / L) * 0.25)
      piece.rotation.set(Math.random(), Math.random() * 6, Math.random())
      g.add(piece)
    }
    r.pieces += n
  }

  topple(c, from) {
    const s = c.shape
    let dx = s.x - (from?.x ?? s.x - 1), dz = s.z - (from?.z ?? s.z)
    const L = Math.hypot(dx, dz) || 1
    dx /= L
    dz /= L
    // the canopy goes up in a cloud of leaves; the trunk keels over into a log
    const leaves = c.leaves
    for (const blob of c.canopy.children) {
      const w = new THREE.Vector3()
      blob.getWorldPosition(w)
      this.fx.leaves(w.x, w.y, w.z, leaves, 14, 1)
    }
    c.mesh.remove(c.canopy)
    const g = c.mesh
    const axis = new THREE.Vector3(dz, 0, -dx).normalize()
    const q0 = g.quaternion.clone()
    const qa = new THREE.Quaternion()
    tween(0.9, (k) => {
      qa.setFromAxisAngle(axis, (Math.PI / 2 - 0.12) * k)
      g.quaternion.copy(q0).premultiply(qa)
      g.position.y = Math.sin(k * Math.PI) * 0.05 + c.trunkR * k
    }, easeIn).then(() => {
      this.fx.debris(s.x + dx * c.trunkH, 0.2, s.z + dz * c.trunkH, ['#6b4a2e', '#4f8a34'], 8, { power: 3, size: 0.1 })
      this.fx.shake = Math.max(this.fx.shake, 0.05)
    })
    const len = c.trunkH
    const log = this.add({
      kind: 'log', mesh: g, hp: 2,
      shape: { x: s.x + dx * len * 0.5, y: c.trunkR, z: s.z + dz * len * 0.5, hx: len * 0.5, hy: c.trunkR, hz: c.trunkR + 0.05, yaw: Math.atan2(-dz, dx) },
      navKind: 'diff', los: 'obscure', cover: true,
    })
    this.dirty = true
    return log
  }
}

// Segment a→a+d against an oriented box (yaw about +y).
function segmentHitsBox(a, dx, dy, dz, s) {
  const c = Math.cos(s.yaw), sn = Math.sin(s.yaw)
  const ox = a.x - s.x, oy = a.y - s.y, oz = a.z - s.z
  const p = [ox * c - oz * sn, oy, ox * sn + oz * c]
  const d = [dx * c - dz * sn, dy, dx * sn + dz * c]
  const h = [s.hx, s.hy, s.hz]
  let t0 = 0, t1 = 1
  for (let k = 0; k < 3; k++) {
    if (Math.abs(d[k]) < 1e-9) {
      if (Math.abs(p[k]) > h[k]) return false
    } else {
      let ta = (-h[k] - p[k]) / d[k], tb = (h[k] - p[k]) / d[k]
      if (ta > tb) [ta, tb] = [tb, ta]
      if (ta > t0) t0 = ta
      if (tb < t1) t1 = tb
      if (t0 > t1) return false
    }
  }
  return true
}

function distToBox(x, y, z, s) {
  const c = Math.cos(s.yaw), sn = Math.sin(s.yaw)
  const ox = x - s.x, oy = y - s.y, oz = z - s.z
  const lx = ox * c - oz * sn, lz = ox * sn + oz * c
  const qx = Math.max(0, Math.abs(lx) - s.hx), qy = Math.max(0, Math.abs(oy) - s.hy), qz = Math.max(0, Math.abs(lz) - s.hz)
  return Math.hypot(qx, qy, qz)
}
