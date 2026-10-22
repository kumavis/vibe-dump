// Dev-only: checks src/geo.js (and the bakes' copy in tools/lib/geo.mjs)
// against the numbers DATA.md §1, ENGINEERING.md §3 and R1 §5 promise.
//
//   node tools/test-geo.mjs          exit 1 on any failure
//
// What it asserts: wrapLon's range; a forward-then-inverse round trip over
// the whole theatre under 1e-6 m for every table kind; the azimuthal
// equidistant radius to Pearl Harbor equal to the great circle; the scale
// factor 1 at the centre; grid convergence near −15° at Midway (and the
// other v1 boxes' printed); a box's tangent plane round trip and its rect;
// placement's toTable/toBox round trip, its first-order error over a box, and
// the poses through it; and tools/lib/geo.mjs giving the same numbers.
import { readFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as geo from '../src/geo.js'

const here = dirname(fileURLToPath(import.meta.url))
const { wrapLon, TangentProjection, TableProjection, projectionFor, placement, poseToTable, poseToBox, geometryPoint, densifyLonLat, R_EARTH, DEG } = geo

let failed = 0
let passed = 0
const check = (name, ok, detail = '') => {
  if (ok) passed++
  else failed++
  console.log(`  ${ok ? '✓' : '✗'} ${name}${detail ? ` — ${detail}` : ''}`)
}
const near = (a, b, tol) => Math.abs(a - b) <= tol

/** Great-circle distance, metres. */
function gc([l1, p1], [l2, p2]) {
  const a = Math.sin(((p2 - p1) * DEG) / 2) ** 2 + Math.cos(p1 * DEG) * Math.cos(p2 * DEG) * Math.sin(((l2 - l1) * DEG) / 2) ** 2
  return 2 * R_EARTH * Math.asin(Math.min(1, Math.sqrt(a)))
}

// The v1 table (DATA.md §1)
const V1 = { kind: 'aeqd', lon0: 141.5, lat0: 7.0, unit: 1000 }
const table = projectionFor(V1)

console.log('wrapLon')
check('wrapLon(-177.37, 141.5) = 182.63', near(wrapLon(-177.37, 141.5), 182.63, 1e-9))
check('wrapLon(205, 141.5) = 205', near(wrapLon(205, 141.5), 205, 1e-12))
check('wrapLon(78, 141.5) = 78', near(wrapLon(78, 141.5), 78, 1e-12))
check('wrapLon(-38.5, 141.5) = -38.5 (the left edge is in range)', near(wrapLon(-38.5, 141.5), -38.5, 1e-12))
check('wrapLon(321.5, 141.5) = -38.5 (the right edge is not)', near(wrapLon(321.5, 141.5), -38.5, 1e-9))
check('wrapLon(180.2, 182.2) = 180.2', near(wrapLon(180.2, 182.2), 180.2, 1e-12))
check('wrapLon(-179.8, 182.2) = 180.2', near(wrapLon(-179.8, 182.2), 180.2, 1e-9))
{
  let ok = true
  for (let l = -900; l <= 900; l += 7.3) {
    const w = wrapLon(l, 141.5)
    if (!(w >= 141.5 - 180 && w < 141.5 + 180) || !near((w - l) / 360, Math.round((w - l) / 360), 1e-9)) ok = false
  }
  check('wrapLon lands in [lon0 − 180, lon0 + 180) by whole turns, for any input', ok)
}

console.log('table projections: forward then inverse over the theatre (78°E–155°W, 42°S–56°N, every 0.5°)')
for (const kind of ['aeqd', 'laea', 'equirect']) {
  const p = new TableProjection({ ...V1, kind })
  let worst = 0
  let at = null
  for (let lon = 78; lon <= 205; lon += 0.5) {
    for (let lat = -42; lat <= 56; lat += 0.5) {
      const [x, z] = p.toWorld([lon, lat])
      const [l2, p2] = p.toLonLat(x, z)
      const err = Math.hypot((wrapLon(l2, lon) - lon) * DEG * R_EARTH * Math.cos(lat * DEG), (p2 - lat) * DEG * R_EARTH)
      if (err > worst) {
        worst = err
        at = [lon, lat]
      }
    }
  }
  check(`${kind}: worst round-trip error under 1e-6 m`, worst < 1e-6, `${worst.toExponential(2)} m at ${at}`)
}
{
  const [l, p] = table.toLonLat(...table.toWorld([-177.37, 28.2]))
  check('toLonLat returns longitudes in [lon0 − 180, lon0 + 180): Midway reads 182.63', near(l, 182.63, 1e-9) && near(p, 28.2, 1e-9), `${l}, ${p}`)
  check('the centre maps to the origin', table.toWorld([141.5, 7]).every((v) => Math.abs(v) < 1e-9))
  check('x grows east, z grows south', table.toWorld([150, 7])[0] > 0 && table.toWorld([141.5, 20])[1] < 0)
}

console.log('azimuthal equidistant: true distance from the centre')
{
  const pearl = [-157.95, 21.36]
  const [x, z] = table.toWorld(pearl)
  const r = Math.hypot(x, z) * 1000
  const d = gc([141.5, 7], pearl)
  check('radius to Pearl Harbor equals the great circle', near(r, d, 1e-3), `${(r / 1000).toFixed(3)} km against ${(d / 1000).toFixed(3)} km`)
}

console.log('scale and convergence')
{
  check('scaleAt the centre = 1', near(table.scaleAt([141.5, 7]), 1, 1e-8), String(table.scaleAt([141.5, 7])))
  check('convergenceAt the centre = 0', near(table.convergenceAt([141.5, 7]), 0, 1e-6))
  const J = table.jacobianAt([150, 20])
  // the Jacobian against a coarser difference of its own, as a check on the step
  const h = 400
  const dLon = h / (R_EARTH * Math.cos(20 * DEG)) / DEG
  const a = table.toWorld([150 + dLon, 20])
  const b = table.toWorld([150 - dLon, 20])
  check('jacobianAt agrees with a 400 m difference', near(J[0][0], (a[0] - b[0]) / (2 * h), 1e-9) && near(J[1][0], (a[1] - b[1]) / (2 * h), 1e-9))
  const mid = table.convergenceAt([-177.37, 28.2])
  check('convergence at Midway near −15° (true north leans west)', mid < -13 && mid > -17, `${mid.toFixed(2)}°`)
  const guad = table.convergenceAt([160.0, -9.3])
  check('convergence at Guadalcanal small', Math.abs(guad) < 4, `${guad.toFixed(2)}°`)
  const samar = table.convergenceAt([126.1, 11.8])
  check('convergence at Samar positive and small (west of the centre)', samar > 0 && samar < 8, `${samar.toFixed(2)}°`)
  const k = table.scaleAt([-177.37, 28.2])
  check('areal scale at Midway a few per cent over 1', k > 1.02 && k < 1.12, k.toFixed(4))
}

console.log('a box: the tangent plane')
{
  const bp = new TangentProjection({ lon0: 182.2, lat0: 30, unit: 1 })
  let worst = 0
  for (let lon = 180.2; lon <= 184.2; lon += 0.05) {
    for (let lat = 27.9; lat <= 32; lat += 0.05) {
      const [x, z] = bp.toWorld([lon, lat])
      const [l2, p2] = bp.toLonLat(x, z)
      worst = Math.max(worst, Math.abs(l2 - lon) * 1e5, Math.abs(p2 - lat) * 1e5)
    }
  }
  check('round trip over the Midway box', worst < 1e-6, `${worst.toExponential(2)} (×1e-5°)`)
  check('a raw longitude past 180 lands in the same place (-177.8 and 182.2)', near(bp.toWorld([-177.8, 30])[0], bp.toWorld([182.2, 30])[0], 1e-6))
  const r = bp.rect([180.2, 27.9, 184.2, 32.0])
  check('rect: west negative, east positive, north negative z, row 0 north', r.x0 < 0 && r.x1 > 0 && r.z0 < 0 && r.z1 > 0 && r.z0 < r.z1)
  check('rect width = 4° × cos 30° × 111,320 m', near(r.x1 - r.x0, 4 * Math.cos(30 * DEG) * 111320, 1e-6))
  check('scaleAt 1, convergenceAt 0', bp.scaleAt() === 1 && bp.convergenceAt() === 0)
}

console.log('placement: a box on the table')
const ids = JSON.parse(readFileSync(join(here, 'check/ids.json'), 'utf8'))
for (const [id, b] of Object.entries({ ...ids.boxes, ...(ids.fixtures?.boxes || {}) })) {
  const box = { id, projection: { kind: 'tangent', lon0: b.lon0, lat0: b.lat0, unit: 1 }, bounds: b.bounds }
  const pl = placement(box, table)
  const bp = new TangentProjection(box.projection)
  const r = bp.rect(b.bounds)
  // round trip
  let rt = 0
  for (const [x, z] of [[0, 0], [r.x0, r.z0], [r.x1, r.z1], [r.x0, r.z1], [12345.6, -6543.2]]) {
    const [bx, bz] = pl.toBox(pl.toTable([x, z]))
    rt = Math.max(rt, Math.hypot(bx - x, bz - z))
  }
  // first-order error at the corners against the exact mapping, km on the table
  let err = 0
  for (const [x, z] of [[r.x0, r.z0], [r.x1, r.z0], [r.x0, r.z1], [r.x1, r.z1]]) {
    const [tx, tz] = pl.toTable([x, z])
    const [ex, ez] = table.toWorld(bp.toLonLat(x, z))
    err = Math.max(err, Math.hypot(tx - ex, tz - ez))
  }
  const half = Math.hypot(r.x1 - r.x0, r.z1 - r.z0) / 2 / 1000
  // (most of the corner error is the tangent plane's own: its degree of longitude is
  // the centre's, 2 % long at the Midway box's north edge, which no linear map undoes)
  const ok = rt < 1e-6 && err < Math.max(0.5, half * 0.03) && near(pl.convergenceDeg, table.convergenceAt([b.lon0, b.lat0]), 0.5)
  check(
    `${id}: round trip, corners within first order, alpha = convergence`,
    ok,
    `centre ${pl.centre.map((v) => v.toFixed(1)).join(', ')} km, scale ${(pl.scale * 1000).toFixed(5)} km/km, alpha ${pl.convergenceDeg.toFixed(2)}°, corner error ${err.toFixed(3)} km at ${half.toFixed(0)} km, round trip ${rt.toExponential(1)} m`,
  )
}
{
  const box = { id: 't', projection: { kind: 'tangent', lon0: 182.2, lat0: 30, unit: 1 } }
  const pl = placement(box, table)
  const pose = { target: { x: 12000, y: 30, z: -8000 }, distance: 6000, yaw: 0.7, pitch: 0.5 }
  const t = poseToTable(pose, pl)
  const back = poseToBox(t, pl)
  check(
    'poseToBox(poseToTable(pose)) = pose',
    near(back.target.x, pose.target.x, 1e-6) && near(back.target.z, pose.target.z, 1e-6) && near(back.distance, pose.distance, 1e-9) && near(back.yaw, pose.yaw, 1e-12) && back.pitch === pose.pitch,
  )
  check('the distance scales by placement.scale (km per m)', near(t.distance, 6000 * pl.scale, 1e-12) && t.distance > 5.5 && t.distance < 7)
  check('yaw turns by −alpha into the table', near(t.yaw, 0.7 - pl.alpha, 1e-12))
  // the camera's offset direction maps through J: the box's camera direction lands on the table's
  const turned = (yaw) => {
    const ob = [Math.sin(yaw), Math.cos(yaw)]
    const ot = [pl.J[0][0] * ob[0] + pl.J[0][1] * ob[1], pl.J[1][0] * ob[0] + pl.J[1][1] * ob[1]]
    return Math.atan2(ot[0], ot[1])
  }
  const diff = (a, b) => Math.abs(((a - b + 3 * Math.PI) % (2 * Math.PI)) - Math.PI)
  check('a camera looking north in the box looks along its meridian on the table', diff(turned(0), -pl.alpha) < 1e-9, `${turned(0).toFixed(6)} against ${(-pl.alpha).toFixed(6)}`)
  check('the yaw rule matches the Jacobian elsewhere within its shear', diff(turned(pose.yaw), t.yaw) < 0.07, `${turned(pose.yaw).toFixed(4)} against ${t.yaw.toFixed(4)}`)
  const m = pl.matrix
  const [x, z] = [5000, -3000]
  const viaM = [m[0] * x + m[8] * z + m[12], m[2] * x + m[10] * z + m[14]]
  const viaF = pl.toTable([x, z])
  check('matrix (column-major) agrees with toTable', near(viaM[0], viaF[0], 1e-9) && near(viaM[1], viaF[1], 1e-9) && m[5] === pl.scale)
}

console.log('geometryPoint and densify')
{
  // a polygon across 180°, normalised (lon past 180) and raw
  const ring = [[179, 10], [182, 10], [182, 12], [179, 12], [179, 10]]
  const c = geometryPoint({ type: 'Polygon', coordinates: [ring] })
  check('a normalised polygon across 180° has its centroid at 180.5°', near(c[0], 180.5, 1e-9) && near(c[1], 11, 1e-9))
  const d = densifyLonLat([[140, 0], [150, 0]], 50)
  check('densify splits a 1,113 km leg into 50 km steps', d.length === 24 && d[0][0] === 140 && d.at(-1)[0] === 150, String(d.length))
}

const lib = join(here, 'lib/geo.mjs')
if (existsSync(lib)) {
  console.log("tools/lib/geo.mjs: the bakes' copy")
  const L = await import(lib)
  let same = true
  for (const kind of ['aeqd', 'laea', 'equirect']) {
    const a = new TableProjection({ ...V1, kind })
    const b = new L.TableProjection({ ...V1, kind })
    for (let lon = 78; lon <= 205; lon += 7) {
      for (let lat = -42; lat <= 56; lat += 7) {
        const pa = a.toWorld([lon, lat])
        const pb = b.toWorld([lon, lat])
        if (pa[0] !== pb[0] || pa[1] !== pb[1]) same = false
        const ia = a.toLonLat(...pa)
        const ib = b.toLonLat(...pa)
        if (ia[0] !== ib[0] || ia[1] !== ib[1]) same = false
        const ja = a.jacobianAt([lon, lat])
        const jb = b.jacobianAt([lon, lat])
        if (ja.flat().some((v, i) => v !== jb.flat()[i])) same = false
      }
    }
  }
  for (const b of Object.values(ids.boxes)) {
    const box = { projection: { kind: 'tangent', lon0: b.lon0, lat0: b.lat0, unit: 1 } }
    const pa = placement(box, table)
    const pb = L.placement(box, new L.TableProjection(V1))
    if (pa.J.flat().some((v, i) => v !== pb.J.flat()[i]) || pa.centre[0] !== pb.centre[0] || pa.centre[1] !== pb.centre[1]) same = false
  }
  check('identical to src/geo.js, bit for bit (projections, Jacobians, placements)', same)
}

console.log(failed ? `${failed} failed, ${passed} passed` : `all ${passed} passed`)
process.exitCode = failed ? 1 : 0
