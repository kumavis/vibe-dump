import * as THREE from 'three'
import { BAKED, CLIPS, DEG, fmt } from '../harness.mjs'
import { BONE_NAMES } from '../../src/rig.js'

// ---------------------------------------------------------------------------
// The baked clips themselves.
//
// `anim.js` samples pose functions onto `QuaternionKeyframeTrack`s and hands
// them to three's mixer. Nothing between the maths and the mixer validates
// anything: a NaN from a bad curve, a track named after a bone that was renamed
// last week, or a loop whose last frame does not equal its first all fail
// *quietly*. three will happily interpolate toward a NaN and blank the mesh, or
// silently ignore a track whose binding path resolves to nothing, and either
// way the first symptom is a screenshot that looks slightly wrong.
//
// These are cheap checks. They are here because the failure mode is silence.
// ---------------------------------------------------------------------------

export const name = 'clips'

/**
 * How far a keyframe quaternion may sit off unit length. Every rotation in
 * `anim.js` comes from `setFromAxisAngle` and `premultiply`, both of which stay
 * on the unit sphere to within a couple of ulps; measured worst across all four
 * clips is ~1e-16. 1e-6 is six orders of magnitude of slack and still tight
 * enough to catch a hand-written quaternion that was never normalised —
 * three's SLERP assumes unit length and shears the pose if it is not.
 */
const QUAT_UNIT_EPS = 1e-6

/**
 * How far a looping clip's last keyframe may sit from its first, in degrees.
 * `bakeClip({loop:true})` re-samples the pose function at t = 0 for the final
 * frame, so today this is exactly zero. The tolerance exists so the check
 * survives somebody switching the baker to sample t = 1 instead — at which
 * point a clip whose pose function is not actually periodic starts popping.
 */
const LOOP_EPS_DEG = 0.01

/**
 * How much bigger the step across the loop seam may be than the biggest step
 * the clip already takes anywhere else.
 *
 * Matching keyframes at the seam is not enough: the mixer interpolates *into*
 * the last frame from the one before it, so a pose function that only meets
 * itself because the baker forced it still snaps. The comparison is against the
 * clip's own *maximum* step rather than its median, because a sprint legitimately
 * varies its joint speed by 4x within a cycle and the median would call that a
 * fault. Measured: the run's worst seam is thighR at 5.44° against a 5.86° peak
 * step (0.93x), the idle's is 1.00x. The fence is 1.5x — the seam is allowed to
 * be the fastest moment in the clip, but not half again faster than it.
 */
const SEAM_STEP_RATIO = 1.5

const BONES = new Set(BONE_NAMES)

function tracksOf(clip) {
  return clip.tracks.map((t) => ({
    track: t,
    bone: t.name.split('.')[0],
    prop: t.name.split('.')[1],
    stride: t.getValueSize(),
  }))
}

/**
 * Angle between two quaternions read out of a flat track buffer, in degrees.
 *
 * Not `Quaternion.angleTo`, which is `2·acos(|dot|)`: near zero that loses half
 * the mantissa to cancellation, and `KeyframeTrack` stores its values as a
 * Float32Array, so two *bit-identical* keyframes come back 0.036° apart. The
 * half-angle form is stable all the way down — identical values give exactly 0
 * — and agrees with `angleTo` everywhere else.
 */
function quatAngle(values, i, j) {
  const a = new THREE.Quaternion(values[i * 4], values[i * 4 + 1], values[i * 4 + 2], values[i * 4 + 3])
  const b = new THREE.Quaternion(values[j * 4], values[j * 4 + 1], values[j * 4 + 2], values[j * 4 + 3])
  // q and -q are the same rotation; take the near pair.
  const s = a.dot(b) < 0 ? -1 : 1
  const dif = Math.hypot(a.x - s * b.x, a.y - s * b.y, a.z - s * b.z, a.w - s * b.w)
  const sum = Math.hypot(a.x + s * b.x, a.y + s * b.y, a.z + s * b.z, a.w + s * b.w)
  return 2 * Math.atan2(dif, sum) * DEG
}

