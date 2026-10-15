// The motherboard around the CPU: a generic ATX desktop board of the Raptor
// Lake era (LGA1700 socket, two DDR5 UDIMMs, a 700-series PCH with the BIOS SPI
// flash hanging off it, a PCIe x16 GPU and an M.2 NVMe drive on CPU lanes).
// It is a schematic board, not any particular product — what matters is the
// topology: which chip talks to which, over what.
//
// Board coordinates in this file are millimetres from the top-left corner of
// the PCB as seen from above (x right, y down). `W()` maps them into the world:
// the board lies in the XZ plane, centred on the origin, component side up.

import * as THREE from 'three'
import { overlayMaterial, STYLE, glowSprite, pointAlong, polyLen } from './die.js'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { rng } from './util.js'

export const BOARD = { w: 305, h: 244 }
export const SOCKET = { x: 120, y: 72 } // centre of the CPU package
// LGA1700 package: 37.5 x 45 mm, long side along the DIMM slots like the die.
export const PACKAGE = { w: 37.5, h: 45, z: 1.15 }
const W = (x, y, h = 0) => new THREE.Vector3(x - BOARD.w / 2, h, y - BOARD.h / 2)

const DIMM_X = [190, 200, 210, 220] // slot centre lines (A1, A2, B1, B2)
const POPULATED = [1, 3] // A2 and B2 — the slots a two-DIMM build uses
const DIMM_Y0 = 12
const DIMM_LEN = 133.35
const DIMM_H = 31.25

// Bus routes on the PCB, board coords. Multi-lane buses list one centre line;
// they're drawn as `lanes` parallel traces.
const ROUTES = {
  // Front-panel switch -> Super I/O PSIN#; SIO PSOUT# -> PCH PWRBTN#.
  pwrbtn: { lanes: 1, pts: [[278, 235], [268, 235], [262, 221]] },
  siopch: { lanes: 2, pts: [[256, 208], [253, 199]] },
  // SIO drives PS_ON# (the green wire) to the PSU; PWR_OK comes back.
  pson: { lanes: 1, pts: [[264, 208], [280, 186], [280, 152], [289, 150]] },
  pwrok: { lanes: 1, pts: [[289, 146], [276, 146], [276, 184], [261, 206]] },
  // PLTRST# fans out to the PCIe devices as PERST#.
  perst: { lanes: 1, pts: [[228, 196], [176, 196], [140, 170], [118, 154]] },
  perst2: { lanes: 1, pts: [[176, 196], [150, 150], [120, 120]] },
  standby: { lanes: 2, pts: [[290, 120], [272, 120], [272, 178], [253, 184]] },
  atx: { lanes: 3, pts: [[290, 132], [262, 132], [262, 108], [246, 96], [168, 96], [150, 88]] },
  eps: { lanes: 3, pts: [[44, 18], [62, 26], [82, 30]] },
  vrm: { lanes: 4, pts: [[124, 36], [124, 50]] },
  vrm2: { lanes: 4, pts: [[80, 72], [96, 72]] },
  dmi: { lanes: 4, pts: [[136, 95], [160, 113], [160, 165], [174, 178], [226, 186]] },
  // Sideband wires between PCH and CPU: PLTRST#, PROCPWRGD, and friends.
  sideband: { lanes: 1, pts: [[139, 90], [167, 108], [167, 160], [180, 172], [226, 180]] },
  spi: { lanes: 1, pts: [[232, 203], [232, 214], [214, 228], [210, 232]] },
  smbus: { lanes: 1, pts: [[247, 177], [247, 160], [222, 156], [200, 156]] },
  ddrA: { lanes: 6, pts: [[139, 62], [168, 52], [196, 52]] },
  ddrB: { lanes: 6, pts: [[139, 80], [172, 92], [216, 92]] },
  pcie16: { lanes: 4, pts: [[114, 95], [117, 104], [117, 128], [110, 145]] },
  pcie4: { lanes: 2, pts: [[104, 95], [106, 100], [112, 106], [112, 110]] },
  cmos: { lanes: 1, pts: [[172, 205], [204, 205], [228, 196]] },
}

