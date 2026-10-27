// bushtail-kit.js — the Bushtail Clans' six figures with splat fur: each squirrel's fur as splats
// (bushtail.js, drawn by splat-three.js), everything it wears or carries as meshes from the game's own
// kit (view/models/kit.js), with the colours and the gear of the game's mesh figures
// (view/models/squirrel.js), fitted to the splat body: straps and armour follow its surface, held
// things sit in its posed paws.
//   buildFigure(key, { density, n, splatScale, seed })   → { group, splats, count }
//     group    the figure, its feet at y 0 (on the base's top), facing +Z; no base (the caller adds one)
//     splats   its SplatMeshes: call each one's sort(camera) before rendering
//     count    the splats it draws
//   UNITS[key].base   the base's radius (data/races/squirrel.js)
import * as THREE from 'three'
import { buildFur, furPose, progressive, lodSlice, ANCHOR, BONES, cloakLeaves, castToBody } from './bushtail.js'
import { bakeSplats, SplatMesh } from './splat-three.js'
import { M, G, part, rod, metal, glowMat, shade, roundShield } from '../../view/models/kit.js'
import { BUILDERS } from '../../view/models/squirrel.js'

const V = (a) => new THREE.Vector3(...a)
const UP = new THREE.Vector3(0, 1, 0)

// ── the fur's colours from a unit's coat (and belly): the generator's own palette moved to the coat's
// hue, saturation and lightness, each colour keeping its offset from the coat
const DEF = { main: '#C8682A', dark: '#9A4A1E', paw: '#D88A50', tail0: '#B85E26', tail1: '#E2A060', tuftBase: '#6A2C10', tuftTip: '#B65A26' }
const hsl = (hex) => new THREE.Color(hex).getHSL({}, THREE.SRGBColorSpace)
const clamp01 = (v) => Math.max(0, Math.min(1, v))
export function furPalette(fur, belly) {
  const f = hsl(fur), m = hsl(DEF.main), out = {}
  for (const [k, v] of Object.entries(DEF)) {
    const d = hsl(v)
    out[k] = '#' + new THREE.Color().setHSL(f.h + d.h - m.h, clamp01(d.s * f.s / m.s), clamp01(f.l + d.l - m.l), THREE.SRGBColorSpace).getHexString()
  }
  if (belly) out.cream = belly
  return out
}

// ── one squirrel: its fur posed and baked, in a group in the fur's rest frame (+Y up, facing +Z, feet
// at y 0), with what its kit is placed by: the pose's bone matrices, a rest point on a bone where the
// pose puts it, and a group riding a bone
function squirrel({ fur, belly, beard = false, membrane = null, pose = {}, density = 0.1, n = 0, splatScale = 1.5, seed = 1 }) {
  const bones = furPose(pose)
  const boneMat = (b) => new THREE.Matrix4().fromArray(bones, 16 * b)
  const posed = (b, p) => V(p).applyMatrix4(boneMat(b))
  const full = progressive(buildFur({ density, seed, palette: furPalette(fur, belly), beard, membrane: membrane ? membrane(posed) : null }), seed)
  const model = n > 0 ? lodSlice(full, n) : full
  const splats = new SplatMesh(bakeSplats(model, bones), { splatScale })
  const g = new THREE.Group()
  g.add(splats)
  const onBone = (b) => {
    const o = new THREE.Group()
    o.matrixAutoUpdate = false
    o.matrix.copy(boneMat(b))
    g.add(o)
    return o
  }
  return { g, splats: [splats], count: model.count, posed, onBone }
}

