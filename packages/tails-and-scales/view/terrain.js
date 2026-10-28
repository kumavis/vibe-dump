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
// (F16) Under the courtesy fog (present/fog.js) the table draws the scenery
// as the seat played here last saw it: the events of a chunk it can't see
// play nothing (app/flow.js leaves them out; a collapse's drops it can't
// see named in `unseen`), so a wall a template brought down out of sight
// stands on, until reveal() brings each chunk seen again up to date (a
// broken one taken off, no debris; a dropped one set at its height; one
// never seen before built, as sync builds it); a snap draws the chunks as
// last seen through sync (present/fog.js's fogChunks).
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
    // ((V3d) a chimney's crown: a corbelled course and two pots, sooted)
    if (look.chimney) {
      const g = new THREE.Group()
      g.add(merged([boxAt(look.r * 1.5, look.h * 0.35, look.r * 1.5, 0, -look.h * 0.32, 0), boxAt(look.r * 1.25, look.h * 0.3, look.r * 1.25, 0, 0, 0)], look.color))
      g.add(merged([-1, 1].map((k) => new THREE.CylinderGeometry(look.r * 0.22, look.r * 0.26, look.h * 0.45, 7).translate(k * look.r * 0.32, look.h * 0.35, 0)), '#3a3430'))
      g.position.set(s.x, s.y, s.z)
      g.rotation.y = look.yaw
      return { obj: g }
    }
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
  // (F19a) A powder keg: a barrel an inch across and 1.2" tall, its staves
  // bellied (a lathe's profile), two iron hoops, a red danger band round its
  // waist, a lid and a stub of fuse with a glowing tip. One look; the
  // terrain's chunk is a box of the same size (core/terrain/recipes.js).
  keg(c) {
    const m = new THREE.Group()
    const prof = [[0.4, 0], [0.46, 0.22], [0.5, 0.6], [0.46, 0.98], [0.4, 1.2]].map(([r, y]) => new THREE.Vector2(r, y))
    const body = mesh(new THREE.LatheGeometry(prof, 14), mat(c.look.color))
    const lid = mesh(new THREE.CircleGeometry(0.4, 14).rotateX(-Math.PI / 2), mat('#5f3e24'))
    lid.position.y = 1.19
    const iron = mat('#2f2f2f', { metalness: 0.5 })
    const hoops = [0.14, 1.06].map((y) => {
      const h = mesh(new THREE.TorusGeometry(0.44, 0.035, 4, 16).rotateX(Math.PI / 2), iron)
      h.position.y = y
      return h
    })
    const band = mesh(new THREE.CylinderGeometry(0.507, 0.507, 0.22, 16, 1, true), mat('#c0392b', { side: THREE.DoubleSide }))
    band.position.y = 0.6
    const fuse = mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.3, 5), mat('#3a2a1a'))
    fuse.position.set(0.12, 1.33, 0.05)
    fuse.rotation.z = -0.35
    const tip = mesh(new THREE.SphereGeometry(0.05, 6, 4), mat('#ffb347', { emissive: '#ff7a1a', emissiveIntensity: 0.8 }), { shadow: false })
    tip.position.set(0.17, 1.47, 0.05)
    m.add(body, lid, ...hoops, band, fuse, tip)
    // ((V3d) the Powder Field's kegs (look.spill): their bands striped black
    // and yellow, a bomb's warning, and its fuse lit (glowing: its sparks
    // are the plumes', ventsOf))
    if (c.look.spill) {
      const stripes = []
      for (let i = 0; i < 8; i++) stripes.push(new THREE.BoxGeometry(0.16, 0.24, 0.05).rotateZ(0.5).translate(0, 0, 0.51).rotateY((i / 8) * Math.PI * 2).translate(0, 0.6, 0))
      m.add(merged(stripes, '#1d1b19'), merged([new THREE.CylinderGeometry(0.512, 0.512, 0.05, 16, 1, true).translate(0, 0.74, 0), new THREE.CylinderGeometry(0.512, 0.512, 0.05, 16, 1, true).translate(0, 0.46, 0)], '#e8b923'))
      m.add(mesh(new THREE.IcosahedronGeometry(0.07, 0).translate(0.17, 1.48, 0.05), glowMat('#ffd27a'), { shadow: false }))
    }
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
// ── The Powder Field (V3d, DESIGN §4.2.11) ──────────────────────────────────
// The wreckage of a day's fighting in the same chunky painted plastic as the
// rest of the table: charred timber near black, scorched timber brown,
// sooty stone, and what still burns glowing. Each piece is built from its
// look alone (core/terrain/recipes.js's recorded draws) and nothing here
// draws from Math.random: what jitter a piece has comes from a hash of its
// place (`hash`), so a snap builds what the events built. What glows (coals,
// a lit fuse, spilled venom) is unlit (glowMat): a tile keeps it unlit too
// (tileClass's `basic`). The fires' smoke and flames are not meshes: the
// table registers each burning piece's vents with the effects (ventOn,
// view/effects/plumes.js), and paints the turf burned round the pieces that
// scorch it (scorched, view/table.js's scorch).

