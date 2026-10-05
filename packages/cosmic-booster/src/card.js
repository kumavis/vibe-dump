import * as THREE from 'three'
import { makeFace, cardBack, rarityMetal } from './cardTexture.js'
import { makeArtTarget, renderArt } from './art/index.js'

// A card is a rounded slab with the printed frame over its live art, and on top
// of that the things that make a card worth pulling: brushed-metal borders,
// foil-stamped type, and — on starlight pulls and the chase card — holographic
// film and glitter. Every one of those is view-dependent: they read the actual
// angle between the card, the light and the camera, so tilting the card in
// your hand is what makes it sparkle.

export const CARD_ASPECT = 1.4

const GLSL_UTIL = /* glsl */ `
float hash12(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
vec2 hash22(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.xx + p3.yz) * p3.zy); }
vec3 spectrum(float t) { return .5 + .5 * cos(6.28318 * (t + vec3(0., .33, .67))); }
`

const VERT = /* glsl */ `
varying vec2 vUv;
varying vec3 vPos;
varying vec3 vN;
varying vec3 vT;
void main() {
  vUv = uv;
  vec4 wp = modelMatrix * vec4(position, 1.);
  vPos = wp.xyz;
  vN = normalize(mat3(modelMatrix) * vec3(0., 0., 1.));
  vT = normalize(mat3(modelMatrix) * vec3(1., 0., 0.));
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`

const FRAG = /* glsl */ `
uniform sampler2D uFrame;
uniform sampler2D uMask;
uniform sampler2D uArt;
uniform sampler2D uBack;
uniform sampler2D uBackMask;
uniform vec4 uArtRect;
uniform float uTime;
uniform float uFoil;
uniform float uChase;
uniform float uFlash;
uniform float uDim;
uniform vec3 uMetal;
uniform vec3 uLight;
uniform vec2 uHoloCenter;
varying vec2 vUv;
varying vec3 vPos;
varying vec3 vN;
varying vec3 vT;
${GLSL_UTIL}

void main() {
  vec3 N = normalize(vN);
  vec3 T = normalize(vT);
  vec2 uv = vUv;
  bool front = gl_FrontFacing;
  if (!front) { N = -N; T = -T; uv.x = 1. - uv.x; }
  vec3 B = cross(N, T);
  vec3 V = normalize(cameraPosition - vPos);
  vec3 L = normalize(uLight - vPos);
  vec3 H = normalize(L + V);

  vec3 col;
  vec3 mk;
  float foil = 0.;
  if (front) {
    vec4 fr = texture2D(uFrame, uv);
    mk = texture2D(uMask, uv).rgb;
    vec2 auv = (uv - uArtRect.xy) / (uArtRect.zw - uArtRect.xy);
    vec3 art = texture2D(uArt, clamp(auv, 0., 1.)).rgb;
    col = mix(art, fr.rgb, fr.a);
    foil = mk.b * uFoil;
  } else {
    col = texture2D(uBack, uv).rgb;
    mk = texture2D(uBackMask, uv).rgb;
  }

  float vx = dot(V, T), vy = dot(V, B);
  float ndh = max(dot(N, H), 0.);
  float sheen = pow(max(ndh, 0.), 9.);
  float gloss = pow(max(ndh, 0.), 150.);
  float ph = uv.x * 1.3 + uv.y * 2.1 + vx * 2.8 + vy * 2.3;
  vec3 rb = spectrum(ph);

  // brushed metal: bands that slide across the border as the card turns
  float bands = .5 + .5 * sin(vx * 9. + vy * 6. + (uv.x + uv.y) * 7.);
  vec3 metalTint = mix(uMetal, rb, uChase * .55);
  vec3 metal = col * (.36 + .4 * bands) + metalTint * sheen * .18 + vec3(gloss) * .6;
  col = mix(col, metal, mk.r);

  // foil-stamped type
  vec3 stamp = col * (.6 + .32 * bands) + mix(uMetal, rb, .3 + .5 * uChase) * sheen * .3 + vec3(gloss) * .6;
  col = mix(col, stamp, mk.g);

  // holographic film
  if (foil > 0.) {
    float lum = dot(col, vec3(.299, .587, .114));
    float band = pow(ndh, 26.);   // a rainbow lobe that sweeps across as the card turns
    if (uChase > .5) {
      // the foil lives in the dark: space round the hole turns iridescent while
      // the disk keeps its own fire; fine rings of "spacetime" show in the band
      vec2 d = (uv - uHoloCenter) * vec2(1., 1.4);
      float r = length(d);
      float ripple = .7 + .3 * sin(r * 90. - vx * 7. - vy * 5.);
      vec3 film = mix(spectrum(ph * 1.1 + r * 1.6), vec3(1.), .12);
      float dark = 1. - smoothstep(.03, .5, lum);
      col += film * (.022 + .5 * band * ripple) * (.25 + .75 * dark) * foil;
      col += film * sheen * .05 * dark * foil;
    } else {
      vec3 film = mix(spectrum(ph * 1.15 + sin((uv.x - uv.y * 1.4) * 52.) * .08), vec3(1.), .15);
      col += film * (.05 + .55 * band) * (.3 + .6 * lum) * foil * .6;
    }
  }

  // glitter: tiny flakes, each with its own tilt, that only catch the light
  // when the half-vector lines up with them
  float glit = max(foil * .8, max(mk.g, mk.r) * .15);
  if (glit > 0.) {
    vec2 gp = uv * vec2(1., 1.4) * 170.;
    glit *= smoothstep(1.4, .5, length(fwidth(gp)));
    vec2 id = floor(gp);
    vec2 f = fract(gp) - .5;
    vec2 h1 = hash22(id);
    vec2 h2 = hash22(id + 17.3);
    vec3 fn = normalize(N + (T * (h1.x - .5) + B * (h1.y - .5)) * .5);
    float g = pow(max(dot(fn, H), 0.), 260.);
    float shape = smoothstep(.42, .05, length(f - (h2 - .5) * .5));
    vec3 gc = mix(vec3(1.), spectrum(h2.x + ph * .5), .55);
    col += gc * g * shape * 2.2 * glit * step(.45, hash12(id + 2.7));

    // and now and then a four-point star
    vec2 sp = uv * vec2(1., 1.4) * 32.;
    vec2 sid = floor(sp);
    vec2 so = fract(sp) - .5 - (hash22(sid + 9.) - .5) * .4;
    vec2 sh = hash22(sid + 3.1);
    vec3 sn = normalize(N + (T * (sh.x - .5) + B * (sh.y - .5)) * .45);
    float sg = pow(max(dot(sn, H), 0.), 500.);
    float star = exp(-abs(so.x) * 70.) * exp(-abs(so.y) * 6.5) + exp(-abs(so.y) * 70.) * exp(-abs(so.x) * 6.5);
    star += exp(-dot(so, so) * 500.);
    col += vec3(1., .98, .95) * sg * star * 2.4 * glit * step(.5, hash12(sid + 4.4));
  }

  // laminate gloss over everything
  col += vec3(.9, .93, 1.) * (gloss * .15 + sheen * .03);

  col *= uDim;
  col = mix(col, vec3(1.25), uFlash);
  gl_FragColor = vec4(col, 1.);
}
`