// ── kit fitted to the body
// The loop where the plane through c spanned by e1 and e2 leaves the body (the arms aside), `off` out
// from the surface (over the fur): [{ t, p, n }] around it.
function bodyLoop(c, e1, e2, { off = 0.026, N = 40, from = 0, to = Math.PI * 2 } = {}) {
  const pts = []
  for (let i = 0; i < N; i++) {
    const t = from + (to - from) * (i / N)
    const q = castToBody(c, [0, 1, 2].map((k) => Math.cos(t) * e1[k] + Math.sin(t) * e2[k]))
    if (q) pts.push({ t, p: V(q.p).addScaledVector(V(q.n), off), n: V(q.n) })
  }
  return pts
}
// A flat band along a loop's points ({ p, n }), lying on the surface: `w` wide, `th` thick.
function ribbon(loop, w, th, mat) {
  const n = loop.length, pos = [], idx = []
  for (let i = 0; i < n; i++) {
    const { p, n: nn } = loop[i], t = loop[(i + 1) % n].p.clone().sub(loop[(i + n - 1) % n].p).normalize()
    const a = new THREE.Vector3().crossVectors(nn, t).normalize().multiplyScalar(w / 2), o = nn.clone().multiplyScalar(th / 2)
    for (const [sa, so] of [[-1, 1], [1, 1], [1, -1], [-1, -1]]) {
      const q = p.clone().addScaledVector(a, sa).addScaledVector(o, so)
      pos.push(q.x, q.y, q.z)
    }
  }
  for (let i = 0; i < n; i++) {
    const a = i * 4, b = ((i + 1) % n) * 4
    for (let k = 0; k < 4; k++) {
      const k1 = (k + 1) % 4
      idx.push(a + k, b + k, a + k1, a + k1, b + k, b + k1)
    }
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geo.setIndex(idx)
  geo.computeVertexNormals()
  const m = new THREE.Mesh(geo, mat)
  m.castShadow = true
  return m
}
function tube(points, r, mat, closed = true) {
  const curve = new THREE.CatmullRomCurve3(points, closed, 'centripetal')
  const m = new THREE.Mesh(new THREE.TubeGeometry(curve, points.length * 3, r, 6, closed), mat)
  m.castShadow = true
  return m
}
// A sheet over the body: the rays from c over azimuth [a0, a1] (from +Z, toward +X) and elevation
// [e0, e1] (rad), `off` out from where they leave the body; a grid of nu × nv quads.
function bodyPatch(c, [a0, a1], [e0, e1], { off = 0.03, nu = 10, nv = 8 } = {}) {
  const grid = []
  for (let j = 0; j <= nv; j++) {
    const row = []
    for (let i = 0; i <= nu; i++) {
      const a = a0 + (a1 - a0) * (i / nu), e = e0 + (e1 - e0) * (j / nv)
      const q = castToBody(c, [Math.sin(a) * Math.cos(e), Math.sin(e), Math.cos(a) * Math.cos(e)])
      row.push(V(q.p).addScaledVector(V(q.n), off))
    }
    grid.push(row)
  }
  return grid
}
function gridMesh(grid, mat) {
  const nv = grid.length - 1, nu = grid[0].length - 1, pos = [], idx = []
  for (const row of grid) for (const p of row) pos.push(p.x, p.y, p.z)
  for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
    const a = j * (nu + 1) + i, b = a + 1, c = a + nu + 1, d = c + 1
    idx.push(a, b, c, c, b, d)
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geo.setIndex(idx)
  geo.computeVertexNormals()
  const m = new THREE.Mesh(geo, mat)
  m.castShadow = true
  return m
}

// An acorn cap on the head: a cupped dome tilted back on it, its rim, its stem.
function acornCap(S, color, { scale = 1 } = {}) {
  const h = ANCHOR.hat, cap = new THREE.Group()
  cap.position.set(...h.c)
  cap.rotation.x = -h.back
  S.onBone(BONES.head).add(cap)
  const r = h.r * scale, hh = h.h * scale * 1.15
  cap.add(part(G.cap, M(color), 0, 0, 0, r, hh, r))
  cap.add(part(G.brim, M(color), 0, 0, 0, r, 1, r))
  cap.add(part(new THREE.TorusGeometry(1, 0.11, 6, 18).rotateX(Math.PI / 2), M(shade(color, -0.08)), 0, 0.004, 0, r * 0.98, r * 0.98, r * 0.98))
  cap.add(part(G.cyl, M(shade(color, -0.15)), 0, hh + 0.02, -0.004, 0.014, 0.05, 0.014))
  return { cap, top: hh }
}

// Brass goggles pushed up on the forehead, on a strap round the head.
function goggles(S, { brass = '#c9a24a', glass = '#a9dbe6', strap = '#3a281c', lift = 0.1 } = {}) {
  const head = S.onBone(BONES.head), c = ANCHOR.head.c
  for (const s of [-1, 1]) {
    const q = castToBody(c, [s * 0.075, lift, 0.12])
    const n = V(q.n), at = V(q.p).addScaledVector(n, 0.024)
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.034, 0.011, 6, 14), metal(brass))
    ring.position.copy(at)
    ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), n)
    const lens = part(G.sph, M(glass, { metalness: 0.3, roughness: 0.15 }), 0, 0, 0, 0.027, 0.027, 0.01)
    ring.add(lens)
    head.add(ring)
  }
  const c2 = [c[0], c[1] + 0.055, c[2] - 0.01]
  const front = castToBody(c, [0, lift, 0.12]).p
  const e2 = new THREE.Vector3(front[0] - c2[0], front[1] - c2[1], front[2] - c2[2]).normalize()
  const loop = bodyLoop(c2, [1, 0, 0], e2.toArray(), { off: 0.02, N: 36 })
  head.add(tube(loop.map((x) => x.p), 0.009, M(strap)))
}

