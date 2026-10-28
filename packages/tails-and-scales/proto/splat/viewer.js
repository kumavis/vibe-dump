// One Bushtail figure as the game builds it (view/models/cache.js's buildModel): with splat fur
// (view/models/squirrel.js, the game's 'new' figures since V2), or the classic mesh figure, on its base,
// lit as view/stage.js lights the table: drag to orbit. Under the package's `npm run dev`:
//   /proto/splat/viewer.html?unit=elder           the figure with splat fur and a mesh kit
//   /proto/splat/viewer.html?unit=elder&mesh=1    the classic mesh figure (cache.js's 'classic' style)
// The query also takes w, h (the canvas, CSS px; the window if unset), dist, el, az (the camera's distance,
// elevation and azimuth, degrees), ty (the height it looks at), base (0: none) and shadow=1 (the sun casts,
// as on the table: a squirrel's shadow is its proxy's, view/stage.js). The splats drawn are the game's own
// choice for the figure's height on the canvas (view/models/splat/splats.js's levels of detail, prepared
// before each render as the table prepares them). window.done holds what was drawn once the first frame
// is (sheet.mjs waits for it): the splats drawn and the build's milliseconds.
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { buildModel, setFigureStyle } from '../../view/models/cache.js'
import { prepareSplats, splatsPrepared, SHADOW_LAYER } from '../../view/models/splat/splats.js'
import { RACES } from '../../data/schema.js'

const q = new URLSearchParams(location.search)
const num = (k, d) => (q.has(k) ? Number(q.get(k)) : d)
const unit = q.get('unit') ?? 'nutkin'
const units = RACES.squirrel.units
if (!Object.hasOwn(units, unit)) throw new Error(`no unit "${unit}": ${Object.keys(units).join(', ')}`)
const W = num('w', innerWidth), H = num('h', innerHeight)
// (preserveDrawingBuffer: a screenshot taken a moment after the draw still finds the frame)
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true })
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
// (shadow=1: the sun casts onto a ground under the base, as on the table; three r160 tests a caster's
// layers against the drawing camera's, so the camera sees the proxies' layer during the shadow pass,
// as view/stage.js arranges)
if (num('shadow', 0)) {
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  sun.castShadow = true
  sun.shadow.mapSize.set(1024, 1024)
  Object.assign(sun.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3, near: 1, far: 60 })
  sun.shadow.bias = -0.0004
  sun.shadow.camera.layers.enable(SHADOW_LAYER)
  const pass = renderer.shadowMap.render
  renderer.shadowMap.render = (lights, s, camera) => {
    const mask = camera.layers.mask
    camera.layers.enable(SHADOW_LAYER)
    pass.call(renderer.shadowMap, lights, s, camera)
    camera.layers.mask = mask
  }
  const ground = new THREE.Mesh(new THREE.CircleGeometry(4, 48).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#5f7a45', roughness: 0.95 }))
  ground.receiveShadow = true
  scene.add(ground)
}
// the splats prepared before each render, as the table's
scene.onBeforeRender = (r, s, camera) => prepareSplats(camera, r, sunDir, s)

const mesh = !!num('mesh', 0)
if (mesh) setFigureStyle('classic')
const t0 = performance.now()
const root = buildModel('squirrel', unit, units[unit], '#ec8a34')
const ms = Math.round(performance.now() - t0)
// (base=0: the figure alone, its base hidden)
if (!num('base', 1)) root.children[0].visible = false
scene.add(root)

// the camera: fov 35, looking at (0, ty, 0) from `dist` away at elevation `el`, azimuth `az`
const el = (num('el', 44) * Math.PI) / 180, az = (num('az', 25) * Math.PI) / 180, dist = num('dist', 2.8), ty = num('ty', 0.6)
const cam = new THREE.PerspectiveCamera(35, W / H, 0.05, 500)
cam.position.set(Math.sin(az) * Math.cos(el) * dist, ty + Math.sin(el) * dist, Math.cos(az) * Math.cos(el) * dist)
const controls = new OrbitControls(cam, renderer.domElement)
controls.target.set(0, ty, 0)
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
window.done = { unit, mesh, splats: splatsPrepared.splats, ms }
