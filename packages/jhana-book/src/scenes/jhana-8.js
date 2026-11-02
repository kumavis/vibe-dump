// jhana-8 — neither perception nor non-perception (nevasaññānāsaññāyatana).
//
// Forms at the threshold. Four veils of grey-mauve vellum rise from the gutter,
// translucent tents standing one behind another. From the reader's seat their
// silhouettes stack into something — a seated figure? a mountain? a stupa? —
// and never quite settle: the parts lean a little off each other's axis, and
// where they overlap the tint deepens. Their shadows are faint, as vellum's
// are. On the in-breath soft ghosts of light gather around the form — a second
// body beside the first, something tall behind it; on the out-breath they
// swell, rise a little and dissolve, and come back somewhere slightly
// different next time. The vellum thins as they come and returns as they go.
// A faint pearl light lies beyond the far edge.
//
// FOLD CHOICES
// • Every veil is a parallelFold. On the spine the flat rule is a + p = b + q,
//   so each folds dead flat at θ = 0 (its crease then lies a + p ≤ 0.94 from
//   the spine) and rises when open because p + q > a + b. Unequal a/b and p/q
//   tip the ridges off-centre: the far form leans a hair left, the body a
//   little right, the lap sits almost on the axis — that misalignment is the
//   "almost".
// • The "head" is a small parallelFold built on the body's OUTER hinge, so it
//   rides the body's ridge and rises above it as the book opens; on an
//   outside hinge the flat rule is p − a = q − b.
// • The spine-glued veils' z ranges never overlap (the head sits on the
//   body), so no two can cut through each other at any θ; every crossing you
//   see is the view through one veil to the next. Drawn far-to-near with a
//   fixed renderOrder so the blend never pops as the camera sways.
// • Shadows come from invisible dithered twins of the body and lap cards (see
//   below); the visible vellum neither casts nor receives.
// • Ghosts and the pearl light are free-floating: they fade with
//   frame.reveal, so the closed book has nothing in the air.

const PI = Math.PI
const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v)
const smooth = (x) => {
  const t = clamp(x, 0, 1)
  return t * t * (3 - 2 * t)
}

// The veils, far to near. [a, b, p, q] as in paper.parallelFold; `on` names
// an earlier veil whose OUTER hinge (its ridge, +y out of the fold) this one
// is built on.
const VEILS = [
  // far: a long low form behind everything — a range of hills, or shoulders,
  // or the edge of a halo; it leans a hair left of the axis
  { a: 0.46, b: 0.42, p: 0.48, q: 0.52, z0: -0.66, z1: -0.55, color: '#85778f', opacity: 0.34 },
  // "body": leaning a little right of the axis
  { a: 0.25, b: 0.29, p: 0.52, q: 0.48, z0: -0.36, z1: -0.08, color: '#6f6080', opacity: 0.42, shadow: true },
  // "head": a small tent nested on the body's ridge (its outer hinge), glued
  // 0.13 down each of the body's panels. On an outside hinge the flat rule is
  // p − a = q − b; closed, it sticks out p − a = 0.16 past the body's crease
  // (0.77 + 0.16 = 0.93 from the spine).
  { on: 1, a: 0.13, b: 0.13, p: 0.29, q: 0.29, z0: -0.27, z1: -0.16, color: '#6b5c7c', opacity: 0.42 },
  // "lap": wide and low, nearly on the axis
  { a: 0.38, b: 0.42, p: 0.56, q: 0.52, z0: -0.02, z1: 0.22, color: '#7d6f8b', opacity: 0.38, shadow: true },
]

