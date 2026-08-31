// Renderer, camera, lights, and every mesh in the garden.

import * as THREE from 'three'
import { W, Buf, PROP_CONIFER, PROP_BROADLEAF, PROP_ROCK, PROP_HOUSE, PROP_BUSH, PROP_PENNANT } from './geometry.js'
import { cellAt, KEY } from './hat.js'
import { landmarkGroup } from './landmarks.js'
import {
  SKY_TOP,
  FOG,
  WATER_SHALLOW,
  WATER_DEEP,
  TREE_GREENS,
  AUTUMN,
  HOUSE_WALLS,
  HOUSE_ROOFS,
  ROCK_GREYS,
  ROCK,
  ROCK_DARK,
  SNOW,
  SNOW_SHADE,
  HINT,
  BEACON,
  GHOST_RIM,
  LOOK,
  shade,
  mixHex,
} from './palette.js'

const lin = (hex) => new THREE.Color(hex).convertSRGBToLinear()

// --- prop geometries --------------------------------------------------------

function trunkGeo() {
  const g = new THREE.CylinderGeometry(0.022, 0.032, 0.15, 5, 1)
  g.translate(0, 0.075, 0)
  return g
}
function coniferGeo() {
  const g = new THREE.ConeGeometry(0.115, 0.42, 6, 1)
  g.translate(0, 0.33, 0)
  return g
}
function broadleafGeo() {
  const g = new THREE.IcosahedronGeometry(0.15, 0)
  g.scale(1, 0.86, 1)
  g.translate(0, 0.27, 0)
  return g
}
function rockGeo() {
  const g = new THREE.IcosahedronGeometry(0.1, 0)
  g.scale(1.25, 0.72, 1)
  g.translate(0, 0.05, 0)
  return g
}
function bushGeo() {
  const g = new THREE.IcosahedronGeometry(0.075, 0)
  g.scale(1.2, 0.8, 1.1)
  g.translate(0, 0.05, 0)
  return g
}
function houseBodyGeo() {
  const g = new THREE.BoxGeometry(0.2, 0.13, 0.16)
  g.translate(0, 0.065, 0)
  return g
}
function houseRoofGeo() {
  const g = new THREE.ConeGeometry(0.16, 0.11, 4, 1)
  g.rotateY(Math.PI / 4)
  g.translate(0, 0.185, 0)
  return g
}
function poleGeo() {
  const g = new THREE.CylinderGeometry(0.013, 0.016, 0.5, 5, 1)
  g.translate(0, 0.25, 0)
  return g
}
function pennantGeo() {
  // One triangle drawn double-sided. Emitting front and back faces instead
  // would leave every vertex with two opposite normals averaging to zero, and
  // the flag would vanish into unlit black.
  const g = new THREE.BufferGeometry()
  g.setAttribute(
    'position',
    new THREE.BufferAttribute(new Float32Array([0.013, 0.5, 0, 0.013, 0.33, 0, 0.25, 0.43, 0.04]), 3),
  )
  g.computeVertexNormals()
  return g
}

// --- the peak ---------------------------------------------------------------

/**
 * The mountain is a *feature*, not terrain: a modelled peak standing on ground
 * as flat as every other tile's. Building it this way keeps the board honest —
 * the three opening hats are ordinary tiles you could have been dealt — and it
 * lets the silhouette be a proper faceted mountain rather than whatever a
 * height field happens to make of eight kites.
 */
