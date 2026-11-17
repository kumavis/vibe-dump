// boombox — the cast parts. All kit geometry: a fangBody box with rounded vertical arrises (the cabinet, its front
// wall hidden behind the faceplate), kit.plate slabs with true openings (the faceplate with its two speaker openings,
// the lid, the cassette door, the slider tabs, the tuner needle), concave cones as polar buildSurface discs in the
// openings, notched flanges on the arrises and down the nose, revolved knobs / antenna / feet (columnLeg), a swept
// flat bar for the handle and animalHeads at its pivots. Units mm, Y up, front +Z (layout.js).

import * as THREE from 'three'
import { BODY, FACE, SPK, MID, DOOR, KEYS, HANDLE, ANTENNA, FEET, rrect, rrectSD, circle, smooth } from './layout.js'

const HALF_PI = Math.PI / 2

export function tag(o, part, name) {
  o.userData.part = part
  if (name) o.name = name
  o.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; m.userData.part = part } })
  return o
}

/** a solid of revolution about +Y from an [r, y] profile (bottom → top, r 0 at both ends closes it) */
export function revolve(profile, material, { segments = 48 } = {}) {
  const pts = profile.map(([r, y]) => new THREE.Vector2(Math.max(r, 0), y))
  const geo = new THREE.LatheGeometry(pts, segments)
  geo.computeVertexNormals()
  return new THREE.Mesh(geo, material)
}

// ------------------------------------------------------------------ the cabinet

function boxOpts() {
  return { width: BODY.boxW, depth: BODY.boxD, height: BODY.h, wall: BODY.wall, cornerRadius: BODY.r, rim: { kind: 'plain' } }
}

export function boxLayout(kit) {
  return kit.fangLayout(boxOpts())
}

/** panels: { side, back } ReliefMaps (side on both ends) → { body, lid } */
export function buildBox(kit, panels, { q = 1, plain }) {
  const sq = Math.sqrt(q)
  const cell = (relief, density) => (relief ? [[{ relief, density }]] : null)
  const body = kit.fangBody({
    ...boxOpts(),
    material: plain,
    density: 0.4 * sq,
    cells: { front: null, right: cell(panels.side, 0.5 * sq), left: cell(panels.side, 0.5 * sq), back: cell(panels.back, 0.4 * sq) },
  })
  body.position.set(0, BODY.y0, BODY.zMid)
  tag(body, 'body', 'cabinet')

  // the lid: a plate over the cabinet's top, back corners rounded with the cabinet, the front edge square to the faceplate
  const { w, d } = lidSize()
  const lidOutline = lidOutlinePts(w, d)
  const lidSD = (x, y) => lidSDF(x, y, w, d)
  const lid = kit.plate({
    outline: lidOutline,
    thickness: (x, y) => BODY.lidT - 2 * Math.max(0, 2.6 + lidSD(x, y)) * 0.75,
    front: panels.lid ? { relief: panels.lid, rect: { x: -w / 2, y: -d / 2, w, h: d } } : null,
    spacing: 16 / sq, reliefSpacing: 5 / sq,
    refine: (x, y) => (lidSD(x, y) > -4 ? 6 : 99),
    material: panels.lid ? new kit.PatinaMaterial({ relief: panels.lid }) : plain,
    part: 'lid',
  })
  lid.rotation.x = -HALF_PI // plate +y → −Z (back), plate front → up; panel bottom = the front edge
  lid.position.set(0, BODY.y1 + BODY.lidT / 2, BODY.zSeam - d / 2)
  tag(lid, 'lid', 'lid')

  // the cabinet's rounded FRONT arrises would leave a pocket behind the faceplate's square corners: fill each with a
  // square post, flush with the end wall (its front face is hidden by the faceplate)
  const posts = []
  const R = BODY.r
  for (const sx of [-1, 1]) {
    const post = kit.plate({ outline: [[-R / 2, -BODY.h / 2], [R / 2, -BODY.h / 2], [R / 2, BODY.h / 2], [-R / 2, BODY.h / 2]], thickness: R, spacing: 20, material: plain, part: 'body' })
    post.position.set(sx * (BODY.boxW / 2 - R / 2), BODY.y0 + BODY.h / 2, BODY.zSeam - R / 2)
    posts.push(tag(post, 'body', 'corner-post'))
  }
  return { body, lid, posts }
}

