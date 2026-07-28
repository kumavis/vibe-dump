import * as THREE from 'three'
import { FORWARD, scrollZ } from '../../src/convention.js'
import {
  CLIPS,
  RUN_SPEED,
  bonePos,
  footContact,
  fmt,
  sharedRig,
  applyPose,
  source,
  DEG,
} from '../harness.mjs'

// ---------------------------------------------------------------------------
// Does he actually run forwards?
//
// This family exists because for the whole first version he did not. The
// character was authored FORWARD = +Z in five modules and the world scrolled
// the scenery toward +Z as well, which means the scenery and the goblin agreed
// to travel the same way — a moonwalk. Nothing caught it, because nothing
// compared the two: the world's direction lived in `world.js` and the gait's
// lived in `anim.js`, and neither module knew the other existed.
//
// So the assertion here is a *cross-module* one. Measure which way the planted
// foot slides under him, ask `convention.js` which way it sends the scenery,
// and require the two to be opposites. Everything else in the file is the
// smaller gait invariants that fall out of the same forward kinematics once you
// have the contact frames anyway.
// ---------------------------------------------------------------------------

export const name = 'locomotion'

/**
 * The world's travel direction, as a signed z, exposed so it can be asserted
 * against instead of read off a screenshot. `world.js` routes every scroll site
 * through `scrollZ()`/`FORWARD_Z`, so this scalar *is* the world's direction —
 * there is no second copy of it to disagree with.
 */
export const WORLD_TRAVEL_Z = Math.sign(scrollZ(1))

/**
 * Ground contact height for a foot marker, in metres.
 *
 * Measured, not chosen: in the bind pose the sole of the foot mesh sits 8 mm
 * below the toe bones, and over the run the lowest marker of a planted foot
 * dwells between +0.030 and -0.039 while a swinging one is above +0.09 at the
 * top of the flight phase. 0.030 is the height at which the foot is
 * unambiguously down; it selects a 17.5% stance per foot whose contact marker
 * never changes identity inside the window.
 */
const CONTACT_Y = 0.03

/**
 * How much of the cycle a run of contact frames has to cover before it counts
 * as a plant. The two real plants are 17.5% of the cycle each; the swing foot
 * also dips through contact height for 3.8% around t = 0.20 on its way forward
 * (see the "swing foot does not scuff" check, which is where that belongs).
 * 8% separates them with a factor of two either side.
 */
const MIN_STANCE_FRACTION = 0.08

/**
 * How far the deepest foot marker may sit below the ground plane, in metres.
 *
 * The goblin's ground is y = 0 (`main.js` adds his group at the scene origin).
 * The run drives the left toe tip to -0.0390 m at t = 0.121 — anim.js admits
 * to this in its own comment about keeping the bob shallow — so this fence is
 * set at 0.055, roughly 40% clear of today's worst. It catches a foot driven
 * through the floor; it does not pretend the current 39 mm is fine.
 */
const FOOT_SINK_MAX = 0.055

/**
 * How far below the ground plane the *swing* foot may pass, in metres. This is
 * a different artifact from sinking the plant: the swinging foot crosses y = 0
 * at 7.7 m/s, so a millimetre of it is a scuff and a centimetre is a foot
 * ploughing a furrow. Measured worst today: -0.0042 m at t = 0.188. Fence at
 * 0.010, a little over twice that.
 */
const SWING_SCUFF_MAX = 0.01

/**
 * How far the planted foot's mean ground speed may sit from `RUN_SPEED`, the
 * speed `main.js` scrolls the world at.
 *
 * This check found a real one: the stance carries the foot 0.351 m in 0.100 s =
 * 3.51 m/s, and `RUN_SPEED` was 4.80, so he skated a quarter of the way through
 * every stride. `RUN_SPEED` is now 3.5 and the error is +0.2%. The fence sits at
 * 0.15 — loose enough for the odd re-timing, tight enough that anyone who
 * guesses at this number again gets caught the way it was caught the first time.
 */
const FOOT_SKATE_TOL = 0.15

