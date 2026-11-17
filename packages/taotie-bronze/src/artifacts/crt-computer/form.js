// crt-computer — the cast parts. Everything is kit geometry: fangBody boxes (the system unit; the monitor housing,
// built along its own axis and turned so that its "height" runs backward and its walls lean in into the tube's
// truncated pyramid), kit.plate slabs with true openings (the bezel round the screen, the drive panels, the lid, the
// keyboard wedge), straight and path flanges on every arris, stubby columnLeg feet, small revolved knobs, a swept
// tube for the cable and an animalHead biting the keyboard. Units mm, Y up, front +Z (layout.js).

import * as THREE from 'three'
import { UNIT, MON, BEZEL, SCREEN, FOOT, KEYB, KNOB_Y, KNOB_X, rrect, rrectSD, smooth } from './layout.js'

const HALF_PI = Math.PI / 2

function tag(o, part, name) {
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

/** a flange path through 3D points with outward directions (kit.flange `path`) */
export function polylinePath(pts, outs) {
  const cum = [0]
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + pts[i].distanceTo(pts[i - 1]))
  const L = cum[cum.length - 1]
  const tmp = { p: new THREE.Vector3(), n: new THREE.Vector3(), d: new THREE.Vector3(), b: new THREE.Vector3() }
  return {
    isPath: true,
    length: L,
    frame(s) {
      let i = 1
      while (i < pts.length - 1 && cum[i] < s) i++
      const f = (s - cum[i - 1]) / Math.max(1e-9, cum[i] - cum[i - 1])
      tmp.p.lerpVectors(pts[i - 1], pts[i], f)
      tmp.d.subVectors(pts[i], pts[i - 1]).normalize()
      const o = outs[i - 1].clone().lerp(outs[i], Math.max(0, Math.min(1, f)))
      tmp.n.copy(o).addScaledVector(tmp.d, -o.dot(tmp.d)).normalize()
      tmp.b.crossVectors(tmp.d, tmp.n)
      return tmp
    },
  }
}

// ------------------------------------------------------------------ system unit

export function unitLayout(kit) {
  return kit.fangLayout(unitOpts())
}

function unitOpts() {
  return { width: UNIT.w, depth: UNIT.d, height: UNIT.h, wall: UNIT.wall, cornerRadius: 0, rim: { kind: 'plain' } }
}

/**
 * panels: { front, side, back, lid, bay } ReliefMaps (side is used on both sides)
 * → { body, lid, legs[], flanges[], drives[], buttons[] }
 */
