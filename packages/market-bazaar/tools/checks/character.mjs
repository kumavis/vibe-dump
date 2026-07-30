// Level 0 + Level 1 checks for the character stack (rig → body → skin → anim).
// Headless, no DOM. Run: node tools/checks/character.mjs   (from the package dir)
//
// Level 0 (geometry invariants): finite attributes, positive signed volume for
// closed primitive parts, zero degenerate triangles, weight rows sum to 1,
// crown lands at the declared height, triangle budget.
// Level 1 (posed FK): across idle/walk/gestures — no NaN quaternions, feet
// contact the ground within tolerance during walk stance, nothing sinks or
// flies, hands keep clear of the spine.

import * as THREE from 'three'
import { buildCharacter } from '../../src/character.js'
import { restPositions } from '../../src/rig.js'

const failures = []
const check = (cond, msg) => {
  if (!cond) failures.push(msg)
}

const _a = new THREE.Vector3()
const _b = new THREE.Vector3()
const _c = new THREE.Vector3()
const _t = new THREE.Vector3()

function signedVolume(g) {
  const p = g.attributes.position
  const idx = g.index
  let v = 0
  if (idx) {
    for (let i = 0; i < idx.count; i += 3) {
      _a.fromBufferAttribute(p, idx.getX(i))
      _b.fromBufferAttribute(p, idx.getX(i + 1))
      _c.fromBufferAttribute(p, idx.getX(i + 2))
      v += _a.dot(_t.crossVectors(_b, _c)) / 6
    }
  } else {
    for (let i = 0; i < p.count; i += 3) {
      _a.fromBufferAttribute(p, i)
      _b.fromBufferAttribute(p, i + 1)
      _c.fromBufferAttribute(p, i + 2)
      v += _a.dot(_t.crossVectors(_b, _c)) / 6
    }
  }
  return v
}

function isClosedPrimitive(g) {
  const t = g.type
  if (t === 'SphereGeometry' || t === 'CapsuleGeometry' || t === 'ConeGeometry' || t === 'OctahedronGeometry')
    return true
  if (t === 'CylinderGeometry') return !g.parameters.openEnded
  if (t === 'TorusGeometry') return Math.abs((g.parameters.arc ?? Math.PI * 2) - Math.PI * 2) < 1e-6
  return false
}

// three r160's lathe-based Capsule/Cone primitives contain exact-zero-area
// triangles at their poles/tips by construction (measured, not assumed —
// capsule(8 radial): 16, cone(7): 7). Those are benign. What we must catch is
// *slivers* — tiny-but-nonzero area from a botched transform — and flattened
// parts (a zero somewhere in a scale), which the bbox test below covers.
function sliverTris(g) {
  const p = g.attributes.position
  const idx = g.index
  let bad = 0
  const n = idx ? idx.count : p.count
  for (let i = 0; i < n; i += 3) {
    const i0 = idx ? idx.getX(i) : i
    const i1 = idx ? idx.getX(i + 1) : i + 1
    const i2 = idx ? idx.getX(i + 2) : i + 2
    _a.fromBufferAttribute(p, i0)
    _b.fromBufferAttribute(p, i1).sub(_a)
    _c.fromBufferAttribute(p, i2).sub(_a)
    const l = _t.crossVectors(_b, _c).lengthSq()
    if (l > 1e-30 && l < 1e-16) bad++ // below 1e-30 is pole float-noise, not a sliver
  }
  return bad
}

const allFinite = (arr) => {
  for (let i = 0; i < arr.length; i++) if (!Number.isFinite(arr[i])) return false
  return true
}

function distToSegment(p, a, b) {
  _t.subVectors(b, a)
  const len2 = _t.lengthSq()
  const s = len2 > 1e-12 ? THREE.MathUtils.clamp(_c.subVectors(p, a).dot(_t) / len2, 0, 1) : 0
  return _c.copy(a).addScaledVector(_t, s).distanceTo(p)
}

// ---------------------------------------------------------------------------

const SPECIES = ['human', 'alien', 'monster', 'devil']
const ROLES = ['customer', 'vendor', 'busker']
let totalTris = 0
let built = 0
const rows = []

