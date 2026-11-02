// jhana-3 — lotuses in the water (sukha).
//
// "Lotuses born in water, grown in water, never rising above it, pervaded by
// cool water." A cut-paper pond fills the spread; three lotuses sit in it, their
// petals opening with the page; light drifts through the water as caustics.
//
// What folds, and how:
// • The pond is glued flat to both pages: a painted bed card (stacked contour
//   bands), then the water — a translucent card per page a few millimetres
//   above it, carrying a slowly drifting caustic texture, with an additive
//   caustic-light card between the two. One card per page means the water
//   simply folds with its page; nothing spans the spine.
// • Lily pads are flat notched cut shapes lying on the water (one merged mesh
//   per page, so ten pads cost two draw calls).
// • Each lotus is a ring of petal FLAPS hinged round a cut seed-pod card on one
//   page. A flap's hinge line is tangent to its ring; its petal points outward
//   and lift(θ) raises it toward the page normal, so the petals form a cup that
//   opens with the spread and lies flat as it closes. Rings nest: inner rings
//   are hinged on smaller circles and always lift more steeply than the ring
//   outside them, and within a ring petals alternate high/low, so no petal ever
//   passes through a neighbour. Every blossom sits ≥ 0.2 from the spine, where
//   a petal leaning toward its page normal can't cross into the other page.
//   (The flaps are posed by paper; the petals are drawn as one InstancedMesh
//   that copies each flap's pose every frame — 54 petals, one draw call.)
// • Behind the pond, two reed-bank V-folds stand on the spine ('near': apex at
//   the far side, arms angled toward the reader; γ = π/2 stands the crease
//   straight up). Same α and γ, so the two banks stay parallel at every θ and
//   never cut each other. As the book closes they fall backward, away from the
//   lotuses, and their cut silhouettes are kept low enough near the spine to
//   land inside the far page edge.
// • Sinking flat: the engine closes a spread with zero clearance at the spine
//   (every page is a ray from one spine point, and a leaf is a thin wedge), so
//   anything held a few millimetres above its page would poke through the
//   closing leaf. Every flat layer's height above its page — bed, water, pads,
//   pods, the petals' hinge gap, the banks' offset — is scaled by sink(θ),
//   which reaches 0 as the spread closes and 1 well before it is half open.
// • Light is the only unreal thing: caustics, a soft glow in each blossom, one
//   small pink point light inside the largest cup, a low cool light from the
//   reader's side, and a few slow motes — all fading with frame.reveal. On the
//   in-breath the caustics brighten and the blossoms swell, very slightly.

import * as THREE from 'three'
import {
  POND,
  pondHalfShape,
  pondBedTexture,
  causticTexture,
  petalTexture,
  petalShape,
  padTexture,
  padShape,
  podShape,
  glowTexture,
} from './jhana-3/art.js'

const PI = Math.PI
const TAU = PI * 2
const DEG = PI / 180
const smooth = (e0, e1, x) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)))
  return t * t * (3 - 2 * t)
}
// how far flat layers stand off their page: 0 closed, 1 from θ ≈ 0.5 rad
const sinkAt = (theta) => smooth(0.02, 0.5, theta)
const CLOSED = 0.012 // radians
const FLAP_GAP = 0.002 // paper.flap's hinge height (paper.js)

// Heights above the page (page frame +y). Flaps hinge at 0.002 (paper's gap).
const Y_BED = 0.0024
const Y_LIGHT = 0.0034
const Y_POD = 0.0029
const Y_WATER = 0.0046
const Y_PAD = 0.0062

// ---- the blossoms ------------------------------------------------------------------
// X, Z: centre in spread coordinates (X < 0 = left page). k scales everything.
// Rings: n petals at angles phase + i·360/n, hinged on radius r0, length L,
// width w; lift alternates between the two values (radians at θ = π).
const RINGS = [
  { n: 8, phase: 22.5, r0: 0.064, L: 0.17, w: 0.104, lift: [0.5, 0.68], tint: '#f9d2db' },
  { n: 6, phase: 0, r0: 0.046, L: 0.142, w: 0.084, lift: [0.95, 1.08], tint: '#fde6ea' },
  { n: 4, phase: 45, r0: 0.032, L: 0.098, w: 0.058, lift: [1.22, 1.3], tint: '#ffffff' },
]
const LOTUSES = [
  { X: -0.33, Z: -0.04, k: 1.12, rot: 8, open: 1.0, pod: 0.026 },
  { X: 0.48, Z: 0.15, k: 0.84, rot: -14, open: 1.0, pod: 0.026 },
  // the smallest is still half a bud: every ring lifts nearer upright
  { X: 0.26, Z: -0.19, k: 0.6, rot: 30, open: 1.45, pod: 0.026 },
]

