// ---------------------------------------------------------------------------
// The builders' merchant at the head of the street.
//
// This is where the site gets both of the things it runs on, and it is a yard
// like any other on the road rather than a light show in a field:
//
//   • A **kitting shed** — a steel portal frame with the front open. A bare
//     chassis walks the length of it and picks up boots, a hi-vis vest and a
//     hard hat on the way, in the livery of whichever crew is on next. They
//     muster on the apron outside the door until the whistle, then walk down
//     to the site. A board on the shed says how many of the order are done.
//
//   • A **loading bay** — five stock piles of exactly the material the masons
//     set, and a flatbed that the yard hands load out of them. When it is full
//     it pulls out of the gate and runs down to the plots, and an empty one
//     backs in behind it. That is where the drops on the site come from.
//
// Nothing here is decorative-only: the crews that walk out of this compound
// are the crews that turn up on site, and the material on the lorry is the
// material in the ground floor walls.
//
// Local space: +z is toward the road (the compound faces it), −z is the back
// of the yard. The group is parked at DEPOT, whose z sits on the kerb line.
// ---------------------------------------------------------------------------

import * as THREE from 'three'
import { buildRobot, buildCarryStack } from './robot.js'
import { buildCone, buildSign, buildStock, buildFlatbed } from './props.js'
import { MATERIALS, KIT_LEAD_SECONDS } from './config.js'
import { orders } from './orders.js'

const BOX = new THREE.BoxGeometry(1, 1, 1)

// --- compound plan ---------------------------------------------------------
const YARD = { x0: -15.0, x1: 15.0, z0: -17.0, z1: -1.0 }
/** The vehicle opening in the front wall. */
const GATE = { x0: 7.4, x1: 13.6 }
/** The kitting shed: back-left of the compound, open front. */
const SHED = { x0: -14.2, x1: -2.2, z0: -16.4, z1: -9.4, eave: 3.4, ridge: 4.8 }
/** The line runs the length of the shed, and the three kit bays sit on it. */
const LINE_Z = -13.2
const LINE_X0 = -13.0
const LINE_X1 = -3.2
const KIT_BAYS = [-9.8, -7.2, -4.6]
/** Where the kitted crew forms up, on the apron outside the shed door. */
const MUSTER = { x: -13.4, z: -7.6, cols: 4, dx: 1.5, dz: 1.5 }
/** The five stock piles, down the middle of the yard. */
const BAY_X = 3.2
const BAY_Z0 = -15.4
const BAY_DZ = 2.6
/** Where the flatbed stands to be loaded, and the line the hands load from. */
const DOCK = { x: 10.2, z: -9.6 }
const LOAD_POINT = { x: 7.4, z: -10.2 }
/** Gangers get a white hat, the way they do on a real site. */
const LEAD_HAT = 0xf2f5f7

/** How many loads fill a lorry before it runs down to the site. */
const LORRY_LOADS = 7

function box(parent, material, sx, sy, sz, x = 0, y = 0, z = 0, geo = BOX) {
  const m = new THREE.Mesh(geo, material)
  m.scale.set(sx, sy, sz)
  m.position.set(x, y, z)
  m.castShadow = true
  m.receiveShadow = true
  parent.add(m)
  return m
}