export function buildUnit(kit, panels, { q = 1, seed = 1987, plain, incise = 'auto' }) {
  const o = unitOpts()
  const cell = (relief, density) => (relief ? [[{ relief, density }]] : null)
  const body = kit.fangBody({
    ...o,
    material: plain,
    density: 0.62 * Math.sqrt(q),
    cells: { front: cell(panels.front, 0.95 * Math.sqrt(q)), right: cell(panels.side, 0.62 * Math.sqrt(q)), left: cell(panels.side, 0.62 * Math.sqrt(q)), back: cell(panels.back, 0.4 * Math.sqrt(q)) },
  })
  body.position.y = UNIT.y0
  tag(body, 'body', 'unit-body')

  // the cover: a plate lying on the wall top, overhanging a little all round
  const lidW = UNIT.w + 2 * UNIT.lidOver, lidD = UNIT.d + 2 * UNIT.lidOver
  const lid = kit.plate({
    outline: rrect([0, 0], lidW, lidD, 6),
    thickness: (x, y) => UNIT.lidT - 2 * Math.max(0, 2.2 + rrectSD(x, y, [0, 0], lidW, lidD, 6)) * 0.8,
    front: panels.lid ? { relief: panels.lid, rect: { x: -lidW / 2, y: -lidD / 2, w: lidW, h: lidD } } : null,
    spacing: 14 / Math.sqrt(q), reliefSpacing: 2.6 / Math.sqrt(q),
    refine: (x, y) => (rrectSD(x, y, [0, 0], lidW, lidD, 6) > -4 ? 3 : 99),
    material: panels.lid ? new kit.PatinaMaterial({ relief: panels.lid }) : plain,
    part: 'lid',
  })
  lid.rotation.x = -HALF_PI // plate +y → −Z (back), plate front → up
  lid.position.y = UNIT.y1 + UNIT.lidT / 2
  tag(lid, 'lid', 'unit-lid')

  // four stubby ding legs
  const legs = []
  for (const [sx, sz] of [[-1, 1], [1, 1], [1, -1], [-1, -1]]) {
    const leg = kit.columnLeg({ height: UNIT.legH, radius: 15, taper: -0.12, entasis: 0, foot: { swell: 0.18, height: 6 }, embed: 6, material: plain, density: 0.5 })
    leg.position.set(sx * (UNIT.w / 2 - 34), 0, sz * (UNIT.d / 2 - 34))
    legs.push(tag(leg, 'legs'))
  }

  // corner flanges on the four vertical arrises
  const flanges = []
  const hw = UNIT.w / 2, hd = UNIT.d / 2
  let i = 0
  for (const [sx, sz] of [[1, 1], [1, -1], [-1, -1], [-1, 1]]) {
    const f = kit.flange({
      from: new THREE.Vector3(sx * hw, UNIT.y0 + 3, sz * hd), to: new THREE.Vector3(sx * hw, UNIT.y1 - 2, sz * hd),
      out: new THREE.Vector3(sx, 0, sz).normalize(),
      height: 10, thickness: 6.5, embed: 3, taper: 4, bevel: 0.8, waver: 0.3,
      notches: { shape: 'T', pitch: 15, depth: 0.45, width: 3.2 }, seed: seed + 10 + i++, material: plain, part: 'flanges', incise,
    })
    flanges.push(tag(f, 'flanges'))
  }

  // the front's real geometry: floppy drive (a true slit + eject button), the second bay, the power button
  const zf = UNIT.zf
  const drives = []
  const floppy = kit.plate({
    outline: rrect([0, 0], 118, 28, 3), holes: [rrect([-3, 3], 96, 5, 1.6, 3)],
    thickness: 9, spacing: 4, material: plain, part: 'drives',
  })
  floppy.position.set(0, UNIT.y0 + 82, zf + 2)
  drives.push(tag(floppy, 'drives', 'floppy'))
  const eject = kit.plate({ outline: rrect([0, 0], 13, 7, 2.6, 3), thickness: 6, spacing: 3, material: plain, part: 'drives' })
  eject.position.set(41, UNIT.y0 + 82 - 7.5, zf + 6.5)
  drives.push(tag(eject, 'drives', 'eject'))
  const bay = kit.plate({
    outline: rrect([0, 0], 150, 40, 3),
    thickness: 8, spacing: 8, reliefSpacing: 1.6 / Math.sqrt(q),
    front: panels.bay ? { relief: panels.bay, rect: { x: -75, y: -20, w: 150, h: 40 } } : null,
    material: panels.bay ? new kit.PatinaMaterial({ relief: panels.bay }) : plain, part: 'drives',
  })
  bay.position.set(0, UNIT.y0 + 37, zf + 2)
  drives.push(tag(bay, 'drives', 'bay'))

  const buttons = []
  const power = revolve([[0, -3], [13.5, -3], [13.5, 3.2], [12.6, 6], [9.5, 8.4], [5, 9.4], [0, 9.7]], plain, { segments: 40 })
  power.rotation.x = HALF_PI // +Y → +Z
  power.position.set(-166, UNIT.y0 + 40, zf)
  buttons.push(tag(power, 'buttons', 'power'))

  return { body, lid, legs, flanges, drives, buttons }
}

// ------------------------------------------------------------------ monitor

/** the housing as a fang body along its own axis: width = X, depth = monitor height, height = depth backward */
export function monitorOpts() {
  const f = MON.frontFrac, e = MON.taperEnd
  const dxMax = (MON.w - MON.backW) / 2, dzMax = (MON.h - MON.backH) / 2
  return {
    width: MON.w, depth: MON.h, height: MON.L, top: { width: MON.w, depth: MON.h },
    cornerRadius: MON.r, wall: 7, rim: { kind: 'plain' },
    profile: (t) => {
      const s = t <= f ? 0 : t >= e ? 1 : (t - f) / (e - f)
      return { dx: -dxMax * s, dz: -dzMax * s }
    },
    // rows TOP → BOTTOM = back → front: tube block, pyramid, front box
    grid: { rows: [MON.L * (1 - e), MON.L * (e - f), MON.L * f] },
  }
}

export function monitorLayout(kit) {
  return kit.fangLayout(monitorOpts())
}

/**
 * panels: { top: [back, taper, front], side: [back, taper, front] (side panels drawn per side: right / left),
 *           bezel, backCap, foot }
 */
