// The world round the battlefield (DESIGN's "Battlefield dressing", S1):
// the ground from the mat's edge out to the haze, painted with the fields,
// hedgerows and the cart track place.js laid out, rolling into hills; the
// mat's edge, a band of trodden earth with a dark cut line, and the
// boundary stakes, each pennant in its seat's colour; the trees, broadleaf
// and pine; and the long grass off the mat. Nothing here is on the mat,
// and nothing casts a shadow.
//
// (S3) The lanes' roads off the mat; (S4) the works and their yards, a
// burned field's scorch past the mat's edge and its scorched trees.
// (Rule 3) The ground's colour is calmed with distance (its shader), so the
// mat stays the liveliest ground on screen.
//
// Draw calls: the ground 1, the edge with its stakes and the long grass 1,
// the trees 2, the works 1.
import * as THREE from 'three'
import { lift, outside, stream, noise, LANDMARKS } from './place.js'
import { worksGeometry } from './works.js'

const C = (hex) => new THREE.Color(hex)
// a geometry's triangles without the degenerate ones (a cone's tip is a
// row of them: three.js builds it as a cylinder of no top radius, and the
// renderer counts every one), non-indexed
export function lean(g0) {
  const g = g0.index ? g0.toNonIndexed() : g0, a = g.attributes.position, keep = []
  const p = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()], e1 = new THREE.Vector3(), e2 = new THREE.Vector3()
  for (let i = 0; i < a.count; i += 3) {
    for (let j = 0; j < 3; j++) p[j].fromBufferAttribute(a, i + j)
    if (e1.subVectors(p[1], p[0]).cross(e2.subVectors(p[2], p[0])).lengthSq() > 1e-12) keep.push(i, i + 1, i + 2)
  }
  const out = new THREE.BufferGeometry()
  for (const [name, attr] of Object.entries(g.attributes)) {
    const n = attr.itemSize, arr = new Float32Array(keep.length * n)
    keep.forEach((v, k) => {
      for (let c = 0; c < n; c++) arr[k * n + c] = attr.array[v * n + c]
    })
    out.setAttribute(name, new THREE.BufferAttribute(arr, n))
  }
  return out
}
// (the crops kept below the mat's own green in strength: the ground's
// shader takes more of their colour away with distance, Surround's calm)
const FIELDS = {
  pasture: ['#5f7a3c', '#587238'],
  meadow: ['#68803f', '#728a48'],
  wheat: ['#a39a62', '#ada46c'],
  barley: ['#949658', '#9da062'],
  plough: ['#685a44', '#5c4f3a'],
  fallow: ['#767a4c', '#6c7046'],
  charred: ['#3a3328', '#2a2620'],
  singed: ['#6e6448', '#5e5640'],
}

