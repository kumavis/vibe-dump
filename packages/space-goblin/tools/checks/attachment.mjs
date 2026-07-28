import * as THREE from 'three'
import { socketError, formatSocketError } from '../../src/attach.js'
import {
  CLIPS,
  GEARS,
  COLLIDERS,
  applyPose,
  capsuleWorld,
  fmt,
  mounts,
  pointCapsuleDist,
  segCapsuleDist,
  segSegDist,
  sharedRig,
  trimmed,
  weaponMatrix,
} from '../harness.mjs'

// ---------------------------------------------------------------------------
// Is the kit where it says it is?
//
// The bug this family is named after: the cleaver was attached with a euler
// triple found by a brute-force search against a *proxy* objective — where the
// tip ends up over the run — instead of against the constraint that actually
// matters, which is that the handle passes through the fist. Measured
// afterwards it was 104.7° and 17.8 mm out. The handle ran along the fingers
// and out through the palm, and every screenshot of it looked plausible,
// because a cleaver near a hand reads as a cleaver in a hand.
//
// So there are two kinds of check here, and both are needed:
//
//   1. the mate is exact        — the plug frame coincides with the socket
//   2. the result is habitable  — over every clip, the blade is not inside his
//                                 head, his chest or the floor
//
// (1) alone passes a perfectly-seated cleaver that saws his own ear off; (2)
// alone is what the original euler search was, and it is how we got here.
// ---------------------------------------------------------------------------

export const name = 'attachment'

/**
 * How far a mated plug may miss its socket. Straight from `character.js`, which
 * warns at the same numbers at runtime — this is the same assertion, moved
 * somewhere it fails a build instead of scrolling past in a console.
 * `mate()` is exact, so anything above float noise means a mount is not using
 * it.
 */
const AXIS_MAX_DEG = 1
const OFFSET_MAX = 0.001

/**
 * How close the cleaver may come to the goblin's own head and torso capsules.
 * 12 cm is the figure `character.js` already argues the seat against (the
 * little-finger-side grip clears 0.232 m where the thumb-side one manages
 * 0.110 m and is rejected for it), so the suite holds the shipped seat to the
 * number it was chosen by.
 */
const BODY_CLEAR_MIN = 0.12

/**
 * How low the cleaver tip may swing. The ground is y = 0; 12 cm keeps the
 * point off the flat through the combo's backhand, which is the low point of
 * the show at 0.141 m.
 */
const TIP_MIN_Y = 0.12

/**
 * Blade-versus-head is not a clearance, it is an intersection: any negative
 * number at all is steel inside the skull. The tolerance is zero and the
 * measurement is reported so the margin is visible.
 */
const HEAD_INTERSECT_TOL = 0

/**
 * Minimum gap between two carried weapons, measured centreline to centreline.
 *
 * This understates on purpose — it is span against span, so it knows nothing
 * about the blade being 60 mm wide or the pistol's drum standing 32 mm off its
 * bore. Measured on the shipped seat: 61 mm cleaver/pistol, 165 mm
 * cleaver/buckler, 266 mm pistol/buckler. (Mesh against mesh, the same seat
 * gives 16 mm, and the holster angle it replaced gave 1 mm — the cleaver and
 * the pistol traded paint every stride.) The fence is 20 mm: below anything
 * today, far above the hundreds of millimetres a weapon swung through another
 * one would move it.
 */
const WEAPON_CLEAR_MIN = 0.02

const M = mounts()

const HEAD_CAPSULES = COLLIDERS.filter((c) => c[0] === 'head')
const TORSO_CAPSULES = COLLIDERS.filter((c) => ['hips', 'spine02', 'chest'].includes(c[0]))

/**
 * The long axis of each weapon in its own local space, as a segment. These are
 * the parts that can end up inside somebody: the blade from guard to tip, the
 * gun from butt to muzzle, the buckler across its rim.
 */
