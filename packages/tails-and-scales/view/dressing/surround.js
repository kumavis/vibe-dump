// The world round the battlefield (DESIGN's "Battlefield dressing", S1):
// the ground from the mat's edge out to the haze, painted with the fields,
// hedgerows and the cart track place.js laid out, rolling into hills; the
// mat's edge, a band of trodden earth with a dark cut line, and the
// boundary stakes, each pennant in its seat's colour; the trees, broadleaf
// and pine; and the long grass off the mat. Nothing here is on the mat,
// and nothing casts a shadow.
//
// Draw calls: the ground 1, the edge and stakes 1, the trees 2, the grass 1.
import * as THREE from 'three'
import { lift, outside, stream } from './place.js'

const C = (hex) => new THREE.Color(hex)
const FIELDS = {
  pasture: ['#5f7f37', '#577733'],
  meadow: ['#6c8a3e', '#7a9447'],
  wheat: ['#b9a75a', '#c7b56a'],
  barley: ['#a3a456', '#b0ad62'],
  plough: ['#6e5a3e', '#5f4c33'],
  fallow: ['#7d8048', '#6f7440'],
}

// the fields' paint: `T` inches either side of the board's centre on a
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
  // the near ground, round the mat: uncut meadow, paler and yellower than
  // the mat's turf, so the board reads as the mown field it is; and
  // the canvas's own edge, which the ground beyond it stretches
  const { W, H } = p
  g.globalAlpha = 1
  g.strokeStyle = '#5d7a3a'
  g.lineWidth = 12
  g.strokeRect(0, 0, 1024, 1024)
  g.fillStyle = '#74813f'
  g.fillRect(at(-W / 2 - 5), at(-H / 2 - 5), (W + 10) * px, (H + 10) * px)
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

// the mat's edge and its stakes, one mesh in vertex colours: `paint`
// recolours the pennants
function edgeGeometry(p) {
  const { W, H } = p
  const parts = []
  const band = (x0, z0, x1, z1, y, colour) => {
    const g = new THREE.PlaneGeometry(x1 - x0, z1 - z0).rotateX(-Math.PI / 2).translate((x0 + x1) / 2, y, (z0 + z1) / 2)
    parts.push([g, colour])
  }
  // trodden earth, then the cut line on the mat's very edge
  const B = 0.55, L = 0.07
  band(-W / 2 - B, -H / 2 - B, W / 2 + B, -H / 2, 0.002, '#7e6a46')
  band(-W / 2 - B, H / 2, W / 2 + B, H / 2 + B, 0.002, '#7e6a46')
  band(-W / 2 - B, -H / 2, -W / 2, H / 2, 0.002, '#7e6a46')
  band(W / 2, -H / 2, W / 2 + B, H / 2, 0.002, '#7e6a46')
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
  // merged, in colours
  const pos = [], col = [], c = new THREE.Color()
  for (const [g0, colour, seat] of parts) {
    const g = g0.index ? g0.toNonIndexed() : g0
    if (seat !== undefined) pennants.push({ seat, from: pos.length / 3 })
    c.set(colour)
    const a = g.attributes.position
    for (let i = 0; i < a.count; i++) {
      pos.push(a.getX(i), a.getY(i), a.getZ(i))
      col.push(c.r, c.g, c.b)
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
  g.computeVertexNormals()
  return { geometry: g, pennants }
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
    const g = g0.toNonIndexed()
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
    const uniforms = { grain: { value: grain }, grainRepeat: { value: (2 * T) / 3 } }
    mat.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms)
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', '#include <common>\nuniform sampler2D grain;\nuniform float grainRepeat;')
        .replace('#include <map_fragment>', '#include <map_fragment>\n\tdiffuseColor.rgb *= mix( vec3( 1.0 ), texture2D( grain, vMapUv * grainRepeat ).rgb * 2.0, 0.45 );')
    }
    mat.customProgramCacheKey = () => 'tails-ground-grain'
    this.grain = grain
    const ground = (this.ground = new THREE.Mesh(groundGeometry(W, H, E, seed, T), mat))
    ground.receiveShadow = true
    this.group.add(ground)

    // the edge and the stakes
    const edge = edgeGeometry(p)
    this.pennants = edge.pennants
    this.edge = new THREE.Mesh(edge.geometry, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, side: THREE.DoubleSide }))
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
        mesh.setColorAt(i, col.setHSL(0, 0, 0.82 + t.tint * 0.3))
      })
      mesh.count = list.length
      mesh.full = list.length
      this.group.add(mesh)
      return mesh
    })

    // the long grass off the mat
    {
      const list = p.grass
      const mesh = new THREE.InstancedMesh(new THREE.ConeGeometry(0.035, 0.13, 3, 1, true), new THREE.MeshStandardMaterial({ roughness: 1, side: THREE.DoubleSide }), Math.max(1, list.length))
      const tints = ['#8fae50', '#9cba5a', '#7f9a46', '#a8b860', '#b4b26a']
      list.forEach((t, i) => {
        m4.compose(v.set(t.x, t.y + 0.065 * t.s, t.z), q.setFromEuler(e.set(t.tilt, t.yaw, t.tilt * 0.5)), s3.set(t.s, t.s * 1.3, t.s))
        mesh.setMatrixAt(i, m4)
        mesh.setColorAt(i, col.set(tints[Math.floor(t.tint * tints.length)]))
      })
      mesh.count = list.length
      mesh.full = list.length
      this.grass = mesh
      this.group.add(mesh)
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
    for (const m of [...this.trees, this.grass]) {
      m.count = Math.ceil(m.full * f)
      m.visible = f > 0 && m.full > 0
    }
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
