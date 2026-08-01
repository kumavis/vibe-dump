// world.js — the static night-market environment. See docs/FRAMES.md for the
// conventions this file honours: units are metres, ground is y=0, yaw=0 faces
// +Z with x=sin(yaw), z=cos(yaw); a stall's vendorSpot.yaw points out across
// the counter toward shoppers, each browseSpot.yaw points at the counter.
//
// Materials vocabulary (FRAMES.md): exactly two materials —
//   body: MeshStandardMaterial({ vertexColors, roughness: 0.85 }) for all lit
//   glow: MeshBasicMaterial({ vertexColors }) for stars, moons, flames, lamps
// All colour lives in vertex colors, written linear via convertSRGBToLinear().
// The whole static world merges into TWO meshes (one per material); only a
// handful of small dynamic meshes (banners, flames) stay separate for
// update(t) to animate cheaply.
//
// Determinism: no Math.random() — everything derives from makeRng/hashU32
// (src/rng.js). Same seed + same stallGoods => identical bazaar.

import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { makeRng, hashU32, fbm2, clamp, smoothstep } from './rng.js'
import { goodById } from './goods.js'

// ---------------------------------------------------------------------------
// palette (sRGB hex, converted to linear once)

const srgb = (hex) => new THREE.Color(hex).convertSRGBToLinear()

const SILKS = [0xc0392b, 0xe6a817, 0x189e93, 0x7d4fbe, 0xc2527f] // crimson, saffron, teal, violet, rose
const COL = {
  timber: srgb(0x4a3220),
  timberDark: srgb(0x36230f),
  cream: srgb(0xefe0c0),
  groundA: srgb(0x8a5a3c),
  groundB: srgb(0x6b4530),
  stone: srgb(0x6a5f58),
  stoneDark: srgb(0x4c443e),
  skyHorizon: srgb(0x141028),
  skyZenith: srgb(0x06050f),
  moonAmber: srgb(0xf0b45a),
  moonTeal: srgb(0x7fd4c8),
  bulbWarm: srgb(0xffd27a),
  flameCore: srgb(0xffe6a0),
  flameTip: srgb(0xff7a2a),
  ember: srgb(0xff9a3c),
  water: srgb(0x2e8f86),
  sack: srgb(0xb09a6a),
  barrel: srgb(0x5a4030),
  iron: srgb(0x2c2c30),
}
const SILKS_LIN = SILKS.map(srgb)

// ---------------------------------------------------------------------------
// small helpers

const _c = new THREE.Color()
const _v = new THREE.Vector3()
const _e = new THREE.Euler()
const _q = new THREE.Quaternion()
const _s = new THREE.Vector3()
const ORIGIN = new THREE.Vector3(0, 0, 0)
const UP = new THREE.Vector3(0, 1, 0)

/** Compose a Matrix4 from position / euler / scale shorthand. */
function M({ x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy, sz } = {}) {
  _e.set(rx, ry, rz, 'XYZ')
  _q.setFromEuler(_e)
  _v.set(x, y, z)
  _s.set(sx, sy === undefined ? sx : sy, sz === undefined ? sx : sz)
  return new THREE.Matrix4().compose(_v, _q, _s)
}

/**
 * Prep a geometry for merging: non-indexed, transformed, vertex-coloured.
 * `color` is a linear THREE.Color or a fn (x,y,z,outColor) in *world* space
 * (positions are transformed before colouring). `needNormal` false for glow.
 */
function makePart(geo, m, color, needNormal = true) {
  let g = geo.index ? geo.toNonIndexed() : geo
  if (m) g.applyMatrix4(m)
  for (const name of Object.keys(g.attributes)) {
    if (name === 'position') continue
    if (name === 'normal' && needNormal) continue
    g.deleteAttribute(name)
  }
  const pos = g.getAttribute('position')
  const arr = new Float32Array(pos.count * 3)
  if (typeof color === 'function') {
    for (let i = 0; i < pos.count; i++) {
      color(pos.getX(i), pos.getY(i), pos.getZ(i), _c)
      arr[i * 3] = _c.r; arr[i * 3 + 1] = _c.g; arr[i * 3 + 2] = _c.b
    }
  } else {
    for (let i = 0; i < pos.count; i++) {
      arr[i * 3] = color.r; arr[i * 3 + 1] = color.g; arr[i * 3 + 2] = color.b
    }
  }
  g.setAttribute('color', new THREE.BufferAttribute(arr, 3))
  return g
}

/**
 * An open lantern cage: caps + corner posts around a visible glow core.
 * `L` maps local shorthand to world; `s` scales the whole lantern.
 */
function addLantern(L, x, y, z, coreColor, body, glow, s = 1) {
  body(new THREE.BoxGeometry(0.2 * s, 0.03 * s, 0.2 * s), L({ x, y: y - 0.12 * s, z }), COL.iron)
  body(new THREE.BoxGeometry(0.2 * s, 0.03 * s, 0.2 * s), L({ x, y: y + 0.12 * s, z }), COL.iron)
  for (const px of [-1, 1]) for (const pz of [-1, 1]) {
    body(new THREE.BoxGeometry(0.025 * s, 0.24 * s, 0.025 * s),
      L({ x: x + px * 0.085 * s, y, z: z + pz * 0.085 * s }), COL.iron)
  }
  glow(new THREE.BoxGeometry(0.13 * s, 0.2 * s, 0.13 * s), L({ x, y, z }), coreColor)
  body(new THREE.ConeGeometry(0.17 * s, 0.12 * s, 4), L({ x, y: y + 0.19 * s, z, ry: Math.PI / 4 }), COL.iron)
}

/** Matrix that positions a +Z-facing geometry at `pos` looking at the origin. */
function faceOrigin(pos) {
  const m = new THREE.Matrix4().lookAt(ORIGIN, pos, UP) // +Z ends up pointing origin-ward
  m.setPosition(pos)
  return m
}

// ---------------------------------------------------------------------------
// the builder

