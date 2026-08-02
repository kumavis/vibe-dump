// The 3D park: terrain, plots, buildings, fences, dinosaurs, guests, weather.
// world.syncState(state) diffs sim state into meshes; world.update() animates.

import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GRID, CELL, SPAN, FENCES, SPECIES, plotPrice, fmtMoney } from './data.js'
import { makeDino, makeEmote } from './dinos.js'

const TILE_TOP = 0.55
const HALF = SPAN / 2

export function plotPos(r, c) {
  const mid = (GRID.N - 1) / 2
  return { x: (c - mid) * CELL, z: (r - mid) * CELL }
}

function mat(color, extra = {}) {
  return new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.95, ...extra })
}

const SPH = new THREE.SphereGeometry(1, 10, 8)
const CONE = new THREE.ConeGeometry(1, 1, 8)
const CYL = new THREE.CylinderGeometry(1, 1, 1, 10)
const BOX = new THREE.BoxGeometry(1, 1, 1)

function mesh(g, m, x = 0, y = 0, z = 0) {
  const o = new THREE.Mesh(g, m)
  o.position.set(x, y, z)
  o.castShadow = true
  o.receiveShadow = true
  return o
}

function textTexture(text, { w = 256, h = 96, bg = '#fdf3d8', fg = '#6b4a2b', size = 44 } = {}) {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = bg
  ctx.beginPath()
  ctx.roundRect(4, 4, w - 8, h - 8, 18)
  ctx.fill()
  ctx.strokeStyle = fg
  ctx.lineWidth = 6
  ctx.stroke()
  ctx.fillStyle = fg
  ctx.font = `bold ${size}px system-ui, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, w / 2, h / 2 + 2)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// ------------------------------------------------- building meshes

function buildShack() {
  const g = new THREE.Group()
  const base = mesh(BOX, mat(0xf2c14e), 0, 0.9, 0)
  base.scale.set(2.6, 1.8, 2.0)
  g.add(base)
  const counter = mesh(BOX, mat(0xa9713f), 0, 0.75, 1.15)
  counter.scale.set(2.6, 0.5, 0.3)
  g.add(counter)
  for (let i = 0; i < 6; i++) {
    const stripe = mesh(BOX, mat(i % 2 ? 0xffffff : 0xe5533d), -1.25 + i * 0.5, 2.05, 1.0)
    stripe.scale.set(0.5, 0.1, 1.0)
    stripe.rotation.x = -0.35
    g.add(stripe)
  }
  const dog = mesh(CYL, mat(0xc96f3a), 0, 2.6, 0)
  dog.scale.set(0.28, 1.3, 0.28)
  dog.rotation.z = Math.PI / 2
  g.add(dog)
  return g
}

function buildGift() {
  const g = new THREE.Group()
  const base = mesh(BOX, mat(0x9fd0e8), 0, 1.0, 0)
  base.scale.set(2.6, 2.0, 2.4)
  g.add(base)
  const roof = mesh(CONE, mat(0xe87ba4), 0, 2.85, 0)
  roof.scale.set(2.2, 1.7, 2.2)
  g.add(roof)
  const star = mesh(SPH, mat(0xffd54f, { emissive: 0x996f00 }), 0, 3.9, 0)
  star.scale.setScalar(0.32)
  g.add(star)
  const door = mesh(BOX, mat(0x6b4a2b), 0, 0.7, 1.21)
  door.scale.set(0.8, 1.4, 0.1)
  g.add(door)
  return g
}

function buildRestroom() {
  const g = new THREE.Group()
  const base = mesh(BOX, mat(0xcfd8dc), 0, 0.8, 0)
  base.scale.set(2.4, 1.6, 1.6)
  g.add(base)
  const roof = mesh(BOX, mat(0x78909c), 0, 1.7, 0)
  roof.scale.set(2.7, 0.25, 1.9)
  g.add(roof)
  for (const [x, color] of [[-0.6, 0x4a90d9], [0.6, 0xe87ba4]]) {
    const door = mesh(BOX, mat(color), x, 0.65, 0.81)
    door.scale.set(0.6, 1.2, 0.08)
    g.add(door)
  }
  return g
}

function buildGarden() {
  const g = new THREE.Group()
  for (const [x, z, h, r] of [[-0.9, -0.5, 1.4, 0.7], [0.7, 0.3, 1.9, 0.85], [-0.1, 1.0, 1.1, 0.55]]) {
    const trunk = mesh(CYL, mat(0x8d6e63), x, h * 0.35, z)
    trunk.scale.set(0.14, h * 0.7, 0.14)
    const ball = mesh(SPH, mat(0x66bb6a), x, h, z)
    ball.scale.setScalar(r)
    g.add(trunk, ball)
  }
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2
    const bloom = mesh(SPH, mat([0xe5533d, 0xffd54f, 0xe87ba4][i % 3]), Math.cos(a) * 1.9, 0.18, Math.sin(a) * 1.9)
    bloom.scale.setScalar(0.16)
    g.add(bloom)
  }
  return g
}

function buildFountain() {
  const g = new THREE.Group()
  const basin = mesh(CYL, mat(0xb8c4cc), 0, 0.3, 0)
  basin.scale.set(1.9, 0.6, 1.9)
  const tier = mesh(CYL, mat(0xcfd8dc), 0, 0.95, 0)
  tier.scale.set(0.9, 0.7, 0.9)
  const top = mesh(CYL, mat(0xcfd8dc), 0, 1.55, 0)
  top.scale.set(0.45, 0.5, 0.45)
  const water = mesh(CYL, mat(0x7fd4f2, { transparent: true, opacity: 0.85, emissive: 0x1a5f78 }), 0, 0.62, 0)
  water.scale.set(1.7, 0.08, 1.7)
  g.add(basin, tier, top, water)
  g.userData.anim = { type: 'fountain', water }
  return g
}

function buildGenerator() {
  const g = new THREE.Group()
  const base = mesh(BOX, mat(0x8d9aa5), 0, 0.7, 0)
  base.scale.set(2.2, 1.4, 1.6)
  g.add(base)
  for (let i = 0; i < 3; i++) {
    const drum = mesh(CYL, mat(0xffd54f), -0.7 + i * 0.7, 1.6, 0)
    drum.scale.set(0.26, 0.5, 0.26)
    g.add(drum)
  }
  const fan = mesh(BOX, mat(0x37474f), 0, 1.0, 0.85)
  fan.scale.set(0.9, 0.9, 0.1)
  g.add(fan)
  const bolt = mesh(CONE, mat(0xffe94a, { emissive: 0x8a7500 }), 0.9, 1.9, 0)
  bolt.scale.set(0.2, 0.5, 0.2)
  bolt.rotation.z = Math.PI
  g.add(bolt)
  g.userData.anim = { type: 'generator', fan }
  return g
}

function buildRanger() {
  const g = new THREE.Group()
  for (const [x, z] of [[-0.8, -0.8], [0.8, -0.8], [-0.8, 0.8], [0.8, 0.8]]) {
    const leg = mesh(CYL, mat(0x8d6e63), x, 1.0, z)
    leg.scale.set(0.12, 2.0, 0.12)
    g.add(leg)
  }
  const cabin = mesh(BOX, mat(0xa9713f), 0, 2.5, 0)
  cabin.scale.set(2.2, 1.1, 2.2)
  const roof = mesh(CONE, mat(0x5d8a4a), 0, 3.6, 0)
  roof.scale.set(1.9, 1.1, 1.9)
  const antenna = mesh(CYL, mat(0xcfd8dc), 0.7, 4.6, 0)
  antenna.scale.set(0.04, 1.4, 0.04)
  const beacon = mesh(SPH, mat(0xe5533d, { emissive: 0x7a1410 }), 0.7, 5.3, 0)
  beacon.scale.setScalar(0.14)
  g.add(cabin, roof, antenna, beacon)
  g.userData.anim = { type: 'ranger', beacon }
  return g
}

function buildPaddockGround() {
  const g = new THREE.Group()
  const sand = mesh(CYL, mat(0xd9c27e), 0, 0.03, 0)
  sand.scale.set(2.5, 0.08, 2.5)
  sand.receiveShadow = true
  g.add(sand)
  const rock = mesh(SPH, mat(0xa8a29b), 1.5, 0.25, -1.4)
  rock.scale.set(0.5, 0.35, 0.45)
  g.add(rock)
  for (const [x, z] of [[-1.7, 1.2], [-1.3, -1.6]]) {
    for (let i = 0; i < 3; i++) {
      const frond = mesh(CONE, mat(0x4c9a53), x, 0.5, z)
      frond.scale.set(0.16, 1.0, 0.16)
      frond.rotation.z = (i - 1) * 0.5
      g.add(frond)
    }
  }
  const trough = mesh(BOX, mat(0x8d6e63), 1.6, 0.2, 1.6)
  trough.scale.set(0.9, 0.35, 0.5)
  g.add(trough)
  return g
}

const FENCE_COLORS = [0x9a6a43, 0xaab3ba, 0x5c6670, 0x4a5560]
function buildFence(level) {
  const g = new THREE.Group()
  const h = [1.0, 1.3, 1.6, 1.9][level]
  const half = 2.85
  const postM = mat(FENCE_COLORS[level])
  const railM = mat(FENCE_COLORS[level])
  const railR = level === 0 ? 0.07 : level === 1 ? 0.045 : 0.09
  for (let side = 0; side < 4; side++) {
    const horiz = side < 2 // sides 0,1 run along x at z = ±half
    const fixed = side % 2 === 0 ? -half : half
    for (let i = 0; i <= 2; i++) {
      const t = -half + i * half
      const post = mesh(BOX, postM, horiz ? t : fixed, h / 2, horiz ? fixed : t)
      post.scale.set(0.18, h, 0.18)
      g.add(post)
    }
    const rails = level === 0 ? 2 : 3
    for (let i = 1; i <= rails; i++) {
      const rail = mesh(BOX, railM, horiz ? 0 : fixed, (h * i) / (rails + 0.6), horiz ? fixed : 0)
      rail.scale.set(horiz ? half * 2 : railR * 2, railR * 2, horiz ? railR * 2 : half * 2)
      g.add(rail)
    }
  }
  if (level === 3) {
    const wireM = mat(0x53d7ff, { emissive: 0x1d7fa5, emissiveIntensity: 1.4 })
    const wires = []
    for (let side = 0; side < 4; side++) {
      const horiz = side < 2
      const fixed = side % 2 === 0 ? -half : half
      const wire = mesh(BOX, wireM, horiz ? 0 : fixed, h + 0.08, horiz ? fixed : 0)
      wire.scale.set(horiz ? half * 2 + 0.2 : 0.06, 0.06, horiz ? 0.06 : half * 2 + 0.2)
      wires.push(wire)
      g.add(wire)
    }
    g.userData.anim = { type: 'electric', wires, mat: wireM }
  }
  return g
}

const BUILDING_BUILDERS = {
  shack: buildShack,
  gift: buildGift,
  restroom: buildRestroom,
  garden: buildGarden,
  fountain: buildFountain,
  generator: buildGenerator,
  ranger: buildRanger,
}

// ------------------------------------------------- world

export class World {
  constructor(container) {
    this.container = container
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(this.renderer.domElement)

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0xa8e0f8)
    this.scene.fog = new THREE.Fog(0xb9e6f9, 80, 190)

    const aspect = container.clientWidth / Math.max(1, container.clientHeight)
    this.camera = new THREE.PerspectiveCamera(50, aspect, 0.5, 400)
    const dist = aspect < 0.9 ? 62 : 46
    this.camera.position.set(0, dist * 0.62, dist * 0.85)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.target.set(0, 0, 7)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.08
    this.controls.enablePan = false
    this.controls.minDistance = 14
    this.controls.maxDistance = 85
    this.controls.minPolarAngle = 0.25
    this.controls.maxPolarAngle = 1.35

    this.raycaster = new THREE.Raycaster()
    this.tiles = new Map() // plotId -> { group, tileMesh, sig }
    this.dinoViews = new Map() // dinoId -> view
    this.visitorPool = []
    this.priceTex = new Map()

    this.buildStatic()
    this.buildSelection()
    this.resize()
  }

  buildStatic() {
    const hemi = new THREE.HemisphereLight(0xcdf0ff, 0x7a9a4f, 0.95)
    this.scene.add(hemi)
    const sun = new THREE.DirectionalLight(0xfff3d6, 1.6)
    sun.position.set(28, 42, 14)
    sun.castShadow = true
    sun.shadow.mapSize.set(1024, 1024)
    const cam = sun.shadow.camera
    cam.left = cam.bottom = -38
    cam.right = cam.top = 38
    cam.far = 120
    this.scene.add(sun)

    const ground = mesh(CYL, mat(0x7ecb5f), 0, -0.5, 0)
    ground.scale.set(46, 1, 46)
    ground.receiveShadow = true
    this.scene.add(ground)
    const skirt = mesh(CYL, mat(0x5da648), 0, -1.4, 0)
    skirt.scale.set(48, 1.2, 48)
    this.scene.add(skirt)

    const path = mesh(BOX, mat(0xecdcab), 0, 0.15, 0)
    path.scale.set(SPAN + 2.5, 0.3, SPAN + 2.5)
    path.receiveShadow = true
    this.scene.add(path)
    // Walkway from the gate.
    const walk = mesh(BOX, mat(0xecdcab), 0, 0.15, HALF + 2.6)
    walk.scale.set(CELL, 0.3, 5)
    this.scene.add(walk)

    // Entrance gate.
    const gate = new THREE.Group()
    gate.position.set(0, 0.3, HALF + 3.2)
    for (const x of [-3.4, 3.4]) {
      const pillar = mesh(BOX, mat(0xb98b5a), x, 2.2, 0)
      pillar.scale.set(1.1, 4.4, 1.1)
      const cap = mesh(SPH, mat(0xe5533d), x, 4.6, 0)
      cap.scale.setScalar(0.75)
      gate.add(pillar, cap)
    }
    const beam = mesh(BOX, mat(0xb98b5a), 0, 4.35, 0)
    beam.scale.set(7.9, 0.9, 0.9)
    gate.add(beam)
    const sign = new THREE.Mesh(
      new THREE.PlaneGeometry(6.4, 2.0),
      new THREE.MeshBasicMaterial({ map: textTexture('🦖 DINO PARK', { w: 512, h: 160, size: 72 }), transparent: true })
    )
    sign.position.set(0, 5.6, 0.1)
    gate.add(sign)
    const signBack = sign.clone()
    signBack.rotation.y = Math.PI
    signBack.position.z = -0.1
    gate.add(signBack)
    this.scene.add(gate)

    // Wilderness ring: trees + rocks, keeping the gate approach clear.
    const rng = (a, b) => a + Math.random() * (b - a)
    for (let i = 0; i < 26; i++) {
      const a = (i / 26) * Math.PI * 2 + rng(-0.1, 0.1)
      const rad = rng(30, 41)
      const x = Math.cos(a) * rad
      const z = Math.sin(a) * rad
      if (z > 24 && Math.abs(x) < 9) continue
      if (Math.random() < 0.7) {
        const h = rng(2.4, 4.4)
        const trunk = mesh(CYL, mat(0x8d6e63), x, h * 0.3, z)
        trunk.scale.set(0.24, h * 0.6, 0.24)
        const crown = mesh(Math.random() < 0.5 ? CONE : SPH, mat(Math.random() < 0.5 ? 0x4c9a53 : 0x66bb6a), x, h, z)
        crown.scale.set(rng(1.2, 1.9), rng(1.5, 2.4), rng(1.2, 1.9))
        this.scene.add(trunk, crown)
      } else {
        const rock = mesh(SPH, mat(0xa8a29b), x, 0.25, z)
        rock.scale.set(rng(0.5, 1.2), rng(0.3, 0.7), rng(0.5, 1.1))
        this.scene.add(rock)
      }
    }

    // Clouds.
    this.clouds = []
    for (let i = 0; i < 6; i++) {
      const cloud = new THREE.Group()
      const white = mat(0xffffff, { flatShading: false, roughness: 1 })
      for (let j = 0; j < 3; j++) {
        const puff = new THREE.Mesh(SPH, white)
        puff.position.set(j * 1.6 - 1.6, Math.random() * 0.4, Math.random() * 0.8)
        puff.scale.set(rng(1.3, 2.2), rng(0.8, 1.1), rng(1.1, 1.6))
        cloud.add(puff)
      }
      cloud.position.set(rng(-55, 55), rng(17, 26), rng(-45, 30))
      cloud.userData.speed = rng(0.4, 1.0)
      this.scene.add(cloud)
      this.clouds.push(cloud)
    }
  }

  buildSelection() {
    this.selRing = new THREE.Mesh(
      new THREE.TorusGeometry(3.6, 0.14, 8, 32),
      new THREE.MeshBasicMaterial({ color: 0xffd54f })
    )
    this.selRing.rotation.x = Math.PI / 2
    this.selRing.visible = false
    this.scene.add(this.selRing)
  }

  setSelected(plot) {
    if (!plot) {
      this.selRing.visible = false
      return
    }
    const { x, z } = plotPos(plot.r, plot.c)
    this.selRing.position.set(x, TILE_TOP + 0.1, z)
    this.selRing.visible = true
  }

  // ---------------------------------------------- state sync

  syncState(s) {
    this.state = s
    for (const plot of s.plots) {
      const sig = `${plot.owned}|${plot.kind}|${plot.fence}`
      const existing = this.tiles.get(plot.id)
      if (existing?.sig === sig) continue
      if (existing) this.scene.remove(existing.group)
      const group = this.buildTile(plot)
      this.scene.add(group)
      this.tiles.set(plot.id, { group, sig, plot })
    }
    // Paddock danger badges depend on dino contents, refresh every sync.
    for (const { group, plot } of this.tiles.values()) {
      if (plot.kind !== 'paddock') continue
      const weak = s.dinos.some(
        (d) => d.plot === plot.id && !d.escaped && SPECIES[d.sp].fer > FENCES[plot.fence].strength
      )
      this.setWarning(group, weak)
    }

    const seen = new Set()
    for (const d of s.dinos) {
      seen.add(d.id)
      let view = this.dinoViews.get(d.id)
      if (!view) {
        view = this.createDinoView(d)
        this.dinoViews.set(d.id, view)
      }
      view.dino = d
      const escaped = !!d.escaped
      if (view.escaped !== escaped) {
        view.escaped = escaped
        view.speed = escaped ? 4.2 : 0.9 + Math.random() * 0.5
        view.target = null
        view.alertRing.visible = escaped
      }
      this.setEmote(view, escaped ? '❗' : d.hap < 40 ? '💢' : d.hap > 85 ? '❤️' : null)
    }
    for (const [id, view] of this.dinoViews) {
      if (!seen.has(id)) {
        this.scene.remove(view.rig.group)
        this.dinoViews.delete(id)
      }
    }
  }

  buildTile(plot) {
    const group = new THREE.Group()
    const { x, z } = plotPos(plot.r, plot.c)
    group.position.set(x, 0, z)

    const color = plot.owned ? (plot.kind ? 0x8fd472 : 0x9fdb82) : 0xcbb98f
    const tile = mesh(BOX, mat(color), 0, 0.3, 0)
    tile.scale.set(GRID.PLOT, 0.5, GRID.PLOT)
    tile.userData.plotId = plot.id
    group.add(tile)
    group.userData.tile = tile

    if (!plot.owned) {
      const post = mesh(BOX, mat(0x8d6e63), 0.6, TILE_TOP + 0.7, 0.8)
      post.scale.set(0.12, 1.4, 0.12)
      const board = new THREE.Mesh(
        new THREE.PlaneGeometry(2.2, 0.9),
        new THREE.MeshBasicMaterial({ map: this.priceTexture(plot), transparent: true, side: THREE.DoubleSide })
      )
      board.position.set(0.6, TILE_TOP + 1.5, 0.82)
      group.add(post, board)
      // scruffy weeds
      for (let i = 0; i < 3; i++) {
        const weed = mesh(CONE, mat(0xb5a568), -1.5 + i * 1.4, TILE_TOP + 0.15, -1.2 + (i % 2))
        weed.scale.set(0.15, 0.4, 0.15)
        group.add(weed)
      }
      return group
    }

    if (plot.kind === 'paddock') {
      const inner = buildPaddockGround()
      inner.position.y = TILE_TOP
      const fence = buildFence(plot.fence)
      fence.position.y = TILE_TOP
      group.add(inner, fence)
      if (fence.userData.anim) group.userData.anim = fence.userData.anim
    } else if (plot.kind) {
      const b = BUILDING_BUILDERS[plot.kind]()
      b.position.y = TILE_TOP
      group.add(b)
      if (b.userData.anim) group.userData.anim = b.userData.anim
    }
    return group
  }

  setWarning(group, on) {
    if (on && !group.userData.warn) {
      const warn = makeEmote('⚠️')
      warn.position.set(2.2, TILE_TOP + 2.8, 2.2)
      group.add(warn)
      group.userData.warn = warn
    } else if (!on && group.userData.warn) {
      group.remove(group.userData.warn)
      group.userData.warn = null
    }
  }

  priceTexture(plot) {
    const key = `${plotPriceLabel(plot)}`
    if (!this.priceTex.has(key)) {
      this.priceTex.set(key, textTexture(key, { w: 256, h: 104, size: 46 }))
    }
    return this.priceTex.get(key)
  }

  createDinoView(d) {
    const rig = makeDino(d.sp)
    const { x, z } = plotPos(...plotRC(d.plot))
    rig.group.position.set(x + (Math.random() - 0.5), TILE_TOP, z + (Math.random() - 0.5))
    rig.group.rotation.y = Math.random() * Math.PI * 2
    rig.group.traverse((o) => {
      o.userData.dinoId = d.id
    })
    const alertRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.6, 0.12, 8, 24),
      new THREE.MeshBasicMaterial({ color: 0xe5533d })
    )
    alertRing.rotation.x = Math.PI / 2
    alertRing.position.y = 0.15
    alertRing.visible = false
    rig.group.add(alertRing)
    this.scene.add(rig.group)
    return {
      rig,
      dino: d,
      escaped: !!d.escaped,
      speed: 0.9 + Math.random() * 0.5,
      target: null,
      idle: Math.random() * 2,
      t: Math.random() * 10,
      moving: false,
      emote: null,
      alertRing,
    }
  }

  setEmote(view, txt) {
    if (view.emoteTxt === txt) return
    view.emoteTxt = txt
    if (view.emote) {
      view.rig.group.remove(view.emote)
      view.emote = null
    }
    if (txt) {
      const sprite = makeEmote(txt)
      const h = view.rig.size * 2.6 + 0.8
      sprite.position.set(0, h, 0)
      view.rig.group.add(sprite)
      view.emote = sprite
    }
  }

  // ---------------------------------------------- per-frame

  update(dt, t) {
    this.controls.update()
    const s = this.state
    if (s) {
      this.updateDinos(dt, t)
      this.updateVisitors(dt)
    }
    for (const cloud of this.clouds) {
      cloud.position.x += cloud.userData.speed * dt
      if (cloud.position.x > 65) cloud.position.x = -65
    }
    for (const { group } of this.tiles.values()) {
      const anim = group.userData.anim
      if (anim?.type === 'fountain') {
        anim.water.scale.y = 0.08 + Math.sin(t * 3) * 0.03
        anim.water.position.y = 0.62 + Math.sin(t * 3) * 0.04
      } else if (anim?.type === 'generator') {
        anim.fan.rotation.z += dt * 6
      } else if (anim?.type === 'ranger') {
        anim.beacon.material.emissiveIntensity = 1 + Math.sin(t * 4) * 0.9
      } else if (anim?.type === 'electric') {
        const outage = s?.disaster?.key === 'outage' && !s.plots.some((p) => p.kind === 'generator')
        anim.mat.emissiveIntensity = outage ? 0.05 : 1.1 + Math.sin(t * 10) * 0.5
      }
      if (group.userData.warn) {
        group.userData.warn.position.y = TILE_TOP + 2.8 + Math.sin(t * 2.5) * 0.15
      }
    }
    if (this.selRing.visible) {
      const p = 1 + Math.sin(t * 5) * 0.05
      this.selRing.scale.set(p, p, p)
    }
    this.renderer.render(this.scene, this.camera)
  }

  updateDinos(dt, t) {
    for (const view of this.dinoViews.values()) {
      const g = view.rig.group
      if (!view.target || view.idle < 0) {
        view.target = this.pickDinoTarget(view)
        view.idle = 1 + Math.random() * 2.5
      }
      const dx = view.target.x - g.position.x
      const dz = view.target.z - g.position.z
      const dist = Math.hypot(dx, dz)
      view.moving = dist > 0.35
      if (view.moving) {
        const step = Math.min(dist, view.speed * dt)
        g.position.x += (dx / dist) * step
        g.position.z += (dz / dist) * step
        const targetYaw = Math.atan2(dx, dz)
        let dy = targetYaw - g.rotation.y
        while (dy > Math.PI) dy -= Math.PI * 2
        while (dy < -Math.PI) dy += Math.PI * 2
        g.rotation.y += dy * Math.min(1, dt * 5)
      } else {
        view.idle -= dt
      }
      // animate rig
      view.t += dt * (view.moving ? (view.escaped ? 2.2 : 1.4) : 0.6)
      const rig = view.rig
      const amp = view.moving ? 0.55 : 0
      for (const leg of rig.legs) {
        leg.pivot.rotation.x = Math.sin(view.t * 7 + leg.phase) * amp
      }
      const baseY = rig.bodyPivot.userData.baseY ?? (rig.bodyPivot.userData.baseY = rig.bodyPivot.position.y)
      rig.bodyPivot.position.y = baseY + (view.moving ? Math.abs(Math.sin(view.t * 7)) * 0.09 * rig.size : Math.sin(view.t * 2) * 0.02 * rig.size)
      rig.tail.forEach((seg, i) => {
        seg.rotation.y = Math.sin(view.t * 2.5 + i * 0.9) * 0.16
      })
      if (rig.neck) rig.neck.rotation.x = 0.55 + Math.sin(view.t * 1.2) * 0.08
      else rig.head.rotation.x = Math.sin(view.t * 1.7) * 0.08
      if (rig.jaw) rig.jaw.rotation.x = view.escaped ? 0.35 + Math.sin(view.t * 6) * 0.25 : 0.05
      if (view.emote) view.emote.position.y = view.rig.size * 2.6 + 0.8 + Math.sin(t * 3 + view.t) * 0.12
      if (view.alertRing.visible) {
        const p = 1 + Math.sin(t * 6) * 0.25
        view.alertRing.scale.set(p, p, 1)
      }
    }
  }

  pickDinoTarget(view) {
    if (view.escaped) {
      return new THREE.Vector3((Math.random() - 0.5) * (SPAN + 8), TILE_TOP, (Math.random() - 0.5) * (SPAN + 8))
    }
    const [r, c] = plotRC(view.dino.plot)
    const { x, z } = plotPos(r, c)
    const roam = Math.max(0.6, 2.0 - view.rig.size * 0.55)
    return new THREE.Vector3(x + (Math.random() - 0.5) * roam * 2, TILE_TOP, z + (Math.random() - 0.5) * roam * 2)
  }

  // ---------------------------------------------- visitors

  updateVisitors(dt) {
    const s = this.state
    const fleeing = s.dinos.some((d) => d.escaped)
    const want = s.over ? 0 : Math.min(36, Math.max(s.visitors > 0 ? 2 : 0, Math.round(s.visitors / 3)))
    while (this.visitorPool.length < want) this.visitorPool.push(this.makeVisitor())
    while (this.visitorPool.length > want) {
      const v = this.visitorPool.pop()
      this.scene.remove(v.group)
    }
    const maxNode = GRID.N
    for (const v of this.visitorPool) {
      if (!v.target) {
        if (fleeing) {
          // Head for the gate, then linger there in a nervous huddle.
          v.i += Math.sign(Math.floor(maxNode / 2) - v.i) || 0
          v.j = Math.min(maxNode, v.j + 1)
        } else {
          if (Math.random() < 0.5) v.i = Math.max(0, Math.min(maxNode, v.i + (Math.random() < 0.5 ? -1 : 1)))
          else v.j = Math.max(0, Math.min(maxNode, v.j + (Math.random() < 0.5 ? -1 : 1)))
        }
        v.target = nodePos(v.i, v.j)
      }
      const dx = v.target.x - v.group.position.x
      const dz = v.target.z - v.group.position.z
      const dist = Math.hypot(dx, dz)
      const speed = fleeing ? 4.5 : 1.3
      if (dist < 0.15) {
        v.target = null
        continue
      }
      const step = Math.min(dist, speed * dt)
      v.group.position.x += (dx / dist) * step
      v.group.position.z += (dz / dist) * step
      v.group.rotation.y = Math.atan2(dx, dz)
      v.t += dt * (fleeing ? 3 : 1)
      v.group.position.y = 0.3 + Math.abs(Math.sin(v.t * 8)) * 0.08
      if (v.balloon) v.balloon.position.y = 1.35 + Math.sin(v.t * 2) * 0.06
    }
  }

  makeVisitor() {
    const g = new THREE.Group()
    const pastel = [0xf28bb4, 0x8bc9f2, 0xf2d38b, 0xa8e0a0, 0xc7a8f0, 0xf2a58b]
    const bodyM = mat(pastel[Math.floor(Math.random() * pastel.length)])
    const body = mesh(new THREE.CapsuleGeometry(0.22, 0.35, 4, 8), bodyM, 0, 0.5, 0)
    const skin = [0xf5d0a9, 0xd9a066, 0x8d5524, 0xffdbac][Math.floor(Math.random() * 4)]
    const head = mesh(SPH, mat(skin), 0, 0.98, 0)
    head.scale.setScalar(0.2)
    g.add(body, head)
    if (Math.random() < 0.3) {
      const cap = mesh(CONE, mat(0xe5533d), 0, 1.14, 0)
      cap.scale.set(0.16, 0.14, 0.16)
      g.add(cap)
    }
    let balloon = null
    if (Math.random() < 0.25) {
      balloon = mesh(SPH, mat([0xe5533d, 0xffd54f, 0x66bb6a][Math.floor(Math.random() * 3)]), 0.3, 1.35, 0)
      balloon.scale.setScalar(0.16)
      const string = mesh(CYL, mat(0xffffff), 0.3, 1.05, 0)
      string.scale.set(0.008, 0.6, 0.008)
      g.add(balloon, string)
    }
    const gate = nodePos(Math.floor(GRID.N / 2), GRID.N)
    g.position.set(gate.x, 0.3, gate.z)
    this.scene.add(g)
    return { group: g, i: Math.floor(GRID.N / 2), j: GRID.N, target: null, t: Math.random() * 5, balloon }
  }

  // ---------------------------------------------- picking / resize

  pick(clientX, clientY) {
    const rect = this.renderer.domElement.getBoundingClientRect()
    const ndc = new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1
    )
    this.raycaster.setFromCamera(ndc, this.camera)
    const targets = []
    for (const { group } of this.tiles.values()) targets.push(group.userData.tile)
    for (const view of this.dinoViews.values()) targets.push(view.rig.group)
    const hits = this.raycaster.intersectObjects(targets, true)
    for (const hit of hits) {
      let o = hit.object
      while (o) {
        if (o.userData.dinoId != null) return { type: 'dino', id: o.userData.dinoId }
        if (o.userData.plotId != null) return { type: 'plot', id: o.userData.plotId }
        o = o.parent
      }
    }
    return null
  }

  resize() {
    const w = this.container.clientWidth
    const h = this.container.clientHeight
    this.camera.aspect = w / Math.max(1, h)
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(w, h)
  }
}

// Path nodes sit on the walkway lines between plots: i, j in 0..N map to the
// N+1 boundary lines of the grid (0 and N are the park's outer edges).
function nodePos(i, j) {
  const mid = GRID.N / 2
  return { x: (i - mid) * CELL, z: (j - mid) * CELL }
}

function plotRC(id) {
  return [Math.floor(id / GRID.N), id % GRID.N]
}

function plotPriceLabel(plot) {
  return fmtMoney(plotPrice(plot.r, plot.c))
}
