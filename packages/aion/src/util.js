import * as THREE from 'three'

export const lerp = (a, b, k) => a + (b - a) * k
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x))
export const smooth = (a, b, x) => {
  const k = clamp((x - a) / (b - a))
  return k * k * (3 - 2 * k)
}
export const ease = k => { k = clamp(k); return k * k * k * (k * (k * 6 - 15) + 10) }

/**
 * A tube whose radius varies along its length.
 * `radiusAt(t, point)` returns the radius; if `morph` is given it returns
 * { scale, shift:[x,y,z] } for a second "swollen" shape stored as a morph target.
 */
export function tube(curve, segs, radial, radiusAt, morph) {
  const frames = curve.computeFrenetFrames(segs, false)
  const n = (segs + 1) * (radial + 1)
  const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3)
  const alt = morph ? new Float32Array(n * 3) : null
  const idx = []
  const p = new THREE.Vector3(), v = new THREE.Vector3()
  for (let i = 0; i <= segs; i++) {
    const t = i / segs
    curve.getPointAt(t, p)
    const r = typeof radiusAt === 'function' ? radiusAt(t, p) : radiusAt
    const m = morph ? morph(t, p) : null
    const N = frames.normals[i], B = frames.binormals[i]
    for (let j = 0; j <= radial; j++) {
      const a = (j / radial) * Math.PI * 2, k = (i * (radial + 1) + j) * 3
      v.set(0, 0, 0).addScaledVector(N, Math.cos(a)).addScaledVector(B, Math.sin(a))
      nor[k] = v.x; nor[k + 1] = v.y; nor[k + 2] = v.z
      pos[k] = p.x + v.x * r; pos[k + 1] = p.y + v.y * r; pos[k + 2] = p.z + v.z * r
      if (alt) {
        const rr = r * m.scale
        alt[k] = p.x + v.x * rr + m.shift[0]; alt[k + 1] = p.y + v.y * rr + m.shift[1]; alt[k + 2] = p.z + v.z * rr + m.shift[2]
      }
      if (i < segs && j < radial) {
        const a0 = i * (radial + 1) + j, b0 = a0 + radial + 1
        idx.push(a0, b0, a0 + 1, b0, b0 + 1, a0 + 1)
      }
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  g.setAttribute('normal', new THREE.BufferAttribute(nor, 3))
  g.setIndex(idx)
  if (alt) { g.morphAttributes.position = [new THREE.BufferAttribute(alt, 3)]; g.morphTargetsRelative = false }
  return g
}

export const curveOf = pts => new THREE.CatmullRomCurve3(pts.map(p => (p.isVector3 ? p : new THREE.Vector3(...p))), false, 'centripetal')

let dotTex
function roundSprite() {
  if (dotTex) return dotTex
  const c = document.createElement('canvas'); c.width = c.height = 64
  const g = c.getContext('2d')
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grd.addColorStop(0, '#fff'); grd.addColorStop(0.55, '#fff'); grd.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grd; g.fillRect(0, 0, 64, 64)
  return (dotTex = new THREE.CanvasTexture(c))
}

/** Beads travelling along a curve — blood cells, or signals. advance(dt*speed, health) */
export function flow(curve, count, size, color, stalledColor = 0x3d1620) {
  const pos = new Float32Array(count * 3)
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  const mat = new THREE.PointsMaterial({ size, color, map: roundSprite(), alphaTest: 0.35, transparent: true, sizeAttenuation: true, depthWrite: false })
  const points = new THREE.Points(geo, mat)
  points.frustumCulled = false
  let phase = Math.random()
  const p = new THREE.Vector3()
  const live = new THREE.Color(color), dead = new THREE.Color(stalledColor)
  return {
    points, mat,
    advance(d, health = 1) {
      phase = (((phase + (Number.isFinite(d) ? d : 0)) % 1) + 1) % 1
      for (let i = 0; i < count; i++) {
        curve.getPointAt((i / count + phase) % 1, p)
        pos[i * 3] = p.x; pos[i * 3 + 1] = p.y; pos[i * 3 + 2] = p.z
      }
      geo.attributes.position.needsUpdate = true
      mat.color.copy(dead).lerp(live, health)
    },
  }
}

export function canvasTexture(size, paint) {
  const c = document.createElement('canvas'); c.width = c.height = size
  const g = c.getContext('2d')
  paint(g, size)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  return t
}

/** Small deterministic random stream so painted textures are identical on every build. */
export function rng(seed = 1) {
  let s = seed >>> 0
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296)
}