function mountainMesh(radius, height, gully) {
  const buf = new Buf()
  const SEG = 24
  const RINGS = [0.16, 0.27, 0.39, 0.52, 0.66, 0.82, 1]

  const hash = (i) => {
    const x = Math.sin(i * 127.1 + 311.7) * 43758.5453
    return x - Math.floor(x)
  }
  const seg = (s) => ((s % SEG) + SEG) % SEG

  /**
   * How high the mountain stands at a fraction `u` of the way out from its
   * centre.
   *
   * This is the one number the whole peak lives or dies by, and two rewrites
   * got it wrong the same way: a profile that falls off fast near the middle
   * (`t²(0.55 + 0.45t)`, or anything else concave) has shed four fifths of its
   * height by the time it is halfway out, and what stands up is a needle on a
   * plate. A mountain's outline is *convex* — the flank leaves the summit
   * almost vertically and only lies down near the foot — so the curve has to
   * stay high across the middle of the radius and drop at the end. This is the
   * silhouette the original keyframed profile drew, as one expression.
   */
  const profile = (u) => 1 - Math.pow(u, 1.35)

  /**
   * The valley, as a wedge of *floor* rather than a dent in the outline.
   *
   * Two earlier attempts pulled the flank in near the gully and faded the cut
   * out towards the summit. Neither looked like anything: narrowing a cone's
   * skirt only makes it slightly less round, and forcing the spurs either side
   * to rise turned the whole peak into a splayed star of fins. What reads as a
   * valley is ground that stays *low* right through where the mountain would
   * otherwise be, with the massif standing on both sides of it — so inside this
   * wedge the height is clamped to a floor, and the mountain closes round the
   * gap in a C.
   *
   * Two things keep it from simply sawing the peak in half. The wedge is wide —
   * near a third of the circle — so its walls spread over three or four spokes
   * and slope like hillsides instead of standing up as the vertical blades a
   * narrow one cut. And it fades out over the last of the way in, so the valley
   * heads in a corrie under the summit rather than running through it: the
   * massif keeps a top, and the top curves round the gap.
   */
  const GULLY_W = 1.0
  const gullyAt = (a) => {
    if (gully === null || gully === undefined) return 0
    let d = a - gully
    while (d > Math.PI) d -= Math.PI * 2
    while (d < -Math.PI) d += Math.PI * 2
    const x = Math.abs(d) / GULLY_W
    return x >= 1 ? 0 : 0.5 + 0.5 * Math.cos(Math.PI * x)
  }
  // how much of the cut has arrived by `u` — nothing under the cap, all of it
  // by a third of the way out
  const reach = (u) => {
    const k = Math.max(0, Math.min(1, (u - 0.2) / 0.24))
    return k * k * (3 - 2 * k)
  }
  const floorAt = (u) => 0.06 + 0.5 * Math.pow(1 - u, 1.4)

  // Each spur keeps its own girth all the way up, with a little ring-to-ring
  // drift on top — enough to give the silhouette buttresses and gullies instead
  // of the smooth cone a single radius produces. Only the plan outline wobbles;
  // the heights stay on their rings, or the ridges turn into fins.
  const wob = (j, s) =>
    j === 0 ? 1 : (0.78 + 0.44 * hash(seg(s))) * (0.94 + 0.13 * hash(seg(s) + j * 17))

  // Where this spur's snow starts. Colouring by ring would put the snowline on
  // a ring, and a ring is a circle: the cap comes out a smooth grey dome. Every
  // spur setting its own height for it makes the boundary jump a ring back and
  // forth round the peak, which is the ragged edge snow actually has.
  const snowline = (s) => 0.55 + 0.26 * (hash(seg(s) + 31) - 0.5)

  const at = (s, j) => {
    const a = (seg(s) / SEG) * Math.PI * 2
    const u = RINGS[j]
    const base = profile(u)
    const g = gullyAt(a) * reach(u)
    const h = g > 0 ? base * (1 - g) + Math.min(base, floorAt(u)) * g : base
    // the foot draws in a little where the valley runs out of it, so the gap in
    // the C is a gap in the outline too and not only in the shading
    const r = radius * u * wob(j, s) * (1 - 0.18 * g * u)
    return { p: [Math.cos(a) * r, height * h, Math.sin(a) * r], h }
  }

  const colourAt = (s, h) =>
    h > snowline(s)
      ? mixHex(SNOW, SNOW_SHADE, hash(s * 3 + 7) * 0.5)
      : mixHex(ROCK_DARK, ROCK, hash(s * 7 + 13))

  for (let j = 0; j < RINGS.length - 1; j++) {
    for (let s = 0; s < SEG; s++) {
      const a = at(s, j)
      const b = at(s + 1, j)
      const c = at(s + 1, j + 1)
      const d = at(s, j + 1)
      const ca = colourAt(s, a.h)
      const cb = colourAt(s + 1, b.h)
      const cc = colourAt(s + 1, c.h)
      const cd = colourAt(s, d.h)
      // Outward-facing. The rings run from the summit *out*, where the profile
      // this replaced ran from the foot *up*, so the winding that was right
      // there is backwards here: keep it and every flank faces inwards, gets
      // culled, and the peak renders as a white cap floating over bare ground
      // with a few slivers of valley wall under it.
      buf.tri(a.p, b.p, c.p, ca, cb, cc)
      buf.tri(a.p, c.p, d.p, ca, cc, cd)
    }
  }
  // Cap the summit. It sits off-centre, leaned away from the valley, so the
  // ridge line curves round the corrie instead of standing over it — the top of
  // the C rather than a lid on it.
  // Kept well inside the innermost ring's radius: lean it further than that and
  // the fan triangles on the valley side turn themselves inside out, which is
  // what put a splayed white fin on one flank of the last attempt.
  const lean = gully === null || gully === undefined ? 0 : radius * RINGS[0] * 0.45
  const apex = [
    -Math.cos(gully ?? 0) * lean,
    height * (lean ? 1.0 : 1.03),
    -Math.sin(gully ?? 0) * lean,
  ]
  for (let s = 0; s < SEG; s++) {
    const a = at(s, 0)
    const b = at(s + 1, 0)
    buf.tri(b.p, a.p, apex, colourAt(s + 1, b.h), colourAt(s, a.h), SNOW)
  }
  return buf
}

