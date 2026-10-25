// ---------------------------------------------------------------------------
// The battlefield's meshes, and how its destruction looks.
//
// TerrainView builds every chunk's mesh from its ChunkDef's `look` plus its
// place (shape.x/z, and shape.y for a wall block or cap) and nothing else,
// and draws nothing from the layout stream: core/terrain/recipes.js has
// already made every draw and recorded the result in `look`. It plays the
// terrain's events (core/terrain/terrain.js), in order, as the EventPlayer
// (view/player.js) hands them over (apply(e, M), M the mirror with e folded
// in):
// a scuffed chunk darkens and shudders, a broken one shatters, blocks above
// a gap drop into it, a tree sheds its canopy and keels over, rubble piles
// up. That randomness is purely cosmetic and stays on Math.random.
//
// It never reads a live chunk: each chunk's place and look come from its
// terrain.add (the def, a copy taken as it joined), a hurt or broken chunk's
// debris from the event's `at`, and where a dropped block comes to rest
// from the mirror as its collapse is played (present/mirror.js).
//
// It is built either by playing those events from a table's terrain.clear
// on (a fallen log is its tree's mesh keeled over, a collapsed block drawn
// where its tween left it), or (R7) from the chunks as they stand, by
// sync(): a new table, a snap (view/player.js, DESIGN §2.4), a rejoin or a
// scrub later. sync() keeps what already shows a chunk as it stands and
// builds the rest exactly as its events would have left it (a fallen log
// keeled over all the way, a dropped block at its height, a rubble pile's
// pieces strewn anew); a chunk's scuffs (a darker colour) and where the
// rubble's pieces lie are cosmetic, and a fresh build shows none of the
// first and its own of the second. A terrain.clear keeps what stood aside,
// off the table, for the adds that follow: the same seed gives the same
// defs (§2.9), so a battle started on the table the title showed takes the
// same meshes back, untouched ones only, and builds nothing (a spare that
// holds a mesh and is still its add's def: a sync's broken chunk holds none,
// and a block it set lower is the def at that height).
//
// Its break sound is its own since R7 (main.js's onBreak hook before).
// Meshes leave the table freed: their geometry (but the shared box and log
// shapes) and a scuffed chunk's own material, at the next clear, sync or
// dispose().
//
// (F8b) On a board larger than classic's (tiling(), view/index.js's
// setBoard) the standing chunks are drawn by tiles: one mesh per (8" tile,
// material class) whose geometry is its chunks' meshes merged, in world
// space, each vertex in its mesh's colour (DESIGN §4.2.7's "Drawing at
// scale" 1: about 70 tiles at Grand, 150-odd draw calls against about
// 1,000). Each chunk keeps its own mesh, in the group as ever but hidden
// (`visible` false: what sync, state and the checks read is unchanged), and
// the tile draws it. A chunk an event touches (hurt, broken, dropped, a
// tree felled) is promoted out of its tile first, its own mesh shown while
// it animates, its tile merged again without it, and taken back once it
// rests (settle()); a rubble pile, a fallen log and anything shared are
// never tiled. Classic stays untiled: its 500-odd draw calls are within
// budget, and its title and boards stay the R0 code's pixel for pixel
// (sim/title-shot.mjs, sim/terrain-shots.mjs): a merged mesh draws in
// another order and rounds its vertices once more. tileCheck() holds every
// tiled chunk's drawn shape and colour to its own mesh's (terrain-check's
// view half and sim/snap-check.mjs).
//
// sim/terrain-check.mjs builds these meshes in Node and holds them to the
// ones the battlefield was built with before the split (the R0 code), mesh
// for mesh, and plays destruction on both, folding the terrain's reports
// into a mirror and applying them here one by one, as the player does; and
// (R7) holds a table synced from the chunks as they stand to the one the
// events built.
// ---------------------------------------------------------------------------
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { pick, tween, easeIn, bounce } from './clock.js'
import { STYLES, WOOD } from '../core/terrain/recipes.js'
import { sfx } from './sfx.js'

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
    this.effects = fx
    this.group = new THREE.Group()
    scene.add(this.group)
    // chunk id → { c (its def), obj, canopy?, pieces?, ownMat?, touched?,
    // shared? (a fallen tree's: its log's item holds the mesh) }
    this.items = new Map()
    // a cleared table's items, kept aside for the adds that follow (clear())
    this.spares = new Map()
    // (F8b) whether standing chunks are drawn by tiles (tiling()), the tiles
    // by key, the ones to merge again (flush()), and their group (made the
    // first time a board is tiled: classic's table makes no more objects,
    // nor their ids' Math.random draws, than it did)
    this.tiled = false
    this.tiles = new Map()
    this.dirty = new Set()
    this.tileGroup = null
  }

  // the object a chunk is drawn with
  object(id) {
    return this.items.get(id)?.obj
  }

  // Play one terrain event; M is the mirror with it folded in.
  apply(e, M) {
    switch (e.t) {
      case 'terrain.clear': return this.clear()
      case 'terrain.add': return this.add(e.def)
      case 'terrain.hurt': return this.hurt(this.items.get(e.id).c, e.from, e.at)
      case 'terrain.destroy': return this.destroy(this.items.get(e.id).c, e.from, e.at)
      case 'terrain.collapse': return this.collapse(e.drops, e.by, M)
      case 'terrain.rubble': return this.rubble(this.items.get(e.id).c, e.from)
    }
    throw new Error(`TerrainView: no handler for ${e.t}`)
  }

  // A new table: what stood goes off it (a new group), kept aside for the
  // adds that follow (what none of them takes back is freed at the next
  // clear, sync or dispose).
  clear() {
    this.freeSpares()
    this.dropTiles()
    this.scene.remove(this.group)
    this.group = new THREE.Group()
    this.scene.add(this.group)
    this.spares = this.items
    this.items = new Map()
  }

  add(c) {
    // (the cleared table's mesh of this very chunk, untouched: taken back;
    // a broken chunk's item from a sync holds no mesh, and is built)
    const spare = this.spares.get(c.id)
    if (spare?.obj && !spare.touched && !spare.shared && sameDef(spare.c, c, true)) {
      this.spares.delete(c.id)
      // (shown: clear() took every item out of its tile first)
      const item = { ...spare, c, tile: null }
      this.items.set(c.id, item)
      this.group.add(spare.obj)
      this.tile(item)
      return
    }
    if (c.look.piece === 'fallen') return this.fell(c)
    const item = { c, ...PIECES[c.look.piece](c) }
    this.items.set(c.id, item)
    this.group.add(item.obj)
    this.tile(item)
  }

  // everything off the table and freed (a new table drawn from scratch, in a
  // new group, as a terrain.clear's)
  dispose() {
    this.freeSpares()
    this.dropTiles()
    for (const item of this.items.values()) this.free(item)
    this.items.clear()
    this.scene.remove(this.group)
    this.group = new THREE.Group()
    this.scene.add(this.group)
  }

  // ── From the chunks as they stand ─────────────────────────────────────────
  // Show `chunks` (G.terrain.chunks) as they stand now. An item that shows
  // its chunk as it stands is kept (a block that dropped since is set at its
  // height); the rest are taken off and built as the chunk's events would
  // have left them, in chunk order (so a fresh table is built mesh for mesh
  // as its adds build it).
  sync(chunks) {
    this.freeSpares()
    const byId = new Map(chunks.map((c) => [c.id, c]))
    for (const [id, item] of [...this.items]) {
      const c = byId.get(id)
      if (c && sameDef(item.c, c, false) && (c.alive ? this.shows(item) : !this.shows(item))) continue
      this.free(item)
      this.items.delete(id)
    }
    for (const c of chunks) {
      const kept = this.items.get(c.id)
      if (kept) {
        // (at its height now: a fall still under way stops, and the item
        // is the def at that height, so a later add of the block where it
        // first stood doesn't take this mesh back down here)
        if (c.alive && SET_Y.has(c.look.piece)) {
          kept.fall = null
          kept.anims = 0
          if (kept.obj.position.y !== c.shape.y) this.untile(kept)
          kept.obj.position.y = c.shape.y
          kept.c = defOf(c)
        }
        // ((F8b) a chunk promoted out of its tile by an event whose
        // playback the snap cut short: back in it)
        this.tile(kept)
        continue
      }
      if (!c.alive) {
        // (a broken chunk shows nothing: a fallen tree is its log's)
        if (!this.items.has(c.id)) this.items.set(c.id, { c: defOf(c), obj: null })
        continue
      }
      if (c.look.piece === 'fallen') {
        this.fallen(defOf(c), byId.get(c.look.tree))
        continue
      }
      const def = defOf(c)
      const item = { c: def, ...PIECES[c.look.piece](def) }
      this.items.set(c.id, item)
      this.group.add(item.obj)
      this.tile(item)
      // a rubble pile: a heap of pieces for each block of its column broken
      if (c.kind === 'rubble') for (const b of chunks) if (b.kind === 'block' && !b.alive && b.col?.rubble === c) this.rubble(def, null)
    }
    this.flush()
  }

  // whether an item shows its chunk standing (a tree with its canopy)
  shows(item) {
    if (!item.obj || item.obj.parent !== this.group) return false
    return item.c.kind === 'tree' ? item.canopy?.parent === item.obj : true
  }

  // A chunk's mesh as the table shows it, for sim/ (the ?debug snap check):
  // whether it shows the chunk standing, and where its object stands.
  state(id) {
    const item = this.items.get(id)
    const shown = !!item && this.shows(item)
    if (!shown) return { shown }
    const o = item.obj
    return { shown, x: o.position.x, y: o.position.y, z: o.position.z, q: o.quaternion.toArray() }
  }

  // ── Tiles (F8b) ───────────────────────────────────────────────────────────
  // Whether standing chunks are drawn by tiles from now on (view/index.js's
  // setBoard: a board larger than classic's). Turned off, every chunk shows
  // its own mesh again and the tiles are freed.
  tiling(on) {
    if (this.tiled === on) return
    this.tiled = on
    if (!on) {
      for (const item of this.items.values()) this.untile(item)
      this.dropTiles()
      return
    }
    for (const item of this.items.values()) this.tile(item)
    this.flush()
  }

  // Whether an item may be drawn by its tile: tiling on, its mesh standing
  // on the table, not shared (a fallen tree's), not a rubble pile (its
  // pieces come with each break) and not animating.
  tileable(item) {
    return this.tiled && !!item.obj && item.obj.parent === this.group && !item.shared && item.c.kind !== 'rubble' && item.c.look.piece !== 'fallen' && !(item.anims > 0) && this.shows(item)
  }

  // An item into its tile (the 8" square its chunk stands in): its own mesh
  // hidden, the tile merged again before the next frame (flush(), from a
  // microtask: a table's adds come in a run).
  tile(item) {
    if (item.tile || !this.tileable(item)) return
    const { x, z } = item.c.shape
    const at = `${Math.floor(x / TILE)},${Math.floor(z / TILE)}`
    let t = this.tiles.get(at)
    if (!t) this.tiles.set(at, (t = { at, ids: new Set(), meshes: [], parts: new Map() }))
    t.ids.add(item.c.id)
    item.tile = t
    item.obj.visible = false
    this.mark(t)
  }

  // An item out of its tile, its own mesh shown (at once: the tile is
  // merged again without it straight away, so it never shows twice or
  // not at all).
  untile(item) {
    const t = item.tile
    if (!t) return
    t.ids.delete(item.c.id)
    item.tile = null
    if (item.obj) item.obj.visible = true
    this.mark(t)
  }

  // An item an event animates: out of its tile until settle() says it
  // rests (a count, as a block may be hurt while it falls).
  promote(item) {
    if (!item) return
    item.anims = (item.anims ?? 0) + 1
    if (item.tile) {
      this.untile(item)
      this.flush()
    }
  }
  // its animation over: back in its tile once none is left (and while it
  // is still the item of chunk `id`, standing)
  settle(id, item) {
    if (item.anims > 0) item.anims--
    if (this.items.get(id) === item) this.tile(item)
  }

  mark(t) {
    if (!this.dirty.size && !this.pending) {
      this.pending = true
      queueMicrotask(() => {
        this.pending = false
        this.flush()
      })
    }
    this.dirty.add(t)
  }

  // Merge every tile marked again: per (material class, casts a shadow),
  // its chunks' meshes in world space (the group stands at the origin),
  // each vertex in its mesh's colour (the class's material is white and
  // takes vertex colours, as a baked figure's: view/models/bake.js). A
  // tile left with no chunk goes.
  flush() {
    if (!this.dirty.size) return
    if (!this.tileGroup) {
      this.tileGroup = new THREE.Group()
      this.scene.add(this.tileGroup)
    }
    for (const t of this.dirty) {
      for (const m of t.meshes) {
        this.tileGroup.remove(m)
        m.geometry.dispose()
      }
      t.meshes = []
      t.parts = new Map()
      if (!t.ids.size) {
        if (this.tiles.get(t.at) === t) this.tiles.delete(t.at)
        continue
      }
      const classes = new Map()
      for (const id of [...t.ids].sort((a, b) => a - b)) {
        const item = this.items.get(id)
        item.obj.updateMatrixWorld(true)
        item.obj.traverse((o) => {
          if (!o.isMesh || !visibleIn(o, item.obj)) return
          const key = `${tileClass(o.material)}|${o.castShadow ? 1 : 0}`
          if (!classes.has(key)) classes.set(key, { material: o.material, cast: o.castShadow, geos: [], spans: [], n: 0 })
          const k = classes.get(key), geo = worldShape(o), last = k.spans[k.spans.length - 1]
          // (a chunk's meshes of one class, merged one after another: one span)
          if (last?.[0] === id) last[2] += geo.attributes.position.count
          else k.spans.push([id, k.n, geo.attributes.position.count])
          k.n += geo.attributes.position.count
          k.geos.push(geo)
        })
      }
      for (const [key, k] of classes) {
        const m = new THREE.Mesh(mergeGeometries(k.geos), tileMat(key, k.material))
        for (const g of k.geos) g.dispose()
        m.castShadow = k.cast
        m.receiveShadow = true
        m.matrixAutoUpdate = false
        m.userData.tile = t.at
        this.tileGroup.add(m)
        t.meshes.push(m)
        for (const [id, start, count] of k.spans) {
          if (!t.parts.has(id)) t.parts.set(id, [])
          t.parts.get(id).push({ mesh: m, start, count })
        }
      }
    }
    this.dirty.clear()
  }

  // every tile freed (a new table, or tiling turned off); the items keep
  // their own meshes, shown again by untile() or the next tile()
  dropTiles() {
    for (const t of this.tiles.values()) for (const m of t.meshes) {
      this.tileGroup.remove(m)
      m.geometry.dispose()
    }
    for (const item of this.items.values()) if (item.tile) {
      item.tile = null
      if (item.obj) item.obj.visible = true
    }
    this.tiles.clear()
    this.dirty.clear()
  }

  // (F8b, for sim/: terrain-check's view half and snap-check) How the tiles
  // stand: their count, their meshes (draw calls), the chunks they draw,
  // and every tiled chunk whose drawn shape or colour differs from its own
  // mesh's (each vertex in world space, to 1e-4", and its colour, to
  // 1e-6), or that its tile draws though it no longer stands as tiled
  // (its own mesh moved, shown, or off the table).
  tileCheck() {
    this.flush()
    const bad = []
    let tiled = 0, meshes = 0
    for (const t of this.tiles.values()) {
      meshes += t.meshes.length
      for (const id of t.ids) {
        tiled++
        const item = this.items.get(id)
        if (!item || item.tile !== t || item.obj?.visible !== false || item.obj.parent !== this.group) {
          bad.push(`chunk ${id}: drawn by tile ${t.at} but not as tiled (${!item ? 'no item' : item.obj?.visible ? 'its own mesh shown too' : 'off the table'})`)
          continue
        }
        // its own mesh's shape, read here vertex by vertex (not by the
        // merge's own worldShape: a slip there shows), by class
        const want = new Map()
        item.obj.updateMatrixWorld(true)
        item.obj.traverse((o) => {
          if (!o.isMesh || !visibleIn(o, item.obj)) return
          const key = tileClass(o.material) + (o.castShadow ? '|1' : '|0')
          if (!want.has(key)) want.set(key, [])
          const pos = o.geometry.attributes.position, idx = o.geometry.index, n = idx ? idx.count : pos.count
          const flip = o.matrixWorld.determinant() < 0, c = o.material.color, v = new THREE.Vector3()
          for (let i = 0; i < n; i++) {
            const corner = flip && i % 3 ? i + (i % 3 === 1 ? 1 : -1) : i
            v.fromBufferAttribute(pos, idx ? idx.getX(corner) : corner).applyMatrix4(o.matrixWorld)
            want.get(key).push(v.x, v.y, v.z, c.r, c.g, c.b)
          }
        })
        const parts = t.parts.get(id) ?? []
        const got = new Map()
        for (const p of parts) got.set(p.mesh.material.userData.tileKey, p)
        for (const [key, ref] of want) {
          const p = got.get(key), n = ref.length / 6
          if (!p || p.count !== n) {
            bad.push(`chunk ${id}: its tile ${t.at} draws ${p ? p.count : 0} vertices of class ${key}, its own mesh ${n}`)
            continue
          }
          const pos = p.mesh.geometry.attributes.position, col = p.mesh.geometry.attributes.color
          let worst = 0, cworst = 0
          for (let j = 0; j < n; j++) {
            const i = p.start + j, r = j * 6
            worst = Math.max(worst, Math.abs(ref[r] - pos.getX(i)), Math.abs(ref[r + 1] - pos.getY(i)), Math.abs(ref[r + 2] - pos.getZ(i)))
            cworst = Math.max(cworst, Math.abs(ref[r + 3] - col.getX(i)), Math.abs(ref[r + 4] - col.getY(i)), Math.abs(ref[r + 5] - col.getZ(i)))
          }
          if (worst > 1e-4) bad.push(`chunk ${id}: its tile ${t.at} draws it up to ${worst.toFixed(4)}" from its own mesh (class ${key})`)
          if (cworst > 1e-6) bad.push(`chunk ${id}: its tile ${t.at} draws it in another colour (class ${key}, off by ${cworst.toExponential(2)})`)
        }
        for (const key of got.keys()) if (!want.has(key)) bad.push(`chunk ${id}: its tile ${t.at} draws a class (${key}) its own mesh has none of`)
      }
      // a chunk the tile's meshes still draw that has left it
      for (const id of t.parts.keys()) if (!t.ids.has(id)) bad.push(`chunk ${id}: drawn by tile ${t.at}, which it has left`)
    }
    // a standing chunk that could be tiled and isn't, or is hidden untiled
    for (const [id, item] of this.items) {
      if (!item.obj || item.obj.parent !== this.group || item.shared) continue
      if (!item.tile && !item.obj.visible) bad.push(`chunk ${id}: neither in a tile nor shown`)
      if (this.tiled && !item.tile && this.tileable(item)) bad.push(`chunk ${id}: standing at rest but not in a tile`)
    }
    return { tiles: this.tiles.size, meshes, tiled, bad }
  }

  // ── Freeing ───────────────────────────────────────────────────────────────
  // An item off the table, and what only it used freed: its geometry (but
  // the shared box and log shapes) and a scuffed chunk's own material. (A
  // fallen tree's item shares its mesh with its log's, which frees it.)
  free(item) {
    this.untile(item)
    // (a felled tree's canopy, gone up in leaves, is no longer in its mesh)
    if (item.canopy && item.canopy.parent !== item.obj) freeShapes(item.canopy)
    item.canopy = null
    if (!item.obj || item.shared) return
    if (item.obj.parent) item.obj.parent.remove(item.obj)
    freeShapes(item.obj)
    if (item.ownMat) item.obj.material.dispose()
    item.obj = null
  }
  freeSpares() {
    for (const item of this.spares.values()) this.free(item)
    this.spares.clear()
  }

  // ── Destruction ───────────────────────────────────────────────────────────
  // scuffed: darken and shudder, the debris at `at`, where it stood when hit.
  // The shudder is sideways only, and gives back only the place it shook
  // (R7): a block hurt as it drops, by the same blast that broke the one
  // under it, falls on to its rest. It used to hold the block at the height
  // it was hit at, and leave it there when it ended, over a fall that had
  // ended first (a short drop, or ?fast): a block floating a level up.
  hurt(c, from, at) {
    const v = this.items.get(c.id), m = v.obj
    v.touched = true
    this.promote(v)
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
      m.position.x = p0.x + (Math.random() - 0.5) * a
      m.position.z = p0.z + (Math.random() - 0.5) * a
    }).then(() => {
      m.position.x = p0.x
      m.position.z = p0.z
    })
      // ((F8b) at rest: back in its tile)
      .then(() => this.settle(c.id, v))
    this.effects.debris(at.x, at.y, at.z, [c.look.chip || '#888', '#666'], 3, { from, power: 3, size: 0.08 })
  }

  destroy(c, from, at) {
    const v = this.items.get(c.id)
    v.touched = true
    this.promote(v)
    const s = at
    const fx = this.effects
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
    // the break's sound: stone crumbles, the rest thwacks
    if (c.kind === 'block') sfx.crumble()
    else sfx.thwack()
  }

  // Blocks above a gap drop into it, each from where it is drawn to where
  // this drop leaves it: the mirror's height as the collapse is played
  // (R7: a block dropped again before its last fall ended falls on from
  // where it was, to its new rest, and the fall it was in stops there; it
  // used to fall by the drop from where the earlier fall had started, and
  // so came to rest a level or more too high). Its dust, when its fall
  // ends, is where this drop leaves it (a later collapse in the same blast
  // may lower it again, and that one raises its own dust).
  collapse(drops, by, M) {
    for (const { id, dy } of drops) {
      const item = this.items.get(id)
      const { c: b, obj: m } = item
      item.touched = true
      this.promote(item)
      const rest = M.chunks[id].y
      const y0 = m.position.y, y1 = rest
      const fall = (item.fall = {})
      tween(0.18 + dy * 0.15, (k) => item.fall === fall && (m.position.y = y0 + (y1 - y0) * k), bounce).then(() => {
        this.effects.debris(b.shape.x, rest - by / 2, b.shape.z, ['#8a8478'], 3, { power: 2, size: 0.07 })
        // (at rest: back in a tile, unless it fell again since)
        this.settle(id, item)
      })
    }
  }

  // a few more broken pieces on the pile, spilled a little away from the blast
  rubble(c, from) {
    const v = this.items.get(c.id), g = v.obj
    v.touched = true
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
    this.promote(tree)
    const t = tree.c, s = t.shape, trunk = t.look.trunk
    const { dx, dz } = c.look
    const g = tree.obj
    const q0 = g.quaternion.clone()
    const keel = topple(g, q0, c.look, trunk)
    tween(0.9, keel, easeIn).then(() => {
      this.effects.debris(s.x + dx * trunk.h, 0.2, s.z + dz * trunk.h, ['#6b4a2e', '#4f8a34'], 8, { power: 3, size: 0.1 })
      this.effects.shake = Math.max(this.effects.shake, 0.05)
    })
    tree.shared = true
    this.items.set(c.id, { c, obj: g, touched: true })
    this.group.add(g)
  }

  // A fallen log built from the chunks as they stand: its tree's mesh, the
  // canopy gone, keeled over all the way (the fall's last frame).
  fallen(c, treeChunk) {
    const t = defOf(treeChunk)
    const { obj: g, canopy } = PIECES.tree(t)
    g.remove(canopy)
    topple(g, g.quaternion.clone(), c.look, t.look.trunk)(1)
    this.items.set(t.id, { c: t, obj: g, canopy, shared: true })
    this.items.set(c.id, { c, obj: g, touched: true })
    this.group.add(g)
  }
}

