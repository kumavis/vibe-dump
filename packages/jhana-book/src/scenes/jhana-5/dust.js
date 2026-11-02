// dust.js — a field of soft points of light (stars, motes) for spreads 5 and 6.
//
// One THREE.Points with a small shader, so a thousand specks cost one draw call
// and no per-frame CPU work. Three things happen on the GPU:
//   • drift: each speck slides slowly along x and wraps inside ±wrapX, fading
//     out near the ends so the wrap is never seen;
//   • twinkle: a slow per-speck sine (periods of 12–30 s, nothing flickers);
//   • the fold: the speck's polar angle about the spine (spread z axis) is
//     scaled by openness, so the whole field closes like a fan with the book
//     and always stays in the wedge above the pages. Specks are generated with
//     y > 0 and a polar angle under ~77°, so at any θ they sit strictly
//     between the pages.
// Alpha is the caller's (multiply by frame.reveal). No shadows, no depth write.

const VERT = /* glsl */ `
uniform float uTime;
uniform float uOpen;
uniform float uHalfH;
uniform float uSize;
uniform float uWrap;
attribute float aSize;
attribute float aSeed;
attribute float aDrift;
attribute vec3 aColor;
varying vec3 vColor;
varying float vTw;
void main() {
  vec3 p = position;
  p.x = mod(p.x + aDrift * uTime + uWrap, 2.0 * uWrap) - uWrap;
  float edge = smoothstep(uWrap, uWrap * 0.78, abs(p.x));
  float r = length(p.xy);
  float a = atan(p.x, p.y) * uOpen;
  p.xy = r * vec2(sin(a), cos(a));
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = max(1.0, aSize * uSize * projectionMatrix[1][1] * uHalfH / -mv.z);
  vTw = edge * (0.62 + 0.38 * sin(uTime * (0.21 + 0.31 * aSeed) + aSeed * 37.0));
  vColor = aColor;
}
`

const FRAG = /* glsl */ `
uniform float uAlpha;
varying vec3 vColor;
varying float vTw;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float r2 = dot(d, d) * 4.0;
  if (r2 > 1.0) discard;
  float core = exp(-r2 * 9.0);
  float halo = (1.0 - r2) * (1.0 - r2) * 0.22;
  gl_FragColor = vec4(vColor * (core + halo) * vTw * uAlpha, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`

// specks: { count, place(rnd, out) → fills out.{x,y,z,size,drift}, color(rnd, outColor) }
export function createDust(THREE, rnd, { count, place, color, wrapX = 1.4, size = 1 }) {
  const pos = new Float32Array(count * 3)
  const col = new Float32Array(count * 3)
  const sz = new Float32Array(count)
  const seed = new Float32Array(count)
  const drift = new Float32Array(count)
  const o = { x: 0, y: 0, z: 0, size: 0.02, drift: 0 }
  const c = new THREE.Color()
  for (let i = 0; i < count; i++) {
    place(rnd, o, i)
    pos[i * 3] = o.x
    pos[i * 3 + 1] = o.y
    pos[i * 3 + 2] = o.z
    sz[i] = o.size
    drift[i] = o.drift
    seed[i] = rnd()
    color(rnd, c, i)
    col[i * 3] = c.r
    col[i * 3 + 1] = c.g
    col[i * 3 + 2] = c.b
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geometry.setAttribute('aColor', new THREE.BufferAttribute(col, 3))
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sz, 1))
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
  geometry.setAttribute('aDrift', new THREE.BufferAttribute(drift, 1))
  // The wedge fold moves points far from where the bounds say; never cull.
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e4)

  const uniforms = {
    uTime: { value: 0 },
    uOpen: { value: 1 },
    uHalfH: { value: 400 },
    uSize: { value: size },
    uWrap: { value: wrapX },
    uAlpha: { value: 0 },
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
  points.frustumCulled = false
  points.renderOrder = 3 // after the paper
  const buf = new THREE.Vector2()
  points.onBeforeRender = (renderer) => {
    renderer.getDrawingBufferSize(buf)
    uniforms.uHalfH.value = buf.y / 2
  }

  return {
    points,
    uniforms,
    // time in seconds, openness 0..1, alpha 0..1 (already × reveal)
    update(time, openness, alpha) {
      uniforms.uTime.value = time
      uniforms.uOpen.value = openness
      uniforms.uAlpha.value = alpha
      points.visible = alpha > 0.002
    },
    dispose() {
      geometry.dispose()
      material.dispose()
    },
  }
}