export function buildBoard({ anisotropy = 8 } = {}) {
  const group = new THREE.Group()
  group.name = 'board'
  const r = rng(0xb0a7d)
  const comps = new Map() // id -> { glow, anchor, label }
  const mats = {
    pcb: null,
    black: new THREE.MeshStandardMaterial({ color: '#16161b', roughness: 0.55, metalness: 0.1 }),
    plastic: new THREE.MeshStandardMaterial({ color: '#202028', roughness: 0.7, metalness: 0.05 }),
    metal: new THREE.MeshStandardMaterial({ color: '#8d9099', roughness: 0.38, metalness: 0.9 }),
    darkMetal: new THREE.MeshStandardMaterial({ color: '#5a5e68', roughness: 0.4, metalness: 0.85 }),
    gold: new THREE.MeshStandardMaterial({ color: '#d6a640', roughness: 0.3, metalness: 1 }),
    chip: new THREE.MeshStandardMaterial({ color: '#111114', roughness: 0.42, metalness: 0.2 }),
    dimmPcb: new THREE.MeshStandardMaterial({ color: '#0f3a2a', roughness: 0.55, metalness: 0.15 }),
    substrate: new THREE.MeshStandardMaterial({ color: '#0a1916', roughness: 0.6, metalness: 0.15 }),
    choke: new THREE.MeshStandardMaterial({ color: '#4b4d55', roughness: 0.45, metalness: 0.6 }),
    white: new THREE.MeshStandardMaterial({ color: '#7d7a72', roughness: 0.7 }),
  }

  // --- PCB ------------------------------------------------------------------
  const pcbTex = paintPcb(r)
  pcbTex.anisotropy = anisotropy
  mats.pcb = new THREE.MeshStandardMaterial({ map: pcbTex, roughness: 0.62, metalness: 0.18 })
  const pcb = new THREE.Mesh(new THREE.BoxGeometry(BOARD.w, 1.6, BOARD.h), [mats.black, mats.black, mats.pcb, mats.black, mats.black, mats.black])
  pcb.position.y = -0.8
  group.add(pcb)

  const box = (w, h, d, mat, x, y, z, parent = group) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
    m.position.copy(W(x, y, z + h / 2))
    parent.add(m)
    return m
  }
  // Glow pad above a component: an additive plane the activity system drives.
  const glowPad = (id, x, y, w, d, height, label) => {
    const mat = overlayMaterial(w, d, comps.size * 3.1 + 1)
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat)
    mesh.rotation.x = -Math.PI / 2
    mesh.position.copy(W(x, y, height + 0.05))
    mesh.renderOrder = 2
    mesh.visible = false
    group.add(mesh)
    const rec = { id, mesh, mat, level: 0, target: 0, color: new THREE.Color(), targetColor: new THREE.Color(), style: 0, anchor: W(x, y, height + 1), label }
    comps.set(id, rec)
    return rec
  }

  // --- CPU socket + package --------------------------------------------------
  const S = SOCKET
  // Load plate frame
  const frame = new THREE.Group()
  group.add(frame)
  box(52, 1.4, 4, mats.darkMetal, S.x, S.y - 30, 0, frame)
  box(52, 1.4, 4, mats.darkMetal, S.x, S.y + 30, 0, frame)
  box(4, 1.4, 56, mats.darkMetal, S.x - 24, S.y, 0, frame)
  box(4, 1.4, 56, mats.darkMetal, S.x + 24, S.y, 0, frame)
  // retention lever
  const lever = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 62, 10), mats.darkMetal)
  lever.rotation.x = Math.PI / 2
  lever.position.copy(W(S.x + 29, S.y, 1.2))
  group.add(lever)
  box(44, 2.6, 52, mats.plastic, S.x, S.y, 0) // socket body
  const pkgY = 2.6
  box(PACKAGE.w, PACKAGE.z, PACKAGE.h, mats.substrate, S.x, S.y, pkgY)
  // land-side caps around the die
  for (let i = 0; i < 26; i++) {
    const side = i % 4
    const t = (Math.floor(i / 4) + 0.5) / 7
    const px = side < 2 ? S.x - 12 + t * 24 : side === 2 ? S.x - 16 : S.x + 16
    const py = side < 2 ? (side === 0 ? S.y - 19.5 : S.y + 19.5) : S.y - 15 + t * 30
    box(0.5, 0.5, 1, mats.darkMetal, px, py, pkgY + PACKAGE.z)
  }
  const dieTop = pkgY + PACKAGE.z + 0.78 // die sits on the substrate; 0.78 mm thick
  // IHS — the lid. Lifted away when the camera dives onto the die.
  const ihs = new THREE.Group()
  const ihsMat = new THREE.MeshStandardMaterial({ map: paintIhs(), roughness: 0.36, metalness: 0.9, color: '#c8cad0', transparent: true })
  const ihsSide = mats.metal.clone()
  ihsSide.transparent = true
  const ihsTop = new THREE.Mesh(new THREE.BoxGeometry(29, 1.9, 40), [ihsSide, ihsSide, ihsMat, ihsSide, ihsSide, ihsSide])
  ihsTop.position.y = 0.95
  ihs.add(ihsTop)
  for (const sz of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.BoxGeometry(18, 0.8, 3), ihsSide)
    ear.position.set(0, 0.4, sz * 21.3)
    ihs.add(ear)
  }
  ihs.position.copy(W(S.x, S.y, pkgY + PACKAGE.z + 0.4))
  group.add(ihs)

  // --- VRM ------------------------------------------------------------------
  for (let i = 0; i < 10; i++) {
    box(8, 6, 8, mats.choke, 84 + i * 9, 30, 0)
    box(5, 1, 4, mats.chip, 84 + i * 9, 39, 0)
  }
  for (let i = 0; i < 6; i++) {
    box(8, 6, 8, mats.choke, 72, 48 + i * 9.5, 0)
    box(4, 1, 5, mats.chip, 80, 48 + i * 9.5, 0)
  }
  glowPad('vrm', 120, 34, 100, 18, 6.2, 'CPU voltage regulator')
  glowPad('vrm2', 74, 72, 14, 60, 6.2, null)

  // --- power connectors -----------------------------------------------------
  box(20, 9, 9, mats.white, 40, 14, 0)
  glowPad('eps', 40, 14, 20, 9, 9.2, 'EPS 12 V (CPU power)')
  box(10, 10, 52, mats.white, 294, 126, 0)
  for (let i = 0; i < 12; i++) for (let j = 0; j < 2; j++) box(3, 0.6, 3, mats.black, 292 + j * 4, 106 + i * 4, 10)
  glowPad('atx24', 294, 126, 10, 52, 10.4, 'ATX 24-pin (5 V standby lives here)')

  // --- DIMM slots + DDR5 UDIMMs -----------------------------------------------
  const dimms = []
  DIMM_X.forEach((x, i) => {
    box(6, 8, 142, mats.plastic, x, DIMM_Y0 + 68, 0)
    box(6.4, 9, 4, mats.white, x, DIMM_Y0 - 3, 0)
    box(6.4, 9, 4, mats.white, x, DIMM_Y0 + 139, 0)
    if (!POPULATED.includes(i)) return
    const d = buildDimm(mats, r)
    d.group.position.copy(W(x, DIMM_Y0 + 68, 5))
    group.add(d.group)
    dimms.push({ ...d, x, ch: i < 2 ? 'A' : 'B' })
  })
  glowPad('dimmA', DIMM_X[1], DIMM_Y0 + 68, 4, DIMM_LEN, 5 + DIMM_H + 0.4, 'DDR5 DIMM, channel A')
  glowPad('dimmB', DIMM_X[3], DIMM_Y0 + 68, 4, DIMM_LEN, 5 + DIMM_H + 0.4, 'DDR5 DIMM, channel B')

  // --- PCH ------------------------------------------------------------------
  box(25, 1.3, 24, mats.substrate, 240, 190, 0)
  box(13, 0.7, 11, mats.darkMetal, 240, 190, 1.3)
  glowPad('pch', 240, 190, 25, 24, 2.1, 'PCH (chipset) — CSME + PMC + SPI controller')
  // --- SPI flash (SOIC-8) ---------------------------------------------------
  box(5.3, 1.75, 5.3, mats.chip, 210, 233, 0.1)
  for (let i = 0; i < 4; i++) {
    box(1.4, 0.3, 0.45, mats.metal, 206.8, 231.1 + i * 1.27, 0)
    box(1.4, 0.3, 0.45, mats.metal, 213.2, 231.1 + i * 1.27, 0)
  }
  glowPad('spi', 210, 233, 8, 7, 2, 'SPI NOR flash — the BIOS chip')
  // --- CMOS battery --------------------------------------------------------
  const cmos = new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 3.2, 40), mats.darkMetal)
  cmos.position.copy(W(165, 205, 1.6))
  group.add(cmos)
  glowPad('cmos', 165, 205, 18, 18, 3.4, 'CR2032 — keeps the RTC well alive')
  // --- front panel header ---------------------------------------------------
  for (let i = 0; i < 5; i++) for (let j = 0; j < 2; j++) box(0.64, 6, 0.64, mats.gold, 276 + i * 2.54, 234 + j * 2.54, 0)
  glowPad('fpanel', 281, 235.3, 14, 6, 6.2, 'Front-panel header (power button)')

  // --- M.2 NVMe --------------------------------------------------------------
  box(80, 0.8, 22, mats.dimmPcb, 72, 113, 1.5)
  box(6, 4, 22, mats.plastic, 115, 113, 0)
  box(12, 1.2, 12, mats.chip, 96, 113, 2.3)
  box(16, 1.2, 14, mats.chip, 74, 113, 2.3)
  box(16, 1.2, 14, mats.chip, 54, 113, 2.3)
  glowPad('nvme', 72, 113, 80, 22, 3.6, 'NVMe SSD (PCIe 4.0 x4 from the CPU)')

  // --- PCIe x16 slot + GPU (ghosted so it doesn't hide the board) -------------
  box(89, 11, 7.5, mats.plastic, 75, 150, 0)
  const gpu = new THREE.Group()
  const gpuMat = new THREE.MeshStandardMaterial({ color: '#8a90a8', roughness: 0.5, metalness: 0.4, transparent: true, opacity: 0.04, depthWrite: false })
  const gpuGeo = new THREE.BoxGeometry(200, 112, 40)
  const gpuBody = new THREE.Mesh(gpuGeo, gpuMat)
  gpu.add(gpuBody)
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(gpuGeo), new THREE.LineBasicMaterial({ color: '#9aa3c7', transparent: true, opacity: 0.12 }))
  gpu.add(edges)
  for (const fx of [-60, 0, 60]) {
    const ring = new THREE.Mesh(new THREE.RingGeometry(24, 25, 48), new THREE.MeshBasicMaterial({ color: '#9aa3c7', transparent: true, opacity: 0.1, side: THREE.DoubleSide }))
    ring.position.set(fx, 0, 20.1)
    gpu.add(ring)
  }
  gpu.position.copy(W(125, 172, 11 + 56))
  group.add(gpu)
  const gpuParts = { body: gpuMat, edges: edges.material, rings: gpu.children.filter((c) => c.isMesh && c !== gpuBody).map((c) => c.material) }
  glowPad('gpu', 75, 150, 89, 7.5, 11.4, 'Discrete GPU (PCIe 5.0-capable x16 slot)')

  // --- rear I/O shield -------------------------------------------------------
  box(18, 30, 130, mats.darkMetal, 12, 88, 0)
  box(9, 1, 9, mats.chip, 30, 196, 0) // audio codec
  // Super I/O: on desktops it watches the power button, drives PS_ON#, and
  // turns the PSU's PWR_OK into the board's power-good signals.
  box(10, 1.2, 10, mats.chip, 261, 213, 0)
  glowPad('sio', 261, 213, 12, 12, 1.5, 'Super I/O (power button, PS_ON#, PWR_OK)')

  // --- traces ----------------------------------------------------------------
  const paths = new Map()
  for (const [name, def] of Object.entries(ROUTES)) {
    const pts = def.pts.map(([x, y]) => W(x, y, 0.06))
    const lanes = []
    for (let l = 0; l < def.lanes; l++) {
      const off = (l - (def.lanes - 1) / 2) * 1.3
      lanes.push(offsetPolyline(pts, off))
    }
    const mesh = traceMesh(lanes)
    group.add(mesh)
    paths.set(name, { name, pts, lanes, mesh, level: 0, target: 0, len: polyLen(pts) })
  }

  // --- packets ---------------------------------------------------------------
  const MAXP = 900
  const pGeo = new THREE.BufferGeometry()
  const pPos = new Float32Array(MAXP * 3)
  const pCol = new Float32Array(MAXP * 3)
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
  pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3))
  const points = new THREE.Points(
    pGeo,
    new THREE.PointsMaterial({ size: 3.2, map: glowSprite(), vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }),
  )
  points.frustumCulled = false
  points.renderOrder = 6
  group.add(points)
  const packets = []
  const streams = new Map()

  // DRAM chip glow (for training): per DIMM, per side (rank), per chip.
  const chipLights = []
  dimms.forEach((d, k) => {
    for (const c of d.chips) {
      c.dimm = k
      chipLights.push(c)
    }
  })

  // ~150 of the board's meshes are static boxes sharing a handful of materials;
  // drawn one by one they cost a phone's CPU most of its frame budget. Bake them
  // into one mesh per material. Anything that lights up, fades or moves (glow
  // pads, traces, DRAM chips, SPD/PMIC parts, the heat-spreader, the GPU
  // ghost) has a material of its own and is left alone.
  mergeStatic(group, new Set(Object.values(mats).filter((m) => m !== mats.pcb)), ihs)

  const api = {
    group,
    comps,
    paths,
    dimms,
    ihs,
    dieTop,
    socketWorld: W(S.x, S.y, dieTop),
    W,
    begin() {
      for (const c of comps.values()) c.target = 0
      for (const p of paths.values()) p.target = 0
      for (const s of streams.values()) s.live = false
      for (const c of chipLights) c.target = 0
      for (const d of dimms) for (const pt of Object.values(d.parts)) pt.target = 0
    },
    light(id, level, color, style = 'glow') {
      const c = comps.get(id)
      if (!c) return
      if (level >= c.target) {
        c.target = level
        c.targetColor.set(color)
        c.style = STYLE[style] ?? 0
      }
    },
    // Light a bus and run packets along it. `dir` -1 runs them backwards.
    bus(name, level, color, { rate = 0, speed = 60, dir = 1 } = {}) {
      const p = paths.get(name)
      if (!p) return
      if (level >= p.target) {
        p.target = level
        p.mesh.material.uniforms.uColor.value.set(color)
      }
      // Packets only flow while the wire itself is lit: content often passes a
      // windowed level with a constant rate.
      if (rate > 0 && level > 0.02) {
        const key = `${name}:${dir}`
        let s = streams.get(key)
        if (!s) {
          s = { lanes: dir > 0 ? p.lanes : p.lanes.map((l) => [...l].reverse()), len: p.len, acc: 0, color: new THREE.Color() }
          streams.set(key, s)
        }
        s.rate = rate
        s.speed = speed
        s.color.set(color)
        s.live = true
      }
    },
    // The SPD hub or PMIC on every DIMM.
    dimmPart(which, level, color) {
      for (const d of dimms) {
        const pt = d.parts[which]
        if (pt && level > pt.target) {
          pt.target = level
          pt.color.set(color)
        }
      }
    },
    // DRAM chips: fn(dimmIndex, rank, subchannel, chipIndex) -> level
    chips(fn, color) {
      for (const c of chipLights) {
        const v = fn(c.dimm, c.rank, c.sub, c.i)
        if (v > c.target) {
          c.target = v
          c.color.set(color)
        }
      }
    },
    // `animDt` drives motion (packets); it is 0 while paused so the scene holds still.
    update(dt, time, animDt = dt) {
      const k = 1 - Math.exp(-dt * 7)
      for (const c of comps.values()) {
        c.level += (c.target - c.level) * k
        c.color.lerp(c.targetColor, k)
        const u = c.mat.uniforms
        u.uLevel.value = c.level
        u.uColor.value.copy(c.color)
        u.uTime.value = time
        u.uStyle.value = c.style
        c.mesh.visible = c.level > 0.003
      }
      // The GPU is a ghost until something talks to it.
      const gl = comps.get('gpu').level
      gpuParts.body.opacity = 0.015 + gl * 0.05
      gpuParts.edges.opacity = 0.07 + gl * 0.35
      for (const m of gpuParts.rings) m.opacity = 0.05 + gl * 0.25
      for (const p of paths.values()) {
        p.level += (p.target - p.level) * k
        const u = p.mesh.material.uniforms
        u.uLevel.value = 0.18 + p.level
        u.uTime.value = time
      }
      for (const c of chipLights) {
        c.level += (c.target - c.level) * Math.min(1, dt * 14)
        c.mat.emissive.copy(c.color).multiplyScalar(c.level * 0.9)
      }
      for (const d of dimms) {
        for (const pt of Object.values(d.parts)) {
          pt.level += (pt.target - pt.level) * Math.min(1, dt * 10)
          pt.mat.emissive.copy(pt.color).multiplyScalar(pt.level * 1.4)
        }
      }
      for (const [key, s] of streams) {
        if (!s.live) {
          streams.delete(key)
          continue
        }
        s.acc += animDt * s.rate
        while (s.acc >= 1 && packets.length < MAXP) {
          s.acc -= 1
          const lane = s.lanes[Math.floor(Math.random() * s.lanes.length)]
          packets.push({ pts: lane, len: s.len, d: 0, speed: s.speed * (0.85 + Math.random() * 0.3), color: s.color.clone() })
        }
      }
      let n = 0
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i]
        p.d += p.speed * animDt
        if (p.d >= p.len) packets.splice(i, 1)
      }
      for (const p of packets) {
        const q = pointAlong(p.pts, p.d)
        pPos[n * 3] = q.x
        pPos[n * 3 + 1] = q.y + 0.4
        pPos[n * 3 + 2] = q.z
        const fade = Math.min(1, p.d / 4, (p.len - p.d) / 4)
        pCol[n * 3] = p.color.r * fade
        pCol[n * 3 + 1] = p.color.g * fade
        pCol[n * 3 + 2] = p.color.b * fade
        n++
      }
      pGeo.setDrawRange(0, n)
      pGeo.attributes.position.needsUpdate = true
      pGeo.attributes.color.needsUpdate = true
    },
  }
  return api
}

