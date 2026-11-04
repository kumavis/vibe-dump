// rising.js — light that drifts upward, for jhana-1 (sparks, bubbles) and
// jhana-2 (motes over the spring). Light is the one unreal thing in the book,
// so it gets a tiny shader instead of paper.
//
// Everything moves on the GPU from per-particle seeds: the CPU only advances
// one number, `phase`, whose speed the scene ties to the breath. A particle's
// life is fract(seed + phase · speed), so quickening the phase quickens every
// particle together — smoothly, with no respawn pops (each one fades in at the
// bottom of its path and out at the top). Deterministic: seeds come from
// paper.rng, no Math.random, no per-frame allocation.

const VERT = /* glsl */ `
attribute vec3 aDrift;
attribute vec4 aSeed;
uniform float uPhase;
uniform float uTime;
uniform float uSize;
uniform float uScale;
uniform float uSway;
uniform float uLift;
uniform float uTwinkle;
uniform float uShrink;
uniform float uRate;
varying float vAlpha;
varying float vLife;
void main() {
  float life = fract(aSeed.x + uPhase * (0.65 + 0.7 * aSeed.y));
  // ease-out rise: quick to leave the paper, lingering as it fades
  float k = life * (1.6 - 0.6 * life);
  vec3 p = position + aDrift * k;
  float w = uTime * (0.22 + 0.2 * aSeed.y) + aSeed.z * 6.2831853;
  p.x += uSway * sin(w) * k;
  p.z += uSway * cos(w * 0.83) * k;
  p.y *= uLift;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float tw = 0.5 + 0.5 * sin(uTime * (0.55 + 0.9 * aSeed.w) + aSeed.z * 19.0);
  vAlpha = smoothstep(0.0, 0.14, life) * (1.0 - smoothstep(0.55, 1.0, life)) * (1.0 - uTwinkle * tw);
  // uRate < 1 thins the stream: each particle has a fixed rank, and those
  // ranked above the rate fade out (softly, so a changing rate never pops)
  float rank = fract(aSeed.x * 7.31 + aSeed.z * 3.17);
  vAlpha *= smoothstep(rank - 0.08, rank, uRate * 1.08);
  vLife = life;
  float size = uSize * (0.55 + 0.9 * aSeed.w) * (1.0 - uShrink * life);
  gl_PointSize = max(1.0, size * uScale / max(0.05, -mv.z));
}
`

const FRAG = /* glsl */ `
uniform sampler2D uMap;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uOpacity;
varying float vAlpha;
varying float vLife;
void main() {
  vec4 t = texture2D(uMap, gl_PointCoord);
  vec3 col = mix(uColorA, uColorB, smoothstep(0.0, 0.9, vLife));
  gl_FragColor = vec4(col * t.rgb, t.a * vAlpha * uOpacity);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`

