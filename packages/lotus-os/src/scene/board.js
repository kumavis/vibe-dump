// board.js — the rev C board on the bench, and the only thing in the room that
// is a project rather than a tool.
//
// It does nothing useful, thoroughly: eight amber LEDs running a chase and a
// lotus drawn one petal at a time on a 128x64 mono OLED. Its layout lives in
// two tables that the artwork canvases and the component meshes both read, so
// a silkscreen outline and the part standing in it cannot drift apart.

import * as THREE from 'three'
import {
  MAT,
  PALETTE,
  box,
  cyl,
  cable,
  glowSprite,
  contactDarken,
  ensureColors,
  edgeDirt,
  makeCanvasTexture,
} from './materials.js'

const BW = 0.104
const BD = 0.07
const BT = 0.0016
const STAND = 0.0032
// The top copper face. Every part on this board is placed against it.
const TOP = STAND + BT

const DESK = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)

const hex = (n) => `#${n.toString(16).padStart(6, '0')}`
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
const smootherstep = (k) => k * k * k * (k * (k * 6 - 15) + 10)

// One table, two consumers: the canvas draws the outline and the pads, the
// builder stands the part inside them. x/z are the local centre in metres.
const PART = {
  mcu: { x: -0.006, z: -0.0075, w: 0.0135, d: 0.0135 },
  oled: { x: 0.004, z: 0.0165, w: 0.0325, d: 0.0175 },
  usb: { x: 0.05, z: 0.012, w: 0.0072, d: 0.0089 },
  reg: { x: 0.033, z: -0.01, w: 0.0065, d: 0.0035 },
  can: { x: 0.033, z: 0.004, w: 0.0068, d: 0.0068 },
  button: { x: -0.04, z: 0.0195, w: 0.0062, d: 0.0062 },
  trim: { x: -0.0395, z: 0.001, w: 0.0068, d: 0.0068 },
}

const LED_N = 8
const LED_Z = -0.0268
const LED_PITCH = 0.0075
const ledX = (i) => -0.02625 + i * LED_PITCH
// The room's one cyan accent, and it is four pixels wide. Keep it that way.
const PWR = { x: -0.0405, z: LED_Z }

const PITCH = 0.00254
// Header A runs along the front edge, header B up the right-hand side. Every
// pin on the board is one instance of one cylinder.
const HEADERS = [
  { x: -0.0254, z: 0.03, n: 8, dx: PITCH, dz: 0 },
  { x: 0.043, z: -0.0064, n: 6, dx: 0, dz: PITCH },
]

// D7 escapes the west side of the chip; the jumper lands on header A pin 2.
const BODGE_FROM = { x: -0.0148, z: -0.006 }
const BODGE_TO = { x: -0.0254 + PITCH, z: 0.03 }

const MOUNT = [
  [-0.047, -0.03],
  [0.047, -0.03],
  [-0.047, 0.03],
  [0.047, 0.03],
]

// Every copper pad on the board, in one list. The artwork canvas paints them
// gold and the surface canvas makes them glossy metal, and neither is allowed
// to disagree with the other about where they are.
const PADS = []
{
  const rect = (x, z, w, d, drill = 0) => PADS.push({ x, z, w, d, drill })
  for (let i = 0; i < LED_N; i++) {
    rect(ledX(i), LED_Z - 0.0016, 0.0011, 0.0011)
    rect(ledX(i), LED_Z + 0.0016, 0.0011, 0.0011)
    rect(ledX(i), -0.0216, 0.0011, 0.0009)
    rect(ledX(i), -0.0194, 0.0011, 0.0009)
  }
  rect(PWR.x, LED_Z - 0.0016, 0.0011, 0.0011)
  rect(PWR.x, LED_Z + 0.0016, 0.0011, 0.0011)
  // The thermal pad, then a fringe of leads on all four sides of the chip.
  rect(PART.mcu.x, PART.mcu.z, 0.006, 0.006)
  for (let i = 0; i < 9; i++) {
    const o = -0.0048 + i * 0.0012
    rect(PART.mcu.x + o, PART.mcu.z - 0.0059, 0.0007, 0.0016)
    rect(PART.mcu.x + o, PART.mcu.z + 0.0059, 0.0007, 0.0016)
    rect(PART.mcu.x - 0.0059, PART.mcu.z + o, 0.0016, 0.0007)
    rect(PART.mcu.x + 0.0059, PART.mcu.z + o, 0.0016, 0.0007)
  }
  rect(PART.usb.x - 0.0042, PART.usb.z, 0.0026, 0.0092)
  rect(PART.reg.x, PART.reg.z - 0.0026, 0.0055, 0.0016)
  rect(BODGE_FROM.x, BODGE_FROM.z, 0.0013, 0.0013)
  // Three pads going nowhere. The machine's own notes are honest about it.
  for (const o of [-0.0025, 0, 0.0025]) rect(PART.trim.x + o, PART.trim.z - 0.0028, 0.0013, 0.0016)
  for (const hdr of HEADERS) {
    for (let i = 0; i < hdr.n; i++) {
      PADS.push({ x: hdr.x + hdr.dx * i, z: hdr.z + hdr.dz * i, r: 0.0009, drill: 0.0004 })
    }
    // Pin 1 is square. Always. It is the only way to plug anything in the
    // right way round in the dark.
    rect(hdr.x, hdr.z, 0.0018, 0.0018, 0.0004)
  }
}

const CHASE_PERIOD = 3.1
const WAKE_RAMP = 0.3
const SLEEP_RAMP = 1.05

