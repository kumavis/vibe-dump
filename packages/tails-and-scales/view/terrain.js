// ---------------------------------------------------------------------------
// The battlefield's meshes, and how its destruction looks.
//
// TerrainView builds every chunk's mesh from its ChunkDef's `look` plus its
// place (shape.x/z, and shape.y for a wall block or cap) and nothing else,
// and draws nothing from the layout stream: core/terrain/recipes.js has
// already made every draw and recorded the result in `look`. It plays the
// terrain's events (core/terrain/terrain.js), in order, as the match's out
// hands them over (main.js drains G.out into play() right after each terrain
// call): a scuffed chunk darkens and shudders, a broken one shatters, blocks
// above a gap drop into it, a tree sheds its canopy and keels over, rubble
// piles up. That randomness is purely cosmetic and stays on Math.random.
//
// It is built only by playing those events from a table's terrain.clear on:
// a fallen log is its tree's mesh keeled over, and a collapsed block is
// drawn where its tween left it. Building it from the chunks as they stand
// (a rejoin, a scrub, a snap) is a later step's (TerrainView.sync: DESIGN's
// R3 notes and R7 row).
//
// sim/terrain-check.mjs builds these meshes in Node and holds them to the
// ones the battlefield was built with before the split (the R0 code), mesh
// for mesh, and plays destruction on both, draining the terrain's reports
// into play() as main.js does.
// ---------------------------------------------------------------------------
import * as THREE from 'three'
import { pick, tween, easeIn, bounce } from '../util.js'
import { STYLES, WOOD } from '../core/terrain/recipes.js'

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

