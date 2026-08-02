import * as THREE from 'three'

const { degToRad: rad } = THREE.MathUtils

// ---------------------------------------------------------------------------
// Proportions. The figure stands ~1.05 tall at the shoulders of the hat and
// faces +Z; everything below is in the same (roughly metric) units the diorama
// is built in.
// ---------------------------------------------------------------------------
const HIP_Y = 0.6
const TORSO = 0.26 // hip joint -> shoulder line
const NECK = 0.062 // shoulder line -> neck joint
const HEAD_R = 0.072
const SHOULDER_X = 0.098
const UPPER_ARM = 0.2
const FOREARM = 0.185
const HIP_X = 0.058
const THIGH = 0.28
const SHIN = 0.26
const ANKLE_Y = HIP_Y - THIGH - SHIN // 0.06 — the sole sits on y = 0
const FOOT_L = 0.155
const FOOT_R = 0.032 // half-thickness of the shoe capsule

// The ankle is FOOT_DROP above the sole and the toe tip is FOOT_TIP ahead of
// it; `toeLift()` in dance.js uses the same numbers to work out how far the
// body has to rise so a plantar-flexed foot doesn't sink through the stage.
export const FOOT_DROP = FOOT_R + 0.028
export const FOOT_TIP = FOOT_L - 0.03
export const ANKLE_HEIGHT = ANKLE_Y

// ---------------------------------------------------------------------------
// Materials — black suit, white hat / glove / spats. That palette is the whole
// costume; the silhouette does the rest of the work.
// ---------------------------------------------------------------------------
const SUIT = new THREE.MeshStandardMaterial({ color: '#17161d', roughness: 0.5, metalness: 0.12 })
// The key light hangs straight overhead, so anything vertical — the side of a
// top hat, say — catches almost none of it and a white reads muddy brown. A
// little self-emission keeps the whites white from every angle on the turntable.
const WHITE = new THREE.MeshStandardMaterial({
  color: '#ffffff',
  roughness: 0.42,
  metalness: 0,
  emissive: '#ffffff',
  emissiveIntensity: 0.17,
})
const BAND = new THREE.MeshStandardMaterial({ color: '#1a1922', roughness: 0.45, metalness: 0.1 })

// A bone: a capsule spanning `len` from this joint, downwards by default
// (dir = -1) or upwards (dir = +1) for the torso.
function bone(len, r, mat, dir = -1) {
  const geo = new THREE.CapsuleGeometry(r, Math.max(len - 2 * r, 0.001), 4, 14)
  geo.translate(0, (dir * len) / 2, 0)
  const mesh = new THREE.Mesh(geo, mat)
  mesh.castShadow = true
  return mesh
}

// A capsule lying along X — the pelvis and the shoulder line.
function bar(len, r, mat) {
  const geo = new THREE.CapsuleGeometry(r, len, 4, 14).rotateZ(Math.PI / 2)
  const mesh = new THREE.Mesh(geo, mat)
  mesh.castShadow = true
  return mesh
}

function joint(parent, x = 0, y = 0, z = 0, order) {
  const g = new THREE.Group()
  g.position.set(x, y, z)
  if (order) g.rotation.order = order
  parent.add(g)
  return g
}

