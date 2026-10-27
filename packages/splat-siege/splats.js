// splats.js — a small Gaussian-splat renderer for Three.js.
//
// Every splat is a 3D Gaussian: a centre, three axis scales, a rotation
// quaternion, and an RGBA colour. The CPU keeps them in flat typed arrays so
// the game can move, recolour and kill individual splats cheaply; `pack()`
// writes a splat into one RGBA32UI data texture (two texels per splat: centre
// + colour, then scale + rotation as half floats). Each frame the alive splats
// are counting-sorted back to front by view depth and drawn as one instanced
// quad per splat, with the vertex shader projecting the 3D covariance to a 2D
// ellipse exactly as in the 3D Gaussian Splatting paper.
import * as THREE from 'three'
import { DataUtils } from 'three'

// GROUND/WATER lie flat and crater; STRUCTURE/FOLIAGE fill the collision grid;
// FLORA is soft (walk through, no grid) but still blows apart; LOOSE starts
// life as loose litter the blower can lift; SKY never takes part in anything.
export const KIND = { GROUND: 0, STRUCTURE: 1, FOLIAGE: 2, EFFECT: 3, FLORA: 4, LOOSE: 5, WATER: 6, SKY: 7 }

const TEX_W = 2048 // texels per row → 1024 splats per row
const CUTOFF = 2.6 // sigmas: beyond this a Gaussian is ~3% and gets cut

const vertexShader = /* glsl */ `
precision highp float;
precision highp int;
uniform highp usampler2D uTex;
uniform vec2 uFocal;
uniform vec2 uViewport;
uniform vec4 uFlash[4];
uniform vec3 uFogColor;
uniform float uFogDensity;
in float splatIndex;
out vec4 vColor;
out vec2 vPos;

mat3 quatToMat(vec4 q) {
  float x = q.x, y = q.y, z = q.z, w = q.w;
  return mat3(
    1.0 - 2.0 * (y * y + z * z), 2.0 * (x * y + w * z), 2.0 * (x * z - w * y),
    2.0 * (x * y - w * z), 1.0 - 2.0 * (x * x + z * z), 2.0 * (y * z + w * x),
    2.0 * (x * z + w * y), 2.0 * (y * z - w * x), 1.0 - 2.0 * (x * x + y * y));
}

void main() {
  int idx = int(splatIndex + 0.5);
  int t = idx * 2;
  ivec2 uv = ivec2(t & ${TEX_W - 1}, t >> ${Math.log2(TEX_W)});
  uvec4 a = texelFetch(uTex, uv, 0);
  uvec4 b = texelFetch(uTex, uv + ivec2(1, 0), 0);
  vec3 center = uintBitsToFloat(a.xyz);
  vec4 col = vec4(uvec4(a.w & 255u, (a.w >> 8) & 255u, (a.w >> 16) & 255u, a.w >> 24)) / 255.0;
  vec2 h0 = unpackHalf2x16(b.x);
  vec2 h1 = unpackHalf2x16(b.y);
  vec2 h2 = unpackHalf2x16(b.z);
  vec2 h3 = unpackHalf2x16(b.w);
  vec3 scl = vec3(h0.x, h0.y, h1.x);
  vec4 q = vec4(h1.y, h2.x, h2.y, h3.x);

  vec4 cam = viewMatrix * vec4(center, 1.0);
  vec4 clipPos = projectionMatrix * cam;
  float lim = 1.3 * clipPos.w;
  if (clipPos.z < -lim || clipPos.x < -lim || clipPos.x > lim || clipPos.y < -lim || clipPos.y > lim) {
    gl_Position = vec4(0.0, 0.0, 2.0, 1.0);
    return;
  }

  // 3D covariance Σ = R S Sᵀ Rᵀ, projected to the image plane: Σ' = J W Σ Wᵀ Jᵀ
  mat3 R = quatToMat(q);
  mat3 M = mat3(R[0] * scl.x, R[1] * scl.y, R[2] * scl.z);
  mat3 V = M * transpose(M);
  float z2 = cam.z * cam.z;
  mat3 J = mat3(
    uFocal.x / cam.z, 0.0, -(uFocal.x * cam.x) / z2,
    0.0, uFocal.y / cam.z, -(uFocal.y * cam.y) / z2,
    0.0, 0.0, 0.0);
  mat3 T = transpose(mat3(viewMatrix)) * J;
  mat3 cov = transpose(T) * V * T;
  float cxx = cov[0][0] + 0.3, cyy = cov[1][1] + 0.3, cxy = cov[0][1];
  float mid = 0.5 * (cxx + cyy);
  float rad = length(vec2(0.5 * (cxx - cyy), cxy));
  float l1 = max(mid + rad, 1e-4);
  float l2 = max(mid - rad, 1e-4);
  vec2 dir = abs(cxy) > 1e-5 ? normalize(vec2(cxy, l1 - cxx)) : (cxx >= cyy ? vec2(1.0, 0.0) : vec2(0.0, 1.0));
  float r1 = min(${CUTOFF} * sqrt(l1), 1024.0);
  float r2 = min(${CUTOFF} * sqrt(l2), 1024.0);
  vec2 off = position.x * r1 * dir + position.y * r2 * vec2(-dir.y, dir.x);
  vec2 ndc = clipPos.xy / clipPos.w;
  gl_Position = vec4(ndc + off * 2.0 / uViewport, clipPos.z / clipPos.w, 1.0);
  vPos = position.xy * ${CUTOFF};

  vec3 rgb = col.rgb;
  for (int i = 0; i < 4; i++) {
    float s = uFlash[i].w;
    if (s > 0.0) {
      vec3 d = center - uFlash[i].xyz;
      rgb += vec3(1.0, 0.62, 0.28) * (s / (1.0 + dot(d, d) * 0.05));
    }
  }
  float fog = 1.0 - exp(-uFogDensity * length(cam.xyz));
  rgb = mix(rgb, uFogColor, fog);
  vColor = vec4(rgb, col.a);
}
`

