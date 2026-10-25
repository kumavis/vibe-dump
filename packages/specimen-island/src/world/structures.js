import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { concrete, planks, corrugated, paintedMetal, rustedPaint, signBoard, helipad, chainLink, burlap } from './textures.js'
import { Rng } from '../core/rng.js'
import { CACHES, CRATE, ITEMS, LOOT, RESTOCKS } from '../data/items.js'
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
    serum: L({ color: 0xe8a826, emissive: 0x3a2400 }),
    helipad: L({ map: helipad() }),
    // wrecks
    rustGreen: L({ map: rustedPaint([82, 102, 70]) }),
    rustOrange: L({ map: rustedPaint([178, 100, 46]) }),
    rustWhite: L({ map: rustedPaint([200, 196, 182]) }),
    rustBlue: L({ map: rustedPaint([70, 88, 104]) }),
    tire: L({ color: 0x1a1918 }),
    seat: L({ color: 0x3a2e24 }),
    moss: L({ color: 0x4a6a2c, side: THREE.DoubleSide }),
    // Camp Halvorsen
    chain: L({ map: chainLink(), transparent: true, alphaTest: 0.5, side: THREE.DoubleSide }),
    sandbag: L({ map: burlap() }),
    olive: L({ map: rustedPaint([92, 98, 66]) }),
    brass: L({ color: 0x9a7a3a }),
    earth: L({ color: 0x5b5537 }),
    tarp: L({ color: 0x6b6646, side: THREE.DoubleSide }),
    // the sea lab
    deck: L({ map: rustedPaint([118, 124, 116]) }),
    weed: L({ color: 0x3e4a26, side: THREE.DoubleSide }),
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
const SURFACE = { wood: 'wood', darkWood: 'wood', concrete: 'concrete', helipad: 'concrete', metal: 'metal', rust: 'metal', roof: 'metal', orange: 'metal', yellow: 'metal', green: 'metal', white: 'metal', black: 'metal', olive: 'metal', sandbag: 'dirt', earth: 'dirt', deck: 'metal' }

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
    const { ry = 0, rx = 0, rz = 0, collide = true, walkable = true, roof = false, tex = 2 } = opts
    this.push(matKey, boxGeo(w, h, d, tex), lx, ly, lz, rx, ry, rz)
    if (collide && !rx && !rz) {
      const [x, z] = this.world(lx, lz)
      const c = this.G.physics.addBox(x, z, w / 2, d / 2, this.yaw + ry, this.y + ly - h / 2, this.y + ly + h / 2, { walkable, roof })
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

// A store that tops an item back up to its cap (data/items.js RESTOCKS), as
// often as you come back.
function restock(G, kit, id, lx, ly, lz) {
  const def = RESTOCKS[id]
  const item = ITEMS[def.item]
  const pos = kit.point(lx, ly, lz)
  return kit.interact(
    {
      id,
      label: () => (G.inventory.weapons.has(def.weapon) ? `Restock ${item.name.toLowerCase()}` : def.title),
      hold: 1.0,
      radius: 2.2,
      enabled: (G) => {
        if (def.flag && !G.flags.get(def.flag)) return def.off
        if (def.weapon && !G.inventory.weapons.has(def.weapon)) return def.before
        if (G.inventory.count(def.item) >= item.max) return `${item.name} full`
        return true
      },
      onUse: (G) => {
        const got = G.inventory.add(def.item, item.max)
        G.toast(`${def.title}: ${lootLine({ [def.item]: got })}`, 'loot')
        G.audio?.play('locker', { pos })
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
  // roof, with a collapsed strip when `hole` — tagged a roof, so an animal
  // under it knows it is indoors and leaves by the door (Creature.wayIn)
  if (hole) {
    const gap = 1.6
    const left = w * 0.62
    kit.box(left, 0.22, d + 0.6, roof, cx - w / 2 + left / 2 - 0.3, h + 0.11, cz, { tex: 3, roof: true })
    kit.box(w - left - gap + 0.6, 0.22, d + 0.6, roof, cx + w / 2 - (w - left - gap) / 2 + 0.3, h + 0.11, cz, { tex: 3, roof: true })
    kit.box(gap + 0.4, 0.12, d * 0.5, roof, cx - w / 2 + left + gap / 2, h * 0.55, cz + d * 0.15, { rz: 0.6, collide: false, tex: 3 })
  } else {
    kit.box(w + 0.6, 0.22, d + 0.6, roof, cx, h + 0.11, cz, { tex: 3, roof: true })
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
  // the cold store: spare jumbo-syringe cartridges, kept while the generator
  // runs (data/items.js RESTOCKS)
  kit.box(1.1, 1.9, 0.65, 'white', lab.cx + 5, 1.25, lab.cz - 5.85)
  kit.box(0.05, 0.6, 0.05, 'black', lab.cx + 5.45, 1.4, lab.cz - 5.5, { collide: false })
  const coldLamp = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 4), mats().bulb.clone())
  coldLamp.position.set(lab.cx + 4.65, 2.0, lab.cz - 5.51)
  kit.add(coldLamp)
  restock(G, kit, 'coldStore', lab.cx + 5, 1.3, lab.cz - 5.3)

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
        return `Service ${names(todo)} (${todo.some((v) => v.aircraft) ? 'refuel + repair' : 'repair'})`
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
          // anything that flies also takes on fuel; the station heli's is the expedition's
          if (v.aircraft) {
            heli = true
            if (v === G.heli) G.flags.set('heliFueled')
            done.push(hurt ? `${v.tune.name} repaired and refuelled` : `${v.tune.name} refuelled`)
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
    coldLamp.material.emissive.setHex(0x40e070)
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

// The sauropod keepers' shed outside Paddock C's gate, on its cleared lot
// (data/world.js lots): a plank lean-to on stilts over the slope, open to the
// road, with the jumbo syringe across a rack on its back wall and the keeper's
// card beside it.
export function buildKeeperShed(G, lot, rng) {
  const kit = new Kit(G, lot.x, G.island.heightAt(lot.x, lot.z), lot.z, lot.yaw, 'keepershed')
  const W = 3.6
  const D = 3.0
  const hF = 2.5 // front posts; the roof falls to the back
  const hB = 2.15
  // the floor clears the highest corner of the slope
  const corners = [-1, 1].flatMap((sx) => [-1, 1].map((sz) => kit.ground((sx * W) / 2, (sz * D) / 2)))
  const F = Math.max(...corners) + 0.3
  kit.box(W, 0.12, D, 'wood', 0, F - 0.06, 0, { tex: 1.5 })
  for (const x of [-W / 2 + 0.1, 0, W / 2 - 0.1]) for (const z of [-D / 2 + 0.1, D / 2 - 0.1]) kit.post(0.16, F - 0.12, 'darkWood', x, z)
  // steps down from the open front. Each one added reaches further down the
  // slope, which keeps falling away, so add them until the lowest is no more
  // than RISE above the ground a player climbs it from (circle touching its
  // face, anywhere across it): the player steps up 0.44 m at most, and only
  // once its centre is over the next tread, so a tread must be well wider
  // than its 0.35 m radius or the step after that blocks it first
  const TREAD = 0.45
  const RISE = 0.4
  const foot = (n) => Math.min(...[-0.55, -0.25, 0, 0.25, 0.55].map((x) => kit.ground(x, D / 2 + n * TREAD + 0.35)))
  let n = 0
  while (n < 10 && (F - foot(n)) / (n + 1) > RISE) n++
  const gF = foot(n)
  for (let i = 1; i <= n; i++) {
    const top = F - ((F - gF) * i) / (n + 1)
    const z = D / 2 + (i - 0.5) * TREAD
    const bottom = Math.min(kit.ground(-0.6, z), kit.ground(0.6, z)) - 0.3
    kit.box(1.2, top - bottom, TREAD, 'darkWood', 0, (top + bottom) / 2, z)
  }
  // frame, plank walls (the right one has lost its lower boards) and a tin roof
  for (const sx of [-1, 1]) {
    kit.box(0.12, hF, 0.12, 'darkWood', sx * (W / 2 - 0.06), F + hF / 2, D / 2 - 0.06)
    kit.box(0.12, hB, 0.12, 'darkWood', sx * (W / 2 - 0.06), F + hB / 2, -D / 2 + 0.06)
  }
  kit.box(W, hB, 0.06, 'wood', 0, F + hB / 2, -D / 2 + 0.03)
  kit.box(0.06, hB, D, 'wood', -W / 2 + 0.03, F + hB / 2, 0)
  kit.box(0.06, hB - 0.9, D, 'wood', W / 2 - 0.03, F + 0.9 + (hB - 0.9) / 2, 0)
  kit.box(0.06, 0.3, D, 'wood', W / 2 - 0.03, F + 0.15, 0)
  kit.box(W + 0.5, 0.06, D + 0.6, 'rust', 0, F + (hF + hB) / 2 + 0.06, 0, { rx: -Math.atan2(hF - hB, D), tex: 3 })
  const { texture, width, height } = signBoard(['SAUROPOD KEEPERS'], { bg: '#4b5a3c', minWidth: 2.2, maxWidth: W - 0.4, minHeight: 0.42, maxHeight: 0.5 })
  const face = new THREE.MeshLambertMaterial({ map: texture })
  const board = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.05), [mats().darkWood, mats().darkWood, mats().darkWood, mats().darkWood, face, face])
  board.position.set(0, F + hF - height / 2 - 0.04, D / 2 + 0.03)
  board.rotation.z = 0.03
  kit.add(board)
  // a shelf with the cartridge crate, and the card pinned up by the door
  kit.box(0.36, 0.04, 1.3, 'darkWood', -W / 2 + 0.24, F + 1.0, -0.55, { collide: false })
  kit.box(0.3, 0.22, 0.42, 'white', -W / 2 + 0.24, F + 1.13, -0.75, { collide: false })
  kit.box(0.31, 0.05, 0.43, 'orange', -W / 2 + 0.24, F + 1.16, -0.75, { collide: false })
  kit.box(0.02, 0.34, 0.25, 'white', -W / 2 + 0.07, F + 1.5, 0.75, { collide: false, rx: 0.06 })
  lore(G, kit, 'keeperCard', 'Read keeper’s card', -W / 2 + 0.3, F + 1.45, 0.75)
  // the rack: two brackets and the syringe lying across them
  for (const x of [-1.05, 0.95]) kit.box(0.06, 0.06, 0.2, 'metal', x, F + 1.42, -D / 2 + 0.16, { collide: false })
  const pole = jumboOnRack()
  pole.position.set(0, F + 1.49, -D / 2 + 0.2)
  kit.add(pole)
  cache(G, kit, 'jumboRack', 'Take jumbo syringe', 0, F + 1.4, -D / 2 + 0.45, { title: 'Keeper’s rack', after: () => (pole.visible = false) })
  kit.vines(-W / 2 - 0.05, F + hB, -0.3, D * 0.6, hB * 0.75, Math.PI / 2, rng)
  kit.vines(0.6, F + hB, -D / 2 - 0.05, W * 0.45, hB * 0.6, 0, rng)
  kit.finish()
  return kit
}

// The jumbo syringe at rest, lying along +X: pole, grip, the barrel with its
// cartridge showing, and the needle.
function jumboOnRack() {
  const g = new THREE.Group()
  const M = mats()
  const part = (r, len, mat, x, r2 = r) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r2, len, 10), mat)
    m.rotation.z = Math.PI / 2 // top (r) towards -X, bottom (r2) towards +X
    m.position.x = x
    m.castShadow = true
    g.add(m)
  }
  part(0.018, 2.0, M.metal, -0.15)
  part(0.026, 0.32, M.black, -1.0)
  part(0.022, 0.06, M.orange, 0.35)
  part(0.055, 0.05, M.black, 0.87)
  part(0.034, 0.26, M.serum, 1.05)
  part(0.05, 0.32, M.glass, 1.05)
  part(0.045, 0.06, M.metal, 1.24, 0.012)
  part(0.004, 0.2, M.metal, 1.37, 0.0015)
  return g
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

// ---------------------------------------------------------------- Camp Halvorsen

// The Foundation Security Detachment's camp on the north-east plateau,
// abandoned rather than destroyed: chain-link and razor wire gone to rust,
// sandbags split and sprouting, vines up every wall, and the motor pool still
// holding the humvee and the tank the barge never came back for. It is laid
// out in the camp's own frame, +Z toward the road that comes in through the
// gate (data/world.js); the road runs on into the yard along x = 0, so
// nothing solid stands within 4.5 m of that line. Each part is a small helper
// over the Kit, placed from this table.
const CAMP = {
  fence: { hx: 40, hz: 34, gate: 5.8, span: 3.2, h: 2.4, wireStep: 0.4 },
  breach: [0.56, 0.7], // the stretch of the back fence something big went through
  gateBooth: { cx: 10.5, cz: 28 },
  motorPool: { x0: -35, x1: -19, z0: -10.5, z1: 6.5, h: 4.8 },
  bays: { tank: [-27.6, -5.9], humvee: [-27.2, 2.7] }, // both facing +X, out to the yard
  barracks: { cx: -22, cz: -24, w: 18, d: 7.5, h: 3 },
  command: { cx: 22, cz: -22, w: 12, d: 9, h: 3.4 },
  bunker: { cx: 31, cz: -5, w: 8, d: 6, h: 2.7 },
  tower: { x: -34.5, z: 28.5, top: 6.5 },
  mast: { x: 3, z: -25, h: 20 },
  // the helipad: 12 m round its centre is kept clear for a rotor
  pad: { x: 24, z: 18, r: 8 },
  lights: [[-12, 12], [14, -9], [-8, -14]],
  flag: [7, -14],
  truck: { x: -29, z: 17 }, // the convoy's last truck, stripped for parts
}

// A blade-of-grass geometry for a tuft at (cx, cz): weeds through cracks, at
// the foot of walls and fences.
function tuft(kit, cx, cz, rng, n = 7, tall = 1) {
  const ty = kit.ground(cx, cz) - 0.03
  const blades = []
  for (let k = 0; k < n; k++) {
    const ba = rng.range(0, Math.PI * 2)
    const h = rng.range(0.35, 0.9) * tall
    const lean = rng.range(0.05, 0.35)
    const w = 0.045
    const bx = cx + rng.range(-0.18, 0.18)
    const bz = cz + rng.range(-0.18, 0.18)
    blades.push(bx - Math.sin(ba) * w, ty, bz + Math.cos(ba) * w, bx + Math.sin(ba) * w, ty, bz - Math.cos(ba) * w, bx + Math.cos(ba) * lean, ty + h, bz + Math.sin(ba) * lean)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(blades, 3))
  g.computeVertexNormals()
  kit.push('moss', g, 0, 0, 0)
}

// A round bar from a to b (local [x, y, z]): guy wires, bracing, rails.
function bar(kit, mat, r, a, b) {
  const A = new THREE.Vector3(...a)
  const B = new THREE.Vector3(...b)
  const dir = B.clone().sub(A)
  const g = new THREE.CylinderGeometry(r, r, dir.length(), 4)
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize()))
  const m = A.add(B).multiplyScalar(0.5)
  kit.push(mat, g, m.x, m.y, m.z)
}

