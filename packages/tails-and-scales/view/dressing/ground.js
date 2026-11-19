// The pieces sat in the ground (DESIGN's "Battlefield dressing", S2): each
// rules piece's footprint painted into the mat (a soft contact shadow, then
// worn ground thinning outward in its kind's colours: gravel by stone,
// mud and straw by timber, leaf litter round a wood, ash by a fire), the
// objectives' trodden ground, the debris place.js laid out (pebbles,
// splinters, leaves and, inside a wood's footprint, ferns), and the tufts
// and flowers in clumps where it put them.
//
// (A) And the works' feet (a rampart's, bastion's, keep's and a stone
// wall's): packed earth, a damp line, rubble spilled and moss, strong
// enough to read from the battle's own camera; a ladder's foot worn
// hardest; each forest floor covered by a ragged, soft-edged one of its own
// (FloorCover: the rules' disc is the wood's look, so the cover follows its
// rim, a darker core fading out, litter in it).
//
// Draw calls: the debris 4 and the floors' cover 1 (the mat's paint and the
// tufts cost none more). The low clutter, the tufts and flowers and the
// ferns shrink away where a figure's base stands (bases.js: the mask, read
// at each item's centre) and the low clutter under the pointer (FADE tails
// round where it meets the ground), so nothing stands through a base or
// between the player and a click.
import * as THREE from 'three'
import { stream } from './place.js'
import { RES, maskSize, paintBases } from './bases.js'

const FADE = 1.6
// each kind's worn-ground colours
const WEAR = {
  stone: { earth: ['#6b5c40', '#5e5038'], speck: ['#8d877b', '#77716a', '#9a9488', '#5e5a52'], n: 60 },
  wood: { earth: ['#6b5636', '#5c4a2e'], speck: ['#b49a55', '#a08848', '#6f5634', '#c2a862'], n: 55 },
  green: { earth: ['#4a5228', '#3e4a24'], speck: ['#6b4f2a', '#8a6a32', '#3d4f26', '#9a7a3a', '#a0602a'], n: 70 },
  ash: { earth: ['#4a4038', '#3e3630'], speck: ['#6a625a', '#2e2824', '#8a8278'], n: 60 },
  trodden: { earth: ['#6a6a3a', '#73703e'], speck: ['#7d7a48', '#5f6a34'], n: 26 },
  fort: { earth: ['#6e5d3e', '#5f5034', '#77664a'], speck: ['#9a9488', '#8d877b', '#6e6a62', '#b0a99a'], n: 80 },
}