// ---------------------------------------------------------------------------
// Rig
//
// root ─ lean ─ body ─ hips ┬ spine ─ shoulders ┬ neck ─ head ─ hat
//                          │                    ├ shoulder.L ─ elbow.L ─ hand
//                          │                    └ shoulder.R ─ elbow.R ─ hand
//                          ├ leg.L ─ knee.L ─ ankle.L ─ shoe
//                          └ leg.R ─ knee.R ─ ankle.R ─ shoe
//
// `root` carries the figure around the stage (x / z / yaw) and `lean` pivots
// the entire body about the floor line between the feet — that pivot is what
// makes the anti-gravity lean possible.
//
// Shoulders and hips use ZYX euler order so the three channels read as the
// usual anatomical decomposition: pitch (swing forward) is applied to the
// hanging limb first, then twist about the limb's own axis, then spread lifts
// it away from the body.
// ---------------------------------------------------------------------------
export function createFigure() {
  const root = new THREE.Group()
  const lean = joint(root)
  const body = joint(lean)

  const hips = joint(body, 0, HIP_Y)
  hips.add(bar(HIP_X * 2, 0.036, SUIT))

  const spine = joint(hips)
  spine.add(bone(TORSO, 0.042, SUIT, 1))

  const shoulders = joint(spine, 0, TORSO)
  shoulders.add(bar(SHOULDER_X * 2, 0.032, SUIT))

  const neck = joint(shoulders, 0, NECK)
  neck.add(bone(0.055, 0.022, SUIT, 1))

  const head = joint(neck, 0, 0.055 + HEAD_R * 0.6)
  const skull = new THREE.Mesh(new THREE.SphereGeometry(HEAD_R, 24, 18), SUIT)
  skull.scale.set(0.92, 1.06, 0.96)
  skull.castShadow = true
  head.add(skull)

  // The white top hat, hinged on the head so it tilts and lifts on its own.
  const hat = joint(head, 0, HEAD_R * 0.58)
  const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.108, 0.108, 0.012, 32), WHITE)
  brim.castShadow = true
  const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.066, 0.07, 0.135, 32), WHITE)
  crown.position.y = 0.073
  crown.castShadow = true
  const ribbon = new THREE.Mesh(new THREE.CylinderGeometry(0.0715, 0.0715, 0.026, 32), BAND)
  ribbon.position.y = 0.021
  hat.add(brim, crown, ribbon)

  const arms = {}
  for (const [key, side] of [['L', 1], ['R', -1]]) {
    const shoulder = joint(shoulders, SHOULDER_X * side, 0, 0, 'ZYX')
    shoulder.add(bone(UPPER_ARM, 0.026, SUIT))
    const elbow = joint(shoulder, 0, -UPPER_ARM)
    elbow.add(bone(FOREARM, 0.023, SUIT))
    // One white glove, on the right hand. Obviously.
    const hand = new THREE.Mesh(
      new THREE.SphereGeometry(side < 0 ? 0.036 : 0.03, 16, 12),
      side < 0 ? WHITE : SUIT,
    )
    hand.position.y = -FOREARM
    hand.castShadow = true
    elbow.add(hand)
    arms[key] = { shoulder, elbow, side }
  }

  const legs = {}
  for (const [key, side] of [['L', 1], ['R', -1]]) {
    const hip = joint(hips, HIP_X * side, 0, 0, 'ZYX')
    hip.add(bone(THIGH, 0.032, SUIT))
    const knee = joint(hip, 0, -THIGH)
    knee.add(bone(SHIN, 0.027, SUIT))
    const ankle = joint(knee, 0, -SHIN)
    // White spat, lying along +Z with the sole on the stage.
    const shoe = new THREE.Mesh(
      new THREE.CapsuleGeometry(FOOT_R, FOOT_L - FOOT_R * 2, 4, 14).rotateX(Math.PI / 2),
      WHITE,
    )
    shoe.position.set(0, -(FOOT_DROP - FOOT_R), FOOT_L / 2 - 0.03)
    shoe.castShadow = true
    ankle.add(shoe)
    legs[key] = { hip, knee, ankle, side }
  }

  // -------------------------------------------------------------------------
  // Pose → transforms. Sign conventions, stated once:
  //   pitch  positive swings the far end of the segment toward +Z (forward)
  //   spread positive moves a limb away from the body's midline
  //   knee   positive folds the shin backwards, elbow positive folds forward
  //   ankle  positive points the toe down (plantar flexion)
  // -------------------------------------------------------------------------
  function applyPose(p) {
    root.position.set(p.rootX, p.rootY, p.rootZ)
    root.rotation.y = rad(p.rootYaw)
    lean.rotation.x = rad(p.lean)

    hips.rotation.set(rad(p.hipsPitch), rad(p.hipsYaw), rad(p.hipsRoll))
    spine.rotation.set(rad(p.spinePitch), rad(p.spineYaw), rad(p.spineRoll))
    neck.rotation.set(rad(p.neckPitch), rad(p.neckYaw), rad(p.neckRoll))

    hat.rotation.set(rad(p.hatTilt), 0, rad(p.hatRoll))
    hat.position.y = HEAD_R * 0.58 + p.hatLift

    for (const key of ['L', 'R']) {
      const { shoulder, elbow, side } = arms[key]
      shoulder.rotation.set(-rad(p[`arm${key}Pitch`]), side * rad(p[`arm${key}Twist`]), side * rad(p[`arm${key}Spread`]))
      elbow.rotation.x = -rad(p[`elbow${key}`])

      const leg = legs[key]
      leg.hip.rotation.set(-rad(p[`leg${key}Pitch`]), leg.side * rad(p[`leg${key}Twist`]), leg.side * rad(p[`leg${key}Spread`]))
      leg.knee.rotation.x = rad(p[`knee${key}`])
      leg.ankle.rotation.x = rad(p[`ankle${key}`])
    }
  }

  return { root, applyPose }
}