const SPANS = {
  cleaver: [M.cleaver.gear.anchors.guard.pos, M.cleaver.gear.anchors.tip.pos],
  pistol: [M.pistol.gear.anchors.lanyard.pos, M.pistol.gear.anchors.muzzle.pos],
  buckler: [M.buckler.gear.anchors.rim.pos, M.buckler.gear.anchors.rim.pos.clone().negate()],
}

/** One pass over every clip, collecting the world-space spans of every weapon. */
let _swept = null
function swept() {
  if (_swept) return _swept
  const rig = sharedRig
  const frames = []
  const mat = new THREE.Matrix4()
  for (const clip of CLIPS) {
    for (let i = 0; i < clip.samples; i++) {
      const t = i / clip.samples
      applyPose(rig, clip.pose(t))
      const f = { clip: clip.name, t, spans: {}, caps: {} }
      for (const [name, mount] of Object.entries(M)) {
        weaponMatrix(rig, mount, mat)
        f.spans[name] = SPANS[name].map((p) => p.clone().applyMatrix4(mat))
      }
      f.caps.head = HEAD_CAPSULES.map((c) => capsuleWorld(rig, c))
      f.caps.torso = TORSO_CAPSULES.map((c) => capsuleWorld(rig, c))
      frames.push(f)
    }
  }
  _swept = frames
  return frames
}

/** Track the single worst frame of some per-frame measurement. */
function worstOf(measure) {
  let worst = { v: Infinity, clip: '', t: 0, what: '' }
  for (const f of swept()) {
    const r = measure(f)
    if (r && r.v < worst.v) worst = { ...r, clip: f.clip, t: f.t }
  }
  return worst
}

