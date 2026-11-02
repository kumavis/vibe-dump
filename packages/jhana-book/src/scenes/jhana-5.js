// jhana-5 — infinite space (ākāsānañcāyatana).
//
// A tunnel book. Five cards stand across the gutter one behind the other: a
// dark proscenium in front, three thin arches stepping back and shrinking, and
// a far card painted with a horizon, a vanishing grid and the colonnade going
// on forever. The real arches shrink faster than perspective would, so the eye
// reads far more depth than the 0.5 units the paper actually spans. Star dust
// hangs over and beyond the book; a faint violet light lives inside the tunnel.
// Nothing moves except the dust drifting and the breath brightening the far glow.
//
// THE FOLDS. A parallel fold's panels always contain the spine direction, so
// from the reader's seat they are walls running away from you; a card that
// faces the reader has to be a V-fold. Every frame here is a V-fold:
//   • gamma = π/2: the crease is cut square to the glue edge, so when the book
//     is open the crease stands straight up and each frame is a vertical card;
//   • toward 'far' with alpha = 1.12 (64° from the spine): the glue lines run
//     out and slightly back, so each frame is a shallow chevron — almost a flat
//     screen — whose two halves meet at the crease over the spine;
//   • the same alpha and gamma for all five keeps every frame's panels parallel
//     to the next one's at every θ, so the nested cards never touch while the
//     book opens or closes (they lean forward together and lie flat in a stack);
//   • a 'far' V-fold folds its crease forward as the book closes, a length
//     L·sin(alpha) — which is what limits the front frame: apex at z = 0.04 and
//     0.72 tall reaches z = 0.69 when flat, just inside the page.
// Each frame's opening is cut as a notch on the crease side of both panels, so
// the two halves make one arch with the crease running only through the top
// band (the paper stays whole). The cards are THREE.Shapes in panel (s, t):
// s up the crease, t out along the glue line.

import { createDust } from './jhana-5/dust.js'
import { createGlows } from './jhana-5/glows.js'
import { drawBackdrop, drawWash, drawGlow, drawFloorGrid } from './jhana-5/textures.js'

const ALPHA = 1.12
const GAMMA = Math.PI / 2
const HORIZON_V = 0.3 // the painted horizon, as a fraction of the far card's height

// z: apex on the spine · L: height (crease length) · R: half-width along the
// glue line · r, sS: the opening's radius and the height its arch springs from
const FRAMES = [
  { z: 0.04, L: 0.72, R: 0.66, r: 0.42, sS: 0.2, color: '#3b3576' }, // the proscenium
  { z: -0.1, L: 0.575, R: 0.405, r: 0.335, sS: 0.17, color: '#4b4392' },
  { z: -0.23, L: 0.455, R: 0.32, r: 0.265, sS: 0.135, color: '#5e54ae' },
  { z: -0.35, L: 0.36, R: 0.255, r: 0.21, sS: 0.105, color: '#7568c8' },
  { z: -0.47, L: 0.42, R: 0.3, sS: 0.12, far: true }, // the painted distance
]

// Pierced stars in the proscenium's jambs, in panel (s, t); u is how far
// across the jamb (from the opening to the outer edge) the star sits.
const PIERCED = [
  { s: 0.13, u: 0.5, size: 0.04 },
  { s: 0.29, u: 0.54, size: 0.03 },
  { s: 0.43, u: 0.48, size: 0.022 },
]
const piercedT = (f, p) => f.r + (f.R - f.r) * p.u

// A four-pointed star, as a hole.
function starPath(THREE, s, t, size) {
  const p = new THREE.Path()
  for (let k = 0; k < 8; k++) {
    const a = (k * Math.PI) / 4
    const rr = k % 2 ? size * 0.34 : size
    const ps = s + rr * Math.cos(a)
    const pt = t + rr * Math.sin(a)
    if (k) p.lineTo(ps, pt)
    else p.moveTo(ps, pt)
  }
  p.closePath()
  return p
}

