import * as THREE from 'three'
import { SET_NAME, SET_SERIES, SET_SIZE, PACK_SIZE } from './cards.js'

// The booster: a pillow of black holographic foil, crimp-sealed at both ends,
// printed with the set's emblem. The top seal tears off along a ragged line —
// drag across it, or just tap — and the strip flies away.

export const PACK_W = 1.34
export const PACK_H = 2.12
export const TEAR_Y = 0.885

const DW = 1000
const DH = Math.round((DW * PACK_H) / PACK_W)
const TEX = 1.024

const SANS = 'Jost, "Futura", "Century Gothic", sans-serif'
const SERIF = '"Cormorant Garamond", Garamond, serif'

function tracked(ctx, text, x, y, tracking, align = 'center') {
  const chars = [...text]
  const widths = chars.map((ch) => ctx.measureText(ch).width)
  const total = widths.reduce((a, b) => a + b, 0) + tracking * (chars.length - 1)
  let cx = align === 'center' ? x - total / 2 : align === 'right' ? x - total : x
  ctx.textAlign = 'left'
  chars.forEach((ch, i) => {
    ctx.fillText(ch, cx, y)
    cx += widths[i] + tracking
  })
}

function canvases() {
  const mk = (s) => {
    const c = document.createElement('canvas')
    c.width = Math.round(DW * s)
    c.height = Math.round(DH * s)
    const ctx = c.getContext('2d')
    ctx.scale(s, s)
    return { c, ctx }
  }
  return { p: mk(TEX), m: mk(0.5) }
}

function seals(p, m) {
  const seal = Math.round(DH * 0.05)
  for (const [y0, y1] of [
    [0, seal],
    [DH - seal, DH],
  ]) {
    const g = p.ctx.createLinearGradient(0, y0, 0, y1)
    g.addColorStop(0, '#6d7286')
    g.addColorStop(0.5, '#dfe3ef')
    g.addColorStop(1, '#7a8093')
    p.ctx.fillStyle = g
    p.ctx.fillRect(0, y0, DW, y1 - y0)
    p.ctx.fillStyle = 'rgba(30,30,50,.25)'
    for (let x = 0; x < DW; x += 8) p.ctx.fillRect(x, y0, 3, y1 - y0)
    m.ctx.fillStyle = '#00f'
    m.ctx.fillRect(0, y0, DW, y1 - y0)
  }
}

function background(p, m, cy) {
  const { ctx } = p
  const g = ctx.createRadialGradient(DW / 2, cy, 30, DW / 2, cy, DH * 0.75)
  g.addColorStop(0, '#2b1856')
  g.addColorStop(0.4, '#120b2c')
  g.addColorStop(1, '#05030c')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, DW, DH)
  // foil shows faintly through the dark ink everywhere, strongly in the rays
  m.ctx.fillStyle = 'rgb(120,0,0)'
  m.ctx.fillRect(0, 0, DW, DH)
  const rays = 40
  for (let i = 0; i < rays; i += 2) {
    const a0 = (i / rays) * Math.PI * 2
    const a1 = ((i + 1) / rays) * Math.PI * 2
    for (const [c, col] of [
      [ctx, 'rgba(190,170,255,.05)'],
      [m.ctx, 'rgb(235,0,0)'],
    ]) {
      c.fillStyle = col
      c.beginPath()
      c.moveTo(DW / 2, cy)
      c.lineTo(DW / 2 + Math.cos(a0) * 2000, cy + Math.sin(a0) * 2000)
      c.lineTo(DW / 2 + Math.cos(a1) * 2000, cy + Math.sin(a1) * 2000)
      c.closePath()
      c.fill()
    }
  }
  // star dust
  let s = 7
  const rand = () => ((s = (s * 16807) % 2147483647) / 2147483647)
  for (let i = 0; i < 700; i++) {
    ctx.fillStyle = `rgba(240,236,255,${0.15 + rand() * 0.6})`
    ctx.beginPath()
    ctx.arc(rand() * DW, rand() * DH, 0.6 + rand() * rand() * 2.2, 0, Math.PI * 2)
    ctx.fill()
  }
}

