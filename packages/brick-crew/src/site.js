// ---------------------------------------------------------------------------
// The stage: ground, road, hoarding, the site office, and the lighting rig.
//
// The ground is a single plane with a painted canvas texture rather than a
// stack of overlapping planes — dirt, grass, the worn track from the gate and
// the tyre ruts are all drawn into one image, so nothing z-fights.
// ---------------------------------------------------------------------------

import * as THREE from 'three'
import { SITE, COLORS, PLOTS, YARD, DEPOT } from './config.js'

const BOX = new THREE.BoxGeometry(1, 1, 1)
const CYL = new THREE.CylinderGeometry(0.5, 0.5, 1, 16)

const GROUND = 180

function box(parent, material, sx, sy, sz, x = 0, y = 0, z = 0, geo = BOX) {
  const m = new THREE.Mesh(geo, material)
  m.scale.set(sx, sy, sz)
  m.position.set(x, y, z)
  m.castShadow = true
  m.receiveShadow = true
  parent.add(m)
  return m
}

const hex = (n) => `#${n.toString(16).padStart(6, '0')}`

/** Deterministic value noise so the ground looks the same every reload. */
function hash2(x, y) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return s - Math.floor(s)
}

// --- ground ----------------------------------------------------------------

function groundTexture() {
  const S = 2048
  const cv = document.createElement('canvas')
  cv.width = cv.height = S
  const c = cv.getContext('2d')
  // world -> texture: the plane spans GROUND metres centred on the origin
  const px = (wx) => ((wx + GROUND / 2) / GROUND) * S
  const pz = (wz) => ((wz + GROUND / 2) / GROUND) * S
  const m = (n) => (n / GROUND) * S

  c.fillStyle = hex(COLORS.grass)
  c.fillRect(0, 0, S, S)
  // mown variation in the grass
  for (let i = 0; i < 2200; i++) {
    const x = hash2(i, 1) * S
    const y = hash2(i, 2) * S
    c.fillStyle = `rgba(${hash2(i, 3) > 0.5 ? '120,160,80' : '90,130,60'},0.16)`
    c.fillRect(x, y, 6 + hash2(i, 4) * 22, 3 + hash2(i, 5) * 6)
  }

  // the compound itself: churned-up dirt inside the hoarding
  const f = SITE.fence
  c.fillStyle = hex(COLORS.dirt)
  c.beginPath()
  c.rect(px(f.x0 - 0.6), pz(f.z0 - 0.6), m(f.x1 - f.x0 + 1.2), m(f.z1 - f.z0 + 1.2))
  c.fill()
  for (let i = 0; i < 4000; i++) {
    const x = px(f.x0) + hash2(i, 11) * m(f.x1 - f.x0)
    const y = pz(f.z0) + hash2(i, 12) * m(f.z1 - f.z0)
    const t = hash2(i, 13)
    c.fillStyle = t > 0.66 ? 'rgba(150,120,88,0.30)' : t > 0.33 ? 'rgba(120,94,66,0.28)' : 'rgba(196,172,140,0.22)'
    c.fillRect(x, y, 3 + t * 14, 3 + hash2(i, 14) * 10)
  }

  // worn haul routes: in at the gate, then out to each plot and round its yard
  c.strokeStyle = 'rgba(92,72,52,0.5)'
  c.lineCap = 'round'
  const track = (ax, az, bx, bz, w) => {
    c.lineWidth = m(w)
    c.beginPath()
    c.moveTo(px(ax), pz(az))
    c.lineTo(px(bx), pz(bz))
    c.stroke()
  }
  track(SITE.gate.x, SITE.roadZ, SITE.gate.x, SITE.gate.z - 1.5, 3.0)
  for (const plot of PLOTS) {
    track(SITE.gate.x, SITE.gate.z - 1.5, plot.x, plot.z + 6.0, 2.4)
    track(plot.x, plot.z + 6.0, plot.x + YARD.stacks.brick.x, plot.z + YARD.stacks.brick.z, 2.0)
    track(plot.x + YARD.stacks.tile.x, plot.z + YARD.stacks.tile.z,
      plot.x + YARD.sources.brick.x, plot.z + YARD.sources.brick.z, 1.8)
  }
  track(SITE.gate.x, SITE.gate.z - 1.5, SITE.trailer.x + 2, SITE.trailer.z, 1.6)
  // tyre ruts up the main run
  c.strokeStyle = 'rgba(70,54,38,0.34)'
  for (const off of [-0.55, 0.55]) {
    c.lineWidth = m(0.2)
    c.beginPath()
    c.moveTo(px(SITE.gate.x + off), pz(SITE.roadZ))
    c.lineTo(px(SITE.gate.x + off), pz(SITE.gate.z - 2))
    c.stroke()
  }

  // road
  c.fillStyle = '#3b3f44'
  c.fillRect(0, pz(SITE.roadZ - 3.1), S, m(6.2))
  c.fillStyle = 'rgba(255,255,255,0.06)'
  for (let i = 0; i < 900; i++) {
    c.fillRect(hash2(i, 21) * S, pz(SITE.roadZ - 3.1) + hash2(i, 22) * m(6.2), 3, 2)
  }
  c.fillStyle = '#c9c2a8'
  for (let x = 0; x < S; x += m(3.4)) c.fillRect(x, pz(SITE.roadZ) - m(0.09), m(1.9), m(0.18))
  c.fillStyle = 'rgba(230,230,220,0.5)'
  c.fillRect(0, pz(SITE.roadZ - 3.0), S, m(0.12))
  c.fillRect(0, pz(SITE.roadZ + 2.9), S, m(0.12))
  // the outfitting yard's apron, down the road
  c.fillStyle = '#8f8a82'
  c.fillRect(px(DEPOT.x - 15.5), pz(DEPOT.z - 14.5), m(31), m(22.5))

  // kerb
  c.fillStyle = '#9a958c'
  c.fillRect(0, pz(SITE.roadZ - 3.35), S, m(0.28))
  c.fillRect(0, pz(SITE.roadZ + 3.07), S, m(0.28))

  const tex = new THREE.CanvasTexture(cv)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

// --- sky -------------------------------------------------------------------

export function buildSky() {
  const S = 512
  const cv = document.createElement('canvas')
  cv.width = S
  cv.height = S
  const c = cv.getContext('2d')
  const g = c.createLinearGradient(0, 0, 0, S)
  g.addColorStop(0, '#0d4b9c')
  g.addColorStop(0.32, '#2b76c6')
  g.addColorStop(0.46, '#5b9dda')
  g.addColorStop(0.58, '#8dbde6')
  g.addColorStop(0.72, '#b9d4e6')
  g.addColorStop(1, '#cdbb99')
  c.fillStyle = g
  c.fillRect(0, 0, S, S)
  // soft cumulus
  for (let i = 0; i < 26; i++) {
    const cx = hash2(i, 31) * S
    const cy = 40 + hash2(i, 32) * S * 0.42
    const r = 16 + hash2(i, 33) * 34
    const grd = c.createRadialGradient(cx, cy, 0, cx, cy, r)
    grd.addColorStop(0, 'rgba(250,252,255,0.62)')
    grd.addColorStop(0.6, 'rgba(240,246,252,0.28)')
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    c.fillStyle = grd
    c.beginPath()
    c.arc(cx, cy, r, 0, Math.PI * 2)
    c.fill()
  }
  const tex = new THREE.CanvasTexture(cv)
  tex.colorSpace = THREE.SRGBColorSpace
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(220, 24, 16),
    // toneMapped off, or ACES flattens the sky to a pale wash.
    new THREE.MeshBasicMaterial({
      map: tex, side: THREE.BackSide, fog: false, depthWrite: false, toneMapped: false,
    }),
  )
  return { mesh }
}

