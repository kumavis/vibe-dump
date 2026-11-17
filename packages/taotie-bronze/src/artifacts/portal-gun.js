// A portal gun — a hand-held instrument that throws a ring-shaped doorway — cast as a late-Shang ritual bronze: a
// design-system example for the Taotie Kit, not a museum object. An ORIGINAL design from the idea alone (no existing
// prop: reference/portal-gun/SOURCES.md). Size chosen: 378 mm from the cap ring to the emitter's lip. Units mm, Y up,
// front +Z, the muzzle toward +X, so the front view is the full side profile.
//
// form:   portal-gun/form.js  — stations, the emitter's profile (outer flare, rolled lip, stepped inner funnel, throat
//         dome), the barrel, the body's superellipse loft, the cell, the grip line, the stand
// décor:  portal-gun/decor.js — one panel per mould face; the composition is written at its top
// parts:  portal-gun/parts.js — the core eyes and their turquoise lenses, the grip creature, the dial, fins, flanges,
//         the cell's fittings, the cable, the stand (base, posts, two confronted beasts)

import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { AXIS, bellPatches, revolveX, polarMap, BARREL, bodyHalf, bodyPanelMap, CELL, cellProfile, SOCKET } from './portal-gun/form.js'
import * as D from './portal-gun/decor.js'
import * as P from './portal-gun/parts.js'

const SEED = 2207

