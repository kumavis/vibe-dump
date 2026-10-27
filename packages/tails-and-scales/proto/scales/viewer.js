// One Ssithra figure, smooth and glossy (serpents.js), or the game's mesh figure today, on its base, lit as
// view/stage.js lights the table: drag to orbit. Under the package's `npm run dev`:
//   /proto/scales/viewer.html?unit=hierophant          the smooth, glossy figure
//   /proto/scales/viewer.html?unit=hierophant&mesh=1   the game's mesh figure (view/models/cache.js)
// The query also takes w, h (the canvas, CSS px; the window if unset), dist, el, az (the camera's distance,
// elevation and azimuth, degrees), ty (the height it looks at), detail (the figure's level of detail: 1 close
// up, lower for game scale), base (0: none), bake=1 (merged by bake-gloss.js, as the game would bake it) and
// plain=1 (every material swapped for a matte MeshStandardMaterial: the shapes without the gloss), dpr (the
// renderer's pixel ratio when w is given: the gloss's level of detail is the same at 1 and 2) and mask=coil
// (only the coil, flat white on black: sheet.mjs measures the coil's noise inside it). window.done holds
// what was drawn once the first frame is (sheet.mjs waits for it).
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { buildSerpent, KEYS } from './serpents.js'
import { triangles } from './shapes.js'
import { bakeGloss } from './bake-gloss.js'
import { base } from '../../view/models/kit.js'
import { buildModel } from '../../view/models/cache.js'
import { RACES } from '../../data/schema.js'

const q = new URLSearchParams(location.search)
const num = (k, d) => (q.has(k) ? Number(q.get(k)) : d)
const unit = q.get('unit') ?? 'scaleguard'
if (!KEYS.includes(unit)) throw new Error(`no unit "${unit}": ${KEYS.join(', ')}`)
const W = num('w', innerWidth), H = num('h', innerHeight)
// (preserveDrawingBuffer: a screenshot taken a moment after the draw still finds the frame)
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true })
renderer.setPixelRatio(q.has('w') ? num('dpr', 1) : devicePixelRatio)
renderer.setSize(W, H)
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.05
document.body.append(renderer.domElement)
const scene = new THREE.Scene()
scene.background = new THREE.Color('#708959')
scene.add(new THREE.HemisphereLight('#d6e6ff', '#3b2a1a', 0.85))
const sun = new THREE.DirectionalLight('#fff0d6', 2.3)
sun.position.copy(new THREE.Vector3(-20, 40, 18).normalize()).multiplyScalar(30)
scene.add(sun)
const fill = new THREE.DirectionalLight('#9fb8ff', 0.35)
fill.position.set(20, 15, -20)
scene.add(fill)

const t = RACES.serpent.units[unit]
let info
if (num('mesh', 0)) {
  const t0 = performance.now()
  const root = buildModel('serpent', unit, t, '#46c27a')
  const ms = performance.now() - t0
  scene.add(root)
  info = { unit, mesh: true, triangles: triangles(root.userData.fig), ms: Math.round(ms) }
} else {
  const fig = buildSerpent(unit, { detail: num('detail', 1) })
  const lift = num('base', 1) ? (t.big ? 0.09 : 0.06) : 0
  if (num('base', 1)) scene.add(base(t.base, '#46c27a'))
  // lifted as view/models/cache.js lifts a figure onto its base
  fig.group.position.y = lift
  scene.add(fig.group)
  // (bake=1: merged as the game would, by bake-gloss.js: it should look the same)
  if (num('bake', 0)) bakeGloss(fig.group)
  // (plain=1: every material swapped for kit.js's matte MeshStandardMaterial, same colours, smooth normals:
  // what the shapes alone do, without the gloss)
  if (num('plain', 0)) {
    fig.group.traverse((o) => {
      if (!o.isMesh) return
      const m = o.material
      o.material = new THREE.MeshStandardMaterial({ color: m.color, vertexColors: m.vertexColors, roughness: 0.72, metalness: Math.min(m.metalness, 0.65), emissive: m.emissive, emissiveIntensity: m.emissiveIntensity, transparent: m.transparent, opacity: m.opacity })
    })
  }
  // (mask=coil: the coil alone, white on black, below the torso)
  if (q.get('mask') === 'coil') {
    scene.background = new THREE.Color('#000000')
    scene.traverse((o) => o.isMesh && !o.geometry.userData.arc && (o.visible = false))
    const white = new THREE.MeshBasicMaterial({ color: '#ffffff', clippingPlanes: [new THREE.Plane(new THREE.Vector3(0, -1, 0), 0.27 * fig.group.scale.y + lift)] })
    fig.group.traverse((o) => o.isMesh && (o.material = white))
    renderer.localClippingEnabled = true
  }
  info = { unit, mesh: false, detail: num('detail', 1), triangles: fig.triangles, ms: Math.round(fig.ms) }
}

// the camera: fov 35, looking at (tx, ty, tz) from `dist` away at elevation `el`, azimuth `az`
const el = (num('el', 44) * Math.PI) / 180, az = (num('az', 25) * Math.PI) / 180, dist = num('dist', 2.8), ty = num('ty', 0.5), tx = num('tx', 0), tz = num('tz', 0)
const cam = new THREE.PerspectiveCamera(35, W / H, 0.05, 500)
cam.position.set(tx + Math.sin(az) * Math.cos(el) * dist, ty + Math.sin(el) * dist, tz + Math.cos(az) * Math.cos(el) * dist)
const controls = new OrbitControls(cam, renderer.domElement)
controls.target.set(tx, ty, tz)
controls.update()
const draw = () => renderer.render(scene, cam)
controls.addEventListener('change', draw)
addEventListener('resize', () => {
  if (q.has('w')) return
  cam.aspect = innerWidth / innerHeight
  cam.updateProjectionMatrix()
  renderer.setSize(innerWidth, innerHeight)
  draw()
})
draw()
// (signalled a frame later, once the first frame, which also made the env map's PMREM, is on screen)
requestAnimationFrame(() => {
  draw()
  window.done = info
})
