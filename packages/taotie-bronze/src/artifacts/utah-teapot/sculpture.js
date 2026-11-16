// utah-teapot — L3 sculpture: notched flanges on the ±Z axes (body and lid: edge-on from the
// front, so the canonical silhouette is untouched; none crosses the spout or the handle) and the
// beast head biting the handle's upper junction.

import * as THREE from 'three'
import { BODY, LIDC, ARC } from './shell.js'
import { revSurface, chainPoint } from './form.js'

/** a kit.flange path along a chain meridian at azimuth az between arcs a0 → a1 (root on the wall) */
function meridianPath(table, az, a0, a1, step = 1.0) {
  const surf = revSurface(table, { az0: az - 1, az1: az + 1, a0: 0, a1: table.length })
  const pts = [], nrm = []
  const n = [0, 0, 0]
  for (let a = a0; a <= a1 + 1e-6; a += step) {
    const p = chainPoint(table, az, a)
    surf.normal(0.5, a / table.length, n)
    pts.push(new THREE.Vector3(p[0], p[1], p[2]))
    nrm.push(new THREE.Vector3(n[0], n[1], n[2]))
  }
  const cum = [0]
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + pts[i].distanceTo(pts[i - 1]))
  const L = cum[cum.length - 1]
  const tmp = { p: new THREE.Vector3(), n: new THREE.Vector3(), d: new THREE.Vector3(), b: new THREE.Vector3() }
  return {
    isPath: true, length: L,
    frame(s) {
      let i = 1
      while (i < pts.length - 1 && cum[i] < s) i++
      const f = (s - cum[i - 1]) / Math.max(1e-9, cum[i] - cum[i - 1])
      tmp.p.lerpVectors(pts[i - 1], pts[i], f)
      tmp.d.subVectors(pts[i], pts[i - 1]).normalize()
      const o = nrm[i - 1].clone().lerp(nrm[i], f)
      tmp.n.copy(o).addScaledVector(tmp.d, -o.dot(tmp.d)).normalize()
      tmp.b.crossVectors(tmp.d, tmp.n)
      return tmp
    },
  }
}

export function sculpture(kit, { q = 1, seed = 1975, material }) {
  const flanges = []
  // body: one notched flange on each broad face's axis, over the taotie's nose: low band → shoulder
  const a0 = ARC.belly[0] + 1.2, a1 = ARC.shoulder[1] - 6.5
  for (const [i, az] of [[0, 0], [1, 180]]) {
    flanges.push(kit.flange({
      path: meridianPath(BODY, az, a0, a1), height: 5.2, thickness: 4.2, embed: 2.4, taper: 3, bevel: 0.6, waver: 0.35,
      notches: { shape: 'T', pitch: 9.5, depth: 0.42, width: 2.2 }, seed: seed + 20 + i, material, part: 'flanges',
    }))
  }
  // lid: short low flanges on the same axes, between the cicada blades
  for (const [i, az] of [[0, 0], [1, 180]]) {
    flanges.push(kit.flange({
      path: meridianPath(LIDC, az, 8, 37.5, 0.8), height: 2.8, thickness: 3.0, embed: 1.6, taper: 3, bevel: 0.45, waver: 0.3,
      notches: { shape: 'square', pitch: 7, depth: 0.45, width: 1.8 }, seed: seed + 30 + i, material, part: 'flanges',
    }))
  }

  // the head biting the handle's upper junction: on the shoulder wall over the handle root, looking out (−X)
  const heads = []
  const head = kit.animalHead({
    kind: 'ram', width: 23, projection: 0.5, droop: 36, hornSize: 0.95, hornCurl: 0.6, eyeSize: 1.1, ears: true,
    embed: 4, seed: seed + 40, quality: q, detail: 0.5 / Math.sqrt(q), material, part: 'heads',
  })
  const az = -90, y = 80.5
  const a = BODY.arcAtY(y, ARC.belly[0])
  const surf = revSurface(BODY, { az0: az - 1, az1: az + 1, a0: 0, a1: BODY.length })
  const p = chainPoint(BODY, az, a), n = surf.normal(0.5, a / BODY.length, [0, 0, 0])
  const radial = new THREE.Vector3(-1, 0, 0)
  const zAxis = radial.clone().lerp(new THREE.Vector3(...n), 0.45).normalize()
  const b = new THREE.Vector3(0, 0, 1) // tangential (the wall's horizontal at −X)
  zAxis.applyAxisAngle(b, (12 * Math.PI) / 180) // pitch down a little over the handle
  const yAxis = new THREE.Vector3().crossVectors(zAxis, b).normalize()
  if (yAxis.y < 0) yAxis.negate()
  const xAxis = new THREE.Vector3().crossVectors(yAxis, zAxis).normalize()
  const m = new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis).setPosition(p[0], p[1], p[2])
  head.geometry = head.geometry.clone().applyMatrix4(m)
  head.geometry.computeBoundingBox()
  head.geometry.computeBoundingSphere()
  heads.push(head)
  return { flanges, heads }
}
