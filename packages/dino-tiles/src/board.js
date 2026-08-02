// The 3D hex board: tile prisms, mini dinos, drop animations, score popups.
// All game rules live in game.js — this file only renders and picks.

import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { makeDino } from './dinos.js'
import { cellsList, R } from './game.js'

const HEX = 2.1 // circumradius of the layout grid
const TILE_R = 1.92 // visual tile radius (leaves a seam)
const SQ3 = Math.sqrt(3)

export function cellPos(q, r) {
  return { x: HEX * SQ3 * (q + r / 2), z: HEX * 1.5 * r }
}

function mat(color, extra = {}) {
  return new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.95, ...extra })
}

const SPH = new THREE.SphereGeometry(1, 10, 8)
const CONE = new THREE.ConeGeometry(1, 1, 8)
const CYL = new THREE.CylinderGeometry(1, 1, 1, 10)
const BOX = new THREE.BoxGeometry(1, 1, 1)
const HEX_GEO = new THREE.CylinderGeometry(TILE_R, TILE_R * 1.06, 0.6, 6)
const PAD_GEO = new THREE.CylinderGeometry(TILE_R * 0.94, TILE_R, 0.22, 6)

function mesh(g, m, x = 0, y = 0, z = 0) {
  const o = new THREE.Mesh(g, m)
  o.position.set(x, y, z)
  o.castShadow = true
  o.receiveShadow = true
  return o
}

const TOP_COLORS = {
  parasaur: 0x8fd472,
  stego: 0x8fd472,
  trike: 0x8fd472,
  raptor: 0xd9c27e,
  trex: 0xd9a56e,
  lake: 0x6fc8e8,
  garden: 0x7ccf5f,
  snack: 0xf6e3b8,
  fence: 0xd9c9a0,
}

// ------------------------------------------------- tile dressing

function dressDino(group, tileKey) {
  const scale = { parasaur: 0.55, stego: 0.5, trike: 0.5, raptor: 0.6, trex: 0.42 }[tileKey]
  const rig = makeDino(tileKey)
  rig.group.scale.setScalar(scale)
  rig.group.position.y = 0.3
  rig.group.rotation.y = Math.PI + (Math.random() - 0.5) * 0.8 // face the camera-ish
  group.add(rig.group)
  return rig
}

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