// The glow a card throws round itself: rarity colour for normal pulls, a
// rotating spectrum for the chase card. Additive, behind the card.
const HALO_FRAG = /* glsl */ `
uniform float uGlow;
uniform float uTime;
uniform vec3 uColor;
uniform float uRainbow;
varying vec2 vUv;
${GLSL_UTIL}
float sdRR(vec2 p, vec2 b, float r) { vec2 q = abs(p) - b + r; return length(max(q, 0.)) + min(max(q.x, q.y), 0.) - r; }
void main() {
  vec2 p = (vUv - .5) * vec2(1.7, 2.1);
  float d = sdRR(p, vec2(.5, .7), .05);
  float g = exp(-max(d, 0.) * 9.) * smoothstep(-.06, .0, d);
  g += exp(-max(d, 0.) * 22.) * .8 * smoothstep(-.02, .0, d);
  // fade out before the edge of the quad, so it never shows as a faint frame
  vec2 e = abs(vUv - .5) * 2.;
  g *= smoothstep(1., .78, max(e.x, e.y));
  float a = atan(p.y, p.x);
  vec3 c = mix(uColor, mix(spectrum(a / 6.28318 + uTime * .15), vec3(1., .92, .8), .22) * .8, uRainbow);
  gl_FragColor = vec4(c * g * uGlow, 1.);
}
`
const HALO_VERT = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }
`

function roundedCardGeometry() {
  const w = 1
  const h = CARD_ASPECT
  const r = 0.046
  const s = new THREE.Shape()
  s.moveTo(-w / 2 + r, -h / 2)
  s.lineTo(w / 2 - r, -h / 2)
  s.absarc(w / 2 - r, -h / 2 + r, r, -Math.PI / 2, 0, false)
  s.lineTo(w / 2, h / 2 - r)
  s.absarc(w / 2 - r, h / 2 - r, r, 0, Math.PI / 2, false)
  s.lineTo(-w / 2 + r, h / 2)
  s.absarc(-w / 2 + r, h / 2 - r, r, Math.PI / 2, Math.PI, false)
  s.lineTo(-w / 2, -h / 2 + r)
  s.absarc(-w / 2 + r, -h / 2 + r, r, Math.PI, Math.PI * 1.5, false)
  const g = new THREE.ShapeGeometry(s, 10)
  const pos = g.attributes.position
  const uv = g.attributes.uv
  for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) / w + 0.5, pos.getY(i) / h + 0.5)
  return g
}

const CARD_GEOM = roundedCardGeometry()
const HALO_GEOM = new THREE.PlaneGeometry(1.7, 2.1)

const METAL_TINT = {
  silver: new THREE.Color(0.85, 0.88, 0.95),
  gold: new THREE.Color(1.0, 0.82, 0.5),
  chrome: new THREE.Color(0.8, 0.78, 1.0),
}

const _v = new THREE.Vector3()
const _q = new THREE.Quaternion()

export class Card {
  constructor(pull, renderer, light) {
    this.pull = pull
    this.def = pull.def
    this.face = makeFace(pull, renderer)
    const back = cardBack(renderer)
    const full = !!pull.def.fullArt
    this.artHi = makeArtTarget(full ? 720 : 960, full ? 1008 : 768)
    this.artLo = makeArtTarget(full ? 300 : 400, full ? 420 : 320, true)
    this.useHi = false
    this.artFresh = { hi: false, lo: false }

    this.material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      side: THREE.DoubleSide,
      uniforms: {
        uFrame: { value: this.face.frame },
        uMask: { value: this.face.mask },
        uArt: { value: this.artLo.texture },
        uBack: { value: back.frame },
        uBackMask: { value: back.mask },
        uArtRect: { value: this.face.artRect },
        uTime: { value: 0 },
        uFoil: { value: pull.foil ? 1 : 0 },
        uChase: { value: this.def.rarity === 'holo' ? 1 : 0 },
        uFlash: { value: 0 },
        uDim: { value: 1 },
        uMetal: { value: METAL_TINT[rarityMetal(this.def.rarity)] },
        uLight: { value: light },
        uHoloCenter: { value: new THREE.Vector2(0.5, 0.575) },
      },
    })
    this.mesh = new THREE.Mesh(CARD_GEOM, this.material)

    const glowColor = new THREE.Color(this.def.accent)
    this.haloMat = new THREE.ShaderMaterial({
      vertexShader: HALO_VERT,
      fragmentShader: HALO_FRAG,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uGlow: { value: 0 },
        uTime: { value: 0 },
        uColor: { value: glowColor },
        uRainbow: { value: this.def.rarity === 'holo' ? 1 : 0 },
      },
    })
    this.halo = new THREE.Mesh(HALO_GEOM, this.haloMat)
    this.halo.position.z = -0.004
    this.halo.renderOrder = -1

    this.group = new THREE.Group()
    this.group.add(this.halo, this.mesh)

    // where the card is (animated by tweens) and how it's being tilted (springy)
    this.pose = { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, s: 1, flip: 0 }
    this.tilt = new THREE.Vector2()
    this.tiltVel = new THREE.Vector2()
    this.tiltTarget = new THREE.Vector2()
    this.artTilt = new THREE.Vector2()
    this.offset = new THREE.Vector3()
    this.glow = 0
    this.hover = 0
    this.hoverTarget = 0
    this.pop = 0
    this.flyUntil = 0
  }

  applyPose() {
    const p = this.pose
    const o = this.offset
    const h = this.hover
    this.group.position.set(p.x + o.x, p.y + o.y + h * p.s * 0.08, p.z + o.z + h * 0.4)
    this.group.rotation.set(p.rx + this.tilt.x, p.ry + this.tilt.y + p.flip * Math.PI, p.rz * (1 - h * 0.7), 'YXZ')
    this.group.scale.setScalar(p.s * (1 + h * 0.07 + Math.sin(Math.min(this.pop, 1) * Math.PI) * 0.035))
  }

  // Ease the hand-held tilt toward its target with a little overshoot.
  stepTilt(dt) {
    const k = 60
    const c = 11
    for (const a of ['x', 'y']) {
      const acc = (this.tiltTarget[a] - this.tilt[a]) * k - this.tiltVel[a] * c
      this.tiltVel[a] += acc * dt
      this.tilt[a] += this.tiltVel[a] * dt
    }
  }

  // The direction we're looking at the card from, in its own frame: the art
  // shaders use it for parallax (the black hole's camera swings with it).
  updateViewTilt(camera) {
    this.group.updateMatrixWorld()
    this.group.getWorldPosition(_v)
    _v.subVectors(camera.position, _v).normalize()
    this.group.getWorldQuaternion(_q)
    _v.applyQuaternion(_q.invert())
    if (this.pose.flip > 0.5) _v.x = -_v.x
    this.artTilt.set(THREE.MathUtils.clamp(_v.x * 2.2, -1, 1), THREE.MathUtils.clamp(_v.y * 2.2, -1, 1))
  }

  renderArt(renderer, time, hi) {
    const target = hi ? this.artHi : this.artLo
    renderArt(renderer, this.def.id, target, { time, seed: this.pull.seed, tilt: this.artTilt })
    this.artFresh[hi ? 'hi' : 'lo'] = true
    this.useHi = hi
    this.material.uniforms.uArt.value = target.texture
  }

  setTime(t) {
    this.material.uniforms.uTime.value = t
    this.haloMat.uniforms.uTime.value = t
    this.haloMat.uniforms.uGlow.value = this.glow
    this.halo.visible = this.glow > 0.003
  }

  dispose() {
    this.face.frame.dispose()
    this.face.mask.dispose()
    this.artHi.dispose()
    this.artLo.dispose()
    this.material.dispose()
    this.haloMat.dispose()
  }
}