// ── Meshes from looks ───────────────────────────────────────────────────────
// Each builds exactly the objects the battlefield has always had, in the same
// order (material ids decide draw order). Returns { obj, canopy? }.
const PIECES = {
  // a wall block: a box, or a log in a log wall
  box: (c) => block(c, BOX),
  log: (c) => block(c, LOG),
  cap(c) {
    const { look, shape: s } = c
    const m = mesh(new THREE.ConeGeometry(look.r, look.h, 4).rotateY(Math.PI / 4), mat(look.color))
    m.position.set(s.x, s.y, s.z)
    m.rotation.y = look.yaw
    return { obj: m }
  },
  tree(c) {
    const { look, shape: s } = c
    const { h: trunkH, r: trunkR } = look.trunk
    const g = new THREE.Group()
    g.position.set(s.x, 0, s.z)
    const trunk = mesh(new THREE.CylinderGeometry(trunkR * 0.75, trunkR, trunkH, 7).translate(0, trunkH / 2, 0), mat(look.bark))
    g.add(trunk)
    const canopy = new THREE.Group()
    g.add(canopy)
    for (const p of look.canopy) {
      if (p.cone) {
        const cone = mesh(new THREE.ConeGeometry(p.r, p.h, 8), mat(p.color))
        cone.position.y = p.y
        cone.rotation.y = p.yaw
        canopy.add(cone)
      } else {
        const blob = mesh(new THREE.IcosahedronGeometry(p.r, 1), mat(p.color))
        blob.position.set(...p.pos)
        blob.scale.y = 0.8
        canopy.add(blob)
      }
    }
    g.rotation.y = look.yaw
    return { obj: g, canopy }
  },
  hedge(c) {
    const { look, shape: s } = c
    const g = new THREE.Group()
    g.position.set(s.x, 0, s.z)
    g.rotation.y = look.yaw
    const body = mesh(BOX, mat(look.color))
    body.scale.set(1.15, 0.62, 0.55)
    body.position.y = 0.31
    g.add(body)
    for (const t of look.tufts) {
      const b = mesh(new THREE.IcosahedronGeometry(0.3, 0), mat(t.color))
      b.position.set(...t.pos)
      g.add(b)
    }
    for (const p of look.berries) {
      const b = mesh(new THREE.SphereGeometry(0.05, 5, 4), mat('#c0302a'), { shadow: false })
      b.position.set(...p)
      g.add(b)
    }
    return { obj: g }
  },
  boulder(c) {
    const { look, shape: s } = c
    const m = mesh(new THREE.DodecahedronGeometry(look.size, 0), mat(look.color))
    m.scale.set(...look.scale)
    m.rotation.set(...look.rot)
    m.position.set(s.x, look.y, s.z)
    if (look.moss) {
      const moss = mesh(new THREE.DodecahedronGeometry(look.size * 0.55, 0), mat('#5d7a3a'), { shadow: false })
      moss.position.set(0, look.size * 0.55, 0)
      moss.scale.set(1.1, 0.4, 1.1)
      m.add(moss)
    }
    return { obj: m }
  },
  crate(c) {
    const { look } = c
    const m = new THREE.Group()
    const s = look.s
    const box = mesh(BOX, mat(look.color))
    box.scale.setScalar(s)
    box.position.y = s / 2
    const band = mesh(BOX, mat('#5f3e24'))
    band.scale.set(s * 1.02, s * 0.14, s * 1.02)
    band.position.y = s / 2
    m.add(box, band)
    if (look.stacked) {
      const box2 = mesh(BOX, mat('#9a7048'))
      box2.scale.setScalar(s * 0.7)
      box2.position.set(0, s + s * 0.35, 0)
      box2.rotation.y = 0.5
      m.add(box2)
    }
    return standing(c, m)
  },
  barrel(c) {
    const m = new THREE.Group()
    const b = mesh(new THREE.CylinderGeometry(0.28, 0.24, 0.75, 10), mat(c.look.color))
    b.position.y = 0.375
    const hoop = mesh(new THREE.TorusGeometry(0.29, 0.025, 4, 14).rotateX(Math.PI / 2), mat('#3a3a3a', { metalness: 0.4 }))
    hoop.position.y = 0.55
    m.add(b, hoop)
    return standing(c, m)
  },
  sack(c) {
    const m = new THREE.Group()
    const sack = mesh(new THREE.SphereGeometry(0.34, 9, 7), mat('#c2a77a'))
    sack.scale.set(1, 1.15, 0.9)
    sack.position.y = 0.36
    m.add(sack)
    for (const [x, z] of c.look.acorns) {
      const a = mesh(new THREE.SphereGeometry(0.08, 6, 5), mat('#8a5a2a'))
      a.position.set(x, 0.72, z)
      m.add(a)
    }
    return standing(c, m)
  },
  mushroom(c) {
    const { look, shape: s } = c
    const { h, r, sr } = look
    const g = new THREE.Group()
    g.position.set(s.x, 0, s.z)
    const stem = mesh(new THREE.CylinderGeometry(sr * 0.8, sr * 1.2, h, 8).translate(0, h / 2, 0), mat('#efe6d0'))
    const cap = mesh(new THREE.SphereGeometry(r, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), mat(look.cap))
    cap.position.y = h - 0.05
    cap.scale.y = 0.7
    // the cap is an open dome: close it with gills, or it casts only a
    // crescent of shadow and shows its hollow inside from below
    const gills = mesh(new THREE.CircleGeometry(r, 14).rotateX(Math.PI / 2), mat('#e9dcc0'))
    gills.position.y = h - 0.05
    g.add(stem, cap, gills)
    for (const [a, e] of look.dots) {
      const dot = mesh(new THREE.SphereGeometry(r * 0.12, 5, 4), mat('#fff6e0'), { shadow: false })
      dot.position.set(Math.cos(a) * Math.sin(e) * r, h - 0.05 + Math.cos(e) * r * 0.7, Math.sin(a) * Math.sin(e) * r)
      g.add(dot)
    }
    g.rotation.z = look.tilt
    return { obj: g }
  },
  floor(c) {
    const { look, shape: s } = c
    const geo = new THREE.CircleGeometry(look.r, look.segments)
    const pos = geo.attributes.position
    if (look.rim.length !== pos.count - 1) throw new Error(`a forest floor of ${pos.count} vertices with ${look.rim.length} rim draws`)
    for (let i = 1; i < pos.count; i++) {
      const k = look.rim[i - 1]
      pos.setXY(i, pos.getX(i) * k, pos.getY(i) * k)
    }
    geo.rotateX(-Math.PI / 2)
    const m = mesh(geo, mat(look.color, { flatShading: false }), { shadow: false })
    m.position.set(s.x, 0.012, s.z)
    return { obj: m }
  },
  // a pile at a column's foot; its pieces come with each break (rubble())
  rubble(c) {
    const g = new THREE.Group()
    g.position.set(c.shape.x, 0, c.shape.z)
    return { obj: g, pieces: 0 }
  },
}
function block(c, geo) {
  const { look, shape: s } = c
  const m = mesh(geo, mat(look.color))
  m.scale.set(...look.scale)
  m.position.set(s.x, s.y, s.z)
  m.rotation.y = look.yaw
  return { obj: m }
}
function standing(c, m) {
  m.position.set(c.shape.x, 0, c.shape.z)
  m.rotation.y = c.look.yaw
  return { obj: m }
}

