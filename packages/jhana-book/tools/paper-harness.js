// paper-harness.js — standalone dev page for src/paper.js (not part of the app).
//
//   npx vite --port 5182 --strictPort   →   http://127.0.0.1:5182/tools/paper-harness.html
//
// Query params:
//   ?theta=<0..π>        dihedral in radians (default π)
//   ?sweep=1             animate θ back and forth
//   ?axes=1              draw every paper frame's axes (x red, y green, z blue)
//   ?ghost=1             translucent pages, to see what lies flat between them
//   ?cam=q|front|end|side|top   view (default q, a three-quarter view)
//
// The group IS spread space: nothing but paper.update(θ) moves anything, so at
// θ = π the pages lie flat along ±x and at θ = 0 they stand together along +y.

import * as THREE from 'three'
import { Paper } from '../src/paper.js'

const PI = Math.PI
const params = new URLSearchParams(location.search)
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))
let theta = clamp(parseFloat(params.get('theta') ?? String(PI)), 0, PI)
if (!Number.isFinite(theta)) theta = PI

// ---- renderer, scene, camera, light ------------------------------------------

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.outputColorSpace = THREE.SRGBColorSpace
document.body.prepend(renderer.domElement)

const scene = new THREE.Scene()
scene.background = new THREE.Color('#121317')

const camera = new THREE.PerspectiveCamera(34, window.innerWidth / window.innerHeight, 0.05, 60)
const views = {
  q: [new THREE.Vector3(-1.45, 1.55, 2.45), new THREE.Vector3(0, 0.3, -0.05)],
  front: [new THREE.Vector3(0, 2.1, 2.9), new THREE.Vector3(0, 0.35, 0.05)],
  end: [new THREE.Vector3(0, 0.45, 4.2), new THREE.Vector3(0, 0.4, 0)],
  side: [new THREE.Vector3(3.6, 0.5, 0), new THREE.Vector3(0, 0.5, 0)],
  top: [new THREE.Vector3(0, 4.2, 0.001), new THREE.Vector3(0, 0, 0)],
}
const [camPos, camTarget] = views[params.get('cam')] ?? views.q
camera.position.copy(camPos)
camera.lookAt(camTarget)

scene.add(new THREE.HemisphereLight('#dfe4ef', '#5a4d44', 1.5))
const fill = new THREE.DirectionalLight('#b9c6e0', 0.6) // no shadows: lifts the faces the key misses
fill.position.set(2.5, 1.5, -1.5)
scene.add(fill)
const key = new THREE.DirectionalLight('#fff0d8', 2.4)
key.position.set(-1.8, 3.2, 2.0)
key.castShadow = true
key.shadow.mapSize.set(2048, 2048)
key.shadow.camera.left = -1.6
key.shadow.camera.right = 1.6
key.shadow.camera.top = 1.6
key.shadow.camera.bottom = -1.6
key.shadow.camera.near = 0.5
key.shadow.camera.far = 8
key.shadow.bias = -0.0004
key.shadow.normalBias = 0.012
scene.add(key)

const table = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), new THREE.MeshStandardMaterial({ color: '#1b1c21', roughness: 0.95 }))
table.rotation.x = -PI / 2
table.position.y = -0.006
table.receiveShadow = true
scene.add(table)

// ---- the spread ---------------------------------------------------------------

const group = new THREE.Group()
scene.add(group)
const paper = new Paper(group)

const ghost = params.get('ghost') === '1'
const pageMat = paper.material({
  color: '#ece3cf',
  ...(ghost ? { transparent: true, opacity: 0.28, depthWrite: false } : {}),
})
paper.card(paper.root.right, { length: 1, z0: -0.7, z1: 0.7, material: pageMat })
paper.card(paper.root.left, { length: 1, z0: -0.7, z1: 0.7, material: pageMat })

const spine = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 1.4, 6), new THREE.MeshStandardMaterial({ color: '#3a3430' }))
spine.rotation.x = PI / 2
group.add(spine)

const legend = []
const mat = (color, label) => {
  legend.push([color, label])
  return paper.material({ color })
}

// 1. symmetric tent (z −0.68..−0.55), plus a flap on its left panel
const red = mat('#c8553d', 'tent a=b .35 p=q .5')
const tent = paper.parallelFold({ a: 0.35, b: 0.35, p: 0.5, q: 0.5, z0: -0.68, z1: -0.55 })
paper.card(tent.left, { material: red })
paper.card(tent.right, { material: red })
const white = mat('#f4efe6', 'flap on tent.left')
const tentFlap = paper.flap({ on: tent, side: 'left', x: 0.2, z: -0.615, length: 0.12, lift: (th) => 0.6 * th })
paper.card(tentFlap.panel, { shape: 'tri', material: white })

