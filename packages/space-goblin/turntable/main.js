import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { createGoblin } from '../src/character.js'
import { createEnvironment } from '../src/env.js'
import { FORWARD, BACKWARD, UP, LEFT } from '../src/convention.js'
import { frame, frameQuaternion, handGripSocket, forearmStrapSocket, socketError } from '../src/attach.js'

// ---------------------------------------------------------------------------
// Rig turntable
//
// The same character as the main scene, on a neutral stage. This started life
// as a dev tool and is shipped because it is the honest view: judging a figure
// inside a dark, fogged, backlit environment judges two things at once, and
// half of what is interesting here — the skeleton, the clips, the way the kit
// trails the run — is invisible at distance.
//
// The DEBUG row exists because of two bugs that a render *could* have shown and
// didn't. The world scrolled the wrong way for the entire first version, and
// nobody caught it from screenshots because a still frame of a symmetric-ish
// stage does not say which way is +Z. The cleaver sat 104.7° off the hand's grip
// axis, and nobody caught that either, because a fist and a handle overlap in
// silhouette from almost every angle. Both are trivially visible once the frame
// carries a compass and once sockets are drawn next to the plugs that are
// supposed to be seated in them. So: draw them, and put the numbers on screen.
// ---------------------------------------------------------------------------

const app = document.getElementById('app')
const boot = document.getElementById('boot')
const bootStep = document.getElementById('boot-step')
const bootFill = document.getElementById('boot-fill')

// ---- renderer / stage -----------------------------------------------------

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.0
renderer.outputColorSpace = THREE.SRGBColorSpace
app.appendChild(renderer.domElement)

const scene = new THREE.Scene()
scene.background = new THREE.Color('#15171c')
scene.fog = new THREE.Fog('#15171c', 4.5, 11)

const camera = new THREE.PerspectiveCamera(34, 1, 0.02, 60)
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.08
controls.minDistance = 0.35
controls.maxDistance = 6
controls.enablePan = false

// Neutral three-point rig: warm key, cool fill, warm rim.
scene.add(new THREE.HemisphereLight('#cfe3ff', '#2a2119', 0.75))
const key = new THREE.DirectionalLight('#fff2e0', 3.0)
key.position.set(2.5, 3.4, 3.0)
key.castShadow = true
key.shadow.mapSize.set(2048, 2048)
key.shadow.camera.top = 1.7
key.shadow.camera.bottom = -0.3
key.shadow.camera.left = -1.4
key.shadow.camera.right = 1.4
key.shadow.bias = -0.0006
key.shadow.radius = 3
scene.add(key)
const fill = new THREE.DirectionalLight('#9fd0ff', 1.15)
fill.position.set(-3, 1.6, 1.5)
scene.add(fill)
const rim = new THREE.DirectionalLight('#ffcf9a', 2.1)
rim.position.set(-1.2, 2.2, -3.4)
scene.add(rim)

// A shadow-catching disc, and a grid so the scale stays legible.
const floor = new THREE.Mesh(
  new THREE.CircleGeometry(3.2, 64),
  new THREE.MeshStandardMaterial({ color: '#33343a', roughness: 1, metalness: 0 }),
)
floor.rotation.x = -Math.PI / 2
floor.receiveShadow = true
scene.add(floor)

const grid = new THREE.GridHelper(3.2, 16, 0x4a5058, 0x2c3036)
grid.position.y = 0.001
grid.material.transparent = true
grid.material.opacity = 0.5
scene.add(grid)

// ---------------------------------------------------------------------------
// Debug drawing primitives
// ---------------------------------------------------------------------------

const FONT = '"Segoe UI", system-ui, -apple-system, sans-serif'

/**
 * A screen-space-sized text label. `sizeAttenuation: false` keeps it the same
 * number of pixels whether you are looking at the whole figure or one knuckle,
 * which is the only way a 5 cm socket label stays readable.
 *
 * @param {string} text
 * @param {string} color
 * @param {[number, number]} [anchor] sprite centre; [0.5, -0.9] floats it above
 *                                    the point, [0.5, 1.9] hangs it below.
 */
function makeLabel(text, color, anchor = [0.5, -0.9]) {
  const px = 30
  const font = `700 ${px}px ${FONT}`
  const canvas = document.createElement('canvas')
  let g = canvas.getContext('2d')
  g.font = font
  if ('letterSpacing' in g) g.letterSpacing = '3px'
  canvas.width = Math.ceil(g.measureText(text).width) + 26
  canvas.height = px + 20
  // Resizing resets the context, so everything has to be set again.
  g = canvas.getContext('2d')
  g.font = font
  if ('letterSpacing' in g) g.letterSpacing = '3px'
  g.fillStyle = 'rgba(8, 11, 16, 0.82)'
  g.beginPath()
  g.roundRect(1, 1, canvas.width - 2, canvas.height - 2, 9)
  g.fill()
  g.strokeStyle = color
  g.lineWidth = 2
  g.stroke()
  g.fillStyle = color
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.fillText(text, canvas.width / 2 + 1.5, canvas.height / 2 + 1)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: texture,
      sizeAttenuation: false,
      depthTest: false,
      depthWrite: false,
      transparent: true,
      fog: false,
    }),
  )
  const h = 0.0125
  sprite.scale.set((h * canvas.width) / canvas.height, h, 1)
  sprite.center.set(anchor[0], anchor[1])
  sprite.renderOrder = 1002
  return sprite
}