export function buildMonitor(kit, panels, { q = 1, seed = 1987, plain, incise = 'auto' }) {
  const o = monitorOpts()
  const sq = Math.sqrt(q)
  const spec = (relief, row, density) => (relief ? { relief, density: density * sq, map: row === 1 ? 'true' : 'stretch' } : null)
  const rows = (arr, d) => arr.map((r, i) => [spec(r, i, d)])
  const housing = kit.fangBody({
    ...o,
    material: plain,
    density: 0.6 * sq,
    cells: {
      front: rows(panels.top, 0.62), // the monitor's top
      right: rows(panels.right, 0.6),
      left: rows(panels.left, 0.6),
      back: null, // the monitor's underside: plain
    },
  })
  const g = new THREE.Group()
  g.name = 'monitor'
  // housing frame → world: fang +Y (up) runs backward, fang +Z (its front) becomes the monitor's top
  const frame = new THREE.Group()
  frame.rotation.x = -HALF_PI
  frame.position.set(0, MON.yc, MON.zf)
  frame.add(housing)
  tag(housing, 'body', 'monitor-housing')

  // flanges down the corner arrises: one over the front box, one over the pyramid (broken at the register border)
  const sec = kit.fangLayout(o).section
  const flanges = []
  const f0 = MON.L * MON.frontFrac, e0 = MON.L * MON.taperEnd
  let i = 0
  for (const [sx, sz] of [[1, 1], [1, -1], [-1, -1], [-1, 1]]) {
    for (const [y0, y1, h, pitch] of [[3, f0 - 3, 11, 15], [f0 + 3, e0 - 2, 11, 15]]) {
      const pts = [], outs = []
      for (let k = 0; k <= 24; k++) {
        const y = y0 + ((y1 - y0) * k) / 24
        const s = sec(y)
        const c = Math.SQRT1_2
        pts.push(new THREE.Vector3(sx * (s.a - s.r + s.r * c), y, sz * (s.b - s.r + s.r * c)))
        outs.push(new THREE.Vector3(sx, 0, sz).normalize())
      }
      const fl = kit.flange({
        path: polylinePath(pts, outs), height: h, thickness: 6.5, embed: 3, taper: 4, bevel: 0.8, waver: 0.3,
        notches: { shape: 'T', pitch, depth: 0.45, width: 3.2 }, ends: { start: 'square', end: 'square' },
        seed: seed + 30 + i++, material: plain, part: 'flanges', incise,
      })
      frame.add(tag(fl, 'flanges'))
      flanges.push(fl)
    }
  }
  g.add(frame)

  // the back cover over the open rim of the tube block
  const bw = MON.backW + 8, bh = MON.backH + 8
  const backCap = kit.plate({
    outline: rrect([0, 0], bw, bh, MON.r + 4),
    thickness: (x, y) => 10 - 2 * Math.max(0, 2.5 + rrectSD(x, y, [0, 0], bw, bh, MON.r + 4)) * 0.8,
    front: panels.backCap ? { relief: panels.backCap, rect: { x: -bw / 2, y: -bh / 2, w: bw, h: bh } } : null,
    spacing: 10, reliefSpacing: 2.4 / sq,
    material: panels.backCap ? new kit.PatinaMaterial({ relief: panels.backCap }) : plain, part: 'body',
  })
  backCap.rotation.y = Math.PI
  backCap.position.set(0, MON.yc, MON.zf - MON.L - 4)
  g.add(tag(backCap, 'body', 'monitor-back'))

  // the bezel: a deep plate with the screen opening, the taotie on its face
  const SW = BEZEL.screenW, SH = BEZEL.screenH, dy = BEZEL.screenDy
  const bezelT = (x, y) => {
    const dOut = -rrectSD(x, y, [0, 0], BEZEL.w, BEZEL.h, BEZEL.r)
    const dIn = rrectSD(x, y, [0, dy], SW, SH, BEZEL.screenR)
    let t = BEZEL.t
    t -= 2 * Math.max(0, 3.2 - dOut) * 0.85 // rounded-over outer arris
    t -= 2 * Math.max(0, 7 - dIn) * 0.55 // the mouth's lip slopes in toward the glass
    return t
  }
  const bezel = kit.plate({
    outline: rrect([0, 0], BEZEL.w, BEZEL.h, BEZEL.r, 8),
    holes: [rrect([0, dy], SW, SH, BEZEL.screenR, 8)],
    thickness: bezelT,
    front: panels.bezel ? { relief: panels.bezel, rect: { x: -BEZEL.w / 2, y: -BEZEL.h / 2, w: BEZEL.w, h: BEZEL.h } } : null,
    spacing: 9, reliefSpacing: (q >= 1 ? 1.45 : 2.1) / Math.min(1.4, sq),
    refine: (x, y) => (rrectSD(x, y, [0, 0], BEZEL.w, BEZEL.h, BEZEL.r) > -5 || rrectSD(x, y, [0, dy], SW, SH, BEZEL.screenR) < 9 ? 2.2 : 99),
    material: panels.bezel ? new kit.PatinaMaterial({ relief: panels.bezel }) : plain,
    part: 'bezel',
  })
  bezel.position.set(0, MON.yc, BEZEL.zb + BEZEL.t / 2)
  g.add(tag(bezel, 'bezel', 'bezel'))

  // the screen: a gently convex bronze mirror, plain and bright, its rim tucked behind the bezel
  const A = SW / 2 + SCREEN.over, B = SH / 2 + SCREEN.over
  const mirror = new kit.PatinaMaterial({ meshAge: 0.22, meshPolish: 0.95 })
  const screen = kit.plate({
    outline: rrect([0, 0], 2 * A, 2 * B, BEZEL.screenR + SCREEN.over, 10),
    thickness: (x, y) => 2 + 2 * SCREEN.bulge * Math.max(0, 1 - (x / A) ** 2) * Math.max(0, 1 - (y / B) ** 2),
    spacing: 6 / Math.sqrt(sq), material: mirror, part: 'screen',
  })
  screen.position.set(0, MON.yc + dy, SCREEN.rimZ - 1)
  g.add(tag(screen, 'screen', 'screen'))

  // three knobs in a row on the chin
  const knobs = []
  for (const x of KNOB_X) {
    const k = revolve([[0, -4], [9.5, -4], [9.5, 4], [9, 7.5], [7, 9.5], [3, 10.2], [0, 10.3]], plain, { segments: 36 })
    k.rotation.x = HALF_PI
    k.position.set(x, MON.yc - BEZEL.h / 2 + KNOB_Y, BEZEL.zFront - 2.5)
    g.add(tag(k, 'knobs'))
    knobs.push(k)
  }

  // swivel foot and neck, standing on the unit's cover
  const fr = FOOT.r, fh = FOOT.h, nr = FOOT.neckR, nh = FOOT.neckH
  const foot = revolve([
    [0, 0], [fr - 3, 0], [fr, 2.5], [fr - 1.5, fh - 4], [fr - 8, fh - 0.5], [fr - 16, fh], [nr + 10, fh], [nr + 3, fh + 2.5],
    [nr, fh + 6], [nr - 1, fh + nh - 3], [nr + 4, fh + nh - 1], [nr + 4, fh + nh + 6], [0, fh + nh + 6],
  ], plain, { segments: 72 })
  foot.position.set(0, UNIT.top, FOOT.z)
  g.add(tag(foot, 'foot', 'swivel-foot'))

  return { group: g, housing, bezel, screen, knobs, foot, backCap, flanges }
}