// --- the mill ---------------------------------------------------------------

// Pale, so the wheel stands out against the mill's slate roof rather than
// disappearing into it — at card size the wheel is the whole point of the town.
const WOOD = 0xc8a273
const WOOD_DARK = 0x9a7346
const SLATE = 0x5d6775
const PLASTER = 0xe6dcc6

/** A water wheel: two rims on six spokes, eight paddles and an axle, built in
 *  the XY plane so the whole thing spins about its own Z once water reaches it. */
function wheelGroup() {
  const g = new THREE.Group()
  const rim = new THREE.MeshLambertMaterial({ color: lin(WOOD) })
  const paddle = new THREE.MeshLambertMaterial({ color: lin(WOOD_DARK) })
  const R = 0.2
  for (const z of [-0.06, 0.06]) {
    const t = new THREE.Mesh(new THREE.TorusGeometry(R, 0.018, 4, 14), rim)
    t.position.z = z
    t.castShadow = true
    g.add(t)
  }
  const sg = new THREE.BoxGeometry(R * 1.9, 0.02, 0.02)
  for (let i = 0; i < 3; i++) {
    const m = new THREE.Mesh(sg, rim)
    m.rotation.z = (i / 3) * Math.PI
    g.add(m)
  }
  const pg = new THREE.BoxGeometry(0.06, 0.026, 0.15)
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2
    const m = new THREE.Mesh(pg, paddle)
    m.position.set(Math.cos(a) * (R - 0.015), Math.sin(a) * (R - 0.015), 0)
    m.rotation.z = a
    m.castShadow = true
    g.add(m)
  }
  const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.19, 6), rim)
  axle.rotation.x = Math.PI / 2
  g.add(axle)
  return g
}

/** The mill itself: a plastered house under slate, a size up from the cottages
 *  the hamlet biome scatters around it. */
function millHouse() {
  const g = new THREE.Group()
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.24, 0.24), new THREE.MeshLambertMaterial({ color: lin(PLASTER) }))
  body.position.y = 0.12
  body.castShadow = true
  g.add(body)
  const roof = new THREE.Mesh(new THREE.ConeGeometry(0.245, 0.16, 4), new THREE.MeshLambertMaterial({ color: lin(SLATE) }))
  roof.rotation.y = Math.PI / 4
  roof.position.y = 0.31
  roof.castShadow = true
  g.add(roof)
  return g
}

class Instancer {
  constructor(scene, geo, colour, { shadow = true, side } = {}) {
    this.geo = geo
    this.mat = new THREE.MeshLambertMaterial({ color: colour ?? 0xffffff, side: side ?? THREE.FrontSide })
    this.scene = scene
    this.mesh = null
    this.shadow = shadow
    this.cap = 0
  }
  /** `scaleOf` lets the caller shrink individual instances — how the props on a
   *  tile just laid grow in rather than appearing all at once. */
  set(list, scaleOf = null) {
    this.list = list
    const n = list.length
    if (n > this.cap) {
      if (this.mesh) {
        this.scene.remove(this.mesh)
        this.mesh.dispose()
      }
      this.cap = Math.max(64, Math.ceil(n * 1.6))
      this.mesh = new THREE.InstancedMesh(this.geo, this.mat, this.cap)
      this.mesh.castShadow = this.shadow
      this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
      this.mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(this.cap * 3), 3)
      this.mesh.frustumCulled = false
      this.scene.add(this.mesh)
    }
    if (!this.mesh) return
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const pos = new THREE.Vector3()
    const scl = new THREE.Vector3()
    const col = new THREE.Color()
    for (let i = 0; i < n; i++) {
      const p = list[i]
      pos.set(p.x, p.y, p.z)
      q.setFromAxisAngle(UP, p.rot)
      const s = scaleOf ? p.s * scaleOf(p) : p.s
      scl.set(s, s, s)
      m.compose(pos, q, scl)
      this.mesh.setMatrixAt(i, m)
      col.set(p.colour ?? 0xffffff).convertSRGBToLinear()
      this.mesh.instanceColor.setXYZ(i, col.r, col.g, col.b)
    }
    this.mesh.count = n
    this.mesh.instanceMatrix.needsUpdate = true
    this.mesh.instanceColor.needsUpdate = true
  }
}
const UP = new THREE.Vector3(0, 1, 0)

/** How long a tile's decorations take to grow in, and how far apart they start. */
const GROW_TIME = 0.34
const GROW_STAGGER = 0.22

// --- water ------------------------------------------------------------------

const WATER_VERT = /* glsl */ `
  varying vec3 vPos;
  #include <common>
  #include <fog_pars_vertex>
  void main() {
    vPos = position;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`
