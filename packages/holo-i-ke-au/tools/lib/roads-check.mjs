// Reads the restore patches back (tools/bake-roads.mjs --check; DATA.md,
// "Accepted extensions (restore)"): each entry whole and sourced, dated as
// its road's section of the works; its image an RGB PNG of its box, inside
// its pack; on each pack no texel in two restores, none on today's sea or
// under a harbour patch, none laid back to the sea, and none over a tunnel
// away from its portals; and where a restore meets the ground it leaves
// alone, no step.

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { KX, KZ, gridFromBounds } from './geo.mjs'
import { readPNG } from './png.mjs'
import { readPack } from './layers-raster.mjs'
import { groundRange, readRoads, roadPacks, roadUntil } from './roads-bake.mjs'

const PORTAL_REACH = 120 // metres from a tunnel's ends where its portals' cuts may lie
const REACH = 150 // metres round a laid-back texel whose undisturbed ground bounds it
const STEP = 2 // metres: the most the ground as laid back may climb at a restore's edge past the ground's own slope beyond it

export function checkRoads({ data, log }) {
  let bad = 0
  const ok = (cond, msg) => {
    if (!cond) {
      bad++
      log(`  FAIL ${msg}`)
    }
    return cond
  }
  const manifest = JSON.parse(readFileSync(join(data, 'patches', 'manifest.json'), 'utf8'))
  const all = manifest.patches
  const mine = all.filter((e) => e.kind === 'restore')
  ok(mine.length > 0, 'no restore patches in the manifest')
  // ours together at the end of the list
  const first = all.findIndex((e) => e.kind === 'restore')
  ok(first < 0 || all.slice(first).every((e) => e.kind === 'restore'), 'the restore entries are not together at the end of the list')
  const { roads, tunnels } = readRoads(data)
  const byId = new Map(roads.map((f) => [f.properties.id, f.properties]))
  const packs = new Map(roadPacks(data).map((p) => [p.id, p]))
  const ids = new Set(all.filter((e) => e.kind !== 'restore').map((e) => e.id))
  for (const e of mine) {
    ok(!ids.has(e.id), `${e.id}: id used twice`)
    ids.add(e.id)
    ok(/^[a-z0-9]+(-[a-z0-9]+)*$/.test(e.id), `${e.id}: id is not kebab-case ASCII`)
    ok(packs.has(e.pack), `${e.id}: no pack ${e.pack}`)
    const road = byId.get(e.works)
    if (ok(road, `${e.id}: no highway road ${e.works} in the works`)) ok(e.until === roadUntil(road), `${e.id}: until ${e.until}, the works' section says ${roadUntil(road)}`)
    ok(Number.isInteger(e.until) && e.until > 1778 && e.until <= 2026, `${e.id}: until ${e.until}`)
    ok(Number.isFinite(e.delta?.scale) && Number.isFinite(e.delta?.offset), `${e.id}: no delta encoding`)
    ok(Array.isArray(e.box) && e.box.length === 4 && e.box.every(Number.isInteger), `${e.id}: box ${e.box}`)
    ok(typeof e.file === 'string' && existsSync(join(data, e.file)), `${e.id}: no file ${e.file}`)
    ok(typeof e.note === 'string' && e.note.length > 40, `${e.id}: no note`)
    ok(Array.isArray(e.sources) && e.sources.length > 1, `${e.id}: no sources`)
    for (const s of e.sources || []) ok(s.id && s.title && s.url && s.fetched && s.licence, `${e.id}: source ${s.id || '?'} lacks id, title, url, fetched or licence`)
  }
  if (bad) return false

  for (const [id, pk] of packs) {
    const list = mine.filter((e) => e.pack === id)
    if (!list.length) continue
    const P = readPack(pk.dataDir, pk.entry)
    const { W, H, metres } = P
    const grid = gridFromBounds(pk.entry.bounds, W, H)
    const [mx, mz] = grid.metresPerTexel
    const [west, , , north] = pk.entry.bounds
    // the harbours' patches on this pack, as one mask
    const harbour = new Uint8Array(W * H)
    const masks = [...all.filter((e) => e.pack === id && e.kind !== 'restore').map((e) => join(data, e.file)), ...(pk.kind === 'district' ? (pk.entry.patches || []).map((q) => join(data, 'districts', q.file)) : [])]
    for (const f of masks) {
      const m = readPNG(f)
      if (m.width === W && m.height === H) for (let o = 0; o < W * H; o++) if (m.data[o * m.channels]) harbour[o] = 1
    }
    const owner = new Int16Array(W * H).fill(-1)
    const delta = new Float32Array(W * H)
    let twice = 0
    list.forEach((e, n) => {
      const img = readPNG(join(data, e.file))
      const [i0, j0, w, h] = e.box
      if (!ok(img.channels === 3 && img.width === w && img.height === h, `${e.file}: not a ${w}x${h} RGB image`)) return
      if (!ok(i0 >= 0 && j0 >= 0 && i0 + w <= W && j0 + h <= H, `${e.id}: box ${e.box} outside ${W}x${H}`)) return
      let on = 0
      let sea = 0
      let toSea = 0
      let onHarbour = 0
      for (let j = 0; j < h; j++) {
        for (let i = 0; i < w; i++) {
          const k = (j * w + i) * 3
          const wt = img.data[k + 2] / 255
          if (!wt) continue
          const o = (j0 + j) * W + i0 + i
          const d = ((img.data[k] * 256 + img.data[k + 1]) * e.delta.scale + e.delta.offset) * wt
          on++
          if (owner[o] >= 0) twice++
          owner[o] = n
          delta[o] = d
          if (metres[o] <= 0) sea++
          if (metres[o] + d <= 0) toSea++
          if (harbour[o]) onHarbour++
        }
      }
      ok(on > 0, `${e.id}: its image marks nothing`)
      ok(!sea, `${e.id}: ${sea} texels on today's sea`)
      ok(!toSea, `${e.id}: ${toSea} texels laid back below the sea`)
      ok(!onHarbour, `${e.id}: ${onHarbour} texels under a harbour patch`)
    })
    ok(!twice, `${id}: ${twice} texels in two restore patches`)
    // over a tunnel, away from its portals, nothing
    const toXY = (c) => [((c[0] - west) / grid.dLon) * mx, ((north - c[1]) / grid.dLat) * mz]
    for (const t of tunnels) {
      const pts = t.geometry.coordinates.map(toXY)
      const len = pts.slice(1).reduce((s, p, k) => s + Math.hypot(p[0] - pts[k][0], p[1] - pts[k][1]), 0)
      let over = 0
      if (len > 2 * PORTAL_REACH) {
        let s = 0
        for (let k = 1; k < pts.length; k++) {
          const L = Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1])
          for (let a = 0; a < L; a += Math.min(mx, mz) / 2) {
            const at = s + a
            if (at < PORTAL_REACH || at > len - PORTAL_REACH) continue
            const x = pts[k - 1][0] + ((pts[k][0] - pts[k - 1][0]) * a) / L
            const y = pts[k - 1][1] + ((pts[k][1] - pts[k - 1][1]) * a) / L
            const i = Math.floor(x / mx)
            const j = Math.floor(y / mz)
            if (i >= 0 && j >= 0 && i < W && j < H && owner[j * W + i] >= 0 && Math.abs(delta[j * W + i]) > 0.5) over++
          }
          s += L
        }
      }
      ok(!over, `${id}: ${over} points over ${t.properties.id} away from its portals are laid back`)
    }
    // no step where a restore meets the ground it leaves alone (unless at the
    // shore or a harbour patch, where it stops short): across the edge the
    // ground as laid back climbs no more steeply than the ground beyond it does
    // over its next texel, give or take STEP
    let edges = 0
    let steps = 0
    let worst = 0
    for (let o = 2 * W; o < W * (H - 2); o++) {
      if (owner[o] < 0) continue
      for (const dq of [-1, 1, -W, W]) {
        const q = o + dq
        const q2 = q + dq
        if (owner[q] >= 0 || owner[q2] >= 0 || metres[q] <= 0.5 || harbour[q]) continue
        const jump = Math.abs(metres[o] + delta[o] - metres[q]) - Math.abs(metres[q] - metres[q2])
        edges++
        worst = Math.max(worst, jump)
        if (jump > STEP) steps++
      }
    }
    log(`${id}: ${list.length} restores; ${steps} of ${edges} edge texels climb more than ${STEP} m past the ground's own slope beyond them (the worst ${worst.toFixed(1)} m), where the ground beyond is gentler than the slope it meets`)
    // no bulge and no sag: the ground as laid back lies within the range of
    // the undisturbed ground within REACH of it (the bake holds the plate to it)
    const inU = new Uint8Array(W * H)
    const U = []
    for (let o = 0; o < W * H; o++) if (owner[o] >= 0) (inU[o] = 1), U.push(o)
    const { lo, hi, at } = groundRange(metres, W, H, inU, Math.max(4, Math.round(REACH / Math.min(mx, mz))), U)
    const out = new Map()
    for (const o of U) {
      const t = metres[o] + delta[o]
      const q = at(o)
      // (a laid-back value is kept to a centimetre: the image's step)
      const off = t > hi[q] + 0.02 ? t - hi[q] : t < lo[q] - 0.02 ? t - lo[q] : 0
      if (!off) continue
      const e = list[owner[o]].id
      const r = out.get(e) || { n: 0, worst: 0 }
      r.n++
      if (Math.abs(off) > Math.abs(r.worst)) r.worst = off
      out.set(e, r)
    }
    for (const [e, q] of out) ok(false, `${e}: ${q.n} texels laid back ${q.worst > 0 ? 'above' : 'below'} all the undisturbed ground within ${REACH} m (by up to ${Math.abs(q.worst).toFixed(1)} m)`)
    for (const e of list) log(`  ${e.id.padEnd(48)} until ${e.until}  ${String(e.stats?.texels).padStart(6)} texels  cut to ${e.stats?.maxCutMetres} m, fill to ${e.stats?.maxFillMetres} m`)
  }
  // the size: the road images and the whole patches directory
  const dir = join(data, 'patches')
  const size = (d) => readdirSync(d).reduce((s, f) => s + (statSync(join(d, f)).isDirectory() ? size(join(d, f)) : statSync(join(d, f)).size), 0)
  const roadsKB = size(join(dir, 'roads')) / 1024
  ok(roadsKB < 768, `patches/roads/ is ${roadsKB.toFixed(0)} kB`)
  log(`patches/roads/: ${roadsKB.toFixed(0)} kB; patches/: ${(size(dir) / 1024).toFixed(0)} kB`)
  log(bad ? `${bad} failures` : 'restore patches: ok')
  return !bad
}