// A box hinged at its base and leaned `lean` radians about its own length
// axis (local X before the yaw `ry`): sagging panels, leaning posts.
function leaned(kit, mat, w, h, d, lx, ly, lz, ry, lean, tex = 2) {
  kit.push(mat, boxGeo(w, h, d, tex).translate(0, h / 2, 0).rotateX(lean), lx, ly, lz, 0, ry, 0)
}

// A run of chain-link from (ax, az) to (bx, bz): steel posts every few
// metres, mesh panels, razor wire coiled along the top. Weather has sagged
// some panels out of true and leaned a post or two; `breach` ([from, to] as
// shares of the run) is where something went through, and leaves a gap with
// the mesh trampled flat and the wire in a tangle. Standing panels are
// walls; a gap is not.
function chainFence(G, kit, ax, az, bx, bz, rng, breach = null) {
  const F = CAMP.fence
  const len = Math.hypot(bx - ax, bz - az)
  const n = Math.max(1, Math.round(len / F.span))
  const ux = (bx - ax) / len
  const uz = (bz - az) / len
  const ry = -Math.atan2(uz, ux)
  // which way is out (away from the camp's centre), as the sign of local +Z
  const out = -uz * (ax + bx) + ux * (az + bz) > 0 ? 1 : -1
  const [b0, b1] = breach || [2, 2]
  const wire = (x, y, z, tilt) => kit.push('metal', new THREE.TorusGeometry(0.22, 0.012, 3, 9), x, y, z, 0, ry + Math.PI / 2 + tilt, 0)
  for (let i = 0; i < n; i++) {
    const t0 = i / n
    const t1 = (i + 1) / n
    const sl = len / n
    const px = ax + (bx - ax) * t0
    const pz = az + (bz - az) * t0
    const mx = ax + (bx - ax) * (t0 + t1) * 0.5
    const mz = az + (bz - az) * (t0 + t1) * 0.5
    const g = kit.ground(mx, mz)
    const broken = t1 > b0 && t0 < b1
    const sag = !broken && rng.chance(0.18) ? rng.range(0.12, 0.32) * (rng.chance(0.7) ? out : -out) : 0
    // the post at the start of this span
    if (broken && rng.chance(0.5)) leaned(kit, 'metal', 0.09, F.h + 0.4, 0.09, px, kit.ground(px, pz) - 0.1, pz, ry, out * rng.range(1.2, 1.5))
    else if (sag) leaned(kit, 'metal', 0.09, F.h + 0.5, 0.09, px, kit.ground(px, pz) - 0.3, pz, ry, sag * 0.6)
    else kit.post(0.09, kit.ground(px, pz) + F.h + 0.4, 'metal', px, pz)
    if (broken) {
      // the mesh flattened into the grass, the wire in a tangle on top of it
      if (rng.chance(0.7)) kit.push('chain', planeUV(sl * 0.9, F.h, 0.6).rotateX(-Math.PI / 2), mx + -uz * out * 1.4, g + 0.05, mz + ux * out * 1.4, 0, ry + rng.range(-0.3, 0.3), 0)
      for (let k = 0; k < 6; k++) kit.push('metal', new THREE.TorusGeometry(0.24, 0.012, 3, 9), mx + rng.range(-1.4, 1.4) * ux, g + 0.2, mz + rng.range(-1.4, 1.4) * uz, rng.range(0, 3), rng.range(0, 3), 0)
      for (let k = 0; k < 2; k++) tuft(kit, mx + rng.range(-1.2, 1.2) * ux, mz + rng.range(-1.2, 1.2) * uz, rng, 9, 1.3)
      continue
    }
    // the mesh, hung a hand's width off the ground, and its top rail
    const panel = planeUV(sl, F.h, 0.6).translate(0, F.h / 2, 0).rotateX(sag)
    kit.push('chain', panel, mx, g + 0.12, mz, 0, ry, 0)
    if (!sag) {
      kit.box(sl, 0.05, 0.05, 'metal', mx, g + F.h + 0.15, mz, { ry, collide: false })
      for (let s = F.wireStep / 2; s < sl; s += F.wireStep) wire(px + ux * s, g + F.h + 0.45, pz + uz * s, (Math.round(s / F.wireStep) % 2 ? 0.35 : -0.35))
    } else {
      // the wire has slid down the sagging panel
      for (let s = F.wireStep / 2; s < sl; s += F.wireStep * 1.5) wire(px + ux * s - uz * out * 0.5, g + F.h * 0.6, pz + uz * s + ux * out * 0.5, rng.range(-0.5, 0.5))
    }
    const [wx, wz] = kit.world(mx, mz)
    G.physics.addBox(wx, wz, sl / 2, 0.12, kit.yaw + ry, kit.y + g - 0.4, kit.y + g + F.h + 0.6, { walkable: false, tag: 'fence' })
    if (rng.chance(0.3)) kit.vines(mx, g + F.h + 0.1, mz, sl * 0.6, F.h * 0.8, ry, rng)
    if (rng.chance(0.6)) tuft(kit, mx + rng.range(-1, 1) * ux, mz + rng.range(-1, 1) * uz, rng, 8)
  }
  kit.post(0.09, kit.ground(bx, bz) + F.h + 0.4, 'metal', bx, bz)
}