// +X = axis, +Y = normal, +Z = their cross. Built through THREE.Color so the
// working-space conversion matches every other colour on screen.
const TRIAD_COLORS = (() => {
  const out = new Float32Array(18)
  const c = new THREE.Color()
  const hex = ['#ff4d4d', '#3dff6b', '#4d8cff']
  for (let i = 0; i < 3; i++) {
    c.set(hex[i])
    for (let k = 0; k < 2; k++) c.toArray(out, i * 6 + k * 3)
  }
  return out
})()

/**
 * An RGB triad at true model scale, drawn on top of everything.
 *
 * Read it as: red is the frame's `axis` (the line a held rod lies along), green
 * is its `normal` (which way the palm faces / the edge points), blue is the
 * cross of the two. A seated plug's triad sits exactly inside its socket's; any
 * daylight between the two red arms *is* the attachment error.
 */
function makeTriad(length, label, color, anchor) {
  const group = new THREE.Group()
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(
      // prettier-ignore
      new Float32Array([
        0, 0, 0, length, 0, 0,
        0, 0, 0, 0, length, 0,
        0, 0, 0, 0, 0, length,
      ]),
      3,
    ),
  )
  geometry.setAttribute('color', new THREE.BufferAttribute(TRIAD_COLORS.slice(), 3))
  const lines = new THREE.LineSegments(
    geometry,
    new THREE.LineBasicMaterial({ vertexColors: true, depthTest: false, transparent: true, fog: false }),
  )
  lines.renderOrder = 1000
  group.add(lines)

  const dot = new THREE.Mesh(
    new THREE.SphereGeometry(length * 0.075, 10, 8),
    new THREE.MeshBasicMaterial({ color, depthTest: false, transparent: true, fog: false }),
  )
  dot.renderOrder = 1001
  group.add(dot)
  group.add(makeLabel(label, color, anchor))
  return group
}

// ---- build ----------------------------------------------------------------

const step = (label, fraction) =>
  new Promise((resolve) => {
    bootStep.textContent = label
    bootFill.style.width = `${Math.round(fraction * 100)}%`
    requestAnimationFrame(() => requestAnimationFrame(resolve))
  })

let goblin
let rigHelper
let axesGroup

// Enough bones to read the rig's conventions without turning the model into a
// hedgehog: red = X, green = Y, blue = Z, and every one of them is world-
// aligned in the bind pose.
const AXIS_BONES = [
  'hips', 'chest', 'head', 'jaw',
  'upperarmL', 'forearmL', 'handL', 'upperarmR', 'forearmR', 'handR',
  'thighL', 'shinL', 'footL', 'thighR', 'shinR', 'footR',
  'earL1', 'earR1', 'tail2',
]

// ---- sockets --------------------------------------------------------------

// The rig's own frames, drawn whether or not anything is seated in them. These
// are the three the retrospective asked for by name; the empty left grip is the
// control that says what a *correct* triad looks like on this figure.
const RIG_SOCKETS = [
  ['GRIP L', 'handL', () => handGripSocket('L')],
  ['GRIP R', 'handR', () => handGripSocket('R')],
  ['STRAP L', 'forearmL', () => forearmStrapSocket('L')],
]

// Fallback for a build of character.js that still hangs its weapons off a
// hand-typed euler triple instead of publishing a mount. Kept deliberately:
// this overlay has to be able to *show* the old bug, or it is only a picture of
// today's code being right.
const LEGACY_PLUG = frame([0, 0, 0], [0, 1, 0], [0, 0, 1], 'plug')
const LEGACY_SOCKETS = {
  cleaver: () => handGripSocket('R', { gripRadius: 0.0122 }),
  buckler: () => forearmStrapSocket('L'),
}

/**
 * The frame a `trim` actually asks the plug to land in. `mate` slides and lifts
 * the origin and spins the whole thing about the socket axis by `roll`, so a
 * check against the raw socket reads every deliberate millimetre and degree of
 * trim as error — which is worse than useless, because it puts a number on
 * screen that is large and *correct*, and teaches you to ignore it.
 *
 * (Rolling about the axis leaves the axis alone, so only the normal moves.)
 */
function trimmedSocket(socket, { roll = 0, slide = 0, lift = 0 } = {}) {
  const normal = socket.normal.clone()
  if (roll) normal.applyAxisAngle(socket.axis, roll)
  return frame(
    socket.origin.clone().addScaledVector(socket.axis, slide).addScaledVector(socket.normal, lift),
    socket.axis,
    normal,
    socket.label,
  )
}

/** Every triad, socket and plug alike — the SOCKETS toggle walks this list. */
const socketNodes = []
/** Weapons whose holder can be checked against a socket. */
const checked = []
let errorLines = null

function addTriad(parent, f, length, label, color, anchor) {
  const node = makeTriad(length, label, color, anchor)
  node.position.copy(f.origin)
  node.quaternion.copy(frameQuaternion(f))
  node.visible = false
  parent.add(node)
  socketNodes.push(node)
  return node
}

