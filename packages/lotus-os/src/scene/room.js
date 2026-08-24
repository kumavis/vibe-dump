// room.js — the shell the workbench stands in.
//
// Walls, the window and the light coming through it, and everything bolted
// down rather than set on the desk: shelf, pipes, bulb, crates, plant, and the
// cables that hang between the lens and the subject. Built in world space,
// because this is the one module allowed to be axis-aligned — architecture is.
// The shaft direction is copied off the directional light in index.js; a beam
// that disagrees with the shadows it is supposedly casting reads as a bug.

import * as THREE from 'three'
import {
  PALETTE,
  MAT,
  box,
  cyl,
  cable,
  glowSprite,
  glowTexture,
  decalTexture,
  contactDarken,
  tintGeometry,
  ensureColors,
  jitter,
  makeCanvasTexture,
} from './materials.js'

const X_IN = 2.1
const Z_BACK = -1.55
const Z_FRONT = 2.1
const Y_CEIL = 2.45
const T = 0.2 // wall thickness; thin enough to be cheap, thick enough to have a reveal

const WALL_W = X_IN * 2 + T * 2
const WALL_D = Z_FRONT - Z_BACK + T
const WALL_CZ = (Z_FRONT + Z_BACK - T) / 2

// The window, given as the hole in the left wall rather than as a frame.
const WIN = { y: 1.78, z: 0.3, w: 1.0, h: 0.78 }

// index.js puts the directional at (-3.2, 3.1, 1.1) aiming (0.2, 0.6, -1.0).
const SUN = new THREE.Vector3(3.4, -2.5, -2.1).normalize()
const SHAFT_LEN = 3.5
const SHAFT_R0 = 0.42
const SHAFT_R1 = 0.78
const COLD = 0xb9a8ff

const FLOOR_PLANE = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
const CEIL_PLANE = new THREE.Plane(new THREE.Vector3(0, 1, 0), -Y_CEIL)
const BACK_PLANE = new THREE.Plane(new THREE.Vector3(0, 0, 1), -Z_BACK)
const LEFT_PLANE = new THREE.Plane(new THREE.Vector3(1, 0, 0), X_IN)
const RIGHT_PLANE = new THREE.Plane(new THREE.Vector3(1, 0, 0), -X_IN)

const rnd = (a, b) => a + Math.random() * (b - a)
const TAU = Math.PI * 2

/**
 * Squash a box's horizontal rows toward its underside. contactDarken has only
 * vertices to work with, so a wall with evenly spaced rows smears its skirting
 * grime over half a metre instead of the eight centimetres it belongs in.
 */
const crowdBottom = (geo, h, power = 1.7) => {
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const k = THREE.MathUtils.clamp((pos.getY(i) + h / 2) / h, 0, 1)
    pos.setY(i, k ** power * h - h / 2)
  }
  pos.needsUpdate = true
  return geo
}

/**
 * A piece of architecture. Deliberately not edgeDirt()-ed: that pass vignettes
 * every triangle toward its own centroid, which on a subdivided slab draws the
 * wireframe back onto the wall.
 */
const slab = (w, h, d, segs, material, tint = 0xffffff, grade = false) => {
  const geo = new THREE.BoxGeometry(w, h, d, segs[0], segs[1], segs[2])
  if (grade) crowdBottom(geo, h)
  tintGeometry(geo, tint, 0.14)
  const mesh = new THREE.Mesh(geo, material)
  mesh.receiveShadow = true
  // Walls must not occlude the window directional or the room goes out.
  mesh.castShadow = false
  return mesh
}

/** The vertical ramp that stops the shaft from looking like a plastic tube. */
const shaftRamp = () =>
  makeCanvasTexture(
    'shaft-ramp',
    1,
    256,
    (ctx, w, h) => {
      const g = ctx.createLinearGradient(0, 0, 0, h)
      g.addColorStop(0, '#ffffff')
      g.addColorStop(0.3, '#a0a0a0')
      g.addColorStop(0.72, '#242424')
      g.addColorStop(1, '#000000')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)
    },
    { srgb: false, wrap: THREE.ClampToEdgeWrapping },
  )

