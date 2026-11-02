// intro — Breath. Dusk. The quietest spread: it teaches the breath.
//
// A valley of three cut-paper hill layers (V-fold walls, see intro/kit.js for
// why V-folds), a still pond lying across the gutter, two tufts of reeds that
// stand up as the page opens, and the breath orb — the nimitta — floating over
// the valley, swelling and brightening on the in-breath, settling on the out.

import {
  RIDGES,
  hillLayer,
  quadOn,
  lightMaterial,
  glowTexture,
  grainTexture,
  toTexture,
  frontFace,
  makeOrb,
  makeMotes,
} from './intro/kit.js'

// Pond: an oval centred on the gutter, cut in two halves (one glued to each
// page) so it folds shut like a printed spread. Far edge clear of the near
// hill, near edge inside z ≤ 0.45 so the printed line stays clear.
const POND = { z: 0.3, rx: 0.4, rz: 0.11 }
const RIM = { rx: 0.43, rz: 0.134 }

function halfOval(THREE, rx, rz, zc, steps = 28) {
  const pts = []
  for (let i = 0; i <= steps; i++) {
    const a = -Math.PI / 2 + (Math.PI * i) / steps
    pts.push(new THREE.Vector2(rx * Math.cos(a), zc + rz * Math.sin(a)))
  }
  return new THREE.Shape(pts)
}

// A tuft of reeds on one flap. Flap coords (s, t): s up from the hinge line,
// t along it. Blades fan out from a thin shared base strip — each leans a
// little further out than its neighbour, so the outlines can never cross —
// and a few are bulrushes: a thin stem with a fat seed head below the tip.
function reedShape(THREE, rnd, n, hMin, hMax, rushes) {
  const gap = 0.024
  const t0 = (-(n - 1) * gap) / 2
  const fs = [0, 0.22, 0.42, 0.6, 0.68, 0.74, 0.86, 0.9, 0.95, 1]
  const pts = [new THREE.Vector2(0, t0 - 0.01)]
  for (let i = 0; i < n; i++) {
    const tb = t0 + i * gap + (rnd() - 0.5) * 0.005
    const centre = i - (n - 1) / 2
    const h = hMin + (hMax - hMin) * (1 - Math.abs(centre) / n) * (0.75 + 0.25 * rnd())
    const lean = centre * 0.014 + (rnd() - 0.5) * 0.006
    const rush = rushes.includes(i)
    const half = (f) => {
      if (!rush) return 0.0058 * (1 - f) ** 0.85
      if (f > 0.7 && f < 0.9) return 0.0062 // the seed head
      return 0.0022 * (1 - f * 0.6)
    }
    const at = (f, side) => new THREE.Vector2(Math.max(0.004, h * f), tb + lean * f * f + side * half(f))
    for (const f of fs) pts.push(at(f, -1))
    for (let k = fs.length - 2; k >= 0; k--) pts.push(at(fs[k], 1))
  }
  pts.push(new THREE.Vector2(0, t0 + (n - 1) * gap + 0.01))
  return new THREE.Shape(pts)
}

