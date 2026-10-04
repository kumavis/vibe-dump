// Where the camera stands for each tour stop, worked out from wherever the
// generator put things. Yaw is the compass side the camera sits on, seen from
// its target (0 = south of it, looking north).

import * as THREE from 'three'

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
  views.island = { target: at(cx + 10, cz + 4), distance: 330, yaw: 0.28, pitch: 0.78, overlay: [0.55, 0, 0.6, 0], hour: 9.5 }
  {
    // from the windward slope, under the cloud base, looking out to sea with
    // the late sun behind: showers drifting in, and a rainbow if it's raining
    const x = mx - ux * 4
    const z = mz - uz * 4
    views.rain = { target: at(x, z), distance: 24, yaw: maukaYaw, pitch: 0.1, hour: 16.0, weather: 'moae', boost: true, overlay: [0, 0, 0, 0], lookUp: 0.35, showers: [[x - ux * 14, z - uz * 14], [x - ux * 8 + uz * 7, z - uz * 8 - ux * 7], [x - ux * 20 - uz * 6, z - uz * 20 + ux * 6]] }
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
  }
  {
    const [x, z] = trunkAtHeight(520)
    views.nahele = { target: at(x, z), distance: 9, yaw: makaiYaw + 0.9, pitch: 0.55, hour: 9.5, overlay: [0, 0, 0, 0] }
  }
  if (loi) {
    const p = loi.paddies[Math.floor(loi.paddies.length * 0.35)].quad[0]
    views.loi = { target: at(p[0], p[1]), distance: 5.2, yaw: makaiYaw - 0.5, pitch: 0.72, hour: 10.2, overlay: [0, 0, 0, 0] }
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
  if (surf) views.surf = { target: at(surf.x, surf.z), distance: 1.3, yaw: yawFrom(Math.cos(surf.dir + 0.9), Math.sin(surf.dir + 0.9)), pitch: 0.12, hour: 14.5, overlay: [0, 0, 0, 0] }
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
    const h = s.holua
    const mxh = (h.x0 + h.x1) / 2
    const mzh = (h.z0 + h.z1) / 2
    const dx = h.x1 - h.x0
    const dz = h.z1 - h.z0
    const l = Math.hypot(dx, dz) || 1
    views.holua = { target: at(mxh, mzh), distance: 6.5, yaw: yawFrom(-dz / l, dx / l) + 0.25, pitch: 0.33, hour: 16, overlay: [0, 0, 0, 0] }
  }
  views.malama = { target: at(cx, cz), distance: 300, yaw: 2.5, pitch: 0.5, hour: 17.4, overlay: [0.6, 0, 0.5, 0] }

  // nothing in the way: raise any view whose sight line the land would block
  for (const v of Object.values(views)) refine(v, T)

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