// the decals' paint, for the mat (view/table.js dress): `g` its canvas's 2D
// context, `c` the canvas, the board W×H
export function decalPainter(p) {
  return (g, c, W, H) => {
    const sx = c.width / W
    // (S3) the lanes first, under everything: a broad band of flattened,
    // paler grass, then the bare earth down its middle, both as heavy as the
    // lane's wear (a gap, a ladder's foot), then stones kicked along it
    g.save()
    g.translate((W / 2) * sx, (H / 2) * sx)
    g.scale(sx, sx)
    g.lineCap = g.lineJoin = 'round'
    const lane = (pth, width, colour, alpha) => {
      for (let i = 0; i < pth.pts.length - 1; i++) {
        const [x0, z0, w0] = pth.pts[i], [x1, z1, w1] = pth.pts[i + 1], wear = (w0 + w1) / 2
        g.globalAlpha = Math.min(0.9, alpha * wear)
        g.strokeStyle = colour
        g.lineWidth = width * pth.w * (0.8 + 0.25 * wear)
        g.beginPath()
        g.moveTo(x0, z0)
        g.lineTo(x1, z1)
        g.stroke()
      }
    }
    for (const pth of p.lanes ?? []) lane(pth, 1.25, '#7d8a48', 0.1)
    for (const pth of p.lanes ?? []) lane(pth, 0.55, '#7a6846', 0.2)
    for (const pth of p.lanes ?? []) {
      const r = stream(Math.round(pth.pts[0][0] * 977) ^ Math.round(pth.pts[0][1] * 991), 'lane')
      for (const [x, z, wear] of pth.pts) {
        if (r() > 0.25 * wear) continue
        g.globalAlpha = 0.4 + r() * 0.3
        g.fillStyle = ['#8d877b', '#6e5a3e', '#9a8a68'][Math.floor(r() * 3)]
        const s2 = 0.04 + r() * 0.06
        g.fillRect(x + (r() - 0.5) * 0.5 * pth.w, z + (r() - 0.5) * 0.5 * pth.w, s2, s2)
      }
    }
    g.restore()
    for (const d of p.decals) {
      const w = WEAR[d.kind] ?? WEAR.stone, r = stream(d.salt, 'wear')
      g.save()
      g.translate((d.x + W / 2) * sx, (d.z + H / 2) * sx)
      g.rotate(-d.yaw)
      g.scale(sx, sx)
      const ex = d.r ? d.r : d.hx, ez = d.r ? d.r : d.hz
      // the contact shadow: three soft steps (none under a forest's floor,
      // which lies on the mat: its ring of litter instead)
      if (d.kind !== 'trodden' && d.piece !== 'floor') {
        for (let i = 3; i >= 1; i--) {
          g.globalAlpha = 0.11
          g.fillStyle = '#1e1a12'
          const m = 0.1 * i
          g.beginPath()
          g.roundRect(-ex - m, -ez - m, 2 * (ex + m), 2 * (ez + m), 0.25 + m)
          g.fill()
        }
      }
      // a forest floor's hard rim broken up: blots of its own colour and
      // of shade straddling it, so the wood's ground runs into the turf
      if (d.color) {
        for (let i = 0; i < 70; i++) {
          const a = r() * Math.PI * 2, rr = d.r * (0.86 + r() * 0.3)
          g.globalAlpha = 0.35 + r() * 0.3
          g.fillStyle = i % 3 ? d.color : '#2a3a1c'
          g.beginPath()
          g.ellipse(Math.cos(a) * rr, Math.sin(a) * rr, 0.25 + r() * 0.45, 0.18 + r() * 0.3, a, 0, Math.PI * 2)
          g.fill()
        }
      }
      // the works' feet: packed earth out to a tail and more, the damp line
      // at the very foot, rubble spilled in fans, moss in the shade
      if (d.kind === 'fort') {
        for (let i = 0; i < 26 + 6 * (ex + ez); i++) {
          const [x, z] = round(r, ex, ez, r() * r() * 1.3)
          g.globalAlpha = 0.28 + r() * 0.2
          g.fillStyle = w.earth[i % w.earth.length]
          g.beginPath()
          g.ellipse(x, z, 0.3 + r() * 0.45, 0.2 + r() * 0.3, r() * 3, 0, Math.PI * 2)
          g.fill()
        }
        g.globalAlpha = 0.55
        g.strokeStyle = '#2b2a1c'
        g.lineWidth = 0.16
        g.beginPath()
        g.roundRect(-ex - 0.05, -ez - 0.05, 2 * (ex + 0.05), 2 * (ez + 0.05), 0.08)
        g.stroke()
        const fans = 2 + Math.floor(r() * 3)
        for (let f = 0; f < fans; f++) {
          const [fx, fz] = round(r, ex, ez, 0.05)
          for (let i = 0; i < 26; i++) {
            const a = r() * Math.PI * 2, dd = r() * r() * 0.9, s2 = 0.05 + r() * 0.13
            g.globalAlpha = 0.6 + r() * 0.3
            g.fillStyle = w.speck[i % w.speck.length]
            g.fillRect(fx + Math.cos(a) * dd - s2 / 2, fz + Math.sin(a) * dd - s2 / 2, s2, s2 * (0.6 + r() * 0.6))
          }
        }
        for (let i = 0; i < 40; i++) {
          const [x, z] = round(r, ex, ez, r() * 0.35)
          g.globalAlpha = 0.35 + r() * 0.25
          g.fillStyle = i % 2 ? '#4c6a2a' : '#3a5424'
          g.beginPath()
          g.ellipse(x, z, 0.06 + r() * 0.12, 0.05 + r() * 0.08, r() * 3, 0, Math.PI * 2)
          g.fill()
        }
      }
      // a ladder's foot: trodden bare
      if (d.heavy) {
        for (let i = 0; i < 18; i++) {
          g.globalAlpha = 0.3 + r() * 0.2
          g.fillStyle = i % 2 ? '#6e5d3e' : '#5f5034'
          g.beginPath()
          g.ellipse((r() - 0.5) * ex, (r() - 0.5) * ez, 0.25 + r() * 0.3, 0.18 + r() * 0.22, r() * 3, 0, Math.PI * 2)
          g.fill()
        }
      }
      // a forest floor is round: its litter rings it
      const at = d.r ? (t) => ring(r, d.r, t) : (t) => round(r, ex, ez, t)
      // worn earth, in patches close in
      for (let i = 0; i < w.n * 0.35; i++) {
        const [x, z] = at(r() * r() * 0.9)
        g.globalAlpha = 0.16 + r() * 0.14
        g.fillStyle = w.earth[i % w.earth.length]
        g.beginPath()
        g.ellipse(x, z, 0.18 + r() * 0.35, 0.12 + r() * 0.22, r() * 3, 0, Math.PI * 2)
        g.fill()
      }
      // specks: gravel, straw, litter, ash, thinning outward
      const n = Math.round(w.n * Math.min(3, 1 + (ex + ez) / 3))
      for (let i = 0; i < n; i++) {
        const [x, z] = at(r() * r() * 1.9)
        g.globalAlpha = 0.35 + r() * 0.35
        g.fillStyle = w.speck[i % w.speck.length]
        if (d.kind === 'wood' && i % 3 === 0) {
          g.save()
          g.translate(x, z)
          g.rotate(r() * 3)
          g.fillRect(-0.09, -0.012, 0.18, 0.024)
          g.restore()
        } else {
          const s = 0.025 + r() * 0.05
          g.fillRect(x - s / 2, z - s / 2, s, s * (0.6 + r() * 0.8))
        }
      }
      g.restore()
    }
    g.globalAlpha = 1
  }
}
// a point round a box of half sizes ex, ez, `t` tails out from its edge
// (a little inside it, too: the edge itself is worn)
function round(r, ex, ez, t) {
  const per = 4 * (ex + ez), u = r() * per, j = (r() - 0.6) * 0.3
  if (u < 2 * ex) return [u - ex, -ez - t - j]
  if (u < 2 * ex + 2 * ez) return [ex + t + j, u - 2 * ex - ez]
  if (u < 4 * ex + 2 * ez) return [ex - (u - 2 * ex - 2 * ez), ez + t + j]
  return [-ex - t - j, ez - (u - 4 * ex - 2 * ez)]
}

