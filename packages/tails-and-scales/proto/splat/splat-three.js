// Gaussian splats drawn by three.js, among its meshes: a SplatMesh is one instanced quad per splat, drawn
// after the opaque scene, depth-tested against it (a mesh in front hides the fur behind it) and not
// writing depth, back to front (re-sorted before each draw), blended over what is already there.
// The projection (EWA: the 3D covariance to a screen ellipse) and the two-tone shading follow the
// splat-squirrel renderer (src/renderer.js); the colours go through three's tone mapping and output
// colour space, as the meshes beside them do.
//
//   bakeSplats(model, bones)   the model (CONTRACT.md's SplatModel) in a fixed pose: each splat's centre,
//                              covariance and normal skinned once, on the CPU (a figure holds its pose)
//   new SplatMesh(baked, { splatScale })   the mesh; set its `light` (world space, toward the light), and
//                              call its sort(camera) before each renderer.render, once the scene's and the
//                              camera's world matrices are current
import * as THREE from 'three'

const ROW = 1024 // splats per data-texture row

export function bakeSplats(model, bones) {
  const N = model.count
  const C = new Float32Array(N * 4), S0 = new Float32Array(N * 4), S1 = new Float32Array(N * 4), NR = new Float32Array(N * 4), CO = new Float32Array(N * 4)
  const M = new Float32Array(16), R = new Float32Array(9), S = new Float32Array(9), T = new Float32Array(9)
  for (let i = 0; i < N; i++) {
    const b0 = model.bones[2 * i], b1 = model.bones[2 * i + 1], w = model.weights[i]
    for (let k = 0; k < 16; k++) M[k] = w * bones[16 * b0 + k] + (1 - w) * bones[16 * b1 + k]
    const px = model.positions[3 * i], py = model.positions[3 * i + 1], pz = model.positions[3 * i + 2]
    C[4 * i] = M[0] * px + M[4] * py + M[8] * pz + M[12]
    C[4 * i + 1] = M[1] * px + M[5] * py + M[9] * pz + M[13]
    C[4 * i + 2] = M[2] * px + M[6] * py + M[10] * pz + M[14]
    C[4 * i + 3] = model.colors[4 * i + 3] / 255
    // Σ = R diag(s²) Rᵀ, then A Σ Aᵀ with A the skinning matrix's linear part (row-major 3×3 here)
    const x = model.rotations[4 * i], y = model.rotations[4 * i + 1], z = model.rotations[4 * i + 2], q = model.rotations[4 * i + 3]
    R[0] = 1 - 2 * (y * y + z * z); R[1] = 2 * (x * y - q * z); R[2] = 2 * (x * z + q * y)
    R[3] = 2 * (x * y + q * z); R[4] = 1 - 2 * (x * x + z * z); R[5] = 2 * (y * z - q * x)
    R[6] = 2 * (x * z - q * y); R[7] = 2 * (y * z + q * x); R[8] = 1 - 2 * (x * x + y * y)
    const s0 = model.scales[3 * i] ** 2, s1 = model.scales[3 * i + 1] ** 2, s2 = model.scales[3 * i + 2] ** 2
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) S[3 * r + c] = R[3 * r] * s0 * R[3 * c] + R[3 * r + 1] * s1 * R[3 * c + 1] + R[3 * r + 2] * s2 * R[3 * c + 2]
    // A (row r, col c) = M[4c + r]
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) T[3 * r + c] = M[r] * S[c] + M[4 + r] * S[3 + c] + M[8 + r] * S[6 + c]
    const sig = (r, c) => T[3 * r] * M[c] + T[3 * r + 1] * M[4 + c] + T[3 * r + 2] * M[8 + c]
    S0[4 * i] = sig(0, 0); S0[4 * i + 1] = sig(0, 1); S0[4 * i + 2] = sig(0, 2); S0[4 * i + 3] = sig(1, 1)
    S1[4 * i] = sig(1, 2); S1[4 * i + 1] = sig(2, 2)
    S1[4 * i + 2] = model.shading[2 * i] / 255; S1[4 * i + 3] = model.shading[2 * i + 1] / 255
    const nx = model.normals[3 * i], ny = model.normals[3 * i + 1], nz = model.normals[3 * i + 2]
    const mx = M[0] * nx + M[4] * ny + M[8] * nz, my = M[1] * nx + M[5] * ny + M[9] * nz, mz = M[2] * nx + M[6] * ny + M[10] * nz
    const l = Math.hypot(mx, my, mz) || 1
    NR[4 * i] = mx / l; NR[4 * i + 1] = my / l; NR[4 * i + 2] = mz / l
    CO[4 * i] = model.colors[4 * i] / 255; CO[4 * i + 1] = model.colors[4 * i + 1] / 255; CO[4 * i + 2] = model.colors[4 * i + 2] / 255
  }
  return { count: N, C, S0, S1, NR, CO }
}