// one unlit material per colour (embers, fuses, venom): glowing in any light
const glowMats = new Map()
function glowMat(color) {
  if (!glowMats.has(color)) glowMats.set(color, new THREE.MeshBasicMaterial({ color, toneMapped: false }))
  return glowMats.get(color)
}
// a small stream of numbers in [0, 1) from a piece's place: its jitter
// (cosmetic, but the same on every build of the board)
function hash(c, salt = 0) {
  let h = (Math.imul(Math.round(c.shape.x * 1000), 73856093) ^ Math.imul(Math.round(c.shape.z * 1000), 19349663) ^ Math.imul(salt + 1, 83492791)) >>> 0
  return () => {
    h = (h + 0x6d2b79f5) >>> 0
    let t = h
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const COALS = ['#ff7a1a', '#ffb347', '#ff3d0a', '#ffd27a']
// a heap of glowing coals at (x, y, z), `spread` across, in group g's frame
function coals(g, x, y, z, spread, rnd, n = 5) {
  const parts = new Map()
  for (let i = 0; i < n; i++) {
    const a = rnd() * 6.28, d = rnd() * spread, s = 0.05 + rnd() * 0.07
    const col = COALS[i % COALS.length]
    if (!parts.has(col)) parts.set(col, [])
    parts.get(col).push(new THREE.IcosahedronGeometry(s, 0).translate(x + Math.cos(a) * d, y + s * 0.5, z + Math.sin(a) * d))
  }
  for (const [col, geos] of parts) g.add(mesh(mergeGeometries(geos), glowMat(col), { shadow: false }))
}
// a wheel of radius r, t thick, its axle along z, at (x, y, z) in a frame:
// a rim, a hub and four spokes, merged
function wheelParts(r, t, x, y, z, rz = 0) {
  const rim = new THREE.TorusGeometry(r, t * 0.45, 4, 12)
  const hub = new THREE.CylinderGeometry(r * 0.2, r * 0.2, t * 1.4, 6).rotateX(Math.PI / 2)
  const spokes = [0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4].map((a) => new THREE.BoxGeometry(r * 2, t * 0.5, t * 0.6).rotateZ(a))
  return [rim, hub, ...spokes].map((g) => g.rotateZ(rz).translate(x, y, z))
}

const WRECK_PIECES = {
  // A shell hole: a ring of churned earth round a scorched dish, its crest
  // wobbling with the rim's draws, a few clods thrown up on it.
  crater(c) {
    const { look, shape: s } = c
    const { r, rim } = look
    const g = new THREE.Group()
    g.position.set(s.x, 0, s.z)
    g.rotation.y = look.yaw
    const n = rim.length * 2
    const pos = [], idx = []
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2, j = i >> 1
      const w = i % 2 ? (rim[j] + rim[(j + 1) % rim.length]) / 2 : rim[j]
      const ca = Math.cos(a), sa = Math.sin(a)
      pos.push(ca * r * 0.52, 0.03, sa * r * 0.52, ca * r * 0.82 * w, 0.17 + 0.1 * (w - 0.82), sa * r * 0.82 * w, ca * r * 1.14 * w, 0.006, sa * r * 1.14 * w)
    }
    for (let i = 0; i < n; i++) {
      const a = i * 3, b = ((i + 1) % n) * 3
      idx.push(a, b, a + 1, a + 1, b, b + 1, a + 1, b + 1, a + 2, a + 2, b + 1, b + 2)
    }
    const ring = new THREE.BufferGeometry()
    ring.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    ring.setIndex(idx)
    ring.computeVertexNormals()
    g.add(mesh(ring, mat('#5d4a35'), { shadow: false }))
    g.add(mesh(new THREE.CircleGeometry(r * 0.56, 14).rotateX(-Math.PI / 2).translate(0, 0.025, 0), mat('#2a221c'), { shadow: false }))
    const rnd = hash(c), clods = []
    for (let i = 0; i < 5; i++) {
      const a = rnd() * 6.28, d = r * (0.75 + rnd() * 0.5), sz = 0.12 + rnd() * 0.12
      clods.push(boxAt(sz, sz * 0.7, sz * 0.9, Math.cos(a) * d, 0.12 + sz * 0.3, Math.sin(a) * d, rnd() * 3))
    }
    g.add(merged(clods, '#4a3a2a'))
    if (look.burn) coals(g, 0, 0.03, 0, r * 0.2, rnd, 3)
    return { obj: g }
  },
  // A burned stump: a charred trunk with a splintered top and three roots.
  stump(c) {
    const { look } = c
    const g = new THREE.Group()
    const parts = [new THREE.CylinderGeometry(look.r * 0.82, look.r * 1.08, look.h, 7).translate(0, look.h / 2, 0), new THREE.ConeGeometry(look.r * 0.8, 0.22, 7).translate(0, look.h + 0.09, 0)]
    for (const a of [0.4, 2.5, 4.6]) parts.push(beam([Math.cos(a) * look.r * 0.6, 0.1, Math.sin(a) * look.r * 0.6], [Math.cos(a) * look.r * 1.9, 0.02, Math.sin(a) * look.r * 1.9], 0.1, 0.07))
    g.add(merged(parts, look.color))
    if (look.burn) coals(g, 0, look.h + 0.02, 0, look.r * 0.5, hash(c), 4)
    return standing(c, g)
  },
  // A dead tree: a charred trunk, leaning, its top snapped, and its broken
  // limbs (its `canopy`: they go up in ash when it is felled, and it keels
  // over as a tree does: TerrainView.fell).
  snag(c) {
    const { look, shape: s } = c
    const { h, r } = look.trunk
    const g = new THREE.Group()
    g.position.set(s.x, 0, s.z)
    const trunk = merged([new THREE.CylinderGeometry(r * 0.5, r, h, 7).translate(0, h / 2, 0), new THREE.ConeGeometry(r * 0.5, 0.35, 5).translate(0.04, h + 0.15, 0)], look.bark)
    trunk.rotation.z = look.lean
    g.add(trunk)
    const canopy = new THREE.Group()
    canopy.rotation.z = look.lean
    const limbs = look.limbs.map((l) => {
      const out = l.len * Math.sin(l.tilt)
      return beam([0, l.y, 0], [Math.cos(l.a) * out, l.y + l.len * Math.cos(l.tilt), Math.sin(l.a) * out], l.r * 2, l.r * 2)
    })
    canopy.add(merged(limbs, shade(look.bark, 1.1)))
    g.add(canopy)
    g.rotation.y = look.yaw
    return { obj: g, canopy }
  },
  // A burned trunk lying where it fell: its bark charred, its ends
  // splintered, a few broken branches.
  deadlog(c) {
    const { look } = c
    const g = new THREE.Group()
    const { len, r } = look
    const parts = [new THREE.CylinderGeometry(r, r * 1.06, len, 8).rotateZ(Math.PI / 2).translate(0, r, 0)]
    for (const sx of [-1, 1]) parts.push(new THREE.ConeGeometry(r * 0.9, 0.3, 6).rotateZ((-sx * Math.PI) / 2).translate(sx * (len / 2 + 0.12), r, 0))
    for (const [at, a, l] of look.stubs) parts.push(beam([at, r + Math.sin(a) * r * 0.7, Math.cos(a) * r * 0.7], [at + l * 0.3, r + Math.sin(a) * (r + l), Math.cos(a) * (r + l)], 0.08, 0.08))
    g.add(merged(parts, look.bark))
    if (look.burn) coals(g, len * 0.15, r * 1.7, 0, r * 0.6, hash(c), 5)
    return standing(c, g)
  },
  // A broken cart: its bed and sides, a wheel still on and one lost (or on
  // its side, a wheel in the air), its shafts snapped.
  cart(c) {
    const { look } = c
    const g = new THREE.Group()
    const body = new THREE.Group()
    const wood = look.color, dark = shade(look.color, 0.7)
    const bed = [boxAt(2, 0.1, 1.05, 0, 0.42, 0)]
    for (const sz of [-1, 1]) bed.push(boxAt(2, 0.34, 0.07, 0, 0.62, sz * 0.5))
    bed.push(boxAt(0.07, 0.34, 1.05, -0.97, 0.62, 0))
    const shafts = [-0.32, 0.32].map((z) => boxAt(0.95, 0.07, 0.07, 1.45, 0.36, z, 0.08))
    body.add(merged([...bed, ...shafts], wood))
    const wheels = []
    if (look.wheels[0]) wheels.push(...wheelParts(0.4, 0.09, 0.1, 0.4, -0.6))
    if (look.wheels[1]) wheels.push(...wheelParts(0.4, 0.09, 0.1, 0.4, 0.6))
    if (wheels.length) body.add(merged(wheels, dark))
    if (look.tipped) {
      body.rotation.x = -1.25
      body.position.set(0, 0.55, 0.32)
    } else if (!look.wheels[0] || !look.wheels[1]) body.rotation.x = look.wheels[0] ? -0.22 : 0.22
    g.add(body)
    // a wheel fallen off, flat on the ground
    if (!look.wheels[0]) g.add(merged(wheelParts(0.4, 0.09, 0, 0, 0).map((p) => p.rotateX(Math.PI / 2).translate(-0.4, 0.05, -1.05)), dark))
    if (look.burn) coals(g, 0.2, look.tipped ? 0.95 : 0.6, 0, 0.4, hash(c), 6)
    return standing(c, g)
  },
  // A length of sandbag breastwork: two courses of fat sacks, one atop.
  sandbags(c) {
    const { look } = c
    const g = new THREE.Group()
    const bag = (x, y, z, k) => new THREE.IcosahedronGeometry(1, 1).scale(0.29, 0.13, 0.17).rotateY(k * 0.15).translate(x, y, z)
    const by = new Map()
    const put = (col, geo) => (by.has(col) ? by.get(col) : by.set(col, []).get(col)).push(geo)
    let k = 0
    for (const z of [-0.16, 0.16]) for (const x of [-0.27, 0.27]) put(look.colors[k++ % 3], bag(x, 0.12, z, k))
    for (const x of [-0.27, 0.27]) put(look.colors[k++ % 3], bag(x + look.slump, 0.34, 0, k))
    put(look.colors[k++ % 3], bag(look.slump * 2, 0.53, 0.02, k))
    for (const [col, geos] of by) g.add(mesh(mergeGeometries(geos), mat(col)))
    return standing(c, g)
  },
  // Wreckage burning where it fell: charred beams leaning in over a bed of
  // coals (the flames are the vent's).
  pyre(c) {
    const { look } = c
    const g = new THREE.Group()
    const beams = look.beams.map(([a, len, lean]) => beam([Math.cos(a) * 0.68, 0.04, Math.sin(a) * 0.68], [Math.cos(a) * (0.68 - len * lean), 0.1 + len * 0.62, Math.sin(a) * (0.68 - len * lean)], 0.13, 0.11))
    g.add(merged(beams, look.color))
    g.add(mesh(new THREE.CylinderGeometry(0.62, 0.72, 0.12, 9).translate(0, 0.06, 0), mat('#241c17')))
    coals(g, 0, 0.1, 0, 0.45, hash(c), 9)
    return standing(c, g)
  },
  // A cache of bombs: an open crate with hazard stripes on its sides, round
  // black bombs heaped in it and spilled beside it, their fuses, two lit.
  bombs(c) {
    const { look } = c
    const g = new THREE.Group()
    const W = 0.86, D = 0.62, Hc = 0.42
    const crate = [boxAt(W, 0.06, D, 0, 0.03, 0), boxAt(W, Hc, 0.06, 0, Hc / 2, -D / 2), boxAt(W, Hc, 0.06, 0, Hc / 2, D / 2), boxAt(0.06, Hc, D, -W / 2, Hc / 2, 0), boxAt(0.06, Hc, D, W / 2, Hc / 2, 0)]
    g.add(merged(crate, look.crate))
    // a band of yellow and black round the crate
    const yellow = [], black = []
    for (let i = 0; i < 6; i++) (i % 2 ? black : yellow).push(boxAt(W / 6, 0.12, D + 0.075, -W / 2 + (i + 0.5) * (W / 6), Hc * 0.62, 0))
    g.add(merged(yellow, '#e8b923'), merged(black, '#1d1b19'))
    const rnd = hash(c, 7), balls = [], fuses = [], lit = []
    const spots = [[-0.2, 0.36, -0.13], [0.2, 0.36, -0.13], [-0.2, 0.36, 0.13], [0.2, 0.36, 0.13], [0, 0.6, 0], [0.62, 0.17, 0.2], [-0.6, 0.17, -0.25], [0.45, 0.17, -0.5], [-0.3, 0.17, 0.52]]
    for (let i = 0; i < Math.min(look.n, spots.length); i++) {
      const [x, y, z] = spots[i], r = 0.17 + rnd() * 0.03
      balls.push(new THREE.IcosahedronGeometry(r, 1).translate(x, y, z))
      fuses.push(new THREE.CylinderGeometry(0.025, 0.025, 0.16, 4).rotateZ(rnd() - 0.5).translate(x, y + r + 0.05, z))
      if (i === 4 || i === 6) lit.push(new THREE.IcosahedronGeometry(0.05, 0).translate(x, y + r + 0.14, z))
    }
    g.add(mesh(mergeGeometries(balls), mat('#22201e', { metalness: 0.5 })), merged(fuses, '#c2a77a'))
    if (lit.length) g.add(mesh(mergeGeometries(lit), glowMat('#ffb347'), { shadow: false }))
    return standing(c, g)
  },
  // A trebuchet's counterweight torn loose: a great iron-bound box of
  // stones, tipped where it fell, a stub of the arm still in its yoke.
  counterweight(c) {
    const { w, d, h, color, iron } = c.look
    const g = framed(c)
    const box = new THREE.Group()
    box.add(mesh(boxAt(w, h * 0.92, d, 0, h * 0.46, 0), mat(color)))
    const bands = [-0.33, 0.33].map((f) => boxAt(w + 0.06, h * 0.94, 0.14, 0, h * 0.47, f * d))
    bands.push(boxAt(w + 0.06, 0.14, d + 0.06, 0, h * 0.8, 0))
    box.add(merged(bands, iron, { metalness: 0.5 }))
    box.add(merged([beam([0, h * 0.9, 0], [w * 0.15, h + 0.75, d * 0.1], 0.28, 0.24), boxAt(0.5, 0.3, 0.9, 0, h * 0.95, 0)], shade(color, 0.8)))
    box.rotation.z = 0.12
    g.add(box)
    return { obj: g }
  },
}
Object.assign(PIECES, WRECK_PIECES)

// ── Fortifications (F7a, DESIGN §4.2.4) ─────────────────────────────────────
// Decks, stairs, ladders and posts, each built from its look (the recipe's
// recorded draws: its colour, its size in its own frame, w along its own x,
// d along its own z, h tall) and its place and yaw, in a group turned as the
// chunk is (shape.yaw: a box's own frame, as core/terrain/geom.js reads it).
// A piece's small parts (planks, flagstones, steps, rungs, braces) are boxes
// merged into one geometry per material, so a rampart is a handful of draw
// calls, not a hundred. Nothing here draws from Math.random: every board of
// a seed looks alike, and a snap builds what the events built.
//
// Each walkable top (a deck's, a stair's ramp) also carries an invisible
// quad on it, `userData.top`, which the picker casts at (input/picking.js:
// a click on a deck lands on its top, not on the board under it), and
// TerrainView.surfaces() lists the tops for the reach overlay's deck tints
// (view/overlay.js). They are made only for these pieces, as their chunks
// are built: a classic table makes none (nor their ids' Math.random draws).
//
// What a piece's own frame means is recipes.js's: a deck's walkable top is
// at h, a stair rises from the ground at its own −x end to h at its +x end
// (look.rise '+x'), and a ladder's own −z is the side it leans out to, away
// from its deck's face (look.face '-z').

// (made at the first fortification built, never as the module loads: three.js
// draws Math.random for every object's uuid)
let fortKit = null
const kit = () => (fortKit ??= { pick: new THREE.MeshBasicMaterial({ visible: false }) })
// a colour lighter or darker by k (a deck's top and rim against its body)
const shade = (color, k) => `#${new THREE.Color(color).multiplyScalar(k).getHexString()}`
// a w × h × d box centred at (x, y, z), turned ry about y
function boxAt(w, h, d, x, y, z, ry = 0) {
  const g = new THREE.BoxGeometry(w, h, d)
  if (ry) g.rotateY(ry)
  return g.translate(x, y, z)
}
// a beam t thick (u across, v deep) from point a to point b ([x, y, z] each)
function beam(a, b, tu, tv = tu) {
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b)
  const dir = B.clone().sub(A), L = dir.length()
  const g = new THREE.BoxGeometry(tu, L, tv)
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize()))
  return g.translate((A.x + B.x) / 2, (A.y + B.y) / 2, (A.z + B.z) / 2)
}
// parts merged into one mesh of colour `color`
const merged = (parts, color, opts) => mesh(mergeGeometries(parts), mat(color, opts))
// the group a piece is built in: at its place on the table, turned its way
function framed(c) {
  const g = new THREE.Group()
  g.position.set(c.shape.x, 0, c.shape.z)
  g.rotation.y = c.shape.yaw
  return g
}
// the invisible quad on a walkable top (the picker's, and the overlay's
// shape for it): a deck's flat at h, a ramp's tilted up its own +x
function topQuad(g, w, d, h, ramp) {
  const len = ramp ? Math.hypot(w, h) : w
  const geo = new THREE.PlaneGeometry(len, d).rotateX(-Math.PI / 2)
  if (ramp) geo.rotateZ(Math.atan2(h, w))
  geo.translate(0, ramp ? h / 2 : h, 0)
  const q = new THREE.Mesh(geo, kit().pick)
  q.userData.top = true
  g.add(q)
}

