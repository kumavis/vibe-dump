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
// ── Fortifications (F7a, DESIGN §4.2.4) ─────────────────────────────────────
// Decks, stairs, ladders, posts and (F7b) parapets, each built from its look (the recipe's
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
  // length on earth and timber, flagstones on stone).
  deck(c) {
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
    const n = Math.max(2, Math.round(len / 0.5)), run = len / n
    const steps = [], arrows = []
    for (let i = 0; i < n; i++) {
      const y = ((i + 0.5) * h) / n, x = -len / 2 + (i + 0.5) * run
      steps.push(boxAt(run + 0.01, y, width, x, y / 2, 0))
      if (i % 2 === 1 || i === n - 1) arrows.push(chevron(x, y + 0.012))
    }
    // its cheeks: a low wall up each side, following the ramp
    const cheeks = [-1, 1].map((s) => beam([-len / 2, 0.06, s * (width / 2 + 0.06)], [len / 2, h + 0.06, s * (width / 2 + 0.06)], 0.22, 0.14))
    g.add(merged(steps, color), merged(cheeks, shade(color, 0.75)), merged(arrows, '#f4ead0', { flatShading: false }))
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
  // (F7b) A parapet: a thin crenellated wall standing on its deck's top
  // (def.base, the deck's y), w long along its own x, d thick, h tall, its
  // outer face its own −z (look.face '-z', on the deck's edge). In the
  // deck's material: on stone a wall of the deck's colour with a darker
  // coping course and merlons over it; on earth (a rampart's) a bank of
  // the deck's earth with a timber rail and wooden merlons. The crenels
  // are drawn only: the rules' body is the whole 0.7" box, which obscures a
  // ray crossing it below its top (core/terrain/recipes.js). Two meshes, so
  // a keep's ten are twenty draw calls (fewer once tiled).
  parapet(c) {
    const { w, d, h, material, color } = c.look
    const y0 = c.base ?? 0
    const g = framed(c)
    const stone = material === 'stone'
    const wall = stone ? 0.48 : 0.44, rail = 0.07, top = h - wall - rail
    const body = [boxAt(w, wall, d, 0, y0 + wall / 2, 0)]
    const trim = [boxAt(w + 0.04, rail, d + 0.06, 0, y0 + wall + rail / 2, 0)]
    // merlons: n of them and n − 1 crenels between, alike in width, a
    // merlon at each end
    const n = Math.max(2, Math.round((w + 0.3) / 0.6)), seg = w / (2 * n - 1)
    const merlons = []
    for (let i = 0; i < n; i++) merlons.push(boxAt(seg, top, stone ? d : d * 0.7, -w / 2 + seg * (2 * i + 0.5), y0 + wall + rail + top / 2, 0))
    if (stone) g.add(merged([...body, ...merlons], color), merged(trim, shade(color, 0.72)))
    else g.add(merged(body, shade(color, 0.92)), merged([...trim, ...merlons], '#7a5232'))
    return { obj: g }
  },
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
    // ((F7b) every chunk drawn solid again: a spare taken back by the next
    // table's add is the chunk as it stands, not as the last one saw it)
    for (const item of this.items.values()) this.solid(item)
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
  // ((F7b) nor seen through: a faded chunk draws its own mesh, in its faded
  // materials, until it is solid again)
  tileable(item) {
    return this.tiled && !!item.obj && item.obj.parent === this.group && !item.shared && item.c.kind !== 'rubble' && item.c.look.piece !== 'fallen' && !(item.anims > 0) && !item.faded && this.shows(item)
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

  // ── See-through walls (F7b, DESIGN §4.2.4's "View, input, UI") ──────────
  // The chunks the table shows standing that stand between the camera's
  // `eye` and any of the points `pts` ({ x, y, z }: on the units the player
  // is looking at, view/index.js), by id; with `all`, every tall chunk too
  // (Alt held). "Between": the segment from the eye to the point passes
  // through the chunk's box in the world (its object's, made once and kept
  // until the object moves: a drop, a shudder, a fall), which is the
  // spec's "its screen box covers the unit" with the depth asked too, so a
  // wall behind a unit stays solid. A flat chunk (a forest's floor, a
  // rubble pile) hides nothing, and a walkable top a point stands on (its
  // deck or stair under the unit) is never in front of it.
  occluders(eye, pts, all = false) {
    const out = new Set()
    for (const item of this.items.values()) {
      if (!this.shows(item) || item.shared || FLAT.has(item.c.kind)) continue
      const b = this.boxOf(item)
      if (all && b.max.y > TALL) {
        out.add(item.c.id)
        continue
      }
      if (b.max.y < 0.3) continue
      for (const p of pts) {
        if (item.c.surface && topAt(item.c, p.x, p.z) !== null) continue
        if (segmentMeets(eye, p, b)) {
          out.add(item.c.id)
          break
        }
      }
    }
    return out
  }
  // the box an item's object fills in the world (kept on the item until its
  // object moves)
  boxOf(item) {
    const o = item.obj, at = `${o.position.x},${o.position.y},${o.position.z},${o.quaternion.y},${o.quaternion.w}`
    if (item.box?.at !== at) {
      o.updateMatrixWorld(true)
      item.box = { at, b: new THREE.Box3().setFromObject(o) }
    }
    return item.box.b
  }
  // Show the chunks `ids` names faded (35% of their pixels drawn, in a
  // fixed 4×4 dither: no transparency sort, and what they hid shows
  // through the gaps), every other one solid again. A faded chunk leaves
  // its tile (its own mesh shows, its tile merged again without it) and
  // goes back once solid. The faded materials are made once per material
  // and kept (fadeOf), so seeing through links one program per kind of
  // material, once.
  seeThrough(ids) {
    for (const item of this.items.values()) {
      const want = ids.has(item.c.id) && this.shows(item) && !item.shared
      if (want === !!item.faded) continue
      if (want) {
        if (item.tile) {
          this.untile(item)
          this.flush()
        }
        item.faded = true
        item.obj.traverse((o) => {
          if (!o.isMesh || o.userData.top || o.material?.visible === false) return
          o.userData.solid = o.material
          o.material = fadeOf(o.material)
        })
      } else this.solid(item)
    }
  }
  // an item drawn solid again (and back in its tile)
  solid(item) {
    if (!item.faded) return
    item.faded = false
    item.obj?.traverse((o) => {
      if (!o.userData.solid) return
      o.material = o.userData.solid
      o.userData.solid = undefined
    })
    this.tile(item)
  }
  // the ids of the chunks shown faded now (sim/'s, through the scene: each
  // faded mesh's material carries userData.seeThrough)
  faded() {
    return [...this.items.values()].filter((item) => item.faded).map((item) => item.c.id)
  }

  // ── Freeing ───────────────────────────────────────────────────────────────
  // An item off the table, and what only it used freed: its geometry (but
  // the shared box and log shapes) and a scuffed chunk's own material. (A
  // fallen tree's item shares its mesh with its log's, which frees it.)
  // ((F7b) A faded one drawn solid first, and its own material's faded
  // copy freed with it.)
  free(item) {
    this.solid(item)
    if (item.ownMat && item.obj?.material && fades.has(item.obj.material)) {
      fades.get(item.obj.material).dispose()
      fades.delete(item.obj.material)
    }
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
    // ((F7b) solid first: its scuffed colour is its own material's; the
    // next frame's see-through fades it again if it is still in the way)
    this.solid(v)
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
      // (F7b) a parapet leaves no rubble piece (core's terrain adds none: it
      // had no nav effect): its stones or its earth and timber spill off
      // the deck, with a puff of dust
      case 'parapet': {
        this.group.remove(v.obj)
        const stone = c.look.material === 'stone'
        fx.debris(s.x, s.y, s.z, stone ? [c.look.chip, c.look.chip, '#5a5650'] : [c.look.chip, '#7a5232', '#5f3e24'], 14, { from, power: 5, size: 0.1 })
        fx.smoke({ x: s.x, y: s.y, z: s.z, size: 0.35, color: stone ? '#a09a8a' : '#8a7458', life: 1.3 })
        break
      }
    }
    // the break's sound: stone crumbles, the rest thwacks
    if (c.kind === 'block' || (c.kind === 'parapet' && c.look.material === 'stone')) sfx.crumble()
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

// (F7b) Seeing through. FLAT chunks hide nothing; a TALL one (its box
// higher than this over the table: a wall, a tree, a deck, a parapet on a
// deck) fades while Alt is held. fadeOf(m) is m's faded copy: the same
// material whose fragments are kept only where a 4×4 ordered dither's
// threshold is under FADE (6 of every 16 pixels: 37.5%, the spec's "35%"),
// so it needs no transparency sort and writes depth where it draws; made
// once per material and kept (a scuffed chunk's own material's copy is
// freed with it: free()). One program per kind of material (its cache key
// names the dither), linked the first time something is seen through.
const FLAT = new Set(['floor', 'rubble'])
const TALL = 1.0
const FADE = 0.35
const fades = new WeakMap()
const DITHER_FN = `
float seeThroughBayer2(vec2 a) { a = floor(a); return fract(a.x / 2.0 + a.y * a.y * 0.75); }
float seeThroughBayer4(vec2 a) { return seeThroughBayer2(0.5 * a) * 0.25 + seeThroughBayer2(a); }`
function fadeOf(m) {
  let f = fades.get(m)
  if (f) return f
  f = m.clone()
  f.onBeforeCompile = (sh) => {
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>${DITHER_FN}`)
      .replace('#include <dithering_fragment>', `#include <dithering_fragment>\n\tif (seeThroughBayer4(gl_FragCoord.xy) >= ${FADE.toFixed(2)}) discard;`)
  }
  f.customProgramCacheKey = () => 'see-through'
  f.userData.seeThrough = true
  fades.set(m, f)
  return f
}
// whether the segment from a to b ({ x, y, z } each) passes through box `b`
// (a Box3) short of b's end (the slab test; a point inside the box at the
// far end counts: the unit stands in it)
function segmentMeets(a, p, b) {
  let t0 = 0, t1 = 1
  for (const k of ['x', 'y', 'z']) {
    const d = p[k] - a[k]
    if (Math.abs(d) < 1e-9) {
      if (a[k] < b.min[k] || a[k] > b.max[k]) return false
      continue
    }
    let u = (b.min[k] - a[k]) / d, v = (b.max[k] - a[k]) / d
    if (u > v) [u, v] = [v, u]
    if (u > t0) t0 = u
    if (v < t1) t1 = v
    if (t0 > t1) return false
  }
  return t1 > 0
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