// Lily pads (spread X, Z, radius, notch direction in degrees, colour index).
const PADS = [
  [-0.74, 0.21, 0.115, 200, 0],
  [-0.84, -0.08, 0.075, 60, 1],
  [-0.1, 0.3, 0.075, 300, 2],
  [-0.12, -0.33, 0.058, 130, 1],
  [0.1, 0.07, 0.07, 20, 0],
  [0.8, -0.06, 0.1, 250, 2],
  [0.2, 0.34, 0.06, 160, 1],
  [0.83, 0.32, 0.065, 90, 0],
  [-0.48, 0.36, 0.045, 340, 2],
  [0.66, -0.17, 0.045, 210, 0],
]
const PAD_COLORS = ['#9dbf9f', '#86ad91', '#b0cba7']

// Reed banks (V-folds on the spine). α close to π/2 turns the panels to face
// the reader; the flat-fold limit is s·sin α ≤ (z + H/2) + t·cos α.
const BANK_ALPHA = 1.32
// Plant heights are fractions of the flat-fold limit at their spot.
const BANKS = [
  {
    // the far bank: pale, misty, the tall leaves
    z: -0.5,
    lift: 0.0062,
    color: '#dfece2',
    ground: 0.46,
    plants: {
      right: [
        { kind: 'leaf', t: 0.19, h: 0.86, R: 0.068, tilt: 0.12 },
        { kind: 'reed', t: 0.32, h: 0.97, w: 0.014, lean: 0.018 },
        { kind: 'bud', t: 0.41, h: 0.84, rb: 0.02 },
        { kind: 'leaf', t: 0.57, h: 0.93, R: 0.085, tilt: -0.08 },
        { kind: 'reed', t: 0.71, h: 0.98, w: 0.016, lean: -0.026 },
        { kind: 'reed', t: 0.745, h: 0.78, w: 0.012, lean: 0.02 },
        { kind: 'leaf', t: 0.86, h: 0.8, R: 0.06, tilt: 0.1 },
      ],
      left: [
        { kind: 'reed', t: 0.11, h: 0.92, w: 0.013, lean: 0.015 },
        { kind: 'leaf', t: 0.29, h: 0.92, R: 0.08, tilt: -0.1 },
        { kind: 'reed', t: 0.44, h: 0.96, w: 0.015, lean: 0.022 },
        { kind: 'bud', t: 0.52, h: 0.86, rb: 0.022 },
        { kind: 'leaf', t: 0.68, h: 0.88, R: 0.072, tilt: 0.1 },
        { kind: 'reed', t: 0.8, h: 0.97, w: 0.014, lean: -0.02 },
        { kind: 'reed', t: 0.835, h: 0.74, w: 0.011, lean: 0.018 },
      ],
    },
  },
  {
    // the near bank: low, soft sage, a few blades and one bud
    z: -0.44,
    lift: 0.0072,
    color: '#b2cfba',
    ground: 0.3,
    plants: {
      right: [
        { kind: 'reed', t: 0.12, h: 0.52, w: 0.013, lean: 0.03 },
        { kind: 'reed', t: 0.15, h: 0.4, w: 0.011, lean: -0.02 },
        { kind: 'reed', t: 0.47, h: 0.58, w: 0.014, lean: 0.035 },
        { kind: 'reed', t: 0.5, h: 0.44, w: 0.011, lean: -0.015 },
        { kind: 'bud', t: 0.64, h: 0.62, rb: 0.017 },
        { kind: 'reed', t: 0.8, h: 0.55, w: 0.013, lean: -0.03 },
      ],
      left: [
        { kind: 'reed', t: 0.07, h: 0.46, w: 0.012, lean: 0.02 },
        { kind: 'reed', t: 0.24, h: 0.56, w: 0.014, lean: -0.03 },
        { kind: 'reed', t: 0.27, h: 0.42, w: 0.011, lean: 0.02 },
        { kind: 'bud', t: 0.38, h: 0.6, rb: 0.017 },
        { kind: 'reed', t: 0.6, h: 0.5, w: 0.013, lean: 0.03 },
        { kind: 'reed', t: 0.88, h: 0.48, w: 0.012, lean: -0.02 },
      ],
    },
  },
]

