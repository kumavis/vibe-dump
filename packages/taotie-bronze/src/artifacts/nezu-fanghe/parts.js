// nezu-fanghe — the parts that are not the lobed body: eave slab, hipped cap, plateau plate with the
// filling hole, crenellated ridge, spout, handle sculpture, flanges, the small frieze heads.

import * as THREE from 'three'
import { D, SPOUT, HOLE, RIDGE, HANDLE, creaseDepth, collarHalf, polyPath, handleSDF, friezeHeadSDF, plateauY } from './form.js'

const SN = [[0, 0, 1], [1, 0, 0], [0, 0, -1], [-1, 0, 0]] // front, right, back, left
const ST = [[1, 0, 0], [0, 0, -1], [-1, 0, 0], [0, 0, 1]] // left → right seen from outside

/** a bilinear quad patch (p00 bottom-left from outside … p11 top-right) with an optional panel */
function quad(kit, p00, p10, p01, p11, { relief = null, material, density = 0.5, fade = 1, part, name }) {
  const geo = kit.buildSurface({
    surface: kit.quadSurface(p00, p10, p01, p11),
    segments: relief ? { density } : [2, 2],
    relief,
    fade,
  })
  const m = new THREE.Mesh(geo, relief ? new kit.PatinaMaterial({ relief }) : material)
  m.name = name || 'quad'
  m.userData.part = part
  m.castShadow = m.receiveShadow = true
  return m
}

/** eave slab: top, underside and four fascia faces (each with the leiwen band panel) */
export function eave(kit, { fascia, material, q }) {
  const g = new THREE.Group()
  g.userData.part = 'eave'
  const a = D.eaveA, y0 = D.eave, y1 = D.eaveTop
  for (let k = 0; k < 4; k++) {
    const n = SN[k], t = ST[k]
    const P = (s, y) => [n[0] * a + t[0] * s, y, n[2] * a + t[2] * s]
    g.add(quad(kit, P(-a, y0), P(a, y0), P(-a, y1), P(a, y1), { relief: fascia, material, density: 0.9 * Math.sqrt(q), fade: 0.4, part: 'eave', name: 'fascia-' + k }))
  }
  // top (between the fascia and the cap) and underside (between the fascia and the collar)
  const topGeo = new THREE.PlaneGeometry(2 * a, 2 * a)
  topGeo.rotateX(-Math.PI / 2)
  const top = new THREE.Mesh(topGeo, material)
  top.position.y = y1
  const under = new THREE.Mesh(topGeo.clone().rotateX(Math.PI), material)
  under.position.y = y0
  for (const m of [top, under]) { m.userData.part = 'eave'; m.receiveShadow = m.castShadow = true; g.add(m) }
  return g
}

