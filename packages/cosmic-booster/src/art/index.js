import * as THREE from 'three'
import { ART_VERT, artFragment } from './common.js'
import nebula from './nebula.js'
import pulsar from './pulsar.js'
import ringed from './ringed.js'
import supernova from './supernova.js'
import galaxy from './galaxy.js'
import comet from './comet.js'
import binary from './binary.js'
import planetary from './planetary.js'
import cluster from './cluster.js'
import quasar from './quasar.js'
import blackhole from './blackhole.js'

const BODIES = { nebula, pulsar, ringed, supernova, galaxy, comet, binary, planetary, cluster, quasar, blackhole }

// One compiled program per kind, shared by every card of that kind; each card
// owns its uniforms (seed, time, tilt) and its render targets.
const programs = new Map()

function program(kind) {
  if (!programs.has(kind)) {
    if (!BODIES[kind]) throw new Error(`No art for "${kind}"`)
    programs.set(
      kind,
      new THREE.ShaderMaterial({
        vertexShader: ART_VERT,
        fragmentShader: artFragment(BODIES[kind]),
        uniforms: {
          uTime: { value: 0 },
          uSeed: { value: 0 },
          uRes: { value: new THREE.Vector2(1, 1) },
          uTilt: { value: new THREE.Vector2() },
        },
        depthTest: false,
        depthWrite: false,
      }),
    )
  }
  return programs.get(kind)
}

const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2))
quad.frustumCulled = false
const scene = new THREE.Scene()
scene.add(quad)
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

export function makeArtTarget(w, h, mipmaps = false) {
  return new THREE.WebGLRenderTarget(w, h, {
    type: THREE.HalfFloatType,
    depthBuffer: false,
    generateMipmaps: mipmaps,
    minFilter: mipmaps ? THREE.LinearMipmapLinearFilter : THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
  })
}

// Paint one card's art into a target.
export function renderArt(renderer, kind, target, { time, seed, tilt }) {
  const mat = program(kind)
  mat.uniforms.uTime.value = time
  mat.uniforms.uSeed.value = seed
  mat.uniforms.uRes.value.set(target.width, target.height)
  if (tilt) mat.uniforms.uTilt.value.copy(tilt)
  else mat.uniforms.uTilt.value.set(0, 0)
  quad.material = mat
  const prev = renderer.getRenderTarget()
  renderer.setRenderTarget(target)
  renderer.render(scene, camera)
  renderer.setRenderTarget(prev)
}

// Compile every art program up front, so the first reveal doesn't hitch.
export function warmArt(renderer, kinds) {
  const t = makeArtTarget(4, 4)
  for (const k of kinds) renderArt(renderer, k, t, { time: 0, seed: 0 })
  t.dispose()
}

export const ART_KINDS = Object.keys(BODIES)