function buildSockets() {
  // Three label tiers, so a seat and the plug sitting exactly on top of it are
  // still two readable captions: SEAT above the point, PLUG below it, and the
  // rig's own socket further below again.
  for (const [label, boneName, make] of RIG_SOCKETS) {
    const bone = goblin.byName[boneName]
    if (bone) addTriad(bone, make(), 0.09, label, '#48e8ff', [0.5, 3.4])
  }

  for (const [name, weapon] of Object.entries(goblin.weapons || {})) {
    const holder = weapon.holder
    if (!holder) continue
    const upper = name.toUpperCase()

    // Read the mount the character publishes rather than re-deriving one here.
    // A second copy of "where the cleaver goes" in the debug overlay is how a
    // debug overlay starts lying: it would agree with itself and disagree with
    // the model.
    const mount = weapon.mount
    const plug = mount?.plug ?? LEGACY_PLUG
    const socket = mount
      ? trimmedSocket(mount.socket, mount.trim)
      : LEGACY_SOCKETS[name]?.()
    const bone = mount ? goblin.byName[mount.bone] : holder.parent

    // The plug triad is a child of the holder, so it goes exactly where the
    // weapon goes and the two cannot drift apart.
    const plugNode = addTriad(holder, plug, 0.055, `PLUG ${upper}`, '#ff3ce0', [0.5, 1.9])
    if (!socket || !bone) continue
    const socketNode = addTriad(bone, socket, 0.075, `SEAT ${upper}`, '#ffb84d', [0.5, -1.1])
    checked.push({ name, holder, plug, socket, plugNode, socketNode })
  }

  // One magenta segment per checked weapon, socket origin -> plug origin, in
  // world space. Zero length when mated; a visible bar when not.
  errorLines = new THREE.LineSegments(
    new THREE.BufferGeometry().setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(checked.length * 6), 3),
    ),
    new THREE.LineBasicMaterial({ color: '#ff3ce0', depthTest: false, transparent: true, fog: false }),
  )
  errorLines.frustumCulled = false
  errorLines.renderOrder = 1000
  errorLines.visible = false
  scene.add(errorLines)
}

const _p0 = new THREE.Vector3()
const _p1 = new THREE.Vector3()
let readoutKey = ''

/**
 * How far every weapon is from the seat it claims. Measured from the holder's
 * live transform, not from the mount's own bookkeeping — this has to fail if
 * somebody nudges a holder by hand.
 *
 * Exposed on `window.spaceGoblin.debug` so a headless check can assert on the
 * numbers instead of squinting at a render, which is the entire moral of the
 * bug that put this overlay here.
 */
function socketErrors() {
  return checked.map((s) => {
    const e = socketError(s.socket, s.plug, {
      position: s.holder.position,
      quaternion: s.holder.quaternion,
    })
    return {
      name: s.name,
      axisDeg: e.axisDeg,
      rollDeg: e.rollDeg,
      offsetMm: e.offset * 1000,
    }
  })
}

function updateSockets() {
  const pos = errorLines.geometry.attributes.position
  for (let i = 0; i < checked.length; i++) {
    checked[i].socketNode.getWorldPosition(_p0)
    checked[i].plugNode.getWorldPosition(_p1)
    pos.setXYZ(i * 2, _p0.x, _p0.y, _p0.z)
    pos.setXYZ(i * 2 + 1, _p1.x, _p1.y, _p1.z)
  }
  pos.needsUpdate = true

  // Rewrite the panel only when a number actually changes. The first version of
  // this throttled on elapsed time instead, and a stale readout sat there
  // saying 0.0 while the overlay it belonged to was drawing a 75° miss — a
  // diagnostic that lies is worse than none, so the condition is now the thing
  // we actually care about rather than a proxy for it.
  let html = ''
  let key = ''
  for (const e of socketErrors()) {
    const cls = e.axisDeg > 1 || e.rollDeg > 1 || e.offsetMm > 1 ? 'bad' : 'ok'
    key += `${e.axisDeg.toFixed(1)}/${e.rollDeg.toFixed(1)}/${e.offsetMm.toFixed(1)};`
    html +=
      `<div class="line ${cls}"><span>${e.name} axis</span><b>${e.axisDeg.toFixed(1)}\u00b0</b></div>` +
      `<div class="line ${cls}"><span>roll</span><b>${e.rollDeg.toFixed(1)}\u00b0</b></div>` +
      `<div class="line ${cls}"><span>offset</span><b>${e.offsetMm.toFixed(1)} mm</b></div>`
  }
  if (key === readoutKey) return
  readoutKey = key
  dbgSockets.innerHTML = `<section><h2>SEAT &#8646; PLUG</h2>${html}</section>`
}

// ---- trails ---------------------------------------------------------------

// 2 s at 60 Hz. Everything below is sized off these two numbers once, at boot,
// and nothing allocates per frame.
const TRAIL_SECONDS = 2
const TRAIL_HZ = 60
const TRAIL_CAP = TRAIL_SECONDS * TRAIL_HZ
const TRAIL_SEGS = TRAIL_CAP - 1

const TRAIL_DEFS = [
  { key: 'toeTipL', label: 'TOE L', color: '#ff8a3d' },
  { key: 'toeTipR', label: 'TOE R', color: '#ffd83d' },
  { key: 'heelL', label: 'HEEL L', color: '#a78bff' },
  { key: 'heelR', label: 'HEEL R', color: '#4d9dff' },
  { key: 'cleaverTip', label: 'CLEAVER TIP', color: '#ff5d7a' },
  { key: 'hips', label: 'HIPS', color: '#8affc1' },
]

const trailsGroup = new THREE.Group()
trailsGroup.visible = false
scene.add(trailsGroup)

/** @type {{def:object, node:THREE.Object3D, buf:Float32Array, n:number, head:number, rgb:THREE.Color}[]} */
const trails = []
let trailLines = null
let trailDots = null
let trailAccum = 0

