import * as THREE from 'three'

// ---------------------------------------------------------------------------
// The skeleton
//
// 63 bones: spine, neck, head + jaw, floppy ears, a whip tail, long arms with
// three fingers and an opposed thumb per hand, and digitigrade legs.
//
// Convention that makes everything downstream simple: **every bone's rest
// rotation is identity**, i.e. all bone axes are world-aligned in the bind
// pose, and only the offsets differ. Hand-authored animation keys are then
// readable anatomy — `upperarmL.rotation.x = -1.1` is "swing the arm forward"
// no matter which limb it is, and mirroring a pose is just negating the Y and
// Z euler components. Bone *direction* is implied by where its children sit.
//
// Units are metres. The goblin stands ~1.2 m at the crown (taller with ears),
// hunched, with the arms long enough that the knuckles hang past the knees.
// ---------------------------------------------------------------------------

/** @type {{name:string, parent:string|null, pos:[number,number,number], mirror?:boolean}[]} */
const DEFS = [
  { name: 'root', parent: null, pos: [0, 0, 0] },
  { name: 'hips', parent: 'root', pos: [0, 0.6, 0] },

  // ---- spine: a real S-curve, hunched forward at the chest ----
  { name: 'spine01', parent: 'hips', pos: [0, 0.105, 0.008] },
  { name: 'spine02', parent: 'spine01', pos: [0, 0.105, 0.014] },
  { name: 'chest', parent: 'spine02', pos: [0, 0.115, -0.004] },
  { name: 'neck', parent: 'chest', pos: [0, 0.085, -0.012] },
  { name: 'head', parent: 'neck', pos: [0, 0.075, 0.03] },
  { name: 'headTop', parent: 'head', pos: [0, 0.125, -0.01] },
  { name: 'jaw', parent: 'head', pos: [0, -0.022, 0.028] },
  { name: 'jawTip', parent: 'jaw', pos: [0, -0.03, 0.07] },
  { name: 'browC', parent: 'head', pos: [0, 0.055, 0.06] },

  // ---- ears: three segments each, spring-driven so they flap ----
  { name: 'earL0', parent: 'head', pos: [0.058, 0.032, -0.014], mirror: true },
  { name: 'earL1', parent: 'earL0', pos: [0.05, 0.038, -0.052], mirror: true },
  { name: 'earL2', parent: 'earL1', pos: [0.04, 0.016, -0.056], mirror: true },
  { name: 'earL3', parent: 'earL2', pos: [0.026, -0.012, -0.046], mirror: true },

  // ---- tail: whips around under the run cycle ----
  { name: 'tail0', parent: 'hips', pos: [0, -0.012, -0.085] },
  { name: 'tail1', parent: 'tail0', pos: [0, 0.01, -0.095] },
  { name: 'tail2', parent: 'tail1', pos: [0, 0.004, -0.09] },
  { name: 'tail3', parent: 'tail2', pos: [0, -0.008, -0.082] },
  { name: 'tail4', parent: 'tail3', pos: [0, -0.02, -0.07] },

  // ---- arms ----
  { name: 'clavicleL', parent: 'chest', pos: [0.032, 0.055, 0.004], mirror: true },
  { name: 'upperarmL', parent: 'clavicleL', pos: [0.075, 0.008, -0.006], mirror: true },
  { name: 'forearmL', parent: 'upperarmL', pos: [0.225, -0.006, 0], mirror: true },
  { name: 'handL', parent: 'forearmL', pos: [0.2, 0, 0.004], mirror: true },

  { name: 'thumbL0', parent: 'handL', pos: [0.036, -0.012, 0.036], mirror: true },
  { name: 'thumbL1', parent: 'thumbL0', pos: [0.034, -0.006, 0.026], mirror: true },
  { name: 'thumbL2', parent: 'thumbL1', pos: [0.028, -0.004, 0.014], mirror: true },

  { name: 'indexL0', parent: 'handL', pos: [0.078, 0.006, 0.03], mirror: true },
  { name: 'indexL1', parent: 'indexL0', pos: [0.052, -0.002, 0.004], mirror: true },
  { name: 'indexL2', parent: 'indexL1', pos: [0.04, -0.002, 0.001], mirror: true },

  { name: 'midL0', parent: 'handL', pos: [0.082, 0.005, -0.002], mirror: true },
  { name: 'midL1', parent: 'midL0', pos: [0.058, -0.002, 0], mirror: true },
  { name: 'midL2', parent: 'midL1', pos: [0.044, -0.002, 0], mirror: true },

  { name: 'ringL0', parent: 'handL', pos: [0.072, 0.002, -0.032], mirror: true },
  { name: 'ringL1', parent: 'ringL0', pos: [0.048, -0.002, -0.006], mirror: true },
  { name: 'ringL2', parent: 'ringL1', pos: [0.034, -0.002, -0.002], mirror: true },

  // ---- legs: digitigrade, long shin, raised heel ----
  { name: 'thighL', parent: 'hips', pos: [0.082, -0.028, 0.004], mirror: true },
  { name: 'shinL', parent: 'thighL', pos: [0, -0.245, 0.012], mirror: true },
  { name: 'footL', parent: 'shinL', pos: [0, -0.235, -0.026], mirror: true },
  { name: 'toeL', parent: 'footL', pos: [0, -0.055, 0.1], mirror: true },
  { name: 'toeTipL', parent: 'toeL', pos: [0, -0.008, 0.055], mirror: true },
  { name: 'heelL', parent: 'footL', pos: [0, -0.052, -0.055], mirror: true },
]

