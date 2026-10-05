import * as THREE from 'three'

// The room the pack is opened in: a dark sky with slow nebula weather tinted by
// whatever card is in your hand, and a field of real point stars at depth, so
// the camera's small drift gives parallax. When the chase card is coming the
// stars are drawn into a whirlpool toward it.

const SKY_FRAG = /* glsl */ `
uniform float uTime;
uniform float uDim;
uniform vec2 uRes;
uniform vec2 uPar;
uniform vec3 uTint;
float h21(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
vec2 h22(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.xx + p3.yz) * p3.zy); }
float gn(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3. - 2. * f);
  return mix(mix(dot(h22(i) - .5, f), dot(h22(i + vec2(1, 0)) - .5, f - vec2(1, 0)), u.x),
             mix(dot(h22(i + vec2(0, 1)) - .5, f - vec2(0, 1)), dot(h22(i + vec2(1, 1)) - .5, f - vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) { float s = 0., a = .5; for (int i = 0; i < 5; i++) { s += a * gn(p); p = mat2(1.6, 1.2, -1.2, 1.6) * p + 7.; a *= .5; } return .5 + 1.3 * s; }
void main() {
  vec2 p = (gl_FragCoord.xy - .5 * uRes) / uRes.y;
  vec2 q = p + uPar * .02;
  float n = fbm(q * 1.4 + vec2(uTime * .006, 0.));
  float n2 = fbm(q * 2.8 + n * 1.3 - vec2(0., uTime * .005));
  vec3 col = vec3(.008, .007, .022);
  col += vec3(.2, .07, .32) * pow(max(n, 0.), 3.2) * .55;
  col += uTint * pow(max(n2 * n, 0.), 2.6) * .3;
  col += vec3(.04, .1, .22) * pow(max(n2, 0.), 4.) * .45;
  float v = 1. - smoothstep(.35, 1.15, length(p * vec2(.85, 1.)));
  col *= (.45 + .55 * v) * uDim;
  gl_FragColor = vec4(col, 1.);
}
`

const STAR_VERT = /* glsl */ `
attribute float aMag;
attribute float aPhase;
attribute vec3 aTint;
uniform float uTime;
uniform float uScale;
uniform float uSuck;
uniform vec3 uCenter;
varying float vB;
varying vec3 vTint;
void main() {
  vec3 p = position;
  // the whirlpool: rotate about the centre, faster close in, and draw inward
  vec2 d = p.xy - uCenter.xy;
  float r = length(d);
  float ang = uSuck * 3.2 / (r * .35 + .6);
  float c = cos(ang), s = sin(ang);
  d = mat2(c, s, -s, c) * d * mix(1., .25 + .75 * smoothstep(0., 14., r), uSuck);
  p.xy = uCenter.xy + d;
  vec4 mv = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mv;
  float tw = .7 + .3 * sin(uTime * (1. + aPhase) + aPhase * 20.);
  vB = (.25 + aMag * 1.5) * tw;
  vTint = aTint;
  gl_PointSize = max(1.5, (1.2 + aMag * 4.) * uScale / -mv.z);
}
`
const STAR_FRAG = /* glsl */ `
varying float vB;
varying vec3 vTint;
void main() {
  vec2 d = gl_PointCoord * 2. - 1.;
  float r = length(d);
  float core = exp(-r * r * 10.);
  float spikes = (exp(-abs(d.x) * 22.) + exp(-abs(d.y) * 22.)) * exp(-r * 2.4) * smoothstep(.6, 1.5, vB);
  gl_FragColor = vec4(vTint * vB * (core + spikes * .6), 1.);
}
`

// The sky is soft, so it is painted into a quarter-resolution target and
// stretched over the screen — the fullscreen noise would otherwise be the most
// expensive thing on the page at retina resolution.
const SKY_SHOW = /* glsl */ `
uniform sampler2D tSky;
uniform float uTime;
varying vec2 vUv;
float h21(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
void main() {
  vec3 col = texture2D(tSky, vUv).rgb;
  // dither, so the dark gradients don't band
  col += (h21(gl_FragCoord.xy + fract(uTime) * 91.) - .5) / 255.;
  gl_FragColor = vec4(col, 1.);
}
`