// a point round a circle of radius `rad`, `t` tails out (a little in)
function ring(r, rad, t) {
  const a = r() * Math.PI * 2, d = rad * 0.92 + t + (r() - 0.6) * 0.3
  return [Math.cos(a) * d, Math.sin(a) * d]
}

// the debris' shapes
const SHAPES = {
  pebble: () => new THREE.IcosahedronGeometry(0.06, 0).scale(1, 0.55, 0.8).translate(0, 0.02, 0),
  stick: () => new THREE.BoxGeometry(0.3, 0.025, 0.035).translate(0, 0.012, 0),
  leaf: () => new THREE.PlaneGeometry(0.1, 0.06).rotateX(-Math.PI / 2).translate(0, 0.006, 0),
  fern: () => {
    const parts = []
    for (let i = 0; i < 5; i++) parts.push(new THREE.ConeGeometry(0.035, 0.32, 3, 1, true).translate(0, 0.16, 0).rotateZ(0.55).rotateY((i / 5) * Math.PI * 2))
    const pos = []
    for (const g of parts) {
      const a = g.toNonIndexed().attributes.position
      for (let i = 0; i < a.count; i++) pos.push(a.getX(i), a.getY(i), a.getZ(i))
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    g.computeVertexNormals()
    return g
  },
}
const TINTS = {
  pebble: ['#8c8880', '#7a756c', '#9a958a', '#6e6a62'],
  stick: ['#7a5a36', '#8a6a42', '#5e4428', '#9a7a4e'],
  leaf: ['#7a5a26', '#9a6a2a', '#5a6a2a', '#a8762e', '#6e4a22'],
  fern: ['#3f6a2c', '#4a7a32', '#36602a'],
}
const ASHEN = ['#3a3430', '#2e2a26', '#4a443e']

// The clutter's vertex shader: an instance shrunk to nothing where a base
// stands (the mask, nearest texel at its centre) and, `cursor` given, under
// the pointer. Patched into each material that draws clutter (the tufts' and
// flowers' too, view/table.js's, while the dressing is on).
function hideUnder(mat, u, { cursor = true } = {}) {
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, u)
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform vec3 cursor;\nuniform sampler2D baseMask;\nuniform vec2 matSize;')
      .replace('#include <begin_vertex>', `#include <begin_vertex>
  {
    vec3 at = (modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
    vec2 uv = (at.xz + matSize * 0.5) / matSize;
    float base = (uv.x >= 0.0 && uv.y >= 0.0 && uv.x < 1.0 && uv.y < 1.0) ? texture2D(baseMask, uv).r : 0.0;
    transformed *= 1.0 - step(0.5, base);
    ${cursor ? `transformed *= mix(1.0, smoothstep(${(FADE * 0.55).toFixed(2)}, ${FADE.toFixed(2)}, distance(at.xz, cursor.xy)), cursor.z);` : ''}
  }`)
  }
  mat.customProgramCacheKey = () => (cursor ? 'tails-dressing-hide-cursor' : 'tails-dressing-hide')
}