for (const species of SPECIES) {
  for (let s = 0; s < 6; s++) {
    const role = ROLES[s % 3]
    const seed = 1000 * SPECIES.indexOf(species) + s * 17 + 3
    const ch = buildCharacter({ seed, species, role })
    built++

    // -- Level 0 over the pre-merge parts
    for (const part of ch.parts) {
      const g = part.geometry
      check(allFinite(g.attributes.position.array), `${species}#${s}: non-finite positions in a ${g.type}`)
      if (isClosedPrimitive(g)) {
        const v = signedVolume(g)
        check(v > 0, `${species}#${s}: ${g.type} signed volume ${v.toExponential(2)} ≤ 0 (inside-out)`)
      }
      check(sliverTris(g) === 0, `${species}#${s}: sliver triangles in ${g.type}`)
      g.computeBoundingBox()
      const ext = _t.subVectors(g.boundingBox.max, g.boundingBox.min)
      check(
        Math.min(ext.x, ext.y, ext.z) > 1e-4,
        `${species}#${s}: ${g.type} flattened (extent ${ext.x.toFixed(4)},${ext.y.toFixed(4)},${ext.z.toFixed(4)})`,
      )
    }

    // -- merged + skinned geometry
    const geo = ch.mesh.geometry
    check(allFinite(geo.attributes.position.array), `${species}#${s}: merged positions non-finite`)
    check(allFinite(geo.attributes.color.array), `${species}#${s}: merged colors non-finite`)
    const w = geo.attributes.skinWeight.array
    let badRows = 0
    for (let i = 0; i < geo.attributes.skinWeight.count; i++) {
      const sum = w[i * 4] + w[i * 4 + 1] + w[i * 4 + 2] + w[i * 4 + 3]
      if (Math.abs(sum - 1) > 1e-3) badRows++
    }
    check(badRows === 0, `${species}#${s}: ${badRows} skin weight rows do not sum to 1`)

    const tris = (geo.index ? geo.index.count : geo.attributes.position.count) / 3
    totalTris += tris
    check(tris < 8000, `${species}#${s}: ${tris} tris exceeds budget 8000`)

    // -- proportions: crown ~ declared height, feet at 0
    const rest = restPositions(ch.defs)
    const crown = rest.headTop.y
    check(
      Math.abs(crown - ch.appearance.height) < ch.appearance.height * 0.06,
      `${species}#${s}: crown ${crown.toFixed(2)} vs declared height ${ch.appearance.height.toFixed(2)}`,
    )

    // -- Level 1: pose the skeleton through idle, walk, and every gesture
    const b = ch.rig.byName
    const ctl = { speed: 0, gesture: 'none', speaking: false, lookYaw: 0, lookPitch: 0 }
    const dt = 1 / 30
    let t = 0
    const sample = (label, expectContact) => {
      ch.rig.root.updateMatrixWorld(true)
      for (const bone of ch.rig.bones) {
        const e = bone.matrixWorld.elements
        for (let i = 0; i < 16; i++) {
          if (!Number.isFinite(e[i])) {
            failures.push(`${species}#${s} ${label}: NaN in bone ${bone.name}`)
            return
          }
        }
      }
      const toeL = _a.setFromMatrixPosition(b.toeL.matrixWorld).clone()
      const toeR = _b.setFromMatrixPosition(b.toeR.matrixWorld).clone()
      const lowToe = Math.min(toeL.y, toeR.y)
      const crownY = _c.setFromMatrixPosition(b.headTop.matrixWorld).y
      rows.push([`${species}#${s}`, label, lowToe, crownY])
      check(lowToe > -0.035, `${species}#${s} ${label}: toe sinks to ${lowToe.toFixed(3)}`)
      if (expectContact) check(lowToe < 0.09, `${species}#${s} ${label}: lowest toe floats at ${lowToe.toFixed(3)}`)
      check(crownY > ch.appearance.height * 0.55, `${species}#${s} ${label}: crown collapsed to ${crownY.toFixed(2)}`)
      // hands keep clear of the spine
      const hipsW = _t.setFromMatrixPosition(b.hips.matrixWorld).clone()
      const chestW = _c.setFromMatrixPosition(b.chest.matrixWorld).clone()
      for (const hand of [b.handL, b.handR]) {
        const hp = _a.setFromMatrixPosition(hand.matrixWorld)
        const d = distToSegment(hp, hipsW, chestW)
        check(d > 0.05, `${species}#${s} ${label}: hand ${d.toFixed(3)} m from spine (embedded)`)
      }
    }

    // idle
    for (let i = 0; i < 45; i++) {
      ch.animator.update((t += dt), dt, ctl)
    }
    sample('idle', true)
    // walk: sample several phases
    ctl.speed = 1.1
    for (let i = 0; i < 120; i++) {
      ch.animator.update((t += dt), dt, ctl)
      if (i > 60 && i % 10 === 0) sample(`walk@${i}`, false)
    }
    // stance contact: over a full cycle the lowest toe must touch near 0
    let minToe = Infinity
    let maxToe = -Infinity
    for (let i = 0; i < 90; i++) {
      ch.animator.update((t += dt), dt, ctl)
      ch.rig.root.updateMatrixWorld(true)
      const y = Math.min(
        _a.setFromMatrixPosition(b.toeL.matrixWorld).y,
        _b.setFromMatrixPosition(b.toeR.matrixWorld).y,
      )
      minToe = Math.min(minToe, y)
      maxToe = Math.max(maxToe, y)
    }
    check(minToe > -0.035, `${species}#${s} walk: toe bottoms out at ${minToe.toFixed(3)}`)
    check(minToe < 0.045, `${species}#${s} walk: never plants (min toe ${minToe.toFixed(3)})`)
    ctl.speed = 0
    for (const gesture of ['talk', 'offer', 'refuse', 'agree', 'angry', 'browse', 'wave', 'bow', 'drum', 'flute', 'clap']) {
      ctl.gesture = gesture
      ctl.speaking = gesture === 'talk'
      for (let i = 0; i < 40; i++) ch.animator.update((t += dt), dt, ctl)
      sample(gesture, true)
      ctl.gesture = 'none'
      for (let i = 0; i < 20; i++) ch.animator.update((t += dt), dt, ctl)
    }
  }
}

console.log(`built ${built} characters, mean tris ${(totalTris / built).toFixed(0)}`)
const walkRows = rows.filter((r) => String(r[1]).startsWith('walk'))
const toes = walkRows.map((r) => r[2])
console.log(
  `walk toe-height across samples: min ${Math.min(...toes).toFixed(3)}  max ${Math.max(...toes).toFixed(3)}`,
)

if (failures.length) {
  console.error(`\nCHARACTER CHECKS: ${failures.length} failure(s)`)
  for (const f of failures.slice(0, 40)) console.error('  ✗ ' + f)
  process.exit(1)
}
console.log('CHARACTER CHECKS: all passed')
