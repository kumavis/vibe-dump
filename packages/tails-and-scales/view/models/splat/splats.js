// Gaussian splats among three.js's meshes (V2, DESIGN §1.1: the 'new' figure style's Bushtail fur,
// view/models/squirrel.js; proto/splat/'s splat-three.js until V2). A splat mesh is one instanced quad
// per splat, drawn after the opaque scene, depth-tested against it (a mesh in front hides the fur behind
// it) and not writing depth, back to front, blended over what is already there. The projection (EWA:
// the 3D covariance to a screen ellipse) and the two-tone shading follow the splat-squirrel renderer
// (src/renderer.js); the colours go through three's tone mapping and output colour space, as the meshes
// beside them do.
//
// A unit's fur (SplatFur) is made once and shared by every figure of it, the template and its clones
// alike (view/models/cache.js), and so is everything on the GPU: no figure owns a buffer.
// - Levels of detail: the fur, in progressive order (fur.js's progressive: any prefix a coarser
//   squirrel), cut at each of LEVELS (fur.js's lodSlice: the kept splats enlarged so the coat still
//   covers) and baked (bakeSplats), every level packed one after another into ONE float texture, five
//   texels a splat, under ONE ShaderMaterial (a level is a range of the texture, which the draw order
//   addresses: one texture and one material a fur, where a texture and a material a level would be four
//   of each to bind and free for the same draws).
// - Back to front without sorting each frame: a draw order is kept per (level, view bin), the bin being
//   the camera's direction in the FIGURE's own frame, AZ azimuth bins by EL elevation bands; a bin's
//   order sorts the level's splat centres by their dot product with the bin's middle direction (a
//   counting sort into BUCKETS steps across the level's depth: a 0.6" squirrel's are 0.00015" each, far
//   finer than the bin's own error, 11.25° of turn), made the first time a figure is seen from that bin,
//   and held as a Uint16 instanced attribute (read as a float: three r160 hands an unnormalised
//   UNSIGNED_SHORT to `in float` exactly) in an InstancedBufferGeometry of the fur's own, which every
//   figure seen from that bin draws. A figure turning or the camera orbiting swaps which geometry it
//   draws; nothing is uploaded but a bin's first order. A bin's geometry is counted by the figures
//   drawing it, and one no figure has drawn for EVICT preparations is freed (its order with it: made
//   again if the bin is seen again), so a battle's turning leaves nothing behind on the title
//   (sim/rematch-memory.mjs).
// - Each figure's level, each render: from its height on screen, px (CSS pixels: the drawing buffer's
//   over the renderer's pixel ratio, so a phone's DPR 2 doesn't ask four times the splats for a figure
//   the same size to the eye; but the drawing buffer's own under a ratio below 1, ?lowfi's 0.5, which
//   draws a quarter of the pixels and so wants a quarter of the splats), n ≈ 1.7 px² splats (the rule
//   the prototype's sheet settled, at DPR 1: about 6,000 at 60 px, 1,300 at 28), the smallest level at
//   least that (the largest past it), with hysteresis (HYST: up only past the level's count by it, down
//   only once the level below holds it with HYST to spare).
// - A budget a FRAME (setSplatBudget: the stage's quality, view/stage.js; SPLAT_BUDGET until it says),
//   which the table's render and the race picker's windows after it share: the table's render begins
//   the frame (prepareSplats' role 'table'), each window draws from what it left ('window'). If a
//   render's figures would draw more than is left, the farthest step down a level, then the next
//   farthest, a pass at a time, until they fit (none below the coarsest: the perf overlay shows the
//   splats and the budget, ui/perf.js). While the windows show (the battle-setup panel or a lobby card
//   over the table: wide screens dim the table round it, a phone's panel hides it), the table's figures
//   all draw their coarsest level, so the windows' figures, the ones looked at, get the budget.
//
//   bakeSplats(model, bones)   the model (fur.js's SplatModel) in a fixed pose: each splat's centre,
//                              covariance and normal skinned once, on the CPU (a figure holds its pose)
//   new SplatFur(model, bones, { splatScale })   a unit's fur: `model` progressive (fur.js), baked at
//                              each of LEVELS; its bounds (`sphere`, `box`, `height`, in its own frame)
//   new Splats(fur)            a figure's splat mesh (isSplats): castShadow never set (cache.js skips it),
//                              userData.keep (bake.js leaves it whole), clone() a copy drawing the same
//                              fur, raycast() against the fur's box (the race picker's unitAt)
//   registerSplats(root), unregisterSplats(root)   a figure's splat meshes on, or off, the list of
//                              figures prepareSplats sees (cache.js: built or cloned; disposeFigure)
//   prepareSplats(camera, renderer, lightDir, scene, role)   before a render of `scene` by `camera` into
//                              the renderer's current viewport (`lightDir`: world space, toward the
//                              light): every registered figure in that scene and shown (no hidden
//                              ancestor) and in the camera's frustum (its fur's bounding sphere) gets its
//                              level and bin, and the shared uniforms the viewport and the light. `role`
//                              'table' (view/stage.js: begins the frame's budget), 'window' (view/
//                              diorama.js: what the frame has left), or 'own' (the default: the whole
//                              budget, nothing shared; proto/splat's viewer and sheet). Run as the
//                              scene's onBeforeRender: three calls it once the world matrices and the
//                              camera (the shake's offset in it) are current, before it lists what to
//                              draw, which is the last moment an instanced attribute can change for
//                              that render
//   splatsPrepared             the last preparation's figures and splats (the viewer's)
//   splatStats()               that, and the figures registered, the furs made and the draw orders held
//                              (?debug's view.splats(), app/boot.js)
//   setSplatBudget(n)          the splats a frame from now on (the stage's quality)
//   SPLAT_BUDGET, LEVELS, SHADOW_LAYER, FUR_ORDER
//
// Nothing of three.js is made as this module loads (three draws Math.random for an object's uuid, and
// the title's table is painted from Math.random as the page loads: sim/bake-check.mjs counts the draws).
import * as THREE from 'three'
import { lodSlice } from './fur.js'
import { drawStats } from '../../stats.js'