function buildTrails() {
  const nodes = { ...goblin.byName }
  // The cleaver tip is not a bone. Find the real tip — the highest vertex along
  // the weapon's own +Y, which is where weapons.js says the business end goes —
  // and park a marker there so the trail tracks the blade and not the fist.
  const cleaver = goblin.weapons?.cleaver?.holder
  if (cleaver) {
    const marker = new THREE.Object3D()
    marker.position.copy(highestLocalPoint(cleaver))
    cleaver.add(marker)
    nodes.cleaverTip = marker
  }

  for (const def of TRAIL_DEFS) {
    const node = nodes[def.key]
    if (!node) continue
    trails.push({
      def,
      node,
      buf: new Float32Array(TRAIL_CAP * 3),
      n: 0,
      head: 0,
      rgb: new THREE.Color(def.color),
    })
  }

  const segVerts = trails.length * TRAIL_SEGS * 2
  const lineGeo = new THREE.BufferGeometry()
  lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(segVerts * 3), 3))
  lineGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(segVerts * 3), 3))
  lineGeo.setDrawRange(0, 0)
  trailLines = new THREE.LineSegments(
    lineGeo,
    new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, depthTest: false, fog: false }),
  )
  trailLines.frustumCulled = false
  trailLines.renderOrder = 999
  trailsGroup.add(trailLines)

  // One dot per sample on top of the line. A 1 px polyline says where the foot
  // went; evenly spaced dots also say how *fast*, which is the half of "a
  // straight line travelling at a steady rate" a bare line cannot show.
  const dotVerts = trails.length * TRAIL_CAP
  const dotGeo = new THREE.BufferGeometry()
  dotGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(dotVerts * 3), 3))
  dotGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(dotVerts * 3), 3))
  dotGeo.setDrawRange(0, 0)
  trailDots = new THREE.Points(
    dotGeo,
    new THREE.PointsMaterial({
      size: 3.6,
      sizeAttenuation: false,
      vertexColors: true,
      transparent: true,
      depthTest: false,
      fog: false,
    }),
  )
  trailDots.frustumCulled = false
  trailDots.renderOrder = 999
  trailsGroup.add(trailDots)

  // The reference the trails are read against, at hip height beside him so it
  // survives every camera preset — at floor level it projected below the bottom
  // of the frame from half of them. A planted foot travels BACKWARD under a
  // body advancing FORWARD; a toe trail running the same way as the cyan arrow
  // is a moonwalk.
  trailsGroup.add(directionArrow(FORWARD, '#48e8ff', 'FORWARD +Z', 0.3))
  trailsGroup.add(directionArrow(BACKWARD, '#9aa7b0', 'PLANTED FOOT −Z', 0.3))

  const legend = TRAIL_DEFS.filter((d) => trails.some((t) => t.def === d))
    .map(
      (d) =>
        `<div class="line"><span>${d.label}</span><b><i class="swatch" style="background:${d.color}"></i></b></div>`,
    )
    .join('')
  dbgTrails.innerHTML = `<section><h2>TRAILS · LAST ${TRAIL_SECONDS} S</h2>${legend}</section>`
}

/** The vertex furthest along +Y in `root`'s own space. */
function highestLocalPoint(root) {
  root.updateMatrixWorld(true)
  const toLocal = new THREE.Matrix4().copy(root.matrixWorld).invert()
  const m = new THREE.Matrix4()
  const v = new THREE.Vector3()
  const best = new THREE.Vector3(0, 0, 0)
  let bestY = -Infinity
  root.traverse((o) => {
    if (!o.isMesh || !o.geometry?.attributes?.position) return
    m.multiplyMatrices(toLocal, o.matrixWorld)
    const p = o.geometry.attributes.position
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i).applyMatrix4(m)
      if (v.y > bestY) {
        bestY = v.y
        best.copy(v)
      }
    }
  })
  return best
}

/** A labelled arrow lying on the floor, out to one side of the figure. */
function directionArrow(dir, color, label, length) {
  // Out on the goblin's left (+X) at roughly the height the presets all aim at,
  // so it lands in frame from every one of them.
  const origin = new THREE.Vector3(0.6, 0.6, 0)
  const group = new THREE.Group()
  const arrow = new THREE.ArrowHelper(dir, origin, length, color, 0.07, 0.036)
  for (const m of [arrow.line.material, arrow.cone.material]) {
    m.depthTest = false
    m.transparent = true
    m.fog = false
  }
  arrow.line.renderOrder = 999
  arrow.cone.renderOrder = 999
  group.add(arrow)
  // The label hangs off the group, not off the arrow: an ArrowHelper rotates
  // itself to point along `dir`, and a child would be dragged round with it.
  const tag = makeLabel(label, color, [0.5, -1.0])
  tag.position.copy(origin).addScaledVector(dir, length)
  group.add(tag)
  return group
}

const _w = new THREE.Vector3()

function sampleTrails(dt) {
  trailAccum += dt
  if (trailAccum < 1 / TRAIL_HZ) return false
  trailAccum = 0
  for (const t of trails) {
    t.node.getWorldPosition(_w)
    t.buf[t.head * 3] = _w.x
    t.buf[t.head * 3 + 1] = _w.y
    t.buf[t.head * 3 + 2] = _w.z
    t.head = (t.head + 1) % TRAIL_CAP
    if (t.n < TRAIL_CAP) t.n++
  }
  return true
}