export function lidSize() {
  return { w: BODY.boxW + 2, d: BODY.boxD + 2 }
}

function lidOutlinePts(w, d) {
  // plate frame: x right, y toward the BACK (y = −d/2 is the front edge). Back corners rounded, front square.
  const r = BODY.r + 1, out = []
  out.push([-w / 2, -d / 2], [w / 2, -d / 2])
  for (let i = 0; i <= 8; i++) { const a = (i / 8) * HALF_PI; out.push([w / 2 - r + r * Math.cos(a), d / 2 - r + r * Math.sin(a)]) }
  for (let i = 0; i <= 8; i++) { const a = HALF_PI + (i / 8) * HALF_PI; out.push([-w / 2 + r + r * Math.cos(a), d / 2 - r + r * Math.sin(a)]) }
  return out
}

function lidSDF(x, y, w, d) {
  // the rounded box extended past the front so the front edge is not rounded over (it meets the faceplate)
  const r = BODY.r + 1
  const sd = rrectSD(x, y, [0, 10], w, d + 20, r)
  return Math.max(sd, -(y + d / 2) - 30) // keep the front edge full thickness
}

// ------------------------------------------------------------------ the faceplate and the speakers

/** faceplate thickness (plate frame mm, centred) */
export function faceThickness() {
  const H = FACE.h, W = FACE.w
  const cy = SPK.y - H / 2
  return (x, y) => {
    let t = FACE.t
    const dOut = -rrectSD(x, y, [0, 0], W, H, FACE.r)
    t -= 2 * Math.max(0, 4 - dOut) * 0.75 // rounded-over outer arris
    for (const sx of [-1, 1]) {
      const dIn = Math.hypot(x - sx * SPK.dx, y - cy) - SPK.hole
      if (dIn < SPK.lip) t -= 2 * SPK.lipDrop * smooth(1 - Math.max(0, dIn) / SPK.lip) // the surround slopes into the socket
    }
    return t
  }
}

export function buildFace(kit, relief, { q = 1, plain }) {
  const W = FACE.w, H = FACE.h
  const cy = SPK.y - H / 2
  const T = faceThickness()
  const face = kit.plate({
    outline: rrect([0, 0], W, H, FACE.r, 8),
    holes: [circle([-SPK.dx, cy], SPK.hole, 96), circle([SPK.dx, cy], SPK.hole, 96)],
    thickness: T,
    front: relief ? { relief, rect: { x: -W / 2, y: -H / 2, w: W, h: H } } : null,
    spacing: 14, reliefSpacing: q >= 1 ? 4.2 : 6,
    refine: (x, y) => {
      if (rrectSD(x, y, [0, 0], W, H, FACE.r) > -6) return 4
      for (const sx of [-1, 1]) if (Math.hypot(x - sx * SPK.dx, y - cy) - SPK.hole < SPK.lip + 3) return 3.2
      return 99
    },
    material: relief ? new kit.PatinaMaterial({ relief }) : plain,
    part: 'body',
  })
  face.position.set(0, FACE.y0 + H / 2, FACE.zMid)
  return tag(face, 'body', 'faceplate')
}

/** world centre of a speaker (side −1 left, +1 right) */
export function speakerCentre(side) {
  return new THREE.Vector3(side * SPK.dx, FACE.y0 + SPK.y, 0)
}

/** the cone's surface z at radius r (world) */
export function coneZ(r) {
  const a = SPK.cap + 2
  if (r <= a) return SPK.floorZ
  const t = Math.min(1, (r - a) / (SPK.coneR - a))
  // a paper cone: nearly straight, flaring a little toward the surround
  return SPK.floorZ + (SPK.rimZ - SPK.floorZ) * (0.75 * t + 0.25 * t * t)
}

/**
 * A disc / cone as a polar buildSurface patch, re-aimed so the relief panel lies flat across it (world X → panel x,
 * world Y → panel y; mirror flips x). c: world centre [x, y], R radius, z(r) the surface height, map.userData.c the
 * panel point under the centre.
 */