// ------------------------------------------------------------------ keyboard

export function keyboardThickness() {
  const { w, d, r, t0, t1 } = KEYB
  return (x, y) => {
    let t = t0 + ((t1 - t0) * (y + d / 2)) / d
    const dOut = -rrectSD(x, y, [0, 0], w, d, r)
    t -= 2 * Math.max(0, 3 - dOut) * 0.7
    return t
  }
}

export function buildKeyboard(kit, panel, { q = 1, plain }) {
  const { w, d, r, t0, t1 } = KEYB
  const plateMesh = kit.plate({
    outline: rrect([0, 0], w, d, r, 6),
    thickness: keyboardThickness(),
    front: panel ? { relief: panel, rect: { x: -w / 2, y: -d / 2, w, h: d } } : null,
    spacing: 10, reliefSpacing: (q >= 1 ? 1.25 : 1.9) / Math.min(1.4, Math.sqrt(q)),
    refine: (x, y) => (rrectSD(x, y, [0, 0], w, d, r) > -4 ? 2.2 : 99),
    material: panel ? new kit.PatinaMaterial({ relief: panel }) : plain,
    part: 'keyboard',
  })
  plateMesh.rotation.x = -HALF_PI
  // tilt so the underside lies flat: the plate is symmetric about its mid plane, so the top rises at twice that slope
  const tilt = new THREE.Group()
  tilt.rotation.x = Math.atan((t1 - t0) / 2 / d)
  tilt.add(plateMesh)
  const g = new THREE.Group()
  g.add(tilt)
  g.position.z = KEYB.z
  g.updateMatrixWorld(true)
  const box = new THREE.Box3().setFromObject(plateMesh)
  g.position.y = -box.min.y
  g.updateMatrixWorld(true)
  tag(g, 'keyboard', 'keyboard')
  return { group: g, plate: plateMesh }
}