/**
 * How much of the cycle both feet may be off the ground. A sprint has a real
 * flight phase — demanding permanent contact would be wrong for this clip —
 * but 100% of it would mean he never lands. Measured: 62.5% airborne with a
 * peak clearance of 0.096 m. Fence at 0.75.
 */
const FLIGHT_MAX = 0.75

/**
 * Correlation floor for the contralateral swing. A perfect anti-phase arm/leg
 * pair scores -1; the run scores -0.712 (the arm swing is a cosine, the leg's
 * fore-aft reach is not, so it cannot reach -1). -0.5 is the far side of "the
 * arm is doing something else entirely".
 */
const CONTRA_CORR = -0.5

/** How far off level the head may be, in degrees. Straight from the brief. */
const HEAD_LEVEL_MAX = 15

const RUN = CLIPS.find((c) => c.name === 'run')

// ---------------------------------------------------------------------------
// One pass over the run clip, shared by every check below
// ---------------------------------------------------------------------------

function correlation(x, y) {
  const n = x.length
  const mx = x.reduce((a, b) => a + b, 0) / n
  const my = y.reduce((a, b) => a + b, 0) / n
  let num = 0
  let dx = 0
  let dy = 0
  for (let i = 0; i < n; i++) {
    num += (x[i] - mx) * (y[i] - my)
    dx += (x[i] - mx) ** 2
    dy += (y[i] - my) ** 2
  }
  return num / Math.sqrt(dx * dy || 1)
}

let _gait = null

function gait() {
  if (_gait) return _gait
  const rig = sharedRig
  const N = RUN.samples
  const dt = RUN.duration / N
  const frames = []
  for (let i = 0; i < N; i++) {
    const t = i / N
    applyPose(rig, RUN.pose(t))
    const L = footContact(rig, 'L')
    const R = footContact(rig, 'R')
    frames.push({
      t,
      i,
      L,
      R,
      lower: L.p.y <= R.p.y ? 'L' : 'R',
      hips: bonePos(rig, 'hips'),
      chest: bonePos(rig, 'chest'),
      head: bonePos(rig, 'head'),
      headTop: bonePos(rig, 'headTop'),
      handL: bonePos(rig, 'handL'),
      handR: bonePos(rig, 'handR'),
      footL: bonePos(rig, 'footL'),
      footR: bonePos(rig, 'footR'),
    })
  }

  // Contiguous, cyclic runs of "this foot is the lower one and it is down".
  const runs = []
  let cur = null
  for (let i = 0; i < 2 * N; i++) {
    const f = frames[i % N]
    const side = f.lower
    const down = f[side].p.y < CONTACT_Y
    if (down && cur && cur.side === side) cur.frames.push(f)
    else {
      if (cur) runs.push(cur)
      cur = down ? { side, frames: [f] } : null
    }
  }
  if (cur) runs.push(cur)
  // A cyclic walk of two laps sees each run twice; keep the longest instance.
  const best = new Map()
  for (const r of runs) {
    const key = `${r.side}:${r.frames[0].i}`
    if (!best.has(key) || best.get(key).frames.length < r.frames.length) best.set(key, r)
  }
  const stances = [...best.values()]
    .filter((r) => r.frames.length / N >= MIN_STANCE_FRACTION)
    .map((r) => {
      const first = r.frames[0]
      const last = r.frames[r.frames.length - 1]
      const marker = first[r.side].name
      // Velocities of one marker at a time — the contact point transfers along
      // a rolling foot, and differencing across a transfer is a fiction.
      const vs = []
      for (let j = 1; j < r.frames.length; j++) {
        const a = r.frames[j - 1]
        const b = r.frames[j]
        if (a[r.side].name !== b[r.side].name) continue
        vs.push({ t: a.t, v: (b[r.side].p.z - a[r.side].p.z) / dt })
      }
      return {
        side: r.side,
        marker,
        frames: r.frames,
        t0: first.t,
        t1: last.t,
        duration: (r.frames.length - 1) * dt,
        displacement: last[r.side].p.z - first[r.side].p.z,
        speed: (last[r.side].p.z - first[r.side].p.z) / ((r.frames.length - 1) * dt),
        vs,
      }
    })
    .sort((a, b) => a.t0 - b.t0)

  _gait = { frames, stances, dt, N }
  return _gait
}