// (F8b) The tiles: 8" squares (DESIGN §4.2.7), and one white material per
// class of mesh material (all but the colour: a tile's vertices carry
// their meshes' colours), shared by every tile, made the first time a
// board is tiled and kept (two or three of them: their programs never
// linked again).
const TILE = 8
const tileMats = new Map()
const tileClass = (m) => [m.flatShading ? 1 : 0, m.metalness, m.roughness].join(',')
function tileMat(key, m) {
  if (!tileMats.has(key)) {
    const mat = new THREE.MeshStandardMaterial({ color: '#ffffff', vertexColors: true, roughness: m.roughness, metalness: m.metalness, flatShading: m.flatShading })
    mat.userData.tileKey = key
    tileMats.set(key, mat)
  }
  return tileMats.get(key)
}
// whether a mesh shows, as far as its own object goes (a part hidden in
// its chunk's object is no part of its tile: the object's own `visible`,
// false while tiled, is not asked)
function visibleIn(o, root) {
  for (let p = o; p && p !== root; p = p.parent) if (!p.visible) return false
  return true
}
// A mesh's geometry in world space, unindexed, with its normals (the
// floor's are smooth) and each vertex in the mesh's colour; its winding
// turned back where its transform mirrors it (as view/models/bake.js's).
const tmpM = new THREE.Matrix4()
function worldShape(o) {
  const src = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', src.getAttribute('position').clone())
  geo.setAttribute('normal', src.getAttribute('normal').clone())
  if (src !== o.geometry) src.dispose()
  geo.applyMatrix4(tmpM.copy(o.matrixWorld))
  if (tmpM.determinant() < 0) flipWinding(geo)
  const n = geo.attributes.position.count, c = o.material.color
  const col = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) (col[i * 3] = c.r), (col[i * 3 + 1] = c.g), (col[i * 3 + 2] = c.b)
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
  return geo
}
function flipWinding(geo) {
  for (const name of ['position', 'normal']) {
    const a = geo.getAttribute(name)
    for (let i = 0; i < a.count; i += 3) {
      const x = a.getX(i + 1), y = a.getY(i + 1), z = a.getZ(i + 1)
      a.setXYZ(i + 1, a.getX(i + 2), a.getY(i + 2), a.getZ(i + 2))
      a.setXYZ(i + 2, x, y, z)
    }
  }
}

