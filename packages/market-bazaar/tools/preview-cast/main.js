// Studio lineup for judging characters in neutral light (PROCESS.md Level 3:
// judge the figure before judging it inside the night scene).
// ?gesture=talk|walk|drum… poses everyone; ?seed=N reseeds the lineup.

import * as THREE from 'three'
import { buildCharacter } from '../../src/character.js'

const params = new URLSearchParams(location.search)
const gesture = params.get('gesture') || 'none'
const seedBase = parseInt(params.get('seed'), 10) || 40

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(innerWidth, innerHeight)
renderer.toneMapping = THREE.ACESFilmicToneMapping
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x2a2a33)
const camera = new THREE.PerspectiveCamera(35, innerWidth / innerHeight, 0.1, 100)

scene.add(new THREE.HemisphereLight(0xdde4ff, 0x55462e, 1.1))
const key = new THREE.DirectionalLight(0xfff2dd, 2.0)
key.position.set(3, 6, 5)
scene.add(key)
const rim = new THREE.DirectionalLight(0x88aaff, 0.8)
rim.position.set(-4, 3, -6)
scene.add(rim)

const ground = new THREE.Mesh(
  new THREE.CircleGeometry(30, 40).rotateX(-Math.PI / 2),
  new THREE.MeshStandardMaterial({ color: 0x3a3a44, roughness: 0.95 }),
)
scene.add(ground)

const cast = []
const specs = [
  ['human', 'vendor'], ['human', 'customer'], ['human', 'busker'],
  ['alien', 'customer'], ['alien', 'vendor'], ['alien', 'busker'],
  ['monster', 'customer'], ['monster', 'vendor'],
  ['devil', 'customer'], ['devil', 'vendor'],
]
specs.forEach(([species, role], i) => {
  const ch = buildCharacter({ seed: seedBase + i * 31, species, role })
  const x = (i - (specs.length - 1) / 2) * 1.15
  ch.group.position.set(x, 0, 0)
  scene.add(ch.group)
  cast.push(ch)
})

camera.position.set(0, 1.7, 9.5)
camera.lookAt(0, 1.0, 0)

// axis compass, stamped in-scene (PROCESS.md: end the which-way-is-left debate)
const axes = new THREE.AxesHelper(0.7)
axes.position.set(-6.5, 0.02, 2)
scene.add(axes)

const clock = new THREE.Clock()
renderer.setAnimationLoop(() => {
  const dt = Math.min(clock.getDelta(), 0.05)
  const t = clock.elapsedTime
  for (const ch of cast) {
    ch.animator.update(t, dt, {
      speed: gesture === 'walk' ? 1.0 : 0,
      gesture: gesture === 'walk' ? 'none' : gesture,
      speaking: gesture === 'talk',
      lookYaw: 0,
      lookPitch: 0,
    })
  }
  renderer.render(scene, camera)
})
