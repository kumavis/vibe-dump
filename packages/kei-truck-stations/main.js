import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { buildEnvironment, configureRenderer } from './src/env.js'
import { buildTruck } from './src/truck.js'
import { T } from './src/specs.js'

const canvas = document.getElementById('scene')
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
configureRenderer(renderer)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 300)
camera.position.set(-5.2, 2.5, 5.6)

const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.85, 0)
controls.enableDamping = true
controls.minDistance = 2.5
controls.maxDistance = 22
controls.maxPolarAngle = Math.PI * 0.495

buildEnvironment(scene, renderer)
const truck = buildTruck()
scene.add(truck.group)

// Bed origin: the frame every fold-out module is authored in.
const bedOrigin = new THREE.Group()
bedOrigin.position.set(0, T.deckH, 0)
scene.add(bedOrigin)

// The three drop gates, shut. Each station takes these over as hinged parts of
// its own rig; with no station loaded they just sit closed, as they would on a
// truck parked outside a hardware shop.
for (const sign of [-1, 1]) {
  const gate = truck.gateGeometry.side()
  gate.position.fromArray(truck.gateHinge.side(sign))
  bedOrigin.add(gate)
}
const tail = truck.gateGeometry.tail()
tail.position.fromArray(truck.gateHinge.tail)
bedOrigin.add(tail)

function resize() {
  const w = innerWidth
  const h = innerHeight
  renderer.setSize(w, h, false)
  camera.aspect = w / h
  camera.updateProjectionMatrix()
}
addEventListener('resize', resize)
resize()

document.getElementById('boot').classList.add('gone')

// A handle on the scene graph, for poking at it from the console (and for the
// screenshot harness, which needs to put the camera somewhere specific).
window.kei = { scene, camera, controls, renderer, truck, bedOrigin,
  view(px, py, pz, tx = 0, ty = 0.85, tz = 0) {
    camera.position.set(px, py, pz)
    controls.target.set(tx, ty, tz)
    controls.update()
  } }

renderer.setAnimationLoop(() => {
  controls.update()
  renderer.render(scene, camera)
})
