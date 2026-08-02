/* =====================================================================
   SMF 00 — GRADUATION · headless harness
   Autoplayer plays through act() only, with human-ish (seeded,
   deterministic) delays: hand-places three identical lines, adopts the
   echo when offered, meets the mismatch pocket after the surge, drops
   back to hand placement to fix it, and rides the demand ramp to
   contractMet. Run: node harness.mjs
   ===================================================================== */

import { performance } from 'node:perf_hooks'
import {
  createSim, DT, GW, GH, STAMP_COST, rotN,
  T_GROUND, T_ROCK, T_ORE,
} from './src/sim.js'

const T_MAX = 300

/* seeded rng for human-ish delays — determinism per the shared conventions */
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/* ------------------------------ autoplayer ------------------------------ */

function createAutoplayer(sim) {
  const s = sim.state
  const rng = mulberry32(7)
  const gap = (a, b) => a + rng() * (b - a)
  const plan = [] // { at, action }
  let freeAt = 0
  const push = (action, g) => {
    freeAt = Math.max(freeAt, s.t) + g
    plan.push({ at: freeAt, action })
  }

  // three identical hand lines on patch A — furnace north of extractor
  const handTargets = [
    { ext: [3, 1], fur: [3, 0] },
    { ext: [4, 1], fur: [4, 0] },
    { ext: [5, 1], fur: [5, 0] },
  ]

  const STAMP_TARGET = 11
  let noticed = false
  let pocketQueued = false

  const patchAt = (gx, gz) => s.patchOf[gx + gz * GW]
  const isMismatch = (pi) => pi >= 0 && s.patches[pi].mismatch

  function findPocket() {
    // an ore cell of the mismatch patch with a free diagonal ground cell
    const diag = [[1, 1], [1, -1], [-1, 1], [-1, -1]]
    for (const p of s.patches) {
      if (!p.mismatch) continue
      for (const ix of p.cells) {
        const gx = ix % GW, gz = (ix / GW) | 0
        if (sim.canPlace('extractor', gx, gz)) continue
        for (const [dx, dz] of diag) {
          if (sim.canPlace('furnace', gx + dx, gz + dz) === null)
            return { anchor: [gx, gz], hand: [gx + dx, gz + dz] }
        }
      }
    }
    return null
  }

  function findStampCandidate() {
    const cur = s.echo.rot
    for (let r = 0; r < 4; r++) {
      const rot = (cur + r) & 3
      const off = rotN(s.echo.base, rot)
      for (let gz = 0; gz < GH; gz++) {
        for (let gx = 0; gx < GW; gx++) {
          const pi = patchAt(gx, gz)
          if (pi < 0 || isMismatch(pi)) continue
          if (sim.canPlace('extractor', gx, gz)) continue
          if (sim.canPlace('furnace', gx + off[0], gz + off[1])) continue
          return { gx, gz, rot }
        }
      }
    }
    return null
  }

  function decide() {
    // Phase 1 — hand placement until the echo is offered
    if (!s.echo.unlocked) {
      if (handTargets.length && s.matter >= STAMP_COST) {
        const t = handTargets.shift()
        push({ type: 'select', tool: 'extractor' }, gap(1.2, 2.0))
        push({ type: 'place', gx: t.ext[0], gz: t.ext[1] }, gap(0.5, 0.9))
        push({ type: 'select', tool: 'furnace' }, gap(0.4, 0.7))
        push({ type: 'place', gx: t.fur[0], gz: t.fur[1] }, gap(0.5, 0.9))
      }
      return
    }
    // Phase 2 — notice the new card, adopt it
    if (!noticed) {
      noticed = true
      push({ type: 'select', tool: 'echo' }, gap(2.0, 3.0))
      return
    }
    // Phase 3 — after the surge, walk into the pocket: stamp, fail,
    // rotate, fail, then descend to L0 and place by hand
    if (!pocketQueued && s.flags.surge) {
      pocketQueued = true
      const pk = findPocket()
      if (!pk) return
      if (s.tool !== 'echo') push({ type: 'select', tool: 'echo' }, gap(0.8, 1.2))
      push({ type: 'place', gx: pk.anchor[0], gz: pk.anchor[1] }, gap(1.2, 1.8)) // rejected
      push({ type: 'rotate' }, gap(0.6, 0.9))
      push({ type: 'place', gx: pk.anchor[0], gz: pk.anchor[1] }, gap(0.5, 0.8)) // rejected
      push({ type: 'select', tool: 'extractor' }, gap(1.8, 2.6)) // the realization
      push({ type: 'place', gx: pk.anchor[0], gz: pk.anchor[1] }, gap(0.5, 0.9))
      push({ type: 'select', tool: 'furnace' }, gap(0.4, 0.7))
      push({ type: 'place', gx: pk.hand[0], gz: pk.hand[1] }, gap(0.5, 0.9))
      return
    }
    if (pocketQueued && !s.flags.mismatchResolved) return
    // Phase 4 — stamp, stamp, stamp
    if (s.stampedLines < STAMP_TARGET && s.matter >= STAMP_COST) {
      const c = findStampCandidate()
      if (!c) return
      if (s.tool !== 'echo') push({ type: 'select', tool: 'echo' }, gap(0.6, 1.0))
      const rots = (c.rot - s.echo.rot + 4) & 3
      for (let i = 0; i < rots; i++) push({ type: 'rotate' }, gap(0.3, 0.5))
      push({ type: 'place', gx: c.gx, gz: c.gz }, gap(0.9, 1.5))
    }
  }

  return {
    tick() {
      while (plan.length && s.t >= plan[0].at) sim.act(plan.shift().action)
      if (!plan.length) decide()
    },
  }
}

