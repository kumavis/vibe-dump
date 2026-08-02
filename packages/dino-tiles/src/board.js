// The 3D board for the endless park: aligned hex prisms, auto-fenced pens
// (shared edges between same-species neighbors stay open), guests wandering
// the seams between tiles, drop animations and score popups.
// Rules live in game.js — this file renders, picks, and ambles.

import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { makeDino } from './dinos.js'
import { TILES, parseKey } from './game.js'

const HEX = 2.1 // circumradius of the layout grid
const TILE_R = 1.92 // visual tile radius (leaves a walkable seam)
const SQ3 = Math.sqrt(3)
const TILE_TOP = 0.6

export function cellPos(q, r) {
  return { x: HEX * SQ3 * (q + r / 2), z: HEX * 1.5 * r }
}

// Pointy-top hex corners, matching CylinderGeometry's vertex layout exactly
// (vertex k at angle k*60°, first vertex pointing +z) — so tiles, fences and
// guest paths all share one grid.
function corner(cx, cz, k, radius = HEX) {
  const a = (k * Math.PI) / 3
  return { x: cx + Math.sin(a) * radius, z: cz + Math.cos(a) * radius }
}

function mat(color, extra = {}) {
  return new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.95, ...extra })
}

const SPH = new THREE.SphereGeometry(1, 10, 8)
const CONE = new THREE.ConeGeometry(1, 1, 8)
const CYL = new THREE.CylinderGeometry(1, 1, 1, 10)
const BOX = new THREE.BoxGeometry(1, 1, 1)
const HEX_GEO = new THREE.CylinderGeometry(TILE_R, TILE_R * 1.06, TILE_TOP, 6)
const PAD_GEO = new THREE.CylinderGeometry(TILE_R * 0.94, TILE_R, 0.22, 6)

function mesh(g, m, x = 0, y = 0, z = 0) {
  const o = new THREE.Mesh(g, m)
  o.position.set(x, y, z)
  o.castShadow = true
  o.receiveShadow = true
  return o
}

