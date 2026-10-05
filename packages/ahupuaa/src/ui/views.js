// Where the camera stands for each tour stop, worked out from wherever the
// generator put things. Yaw is the compass side the camera sits on, seen from
// its target (0 = south of it, looking north).

import * as THREE from 'three'
import { windVector, Y_PER_M } from '../config.js'
import { REGIMES } from '../weather/sim.js'
import { astronomy } from '../render/sky.js'

const yawFrom = (dx, dz) => Math.atan2(dx, dz) // camera offset direction → yaw
const azimuthYaw = (deg) => {
  // camera LOOKING toward compass `deg` (0 = north)
  const r = (deg * Math.PI) / 180
  const lx = Math.sin(r)
  const lz = -Math.cos(r)
  return Math.atan2(-lx, -lz)
}

export function buildViews(app) {
  const meta = app.island.meta
  const s = meta.sites
  const T = app.terrain
  const model = meta.ahupuaa.find((a) => a.id === s.model) || meta.ahupuaa[0]
  const [mx, mz] = model.mouth
  // mauka direction: from the stream mouth up toward the summit
  let ux = model.topX - mx
  let uz = model.topZ - mz
  const ul = Math.hypot(ux, uz) || 1
  ux /= ul
  uz /= ul
  const makaiYaw = yawFrom(-ux, -uz) // camera out to sea, looking mauka
  const maukaYaw = yawFrom(ux, uz) // camera inland, looking makai
  const at = (x, z) => new THREE.Vector3(x, Math.max(0, T.heightAt(x, z)), z)
  const trunk = model.trunk || []
  const trunkAt = (frac) => {
    if (!trunk.length) return [mx + ux * ul * frac, mz + uz * ul * frac]
    const p = trunk[Math.min(trunk.length - 1, Math.floor(frac * (trunk.length - 1)))]
    return [p[0], p[1]]
  }
  const trunkAtHeight = (m) => {
    let best = trunk[0]
    for (const p of trunk) if (Math.abs(p[2] - m) < Math.abs(best[2] - m)) best = p
    return best ? [best[0], best[1]] : trunkAt(0.6)
  }
  const village = s.villages.find((v) => v.model) || s.villages[0]
  const loi = s.loi.find((l) => l.model) || s.loi[0]
  const heiau = s.heiau.find((h) => h.model) || s.heiau[0]
  const pond = s.ponds.find((p) => p.model) || s.ponds[0]
  const beach = s.canoes.find((c) => c.village === model.id) || s.canoes[0]
  const koa = s.koa.find((k) => k.id === model.id) || s.koa[0]
  // a break near home, but not one hard against a fishpond wall
  const clearOfPonds = (q) => Math.min(...s.ponds.map((p) => Math.hypot(p.cx - q.x, p.cz - q.z)), 99)
  const surfs = [...s.surf].sort((a, b) => Math.hypot(a.x - mx, a.z - mz) - Math.max(0, 8 - clearOfPonds(a)) * 20 - (Math.hypot(b.x - mx, b.z - mz) - Math.max(0, 8 - clearOfPonds(b)) * 20))
  const surf = surfs[0]
  const alii = s.alii || village
  // the ahu at the edge of the model ahupuaʻa: windward, so looking east at
  // dusk means looking out to sea, where Makaliʻi rises
  const ahu = [...meta.ahu].filter((a) => a.a === model.id || a.b === model.id).sort((a, b) => Math.hypot(a.x - mx, a.z - mz) - Math.hypot(b.x - mx, b.z - mz))[0] || meta.ahu[0]
  const [cx, cz] = meta.center

  // the kula field system: the most strongly marked field cell in the leeward
  const kula = (() => {
    const reg = app.island.data.region
    const N = Math.sqrt(reg.length / 4)
    let best = null
    let bs = -1
    for (let j = 0; j < N; j += 4) {
      for (let i = 0; i < N; i += 4) {
        const v = reg[(j * N + i) * 4 + 3]
        if (v > bs) {
          // prefer the middle of big field areas
          let sum = 0
          for (let dj = -8; dj <= 8; dj += 4) for (let di = -8; di <= 8; di += 4) sum += reg[(Math.min(N - 1, Math.max(0, j + dj)) * N + Math.min(N - 1, Math.max(0, i + di))) * 4 + 3]
          if (sum > bs) {
            bs = sum
            best = [((i + 0.5) / N - 0.5) * 360, ((j + 0.5) / N - 0.5) * 360]
          }
        }
      }
    }
    return best || [alii.x, alii.z - 10]
  })()

  const views = {}
  let akuaCands = []
  views.island = { target: at(cx + 10, cz + 4), distance: 330, yaw: 0.28, pitch: 0.78, overlay: [0.55, 0, 0.6, 0], hour: 9.5 }
  {
    // from the windward slope, under the cloud base, looking out to sea with
    // the late sun behind. Showers ride the trades in from the sea, and a faint
    // bow stands in them wherever sunlit rain sits 42° from the point opposite
    // the sun. Each shower is a rosette of overlapping cells, upwind of us: the
    // weather grid blurs a lone small cell away in seconds, a broad one lives
    // long enough to drift through the bow.
    const x = mx - ux * 4
    const z = mz - uz * 4
    const [dx, dz] = windVector(REGIMES.moae.bearing) // downwind
    const showers = []
    for (const [back, side] of [[24, 3], [48, -4]]) {
      const sx = x - dx * back - dz * side
      const sz = z - dz * back + dx * side
      showers.push([sx, sz])
      for (let k = 0; k < 6; k++) {
        const a = (k * Math.PI) / 3
        showers.push([sx + Math.cos(a) * 6, sz + Math.sin(a) * 6])
      }
    }
    views.rain = { target: at(x, z), distance: 24, yaw: maukaYaw, pitch: 0.1, hour: 16.5, weather: 'moae', boost: true, overlay: [0, 0, 0, 0], lookUp: 0.35, showers }
  }
  {
    const [x, z] = trunkAt(0.45)
    views.ahupuaa = { target: at(x, z), distance: 92, yaw: makaiYaw + 0.25, pitch: 0.55, focus: model.id, overlay: [1, 0.85, 0.4, 0.6], hour: 11 }
  }
  {
    // the heights seen from the valley below the cloud base: green walls
    // climbing into the cloud
    const [x, z] = trunkAtHeight(260)
    views.akua = { target: at(x, z), distance: 26, yaw: makaiYaw + 0.15, pitch: 0.1, hour: 8.2, overlay: [0, 0, 0, 0], lookUp: 0.55 }
    // ...and where the generator left a great waterfall, the places to stand
    // in front of one (picked below, once the stops either side are known, so
    // the tour's flights in and out can be checked as well)
    akuaCands = app.waterfalls ? fallViews(app, T, x, z) : []
  }
  {
    const [x, z] = trunkAtHeight(520)
    views.nahele = { target: at(x, z), distance: 9, yaw: makaiYaw + 0.9, pitch: 0.55, hour: 9.5, overlay: [0, 0, 0, 0] }
  }
  if (loi) {
    // where the terraces lie thickest: the paddy with the most paddy around it
    let p = loi.paddies[0].c
    let best = -1
    for (const q of loi.paddies) {
      let n = 0
      for (const r of loi.paddies) if (Math.hypot(r.c[0] - q.c[0], r.c[1] - q.c[1]) < 1.6) n++
      if (n > best) {
        best = n
        p = q.c
      }
    }
    views.loi = { target: at(p[0], p[1]), distance: 4.4, yaw: makaiYaw - 0.5, pitch: 0.72, hour: 10.2, overlay: [0, 0, 0, 0] }
  }
  views.kauhale = { target: at(village.x, village.z), distance: 3.2, yaw: makaiYaw + 0.9, pitch: 0.55, hour: 8.8, overlay: [0, 0, 0, 0] }
  if (heiau) views.heiau = { target: at(heiau.x, heiau.z), distance: 2.1, yaw: heiau.rot + 2.2, pitch: 0.42, hour: 11.5, overlay: [0, 0, 0, 0] }
  if (beach) {
    const sx = Math.cos(beach.dir)
    const sz = Math.sin(beach.dir)
    views.kahakai = { target: at(beach.x, beach.z), distance: 2.0, yaw: yawFrom(sx, sz) + 0.7, pitch: 0.28, hour: 15.8, overlay: [0, 0, 0, 0] }
  }
  if (pond) views.loko = { target: at(pond.cx + pond.ax * pond.r * 0.4, pond.cz + pond.az * pond.r * 0.4), distance: 6, yaw: yawFrom(pond.ax, pond.az) + 0.6, pitch: 0.5, hour: 13, overlay: [0, 0, 0, 0] }
  if (koa) {
    const c = beach || { dir: 0 }
    // from behind the shrine, looking out over it to the canoes on the grounds
    views.koa = { target: at(koa.x, koa.z), distance: 1.8, yaw: yawFrom(-Math.cos(c.dir), -Math.sin(c.dir)) + 0.3, pitch: 0.2, hour: 6.9, overlay: [0, 0, 0, 0], lookUp: 0.25 }
  }
  // the camera sits out past the break, looking back toward land over the riders
  const brk = surf && app.life ? app.life.breakNear(surf.x, surf.z) : null
  if (brk) {
    // out in the deep water off the shoulder, down the line from the peak, so
    // a ride comes across the frame and toward the camera with the white
    // water peeling behind it, the land beyond, and the lineup left of the
    // card. The target floats just above the sea, where the riders are, and
    // the sun is put behind the camera: morning on a coast that faces east.
    const k = Math.floor(brk.n * 0.5)
    const ox = brk.nx[k] * 0.8 + brk.tx[k] * 0.65
    const oz = brk.nz[k] * 0.8 + brk.tz[k] * 0.65
    const ol = Math.hypot(ox, oz)
    const target = new THREE.Vector3(brk.x[k] + brk.nx[k] * 0.08 + (oz / ol) * 0.2, 0.04, brk.z[k] + brk.nz[k] * 0.08 - (ox / ol) * 0.2)
    // (this close, the idle orbit would carry the next ride out of frame
    // during a long read, so it swings across a short arc instead:
    // Waterfalls.holdOrbit)
    const yaw = yawFrom(ox, oz)
    views.surf = { target, distance: 1, yaw, pitch: 0.13, hour: ox > 0 ? 9.4 : 15.6, overlay: [0, 0, 0, 0], orbit: [yaw - 0.3, yaw + 0.3] }
  } else if (surf) views.surf = { target: at(surf.x, surf.z), distance: 1.3, yaw: yawFrom(Math.cos(surf.dir + 0.9), Math.sin(surf.dir + 0.9)), pitch: 0.12, hour: 14.5, overlay: [0, 0, 0, 0] }
  views.kula = { target: at(kula[0], kula[1]), distance: 11, yaw: 0.9, pitch: 0.42, hour: 9, overlay: [0, 0, 0, 0] }
  if (ahu) {
    // stand on the slope above the ahu, looking down past it to the shore and
    // the sea at dusk
    let yaw = 0
    let bh = -Infinity
    for (let k = 0; k < 24; k++) {
      const t = (k / 24) * Math.PI * 2
      const hgt = T.heightAt(ahu.x + Math.sin(t) * 2.2, ahu.z + Math.cos(t) * 2.2)
      if (hgt > bh) {
        bh = hgt
        yaw = t
      }
    }
    views.ahu = { target: at(ahu.x, ahu.z), distance: 2.0, yaw, pitch: 0.3, hour: 18.2, doy: 318, overlay: [0, 0, 0, 0.8], lookUp: 0.6, ahu }
  }
  if (s.puuhonua) {
    const p = s.puuhonua
    views.puuhonua = { target: at(p.x - Math.cos(p.dir) * 0.8, p.z - Math.sin(p.dir) * 0.8), distance: 3.4, yaw: yawFrom(Math.cos(p.dir + 0.9), Math.sin(p.dir + 0.9)), pitch: 0.42, hour: 15, overlay: [0, 0, 0, 0] }
  }
  if (s.holua) {
    // at the foot of the run among the crowd, looking up the track as a sled
    // comes down the last stretch head first and stops: a sled is only a few
    // metres long, too small to follow from across the valley (life.js times
    // a run to arrive just after the camera does). The target is the height
    // of the riders on the causeway, not the ground under it.
    const h = s.holua
    const dx = h.x1 - h.x0
    const dz = h.z1 - h.z0
    const l = Math.hypot(dx, dz) || 1
    const target = at(h.x1 - (dx / l) * 0.42, h.z1 - (dz / l) * 0.42)
    target.y += 0.03
    // (the idle orbit held to a short arc, as at the surf)
    const yaw = yawFrom(dx / l, dz / l) - 0.45
    views.holua = { target, distance: 1.05, yaw, pitch: 0.4, hour: 16, overlay: [0, 0, 0, 0], orbit: [yaw - 0.3, yaw + 0.3] }
    // on a phone held upright, aim so the last stretch is above the card and
    // the sled does not come to a stop behind it
    const last = at(h.x1 - (dx / l) * 0.5, h.z1 - (dz / l) * 0.5)
    last.y += 0.02
    portraitAim(views.holua, last)
  }
  views.malama = { target: at(cx, cz), distance: 300, yaw: 2.5, pitch: 0.5, hour: 17.4, overlay: [0.6, 0, 0.5, 0] }

  // nothing in the way: raise any view whose sight line the land would block
  for (const v of Object.values(views)) refine(v, T)
  if (akuaCands.length) {
    const pick = pickFallView(app, T, views, akuaCands)
    if (pick) {
      views.akua = pick.view
      app.waterfalls.setHero(pick.h, pick.info)
    }
  }
  // the forest stop looks down a valley a hero falls into: take it all in
  if (app.waterfalls) tiltToFall(app, views.nahele)

  // where markers sit in explore mode (the thing itself, not the camera)
  const anchors = {
    akua: [model.topX, model.topZ],
    nahele: trunkAtHeight(520),
    loi: views.loi ? [views.loi.target.x, views.loi.target.z] : null,
    kauhale: [village.x, village.z],
    heiau: heiau ? [heiau.x, heiau.z] : null,
    kahakai: beach ? [beach.x, beach.z] : null,
    loko: pond ? [pond.cx + pond.ax * pond.r * 0.5, pond.cz + pond.az * pond.r * 0.5] : null,
    koa: koa ? [koa.x, koa.z] : null,
    surf: surf ? [surf.x, surf.z] : null,
    kula,
    ahu: ahu ? [ahu.x, ahu.z] : null,
    puuhonua: s.puuhonua ? [s.puuhonua.x, s.puuhonua.z] : null,
    holua: s.holua ? [(s.holua.x0 + s.holua.x1) / 2, (s.holua.z0 + s.holua.z1) / 2] : null,
  }
  return { views, anchors, model }
}