/** a point on the keyboard's top face (plate x, y → world), for the cable's head */
export function keyboardTop(group, plateMesh, x, y) {
  const t = keyboardThickness()(x, y)
  group.updateMatrixWorld(true)
  return new THREE.Vector3(x, y, t / 2).applyMatrix4(plateMesh.matrixWorld)
}

// ------------------------------------------------------------------ the cable: a scaled snake biting the keyboard

export const CABLE_R = 6.2

/** the cable centre line (world): from the head at the keyboard's back edge, down to the plinth, along the unit's left side */
export function cablePath(head) {
  const zb = KEYB.z - KEYB.d / 2 // keyboard back edge
  const ctrl = [
    [head.x, head.y, head.z],
    [head.x - 6, 12, zb - 15],
    [head.x - 40, CABLE_R, zb - 22],
    [-200, CABLE_R, zb - 20],
    [-238, CABLE_R, zb - 30],
    [-252, CABLE_R, 150],
    [-236, CABLE_R, 92],
    [-246, CABLE_R, 20],
    [-236, CABLE_R, -50],
    [-246, CABLE_R, -118],
    [-232, CABLE_R, -168],
    [-214, CABLE_R, -196],
  ].map((p) => new THREE.Vector3(...p))
  return new THREE.CatmullRomCurve3(ctrl, false, 'centripetal')
}

export function cableLength(curve) {
  return curve.getLength()
}

/** the swept tube with its scale panel; relief panel x = round the tube (circumference), y = along it from the head */
export function buildCable(kit, curve, relief, { q = 1, plain }) {
  const L = curve.getLength()
  const N = 400
  const frames = curve.computeFrenetFrames(N, false)
  // parallel-transport frames, with the first normal pointing up so the scale seam runs along the underside
  const T = frames.tangents
  const nrm = [], bin = []
  let n = new THREE.Vector3(0, 1, 0)
  n.addScaledVector(T[0], -n.dot(T[0])).normalize()
  for (let i = 0; i <= N; i++) {
    if (i > 0) {
      const axis = new THREE.Vector3().crossVectors(T[i - 1], T[i])
      const s = axis.length()
      if (s > 1e-6) n.applyAxisAngle(axis.normalize(), Math.asin(Math.min(1, s)))
      n.addScaledVector(T[i], -n.dot(T[i])).normalize()
    }
    nrm.push(n.clone())
    bin.push(new THREE.Vector3().crossVectors(T[i], n))
  }
  const radius = (v) => CABLE_R * (v < 0.82 ? 1 : 1 - 0.85 * smooth((v - 0.82) / 0.18)) // the tail tapers
  const surface = (u, v, out) => {
    const f = v * N
    const i = Math.min(N - 1, Math.floor(f))
    const t = f - i
    const p = curve.getPointAt(Math.min(1, v))
    const nn = nrm[i].clone().lerp(nrm[i + 1], t)
    const bb = bin[i].clone().lerp(bin[i + 1], t)
    // u runs round so that dP/du × dP/dv points outward
    const a = -u * Math.PI * 2 + Math.PI
    const dir = nn.multiplyScalar(Math.cos(a)).addScaledVector(bb, Math.sin(a)).normalize()
    out.pos.copy(p).addScaledVector(dir, radius(v))
    out.nrm.copy(dir)
  }
  const geo = kit.buildSurface({
    surface,
    segments: [Math.round(28 * Math.min(1.2, Math.sqrt(q))), Math.round((L / 2.2) * Math.sqrt(q))],
    relief,
    fade: { u0: 0, u1: 0, v0: 2, v1: 2 },
  })
  const mesh = new THREE.Mesh(geo, relief ? new kit.PatinaMaterial({ relief }) : plain)
  return tag(mesh, 'cable', 'cable')
}
