// THROWAWAY STUDY (fang engineer) — not a reconstruction; do not register in
// the final tree. Exercises fang.js / legs.js / handles.js / lid.js at Houmuwu
// and Met fangyi 1974.268.2 proportions so silhouettes and junctions can be
// compared with the reference photographs.

import * as THREE from 'three'

// ---- Houmuwu proportions (mm), read off refs/commons/houmuwu-ding 02-front / 03-side
const HM = {
  H: 1330,
  legH: 448,      // ground → body underside
  wall: 513,      // underside → wall top
  rimH: 94,       // rim slab
  handleH: 275,   // above the rim top
  mouthW: 1100, mouthD: 790,  // rim outer
  overhang: 25,
}

const RELIEF = true

export default {
  id: '_study-fang',
  order: 98,
  title: 'Study: Houmuwu fangding geometry',
  titleZh: '研究',
  type: 'fangding',
  date: 'study', period: 'study', findspot: 'procedural', collection: 'kit study', accession: 'STUDY-FANG',
  dimensions: { h: HM.H, w: HM.mouthW, d: HM.mouthD },
  blurb: 'Geometry study for the fang kit.',
  defaultPatina: 'excavated-green',
  views: {
    front: { azimuth: 0, elevation: 4, fov: 28, fit: 1.08 },
    'three-quarter': { azimuth: -35, elevation: 14, fov: 28, fit: 1.08 },
    side: { azimuth: 90, elevation: 4, fov: 28, fit: 1.08 },
    top: { azimuth: 20, elevation: 60, fov: 28, fit: 1.08 },
    leg: { azimuth: 45, elevation: 2, fov: 18, fit: 0.32, target: [520, 300, 380] },
    handle: { azimuth: 90, elevation: 8, fov: 18, fit: 0.33, target: [520, 1180, 0] },
  },
  async build(kit, { quality = 1, onProgress = async () => {} } = {}) {
    const plain = new kit.PatinaMaterial()
    const object = new THREE.Group()
    const mouthWall = { w: HM.mouthW - 2 * HM.overhang, d: HM.mouthD - 2 * HM.overhang }
    const taper = 2.0
    const grid = {
      long: { rows: [125, { weight: 1 }, 125], cols: [150, { weight: 1 }, 150] },
      short: { rows: [125, { weight: 1 }, 125], cols: [120, { weight: 1 }, 120] },
    }
    const bodyOpts = {
      width: mouthWall.w, depth: mouthWall.d, at: 'top', height: HM.wall, taper,
      wall: 60, floor: { thickness: 55 },
      rim: { kind: 'slab', height: HM.rimH, overhang: HM.overhang, inner: 18, round: 6 },
      grid, cast: { seed: 3, sag: 0.003, rim: 6 },
      material: plain, density: 0.35 * Math.sqrt(quality),
    }
    const layout = kit.fangLayout(bodyOpts)
    const cells = {}
    if (RELIEF) {
      await onProgress(0.1, 'bands')
      for (const side of ['front', 'right']) {
        const L = layout.sides[side]
        const rows = L.cells.map((row) => row.map((c) => (c.row === 1 && c.col === 1 ? null : bandRelief(kit, c))))
        cells[side === 'front' ? 'long' : 'short'] = rows
      }
    }
    await onProgress(0.5, 'body')
    const body = kit.fangBody({ ...bodyOpts, cells })
    body.position.y = HM.legH
    object.add(body)

    // corner flanges (low notched dentils) and band nose flanges
    const flanges = []
    for (const [name, c] of Object.entries(body.userData.corners)) {
      void name
      flanges.push(kit.flange({ from: c.bottom.clone().setY(c.bottom.y + 6), to: c.top.clone().setY(c.top.y - 4), out: c.out, height: 22, thickness: 26, notches: { every: 46, depth: 0.55, width: 12 }, material: plain }))
    }
    for (const side of ['front', 'right', 'back', 'left']) {
      const w = body.userData.walls[side]
      for (const [y0, y1] of [w.registers[0], w.registers[2]]) {
        const a = body.userData.at(side, 0.5, y0 - body.userData.footHeight + 6)
        const b = body.userData.at(side, 0.5, y1 - body.userData.footHeight - 6)
        flanges.push(kit.flange({ from: a, to: b, out: w.normal, height: 18, thickness: 22, notches: { every: 40, depth: 0.5, width: 10 }, material: plain }))
      }
    }
    for (const f of flanges) body.add(f)

    await onProgress(0.7, 'legs')
    const legs = []
    const legBase = { height: HM.legH, radius: 86, taper: 0.02, entasis: 0.02, entasisAt: 0.6, foot: { swell: 0.05, height: 0.3, step: true },
      top: { flare: 0.12, height: 30 }, collar: { from: 0.56, amount: 20, shoulder: 5 },
      rings: { count: 3, at: 0.47, width: 10, spacing: 30, height: 4.5 }, hollow: { wall: 22, open: 'bottom' }, embed: 30 }
    let legPanel = null
    if (RELIEF) {
      const sz = kit.legPanelSize({ ...legBase, relief: { zone: [HM.legH * 0.58, HM.legH - 4], arc: 200 } })
      legPanel = legMask(kit, sz)
    }
    CORNER_LOOP: for (const [i, name] of ['front-right', 'right-back', 'back-left', 'left-front'].entries()) {
      const seat = body.userData.legSeat(name, 128)
      const facing = (Math.atan2(seat.x, seat.z) * 180) / Math.PI
      const leg = kit.columnLeg({
        ...legBase, material: plain, density: 0.5 * Math.sqrt(quality),
        relief: legPanel ? { map: legPanel, zone: [HM.legH * 0.58, HM.legH - 4], arc: 200, facing } : { zone: [HM.legH * 0.58, HM.legH - 4], facing },
        flange: { height: 20, thickness: 20, notches: { every: 34, depth: 0.5, width: 9 } },
        splay: { angle: 0.6, toward: [seat.x, seat.z] }, cast: { seed: 40 + i },
      })
      leg.position.set(seat.x, 0, seat.z)
      object.add(leg)
      legs.push(leg)
      continue CORNER_LOOP
    }

    await onProgress(0.85, 'handles')
    const handles = []
    const rim = body.userData.rim
    const hBase = {
      width: 290, height: HM.handleH, bar: 72, barTop: 86, depth: 100, radius: 70, aperture: { radius: 30 },
      lean: 3, embed: 30, root: { height: HM.rimH + 4, rise: 22, outset: 46, width: 82 },
    }
    const faces = RELIEF ? handleFaces(kit, kit.handleLayout(hBase)) : {}
    for (const sx of [-1, 1]) {
      const hOpts = { ...hBase, faces, cast: { seed: 70 + sx }, material: plain }
      const hnd = kit.uprightHandle(hOpts)
      const p = body.userData.rimTop(sx > 0 ? 'right' : 'left', 0.5, 0)
      hnd.rotation.y = sx * Math.PI / 2
      hnd.position.set(p.x - sx * (37 + 50), p.y + HM.legH, p.z)
      object.add(hnd)
      handles.push(hnd)
    }
    void rim
    await onProgress(1, 'done')
    return { object, parts: { body, legs, handles, flanges }, panels: {} }
  },
}

