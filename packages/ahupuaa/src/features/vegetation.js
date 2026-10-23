// Trees and plants.
//
// Two kinds of planting. The cultivated landscape is placed once: niu
// (coconut), hala, milo and kou along the shore, ʻulu, kukui, maiʻa and kī
// around every kauhale and up the valleys, hau at the stream mouths and
// fishponds, loulu on a few wet cliffs. The wild forest is too big for that,
// so it is grown around the camera from a deterministic hash — the same tree
// always stands in the same spot — and handed back to the terrain's canopy
// texture beyond a kilometre or so, where individual crowns stop being
// readable.
//
// Which tree grows where follows the island c. 1700 (Cuddihy & Stone; Little &
// Skolmen): the windward lowland below ~460 m is farmed and fallow, with kukui
// in the gulches, ʻōhiʻa ʻai groves and hau thickets on the valley floors and
// hala on the slopes; the leeward lowland is pili grass with wiliwili, lama
// and ʻaʻaliʻi on rocky ground; ʻōhiʻa lehua (with koa where the ground
// drains) is the forest above, over hāpuʻu tree ferns; the summit, the
// wettest place on the island, carries low mossy ʻōhiʻa and ʻōlapa.
//
// The forest is the heaviest thing on screen, so it is kept in small tiles
// whose instance data is built once, and each frame only the tiles inside the
// view are copied into the draw buffers. Past a few hundred metres a tree is a
// few pixels tall and is drawn as a simple crown on a stick that keeps its
// species' outline and colour; the full model dithers into it over a short
// band, so the switch never pops.

import * as THREE from 'three'
import { HYDRO_RES, WORLD, HALF, TRADE_BEARING, Y_PER_M, windVector } from '../config.js'
import { mulberry32, hash2, smoothstep as sm } from '../gen/noise.js'
import { distanceTransform } from '../gen/grid.js'
import { insidePoly } from '../gen/loi.js'
import { layStreams } from '../gen/channels.js'
import { drawnMetres } from '../gen/footing.js'
import { Builder, MAT, S, col, objectMaterial } from './kit.js'

// --- geometry (metres, trunk base at the origin) -----------------------------

const TAU = Math.PI * 2
const dir = (a, el) => [Math.cos(a) * Math.cos(el), Math.sin(el), Math.sin(a) * Math.cos(el)]
const along = (p, d, s) => [p[0] + d[0] * s, p[1] + d[1] * s, p[2] + d[2] * s]
const scaled = (c, k) => [c[0] * k, c[1] * k, c[2] * k]

// kukui's silvery grey-green: a shaded mid tone deep in and under the crown
// (the sampled #5C552A, lifted), the grey-green of the leaves, and the floury
// young leaves on top — the spec's #84835E and #A3A07E taken a step down and
// a little greener, as in full (morning) sun they render cream or beige, like
// stone, while any bluer turns grey under the sky and reads as frost (shared
// by the near model and the far crown)
const KUKUI_MID = '#5A643F'
const KUKUI_LEAF = '#6E7752'
const KUKUI_PALE = '#889066'

/**
 * A flower, fruit or seed capsule: a tiny closed tetrahedron. Blossom is a
 * speckle of these on some trees at a time, never a few big balls.
 */
function speck(B, x, y, z, s, c, mat) {
  const a = [x, y + s, z]
  const b = [x - s, y - s * 0.5, z - s * 0.6]
  const d = [x + s, y - s * 0.5, z - s * 0.6]
  const e = [x, y - s * 0.5, z + s]
  B.tri(a, d, b, c, mat)
  B.tri(a, e, d, c, mat)
  B.tri(a, b, e, c, mat)
  B.tri(b, d, e, c, mat)
}

/** Specks scattered over the upper outside of some crown clumps. */
function speckle(B, rand, clumps, n, size, colour, mat, low = 0.25) {
  for (let k = 0; k < n; k++) {
    const c = clumps[Math.floor(rand() * clumps.length)]
    const a = rand() * TAU
    const up = low + rand() * (0.95 - low)
    const ring = Math.sqrt(1 - up * up)
    speck(B, c[0] + Math.cos(a) * ring * c[3], c[1] + up * c[4], c[2] + Math.sin(a) * ring * c[3], size * (0.8 + 0.4 * rand()), colour(rand()), mat)
  }
}

/** A card seen from both sides on a single-sided material (two windings). */
function card(B, a, b, c, d, colour, mat) {
  B.quad(a, b, c, d, colour, mat)
  B.quad(a, d, c, b, colour, mat)
}

// an icosahedron stood on a vertex: a top, two staggered rings of five, a bottom
const DOME_V = [[0, 1, 0]]
for (let k = 0; k < 10; k++) {
  const a = (k * Math.PI) / 5
  const up = k % 2 ? -1 : 1
  DOME_V.push([Math.cos(a) * 0.8944, up * 0.4472, Math.sin(a) * 0.8944])
}
DOME_V.push([0, -1, 0])
const DOME_F = []
for (let k = 0; k < 5; k++) {
  const u0 = 1 + 2 * k
  const l0 = u0 + 1
  const u1 = 1 + ((2 * k + 2) % 10)
  const l1 = 1 + ((2 * k + 3) % 10)
  DOME_F.push([0, u0, u1], [u0, l0, u1], [u1, l0, l1], [11, l0, l1])
}

/**
 * A crown that stays round from every side, overhead included: twenty faces
 * like the kit's blob, but stood on a vertex, so from above its outline is a
 * ten-sided ring (the blob, lying on an edge, shows a hexagon, and a canopy of
 * them reads as tiles). Shaded with an ellipsoid's normals. `jit` roughens
 * the outline (a clump of foliage rather than a cushion, shaded as it lies),
 * and `under` darkens the lower half toward its own shade.
 */
function dome(B, x, y, z, rx, ry, rz, colour, mat, seed = 0, jit = 0.1, under = 1, foot = null) {
  const P = DOME_V.map((v, i) => {
    const j = i === 0 || i === 11 ? 1 : 1 - jit + 2 * jit * Math.abs((Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453) % 1)
    return [x + v[0] * rx * j, y + v[1] * ry * (i === 0 ? 0.95 + 0.1 * Math.abs(Math.sin(seed * 3.7)) : 1), z + v[2] * rz * j]
  })
  // (a low crown's underside can come down to a foot instead of a trunk: on
  // a steep wall it then still meets the ground)
  if (foot !== null) P[11] = [x, foot, z]
  const N = DOME_V.map((v, i) => {
    const n = jit > 0.1 ? [(P[i][0] - x) / (rx * rx), (P[i][1] - y) / (ry * ry), (P[i][2] - z) / (rz * rz)] : [v[0] / rx, v[1] / ry, v[2] / rz]
    const l = Math.hypot(...n)
    return [n[0] / l, n[1] / l, n[2] / l]
  })
  const C = DOME_V.map((v) => {
    const k = under + (1 - under) * sm(-0.8, 0.3, v[1])
    return [colour[0] * k, colour[1] * k, colour[2] * k]
  })
  for (const f of DOME_F) {
    // (wound outward, whichever way the face list happens to run)
    const [a, b, c] = f.map((i) => P[i])
    const nx = (b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1])
    const ny = (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2])
    const nz = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
    const out = nx * (a[0] + b[0] + c[0] - 3 * x) + ny * (a[1] + b[1] + c[1] - 3 * y) + nz * (a[2] + b[2] + c[2] - 3 * z) > 0
    for (const i of out ? f : [f[0], f[2], f[1]]) {
      B.pos.push(P[i][0], P[i][1], P[i][2])
      B.nor.push(N[i][0], N[i][1], N[i][2])
      B.col.push(C[i][0], C[i][1], C[i][2])
      B.mat.push(mat)
    }
  }
}

/**
 * A simple crown on a stick: the far-off version of a tree. `limbs` are
 * [from, to, r0, r1] sticks that carry crowns standing off the trunk, so
 * none hangs in the air; a crown is [x, y, z, rx, ry, colour, mat, seed, under, foot].
 */
function farTree(rand, { stick, r0 = 0.4, r1 = 0.25, bark = '#6a6058', limbs = [], crowns }) {
  const B = new Builder()
  const barkC = col(bark, 0.1, rand)
  if (stick) B.cyl([0, 0, 0], stick, r0, r1, barkC, MAT.wood, 3)
  for (const [a, b, l0, l1] of limbs) B.cyl(a, b, l0, l1, barkC, MAT.wood, 3)
  for (const [x, y, z, rx, ry, colour, mat = MAT.leaf, seed = 1, under = 1, foot = null] of crowns) {
    dome(B, x, y, z, rx, ry, rx, typeof colour === 'string' ? col(colour, 0.1, rand) : colour, mat, seed, 0.1, under, foot)
  }
  return B.geometry()
}

/** Where the far koa's sprays go: between each limb's pair of tips on the near model. */
function koaSprays(g) {
  const T = g.userData.tips
  const out = []
  for (let k = 0; k + 1 < T.length; k += 2) out.push([(T[k][0] + T[k + 1][0]) / 2, (T[k][1] + T[k + 1][1]) / 2, (T[k][2] + T[k + 1][2]) / 2])
  return out
}

/**
 * The same geometry with each distinct vertex stored once and the triangles
 * indexed into it. The kit writes every triangle's three corners out on their
 * own, but a round crown's corners are shared by five or six faces with the
 * very same normal and colour, so drawn this way the picture is bit for bit
 * the same with well under half the vertex work (a forest is mostly crowns).
 */
function indexed(g) {
  const P = g.attributes.position.array
  const N = g.attributes.normal.array
  const C = g.attributes.color.array
  const M = g.attributes.aMat.array
  const seen = new Map()
  const index = []
  const pos = []
  const nor = []
  const colr = []
  const mat = []
  const v = new Float32Array(10)
  const bits = new Uint16Array(v.buffer) // (the key: the exact bits, so only true twins merge)
  for (let i = 0; i < M.length; i++) {
    for (let c = 0; c < 3; c++) {
      v[c] = P[i * 3 + c]
      v[3 + c] = N[i * 3 + c]
      v[6 + c] = C[i * 3 + c]
    }
    v[9] = M[i]
    const key = String.fromCharCode.apply(null, bits)
    let j = seen.get(key)
    if (j === undefined) {
      j = seen.size
      seen.set(key, j)
      pos.push(v[0], v[1], v[2])
      nor.push(v[3], v[4], v[5])
      colr.push(v[6], v[7], v[8])
      mat.push(v[9])
    }
    index.push(j)
  }
  const out = new THREE.BufferGeometry()
  out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  out.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3))
  out.setAttribute('color', new THREE.Float32BufferAttribute(colr, 3))
  out.setAttribute('aMat', new THREE.Float32BufferAttribute(mat, 1))
  out.setIndex(index)
  out.computeBoundingSphere()
  out.userData = g.userData
  return out
}

// ʻŌhiʻa lehua: a crooked grey trunk on stilt roots, forking into a few limbs
// that carry separate, flattened leaf clumps — an olive-grey, see-through
// crown, broader than deep, with a sparse red speckle of lehua.
function ohia(rand) {
  const B = new Builder()
  const bark = col('#86817A', 0.12, rand) // (the sampled #857F81 renders lilac in the warm sun: a touch warmer)
  // stilt roots: it often germinates on logs or hāpuʻu trunks
  for (let k = 0; k < 4; k++) {
    const a = k * 1.57 + rand() * 0.6
    B.cyl([Math.cos(a) * 1.1, 0, Math.sin(a) * 1.1], [Math.cos(a) * 0.25, 1.5, Math.sin(a) * 0.25], 0.12, 0.17, bark, MAT.wood, 4)
  }
  // crooked bole, forking at mid-height
  const p1 = [0.4, 2.6, 0.1]
  const p2 = [-0.3, 4.8, 0.3]
  const fork = [0.1, 6.2, 0]
  B.cyl([0, 1.2, 0], p1, 0.45, 0.4, bark, MAT.wood, 5)
  B.cyl(p1, p2, 0.4, 0.33, bark, MAT.wood, 5)
  B.cyl(p2, fork, 0.33, 0.28, bark, MAT.wood, 5)
  // 3 limbs at 30–50° above horizontal, each forking once: 6 tips
  const tips = []
  for (let l = 0; l < 3; l++) {
    const a = (l / 3) * TAU + (rand() - 0.5) * 0.9
    const el = 0.55 + rand() * 0.3
    const len = 3.4 + rand()
    const mid = along(fork, dir(a, el), len * 0.6)
    B.cyl(fork, mid, 0.22, 0.16, bark, MAT.wood, 4)
    for (const side of [-1, 1]) {
      const tip = along(mid, dir(a + side * 0.55, el + (rand() - 0.5) * 0.3), 1.7 + rand() * 0.6)
      B.cyl(mid, tip, 0.14, 0.08, bark, MAT.wood, 3)
      tips.push(tip)
    }
  }
  // 6 flattened clumps, one per tip, kept apart so limbs and sky show between
  // (but wide enough that neighbouring crowns in the wet forest touch)
  const clumps = tips.map((t) => [t[0], t[1] + 0.3 + (rand() - 0.5) * 0.8, t[2], 1.8 + rand() * 0.6, 1.0 + rand() * 0.3])
  clumps.forEach((c, k) => B.blob(c[0], c[1], c[2], c[3], c[4], c[3] * 0.9, col('#5C603F', 0.18, rand), MAT.leaf, k + rand()))
  // liko (accent 1): a reddish flush of new leaves capping two clumps
  for (const k of [1, 4]) {
    const c = clumps[k]
    B.blob(c[0], c[1] + c[4] * 0.55, c[2], c[3] * 0.6, c[4] * 0.35, c[3] * 0.55, col(rand() < 0.6 ? '#9E3A2C' : '#B8683A', 0.15, rand), MAT.accent1, k, true, 0)
  }
  // lehua (accent 0): clusters only 5–8 cm across, at the branch tips
  speckle(B, rand, clumps, 24, 0.17, (h) => col(h < 0.7 ? '#C8323A' : h < 0.95 ? '#E0552E' : '#F0386A', 0.15, rand), MAT.accent0)
  return B.geometry()
}

