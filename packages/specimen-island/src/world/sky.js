import * as THREE from 'three'
import { clamp, lerp, smoothstep } from '../core/mathx.js'

// Sky, sun, fog and the clock. Other systems ask `sky.light` (0 night .. 1 day)
// to decide how far a creature can see you; the renderer just follows along.

const KEYS = [
  // elevation (deg) -> palette
  { e: -12, top: '#05070f', hor: '#0b1222', sun: '#203050', sunI: 0.0, hemi: 0.18, fog: '#0a1020' },
  { e: -4, top: '#141a33', hor: '#3a3048', sun: '#ff7040', sunI: 0.0, hemi: 0.3, fog: '#2a2638' },
  { e: 3, top: '#3a5a8a', hor: '#f0a060', sun: '#ff9a50', sunI: 1.1, hemi: 0.65, fog: '#c09070' },
  { e: 12, top: '#4a7ab8', hor: '#e8c8a0', sun: '#ffd8a0', sunI: 2.2, hemi: 0.9, fog: '#b8c0b0' },
  { e: 30, top: '#3f78c4', hor: '#bcd4e0', sun: '#fff2dc', sunI: 2.8, hemi: 1.05, fog: '#b4c8cc' },
  { e: 90, top: '#3570c0', hor: '#b0cce0', sun: '#ffffff', sunI: 3.0, hemi: 1.1, fog: '#aac0cc' },
]
for (const k of KEYS) for (const p of ['top', 'hor', 'sun', 'fog']) k[p] = new THREE.Color(k[p])

