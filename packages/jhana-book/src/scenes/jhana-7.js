// jhana-7 — nothingness (ākiñcaññāyatana). "There is nothing."
//
// The emptiest spread in the book, and it means to be. Near-black paper; one
// slender grey card standing in the gutter (a few shades lighter than the
// page in albedo — under the warm key it reads as one quiet step up);
// one pale thread printed straight across both pages; one mote of light that
// drifts so slowly you are never sure it moved, brightening a little on each
// in-breath. The accent light is all but off and the drone is a low octave.
// Everything else was left out on purpose — please keep it that way.
//
// FOLD CHOICES
// • The card is a V-fold at the gutter with gamma = π/2, so its crease stands
//   bolt upright when the book is open. Its glue lines leave the spine at a
//   shallow alpha toward the far edge, which makes it a narrow V seen from the
//   front: the crease is a sharp vertical edge pointing at the reader, the left
//   leaf catches the key light and the right leaf turns into shade. In spread
//   space a gamma = π/2 V-fold barely moves — its crease rides the bisector of
//   the two pages — so as the book closes the card simply leans over with the
//   pages and its two leaves shut on each other like a tiny book: the quiet,
//   visible closing event the brief asks for.
// • Each leaf is cut as a tall thin strip (a THREE.Shape in the V panel's own
//   coordinates: s up the crease, t out along the glue line) whose top falls
//   a little away from the crease, so the pair ends in a shallow point.
// • The thread is two flat cards printed on the pages (one per page, meeting
//   at the spine), lifted 0.002 off the paper. Its alpha fades out toward both
//   outer edges so the line comes out of nothing and goes back into it.
// • The mote and its faint companion light are not glued to anything: they
//   fade with frame.reveal and are kept inside the wedge of the two pages, so
//   nothing hangs in the air while the book closes.

const PI = Math.PI
const TAU = PI * 2
const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v)

// ---- the card ----------------------------------------------------------------
const APEX_Z = 0.03 // where the crease meets the spine (glue runs toward −z)
const ALPHA = 0.38 // glue lines' angle from the spine: a narrow V in plan
const LEAF_H = 0.82 // crease length = height when open
const LEAF_W = 0.068 // glue edge = how wide each leaf is
const TOP_DROP = 0.05 // the outer top corner sits this much lower than the crease

// ---- the thread ----------------------------------------------------------------
const THREAD_Z = -0.24 // a horizon behind the card; its shadow crosses it
const THREAD_HALF = 0.0036 // half-width across the page (z)
const THREAD_LEN = 0.9 // from the spine toward each outer edge

// ---- the mote ------------------------------------------------------------------
const MOTE_RX = 0.44 // its slow ellipse around the card
const MOTE_RZ = 0.3
const MOTE_ZC = -0.06
const MOTE_PHASE = -0.95 // where the ellipse starts (front-left of the card)
const MOTE_SIZE = 0.26 // world size of the sprite (halo included)

export default {
  id: 'jhana-7',
  label: '7',
  title: 'Nothingness',
  pali: 'ākiñcaññāyatana',
  line: 'There is nothing here.',
  palette: { bg: '#050506', paper: '#25272a', ink: '#bdb9b0', accent: '#8d8b86' },
  audio: { root: 55, intervals: [0, 12], brightness: 0.15, shimmer: 0.04, breathe: 0.22 },
  build,
}