// Stunted ʻōhiʻa of the summit cloud forest, ridges and bogs (and ʻōlapa, by
// tint): short, leaning, several mossy stems under a flat wind-shorn crown.
function ohiaKrumm(rand) {
  const B = new Builder()
  const lean = (p) => [p[0] + 0.176 * p[1], p[1], p[2]] // ~10° toward +x (turned downwind per instance)
  const bark = col('#6E6862', 0.12, rand)
  const stems = [
    [[0, 0, 0], [0.6, 1.6, 0.2], [1.1, 2.8, 0]],
    [[0, 0, 0], [-0.5, 1.4, 0.4], [-1.2, 2.4, 0.6]],
  ]
  for (const s of stems) {
    B.cyl(lean(s[0]), lean(s[1]), 0.25, 0.18, bark, MAT.wood, 4)
    B.cyl(lean(s[1]), lean(s[2]), 0.18, 0.12, bark, MAT.wood, 4)
  }
  // moss hugging the stems
  const moss = col('#5C6B3A', 0.15, rand)
  for (const [x, y, z, r] of [[0.33, 0.9, 0.11, 0.32], [0.85, 2.1, 0.12, 0.27], [-0.45, 1.3, 0.37, 0.3]]) {
    B.blob(...lean([x, y, z]), r, r * 0.9, r, moss, MAT.plain, x * 7, true, 0)
  }
  // flat crown, offset along the lean (wider than the sheet's: the trees
  // stand one to a 17 m cell, and at the sheet's width the low cloud forest
  // would stand apart over a lit floor rather than close over it)
  const clumps = [[2.1, 0.1], [-1.9, 0.8], [0.1, -2.1], [0.3, 2.2], [0.1, 0.2]].map(([x, z], k) => {
    const rx = k === 4 ? 2.4 : 2.75 + rand() * 0.5
    const ry = k === 4 ? 1.1 : 0.95 + rand() * 0.25
    const top = k === 4 ? 4.5 : 3.6 + rand() * 0.8
    const c = lean([x, top - ry, z])
    return [c[0], c[1], c[2], rx, ry]
  })
  clumps.forEach((c, k) => {
    if (k === 4) dome(B, c[0], c[1], c[2], c[3], c[4], c[3], col('#596537', 0.18, rand), MAT.leaf, 7 + rand(), 0.15)
    else B.blob(c[0], c[1], c[2], c[3], c[4], c[3] * 0.92, col('#596537', 0.18, rand), MAT.leaf, k * 3 + rand(), true, k === 3 ? 0 : 1)
  })
  const c0 = clumps[0]
  B.blob(c0[0], c0[1] + c0[4] * 0.55, c0[2], c0[3] * 0.6, c0[4] * 0.35, c0[3] * 0.55, col('#9E3A2C', 0.15, rand), MAT.accent1, 5, true, 0)
  speckle(B, rand, clumps, 10, 0.16, (h) => col(h < 0.75 ? '#C8323A' : '#E0552E', 0.15, rand), MAT.accent0, 0.4)
  return B.geometry()
}

/** One arched frond (a ribbon in a shallow V, like the palm's) from `p`. */
function frond(B, p, a, len, prof, width, colour, mat) {
  const dx = Math.cos(a)
  const dz = Math.sin(a)
  let p0 = p
  let w0 = width(0)
  const n = prof.length - 1
  for (let s = 1; s <= n; s++) {
    const t = s / n
    const [h, y] = prof[s]
    const p1 = [p[0] + dx * h * len, p[1] + y, p[2] + dz * h * len]
    const w1 = width(t)
    const c = colour(t)
    B.quad(p0, p1, [p1[0] - dz * w1, p1[1] - 0.3 * w1, p1[2] + dx * w1], [p0[0] - dz * w0, p0[1] - 0.3 * w0, p0[2] + dx * w0], c, mat)
    B.quad([p0[0] + dz * w0, p0[1] - 0.3 * w0, p0[2] - dx * w0], [p1[0] + dz * w1, p1[1] - 0.3 * w1, p1[2] - dx * w1], p1, p0, c, mat)
    p0 = p1
    w0 = w1
  }
}

// Hāpuʻu: a dark fibrous trunk under a shuttlecock of bright arching fronds,
// with a skirt of dead ones. The understorey of the ʻōhiʻa forest.
function hapuu(rand) {
  const B = new Builder()
  const trunk = col('#2A241E', 0.1, rand)
  const top = [0.1, 2.6, 0.05]
  B.cyl([0, 0, 0], top, 0.32, 0.22, trunk, MAT.wood, 5)
  B.blob(0, 0.12, 0, 0.5, 0.35, 0.5, trunk, MAT.wood, 1)
  // pulu, the golden wool round the crown
  B.blob(top[0], top[1] + 0.05, top[2], 0.3, 0.3, 0.3, col('#B07A3A', 0.1, rand), MAT.plain, 2, true, 0)
  // live fronds: rise 0.6 m over their first third, arch down to 0.4 m below
  const prof = [0, 0.25, 0.5, 0.75, 1].map((t) => [t * 0.92, t <= 1 / 3 ? 0.6 * Math.sin(1.5 * Math.PI * t) : 0.6 - Math.pow((t - 1 / 3) / (2 / 3), 2)])
  const width = (t) => (t < 0.4 ? 0.15 + t : 0.55 - (t - 0.4) * 0.75)
  // (the sunlit samples, #8DA965 and #729452, taken down to albedos: the
  // tropical sun lifts a frond facing it by about that much)
  const inner = col('#5E7A42', 0.1, rand)
  const tip = col('#74904F', 0.1, rand)
  const glauc = col('#7C8E6C', 0.1, rand) // C. glaucum's bluish cast
  for (let f = 0; f < 10; f++) {
    const a = (f / 10) * TAU + (rand() - 0.5) * 0.4
    const g = f % 3 === 1 && f < 9
    frond(B, top, a, 2.6 * (0.9 + 0.2 * rand()), prof, width, (t) => (t < 0.5 ? inner : g ? glauc : tip), MAT.leaf)
  }
  // the dead skirt, hanging at -70°
  const dead = col('#6B5034', 0.12, rand)
  for (let f = 0; f < 3; f++) {
    const a = (f / 3) * TAU + rand()
    frond(B, [top[0], top[1] - 0.15, top[2]], a, 1.6, [[0, 0], [0.18, -0.75], [0.34, -1.5]], (t) => 0.18 - t * 0.08, () => dead, MAT.leaf)
  }
  return B.geometry()
}

// Koa: a short crooked bole forking low into big sinuous limbs under a broad,
// wispy grey-green umbrella that stands above the ʻōhiʻa.
function koa(rand) {
  const B = new Builder()
  const bark = col('#5A504B', 0.15, rand)
  const b1 = [0.5, 2.2, 0.2]
  const b2 = [0.2, 4.0, -0.3]
  B.cyl([0, 0, 0], scaled(b1, 1.18), 0.7, 0.6, bark, MAT.wood, 5) // (on past the kink, as the limbs below)
  B.cyl(b1, b2, 0.6, 0.5, bark, MAT.wood, 5)
  const tips = []
  for (let l = 0; l < 4; l++) {
    const a = (l / 4) * TAU + (rand() - 0.5) * 0.7
    const el = 0.85 + rand() * 0.2
    const len = 6.4 + rand() * 1.2
    const start = [b2[0], 3.6 + rand() * 0.6, b2[2]]
    const d1 = dir(a, el)
    const mid = along(start, d1, len * 0.5)
    const kink = a + (rand() - 0.5) * 0.7
    const d2 = dir(kink, el * 0.85)
    const end = along(mid, d2, len * 0.5)
    // (each piece runs on a little past its joint, so no open end shows at a kink)
    B.cyl(start, along(mid, d1, 0.3), 0.4, 0.3, bark, MAT.wood, 3)
    B.cyl(mid, along(end, d2, 0.18), 0.3, 0.18, bark, MAT.wood, 3)
    for (const side of [-1, 1]) {
      const tip = along(end, dir(kink + side * 0.5, 1.0 + rand() * 0.3), 2.4 + rand() * 0.6)
      B.cyl(end, tip, 0.16, 0.08, bark, MAT.wood, 3)
      tips.push(tip)
    }
  }
  // At each tip a loose spray of three small puffs rather than one solid
  // cushion: the crown reads coarse and wispy, with sky and limbs showing
  // through (but round enough to billow, not a stack of pancakes). A
  // quarter carry the grey sheen of the sickle phyllodes.
  const clumps = []
  tips.forEach((t, k) => {
    const grey = k % 4 === 1
    for (let q = 0; q < 3; q++) {
      const a = rand() * TAU
      const r = q === 0 ? 0.3 : 0.9 + rand() * 0.5
      const rx = (q === 0 ? 1.7 : 1.3) + rand() * 0.4
      const c = [t[0] + Math.cos(a) * r, t[1] + 0.35 + (rand() - 0.5) * 0.6 - (q ? 0.25 : 0), t[2] + Math.sin(a) * r, rx, rx * (0.55 + rand() * 0.08)]
      clumps.push(c)
      dome(B, c[0], c[1], c[2], c[3], c[4], c[3] * (0.8 + 0.25 * rand()), col(grey || rand() < 0.1 ? '#737B5A' : '#5E6A3C', 0.15, rand), MAT.leaf, k * 3 + q + rand())
    }
  })
  // winter flowers (accent 6): pale yellow puffs
  speckle(B, rand, clumps, 12, 0.18, () => col('#E8DC7A', 0.1, rand), MAT.accent6, 0.3)
  const g = B.geometry()
  g.userData.tips = tips // (the far version puts a spray over each limb's pair)
  return g
}

/**
 * Make the mass added since `from` (centred at x, y, z) read as foliage
 * rather than a stone: lumpy (each vertex pushed in or out by a hash of where
 * it is, so the faces that share it stay joined), mottled with light and dark
 * sprays of leaves, and darkened toward its underside, the crown's own shade.
 */
function foliage(B, from, x, y, z, ry, under) {
  for (let i = from; i < B.pos.length / 3; i++) {
    const px = B.pos[i * 3]
    const py = B.pos[i * 3 + 1]
    const pz = B.pos[i * 3 + 2]
    const h = fract(Math.sin(px * 12.99 + py * 78.23 + pz * 37.71) * 43758.5)
    const lump = 0.86 + 0.28 * fract(h * 7.13)
    B.pos[i * 3] = x + (px - x) * lump
    B.pos[i * 3 + 1] = y + (py - y) * lump
    B.pos[i * 3 + 2] = z + (pz - z) * lump
    const k = (under + (1 - under) * sm(-0.8, 0.3, (py - y) / ry)) * (0.78 + 0.38 * h)
    B.col[i * 3] *= k
    B.col[i * 3 + 1] *= k
    B.col[i * 3 + 2] *= k
  }
}

// Kukui: a billowing, irregular dome on long drooping limbs, the palest tree
// in the landscape — silvery grey-green, floury at the top.
function kukui(rand) {
  const B = new Builder()
  const bark = col('#8E8A80', 0.1, rand) // smooth, pale with lichen
  const top = [0.3, 4.0, 0.1]
  B.cyl([0, 0, 0], top, 0.45, 0.34, bark, MAT.wood, 5)
  // The crown is soft flattened masses over the limbs' drooping ends, the
  // floury young leaves heaped on top, with gaps between where the limbs and
  // the sky show (one big smooth mass, or a few hung low, read as a heap of
  // boulders). Each is shaded on its underside, deeper inside the crown. They
  // sit high enough that the pale trunk and the limbs show beneath, all but
  // one low limb's: a tree at the edge of a grove keeps foliage near the ground.
  const clumps = []
  const lobe = (x, y, z, rx, ry, colour, k, under, smooth = true) => {
    clumps.push([x, y, z, rx, ry])
    const from = B.pos.length / 3
    if (smooth) B.blob(x, y, z, rx, ry, rx * (0.85 + 0.2 * rand()), col(colour, 0.07, rand), MAT.leaf, k + rand(), true, 1)
    else dome(B, x, y, z, rx, ry, rx * (0.85 + 0.2 * rand()), col(colour, 0.07, rand), MAT.leaf, k + rand(), 0.15)
    foliage(B, from, x, y, z, ry, under)
  }
  // (the top first: seen from above, as it mostly is, the crown then draws
  // front to back and its hidden faces cost less)
  lobe(0.4, 8.3 + rand() * 0.3, 0.2, 2.25 + rand() * 0.3, 1.35, KUKUI_PALE, 9, 0.75)
  const a0 = rand() * TAU
  lobe(0.3 + Math.cos(a0) * 1.9, 7.6 + rand() * 0.4, 0.1 + Math.sin(a0) * 1.9, 1.7, 1.0, KUKUI_PALE, 10, 0.7)
  const mids = []
  for (let l = 0; l < 4; l++) {
    const a = (l / 4) * TAU + (rand() - 0.5) * 0.7
    const el = l === 0 ? 0.12 : 0.36 + rand() * 0.2
    const len = 4.2 + rand() * 1.0
    const start = [top[0] * (0.8 + 0.2 * rand()), 3.6 + rand() * 0.6, top[2]]
    const mid = along(start, dir(a, el), len * 0.55)
    const end = along(mid, dir(a + (rand() - 0.5) * 0.4, el - 0.2), len * 0.45) // the outer half droops
    B.cyl(start, mid, 0.24, 0.16, bark, MAT.wood, 3)
    B.cyl(mid, end, 0.16, 0.08, bark, MAT.wood, 3)
    const rx = 1.75 + rand() * 0.3
    lobe(end[0], end[1] + 0.4, end[2], rx, rx * (0.56 + 0.08 * rand()), l % 2 ? KUKUI_LEAF : KUKUI_MID, l, 0.62)
    mids.push(mid)
  }
  // and one deep inside, between two limbs, in its own shade
  const q = [(mids[1][0] + mids[2][0]) * 0.4, Math.max(mids[1][1], mids[2][1]) + 1.2, (mids[1][2] + mids[2][2]) * 0.4]
  lobe(q[0], q[1], q[2], 1.8, 1.0, KUKUI_MID, 13, 0.7, false)
  // spring flowers (accent 6): cream
  speckle(B, rand, clumps, 6, 0.17, () => col('#E8E4CC', 0.08, rand), MAT.accent6, 0.35)
  return B.geometry()
}

// ʻŌhiʻa ʻai, the mountain apple: a dense, dark, narrow cone in pure groves,
// with magenta puffs on the bare trunk in spring.
function ohiaai(rand) {
  const B = new Builder()
  B.cyl([0, 0, 0], [0, 2.4, 0], 0.35, 0.3, col('#8A7458', 0.1, rand), MAT.wood, 6)
  // (the spec's four stacked blobs read as a tiered fir: one tall mass, a
  // broad skirt merged into its foot and a narrow top merged into its head,
  // make the single dense column it is)
  const clumps = [
    [0, 6.0, 0, 2.45, 3.5],
    [0, 4.1, 0, 2.75, 1.9],
    [0, 8.7, 0, 1.45, 1.7],
  ].map((c) => [c[0] + (rand() - 0.5) * 0.3, c[1], c[2] + (rand() - 0.5) * 0.3, c[3], c[4]])
  const leafC = col('#3E5428', 0.08, rand)
  clumps.forEach((c, k) => B.blob(c[0], c[1], c[2], c[3], c[4], c[3] * 0.95, scaled(leafC, 0.94 + 0.08 * k), MAT.leaf, k + rand(), true, 1))
  // flowers straight out of the trunk and inner limbs (accent 4)
  for (let k = 0; k < 12; k++) {
    const a = rand() * TAU
    const y = 1.2 + rand() * (k < 8 ? 1.0 : 2.5)
    const r = k < 8 ? 0.36 : 0.6 + rand() * 0.8
    speck(B, Math.cos(a) * r, y, Math.sin(a) * r, 0.16, col('#C8204E', 0.12, rand), MAT.accent4)
  }
  // (no fallen carpet beneath: a disc in the tree's own frame can't follow a
  // slope, and on one it floats or half buries as a magenta sliver)
  // fruit (accent 5), just showing at the crown surface: a mountain apple
  // is a few centimetres, so a speck far smaller than a lehua cluster (at the
  // lehua's size they read as big red triangles from close by)
  speckle(B, rand, clumps.slice(0, 3), 12, 0.07, () => col('#B5122E', 0.1, rand), MAT.accent5, -0.4)
  return B.geometry()
}

