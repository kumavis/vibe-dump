// A desktop computer with a CRT monitor — a generic late-1980s / early-1990s set of no particular make — cast as a
// late-Shang ritual bronze: a showpiece for the Taotie Kit, not a museum object. Size chosen: the system unit is
// 420 mm wide. Units mm, Y up, the set stands on y = 0, front +Z.
//
// form:  crt-computer/form.js — fangBody boxes (the system unit; the monitor housing built along its own axis, its
//        walls leaning in into the tube's truncated pyramid), kit.plate slabs with true openings (the bezel and its
//        screen opening, the floppy slit, the drive bay, the cover, the keyboard wedge), path flanges down every
//        arris, stubby columnLeg feet, revolved knobs and swivel foot, a swept snake for the cable, an animalHead.
// décor: crt-computer/decor.js (one panel per mould face; the composition is written at its top).

import * as THREE from 'three'
import { UNIT, MON, BEZEL, KEYB } from './crt-computer/layout.js'
import * as F from './crt-computer/form.js'
import * as D from './crt-computer/decor.js'

const SEED = 1987

export default {
  id: 'crt-computer',
  group: 'examples',
  order: 93,
  title: 'Desktop Computer with CRT Monitor',
  titleZh: '电脑',
  type: 'fang box with a mirror-faced monitor (after a generic c. 1990 desktop computer)',
  date: 'c. 1990 / cast c. 1200 BC in spirit',
  period: 'Personal computing, late 1980s–1990s — dressed as late Shang, Anyang style',
  collection: 'After the beige desktop of no particular make: system unit, 14-inch CRT, 101-key keyboard',
  accession: '',
  dimensions: { w: 420, h: 476, d: 540, chosen: true },
  blurb:
    'A desktop computer of around 1990 — a low system unit with its floppy slot and lamps, a CRT monitor on a swivel foot, a keyboard in front — cast as a Shang ritual bronze. ' +
    'Everything on it comes from the Taotie Kit: the monitor’s bezel is a taotie face whose open mouth is the screen, a plain polished bronze mirror; kui dragons meet at the floppy slot, the keys are a field of nipple bosses, notched flanges run down every arris, and the cable is a scaled snake biting the keyboard. ' +
    'Its size (a 420 mm wide unit) is chosen, not measured; no such bronze was ever cast.',
  defaultPatina: 'crt-computer',
  views: {
    'three-quarter': { azimuth: -38, elevation: 20, fov: 26, fit: 1.06 },
    front: { azimuth: 0, elevation: 8, fov: 26, fit: 1.08 },
    side: { azimuth: -90, elevation: 8, fov: 26, fit: 1.08 },
    back: { azimuth: 160, elevation: 14, fov: 26, fit: 1.08 },
    top: { azimuth: 0, elevation: 82, fov: 26, fit: 1.06 },
    'detail-face': { azimuth: -10, elevation: 6, fov: 20, fit: 0.42, target: [0, MON.yc, BEZEL.zFront] },
    'detail-unit': { azimuth: -18, elevation: 12, fov: 20, fit: 0.4, target: [-60, UNIT.y0 + 60, UNIT.zf] },
    'detail-keys': { azimuth: -14, elevation: 42, fov: 20, fit: 0.36, target: [-70, 22, KEYB.z] },
    'detail-vents': { azimuth: -62, elevation: 34, fov: 20, fit: 0.42, target: [-110, MON.yc + 60, MON.zf - 140] },
  },

  async build(kit, { quality = 1, onProgress = async () => {} } = {}) {
    const q = Math.max(0.25, quality)
    const sq = Math.sqrt(q)
    const plain = new kit.PatinaMaterial()
    const panels = {}
    let tLast = performance.now()
    const lap = (label) => { const t = performance.now(); if (globalThis.__crtDebug) console.info(`[crt] ${label} ${Math.round(t - tLast)} ms`); tLast = t }
    const step = async (f, label, fn) => { await onProgress(f, label); const r = fn(); lap(label); return r }

    // ---- relief panels
    panels.bezel = await step(0.02, 'bezel: the face', () => D.bezelPanel(kit, { ppmm: 4.8 * sq, seed: SEED + 1 }))
    panels.unitFront = await step(0.16, 'unit front', () => D.unitFrontPanel(kit, { ppmm: 4.8 * sq, seed: SEED + 2 }))
    panels.unitSide = await step(0.24, 'unit sides', () => D.unitSidePanel(kit, { ppmm: 4 * sq, seed: SEED + 3 }))
    panels.lid = await step(0.3, 'cover', () => D.unitLidPanel(kit, { ppmm: 2.4 * sq, seed: SEED + 4 }))
    panels.bay = await step(0.32, 'drive bay', () => D.bayPanel(kit, { ppmm: 6 * sq, seed: SEED + 5 }))
    const ML = F.monitorLayout(kit)
    const mon = await step(0.34, 'monitor housing', () => D.monitorPanels(kit, ML, { ppmm: 3.4 * sq, seed: SEED + 10 }))
    panels.backCap = await step(0.5, 'back cover', () => D.backCapPanel(kit, { ppmm: 3.2 * sq, seed: SEED + 6 }))
    panels.keyboard = await step(0.54, 'keyboard', () => D.keyboardPanel(kit, { ppmm: 4.2 * sq, seed: SEED + 7 }))

    // ---- cast parts
    lap('keyboard panel')
    await onProgress(0.68, 'system unit')
    const unit = F.buildUnit(kit, { front: panels.unitFront, side: panels.unitSide, back: null, lid: panels.lid, bay: panels.bay }, { q, seed: SEED, plain })
    lap('unit cast')
    await onProgress(0.76, 'monitor')
    const monitor = F.buildMonitor(kit, { top: mon.top, right: mon.right, left: mon.left, bezel: panels.bezel, backCap: panels.backCap }, { q, seed: SEED, plain })
    lap('monitor cast')
    await onProgress(0.84, 'keyboard')
    const kb = F.buildKeyboard(kit, panels.keyboard, { q, plain })

    // ---- the cable: a snake whose head bites the keyboard's back edge
    lap('keyboard cast')
    await onProgress(0.88, 'cable')
    const bite = F.keyboardTop(kb.group, kb.plate, -112, KEYB.d / 2 - 2)
    const headW = 34
    const head = kit.animalHead({
      kind: 'tiger', width: headW, projection: 0.75, droop: 30, eyeSize: 1.15, ears: true, embed: 6,
      seed: SEED + 40, quality: q, detail: 0.95 / Math.sqrt(q), material: plain, part: 'heads',
    })
    // the head looks forward (+Z) over the keyboard edge, pitched down so its jaws close on it
    head.rotation.x = (24 * Math.PI) / 180
    head.position.set(bite.x, bite.y + 4, bite.z - 14)
    const neck = new THREE.Vector3(bite.x, bite.y + 2, bite.z - 18)
    const curve = F.cablePath(neck)
    const L = curve.getLength()
    const circ = 2 * Math.PI * F.CABLE_R
    panels.cable = D.cablePanel(kit, L, circ, { ppmm: Math.min(3.6 * sq, 2040 / L), seed: SEED + 8 })
    const cable = F.buildCable(kit, curve, panels.cable, { q, plain })

    lap('cable + head')
    if (globalThis.__crtDebug) globalThis.__crtPanels = panels
    const object = new THREE.Group()
    object.name = 'crt-computer'
    const add = (o) => { object.add(o); return o }
    add(unit.body); add(unit.lid)
    unit.legs.forEach(add); unit.flanges.forEach(add); unit.drives.forEach(add); unit.buttons.forEach(add)
    add(monitor.group)
    add(kb.group)
    add(cable)
    add(head)

    await onProgress(1, 'done')
    return {
      object,
      parts: {
        body: [unit.body, monitor.housing, monitor.backCap], lid: unit.lid, legs: unit.legs, flanges: [...unit.flanges, ...monitor.flanges],
        drives: unit.drives, buttons: unit.buttons, bezel: monitor.bezel, screen: monitor.screen, knobs: monitor.knobs, foot: monitor.foot,
        keyboard: kb.group, cable, heads: [head],
      },
      panels,
    }
  },
}
