#!/usr/bin/env node
// Proves the UNDECORATED utah-teapot surface against Newell's patches, using three.js's own
// TeapotGeometry (blinn = true, fitLid = false: Newell's data as Blinn squashed it, lid unstretched)
// as the ground truth.
//
//   node reference/utah-teapot/check-form.mjs [--q 1] [--segments 16]
//
// 1. data:  our patch evaluation (src/artifacts/utah-teapot/newell.js + form.js scale/axes) vs
//           every TeapotGeometry vertex at the same (s, t)  → max |Δ| mm (the copy and the scale)
// 2. mesh:  every TeapotGeometry vertex vs the nearest point of the meshes the artifact actually
//           builds (shell.js, relief off) → max / rms distance mm (includes our tessellation's chord error)
// Exit 1 if (2) exceeds 0.2 mm.

import * as THREE from 'three'
import { TeapotGeometry } from 'three/examples/jsm/geometries/TeapotGeometry.js'
import { S } from '../../src/artifacts/utah-teapot/form.js'
import { patchPoint } from '../../src/artifacts/utah-teapot/form.js'
import { buildShell } from '../../src/artifacts/utah-teapot/shell.js'

const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? Number(process.argv[i + 1]) : d }
const q = arg('q', 1)
const n = arg('segments', 16)

// TeapotGeometry: y = trueSize·(z − 1.575), trueSize = size / 1.575 → size = 1.575·S, then lift by 1.575·S
const tg = new TeapotGeometry(1.575 * S, n, true, true, true, false, true)
const pos = tg.getAttribute('position')
const per = (n + 1) * (n + 1)
const lift = 1.575 * S

// ---- 1. data
let dataMax = 0
const p = [0, 0, 0]
for (let patch = 0; patch < 32; patch++) {
  for (let si = 0; si <= n; si++) {
    for (let ti = 0; ti <= n; ti++) {
      const k = patch * per + si * (n + 1) + ti
      const x = pos.getX(k), y = pos.getY(k) + lift, z = pos.getZ(k)
      // TeapotGeometry's (sstep, tstep) loop: s walks the patch's columns, t its rows (transposed g)
      patchPoint(patch, si / n, ti / n, p)
      dataMax = Math.max(dataMax, Math.hypot(p[0] - x, p[1] - y, p[2] - z))
    }
  }
}

// ---- 2. mesh (outer skins only: what you see)
const t0 = Date.now()
const shell = buildShell({ q })
const tris = []
let triCount = 0
const tri = new THREE.Triangle(), pt = new THREE.Vector3(), cp = new THREE.Vector3()
for (const s of shell) {
  if (s.kind !== 'outer') continue
  const g = s.geo
  const P = g.getAttribute('position'), I = g.index
  // only the outer skin: buildSurface puts it first (nu+1)(nv+1) vertices
  const { nu, nv } = g.userData
  const outerN = (nu + 1) * (nv + 1)
  for (let i = 0; i < I.count; i += 3) {
    const a = I.getX(i), b = I.getX(i + 1), c = I.getX(i + 2)
    if (a >= outerN || b >= outerN || c >= outerN) continue
    tri.a.set(P.getX(a), P.getY(a), P.getZ(a)); tri.b.set(P.getX(b), P.getY(b), P.getZ(b)); tri.c.set(P.getX(c), P.getY(c), P.getZ(c))
    if (tri.getArea() < 1e-8) continue // the poles' degenerate fans
    tris.push([P.getX(a), P.getY(a), P.getZ(a), P.getX(b), P.getY(b), P.getZ(b), P.getX(c), P.getY(c), P.getZ(c)])
  }
  triCount += I.count / 3
}
// uniform grid over triangle bboxes
const CELL = 4
const grid = new Map()
const key = (i, j, k) => i + ',' + j + ',' + k
tris.forEach((t, idx) => {
  const lo = [0, 1, 2].map((a) => Math.floor(Math.min(t[a], t[a + 3], t[a + 6]) / CELL))
  const hi = [0, 1, 2].map((a) => Math.floor(Math.max(t[a], t[a + 3], t[a + 6]) / CELL))
  for (let i = lo[0]; i <= hi[0]; i++) for (let j = lo[1]; j <= hi[1]; j++) for (let k = lo[2]; k <= hi[2]; k++) {
    const kk = key(i, j, k)
    let l = grid.get(kk)
    if (!l) grid.set(kk, (l = []))
    l.push(idx)
  }
})
function nearest(x, y, z) {
  pt.set(x, y, z)
  const ci = Math.floor(x / CELL), cj = Math.floor(y / CELL), ck = Math.floor(z / CELL)
  let best = Infinity
  for (let r = 0; r <= 3 && best > (r - 1) * CELL; r++) {
    for (let i = ci - r; i <= ci + r; i++) for (let j = cj - r; j <= cj + r; j++) for (let k = ck - r; k <= ck + r; k++) {
      if (Math.max(Math.abs(i - ci), Math.abs(j - cj), Math.abs(k - ck)) !== r) continue
      const l = grid.get(key(i, j, k))
      if (!l) continue
      for (const idx of l) {
        const t = tris[idx]
        tri.a.set(t[0], t[1], t[2]); tri.b.set(t[3], t[4], t[5]); tri.c.set(t[6], t[7], t[8])
        tri.closestPointToPoint(pt, cp)
        best = Math.min(best, cp.distanceTo(pt))
      }
    }
  }
  return best
}
const GROUPS = ['rim', 'rim', 'rim', 'rim', 'body', 'body', 'body', 'body', 'body', 'body', 'body', 'body', 'handle', 'handle', 'handle', 'handle', 'spout', 'spout', 'spout', 'spout', 'lid', 'lid', 'lid', 'lid', 'lid', 'lid', 'lid', 'lid', 'bottom', 'bottom', 'bottom', 'bottom']
const stats = {}
let all = { max: 0, sum2: 0, n: 0, at: null }
for (let patch = 0; patch < 32; patch++) {
  const g = GROUPS[patch]
  const st = (stats[g] ??= { max: 0, sum2: 0, n: 0 })
  for (let k = patch * per; k < (patch + 1) * per; k++) {
    const x = pos.getX(k), y = pos.getY(k) + lift, z = pos.getZ(k)
    const d = nearest(x, y, z)
    st.max = Math.max(st.max, d); st.sum2 += d * d; st.n++
    if (d > all.max) all = { ...all, max: d, at: [x, y, z].map((v) => +v.toFixed(1)) }
    all.sum2 += d * d; all.n++
  }
}
const f = (v) => v.toFixed(4)
console.log(`utah-teapot form check — scale ${S.toFixed(4)} mm per Newell unit (spout tip → handle back = 240 mm)`)
console.log(`1. patch data vs TeapotGeometry (${32 * per} vertices, segments ${n}): max ${dataMax.toExponential(2)} mm`)
console.log(`2. TeapotGeometry vertices vs our undecorated meshes at q ${q} (${tris.length} outer triangles, ${Date.now() - t0} ms):`)
for (const [g, st] of Object.entries(stats)) console.log(`   ${g.padEnd(7)} max ${f(st.max)} mm   rms ${f(Math.sqrt(st.sum2 / st.n))} mm`)
console.log(`   ALL     max ${f(all.max)} mm   rms ${f(Math.sqrt(all.sum2 / all.n))} mm   (worst at ${all.at})`)
const ok = all.max < 0.2 && dataMax < 1e-3
console.log(ok ? 'PASS (< 0.2 mm)' : 'FAIL')
process.exit(ok ? 0 : 1)