// --- lights ----------------------------------------------------------------

export function buildLights() {
  const group = new THREE.Group()
  group.add(new THREE.HemisphereLight(0xbcd8f5, 0x8a7355, 1.05))
  const sun = new THREE.DirectionalLight(0xffeccc, 2.15)
  sun.position.set(-13, 20, 16)
  sun.castShadow = true
  sun.shadow.mapSize.set(2048, 2048)
  sun.shadow.camera.updateProjectionMatrix?.()
  const cam = sun.shadow.camera
  cam.left = -22
  cam.right = 22
  cam.top = 20
  cam.bottom = -16
  cam.near = 1
  cam.far = 60
  sun.shadow.bias = -0.0006
  sun.shadow.normalBias = 0.028
  group.add(sun)
  group.add(sun.target)
  sun.target.position.set(0, 1.2, 0)
  // a cool bounce from the sky on the shadowed faces
  const fill = new THREE.DirectionalLight(0x9fc4ee, 0.42)
  fill.position.set(12, 8, -14)
  group.add(fill)
  return { group, sun }
}

// --- trailer ---------------------------------------------------------------

function signTexture(title, sub) {
  const cv = document.createElement('canvas')
  cv.width = 512
  cv.height = 160
  const c = cv.getContext('2d')
  c.fillStyle = '#1d2a33'
  c.fillRect(0, 0, 512, 160)
  c.fillStyle = '#f0b429'
  c.fillRect(8, 8, 496, 144)
  c.fillStyle = '#1d2a33'
  c.fillRect(16, 16, 480, 128)
  c.textAlign = 'center'
  c.fillStyle = '#f5e6c8'
  c.font = 'bold 54px ui-monospace, Menlo, Consolas, monospace'
  c.fillText(title, 256, 76)
  c.fillStyle = '#f0b429'
  c.font = '26px ui-monospace, Menlo, Consolas, monospace'
  c.fillText(sub, 256, 116)
  const tex = new THREE.CanvasTexture(cv)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

function buildTrailer() {
  const g = new THREE.Group()
  const shell = new THREE.MeshStandardMaterial({ color: 0xe8e2d2, roughness: 0.55, metalness: 0.2 })
  const trim = new THREE.MeshStandardMaterial({ color: 0x2f6fa8, roughness: 0.5, metalness: 0.3 })
  const dark = new THREE.MeshStandardMaterial({ color: 0x454b52, roughness: 0.6, metalness: 0.4 })
  const glass = new THREE.MeshStandardMaterial({
    color: 0x8fb6cc, roughness: 0.12, metalness: 0.5, emissive: 0x1b2a33,
  })

  const W = 5.6
  const H = 2.35
  const D = 2.5
  const floorY = 0.72

  // chassis + wheels + towbar
  box(g, dark, W - 0.3, 0.16, D - 0.4, 0, floorY - 0.14)
  for (const s of [-1, 1]) {
    for (const zx of [-0.62, 0.62]) {
      const w = box(g, new THREE.MeshStandardMaterial({ color: 0x1f2225, roughness: 0.95 }),
        0.62, 0.62, 0.24, s * 1.5, 0.31, zx, CYL)
      w.rotation.x = Math.PI / 2
    }
  }
  box(g, dark, 0.16, 0.14, 1.5, -W / 2 - 0.55, 0.5).rotation.y = 0
  box(g, dark, 1.3, 0.12, 0.12, -W / 2 - 0.5, 0.5)
  box(g, dark, 0.1, 0.5, 0.1, -W / 2 - 1.05, 0.3)

  // body: corrugated flanks drawn as ribs
  box(g, shell, W, H, D, 0, floorY + H / 2)
  for (let i = 0; i < 22; i++) {
    box(g, shell, 0.05, H - 0.16, 0.03, -W / 2 + 0.16 + i * ((W - 0.32) / 21), floorY + H / 2, D / 2 + 0.005)
    box(g, shell, 0.05, H - 0.16, 0.03, -W / 2 + 0.16 + i * ((W - 0.32) / 21), floorY + H / 2, -D / 2 - 0.005)
  }
  box(g, trim, W + 0.14, 0.16, D + 0.14, 0, floorY + H + 0.02) // roof cap
  box(g, trim, W + 0.1, 0.14, D + 0.1, 0, floorY + 0.06)

  // door + steps, facing +Z
  box(g, trim, 0.98, 1.95, 0.08, 1.36, floorY + 0.98, D / 2 + 0.03)
  box(g, dark, 0.86, 1.83, 0.04, 1.36, floorY + 0.96, D / 2 + 0.07)
  box(g, glass, 0.5, 0.4, 0.02, 1.36, floorY + 1.6, D / 2 + 0.1)
  box(g, new THREE.MeshStandardMaterial({ color: 0xd9be6a, roughness: 0.3, metalness: 0.8 }),
    0.09, 0.09, 0.12, 1.75, floorY + 0.95, D / 2 + 0.11)
  for (let i = 0; i < 3; i++) {
    box(g, dark, 1.1, 0.07, 0.34, 1.36, floorY - 0.08 - i * 0.24, D / 2 + 0.24 + i * 0.3)
  }
  box(g, dark, 0.06, 0.9, 0.06, 1.95, floorY - 0.1, D / 2 + 0.4)

  // windows with blinds
  for (const x of [-1.7, -0.2]) {
    box(g, trim, 1.24, 0.98, 0.06, x, floorY + 1.42, D / 2 + 0.02)
    box(g, glass, 1.1, 0.84, 0.03, x, floorY + 1.42, D / 2 + 0.06)
    box(g, new THREE.MeshStandardMaterial({ color: 0xd8d2c0, roughness: 0.9 }),
      1.08, 0.26, 0.02, x, floorY + 1.72, D / 2 + 0.08)
  }

  // roof furniture
  box(g, dark, 0.8, 0.42, 0.7, -1.7, floorY + H + 0.28) // a/c
  box(g, new THREE.MeshStandardMaterial({ color: 0x6b7078, roughness: 0.5 }),
    0.7, 0.06, 0.6, -1.7, floorY + H + 0.5)
  const flue = box(g, dark, 0.14, 0.7, 0.14, 1.9, floorY + H + 0.4, -0.6, CYL)
  box(g, dark, 0.3, 0.08, 0.3, 1.9, floorY + H + 0.76, -0.6, CYL)
  void flue
  // dish
  const dish = box(g, new THREE.MeshStandardMaterial({ color: 0xdcdcd4, roughness: 0.6 }),
    0.62, 0.1, 0.62, 0.6, floorY + H + 0.36, 0.5, CYL)
  dish.rotation.set(0.7, 0, 0.3)
  box(g, dark, 0.05, 0.34, 0.05, 0.6, floorY + H + 0.2, 0.5)

  // beacon
  const beaconGlass = new THREE.MeshStandardMaterial({
    color: 0xff8a1e, emissive: 0xff6a00, emissiveIntensity: 1.4, roughness: 0.35,
  })
  const beacon = box(g, beaconGlass, 0.26, 0.24, 0.26, 0, floorY + H + 0.24, 0.9, CYL)
  box(g, dark, 0.3, 0.06, 0.3, 0, floorY + H + 0.12, 0.9, CYL)

  // painted board
  const board = new THREE.Mesh(
    new THREE.PlaneGeometry(2.6, 0.82),
    new THREE.MeshStandardMaterial({ map: signTexture('SITE OFFICE', 'BRICK CREW CONSTRUCTION CO.'), roughness: 0.85 }),
  )
  board.position.set(-0.9, floorY + 0.5, D / 2 + 0.05)
  g.add(board)

  // a rolled drawing leaning by the door — the hint that this thing is clickable
  const tube = box(g, new THREE.MeshStandardMaterial({ color: 0xe8ddbe, roughness: 0.85 }),
    0.16, 1.1, 0.16, 2.15, 0.55, D / 2 + 0.35, CYL)
  tube.rotation.z = 0.24
  box(g, new THREE.MeshStandardMaterial({ color: 0xc23b2e, roughness: 0.8 }),
    0.18, 0.05, 0.18, 2.19, 0.7, D / 2 + 0.35, CYL).rotation.z = 0.24

  // mugs on the step
  for (let i = 0; i < 2; i++) {
    box(g, new THREE.MeshStandardMaterial({ color: i ? 0xdd6644 : 0xf0efe8, roughness: 0.7 }),
      0.11, 0.12, 0.11, 1.05 + i * 0.2, floorY + 0.0, D / 2 + 0.3, CYL)
  }

  // invisible click proxies — cheap to raycast, and they cover the whole cabin
  const proxyMat = new THREE.MeshBasicMaterial({ visible: false })
  const proxies = [
    box(g, proxyMat, W + 0.4, H + 0.9, D + 0.5, 0, floorY + H / 2),
    box(g, proxyMat, 1.4, 2.2, 1.2, 1.36, floorY + 1.0, D / 2 + 0.4),
  ]
  proxies.forEach((p) => {
    p.castShadow = false
    p.receiveShadow = false
  })

  // hover glow: a slightly enlarged shell drawn back-face only
  const glow = new THREE.Mesh(
    BOX,
    new THREE.MeshBasicMaterial({ color: 0xffd27a, side: THREE.BackSide, transparent: true, opacity: 0 }),
  )
  glow.scale.set(W + 0.22, H + 0.22, D + 0.22)
  glow.position.set(0, floorY + H / 2, 0)
  glow.castShadow = false
  g.add(glow)

  return { group: g, proxies, glow, beacon: beacon.material }
}

function labelSprite(text) {
  const cv = document.createElement('canvas')
  cv.width = 512
  cv.height = 128
  const c = cv.getContext('2d')
  c.fillStyle = 'rgba(20,26,31,0.88)'
  c.beginPath()
  c.roundRect(6, 18, 500, 76, 14)
  c.fill()
  c.strokeStyle = '#f0b429'
  c.lineWidth = 4
  c.stroke()
  c.fillStyle = '#ffd97a'
  c.font = 'bold 44px ui-monospace, Menlo, Consolas, monospace'
  c.textAlign = 'center'
  c.fillText('BLUEPRINTS', 256, 70)
  const tex = new THREE.CanvasTexture(cv)
  tex.colorSpace = THREE.SRGBColorSpace
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true }))
  sp.scale.set(2.6, 0.65, 1)
  void text
  return sp
}