// A plane with its UVs in tiles of `tile` metres.
function planeUV(w, h, tile) {
  const g = new THREE.PlaneGeometry(w, h)
  const uv = g.attributes.uv
  for (let i = 0; i < uv.count; i++) uv.setXY(i, (uv.getX(i) * w) / tile, (uv.getY(i) * h) / tile)
  return g
}

// A wall of sandbags centred at (cx, cz) along `ry`, `rows` high, on the
// ground or on `base` (a platform). Bags settle and split; the odd one has
// sprouted. One collider for the wall: the low ones a tank rolls over.
function sandbags(G, kit, cx, cz, len, ry, rows, rng, base = null) {
  const g = base ?? kit.ground(cx, cz)
  const bag = 0.62
  const c = Math.cos(ry)
  const s = Math.sin(ry)
  for (let r = 0; r < rows; r++) {
    const off = r % 2 ? bag / 2 : 0
    for (let a = -len / 2 + bag / 2 + off; a <= len / 2 - bag / 2 + 1e-6; a += bag) {
      if (r === rows - 1 && rng.chance(0.12)) continue // a bag gone from the top
      const sunk = rng.chance(0.15) ? 0.06 : 0
      kit.push('sandbag', boxGeo(bag - 0.04, 0.24 - sunk, 0.4, 0.6), cx + c * a, g + 0.12 + r * 0.235 - sunk / 2, cz - s * a, 0, ry + rng.range(-0.08, 0.08), rng.range(-0.04, 0.04))
    }
  }
  if (rng.chance(0.5)) tuft(kit, cx + c * rng.range(-len / 2, len / 2), cz - s * rng.range(-len / 2, len / 2), rng, 6, 0.8)
  const [wx, wz] = kit.world(cx, cz)
  G.physics.addBox(wx, wz, len / 2, 0.22, kit.yaw + ry, kit.y + g - 0.2, kit.y + g + rows * 0.235, { material: 'dirt' })
}

// The gate: two posts either side of the road, one leaf hanging open off its
// last hinge outside the fence, the other flat in the weeds; a sentry booth,
// sandbags and a sign, all clear of the road.
function campGate(G, kit, rng) {
  const F = CAMP.fence
  const gz = F.hz
  for (const x of [-F.gate, F.gate]) kit.box(0.3, F.h + 1, 0.3, 'olive', x, F.h / 2 + 0.3, gz)
  // the right leaf swung out and dropped against the fence
  const leaf = (lx, ly, lz, rx, ry, rz) => {
    kit.push('chain', planeUV(F.gate - 0.4, F.h - 0.2, 0.6), lx, ly, lz, rx, ry, rz)
    kit.push('metal', boxGeo(F.gate - 0.4, 0.06, 0.06), lx, ly + (F.h - 0.2) / 2, lz, rx, ry, rz)
  }
  leaf(F.gate + 2.8, F.h / 2 + 0.05, gz + 0.9, 0, 0.3, 0.12)
  // ...the left one lies in the grass inside, gone green
  leaf(-F.gate - 2.2, 0.06, gz - 3.5, -Math.PI / 2, 0.15, 0)
  for (let k = 0; k < 3; k++) tuft(kit, -F.gate - 2.2 + rng.range(-2, 2), gz - 3.5 + rng.range(-1, 1), rng, 9, 1.2)
  // sentry booth and its sandbags
  const B = CAMP.gateBooth
  building(kit, 2.6, 2.6, 2.5, { cx: B.cx, cz: B.cz, mat: 'olive', roof: 'rust', door: 0.9, hole: false, rng })
  sandbags(G, kit, B.cx - 3.6, B.cz + 2.2, 2.6, Math.PI / 2, 3, rng)
  sandbags(G, kit, -8.5, gz - 4.5, 3.8, 0.3, 3, rng)
  // concrete barriers staggered down the approach, either side of the road
  for (const [x, z, ry] of [[-7.4, gz + 7, 0.1], [7.6, gz + 12, -0.15], [-7.6, gz + 17, 0]]) kit.box(0.6, 0.85, 2.0, 'concrete', x, kit.ground(x, z) + 0.42, z, { ry })
  sign(G, kit, ['CAMP HALVORSEN', 'FOUNDATION SECURITY DETACHMENT', 'RESTRICTED AREA'], 10.5, gz + 5, 0, { bg: '#4a5236' })
}

// The motor pool: an open-fronted steel canopy, a corrugated back wall, a
// bench and the junk of a vehicle shop. The humvee and the tank stand in its
// two bays nose-out to the yard (CAMP.bays, read back through poi.bays).
function motorPool(G, kit, poi, rng) {
  const M = CAMP.motorPool
  const xm = (M.x0 + M.x1) / 2
  const zm = (M.z0 + M.z1) / 2
  const w = M.x1 - M.x0
  const d = M.z1 - M.z0
  kit.box(w, 0.1, d, 'concrete', xm, 0.05, zm, { tex: 3 })
  for (const [x, z] of [[M.x0, M.z0], [xm, M.z0], [M.x1, M.z0], [M.x0, M.z1], [xm, M.z1], [M.x1, M.z1]]) kit.box(0.26, M.h, 0.26, 'olive', x, M.h / 2, z)
  kit.box(0.14, M.h, d, 'rust', M.x0 + 0.1, M.h / 2, zm, { tex: 3 })
  for (const z of [M.z0, M.z1]) kit.box(w / 2, 1.6, 0.12, 'rust', M.x0 + w / 4, 0.8, z, { tex: 3 })
  // the roof: three sheets, the front one of the middle row gone (a sapling
  // has come up through the gap) and one hanging by a corner
  const sheet = d / 3
  for (let i = 0; i < 3; i++) {
    const z = M.z0 + sheet * (i + 0.5)
    if (i === 1) {
      kit.box(w * 0.55, 0.12, sheet + 0.2, 'rust', M.x0 + w * 0.275, M.h + 0.06, z, { tex: 3 })
      kit.box(2.4, 0.05, 1.5, 'rust', M.x1 - w * 0.33, M.h - 0.95, z + 0.4, { rz: 1.15, collide: false, tex: 3 })
    } else kit.box(w + 0.6, 0.12, sheet + 0.2, 'rust', xm + 0.3, M.h + 0.06 - i * 0.02, z, { tex: 3 })
  }
  for (const z of [M.z0, M.z1]) kit.box(w, 0.2, 0.2, 'olive', xm, M.h - 0.1, z, { collide: false })
  const sx = M.x1 - w * 0.2
  const sz = M.z0 + sheet * 1.5 + 1.5
  kit.cyl(0.1, M.h + 1.6, 'darkWood', sx, (M.h + 1.6) / 2, sz, { rTop: 0.05, seg: 5, collide: false })
  kit.push('vine', new THREE.IcosahedronGeometry(1.3, 0), sx + 0.2, M.h + 1.7, sz)
  kit.push('vine', new THREE.IcosahedronGeometry(0.8, 0), sx - 0.4, M.h + 1.0, sz + 0.5)
  // the shop along the back wall
  kit.box(2.6, 0.9, 0.8, 'darkWood', M.x0 + 0.8, 0.45, zm + 4.5, { ry: Math.PI / 2 })
  kit.box(0.5, 0.3, 0.35, 'olive', M.x0 + 0.8, 1.05, zm + 5.2, { collide: false })
  kit.box(0.3, 0.02, 0.22, 'white', M.x0 + 0.85, 0.91, zm + 3.9, { collide: false })
  lore(G, kit, 'campMotorPool', 'Read the motor pool board', M.x0 + 1.3, 1.2, zm + 3.9)
  for (let i = 0; i < 5; i++) kit.cyl(0.3, 0.9, i % 2 ? 'olive' : 'rust', M.x0 + 0.8 + (i % 2) * 0.68, 0.45, M.z0 + 1.2 + Math.floor(i / 2) * 0.68, { seg: 10 })
  for (let i = 0; i < 4; i++) kit.cyl(0.48, 0.3, 'tire', M.x0 + 1.0, 0.15 + i * 0.3, M.z1 - 1.3, { seg: 12, open: false })
  // a spare track run leaning on the wall, an engine on its stand, jerrycans
  leaned(kit, 'black', 0.5, 2.6, 0.08, M.x0 + 0.5, 0, zm - 1, Math.PI / 2, 0.25)
  kit.box(1.0, 0.8, 0.7, 'black', M.x0 + 2.6, 0.75, zm + 0.5)
  kit.box(1.2, 0.35, 0.9, 'metal', M.x0 + 2.6, 0.17, zm + 0.5)
  for (let i = 0; i < 3; i++) kit.box(0.18, 0.46, 0.34, 'olive', M.x0 + 0.5, 0.23, zm + 6.6 - i * 0.4, { collide: false })
  for (let i = 0; i < 4; i++) {
    const oil = new THREE.CircleGeometry(rng.range(0.4, 0.9), 10).rotateX(-Math.PI / 2)
    kit.push('black', oil, rng.range(M.x0 + 4, M.x1 - 2), 0.105 + i * 0.002, rng.range(M.z0 + 2, M.z1 - 2))
  }
  kit.vines(M.x0 + 0.2, M.h, zm - 3, d * 0.4, M.h * 0.7, Math.PI / 2, rng)
  kit.vines(xm, M.h, M.z1 + 0.15, w * 0.5, M.h * 0.6, 0, rng)
  for (let k = 0; k < 8; k++) tuft(kit, rng.range(M.x0, M.x1), rng.chance(0.5) ? M.z0 - 0.3 : M.z1 + 0.3, rng)
  // the bays, in the world, facing out of the open front
  poi.bays = {}
  for (const [id, [x, z]] of Object.entries(CAMP.bays)) poi.bays[id] = { pos: kit.point(x, 0.1, z), yaw: kit.yaw - Math.PI / 2 }
}

