// The Utah teapot (Martin Newell, University of Utah, 1975) cast as a late-Shang ritual bronze —
// a showpiece for the Taotie Kit, not a museum object. The form is Newell's 32 Bézier patches
// exactly (Blinn's squashed proportions, the famous rendering), scaled to 240 mm spout tip →
// handle back (chosen, not measured); everything on the surface comes from the kit.
// Units mm, Y up, the pot on y = 0, front +Z: the spout points +X, the handle −X, so the
// default front view is the canonical profile with the spout on the right.
//
// form:  utah-teapot/newell.js (the data, from three.js TeapotGeometry, MIT) → utah-teapot/form.js
//        (one continuous surface per register over the exact patches) → utah-teapot/shell.js
//        (kit.buildSurface geometries: body halves × registers, inner wall, lid, knob, spout tube,
//        handle tube). reference/utah-teapot/check-form.mjs proves it against TeapotGeometry.
// décor: utah-teapot/decor.js (one panel per register; the two broad faces share each panel).
// sculpture: utah-teapot/sculpture.js (flanges on the ±Z axes, the ram's head crowning the handle).

import * as THREE from 'three'
import { buildShell, layout } from './utah-teapot/shell.js'
import * as D from './utah-teapot/decor.js'
import * as SC from './utah-teapot/sculpture.js'

export default {
  id: 'utah-teapot',
  group: 'examples',
  order: 90,
  title: 'Utah Teapot',
  titleZh: '犹他茶壶',
  type: 'he 盉 (after Newell, 1975)',
  date: '1975 / cast c. 1200 BC in spirit',
  period: 'Computer graphics, University of Utah — dressed as late Shang, Anyang style',
  findspot: 'Martin Newell’s 32 Bézier patches (1975), via three.js TeapotGeometry',
  collection: 'Computer History Museum holds the original Melitta pot',
  accession: '',
  dimensions: { w: 240, h: 117, d: 150, chosen: true },
  blurb:
    'The Utah teapot — Martin Newell’s 1975 model of his Melitta kettle, the most rendered object in computer graphics — exact to his Bézier patches in Blinn’s squashed proportions, re-imagined as a Shang pouring vessel. ' +
    'Every band, mask, flange, beast head and crust on it comes from the Taotie Kit: a taotie on each broad face, kui dragons on the shoulder, cicada blades round the lid, a masked spout and a handle crowned by a ram’s head. ' +
    'Its size (240 mm from spout to handle) is chosen, not measured; no such bronze was ever cast.',
  defaultPatina: 'utah-teapot',
  views: {
    front: { azimuth: 0, elevation: 6, fov: 24, fit: 1.12 },
    'three-quarter': { azimuth: 35, elevation: 22, fov: 24, fit: 1.1 },
    back: { azimuth: 180, elevation: 6, fov: 24, fit: 1.12 },
    top: { azimuth: 0, elevation: 80, fov: 24, fit: 1.1 },
    side: { azimuth: 90, elevation: 8, fov: 24, fit: 1.12 },
    'detail-mask': { azimuth: 8, elevation: 6, fov: 20, fit: 0.42, target: [0, 45, 60] },
    'detail-spout': { azimuth: 55, elevation: 22, fov: 20, fit: 0.42, target: [85, 62, 0] },
    'detail-handle': { azimuth: -55, elevation: 18, fov: 20, fit: 0.45, target: [-80, 66, 0] },
    'detail-head': { azimuth: -115, elevation: 34, fov: 20, fit: 0.26, target: [-68, 86, 0] },
  },

  async build(kit, { quality = 1, onProgress = async () => {} } = {}) {
    const q = Math.max(0.25, quality)
    const seed = 1975
    const L = layout()
    const plain = new kit.PatinaMaterial()
    const inner = new kit.PatinaMaterial({ interior: 1 })
    const bridge = new kit.PatinaMaterial({ interior: 1 })
    bridge.side = THREE.DoubleSide
    const panels = {}

    // ---- relief panels, one per register (front and back faces share each)
    const jobs = D.jobs(kit, L, { q, seed })
    for (let i = 0; i < jobs.length; i++) {
      const [name, fn] = jobs[i]
      await onProgress(0.02 + 0.7 * (i / jobs.length), name)
      panels[name] = fn()
    }

    // ---- the cast shell
    await onProgress(0.74, 'casting')
    const shell = buildShell({ q, reliefs: panels, L })
    const object = new THREE.Group()
    object.name = 'utah-teapot'
    const groups = {}
    const mats = new Map()
    const matFor = (relief) => {
      if (!relief) return plain
      if (!mats.has(relief)) mats.set(relief, new kit.PatinaMaterial({ relief }))
      return mats.get(relief)
    }
    for (const s of shell) {
      const m = new THREE.Mesh(s.geo, s.kind === 'inner' ? inner : s.kind === 'bridge' ? bridge : matFor(s.relief))
      m.name = s.name
      m.userData.part = s.part
      m.castShadow = m.receiveShadow = true
      if (!groups[s.part]) {
        groups[s.part] = new THREE.Group()
        groups[s.part].userData.part = s.part
        groups[s.part].name = s.part
        object.add(groups[s.part])
      }
      groups[s.part].add(m)
    }

    // ---- sculpture: flanges, the handle's ram head
    await onProgress(0.86, 'flanges and head')
    const sc = SC.sculpture(kit, { q, seed, material: plain })
    for (const f of sc.flanges) object.add(f)
    for (const h of sc.heads) object.add(h)

    await onProgress(1, 'done')
    return {
      object,
      parts: { body: groups.body, lid: groups.lid, spout: groups.spout, handles: groups.handles, flanges: sc.flanges, heads: sc.heads },
      panels,
    }
  },
}