// Hau: a low, flat-topped, sprawling tangle much wider than tall, whose limbs
// arch down and root again — the thickets along the streams.
function hau(rand) {
  const B = new Builder()
  const bark = col('#7E7466', 0.12, rand)
  for (let l = 0; l < 4; l++) {
    const a = (l / 4) * TAU + (rand() - 0.5) * 0.8
    const reach = 3.5 + rand() * 1.5
    const h = 2.5 + rand() * 2
    const p1 = [Math.cos(a + 0.3) * reach * 0.45, h * 0.6, Math.sin(a + 0.3) * reach * 0.45]
    const p2 = [Math.cos(a) * reach, h, Math.sin(a) * reach]
    B.cyl([0, 0, 0], p1, 0.22, 0.16, bark, MAT.wood, 3)
    B.cyl(p1, p2, 0.16, 0.1, bark, MAT.wood, 3)
    if (l % 2 === 0) {
      // arching back down to take root
      const out = 5 + rand()
      B.cyl(p2, [Math.cos(a - 0.2) * out, -0.1, Math.sin(a - 0.2) * out], 0.1, 0.08, bark, MAT.wood, 3)
    }
  }
  const clumps = []
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * TAU + rand() * 0.6
    const r = k === 0 ? 0.3 : 2.2 + rand() * 1.3
    const rx = 2.2 + rand() * 0.6
    const ry = 0.9 + rand() * 0.3
    clumps.push([Math.cos(a) * r, 3.5 + rand() * 1.5 - ry, Math.sin(a) * r, rx, ry])
  }
  clumps.forEach((c, k) => B.blob(c[0], c[1], c[2], c[3], c[4], c[3] * 0.92, col('#6E8A3E', 0.15, rand), MAT.leaf, k + rand(), true, k < 4 ? 1 : 0))
  // yellow flowers that fade to orange the same day (accent 6)
  speckle(B, rand, clumps, 12, 0.18, (h) => col(h < 0.75 ? '#F2D53C' : '#D9622E', 0.1, rand), MAT.accent6, 0.4)
  return B.geometry()
}

// Hala: a candelabra of forked, leaning stems on a cone of prop roots, each
// branch ending in a spiral tuft of long drooping strap leaves.
function hala(rand) {
  const B = new Builder()
  const root = col('#857C6C', 0.1, rand)
  const nr = 5 + Math.floor(rand() * 2)
  for (let k = 0; k < nr; k++) {
    const a = (k / nr) * TAU + rand() * 0.4
    B.cyl([Math.cos(a) * 1.2, 0, Math.sin(a) * 1.2], [0.06, 1.3, 0], 0.08, 0.11, root, MAT.wood, 3)
  }
  // the light grey trunk, ringed with leaf scars (#A9A69C and #8F8B80 render
  // near white in full sun, so a step darker)
  const ringA = col('#8E8B82', 0.08, rand)
  const ringB = col('#77746B', 0.08, rand)
  for (let k = 0; k < 4; k++) {
    const t0 = k / 4
    const t1 = (k + 1) / 4
    B.cyl([0.3 * t0, 1.0 + 2.4 * t0, 0], [0.3 * t1, 1.0 + 2.4 * t1, 0], 0.22 - 0.04 * t0, 0.22 - 0.04 * t1, k % 2 ? ringB : ringA, MAT.wood, 5)
  }
  const T = [0.3, 3.4, 0]
  const a0 = rand() * TAU
  const tips = []
  for (const s of [-1, 1]) {
    const sp = 0.55 + rand() * 0.15 // half of 60–80°
    const d = [Math.sin(sp) * Math.cos(a0) * s, Math.cos(sp), Math.sin(sp) * Math.sin(a0) * s]
    const P = along(T, d, 1.9)
    B.cyl(T, P, 0.13, 0.11, ringA, MAT.wood, 4)
    const az = Math.atan2(d[2], d[0])
    for (const t of [-1, 1]) {
      const tip = along(P, dir(az + t * 0.6, 0.75 + rand() * 0.4), 1.4 + rand() * 0.6)
      B.cyl(P, tip, 0.1, 0.08, ringB, MAT.wood, 4)
      tips.push(tip)
    }
  }
  const leaf = col('#5E7E43', 0.12, rand)
  const leafTip = col('#6D914E', 0.12, rand)
  const dead = col('#8A6E48', 0.12, rand)
  tips.forEach((p, ti) => {
    // a spiral tuft of straps, each folded into a V: up 0.5 m over its first
    // 0.9 m, then drooping to 0.6 m below its base at the tip — the young
    // inner leaves stiffer, the old outer ones hanging lower. They are drawn
    // about three times their real width, or the tuft is a few slivers from
    // any distance and the tree reads as a bare grey candelabra
    // (ten a tuft, the sheet's lower end: drawn both sides, they are the
    // costliest leaves in the lowland)
    for (let l = 0; l < 10; l++) {
      const a = l * 2.4 + rand() * 0.3
      const age = l / 9
      const L = 1.8 + rand() * 0.4
      const dx = Math.cos(a)
      const dz = Math.sin(a)
      const w = 0.19
      const M = [p[0] + dx * 0.9, p[1] + 0.75 - 0.5 * age, p[2] + dz * 0.9]
      const E = [p[0] + dx * L * (0.75 + 0.15 * age), p[1] - 0.1 - 1.0 * age, p[2] + dz * L * (0.75 + 0.15 * age)]
      const ML = [M[0] - dz * w, M[1] + 0.04, M[2] + dx * w]
      const MR = [M[0] + dz * w, M[1] + 0.04, M[2] - dx * w]
      B.tri(p, M, ML, leaf, MAT.leaf)
      B.tri(p, MR, M, leaf, MAT.leaf)
      B.tri(ML, M, E, leafTip, MAT.leaf)
      B.tri(M, MR, E, leafTip, MAT.leaf)
    }
    // dead leaves hanging straight down below the tuft
    for (let l = 0; l < 3; l++) {
      const a = (l / 3) * TAU + rand()
      const dx = Math.cos(a)
      const dz = Math.sin(a)
      const top = [p[0] + dx * 0.15, p[1] - 0.1, p[2] + dz * 0.15]
      const bot = [p[0] + dx * 0.4, p[1] - 1.5, p[2] + dz * 0.4]
      B.quad(top, bot, [bot[0] - dz * 0.12, bot[1], bot[2] + dx * 0.12], [top[0] - dz * 0.12, top[1], top[2] + dx * 0.12], dead, MAT.leaf)
    }
    // the pineapple-like fruit under two of the tufts
    if (ti < 2) B.blob(p[0], p[1] - 0.45, p[2], 0.3, 0.38, 0.3, col(rand() < 0.7 ? '#E8A030' : '#D8582A', 0.1, rand), MAT.plain, ti, true, 0)
  })
  const g = B.geometry()
  g.userData.tips = tips // (where the far version puts its tufts, on limbs from the trunk's top)
  return g
}

// Wiliwili: a short, stout, orange-tinged trunk with stiff near-horizontal
// limbs under a broad thin crown — leafless and in orange flower through kau,
// in leaf in hoʻoilo.
function wiliwili(rand) {
  const B = new Builder()
  const bark = col('#9C6C44', 0.1, rand)
  const limbC = col('#8E6448', 0.1, rand)
  const twig = col('#7E6450', 0.12, rand)
  const t1 = [0.3, 1.6, 0.1]
  const t2 = [0, 2.6, 0.2]
  B.cyl([0, 0, 0], t1, 0.45, 0.4, bark, MAT.wood, 5)
  B.cyl(t1, t2, 0.4, 0.35, bark, MAT.wood, 5)
  const ends = []
  for (let l = 0; l < 5; l++) {
    const a = (l / 5) * TAU + (rand() - 0.5) * 0.6
    const start = [t2[0], 2.4 + rand() * 0.6, t2[2]]
    const end = along(start, dir(a, 0.17 + rand() * 0.27), 3.2 + rand() * 1.0)
    B.cyl(start, end, 0.2, 0.06, limbC, MAT.wood, 4)
    ends.push([end, a])
    // the bare twigs, always there: two crossed cards of fine branching
    for (const t of [0, 1]) {
      const b = a + (t ? 0.6 : -0.6)
      const dx = Math.cos(b) * 0.9
      const dz = Math.sin(b) * 0.9
      card(B, [end[0] - dx * 0.2, end[1] - 0.1, end[2] - dz * 0.2], [end[0] + dx, end[1] - 0.05, end[2] + dz], [end[0] + dx * 1.1, end[1] + 0.55, end[2] + dz * 1.1], [end[0], end[1] + 0.5, end[2]], twig, MAT.wood)
    }
  }
  // leaves (accent 3), in thin flat masses over the limb ends
  const clumps = []
  for (let k = 0; k < 4; k++) {
    const [e] = ends[k]
    const rx = 2.4 + rand() * 0.6
    clumps.push([e[0] * 0.85, 4.2 + rand(), e[2] * 0.85, rx, 0.7 + rand() * 0.2])
  }
  clumps.forEach((c, k) => B.blob(c[0], c[1], c[2], c[3], c[4], c[3] * 0.9, col('#788C4A', 0.15, rand), MAT.accent3, k + rand(), true, k < 2 ? 1 : 0))
  // flowers (accent 8: on bare trees only, as accent 2, in their own season) at the twig tips
  for (let k = 0; k < 24; k++) {
    const [e, a] = ends[k % 5]
    const b = a + (rand() - 0.5) * 1.6
    const r = 0.3 + rand() * 0.9
    const h = rand()
    speck(B, e[0] + Math.cos(b) * r, e[1] + 0.2 + rand() * 0.45, e[2] + Math.sin(b) * r, 0.17, col(h < 0.9 ? '#E07A2E' : h < 0.95 ? '#E8C83A' : '#F09070', 0.12, rand), MAT.accent8)
  }
  const g = B.geometry()
  g.userData.ends = ends.map(([e]) => e) // (where the far version's bare limbs reach)
  return g
}

// Lama: a small, compact, dense dark crown on a slender dark trunk — with
// dry-form ʻōhiʻa, the dark matrix of the dry and mesic forest that survives.
function lama(rand) {
  const B = new Builder()
  const bark = col('#3E3A36', 0.1, rand)
  const top = [0.2, 2.8, 0.1]
  B.cyl([0, 0, 0], top, 0.25, 0.18, bark, MAT.wood, 5)
  for (let l = 0; l < 3; l++) {
    const a = (l / 3) * TAU + rand()
    B.cyl([top[0], 2.6, top[2]], along(top, dir(a, 0.79), 1.6), 0.13, 0.07, bark, MAT.wood, 4)
  }
  for (let k = 0; k < 4; k++) {
    const a = (k / 4) * TAU + rand() * 0.8
    const r = k === 3 ? 0.1 : 0.9 + rand() * 0.3
    B.blob(0.2 + Math.cos(a) * r, k === 3 ? 6.3 : 4.5 + rand() * 1.2, 0.1 + Math.sin(a) * r, 1.6 + rand() * 0.4, 1.3 + rand() * 0.3, 1.6 + rand() * 0.4, col('#4C5E2E', 0.15, rand), MAT.leaf, k + rand())
  }
  return B.geometry()
}

// ʻAʻaliʻi: a rounded, much-branched yellow-green shrub; the female plants
// carry papery capsules that give it a red-bronze cast.
function aalii(rand) {
  const B = new Builder()
  const stem = col('#6A5A48', 0.1, rand)
  const clumps = []
  for (let k = 0; k < 3; k++) {
    const a = (k / 3) * TAU + rand()
    const r = 0.45 + rand() * 0.3
    const rx = 0.9 + rand() * 0.3
    const ry = 0.7 + rand() * 0.2
    const c = [Math.cos(a) * r, 1.6 + rand() * 0.8 - ry, Math.sin(a) * r, rx, ry]
    clumps.push(c)
    B.cyl([Math.cos(a) * 0.1, 0, Math.sin(a) * 0.1], [c[0] * 0.7, c[1] - 0.2, c[2] * 0.7], 0.07, 0.04, stem, MAT.wood, 3)
  }
  clumps.forEach((c, k) => B.blob(c[0], c[1], c[2], c[3], c[4], c[3], col('#6F8A4E', 0.2, rand), MAT.leaf, k + rand(), true, k < 2 ? 1 : 0))
  speckle(B, rand, clumps, 20, 0.11, (h) => col(h < 0.5 ? '#B8443A' : h < 0.8 ? '#8A2E3A' : '#D8C890', 0.12, rand), MAT.accent7, 0.35)
  return B.geometry()
}

// Loulu: a slender grey pole under a round pom-pom of stiff pleated fans,
// silvery beneath, with a skirt of dead fans.
function loulu(rand) {
  const B = new Builder()
  const ra = col('#8E8A80', 0.08, rand)
  const rb = col('#77736A', 0.08, rand)
  const H = 7
  for (let k = 0; k < 7; k++) B.cyl([0, (k / 7) * H, 0], [0, ((k + 1) / 7) * H, 0], 0.18 - k * 0.004, 0.18 - (k + 1) * 0.004, k % 2 ? rb : ra, MAT.wood, 5)
  const top = [0, H, 0]
  const fan = (a, el, rad, c, cLow) => {
    const d = dir(a, el)
    const l = [-Math.sin(a), 0, Math.cos(a)]
    const n = [d[1] * l[2] - d[2] * l[1], d[2] * l[0] - d[0] * l[2], d[0] * l[1] - d[1] * l[0]]
    const C = along(top, d, 0.5)
    const rim = []
    for (let k = 0; k <= 6; k++) {
      const t = (-70 + (140 * k) / 6) * (Math.PI / 180)
      const v = [d[0] * Math.cos(t) + l[0] * Math.sin(t), d[1] * Math.cos(t) + l[1] * Math.sin(t), d[2] * Math.cos(t) + l[2] * Math.sin(t)]
      rim.push(along(along(C, v, rad), n, k % 2 ? 0.06 : -0.06))
    }
    for (let k = 0; k < 6; k++) B.tri(C, rim[k], rim[k + 1], el < 0.17 ? cLow : c, MAT.leaf)
  }
  const up = col('#4F6440', 0.1, rand)
  const low = col('#A5B4A6', 0.1, rand)
  for (let k = 0; k < 16; k++) fan(k * 2.4 + rand() * 0.3, (-20 + (80 * (k % 8)) / 7) * (Math.PI / 180), 0.95, up, low)
  const dead = col('#7A6A4E', 0.1, rand)
  for (let k = 0; k < 5; k++) {
    const a = (k / 5) * TAU + rand() * 0.5
    const d = [Math.cos(a), 0, Math.sin(a)]
    const C = [d[0] * 0.25, H - 0.4, d[2] * 0.25]
    const l = [-d[2], 0, d[0]]
    const rim = []
    for (let j = 0; j <= 6; j++) {
      const t = (-60 + (120 * j) / 6) * (Math.PI / 180)
      rim.push([C[0] + d[0] * 0.2 + l[0] * Math.sin(t) * 0.7, C[1] - Math.cos(t) * 1.0, C[2] + d[2] * 0.2 + l[2] * Math.sin(t) * 0.7])
    }
    for (let j = 0; j < 6; j++) B.tri(C, rim[j], rim[j + 1], dead, MAT.leaf)
  }
  return B.geometry()
}