export const checks = [
  {
    name: 'every weapon mates its socket exactly',
    run() {
      const bad = []
      const lines = []
      for (const [name, mount] of Object.entries(M)) {
        const err = socketError(trimmed(mount.socket, mount.trim), mount.plug, mount.placed)
        lines.push(`${name} ${err.axisDeg.toExponential(0)}°/${(err.offset * 1000).toExponential(0)}mm`)
        if (err.axisDeg > AXIS_MAX_DEG || err.offset > OFFSET_MAX) {
          bad.push(
            `${formatSocketError(name, err)} on ${mount.bone} — limits ${AXIS_MAX_DEG}° / ${fmt.mm(OFFSET_MAX)}. ` +
              `The plug's long axis is ${err.axisDeg.toFixed(1)}° off the socket's and its centre is ` +
              `${fmt.mm(err.offset)} away (${fmt.mm(err.alongAxis)} along the socket axis, ${fmt.mm(err.alongNormal)} ` +
              `off the palm). At ${err.axisDeg.toFixed(0)}° the handle is not in the fist, it is across it.`,
          )
        }
      }
      return {
        pass: bad.length === 0,
        // Deliberately measured once, not per frame: a socket is a frame in the
        // bone's own local space and the holder is a child of that bone, so the
        // error is a constant of the mount. Sampling it 720 times would be
        // theatre. What *does* vary per frame is where that lands in the world,
        // which is every other check in this file.
        measured: lines.join('  '),
        detail: bad.join('\n'),
      }
    },
  },

  {
    name: 'the roll trim is the angle it claims',
    run() {
      // `mate` folds `trim.roll` into the quaternion, so the only way to know it
      // survived is to measure the residual roll about the socket axis. It is
      // the one dial a human turns on this system; if it silently did nothing,
      // the blade's flat would face the airstream and nobody would notice.
      const bad = []
      const lines = []
      for (const [name, mount] of Object.entries(M)) {
        const asked = ((mount.trim.roll || 0) * 180) / Math.PI
        const err = socketError(trimmed(mount.socket, mount.trim), mount.plug, mount.placed)
        lines.push(`${name} ${asked.toFixed(1)}°→${err.rollDeg.toFixed(1)}°`)
        if (Math.abs(Math.abs(asked) - err.rollDeg) > 0.5) {
          bad.push(
            `${name} asked for ${asked.toFixed(2)}° of roll and the seated plug shows ${err.rollDeg.toFixed(2)}° ` +
              `about the socket axis.`,
          )
        }
      }
      return { pass: bad.length === 0, measured: lines.join('  '), detail: bad.join('; ') }
    },
  },

  {
    name: 'the cleaver tip clears his head and torso',
    run() {
      const head = worstOf((f) => {
        const tip = f.spans.cleaver[1]
        let v = Infinity
        for (const c of f.caps.head) v = Math.min(v, pointCapsuleDist(tip, c))
        return { v, what: 'head' }
      })
      const torso = worstOf((f) => {
        const tip = f.spans.cleaver[1]
        let v = Infinity
        let what = ''
        for (const c of f.caps.torso) {
          const d = pointCapsuleDist(tip, c)
          if (d < v) {
            v = d
            what = c.bone
          }
        }
        return { v, what }
      })
      const bad = []
      for (const [label, w] of [['head', head], ['torso', torso]]) {
        if (w.v < BODY_CLEAR_MIN) {
          bad.push(
            `cleaver tip is ${fmt.m(w.v)} from the ${w.what} capsule at ${fmt.at(w.clip, w.t)} — ` +
              `limit ${fmt.m(BODY_CLEAR_MIN, 2)}${w.v < 0 ? ', and a negative number means the point is inside it' : ''}.`,
          )
        }
      }
      return {
        pass: bad.length === 0,
        measured: `head ${fmt.m(head.v, 3)} (${head.clip} t=${head.t.toFixed(2)}), torso ${fmt.m(torso.v, 3)} (${torso.what}, ${torso.clip} t=${torso.t.toFixed(2)})`,
        detail: bad.join('; '),
      }
    },
  },

  {
    name: 'the cleaver tip stays off the floor',
    run() {
      const low = worstOf((f) => ({ v: f.spans.cleaver[1].y, what: 'tip y' }))
      return {
        pass: low.v >= TIP_MIN_Y,
        measured: `lowest tip ${fmt.m(low.v, 3)} at ${fmt.at(low.clip, low.t)}`,
        detail:
          low.v >= TIP_MIN_Y
            ? ''
            : `cleaver tip reaches y=${low.v.toFixed(4)} at ${fmt.at(low.clip, low.t)} (limit ${TIP_MIN_Y} m). ` +
              `The ground is y = 0 and the terrain rolls ±0.22 m under him, so a tip this low is dragging.`,
      }
    },
  },

  {
    name: 'no weapon passes through the head',
    run() {
      // Not the tip — the whole span. A blade can miss with its point and still
      // be buried to the spine, which is exactly what a proxy objective on the
      // tip position cannot see.
      const bad = []
      const lines = []
      for (const name of Object.keys(M)) {
        const w = worstOf((f) => {
          let v = Infinity
          for (const c of f.caps.head) v = Math.min(v, segCapsuleDist(f.spans[name][0], f.spans[name][1], c))
          return { v, what: name }
        })
        lines.push(`${name} ${fmt.m(w.v, 3)}`)
        if (w.v < HEAD_INTERSECT_TOL) {
          bad.push(
            `the ${name} passes ${fmt.mm(-w.v)} INSIDE the head capsule at ${fmt.at(w.clip, w.t)}. ` +
              `Not a near miss — the segment from ${SPANS[name][0].toArray().map((x) => x.toFixed(3))} to ` +
              `${SPANS[name][1].toArray().map((x) => x.toFixed(3))} in its own local space intersects the sphere.`,
          )
        }
      }
      return { pass: bad.length === 0, measured: lines.join(', '), detail: bad.join('\n') }
    },
  },

  {
    name: 'the weapons do not collide with each other',
    run() {
      const pairs = [
        ['cleaver', 'pistol'],
        ['cleaver', 'buckler'],
        ['pistol', 'buckler'],
      ]
      const bad = []
      const lines = []
      for (const [a, b] of pairs) {
        const w = worstOf((f) => ({
          v: segSegDist(f.spans[a][0], f.spans[a][1], f.spans[b][0], f.spans[b][1]),
          what: `${a}/${b}`,
        }))
        lines.push(`${a[0]}${b[0]} ${fmt.mm(w.v, 0)}`)
        if (w.v < WEAPON_CLEAR_MIN) {
          bad.push(
            `${a} and ${b} come within ${fmt.mm(w.v)} at ${fmt.at(w.clip, w.t)} (limit ${fmt.mm(WEAPON_CLEAR_MIN)}) — ` +
              `they are both rigid props, so this is two solids sharing a volume once a frame.`,
          )
        }
      }
      return { pass: bad.length === 0, measured: lines.join(', '), detail: bad.join('\n') }
    },
  },
]

