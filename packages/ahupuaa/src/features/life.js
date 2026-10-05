// People, canoes, surfers, birds and smoke — the island's day going on.
//
// Everyone is a little instanced figure in one of a few poses, moved on the CPU
// each frame (there are only a few hundred of them). Most stay where the work
// is: bent over in the loʻi, sitting in the kauhale, on the heiau court. Some go
// somewhere: canoes work the fishing grounds past the reef, surfers ride the
// break, a voyaging canoe sails the coast, and in the Makahiki season Lono's
// akua loa is carried clockwise around the island on the shore trail, the land
// always on the bearers' right.

import * as THREE from 'three'
import { mulberry32 } from '../gen/noise.js'
import { insidePoly } from '../gen/loi.js'
import { Builder, MAT, S, col, objectMaterial } from './kit.js'
import { waa, kaulua, akuaLoa } from './structures.js'

function person(pose, rand) {
  const B = new Builder()
  const skin = col('#7a4b30', 0.1, rand)
  const cloth = col('#b08a5a', 0.15, rand)
  if (pose === 'stand') {
    B.box(-0.12, 0, 0, 0.16, 0.85, 0.18, skin, MAT.skin, 0, 0.8)
    B.box(0.12, 0, 0, 0.16, 0.85, 0.18, skin, MAT.skin, 0, 0.8)
    B.box(0, 0.78, 0, 0.42, 0.32, 0.26, cloth, MAT.plain)
    B.box(0, 1.05, 0, 0.44, 0.5, 0.24, skin, MAT.skin, 0, 0.85)
    B.box(-0.3, 0.88, 0, 0.11, 0.62, 0.12, skin, MAT.skin)
    B.box(0.3, 0.88, 0, 0.11, 0.62, 0.12, skin, MAT.skin)
    B.blob(0, 1.68, 0, 0.13, 0.15, 0.13, col('#3a2418', 0.1, rand), MAT.skin, 1, false)
  } else if (pose === 'bend') {
    B.box(-0.12, 0, 0, 0.16, 0.8, 0.18, skin, MAT.skin, 0, 0.8)
    B.box(0.12, 0, 0, 0.16, 0.8, 0.18, skin, MAT.skin, 0, 0.8)
    B.box(0, 0.72, 0.05, 0.42, 0.3, 0.3, cloth, MAT.plain)
    // torso tipped forward toward +z, hands down in the water
    B.hexa([[-0.22, 0.75, 0.05], [0.22, 0.75, 0.05], [0.2, 0.8, 0.62], [-0.2, 0.8, 0.62]], [[-0.22, 0.95, 0.05], [0.22, 0.95, 0.05], [0.2, 1.05, 0.62], [-0.2, 1.05, 0.62]], skin, MAT.skin)
    B.box(0, 0.78, 0.62, 0.4, 0.27, 0.1, skin, MAT.skin)
    B.box(-0.24, 0.35, 0.6, 0.1, 0.5, 0.1, skin, MAT.skin)
    B.box(0.24, 0.35, 0.6, 0.1, 0.5, 0.1, skin, MAT.skin)
    B.blob(0, 1.02, 0.8, 0.13, 0.14, 0.14, col('#3a2418', 0.1, rand), MAT.skin, 2, false)
  } else {
    // sitting cross-legged
    B.box(0, 0, 0, 0.6, 0.2, 0.42, cloth, MAT.plain)
    B.box(0, 0.18, 0, 0.42, 0.55, 0.24, skin, MAT.skin, 0, 0.85)
    B.box(-0.28, 0.2, 0.08, 0.1, 0.45, 0.1, skin, MAT.skin)
    B.box(0.28, 0.2, 0.08, 0.1, 0.45, 0.1, skin, MAT.skin)
    B.blob(0, 0.86, 0, 0.13, 0.15, 0.13, col('#3a2418', 0.1, rand), MAT.skin, 3, false)
  }
  return B.geometry()
}

function surfboard(rand) {
  const B = new Builder()
  B.box(0, 0, 0, 4.6, 0.12, 0.6, col('#6b4630', 0.1, rand), MAT.wood, 0, 0.85)
  return B.geometry()
}