// the levels of detail (splats), fewest first
export const LEVELS = Object.freeze([800, 1500, 3000, 6000])
// at most this many splats a frame until the stage's quality sets its own (setSplatBudget: the farthest
// figures step down past it)
export const SPLAT_BUDGET = 150000
let budget = SPLAT_BUDGET
// The layer of the squirrels' shadow proxies (view/models/squirrel.js): their classic bodies, which the
// sun's shadow pass draws and no camera does (view/stage.js)
export const SHADOW_LAYER = 1
// A splat mesh's renderOrder: three draws see-through objects by renderOrder, then back to front, and a
// fur writes no depth, so whatever see-through is drawn after it covers it whatever its depth. The
// table's marks lie on the ground under every figure (a ring, a zone, a decal: renderOrder 0 to 6), so
// they are drawn first; a see-through thing in the air (an explosion's flash, its smoke: view/effects/
// fx.js) takes FUR_ORDER too, so it and the furs are drawn back to front together, and a puff before a
// squirrel veils its fur as it veils its cap.
export const FUR_ORDER = 10
// n ≈ K_PX × px²; the hysteresis between levels
const K_PX = 1.7
const HYST = 0.15
// the view bins: AZ azimuths by EL elevation bands (30° each)
const AZ = 32
const EL = 6
// a draw order's counting sort: its buckets across a level's depth (12 bits: the fill and the prefix sum
// over them are most of a small level's sort)
const BUCKETS = 4096
// a bin's geometry no figure has drawn for this many preparations is freed, looked for every SWEEP
const EVICT = 90
const SWEEP = 30
// the frustum test's room around a fur's sphere (the camera's shake, a splat's own extent)
const MARGIN = 0.3
// texels a row of the fur's texture (a power of two: the shader divides by shifting), texels a splat
const ROW = 1024
const LOG_ROW = 10
const TEXELS = 5

