// Throwaway visual check for src/world.js. Not part of the app build.
// ?view=1 hero (default) | ?view=2 wide overhead | ?view=3 street level
import * as THREE from 'three'
import { buildWorld } from '../../src/world.js'
import { GOODS } from '../../src/goods.js'

const STALL_GOODS = [
  ['apple'], ['fish', 'bread'], ['spice'], ['potion'],
  ['gem'], ['lamp', 'scroll'], ['rug'], ['skull'],
]

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(1)
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()
const world = buildWorld({ seed: 7, goods: GOODS, stallGoods: STALL_GOODS })
scene.add(world.group)

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 250)
const view = new URLSearchParams(location.search).get('view') || '1'
if (view === '2') {
  camera.position.set(0, 34, 34) // wide overhead
  camera.lookAt(0, 0, 0)
} else if (view === '3') {
  // street level: shopper's-eye view down the lane at the gem stall,
  // fountain at our back
  const s = world.stalls[4] // gem stall
  const fx = Math.sin(s.yaw), fz = Math.cos(s.yaw)
  camera.position.set(s.pos.x + fx * 6.5 - fz * 1.2, 1.7, s.pos.z + fz * 6.5 + fx * 1.2)
  camera.lookAt(s.pos.x, 1.55, s.pos.z)
} else if (view === '4' || view === '5') {
  // close counter inspection: 4 = fish+bread stall, 5 = skull stall
  const s = world.stalls[view === '4' ? 1 : 7]
  const fx = Math.sin(s.yaw), fz = Math.cos(s.yaw)
  camera.position.set(s.pos.x + fx * 2.6 + fz * 1.0, 1.9, s.pos.z + fz * 2.6 - fx * 1.0)
  camera.lookAt(s.pos.x, s.counterY, s.pos.z)
} else {
  camera.position.set(20, 14, 20)
  camera.lookAt(0, 1.5, 0)
}

world.update(1.7) // a mid-flicker moment
renderer.render(scene, camera)

// expose a hook so the screenshot script can wait / inspect
window.__world = { tris: renderer.info.render.triangles, calls: renderer.info.render.calls }
document.title = `world ok — ${renderer.info.render.calls} calls, ${renderer.info.render.triangles} tris`
