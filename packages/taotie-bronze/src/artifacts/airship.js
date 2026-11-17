// A rigid airship cast as a late-Shang ritual bronze — a design-system example for the Taotie Kit,
// not a museum object. A classic 1920s–30s rigid of no particular named ship (no registration,
// flags or insignia): a 420 mm faceted hull, four cruciform fins with hinged rudders, a control car
// under the bow, four engine cars on struts, a mooring cone at the nose — carried clear of the
// plinth on a bronze stand. Units mm, Y up, front +Z, the nose toward +X, so the front view is the
// broadside profile.
//
// form:   airship/form.js — the hull profile, the faceted surface (two halves × seven ring
//         registers, the nose cap a polar patch), meridian paths for the flanges, the fin outline
// décor:  airship/decor.js — one ReliefPanel per register (both halves share it), the nose face,
//         the fins, the stand's foot band and the dragon's scales
// parts:  airship/parts.js — cars, engine cars, mooring cone, flanges, fins, the stand

import * as THREE from 'three'
import { YC, REG, hullLayout, halfSurface, noseSurface, nosePanelMap, finOutline, finHoles, FIN, FIN_RECT, CRADLE } from './airship/form.js'
import * as D from './airship/decor.js'
import * as P from './airship/parts.js'

const T = [12, 130, 0] // the hull's middle, a little low: what the hero view looks at

