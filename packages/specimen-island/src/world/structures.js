import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { concrete, planks, corrugated, paintedMetal, rustedPaint, signBoard, helipad } from './textures.js'
import { Rng } from '../core/rng.js'
import { CACHES, CRATE, ITEMS, LOOT } from '../data/items.js'
import { LORE } from '../data/lore.js'

// The preserve's tired infrastructure, built from a tiny prefab kit. A Kit is a
// local frame (position + yaw); every box it places becomes merged geometry
// (one draw call per material per prefab), a physics collider, or both.
// Prefabs register interactables — lockers, ladders, generators — and the
// gameplay behind them lives in their onUse callbacks.

let MATS = null
function mats() {
  if (MATS) return MATS
  const L = (o) => new THREE.MeshLambertMaterial(o)
  MATS = {
    concrete: L({ map: concrete() }),
    wood: L({ map: planks() }),
    darkWood: L({ map: planks([86, 66, 46]) }),
    roof: L({ map: corrugated([140, 140, 128]), side: THREE.DoubleSide }),
    rust: L({ map: corrugated([120, 96, 70]), side: THREE.DoubleSide }),
    orange: L({ map: paintedMetal([196, 106, 40]) }),
    yellow: L({ map: paintedMetal([206, 172, 58]) }),
    green: L({ map: paintedMetal([70, 98, 72]) }),
    white: L({ map: paintedMetal([206, 204, 192]) }),
    metal: L({ color: 0x4a4a48 }),
    black: L({ color: 0x1c1c1c }),
    glass: new THREE.MeshPhongMaterial({ color: 0x8ab0b8, transparent: true, opacity: 0.28, shininess: 90, depthWrite: false }),
    tank: new THREE.MeshPhongMaterial({ color: 0x6aa08a, transparent: true, opacity: 0.4, shininess: 60, depthWrite: false }),
    vine: L({ color: 0x3a6526, side: THREE.DoubleSide }),
    bulb: L({ color: 0x444033, emissive: 0x000000 }),
    helipad: L({ map: helipad() }),
    // wrecks
    rustGreen: L({ map: rustedPaint([82, 102, 70]) }),
    rustOrange: L({ map: rustedPaint([178, 100, 46]) }),
    rustWhite: L({ map: rustedPaint([200, 196, 182]) }),
    rustBlue: L({ map: rustedPaint([70, 88, 104]) }),
    tire: L({ color: 0x1a1918 }),
    seat: L({ color: 0x3a2e24 }),
    moss: L({ color: 0x4a6a2c, side: THREE.DoubleSide }),
  }
  return MATS
}

// Box with UVs scaled to its real size so textures keep their scale.
function boxGeo(w, h, d, texScale = 2) {
  const g = new THREE.BoxGeometry(w, h, d)
  const uv = g.attributes.uv
  // face order: +x, -x, +y, -y, +z, -z — 4 verts each
  const dims = [
    [d, h],
    [d, h],
    [w, d],
    [w, d],
    [w, h],
    [w, h],
  ]
  for (let f = 0; f < 6; f++) {
    for (let v = 0; v < 4; v++) {
      const i = f * 4 + v
      uv.setXY(i, (uv.getX(i) * dims[f][0]) / texScale, (uv.getY(i) * dims[f][1]) / texScale)
    }
  }
  return g
}

const M4 = new THREE.Matrix4()
const Q4 = new THREE.Quaternion()
const E4 = new THREE.Euler()
const V4 = new THREE.Vector3()
const S4 = new THREE.Vector3(1, 1, 1)

// What a kit material sounds like underfoot (player footsteps via physics.groundInfo).
const SURFACE = { wood: 'wood', darkWood: 'wood', concrete: 'concrete', helipad: 'concrete', metal: 'metal', rust: 'metal', roof: 'metal', orange: 'metal', yellow: 'metal', green: 'metal', white: 'metal', black: 'metal' }

export class Kit {
  constructor(G, x, y, z, yaw = 0, name = 'prefab') {
    this.G = G
    this.x = x
    this.y = y
    this.z = z
    this.yaw = yaw
    this.cos = Math.cos(yaw)
    this.sin = Math.sin(yaw)
    this.group = new THREE.Group()
    this.group.name = name
    this.group.position.set(x, y, z)
    this.group.rotation.y = yaw
    this.buckets = {}
    G.scene.add(this.group)
  }
  world(lx, lz) {
    return [this.x + lx * this.cos + lz * this.sin, this.z - lx * this.sin + lz * this.cos]
  }
  point(lx, ly, lz) {
    const [x, z] = this.world(lx, lz)
    return new THREE.Vector3(x, this.y + ly, z)
  }
  // ground height under a local point, relative to the kit's base
  ground(lx, lz) {
    const [x, z] = this.world(lx, lz)
    return this.G.island.heightAt(x, z) - this.y
  }
  // place a geometry in the kit's frame, then through `post` if given
  push(matKey, geo, lx, ly, lz, rx = 0, ry = 0, rz = 0, post = null) {
    M4.compose(V4.set(lx, ly, lz), Q4.setFromEuler(E4.set(rx, ry, rz)), S4)
    geo.applyMatrix4(M4)
    if (post) geo.applyMatrix4(post)
    ;(this.buckets[matKey] ||= []).push(geo)
  }
  box(w, h, d, matKey, lx, ly, lz, opts = {}) {
    const { ry = 0, rx = 0, rz = 0, collide = true, walkable = true, tex = 2 } = opts
    this.push(matKey, boxGeo(w, h, d, tex), lx, ly, lz, rx, ry, rz)
    if (collide && !rx && !rz) {
      const [x, z] = this.world(lx, lz)
      const c = this.G.physics.addBox(x, z, w / 2, d / 2, this.yaw + ry, this.y + ly - h / 2, this.y + ly + h / 2, { walkable })
      c.material = SURFACE[matKey]
    }
  }
  cyl(r, h, matKey, lx, ly, lz, opts = {}) {
    const { rTop = r, seg = 8, collide = true, rx = 0, rz = 0, open = false } = opts
    this.push(matKey, new THREE.CylinderGeometry(rTop, r, h, seg, 1, open), lx, ly, lz, rx, 0, rz)
    if (collide && !rx && !rz) {
      const [x, z] = this.world(lx, lz)
      this.G.physics.addCylinder(x, z, Math.max(r, rTop), this.y + ly - h / 2, this.y + ly + h / 2)
    }
  }
  // vertical box spanning from the ground up to `top` (posts on uneven land)
  post(w, top, matKey, lx, lz, opts = {}) {
    const g = this.ground(lx, lz) - 0.6
    const h = top - g
    this.box(w, h, w, matKey, lx, g + h / 2, lz, opts)
  }
  vines(lx, ly, lz, w, h, ry, rng) {
    const n = Math.max(2, Math.round(w * 1.4))
    for (let i = 0; i < n; i++) {
      const vx = -w / 2 + (i + rng.next()) * (w / n)
      const len = h * rng.range(0.3, 1)
      const g = new THREE.PlaneGeometry(rng.range(0.25, 0.6), len, 1, 3)
      const p = g.attributes.position
      for (let k = 0; k < p.count; k++) p.setX(k, p.getX(k) + (rng.next() - 0.5) * 0.25)
      g.translate(0, -len / 2, 0)
      M4.compose(V4.set(vx, 0, 0), Q4.identity(), S4)
      g.applyMatrix4(M4)
      this.push('vine', g, lx * 1, ly, lz, 0, ry, 0)
    }
  }
  add(obj) {
    this.group.add(obj)
    return obj
  }
  interact(def, lx, ly, lz) {
    const p = this.point(lx, ly, lz)
    return this.G.interact.add({ ...def, x: p.x, y: p.y, z: p.z })
  }
  finish() {
    const M = mats()
    for (const [key, geos] of Object.entries(this.buckets)) {
      for (const g of geos) {
        if (!g.attributes.uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2))
        if (!g.index) g.setIndex([...Array(g.attributes.position.count).keys()])
      }
      const merged = mergeGeometries(geos, false)
      for (const g of geos) g.dispose()
      const mesh = new THREE.Mesh(merged, M[key])
      mesh.castShadow = !M[key].transparent
      mesh.receiveShadow = true
      this.group.add(mesh)
    }
    this.buckets = {}
    this.group.updateMatrixWorld(true)
    return this
  }
}

// ---------------------------------------------------------------- shared bits