// A DDR5 UDIMM standing in its slot: dual-rank, x8 chips — eight DRAM packages
// per side (front = rank 0, back = rank 1), four per 32-bit subchannel, with
// the PMIC and SPD hub in the middle where DDR5 puts them.
function buildDimm(mats, r) {
  const group = new THREE.Group()
  const pcb = new THREE.Mesh(new THREE.BoxGeometry(1.2, DIMM_H, DIMM_LEN), mats.dimmPcb)
  pcb.position.y = DIMM_H / 2
  group.add(pcb)
  // gold fingers
  const fingers = new THREE.Mesh(new THREE.BoxGeometry(1.26, 3, DIMM_LEN - 6), mats.gold)
  fingers.position.y = 1.5
  group.add(fingers)
  const chips = []
  for (const side of [-1, 1]) {
    for (let i = 0; i < 8; i++) {
      // 4 chips each side of the centre: subchannel A left, B right
      const sub = i < 4 ? 0 : 1
      const z = (i < 4 ? -DIMM_LEN / 2 + 10 + i * 13.5 : 14 + (i - 4) * 13.5) + 2
      const mat = new THREE.MeshStandardMaterial({ color: '#141418', roughness: 0.45, metalness: 0.2, emissive: new THREE.Color('#000') })
      const chip = new THREE.Mesh(new THREE.BoxGeometry(1.1, 9.5, 11), mat)
      chip.position.set(side * 1.15, DIMM_H * 0.55, z)
      group.add(chip)
      // rank 0 on the face the DIMM cameras see; rank 1 on the back
      chips.push({ mesh: chip, mat, rank: side > 0 ? 0 : 1, sub, i: i % 4, level: 0, target: 0, color: new THREE.Color() })
    }
  }
  // PMIC + SPD hub (front side, centre). Their own materials so they can glow.
  const partMat = () => new THREE.MeshStandardMaterial({ color: '#141418', roughness: 0.45, metalness: 0.2, emissive: new THREE.Color('#000') })
  const pmic = new THREE.Mesh(new THREE.BoxGeometry(1, 5, 5), partMat())
  pmic.position.set(1.1, DIMM_H * 0.62, 6)
  group.add(pmic)
  const spd = new THREE.Mesh(new THREE.BoxGeometry(0.9, 2.2, 2.2), partMat())
  spd.position.set(1.05, DIMM_H * 0.3, 6)
  group.add(spd)
  const part = (mesh) => ({ mesh, mat: mesh.material, level: 0, target: 0, color: new THREE.Color() })
  return { group, chips, parts: { pmic: part(pmic), spd: part(spd) } }
}