export class TerrainView {
  constructor(scene, fx) {
    this.scene = scene
    this.fx = fx
    this.group = new THREE.Group()
    scene.add(this.group)
    this.items = new Map() // chunk id → { c, obj, canopy?, pieces?, ownMat? }
    this.onBreak = null // (chunk) => {}: main.js's break sound (R7 moves it in here)
  }

  // the object a chunk is drawn with
  object(id) {
    return this.items.get(id)?.obj
  }

  // Play a terrain call's events (core/terrain/terrain.js), in order.
  play(events) {
    for (const e of events) this.apply(e)
  }

  // Play one terrain event.
  apply(e) {
    switch (e.t) {
      case 'terrain.clear': return this.clear()
      case 'terrain.add': return this.add(e.c)
      case 'terrain.hurt': return this.hurt(e.c, e.from, e.at)
      case 'terrain.destroy': return this.destroy(e.c, e.from, e.at)
      case 'terrain.collapse': return this.collapse(e.drops, e.by)
      case 'terrain.rubble': return this.rubble(e.c, e.from)
    }
    throw new Error(`TerrainView: no handler for ${e.t}`)
  }

  clear() {
    this.scene.remove(this.group)
    this.group = new THREE.Group()
    this.scene.add(this.group)
    this.items.clear()
  }

  add(c) {
    if (c.look.piece === 'fallen') return this.fell(c)
    const item = { c, ...PIECES[c.look.piece](c) }
    this.items.set(c.id, item)
    this.group.add(item.obj)
  }

  // scuffed: darken and shudder, the debris at `at`, where it stood when hit
  // (a collapse later in the same blast could have lowered it since, though
  // not with classic's recipes: DESIGN's R4 notes; R5's view reads no live
  // chunk)
  hurt(c, from, at) {
    const v = this.items.get(c.id), m = v.obj
    if (m.isMesh) {
      if (!v.ownMat) {
        m.material = m.material.clone()
        v.ownMat = true
      }
      m.material.color.multiplyScalar(0.8)
    }
    const p0 = m.position.clone()
    tween(0.25, (k) => {
      const a = (1 - k) * 0.06
      m.position.set(p0.x + (Math.random() - 0.5) * a, p0.y, p0.z + (Math.random() - 0.5) * a)
    }).then(() => m.position.copy(p0))
    this.fx.debris(at.x, at.y, at.z, [c.look.chip || '#888', '#666'], 3, { from, power: 3, size: 0.08 })
  }