// The ammunition bunker: a squat concrete box under an earth berm gone to
// grass, its blast door rusted half open. Inside, racks of the tank's shells
// and a crate of small-arms rounds; at the door, the ready rack of a tank
// parked within reach is filled back up (TANK.gun.rearm).
function ammoBunker(G, kit, rng) {
  const B = CAMP.bunker
  const t = 0.4
  const z0 = B.cz - B.d / 2
  const z1 = B.cz + B.d / 2
  const door = 2.4
  kit.box(B.w, 0.2, B.d, 'concrete', B.cx, 0.1, B.cz)
  kit.box(B.w, B.h, t, 'concrete', B.cx, B.h / 2, z0 + t / 2)
  for (const s of [-1, 1]) kit.box(t, B.h, B.d, 'concrete', B.cx + s * (B.w / 2 - t / 2), B.h / 2, B.cz)
  const side = (B.w - door) / 2
  for (const s of [-1, 1]) kit.box(side, B.h, t, 'concrete', B.cx + s * (door / 2 + side / 2), B.h / 2, z1 - t / 2)
  kit.box(door, B.h - 2.2, t, 'concrete', B.cx, 2.2 + (B.h - 2.2) / 2, z1 - t / 2)
  kit.box(B.w + 0.4, 0.35, B.d + 0.4, 'concrete', B.cx, B.h + 0.17, B.cz)
  // the berm: earth heaped over the back and sides, grass on top
  for (const s of [-1, 1]) kit.box(2.2, B.h + 0.6, B.d + 1.2, 'earth', B.cx + s * (B.w / 2 + 0.7), B.h / 2 - 0.5, B.cz - 0.3, { rz: -s * 0.55, collide: false })
  kit.box(B.w + 2, B.h + 0.6, 2.4, 'earth', B.cx, B.h / 2 - 0.5, z0 - 0.8, { rx: 0.55, collide: false })
  kit.box(B.w + 0.6, 0.4, B.d + 0.2, 'earth', B.cx, B.h + 0.45, B.cz - 0.1, { collide: false })
  for (let k = 0; k < 14; k++) tuft(kit, B.cx + rng.range(-B.w / 2 - 1, B.w / 2 + 1), B.cz + rng.range(-B.d / 2 - 1, B.d / 2 - 0.5), rng, 7, 1.1)
  for (let k = 0; k < 6; k++) kit.push('moss', new THREE.CircleGeometry(rng.range(0.4, 0.8), 6).rotateX(-Math.PI / 2), B.cx + rng.range(-3, 3), B.h + 0.66 + k * 0.002, B.cz + rng.range(-2, 2))
  // the blast door, seized a third open on its hinge
  kit.box(door - 0.1, 2.15, 0.12, 'olive', B.cx - door / 2 - 0.5, 1.1, z1 + 1.0, { ry: 1.1 })
  // shell racks: shelves of brass down both walls, ammo boxes, the crate
  for (const s of [-1, 1]) {
    const x = B.cx + s * (B.w / 2 - 0.75)
    for (const y of [0.55, 1.25]) {
      kit.box(0.7, 0.06, B.d - 1.6, 'darkWood', x, y, B.cz - 0.4, { collide: false })
      for (let k = 0; k < 7; k++) if (rng.chance(s < 0 ? 0.8 : 0.35)) kit.cyl(0.08, 0.7, 'brass', x, y + 0.04, B.cz - 2.1 + k * 0.5, { rx: Math.PI / 2, collide: false, seg: 8 })
    }
    G.physics.addBox(...kit.world(x, B.cz - 0.4), 0.35, (B.d - 1.6) / 2, kit.yaw, kit.y, kit.y + 1.3, { walkable: false, material: 'wood' })
  }
  for (let i = 0; i < 3; i++) kit.box(0.6, 0.35, 0.3, 'olive', B.cx - 0.6 + i * 0.65, 0.375, z0 + 0.7)
  crate(G, kit, B.cx + 0.6, z0 + 1.6, 'crate:campBunker', { items: { shell: 6, rifleRound: 5 } }, rng, 0.2)
  const { texture, width, height } = signBoard(['AMMUNITION', 'NO NAKED FLAMES'], { bg: '#8a6a20', fg: '#1a1a1a', minWidth: 1.4, maxWidth: 2.2, minHeight: 0.5, maxHeight: 0.6 })
  const face = new THREE.MeshLambertMaterial({ map: texture })
  const plate = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.04), [mats().metal, mats().metal, mats().metal, mats().metal, face, face])
  plate.position.set(B.cx, 2.45, z1 + 0.03)
  plate.rotation.z = -0.04
  kit.add(plate)
  // the ready rack: a tank parked at the door, nobody aboard
  const at = kit.point(B.cx, 0, z1)
  const parked = () => (G.vehicles || []).find((v) => v.tune.gun && v.rearm && !v.occupied && v.pos.distanceTo(at) <= v.tune.gun.rearm)
  kit.interact(
    {
      id: 'campAmmo',
      label: () => {
        const v = parked()
        return v ? `Load shells into the ${v.tune.name} (${v.rounds}/${v.tune.gun.rounds})` : 'Ammunition bunker'
      },
      hold: 3,
      radius: 2.6,
      enabled: () => {
        const v = parked()
        if (!v) return 'Park the tank by the bunker door'
        if (v.rounds >= v.tune.gun.rounds) return 'Ready rack full'
        return true
      },
      onUse: (G) => {
        const v = parked()
        const got = v.rearm()
        G.toast(`Ready rack loaded: +${got} shells (${v.rounds}/${v.tune.gun.rounds}).`, 'loot')
        G.audio?.play('shellLoad', { pos: at })
      },
    },
    B.cx + door / 2 + 0.6,
    1.2,
    z1 + 0.6,
  )
}