export function buildWorld({ seed, goods, stallGoods }) {
  const group = new THREE.Group()
  group.name = 'bazaar-world'

  const bodyGeos = []
  const glowGeos = []
  const body = (geo, m, color) => bodyGeos.push(makePart(geo, m, color, true))
  const glow = (geo, m, color) => glowGeos.push(makePart(geo, m, color, false))

  const bodyMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85 })
  const glowMat = new THREE.MeshBasicMaterial({ vertexColors: true })

  const colliders = []
  const stalls = []
  const buskerSpots = []
  const dynamics = [] // { mesh, kind:'banner'|'flame', phase, speed, amp, baseRy }

  const nStalls = stallGoods.length
  const goodMap = new Map((goods || []).map((g) => [g.id, g]))
  const lookupGood = (id) => goodMap.get(id) || goodById(id)
  const rngLayout = makeRng(hashU32(seed ^ 0x9e3779b9))
  const rngSky = makeRng(hashU32(seed ^ 0x51ed270b))
  const rngProps = makeRng(hashU32(seed ^ 0x2545f491))

  // -------------------------------------------------------------- sky dome
  {
    const skyR = 80
    const sky = new THREE.SphereGeometry(skyR, 36, 18, 0, Math.PI * 2, 0, Math.PI * 0.62)
    sky.scale(-1, 1, 1) // flip winding: inward-facing with FrontSide material
    glow(sky, null, (x, y, z, c) => {
      const t = clamp(y / skyR, -0.2, 1)
      c.copy(COL.skyHorizon).lerp(COL.skyZenith, smoothstep(0.02, 0.6, t))
      if (t < 0.02) c.multiplyScalar(0.8) // dip below horizon a touch darker
    })

    // stars: ~300 tiny quads on the dome, facing in
    const starCol = srgb(0xdfe6ff)
    const starWarm = srgb(0xffe9c8)
    for (let i = 0; i < 300; i++) {
      const az = rngSky() * Math.PI * 2
      const el = 0.14 + Math.pow(rngSky(), 0.75) * 1.27 // ≥0.14: horizon-grazers render as big grey boxes
      const r = 78
      const p = new THREE.Vector3(
        Math.sin(az) * Math.cos(el) * r,
        Math.sin(el) * r,
        Math.cos(az) * Math.cos(el) * r,
      )
      const s = 0.28 + rngSky() * 0.5
      const m = faceOrigin(p).multiply(M({ sx: s, sy: s, sz: 1 }))
      const c = _c.copy(rngSky() < 0.22 ? starWarm : starCol)
        .multiplyScalar(0.65 + rngSky() * 0.5).clone()
      glow(new THREE.PlaneGeometry(1, 1), m, c)
    }

    // one large amber moon low in the sky, one small teal moon elsewhere.
    // (azimuth biased toward the -X/-Z quadrant so the classic three-quarter
    // hero view from (+x,+y,+z) catches it over the stalls)
    const moonAz = Math.PI * 1.25 + (rngSky() - 0.5) * 0.8
    const moonEl = 0.17 + rngSky() * 0.08 // low in the sky
    const moonPos = new THREE.Vector3(
      Math.sin(moonAz) * Math.cos(moonEl) * 76,
      Math.sin(moonEl) * 76,
      Math.cos(moonAz) * Math.cos(moonEl) * 76,
    )
    glow(new THREE.CircleGeometry(6.4, 28), faceOrigin(moonPos), (x, y, z, c) => {
      const d = Math.sqrt((x - moonPos.x) ** 2 + (y - moonPos.y) ** 2 + (z - moonPos.z) ** 2)
      c.copy(COL.moonAmber).multiplyScalar(1.05 - smoothstep(0, 6.4, d) * 0.35)
    })
    glow(new THREE.CircleGeometry(8.6, 28), faceOrigin(moonPos.clone().multiplyScalar(1.02)),
      COL.moonAmber.clone().multiplyScalar(0.22)) // soft halo behind

    const tealAz = moonAz + Math.PI * (0.65 + rngSky() * 0.5)
    const tealEl = 0.75 + rngSky() * 0.35
    const tealPos = new THREE.Vector3(
      Math.sin(tealAz) * Math.cos(tealEl) * 77,
      Math.sin(tealEl) * 77,
      Math.cos(tealAz) * Math.cos(tealEl) * 77,
    )
    glow(new THREE.CircleGeometry(2.2, 20), faceOrigin(tealPos), COL.moonTeal)

    // lighting rig — hemisphere + one warm moon directional
    const hemi = new THREE.HemisphereLight(0x5a5480, 0x3a2a20, 0.9)
    group.add(hemi)
    const moon = new THREE.DirectionalLight(0xffd9a0, 1.15)
    moon.position.copy(moonPos).normalize().multiplyScalar(30)
    group.add(moon)
    group.add(moon.target) // target sits at origin
  }

  // -------------------------------------------------------------- layout pass
  // Stall / pole / brazier placement is decided up front so the ground pass
  // can bake warm lamplight pools into its vertex colours where they'll be.
  // Pulled in tight: with the stalls hugging the fountain plaza the same
  // number of souls reads as a crowd instead of stragglers on a parade ground.
  const R = 17 // walkable disc radius
  const ringR = 11
  const theta0 = rngLayout() * Math.PI * 2
  const brazierAngle = rngLayout() * Math.PI * 2
  const silkOffset = Math.floor(rngLayout() * 5)

  const stallLayouts = []
  for (let i = 0; i < nStalls; i++) {
    const rngS = makeRng(hashU32(seed ^ (0x51a11 + i * 7919)))
    const theta = theta0 + (i / nStalls) * Math.PI * 2 + (rngS() - 0.5) * 0.05
    const sr = ringR + (rngS() - 0.5) * 1.2
    stallLayouts.push({ rngS, theta, sr, px: Math.sin(theta) * sr, pz: Math.cos(theta) * sr, yaw: theta + Math.PI })
  }
  const nPoles = 5
  const poleLayouts = []
  for (let k = 0; k < nPoles; k++) {
    const a = theta0 + Math.PI / nStalls + (k / nPoles) * Math.PI * 2
    poleLayouts.push({ a, px: Math.sin(a) * 7.8, pz: Math.cos(a) * 7.8 })
  }
  const brazierPts = [0, Math.PI].map((d) => {
    const a = brazierAngle + d
    return { x: Math.sin(a) * 3.9, z: Math.cos(a) * 3.9, a }
  })

  // warm lamplight pools baked into the ground (x, z, radius, strength)
  const warmSpots = [{ x: 0, z: 0, s: 3.6, k: 0.5 }]
  for (const b of brazierPts) warmSpots.push({ x: b.x, z: b.z, s: 2.2, k: 0.85 })
  for (const p of poleLayouts) warmSpots.push({ x: p.px, z: p.pz, s: 2.6, k: 0.8 })
  for (const sl of stallLayouts) {
    warmSpots.push({
      x: sl.px + Math.sin(sl.yaw) * 1.7,
      z: sl.pz + Math.cos(sl.yaw) * 1.7,
      s: 2.4, k: 0.75,
    })
  }
  const warmTint = srgb(0xd08040)

  // -------------------------------------------------------------- ground
  {
    const groundR = 24
    const rings = 28
    const segs = 88
    const positions = []
    for (let ri = 0; ri <= rings; ri++) {
      const rr = (ri / rings) * groundR
      for (let si = 0; si < segs; si++) {
        const a = (si / segs) * Math.PI * 2
        positions.push(new THREE.Vector3(Math.sin(a) * rr, 0, Math.cos(a) * rr))
      }
    }
    const tris = []
    for (let ri = 0; ri < rings; ri++) {
      for (let si = 0; si < segs; si++) {
        const a = ri * segs + si
        const b = ri * segs + ((si + 1) % segs)
        const c2 = (ri + 1) * segs + si
        const d = (ri + 1) * segs + ((si + 1) % segs)
        if (ri === 0 && si > 0) { /* inner ring collapses to near-centre; keep quads anyway */ }
        tris.push(a, c2, d, a, d, b)
      }
    }
    const arr = new Float32Array(tris.length * 3)
    const nor = new Float32Array(tris.length * 3)
    for (let i = 0; i < tris.length; i++) {
      const p = positions[tris[i]]
      arr[i * 3] = p.x; arr[i * 3 + 1] = 0; arr[i * 3 + 2] = p.z
      nor[i * 3] = 0; nor[i * 3 + 1] = 1; nor[i * 3 + 2] = 0
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3))
    g.setAttribute('normal', new THREE.BufferAttribute(nor, 3))
    body(g, null, (x, y, z, c) => {
      const n = fbm2(x * 0.33 + 13.7, z * 0.33 + 4.1, 4)
      const rr = Math.hypot(x, z)
      c.copy(COL.groundA).lerp(COL.groundB, n)
      c.multiplyScalar(1 - smoothstep(11, groundR, rr) * 0.45) // radial darkening
      // cobble-ish fine speckle
      const f = fbm2(x * 1.7, z * 1.7, 2)
      c.multiplyScalar(0.92 + f * 0.16)
      // baked lamplight pools (lanterns/braziers can't all afford PointLights)
      let warm = 0
      for (let w = 0; w < warmSpots.length; w++) {
        const ws = warmSpots[w]
        const dx = x - ws.x, dz = z - ws.z
        const d2 = (dx * dx + dz * dz) / (ws.s * ws.s)
        if (d2 < 4) warm += ws.k * Math.exp(-d2 * 1.8)
      }
      c.lerp(warmTint, Math.min(0.65, warm))
    })
  }

  // -------------------------------------------------------------- fountain (central landmark)
  {
    const wall = new THREE.CylinderGeometry(2.25, 2.35, 0.6, 22)
    body(wall, M({ y: 0.3 }), COL.stone)
    body(new THREE.CylinderGeometry(2.35, 2.45, 0.14, 22), M({ y: 0.07 }), COL.stoneDark)
    // 0.615: the drum below is a CLOSED cylinder whose stone top cap sits at
    // y=0.6 — water authored below that line is invisible by construction
    glow(new THREE.CircleGeometry(2.05, 22), M({ y: 0.615, rx: -Math.PI / 2 }), COL.water)
    body(new THREE.CylinderGeometry(0.5, 0.62, 0.95, 14), M({ y: 1.0 }), COL.stone)
    body(new THREE.CylinderGeometry(1.18, 1.0, 0.3, 16), M({ y: 1.55 }), COL.stone)
    glow(new THREE.CircleGeometry(1.02, 16), M({ y: 1.72, rx: -Math.PI / 2 }),
      COL.water.clone().multiplyScalar(1.2))
    body(new THREE.CylinderGeometry(0.26, 0.34, 0.6, 12), M({ y: 2.0 }), COL.stone)
    body(new THREE.CylinderGeometry(0.62, 0.5, 0.24, 14), M({ y: 2.35 }), COL.stone)
    glow(new THREE.CircleGeometry(0.5, 14), M({ y: 2.49, rx: -Math.PI / 2 }),
      COL.water.clone().multiplyScalar(1.5))
    // (the teal wisp finial is a dynamic mesh — see the fountain dynamics below)
    colliders.push({ x: 0, z: 0, r: 2.5 })

    // stone slab ring around the fountain
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2 + 0.17
      body(new THREE.BoxGeometry(1.0, 0.05, 0.64),
        M({ x: Math.sin(a) * 3.0, y: 0.028, z: Math.cos(a) * 3.0, ry: a }),
        COL.stoneDark.clone().multiplyScalar(0.9 + 0.2 * fbm2(i * 3.3, 7.7, 2)))
    }
  }

  // braziers flanking the fountain (ember glow + dynamic flames)
  for (const b of brazierPts) {
    const base = M({ x: b.x, z: b.z })
    // tripod legs
    for (let k = 0; k < 3; k++) {
      const la = b.a + (k / 3) * Math.PI * 2
      body(new THREE.BoxGeometry(0.07, 0.95, 0.07),
        new THREE.Matrix4().multiplyMatrices(base,
          M({ x: Math.sin(la) * 0.3, y: 0.45, z: Math.cos(la) * 0.3, rx: Math.cos(la) * 0.3, rz: -Math.sin(la) * 0.3 })),
        COL.iron)
    }
    body(new THREE.CylinderGeometry(0.46, 0.26, 0.34, 12),
      new THREE.Matrix4().multiplyMatrices(base, M({ y: 0.95 })), COL.iron)
    glow(new THREE.SphereGeometry(0.34, 10, 6),
      new THREE.Matrix4().multiplyMatrices(base, M({ y: 1.06, sy: 0.45 })), COL.ember)
    colliders.push({ x: b.x, z: b.z, r: 0.65 })
  }

  // -------------------------------------------------------------- stalls
  for (let i = 0; i < nStalls; i++) {
    const { rngS, px, pz, yaw } = stallLayouts[i] // yaw: stall +Z faces the plaza centre
    const SM = new THREE.Matrix4().makeRotationY(yaw).setPosition(px, 0, pz)
    const L = (opts) => new THREE.Matrix4().multiplyMatrices(SM, M(opts))

    const silkHex = SILKS[(i + silkOffset + Math.floor(rngS() * 2)) % SILKS.length]
    const silk = SILKS_LIN[SILKS.indexOf(silkHex)]
    const counterY = 0.88 + rngS() * 0.14 // in [0.88, 1.02] ⊂ [0.85, 1.05]
    // string-light warmth baked into nearby timber (real lights are budgeted)
    const lit = (base, f) => base.clone().lerp(warmTint, f).multiplyScalar(1 + f * 0.6)

    // --- timber frame: front posts lower, back posts higher (sloped awning)
    const frontH = 2.3, backH = 2.75
    for (const sx of [-1.55, 1.55]) {
      body(new THREE.BoxGeometry(0.13, frontH, 0.13), L({ x: sx, y: frontH / 2, z: 1.05 }), lit(COL.timber, 0.22))
      body(new THREE.BoxGeometry(0.13, backH, 0.13), L({ x: sx, y: backH / 2, z: -1.05 }), COL.timber)
    }
    // counter top + skirt
    body(new THREE.BoxGeometry(3.3, 0.12, 0.9), L({ x: 0, y: counterY - 0.06, z: 0.6 }), lit(COL.timber, 0.3))
    body(new THREE.BoxGeometry(3.3, counterY - 0.18, 0.07),
      L({ x: 0, y: (counterY - 0.18) / 2, z: 1.02 }), lit(COL.timberDark, 0.24))
    // half-height back wall + shelf
    body(new THREE.BoxGeometry(3.2, 1.5, 0.06), L({ x: 0, y: 0.95, z: -1.04 }), lit(COL.timberDark, 0.1))
    body(new THREE.BoxGeometry(3.0, 0.06, 0.34), L({ x: 0, y: 1.62, z: -0.88 }), lit(COL.timber, 0.15))

    // --- striped awning (thin boxes so single-sided body material reads)
    const tilt = Math.atan2(backH - frontH + 0.15, 2.7)
    const awnLen = 2.75
    const nStripes = 10
    for (let s = 0; s < nStripes; s++) {
      const sx = -1.71 + (s + 0.5) * (3.42 / nStripes)
      const c = s % 2 === 0 ? COL.cream : silk
      body(new THREE.BoxGeometry(3.42 / nStripes + 0.005, 0.045, awnLen),
        L({ x: sx, y: 2.47, z: 0.18, rx: tilt }),
        c)
    }
    // scalloped valance along the front edge
    for (let s = 0; s < nStripes; s++) {
      const sx = -1.71 + (s + 0.5) * (3.42 / nStripes)
      const c = s % 2 === 0 ? silk : COL.cream
      body(new THREE.BoxGeometry(3.42 / nStripes - 0.03, 0.26 + (s % 2) * 0.07, 0.035),
        L({ x: sx, y: 2.06, z: 1.54 }), c)
    }

    // --- string lights swagged between the front posts
    const nBulbs = 9
    for (let k = 0; k < nBulbs; k++) {
      const u = (k + 0.5) / nBulbs
      const bx = -1.55 + u * 3.1
      const by = frontH - 0.08 - 4 * 0.34 * u * (1 - u) // parabolic sag
      const warm = COL.bulbWarm.clone().multiplyScalar(1.1 + rngS() * 0.55)
      glow(new THREE.SphereGeometry(0.06, 6, 4), L({ x: bx, y: by, z: 1.24 }), warm)
    }

    // --- goods displayed on the counter
    const ids = stallGoods[i]
    for (let gI = 0; gI < ids.length; gI++) {
      const cx = ids.length === 1 ? 0 : gI === 0 ? -0.78 : 0.78
      addGoodProps(lookupGood(ids[gI]), cx, ids.length === 1 ? 1.15 : 0.62, L, counterY, rngS, body, glow)
    }

    // --- side clutter: crates/barrels/sacks with the lead good's accent
    const side = i % 2 === 0 ? 1 : -1
    const accent = srgb(lookupGood(ids[0]).color)
    addClutter(L({ x: side * 2.35, z: -0.35, ry: rngS() * Math.PI }), rngS, accent, body)
    {
      // collider for the clutter cluster (world position of local point)
      _v.set(side * 2.35, 0, -0.35).applyMatrix4(SM)
      colliders.push({ x: _v.x, z: _v.z, r: 0.8 })
    }

    // --- rug or stone slab in the browsing lane (flat, no collider)
    if (rngS() < 0.55) {
      body(new THREE.BoxGeometry(1.5, 0.025, 1.0), L({ x: 0, y: 0.032, z: 2.15 }),
        silk.clone().multiplyScalar(0.62))
      body(new THREE.BoxGeometry(1.62, 0.02, 1.12), L({ x: 0, y: 0.014, z: 2.15 }),
        COL.cream.clone().multiplyScalar(0.5))
    } else {
      body(new THREE.BoxGeometry(1.1, 0.035, 0.7), L({ x: 0.3, y: 0.021, z: 2.0, ry: 0.3 }), COL.stoneDark)
    }

    // --- colliders: counter blob + flanks + posts (generous, walker-proof)
    const lc = [
      { lx: 0, lz: 0.55, r: 0.8 },     // counter core — covers the stall centre
      { lx: -1.2, lz: 0.55, r: 0.6 },  // counter flanks
      { lx: 1.2, lz: 0.55, r: 0.6 },
      { lx: -1.55, lz: 1.05, r: 0.3 }, // front posts
      { lx: 1.55, lz: 1.05, r: 0.3 },
      { lx: -1.55, lz: -1.05, r: 0.35 }, // rear posts
      { lx: 1.55, lz: -1.05, r: 0.35 },
    ]
    for (const c of lc) {
      _v.set(c.lx, 0, c.lz).applyMatrix4(SM)
      colliders.push({ x: _v.x, z: _v.z, r: c.r })
    }

    // --- spots (local → world). forward = stall +Z (toward plaza centre)
    const toWorld = (lx, lz) => {
      _v.set(lx, 0, lz).applyMatrix4(SM)
      return { x: _v.x, z: _v.z }
    }
    const vp = toWorld(0, -0.72)
    const b1 = toWorld(-0.85, 2.15)
    const b2 = toWorld(0.85, 2.15)
    stalls.push({
      id: `stall${i}`,
      goodIds: ids.slice(),
      pos: { x: px, z: pz },
      yaw,
      vendorSpot: { x: vp.x, z: vp.z, yaw },              // faces out over the counter
      browseSpots: [
        { x: b1.x, z: b1.z, yaw: yaw + Math.PI },          // face the counter
        { x: b2.x, z: b2.z, yaw: yaw + Math.PI },
      ],
      counterY,
      awningColor: silkHex,
    })
  }

  // -------------------------------------------------------------- lantern poles + banners
  const poleBanners = []
  for (let k = 0; k < nPoles; k++) {
    const { a, px: pxp, pz: pzp } = poleLayouts[k]
    const PM = new THREE.Matrix4().makeRotationY(a + Math.PI).setPosition(pxp, 0, pzp)
    const L = (opts) => new THREE.Matrix4().multiplyMatrices(PM, M(opts))
    body(new THREE.CylinderGeometry(0.055, 0.085, 3.3, 8), L({ y: 1.65 }), COL.timberDark)
    body(new THREE.BoxGeometry(1.0, 0.08, 0.08), L({ y: 3.25 }), COL.timberDark)
    // open-cage lantern hanging from one arm end
    addLantern(L, 0.42, 3.0, 0, COL.bulbWarm.clone().multiplyScalar(1.3), body, glow, 1.15)
    colliders.push({ x: pxp, z: pzp, r: 0.3 })
    poleBanners.push({ PM, silk: SILKS_LIN[(k + silkOffset) % SILKS_LIN.length] })
  }

  // -------------------------------------------------------------- free-standing clutter
  for (let k = 0; k < 3; k++) {
    const a = theta0 + ((k + 0.33) / 3) * Math.PI * 2 + rngProps() * 0.5
    const rr = 7.2 + rngProps() * 1.8
    const cx = Math.sin(a) * rr
    const cz = Math.cos(a) * rr
    const accent = SILKS_LIN[Math.floor(rngProps() * SILKS_LIN.length)]
    addClutter(M({ x: cx, z: cz, ry: rngProps() * Math.PI * 2 }), rngProps, accent, body)
    colliders.push({ x: cx, z: cz, r: 0.8 })
  }

  // -------------------------------------------------------------- rim: low wall + distant tents
  {
    const nSeg = 26
    for (let k = 0; k < nSeg; k++) {
      if (k % 7 === 3) continue // gaps in the wall
      const a = (k / nSeg) * Math.PI * 2
      body(new THREE.BoxGeometry(4.2, 0.85 + fbm2(k * 2.1, 0.5, 2) * 0.3, 0.5),
        M({ x: Math.sin(a) * (R + 1.4), y: 0.42, z: Math.cos(a) * (R + 1.4), ry: a }),
        COL.stoneDark.clone().multiplyScalar(0.75))
    }
    for (let k = 0; k < 9; k++) {
      const a = theta0 + (k / 9) * Math.PI * 2 + 0.31
      const rr = R + 3.5 + fbm2(k * 5.1, 3.3, 2) * 3
      const h = 3.4 + fbm2(k * 1.7, 9.1, 2) * 2.4
      body(new THREE.ConeGeometry(2.2, h, 6),
        M({ x: Math.sin(a) * rr, y: h / 2 - 0.2, z: Math.cos(a) * rr, ry: a }),
        SILKS_LIN[k % SILKS_LIN.length].clone().multiplyScalar(0.16)) // dark tent silhouettes
    }
  }

  // -------------------------------------------------------------- busker spots
  {
    // one near (but clear of) the fountain, angled between the braziers
    const a1 = brazierAngle + Math.PI / 2
    const bx = Math.sin(a1) * 4.9
    const bz = Math.cos(a1) * 4.9
    buskerSpots.push({ x: bx, z: bz, yaw: Math.atan2(bx, bz) }) // faces out, over the open plaza
    // one in a gap between stalls, facing the plaza centre
    const gapTheta = theta0 + ((Math.floor(nStalls / 2) + 0.5) / nStalls) * Math.PI * 2
    const gx = Math.sin(gapTheta) * (ringR - 1.9)
    const gz = Math.cos(gapTheta) * (ringR - 1.9)
    buskerSpots.push({ x: gx, z: gz, yaw: Math.atan2(-gx, -gz) })
  }

  // -------------------------------------------------------------- merge static world
  const bodyMesh = new THREE.Mesh(mergeGeometries(bodyGeos, false), bodyMat)
  const glowMesh = new THREE.Mesh(mergeGeometries(glowGeos, false), glowMat)
  bodyMesh.name = 'static-body'
  glowMesh.name = 'static-glow'
  bodyMesh.matrixAutoUpdate = false
  glowMesh.matrixAutoUpdate = false
  group.add(bodyMesh, glowMesh)
  for (const g of bodyGeos) g.dispose()
  for (const g of glowGeos) g.dispose()

  // -------------------------------------------------------------- dynamic bits (≤ 10 meshes)
  // brazier flames (glow, scale-flickered)
  for (let bi = 0; bi < brazierPts.length; bi++) {
    const b = brazierPts[bi]
    const flameGeo = new THREE.ConeGeometry(0.17, 0.6, 6)
    flameGeo.translate(0, 0.3, 0) // origin at flame base
    const fg = makePart(flameGeo, null, (x, y, z, c) => {
      c.copy(COL.flameCore).lerp(COL.flameTip, clamp(y / 0.6, 0, 1))
    }, false)
    const mesh = new THREE.Mesh(fg, glowMat)
    mesh.position.set(b.x, 1.08, b.z)
    mesh.userData.dynamic = true
    group.add(mesh)
    dynamics.push({ mesh, kind: 'flame', phase: bi * 2.4 + 0.7, speed: 9 + bi * 1.7 })
  }
  // pole banners (body cloth, swaying) — 5 of these + 2 flames = 7 dynamic meshes
  for (let k = 0; k < poleBanners.length; k++) {
    const { PM, silk } = poleBanners[k]
    const cloth = new THREE.BoxGeometry(0.46, 1.35, 0.025)
    cloth.translate(0, -0.675, 0) // pivot at the top edge
    const cg = makePart(cloth, null, (x, y, z, c) => {
      c.copy(silk).multiplyScalar(1.15 - clamp(-y / 1.35, 0, 1) * 0.4)
    }, true)
    const mesh = new THREE.Mesh(cg, bodyMat)
    _v.set(-0.42, 3.2, 0).applyMatrix4(PM)
    mesh.position.copy(_v)
    mesh.rotation.y = Math.atan2(_v.x, _v.z) // face outward-ish, stable
    mesh.userData.dynamic = true
    group.add(mesh)
    dynamics.push({ mesh, kind: 'banner', phase: k * 1.9, speed: 0.9 + (k % 3) * 0.25, baseRy: mesh.rotation.y })
  }

  // fountain dynamics: expanding ripple rings on the two open basins plus the
  // floating wisp finial. Rings need per-mesh transparent materials so opacity
  // can fade without touching the shared glow material.
  const rippleSpecs = [
    { y: 0.625, rMax: 1.92, period: 3.4, phase: 0.0 },
    { y: 0.625, rMax: 1.92, period: 3.4, phase: 0.5 },
    { y: 1.745, rMax: 0.94, period: 2.7, phase: 0.25 },
  ]
  for (const rs of rippleSpecs) {
    const rg = new THREE.RingGeometry(0.88, 1.0, 26)
    rg.rotateX(-Math.PI / 2)
    const rmat = new THREE.MeshBasicMaterial({
      color: COL.water.clone().multiplyScalar(1.9),
      transparent: true,
      opacity: 0,
      depthWrite: false,
    })
    const rmesh = new THREE.Mesh(rg, rmat)
    rmesh.position.y = rs.y
    rmesh.userData.dynamic = true
    group.add(rmesh)
    dynamics.push({ mesh: rmesh, kind: 'ripple', period: rs.period, phase: rs.phase, rMax: rs.rMax })
  }
  {
    const wg = makePart(new THREE.OctahedronGeometry(0.24), null, COL.moonTeal, false)
    const wisp = new THREE.Mesh(wg, glowMat)
    wisp.position.set(0, 2.85, 0)
    wisp.userData.dynamic = true
    group.add(wisp)
    dynamics.push({ mesh: wisp, kind: 'wisp', phase: 0, period: 1 })
  }

  // -------------------------------------------------------------- lantern point lights (≤ 3)
  const plCenter = new THREE.PointLight(0xffb066, 45, 0, 2)
  plCenter.position.set(0, 4.0, 0)
  group.add(plCenter)
  const plA = new THREE.PointLight(0xffc07a, 80, 0, 2)
  _v.set(Math.sin(theta0 + Math.PI * 0.34) * 9.5, 4.2, Math.cos(theta0 + Math.PI * 0.34) * 9.5)
  plA.position.copy(_v)
  group.add(plA)
  const plB = new THREE.PointLight(0xffc07a, 80, 0, 2)
  _v.set(Math.sin(theta0 + Math.PI * 1.34) * 9.5, 4.2, Math.cos(theta0 + Math.PI * 1.34) * 9.5)
  plB.position.copy(_v)
  group.add(plB)

  // -------------------------------------------------------------- update(t): zero-alloc flicker/sway
  const plBase = plCenter.intensity
  function update(t) {
    for (let i = 0; i < dynamics.length; i++) {
      const d = dynamics[i]
      const m = d.mesh
      if (d.kind === 'flame') {
        const f1 = Math.sin(t * d.speed + d.phase)
        const f2 = Math.sin(t * d.speed * 1.73 + d.phase * 2.1)
        const sxz = 1 + 0.1 * f1 - 0.06 * f2
        m.scale.set(sxz, 0.9 + 0.18 * f1 * f1 + 0.1 * f2, sxz)
        m.rotation.y = t * 1.9 + d.phase
      } else if (d.kind === 'ripple') {
        // born at the spout, swelling to the basin lip while fading
        const a = (t / d.period + d.phase) % 1
        const s = (0.28 + 0.72 * a) * d.rMax
        m.scale.set(s, 1, s)
        m.material.opacity = 0.36 * (1 - a) * (1 - a) * smoothstep(0, 0.12, a)
      } else if (d.kind === 'wisp') {
        m.position.y = 2.85 + Math.sin(t * 1.1) * 0.06
        m.rotation.y = t * 0.6
        const p = 1 + Math.sin(t * 2.3) * 0.05
        m.scale.set(p, p, p)
      } else {
        m.rotation.z = 0.14 * Math.sin(t * d.speed + d.phase)
        m.rotation.x = 0.07 * Math.sin(t * d.speed * 1.31 + d.phase * 1.7)
        m.rotation.y = d.baseRy
      }
    }
    plCenter.intensity = plBase * (1 + 0.09 * Math.sin(t * 7.3) * Math.sin(t * 3.1 + 1.2))
  }

  return { group, bounds: { r: R }, stalls, buskerSpots, colliders, update }
}