/** The board by the shed door: what the line is building, and how far on. */
function orderBoard() {
  const cv = document.createElement('canvas')
  cv.width = 1024
  cv.height = 512
  const tex = new THREE.CanvasTexture(cv)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  const c = cv.getContext('2d')

  function draw(state) {
    c.fillStyle = '#1b2026'
    c.fillRect(0, 0, 1024, 512)
    c.fillStyle = '#f0b429'
    c.fillRect(0, 0, 1024, 78)
    c.fillStyle = '#15181c'
    c.font = 'bold 46px ui-monospace, Menlo, Consolas, monospace'
    c.textAlign = 'left'
    c.fillText('KITTING SHED', 34, 56)
    c.font = '24px ui-monospace, Menlo, Consolas, monospace'
    c.textAlign = 'right'
    c.fillText('BRICK CREW CONSTRUCTION CO.', 990, 52)

    c.textAlign = 'left'
    if (!state.order) {
      c.fillStyle = '#8fa4b4'
      c.font = '34px ui-monospace, Menlo, Consolas, monospace'
      c.fillText('NO ORDER ON THE BOOKS', 34, 170)
      c.font = '26px ui-monospace, Menlo, Consolas, monospace'
      c.fillText('The line starts when the site calls the next shift.', 34, 216)
    } else {
      c.fillStyle = '#8fa4b4'
      c.font = '26px ui-monospace, Menlo, Consolas, monospace'
      c.fillText('BUILDING FOR', 34, 140)
      c.fillStyle = state.crewCss
      c.font = 'bold 58px ui-monospace, Menlo, Consolas, monospace'
      c.fillText(`${state.crewName.toUpperCase()} CREW`, 34, 200)

      c.fillStyle = '#8fa4b4'
      c.font = '26px ui-monospace, Menlo, Consolas, monospace'
      c.fillText('KITTED AND MUSTERED', 34, 268)
      c.fillStyle = '#e4ecf2'
      c.font = 'bold 76px ui-monospace, Menlo, Consolas, monospace'
      c.fillText(`${state.done} / ${state.total}`, 34, 344)

      // a pip per robot, filled as they come off the line
      const pipW = Math.min(46, 940 / Math.max(1, state.total))
      for (let i = 0; i < state.total; i++) {
        c.fillStyle = i < state.done ? state.crewCss : 'rgba(143,164,180,0.28)'
        c.fillRect(34 + i * pipW, 386, pipW - 6, 26)
      }
    }
    c.fillStyle = '#8fa4b4'
    c.font = '23px ui-monospace, Menlo, Consolas, monospace'
    c.fillText('Boots, vest and hat before anyone goes out on site.', 34, 476)
    tex.needsUpdate = true
  }

  draw({ order: false })
  return { tex, draw }
}

/** A name board over each stock pile, in the material's own colour. */
function bayLabel(mat) {
  const cv = document.createElement('canvas')
  cv.width = 256
  cv.height = 64
  const c = cv.getContext('2d')
  c.fillStyle = '#22282c'
  c.fillRect(0, 0, 256, 64)
  c.fillStyle = `#${mat.color.toString(16).padStart(6, '0')}`
  c.fillRect(0, 0, 10, 64)
  c.fillStyle = '#e4ecf2'
  c.font = 'bold 30px ui-monospace, Menlo, Consolas, monospace'
  c.textAlign = 'left'
  c.textBaseline = 'middle'
  c.fillText(mat.label, 26, 34)
  const tex = new THREE.CanvasTexture(cv)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  const g = new THREE.Group()
  const post = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 1.15, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x454b52, roughness: 0.6, metalness: 0.4 }),
  )
  post.position.set(0, 0.575, 0)
  post.castShadow = true
  g.add(post)
  const panel = new THREE.Mesh(
    new THREE.PlaneGeometry(1.55, 0.39),
    new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9, side: THREE.DoubleSide }),
  )
  panel.position.set(0, 1.3, 0)
  g.add(panel)
  return g
}