// What a supply crate holds, decided when it is opened from what the pack
// still has room for: a fixed bundle's items first (as much as fits), topped
// up from LOOT when most of the bundle no longer fits, else a few picks from
// LOOT favouring whatever the player is short of. Empty only if the pack is
// full, which crateRoom() tells the prompt up front.
const roomFor = (G, id) => (ITEMS[id] ? ITEMS[id].max : 99) - G.inventory.count(id)
const crateRoom = (G, fixed) => LOOT.some((e) => roomFor(G, e.item) > 0) || Object.keys(fixed?.items || {}).some((id) => roomFor(G, id) > 0)
function packCrate(G, rng, fixed) {
  const inv = G.inventory
  const items = {}
  let nominal = 0
  let got = 0
  for (const [id, n] of Object.entries(fixed?.items || {})) {
    nominal += n
    const k = Math.min(n, roomFor(G, id))
    if (k <= 0) continue
    items[id] = k
    got += k
  }
  if (nominal && got >= nominal * CRATE.bundleKeep) return items
  const pool = LOOT.filter((e) => roomFor(G, e.item) > 0 && !(e.item in items))
  let picks = rng.int(CRATE.picks[0], CRATE.picks[1])
  if (nominal) picks = Math.max(1, picks - Object.keys(items).length)
  for (; picks > 0 && pool.length; picks--) {
    const weights = pool.map((e) => {
      // ammo for a gun not found yet gets no boost for its (always empty) stack
      if (e.for && !inv.weapons.has(e.for)) return e.w * CRATE.unownedAmmo
      return e.w * (1 + CRATE.lowBoost * (1 - inv.count(e.item) / ITEMS[e.item].max))
    })
    const e = rng.weighted(pool, weights)
    pool.splice(pool.indexOf(e), 1)
    items[e.item] = Math.min(rng.int(e.n[0], e.n[1]), roomFor(G, e.item))
  }
  return items
}

// "+6 pistol darts, +1 medkit"
function lootLine(got) {
  return Object.entries(got)
    .map(([id, n]) => {
      const name = (ITEMS[id]?.name || id).toLowerCase()
      return `+${n} ${n === 1 ? name.replace(/s$/, '') : name}`
    })
    .join(', ')
}

function crate(G, kit, lx, lz, id, bundle, rng, ly = null) {
  const y = ly ?? kit.ground(lx, lz)
  const mesh = new THREE.Mesh(boxGeo(1.1, 0.75, 0.75, 1), mats().wood)
  mesh.position.set(lx, y + 0.375, lz)
  mesh.rotation.y = rng.range(-0.4, 0.4)
  mesh.castShadow = mesh.receiveShadow = true
  kit.add(mesh)
  const [wx, wz] = kit.world(lx, lz)
  G.physics.addBox(wx, wz, 0.55, 0.375, kit.yaw + mesh.rotation.y, kit.y + y, kit.y + y + 0.75, { material: 'wood' })
  kit.interact(
    {
      id,
      label: 'Search supply crate',
      hold: 0.7,
      radius: 2.2,
      // nothing it could hold fits: it stays shut for later
      enabled: (G) => (crateRoom(G, bundle) ? true : 'Pack is full — leave it for later'),
      onUse: (G) => {
        const items = packCrate(G, rng, bundle)
        const pos = mesh.getWorldPosition(new THREE.Vector3())
        if (!Object.keys(items).length) return
        const before = Object.fromEntries(Object.keys(items).map((k) => [k, G.inventory.count(k)]))
        G.inventory.grant({ items })
        const got = {}
        for (const k in items) if (G.inventory.count(k) > before[k]) got[k] = G.inventory.count(k) - before[k]
        G.toast(`Crate: ${lootLine(got)}`, 'loot')
        mesh.material = mats().darkWood
        G.audio?.play('crate', { pos })
        G.interact.remove(id)
      },
    },
    lx,
    y + 0.6,
    lz,
  )
  return mesh
}

function cache(G, kit, id, label, lx, ly, lz, opts = {}) {
  const def = CACHES[id]
  return kit.interact(
    {
      id,
      label,
      hold: opts.hold ?? 0.8,
      once: true,
      radius: 2.4,
      enabled: opts.enabled,
      onUse: (G) => {
        const lines = G.inventory.grant(def)
        if (def.flag) G.flags.set(def.flag)
        G.toast(`${opts.title || 'Collected'}: ${lines.join(', ')}`, 'loot')
        G.audio?.play('locker', { pos: new THREE.Vector3(G.player.pos.x, G.player.pos.y, G.player.pos.z) })
        opts.after?.()
      },
    },
    lx,
    ly,
    lz,
  )
}

function lore(G, kit, id, label, lx, ly, lz) {
  const entry = LORE[id]
  kit.interact(
    {
      id: 'lore:' + id,
      label,
      hold: 0,
      radius: 2.2,
      onUse: (G) => {
        G.ui?.showNote(entry)
        G.flags.set('read:' + id)
        if (entry.reveal) G.flags.set('mapRevealed')
      },
    },
    lx,
    ly,
    lz,
  )
}

// A painted board between two posts. The board is sized to its text
// (signBoard), and the posts flank its ends, clear of the lettering.
function sign(G, kit, lines, lx, lz, ry = 0, opts = {}) {
  const g = kit.ground(lx, lz)
  const { texture, width, height } = signBoard(lines, opts)
  const bottom = 1.2
  const px = width / 2 + 0.07
  for (const s of [-1, 1]) kit.post(0.14, g + bottom + height + 0.06, 'darkWood', lx + Math.cos(ry) * px * s, lz - Math.sin(ry) * px * s, { ry })
  const face = new THREE.MeshLambertMaterial({ map: texture })
  const board = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.08), [mats().darkWood, mats().darkWood, mats().darkWood, mats().darkWood, face, face])
  board.name = 'sign'
  board.position.set(lx, g + bottom + height / 2, lz)
  board.rotation.set(opts.tilt || 0.04, ry, opts.lean || 0.05)
  board.castShadow = true
  kit.add(board)
  // the board is a wall at head height between the posts
  G.physics.addBox(...kit.world(lx, lz), width / 2, 0.06, kit.yaw + ry, kit.y + g + bottom, kit.y + g + bottom + height, { walkable: false, material: 'wood' })
}

// A simple rectangular building with a doorway in the front (+Z) wall and
// windows in the sides. Returns the interior frame helpers.
function building(kit, w, d, h, opts = {}) {
  const { mat = 'concrete', roof = 'roof', cx = 0, cz = 0, door = 1.7, hole = true, rng } = opts
  const t = 0.3
  kit.box(w, 0.3, d, 'concrete', cx, 0.15, cz)
  // back wall
  kit.box(w, h, t, mat, cx, h / 2, cz - d / 2 + t / 2)
  // front wall with doorway
  const side = (w - door) / 2
  kit.box(side, h, t, mat, cx - door / 2 - side / 2, h / 2, cz + d / 2 - t / 2)
  kit.box(side, h, t, mat, cx + door / 2 + side / 2, h / 2, cz + d / 2 - t / 2)
  kit.box(door, h - 2.3, t, mat, cx, 2.3 + (h - 2.3) / 2, cz + d / 2 - t / 2)
  // side walls with a window each
  for (const sx of [-1, 1]) {
    const x = cx + sx * (w / 2 - t / 2)
    const win = Math.min(2, d * 0.3)
    const seg = (d - win) / 2
    kit.box(t, h, seg, mat, x, h / 2, cz - d / 2 + seg / 2)
    kit.box(t, h, seg, mat, x, h / 2, cz + d / 2 - seg / 2)
    kit.box(t, 1.0, win, mat, x, 0.5, cz)
    kit.box(t, h - 2.1, win, mat, x, 2.1 + (h - 2.1) / 2, cz)
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(win, 1.1), mats().glass)
    glass.position.set(x, 1.55, cz)
    glass.rotation.y = Math.PI / 2
    if (!hole || sx > 0) kit.add(glass)
  }
  // roof, with a collapsed strip when `hole`
  if (hole) {
    const gap = 1.6
    const left = w * 0.62
    kit.box(left, 0.22, d + 0.6, roof, cx - w / 2 + left / 2 - 0.3, h + 0.11, cz, { tex: 3 })
    kit.box(w - left - gap + 0.6, 0.22, d + 0.6, roof, cx + w / 2 - (w - left - gap) / 2 + 0.3, h + 0.11, cz, { tex: 3 })
    kit.box(gap + 0.4, 0.12, d * 0.5, roof, cx - w / 2 + left + gap / 2, h * 0.55, cz + d * 0.15, { rz: 0.6, collide: false, tex: 3 })
  } else {
    kit.box(w + 0.6, 0.22, d + 0.6, roof, cx, h + 0.11, cz, { tex: 3 })
  }
  if (rng) {
    kit.vines(cx - w / 4, h, cz + d / 2 + 0.05, w * 0.4, h * 0.8, 0, rng)
    kit.vines(cx + w / 2 + 0.05, h, cz - d / 4, d * 0.4, h * 0.9, Math.PI / 2, rng)
  }
}

