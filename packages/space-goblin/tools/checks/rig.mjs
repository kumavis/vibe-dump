import * as THREE from 'three'
import { buildSkeleton, boneSegments, restPositions, BONE_DEFS, PARENT, CHILDREN, mirrorName } from '../../src/rig.js'
import { fmt } from '../harness.mjs'

// ---------------------------------------------------------------------------
// The skeleton's own invariants.
//
// `rig.js` states them in prose at the top of the file — "every bone's rest
// rotation is identity", "mirroring a pose is just negating the Y and Z euler
// components" — and every module downstream quietly relies on them. `anim.js`
// writes raw quaternions per bone and `mirrorQ` flips only y and z; that is
// only correct if the two sides are exact mirror images with identity rest
// rotations. Nothing enforced any of it until this file.
// ---------------------------------------------------------------------------

export const name = 'rig'

/**
 * Rest rotations are compared against identity exactly, not approximately:
 * `buildSkeleton` never writes a rotation, so anything other than 0 is a new
 * line of code and not accumulated float error.
 */
const IDENTITY_EPS = 0

/**
 * Mirrored bone offsets must negate x and leave y and z alone. `BONE_DEFS`
 * builds the right side by literally negating `pos[0]`, so the only way this
 * drifts is somebody hand-writing an R bone — which is exactly what it is here
 * to catch. Doubles negate exactly, so the tolerance is zero.
 */
const MIRROR_EPS = 0

/**
 * A skinning segment shorter than this is degenerate: `skinning.js` projects
 * vertices onto it and divides by its squared length, and `boneSegments` gives
 * leaves a 30 mm stub precisely so that never happens. 1 mm is a fortieth of
 * that stub — comfortably below anything intentional, comfortably above float
 * noise.
 */
const MIN_SEGMENT = 0.001