/** the cap: a short vertical skirt, four hipped slopes (panels), the plateau plate with the hole */
export function cap(kit, { slopes, top, material, q }) {
  const g = new THREE.Group()
  g.userData.part = 'lid'
  const a0 = D.capA, y0 = D.capBase, y1 = y0 + D.capSkirt, a1 = D.topA, y2 = D.capTop
  for (let k = 0; k < 4; k++) {
    const n = SN[k], t = ST[k]
    const P = (A, s, y) => [n[0] * A + t[0] * s, y, n[2] * A + t[2] * s]
    g.add(quad(kit, P(a0, -a0, y0), P(a0, a0, y0), P(a0, -a0, y1), P(a0, a0, y1), { material, part: 'lid', name: 'skirt-' + k }))
    const S = slopes[k]
    // cushion: steep at the skirt, rounding over to the plateau — a loft of squares, so the hips stay shared
    const lv = (v) => ({ A: a0 - (a0 - a1) * Math.pow(v, 1.9), y: y1 + (y2 - y1) * Math.sin((Math.PI / 2) * Math.min(1, v * 1.04)) })
    const geo = kit.buildSurface({
      surface: (u, v, out) => { const L = lv(v); const sx = (2 * u - 1) * L.A; out.pos.set(n[0] * L.A + t[0] * sx, L.y, n[2] * L.A + t[2] * sx) },
      segments: { density: 0.75 * Math.sqrt(q) }, relief: S, fade: 0.8,
      panelMap: (u, v, pm) => { const L = lv(v); pm[0] = 0.5 + ((2 * u - 1) * L.A) / (2 * a0); pm[1] = v; pm[2] = 1 },
    })
    const sm = new THREE.Mesh(geo, S ? new kit.PatinaMaterial({ relief: S }) : material)
    sm.userData.part = 'lid'; sm.name = 'slope-' + k; sm.castShadow = sm.receiveShadow = true
    g.add(sm)
  }
  // plateau: a plate in XY rotated flat (plate +y → world −z), hole cut through
  const hole = []
  for (let i = 0; i < 40; i++) {
    const th = (i / 40) * Math.PI * 2
    // kidney: a little pinched at the back (photo 15: a two-lobed opening)
    const pinch = 1 - 0.12 * Math.pow(Math.max(0, Math.sin(th)), 6)
    hole.push([HOLE.c[0] + HOLE.rx * Math.cos(th), -(HOLE.c[1] + HOLE.rz * Math.sin(th) * pinch)])
  }
  const A = a1
  const plate = kit.plate({
    outline: [[-A, -A], [A, -A], [A, A], [-A, A]],
    holes: [hole],
    // domed: the plate thickens toward the centre (symmetric, the underside is hidden in the cap), so the top swells
    thickness: (x, y) => { const u = Math.min(1, Math.abs(x) / A), v = Math.min(1, Math.abs(y) / A); return 6 + 2 * D.dome * (1 - u * u * u) * (1 - v * v * v) },
    front: top ? { relief: top, rect: { x: -A, y: -A, w: 2 * A, h: 2 * A } } : undefined,
    spacing: 10,
    reliefSpacing: q >= 1 ? 3 : 4,
    maxTriangles: Math.round(80000 * q),
    material: top ? new kit.PatinaMaterial({ relief: top }) : material,
    part: 'lid',
  })
  plate.rotation.x = -Math.PI / 2
  plate.position.y = y2 - 3
  plate.name = 'plateau'
  g.add(plate)
  // a raised rolled rim round the hole (photos 43, 44)
  const hy = plateauY(HOLE.c[0], HOLE.c[1])
  const rim = new THREE.Mesh(new THREE.TorusGeometry(20, 4.2, 12, 48), material)
  rim.rotation.x = -Math.PI / 2
  rim.scale.set((HOLE.rx + 2.5) / 20, (HOLE.rz + 2.5) / 20, 1)
  rim.position.set(HOLE.c[0], hy + 0.6, HOLE.c[1])
  rim.userData.part = 'lid'; rim.castShadow = rim.receiveShadow = true
  g.add(rim)
  // the bore under the hole: a short dark tube so the opening reads as one (the vessel is hollow)
  const bore = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 40, 32, 1, true), new kit.PatinaMaterial({ interior: 1 }))
  bore.scale.set(HOLE.rx - 0.5, 1, HOLE.rz - 0.5)
  bore.material.side = THREE.BackSide
  bore.position.set(HOLE.c[0], hy - 20, HOLE.c[1])
  bore.userData.part = 'lid'
  g.add(bore)
  const floor = new THREE.Mesh(new THREE.CircleGeometry(1, 32).rotateX(-Math.PI / 2), new kit.PatinaMaterial({ interior: 1 }))
  floor.scale.set(HOLE.rx, 1, HOLE.rz)
  floor.position.set(HOLE.c[0], hy - 40, HOLE.c[1])
  g.add(floor)
  return g
}

/** the crenellated ridge: five massive blocks along Z from the spout root, off the spine (39, 42, 43, 44) */
export function ridge(kit, { material, seed }) {
  const pts = []
  for (let z = RIDGE.z0; z <= RIDGE.z1 + 0.01; z += 3) pts.push(new THREE.Vector3(RIDGE.x, plateauY(RIDGE.x, z) - 1, z))
  return kit.flange({
    path: polyPath(pts, () => new THREE.Vector3(0, 1, 0)),
    height: RIDGE.height, thickness: RIDGE.thickness, embed: 3, taper: 2, bevel: 2.2,
    notches: { shape: 'square', pitch: 18, depth: 0.42, width: 4.4 }, waver: 0.5, seed, material, part: 'lid',
  })
}

