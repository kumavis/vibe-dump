// THROWAWAY STUDIES for the lathe / flange / heads modules — NOT registered in
// index.js (built through .work/lathe's private registry). Profiles measured
// off the Met's CC0 photographs of gu 1985.214.4 (H 31.1 cm) and zun 43.25.1
// (H 40 cm, rim 35.2), scaled to the published heights.

import * as THREE from 'three'

// ------------------------------------------------------------------ gu 1985.214.4

const GU_H = 311
const GU_PROFILE = [
  [43.5, 0, 'C'], [43.5, 18.5, 'C', 'ringTop'], [40.5, 19.6, 'C', 'footBottom'], [37, 27], [33.5, 35], [25.8, 51], [20.3, 67], [18.4, 79, 'C', 'footTop'],
  [16.9, 80.2, 'C'], [16.9, 94, 'C', 'collarTop'], [21, 95.5, 'C', 'drumBottom'], [21.4, 118], [21, 140, 'C', 'drumTop'], [16.6, 141.5, 'C', 'neckBottom'],
  [16.4, 160], [17.2, 185], [18.8, 205], [21.9, 236], [27, 255], [35, 270], [43.7, 286], [57, 297.5], [71, 305.5], [85, 311, 'L'],
]

const gu = {
  id: 'study-gu',
  order: 1,
  title: 'Study: gu (lathe)',
  titleZh: '觚 研究',
  type: 'gu',
  date: 'study',
  period: 'Late Shang (style)',
  findspot: 'Procedural study',
  collection: 'Taotie Kit',
  accession: 'STUDY-GU',
  dimensions: { h: GU_H, w: 170, d: 170 },
  blurb: 'Lathe/flange study after Met 1985.214.4.',
  defaultPatina: 'olive-museum',
  views: {
    front: { azimuth: 0, elevation: 4, fov: 26, fit: 1.08 },
    'three-quarter': { azimuth: 35, elevation: 14, fov: 26, fit: 1.08 },
    side: { azimuth: 45, elevation: 3, fov: 26, fit: 1.08 },
    detail: { azimuth: 30, elevation: 8, fov: 18, fit: 0.36, target: [0, 85, 0] },
    waist: { azimuth: 20, elevation: 6, fov: 16, fit: 0.2, target: [0, 118, 0] },
    foot: { azimuth: 0, elevation: 10, fov: 18, fit: 0.3, target: [0, 50, 0] },
  },
  async build(kit, { quality = 1, onProgress = async () => {} } = {}) {
    const ppmm = 5 * quality
    const profile = new kit.Profile(GU_PROFILE, { ridges: [{ y: 87.2, count: 3, width: 1.8, height: 0.9, spacing: 3.6 }] })
    const cache = {}
    const once = (key, fn) => (cache[key] ??= fn())
    await onProgress(0.05, 'panels')
    const body = kit.lathe({
      profile,
      wall: 2.4,
      lip: { thickness: 3.2, shape: 'round' },
      floor: { y: 100, thickness: 3.5 },
      foot: { wall: 2.6 },
      sectors: 4,
      density: 1.2,
      quality,
      registers: {
        foot: { from: 'footBottom', to: 'footTop', sectors: { count: 2, center: 0 }, relief: (k, size) => once('foot', () => {
          const p = new kit.ReliefPanel({ width: size.width, height: size.height, ppmm, seed: 11 })
          kit.drawMotif(p, 'taotie', { x: 2, y: 3, w: size.width - 4, h: size.height - 5 }, { nose: 'flange' }, { preset: 'gu-foot' })
          return p.bake()
        }) },
        waist: { from: 'drumBottom', to: 'drumTop', sectors: { count: 2, center: 0 }, relief: (k, size) => once('waist', () => {
          const p = new kit.ReliefPanel({ width: size.width, height: size.height, ppmm, seed: 12 })
          kit.drawMotif(p, 'taotie', { x: 2, y: 2, w: size.width - 4, h: size.height - 4 }, { nose: 'flange' }, { preset: 'gu-waist' })
          return p.bake()
        }) },
        trumpet: { y0: 165, y1: 296, sectors: 4, relief: (k, size) => once('trumpet', () => {
          const p = new kit.ReliefPanel({ width: size.width, height: size.height, ppmm: Math.min(ppmm, 4), seed: 13 })
          kit.drawMotif(p, 'blade', { x: 1.5, y: 1, w: size.width - 3, h: size.height - 2 }, {}, { preset: 'gu-trumpet' })
          return p.bake()
        }) },
      },
      holes: [{ shape: 'cross', azimuth: 45, y: 73, arm: 3.6, width: 2 }, { shape: 'cross', azimuth: 225, y: 73, arm: 3.6, width: 2 }],
      tolerance: { seed: 7, ovality: 0.006, rim: 0.004, lean: 0.3 },
    })
    await onProgress(0.7, 'flanges')
    const info = body.userData.lathe
    // waist: ladder flanges on the drum, overhanging both ends of it
    const waist = kit.latheFlanges(body, {
      azimuths: [0, 90, 180, 270], ranges: ['waist'], gap: 0.3,
      height: 7.3, thickness: 5.4, notches: { shape: 'score', pitch: 4.2, depth: 0.22, width: 1.4 },
      ends: { start: { type: 'step', length: 3.5 }, end: { type: 'step', length: 3.5 } },
    })
    // foot: the crest runs nearly straight while the wall flares, then curls out into a spur
    const fr = info.range('foot')
    const foot = kit.latheFlanges(body, {
      azimuths: [0, 90, 180, 270], ranges: [{ range: { s0: fr[0] + 6, s1: fr[1] - 0.5 } }], gap: 0,
      height: 8,
      thickness: 5, notches: { shape: 'score', pitch: 4.6, depth: 0.22, width: 1.5 },
      ends: { start: { type: 'spur', length: 6, height: 18, sweep: 16 }, end: { type: 'step', length: 2.5 } },
    })
    const flanges = [...waist, ...foot]
    for (const f of flanges) body.add(f)
    await onProgress(1, 'done')
    return { object: body, parts: { body, flanges } }
  },
}