// --- treeline --------------------------------------------------------------

/**
 * A ring of trees out past the hoarding. Two instanced meshes, so the whole
 * horizon costs two draw calls — and the site stops looking like it sits on a
 * flat green table.
 */
function buildTreeline(rng) {
  const g = new THREE.Group()
  const spots = []
  for (let i = 0; i < 420 && spots.length < 120; i++) {
    const a = rng() * Math.PI * 2
    const r = 40 + rng() * 62
    const x = Math.cos(a) * r
    const z = Math.sin(a) * r
    // keep the road corridor and the approach to the gate clear
    if (Math.abs(z - SITE.roadZ) < 6.5) continue
    if (Math.abs(x - DEPOT.x) < 18 && z < SITE.roadZ) continue
    if (Math.abs(x) < 30 && z > -14 && z < SITE.roadZ) continue
    spots.push([x, z, 2.6 + rng() * 3.8, rng()])
  }

  const trunk = new THREE.InstancedMesh(
    new THREE.CylinderGeometry(0.13, 0.19, 1, 6),
    new THREE.MeshStandardMaterial({ color: 0x6b5236, roughness: 0.95 }),
    spots.length,
  )
  const crown = new THREE.InstancedMesh(
    new THREE.ConeGeometry(0.5, 1, 7),
    new THREE.MeshStandardMaterial({ color: 0x5f8f4c, roughness: 1 }),
    spots.length,
  )
  const m = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const v = new THREE.Vector3()
  const s = new THREE.Vector3()
  const col = new THREE.Color()
  spots.forEach(([x, z, h, t], i) => {
    const th = h * 0.34
    v.set(x, th / 2, z)
    s.set(1, th, 1)
    m.compose(v, q, s)
    trunk.setMatrixAt(i, m)
    const cw = h * (0.52 + t * 0.22)
    v.set(x, th + (h - th) / 2, z)
    s.set(cw, h - th, cw)
    m.compose(v, q, s)
    crown.setMatrixAt(i, m)
    crown.setColorAt(i, col.setHSL(0.26 + t * 0.06, 0.3 + t * 0.12, 0.3 + t * 0.13))
  })
  trunk.instanceMatrix.needsUpdate = true
  crown.instanceMatrix.needsUpdate = true
  if (crown.instanceColor) crown.instanceColor.needsUpdate = true
  g.add(trunk, crown)
  return g
}