/** the spout: a hollow tube (panel round it), its notched flange on the upper side, two side pegs */
export function spout(kit, { relief, material, q, seed }) {
  const g = new THREE.Group()
  g.userData.part = 'spout'
  const A = SPOUT.axis
  const e1 = new THREE.Vector3(1, 0, 0)
  const e2 = new THREE.Vector3().crossVectors(A, e1).normalize() // down-back (away from the cap)
  const base = new THREE.Vector3(...SPOUT.root)
  const L = SPOUT.length, r = SPOUT.r
  // u = 0 on the upper side (−e2, under the flange), +X at u 0.25, underside 0.5, −X 0.75
  const surface = (u, v, out) => {
    const ph = (u * 2 + 1.5) * Math.PI // φ: 270° at u = 0
    // a slight swell 30–60 % of the way up, as photographed
    const rr = r * (1 + 0.04 * Math.sin(Math.PI * Math.min(1, Math.max(0, (v - 0.15) / 0.7))))
    const c = Math.cos(ph), s = Math.sin(ph)
    out.nrm.set(c * e1.x + s * e2.x, c * e1.y + s * e2.y, c * e1.z + s * e2.z)
    out.pos.copy(base).addScaledVector(A, v * L).addScaledVector(out.nrm, rr)
  }
  const geo = kit.buildSurface({
    surface, segments: { density: 0.55 * Math.sqrt(q) }, relief, fade: { u0: 0, u1: 0, v0: 2, v1: 2 },
    back: { thickness: r - SPOUT.bore, rims: ['v1'] },
  })
  const tube = new THREE.Mesh(geo, relief ? new kit.PatinaMaterial({ relief }) : material)
  tube.userData.part = 'spout'
  tube.castShadow = tube.receiveShadow = true
  g.add(tube)
  // notched flange along the upper side, from just above the cap to 22 mm below the lip
  const up = e2.clone().negate()
  const from = base.clone().addScaledVector(A, 46).addScaledVector(up, r - 1)
  const to = base.clone().addScaledVector(A, L - 22).addScaledVector(up, r - 1)
  // big blocky teeth, ≈ 20 mm pitch, ≈ 9 mm deep (42, 44)
  g.add(kit.flange({ from, to, out: up, height: 14, thickness: 8, embed: 2, taper: 3, bevel: 1.6,
    notches: { shape: 'square', pitch: 20, depth: 0.62, width: 6 }, waver: 0.4, seed, material, part: 'spout' }))
  // one peg on the upper side beside the flange, a little under half-way up (photos 39, 41, 42, 44):
  // a short stem with a flat round cap, the dragon's ear/horn on vessel A (vessel B has two flat wings instead)
  {
    // a sculpted knob: a round boss on the tube, a short neck, and an angled flared cap (42, 44)
    const peg = new THREE.Group()
    const boss = new THREE.Mesh(new THREE.SphereGeometry(9.5, 20, 14), material)
    boss.position.y = 4
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(4.8, 6.5, 16, 16), material)
    stem.position.y = 16
    const capm = new THREE.Mesh(new THREE.CylinderGeometry(9.5, 5, 9, 20), material)
    capm.position.y = 27
    capm.rotation.z = 0.35
    peg.add(boss, stem, capm)
    peg.traverse((o) => { if (o.isMesh) { o.castShadow = o.receiveShadow = true; o.userData.part = 'spout' } })
    const out = up.clone().multiplyScalar(0.8).addScaledVector(e1, 0.6).normalize()
    peg.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), out)
    peg.position.copy(base).addScaledVector(A, L * 0.44).addScaledVector(out, r - 3)
    g.add(peg)
  }
  // the dragon's eye bosses on both flanks of the tube, under the peg (44)
  for (const sx of [-1, 1]) {
    const b = new THREE.Mesh(new THREE.SphereGeometry(8, 18, 12), material)
    b.scale.set(1, 1, 0.8)
    const n = e1.clone().multiplyScalar(sx * 0.85).addScaledVector(up, 0.5).normalize()
    b.position.copy(base).addScaledVector(A, L * 0.36).addScaledVector(n, r - 1)
    b.lookAt(b.position.clone().add(n))
    b.userData.part = 'spout'; b.castShadow = b.receiveShadow = true
    g.add(b)
  }
  return g
}

