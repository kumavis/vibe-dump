// jhana-4 — equanimity (upekkhā).
//
// "As if a man were sitting covered from head to foot with a white cloth, so
// that no part of his body was not pervaded by it." A seated, draped figure,
// a pale moon behind it, a near-white page. Monochrome; nothing moves but one
// very slow light, and the breath barely lifting the brightness. The calmest
// image in the book.
//
// What folds, and how:
// • The figure is a stack of stepped standing layers, each a V-fold on the
//   spine with γ = π/2 (its crease stands straight up) and the same α, so all
//   the layers stay parallel at every θ and never cut one another — the cloth
//   over the head and shoulders at the back, the cloth over the body in the
//   middle, the lap and knees in front. Each layer is one silhouette cut with
//   a THREE.Shape in two halves, one per panel, creased down the middle.
//   (Stepped parallel folds were the first try: from the reader's side a
//   parallel fold shows its open gable, a hollow tent, never a silhouette. The
//   V-fold layers face the reader and still step back like a parallel stack.)
//   'near' V-folds: the apex is at the far side and the arms angle toward the
//   reader, so as the book closes every layer falls backward, away from the
//   text — and each silhouette is kept low enough to land inside the far page
//   edge: a panel point (s, t) lands at z = z₀ + t cos α − s sin α ≥ −H/2.
// • The moon is the last layer: a disc on the same kind of V-fold behind the
//   figure, its rim showing round the head and shoulders like a halo.
// • A flat cut cushion under the figure, one half per page.
// • Light: a static cool fill from behind-right (it turns the figure's cast
//   shadow a cool blue-grey), one very slow sweeping light, and a faint halo
//   behind the moon. All three are non-shadowing; the sweep and the halo fade
//   with frame.reveal. Like every flat thing in the book, the cushion and the
//   layers' small stand-off from their panels sink to nothing as the spread
//   closes (closed pages meet with no clearance at the spine).

import * as THREE from 'three'

const PI = Math.PI
const TAU = PI * 2
const smooth = (e0, e1, x) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)))
  return t * t * (3 - 2 * t)
}
const sinkAt = (theta) => smooth(0.02, 0.5, theta)
const CLOSED = 0.012 // radians

// Every layer: a 'near' V-fold, crease upright, arms 24° off the page's width.
const ALPHA = 1.15

// Half-silhouettes as (t, s) points: t out from the centre line along the
// glue line, s up. Draped cloth: one continuous soft line from the crown of
// the head over the shoulders and down the arms to the ground.
const LAYERS = [
  {
    // head and shoulders: the cloth's whole outline
    name: 'veil',
    z: 0.0,
    lift: 0.0032,
    color: '#f7f7f5',
    pts: [
      [0, 0.468], [0.02, 0.465], [0.036, 0.456], [0.049, 0.441], [0.058, 0.42], [0.062, 0.396],
      [0.066, 0.37], [0.074, 0.35], [0.093, 0.335], [0.125, 0.318], [0.158, 0.286], [0.184, 0.236], [0.204, 0.16], [0.222, 0.08],
      [0.236, 0.02], [0.24, 0],
    ],
  },
  {
    // the cloth over the body: a soft fall from the shoulders, a dip at the
    // breast where it gathers
    name: 'body',
    z: 0.065,
    lift: 0.0044,
    color: '#fdfdfb',
    pts: [
      [0, 0.262], [0.03, 0.27], [0.065, 0.284], [0.1, 0.284], [0.135, 0.268], [0.165, 0.228],
      [0.19, 0.16], [0.207, 0.09], [0.218, 0.03], [0.222, 0],
    ],
  },
  {
    // the lap: crossed legs under the cloth, the knees a little proud
    name: 'lap',
    z: 0.13,
    lift: 0.0056,
    color: '#fbfbf8',
    pts: [
      [0, 0.088], [0.05, 0.094], [0.1, 0.106], [0.15, 0.114], [0.2, 0.11], [0.245, 0.094],
      [0.28, 0.066], [0.302, 0.032], [0.31, 0],
    ],
  },
]
const FIGURE_SCALE = 1.25
const MOON = { z: -0.12, lift: 0.002, r: 0.25, c: 0.355, stalk: 0.012 }