function refine(v, T) {
  for (let tries = 0; tries < 8; tries++) {
    const cp = Math.cos(v.pitch)
    const cam = new THREE.Vector3(v.target.x + v.distance * cp * Math.sin(v.yaw), v.target.y + v.distance * Math.sin(v.pitch), v.target.z + v.distance * cp * Math.cos(v.yaw))
    let blocked = false
    for (let k = 1; k < 24; k++) {
      const t = k / 24
      const x = cam.x + (v.target.x - cam.x) * t
      const y = cam.y + (v.target.y - cam.y) * t
      const z = cam.z + (v.target.z - cam.z) * t
      if (Math.max(0, T.heightAt(x, z)) > y - 0.03) {
        blocked = true
        break
      }
    }
    if (!blocked) return
    v.pitch = Math.min(1.3, v.pitch + 0.07)
  }
}

// Where to stand to see a waterfall: in front of its face, a little above
// its lip and far enough back that the amphitheatre rim and the cloud on the
// heights frame it, under the cloud base, with nothing in the way — and
// nothing that would make the camera lift off its line, either while the
// tour idles at the stop or on the flights in and out of it (that lift is
// what reads as a jerk).
//
// A hero falls from a notch, so it can only be seen from within half a
// radian or so of its face; round further, the notch's own walls hide it,
// and in these narrow valleys under the cloud a full turn would run into
// their walls. So the stop keeps an arc instead (`orbit`): the stretch round
// the fall from which it stays in view, the camera clear of the ground and
// the forest's crowns well below the line of sight. The idle orbit swings
// back and forth across it (Waterfalls.holdOrbit) rather than carrying on.
const FV_PITCH = [0.1, 0.14, 0.18, 0.22, 0.26, 0.3, 0.34]
const FV_DIST = [0.6, 0.7, 0.8, 0.9, 1, 1.12, 1.25, 1.4] // of the distance at which the fall spans 12°
const YAW_STEP = 0.05
const YAW_N = 41 // samples round a fall, ±1 rad off its face
const TAN_V = Math.tan((21 * Math.PI) / 180) // half the camera's vertical field of view
const CLOUD_BASE = 650 * Y_PER_M
const CANOPY = 0.33 // how high the forest's crowns stand (world units)
const PORTRAIT = 1.47 // ui.openStop's pull-back, √(1/aspect), for a phone held upright (390×844)