// every geometry of an object and its children freed, but the shared box
// and log shapes
function freeShapes(obj) {
  obj.traverse((o) => {
    if (o.geometry && o.geometry !== BOX && o.geometry !== LOG) o.geometry.dispose()
  })
}

// the pieces whose mesh stands at the chunk's height (a wall's blocks and
// caps, which drop when a block under them breaks)
const SET_Y = new Set(['box', 'log', 'cap'])

// a chunk as its terrain.add carries it: a copy of core/terrain/terrain.js's
// defOf, which core doesn't export (R7 left core/ as it was), and which sync
// builds and keys the table by. The two must stay in step (a field core's
// adds carry and this lacks would leave a synced table short of it, and its
// spares never taken back): sim/terrain-check.mjs holds every add's def to
// this one.
export const defOf = (c) => ({ id: c.id, kind: c.kind, shape: { ...c.shape }, look: c.look })

// whether two defs are the same chunk drawn the same (the height too, or
// not: a dropped block is the same block, lower)
function sameDef(a, b, withY) {
  const key = (d) => JSON.stringify({ id: d.id, kind: d.kind, look: d.look, shape: withY ? d.shape : { ...d.shape, y: 0 } })
  return key(a) === key(b)
}

// The fall of a tree's group along the log's (dx, dz), as a tween step:
// k from 0 (standing) to 1 (lying as the log).
function topple(g, q0, { dx, dz }, trunk) {
  const axis = new THREE.Vector3(dz, 0, -dx).normalize()
  const qa = new THREE.Quaternion()
  return (k) => {
    qa.setFromAxisAngle(axis, (Math.PI / 2 - 0.12) * k)
    g.quaternion.copy(q0).premultiply(qa)
    g.position.y = Math.sin(k * Math.PI) * 0.05 + trunk.r * k
  }
}