function dressFence(group) {
  const postM = mat(0x9a6a43)
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + Math.PI / 6
    const x = Math.cos(a) * TILE_R * 0.78
    const z = Math.sin(a) * TILE_R * 0.78
    const post = mesh(BOX, postM, x, 0.72, z)
    post.scale.set(0.14, 0.85, 0.14)
    group.add(post)
    const a2 = ((i + 1) / 6) * Math.PI * 2 + Math.PI / 6
    const x2 = Math.cos(a2) * TILE_R * 0.78
    const z2 = Math.sin(a2) * TILE_R * 0.78
    for (const h of [0.55, 0.9]) {
      const rail = mesh(BOX, postM, (x + x2) / 2, h, (z + z2) / 2)
      rail.scale.set(Math.hypot(x2 - x, z2 - z), 0.08, 0.08)
      rail.rotation.y = Math.atan2(-(z2 - z), x2 - x)
      group.add(rail)
    }
  }
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
    this.scene.fog = new THREE.Fog(0xb9e6f9, 70, 160)

    this.camera = new THREE.PerspectiveCamera(48, 1, 0.5, 300)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.target.set(0, 0, 0.8)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.09
    this.controls.enablePan = false
    this.controls.minDistance = 16
    this.controls.maxDistance = 55
    this.controls.minPolarAngle = 0.25
    this.controls.maxPolarAngle = 1.05
    this.controls.minAzimuthAngle = -0.7
    this.controls.maxAzimuthAngle = 0.7

    this.raycaster = new THREE.Raycaster()
    this.emptyMeshes = new Map() // key -> mesh
    this.placed = new Map() // key -> { group, rig }
    this.drops = [] // spring animations
    this.popups = []

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
    cam.left = cam.bottom = -24
    cam.right = cam.top = 24
    cam.far = 90
    this.scene.add(sun)

    const ground = mesh(CYL, mat(0x7ecb5f), 0, -0.6, 0)
    ground.scale.set(26, 1, 26)
    this.scene.add(ground)
    const skirt = mesh(CYL, mat(0x5da648), 0, -1.5, 0)
    skirt.scale.set(28, 1.2, 28)
    this.scene.add(skirt)

    // Ring of scenery outside the board.
    const rng = (a, b) => a + Math.random() * (b - a)
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2 + rng(-0.15, 0.15)
      const rad = rng(17.5, 23)
      const x = Math.cos(a) * rad
      const z = Math.sin(a) * rad
      if (Math.random() < 0.75) {
        const h = rng(1.8, 3.4)
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
    for (let i = 0; i < 4; i++) {
      const cloud = new THREE.Group()
      const white = mat(0xffffff, { flatShading: false })
      for (let j = 0; j < 3; j++) {
        const puff = new THREE.Mesh(SPH, white)
        puff.position.set(j * 1.4 - 1.4, Math.random() * 0.3, Math.random() * 0.7)
        puff.scale.set(rng(1.0, 1.8), rng(0.6, 0.9), rng(0.9, 1.3))
        cloud.add(puff)
      }
      cloud.position.set(rng(-30, 30), rng(12, 18), rng(-24, 10))
      cloud.userData.speed = rng(0.3, 0.8)
      this.scene.add(cloud)
      this.clouds.push(cloud)
    }

    // Empty pads for every cell.
    for (const cell of cellsList()) {
      const { x, z } = cellPos(cell.q, cell.r)
      const pad = mesh(PAD_GEO, mat(0xcfc6a5), x, 0.11, z)
      pad.rotation.y = Math.PI / 6
      pad.castShadow = false
      pad.userData.cell = cell
      this.scene.add(pad)
      this.emptyMeshes.set(cell.key, pad)
    }
  }

  placeTile(cell, tileKey) {
    const { x, z } = cellPos(cell.q, cell.r)
    const pad = this.emptyMeshes.get(cell.key)
    if (pad) pad.visible = false

    const group = new THREE.Group()
    group.position.set(x, 7, z) // drops in
    const tile = mesh(HEX_GEO, mat(TOP_COLORS[tileKey] ?? 0xcfc6a5), 0, 0, 0)
    tile.rotation.y = Math.PI / 6
    group.add(tile)
    const dress = { lake: dressLake, garden: dressGarden, snack: dressSnack, fence: dressFence }[tileKey]
    let rig = null
    if (dress) dress(group)
    else rig = dressDino(group, tileKey)
    this.scene.add(group)
    this.placed.set(cell.key, { group, rig, t: Math.random() * 10 })
    this.drops.push({ group, targetY: 0.3, v: 0 })
    return group
  }

  popup(cell, text, tone = 'good', big = false) {
    const { x, z } = cellPos(cell.q, cell.r)
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 128
    const ctx = canvas.getContext('2d')
    ctx.font = `bold ${big ? 76 : 56}px system-ui, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.lineWidth = 10
    ctx.strokeStyle = 'rgba(30,25,10,0.85)'
    ctx.strokeText(text, 256, 64)
    ctx.fillStyle = tone === 'bad' ? '#ff8f85' : big ? '#ffd54f' : '#b6f397'
    ctx.fillText(text, 256, 64)
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }))
    sprite.position.set(x, 2.4, z)
    sprite.scale.set(big ? 7 : 5, big ? 1.75 : 1.25, 1)
    this.scene.add(sprite)
    this.popups.push({ sprite, age: 0, life: big ? 1.7 : 1.2 })
  }

  reset() {
    for (const { group } of this.placed.values()) this.scene.remove(group)
    this.placed.clear()
    for (const pad of this.emptyMeshes.values()) pad.visible = true
    for (const p of this.popups) this.scene.remove(p.sprite)
    this.popups = []
    this.drops = []
  }

  update(dt, t) {
    this.controls.update()
    for (const cloud of this.clouds) {
      cloud.position.x += cloud.userData.speed * dt
      if (cloud.position.x > 34) cloud.position.x = -34
    }
    // spring drops
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
    // idle mini dinos
    for (const view of this.placed.values()) {
      if (!view.rig) {
        if (view.group.userData?.water) {
          view.group.userData.water.position.y = 0.34 + Math.sin(t * 2.5 + view.t) * 0.03
        }
        continue
      }
      view.t += dt
      const rig = view.rig
      const baseY = rig.bodyPivot.userData.baseY ?? (rig.bodyPivot.userData.baseY = rig.bodyPivot.position.y)
      rig.bodyPivot.position.y = baseY + Math.sin(view.t * 2) * 0.03
      rig.tail.forEach((seg, i) => {
        seg.rotation.y = Math.sin(view.t * 2.2 + i * 0.9) * 0.14
      })
      if (rig.wings) {
        const flap = Math.sin(view.t * 6) * 0.3
        rig.wings[0].rotation.z = flap
        rig.wings[1].rotation.z = -flap
      }
      if (rig.neck) rig.neck.rotation.x = 0.55 + Math.sin(view.t * 1.1) * 0.06
      else rig.head.rotation.x = Math.sin(view.t * 1.5) * 0.07
      if (rig.jaw) rig.jaw.rotation.x = 0.08 + Math.max(0, Math.sin(view.t * 0.7)) * 0.25
    }
    // popups float up + fade
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
    const targets = [...this.emptyMeshes.values()].filter((m) => m.visible)
    const hits = this.raycaster.intersectObjects(targets, false)
    return hits[0]?.object.userData.cell ?? null
  }

  resize() {
    const w = this.container.clientWidth
    const h = this.container.clientHeight
    const aspect = w / Math.max(1, h)
    this.camera.aspect = aspect
    // Fit the whole board: pull back further on narrow screens.
    const dist = aspect < 0.8 ? 42 : aspect < 1.2 ? 34 : 28
    this.camera.position.set(0, dist * 0.82, dist * 0.66)
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(w, h)
  }
}