// the land under a world point, and whether the straight line from a to b
// clears it (by `margin`, or by `far` once more than a unit from b, where the
// forest canopy stands)
const groundOf = (T) => (x, z) => Math.max(0, T.heightAt(x, z))
const smoothstep = (a, b, v) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
function clearLine(ground, a, bx, by, bz, n, margin, far = margin) {
  for (let k = 1; k < n; k++) {
    const t = k / n
    const x = a.x + (bx - a.x) * t
    const z = a.z + (bz - a.z) * t
    const y = a.y + (by - a.y) * t
    const m = Math.hypot(bx - x, bz - z) > 1 ? far : margin
    if (ground(x, z) > y - m) return false
  }
  return true
}
const placeCam = (out, t, yaw, dist, pitch) => out.set(t.x + dist * Math.cos(pitch) * Math.sin(yaw), t.y + dist * Math.sin(pitch), t.z + dist * Math.cos(pitch) * Math.cos(yaw))
const rigFloor = (dist) => 0.12 + 0.03 * dist + 0.05 // the rig's clearance rule, with a little to spare

// The line from the camera to a point on the fall: clear of the land, and
// of the crowns wherever they could stand in it — most of all close to the
// camera, where one tree fills the frame. (Near the fall the walls and the
// notch are bare, and at the pool the line comes down to the water.)
function sightClear(ground, a, b) {
  const L = Math.hypot(b.x - a.x, b.z - a.z)
  const n = Math.max(16, Math.ceil(L / 0.25))
  for (let k = 1; k < n; k++) {
    const t = k / n
    const toB = (1 - t) * L
    const m = 0.03 + CANOPY * smoothstep(0.4, 1.2, toB) + (t * L < 1 ? 0.08 : 0)
    if (ground(a.x + (b.x - a.x) * t, a.z + (b.z - a.z) * t) > a.y + (b.y - a.y) * t - m) return false
  }
  return true
}