// the fields' paint: `T` tails either side of the board's centre on a
// 1024 px canvas, the ring beyond it the edge's colour
function paintFields(p, T, seed) {
  const c = document.createElement('canvas')
  c.width = c.height = 1024
  const g = c.getContext('2d')
  const px = 1024 / (2 * T), at = (x) => (x + T) * px
  g.fillStyle = '#5b7a36'
  g.fillRect(0, 0, 1024, 1024)
  const r = stream(seed, 'paint')
  // big soft patches first: drier and lusher ground
  for (let i = 0; i < 260; i++) {
    g.globalAlpha = 0.18
    g.fillStyle = ['#6a8a40', '#4f6c2c', '#7a8a46', '#55742f'][i % 4]
    g.beginPath()
    g.ellipse(r() * 1024, r() * 1024, 20 + r() * 70, 14 + r() * 50, r() * 3, 0, Math.PI * 2)
    g.fill()
  }
  for (const f of p.fields) {
    const cols = FIELDS[f.kind]
    g.save()
    g.translate(at(f.x), at(f.z))
    g.rotate(f.yaw)
    const w = f.w * px, d = f.d * px
    g.globalAlpha = 0.85
    g.fillStyle = cols[0]
    g.fillRect(-w / 2, -d / 2, w, d)
    // its rows (ploughed and sown fields), or a mottle
    g.globalAlpha = f.kind === 'pasture' || f.kind === 'meadow' ? 0.25 : 0.45
    g.strokeStyle = cols[1]
    g.lineWidth = Math.max(1, px * 0.45)
    const across = f.rows < 0.5
    for (let t = -0.5; t <= 0.5; t += 0.9 / Math.max(4, (across ? w : d) / 2.2)) {
      g.beginPath()
      if (across) {
        g.moveTo(t * w, -d / 2)
        g.lineTo(t * w, d / 2)
      } else {
        g.moveTo(-w / 2, t * d)
        g.lineTo(w / 2, t * d)
      }
      g.stroke()
    }
    g.restore()
  }
  // the hedgerows: dark, broken lines along some sides of some fields
  g.globalAlpha = 0.8
  g.strokeStyle = '#2f4a22'
  g.lineCap = 'round'
  for (const h of p.hedgerows) {
    g.save()
    g.translate(at(h.x), at(h.z))
    g.rotate(h.yaw)
    g.lineWidth = Math.max(1.5, px * 1.1)
    const w = h.w * px, d = h.d * px
    const sides = [[-w / 2, -d / 2, w / 2, -d / 2], [w / 2, -d / 2, w / 2, d / 2], [w / 2, d / 2, -w / 2, d / 2], [-w / 2, d / 2, -w / 2, -d / 2]]
    sides.forEach(([a, b, c2, d2], i) => {
      if (!(h.sides & (1 << i))) return
      g.beginPath()
      g.moveTo(a, b)
      g.lineTo(c2, d2)
      g.stroke()
    })
    g.restore()
  }
  // the cart track: two ruts in a worn band
  const line = (width, colour, alpha) => {
    g.globalAlpha = alpha
    g.strokeStyle = colour
    g.lineWidth = width * px
    g.lineJoin = 'round'
    g.beginPath()
    p.track.forEach((q, i) => (i ? g.lineTo(at(q.x), at(q.z)) : g.moveTo(at(q.x), at(q.z))))
    g.stroke()
  }
  line(2.4, '#8a7650', 0.75)
  line(1.1, '#9a8660', 0.5)
  // (S3) the lanes off the mat: each army's road out from its edge into
  // the land it came from, and the spur from the mat to the cart track
  const way = (pts, width, colour, alpha) => {
    g.globalAlpha = alpha
    g.strokeStyle = colour
    g.lineWidth = width * px
    g.beginPath()
    pts.forEach(([x, z], i) => (i ? g.lineTo(at(x), at(z)) : g.moveTo(at(x), at(z))))
    g.stroke()
  }
  const k = p.k
  for (const rd of p.roads ?? []) {
    const pts = []
    if (rd.gate) {
      // (a keep's) out from the edge, round to the gatehouse, through it
      // and away beyond the wall
      const g0 = rd.gate, ox = rd.x + rd.sx * 4
      for (let i = 0; i <= 16; i++) {
        const t = i / 16, u = 1 - t
        pts.push([u * u * rd.x + 2 * u * t * ox + t * t * g0.x, u * u * rd.z + 2 * u * t * rd.z + t * t * g0.z])
      }
      for (let i = 1; i <= 12; i++) pts.push([g0.x + 3 * Math.sin(i / 3) * Math.min(1, i / 4), g0.z - i * 5 * k])
    } else {
      for (let i = 0; i <= 24; i++) {
        const d = (i / 24) * 70 * k
        pts.push([rd.x + rd.sx * d, rd.z + 4 * Math.sin(d / 17 + rd.z) * Math.min(1, d / 12)])
      }
    }
    way(pts, 1.9, '#8a7650', 0.7)
    way(pts, 0.8, '#9a8660', 0.45)
    rd.pts = pts
  }
  if (p.spur) {
    const tz = (x) => p.track.reduce((b, q) => (Math.abs(q.x - x) < Math.abs(b.x - x) ? q : b), p.track[0]).z
    const pts = [[p.spur.x, p.spur.z], [p.spur.x, (p.spur.z + tz(p.spur.x)) / 2], [p.spur.x + 1.5, tz(p.spur.x + 1.5)]]
    way(pts, 1.4, '#8a7650', 0.7)
  }
  // the near ground, round the mat: uncut meadow, paler and yellower than
  // the mat's turf, so the board reads as the mown field it is, its outer
  // edge ragged (blots of it thinning out, never a ruled line); and the
  // canvas's own edge, which the ground beyond it stretches
  const { W, H } = p
  const near = stream(seed, 'meadow')
  const round = (d) => {
    // a point d tails out from the mat's edge, anywhere round it
    const per = 2 * (W + H), u = near() * per
    if (u < W) return [u - W / 2, -(H / 2 + d)]
    if (u < W + H) return [W / 2 + d, u - W - H / 2]
    if (u < 2 * W + H) return [u - W - H - W / 2, H / 2 + d]
    return [-(W / 2 + d), u - 2 * W - H - H / 2]
  }
  g.globalAlpha = 1
  g.strokeStyle = '#5d7a3a'
  g.lineWidth = 12
  g.strokeRect(0, 0, 1024, 1024)
  const meadow = p.palette?.meadow ?? '#74813f'
  g.fillStyle = meadow
  g.fillRect(at(-W / 2 - 2), at(-H / 2 - 2), (W + 4) * px, (H + 4) * px)
  for (let i = 0; i < 70 * (W + H) / 68; i++) {
    const [x, z] = round(1.2 + 5.5 * Math.pow(near(), 1.4))
    g.globalAlpha = 0.3 + near() * 0.3
    g.beginPath()
    g.ellipse(at(x), at(z), (1 + near() * 2.4) * px, (0.8 + near() * 1.8) * px, near() * 3, 0, Math.PI * 2)
    g.fill()
  }
  // (S4) a burned field's scorch running on past the mat's edge: ash and
  // char in blots, thick by the mat and thinning out with distance and a
  // noise, so it grades away raggedly into singed, then whole, ground
  if (p.palette?.scorch) {
    const reach = 34 * k
    const cols = [p.palette.scorch, '#3a3328', p.palette.ash, '#4a4234', '#2a2520']
    for (let i = 0; i < 2600 * Math.min(2, k); i++) {
      const d = reach * Math.pow(near(), 1.7)
      const [x, z] = round(d)
      const keep = 1 - d / reach
      if (near() > keep * (0.55 + 0.6 * noise(seed, x / 9, z / 9))) continue
      g.globalAlpha = 0.16 + 0.3 * keep * near()
      g.fillStyle = cols[i % cols.length]
      g.beginPath()
      g.ellipse(at(x), at(z), (0.8 + near() * 3.2) * px, (0.6 + near() * 2.4) * px, near() * 3, 0, Math.PI * 2)
      g.fill()
    }
  }
  // (S4) the works' yards, trodden bare (a burned hamlet's, ash)
  for (const y of p.yards ?? []) {
    for (let i = 0; i < 3; i++) {
      g.globalAlpha = 0.25
      g.fillStyle = p.palette?.scorch ? '#3e3830' : '#8a7650'
      g.beginPath()
      g.ellipse(at(y.x), at(y.z), y.r * px * (1 - i * 0.25), y.r * px * (0.8 - i * 0.2), 0, 0, Math.PI * 2)
      g.fill()
    }
  }
  // (S3) the lanes again across the meadow, to the mat's edge
  for (const rd of p.roads ?? []) way(rd.gate ? rd.pts.slice(0, 6) : [[rd.x, rd.z], [rd.x + rd.sx * 6, rd.z + 4 * Math.sin(6 / 17 + rd.z) * 0.5]], 1.5, '#86704a', 0.75)
  if (p.spur) way([[p.spur.x, p.spur.z], [p.spur.x, p.spur.z + p.spur.sz * 6]], 1.2, '#86704a', 0.75)
  g.globalAlpha = 1
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

// a grain tile (hashed, as the mat's detail): blades light and dark
function paintGrain() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')
  g.fillStyle = '#808080'
  g.fillRect(0, 0, 128, 128)
  const r = stream(0x6ea1, 'grain')
  for (let i = 0; i < 900; i++) {
    const v = r() < 0.5 ? 70 + r() * 30 : 160 + r() * 40
    g.globalAlpha = 0.5
    g.fillStyle = `rgb(${v},${v},${v})`
    g.fillRect(r() * 128, r() * 128, 1.2, 2 + r() * 3)
  }
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  return t
}