// ------------------------------------------------------------------ zun 43.25.1

const ZUN_PROFILE = [
  [106, 0, 'C'], [105, 3, 'C'], [101.5, 30], [98, 50], [86, 95], [77, 130], [72, 145, 'C', 'footTop'],
  [70, 150, 'C', 'bellyBottom'], [86, 153], [92.5, 159], [94.5, 175], [95.5, 205], [95, 238, 'C', 'carination'],
  [84, 256], [72.5, 280], [68, 289, 'C', 'neckBase'], [68.5, 297], [76, 320], [100, 350], [132, 375], [158, 392], [176, 401, 'L'],
]

const zun = {
  id: 'study-zun',
  order: 2,
  title: 'Study: zun (lathe + heads)',
  titleZh: '尊 研究',
  type: 'zun',
  date: 'study',
  period: 'Late Shang (style)',
  findspot: 'Procedural study',
  collection: 'Taotie Kit',
  accession: 'STUDY-ZUN',
  dimensions: { h: 401, w: 352, d: 352 },
  blurb: 'Lathe/flange/heads study after Met 43.25.1.',
  defaultPatina: 'olive-museum',
  views: {
    front: { azimuth: 0, elevation: 4, fov: 26, fit: 1.08 },
    'three-quarter': { azimuth: 30, elevation: 14, fov: 26, fit: 1.08 },
    detail: { azimuth: 20, elevation: 14, fov: 18, fit: 0.33, target: [0, 250, 60] },
    foot: { azimuth: 0, elevation: 8, fov: 20, fit: 0.42, target: [0, 120, 0] },
  },
  async build(kit, { quality = 1, onProgress = async () => {} } = {}) {
    const ppmm = 4 * quality
    const profile = new kit.Profile(ZUN_PROFILE, { ridges: [{ y: 291.5, count: 1, width: 2.4, height: 1.1 }] })
    const cache = {}
    const once = (key, fn) => (cache[key] ??= fn())
    await onProgress(0.05, 'panels')
    const body = kit.lathe({
      profile,
      wall: 3.4,
      lip: { thickness: 4.6, shape: 'round' },
      floor: { y: 152, thickness: 4 },
      foot: { wall: 3.4 },
      sectors: 4,
      density: 0.9,
      quality,
      registers: {
        foot: { y0: 56, y1: 140, sectors: { count: 2, center: 0 }, relief: (k, size) => once('foot', () => {
          const p = new kit.ReliefPanel({ width: size.width, height: size.height, ppmm, seed: 21 })
          kit.drawMotif(p, 'taotie', { x: 3, y: 3, w: size.width - 6, h: size.height - 6 }, { nose: 'flange' }, { preset: 'zun-foot' })
          return p.bake()
        }) },
        belly: { y0: 157, y1: 236.5, sectors: { count: 2, center: 0 }, relief: (k, size) => once('belly', () => {
          const p = new kit.ReliefPanel({ width: size.width, height: size.height, ppmm, seed: 22 })
          kit.drawMotif(p, 'taotie', { x: 3, y: 3, w: size.width - 6, h: size.height - 6 }, { nose: 'flange' }, { preset: 'zun-belly' })
          return p.bake()
        }) },
        shoulder: { y0: 240, y1: 287, sectors: { count: 4, center: 0 }, relief: (k, size) => once('shoulder', () => {
          const p = new kit.ReliefPanel({ width: size.width, height: size.height, ppmm, seed: 23 })
          kit.frieze(p, { x: 2, y: 3, w: size.width - 4, h: size.height - 6 }, { unit: 'kui', count: 2, facing: 'centre' })
          return p.bake()
        }) },
        trumpet: { y0: 300, y1: 385, sectors: { count: 8, center: 0 }, relief: (k, size) => once('trumpet', () => {
          const p = new kit.ReliefPanel({ width: size.width, height: size.height, ppmm: Math.min(ppmm, 3.5), seed: 24 })
          kit.drawMotif(p, 'blade', { x: 1.5, y: 1, w: size.width - 3, h: size.height - 2 }, {}, { preset: 'zun-neck' })
          return p.bake()
        }) },
      },
      holes: [{ shape: 'cross', azimuth: 45, y: 147.5, arm: 6, width: 2.8 }, { shape: 'cross', azimuth: 225, y: 147.5, arm: 6, width: 2.8 }],
      tolerance: { seed: 4, ovality: 0.01, rim: 0.008, lean: 0.4 },
    })
    await onProgress(0.7, 'flanges, heads')
    const belly = kit.latheFlanges(body, {
      azimuths: [0, 90, 180, 270], ranges: [{ range: { y0: 160, y1: 237 } }], gap: 0,
      height: 12, thickness: 7, notches: { shape: 'T', pitch: 16, depth: 0.36, width: 3.6 },
      ends: { start: { type: 'step', length: 5 }, end: { type: 'step', length: 3 } },
    })
    const foot = kit.latheFlanges(body, {
      azimuths: [0, 90, 180, 270], ranges: [{ range: { y0: 58, y1: 139 } }], gap: 0,
      height: 7, thickness: 5, notches: { shape: 'T', pitch: 14, depth: 0.38, width: 3 },
      ends: { start: 'taper' },
    })
    const flanges = [...belly, ...foot]
    for (const f of flanges) body.add(f)
    const heads = []
    for (const az of [0, 90, 180, 270]) {
      const h = kit.animalHead({ kind: 'bovine', width: 32, projection: 0.45, droop: 55, hornSize: 0.9, hornCurl: 0.4, embed: 6, seed: 3, quality })
      kit.mountOnLathe(body, h, { azimuth: az, y: 264, pitch: 0, follow: 1, lift: -1 })
      body.add(h)
      heads.push(h)
    }
    await onProgress(1, 'done')
    return { object: body, parts: { body, flanges, heads } }
  },
}

export { gu as studyGu, zun as studyZun }
export default gu
void THREE