/** Bone defs with every `mirror: true` entry duplicated onto the right side. */
export const BONE_DEFS = (() => {
  const out = []
  for (const d of DEFS) {
    out.push({ name: d.name, parent: d.parent, pos: d.pos })
    if (d.mirror) {
      out.push({
        name: d.name.replace(/L(\d*)$/, 'R$1'),
        parent: d.parent && /L\d*$/.test(d.parent) ? d.parent.replace(/L(\d*)$/, 'R$1') : d.parent,
        pos: [-d.pos[0], d.pos[1], d.pos[2]],
      })
    }
  }
  return out
})()

export const BONE_NAMES = BONE_DEFS.map((d) => d.name)

/**
 * Instantiate the skeleton.
 * @returns {{ root: THREE.Bone, bones: THREE.Bone[], byName: Record<string, THREE.Bone>, skeleton: THREE.Skeleton }}
 */
export function buildSkeleton() {
  const byName = {}
  const bones = []
  for (const def of BONE_DEFS) {
    const bone = new THREE.Bone()
    bone.name = def.name
    bone.position.set(...def.pos)
    byName[def.name] = bone
    bones.push(bone)
    if (def.parent) byName[def.parent].add(bone)
  }
  const root = byName.root
  root.updateMatrixWorld(true)
  const skeleton = new THREE.Skeleton(bones)
  return { root, bones, byName, skeleton }
}

/** World-space bind position of every bone, from the DEFS alone. */
export function restPositions() {
  const out = {}
  for (const def of BONE_DEFS) {
    const p = new THREE.Vector3(...def.pos)
    if (def.parent) p.add(out[def.parent])
    out[def.name] = p
  }
  return out
}

/** name -> [childNames]. */
export const CHILDREN = (() => {
  const map = {}
  for (const d of BONE_DEFS) map[d.name] = []
  for (const d of BONE_DEFS) if (d.parent) map[d.parent].push(d.name)
  return map
})()

export const PARENT = Object.fromEntries(BONE_DEFS.map((d) => [d.name, d.parent]))

/**
 * The medial-axis segments used for skin weighting: one segment per bone,
 * running from the bone to the *average* of its children (or a short stub down
 * the parent's direction for leaves, so fingertips and horn tips still bind).
 *
 * @returns {Record<string, {a: THREE.Vector3, b: THREE.Vector3}>}
 */
export function boneSegments(rest = restPositions()) {
  const segs = {}
  for (const def of BONE_DEFS) {
    const a = rest[def.name]
    const kids = CHILDREN[def.name]
    let b
    if (kids.length) {
      b = new THREE.Vector3()
      for (const k of kids) b.add(rest[k])
      b.divideScalar(kids.length)
    } else {
      // Leaf: extend along the direction we arrived from.
      const parent = PARENT[def.name]
      const dir = parent
        ? new THREE.Vector3().subVectors(a, rest[parent]).normalize()
        : new THREE.Vector3(0, 1, 0)
      b = new THREE.Vector3().copy(a).addScaledVector(dir, 0.03)
    }
    segs[def.name] = { a: a.clone(), b }
  }
  return segs
}

// ---- named bone groups, so parts can restrict which bones may bind them ----

const side = (list, s) => list.map((n) => n + s)

export const GROUPS = {
  torso: ['hips', 'spine01', 'spine02', 'chest', 'neck', 'clavicleL', 'clavicleR', 'thighL', 'thighR'],
  head: ['head', 'headTop', 'neck', 'jaw', 'jawTip', 'browC'],
  jaw: ['jaw', 'jawTip', 'head'],
  earL: ['earL0', 'earL1', 'earL2', 'earL3', 'head'],
  earR: ['earR0', 'earR1', 'earR2', 'earR3', 'head'],
  tail: ['tail0', 'tail1', 'tail2', 'tail3', 'tail4', 'hips'],
  armL: ['clavicleL', 'upperarmL', 'forearmL', 'handL', 'chest'],
  armR: ['clavicleR', 'upperarmR', 'forearmR', 'handR', 'chest'],
  handL: ['handL', 'forearmL', ...side(['thumbL0', 'thumbL1', 'thumbL2', 'indexL0', 'indexL1', 'indexL2', 'midL0', 'midL1', 'midL2', 'ringL0', 'ringL1', 'ringL2'], '')],
  handR: ['handR', 'forearmR', 'thumbR0', 'thumbR1', 'thumbR2', 'indexR0', 'indexR1', 'indexR2', 'midR0', 'midR1', 'midR2', 'ringR0', 'ringR1', 'ringR2'],
  legL: ['hips', 'thighL', 'shinL', 'footL', 'toeL', 'toeTipL', 'heelL'],
  legR: ['hips', 'thighR', 'shinR', 'footR', 'toeR', 'toeTipR', 'heelR'],
}

GROUPS.body = [
  ...GROUPS.torso,
  ...GROUPS.head,
  ...GROUPS.armL,
  ...GROUPS.armR,
  ...GROUPS.legL,
  ...GROUPS.legR,
  ...GROUPS.handL,
  ...GROUPS.handR,
  ...GROUPS.tail,
].filter((v, i, a) => a.indexOf(v) === i)

/** Mirror a bone name across the body (`upperarmL` <-> `upperarmR`). */
export function mirrorName(name) {
  if (/L\d*$/.test(name)) return name.replace(/L(\d*)$/, 'R$1')
  if (/R\d*$/.test(name)) return name.replace(/R(\d*)$/, 'L$1')
  return name
}