function bird(rand) {
  const B = new Builder()
  const c = col('#1d1d22', 0.1, rand)
  // ʻiwa: long, sharply bent wings, thin sheets seen from above and below
  const wing = [
    [[0, 0, 0.6], [-1.1, 0.25, -0.1], [0, 0, -0.3]],
    [[0, 0, 0.6], [0, 0, -0.3], [1.1, 0.25, -0.1]],
    [[-1.1, 0.25, -0.1], [-2.0, -0.1, -0.5], [-0.6, 0.15, -0.25]],
    [[1.1, 0.25, -0.1], [0.6, 0.15, -0.25], [2.0, -0.1, -0.5]],
    [[0, 0, -0.3], [-0.25, 0, -1.0], [0.25, 0, -1.0]],
  ]
  for (const [a, b, d] of wing) {
    B.tri(a, b, d, c, MAT.plain)
    B.tri(a, d, b, c, MAT.plain)
  }
  return B.geometry()
}

const smokeVertex = /* glsl */ `
in float aAge;
in float aSeed;
uniform float uTime;
uniform vec2 uWindVec;
out float vAlpha;
void main() {
  float t = fract(uTime * 0.05 + aSeed);
  vec3 p = position;
  p.y += t * 0.55;
  p.xz += uWindVec * t * t * 0.35 + vec2(sin(uTime * 0.7 + aSeed * 20.0), cos(uTime * 0.6 + aSeed * 13.0)) * 0.02 * t;
  vec4 mv = viewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = (14.0 + 60.0 * t) / max(-mv.z, 0.2) * 3.0;
  vAlpha = (1.0 - t) * smoothstep(0.0, 0.08, t) * 0.32;
}
`
const smokeFragment = /* glsl */ `
uniform vec3 uSkyColor;
uniform vec3 uSunColor;
in float vAlpha;
void main() {
  vec2 q = gl_PointCoord * 2.0 - 1.0;
  float d = dot(q, q);
  if (d > 1.0) discard;
  float a = vAlpha * (1.0 - d);
  gl_FragColor = vec4((uSkyColor * 0.8 + uSunColor * 0.25) * 0.9, a);
}
`

export class Life {
  constructor(app) {
    this.app = app
    this._m = new THREE.Matrix4()
    this._q = new THREE.Quaternion()
    this._p = new THREE.Vector3()
    this._s = new THREE.Vector3()
    this._e = new THREE.Euler()
    this._c = new THREE.Color()
    const meta = app.island.meta
    const sites = meta.sites
    const rand = mulberry32(meta.seed + 2024)
    this.rand = rand
    this.group = new THREE.Group()
    this.mat = objectMaterial(app.shared, { fade: [24, 34] })
    const T = app.terrain
    const ground = (x, z) => Math.max(0, T.heightAt(x, z))

    // --- people who stay put -------------------------------------------------------
    this.people = { stand: [], bend: [], sit: [] }
    const add = (pose, x, z, rot, y = null, tint = 1) => this.people[pose].push({ x, z, y: y ?? ground(x, z), rot, ph: rand() * 6.28, tint })
    for (const l of sites.loi) {
      const n = l.model ? 16 : 5
      for (let k = 0; k < n; k++) {
        const p = l.paddies[Math.floor(rand() * l.paddies.length)]
        if (!p.flood) continue
        // somewhere out in the paddy, between its middle and an edge
        const q = p.poly[Math.floor(rand() * p.poly.length)]
        const u = rand() * 0.7
        let x = p.c[0] + (q[0] - p.c[0]) * u
        let z = p.c[1] + (q[1] - p.c[1]) * u
        if (!insidePoly(p.poly, x, z)) [x, z] = p.c
        add('bend', x, z, rand() * 6.28, (p.level - 0.25) * 0.013)
      }
    }
    for (const v of sites.villages) {
      const n = v.model ? 12 : v.alii ? 14 : 4
      for (let k = 0; k < n; k++) {
        const a = rand() * 6.28
        const r = 0.04 + rand() * 0.25
        add(rand() < 0.5 ? 'sit' : 'stand', v.x + Math.cos(a) * r, v.z + Math.sin(a) * r, rand() * 6.28)
      }
    }
    for (const h of sites.heiau.filter((x) => x.model || x.kind === 'luakini')) {
      for (let k = 0; k < 3; k++) add('stand', h.x + (rand() - 0.5) * 0.12, h.z + (rand() - 0.5) * 0.08, h.rot + Math.PI, ground(h.x, h.z) + 0.07, 2.4)
    }
    for (const c of sites.canoes) {
      for (let k = 0; k < (c.village === sites.model ? 5 : 2); k++) add('stand', c.x + (rand() - 0.5) * 0.2, c.z + (rand() - 0.5) * 0.2, c.dir + Math.PI + (rand() - 0.5))
    }
    for (const p of sites.ponds) {
      const g = p.wall[Math.round(p.gates[0] * (p.wall.length - 1))]
      add('stand', g[0] - p.ax * 0.02, g[1] - p.az * 0.02, Math.atan2(p.az, p.ax), 0.02)
    }
    this.poseMeshes = {}
    for (const pose of ['stand', 'bend', 'sit']) {
      const list = this.people[pose]
      const count = Math.max(1, list.length + (pose === 'stand' ? 40 : 0))
      const mesh = new THREE.InstancedMesh(person(pose, rand), this.mat, count)
      // three makes the colour buffer on the first setColorAt, filled with
      // black, so anyone placed before that would stay a silhouette
      mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(count * 3).fill(1), 3)
      mesh.frustumCulled = false
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
      this.group.add(mesh)
      this.poseMeshes[pose] = mesh
    }
    this.writeStatic()