function writeTrailGeometry() {
  const pos = trailLines.geometry.attributes.position.array
  const col = trailLines.geometry.attributes.color.array
  const dpos = trailDots.geometry.attributes.position.array
  const dcol = trailDots.geometry.attributes.color.array
  let w = 0
  let d = 0
  for (const t of trails) {
    const { buf, n, head, rgb } = t
    let prev = -1
    for (let k = 0; k < n; k++) {
      const i = ((head - n + k + 2 * TRAIL_CAP) % TRAIL_CAP) * 3
      // Fade towards the tail, so the direction of travel is readable from a
      // still frame: the bright end is now.
      const f = 0.3 + (0.7 * k) / n
      dpos[d] = buf[i]; dpos[d + 1] = buf[i + 1]; dpos[d + 2] = buf[i + 2]
      dcol[d] = rgb.r * f; dcol[d + 1] = rgb.g * f; dcol[d + 2] = rgb.b * f
      d += 3
      if (prev >= 0) {
        pos[w] = buf[prev]; pos[w + 1] = buf[prev + 1]; pos[w + 2] = buf[prev + 2]
        pos[w + 3] = buf[i]; pos[w + 4] = buf[i + 1]; pos[w + 5] = buf[i + 2]
        col[w] = rgb.r * f; col[w + 1] = rgb.g * f; col[w + 2] = rgb.b * f
        col[w + 3] = rgb.r * f; col[w + 4] = rgb.g * f; col[w + 5] = rgb.b * f
        w += 6
      }
      prev = i
    }
  }
  trailLines.geometry.setDrawRange(0, w / 3)
  trailLines.geometry.attributes.position.needsUpdate = true
  trailLines.geometry.attributes.color.needsUpdate = true
  trailDots.geometry.setDrawRange(0, d / 3)
  trailDots.geometry.attributes.position.needsUpdate = true
  trailDots.geometry.attributes.color.needsUpdate = true
}

function clearTrails() {
  for (const t of trails) {
    t.n = 0
    t.head = 0
  }
  trailAccum = 0
  if (trailLines) trailLines.geometry.setDrawRange(0, 0)
  if (trailDots) trailDots.geometry.setDrawRange(0, 0)
}

// ---- ground plane ---------------------------------------------------------

// Not a toggle. Four world-position reads a frame is free, and the last time a
// foot went through the floor it was found by hand-sampling bone positions in a
// throwaway script — which is exactly the kind of check that should never have
// to be written twice.
const FLOOR_PROBES = {
  L: ['toeTipL', 'heelL'],
  R: ['toeTipR', 'heelR'],
}
const floorMin = { L: Infinity, R: Infinity }
const floorProbeNodes = { L: [], R: [] }
const floorOut = { L: document.getElementById('s-floorL'), R: document.getElementById('s-floorR') }

function updateFloor() {
  for (const side of ['L', 'R']) {
    let min = floorMin[side]
    for (const node of floorProbeNodes[side]) {
      node.getWorldPosition(_w)
      if (_w.y < min) min = _w.y
    }
    if (min !== floorMin[side]) {
      floorMin[side] = min
      const dd = floorOut[side]
      dd.textContent = `${(min * 1000).toFixed(1)} mm`
      dd.classList.toggle('bad', min < -0.002)
    }
  }
}

function resetFloor() {
  floorMin.L = Infinity
  floorMin.R = Infinity
  floorOut.L.textContent = '—'
  floorOut.R.textContent = '—'
  floorOut.L.classList.remove('bad')
  floorOut.R.classList.remove('bad')
}

// ---- compass --------------------------------------------------------------

const compass = document.getElementById('compass')
const cctx = compass.getContext('2d')
const COMPASS_W = 208
const COMPASS_H = 220
const dbgSockets = document.getElementById('dbg-sockets')
const dbgTrails = document.getElementById('dbg-trails')

function sizeCompass() {
  const dpr = Math.min(window.devicePixelRatio, 2)
  compass.width = COMPASS_W * dpr
  compass.height = COMPASS_H * dpr
  compass.style.width = `${COMPASS_W}px`
  compass.style.height = `${COMPASS_H}px`
  cctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}

const _dir = new THREE.Vector3()

/** A world direction in view space: +x right, +y up, +z out of the screen. */
function viewDir(v) {
  return _dir.copy(v).transformDirection(camera.matrixWorldInverse)
}

const COMPASS_AXES = [
  { v: new THREE.Vector3(-1, 0, 0), color: '#7c3f3f', label: '' },
  { v: new THREE.Vector3(0, 0, -1), color: '#2f5570', label: '' },
  { v: new THREE.Vector3(1, 0, 0), color: '#ff6b6b', label: '+X' },
  { v: new THREE.Vector3(0, 1, 0), color: '#7dff9b', label: '+Y' },
  { v: new THREE.Vector3(0, 0, 1), color: '#6bb8ff', label: '+Z' },
]

