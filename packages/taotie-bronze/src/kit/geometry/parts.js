// STATUS: first pass — columnar leg, upright loop handle, ring foot. Keep the
// signatures; refine shapes (cast-on taotie on leg tops, grooved handles…).
//
// These are L3: real sculpture, never a height map. Each returns a Mesh with
// userData.part set so tools/metrics.mjs can measure it against references.

import * as THREE from 'three'
import { lathe } from './lathe.js'

/**
 * Columnar leg (ding): slightly waisted, swelling a little under the body
 * where it was cast on. Stands on y = 0, axis = Y.
 */
export function columnarLeg({ height, radius, swell = 0.12, waist = 0.06, material, part = 'legs', density = 0.6 }) {
  const r = radius
  const h = height
  return lathe({
    profile: [
      [0, 0], [r * 1.03, 0, 'corner'], [r, h * 0.06], [r * (1 - waist), h * 0.45], [r * (1 - waist * 0.4), h * 0.78],
      [r * (1 + swell), h * 0.96], [r * (1 + swell), h, 'corner'], [0, h],
    ],
    material,
    part,
    segments: { density },
  })
}

/**
 * Upright loop handle (ding "ears"): an arch of flat bar standing on the rim.
 * Built in the XY plane, centred on x = 0, standing on y = 0, thickness along Z.
 */
export function loopHandle({ width, height, bar, thickness, material, part = 'handles' }) {
  const W = width / 2
  const R = Math.min(W, height) * 0.45 // corner radius of the arch
  const ri = Math.max(0.5, R - bar)
  const s = new THREE.Shape()
  s.moveTo(-W, 0)
  s.lineTo(-W, height - R)
  s.quadraticCurveTo(-W, height, -W + R, height)
  s.lineTo(W - R, height)
  s.quadraticCurveTo(W, height, W, height - R)
  s.lineTo(W, 0)
  s.lineTo(W - bar, 0)
  s.lineTo(W - bar, height - bar - ri)
  s.quadraticCurveTo(W - bar, height - bar, W - bar - ri, height - bar)
  s.lineTo(-W + bar + ri, height - bar)
  s.quadraticCurveTo(-W + bar, height - bar, -W + bar, height - bar - ri)
  s.lineTo(-W + bar, 0)
  s.closePath()
  const bevel = Math.min(1.5, thickness * 0.15)
  const geo = new THREE.ExtrudeGeometry(s, {
    depth: Math.max(0.1, thickness - 2 * bevel),
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 2,
    curveSegments: 10,
  })
  geo.translate(0, 0, -(thickness - 2 * bevel) / 2)
  geo.computeBoundingBox()
  const m = new THREE.Mesh(geo, material)
  m.userData.part = part
  m.castShadow = m.receiveShadow = true
  return m
}

/** Ring foot (gui, zun, gu): a short flared cylinder of wall thickness `thickness`. */
export function ringFoot({ radius, height, thickness = 5, flare = 0.08, material, part = 'foot', density = 0.5 }) {
  return lathe({
    profile: [[radius, 0], [radius * (1 - flare * 0.7), height * 0.6], [radius * (1 - flare), height]],
    thickness,
    rims: ['v0', 'v1'],
    material,
    part,
    segments: { density },
  })
}
