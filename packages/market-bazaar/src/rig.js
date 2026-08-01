import * as THREE from 'three'

// ---------------------------------------------------------------------------
// Parametric skeleton
//
// Unlike space-goblin's single hand-authored skeleton, every bazaar character
// gets its own skeleton generated from proportion params — a hulking monster
// and a wiry alien share bone NAMES (so one animation system drives all of
// them) but not bone OFFSETS. Conventions from docs/FRAMES.md:
//
//   • every bone's rest rotation is identity (axes world-aligned in bind pose)
//   • the character faces +Z; its own left is +X; feet at y = 0
//   • arm and leg chains descend along -Y in the bind pose
//
// Optional chains (tail, antennae) exist only for characters that want them;
// animation code must therefore always guard `byName.tail0 && ...`.
// ---------------------------------------------------------------------------

/**
 * @typedef {object} Proportions
 * @property {number} height      crown height, m (headTop bone lands here)
 * @property {number} legginess   0..1 → longer legs
 * @property {number} headSize    head radius, m
 * @property {number} shoulderW   half-width to each upperarm, m
 * @property {number} hipW        half-width to each thigh, m
 * @property {number} armLen      shoulder→wrist, m
 * @property {number} neckLen     m
 * @property {number} hunch       0..1 forward spine curve (monsters hunch)
 * @property {number} footLen     ankle→toe, m
 * @property {number} tailSegs    0 = no tail
 * @property {number} tailLen     total tail length, m
 * @property {boolean} antennae
 */

/** Build the bone definition table for one character. */
export function buildBoneDefs(p) {
  const hipY = p.height * (0.44 + p.legginess * 0.1)
  const headH = p.headSize * 1.05
  const torsoLen = p.height - hipY - p.neckLen - headH
  if (torsoLen < 0.12) throw new Error(`rig: torso collapsed (height ${p.height}, hipY ${hipY})`)

  // Hunch: chest and neck shift forward, head compensates back to stay over hips.
  const hz = p.hunch
  const defs = []
  const B = (name, parent, x, y, z) => defs.push({ name, parent, pos: [x, y, z] })

  B('root', null, 0, 0, 0)
  B('hips', 'root', 0, hipY, 0)
  B('spine01', 'hips', 0, torsoLen * 0.34, hz * 0.02)
  B('chest', 'spine01', 0, torsoLen * 0.4, hz * 0.05)
  B('neck', 'chest', 0, torsoLen * 0.26, hz * 0.03 - 0.01)
  B('head', 'neck', 0, p.neckLen, -hz * 0.06 + 0.008)
  B('headTop', 'head', 0, headH, -0.005)
  B('jaw', 'head', 0, -p.headSize * 0.28, p.headSize * 0.6)

  // ears: one bone each, out from the head sides
  B('earL', 'head', p.headSize * 0.92, p.headSize * 0.2, -0.01)
  B('earR', 'head', -p.headSize * 0.92, p.headSize * 0.2, -0.01)

  if (p.antennae) {
    B('antL0', 'head', p.headSize * 0.4, headH * 0.92, 0)
    B('antL1', 'antL0', p.headSize * 0.16, p.headSize * 0.55, -0.01)
    B('antR0', 'head', -p.headSize * 0.4, headH * 0.92, 0)
    B('antR1', 'antR0', -p.headSize * 0.16, p.headSize * 0.55, -0.01)
  }

  // arms: hang down, slightly outward (A-pose)
  const upperLen = p.armLen * 0.52
  const foreLen = p.armLen * 0.48
  B('clavicleL', 'chest', p.shoulderW * 0.35, torsoLen * 0.2, hz * 0.01)
  B('upperarmL', 'clavicleL', p.shoulderW * 0.65, torsoLen * 0.06, 0)
  B('forearmL', 'upperarmL', 0.03, -upperLen, 0)
  B('handL', 'forearmL', 0.012, -foreLen, 0.004)
  B('clavicleR', 'chest', -p.shoulderW * 0.35, torsoLen * 0.2, hz * 0.01)
  B('upperarmR', 'clavicleR', -p.shoulderW * 0.65, torsoLen * 0.06, 0)
  B('forearmR', 'upperarmR', -0.03, -upperLen, 0)
  B('handR', 'forearmR', -0.012, -foreLen, 0.004)

  // legs: straight down, ankle raised a little, toe reaching +Z
  const ankleY = 0.055
  const thighLen = (hipY - ankleY) * 0.52
  const shinLen = (hipY - ankleY) * 0.48
  B('thighL', 'hips', p.hipW, -0.02, 0)
  B('shinL', 'thighL', 0, -thighLen, 0.012)
  B('footL', 'shinL', 0, -shinLen + 0.02, -0.015)
  B('toeL', 'footL', 0, -ankleY + 0.015, p.footLen)
  B('thighR', 'hips', -p.hipW, -0.02, 0)
  B('shinR', 'thighR', 0, -thighLen, 0.012)
  B('footR', 'shinR', 0, -shinLen + 0.02, -0.015)
  B('toeR', 'footR', 0, -ankleY + 0.015, p.footLen)

  if (p.tailSegs > 0) {
    const seg = p.tailLen / p.tailSegs
    B('tail0', 'hips', 0, -0.03, -p.hipW * 0.9)
    for (let i = 1; i < p.tailSegs; i++) {
      B(`tail${i}`, `tail${i - 1}`, 0, seg * 0.12 * (i - p.tailSegs / 2), -seg)
    }
  }

  return defs
}