/** the handle sculpture: one SDF meshed with surface nets */
export function handle(kit, { material, q, horn }) {
  const g = new THREE.Group()
  g.userData.part = 'handles'
  const geo = kit.meshSDF(handleSDF(), { voxel: q >= 1 ? 1.4 : 1.9 })
  const m = new THREE.Mesh(geo, material)
  m.userData.part = 'handles'
  m.name = 'handle'
  m.castShadow = m.receiveShadow = true
  g.add(m)
  // the two horns: rounded-square plates (superellipse) with ≈ 7 deep blocky notches round the top and outer side,
  // an inner squared G-spiral in relief (hornPanel), splayed outward and leaning back (photo 45, detail-handle-head)
  const Hn = HANDLE.horns
  for (const s of [-1, 1]) {
    const plateObj = hornPlate(kit, { w: Hn.w, h: Hn.h, side: s, thickness: 2 * Hn.half, relief: horn ? (s > 0 ? horn.right : horn.left) : null, material, q })
    plateObj.position.set(s * Hn.x, Hn.y, Hn.z)
    plateObj.rotation.order = 'YXZ'
    plateObj.rotation.y = s * 0.22
    plateObj.rotation.x = -0.22
    plateObj.rotation.z = -s * 0.24
    g.add(plateObj)
  }
  return g
}

/** a notched rounded-square horn plate in its own XY frame (front +Z), the notches on the top and the side `side` */
export function hornPlate(kit, { w, h, side = 1, thickness = 7, relief = null, material, q = 1, notches = 11, depth = 0.2, slot = 0.036 }) {
  const pts = []
  const N = 260
  const ax = w / 2, ay = h / 2, e = 3.2
  // notch centres: angles from the top-inner corner over the top, round the outer side, to the lower outer corner
  const centres = []
  for (let k = 0; k < notches; k++) centres.push(Math.PI * (0.85 - (1.35 * k) / (notches - 1)))
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2
    const ca = Math.cos(a), sa = Math.sin(a)
    const r = Math.pow(Math.pow(Math.abs(ca), e) + Math.pow(Math.abs(sa), e), -1 / e)
    let px = ca * r * ax, py = sa * r * ay
    // notches as radial slots of width slot × perimeter-ish (angle), depth × min(w, h)
    for (const c of centres) {
      let da = Math.atan2(Math.sin(a - c), Math.cos(a - c))
      if (Math.abs(da) < slot * 0.5 * Math.PI) {
        const k = 1 - (depth * Math.min(w, h)) / Math.hypot(px, py)
        px *= k; py *= k
        break
      }
    }
    pts.push([side * px, py])
  }
  return kit.plate({
    outline: pts, thickness,
    front: relief ? { relief, rect: { x: -w / 2, y: -h / 2, w, h } } : undefined,
    spacing: 5, reliefSpacing: q >= 1 ? 1.8 : 2.6,
    material: relief ? new kit.PatinaMaterial({ relief }) : material, part: 'handles',
  })
}

/** small sculpted heads at the frieze centres of the right, back and left faces: a frontal toothed mask with two
 *  small notched horn plates above it, close to the wall (photos 39, 42 — the handle head in miniature) */