const fragmentShader = /* glsl */ `
precision highp float;
in vec4 vColor;
in vec2 vPos;
out vec4 fragColor;
void main() {
  float r2 = dot(vPos, vPos);
  if (r2 > ${CUTOFF * CUTOFF}) discard;
  // A Gaussian with an opaque core: boosted and clamped so a dab reads as a
  // stroke of paint with a soft rim rather than an airbrushed blur.
  float a = min(1.0, 1.55 * exp(-0.5 * r2)) * vColor.a;
  if (a < 0.003) discard;
  fragColor = vec4(vColor.rgb * a, a);
}
`

const toHalf = DataUtils.toHalfFloat

export class SplatStore {
  constructor(capacity) {
    this.capacity = capacity
    this.count = 0
    this.drawn = 0
    this.pos = new Float32Array(capacity * 3)
    this.scale = new Float32Array(capacity * 3)
    this.quat = new Float32Array(capacity * 4)
    this.color = new Uint8Array(capacity * 4)
    this.alive = new Uint8Array(capacity)
    this.kind = new Uint8Array(capacity)

    const rows = Math.ceil((capacity * 2) / TEX_W)
    this.texData = new Uint32Array(TEX_W * rows * 4)
    this.texF32 = new Float32Array(this.texData.buffer)
    const tex = new THREE.DataTexture(this.texData, TEX_W, rows, THREE.RGBAIntegerFormat, THREE.UnsignedIntType)
    tex.internalFormat = 'RGBA32UI'
    tex.magFilter = THREE.NearestFilter
    tex.minFilter = THREE.NearestFilter
    tex.generateMipmaps = false
    tex.flipY = false
    tex.needsUpdate = true
    this.texture = tex
    this.dirty = false

    // sort scratch
    this.depth = new Float32Array(capacity)
    this.ids = new Uint32Array(capacity)
    this.keys = new Uint16Array(capacity)
    this.counts = new Uint32Array(65536)

    const geo = new THREE.InstancedBufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0], 3))
    geo.setIndex([0, 1, 2, 0, 2, 3])
    this.indexAttr = new THREE.InstancedBufferAttribute(new Float32Array(capacity), 1)
    this.indexAttr.setUsage(THREE.DynamicDrawUsage)
    geo.setAttribute('splatIndex', this.indexAttr)
    geo.instanceCount = 0
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e6)

    this.uniforms = {
      uTex: { value: tex },
      uFocal: { value: new THREE.Vector2(600, 600) },
      uViewport: { value: new THREE.Vector2(1, 1) },
      uFlash: { value: [new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4()] },
      uFogColor: { value: new THREE.Color(0.86, 0.83, 0.88) },
      uFogDensity: { value: 0.0045 },
    }
    this.material = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthTest: true,
      depthWrite: false,
      blending: THREE.CustomBlending,
      blendEquation: THREE.AddEquation,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneMinusSrcAlphaFactor,
      blendSrcAlpha: THREE.OneFactor,
      blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
    })
    this.mesh = new THREE.Mesh(geo, this.material)
    this.mesh.frustumCulled = false
    this.mesh.renderOrder = 10
  }

  add(x, y, z, sx, sy, sz, qx, qy, qz, qw, r, g, b, a, kind) {
    if (this.count >= this.capacity) throw new Error('SplatStore: capacity exceeded')
    const i = this.count++
    const p = i * 3, q = i * 4
    this.pos[p] = x; this.pos[p + 1] = y; this.pos[p + 2] = z
    this.scale[p] = sx; this.scale[p + 1] = sy; this.scale[p + 2] = sz
    this.quat[q] = qx; this.quat[q + 1] = qy; this.quat[q + 2] = qz; this.quat[q + 3] = qw
    this.color[q] = r; this.color[q + 1] = g; this.color[q + 2] = b; this.color[q + 3] = a
    this.alive[i] = 1
    this.kind[i] = kind
    return i
  }

  // Write splat i into the texture. Cheap enough to call for every splat that
  // moved this frame; the texture itself is re-uploaded once in flush().
  pack(i) {
    const o = i * 8, p = i * 3, q = i * 4
    const f = this.texF32, u = this.texData, s = this.scale, r = this.quat, c = this.color
    f[o] = this.pos[p]; f[o + 1] = this.pos[p + 1]; f[o + 2] = this.pos[p + 2]
    u[o + 3] = c[q] | (c[q + 1] << 8) | (c[q + 2] << 16) | (c[q + 3] << 24)
    u[o + 4] = toHalf(s[p]) | (toHalf(s[p + 1]) << 16)
    u[o + 5] = toHalf(s[p + 2]) | (toHalf(r[q]) << 16)
    u[o + 6] = toHalf(r[q + 1]) | (toHalf(r[q + 2]) << 16)
    u[o + 7] = toHalf(r[q + 3])
    this.dirty = true
  }

  packAll() {
    for (let i = 0; i < this.count; i++) this.pack(i)
  }

  flush() {
    if (this.dirty) {
      this.texture.needsUpdate = true
      this.dirty = false
    }
  }

  setViewport(width, height, focal) {
    this.uniforms.uViewport.value.set(width, height)
    this.uniforms.uFocal.value.set(focal, focal)
  }

  // Counting sort of every alive splat by view depth, far to near, straight
  // into the instanced index attribute.
  sort(viewMatrix) {
    const e = viewMatrix.elements
    const e2 = e[2], e6 = e[6], e10 = e[10], e14 = e[14]
    const n = this.count, pos = this.pos, alive = this.alive, depth = this.depth, ids = this.ids
    let m = 0, lo = Infinity, hi = -Infinity
    for (let i = 0; i < n; i++) {
      if (alive[i] === 0) continue
      const p = i * 3
      const d = -(e2 * pos[p] + e6 * pos[p + 1] + e10 * pos[p + 2] + e14)
      if (d < -1) continue
      depth[m] = d
      ids[m] = i
      m++
      if (d < lo) lo = d
      if (d > hi) hi = d
    }
    const counts = this.counts, keys = this.keys
    counts.fill(0)
    const scl = m > 0 ? 65535 / Math.max(1e-6, hi - lo) : 0
    for (let j = 0; j < m; j++) {
      const k = ((depth[j] - lo) * scl) | 0
      keys[j] = k
      counts[k]++
    }
    let acc = 0
    for (let k = 65535; k >= 0; k--) {
      const c = counts[k]
      counts[k] = acc
      acc += c
    }
    const out = this.indexAttr.array
    for (let j = 0; j < m; j++) out[counts[keys[j]]++] = ids[j]
    this.indexAttr.needsUpdate = true
    this.mesh.geometry.instanceCount = m
    this.drawn = m
  }
}
