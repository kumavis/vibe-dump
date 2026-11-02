// kit.js — pieces shared by the two bookend spreads, intro (dusk) and outro
// (dawn). They rhyme on purpose: the same horizon of hills, the same breath orb,
// the same motes, only the light changes. Everything here is built from
// ctx.paper mechanisms or fades with frame.reveal, so the pages close flat.

import * as THREE from 'three'

export const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v)
export const smoothstep = (a, b, x) => {
  const t = clamp((x - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}
const gauss = (x, c, r) => Math.exp(-(((x - c) / r) ** 2))

// ---------------------------------------------------------------------------
// The horizon
// ---------------------------------------------------------------------------
//
// Why V-folds and not parallel folds: a parallel fold's panels always contain
// the spine direction, so from the reader's seat (looking up the spine from the
// near edge) they read as roofs running away from you, never as a skyline. A
// V-fold whose glue lines run almost across the page (alpha near π/2) stands up
// as a wall that FACES the reader, creased down the middle at the gutter — the
// classic pop-up backdrop. Each hill layer is one such wall, its top edge cut as
// a gentle ridge, the layers stepping back in z and growing taller.
//
// All layers share alpha and gamma. The paper library guarantees that V-folds
// with equal alpha/gamma keep their panels parallel at every θ, so the layers
// fold down onto each other like a stack of cards and never cut through one
// another. alpha = 1.25 (72°) is the compromise between facing the reader
// (bigger) and rising early enough to be seen half open (smaller); gamma just
// under π/2 leans every wall back ~6° so its face catches the key light.

export const HILL_ALPHA = 1.25
export const HILL_GAMMA = 1.54
const SIN_A = Math.sin(HILL_ALPHA)
const COT_G = Math.cos(HILL_GAMMA) / Math.sin(HILL_GAMMA)

// Glue length of a full-width layer: its outer end lands 0.95 from the spine.
export const HILL_REACH = 0.95 / SIN_A

// Soft envelope so every ridge slopes down to a sliver at the outer page edges
// (which also keeps the folded-flat wall inside the page outline).
const envelope = (x) => 1 - 0.85 * smoothstep(0.6, 0.97, Math.abs(x))

// A lopsided bump: width rl on its left flank, rr on its right. Real hills are
// rarely symmetric; a long slope on one side and a steeper one on the other
// is what makes a skyline read as land rather than as a wave.
const bump = (x, c, rl, rr) => gauss(x, c, x < c ? rl : rr)

// Ridge heights across the spread, x = −0.95 (left edge) … +0.95 (right edge).
// The middle of every layer dips, so the spreads have a valley at the gutter
// where the orb (and, in the outro, the window) sits. A faint long wave keeps
// the slopes from looking drawn with a compass.
export const RIDGES = {
  far: (x) =>
    1.1 *
    envelope(x) *
    (0.22 + 0.26 * bump(x, -0.4, 0.4, 0.2) + 0.2 * bump(x, 0.47, 0.28, 0.2) + 0.04 * bump(x, 0.84, 0.08, 0.12) +
      0.012 * Math.sin(7.3 * x + 0.8)),
  mid: (x) =>
    envelope(x) *
    (0.12 + 0.17 * bump(x, -0.64, 0.24, 0.2) + 0.18 * bump(x, 0.38, 0.17, 0.3) + 0.03 * bump(x, -0.16, 0.1, 0.1) +
      0.01 * Math.sin(9.1 * x + 2.1)),
  near: (x) =>
    envelope(x) *
    (0.07 + 0.09 * bump(x, -0.4, 0.26, 0.17) + 0.1 * bump(x, 0.7, 0.22, 0.14) + 0.012 * Math.sin(11.7 * x + 0.4)),
}

// A V panel cut as a hill. Panel coords (s, t): t along the glue line from the
// apex, s up the wall. The inner edge is the crease, which sits at gamma from
// the glue line, so every point is sheared by s·cot γ to keep the outline's
// "verticals" parallel to the crease. ridge(t') gives the height at distance
// t' from the crease along the wall.
export function hillShape(ridge, w, steps = 44) {
  const pts = [new THREE.Vector2(0, 0), new THREE.Vector2(0, w)]
  for (let i = steps; i >= 0; i--) {
    const tp = (w * i) / steps
    const s = ridge(tp)
    pts.push(new THREE.Vector2(s, tp + s * COT_G))
  }
  return new THREE.Shape(pts)
}

// One hill layer = one V-fold at apex z, both panels cut from the same signed
// ridge function F(x): the right panel reads F(+x), the left F(−x), so the
// skyline is continuous across the gutter.
export function hillLayer(paper, { z, ridge, material, reach = HILL_REACH }) {
  const crest = ridge(0)
  const fold = paper.vFold({
    z,
    alpha: HILL_ALPHA,
    gamma: HILL_GAMMA,
    length: crest / Math.sin(HILL_GAMMA),
    toward: 'far',
  })
  const right = paper.card(fold.right, { shape: hillShape((t) => ridge(t * SIN_A), reach), material })
  const left = paper.card(fold.left, { shape: hillShape((t) => ridge(-t * SIN_A), reach), material })
  return { fold, right, left }
}

// A page flap hinged across the page (alpha = −π/2) stands with its BACK face
// toward the reader. Gluing the card to a child turned π about the flap's s
// axis puts its front face (the one the lighting and the shadow normal-offset
// are computed for) toward the reader; it still lies in the flap's plane, so
// it folds flat exactly as before. Mirrors t, which symmetric shapes don't mind.
export function frontFace(paper, panel) {
  const o = paper.place(panel)
  o.rotation.x = Math.PI
  return o
}

// ---------------------------------------------------------------------------
// Canvas textures (no assets)
// ---------------------------------------------------------------------------

function canvas(w, h = w) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return c
}

export function toTexture(c) {
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

// Paper grain: a fine, mostly-white noise tile used as a card's map, so the
// cut layers have the same tooth as the printed pages. Seeded, so stable.
export function grainTexture(rnd, size = 128, repeat = 5) {
  const c = canvas(size)
  const g = c.getContext('2d')
  const img = g.createImageData(size, size)
  for (let i = 0; i < size * size; i++) {
    const fibre = rnd() < 0.04 ? -14 * rnd() : 0
    const v = 238 + 17 * rnd() + fibre
    img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v
    img.data[i * 4 + 3] = 255
  }
  g.putImageData(img, 0, 0)
  const t = toTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(repeat, repeat)
  return t
}

// A round, soft glow: stops = [[offset, 'rgba(...)'], ...] from the centre out.
export function glowTexture(stops, size = 128) {
  const c = canvas(size)
  const g = c.getContext('2d')
  const r = size / 2
  const grad = g.createRadialGradient(r, r, 0, r, r, r)
  for (const [o, col] of stops) grad.addColorStop(o, col)
  g.fillStyle = grad
  g.fillRect(0, 0, size, size)
  return toTexture(c)
}

// A thin luminous ring (the breath ring's echo around the orb).
export function ringTexture(size = 128) {
  return glowTexture(
    [
      [0, 'rgba(255,255,255,0)'],
      [0.5, 'rgba(255,255,255,0)'],
      [0.74, 'rgba(255,255,255,0.5)'],
      [0.84, 'rgba(255,255,255,0.3)'],
      [1, 'rgba(255,255,255,0)'],
    ],
    size,
  )
}

// ---------------------------------------------------------------------------
// Flat light on paper: a quad glued to a panel frame with chosen UVs
// ---------------------------------------------------------------------------
//
// corners: four [s, t] points in the frame's body coords (s ≥ 0 away from the
// glue line / spine, t along it); uvs: four [u, v]. Lies `y` above the frame.
// Used for light that straddles the gutter: give both halves u = 0.5 + 0.5·s/S
// and a left/right-symmetric texture and the seam at the spine disappears.
export function quadOn(frame, corners, uvs, y, material) {
  const dir = frame.userData && frame.userData.dir < 0 ? -1 : 1
  const pos = new Float32Array(12)
  const uv = new Float32Array(8)
  for (let i = 0; i < 4; i++) {
    pos[i * 3] = dir * corners[i][0]
    pos[i * 3 + 1] = y
    pos[i * 3 + 2] = corners[i][1]
    uv[i * 2] = uvs[i][0]
    uv[i * 2 + 1] = uvs[i][1]
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
  geometry.setIndex([0, 1, 2, 0, 2, 3])
  const mesh = new THREE.Mesh(geometry, material)
  mesh.renderOrder = 2
  mesh.castShadow = false
  mesh.receiveShadow = false
  frame.add(mesh)
  return mesh
}

export function lightMaterial(map, color, opacity = 0) {
  return new THREE.MeshBasicMaterial({
    map,
    color,
    transparent: true,
    opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    toneMapped: false,
  })
}

// ---------------------------------------------------------------------------
// The breath orb (the nimitta)
// ---------------------------------------------------------------------------
//
// Three additive sprites — a wide halo, a bright core and a thin ring — plus a
// small warm point light. Sprites ignore lighting and never cast shadows. The
// caller drives it with a 0..1 "swell" and the reveal fade.
export function makeOrb(group, { x = 0, y, z, haloColor, coreColor, ringColor, lightColor, distance = 1.6 }) {
  const root = new THREE.Group()
  root.name = 'orb'
  root.position.set(x, y, z)
  group.add(root)

  const haloMap = glowTexture([
    [0, 'rgba(255,255,255,0.95)'],
    [0.18, 'rgba(255,255,255,0.55)'],
    [0.45, 'rgba(255,255,255,0.16)'],
    [1, 'rgba(255,255,255,0)'],
  ])
  const coreMap = glowTexture([
    [0, 'rgba(255,255,255,1)'],
    [0.35, 'rgba(255,255,255,0.9)'],
    [0.6, 'rgba(255,255,255,0.25)'],
    [1, 'rgba(255,255,255,0)'],
  ])
  const ringMap = ringTexture()
  const sprite = (map, color, order) => {
    const m = new THREE.SpriteMaterial({
      map,
      color,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    })
    const s = new THREE.Sprite(m)
    s.renderOrder = order
    s.visible = false
    root.add(s)
    return s
  }
  const halo = sprite(haloMap, haloColor, 3)
  const ring = sprite(ringMap, ringColor, 4)
  const core = sprite(coreMap, coreColor, 5)
  const lamp = new THREE.PointLight(lightColor, 0, distance, 2)
  lamp.castShadow = false
  root.add(lamp)

  return {
    root,
    halo,
    ring,
    core,
    lamp,
    baseY: y,
    dispose() {
      for (const s of [halo, ring, core]) s.material.dispose()
      haloMap.dispose()
      coreMap.dispose()
      ringMap.dispose()
      lamp.dispose()
      group.remove(root)
    },
  }
}

// ---------------------------------------------------------------------------
// Motes
// ---------------------------------------------------------------------------
//
// A few slow points of light. Each drifts on its own long, smooth loop (tens of
// seconds) and the whole cloud lifts a hair on the in-breath. Positions are
// rewritten in place every frame: no allocations.
export function makeMotes(group, rnd, { count, box, color, size = 0.045, map }) {
  const [x0, x1, y0, y1, z0, z1] = box
  const base = new Float32Array(count * 3)
  const pos = new Float32Array(count * 3)
  const col = new Float32Array(count * 3)
  const wob = new Float32Array(count * 6) // ax, ay, az amplitudes, phase, freq, breath gain
  for (let i = 0; i < count; i++) {
    base[i * 3] = x0 + rnd() * (x1 - x0)
    base[i * 3 + 1] = y0 + rnd() * (y1 - y0)
    base[i * 3 + 2] = z0 + rnd() * (z1 - z0)
    const b = 0.45 + 0.55 * rnd()
    col[i * 3] = col[i * 3 + 1] = col[i * 3 + 2] = b
    wob[i * 6] = 0.03 + 0.05 * rnd()
    wob[i * 6 + 1] = 0.02 + 0.04 * rnd()
    wob[i * 6 + 2] = 0.02 + 0.04 * rnd()
    wob[i * 6 + 3] = rnd() * Math.PI * 2
    wob[i * 6 + 4] = (Math.PI * 2) / (38 + 50 * rnd()) // one loop every 38–88 s
    wob[i * 6 + 5] = 0.015 + 0.03 * rnd()
  }
  pos.set(base)
  const geometry = new THREE.BufferGeometry()
  const attr = new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage)
  geometry.setAttribute('position', attr)
  geometry.setAttribute('color', new THREE.BufferAttribute(col, 3))
  const material = new THREE.PointsMaterial({
    color,
    map,
    size,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  })
  const points = new THREE.Points(geometry, material)
  points.renderOrder = 6
  points.visible = false
  points.frustumCulled = false
  group.add(points)

  return {
    points,
    material,
    update(time, breath) {
      for (let i = 0; i < count; i++) {
        const k = i * 6
        const a = time * wob[k + 4] + wob[k + 3]
        pos[i * 3] = base[i * 3] + wob[k] * Math.sin(a)
        pos[i * 3 + 1] = base[i * 3 + 1] + wob[k + 1] * Math.sin(a * 1.7 + 1.3) + wob[k + 5] * breath
        pos[i * 3 + 2] = base[i * 3 + 2] + wob[k + 2] * Math.cos(a * 1.3)
      }
      attr.needsUpdate = true
    },
    dispose() {
      geometry.dispose()
      material.dispose()
      group.remove(points)
    },
  }
}