// The uniforms are linear, like every other colour in the scene; the trailing
// colorspace include is what converts the result for the framebuffer. Without
// it a ShaderMaterial writes linear values straight out and the river comes out
// looking like ink.
const WATER_FRAG = /* glsl */ `
  uniform float uTime;
  uniform vec3 uShallow;
  uniform vec3 uDeep;
  varying vec3 vPos;
  #include <common>
  #include <fog_pars_fragment>
  void main() {
    float w = sin(vPos.x * 4.6 + uTime * 1.3) * 0.5 + sin(vPos.z * 3.9 - uTime * 1.05) * 0.5;
    vec3 c = mix(uDeep, uShallow, 0.45 + 0.32 * w);
    float glint = sin(vPos.x * 26.0 - uTime * 2.6) * sin(vPos.z * 21.0 + uTime * 1.7);
    c += smoothstep(0.9, 1.0, glint) * 0.4;
    gl_FragColor = vec4(c, 1.0);
    #include <colorspace_fragment>
    #include <fog_fragment>
  }
`

// --- the scene --------------------------------------------------------------

export class Garden {
  constructor(canvas) {
    this.canvas = canvas
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2))
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

    this.scene = new THREE.Scene()
    this.scene.background = skyTexture()
    this.scene.fog = new THREE.Fog(lin(FOG), 26, 62)

    this.camera = new THREE.PerspectiveCamera(32, 1, 0.5, 200)

    this.scene.add(new THREE.HemisphereLight(lin(SKY_TOP), lin(0x6f6e58), 1.3))
    this.sun = new THREE.DirectionalLight(lin(0xfff3dd), 2.3)
    this.sun.castShadow = true
    this.sun.shadow.mapSize.set(2048, 2048)
    this.sun.shadow.camera.near = 1
    this.sun.shadow.bias = -0.0012
    this.sun.shadow.normalBias = 0.02
    this.scene.add(this.sun)
    this.scene.add(this.sun.target)

    this.haze = new THREE.Mesh(
      new THREE.CircleGeometry(1, 72),
      new THREE.MeshBasicMaterial({
        color: lin(0xbfd2ce),
        transparent: true,
        opacity: 0.9,
        alphaMap: fadeTexture(),
        depthWrite: false,
      }),
    )
    this.haze.rotation.x = -Math.PI / 2
    this.haze.position.y = -0.55
    this.scene.add(this.haze)

    this.landMat = new THREE.MeshLambertMaterial({ vertexColors: true })
    this.land = new THREE.Mesh(new THREE.BufferGeometry(), this.landMat)
    this.land.castShadow = true
    this.land.receiveShadow = true
    this.land.frustumCulled = false
    this.scene.add(this.land)

    this.waterUniforms = {
      ...THREE.UniformsUtils.clone(THREE.UniformsLib.fog),
      uTime: { value: 0 },
      uShallow: { value: lin(WATER_SHALLOW) },
      uDeep: { value: lin(WATER_DEEP) },
    }
    const waterMat = new THREE.ShaderMaterial({
      uniforms: this.waterUniforms,
      fog: true,
      vertexShader: WATER_VERT,
      fragmentShader: WATER_FRAG,
    })
    this.water = new THREE.Mesh(new THREE.BufferGeometry(), waterMat)
    this.water.frustumCulled = false
    this.water.renderOrder = 2
    this.scene.add(this.water)

    // the peak, added once the garden knows where its summit is
    this.mountain = new THREE.Mesh(
      new THREE.BufferGeometry(),
      new THREE.MeshLambertMaterial({ vertexColors: true }),
    )
    this.mountain.castShadow = true
    this.mountain.receiveShadow = true
    this.mountain.visible = false
    this.scene.add(this.mountain)

    this.props = {
      trunk: new Instancer(this.scene, trunkGeo(), 0x6a4f3a),
      conifer: new Instancer(this.scene, coniferGeo()),
      broadleaf: new Instancer(this.scene, broadleafGeo()),
      rock: new Instancer(this.scene, rockGeo()),
      bush: new Instancer(this.scene, bushGeo()),
      houseBody: new Instancer(this.scene, houseBodyGeo()),
      houseRoof: new Instancer(this.scene, houseRoofGeo()),
      pole: new Instancer(this.scene, poleGeo(), 0x8a6f4f),
      pennant: new Instancer(this.scene, pennantGeo(), 0xffffff, { side: THREE.DoubleSide }),
    }

    // --- the piece under the cursor ---
    // Drawn inline with the garden, exactly where it will land. The pulsing
    // outline is what says "not laid yet"; a raised ghost only makes the player
    // guess where it would come down.
    this.ghost = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshLambertMaterial({ vertexColors: true }))
    this.ghost.frustumCulled = false
    this.ghost.renderOrder = 3
    this.ghost.visible = false
    this.scene.add(this.ghost)

    this.ghostWater = new THREE.Mesh(new THREE.BufferGeometry(), waterMat)
    this.ghostWater.frustumCulled = false
    this.ghostWater.renderOrder = 4
    this.ghostWater.visible = false
    this.scene.add(this.ghostWater)

    this.rimMat = new THREE.MeshBasicMaterial({
      color: lin(GHOST_RIM),
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    })
    this.rim = new THREE.Mesh(new THREE.BufferGeometry(), this.rimMat)
    this.rim.frustumCulled = false
    this.rim.renderOrder = 5
    this.rim.visible = false
    this.scene.add(this.rim)

    // --- where a tile could go ---
    this.hintMat = new THREE.PointsMaterial({
      color: lin(HINT),
      size: 0.5,
      map: glowTexture(),
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    })
    const hg = new THREE.BufferGeometry()
    hg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(3), 3))
    this.hints = new THREE.Points(hg, this.hintMat)
    this.hints.frustumCulled = false
    this.hints.renderOrder = 1
    this.scene.add(this.hints)

    this.flashMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    this.flash = new THREE.Mesh(new THREE.BufferGeometry(), this.flashMat)
    this.flash.frustumCulled = false
    this.flash.renderOrder = 6
    this.flash.visible = false
    this.scene.add(this.flash)
    this.flashT = 0

    // camera rig
    this.target = new THREE.Vector3(0, 0, 0)
    this.wantTarget = new THREE.Vector3(0, 0, 0)
    this.dist = 22
    this.wantDist = 22
    this.azimuth = -0.62
    this.polar = 0.74
    this.plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
    this.ray = new THREE.Raycaster()
    this._v = new THREE.Vector3()
  }

  resize(w, h) {
    // A phone with a 3× screen would render four times the pixels of a laptop
    // for a canvas a fifth the size, and drop to a slideshow doing it. Below a
    // tablet's width the ratio comes down; the tiles are big flat facets and
    // lose nothing for it.
    const dpr = devicePixelRatio || 1
    this.narrow = w < 720
    this.renderer.setPixelRatio(Math.min(dpr, this.narrow && dpr >= 3 ? 1.6 : 2))
    const shadow = this.narrow ? 1024 : 2048
    if (this.sun.shadow.mapSize.x !== shadow) {
      this.sun.shadow.mapSize.setScalar(shadow)
      this.sun.shadow.map?.dispose()
      this.sun.shadow.map = null
    }
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    if (this.lastBounds) this.frame(this.lastBounds)
  }

  // --- content ---------------------------------------------------------------

  setMountain(x, z, gully = null, radius = 0.88, height = 1.6) {
    applyBuf(this.mountain.geometry, mountainMesh(radius, height, gully))
    this.mountain.position.set(x, 0, z)
    this.mountain.visible = true
    this.peakY = height * 1.03
  }

  /**
   * The towns the river is meant to reach. Each gets a mill house and a wheel
   * standing across its leat; the wheel only turns once the water arrives, which
   * is the whole reward made visible.
   */
  setSites(sites) {
    if (!this.siteRoot) {
      this.siteRoot = new THREE.Group()
      this.scene.add(this.siteRoot)
    }
    if (this._siteSig === JSON.stringify(sites)) return
    this._siteSig = JSON.stringify(sites)
    this.siteRoot.clear()
    this.wheels = []
    for (const s of sites) {
      let dx = s.hx - s.x
      let dz = s.hz - s.z
      const len = Math.hypot(dx, dz) || 1
      dx /= len
      dz /= len
      // the wheel straddles the leat just inside the tile, its plane along the
      // flow; a rotation about Y by this angle carries local +X onto the stream
      const pivot = new THREE.Group()
      pivot.position.set(s.x + dx * 0.3, 0.15, s.z + dz * 0.3)
      pivot.rotation.y = Math.atan2(-dz, dx)
      const wheel = wheelGroup()
      pivot.add(wheel)
      this.siteRoot.add(pivot)
      this.wheels.push({ wheel, running: s.done })

      const house = millHouse()
      house.position.set(s.x + dx * 0.62 - dz * 0.3, 0, s.z + dz * 0.62 + dx * 0.3)
      house.rotation.y = Math.atan2(dx, dz)
      this.siteRoot.add(house)
    }
  }

  setGarden(bundle, bounds) {
    applyBuf(this.land.geometry, bundle.land)
    applyBuf(this.water.geometry, bundle.water)

    const lists = { trunk: [], conifer: [], broadleaf: [], rock: [], bush: [], houseBody: [], houseRoof: [], pole: [], pennant: [] }
    for (const p of bundle.props) {
      switch (p.type) {
        case PROP_CONIFER:
          lists.trunk.push(p)
          lists.conifer.push({ ...p, colour: TREE_GREENS[Math.floor(p.tint * TREE_GREENS.length) % TREE_GREENS.length] })
          break
        case PROP_BROADLEAF:
          lists.trunk.push(p)
          lists.broadleaf.push({
            ...p,
            colour: p.tint > 0.86 ? AUTUMN[p.tint > 0.94 ? 1 : 0] : TREE_GREENS[Math.floor(p.tint * 4) % 4],
          })
          break
        case PROP_ROCK:
          lists.rock.push({ ...p, colour: ROCK_GREYS[Math.floor(p.tint * 3) % 3] })
          break
        case PROP_BUSH:
          lists.bush.push({ ...p, colour: TREE_GREENS[Math.floor(p.tint * 4) % 4] })
          break
        case PROP_HOUSE:
          lists.houseBody.push({ ...p, colour: HOUSE_WALLS[Math.floor(p.tint * 3) % 3] })
          lists.houseRoof.push({ ...p, colour: HOUSE_ROOFS[Math.floor(p.tint * 4) % 4] })
          break
        case PROP_PENNANT:
          lists.pole.push(p)
          lists.pennant.push({ ...p, colour: shade(LOOK[p.biome].top, 1.3) })
          break
        default:
          break
      }
    }
    this.propLists = lists
    this._writeProps()
    this.setLandmarks(bundle.landmarks ?? [])
    if (bounds) this.fitShadow(bounds)
  }

  /**
   * The buildings that belong to one tile each — the camps, the boat at a
   * lake's edge, an aqueduct's arches. They are rebuilt only when the list
   * actually changes: the garden geometry is thrown away and remade on every
   * placement, and rebuilding a dozen little groups along with it would throw
   * away their meshes twenty times a game for nothing.
   */
  setLandmarks(list) {
    if (!this.landmarkRoot) {
      this.landmarkRoot = new THREE.Group()
      this.scene.add(this.landmarkRoot)
      this._landmarks = new Map()
    }
    const seen = new Set()
    for (const l of list) {
      seen.add(l.id)
      let g = this._landmarks.get(l.id)
      if (!g) {
        g = landmarkGroup(l.kind)
        if (!g) continue
        // built, not dropped: it comes up out of the ground with the tile's
        // trees, on the same clock
        g.scale.setScalar(0.01)
        g.userData.grow = 0
        this.landmarkRoot.add(g)
        this._landmarks.set(l.id, g)
      }
      g.position.set(l.x, 0, l.z)
      g.rotation.y = l.rot
    }
    for (const [id, g] of this._landmarks) {
      if (seen.has(id)) continue
      this.landmarkRoot.remove(g)
      this._landmarks.delete(id)
    }
  }

  /**
   * Grow the decorations on a tile in rather than having them appear whole.
   * Only the newest tile's props move, so the rest of the garden costs nothing
   * beyond rewriting the instance buffers for the third of a second it takes.
   */
  growTile(cells) {
    this.grown = { cells: new Set(cells), t: 0 }
  }

  _writeProps() {
    const g = this.grown
    const scaleOf = g
      ? (p) => {
          if (!g.cells.has(p.key)) return 1
          // each prop a little behind the last, so a tile's trees come up in a
          // ripple rather than in lockstep
          const k = Math.max(0, Math.min(1, (g.t - (p.tint ?? 0) * GROW_STAGGER) / GROW_TIME))
          // overshoot a touch and settle: things planted, not extruded
          return k >= 1 ? 1 : k * k * (3 - 2 * k) * (1 + 0.16 * Math.sin(k * Math.PI))
        }
      : null
    for (const k of Object.keys(this.propLists)) this.props[k].set(this.propLists[k], scaleOf)
  }

  fitShadow({ cx, cz, r }) {
    const c = this.sun.shadow.camera
    const pad = r + 3
    c.left = -pad
    c.right = pad
    c.top = pad
    c.bottom = -pad
    c.far = pad * 4 + 34
    c.updateProjectionMatrix()
    this.sunRadius = pad
    this.haze.position.set(cx, -0.55, cz)
    this.haze.scale.setScalar(r + 7)
  }

  /**
   * The one spot the errand wants, marked apart from the rest: a slow ring of
   * gold that turns above it. Forty identical lights say "anywhere"; this says
   * "here", which is the difference between an errand you can see and one you
   * have to solve twice.
   */
  setBeacon(at) {
    if (!this.beacon) {
      const g = new THREE.Group()
      const mat = new THREE.MeshBasicMaterial({
        color: lin(BEACON),
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
      this.beaconMat = mat
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.2, 0.26, 18), mat)
      ring.rotation.x = -Math.PI / 2
      g.add(ring)
      // three motes riding the ring, so it reads as alive rather than printed
      this.beaconMotes = []
      for (let i = 0; i < 3; i++) {
        const m = new THREE.Mesh(new THREE.IcosahedronGeometry(0.03, 0), mat)
        g.add(m)
        this.beaconMotes.push(m)
      }
      g.position.y = 0.05
      g.renderOrder = 2
      g.visible = false
      this.beacon = g
      this.scene.add(g)
    }
    if (!at) {
      this.beacon.visible = false
      return
    }
    this.beacon.position.set(at[0], 0.05, at[1])
    this.beacon.visible = true
  }

  /** Soft lights over every distinct spot a tile could go. */
  setHints(points) {
    const arr = new Float32Array(Math.max(1, points.length) * 3)
    for (let i = 0; i < points.length; i++) {
      arr[i * 3] = points[i][0]
      arr[i * 3 + 1] = 0.16
      arr[i * 3 + 2] = points[i][1]
    }
    this.hints.geometry.setAttribute('position', new THREE.BufferAttribute(arr, 3))
    this.hints.geometry.setDrawRange(0, points.length)
    this.hints.geometry.computeBoundingSphere()
  }

  setGhost(g) {
    if (!g) {
      this.ghost.visible = false
      this.ghostWater.visible = false
      this.rim.visible = false
      return
    }
    applyBuf(this.ghost.geometry, g.buf)
    applyBuf(this.ghostWater.geometry, g.water)
    applyBuf(this.rim.geometry, g.rim)
    this.ghost.visible = true
    this.ghostWater.visible = g.water.count > 0
    this.rim.visible = true
  }

  playFlash(buf) {
    applyBuf(this.flash.geometry, buf)
    this.flash.visible = true
    this.flashT = 1
  }

  // --- camera ----------------------------------------------------------------

  frame(bounds, instant = false) {
    const { cx, cz, r } = bounds
    this.lastBounds = bounds
    // Fit properly rather than guessing: at this pitch a garden of world radius
    // r covers 2r·sin(elevation) vertically, plus whatever the peak adds.
    const elev = Math.PI / 2 - this.polar
    const half = Math.tan((this.camera.fov * Math.PI) / 360)
    const maxY = this.peakY ?? 1
    // A phone has no margin to spare: the same border that reads as breathing
    // room on a laptop is a fifth of the short side, and the garden ends up a
    // postage stamp between two panels.
    const pad = this.narrow ? 0.35 : 0.9
    const vert = r * Math.sin(elev) + maxY * 0.5 * Math.cos(elev) + pad
    const horiz = r + pad
    const fit = Math.max(this.narrow ? 7 : 9, Math.max(vert / half, horiz / (half * this.camera.aspect)) * 0.96)
    // Once the camera has been moved by hand — and on a phone it always has,
    // because you have to zoom in to place anything — refitting after every
    // tile would yank the view back out from under the player. So it only ever
    // pulls *back*, and only when the garden has outgrown the frame.
    if (this.userFramed) {
      if (fit > this.wantDist) this.wantDist = fit
      return
    }
    this.wantTarget.set(cx, maxY * 0.22, cz)
    this.wantDist = fit
    if (instant) {
      this.target.copy(this.wantTarget)
      this.dist = this.wantDist
    }
  }

  /** Hand the camera to the player, or take it back on a new garden. */
  releaseCamera() {
    this.userFramed = true
  }
  resetCamera() {
    this.userFramed = false
  }

  orbit(dx, dy) {
    this.azimuth -= dx * 0.006
    this.polar = Math.min(1.42, Math.max(0.28, this.polar - dy * 0.005))
  }

  /** Swing the camera round by an angle rather than by a drag — what a
   *  two-finger twist turns into. */
  spin(radians) {
    this.azimuth += radians
  }

  zoom(f) {
    this.userFramed = true
    this.wantDist = Math.min(90, Math.max(4, this.wantDist * f))
  }

  pan(dx, dy) {
    this.userFramed = true
    const s = this.dist * 0.0016
    const ca = Math.cos(this.azimuth)
    const sa = Math.sin(this.azimuth)
    this.wantTarget.x += (-dx * ca - dy * sa) * s
    this.wantTarget.z += (dx * sa - dy * ca) * s
  }

  updateCamera(dt) {
    const k = 1 - Math.pow(0.0015, dt)
    this.target.lerp(this.wantTarget, k)
    this.dist += (this.wantDist - this.dist) * k
    const sp = Math.sin(this.polar)
    this.camera.position.set(
      this.target.x + this.dist * sp * Math.sin(this.azimuth),
      this.target.y + this.dist * Math.cos(this.polar),
      this.target.z + this.dist * sp * Math.cos(this.azimuth),
    )
    this.camera.lookAt(this.target)

    // Fog rides the camera, not the garden. Tying it to the garden's radius
    // alone was fine on a laptop and hopeless on a phone held upright: a tall
    // narrow frame puts the camera half again as far back for the same garden,
    // and the whole thing sat past the far plane as a pale smudge.
    const r = this.lastBounds?.r ?? 6
    this.scene.fog.near = Math.max(3, this.dist - r * 0.9)
    this.scene.fog.far = this.scene.fog.near + r * 1.9 + 30

    // Keep the sun a fixed 48° off the camera's shoulder. Orbit a fixed sun and
    // half the turns leave the garden flat or backlit; carry it with the camera
    // and the light always rakes across the tiles, whichever way you look.
    const pad = this.sunRadius ?? 10
    const az = this.azimuth + 0.84
    this.sun.position.set(
      this.target.x + pad * 0.8 * Math.sin(az),
      this.target.y + pad * 1.15 + 5,
      this.target.z + pad * 0.8 * Math.cos(az),
    )
    this.sun.target.position.copy(this.target)
    this.sun.target.updateMatrixWorld()
  }

  /**
   * Screen point → kite cell. The ground is flat, so one intersection with
   * y = 0 is exact — no iterating against a height field any more.
   */
  pick(nx, ny) {
    this.ray.setFromCamera({ x: nx, y: ny }, this.camera)
    this.plane.constant = 0
    const hit = this.ray.ray.intersectPlane(this.plane, this._v)
    if (!hit) return null
    const [a, b, k] = cellAt(hit.x / W, hit.z / W)
    return { cell: KEY(a, b, k), x: hit.x, z: hit.z }
  }

  project(x, y, z) {
    this._v.set(x, y, z).project(this.camera)
    return this._v
  }

  render(dt, t) {
    this.waterUniforms.uTime.value = t
    if (this.grown) {
      this.grown.t += dt
      if (this.grown.t > GROW_TIME + GROW_STAGGER) this.grown = null
      this._writeProps()
    }
    if (this._landmarks) {
      for (const g of this._landmarks.values()) {
        if (g.userData.grow === undefined) continue
        const k = (g.userData.grow += dt / (GROW_TIME * 1.8))
        if (k >= 1) {
          g.scale.setScalar(1)
          delete g.userData.grow
        } else {
          g.scale.setScalar(k * k * (3 - 2 * k) * (1 + 0.12 * Math.sin(k * Math.PI)))
        }
      }
    }
    this.hintMat.opacity = 0.34 + 0.2 * Math.sin(t * 1.6)
    if (this.beacon?.visible) {
      this.beacon.rotation.y = t * 0.8
      this.beaconMat.opacity = 0.6 + 0.35 * Math.sin(t * 2.6)
      this.beaconMotes.forEach((m, i) => {
        const a = t * 1.4 + (i / 3) * Math.PI * 2
        m.position.set(Math.cos(a) * 0.27, 0.04 + 0.05 * Math.sin(t * 3 + i), Math.sin(a) * 0.27)
      })
    }
    for (const w of this.wheels ?? []) if (w.running) w.wheel.rotation.z -= dt * 1.5
    this.rimMat.opacity = 0.62 + 0.3 * Math.sin(t * 3.4)
    if (this.flashT > 0) {
      this.flashT = Math.max(0, this.flashT - dt * 1.15)
      this.flashMat.opacity = Math.sin(Math.min(1, this.flashT) * Math.PI) * 0.5
      this.flash.visible = this.flashT > 0
    }
    this.renderer.render(this.scene, this.camera)
  }
}