// (A Σ Aᵀ)'s (r, c), T = A Σ (no closure a splat: a fur's bake is cold, and its garbage counts)
const sig = (T, M, r, c) => T[3 * r] * M[c] + T[3 * r + 1] * M[4 + c] + T[3 * r + 2] * M[8 + c]
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
    S0[4 * i] = sig(T, M, 0, 0); S0[4 * i + 1] = sig(T, M, 0, 1); S0[4 * i + 2] = sig(T, M, 0, 2); S0[4 * i + 3] = sig(T, M, 1, 1)
    S1[4 * i] = sig(T, M, 1, 2); S1[4 * i + 1] = sig(T, M, 2, 2)
    S1[4 * i + 2] = model.shading[2 * i] / 255; S1[4 * i + 3] = model.shading[2 * i + 1] / 255
    const nx = model.normals[3 * i], ny = model.normals[3 * i + 1], nz = model.normals[3 * i + 2]
    const mx = M[0] * nx + M[4] * ny + M[8] * nz, my = M[1] * nx + M[5] * ny + M[9] * nz, mz = M[2] * nx + M[6] * ny + M[10] * nz
    const l = Math.hypot(mx, my, mz) || 1
    NR[4 * i] = mx / l; NR[4 * i + 1] = my / l; NR[4 * i + 2] = mz / l
    CO[4 * i] = model.colors[4 * i] / 255; CO[4 * i + 1] = model.colors[4 * i + 1] / 255; CO[4 * i + 2] = model.colors[4 * i + 2] / 255
  }
  return { count: N, C, S0, S1, NR, CO }
}