// ---------------------------------------------------------------------------
// goods props — each stall's counter visibly shows what it sells.
// All positions are stall-local: counter top spans x∈[-1.5,1.5], z∈[0.2,1.0],
// top surface at y = topY. `L(opts)` maps local shorthand to a world matrix.

function addGoodProps(good, cx, hw, L, topY, rng, body, glow) {
  // slight lift so props read under the string lights they sit beneath
  const c = srgb(good.color).multiplyScalar(1.25)
  const j = (s) => (rng() - 0.5) * s
  switch (good.id) {
    case 'apple': { // crate of stacked sun apples
      body(new THREE.BoxGeometry(0.62, 0.16, 0.5), L({ x: cx, y: topY + 0.08, z: 0.55 }), COL.timberDark)
      for (let ix = 0; ix < 3; ix++) for (let iz = 0; iz < 2; iz++) {
        body(new THREE.SphereGeometry(0.075, 8, 6),
          L({ x: cx - 0.18 + ix * 0.18 + j(0.02), y: topY + 0.2, z: 0.44 + iz * 0.2 + j(0.02) }), c)
      }
      for (let ix = 0; ix < 2; ix++) {
        body(new THREE.SphereGeometry(0.075, 8, 6),
          L({ x: cx - 0.09 + ix * 0.18, y: topY + 0.33, z: 0.54 + j(0.03) }), c)
      }
      // loose apple on the counter
      body(new THREE.SphereGeometry(0.07, 8, 6), L({ x: cx + hw * 0.7, y: topY + 0.07, z: 0.32 }), c)
      break
    }
    case 'fish': { // moon eels laid out on a slab
      body(new THREE.BoxGeometry(0.95, 0.05, 0.5), L({ x: cx, y: topY + 0.025, z: 0.6 }),
        COL.stone.clone().multiplyScalar(1.15))
      for (let k = 0; k < 4; k++) {
        const fx = cx - 0.33 + k * 0.22 + j(0.02)
        // eels lie side by side along the counter depth (local +Z)
        body(new THREE.CapsuleGeometry(0.05, 0.3, 3, 6),
          L({ x: fx, y: topY + 0.09, z: 0.56 + j(0.06), rx: Math.PI / 2, sx: 0.7 }), c)
        body(new THREE.ConeGeometry(0.055, 0.16, 5),
          L({ x: fx, y: topY + 0.09, z: 0.82 + j(0.04), rx: Math.PI / 2, sx: 0.6 }), c)
      }
      break
    }
    case 'bread': { // ember loaves in a row + basket
      for (let k = 0; k < 3; k++) {
        body(new THREE.CapsuleGeometry(0.09, 0.18, 3, 7),
          L({ x: cx - 0.3 + k * 0.3, y: topY + 0.085, z: 0.45 + j(0.06), rz: Math.PI / 2, ry: j(0.4), sy: 0.75 }), c)
      }
      body(new THREE.CylinderGeometry(0.2, 0.15, 0.14, 9), L({ x: cx + 0.1, y: topY + 0.07, z: 0.82 }), COL.sack)
      body(new THREE.CapsuleGeometry(0.08, 0.16, 3, 7),
        L({ x: cx + 0.1, y: topY + 0.17, z: 0.82, rz: Math.PI / 2, ry: 0.5, sy: 0.75 }), c)
      break
    }
    case 'spice': { // crimson spice mounds in shallow bowls
      for (let k = 0; k < 3; k++) {
        const sx = cx - 0.34 + k * 0.34
        body(new THREE.CylinderGeometry(0.17, 0.13, 0.07, 10), L({ x: sx, y: topY + 0.035, z: 0.55 }), COL.timberDark)
        body(new THREE.ConeGeometry(0.13, 0.17, 9), L({ x: sx, y: topY + 0.15, z: 0.55 }),
          c.clone().multiplyScalar(0.85 + k * 0.15))
      }
      // small spice sack
      body(new THREE.SphereGeometry(0.13, 8, 6), L({ x: cx + hw * 0.6, y: topY + 0.1, z: 0.85, sy: 0.8 }), COL.sack)
      break
    }
    case 'potion': { // murk tonics — luminous bottles
      for (let k = 0; k < 4; k++) {
        const bx = cx - 0.36 + k * 0.24 + j(0.02)
        const bz = 0.45 + (k % 2) * 0.3 + j(0.04)
        glow(new THREE.CylinderGeometry(0.055, 0.065, 0.16, 8),
          L({ x: bx, y: topY + 0.08, z: bz }), c.clone().multiplyScalar(0.55 + rng() * 0.5))
        body(new THREE.CylinderGeometry(0.02, 0.03, 0.09, 6), L({ x: bx, y: topY + 0.2, z: bz }), COL.timberDark)
      }
      break
    }
    case 'gem': { // void gems on a dark cushion
      body(new THREE.BoxGeometry(0.6, 0.07, 0.4), L({ x: cx, y: topY + 0.035, z: 0.55 }),
        srgb(0x241a3a))
      for (let k = 0; k < 5; k++) {
        glow(new THREE.OctahedronGeometry(0.055 + rng() * 0.03),
          L({ x: cx - 0.2 + (k % 3) * 0.2 + j(0.04), y: topY + 0.13, z: 0.46 + Math.floor(k / 3) * 0.18 + j(0.04), ry: rng() * Math.PI }),
          c.clone().multiplyScalar(0.6 + rng() * 0.6))
      }
      break
    }
    case 'lamp': { // wisp lamps — little caged lights, one hung higher
      for (let k = 0; k < 3; k++) {
        const lx = cx - 0.32 + k * 0.32
        addLantern(L, lx, topY + 0.14 + (k === 1 ? 0.22 : 0), 0.55,
          c.clone().multiplyScalar(1.0 + rng() * 0.4), body, glow, 0.85)
      }
      break
    }
    case 'rug': { // dream rugs — rolled bolts + one leaning
      for (let k = 0; k < 3; k++) {
        body(new THREE.CylinderGeometry(0.085, 0.085, 0.6, 9),
          L({ x: cx, y: topY + 0.085 + k * 0.13, z: 0.5 + (k % 2) * 0.14, rz: Math.PI / 2 }),
          k === 1 ? SILKS_LIN[1] : c.clone().multiplyScalar(0.8 + k * 0.2))
      }
      // leaning roll against the counter front
      body(new THREE.CylinderGeometry(0.1, 0.1, 1.3, 9),
        L({ x: cx + hw * 0.85, y: 0.62, z: 1.12, rx: -0.35 }), c.clone().multiplyScalar(0.7))
      break
    }
    case 'scroll': { // curse scrolls — pyramid stack of rolled paper
      for (let k = 0; k < 3; k++) {
        body(new THREE.CylinderGeometry(0.04, 0.04, 0.42, 7),
          L({ x: cx - 0.09 + k * 0.09, y: topY + 0.045, z: 0.5 + (k - 1) * 0.1, rz: Math.PI / 2 }), c)
      }
      for (let k = 0; k < 2; k++) {
        body(new THREE.CylinderGeometry(0.04, 0.04, 0.42, 7),
          L({ x: cx - 0.045 + k * 0.09, y: topY + 0.12, z: 0.5, rz: Math.PI / 2 }), c)
      }
      body(new THREE.CylinderGeometry(0.04, 0.04, 0.42, 7),
        L({ x: cx, y: topY + 0.195, z: 0.5, rz: Math.PI / 2 }), c.clone().multiplyScalar(1.1))
      // wax seal bands
      body(new THREE.BoxGeometry(0.06, 0.09, 0.09), L({ x: cx, y: topY + 0.045, z: 0.5 }), SILKS_LIN[0])
      break
    }
    case 'skull': { // chatter skulls with tiny glowing eyes
      for (let k = 0; k < 3; k++) {
        const sx = cx - 0.3 + k * 0.3
        const ry = j(0.9)
        body(new THREE.SphereGeometry(0.095, 9, 7),
          L({ x: sx, y: topY + 0.1, z: 0.55, ry, sy: 0.92, sz: 1.05 }), c)
        body(new THREE.BoxGeometry(0.1, 0.05, 0.07),
          L({ x: sx + Math.sin(ry) * 0.05, y: topY + 0.035, z: 0.55 + Math.cos(ry) * 0.05, ry }), c.clone().multiplyScalar(0.85))
        for (const es of [-1, 1]) {
          glow(new THREE.SphereGeometry(0.014, 5, 4),
            L({
              x: sx + Math.sin(ry) * 0.08 + Math.cos(ry) * es * 0.035,
              y: topY + 0.12,
              z: 0.55 + Math.cos(ry) * 0.08 - Math.sin(ry) * es * 0.035,
            }), COL.ember)
        }
      }
      break
    }
    default: { // unknown good: generic crate with accent lid (future-proof)
      body(new THREE.BoxGeometry(0.4, 0.25, 0.4), L({ x: cx, y: topY + 0.125, z: 0.55 }), COL.timberDark)
      body(new THREE.BoxGeometry(0.42, 0.05, 0.42), L({ x: cx, y: topY + 0.27, z: 0.55 }), c)
    }
  }
}