export class Ground {
  // `p` the plan; `camera` the table's, `canvas` the renderer's (the
  // pointer's ground point, for the fade); `table` the mat's (its tufts and
  // flowers hidden under bases too)
  // `hide` the clutter's uniforms, the Dressing's for its life (the
  // tufts' material, the table's, keeps its program across boards: its
  // uniforms are these same objects, their values set here)
  constructor(scene, p, { camera, canvas, table, hide }) {
    this.group = new THREE.Group()
    this.group.userData.dressing = true
    this.W = p.W
    this.H = p.H
    // the pointer where it meets the ground: x, z, and 1 while it is over
    // the canvas
    const cursor = (this.cursor = hide.cursor)
    cursor.value.set(0, 0, 0)
    // the bases' mask (bases.js), a texel per 1/RES tail over the mat
    const { w, h } = maskSize(p.W, p.H)
    this.mask = new Uint8Array(w * h)
    const tex = (this.maskTex = new THREE.DataTexture(this.mask, w, h, THREE.RedFormat, THREE.UnsignedByteType))
    tex.magFilter = tex.minFilter = THREE.NearestFilter
    tex.needsUpdate = true
    const u = (this.uniforms = hide)
    u.baseMask.value = tex
    u.matSize.value.set(w / RES, h / RES)
    this.baseKey = ''
    this.lastBases = -1
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), v = new THREE.Vector3(), s3 = new THREE.Vector3(), col = new THREE.Color()
    this.meshes = Object.keys(SHAPES).map((kind) => {
      const list = p.debris.filter((d) => d.kind === kind)
      const mat = new THREE.MeshStandardMaterial({ roughness: 1, side: kind === 'leaf' || kind === 'fern' ? THREE.DoubleSide : THREE.FrontSide, flatShading: kind === 'pebble' })
      // (low clutter shrinks under bases and the pointer; a fern, in a
      // wood's footprint, under bases alone)
      hideUnder(mat, u, { cursor: kind !== 'fern' })
      const mesh = new THREE.InstancedMesh(SHAPES[kind](), mat, Math.max(1, list.length))
      list.forEach((d, i) => {
        const tilt = kind === 'pebble' ? d.tilt * 0.4 : kind === 'fern' ? 0 : (d.tilt - 0.5) * 0.3
        m4.compose(v.set(d.x, 0, d.z), q.setFromEuler(e.set(tilt, d.yaw, tilt * 0.5)), s3.setScalar(d.s))
        mesh.setMatrixAt(i, m4)
        const tints = d.ash && kind !== 'fern' ? ASHEN : TINTS[kind]
        mesh.setColorAt(i, col.set(tints[Math.floor(d.tint * tints.length)]))
      })
      mesh.count = list.length
      mesh.full = list.length
      mesh.receiveShadow = true
      this.group.add(mesh)
      return mesh
    })
    // the tufts and flowers: the table's own materials, hidden under bases
    // while the dressing is on (none of this under ?dress=0)
    this.table = table
    for (const m of [table.tufts.material, table.flowers.material]) {
      if (m.userData.hidden) continue
      m.userData.hidden = true
      hideUnder(m, u, { cursor: false })
      m.needsUpdate = true
    }
    // the forest floors' cover
    this.cover = floorCover(p)
    if (this.cover) this.group.add(this.cover)
    scene.add(this.group)

