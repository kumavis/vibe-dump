// Procedural cartoon dinosaurs: chubby flat-shaded primitives with big eyes.
// Every dino faces +Z and returns a rig world.js can animate.

import * as THREE from 'three'

function mat(color, extra = {}) {
  return new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.9, ...extra })
}

function mesh(g, m, x = 0, y = 0, z = 0) {
  const o = new THREE.Mesh(g, m)
  o.position.set(x, y, z)
  o.castShadow = true
  return o
}

const SPH = new THREE.SphereGeometry(1, 10, 8)
const CONE = new THREE.ConeGeometry(1, 1, 8)
const CYL = new THREE.CylinderGeometry(1, 1, 1, 8)
const BOX = new THREE.BoxGeometry(1, 1, 1)

function addEyes(head, s, { y = 0.1, z = 0.35, spread = 0.32 } = {}) {
  const white = mat(0xffffff, { roughness: 0.4 })
  const black = mat(0x222222, { roughness: 0.4 })
  for (const side of [-1, 1]) {
    const eye = mesh(SPH, white, side * spread * s, y * s, z * s)
    eye.scale.setScalar(0.16 * s)
    const pupil = mesh(SPH, black, side * spread * s, y * s, (z + 0.12) * s)
    pupil.scale.setScalar(0.08 * s)
    head.add(eye, pupil)
  }
}

function makeLeg(s, r, len, skin) {
  const pivot = new THREE.Group()
  const leg = mesh(CYL, skin, 0, -len / 2, 0)
  leg.scale.set(r, len, r)
  const foot = mesh(SPH, skin, 0, -len, 0.06 * s)
  foot.scale.set(r * 1.35, r * 0.8, r * 1.6)
  pivot.add(leg, foot)
  return pivot
}

function makeTail(s, baseY, baseZ, sizes, skin, up = 0.12) {
  const segs = []
  let parent = null
  const first = new THREE.Group()
  first.position.set(0, baseY, baseZ)
  for (let i = 0; i < sizes.length; i++) {
    const [r, len] = sizes[i]
    const pivot = i === 0 ? first : new THREE.Group()
    if (parent) {
      pivot.position.set(0, up * s, -sizes[i - 1][1])
    }
    const cone = mesh(CONE, skin, 0, 0, -len / 2)
    cone.scale.set(r, len, r)
    cone.rotation.x = -Math.PI / 2
    pivot.add(cone)
    if (parent) parent.add(pivot)
    parent = pivot
    segs.push(pivot)
  }
  return { root: first, segs }
}

// ------------------------------------------------- body plans

function quadruped({ s, skin, belly, legH = 1.0, bodyScale = [0.85, 0.72, 1.2], neckH = 0.55, headScale = 0.62 }) {
  const group = new THREE.Group()
  const skinM = mat(skin)
  const bellyM = mat(belly)
  const bodyY = legH * s + bodyScale[1] * s * 0.35

  const bodyPivot = new THREE.Group()
  bodyPivot.position.y = bodyY
  group.add(bodyPivot)

  const body = mesh(SPH, skinM)
  body.scale.set(bodyScale[0] * s, bodyScale[1] * s, bodyScale[2] * s)
  const tummy = mesh(SPH, bellyM, 0, -0.28 * s, 0.1 * s)
  tummy.scale.set(bodyScale[0] * s * 0.82, bodyScale[1] * s * 0.72, bodyScale[2] * s * 0.85)
  bodyPivot.add(body, tummy)

  const legs = []
  const hipY = -0.35 * bodyScale[1] * s
  for (const [sx, sz] of [[-1, 1], [1, 1], [-1, -1], [1, -1]]) {
    const pivot = makeLeg(s, 0.2 * s, bodyY + hipY, skinM)
    pivot.position.set(sx * 0.5 * bodyScale[0] * s, hipY, sz * 0.62 * bodyScale[2] * s)
    bodyPivot.add(pivot)
    legs.push({ pivot, phase: sx * sz > 0 ? 0 : Math.PI })
  }

  const tail = makeTail(s, 0.12 * s, -bodyScale[2] * s * 0.85, [
    [0.42 * s, 0.75 * s],
    [0.3 * s, 0.6 * s],
    [0.18 * s, 0.5 * s],
  ], skinM)
  bodyPivot.add(tail.root)

  const neck = mesh(CYL, skinM, 0, 0.32 * s, bodyScale[2] * s * 0.95)
  neck.scale.set(0.28 * s, 0.85 * s, 0.28 * s)
  neck.rotation.x = 0.55
  bodyPivot.add(neck)

  const head = new THREE.Group()
  head.position.set(0, neckH * s + bodyScale[1] * s * 0.6, bodyScale[2] * s * 1.35)
  const skull = mesh(SPH, skinM)
  skull.scale.set(0.5 * headScale * s * 1.7, 0.48 * headScale * s * 1.7, 0.6 * headScale * s * 1.7)
  const snout = mesh(SPH, skinM, 0, -0.1 * s, 0.62 * headScale * s)
  snout.scale.set(0.36 * headScale * s * 1.6, 0.28 * headScale * s * 1.5, 0.48 * headScale * s * 1.6)
  head.add(skull, snout)
  addEyes(head, s * headScale * 1.7, { y: 0.16, z: 0.3, spread: 0.34 })
  bodyPivot.add(head)

  return { group, bodyPivot, legs, tail: tail.segs, head, skinM, bellyM, size: s }
}