export const checks = [
  {
    name: 'rest rotations are identity',
    run() {
      const { bones } = buildSkeleton()
      let worst = { bone: null, err: 0 }
      for (const b of bones) {
        const err = Math.max(Math.abs(b.quaternion.x), Math.abs(b.quaternion.y), Math.abs(b.quaternion.z), Math.abs(1 - b.quaternion.w))
        if (err > worst.err) worst = { bone: b.name, err }
      }
      return {
        pass: worst.err <= IDENTITY_EPS,
        measured: `${bones.length} bones, worst |q - identity| ${worst.err.toExponential(1)}`,
        detail:
          worst.err > IDENTITY_EPS
            ? `bone "${worst.bone}" has a rest rotation ${worst.err.toExponential(2)} off identity (limit ${IDENTITY_EPS}). anim.js writes absolute quaternions per bone and mirrorQ negates only y and z — both are wrong the moment a bone rests rotated.`
            : '',
      }
    },
  },

  {
    name: 'L/R mirror negates x and nothing else',
    run() {
      const byName = Object.fromEntries(BONE_DEFS.map((d) => [d.name, d]))
      const rest = restPositions()
      let pairs = 0
      const bad = []
      for (const d of BONE_DEFS) {
        if (!/L\d*$/.test(d.name)) continue
        const other = mirrorName(d.name)
        const m = byName[other]
        if (!m) {
          bad.push(`${d.name} has no mirror "${other}"`)
          continue
        }
        pairs++
        // local offsets
        const dx = m.pos[0] + d.pos[0]
        const dy = m.pos[1] - d.pos[1]
        const dz = m.pos[2] - d.pos[2]
        if (Math.abs(dx) > MIRROR_EPS || Math.abs(dy) > MIRROR_EPS || Math.abs(dz) > MIRROR_EPS) {
          bad.push(`${d.name}/${other} local offset off by (${fmt.mm(dx, 3)}, ${fmt.mm(dy, 3)}, ${fmt.mm(dz, 3)})`)
        }
        if (PARENT[other] !== mirrorName(PARENT[d.name] || '')) {
          bad.push(`${d.name} hangs off "${PARENT[d.name]}" but ${other} hangs off "${PARENT[other]}"`)
        }
        // and the same in world rest space, which is what attach.js measures sockets in
        const a = rest[d.name]
        const b = rest[other]
        const wx = b.x + a.x
        const wy = b.y - a.y
        const wz = b.z - a.z
        if (Math.abs(wx) > MIRROR_EPS || Math.abs(wy) > MIRROR_EPS || Math.abs(wz) > MIRROR_EPS) {
          bad.push(`${d.name}/${other} rest position off by (${fmt.mm(wx, 3)}, ${fmt.mm(wy, 3)}, ${fmt.mm(wz, 3)})`)
        }
      }
      return {
        pass: bad.length === 0,
        measured: `${pairs} mirrored pairs, ${BONE_DEFS.length} bones`,
        detail: bad.slice(0, 6).join('; ') + (bad.length > 6 ? ` (+${bad.length - 6} more)` : ''),
      }
    },
  },

  {
    name: 'no bone is its own ancestor',
    run() {
      const bad = []
      let deepest = { bone: null, depth: 0 }
      for (const d of BONE_DEFS) {
        const seen = new Set([d.name])
        let p = PARENT[d.name]
        let depth = 0
        while (p) {
          depth++
          if (seen.has(p)) {
            bad.push(`${d.name} reaches itself again at "${p}" after ${depth} hops`)
            break
          }
          seen.add(p)
          if (depth > BONE_DEFS.length) {
            bad.push(`${d.name} has a parent chain longer than the skeleton`)
            break
          }
          p = PARENT[p]
        }
        if (depth > deepest.depth) deepest = { bone: d.name, depth }
      }
      // every bone must also be reachable from root, or updateMatrixWorld never touches it
      const reachable = new Set()
      const walk = (n) => {
        reachable.add(n)
        for (const c of CHILDREN[n] || []) walk(c)
      }
      walk('root')
      for (const d of BONE_DEFS) if (!reachable.has(d.name)) bad.push(`${d.name} is not reachable from root`)
      return {
        pass: bad.length === 0,
        measured: `deepest chain ${deepest.depth} (${deepest.bone}), ${reachable.size}/${BONE_DEFS.length} reachable from root`,
        detail: bad.join('; '),
      }
    },
  },

  {
    name: 'boneSegments are non-degenerate',
    run() {
      const segs = boneSegments()
      let worst = { bone: null, len: Infinity }
      const bad = []
      for (const [bone, s] of Object.entries(segs)) {
        const len = s.a.distanceTo(s.b)
        if (!Number.isFinite(len)) bad.push(`${bone} segment is not finite`)
        if (len < worst.len) worst = { bone, len }
        if (len < MIN_SEGMENT) bad.push(`${bone} segment is ${fmt.mm(len, 3)} long (limit ${fmt.mm(MIN_SEGMENT, 1)})`)
      }
      const count = Object.keys(segs).length
      return {
        pass: bad.length === 0,
        measured: `${count} segments, shortest ${fmt.mm(worst.len)} (${worst.bone})`,
        detail: bad.join('; '),
      }
    },
  },

  {
    name: 'skeleton instantiates to the declared bone table',
    run() {
      const { bones, byName } = buildSkeleton()
      const bad = []
      if (bones.length !== BONE_DEFS.length) bad.push(`built ${bones.length} bones from ${BONE_DEFS.length} defs`)
      for (const d of BONE_DEFS) {
        const b = byName[d.name]
        if (!b) {
          bad.push(`no bone "${d.name}"`)
          continue
        }
        const want = new THREE.Vector3(...d.pos)
        if (b.position.distanceTo(want) > 0) bad.push(`${d.name} sits at ${b.position.toArray()} not ${d.pos}`)
        const parent = d.parent ? byName[d.parent] : null
        if (parent && b.parent !== parent) bad.push(`${d.name}'s parent is "${b.parent?.name}" not "${d.parent}"`)
      }
      return {
        pass: bad.length === 0,
        measured: `${bones.length} bones`,
        detail: bad.slice(0, 6).join('; '),
      }
    },
  },
]
