// The 3D park: Voronoi cell prisms, trail ribbons, boundary fences, dinos,
// and guest agents walking real shortest paths. The guest sim doubles as the
// economy's sensor: every trail crossing is counted and handed to dayTick.

import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { SPECIES, FENCES, TERRAIN } from './data.js'
import { makeDino, makeEmote } from './dinos.js'
import { randomPointIn, shortestPath } from './terrain.js'

const TRAIL_Y = 0.5

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

// ------------------------------------------------- small builders

function buildKiosk(scale) {
  const g = new THREE.Group()
  const base = mesh(BOX, mat(0xf2c14e), 0, 0.8, 0)
  base.scale.set(2.2, 1.6, 1.7)
  g.add(base)
  for (let i = 0; i < 5; i++) {
    const stripe = mesh(BOX, mat(i % 2 ? 0xffffff : 0xe5533d), -1.0 + i * 0.5, 1.85, 0.85)
    stripe.scale.set(0.5, 0.1, 0.9)
    stripe.rotation.x = -0.35
    g.add(stripe)
  }
  const dog = mesh(CYL, mat(0xc96f3a), 0, 2.35, 0)
  dog.scale.set(0.24, 1.1, 0.24)
  dog.rotation.z = Math.PI / 2
  g.add(dog)
  g.scale.setScalar(scale)
  return g
}

function buildGift(scale) {
  const g = new THREE.Group()
  const base = mesh(BOX, mat(0x9fd0e8), 0, 0.9, 0)
  base.scale.set(2.2, 1.8, 2.0)
  g.add(base)
  const roof = mesh(CONE, mat(0xe87ba4), 0, 2.5, 0)
  roof.scale.set(1.9, 1.4, 1.9)
  g.add(roof)
  const star = mesh(SPH, mat(0xffd54f, { emissive: 0x996f00 }), 0, 3.4, 0)
  star.scale.setScalar(0.28)
  g.add(star)
  g.scale.setScalar(scale)
  return g
}

function buildGarden(scale) {
  const g = new THREE.Group()
  for (const [x, z, h, r] of [[-0.8, -0.4, 1.3, 0.65], [0.6, 0.3, 1.7, 0.8], [-0.1, 0.9, 1.0, 0.5]]) {
    const trunk = mesh(CYL, mat(0x8d6e63), x, h * 0.35, z)
    trunk.scale.set(0.13, h * 0.7, 0.13)
    const ball = mesh(SPH, mat(0x66bb6a), x, h, z)
    ball.scale.setScalar(r)
    g.add(trunk, ball)
  }
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2
    const bloom = mesh(SPH, mat([0xe5533d, 0xffd54f, 0xe87ba4][i % 3]), Math.cos(a) * 1.6, 0.15, Math.sin(a) * 1.6)
    bloom.scale.setScalar(0.14)
    g.add(bloom)
  }
  g.scale.setScalar(scale)
  return g
}

function buildRestroom(scale) {
  const g = new THREE.Group()
  const base = mesh(BOX, mat(0xcfd8dc), 0, 0.75, 0)
  base.scale.set(2.1, 1.5, 1.5)
  g.add(base)
  const roof = mesh(BOX, mat(0x78909c), 0, 1.6, 0)
  roof.scale.set(2.4, 0.22, 1.8)
  g.add(roof)
  for (const [x, color] of [[-0.5, 0x4a90d9], [0.5, 0xe87ba4]]) {
    const door = mesh(BOX, mat(color), x, 0.6, 0.76)
    door.scale.set(0.55, 1.1, 0.08)
    g.add(door)
  }
  g.scale.setScalar(scale)
  return g
}

const BUILDING_BUILDERS = { kiosk: buildKiosk, gift: buildGift, garden: buildGarden, restroom: buildRestroom }

const FENCE_COLORS = [0x9a6a43, 0x5c6670, 0x4a5560]
const FENCE_H = [1.0, 1.6, 1.9]