export default {
  id: 'airship',
  group: 'examples',
  order: 93,
  title: 'Rigid Airship',
  titleZh: '飞艇',
  type: 'rigid airship (after the 1920s–30s Zeppelins), cast as a gu laid on its side',
  date: 'c. 1930 / cast c. 1200 BC in spirit',
  period: 'Interwar aviation — dressed as late Shang, Anyang style',
  collection: 'A classic rigid airship of no particular ship: no registration, flags or insignia',
  dimensions: { l: 433, h: 200, w: 128, chosen: true, note: 'hull 420 mm long, 64 mm across — size chosen, not measured' },
  blurb:
    'A rigid airship of the great Zeppelin years — faceted hull on its girders, cruciform fins, a control car under the bow and four engine cars on struts — re-imagined as a Shang bronze moored on a dragon-wound mast. ' +
    'The hull is a gu laid on its side: its décor runs in rings, a taotie at the fullest part whose nose is the side girder, kui and cloud scrolls fore and aft, cicada blades on the tapers, a face looking forward round the mooring cone; the girders become notched flanges and the fins hooked fangyi flanges grown large. ' +
    'Its size (420 mm long) is chosen; no such bronze was ever cast.',
  defaultPatina: 'airship',
  views: {
    'three-quarter': { azimuth: 36, elevation: -4, fov: 24, fit: 0.98, target: T },
    front: { azimuth: 0, elevation: 2, fov: 24, fit: 1.0, target: [2, 100, 0] },
    back: { azimuth: 180, elevation: 2, fov: 24, fit: 1.0, target: [2, 100, 0] },
    side: { azimuth: 90, elevation: 3, fov: 24, fit: 0.5, target: [0, 108, 0] },
    top: { azimuth: 0, elevation: 82, fov: 24, fit: 0.98, target: [2, 120, 0] },
    'detail-nose': { azimuth: 62, elevation: 4, fov: 20, fit: 0.17, target: [196, YC, 0] },
    'detail-mask': { azimuth: 4, elevation: 4, fov: 20, fit: 0.24, target: [92, YC, 20] },
    'detail-tail': { azimuth: 28, elevation: 10, fov: 20, fit: 0.3, target: [-160, YC, 0] },
    'detail-gondola': { azimuth: 24, elevation: -12, fov: 20, fit: 0.17, target: [128, 120, 6] },
    'detail-stand': { azimuth: 30, elevation: 6, fov: 20, fit: 0.3, target: [CRADLE.x, 70, 0] },
  },

  async build(kit, { quality = 1, onProgress = async () => {} } = {}) {
    const q = Math.max(0.25, quality)
    const sq = Math.sqrt(q)
    const seed = 1929
    const plain = new kit.PatinaMaterial()
    const panels = {}

    // ---- layout: every panel's size before anything is drawn
    const L = hullLayout()
    L.fin = { rect: FIN_RECT, outline: finOutline(), hinge: FIN.hinge, back: FIN.back }
    const prof = P.profileTable(P.standProfile())
    const band = [prof.pts[6][2], prof.pts[8][2]] // the decorated slope of the foot (arc range)
    const rMid = (prof.at((band[0] + band[1]) / 2)[0])
    L.foot = { w: 2 * Math.PI * rMid, h: band[1] - band[0] }
    L.dragon = { w: 2 * Math.PI * P.DRAGON.r1, h: P.dragonLength() }

    // ---- relief panels
    const jobs = D.jobs(kit, L, { q, seed })
    for (let i = 0; i < jobs.length; i++) {
      const [name, fn] = jobs[i]
      await onProgress(0.02 + 0.62 * (i / jobs.length), name)
      panels[name] = fn()
    }

    const mats = new Map()
    const matFor = (relief) => {
      if (!relief) return plain
      if (!mats.has(relief)) mats.set(relief, new kit.PatinaMaterial({ relief }))
      return mats.get(relief)
    }
    const mesh = (geo, relief, part, name) => {
      const m = new THREE.Mesh(geo, matFor(relief))
      m.userData.part = part
      m.name = name
      m.castShadow = m.receiveShadow = true
      return m
    }

    // ---- the hull: two halves per ring register (seams on the keels), the nose cap round the pole
    await onProgress(0.66, 'hull')
    const body = new THREE.Group()
    body.name = 'hull'
    body.userData.part = 'body'
    const nu = Math.round(154 * sq) // per half (11 per girder bay); the nose cap takes twice as many
    for (const name of Object.keys(REG)) {
      const lay = L[name]
      const relief = panels[name] || null
      if (name === 'nose') {
        const geo = kit.buildSurface({
          surface: noseSurface(lay), segments: [2 * nu, Math.max(8, Math.round(lay.s1 * 1.4 * sq))],
          relief, fade: { u0: 0, u1: 0, v0: 1.2, v1: 0 }, panelMap: nosePanelMap(lay),
        })
        geo.computeTangents() // panel axes are fixed screen directions, not the u / v grid
        body.add(mesh(geo, relief, 'body', 'hull-nose'))
        continue
      }
      const nv = Math.max(6, Math.round(lay.h * (name === 'tail' ? 0.9 : 1.15) * sq))
      for (const side of [1, -1]) {
        const geo = kit.buildSurface({
          surface: halfSurface(lay, side), segments: [nu, nv], relief,
          fade: { u0: 1.5, u1: 1.5, v0: 1.2, v1: name === 'tail' ? 0 : 1.2 },
        })
        body.add(mesh(geo, relief, 'body', `hull-${name}-${side > 0 ? 'starboard' : 'port'}`))
      }
    }

    // ---- fins, flanges, cars
    await onProgress(0.74, 'fins')
    const fins = P.fins(kit, { q, relief: panels.fin, outline: L.fin.outline, holes: finHoles(), rect: FIN_RECT, material: matFor(panels.fin) })
    await onProgress(0.78, 'flanges')
    const flanges = P.flanges(kit, { material: plain, seed: seed + 20 })
    await onProgress(0.8, 'control car')
    const gondola = P.gondola(kit, { q, material: plain, seed: seed + 30 })
    await onProgress(0.84, 'engine cars')
    const engines = P.engineCars(kit, { q, material: plain, seed: seed + 40 })
    const mooring = P.noseAndTail(kit, { q, material: plain })

    // ---- the stand: foot and mast (a revolve, the slope decorated), the dragon, the cradle
    await onProgress(0.88, 'stand')
    const stand = new THREE.Group()
    stand.name = 'stand'
    stand.userData.part = 'stand'
    const rev = (s0, s1) => (u, v, out) => {
      const [r, y] = prof.at(s0 + (s1 - s0) * v)
      const a = 2 * Math.PI * u
      out.pos.set(CRADLE.x + r * Math.sin(a), y, r * Math.cos(a))
    }
    const nr = Math.round(240 * sq)
    const pieces = [[0, band[0], null], [band[0], band[1], panels.foot], [band[1], prof.length, null]]
    for (const [s0, s1, relief] of pieces) {
      const geo = kit.buildSurface({
        surface: rev(s0, s1), segments: [relief ? nr : Math.round(nr / 2), Math.max(4, Math.round((s1 - s0) * (relief ? 1.3 : 0.8) * sq))],
        relief, fade: { u0: 0, u1: 0, v0: 1.0, v1: 1.0 },
      })
      stand.add(mesh(geo, relief, 'stand', relief ? 'foot-band' : 'foot'))
    }
    const dgeo = kit.buildSurface({
      surface: P.dragonSurface(), segments: [Math.round(40 * sq), Math.round(L.dragon.h * 1.2 * sq)],
      relief: panels.dragon, fade: { u0: 0.5, u1: 0.5, v0: 1.5, v1: 1.5 },
    })
    stand.add(mesh(dgeo, panels.dragon, 'stand', 'dragon'))
    stand.add(P.dragonHead(kit, { q, material: plain, seed: seed + 50 }))
    stand.add(P.cradle(kit, { q, material: plain, seed: seed + 60 }))

    const object = new THREE.Group()
    object.name = 'airship'
    object.add(body, stand, gondola, ...fins, ...flanges, ...engines, ...mooring)
    await onProgress(1, 'done')
    return {
      object,
      parts: { body, fins, flanges, gondola, engines, mooring, stand },
      panels,
    }
  },
}