export const checks = [
  {
    name: 'every track value is finite',
    run() {
      const bad = []
      let values = 0
      for (const [name, clip] of Object.entries(BAKED)) {
        for (const { track, bone, prop, stride } of tracksOf(clip)) {
          values += track.values.length
          for (let i = 0; i < track.values.length; i++) {
            if (!Number.isFinite(track.values[i])) {
              const frame = Math.floor(i / stride)
              bad.push(
                `${name}/${bone}.${prop} value ${i % stride} of keyframe ${frame} (t=${track.times[frame]?.toFixed(4)} s) ` +
                  `is ${track.values[i]}. three interpolates straight into it and the whole SkinnedMesh disappears.`,
              )
              break
            }
          }
          for (let i = 0; i < track.times.length; i++) {
            if (!Number.isFinite(track.times[i])) bad.push(`${name}/${bone}.${prop} keyframe time ${i} is ${track.times[i]}`)
            if (i && track.times[i] <= track.times[i - 1]) {
              bad.push(`${name}/${bone}.${prop} keyframe times are not increasing at ${i}: ${track.times[i - 1]} then ${track.times[i]}`)
              break
            }
          }
        }
      }
      return {
        pass: bad.length === 0,
        measured: `${Object.keys(BAKED).length} clips, ${Object.values(BAKED).reduce((a, c) => a + c.tracks.length, 0)} tracks, ${values} values`,
        detail: bad.slice(0, 5).join('\n'),
      }
    },
  },

  {
    name: 'every quaternion keyframe is unit length',
    run() {
      const bad = []
      let worst = { err: 0, where: '' }
      for (const [name, clip] of Object.entries(BAKED)) {
        for (const { track, bone, prop } of tracksOf(clip)) {
          if (prop !== 'quaternion') continue
          const v = track.values
          for (let f = 0; f * 4 < v.length; f++) {
            const len = Math.hypot(v[f * 4], v[f * 4 + 1], v[f * 4 + 2], v[f * 4 + 3])
            const err = Math.abs(len - 1)
            if (err > worst.err) worst = { err, where: `${name}/${bone} keyframe ${f}` }
            if (err > QUAT_UNIT_EPS) {
              bad.push(
                `${name}/${bone}.quaternion keyframe ${f} (t=${track.times[f].toFixed(4)} s) has |q| = ${len.toFixed(9)}, ` +
                  `${err.toExponential(2)} off unit (limit ${QUAT_UNIT_EPS}).`,
              )
              break
            }
          }
        }
      }
      return {
        pass: bad.length === 0,
        measured: `worst |q|-1 = ${worst.err.toExponential(1)} (${worst.where})`,
        detail: bad.slice(0, 5).join('\n'),
      }
    },
  },

  {
    name: 'every track names a bone that exists',
    run() {
      const bad = []
      const seen = new Set()
      for (const [name, clip] of Object.entries(BAKED)) {
        for (const { bone, prop } of tracksOf(clip)) {
          seen.add(bone)
          if (!BONES.has(bone)) {
            bad.push(
              `${name} drives "${bone}.${prop}" and there is no bone called "${bone}". three's PropertyBinding ` +
                `resolves it to nothing and drops the track without a word, so that bone simply stops animating.`,
            )
          }
        }
      }
      return {
        pass: bad.length === 0,
        measured: `${seen.size} distinct bones driven, of ${BONES.size} in the rig`,
        detail: bad.join('\n'),
      }
    },
  },

  {
    name: 'looping clips meet themselves at the seam',
    run() {
      const bad = []
      const lines = []
      for (const spec of CLIPS.filter((c) => c.loops)) {
        const clip = BAKED[spec.name]
        if (!clip) {
          bad.push(`no baked clip called "${spec.name}"`)
          continue
        }
        let worstClose = { deg: 0, bone: '' }
        let worstSeam = { ratio: 0, bone: '', step: 0, peak: 0 }
        for (const { track, bone, prop } of tracksOf(clip)) {
          if (prop !== 'quaternion') continue
          const n = track.times.length
          const close = quatAngle(track.values, 0, n - 1)
          if (close > worstClose.deg) worstClose = { deg: close, bone }
          // Steps through the clip, and the step across the seam (last real
          // frame -> first). With a duplicated final frame the seam step is
          // frame n-2 -> frame 0.
          let peak = 0
          for (let f = 1; f < n - 1; f++) peak = Math.max(peak, quatAngle(track.values, f - 1, f))
          const seam = quatAngle(track.values, n - 2, 0)
          const ratio = peak > 1e-9 ? seam / peak : seam > LOOP_EPS_DEG ? Infinity : 0
          if (ratio > worstSeam.ratio) worstSeam = { ratio, bone, step: seam, peak }
        }
        lines.push(`${spec.name} close ${worstClose.deg.toExponential(0)}° seam ${worstSeam.ratio.toFixed(2)}x`)
        if (worstClose.deg > LOOP_EPS_DEG) {
          bad.push(
            `${spec.name}: ${worstClose.bone} ends ${fmt.deg(worstClose.deg)} away from where it starts (limit ` +
              `${LOOP_EPS_DEG}°). The clip loops, so that gap is a snap once a cycle.`,
          )
        }
        if (worstSeam.ratio > SEAM_STEP_RATIO) {
          bad.push(
            `${spec.name}: ${worstSeam.bone} moves ${fmt.deg(worstSeam.step)} across the loop seam against a peak ` +
              `step of ${fmt.deg(worstSeam.peak)} anywhere else in the clip — ${worstSeam.ratio.toFixed(2)}x (limit ` +
              `${SEAM_STEP_RATIO}x). ` +
              `The keyframes match but the pose function is not periodic, so the motion still jumps there.`,
          )
        }
      }
      return { pass: bad.length === 0, measured: lines.join(', '), detail: bad.join('\n') }
    },
  },

  {
    name: 'baked clips cover their stated duration',
    run() {
      const bad = []
      const lines = []
      for (const spec of CLIPS) {
        const clip = BAKED[spec.name]
        if (!clip) {
          bad.push(`buildClips() no longer returns "${spec.name}"; tools/harness.mjs CLIPS is out of date`)
          continue
        }
        const last = Math.max(...clip.tracks.map((t) => t.times[t.times.length - 1]))
        const first = Math.min(...clip.tracks.map((t) => t.times[0]))
        lines.push(`${spec.name} ${clip.duration.toFixed(2)}s`)
        if (Math.abs(clip.duration - spec.duration) > 1e-6) {
          bad.push(`${spec.name} is ${clip.duration} s but harness.mjs samples it as ${spec.duration} s — every velocity this suite reports off it is wrong by that ratio`)
        }
        if (first !== 0 || Math.abs(last - clip.duration) > 1e-6) {
          bad.push(`${spec.name} keyframes span ${first}..${last} s inside a clip declared ${clip.duration} s`)
        }
      }
      return { pass: bad.length === 0, measured: lines.join(', '), detail: bad.join('\n') }
    },
  },
]