// Fence along the cell's boundary polygon, inset a step from the trail.
function buildFence(cell, level) {
  const g = new THREE.Group()
  const [cx, cz] = cell.centroid
  const inset = cell.poly.map(([x, z]) => {
    const dx = cx - x
    const dz = cz - z
    const len = Math.hypot(dx, dz) || 1
    return [x + (dx / len) * 0.45, z + (dz / len) * 0.45]
  })
  const h = FENCE_H[level]
  const postM = mat(FENCE_COLORS[level])
  const wireM = level === 2 ? mat(0x53d7ff, { emissive: 0x1d7fa5, emissiveIntensity: 1.3 }) : null
  const wires = []
  for (let i = 0; i < inset.length; i++) {
    const [ax, az] = inset[i]
    const [bx, bz] = inset[(i + 1) % inset.length]
    const post = mesh(BOX, postM, ax, h / 2, az)
    post.scale.set(0.18, h, 0.18)
    g.add(post)
    const len = Math.hypot(bx - ax, bz - az)
    const midx = (ax + bx) / 2
    const midz = (az + bz) / 2
    const yaw = Math.atan2(-(bz - az), bx - ax)
    const rails = level === 0 ? 2 : 3
    for (let r = 1; r <= rails; r++) {
      const rail = mesh(BOX, postM, midx, (h * r) / (rails + 0.6), midz)
      rail.scale.set(len, 0.09, 0.09)
      rail.rotation.y = yaw
      g.add(rail)
    }
    if (wireM) {
      const wire = mesh(BOX, wireM, midx, h + 0.08, midz)
      wire.scale.set(len + 0.1, 0.06, 0.06)
      wire.rotation.y = yaw
      wires.push(wire)
      g.add(wire)
    }
  }
  if (wireM) g.userData.anim = { type: 'electric', mat: wireM }
  return g
}

// ------------------------------------------------- world

export class World {
  constructor(container, park) {
    this.container = container
    this.park = park
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
    const dist = aspect < 0.9 ? 64 : 48
    this.camera.position.set(0, dist * 0.62, dist * 0.85)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.target.set(0, 0, 9)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.08
    this.controls.enablePan = false
    this.controls.minDistance = 12
    this.controls.maxDistance = 85
    this.controls.minPolarAngle = 0.25
    this.controls.maxPolarAngle = 1.35

    this.raycaster = new THREE.Raycaster()
    this.cellMeshes = [] // pickable prisms, index = cell id
    this.cellContents = new Map() // cellId -> { group, sig }
    this.dinoViews = new Map()
    this.guests = []
    this.spawnAcc = 0
    this.heatOn = false
    this.heatTimer = 0

    // Traffic sensors.
    this.edgeCounts = new Map()
    this.entered = 0
    this.cellEdges = park.cells.map((c) => {
      const keys = []
      for (const e of park.edges) {
        if (e.cells.includes(c.id)) keys.push(e.key)
      }
      return keys
    })

    this.buildStatic()
    this.buildTerrain()
    this.buildSelection()
    this.resize()
  }

