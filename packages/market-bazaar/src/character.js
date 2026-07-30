import * as THREE from 'three'
import { makeRng } from './rng.js'
import { generateAppearance } from './species.js'
import { buildBoneDefs, buildSkeleton, restPositions, boneSegments, boneGroups } from './rig.js'
import { buildBodyParts } from './body.js'
import { buildSkinnedGeometry } from './skinning.js'
import { createAnimator } from './anim.js'

// ---------------------------------------------------------------------------
// Character assembly: seed + species + role → a rigged, skinned, animated
// individual. One shared material per key across ALL characters (FRAMES.md
// vocabulary), so the whole crowd costs two shader programs.
// ---------------------------------------------------------------------------

export const bodyMaterial = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85 })
export const glowMaterial = new THREE.MeshBasicMaterial({ vertexColors: true })

const shadowMaterial = new THREE.MeshBasicMaterial({
  color: 0x000000,
  transparent: true,
  opacity: 0.32,
  depthWrite: false,
})
const shadowGeometry = new THREE.CircleGeometry(1, 20).rotateX(-Math.PI / 2)

/**
 * @param {object} o {seed, species, role}
 * @returns {{group, mesh, rig, appearance, animator, defs, parts}}
 */
export function buildCharacter({ seed, species, role }) {
  const rng = makeRng(seed)
  const appearance = generateAppearance(rng, species, role)
  const defs = buildBoneDefs(appearance)
  const rig = buildSkeleton(defs)
  const rest = restPositions(defs)
  const { segs } = boneSegments(defs)
  const groups = boneGroups(defs)
  const parts = buildBodyParts(appearance, rest, groups)
  const { geometry, materials } = buildSkinnedGeometry(parts, {
    boneNames: rig.boneNames,
    segments: segs,
  })

  const mesh = new THREE.SkinnedMesh(
    geometry,
    materials.map((k) => (k === 'glow' ? glowMaterial : bodyMaterial)),
  )
  mesh.add(rig.root)
  mesh.updateMatrixWorld(true)
  mesh.bind(rig.skeleton, mesh.matrixWorld)
  mesh.frustumCulled = false // crowd animates well past its bind-pose bounds

  const group = new THREE.Group()
  group.add(mesh)

  // blob shadow grounds the figure without shadow maps
  const blob = new THREE.Mesh(shadowGeometry, shadowMaterial)
  blob.scale.setScalar(appearance.shoulderW * 1.9)
  blob.position.y = 0.012
  blob.renderOrder = 1
  group.add(blob)

  const animator = createAnimator(rig, appearance)

  return { group, mesh, rig, appearance, animator, defs, parts }
}