export function createDepot({ origin, rng }) {
  const group = new THREE.Group()
  group.position.set(origin.x, 0, origin.z)

  const M = {
    pad: new THREE.MeshStandardMaterial({ color: 0x9a958c, roughness: 0.98 }),
    kerb: new THREE.MeshStandardMaterial({ color: 0xb4afa4, roughness: 0.95 }),
    yellow: new THREE.MeshStandardMaterial({ color: 0xf0b429, roughness: 0.6 }),
    steel: new THREE.MeshStandardMaterial({ color: 0xb2bcc4, roughness: 0.36, metalness: 0.8 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x454b52, roughness: 0.6, metalness: 0.4 }),
    wall: new THREE.MeshStandardMaterial({ color: 0xb9c2c8, roughness: 0.82 }),
    roof: new THREE.MeshStandardMaterial({ color: 0x6f7a82, roughness: 0.62, metalness: 0.2 }),
    block: new THREE.MeshStandardMaterial({ color: 0x9a9287, roughness: 0.96 }),
    rubber: new THREE.MeshStandardMaterial({ color: 0x232629, roughness: 0.95 }),
    cab: new THREE.MeshStandardMaterial({ color: 0x2f6fd8, roughness: 0.5, metalness: 0.2 }),
    ply: new THREE.MeshStandardMaterial({ color: 0xd0a463, roughness: 0.9 }),
  }

  // --- apron and boundary --------------------------------------------------
  const pad = box(group, M.pad, YARD.x1 - YARD.x0, 0.06,
    YARD.z1 - YARD.z0, (YARD.x0 + YARD.x1) / 2, 0.03, (YARD.z0 + YARD.z1) / 2)
  pad.castShadow = false

  // A blockwork wall round the yard, with a vehicle opening onto the road.
  const wallH = 1.55
  const runs = [
    [YARD.x0, YARD.z0, YARD.x1, YARD.z0], // back
    [YARD.x0, YARD.z0, YARD.x0, YARD.z1], // left
    [YARD.x1, YARD.z0, YARD.x1, YARD.z1], // right
    [YARD.x0, YARD.z1, GATE.x0, YARD.z1], // front, up to the gate
    [GATE.x1, YARD.z1, YARD.x1, YARD.z1], // front, past the gate
  ]
  for (const [ax, az, bx, bz] of runs) {
    const len = Math.hypot(bx - ax, bz - az)
    if (len < 0.2) continue
    const horiz = Math.abs(bx - ax) > Math.abs(bz - az)
    const w = box(group, M.block, horiz ? len : 0.26, wallH, horiz ? 0.26 : len,
      (ax + bx) / 2, wallH / 2, (az + bz) / 2)
    w.receiveShadow = true
    // coping along the top so it reads as blockwork rather than a slab
    box(group, M.kerb, horiz ? len : 0.38, 0.09, horiz ? 0.38 : len,
      (ax + bx) / 2, wallH + 0.045, (az + bz) / 2)
  }
  // gate posts, painted
  for (const x of [GATE.x0, GATE.x1]) {
    box(group, M.yellow, 0.34, 2.1, 0.34, x, 1.05, YARD.z1)
    box(group, M.dark, 0.42, 0.1, 0.42, x, 2.15, YARD.z1)
  }

  // --- the kitting shed ----------------------------------------------------
  const shedW = SHED.x1 - SHED.x0
  const shedD = SHED.z1 - SHED.z0
  const cx = (SHED.x0 + SHED.x1) / 2
  const cz = (SHED.z0 + SHED.z1) / 2
  const shed = new THREE.Group()
  shed.position.set(cx, 0, cz)
  group.add(shed)

  box(shed, M.kerb, shedW, 0.12, shedD, 0, 0.09, 0).castShadow = false
  // back and side walls, front left open
  box(shed, M.wall, shedW, SHED.eave, 0.24, 0, SHED.eave / 2, -shedD / 2)
  for (const s of [-1, 1]) box(shed, M.wall, 0.24, SHED.eave, shedD, (s * shedW) / 2, SHED.eave / 2, 0)
  // portal frames, visible through the open front
  for (let i = -2; i <= 2; i++) {
    const x = (i * shedW) / 5
    box(shed, M.steel, 0.22, SHED.eave, 0.22, x, SHED.eave / 2, shedD / 2 - 0.3)
    box(shed, M.steel, 0.18, 0.18, shedD, x, SHED.eave - 0.1, 0)
  }
  // Pitched corrugated roof. Each slope runs from the eave up to the ridge, so
  // the +z half has to tip its far edge *down* — get the sign wrong and one
  // half sails off into the sky behind the building.
  const pitch = Math.atan2(SHED.ridge - SHED.eave, shedD / 2)
  for (const s of [-1, 1]) {
    const slope = box(shed, M.roof, shedW + 0.5, 0.12, shedD / 2 / Math.cos(pitch) + 0.3,
      0, (SHED.eave + SHED.ridge) / 2, (s * shedD) / 4)
    slope.rotation.x = s * pitch
  }
  box(shed, M.dark, shedW + 0.6, 0.16, 0.18, 0, SHED.ridge + 0.05, 0)
  // gable infill over the open front
  const gable = new THREE.Mesh(
    (() => {
      const s = new THREE.Shape()
      s.moveTo(-shedW / 2, 0)
      s.lineTo(shedW / 2, 0)
      s.lineTo(0, SHED.ridge - SHED.eave)
      s.lineTo(-shedW / 2, 0)
      return new THREE.ShapeGeometry(s)
    })(),
    new THREE.MeshStandardMaterial({ color: 0xb9c2c8, roughness: 0.82, side: THREE.DoubleSide }),
  )
  gable.position.set(0, SHED.eave, shedD / 2)
  shed.add(gable)
  const gableBack = gable.clone()
  gableBack.position.z = -shedD / 2
  shed.add(gableBack)
  // the shutter, rolled up above the opening
  box(shed, M.steel, shedW - 1.2, 0.5, 0.34, 0, SHED.eave - 0.4, shedD / 2 - 0.1)

  // --- the kit line --------------------------------------------------------
  const lineY = LINE_Z - cz
  box(shed, M.dark, LINE_X1 - LINE_X0 + 1.4, 0.08, 2.4, (LINE_X0 + LINE_X1) / 2 - cx, 0.16, lineY)
  for (const s of [-1, 1]) {
    box(shed, M.steel, LINE_X1 - LINE_X0 + 3, 0.1, 0.1,
      (LINE_X0 + LINE_X1) / 2 - cx, 3.0, lineY + s * 1.15)
  }
  const bayArms = KIT_BAYS.map((x, i) => {
    const arm = new THREE.Group()
    arm.position.set(x - cx, 3.05, lineY)
    shed.add(arm)
    box(arm, M.dark, 0.44, 0.44, 0.44)
    const rod = new THREE.Group()
    rod.position.set(0, -0.25, 0)
    arm.add(rod)
    box(rod, M.steel, 0.09, 0.9, 0.09, 0, -0.45, 0)
    box(rod, [M.yellow, M.dark, M.yellow][i], 0.4, 0.18, 0.4, 0, -0.95, 0)
    return rod
  })
  const kitNames = ['BOOTS', 'VEST', 'HAT']
  KIT_BAYS.forEach((x, i) => {
    const sign = buildSign(kitNames[i])
    sign.scale.setScalar(0.42)
    sign.position.set(x - cx, 0.2, lineY - 1.7)
    shed.add(sign)
  })

  // --- the order board -----------------------------------------------------
  const boardTex = orderBoard()
  const board = new THREE.Group()
  board.position.set(-1.2, 0, -5.6)
  board.rotation.y = -0.34
  group.add(board)
  for (const s of [-1, 1]) box(board, M.dark, 0.11, 2.3, 0.11, s * 1.5, 1.15, 0)
  const boardPanel = new THREE.Mesh(
    new THREE.PlaneGeometry(3.3, 1.65),
    new THREE.MeshStandardMaterial({ map: boardTex.tex, roughness: 0.85, side: THREE.DoubleSide }),
  )
  boardPanel.position.set(0, 1.85, 0.07)
  board.add(boardPanel)

  const musterSign = buildSign('MUSTER')
  musterSign.scale.setScalar(0.5)
  musterSign.position.set(MUSTER.x - 1.4, 0.1, MUSTER.z + 1.4)
  group.add(musterSign)

  // --- the stock the yard sells --------------------------------------------
  // The same piles the masons draw from on site, so the two places read as one
  // company: what comes off these bays ends up in the walls.
  const bays = MATERIALS.map((mat, i) => {
    const stock = buildStock(mat, rng)
    const z = BAY_Z0 + i * BAY_DZ
    stock.group.position.set(BAY_X, 0, z)
    stock.group.rotation.y = Math.PI / 2
    group.add(stock.group)
    stock.setCount(stock.capacity)
    const label = bayLabel(mat)
    // faces the loading side, which is also the side you look in from
    label.position.set(BAY_X - 1.25, 0, z - 0.05)
    label.rotation.y = Math.PI / 2
    group.add(label)
    // a kerbed bay to stand it in
    box(group, M.kerb, 2.2, 0.16, 1.9, BAY_X, 0.08, z).castShadow = false
    return { mat, stock, at: { x: BAY_X - 1.9, z }, z, held: mat.cap }
  })

  /**
   * The bays are a merchant's stock, not a magic hole: they visibly go down as
   * the hands work them and come back up as the yard's own deliveries land, a
   * bit at a time, so a small bay is never standing empty for long.
   */
  function restock(dt) {
    for (const b of bays) {
      if (b.held >= b.stock.capacity) continue
      b.held = Math.min(b.stock.capacity, b.held + dt * (b.stock.capacity / 40))
      b.stock.setCount(Math.floor(b.held))
    }
  }

  // --- the flatbed ---------------------------------------------------------
  const lorry = buildFlatbed()
  // sized against a robot, not against the yard
  lorry.group.scale.setScalar(0.66)
  group.add(lorry.group)
  /** The load of the lorry that has just left, waiting to be collected. */
  let outbound = null
  const lorryState = { x: DOCK.x, z: DOCK.z, yaw: 0, mode: 'dock', loads: 0, t: 0, manifest: [] }
  lorry.group.position.set(DOCK.x, 0, DOCK.z)

  function resetLorry() {
    for (const c of lorry.loadAnchor.children.slice()) lorry.loadAnchor.remove(c)
    lorryState.loads = 0
    lorryState.manifest = []
  }

  // --- the yard hands ------------------------------------------------------
  // Depot staff, not site crew: one livery, and they keep out of each other's
  // way rather than walking into each other.
  const hands = []
  for (let i = 0; i < 3; i++) {
    const rig = buildRobot({ role: 'carrier', accent: 0xd8742f, hatColor: 0xe8ecef, rng })
    group.add(rig.group)
    hands.push({
      rig,
      pos: new THREE.Vector3(LOAD_POINT.x - 2 - i * 1.4, 0, LOAD_POINT.z + 3.4),
      yaw: 0,
      faceYaw: 0,
      state: 'fetch',
      bay: i % bays.length,
      timer: 0,
      lane: (i - 1) * 0.95,
      stack: null,
      anim: {},
    })
  }

  for (let i = 0; i < 4; i++) {
    const cone = buildCone(rng)
    cone.position.set(GATE.x0 - 1.5 + rng() * 0.6, 0, YARD.z1 - 1.6 - i * 1.9)
    group.add(cone)
  }

  // Empty pallets waiting to go back out, and a couple of drums — the clutter
  // that stops the apron reading as a car park.
  for (let i = 0; i < 5; i++) {
    const y = 0.08 + i * 0.16
    const p = box(group, M.ply, 1.5, 0.11, 1.2, -6.6 + (rng() - 0.5) * 0.2, y, -3.6)
    p.rotation.y = (rng() - 0.5) * 0.16
  }
  for (let i = 0; i < 3; i++) {
    box(group, i === 1 ? M.yellow : M.dark, 0.66, 0.94, 0.66,
      -9.6 + i * 0.78, 0.47, -3.2 + (rng() - 0.5) * 0.5,
      new THREE.CylinderGeometry(0.5, 0.5, 1, 12))
  }

  // --- the crew order ------------------------------------------------------
  const queueSlot = (i) => ({
    x: MUSTER.x + (i % MUSTER.cols) * MUSTER.dx,
    z: MUSTER.z + Math.floor(i / MUSTER.cols) * MUSTER.dz,
  })

  let order = null // { crew, roles }
  let fed = 0
  let feedT = 0
  let feedEvery = 19
  const inLine = []
  const queued = []
  const LINE_SPEED = 1.9
  const FEED_GAP = 2.6

  const setKit = (rig, n) => {
    for (const m of rig.kit.boots) m.visible = n >= 1
    for (const m of rig.kit.vest) m.visible = n >= 2
    for (const m of rig.kit.hat) m.visible = n >= 3
  }

  let boardState = { order: false }
  function refreshBoard() {
    const next = order
      ? {
        order: true,
        crewName: order.crew.name,
        crewCss: `#${order.crew.accent.toString(16).padStart(6, '0')}`,
        done: queued.filter((w) => w.state === 'ready').length,
        total: order.roles.length,
      }
      : { order: false }
    if (next.order === boardState.order && next.done === boardState.done
      && next.total === boardState.total && next.crewName === boardState.crewName) return
    boardState = next
    boardTex.draw(next)
  }
  refreshBoard()

  /**
   * Put the next shift on the build sheet. The line paces itself to the size
   * of the order: a sixteen-strong crew on the same interval as an eight would
   * still be walking off the line when the whistle went.
   */
  function prepare(crew, roles) {
    if (order) return
    order = { crew, roles: roles.slice(), leads: orders.leads(roles) }
    fed = 0
    // the last body has to be kitted and mustered with time to spare
    const walkOff = (LINE_X1 - LINE_X0 + 1.2) / LINE_SPEED + 6
    feedEvery = Math.max(4, Math.min(19, (KIT_LEAD_SECONDS - walkOff - 25) / Math.max(1, roles.length - 1)))
    feedT = feedEvery // start one straight away
    refreshBoard()
  }

  /**
   * Stand a finished crew on the muster bay right now. The site pre-rolls a
   * couple of minutes of work before the first frame is drawn, which leaves
   * the line no time to build the first relief crew — but the yard was working
   * before you looked at it, so it has one ready.
   */
  function prime(crew, roles) {
    if (order) return
    order = { crew, roles: roles.slice(), leads: orders.leads(roles) }
    fed = order.roles.length
    feedT = 0
    roles.forEach((role, i) => {
      const lead = order.leads[i]
      const rig = buildRobot({
        role, accent: crew.accent, hatColor: lead ? LEAD_HAT : crew.hat, lead, rng,
      })
      setKit(rig, 3)
      group.add(rig.group)
      const slot = queueSlot(i)
      const w = {
        rig, role, lead, state: 'ready', anim: {},
        pos: new THREE.Vector3(slot.x, 0, slot.z),
        slot, via: null, yaw: Math.PI / 2, faceYaw: Math.PI / 2,
      }
      rig.group.position.copy(w.pos)
      rig.group.rotation.y = w.yaw
      queued.push(w)
    })
    refreshBoard()
  }

  const ready = () => !!order && queued.length >= order.roles.length

  /**
   * Hand over whoever is standing on the muster bay. They keep the bodies they
   * were built with — the robot you watched get its hat is the one that turns
   * up on site. If the line hasn't finished, the site makes up the numbers; the
   * order is cleared either way so the next one can start.
   */
  function take() {
    const done = queued.filter((w) => w.state === 'ready')
    const out = done.map((w) => ({
      rig: w.rig,
      role: w.role,
      lead: !!w.lead,
      world: { x: origin.x + w.rig.group.position.x, z: origin.z + w.rig.group.position.z },
    }))
    for (const w of done) group.remove(w.rig.group)
    for (const w of queued) if (w.state !== 'ready') group.remove(w.rig.group)
    for (const w of inLine) group.remove(w.rig.group)
    queued.length = 0
    inLine.length = 0
    order = null
    fed = 0
    refreshBoard()
    return out
  }

  function feedLine(dt) {
    if (!order || fed >= order.roles.length) return
    feedT += dt
    if (feedT < feedEvery) return
    const last = inLine[inLine.length - 1]
    if (last && last.x < LINE_X0 + FEED_GAP) return
    feedT = 0
    const i = fed++
    const role = order.roles[i]
    const lead = order.leads[i]
    const rig = buildRobot({
      role, accent: order.crew.accent, hatColor: lead ? LEAD_HAT : order.crew.hat, lead, rng,
    })
    setKit(rig, 0)
    group.add(rig.group)
    inLine.push({ rig, role, lead, x: LINE_X0 - 1.2, stage: 0, anim: {}, state: 'line' })
  }

  function stepLine(dt) {
    for (let i = inLine.length - 1; i >= 0; i--) {
      const w = inLine[i]
      w.x += dt * LINE_SPEED
      let stage = 0
      for (let b = 0; b < KIT_BAYS.length; b++) if (w.x > KIT_BAYS[b]) stage = b + 1
      w.stage = stage
      setKit(w.rig, stage)
      w.rig.group.position.set(w.x, 0, LINE_Z)
      w.rig.group.rotation.y = Math.PI / 2
      w.anim.moving = true
      w.anim.speed = LINE_SPEED
      w.rig.update(dt, w.anim)
      if (w.x > LINE_X1) {
        inLine.splice(i, 1)
        w.state = 'walk'
        w.slot = queueSlot(queued.length)
        w.pos = new THREE.Vector3(w.x, 0, LINE_Z)
        w.yaw = Math.PI / 2
        // out of the shed door first, then along the front of it to the bay
        w.via = { x: SHED.x1 - 1.2, z: SHED.z1 + 2.2 }
        queued.push(w)
      }
    }
  }

  function stepQueue(dt) {
    for (const w of queued) {
      if (w.state === 'walk') {
        setKit(w.rig, 3)
        const target = w.via || w.slot
        if (step(w, dt, target, 1.9)) {
          if (w.via) w.via = null
          else {
            w.state = 'ready'
            w.faceYaw = Math.PI / 2
            refreshBoard()
          }
        }
        w.anim.moving = true
        w.anim.speed = 1.9
      } else {
        w.anim.moving = false
        w.anim.speed = 0
        w.anim.idle = 1
      }
      w.rig.update(dt, w.anim)
      w.rig.group.position.copy(w.pos)
      w.yaw += ((w.faceYaw - w.yaw + Math.PI * 3) % (Math.PI * 2) - Math.PI) * Math.min(1, dt * 8)
      w.rig.group.rotation.y = w.yaw
    }
  }

  // --- movement ------------------------------------------------------------

  function step(s, dt, target, speed) {
    const dx = target.x - s.pos.x
    const dz = target.z - s.pos.z
    const d = Math.hypot(dx, dz)
    if (d < 0.14) return true
    const k = (speed * dt) / d
    s.pos.x += dx * Math.min(1, k)
    s.pos.z += dz * Math.min(1, k)
    s.faceYaw = Math.atan2(dx, dz)
    return false
  }

  /** Nudge two hands apart rather than knocking them over. */
  function separate(dt) {
    for (let i = 0; i < hands.length; i++) {
      for (let j = i + 1; j < hands.length; j++) {
        const a = hands[i]
        const b = hands[j]
        const dx = b.pos.x - a.pos.x
        const dz = b.pos.z - a.pos.z
        const d = Math.hypot(dx, dz)
        if (d > 0.95 || d < 1e-4) continue
        const push = ((0.95 - d) / 2) * Math.min(1, dt * 6)
        a.pos.x -= (dx / d) * push
        a.pos.z -= (dz / d) * push
        b.pos.x += (dx / d) * push
        b.pos.z += (dz / d) * push
      }
    }
  }

  // --- loading -------------------------------------------------------------

  function stepHands(dt) {
    for (const h of hands) {
      const a = h.anim
      const bay = bays[h.bay]

      if (h.state === 'fetch') {
        const at = { x: bay.at.x, z: bay.z + h.lane * 0.5 }
        if (step(h, dt, at, 1.8)) {
          h.state = 'lift'
          h.timer = 0.7
          h.faceYaw = Math.PI / 2
        }
      } else if (h.state === 'lift') {
        h.timer -= dt
        if (h.timer <= 0) {
          const load = Math.min(bay.mat.load.carrier, Math.floor(bay.held))
          if (load > 0) {
            bay.held -= load
            bay.stock.setCount(Math.floor(bay.held))
            h.stack = buildCarryStack(bay.mat.key, load)
            h.rig.handAnchor.add(h.stack)
            h.carrying = { key: bay.mat.key, n: load }
          }
          h.state = 'haul'
        }
      } else if (h.state === 'haul') {
        const at = { x: LOAD_POINT.x, z: LOAD_POINT.z + h.lane }
        if (step(h, dt, at, 1.5)) {
          h.state = 'stow'
          h.timer = 0.6
          h.faceYaw = Math.PI / 2
        }
      } else if (h.state === 'stow') {
        h.timer -= dt
        if (h.timer <= 0) {
          if (h.stack) {
            h.rig.handAnchor.remove(h.stack)
            if (lorryState.mode === 'dock' && lorryState.loads < LORRY_LOADS) {
              const slot = lorry.slot(lorryState.loads++)
              lorryState.manifest.push({ key: h.carrying?.key ?? bay.mat.key, n: h.carrying?.n ?? 1 })
              h.stack.position.set(slot.x, slot.y, slot.z)
              h.stack.rotation.y = (rng() - 0.5) * 0.16
              lorry.loadAnchor.add(h.stack)
            }
            h.stack = null
            h.carrying = null
          }
          h.bay = (h.bay + 1) % bays.length
          h.state = 'fetch'
        }
      }

      const moving = h.state === 'fetch' || h.state === 'haul'
      a.moving = moving
      a.speed = moving ? (h.state === 'haul' ? 1.5 : 1.8) : 0
      a.carry = h.stack ? 1 : 0
      a.idle = moving ? 0 : 0.4
      a.lay = h.state === 'stow' ? 1 : 0
      h.rig.update(dt, a)
      h.rig.group.position.copy(h.pos)
      h.yaw += ((h.faceYaw - h.yaw + Math.PI * 3) % (Math.PI * 2) - Math.PI) * Math.min(1, dt * 8)
      h.rig.group.rotation.y = h.yaw
    }
  }

  /**
   * A full lorry pulls out of the gate and runs down to the plots; an empty one
   * backs onto the dock behind it. The bays are topped back up while the dock
   * is clear — the merchant takes its own deliveries off-stage, the way one
   * would.
   */
  function stepLorry(dt) {
    const s = lorryState
    if (s.mode === 'dock') {
      if (s.loads >= LORRY_LOADS) {
        s.mode = 'out'
        s.t = 0
      }
    } else if (s.mode === 'out') {
      s.t += dt
      // nose out of the gate, then away down the road
      const gx = (GATE.x0 + GATE.x1) / 2
      s.x += (gx - s.x) * Math.min(1, dt * 1.2)
      s.z += dt * 5.5
      if (s.z > 14) {
        s.mode = 'away'
        s.t = 0
        // hand the load to the site before the bed is cleared
        outbound = s.manifest.slice()
        resetLorry()
      }
    } else if (s.mode === 'away') {
      s.t += dt
      if (s.t > 3.5) {
        s.mode = 'in'
        s.x = (GATE.x0 + GATE.x1) / 2
        s.z = 15
      }
    } else if (s.mode === 'in') {
      s.z += (DOCK.z - s.z) * Math.min(1, dt * 1.1)
      s.x += (DOCK.x - s.x) * Math.min(1, dt * 1.1)
      if (Math.hypot(s.x - DOCK.x, s.z - DOCK.z) < 0.35) {
        s.x = DOCK.x
        s.z = DOCK.z
        s.mode = 'dock'
      }
    }
    lorry.group.visible = s.mode !== 'away'
    lorry.group.position.set(s.x, 0, s.z)
  }

  function update(dt, t) {
    feedLine(dt)
    stepLine(dt)
    stepQueue(dt)
    bayArms.forEach((rod, i) => {
      const near = inLine.some((w) => Math.abs(w.x - KIT_BAYS[i]) < 0.7)
      rod.position.y = THREE.MathUtils.lerp(rod.position.y, (near ? -0.55 : 0) - 0.25, Math.min(1, dt * 8))
    })
    stepHands(dt)
    separate(dt)
    restock(dt)
    stepLorry(dt)
    void t
  }

  return {
    group,
    update,
    prepare,
    prime,
    ready,
    take,
    get pending() { return order ? order.roles.length - queued.length : 0 },
    /** How big the crew on the books is, or 0 if the line is standing idle. */
    get building() { return order ? order.roles.length : 0 },
    /**
     * What the lorry that just pulled out of the gate is carrying. Returned
     * once and then forgotten, so the site can only take delivery of it once.
     */
    collectOutbound() {
      const m = outbound
      outbound = null
      return m
    },
  }
}