// A watchtower in a fence corner: steel legs, a plank platform behind a
// sandbag parapet, a tin roof and a dead searchlight, the ladder on the yard
// side.
function guardTower(G, kit, rng) {
  const T = CAMP.tower
  const top = T.top
  const h = 1.8
  for (const [x, z] of [[-h, -h], [h, -h], [-h, h], [h, h]]) kit.post(0.22, top + 2.6, 'olive', T.x + x, T.z + z)
  for (const y of [1.8, 4.2]) {
    bar(kit, 'olive', 0.04, [T.x - h, y, T.z - h], [T.x + h, y + 2, T.z - h])
    bar(kit, 'olive', 0.04, [T.x - h, y, T.z + h], [T.x - h, y + 2, T.z - h])
    bar(kit, 'olive', 0.04, [T.x + h, y, T.z + h], [T.x - h, y + 2, T.z + h])
  }
  kit.box(2 * h + 0.6, 0.2, 2 * h + 0.6, 'wood', T.x, top, T.z, { tex: 1.5 })
  // sandbags on the three outward sides, the ladder's side open
  sandbags(G, kit, T.x, T.z - h - 0.05, 2 * h + 0.4, 0, 4, rng, top + 0.1)
  sandbags(G, kit, T.x, T.z + h + 0.05, 2 * h + 0.4, 0, 4, rng, top + 0.1)
  sandbags(G, kit, T.x - h - 0.05, T.z, 2 * h - 0.4, Math.PI / 2, 4, rng, top + 0.1)
  kit.box(2 * h + 1.2, 0.12, 2 * h + 1.2, 'rust', T.x, top + 2.65, T.z, { rx: 0.06, rz: -0.05, tex: 3 })
  kit.cyl(0.28, 0.45, 'metal', T.x - 0.8, top + 1.4, T.z + 0.8, { rx: 1.2, collide: false, seg: 10 })
  kit.box(0.1, 0.9, 0.1, 'metal', T.x - 0.8, top + 0.6, T.z + 0.8, { collide: false })
  // ladder on the +X (yard) side
  const lx = T.x + h + 0.35
  for (const z of [-0.35, 0.35]) kit.box(0.07, top + 1, 0.07, 'metal', lx, top / 2, T.z + z, { collide: false })
  for (let y = 0.4; y < top; y += 0.4) kit.box(0.04, 0.04, 0.7, 'metal', lx, y, T.z, { collide: false })
  kit.interact({ id: 'climb:campTower', label: 'Climb ladder', hold: 0, radius: 2.0, onUse: (G) => G.player.teleport(kit.point(T.x + 0.9, top + 0.1, T.z), null, 0.6) }, lx + 0.4, 1.2, T.z)
  kit.interact({ id: 'descend:campTower', label: 'Climb down', hold: 0, radius: 1.6, onUse: (G) => G.player.teleport(kit.point(lx + 1.2, kit.ground(lx + 1.2, T.z) + 0.05, T.z), null, 0) }, T.x + h - 0.4, top + 1.0, T.z)
  kit.vines(T.x - h, top - 0.2, T.z - h - 0.05, 1.4, 3.5, 0, rng)
  for (let k = 0; k < 4; k++) tuft(kit, T.x + rng.range(-h, h), T.z + rng.range(-h, h), rng, 9, 1.3)
}

// The comms mast behind the yard: a lattice tower with a dish and whips, its
// beacon long dead, held up by guy wires.
function commsMast(G, kit, rng) {
  const M = CAMP.mast
  const a = 0.7
  for (const [x, z] of [[-a, -a], [a, -a], [-a, a], [a, a]]) kit.post(0.1, M.h, 'olive', M.x + x, M.z + z)
  for (let y = 1.2; y < M.h - 1; y += 2.0) {
    kit.box(2 * a, 0.05, 0.05, 'olive', M.x, y, M.z - a, { collide: false, rz: 0.9 })
    kit.box(2 * a, 0.05, 0.05, 'olive', M.x, y, M.z + a, { collide: false, rz: -0.9 })
    kit.box(0.05, 0.05, 2 * a, 'olive', M.x - a, y + 1, M.z, { collide: false, rx: 0.9 })
    kit.box(0.05, 0.05, 2 * a, 'olive', M.x + a, y + 1, M.z, { collide: false, rx: -0.9 })
  }
  kit.cyl(0.9, 0.18, 'white', M.x + 0.4, M.h - 4, M.z + 1.0, { rx: 1.35, collide: false, seg: 14 })
  for (const s of [-1, 1]) kit.cyl(0.03, 4, 'black', M.x + s * 0.4, M.h + 2, M.z, { collide: false, seg: 4 })
  kit.push('bulb', new THREE.SphereGeometry(0.22, 8, 6), M.x, M.h + 0.25, M.z)
  for (const ang of [0.9, 3.0, 4.9]) {
    const gx = M.x + Math.cos(ang) * 5.5
    const gz = M.z + Math.sin(ang) * 5.5
    bar(kit, 'metal', 0.012, [M.x, M.h - 2, M.z], [gx, kit.ground(gx, gz) + 0.3, gz])
    kit.box(0.5, 0.5, 0.5, 'concrete', gx, kit.ground(gx, gz) + 0.1, gz)
  }
  kit.box(1.2, 1.4, 0.8, 'olive', M.x + 1.6, 0.7, M.z)
  kit.vines(M.x - a, 5, M.z + a + 0.05, 1.2, 4.5, 0, rng)
}

// The helipad beside the yard, for whatever flies in to use the camp: a
// concrete disc with its markings and a walkable top (`poi.pad`, `padYaw`
// face a parked machine out over the yard), rim lights, a windsock. 12 m
// round its centre stays clear of anything solid.
function campHelipad(G, kit, poi) {
  const P = CAMP.pad
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(P.r, P.r + 0.2, 0.35, 32), [mats().concrete, mats().helipad, mats().concrete])
  disc.position.set(P.x, 0.17, P.z)
  disc.receiveShadow = true
  kit.add(disc)
  G.physics.addBox(...kit.world(P.x, P.z), 5.8, 5.8, kit.yaw, kit.y - 0.5, kit.y + 0.35, { material: 'concrete' })
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2
    kit.push('bulb', new THREE.SphereGeometry(0.12, 6, 4), P.x + Math.cos(a) * (P.r - 0.3), 0.42, P.z + Math.sin(a) * (P.r - 0.3))
  }
  // the windsock, out past the rotor's reach
  const wx = P.x + 12.5
  const wz = P.z + 9
  kit.cyl(0.07, 5, 'white', wx, 2.5, wz, { seg: 6 })
  kit.push('orange', new THREE.CylinderGeometry(0.28, 0.12, 1.6, 8, 1, true).rotateZ(Math.PI / 2 - 0.5), wx - 0.85, 4.6, wz)
  poi.pad = kit.point(P.x, 0.35, P.z)
  poi.padYaw = kit.yaw + Math.PI / 2
}

// Floodlight poles, long dark.
function floodlight(kit, x, z) {
  kit.cyl(0.12, 8, 'olive', x, 4, z, { seg: 6 })
  kit.box(1.4, 0.1, 0.1, 'metal', x, 7.9, z, { collide: false })
  for (const s of [-1, 1]) kit.box(0.4, 0.3, 0.25, 'black', x + s * 0.55, 7.7, z, { collide: false, rx: 0.4 })
}

export function buildCamp(G, poi, rng, yaw) {
  const kit = new Kit(G, poi.x, poi.y, poi.z, yaw, 'camp')
  const F = CAMP.fence
  // the perimeter: the front either side of the gate, the back with its breach
  chainFence(G, kit, -F.hx, F.hz, -F.gate - 0.15, F.hz, rng)
  chainFence(G, kit, F.gate + 0.15, F.hz, F.hx, F.hz, rng)
  chainFence(G, kit, F.hx, F.hz, F.hx, -F.hz, rng)
  chainFence(G, kit, F.hx, -F.hz, -F.hx, -F.hz, rng, CAMP.breach)
  chainFence(G, kit, -F.hx, -F.hz, -F.hx, F.hz, rng)
  campGate(G, kit, rng)
  motorPool(G, kit, poi, rng)
  // barracks: bunks, lockers, a hole in the roof
  const Br = CAMP.barracks
  building(kit, Br.w, Br.d, Br.h, { cx: Br.cx, cz: Br.cz, mat: 'olive', roof: 'rust', door: 1.6, rng })
  for (let i = 0; i < 5; i++) {
    const x = Br.cx - Br.w / 2 + 2 + i * 3.4
    kit.box(0.9, 0.5, 2.0, 'olive', x, 0.55, Br.cz - Br.d / 2 + 1.3)
    kit.box(0.9, 0.08, 2.0, 'tarp', x, 1.7, Br.cz - Br.d / 2 + 1.3, { collide: false })
    for (const s of [-1, 1]) kit.box(0.05, 1.8, 0.05, 'metal', x + s * 0.42, 0.9, Br.cz - Br.d / 2 + 2.25, { collide: false })
  }
  for (let i = 0; i < 4; i++) kit.box(0.5, 1.9, 0.5, 'olive', Br.cx + Br.w / 2 - 0.6, 1.1, Br.cz - 2.4 + i * 0.6)
  crate(G, kit, Br.cx - 4, Br.cz + 1.6, 'crate:campBarracks', null, rng, 0.3)
  sandbags(G, kit, Br.cx + 3.6, Br.cz + Br.d / 2 + 1.5, 3.2, 0, 2, rng)
  // command post: the radio desk with the standing orders, a map table
  const C = CAMP.command
  building(kit, C.w, C.d, C.h, { cx: C.cx, cz: C.cz, door: 1.7, hole: false, rng })
  kit.box(2.4, 0.85, 0.9, 'darkWood', C.cx - 3, 0.72, C.cz - C.d / 2 + 0.9)
  kit.box(0.6, 0.4, 0.45, 'olive', C.cx - 3.6, 1.35, C.cz - C.d / 2 + 0.8)
  kit.box(0.3, 0.02, 0.22, 'white', C.cx - 2.6, 1.16, C.cz - C.d / 2 + 0.9, { collide: false })
  lore(G, kit, 'campOrders', 'Read the standing orders', C.cx - 2.6, 1.4, C.cz - C.d / 2 + 1.3)
  kit.box(2.2, 0.85, 1.4, 'darkWood', C.cx + 2, 0.72, C.cz)
  const mapTable = new THREE.Mesh(new THREE.PlaneGeometry(2, 1.2), new THREE.MeshLambertMaterial({ map: G.mapTexture }))
  mapTable.rotation.x = -Math.PI / 2
  mapTable.position.set(C.cx + 2, 1.16, C.cz)
  kit.add(mapTable)
  for (let i = 0; i < 3; i++) kit.box(0.5, 1.3, 0.6, 'olive', C.cx + C.w / 2 - 0.6, 0.8, C.cz - 2 + i * 0.65)
  for (const s of [-1, 1]) kit.cyl(0.03, 5, 'black', C.cx + s * 3.5, C.h + 2.6, C.cz - 2, { collide: false, seg: 4 })
  sandbags(G, kit, C.cx - 3.8, C.cz + C.d / 2 + 1.6, 3.4, 0, 3, rng)
  ammoBunker(G, kit, rng)
  guardTower(G, kit, rng)
  commsMast(G, kit, rng)
  campHelipad(G, kit, poi)
  for (const [x, z] of CAMP.lights) floodlight(kit, x, z)
  // the yard: a flagpole with what is left of the flag (out of the way of
  // anything leaving the motor pool), weeds in the cracks
  const flagAt = CAMP.flag
  kit.cyl(0.06, 9, 'white', flagAt[0], 4.5, flagAt[1], { seg: 6 })
  const flag = new THREE.PlaneGeometry(1.4, 0.8, 4, 1)
  const fp = flag.attributes.position
  for (let i = 0; i < fp.count; i++) fp.setZ(i, Math.sin(fp.getX(i) * 3) * 0.12)
  kit.push('tarp', flag.translate(0.7, 0, 0), flagAt[0], 8.4, flagAt[1], 0, 0.4, 0)
  for (let k = 0; k < 40; k++) {
    const x = rng.range(-F.hx + 2, F.hx - 2)
    const z = rng.range(-F.hz + 2, F.hz - 2)
    tuft(kit, x, z, rng, rng.int(4, 9), rng.range(0.6, 1.2))
  }
  kit.finish()
  // the stripped truck, as the wrecks by the roads are built
  const T = CAMP.truck
  buildWreck(G, ...kit.world(T.x, T.z), yaw + Math.PI / 2, rng, false, 'truck', 1)
  return kit
}