/** Frame band: confronted kui pair (dissolved taotie) around a nose slot; vertical bands: stacked kui. */
function bandRelief(kit, c) {
  const p = new kit.ReliefPanel({ width: c.w, height: c.h, ppmm: 1.6, seed: 17 + c.row * 7 + c.col })
  const m = 6
  const rect = { x: m, y: m, w: c.w - 2 * m, h: c.h - 2 * m }
  const vertical = c.h > c.w * 1.2
  if (vertical) {
    const n = Math.max(1, Math.round(rect.h / (rect.w * 1.25)))
    const hh = rect.h / n
    for (let i = 0; i < n; i++) kit.drawMotif(p, 'kui', { x: rect.x, y: rect.y + i * hh + 3, w: rect.w, h: hh - 6 }, { arrangement: 'single', orient: 'down', relief: { motif: 4, boss: 7, groove: 1.0 } }, { ground: { pitch: 3.2, depth: 1.0 } })
  } else if (c.w > c.h * 1.6) {
    kit.frieze(p, rect, { unit: 'kui', count: 2, facing: 'centre', gap: 30, params: { relief: { motif: 4, boss: 7, groove: 1.0 } }, ground: { pitch: 3.2, depth: 1.0 } })
  } else {
    kit.drawMotif(p, 'taotie', rect, { relief: { motif: 4, boss: 7, groove: 1 } }, { ground: { pitch: 3.2, depth: 1 } })
  }
  return { relief: p.bake(), map: 'true' }
}

