// The table (DESIGN §1.1): the painted mat the battle is fought on, the
// wooden table and the mat's frame, a deployment zone along each seat's edge
// (its depth the mission's, in the seat's colour: paint()), and grass tufts
// and flowers, purely for looks. Everything random here is cosmetic and
// stays on Math.random: the mat's and the wood's paint as the table is made,
// the tufts and flowers each new table (scatterTufts).
//
// R7 moved it out of main.js unchanged (the same draws, in the same order).
import * as THREE from 'three'

function paintMat(W, H, renderer) {
  const c = document.createElement('canvas')
  c.width = 2048
  c.height = Math.round((2048 * H) / W)
  const g = c.getContext('2d')
  g.fillStyle = '#5b7a36'
  g.fillRect(0, 0, c.width, c.height)
  const blot = (cols, n, rmin, rmax, alpha) => {
    for (let i = 0; i < n; i++) {
      g.globalAlpha = alpha * (0.4 + Math.random() * 0.6)
      g.fillStyle = cols[(Math.random() * cols.length) | 0]
      g.beginPath()
      g.ellipse(Math.random() * c.width, Math.random() * c.height, rmin + Math.random() * (rmax - rmin), rmin + Math.random() * (rmax - rmin), Math.random() * 3, 0, Math.PI * 2)
      g.fill()
    }
  }
  blot(['#6a8a40', '#4f6c2c', '#729347', '#55742f', '#7f964c'], 700, 20, 90, 0.35)
  blot(['#7d6b45', '#6e5d3a', '#8a7650'], 40, 30, 110, 0.22)
  blot(['#8fa65a', '#a4b46a'], 300, 4, 14, 0.4)
  for (let i = 0; i < 14000; i++) {
    g.globalAlpha = 0.35
    g.fillStyle = Math.random() < 0.5 ? '#3f5a24' : '#8fae5a'
    g.fillRect(Math.random() * c.width, Math.random() * c.height, 2, 4 + Math.random() * 4)
  }
  g.globalAlpha = 1
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = renderer.capabilities.getMaxAnisotropy()
  return t
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

export class Table {
  // { W, H }: the board's size; `deploy`: the zones' depth (the mission's);
  // `edges`: each seat's edge (-1 west, 1 east)
  constructor(scene, renderer, { W, H, deploy, edges }) {
    this.W = W
    this.H = H
    const boardMat = new THREE.MeshStandardMaterial({ map: paintMat(W, H, renderer), roughness: 0.95 })
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
      for (const [w, h, d, x, z] of parts) {
        const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), frameMat)
        m.position.set(x, -0.22, z)
        m.castShadow = m.receiveShadow = true
        scene.add(m)
      }
      const under = new THREE.Mesh(new THREE.BoxGeometry(W, 0.6, H), frameMat)
      under.position.y = -0.31
      scene.add(under)
    }

    // deployment zones, one along each seat's edge, in the seat's colour
    // (paint(), once the seats are known), as deep as the mission's (the
    // rules' zone, core/deploy.js)
    this.zoneMats = []
    this.zoneLineMats = []
    for (const s of [0, 1]) {
      const sx = edges[s]
      const mat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.07, depthWrite: false })
      this.zoneMats.push(mat)
      const z = new THREE.Mesh(new THREE.PlaneGeometry(deploy, H).rotateX(-Math.PI / 2), mat)
      z.position.set(sx * (W / 2 - deploy / 2), 0.008, 0)
      z.renderOrder = 1
      scene.add(z)
      const pts = []
      for (let zz = -H / 2; zz < H / 2; zz += 1) pts.push(new THREE.Vector3(sx * (W / 2 - deploy), 0.02, zz), new THREE.Vector3(sx * (W / 2 - deploy), 0.02, zz + 0.5))
      const lineMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.5 })
      this.zoneLineMats.push(lineMat)
      scene.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), lineMat))
    }

    // grass tufts and flowers, purely for looks
    this.tufts = new THREE.InstancedMesh(new THREE.ConeGeometry(0.035, 0.13, 3), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 1 }), 700)
    this.flowers = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.05, 0), new THREE.MeshStandardMaterial({ roughness: 0.6 }), 140)
    scene.add(this.tufts, this.flowers)
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