// Hand-drawn emote bubbles (no emoji): heart, music note, zzz, alert.
const emoteCache = {}
function emoteTexture(type) {
  if (emoteCache[type]) return emoteCache[type]
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 128
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#fffdf4'
  ctx.strokeStyle = '#5b4327'
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.arc(64, 58, 46, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
  // bubble tail
  ctx.beginPath()
  ctx.moveTo(48, 98)
  ctx.lineTo(58, 122)
  ctx.lineTo(70, 98)
  ctx.closePath()
  ctx.fill()
  if (type === 'heart') {
    ctx.fillStyle = '#ff6b81'
    ctx.beginPath()
    ctx.moveTo(64, 82)
    ctx.bezierCurveTo(30, 58, 40, 28, 64, 46)
    ctx.bezierCurveTo(88, 28, 98, 58, 64, 82)
    ctx.fill()
  } else if (type === 'note') {
    ctx.fillStyle = '#5b4327'
    ctx.font = 'bold 62px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('♪', 64, 58)
  } else if (type === 'zzz') {
    ctx.fillStyle = '#6a8fd8'
    ctx.font = 'bold 40px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('z', 46, 74)
    ctx.font = 'bold 30px system-ui, sans-serif'
    ctx.fillText('z', 70, 56)
    ctx.font = 'bold 22px system-ui, sans-serif'
    ctx.fillText('z', 88, 42)
  } else {
    ctx.fillStyle = '#e5533d'
    ctx.font = 'bold 68px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('!', 64, 58)
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  emoteCache[type] = tex
  return tex
}

// ------------------------------------------------- tile dressing

function dressLake(group) {
  const water = mesh(new THREE.CylinderGeometry(TILE_R * 0.72, TILE_R * 0.72, 0.1, 6), mat(0x9be0f5, { transparent: true, opacity: 0.9 }), 0, 0.34, 0)
  const lily = mesh(CYL, mat(0x7ccf7a), 0.7, 0.42, 0.4)
  lily.scale.set(0.28, 0.04, 0.28)
  group.add(water, lily)
  group.userData.water = water
}

function dressGarden(group) {
  for (const [x, z, h, r] of [[-0.6, -0.3, 0.9, 0.42], [0.5, 0.2, 1.2, 0.5], [-0.1, 0.7, 0.7, 0.32]]) {
    const trunk = mesh(CYL, mat(0x8d6e63), x, 0.3 + h * 0.3, z)
    trunk.scale.set(0.09, h * 0.6, 0.09)
    const ball = mesh(SPH, mat(0x66bb6a), x, 0.3 + h * 0.75, z)
    ball.scale.setScalar(r)
    group.add(trunk, ball)
  }
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + 0.4
    const bloom = mesh(SPH, mat([0xe5533d, 0xffd54f, 0xe87ba4][i % 3]), Math.cos(a) * 1.1, 0.38, Math.sin(a) * 1.1)
    bloom.scale.setScalar(0.11)
    group.add(bloom)
  }
}

function dressSnack(group) {
  const base = mesh(BOX, mat(0xf2c14e), 0, 0.75, 0)
  base.scale.set(1.3, 0.9, 1.0)
  group.add(base)
  for (let i = 0; i < 4; i++) {
    const stripe = mesh(BOX, mat(i % 2 ? 0xffffff : 0xe5533d), -0.45 + i * 0.3, 1.32, 0.5)
    stripe.scale.set(0.3, 0.07, 0.55)
    stripe.rotation.x = -0.35
    group.add(stripe)
  }
  const dog = mesh(CYL, mat(0xc96f3a), 0, 1.62, 0)
  dog.scale.set(0.14, 0.7, 0.14)
  dog.rotation.z = Math.PI / 2
  group.add(dog)
}

// ------------------------------------------------- board

export class Board {
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
    this.scene.fog = new THREE.Fog(0xb9e6f9, 80, 200)

    const aspect = container.clientWidth / Math.max(1, container.clientHeight)
    this.camera = new THREE.PerspectiveCamera(48, aspect, 0.5, 400)
    const dist = aspect < 0.8 ? 38 : aspect < 1.2 ? 32 : 27
    this.camera.position.set(0, dist * 0.82, dist * 0.66)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.target.set(0, 0, 0.8)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.09
    // Drag roams the park; pinch zooms; two-finger / right-drag tilts.
    this.controls.enablePan = true
    this.controls.screenSpacePanning = false
    this.controls.panSpeed = 1.1
    this.controls.touches = { ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_ROTATE }
    this.controls.mouseButtons = { LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE }
    this.controls.minDistance = 14
    this.controls.maxDistance = 75
    this.controls.minPolarAngle = 0.25
    this.controls.maxPolarAngle = 1.05

    this.raycaster = new THREE.Raycaster()
    this.pads = new Map() // frontier key -> mesh
    this.placedViews = new Map() // key -> { group, t } (tile + scenery)
    this.dinoViews = new Map() // key -> wandering dino view
    this.fences = new Map() // key -> group
    this.getPen = (key) => [key] // main.js wires the real pen lookup
    this.drops = []
    this.popups = []

    // Guest path graph: hex corners are nodes, tile edges are walkable.
    this.nodes = new Map() // nodeKey -> { x, z, adj: Set<nodeKey> }
    this.guests = []

    this.buildStatic()
    this.resize()
  }

  buildStatic() {
    this.scene.add(new THREE.HemisphereLight(0xcdf0ff, 0x7a9a4f, 0.95))
    const sun = new THREE.DirectionalLight(0xfff3d6, 1.5)
    sun.position.set(18, 30, 12)
    sun.castShadow = true
    sun.shadow.mapSize.set(1024, 1024)
    const cam = sun.shadow.camera
    cam.left = cam.bottom = -34
    cam.right = cam.top = 34
    cam.far = 100
    this.scene.add(sun)

    const ground = mesh(CYL, mat(0x7ecb5f), 0, -0.6, 0)
    ground.scale.set(70, 1, 70)
    this.scene.add(ground)

    const rng = (a, b) => a + Math.random() * (b - a)
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2 + rng(-0.15, 0.15)
      const rad = rng(28, 42)
      const x = Math.cos(a) * rad
      const z = Math.sin(a) * rad
      if (Math.random() < 0.75) {
        const h = rng(1.8, 3.6)
        const trunk = mesh(CYL, mat(0x8d6e63), x, h * 0.3, z)
        trunk.scale.set(0.2, h * 0.6, 0.2)
        const crown = mesh(Math.random() < 0.5 ? CONE : SPH, mat(Math.random() < 0.5 ? 0x4c9a53 : 0x66bb6a), x, h, z)
        crown.scale.set(rng(1.0, 1.6), rng(1.2, 2.0), rng(1.0, 1.6))
        this.scene.add(trunk, crown)
      } else {
        const rock = mesh(SPH, mat(0xa8a29b), x, 0.2, z)
        rock.scale.set(rng(0.4, 1.0), rng(0.25, 0.55), rng(0.4, 0.9))
        this.scene.add(rock)
      }
    }
    this.clouds = []
    for (let i = 0; i < 5; i++) {
      const cloud = new THREE.Group()
      const white = mat(0xffffff, { flatShading: false })
      for (let j = 0; j < 3; j++) {
        const puff = new THREE.Mesh(SPH, white)
        puff.position.set(j * 1.4 - 1.4, Math.random() * 0.3, Math.random() * 0.7)
        puff.scale.set(rng(1.0, 1.8), rng(0.6, 0.9), rng(0.9, 1.3))
        cloud.add(puff)
      }
      cloud.position.set(rng(-34, 34), rng(12, 18), rng(-28, 12))
      cloud.userData.speed = rng(0.3, 0.8)
      this.scene.add(cloud)
      this.clouds.push(cloud)
    }
  }

  // ---------------------------------------------- frontier pads

  showFrontier(keys) {
    for (const key of keys) {
      if (this.pads.has(key)) continue
      const [q, r] = parseKey(key)
      const { x, z } = cellPos(q, r)
      const pad = mesh(PAD_GEO, mat(0xcfc6a5), x, 0.11, z)
      pad.castShadow = false
      pad.userData.cellKey = key
      this.scene.add(pad)
      this.pads.set(key, pad)
    }
  }

  // ---------------------------------------------- tiles

  placeTile(key, tileKey, { instant = false } = {}) {
    const [q, r] = parseKey(key)
    const { x, z } = cellPos(q, r)
    const pad = this.pads.get(key)
    if (pad) {
      this.scene.remove(pad)
      this.pads.delete(key)
    }
    const group = new THREE.Group()
    group.position.set(x, instant ? TILE_TOP / 2 : 7, z)
    const color = parseInt((TILES[tileKey].ground ?? TILES[tileKey].color).slice(1), 16)
    group.add(mesh(HEX_GEO, mat(color)))
    const dress = { lake: dressLake, garden: dressGarden, snack: dressSnack }[tileKey]
    if (dress) dress(group)
    this.scene.add(group)
    this.placedViews.set(key, { group, t: Math.random() * 10 })
    if (!instant) this.drops.push({ group, targetY: TILE_TOP / 2, v: 0 })
    if (TILES[tileKey].kind === 'dino') this.spawnDino(key, tileKey, instant)
    this.addCellPaths(q, r)
  }

  spawnDino(key, tileKey, instant) {
    const [q, r] = parseKey(key)
    const { x, z } = cellPos(q, r)
    const scale = { parasaur: 0.55, stego: 0.5, trike: 0.5, raptor: 0.6, trex: 0.42 }[tileKey]
    const rig = makeDino(tileKey)
    rig.group.scale.setScalar(instant ? scale : 0.01)
    rig.group.position.set(x, TILE_TOP, z)
    rig.group.rotation.y = Math.random() * Math.PI * 2
    this.scene.add(rig.group)
    this.dinoViews.set(key, {
      rig,
      home: key,
      tileKey,
      scale,
      spawnT: instant ? 1 : -0.4, // slight delay so the tile lands first
      target: null,
      idle: 0.5 + Math.random() * 1.5,
      t: Math.random() * 10,
      moving: false,
      emote: null,
      emoteLife: 0,
      emoteTimer: 3 + Math.random() * 7,
    })
  }

  // Fences: a dino tile is fenced on every edge except those shared with a
  // same-species neighbor (one big pen). `openKeys` are those neighbors.
  updateFences(key, tileKey, openKeys) {
    const old = this.fences.get(key)
    if (old) this.scene.remove(old)
    const tile = TILES[tileKey]
    if (tile.kind !== 'dino') return
    const [q, r] = parseKey(key)
    const { x: cx, z: cz } = cellPos(q, r)
    const group = new THREE.Group()
    const postM = mat(tile.predator ? 0x5c6670 : 0x9a6a43)
    const inset = 0.84
    const corners = Array.from({ length: 6 }, (_, k) => corner(0, 0, k, HEX * inset))
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, -1], [-1, 1]]
    for (const [dq, dr] of dirs) {
      const nk = `${q + dq},${r + dr}`
      if (openKeys.has(nk)) continue
      const { x: nx, z: nz } = cellPos(q + dq, r + dr)
      // edge = the two inset corners nearest the neighbor's center
      const ranked = corners
        .map((c) => ({ c, d: Math.hypot(cx + c.x - nx, cz + c.z - nz) }))
        .sort((a, b) => a.d - b.d)
      const a = ranked[0].c
      const b = ranked[1].c
      for (const p of [a, b]) {
        const post = mesh(BOX, postM, p.x, 0.42 + TILE_TOP, p.z)
        post.scale.set(0.13, 0.62, 0.13)
        group.add(post)
      }
      const len = Math.hypot(b.x - a.x, b.z - a.z)
      for (const h of [0.28, 0.52]) {
        const rail = mesh(BOX, postM, (a.x + b.x) / 2, h + TILE_TOP, (a.z + b.z) / 2)
        rail.scale.set(len, 0.07, 0.07)
        rail.rotation.y = Math.atan2(-(b.z - a.z), b.x - a.x)
        group.add(rail)
      }
    }
    group.position.set(cx, 0, cz)
    this.scene.add(group)
    this.fences.set(key, group)
  }

  // ---------------------------------------------- guest paths & guests

  nodeKey(x, z) {
    return `${x.toFixed(1)}|${z.toFixed(1)}`
  }

  addCellPaths(q, r) {
    const { x: cx, z: cz } = cellPos(q, r)
    const ks = []
    for (let k = 0; k < 6; k++) {
      const p = corner(cx, cz, k)
      const nk = this.nodeKey(p.x, p.z)
      if (!this.nodes.has(nk)) this.nodes.set(nk, { x: p.x, z: p.z, adj: new Set() })
      ks.push(nk)
    }
    for (let k = 0; k < 6; k++) {
      const a = ks[k]
      const b = ks[(k + 1) % 6]
      this.nodes.get(a).adj.add(b)
      this.nodes.get(b).adj.add(a)
    }
  }

  makeGuest() {
    const g = new THREE.Group()
    const pastel = [0xf28bb4, 0x8bc9f2, 0xf2d38b, 0xa8e0a0, 0xc7a8f0, 0xf2a58b]
    const body = mesh(new THREE.CapsuleGeometry(0.16, 0.26, 4, 8), mat(pastel[Math.floor(Math.random() * pastel.length)]), 0, 0.36, 0)
    const skin = [0xf5d0a9, 0xd9a066, 0x8d5524, 0xffdbac][Math.floor(Math.random() * 4)]
    const head = mesh(SPH, mat(skin), 0, 0.7, 0)
    head.scale.setScalar(0.15)
    g.add(body, head)
    const keys = [...this.nodes.keys()]
    const start = keys[Math.floor(Math.random() * keys.length)]
    const node = this.nodes.get(start)
    g.position.set(node.x, 0.3, node.z)
    this.scene.add(g)
    return { group: g, at: start, prev: null, target: null, t: Math.random() * 5 }
  }

  updateGuests(dt, placedCount) {
    const want = Math.min(22, Math.floor(2 + placedCount * 0.6))
    while (this.guests.length < want && this.nodes.size) this.guests.push(this.makeGuest())
    while (this.guests.length > want) this.scene.remove(this.guests.pop().group)
    for (const guest of this.guests) {
      if (!guest.target) {
        const node = this.nodes.get(guest.at)
        if (!node) continue
        const options = [...node.adj].filter((k) => k !== guest.prev)
        guest.target = options.length ? options[Math.floor(Math.random() * options.length)] : guest.prev
        if (!guest.target) continue
      }
      const to = this.nodes.get(guest.target)
      const dx = to.x - guest.group.position.x
      const dz = to.z - guest.group.position.z
      const dist = Math.hypot(dx, dz)
      guest.t += dt
      guest.group.position.y = 0.3 + Math.abs(Math.sin(guest.t * 7)) * 0.05
      if (dist < 0.08) {
        guest.prev = guest.at
        guest.at = guest.target
        guest.target = null
        continue
      }
      const step = Math.min(dist, 1.1 * dt)
      guest.group.position.x += (dx / dist) * step
      guest.group.position.z += (dz / dist) * step
      guest.group.rotation.y = Math.atan2(dx, dz)
    }
  }

  // ---------------------------------------------- wandering dinos

  // Random spot inside a pen cell, inset from the fence line.
  penSpot(cellKey) {
    const [q, r] = parseKey(cellKey)
    const { x, z } = cellPos(q, r)
    const a = Math.random() * Math.PI * 2
    const rad = Math.sqrt(Math.random()) * 1.05
    return { x: x + Math.cos(a) * rad, z: z + Math.sin(a) * rad }
  }

  updateDinos(dt, t) {
    for (const view of this.dinoViews.values()) {
      const g = view.rig.group
      // spawn pop-in
      if (view.spawnT < 1) {
        view.spawnT += dt * 2.4
        const p = Math.max(0.01, Math.min(1, view.spawnT))
        g.scale.setScalar(view.scale * (p + Math.sin(p * Math.PI) * 0.2))
        if (view.spawnT < 1) continue
        g.scale.setScalar(view.scale)
      }
      // wander the whole pen (merged same-species cells)
      if (!view.target || view.idle < 0) {
        const pen = this.getPen(view.home)
        view.penSize = pen.length
        view.target = this.penSpot(pen[Math.floor(Math.random() * pen.length)])
        view.idle = 1.5 + Math.random() * 3
      }
      const dx = view.target.x - g.position.x
      const dz = view.target.z - g.position.z
      const dist = Math.hypot(dx, dz)
      view.moving = dist > 0.18
      const speed = view.tileKey === 'raptor' ? 0.85 : 0.5
      if (view.moving) {
        const step = Math.min(dist, speed * dt)
        g.position.x += (dx / dist) * step
        g.position.z += (dz / dist) * step
        const targetYaw = Math.atan2(dx, dz)
        let dy = targetYaw - g.rotation.y
        while (dy > Math.PI) dy -= Math.PI * 2
        while (dy < -Math.PI) dy += Math.PI * 2
        g.rotation.y += dy * Math.min(1, dt * 4)
      } else {
        view.idle -= dt
      }
      // animate
      view.t += dt * (view.moving ? 1.5 : 0.7)
      const rig = view.rig
      const amp = view.moving ? 0.5 : 0
      for (const leg of rig.legs) leg.pivot.rotation.x = Math.sin(view.t * 7 + leg.phase) * amp
      const baseY = rig.bodyPivot.userData.baseY ?? (rig.bodyPivot.userData.baseY = rig.bodyPivot.position.y)
      rig.bodyPivot.position.y = baseY + (view.moving ? Math.abs(Math.sin(view.t * 7)) * 0.08 : Math.sin(view.t * 2) * 0.03)
      rig.tail.forEach((seg, i) => {
        seg.rotation.y = Math.sin(view.t * 2.2 + i * 0.9) * 0.15
      })
      if (rig.wings) {
        const flap = Math.sin(view.t * 6) * 0.3
        rig.wings[0].rotation.z = flap
        rig.wings[1].rotation.z = -flap
      }
      if (rig.neck) rig.neck.rotation.x = 0.55 + Math.sin(view.t * 1.1) * 0.06
      else rig.head.rotation.x = Math.sin(view.t * 1.5) * 0.07
      if (rig.jaw) rig.jaw.rotation.x = 0.08 + Math.max(0, Math.sin(view.t * 0.7)) * 0.25
      this.updateEmote(view, dt)
    }
  }

  updateEmote(view, dt) {
    // Sprite is a child of the scaled rig, so local units are divided by
    // the rig scale to get world-sized results.
    const inv = 1 / Math.max(0.01, view.scale)
    const headY = (2.6 * view.scale + 1.15) * inv
    if (view.emote) {
      view.emoteLife -= dt
      view.emote.position.y = headY + Math.sin(view.t * 3) * 0.1 * inv
      view.emote.material.opacity = Math.min(1, view.emoteLife * 2)
      if (view.emoteLife <= 0) {
        view.rig.group.remove(view.emote)
        view.emote = null
      }
      return
    }
    view.emoteTimer -= dt
    if (view.emoteTimer > 0) return
    view.emoteTimer = 6 + Math.random() * 9
    const tile = TILES[view.tileKey]
    const pen = view.penSize ?? 1
    let type
    if (tile.predator) type = Math.random() < 0.45 ? 'alert' : 'note'
    else if (pen >= 3) type = Math.random() < 0.6 ? 'heart' : 'note'
    else type = Math.random() < 0.5 ? 'zzz' : 'note'
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: emoteTexture(type), transparent: true, depthTest: false }))
    sprite.scale.setScalar(1.15 * inv)
    sprite.position.y = headY
    view.rig.group.add(sprite)
    view.emote = sprite
    view.emoteLife = 2.2
  }

  // ---------------------------------------------- popups

  popup(key, text, tone = 'good', big = false) {
    const [q, r] = parseKey(key)
    const { x, z } = cellPos(q, r)
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 160
    const ctx = canvas.getContext('2d')
    // Shrink long labels to fit the canvas so text never clips.
    let size = big ? 84 : 62
    ctx.font = `bold ${size}px system-ui, sans-serif`
    const w = ctx.measureText(text).width
    if (w > 950) {
      size = Math.floor((size * 950) / w)
      ctx.font = `bold ${size}px system-ui, sans-serif`
    }
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.lineWidth = 10
    ctx.strokeStyle = 'rgba(30,25,10,0.85)'
    ctx.strokeText(text, 512, 80)
    ctx.fillStyle = tone === 'bad' ? '#ff8f85' : big ? '#ffd54f' : '#b6f397'
    ctx.fillText(text, 512, 80)
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }))
    sprite.position.set(x, 2.6, z)
    // match the 1024x160 canvas aspect so glyphs aren't squashed
    sprite.scale.set(big ? 8.4 : 6.2, big ? 1.31 : 0.97, 1)
    this.scene.add(sprite)
    this.popups.push({ sprite, age: 0, life: big ? 1.7 : 1.2 })
  }

  reset() {
    for (const { group } of this.placedViews.values()) this.scene.remove(group)
    this.placedViews.clear()
    for (const view of this.dinoViews.values()) this.scene.remove(view.rig.group)
    this.dinoViews.clear()
    for (const fence of this.fences.values()) this.scene.remove(fence)
    this.fences.clear()
    for (const pad of this.pads.values()) this.scene.remove(pad)
    this.pads.clear()
    for (const p of this.popups) this.scene.remove(p.sprite)
    this.popups = []
    for (const guest of this.guests) this.scene.remove(guest.group)
    this.guests = []
    this.nodes.clear()
    this.drops = []
    this.controls.target.set(0, 0, 0.8)
  }

  // ---------------------------------------------- per-frame

  update(dt, t, placedCount) {
    this.controls.update()
    for (const cloud of this.clouds) {
      cloud.position.x += cloud.userData.speed * dt
      if (cloud.position.x > 44) cloud.position.x = -44
    }
    for (let i = this.drops.length - 1; i >= 0; i--) {
      const d = this.drops[i]
      const dy = d.targetY - d.group.position.y
      d.v += dy * 60 * dt
      d.v *= Math.exp(-8 * dt)
      d.group.position.y += d.v * dt
      if (Math.abs(dy) < 0.02 && Math.abs(d.v) < 0.05) {
        d.group.position.y = d.targetY
        this.drops.splice(i, 1)
      }
    }
    for (const view of this.placedViews.values()) {
      if (view.group.userData?.water) {
        view.group.userData.water.position.y = 0.34 + Math.sin(t * 2.5 + view.t) * 0.03
      }
    }
    this.updateDinos(dt, t)
    this.updateGuests(dt, placedCount)
    for (let i = this.popups.length - 1; i >= 0; i--) {
      const p = this.popups[i]
      p.age += dt
      p.sprite.position.y += dt * 1.4
      p.sprite.material.opacity = Math.max(0, 1 - (p.age / p.life) ** 2)
      if (p.age >= p.life) {
        this.scene.remove(p.sprite)
        this.popups.splice(i, 1)
      }
    }
    this.renderer.render(this.scene, this.camera)
  }

  pick(clientX, clientY) {
    const rect = this.renderer.domElement.getBoundingClientRect()
    const ndc = new THREE.Vector2(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1)
    this.raycaster.setFromCamera(ndc, this.camera)
    const hits = this.raycaster.intersectObjects([...this.pads.values()], false)
    return hits[0]?.object.userData.cellKey ?? null
  }

  resize() {
    const w = this.container.clientWidth
    const h = this.container.clientHeight
    this.camera.aspect = w / Math.max(1, h)
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(w, h)
  }
}
