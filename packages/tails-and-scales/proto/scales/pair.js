// The two armies on one table (M17): three splat-fur Bushtails (the game's own figures since V2,
// view/models/cache.js's buildModel: nutkin, grenadier, oakguard) facing three glossy Ssithra
// (view/models/gloss/serpents.js: brute, scaleguard, spitter) about 3 units apart, each line turned a
// little toward the camera, under view/stage.js's lights, from the game's camera (fov 40, 44° up). Does
// plush fur sit beside glossy enamel as one art style? Under the package's `npm run dev`:
//   /proto/scales/pair.html                 close: the figures about 150 px tall (detail 1; the splats
//                                           the game draws at that size, its finest level)
//   /proto/scales/pair.html?game=1          game scale: about 30-40 px (detail 0.3, and the splats the
//                                           game draws at that size: view/models/splat/splats.js)
// also w, h (the canvas, CSS px), dist, az, el (the camera), dpr. window.done holds what was drawn.
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { buildSerpent } from '../../view/models/gloss/serpents.js'
import { base } from '../../view/models/kit.js'
import { buildModel } from '../../view/models/cache.js'
import { prepareSplats, splatsPrepared } from '../../view/models/splat/splats.js'
import { RACES } from '../../data/schema.js'

const q = new URLSearchParams(location.search)
const num = (k, d) => (q.has(k) ? Number(q.get(k)) : d)
const game = num('game', 0) === 1
const W = num('w', innerWidth), H = num('h', innerHeight)
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true })
renderer.setPixelRatio(q.has('w') ? num('dpr', 1) : devicePixelRatio)
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
// the table's felt under them, so the bases sit on something
const felt = new THREE.Mesh(new THREE.CircleGeometry(9, 64).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#5f7a45', roughness: 0.95 }))
scene.add(felt)
// the splats prepared before each render, as the game's table prepares them
scene.onBeforeRender = (r, s, camera) => prepareSplats(camera, r, sunDir, s)

const t0 = performance.now()
// the camera first: the splat count at game scale follows each figure's height on screen
const el = (num('el', 44) * Math.PI) / 180, az = (num('az', 28) * Math.PI) / 180, dist = num('dist', game ? 12.5 : 6.9)
const cam = new THREE.PerspectiveCamera(40, W / H, 0.05, 500)
const target = new THREE.Vector3(0.25, 0.35, 0.3)
cam.position.set(target.x + Math.sin(az) * Math.cos(el) * dist, target.y + Math.sin(el) * dist, target.z + Math.cos(az) * Math.cos(el) * dist)
const pxPerUnit = H / (2 * Math.tan((20 * Math.PI) / 180) * dist)
// the Bushtails on the left, facing right; the Coil on the right, facing left; each turned 0.45 toward us
const squirrels = [['nutkin', -1.5, -1.3], ['grenadier', -1.55, 0.1], ['oakguard', -1.5, 1.5]]
for (const [key, x, z] of squirrels) {
  const g = buildModel('squirrel', key, RACES.squirrel.units[key], '#ec8a34')
  g.position.set(x, 0, z)
  g.rotation.y = Math.PI / 2 - 0.45
  scene.add(g)
}
const serpents = [['brute', 2.2, -1.25], ['scaleguard', 1.45, 0.35], ['spitter', 1.5, 1.55]]
let tris = 0
for (const [key, x, z] of serpents) {
  const t = RACES.serpent.units[key]
  const fig = buildSerpent(key, { detail: game ? 0.3 : 1 })
  const g = new THREE.Group()
  g.add(base(t.base, '#46c27a'))
  fig.group.position.y = t.big ? 0.09 : 0.06
  g.add(fig.group)
  g.position.set(x, 0, z)
  g.rotation.y = -Math.PI / 2 + 0.45
  scene.add(g)
  tris += fig.triangles
}
const ms = Math.round(performance.now() - t0)

const controls = new OrbitControls(cam, renderer.domElement)
controls.target.copy(target)
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
requestAnimationFrame(() => {
  draw()
  window.done = { game, splats: splatsPrepared.splats, triangles: tris, ms, figurePx: Math.round(0.9 * pxPerUnit) }
})