// 2. asymmetric step / lean-to (z −0.5..−0.38): a + p = b + q
const ochre = mat('#e0a030', 'step a .2 b .5 p .6 q .3')
const step = paper.parallelFold({ a: 0.2, b: 0.5, p: 0.6, q: 0.3, z0: -0.5, z1: -0.38 })
paper.card(step.left, { material: ochre })
paper.card(step.right, { material: ochre })

// 3. V-fold toward 'far', γ ≈ 1.2 (apex z −0.06)
const blue = mat('#3f88c5', 'V far α .5 γ 1.2')
const vFar = paper.vFold({ z: -0.06, alpha: 0.5, gamma: 1.2, length: 0.3, toward: 'far' })
paper.card(vFar.left, { material: blue })
paper.card(vFar.right, { material: blue })

// 4. tall narrow V-fold toward 'near', γ = π/2 (apex z .12): 'quad' with a short glue edge
const green = mat('#5bb08a', 'V near α .3 γ π/2 (quad)')
const vNear = paper.vFold({ z: 0.12, alpha: 0.3, gamma: PI / 2, length: 0.55, toward: 'near' })
paper.card(vNear.left, { shape: 'quad', z1: 0.12, material: green })
paper.card(vNear.right, { shape: 'quad', z1: 0.12, material: green })

// 5. a tent with a fold hanging on its inner hinge and one riding its outer hinge (z .3..46)
const violet = mat('#8e6bbf', 'tent a .3 p .5')
const host = paper.parallelFold({ a: 0.3, b: 0.3, p: 0.5, q: 0.5, z0: 0.3, z1: 0.46 })
paper.card(host.left, { material: violet })
paper.card(host.right, { material: violet })
const gold = mat('#f0c75e', 'on tent.inner (hangs)')
const hang = paper.parallelFold({ on: host.inner, a: 0.12, b: 0.12, p: 0.15, q: 0.15, z0: 0.33, z1: 0.43 })
paper.card(hang.left, { material: gold })
paper.card(hang.right, { material: gold })
const pink = mat('#e86a92', 'on tent.outer (rises)')
const roof = paper.parallelFold({ on: host.outer, a: 0.15, b: 0.15, p: 0.25, q: 0.25, z0: 0.34, z1: 0.42 })
paper.card(roof.left, { material: pink })
paper.card(roof.right, { material: pink })

// 6. two flaps on the pages, lifting with θ (z ≈ .58)
const orange = mat('#f08a4b', 'flaps, lift 1.25·sin²(θ/2)')
const lift = (th) => 1.25 * Math.sin(th / 2) ** 2
const flapR = paper.flap({ side: 'right', x: 0.62, z: 0.58, alpha: 0.5, length: 0.22, lift })
const flapL = paper.flap({ side: 'left', x: 0.62, z: 0.58, alpha: 0.5, length: 0.22, lift })
paper.card(flapR.panel, { shape: 'tri', material: orange })
paper.card(flapL.panel, { shape: 'tri', material: orange })

// ---- frame axes (debug) ---------------------------------------------------------

const axesHelpers = []
function buildAxes() {
  const frames = []
  group.traverse((o) => {
    if (o !== group && !o.isMesh && !o.isLine) frames.push(o)
  })
  for (const o of frames) {
    const a = new THREE.AxesHelper(0.07)
    a.material.depthTest = false
    a.renderOrder = 10
    o.add(a)
    axesHelpers.push(a)
  }
}

// ---- UI -------------------------------------------------------------------------

const slider = document.getElementById('theta')
const val = document.getElementById('val')
const sweepBox = document.getElementById('sweep')
const axesBox = document.getElementById('axes')
slider.max = String(PI)
slider.value = String(theta)
sweepBox.checked = params.get('sweep') === '1'
axesBox.checked = params.get('axes') === '1'
slider.addEventListener('input', () => {
  theta = parseFloat(slider.value)
  sweepBox.checked = false
})
const setAxes = () => {
  if (axesBox.checked && !axesHelpers.length) buildAxes()
  for (const a of axesHelpers) a.visible = axesBox.checked
}
axesBox.addEventListener('change', setAxes)
setAxes()

document.getElementById('legend').innerHTML =
  '<b>paper harness</b> &nbsp; ' + legend.map(([c, l]) => `<span><i style="background:${c}"></i>${l}</span>`).join('')

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// for poking from the console
window.harness = { paper, group, tent, step, vFar, vNear, host, hang, roof, flapR, flapL, tentFlap }

const clock = new THREE.Clock()
let t = 0
renderer.setAnimationLoop(() => {
  const dt = Math.min(clock.getDelta(), 0.1)
  if (sweepBox.checked) {
    t += dt
    theta = (PI / 2) * (1 - Math.cos(t * 0.6))
    slider.value = String(theta)
  }
  paper.update(theta)
  val.textContent = `θ ${theta.toFixed(3)}  (${((theta / PI) * 180).toFixed(1)}°)  tent ${tent.height.toFixed(3)} high`
  renderer.render(scene, camera)
})
