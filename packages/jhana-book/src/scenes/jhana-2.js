// jhana-2 — the spring-fed lake (samādhi): "a lake with no inflow from any
// direction … a spring wells up from within and pervades it with cool water."
// A gold spring stands in the gutter at the centre of a lake of paper ripples;
// it swells with each in-breath, and each out-breath sends light out across
// the ripples, ring by ring.
//
// THE FOLDS
// • The ripples are four symmetric parallel folds (tents) at increasing glue
//   distance a and panel length p. Each tent's card is cut as an elliptical
//   band (jhana-2/ripples.js): unfolded, every ripple is one elliptical hoop
//   of paper creased across its middle, glued down by its two side tips. Its
//   ellipse is stretched by exactly the tent's slope, so seen from above the
//   open hoop is a true circle of radius ≈ a round the spring. The hoop rides
//   over its ridge front and back, so from the reader's seat the far halves
//   rise as nested arches — the far wall of a bowl — and the near halves lie
//   low across the water.
// • Taller tents glued further out stay outside the smaller ones at every
//   angle (checked over 0..π), so the hoops never touch. a + p ≤ 0.95 keeps
//   every crease inside the page when closed; the hoops span z ∈ ±0.44, clear
//   of the printed line.
// • The spring is a slender vertical V-fold at the centre: gamma = π/2 stands
//   its crease straight up when open, a narrow glue edge keeps it thin, and
//   each panel is cut as half a teardrop, so the pair reads as a jet of gold.
//   Its glow sprite and point light ride on its crease tip.
// • Flat on the pages: a lake of deep blue paper, a lighter shallows layer,
//   two printed outer ripples that catch the light after the hoops do, and a
//   gold welling point at the spring's foot.
//
// LIGHT
//   On every out-breath a wave of light leaves the spring and passes outward
//   across the hoops and printed ripples (emissive, eased, no snapping). On
//   the in-breath the spring's glow and light swell. A few motes rise slowly
//   from the spring. All of it fades with frame.reveal — except a little cool
//   light that spills from under the page as it first lifts (leak()).

import { hoopShape, teardropShape } from './jhana-2/ripples.js'
import { risingPoints, spriteTexture } from './jhana-1/rising.js'
import { leak, printedLayer, seat } from './jhana-1/settle.js'

const LAKE_Z = 0 // the spring's apex and the ripples' centre, on the spine
const WAVE_START = 0.35 // s after the out-breath begins that the wave leaves the spring
const WAVE_STEP = 0.75 // s between successive rings
const WAVE_WIDTH = 0.8 // s, the gaussian width of each ring's swell