// --- hoarding --------------------------------------------------------------

function buildFence(group) {
  const f = SITE.fence
  const post = new THREE.MeshStandardMaterial({ color: 0x6f5c44, roughness: 0.92 })
  const panel = new THREE.MeshStandardMaterial({ color: 0xcf9f5f, roughness: 0.9 })
  const panelAlt = new THREE.MeshStandardMaterial({ color: 0x2f6fa8, roughness: 0.7 })
  // Low enough that the camera still reads the site over the top of it.
  const H = 1.32

  const run = (ax, az, bx, bz, skip) => {
    const len = Math.hypot(bx - ax, bz - az)
    const n = Math.max(1, Math.round(len / 2.4))
    for (let i = 0; i < n; i++) {
      const t0 = i / n
      const t1 = (i + 1) / n
      const mx = ax + (bx - ax) * (t0 + t1) / 2
      const mz = az + (bz - az) * (t0 + t1) / 2
      if (skip && mx > skip[0] && mx < skip[1]) continue
      const alongX = Math.abs(bx - ax) > Math.abs(bz - az)
      const w = (len / n) * 0.97
      const p = box(group, i % 4 === 1 ? panelAlt : panel,
        alongX ? w : 0.06, H, alongX ? 0.06 : w, mx, H / 2 + 0.04, mz)
      p.receiveShadow = true
    }
    for (let i = 0; i <= n; i++) {
      const t = i / n
      const x = ax + (bx - ax) * t
      const z = az + (bz - az) * t
      if (skip && x > skip[0] - 0.4 && x < skip[1] + 0.4) continue
      box(group, post, 0.1, H + 0.14, 0.1, x, (H + 0.14) / 2, z)
    }
  }
  run(f.x0, f.z1, f.x1, f.z1, [f.gapX0, f.gapX1])
  run(f.x0, f.z0, f.x1, f.z0)
  run(f.x0, f.z0, f.x0, f.z1)
  run(f.x1, f.z0, f.x1, f.z1)

  // gate leaves, swung open into the compound
  const mesh = new THREE.MeshStandardMaterial({ color: 0x9aa2a8, roughness: 0.6, metalness: 0.4 })
  for (const s of [-1, 1]) {
    const leaf = new THREE.Group()
    leaf.position.set(s > 0 ? SITE.fence.gapX1 : SITE.fence.gapX0, 0, f.z1)
    leaf.rotation.y = s * 1.15
    box(leaf, mesh, 1.7, 1.7, 0.05, (s * 1.7) / 2, 0.9)
    box(leaf, post, 0.08, 1.9, 0.08, 0, 0.95)
    box(leaf, post, 0.08, 1.9, 0.08, s * 1.7, 0.95)
    group.add(leaf)
  }
}