/**
 * Instantiate a skeleton from defs.
 * @returns {{root:THREE.Bone, bones:THREE.Bone[], byName:Record<string,THREE.Bone>,
 *            skeleton:THREE.Skeleton, boneNames:string[]}}
 */
export function buildSkeleton(defs) {
  const byName = {}
  const bones = []
  for (const def of defs) {
    const bone = new THREE.Bone()
    bone.name = def.name
    bone.position.set(...def.pos)
    byName[def.name] = bone
    bones.push(bone)
    if (def.parent) byName[def.parent].add(bone)
  }
  byName.root.updateMatrixWorld(true)
  return {
    root: byName.root,
    bones,
    byName,
    skeleton: new THREE.Skeleton(bones),
    boneNames: defs.map((d) => d.name),
  }
}

/** World-space bind position of every bone, from defs alone (no THREE scene). */
export function restPositions(defs) {
  const out = {}
  for (const def of defs) {
    const p = new THREE.Vector3(...def.pos)
    if (def.parent) p.add(out[def.parent])
    out[def.name] = p
  }
  return out
}

/**
 * Medial-axis segments for skin weighting: bone → mean of children, or a short
 * stub onward for leaves (same scheme space-goblin proved out).
 */
export function boneSegments(defs) {
  const rest = restPositions(defs)
  const children = {}
  const parent = {}
  for (const d of defs) children[d.name] = []
  for (const d of defs) {
    parent[d.name] = d.parent
    if (d.parent) children[d.parent].push(d.name)
  }
  const segs = {}
  for (const d of defs) {
    const a = rest[d.name]
    const kids = children[d.name]
    let b
    if (kids.length) {
      b = new THREE.Vector3()
      for (const k of kids) b.add(rest[k])
      b.divideScalar(kids.length)
    } else {
      const dir = parent[d.name]
        ? new THREE.Vector3().subVectors(a, rest[parent[d.name]]).normalize()
        : new THREE.Vector3(0, 1, 0)
      b = new THREE.Vector3().copy(a).addScaledVector(dir, 0.05)
    }
    segs[d.name] = { a: a.clone(), b }
  }
  return { segs, rest, children, parent }
}

/** Named bone groups for skin-binding restriction. Filters to bones present. */
export function boneGroups(defs) {
  const have = new Set(defs.map((d) => d.name))
  const g = (list) => list.filter((n) => have.has(n))
  return {
    torso: g(['hips', 'spine01', 'chest', 'neck', 'clavicleL', 'clavicleR', 'thighL', 'thighR']),
    head: g(['head', 'headTop', 'neck', 'jaw']),
    armL: g(['clavicleL', 'upperarmL', 'forearmL', 'handL', 'chest']),
    armR: g(['clavicleR', 'upperarmR', 'forearmR', 'handR', 'chest']),
    legL: g(['hips', 'thighL', 'shinL', 'footL', 'toeL']),
    legR: g(['hips', 'thighR', 'shinR', 'footR', 'toeR']),
    tail: g(['hips', 'tail0', 'tail1', 'tail2', 'tail3', 'tail4']),
  }
}