function biped({ s, skin, belly, legH = 1.15, bodyScale = [0.68, 0.74, 1.05], headScale = 0.7, headZ = 1.55, headY = 1.05 }) {
  const group = new THREE.Group()
  const skinM = mat(skin)
  const bellyM = mat(belly)
  const bodyY = legH * s + bodyScale[1] * s * 0.25

  const bodyPivot = new THREE.Group()
  bodyPivot.position.y = bodyY
  bodyPivot.rotation.x = -0.24
  group.add(bodyPivot)

  const body = mesh(SPH, skinM)
  body.scale.set(bodyScale[0] * s, bodyScale[1] * s, bodyScale[2] * s)
  const tummy = mesh(SPH, bellyM, 0, -0.22 * s, 0.18 * s)
  tummy.scale.set(bodyScale[0] * s * 0.8, bodyScale[1] * s * 0.75, bodyScale[2] * s * 0.8)
  bodyPivot.add(body, tummy)

  const legs = []
  for (const sx of [-1, 1]) {
    const pivot = makeLeg(s, 0.26 * s, bodyY - 0.1 * s, skinM)
    pivot.position.set(sx * 0.5 * bodyScale[0] * s, -0.15 * s, -0.15 * s)
    const thigh = mesh(SPH, skinM, 0, -0.1 * s, 0)
    thigh.scale.set(0.32 * s, 0.42 * s, 0.4 * s)
    pivot.add(thigh)
    bodyPivot.add(pivot)
    legs.push({ pivot, phase: sx > 0 ? 0 : Math.PI })
  }

  const arms = []
  for (const sx of [-1, 1]) {
    const arm = mesh(CYL, skinM, sx * 0.72 * bodyScale[0] * s, 0.05 * s, 0.7 * bodyScale[2] * s)
    arm.scale.set(0.09 * s, 0.4 * s, 0.09 * s)
    arm.rotation.x = 2.2
    bodyPivot.add(arm)
    arms.push(arm)
  }

  const tail = makeTail(s, 0.05 * s, -bodyScale[2] * s * 0.8, [
    [0.4 * s, 0.9 * s],
    [0.28 * s, 0.75 * s],
    [0.16 * s, 0.6 * s],
  ], skinM, 0.06)
  bodyPivot.add(tail.root)

  const neck = mesh(CYL, skinM, 0, headY * s * 0.55, bodyScale[2] * s * 0.9)
  neck.scale.set(0.24 * s, 0.8 * s, 0.24 * s)
  neck.rotation.x = 0.5
  bodyPivot.add(neck)

  const head = new THREE.Group()
  head.position.set(0, headY * s, headZ * bodyScale[2] * s)
  const skull = mesh(SPH, skinM)
  skull.scale.set(0.42 * headScale * s * 1.7, 0.42 * headScale * s * 1.7, 0.55 * headScale * s * 1.7)
  head.add(skull)
  addEyes(head, s * headScale * 1.7, { y: 0.16, z: 0.28, spread: 0.3 })
  bodyPivot.add(head)

  return { group, bodyPivot, legs, tail: tail.segs, head, arms, skinM, bellyM, size: s }
}