// Where ghosts gather (spread space) and how big, first the ones kept at
// quality 'low'.
const GHOSTS = [
  [-0.14, 0.52, -0.34, 1.7], // a second body, a little to one side of the first
  [0.1, 0.62, -0.5, 1.9], // something tall behind the head
  [0.18, 0.26, 0.04, 1.3], // the lap again, slipped right
  [-0.56, 0.36, -0.66, 1.3], // far off, either side
  [0.58, 0.4, -0.62, 1.4],
  [0.32, 0.5, -0.34, 1.0],
  [-0.36, 0.28, 0.04, 1.1],
  [0.0, 0.4, -0.16, 1.2],
]
// How strongly each one shows: those that sit over the pale page are kept
// faint (additive light on near-white paper clips to white very quickly).
const GHOST_GAIN = [0.11, 0.12, 0.035, 0.1, 0.1, 0.07, 0.035, 0.04]
// The ghosts were points of size 1 × their size; under the book's 34° camera
// such a point covers tan(17°) world units, so the sprites scale by that.
const GHOST_SCALE = Math.tan((17 * PI) / 180)

export default {
  id: 'jhana-8',
  label: '8',
  title: 'Neither Perception nor Non-Perception',
  pali: 'nevasaññānāsaññāyatana',
  line: 'Almost nothing. Almost.',
  palette: { bg: '#131016', paper: '#e9e2e5', ink: '#5b4d58', accent: '#cfbfd8' },
  audio: { root: 61.74, intervals: [0, 7, 13, 18], brightness: 0.24, shimmer: 0.18, breathe: 0.35 },
  build,
}