function build(ctx) {
  const { THREE, group, paper, quality } = ctx
  const low = quality === 'low'

  // Each ring gets its own material (unique `name` → its own cache entry) so
  // its emissive can carry the wave independently.
  const waterMat = (i, color) =>
    paper.material({ color, roughness: 0.8, emissive: '#9ff0e6', emissiveIntensity: 0, name: `jhana-2 ripple ${i}` })

  // ---- the lake, flat on both pages -----------------------------------------
  // Page coords: s out from the spine, t along z. An egg of deep water centred
  // on the spring, pulled in at the front so it stops short of the text.
  const egg = (rx, rBack, rFront, steps = 40) => {
    const sh = new THREE.Shape()
    sh.moveTo(0, LAKE_Z - rBack)
    for (let i = 1; i < steps; i++) {
      const a = (Math.PI * i) / steps // 0 = far, π = near
      const rz = a < Math.PI / 2 ? rBack : rFront
      sh.lineTo(rx * Math.sin(a), LAKE_Z - rz * Math.cos(a))
    }
    sh.lineTo(0, LAKE_Z + rFront)
    return sh
  }
  // a thin flat ring (top view radius r, width w), same egg squash
  const ring = (r, w, squashFront, steps = 48) => {
    const sh = new THREE.Shape()
    const pt = (a, rr) => [rr * Math.sin(a), LAKE_Z - rr * Math.cos(a) * (a > Math.PI / 2 ? squashFront : 1)]
    sh.moveTo(...pt(0, r + w / 2))
    for (let i = 1; i <= steps; i++) sh.lineTo(...pt((Math.PI * i) / steps, r + w / 2))
    for (let i = steps; i >= 0; i--) sh.lineTo(...pt((Math.PI * i) / steps, r - w / 2))
    return sh
  }
  // the spring's gold, shared by the spring and the welling point at its foot
  const gold = paper.material({ color: '#efbd55', roughness: 0.7, emissive: '#ffb340', emissiveIntensity: 0 })
  const deep = paper.material({ color: '#123a5a', roughness: 0.9 })
  const shallows = paper.material({ color: '#1d5f7a', roughness: 0.9 })
  const flatRings = [waterMat(4, '#4c9fb2'), waterMat(5, '#3d8aa3')]
  // Printed layers settle onto the paper as the spread closes (settle.js).
  const printed = []
  for (const page of [paper.root.left, paper.root.right]) {
    const lay = (shape, material, y) => {
      const holder = printedLayer(paper, page, y)
      printed.push(holder)
      paper.card(holder, { shape, material }).castShadow = false // printed layers only receive
    }
    lay(egg(0.84, 0.64, 0.44), deep, 0.0018)
    lay(egg(0.5, 0.48, 0.4), shallows, 0.0024)
    lay(ring(0.56, 0.018, 0.78), flatRings[0], 0.0029)
    lay(ring(0.65, 0.014, 0.64), flatRings[1], 0.0029)
    lay(egg(0.07, 0.07, 0.07, 16), gold, 0.0034) // the welling point
  }

  // ---- the ripples: four nested tents cut as hoops -------------------------
  // [a, height when open]; p = hypot(a, h) gives that height at θ = π.
  const RIPPLES = [
    [0.12, 0.12, '#a6e6dc'],
    [0.22, 0.2, '#72cbcb'],
    [0.32, 0.27, '#46a9ba'],
    [0.42, 0.32, '#2c86a4'],
  ]
  const ringMats = []
  RIPPLES.forEach(([a, h, color], i) => {
    const p = Math.hypot(a, h)
    const fold = paper.parallelFold({ a, p, z0: LAKE_Z - a, z1: LAKE_Z + a })
    const material = waterMat(i, color)
    ringMats.push(material)
    // band: from a hair outside the glue line (the glue tabs) to 0.045 inside
    const shape = hoopShape(THREE, { a, p, rOut: a + 0.012, rIn: a - 0.04 + 0.006 * i, zc: LAKE_Z })
    paper.card(fold.left, { shape, material })
    paper.card(fold.right, { shape, material })
  })
  const waveMats = [...ringMats, ...flatRings] // the order the wave reaches them

  // ---- the spring: a slender vertical V-fold ---------------------------------
  // gamma = π/2: the crease stands straight up when open whatever alpha is;
  // alpha sets how far the V's two halves splay (dihedral 2·alpha when open).
  const SPRING_H = 0.5
  const spring = paper.vFold({ z: LAKE_Z, alpha: 0.55, gamma: Math.PI / 2, length: SPRING_H })
  const drop = teardropShape(THREE, { height: SPRING_H, width: 0.1 })
  paper.card(spring.left, { shape: drop, material: gold })
  paper.card(spring.right, { shape: drop, material: gold })

  // the spring's light and glow ride on its crease tip
  const tip = paper.place(spring.ridge, { z: SPRING_H + 0.02 })
  const light = new THREE.PointLight('#ffd27a', 0, 1.3, 2)
  tip.add(light)
  const glowTex = spriteTexture(THREE, 'glow', 128)
  const glowMat = new THREE.SpriteMaterial({
    map: glowTex,
    color: '#ffd889',
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const glowSprite = new THREE.Sprite(glowMat)
  glowSprite.renderOrder = 2
  tip.add(glowSprite)
  // a cool fill that follows the wave across the water
  const cool = new THREE.PointLight('#7fe3dc', 0, 1.6, 2)
  cool.position.set(0, 0.55, 0.25)
  group.add(cool)

  // ---- motes rising from the spring -----------------------------------------
  const rnd = paper.rng('jhana-2 · samādhi')
  const moteTex = spriteTexture(THREE, 'spark', 64)
  const motes = risingPoints(THREE, {
    count: low ? 12 : 24,
    rnd,
    map: moteTex,
    size: 0.026,
    colorA: '#fff0c2',
    colorB: '#8fe8e0',
    sway: 0.06,
    twinkle: 0.3,
    shrink: 0.3,
    spawn(i, r, out) {
      // most from the spring's tip, a few from the water further out
      const fromTip = i % 3 !== 0
      const ang = r() * Math.PI * 2
      const rad = fromTip ? 0.03 * r() : 0.15 + 0.35 * r()
      out.origin[0] = Math.cos(ang) * rad
      out.origin[1] = fromTip ? SPRING_H * 0.85 : 0.05
      out.origin[2] = LAKE_Z + Math.sin(ang) * rad * 0.8
      out.drift[0] = Math.cos(ang) * 0.12 * r()
      out.drift[1] = 0.45 + 0.35 * r()
      out.drift[2] = Math.sin(ang) * 0.08 * r()
    },
  })
  group.add(motes.points)

  // ---- breath state ---------------------------------------------------------
  let glow = 0 // eased breath
  let wave = 100 // seconds since the last out-breath began (large = no wave yet)
  let lastPhase = 'in'
  let phase = 0

  return {
    update(frame) {
      const { dt, time, reveal, breath, breathPhase } = frame
      if (breathPhase === 'out' && lastPhase === 'in') wave = 0
      lastPhase = breathPhase
      wave += dt
      glow += (breath - glow) * Math.min(1, dt * 1.4)
      phase += dt * 0.05

      // the wave: each ring brightens as the front passes, eased in and out
      let sum = 0
      for (let i = 0; i < waveMats.length; i++) {
        const u = (wave - WAVE_START - i * WAVE_STEP) / WAVE_WIDTH
        const pulse = Math.exp(-u * u)
        sum += pulse
        waveMats[i].emissiveIntensity = reveal * (0.02 + 0.85 * pulse)
      }

      seat(printed, frame.openness)

      const on = reveal > 0.001
      glowSprite.visible = motes.points.visible = on
      gold.emissiveIntensity = reveal * (0.1 + 0.35 * glow)
      // as the page first lifts, cool light spills out of the gap
      const spill = leak(frame.openness)
      light.intensity = reveal * (0.12 + 0.35 * glow) + 0.3 * spill
      cool.intensity = reveal * (0.15 + 0.25 * Math.min(1, sum)) + 0.6 * spill
      glowMat.opacity = reveal * (0.35 + 0.5 * glow)
      glowSprite.scale.setScalar(0.22 + 0.14 * glow)

      const mu = motes.uniforms
      mu.uPhase.value = phase
      mu.uTime.value = time
      mu.uOpacity.value = reveal * (0.5 + 0.4 * glow)
      mu.uLift.value = 0.35 + 0.65 * reveal
    },
    dispose() {
      group.remove(cool, motes.points)
      tip.remove(light, glowSprite)
      motes.dispose()
      moteTex.dispose()
      glowTex.dispose()
      glowMat.dispose()
      light.dispose()
      cool.dispose()
      paper.dispose()
    },
  }
}

export default {
  id: 'jhana-2',
  label: '2',
  title: 'Second Jhāna',
  pali: 'dutiya jhāna · samādhi',
  line: 'A spring wells up from within.',
  palette: { bg: '#05121c', paper: '#e2e9e5', ink: '#163246', accent: '#6fd0cb' },
  audio: { root: 87.31, intervals: [0, 7, 14, 19], brightness: 0.42, shimmer: 0.3, breathe: 0.6 },
  build,
}