// The front frame: a tall card with rounded outer corners, an arched doorway
// notched out of the crease side, and a few pierced stars in the jamb that
// catch the violet light behind.
function prosceniumShape(THREE, f) {
  const { L, R, r, sS } = f
  const c = 0.09
  const sh = new THREE.Shape()
  sh.moveTo(0, r)
  sh.lineTo(0, R)
  sh.lineTo(L - c, R)
  sh.quadraticCurveTo(L, R, L, R - c)
  sh.lineTo(L, 0)
  sh.lineTo(sS + r, 0)
  sh.absarc(sS, 0, r, 0, Math.PI / 2, false)
  sh.lineTo(0, r)
  for (const p of PIERCED) sh.holes.push(starPath(THREE, p.s, piercedT(f, p), p.size))
  return sh
}

// A thin round arch: legs from the floor to sS, then a half-ring.
function archShape(THREE, f) {
  const { R, r, sS } = f
  const sh = new THREE.Shape()
  sh.moveTo(0, r)
  sh.lineTo(0, R)
  sh.lineTo(sS, R)
  sh.absarc(sS, 0, R, Math.PI / 2, 0, true)
  sh.lineTo(sS + r, 0)
  sh.absarc(sS, 0, r, 0, Math.PI / 2, false)
  sh.lineTo(0, r)
  return sh
}

// The far card: solid, arch-topped.
function farShape(THREE, f) {
  const { R, sS } = f
  const sh = new THREE.Shape()
  sh.moveTo(0, 0)
  sh.lineTo(0, R)
  sh.lineTo(sS, R)
  sh.absarc(sS, 0, R, Math.PI / 2, 0, true)
  sh.lineTo(0, 0)
  return sh
}

// card() projects UVs over the card's bounding box in frame axes; for these
// cards we want u = t / R (0 on the crease) and v = s / L (0 at the floor) on
// both panels, so the left half mirrors the right and a texture's left edge
// lands on the crease.
function remapUV(mesh, dir, R, L) {
  const pos = mesh.geometry.attributes.position
  const uv = mesh.geometry.attributes.uv
  for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getZ(i) / R, (pos.getX(i) * dir) / L)
  uv.needsUpdate = true
}