export function polarDisc(kit, { c, R, z, relief, material, nA = 96, nR = 30, mirror = false, fadeRim = 1.2 }) {
  const mx = mirror ? -1 : 1
  const pc = relief ? relief.userData.c : [0, 0]
  const W = relief ? relief.widthMM : 1, Hp = relief ? relief.heightMM : 1
  const polar = (u, v) => { const a = u * Math.PI * 2, r = R * (1 - v); return [r * Math.cos(a), r * Math.sin(a), r, a] }
  const surface = (u, v, out) => {
    const [dx, dy, r, a] = polar(u, v)
    const e = 0.05
    const s = (z(r + e) - z(Math.max(0, r - e))) / (r < e ? e : 2 * e)
    out.pos.set(c[0] + dx, c[1] + dy, z(r))
    out.nrm.set(-s * Math.cos(a), -s * Math.sin(a), 1).normalize()
  }
  const panelMap = (u, v, o) => {
    const [dx, dy] = polar(u, v)
    o[0] = (pc[0] + mx * dx) / W
    o[1] = (pc[1] + dy) / Hp
    o[2] = 1
  }
  const geo = kit.buildSurface({
    surface, segments: [nA, nR], relief: relief || null, panelMap: relief ? panelMap : undefined,
    fade: { u0: 0, u1: 0, v0: fadeRim, v1: 0 }, maxVerts: 1e6,
  })
  if (relief) {
    // the grid runs round and in, the panel runs east and up: re-aim the tangent frame at the panel axes (a dome would
    // otherwise shade as a bowl); a mirrored map: east flips
    const E = [mx, 0, 0], N = [0, 1, 0]
    const nrm = geo.attributes.normal.array, tan = geo.attributes.tangent.array
    for (let i = 0, k = 0; k < tan.length; i += 3, k += 4) {
      const nx = nrm[i], ny = nrm[i + 1], nz = nrm[i + 2]
      const d = E[0] * nx + E[1] * ny + E[2] * nz
      let tx = E[0] - nx * d, ty = E[1] - ny * d, tz = E[2] - nz * d
      const l = Math.hypot(tx, ty, tz) || 1
      tx /= l; ty /= l; tz /= l
      const bx = ny * tz - nz * ty, by = nz * tx - nx * tz, bz = nx * ty - ny * tx
      tan[k] = tx; tan[k + 1] = ty; tan[k + 2] = tz; tan[k + 3] = bx * N[0] + by * N[1] + bz * N[2] < 0 ? -1 : 1
    }
    geo.attributes.tangent.needsUpdate = true
  }
  return new THREE.Mesh(geo, material)
}

export function buildCones(kit, relief, { q = 1, plain }) {
  const sq = Math.sqrt(q)
  const mat = relief ? new kit.PatinaMaterial({ relief }) : plain
  const cones = []
  for (const side of [-1, 1]) {
    const c = speakerCentre(side)
    const m = polarDisc(kit, { c: [c.x, c.y], R: SPK.coneR, z: coneZ, relief, material: mat, nA: Math.round(150 * sq), nR: Math.round(54 * sq), mirror: side > 0 })
    cones.push(tag(m, 'speakers', side < 0 ? 'speaker-left' : 'speaker-right'))
  }
  return cones
}

// ------------------------------------------------------------------ the centre column: door, nose, needle, knobs, sliders, keys

export function buildDoor(kit, relief, { q = 1, plain }) {
  const { w, h, r, t } = DOOR
  const door = kit.plate({
    outline: rrect([0, 0], w, h, r, 6),
    thickness: (x, y) => t - 2 * Math.max(0, 1.6 + rrectSD(x, y, [0, 0], w, h, r)) * 0.6,
    front: relief ? { relief, rect: { x: -w / 2, y: -h / 2, w, h } } : null,
    spacing: 8, reliefSpacing: q >= 1 ? 2.6 : 3.6,
    material: relief ? new kit.PatinaMaterial({ relief }) : plain,
    part: 'door',
  })
  door.position.set(0, FACE.y0 + MID.door.y, BODY.zFront + t / 2 - 1.2)
  return tag(door, 'door', 'cassette-door')
}