function drawCompass() {
  const cx = COMPASS_W / 2
  const cy = 82
  const R = 46
  cctx.clearRect(0, 0, COMPASS_W, COMPASS_H)

  cctx.fillStyle = 'rgba(12, 16, 22, 0.62)'
  cctx.strokeStyle = 'rgba(231, 240, 234, 0.16)'
  cctx.lineWidth = 1
  cctx.beginPath()
  cctx.roundRect(0.5, 0.5, COMPASS_W - 1, COMPASS_H - 1, 13)
  cctx.fill()
  cctx.stroke()

  cctx.fillStyle = '#48e8ff'
  cctx.font = `700 9px ${FONT}`
  if ('letterSpacing' in cctx) cctx.letterSpacing = '2.2px'
  cctx.textAlign = 'center'
  cctx.textBaseline = 'middle'
  cctx.fillText('AXIS COMPASS', cx, 17)

  cctx.strokeStyle = 'rgba(231, 240, 234, 0.1)'
  cctx.beginPath()
  cctx.arc(cx, cy, R, 0, Math.PI * 2)
  cctx.stroke()

  // Depth-sort so an axis pointing at the camera draws over one pointing away.
  const spokes = COMPASS_AXES.map((a) => {
    const d = viewDir(a.v)
    return { ...a, x: d.x, y: -d.y, z: d.z }
  }).sort((p, q) => p.z - q.z)

  cctx.font = `700 10px ${FONT}`
  if ('letterSpacing' in cctx) cctx.letterSpacing = '1px'
  for (const s of spokes) {
    // The spoke length is the honest projected length, so an axis pointing at
    // the camera is short — that foreshortening is information.
    const r = s.label ? R * 0.76 : R * 0.4
    const ex = cx + s.x * r
    const ey = cy + s.y * r
    cctx.strokeStyle = s.color
    cctx.lineWidth = s.label ? 2 : 1.4
    cctx.beginPath()
    cctx.moveTo(cx, cy)
    cctx.lineTo(ex, ey)
    cctx.stroke()
    if (!s.label) continue
    // Filled tip = coming towards you, hollow = going away. A foreshortened
    // spoke on its own cannot tell you which.
    cctx.beginPath()
    cctx.arc(ex, ey, s.z >= 0 ? 3 : 2.6, 0, Math.PI * 2)
    if (s.z >= 0) {
      cctx.fillStyle = s.color
      cctx.fill()
    } else {
      cctx.strokeStyle = s.color
      cctx.lineWidth = 1.6
      cctx.stroke()
    }
    // The label sits on a ring of its own, outside the FORWARD chevron, so it
    // stays readable even when the spoke it belongs to has collapsed to a few
    // pixels. An axis pointing straight at the camera has no meaningful screen
    // direction at all, so its label tucks in beside the hub instead of being
    // flung out along a direction that is mostly rounding error.
    const flat = Math.hypot(s.x, s.y)
    const w = cctx.measureText(s.label).width
    let lx = cx + 15
    let ly = cy + 15
    if (flat >= 0.15) {
      lx = cx + (s.x / flat) * R * 1.32
      ly = cy + (s.y / flat) * R * 1.32
    }
    cctx.fillStyle = s.color
    cctx.fillText(
      s.label,
      Math.max(w / 2 + 5, Math.min(COMPASS_W - w / 2 - 5, lx)),
      Math.max(31, Math.min(cy + R + 8, ly)),
    )
  }

  // FORWARD, read straight off convention.js rather than a hand-typed +Z that
  // could drift away from it. Drawn as a chevron just *outside* the dial so it
  // rides on top of the +Z spoke without hiding it — the two coinciding is the
  // whole message.
  const f = viewDir(FORWARD)
  const fx = f.x
  const fy = -f.y
  const flat = Math.hypot(fx, fy)
  cctx.fillStyle = '#48e8ff'
  if (flat > 0.2) {
    const a = Math.atan2(fy, fx)
    const tip = R * 1.0
    const ex = cx + Math.cos(a) * tip
    const ey = cy + Math.sin(a) * tip
    cctx.strokeStyle = '#48e8ff'
    cctx.lineWidth = 2.4
    cctx.beginPath()
    cctx.moveTo(cx + Math.cos(a) * R * 0.82, cy + Math.sin(a) * R * 0.82)
    cctx.lineTo(ex, ey)
    cctx.stroke()
    cctx.beginPath()
    cctx.moveTo(ex + Math.cos(a) * 8, ey + Math.sin(a) * 8)
    cctx.lineTo(ex + Math.cos(a + 2.5) * 7, ey + Math.sin(a + 2.5) * 7)
    cctx.lineTo(ex + Math.cos(a - 2.5) * 7, ey + Math.sin(a - 2.5) * 7)
    cctx.closePath()
    cctx.fill()
  } else {
    // Head-on: a ring for "towards you", a dot for "away".
    cctx.beginPath()
    cctx.arc(cx, cy, 6, 0, Math.PI * 2)
    if (f.z >= 0) {
      cctx.strokeStyle = '#48e8ff'
      cctx.lineWidth = 2.4
      cctx.stroke()
    } else {
      cctx.fill()
    }
  }

  // The four lines that make a PNG self-describing. Nobody should ever again
  // have to derive which side of the frame the goblin's left hand is on.
  const left = viewDir(LEFT).clone()
  const fwd = viewDir(FORWARD).clone()
  const up = viewDir(UP).clone()
  const lines = [
    ['VIEW', viewLabel(), '#48e8ff'],
    ['FWD +Z', axisWord(fwd), '#e7f0ea'],
    ['LEFT +X', axisWord(left), '#e7f0ea'],
    ['UP +Y', axisWord(up), '#e7f0ea'],
  ]
  let y = 147
  for (const [k, v, c] of lines) {
    cctx.textAlign = 'left'
    cctx.fillStyle = '#7f9089'
    cctx.font = `600 9px ${FONT}`
    if ('letterSpacing' in cctx) cctx.letterSpacing = '0.6px'
    cctx.fillText(k, 12, y)
    cctx.textAlign = 'right'
    cctx.fillStyle = c
    cctx.font = `700 9px ${FONT}`
    cctx.fillText(v, COMPASS_W - 12, y)
    y += 17
  }
}