// An acorn (a bomb, or ammunition): its nut, its cap and stem; s scales it.
function acorn(s = 1, nut = '#8a5a2a', capColor = '#4f3a22') {
  const a = new THREE.Group()
  a.add(part(G.sph, M(nut), 0, -0.012 * s, 0, 0.042 * s, 0.054 * s, 0.042 * s))
  a.add(part(G.cap, M(capColor), 0, 0.016 * s, 0, 0.047 * s, 0.032 * s, 0.047 * s))
  a.add(part(G.brim, M(capColor), 0, 0.016 * s, 0, 0.047 * s, 1, 0.047 * s))
  a.add(part(G.cyl, M(shade(capColor, -0.1)), 0, 0.056 * s, 0, 0.007 * s, 0.022 * s, 0.007 * s))
  return a
}
// A pinecone: stacked rings of scales round a core, its point down.
function pinecone(s = 1, color = '#6b4a26') {
  const g = new THREE.Group()
  g.add(part(G.ico, M(shade(color, -0.08)), 0, 0, 0, 0.05 * s, 0.085 * s, 0.05 * s))
  for (let r = 0; r < 5; r++) {
    const y = (-0.07 + r * 0.035) * s, rad = (0.03 + Math.sin(((r + 0.6) / 5.6) * Math.PI) * 0.035) * s
    for (let i = 0; i < 7; i++) {
      const a = ((i + (r % 2) * 0.5) / 7) * Math.PI * 2
      const b = part(G.ico0, M(r % 2 ? color : shade(color, 0.05)), Math.sin(a) * rad, y, Math.cos(a) * rad, 0.022 * s, 0.01 * s, 0.018 * s)
      b.lookAt(Math.sin(a) * rad * 3, y - 0.04 * s, Math.cos(a) * rad * 3)
      g.add(b)
    }
  }
  return g
}

// Leaves (a cloak's, a crown's): each a flattened faceted leaf, its stem at p, lying along u, across v.
function leaf({ p, n, u, v, L, W, color }) {
  const m = new THREE.Mesh(G.ico, M(color))
  m.castShadow = true
  m.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(V(v), V(n), V(u)))
  m.position.copy(V(p).addScaledVector(V(u), L * 0.42))
  m.scale.set(W / 2, 0.009, L / 2)
  return m
}

// ── the six units: each its coat, pose and kit (the game's designs, view/models/squirrel.js)
export const UNITS = {
  nutkin: { base: 0.3 },
  grenadier: { base: 0.3 },
  oakguard: { base: 0.34 },
  glider: { base: 0.32 },
  trebuchet: { base: 1.05 },
  elder: { base: 0.42 },
}

