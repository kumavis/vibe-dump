// ---------------------------------------------------------------------------
// The outfitting yard, a little way down the road from the site.
//
// Two things happen here. On the far side, a line kits robots out for the
// site — a bare chassis walks in one end and comes out the other in boots, a
// hi-vis vest and a hard hat, with a board explaining what each kind of robot
// on the crew actually does.
//
// In the middle is the yellow loading platform, where the yard palletises
// material for the site. Robots fetch blocks off the ground around it — one
// block per material the crew uses — and stack them on the pallet. They are not
// careful about where they are walking, so when two of them collide they both go
// over and drop what they were carrying, and if the stack gets too tall it comes
// down on its own and has to be gathered up again.
// ---------------------------------------------------------------------------

import * as THREE from 'three'
import { buildRobot } from './robot.js'
import { buildCone, buildSign } from './props.js'
import { MATERIALS } from './config.js'

const BOX = new THREE.BoxGeometry(1, 1, 1)
const CYL = new THREE.CylinderGeometry(0.5, 0.5, 1, 20)

// The blocks are the site's own materials, in the site's own colours, so the
// yard reads as feeding the build rather than playing with bricks.
const BLOCK_COLORS = MATERIALS.map((m) => m.color)
const PLATFORM_R = 2.1
const BLOCK = { w: 0.62, h: 0.36, d: 0.62 }
const TOPPLE_AT = 9

function box(parent, material, sx, sy, sz, x = 0, y = 0, z = 0, geo = BOX) {
  const m = new THREE.Mesh(geo, material)
  m.scale.set(sx, sy, sz)
  m.position.set(x, y, z)
  m.castShadow = true
  m.receiveShadow = true
  parent.add(m)
  return m
}