const FORT_PIECES = {
  // A deck: its body (earth or stone, or a timber platform's open frame on
  // its posts), a rim round its top, and its walk (planks along the deck's
  // length on earth and timber, flagstones on stone). ((V3d) A wreck's is
  // its own: WRECK_DECKS, by its material.)
  deck(c) {
    if (WRECK_DECKS[c.look.material]) return WRECK_DECKS[c.look.material](c)
    const { w, d, h, material, color } = c.look
    const g = framed(c)
    const T = 0.1, RIM = 0.16
    if (c.supports) {
      // a timber platform: a slab on its posts (the post chunks, beside it),
      // two joists under it and an X of braces down each side between them
      const P = 0.2
      const slab = boxAt(w, 0.24, d, 0, h - T - 0.12, 0)
      const joists = [-1, 1].map((s) => boxAt(w - 0.3, 0.22, 0.26, 0, h - T - 0.35, s * (d / 2 - 0.5)))
      const braces = []
      const lo = 0.35, hi = h - T - 0.3
      for (const [ax, az, bx, bz] of [[-1, -1, 1, -1], [1, -1, 1, 1], [1, 1, -1, 1], [-1, 1, -1, -1]]) {
        const x0 = ax * (w / 2 - P), z0 = az * (d / 2 - P), x1 = bx * (w / 2 - P), z1 = bz * (d / 2 - P)
        braces.push(beam([x0, lo, z0], [x1, hi, z1], 0.12, 0.08), beam([x0, hi, z0], [x1, lo, z1], 0.12, 0.08))
      }
      g.add(merged([slab, ...joists], shade(color, 0.85)), merged(braces, shade(color, 0.7)))
    } else {
      // the body, and on stone a darker plinth course and a string course
      g.add(mesh(boxAt(w, h - T, d, 0, (h - T) / 2, 0), mat(color)))
      if (material === 'stone') g.add(merged([boxAt(w + 0.1, 0.32, d + 0.1, 0, 0.16, 0), boxAt(w + 0.06, 0.12, d + 0.06, 0, h * 0.55, 0)], shade(color, 0.78)))
      else g.add(merged([0.33, 0.66].map((f) => boxAt(w + 0.04, 0.14, d + 0.04, 0, h * f, 0)), '#6f5234'))
    }
    // the walk: planks across its width (along its length) or flagstones
    const top = []
    if (material === 'stone') {
      const n = Math.max(2, Math.round(w / 1.1)), m = Math.max(2, Math.round(d / 1.1))
      for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) {
        const tw = w / n, td = d / m
        top.push(boxAt(tw - 0.07, T, td - 0.07, -w / 2 + (i + 0.5) * tw, h - T / 2, -d / 2 + (j + 0.5) * td))
      }
      g.add(merged(top, shade(color, 1.18)), mesh(boxAt(w - 0.02, T * 0.6, d - 0.02, 0, h - T * 0.7, 0), mat(shade(color, 0.6))))
    } else {
      const n = Math.max(2, Math.round(d / 0.55))
      for (let j = 0; j < n; j++) {
        const pd = d / n
        top.push(boxAt(w - 0.04, T, pd - 0.06, 0, h - T / 2, -d / 2 + (j + 0.5) * pd))
      }
      g.add(merged(top, material === 'timber' ? shade(color, 1.15) : '#a07a4c'), mesh(boxAt(w - 0.02, T * 0.6, d - 0.02, 0, h - T * 0.7, 0), mat('#4a3420')))
    }
    // the rim: a lip round the top's edge
    const rim = [boxAt(w + 0.08, RIM, 0.16, 0, h + RIM / 2 - 0.06, -d / 2), boxAt(w + 0.08, RIM, 0.16, 0, h + RIM / 2 - 0.06, d / 2),
      boxAt(0.16, RIM, d, -w / 2, h + RIM / 2 - 0.06, 0), boxAt(0.16, RIM, d, w / 2, h + RIM / 2 - 0.06, 0)]
    g.add(merged(rim, shade(material === 'stone' ? color : '#7a5232', 0.8)))
    topQuad(g, w, d, h, false)
    return { obj: g }
  },
  // A stair: solid steps, each topped where the ramp's line crosses its
  // middle (so a figure walking the ramp's height stands on them), and an
  // up-arrow: a pale chevron on every other step, pointing up the stair.
  stair(c) {
    const { w: len, d: width, h, color } = c.look
    const g = framed(c)
    // ((V3d) a wreck's: timber steps, and on a trebuchet's its fallen arm)
    if (WRECK_DECKS[c.look.material] && c.look.material !== 'farm') return wreckStair(c, g)
    const n = Math.max(2, Math.round(len / 0.5)), run = len / n
    const steps = [], arrows = []
    for (let i = 0; i < n; i++) {
      const y = ((i + 0.5) * h) / n, x = -len / 2 + (i + 0.5) * run
      steps.push(boxAt(run + 0.01, y, width, x, y / 2, 0))
      if (i % 2 === 1 || i === n - 1) arrows.push(chevron(x, y + 0.012))
    }
    // its cheeks: a low wall up each side, following the ramp
    const cheeks = [-1, 1].map((s) => beam([-len / 2, 0.06, s * (width / 2 + 0.06)], [len / 2, h + 0.06, s * (width / 2 + 0.06)], 0.22, 0.14))
    // ((V3d) a burned farmstead's arrows sooty, the stair still plain)
    g.add(merged(steps, color), merged(cheeks, shade(color, 0.75)), merged(arrows, c.look.material === 'farm' ? '#c8b89c' : '#f4ead0', { flatShading: false }))
    topQuad(g, len, width, h, true)
    return { obj: g }
  },
  // A ladder against its deck's face: two rails leaning out to its own −z
  // (where its foot is), standing proud of the deck's top, and rungs.
  ladder(c) {
    const { w, d, h, color } = c.look
    const g = framed(c)
    const top = h + 0.4, out = 0.45, x = w / 2 - 0.12
    // (the face is at the strip's own +z side, d/2 from its centre)
    const at = (y) => -out + (out + d / 2 - 0.05) * (y / top)
    const parts = [-1, 1].map((s) => beam([s * x, 0, at(0)], [s * x, top, at(top)], 0.09, 0.09))
    for (let y = 0.3; y < h + 0.15; y += 0.33) parts.push(boxAt(2 * x, 0.06, 0.07, 0, y, at(y)))
    g.add(merged(parts, color))
    return { obj: g }
  },
  // A timber deck's post, square, the deck's height.
  post(c) {
    const { w, d, h, color } = c.look
    const g = framed(c)
    g.add(mesh(boxAt(w, h, d, 0, h / 2, 0), mat(shade(color, 0.8))))
    return { obj: g }
  },
}
// (V3d) The wrecks' decks, each drawn round its walkable top (w × d at h,
// in the chunk's own frame): the top itself always a flat walk at h (planks
// or a burned floor), so a figure standing on it stands on what it sees.
// Their fires' coals glow at their vents (look.vents, the plumes' too).
const ventCoals = (g, c, rnd) => {
  if (!c.look.burn) return
  for (const [x, y, z] of c.look.vents ?? []) coals(g, x, y, z, 0.35, rnd, c.look.burn > 1 ? 7 : 4)
}
// planks across a top w × d at h, every `gap`th one burned through
function planks(w, d, h, gap = 0) {
  const out = [], n = Math.max(2, Math.round(d / 0.55)), pd = d / n, T = 0.1
  for (let j = 0; j < n; j++) if (!gap || j % gap !== gap - 1) out.push(boxAt(w - 0.04, T, pd - 0.06, 0, h - T / 2, -d / 2 + (j + 0.5) * pd))
  return out
}
const WRECK_DECKS = {
  // A farmhouse burned out: its stone shell to the first floor, the
  // window holes black and sooted above, its floor charred planks (some
  // burned through) over the dark below, the joists' ends jutting at its
  // burning corners.
  farm(c) {
    const { w, d, h, color, timber } = c.look
    const g = framed(c), T = 0.1, rnd = hash(c)
    g.add(mesh(boxAt(w, h - T, d, 0, (h - T) / 2, 0), mat(color)))
    g.add(merged([boxAt(w + 0.1, 0.3, d + 0.1, 0, 0.15, 0), boxAt(w + 0.08, 0.16, d + 0.08, 0, h - 0.22, 0)], shade(color, 0.72)))
    // windows, each a black hole with soot licking up from it
    const holes = [], soot = []
    const win = (x, z, rot) => {
      holes.push(boxAt(0.62, 0.66, 0.06, 0, 0, 0).rotateY(rot).translate(x, h * 0.52, z))
      soot.push(boxAt(0.52, 0.5, 0.05, 0, 0, 0).rotateY(rot).translate(x, h * 0.52 + 0.55, z))
    }
    for (const sx of [-1, 1]) for (const f of [-0.28, 0.28]) win(f * w, sx * (d / 2 + 0.01), 0)
    for (const sx of [-1, 1]) if (d > 5) win(sx * (w / 2 + 0.01), d * 0.25 * sx, Math.PI / 2)
    g.add(merged(holes, '#120e0b'), merged(soot, '#2b2622'))
    g.add(merged(planks(w - 0.2, d - 0.2, h, 4), timber), mesh(boxAt(w - 0.22, T * 0.6, d - 0.22, 0, h - T * 0.7, 0), mat('#120e0b')))
    const rim = [boxAt(w + 0.08, 0.16, 0.18, 0, h + 0.02, -d / 2), boxAt(w + 0.08, 0.16, 0.18, 0, h + 0.02, d / 2), boxAt(0.18, 0.16, d, -w / 2, h + 0.02, 0), boxAt(0.18, 0.16, d, w / 2, h + 0.02, 0)]
    // what is left of the upper walls: ragged stubs along the rim, highest
    // at the corners (low enough to see over: no rule reads them)
    for (const sz of [-1, 1]) for (let i = 0; i < 7; i++) {
      const f = (i - 3) / 3, top = 0.12 + 0.45 * Math.abs(f) ** 2 * (0.6 + rnd() * 0.6)
      rim.push(boxAt(w / 7 - 0.04, top, 0.2, f * (w / 2 - w / 14), h + top / 2, sz * d / 2))
    }
    for (const sx of [-1, 1]) for (let i = 0; i < 5; i++) {
      const f = (i - 2) / 2, top = 0.12 + 0.45 * Math.abs(f) ** 2 * (0.6 + rnd() * 0.6)
      rim.push(boxAt(0.2, top, d / 5 - 0.04, sx * w / 2, h + top / 2, f * (d / 2 - d / 10)))
    }
    g.add(merged(rim, shade(color, 0.85)))
    const joists = []
    for (const [x, , z] of c.look.vents ?? []) for (let k = 0; k < 2; k++) {
      const a = rnd() * 6.28
      joists.push(beam([x, h - 0.1, z], [x + Math.cos(a) * 0.35, h + 0.45 + rnd() * 0.35, z + Math.sin(a) * 0.35], 0.16, 0.14))
    }
    if (joists.length) g.add(merged(joists, timber))
    ventCoals(g, c, rnd)
    topQuad(g, w, d, h, false)
    return { obj: g }
  },
  // A barn's hayloft left standing on its posts: a charred slab and joists,
  // braces between the posts, two of its rafters still up over the back
  // and burning at their feet.
  barn(c) {
    const { w, d, h, color } = c.look
    const g = framed(c), T = 0.1, P = 0.2, rnd = hash(c)
    const slab = boxAt(w, 0.24, d, 0, h - T - 0.12, 0)
    const joists = [-1, 1].map((sz) => boxAt(w - 0.3, 0.22, 0.26, 0, h - T - 0.35, sz * (d / 2 - 0.5)))
    const braces = []
    const lo = 0.35, hi = h - T - 0.3
    for (const sz of [-1, 1]) {
      const z = sz * (d / 2 - P)
      for (const [x0, x1] of [[-w / 2 + P, 0], [0, w / 2 - P]]) braces.push(beam([x0, lo, z], [x1, hi, z], 0.12, 0.08), beam([x0, hi, z], [x1, lo, z], 0.12, 0.08))
    }
    g.add(merged([slab, ...joists], shade(color, 0.9)), merged(braces, shade(color, 0.75)))
    g.add(merged(planks(w, d, h, 5), shade(color, 1.25)), mesh(boxAt(w - 0.02, T * 0.6, d - 0.02, 0, h - T * 0.7, 0), mat('#120e0b')))
    // the rafters: an A over the back edge at each end, one leg snapped
    const rafters = []
    for (const sx of [-1, 1]) {
      const x = sx * (w / 2 - 0.35), z = d / 2 - 0.2
      rafters.push(beam([x, h, z], [x - sx * 0.9, h + 1.4, z], 0.16, 0.14), beam([x - sx * 1.8, h, z], [x - sx * 1.25, h + 0.85 + rnd() * 0.2, z], 0.16, 0.14))
    }
    g.add(merged(rafters, color))
    const rim = [boxAt(w + 0.08, 0.14, 0.14, 0, h + 0.01, -d / 2), boxAt(0.14, 0.14, d, -w / 2, h + 0.01, 0), boxAt(0.14, 0.14, d, w / 2, h + 0.01, 0)]
    g.add(merged(rim, shade(color, 0.8)))
    ventCoals(g, c, rnd)
    topQuad(g, w, d, h, false)
    return { obj: g }
  },
  // A great trebuchet's frame wrecked: two great side beams and their
  // cross beams under a planked top, its wheels along its sides (one
  // broken), and in its middle the A-frames that held the arm, snapped.
  trebuchet(c) {
    const { w, d, h, color, iron } = c.look
    const g = framed(c), rnd = hash(c)
    const beams = [], top = planks(w, d - 0.5, h, 0)
    for (const sz of [-1, 1]) beams.push(boxAt(w + 0.3, 0.5, 0.42, 0, h - 0.25, sz * (d / 2 - 0.21)), boxAt(w - 0.4, 0.35, 0.3, 0, 0.5, sz * (d / 2 - 0.3)))
    for (const x of [-w / 2 + 0.3, -w / 6, w / 6, w / 2 - 0.3]) beams.push(boxAt(0.32, 0.4, d - 0.4, x, h - 0.45, 0))
    for (const x of [-w / 2 + 0.3, w / 2 - 0.3]) for (const sz of [-1, 1]) beams.push(boxAt(0.3, h - 0.5, 0.3, x, (h - 0.5) / 2, sz * (d / 2 - 0.3)))
    g.add(merged(beams, shade(color, 0.8)), merged(top, color))
    // the A-frames, snapped: each leg a beam up from the side beam, broken off
    const legs = []
    for (const sz of [-1, 1]) {
      const z = sz * (d / 2 - 0.21)
      legs.push(beam([-1.4, h, z], [-0.3, h + 2 + rnd() * 0.4, z], 0.28, 0.24), beam([1.4, h, z], [0.55, h + 1.2 + rnd() * 0.5, z], 0.28, 0.24))
      // (the axle's bearing, snapped off with the leg)
      legs.push(boxAt(0.5, 0.36, 0.36, -0.3, h + 2.05, z))
    }
    g.add(merged(legs, shade(color, 0.92)))
    const wheels = []
    for (const sz of [-1, 1]) for (const x of [-w / 2 + 1, w / 2 - 1]) {
      if (sz < 0 && x > 0) continue
      wheels.push(...wheelParts(0.95, 0.18, x, 0.95, sz * (d / 2 + 0.14)))
    }
    // the broken one, lying against the frame
    wheels.push(...wheelParts(0.95, 0.18, 0, 0, 0, 0).map((p) => p.rotateX(1.2).translate(w / 2 - 1.1, 0.5, -d / 2 - 0.6)))
    g.add(merged(wheels, shade(color, 0.65)))
    const bands = [-w / 2 + 0.3, -w / 6, w / 6, w / 2 - 0.3].flatMap((x) => [-1, 1].map((sz) => boxAt(0.36, 0.54, 0.46, x, h - 0.25, sz * (d / 2 - 0.21))))
    g.add(merged(bands, iron, { metalness: 0.5 }))
    ventCoals(g, c, rnd)
    topQuad(g, w, d, h, false)
    return { obj: g }
  },
  // A war-wagon wrecked: its bed planked, its side boards half burned away,
  // its axles and wheels (two lost), its pole snapped off at the front.
  wagon(c) {
    const { w, d, h, color, iron } = c.look
    const g = framed(c), rnd = hash(c)
    const body = [boxAt(w - 0.3, h - 0.55, d - 0.5, 0, 0.55 + (h - 0.55) / 2 - 0.05, 0)]
    for (const x of [-w / 2 + 0.9, w / 2 - 0.9]) body.push(boxAt(0.3, 0.3, d + 0.2, x, 0.5, 0))
    g.add(merged(body, shade(color, 0.7)), merged(planks(w, d, h, 6), color))
    const sides = []
    for (const sz of [-1, 1]) for (let i = 0; i < 6; i++) {
      if (rnd() < 0.4) continue
      sides.push(boxAt(w / 6 - 0.05, 0.22 + rnd() * 0.25, 0.1, -w / 2 + (i + 0.5) * (w / 6), h + 0.12, sz * (d / 2 - 0.05)))
    }
    if (sides.length) g.add(merged(sides, shade(color, 0.85)))
    const wheels = [...wheelParts(0.6, 0.14, -w / 2 + 0.9, 0.6, -d / 2 - 0.12), ...wheelParts(0.6, 0.14, w / 2 - 0.9, 0.6, d / 2 + 0.12)]
    wheels.push(...wheelParts(0.6, 0.14, 0, 0, 0).map((p) => p.rotateX(Math.PI / 2 - 0.15).translate(w / 2 - 0.6, 0.1, -d / 2 - 0.9)))
    g.add(merged(wheels, shade(color, 0.6)), merged([beam([w / 2 - 0.2, 0.5, 0], [w / 2 + 1.1, 0.12, 0.3], 0.14, 0.14)], color))
    g.add(merged([-w / 2 + 0.9, w / 2 - 0.9].map((x) => boxAt(0.12, 0.12, d + 0.5, x, 0.6, 0)), iron, { metalness: 0.5 }))
    ventCoals(g, c, rnd)
    topQuad(g, w, d, h, false)
    return { obj: g }
  },
  // A venom engine overturned: its carriage on its side (the top its
  // flank), its wheels standing out from its back like a beetle's legs,
  // its globe's cage cracked at one end and the venom spilled on the
  // ground, glowing.
  engine(c) {
    const { w, d, h, color, iron, end, ooze } = c.look
    const g = framed(c), rnd = hash(c)
    g.add(mesh(boxAt(w, h - 0.08, d, 0, (h - 0.08) / 2, 0), mat(shade(color, 0.75))))
    g.add(merged(planks(w, d, h, 0), color))
    const ribs = [-w / 3, 0, w / 3].map((x) => boxAt(0.14, h + 0.04, d + 0.08, x, h / 2, 0))
    g.add(merged(ribs, iron, { metalness: 0.5 }))
    const wheels = []
    for (const x of [-w / 2 + 1, w / 2 - 1]) wheels.push(...wheelParts(0.55, 0.12, x, h * 0.6, d / 2 + 0.1))
    g.add(merged(wheels, shade(color, 0.6)))
    // the globe's cage, cracked, and the glow inside it
    const x0 = -end * (w / 2 + 0.2)
    g.add(merged([0, 1.2, 2.4].map((a) => new THREE.TorusGeometry(0.5, 0.05, 4, 10).rotateY(a).translate(x0, 0.5, -d / 4)), iron, { metalness: 0.5 }))
    g.add(mesh(new THREE.IcosahedronGeometry(0.34, 1).translate(x0, 0.4, -d / 4), glowMat('#7dff5a'), { shadow: false }))
    // the basilisk's skull, fallen off its prow
    g.add(merged([new THREE.IcosahedronGeometry(0.32, 1).scale(1, 0.75, 1.3).translate(-x0 * 1.05, 0.25, d / 5)], '#d8cfb0'))
    // the venom, spilled behind it
    g.add(mesh(mergeGeometries(ooze.map(([x, z, r]) => new THREE.CircleGeometry(r * 0.8, 9).rotateX(-Math.PI / 2).translate(x, 0.02, z))), glowMat('#38a51d'), { shadow: false }))
    ventCoals(g, c, rnd)
    topQuad(g, w, d, h, false)
    return { obj: g }
  },
}
// A wreck's stair: timber steps planked over the wreckage (no arrows: the
// heap of planks shows the way up), and on a trebuchet's (look.arm) its
// snapped arm lying along it, its sling's cup at the foot.
function wreckStair(c, g) {
  const { w: len, d: width, h, color } = c.look
  const n = Math.max(2, Math.round(len / 0.5)), run = len / n
  const steps = []
  for (let i = 0; i < n; i++) {
    const y = ((i + 0.5) * h) / n, x = -len / 2 + (i + 0.5) * run
    steps.push(boxAt(run + 0.01, y, width, x, y / 2, 0))
  }
  const treads = []
  for (let i = 0; i < n; i++) {
    const y = ((i + 0.5) * h) / n, x = -len / 2 + (i + 0.5) * run
    for (const z of [-width / 3, 0, width / 3]) treads.push(boxAt(run - 0.04, 0.05, width / 3 - 0.08, x, y + 0.02, z))
  }
  g.add(merged(steps, shade(color, 0.7)), merged(treads, color))
  if (c.look.arm) {
    const arm = [beam([-len / 2 - 0.6, 0.18, 0.4], [len / 2 + 1.4, h + 0.25, 0.25], 0.42, 0.42)]
    arm.push(new THREE.CylinderGeometry(0.45, 0.32, 0.4, 8).translate(-len / 2 - 0.8, 0.2, 0.45))
    g.add(merged(arm, shade(color, 0.85)))
  }
  topQuad(g, len, width, h, true)
  return { obj: g }
}