  destroy(c, from, at) {
    const v = this.items.get(c.id)
    const s = at
    const fx = this.fx
    switch (c.kind) {
      case 'block': {
        this.group.remove(v.obj)
        fx.debris(s.x, s.y, s.z, [c.look.chip, c.look.chip, '#5a5650'], 12, { from, power: 6 })
        fx.smoke({ x: s.x, y: s.y, z: s.z, size: 0.4, color: '#a09a8a', life: 1.5 })
        break
      }
      case 'tree': {
        // the canopy goes up in a cloud of leaves; the trunk keels over into
        // a log (its terrain.add, next)
        for (const blob of v.canopy.children) {
          const w = new THREE.Vector3()
          blob.getWorldPosition(w)
          fx.leaves(w.x, w.y, w.z, c.look.leaves, 14, 1)
        }
        v.obj.remove(v.canopy)
        break
      }
      case 'hedge':
      case 'mushroom':
        this.group.remove(v.obj)
        fx.leaves(s.x, s.y, s.z, c.look.leaves, c.kind === 'hedge' ? 22 : 28, c.kind === 'hedge' ? 0.8 : 1.4)
        if (c.kind === 'mushroom') for (let i = 0; i < 16; i++) fx.mote({ x: s.x, y: s.y * 1.5, z: s.z, vx: (Math.random() - 0.5) * 3, vy: Math.random() * 2, vz: (Math.random() - 0.5) * 3, size: 0.05, color: '#f0e0ff', life: 2.5, drag: 1 })
        break
      case 'crate':
      case 'log':
        this.group.remove(v.obj)
        fx.debris(s.x, s.y, s.z, WOOD, 14, { from, power: 6, size: 0.12 })
        break
    }
    this.onBreak?.(c)
  }

  // blocks above a gap drop into it (the dust reads the block's place when
  // its fall ends, later than the call: R5 gives it a value of its own)
  collapse(drops, by) {
    for (const { c: b, dy } of drops) {
      const m = this.items.get(b.id).obj
      const y0 = m.position.y, y1 = y0 - dy
      tween(0.18 + dy * 0.15, (k) => (m.position.y = y0 + (y1 - y0) * k), bounce).then(() => {
        this.fx.debris(b.shape.x, b.shape.y - by / 2, b.shape.z, ['#8a8478'], 3, { power: 2, size: 0.07 })
      })
    }
  }

  // a few more broken pieces on the pile, spilled a little away from the blast
  rubble(c, from) {
    const v = this.items.get(c.id), g = v.obj
    const st = STYLES[c.look.style]
    const n = 4 + Math.floor(Math.random() * 3)
    for (let i = 0; i < n; i++) {
      const piece = mesh(BOX, mat(pick(st.colors)))
      const s = 0.18 + Math.random() * 0.22
      piece.scale.set(s * (st.look === 'log' ? 2.4 : 1.2), s * 0.7, s)
      const a = Math.random() * 6, d = Math.random() * 0.6
      const ax = from ? (c.shape.x - from.x) : 0, az = from ? (c.shape.z - from.z) : 0
      const L = Math.hypot(ax, az) || 1
      piece.position.set(Math.cos(a) * d + (ax / L) * 0.25, s * 0.3 + Math.min(0.2, v.pieces * 0.012), Math.sin(a) * d + (az / L) * 0.25)
      piece.rotation.set(Math.random(), Math.random() * 6, Math.random())
      g.add(piece)
    }
    v.pieces += n
  }

  // A fallen tree's log: the tree's own group (its canopy gone) keels over
  // along the log's (dx, dz) and is the log from then on.
  fell(c) {
    const tree = this.items.get(c.look.tree)
    const t = tree.c, s = t.shape, trunk = t.look.trunk
    const { dx, dz } = c.look
    const g = tree.obj
    const axis = new THREE.Vector3(dz, 0, -dx).normalize()
    const q0 = g.quaternion.clone()
    const qa = new THREE.Quaternion()
    tween(0.9, (k) => {
      qa.setFromAxisAngle(axis, (Math.PI / 2 - 0.12) * k)
      g.quaternion.copy(q0).premultiply(qa)
      g.position.y = Math.sin(k * Math.PI) * 0.05 + trunk.r * k
    }, easeIn).then(() => {
      this.fx.debris(s.x + dx * trunk.h, 0.2, s.z + dz * trunk.h, ['#6b4a2e', '#4f8a34'], 8, { power: 3, size: 0.1 })
      this.fx.shake = Math.max(this.fx.shake, 0.05)
    })
    this.items.set(c.id, { c, obj: g })
    this.group.add(g)
  }
}
