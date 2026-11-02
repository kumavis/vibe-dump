// jhana-1 — rapture (pīti), "the pleasure born of seclusion": tingling,
// rising, bright. A layered paper sun rises out of the gutter as the page
// opens and sparks stream up out of it, quickening on every in-breath.
//
// THE FOLDS
// • The sun is four V-folds stacked on the spine, all running toward the far
//   edge. Each V's two panels are cut as fans of rays radiating from its apex
//   (jhana-1/burst.js), so each folded V is a half-disc of rays whose two
//   halves meet in one tall central ray on the crease.
// • Wide alpha lays every glue line out across the page, so the panels face
//   the reader; gamma near π/2 stands the crease almost upright when open.
//   V-folds this wide rise late: the sun lies folded toward the reader at
//   first and swings up through the last third of the opening — a sunrise.
// • The layers nest: going back, alpha and gamma shrink together, so each
//   inner crease leans further back than the one in front of it at every θ
//   (checked over 0..π), and each apex steps 0.04 further back. A piece living
//   inside another's wedge can never cut through it, so the four open together
//   without colliding, each to its own height: the small pale core in front,
//   crimson rays behind and tallest.
// • The apexes sit well back (z ≈ −0.3) because these creases fold flat
//   pointing at the reader; every ray is clamped so the folded sun stays inside
//   the page and short of the printed line.
// • A paler scalloped disc glued on the front of the core — the sun's heart.
// • Flat on the pages: a printed sunburst radiating from the sun's foot, so
//   the barely open page already promises the light.
//
// LIGHT
//   A warm point light in front of the sun and a deep red one behind it, both
//   breathing; a halo behind the sun; the pale heart disc on the core glowing
//   with the breath; sparks and bubbles rising out of the rays, quickening on
//   the in-breath. All of it fades with frame.reveal, so nothing hangs in the
//   air when the book is closed — except the warm light that spills from under
//   the page as it first lifts (leak()), before the sun can be seen.

import { rayLayer } from './jhana-1/burst.js'
import { risingPoints, spriteTexture } from './jhana-1/rising.js'
import { settle, leak, printedLayer, seat } from './jhana-1/settle.js'

const VEL_MAX = (0.5 * Math.PI) / 4.5 // the breath clock's peak d(breath)/dt
const APEX_Z = -0.25 // the sun's foot on the spine
const FLAT_Y = 0.002 // printed layers sit this far above the page when open
const HEART_Y = 0.004 // the heart disc's lift off the core