// ---------------------------------------------------------------- prefabs

export function buildDock(G, poi, rng) {
  const [sx, sz] = poi.seaDir
  const isl = G.island
  const deckY = 1.9
  let start = 0
  for (let s = -20; s < 60; s += 0.5) {
    if (isl.heightAt(poi.x + sx * s, poi.z + sz * s) < deckY - 0.25) {
      start = s - 1.5
      break
    }
  }
  const len = 42
  const kit = new Kit(G, poi.x, 0, poi.z, Math.atan2(sx, sz), 'dock')
  const end = start + len
  // deck in sections with a few planks gone
  for (let z = start; z < end; z += 3.7) {
    const l = Math.min(3.4, end - z)
    kit.box(4, 0.25, l, 'wood', 0, deckY - 0.125, z + l / 2, { collide: false, tex: 1.5 })
  }
  G.physics.addBox(...kit.world(0, start + len / 2), 2, len / 2, kit.yaw, deckY - 0.4, deckY).material = 'wood'
  for (let z = start + 1; z <= end; z += 4) {
    for (const x of [-1.9, 1.9]) kit.cyl(0.16, 6.5, 'darkWood', x, deckY - 3, z, { collide: false, seg: 6 })
  }
  // bollards and a broken rail
  for (let z = start + 6; z < end; z += 8) kit.cyl(0.2, 0.7, 'darkWood', 2.0, deckY + 0.35, z, { seg: 6 })
  for (let z = start + 3; z < start + 20; z += 2.5) kit.box(0.1, 1.0, 0.1, 'darkWood', -1.95, deckY + 0.5, z)
  kit.box(0.08, 0.08, 17, 'darkWood', -1.95, deckY + 0.95, start + 11.5, { collide: false })
  // the boat that brought you
  const boat = new THREE.Group()
  const hull = new THREE.Mesh(boxGeo(2.4, 1.1, 6.5, 2), mats().white)
  hull.position.y = 0.45
  const cabin = new THREE.Mesh(boxGeo(1.9, 1.0, 2.2, 2), mats().orange)
  cabin.position.set(0, 1.5, -0.6)
  const bow = new THREE.Mesh(new THREE.ConeGeometry(1.2, 1.8, 4), mats().white)
  bow.rotation.set(Math.PI / 2, Math.PI / 4, 0)
  bow.scale.set(1, 1, 0.6)
  bow.position.set(0, 0.5, 4.0)
  boat.add(hull, cabin, bow)
  boat.traverse((o) => (o.castShadow = true))
  boat.position.set(3.8, 0, end - 6)
  kit.add(boat)
  G.physics.addBox(...kit.world(3.8, end - 6), 1.2, 3.25, kit.yaw, -0.5, 1.0, { material: 'metal' })
  crate(G, kit, -1, end - 9, 'crate:dock', { items: { pistolDart: 6, stone: 2 } }, rng, deckY)
  kit.box(1.2, 0.9, 1.2, 'wood', 1.0, deckY + 0.45, end - 11)
  sign(G, kit, ['SUPPLY DOCK', 'FOUNDATION PRESERVE'], 3.5, start - 3, 0)
  kit.finish()
  G.boat = boat
  // spawn on the end of the pier, looking inland
  poi.spawn = { pos: kit.point(0, deckY, end - 3), yaw: Math.atan2(sx, sz) }
  return kit
}

export function buildStation(G, poi, rng) {
  const kit = new Kit(G, poi.x, poi.y, poi.z, poi.yaw, 'station')
  building(kit, 12, 9, 3.2, { rng })
  // interior
  kit.box(1.3, 2.1, 0.6, 'green', -4.6, 1.35, -3.9)
  const door = new THREE.Mesh(boxGeo(0.65, 2.0, 0.05, 1), mats().green)
  door.position.set(-5.25, 1.35, -3.55)
  kit.add(door)
  cache(G, kit, 'stationLocker', 'Open equipment locker', -4.6, 1.3, -3.4, {
    title: 'Locker',
    after: () => {
      door.position.set(-5.4, 1.35, -3.3)
      door.rotation.y = -1.6
    },
  })
  kit.box(2.2, 0.9, 0.9, 'darkWood', 3.6, 0.75, -3.7)
  kit.box(0.5, 0.35, 0.35, 'metal', 3.2, 1.38, -3.7)
  lore(G, kit, 'stationRadio', 'Play radio log', 3.2, 1.4, -3.4)
  kit.box(2.0, 0.5, 0.9, 'darkWood', 4.9, 0.55, 1.5)
  kit.box(2.0, 0.08, 0.9, 'darkWood', 4.9, 1.6, 1.5, { collide: false })
  // map board on the back wall
  const mapBoard = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.4), new THREE.MeshLambertMaterial({ map: G.mapTexture }))
  mapBoard.position.set(0, 1.8, -4.33)
  kit.add(mapBoard)
  lore(G, kit, 'stationMap', 'Study island map', 0, 1.7, -4.0)
  // outside
  kit.box(1.6, 1.1, 1.0, 'yellow', 7.4, 0.55, -2.5)
  kit.box(0.2, 9, 0.2, 'metal', -6.6, 4.5, -3.8, { collide: true })
  kit.box(1.6, 0.06, 0.06, 'metal', -6.6, 8.6, -3.8, { collide: false })
  kit.cyl(1.0, 1.8, 'rust', 8, 3.6, 3, { seg: 10 })
  for (const [x, z] of [
    [7.4, 2.4],
    [8.6, 2.4],
    [7.4, 3.6],
    [8.6, 3.6],
  ])
    kit.box(0.12, 2.7, 0.12, 'metal', x, 1.35, z)
  sign(G, kit, ['RANGER STATION', 'ALPHA'], -3.5, 7.5, 0) // set back off the dock road's edge
  crate(G, kit, 6.2, 5.0, 'crate:station', null, rng)
  kit.finish()
  return kit
}

