// The table (DESIGN §1.1): the painted mat the battle is fought on, the
// wooden table and the mat's frame, a deployment zone along each seat's edge
// (its depth the mission's, in the seat's colour: paint()), and grass tufts
// and flowers, purely for looks. Everything random here is cosmetic and
// stays on Math.random: the mat's and the wood's paint as the table is made,
// the tufts and flowers each new table (scatterTufts).
//
// (F8b) A board larger than classic's draws its mat with a second texture
// over the paint: a detail tile, one per 4" (DESIGN §4.2.3's "The mat": one
// more sampler, no more draw calls), so the grass keeps its grain however
// far the 2048 px paint is stretched. It is a material of its own
// (detailMaterial: the mat's, with the detail multiplied in), made the first
// time a larger board is shown and kept, so a round trip to classic and
// back links no shader again; classic's mat is the material it always was.
// The tile is painted from a fixed hash, not Math.random: the cosmetic
// stream's draws stay where they were.
//
// R7 moved it out of main.js unchanged (the same draws, in the same order).
// (F8a) A mission's board may be larger: resize() makes the table over for
// it, in place (the mat, picked by the pointer's ray, stays the same mesh),
// its mat's paint and its tufts and flowers as many again as its area is
// the classic board's, capped. The classic board is never resized, so its
// draws and objects are the ones it always made.
import * as THREE from 'three'

// how many times the classic board's area a board is (1 on classic)
const areaOf = (W, H) => (W * H) / (40 * 28)

function paintMat(W, H, renderer, k = 1) {
  const c = document.createElement('canvas')
  c.width = 2048
  c.height = Math.round((2048 * H) / W)
  const g = c.getContext('2d')
  g.fillStyle = '#5b7a36'
  g.fillRect(0, 0, c.width, c.height)
  // (F8a) the canvas is 2048 px across whatever the board's width, so on a
  // board k times classic's area each blot and stroke is drawn 1/√k the
  // pixels, k times as many: the mat's mottling as dense per inch as ever
  const px = 1 / Math.sqrt(k)
  const blot = (cols, n, rmin, rmax, alpha) => {
    rmin *= px
    rmax *= px
    for (let i = 0; i < n; i++) {
      g.globalAlpha = alpha * (0.4 + Math.random() * 0.6)
      g.fillStyle = cols[(Math.random() * cols.length) | 0]
      g.beginPath()
      g.ellipse(Math.random() * c.width, Math.random() * c.height, rmin + Math.random() * (rmax - rmin), rmin + Math.random() * (rmax - rmin), Math.random() * 3, 0, Math.PI * 2)
      g.fill()
    }
  }
  // (F8a) the blots and strokes as many again as the area, the strokes
  // capped at 30,000 (classic's counts at k = 1)
  blot(['#6a8a40', '#4f6c2c', '#729347', '#55742f', '#7f964c'], Math.round(700 * k), 20, 90, 0.35)
  blot(['#7d6b45', '#6e5d3a', '#8a7650'], Math.round(40 * k), 30, 110, 0.22)
  blot(['#8fa65a', '#a4b46a'], Math.round(300 * k), 4, 14, 0.4)
  for (let i = 0, n = Math.min(30000, Math.round(14000 * k)); i < n; i++) {
    g.globalAlpha = 0.35
    g.fillStyle = Math.random() < 0.5 ? '#3f5a24' : '#8fae5a'
    g.fillRect(Math.random() * c.width, Math.random() * c.height, 2 * px, (4 + Math.random() * 4) * px)
  }
  g.globalAlpha = 1
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = renderer.capabilities.getMaxAnisotropy()
  return t
}
// (F8b) The mat's detail tile: 256 px of grain about mid-grey (the
// shader multiplies the paint by twice it, so grey leaves it as it was):
// short blades light and dark, and a soft mottle, wrapping at its edges.
function paintDetail() {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')
  g.fillStyle = '#808080'
  g.fillRect(0, 0, 256, 256)
  // a fixed hash in [0, 1): the same tile every time, no Math.random
  let h = 0x9e3779b9
  const rnd = () => {
    h ^= h << 13
    h ^= h >>> 17
    h ^= h << 5
    return (h >>> 0) / 4294967296
  }
  for (let i = 0; i < 70; i++) {
    const x = rnd() * 256, y = rnd() * 256, r = 10 + rnd() * 28, v = 112 + rnd() * 32
    g.globalAlpha = 0.35
    g.fillStyle = `rgb(${v},${v},${v})`
    for (const [dx, dy] of [[0, 0], [256, 0], [-256, 0], [0, 256], [0, -256]]) {
      g.beginPath()
      g.arc(x + dx, y + dy, r, 0, Math.PI * 2)
      g.fill()
    }
  }
  for (let i = 0; i < 2600; i++) {
    const x = rnd() * 256, y = rnd() * 256, v = rnd() < 0.5 ? 70 + rnd() * 30 : 160 + rnd() * 40
    g.globalAlpha = 0.5
    g.fillStyle = `rgb(${v},${v},${v})`
    g.fillRect(x, y, 1.5, 3 + rnd() * 4)
  }
  g.globalAlpha = 1
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  return t
}
// (F8b) The mat's material on a larger board: `base`'s (the paint as its
// map), with the detail tile multiplied in at `repeat` tiles across and
// down (one per 4"). Its program is its own (customProgramCacheKey).
function detailMaterial(base, renderer) {
  const m = base.clone()
  const detail = paintDetail()
  detail.anisotropy = renderer.capabilities.getMaxAnisotropy()
  const uniforms = { detailMap: { value: detail }, detailRepeat: { value: new THREE.Vector2(10, 7) } }
  m.userData.detail = uniforms
  m.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms)
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform sampler2D detailMap;\nuniform vec2 detailRepeat;')
      .replace('#include <map_fragment>', '#include <map_fragment>\n\tdiffuseColor.rgb *= mix( vec3( 1.0 ), texture2D( detailMap, vMapUv * detailRepeat ).rgb * 2.0, 0.6 );')
  }
  m.customProgramCacheKey = () => 'tails-mat-detail'
  return m
}