// Is this a good place for the camera to be, looking at hero `h` round
// target `t`? Under the cloud, no floor lift, and pool, mid-fall and lip in
// plain sight.
function goodAt(ground, cam, t, dist, h, mid, ceiling) {
  if (cam.y > ceiling || cam.y < ground(cam.x, cam.z) + rigFloor(dist)) return false
  if (!clearLine(ground, cam, t.x, t.y, t.z, 24, 0.03)) return false // what refine() checks
  return sightClear(ground, cam, t) && sightClear(ground, cam, mid) && sightClear(ground, cam, h.lip)
}

// every sample round the fall (dyaw = (i - 20) · YAW_STEP off its face) that
// is a good place to be, at this distance and pitch
function arcMask(ground, h, t, mid, fy, dist, pitch, ceiling) {
  const cam = new THREE.Vector3()
  const ok = new Uint8Array(YAW_N)
  for (let i = 0; i < YAW_N; i++) ok[i] = goodAt(ground, placeCam(cam, t, fy + (i - 20) * YAW_STEP, dist, pitch), t, dist, h, mid, ceiling) ? 1 : 0
  return ok
}

// the unbroken run of good samples through i, as yaw offsets from it
function runAt(ok, i) {
  if (!ok || !ok[i]) return null
  let a = i
  let b = i
  while (a > 0 && ok[a - 1]) a--
  while (b < YAW_N - 1 && ok[b + 1]) b++
  return [(a - i) * YAW_STEP, (b - i) * YAW_STEP]
}