export function buildFieldLab(G, poi, rng, yaw) {
  const kit = new Kit(G, poi.x, poi.y, poi.z, yaw, 'fieldlab')
  // main lab
  const lab = { cx: -14, cz: -12 }
  building(kit, 20, 13, 3.8, { cx: lab.cx, cz: lab.cz, door: 2.2, rng })
  // glass partition, benches, specimen tanks
  kit.box(0.2, 3.8, 5, 'metal', lab.cx + 3, 1.9, lab.cz - 4)
  for (let i = 0; i < 3; i++) kit.box(2.6, 0.9, 0.9, 'white', lab.cx - 6 + i * 3.4, 0.75, lab.cz + 2.5)
  for (let i = 0; i < 3; i++) {
    const t = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 2.2, 12), mats().tank)
    t.position.set(lab.cx - 7 + i * 1.6, 1.4, lab.cz - 5)
    kit.add(t)
    kit.cyl(0.6, 0.25, 'metal', lab.cx - 7 + i * 1.6, 0.42, lab.cz - 5)
    kit.cyl(0.6, 0.2, 'metal', lab.cx - 7 + i * 1.6, 2.6, lab.cz - 5, { collide: false })
  }
  kit.box(1.4, 2.1, 0.6, 'orange', lab.cx + 7.5, 1.35, lab.cz - 5.8)
  cache(G, kit, 'labArmory', 'Open armory locker', lab.cx + 7.5, 1.3, lab.cz - 5.2, { title: 'Armory' })
  kit.box(1.1, 1.0, 0.7, 'metal', lab.cx + 6, 0.8, lab.cz + 4.5)
  lore(G, kit, 'labTerminal', 'Read terminal', lab.cx + 6, 1.4, lab.cz + 4.1)

  // helipad
  const pad = { x: 15, z: 7 }
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(8, 8.2, 0.35, 32), [mats().concrete, mats().helipad, mats().concrete])
  disc.position.set(pad.x, 0.17, pad.z)
  disc.receiveShadow = true
  kit.add(disc)
  G.physics.addBox(...kit.world(pad.x, pad.z), 5.8, 5.8, yaw, kit.y - 0.5, kit.y + 0.35, { material: 'concrete' })
  const padLights = []
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 4), mats().bulb.clone())
    b.position.set(pad.x + Math.cos(a) * 7.7, 0.42, pad.z + Math.sin(a) * 7.7)
    kit.add(b)
    padLights.push(b)
  }
  // fuel pump
  kit.box(0.9, 1.6, 0.7, 'yellow', pad.x + 10, 0.8, pad.z - 5)
  kit.box(0.3, 0.3, 0.3, 'black', pad.x + 10, 1.3, pad.z - 4.6, { collide: false })
  poi.pad = kit.point(pad.x, 0.35, pad.z)
  poi.padYaw = yaw + Math.PI * 0.75
  // The pad's service point, for whatever vehicle is parked on or by the pad:
  // a full tank and a sound hull. It names what it will service.
  const atPad = () => (G.vehicles || []).filter((v) => !v.occupied && v.pos.distanceTo(poi.pad) <= v.tune.serviceRange)
  const names = (list) => list.map((v) => v.tune.name).join(' + ')
  const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1)
  kit.interact(
    {
      id: 'fuelPump',
      label: () => {
        const here = atPad()
        const todo = here.filter((v) => v.needsService())
        if (!todo.length) return here.length ? `${cap(names(here))} ready — nothing to service` : 'Vehicle service pump'
        return `Service ${names(todo)} (${todo.some((v) => v === G.heli) ? 'refuel + repair' : 'repair'})`
      },
      hold: 2.5,
      radius: 2.4,
      enabled: (G) => {
        if (!G.flags.get('labPower')) return 'Pump is dead — no power'
        const here = atPad()
        if (!here.length) return 'Bring a vehicle onto the pad'
        if (!here.some((v) => v.needsService())) return 'Nothing to service'
        return true
      },
      onUse: (G) => {
        const done = []
        let repaired = false
        let heli = false
        for (const v of atPad()) {
          if (!v.needsService()) continue
          const hurt = v.health < v.tune.hull
          repaired ||= hurt
          v.service()
          if (v === G.heli) {
            heli = true
            G.flags.set('heliFueled')
            done.push(hurt ? 'helicopter repaired and refuelled' : 'helicopter refuelled')
          } else done.push(`${v.tune.name} repaired to 100%`)
        }
        G.toast(`${cap(done.join(', '))}.${heli ? ' Climb aboard with E.' : ''}`, 'info')
        G.audio?.play('pump', { pos: poi.pad })
        if (repaired) G.audio?.play('repair', { pos: poi.pad })
      },
    },
    pad.x + 10,
    1.2,
    pad.z - 4.4,
  )

  // hangar
  const hg = { cx: 15, cz: -16 }
  kit.box(14, 0.25, 10, 'concrete', hg.cx, 0.12, hg.cz)
  kit.box(14, 5, 0.25, 'rust', hg.cx, 2.5, hg.cz - 5, { tex: 3 })
  kit.box(0.25, 5, 10, 'rust', hg.cx - 7, 2.5, hg.cz, { tex: 3 })
  kit.box(0.25, 5, 6, 'rust', hg.cx + 7, 2.5, hg.cz - 2, { tex: 3 })
  for (const x of [-7, 7]) kit.box(0.3, 5, 0.3, 'metal', hg.cx + x, 2.5, hg.cz + 5)
  kit.box(14.6, 0.15, 10.6, 'rust', hg.cx, 5.1, hg.cz, { tex: 3, rx: 0.04 })
  kit.box(3, 0.9, 1, 'darkWood', hg.cx - 4, 0.7, hg.cz - 4.2)
  lore(G, kit, 'hangarClipboard', 'Read clipboard', hg.cx - 4, 1.3, hg.cz - 3.8)
  for (let i = 0; i < 4; i++) kit.cyl(0.32, 0.9, i % 2 ? 'orange' : 'rust', hg.cx + 4 + (i % 2) * 0.7, 0.7, hg.cz - 3.8 + Math.floor(i / 2) * 0.7, { seg: 10 })
  const hc = new THREE.Mesh(boxGeo(1.4, 0.9, 0.9, 1), mats().green)
  hc.position.set(hg.cx + 1, 0.7, hg.cz - 3.6)
  kit.add(hc)
  G.physics.addBox(...kit.world(hg.cx + 1, hg.cz - 3.6), 0.7, 0.45, yaw, poi.y, poi.y + 1.15, { material: 'metal' })
  cache(G, kit, 'hangarCrate', 'Search parts crate', hg.cx + 1, 1.2, hg.cz - 3.0, { title: 'Parts crate', hold: 1.0 })

  // generator shed
  const gs = { cx: -16, cz: 10 }
  for (const [x, z] of [
    [-2.2, -1.6],
    [2.2, -1.6],
    [-2.2, 1.6],
    [2.2, 1.6],
  ])
    kit.box(0.2, 3, 0.2, 'metal', gs.cx + x, 1.5, gs.cz + z)
  kit.box(5.2, 0.12, 4, 'rust', gs.cx, 3.05, gs.cz, { tex: 3 })
  kit.box(4.6, 0.2, 3.4, 'concrete', gs.cx, 0.1, gs.cz)
  kit.box(2.2, 1.3, 1.1, 'green', gs.cx, 0.85, gs.cz)
  kit.cyl(0.08, 1.4, 'black', gs.cx + 0.8, 2.1, gs.cz - 0.3, { collide: false })
  const genLamp = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 4), mats().bulb.clone())
  genLamp.position.set(gs.cx - 0.8, 1.55, gs.cz + 0.56)
  kit.add(genLamp)
  poi.generator = kit.point(gs.cx, 1, gs.cz)
  kit.interact(
    {
      id: 'labGenerator',
      label: () => (G.flags.get('labPower') ? 'Generator running' : 'Fuel & start generator'),
      hold: 3,
      radius: 2.6,
      enabled: (G) => {
        if (G.flags.get('labPower')) return 'Already running'
        if (!G.inventory.has('fuelcan')) return 'Needs a fuel can'
        return true
      },
      onUse: (G) => {
        G.inventory.take('fuelcan')
        G.flags.set('labPower')
        G.toast('The generator coughs into life. The lab has power.', 'info')
      },
    },
    gs.cx,
    1.2,
    gs.cz + 0.9,
  )

  // light poles + power-on behaviour, clear of the roads that meet at the
  // yard's centre and leave along its +Z axis
  const bulbs = [genLamp, ...padLights]
  const lights = []
  for (const [x, z] of [
    [-6, -1],
    [-4, -20],
    [24, -6],
    [-6, 16],
  ]) {
    kit.cyl(0.12, 7, 'metal', x, 3.5, z, { seg: 6 })
    kit.box(1.2, 0.08, 0.08, 'metal', x + 0.5, 6.9, z, { collide: false })
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 6), mats().bulb.clone())
    b.position.set(x + 1.0, 6.75, z)
    kit.add(b)
    bulbs.push(b)
  }
  for (const [x, z] of [
    [-5, -1],
    [15, 7],
  ]) {
    const l = new THREE.PointLight(0xffd8a0, 0, 26, 1.6)
    l.position.set(x, 6.5, z)
    kit.add(l)
    lights.push(l)
  }
  G.events.on('flag', ({ flag }) => {
    if (flag !== 'labPower') return
    for (const b of bulbs) b.material.emissive.setHex(0xffcc77)
    for (const l of lights) l.intensity = 40
    G.audio?.loopAt('generator', poi.generator)
  })

  // water tower, fence, sign
  for (const [x, z] of [
    [-1.4, -1.4],
    [1.4, -1.4],
    [-1.4, 1.4],
    [1.4, 1.4],
  ])
    kit.box(0.2, 6, 0.2, 'metal', -30 + x, 3, 18 + z)
  kit.cyl(2.2, 3, 'rust', -30, 7.5, 18, { seg: 12 })
  // the back fence: a walk-through gap, and a gate wherever a road crosses it
  const onRoad = (lx, lz) => G.island.sample(G.island.road, ...kit.world(lx, lz)) > 0.02
  const open = (i) => i < 0 || i > 8 || i === 3 || [0, 1.5, 3, 4.5, 6].some((t) => onRoad(-36 + i * 6 + t, -30))
  for (let i = 0; i < 9; i++) {
    const x = -36 + i * 6
    if (!open(i) || !open(i - 1)) kit.post(0.12, 2.2, 'metal', x, -30)
    if (open(i)) continue
    kit.box(6, 2, 0.05, 'roof', x + 3, kit.ground(x + 3, -30) + 1.2, -30, { tex: 1, collide: i !== 8 })
  }
  sign(G, kit, ['FOUNDATION FIELD LAB', 'AUTHORIZED PERSONNEL ONLY'], 6, 28, 0, { bg: '#2f4a3a' })
  crate(G, kit, 22, -24, 'crate:lab', null, rng)
  kit.finish()
  return kit
}