const OLED_W = 128
const OLED_H = 64
const OLED_FPS = 11
const PETALS = 9
const PER_PETAL = 3
const DRAW_END = PETALS * PER_PETAL
const HOLD_END = DRAW_END + 16
const WIPE_TICKS = 7
const CYCLE = HOLD_END + WIPE_TICKS

// --- top-side artwork -------------------------------------------------------

/**
 * The silkscreen, the pours and the routing, drawn once. At four pixels to the
 * millimetre a reference designator is a smudge, so the designators here are
 * tick runs: the eye reads "there is text there" and stops asking.
 */
const boardTexture = () =>
  makeCanvasTexture(
    'board-top',
    512,
    344,
    (ctx, w, h) => {
      const sx = w / BW
      const sz = h / BD
      const px = (x) => (x + BW / 2) * sx
      const py = (z) => (z + BD / 2) * sz
      const mm = sx * 0.001

      const rrect = (x, y, rw, rh, r) => {
        ctx.beginPath()
        ctx.moveTo(x + r, y)
        ctx.lineTo(x + rw - r, y)
        ctx.quadraticCurveTo(x + rw, y, x + rw, y + r)
        ctx.lineTo(x + rw, y + rh - r)
        ctx.quadraticCurveTo(x + rw, y + rh, x + rw - r, y + rh)
        ctx.lineTo(x + r, y + rh)
        ctx.quadraticCurveTo(x, y + rh, x, y + rh - r)
        ctx.lineTo(x, y + r)
        ctx.quadraticCurveTo(x, y, x + r, y)
        ctx.closePath()
      }

      ctx.fillStyle = hex(PALETTE.solderMask)
      ctx.fillRect(0, 0, w, h)

      // Ground pour over everything but a keepout at the outline. It is the
      // reason a bare board reads green-black rather than flat black.
      ctx.fillStyle = '#16241d'
      rrect(3 * mm, 3 * mm, w - 6 * mm, h - 6 * mm, 3 * mm)
      ctx.fill()

      // Hatched pour on the analogue corner, because someone read a note about
      // stitching once and has been doing it ever since.
      ctx.save()
      ctx.beginPath()
      ctx.rect(px(0.018), py(-0.026), 0.032 * sx, 0.03 * sz)
      ctx.clip()
      ctx.strokeStyle = '#1a2a22'
      ctx.lineWidth = 1.2
      for (let i = -40; i < 80; i++) {
        ctx.beginPath()
        ctx.moveTo(px(0.018) + i * 6, py(-0.026))
        ctx.lineTo(px(0.018) + i * 6 + 0.03 * sz, py(0.004))
        ctx.stroke()
      }
      ctx.restore()

      // Routing. A real route is a puzzle nobody can read at this pitch, so
      // these are plausible runs: doglegs on 45s, which is what the autorouter
      // would have produced anyway.
      const DIRS = [
        [1, 0],
        [0.7071, 0.7071],
        [0, 1],
        [-0.7071, 0.7071],
        [-1, 0],
        [-0.7071, -0.7071],
        [0, -1],
        [0.7071, -0.7071],
      ]
      ctx.strokeStyle = '#1d3128'
      ctx.lineWidth = 1.5
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      for (let i = 0; i < 130; i++) {
        let x = 14 + Math.random() * (w - 28)
        let y = 12 + Math.random() * (h - 24)
        let d = Math.floor(Math.random() * 8)
        ctx.beginPath()
        ctx.moveTo(x, y)
        const legs = 2 + Math.floor(Math.random() * 3)
        for (let l = 0; l < legs; l++) {
          const len = 10 + Math.random() * 44
          x += DIRS[d][0] * len
          y += DIRS[d][1] * len
          ctx.lineTo(x, y)
          d = (d + (Math.random() < 0.5 ? 1 : 7)) % 8
        }
        ctx.stroke()
      }

      // The one bundle worth routing on purpose: chip to LED row. Eight
      // parallel runs are the strongest "this is a circuit board" cue there is.
      ctx.strokeStyle = '#24402f'
      ctx.lineWidth = 1.8
      for (let i = 0; i < LED_N; i++) {
        const x0 = px(PART.mcu.x - PART.mcu.w / 2 + (i * PART.mcu.w) / (LED_N - 1))
        const y0 = py(PART.mcu.z - PART.mcu.d / 2)
        const x1 = px(ledX(i))
        const y1 = py(LED_Z + 0.0034)
        ctx.beginPath()
        ctx.moveTo(x0, y0)
        ctx.lineTo(x0 + (x1 - x0) * 0.35, y0 - Math.abs(x1 - x0) * 0.35)
        ctx.lineTo(x1, y1)
        ctx.stroke()
      }

      for (let i = 0; i < 70; i++) {
        const x = 12 + Math.random() * (w - 24)
        const y = 10 + Math.random() * (h - 20)
        ctx.fillStyle = '#2c4534'
        ctx.beginPath()
        ctx.arc(x, y, 1.9, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#0b120f'
        ctx.beginPath()
        ctx.arc(x, y, 0.8, 0, Math.PI * 2)
        ctx.fill()
      }

      // --- pads ---
      const fillPad = (p) => {
        if (p.r) {
          ctx.beginPath()
          ctx.arc(px(p.x), py(p.z), p.r * sx, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.fillRect(px(p.x) - (p.w * sx) / 2, py(p.z) - (p.d * sz) / 2, p.w * sx, p.d * sz)
        }
      }
      ctx.fillStyle = 'rgba(184,115,51,0.74)'
      for (const p of PADS) fillPad(p)

      // Drill holes punched out rather than painted, so they stay dark however
      // hot the lamp gets.
      ctx.save()
      ctx.globalCompositeOperation = 'destination-out'
      for (const p of PADS) {
        if (!p.drill) continue
        ctx.beginPath()
        ctx.arc(px(p.x), py(p.z), p.drill * sx, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()

      // --- silkscreen ---
      ctx.strokeStyle = hex(PALETTE.silk)
      ctx.fillStyle = hex(PALETTE.silk)
      ctx.globalAlpha = 0.5
      ctx.lineWidth = 1.4

      const outline = (p, bleed = 0.0007) => {
        ctx.strokeRect(
          px(p.x - p.w / 2 - bleed),
          py(p.z - p.d / 2 - bleed),
          (p.w + bleed * 2) * sx,
          (p.d + bleed * 2) * sz,
        )
      }

      // Designators, suggested rather than spelled.
      const ticks = (x, z, n, size = 2.4) => {
        for (let i = 0; i < n; i++) ctx.fillRect(px(x) + i * (size * 0.85), py(z), size * 0.5, size * 1.7)
      }

      rrect(1.5 * mm, 1.5 * mm, w - 3 * mm, h - 3 * mm, 3 * mm)
      ctx.stroke()

      for (const key of ['mcu', 'oled', 'usb', 'reg', 'can', 'button', 'trim']) outline(PART[key])
      ticks(PART.mcu.x - 0.0065, PART.mcu.z - 0.0105, 3)
      ticks(PART.reg.x - 0.003, PART.reg.z - 0.0048, 3)
      ticks(PART.can.x - 0.0034, PART.can.z + 0.0046, 3)
      ticks(PART.button.x - 0.0032, PART.button.z + 0.0048, 3)
      ticks(PART.trim.x - 0.0034, PART.trim.z + 0.0048, 3)
      ticks(PART.usb.x - 0.0036, PART.usb.z - 0.0068, 2)

      // Pin 1 dot, and the chamfer that agrees with it.
      ctx.beginPath()
      ctx.arc(px(PART.mcu.x - 0.0088), py(PART.mcu.z - 0.0088), 1.9 * mm, 0, Math.PI * 2)
      ctx.fill()

      // The LED row gets a bracket and eight ticks — the closest thing this
      // board has to a label, and the only place the eye will look.
      ctx.beginPath()
      ctx.moveTo(px(ledX(0) - 0.0022), py(LED_Z - 0.0034))
      ctx.lineTo(px(ledX(LED_N - 1) + 0.0022), py(LED_Z - 0.0034))
      ctx.stroke()
      for (let i = 0; i < LED_N; i++) {
        ctx.fillRect(px(ledX(i)) - 0.6, py(LED_Z - 0.0034), 1.2, 2.6)
        ctx.strokeRect(px(ledX(i) - 0.0011), py(LED_Z - 0.0018), 0.0022 * sx, 0.0036 * sz)
      }
      ctx.strokeRect(px(PWR.x - 0.0011), py(LED_Z - 0.0018), 0.0022 * sx, 0.0036 * sz)
      ticks(PWR.x - 0.0022, LED_Z + 0.0028, 3)

      for (const hdr of HEADERS) {
        const lx = hdr.x - 0.0016
        const lz = hdr.z - 0.0016
        ctx.strokeRect(px(lx), py(lz), (hdr.dx * (hdr.n - 1) + 0.0032) * sx, (hdr.dz * (hdr.n - 1) + 0.0032) * sz)
      }

      // Polarity, the one silkscreen mark that actually matters.
      ctx.lineWidth = 1.6
      ctx.beginPath()
      ctx.moveTo(px(PART.can.x - 0.0055), py(PART.can.z - 0.0008))
      ctx.lineTo(px(PART.can.x - 0.0035), py(PART.can.z - 0.0008))
      ctx.moveTo(px(PART.can.x - 0.0045), py(PART.can.z - 0.0018))
      ctx.lineTo(px(PART.can.x - 0.0045), py(PART.can.z + 0.0002))
      ctx.stroke()
      ctx.globalAlpha = 1

      // --- the tax on being a real object ---
      // Flux nobody cleaned off, around the joint nobody meant to make.
      const flux = ctx.createRadialGradient(px(BODGE_FROM.x), py(BODGE_FROM.z), 1, px(BODGE_FROM.x), py(BODGE_FROM.z), 26)
      flux.addColorStop(0, 'rgba(150,116,58,0.3)')
      flux.addColorStop(1, 'rgba(150,116,58,0)')
      ctx.fillStyle = flux
      ctx.fillRect(px(BODGE_FROM.x) - 30, py(BODGE_FROM.z) - 30, 60, 60)

      for (let i = 0; i < 260; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(0,0,0,0.16)' : 'rgba(90,110,96,0.08)'
        const r = 0.6 + Math.random() * 2.6
        ctx.beginPath()
        ctx.arc(Math.random() * w, Math.random() * h, r, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalCompositeOperation = 'multiply'
      const vig = ctx.createRadialGradient(w / 2, h / 2, h * 0.28, w / 2, h / 2, h * 0.82)
      vig.addColorStop(0, 'rgba(255,255,255,1)')
      vig.addColorStop(1, 'rgba(110,120,112,1)')
      ctx.fillStyle = vig
      ctx.fillRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'source-over'
    },
    { wrap: THREE.ClampToEdgeWrapping },
  )

/**
 * Roughness in green, metalness in blue: the two channels MeshStandardMaterial
 * reads them from, in one canvas. Bare copper is glossy metal, solder mask is
 * matte dielectric, and the flux nobody wiped off sits between the two. Drawn
 * fine and low-contrast on purpose — the lamp sits close enough that a blotchy
 * roughness map turns the whole board into one wandering specular.
 */
const boardSurfaceTexture = () =>
  makeCanvasTexture(
    'board-surface',
    256,
    172,
    (ctx, w, h) => {
      const sx = w / BW
      const sz = h / BD
      const px = (x) => (x + BW / 2) * sx
      const py = (z) => (z + BD / 2) * sz

      ctx.fillStyle = 'rgb(0,242,8)'
      ctx.fillRect(0, 0, w, h)

      ctx.fillStyle = 'rgb(0,96,214)'
      for (const p of PADS) {
        if (p.r) {
          ctx.beginPath()
          ctx.arc(px(p.x), py(p.z), p.r * sx, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.fillRect(px(p.x) - (p.w * sx) / 2, py(p.z) - (p.d * sz) / 2, p.w * sx, p.d * sz)
        }
      }

      const flux = ctx.createRadialGradient(px(BODGE_FROM.x), py(BODGE_FROM.z), 1, px(BODGE_FROM.x), py(BODGE_FROM.z), 14)
      flux.addColorStop(0, 'rgba(0,150,40,0.6)')
      flux.addColorStop(1, 'rgba(0,150,40,0)')
      ctx.fillStyle = flux
      ctx.fillRect(px(BODGE_FROM.x) - 16, py(BODGE_FROM.z) - 16, 32, 32)

      for (let i = 0; i < 900; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(0,255,10,0.07)' : 'rgba(0,196,10,0.07)'
        ctx.beginPath()
        ctx.arc(Math.random() * w, Math.random() * h, 0.7 + Math.random() * 1.8, 0, Math.PI * 2)
        ctx.fill()
      }
    },
    { srgb: false, wrap: THREE.ClampToEdgeWrapping },
  )

/** The underside legend. See the comment at its mesh for why this exists. */
const backTexture = () =>
  makeCanvasTexture(
    'board-back',
    128,
    48,
    (ctx, w, h) => {
      ctx.fillStyle = hex(PALETTE.solderMask)
      ctx.fillRect(0, 0, w, h)
      ctx.fillStyle = hex(PALETTE.silk)
      ctx.globalAlpha = 0.62
      ctx.font = 'bold 24px ui-monospace, monospace'
      ctx.textBaseline = 'middle'
      ctx.fillText('REV B', 16, h / 2)
      ctx.globalAlpha = 1
    },
    { wrap: THREE.ClampToEdgeWrapping },
  )

export function createBoard({ sfx = null, quality = 1 } = {}) {
  const group = new THREE.Group()
  const detail = (n) => Math.max(4, Math.round(n * (quality < 1 ? 0.7 : 1)))

  // Solder mask is matte. Left glossy it grows a specular lobe the width of
  // the whole board under a lamp this close, and the board goes from the
  // darkest thing on the desk to the brightest.
  // One canvas serving both channels, with roughness and metalness left at 1
  // so the map is the whole story rather than a modulation of a guess.
  const surface = boardSurfaceTexture()
  const maskMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: boardTexture(),
    roughnessMap: surface,
    metalnessMap: surface,
    roughness: 1,
    metalness: 1,
    vertexColors: true,
  })
  // Routed FR4, which is the one part of a board that is not green.
  const edgeMat = MAT.plastic(0x3b3f2c, 0.85)
  const blackPlastic = MAT.plastic(0x120f18, 0.84)
  const nylon = MAT.plastic(0x2b2833, 0.76)
  const goldPin = MAT.metal(0xb99a4e, 0.34)
  const tin = MAT.metal(PALETTE.brightMetal, 0.36)

  // --- the PCB --------------------------------------------------------------

  const shape = new THREE.Shape()
  {
    const r = 0.003
    const x0 = -BW / 2
    const x1 = BW / 2
    const y0 = -BD / 2
    const y1 = BD / 2
    shape.moveTo(x0 + r, y0)
    shape.lineTo(x1 - r, y0)
    shape.quadraticCurveTo(x1, y0, x1, y0 + r)
    shape.lineTo(x1, y1 - r)
    shape.quadraticCurveTo(x1, y1, x1 - r, y1)
    shape.lineTo(x0 + r, y1)
    shape.quadraticCurveTo(x0, y1, x0, y1 - r)
    shape.lineTo(x0, y0 + r)
    shape.quadraticCurveTo(x0, y0, x0 + r, y0)
    for (const [mx, mz] of MOUNT) {
      const hole = new THREE.Path()
      // Shape space is XY and the extrusion runs up Z, so the board's local z
      // arrives as -y. Every conversion in this file goes through that.
      hole.absarc(mx, -mz, 0.0014, 0, Math.PI * 2, true)
      shape.holes.push(hole)
    }
  }

  const pcbGeo = new THREE.ExtrudeGeometry(shape, {
    depth: BT,
    bevelEnabled: false,
    curveSegments: detail(6),
    steps: 1,
  })
  {
    // ExtrudeGeometry's world UV generator hands back raw shape coordinates,
    // which here are metres — so the artwork would tile a hundred times over
    // one board. Remap from the outline's own bounds instead.
    const pos = pcbGeo.attributes.position
    const uv = pcbGeo.attributes.uv
    for (let i = 0; i < uv.count; i++) {
      uv.setXY(i, (pos.getX(i) + BW / 2) / BW, (pos.getY(i) + BD / 2) / BD)
    }
    uv.needsUpdate = true
  }
  pcbGeo.rotateX(-Math.PI / 2)
  pcbGeo.translate(0, STAND, 0)
  ensureColors(pcbGeo)
  {
    // contactDarken measures against a plane and this whole slab sits at one
    // height, so the edge shading is done by hand off the outline instead.
    const pos = pcbGeo.attributes.position
    const col = pcbGeo.attributes.color
    for (let i = 0; i < pos.count; i++) {
      const ex = Math.max(0, 1 - (BW / 2 - Math.abs(pos.getX(i))) / 0.007)
      const ez = Math.max(0, 1 - (BD / 2 - Math.abs(pos.getZ(i))) / 0.007)
      const k = 1 - 0.32 * Math.max(ex, ez)
      col.setXYZ(i, k, k, k)
    }
    col.needsUpdate = true
  }
  const pcb = new THREE.Mesh(pcbGeo, [maskMat, edgeMat])
  pcb.castShadow = true
  pcb.receiveShadow = true
  group.add(pcb)

  // The back silkscreen. It says REV B because the panel was spun before the
  // schematic settled, and this board has been face-up on a desk ever since.
  // Two triangles aimed at the desktop that nobody will ever read; they are
  // here because the machine's own notes claim they are.
  const backMat = new THREE.MeshStandardMaterial({ map: backTexture(), roughness: 0.9, metalness: 0.04 })
  const back = new THREE.Mesh(new THREE.PlaneGeometry(0.034, 0.0128), backMat)
  back.rotation.x = Math.PI / 2
  back.position.set(-0.024, STAND - 0.0002, 0.0165)
  group.add(back)

  for (const [mx, mz] of MOUNT) {
    const foot = cyl(0.0024, 0.0026, STAND, nylon, detail(8))
    foot.position.set(mx, STAND / 2, mz)
    group.add(foot)
    contactDarken(foot, [DESK], { radius: 0.004, floor: 0.3 })
  }

  // --- the eight, and the one -----------------------------------------------

  const LED_OFF = new THREE.Color(0x2a1a0c)
  const LED_ON = new THREE.Color(PALETTE.amber).multiplyScalar(3.4)
  const PWR_OFF = new THREE.Color(0x0d1c20)
  const PWR_ON = new THREE.Color(PALETTE.cyan).multiplyScalar(2.4)

  const ledGeo = edgeDirt(new THREE.BoxGeometry(0.002, 0.001, 0.003), 0.12)
  const leds = []
  for (let i = 0; i < LED_N; i++) {
    const mat = new THREE.MeshBasicMaterial({ color: LED_OFF.clone(), toneMapped: true, fog: false })
    const mesh = new THREE.Mesh(ledGeo, mat)
    mesh.position.set(ledX(i), TOP + 0.0005, LED_Z)
    group.add(mesh)

    const glow = glowSprite(PALETTE.amber, 0.0034, { core: 0.9, mid: 0.3, halo: 0.07 })
    glow.position.set(ledX(i), TOP + 0.0012, LED_Z)
    glow.userData.setIntensity(0)
    group.add(glow)

    // No two parts off the same reel are the same brightness, and a row where
    // they are is the tell that the row is eight copies of one object.
    leds.push({ mat, glow, gain: 0.86 + Math.random() * 0.14 })
  }

  const pwrMat = new THREE.MeshBasicMaterial({ color: PWR_OFF.clone(), toneMapped: true, fog: false })
  const pwrLed = new THREE.Mesh(ledGeo, pwrMat)
  pwrLed.position.set(PWR.x, TOP + 0.0005, PWR.z)
  group.add(pwrLed)

  const pwrGlow = glowSprite(PALETTE.cyan, 0.0028, { core: 0.75, mid: 0.2, halo: 0.045 })
  pwrGlow.position.set(PWR.x, TOP + 0.0012, PWR.z)
  pwrGlow.userData.setIntensity(0)
  group.add(pwrGlow)

  // Nothing else on this half of the desk is amber below the lamp, so the row
  // gets a light of its own. Tiny range: it exists to put a bead of colour on
  // the solder mask, not to light the desk.
  const rowLight = new THREE.PointLight(PALETTE.amber, 0, 0.085, 2)
  rowLight.castShadow = false
  rowLight.position.set(0, TOP + 0.006, LED_Z + 0.004)
  group.add(rowLight)

  // --- the chip -------------------------------------------------------------

  const mcu = box(PART.mcu.w, 0.0011, PART.mcu.d, MAT.plastic(0x151318, 0.88), { dirt: 0.1 })
  mcu.position.set(PART.mcu.x, TOP + 0.00055, PART.mcu.z)
  group.add(mcu)

  const pinOne = cyl(0.0009, 0.0009, 0.0003, MAT.plastic(0x050409, 0.95), detail(8))
  pinOne.position.set(PART.mcu.x - 0.0042, TOP + 0.00105, PART.mcu.z - 0.0042)
  pinOne.castShadow = false
  group.add(pinOne)

  // --- the display ----------------------------------------------------------

  // The module is propped: a tall socket at the back edge, a short nylon
  // spacer at the front. Sat flat it faces the ceiling, and the person who
  // built this board does not sit on the ceiling.
  const TILT = 0.34
  const PIVOT_Z = PART.oled.z + PART.oled.d / 2
  const SPACER_H = 0.0028
  // Where the carrier's back edge ends up once it has been tipped about the
  // front one. The socket is sized to meet it rather than guessed at.
  const backLift = PART.oled.d * Math.sin(TILT)
  const backZ = PIVOT_Z - PART.oled.d * Math.cos(TILT)

  const socket = box(0.0112, SPACER_H + backLift, 0.0028, blackPlastic, { dirt: 0.14 })
  socket.position.set(PART.oled.x, TOP + (SPACER_H + backLift) / 2, backZ + 0.0004)
  group.add(socket)

  const spacer = box(0.006, SPACER_H, 0.0022, nylon, { dirt: 0.14 })
  spacer.position.set(PART.oled.x, TOP + SPACER_H / 2, PIVOT_Z - 0.0004)
  group.add(spacer)

  const display = new THREE.Group()
  display.position.set(PART.oled.x, TOP + SPACER_H, PIVOT_Z)
  display.rotation.x = TILT
  group.add(display)

  const carrier = box(PART.oled.w, 0.0012, PART.oled.d, MAT.plastic(0x18271f, 0.76), { dirt: 0.14 })
  carrier.position.set(0, 0.0006, -PART.oled.d / 2)
  display.add(carrier)

  const glass = box(0.0265, 0.0009, 0.0125, MAT.plastic(0x090810, 0.13), { dirt: 0.08 })
  glass.position.set(0, 0.00165, -PART.oled.d / 2)
  display.add(glass)

  const oledCanvas = document.createElement('canvas')
  oledCanvas.width = OLED_W
  oledCanvas.height = OLED_H
  const oledCtx = oledCanvas.getContext('2d')

  /**
   * The same lotus the operating system uses for its own mark: four petals on
   * the quarters, four behind them on the diagonals, then the centre. Nine
   * strokes, which is why the firmware draws it in nine steps.
   */
  const drawOled = (petals, wipe) => {
    if (!oledCtx) return
    const ctx = oledCtx
    ctx.setLineDash([])
    ctx.globalAlpha = 1
    ctx.fillStyle = '#04060a'
    ctx.fillRect(0, 0, OLED_W, OLED_H)
    if (petals > 0) {
      ctx.strokeStyle = '#bcd8ff'
      ctx.lineWidth = 1
      ctx.strokeRect(1.5, 1.5, OLED_W - 3, OLED_H - 3)

      const cx = OLED_W / 2
      const cy = OLED_H / 2
      const petal = (angle, len, wide) => {
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(angle)
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.quadraticCurveTo(-wide, -len * 0.55, 0, -len)
        ctx.quadraticCurveTo(wide, -len * 0.55, 0, 0)
        ctx.stroke()
        ctx.restore()
      }

      // A one-bit panel has no half tones, so the rank behind is dashed. That
      // is how it would actually be done on the hardware.
      ctx.lineWidth = 1.5
      ctx.setLineDash([2, 2])
      for (let i = 0; i < Math.min(4, petals); i++) petal(Math.PI / 4 + (i * Math.PI) / 2, 21, 7)
      ctx.setLineDash([])
      for (let i = 4; i < Math.min(8, petals); i++) petal(((i - 4) * Math.PI) / 2, 27, 9)
      if (petals >= PETALS) {
        ctx.fillStyle = '#bcd8ff'
        ctx.beginPath()
        ctx.arc(cx, cy, 3.2, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    if (wipe > 0) {
      ctx.fillStyle = '#04060a'
      ctx.fillRect(0, 0, OLED_W, Math.ceil(OLED_H * Math.min(1, wipe)))
    }
  }

  drawOled(0, 0)
  const oledTex = new THREE.CanvasTexture(oledCanvas)
  oledTex.colorSpace = THREE.SRGBColorSpace
  oledTex.anisotropy = 4
  // Additive, so the unlit pixels leave the black glass alone and the lit ones
  // read as light rather than as a printed picture of light.
  const oledMat = new THREE.MeshBasicMaterial({
    map: oledTex,
    color: 0xdcecff,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: true,
    fog: false,
  })
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.0226, 0.0113), oledMat)
  screen.rotation.x = -Math.PI / 2
  screen.position.set(0, 0.0022, -PART.oled.d / 2)
  screen.renderOrder = 2
  display.add(screen)

  const screenGlow = glowSprite(0x8fb4ff, 0.005, { core: 0.22, mid: 0.08, halo: 0.022 })
  screenGlow.position.set(0, 0.0031, -PART.oled.d / 2)
  screenGlow.userData.setIntensity(0)
  display.add(screenGlow)

  // --- power, connector, controls -------------------------------------------

  const usbShell = box(PART.usb.w, 0.0032, PART.usb.d, MAT.metal(PALETTE.aluminium, 0.34), { dirt: 0.12 })
  usbShell.position.set(PART.usb.x, TOP + 0.0016, PART.usb.z)
  group.add(usbShell)

  const usbTongue = box(0.0018, 0.0007, 0.0062, blackPlastic, { dirt: 0.05 })
  usbTongue.position.set(PART.usb.x + 0.0028, TOP + 0.0016, PART.usb.z)
  usbTongue.castShadow = false
  group.add(usbTongue)

  const reg = box(PART.reg.w, 0.0018, PART.reg.d, MAT.plastic(0x14121a, 0.86), { dirt: 0.12 })
  reg.position.set(PART.reg.x, TOP + 0.0009, PART.reg.z)
  group.add(reg)

  const regTab = box(0.005, 0.0004, 0.0016, tin, { dirt: 0.06 })
  regTab.position.set(PART.reg.x, TOP + 0.0002, PART.reg.z - 0.0025)
  regTab.castShadow = false
  group.add(regTab)

  const can = cyl(0.0033, 0.0033, 0.0072, MAT.plastic(0x1b1a24, 0.62), detail(10))
  can.position.set(PART.can.x, TOP + 0.0036, PART.can.z)
  group.add(can)

  const canTop = cyl(0.003, 0.003, 0.0004, MAT.metal(PALETTE.brightMetal, 0.4), detail(10))
  canTop.position.set(PART.can.x, TOP + 0.0074, PART.can.z)
  canTop.castShadow = false
  group.add(canTop)

  const buttonBase = box(PART.button.w, 0.002, PART.button.d, MAT.plastic(0x2b2833, 0.7), { dirt: 0.12 })
  buttonBase.position.set(PART.button.x, TOP + 0.001, PART.button.z)
  group.add(buttonBase)

  const plunger = cyl(0.0016, 0.0016, 0.0014, MAT.plastic(0x100e15, 0.8), detail(8))
  plunger.position.set(PART.button.x, TOP + 0.0027, PART.button.z)
  group.add(plunger)

  // Blue, because trimpots are blue, and turned to nothing in particular
  // because it is wired to nothing in particular.
  const trim = box(PART.trim.w, 0.0045, PART.trim.d, MAT.plastic(0x1e3070, 0.8), { dirt: 0.14 })
  trim.position.set(PART.trim.x, TOP + 0.00225, PART.trim.z)
  group.add(trim)

  const trimScrew = cyl(0.0021, 0.0021, 0.0006, MAT.metal(0x9a8f6e, 0.4), detail(8))
  trimScrew.position.set(PART.trim.x, TOP + 0.0047, PART.trim.z)
  trimScrew.castShadow = false
  group.add(trimScrew)

  const trimSlot = box(0.0034, 0.0003, 0.0006, MAT.plastic(0x0a0910, 0.66), { dirt: 0 })
  trimSlot.position.set(PART.trim.x, TOP + 0.0049, PART.trim.z)
  trimSlot.rotation.y = 0.62
  trimSlot.castShadow = false
  group.add(trimSlot)

  // --- headers --------------------------------------------------------------

  let pinCount = 0
  for (const hdr of HEADERS) pinCount += hdr.n

  const pinGeo = ensureColors(new THREE.CylinderGeometry(0.00055, 0.00055, 0.0062, detail(5)))
  const pins = new THREE.InstancedMesh(pinGeo, goldPin, pinCount)
  pins.castShadow = true
  {
    const m = new THREE.Matrix4()
    let i = 0
    for (const hdr of HEADERS) {
      const strip = box(
        hdr.dx * (hdr.n - 1) + 0.00254,
        0.0025,
        hdr.dz * (hdr.n - 1) + 0.00254,
        blackPlastic,
        { dirt: 0.16 },
      )
      strip.position.set(
        hdr.x + (hdr.dx * (hdr.n - 1)) / 2,
        TOP + 0.00125,
        hdr.z + (hdr.dz * (hdr.n - 1)) / 2,
      )
      group.add(strip)
      for (let k = 0; k < hdr.n; k++) {
        m.makeTranslation(hdr.x + hdr.dx * k, TOP + 0.0021, hdr.z + hdr.dz * k)
        pins.setMatrixAt(i++, m)
      }
    }
    pins.instanceMatrix.needsUpdate = true
  }
  group.add(pins)

  // --- passives -------------------------------------------------------------
  // Fourteen chip parts in one draw call. Individually invisible; collectively
  // the difference between a populated board and a green rectangle.

  const seats = []
  for (let i = 0; i < LED_N; i++) seats.push({ x: ledX(i), z: -0.0205, r: 0 })
  for (const [sx, sz, sr] of [
    [-0.0175, -0.0075, Math.PI / 2],
    [0.0055, -0.0075, Math.PI / 2],
    [-0.006, 0.0025, 0],
    [0.0215, -0.0165, 0.4],
    [0.0225, 0.0125, 0],
    [-0.0205, -0.0165, 0],
  ]) {
    seats.push({ x: sx, z: sz, r: sr })
  }

  const chipGeo = edgeDirt(new THREE.BoxGeometry(0.0016, 0.0006, 0.0009), 0.18)
  const passives = new THREE.InstancedMesh(chipGeo, MAT.plastic(0x14121a, 0.86), seats.length)
  passives.castShadow = true
  {
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const p = new THREE.Vector3()
    const s = new THREE.Vector3(1, 1, 1)
    const c = new THREE.Color()
    const up = new THREE.Vector3(0, 1, 0)
    seats.forEach((seat, i) => {
      q.setFromAxisAngle(up, seat.r)
      p.set(seat.x, TOP + 0.0003, seat.z)
      m.compose(p, q, s)
      passives.setMatrixAt(i, m)
      const k = 0.7 + Math.random() * 0.6
      c.setRGB(k, k * 0.96, k * 0.92)
      passives.setColorAt(i, c)
    })
    passives.instanceMatrix.needsUpdate = true
    passives.instanceColor.needsUpdate = true
  }
  group.add(passives)

  // --- the bodge ------------------------------------------------------------
  // Red, hand-stripped, and soldered to the top of a header pin rather than
  // through the hole, which is what you do when the header is already fitted.
  // It is the only red in the room and it is meant to read as an apology.

  const blob = (x, y, z) => {
    const mesh = new THREE.Mesh(ensureColors(new THREE.SphereGeometry(0.0009, 5, 4)), tin)
    mesh.scale.y = 0.6
    mesh.castShadow = true
    mesh.position.set(x, y, z)
    group.add(mesh)
  }
  blob(BODGE_FROM.x, TOP + 0.0004, BODGE_FROM.z)
  blob(BODGE_TO.x, TOP + 0.0046, BODGE_TO.z)

  group.add(
    cable(
      [
        [BODGE_FROM.x, TOP + 0.0006, BODGE_FROM.z],
        [BODGE_FROM.x - 0.0026, TOP + 0.0066, BODGE_FROM.z + 0.0076],
        [BODGE_FROM.x - 0.005, TOP + 0.0086, BODGE_FROM.z + 0.0176],
        [BODGE_TO.x - 0.0012, TOP + 0.0078, BODGE_TO.z - 0.0086],
        [BODGE_TO.x, TOP + 0.0046, BODGE_TO.z],
      ],
      { radius: 0.00055, color: 0x9c3a3a, segments: detail(18) },
    ),
  )

  // --- the lead to the monitor ----------------------------------------------

  const plug = box(0.0086, 0.0046, 0.011, MAT.rubber(0x1c1926), { dirt: 0.14 })
  plug.position.set(0.058, TOP + 0.0016, PART.usb.z)
  group.add(plug)

  const collar = box(0.0022, 0.0034, 0.0092, MAT.metal(PALETTE.aluminium, 0.36), { dirt: 0.1 })
  collar.position.set(0.0532, TOP + 0.0016, PART.usb.z)
  group.add(collar)

  const lead = cable(
    [
      [0.0625, TOP + 0.0016, 0.012],
      [0.08, 0.008, 0.006],
      [0.096, 0.0062, -0.008],
      [0.101, 0.0026, -0.027],
      [0.093, 0.002, -0.048],
      [0.108, 0.002, -0.07],
      [0.16, 0.002, -0.115],
      [0.23, 0.002, -0.22],
      [0.303, 0.002, -0.385],
    ],
    { radius: 0.0018, color: 0x181523, segments: detail(40) },
  )
  group.add(lead)
  contactDarken(lead, [DESK], { radius: 0.008, floor: 0.46 })

  // --- the hit box ----------------------------------------------------------

  const hit = new THREE.Mesh(
    new THREE.BoxGeometry(0.13, 0.05, 0.096),
    new THREE.MeshBasicMaterial({ visible: false }),
  )
  hit.position.set(0.002, 0.02, 0)
  group.add(hit)

  // --- state ----------------------------------------------------------------

  let awake = false
  let level = 0
  let settled = false
  let oledClock = 0
  let oledStep = 0
  let oledKey = null

  /**
   * Called with no argument it toggles, which is what a click wants. The
   * assembler can force a state by passing one.
   */
  const wake = (next = !awake) => {
    if (next === awake) return
    awake = next
    settled = false
    if (awake) {
      // Quiet. A micro coming out of reset, not a doorbell.
      sfx?.play('blip', { scale: 0.4 })
      oledClock = 0
      oledStep = 0
      oledKey = null
    }
  }

  /**
   * Where the head of the chase sits, in LED indices. It runs out slowly, holds
   * at the far end, and comes back quicker — a linear ping-pong reads as a
   * novelty light, and the firmware's own notes claim a kranok curve.
   */
  const chaseHead = (t) => {
    const u = (t % CHASE_PERIOD) / CHASE_PERIOD
    if (u < 0.44) return { head: smootherstep(u / 0.44) * (LED_N - 1), dir: 1 }
    if (u < 0.66) return { head: LED_N - 1, dir: 1 }
    return { head: (LED_N - 1) * (1 - smootherstep((u - 0.66) / 0.34)), dir: -1 }
  }

  // Quick up the leading edge, long decay behind it. A flame scroll has one
  // sharp side and one that runs on, and so does this.
  const flame = (d) => (d > 0 ? Math.exp(d * -6.5) : Math.exp(d * 1.15))

  const update = (dt, t) => {
    level = clamp01(level + (awake ? dt / WAKE_RAMP : -dt / SLEEP_RAMP))
    if (level === 0 && settled) return
    settled = level === 0

    const { head, dir } = chaseHead(t)
    let energy = 0
    for (let i = 0; i < LED_N; i++) {
      const led = leds[i]
      const b = level * led.gain * (0.03 + 0.97 * flame((i - head) * dir))
      energy += b
      led.mat.color.copy(LED_OFF).lerp(LED_ON, b)
      led.glow.userData.setIntensity(b)
    }
    rowLight.intensity = (energy / LED_N) * 0.9

    pwrMat.color.copy(PWR_OFF).lerp(PWR_ON, level)
    pwrGlow.userData.setIntensity(level * 0.85)
    screenGlow.userData.setIntensity(level * 0.7)
    oledMat.opacity = level

    if (level > 0.02) {
      // Eleven frames a second. An SPI panel this size cannot do much better
      // and a canvas upload every frame would be sixty times the cost of one.
      oledClock += dt
      const step = 1 / OLED_FPS
      if (oledClock >= step) {
        oledStep += Math.floor(oledClock / step)
        oledClock %= step
      }
      const s = oledStep % CYCLE
      const petals = s < DRAW_END ? Math.min(PETALS, Math.floor(s / PER_PETAL) + 1) : PETALS
      const wipeStep = s < HOLD_END ? 0 : s - HOLD_END + 1
      const key = `${petals}:${wipeStep}`
      if (key !== oledKey) {
        oledKey = key
        drawOled(petals, wipeStep / WIPE_TICKS)
        oledTex.needsUpdate = true
      }
    } else if (oledKey !== null) {
      oledKey = null
      drawOled(0, 0)
      oledTex.needsUpdate = true
    }
  }

  update(0, 0)

  return {
    group,
    update,
    wake,
    get isAwake() {
      return awake
    },
    interactives: [
      {
        object: hit,
        label: 'Board, rev C',
        hint: () => (awake ? 'Put it back to sleep' : 'Wake it'),
        onClick: () => wake(),
      },
    ],
    dispose() {
      // Only what this module owns outright; the shared bench is the
      // assembler's to clear.
      oledTex.dispose()
      oledMat.dispose()
      maskMat.dispose()
      backMat.dispose()
      pwrMat.dispose()
      for (const led of leds) led.mat.dispose()
    },
  }
}