    // --- the Makahiki procession -----------------------------------------------------------
    this.trail = meta.trail.slice()
    let area = 0
    for (let i = 0; i < this.trail.length; i++) {
      const a = this.trail[i]
      const b = this.trail[(i + 1) % this.trail.length]
      area += a[0] * b[1] - b[0] * a[1]
    }
    // clockwise seen from above with north up, i.e. positive area in x/z
    if (area < 0) this.trail.reverse()
    this.trailLen = [0]
    for (let i = 1; i <= this.trail.length; i++) {
      const a = this.trail[i - 1]
      const b = this.trail[i % this.trail.length]
      this.trailLen.push(this.trailLen[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1]))
    }
    // start the procession just before the ahu nearest the chief's centre
    const alii = sites.alii || sites.villages[0]
    let s0 = 0
    let bd = Infinity
    for (let i = 0; i < this.trail.length; i++) {
      const d = Math.hypot(this.trail[i][0] - alii.x, this.trail[i][1] - alii.z)
      if (d < bd) {
        bd = d
        s0 = this.trailLen[i]
      }
    }
    this.procS = s0 - 0.6
    const B = new Builder()
    akuaLoa(B, rand)
    this.akua = new THREE.Mesh(B.geometry(), this.mat)
    this.akua.frustumCulled = false
    this.group.add(this.akua)

    // --- canoes out on the fishing grounds, and a voyager ------------------------------------------
    this.boats = []
    const boatGeo = (() => {
      const b = new Builder()
      waa(b, rand, 8)
      return b.geometry()
    })()
    const sitGeo = person('sit', rand)
    const model = meta.ahupuaa.find((a) => a.id === sites.model)
    for (let k = 0; k < 4; k++) {
      const c = sites.canoes[k % sites.canoes.length]
      const base = k < 3 && model ? model.mouth : [c.x, c.z]
      const dirSea = k < 3 ? Math.atan2(model.mouth[1] - model.topZ, model.mouth[0] - model.topX) : c.dir
      const r = 5 + rand() * 5
      const ox = base[0] + Math.cos(dirSea) * r + (rand() - 0.5) * 3
      const oz = base[1] + Math.sin(dirSea) * r + (rand() - 0.5) * 3
      if (T.heightAt(ox, oz) > -0.02) continue
      const g = new THREE.Group()
      const hull = new THREE.Mesh(boatGeo, this.mat)
      hull.scale.setScalar(S)
      g.add(hull)
      for (const off of [-1.6, 1.4]) {
        const p = new THREE.Mesh(sitGeo, this.mat)
        p.scale.setScalar(S)
        p.position.set(off * S, 0.45 * S, 0)
        p.rotation.y = Math.PI / 2
        g.add(p)
      }
      g.position.set(ox, 0, oz)
      g.rotation.y = rand() * 6.28
      this.group.add(g)
      this.boats.push({ g, x: ox, z: oz, ph: rand() * 6.28, drift: rand() * 6.28, crew: 2 })
    }
    const kb = new Builder()
    kaulua(kb, rand)
    this.voyager = new THREE.Mesh(kb.geometry(), this.mat)
    this.voyager.scale.setScalar(S)
    this.voyager.frustumCulled = false
    this.group.add(this.voyager)
    this.voyagerS = 0

    // --- surfers on the break ------------------------------------------------------------------------
    this.surfers = []
    const boardGeo = surfboard(rand)
    this.boards = new THREE.InstancedMesh(boardGeo, this.mat, 24)
    this.boards.frustumCulled = false
    this.boards.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    this.group.add(this.boards)
    for (const s of sites.surf) for (let k = 0; k < 4; k++) this.surfers.push({ s, ph: rand(), lane: (rand() - 0.5) * 0.5 })

    // --- ʻiwa soaring over the coast ---------------------------------------------------------------------
    this.birds = new THREE.InstancedMesh(bird(rand), this.mat, 12)
    this.birds.frustumCulled = false
    this.birds.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    this.group.add(this.birds)
    this.birdCentres = []
    for (let k = 0; k < 12; k++) {
      const v = sites.villages[Math.floor(rand() * sites.villages.length)]
      this.birdCentres.push({ x: v.x + (rand() - 0.5) * 6, z: v.z + (rand() - 0.5) * 6, r: 0.6 + rand() * 1.4, h: 0.9 + rand() * 1.4, ph: rand() * 6.28, sp: 0.08 + rand() * 0.06 })
    }

    // --- imu smoke ---------------------------------------------------------------------------------------
    const pts = []
    const seeds = []
    for (const v of sites.villages) {
      for (let k = 0; k < 14; k++) {
        pts.push(v.x + 0.05, ground(v.x, v.z) + 0.01, v.z + 0.05)
        seeds.push(k / 14 + rand() * 0.05)
      }
    }
    const sg = new THREE.BufferGeometry()
    sg.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
    sg.setAttribute('aSeed', new THREE.Float32BufferAttribute(seeds, 1))
    sg.setAttribute('aAge', new THREE.Float32BufferAttribute(new Float32Array(seeds.length), 1))
    this.smoke = new THREE.Points(
      sg,
      new THREE.ShaderMaterial({
        vertexShader: smokeVertex,
        fragmentShader: smokeFragment,
        uniforms: { uTime: app.shared.uniforms.uTime, uWindVec: app.shared.uniforms.uWindVec, uSkyColor: app.shared.uniforms.uSkyColor, uSunColor: app.shared.uniforms.uSunColor },
        transparent: true,
        depthWrite: false,
      }),
    )
    this.smoke.frustumCulled = false
    this.smoke.renderOrder = 2
    this.group.add(this.smoke)

    this._m = new THREE.Matrix4()
    this._q = new THREE.Quaternion()
    this._p = new THREE.Vector3()
    this._s = new THREE.Vector3()
    this._e = new THREE.Euler()
    this._c = new THREE.Color()
  }

  writeStatic() {
    for (const pose in this.people) {
      const mesh = this.poseMeshes[pose]
      const list = this.people[pose]
      for (let i = 0; i < list.length; i++) this.setInstance(mesh, i, list[i].x, list[i].y, list[i].z, list[i].rot, S, list[i].tint)
      mesh.count = list.length
      mesh.instanceMatrix.needsUpdate = true
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    }
  }

  setInstance(mesh, i, x, y, z, rot, scale, tint = 1, tilt = 0) {
    this._p.set(x, y, z)
    this._e.set(tilt, rot, 0, 'YXZ')
    this._q.setFromEuler(this._e)
    this._s.setScalar(scale)
    this._m.compose(this._p, this._q, this._s)
    mesh.setMatrixAt(i, this._m)
    if (tint !== 1 || mesh.instanceColor) mesh.setColorAt(i, this._c.setRGB(tint, tint, tint))
  }

  /** Put the procession just short of a point on the trail (the ahu). */
  walkTo(x, z) {
    let best = 0
    let bd = Infinity
    for (let i = 0; i < this.trail.length; i++) {
      const d = Math.hypot(this.trail[i][0] - x, this.trail[i][1] - z)
      if (d < bd) {
        bd = d
        best = this.trailLen[i]
      }
    }
    this.procS = best - 0.12
  }

  trailPoint(s) {
    const L = this.trailLen[this.trailLen.length - 1]
    s = ((s % L) + L) % L
    let lo = 0
    let hi = this.trailLen.length - 1
    while (lo < hi - 1) {
      const mid = (lo + hi) >> 1
      if (this.trailLen[mid] <= s) lo = mid
      else hi = mid
    }
    const a = this.trail[lo % this.trail.length]
    const b = this.trail[(lo + 1) % this.trail.length]
    const t = (s - this.trailLen[lo]) / Math.max(1e-6, this.trailLen[lo + 1] - this.trailLen[lo])
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, Math.atan2(b[0] - a[0], b[1] - a[1])]
  }

  update(dt, time) {
    const app = this.app
    const T = app.terrain
    const cam = app.camera.position
    const near = cam.y - Math.max(0, T.heightAt(cam.x, cam.z)) < 30
    this.group.visible = near
    if (!near) return

    // procession: walking pace, sped up a little with the clock
    const makahiki = app.season === 'hooilo'
    const standMesh = this.poseMeshes.stand
    let n = this.people.stand.length
    this.akua.visible = makahiki
    if (makahiki) {
      this.procS += dt * 0.0035 * Math.max(1, Math.min(8, app.clock.speed / 20))
      for (let k = 0; k < 11; k++) {
        const [x, z, rot] = this.trailPoint(this.procS - k * 0.035)
        const y = Math.max(0, T.heightAt(x, z)) + Math.abs(Math.sin(time * 4.2 + k)) * 0.0012
        this.setInstance(standMesh, n++, x, y, z, rot, S, k === 5 ? 2.2 : 1)
        if (k === 5) {
          this.akua.position.set(x, y, z)
          this.akua.rotation.y = rot
          this.akua.scale.setScalar(S)
        }
      }
    }
    // surfers: ride along the wave, then paddle back out
    let b = 0
    for (const sf of this.surfers) {
      const s = sf.s
      const cyc = (time * 0.06 + sf.ph) % 1
      const ax = -Math.sin(s.dir)
      const az = Math.cos(s.dir)
      const along = (cyc - 0.5) * 0.9 + sf.lane
      const inward = cyc * 0.15
      const x = s.x + ax * along - Math.cos(s.dir) * inward
      const z = s.z + az * along - Math.sin(s.dir) * inward
      const rot = Math.atan2(ax, az) + (sf.lane > 0 ? 0 : Math.PI)
      const y = 0.002 + Math.sin(time * 2 + sf.ph * 9) * 0.0008
      this.setInstance(this.boards, b++, x, y, z, rot + Math.PI / 2, S, 1, Math.sin(time * 1.3 + sf.ph) * 0.06)
      this.setInstance(standMesh, n++, x, y + 0.0025, z, rot, S * 0.95, 1)
    }
    this.boards.count = b
    this.boards.instanceMatrix.needsUpdate = true
    standMesh.count = n
    standMesh.instanceMatrix.needsUpdate = true
    if (standMesh.instanceColor) standMesh.instanceColor.needsUpdate = true

    // fishing canoes bob and drift on their grounds
    for (const bt of this.boats) {
      bt.g.position.x = bt.x + Math.sin(time * 0.05 + bt.drift) * 0.6
      bt.g.position.z = bt.z + Math.cos(time * 0.04 + bt.drift) * 0.6
      bt.g.position.y = Math.sin(time * 1.3 + bt.ph) * 0.0015
      bt.g.rotation.z = Math.sin(time * 1.1 + bt.ph) * 0.04
      bt.g.rotation.y += dt * 0.02
    }
    // the voyager sails a long loop well offshore
    this.voyagerS += dt * 0.004
    const vr = 155
    const va = this.voyagerS
    this.voyager.position.set(Math.cos(va) * vr * 0.95 + 10, Math.sin(time * 0.9) * 0.002, Math.sin(va) * vr * 0.7)
    this.voyager.rotation.y = -va - Math.PI / 2
    this.voyager.rotation.x = 0.06

    // ʻiwa wheel on the thermals
    for (let k = 0; k < this.birdCentres.length; k++) {
      const c = this.birdCentres[k]
      const a = c.ph + time * c.sp
      const x = c.x + Math.cos(a) * c.r
      const z = c.z + Math.sin(a) * c.r
      const y = Math.max(0, T.heightAt(x, z)) + c.h + Math.sin(time * 0.3 + k) * 0.1
      this.setInstance(this.birds, k, x, y, z, -a, S * 1.4, 1, 0.3)
    }
    this.birds.count = this.birdCentres.length
    this.birds.instanceMatrix.needsUpdate = true
  }
}