function emblem(p, m, cx, cy, R) {
  const { ctx } = p
  const glow = ctx.createRadialGradient(cx, cy, R * 0.4, cx, cy, R * 2.3)
  glow.addColorStop(0, 'rgba(255,180,100,.6)')
  glow.addColorStop(0.3, 'rgba(255,120,70,.22)')
  glow.addColorStop(1, 'rgba(120,60,200,0)')
  ctx.fillStyle = glow
  ctx.fillRect(cx - R * 2.4, cy - R * 2.4, R * 4.8, R * 4.8)

  const tilt = -0.1
  const diskGrad = (alpha = 1) => {
    const g = ctx.createLinearGradient(cx - R * 2.8, cy, cx + R * 2.8, cy)
    g.addColorStop(0, 'rgba(255,90,40,0)')
    g.addColorStop(0.18, `rgba(255,120,50,${0.8 * alpha})`)
    g.addColorStop(0.42, `rgba(255,205,130,${alpha})`)
    g.addColorStop(0.6, `rgba(255,248,232,${alpha})`)
    g.addColorStop(0.82, `rgba(255,160,80,${0.85 * alpha})`)
    g.addColorStop(1, 'rgba(255,90,40,0)')
    return g
  }
  const ringGrad = () => {
    const g = ctx.createLinearGradient(cx, cy - R * 1.4, cx, cy + R * 1.4)
    g.addColorStop(0, '#fff3dc')
    g.addColorStop(0.35, '#ffc070')
    g.addColorStop(0.65, '#ff8a3c')
    g.addColorStop(1, '#ffd9a0')
    return g
  }
  // the lensed far side of the disk: a glowing ring hugging the shadow
  ctx.save()
  ctx.shadowColor = 'rgba(255,150,70,1)'
  ctx.shadowBlur = 60
  // an arch over the top (the far side of the disk, bent up into view) and a
  // thinner one beneath — the shape that says "black hole", not "planet"
  ctx.strokeStyle = ringGrad()
  ctx.lineCap = 'round'
  ctx.lineWidth = R * 0.24
  ctx.beginPath()
  ctx.arc(cx, cy, R * 1.24, Math.PI * 1.02, Math.PI * 1.98)
  ctx.stroke()
  ctx.lineWidth = R * 0.07
  ctx.beginPath()
  ctx.arc(cx, cy, R * 1.12, Math.PI * 0.08, Math.PI * 0.92)
  ctx.stroke()
  ctx.shadowBlur = 24
  ctx.lineWidth = R * 0.06
  ctx.strokeStyle = 'rgba(255,250,240,.95)'
  ctx.beginPath()
  ctx.arc(cx, cy, R * 1.2, Math.PI * 1.1, Math.PI * 1.9)
  ctx.stroke()
  // the disk behind
  ctx.shadowBlur = 40
  ctx.lineWidth = R * 0.13
  ctx.strokeStyle = diskGrad(0.9)
  ctx.beginPath()
  ctx.ellipse(cx, cy, R * 2.9, R * 0.24, tilt, Math.PI, Math.PI * 2)
  ctx.stroke()
  ctx.restore()

  // the shadow and its photon ring
  ctx.beginPath()
  ctx.arc(cx, cy, R, 0, Math.PI * 2)
  ctx.fillStyle = '#010003'
  ctx.fill()
  ctx.save()
  ctx.shadowColor = 'rgba(255,220,170,1)'
  ctx.shadowBlur = 16
  ctx.lineWidth = 2.5
  ctx.strokeStyle = '#fff1d6'
  ctx.stroke()
  ctx.restore()

  // the near side of the disk, crossing in front
  ctx.save()
  ctx.shadowColor = 'rgba(255,150,70,1)'
  ctx.shadowBlur = 40
  ctx.lineWidth = R * 0.17
  ctx.strokeStyle = diskGrad(1)
  ctx.beginPath()
  ctx.ellipse(cx, cy, R * 2.9, R * 0.24, tilt, 0, Math.PI)
  ctx.stroke()
  ctx.lineWidth = R * 0.05
  ctx.strokeStyle = 'rgba(255,255,250,.9)'
  ctx.beginPath()
  ctx.ellipse(cx, cy, R * 2.75, R * 0.21, tilt, 0.15, Math.PI - 0.15)
  ctx.stroke()
  ctx.restore()

  // keep the emblem inky (little foil) with a stamped photon ring
  m.ctx.fillStyle = 'rgb(40,0,0)'
  m.ctx.beginPath()
  m.ctx.ellipse(cx, cy, R * 2.8, R * 1.5, tilt, 0, Math.PI * 2)
  m.ctx.fill()
  m.ctx.strokeStyle = '#0f0'
  m.ctx.lineWidth = 4
  m.ctx.beginPath()
  m.ctx.arc(cx, cy, R, 0, Math.PI * 2)
  m.ctx.stroke()
}