/**
 * Where a world direction points on screen, in words. This is the whole reason
 * the compass exists: nobody should ever again have to reason from a silhouette
 * about whether screen-left is the goblin's left.
 */
function axisWord(d) {
  const flat = Math.hypot(d.x, d.y)
  if (flat < 0.3) return d.z >= 0 ? 'TOWARD CAMERA' : 'AWAY FROM CAM'
  const depth = d.z >= 0 ? 'NEAR' : 'FAR'
  if (Math.abs(d.x) >= Math.abs(d.y)) {
    return `SCREEN ${d.x >= 0 ? 'RIGHT' : 'LEFT'} · ${depth}`
  }
  return `SCREEN ${d.y >= 0 ? 'UP' : 'DOWN'} · ${depth}`
}

// ---- views ----------------------------------------------------------------

const VIEWS = {
  // Distances leave headroom for the control bar at the bottom of the frame —
  // a figure whose claws are hidden behind the UI reads as a cropped bug.
  q34: { dir: [0.78, 0.2, 0.72], dist: 2.5, target: [0, 0.64, 0], fov: 34 },
  front: { dir: [0.04, 0.06, 1], dist: 2.55, target: [0, 0.64, 0], fov: 34 },
  left: { dir: [1, 0.06, 0.05], dist: 2.55, target: [0, 0.64, 0], fov: 34 },
  back: { dir: [-0.15, 0.12, -1], dist: 2.55, target: [0, 0.66, 0], fov: 34 },
  head: { dir: [0.6, 0.18, 0.85], dist: 0.62, target: [0, 1.02, 0.03], fov: 32 },
  hands: { dir: [0.35, 0.45, 0.9], dist: 0.95, target: [0, 0.62, 0.12], fov: 34 },
}
let view = 'q34'
let spin = true
let spinAngle = 0
let freeOrbit = false

/**
 * The preset's name as the button spells it — or FREE ORBIT once you have
 * dragged, because a frame labelled HANDS that is not the hands view is worse
 * than a frame with no label at all.
 */
function viewLabel() {
  if (freeOrbit) return 'FREE ORBIT'
  const button = document.querySelector(`#views button[data-view="${view}"]`)
  return button ? button.textContent : view.toUpperCase()
}

function placeCamera() {
  const v = VIEWS[view]
  const elevation = v.dir[1]
  const r = v.dist / Math.hypot(1, elevation)
  camera.position.set(
    Math.sin(spinAngle) * r,
    controls.target.y + elevation * v.dist,
    Math.cos(spinAngle) * r,
  )
}

function applyView(name) {
  view = name
  freeOrbit = false
  for (const b of document.querySelectorAll('#views button')) {
    b.classList.toggle('on', b.dataset.view === name)
  }
  const v = VIEWS[name]
  controls.target.fromArray(v.target)
  camera.fov = v.fov
  camera.updateProjectionMatrix()
  // Re-seed the turntable angle from the view, so switching doesn't snap.
  spinAngle = Math.atan2(v.dir[0], v.dir[2])
  // Always move the camera. This used to be conditional on the turntable
  // spinning, which meant that with SPIN off the view buttons retargeted and
  // re-zoomed but left the camera where it was — HANDS from wherever you
  // happened to be standing, still labelled HANDS.
  placeCamera()
}

// ---- playback -------------------------------------------------------------

let clipName = 'run'
let playing = true
let clipTime = 0

function currentDuration() {
  return goblin ? goblin.actions[clipName].getClip().duration : 1
}

function setClip(name) {
  if (!goblin) return
  clipName = name
  clipTime = 0
  for (const b of document.querySelectorAll('#clips button')) {
    b.classList.toggle('on', b.dataset.clip === name)
  }
  for (const action of Object.values(goblin.actions)) action.stop()
  const action = goblin.actions[name]
  action.reset()
  // Everything loops here. The combo is authored as a one-shot for the main
  // scene, but on a turntable you want to watch it over and over.
  action.setLoop(THREE.LoopRepeat, Infinity)
  action.clampWhenFinished = false
  action.play()
  goblin.reset()
  clearTrails()
  resetFloor()
}

// ---- UI -------------------------------------------------------------------

const btnPlay = document.getElementById('btn-play')
const btnSpin = document.getElementById('btn-spin')
const btnRig = document.getElementById('btn-rig')
const btnAxes = document.getElementById('btn-axes')
const btnCompass = document.getElementById('btn-compass')
const btnSockets = document.getElementById('btn-sockets')
const btnTrails = document.getElementById('btn-trails')
const scrub = document.getElementById('scrub')

let compassOn = true
let socketsOn = false
let trailsOn = false

