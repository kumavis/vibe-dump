import * as THREE from 'three'
import { materials } from './materials.js'
import { slab, rod } from './build.js'

// ---------------------------------------------------------------------------
// The site
//
// Blue hour on a gravel-edged asphalt lot. The time of day is a working
// decision rather than a mood: every one of these modules has lights in it —
// LED bars, paper lanterns, a griddle, a shrine's candles — and at noon none of
// them would read. At dusk the emissives carry, the low warm key rakes across
// the fold panels so the mechanism is legible in silhouette, and the truck's own
// white paint still holds enough light to show its shape.
//
// The horizon is a ring of flat silhouettes rather than modelled scenery. They
// exist to give the eye a scale reference and somewhere for the fog to end.
// ---------------------------------------------------------------------------

export function buildEnvironment(scene, renderer) {
  const lib = materials()

  const sky = skyTexture()
  scene.background = sky
  // An environment map generated from the sky itself. Without one, every metal
  // in the scene — chrome, aluminium extrusion, the glass — has nothing to
  // reflect and renders as flat grey. This is the single cheapest thing that
  // makes the truck look like a photographed object.
  if (renderer) {
    const pmrem = new THREE.PMREMGenerator(renderer)
    scene.environment = pmrem.fromEquirectangular(sky).texture
    pmrem.dispose()
  }
  scene.fog = new THREE.Fog(0x3c5175, 30, 110)

  // --- ground ---------------------------------------------------------------
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(220, 220, 1, 1), lib.asphalt)
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  scene.add(ground)

  // A worn parking bay, so the truck is parked *somewhere* rather than floating
  // on an infinite plane. Drawn as thin painted slabs a millimetre proud.
  const paint = new THREE.MeshStandardMaterial({ color: 0xa39a86, roughness: 0.96 })
  const bay = new THREE.Group()
  for (const z of [-2.35, 2.35]) {
    bay.add(slab([7.6, 0.004, 0.1], paint, { pos: [0, 0.002, z] }))
  }
  bay.add(slab([0.1, 0.004, 4.7], paint, { pos: [-3.75, 0.002, 0] }))
  bay.position.set(0.2, 0, 0)
  scene.add(bay)

  // --- light ----------------------------------------------------------------
  const hemi = new THREE.HemisphereLight(0xa8c2e8, 0x4a3d33, 1.55)
  scene.add(hemi)

  // Low warm key from the west — long shadows, strong side modelling on the
  // fold panels. Shadow camera is tight around the truck so the 2048 map is
  // spent where the geometry is rather than on 200 m of empty asphalt.
  const key = new THREE.DirectionalLight(0xffd3a6, 3.4)
  key.position.set(-9, 5.2, 7)
  key.castShadow = true
  key.shadow.mapSize.set(2048, 2048)
  key.shadow.camera.near = 1
  key.shadow.camera.far = 32
  key.shadow.camera.left = -7
  key.shadow.camera.right = 7
  key.shadow.camera.top = 6
  key.shadow.camera.bottom = -4
  key.shadow.bias = -0.0006
  key.shadow.normalBias = 0.018
  scene.add(key)
  scene.add(key.target)
  key.target.position.set(0, 0.9, 0)

  // Cool sky fill from the opposite side keeps the shadow side from going flat
  // black without washing out the key.
  const fill = new THREE.DirectionalLight(0x8fb4f0, 1.1)
  fill.position.set(8, 4, -6)
  scene.add(fill)

  // A dim bounce off the tarmac, so undersides of decks and canopies aren't voids.
  const bounce = new THREE.DirectionalLight(0xffc38a, 0.42)
  bounce.position.set(0, -3, 2)
  scene.add(bounce)

  scene.add(horizonRing())
  scene.add(poles())

  return { key, fill, hemi, ground }
}