  buildStatic() {
    const park = this.park
    this.scene.add(new THREE.HemisphereLight(0xcdf0ff, 0x7a9a4f, 0.95))
    const sun = new THREE.DirectionalLight(0xfff3d6, 1.6)
    sun.position.set(28, 42, 14)
    sun.castShadow = true
    sun.shadow.mapSize.set(1024, 1024)
    const cam = sun.shadow.camera
    cam.left = cam.bottom = -42
    cam.right = cam.top = 42
    cam.far = 130
    this.scene.add(sun)

    const ground = mesh(CYL, mat(0x7ecb5f), 0, -0.5, 0)
    ground.scale.set(park.R + 17, 1, park.R + 17)
    this.scene.add(ground)
    const skirt = mesh(CYL, mat(0x5da648), 0, -1.4, 0)
    skirt.scale.set(park.R + 19, 1.2, park.R + 19)
    this.scene.add(skirt)

    // Gate arch at the south boundary vertex.
    const [gx, gz] = park.verts[park.gateVertex]
    const gate = new THREE.Group()
    gate.position.set(gx, 0.2, gz + 1.2)
    for (const x of [-3.2, 3.2]) {
      const pillar = mesh(BOX, mat(0xb98b5a), x, 2.2, 0)
      pillar.scale.set(1.0, 4.4, 1.0)
      const cap = mesh(SPH, mat(0xe5533d), x, 4.6, 0)
      cap.scale.setScalar(0.7)
      gate.add(pillar, cap)
    }
    const beam = mesh(BOX, mat(0xb98b5a), 0, 4.3, 0)
    beam.scale.set(7.4, 0.85, 0.85)
    gate.add(beam)
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 160
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#fdf3d8'
    ctx.beginPath()
    ctx.roundRect(4, 4, 504, 152, 20)
    ctx.fill()
    ctx.strokeStyle = '#6b4a2b'
    ctx.lineWidth = 7
    ctx.stroke()
    ctx.fillStyle = '#6b4a2b'
    ctx.font = 'bold 64px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('🦕 DINO TRAILS', 256, 84)
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 1.95), new THREE.MeshBasicMaterial({ map: tex, transparent: true }))
    sign.position.set(0, 5.5, 0.1)
    gate.add(sign)
    const back = sign.clone()
    back.rotation.y = Math.PI
    back.position.z = -0.1
    gate.add(back)
    this.scene.add(gate)

    // Wilderness ring outside the boundary.
    const rng = (a, b) => a + Math.random() * (b - a)
    for (let i = 0; i < 30; i++) {
      const a = (i / 30) * Math.PI * 2 + rng(-0.1, 0.1)
      const rad = park.R + rng(3.5, 12)
      const x = Math.sin(a) * rad
      const z = Math.cos(a) * rad
      if (z > park.R - 4 && Math.abs(x - gx) < 9) continue
      if (Math.random() < 0.72) {
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

    this.clouds = []
    for (let i = 0; i < 6; i++) {
      const cloud = new THREE.Group()
      const white = mat(0xffffff, { flatShading: false })
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

  buildTerrain() {
    const park = this.park
    // Cell prisms.
    for (const cell of park.cells) {
      const shape = new THREE.Shape()
      cell.poly.forEach(([x, z], i) => (i ? shape.lineTo(x, -z) : shape.moveTo(x, -z)))
      const geo = new THREE.ExtrudeGeometry(shape, { depth: cell.elev, bevelEnabled: false })
      geo.rotateX(-Math.PI / 2)
      const m = mat(TERRAIN[cell.terrain].color)
      const prism = new THREE.Mesh(geo, m)
      prism.receiveShadow = true
      prism.castShadow = false
      prism.userData.cellId = cell.id
      this.scene.add(prism)
      this.cellMeshes[cell.id] = prism
      if (cell.terrain === 'water') {
        for (let i = 0; i < 3; i++) {
          const p = randomPointIn(cell, Math.random, 0.8)
          const pad = mesh(CYL, mat(0x7ccf7a), p.x, cell.elev + 0.03, p.z)
          pad.scale.set(0.45, 0.04, 0.45)
          this.scene.add(pad)
        }
      }
    }
    // Trail ribbons.
    this.ribbons = new Map()
    const trailM = () => mat(0xecdcab)
    for (const e of park.edges) {
      const [ax, az] = park.verts[e.a]
      const [bx, bz] = park.verts[e.b]
      const ribbon = mesh(BOX, trailM(), (ax + bx) / 2, TRAIL_Y - 0.05, (az + bz) / 2)
      ribbon.scale.set(e.length + 0.3, 0.12, 0.95)
      ribbon.rotation.y = Math.atan2(-(bz - az), bx - ax)
      ribbon.castShadow = false
      this.scene.add(ribbon)
      this.ribbons.set(e.key, ribbon)
    }
  }

  buildSelection() {
    this.selRing = new THREE.Mesh(new THREE.TorusGeometry(1, 0.13, 8, 32), new THREE.MeshBasicMaterial({ color: 0xffd54f }))
    this.selRing.rotation.x = Math.PI / 2
    this.selRing.visible = false
    this.scene.add(this.selRing)
  }

  setSelected(cell) {
    if (!cell) {
      this.selRing.visible = false
      return
    }
    const [cx, cz] = cell.centroid
    this.selRing.position.set(cx, cell.elev + 0.15, cz)
    this.selBase = Math.max(1.2, cell.inradius * 0.85)
    this.selRing.visible = true
  }

  // ---------------------------------------------- state sync

  syncState(s) {
    this.state = s
    const park = this.park
    for (const cell of park.cells) {
      const cs = s.cells[cell.id]
      const sig = `${cs.owned}|${cs.use}|${cs.fence}`
      const existing = this.cellContents.get(cell.id)
      if (existing?.sig === sig) continue
      if (existing) this.scene.remove(existing.group)

      // tint prism by ownership
      const base = new THREE.Color(TERRAIN[cell.terrain].color)
      if (!cs.owned && cell.terrain !== 'water') base.lerp(new THREE.Color(0xb9ad91), 0.32)
      this.cellMeshes[cell.id].material.color = base

      const group = new THREE.Group()
      const [cx, cz] = cell.centroid
      const scale = Math.max(0.7, Math.min(1.3, cell.inradius / 2.4))
      if (cs.use === 'paddock') {
        const fence = buildFence(cell, cs.fence)
        fence.position.y = cell.elev
        group.add(fence)
        if (fence.userData.anim) group.userData.anim = fence.userData.anim
        const trough = mesh(BOX, mat(0x8d6e63), cx + cell.inradius * 0.4, cell.elev + 0.18, cz + cell.inradius * 0.4)
        trough.scale.set(0.9, 0.32, 0.5)
        group.add(trough)
      } else if (cs.use) {
        const b = BUILDING_BUILDERS[cs.use](scale)
        b.position.set(cx, cell.elev, cz)
        group.add(b)
      }
      this.scene.add(group)
      this.cellContents.set(cell.id, { group, sig, cell })
    }

    // fence-too-weak badges
    for (const { group, cell } of this.cellContents.values()) {
      const cs = s.cells[cell.id]
      if (cs.use !== 'paddock') continue
      const weak = s.dinos.some((d) => d.cell === cell.id && !d.escaped && SPECIES[d.sp].fer > FENCES[cs.fence].strength)
      if (weak && !group.userData.warn) {
        const warn = makeEmote('⚠️')
        warn.position.set(cell.centroid[0], cell.elev + 3.2, cell.centroid[1])
        group.add(warn)
        group.userData.warn = warn
      } else if (!weak && group.userData.warn) {
        group.remove(group.userData.warn)
        group.userData.warn = null
      }
    }

    // dinos
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

  createDinoView(d) {
    const rig = makeDino(d.sp)
    const cell = this.park.cells[d.cell]
    const p = randomPointIn(cell)
    rig.group.position.set(p.x, cell.elev, p.z)
    rig.group.rotation.y = Math.random() * Math.PI * 2
    rig.group.traverse((o) => {
      o.userData.dinoId = d.id
    })
    const alertRing = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.12, 8, 24), new THREE.MeshBasicMaterial({ color: 0xe5533d }))
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
      emoteTxt: null,
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
      sprite.position.set(0, view.rig.size * 2.6 + 0.8, 0)
      view.rig.group.add(sprite)
      view.emote = sprite
    }
  }

  // ---------------------------------------------- traffic

  collectTraffic() {
    const byCell = {}
    for (let i = 0; i < this.cellEdges.length; i++) {
      let sum = 0
      for (const key of this.cellEdges[i]) sum += this.edgeCounts.get(key) ?? 0
      if (sum) byCell[i] = sum
    }
    const packet = { entered: this.entered, byCell }
    this.prevCounts = new Map(this.edgeCounts) // keep for the heat overlay
    this.edgeCounts.clear()
    this.entered = 0
    return packet
  }

  setHeat(on) {
    this.heatOn = on
    if (!on) {
      for (const ribbon of this.ribbons.values()) ribbon.material.color.set(0xecdcab)
    } else {
      this.paintHeat()
    }
  }

  paintHeat() {
    // Blend yesterday's full day with today's accrual so the map never
    // goes cold right after a day tick.
    const count = (key) => (this.edgeCounts.get(key) ?? 0) + (this.prevCounts?.get(key) ?? 0)
    let max = 4
    for (const key of this.ribbons.keys()) max = Math.max(max, count(key))
    const cold = new THREE.Color(0xe8e4d2)
    const warm = new THREE.Color(0xf5a13d)
    const hot = new THREE.Color(0xe5382f)
    for (const [key, ribbon] of this.ribbons) {
      const t = Math.min(1, count(key) / max)
      const c = t < 0.5 ? cold.clone().lerp(warm, t * 2) : warm.clone().lerp(hot, (t - 0.5) * 2)
      ribbon.material.color = c
    }
  }

  // ---------------------------------------------- guests

  spawnGuest() {
    const park = this.park
    const g = new THREE.Group()
    const pastel = [0xf28bb4, 0x8bc9f2, 0xf2d38b, 0xa8e0a0, 0xc7a8f0, 0xf2a58b]
    const body = mesh(new THREE.CapsuleGeometry(0.22, 0.35, 4, 8), mat(pastel[Math.floor(Math.random() * pastel.length)]), 0, 0.5, 0)
    const skin = [0xf5d0a9, 0xd9a066, 0x8d5524, 0xffdbac][Math.floor(Math.random() * 4)]
    const head = mesh(SPH, mat(skin), 0, 0.98, 0)
    head.scale.setScalar(0.2)
    g.add(body, head)
    if (Math.random() < 0.3) {
      const cap = mesh(CONE, mat(0xe5533d), 0, 1.14, 0)
      cap.scale.set(0.16, 0.14, 0.16)
      g.add(cap)
    }
    const [gx, gz] = park.verts[park.gateVertex]
    g.position.set(gx, TRAIL_Y, gz)
    this.scene.add(g)
    const guest = { group: g, at: park.gateVertex, path: [], seg: 0, mode: 'wander', dwell: 0, t: Math.random() * 5 }
    this.pickGuestTarget(guest)
    this.guests.push(guest)
    this.entered += 1
  }

  attractionCells() {
    const s = this.state
    const out = []
    for (const cell of this.park.cells) {
      const cs = s.cells[cell.id]
      if (cs.use === 'paddock') {
        const draw = this.state.dinos.filter((d) => d.cell === cell.id && !d.escaped).reduce((t, d) => t + SPECIES[d.sp].pop, 0)
        if (draw) out.push({ cell, draw })
      } else if (cs.use === 'gift' || cs.use === 'kiosk') {
        out.push({ cell, draw: 0.8 })
      }
    }
    return out
  }

  pickGuestTarget(guest) {
    const park = this.park
    const options = this.attractionCells()
    let targetVertex
    if (!options.length) {
      targetVertex = Math.floor(Math.random() * park.verts.length)
    } else {
      const total = options.reduce((t, o) => t + o.draw, 0)
      let roll = Math.random() * total
      let pick = options[0]
      for (const o of options) {
        roll -= o.draw
        if (roll <= 0) {
          pick = o
          break
        }
      }
      const ids = pick.cell.vertIds
      targetVertex = ids[Math.floor(Math.random() * ids.length)]
    }
    const path = shortestPath(park, guest.at, targetVertex)
    if (path && path.length > 1) {
      guest.path = path
      guest.seg = 0
      guest.mode = 'walk'
    } else {
      guest.mode = 'dwell'
      guest.dwell = 1 + Math.random() * 2
    }
  }

  updateGuests(dt, spawnPerSec) {
    const park = this.park
    const s = this.state
    const fleeing = s && s.dinos.some((d) => d.escaped)
    this.spawnAcc += dt * spawnPerSec
    while (this.spawnAcc >= 1 && this.guests.length < 48) {
      this.spawnAcc -= 1
      this.spawnGuest()
    }
    for (let i = this.guests.length - 1; i >= 0; i--) {
      const guest = this.guests[i]
      // Scurrying-ant pace: a full park crossing takes about a day, so
      // footfall counts actually accumulate on the trails.
      const speed = fleeing ? 7 : 3.6
      if (guest.mode === 'dwell') {
        guest.dwell -= dt
        guest.t += dt
        guest.group.position.y = TRAIL_Y + Math.abs(Math.sin(guest.t * 3)) * 0.03
        if (fleeing || guest.dwell <= 0) {
          if (fleeing || Math.random() < 0.35) {
            const path = shortestPath(park, guest.at, park.gateVertex)
            if (path && path.length > 1) {
              guest.path = path
              guest.seg = 0
              guest.mode = 'leave'
            } else {
              guest.mode = 'leave-now'
            }
          } else {
            this.pickGuestTarget(guest)
          }
        }
        continue
      }
      if (guest.mode === 'leave-now') {
        this.scene.remove(guest.group)
        this.guests.splice(i, 1)
        continue
      }
      // walking a path
      const from = park.verts[guest.path[guest.seg]]
      const to = park.verts[guest.path[guest.seg + 1]]
      const dx = to[0] - guest.group.position.x
      const dz = to[1] - guest.group.position.z
      const dist = Math.hypot(dx, dz)
      guest.t += dt
      guest.group.position.y = TRAIL_Y + Math.abs(Math.sin(guest.t * 8)) * 0.07
      if (dist < 0.12) {
        // segment done — count the crossing
        const a = guest.path[guest.seg]
        const b = guest.path[guest.seg + 1]
        const key = a < b ? `${a}-${b}` : `${b}-${a}`
        this.edgeCounts.set(key, (this.edgeCounts.get(key) ?? 0) + 1)
        guest.at = b
        guest.seg += 1
        if (guest.seg >= guest.path.length - 1) {
          if (guest.mode === 'leave') {
            this.scene.remove(guest.group)
            this.guests.splice(i, 1)
          } else {
            guest.mode = 'dwell'
            guest.dwell = 1 + Math.random() * 1.5
          }
        }
        continue
      }
      const step = Math.min(dist, speed * dt)
      guest.group.position.x += (dx / dist) * step
      guest.group.position.z += (dz / dist) * step
      guest.group.rotation.y = Math.atan2(dx, dz)
    }
  }

  // ---------------------------------------------- per-frame

  update(dt, t, spawnPerSec) {
    this.controls.update()
    if (this.state) {
      this.updateDinos(dt, t)
      this.updateGuests(dt, spawnPerSec)
    }
    for (const cloud of this.clouds) {
      cloud.position.x += cloud.userData.speed * dt
      if (cloud.position.x > 65) cloud.position.x = -65
    }
    for (const { group } of this.cellContents.values()) {
      if (group.userData.anim?.type === 'electric') {
        group.userData.anim.mat.emissiveIntensity = 1.1 + Math.sin(t * 10) * 0.5
      }
      if (group.userData.warn) {
        group.userData.warn.position.y += Math.sin(t * 2.5) * 0.004
      }
    }
    if (this.heatOn) {
      this.heatTimer += dt
      if (this.heatTimer > 0.5) {
        this.heatTimer = 0
        this.paintHeat()
      }
    }
    if (this.selRing.visible) {
      const p = (this.selBase ?? 1.5) * (1 + Math.sin(t * 5) * 0.05)
      this.selRing.scale.set(p, p, 1)
    }
    this.renderer.render(this.scene, this.camera)
  }

  updateDinos(dt, t) {
    const park = this.park
    for (const view of this.dinoViews.values()) {
      const g = view.rig.group
      const cell = park.cells[view.dino.cell]
      if (!view.target || view.idle < 0) {
        if (view.escaped) {
          const a = Math.random() * Math.PI * 2
          const r = Math.sqrt(Math.random()) * (park.R - 3)
          view.target = { x: Math.sin(a) * r, z: Math.cos(a) * r }
        } else {
          view.target = randomPointIn(cell, Math.random, 0.9 + view.rig.size * 0.4)
        }
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
      g.position.y = view.escaped ? TRAIL_Y - 0.1 : cell.elev

      view.t += dt * (view.moving ? (view.escaped ? 2.2 : 1.4) : 0.6)
      const rig = view.rig
      const amp = view.moving ? 0.55 : 0
      for (const leg of rig.legs) leg.pivot.rotation.x = Math.sin(view.t * 7 + leg.phase) * amp
      const baseY = rig.bodyPivot.userData.baseY ?? (rig.bodyPivot.userData.baseY = rig.bodyPivot.position.y)
      rig.bodyPivot.position.y =
        baseY + (view.moving ? Math.abs(Math.sin(view.t * 7)) * 0.09 * rig.size : Math.sin(view.t * 2) * 0.02 * rig.size)
      rig.tail.forEach((seg, i) => {
        seg.rotation.y = Math.sin(view.t * 2.5 + i * 0.9) * 0.16
      })
      if (rig.neck) rig.neck.rotation.x = 0.55 + Math.sin(view.t * 1.2) * 0.08
      else rig.head.rotation.x = Math.sin(view.t * 1.7) * 0.08
      if (rig.jaw) rig.jaw.rotation.x = view.escaped ? 0.35 + Math.sin(view.t * 6) * 0.25 : 0.05
      if (view.emote) view.emote.position.y = rig.size * 2.6 + 0.8 + Math.sin(t * 3 + view.t) * 0.12
      if (view.alertRing.visible) {
        const p = 1 + Math.sin(t * 6) * 0.25
        view.alertRing.scale.set(p, p, 1)
      }
    }
  }

  // ---------------------------------------------- picking / resize

  pick(clientX, clientY) {
    const rect = this.renderer.domElement.getBoundingClientRect()
    const ndc = new THREE.Vector2(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1)
    this.raycaster.setFromCamera(ndc, this.camera)
    const targets = [...this.cellMeshes]
    for (const view of this.dinoViews.values()) targets.push(view.rig.group)
    const hits = this.raycaster.intersectObjects(targets, true)
    for (const hit of hits) {
      let o = hit.object
      while (o) {
        if (o.userData.dinoId != null) return { type: 'dino', id: o.userData.dinoId }
        if (o.userData.cellId != null) return { type: 'cell', id: o.userData.cellId }
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