// ---------------------------------------------------------------- sea lab

// A railing from (ax, az) to (bx, bz) in the kit's frame, standing on `y`:
// posts, a top and a mid rail, and a wall the player can't step through.
function rail(G, kit, ax, az, bx, bz, y, mat = 'yellow') {
  const len = Math.hypot(bx - ax, bz - az)
  const ry = -Math.atan2(bz - az, bx - ax)
  const mx = (ax + bx) / 2
  const mz = (az + bz) / 2
  for (const h of [1.0, 0.55]) kit.box(len, 0.06, 0.06, mat, mx, y + h, mz, { ry, collide: false })
  const n = Math.max(1, Math.round(len / 2.4))
  for (let i = 0; i <= n; i++) kit.box(0.07, 1.04, 0.07, mat, ax + ((bx - ax) * i) / n, y + 0.52, az + ((bz - az) * i) / n, { collide: false })
  G.physics.addBox(...kit.world(mx, mz), len / 2, 0.05, kit.yaw + ry, kit.y + y, kit.y + y + 1.1, { walkable: false, material: 'metal' })
}

// A round bar from a to b (kit-local [x, y, z]), merged into the kit.
function strut(kit, mat, a, b, r) {
  const A = new THREE.Vector3(...a)
  const B = new THREE.Vector3(...b)
  const dir = B.clone().sub(A)
  const geo = new THREE.CylinderGeometry(r, r, dir.length(), 8)
  geo.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize()))
  geo.translate((A.x + B.x) / 2, (A.y + B.y) / 2, (A.z + B.z) / 2)
  kit.push(mat, geo, 0, 0, 0)
}

// A ladder up out of the sea onto a deck at `top`: rails and rungs down into
// the water, "Climb the ladder" for a swimmer at its foot and "Climb down"
// at its head (which leaves you swimming). `out` is the side the sea is on.
function seaLadder(G, kit, id, lx, lz, top, out, onDeck) {
  const sea = G.island.sea - kit.y
  const [ox, oz] = out
  const px = lx + ox * 0.25
  const pz = lz + oz * 0.25
  const sx = Math.abs(oz) * 0.3
  const sz = Math.abs(ox) * 0.3
  for (const s of [-1, 1]) kit.box(0.07, top - sea + 1.8, 0.07, 'metal', px + sx * s, (top + sea - 1.8) / 2 + 0.5, pz + sz * s, { collide: false })
  for (let y = sea - 1.6; y < top; y += 0.35) kit.box(0.06 + sx * 2, 0.04, 0.06 + sz * 2, 'metal', px, y, pz, { collide: false })
  kit.interact({ id: 'climb:' + id, label: 'Climb the ladder', hold: 0, radius: 2.2, onUse: (G) => G.player.teleport(kit.point(onDeck[0], top + 0.05, onDeck[1]), null, 0.7) }, px + ox * 0.6, sea + 0.4, pz + oz * 0.6)
  kit.interact({ id: 'dive:' + id, label: 'Climb down into the sea', hold: 0, radius: 1.5, onUse: (G) => G.player.teleport(kit.point(px + ox * 1.2, sea - 1.45, pz + oz * 1.2), null, 0.7) }, lx - ox * 0.3, top + 1.0, lz - oz * 0.3)
}