export default {
  id: 'portal-gun',
  group: 'examples',
  order: 94,
  title: 'Portal Gun',
  titleZh: '门枪',
  type: 'hand-held portal emitter (an original design), its mouth a gu’s trumpet, its grip a guang’s handle beast',
  date: 'some future / cast c. 1200 BC in spirit',
  period: 'Science fiction — dressed as late Shang, Anyang style',
  collection: 'A portal gun of no particular story: an original device drawn from the idea alone, after no existing prop',
  dimensions: { l: 401, h: 247, w: 145, chosen: true, note: 'the device 378 mm from the power cell’s cap to the emitter’s lip (401 with the ring handle), the emitter 140 mm across, on its stand 247 mm high — size chosen, not measured' },
  blurb:
    'A hand-held device that throws a ring-shaped doorway: a flaring emitter whose throat steps down in concentric rings, a power core in the body, cooling fins on the barrel, a plug-in power cell with a cable to the grip. ' +
    'Cast with the Taotie Kit, the emitter is the trumpet mouth of a gu with rising cicada blades outside and bowstring rings round a fire whorl inside; each flank is half a taotie in fat ridge work whose eye is the core — a turquoise lens behind a bronze pupil bar — and the grip is the tiger of a guang handle biting the body, its tongue the trigger and its tail the guard. ' +
    'Its size (378 mm long) is chosen; no such bronze was ever cast.',
  defaultPatina: 'portal-gun',
  views: {
    'three-quarter': { azimuth: 46, elevation: 16, fov: 24, fit: 0.66, target: [6, 128, 0] },
    front: { azimuth: 0, elevation: 3, fov: 24, fit: 0.66, target: [2, 122, 0] },
    back: { azimuth: 180, elevation: 6, fov: 24, fit: 0.66, target: [2, 122, 0] },
    side: { azimuth: 90, elevation: 4, fov: 24, fit: 0.66, target: [0, 140, 0] },
    top: { azimuth: 0, elevation: 80, fov: 24, fit: 0.66, target: [2, 150, 0] },
    'detail-emitter': { azimuth: 64, elevation: 12, fov: 20, fit: 0.32, target: [160, AXIS, 0] },
    'detail-core': { azimuth: 12, elevation: 8, fov: 20, fit: 0.3, target: [-10, AXIS + 2, 28] },
    'detail-grip': { azimuth: 24, elevation: -6, fov: 20, fit: 0.3, target: [-30, AXIS - 85, 0] },
    'detail-cell': { azimuth: -34, elevation: 14, fov: 20, fit: 0.3, target: [-140, AXIS - 10, 0] },
  },

  async build(kit, { quality = 1, onProgress = async () => {} } = {}) {
    const q = Math.max(0.25, quality)
    const sq = Math.sqrt(q)
    const plain = new kit.PatinaMaterial()
    const turquoise = P.turquoiseMaterial(kit, { seed: SEED })
    const panels = {}
    const timing = {}
    let tLast = performance.now()
    const mark = (k) => { const t = performance.now(); timing[k] = Math.round(t - tLast); tLast = t }

    // ---- relief panels
    const L = D.layout()
    const jobs = [
      ['flank', () => D.flankPanel(kit, L.flank, { ppmm: 7.5 * sq, seed: SEED + 1 })],
      ['bellOuter', () => D.bellOuterPanel(kit, L.bellOuter, { ppmm: 5.2 * sq, seed: SEED + 2 })],
      ['bellInner', () => D.bellInnerPanel(kit, L.bellInner, { ppmm: 6 * sq, seed: SEED + 3 })],
      ['barrel', () => D.barrelPanel(kit, L.barrel, { ppmm: 7 * sq, seed: SEED + 4 })],
      ['grip', () => D.gripPanel(kit, L.grip, { ppmm: 6 * sq, seed: SEED + 5 })],
      ['cell', () => D.cellPanel(kit, L.cell, { ppmm: 7 * sq, seed: SEED + 6 })],
      ['base', () => D.basePanel(kit, L.base, { ppmm: 3.4 * sq, seed: SEED + 7 })],
    ]
    for (let i = 0; i < jobs.length; i++) {
      await onProgress(0.02 + 0.55 * (i / jobs.length), jobs[i][0])
      panels[jobs[i][0]] = jobs[i][1]()
      mark('panel:' + jobs[i][0])
    }

    const mats = new Map()
    const matFor = (relief) => {
      if (!relief) return plain
      if (!mats.has(relief)) mats.set(relief, new kit.PatinaMaterial({ relief }))
      return mats.get(relief)
    }
    const mesh = (geo, relief, part, name) => {
      const m = new THREE.Mesh(geo, matFor(relief))
      m.userData.part = part
      m.name = name
      m.castShadow = m.receiveShadow = true
      return m
    }

    const gun = new THREE.Group()
    gun.name = 'portal-gun'
    gun.position.y = AXIS

    // ---- the emitter: one revolve profile cut into patches that share their θ columns
    await onProgress(0.6, 'emitter')
    const emitter = new THREE.Group()
    emitter.name = 'emitter'
    emitter.userData.part = 'emitter'
    const nu = Math.round(176 * sq)
    const D_IN = L.bellInner.w
    const inner = [], plainBits = []
    for (const pt of bellPatches()) {
      const len = pt.pts.reduce((a, p, i) => (i ? a + Math.hypot(p[0] - pt.pts[i - 1][0], p[1] - pt.pts[i - 1][1]) : 0), 0)
      if (pt.kind === 'outer') {
        const geo = kit.buildSurface({ surface: revolveX(pt.pts), segments: [nu, Math.max(8, Math.round(len * 1.0 * sq))], relief: panels.bellOuter, fade: { u0: 0, u1: 0, v0: 1.2, v1: 1.2 } })
        emitter.add(mesh(geo, panels.bellOuter, 'emitter', 'emitter-outer'))
      } else if (pt.kind === 'cone' || pt.kind === 'tread' || pt.kind === 'dome') {
        const geo = kit.buildSurface({ surface: revolveX(pt.pts), segments: [nu, Math.max(3, Math.round(len * 0.9 * sq))], relief: panels.bellInner, panelMap: polarMap(pt.pts, D_IN), fade: { u0: 0, u1: 0, v0: pt.kind === 'dome' ? 0.8 : 1.0, v1: pt.kind === 'dome' ? 0 : 1.0 } })
        geo.computeTangents()
        inner.push(geo)
      } else {
        plainBits.push(kit.buildSurface({ surface: revolveX(pt.pts), segments: [nu, Math.max(2, Math.round(len * 0.6 * sq))] }))
      }
    }
    emitter.add(mesh(mergeGeometries(inner), panels.bellInner, 'emitter', 'emitter-portal'))
    emitter.add(mesh(mergeGeometries(plainBits.map((g) => { g.deleteAttribute('tangent'); return g })), null, 'emitter', 'emitter-lip-and-steps'))
    gun.add(emitter)
    mark('emitter')

    // ---- the barrel (a kui register), its ring fins
    await onProgress(0.64, 'barrel')
    const bLen = BARREL.x1 - BARREL.x0
    const barrelGeo = kit.buildSurface({
      surface: revolveX([[BARREL.x0, BARREL.r], [BARREL.x1, BARREL.r]]), segments: [Math.round(120 * sq), Math.round(70 * sq)], relief: panels.barrel,
      reliefRect: { u0: 0, u1: 1, v0: (BARREL.reg[0] - BARREL.x0) / bLen, v1: (BARREL.reg[1] - BARREL.x0) / bLen }, fade: { u0: 0, u1: 0, v0: 1.0, v1: 1.0 },
    })
    const barrel = mesh(barrelGeo, panels.barrel, 'barrel', 'barrel')
    gun.add(barrel)
    const fins = P.fins(kit, { material: plain })
    fins.forEach((f) => gun.add(f))
    mark('barrel')

    // ---- the body: two half shells sharing the flank panel (mirrored on −Z)
    await onProgress(0.68, 'body')
    const body = new THREE.Group()
    body.name = 'body'
    body.userData.part = 'body'
    for (const side of [1, -1]) {
      const geo = kit.buildSurface({
        surface: bodyHalf(side), segments: [Math.round(132 * sq), Math.round(100 * sq)], relief: panels.flank,
        panelMap: bodyPanelMap(side), fade: { u0: 1.0, u1: 1.0, v0: 1.5, v1: 1.5 },
      })
      if (side < 0) geo.computeTangents()
      body.add(mesh(geo, panels.flank, 'body', side > 0 ? 'body-starboard' : 'body-port'))
    }
    gun.add(body)
    mark('body')
    await onProgress(0.72, 'core')
    const eyes = P.coreEyes(kit, { q, material: plain, turquoise })
    eyes.forEach((e) => gun.add(e))
    mark('eyes')
    const dial = P.selectorDial(kit, { q, material: plain, turquoise })
    dial.forEach((d) => gun.add(d))
    const flanges = P.flanges(kit, { material: plain, seed: SEED + 20 })
    flanges.forEach((f) => gun.add(f))
    mark('dial+flanges')

    // ---- the power cell and its socket, the cable
    await onProgress(0.76, 'power cell')
    const cell = new THREE.Group()
    cell.name = 'cell'
    cell.userData.part = 'cell'
    const cp = cellProfile()
    const ib = cp.findIndex((p) => p[0] >= CELL.band[0]), ie = cp.findIndex((p) => p[0] >= CELL.band[1])
    const capPts = [...cp.slice(0, ib), [CELL.band[0], CELL.r]]
    const bandPts = [[CELL.band[0], CELL.r], [CELL.band[1], CELL.r]]
    const frontPts = [[CELL.band[1], CELL.r], ...cp.slice(ie)]
    const ncu = Math.round(96 * sq)
    cell.add(mesh(kit.buildSurface({ surface: revolveX(capPts, { yc: CELL.yc }), segments: [ncu, Math.round(30 * sq)] }), null, 'cell', 'cell-cap'))
    cell.add(mesh(kit.buildSurface({ surface: revolveX(bandPts, { yc: CELL.yc }), segments: [ncu, Math.round(64 * sq)], relief: panels.cell, fade: { u0: 0, u1: 0, v0: 1, v1: 1 } }), panels.cell, 'cell', 'cell-band'))
    cell.add(mesh(kit.buildSurface({ surface: revolveX(frontPts, { yc: CELL.yc }), segments: [ncu, 6] }), null, 'cell', 'cell-front'))
    const collar = [[SOCKET.x0 - 1, 16.6], [SOCKET.x0 - 0.6, 20.6], [SOCKET.x0 + 1.2, SOCKET.r], [SOCKET.x1 - 1.6, SOCKET.r], [SOCKET.x1 - 0.2, 21.4], [SOCKET.x1 + 0.6, 19.2]]
    cell.add(mesh(kit.buildSurface({ surface: revolveX(collar, { yc: CELL.yc }), segments: [ncu, 12] }), null, 'cell', 'socket'))
    P.cellFittings(kit, { q, material: plain, turquoise }).forEach((m) => (m.userData.part === 'cores' ? gun.add(m) : cell.add(m)))
    gun.add(cell)
    const cableParts = P.cable(kit, { q, material: plain })
    cableParts.forEach((m) => gun.add(m))
    mark('cell')

    // ---- the grip: the creature's scaled body (swept), its head, tongue and tail (sculpture)
    await onProgress(0.8, 'grip')
    const grip = new THREE.Group()
    grip.name = 'grip'
    grip.userData.part = 'grip'
    const gGeo = kit.buildSurface({ surface: P.gripSurface(), segments: [Math.round(56 * sq), Math.round(64 * sq)], relief: panels.grip, fade: { u0: 0.4, u1: 0.4, v0: 1.5, v1: 1.5 } })
    grip.add(mesh(gGeo, panels.grip, 'grip', 'grip-body'))
    P.gripSculpture(kit, { q, material: plain, seed: SEED + 30 }).forEach((m) => grip.add(m))
    gun.add(grip)
    mark('grip')

    // ---- the stand
    await onProgress(0.9, 'stand')
    const standParts = P.stand(kit, { q, material: plain, baseRelief: panels.base, seed: SEED + 40 })
    mark('stand')

    const object = new THREE.Group()
    object.name = 'portal-gun'
    object.userData.timing = timing
    object.add(gun, ...standParts)
    await onProgress(1, 'done')
    const byPart = (name) => { const out = []; gun.traverse((o) => { if (o !== gun && o.userData.part === name && o.parent && o.parent.userData.part !== name) out.push(o) }); return out }
    return {
      object,
      parts: {
        body, emitter, barrel, fins, flanges, eyes: byPart('eyes'), cores: byPart('cores'), dial: byPart('dial'), grip, cell, cable: cableParts, stand: standParts,
      },
      panels,
    }
  },
}