export default {
  id: 'jhana-4',
  label: '4',
  title: 'Fourth Jhāna',
  pali: 'catuttha jhāna · upekkhā',
  line: 'Still. A white cloth over everything.',
  palette: { bg: '#0e1012', paper: '#f4f3ef', ink: '#585c62', accent: '#dfe6ee' },
  audio: { root: 73.42, intervals: [0, 7, 12, 19], brightness: 0.28, shimmer: 0.04, breathe: 0.25 },
  build,
}

function build(ctx) {
  const { group, paper, H } = ctx
  const root = paper.root
  const sa = Math.sin(ALPHA)
  const ca = Math.cos(ALPHA)
  const limit = (z, t) => (z + H / 2 + t * ca) / sa // flat-fold height limit
  // Drawn as seen from the reader. A V panel turns its outer parts toward the
  // reader, so (from a camera ~35° above the page) they look narrower by sin α
  // and lower by tan 35°·(t cos α). Cutting each silhouette wider and lifting
  // it toward the outside undoes that, so the head and the moon read round
  // instead of pointed. (s, t) design → panel cut:
  const LOOK = Math.tan((35 * PI) / 180)
  const cut = (t, s) => {
    const tc = t / sa
    return [tc, s + LOOK * ca * tc]
  }
  const sinking = [] // [frame, stand-off] scaled by sink(θ)
  const sunk = (frame, y) => (sinking.push([frame, y]), frame)
  const own = { materials: [], textures: [] }

  // ---- the cushion: a flat oval, one half per page -------------------------------
  const cushionMat = paper.material({ color: '#e9e8e3', roughness: 0.95 })
  for (const side of ['left', 'right']) {
    const pts = []
    const N = 40
    for (let i = 0; i <= N; i++) {
      const a = -PI / 2 + (PI * i) / N
      pts.push(new THREE.Vector2(i === 0 || i === N ? 0 : 0.44 * Math.cos(a), 0.17 + 0.2 * Math.sin(a)))
    }
    const m = paper.card(sunk(paper.place(root[side], { y: 0.002 }), 0.002), { shape: new THREE.Shape(pts), material: cushionMat })
    m.castShadow = false
  }

  // ---- the figure: stepped V-fold layers ---------------------------------------------
  // The panel card is offset toward its reader-facing side (−y of a 'near'
  // V panel), which faces up once the layer has fallen back flat, so a layer
  // nearer the reader lands on top of the ones behind it.
  for (const layer of LAYERS) {
    const fold = paper.vFold({ z: layer.z, alpha: ALPHA, gamma: PI / 2, length: layer.pts[0][1] * FIGURE_SCALE, toward: 'near' })
    const k = FIGURE_SCALE
    const curve = new THREE.SplineCurve(layer.pts.map(([t, s]) => new THREE.Vector2(t * k, s * k)))
    const outline = [new THREE.Vector2(0, 0)]
    for (const p of curve.getSpacedPoints(64)) {
      const [tc, sc] = cut(Math.max(0, p.x), p.y)
      outline.push(new THREE.Vector2(Math.max(0, Math.min(sc, limit(layer.z, tc) * 0.97)), tc))
    }
    const shape = new THREE.Shape(outline)
    // a breath of self-light: the cloth should read whiter than the page it
    // stands on, though it faces the key light edge-on
    const mat = paper.material({ color: layer.color, emissive: '#ffffff', emissiveIntensity: 0.25, roughness: 0.96 })
    for (const side of ['left', 'right']) {
      paper.card(sunk(paper.place(fold[side], { y: -layer.lift }), -layer.lift), { shape, material: mat })
    }
  }

  // ---- the moon: a disc across the last V-fold ---------------------------------------
  const moon = paper.vFold({ z: MOON.z, alpha: ALPHA, gamma: PI / 2, length: MOON.c + MOON.r, toward: 'near' })
  // the moon is the one luminous thing: it glows a little, so the draped head
  // and shoulders read against it, backlit
  const moonMat = paper.material({ color: '#eef2f7', emissive: '#e3ebf5', emissiveIntensity: 0.5, roughness: 0.9 })
  {
    const { r, c, stalk } = MOON
    const pts = [new THREE.Vector2(0, 0), new THREE.Vector2(0, stalk * 2.4), new THREE.Vector2(c - r + 0.004, stalk)]
    const a0 = Math.asin(stalk / r)
    const N = 48
    for (let i = 0; i <= N; i++) {
      const a = PI - a0 - ((PI - a0) * i) / N // from the stalk round the outside to the top
      const [tc, sc] = cut(r * Math.sin(a), c + r * Math.cos(a))
      pts.push(new THREE.Vector2(Math.min(sc, limit(MOON.z, tc) * 0.985), tc))
    }
    const shape = new THREE.Shape(pts)
    for (const side of ['left', 'right']) {
      paper.card(sunk(paper.place(moon[side], { y: -MOON.lift }), -MOON.lift), { shape, material: moonMat })
    }
  }

  // ---- light ------------------------------------------------------------------------
  const haloTex = haloTexture()
  own.textures.push(haloTex)
  const haloMat = new THREE.SpriteMaterial({
    map: haloTex,
    color: '#e6edf6',
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  own.materials.push(haloMat)
  const halo = new THREE.Sprite(haloMat)
  halo.renderOrder = 2
  group.add(halo)
  const haloAt = new THREE.Vector3()

  // cool fill from behind-right: the shaded sides and the cast shadow go blue-grey
  const fill = new THREE.DirectionalLight('#a6b8cc', 0.5)
  fill.position.set(1.6, 1.0, -1.6)
  // one slow light, low and from the reader's side (it falls on the standing
  // cloth more than on the page), drifting across and back in three minutes
  const sweep = new THREE.DirectionalLight('#f2f5f9', 0)
  const target = new THREE.Object3D()
  group.add(fill, sweep, target)
  fill.target = target
  sweep.target = target

  let breathEase = 0
  return {
    update(frame) {
      const { time, reveal } = frame
      breathEase += (frame.breath - breathEase) * Math.min(1, frame.dt * 1.2)
      const b = breathEase

      // Fully closed (under 0.7°) the spread is sandwiched between leaves that
      // meet with no thickness at the spine; hide it rather than let its
      // flattened cards z-fight along that line. (The engine re-shows the
      // group every frame before calling update.)
      group.visible = frame.theta > CLOSED
      const sink = sinkAt(frame.theta)
      for (let i = 0; i < sinking.length; i++) sinking[i][0].position.y = sinking[i][1] * sink

      // the halo sits just behind the disc's centre, on the moon's crease
      // (a 'near' V's ridge +y points away from the reader)
      moon.ridge.updateMatrix()
      haloAt.set(0, 0.03, MOON.c).applyMatrix4(moon.ridge.matrix)
      halo.position.copy(haloAt)
      halo.scale.setScalar(0.9 * (0.6 + 0.4 * reveal))
      haloMat.opacity = reveal * (0.2 + 0.05 * b)
      halo.visible = reveal > 0.001

      const a = (time / 180) * TAU + 1.2
      sweep.position.set(Math.sin(a) * 2.4, 0.9, 2.2 + 0.3 * Math.cos(a))
      sweep.intensity = reveal * (0.85 + 0.06 * b)
      fill.intensity = 0.5 * (0.5 + 0.5 * reveal)
      moonMat.emissiveIntensity = 0.44 + 0.08 * b * reveal
    },
    dispose() {
      for (const x of own.materials) x.dispose()
      for (const x of own.textures) x.dispose()
      fill.dispose()
      sweep.dispose()
      paper.dispose()
    },
  }
}

function haloTexture(size = 128) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')
  const h = size / 2
  const grad = g.createRadialGradient(h, h, 0, h, h, h)
  grad.addColorStop(0, 'rgba(255,255,255,0.9)')
  grad.addColorStop(0.4, 'rgba(255,255,255,0.5)')
  grad.addColorStop(0.62, 'rgba(255,255,255,0.12)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, size, size)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}