export function buildTower(G, poi, rng, yaw) {
  const kit = new Kit(G, poi.x, poi.y, poi.z, yaw, 'tower')
  const top = 8
  for (const [x, z] of [
    [-1.8, -1.8],
    [1.8, -1.8],
    [-1.8, 1.8],
    [1.8, 1.8],
  ]) {
    kit.post(0.3, top + 3, 'darkWood', x, z)
  }
  for (const y of [2.5, 5.5]) {
    kit.box(3.6, 0.15, 0.15, 'darkWood', 0, y, -1.8, { rz: 0.5, collide: false })
    kit.box(0.15, 0.15, 3.6, 'darkWood', 1.8, y, 0, { rx: 0.5, collide: false })
    kit.box(0.15, 0.15, 3.6, 'darkWood', -1.8, y, 0, { rx: -0.5, collide: false })
  }
  kit.box(4.4, 0.25, 4.4, 'wood', 0, top, 0)
  // railings with a gap for the ladder
  kit.box(4.4, 1.0, 0.1, 'darkWood', 0, top + 0.6, -2.15)
  kit.box(0.1, 1.0, 4.4, 'darkWood', -2.15, top + 0.6, 0)
  kit.box(0.1, 1.0, 4.4, 'darkWood', 2.15, top + 0.6, 0)
  kit.box(1.4, 1.0, 0.1, 'darkWood', -1.5, top + 0.6, 2.15)
  kit.box(1.4, 1.0, 0.1, 'darkWood', 1.5, top + 0.6, 2.15)
  kit.box(5, 0.15, 5, 'rust', 0, top + 2.9, 0, { rx: 0.08, tex: 3 })
  // ladder
  for (const x of [-0.35, 0.35]) kit.box(0.08, top + 1, 0.08, 'metal', x, top / 2, 2.35, { collide: false })
  for (let y = 0.4; y < top; y += 0.4) kit.box(0.7, 0.04, 0.04, 'metal', 0, y, 2.35, { collide: false })
  kit.box(0.2, 0.5, 0.2, 'black', 1.4, top + 1.1, -1.4, { collide: false })
  kit.interact(
    {
      id: 'climb:' + poi.id,
      label: 'Climb ladder',
      hold: 0,
      radius: 2.0,
      onUse: (G) => G.player.teleport(kit.point(0, top + 0.15, 1.0), null, 0.9),
    },
    0,
    1.2,
    2.8,
  )
  kit.interact(
    {
      id: 'descend:' + poi.id,
      label: 'Climb down',
      hold: 0,
      radius: 1.6,
      onUse: (G) => G.player.teleport(kit.point(0, kit.ground(0, 3.4) + 0.05, 3.4), null, 0.9),
    },
    0,
    top + 1.0,
    1.7,
  )
  crate(G, kit, -1.2, -1.2, 'crate:' + poi.id, null, rng, top + 0.125)
  lore(G, kit, 'tower:' + poi.id, 'Read field notes', 1.3, top + 1.0, 1.3)
  kit.finish()
  return kit
}

export function buildPaddock(G, poi, rng) {
  const kit = new Kit(G, poi.x, 0, poi.z, 0, 'paddock')
  // radius, sides and gate segment come from data/world.js, where the road
  // reads them too so it ends outside the gate
  const { radius: R, sides, gate: gateSeg } = poi.def.fence
  const postGeo = []
  for (let k = 0; k < sides; k++) {
    const a0 = (k / sides) * Math.PI * 2
    const a1 = ((k + 1) / sides) * Math.PI * 2
    const x0 = Math.cos(a0) * R
    const z0 = Math.sin(a0) * R
    const x1 = Math.cos(a1) * R
    const z1 = Math.sin(a1) * R
    const gate = k === gateSeg
    const broken = !gate && (rng.chance(0.3) || k === (gateSeg + 8) % sides)
    const len = Math.hypot(x1 - x0, z1 - z0)
    const spans = Math.ceil(len / 4.5)
    const ry = -Math.atan2(z1 - z0, x1 - x0)
    for (let s = 0; s < spans; s++) {
      const t0 = s / spans
      const t1 = (s + 1) / spans
      const px = x0 + (x1 - x0) * t0
      const pz = z0 + (z1 - z0) * t0
      const qx = x0 + (x1 - x0) * t1
      const qz = z0 + (z1 - z0) * t1
      const g0 = kit.ground(px, pz)
      const g1 = kit.ground(qx, qz)
      const lean = broken && rng.chance(0.5) ? rng.range(0.3, 1.2) : 0
      if (lean) kit.box(0.28, 4.2, 0.28, 'concrete', px, g0 + 1.6, pz, { rx: lean * rng.sign(), ry, collide: false })
      else kit.box(0.28, 4.6, 0.28, 'concrete', px, g0 + 1.7, pz, { ry })
      postGeo.push([px, pz])
      if (gate && s === Math.floor(spans / 2)) continue
      if (broken && rng.chance(0.75)) continue
      const mx = (px + qx) / 2
      const mz = (pz + qz) / 2
      const gm = (g0 + g1) / 2
      const slope = Math.atan2(g1 - g0, Math.hypot(qx - px, qz - pz))
      for (let w = 0; w < 4; w++) {
        kit.box(Math.hypot(qx - px, qz - pz), 0.03, 0.03, 'metal', mx, gm + 0.6 + w * 0.9, mz, { ry, rz: slope, collide: false })
      }
      const [wx, wz] = kit.world(mx, mz)
      G.physics.addBox(wx, wz, Math.hypot(qx - px, qz - pz) / 2, 0.12, ry, Math.min(g0, g1) - 0.5, Math.max(g0, g1) + 3.6, { walkable: false, tag: 'fence' })
    }
  }
  // gate signage and a feeding trough
  const ga = ((gateSeg + 0.5) / sides) * Math.PI * 2
  sign(G, kit, ['PADDOCK C', 'DANGER 10,000 V'], Math.cos(ga) * (R + 4), Math.sin(ga) * (R + 4), -ga + Math.PI / 2, { bg: '#8a6a20', fg: '#1a1a1a' })
  const tx = 8
  const tz = 6
  kit.box(5, 0.8, 1.4, 'concrete', tx, kit.ground(tx, tz) + 0.3, tz)
  kit.box(3, 3.5, 3, 'rust', -10, kit.ground(-10, -6) + 1.6, -6, { ry: 0.4, tex: 3 })
  crate(G, kit, -12.5, -3.5, 'crate:paddock', { items: { rifleDart: 4, flare: 1 } }, rng)
  kit.finish()
  return kit
}

export function buildRelay(G, poi, rng) {
  const kit = new Kit(G, poi.x, poi.y, poi.z, rng.range(0, 6), 'relay')
  building(kit, 5, 4, 2.8, { hole: false })
  cache(G, kit, 'relayHut', 'Search supply shelf', 0, 1.0, -1.4, { title: 'Shelf' })
  lore(G, kit, 'relayLog', 'Read maintenance log', 1.6, 1.2, -1.2)
  // lattice mast
  const mx = 6
  const mz = 0
  const H = 22
  for (const [x, z] of [
    [-0.8, -0.8],
    [0.8, -0.8],
    [-0.8, 0.8],
    [0.8, 0.8],
  ]) {
    kit.post(0.12, H, 'white', mx + x, mz + z)
  }
  for (let y = 1.5; y < H; y += 2.2) {
    kit.box(1.6, 0.06, 0.06, 'white', mx, y, mz - 0.8, { collide: false, rz: 0.9 })
    kit.box(1.6, 0.06, 0.06, 'white', mx, y, mz + 0.8, { collide: false, rz: -0.9 })
    kit.box(0.06, 0.06, 1.6, 'white', mx - 0.8, y + 1.1, mz, { collide: false, rx: 0.9 })
    kit.box(0.06, 0.06, 1.6, 'white', mx + 0.8, y + 1.1, mz, { collide: false, rx: -0.9 })
  }
  kit.cyl(1.0, 0.2, 'white', mx, H - 3, mz + 1.1, { rx: 1.4, collide: false, seg: 14 })
  const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 6), mats().bulb.clone())
  beacon.position.set(mx, H + 0.3, mz)
  kit.add(beacon)
  kit.box(0.8, 1.2, 0.5, 'metal', mx, 0.9, mz + 1.3)
  poi.relay = kit.point(mx, 1, mz + 1.6)
  kit.interact(
    {
      id: 'relay',
      label: () => (G.flags.get('relayFixed') ? 'Relay online' : 'Repair relay junction'),
      hold: 4,
      radius: 2.4,
      enabled: (G) => (G.flags.get('relayFixed') ? 'Already repaired' : true),
      onUse: (G) => {
        G.flags.set('relayFixed')
        beacon.material.emissive.setHex(0xff3020)
        G.toast('Relay online. Old collar frequencies are coming through.', 'info')
      },
    },
    mx,
    1.3,
    mz + 1.7,
  )
  kit.finish()
  return kit
}