export default {
  id: 'jhana-3',
  label: '3',
  title: 'Third Jhāna',
  pali: 'tatiya jhāna · sukha',
  line: 'Lotuses, drinking the cool water.',
  palette: { bg: '#0e1917', paper: '#f2ebe4', ink: '#4a3540', accent: '#f4b3c2' },
  audio: { root: 116.54, intervals: [0, 4, 7, 11, 16], brightness: 0.48, shimmer: 0.22, breathe: 0.5 },
  build,
}

function build(ctx) {
  const { group, paper, quality, H } = ctx
  const low = quality === 'low'
  const rnd = paper.rng('jhana-3 lotus pond')
  const root = paper.root
  const pageOf = (X) => (X < 0 ? root.left : root.right)
  const own = { geometries: [], materials: [], textures: [] }
  const keep = (list, x) => (list.push(x), x)

  // ---- pond bed + water --------------------------------------------------------------
  const bedTex = keep(own.textures, pondBedTexture(512, rnd)) // 512 at every quality: keeps the build quick
  const tintTex = keep(own.textures, causticTexture(256, 7, paper.rng('caustic-a'), 'tint'))
  const lightTex = keep(own.textures, causticTexture(256, 6, paper.rng('caustic-b'), 'light'))
  const bedMat = keep(own.materials, new THREE.MeshStandardMaterial({ map: bedTex, roughness: 0.95, side: THREE.DoubleSide }))
  const waterMat = keep(
    own.materials,
    new THREE.MeshStandardMaterial({
      color: '#e3f4f1',
      map: tintTex,
      roughness: 0.32,
      metalness: 0,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
  )
  const lightMat = keep(
    own.materials,
    new THREE.MeshBasicMaterial({
      color: '#d9fff6',
      map: lightTex,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    }),
  )

  // UVs in spread space, so one texture runs unbroken across the spine (both
  // page frames are the identity at θ = π: local x IS spread X).
  const bedUV = (x, z) => [(x - POND.X0) / (POND.X1 - POND.X0), 1 - (z - POND.Z0) / (POND.Z1 - POND.Z0)]
  const waterUV = (k) => (x, z) => [x * k, -z * k]
  function respan(mesh, fn) {
    const pos = mesh.geometry.attributes.position
    const uv = mesh.geometry.attributes.uv
    for (let i = 0; i < pos.count; i++) {
      const [u, v] = fn(pos.getX(i), pos.getZ(i))
      uv.setXY(i, u, v)
    }
    uv.needsUpdate = true
  }
  const sinking = [] // [object, height above its page] — scaled by sink(θ)
  const sunk = (frame, y) => (sinking.push([frame, y]), frame)
  for (const side of ['left', 'right']) {
    const page = root[side]
    const shape = pondHalfShape(side)
    const bed = paper.card(sunk(paper.place(page, { y: Y_BED }), Y_BED), { shape, material: bedMat })
    bed.castShadow = false
    respan(bed, bedUV)
    const light = paper.card(sunk(paper.place(page, { y: Y_LIGHT }), Y_LIGHT), { shape, material: lightMat })
    light.castShadow = light.receiveShadow = false
    light.renderOrder = 2
    respan(light, waterUV(1.25))
    const water = paper.card(sunk(paper.place(page, { y: Y_WATER }), Y_WATER), { shape, material: waterMat })
    water.castShadow = water.receiveShadow = false
    water.renderOrder = 3
    respan(water, waterUV(0.95))
  }

  // ---- lily pads: one merged mesh per page -------------------------------------------
  const padMeshes = []
  const padTex = keep(own.textures, padTexture(paper.rng('pads')))
  const padMat = keep(own.materials, new THREE.MeshStandardMaterial({ map: padTex, vertexColors: true, roughness: 0.9, side: THREE.DoubleSide }))
  for (const side of ['left', 'right']) {
    const parts = PADS.filter((p) => (side === 'left' ? p[0] < 0 : p[0] > 0))
    const pos = []
    const uv = []
    const col = []
    const idx = []
    const c = new THREE.Color()
    parts.forEach(([X, Z, R, rot, ci], n) => {
      const geo = new THREE.ShapeGeometry(padShape(R, rot * DEG), 14)
      const p = geo.attributes.position
      const base = pos.length / 3
      c.set(PAD_COLORS[ci]).offsetHSL(0, 0, (rnd() - 0.5) * 0.03)
      for (let i = 0; i < p.count; i++) {
        const sx = p.getX(i)
        const sy = p.getY(i)
        // shape plane (sx, sy) → page plane: x = X + sx, z = Z − sy (normal +y)
        pos.push(X + sx, Y_PAD + n * 0.0004, Z - sy)
        uv.push(0.5 + sx / (2 * R), 0.5 + sy / (2 * R))
        col.push(c.r, c.g, c.b)
      }
      const gi = geo.index.array
      for (let i = 0; i < gi.length; i += 3) idx.push(base + gi[i], base + gi[i + 1], base + gi[i + 2])
      geo.dispose()
    })
    const g = keep(own.geometries, new THREE.BufferGeometry())
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
    g.setIndex(idx)
    g.computeVertexNormals()
    const mesh = new THREE.Mesh(g, padMat)
    mesh.castShadow = mesh.receiveShadow = true
    root[side].add(mesh)
    padMeshes.push(mesh) // its heights are baked in: sinking scales y
  }

  // ---- lotuses -------------------------------------------------------------------------
  // Opening curve: sin²(θ/2) is 0 closed, ½ at a right angle, 1 open — the
  // petals barely stir until the page is well open, so nothing reaches across.
  let swell = 0
  const opening = (th) => Math.sin(th / 2) ** 2
  const petals = [] // { flap, page, L, w, dir }
  const podMat = paper.material({ color: '#f1e3a0', emissive: '#6b5a20', roughness: 0.85 })
  const petalCol = []
  for (const lotus of LOTUSES) {
    const page = pageOf(lotus.X)
    const side = lotus.X < 0 ? 'left' : 'right'
    const k = lotus.k
    for (const ring of RINGS) {
      for (let i = 0; i < ring.n; i++) {
        const phi = (lotus.rot + ring.phase + (360 * i) / ring.n) * DEG
        const hx = lotus.X + ring.r0 * k * Math.cos(phi)
        const hz = lotus.Z + ring.r0 * k * Math.sin(phi)
        const peak = Math.min(1.48, ring.lift[i % 2] * lotus.open)
        // right page: body direction (cos α, −sin α) → α = −φ; left page mirrors
        // it, (−cos α, −sin α) → α = φ + π.
        const flap = paper.flap({
          side,
          x: Math.abs(hx),
          z: hz,
          alpha: side === 'right' ? -phi : phi + PI,
          length: ring.L * k,
          lift: (th) => opening(th) * (peak + 0.05 * swell),
        })
        const jitter = 0.94 + 0.12 * rnd()
        petals.push({ flap, page, L: ring.L * k * jitter, w: ring.w * k, dir: side === 'right' ? 1 : -1 })
        petalCol.push(ring.tint)
      }
    }
    // the seed pod, a cut disc with its seed holes, flat in the cup's heart
    const pod = paper.card(sunk(paper.place(page, { x: Math.abs(lotus.X), y: Y_POD, z: lotus.Z }), Y_POD), {
      shape: podShape(lotus.pod * k),
      material: podMat,
    })
    pod.castShadow = false
  }

  const petalGeo = keep(own.geometries, new THREE.ShapeGeometry(petalShape(), 8))
  // shape (s, t) in the xy plane → panel frame: x = s, z = −t, normal +y
  petalGeo.rotateX(-PI / 2)
  {
    const p = petalGeo.attributes.position
    const uv = petalGeo.attributes.uv
    for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i), 0.5 - p.getZ(i))
  }
  const petalTex = keep(own.textures, petalTexture())
  // a little emissive: lotus petals are translucent, and the cup's shaded
  // inner faces should glow faintly rather than go dark
  const petalMat = keep(
    own.materials,
    new THREE.MeshStandardMaterial({
      map: petalTex,
      emissive: '#ffd3dc',
      emissiveMap: petalTex,
      emissiveIntensity: 0.3,
      roughness: 0.82,
      side: THREE.DoubleSide,
    }),
  )
  const petalMesh = new THREE.InstancedMesh(petalGeo, petalMat, petals.length)
  petalMesh.castShadow = petalMesh.receiveShadow = true
  petalMesh.frustumCulled = false
  const tint = new THREE.Color()
  petals.forEach((p, i) => petalMesh.setColorAt(i, tint.set(petalCol[i])))
  group.add(petalMesh)

  // ---- reed banks ----------------------------------------------------------------------
  const sa = Math.sin(BANK_ALPHA)
  const ca = Math.cos(BANK_ALPHA)
  const T = 0.96 // glue-line length: the far end lands 0.93 from the spine
  for (const bank of BANKS) {
    const fold = paper.vFold({ z: bank.z, alpha: BANK_ALPHA, gamma: PI / 2, length: 0.4, toward: 'near' })
    // a touch of self-light: the banks face the reader, edge-on to the key
    const mat = paper.material({ color: bank.color, emissive: bank.color, emissiveIntensity: 0.14, roughness: 0.93 })
    for (const side of ['left', 'right']) {
      // offset the card toward its reader-facing side, which faces UP once the
      // bank has fallen back flat, so it lands on top of the pond cards
      const frame = sunk(paper.place(fold[side], { y: -bank.lift }), -bank.lift)
      paper.card(frame, { shape: bankShape(bank, side, sa, ca, T, H), material: mat })
    }
  }

  // ---- light: glows, a point light in the largest cup, motes -------------------------
  const glowTex = keep(own.textures, glowTexture())
  const glows = LOTUSES.map((lotus, i) => {
    const m = keep(
      own.materials,
      new THREE.SpriteMaterial({ map: glowTex, color: i ? '#ffc4d2' : '#ffd2c4', transparent: true, opacity: 0, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending }),
    )
    const s = new THREE.Sprite(m)
    s.renderOrder = 5
    s.userData = { page: pageOf(lotus.X), local: new THREE.Vector3(lotus.X, 0.04 * lotus.k, lotus.Z), size: 0.24 * lotus.k }
    group.add(s)
    return s
  })
  const heart = new THREE.PointLight('#ffb5c6', 0, 0.9, 2)
  group.add(heart)
  // a low, cool light from the reader's side: the key comes from high up, so
  // the faces turned toward the reader (the reed banks, the outer faces of the
  // upright inner petals) would otherwise sit in murk
  const front = new THREE.DirectionalLight('#eef6f4', 0)
  front.position.set(-0.4, 0.55, 2)
  const frontTarget = new THREE.Object3D()
  group.add(front, frontTarget)
  front.target = frontTarget

  const moteCount = low ? 12 : 24
  const motePos = new Float32Array(moteCount * 3)
  const moteSeed = new Float32Array(moteCount * 4)
  for (let i = 0; i < moteCount; i++) {
    moteSeed[i * 4] = (rnd() - 0.5) * 1.6
    moteSeed[i * 4 + 1] = 0.06 + rnd() * 0.36
    moteSeed[i * 4 + 2] = -0.45 + rnd() * 0.8
    moteSeed[i * 4 + 3] = rnd() * TAU
  }
  const moteGeo = keep(own.geometries, new THREE.BufferGeometry())
  moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3))
  const moteMat = keep(
    own.materials,
    new THREE.PointsMaterial({ map: glowTex, color: '#fff2f5', size: 0.03, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }),
  )
  const motes = new THREE.Points(moteGeo, moteMat)
  motes.renderOrder = 4
  motes.frustumCulled = false
  group.add(motes)

  // ---- per frame -----------------------------------------------------------------------
  const m4 = new THREE.Matrix4()
  const local = new THREE.Matrix4()
  const drop = new THREE.Matrix4()
  const v3 = new THREE.Vector3()
  let breathEase = 0

  return {
    update(frame) {
      const { time, reveal } = frame
      breathEase += (frame.breath - breathEase) * Math.min(1, frame.dt * 2.5)
      const b = breathEase
      swell = b

      // Fully closed (under 0.7°) the spread is sandwiched between leaves that
      // meet with no thickness at the spine; hide it rather than let its
      // flattened cards z-fight along that line. (The engine re-shows the
      // group every frame before calling update.)
      group.visible = frame.theta > CLOSED
      const sink = sinkAt(frame.theta)
      for (let i = 0; i < sinking.length; i++) sinking[i][0].position.y = sinking[i][1] * sink
      for (let i = 0; i < padMeshes.length; i++) padMeshes[i].scale.y = Math.max(1e-3, sink)

      // petals copy their flap's pose (paper has already posed the flaps),
      // with the flap's hinge gap sunk like everything else
      root.left.updateMatrix()
      root.right.updateMatrix()
      drop.makeTranslation(0, -FLAP_GAP * (1 - sink), 0)
      const g = 1 + 0.022 * b
      for (let i = 0; i < petals.length; i++) {
        const p = petals[i]
        p.flap.panel.updateMatrix()
        // left-page flaps' bodies run along −x: turn the petal half a turn
        local.makeScale(p.dir * p.L * g, 1, p.dir * p.w * g)
        m4.multiplyMatrices(p.page.matrix, drop).multiply(p.flap.panel.matrix).multiply(local)
        petalMesh.setMatrixAt(i, m4)
      }
      petalMesh.instanceMatrix.needsUpdate = true

      // the water's light drifts, two networks crossing very slowly
      tintTex.offset.set(time * 0.0042, time * 0.0027)
      lightTex.offset.set(-time * 0.0036, time * 0.0049)
      lightMat.opacity = reveal * (0.13 + 0.09 * b)

      // The glows draw without a depth test (soft light through the petals),
      // so they wait until the page is past upright: before that a leaf can
      // stand between them and the reader.
      const glowOn = reveal * smooth(0.5, 0.75, frame.openness)
      for (let i = 0; i < glows.length; i++) {
        const s = glows[i]
        const { page, local: L, size } = s.userData
        v3.copy(L).applyMatrix4(page.matrix)
        s.position.copy(v3)
        s.material.opacity = glowOn * (0.14 + 0.12 * b)
        s.scale.setScalar(size * (0.9 + 0.12 * b) * (0.4 + 0.6 * reveal))
        s.visible = glowOn > 0.001
      }
      heart.position.copy(glows[0].position)
      front.intensity = 0.55 * reveal
      heart.intensity = reveal * (0.03 + 0.025 * b)
      petalMat.emissiveIntensity = 0.26 + 0.08 * b * reveal

      for (let i = 0; i < moteCount; i++) {
        const ph = moteSeed[i * 4 + 3]
        motePos[i * 3] = moteSeed[i * 4] + 0.05 * Math.sin(time * 0.05 + ph)
        motePos[i * 3 + 1] = moteSeed[i * 4 + 1] + 0.03 * Math.sin(time * 0.07 + ph * 1.7) + 0.015 * b
        motePos[i * 3 + 2] = moteSeed[i * 4 + 2] + 0.04 * Math.cos(time * 0.045 + ph)
      }
      moteGeo.attributes.position.needsUpdate = true
      moteMat.opacity = reveal * reveal * (0.35 + 0.35 * b)
      motes.visible = reveal > 0.001
    },
    dispose() {
      for (const x of own.geometries) x.dispose()
      for (const x of own.materials) x.dispose()
      for (const x of own.textures) x.dispose()
      petalMesh.dispose()
      heart.dispose()
      front.dispose()
      paper.dispose()
    },
  }
}