const BUILD = {
  // a leaf cloak, an acorn cap, a slingshot held up in the right paw
  nutkin(o) {
    const S = squirrel({ ...o, fur: '#cf6d2a', pose: { armR: { raise: 1.1, swing: 0.9 } } })
    acornCap(S, '#6a4a26')
    for (const l of cloakLeaves({ seed: o.seed })) S.onBone(l.bone).add(leaf(l))
    // the slingshot: upright beside the head, leaning a little forward, its fork across X
    const grip = S.posed(BONES.armR, ANCHOR.gripR), up = new THREE.Vector3(0, Math.cos(0.25), Math.sin(0.25)), across = new THREE.Vector3(1, 0, 0)
    const back = new THREE.Vector3().crossVectors(across, up)
    const at = (y, x = 0, z = 0) => grip.clone().addScaledVector(up, y).addScaledVector(across, x).addScaledVector(back, z).toArray()
    const wood = M('#8a5a2e'), woodD = M('#5e3c1e'), band = M('#4a2e22')
    S.g.add(rod(at(-0.07), at(0.07), 0.016, woodD), rod(at(0.07), at(0.2, 0.08), 0.013, wood), rod(at(0.07), at(0.2, -0.08), 0.013, wood))
    S.g.add(rod(at(0.2, 0.08), at(0.16, 0, -0.05), 0.005, band), rod(at(0.16, 0, -0.05), at(0.2, -0.08), 0.005, band))
    S.g.add(part(G.sph, M('#3e261a'), ...at(0.16, 0, -0.05), 0.02, 0.016, 0.014))
    return S
  },
  // a bandolier of acorn bombs across the chest, goggles, an acorn cap, a lit bomb cocked back to throw
  grenadier(o) {
    const S = squirrel({ ...o, fur: '#a9552a', pose: { armR: { raise: 2.4, roll: 1.3, swing: -0.4, reach: 1.4 }, armL: { raise: 0.5, swing: 0.3 } } })
    acornCap(S, '#4f3a22')
    goggles(S)
    // the bandolier: from the left shoulder across the chest to the right hip, and round the back
    const u = new THREE.Vector3(0.55, 0.85, 0).normalize().toArray()
    const loop = bodyLoop([0, 0.38, -0.01], u, [0, 0, 1], { off: 0.036, N: 56 })
    S.g.add(ribbon(loop, 0.06, 0.014, M('#4a3020')))
    const bk = loop.reduce((b, y) => (Math.abs(y.t - Math.PI * 0.32) < Math.abs(b.t - Math.PI * 0.32) ? y : b))
    const buckle = new THREE.Mesh(new THREE.TorusGeometry(0.028, 0.007, 4, 4), metal('#c9a24a'))
    buckle.position.copy(bk.p).addScaledVector(bk.n, 0.01)
    buckle.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), bk.n)
    buckle.rotateZ(Math.PI / 4)
    S.g.add(buckle)
    for (const t of [-0.5, -0.17, 0.17, 0.5]) {
      const want = Math.PI / 2 + t
      const x = loop.reduce((b, y) => (Math.abs(y.t - want) < Math.abs(b.t - want) ? y : b))
      const a = acorn(0.95, '#a8703a')
      a.position.copy(x.p).addScaledVector(x.n, 0.03)
      a.quaternion.setFromUnitVectors(UP, new THREE.Vector3(0, 1, 0).addScaledVector(x.n, 0.4).normalize())
      S.g.add(a)
    }
    // the lit bomb, held up and back
    const bomb = acorn(1.35)
    bomb.add(part(G.sph, glowMat('#ffb030'), 0, 0.1, 0, 0.022))
    for (let i = 0; i < 4; i++) bomb.add(part(G.oct, glowMat('#ffd060'), Math.cos(i * 1.7) * 0.03, 0.12 + (i % 2) * 0.02, Math.sin(i * 1.7) * 0.03, 0.008))
    bomb.position.copy(S.posed(BONES.armR, ANCHOR.gripR)).add(new THREE.Vector3(-0.035, 0.05, -0.015))
    S.g.add(bomb)
    return S
  },
  // bark armour on the chest, an acorn cap with a red plume, a round shield on the left arm, a halberd
  oakguard(o) {
    const S = squirrel({ ...o, fur: '#8a5a35', pose: { armL: { raise: 0.75, swing: 0.25 }, armR: { raise: 0.45, swing: 0.55 } } })
    const { cap, top } = acornCap(S, '#5a3c22')
    for (let i = 0; i < 7; i++) {
      const a = -1.0 + i * 0.3, hr = ANCHOR.hat.r
      const nrm = new THREE.Vector3(0, Math.cos(a) / top, Math.sin(a) / hr).normalize(), L = 0.17 - Math.abs(a + 0.1) * 0.06
      const f = part(G.cone, M(i % 2 ? '#c0302a' : '#d8423a'), 0, 0, 0, 0.028, L, 0.05)
      f.position.set(0, top * Math.cos(a), hr * Math.sin(a)).addScaledVector(nrm, L * 0.42)
      f.quaternion.setFromUnitVectors(UP, nrm.add(new THREE.Vector3(0, 0, -0.4)).normalize())
      cap.add(f)
    }
    // the breastplate: a sheet of bark over the chest and belly, ridged, rimmed
    const grid = bodyPatch([0, 0.4, -0.02], [-0.95, 0.95], [-0.4, 0.75], { off: 0.034, nu: 12, nv: 9 })
    S.g.add(gridMesh(grid, M('#5b4330', { side: THREE.DoubleSide })))
    const ridge = M('#463220')
    for (const i of [1, 3, 5, 6, 7, 9, 11]) S.g.add(tube(grid.map((row) => row[i].clone().multiplyScalar(1)), 0.007, ridge, false))
    const rim = [...grid[0], ...grid.map((r) => r[r.length - 1]).slice(1), ...[...grid[grid.length - 1]].reverse().slice(1), ...grid.map((r) => r[0]).reverse().slice(1, -1)]
    S.g.add(tube(rim, 0.011, M('#3c2a1a')))
    // the shield, on the raised left forearm, facing forward and a little out
    const sh = roundShield(0.18, M('#8a6038'), M('#3e7a2a'))
    sh.add(part(new THREE.TorusGeometry(0.18, 0.014, 5, 24), metal('#8f969c'), 0, 0, 0.02))
    sh.position.copy(S.posed(BONES.armL, ANCHOR.gripL)).add(new THREE.Vector3(0.1, -0.03, -0.01))
    sh.rotation.y = 1.0
    S.g.add(sh)
    // the halberd, upright in the right paw: its pole, an axe blade out to the side, a spike behind, a pinecone tip
    const g = S.posed(BONES.armR, ANCHOR.gripR)
    const hal = new THREE.Group()
    hal.position.copy(g)
    hal.rotation.x = 0.08
    hal.add(part(G.cyl, M('#7a5232'), 0, 0.2, 0, 0.02, 1.15, 0.02))
    hal.add(part(G.box, metal('#a8b0b8'), -0.075, 0.62, 0, 0.12, 0.17, 0.016))
    const spike = part(G.cone, metal('#a8b0b8'), 0.05, 0.64, 0, 0.018, 0.08, 0.012)
    spike.rotation.z = -Math.PI / 2
    hal.add(spike)
    const tip = pinecone(0.9)
    tip.position.y = 0.84
    tip.rotation.x = Math.PI
    hal.add(tip)
    S.g.add(hal)
    return S
  },
  // gliding on a flight stand: arms flung wide, the furred membrane stretched from wrist to ankle,
  // a leather flying cap and goggles, the tail streaming behind
  glider(o) {
    const arm = { raise: 0.3, roll: 1.0, swing: 1.25, reach: 2.4 }
    const S = squirrel({
      ...o, fur: '#9a8a78', belly: '#efe5d5',
      pose: { headPitch: 0.85, armR: arm, armL: arm, legs: { pitch: 1.2, splay: 0.9, reach: 1.6 }, tailPitch: -2.2 },
      membrane: (posed) => ({
        up: [0, 0.2, -1],
        sides: [1, -1].map((s) => {
          const shoulder = s > 0 ? ANCHOR.pivArmL : ANCHOR.pivArmR
          const wrist = posed(s > 0 ? BONES.armL : BONES.armR, s > 0 ? ANCHOR.gripL : ANCHOR.gripR)
          // the wrist's spur carries the membrane's leading corner a little past the paw
          const tip = wrist.clone().add(wrist.clone().sub(V(shoulder)).multiplyScalar(0.3))
          return {
            top: castToBody([0, 0.47, -0.02], [s, 0.1, -0.1]).p,
            wrist: tip.toArray(),
            ankle: posed(s > 0 ? BONES.footL : BONES.footR, s > 0 ? ANCHOR.ankleL : ANCHOR.ankleR).toArray(),
            hip: castToBody([0, 0.2, -0.03], [s, 0, -0.15]).p,
          }
        }),
      }),
    })
    // the flying cap, snug over the crown, and goggles below its brim
    const h = ANCHOR.hat, cap = new THREE.Group()
    cap.position.set(h.c[0], h.c[1] - 0.025, h.c[2])
    cap.rotation.x = -h.back * 0.6
    S.onBone(BONES.head).add(cap)
    cap.add(part(G.cap, M('#6b4a2e'), 0, 0, 0, 0.178, 0.105, 0.178), part(G.brim, M('#6b4a2e'), 0, 0, 0, 0.178, 1, 0.178))
    cap.add(part(new THREE.TorusGeometry(1, 0.08, 5, 18).rotateX(Math.PI / 2), M('#5a3c22'), 0, 0.004, 0, 0.176, 0.176, 0.176))
    goggles(S, { lift: 0.085 })
    // in flight: pitched belly-down about the belly, on a clear stand
    const fly = new THREE.Group()
    const belly = new THREE.Vector3(0, 0.3, 0)
    fly.position.set(0, 0.45 + belly.y, 0)
    fly.rotation.x = 0.85
    S.g.position.copy(belly).negate()
    fly.add(S.g)
    const out = new THREE.Group()
    out.add(fly)
    const stand = part(G.cyl, M('#cfe8ff', { transparent: true, opacity: 0.35, depthWrite: false }), 0, (0.45 + belly.y) / 2, 0, 0.022, 0.45 + belly.y, 0.022)
    out.add(stand)
    return { ...S, g: out }
  },
  // the game's trebuchet (view/models/squirrel.js), crewed by two splat squirrels: a loader holding a
  // pinecone, a gunner calling the shot
  trebuchet(o) {
    const machine = BUILDERS.trebuchet()
    const crew = []
    machine.traverse((x) => x.userData.anim?.kind === 'squirrel' && crew.push(x))
    const out = { g: machine, splats: [], count: 0 }
    crew.forEach((m, i) => {
      const parent = m.parent
      parent.remove(m)
      const loader = i === 0
      const S = squirrel({ ...o, seed: (o.seed ?? 1) + i + 1, fur: '#c96a2d', pose: loader ? {} : { armR: { raise: 2.3, swing: 0.3 } } })
      acornCap(S, '#6e4a2a')
      if (loader) {
        const pc = pinecone(1.15)
        pc.position.set(0, 0.45, 0.25)
        pc.rotation.x = Math.PI * 0.85
        S.g.add(pc)
      }
      S.g.position.copy(m.position)
      S.g.rotation.copy(m.rotation)
      S.g.scale.copy(m.scale)
      parent.add(S.g)
      out.splats.push(...S.splats)
      out.count += S.count
    })
    return out
  },
  // a mossy robe open down the front, a white beard, a wreath of oak and autumn leaves, a staff with a
  // glowing gem in the left paw; larger than the rest (a hero)
  elder(o) {
    const S = squirrel({ ...o, fur: '#a9a197', belly: '#d9d3c9', beard: true, pose: { armL: { raise: 0.45, swing: 0.75 }, armR: { raise: 0.35, swing: 0.1 } } })
    // the robe: round the body's widest outline (its back and sides), in folds, flaring to the hem
    const ys = [], rs = []
    for (let y = 0.6; y >= 0.015; y -= 0.035) {
      let r = 0
      for (let a = 0.9; a <= Math.PI * 2 - 0.9; a += 0.2) {
        const q = castToBody([0, y, -0.01], [Math.sin(a), 0, Math.cos(a)])
        if (q) r = Math.max(r, Math.hypot(q.p[0], q.p[2] + 0.01))
      }
      ys.push(y)
      rs.push(r + 0.03)
    }
    for (let i = 1; i < rs.length; i++) rs[i] = Math.max(rs[i], rs[i - 1] + 0.003)
    const prof = ys.map((y, i) => [rs[i] + Math.max(0, 0.3 - y) * 0.22, y]).reverse()
    prof.push([0.13, 0.63])
    const open = 0.95, segs = 36, pos = [], idx = []
    const at = (r, y, a) => {
      const fold = 1 + 0.06 * Math.sin(a * 11) * Math.max(0, 0.55 - y) / 0.55
      return [Math.sin(a) * r * fold, y, Math.cos(a) * r * fold - 0.01]
    }
    for (const [r, y] of prof) for (let i = 0; i <= segs; i++) pos.push(...at(r, y, open + (Math.PI * 2 - 2 * open) * (i / segs)))
    for (let j = 0; j < prof.length - 1; j++) for (let i = 0; i < segs; i++) {
      const a = j * (segs + 1) + i, b = a + segs + 1
      idx.push(a, b, a + 1, a + 1, b, b + 1)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    geo.setIndex(idx)
    geo.computeVertexNormals()
    const robe = new THREE.Mesh(geo, M('#5a6b34', { side: THREE.DoubleSide }))
    robe.castShadow = true
    S.g.add(robe)
    // its trim down both front edges and round the hem, and a collar
    const trim = M('#d08a2c')
    for (const a of [open, Math.PI * 2 - open]) S.g.add(tube(prof.map(([r, y]) => new THREE.Vector3(...at(r, y, a))), 0.013, trim, false))
    S.g.add(tube(Array.from({ length: segs + 1 }, (_, i) => new THREE.Vector3(...at(prof[0][0], prof[0][1], open + (Math.PI * 2 - 2 * open) * (i / segs)))), 0.013, trim, false))
    S.g.add(part(new THREE.TorusGeometry(0.135, 0.03, 6, 20).rotateX(Math.PI / 2), M('#4a5a2a'), 0, 0.615, -0.01))
    // the wreath: leaves round the brow, each lying along it and tipped up
    const head = S.onBone(BONES.head), c = ANCHOR.head.c
    for (let i = 0; i < 14; i++) {
      const az = (i / 14) * Math.PI * 2
      const q = castToBody(c, [Math.sin(az), 0.5, Math.cos(az)])
      const n = V(q.n), u = new THREE.Vector3(Math.cos(az), 0, -Math.sin(az)).addScaledVector(UP, 0.5)
      u.addScaledVector(n, -u.dot(n)).normalize()
      const v = new THREE.Vector3().crossVectors(n, u).normalize()
      head.add(leaf({ p: V(q.p).addScaledVector(n, 0.024).toArray(), n: n.toArray(), u: u.toArray(), v: v.toArray(), L: 0.12, W: 0.065, color: i % 2 ? '#d08a2c' : '#6aa646' }))
    }
    // the staff, upright in the left paw, out to the side: its gem held in three prongs
    const g = S.posed(BONES.armL, ANCHOR.gripL)
    const staff = new THREE.Group()
    staff.position.copy(g).add(new THREE.Vector3(0.05, 0, 0))
    staff.rotation.z = -0.1
    const W = M('#5a3d24')
    staff.add(part(G.cyl, W, 0, 0.18, 0, 0.022, 1.0, 0.022))
    staff.add(part(G.oct, glowMat('#7dff8a'), 0, 0.79, 0, 0.065, 0.1, 0.065))
    for (let i = 0; i < 3; i++) {
      const t = (i / 3) * Math.PI * 2
      staff.add(rod([0, 0.65, 0], [Math.cos(t) * 0.07, 0.83, Math.sin(t) * 0.07], 0.011, W))
    }
    S.g.add(staff)
    const out = new THREE.Group()
    out.add(S.g)
    S.g.scale.setScalar(1.28)
    return { ...S, g: out }
  },
}

export function buildFigure(key, o = {}) {
  const S = BUILD[key](o)
  return { group: S.g, splats: S.splats, count: S.count }
}