function paintWood() {
  const c = document.createElement('canvas')
  c.width = c.height = 512
  const g = c.getContext('2d')
  g.fillStyle = '#4a3020'
  g.fillRect(0, 0, 512, 512)
  for (let i = 0; i < 260; i++) {
    g.strokeStyle = Math.random() < 0.5 ? 'rgba(30,18,10,0.35)' : 'rgba(110,70,40,0.25)'
    g.lineWidth = 1 + Math.random() * 3
    const y = Math.random() * 512
    g.beginPath()
    g.moveTo(0, y)
    for (let x = 0; x <= 512; x += 32) g.lineTo(x, y + Math.sin(x * 0.02 + i) * 4)
    g.stroke()
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(6, 6)
  return t
}

// a zone's edge, dashed, along the board's length
function zoneLine(sx, W, H, deploy) {
  const pts = []
  for (let zz = -H / 2; zz < H / 2; zz += 1) pts.push(new THREE.Vector3(sx * (W / 2 - deploy), 0.02, zz), new THREE.Vector3(sx * (W / 2 - deploy), 0.02, zz + 0.5))
  return pts
}

// a mesh's geometry swapped for another, the old one freed
function regeom(mesh, geometry) {
  mesh.geometry.dispose()
  mesh.geometry = geometry
}

export class Table {
  // { W, H }: the board's size; `deploy`: the zones' depth (the mission's);
  // `edges`: each seat's edge (-1 west, 1 east)
  constructor(scene, renderer, { W, H, deploy, edges }) {
    this.scene = scene
    this.renderer = renderer
    this.edges = edges
    this.W = W
    this.H = H
    this.deploy = deploy
    const boardMat = (this.plainMat = new THREE.MeshStandardMaterial({ map: paintMat(W, H, renderer), roughness: 0.95 }))
    // the mat: what the pointer's ray finds the ground on
    const board = (this.board = new THREE.Mesh(new THREE.PlaneGeometry(W, H).rotateX(-Math.PI / 2), boardMat))
    board.receiveShadow = true
    scene.add(board)
    const table = new THREE.Mesh(new THREE.PlaneGeometry(220, 220).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ map: paintWood(), roughness: 0.7 }))
    table.position.y = -0.62
    table.receiveShadow = true
    scene.add(table)
    {
      const frameMat = new THREE.MeshStandardMaterial({ color: '#5a3a22', roughness: 0.6 })
      const parts = [
        [W + 1.6, 0.8, 0.8, 0, -H / 2 - 0.4],
        [W + 1.6, 0.8, 0.8, 0, H / 2 + 0.4],
        [0.8, 0.8, H, -W / 2 - 0.4, 0],
        [0.8, 0.8, H, W / 2 + 0.4, 0],
      ]
      // (the frame's sides, kept for resize())
      this.frame = []
      for (const [w, h, d, x, z] of parts) {
        const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), frameMat)
        m.position.set(x, -0.22, z)
        m.castShadow = m.receiveShadow = true
        scene.add(m)
        this.frame.push(m)
      }
      const under = (this.under = new THREE.Mesh(new THREE.BoxGeometry(W, 0.6, H), frameMat))
      under.position.y = -0.31
      scene.add(under)
    }

    // deployment zones, one along each seat's edge, in the seat's colour
    // (paint(), once the seats are known), as deep as the mission's (the
    // rules' zone, core/deploy.js)
    this.zoneMats = []
    this.zoneLineMats = []
    // (the zones' meshes and lines, kept for resize())
    this.zoneMeshes = []
    this.zoneLines = []
    for (const s of [0, 1]) {
      const sx = edges[s]
      const mat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.07, depthWrite: false })
      this.zoneMats.push(mat)
      const z = new THREE.Mesh(new THREE.PlaneGeometry(deploy, H).rotateX(-Math.PI / 2), mat)
      z.position.set(sx * (W / 2 - deploy / 2), 0.008, 0)
      z.renderOrder = 1
      scene.add(z)
      this.zoneMeshes.push(z)
      const lineMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.5 })
      this.zoneLineMats.push(lineMat)
      const line = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(zoneLine(sx, W, H, deploy)), lineMat)
      scene.add(line)
      this.zoneLines.push(line)
    }

    // grass tufts and flowers, purely for looks
    this.tufts = new THREE.InstancedMesh(new THREE.ConeGeometry(0.035, 0.13, 3), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1 }), 700)
    this.flowers = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.05, 0), new THREE.MeshStandardMaterial({ roughness: 0.6 }), 140)
    scene.add(this.tufts, this.flowers)
  }

  // (F8a) The table made over for a board W×H, its zones `deploy` deep: the
  // mat (the same mesh, a new shape and paint), the frame, the zones (their
  // colours and how strongly they show kept), and the tufts and flowers as
  // many again as the area (capped at 2,800 and 560), strewn anew.
  // view/index.js's setBoard calls it only when a match's board differs
  // from the one shown.
  resize({ W, H, deploy }) {
    Object.assign(this, { W, H, deploy })
    const k = areaOf(W, H)
    const old = this.board.material.map
    old.dispose()
    const map = paintMat(W, H, this.renderer, k)
    // (F8b) the detail tile over a larger board's paint, one per 4"; the
    // classic mat as it always was
    if (k > 1) {
      this.detailMat ??= detailMaterial(this.plainMat, this.renderer)
      this.detailMat.userData.detail.detailRepeat.value.set(W / 4, H / 4)
    }
    const mat = k > 1 ? this.detailMat : this.plainMat
    for (const m of [this.plainMat, this.detailMat]) if (m) m.map = map
    this.board.material = mat
    mat.needsUpdate = true
    regeom(this.board, new THREE.PlaneGeometry(W, H).rotateX(-Math.PI / 2))
    const parts = [
      [W + 1.6, 0.8, 0.8, 0, -H / 2 - 0.4],
      [W + 1.6, 0.8, 0.8, 0, H / 2 + 0.4],
      [0.8, 0.8, H, -W / 2 - 0.4, 0],
      [0.8, 0.8, H, W / 2 + 0.4, 0],
    ]
    parts.forEach(([w, h, d, x, z], i) => {
      regeom(this.frame[i], new THREE.BoxGeometry(w, h, d))
      this.frame[i].position.set(x, -0.22, z)
    })
    regeom(this.under, new THREE.BoxGeometry(W, 0.6, H))
    // ((F8b) on a larger board the box under the mat sits a little lower:
    // from a larger board's farthest views (a phone's overview, 150" and
    // more) the depth buffer can't tell its top, 0.01" under the mat, from
    // the mat, and the two fought in stripes; classic's stays where it was)
    this.under.position.y = k > 1 ? -0.36 : -0.31
    for (const s of [0, 1]) {
      const sx = this.edges[s]
      regeom(this.zoneMeshes[s], new THREE.PlaneGeometry(deploy, H).rotateX(-Math.PI / 2))
      this.zoneMeshes[s].position.set(sx * (W / 2 - deploy / 2), 0.008, 0)
      regeom(this.zoneLines[s], new THREE.BufferGeometry().setFromPoints(zoneLine(sx, W, H, deploy)))
    }
    // the tufts and flowers, as many as the board takes (their geometry and
    // material kept)
    const regrow = (old, n) => {
      if (old.count === n) return old
      const next = new THREE.InstancedMesh(old.geometry, old.material, n)
      this.scene.remove(old)
      old.dispose()
      this.scene.add(next)
      return next
    }
    this.tufts = regrow(this.tufts, Math.min(2800, Math.round(700 * k)))
    this.flowers = regrow(this.flowers, Math.min(560, Math.round(140 * k)))
    this.scatterTufts()
  }

  // each seat's zone in its colour (colors[seat])
  paint(colors) {
    for (const s of [0, 1]) {
      this.zoneMats[s].color.set(colors[s])
      this.zoneLineMats[s].color.set(colors[s])
    }
  }

  // how strongly each seat's zone shows
  zones(opacity) {
    for (const s of [0, 1]) this.zoneMats[s].opacity = opacity[s]
  }

  // the tufts and flowers strewn anew (a new table)
  scatterTufts() {
    const { W, H, tufts, flowers } = this
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler()
    const col = new THREE.Color()
    for (let i = 0; i < tufts.count; i++) {
      const x = (Math.random() - 0.5) * (W - 0.4), z = (Math.random() - 0.5) * (H - 0.4)
      const s = 0.6 + Math.random() * 1.2
      q.setFromEuler(e.set((Math.random() - 0.5) * 0.5, 0, (Math.random() - 0.5) * 0.5))
      m.compose(new THREE.Vector3(x, 0.08 * s, z), q, new THREE.Vector3(s, s, s))
      tufts.setMatrixAt(i, m)
      tufts.setColorAt(i, col.set(['#9cba5a', '#a8c464', '#b4c86e', '#8fae50'][i % 4]))
    }
    const fc = ['#f4f0e0', '#f2d14a', '#d77ad0', '#e8e8ff']
    for (let i = 0; i < flowers.count; i++) {
      const x = (Math.random() - 0.5) * (W - 0.4), z = (Math.random() - 0.5) * (H - 0.4)
      m.compose(new THREE.Vector3(x, 0.08, z), q.identity(), new THREE.Vector3(1, 0.6, 1))
      flowers.setMatrixAt(i, m)
      flowers.setColorAt(i, col.set(fc[i % fc.length]))
    }
    tufts.instanceMatrix.needsUpdate = flowers.instanceMatrix.needsUpdate = true
    tufts.instanceColor.needsUpdate = flowers.instanceColor.needsUpdate = true
  }
}