export function friezeHeads(kit, { material, q, seed }) {
  const out = []
  const geo = kit.meshSDF(friezeHeadSDF(), { voxel: q >= 1 ? 1.0 : 1.3 })
  for (const k of [1, 2, 3]) {
    const g = new THREE.Group()
    const m = new THREE.Mesh(geo, material)
    m.castShadow = m.receiveShadow = true
    m.userData.part = 'heads'
    g.add(m)
    for (const s of [-1, 1]) {
      const p = hornPlate(kit, { w: 30, h: 24, side: s, thickness: 5, material, q, notches: 7, depth: 0.2, slot: 0.05 })
      p.position.set(s * 16, 24, 2)
      p.rotation.y = s * 0.15
      p.rotation.x = -0.12
      p.userData.part = 'heads'
      g.add(p)
    }
    const n = SN[k]
    g.rotation.y = Math.atan2(n[0], n[2])
    g.position.set(n[0] * (D.A - 2), D.friezeTop - 8, n[2] * (D.A - 2))
    g.userData.part = 'heads'
    out.push(g)
  }
  return out
}

/** every flange: lobe corners, frieze corners, collar corners (curved, hooking past the eave), creases, collar centres */
export function flanges(kit, { material, seed }) {
  const out = []
  const corners = [[1, 1], [1, -1], [-1, -1], [-1, 1]]
  let i = 0
  const corner = (sx, sz, y0, y1, opts) => {
    const diag = new THREE.Vector3(sx, 0, sz).normalize()
    out.push(kit.flange({
      from: new THREE.Vector3(sx * D.A, y0, sz * D.A), to: new THREE.Vector3(sx * D.A, y1, sz * D.A), out: diag,
      embed: 3, taper: 3, bevel: 1.5, waver: 0.35, seed: seed + i++, material, part: 'flanges', ...opts,
    }))
  }
  for (const [sx, sz] of corners) {
    // lobe corners: deep T-notched teeth (photo 45: ≈ 13 mm pitch, 16 mm proud)
    corner(sx, sz, D.faceBottom, D.lobeTop - 1, { height: 17, thickness: 10, notches: { shape: 'T', pitch: 13.5, depth: 0.42, width: 4.6 }, ends: { start: { type: 'hook', length: 9, height: 7 } } })
    corner(sx, sz, D.lobeTop + 1, D.friezeTop - 1, { height: 15, thickness: 9, notches: { shape: 'T', pitch: 13.5, depth: 0.42, width: 4.6 } })
    // collar corner: follows the flare and runs out under the eave corner into a hook
    const pts = []
    for (let y = D.friezeTop + 1; y <= D.eave - 26; y += 2.5) { // ends in its hook under the eave corner (40, 42)
      const h = collarHalf(y)
      pts.push(new THREE.Vector3(sx * h, y, sz * h))
    }
    const diag = new THREE.Vector3(sx, 0, sz).normalize()
    out.push(kit.flange({
      path: polyPath(pts, () => diag), height: (f) => 13 + 3 * f, thickness: 10, embed: 3, taper: 3, bevel: 1.6, waver: 0.35,
      notches: { shape: 'square', pitch: 13, depth: 0.45, width: 4.4 }, ends: { end: { type: 'hook', length: 15, height: 13 } },
      seed: seed + i++, material, part: 'flanges',
    }))
  }
  // crease flanges (right, back, left faces): down the crease, frieze bottom → apex
  for (const k of [1, 2, 3]) {
    const n = new THREE.Vector3(...SN[k])
    const pts = []
    for (let y = D.apex + 4; y <= D.lobeTop - 1; y += 3) pts.push(n.clone().multiplyScalar(D.A - creaseDepth(y)).setY(y))
    out.push(kit.flange({
      path: polyPath(pts, () => n), height: (f) => 9 + 5 * f, thickness: 8, embed: 4, taper: 3, bevel: 1.3, waver: 0.3,
      notches: { shape: 'square', pitch: 12.5, depth: 0.42, width: 4 }, seed: seed + i++, material, part: 'flanges',
    }))
    // collar centre: a narrow notched flange up the middle of the collar
    const cp = []
    for (let y = D.friezeTop + 2; y <= D.eave - 6; y += 3) cp.push(n.clone().multiplyScalar(collarHalf(y)).setY(y))
    out.push(kit.flange({
      path: polyPath(cp, () => n), height: 9, thickness: 7, embed: 3, taper: 3, bevel: 1.2, waver: 0.3,
      notches: { shape: 'square', pitch: 11, depth: 0.42, width: 3.8 }, seed: seed + i++, material, part: 'flanges',
    }))
  }
  return out
}