/* ------------------------------ assertions ------------------------------ */

const failures = []
const check = (cond, msg) => { if (!cond) failures.push(msg) }

function checkMapInvariants(s) {
  const ter = (gx, gz) =>
    gx < 0 || gx >= GW || gz < 0 || gz >= GH ? T_ROCK : s.terrain[gx + gz * GW]
  const orth = [[0, -1], [1, 0], [0, 1], [-1, 0]]
  const diag = [[1, 1], [1, -1], [-1, 1], [-1, -1]]
  let pockets = 0
  for (const p of s.patches) {
    const cells = p.cells.map((ix) => [ix % GW, (ix / GW) | 0])
    if (p.mismatch) {
      pockets++
      for (const [gx, gz] of cells) {
        check(
          orth.every(([dx, dz]) => ter(gx + dx, gz + dz) !== T_GROUND),
          `pocket cell (${gx},${gz}) has an orthogonal ground neighbour — echo would fit`)
      }
      check(
        cells.some(([gx, gz]) => diag.some(([dx, dz]) => ter(gx + dx, gz + dz) === T_GROUND)),
        'pocket has no diagonal ground neighbour — hand fix impossible')
    } else {
      check(
        cells.some(([gx, gz]) => orth.some(([dx, dz]) => ter(gx + dx, gz + dz) === T_GROUND)),
        `patch ${p.name} has no orthogonally stampable cell`)
    }
  }
  check(pockets === 1, `expected exactly 1 mismatch pocket, got ${pockets}`)
  check(s.patches.length >= 8 && s.patches.length <= 10,
    `expected 8-10 ore patches, got ${s.patches.length}`)
}

/* --------------------------------- run --------------------------------- */

const sim = createSim()
const s = sim.state
checkMapInvariants(s)

const ap = createAutoplayer(sim)
const wall0 = performance.now()
let ticks = 0
let stepMs = 0
while (s.t < T_MAX && !s.done) {
  ap.tick()
  const t0 = performance.now()
  sim.step(DT)
  stepMs += performance.now() - t0
  ticks++
}
const wallMs = performance.now() - wall0

/* ------------------------------- report -------------------------------- */

console.log('SMF 00 · GRADUATION — headless harness')
console.log('')
console.log('  MILESTONE TIMELINE')
const EXPECTED = ['firstLine', 'thirdLine', 'echoUnlocked', 'firstStamp',
  'surge', 'mismatchSeen', 'mismatchResolved', 'contractMet']
const fired = Object.keys(s.flags)
for (const k of fired)
  console.log(`    T+${s.flagT[k].toFixed(1).padStart(6)}s  ${k}`)

const T = s.toil
const toilBefore = T.lb ? T.cb / T.lb : NaN
const toilAfter = T.la ? T.ca / T.la : NaN
const stampedPct = s.linesCompleted ? (100 * s.stampedLines) / s.linesCompleted : 0
const pocketLine = s.lines.find((L) => s.patches[L.patch]?.mismatch)

console.log('')
console.log('  TOIL')
console.log(`    before echo : ${T.cb} clicks / ${T.lb} lines = ${toilBefore.toFixed(2)} clicks/line`)
console.log(`    after stamp : ${T.ca} clicks / ${T.la} lines = ${toilAfter.toFixed(2)} clicks/line`)
console.log(`    ratio       : ×${(toilAfter / toilBefore).toFixed(2)}`)
console.log(`    lines       : ${s.linesCompleted} total · ${s.stampedLines} stamped (${stampedPct.toFixed(0)}%) · ${s.handLines} by hand`)
console.log(`    pocket line : ${pocketLine ? (pocketLine.stamped ? 'STAMPED (?!)' : 'by hand') : 'missing'}`)
console.log('')
console.log('  PERF')
console.log(`    ${ticks} ticks · wall ${wallMs.toFixed(1)} ms (incl. autoplayer) · sim ${((stepMs * 1000) / ticks).toFixed(2)} µs/tick`)
console.log('')

/* assertions */
check(s.done, `scenario did not complete within T_MAX=${T_MAX}s (t=${s.t.toFixed(1)})`)
for (const k of EXPECTED) check(s.flags[k], `milestone '${k}' never fired`)
check(fired.join(',') === EXPECTED.join(','),
  `milestone order wrong:\n      got      ${fired.join(' → ')}\n      expected ${EXPECTED.join(' → ')}`)
check(T.lb > 0 && T.la > 0, 'toil split did not happen')
check(toilAfter <= toilBefore / 2,
  `toil not halved: before ${toilBefore.toFixed(2)}, after ${toilAfter.toFixed(2)}`)
check(stampedPct >= 60, `only ${stampedPct.toFixed(0)}% of lines stamped (need >= 60%)`)
check(pocketLine && !pocketLine.stamped, 'mismatch pocket was not resolved by hand-placed line')
check((stepMs * 1000) / ticks < 200, `sim too slow: ${((stepMs * 1000) / ticks).toFixed(1)} µs/tick`)

if (failures.length) {
  console.log('  FAIL')
  for (const f of failures) console.log(`    ✗ ${f}`)
  process.exit(1)
}
console.log('  PASS — all milestones in order, toil halved, echo carried the load')
