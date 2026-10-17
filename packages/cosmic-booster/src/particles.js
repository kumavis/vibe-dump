import * as THREE from 'three'

// Sparkles: a pool of four-point stars simulated on the CPU. Each one can drift
// under drag and a little gravity (glitter falling off a foil card), or be
// pulled into a spiral round an attractor (the black hole drinking the room).

const MAX = 3000

const VERT = /* glsl */ `
attribute float aSize;
attribute float aAlpha;
attribute float aRot;
attribute vec3 aColor;
uniform float uScale;
varying float vAlpha;
varying float vRot;
varying vec3 vColor;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aSize * uScale / -mv.z;
  vAlpha = aAlpha;
  vRot = aRot;
  vColor = aColor;
}
`
const FRAG = /* glsl */ `
varying float vAlpha;
varying float vRot;
varying vec3 vColor;
void main() {
  vec2 d = gl_PointCoord * 2. - 1.;
  float c = cos(vRot), s = sin(vRot);
  d = mat2(c, s, -s, c) * d;
  float r = length(d);
  float core = exp(-r * r * 22.);
  float arms = exp(-abs(d.x) * 18.) * exp(-abs(d.y) * 2.6) + exp(-abs(d.y) * 18.) * exp(-abs(d.x) * 2.6);
  float a = (core * 1.4 + arms * .75) * vAlpha * smoothstep(1., .7, r);
  gl_FragColor = vec4(vColor * a, 1.);
}
`

export class Sparkles {
  constructor() {
    this.pos = new Float32Array(MAX * 3)
    this.vel = new Float32Array(MAX * 3)
    this.col = new Float32Array(MAX * 3)
    this.size = new Float32Array(MAX)
    this.alpha = new Float32Array(MAX)
    this.rot = new Float32Array(MAX)
    this.spin = new Float32Array(MAX)
    this.life = new Float32Array(MAX)
    this.maxLife = new Float32Array(MAX)
    this.baseSize = new Float32Array(MAX)
    this.drag = new Float32Array(MAX)
    this.grav = new Float32Array(MAX)
    this.pull = new Float32Array(MAX)
    this.twinkle = new Float32Array(MAX)
    this.next = 0
    this.attractor = new THREE.Vector3()

    const g = new THREE.BufferGeometry()
    const attr = (arr, n) => new THREE.BufferAttribute(arr, n).setUsage(THREE.DynamicDrawUsage)
    g.setAttribute('position', attr(this.pos, 3))
    g.setAttribute('aColor', attr(this.col, 3))
    g.setAttribute('aSize', attr(this.size, 1))
    g.setAttribute('aAlpha', attr(this.alpha, 1))
    g.setAttribute('aRot', attr(this.rot, 1))
    this.geom = g
    this.material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uScale: { value: 300 } },
    })
    this.points = new THREE.Points(g, this.material)
    this.points.frustumCulled = false
    this.points.renderOrder = 10
  }

  setScale(viewportHeightPx, pixelRatio) {
    this.material.uniforms.uScale.value = viewportHeightPx * pixelRatio * 0.24
  }

  emit(o) {
    const i = this.next
    this.next = (this.next + 1) % MAX
    const i3 = i * 3
    this.pos[i3] = o.x
    this.pos[i3 + 1] = o.y
    this.pos[i3 + 2] = o.z ?? 0
    this.vel[i3] = o.vx ?? 0
    this.vel[i3 + 1] = o.vy ?? 0
    this.vel[i3 + 2] = o.vz ?? 0
    const c = o.color
    this.col[i3] = c.r
    this.col[i3 + 1] = c.g
    this.col[i3 + 2] = c.b
    this.baseSize[i] = o.size ?? 1
    this.life[i] = this.maxLife[i] = o.life ?? 1
    this.drag[i] = o.drag ?? 1.5
    this.grav[i] = o.gravity ?? 0
    this.pull[i] = o.pull ?? 0
    this.rot[i] = Math.random() * Math.PI
    this.spin[i] = (Math.random() - 0.5) * 3
    this.twinkle[i] = Math.random() * 10
  }

  update(dt, t) {
    const A = this.attractor
    for (let i = 0; i < MAX; i++) {
      if (this.life[i] <= 0) {
        this.alpha[i] = 0
        continue
      }
      this.life[i] -= dt
      const i3 = i * 3
      let vx = this.vel[i3]
      let vy = this.vel[i3 + 1]
      let vz = this.vel[i3 + 2]
      if (this.pull[i] > 0) {
        // spiral in: radial pull plus a swirl
        const dx = A.x - this.pos[i3]
        const dy = A.y - this.pos[i3 + 1]
        const dz = A.z - this.pos[i3 + 2]
        const d = Math.hypot(dx, dy, dz) + 0.05
        const k = (this.pull[i] / (d * d + 0.2)) * dt
        vx += dx * k - dy * k * 1.6
        vy += dy * k + dx * k * 1.6
        vz += dz * k
        if (d < 0.12) this.life[i] = Math.min(this.life[i], 0.05)
      }
      const drag = Math.exp(-this.drag[i] * dt)
      vx *= drag
      vy = vy * drag - this.grav[i] * dt
      vz *= drag
      this.vel[i3] = vx
      this.vel[i3 + 1] = vy
      this.vel[i3 + 2] = vz
      this.pos[i3] += vx * dt
      this.pos[i3 + 1] += vy * dt
      this.pos[i3 + 2] += vz * dt
      const u = this.life[i] / this.maxLife[i]
      const fade = Math.min(1, u * 4) * Math.min(1, (1 - u) * 12 + 0.2)
      const tw = 0.65 + 0.35 * Math.sin(t * 9 + this.twinkle[i])
      this.alpha[i] = fade * tw
      this.size[i] = this.baseSize[i] * (0.6 + 0.4 * u + 0.25 * tw)
      this.rot[i] += this.spin[i] * dt
    }
    const a = this.geom.attributes
    a.position.needsUpdate = true
    a.aColor.needsUpdate = true
    a.aSize.needsUpdate = true
    a.aAlpha.needsUpdate = true
    a.aRot.needsUpdate = true
  }

  clear() {
    this.life.fill(0)
  }
}

const PALETTE = [
  new THREE.Color(1, 0.86, 0.6),
  new THREE.Color(0.75, 0.85, 1),
  new THREE.Color(1, 0.7, 0.95),
  new THREE.Color(0.7, 1, 0.92),
  new THREE.Color(1, 1, 1),
]
export function sparkleColor(accent) {
  if (accent && Math.random() < 0.55) return accent
  return PALETTE[Math.floor(Math.random() * PALETTE.length)]
}

const _c = new THREE.Color()
export function spectrumColor(t) {
  return _c.setRGB(
    0.5 + 0.5 * Math.cos(6.283 * t),
    0.5 + 0.5 * Math.cos(6.283 * (t + 0.67)),
    0.5 + 0.5 * Math.cos(6.283 * (t + 0.33)),
  ).clone()
}