export class Sky {
  constructor(scene, { hours = 7.5, dayMinutes = 28 } = {}) {
    this.hours = hours
    this.rate = 24 / (dayMinutes * 60) // game hours per real second
    this.light = 1
    this.sunDir = new THREE.Vector3(0, 1, 0)
    this.scene = scene

    this.uniforms = {
      uTop: { value: new THREE.Color() },
      uHor: { value: new THREE.Color() },
      uSunDir: { value: this.sunDir },
      uSunCol: { value: new THREE.Color() },
      uTime: { value: 0 },
      uNight: { value: 0 },
    }
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(1000, 32, 16),
      new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        side: THREE.BackSide,
        depthWrite: false,
        depthTest: false,
        fog: false,
        vertexShader: `
          varying vec3 vDir;
          void main() {
            vDir = normalize(position);
            vec4 p = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * p;
          }`,
        fragmentShader: `
          uniform vec3 uTop; uniform vec3 uHor; uniform vec3 uSunDir; uniform vec3 uSunCol;
          uniform float uTime; uniform float uNight;
          varying vec3 vDir;
          float h(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5); }
          float n(vec2 p) { vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
            return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
          float fbm(vec2 p) { float s = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { s += a * n(p); p *= 2.03; a *= 0.5; } return s; }
          void main() {
            vec3 d = normalize(vDir);
            float y = d.y;
            vec3 col = mix(uHor, uTop, pow(clamp(y, 0.0, 1.0), 0.55));
            col = mix(col, uHor * 0.75, smoothstep(0.0, -0.25, y));
            float sd = max(dot(d, normalize(uSunDir)), 0.0);
            col += uSunCol * (pow(sd, 900.0) * 6.0 + pow(sd, 12.0) * 0.35 + pow(sd, 3.0) * 0.08);
            // clouds on a plane above the island
            if (y > 0.02) {
              vec2 cp = d.xz / (y + 0.08) * 1.6 + vec2(uTime * 0.004, uTime * 0.0025);
              float c = smoothstep(0.5, 0.78, fbm(cp));
              vec3 cc = mix(uHor * 1.05 + uSunCol * 0.15, vec3(1.0), 0.55) * (1.0 - uNight * 0.85);
              col = mix(col, cc, c * smoothstep(0.02, 0.25, y) * 0.85);
            }
            // stars
            if (uNight > 0.01 && y > 0.0) {
              vec2 sp = d.xz / (y + 0.3) * 160.0;
              float st = step(0.997, h(floor(sp)));
              col += vec3(st) * uNight * smoothstep(0.05, 0.4, y);
            }
            gl_FragColor = vec4(col, 1.0);
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }`,
      }),
    )
    dome.renderOrder = -10
    dome.frustumCulled = false
    this.dome = dome
    scene.add(dome)

    this.sun = new THREE.DirectionalLight(0xffffff, 2.5)
    this.sun.castShadow = true
    this.sun.shadow.mapSize.set(2048, 2048)
    const sc = this.sun.shadow.camera
    sc.left = -75
    sc.right = 75
    sc.top = 75
    sc.bottom = -75
    sc.near = 1
    sc.far = 600
    this.sun.shadow.bias = -0.0004
    this.sun.shadow.normalBias = 0.6
    scene.add(this.sun)
    scene.add(this.sun.target)

    this.moon = new THREE.DirectionalLight(0x8090c0, 0.0)
    scene.add(this.moon)

    this.hemi = new THREE.HemisphereLight(0xbfd8ff, 0x4a5030, 1)
    scene.add(this.hemi)

    scene.fog = new THREE.FogExp2(0xaac0cc, 0.0022)
    this.baseFog = 0.0022
    this.fogBoost = 0
    this.update(0, new THREE.Vector3())
  }

  setShadowSize(size) {
    if (!size) {
      this.sun.castShadow = false
      return
    }
    this.sun.castShadow = true
    if (this.sun.shadow.mapSize.x !== size) {
      this.sun.shadow.mapSize.set(size, size)
      if (this.sun.shadow.map) {
        this.sun.shadow.map.dispose()
        this.sun.shadow.map = null
      }
    }
  }

  update(dt, focus, opts = {}) {
    this.hours = (this.hours + dt * this.rate) % 24
    this.uniforms.uTime.value += dt
    // sun path: rises in the east (+X), sets in the west, leaning south
    const t = ((this.hours - 6) / 12) * Math.PI
    const elev = Math.sin(t) * 68
    const az = t
    const er = (elev * Math.PI) / 180
    this.sunDir.set(Math.cos(az) * Math.cos(er), Math.sin(er), 0.35 * Math.cos(er)).normalize()

    let a = KEYS[0]
    let b = KEYS[KEYS.length - 1]
    for (let i = 0; i < KEYS.length - 1; i++) {
      if (elev >= KEYS[i].e && elev <= KEYS[i + 1].e) {
        a = KEYS[i]
        b = KEYS[i + 1]
        break
      }
    }
    if (elev < KEYS[0].e) b = a
    const k = a === b ? 0 : clamp((elev - a.e) / (b.e - a.e), 0, 1)
    const u = this.uniforms
    u.uTop.value.copy(a.top).lerp(b.top, k)
    u.uHor.value.copy(a.hor).lerp(b.hor, k)
    u.uSunCol.value.copy(a.sun).lerp(b.sun, k)
    u.uNight.value = 1 - smoothstep(-10, 2, elev)

    this.light = clamp(smoothstep(-8, 10, elev) * 0.85 + 0.15, 0.15, 1)

    this.sun.color.copy(u.uSunCol.value)
    this.sun.intensity = lerp(a.sunI, b.sunI, k)
    this.hemi.intensity = lerp(a.hemi, b.hemi, k)
    this.hemi.color.copy(u.uTop.value).lerp(new THREE.Color(1, 1, 1), 0.45)
    this.hemi.groundColor.setRGB(0.2, 0.22, 0.12).multiplyScalar(0.5 + this.light * 0.5)
    this.moon.intensity = u.uNight.value * 0.35
    this.moon.position.set(-this.sunDir.x, Math.abs(this.sunDir.y) + 0.4, -this.sunDir.z).multiplyScalar(200)

    const fogCol = new THREE.Color().copy(a.fog).lerp(b.fog, k)
    this.scene.fog.color.copy(fogCol)
    // the jungle closes in; altitude opens the view back up
    const alt = opts.altitude || 0
    const target = this.baseFog * (1 + this.fogBoost * 1.6) * lerp(1, 0.45, smoothstep(20, 160, alt))
    this.scene.fog.density = lerp(this.scene.fog.density, target, Math.min(1, dt * 1.5))

    // keep the sun's shadow box centred on the player, snapped to texels
    if (focus) {
      const ts = (this.sun.shadow.camera.right * 2) / this.sun.shadow.mapSize.x
      const fx = Math.round(focus.x / ts) * ts
      const fz = Math.round(focus.z / ts) * ts
      const sd = this.sunDir.y > 0.05 ? this.sunDir : new THREE.Vector3(0.3, 1, 0.2).normalize()
      this.sun.position.set(fx + sd.x * 250, focus.y + sd.y * 250, fz + sd.z * 250)
      this.sun.target.position.set(fx, focus.y, fz)
      this.sun.target.updateMatrixWorld()
      this.dome.position.copy(opts.camera || focus)
    }
  }

  isNight() {
    return this.light < 0.4
  }
}
