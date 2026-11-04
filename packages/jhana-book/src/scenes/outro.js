// outro — Return. Dawn. Coming back into a room in the morning.
//
// The intro's horizon again (the same ridges, the same V-fold construction),
// now in rose and gold with the dawn glowing behind it. In front stands an
// arched window, cut from one card per side with real holes for the panes, the
// gutter running down its middle mullion; morning light comes through it — a
// point light behind it, a glow card seen through the panes, a patch of light
// on the floor and a little dust turning in it. Two birds on clear acetate
// strips lift off the far hills and glide on the breath. The orb is back, in
// the same place as in the intro, steady now.

import * as THREE from 'three'
import {
  RIDGES,
  HILL_ALPHA,
  HILL_GAMMA,
  hillLayer,
  quadOn,
  lightMaterial,
  glowTexture,
  grainTexture,
  frontFace,
  toTexture,
  makeOrb,
  makeMotes,
} from './intro/kit.js'

const COT_G = Math.cos(HILL_GAMMA) / Math.sin(HILL_GAMMA)
const COT_A = Math.cos(HILL_ALPHA) / Math.sin(HILL_ALPHA)
const SIN_A = Math.sin(HILL_ALPHA)

// The window, in one V panel's coords: s up the wall, t' along it from the
// crease (the middle mullion). Everything is sheared by s·cot γ so the
// window's verticals stay parallel to the crease.
const WIN = {
  z: 0.13, // apex on the gutter: where the intro's near hill stood
  half: 0.3, // t' of the outer jamb (≈ 0.29 across the page)
  spring: 0.33, // where the round head starts
  top: 0.55, // crown of the arch
  border: 0.045,
  mullion: 0.016,
  sill: 0.09,
  bars: [[0.2, 0.215], [0.32, 0.345]], // a muntin and the transom
}
const sh = (s, tp) => new THREE.Vector2(s, tp + s * COT_G)

function archPoints(spring, rs, rt, phiEnd, steps, out) {
  for (let i = 0; i <= steps; i++) {
    const phi = (phiEnd * i) / steps
    out.push(sh(spring + rs * Math.sin(phi), rt * Math.cos(phi)))
  }
  return out
}

// The frame: an arch-topped card with three pane holes (two below the
// transom, one round-headed above it). Both panels use the same outline, so
// the two halves meet along the crease as one window.
function windowShape() {
  const { half, spring, top, border, mullion, sill, bars } = WIN
  const rs = top - spring
  const pts = [sh(0, 0), sh(0, half)]
  archPoints(spring, rs, half, Math.PI / 2, 24, pts)
  const shape = new THREE.Shape(pts)
  const inner = half - border
  const pane = (s0, s1) =>
    new THREE.Path([sh(s0, mullion), sh(s0, inner), sh(s1, inner), sh(s1, mullion)])
  shape.holes.push(pane(sill, bars[0][0]))
  shape.holes.push(pane(bars[0][1], bars[1][0]))
  // round-headed pane: up the jamb, round the inner arch to the mullion
  const irs = rs - border
  const phiEnd = Math.acos(mullion / inner)
  const head = [sh(bars[1][1], mullion), sh(bars[1][1], inner)]
  archPoints(spring, irs, inner, phiEnd, 18, head)
  shape.holes.push(new THREE.Path(head))
  return shape
}

// The light behind the panes: the opening's outline plus a little margin, so
// the frame hides its edges and only the holes show it.
function openingShape() {
  const { half, spring, top, border, sill } = WIN
  const inner = half - border + 0.014
  const irs = top - spring - border + 0.014
  const pts = [sh(sill - 0.01, 0), sh(sill - 0.01, inner)]
  archPoints(spring, irs, inner, Math.PI / 2, 18, pts)
  return new THREE.Shape(pts)
}