for (const b of document.querySelectorAll('#clips button')) {
  b.addEventListener('click', () => setClip(b.dataset.clip))
}
for (const b of document.querySelectorAll('#views button')) {
  b.addEventListener('click', () => applyView(b.dataset.view))
}
btnPlay.addEventListener('click', () => {
  playing = !playing
  btnPlay.textContent = playing ? '❚❚' : '▶'
})
btnSpin.addEventListener('click', () => {
  spin = !spin
  btnSpin.classList.toggle('on', spin)
})
btnRig.addEventListener('click', () => {
  if (!rigHelper) return
  rigHelper.visible = !rigHelper.visible
  btnRig.classList.toggle('on', rigHelper.visible)
})
btnAxes.addEventListener('click', () => {
  if (!axesGroup) return
  const on = !axesGroup.children[0]?.visible
  for (const a of axesGroup.children) a.visible = on
  btnAxes.classList.toggle('on', on)
})
btnCompass.addEventListener('click', () => {
  compassOn = !compassOn
  btnCompass.classList.toggle('on', compassOn)
  if (!compassOn) cctx.clearRect(0, 0, COMPASS_W, COMPASS_H)
})
btnSockets.addEventListener('click', () => {
  socketsOn = !socketsOn
  btnSockets.classList.toggle('on', socketsOn)
  // The triads hang off the bones and off the weapon holders, so they are
  // switched one by one rather than by a parent group.
  for (const n of socketNodes) n.visible = socketsOn
  if (errorLines) errorLines.visible = socketsOn
  if (!socketsOn) {
    dbgSockets.innerHTML = ''
    readoutKey = ''
  }
})
btnTrails.addEventListener('click', () => {
  trailsOn = !trailsOn
  btnTrails.classList.toggle('on', trailsOn)
  trailsGroup.visible = trailsOn
  if (!trailsOn) {
    clearTrails()
    dbgTrails.style.display = 'none'
  } else {
    dbgTrails.style.display = ''
  }
})
scrub.addEventListener('input', () => {
  if (!goblin) return
  playing = false
  btnPlay.textContent = '▶'
  clipTime = (scrub.value / 1000) * currentDuration()
  clearTrails()
})
controls.addEventListener('start', () => {
  spin = false
  freeOrbit = true
  btnSpin.classList.remove('on')
})
window.addEventListener('keydown', (e) => {
  if (e.key === ' ') {
    e.preventDefault()
    btnPlay.click()
  }
})

async function build() {
  await step('lighting the stage', 0.15)
  scene.environment = createEnvironment(renderer)

  await step('sculpting the goblin', 0.45)
  goblin = createGoblin({ renderer, quality: 1 })
  scene.add(goblin.group)

  await step('hanging the kit', 0.85)
  rigHelper = new THREE.SkeletonHelper(goblin.mesh)
  rigHelper.visible = false
  scene.add(rigHelper)

  axesGroup = new THREE.Group()
  for (const name of AXIS_BONES) {
    const bone = goblin.byName[name]
    if (!bone) continue
    const axes = new THREE.AxesHelper(0.07)
    axes.material.depthTest = false
    axes.material.transparent = true
    axes.renderOrder = 999
    axes.visible = false
    bone.add(axes)
    axesGroup.add(axes)
  }

  buildSockets()
  buildTrails()
  for (const side of ['L', 'R']) {
    floorProbeNodes[side] = FLOOR_PROBES[side].map((n) => goblin.byName[n]).filter(Boolean)
  }
  dbgTrails.style.display = 'none'

  document.getElementById('s-bones').textContent = goblin.stats.bones
  document.getElementById('s-tris').textContent = goblin.stats.triangles.toLocaleString()
  document.getElementById('s-sim').textContent = goblin.stats.accessories
  document.getElementById('s-build').textContent = `${Math.round(goblin.stats.buildMs)} ms`

  window.spaceGoblin = {
    scene,
    camera,
    renderer,
    goblin,
    // Handles for a headless harness: flipping these is the same as clicking.
    debug: {
      compass: (on) => on !== compassOn && btnCompass.click(),
      sockets: (on) => on !== socketsOn && btnSockets.click(),
      trails: (on) => on !== trailsOn && btnTrails.click(),
      floorMin,
      socketErrors,
    },
  }

  await step('ready', 1)
  boot.classList.add('gone')
  setTimeout(() => boot.remove(), 700)
}

// ---- loop -----------------------------------------------------------------

function resize() {
  const w = window.innerWidth
  const h = window.innerHeight
  renderer.setSize(w, h)
  camera.aspect = w / h
  camera.updateProjectionMatrix()
  sizeCompass()
}
window.addEventListener('resize', resize)

const clock = new THREE.Clock()

function frameLoop() {
  requestAnimationFrame(frameLoop)
  const raw = Math.min(clock.getDelta(), 1 / 20)

  if (goblin) {
    if (playing) {
      clipTime = (clipTime + raw) % currentDuration()
      scrub.value = Math.round((clipTime / currentDuration()) * 1000)
    } else {
      // Park the clip on the scrubbed frame but keep feeding the solver real
      // time — zeroing the mixer rather than the delta, so a paused pose still
      // lets the cape and straps settle instead of freezing them mid-air.
      goblin.mixer.setTime(clipTime)
    }
    goblin.mixer.timeScale = playing ? 1 : 0
    goblin.update(raw, { speed: clipName === 'run' && playing ? 4.8 : 0.3 })
    updateFloor()
    if (socketsOn) updateSockets()
    if (trailsOn && sampleTrails(raw)) writeTrailGeometry()
  }

  if (spin) {
    spinAngle += raw * 0.28
    placeCamera()
  }
  controls.update()
  renderer.render(scene, camera)
  if (compassOn) drawCompass()
}

applyView('q34')
resize()
build().then(() => {
  setClip('run')
  clock.getDelta()
  frameLoop()
})