function build(ctx) {
  const { THREE, group, paper } = ctx // one mote: nothing to halve at quality 'low'

  // ---- one slender card in the gutter ------------------------------------------
  const stele = paper.vFold({ z: APEX_Z, alpha: ALPHA, gamma: PI / 2, length: LEAF_H, toward: 'far' })
  // (s, t): s up the crease, t out along the glue line. With gamma = π/2 the
  // crease edge is t = 0 and the glue edge is s = 0, so this is a tall strip.
  const leaf = new THREE.Shape()
  leaf.moveTo(0, 0)
  leaf.lineTo(LEAF_H, 0)
  leaf.lineTo(LEAF_H - TOP_DROP, LEAF_W)
  leaf.lineTo(0, LEAF_W)
  leaf.closePath()
  const cardMat = paper.material({ color: '#6b6d71', roughness: 0.88 })
  paper.card(stele.left, { shape: leaf, material: cardMat })
  paper.card(stele.right, { shape: leaf, material: cardMat })

  // ---- one pale thread across both pages ---------------------------------------
  const threadTex = threadTexture(THREE, paper.rng('jhana-7 thread'))
  const threadTexL = threadTex.clone() // the left page's u runs from its outer edge in
  threadTexL.repeat.set(-1, 1)
  threadTexL.offset.set(1, 0)
  threadTexL.needsUpdate = true
  const threadMat = (map) =>
    new THREE.MeshStandardMaterial({
      color: '#d6d0c3',
      map,
      transparent: true,
      depthWrite: false,
      roughness: 0.95,
      emissive: '#3a3730', // keeps it pale in the card's shadow without glowing
      emissiveMap: map,
      side: THREE.DoubleSide,
    })
  const threadMatR = threadMat(threadTex)
  const threadMatL = threadMat(threadTexL)
  const threads = []
  for (const [page, mat] of [
    [paper.root.right, threadMatR],
    [paper.root.left, threadMatL],
  ]) {
    const at = paper.place(page, { y: 0.002 })
    const m = paper.card(at, { length: THREAD_LEN, z0: THREAD_Z - THREAD_HALF, z1: THREAD_Z + THREAD_HALF, material: mat })
    m.castShadow = false // printed ink: receives the card's shadow, casts none
    m.renderOrder = 1
    threads.push(m)
  }

  // ---- one mote of light -------------------------------------------------------
  const moteTex = moteTexture(THREE)
  const moteGeo = new THREE.BufferGeometry()
  const motePos = new Float32Array(3)
  moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3))
  moteGeo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 2) // it moves; never cull it
  const moteMat = new THREE.PointsMaterial({
    color: '#f1ead9',
    map: moteTex,
    size: MOTE_SIZE,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const mote = new THREE.Points(moteGeo, moteMat)
  mote.name = 'jhana-7 mote'
  mote.renderOrder = 3
  mote.frustumCulled = false
  group.add(mote)

  // Its light: tiny, short-ranged, no shadows. It warms the card's face only
  // when the mote drifts close, which is most of what "happens" here.
  const glow = new THREE.PointLight('#efe4cf', 0, 1.1, 2)
  glow.castShadow = false
  group.add(glow)

  return {
    update(frame) {
      const { time, reveal, breath, theta } = frame

      // A slow, never-quite-repeating ellipse around the card (~6 minutes per
      // turn), with a gentle rise and fall on a different clock.
      const phi = MOTE_PHASE + 0.017 * time + 0.45 * Math.sin(0.0057 * time)
      let x = MOTE_RX * Math.sin(phi)
      let y = 0.46 + 0.12 * Math.sin(0.0103 * time + 1.1) + 0.015 * breath
      const z = MOTE_ZC + MOTE_RZ * Math.cos(phi)
      // Keep it inside the wedge of the two pages while the book closes
      // (polar angle from the bisector no more than θ/2, less a margin).
      const lim = Math.max(0, theta / 2 - 0.2)
      const ang = Math.atan2(x, y)
      if (Math.abs(ang) > lim) {
        const r = Math.hypot(x, y)
        const a = ang < 0 ? -lim : lim
        x = r * Math.sin(a)
        y = r * Math.cos(a)
      }
      motePos[0] = x
      motePos[1] = y
      motePos[2] = z
      moteGeo.attributes.position.needsUpdate = true
      glow.position.set(x, y, z)

      // Brightens faintly on the in-breath; gone before the pages meet.
      const lit = reveal * reveal
      const b = breath * breath * (3 - 2 * breath)
      moteMat.opacity = lit * (0.62 + 0.38 * b)
      moteMat.size = MOTE_SIZE * (0.92 + 0.14 * b)
      mote.visible = lit > 0.002
      glow.intensity = lit * (0.07 + 0.03 * b) // stays visible: a light count change recompiles shaders
    },
    dispose() {
      moteGeo.dispose()
      moteMat.dispose()
      moteTex.dispose()
      threadTex.dispose()
      threadTexL.dispose()
      threadMatR.dispose()
      threadMatL.dispose()
      group.remove(mote, glow)
      for (const m of threads) m.parent && m.parent.remove(m)
      paper.dispose()
    },
  }
}

// A thread of pale ink, u from the spine (0) to the outer end (1): full near
// the gutter, a slight hand-drawn waver in density, fading out over the last
// third. v is across the line: soft edges so a two-pixel line stays smooth.
function threadTexture(THREE, rnd) {
  const w = 512
  const h = 8
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const g = c.getContext('2d')
  const img = g.createImageData(w, h)
  const across = [0.15, 0.55, 0.9, 1, 1, 0.9, 0.55, 0.15]
  // a few slow random wavers, summed
  const waves = []
  for (let k = 0; k < 4; k++) waves.push([1 + rnd() * 6, rnd() * TAU, 0.03 + rnd() * 0.04])
  for (let i = 0; i < w; i++) {
    const u = i / (w - 1)
    let a = 1
    for (const [f, p, amp] of waves) a -= amp * (0.5 + 0.5 * Math.sin(TAU * f * u + p))
    const fade = 1 - clamp((u - 0.55) / 0.43, 0, 1)
    a *= fade * fade * (3 - 2 * fade)
    for (let j = 0; j < h; j++) {
      const o = (j * w + i) * 4
      img.data[o] = img.data[o + 1] = img.data[o + 2] = 255
      img.data[o + 3] = Math.round(255 * clamp(a * across[j], 0, 1))
    }
  }
  g.putImageData(img, 0, 0)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

// The mote: a small bright core in a wide, very soft halo.
function moteTexture(THREE) {
  const s = 128
  const c = document.createElement('canvas')
  c.width = c.height = s
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.1, 'rgba(255,255,255,0.9)')
  grad.addColorStop(0.2, 'rgba(255,255,255,0.36)')
  grad.addColorStop(0.42, 'rgba(255,255,255,0.1)')
  grad.addColorStop(0.72, 'rgba(255,255,255,0.025)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, s, s)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}