/** A vertical gradient sky, drawn once into a canvas and used as the background. */
function skyTexture() {
  const c = document.createElement('canvas')
  c.width = 8
  c.height = 256
  const ctx = c.getContext('2d')
  const g = ctx.createLinearGradient(0, 0, 0, 256)
  g.addColorStop(0.0, '#16294a')
  g.addColorStop(0.40, '#33517f')
  g.addColorStop(0.66, '#6f83a6')
  g.addColorStop(0.84, '#d59b71')
  g.addColorStop(1.0, '#f6bd8b')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 8, 256)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.mapping = THREE.EquirectangularReflectionMapping
  return t
}

/**
 * A ring of flat silhouettes at 70 m: a low treeline, a couple of warehouse
 * roofs, a distant hill. Unlit black-blue so they read purely as shape, and
 * inside the fog's far plane so they sit *in* the haze rather than on top of it.
 */
function horizonRing() {
  const g = new THREE.Group()
  const mat = new THREE.MeshBasicMaterial({ color: 0x33496e, fog: true, side: THREE.DoubleSide })
  const R = 70
  let seed = 4
  const rnd = () => ((seed = (seed * 1103515245 + 12345) >>> 0) / 4294967296)

  for (let i = 0; i < 90; i++) {
    const a = (i / 90) * Math.PI * 2 + rnd() * 0.03
    const r = R + rnd() * 14
    const kind = rnd()
    let mesh
    if (kind < 0.62) {
      // Conifer: a narrow triangle.
      const h = 4 + rnd() * 7
      const w = h * (0.22 + rnd() * 0.13)
      const s = new THREE.Shape()
      s.moveTo(-w, 0)
      s.lineTo(w, 0)
      s.lineTo(0, h)
      mesh = new THREE.Mesh(new THREE.ShapeGeometry(s), mat)
    } else if (kind < 0.88) {
      // Broadleaf blob.
      const h = 4 + rnd() * 6
      mesh = new THREE.Mesh(new THREE.CircleGeometry(h * 0.55, 9), mat)
      mesh.position.y = h * 0.55
    } else {
      // A shed with a shallow gable.
      const w = 8 + rnd() * 16
      const h = 3 + rnd() * 4
      const s = new THREE.Shape()
      s.moveTo(-w / 2, 0)
      s.lineTo(w / 2, 0)
      s.lineTo(w / 2, h)
      s.lineTo(0, h * 1.28)
      s.lineTo(-w / 2, h)
      mesh = new THREE.Mesh(new THREE.ShapeGeometry(s), mat)
    }
    mesh.position.x += Math.cos(a) * r
    mesh.position.z = Math.sin(a) * r
    mesh.lookAt(0, mesh.position.y, 0)
    g.add(mesh)
  }
  return g
}

/** Two lot light poles, dark and unlit, purely for vertical scale. */
function poles() {
  const lib = materials()
  const g = new THREE.Group()
  const dark = new THREE.MeshStandardMaterial({ color: 0x2a3038, roughness: 0.8, metalness: 0.3 })
  for (const [x, z] of [
    [-9.5, -7.5],
    [11, 6.5],
  ]) {
    const p = new THREE.Group()
    p.add(rod([0, 0, 0], [0, 7.4, 0], 0.055, dark))
    p.add(rod([0, 7.4, 0], [Math.sign(-x) * 1.1, 7.55, 0], 0.045, dark))
    const head = slab([0.62, 0.1, 0.34], dark, { pos: [Math.sign(-x) * 1.35, 7.5, 0] })
    p.add(head)
    const lamp = slab([0.5, 0.03, 0.26], lib.ledWarm, { pos: [Math.sign(-x) * 1.35, 7.44, 0] })
    p.add(lamp)
    const glow = new THREE.PointLight(0xffcf9a, 12, 22, 2)
    glow.position.set(Math.sign(-x) * 1.35, 7.3, 0)
    p.add(glow)
    p.position.set(x, 0, z)
    g.add(p)
  }
  return g
}

/** Renderer settings the whole scene assumes. */
export function configureRenderer(renderer) {
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.18
  renderer.outputColorSpace = THREE.SRGBColorSpace
}
