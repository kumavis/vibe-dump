// The stage every entity stands on: renderer, sky, fog, ground and the two
// lights that are not entities. renderer.xr is always enabled (enabling it costs
// nothing until a session starts); main.js owns the animation loop because XR
// needs renderer.setAnimationLoop, not requestAnimationFrame.
import * as THREE from 'three'
import { normColor } from './resources.js'

export const DEFAULT_WORLD = { bounds: 40, ground: { color: '#7fb069' }, sky: { color: '#9cc3e6' } }
const fin = (v, d) => (Number.isFinite(+v) && v !== null ? +v : d)

// doc.world (or its plain copy) -> the handful of numbers the stage uses
export function worldLook (w) {
  const bounds = Math.max(5, Math.min(1000, fin(w?.bounds, DEFAULT_WORLD.bounds)))
  return {
    bounds,
    ground: normColor(w?.ground?.color != null ? String(w.ground.color) : null, DEFAULT_WORLD.ground.color),
    sky: normColor(w?.sky?.color != null ? String(w.sky.color) : null, DEFAULT_WORLD.sky.color),
    fogNear: bounds * 0.9,
    fogFar: bounds * 3,
  }
}

export function makeScene ({ canvas, pixelRatio = Math.min(globalThis.devicePixelRatio || 1, 2), antialias = true } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias, powerPreference: 'high-performance' })
  renderer.setPixelRatio(pixelRatio)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.xr.enabled = true
  renderer.xr.setReferenceSpaceType('local-floor')

  const scene = new THREE.Scene()
  scene.name = 'meadow'
  scene.background = new THREE.Color(DEFAULT_WORLD.sky.color)
  scene.fog = new THREE.Fog(DEFAULT_WORLD.sky.color, 36, 120)

  const hemi = new THREE.HemisphereLight('#ffffff', '#5a6e45', 1.5); hemi.name = 'sky-light'
  const sun = new THREE.DirectionalLight('#fff4e0', 2.0); sun.name = 'sun'
  sun.position.set(18, 30, 12)
  scene.add(hemi, sun, sun.target)

  // the ground is a disc a little wider than the containment bounds, plus a faint
  // ring at the bounds themselves so people can see where creatures turn back
  const groundMat = new THREE.MeshStandardMaterial({ color: DEFAULT_WORLD.ground.color, roughness: 1 })
  const groundMesh = new THREE.Mesh(new THREE.CircleGeometry(1, 96).rotateX(-Math.PI / 2), groundMat)
  groundMesh.name = 'ground'; groundMesh.userData.ground = true; groundMesh.userData.noPick = true
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.995, 1, 128).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.18, depthWrite: false }))
  ring.name = 'bounds'; ring.position.y = 0.01; ring.userData.noPick = true
  scene.add(groundMesh, ring)

  const camera = new THREE.PerspectiveCamera(70, 1, 0.05, 500)
  camera.name = 'head'

  let look = null
  function applyWorldSettings (w) {
    look = worldLook(w)
    scene.background.set(look.sky); scene.fog.color.set(look.sky)
    scene.fog.near = look.fogNear; scene.fog.far = look.fogFar
    groundMat.color.set(look.ground)
    hemi.groundColor.set(look.ground).multiplyScalar(0.8)
    groundMesh.scale.setScalar(look.bounds * 2.5)
    ring.scale.setScalar(look.bounds)
    return look
  }
  applyWorldSettings(DEFAULT_WORLD)

  function resize (w, h) {
    if (renderer.xr.isPresenting) return // the XR manager owns the framebuffer while presenting
    const el = renderer.domElement
    const W = Math.max(1, Math.floor(w ?? el.clientWidth ?? 1)); const H = Math.max(1, Math.floor(h ?? el.clientHeight ?? 1))
    renderer.setSize(W, H, false)
    camera.aspect = W / H; camera.updateProjectionMatrix()
  }
  // size the drawing buffer to the canvas now: without this it stays at the
  // 300×150 canvas default, stretched by CSS, until the first window resize
  if (renderer.domElement?.clientWidth) resize()

  return {
    renderer,
    scene,
    camera,
    sun,
    hemi,
    groundMesh,
    resize,
    render: () => renderer.render(scene, camera),
    applyWorldSettings,
    look: () => look,
    // flat in v1; kept as a hook so terrain can arrive without touching callers
    ground: (x, z) => 0, // eslint-disable-line no-unused-vars
    dispose () {
      renderer.setAnimationLoop(null)
      groundMesh.geometry.dispose(); groundMat.dispose(); ring.geometry.dispose(); ring.material.dispose()
      renderer.dispose()
    },
  }
}
