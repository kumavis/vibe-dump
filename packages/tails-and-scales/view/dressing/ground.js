// The pieces sat in the ground (DESIGN's "Battlefield dressing", S2): each
// rules piece's footprint painted into the mat (a soft contact shadow, then
// worn ground thinning outward in its kind's colours: gravel by stone,
// mud and straw by timber, leaf litter round a wood, ash by a fire), the
// objectives' trodden ground, the debris place.js laid out (pebbles,
// splinters, leaves and, inside a wood's footprint, ferns), and the tufts
// and flowers in clumps where it put them.
//
// Draw calls: the debris 4 (the mat's paint and the tufts cost none more).
// The low clutter shrinks away under the pointer (FADE inches round where
// it meets the ground), so nothing stands between the player and a click.
import * as THREE from 'three'
import { stream } from './place.js'

const FADE = 1.6
// each kind's worn-ground colours
const WEAR = {
  stone: { earth: ['#6b5c40', '#5e5038'], speck: ['#8d877b', '#77716a', '#9a9488', '#5e5a52'], n: 60 },
  wood: { earth: ['#6b5636', '#5c4a2e'], speck: ['#b49a55', '#a08848', '#6f5634', '#c2a862'], n: 55 },
  green: { earth: ['#4a5228', '#3e4a24'], speck: ['#6b4f2a', '#8a6a32', '#3d4f26', '#9a7a3a', '#a0602a'], n: 70 },
  ash: { earth: ['#4a4038', '#3e3630'], speck: ['#6a625a', '#2e2824', '#8a8278'], n: 60 },
  trodden: { earth: ['#6a6a3a', '#73703e'], speck: ['#7d7a48', '#5f6a34'], n: 26 },
}

// the decals' paint, for the mat (view/table.js dress): `g` its canvas's 2D
// context, `c` the canvas, the board W×H
export function decalPainter(p) {
  return (g, c, W, H) => {
    const sx = c.width / W
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
// a point round a box of half sizes ex, ez, `t` inches out from its edge
// (a little inside it, too: the edge itself is worn)
function round(r, ex, ez, t) {
  const per = 4 * (ex + ez), u = r() * per, j = (r() - 0.6) * 0.3
  if (u < 2 * ex) return [u - ex, -ez - t - j]
  if (u < 2 * ex + 2 * ez) return [ex + t + j, u - 2 * ex - ez]
  if (u < 4 * ex + 2 * ez) return [ex - (u - 2 * ex - 2 * ez), ez + t + j]
  return [-ex - t - j, ez - (u - 4 * ex - 2 * ez)]
}

// a point round a circle of radius `rad`, `t` inches out (a little in)
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

export class Ground {
  // `p` the plan; `camera` the table's, `canvas` the renderer's (the
  // pointer's ground point, for the fade)
  constructor(scene, p, { camera, canvas }) {
    this.group = new THREE.Group()
    this.group.userData.dressing = true
    // the pointer where it meets the ground: x, z, and 1 while it is over
    // the canvas
    const cursor = (this.cursor = { value: new THREE.Vector3(0, 0, 0) })
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), v = new THREE.Vector3(), s3 = new THREE.Vector3(), col = new THREE.Color()
    this.meshes = Object.keys(SHAPES).map((kind) => {
      const list = p.debris.filter((d) => d.kind === kind)
      const mat = new THREE.MeshStandardMaterial({ roughness: 1, side: kind === 'leaf' || kind === 'fern' ? THREE.DoubleSide : THREE.FrontSide, flatShading: kind === 'pebble' })
      // (low clutter shrinks under the pointer; a fern, in a wood's
      // footprint, stands)
      if (kind !== 'fern') {
        mat.onBeforeCompile = (shader) => {
          shader.uniforms.cursor = cursor
          shader.vertexShader = shader.vertexShader
            .replace('#include <common>', '#include <common>\nuniform vec3 cursor;')
            .replace('#include <begin_vertex>', `#include <begin_vertex>
  {
    vec3 at = (modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
    transformed *= mix(1.0, smoothstep(${(FADE * 0.55).toFixed(2)}, ${FADE.toFixed(2)}, distance(at.xz, cursor.xy)), cursor.z);
  }`)
        }
        mat.customProgramCacheKey = () => 'tails-dressing-fade'
      }
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
        o.material.dispose()
      }
    })
  }
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