function build(ctx) {
  const { THREE, group, paper, quality } = ctx

  // ---- the veils ----------------------------------------------------------------
  const veilMats = []
  const folds = []
  const shadowCards = []
  const tear = paper.rng('jhana-8 deckle')
  VEILS.forEach((v, i) => {
    const on = v.on === undefined ? paper.root : folds[v.on].outer
    const fold = paper.parallelFold({ on, a: v.a, b: v.b, p: v.p, q: v.q, z0: v.z0, z1: v.z1 })
    const mat = paper.material({
      color: v.color,
      roughness: 0.9,
      // a whisper of pearl: where a veil is seen against the dark beyond the
      // page it reads as lit vellum, not as a hole; over the paper it is lost
      emissive: '#2c2532',
      transparent: true,
      opacity: v.opacity,
      depthWrite: false,
    })
    veilMats.push({ mat, base: v.opacity })
    for (const panel of [fold.left, fold.right]) {
      const m = paper.card(panel, { shape: veilShape(THREE, panel.userData.length, v.z0, v.z1, tear), material: mat })
      // Translucent: no shadows either way. (Under VSM three.js also draws
      // receiveShadow meshes into the shadow map, so a receiver casts too.)
      m.castShadow = false
      m.receiveShadow = false
      m.renderOrder = 2 + i // far to near, after the opaque paper
      if (v.shadow) shadowCards.push(m)
    }
    folds.push(fold)
  })

  // ---- faint shadows: invisible, dithered silhouette cards -----------------------
  // Real vellum lets most of the light through, so its shadow is faint. The
  // engine's VSM shadows are all-or-nothing per caster, so the body and the
  // lap each get a twin card with the same outline that draws nothing on
  // screen (colorWrite off) but is opaque in the shadow pass through a fine
  // random dither (alphaMap + alphaTest, which three copies into its shadow
  // material). VSM blurs the dither into a partial shadow — with coverage c
  // about 1 − c of the light gets through (less a little light-bleed
  // correction) — so a soft, pale shadow of each form falls on the page, and
  // deepens where the two overlap. The visible vellum itself casts nothing.
  const dither = ditherTexture(THREE, paper.rng('jhana-8 dither'), 0.34)
  const shadowMat = new THREE.MeshBasicMaterial({
    colorWrite: false,
    depthWrite: false,
    alphaMap: dither,
    alphaTest: 0.5,
    side: THREE.DoubleSide,
  })
  const casters = []
  for (const card of shadowCards) {
    const c = new THREE.Mesh(card.geometry, shadowMat)
    c.castShadow = true
    c.receiveShadow = false
    card.parent.add(c)
    casters.push(c)
  }

  // ---- ghosts: soft additive sprites that come with the in-breath -----------------
  const n = quality === 'low' ? 4 : GHOSTS.length
  const rnd = paper.rng('jhana-8 ghosts')
  const home = new Float32Array(n * 3) // this breath's resting place
  const baseSize = new Float32Array(n)
  const weight = new Float32Array(n) // brightness this breath
  const lag = new Float32Array(n) // how late in the in-breath it arrives
  const tint = [new THREE.Color('#f4eef6'), new THREE.Color('#e6d8ee'), new THREE.Color('#f3ece4')]
  const reseed = () => {
    for (let i = 0; i < n; i++) {
      const g = GHOSTS[i]
      home[i * 3] = g[0] + (rnd() - 0.5) * 0.14
      home[i * 3 + 1] = g[1] + (rnd() - 0.5) * 0.1
      home[i * 3 + 2] = g[2] + (rnd() - 0.5) * 0.1
      baseSize[i] = g[3] * (0.8 + 0.4 * rnd())
      // some breaths a ghost barely comes at all
      weight[i] = rnd() < 0.25 ? 0.15 + 0.2 * rnd() : 0.55 + 0.45 * rnd()
      lag[i] = rnd() * 0.45
    }
  }
  reseed()
  const gTex = softTexture(THREE, paper.rng('jhana-8 ghost rim'))
  // One sprite each, not points: a ghost grows past the largest point size
  // many GPUs allow, and a point vanishes once its centre leaves the view.
  const ghosts = []
  for (let i = 0; i < n; i++) {
    const mat = new THREE.SpriteMaterial({
      color: 0x000000,
      map: gTex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const s = new THREE.Sprite(mat)
    s.name = 'jhana-8 ghost'
    s.renderOrder = 10
    s.frustumCulled = false
    group.add(s)
    ghosts.push(s)
  }

  // ---- a faint pearl light along the far edge ----------------------------------
  const pearl = new THREE.PointLight('#f1e8f4', 0, 2.4, 2)
  pearl.position.set(0, 0.32, -1.08)
  pearl.castShadow = false
  group.add(pearl)

  let lastPhase = 'out'

  return {
    update(frame) {
      const { reveal, breath, breathPhase, time } = frame

      // A new breath begins: the ghosts (invisible at the bottom of the
      // out-breath) choose new places, close to but not where they were.
      if (breathPhase === 'in' && lastPhase === 'out') reseed()
      lastPhase = breathPhase

      // Perception and non-perception trade places: as the ghosts come, the
      // vellum thins a little; as they go, it returns.
      const b = smooth(breath)
      for (let i = 0; i < veilMats.length; i++) {
        const vm = veilMats[i]
        vm.mat.opacity = vm.base * (1 - 0.2 * b) * (0.35 + 0.65 * reveal)
      }

      const out = breathPhase === 'out'
      const vis = reveal * reveal
      for (let i = 0; i < n; i++) {
        // arrive late or early in the in-breath; leave with the out-breath
        const a = out ? b : smooth((breath - lag[i]) / (1 - lag[i]))
        const k = vis * weight[i] * a * GHOST_GAIN[i]
        const s = ghosts[i]
        s.material.color.copy(tint[i % tint.length]).multiplyScalar(k)
        // dissolving: swell and rise a little as the breath leaves
        const going = out ? 1 - breath : 0
        s.scale.setScalar(baseSize[i] * (0.85 + 0.15 * a + 0.55 * going) * GHOST_SCALE)
        s.position.set(
          home[i * 3] + 0.01 * Math.sin(0.11 * time + i),
          (home[i * 3 + 1] + 0.06 * going) * (0.4 + 0.6 * reveal),
          home[i * 3 + 2],
        )
        s.visible = vis > 0.002
      }

      // stays visible at 0: a light count change recompiles shaders
      pearl.intensity = reveal * (0.5 + 0.16 * b)
    },
    dispose() {
      for (const s of ghosts) s.material.dispose()
      gTex.dispose()
      shadowMat.dispose()
      dither.dispose()
      for (const c of casters) c.parent && c.parent.remove(c)
      group.remove(...ghosts, pearl)
      paper.dispose()
    },
  }
}

// A veil's outline in panel coords (s from the glue line to the crease, t
// along z): a strip whose near and far edges are torn rather than ruled — a
// slight slant plus a soft deckle that wanders a few millimetres and comes
// back to the true line at the glue and at the crease, so the two panels of
// a tent still meet cleanly along their ridge.
function veilShape(THREE, L, z0, z1, rnd) {
  const d = Math.min(0.025, (z1 - z0) * 0.15)
  const amp = Math.min(0.012, (z1 - z0) * 0.08)
  const N = 10
  const wave = () => {
    const f = 1.5 + rnd() * 1.5
    const p = rnd() * PI * 2
    return (u) => amp * Math.sin(PI * u) * (0.6 * Math.sin(PI * f * u + p) + 0.4)
  }
  const near = wave()
  const far = wave()
  const s = new THREE.Shape()
  s.moveTo(0, z0)
  for (let i = 1; i <= N; i++) {
    const u = i / N
    s.lineTo(L * u, z0 + d * u + far(u))
  }
  for (let i = N; i >= 0; i--) {
    const u = i / N
    s.lineTo(L * u, z1 - d * 0.4 * u - near(u))
  }
  s.closePath()
  return s
}

// A random binary dither in the green channel (what alphaMap reads):
// `coverage` of the texels are opaque. Nearest filtering keeps it binary for
// alphaTest. Repeated so its cells are far smaller than a shadow-map texel:
// every texel then samples it independently and VSM's wide blur averages the
// noise away instead of printing it as grain.
function ditherTexture(THREE, rnd, coverage) {
  const n = 256
  const data = new Uint8Array(n * n * 4)
  for (let i = 0; i < n * n; i++) {
    const on = rnd() < coverage ? 255 : 0
    data[i * 4] = data[i * 4 + 1] = data[i * 4 + 2] = on
    data[i * 4 + 3] = 255
  }
  const tex = new THREE.DataTexture(data, n, n, THREE.RGBAFormat)
  tex.magFilter = THREE.NearestFilter
  tex.minFilter = THREE.NearestFilter
  tex.generateMipmaps = false
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(2.5, 2.5)
  tex.needsUpdate = true
  return tex
}

// A ghost: a large, very soft upright oval with a slightly uneven rim — a
// presence rather than a light source, so it never reads as a lamp, a bokeh
// dot or a figure.
function softTexture(THREE, rnd) {
  const s = 128
  const c = document.createElement('canvas')
  c.width = c.height = s
  const g = c.getContext('2d')
  const img = g.createImageData(s, s)
  const lobes = []
  for (let k = 0; k < 3; k++) lobes.push([2 + k, rnd() * PI * 2, 0.03 + 0.03 * rnd()])
  for (let y = 0; y < s; y++) {
    for (let x = 0; x < s; x++) {
      const dx = ((x + 0.5) / s - 0.5) / 0.3
      const dy = ((y + 0.5) / s - 0.5) / 0.48
      const ang = Math.atan2(dy, dx)
      let rim = 1
      for (const [f, p, amp] of lobes) rim -= amp * (1 + Math.sin(f * ang + p))
      const r2 = (dx * dx + dy * dy) / (rim * rim)
      const a = r2 >= 1 ? 0 : (1 - r2) ** 2.4
      const o = (y * s + x) * 4
      img.data[o] = img.data[o + 1] = img.data[o + 2] = 255
      img.data[o + 3] = Math.round(255 * 0.8 * a)
    }
  }
  g.putImageData(img, 0, 0)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}
