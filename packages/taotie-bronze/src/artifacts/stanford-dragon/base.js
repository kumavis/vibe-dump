// The dragon's stand: a low rectangular bronze base built natively with the kit — four slightly
// battered side walls (buildSurface quads) each carrying a cast frieze between two bowstrings: a taotie
// at the centre of each long side flanked by kui dragons facing it, a kui pair on each short side, all on
// a fine leiwen ground; a plain cast top the dragon stands on.

import * as THREE from 'three'

export const BASE = { w0: 262, d0: 132, w1: 250, d1: 120, h: 34 } // bottom / top outline (mm), height

/** panel sizes (mm), 1:1 with the walls: width at mid height × slant height */
export function baseLayout() {
  const slantX = Math.hypot(BASE.h, (BASE.w0 - BASE.w1) / 2)
  const slantZ = Math.hypot(BASE.h, (BASE.d0 - BASE.d1) / 2)
  return {
    long: { w: (BASE.w0 + BASE.w1) / 2, h: slantZ },
    short: { w: (BASE.d0 + BASE.d1) / 2, h: slantX },
  }
}

function drawSide(kit, panel, long, seed) {
  const W = panel.width, H = panel.height
  // two bowstrings framing the frieze band
  kit.bowstrings(panel, { x: 2, y: 3.2, w: W - 4, h: 2.4 }, { count: 1, width: 1.7, height: 0.9 })
  kit.bowstrings(panel, { x: 2, y: H - 5.6, w: W - 4, h: 2.4 }, { count: 1, width: 1.7, height: 0.9 })
  const band = { x: 4, y: 6.6, w: W - 8, h: H - 13.4 }
  const ground = { pitch: 0.95, line: 0.5, depth: 0.38, cell: [4.4, 8], pairs: 0.3, maxAspect: 1.5, seed }
  if (long) {
    kit.frieze(panel, band, {
      unit: 'kui', count: 5, facing: 'centre', gap: 2.5,
      centre: { motif: 'taotie', preset: 'houmuwu-frieze', w: 66 },
      preset: 'fangyi-band', params: { seed, bandWidth: 0.32 }, ground,
    })
  } else {
    kit.frieze(panel, band, { unit: 'kui', count: 2, facing: 'centre', gap: 3, preset: 'fangyi-band', params: { seed, bandWidth: 0.32 }, ground })
  }
}

/** → THREE.Group (part 'base'); its top face is at y = BASE.h */
export async function buildBase(kit, { quality = 1, onProgress = async () => {} } = {}) {
  const L = baseLayout()
  const ppmm = 7 * Math.sqrt(Math.max(0.25, quality))
  await onProgress(0.62, 'base frieze')
  const pLong = new kit.ReliefPanel({ width: L.long.w, height: L.long.h, ppmm, seed: 1996 })
  drawSide(kit, pLong, true, 3)
  const longMap = pLong.bake()
  await onProgress(0.72, 'base frieze (ends)')
  const pShort = new kit.ReliefPanel({ width: L.short.w, height: L.short.h, ppmm, seed: 1994 })
  drawSide(kit, pShort, false, 5)
  const shortMap = pShort.bake()
  await onProgress(0.8, 'casting the base')

  const { w0, d0, w1, d1, h } = BASE
  const X0 = w0 / 2, Z0 = d0 / 2, X1 = w1 / 2, Z1 = d1 / 2
  const sides = [
    ['front', [-X0, 0, Z0], [X0, 0, Z0], [-X1, h, Z1], [X1, h, Z1], longMap],
    ['right', [X0, 0, Z0], [X0, 0, -Z0], [X1, h, Z1], [X1, h, -Z1], shortMap],
    ['back', [X0, 0, -Z0], [-X0, 0, -Z0], [X1, h, -Z1], [-X1, h, -Z1], longMap],
    ['left', [-X0, 0, -Z0], [-X0, 0, Z0], [-X1, h, -Z1], [-X1, h, Z1], shortMap],
  ]
  const mats = new Map()
  const mat = (relief) => {
    if (!mats.has(relief)) mats.set(relief, new kit.PatinaMaterial({ relief }))
    return mats.get(relief)
  }
  const g = new THREE.Group()
  g.name = 'base'
  g.userData.part = 'base'
  const density = quality >= 1 ? 1.3 : 0.8
  for (const [name, a, b, c, d, relief] of sides) {
    const geo = kit.buildSurface({ surface: kit.quadSurface(a, b, c, d), segments: { density }, relief, fade: 1.5 })
    const m = new THREE.Mesh(geo, mat(relief))
    m.name = 'base-' + name
    m.castShadow = m.receiveShadow = true
    g.add(m)
  }
  const top = kit.buildSurface({ surface: kit.quadSurface([-X1, h, Z1], [X1, h, Z1], [-X1, h, -Z1], [X1, h, -Z1]), segments: [24, 12] })
  const tm = new THREE.Mesh(top, new kit.PatinaMaterial({ cavity: 0.78 }))
  tm.name = 'base-top'
  tm.castShadow = tm.receiveShadow = true
  g.add(tm)
  return { group: g, panels: { 'base-long': longMap, 'base-short': shortMap } }
}