// Offset a polyline sideways in the XZ plane (for drawing parallel lanes).
function offsetPolyline(pts, off) {
  if (!off) return pts.map((p) => p.clone())
  const out = []
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)]
    const b = pts[Math.min(pts.length - 1, i + 1)]
    const t = new THREE.Vector3().subVectors(b, a).setY(0).normalize()
    const n = new THREE.Vector3(-t.z, 0, t.x)
    out.push(pts[i].clone().addScaledVector(n, off))
  }
  return out
}

const TRACE_FRAG = /* glsl */ `
uniform vec3 uColor;
uniform float uLevel;
uniform float uTime;
varying vec2 vUv;
void main() {
  float across = 1.0 - abs(vUv.y - 0.5) * 2.0;
  float dash = smoothstep(0.0, 0.2, fract(vUv.x * 0.08 - uTime * 1.6)) * smoothstep(0.7, 0.35, fract(vUv.x * 0.08 - uTime * 1.6));
  float hot = clamp(uLevel - 0.18, 0.0, 1.0);
  vec3 copper = vec3(0.42, 0.30, 0.16);
  vec3 col = mix(copper * 0.55, uColor * (0.5 + dash * 1.2), hot);
  gl_FragColor = vec4(col * smoothstep(0.0, 0.5, across) * (0.6 + hot), 1.0);
}`

