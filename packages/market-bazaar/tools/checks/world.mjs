// Headless verification for src/world.js. Run from packages/market-bazaar:
//   node tools/checks/world.mjs
// Exits non-zero on any failure. Prints measured build ms / tri count.

import { buildWorld } from '../../src/world.js'
import { GOODS } from '../../src/goods.js'

const SEED = 7
const STALL_GOODS = [
  ['apple'], ['fish', 'bread'], ['spice'], ['potion'],
  ['gem'], ['lamp', 'scroll'], ['rug'], ['skull'],
]

let failures = 0
function check(ok, msg) {
  if (!ok) {
    failures++
    console.error(`FAIL: ${msg}`)
  }
}

// ---------------------------------------------------------------- build + time
const t0 = performance.now()
const world = buildWorld({ seed: SEED, goods: GOODS, stallGoods: STALL_GOODS })
const buildMs = performance.now() - t0

const { group, bounds, stalls, buskerSpots, colliders, update } = world

check(group && group.isGroup, 'buildWorld returns { group: THREE.Group }')
check(bounds && bounds.r >= 24 && bounds.r <= 28, `bounds.r in [24,28] (got ${bounds?.r})`)
check(stalls.length === STALL_GOODS.length, `stalls.length === stallGoods.length (${stalls.length})`)
check(buskerSpots.length === 2, `exactly 2 buskerSpots (got ${buskerSpots.length})`)
check(colliders.length > 0, 'has colliders')

// ------------------------------------------------- geometry finite + tri count
let triCount = 0
let meshCount = 0
group.traverse((o) => {
  if (!o.isMesh) return
  meshCount++
  const g = o.geometry
  for (const [name, attr] of Object.entries(g.attributes)) {
    const a = attr.array
    for (let i = 0; i < a.length; i++) {
      if (!Number.isFinite(a[i])) {
        check(false, `non-finite value in ${o.name || 'mesh'}.${name}[${i}]`)
        return
      }
    }
  }
  triCount += g.index ? g.index.count / 3 : g.getAttribute('position').count / 3
})
check(triCount <= 120_000, `triangle budget: ${triCount} <= 120000`)
check(buildMs <= 400, `build time ${buildMs.toFixed(1)}ms <= 400ms`)

// ------------------------------------------------------------- spot geometry
// A spot is a radius-0.3 character disc; it must sit inside bounds.r and keep
// >= 0.45m between the collider edge and the spot's *centre* (generous: the
// 0.45 margin swallows the 0.3 disc radius plus slack).
const CLEAR = 0.45
function spotClear(spot, label) {
  const rad = Math.hypot(spot.x, spot.z)
  check(rad + 0.3 <= bounds.r, `${label} inside bounds (r=${rad.toFixed(2)})`)
  check(Number.isFinite(spot.yaw), `${label} yaw finite`)
  for (const c of colliders) {
    const d = Math.hypot(spot.x - c.x, spot.z - c.z) - c.r
    check(d >= CLEAR, `${label} clear of collider (${c.x.toFixed(1)},${c.z.toFixed(1)},r${c.r}): gap ${d.toFixed(2)} >= ${CLEAR}`)
  }
}

for (let i = 0; i < stalls.length; i++) {
  const s = stalls[i]
  check(s.id === `stall${i}`, `stall id 'stall${i}'`)
  check(Array.isArray(s.goodIds) && s.goodIds.length >= 1 && s.goodIds.length <= 2, `stall${i} goodIds 1..2`)
  check(JSON.stringify(s.goodIds) === JSON.stringify(STALL_GOODS[i]), `stall${i} goodIds match input`)
  check(s.counterY >= 0.85 && s.counterY <= 1.05, `stall${i} counterY ${s.counterY.toFixed(3)} in [0.85,1.05]`)
  check(s.browseSpots.length === 2, `stall${i} exactly 2 browseSpots`)
  check(typeof s.awningColor === 'number', `stall${i} awningColor is a hex number`)

  spotClear(s.vendorSpot, `stall${i}.vendorSpot`)
  for (let b = 0; b < s.browseSpots.length; b++) spotClear(s.browseSpots[b], `stall${i}.browseSpot[${b}]`)

  // facing: forward = (sin(yaw), cos(yaw)) points out over the counter.
  const fx = Math.sin(s.yaw), fz = Math.cos(s.yaw)
  // vendor stands BEHIND the counter (opposite side from forward)…
  const vd = (s.vendorSpot.x - s.pos.x) * fx + (s.vendorSpot.z - s.pos.z) * fz
  check(vd < 0, `stall${i} vendorSpot behind counter (dot ${vd.toFixed(2)} < 0)`)
  check(Math.abs(s.vendorSpot.yaw - s.yaw) < 1e-9, `stall${i} vendorSpot faces out over counter`)
  // …browse spots on the opposite side, facing back at the counter.
  for (const b of s.browseSpots) {
    const bd = (b.x - s.pos.x) * fx + (b.z - s.pos.z) * fz
    check(bd > 0, `stall${i} browseSpot in front of counter (dot ${bd.toFixed(2)} > 0)`)
    const facing = Math.sin(b.yaw) * fx + Math.cos(b.yaw) * fz
    check(facing < -0.9, `stall${i} browseSpot yaw faces the counter (dot ${facing.toFixed(2)})`)
  }

  // stalls pairwise >= 2.5m apart
  for (let k = i + 1; k < stalls.length; k++) {
    const o = stalls[k]
    const d = Math.hypot(s.pos.x - o.pos.x, s.pos.z - o.pos.z)
    check(d >= 2.5, `stall${i}..stall${k} distance ${d.toFixed(2)} >= 2.5`)
  }

  // some collider covers the stall centre
  const covered = colliders.some((c) => Math.hypot(s.pos.x - c.x, s.pos.z - c.z) <= c.r)
  check(covered, `stall${i} centre covered by a collider`)
}