const midOf = (h) => {
  const tall = h.lip.y - h.base.y
  return new THREE.Vector3(h.base.x + (h.lip.x - h.base.x) * 0.55, h.base.y + tall * 0.55, h.base.z + (h.lip.z - h.base.z) * 0.55)
}

/** Every good place to stand for every hero fall, best first. */
function fallViews(app, T, x0, z0) {
  const out = []
  app.waterfalls.heroes.forEach((h, i) => {
    // a fall that runs full in the trades is the one to show: a big catchment
    // in the wettest uplands (wandering far from the valley the tour is
    // telling about costs a little, though)
    const full = Math.min(1, h.per * 0.5 + 0.6 * smoothstep(3000, 8000, h.rain))
    const bonus = 0.5 * full - (i === 0 ? 0 : 0.004 * Math.hypot(h.lip.x - x0, h.lip.z - z0))
    for (const c of standPoints(app, T, h)) {
      c.score += bonus
      out.push(c)
    }
  })
  return out.sort((a, b) => b.score - a.score).slice(0, 60)
}

function standPoints(app, T, h) {
  const ground = groundOf(T)
  const fy = Math.atan2(h.face[0], h.face[1])
  const tgt = new THREE.Vector3(h.pool.x, ground(h.pool.x, h.pool.z), h.pool.z)
  const tall = h.lip.y - h.base.y
  const mid = midOf(h)
  const ceiling = CLOUD_BASE - 0.6
  // is a point on the fall in the sun, or in the shadow of its own valley?
  const sunlit = (p, sun) => {
    const sx = p.x + h.face[0] * 0.08
    const sz = p.z + h.face[1] * 0.08
    for (let t = 0.1; t < 30; t += 0.08) if (ground(sx + sun.x * t, sz + sun.z * t) > p.y + sun.y * t) return false
    return true
  }
  const hours = []
  const sunOut = {}
  for (let hr = 7.4; hr <= 10.61; hr += 0.2) {
    const sun = astronomy(app.clock.doy, hr, sunOut).sun.clone()
    if (sun.y < 0.12) continue
    hours.push({ hr, sun, front: sun.x * h.face[0] + sun.z * h.face[1], lit: sunlit(mid, sun), litPool: sunlit(tgt, sun), litLip: sunlit(h.lip, sun) })
  }
  if (!hours.length) return []
  const dIdeal = tall / Math.tan((12 * Math.PI) / 180)
  const cam = new THREE.Vector3()
  const a = new THREE.Vector3()
  const b = new THREE.Vector3()
  const m = new THREE.Vector3()
  const out = []
  for (const k of FV_DIST) {
    const dist = k * dIdeal
    for (const pitch of FV_PITCH) {
      const ok = arcMask(ground, h, tgt, mid, fy, dist, pitch, ceiling)
      if (!ok.some((v) => v)) continue
      // (a phone held upright stands further back along the same line)
      const okP = arcMask(ground, h, tgt, mid, fy, dist * PORTRAIT, pitch, ceiling)
      for (let i = 0; i < YAW_N; i++) {
        const arc = runAt(ok, i)
        if (!arc || arc[1] - arc[0] < 0.25) continue
        const arcP = runAt(okP, i)
        const dyaw = (i - 20) * YAW_STEP
        const yaw = fy + dyaw
        placeCam(cam, tgt, yaw, dist, pitch)
        const under = ground(cam.x, cam.z)
        a.subVectors(h.lip, cam).normalize()
        b.subVectors(h.base, cam).normalize()
        const span = (Math.acos(Math.min(1, a.dot(b))) * 180) / Math.PI
        m.subVectors(h.mist, cam).normalize()
        // big in the frame but not cramped; a little above the lip, looking
        // across rather than up, and at its face rather than from the side;
        // well clear of the canopy below; and a good long arc to idle across,
        // on a phone as well
        const len = arc[1] - arc[0]
        const g = -0.04 * Math.abs(span - 13) - 0.08 * Math.max(0, 10.5 - span) - 0.6 * Math.max(0, 0.12 - pitch) - 0.4 * Math.max(0, pitch - 0.3) - 0.25 * Math.abs(dyaw) - 0.35 * Math.max(0, 1 - (cam.y - under)) + 0.3 * Math.min(0.8, len) - (arcP ? 0.3 * Math.max(0, 0.4 - (arcP[1] - arcP[0])) : 0.25)
        let best = -Infinity
        let hour = 8.2
        for (const { hr, sun, front, lit, litPool, litLip } of hours) {
          // facing the sun only counts if the sun actually reaches the sheet,
          // and not so early that the light is still thin and orange (a high
          // sun lights more of a deep valley); a spray bow (42° from the
          // antisolar point) on the mist is a bonus
          const bowAt = (Math.acos(Math.max(-1, Math.min(1, -m.dot(sun)))) * 180) / Math.PI
          const L = (lit ? Math.max(0, front) + 0.3 : 0) + 0.12 * litPool + 0.08 * litLip - 0.6 * Math.max(0, 0.38 - sun.y) + 0.15 * smoothstep(0.45, 0.8, sun.y) - (lit && front > 0.35 ? 0.01 * Math.min(20, Math.abs(bowAt - 41.5)) : 0)
          if (L > best) {
            best = L
            hour = hr
          }
        }
        out.push({ h, score: g + best, hour, yaw, dist, pitch, arc, arcP, tgt, mid })
      }
    }
  }
  return out
}