export function buildNose(kit, { plain, seed }) {
  const y0 = FACE.y0 + MID.nose.y0, y1 = FACE.y0 + MID.nose.y1
  const f = kit.flange({
    from: new THREE.Vector3(0, y0, BODY.zFront - 1), to: new THREE.Vector3(0, y1, BODY.zFront - 1), out: new THREE.Vector3(0, 0, 1),
    height: 9, thickness: 7, embed: 3, taper: 4, bevel: 0.8, waver: 0.2,
    notches: { shape: 'T', pitch: 7.4, depth: 0.42, width: 2.4 }, ends: { start: 'square', end: 'square' },
    seed: seed + 5, material: plain, part: 'flanges', incise: 'auto',
  })
  return tag(f, 'flanges', 'nose')
}

/** the tuner needle: a small upright blade of turquoise inlay standing in the tuner window */
export function buildNeedle(kit, { x = 24 }) {
  const { y0, y1 } = MID.tuner
  const h = y1 - y0 - 3
  const mat = new kit.PatinaMaterial({ meshAge: 0.35, meshPolish: 0.2, meshTint: new THREE.Color('#46b8a8') })
  const blade = kit.plate({
    outline: [[-2.2, 0], [2.2, 0], [1.3, h * 0.55], [0, h], [-1.3, h * 0.55]],
    thickness: 2.6, spacing: 1.5, material: mat, part: 'needle',
  })
  blade.position.set(x, FACE.y0 + y0 + 1.5, BODY.zFront - 1.4)
  return tag(blade, 'needle', 'tuner-needle')
}

/** a knob: a turned boss with a notched (knurled) edge; the top a polar disc carrying a whorl */
export function buildKnobs(kit, relief, { q = 1, plain }) {
  const sq = Math.sqrt(q)
  const R = MID.knobs.r
  const H = 11, notches = 18
  const nT = Math.round(notches * 6 * Math.min(1.2, sq)), prof = [[R - 0.4, -3], [R, 0], [R, H - 3.2], [R - 0.8, H - 1.2], [R - 2.2, H]]
  // the side: a ring of quads, its radius notched
  const pos = [], idx = []
  for (const [r, y] of prof) {
    for (let i = 0; i <= nT; i++) {
      const a = (2 * Math.PI * i) / nT
      const w = 0.5 + 0.5 * Math.cos(a * notches)
      const notch = y > 0.5 && y < H - 1 ? 0.9 * smooth((w - 0.55) / 0.3) : 0
      const rr = r - notch
      pos.push(rr * Math.sin(a), y, rr * Math.cos(a))
    }
  }
  for (let j = 0; j < prof.length - 1; j++) {
    for (let i = 0; i < nT; i++) {
      const a = j * (nT + 1) + i, b = a + 1, c = a + nT + 1, d = c + 1
      idx.push(a, b, d, a, d, c)
    }
  }
  const sideGeo = new THREE.BufferGeometry()
  sideGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  sideGeo.setIndex(idx)
  sideGeo.computeVertexNormals()
  const mat = relief ? new kit.PatinaMaterial({ relief }) : plain
  const knobs = []
  for (const x of MID.knobs.x) {
    const g = new THREE.Group()
    const side = new THREE.Mesh(sideGeo, plain)
    side.rotation.x = HALF_PI // +Y → +Z
    g.add(side)
    const capR = R - 2.2
    const top = polarDisc(kit, { c: [0, 0], R: capR + 0.01, z: (r) => H + 1.6 * (1 - (r / capR) ** 2), relief, material: mat, nA: Math.round(64 * sq), nR: Math.round(16 * sq), fadeRim: 0.6 })
    g.add(top)
    g.position.set(x, FACE.y0 + MID.knobs.y, BODY.zFront - 0.8)
    knobs.push(tag(g, 'knobs', 'knob'))
  }
  return knobs
}

export function buildSliders(kit, { plain }) {
  const tabs = []
  const { x, y0, y1 } = MID.sliders
  x.forEach((sx, i) => {
    const y = y0 + (y1 - y0) * (i === 0 ? 0.35 : 0.62)
    const tab = kit.plate({ outline: rrect([0, 0], 9, 6.5, 2.2, 3), thickness: 9, spacing: 2.5, material: plain, part: 'sliders' })
    tab.position.set(sx, FACE.y0 + y, BODY.zFront - 1)
    tabs.push(tag(tab, 'sliders', 'slider'))
  })
  return tabs
}