function stamp(p, m, text, font, x, y, tracking, fill) {
  for (const [c, col] of [
    [p.ctx, fill],
    [m.ctx, '#0f0'],
  ]) {
    c.font = font
    c.fillStyle = col
    tracked(c, text, x, y, tracking)
  }
}

function frontPrint() {
  const { p, m } = canvases()
  const cy = DH * 0.49
  background(p, m, cy)
  seals(p, m)
  emblem(p, m, DW / 2, cy, 118)

  const silver = (() => {
    const g = p.ctx.createLinearGradient(0, 260, 0, 380)
    g.addColorStop(0, '#ffffff')
    g.addColorStop(0.5, '#c9cde0')
    g.addColorStop(1, '#f4f2ff')
    return g
  })()
  stamp(p, m, '✦  CELESTIAL TRADING CARDS  ✦', `500 25px ${SANS}`, DW / 2, 262, 9, '#d8d2f5')
  stamp(p, m, SET_NAME.toUpperCase(), `600 150px ${SANS}`, DW / 2 + 16, 400, 32, silver)
  stamp(p, m, 'BOOSTER PACK', `600 48px ${SANS}`, DW / 2 + 8, DH * 0.755, 18, '#f3e3bf')
  p.ctx.font = `400 26px ${SANS}`
  p.ctx.fillStyle = '#b7b0d8'
  tracked(p.ctx, `${PACK_SIZE} COSMIC CARDS  ·  ${SET_SERIES.toUpperCase()}`, DW / 2, DH * 0.755 + 56, 8)
  p.ctx.font = `italic 500 38px ${SERIF}`
  p.ctx.fillStyle = '#e8d6ff'
  p.ctx.textAlign = 'center'
  p.ctx.fillText('a holographic black hole in every pack', DW / 2, DH * 0.755 + 122)

  // the tear line
  const ty = (1 - TEAR_Y) * DH
  p.ctx.save()
  p.ctx.strokeStyle = 'rgba(230,225,255,.45)'
  p.ctx.setLineDash([10, 9])
  p.ctx.lineWidth = 2
  p.ctx.beginPath()
  p.ctx.moveTo(60, ty)
  p.ctx.lineTo(DW, ty)
  p.ctx.stroke()
  p.ctx.restore()
  p.ctx.fillStyle = 'rgba(230,225,255,.7)'
  p.ctx.font = `500 16px ${SANS}`
  tracked(p.ctx, 'TEAR  HERE', 120, ty - 12, 5, 'left')
  p.ctx.beginPath()
  p.ctx.moveTo(0, ty - 14)
  p.ctx.lineTo(26, ty)
  p.ctx.lineTo(0, ty + 14)
  p.ctx.fillStyle = '#05030c'
  p.ctx.fill()

  // set checklist: one pip per card
  const pipY = DH * 0.9
  for (let i = 0; i < SET_SIZE; i++) {
    const x = DW / 2 + (i - (SET_SIZE - 1) / 2) * 34
    p.ctx.beginPath()
    p.ctx.arc(x, pipY, i === SET_SIZE - 1 ? 8 : 5, 0, Math.PI * 2)
    p.ctx.fillStyle = i === SET_SIZE - 1 ? '#ffd79a' : 'rgba(220,214,255,.55)'
    p.ctx.fill()
  }
  return { p, m }
}