export default {
  id: 'jhana-5',
  label: '5',
  title: 'Infinite Space',
  pali: 'ākāsānañcāyatana',
  line: 'Space, without edge.',
  palette: { bg: '#06061a', paper: '#2b2752', ink: '#d6cff7', accent: '#9d8cff' },
  audio: { root: 65.41, intervals: [0, 7, 14, 19, 26], brightness: 0.34, shimmer: 0.22, breathe: 0.45 },

  build(ctx) {
    const { THREE, group, paper, quality } = ctx
    const rnd = paper.rng('jhana-5 · ākāsa')

    const wash = new THREE.CanvasTexture(drawWash(rnd))
    wash.colorSpace = THREE.SRGBColorSpace
    const far = FRAMES[FRAMES.length - 1]
    const backTex = new THREE.CanvasTexture(drawBackdrop(rnd, { horizonV: HORIZON_V, aspect: far.R / far.L }))
    backTex.colorSpace = THREE.SRGBColorSpace
    backTex.anisotropy = 4
    const glowTex = new THREE.CanvasTexture(drawGlow())
    glowTex.colorSpace = THREE.SRGBColorSpace

    // The far card glows a little by itself (its own image as emissive map),
    // more on the in-breath.
    const backMat = new THREE.MeshStandardMaterial({
      map: backTex,
      emissiveMap: backTex,
      emissive: new THREE.Color('#ffffff'),
      emissiveIntensity: 0.3,
      roughness: 0.95,
      side: THREE.DoubleSide,
    })

    // ---- the frames ------------------------------------------------------------
    let farFold = null
    const starAnchors = []
    const frontPanels = []
    for (const f of FRAMES) {
      const fold = paper.vFold({ z: f.z, alpha: ALPHA, gamma: GAMMA, length: f.L, toward: 'far' })
      const shape = f.far ? farShape(THREE, f) : f === FRAMES[0] ? prosceniumShape(THREE, f) : archShape(THREE, f)
      // each arch further back glows a touch more of its own colour: layered
      // planes of dusk, lighter with distance
      const depth = FRAMES.indexOf(f) / (FRAMES.length - 1)
      const material = f.far
        ? backMat
        : paper.material({ color: f.color, map: wash, roughness: 0.94, emissive: f.color, emissiveIntensity: 0.22 * depth * depth })
      for (const panel of [fold.left, fold.right]) {
        const mesh = paper.card(panel, { shape, material })
        remapUV(mesh, panel.userData.dir, f.R, f.L)
      }
      if (f.far) farFold = fold
      // light through the pierced stars: a glow just behind each hole (−y is
      // the inside of the V), so only the hole lets it through
      if (f === FRAMES[0]) {
        for (const panel of [fold.left, fold.right]) {
          frontPanels.push(panel)
          for (const p of PIERCED) starAnchors.push(paper.place(panel, { x: p.s, y: -0.012, z: piercedT(f, p) }))
        }
      }
    }
    const pierced = createGlows(THREE, group, {
      anchors: starAnchors,
      sizes: starAnchors.map((_, i) => 0.035 + 1.9 * PIERCED[i % PIERCED.length].size),
      colors: '#9d86ff',
      hot: '#e9e2ff',
    })
    // The glow stands in for light coming through a hole from behind, so it may
    // only be seen from the card's outer face. Half open, the camera can look
    // at a frame's inner face; then that panel's glows go out. (The camera is
    // read after each render, so this lags a frame — invisible.)
    const camPos = new THREE.Vector3()
    const _n = new THREE.Vector3()
    const _p = new THREE.Vector3()
    pierced.points.onAfterRender = (renderer, scene, camera) => camPos.setFromMatrixPosition(camera.matrixWorld)
    const facing = (panel) => {
      const e = panel.matrixWorld.elements
      _n.set(e[4], e[5], e[6]).normalize()
      _p.set(e[12], e[13], e[14])
      _p.subVectors(camPos, _p).normalize()
      const d = _n.dot(_p)
      const k = Math.min(1, Math.max(0, (d - 0.02) / 0.25))
      return k * k * (3 - 2 * k)
    }

    // ---- the grid, printed on both pages ------------------------------------------
    // A transparent card lying 0.002 above each page: the far card's vanishing
    // grid runs on out of the tunnel and across the paper toward the reader.
    const gridTex = new THREE.CanvasTexture(drawFloorGrid({ vpZ: far.z, nearZ: 0.42 }))
    gridTex.colorSpace = THREE.SRGBColorSpace
    gridTex.anisotropy = 4
    const gridMat = new THREE.MeshBasicMaterial({ map: gridTex, transparent: true, depthWrite: false, opacity: 0.5, side: THREE.DoubleSide })
    for (const page of [paper.root.left, paper.root.right]) {
      const mesh = paper.card(paper.place(page, { y: 0.002 }), { length: 1, z0: -0.7, z1: 0.7, material: gridMat })
      mesh.castShadow = false
      mesh.receiveShadow = false
      mesh.renderOrder = 1
      mesh.name = 'jhana-5:print' // flat ink on the page, not a mechanism
      const pos = mesh.geometry.attributes.position
      const uv = mesh.geometry.attributes.uv
      for (let i = 0; i < pos.count; i++) uv.setXY(i, Math.abs(pos.getX(i)), 1 - (pos.getZ(i) + 0.7) / 1.4)
      uv.needsUpdate = true
    }

    // ---- the far glow: a soft sprite on the far card's crease at the horizon ----
    // fold.ridge has +z up the crease and +y out of the V (toward the reader),
    // so this rides the card as it rises and folds.
    const glowAnchor = paper.place(farFold.ridge, { y: 0.03, z: far.L * HORIZON_V })
    const glowMat = new THREE.SpriteMaterial({
      map: glowTex,
      color: new THREE.Color('#b9a6ff'),
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const glow = new THREE.Sprite(glowMat)
    glow.renderOrder = 4
    glowAnchor.add(glow)

    // ---- a faint violet light inside the tunnel (no shadows) --------------------
    const light = new THREE.PointLight(new THREE.Color('#8a6dff'), 0, 1.4, 2)
    light.position.set(0, 0.3, -0.03)
    group.add(light)

    // ---- star dust: a far field beyond the book and a sparse near one -----------
    const n = quality === 'low' ? 0.5 : 1
    const tooLow = (x, y) => Math.atan2(Math.abs(x), y) > 1.33 // keep inside the fold fan
    const starColor = (rr, c) => {
      const k = rr()
      if (k < 0.5) c.set('#e6e2ff')
      else if (k < 0.75) c.set('#b9ccff')
      else if (k < 0.95) c.set('#b49dff')
      else c.set('#ffe6cf')
      c.multiplyScalar(0.35 + 0.5 * rr())
    }
    const farDust = createDust(THREE, paper.rng('jhana-5 far dust'), {
      count: Math.round(380 * n),
      wrapX: 3.8,
      place(rr, o) {
        do {
          o.x = (rr() * 2 - 1) * 3.8
          o.y = 0.2 + Math.pow(rr(), 1.3) * 1.5
        } while (tooLow(o.x, o.y))
        o.z = -0.9 - rr() * 3.6
        o.size = 0.012 + Math.pow(rr(), 4) * 0.034
        o.drift = 0.004 + rr() * 0.005
      },
      color: starColor,
    })
    const nearDust = createDust(THREE, paper.rng('jhana-5 near dust'), {
      count: Math.round(150 * n),
      wrapX: 1.35,
      place(rr, o) {
        do {
          o.x = (rr() * 2 - 1) * 1.35
          o.y = 0.08 + rr() * 1.05
        } while (tooLow(o.x, o.y))
        o.z = -0.85 + rr() * 1.15
        o.size = 0.007 + Math.pow(rr(), 4) * 0.018
        o.drift = 0.003 + rr() * 0.003
      },
      color: starColor,
    })
    group.add(farDust.points, nearDust.points)

    return {
      update(frame) {
        const { reveal, breath, time, openness } = frame
        const fade = reveal * Math.sqrt(reveal) // stars arrive late and leave early
        farDust.update(time, openness, fade)
        nearDust.update(time, openness, fade * 0.8)
        // the far glow breathes: brighter on the in-breath, never off
        backMat.emissiveIntensity = (0.1 + 0.2 * breath) * (0.35 + 0.65 * reveal)
        glowMat.opacity = reveal * (0.22 + 0.3 * breath)
        glow.scale.setScalar(0.34 + 0.08 * breath)
        glow.visible = reveal > 0.002
        light.intensity = reveal * (0.45 + 0.35 * breath)
        // the printed grid surfaces as space opens (and is gone when shut)
        gridMat.opacity = 0.5 * reveal
        gridMat.visible = reveal > 0.01
        const per = PIERCED.length
        for (let j = 0; j < frontPanels.length; j++) {
          const g = (0.75 + 0.35 * breath) * facing(frontPanels[j])
          for (let i = 0; i < per; i++) pierced.glow[j * per + i] = g
        }
        pierced.update(reveal)
      },
      dispose() {
        farDust.dispose()
        nearDust.dispose()
        pierced.dispose()
        glowMat.dispose()
        backMat.dispose()
        gridMat.dispose()
        gridTex.dispose()
        wash.dispose()
        backTex.dispose()
        glowTex.dispose()
        light.dispose()
        paper.dispose()
      },
    }
  },
}
