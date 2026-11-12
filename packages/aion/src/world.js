// Puts the pieces in one scene. The head lives in world millimetres; the eye
// and optic nerve head are built in their own frame and placed at the back of
// the right eye. One clipping plane slices the eye open along the nerve.
import * as THREE from 'three'
import { THETA, RE, NERVE_END, SLICE_Z } from './anat.js'
import { buildEye } from './eye.js'
import { buildMicro } from './micro.js'
import { buildHead } from './head.js'

export function buildWorld(scene, lowRes) {
  const EYE = new THREE.Vector3(-32, 0, 0) //                         centre of the right eye
  const X = new THREE.Vector3(Math.sin(THETA), 0, -Math.cos(THETA)) // along the nerve, away from the eye
  const Y = new THREE.Vector3(0, 1, 0)
  const Z = new THREE.Vector3().crossVectors(X, Y) //                 toward the nose
  const O = EYE.clone().addScaledVector(X, RE) //                     where the nerve leaves the globe
  const frame = new THREE.Matrix4().makeBasis(X, Y, Z).setPosition(O)
  const toWorld = p => new THREE.Vector3(p[0], p[1], p[2] ?? 0).applyMatrix4(frame)

  const clip = new THREE.Plane(Z.clone().negate(), 0)
  const eye = buildEye(clip, lowRes)
  eye.group.matrixAutoUpdate = false; eye.group.matrix.copy(frame)
  scene.add(eye.group)
  const micro = buildMicro()
  eye.section.add(micro.group)
  const head = buildHead(toWorld, eye.trunks, [NERVE_END, 0, 0])
  scene.add(head.group)

  scene.add(new THREE.AmbientLight(0xffffff, 0.85))
  const key = new THREE.DirectionalLight(0xffffff, 1.5); scene.add(key)
  const fill = new THREE.DirectionalLight(0xbfd0ff, 0.5); fill.position.set(-200, 80, -300); scene.add(fill)

  return {
    toWorld, frame,
    update(s, dt, camera, span) {
      // slice: keep everything on the temple side of a plane that sweeps in from the nose side
      clip.constant = Z.dot(O) + SLICE_Z - 0.004 + 14 * (1 - s.clip) // the cut lands just behind the painted section
      key.position.copy(camera.position).add(new THREE.Vector3(0.3, 0.6, 0.2).multiplyScalar(camera.position.length() + 50))
      eye.update(s, dt); micro.update(s, dt); head.update(s, dt, span)
    },
  }
}