// A plank road bridge. Island.buildRoads levels the road on both banks to the
// deck height and measures the span between them, so the deck rests on the
// road at each end; concrete abutments hold it where the banks fall away.
export function buildBridge(G, b, rng) {
  const kit = new Kit(G, b.x, b.y, b.z, b.yaw, 'bridge')
  const L = b.length
  // planks, a few missing mid-span (the walkable deck below is continuous)
  for (let z = -L / 2; z < L / 2 - 0.05; z += 1.2) {
    const l = Math.min(1.0, L / 2 - z)
    if (Math.abs(z) < L / 2 - 5 && rng.chance(0.06)) continue
    kit.box(4.6, 0.18, l, 'wood', 0, -0.09, z + l / 2, { collide: false, tex: 1.5 })
  }
  G.physics.addBox(b.x, b.z, 2.3, L / 2, b.yaw, b.y - 0.5, b.y, { material: 'wood' })
  for (const x of [-2.4, 2.4]) {
    kit.box(0.4, 0.5, L, 'darkWood', x, -0.4, 0, { collide: false })
    for (let z = -L / 2; z <= L / 2; z += 3) kit.box(0.12, 1.1, 0.12, 'darkWood', x, 0.55, z)
    kit.box(0.1, 0.1, L, 'darkWood', x, 1.05, 0, { collide: false })
    G.physics.addBox(...kit.world(x, 0), 0.08, L / 2, b.yaw, b.y, b.y + 1.1, { walkable: false, material: 'wood' })
  }
  // abutments where each bank starts to drop away under the deck
  const local = (x, z) => {
    const dx = x - b.x
    const dz = z - b.z
    return [dx * kit.cos - dz * kit.sin, dx * kit.sin + dz * kit.cos]
  }
  const seats = (b.ends || []).map((e) => local(e.x, e.z)[1])
  for (const lz of seats) {
    const toward = -Math.sign(lz) // toward mid-span
    const cz = lz + toward * 0.7
    let low = Infinity
    for (const x of [-2.7, 0, 2.7]) for (const dz of [-0.7, 0.7]) low = Math.min(low, kit.ground(x, cz + dz))
    const top = -0.18
    const bottom = low - 0.6
    if (top - bottom > 0.3) kit.box(5.6, top - bottom, 1.4, 'concrete', 0, (top + bottom) / 2, cz, { tex: 2 })
  }
  // a bank that never came up to deck height gets a plank ramp down to it
  ;(b.ends || []).forEach((e, i) => {
    if (e.solid) return
    const out = Math.sign(seats[i]) || 1
    const z0 = (out * L) / 2
    const drop = Math.max(0, -kit.ground(0, z0 + out * 2))
    if (drop < 0.3) return
    const run = drop * 4
    const n = Math.ceil(run / 0.8)
    for (let k = 0; k < n; k++) {
      const top = b.y - (drop * (k + 1)) / n
      G.physics.addBox(...kit.world(0, z0 + out * (k + 0.5) * (run / n)), 2.3, run / n / 2, b.yaw, top - 0.5, top, { material: 'wood' })
    }
    kit.box(4.6, 0.18, Math.hypot(run, drop), 'wood', 0, -drop / 2 - 0.09, z0 + (out * run) / 2, { rx: out * Math.atan2(drop, run), collide: false, tex: 1.5 })
  })
  // trestle piers between the abutments wherever the deck stands clear
  const span = seats.length === 2 ? Math.abs(seats[0] - seats[1]) : L - 8
  const mid = seats.length === 2 ? (seats[0] + seats[1]) / 2 : 0
  const bays = Math.max(1, Math.round(span / 9))
  for (let i = 1; i < bays; i++) {
    const z = mid - span / 2 + (i * span) / bays
    let low = Infinity
    for (const x of [-2.2, 2.2]) {
      const g = kit.ground(x, z)
      low = Math.min(low, g)
      if (g > -0.8) continue
      kit.box(0.4, -g + 0.5, 0.4, 'darkWood', x, g / 2 - 0.25, z, { collide: true })
    }
    if (low < -1.2) kit.box(4.8, 0.25, 0.3, 'darkWood', 0, -0.78, z, { collide: false })
  }
  kit.finish()
  return kit
}

// Abandoned vehicles at real scale: the station's expedition 4x4 (≈4.4 m,
// hardtop or open with a roll bar) and an old flatbed supply truck (≈6 m).
// Each sits on the slope under its wheels and has lost or broken a wheel, so
// the body also drops on that corner; everything above the chassis is pushed
// through one tilt matrix so the parts stay together. Colliders are the
// untilted footprints. The site (a dry, level verge cleared of trees) comes
// from Island.placeWrecks; `roadSide` is the local x side the road lies on.
const WRECKS = {
  jeep: {
    length: 4.4,
    width: 1.9,
    wheelR: 0.44,
    axles: [1.32, -1.22],
    track: 0.8,
    paints: ['rustGreen', 'rustOrange', 'rustWhite'],
  },
  truck: {
    length: 6.0,
    width: 2.2,
    wheelR: 0.48,
    axles: [2.0, -1.55],
    track: 0.86,
    paints: ['rustBlue', 'rustGreen', 'rustOrange'],
  },
}