// --- assembly --------------------------------------------------------------

export function buildSite(rng = Math.random) {
  const group = new THREE.Group()

  // A big plain apron underneath carries the eye out to the fog, so the
  // detailed site plane doesn't end in a hard edge against the sky.
  const apron = new THREE.Mesh(
    new THREE.PlaneGeometry(600, 600),
    new THREE.MeshStandardMaterial({ color: COLORS.grass, roughness: 1 }),
  )
  apron.rotation.x = -Math.PI / 2
  apron.position.y = -0.03
  group.add(apron)

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(GROUND, GROUND),
    new THREE.MeshStandardMaterial({ map: groundTexture(), roughness: 1 }),
  )
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  group.add(ground)

  buildFence(group)
  group.add(buildTreeline(rng))

  const t = buildTrailer()
  t.group.position.set(SITE.trailer.x, 0, SITE.trailer.z)
  t.group.rotation.y = SITE.trailer.rot
  group.add(t.group)

  const trailerLabel = labelSprite('BLUEPRINTS')
  trailerLabel.position.set(SITE.trailer.x, 4.15, SITE.trailer.z)
  trailerLabel.visible = false
  group.add(trailerLabel)

  // a flag on the gatepost, for a bit of movement in the wind
  const flagPole = new THREE.Group()
  flagPole.position.set(SITE.fence.gapX1 + 0.5, 0, SITE.fence.z1)
  group.add(flagPole)
  box(flagPole, new THREE.MeshStandardMaterial({ color: 0xc8ccd0, roughness: 0.4, metalness: 0.6 }),
    0.06, 3.4, 0.06, 0, 1.7)
  const flagGeo = new THREE.PlaneGeometry(1.1, 0.62, 10, 1)
  const flag = new THREE.Mesh(
    flagGeo,
    new THREE.MeshStandardMaterial({ color: 0xf0a020, roughness: 0.85, side: THREE.DoubleSide }),
  )
  flag.position.set(0.57, 3.05, 0)
  flag.castShadow = true
  flagPole.add(flag)
  const flagBase = flagGeo.attributes.position.array.slice()

  let hi = 0
  let tt = 0
  return {
    group,
    trailer: t.group,
    trailerTargets: t.proxies,
    trailerLabel,
    setTrailerHighlight(on) {
      hi = on ? 1 : 0
    },
    update(time, dt) {
      tt += dt
      t.glow.material.opacity += (hi * 0.42 - t.glow.material.opacity) * Math.min(1, dt * 8)
      t.beacon.emissiveIntensity = 0.5 + Math.abs(Math.sin(tt * 2.6)) * 2.2
      trailerLabel.position.y = 4.15 + Math.sin(tt * 2) * 0.06
      // cloth ripple
      const pos = flagGeo.attributes.position
      for (let i = 0; i < pos.count; i++) {
        const bx = flagBase[i * 3]
        const by = flagBase[i * 3 + 1]
        const k = (bx + 0.55) / 1.1
        pos.setZ(i, Math.sin(tt * 5 + k * 6) * 0.16 * k + Math.sin(by * 4 + tt * 3) * 0.03 * k)
      }
      pos.needsUpdate = true
    },
  }
}
