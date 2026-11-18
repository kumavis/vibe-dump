// A portable radio-cassette player — a generic 1980s "boombox" of no particular make — cast as a late-Shang ritual
// bronze: a showpiece for the Taotie Kit, not a museum object. Size chosen: 460 mm wide. Units mm, Y up, the radio
// stands on y = 0 (its feet), front +Z.
//
// The object is already a taotie: the two round speakers are a pair of eyes, the cassette door between them a mouth,
// the carrying handle on top the upright handle of a ding.
//
// form:  boombox/form.js — a fangBody cabinet with rounded vertical arrises, a thick faceplate (kit.plate) with two
//        true speaker openings and concave cones in them (polar buildSurface discs), the cassette door, nose and arris
//        flanges, notched knobs, piano keys, a swept handle with animalHeads at its pivots, a bamboo-jointed antenna,
//        columnLeg feet.
// décor: boombox/decor.js (one panel per mould face; the composition is written at its top).

import * as THREE from 'three'
import { BODY, FACE, SPK, MID, HANDLE, ANTENNA } from './boombox/layout.js'
import * as F from './boombox/form.js'
import * as D from './boombox/decor.js'

const SEED = 1984

export default {
  id: 'boombox',
  group: 'examples',
  order: 94,
  title: 'Boombox',
  titleZh: '录音机',
  type: 'fang box with a great mask and a ding handle (after a generic 1980s portable radio-cassette player)',
  date: 'c. 1985 / cast c. 1200 BC in spirit',
  period: 'Portable music, 1980s — dressed as late Shang, Anyang style',
  collection: 'After the portable radio-cassette player of no particular make: two speakers, tuner, cassette deck, handle, antenna',
  accession: '',
  dimensions: { w: 464, h: 221, d: 124, chosen: true, note: 'body 464 × 209 mm on 12 mm feet, 124 mm deep (to the handle bar 303 mm, the raised antenna 374 mm) — size chosen, not measured' },
  blurb:
    'A 1980s portable radio-cassette player — two big speakers, the tuner and cassette deck between them, piano keys on top, a folding handle and a telescopic antenna — cast as a Shang ritual bronze. ' +
    'The object was already a taotie: the speakers are its eyes (coiled-serpent pupils in deep sockets ringed by fat ridges), horns curl over them, the cassette door is the mouth with whorl-boss reels and fangs, the tuner its brow band; the handle is a ding’s upright handle grown long, its arms ending in beast heads, and the antenna a jointed bamboo rod with a bud. ' +
    'Its size (460 mm wide) is chosen; no such bronze was ever cast.',
  defaultPatina: 'boombox',
  views: {
    'three-quarter': { azimuth: -34, elevation: 17, fov: 26, fit: 0.9, target: [0, 150, 0] },
    front: { azimuth: 0, elevation: 5, fov: 26, fit: 1.0, target: [0, 150, 0] },
    side: { azimuth: -90, elevation: 6, fov: 26, fit: 1.0, target: [0, 150, 0] },
    back: { azimuth: 160, elevation: 12, fov: 26, fit: 1.0, target: [0, 150, 0] },
    top: { azimuth: 0, elevation: 80, fov: 26, fit: 1.0, target: [0, 150, 0] },
    'detail-eye': { azimuth: -16, elevation: 8, fov: 20, fit: 0.33, target: [-SPK.dx, FACE.y0 + SPK.y, BODY.zFront] },
    'detail-mouth': { azimuth: -8, elevation: 10, fov: 20, fit: 0.3, target: [0, FACE.y0 + 125, BODY.zFront] },
    'detail-handle': { azimuth: -62, elevation: 14, fov: 20, fit: 0.3, target: [-BODY.w / 2, HANDLE.pivotY + 20, HANDLE.pivotZ] },
    'detail-back': { azimuth: 172, elevation: 10, fov: 20, fit: 0.42, target: [0, BODY.y0 + 80, BODY.zBack] },
  },

  async build(kit, { quality = 1, onProgress = async () => {} } = {}) {
    const q = Math.max(0.25, quality)
    const sq = Math.sqrt(q)
    const plain = new kit.PatinaMaterial()
    const panels = {}
    const decor = !globalThis.__boomboxFormOnly
    let tLast = performance.now()
    const lap = (label) => { const t = performance.now(); if (globalThis.__boomboxDebug) console.info(`[boombox] ${label} ${Math.round(t - tLast)} ms`); tLast = t }
    const step = async (f, label, fn) => { await onProgress(f, label); const r = decor ? fn() : null; lap(label); return r }

    // ---- relief panels
    const BL = F.boxLayout(kit)
    const sideCell = BL.sides.right.cells[0][0], backCell = BL.sides.back.cells[0][0]
    panels.face = await step(0.02, 'faceplate: the mask', () => D.facePanel(kit, { ppmm: 3.8 * sq, seed: SEED + 1 }))
    panels.cone = await step(0.2, 'speaker cones', () => D.conePanel(kit, { ppmm: 5.2 * sq, seed: SEED + 2 }))
    panels.door = await step(0.28, 'cassette door', () => D.doorPanel(kit, { ppmm: 6 * sq, seed: SEED + 3 }))
    panels.side = await step(0.36, 'ends', () => D.sidePanel(kit, sideCell, { ppmm: 4.4 * sq, seed: SEED + 4 }))
    panels.back = await step(0.44, 'back', () => D.backPanel(kit, backCell, { ppmm: 3.2 * sq, seed: SEED + 5 }))
    const lid = F.lidSize()
    panels.lid = await step(0.52, 'top', () => D.lidPanel(kit, lid, { ppmm: 3.6 * sq, seed: SEED + 6 }))
    const hs = F.handlePanelSize()
    panels.handle = await step(0.58, 'handle', () => D.handlePanel(kit, hs, { ppmm: Math.min(3 * sq, 2040 / hs.w), seed: SEED + 7 }))
    panels.knob = await step(0.62, 'knobs', () => D.knobPanel(kit, { ppmm: 9 * sq, seed: SEED + 8 }))

    // ---- cast parts
    await onProgress(0.66, 'cabinet')
    const box = F.buildBox(kit, { side: panels.side, back: panels.back, lid: panels.lid }, { q, plain })
    lap('cabinet')
    await onProgress(0.74, 'faceplate')
    const face = F.buildFace(kit, panels.face, { q, plain })
    const cones = F.buildCones(kit, panels.cone, { q, plain })
    lap('faceplate + cones')
    await onProgress(0.82, 'deck and controls')
    const door = F.buildDoor(kit, panels.door, { q, plain })
    const nose = F.buildNose(kit, { plain, seed: SEED })
    const needle = F.buildNeedle(kit, {})
    const knobs = F.buildKnobs(kit, panels.knob, { q, plain })
    const sliders = F.buildSliders(kit, { plain })
    const keys = F.buildKeys(kit, { q, plain })
    const flanges = F.buildFlanges(kit, { plain, seed: SEED })
    const legs = F.buildFeet(kit, { plain })
    lap('controls')
    await onProgress(0.88, 'handle')
    const handle = F.buildHandle(kit, panels.handle, { q, plain })
    const heads = F.buildHandleHeads(kit, { q, plain, seed: SEED })
    const antenna = F.buildAntenna(kit, { q, plain })
    lap('handle + antenna')

    if (globalThis.__boomboxDebug) globalThis.__boomboxPanels = panels
    const object = new THREE.Group()
    object.name = 'boombox'
    const add = (o) => { object.add(o); return o }
    add(box.body); add(box.lid); box.posts.forEach(add); add(face); cones.forEach(add); add(door); add(nose); add(needle)
    knobs.forEach(add); sliders.forEach(add); add(keys); flanges.forEach(add); legs.forEach(add)
    add(handle); heads.forEach(add); add(antenna)

    await onProgress(1, 'done')
    return {
      object,
      parts: {
        body: [box.body, face, ...box.posts], lid: box.lid, speakers: cones, door, needle, knobs, sliders, keys,
        flanges: [...flanges, nose], legs, handles: handle, heads, antenna,
      },
      panels: Object.fromEntries(Object.entries(panels).filter(([, v]) => v)),
    }
  },
}