/**
 * How far the cutting edge may be from the direction the tip is actually
 * travelling, at the moments it is travelling fast enough to be a strike.
 *
 * This one caught a bug the whole rest of the family was blind to. The combo's
 * wrist keys were tuned for tip speed and for keeping the blade out of his own
 * thigh, and the comment above them claimed the edge led the strike. Measured
 * against the tip's own velocity it was 63-86° off through both strikes: a
 * perfectly-seated, perfectly-clear cleaver being swung flat, at 5.9 m/s. No
 * render shows you this, because a blade at 75° still reads as a blade.
 *
 * 45° is the line between a cut and a slap. The shipped clip holds 25.8° worst.
 * SPEED_FLOOR picks out the strikes: the tip idles under 1 m/s and peaks near 6.
 *
 * Only the attack clips are held to it, and that is a real distinction rather
 * than a way to make the check pass. The run swings the blade at 129° off its
 * edge, which is correct: he is *carrying* it, and a sprinting goblin holds a
 * cleaver flat and away from his own leg, not presented edge-first at his thigh.
 * A carry and a cut want opposite things from the same wrist, which is exactly
 * why the roll is keyed to rise into each strike and fall back out of it.
 */
const EDGE_LEAD_MAX_DEG = 45
const SPEED_FLOOR = 3
const ATTACK_CLIPS = new Set(['combo'])

checks.push({
  name: 'the cleaver edge leads the strike',
  run() {
    const rig = sharedRig
    const mount = mounts().cleaver
    const tipLocal = new THREE.Vector3().copy(GEARS.cleaver.anchors.tip.pos)
    const edgeLocal = mount.plug.normal.clone()
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()

    const bad = []
    const lines = []
    for (const clip of CLIPS) {
      const N = 160
      const tips = []
      const edges = []
      for (let i = 0; i <= N; i++) {
        applyPose(rig, clip.pose(i / N))
        weaponMatrix(rig, mount, m)
        tips.push(tipLocal.clone().applyMatrix4(m))
        edges.push(edgeLocal.clone().applyQuaternion(q.setFromRotationMatrix(m)))
      }
      let worst = 0
      let worstT = 0
      let sum = 0
      let weight = 0
      for (let i = 1; i < N; i++) {
        const v = new THREE.Vector3().subVectors(tips[i + 1], tips[i - 1]).divideScalar((2 * clip.duration) / N)
        const speed = v.length()
        if (speed < SPEED_FLOOR) continue
        const deg = Math.acos(THREE.MathUtils.clamp(edges[i].dot(v.normalize()), -1, 1)) * (180 / Math.PI)
        sum += deg * speed
        weight += speed
        if (deg > worst) {
          worst = deg
          worstT = (i / N) * clip.duration
        }
      }
      if (!weight) {
        lines.push(`${clip.name} no strike`)
        continue
      }
      const attack = ATTACK_CLIPS.has(clip.name)
      lines.push(`${clip.name} ${(sum / weight).toFixed(0)}°/${worst.toFixed(0)}°${attack ? '' : ' (carry)'}`)
      if (attack && worst > EDGE_LEAD_MAX_DEG) {
        bad.push(
          `the ${clip.name} clip swings the cleaver ${worst.toFixed(1)}° off its own edge at ` +
            `${fmt.at(clip.name, worstT)} (limit ${EDGE_LEAD_MAX_DEG}°) — at that angle he is hitting ` +
            `with the flat of the blade, not the edge. The dial is the wrist's \`roll\`, in anim.js.`,
        )
      }
    }
    return { pass: bad.length === 0, measured: lines.join(', '), detail: bad.join('\n') }
  },
})
