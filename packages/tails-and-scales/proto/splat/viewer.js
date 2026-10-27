// One Bushtail figure with splat fur (bushtail-kit.js), or the game's mesh figure today, on its base, lit
// as view/stage.js lights the table: drag to orbit. Under the package's `npm run dev`:
//   /proto/splat/viewer.html?unit=elder           the figure with splat fur and a mesh kit
//   /proto/splat/viewer.html?unit=elder&mesh=1    the game's mesh figure (view/models/cache.js)
// The query also takes w, h (the canvas, CSS px; the window if unset), dist, el, az (the camera's distance,
// elevation and azimuth, degrees), ty (the height it looks at), density (the fur's), n (splats drawn per
// squirrel; 0: all), scale (splat size), seed and base (0: none). window.done holds what was drawn once
// the first frame is (sheet.mjs waits for it).
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { buildFigure, UNITS } from './bushtail-kit.js'
import { base } from '../../view/models/kit.js'
import { buildModel } from '../../view/models/cache.js'
import { RACES } from '../../data/schema.js'

const q = new URLSearchParams(location.search)
const num = (k, d) => (q.has(k) ? Number(q.get(k)) : d)
const unit = q.get('unit') ?? 'nutkin'
if (!Object.hasOwn(UNITS, unit)) throw new Error(`no unit "${unit}": ${Object.keys(UNITS).join(', ')}`)
const W = num('w', innerWidth), H = num('h', innerHeight)
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(q.has('w') ? 1 : devicePixelRatio)
renderer.setSize(W, H)
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.05
document.body.append(renderer.domElement)
const scene = new THREE.Scene()
scene.background = new THREE.Color('#708959')
scene.add(new THREE.HemisphereLight('#d6e6ff', '#3b2a1a', 0.85))
const sunDir = new THREE.Vector3(-20, 40, 18).normalize()
const sun = new THREE.DirectionalLight('#fff0d6', 2.3)
sun.position.copy(sunDir).multiplyScalar(30)
scene.add(sun)
const fill = new THREE.DirectionalLight('#9fb8ff', 0.35)
fill.position.set(20, 15, -20)
scene.add(fill)

const t0 = performance.now()
let splats = [], count = 0
if (num('mesh', 0)) {
  scene.add(buildModel('squirrel', unit, RACES.squirrel.units[unit], '#ec8a34'))
} else {
  const fig = buildFigure(unit, { density: num('density', 0.1), n: num('n', 0), splatScale: num('scale', 1.5), seed: num('seed', 1) })
  if (num('base', 1)) scene.add(base(UNITS[unit].base, '#ec8a34'))
  fig.group.position.y = num('base', 1) ? 0.1 : 0
  scene.add(fig.group)
  splats = fig.splats
  count = fig.count
  for (const s of splats) s.light.copy(sunDir)
}
const ms = Math.round(performance.now() - t0)

// the camera: fov 35, looking at (0, ty, 0) from `dist` away at elevation `el`, azimuth `az`
const el = (num('el', 44) * Math.PI) / 180, az = (num('az', 25) * Math.PI) / 180, dist = num('dist', 2.8), ty = num('ty', 0.6)
const cam = new THREE.PerspectiveCamera(35, W / H, 0.05, 500)
cam.position.set(Math.sin(az) * Math.cos(el) * dist, ty + Math.sin(el) * dist, Math.cos(az) * Math.cos(el) * dist)
const controls = new OrbitControls(cam, renderer.domElement)
controls.target.set(0, ty, 0)
controls.update()
// (splats are sorted for the camera before each draw: three uploads their order before onBeforeRender)
function draw() {
  scene.updateMatrixWorld()
  cam.updateMatrixWorld()
  for (const s of splats) s.sort(cam)
  renderer.render(scene, cam)
}
controls.addEventListener('change', draw)
addEventListener('resize', () => {
  if (q.has('w')) return
  cam.aspect = innerWidth / innerHeight
  cam.updateProjectionMatrix()
  renderer.setSize(innerWidth, innerHeight)
  draw()
})
draw()
window.done = { unit, mesh: !!num('mesh', 0), splats: count, ms }