// Milo and kou: dense, dark, glossy domes on short trunks with long low limbs,
// the shade trees by the houses and the shore.
function shadeTree(rand, kou) {
  const B = new Builder()
  const bark = col('#8A8070', 0.1, rand)
  B.cyl([0, 0, 0], [0.2, 2.2, 0], 0.35, 0.28, bark, MAT.wood, 5)
  for (let l = 0; l < 3; l++) {
    const a = (l / 3) * TAU + rand()
    const s = [0.15, 1.8 + rand() * 0.4, 0]
    B.cyl(s, along(s, dir(a, 0.1), 3 + rand()), 0.16, 0.07, bark, MAT.wood, 3)
  }
  const leaf = kou ? '#4C6630' : '#4A6426'
  const clumps = [[0.2, 4.8, 0, 3.0, 2.2]]
  for (let k = 0; k < 4; k++) {
    const a = (k / 4) * TAU + rand() * 0.5
    clumps.push([0.2 + Math.cos(a) * 2.4, 3.6 + rand() * 0.8, Math.sin(a) * 2.4, 2.2, 1.6])
  }
  clumps.forEach((c, k) => B.blob(c[0], c[1], c[2], c[3], c[4], c[3], col(leaf, 0.12, rand), MAT.leaf, k + rand(), true, k === 4 ? 0 : 1))
  if (kou) {
    // orange flowers, and the leaves that turn bright yellow before they fall
    speckle(B, rand, clumps, 12, 0.2, () => col('#F07A1E', 0.1, rand), MAT.accent6)
    speckle(B, rand, clumps, 6, 0.22, () => col('#D8B83A', 0.1, rand), MAT.accent6)
  } else speckle(B, rand, clumps, 12, 0.2, () => col('#EDE08A', 0.1, rand), MAT.accent6)
  return B.geometry()
}

function palm(rand) {
  const B = new Builder()
  const trunk = col('#8a7a62', 0.1, rand)
  const H = 14
  let prev = [0, 0, 0]
  const lean = 0.06
  for (let k = 1; k <= 6; k++) {
    const y = (k / 6) * H
    const p = [lean * Math.pow(y, 1.5), y, 0]
    B.cyl(prev, p, 0.28 - k * 0.02, 0.26 - k * 0.025, trunk, MAT.wood, 6)
    prev = p
  }
  const top = prev
  // the leaflets are a shiny yellow green (L&S)
  const leaf = col('#6E7A3E', 0.12, rand)
  const tip = col('#8f9a43', 0.1, rand)
  for (let f = 0; f < 13; f++) {
    const a = (f / 13) * Math.PI * 2 + rand() * 0.3
    const len = 5.2 + rand() * 1.2
    const lift = 1.4 + rand() * 0.8
    const dx = Math.cos(a)
    const dz = Math.sin(a)
    let p0 = top
    for (let s = 1; s <= 5; s++) {
      const t = s / 5
      const p1 = [top[0] + dx * len * t, top[1] + lift * t - 3.8 * t * t, top[2] + dz * len * t]
      const w = 1.0 * Math.sin(Math.PI * Math.min(1, t * 1.1)) + 0.15
      const nx = -dz * w
      const nz = dx * w
      const c = s > 3 ? tip : leaf
      // a shallow V: two halves angled down off the rib
      B.quad([p0[0], p0[1], p0[2]], [p1[0], p1[1], p1[2]], [p1[0] + nx, p1[1] - 0.35 * w, p1[2] + nz], [p0[0] + nx * 0.7, p0[1] - 0.25 * w, p0[2] + nz * 0.7], c, MAT.leaf)
      B.quad([p0[0] - nx * 0.7, p0[1] - 0.25 * w, p0[2] - nz * 0.7], [p1[0] - nx, p1[1] - 0.35 * w, p1[2] - nz], [p1[0], p1[1], p1[2]], [p0[0], p0[1], p0[2]], c, MAT.leaf)
      p0 = p1
    }
  }
  // two dead fronds hanging against the trunk
  const dead = col('#7C6440', 0.12, rand)
  for (let f = 0; f < 2; f++) {
    const a = f * 2.6 + rand()
    const dx = Math.cos(a)
    const dz = Math.sin(a)
    const p0 = [top[0] + dx * 0.25, top[1] - 0.3, top[2] + dz * 0.25]
    const p1 = [top[0] + dx * 0.9, top[1] - 2.4, top[2] + dz * 0.9]
    const p2 = [top[0] + dx * 1.0, top[1] - 4.4, top[2] + dz * 1.0]
    for (const [a0, a1, w0, w1] of [[p0, p1, 0.2, 0.5], [p1, p2, 0.5, 0.2]]) {
      B.quad(a0, a1, [a1[0] - dz * w1, a1[1], a1[2] + dx * w1], [a0[0] - dz * w0, a0[1], a0[2] + dx * w0], dead, MAT.leaf)
      B.quad([a0[0] + dz * w0, a0[1], a0[2] - dx * w0], [a1[0] + dz * w1, a1[1], a1[2] - dx * w1], a1, a0, dead, MAT.leaf)
    }
  }
  const nut = col('#5c4a24', 0.1, rand)
  for (let k = 0; k < 4; k++) B.blob(top[0] + Math.cos(k * 1.7) * 0.4, top[1] - 0.6, top[2] + Math.sin(k * 1.7) * 0.4, 0.3, 0.35, 0.3, nut, MAT.plain, k)
  return B.geometry()
}

// ʻUlu: a coarse dark crown of giant lobed leaves, with yellow-green fruit.
function ulu(rand) {
  const B = new Builder()
  B.cyl([0, 0, 0], [0.3, 4.6, 0.1], 0.4, 0.3, col('#6E665A', 0.1, rand), MAT.wood, 5)
  const leafHex = '#3B5F24'
  const clumps = [[0.3, 7.2, 0.1, 3.6, 2.6]]
  for (let k = 0; k < 2; k++) {
    const a = k * 3.1 + rand()
    clumps.push([0.3 + Math.cos(a) * 2.2, 6.0 + rand(), 0.1 + Math.sin(a) * 2.2, 2.9, 2.2])
  }
  clumps.forEach((c, k) => B.blob(c[0], c[1], c[2], c[3], c[4], c[3], col(leafHex, 0.15, rand), MAT.leaf, k + rand()))
  // the big lobed leaves standing out of the crown's surface
  for (let k = 0; k < 14; k++) {
    const c = clumps[k % 3]
    const a = rand() * TAU
    const up = rand() * 0.8 - 0.1
    const ring = Math.sqrt(1 - up * up)
    const p = [c[0] + Math.cos(a) * ring * c[3] * 0.95, c[1] + up * c[4] * 0.95, c[2] + Math.sin(a) * ring * c[3] * 0.95]
    const d = [Math.cos(a) * 0.9, 0.2, Math.sin(a) * 0.9]
    const s = [-Math.sin(a) * 0.4, 0, Math.cos(a) * 0.4]
    B.quad([p[0] - s[0], p[1] - 0.1, p[2] - s[2]], [p[0] + s[0], p[1] - 0.1, p[2] + s[2]], [p[0] + d[0] + s[0] * 0.6, p[1] + d[1], p[2] + d[2] + s[2] * 0.6], [p[0] + d[0] - s[0] * 0.6, p[1] + d[1], p[2] + d[2] - s[2] * 0.6], col(leafHex, 0.2, rand), MAT.leaf)
  }
  speckle(B, rand, clumps, 10, 0.24, () => col('#A8C050', 0.1, rand), MAT.plain, -0.3)
  return B.geometry()
}

function banana(rand) {
  const B = new Builder()
  const stem = col('#7c9a4a', 0.1, rand)
  const leaf = col('#6E9440', 0.12, rand)
  const dead = col('#8A7048', 0.12, rand)
  for (let k = 0; k < 4; k++) {
    const a = rand() * Math.PI * 2
    const r = rand() * 0.6
    const bx = Math.cos(a) * r
    const bz = Math.sin(a) * r
    const h = 2.4 + rand() * 1.4
    B.cyl([bx, 0, bz], [bx, h, bz], 0.16, 0.12, stem, MAT.leaf, 5)
    for (let l = 0; l < 4; l++) {
      const la = rand() * Math.PI * 2
      const dx = Math.cos(la)
      const dz = Math.sin(la)
      const p0 = [bx, h, bz]
      const p1 = [bx + dx * 1.6, h + 0.7, bz + dz * 1.6]
      const p2 = [bx + dx * 2.6, h - 0.2, bz + dz * 2.6]
      const nx = -dz * 0.45
      const nz = dx * 0.45
      // the wind shreds each half into strips
      for (const s of [1, -1]) {
        for (const [f0, f1] of [[0.08, 0.45], [0.55, 1]]) {
          const o = (p, f, k) => [p[0] + nx * f * k * s, p[1] - 0.06 * f, p[2] + nz * f * k * s]
          B.quad(o(p0, f0, 0.3), o(p1, f0, 1), o(p1, f1, 1), o(p0, f1, 0.3), leaf, MAT.leaf)
          B.quad(o(p1, f0, 1), o(p2, f0, 0.6), o(p2, f1, 0.6), o(p1, f1, 1), leaf, MAT.leaf)
        }
      }
    }
    if (k < 2) {
      // and an old leaf hangs dead against the stem
      const da = rand() * TAU
      const dx = Math.cos(da)
      const dz = Math.sin(da)
      B.quad([bx + dx * 0.1, h - 0.1, bz + dz * 0.1], [bx + dx * 0.5, h - 1.6, bz + dz * 0.5], [bx + dx * 0.5 - dz * 0.35, h - 1.5, bz + dz * 0.5 + dx * 0.35], [bx + dx * 0.1 - dz * 0.2, h - 0.1, bz + dz * 0.1 + dx * 0.2], dead, MAT.leaf)
    }
  }
  return B.geometry()
}

function ti(rand, red) {
  const B = new Builder()
  const stem = col('#6b5a40', 0.1, rand)
  const leaf = col(red ? '#7d2b2f' : '#3f7d32', 0.15, rand)
  B.cyl([0, 0, 0], [0.05, 1.6, 0], 0.05, 0.04, stem, MAT.wood, 4)
  for (let l = 0; l < 9; l++) {
    const a = (l / 9) * Math.PI * 2
    const dx = Math.cos(a)
    const dz = Math.sin(a)
    const up = 0.3 + (l % 3) * 0.25
    B.quad([0.05 - dz * 0.06, 1.6, dx * 0.06], [0.05 + dz * 0.06, 1.6, -dx * 0.06], [0.05 + dx * 0.9 + dz * 0.12, 1.6 + up, dz * 0.9 - dx * 0.12], [0.05 + dx * 0.9 - dz * 0.12, 1.6 + up, dz * 0.9 + dx * 0.12], leaf, MAT.leaf)
  }
  return B.geometry()
}

function shrub(rand, color) {
  const B = new Builder()
  for (let k = 0; k < 3; k++) B.blob((rand() - 0.5) * 1.2, 0.5, (rand() - 0.5) * 1.2, 0.9, 0.7, 0.9, col(color, 0.2, rand), MAT.leaf, k)
  return B.geometry()
}

// --- placement ----------------------------------------------------------------

export const KINDS = ['niu', 'hala', 'ulu', 'kukui', 'maia', 'ki', 'kiRed', 'naupaka', 'aalii', 'ohiaai', 'hau', 'milo', 'kou', 'loulu']
export const FOREST_KINDS = ['ohia', 'ohiaKrumm', 'koa', 'kukui', 'ohiaai', 'hau', 'hala', 'wiliwili', 'lama', 'aalii', 'hapuu']
const K = Object.fromEntries(FOREST_KINDS.map((k, i) => [k, i]))
// two pseudo-kinds that pick a geometry and a tint
K.ohiaDry = FOREST_KINDS.length
K.olapa = FOREST_KINDS.length + 1
const NK = FOREST_KINDS.length
// instance capacity per species: [near (full model), far (simple crown)]
const CAPS = {
  ohia: [3000, 12000],
  ohiaKrumm: [2500, 8000],
  koa: [1500, 5000],
  kukui: [2000, 6000],
  ohiaai: [1200, 4000],
  hau: [1000, 3000],
  hala: [1500, 4000],
  wiliwili: [800, 3000],
  lama: [1500, 5000],
  aalii: [1500, 4000],
  hapuu: [3000, 0],
}
const FOREST_T = 2 // tile size, world units
const FOREST_R = 13.5 // forest radius around the camera; the canopy texture takes over beyond
const FOREST_LOD = [3.6, 4.6] // full models hand over to simple crowns across this band
const FIXED_FADE = [34, 48] // the planted trees dither out over this band
const FIXED_R = FIXED_FADE[1] + 3 // and are drawn only this near (+ the refill step and a crown)

// rain in the land texture's units, ln(mm / 300) / ln(40)
const R1000 = 0.326
const R1075 = 0.346
const R1250 = 0.387 // dry below (Cuddihy & Stone)
const R1500 = 0.436
const R1900 = 0.5
const R2500 = 0.575 // wet above
const R4000 = 0.702 // kukui's wet limit (Kahana)
const R5000 = 0.763

// per-instance tints, RGB multipliers on the instance colour
const OHIA_WET = [0.72, 0.75, 0.7] // smooth-leaved: olive (a touch greyer than the spec's 0.68, 0.71, 0.55 under the warm morning sun)
const OHIA_DRY = [1.48, 1.41, 1.8] // hairy dry-site leaves: grey-olive
const OHIA_K = [0.72, 0.68, 0.85] // stunted cloud-forest ʻōhiʻa
const OLAPA = [1.32, 1.46, 1.17] // ʻōlapa on the stunted geometry: bright yellow-green (the spec's 1.5, 1.66, 1.33 a step down: in the sun it went neon)
const ILIAHI = [1.54, 1.4, 1.68] // ʻiliahi among the lama: drooping grey-olive

const OK = (b) => (b ? 1 : 0)

/** Weighted choice over [name, weight] pairs (≤ 0 skipped); null if none. */
function choose(u, opts) {
  let t = 0
  for (const [, w] of opts) t += Math.max(0, w)
  if (t <= 0) return null
  u *= t
  for (const [k, w] of opts) if (w > 0 && (u -= w) < 0) return k
  return opts.filter(([, w]) => w > 0).pop()[0]
}

/** The same over a weight array indexed by kind; -1 if none. */
function chooseW(u, w) {
  let t = 0
  for (let k = 0; k < w.length; k++) if (w[k] > 0) t += w[k]
  if (t <= 0) return -1
  u *= t
  let last = -1
  for (let k = 0; k < w.length; k++) {
    if (w[k] <= 0) continue
    last = k
    if ((u -= w[k]) < 0) return k
  }
  return last
}

function segDist(x, z, ax, az, bx, bz) {
  const dx = bx - ax
  const dz = bz - az
  const l2 = dx * dx + dz * dz || 1e-12
  const t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / l2))
  return Math.hypot(ax + dx * t - x, az + dz * t - z)
}

// The shaders' hash12 and vnoise (common.glsl.js), in single precision, so a
// patch the trees are planted by is the same patch the terrain's far canopy
// paints beyond them.
const f32 = Math.fround
const fract = (v) => v - Math.floor(v)
function hash12(x, y) {
  let a = fract(f32(x * 0.1031))
  let b = fract(f32(y * 0.1031))
  let c = a
  const d = f32(f32(a * f32(b + 33.33)) + f32(b * f32(c + 33.33)) + f32(c * f32(a + 33.33)))
  a = f32(a + d)
  b = f32(b + d)
  c = f32(c + d)
  return fract(f32(f32(a + b) * c))
}
function vnoise(x, y) {
  const i = Math.floor(x)
  const j = Math.floor(y)
  const fx = x - i
  const fy = y - j
  const ux = fx * fx * (3 - 2 * fx)
  const uy = fy * fy * (3 - 2 * fy)
  const a = hash12(i, j)
  const b = hash12(i + 1, j)
  const c = hash12(i, j + 1)
  const d = hash12(i + 1, j + 1)
  return a + (b - a) * ux + (c - a + (a - b + d - c) * ux) * uy
}
/**
 * The groves' patches: value noise whose lookup a finer noise of its own
 * wanders about, so a patch's edge meanders rather than tracing the noise's
 * lattice in boxes (terrain.glsl.js groveNoise, which the far canopy paints
 * them by: keep the two in step).
 */