function build(ctx) {
  const { THREE, group, paper, quality } = ctx
  const rnd = paper.rng('intro · breath')
  const made = [] // our own geometries / materials / textures, for dispose()

  // ---- the horizon: three hill layers, nearest lowest ----------------------
  // Apexes step back 0.22 in z; the farther the layer, the taller its ridge.
  // Dusk colours: the far hills palest (closest to the sky), the near darkest.
  const grain = grainTexture(rnd)
  made.push(grain)
  const mat = (color) => paper.material({ color, roughness: 0.94, map: grain })
  hillLayer(paper, { z: -0.3, ridge: RIDGES.far, material: mat('#aba9c7') })
  hillLayer(paper, { z: -0.08, ridge: RIDGES.mid, material: mat('#807ba2') })
  hillLayer(paper, { z: 0.13, ridge: RIDGES.near, material: mat('#59537a') })

  // ---- the pond: two layers of flat card per page --------------------------
  // A pale sand rim, then the water a hair above it. Flat things have no shadow
  // worth casting onto the page 2 mm below; they keep receiving the hills'.
  const rimMat = paper.material({ color: '#d2c5ae', roughness: 0.96 })
  const waterMat = paper.material({ color: '#4e5879', roughness: 0.3, metalness: 0.18 })
  for (const page of [paper.root.left, paper.root.right]) {
    const rim = paper.card(paper.place(page, { y: 0.002 }), { shape: halfOval(THREE, RIM.rx, RIM.rz, POND.z), material: rimMat })
    const water = paper.card(paper.place(page, { y: 0.0035 }), {
      shape: halfOval(THREE, POND.rx, POND.rz, POND.z),
      material: waterMat,
    })
    rim.castShadow = water.castShadow = false
  }

  // The orb's light on the water: a soft pool with a long vertical streak,
  // drawn once and laid over both halves with mirrored UVs (u = 0.5 at the
  // gutter), so the seam vanishes.
  const sheenCanvas = document.createElement('canvas')
  sheenCanvas.width = 128
  sheenCanvas.height = 256
  {
    const g = sheenCanvas.getContext('2d')
    const pool = g.createRadialGradient(64, 120, 0, 64, 120, 64)
    pool.addColorStop(0, 'rgba(255,255,255,0.45)')
    pool.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = pool
    g.fillRect(0, 0, 128, 256)
    g.save()
    g.translate(64, 128)
    g.scale(0.16, 1)
    const streak = g.createRadialGradient(0, 0, 0, 0, 0, 118)
    streak.addColorStop(0, 'rgba(255,255,255,1)')
    streak.addColorStop(0.5, 'rgba(255,255,255,0.4)')
    streak.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = streak
    g.fillRect(-400, -128, 800, 256)
    g.restore()
  }
  const sheenMap = toTexture(sheenCanvas)
  const sheenMat = lightMaterial(sheenMap, new THREE.Color('#ffd9a0'))
  made.push(sheenMap, sheenMat)
  const S = 0.2
  const t0 = POND.z - POND.rz + 0.008
  const t1 = POND.z + POND.rz - 0.008
  for (const page of [paper.root.left, paper.root.right]) {
    const q = quadOn(
      page,
      [[0, t0], [S, t0], [S, t1], [0, t1]],
      [[0.5, 1], [1, 1], [1, 0], [0.5, 0]],
      0.0045,
      sheenMat,
    )
    made.push(q.geometry)
  }

  // ---- reeds: two flaps at the pond's ends ----------------------------------
  // Hinged on a line running across the page (alpha = −π/2), so the tuft faces
  // the reader when it stands. Flat, the blades point toward the reader and
  // stay inside z ≤ 0.44; they lift with the page to 96°, just past upright,
  // leaning back a touch. Folding forward, they never meet the near hill, which
  // also folds forward but from further back. The breath sways them by about a
  // degree (scaled by the same sin², so still 0 when closed).
  const reedMat = paper.material({ color: '#4a4254', roughness: 0.9, map: grain })
  const sway = { v: 0 }
  const reedLift = (th) => (1.68 + sway.v) * Math.sin(th / 2) ** 2
  const reedL = paper.flap({ side: 'left', x: 0.41, z: 0.285, alpha: -Math.PI / 2, length: 0.15, lift: reedLift })
  const reedR = paper.flap({ side: 'right', x: 0.44, z: 0.31, alpha: -Math.PI / 2, length: 0.12, lift: reedLift })
  paper.card(frontFace(paper, reedL.panel), { shape: reedShape(THREE, rnd, 7, 0.09, 0.15, [2, 5]), material: reedMat })
  paper.card(frontFace(paper, reedR.panel), { shape: reedShape(THREE, rnd, 5, 0.06, 0.12, [1]), material: reedMat })

  // ---- the breath orb --------------------------------------------------------
  // Over the gutter, in the dip between the far peaks, in front of the far
  // hills so its little light washes their faces.
  const orb = makeOrb(group, {
    y: 0.56,
    z: -0.04,
    haloColor: new THREE.Color('#f2c27e'),
    coreColor: new THREE.Color('#fff1d6'),
    ringColor: new THREE.Color('#f6d29c'),
    lightColor: new THREE.Color('#ffd49a'),
    distance: 1.5,
  })

  // ---- motes -------------------------------------------------------------------
  const moteMap = glowTexture([
    [0, 'rgba(255,255,255,1)'],
    [0.3, 'rgba(255,255,255,0.55)'],
    [1, 'rgba(255,255,255,0)'],
  ], 64)
  made.push(moteMap)
  const motes = makeMotes(group, rnd, {
    count: quality === 'low' ? 7 : 14,
    box: [-0.85, 0.85, 0.14, 0.78, -0.5, 0.36],
    color: new THREE.Color('#ffe2b0'),
    size: 0.04,
    map: moteMap,
  })

  return {
    update(frame) {
      const rv = frame.reveal
      const b = frame.breath
      const on = rv > 0.002

      // The orb is the meditation aid: it swells and brightens over the 4.5 s
      // in-breath, holds, and settles over the out-breath. Big, slow, unmistakable.
      orb.root.position.y = orb.baseY + 0.03 * (b - 0.5)
      orb.halo.visible = orb.core.visible = orb.ring.visible = on
      const hs = 0.26 + 0.2 * b
      orb.halo.scale.set(hs, hs, 1)
      orb.halo.material.opacity = rv * (0.32 + 0.58 * b)
      const cs = 0.065 + 0.035 * b
      orb.core.scale.set(cs, cs, 1)
      orb.core.material.opacity = rv * (0.72 + 0.28 * b)
      // the ring opens outward as the breath fills, like the HUD's breath ring
      const rs = 0.15 + 0.29 * b
      orb.ring.scale.set(rs, rs, 1)
      orb.ring.material.opacity = rv * (0.05 + 0.22 * b)
      orb.lamp.intensity = rv * (0.08 + 0.42 * b)

      sheenMat.opacity = rv * (0.16 + 0.42 * b)
      sway.v = 0.035 * (b - 0.5)

      motes.points.visible = on
      motes.material.opacity = rv * (0.3 + 0.45 * b)
      if (on) motes.update(frame.time, b)
    },
    dispose() {
      orb.dispose()
      motes.dispose()
      for (const m of made) m.dispose()
      paper.dispose()
    },
  }
}

export default {
  id: 'intro',
  label: '',
  title: 'Breath',
  pali: 'ānāpānasati',
  line: 'Sit. Let the breath find you.',
  palette: { bg: '#151318', paper: '#ebe2d1', ink: '#3d352d', accent: '#f0c98a' },
  audio: { root: 98, intervals: [0, 7, 12], brightness: 0.35, shimmer: 0.2, breathe: 0.8 },
  build,
}