// A splat's five texels: its centre and opacity; Σ's xx, xy, xz, yy; Σ's yz, zz, its lit and occlusion
// weights; its normal; its colour.
const VS = /* glsl */ `
precision highp float;
precision highp int;
uniform highp sampler2D tData;
uniform vec2 uViewport;     // the viewport, drawing-buffer pixels
uniform float uScale2;      // splatScale²
uniform vec3 uLight;        // view space, toward the light
in float aIndex;            // the splat (its first texel / ${TEXELS}), in this view's draw order
out vec4 vColor;
out vec2 vPos;
ivec2 texel(int t) { return ivec2(t & ${ROW - 1}, t >> ${LOG_ROW}); }
void main() {
  vColor = vec4(0.0);
  vPos = vec2(0.0);
  gl_Position = vec4(0.0, 0.0, 2.0, 1.0);   // clipped unless the splat survives
  int k = int(aIndex + 0.5) * ${TEXELS};
  vec4 c0 = texelFetch(tData, texel(k), 0);
  float alpha = c0.w;
  if (alpha < 1.0 / 255.0) return;
  vec4 pv = modelViewMatrix * vec4(c0.xyz, 1.0);
  vec4 clip = projectionMatrix * pv;
  if (clip.w <= 0.0 || abs(clip.z) > clip.w) return;
  vec4 s0 = texelFetch(tData, texel(k + 1), 0), s1 = texelFetch(tData, texel(k + 2), 0);
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
  vec3 albedo = texelFetch(tData, texel(k + 4), 0).rgb;
  vec3 n = normalize(W * texelFetch(tData, texel(k + 3), 0).xyz);
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

// the uniforms every fur's material shares (set by prepareSplats before each render)
const U = { viewport: { value: new THREE.Vector2(1, 1) }, light: { value: new THREE.Vector3(0, 1, 0) }, scale2: { value: 2.25 } }
// every fur made (the eviction sweep's), and the figures prepareSplats sees
const furs = new Set()
const live = new Set()
// the frame's budget (prepareSplats' roles): what the table's render left the windows, whether a window
// was prepared since the table's last render, and whether the table's figures draw their coarsest
const frame = { left: 0, windows: false, coarse: false }
// the splats a frame from now on; the perf overlay shows it once a fur is made (a classic page draws none)
export function setSplatBudget(n) {
  budget = n
  if (furs.size) drawStats.budget = n
}
// scratch for the counting sort
let counts = null

// A bin's middle direction in a figure's frame: azimuth from +Z toward +X, elevation from the ground.
function binDir(bin) {
  const az = ((bin % AZ) * 2 * Math.PI) / AZ, el = -Math.PI / 2 + ((Math.floor(bin / AZ) + 0.5) * Math.PI) / EL
  return [Math.cos(el) * Math.sin(az), Math.sin(el), Math.cos(el) * Math.cos(az)]
}
// The bin of direction (x, y, z) (any length).
function binOf(x, y, z) {
  const l = Math.hypot(x, y, z) || 1
  const az = (((Math.round((Math.atan2(x, z) * AZ) / (2 * Math.PI)) % AZ) + AZ) % AZ)
  const el = Math.min(EL - 1, Math.floor(((Math.asin(Math.max(-1, Math.min(1, y / l))) + Math.PI / 2) * EL) / Math.PI))
  return el * AZ + az
}

export class SplatFur {
  constructor(model, bones, { splatScale = 1.5 } = {}) {
    // each level baked, packed one after another
    const cuts = [...new Set(LEVELS.map((n) => Math.min(n, model.count)))]
    const baked = cuts.map((n) => bakeSplats(lodSlice(model, n), bones))
    this.count = baked.reduce((a, b) => a + b.count, 0)
    if (this.count > 65535) throw new Error(`a fur of ${this.count} splats over its levels: a Uint16 draw order addresses 65,535`)
    const rows = Math.ceil((this.count * TEXELS) / ROW)
    const data = new Float32Array(ROW * rows * 4)
    this.levels = []
    let at = 0
    for (const b of baked) {
      const xyz = new Float32Array(b.count * 3)
      const parts = [b.C, b.S0, b.S1, b.NR, b.CO]
      // (a texel a copy: the five parts' arrays are a splat's texels in order)
      for (let j = 0; j < TEXELS; j++) {
        const src = parts[j]
        for (let i = 0, t = at * TEXELS * 4 + 4 * j; i < b.count; i++, t += TEXELS * 4) {
          data[t] = src[4 * i], data[t + 1] = src[4 * i + 1], data[t + 2] = src[4 * i + 2], data[t + 3] = src[4 * i + 3]
        }
      }
      for (let i = 0; i < b.count; i++) xyz[3 * i] = b.C[4 * i], xyz[3 * i + 1] = b.C[4 * i + 1], xyz[3 * i + 2] = b.C[4 * i + 2]
      this.levels.push({ n: b.count, base: at, xyz })
      at += b.count
    }
    // its bounds in its own frame: the centres of its finest level, and a splat's reach round them
    const top = this.levels[this.levels.length - 1].xyz
    this.box = new THREE.Box3()
    const v = new THREE.Vector3()
    for (let i = 0; i < top.length; i += 3) this.box.expandByPoint(v.set(top[i], top[i + 1], top[i + 2]))
    this.height = this.box.max.y - this.box.min.y
    this.box.expandByScalar(0.03)
    this.sphere = this.box.getBoundingSphere(new THREE.Sphere())
    this.texture = new THREE.DataTexture(data, ROW, rows, THREE.RGBAFormat, THREE.FloatType)
    this.texture.minFilter = this.texture.magFilter = THREE.NearestFilter
    this.texture.needsUpdate = true
    U.scale2.value = splatScale * splatScale
    drawStats.budget = budget
    this.material = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3, vertexShader: VS, fragmentShader: FS,
      uniforms: { tData: { value: this.texture }, uViewport: U.viewport, uLight: U.light, uScale2: U.scale2 },
      transparent: true, depthWrite: false, depthTest: true, blending: THREE.NormalBlending,
    })
    // (level, bin) → { geo, users, used }: the bins' orders seen so far
    this.slots = new Map()
    furs.add(this)
  }

  slotOf(level, bin) {
    return level * AZ * EL + bin
  }

  // The geometry drawing `slot` (made the first time), counted as drawn by one more figure.
  take(slot) {
    let s = this.slots.get(slot)
    if (!s) this.slots.set(slot, (s = { geo: this.geometry(slot), users: 0, used: tick }))
    s.users++
    return s.geo
  }

  drop(slot) {
    const s = this.slots.get(slot)
    if (s) s.users--
  }

  // A (level, bin)'s draw order: the level's splats by their centre's dot product with the bin's
  // direction, the far side first (a counting sort into BUCKETS), as a geometry of the fur's own (its
  // quad's corners and indices its own too: freeing a geometry frees every buffer it names).
  geometry(slot) {
    const level = this.levels[Math.floor(slot / (AZ * EL))], { n, base, xyz } = level
    const [dx, dy, dz] = binDir(slot % (AZ * EL))
    const key = new Float32Array(n)
    let lo = Infinity, hi = -Infinity
    for (let i = 0; i < n; i++) {
      const k = (key[i] = xyz[3 * i] * dx + xyz[3 * i + 1] * dy + xyz[3 * i + 2] * dz)
      if (k < lo) lo = k
      if (k > hi) hi = k
    }
    counts ??= new Uint32Array(BUCKETS)
    counts.fill(0)
    const q = (BUCKETS - 1) / Math.max(hi - lo, 1e-9), bucket = new Uint16Array(n)
    for (let i = 0; i < n; i++) counts[(bucket[i] = Math.min(BUCKETS - 1, ((key[i] - lo) * q) | 0))]++
    for (let i = 1; i < BUCKETS; i++) counts[i] += counts[i - 1]
    const order = new Uint16Array(n)
    for (let i = n - 1; i >= 0; i--) order[--counts[bucket[i]]] = base + i
    const geo = new THREE.InstancedBufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute([-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0], 3))
    geo.setIndex([0, 1, 2, 2, 1, 3])
    geo.setAttribute('aIndex', new THREE.InstancedBufferAttribute(order, 1))
    geo.instanceCount = n
    geo.boundingSphere = this.sphere
    geo.boundingBox = this.box
    return geo
  }

  // Free the orders no figure has drawn for EVICT preparations.
  sweep() {
    for (const [slot, s] of this.slots) {
      if (s.users > 0 || tick - s.used <= EVICT) continue
      s.geo.dispose()
      this.slots.delete(slot)
    }
  }
}

const _inv = new THREE.Matrix4(), _ray = new THREE.Ray(), _hit = new THREE.Vector3()

export class Splats extends THREE.Mesh {
  constructor(fur) {
    // (the coarsest level from the table camera's band, until a preparation chooses)
    const slot = fur.slotOf(0, binOf(0, 1, 1))
    super(fur.take(slot), fur.material)
    this.isSplats = true
    this.fur = fur
    this.slot = slot
    // the level it wants (with hysteresis) and the one it draws (the budget's), its view z
    this.want = 0
    this.level = 0
    this.bin = 0
    this.dist = 0
    this.renderOrder = FUR_ORDER
    // (view/models/bake.js bakes a kept subtree on its own: a splat mesh has no children, so it is left as it is)
    this.userData.keep = true
  }

  // a copy drawing the same fur (Object3D's copy, not Mesh's: this one's own geometry stays counted)
  copy(source, recursive) {
    THREE.Object3D.prototype.copy.call(this, source, recursive)
    return this
  }

  clone() {
    return new this.constructor(this.fur).copy(this, false)
  }

  // drawing (level, bin) from now on
  show(level, bin) {
    const slot = this.fur.slotOf(level, bin)
    if (slot !== this.slot) {
      this.geometry = this.fur.take(slot)
      this.fur.drop(this.slot)
      this.slot = slot
    }
    this.fur.slots.get(slot).used = tick
  }

  // off the table for good: its geometry no longer counted
  release() {
    this.fur.drop(this.slot)
  }

  // a ray meets the fur's box (its quad isn't its shape)
  raycast(raycaster, hits) {
    _inv.copy(this.matrixWorld).invert()
    _ray.copy(raycaster.ray).applyMatrix4(_inv)
    if (!_ray.intersectBox(this.fur.box, _hit)) return
    _hit.applyMatrix4(this.matrixWorld)
    const distance = raycaster.ray.origin.distanceTo(_hit)
    if (distance < raycaster.near || distance > raycaster.far) return
    hits.push({ distance, point: _hit.clone(), object: this })
  }

  onBeforeRender(renderer, scene, camera, geometry) {
    drawStats.splats += geometry.instanceCount
  }
}

export function registerSplats(root) {
  root.traverse((o) => o.isSplats && live.add(o))
}
export function unregisterSplats(root) {
  root.traverse((o) => {
    if (o.isSplats && live.delete(o)) o.release()
  })
}

// ── Each render ──────────────────────────────────────────────────────────────
let tick = 0, swept = 0
export const splatsPrepared = { figures: 0, splats: 0 }
const _vp = new THREE.Vector4(), _pm = new THREE.Matrix4(), _frustum = new THREE.Frustum(), _sphere = new THREE.Sphere()
const _c = new THREE.Vector3(), _cam = new THREE.Vector3(), _back = new THREE.Vector3()
const _list = []

// the smallest level holding n, kept at `cur` within the hysteresis
function levelFor(levels, n, cur) {
  let j = levels.findIndex((l) => l.n >= n)
  if (j < 0) j = levels.length - 1
  if (j > cur && n <= levels[cur].n * (1 + HYST)) return cur
  if (j < cur && n >= levels[cur - 1].n * (1 - HYST)) return cur
  return j
}
export function splatStats() {
  let orders = 0, levels = []
  for (const f of furs) orders += f.slots.size
  for (const m of live) levels[m.level] = (levels[m.level] ?? 0) + 1
  return { ...splatsPrepared, live: live.size, furs: furs.size, orders, levels: [...levels].map((n) => n ?? 0), budget, coarse: frame.coarse }
}
// in `scene` (its top ancestor) and nothing above it hidden
function shownIn(o, scene) {
  for (; o; o = o.parent) {
    if (!o.visible) return false
    if (!o.parent) return o === scene
  }
  return false
}

export function prepareSplats(camera, renderer, lightDir, scene, role = 'own') {
  tick++
  // the most this render draws: the frame's (the table's begins it; a window's is what is left), or the
  // whole budget
  let cap = budget, coarse = false
  if (role === 'table') {
    frame.coarse = coarse = frame.windows
    frame.windows = false
  } else if (role === 'window') {
    frame.windows = true
    cap = frame.left
  }
  renderer.getCurrentViewport(_vp)
  U.viewport.value.set(_vp.z, _vp.w)
  U.light.value.copy(lightDir).transformDirection(camera.matrixWorldInverse)
  _frustum.setFromProjectionMatrix(_pm.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse))
  // (CSS px; the drawing buffer's under a pixel ratio below 1)
  const V = camera.matrixWorldInverse.elements, focal = (camera.projectionMatrix.elements[5] * _vp.w) / 2 / Math.max(1, renderer.getPixelRatio())
  const persp = !camera.isOrthographicCamera
  _cam.setFromMatrixPosition(camera.matrixWorld)
  _back.set(0, 0, 1).transformDirection(camera.matrixWorld)
  let total = 0
  _list.length = 0
  for (const m of live) {
    if (!shownIn(m, scene)) continue
    const fur = m.fur, e = m.matrixWorld.elements
    _c.copy(fur.sphere.center).applyMatrix4(m.matrixWorld)
    _sphere.set(_c, fur.sphere.radius * m.matrixWorld.getMaxScaleOnAxis() + MARGIN)
    if (!_frustum.intersectsSphere(_sphere)) continue
    // its height on screen (CSS px): its fur's, times its own height's scale, over its depth
    const z = -(V[2] * _c.x + V[6] * _c.y + V[10] * _c.z + V[14])
    const tall = fur.height * Math.hypot(e[4], e[5], e[6]) * focal
    const px = persp ? tall / Math.max(z, camera.near) : tall
    m.want = levelFor(fur.levels, K_PX * px * px, m.want)
    m.level = coarse ? 0 : m.want
    m.dist = z
    // the camera's direction in the figure's frame (Aᵀ w, A the figure's linear part: what orders by depth)
    const wx = persp ? _cam.x - _c.x : _back.x, wy = persp ? _cam.y - _c.y : _back.y, wz = persp ? _cam.z - _c.z : _back.z
    m.bin = binOf(e[0] * wx + e[1] * wy + e[2] * wz, e[4] * wx + e[5] * wy + e[6] * wz, e[8] * wx + e[9] * wy + e[10] * wz)
    total += fur.levels[m.level].n
    _list.push(m)
  }
  // over the budget: the farthest a level down, then the next, a pass at a time
  if (total > cap) {
    _list.sort((a, b) => b.dist - a.dist)
    for (let stepped = true; stepped && total > cap; ) {
      stepped = false
      for (const m of _list) {
        if (m.level === 0) continue
        const L = m.fur.levels
        total -= L[m.level].n - L[m.level - 1].n
        m.level--
        stepped = true
        if (total <= cap) break
      }
    }
  }
  for (const m of _list) m.show(m.level, m.bin)
  if (role === 'table') frame.left = Math.max(0, budget - total)
  else if (role === 'window') frame.left = Math.max(0, frame.left - total)
  splatsPrepared.figures = _list.length
  splatsPrepared.splats = total
  if (tick - swept >= SWEEP) {
    swept = tick
    for (const f of furs) f.sweep()
  }
}
