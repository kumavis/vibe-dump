import { CLIPS, COLLIDERS, applyPose, capsuleWorld, fmt, segSegDist, sharedRig } from '../harness.mjs'

// ---------------------------------------------------------------------------
// Does he pass through himself?
//
// The capsules in `character.js` are the only body the solver knows about: the
// cape, the straps and the necklace are pushed out of them every frame. If two
// of them interpenetrate, the cloth is being pushed two ways at once and pops
// through — and, more simply, an arm inside a ribcage looks like an arm inside
// a ribcage.
//
// These are deliberately fat proxies, so this family is a *gross* check. It
// excludes the pairs that overlap by construction (a chain of capsules along
// the spine has to overlap, or there would be gaps between them at the joints)
// and looks only for a limb somewhere it has no business being.
// ---------------------------------------------------------------------------

export const name = 'self-intersection'

/**
 * Pairs that are supposed to overlap: joints, and the torso chain. Each is
 * listed with what it measures today, so the list is a record of what was
 * looked at rather than a place to quietly bury a failure.
 *
 *   hips|spine02   +160 mm    the pelvis and the lumbar capsule are one solid
 *   spine02|chest  +237 mm    likewise the ribcage
 *   hips|chest      +15 mm    two links apart, still one torso
 *   chest|head     +126 mm    through the neck
 *   spine02|head    +68 mm    the head capsule reaches down past the collar
 *   hips|thigh*    +117 mm    the hip joint
 *   thigh*|shin*   +117 mm    the knee
 *   chest|upperarm* +71 mm    the shoulder
 *   spine02|upperarm* +80 mm  the arm hanging against the ribs
 */
const NEIGHBOURS = new Set(
  [
    ['hips', 'spine02'],
    ['spine02', 'chest'],
    ['hips', 'chest'],
    ['chest', 'head'],
    ['spine02', 'head'],
    ['hips', 'thighL'],
    ['hips', 'thighR'],
    ['thighL', 'shinL'],
    ['thighR', 'shinR'],
    ['chest', 'upperarmL'],
    ['chest', 'upperarmR'],
    ['spine02', 'upperarmL'],
    ['spine02', 'upperarmR'],
  ].map(([a, b]) => `${a}|${b}`),
)

/**
 * How deep two non-neighbouring capsules may interpenetrate, in metres.
 *
 * Measured over all four clips, the two worst honest offenders are the thighs
 * crossing each other at +12.1 mm (run t = 0.075 — his legs scissor, and the
 * 72 mm thigh capsules are wider than his actual thighs) and the guard arm
 * brushing the head capsule at +6.0 mm (combo t = 0.200). 20 mm sits clear of
 * both. It is not a tight bound and is not meant to be: it catches a limb
 * driven *through* a solid, which is tens of centimetres, not a proxy capsule
 * grazing another proxy capsule.
 */
const OVERLAP_MAX = 0.02

const PAIRS = []
for (let i = 0; i < COLLIDERS.length; i++) {
  for (let j = i + 1; j < COLLIDERS.length; j++) {
    const key = `${COLLIDERS[i][0]}|${COLLIDERS[j][0]}`
    if (NEIGHBOURS.has(key)) continue
    PAIRS.push({ i, j, key })
  }
}

export const checks = [
  {
    name: 'the exclusion list still matches the collider table',
    run() {
      // If somebody renames or drops a capsule, the exclusions above go stale
      // silently and a real overlap starts being ignored. Cheap to notice.
      const bones = new Set(COLLIDERS.map((c) => c[0]))
      const stale = [...NEIGHBOURS].filter((k) => k.split('|').some((b) => !bones.has(b)))
      return {
        pass: stale.length === 0,
        measured: `${COLLIDERS.length} capsules, ${NEIGHBOURS.size} excluded pairs, ${PAIRS.length} checked`,
        detail: stale.length
          ? `excluded pair(s) naming capsules that no longer exist: ${stale.join(', ')}. character.js's COLLIDERS changed; revisit the list in this file.`
          : '',
      }
    },
  },

  {
    name: 'no limb passes through another',
    run() {
      const rig = sharedRig
      const worst = new Map()
      let frames = 0
      for (const clip of CLIPS) {
        for (let i = 0; i < clip.samples; i++) {
          const t = i / clip.samples
          applyPose(rig, clip.pose(t))
          frames++
          const caps = COLLIDERS.map((c) => capsuleWorld(rig, c))
          for (const p of PAIRS) {
            const a = caps[p.i]
            const b = caps[p.j]
            const pen = a.r + b.r - segSegDist(a.a, a.b, b.a, b.b)
            const prev = worst.get(p.key)
            if (!prev || pen > prev.pen) worst.set(p.key, { pen, clip: clip.name, t })
          }
        }
      }
      const ranked = [...worst.entries()].sort((a, b) => b[1].pen - a[1].pen)
      const bad = ranked
        .filter(([, v]) => v.pen > OVERLAP_MAX)
        .map(
          ([k, v]) =>
            `${k} interpenetrate by ${fmt.mm(v.pen)} at ${fmt.at(v.clip, v.t)} (limit ${fmt.mm(OVERLAP_MAX)}) — ` +
            `the cloth solver is being pushed out of both at once there.`,
        )
      const top = ranked
        .slice(0, 3)
        .map(([k, v]) => `${k} ${v.pen >= 0 ? '+' : ''}${fmt.mm(v.pen, 0)}`)
        .join(', ')
      return {
        pass: bad.length === 0,
        measured: `${PAIRS.length} pairs × ${frames} frames; worst ${top}`,
        detail: bad.join('\n'),
      }
    },
  },
]
