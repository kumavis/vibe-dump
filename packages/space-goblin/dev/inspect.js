// Studio turntable for iterating on the character alone (not shipped).
import * as THREE from 'three'
import { createGoblin } from '../src/character.js'
import { createEnvironment } from '../src/env.js'

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(1)
renderer.setSize(innerWidth, innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.0
renderer.outputColorSpace = THREE.SRGBColorSpace
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()
scene.background = new THREE.Color('#1b1d22')
scene.environment = createEnvironment(renderer)
scene.add(new THREE.HemisphereLight('#cfe3ff', '#2a2119', 0.9))
const key = new THREE.DirectionalLight('#fff0dc', 3.2)
key.position.set(2.5, 3.4, 3.0); key.castShadow = true
key.shadow.mapSize.set(2048,2048); key.shadow.camera.top=1.6; key.shadow.camera.bottom=-0.3
key.shadow.camera.left=-1.4; key.shadow.camera.right=1.4; key.shadow.bias=-0.0006
scene.add(key)
const fill = new THREE.DirectionalLight('#9fd0ff', 1.1); fill.position.set(-3,1.6,1.5); scene.add(fill)
const rim = new THREE.DirectionalLight('#ffd7a0', 2.0); rim.position.set(-1.2,2.2,-3.4); scene.add(rim)
const floor = new THREE.Mesh(new THREE.CircleGeometry(4,48), new THREE.MeshStandardMaterial({color:'#3a3a40', roughness:1}))
floor.rotation.x = -Math.PI/2; floor.receiveShadow = true; scene.add(floor)

const camera = new THREE.PerspectiveCamera(35, innerWidth/innerHeight, 0.05, 60)

const goblin = createGoblin({ renderer, quality: 1 })
scene.add(goblin.group)
window.goblin = goblin
console.log('stats', JSON.stringify(goblin.stats))

// URL params: ?clip=run&t=0.3&view=front&dist=2.2&y=0.7&rig=1
const q = new URLSearchParams(location.search)
const clip = q.get('clip') || 'run'
const phase = parseFloat(q.get('t') ?? '0.25')
const view = q.get('view') || 'front'
const dist = parseFloat(q.get('dist') ?? '2.1')
const cy = parseFloat(q.get('y') ?? '0.68')

if (q.get('rig')) { const h = new THREE.SkeletonHelper(goblin.mesh); scene.add(h) }

const VIEWS = { front:[0,0,1], back:[0,0,-1], left:[1,0,0.05], right:[-1,0,0.05],
  q34:[0.75,0.15,0.72], q34b:[-0.7,0.2,0.7], top:[0.4,1,0.5], low:[0.6,-0.15,0.9] }
const v = new THREE.Vector3(...(VIEWS[view]||VIEWS.front)).normalize()
camera.position.copy(v).multiplyScalar(dist).add(new THREE.Vector3(0, cy, 0))
camera.lookAt(0, cy, 0)

// Freeze on a chosen point in a chosen clip, with the sim settled.
for (const a of Object.values(goblin.actions)) { a.stop() }
const action = goblin.actions[clip]
action.play(); action.paused = false
goblin.mixer.setTime(0)
let simmed = false
function frame() {
  requestAnimationFrame(frame)
  if (!simmed) {
    // Run the clip up to `phase` while letting the cloth settle.
    const target = action.getClip().duration * phase
    const steps = 90
    for (let i = 0; i < steps; i++) {
      goblin.mixer.setTime((target * (i+1)) / steps)
      goblin.update(1/60, { speed: clip === 'run' ? 4.8 : 0.5 })
    }
    goblin.mixer.setTime(target)
    simmed = true
    document.title = 'ready'
  }
  renderer.render(scene, camera)
}
frame()
addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth/innerHeight; camera.updateProjectionMatrix() })