function dataTexture(arr, count) {
  const rows = Math.max(1, Math.ceil(count / ROW))
  const data = new Float32Array(ROW * rows * 4)
  data.set(arr.subarray(0, count * 4))
  const t = new THREE.DataTexture(data, ROW, rows, THREE.RGBAFormat, THREE.FloatType)
  t.minFilter = t.magFilter = THREE.NearestFilter
  t.needsUpdate = true
  return t
}

const VS = /* glsl */ `
precision highp float;
uniform highp sampler2D tC, tS0, tS1, tN, tCol;
uniform vec2 uViewport;     // drawing buffer, pixels
uniform float uScale2;      // splatScale²
uniform vec3 uLight;        // view space, toward the light
in float aIndex;
out vec4 vColor;
out vec2 vPos;
void main() {
  vColor = vec4(0.0);
  vPos = vec2(0.0);
  gl_Position = vec4(0.0, 0.0, 2.0, 1.0);   // clipped unless the splat survives
  int k = int(aIndex + 0.5);
  ivec2 tc = ivec2(k % ${ROW}, k / ${ROW});
  vec4 c0 = texelFetch(tC, tc, 0);
  float alpha = c0.w;
  if (alpha < 1.0 / 255.0) return;
  vec4 pv = modelViewMatrix * vec4(c0.xyz, 1.0);
  vec4 clip = projectionMatrix * pv;
  if (clip.w <= 0.0 || abs(clip.z) > clip.w) return;
  vec4 s0 = texelFetch(tS0, tc, 0), s1 = texelFetch(tS1, tc, 0);
  mat3 Sigma = mat3(s0.x, s0.y, s0.z, s0.y, s0.w, s1.x, s0.z, s1.x, s1.y);
  mat3 W = mat3(modelViewMatrix);
  vec2 focal = vec2(projectionMatrix[0][0], projectionMatrix[1][1]) * uViewport * 0.5;
  vec2 lim = 1.3 / vec2(projectionMatrix[0][0], projectionMatrix[1][1]);
  float tz = -pv.z, itz = 1.0 / tz;
  vec2 txy = clamp(pv.xy * itz, -lim, lim) * tz;
  vec3 r0 = vec3(focal.x * itz, 0.0, focal.x * txy.x * itz * itz) * W;
  vec3 r1 = vec3(0.0, focal.y * itz, focal.y * txy.y * itz * itz) * W;
  vec3 Sr0 = Sigma * r0, Sr1 = Sigma * r1;
  float ca = dot(r0, Sr0) * uScale2 + 0.3, cb = dot(r0, Sr1) * uScale2, cc = dot(r1, Sr1) * uScale2 + 0.3;
  float mid = 0.5 * (ca + cc), dd = 0.5 * (ca - cc), rad = sqrt(dd * dd + cb * cb);
  vec2 sg = sqrt(max(vec2(mid + rad, mid - rad), vec2(0.09)));
  vec2 v1 = dd >= 0.0 ? vec2(dd + rad, cb) : vec2(cb, rad - dd);
  float vl = length(v1);
  v1 = vl > 1e-20 ? v1 / vl : vec2(1.0, 0.0);
  vec2 v2 = vec2(-v1.y, v1.x);
  float kk = sqrt(min(8.0, 2.0 * log(255.0 * alpha)));
  vec2 ax = min(kk * sg, vec2(256.0));
  vec2 ndc = clip.xy / clip.w;
  vec2 corner = position.xy;
  vec2 off = corner.x * ax.x * v1 + corner.y * ax.y * v2;
  // every corner at the splat's own depth: the scene's depth buffer hides it behind a mesh
  gl_Position = vec4((ndc + off * (2.0 / uViewport)) * clip.w, clip.z, clip.w);
  vPos = corner * ax / sg;
  // the two-tone shading (display space, as the splat-squirrel renderer), then linear for three
  vec3 albedo = texelFetch(tCol, tc, 0).rgb;
  vec3 n = normalize(W * texelFetch(tN, tc, 0).xyz);
  float lit = s1.z, ao = s1.w;
  vec3 V = normalize(-pv.xyz);
  float kt = smoothstep(-0.08, 0.12, dot(n, uLight));
  vec3 sh = mix(vec3(0.66, 0.60, 0.78), vec3(1.0), kt) * mix(1.0, ao, 0.8);
  float rr = 1.0 - clamp(dot(n, V), 0.0, 1.0);
  vec3 c = mix(albedo, albedo * sh + rr * rr * rr * 0.28 * vec3(1.0, 0.86, 0.66), lit);
  vColor = vec4(pow(clamp(c, 0.0, 1.0), vec3(2.2)), alpha);
}
`
const FS = /* glsl */ `
precision highp float;
// (a GLSL3 ShaderMaterial declares no output; three's tone-mapping and colour-space chunks write gl_FragColor)
layout(location = 0) out highp vec4 pc_fragColor;
#define gl_FragColor pc_fragColor
in vec4 vColor;
in vec2 vPos;
void main() {
  float d2 = dot(vPos, vPos);
  if (d2 > 8.0) discard;
  float a = vColor.a * exp(-0.5 * d2);
  if (a < 1.0 / 255.0) discard;
  gl_FragColor = vec4(vColor.rgb, a);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`