function build(ctx) {
  const { THREE, group, paper, quality } = ctx
  const low = quality === 'low'
  const mat = (color, extra = {}) => paper.material({ color, roughness: 0.86, ...extra })

  // ---- the sun: four nested V-folds, front (small, pale) → back (tall, crimson)
  const core = mat('#f3b54a', { emissive: '#ff9a2a', emissiveIntensity: 0 })
  const sun = [
    { z: -0.21, alpha: 1.25, gamma: 1.5, reach: 0.34, n: 8, skip: 0.5, valley: 0.8, short: 0.9, material: core },
    { z: -0.25, alpha: 1.12, gamma: 1.45, reach: 0.56, n: 6, skip: 0.1, valley: 0.52, short: 0.82, color: '#ee8a2c' },
    { z: -0.29, alpha: 0.98, gamma: 1.38, reach: 0.76, n: 5, skip: 0.62, valley: 0.42, short: 0.78, color: '#d4432a', holes: true },
    { z: -0.33, alpha: 0.82, gamma: 1.3, reach: 0.96, n: 5, skip: 0.2, valley: 0.34, short: 0.74, color: '#9a1d21' },
  ]
  const layers = sun.map((s) => rayLayer(THREE, paper, { ...s, material: s.material ?? mat(s.color) }))

  // The sun's heart: a paler disc glued on the front of the core's two panels
  // (a quarter disc each, meeting on the crease), lifted off them by a hair
  // along their outward normal. It glows with the breath.
  const heart = mat('#fde3a0', { emissive: '#ffcf6a', emissiveIntensity: 0 })
  const disc = new THREE.Shape()
  const gammaCore = sun[0].gamma
  disc.moveTo(0, 0)
  for (let i = 0; i <= 16; i++) {
    const phi = (gammaCore * i) / 16
    // a softly scalloped rim: eight small bumps across the quarter disc
    const r = 0.16 + 0.008 * Math.cos(phi * (16 / gammaCore) * Math.PI)
    disc.lineTo(r * Math.sin(phi), r * Math.cos(phi))
  }
  disc.lineTo(0, 0)
  const hearts = [layers[0].fold.left, layers[0].fold.right].map((panel) => {
    const holder = paper.place(panel, { y: HEART_Y })
    paper.card(holder, { shape: disc, material: heart })
    return holder
  })

  // ---- printed sunburst, flat on both pages (0.002 above the paper) ----------
  // Page coords: s out from the spine, t along z. Rays radiate from the sun's
  // foot; each is shortened to stop inside the page and short of the text.
  const flat = new THREE.Shape()
  const RAYS = 13
  const flatPt = (psi, r) => {
    // psi runs from the far edge (0) round to the reader (π)
    const s = r * Math.sin(psi)
    const t = APEX_Z - r * Math.cos(psi)
    const k = Math.min(1, s > 0.95 ? 0.95 / s : 1, t < -0.66 ? (APEX_Z + 0.66) / (APEX_Z - t) : 1, t > 0.42 ? (0.42 - APEX_Z) / (t - APEX_Z) : 1)
    return [s * k, APEX_Z + (t - APEX_Z) * k]
  }
  flat.moveTo(0, APEX_Z - 0.2)
  for (let i = 0; i < RAYS; i++) {
    const a0 = (Math.PI * i) / RAYS
    const a1 = (Math.PI * (i + 0.5)) / RAYS
    const a2 = (Math.PI * (i + 1)) / RAYS
    flat.lineTo(...flatPt(a0 + 0.012, 0.2))
    flat.lineTo(...flatPt(a1, i % 2 === 0 ? 0.95 : 0.72))
    flat.lineTo(...flatPt(a2 - 0.012, 0.2))
  }
  flat.lineTo(0, APEX_Z + 0.2)
  const flatMat = mat('#e9b78c', { roughness: 0.95 })
  const printed = [paper.root.left, paper.root.right].map((page) => {
    const holder = printedLayer(paper, page, FLAT_Y)
    paper.card(holder, { shape: flat, material: flatMat }).castShadow = false // printed: it would only shadow itself
    return holder
  })

  // ---- light -----------------------------------------------------------------
  // Warm light in front of the sun so the rays' faces catch it; deep red
  // behind, washing the page through the gaps. Neither casts shadows.
  const front = new THREE.PointLight('#ffb54d', 0, 1.8, 2)
  front.position.set(0, 0.34, 0.2)
  const back = new THREE.PointLight('#ff3a1e', 0, 1.8, 2)
  back.position.set(0, 0.5, -0.66)
  group.add(front, back)

  // A halo behind the sun: an additive sprite, high enough that its soft
  // edge has faded before it meets the paper.
  const glowTex = spriteTexture(THREE, 'glow', 128)
  const haloMat = new THREE.SpriteMaterial({
    map: glowTex,
    color: '#ff8a3a',
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const halo = new THREE.Sprite(haloMat)
  halo.position.set(0, 0.5, -0.5)
  halo.renderOrder = 2
  group.add(halo)

  // ---- sparks and bubbles ------------------------------------------------------
  const rnd = paper.rng('jhana-1 · pīti')
  const sparkTex = spriteTexture(THREE, 'spark', 64)
  const bubbleTex = spriteTexture(THREE, 'bubble', 64)
  const TILT = 0.25 // the open sun leans back about this much
  // Sparks leave from the sun's rays and stream up and outward.
  const sparks = risingPoints(THREE, {
    count: low ? 80 : 160,
    rnd,
    map: sparkTex,
    size: 0.028,
    colorA: '#fff1c4',
    colorB: '#ff7a2a',
    sway: 0.05,
    twinkle: 0.5,
    shrink: 0.55,
    spawn(i, r, out) {
      // most sparks leave the ray tips and hang about the crown; every third
      // one leaves the heart and streams up high
      const riser = i % 3 === 0
      const ang = (r() - 0.5) * (riser ? 1.6 : 2.8) // round the vertical, across the half-disc
      const rad = riser ? 0.12 + 0.25 * r() : 0.32 + 0.5 * Math.sqrt(r())
      const up = Math.cos(ang) * rad
      out.origin[0] = Math.sin(ang) * rad
      out.origin[1] = 0.03 + up * Math.cos(TILT)
      out.origin[2] = APEX_Z - up * Math.sin(TILT) + 0.05 * r()
      out.drift[0] = Math.sin(ang) * (riser ? 0.1 : 0.06 + 0.12 * r())
      out.drift[1] = riser ? 0.75 + 0.45 * r() : 0.18 + 0.32 * r()
      out.drift[2] = 0.04 * (r() - 0.5)
    },
  })
  // Bubbles: fewer, bigger, slower, drifting up through the sun.
  const bubbles = risingPoints(THREE, {
    count: low ? 8 : 16,
    rnd,
    map: bubbleTex,
    size: 0.04,
    colorA: '#ffd9a0',
    colorB: '#ff9a6a',
    sway: 0.07,
    twinkle: 0.1,
    shrink: -0.3, // they swell a little as they rise
    spawn(i, r, out) {
      const ang = (r() - 0.5) * 2.4
      const rad = 0.15 + 0.5 * r()
      const up = Math.cos(ang) * rad
      out.origin[0] = Math.sin(ang) * rad
      out.origin[1] = 0.05 + up * Math.cos(TILT)
      out.origin[2] = APEX_Z - up * Math.sin(TILT) + 0.1
      out.drift[0] = Math.sin(ang) * 0.1
      out.drift[1] = 0.55 + 0.35 * r()
      out.drift[2] = 0.04 * (r() - 0.5)
    },
  })
  group.add(sparks.points, bubbles.points)

  // The breath drives one accumulated phase per particle system: a slow steady
  // rise that quickens while breathing in and never stops or reverses.
  let sparkPhase = 0
  let bubblePhase = 0
  let glow = 0 // eased breath, so no brightness ever snaps

  return {
    update(frame) {
      const { dt, time, reveal, breath, breathVel } = frame
      const inhale = Math.max(0, breathVel) / VEL_MAX // 0..1 while breathing in
      sparkPhase += dt * (0.07 + 0.09 * inhale + 0.02 * breath)
      bubblePhase += dt * (0.04 + 0.035 * inhale)
      glow += (breath - glow) * Math.min(1, dt * 1.5)

      const k = settle(frame.openness)
      seat(printed, frame.openness)
      hearts[0].position.y = hearts[1].position.y = HEART_Y * k

      const on = reveal > 0.001
      sparks.points.visible = bubbles.points.visible = halo.visible = on
      const su = sparks.uniforms
      su.uPhase.value = sparkPhase
      su.uTime.value = time
      su.uOpacity.value = reveal * (0.6 + 0.4 * glow)
      su.uLift.value = 0.35 + 0.65 * reveal
      const bu = bubbles.uniforms
      bu.uPhase.value = bubblePhase
      bu.uTime.value = time
      bu.uOpacity.value = reveal * (0.3 + 0.15 * glow)
      bu.uLift.value = su.uLift.value

      // as the page first lifts, warm light spills out of the gap before the
      // sun itself is seen
      const spill = leak(frame.openness)
      front.intensity = reveal * (0.3 + 0.5 * glow) + 0.5 * spill
      back.intensity = reveal * (0.6 + 0.6 * glow) + 0.7 * spill
      haloMat.opacity = reveal * (0.25 + 0.2 * glow)
      halo.scale.setScalar(1.3 + 0.12 * glow)
      core.emissiveIntensity = reveal * (0.03 + 0.1 * glow)
      heart.emissiveIntensity = reveal * (0.08 + 0.42 * glow)
    },
    dispose() {
      group.remove(front, back, halo, sparks.points, bubbles.points)
      sparks.dispose()
      bubbles.dispose()
      sparkTex.dispose()
      bubbleTex.dispose()
      glowTex.dispose()
      haloMat.dispose()
      front.dispose()
      back.dispose()
      paper.dispose()
    },
  }
}

export default {
  id: 'jhana-1',
  label: '1',
  title: 'First Jhāna',
  pali: 'paṭhama jhāna · pīti',
  line: 'Rapture rises, born of letting go.',
  palette: { bg: '#260907', paper: '#f4e0c4', ink: '#4a1a10', accent: '#ffad42' },
  audio: { root: 110, intervals: [0, 7, 12, 16, 19], brightness: 0.62, shimmer: 0.55, breathe: 0.7 },
  build,
}