export function buildWreck(G, x, z, yaw, rng, withCrate, kind = 'jeep', roadSide = 1) {
  const spec = WRECKS[kind]
  const isl = G.island
  // sit on the four wheel contact points: their average height, and the
  // pitch and roll of the ground under them
  const cs = Math.cos(yaw)
  const sn = Math.sin(yaw)
  const [a0, a1] = spec.axles
  const contact = (sx, az) => isl.heightAt(x + sx * spec.track * cs + az * sn, z - sx * spec.track * sn + az * cs)
  const fl = contact(-1, a0)
  const fr = contact(1, a0)
  const rl = contact(-1, a1)
  const rr = contact(1, a1)
  const gy = (fl + fr + rl + rr) / 4
  const slopeZ = Math.atan2((fr + rr - fl - rl) / 2, spec.track * 2)
  const slopeX = -Math.atan2((fl + fr - rl - rr) / 2, a0 - a1)
  const kit = new Kit(G, x, gy - 0.04, z, yaw, 'wreck')
  const paint = rng.pick(spec.paints)
  // which corner gave out: [side -1 left / +1 right, axle 0 front / 1 rear]
  const lostSide = rng.sign()
  const lostAxle = rng.int(0, 1)
  const drop = kind === 'jeep' ? 0.3 : 0.22
  const tiltZ = lostSide < 0 ? drop / (spec.track * 2) : -drop / (spec.track * 2)
  const tiltX = (lostAxle === 0 ? 1 : -1) * (drop / (spec.axles[0] - spec.axles[1])) * 0.9
  const TILT = new THREE.Matrix4()
    .makeRotationFromEuler(new THREE.Euler(slopeX, 0, slopeZ))
    .multiply(new THREE.Matrix4().compose(new THREE.Vector3(0, -drop * 0.35, 0), new THREE.Quaternion().setFromEuler(new THREE.Euler(tiltX, 0, tiltZ)), new THREE.Vector3(1, 1, 1)))
  const part = (mat, geo, lx, ly, lz, rx = 0, ry = 0, rz = 0, tilted = true) => kit.push(mat, geo, lx, ly, lz, rx, ry, rz, tilted ? TILT : null)
  const box = (w, h, d, mat, lx, ly, lz, rx = 0, ry = 0, rz = 0, tex = 2) => part(mat, boxGeo(w, h, d, tex), lx, ly, lz, rx, ry, rz)
  const wheel = (r, w, lx, ly, lz, rz = Math.PI / 2, rx = 0, tilted = true) => {
    part('tire', new THREE.CylinderGeometry(r, r, w, 14), lx, ly, lz, rx, 0, rz, tilted)
    part('metal', new THREE.CylinderGeometry(r * 0.55, r * 0.55, w + 0.02, 8), lx, ly, lz, rx, 0, rz, tilted)
  }
  // the wheels: one gone (lying in the grass nearby), one buckled
  const R = spec.wheelR
  const wheels = []
  spec.axles.forEach((az, ai) => {
    for (const sx of [-1, 1]) wheels.push({ sx, az, ai, lost: sx === lostSide && ai === lostAxle })
  })
  const buckled = wheels.find((w) => !w.lost && w.ai !== lostAxle && w.sx === -lostSide) || wheels[0]
  for (const w of wheels) {
    if (w.lost) {
      // bare hub resting on the ground
      part('metal', new THREE.CylinderGeometry(0.16, 0.16, 0.2, 8), w.sx * (spec.track - 0.05), R - 0.05, w.az, 0, 0, Math.PI / 2)
      continue
    }
    const camber = w === buckled ? -w.sx * 0.32 : 0
    const tw = kind === 'truck' && w.ai === 1 ? 0.3 : 0.32
    wheel(R, tw, w.sx * spec.track, R, w.az, Math.PI / 2 + camber)
    // dual rear wheels on the truck (the outer one on the lost corner went too)
    if (kind === 'truck' && w.ai === 1) wheel(R, tw, w.sx * (spec.track + 0.32), R, w.az)
  }
  {
    // the missing wheel, lying flat or leaning on the body — close in on the
    // road side, so it never lies on the carriageway
    const lx = lostSide * (spec.width / 2 + (lostSide === roadSide ? rng.range(0.45, 0.7) : rng.range(0.9, 1.8)))
    const lz = spec.axles[lostAxle] + rng.range(-0.8, 0.8)
    const g = kit.ground(lx, lz)
    if (rng.chance(0.5)) wheel(R, 0.3, lx, g + 0.16, lz, 0, 0, false)
    else wheel(R, 0.3, lostSide * (spec.width / 2 + 0.25), g + R + 0.02, lz, Math.PI / 2 + lostSide * 0.35, 0, false)
  }

  const body = kind === 'jeep' ? buildJeepBody(box, part, paint, rng) : buildTruckBody(box, part, paint, rng)

  // overgrowth: vines over the edges, moss on flat panels, weeds round the base
  const top = kind === 'jeep' ? 1.2 : 2.45
  for (let i = 0; i < (kind === 'jeep' ? 7 : 11); i++) {
    const side = rng.sign()
    const lz = rng.range(-spec.length / 2 + 0.3, spec.length / 2 - 0.3)
    const len = rng.range(0.4, kind === 'jeep' ? 0.9 : 1.6)
    const g = new THREE.PlaneGeometry(rng.range(0.18, 0.4), len, 1, 3)
    const p = g.attributes.position
    for (let k = 0; k < p.count; k++) p.setX(k, p.getX(k) + (rng.next() - 0.5) * 0.2)
    g.translate(0, -len / 2, 0)
    part('vine', g, side * (spec.width / 2 + 0.03), (kind === 'truck' && rng.chance(0.5) ? 1.6 : top) + 0.02, lz, 0, Math.PI / 2, 0)
  }
  for (let i = 0; i < 4; i++) {
    const g = new THREE.CircleGeometry(rng.range(0.2, 0.45), 6)
    const [my, mz, mr] = kind === 'jeep' ? [1.265, 1.4, 0.55] : [2.505, 1.2, 0.4]
    part('moss', g, rng.range(-0.6, 0.6), my + i * 0.002, mz + rng.range(-mr, mr), -Math.PI / 2, 0, 0)
  }
  // tufts of tall grass blades round the base
  const blades = []
  for (let i = 0; i < 18; i++) {
    const a = rng.range(0, Math.PI * 2)
    const tx = Math.cos(a) * (spec.width / 2 + rng.range(-0.15, 0.4))
    const tz = Math.sin(a) * (spec.length / 2 + rng.range(-0.3, 0.3))
    const ty = kit.ground(tx, tz) - 0.03
    for (let k = 0; k < 7; k++) {
      const ba = rng.range(0, Math.PI * 2)
      const h = rng.range(0.4, 1.0)
      const lean = rng.range(0.05, 0.35)
      const w = 0.045
      const bx = tx + rng.range(-0.15, 0.15)
      const bz = tz + rng.range(-0.15, 0.15)
      blades.push(bx - Math.sin(ba) * w, ty, bz + Math.cos(ba) * w, bx + Math.sin(ba) * w, ty, bz - Math.cos(ba) * w, bx + Math.cos(ba) * lean, ty + h, bz + Math.sin(ba) * lean)
    }
  }
  const grass = new THREE.BufferGeometry()
  grass.setAttribute('position', new THREE.Float32BufferAttribute(blades, 3))
  grass.computeVertexNormals()
  part('moss', grass, 0, 0, 0, 0, 0, 0, false)

  // colliders: the untilted footprint of each block (painted steel
  // underfoot, but for the truck's plank bed), thin walls for the frames
  const P = G.physics
  const col = (lx, lz, hx, hz, y0, y1, material = 'metal', walkable = true) => P.addBox(...kit.world(lx, lz), hx, hz, yaw, kit.y + y0, kit.y + y1, { material, walkable })
  let crateAt = [-roadSide * (spec.width / 2 + 1.1), -0.5, null]
  if (kind === 'jeep') {
    col(0, 0.05, 0.95, 2.2, -0.3, 1.18)
    if (body.hardtop) col(0, -0.78, 0.95, 1.36, 1.18, 1.95)
    else {
      col(0, 0.55, 0.91, 0.05, 1.18, 1.83, 'metal', false) // windscreen frame
      col(0, -0.42, 0.68, 0.08, 1.18, 1.83, 'metal', false) // seat backs
      col(0, -0.75, 0.89, 0.05, 1.18, 2.04, 'metal', false) // roll bar
    }
  } else {
    col(0, 2.45, 0.85, 0.6, -0.3, 1.45) // bonnet
    col(0, 1.2, 1.0, 0.68, -0.3, 2.4) // cab
    col(0, -1.3, 1.1, 1.85, -0.3, 1.24, 'wood') // bed
    P.addCylinder(...kit.world(0.6, -2.6), 0.1, kit.y + 1.24, kit.y + 2.8) // the sapling
    // on the bed, wherever the tilt has left it
    const onBed = new THREE.Vector3(rng.range(-0.3, 0.3), 1.25, -1.9).applyMatrix4(TILT)
    crateAt = [onBed.x, onBed.z, onBed.y]
  }
  if (withCrate) crate(G, kit, crateAt[0], crateAt[1], `crate:wreck:${Math.round(x)}:${Math.round(z)}`, null, rng, crateAt[2])
  kit.finish()
  return kit
}