// ------------------------------------------------- species

const BUILDERS = {
  parasaur(s = 0.85) {
    const rig = quadruped({ s, skin: 0x58c9a5, belly: 0xd8f3e4, bodyScale: [0.9, 0.8, 1.35] })
    const crest = mesh(CYL, mat(0xff8c69), 0, 0.45 * s, -0.25 * s)
    crest.scale.set(0.1 * s, 0.85 * s, 0.14 * s)
    crest.rotation.x = 2.4
    rig.head.add(crest)
    return rig
  },

  stego(s = 1.05) {
    const rig = quadruped({ s, skin: 0x7cb342, belly: 0xdcedc8, bodyScale: [1.05, 0.9, 1.5], neckH: 0.3, headScale: 0.45 })
    const plateM = mat(0xff7043)
    const heights = [0.45, 0.65, 0.8, 0.65, 0.45]
    heights.forEach((h, i) => {
      for (const side of [-1, 1]) {
        const plate = mesh(CONE, plateM, side * 0.14 * s, 0.75 * s, (1.0 - i * 0.55) * s)
        plate.scale.set(0.34 * s, h * s, 0.1 * s)
        rig.bodyPivot.add(plate)
      }
    })
    for (const side of [-1, 1]) {
      const spike = mesh(CONE, plateM, side * 0.12 * s, 0.12 * s, -0.25 * s)
      spike.scale.set(0.08 * s, 0.5 * s, 0.08 * s)
      spike.rotation.z = side * -0.7
      rig.tail[2].add(spike)
    }
    rig.head.position.y -= 0.35 * s
    return rig
  },

  trike(s = 1.05) {
    const rig = quadruped({ s, skin: 0x6f8fc9, belly: 0xcdd9f2, bodyScale: [1.05, 0.9, 1.45], neckH: 0.35, headScale: 0.6 })
    const frill = mesh(CYL, mat(0x54719f), 0, 0.28 * s, -0.32 * s)
    frill.scale.set(0.62 * s, 0.09 * s, 0.62 * s)
    frill.rotation.x = 1.15
    rig.head.add(frill)
    const hornM = mat(0xfff3d6)
    for (const side of [-1, 1]) {
      const horn = mesh(CONE, hornM, side * 0.28 * s, 0.32 * s, 0.22 * s)
      horn.scale.set(0.09 * s, 0.55 * s, 0.09 * s)
      horn.rotation.x = 0.9
      rig.head.add(horn)
    }
    const nose = mesh(CONE, hornM, 0, 0.05 * s, 0.62 * s)
    nose.scale.set(0.08 * s, 0.3 * s, 0.08 * s)
    nose.rotation.x = 1.2
    rig.head.add(nose)
    return rig
  },

  dilo(s = 0.9) {
    const rig = biped({ s, skin: 0xd4c34a, belly: 0xf4eec2, headScale: 0.65 })
    const crestM = mat(0xe5533d)
    for (const side of [-1, 1]) {
      const crest = mesh(SPH, crestM, side * 0.2 * s, 0.42 * s, 0.1 * s)
      crest.scale.set(0.06 * s, 0.34 * s, 0.3 * s)
      rig.head.add(crest)
    }
    return rig
  },

  raptor(s = 0.8) {
    const rig = biped({ s, skin: 0xff9840, belly: 0xffe0b3, legH: 1.2, bodyScale: [0.6, 0.65, 1.0], headScale: 0.62, headZ: 1.65 })
    const stripeM = mat(0x7a4a1f)
    for (let i = 0; i < 3; i++) {
      const stripe = mesh(BOX, stripeM, 0, 0.55 * s, (0.5 - i * 0.5) * s)
      stripe.scale.set(1.15 * s, 0.16 * s, 0.16 * s)
      stripe.rotation.x = 0.15
      rig.bodyPivot.add(stripe)
    }
    const tip = mesh(CONE, stripeM, 0, 0, -0.65 * s)
    tip.scale.set(0.12 * s, 0.35 * s, 0.12 * s)
    tip.rotation.x = -Math.PI / 2
    rig.tail[2].add(tip)
    return rig
  },

  brachio(s = 1.35) {
    const rig = quadruped({ s, skin: 0x9b7fd4, belly: 0xd3c7ee, legH: 1.1, bodyScale: [0.9, 0.8, 1.25], headScale: 0.4 })
    // Replace the stubby default neck+head with a proper skyscraper neck.
    rig.bodyPivot.remove(rig.head)
    // Also drop the default short neck stub, which would poke out mid-chest.
    rig.bodyPivot.children
      .filter((o) => o.geometry === CYL && o.position.z > 0.5 * s)
      .forEach((o) => rig.bodyPivot.remove(o))
    const neckM = rig.skinM
    const neck = new THREE.Group()
    neck.position.set(0, 0.3 * s, 0.95 * s)
    neck.rotation.x = 0.55
    const seg = mesh(CYL, neckM, 0, 0.85 * s, 0)
    seg.scale.set(0.26 * s, 1.7 * s, 0.26 * s)
    neck.add(seg)
    const head = new THREE.Group()
    head.position.set(0, 1.75 * s, 0.12 * s)
    const skull = mesh(SPH, neckM)
    skull.scale.set(0.3 * s, 0.28 * s, 0.4 * s)
    head.add(skull)
    addEyes(head, s * 0.75, { y: 0.12, z: 0.3, spread: 0.28 })
    neck.add(head)
    rig.bodyPivot.add(neck)
    rig.head = head
    rig.neck = neck
    return rig
  },

  trex(s = 1.25) {
    const rig = biped({ s, skin: 0xc0574f, belly: 0xe8c9a0, legH: 1.2, bodyScale: [0.78, 0.85, 1.1], headScale: 0.9, headY: 1.15, headZ: 1.5 })
    const skull = mesh(BOX, rig.skinM, 0, 0.05 * s, 0.35 * s)
    skull.scale.set(0.55 * s, 0.45 * s, 0.7 * s)
    rig.head.add(skull)
    const jaw = new THREE.Group()
    jaw.position.set(0, -0.12 * s, 0.1 * s)
    const jawBox = mesh(BOX, rig.skinM, 0, -0.08 * s, 0.35 * s)
    jawBox.scale.set(0.48 * s, 0.2 * s, 0.62 * s)
    const teeth = mesh(BOX, mat(0xffffff), 0, 0.03 * s, 0.35 * s)
    teeth.scale.set(0.44 * s, 0.06 * s, 0.58 * s)
    jaw.add(jawBox, teeth)
    rig.head.add(jaw)
    rig.jaw = jaw
    for (const side of [-1, 1]) {
      const brow = mesh(BOX, mat(0x8f3a34), side * 0.28 * s, 0.32 * s, 0.45 * s)
      brow.scale.set(0.16 * s, 0.08 * s, 0.24 * s)
      rig.head.add(brow)
    }
    return rig
  },
}

export function makeDino(spKey) {
  const rig = BUILDERS[spKey]()
  rig.group.traverse((o) => {
    o.castShadow = true
  })
  return rig
}

// Floating emoji sprite for moods ('💢', '❗', '❤️', '💤').
const emoteCache = {}
export function makeEmote(txt) {
  if (!emoteCache[txt]) {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 128
    const ctx = canvas.getContext('2d')
    ctx.font = '96px serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(txt, 64, 72)
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    emoteCache[txt] = tex
  }
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: emoteCache[txt], transparent: true, depthTest: false }))
  sprite.scale.setScalar(1.5)
  return sprite
}