function groveNoise(px, pz) {
  const wx = vnoise(px * 2.7 + 5.2, pz * 2.7 + 1.3) - 0.5
  const wz = vnoise(px * 2.7 + 9.7, pz * 2.7 + 6.1) - 0.5
  return vnoise(px + 0.8 * wx, pz + 0.8 * wz)
}
/** Kukui's groves on the farmed lowland's walls and gulches, ~200 m patches (0..1). */
const kukuiPatch = (x, z) => sm(0.4, 0.6, groveNoise(x * 0.5 + 13.1, z * 0.5 + 7.7))
/** ʻŌhiʻa ʻai's nearly pure groves, ~200 m across and fewer (0..1). */
const aiGrove = (x, z) => sm(0.6, 0.68, groveNoise(x * 0.55 + 41.3, z * 0.55 + 3.9))

/** Insertion sort of tiles by their distance `d`, in place (no allocation). */
function byDistance(tiles) {
  for (let i = 1; i < tiles.length; i++) {
    const t = tiles[i]
    let j = i - 1
    while (j >= 0 && tiles[j].d > t.d) {
      tiles[j + 1] = tiles[j]
      j--
    }
    tiles[j + 1] = t
  }
}

export class Vegetation {
  constructor(app) {
    this.app = app
    const rand = mulberry32(app.island.meta.seed + 5150)
    this.geoms = {
      niu: palm(rand),
      hala: hala(rand),
      ulu: ulu(rand),
      kukui: kukui(rand),
      maia: banana(rand),
      ki: ti(rand, false),
      kiRed: ti(rand, true),
      naupaka: shrub(rand, '#5f8a42'),
      aalii: aalii(rand),
      ohiaai: ohiaai(rand),
      hau: hau(rand),
      milo: shadeTree(rand, false),
      kou: shadeTree(rand, true),
      loulu: loulu(rand),
      ohia: ohia(rand),
      ohiaKrumm: ohiaKrumm(rand),
      koa: koa(rand),
      wiliwili: wiliwili(rand),
      lama: lama(rand),
      hapuu: hapuu(rand),
    }
    // the far versions keep each species' outline and leaf colour: ʻōhiʻa
    // flat-topped and lopsided, koa a wide umbrella, kukui a pale dome over a
    // shaded one, ʻōhiʻa ʻai a dark ellipsoid, hau a low slab, hala a few tufts
    this.farGeoms = {
      // (ʻōhiʻa: the trunk in its crown's shade, as it reads from afar, not
      // pale bark lit as if in the open, or a wall of them reads as
      // mushrooms on white stalks; the crown a little deeper than the
      // spec's, down toward the fork)
      ohia: farTree(rand, { stick: [0.3, 6.5, 0.1], bark: '#5A5354', crowns: [[0.3, 8.6, 0, 4.6, 2.5, scaled(col('#5C603F', 0, rand), 0.95)], [2.2, 7.7, 1.0, 3.0, 1.8, scaled(col('#5C603F', 0, rand), 0.95), MAT.leaf, 2]] }),
      // (no stick, the spec's §4.2: the low crown hides its stems, sitting
      // low, its shaded underside coming down to them, so on a steep wall it
      // hugs the ground rather than floating; as wide as the near one's
      // clumps, so the cloud forest closes the same)
      ohiaKrumm: farTree(rand, { crowns: [[0.6, 2.4, 0.2, 5.0, 1.5, '#596537', MAT.leaf, 1, 0.75, 0.3]] }),
      // (koa: the short bole forks into big limbs, each carrying a spray
      // where the near one's pair of tips are: an umbrella broken into a few
      // separate masses, with sky between, as wispy as the near crown reads)
      koa: farTree(rand, {
        stick: [0.2, 4.0, -0.3],
        r0: 0.6,
        r1: 0.45,
        bark: '#5A504B',
        limbs: koaSprays(this.geoms.koa).map((p) => [[0.2, 3.8, -0.3], [p[0] * 0.9, p[1] - 0.6, p[2] * 0.9], 0.3, 0.14]),
        crowns: koaSprays(this.geoms.koa).map((p, k) => [p[0], p[1] + 0.3, p[2], 3.0, 1.55, k === 1 ? '#737B5A' : '#5E6A3C', MAT.leaf, k + 1]),
      }),
      // (kukui: one full, rounded crown as tall and wide as the near one's,
      // from its lowest limb's foliage to its floury top, shaded beneath as
      // its masses are, the top heaped on it and a lower mass to one side, on
      // a short trunk in the crown's shade — not a flat cap on a pale stalk,
      // which a hillside of reads as mushrooms)
      kukui: farTree(rand, {
        stick: [0.3, 4.2, 0.1],
        r0: 0.45,
        r1: 0.35,
        bark: '#5F5B54',
        crowns: [[0.3, 6.5, 0.1, 5.8, 3.2, KUKUI_LEAF, MAT.leaf, 1, 0.62], [0.5, 8.6, 0.3, 3.4, 1.6, KUKUI_PALE, MAT.leaf, 5, 0.8], [-2.9, 5.6, 1.6, 2.8, 1.9, KUKUI_MID, MAT.leaf, 2, 0.7]],
      }),
      ohiaai: farTree(rand, { stick: [0, 2.4, 0], r0: 0.35, r1: 0.3, bark: '#8A7458', crowns: [[0, 6.0, 0, 2.4, 3.6, '#3A5026']] }),
      hau: farTree(rand, { crowns: [[0, 2.2, 0, 5.0, 2.2, '#6E8A3E']] }), // (resting on the ground, as its arching limbs do)
      // (hala: a tuft over each of the near model's branch tips, see-through
      // between them like its candelabra, not one parasol)
      hala: farTree(rand, {
        stick: [0.3, 3.4, 0],
        r0: 0.22,
        r1: 0.15,
        bark: '#8E8B82',
        // (one limb to each fork's pair of tufts, between them: four thin
        // sticks cost as much to draw as the tufts)
        limbs: [0, 2].map((k) => {
          const [a, b] = this.geoms.hala.userData.tips.slice(k, k + 2)
          return [[0.3, 3.3, 0], [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 0.45, (a[2] + b[2]) / 2], 0.13, 0.09]
        }),
        crowns: this.geoms.hala.userData.tips.map((t, k) => [t[0], t[1] - 0.35, t[2], 1.45, 0.75, '#55703D', MAT.leaf, k + 1]),
      }),
      // (wiliwili: in leaf one thin crown on the stick; bare, the skeleton:
      // its stiff limbs, always there, each ending in a small greyish knot
      // of twigs, rather than tan caps that read as mushrooms)
      wiliwili: farTree(rand, {
        stick: [0.1, 2.8, 0.2],
        r0: 0.45,
        r1: 0.3,
        bark: '#9C6C44',
        limbs: this.geoms.wiliwili.userData.ends.map((e) => [[0.05, 2.5, 0.2], e, 0.2, 0.08]),
        crowns: [
          [0, 3.9, 0.2, 4.8, 1.25, '#788C4A', MAT.accent3, 3, 0.75],
          ...this.geoms.wiliwili.userData.ends.map((e, k) => [e[0], e[1] + 0.3, e[2], 1.25, 0.5, '#7E7062', MAT.accent2, 4 + k, 0.8]),
        ],
      }),
      lama: farTree(rand, { stick: [0.2, 3.2, 0.1], r0: 0.25, r1: 0.18, bark: '#3E3A36', crowns: [[0.2, 5.4, 0.1, 2.6, 2.0, '#4C5E2E']] }),
      aalii: farTree(rand, { crowns: [[0, 1.2, 0, 1.5, 1.0, '#6F8A4E']] }),
    }
    for (const set of [this.geoms, this.farGeoms]) for (const k in set) set[k] = indexed(set[k])
    // the seasons: flowering, new leaves, the wiliwili bare or in leaf
    // (objectMaterial picks uAccent up from here), and the same for the
    // terrain's far canopy — whose materials were made before this, so they
    // are handed the uniforms directly
    const U = app.shared.uniforms
    U.uAccent = U.uAccent || { value: new Float32Array(9) }
    U.uKau = U.uKau || { value: 0 }
    U.uLehua = U.uLehua || { value: 0 }
    const T = app.terrain
    for (const u of [T?.uniforms, T?.full?.material?.uniforms, T?.half?.material?.uniforms]) {
      if (!u) continue
      for (const k of ['uAccent', 'uKau', 'uLehua']) u[k] = u[k] || U[k]
    }
    this.season()
    // palm fronds, hala, maiʻa, kī and loulu leaves are single sheets: draw both faces
    this.fixedMat = objectMaterial(app.shared, { fade: FIXED_FADE, close: 0.3, sway: 1, doubleSide: true })
    // (the leaf tints keep off the bark, or hairy dry ʻōhiʻa grows lavender trunks)
    this.forestMat = objectMaterial(app.shared, { fade: [FOREST_LOD[0], FOREST_LOD[1]], close: 0.3, sway: 1, woodTint: 0.25 })
    // (hāpuʻu fronds and hala straps)
    this.forestMatDS = objectMaterial(app.shared, { fade: [FOREST_LOD[0], FOREST_LOD[1]], close: 0.3, sway: 1, doubleSide: true, woodTint: 0.25 })
    this.forestFarMat = objectMaterial(app.shared, { fade: [FOREST_R - 3.5, FOREST_R], fadeIn: FOREST_LOD, sway: 1, woodTint: 0.25 })
    this.group = new THREE.Group()
    this.land = app.landTex.image.data
    this.cleared = this.clearings()
    this.terrainHelpers()
    // (on a stream of its own, so reworking a model never moves the planting)
    this.fixed = this.placeFixed(mulberry32(app.island.meta.seed + 5152))
    this.meshes = {}
    this.fixedAll = {}
    for (const k of KINDS) {
      const list = this.fixed[k]
      if (!list.length) continue
      const mesh = new THREE.InstancedMesh(this.geoms[k], this.fixedMat, list.length)
      mesh.name = k
      this.writeInstances(mesh, list)
      mesh.frustumCulled = false
      // (the whole planting is kept here, and only what stands within the
      // fade distance is copied into the draw buffer: fillFixed)
      const xz = new Float32Array(list.length * 2)
      list.forEach((t, i) => xz.set([t.x, t.z], i * 2))
      this.fixedAll[k] = { mat: mesh.instanceMatrix.array.slice(), col: mesh.instanceColor.array.slice(), xz }
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
      mesh.instanceColor.setUsage(THREE.DynamicDrawUsage)
      this.group.add(mesh)
      this.meshes[k] = mesh
    }
    this.fixedAt = [Infinity, Infinity]
    // the streamed forest: per species, a near mesh (the full model) and a far
    // one (the simple crown), refilled from whichever tiles are in view
    this.forest = { near: [], far: [] }
    for (const k of FOREST_KINDS) {
      const [nc, fc] = CAPS[k]
      this.forest.near.push(this.forestMesh(this.geoms[k], k === 'hala' || k === 'hapuu' ? this.forestMatDS : this.forestMat, nc, k + ' near'))
      this.forest.far.push(fc ? this.forestMesh(this.farGeoms[k], this.forestFarMat, fc, k + ' far') : null)
    }
    this.tiles = new Map()
    this.frustum = new THREE.Frustum()
    this.projView = new THREE.Matrix4()
    // per-frame scratch, so streaming allocates nothing in steady state
    this.near = []
    this.far = []
    this.missing = []
    this.lastSelection = ''
    this.selHash = 0
    this.selCount = -1
    this.nv = new THREE.Vector3()
    this.L = { rain: 0, sand: 0, rip: 0, field: 0 }
    this.pending = Array.from({ length: NK }, () => [])
    this.w = new Float32Array(NK + 2)
    this.tint = [1, 1, 1]
    // the trade wind, for leaning the stunted trees downwind
    const [wx, wz] = windVector(TRADE_BEARING)
    this.leeRot = Math.atan2(-wz, wx)
  }