// The ground: rings round the mat's rectangle, each as many points round,
// fine by the mat and coarse far out, out to `E` (past the haze), each
// point lifted (place.js lift); the mat's own rectangle left open.
function groundGeometry(W, H, E, seed, T) {
  const nW = 28, nH = 20, P = 2 * (nW + nH)
  const rings = [0, 0.5, 1.2, 2.2, 3.5, 5, 7, 9.5, 12.5, 16, 20, 25, 31, 38, 46, 56, 68, 82, 98, 118, 142, 170, 205, 245, 290, 340, 400].filter((d) => d < E)
  rings.push(E)
  const pos = [], uv = [], idx = []
  for (const d of rings) {
    const hx = W / 2 + d, hz = H / 2 + d
    for (let i = 0; i < P; i++) {
      let x, z
      if (i < nW) [x, z] = [-hx + (2 * hx * i) / nW, -hz]
      else if (i < nW + nH) [x, z] = [hx, -hz + (2 * hz * (i - nW)) / nH]
      else if (i < 2 * nW + nH) [x, z] = [hx - (2 * hx * (i - nW - nH)) / nW, hz]
      else [x, z] = [-hx, hz - (2 * hz * (i - 2 * nW - nH)) / nH]
      pos.push(x, d === 0 ? -0.004 : lift(seed, W, H, x, z) - 0.004, z)
      uv.push((x + T) / (2 * T), 1 - (z + T) / (2 * T))
    }
  }
  for (let r = 0; r < rings.length - 1; r++) {
    for (let i = 0; i < P; i++) {
      const a = r * P + i, b = r * P + ((i + 1) % P), c = a + P, d = b + P
      idx.push(a, b, c, b, d, c)
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
  g.setIndex(idx)
  g.computeVertexNormals()
  // (facing up: a ring's normal must point to the sky)
  if (g.attributes.normal.getY(P) < 0) {
    for (let i = 0; i < idx.length; i += 3) [idx[i + 1], idx[i + 2]] = [idx[i + 2], idx[i + 1]]
    g.setIndex(idx)
    g.computeVertexNormals()
  }
  return g
}

// The mat's edge, its stakes and the long grass, one mesh in vertex colours
// (`paint` recolours the pennants; the grass last, in its list's order, so
// the quality draws a share of it by the draw range). The trodden band
// round the mat is a strip whose width wanders round it (a noise along
// each side) and whose earth varies in tone, fading at its outer rim into
// the meadow, so from above it reads as trodden ground, not a frame; the
// dark cut line on the mat's very edge stays crisp, as the rules need it.
function edgeGeometry(p, seed) {
  const { W, H } = p
  const parts = []
  const band = (x0, z0, x1, z1, y, colour) => {
    const g = new THREE.PlaneGeometry(x1 - x0, z1 - z0).rotateX(-Math.PI / 2).translate((x0 + x1) / 2, y, (z0 + z1) / 2)
    parts.push([g, colour])
  }
  const B = 0.55, L = 0.07
  const strip = { pos: [], col: [] }, c0 = new THREE.Color(), earth = ['#7e6a46', '#6e5c3c', '#857250', '#74643f']
  const meadow = new THREE.Color(p.palette?.meadow ?? '#74813f')
  // one side: from (x0, z0) to (x1, z1), outward normal (nx, nz)
  const side = (x0, z0, x1, z1, nx, nz, salt, y) => {
    const len = Math.hypot(x1 - x0, z1 - z0), n = Math.max(2, Math.round(len / 0.4))
    const ring = []
    for (let i = 0; i <= n; i++) {
      const t = i / n, x = x0 + (x1 - x0) * t, z = z0 + (z1 - z0) * t
      const w = B * (0.3 + 1.05 * noise(seed ^ salt, (t * len) / 2.3, 0.5) + 0.35 * noise(seed ^ salt ^ 0x77, (t * len) / 0.7, 2.5))
      const e = c0.set(earth[Math.floor(noise(seed ^ salt ^ 0x3c, (t * len) / 1.1, 4.5) * earth.length) % earth.length]).clone()
      ring.push([[x, z, e, 1], [x + nx * w, z + nz * w, e.clone().lerp(meadow, 0.25), 0.9], [x + nx * w * 1.9, z + nz * w * 1.9, meadow, 0]])
    }
    for (let i = 0; i < n; i++) for (let j = 0; j < 2; j++) {
      const a = ring[i][j], b = ring[i + 1][j], c = ring[i][j + 1], d = ring[i + 1][j + 1]
      for (const v of [a, c, b, b, c, d]) {
        strip.pos.push(v[0], y, v[1])
        strip.col.push(v[2].r, v[2].g, v[2].b, v[3])
      }
    }
  }
  side(-W / 2 - B, -H / 2, W / 2 + B, -H / 2, 0, -1, 0x1a, 0.002)
  side(W / 2 + B, H / 2, -W / 2 - B, H / 2, 0, 1, 0x2b, 0.002)
  side(-W / 2, H / 2, -W / 2, -H / 2, -1, 0, 0x3c, 0.0024)
  side(W / 2, -H / 2, W / 2, H / 2, 1, 0, 0x4d, 0.0024)
  // the cut line on the mat's very edge
  band(-W / 2 - L, -H / 2 - L, W / 2 + L, -H / 2, 0.004, '#2c2418')
  band(-W / 2 - L, H / 2, W / 2 + L, H / 2 + L, 0.004, '#2c2418')
  band(-W / 2 - L, -H / 2, -W / 2, H / 2, 0.004, '#2c2418')
  band(W / 2, -H / 2, W / 2 + L, H / 2, 0.004, '#2c2418')
  const pennants = []
  for (const s of p.stakes) {
    const post = new THREE.CylinderGeometry(0.05, 0.07, s.h, 5).translate(s.x, s.h / 2, s.z)
    parts.push([post, '#5a3d24'])
    // the pennant, a triangle off the post's top, pointing away from the mat
    const out = Math.sign(s.z)
    const f = new THREE.BufferGeometry()
    f.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0, -0.34, 0, 0.62, -0.12, 0.05 * out], 3))
    f.translate(s.x, s.h - 0.04, s.z)
    f.computeVertexNormals()
    parts.push([f, '#e8e0d0', s.seat])
  }
  // merged, in colours (and alpha: the strip's rim fades)
  const pos = [...strip.pos], col = [...strip.col], c = new THREE.Color()
  const put = (g0, colour, seat) => {
    const g = g0.index ? g0.toNonIndexed() : g0
    if (seat !== undefined) pennants.push({ seat, from: pos.length / 3 })
    c.set(colour)
    const a = g.attributes.position
    for (let i = 0; i < a.count; i++) {
      pos.push(a.getX(i), a.getY(i), a.getZ(i))
      col.push(c.r, c.g, c.b, 1)
    }
  }
  for (const [g0, colour, seat] of parts) put(g0, colour, seat)
  const edge = pos.length / 3
  // the long grass off the mat, each blade in place
  const blade = lean(new THREE.ConeGeometry(0.035, 0.13, 3, 1, true))
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), v = new THREE.Vector3(), s3 = new THREE.Vector3()
  const tints = ['#8fae50', '#9cba5a', '#7f9a46', '#a8b860', '#b4b26a']
  for (const t of p.grass) {
    m4.compose(v.set(t.x, t.y + 0.065 * t.s, t.z), q.setFromEuler(e.set(t.tilt, t.yaw, t.tilt * 0.5)), s3.set(t.s, t.s * 1.3, t.s))
    put(blade.clone().applyMatrix4(m4), tints[Math.floor(t.tint * tints.length)])
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 4))
  g.computeVertexNormals()
  return { geometry: g, pennants, edge, blade: blade.attributes.position.count, grass: p.grass.length }
}