    // the pointer, met with the ground plane (y 0) as it moves
    const ndc = new THREE.Vector2(), ray = new THREE.Raycaster(), plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), hit = new THREE.Vector3()
    this.canvas = canvas
    this.move = (ev) => {
      const rect = canvas.getBoundingClientRect()
      ndc.set(((ev.clientX - rect.left) / rect.width) * 2 - 1, -((ev.clientY - rect.top) / rect.height) * 2 + 1)
      ray.setFromCamera(ndc, camera)
      if (ray.ray.intersectPlane(plane, hit)) cursor.value.set(hit.x, hit.z, 1)
      else cursor.value.z = 0
    }
    this.leave = () => (cursor.value.z = 0)
    canvas.addEventListener('pointermove', this.move)
    canvas.addEventListener('pointerleave', this.leave)
  }

  // The bases where the figures stand now (every figure's root, marked
  // userData.fig, with its base, userData.base: view/models/cache.js), on
  // the ground: the mask painted again when they have moved (at most ten
  // times a second).
  bases(scene, now) {
    if (now - this.lastBases < 100) return
    this.lastBases = now
    const discs = [], p = new THREE.Vector3(), sc = new THREE.Vector3()
    scene.traverseVisible((o) => {
      const b = o.userData.base
      if (!o.userData.fig || !b) return
      o.getWorldPosition(p)
      if (p.y > 0.2) return
      b.geometry.boundingSphere ?? b.geometry.computeBoundingSphere()
      b.getWorldScale(sc)
      discs.push({ x: p.x, z: p.z, r: b.geometry.boundingSphere.radius * Math.max(sc.x, sc.z) })
    })
    const key = discs.map((d) => `${d.x.toFixed(2)},${d.z.toFixed(2)},${d.r.toFixed(2)}`).join('|')
    if (key === this.baseKey) return
    this.baseKey = key
    paintBases(this.mask, this.W, this.H, discs)
    this.maskTex.needsUpdate = true
  }

  // the quality's share (from the end of each list), none on 'low'
  quality(f) {
    for (const m of this.meshes) {
      m.count = Math.ceil(m.full * f)
      m.visible = f > 0 && m.full > 0
    }
  }

  dispose() {
    this.canvas.removeEventListener('pointermove', this.move)
    this.canvas.removeEventListener('pointerleave', this.leave)
    this.group.removeFromParent()
    this.group.traverse((o) => {
      if (o.isMesh) {
        o.geometry.dispose()
        o.material.map?.dispose()
        o.material.dispose()
      }
    })
    this.maskTex.dispose()
  }
}