/** the transport keys: squared pillow tabs in a row on the faceplate's top edge, their fronts over the front */
export function buildKeys(kit, { q = 1, plain }) {
  const { n, pitch, w, d, h } = KEYS
  const nT = q >= 1 ? 28 : 20
  const rings = [0, 0.1, 0.22, 0.36, 0.52, 0.68, 0.82, 0.92, 0.98, 1]
  const E = 7
  const pos = [], idx = []
  const cols = []
  for (let i = 0; i < nT; i++) {
    const th = (2 * Math.PI * i) / nT
    const c = Math.cos(th), s = Math.sin(th)
    cols.push([Math.sign(c) * Math.abs(c) ** (2 / E), Math.sign(s) * Math.abs(s) ** (2 / E)])
  }
  for (let k = 0; k < n; k++) {
    const kx = (k - (n - 1) / 2) * pitch
    const kz = KEYS.zFront - d / 2
    const a = w / 2, b = d / 2
    const start = pos.length / 3
    // a pillow top: a gentle dome falling to a rounded shoulder; a sunk transverse groove a third of the way back
    const top = (rho, rx, rz) => {
      let y = h - 1.1 * rho * rho - 2.4 * Math.max(0, rho - 0.82) ** 2 / 0.0324
      const g = (rz - (b * 0.25)) / 1.6
      y -= 0.9 * Math.exp(-g * g) * (rho < 0.9 ? 1 : 0)
      return y
    }
    pos.push(kx, top(0, 0, 0), kz)
    for (let r = 1; r < rings.length; r++) {
      const rho = rings[r]
      for (const [cx, cz] of cols) { const rx = cx * a * rho, rz = cz * b * rho; pos.push(kx + rx, top(rho, rx, rz), kz + rz) }
    }
    for (const yy of [1.5, -3]) for (const [cx, cz] of cols) pos.push(kx + cx * (a + 0.2), yy, kz + cz * (b + 0.2))
    const ringStart = (r) => start + 1 + (r - 1) * nT
    for (let i = 0; i < nT; i++) idx.push(start, ringStart(1) + ((i + 1) % nT), ringStart(1) + i)
    const nR = rings.length - 1 + 2
    for (let r = 1; r < nR; r++) {
      const r0 = ringStart(r), r1 = ringStart(r + 1)
      for (let i = 0; i < nT; i++) { const i1 = (i + 1) % nT; idx.push(r0 + i, r1 + i1, r1 + i, r0 + i, r0 + i1, r1 + i1) }
    }
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geo.setIndex(idx)
  geo.computeVertexNormals()
  const mesh = new THREE.Mesh(geo, plain)
  mesh.position.y = BODY.top
  return tag(mesh, 'keys', 'transport-keys')
}

// ------------------------------------------------------------------ flanges and feet

export function buildFlanges(kit, { plain, seed }) {
  const out = []
  const c = Math.SQRT1_2
  let i = 0
  const mk = (from, to, dir, h = 10) => {
    const f = kit.flange({
      from, to, out: dir, height: h, thickness: 6.5, embed: 3, taper: 4, bevel: 0.8, waver: 0.3,
      notches: { shape: 'T', pitch: 15, depth: 0.45, width: 3.2 }, ends: { start: 'square', end: 'square' },
      seed: seed + 20 + i++, material: plain, part: 'flanges', incise: 'auto',
    })
    out.push(tag(f, 'flanges'))
  }
  // the faceplate's outer vertical arrises (the bullnose's 45° line)
  for (const sx of [-1, 1]) {
    const x = sx * (FACE.w / 2 - 1.6), z = BODY.zFront - 1.6
    mk(new THREE.Vector3(x, FACE.y0 + 16, z), new THREE.Vector3(x, FACE.y0 + FACE.h - 16, z), new THREE.Vector3(sx, 0, 1).normalize())
  }
  // the cabinet's back arrises
  const hw = BODY.boxW / 2, r = BODY.r
  for (const sx of [-1, 1]) {
    const x = sx * (hw - r + r * c), z = BODY.zBack + r - r * c
    mk(new THREE.Vector3(x, BODY.y0 + 4, z), new THREE.Vector3(x, BODY.y1 - 3, z), new THREE.Vector3(sx, 0, -1).normalize())
  }
  return out
}

export function buildFeet(kit, { plain }) {
  const legs = []
  for (const sx of [-1, 1]) {
    for (const z of FEET.z) {
      const leg = kit.columnLeg({ height: BODY.legH, radius: FEET.r, taper: -0.14, entasis: 0, foot: { swell: 0.2, height: 5 }, embed: 6, material: plain, density: 0.5 })
      leg.position.set(sx * FEET.x, 0, z)
      legs.push(tag(leg, 'legs'))
    }
  }
  return legs
}

// ------------------------------------------------------------------ the handle

/** the handle's centre line (world, in the plane z = HANDLE.pivotZ): up the left arm, across, down the right arm */
export function handlePath() {
  const { armX: X, barY: Y, bend: R } = HANDLE
  const yEnd = HANDLE.pivotY + 8
  const pts = []
  const line = (a, b, n) => { for (let i = 0; i < n; i++) pts.push([a[0] + ((b[0] - a[0]) * i) / n, a[1] + ((b[1] - a[1]) * i) / n]) }
  const arc = (cx, cy, a0, a1, n) => { for (let i = 0; i < n; i++) { const a = a0 + ((a1 - a0) * i) / n; pts.push([cx + R * Math.cos(a), cy + R * Math.sin(a)]) } }
  line([-X, yEnd], [-X, Y - R], 24)
  arc(-X + R, Y - R, Math.PI, HALF_PI, 16)
  line([-X + R, Y], [X - R, Y], 80)
  arc(X - R, Y - R, HALF_PI, 0, 16)
  line([X, Y - R], [X, yEnd], 24)
  pts.push([X, yEnd])
  const cum = [0]
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
  const L = cum[cum.length - 1]
  const at = (s) => {
    s = Math.max(0, Math.min(L, s))
    let i = 1
    while (i < pts.length - 1 && cum[i] < s) i++
    const f = (s - cum[i - 1]) / Math.max(1e-9, cum[i] - cum[i - 1])
    const p = [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f]
    // tangent from a finite difference over the polyline (smooth across the arcs)
    const a = Math.max(0, s - 1), b = Math.min(L, s + 1)
    return { p, a, b }
  }
  const point = (s) => at(s).p
  const tangent = (s) => { const { a, b } = at(s); const pa = at(a).p, pb = at(b).p; const l = Math.hypot(pb[0] - pa[0], pb[1] - pa[1]) || 1; return [(pb[0] - pa[0]) / l, (pb[1] - pa[1]) / l] }
  return { L, point, tangent }
}

/** the handle's section: a rounded rectangle, arc-length parametrised; half-extents a (outward, in-plane) × b (z) */
export function handleSection(n = 256) {
  const a = HANDLE.thick / 2, b = HANDLE.wide / 2, E = 5
  const raw = []
  for (let i = 0; i <= n; i++) {
    const phi = (2 * Math.PI * i) / n
    const c = Math.cos(phi), s = Math.sin(phi)
    raw.push([a * Math.sign(c) * Math.abs(c) ** (2 / E), b * Math.sign(s) * Math.abs(s) ** (2 / E)])
  }
  const cum = [0]
  for (let i = 1; i <= n; i++) cum.push(cum[i - 1] + Math.hypot(raw[i][0] - raw[i - 1][0], raw[i][1] - raw[i - 1][1]))
  const P = cum[n]
  // at(t), t ∈ [0, 1] of the perimeter from phi = 0 (the outer face's middle), running toward −z
  const at = (t) => {
    t = ((t % 1) + 1) % 1
    const s = t * P
    let i = 1
    while (i < n && cum[i] < s) i++
    const f = (s - cum[i - 1]) / Math.max(1e-9, cum[i] - cum[i - 1])
    const p = [raw[i - 1][0] + (raw[i][0] - raw[i - 1][0]) * f, raw[i - 1][1] + (raw[i][1] - raw[i - 1][1]) * f]
    return [p[0], -p[1]]
  }
  return { perimeter: P, at }
}

export function handlePanelSize() {
  return { w: handlePath().L, h: handleSection().perimeter }
}

/**
 * The swept bar. Panel: x along the handle from the left pivot, y round the section from the middle of the INNER face
 * (toward the body / under the bar) — so the outer face's middle is at y = perimeter / 2.
 */
export function buildHandle(kit, relief, { q = 1, plain }) {
  const path = handlePath()
  const sec = handleSection()
  const z0 = HANDLE.pivotZ
  const surface = (u, v, out) => {
    const s = u * path.L
    const p = path.point(s), t = path.tangent(s)
    const n = [-t[1], t[0]] // outward from the loop (away from the body)
    // v = 0.5 is the outer face's middle; v increases running toward −z there, so that dP/du × dP/dv is outward
    const [sa, sb] = sec.at(v - 0.5)
    out.pos.set(p[0] + n[0] * sa, p[1] + n[1] * sa, z0 + sb)
  }
  const sq = Math.sqrt(q)
  const geo = kit.buildSurface({
    surface,
    segments: [Math.round((path.L / 2.4) * sq), Math.round(64 * Math.min(1.2, sq))],
    relief: relief || null,
    fade: { u0: 3, u1: 3, v0: 0, v1: 0 },
  })
  const mesh = new THREE.Mesh(geo, relief ? new kit.PatinaMaterial({ relief }) : plain)
  return tag(mesh, 'handles', 'handle')
}

export function buildHandleHeads(kit, { q = 1, plain, seed }) {
  const heads = []
  for (const sx of [-1, 1]) {
    const head = kit.animalHead({
      kind: 'bovine', width: 52, projection: 0.6, droop: 34, hornSize: 0.9, hornCurl: 0.7, eyeSize: 1.15, ears: true, embed: 6,
      seed: seed + 50 + (sx > 0 ? 1 : 0), quality: q, detail: 1.3 / Math.sqrt(q), material: plain, part: 'heads',
    })
    head.rotation.y = sx * HALF_PI // local +Z out of the side wall
    head.position.set(sx * (BODY.boxW / 2 - 1), HANDLE.pivotY - 4, HANDLE.pivotZ)
    heads.push(tag(head, 'heads', 'handle-head'))
  }
  return heads
}

// ------------------------------------------------------------------ the antenna

export function buildAntenna(kit, { q = 1, plain }) {
  const { length: L, r0, r1 } = ANTENNA
  const seg = 5, nodeW = 3.2
  const prof = [[0, -6], [r0 + 1.6, -6], [r0 + 1.6, -1]]
  const segL = (L - 18) / seg
  for (let k = 0; k < seg; k++) {
    const y0 = k * segL
    const r = r0 + ((r1 - r0) * k) / (seg - 1)
    // a bamboo node: a swelling ring with a groove above it, then the culm, a little waisted
    prof.push([r + 1.1, y0], [r + 1.4, y0 + nodeW * 0.5], [r + 0.6, y0 + nodeW], [r, y0 + nodeW + 1.4], [r * 0.93, y0 + segL * 0.55], [r, y0 + segL - 1])
  }
  // the bud: a sepal collar and a closed lotus bud with a pointed tip
  const yb = seg * segL
  prof.push([r1 + 1.4, yb], [r1 + 2.6, yb + 1.6], [r1 + 1.2, yb + 3], [4.4, yb + 5], [5.6, yb + 8.5], [5.2, yb + 12], [3.6, yb + 15], [1.4, yb + 17.5], [0, yb + 18.4])
  const rod = revolve(prof, plain, { segments: Math.round(28 * Math.min(1.2, Math.sqrt(q))) })
  const dir = new THREE.Vector3(...ANTENNA.dir).normalize()
  rod.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)
  rod.position.set(...ANTENNA.base)
  // the pivot: a ball in a cup on the lid
  const ball = revolve([[0, -3], [8.5, -3], [9.5, 0], [8, 3], [7.6, 5], [8.6, 8], [7, 12], [4, 14.2], [0, 14.8]], plain, { segments: 32 })
  ball.position.set(...ANTENNA.base)
  const g = new THREE.Group()
  g.add(rod, ball)
  return tag(g, 'antenna', 'antenna')
}