  forestMesh(geom, mat, capacity, name) {
    const mesh = new THREE.InstancedMesh(geom, mat, capacity)
    mesh.name = name
    mesh.count = 0
    mesh.visible = false
    mesh.frustumCulled = false
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(capacity * 3), 3)
    mesh.instanceColor.setUsage(THREE.DynamicDrawUsage)
    this.group.add(mesh)
    return mesh
  }

  /**
   * Fractions of trees in flower, flush or leaf by the day of the year, eased
   * over ~20 days: lehua all year with a spring–summer peak, wiliwili leafless
   * from early spring through the dry season and in flower early spring to
   * July, ʻōhiʻa ʻai flowering in March–April and fruiting June–November
   * (Little & Skolmen; NPH; TTI).
   */
  season() {
    const c = this.app.clock
    const d = c ? c.doy + c.hour / 24 : 277
    const kau = sm(111, 131, d) * (1 - sm(294, 314, d))
    const A = this.app.shared.uniforms.uAccent.value
    A[0] = 0.15 + 0.2 * kau // lehua
    A[1] = 0.2 + 0.05 * kau // liko
    A[2] = 0.1 + 0.75 * sm(50, 70, d) * (1 - sm(294, 314, d)) // wiliwili bare
    A[3] = 1 - A[2] // wiliwili in leaf (the complement)
    A[8] = Math.min(A[2], 0.85 * sm(50, 70, d) * (1 - sm(185, 205, d))) // and in flower, on bare trees only
    A[4] = 0.8 * sm(50, 70, d) * (1 - sm(110, 130, d)) // ʻōhiʻa ʻai flowers
    A[5] = 0.6 * sm(140, 160, d) * (1 - sm(320, 340, d)) // ʻōhiʻa ʻai fruit
    A[6] = 0.3 - 0.05 * kau // koa, kukui, hau, kou, milo
    A[7] = 0.45 // ʻaʻaliʻi capsules persist
    this.app.shared.uniforms.uKau.value = kau
    this.app.shared.uniforms.uLehua.value = A[0] / 0.35
  }

  /** Ground people have cleared: paddies, kauhale, heiau courts. */
  clearings() {
    const N = HYDRO_RES
    const m = new Uint8Array(N * N)
    const cell = WORLD / N
    const stamp = (x, z, r) => {
      const i0 = Math.max(0, Math.floor((x - r + HALF) / cell))
      const i1 = Math.min(N - 1, Math.floor((x + r + HALF) / cell))
      const j0 = Math.max(0, Math.floor((z - r + HALF) / cell))
      const j1 = Math.min(N - 1, Math.floor((z + r + HALF) / cell))
      for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) m[j * N + i] = 1
    }
    const sites = this.app.island.meta.sites
    for (const c of sites.loi) {
      for (const p of c.paddies) {
        stamp(p.c[0], p.c[1], 0.05)
        for (const q of p.poly) stamp(q[0], q[1], 0.03)
      }
    }
    for (const h of sites.houses) stamp(h.x, h.z, 0.12)
    for (const h of sites.heiau) stamp(h.x, h.z, 0.5)
    for (const v of sites.villages) stamp(v.x, v.z, 0.3)
    for (const a of this.app.island.meta.ahu) stamp(a.x, a.z, 0.3)
    for (const k of sites.koa) stamp(k.x, k.z, 0.15)
    return m
  }

  /**
   * Built once: topographic position (a cell's height above the mean of a
   * ~250 m ring round it: + ridge or spur, − hollow or valley), the distances
   * to cultivated ground and to the kula field systems, and the drawn streams.
   */
  terrainHelpers() {
    const N = HYDRO_RES
    const H1 = this.app.island.data.height1024
    const tpi = new Float32Array(N * N)
    const ring = []
    for (let k = 0; k < 8; k++) {
      const a = (k * Math.PI) / 4
      ring.push(Math.round(7 * Math.sin(a)) * N + Math.round(7 * Math.cos(a)))
    }
    for (let j = 7; j < N - 7; j++) {
      for (let i = 7; i < N - 7; i++) {
        const c = j * N + i
        let s = 0
        for (let k = 0; k < 8; k++) s += H1[c + ring[k]]
        tpi[c] = H1[c] - s / 8
      }
    }
    this.tpi = tpi
    // (from the clearings as first laid out: the falls and the hōlua clear
    // more later, and those aren't gardens)
    this.dCult = distanceTransform(N, (c) => this.cleared[c] === 1)
    // and to the kula field systems: the dry farmland round them is kula too,
    // pili and scattered dry-land trees, wherever it lies for its height
    this.dField = distanceTransform(N, (c) => this.land[c * 4 + 3] > 5)
    // the drawn streams, for hau along their banks and no trunk in the
    // water: each cell within ~60 m of one keeps the nearest segment (ends
    // and the ribbon's half-width, as streams.js sizes it), and bankAt
    // measures exactly against the four cells round a point
    const lines = this.app.wailele?.lines || layStreams(this.app.island.meta, this.app.island.data)
    const segs = []
    for (const l of lines) {
      const half = Math.min(0.11, 0.009 * Math.sqrt(l.lineA) + 0.012)
      for (let k = 1; k < l.pts.length; k++) segs.push(l.pts[k - 1][0], l.pts[k - 1][1], l.pts[k][0], l.pts[k][1], half)
    }
    const cell = WORLD / N
    const R = 0.6
    const best = new Float32Array(N * N).fill(R)
    const near = new Int32Array(N * N).fill(-1)
    for (let q = 0; q < segs.length; q += 5) {
      const [ax, az, bx, bz, half] = [segs[q], segs[q + 1], segs[q + 2], segs[q + 3], segs[q + 4]]
      const i0 = Math.max(0, Math.floor((Math.min(ax, bx) - R + HALF) / cell))
      const i1 = Math.min(N - 1, Math.floor((Math.max(ax, bx) + R + HALF) / cell))
      const j0 = Math.max(0, Math.floor((Math.min(az, bz) - R + HALF) / cell))
      const j1 = Math.min(N - 1, Math.floor((Math.max(az, bz) + R + HALF) / cell))
      for (let j = j0; j <= j1; j++) {
        for (let i = i0; i <= i1; i++) {
          const d = segDist(-HALF + (i + 0.5) * cell, -HALF + (j + 0.5) * cell, ax, az, bx, bz) - half
          if (d < best[j * N + i]) {
            best[j * N + i] = d
            near[j * N + i] = q
          }
        }
      }
    }
    this.streamSegs = new Float32Array(segs)
    this.streamNear = near
  }

  /** World units from (x, z) to the nearest drawn stream's bank (< 0 in the water; 9 if none near). */
  bankAt(x, z) {
    const N = HYDRO_RES
    const fx = ((x + HALF) / WORLD) * N - 0.5
    const fz = ((z + HALF) / WORLD) * N - 0.5
    const i0 = Math.floor(fx)
    const j0 = Math.floor(fz)
    const S5 = this.streamSegs
    let d = 9
    for (let j = j0; j <= j0 + 1; j++) {
      for (let i = i0; i <= i0 + 1; i++) {
        if (i < 0 || j < 0 || i >= N || j >= N) continue
        const q = this.streamNear[j * N + i]
        if (q < 0) continue
        d = Math.min(d, segDist(x, z, S5[q], S5[q + 1], S5[q + 2], S5[q + 3]) - S5[q + 4])
      }
    }
    return d
  }

  cellOf(x, z) {
    const N = HYDRO_RES
    const i = Math.floor(((x + HALF) / WORLD) * N)
    const j = Math.floor(((z + HALF) / WORLD) * N)
    return i >= 0 && j >= 0 && i < N && j < N ? j * N + i : -1
  }

  tpiAt(x, z) {
    const c = this.cellOf(x, z)
    return c < 0 ? 0 : this.tpi[c]
  }

  /** Metres to the nearest cultivated or settled ground. */
  dCultAt(x, z) {
    const c = this.cellOf(x, z)
    return c < 0 ? 1e9 : this.dCult[c] * (WORLD / HYDRO_RES) * 100
  }

  /** Metres to the nearest kula field system. */
  dFieldAt(x, z) {
    const c = this.cellOf(x, z)
    return c < 0 ? 1e9 : this.dField[c] * (WORLD / HYDRO_RES) * 100
  }

  /**
   * How far (x, z) lies in a hero fall's amphitheatre, or round its pool and
   * a way down the gorge below (0..1): the ground the terrain keeps wild in
   * fern (terrain.glsl.js fallAt and its `wild`, worked out here the same way
   * from the falls it was handed), where only wet forest grows.
   */
  wildAt(x, z, metres) {
    const U = this.app.terrain?.uniforms
    const n = U?.uFalls ? U.uFalls.value : 0
    let w = 0
    for (let k = 0; k < n; k++) {
      const A = U.uFallA.value[k]
      const B = U.uFallB.value[k]
      const C = U.uFallC.value[k]
      const D = U.uFallD.value[k]
      const dx = x - A.x
      const dz = z - A.y
      const s = dx * A.z + dz * A.w
      const c = -dx * A.w + dz * A.z
      w = Math.max(w, 1 - sm(1.2, 2.2, Math.hypot((s - B.w) * 0.7, c)))
      if (s * s + c * c > (C.x + 0.8) * (C.x + 0.8) + 2.5) continue
      const rim = s - D.z - D.y * c * c
      const across = Math.abs(c) / (C.z + (D.x - C.z) * Math.min(1, Math.max(0, s / C.x)))
      w = Math.max(w, sm(-0.9, -0.6, rim) * (1 - sm(C.x + 0.4, C.x + 0.8, s)) * (1 - sm(1.6, 2.0, across)) * sm(B.y, B.y + 15, metres))
    }
    return w
  }

  isCleared(x, z) {
    const c = this.cellOf(x, z)
    return c >= 0 && this.cleared[c] === 1
  }

  landAt(x, z) {
    const c = this.cellOf(x, z)
    if (c < 0) return null
    const d = this.land
    return { rain: d[c * 4] / 255, sand: d[c * 4 + 1] / 255, rip: d[c * 4 + 2] / 255, field: d[c * 4 + 3] / 255 }
  }

  /** landAt into a reused object (for the streaming loop). */
  landInto(x, z, L) {
    const c = this.cellOf(x, z)
    if (c < 0) return null
    const d = this.land
    L.rain = d[c * 4] / 255
    L.sand = d[c * 4 + 1] / 255
    L.rip = d[c * 4 + 2] / 255
    L.field = d[c * 4 + 3] / 255
    return L
  }

  writeInstances(mesh, list) {
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const p = new THREE.Vector3()
    const s = new THREE.Vector3()
    const c = new THREE.Color()
    const up = new THREE.Vector3(0, 1, 0)
    for (let i = 0; i < list.length; i++) {
      const t = list[i]
      p.set(t.x, t.y, t.z)
      q.setFromAxisAngle(up, t.rot)
      s.setScalar(t.s)
      m.compose(p, q, s)
      mesh.setMatrixAt(i, m)
      c.setRGB(t.c, t.c * (0.96 + 0.08 * (((t.x * 997 + t.z * 131) % 1) + 1) % 1), t.c)
      mesh.setColorAt(i, c)
    }
    mesh.count = list.length
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }

  placeFixed(rand) {
    const { terrain } = this.app
    const meta = this.app.island.meta
    const sites = meta.sites
    const out = Object.fromEntries(KINDS.map((k) => [k, []]))
    const houses = sites.houses
    const clearOf = (x, z, r) => !houses.some((h) => Math.abs(h.x - x) < r && Math.abs(h.z - z) < r && Math.hypot(h.x - x, h.z - z) < r)
    // nor through anything built: every platform's outline (features/index.js),
    // and `m` past it for a tree's trunk and lower fronds
    const built = this.app.features?.footings || []
    const onBuilt = (x, z, m) =>
      built.some(({ box: b }) => {
        const dx = x - b.x
        const dz = z - b.z
        return Math.abs(dx * b.c + dz * b.s) < b.hx + m && Math.abs(dz * b.c - dx * b.s) < b.hz + m
      })
    const add = (kind, x, z, scale = 1, m = 0.025) => {
      if (!kind) return false
      const y = terrain.heightAt(x, z)
      if (y <= 0.003) return false
      const t = { x, y, z, rot: rand() * Math.PI * 2, s: S * scale * (0.8 + rand() * 0.45), c: 0.85 + rand() * 0.3 }
      // (drawn either way, so leaving one out moves no other)
      if (onBuilt(x, z, m)) return false
      out[kind].push(t)
      return true
    }
    const nearVillage = (x, z, r) => sites.villages.some((v) => Math.hypot(v.x - x, v.z - z) < r)

    // around each kauhale: niu on the sand; ʻulu, maiʻa, kukui and hala where
    // it is moist; kou, milo and ʻaʻaliʻi at the dry leeward villages
    for (const v of sites.villages) {
      const Lv = this.landAt(v.x, v.z)
      const wetV = !!Lv && Lv.rain > 0.3 // windward or moist (about 900 mm or more)
      const n = v.alii ? 26 : v.model ? 20 : 12
      for (let k = 0; k < n; k++) {
        const a = rand() * Math.PI * 2
        const r = 0.12 + rand() * 0.68
        const x = v.x + Math.cos(a) * r
        const z = v.z + Math.sin(a) * r
        if (!clearOf(x, z, 0.09)) continue
        const L = this.landAt(x, z)
        const kind =
          L && L.sand > 0.3
            ? choose(rand(), [['niu', 70], ['hala', 15 * OK(wetV)], ['milo', 15 * OK(wetV)], ['kou', 15 * OK(!wetV)]])
            : wetV
              ? choose(rand(), [['niu', 25], ['ulu', 20], ['maia', 15], ['hala', 10], ['kukui', 10], ['milo', 10], ['ohiaai', 5], ['hau', 5]])
              : choose(rand(), [['niu', 35], ['kou', 25], ['milo', 10], ['hala', 5], ['ulu', 5 * OK(L && L.rain > 0.25)], ['aalii', 10], ['ki', 10]])
        add(kind, x, z)
      }
      // kī planted round the dwellings (Handy 1940); red-leaved kī is not
      // known to predate contact, so it stays rare
      for (let k = 0; k < (v.model ? 24 : 10); k++) {
        const h = houses[Math.floor(rand() * houses.length)]
        if (h.village !== v.id) continue
        const a = rand() * Math.PI * 2
        add(rand() < 0.95 ? 'ki' : 'kiRed', h.x + Math.cos(a) * 0.08, h.z + Math.sin(a) * 0.08, 0.9, 0.005)
      }
    }

    // along the shore: naupaka on the sand; hala, niu and milo on the moist
    // coast; kou and ʻaʻaliʻi on the dry one, niu only near a village
    const trail = meta.trail
    for (let k = 0; k < trail.length; k++) {
      const p = trail[k]
      for (let r = 0; r < 3; r++) {
        const x = p[0] + (rand() - 0.5) * 2.6
        const z = p[1] + (rand() - 0.5) * 2.6
        const L = this.landAt(x, z)
        if (!L) continue
        const y = terrain.heightAt(x, z)
        if (y <= 0.003 || y > 0.4) continue
        if (L.sand > 0.4 && rand() < 0.5) add('naupaka', x, z, 0.8)
        else if (rand() < 0.7) {
          const kind =
            L.rain > 0.28
              ? choose(rand(), [['hala', 35], ['niu', 35], ['milo', 20], ['hau', 10 * OK(L.rip > 0.4)]])
              : choose(rand(), [['niu', 30 * OK(nearVillage(x, z, 0.6))], ['kou', 25], ['aalii', 30], ['naupaka', 15]])
          add(kind, x, z, kind === 'aalii' || kind === 'naupaka' ? 0.8 : 1)
        }
      }
    }

    // up the valleys beside the loʻi: maiʻa and kī on the banks, kukui on the
    // outer bank, ʻōhiʻa ʻai toward the valley side, ʻulu where it is moist
    // enough, hau by the water (Handy; Terry 1988) — out past a paddy's edge,
    // wherever that isn't another paddy
    const streams = meta.streams
    for (const complex of sites.loi) {
      const ps = complex.paddies
      const wet = (x, z, r) => ps.some((p) => Math.abs(p.c[0] - x) < 0.4 && Math.abs(p.c[1] - z) < 0.4 && (insidePoly(p.poly, x, z) || p.poly.some((q) => Math.hypot(q[0] - x, q[1] - z) < r)))
      let x0 = Infinity
      let x1 = -Infinity
      let z0 = Infinity
      let z1 = -Infinity
      for (const p of ps) {
        x0 = Math.min(x0, p.c[0] - 1)
        x1 = Math.max(x1, p.c[0] + 1)
        z0 = Math.min(z0, p.c[1] - 1)
        z1 = Math.max(z1, p.c[1] + 1)
      }
      const lines = (complex.auwai || []).concat(streams.filter((s) => s.pts.some((q) => q[0] > x0 && q[0] < x1 && q[1] > z0 && q[1] < z1)).map((s) => s.pts))
      const byWater = (x, z, d) => lines.some((l) => l.some((q, i) => i > 0 && segDist(x, z, l[i - 1][0], l[i - 1][1], q[0], q[1]) < d))
      for (let k = 0; k < ps.length; k += 2) {
        const p = ps[k]
        const q = p.poly[Math.floor(rand() * p.poly.length)]
        const dx = q[0] - p.c[0]
        const dz = q[1] - p.c[1]
        const l = Math.hypot(dx, dz) || 1
        const ox = q[0] + (dx / l) * 0.04
        const oz = q[1] + (dz / l) * 0.04
        if (wet(ox, oz, 0.025)) continue
        const L = this.landAt(ox, oz)
        const r = rand()
        if (r < 0.3) add('maia', ox, oz)
        else if (r < 0.55) add(rand() < 0.95 ? 'ki' : 'kiRed', ox, oz, 0.9, 0.005)
        else if (r < 0.7) {
          if (!wet(ox + (dx / l) * 0.1, oz + (dz / l) * 0.1, 0.08)) add('kukui', ox + (dx / l) * 0.1, oz + (dz / l) * 0.1)
        } else if (r < 0.85) {
          const t = 0.1 + rand() * 0.1
          if (!wet(ox + (dx / l) * t, oz + (dz / l) * t, 0.08)) add('ohiaai', ox + (dx / l) * t, oz + (dz / l) * t)
        } else if (r < 0.95) {
          if (L && L.rain > 0.3) add('ulu', ox, oz)
        } else if (byWater(ox, oz, 0.05)) add('hau', ox, oz)
      }
    }

    // hau thickets and milo at the brackish edges of the fishponds (Kahana)
    for (const p of sites.ponds) {
      const lx = -p.az
      const lz = p.ax
      const put = (kind, n) => {
        for (let k = 0; k < n; k++) {
          const s = (rand() * 2 - 1) * p.r
          // back from the water until the ground is dry
          for (let d = 0.05 + rand() * 0.1; d < 0.5; d += 0.06) {
            const x = p.cx + lx * s - p.ax * d
            const z = p.cz + lz * s - p.az * d
            if (terrain.heightAt(x, z) > 0.004) {
              add(kind, x, z)
              break
            }
          }
        }
      }
      put('hau', 4 + Math.floor(rand() * 5))
      put('milo', 2 + Math.floor(rand() * 3))
    }
    // and at the mouths of the streams, off the sand
    for (const s of streams) {
      if (!s.mouth) continue // (a stream that ends in another, or inland)
      const [mx, mz] = s.pts[s.pts.length - 1]
      const L = this.landAt(mx, mz)
      if (!L || L.rain <= 0.25) continue
      const n = s.area > 7 ? 5 + Math.floor(rand() * 6) : 1 + Math.floor(rand() * 3)
      for (let k = 0; k < n; k++) {
        const a = rand() * TAU
        const r = 0.05 + rand() * 0.25
        const x = mx + Math.cos(a) * r
        const z = mz + Math.sin(a) * r
        const Lh = this.landAt(x, z)
        if (Lh && Lh.sand < 0.3 && !this.isCleared(x, z)) add('hau', x, z)
      }
    }

    // the forest margin above the gardens: wild maiʻa (in the upper, partly
    // forested ʻamaʻu zone: Kelly, via Cuddihy & Stone) and kī, which "runs
    // wild" there (Handy) — in scattered clumps, more of them near cultivation
    const Ls = { rain: 0, sand: 0, rip: 0, field: 0 }
    const nv = new THREE.Vector3()
    const margin = []
    const cliffs = []
    const coast = []
    for (let z = -HALF; z < HALF; z += 0.5) {
      for (let x = -HALF; x < HALF; x += 0.5) {
        const L = this.landInto(x, z, Ls)
        if (!L || L.rain <= 0.3 || this.isCleared(x, z)) continue
        const m = terrain.metresAt(x, z)
        if (m > 420 && m < 800 && L.rain > R1500) margin.push(x, z, this.dCultAt(x, z) < 1500 ? 1 : 0.35)
        // loulu: by 1700 the lowland loulu forests were long gone; they
        // survived on wet cliffs and ridges, and at the foot of windward sea cliffs
        const upland = L.rain > 0.55 && m > 300 && m < 900
        if (!upland && !(m > 3 && m < 80)) continue
        const ny = terrain.normalAt(x, z, nv).y
        if (upland && ny > 0.35 && ny < 0.7) cliffs.push(x, z, 1)
        else if (!upland && ny < 0.6) coast.push(x, z, 1)
      }
    }
    // a few clumps from a list of candidate spots, spread apart
    const clumps = (cands, n, apart, plant) => {
      const taken = []
      for (let k = 0; k < n * 12 && taken.length < n * 2; k++) {
        const q = Math.floor(rand() * (cands.length / 3)) * 3
        if (!cands.length || rand() >= cands[q + 2]) continue
        const x = cands[q]
        const z = cands[q + 1]
        let ok = true
        for (let t = 0; t < taken.length; t += 2) if (Math.hypot(taken[t] - x, taken[t + 1] - z) < apart) ok = false
        if (!ok) continue
        taken.push(x, z)
        plant(x, z)
      }
    }
    clumps(margin, 60, 1.5, (x, z) => {
      const nm = 3 + Math.floor(rand() * 4)
      const nk = 2 + Math.floor(rand() * 3)
      for (let k = 0; k < nm + nk; k++) {
        const a = rand() * TAU
        const r = rand() * 0.1
        const px = x + Math.cos(a) * r
        const pz = z + Math.sin(a) * r
        if (!this.isCleared(px, pz)) add(k < nm ? 'maia' : 'ki', px, pz, k < nm ? 1 : 0.9, 0.005)
      }
    })
    const loulu = (x, z) => {
      const n = 3 + Math.floor(rand() * 5)
      for (let k = 0; k < n; k++) {
        const a = rand() * TAU
        const r = rand() * 0.15
        const px = x + Math.cos(a) * r
        const pz = z + Math.sin(a) * r
        if (terrain.normalAt(px, pz, nv).y >= 0.3 && !this.isCleared(px, pz)) add('loulu', px, pz, 0.9)
      }
    }
    clumps(cliffs, 30, 3, loulu)
    clumps(coast, 8, 3, loulu)
    return out
  }

  // A forest tile's trees: deterministic per tile, ~one candidate every 17 m,
  // packed straight into instance matrices and colours, species by species.
  // `census` (optional, for checking the mix) tallies [zone][kind], zones
  // numbered 0 G cloud forest, 1 G′ bog, 2 B leeward dry, 3 D1 valley floor,
  // 4 D2 gulch or steep, 5 D3 fallow, 6 C mesic, 7 F wet ridge, 8 F wet forest,
  // kinds as FOREST_KINDS then 11 dry-form ʻōhiʻa and 12 ʻōlapa.
  buildTile(ti, tj, census) {
    const { terrain } = this.app
    const n = Math.round(FOREST_T / 0.17)
    const step = FOREST_T / n
    const pend = this.pending
    for (let k = 0; k < NK; k++) pend[k].length = 0
    const w = this.w
    const tint = this.tint
    const nv = this.nv
    let y0 = Infinity
    let y1 = -Infinity
    let total = 0
    for (let a = 0; a < n; a++) {
      for (let b = 0; b < n; b++) {
        const gi = ti * n + a
        const gj = tj * n + b
        const h1 = hash2(gi, gj, 11)
        const h2 = hash2(gi, gj, 12)
        const x = (gi + h1) * step
        const z = (gj + h2) * step
        const L = this.landInto(x, z, this.L)
        if (!L || L.sand > 0.2 || L.field > 0.3 || this.isCleared(x, z)) continue
        const m = terrain.metresAt(x, z)
        if (m < 3) continue
        // (no trunk in a stream's water)
        const bank = this.bankAt(x, z)
        if (bank < 0.008) continue
        const ny = terrain.normalAt(x, z, nv).y
        const r = L.rain + (hash2(gi, gj, 3) - 0.5) * 0.12
        const tpi = this.tpiAt(x, z)
        // ʻōhiʻa ʻai grows in almost pure groves (L&S), a couple of hundred
        // metres across, and kukui and hala thin out in them; kukui itself
        // comes in big pale groves on the walls, with hala and the rest between
        const ag = aiGrove(x, z)
        const kp = kukuiPatch(x, z)
        const windward = r - (0.22 + 0.00043 * m) // + wetter than the island's median at this height
        // the kula: the field systems and the dry ground round them
        const kula = sm(420, 260, this.dFieldAt(x, z))
        // landform (a valley floor is the spec's test, or flat ground low in its
        // surroundings with water through it: the loʻi floors, whose blurred
        // drainage is only ~0.3, which the spec's test alone reads as gulch)
        const flat = sm(0.94, 0.965, ny) * (1 - sm(-26, -16, tpi)) * sm(0.12, 0.2, L.rip)
        const floor = Math.max(sm(0.55, 0.8, L.rip) * sm(0.82, 0.92, ny) * (1 - sm(-5, 15, tpi)), flat)
        const gulch = Math.max(sm(0.1, 0.3, L.rip) * (1 - floor), sm(25, 60, -tpi))
        const ridge = sm(20, 60, tpi) * (1 - sm(0.05, 0.2, L.rip))
        const steep = 1 - sm(0.55, 0.75, ny)
        // the farmed lowland c. 1700: altered below ~460 m, untouched only
        // above ~760 m (Kirch, via Cuddihy & Stone)
        const cult = 1 - sm(420, 760, m + (hash2(gi, gj, 20) - 0.5) * 120)
        // species range limits (Little & Skolmen)
        // (kukui fades out toward its wet limit on the land's own rain, not the
        // per-tree jitter, which would carry it on to ~5,800 mm)
        const kuk = OK(m < 670 && r > R1075) * (1 - sm(450, 670, m)) * (1 - sm(R4000 - 0.04, R4000 + 0.02, L.rain)) // kukui: gone by 670 m and 4,000 mm
        // hala: windward lowland to 610 m, and the coast below 150 m, but never
        // the dry leeward coast (where the rain's jitter alone would carry it)
        const ww0 = L.rain - (0.22 + 0.00043 * m)
        const hal = OK(m < 610 && (windward > -0.05 || m < 150) && (m > 150 || ww0 >= 0))
        // ʻōhiʻa ʻai: moist valleys and gorges to 550 m, in groves, and off their cliffs
        const ai = OK(m < 550 && r > R1500) * sm(0.42, 0.5, ny) * (floor > 0.5 ? 0.8 + 4 * ag : 0.05 + 7 * ag)
        // hau: thickets right along the streams, below ~450 m (on a valley
        // floor a little further out, over the old loʻi as at Kahana)
        const hau = OK(m < 450) * (1 - (floor > 0.5 ? sm(0.1, 0.28, bank) : sm(0.05, 0.2, bank)))
        const kca = OK(m > 250) // koa: off the coastal plain
        // below ~360 m the hollows and floors were farmed: ʻōhiʻa lehua keeps
        // to the crests there, away from the gardens (Macrae met it only up
        // the valley)
        const crest = Math.max(sm(0, 30, tpi) * sm(40, 90, this.dCultAt(x, z)), sm(360, 480, m))
        const wild = this.wildAt(x, z, m)
        w.fill(0)
        let s = 1
        let p = 0
        let zone = 0
        if (wild > hash2(gi, gj, 24)) {
          // round a hero fall, the spray keeps the forest wild: ʻōhiʻa, low
          // and mossy on the steep ground, over hāpuʻu (no planted groves)
          zone = ridge > 0.5 || steep > 0.5 ? 7 : 8
          p = 0.7
          w[K.ohia] = 50
          w[K.ohiaKrumm] = 20 + 40 * Math.max(steep, ridge)
          if (zone === 7) s = 0.5 + 0.3 * hash2(gi, gj, 14)
        } else if (m > 1150 + 150 * hash2(gi, gj, 21)) {
          // G: cloud forest and summit bogs
          if (m > 1350 && ny > 0.97 && r > 0.85) {
            zone = 1
            p = 0.1
            w[K.ohiaKrumm] = 1
            s = 0.3 + 0.15 * hash2(gi, gj, 14)
          } else {
            p = 0.95
            w[K.ohiaKrumm] = 65
            w[K.olapa] = 28
            w[K.ohia] = 7 * OK(tpi < -20)
            // (low and closed: the shrub form only on the steep faces, and on
            // the summit's ridges, which on a dome are most of it, the
            // cloud-forest size from the spec's sheet, a little under the
            // sheltered ground's)
            s = steep > 0.5 ? 0.5 + 0.25 * hash2(gi, gj, 14) : ridge > 0.5 ? 0.8 + 0.3 * hash2(gi, gj, 14) : 1.0 + 0.35 * hash2(gi, gj, 14)
          }
        } else if (r < R1250 ? windward < 0.03 || kula > hash2(gi, gj, 23) : L.rain < R1500 && m < 760 && floor < 0.5 && bank > 0.2 && kula > hash2(gi, gj, 23)) {
          // B: leeward dry lowland, and the kula — the field systems and the
          // ground round them, where rain is too scarce for loʻi, even where
          // it runs a little wetter than the middle for its height (but not
          // down on a valley floor or a stream's banks); trees on rocky
          // ground and in gulches, pili between
          zone = 2
          p = (0.07 + 0.35 * gulch + 0.25 * steep) * (1 - L.field)
          if (m < 600) {
            w[K.aalii] = 35
            // (wiliwili keeps off the windward side, but on the kula it holds
            // the rocky gulches wherever the land is dry enough, below about
            // 1,050 mm, even where that runs a little wetter than the middle
            // for its height: its range is set by dryness)
            w[K.wiliwili] = 25 * OK(L.rain < R1250 + 0.04) * OK(windward < 0 || (kula > 0.5 && L.rain < R1000 + 0.02 && ww0 < 0.055))
            w[K.lama] = 25
            // (on the kula's moister edge, the ʻōhiʻa is the smooth-leaved
            // mesic form, and only on the crests above the coastal plain)
            if (L.rain < R1250 + 0.05) w[K.ohiaDry] = 15
            else w[K.ohia] = 15 * OK(m > 150) * crest
          } else {
            w[K.lama] = 35
            w[K.aalii] = 20
            w[L.rain < R1250 + 0.05 ? K.ohiaDry : K.ohia] = 35
            w[K.koa] = 10 * OK(r > R1000 && r < R1250)
          }
        } else if (cult > hash2(gi, gj, 22)) {
          // D: the farmed lowland (windward, the windward coast, and moist
          // leeward ground below the forest)
          if (floor > 0.5) {
            zone = 3
            p = 0.55
            w[K.ohiaai] = 40 * ai
            w[K.hau] = 60 * hau
            w[K.kukui] = 25 * kuk * (1 - 0.9 * ag)
            // (a few hala among them, but not alone: a floor too dry for the
            // rest lies open round its loʻi)
            w[K.hala] = 5 * hal * Math.min(1, (w[K.ohiaai] + w[K.hau] + w[K.kukui]) / 40)
          } else if (gulch > 0.4 || steep > 0.4) {
            zone = 4
            p = 0.85
            w[K.kukui] = 70 * kuk * (0.2 + 0.8 * kp) * (1 - 0.9 * ag)
            w[K.hala] = 15 * hal * (1 - 0.7 * ag)
            w[K.ohiaai] = 10 * ai
            // (and hau where a stream runs down the gulch: the valley-floor
            // rule alone leaves it almost nowhere, as most floors are loʻi)
            w[K.hau] = 60 * hau
            // (lama only on the leeward side of the farmed band, never the windward coast)
            w[K.lama] = 15 * OK(r < R1500 && windward < 0)
            // (ʻōhiʻa, and the stunted form on the steep walls, take over where
            // it grows too wet for kukui or too high, never where too dry)
            w[K.ohia] = (5 + 45 * (1 - kuk) * OK(r > R1075)) * OK(m > 150) * crest
            w[K.ohiaKrumm] = 10 * (1 - kuk) * OK(r >= R2500) * steep
          } else {
            // fallow grass and fern, with groves — giving way, as the gardens
            // thin out above ~460 m, to the transition forest under the cloud:
            // ʻōhiʻa with koa, closing to the spec's density of 0.8 by ~640 m
            zone = 5
            const up = sm(460, 640, m)
            p = 0.3 + 0.5 * up
            if (ridge > 0.5) {
              w[K.ohia] = 60 * OK(m > 150)
              w[K.koa] = 20 * kca
              w[K.hala] = 20 * hal * (1 - up)
            } else {
              w[K.kukui] = 45 * kuk * (0.1 + 0.9 * kp) * (1 - 0.9 * ag)
              w[K.hala] = 35 * hal * (1 - 0.7 * ag) * (1 - 0.85 * up)
              w[K.ohiaai] = 10 * ai
              w[K.hau] = 60 * hau
              w[K.ohia] = (10 + 50 * up) * OK(m > 150) * crest
              w[K.koa] = (10 + 5 * up) * kca
            }
          }
        } else if (r < R2500) {
          // C: mesic forest above the farmed band
          zone = 6
          p = m < 760 ? 0.55 : 0.85
          w[K.ohia] = 45
          w[K.koa] = 30 * OK(m > 300)
          w[K.lama] = 15
          w[K.aalii] = 5
          w[K.kukui] = 10 * kuk * OK(gulch > 0.5)
        } else if (ridge > 0.5 || steep > 0.5) {
          // F: wet forest, ridges and steep faces: open stunted ʻōhiʻa over uluhe
          zone = 7
          p = 0.6
          w[K.ohiaKrumm] = 50
          w[K.ohia] = 50
          s = 0.5 + 0.3 * hash2(gi, gj, 14)
        } else {
          // F: wet forest, closed canopy
          zone = 8
          p = 0.95
          w[K.ohia] = 78
          w[K.koa] = 10 * OK(r < R5000 && ny > 0.8)
          w[K.olapa] = 10
          w[K.kukui] = 2 * kuk * OK(gulch > 0.5)
        }
        let kind = hash2(gi, gj, 13) < p ? chooseW(hash2(gi, gj, 7), w) : -1
        // the strand itself, below ~15 m, is planted (niu, milo and hala along
        // the shore, hau at the stream mouths): few wild hala crowd it
        if (kind === K.hala && hash2(gi, gj, 25) > 0.25 + 0.75 * sm(8, 18, m)) kind = -1
        // the pseudo-kinds pick a geometry and a tint
        let tinted = null
        let ck = kind
        if (kind === K.ohiaDry) {
          kind = K.ohia
          tinted = OHIA_DRY
          s = 0.55 + 0.3 * hash2(gi, gj, 14) // scattered and shorter
        } else if (kind === K.olapa) {
          kind = K.ohiaKrumm
          tinted = OLAPA
          s = Math.max(s, 0.6 + 0.2 * hash2(gi, gj, 14))
        } else if (kind === K.ohia) {
          if (r >= R2500) tinted = OHIA_WET
          else {
            // mesic: the leaves go from hairy grey to smooth olive as the rain rises
            const t = Math.min(1, Math.max(0, (r - 0.4) / 0.18))
            for (let c = 0; c < 3; c++) tint[c] = Math.exp(Math.log(OHIA_DRY[c]) * (1 - t) + Math.log(OHIA_WET[c]) * t)
            tinted = tint
            if (s === 1) s = 0.7 + 0.4 * hash2(gi, gj, 14)
          }
        } else if (kind === K.ohiaKrumm) tinted = OHIA_K
        else if (kind === K.lama && hash2(gi, gj, 16) < 0.1) tinted = ILIAHI
        if (kind === K.kukui && floor > 0.5) s = 1.15 + 0.2 * hash2(gi, gj, 14) // largest on narrow valley floors (L&S)
        if (kind === K.ohiaai && ag > 0.3) s = 1 + 0.3 * ag // (and a grove's crowns close up)
        // a wet wall above the gardens that is steep but no cliff, and off the
        // exposed crests, carries tall ʻōhiʻa over its fern, as the windward
        // valley walls do: only the cliffs and the ridges keep the stunted form
        // (not round a hero fall, whose spray keeps its walls low and mossy)
        const wall = kind === K.ohia && zone !== 0 && wild <= hash2(gi, gj, 24) && ny >= 0.35 && ny < 0.65 && r >= R2500 && m > 460 && ridge < 0.5
        if (wall) s = 0.7 + 0.3 * hash2(gi, gj, 14)
        // pali: keep few trees, and the stunted form on the steepest ground —
        // the wet side's mossy one; on drier ground the ʻōhiʻa stays itself,
        // only shorter
        if (kind >= 0 && ny < 0.35 && hash2(gi, gj, 5) < 0.7) kind = -1
        if (kind === K.ohia && ny < 0.5 && !wall) {
          if (r >= R1500 && tinted !== OHIA_DRY) {
            kind = ck = K.ohiaKrumm
            tinted = OHIA_K
          }
          s = 0.5
        }
        if (kind < 0) continue
        const y = this.groundY(x, z)
        const rot = kind === K.ohiaKrumm ? this.leeRot + (h1 - 0.5) * 1.2 : h1 * TAU
        this.emit(kind, x, y, z, rot, S * (s === 1 ? 0.75 + 0.6 * h2 : s * (0.92 + 0.16 * h2)), 0.82 + 0.35 * hash2(gi, gj, 15), hash2(gi, gj, 17), tinted)
        total++
        y0 = Math.min(y0, y)
        y1 = Math.max(y1, y)
        if (census) census[zone][ck]++
        // understorey: hāpuʻu between the canopy trees, in mesic to wet forest
        // from 250 to 1,700 m, out of the farmed band
        // (none in the summit bogs; p 0.25 in the cloud forest, thinning out
        // by 1,650 m; and in the wet forest kept wild round a hero fall)
        // (and only under a canopy: not beside a lone tree on open fallow or a
        // thinly treed face, where it would stand in the sun on the grass —
        // the forest's density is its cover, near enough)
        if (zone !== 1 && r >= R1500 && m > 250 && m < 1700 && (cult < 0.5 || zone >= 7) && (kind === K.ohia || kind === K.koa || kind === K.ohiaKrumm)) {
          const ph = (zone === 0 ? 0.25 * (1 - sm(1500, 1650, m)) : Math.min(0.65, 0.15 + 0.5 * sm(R1900, R4000, r)) * (1 - 0.7 * ridge)) * sm(0.4, 0.7, p) * (ny < 0.35 ? 0.4 : 1)
          const hx = x + (hash2(gi, gj, 31) - 0.5) * step
          const hz = z + (hash2(gi, gj, 32) - 0.5) * step
          if (hash2(gi, gj, 30) < ph && !this.isCleared(hx, hz) && this.bankAt(hx, hz) > 0.008) {
            const hy = this.groundY(hx, hz)
            this.emit(K.hapuu, hx, hy, hz, hash2(gi, gj, 34) * TAU, S * (0.7 + 0.5 * hash2(gi, gj, 33)), 0.85 + 0.3 * hash2(gi, gj, 35), 0.5, null)
            total++
            y0 = Math.min(y0, hy)
            if (census) census[zone][K.hapuu]++
          }
        }
      }
    }
    // pack the species one after another, with each one's offset
    const off = new Uint32Array(NK + 1)
    const mat = new Float32Array(total * 16)
    const colr = new Float32Array(total * 3)
    let i = 0
    for (let k = 0; k < NK; k++) {
      off[k] = i
      const t = pend[k]
      for (let q = 0; q < t.length; q += 9) {
        const cs = Math.cos(t[q + 3]) * t[q + 4]
        const sn = Math.sin(t[q + 3]) * t[q + 4]
        // rotation about y, uniform scale, translation (column-major)
        const o = i * 16
        mat[o] = cs
        mat[o + 2] = -sn
        mat[o + 5] = t[q + 4]
        mat[o + 8] = sn
        mat[o + 10] = cs
        mat[o + 12] = t[q]
        mat[o + 13] = t[q + 1]
        mat[o + 14] = t[q + 2]
        mat[o + 15] = 1
        colr[i * 3] = t[q + 5]
        colr[i * 3 + 1] = t[q + 6]
        colr[i * 3 + 2] = t[q + 7]
        i++
      }
    }
    off[NK] = i
    const x0 = ti * FOREST_T
    const z0 = tj * FOREST_T
    // the widest crowns (koa) reach ~0.22 units out from the trunk and the
    // tallest ~0.42 up, and they sway a little
    const box = total ? new THREE.Box3(new THREE.Vector3(x0 - 0.24, y0, z0 - 0.24), new THREE.Vector3(x0 + FOREST_T + 0.24, y1 + 0.45, z0 + FOREST_T + 0.24)) : null
    return { off, mat, col: colr, box, total }
  }

  /**
   * Where a trunk stands: on the ground as the terrain draws it nearby (its
   * finest mesh), not the smooth height between its vertices, which on a
   * steep wall can leave a tree a few metres in the air or buried.
   */
  groundY(x, z) {
    const T = this.app.terrain
    return T.heights ? drawnMetres(T.heights, T.N, x, z) * Y_PER_M : T.heightAt(x, z)
  }

  /** Queue one instance: position, rotation, scale and tinted colour. */
  emit(kind, x, y, z, rot, scale, c, v, tinted) {
    const t = this.pending[kind]
    const tr = tinted ? tinted[0] : 1
    const tg = tinted ? tinted[1] : 1
    const tb = tinted ? tinted[2] : 1
    t.push(x, y, z, rot, scale, c * tr, c * (0.96 + 0.08 * v) * tg, c * tb, 0)
  }

  update(camera) {
    this.season()
    // the forest only matters within ~13 units of the camera
    const p = camera.position
    const ground = Math.max(0, this.app.terrain.heightAt(p.x, p.z))
    const alt = p.y - ground
    const show = alt < 14
    this.group.visible = alt < 60
    // the planted trees past the fade distance draw nothing: leave them out
    // of the buffers (refilled once the camera has moved a couple of units)
    if (this.group.visible && Math.max(Math.abs(p.x - this.fixedAt[0]), Math.abs(p.z - this.fixedAt[1])) > 2) {
      this.fixedAt[0] = p.x
      this.fixedAt[1] = p.z
      this.fillFixed(p.x, p.z)
    }
    if (!show) {
      for (let k = 0; k < NK; k++) {
        this.forest.near[k].visible = false
        if (this.forest.far[k]) this.forest.far[k].visible = false
      }
      this.selCount = -1
      return
    }

    camera.updateMatrixWorld()
    this.projView.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)
    this.frustum.setFromProjectionMatrix(this.projView)
    // which tiles are in view, and at which level of detail
    const R = FOREST_R
    const i0 = Math.floor((p.x - R) / FOREST_T)
    const i1 = Math.floor((p.x + R) / FOREST_T)
    const j0 = Math.floor((p.z - R) / FOREST_T)
    const j1 = Math.floor((p.z + R) / FOREST_T)
    const near = this.near
    const far = this.far
    const missing = this.missing
    near.length = 0
    far.length = 0
    missing.length = 0
    let hash = 0x811c9dc5
    let count = 0
    for (let i = i0; i <= i1; i++) {
      for (let j = j0; j <= j1; j++) {
        const x0 = i * FOREST_T
        const z0 = j * FOREST_T
        const dx = Math.max(x0 - p.x, 0, p.x - x0 - FOREST_T)
        const dz = Math.max(z0 - p.z, 0, p.z - z0 - FOREST_T)
        const dNear = Math.hypot(dx, dz)
        if (dNear > R) continue
        const key = i * 8192 + j
        const t = this.tiles.get(key)
        if (!t) {
          missing.push(dNear, i, j)
          continue
        }
        if (!t.box || !this.frustum.intersectsBox(t.box)) continue
        t.d = dNear
        // (the levels of detail fade by distance in 3D, so the camera's height
        // over the tile counts too: from high above, the trees at its foot are
        // past the near band and belong to the far one)
        const dy = Math.max(t.box.min.y - p.y, 0, p.y - t.box.max.y)
        const dyF = Math.max(Math.abs(t.box.min.y - p.y), Math.abs(t.box.max.y - p.y))
        const dFar = Math.hypot(Math.max(Math.abs(x0 - p.x), Math.abs(x0 + FOREST_T - p.x)), Math.max(Math.abs(z0 - p.z), Math.abs(z0 + FOREST_T - p.z)), dyF)
        const n = Math.hypot(dNear, dy) < FOREST_LOD[1] + 0.3
        const f = dFar > FOREST_LOD[0] - 0.3
        if (n) near.push(t)
        if (f) far.push(t)
        hash = Math.imul(hash ^ (key * 4 + (n ? 1 : 0) + (f ? 2 : 0)), 16777619)
        count++
      }
    }
    // grow a few missing tiles a frame, nearest first, so arriving somewhere
    // never stalls a frame
    for (let k = 0; k < 10; k++) {
      let best = -1
      for (let q = 0; q < missing.length; q += 3) if (missing[q] !== Infinity && (best < 0 || missing[q] < missing[best])) best = q
      if (best < 0) break
      const i = missing[best + 1]
      const j = missing[best + 2]
      this.tiles.set(i * 8192 + j, this.buildTile(i, j))
      missing[best] = Infinity
    }
    if (this.tiles.size > 3000) {
      // forget tiles far behind us
      for (const [key] of this.tiles) {
        const i = Math.floor(key / 8192 + 0.5)
        const j = key - i * 8192
        if (Math.hypot((i + 0.5) * FOREST_T - p.x, (j + 0.5) * FOREST_T - p.z) > R * 3) this.tiles.delete(key)
      }
    }
    // (the tiles life.js and waterfalls.js clear get rebuilt: they reset lastSelection)
    if (hash === this.selHash && count === this.selCount && this.lastSelection !== '') return
    this.selHash = hash
    this.selCount = count
    this.lastSelection = 'filled'
    // nearest first, so a species that fills its buffer drops its farthest
    // trees rather than a wedge on one side (in place: a few hundred tiles)
    byDistance(near)
    byDistance(far)
    this.fill(this.forest.near, near)
    this.fill(this.forest.far, far)
  }

  /** Copy the planted trees within reach of (px, pz) into their draw buffers. */
  fillFixed(px, pz) {
    const R2 = FIXED_R * FIXED_R
    for (const k in this.meshes) {
      const mesh = this.meshes[k]
      const A = this.fixedAll[k]
      const M = mesh.instanceMatrix.array
      const C = mesh.instanceColor.array
      let n = 0
      for (let i = 0; i < A.xz.length / 2; i++) {
        const dx = A.xz[i * 2] - px
        const dz = A.xz[i * 2 + 1] - pz
        if (dx * dx + dz * dz > R2) continue
        for (let e = 0; e < 16; e++) M[n * 16 + e] = A.mat[i * 16 + e]
        for (let e = 0; e < 3; e++) C[n * 3 + e] = A.col[i * 3 + e]
        n++
      }
      mesh.count = n
      mesh.visible = n > 0
      if (!n) continue
      mesh.instanceMatrix.clearUpdateRanges()
      mesh.instanceMatrix.addUpdateRange(0, n * 16)
      mesh.instanceMatrix.needsUpdate = true
      mesh.instanceColor.clearUpdateRanges()
      mesh.instanceColor.addUpdateRange(0, n * 3)
      mesh.instanceColor.needsUpdate = true
    }
  }

  /** Copy the chosen tiles' prebuilt instances into each species' buffers. */
  fill(meshes, tiles) {
    for (let k = 0; k < NK; k++) {
      const mesh = meshes[k]
      if (!mesh) continue
      const cap = mesh.instanceMatrix.count
      const M = mesh.instanceMatrix.array
      const C = mesh.instanceColor.array
      let n = 0
      for (let q = 0; q < tiles.length && n < cap; q++) {
        const t = tiles[q]
        const s = t.off[k]
        const take = Math.min(t.off[k + 1] - s, cap - n)
        for (let e = 0; e < take * 16; e++) M[n * 16 + e] = t.mat[s * 16 + e]
        for (let e = 0; e < take * 3; e++) C[n * 3 + e] = t.col[s * 3 + e]
        n += take
      }
      mesh.count = n
      mesh.visible = n > 0
      if (!n) continue
      const A = mesh.instanceMatrix
      A.clearUpdateRanges()
      A.addUpdateRange(0, n * 16)
      A.needsUpdate = true
      const B = mesh.instanceColor
      B.clearUpdateRanges()
      B.addUpdateRange(0, n * 3)
      B.needsUpdate = true
    }
  }
}