// Each forest floor covered by one of its own, ragged and soft at the rim,
// darker at the core, its litter in it: one mesh of a quad per floor (the
// first CELLS), each with its cell of one canvas. Its rim follows the rules'
// floor (look.rim, the disc's), out a little and ragged, so the wood's
// ground reads where it always did.
const CELLS = 8, CELL = 256
function floorCover(p) {
  const floors = p.decals.filter((d) => d.color && d.rim).slice(0, CELLS)
  if (!floors.length) return null
  const c = document.createElement('canvas')
  c.width = 4 * CELL
  c.height = 2 * CELL
  const g = c.getContext('2d')
  const pos = [], uv = [], idx = []
  floors.forEach((d, k) => {
    const r = stream(d.salt, 'cover'), R = d.r * 1.3
    const ox = (k % 4) * CELL, oy = Math.floor(k / 4) * CELL, px = CELL / (2 * R)
    g.save()
    g.translate(ox + CELL / 2, oy + CELL / 2)
    g.scale(px, px)
    // the rim, as the floor's mesh draws it (view/terrain.js: the vertex at
    // angle a lies at (cos a, -sin a) times r and its rim draw), out a
    // little, ragged
    const n = d.rim.length - 1
    const rimAt = (a) => {
      const t = ((((-a / (Math.PI * 2)) % 1) + 1) % 1) * n, i = Math.floor(t), f = t - i
      return d.rim[i] * (1 - f) + d.rim[(i + 1) % (n + 1)] * f
    }
    const outline = (out, jag) => {
      g.beginPath()
      for (let i = 0; i <= 72; i++) {
        const a = (i / 72) * Math.PI * 2, rr = d.r * (rimAt(a) + out + jag * r())
        i ? g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : g.moveTo(Math.cos(a) * rr, Math.sin(a) * rr)
      }
      g.closePath()
    }
    // soft, ragged steps out from the rim, then the floor itself
    for (const [out, alpha] of [[0.2, 0.18], [0.14, 0.28], [0.08, 0.45]]) {
      g.globalAlpha = alpha
      g.fillStyle = d.color
      outline(out, 0.08)
      g.fill()
    }
    g.globalAlpha = 1
    g.fillStyle = d.color
    outline(0.03, 0.03)
    g.fill()
    // the darker core, fading out
    const core = g.createRadialGradient(0, 0, 0, 0, 0, d.r * 0.85)
    core.addColorStop(0, 'rgba(18,26,12,0.55)')
    core.addColorStop(1, 'rgba(18,26,12,0)')
    g.fillStyle = core
    g.beginPath()
    g.arc(0, 0, d.r * 0.85, 0, Math.PI * 2)
    g.fill()
    // the litter
    const LITTER = ['#6b4f2a', '#8a6a32', '#3d4f26', '#9a7a3a', '#a0602a', '#2e3a1a']
    for (let i = 0; i < 520; i++) {
      const a = r() * Math.PI * 2, rr = d.r * rimAt(a) * Math.sqrt(r()) * 1.02
      g.globalAlpha = 0.35 + r() * 0.4
      g.fillStyle = LITTER[i % LITTER.length]
      const s2 = 0.03 + r() * 0.06
      g.fillRect(Math.cos(a) * rr, Math.sin(a) * rr, s2, s2 * (0.5 + r()))
    }
    g.restore()
    // its quad, at the floor's centre (cx, cz: the shape's)
    const b = pos.length / 3
    for (const [sx, sz, u, vv] of [[-1, -1, 0, 1], [1, -1, 1, 1], [1, 1, 1, 0], [-1, 1, 0, 0]]) {
      pos.push(d.cx + sx * R, 0.016, d.cz + sz * R)
      uv.push((ox + u * CELL) / c.width, 1 - (oy + (1 - vv) * CELL) / c.height)
    }
    idx.push(b, b + 2, b + 1, b, b + 3, b + 2)
  })
  g.globalAlpha = 1
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
  geo.setIndex(idx)
  geo.computeVertexNormals()
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: t, transparent: true, depthWrite: false, roughness: 1, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }))
  mesh.receiveShadow = true
  mesh.renderOrder = 1
  return mesh
}

// The tufts and flowers where the plan put them (view/table.js scatterTufts,
// through its strew): every instance the table has, those beyond the plan's
// lists shrunk to nothing.
export function strewer(p) {
  return (t) => {
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), v = new THREE.Vector3(), s3 = new THREE.Vector3()
    const col = new THREE.Color(), zero = new THREE.Matrix4().makeScale(0, 0, 0)
    const tc = ['#9cba5a', '#a8c464', '#b4c86e', '#8fae50']
    for (let i = 0; i < t.tufts.count; i++) {
      const f = p.tufts[i]
      if (!f) {
        t.tufts.setMatrixAt(i, zero)
        continue
      }
      q.setFromEuler(e.set(f.tx, 0, f.tz))
      m.compose(v.set(f.x, 0.08 * f.s, f.z), q, s3.setScalar(f.s))
      t.tufts.setMatrixAt(i, m)
      t.tufts.setColorAt(i, col.set(tc[Math.floor(f.tint * tc.length)]))
    }
    const fc = ['#f4f0e0', '#f2d14a', '#d77ad0', '#e8e8ff']
    for (let i = 0; i < t.flowers.count; i++) {
      const f = p.flowers[i]
      if (!f) {
        t.flowers.setMatrixAt(i, zero)
        continue
      }
      m.compose(v.set(f.x, 0.08, f.z), q.identity(), s3.set(1, 0.6, 1))
      t.flowers.setMatrixAt(i, m)
      t.flowers.setColorAt(i, col.set(fc[Math.floor(f.tint * fc.length)]))
    }
    t.tufts.instanceMatrix.needsUpdate = t.flowers.instanceMatrix.needsUpdate = true
    if (t.tufts.instanceColor) t.tufts.instanceColor.needsUpdate = true
    if (t.flowers.instanceColor) t.flowers.instanceColor.needsUpdate = true
  }
}
