// The Stanford dragon — the patina half of the kit on a mesh it did not make.
//
// Not a museum object: the Stanford Computer Graphics Laboratory's 1996 range-scan reconstruction of a
// small carved dragon (The Stanford 3D Scanning Repository; reference/stanford-dragon/SOURCES.md for the
// terms), here its decimated "res2" mesh (≈ 201 k triangles, committed as a 1.27 MB quantised binary by
// tools/classics.mjs). The scan carries its own sculpted scales, ridges and whiskers, so no relief is
// projected onto the animal: kit.meshCavity measures how recessed every vertex is (voxel obscurance at
// three radii + the scan's fine curvature), and PatinaMaterial reads it the way it reads a relief panel's
// cavity — corrosion packed into every scale groove, metal rubbed bare on the crests, crust islands on the
// up-facing back. It stands on a low bronze base built natively with the kit (stanford-dragon/base.js)
// whose friezes show the relief half. Units mm, Y up, the head toward +X; front (+Z) shows the profile.

import * as THREE from 'three'
import dragonUrl from './stanford-dragon/dragon.bin?url'
import { buildBase, BASE } from './stanford-dragon/base.js'

const LENGTH = 220 // the dragon, nose to tail (mm)
const TOP = BASE.h

export default {
  id: 'stanford-dragon',
  group: 'classics',
  order: 61,
  title: 'The Stanford Dragon',
  type: 'computer-graphics test model, recast in bronze',
  date: 'Range scan 1996 · recast 2026',
  period: 'Computer-graphics test model (3D scan)',
  findspot: '',
  collection: 'Mesh: Stanford Computer Graphics Laboratory, The Stanford 3D Scanning Repository',
  accession: '',
  dimensions: { h: 190, w: 262, d: 132 },
  blurb:
    'The Stanford dragon is a 3D scan of a small carved dragon, reconstructed in 1996 by the Stanford Computer Graphics Laboratory and given away for research through The Stanford 3D Scanning Repository (free to use and redistribute with credit, not for commercial use). ' +
    'The scales and whiskers are the scan’s own; the Taotie Kit measured how recessed every point is and let its burial patina settle by that — malachite in each groove, metal rubbed bare on the crests — and cast the base with its kui and taotie friezes.',
  defaultPatina: 'stanford-dragon',
  views: {
    front: { azimuth: 0, elevation: 6, fov: 26, fit: 1.08 },
    'three-quarter': { azimuth: 38, elevation: 14, fov: 26, fit: 1.08 },
    back: { azimuth: 180, elevation: 8, fov: 26, fit: 1.08 },
    side: { azimuth: 90, elevation: 6, fov: 26, fit: 1.1 },
    top: { azimuth: 0, elevation: 82, fov: 26, fit: 1.05 },
    'detail-head': { azimuth: 30, elevation: 8, fov: 16, fit: 0.32, target: [78, TOP + 105, 8] },
    'zz-base': { azimuth: 8, elevation: 4, fov: 16, fit: 0.3, target: [40, 18, 66] },
    'detail-scales': { azimuth: -20, elevation: 30, fov: 16, fit: 0.3, target: [-30, TOP + 70, 0] },
  },

  async build(kit, { quality = 1, onProgress = async () => {} } = {}) {
    const q = Math.max(0.25, quality)
    await onProgress(0.02, 'loading the scan')
    const res = await fetch(dragonUrl)
    if (!res.ok) throw new Error('stanford-dragon: mesh asset ' + res.status)
    let m = kit.decodeMesh(await res.arrayBuffer())
    await onProgress(0.12, 'orienting')
    // the scan: metres, Y up, head toward −X → mm, head toward +X, centred on the base, feet on its top
    const b0 = kit.meshBounds(m)
    const k = LENGTH / b0.size[0]
    const P = m.positions
    for (let i = 0; i < P.length; i += 3) {
      const x = (P[i] - b0.center[0]) * k, y = (P[i + 1] - b0.min[1]) * k, z = (P[i + 2] - b0.center[2]) * k
      P[i] = -x; P[i + 1] = y; P[i + 2] = -z // 180° about Y
    }
    if (q < 0.75) {
      m = kit.decimateMesh(m, 1.1)
      await onProgress(0.2, 'preview mesh')
    }
    seat(m)
    await onProgress(0.25, 'normals')
    kit.orientFaces(m)
    kit.vertexNormals(m)
    await onProgress(0.32, 'cavity')
    const cavity = kit.meshCavity(m, { voxel: q >= 1 ? 1.5 : 2.2, obscurance: 1.3, curvature: 1.5, gamma: 1.3 })
    await onProgress(0.55, 'dressing')
    const dragon = kit.skin(m, { cavity, part: 'body' })
    // the decimated scan has a few pin-holes: show the inside skin through them, not the background
    for (const mat of dragon.material) mat.side = THREE.DoubleSide
    if (typeof location !== 'undefined' && /cavdebug/.test(location.search)) { // TEMP-DEBUG
      const c = dragon.geometry.getAttribute('cavity'), col = new Float32Array(c.count * 3)
      for (let i = 0; i < c.count; i++) { const v = c.getX(i); col[i * 3] = v < 0.72 ? 1 - v / 0.72 : 0; col[i * 3 + 1] = 0.3; col[i * 3 + 2] = v > 0.72 ? (v - 0.72) / 0.28 : 0 }
      dragon.geometry.setAttribute('color', new THREE.BufferAttribute(col, 3))
      dragon.material = new THREE.MeshBasicMaterial({ vertexColors: true })
    }
    dragon.name = 'stanford-dragon'
    dragon.position.y = TOP

    const { group: base, panels } = await buildBase(kit, { quality: q, onProgress })
    const object = new THREE.Group()
    object.name = 'stanford-dragon'
    object.add(base)
    object.add(dragon)
    await onProgress(1, 'done')
    return { object, parts: { body: dragon, base }, panels }
  },
}

/** Sit the scan on y = 0 by its feet: the lowest points (the four feet and the tail tip) define the contact;
 *  a 0.4 mm sink so no foot hovers over the base after quantisation. */
function seat(m) {
  const P = m.positions
  let minY = Infinity
  for (let i = 1; i < P.length; i += 3) minY = Math.min(minY, P[i])
  for (let i = 1; i < P.length; i += 3) P[i] -= minY + 0.4
}