function infoBoard() {
  const cv = document.createElement('canvas')
  cv.width = 1024
  cv.height = 640
  const c = cv.getContext('2d')
  c.fillStyle = '#1b2026'
  c.fillRect(0, 0, 1024, 640)
  c.fillStyle = '#f0b429'
  c.fillRect(0, 0, 1024, 84)
  c.fillStyle = '#15181c'
  c.font = 'bold 52px ui-monospace, Menlo, Consolas, monospace'
  c.textAlign = 'left'
  c.fillText('THE CREW', 40, 60)
  c.font = '26px ui-monospace, Menlo, Consolas, monospace'
  c.textAlign = 'right'
  c.fillText('OUTFITTING YARD', 984, 56)

  const rows = [
    ['FOREMAN', '1 per shift', 'Walks the plot with a clipboard. Lays nothing.'],
    ['MASON', '6 per shift', 'Draws material from the right stock and sets it.'],
    ['BARROW', '2 per shift', 'Runs a wheelbarrow between drop and stock.'],
    ['CARRIER', '2 per shift', 'Same run, by hand. Three or four at a time.'],
  ]
  let y = 150
  for (const [role, n, what] of rows) {
    c.fillStyle = '#f0b429'
    c.textAlign = 'left'
    c.font = 'bold 34px ui-monospace, Menlo, Consolas, monospace'
    c.fillText(role, 40, y)
    c.fillStyle = '#8fa4b4'
    c.font = '24px ui-monospace, Menlo, Consolas, monospace'
    c.fillText(n, 300, y)
    c.fillStyle = '#e4ecf2'
    c.font = '25px ui-monospace, Menlo, Consolas, monospace'
    c.fillText(what, 40, y + 38)
    c.strokeStyle = 'rgba(240,180,41,0.3)'
    c.beginPath()
    c.moveTo(40, y + 66)
    c.lineTo(984, y + 66)
    c.stroke()
    y += 118
  }
  c.fillStyle = '#8fa4b4'
  c.font = '23px ui-monospace, Menlo, Consolas, monospace'
  c.fillText('Every one gets boots, a vest and a hat before it goes out.', 40, 618)

  const tex = new THREE.CanvasTexture(cv)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

export function createDepot({ origin, rng }) {
  const group = new THREE.Group()
  group.position.set(origin.x, 0, origin.z)

  const M = {
    pad: new THREE.MeshStandardMaterial({ color: 0x9a958c, roughness: 0.98 }),
    yellow: new THREE.MeshStandardMaterial({ color: 0xf0b429, roughness: 0.6 }),
    yellowDark: new THREE.MeshStandardMaterial({ color: 0xc48f14, roughness: 0.7 }),
    steel: new THREE.MeshStandardMaterial({ color: 0xb2bcc4, roughness: 0.36, metalness: 0.8 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x454b52, roughness: 0.6, metalness: 0.4 }),
    hut: new THREE.MeshStandardMaterial({ color: 0xd8d2c2, roughness: 0.7 }),
  }

  // --- the yard ------------------------------------------------------------
  const pad = box(group, M.pad, 30, 0.06, 22, 0, 0.03, -3)
  pad.castShadow = false
  for (let i = 0; i < 26; i++) {
    const a = (i / 26) * Math.PI * 2
    if (Math.abs(Math.sin(a)) < 0.25 && Math.cos(a) > 0) continue // leave the road side open
    box(group, M.dark, 0.1, 1.3, 0.1, Math.cos(a) * 14.5, 0.65, -3 + Math.sin(a) * 10.5)
  }

  // --- yellow platform -----------------------------------------------------
  const platform = box(group, M.yellow, PLATFORM_R * 2, 0.4, PLATFORM_R * 2, 0, 0.2, 0, CYL)
  platform.receiveShadow = true
  box(group, M.yellowDark, PLATFORM_R * 2 + 0.24, 0.12, PLATFORM_R * 2 + 0.24, 0, 0.06, 0, CYL)
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2
    box(group, i % 2 ? M.dark : M.yellow, 0.5, 0.06, 0.24,
      Math.cos(a) * (PLATFORM_R + 0.06), 0.42, Math.sin(a) * (PLATFORM_R + 0.06)).rotation.y = -a
  }
  // What the platform is for, on a board beside it and in a key of the five
  // material colours so the loose blocks on the ground read as material.
  const outboundSign = buildSign('OUTBOUND\nmaterial for the site')
  outboundSign.scale.setScalar(0.8)
  outboundSign.position.set(-6.2, 0.06, 1.4)
  group.add(outboundSign)
  MATERIALS.forEach((m, i) => {
    const x = -4.3 + (i - (MATERIALS.length - 1) / 2) * 0.58
    box(group, new THREE.MeshStandardMaterial({ color: m.color, roughness: 0.7 }),
      0.46, 0.05, 0.46, x, 0.09, 2.1).receiveShadow = true
  })

  // --- blocks --------------------------------------------------------------
  const blockMats = BLOCK_COLORS.map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.62 }))
  const blocks = []
  for (let i = 0; i < 22; i++) {
    const a = rng() * Math.PI * 2
    const r = 3.6 + rng() * 4.2
    const mesh = box(group, blockMats[i % blockMats.length], BLOCK.w, BLOCK.h, BLOCK.d,
      Math.cos(a) * r, BLOCK.h / 2, Math.sin(a) * r)
    mesh.rotation.y = rng() * Math.PI
    blocks.push({ mesh, state: 'loose', by: null })
  }
  let stackN = 0
  let toppleT = 0

  function scatter(b, x, z) {
    const a = rng() * Math.PI * 2
    const r = 0.5 + rng() * 1.2
    b.mesh.position.set(x + Math.cos(a) * r, BLOCK.h / 2, z + Math.sin(a) * r)
    b.mesh.rotation.set(0, rng() * Math.PI, 0)
    b.state = 'loose'
    b.by = null
  }

  // --- stackers ------------------------------------------------------------
  const LIVERY = [
    { accent: 0xd8442f, hat: 0xf4b41a },
    { accent: 0x2f6fd8, hat: 0xe8ecef },
    { accent: 0x2f9e5a, hat: 0x8fd14f },
    { accent: 0x7a4bd8, hat: 0xf07acc },
    { accent: 0xc46a1f, hat: 0xf4e0a1 },
    { accent: 0x2fb0b8, hat: 0xffffff },
  ]
  const stackers = []
  for (let i = 0; i < 6; i++) {
    const rig = buildRobot({ role: 'carrier', accent: LIVERY[i].accent, hatColor: LIVERY[i].hat, rng })
    group.add(rig.group)
    const a = (i / 6) * Math.PI * 2
    stackers.push({
      rig,
      lane: a,
      pos: new THREE.Vector3(Math.cos(a) * 6.5, 0, Math.sin(a) * 6.5),
      yaw: 0,
      faceYaw: 0,
      state: 'seek',
      timer: 0,
      block: null,
      fall: 0,
      anim: {},
    })
  }

  // --- the kit line --------------------------------------------------------
  // A bare chassis walks the gantry and picks up boots, vest and hat on the way.
  const LINE_Z = -9.5
  const LINE_X0 = -9
  const LINE_X1 = 9
  const BAYS = [-4.2, -0.4, 3.4]
  const gantry = new THREE.Group()
  gantry.position.set(0, 0, LINE_Z)
  group.add(gantry)
  box(gantry, M.hut, 20, 0.1, 2.6, 0, 0.06, 0)
  for (const s of [-1, 1]) {
    box(gantry, M.steel, 19, 0.12, 0.12, 0, 3.1, s * 1.25)
    for (let i = -3; i <= 3; i++) box(gantry, M.steel, 0.13, 3.1, 0.13, i * 3.1, 1.55, s * 1.25)
  }
  const bayArms = BAYS.map((x, i) => {
    const arm = new THREE.Group()
    arm.position.set(x, 3.15, 0)
    gantry.add(arm)
    box(arm, M.dark, 0.5, 0.5, 0.5, 0, 0, 0)
    const rod = new THREE.Group()
    rod.position.set(0, -0.25, 0)
    arm.add(rod)
    box(rod, M.steel, 0.1, 1.0, 0.1, 0, -0.5, 0)
    box(rod, [M.yellow, M.dark, M.yellow][i], 0.44, 0.2, 0.44, 0, -1.05, 0)
    return rod
  })
  const bayLabels = ['BOOTS', 'VEST', 'HAT']
  BAYS.forEach((x, i) => {
    const sign = buildSign(bayLabels[i])
    sign.scale.setScalar(0.5)
    sign.position.set(x, 0.1, LINE_Z - 2.2)
    group.add(sign)
  })

  // The line only runs when there is an order on the books: the next shift's
  // crew, in the next shift's livery, built one at a time and lined up by the
  // gate until it is time for them to walk down to the site.
  const QUEUE_COLS = 6
  const queueSlot = (i) => ({ x: 6.0 + (i % QUEUE_COLS) * 1.25, z: -1.8 + Math.floor(i / QUEUE_COLS) * 1.5 })

  let order = null // { crew, roles }
  let fed = 0
  let feedT = 0
  const inLine = []
  const queued = []
  const LINE_SPEED = 1.9
  const FEED_GAP = 2.6
  /** One body every twenty seconds, so the line is working all shift rather
   *  than in a panic just before the whistle. */
  const FEED_EVERY = 19

  const setKit = (rig, n) => {
    for (const m of rig.kit.boots) m.visible = n >= 1
    for (const m of rig.kit.vest) m.visible = n >= 2
    for (const m of rig.kit.hat) m.visible = n >= 3
  }

  /** Put the next shift on the build sheet. */
  function prepare(crew, roles) {
    if (order) return
    order = { crew, roles: roles.slice() }
    fed = 0
    feedT = FEED_EVERY // start one straight away
  }

  /** Every one of them kitted and lined up? */
  const ready = () => !!order && queued.length >= order.roles.length

  /**
   * Hand over whoever is standing in the muster bay. They keep the bodies they
   * were built with — the robot you watched get its hat is the one that turns
   * up on site. If the line hasn't finished, the site makes up the numbers; the
   * order is cleared either way so the next one can start.
   */
  function take() {
    const done = queued.filter((w) => w.state === 'ready')
    const out = done.map((w) => ({
      rig: w.rig,
      role: w.role,
      world: { x: origin.x + w.rig.group.position.x, z: origin.z + w.rig.group.position.z },
    }))
    for (const w of done) group.remove(w.rig.group)
    // anything still walking off the line is scrapped rather than left behind
    for (const w of queued) if (w.state !== 'ready') group.remove(w.rig.group)
    for (const w of inLine) group.remove(w.rig.group)
    queued.length = 0
    inLine.length = 0
    order = null
    fed = 0
    return out
  }

  function feedLine(dt) {
    if (!order || fed >= order.roles.length) return
    feedT += dt
    if (feedT < FEED_EVERY) return
    const last = inLine[inLine.length - 1]
    if (last && last.x < LINE_X0 + FEED_GAP) return
    feedT = 0
    const role = order.roles[fed++]
    const rig = buildRobot({ role, accent: order.crew.accent, hatColor: order.crew.hat, rng })
    setKit(rig, 0)
    group.add(rig.group)
    inLine.push({ rig, role, x: LINE_X0 - 1.2, stage: 0, anim: {}, state: 'line' })
  }

  function stepLine(dt) {
    for (let i = inLine.length - 1; i >= 0; i--) {
      const w = inLine[i]
      w.x += dt * LINE_SPEED
      let stage = 0
      for (let b = 0; b < BAYS.length; b++) if (w.x > BAYS[b]) stage = b + 1
      w.stage = stage
      setKit(w.rig, stage)
      w.rig.group.position.set(w.x, 0, LINE_Z)
      w.rig.group.rotation.y = Math.PI / 2
      w.anim.moving = true
      w.anim.speed = LINE_SPEED
      w.rig.update(dt, w.anim)
      if (w.x > LINE_X1) {
        // off the end of the line and over to the muster bay
        inLine.splice(i, 1)
        w.state = 'walk'
        w.slot = queueSlot(queued.length)
        w.pos = new THREE.Vector3(w.x, 0, LINE_Z)
        w.yaw = Math.PI / 2
        queued.push(w)
      }
    }
  }

  function stepQueue(dt) {
    for (const w of queued) {
      if (w.state === 'walk') {
        setKit(w.rig, 3)
        if (step(w, dt, w.slot, 1.9)) {
          w.state = 'ready'
          w.faceYaw = Math.PI / 2
        }
        w.anim.moving = w.state === 'walk'
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

  // --- info board ----------------------------------------------------------
  const board = new THREE.Group()
  board.position.set(10.4, 0, -3.6)
  board.rotation.y = -0.95
  group.add(board)
  for (const s of [-1, 1]) box(board, M.dark, 0.14, 2.6, 0.14, s * 2.3, 1.3, 0)
  const panel = new THREE.Mesh(
    new THREE.PlaneGeometry(4.9, 3.1),
    new THREE.MeshStandardMaterial({ map: infoBoard(), roughness: 0.85, side: THREE.DoubleSide }),
  )
  panel.position.set(0, 2.3, 0.09)
  board.add(panel)

  for (let i = 0; i < 6; i++) {
    const cone = buildCone(rng)
    const a = (i / 6) * Math.PI * 2
    cone.position.set(Math.cos(a) * 9.5, 0, -3 + Math.sin(a) * 7)
    group.add(cone)
  }

  // --- behaviour -----------------------------------------------------------
  const _v = new THREE.Vector3()

  function stackTop() {
    return 0.4 + stackN * BLOCK.h
  }

  function step(s, dt, target, speed) {
    const dx = target.x - s.pos.x
    const dz = target.z - s.pos.z
    const d = Math.hypot(dx, dz)
    if (d < 0.12) return true
    const k = (speed * dt) / d
    s.pos.x += dx * Math.min(1, k)
    s.pos.z += dz * Math.min(1, k)
    s.faceYaw = Math.atan2(dx, dz)
    return false
  }

  function update(dt, t) {
    feedLine(dt)
    stepLine(dt)
    stepQueue(dt)
    bayArms.forEach((rod, i) => {
      const near = inLine.some((w) => Math.abs(w.x - BAYS[i]) < 0.7)
      const want = near ? -0.55 : 0
      rod.position.y += (want - 0.25 - rod.position.y) * Math.min(1, dt * 8) + 0
      rod.position.y = THREE.MathUtils.lerp(rod.position.y, want - 0.25, Math.min(1, dt * 8))
    })

    // the stack comes down when it gets silly
    if (toppleT > 0) {
      toppleT -= dt
      if (toppleT <= 0) {
        for (const b of blocks) if (b.state === 'stacked') scatter(b, 0, 0)
        stackN = 0
      }
    }

    // stackers
    for (let i = 0; i < stackers.length; i++) {
      const s = stackers[i]
      const a = s.anim

      if (s.fall > 0) {
        s.fall -= dt
        const k = Math.min(1, s.fall / 0.35)
        a.moving = false
        a.speed = 0
        a.carry = 0
        a.idle = 0
        a.tilt = -1.35 * (1 - k * 0.15)
        s.rig.group.position.set(s.pos.x, 0.34 * (1 - k * 0.2), s.pos.z)
        s.rig.group.rotation.y = s.yaw
        s.rig.update(dt, a)
        if (s.fall <= 0) {
          s.state = 'seek'
          s.block = null
        }
        continue
      }

      // walking into each other puts them both on the floor
      s.cool = Math.max(0, (s.cool || 0) - dt)
      for (let j = i + 1; j < stackers.length; j++) {
        const o = stackers[j]
        if (o.fall > 0 || s.cool > 0 || (o.cool || 0) > 0) continue
        if (s.pos.distanceTo(o.pos) < 0.72) {
          for (const victim of [s, o]) {
            victim.fall = 2.4
            victim.cool = 3.6
            if (victim.block) {
              victim.block.mesh.parent === victim.rig.handAnchor && victim.rig.handAnchor.remove(victim.block.mesh)
              group.add(victim.block.mesh)
              scatter(victim.block, victim.pos.x, victim.pos.z)
              victim.block = null
            }
          }
          // shove them apart so they don't lock together
          const dx = o.pos.x - s.pos.x || 0.1
          const dz = o.pos.z - s.pos.z || 0.1
          const d = Math.hypot(dx, dz)
          s.pos.x -= (dx / d) * 0.75
          s.pos.z -= (dz / d) * 0.75
          o.pos.x += (dx / d) * 0.75
          o.pos.z += (dz / d) * 0.75
        }
      }
      if (s.fall > 0) continue

      if (s.state === 'seek') {
        if (!s.block) {
          let best = null
          let bestD = Infinity
          for (const b of blocks) {
            if (b.state !== 'loose') continue
            const d = (b.mesh.position.x - s.pos.x) ** 2 + (b.mesh.position.z - s.pos.z) ** 2
            if (d < bestD) {
              bestD = d
              best = b
            }
          }
          if (!best) {
            a.idle = 1
            a.moving = false
            s.rig.update(dt, a)
            s.rig.group.position.copy(s.pos)
            continue
          }
          s.block = best
          best.state = 'claimed'
          best.by = s
        }
        const bp = s.block.mesh.position
        if (step(s, dt, bp, 1.7)) {
          s.block.state = 'held'
          s.rig.handAnchor.add(s.block.mesh)
          s.block.mesh.position.set(0, 0, 0.05)
          s.block.mesh.rotation.set(0, 0, 0)
          s.state = 'carry'
        }
      } else if (s.state === 'carry') {
        // approach on its own bearing rather than head-on from wherever it is
        const drop = { x: Math.cos(s.lane) * (PLATFORM_R + 0.85), z: Math.sin(s.lane) * (PLATFORM_R + 0.85) }
        if (step(s, dt, drop, 1.45)) {
          s.state = 'place'
          s.timer = 0.55
          s.faceYaw = Math.atan2(-s.pos.x, -s.pos.z)
        }
      } else if (s.state === 'place') {
        s.timer -= dt
        if (s.timer <= 0) {
          const b = s.block
          s.rig.handAnchor.remove(b.mesh)
          group.add(b.mesh)
          const jx = (rng() - 0.5) * 0.34
          const jz = (rng() - 0.5) * 0.34
          b.mesh.position.set(jx, stackTop() + BLOCK.h / 2, jz)
          b.mesh.rotation.set(0, (rng() - 0.5) * 0.4, 0)
          b.state = 'stacked'
          stackN++
          if (stackN >= TOPPLE_AT && toppleT <= 0) toppleT = 1.6
          s.block = null
          s.state = 'seek'
        }
      }

      const moving = s.state === 'seek' || s.state === 'carry'
      a.moving = moving
      a.speed = moving ? (s.state === 'carry' ? 1.45 : 1.7) : 0
      a.carry = s.block && s.block.state === 'held' ? 1 : 0
      a.idle = s.state === 'place' ? 0 : a.idle
      a.lay = s.state === 'place' ? 1 : 0
      a.tilt = 0
      s.rig.update(dt, a)
      s.rig.group.position.copy(s.pos)
      s.yaw += ((s.faceYaw - s.yaw + Math.PI * 3) % (Math.PI * 2) - Math.PI) * Math.min(1, dt * 8)
      s.rig.group.rotation.y = s.yaw
    }

    platform.rotation.y = t * 0.12
    void _v
  }

  return {
    group,
    update,
    prepare,
    ready,
    take,
    get pending() { return order ? order.roles.length - queued.length : 0 },
    /** How big the crew on the books is, or 0 if the line is standing idle. */
    get building() { return order ? order.roles.length : 0 },
  }
}