// The Foundation's marine station out on the west shelf, on steel legs in
// about twenty metres of water: a wet-lab hangar whose floor opens on the
// moon pool (the submersible hangs there in its cradle under the gantry),
// the dry lab beside it, a helipad on the hangar roof up an outside stair, a
// crane on the back deck, and a long timber pier back to the beach. The local
// frame faces the shore (+Z), so the pier runs out along +Z; +X is north.
// Rust, weed and missing planks: nobody has been out here in eleven years.
export function buildSeaLab(G, poi, rng) {
  const kit = new Kit(G, poi.x, G.island.sea, poi.z, poi.yaw, 'sealab')
  const D = 2.6 // main deck
  const W = 1.4 // wet deck, inside the hangar round the moon pool
  const R = 7.7 // hangar roof: the helipad
  const pool = { x: -6, z: 0, hw: 2.6, hl: 4.2 }
  const deck = (x0, x1, z0, z1, y, mat = 'deck') => kit.box(x1 - x0, 0.3, z1 - z0, mat, (x0 + x1) / 2, y - 0.15, (z0 + z1) / 2, { tex: 4 })

  // ---- legs into the seabed, braced at two levels round the outside, with
  // a band of weed and barnacles where the swell washes them
  const legsX = [-14.6, -0.3, 14.6]
  const legsZ = [-12.6, 0, 12.6]
  for (const x of legsX) {
    for (const z of legsZ) {
      const g = kit.ground(x, z) - 1
      const top = (x < 0 && z === 0 ? W : D) - 0.3 // under the hangar's wet deck, or a main deck
      kit.cyl(0.6, top - g, 'rustOrange', x, (top + g) / 2, z, { seg: 12 })
      kit.cyl(0.68, 1.5, 'weed', x, -0.15, z, { seg: 12, collide: false, open: true })
    }
  }
  for (const y of [-1.6, -12]) {
    for (const z of [legsZ[0], legsZ[2]]) {
      for (let i = 0; i < 2; i++) {
        const [x0, x1] = [legsX[i], legsX[i + 1]]
        // the upper ring leaves the moon pool's bay open at both ends: the
        // submersible's lane in and out, just under the decks
        if (y > -5 && x0 < pool.x && pool.x < x1) continue
        kit.box(x1 - x0, 0.4, 0.4, 'rustOrange', (x0 + x1) / 2, y, z)
      }
    }
    for (const x of [legsX[0], legsX[2]]) kit.box(0.4, 0.4, 25.2, 'rustOrange', x, y, 0)
  }
  // beams under the decks
  for (const z of [-11, -5, 5, 11]) kit.box(30, 0.35, 0.25, 'rust', 0, W - 0.5, z, { collide: false })

  // ---- decks: the landing in front, the east deck, the back deck (cast
  // slabs), and the steel wet deck round the pool, a step down inside the hangar
  deck(-15, 15, 9, 13, D, 'concrete')
  deck(0, 15, -13, 9, D, 'concrete')
  deck(-15, 0, -13, -9, D, 'concrete')
  deck(-15, pool.x - pool.hw, -9, 9, W)
  deck(pool.x + pool.hw, 0, -9, 9, W)
  deck(pool.x - pool.hw, pool.x + pool.hw, -9, pool.z - pool.hl, W)
  deck(pool.x - pool.hw, pool.x + pool.hw, pool.z + pool.hl, 9, W)
  // steps down into the hangar across its open front
  for (let i = 1; i <= 3; i++) kit.box(12, 0.3 * i + 0.3, 0.5, 'deck', -7, W + (0.3 * i - 0.3) / 2, 7.5 + (i - 0.5) * 0.5)
  // the pool's steel coaming, and the skirt of its well down to the water
  for (const sz of [-1, 1]) kit.box(pool.hw * 2 + 0.3, 0.2, 0.15, 'yellow', pool.x, W + 0.1, pool.z + sz * pool.hl, { collide: false })
  for (const sx of [-1, 1]) kit.box(0.15, 0.2, pool.hl * 2, 'yellow', pool.x + sx * pool.hw, W + 0.1, pool.z, { collide: false })
  for (const sz of [-1, 1]) kit.box(pool.hw * 2, W + 0.5, 0.08, 'rust', pool.x, (W - 0.3) / 2 - 0.25, pool.z + sz * (pool.hl + 0.04), { collide: false })
  for (const sx of [-1, 1]) kit.box(0.08, W + 0.5, pool.hl * 2, 'rust', pool.x + sx * (pool.hw + 0.04), (W - 0.3) / 2 - 0.25, pool.z, { collide: false })

  // From under the sea the platform's shadow lies on the surface, and the
  // moon pool is the one bright hole in it: a dark sheet just under the
  // water, facing down (from above it is never seen).
  const shadeGeo = mergeGeometries(
    [
      [-15, pool.x - pool.hw, -13, 13],
      [pool.x + pool.hw, 15, -13, 13],
      [pool.x - pool.hw, pool.x + pool.hw, -13, pool.z - pool.hl],
      [pool.x - pool.hw, pool.x + pool.hw, pool.z + pool.hl, 13],
    ].map(([x0, x1, z0, z1]) => new THREE.PlaneGeometry(x1 - x0, z1 - z0).rotateX(Math.PI / 2).translate((x0 + x1) / 2, G.island.sea - kit.y - 0.15, (z0 + z1) / 2)),
  )
  const shade = new THREE.Mesh(shadeGeo, new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.55, depthWrite: false }))
  shade.renderOrder = 1
  kit.add(shade)

  // ---- railings: the deck's outer edges (gaps for the pier and the ladder),
  // three sides of the pool (its east side is where you board), the roof
  rail(G, kit, -15, 13, -12.7, 13, D)
  rail(G, kit, -11.3, 13, 3, 13, D)
  rail(G, kit, 6, 13, 15, 13, D)
  rail(G, kit, 15, 13, 15, -13, D)
  rail(G, kit, 15, -13, -15, -13, D)
  rail(G, kit, -15, -13, -15, -9, D)
  rail(G, kit, -15, 9, -15, 13, D)
  rail(G, kit, pool.x - pool.hw, pool.z - pool.hl - 0.2, pool.x + pool.hw, pool.z - pool.hl - 0.2, W)
  rail(G, kit, pool.x - pool.hw, pool.z + pool.hl + 0.2, pool.x + pool.hw, pool.z + pool.hl + 0.2, W)
  rail(G, kit, pool.x - pool.hw - 0.2, pool.z - pool.hl, pool.x - pool.hw - 0.2, pool.z + 2.2, W)

  // ---- the hangar: corrugated walls, open across the front, the roof a pad
  const H = R - 0.3
  kit.box(0.2, H - W, 18, 'rust', -15, (H + W) / 2, 0, { tex: 3 })
  kit.box(15, H - W, 0.2, 'rust', -7.5, (H + W) / 2, -9, { tex: 3 })
  kit.box(0.2, H - W, 18, 'rust', 0, (H + W) / 2, 0, { tex: 3 })
  for (const [x0, x1] of [
    [-15, -13],
    [-1, 0],
  ])
    kit.box(x1 - x0, H - W, 0.2, 'rust', (x0 + x1) / 2, (H + W) / 2, 9, { tex: 3 })
  kit.box(12, 1.2, 0.2, 'rust', -7, H - 0.6, 9, { tex: 3 })
  // a wall panel torn loose and hanging, for the weather to get in
  kit.box(2.4, 2.6, 0.06, 'rust', -14.75, 4.4, -4.5, { ry: Math.PI / 2, rz: 0.35, collide: false, tex: 3 })
  kit.box(15.6, 0.3, 18.6, 'concrete', -7.5, R - 0.15, 0, { tex: 3 })
  const pad = new THREE.Mesh(new THREE.CylinderGeometry(6.2, 6.2, 0.06, 32), [mats().concrete, mats().helipad, mats().concrete])
  pad.position.set(-7.5, R + 0.03, 0)
  pad.rotation.y = Math.PI / 2
  pad.receiveShadow = true
  kit.add(pad)
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2
    kit.push('bulb', new THREE.SphereGeometry(0.1, 6, 4), -7.5 + Math.cos(a) * 6.8, R + 0.12, Math.sin(a) * 6.8)
  }
  rail(G, kit, -15.2, -9.2, 0.2, -9.2, R)
  rail(G, kit, -15.2, 9.2, 0.2, 9.2, R)
  rail(G, kit, -15.2, -9.2, -15.2, 9.2, R)
  rail(G, kit, 0.2, -9.2, 0.2, -2.6, R)
  rail(G, kit, 0.2, 0.25, 0.2, 9.2, R)
  // the stair up the hangar's east side to the pad: risers the player can
  // walk (0.29 m on 0.5 m treads), a landing at the top, a rail on its open side
  const steps = 17
  const rise = (R - D) / steps
  for (let i = 1; i <= steps; i++) {
    const top = D + rise * i
    const z = 8.75 - (i - 0.5) * 0.5
    kit.box(1.8, top - D + 0.3, 0.5, 'deck', 1.2, (top + D - 0.3) / 2, z)
    G.physics.addBox(...kit.world(2.18, z), 0.04, 0.25, kit.yaw, kit.y + top, kit.y + top + 1.05, { walkable: false, material: 'metal' })
  }
  kit.box(1.8, 0.3, 2.85, 'deck', 1.2, R - 0.15, -1.175)
  strut(kit, 'yellow', [2.18, D + 1.0, 8.75], [2.18, R + 1.0, 0.25], 0.03)
  rail(G, kit, 2.18, 0.25, 2.18, -2.6, R)
  rail(G, kit, 2.18, -2.6, 0.3, -2.6, R)

  // ---- the moon pool's gantry, hoist and cradle (where the sub hangs)
  for (const z of [-5, 5]) {
    for (const x of [pool.x - pool.hw - 0.7, pool.x + pool.hw + 0.7]) kit.box(0.3, 5.0, 0.3, 'yellow', x, W + 2.5, z)
    kit.box(pool.hw * 2 + 1.7, 0.4, 0.35, 'yellow', pool.x, W + 5.1, z, { collide: false })
  }
  kit.box(0.35, 0.45, 10.4, 'yellow', pool.x, W + 4.75, pool.z, { collide: false })
  const sea = G.island.sea - kit.y
  for (const z of [-1.8, 1.8]) {
    kit.box(0.6, 0.5, 0.6, 'black', pool.x, W + 4.3, z, { collide: false })
    for (const s of [-1, 1]) strut(kit, 'black', [pool.x, W + 4.1, z], [pool.x + s * 1.15, sea + 1.75, z], 0.02)
    kit.box(2.5, 0.08, 0.14, 'orange', pool.x, sea + 1.7, z, { collide: false })
  }
  for (const s of [-1, 1]) kit.box(0.12, 0.12, 4.0, 'orange', pool.x + s * 1.15, sea + 1.72, pool.z, { collide: false })
  // the pool ladder for anyone who falls in, the winch panel, the dive board
  seaLadder(G, kit, 'moonpool', pool.x - pool.hw, pool.z + 3, W, [1, 0], [pool.x - pool.hw - 1.0, pool.z + 3])
  kit.box(0.9, 1.4, 0.5, 'yellow', -1.0, W + 0.7, -6.5)
  kit.box(0.5, 0.3, 0.06, 'black', -1.0, W + 1.2, -6.24, { collide: false })
  const charge = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 4), mats().bulb.clone())
  charge.material.emissive.setHex(0x30d070)
  charge.position.set(-0.75, W + 1.25, -6.22)
  kit.add(charge)
  kit.interact(
    {
      id: 'subWinch',
      label: () => (G.sub && G.sub.needsService() ? 'Winch the submersible up — patch the hull' : 'Moon pool winch'),
      hold: 3,
      radius: 2.4,
      enabled: (G) => {
        const sub = G.sub
        if (!sub || !sub.inPool()) return 'Bring the submersible into the moon pool'
        if (sub.occupied) return 'Climb out of her first'
        if (!sub.needsService()) return 'She is sound — nothing to patch'
        return true
      },
      onUse: (G) => {
        G.sub.service()
        G.toast('Winched up, patched and lowered back — the submersible’s hull is sound again.', 'info', 6)
        G.audio?.play('pump', { pos: G.sub.pos })
        G.audio?.play('repair', { pos: G.sub.pos })
      },
    },
    -1.0,
    W + 1.2,
    -6.0,
  )
  kit.box(1.6, 1.1, 0.05, 'white', -2.2, W + 1.7, -8.85, { collide: false })
  lore(G, kit, 'sealabBoard', 'Read the dive board', -2.2, W + 1.5, -8.4)

  // ---- the wet lab: specimen tanks along the west wall, a bench, buoys
  for (let i = 0; i < 3; i++) {
    const z = -6.2 + i * 4.6
    kit.box(2.2, 0.6, 3.6, 'metal', -13.4, W + 0.3, z)
    kit.push('tank', new THREE.BoxGeometry(2.0, 1.6, 3.4), -13.4, W + 1.4, z)
    G.physics.addBox(...kit.world(-13.4, z), 1.0, 1.7, kit.yaw, kit.y + W, kit.y + W + 2.2, { walkable: false, material: 'metal' })
    kit.box(2.1, 0.08, 3.5, 'black', -13.4, W + 2.24, z, { collide: false })
    // what is left in them: weed, and a shell on the gravel
    kit.vines(-13.4, W + 2.1, z, 1.6, 1.3, Math.PI / 2, rng)
    if (i !== 1) kit.cyl(0.25, 0.12, 'rustWhite', -13.2, W + 0.7, z + 0.6, { collide: false, rx: Math.PI / 2, seg: 10 })
  }
  kit.box(1.0, 0.9, 4, 'white', -10.2, W + 0.45, -6)
  for (let i = 0; i < 5; i++) kit.cyl(0.08, 0.22, 'glass', -10.2, W + 1.0, -7.5 + i * 0.6, { collide: false, seg: 8 })
  for (let i = 0; i < 4; i++) kit.cyl(0.32, 0.9, i % 2 ? 'orange' : 'rust', -12.6 + (i % 2) * 0.75, W + 0.45, 6.6 - Math.floor(i / 2) * 0.75, { seg: 10 })
  lifeRing(kit, -0.12, W + 2.2, 3.6, Math.PI / 2)
  crate(G, kit, -11, 2.4, 'crate:sealab', { items: { medkit: 1, flare: 2, rifleDart: 4 } }, rng, W)

  // ---- the dry lab, up on the east deck
  const lab = new Kit(G, kit.x, kit.y + D, kit.z, kit.yaw, 'sealab-lab')
  building(lab, 10, 11, 3.4, { cx: 9, cz: -3, door: 1.8, rng })
  for (let i = 0; i < 2; i++) lab.box(3, 0.9, 0.8, 'white', 7 + i * 4, 0.75, -7.6)
  for (let i = 0; i < 3; i++) lab.box(0.25, 0.4, 0.3, 'black', 6 + i * 1.6, 1.4, -7.7, { collide: false })
  lab.box(1.1, 1.0, 0.7, 'metal', 12.6, 0.8, 1.2)
  lore(G, lab, 'sealabLog', 'Read the station log', 12.6, 1.4, 0.8)
  lab.box(0.8, 1.9, 0.7, 'white', 4.7, 1.25, -7.5)
  // the survey chart pinned to the back wall, the sea shelf circled
  if (G.mapTexture) {
    const chart = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.5), new THREE.MeshLambertMaterial({ map: G.mapTexture }))
    chart.position.set(10, 2.0, -8.17)
    lab.add(chart)
  }
  lab.finish()

  // ---- the crane on the back deck, its boom out over the sea
  kit.cyl(0.75, 1.6, 'yellow', -11, D + 0.8, -11.2, { seg: 12 })
  kit.box(2.4, 0.4, 2.4, 'yellow', -11, D + 1.8, -11.2)
  kit.box(1.5, 1.7, 1.6, 'yellow', -10.6, D + 2.85, -10.6)
  kit.box(1.2, 0.7, 0.05, 'glass', -10.6, D + 3.1, -11.42, { collide: false })
  kit.box(1.8, 1.2, 1.0, 'rust', -11.6, D + 2.6, -10.2, { collide: false })
  const boomLen = 13
  const lift = 0.62
  kit.box(0.5, 0.5, boomLen, 'yellow', -11.4, D + 2.6 + (Math.sin(lift) * boomLen) / 2, -11.6 - (Math.cos(lift) * boomLen) / 2, { rx: lift, collide: false })
  const tipY = D + 2.6 + Math.sin(lift) * boomLen
  const tipZ = -11.6 - Math.cos(lift) * boomLen
  strut(kit, 'black', [-11.4, tipY, tipZ], [-11.4, D + 3.6, tipZ], 0.02)
  kit.box(0.4, 0.5, 0.3, 'black', -11.4, D + 3.4, tipZ, { collide: false })
  // lamp posts, dead since the generator stopped
  for (const [x, z] of [
    [13.6, 11.6],
    [13.6, -11.6],
  ]) {
    kit.cyl(0.1, 5, 'metal', x, D + 2.5, z, { seg: 6 })
    kit.push('bulb', new THREE.SphereGeometry(0.18, 8, 6), x - 0.6, D + 4.9, z)
    kit.box(0.9, 0.06, 0.06, 'metal', x - 0.35, D + 5.0, z, { collide: false })
  }
  lifeRing(kit, 15.1, D + 0.7, 6, Math.PI / 2)
  lifeRing(kit, -3, D + 0.7, 13.1, 0)
  // weed hanging off the deck edges where the spray reaches
  for (const [x, z, w, ry] of [
    [-6, 13.1, 10, 0],
    [8, 13.1, 8, 0],
    [15.1, 0, 16, Math.PI / 2],
    [0, -13.1, 20, 0],
  ])
    kit.vines(x, D - 0.3, z, w, 1.3, ry, rng)
  seaLadder(G, kit, 'sealab', -12, 13, D, [0, 1], [-12, 11.6])

  // ---- the pier back to the beach: timber on paired piles, rails both
  // sides with a couple of spans gone, a few planks missing
  const px = 4.5
  let end = 13
  for (let z = 13; z < 260; z += 0.5) {
    if (kit.ground(px, z) > D - 0.25) {
      end = z + 1
      break
    }
  }
  const len = end - 13
  for (let z = 13; z < end; z += 3.2) {
    const l = Math.min(3.0, end - z)
    if (rng.chance(0.12) && z > 20 && z < end - 8) {
      // a section with its middle planks gone (the joists still hold you)
      for (const x of [-1.2, 1.2]) kit.box(0.7, 0.2, l, 'wood', px + x, D - 0.1, z + l / 2, { collide: false, tex: 1.5 })
      kit.box(3.1, 0.12, 0.2, 'darkWood', px, D - 0.3, z + l / 2, { collide: false })
    } else kit.box(3.1, 0.2, l, 'wood', px, D - 0.1, z + l / 2, { collide: false, tex: 1.5 })
  }
  G.physics.addBox(...kit.world(px, 13 + len / 2), 1.55, len / 2, kit.yaw, kit.y + D - 0.4, kit.y + D, { material: 'wood' })
  for (let z = 15; z < end - 0.5; z += 6) {
    for (const x of [-1.45, 1.45]) {
      const g = kit.ground(px + x, z) - 0.8
      kit.cyl(0.2, D - 0.2 - g, 'darkWood', px + x, (D - 0.2 + g) / 2, z, { seg: 7 })
    }
  }
  for (let z = 13; z < end - 3; z += 6) {
    for (const side of [-1, 1]) {
      const x = px + side * 1.55
      const z1 = Math.min(z + 6, end - 1)
      kit.box(0.12, 1.1, 0.12, 'darkWood', x, D + 0.55, z, { collide: false })
      // two spans have lost their rail: nothing stops you going over there
      if ((side < 0 && z > 40 && z < 47) || (side > 0 && z > 64 && z < 71)) continue
      kit.box(0.08, 0.08, z1 - z, 'darkWood', x, D + 1.05, (z + z1) / 2, { collide: false })
      G.physics.addBox(...kit.world(x, (z + z1) / 2), 0.06, (z1 - z) / 2, kit.yaw, kit.y + D, kit.y + D + 1.1, { walkable: false, material: 'wood' })
    }
  }
  sign(G, kit, ['FOUNDATION SEA LAB', 'MARINE STATION SL-2'], px - 3.4, end + 1.5, 0, { bg: '#2f4a5a' })

  kit.finish()
  const [mx, mz] = kit.world(pool.x, pool.z)
  poi.moonpool = {
    x: mx,
    z: mz,
    yaw: kit.yaw, // the sub lies in it nose to sea
    hw: pool.hw,
    hl: pool.hl,
    exit: kit.point(pool.x + pool.hw + 1.1, W, pool.z + 0.5),
  }
  poi.pad = kit.point(-7.5, R, 0)
  return kit
}