/** A disc that is opaque in the middle and gone at the rim. */
function fadeTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(64, 64, 6, 64, 64, 64)
  grad.addColorStop(0, '#fff')
  grad.addColorStop(0.45, '#fff')
  grad.addColorStop(1, '#000')
  g.fillStyle = grad
  g.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(c)
}

/** A soft spark: bright core, long falloff. */
function glowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.18, 'rgba(255,246,214,0.85)')
  grad.addColorStop(0.55, 'rgba(255,232,168,0.22)')
  grad.addColorStop(1, 'rgba(255,232,168,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 64, 64)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

/** A soft vertical gradient, drawn as a full-screen background. */
function skyTexture() {
  const c = document.createElement('canvas')
  c.width = 4
  c.height = 256
  const g = c.getContext('2d')
  const grad = g.createLinearGradient(0, 0, 0, 256)
  grad.addColorStop(0, '#9fc4dc')
  grad.addColorStop(0.45, '#c9dfe8')
  grad.addColorStop(0.78, '#e4eee6')
  grad.addColorStop(1, '#eef1e4')
  g.fillStyle = grad
  g.fillRect(0, 0, 4, 256)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function applyBuf(geo, buf) {
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(buf.pos), 3))
  geo.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(buf.nrm), 3))
  geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(buf.col), 3))
  geo.computeBoundingSphere()
}

export { applyBuf, Buf }