// A gull from the front, gliding: shallow "M" wings, no face. Drawn around
// its body at (0, 0) in flap coords (s up, t along the hinge).
function birdShape(span) {
  const k = span / 0.075
  const right = [
    [0.006, 0.006], [0.021, 0.027], [0.019, 0.048], [0.01, 0.075],
    [0.006, 0.056], [0.008, 0.032], [-0.003, 0.011], [-0.013, 0.003],
  ]
  const pts = [new THREE.Vector2(0.013 * k, 0)]
  for (const [s, t] of right) pts.push(new THREE.Vector2(s * k, t * k))
  pts.push(new THREE.Vector2(-0.016 * k, 0))
  for (let i = right.length - 1; i >= 0; i--) pts.push(new THREE.Vector2(right[i][0] * k, -right[i][1] * k))
  return new THREE.Shape(pts)
}

// A round meditation cushion seen from the front: a soft superellipse whose
// base sits on the hinge line. half = half its width, h = its height.
function cushionShape(half, h) {
  const pts = []
  for (let i = 0; i <= 32; i++) {
    const a = (Math.PI * i) / 32
    const c = Math.cos(a)
    const sn = Math.sin(a)
    const t = half * Math.sign(c) * Math.abs(c) ** 0.6
    pts.push(new THREE.Vector2(0.004 + (h - 0.004) * sn ** 0.75, t))
  }
  pts.push(new THREE.Vector2(0, -half * 0.94), new THREE.Vector2(0, half * 0.94))
  return new THREE.Shape(pts)
}

// The cushion's lit top edge: the outline's upper arc and the same arc
// lowered by `band`, joined into one strip.
function cushionBand(half, h, band) {
  const arc = (a) => {
    const c = Math.cos(a)
    return [0.004 + (h - 0.004) * Math.sin(a) ** 0.75, half * Math.sign(c) * Math.abs(c) ** 0.6]
  }
  const pts = []
  for (let i = 0; i <= 24; i++) {
    const [s, t] = arc(0.12 * Math.PI + (0.76 * Math.PI * i) / 24)
    pts.push(new THREE.Vector2(s, t))
  }
  for (let i = 24; i >= 0; i--) {
    const [s, t] = arc(0.12 * Math.PI + (0.76 * Math.PI * i) / 24)
    pts.push(new THREE.Vector2(s - band * (0.45 + 0.55 * Math.sin(0.12 * Math.PI + (0.76 * Math.PI * i) / 24)), t * 0.97))
  }
  return new THREE.Shape(pts)
}

// The patch of morning light on the floor: the panes thrown forward by a sun
// low behind the window. u runs from the gutter (0) out to the jamb's line (1),
// v from the window (top of the canvas) toward the reader.
function floorLightTexture() {
  const W = 128
  const H = 256
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const g = c.getContext('2d')
  const { half, spring, top, border, mullion, sill, bars } = WIN
  const L = 0.31 // floor depth of the whole patch
  const k = 0.56 // floor distance per unit of window height
  const v = (s) => ((s * k) / L) * H
  const u0 = (mullion / half) * W
  const u1 = ((half - border) / half) * W
  // Soft edges: a canvas blur filter, or where that is missing (some Safari)
  // the same panes drawn off the canvas with only their blurred shadow on it
  // (a shadowBlur of 6 is a 3 px gaussian).
  const filter = 'filter' in g
  if (filter) g.filter = 'blur(3px)'
  else {
    g.shadowColor = 'rgba(255,255,255,1)'
    g.shadowBlur = 6
    g.shadowOffsetX = 2 * W
    g.translate(-2 * W, 0)
  }
  g.fillStyle = 'rgba(255,255,255,1)'
  g.fillRect(u0, v(sill), u1 - u0, v(bars[0][0]) - v(sill))
  g.fillRect(u0, v(bars[0][1]), u1 - u0, v(bars[1][0]) - v(bars[0][1]))
  // round-headed pane: a rectangle closed by a quarter ellipse
  const s2 = bars[1][1]
  const crown = top - border
  g.beginPath()
  g.moveTo(u0, v(s2))
  g.lineTo(u1, v(s2))
  g.lineTo(u1, v(spring))
  g.ellipse(u0, v(spring), u1 - u0, v(crown) - v(spring), 0, 0, Math.PI / 2)
  g.closePath()
  g.fill()
  // fade toward the reader
  if (filter) g.filter = 'none'
  else {
    g.setTransform(1, 0, 0, 1, 0, 0)
    g.shadowColor = 'rgba(0,0,0,0)'
    g.shadowBlur = 0
    g.shadowOffsetX = 0
  }
  g.globalCompositeOperation = 'destination-in'
  const fade = g.createLinearGradient(0, 0, 0, H)
  fade.addColorStop(0, 'rgba(255,255,255,1)')
  fade.addColorStop(0.75, 'rgba(255,255,255,0.55)')
  fade.addColorStop(1, 'rgba(255,255,255,0.1)')
  g.fillStyle = fade
  g.fillRect(0, 0, W, H)
  return toTexture(c)
}