// how much of the top of the frame looks out to sky, to far ridges or up into
// the cloud on the heights, rather than at a wall close by
function openness(ground, cam, look) {
  const f = new THREE.Vector3().subVectors(look, cam).normalize()
  const r = new THREE.Vector3().crossVectors(f, new THREE.Vector3(0, 1, 0)).normalize()
  const u = new THREE.Vector3().crossVectors(r, f)
  const d = new THREE.Vector3()
  const p = new THREE.Vector3()
  let open = 0
  const xs = [-0.7, -0.35, 0, 0.3]
  for (const sx of xs) {
    d.copy(f).addScaledVector(r, sx * TAN_V * 1.6).addScaledVector(u, 0.75 * TAN_V).normalize()
    let hit = false
    for (let t = 0.3; t < 15; t += 0.15 + t * 0.02) {
      p.copy(cam).addScaledVector(d, t)
      if (p.y > CLOUD_BASE) break
      if (p.y < ground(p.x, p.z)) {
        hit = true
        break
      }
    }
    if (!hit) open++
  }
  return open / xs.length
}

// does a whole arc (yaw offsets from c.yaw) stay good round target t?
function arcHolds(ground, c, t, arc, dist) {
  if (!arc) return true
  const cam = new THREE.Vector3()
  for (let dy = arc[0]; dy <= arc[1] + 1e-6; dy += YAW_STEP) if (!goodAt(ground, placeCam(cam, t, c.yaw + dy, dist, c.pitch), t, dist, c.h, c.mid, CLOUD_BASE - 0.6)) return false
  return true
}

