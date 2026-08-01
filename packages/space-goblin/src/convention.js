import * as THREE from 'three'

// ---------------------------------------------------------------------------
// Which way is forward
//
// This file exists because it did not, and the world scrolled the wrong way for
// the whole first version. The character and the terrain each had a private,
// unwritten answer to "which way is he going", they disagreed by 180°, and the
// result was a goblin moonwalking across a very handsome flat.
//
// So: one exported answer, and every module that has an opinion about direction
// imports it rather than hard-coding a sign.
//
// THE GOBLIN FACES +Z. The evidence, all of which predates this file:
//
//   • rig.js       — `jaw` sits at z = +0.028 and `jawTip` at +0.07, so the
//                    muzzle points +Z; `tail0` at z = -0.085 and the ear chain
//                    sweeping to -Z put his back at -Z.
//   • anim.js      — `legPose` swings the thigh to -0.62 rad at foot strike,
//                    which (X-rotation takes -Y toward -Z) reaches the foot out
//                    to +Z, and drives it to +0.46 by toe-off, i.e. the planted
//                    foot travels -Z under a body advancing +Z. The torso leans
//                    X(+0.34) = toward +Z; the head pitches back the other way
//                    to stay level.
//   • character.js — feeds the cloth solver `velocity = (0, 0, +speed)`, so the
//                    kit trails toward -Z.
//   • main.js      — the FACE camera sits at +Z to look at his face.
//
// The world therefore has to move the *other* way: ground, props, dust and mist
// all travel along BACKWARD while he runs in place.
// ---------------------------------------------------------------------------

/** The direction the goblin faces and runs. */
export const FORWARD = Object.freeze(new THREE.Vector3(0, 0, 1))

/** Where the scenery goes while he sprints in place. */
export const BACKWARD = Object.freeze(new THREE.Vector3(0, 0, -1))

export const UP = Object.freeze(new THREE.Vector3(0, 1, 0))

/**
 * The goblin's own left, which is +X — bones named `...L` sit at positive x
 * (see `rig.js`), and that is what `mirrorName` and the pose mirror assume.
 */
export const LEFT = Object.freeze(new THREE.Vector3(1, 0, 0))
export const RIGHT = Object.freeze(new THREE.Vector3(-1, 0, 0))

/**
 * Signed z of FORWARD. World-scroll code wants a scalar, and `dist * -FORWARD_Z`
 * reads better than a bare `-1` that nobody dares touch.
 */
export const FORWARD_Z = FORWARD.z

/** Scenery displacement after travelling `dist` metres. */
export function scrollOffset(dist, out = new THREE.Vector3()) {
  return out.copy(BACKWARD).multiplyScalar(dist)
}

/** Scalar z-offset of scenery after travelling `dist` metres. */
export function scrollZ(dist) {
  return BACKWARD.z * dist
}