// An orange life ring hung on a rail or a wall.
function lifeRing(kit, x, y, z, ry) {
  kit.push('orange', new THREE.TorusGeometry(0.34, 0.08, 6, 16), x, y, z, 0, ry, 0)
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
  // its own stream, like the poles, so the shed never reshuffles the wrecks
  if (isl.lots.keeperShed) buildKeeperShed(G, isl.lots.keeperShed, new Rng(isl.cfg.seed + 507))
  buildRelay(G, P.summit, rng)
  // its own stream too, so the camp never reshuffles the wrecks
  if (P.milbase) buildCamp(G, P.milbase, new Rng(isl.cfg.seed + 508), roadFacing(isl, P.milbase))
  for (const b of isl.bridges) buildBridge(G, b, rng)
  // the poles draw from their own streams, so moving one never reshuffles
  // the wrecks
  buildPoles(G, isl.roads[0], new Rng(isl.cfg.seed + 505))
  buildPoles(G, isl.roads[1], new Rng(isl.cfg.seed + 506))
  // wrecks along the roads, where Island.placeWrecks found room for them
  for (const w of isl.wrecks) buildWreck(G, w.x, w.z, w.yaw, rng, w.crate, w.kind, w.roadSide)
  // its own stream, so the sea lab never reshuffles anything on land
  if (P.sealab) buildSeaLab(G, P.sealab, new Rng(isl.cfg.seed + 611))
}