function handleFaces(kit, L) {
  const R = { motif: 3, boss: 6, groove: 0.9 }
  const g = { pitch: 2.6, depth: 0.9 }
  // outer face: a stand-in pair of vertical creatures up the legs (tigers on the real one) and a mask at the apex
  const po = new kit.ReliefPanel({ width: L.outer.w, height: L.outer.h, ppmm: 1.6, seed: 31 })
  const bar = 72
  for (const [x, f] of [[6, 'up'], [L.outer.w - bar + 4, 'up']]) kit.drawMotif(po, 'kui', { x, y: 6, w: bar - 10, h: L.outer.h - 100 }, { arrangement: 'single', orient: f, relief: R }, { ground: g })
  kit.drawMotif(po, 'taotie', { x: L.outer.w / 2 - 60, y: L.outer.h - 84, w: 120, h: 78 }, { relief: R }, { ground: g })
  // edge strip: a running frieze (fish on the real one)
  const pe = new kit.ReliefPanel({ width: L.edge.w, height: L.edge.h, ppmm: 1.2, seed: 32 })
  kit.frieze(pe, { x: 8, y: 6, w: L.edge.w - 16, h: L.edge.h - 12 }, { unit: 'kui', count: 6, facing: 'right', gap: 10, params: { relief: R }, ground: g })
  const pr = new kit.ReliefPanel({ width: L.root.w, height: L.root.h, ppmm: 1.6, seed: 33 })
  kit.drawMotif(pr, 'taotie', { x: 4, y: 4, w: L.root.w - 8, h: L.root.h - 8 }, { relief: R }, { ground: g })
  return { outer: { relief: po.bake() }, edge: { relief: pe.bake() }, root: { relief: pr.bake() } }
}

function legMask(kit, sz) {
  const p = new kit.ReliefPanel({ width: sz.w, height: sz.h, ppmm: 1.6, seed: 9 })
  kit.drawMotif(p, 'taotie', { x: 8, y: 6, w: sz.w - 16, h: sz.h - 12 }, { nose: 'flange', relief: { motif: 6, boss: 12, groove: 1.0 } }, { preset: 'houmuwu-leg', ground: { pitch: 3, depth: 1 } })
  return p.bake()
}