function backPrint() {
  const { p, m } = canvases()
  const cy = DH * 0.4
  background(p, m, cy)
  seals(p, m)
  emblem(p, m, DW / 2, cy, 70)
  stamp(p, m, SET_NAME.toUpperCase(), `600 70px ${SANS}`, DW / 2 + 10, DH * 0.6, 20, '#eceaff')
  p.ctx.font = `400 24px ${SANS}`
  p.ctx.fillStyle = '#b7b0d8'
  const lines = [
    `CONTAINS ${PACK_SIZE} CARDS FROM A SET OF ${SET_SIZE}`,
    'SEVEN COSMIC FEATURES, RAREST LAST',
    'ONE HOLOGRAPHIC BLACK HOLE',
  ]
  lines.forEach((l, i) => tracked(p.ctx, l, DW / 2, DH * 0.66 + i * 44, 4))
  p.ctx.font = `italic 500 30px ${SERIF}`
  p.ctx.fillStyle = '#cfc2ef'
  p.ctx.textAlign = 'center'
  p.ctx.fillText('Keep away from event horizons.', DW / 2, DH * 0.82)
  // barcode
  let x = DW / 2 - 130
  let s = 3
  p.ctx.fillStyle = '#efeefa'
  p.ctx.fillRect(DW / 2 - 150, DH * 0.85, 300, 90)
  p.ctx.fillStyle = '#111'
  while (x < DW / 2 + 130) {
    s = (s * 48271) % 2147483647
    const w = 2 + (s % 4)
    p.ctx.fillRect(x, DH * 0.855, w, 70)
    x += w + 2 + ((s >> 3) % 4)
  }
  return { p, m }
}

function tex(canvas) {
  const t = new THREE.CanvasTexture(canvas)
  t.anisotropy = 8
  t.minFilter = THREE.LinearMipmapLinearFilter
  return t
}

const VERT = /* glsl */ `
uniform float uPuff;
uniform float uTear;
uniform float uPart;
varying vec2 vUv;
varying vec3 vPos;
varying vec3 vN;
varying vec3 vT;

float h21(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vn(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1, 0)), u.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), u.x), u.y);
}
float height(vec2 uv) {
  float x = uv.x * 2. - 1.;
  float body = smoothstep(.04, .17, uv.y) * smoothstep(.96, .83, uv.y);
  float side = 1. - pow(abs(x), 2.6);
  float h = body * side * uPuff;
  float seal = 1. - smoothstep(.045, .06, min(uv.y, 1. - uv.y));
  h += seal * .004 * sin(uv.x * 420.);
  h += (vn(uv * vec2(6., 10.)) - .5) * .022 * body * side;
  h += (vn(uv * vec2(19., 27.) + 4.) - .5) * .007 * body;
  return h;
}
void main() {
  vUv = uv;
  vec3 p = position;
  float h = height(uv);
  p.z += h;
  // a strip that has torn free curls back off the pack
  if (uPart > .5) {
    float freed = smoothstep(uv.x - .02, uv.x + .1, uTear * 1.05);
    p.z += freed * (uv.y - ${TEAR_Y.toFixed(3)}) * 1.6;
  }
  float e = .004;
  float hx = (height(uv + vec2(e, 0.)) - height(uv - vec2(e, 0.))) / (2. * e * ${PACK_W.toFixed(3)});
  float hy = (height(uv + vec2(0., e)) - height(uv - vec2(0., e))) / (2. * e * ${PACK_H.toFixed(3)});
  vec3 n = normalize(vec3(-hx, -hy, 1.));
  vec4 wp = modelMatrix * vec4(p, 1.);
  vPos = wp.xyz;
  vN = normalize(mat3(modelMatrix) * n);
  vT = normalize(mat3(modelMatrix) * vec3(1., 0., 0.));
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`