// ---------------------------------------------------------------------------

export const checks = [
  {
    name: 'planted foot slides against FORWARD',
    run() {
      const { stances } = gait()
      const bad = []
      for (const s of stances) {
        const along = s.speed * FORWARD.z
        if (along >= 0) {
          bad.push(
            `${s.side} plant at run t=${s.t0.toFixed(3)}..${s.t1.toFixed(3)} carries ${s.marker} ${fmt.m(s.displacement)} ` +
              `= ${along.toFixed(3)} m/s ALONG FORWARD (${FORWARD.toArray()}). He is moonwalking: the ground under a ` +
              `planted foot must run backwards.`,
          )
        }
      }
      return {
        pass: bad.length === 0 && stances.length > 0,
        measured: stances.map((s) => `${s.side} ${s.speed.toFixed(2)} m/s`).join(', ') || 'no plant found',
        detail: stances.length === 0 ? `no stance longer than ${fmt.pct(MIN_STANCE_FRACTION)} of the cycle` : bad.join('; '),
      }
    },
  },

  {
    name: 'world travel opposes the goblin, and matches the feet',
    run() {
      const { stances } = gait()
      const footZ = Math.sign(stances.reduce((a, s) => a + s.speed, 0) / (stances.length || 1))
      const bad = []
      if (WORLD_TRAVEL_Z === Math.sign(FORWARD.z)) {
        bad.push(
          `convention.js sends the scenery toward z${WORLD_TRAVEL_Z > 0 ? '+' : '-'} and the goblin faces ` +
            `z${FORWARD.z > 0 ? '+' : '-'} — the scenery is running away from him at twice the speed, which is the ` +
            `original moonwalk bug.`,
        )
      }
      if (footZ !== WORLD_TRAVEL_Z) {
        bad.push(
          `the planted foot travels z${footZ > 0 ? '+' : '-'} under him at ` +
            `${Math.abs(stances[0]?.speed ?? 0).toFixed(2)} m/s but scrollZ(1) = ${scrollZ(1)} sends the world ` +
            `z${WORLD_TRAVEL_Z > 0 ? '+' : '-'}. Ground and feet must agree or he skates the whole width of the screen.`,
        )
      }
      return {
        pass: bad.length === 0,
        measured: `FORWARD.z ${FORWARD.z >= 0 ? '+' : ''}${FORWARD.z}, scrollZ(1) ${scrollZ(1)}, planted foot z${footZ > 0 ? '+' : '-'}`,
        detail: bad.join('; '),
      }
    },
  },

  {
    name: 'world.js takes its direction from convention.js',
    run() {
      // The check above can only speak for `world.js` because `world.js` has no
      // private opinion left: every scroll site routes through `scrollZ`. That
      // is a property of the source, not of the maths, so it is checked here as
      // one — `world.js` needs a WebGL context and cannot be imported.
      const src = source('src/world.js')
      const imports = /import\s*\{[^}]*\bscrollZ\b[^}]*\}\s*from\s*'\.\/convention\.js'/.test(src)
      const sites = (src.match(/scrollZ\(/g) || []).length
      const pass = imports && sites >= 4
      return {
        pass,
        measured: `${sites} scrollZ() call sites, import ${imports ? 'present' : 'MISSING'}`,
        detail: pass
          ? ''
          : imports
            ? `only ${sites} scroll sites route through scrollZ(); the ground mesh, the prop band, the dust and the mist all have to, or one of them can flip on its own and the numeric check above will not see it.`
            : `src/world.js no longer imports scrollZ from ./convention.js, so the direction check above no longer speaks for it. Route the world's scroll signs back through convention.js.`,
      }
    },
  },

  {
    name: 'planted foot does not skate against RUN_SPEED',
    run() {
      const { stances } = gait()
      const bad = []
      let worst = 0
      for (const s of stances) {
        const err = Math.abs(Math.abs(s.speed) - RUN_SPEED) / RUN_SPEED
        if (err > Math.abs(worst)) worst = (Math.abs(s.speed) - RUN_SPEED) / RUN_SPEED
        if (err > FOOT_SKATE_TOL) {
          bad.push(
            `${s.side} plant at run t=${s.t0.toFixed(3)}..${s.t1.toFixed(3)}: ${s.marker} covers ` +
              `${fmt.m(Math.abs(s.displacement))} in ${s.duration.toFixed(4)} s = ${Math.abs(s.speed).toFixed(3)} m/s, ` +
              `against main.js RUN_SPEED ${RUN_SPEED} m/s — ${fmt.pct(err)} off (limit ${fmt.pct(FOOT_SKATE_TOL)}).`,
          )
        }
      }
      const spread = stances.flatMap((s) => s.vs.map((v) => Math.abs(v.v)))
      return {
        pass: bad.length === 0,
        measured:
          `stance ${stances.map((s) => Math.abs(s.speed).toFixed(2)).join('/')} m/s vs world ${RUN_SPEED} ` +
          `(${worst >= 0 ? '+' : ''}${fmt.pct(worst)}), instantaneous ${Math.min(...spread).toFixed(2)}..${Math.max(...spread).toFixed(2)} m/s`,
        detail: bad.join('; '),
      }
    },
  },

  {
    name: 'each foot plants once a cycle, half a cycle apart',
    run() {
      const { stances, frames, N } = gait()
      const bad = []
      const sides = stances.map((s) => s.side)
      if (stances.length !== 2 || new Set(sides).size !== 2) {
        bad.push(`found ${stances.length} plants (${sides.join(', ') || 'none'}); a two-stride cycle wants exactly one per foot`)
      } else {
        const gap = Math.abs(((stances[1].t0 - stances[0].t0) % 1) - 0.5)
        if (gap > 0.06) {
          bad.push(
            `plants start at t=${stances[0].t0.toFixed(3)} (${stances[0].side}) and t=${stances[1].t0.toFixed(3)} ` +
              `(${stances[1].side}) — ${(gap * 100).toFixed(1)}% of a cycle away from the half-cycle a symmetric gait wants.`,
          )
        }
      }
      let airborne = 0
      let peak = { y: -Infinity, t: 0 }
      for (const f of frames) {
        const low = Math.min(f.L.p.y, f.R.p.y)
        if (low > CONTACT_Y) airborne++
        if (low > peak.y) peak = { y: low, t: f.t }
      }
      const flight = airborne / N
      if (flight > FLIGHT_MAX) {
        bad.push(`both feet are clear of ${fmt.m(CONTACT_Y, 3)} for ${fmt.pct(flight)} of the cycle (limit ${fmt.pct(FLIGHT_MAX)}) — he never lands.`)
      }
      return {
        pass: bad.length === 0,
        measured:
          `${stances.map((s) => `${s.side}@${s.t0.toFixed(2)}-${s.t1.toFixed(2)}`).join(' ')}, ` +
          `flight ${fmt.pct(flight)}, peak clearance ${fmt.m(peak.y, 3)} at t=${peak.t.toFixed(3)}`,
        detail: bad.join('; '),
      }
    },
  },

  {
    name: 'feet stay out of the floor',
    run() {
      const { frames } = gait()
      let sink = { y: Infinity, t: 0, marker: '' }
      let scuff = { y: Infinity, t: 0, marker: '', v: 0 }
      const { dt } = gait()
      for (let i = 0; i < frames.length; i++) {
        const f = frames[i]
        const g = frames[(i + 1) % frames.length]
        for (const side of ['L', 'R']) {
          const c = f[side]
          if (c.p.y < sink.y) sink = { y: c.p.y, t: f.t, marker: c.name }
          // The swing foot: the one that is *not* the lower of the two.
          if (side === f.lower) continue
          if (c.p.y < scuff.y) {
            const v = g[side].name === c.name ? (g[side].p.z - c.p.z) / dt : 0
            scuff = { y: c.p.y, t: f.t, marker: c.name, v }
          }
        }
      }
      const bad = []
      if (sink.y < -FOOT_SINK_MAX) {
        bad.push(
          `${sink.marker} reaches y=${sink.y.toFixed(4)} at run t=${sink.t.toFixed(3)} — ${fmt.mm(-sink.y)} below the ` +
            `ground plane (limit ${fmt.mm(FOOT_SINK_MAX)}).`,
        )
      }
      if (scuff.y < -SWING_SCUFF_MAX) {
        bad.push(
          `the swing foot's ${scuff.marker} passes y=${scuff.y.toFixed(4)} at run t=${scuff.t.toFixed(3)} while moving ` +
            `${scuff.v.toFixed(2)} m/s in z — ${fmt.mm(-scuff.y)} of furrow (limit ${fmt.mm(SWING_SCUFF_MAX)}).`,
        )
      }
      return {
        pass: bad.length === 0,
        measured: `deepest ${sink.marker} ${fmt.mm(sink.y)} at t=${sink.t.toFixed(3)}, swing-foot low ${fmt.mm(scuff.y)} at t=${scuff.t.toFixed(3)}`,
        detail: bad.join('; '),
      }
    },
  },

  {
    name: 'arms swing contralateral to the legs',
    run() {
      const { frames } = gait()
      const reach = (side) => frames.map((f) => f[`foot${side}`].z - f.hips.z)
      const arm = (side) => frames.map((f) => f[`hand${side}`].z - f.chest.z)
      const same = { L: correlation(reach('L'), arm('L')), R: correlation(reach('R'), arm('R')) }
      const cross = { L: correlation(reach('L'), arm('R')), R: correlation(reach('R'), arm('L')) }
      const bad = []
      for (const side of ['L', 'R']) {
        if (same[side] > CONTRA_CORR) {
          bad.push(
            `the ${side} arm tracks the ${side} leg at r=${same[side].toFixed(3)} (wanted <= ${CONTRA_CORR}): when the ` +
              `${side} leg reaches forward the ${side} arm must go back. r near +1 is a goblin marching like a toy soldier.`,
          )
        }
        if (cross[side] < -CONTRA_CORR) {
          bad.push(`the ${side === 'L' ? 'R' : 'L'} arm should swing *with* the ${side} leg; r=${cross[side].toFixed(3)}`)
        }
      }
      return {
        pass: bad.length === 0,
        measured: `same-side r ${same.L.toFixed(3)}/${same.R.toFixed(3)}, cross-side r ${cross.L.toFixed(3)}/${cross.R.toFixed(3)}`,
        detail: bad.join('; '),
      }
    },
  },

  {
    name: 'torso leans FORWARD and the head stays level',
    run() {
      const { frames } = gait()
      const spine = new THREE.Vector3()
      const up = new THREE.Vector3()
      let leanMin = Infinity
      let leanMax = -Infinity
      let leanWorst = { v: Infinity, t: 0 }
      let tilt = { deg: -Infinity, t: 0 }
      for (const f of frames) {
        spine.subVectors(f.chest, f.hips)
        const lean = Math.atan2(spine.dot(FORWARD), spine.y) * DEG
        leanMin = Math.min(leanMin, lean)
        leanMax = Math.max(leanMax, lean)
        if (lean < leanWorst.v) leanWorst = { v: lean, t: f.t }
        up.subVectors(f.headTop, f.head).normalize()
        const deg = Math.acos(THREE.MathUtils.clamp(up.y, -1, 1)) * DEG
        if (deg > tilt.deg) tilt = { deg, t: f.t }
      }
      const bad = []
      if (leanMin <= 0) {
        bad.push(
          `the spine leans ${fmt.deg(leanWorst.v, 1)} at run t=${leanWorst.t.toFixed(3)} — hips->chest tips AWAY from ` +
            `FORWARD (${FORWARD.toArray()}). A sprinter leans into the direction of travel.`,
        )
      }
      if (tilt.deg > HEAD_LEVEL_MAX) {
        bad.push(
          `the head is ${fmt.deg(tilt.deg, 1)} off level at run t=${tilt.t.toFixed(3)} (limit ` +
            `${HEAD_LEVEL_MAX}°) — the neck is supposed to cancel the torso lean, not follow it.`,
        )
      }
      return {
        pass: bad.length === 0,
        measured: `lean ${leanMin.toFixed(1)}..${leanMax.toFixed(1)}° toward FORWARD, head off level <= ${tilt.deg.toFixed(1)}°`,
        detail: bad.join('; '),
      }
    },
  },
]