export function createRoom({ sfx = null, quality = 1 } = {}) {
  const q = THREE.MathUtils.clamp(quality, 0.35, 1)
  const group = new THREE.Group()
  group.name = 'room'

  const add = (obj, x, y, z) => {
    if (x !== undefined) obj.position.set(x, y, z)
    group.add(obj)
    return obj
  }

  // --- shell --------------------------------------------------------------

  const concrete = MAT.concrete()

  const floor = add(slab(WALL_W, T, WALL_D, [10, 1, 9], concrete, 0xf2eff8), 0, -T / 2, WALL_CZ)
  contactDarken(floor, [BACK_PLANE, LEFT_PLANE, RIGHT_PLANE], { radius: 0.34, floor: 0.38 })

  const backWall = add(slab(WALL_W, Y_CEIL, T, [8, 6, 1], concrete, 0xe6e2f0, true), 0, Y_CEIL / 2, Z_BACK - T / 2)
  contactDarken(backWall, [LEFT_PLANE, RIGHT_PLANE, CEIL_PLANE], { radius: 0.3, floor: 0.5 })
  contactDarken(backWall, [FLOOR_PLANE], { radius: 0.1, floor: 0.34 })

  const rightWall = add(slab(T, Y_CEIL, WALL_D, [1, 6, 7], concrete, 0xdcd7e8, true), X_IN + T / 2, Y_CEIL / 2, WALL_CZ)
  contactDarken(rightWall, [BACK_PLANE, CEIL_PLANE], { radius: 0.3, floor: 0.5 })
  contactDarken(rightWall, [FLOOR_PLANE], { radius: 0.1, floor: 0.34 })

  // The left wall is four pieces around the window hole rather than one slab
  // with a texture pretending to be a hole. The reveal is worth the meshes.
  const winZ0 = WIN.z - WIN.w / 2
  const winZ1 = WIN.z + WIN.w / 2
  const winY0 = WIN.y - WIN.h / 2
  const winY1 = WIN.y + WIN.h / 2
  const leftX = -X_IN - T / 2

  const leftPieces = [
    slab(T, winY0, WALL_D, [1, 4, 7], concrete, 0xdcd7e8, true),
    slab(T, Y_CEIL - winY1, WALL_D, [1, 2, 6], concrete, 0xd2cde0),
    slab(T, WIN.h, winZ0 - (Z_BACK - T), [1, 2, 3], concrete, 0xcfc9de),
    slab(T, WIN.h, Z_FRONT - winZ1, [1, 2, 3], concrete, 0xcfc9de),
  ]
  add(leftPieces[0], leftX, winY0 / 2, WALL_CZ)
  add(leftPieces[1], leftX, (winY1 + Y_CEIL) / 2, WALL_CZ)
  add(leftPieces[2], leftX, WIN.y, (Z_BACK - T + winZ0) / 2)
  add(leftPieces[3], leftX, WIN.y, (winZ1 + Z_FRONT) / 2)
  contactDarken(leftPieces[0], [BACK_PLANE, CEIL_PLANE], { radius: 0.3, floor: 0.5 })
  contactDarken(leftPieces[0], [FLOOR_PLANE], { radius: 0.1, floor: 0.34 })
  for (const p of leftPieces.slice(1)) contactDarken(p, [BACK_PLANE, CEIL_PLANE], { radius: 0.3, floor: 0.55 })

  const ceiling = add(slab(WALL_W, T, WALL_D, [5, 1, 4], MAT.plaster(PALETTE.wallDark), 0xd0cade), 0, Y_CEIL + T / 2, WALL_CZ)
  contactDarken(ceiling, [BACK_PLANE, LEFT_PLANE, RIGHT_PLANE], { radius: 0.36, floor: 0.44 })

  // --- window -------------------------------------------------------------

  const paneGeo = new THREE.PlaneGeometry(3.2, 2.4)
  const sky = new THREE.Mesh(paneGeo, MAT.emissive(COLD, 0.5))
  sky.rotation.y = Math.PI / 2
  add(sky, -3.7, 1.9, WIN.z)

  // Two silhouettes and a scatter of lit windows is the whole city. Anything
  // more detailed is invisible through a one-metre hole at four metres.
  const cityMat = MAT.plaster(PALETTE.void)
  add(jitter(box(0.5, 2.1, 0.7, cityMat, { dirt: 0.05 }), 0.04, 0.01), -3.05, 1.05, WIN.z - 0.75)
  add(jitter(box(0.42, 1.5, 0.55, cityMat, { dirt: 0.05 }), 0.04, 0.01), -2.85, 0.75, WIN.z + 0.62)

  const cityCount = 44
  const cityPos = new Float32Array(cityCount * 3)
  const cityCol = new Float32Array(cityCount * 3)
  const cityInks = [new THREE.Color(PALETTE.sodium), new THREE.Color(PALETTE.amber), new THREE.Color(COLD)]
  for (let i = 0; i < cityCount; i++) {
    const far = Math.random() < 0.5
    cityPos[i * 3] = far ? -2.78 : -2.62
    cityPos[i * 3 + 1] = rnd(0.7, far ? 2.0 : 1.45)
    cityPos[i * 3 + 2] = WIN.z + (far ? rnd(-1.05, -0.45) : rnd(0.36, 0.88))
    const c = cityInks[Math.floor(Math.random() * cityInks.length)]
    const k = rnd(0.35, 1)
    cityCol[i * 3] = c.r * k
    cityCol[i * 3 + 1] = c.g * k
    cityCol[i * 3 + 2] = c.b * k
  }
  const cityGeo = new THREE.BufferGeometry()
  cityGeo.setAttribute('position', new THREE.BufferAttribute(cityPos, 3))
  cityGeo.setAttribute('color', new THREE.BufferAttribute(cityCol, 3))
  const cityDots = new THREE.Points(
    cityGeo,
    new THREE.PointsMaterial({
      size: 0.03,
      sizeAttenuation: true,
      map: glowTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: false,
    }),
  )
  group.add(cityDots)

  const frameMat = MAT.paint(PALETTE.greyMetal, { rough: 0.6, metal: 0.4 })
  add(box(0.17, 0.05, WIN.w + 0.08, MAT.paint(PALETTE.wall, { rough: 0.9, metal: 0.05 })), -X_IN - 0.03, winY0 - 0.02, WIN.z)
  for (const dz of [-WIN.w / 6, WIN.w / 6]) add(box(0.05, WIN.h, 0.018, frameMat), -X_IN - 0.06, WIN.y, WIN.z + dz)
  add(box(0.05, 0.018, WIN.w, frameMat), -X_IN - 0.06, WIN.y + 0.02, WIN.z)

  // --- the shaft ----------------------------------------------------------

  const shaftOrigin = new THREE.Vector3(-X_IN - 0.14, WIN.y, WIN.z)
  const shaftGeo = new THREE.CylinderGeometry(SHAFT_R0, SHAFT_R1, SHAFT_LEN, 14, 1, true)
  shaftGeo.translate(0, -SHAFT_LEN / 2, 0)
  const shaftMat = new THREE.MeshBasicMaterial({
    color: COLD,
    alphaMap: shaftRamp(),
    transparent: true,
    opacity: 0.06,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    // BackSide keeps the near cap out of the lens when the camera flies into it.
    side: THREE.BackSide,
    fog: false,
  })
  const shaft = new THREE.Mesh(shaftGeo, shaftMat)
  shaft.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), SUN)
  shaft.position.copy(shaftOrigin)
  shaft.renderOrder = 2
  group.add(shaft)

  // A shaft with no foot on the floor looks like a prop of a shaft.
  const pool = new THREE.Mesh(
    new THREE.PlaneGeometry(1.35, 0.85),
    new THREE.MeshBasicMaterial({
      map: glowTexture(),
      color: COLD,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: false,
    }),
  )
  pool.rotation.set(-Math.PI / 2, Math.atan2(-SUN.z, SUN.x), 0, 'YXZ')
  pool.renderOrder = 1
  add(pool, 0.5, 0.006, -0.5)

  // --- dust ---------------------------------------------------------------

  const BU = new THREE.Vector3(0, 1, 0).cross(SUN).normalize()
  const BV = new THREE.Vector3().copy(SUN).cross(BU).normalize()

  const motes = Math.round(300 * q)
  const dustPos = new Float32Array(motes * 3)
  const dustCol = new Float32Array(motes * 3)
  const dustS = new Float32Array(motes)
  const dustR = new Float32Array(motes)
  const dustA = new Float32Array(motes)
  const dustP = new Float32Array(motes)
  const dustF = new Float32Array(motes)
  const dustV = new Float32Array(motes)
  for (let i = 0; i < motes; i++) {
    dustS[i] = Math.random() * SHAFT_LEN
    dustR[i] = Math.sqrt(Math.random())
    dustA[i] = Math.random() * TAU
    dustP[i] = Math.random() * TAU
    dustF[i] = rnd(0.16, 0.6)
    dustV[i] = rnd(0.009, 0.024)
  }

  const dustGeo = new THREE.BufferGeometry()
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3))
  dustGeo.setAttribute('color', new THREE.BufferAttribute(dustCol, 3))
  dustGeo.boundingSphere = new THREE.Sphere(
    shaftOrigin.clone().addScaledVector(SUN, SHAFT_LEN / 2),
    SHAFT_LEN / 2 + SHAFT_R1 + 0.2,
  )
  const dust = new THREE.Points(
    dustGeo,
    new THREE.PointsMaterial({
      size: 0.009,
      sizeAttenuation: true,
      map: glowTexture(),
      color: 0xe8dcff,
      vertexColors: true,
      transparent: true,
      opacity: 0.38,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: false,
    }),
  )
  dust.renderOrder = 3
  group.add(dust)

  const driftDust = (dt, t) => {
    for (let i = 0; i < motes; i++) {
      let s = dustS[i] + dustV[i] * dt
      if (s > SHAFT_LEN) s -= SHAFT_LEN
      dustS[i] = s
      const k = s / SHAFT_LEN
      const rr = dustR[i] * (SHAFT_R0 + (SHAFT_R1 - SHAFT_R0) * k) * 1.05
      const u = Math.cos(dustA[i]) * rr + Math.sin(t * dustF[i] + dustP[i]) * 0.024
      const v = Math.sin(dustA[i]) * rr + Math.cos(t * dustF[i] * 0.77 + dustP[i] * 1.7) * 0.018
      const j = i * 3
      dustPos[j] = shaftOrigin.x + SUN.x * s + BU.x * u + BV.x * v
      dustPos[j + 1] = shaftOrigin.y + SUN.y * s + BU.y * u + BV.y * v
      dustPos[j + 2] = shaftOrigin.z + SUN.z * s + BU.z * u + BV.z * v
      const fade = Math.min(1, k * 12) * (1 - k)
      dustCol[j] = dustCol[j + 1] = dustCol[j + 2] = fade
    }
    dustGeo.attributes.position.needsUpdate = true
    dustGeo.attributes.color.needsUpdate = true
  }
  driftDust(0, 0)

  // --- neon ---------------------------------------------------------------

  const neon = new THREE.Group()
  neon.position.set(1.15, 1.68, Z_BACK + 0.06)
  neon.rotation.z = 0.03
  group.add(neon)

  const neonPlate = box(0.52, 0.66, 0.022, MAT.paint(PALETTE.wallDark, { rough: 0.75, metal: 0.2 }), { dirt: 0.22 })
  neonPlate.position.z = -0.032
  neon.add(neonPlate)

  const neonMat = MAT.emissive(PALETTE.violet, 2.4).clone()
  const neonBase = neonMat.color.clone()

  const tubeOf = (pts, closed, segs) =>
    new THREE.Mesh(
      ensureColors(
        new THREE.TubeGeometry(
          new THREE.CatmullRomCurve3(
            pts.map(([x, y]) => new THREE.Vector3(x, y, rnd(-0.004, 0.004))),
            closed,
          ),
          segs,
          0.011,
          5,
          closed,
        ),
      ),
      neonMat,
    )

  // A lotus bud in outline. Words in neon at this resolution turn to mush.
  neon.add(
    tubeOf(
      [
        [0, -0.21],
        [0.15, -0.12],
        [0.185, 0.02],
        [0.13, 0.18],
        [0, 0.3],
        [-0.13, 0.18],
        [-0.185, 0.02],
        [-0.15, -0.12],
      ],
      true,
      44,
    ),
  )
  if (q > 0.55) {
    for (const s of [1, -1]) {
      neon.add(
        tubeOf(
          [
            [s * 0.2, -0.14],
            [s * 0.29, 0.02],
            [s * 0.26, 0.16],
            [s * 0.17, 0.25],
          ],
          false,
          10,
        ),
      )
    }
  }

  const neonGlow = glowSprite(PALETTE.violet, 0.055, { core: 0.4, mid: 0.12, halo: 0.035 })
  neonGlow.position.set(0, 0.04, 0.04)
  neon.add(neonGlow)

  const NEON_W = 2.3
  const neonLight = new THREE.PointLight(PALETTE.magenta, NEON_W, 2.1, 2)
  neonLight.castShadow = false // the shadow budget is two casters and both live in index.js
  neonLight.position.set(0, 0.05, 0.16)
  neon.add(neonLight)

  let dipEnd = 3 + Math.random() * 4
  let dipLen = 0.16

  // --- shelf --------------------------------------------------------------

  const SHELF_Y = 1.52
  const shelfMat = MAT.wood(PALETTE.plywood)
  const bracketMat = MAT.paint(PALETTE.greyMetal, { rough: 0.62, metal: 0.4 })

  const plank = add(box(1.2, 0.032, 0.24, shelfMat, { dirt: 0.24 }), -1.35, SHELF_Y - 0.016, Z_BACK + 0.12)
  plank.rotation.y = 0.012
  contactDarken(plank, [BACK_PLANE], { radius: 0.06, floor: 0.55 })

  for (const bx of [-1.78, -0.94]) {
    add(box(0.02, 0.2, 0.022, bracketMat), bx, SHELF_Y - 0.13, Z_BACK + 0.014)
    add(box(0.02, 0.022, 0.19, bracketMat), bx, SHELF_Y - 0.043, Z_BACK + 0.1)
  }

  const shelfItems = [
    () => cyl(0.045, 0.045, 0.1, MAT.metal(PALETTE.aluminium, 0.52), 10),
    () => box(0.1, 0.14, 0.08, MAT.paint(PALETTE.plastic, { rough: 0.66, metal: 0.1 })),
    () => box(0.16, 0.055, 0.11, MAT.card(), { dirt: 0.26 }),
    () => cyl(0.032, 0.038, 0.17, MAT.plastic(0x2c3a34, 0.5), 10),
    () => box(0.07, 0.09, 0.07, MAT.paint(PALETTE.wallDark, { rough: 0.5, metal: 0.4, chipped: true, substrate: PALETTE.aluminium })),
    () => new THREE.Mesh(ensureColors(new THREE.TorusGeometry(0.05, 0.014, 5, 10)), MAT.metal(PALETTE.copper, 0.55)),
  ]
  const shelfSlots = [-1.85, -1.66, -1.44, -1.2, -1.0, -0.83]
  shelfItems.forEach((make, i) => {
    const item = make()
    if (i === 5) item.rotation.x += Math.PI / 2 // the solder coil lies down
    jitter(item, 0.5, 0.02)
    item.position.set(shelfSlots[i] + rnd(-0.02, 0.02), 0, Z_BACK + rnd(0.09, 0.16))
    item.updateMatrixWorld(true)
    item.position.y = SHELF_Y - new THREE.Box3().setFromObject(item).min.y - 0.002
    group.add(item)
  })

  // --- pipes --------------------------------------------------------------

  const pipeMat = MAT.paint(PALETTE.greyMetal, { rough: 0.6, metal: 0.55 })
  const rustMat = MAT.paint(PALETTE.terracotta, { rough: 0.92, metal: 0.08 })

  const pipeRun = (y, zRun, xTurn, r, R) => {
    const cx = xTurn + R
    const cz = zRun + R
    const runLen = cx + X_IN - 0.02
    const a = cyl(r, r, runLen, pipeMat, 8)
    a.rotation.z = Math.PI / 2
    add(a, cx - runLen / 2, y, zRun)

    const elbow = new THREE.Mesh(ensureColors(new THREE.TorusGeometry(R, r, 5, 6, Math.PI / 2)), pipeMat)
    elbow.quaternion.setFromRotationMatrix(
      new THREE.Matrix4().makeBasis(new THREE.Vector3(0, 0, -1), new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, 1, 0)),
    )
    add(elbow, cx, y, cz)

    const fwdLen = 1.55 - cz
    const b = cyl(r, r, fwdLen, pipeMat, 8)
    b.rotation.x = Math.PI / 2
    add(b, cx - R, y, cz + fwdLen / 2)

    // Rust arrives at the joints, where the lagging was cut and never replaced.
    for (const bandX of [rnd(-1.5, -1.1), rnd(-0.3, 0.5)]) {
      const band = cyl(r * 1.14, r * 1.14, 0.05, rustMat, 8)
      band.rotation.z = Math.PI / 2
      add(band, bandX, y, zRun)
    }
  }

  pipeRun(2.2, -1.34, 1.86, 0.032, 0.075)
  pipeRun(2.3, -1.44, 1.78, 0.021, 0.06)
  for (const bx of [-1.1, 0.6]) add(box(0.045, 0.14, 0.19, bracketMat), bx, 2.27, Z_BACK + 0.105)

  // --- wall vent ----------------------------------------------------------

  add(box(0.44, 0.26, 0.05, MAT.paint(PALETTE.wallDark, { rough: 0.62, metal: 0.35 }), { dirt: 0.26 }), -1.78, 1.98, Z_BACK + 0.02)
  for (let i = 0; i < 5; i++) {
    const slat = box(0.39, 0.016, 0.032, MAT.paint(PALETTE.aluminium, { rough: 0.55, metal: 0.6 }))
    slat.rotation.x = 0.55
    add(slat, -1.78, 1.88 + i * 0.048, Z_BACK + 0.05)
  }

  // --- hanging bulb -------------------------------------------------------

  const anchor = new THREE.Vector3(-0.15, Y_CEIL, 0.15)
  add(cyl(0.05, 0.055, 0.03, MAT.paint(PALETTE.greyMetal, { rough: 0.55, metal: 0.5 }), 10), anchor.x, anchor.y - 0.015, anchor.z)

  const swing = new THREE.Group()
  swing.position.copy(anchor)
  group.add(swing)

  const CORD = 0.83
  const cord = cable(
    [
      [0, 0.03, 0],
      [0.005, -CORD * 0.35, 0.006],
      [-0.006, -CORD * 0.7, -0.005],
      [0, -CORD, 0],
    ],
    { radius: 0.0045, color: PALETTE.wallDark, segments: 10 },
  )
  cord.castShadow = false
  swing.add(cord)

  const bulbCap = cyl(0.016, 0.023, 0.032, MAT.metal(PALETTE.gold, 0.42), 10)
  bulbCap.position.y = -CORD - 0.012
  swing.add(bulbCap)

  const bulbMat = MAT.emissive(PALETTE.amber, 2).clone()
  const bulbLive = bulbMat.color.clone()
  const bulbDead = new THREE.Color(0x171420)
  const bulb = new THREE.Mesh(ensureColors(new THREE.SphereGeometry(0.038, 10, 8)), bulbMat)
  bulb.position.y = -CORD - 0.06
  swing.add(bulb)

  const bulbGlow = glowSprite(PALETTE.amber, 0.04, { core: 0.72, mid: 0.26, halo: 0.08 })
  bulbGlow.position.y = -CORD - 0.06
  swing.add(bulbGlow)

  const BULB_W = 2.1
  const bulbLight = new THREE.PointLight(0xffc98a, BULB_W, 2.4, 2)
  bulbLight.castShadow = false // see the neon: two casters, both in index.js
  bulbLight.position.y = -CORD - 0.075
  swing.add(bulbLight)

  let lit = true
  let swingAmp = 0.016
  const setLit = (on) => {
    lit = on
    bulbMat.color.copy(on ? bulbLive : bulbDead)
    bulbGlow.userData.setIntensity(on ? 1 : 0)
    bulbLight.intensity = on ? BULB_W : 0
  }

  // --- crates -------------------------------------------------------------

  const card = MAT.card()
  const tape = MAT.paint(PALETTE.cardboardDark, { rough: 0.8, metal: 0 })

  const crateA = add(box(0.44, 0.35, 0.38, card, { dirt: 0.24 }), -1.79, 0.175, -1.14)
  crateA.rotation.y = 0.23
  contactDarken(crateA, [FLOOR_PLANE, BACK_PLANE, LEFT_PLANE], { radius: 0.14, floor: 0.4 })

  const crateB = add(box(0.34, 0.29, 0.31, card, { dirt: 0.24 }), -1.73, 0.495, -1.09)
  crateB.rotation.y = -0.38
  contactDarken(crateB, [LEFT_PLANE, BACK_PLANE, new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.35)], { radius: 0.14, floor: 0.44 })

  const crateC = add(box(0.4, 0.31, 0.33, card, { dirt: 0.24 }), -1.42, 0.153, -0.8)
  crateC.rotation.set(0.03, -0.52, 0.05)
  contactDarken(crateC, [FLOOR_PLANE], { radius: 0.12, floor: 0.4 })

  // One flap left standing open, because nobody ever re-tapes the top box.
  const flap = box(0.33, 0.01, 0.15, card, { dirt: 0.3 })
  flap.rotation.set(-1.15, -0.38, 0)
  add(flap, -1.79, 0.66, -1.19)

  add(box(0.45, 0.006, 0.07, tape), -1.79, 0.353, -1.14).rotation.y = 0.23
  add(box(0.07, 0.315, 0.006, tape), -1.503, 0.153, -0.652).rotation.set(0.03, -0.52, 0.05)

  // --- potted plant -------------------------------------------------------

  const plant = new THREE.Group()
  plant.position.set(-1.62, 0, -0.45)
  plant.rotation.y = 0.4
  group.add(plant)

  const potProfile = [
    [0.001, 0],
    [0.076, 0],
    [0.083, 0.02],
    [0.094, 0.14],
    [0.106, 0.2],
    [0.113, 0.216],
    [0.104, 0.223],
    [0.097, 0.198],
  ].map(([x, y]) => new THREE.Vector2(x, y))
  const pot = new THREE.Mesh(
    ensureColors(new THREE.LatheGeometry(potProfile, 12)),
    MAT.paint(PALETTE.terracotta, { rough: 0.92, metal: 0.04 }),
  )
  pot.castShadow = true
  pot.receiveShadow = true
  plant.add(pot)
  contactDarken(pot, [FLOOR_PLANE], { radius: 0.08, floor: 0.4 })

  const soil = cyl(0.096, 0.088, 0.03, MAT.plaster(PALETTE.crevice), 12)
  soil.position.y = 0.198
  plant.add(soil)

  const leafCount = q > 0.6 ? 8 : 6
  for (let i = 0; i < leafCount; i++) {
    const geo = new THREE.PlaneGeometry(0.075, 0.3, 1, 4)
    const pos = geo.attributes.position
    for (let v = 0; v < pos.count; v++) {
      const k = THREE.MathUtils.clamp((pos.getY(v) + 0.15) / 0.3, 0, 1)
      pos.setX(v, pos.getX(v) * Math.sin(Math.min(1, k * 1.12) * Math.PI) ** 0.55)
      pos.setZ(v, -0.1 * k * k)
      pos.setY(v, pos.getY(v) + 0.15)
    }
    geo.computeVertexNormals()
    tintGeometry(geo, i % 3 === 0 ? 0x8a9c84 : 0xffffff, 0.3)
    const leaf = new THREE.Mesh(ensureColors(geo), MAT.leaf())
    leaf.castShadow = true
    const a = (i / leafCount) * TAU + rnd(-0.3, 0.3)
    leaf.position.set(Math.cos(a) * 0.03, 0.2, Math.sin(a) * 0.03)
    leaf.rotation.set(rnd(-0.5, -0.15), a + Math.PI / 2, rnd(-0.5, 0.5))
    plant.add(leaf)
  }

  // --- taped notes --------------------------------------------------------

  const paper = MAT.paint(PALETTE.brightMetal, { rough: 0.95, metal: 0 })
  const notes = [
    [0.24, 1.36, 0.13, 0.1, -0.06],
    [0.4, 1.52, 0.11, 0.14, 0.09],
    [0.55, 1.35, 0.15, 0.11, -0.03],
  ]
  for (const [x, y, w, h, rz] of notes) {
    const note = add(box(w, h, 0.004, paper, { dirt: 0.3, tint: 0xc6c0d2 }), x, y, Z_BACK + 0.004)
    note.rotation.z = rz
  }

  const noteDecal = decalTexture().clone()
  noteDecal.needsUpdate = true
  noteDecal.repeat.set(0.6, 0.42)
  noteDecal.offset.set(0.16, 0.3)
  const decals = new THREE.Mesh(
    new THREE.PlaneGeometry(0.46, 0.32),
    new THREE.MeshStandardMaterial({
      map: noteDecal,
      transparent: true,
      roughness: 0.9,
      metalness: 0,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      side: THREE.DoubleSide,
    }),
  )
  decals.rotation.z = 0.04
  add(decals, 0.4, 1.44, Z_BACK + 0.009)

  // --- foreground ---------------------------------------------------------
  //
  // These hang between the lens and the desk. A frame with nothing cropped by
  // its own edge is the difference between a photograph and a product render,
  // so at least two of them are placed to cross a corner of the settle pose.

  const hang = (x, z, drop, radius, color) => {
    const sway = rnd(-0.05, 0.05)
    const pts = []
    for (let i = 0; i <= 4; i++) {
      const k = i / 4
      pts.push(
        new THREE.Vector3(
          x + Math.sin(k * 2.3 + sway * 8) * 0.035 + sway * k,
          Y_CEIL + 0.03 - drop * k,
          z + Math.cos(k * 1.9) * 0.028 - 0.05 * k * k,
        ),
      )
    }
    const c = cable(pts, { radius, color, segments: 11 })
    // Thin geometry in a 1024 shadow map is all aliasing and no shadow.
    c.castShadow = false
    group.add(c)
    return c
  }

  hang(0.12, 0.62, 1.45, 0.009, PALETTE.wallDark)
  hang(0.31, 0.7, 1.02, 0.006, PALETTE.greyMetal)
  hang(0.79, 0.44, 1.32, 0.011, PALETTE.wallDark)
  hang(-0.38, 0.5, 0.86, 0.007, PALETTE.cardboardDark)
  if (q > 0.6) hang(1.14, 0.56, 1.18, 0.008, PALETTE.greyMetal)

  const floorRun = cable(
    [
      [-0.92, 0.014, -1.05],
      [-0.5, 0.016, -0.58],
      [-0.04, 0.015, -0.26],
      [0.38, 0.017, 0.16],
      [0.63, 0.015, 0.66],
      [0.78, 0.014, 1.25],
    ],
    { radius: 0.015, color: PALETTE.greyMetal, segments: 20 },
  )
  floorRun.castShadow = false
  floorRun.receiveShadow = true
  group.add(floorRun)
  contactDarken(floorRun, [FLOOR_PLANE], { radius: 0.03, floor: 0.5 })

  // --- frame --------------------------------------------------------------

  const interactives = [
    {
      objects: [bulb, bulbCap, cord],
      label: 'Bulb',
      hint: 'Pull the cord',
      onClick: () => {
        setLit(!lit)
        swingAmp = 0.12
        sfx?.play('latch')
      },
    },
  ]

  return {
    group,
    interactives,
    update(dt, t) {
      driftDust(dt, t)

      swingAmp += (0.016 - swingAmp) * (1 - Math.exp(-dt * 0.22))
      swing.rotation.z = Math.sin(t * 1.35) * swingAmp
      swing.rotation.x = Math.sin(t * 1.04 + 2.1) * swingAmp * 0.62

      if (t > dipEnd) {
        dipLen = rnd(0.1, 0.24)
        dipEnd = t + dipLen + rnd(3.5, 7)
      }
      let level = 1 + Math.sin(t * 3.1) * 0.014 + Math.sin(t * 7.7 + 1.3) * 0.009
      const since = dipEnd - dipLen - t
      if (since < 0 && since > -dipLen) level *= 1 - 0.45 * Math.sin((-since / dipLen) * Math.PI) ** 0.6
      neonMat.color.copy(neonBase).multiplyScalar(level)
      neonGlow.userData.setIntensity(level)
      neonLight.intensity = NEON_W * level
    },
    dispose() {
      shaftMat.alphaMap?.dispose()
      noteDecal.dispose()
      dustGeo.dispose()
      cityGeo.dispose()
    },
  }
}