// an up-arrow on a step's top at x, y (pointing up the stair's own +x)
function chevron(x, y) {
  const s = new THREE.Shape([[-0.2, -0.62], [0.16, 0], [-0.2, 0.62], [-0.42, 0.62], [-0.08, 0], [-0.42, -0.62]].map(([a, b]) => new THREE.Vector2(a, b)))
  return new THREE.ShapeGeometry(s).rotateX(-Math.PI / 2).translate(x, y, 0)
}
Object.assign(PIECES, FORT_PIECES)

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
  // ((V3d) `scorch`, when given, hears the burned turf the table's chunks
  // leave round them, [{ x, z, r }], as it changes (view/index.js hands it
  // to the table's mat: view/table.js scorch); a table built off the page,
  // a snap check's, passes none)
  constructor(scene, fx, { scorch = null } = {}) {
    this.scene = scene
    this.effects = fx
    this.onScorch = scorch
    // (V3d) the burned turf, by chunk id: { x, z, r } (scorched), and its
    // signature as last handed on
    this.marks = new Map()
    this.markSig = ''
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
      // ((F16) but the drops the fog keeps unseen)
      case 'terrain.collapse': return this.collapse(e.unseen ? e.drops.filter((d) => !e.unseen.includes(d.id)) : e.drops, e.by, M)
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
    // ((V3d) nothing burns off the table; a spare taken back burns again)
    for (const id of this.items.keys()) this.ventOff(id)
    this.marks.clear()
    this.scorched()
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
      this.ventOn(item)
      this.burnMark(c)
      return
    }
    if (c.look.piece === 'fallen') return this.fell(c)
    const item = { c, ...PIECES[c.look.piece](c) }
    this.items.set(c.id, item)
    this.group.add(item.obj)
    this.tile(item)
    this.ventOn(item)
    this.burnMark(c)
  }

  // ── Fires and scorched turf (V3d) ─────────────────────────────────────────
  // Where a burning chunk's fires are on the table, from its look (`burn`
  // and `vents`, core/terrain/recipes.js): each vent's place in the frame
  // the piece is drawn in (its shape's turn), on the table; with no vents,
  // its top's middle. A chunk at a height other than its def's (a chimney's
  // cap dropped by a collapse) passes `y`, its centre's.
  // (A Powder Field's keg or cache, look.spill, sputters at its fuse: a
  // vent of burn 3, its sparks alone.)
  ventsOf(c, y = c.shape.y) {
    const s = c.shape, co = Math.cos(s.yaw), sn = Math.sin(s.yaw)
    const at = ([x, vy, z], burn) => ({ x: s.x + co * x + sn * z, y: vy, z: s.z - sn * x + co * z, burn })
    if (!c.look.burn) return [at(c.look.piece === 'bombs' ? [0, 1, 0] : [0.17, 1.5, 0.05], 3)]
    return (c.look.vents ?? [[0, y + s.hy, 0]]).map((v) => at(v, c.look.burn))
  }
  // a chunk's fires lit, as its item comes onto the table standing (an
  // add, a spare taken back, a sync's or a reveal's build); put out as it
  // goes (ventOff: freed, broken, cleared)
  ventOn(item, y) {
    if (!burns(item.c) || !this.shows(item)) return
    this.effects.vent?.(item.c.id, this.ventsOf(item.c, y))
  }
  ventOff(id) {
    const item = this.items.get(id)
    if (item && burns(item.c)) this.effects.unvent?.(id)
  }
  // a chunk's burned turf (look.scorch: its radius), kept whatever becomes
  // of the chunk (the turf stays burned), handed on once a run of adds is
  // over (scorched, from a microtask)
  // ((V3d) and a keg's spill: black powder, { powder: true })
  burnMark(c) {
    if (c.look.spill) this.marks.set(c.id, { x: c.shape.x, z: c.shape.z, r: 1.3, powder: true })
    else if (c.look.scorch > 0) this.marks.set(c.id, { x: c.shape.x, z: c.shape.z, r: c.look.scorch })
    else return
    if (!this.markPending) {
      this.markPending = true
      queueMicrotask(() => {
        this.markPending = false
        this.scorched()
      })
    }
  }
  scorched() {
    const list = [...this.marks.values()]
    const sig = list.map((m) => `${m.x},${m.z},${m.r},${m.powder ? 1 : 0}`).join(';')
    if (sig === this.markSig) return
    this.markSig = sig
    this.onScorch?.(list)
  }

  // everything off the table and freed (a new table drawn from scratch, in a
  // new group, as a terrain.clear's)
  dispose() {
    this.freeSpares()
    this.dropTiles()
    for (const item of this.items.values()) this.free(item)
    this.marks.clear()
    this.scorched()
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
    // ((V3d) the burned turf: every chunk's that scorches, standing or not)
    this.marks.clear()
    for (const c of chunks) this.burnMark(c)
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
          // ((F8b's review) and a hurt's shudder still under way stops, the
          // block back at its own x and z: tiled now, the tile would keep
          // the shaken place, up to 0.03" off, once the shudder ended)
          kept.shake = null
          if (kept.obj.position.y !== c.shape.y || kept.obj.position.x !== c.shape.x || kept.obj.position.z !== c.shape.z) this.untile(kept)
          kept.obj.position.set(c.shape.x, c.shape.y, c.shape.z)
          kept.c = defOf(c)
        }
        // ((F8b) a chunk promoted out of its tile by an event whose
        // playback the snap cut short: back in it)
        this.tile(kept)
        // ((V3d) its fires where it stands now)
        this.ventOn(kept, c.shape.y)
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
      this.ventOn(item)
      // a rubble pile: a heap of pieces for each block of its column broken
      if (c.kind === 'rubble') for (const b of chunks) if (b.kind === 'block' && !b.alive && b.col?.rubble === c) this.rubble(def, null)
    }
    this.flush()
  }

  // (F16) Chunks the fog kept as last seen, seen again as they now stand:
  // [{ def (defOf, as the chunk stands), alive, tree (a fallen log's tree's
  // def) }]. A broken one is taken off the table (no debris: its break was
  // never seen); a standing one is set at its height (a drop never seen);
  // one the table doesn't draw yet (rubble, a fallen log, never seen) is
  // built as sync builds it. What already shows a chunk as it stands is
  // left as it is.
  reveal(list) {
    for (const { def, alive } of list) {
      const item = this.items.get(def.id)
      if (alive || !item || !this.shows(item)) continue
      this.ventOff(def.id)
      this.free(item)
      this.items.set(def.id, { c: item.c, obj: null })
    }
    for (const { def, alive, tree } of list) {
      if (!alive) continue
      const item = this.items.get(def.id)
      if (item?.obj && this.shows(item)) {
        if (SET_Y.has(def.look.piece) && item.obj.position.y !== def.shape.y) {
          item.fall = null
          item.anims = 0
          this.untile(item)
          item.obj.position.y = def.shape.y
          item.c = def
          this.tile(item)
        }
        continue
      }
      if (item) this.free(item)
      if (def.look.piece === 'fallen') {
        // (its tree, if the table still draws it standing, goes first)
        const t = tree && this.items.get(tree.id)
        if (t && this.shows(t)) this.free(t)
        if (tree) this.fallen(def, tree)
        continue
      }
      const made = { c: def, ...PIECES[def.look.piece](def) }
      this.items.set(def.id, made)
      this.group.add(made.obj)
      this.tile(made)
      this.ventOn(made)
      this.burnMark(def)
    }
    this.flush()
  }

  // (F7a) The walkable tops the table shows standing: the defs of its decks
  // and stairs (the reach overlay tints each, view/overlay.js), and the
  // invisible quads on them the picker casts at (input/picking.js).
  surfaces() {
    const out = []
    for (const item of this.items.values()) if (item.c.surface && this.shows(item)) out.push(item.c)
    return out
  }
  // (each quad's world matrix brought up to date: a table drawn under ?fast
  // renders nothing, which is what would otherwise do it)
  tops() {
    const out = []
    for (const item of this.items.values()) {
      if (!item.c.surface || !this.shows(item)) continue
      for (const o of item.obj.children) {
        if (!o.userData.top) continue
        o.updateWorldMatrix(true, false)
        out.push(o)
      }
    }
    return out
  }
  // the ladders the table shows standing: their defs (each with its link)
  ladders() {
    const out = []
    for (const item of this.items.values()) if (item.c.link && this.shows(item)) out.push(item.c)
    return out
  }
  // the highest walkable top the table shows at (x, z), 0 on the ground (the
  // objectives' markers stand on it: the keep's on its top)
  floorAt(x, z) {
    let y = 0
    for (const c of this.surfaces()) y = Math.max(y, topAt(c, x, z) ?? 0)
    return y
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
    // ((V3d) its fires out, while it is still the item of its chunk)
    if (item.c && this.items.get(item.c.id) === item) this.ventOff(item.c.id)
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
    // ((F8b's review) a token, as a fall's: a snap that stops the shudder
    // (sync) leaves the block where it put it)
    const shake = (v.shake = {})
    tween(0.25, (k) => {
      if (v.shake !== shake) return
      const a = (1 - k) * 0.06
      m.position.x = p0.x + (Math.random() - 0.5) * a
      m.position.z = p0.z + (Math.random() - 0.5) * a
    }).then(() => {
      if (v.shake !== shake) return
      v.shake = null
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
    // ((V3d) what burned on it goes out with it)
    this.ventOff(c.id)
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
      // (F19a) a powder keg bursts as a crate does, its staves flying and a
      // puff of black powder; its explosion is its blast's, which follows
      // (keg.fuse, then blast.land with fx 'keg': view/effects/shots.js)
      case 'keg':
        this.group.remove(v.obj)
        fx.debris(s.x, s.y, s.z, [...WOOD, '#2f2f2f'], 16, { from, power: 6, size: 0.12 })
        fx.smoke({ x: s.x, y: s.y, z: s.z, size: 0.35, color: '#2a2622', life: 1.2 })
        break
      // (V3d) the Powder Field's: a stump or a cart splinters into charcoal
      // and a puff of ash, a sandbag bursts in a spray of sand
      case 'stump':
      case 'cart':
        this.group.remove(v.obj)
        fx.debris(s.x, s.y, s.z, [c.look.chip, '#2e2621', '#5a3f2a'], c.kind === 'cart' ? 16 : 8, { from, power: 6, size: 0.12 })
        fx.smoke({ x: s.x, y: s.y, z: s.z, size: 0.35, color: '#4a4440', life: 1.4 })
        break
      case 'sandbag':
        this.group.remove(v.obj)
        fx.debris(s.x, s.y, s.z, ['#a8946a', '#c9b48a', '#8f7b55'], 14, { from, power: 4, size: 0.09 })
        fx.smoke({ x: s.x, y: s.y, z: s.z, size: 0.3, color: '#b8a77e', life: 1.1 })
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
        // ((V3d) a chimney's smoke from where its cap came to rest)
        if (item.fall === fall && this.items.get(id) === item) this.ventOn(item, rest)
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
    // ((V3d) a burned snag's as a tree's: its own piece)
    const { obj: g, canopy } = PIECES[t.look.piece](t)
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
// ((V3d) and the unlit one, `basic`: what glows, coals and venom, stays
// unlit in its tile)
const tileClass = (m) => (m.isMeshBasicMaterial ? 'basic' : [m.flatShading ? 1 : 0, m.metalness, m.roughness].join(','))
function tileMat(key, m) {
  if (!tileMats.has(key)) {
    const mat = m.isMeshBasicMaterial
      ? new THREE.MeshBasicMaterial({ color: '#ffffff', vertexColors: true, toneMapped: false })
      : new THREE.MeshStandardMaterial({ color: '#ffffff', vertexColors: true, roughness: m.roughness, metalness: m.metalness, flatShading: m.flatShading })
    mat.userData.tileKey = key
    tileMats.set(key, mat)
  }
  return tileMats.get(key)
}
// whether a mesh shows, as far as its own object goes (a part hidden in
// its chunk's object is no part of its tile: the object's own `visible`,
// false while tiled, is not asked). (F7a's pieces, merged with F8b) A mesh
// whose material draws nothing, a deck's or stair's pick quad (userData.top,
// the picker's and the overlay's), is none either: it stays in its chunk's
// own object, where tops() finds it, and its tile never draws it.
function visibleIn(o, root) {
  if (o.userData.top || o.material?.visible === false) return false
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

// (V3d) whether a chunk has fires on it (look.burn) or a fuse sputtering (a
// Powder Field's keg or cache, look.spill): its vents, ventsOf
const burns = (c) => !!(c.look.burn || c.look.spill)

// the pieces whose mesh stands at the chunk's height (a wall's blocks and
// caps, which drop when a block under them breaks)
const SET_Y = new Set(['box', 'log', 'cap'])

// a chunk as its terrain.add carries it: a copy of core/terrain/terrain.js's
// defOf, which core doesn't export (R7 left core/ as it was), and which sync
// builds and keys the table by. The two must stay in step (a field core's
// adds carry and this lacks would leave a synced table short of it, and its
// spares never taken back): sim/terrain-check.mjs holds every add's def to
// this one.
// (F7a) And, for the pieces that have them (decks, stairs, ladders, posts),
// the height fields core's adds carry (core/terrain/terrain.js's
// HEIGHT_FIELDS, which the view can't import: terrain.js is no door of the
// core's, sim/boundaries.mjs), copied like the shape: what a timber deck is
// drawn on (its `supports`) and what sync keys the table by.
// sim/terrain-check.mjs holds this list to core's, and every fortified
// board's adds to this defOf, as it does classic's.
export const HEIGHT_FIELDS = Object.freeze(['surface', 'link', 'base', 'supports', 'fallsAt', 'on'])
const copy = (v) => (Array.isArray(v) ? v.map(copy) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, copy(x)])) : v)
export const defOf = (c) => {
  const def = { id: c.id, kind: c.kind, shape: { ...c.shape }, look: c.look }
  for (const k of HEIGHT_FIELDS) if (c[k] !== undefined) def[k] = copy(c[k])
  return def
}

// whether two defs are the same chunk drawn the same (the height too, or
// not: a dropped block is the same block, lower; (F7a) and its height
// fields, which a classic chunk has none of)
function sameDef(a, b, withY) {
  const key = (d) => JSON.stringify({ id: d.id, kind: d.kind, look: d.look, shape: withY ? d.shape : { ...d.shape, y: 0 }, height: HEIGHT_FIELDS.map((k) => d[k]) })
  return key(a) === key(b)
}

// (F7a) How high a walkable top `c` (a def with a surface) stands over the
// table at (x, z), or null where its footprint doesn't cover the point: a
// deck's y, a ramp's height along its own x (from y0 at its −x end).
// Presentation only (the objectives' markers, the overlay's fallback): the
// rules read their own floor, core/nav.js's, cell by cell.
export function topAt(c, x, z) {
  const s = c.shape, co = Math.cos(s.yaw), sn = Math.sin(s.yaw)
  const dx = x - s.x, dz = z - s.z
  const lx = dx * co - dz * sn, lz = dx * sn + dz * co
  if (Math.abs(lx) > s.hx || Math.abs(lz) > s.hz) return null
  const r = c.surface.ramp
  if (!r) return c.surface.y
  const t = ((r.axis === 'z' ? lz / s.hz : lx / s.hx) + 1) / 2
  return r.y0 + (r.y1 - r.y0) * t
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
