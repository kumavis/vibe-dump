// Nezu fanghe 饕餮文方盉 — one of the museum's set of three square he, said to be from Houjiazhuang,
// Anyang (Shang, 13th–12th c. BC). Reconstruction from reference/nezu-fanghe/dossier.md, measured on
// the project owner's phone photographs through the vitrine (no dimensions on the label; scale inferred).
// Units mm, Y up, feet on y = 0, front (+Z) = the HANDLE face: the face with the sculpted animal (its
// horned head at the top of the loop, its body running down the crease between two lobes); the spout
// leans back over the opposite face (−Z).
//
// Form: four lobes that run down into four legs (kit.lobedBody — a square-plan lobed solid, the lobes
// overlapping above the crotch so the creases are real intersections, parting below it into the arch
// between the legs); a square frieze band and a concave flaring collar (kit.fangBody with a profile); a
// thick square eave slab; the closed top, one swelling cushion (kit.plate) carrying one symmetric face whose mouth is
// the filling hole, cut through; a crenellated ridge (its nose); the slanted hollow spout with its notched flange and two side pegs;
// the handle as one sculpture (signed distance field → kit.meshSDF); notched flanges on every corner and
// on the creases of the three faces without the handle.

import * as THREE from 'three'
import { D, SPOUT, HOLE, lobeSectionAt, upperProfile } from './nezu-fanghe/form.js'
import * as R from './nezu-fanghe/relief.js'
import * as P from './nezu-fanghe/parts.js'