for (let b = 0; b < buskerSpots.length; b++) spotClear(buskerSpots[b], `buskerSpot[${b}]`)

// busker spots also stay out of everyone's stall frontage (not colliding with stalls)
for (const bs of buskerSpots) {
  for (const s of stalls) {
    const d = Math.hypot(bs.x - s.pos.x, bs.z - s.pos.z)
    check(d >= 3.0, `buskerSpot vs ${s.id} distance ${d.toFixed(2)} >= 3.0`)
  }
}

// there is a collider at the central landmark
check(colliders.some((c) => Math.hypot(c.x, c.z) < 0.5 && c.r >= 1.5), 'central landmark has a collider')

// ------------------------------------------------------------ update(t) sanity
const dynamicMeshes = []
group.traverse((o) => { if (o.isMesh && o.userData.dynamic) dynamicMeshes.push(o) })
check(dynamicMeshes.length > 0 && dynamicMeshes.length <= 10, `1..10 dynamic meshes (got ${dynamicMeshes.length})`)

for (const t of [0, 0.1, 0.5, 1, 2, 3.7, 10, 60, 123.4, 1000]) {
  update(t)
  group.updateMatrixWorld(true)
  for (const m of dynamicMeshes) {
    const e = m.matrixWorld.elements
    for (let i = 0; i < 16; i++) {
      if (!Number.isFinite(e[i])) { check(false, `NaN in dynamic matrix at t=${t}`); break }
    }
  }
}

// update() performance: average over 1000 calls
{
  update(0.001) // warm
  const n = 1000
  const u0 = performance.now()
  for (let i = 0; i < n; i++) update(i * 0.016)
  const perCall = (performance.now() - u0) / n
  check(perCall <= 0.2, `update(t) ${perCall.toFixed(4)}ms <= 0.2ms`)
  console.log(`update(t): ${perCall.toFixed(4)} ms/call`)
}

// -------------------------------------------------------------- determinism
const world2 = buildWorld({ seed: SEED, goods: GOODS, stallGoods: STALL_GOODS })
const sig = (w) => JSON.stringify({
  stalls: w.stalls, buskers: w.buskerSpots, colliders: w.colliders, r: w.bounds.r,
})
check(sig(world) === sig(world2), 'same seed => identical layout (stalls/buskers/colliders)')
const seedOtherSig = sig(buildWorld({ seed: 8, goods: GOODS, stallGoods: STALL_GOODS }))
check(seedOtherSig !== sig(world), 'different seed => different layout')

// vertex-data determinism spot check: first static mesh position hash
function geomHash(w) {
  let h = 0
  w.group.traverse((o) => {
    if (!o.isMesh || o.userData.dynamic) return
    const a = o.geometry.getAttribute('position').array
    for (let i = 0; i < a.length; i += 97) h = (h * 31 + Math.round(a[i] * 1e4)) | 0
  })
  return h
}
check(geomHash(world) === geomHash(world2), 'same seed => identical static geometry')

// -------------------------------------------------------------- report
console.log(`build: ${buildMs.toFixed(1)} ms`)
console.log(`triangles: ${triCount}`)
console.log(`meshes (draw calls): ${meshCount}`)
console.log(`colliders: ${colliders.length}`)
if (failures) {
  console.error(`\n${failures} check(s) FAILED`)
  process.exit(1)
}
console.log('\nall world checks passed')