function traceMesh(lanes) {
  const pos = []
  const uv = []
  const idx = []
  let base = 0
  const width = 0.55
  for (const pts of lanes) {
    let dist = 0
    for (let i = 0; i < pts.length; i++) {
      const a = pts[Math.max(0, i - 1)]
      const b = pts[Math.min(pts.length - 1, i + 1)]
      const t = new THREE.Vector3().subVectors(b, a).setY(0).normalize()
      const n = new THREE.Vector3(-t.z, 0, t.x).multiplyScalar(width / 2)
      if (i > 0) dist += pts[i].distanceTo(pts[i - 1])
      pos.push(pts[i].x + n.x, pts[i].y, pts[i].z + n.z, pts[i].x - n.x, pts[i].y, pts[i].z - n.z)
      uv.push(dist, 0, dist, 1)
      if (i > 0) {
        const k = base + i * 2
        idx.push(k - 2, k - 1, k, k - 1, k + 1, k)
      }
    }
    base += pts.length * 2
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
  g.setIndex(idx)
  const mat = new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color('#ffffff') }, uLevel: { value: 0.18 }, uTime: { value: 0 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: TRACE_FRAG,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  })
  const m = new THREE.Mesh(g, mat)
  m.renderOrder = 1
  return m
}

// Matte black PCB with silkscreen and a haze of background copper.
function paintPcb(r) {
  const S = 6 // px per mm
  const c = document.createElement('canvas')
  c.width = BOARD.w * S
  c.height = BOARD.h * S
  const g = c.getContext('2d')
  g.fillStyle = '#0c0f14'
  g.fillRect(0, 0, c.width, c.height)
  // background copper pour + routed traces under the solder mask
  g.globalAlpha = 0.5
  for (let i = 0; i < 520; i++) {
    let x = r() * BOARD.w
    let y = r() * BOARD.h
    g.strokeStyle = r() < 0.5 ? '#14202a' : '#18161f'
    g.lineWidth = (0.2 + r() * 0.35) * S
    g.beginPath()
    g.moveTo(x * S, y * S)
    for (let k = 0; k < 4; k++) {
      if (r() < 0.5) x += (r() - 0.5) * 60
      else y += (r() - 0.5) * 60
      g.lineTo(x * S, y * S)
    }
    g.stroke()
  }
  g.globalAlpha = 1
  // vias
  g.fillStyle = '#1d2530'
  for (let i = 0; i < 1400; i++) {
    g.beginPath()
    g.arc(r() * c.width, r() * c.height, 0.35 * S, 0, Math.PI * 2)
    g.fill()
  }
  // mounting holes (ATX positions, approximately)
  for (const [x, y] of [[6.35, 10.16], [6.35, 165.1], [163.83, 10.16], [163.83, 165.1], [288.29, 10.16], [288.29, 165.1], [288.29, 237.49], [163.83, 237.49], [6.35, 237.49]]) {
    g.fillStyle = '#7a6a3a'
    g.beginPath()
    g.arc(x * S, y * S, 4 * S, 0, Math.PI * 2)
    g.fill()
    g.fillStyle = '#05060a'
    g.beginPath()
    g.arc(x * S, y * S, 1.8 * S, 0, Math.PI * 2)
    g.fill()
  }
  // silkscreen
  g.strokeStyle = 'rgba(220,226,240,0.55)'
  g.fillStyle = 'rgba(220,226,240,0.6)'
  g.lineWidth = 0.35 * S
  const rect = (x, y, w, h) => g.strokeRect((x - w / 2) * S, (y - h / 2) * S, w * S, h * S)
  const text = (t, x, y, size = 3, align = 'center', rot = 0) => {
    g.save()
    g.translate(x * S, y * S)
    g.rotate(rot)
    g.font = `600 ${size * S}px ui-monospace, Menlo, Consolas, monospace`
    g.textAlign = align
    g.textBaseline = 'middle'
    g.fillText(t, 0, 0)
    g.restore()
  }
  rect(SOCKET.x, SOCKET.y, 54, 66)
  text("LGA1700", SOCKET.x - 26, SOCKET.y + 36, 2.6, "left")
  rect(240, 190, 29, 28)
  text('PCH', 240, 206.5, 2.6)
  rect(210, 233, 10, 9)
  text('BIOS', 210, 240.5, 2.4)
  text('CMOS', 165, 218, 2.4)
  DIMM_X.forEach((x, i) => text(['DDR5_A1', 'DDR5_A2', 'DDR5_B1', 'DDR5_B2'][i], x, 160, 1.9, 'center', -Math.PI / 2))
  text('PCIE_X16', 75, 158.5, 2.4)
  text('M2_1', 72, 128.5, 2.4)
  text('F_PANEL', 281, 241.5, 2.2)
  text('ATX_PWR', 283, 126, 2.2, 'center', -Math.PI / 2)
  text('CPU_PWR', 40, 22, 2.2)
  text('PWR_SW', 278, 230, 1.8)
  text('SIO', 261, 221, 2)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function paintIhs() {
  const c = document.createElement('canvas')
  c.width = 800
  c.height = 580
  const g = c.getContext('2d')
  const grd = g.createLinearGradient(0, 0, 800, 580)
  grd.addColorStop(0, '#cfd2d8')
  grd.addColorStop(0.5, '#b4b8c0')
  grd.addColorStop(1, '#d6d8dd')
  g.fillStyle = grd
  g.fillRect(0, 0, 800, 580)
  // brushed texture
  g.globalAlpha = 0.08
  for (let i = 0; i < 900; i++) {
    g.fillStyle = Math.random() < 0.5 ? '#fff' : '#666'
    g.fillRect(0, Math.random() * 580, 800, 1)
  }
  g.globalAlpha = 1
  g.fillStyle = 'rgba(70,74,82,0.85)'
  g.font = '600 46px ui-monospace, Menlo, Consolas, monospace'
  g.fillText('x86-64  8P+16E', 90, 200)
  g.font = '500 38px ui-monospace, Menlo, Consolas, monospace'
  g.fillText('RAPTOR LAKE-S', 90, 270)
  g.fillText('LGA1700   DDR5', 90, 330)
  g.font = '500 30px ui-monospace, Menlo, Consolas, monospace'
  g.fillText('reset vector: FFFFFFF0h', 90, 420)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  // The lid's long side runs along z, so the artwork is turned to match.
  tex.center.set(0.5, 0.5)
  tex.rotation = Math.PI / 2
  return tex
}

function mergeStatic(root, palette, skip) {
  root.updateMatrixWorld(true)
  const toRoot = new THREE.Matrix4().copy(root.matrixWorld).invert()
  const byMat = new Map()
  root.traverse((o) => {
    if (!o.isMesh || !palette.has(o.material)) return
    for (let a = o.parent; a && a !== root; a = a.parent) if (a === skip) return
    if (!byMat.has(o.material)) byMat.set(o.material, [])
    byMat.get(o.material).push(o)
  })
  for (const [mat, meshes] of byMat) {
    if (meshes.length < 2) continue
    const geoms = meshes.map((m) => {
      const g = m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone()
      for (const k of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(k)) g.deleteAttribute(k)
      g.clearGroups()
      return g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(toRoot, m.matrixWorld))
    })
    const merged = mergeGeometries(geoms)
    for (const g of geoms) g.dispose()
    if (!merged) continue
    for (const m of meshes) {
      m.parent.remove(m)
      m.geometry.dispose()
    }
    root.add(new THREE.Mesh(merged, mat))
  }
}