export default {
  id: 'nezu-fanghe',
  order: 10,
  title: 'Square He with Taotie Design',
  titleZh: '饕餮文方盉',
  type: 'fanghe (covered pouring vessel)',
  date: 'Shang dynasty, 13th–12th century BC',
  period: 'Late Shang dynasty, Anyang period',
  findspot: 'Said to have been excavated at Houjiazhuang, Anyang, Henan (museum label)',
  collection: 'Nezu Museum, Tokyo — Important Cultural Property; one of a set of three',
  accession: 'label nos. 90064 / 90065 (cards photographed)',
  designation: 'Important Cultural Property (重要文化財)',
  dimensions: { h: 720, w: 332, d: 437, inferred: true }, // h to the spout lip; inferred, not on the label
  blurb:
    'A tall covered pouring vessel whose square body is four bulging lobes running down into four legs; each lobe carries half a taotie mask in fat, high bands — a double horn rolled into a deep coil, a brow bar, a domed eye — under a frieze of kui dragons. ' +
    'The closed top is one more face, looking up: two domed eyes under broad horns, a crenellated ridge for its nose, and the filling hole as its open mouth, ringed by hooked jaws; the slanted tube spout rises out of its brow like a crest. Opposite the spout the loop handle is a whole dragon, its horned head under the eave. ' +
    'One of three he shown together at the Nezu Museum; the size is inferred from the owner’s photographs (the label gives none), and the faces the photographs do not show repeat the ones they do.',
  defaultPatina: 'nezu-fanghe',
  views: {
    // vessel A has no head-on photograph of its handle face; side.jpg / side-left.jpg / three-quarter.jpg are
    // its own (photos 42, 39, 40). Photos 13–16 and 24 show vessel B of the set and are never used as refs.
    front: { azimuth: 0, elevation: 6, fov: 26, fit: 1.08 },
    side: { azimuth: 90, elevation: 18, fov: 26, fit: 1.04, ref: 'side.jpg' },
    'side-left': { azimuth: -90, elevation: 12, fov: 26, fit: 1.04, ref: 'side-left.jpg' },
    back: { azimuth: 180, elevation: 8, fov: 26, fit: 1.08 },
    'three-quarter': { azimuth: -40, elevation: 22, fov: 26, fit: 0.66, target: [-20, 330, 40], ref: 'three-quarter.jpg' },
    // straight down on the closed top: the face's axis vertical, the spout at the top of the frame, the mouth (filling
    // hole) toward the bottom, the handle face (+Z) below it; raking key from the upper left
    top: { face: { center: [0, 470, 0], normal: [0, 1, 0], up: [0, 0, -1], width: 350, height: 350 } },
    // photo 15 (VESSEL B, the set's twin — same top scheme): from the handle end along the axis toward the spout
    'lid-axis': { azimuth: 0, elevation: 26, fov: 24, fit: 0.27, target: [0, 470, 40], ref: 'lid-axis.jpg' },
    'detail-handle-head': { azimuth: 0, elevation: -2, fov: 20, fit: 0.2, target: [0, 385, 160], ref: 'detail-handle-head.jpg' },
    'detail-handle-side': { azimuth: -90, elevation: 10, fov: 20, fit: 0.28, target: [0, 330, 150], ref: 'detail-handle-side.jpg' },
    'detail-lobe': { azimuth: 22, elevation: 8, fov: 20, fit: 0.15, target: [62, 205, 110], ref: 'detail-lobe.jpg' },
    'detail-spout': { azimuth: 90, elevation: 16, fov: 20, fit: 0.3, target: [0, 600, -150], ref: 'detail-spout.jpg' },
    'detail-lid': { azimuth: 54, elevation: 45, fov: 27, fit: 0.29, target: [18, 470, 30], ref: 'detail-lid.jpg' }, // photo 44 over the handle-right corner (camera fitted to the eave corners)
    'detail-leg': { azimuth: 90, elevation: 10, fov: 20, fit: 0.32, target: [0, 90, 0], ref: 'detail-leg.jpg' },
    'face-front': { face: { center: [0, 212.5, 105], normal: [0, 0, 1], up: [0, 1, 0], width: 240, height: 185 }, ref: 'faces/face-front.jpg' },
    'face-side': { face: { center: [105, 212.5, 0], normal: [1, 0, 0], up: [0, 1, 0], width: 240, height: 185 }, ref: 'faces/face-side.jpg' },
  },

  async build(kit, { quality = 1, onProgress: report = async () => {} } = {}) {
    const q = Math.max(0.25, quality)
    const stages = []
    let tPrev = performance.now(), lPrev = 'start'
    const onProgress = async (f, label) => { const t = performance.now(); stages.push([lPrev, Math.round(t - tPrev)]); tPrev = t; lPrev = label; await report(f, label) }
    const sq = Math.sqrt(q)
    const seed = 90064
    const plain = new kit.PatinaMaterial()
    const object = new THREE.Group()
    object.name = 'nezu-fanghe'

    // ---- lobes + legs
    await onProgress(0.02, 'lobes')
    const lobeSize = kit.lobePanelSize(lobeSectionAt, 200)
    const lobeRect = { y0: D.faceBottom - 4, y1: D.lobeTop + 2 }
    const lobeMap = R.lobePanel(kit, { width: lobeSize.width, height: lobeRect.y1 - lobeRect.y0, split: lobeSize.split }, { ppmm: 5 * sq, seed, y0: lobeRect.y0 })
    const rows = []
    for (let y = 0; y <= D.legTop; y += 12) rows.push(y)
    for (let y = D.legTop + 2; y < D.lobeTop; y += 2.2 / sq) rows.push(y)
    rows.push(D.lobeTop)
    const body = kit.lobedBody({
      section: lobeSectionAt, y0: 0, y1: D.lobeTop, rows, columns: Math.round(170 * sq),
      relief: { map: lobeMap, y0: lobeRect.y0, y1: lobeRect.y1, width: lobeSize.width, split: lobeSize.split, fade: 1.5 },
      material: plain, part: 'lobes',
    })
    object.add(body)

    // ---- frieze band + flaring collar: one fang body on top of the lobes
    await onProgress(0.3, 'frieze and collar')
    const upperH = D.eave - D.lobeTop
    const upperOpts = {
      width: 2 * D.A, depth: 2 * D.A, height: upperH, at: 'bottom', taper: 0, profile: upperProfile,
      wall: 8, innerRadius: 4, floor: { thickness: 8, round: 4 }, rim: false,
      grid: { rows: [D.eave - D.friezeTop, D.friezeTop - D.lobeTop], cols: [{ weight: 1 }] },
      material: plain, density: 0.7 * sq, plainDensity: 0.08,
    }
    const layout = kit.fangLayout(upperOpts)
    const collarCell = layout.sides.front.cells[0][0]
    const friezeCell = layout.sides.front.cells[1][0]
    const collarMap = R.collarPanel(kit, collarCell, { ppmm: 3.6 * sq, seed: seed + 1 })
    const friezeMaps = {
      front: R.friezePanel(kit, friezeCell, { ppmm: 5 * sq, seed: seed + 2, handle: true }),
      side: R.friezePanel(kit, friezeCell, { ppmm: 5 * sq, seed: seed + 3, handle: false }),
    }
    await onProgress(0.45, 'casting the upper body')
    const upper = kit.fangBody({
      ...upperOpts,
      relief: (cell) => (cell.row === 0
        ? (collarMap ? { relief: collarMap, map: 'stretch', fade: 1.2, density: 0.35 * sq } : null)
        : { relief: cell.side === 'front' ? friezeMaps.front : friezeMaps.side, map: 'true', fade: 1.2 }),
    })
    upper.position.y = D.lobeTop
    upper.userData.part = 'body'
    object.add(upper)

    // ---- eave, cap, plateau, ridge
    await onProgress(0.55, 'eave and cap')
    const fascia = R.fasciaPanel(kit, { w: 2 * D.eaveA, h: D.eaveT }, { ppmm: 5 * sq, seed: seed + 4 })
    const eave = P.eave(kit, { fascia, material: plain, q })
    object.add(eave)
    const faceMap = R.capFacePanel(kit, { A: D.capA, hole: HOLE }, { ppmm: 3.6 * sq, seed: seed + 20 })
    const lid = P.cap(kit, { face: faceMap, material: plain, q })
    const ridge = P.ridge(kit, { material: plain, seed: seed + 21 })
    lid.add(ridge)
    object.add(lid)

    // ---- spout
    await onProgress(0.68, 'spout')
    const spoutMap = R.spoutPanel(kit, { w: 2 * Math.PI * SPOUT.r, h: SPOUT.length }, { ppmm: 3.4 * sq, seed: seed + 30 })
    const spout = P.spout(kit, { relief: spoutMap, material: plain, q, seed: seed + 31 })
    object.add(spout)

    // ---- handle sculpture
    await onProgress(0.75, 'handle')
    const horn = { right: R.hornPanel(kit, { w: 64, h: 56 }, { ppmm: 5 * sq, seed: seed + 50 }), left: R.hornPanel(kit, { w: 64, h: 56 }, { ppmm: 5 * sq, seed: seed + 51, mirror: true }) }
    const handle = P.handle(kit, { material: plain, q, horn })
    object.add(handle)

    // ---- flanges and the small frieze heads
    await onProgress(0.88, 'flanges')
    const flanges = P.flanges(kit, { material: plain, seed: seed + 40 })
    for (const f of flanges) object.add(f)
    const heads = P.friezeHeads(kit, { material: plain, q, seed: seed + 60 })
    for (const h of heads) object.add(h)

    await onProgress(1, 'done')
    object.userData.stages = stages
    return {
      object,
      parts: { lobes: body, body: upper, eave, lid, spout, handles: handle, flanges, heads },
      panels: { lobe: lobeMap, collar: collarMap, friezeFront: friezeMaps.front, friezeSide: friezeMaps.side, fascia, top: faceMap, spout: spoutMap },
    }
  },
}