const FRAG = /* glsl */ `
uniform sampler2D uPrint;
uniform sampler2D uPMask;
uniform float uTear;
uniform float uPart;
uniform float uTime;
uniform float uHover;
uniform vec3 uLight;
varying vec2 vUv;
varying vec3 vPos;
varying vec3 vN;
varying vec3 vT;

float h21(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
vec2 h22(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.xx + p3.yz) * p3.zy); }
vec3 spectrum(float t) { return .5 + .5 * cos(6.28318 * (t + vec3(0., .33, .67))); }
float vn(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1, 0)), u.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), u.x), u.y);
}
float sq(float x) { return x * x; }
float tearY(float x) { return ${TEAR_Y.toFixed(3)} + .004 * sin(x * 97.) + .003 * sin(x * 231. + 1.) + .002 * sin(x * 517.); }

void main() {
  vec2 uv = vUv;
  float ty = tearY(uv.x);
  if (uPart < .5 && uv.y > ty) discard;
  if (uPart > .5 && uv.y <= ty) discard;

  vec3 N = normalize(vN);
  vec3 T = normalize(vT);
  vec3 B = cross(N, T);
  // fine crinkle in the foil
  vec2 cuv = uv * vec2(34., 54.);
  vec2 cr = vec2(vn(cuv), vn(cuv + 7.3)) - .5;
  cr += (vec2(vn(cuv * 2.7 + 3.1), vn(cuv * 2.7 + 9.4)) - .5) * .5;
  N = normalize(N + (T * cr.x + B * cr.y) * .1);
  vec3 V = normalize(cameraPosition - vPos);
  vec3 L = normalize(uLight - vPos);
  vec3 H = normalize(L + V);
  vec3 R = reflect(-V, N);

  vec3 ink = texture2D(uPrint, uv).rgb;
  vec3 mk = texture2D(uPMask, uv).rgb;
  float diff = .38 + .75 * max(dot(N, L), 0.);
  float env = .06 + .85 * smoothstep(.15, .95, R.y) + .75 * exp(-sq((R.x + .45) / .13)) +
              .4 * exp(-sq((R.x - .55) / .22)) * smoothstep(-.5, .5, R.y);
  vec3 film = spectrum(R.x * 1.4 + R.y * 1.1 + uv.y * 1.6 + uv.x * .7);
  vec3 foil = mix(vec3(.92, .94, 1.), film, .72) * env;
  float spec = pow(max(dot(N, H), 0.), 70.);

  vec3 col = ink * diff;
  col = mix(col, ink * .35 + foil * (.55 + .7 * ink), mk.r * .85);
  col = mix(col, ink * .62 + foil * .75 + vec3(spec) * 1.4, mk.g);
  col = mix(col, ink * (.38 + env * .18) + vec3(spec) * .25, mk.b);
  col += vec3(spec) * .45;

  // glitter in the foil
  vec2 gp = uv * vec2(1., 1.58) * 150.;
  vec2 id = floor(gp);
  vec2 h1 = h22(id);
  vec3 fn = normalize(N + (T * (h1.x - .5) + B * (h1.y - .5)) * .5);
  float g = pow(max(dot(fn, H), 0.), 240.) * smoothstep(.45, .1, length(fract(gp) - .5));
  col += mix(vec3(1.), spectrum(h1.x * 3.), .5) * g * 4. * (mk.r + mk.g) * smoothstep(1.4, .5, length(fwidth(gp)));

  // the tear: a seam of light where it has split
  float d = abs(uv.y - ty);
  float torn = step(uv.x, uTear * 1.04);
  col += vec3(1., .85, .6) * exp(-d * 420.) * torn * 3.;
  // and a hint of where to tear before anyone has
  col += vec3(.8, .75, 1.) * exp(-d * 600.) * (1. - torn) * (.25 + .25 * sin(uTime * 3. - uv.x * 8.)) * uHover;
  gl_FragColor = vec4(col, 1.);
}
`