// A candidate as the tour would fly it: the target nudged right so the fall
// sits left of the tour card (where the ground there is about as high: the
// rig grounds its target, and where its arcs still hold), looking up to the
// middle of the fall.
function finishView(T, c) {
  const ground = groundOf(T)
  const right = new THREE.Vector3(Math.cos(c.yaw), 0, -Math.sin(c.yaw))
  let target = c.tgt
  for (const k of [0.08, 0.05, 0.025]) {
    const t = c.tgt.clone().addScaledVector(right, k * c.dist)
    t.y = ground(t.x, t.z)
    if (Math.abs(t.y - c.tgt.y) >= 0.4) continue
    if (!arcHolds(ground, c, t, c.arc, c.dist) || !arcHolds(ground, c, t, c.arcP, c.dist * PORTRAIT)) continue
    target = t
    break
  }
  const lookUp = Math.min(0.6, Math.max(0, (c.mid.y - target.y) / (0.45 * c.dist)))
  const v = { target, distance: c.dist, yaw: c.yaw, pitch: c.pitch, hour: Math.round(c.hour * 10) / 10, lookUp, weather: 'moae', spate: 1, overlay: [0, 0, 0, 0] }
  // the arcs the idle orbit may swing across, as yaws
  v.orbit = [c.yaw + c.arc[0], c.yaw + c.arc[1]]
  if (c.arcP) v.orbitPortrait = [c.yaw + c.arcP[0], c.yaw + c.arcP[1]]
  portraitAim(v, c.mid)
  return v
}

// On a phone held upright the tour card covers the lower half of the screen,
// and ui.openStop stands √(1/aspect) further back along the same line — so
// the same lookUp would drop the fall to the middle, behind the card. There
// the aim is raised to put the middle of the fall in the upper third. (Only
// the aim changes: lookUp moves the point looked at, not the camera, so the
// flights and the arc are as checked.) It is read as the stop opens.
function portraitAim(v, mid) {
  const landscape = v.lookUp
  const cp = Math.cos(v.pitch)
  const aim = (aspect) => {
    const d = v.distance * Math.sqrt(1 / aspect)
    const cx = v.target.x + d * cp * Math.sin(v.yaw)
    const cy = v.target.y + d * Math.sin(v.pitch)
    const cz = v.target.z + d * cp * Math.cos(v.yaw)
    const up = Math.atan2(mid.y - cy, Math.hypot(mid.x - cx, mid.z - cz)) - Math.atan(0.42 * TAN_V)
    return (cy + d * cp * Math.tan(up) - v.target.y) / (0.45 * d)
  }
  Object.defineProperty(v, 'lookUp', {
    enumerable: true,
    get: () => {
      const aspect = typeof innerWidth === 'number' ? innerWidth / Math.max(1, innerHeight) : 1.6
      return aspect < 1 ? aim(aspect) : landscape
    },
  })
}

/**
 * Fly the real camera rig (60 Hz, the duration and hop ui.openStop gives a
 * flight) from one view to another, leaving the first `yawOff` round its
 * auto-orbit: the most the rig's floor had to lift the camera on the way,
 * and the hardest the camera was thrown up or down (units/s²).
 */
function flightLift(app, T, from, to, yawOff) {
  const rig = Object.create(Object.getPrototypeOf(app.rig))
  const st = () => ({ target: from.target.clone(), distance: from.distance, yaw: from.yaw + yawOff, pitch: from.pitch, lift: from.lookUp || 0 })
  Object.assign(rig, { camera: new THREE.PerspectiveCamera(42, 1.6, 0.1, 9000), terrain: T, state: st(), goal: st(), flight: null, floor: 0, autoOrbit: 0, lastInput: -1e12, _v: new THREE.Vector3(), _prevXZ: null })
  rig.apply(0)
  for (let i = 0; i < 30; i++) rig.update(1 / 60)
  // (any lift the other stop's own orbit needed is that stop's business)
  const floor0 = rig.floor
  const far = rig.goal.target.distanceTo(to.target)
  const duration = Math.min(6, 2.2 + Math.sqrt(far) * 0.22 + Math.abs(Math.log(to.distance / rig.goal.distance)) * 0.35)
  rig.flyTo({ target: to.target, distance: to.distance, yaw: to.yaw, pitch: to.pitch, lift: to.lookUp || 0 }, duration)
  rig.autoOrbit = to.distance < 60 ? 0.012 : 0.02
  let lift = floor0
  let acc = 0
  let y0 = rig.camera.position.y
  let y1 = y0
  for (let i = Math.round((duration + 1.5) * 60); i > 0; i--) {
    rig.update(1 / 60)
    if (rig.floor > lift) lift = rig.floor
    const y = rig.camera.position.y
    acc = Math.max(acc, Math.abs(y - 2 * y1 + y0) * 3600)
    y0 = y1
    y1 = y
  }
  return { lift: lift - floor0, acc }
}