// crates / barrel / sack cluster (base matrix positions the cluster)
function addClutter(base, rng, accent, body) {
  const L = (opts) => new THREE.Matrix4().multiplyMatrices(base, M(opts))
  body(new THREE.BoxGeometry(0.56, 0.56, 0.56), L({ x: -0.18, y: 0.28, ry: rng() * 0.6 }), COL.timberDark)
  body(new THREE.BoxGeometry(0.58, 0.06, 0.58), L({ x: -0.18, y: 0.59, ry: 0.1 }), accent.clone().multiplyScalar(0.7))
  body(new THREE.BoxGeometry(0.38, 0.38, 0.38), L({ x: -0.14, y: 0.19 + 0.62, z: 0.06, ry: rng() * 0.9 }), COL.timber)
  body(new THREE.CylinderGeometry(0.24, 0.27, 0.66, 11), L({ x: 0.42, y: 0.33, z: -0.1 }), COL.barrel)
  body(new THREE.CylinderGeometry(0.25, 0.25, 0.045, 11), L({ x: 0.42, y: 0.2, z: -0.1 }), COL.iron)
  body(new THREE.CylinderGeometry(0.255, 0.255, 0.045, 11), L({ x: 0.42, y: 0.52, z: -0.1 }), COL.iron)
  body(new THREE.SphereGeometry(0.26, 8, 6), L({ x: 0.28, y: 0.18, z: 0.48, sy: 0.72 }), COL.sack)
  body(new THREE.ConeGeometry(0.07, 0.1, 6), L({ x: 0.28, y: 0.4, z: 0.48 }), COL.sack.clone().multiplyScalar(0.8))
}