export class Pack {
  constructor(light) {
    const front = frontPrint()
    const back = backPrint()
    this.textures = [tex(front.p.c), tex(front.m.c), tex(back.p.c), tex(back.m.c)]
    const geom = new THREE.PlaneGeometry(PACK_W, PACK_H, 48, 80)
    this.geom = geom
    this.uniforms = {
      uPuff: { value: 0.12 },
      uTear: { value: 0 },
      uTime: { value: 0 },
      uHover: { value: 0 },
      uLight: { value: light },
    }
    const mat = (print, mask, part) =>
      new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms: {
          ...this.uniforms,
          uPrint: { value: print },
          uPMask: { value: mask },
          uPart: { value: part },
        },
      })
    this.materials = [
      mat(this.textures[0], this.textures[1], 0),
      mat(this.textures[2], this.textures[3], 0),
      mat(this.textures[0], this.textures[1], 1),
      mat(this.textures[2], this.textures[3], 1),
    ]
    this.group = new THREE.Group()
    this.body = new THREE.Group()
    this.front = new THREE.Mesh(geom, this.materials[0])
    this.backMesh = new THREE.Mesh(geom, this.materials[1])
    this.backMesh.rotation.y = Math.PI
    this.body.add(this.front, this.backMesh)

    // the strip pivots about its own centre when it flies
    this.strip = new THREE.Group()
    const sy = (TEAR_Y - 0.5) * PACK_H + ((1 - TEAR_Y) * PACK_H) / 2
    this.strip.position.y = sy
    const sf = new THREE.Mesh(geom, this.materials[2])
    const sb = new THREE.Mesh(geom, this.materials[3])
    sb.rotation.y = Math.PI
    sf.position.y = -sy
    sb.position.y = -sy
    this.strip.add(sf, sb)
    this.group.add(this.body, this.strip)

    // light pouring out of the opened top
    this.spill = new THREE.Mesh(
      new THREE.PlaneGeometry(PACK_W * 1.6, 1.6),
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uI: { value: 0 }, uTime: this.uniforms.uTime },
        vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }`,
        fragmentShader: `
          uniform float uI; uniform float uTime; varying vec2 vUv;
          float sq(float x) { return x * x; }
          void main(){
            vec2 p = vUv - vec2(.5, 0.);
            float w = .3 + p.y * .4;
            float beam = exp(-sq(p.x / w) * 3.) * exp(-p.y * 3.2) * smoothstep(0., .04, p.y);
            float rays = .6 + .4 * sin(atan(p.x, p.y + .2) * 40. + uTime * 1.5);
            float base = exp(-pow(abs(p.x) / .33, 8.)) * exp(-p.y * 40.);
            vec3 c = mix(vec3(1., .82, .55), vec3(.7, .6, 1.), clamp(p.y * 1.6, 0., 1.));
            gl_FragColor = vec4(c * (beam * rays * .8 + base * .9) * uI, 1.);
          }`,
      }),
    )
    this.spill.position.set(0, TEAR_Y * PACK_H - PACK_H / 2 + 0.78, 0.02)
    this.spill.renderOrder = 5
    this.group.add(this.spill)
  }

  // pack-local x of the tear front, for sparks
  tearPoint(out) {
    const t = this.uniforms.uTear.value
    return out.set((t - 0.5) * PACK_W, (TEAR_Y - 0.5) * PACK_H, 0.03)
  }

  dispose() {
    this.textures.forEach((t) => t.dispose())
    this.materials.forEach((m) => m.dispose())
    this.geom.dispose()
    this.spill.geometry.dispose()
    this.spill.material.dispose()
  }
}