function build(ctx) {
  const { group, paper, quality } = ctx
  const rnd = paper.rng('outro · return')
  const made = []

  // ---- the horizon, rhymed ---------------------------------------------------
  // Same two back layers as the intro (same apexes, same ridges), warmed to
  // dawn. The window takes the near hill's place, so all three are V-folds
  // with one alpha/gamma: parallel at every θ, they fold down onto each other.
  const grain = grainTexture(rnd)
  made.push(grain)
  const mat = (color, roughness = 0.94) => paper.material({ color, roughness, map: grain })
  const far = hillLayer(paper, { z: -0.3, ridge: RIDGES.far, material: mat('#f0c9ad') })
  hillLayer(paper, { z: -0.08, ridge: RIDGES.mid, material: mat('#db9f90') })

  // ---- the window ----------------------------------------------------------
  const win = paper.vFold({
    z: WIN.z,
    alpha: HILL_ALPHA,
    gamma: HILL_GAMMA,
    length: WIN.top / Math.sin(HILL_GAMMA),
    toward: 'far',
  })
  // The window's light comes from BEHIND it (the floor patch is its shadow),
  // so it doesn't throw the engine key light's shadow back onto the hills.
  // With VSM, three.js also draws every shadow RECEIVER into the shadow map,
  // so both flags have to go for it to stop casting.
  const frameMat = mat('#f8e1ca', 0.88)
  for (const side of [win.left, win.right]) {
    const frame = paper.card(side, { shape: windowShape(), material: frameMat })
    frame.castShadow = frame.receiveShadow = false
  }

  // Light seen through the panes: an additive card a hair behind each half
  // (−y is the side away from the reader), brightest at the mullion's middle.
  const paneGlowMap = (() => {
    const c = document.createElement('canvas')
    c.width = 64
    c.height = 128
    const g = c.getContext('2d')
    const grad = g.createRadialGradient(32, 0, 0, 32, 0, 130)
    grad.addColorStop(0, 'rgba(255,255,255,1)')
    grad.addColorStop(0.5, 'rgba(255,255,255,0.55)')
    grad.addColorStop(1, 'rgba(255,255,255,0.18)')
    g.fillStyle = grad
    g.fillRect(0, 0, 64, 128)
    return toTexture(c)
  })()
  const paneGlowMat = lightMaterial(paneGlowMap, new THREE.Color('#ffc887'))
  made.push(paneGlowMap, paneGlowMat)
  for (const side of [win.left, win.right]) {
    const glow = paper.card(paper.place(side, { y: -0.012 }), { shape: openingShape(), material: paneGlowMat })
    glow.castShadow = glow.receiveShadow = false
    glow.renderOrder = 2
  }

  // The floor patch, one trapezoid per page from the window's foot toward the
  // reader (ending at z 0.44, short of the printed line). u = 0 at the gutter
  // on both halves, so the mullion's shadow falls exactly on the fold.
  const floorMap = floorLightTexture()
  const floorMat = lightMaterial(floorMap, new THREE.Color('#ffc07e'))
  made.push(floorMap, floorMat)
  const jamb = WIN.half * SIN_A
  for (const page of [paper.root.left, paper.root.right]) {
    const q = quadOn(
      page,
      [[0, WIN.z + 0.004], [jamb, WIN.z + 0.004 - jamb * COT_A], [jamb * 1.22, 0.44], [0, 0.44]],
      [[0, 1], [1, 1], [1, 0], [0, 0]],
      0.003,
      floorMat,
    )
    made.push(q.geometry)
  }

  // ---- birds on acetate ----------------------------------------------------
  // Each is a flap hinged on the far hill's face a little below its ridge: a
  // clear strip carrying a cut-paper gull up into the sky above the hill. Its
  // lift reads the hill's own fold angle (a flap on a fold gets fold.theta),
  // which closes to 0 with the book, so the bird lies on the hill when shut;
  // open, it tips ~0.33 rad toward the reader. The breath adds a slow glide to
  // that lift (the two birds in counterphase) and a slight in-plane roll.
  const acetate = new THREE.MeshStandardMaterial({
    color: '#fff6ee',
    roughness: 0.25,
    transparent: true,
    opacity: 0.05,
    depthWrite: false,
    side: THREE.DoubleSide,
  })
  const birdMat = mat('#7a5052', 0.9)
  made.push(acetate)
  const glide = { v: 0 }
  const birds = []
  const addBird = (side, x, above, span, sign) => {
    const t = Math.abs(x) / SIN_A
    const ridge = RIDGES.far(x)
    const hinge = ridge - 0.06
    const rise = 0.06 + above
    const flap = paper.flap({
      on: far.fold,
      side,
      x: hinge,
      z: t,
      length: rise,
      lift: (th) => {
        const open = Math.sin(th / 2) ** 2
        return open * (0.36 + sign * glide.v)
      },
    })
    const strip = paper.card(flap.panel, { length: rise - 0.012, z0: -0.004, z1: 0.004, material: acetate })
    strip.castShadow = strip.receiveShadow = false // (VSM: receivers cast too)
    strip.renderOrder = 1
    const pivot = paper.place(flap.panel, { x: rise })
    paper.card(pivot, { shape: birdShape(span), material: birdMat })
    birds.push({ pivot, sign })
  }
  addBird('left', -0.63, 0.15, 0.095, 1)
  addBird('right', 0.31, 0.12, 0.072, -1)

  // ---- the empty cushion ------------------------------------------------------
  // Whoever sat here has stood up. A flap on the left page, hinged across the
  // page (alpha = −π/2) so it faces the reader when it stands, folding toward
  // the reader when the page closes (flat it ends at z 0.41). It is dyed the
  // intro's dusk: the night carried into the morning light.
  const cushionLift = (th) => 1.6 * Math.sin(th / 2) ** 2
  const cushion = paper.flap({ side: 'left', x: 0.17, z: 0.335, alpha: -Math.PI / 2, length: 0.08, lift: cushionLift })
  const seat = frontFace(paper, cushion.panel)
  paper.card(seat, { shape: cushionShape(0.088, 0.072), material: mat('#857ca6', 0.95) })
  // its top seam catching the light: a lighter band a hair in front
  paper.card(paper.place(seat, { y: 0.0015 }), { shape: cushionBand(0.088, 0.072, 0.017), material: mat('#aea6cc', 0.95) })

  // ---- dawn behind the hills -----------------------------------------------
  const dawnMap = glowTexture([
    [0, 'rgba(255,255,255,1)'],
    [0.25, 'rgba(255,255,255,0.55)'],
    [0.6, 'rgba(255,255,255,0.14)'],
    [1, 'rgba(255,255,255,0)'],
  ])
  const dawnMat = new THREE.SpriteMaterial({
    map: dawnMap,
    color: new THREE.Color('#ffa070'),
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  })
  const dawn = new THREE.Sprite(dawnMat)
  dawn.position.set(0.05, 0.1, -0.86)
  dawn.scale.set(3.0, 0.95, 1)
  dawn.renderOrder = 1
  dawn.visible = false
  group.add(dawn)
  made.push(dawnMap, dawnMat)

  // ---- light: a warm lamp behind the window (the morning) + the orb --------
  const sun = new THREE.PointLight('#ffc888', 0, 1.0, 2)
  sun.position.set(0, 0.36, 0.01)
  group.add(sun)
  const orb = makeOrb(group, {
    y: 0.6,
    z: -0.04,
    haloColor: new THREE.Color('#ffc59a'),
    coreColor: new THREE.Color('#fff3e2'),
    ringColor: new THREE.Color('#ffd9b8'),
    lightColor: new THREE.Color('#ffd7ae'),
    distance: 1.4,
  })

  // ---- dust in the window light ---------------------------------------------
  const moteMap = glowTexture([
    [0, 'rgba(255,255,255,1)'],
    [0.3, 'rgba(255,255,255,0.5)'],
    [1, 'rgba(255,255,255,0)'],
  ], 64)
  made.push(moteMap)
  const motes = makeMotes(group, rnd, {
    count: quality === 'low' ? 9 : 18,
    box: [-0.3, 0.3, 0.05, 0.5, 0.08, 0.42],
    color: new THREE.Color('#ffd9a6'),
    size: 0.032,
    map: moteMap,
  })

  return {
    update(frame) {
      const rv = frame.reveal
      const b = frame.breath
      const on = rv > 0.002

      // the orb is back, steady: it barely swells now
      orb.halo.visible = orb.core.visible = orb.ring.visible = on
      orb.root.position.y = orb.baseY + 0.01 * (b - 0.5)
      const hs = 0.3 + 0.05 * b
      orb.halo.scale.set(hs, hs, 1)
      orb.halo.material.opacity = rv * (0.6 + 0.16 * b)
      orb.core.scale.set(0.075, 0.075, 1)
      orb.core.material.opacity = rv * 0.92
      orb.ring.scale.set(0.36, 0.36, 1)
      orb.ring.material.opacity = rv * 0.07
      orb.lamp.intensity = rv * (0.3 + 0.06 * b)

      // morning light: present, breathing only a little
      sun.intensity = rv * (0.16 + 0.04 * b)
      paneGlowMat.opacity = rv * (0.26 + 0.06 * b)
      floorMat.opacity = rv * (0.24 + 0.06 * b)
      dawn.visible = on
      dawnMat.opacity = rv * (0.72 + 0.08 * b)

      // birds glide: a slow tilt toward / away from the reader and a slight roll
      glide.v = 0.06 * (b - 0.5)
      for (const bird of birds) bird.pivot.rotation.y = rv * bird.sign * 0.07 * (b - 0.5)

      motes.points.visible = on
      motes.material.opacity = rv * (0.35 + 0.3 * b)
      if (on) motes.update(frame.time, b)
    },
    dispose() {
      orb.dispose()
      motes.dispose()
      sun.dispose()
      group.remove(sun, dawn)
      for (const m of made) m.dispose()
      paper.dispose()
    },
  }
}

export default {
  id: 'outro',
  label: '',
  title: 'Return',
  pali: 'nirodha · emergence',
  line: 'Come back slowly. Carry the quiet.',
  hinge: 'emerging',
  guide: [
    'Down the way you came.',
    'Calm, then gladness, then the breath.',
    'What was there? Look again.',
    'This is where insight begins.',
  ],
  tab: {
    text: 'On emerging, review the state: what arose, how it passed. Sāriputta did this one by one. A concentrated mind, turned to seeing.',
    source: 'MN 111',
  },
  palette: { bg: '#221618', paper: '#f6eadb', ink: '#5a3d32', accent: '#ffc9a0' },
  audio: { root: 98, intervals: [0, 4, 7, 12, 19], brightness: 0.55, shimmer: 0.25, breathe: 0.6 },
  build,
}