// ---- Met fangyi 1974.268.2 proportions (H 254, W 152, D 114 mm)
export const studyFangyi = {
  id: '_study-fangyi',
  order: 98,
  title: 'Study: fangyi geometry',
  titleZh: '研究',
  type: 'fangyi',
  date: 'study', period: 'study', findspot: 'procedural', collection: 'kit study', accession: 'STUDY-FANGYI',
  dimensions: { h: 254, w: 152, d: 114 },
  blurb: 'Geometry study for the fang kit.',
  defaultPatina: 'olive-museum',
  views: {
    front: { azimuth: 0, elevation: 4, fov: 28, fit: 1.08 },
    'three-quarter': { azimuth: -32, elevation: 12, fov: 28, fit: 1.08 },
    side: { azimuth: 90, elevation: 4, fov: 28, fit: 1.08 },
    top: { azimuth: 20, elevation: 60, fov: 28, fit: 1.08 },
  },
  async build(kit, { quality = 1, onProgress = async () => {} } = {}) {
    const plain = new kit.PatinaMaterial()
    const object = new THREE.Group()
    const footH = 30
    const bodyH = 128
    const taper = 2.6
    const bodyOpts = {
      width: 138, depth: 102, at: 'top', height: bodyH, taper, wall: 4, floor: { thickness: 4 },
      rim: { kind: 'plain', inner: 1 },
      ...(globalThis.__fangVariant ? { cornerRadius: 8, bulge: 4, bulgeAt: 0.6 } : {}),
      grid: { rows: [24, { weight: 1 }], cols: [{ weight: 1 }] },
      foot: { height: footH, flare: -footH * Math.tan((taper * Math.PI) / 180), thickness: 4, notch: globalThis.__fangVariant ? { width: 30, height: 18, shape: 'arch' } : { width: 26, height: 15, shape: 'rect', round: 1.5 } },
      cast: { seed: 5, sag: 0.002, rim: 0.8 },
      material: plain, density: 1.4 * Math.sqrt(quality),
    }
    await onProgress(0.05, 'panels')
    const lay = kit.fangLayout(bodyOpts)
    const ppmm = 5 * quality
    const cells = {}
    if (RELIEF) {
      for (const side of ['front', 'right']) {
        const [top, main] = lay.sides[side].cells.map((r) => r[0])
        const pt = new kit.ReliefPanel({ width: top.wMax, height: top.h, ppmm, seed: 3 })
        kit.frieze(pt, { x: 3, y: 2, w: top.wMax - 6, h: top.h - 4 }, { unit: 'kui', count: 2, facing: 'centre', gap: 6, params: { relief: { motif: 0.9, boss: 1.6, groove: 0.3 } }, ground: { pitch: 0.95, depth: 0.3 } })
        await onProgress(0.15, 'panels')
        const pm = new kit.ReliefPanel({ width: main.wMax, height: main.h, ppmm, seed: 4 })
        kit.drawMotif(pm, 'taotie', { x: 3, y: 3, w: main.wMax - 6, h: main.h - 6 }, { nose: 'flange', relief: { motif: 1.1, boss: 2.2, groove: 0.3 } }, { preset: 'fangyi-body', ground: { pitch: 0.95, depth: 0.3 } })
        cells[side === 'front' ? 'long' : 'short'] = [[{ relief: pt.bake(), map: 'true' }], [{ relief: pm.bake(), map: 'true' }]]
        await onProgress(0.3, 'panels')
      }
      const fl = lay.foot.sides
      bodyOpts.foot.relief = {}
      for (const side of ['front', 'right']) {
        const f = fl[side]
        const pf = new kit.ReliefPanel({ width: f.w, height: f.h, ppmm, seed: 8 })
        const n = f.notch
        const hw = (f.w - n.w) / 2
        for (const x of [0, hw + n.w]) kit.drawMotif(pf, 'kui', { x: x + 3, y: n.h + 1, w: hw - 6, h: f.h - n.h - 3 }, { arrangement: 'single', facing: x === 0 ? 'right' : 'left', relief: { motif: 0.8, boss: 1.4, groove: 0.3 } }, { ground: { pitch: 0.95, depth: 0.3 } })
        bodyOpts.foot.relief[side === 'front' ? 'long' : 'short'] = { relief: pf.bake() }
      }
    }
    await onProgress(0.4, 'body')
    const body = kit.fangBody({ ...bodyOpts, cells })
    object.add(body)
    const flanges = []
    const F = (from, to, out, h = 6, t = 3.2) => flanges.push(kit.flange({ from, to, out, height: h, thickness: t, notches: { every: 5.5, depth: 0.45, width: 1.8 }, material: plain }))
    const foot = body.children.find((c) => c.userData.part === 'foot')
    for (const [n, c] of Object.entries(body.userData.corners)) F(foot.userData.corners[n].bottom.clone().setY(0.5), c.top.clone().setY(c.top.y - 1), c.out)
    for (const side of ['front', 'right', 'back', 'left']) {
      const w = body.userData.walls[side]
      F(w.axis[0].clone().setY(w.axis[0].y + 1), w.axis[1].clone().setY(w.axis[1].y - 1), w.normal, 5)
    }
    for (const a of Object.values(foot.userData.axes)) F(a.bottom.clone().setY(a.bottom.y + 1), a.top.clone().setY(a.top.y - 0.5), a.normal, 5)
    for (const f of flanges) object.add(f)

    await onProgress(0.6, 'lid')
    const rim = body.userData.rim
    const ll = kit.hippedLidLayout({ width: 146, depth: 110, rise: 66, ridge: 0.42, concave: 0.15, skirt: { height: 8, overhang: 1.5 } })
    const lidFaces = {}
    if (RELIEF) {
      for (const side of ['front', 'right']) {
        const f = ll.faces[side]
        const pl = new kit.ReliefPanel({ width: f.w, height: f.h, ppmm, seed: 12 })
        const r = side === 'front' ? { x: 12, y: 4, w: f.w - 24, h: f.h - 10 } : { x: f.w * 0.22, y: 4, w: f.w * 0.56, h: f.h * 0.55 }
        kit.drawMotif(pl, 'taotie', r, { nose: 'flange', relief: { motif: 1.0, boss: 2.0, groove: 0.3 } }, { preset: 'fangyi-lid', ground: { pitch: 0.95, depth: 0.3 } })
        lidFaces[side === 'front' ? 'long' : 'short'] = { relief: pl.bake() }
      }
    }
    const lid = kit.hippedLid({
      faces: lidFaces,
      width: 146, depth: 110, rise: 66, ridge: 0.42, concave: 0.15, thickness: 3.5,
      skirt: { height: 8, overhang: 1.5 }, seat: { depth: 6, clearance: 0.6 },
      knob: { width: 34, depth: 26, rise: 12, ridge: 0.5, concave: 0.05, skirt: { height: 3 }, post: { height: 8, width: 10, depth: 8, waist: 0.15 } },
      material: plain,
    })
    lid.position.y = rim.y + 0.3
    object.add(lid)
    const lf = []
    const L = (pts, h, t = 3) => {
      const a = pts[0].clone().add(lid.position), b = pts[pts.length - 1].clone().add(lid.position)
      const out = new THREE.Vector3(a.x, 0, a.z).normalize()
      lf.push(kit.flange({ from: a.lerp(b, 0.04), to: b.clone().lerp(a, 0.08), out: out.add(new THREE.Vector3(0, 0.6, 0)).normalize(), height: h, thickness: t, notches: { every: 5, depth: 0.45, width: 1.6 }, material: plain }))
    }
    for (const hip of lid.userData.hips) L(hip, 5.5)
    for (const [s, mid] of Object.entries(lid.userData.midlines)) if (s === 'front' || s === 'back') L(mid, 4.5)
    for (const f of lf) object.add(f)
    await onProgress(1, 'done')
    return { object, parts: { body, lid, flanges: [...flanges, ...lf] }, panels: {} }
  },
}