export class Backdrop {
  constructor() {
    this.skyRT = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, depthBuffer: false })
    this.skyScene = new THREE.Scene()
    this.skyCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    this.skyPaint = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        vertexShader: `void main(){ gl_Position = vec4(position.xy, 0., 1.); }`,
        fragmentShader: SKY_FRAG,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uDim: { value: 1 },
          uRes: { value: new THREE.Vector2(1, 1) },
          uPar: { value: new THREE.Vector2() },
          uTint: { value: new THREE.Color(0.3, 0.2, 0.6) },
        },
      }),
    )
    this.skyPaint.frustumCulled = false
    this.skyScene.add(this.skyPaint)
    // `sky.material.uniforms` stays the handle the rest of the app tweens
    this.sky = { material: this.skyPaint.material }
    this.skyShow = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, .99999, 1.); }`,
        fragmentShader: SKY_SHOW,
        depthTest: false,
        depthWrite: false,
        uniforms: { tSky: { value: this.skyRT.texture }, uTime: { value: 0 } },
      }),
    )
    this.skyShow.frustumCulled = false
    this.skyShow.renderOrder = -100
    this.frame = 0

    const N = 2200
    const pos = new Float32Array(N * 3)
    const mag = new Float32Array(N)
    const phase = new Float32Array(N)
    const tint = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 70
      pos[i * 3 + 1] = (Math.random() - 0.5) * 44
      pos[i * 3 + 2] = -6 - Math.random() * 40
      mag[i] = Math.pow(Math.random(), 7)
      phase[i] = Math.random()
      const t = Math.random()
      const c = t < 0.2 ? [1, 0.75, 0.55] : t < 0.6 ? [1, 0.95, 0.88] : [0.75, 0.85, 1]
      tint.set(c, i * 3)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aMag', new THREE.BufferAttribute(mag, 1))
    g.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1))
    g.setAttribute('aTint', new THREE.BufferAttribute(tint, 3))
    this.starMat = new THREE.ShaderMaterial({
      vertexShader: STAR_VERT,
      fragmentShader: STAR_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uScale: { value: 100 },
        uSuck: { value: 0 },
        uCenter: { value: new THREE.Vector3() },
      },
    })
    this.stars = new THREE.Points(g, this.starMat)
    this.stars.frustumCulled = false
    this.stars.renderOrder = -50
    this.tint = new THREE.Color(0.3, 0.2, 0.6)
    this.tintTarget = new THREE.Color(0.3, 0.2, 0.6)
  }

  addTo(scene) {
    scene.add(this.skyShow, this.stars)
  }

  resize(w, h, pr) {
    const sw = Math.max(16, Math.round(w / 4))
    const sh = Math.max(16, Math.round(h / 4))
    this.skyRT.setSize(sw, sh)
    this.sky.material.uniforms.uRes.value.set(sw, sh)
    this.frame = 0
    this.starMat.uniforms.uScale.value = h * pr * 0.05
  }

  update(dt, t, parallax) {
    this.tint.lerp(this.tintTarget, 1 - Math.exp(-dt * 1.5))
    const u = this.sky.material.uniforms
    u.uTime.value = t
    u.uTint.value.copy(this.tint)
    u.uPar.value.copy(parallax)
    this.starMat.uniforms.uTime.value = t
    this.skyShow.material.uniforms.uTime.value = t
  }

  // repaint the slow sky every other frame
  paint(renderer) {
    if (this.frame++ % 2) return
    const prev = renderer.getRenderTarget()
    renderer.setRenderTarget(this.skyRT)
    renderer.render(this.skyScene, this.skyCam)
    renderer.setRenderTarget(prev)
  }
}