// A reed bank's silhouette in V-panel coordinates (s up from the glue line, t
// out along it), traced as one outline: a low rolling bank, and standing out of
// it reeds (tapering, leaning blades), lotus leaves held up on stalks (seen edge
// on: a shallow cupped crescent) and closed buds. Every point is kept under the
// flat-fold limit so the bank lies inside the far page edge when closed. Both
// panels start at the same height at t = 0 (the crease), so the bank is
// continuous across the spine; past that each side has its own plants.
function bankShape(bank, side, sa, ca, T, H) {
  const lim = (t) => (bank.z + H / 2 - 0.012 + t * ca) / sa
  const ph = side === 'left' ? 1.3 : 0.2
  // rolling, but the same height on both panels at the crease (t = 0)
  const ground = (t) => {
    const roll = (0.2 * Math.sin(t * 9 + ph) + 0.08 * Math.sin(t * 23 + ph * 2.3)) * smooth(0, 0.12, t)
    return lim(t) * bank.ground * (0.8 + roll) * (1 - smooth(T - 0.16, T, t))
  }
  const out = [] // (t, s) pairs, walked left → right over the top
  const push = (t, s) => out.push([t, Math.max(0, Math.min(lim(t) * 0.985, s))])
  const SW = 0.0065 // stalk width

  const crowns = {
    // a tapering blade, leaning by `lean` at its tip
    reed({ t, h, w = 0.016, lean = 0 }) {
      const g0 = ground(t) - 0.004
      const top = h * lim(t + lean)
      const N = 10
      for (let i = 0; i <= N; i++) {
        const u = i / N
        const c = t + lean * u * u
        push(c - (w / 2) * (1 - u) ** 0.9, g0 + (top - g0) * u)
      }
      for (let i = N - 1; i >= 0; i--) {
        const u = i / N
        const c = t + lean * u * u
        push(c + (w / 2) * (1 - u) ** 0.9, g0 + (top - g0) * u)
      }
      return t + w / 2
    },
    // a lotus leaf on its stalk, edge on: underside a parabola, rim a line
    leaf({ t, h, R, tilt = 0, cup = 0.3 }) {
      const top = h * lim(t)
      const hs = top - cup * R
      const g0 = ground(t) - 0.004
      const under = (x) => hs + cup * R * (x / R) ** 2 + tilt * x
      const rim = (x) => hs + cup * R + tilt * x + 0.004 * Math.sin(x * 70 + t * 9)
      push(t - SW / 2, g0)
      push(t - SW / 2, under(-SW / 2))
      const N = 14
      for (let i = 1; i <= N; i++) {
        const x = -SW / 2 - (R - SW / 2) * (i / N)
        push(t + x, under(x))
      }
      for (let i = 1; i < 2 * N; i++) {
        const x = -R + (2 * R * i) / (2 * N)
        push(t + x, rim(x))
      }
      for (let i = N; i >= 1; i--) {
        const x = SW / 2 + (R - SW / 2) * (i / N)
        push(t + x, under(x))
      }
      push(t + SW / 2, under(SW / 2))
      push(t + SW / 2, g0)
      return t + SW / 2
    },
    // a closed bud: a pointed teardrop on a stalk
    bud({ t, h, rb }) {
      const tip = h * lim(t)
      const base = tip - 2.7 * rb
      const g0 = ground(t) - 0.004
      const hw = (v) => Math.max(SW / 2, rb * Math.sin(PI * v ** 0.72) ** 0.85)
      push(t - SW / 2, g0)
      const N = 14
      for (let i = 0; i <= N; i++) push(t - hw(i / N), base + 2.7 * rb * (i / N))
      for (let i = N - 1; i >= 0; i--) push(t + hw(i / N), base + 2.7 * rb * (i / N))
      push(t + SW / 2, g0)
      return t + SW / 2
    },
  }

  const items = bank.plants[side].slice().sort((p, q) => p.t - q.t)
  out.push([0, 0])
  let t = 0
  for (const it of items) {
    const left = it.t - (it.kind === 'reed' ? (it.w ?? 0.016) / 2 : SW / 2)
    for (; t < left; t += 0.006) push(t, ground(t))
    t = crowns[it.kind](it) + 0.004
  }
  for (; t < T; t += 0.006) push(t, ground(t))
  push(T, ground(T))
  out.push([T, 0])
  return new THREE.Shape(out.map(([tt, ss]) => new THREE.Vector2(ss, tt)))
}