// a broadleaf tree and a pine, each one geometry in vertex colours
function treeGeometry(kind) {
  const parts = []
  if (kind === 'broad') {
    parts.push([new THREE.CylinderGeometry(0.16, 0.24, 2.4, 5, 1, true).translate(0, 1.2, 0), '#5a4028'])
    parts.push([new THREE.IcosahedronGeometry(1.25, 0).translate(0, 3.0, 0), '#4f7a34'])
    parts.push([new THREE.IcosahedronGeometry(0.9, 0).translate(0.55, 3.8, 0.2), '#5d8a3c'])
  } else {
    parts.push([new THREE.CylinderGeometry(0.12, 0.18, 1.2, 5, 1, true).translate(0, 0.6, 0), '#4e3824'])
    parts.push([new THREE.ConeGeometry(1.1, 2.6, 7, 1, true).translate(0, 2.2, 0), '#2f5530'])
    parts.push([new THREE.ConeGeometry(0.8, 2.0, 7, 1, true).translate(0, 3.5, 0), '#355d34'])
  }
  const pos = [], col = [], c = new THREE.Color()
  for (const [g0, colour] of parts) {
    const g = lean(g0)
    c.set(colour)
    const a = g.attributes.position
    for (let i = 0; i < a.count; i++) {
      pos.push(a.getX(i), a.getY(i), a.getZ(i))
      // a little darker low down: the canopy's shade
      const k = 0.78 + 0.22 * Math.min(1, a.getY(i) / 4)
      col.push(c.r * k, c.g * k, c.b * k)
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
  g.computeVertexNormals()
  return g
}

export class Surround {
  // `p` the plan (place.js), `seed` the dressing's, `colors` the seats'
  constructor(scene, renderer, p, seed) {
    this.scene = scene
    this.group = new THREE.Group()
    this.group.userData.dressing = true
    const { W, H, k } = p
    // the ground, past the haze's far edge (the stage's fog: 140 at classic,
    // scaled as the board is)
    const E = 165 * k, T = Math.max(W, H) / 2 + 70 * k
    this.fields = paintFields(p, T, seed)
    this.fields.anisotropy = renderer.capabilities.getMaxAnisotropy()
    const grain = paintGrain()
    const mat = new THREE.MeshStandardMaterial({ map: this.fields, roughness: 1 })
    // (rule 3: the surround below the mat's contrast) the ground's colour
    // calmed with distance from the mat: some of its saturation taken
    // away by the mat already, more farther out, and its tones drawn
    // toward one dull olive, so no crop outshouts the board
    const uniforms = {
      grain: { value: grain }, grainRepeat: { value: (2 * T) / 3 },
      matHalf: { value: new THREE.Vector2(W / 2, H / 2) }, calmFar: { value: 55 * k }, calm: { value: new THREE.Color('#646e46') },
    }
    mat.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms)
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec2 vGroundXZ;')
        .replace('#include <project_vertex>', '#include <project_vertex>\n\tvGroundXZ = (modelMatrix * vec4(transformed, 1.0)).xz;')
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', '#include <common>\nuniform sampler2D grain;\nuniform float grainRepeat;\nuniform vec2 matHalf;\nuniform float calmFar;\nuniform vec3 calm;\nvarying vec2 vGroundXZ;')
        .replace('#include <map_fragment>', `#include <map_fragment>
\t{
\t\tfloat f = smoothstep(1.0, calmFar, length(max(abs(vGroundXZ) - matHalf, 0.0)));
\t\tfloat l = dot(diffuseColor.rgb, vec3(0.299, 0.587, 0.114));
\t\tdiffuseColor.rgb = mix(diffuseColor.rgb, vec3(l), 0.2 + 0.35 * f);
\t\tdiffuseColor.rgb = mix(diffuseColor.rgb, calm, 0.12 + 0.33 * f);
\t}
\tdiffuseColor.rgb *= mix( vec3( 1.0 ), texture2D( grain, vMapUv * grainRepeat ).rgb * 2.0, 0.45 );`)
    }
    mat.customProgramCacheKey = () => 'tails-ground-grain-calm'
    this.grain = grain
    const ground = (this.ground = new THREE.Mesh(groundGeometry(W, H, E, seed, T), mat))
    ground.receiveShadow = true
    this.group.add(ground)

    // the edge, the stakes and the long grass
    const edge = (this.edgeParts = edgeGeometry(p, seed))
    this.pennants = edge.pennants
    // (transparent for the strip's fading rim, both sides for the pennants
    // and the grass, in one pass: three.js draws a transparent two-sided
    // material twice, back faces then front, unless told not to, and that
    // second call would double the mesh's triangles too)
    this.edge = new THREE.Mesh(edge.geometry, new THREE.MeshStandardMaterial({ vertexColors: true, transparent: true, forceSinglePass: true, roughness: 0.95, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 }))
    this.edge.receiveShadow = true
    this.group.add(this.edge)

    // the trees
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), v = new THREE.Vector3(), s3 = new THREE.Vector3(), col = new THREE.Color()
    this.trees = ['broad', 'pine'].map((kind) => {
      const list = p.trees.filter((t) => t.kind === kind)
      const mesh = new THREE.InstancedMesh(treeGeometry(kind), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, flatShading: true }), Math.max(1, list.length))
      list.forEach((t, i) => {
        m4.compose(v.set(t.x, t.y - 0.2, t.z), q.setFromEuler(e.set(0, t.yaw, 0)), s3.setScalar(t.s * 1.15))
        mesh.setMatrixAt(i, m4)
        // ((S4) round a burned field, the near trees burned black, those
        // beyond them scorched brown, grading out to green with distance)
        const burnt = p.theme === 'burned' ? 1 - Math.min(1, Math.max(0, (outside(W, H, t.x, t.z) - 22 * k) / (34 * k))) - 0.25 * t.tint : 0
        // (the instance colour multiplies the tree's own greens: a strong
        // red and a weak green turn the canopy brown, and dark, black)
        if (burnt > 0.55) col.setRGB(0.95, 0.34, 0.4)
        else if (burnt > 0.1) col.setRGB(1.9, 0.85, 0.55).lerp(col.clone().setRGB(0.95, 0.34, 0.4), burnt)
        else col.setHSL(0, 0, 0.82 + t.tint * 0.3)
        mesh.setColorAt(i, col)
      })
      mesh.count = list.length
      mesh.full = list.length
      this.group.add(mesh)
      return mesh
    })

    // (S4) the works, one mesh
    const wg = worksGeometry(p.works ?? [])
    this.works = wg ? new THREE.Mesh(wg, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, flatShading: true })) : null
    if (this.works) {
      // (the records it was built from, and which of them are the theme's
      // landmark: what sim/dressing-check.mjs --browser projects)
      this.works.userData.works = p.works
      this.works.userData.landmarks = LANDMARKS[p.theme] ?? []
      this.works.receiveShadow = true
      this.group.add(this.works)
    }

    scene.add(this.group)
  }

  // the pennants in the seats' colours
  paint(colors) {
    const a = this.edge.geometry.attributes.color, c = new THREE.Color()
    for (const p of this.pennants) {
      c.set(colors[p.seat])
      for (let i = 0; i < 3; i++) a.setXYZ(p.from + i, c.r, c.g, c.b)
    }
    a.needsUpdate = true
  }

  // the quality's share of the trees and grass (from the end of each list:
  // the seed's order kept), none on 'low'
  quality(f) {
    for (const m of this.trees) {
      m.count = Math.ceil(m.full * f)
      m.visible = f > 0 && m.full > 0
    }
    // (the long grass, the edge mesh's last vertices: a share of it by the
    // draw range, from the end of its list)
    const e = this.edgeParts
    this.edge.geometry.setDrawRange(0, e.edge + Math.ceil(e.grass * f) * e.blade)
    // (the works go with the trees: none on 'low' or ?lowfi)
    if (this.works) this.works.visible = f > 0
  }

  dispose() {
    this.group.removeFromParent()
    this.group.traverse((o) => {
      if (o.isMesh) {
        o.geometry.dispose()
        o.material.dispose()
      }
    })
    this.fields.dispose()
    this.grain.dispose()
  }
}