// Every flight in and out of the stop: into it from early or late in the
// orbits of the stops either side, and out of it from its arrival yaw and
// from either end of its arc — pulling in an end the camera would lift off
// on the way out from. Null if the floor ever lifts the camera; else the
// hardest vertical acceleration on the way (units/s²), overall and on the
// flights to and from the next stop up the valley.
function flightsClear(app, T, views, v) {
  if (!app.rig) return { acc: 0, accNext: 0 }
  const others = [views.nahele, views.ahupuaa].filter(Boolean)
  let acc = 0
  let accNext = 0
  const fly = (a, b, off) => {
    const f = flightLift(app, T, a, b, off)
    if (f.lift > 0.005) return false
    acc = Math.max(acc, f.acc)
    if (a === views.nahele || b === views.nahele) accNext = Math.max(accNext, f.acc)
    return true
  }
  for (const o of others) if (!fly(o, v, 0.048) || !fly(o, v, 0.6) || !fly(v, o, 0)) return null
  for (const k of [0, 1]) {
    const step = k === 0 ? YAW_STEP : -YAW_STEP
    let end = v.orbit[k] - v.yaw
    while (Math.abs(end) > 1e-6 && !others.every((o) => fly(v, o, end))) end = Math.abs(end) <= YAW_STEP + 1e-6 ? 0 : end + step
    v.orbit[k] = v.yaw + end
  }
  // (too short an arc to swing across is no arc)
  if (v.orbit[1] - v.orbit[0] < 0.1) return null
  if (v.orbitPortrait) v.orbitPortrait = [Math.max(v.orbitPortrait[0], v.orbit[0]), Math.min(v.orbitPortrait[1], v.orbit[1])]
  return { acc, accNext }
}

/** The best candidate that frames well and flies clean, and clear its sight lines. */
function pickFallView(app, T, views, cands) {
  const ground = groundOf(T)
  const cam = new THREE.Vector3()
  const look = new THREE.Vector3()
  for (const c of cands) {
    placeCam(cam, c.tgt, c.yaw, c.dist, c.pitch)
    look.set(c.tgt.x, c.mid.y, c.tgt.z)
    c.open = openness(ground, cam, look)
    c.score += 0.2 * c.open
  }
  cands.sort((a, b) => b.score - a.score)
  // a long flight from another valley throws the camera about more than a
  // short one up this one (most of all on the way on up the valley, which
  // is a short hop): the best that flies clean, smoothest counting
  let best = null
  for (const c of cands) {
    if (best && c.score <= best.final) break
    const v = finishView(T, c)
    const f = flightsClear(app, T, views, v)
    if (!f) continue
    const final = c.score - 0.004 * Math.max(0, f.acc - 60) - 0.003 * Math.max(0, f.accNext - 15)
    if (!best || final > best.final) best = { c, v, final, acc: f.acc, accNext: f.accNext }
  }
  if (!best) return null
  const { c, v } = best
  // the canopy along the sight lines to the fall, from everywhere on the
  // arcs the stop idles across (few crowns stand in them: the arcs were
  // chosen for lines well above the forest)
  const h = c.h
  for (const [arc, d] of [[v.orbit, v.distance], [v.orbitPortrait, v.distance * PORTRAIT]]) {
    if (!arc) continue
    for (let y = arc[0]; y <= arc[1] + 1e-6; y += YAW_STEP) app.waterfalls.clearSight(placeCam(cam, v.target, y, d, v.pitch).clone(), [h.pool, c.mid, h.lip])
  }
  const r2 = (x) => Math.round(x * 100) / 100
  const rel = (arc) => arc && arc.map((y) => r2(y - v.yaw))
  return { view: v, h, info: { score: r2(best.final), open: c.open, arc: rel(v.orbit), arcP: rel(v.orbitPortrait), acc: Math.round(best.acc), accNext: Math.round(best.accNext) } }
}

// A stop whose frame cuts a hero fall off at the top tilts up just enough to
// take it in (only the aim changes, not where the camera stands, so its
// flights and orbit stay exactly as they were).
function tiltToFall(app, v) {
  if (!v) return
  const c = new THREE.PerspectiveCamera(42, 1.6, 0.1, 9000)
  placeCam(c.position, v.target, v.yaw, v.distance, v.pitch)
  const a = new THREE.Vector3()
  const b = new THREE.Vector3()
  for (let lift = v.lookUp || 0; lift <= 0.3 + 1e-6; lift += 0.05) {
    c.lookAt(v.target.x, v.target.y + lift * v.distance * 0.45, v.target.z)
    c.updateMatrixWorld()
    let cut = false
    for (const h of app.waterfalls.heroes) {
      a.copy(h.lip).project(c)
      b.copy(h.base).project(c)
      if (b.z < 1 && Math.abs(b.x) < 0.9 && Math.abs(b.y) < 0.9 && a.y > 0.88) cut = true
    }
    if (!cut) {
      if (lift > 0) v.lookUp = lift
      return
    }
  }
}
