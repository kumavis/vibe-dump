import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { concrete, planks, corrugated, paintedMetal, signTexture } from './textures.js'
import { Rng } from '../core/rng.js'
import { CACHES, LOOT } from '../data/items.js'
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
    helipad: L({ map: helipadTexture() }),
  }
  return MATS
}

function helipadTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 512
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#7a7a74'
  ctx.fillRect(0, 0, 512, 512)
  for (let i = 0; i < 3000; i++) {
    ctx.fillStyle = `rgba(${Math.random() < 0.5 ? '40,40,30' : '200,200,190'},${Math.random() * 0.12})`
    ctx.fillRect(Math.random() * 512, Math.random() * 512, Math.random() * 6, Math.random() * 6)
  }
  ctx.strokeStyle = '#d8c850'
  ctx.lineWidth = 18
  ctx.beginPath()
  ctx.arc(256, 256, 210, 0, Math.PI * 2)
  ctx.stroke()
  ctx.fillStyle = '#e8e4d8'
  ctx.fillRect(160, 130, 50, 252)
  ctx.fillRect(302, 130, 50, 252)
  ctx.fillRect(160, 230, 192, 50)
  // grime and cracks
  ctx.strokeStyle = 'rgba(30,30,20,0.5)'
  ctx.lineWidth = 2
  for (let i = 0; i < 14; i++) {
    ctx.beginPath()
    let x = Math.random() * 512
    let y = Math.random() * 512
    ctx.moveTo(x, y)
    for (let k = 0; k < 6; k++) ctx.lineTo((x += (Math.random() - 0.5) * 60), (y += (Math.random() - 0.5) * 60))
    ctx.stroke()
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
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
  push(matKey, geo, lx, ly, lz, rx = 0, ry = 0, rz = 0) {
    M4.compose(V4.set(lx, ly, lz), Q4.setFromEuler(E4.set(rx, ry, rz)), S4)
    geo.applyMatrix4(M4)
    ;(this.buckets[matKey] ||= []).push(geo)
  }
  box(w, h, d, matKey, lx, ly, lz, opts = {}) {
    const { ry = 0, rx = 0, rz = 0, collide = true, walkable = true, tex = 2 } = opts
    this.push(matKey, boxGeo(w, h, d, tex), lx, ly, lz, rx, ry, rz)
    if (collide && !rx && !rz) {
      const [x, z] = this.world(lx, lz)
      this.G.physics.addBox(x, z, w / 2, d / 2, this.yaw + ry, this.y + ly - h / 2, this.y + ly + h / 2, { walkable })
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

function crate(G, kit, lx, lz, id, bundle, rng, ly = null) {
  const y = ly ?? kit.ground(lx, lz)
  const mesh = new THREE.Mesh(boxGeo(1.1, 0.75, 0.75, 1), mats().wood)
  mesh.position.set(lx, y + 0.375, lz)
  mesh.rotation.y = rng.range(-0.4, 0.4)
  mesh.castShadow = mesh.receiveShadow = true
  kit.add(mesh)
  const [wx, wz] = kit.world(lx, lz)
  G.physics.addBox(wx, wz, 0.55, 0.375, kit.yaw + mesh.rotation.y, kit.y + y, kit.y + y + 0.75)
  kit.interact(
    {
      id,
      label: 'Search supply crate',
      hold: 0.7,
      once: true,
      radius: 2.2,
      onUse: (G) => {
        const lines = G.inventory.grant(bundle || rng.weighted(LOOT).items)
        G.toast(lines.length ? `Found: ${lines.join(', ')}` : 'Crate is empty — you are carrying all you can.', 'loot')
        mesh.material = mats().darkWood
        G.audio?.play('crate', { pos: mesh.getWorldPosition(new THREE.Vector3()) })
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

function sign(G, kit, lines, lx, lz, ry = 0, opts = {}) {
  const g = kit.ground(lx, lz)
  kit.box(0.14, 2.2, 0.14, 'darkWood', lx - 0.9, g + 1.1, lz, { ry })
  kit.box(0.14, 2.2, 0.14, 'darkWood', lx + 0.9, g + 1.1, lz, { ry })
  const tex = signTexture(lines, opts)
  const board = new THREE.Mesh(new THREE.BoxGeometry(2.3, 1.05, 0.08), [
    mats().darkWood,
    mats().darkWood,
    mats().darkWood,
    mats().darkWood,
    new THREE.MeshLambertMaterial({ map: tex }),
    new THREE.MeshLambertMaterial({ map: tex }),
  ])
  board.position.set(lx, g + 1.75, lz)
  board.rotation.set(opts.tilt || 0.04, ry, opts.lean || 0.05)
  board.castShadow = true
  kit.add(board)
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
  G.physics.addBox(...kit.world(0, start + len / 2), 2, len / 2, kit.yaw, deckY - 0.4, deckY)
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
  G.physics.addBox(...kit.world(3.8, end - 6), 1.2, 3.25, kit.yaw, -0.5, 1.0)
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
  sign(G, kit, ['RANGER STATION', 'ALPHA'], -3.5, 9.5, 0)
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
  G.physics.addBox(...kit.world(pad.x, pad.z), 5.8, 5.8, yaw, kit.y - 0.5, kit.y + 0.35)
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
  kit.interact(
    {
      id: 'fuelPump',
      label: () => (G.heli && G.heli.fuel > 0.98 ? 'Helicopter tank is full' : 'Run fuel pump (refuel helicopter)'),
      hold: 2.5,
      radius: 2.4,
      enabled: (G) => {
        if (!G.flags.get('labPower')) return 'Pump is dead — no power'
        if (!G.heli || G.heli.pos.distanceTo(poi.pad) > 14) return 'Helicopter is not on the pad'
        return true
      },
      onUse: (G) => {
        G.heli.fuel = 1
        G.flags.set('heliFueled')
        G.toast('Helicopter refuelled. Climb aboard with E.', 'info')
        G.audio?.play('pump', { pos: poi.pad })
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
  G.physics.addBox(...kit.world(hg.cx + 1, hg.cz - 3.6), 0.7, 0.45, yaw, poi.y, poi.y + 1.15)
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

  // light poles + power-on behaviour
  const bulbs = [genLamp, ...padLights]
  const lights = []
  for (const [x, z] of [
    [0, 0],
    [-4, -20],
    [24, -6],
    [4, 16],
  ]) {
    kit.cyl(0.12, 7, 'metal', x, 3.5, z, { seg: 6 })
    kit.box(1.2, 0.08, 0.08, 'metal', x + 0.5, 6.9, z, { collide: false })
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 6), mats().bulb.clone())
    b.position.set(x + 1.0, 6.75, z)
    kit.add(b)
    bulbs.push(b)
  }
  for (const [x, z] of [
    [2, 0],
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
  for (let i = 0; i < 9; i++) {
    if (i === 3 || i === 6) continue
    const x = -36 + i * 6
    kit.post(0.12, 2.2, 'metal', x, -30)
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
  const R = 58
  const sides = 16
  const postGeo = []
  for (let k = 0; k < sides; k++) {
    const a0 = (k / sides) * Math.PI * 2
    const a1 = ((k + 1) / sides) * Math.PI * 2
    const x0 = Math.cos(a0) * R
    const z0 = Math.sin(a0) * R
    const x1 = Math.cos(a1) * R
    const z1 = Math.sin(a1) * R
    const broken = rng.chance(0.3) || k === 4
    const gate = k === 12
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
  const ga = (12.5 / sides) * Math.PI * 2
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

export function buildBridge(G, b, rng) {
  const kit = new Kit(G, b.x, b.y, b.z, b.yaw, 'bridge')
  const L = b.length
  for (let z = -L / 2; z < L / 2; z += 1.2) {
    if (rng.chance(0.06)) continue
    kit.box(4.6, 0.18, 1.0, 'wood', 0, -0.09, z + 0.6, { collide: false, tex: 1.5 })
  }
  G.physics.addBox(b.x, b.z, 2.3, L / 2, b.yaw, b.y - 0.5, b.y)
  for (const x of [-2.4, 2.4]) {
    kit.box(0.4, 0.5, L, 'darkWood', x, -0.4, 0, { collide: false })
    for (let z = -L / 2; z <= L / 2; z += 3) kit.box(0.12, 1.1, 0.12, 'darkWood', x, 0.55, z)
    kit.box(0.1, 0.1, L, 'darkWood', x, 1.05, 0, { collide: false })
    G.physics.addBox(...kit.world(x, 0), 0.08, L / 2, b.yaw, b.y, b.y + 1.1, { walkable: false })
  }
  for (let z = -L / 2 + 6; z < L / 2 - 4; z += 9) {
    for (const x of [-2.2, 2.2]) {
      const g = kit.ground(x, z)
      if (g > -0.8) continue
      kit.box(0.4, -g + 0.5, 0.4, 'darkWood', x, g / 2 - 0.25, z, { collide: true })
    }
  }
  kit.finish()
  return kit
}

export function buildWreck(G, x, z, yaw, rng, withCrate) {
  const y = G.island.heightAt(x, z)
  const kit = new Kit(G, x, y, z, yaw, 'wreck')
  const tilt = rng.range(-0.08, 0.08)
  kit.box(1.9, 0.8, 4.1, rng.chance(0.5) ? 'orange' : 'green', 0, 0.8, 0, { rz: tilt, collide: false })
  kit.box(1.8, 0.5, 1.6, 'metal', 0, 1.45, -0.2, { rz: tilt, collide: false })
  kit.box(1.85, 0.08, 1.5, 'black', 0, 1.75, 0.9, { collide: false, rx: -0.3 })
  for (const [wx, wz] of [
    [-0.95, 1.3],
    [0.95, 1.3],
    [-0.95, -1.3],
  ])
    kit.cyl(0.42, 0.3, 'black', wx, 0.42, wz, { rz: Math.PI / 2, collide: false, seg: 10 })
  G.physics.addBox(x, z, 0.95, 2.05, yaw, y, y + 1.6)
  kit.vines(0, 1.5, 2.06, 1.6, 1.0, 0, rng)
  if (withCrate) crate(G, kit, 2.2, -0.5, `crate:wreck:${Math.round(x)}:${Math.round(z)}`, null, rng)
  kit.finish()
}

// Power poles along a road polyline, some leaning, as one merged mesh.
export function buildPoles(G, road, rng) {
  const kit = new Kit(G, 0, 0, 0, 0, 'poles')
  let acc = 0
  for (let k = 1; k < road.pts.length; k++) {
    const [ax, az] = road.pts[k - 1]
    const [bx, bz] = road.pts[k]
    acc += Math.hypot(bx - ax, bz - az)
    if (acc < 36) continue
    acc = 0
    const dx = bx - ax
    const dz = bz - az
    const l = Math.hypot(dx, dz) || 1
    const px = bx + (-dz / l) * 5.5
    const pz = bz + (dx / l) * 5.5
    const g = G.island.heightAt(px, pz)
    const lean = rng.chance(0.25) ? rng.range(0.1, 0.35) * rng.sign() : 0
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
  buildPoles(G, isl.roads[0], rng)
  buildPoles(G, isl.roads[1], rng)
  // wrecks along the roads
  const wrecks = [
    [0, 0.55, true],
    [1, 0.22, false],
    [1, 0.62, true],
    [2, 0.5, true],
    [3, 0.6, false],
  ]
  for (const [ri, f, withCrate] of wrecks) {
    const r = isl.roads[ri]
    if (!r) continue
    const k = Math.floor(r.pts.length * f)
    const [ax, az] = r.pts[k]
    const [bx, bz] = r.pts[Math.min(r.pts.length - 1, k + 1)]
    const dx = bx - ax
    const dz = bz - az
    const l = Math.hypot(dx, dz) || 1
    const side = rng.sign()
    buildWreck(G, ax + (-dz / l) * 6 * side, az + (dx / l) * 6 * side, Math.atan2(dx, dz) + rng.range(-0.6, 0.6), rng, withCrate)
  }
}