function buildJeepBody(box, part, paint, rng) {
  // chassis and the tub below the beltline, with open wheel arches
  box(0.14, 0.2, 4.0, 'black', -0.45, 0.48, 0.05)
  box(0.14, 0.2, 4.0, 'black', 0.45, 0.48, 0.05)
  box(1.3, 0.5, 4.3, paint, 0, 0.73, 0.05)
  for (const sx of [-1, 1]) {
    box(0.3, 0.5, 1.5, paint, sx * 0.8, 0.73, 0.05) // sills between the arches
    box(0.3, 0.5, 0.36, paint, sx * 0.8, 0.73, 2.02)
    box(0.3, 0.5, 0.36, paint, sx * 0.8, 0.73, -1.92)
  }
  // beltline, flat-topped wings and bonnet
  box(1.9, 0.22, 4.3, paint, 0, 1.09, 0.05)
  box(1.6, 0.06, 1.55, rng.chance(0.4) ? 'rust' : paint, 0, 1.23, 1.4, -0.02, 0, 0, 1.5)
  // grille, lamps, bumpers
  box(1.3, 0.42, 0.06, 'metal', 0, 0.94, 2.21)
  for (const sx of [-1, 1]) part('glass', new THREE.CylinderGeometry(0.1, 0.1, 0.06, 10), sx * 0.66, 0.98, 2.22, Math.PI / 2, 0, 0)
  box(1.95, 0.16, 0.18, 'black', 0, 0.52, 2.3)
  box(1.9, 0.16, 0.16, 'black', 0, 0.52, -2.18)
  // windscreen frame (the glass long gone, a shard left in one corner)
  for (const sx of [-1, 1]) box(0.06, 0.62, 0.06, 'black', sx * 0.88, 1.5, 0.58, -0.18)
  box(1.82, 0.06, 0.06, 'black', 0, 1.8, 0.53, -0.18)
  part('glass', new THREE.PlaneGeometry(0.6, 0.35), -0.5, 1.37, 0.6, -0.18, 0, 0.2)
  // seats and wheel
  for (const sx of [-1, 1]) {
    box(0.52, 0.18, 0.5, 'seat', sx * 0.42, 1.27, -0.15)
    box(0.52, 0.55, 0.12, 'seat', sx * 0.42, 1.55, -0.42, -0.12)
  }
  part('black', new THREE.TorusGeometry(0.19, 0.025, 4, 12), -0.42, 1.52, 0.28, -0.9, 0, 0)
  const hardtop = rng.chance(0.5)
  if (hardtop) {
    // hardtop: pillars, roof and a solid rear tub
    for (const sx of [-1, 1]) {
      box(0.08, 0.66, 0.08, 'rustWhite', sx * 0.9, 1.53, -0.6)
      box(0.08, 0.66, 0.08, 'rustWhite', sx * 0.9, 1.53, -2.08)
      box(0.04, 0.42, 1.38, 'rustWhite', sx * 0.92, 1.42, -1.34) // lower rear quarter
    }
    box(1.9, 0.08, 2.75, 'rustWhite', 0, 1.9, -0.75, 0.01)
    box(1.84, 0.62, 0.05, 'rustWhite', 0, 1.53, -2.15)
  } else {
    // open, with a roll bar braced to the rear corners
    for (const sx of [-1, 1]) {
      box(0.08, 0.82, 0.08, 'black', sx * 0.85, 1.6, -0.75)
      box(0.07, 0.07, 1.45, 'black', sx * 0.85, 1.6, -1.42, -0.5)
    }
    box(1.78, 0.08, 0.08, 'black', 0, 2.0, -0.75)
  }
  // spare wheel on the tailgate
  part('tire', new THREE.CylinderGeometry(0.42, 0.42, 0.26, 14), 0, 1.25, -2.36, Math.PI / 2, 0, 0)
  return { hardtop }
}

function buildTruckBody(box, part, paint, rng) {
  box(0.16, 0.24, 5.6, 'black', -0.5, 0.62, -0.1)
  box(0.16, 0.24, 5.6, 'black', 0.5, 0.62, -0.1)
  // bonnet and front wings over the front wheels
  box(1.5, 0.6, 1.15, paint, 0, 1.2, 2.45)
  for (const sx of [-1, 1]) box(0.36, 0.2, 1.25, paint, sx * 0.9, 1.14, 2.05)
  box(1.4, 0.5, 0.06, 'metal', 0, 1.15, 3.04)
  box(2.1, 0.2, 0.22, 'black', 0, 0.66, 3.08)
  for (const sx of [-1, 1]) part('glass', new THREE.CylinderGeometry(0.11, 0.11, 0.08, 10), sx * 0.9, 1.32, 2.68, Math.PI / 2, 0, 0)
  // cab: dark window bands where the glass is grimed or gone
  box(2.0, 1.45, 1.35, paint, 0, 1.7, 1.2)
  box(1.8, 0.55, 0.04, 'black', 0, 2.05, 1.89)
  for (const sx of [-1, 1]) box(0.04, 0.5, 0.85, 'black', sx * 1.01, 2.05, 1.3)
  box(2.06, 0.08, 1.42, paint, 0, 2.46, 1.2)
  for (const sx of [-1, 1]) box(0.06, 0.06, 0.5, 'black', sx * 1.08, 1.95, 1.75, 0, 0.25) // mirror arms
  // fuel tank
  part('rust', new THREE.CylinderGeometry(0.26, 0.26, 1.0, 10), 0.85, 0.72, 0.0, Math.PI / 2, 0, 0)
  // the flatbed: rotten planks on rusted bearers, a headboard, side boards
  box(2.2, 0.12, 3.7, 'darkWood', 0, 1.19, -1.3, 0, 0, 0, 1.5)
  for (const z of [-2.9, -1.8, -0.7, 0.3]) box(2.2, 0.12, 0.14, 'rust', 0, 1.07, z)
  box(2.2, 0.95, 0.08, 'rust', 0, 1.72, 0.5, 0, 0, 0, 3)
  for (const sx of [-1, 1]) {
    if (rng.chance(0.75)) box(0.06, 0.38, 3.6, 'darkWood', sx * 1.08, 1.44, -1.3, 0, 0, sx * rng.range(0, 0.25), 1.5)
  }
  // tailgate hanging open
  box(2.1, 0.38, 0.06, 'darkWood', 0, 0.95, -3.18, 0.35, 0, 0, 1.5)
  // a sapling has rooted in the bed
  part('darkWood', new THREE.CylinderGeometry(0.04, 0.07, 1.6, 5), 0.6, 2.0, -2.6, 0.05, 0, -0.08)
  part('vine', new THREE.IcosahedronGeometry(0.55, 0), 0.68, 2.85, -2.6)
  return {}
}

// Power poles along a road polyline, some leaning, as one merged mesh. A
// pole never stands in water or the river channel, nor beside a bridge deck:
// it moves along to the next dry road vertex.
export function buildPoles(G, road, rng) {
  const isl = G.island
  const kit = new Kit(G, 0, 0, 0, 0, 'poles')
  const byBridge = (x, z) =>
    isl.bridges.some((b) => {
      const dx = x - b.x
      const dz = z - b.z
      const along = -dx * Math.sin(b.yaw) - dz * Math.cos(b.yaw)
      const across = dx * Math.cos(b.yaw) - dz * Math.sin(b.yaw)
      return Math.abs(along) < b.length / 2 + 4 && Math.abs(across) < 10
    })
  let acc = 0
  for (let k = 1; k < road.pts.length; k++) {
    const [ax, az] = road.pts[k - 1]
    const [bx, bz] = road.pts[k]
    acc += Math.hypot(bx - ax, bz - az)
    if (acc < 36) continue
    const dx = bx - ax
    const dz = bz - az
    const l = Math.hypot(dx, dz) || 1
    const px = bx + (-dz / l) * 5.5
    const pz = bz + (dx / l) * 5.5
    const lean = rng.chance(0.25) ? rng.range(0.1, 0.35) * rng.sign() : 0
    // beside this road can still be on another one where roads fork or bend back
    if (isl.depthAt(px, pz) > -0.3 || isl.sample(isl.riverD, px, pz) < 2.6 || byBridge(px, pz) || isl.sample(isl.road, px, pz) > 0.02) continue
    acc = 0
    const g = isl.heightAt(px, pz)
    const ry = Math.atan2(dx, dz)
    kit.cyl(0.13, 8, 'darkWood', px, g + 3.6, pz, { seg: 6, rx: lean, collide: !lean })
    if (lean) G.physics.addCylinder(px, pz, 0.2, g - 1, g + 1.5)
    kit.box(1.6, 0.1, 0.1, 'darkWood', px, g + 7.2, pz, { ry: ry + Math.PI / 2, rz: lean, collide: false })
  }
  kit.finish()
}

// ---------------------------------------------------------------- assembly

function roadFacing(island, poi) {
  let best = null
  let bd = Infinity
  for (const r of island.roads) {
    for (const [x, z] of r.pts) {
      const d = Math.hypot(x - poi.x, z - poi.z)
      if (d >= 28 && d <= 90 && d < bd) {
        bd = d
        best = [x, z]
      }
    }
  }
  return best ? Math.atan2(best[0] - poi.x, best[1] - poi.z) : 0
}

export function buildStructures(G) {
  const isl = G.island
  const rng = new Rng(isl.cfg.seed + 404)
  const P = isl.poi
  buildDock(G, P.dock, rng)
  buildStation(G, P.station, rng)
  buildFieldLab(G, P.fieldlab, rng, roadFacing(isl, P.fieldlab))
  for (const id of ['easttower', 'westtower', 'southtower']) buildTower(G, P[id], rng, roadFacing(isl, P[id]))
  buildPaddock(G, P.paddock, rng)
  buildRelay(G, P.summit, rng)
  for (const b of isl.bridges) buildBridge(G, b, rng)
  // the poles draw from their own streams, so moving one never reshuffles
  // the wrecks
  buildPoles(G, isl.roads[0], new Rng(isl.cfg.seed + 505))
  buildPoles(G, isl.roads[1], new Rng(isl.cfg.seed + 506))
  // wrecks along the roads, where Island.placeWrecks found room for them
  for (const w of isl.wrecks) buildWreck(G, w.x, w.z, w.yaw, rng, w.crate, w.kind, w.roadSide)
}