export class SplatMesh extends THREE.Mesh {
  constructor(baked, { splatScale = 1.5 } = {}) {
    const geo = new THREE.InstancedBufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute([-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0], 3))
    geo.setIndex([0, 1, 2, 2, 1, 3])
    const order = new Float32Array(baked.count)
    for (let i = 0; i < baked.count; i++) order[i] = i
    const aIndex = new THREE.InstancedBufferAttribute(order, 1)
    aIndex.setUsage(THREE.DynamicDrawUsage)
    geo.setAttribute('aIndex', aIndex)
    geo.instanceCount = baked.count
    const mat = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3, vertexShader: VS, fragmentShader: FS,
      uniforms: {
        tC: { value: dataTexture(baked.C, baked.count) }, tS0: { value: dataTexture(baked.S0, baked.count) }, tS1: { value: dataTexture(baked.S1, baked.count) },
        tN: { value: dataTexture(baked.NR, baked.count) }, tCol: { value: dataTexture(baked.CO, baked.count) },
        uViewport: { value: new THREE.Vector2(1, 1) }, uScale2: { value: splatScale * splatScale }, uLight: { value: new THREE.Vector3(0, 1, 0) },
      },
      transparent: true, depthWrite: false, depthTest: true, blending: THREE.NormalBlending,
    })
    super(geo, mat)
    this.frustumCulled = false
    this.renderOrder = 10
    this.baked = baked
    this.light = new THREE.Vector3(-0.4, 0.8, 0.45).normalize()
    this.keys = new Uint16Array(baked.count)
    this.counts = new Uint32Array(65536)
    this.depth = new Float32Array(baked.count)
  }

  // back to front for this camera: each splat's view depth, a 16-bit counting sort, written as the draw order
  sort(camera) {
    const m = new THREE.Matrix4().multiplyMatrices(camera.matrixWorldInverse, this.matrixWorld).elements
    const C = this.baked.C, n = this.baked.count, depth = this.depth
    let lo = Infinity, hi = -Infinity
    for (let i = 0; i < n; i++) {
      const z = m[2] * C[4 * i] + m[6] * C[4 * i + 1] + m[10] * C[4 * i + 2] + m[14]
      depth[i] = z
      if (z < lo) lo = z
      if (z > hi) hi = z
    }
    const k = 65535 / Math.max(hi - lo, 1e-9), counts = this.counts, keys = this.keys
    counts.fill(0)
    for (let i = 0; i < n; i++) counts[(keys[i] = ((depth[i] - lo) * k) | 0)]++
    for (let i = 1; i < 65536; i++) counts[i] += counts[i - 1]
    const order = this.geometry.getAttribute('aIndex')
    // the most negative view z (farthest) first
    for (let i = n - 1; i >= 0; i--) order.array[--counts[keys[i]]] = i
    order.needsUpdate = true
  }

  // (the draw order must be sorted before renderer.render: three uploads an instanced attribute while it
  // lists the scene's objects, before any onBeforeRender, so a sort made there would draw a frame late)
  onBeforeRender(renderer, scene, camera) {
    renderer.getDrawingBufferSize(this.material.uniforms.uViewport.value)
    this.material.uniforms.uLight.value.copy(this.light).transformDirection(camera.matrixWorldInverse)
  }
}