// Canvas sprites. 'spark': hot core, soft falloff. 'bubble': a thin bright
// ring with a faint fill. 'glow': a wide soft disc for halos. 'mark': a short
// pencil stroke.
export function spriteTexture(THREE, kind = 'spark', size = 64) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')
  const r = size / 2
  if (kind === 'mark') {
    // a pencil mark: a short, slightly wavering stroke with a soft edge
    g.lineCap = 'round'
    g.strokeStyle = 'rgba(255,255,255,0.9)'
    g.lineWidth = size * 0.07
    g.beginPath()
    g.moveTo(size * 0.16, r * 1.04)
    g.bezierCurveTo(size * 0.36, r * 0.82, size * 0.52, r * 1.2, size * 0.84, r * 0.94)
    g.stroke()
  } else if (kind === 'bubble') {
    const grad = g.createRadialGradient(r, r, 0, r, r, r)
    grad.addColorStop(0, 'rgba(255,255,255,0.06)')
    grad.addColorStop(0.55, 'rgba(255,255,255,0.14)')
    grad.addColorStop(0.78, 'rgba(255,255,255,0.55)')
    grad.addColorStop(0.9, 'rgba(255,255,255,0.18)')
    grad.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grad
    g.fillRect(0, 0, size, size)
    // a small highlight, up and to the left, so it reads as a sphere
    const hl = g.createRadialGradient(r * 0.68, r * 0.66, 0, r * 0.68, r * 0.66, r * 0.22)
    hl.addColorStop(0, 'rgba(255,255,255,0.7)')
    hl.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = hl
    g.fillRect(0, 0, size, size)
  } else {
    const grad = g.createRadialGradient(r, r, 0, r, r, r)
    if (kind === 'glow') {
      grad.addColorStop(0, 'rgba(255,255,255,1)')
      grad.addColorStop(0.18, 'rgba(255,255,255,0.55)')
      grad.addColorStop(0.45, 'rgba(255,255,255,0.16)')
      grad.addColorStop(1, 'rgba(255,255,255,0)')
    } else {
      grad.addColorStop(0, 'rgba(255,255,255,1)')
      grad.addColorStop(0.16, 'rgba(255,255,255,0.9)')
      grad.addColorStop(0.4, 'rgba(255,255,255,0.22)')
      grad.addColorStop(1, 'rgba(255,255,255,0)')
    }
    g.fillStyle = grad
    g.fillRect(0, 0, size, size)
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

// risingPoints(THREE, { count, rnd, spawn, map, ... }) → { points, uniforms, dispose }
//   spawn(i, rnd, out) fills out.origin [x,y,z] and out.drift [dx,dy,dz]: where
//   the particle starts and how far it travels over one life (spread space).
//   The returned uniforms are live: the scene sets uPhase, uTime, uOpacity,
//   uLift (0..1, squash toward the page as it closes) each frame, and may set
//   uRate (0..1, the share of particles shown; 1 by default).
export function risingPoints(THREE, opts) {
  const { count, rnd, spawn, map, size = 0.03, colorA, colorB, sway = 0.03, twinkle = 0.4, shrink = 0.4 } = opts
  const pos = new Float32Array(count * 3)
  const drift = new Float32Array(count * 3)
  const seed = new Float32Array(count * 4)
  const out = { origin: [0, 0, 0], drift: [0, 0, 0] }
  for (let i = 0; i < count; i++) {
    spawn(i, rnd, out)
    pos.set(out.origin, i * 3)
    drift.set(out.drift, i * 3)
    seed[i * 4] = rnd()
    seed[i * 4 + 1] = rnd()
    seed[i * 4 + 2] = rnd()
    seed[i * 4 + 3] = rnd()
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geometry.setAttribute('aDrift', new THREE.BufferAttribute(drift, 3))
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seed, 4))
  const uniforms = {
    uPhase: { value: 0 },
    uTime: { value: 0 },
    uSize: { value: size },
    uScale: { value: 400 },
    uSway: { value: sway },
    uLift: { value: 1 },
    uTwinkle: { value: twinkle },
    uShrink: { value: shrink },
    uRate: { value: 1 },
    uOpacity: { value: 0 },
    uMap: { value: map },
    uColorA: { value: new THREE.Color(colorA) },
    uColorB: { value: new THREE.Color(colorB ?? colorA) },
  }
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const points = new THREE.Points(geometry, material)
  points.frustumCulled = false // positions live in the shader
  points.renderOrder = 3 // after the paper and the glows
  points.castShadow = false
  points.receiveShadow = false
  // World-size points: pixels = size · (buffer height / 2) · cot(fov / 2) / depth.
  const buf = new THREE.Vector2()
  points.onBeforeRender = (renderer, scene, camera) => {
    renderer.getDrawingBufferSize(buf)
    uniforms.uScale.value = 0.5 * buf.y * camera.projectionMatrix.elements[5]
  }
  return {
    points,
    uniforms,
    dispose() {
      geometry.dispose()
      material.dispose()
    },
  }
}
