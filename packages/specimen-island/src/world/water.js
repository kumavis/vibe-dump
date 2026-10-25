import * as THREE from 'three'
import { depthTexture } from './terrain.js'
import { clamp, smoothstep } from '../core/mathx.js'

// One water material for the sea, the river and the lake. It reads a depth
// texture of the whole island so shallows go turquoise and foam hugs the shore
// wherever land meets water — no per-body special cases. A per-vertex `aFade`
// (1 on the sea) lets the inland sheet thin out where it reaches the sea, so
// the two surfaces never stack into a hard double-alpha edge at the mouth, and
// `aRush` (0 on the sea) churns white water into a steep reach so its slope
// reads as rapids.

// White water fades in as the river's surface falls between these grades.
const RAPIDS = [0.08, 0.3]

export function buildWater(island) {
  const group = new THREE.Group()
  group.name = 'water'
  const uniforms = {
    uTime: { value: 0 },
    uDepth: { value: depthTexture(island) },
    uHalf: { value: island.half },
    uCell: { value: island.cell },
    uN: { value: island.n },
  }
  const mat = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    specular: 0x9aa8b0,
    shininess: 120,
    transparent: true,
    depthWrite: false,
  })
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms)
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
         uniform float uTime;
         attribute float aFade;
         attribute float aRush;
         varying float vFade;
         varying float vRush;
         varying vec3 vWorldPos;`,
      )
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
         vFade = aFade;
         vRush = aRush;
         vec4 wp0 = modelMatrix * vec4(transformed, 1.0);
         transformed.y += sin(wp0.x * 0.08 + uTime * 1.1) * 0.06 + cos(wp0.z * 0.11 + uTime * 0.9) * 0.05;`,
      )
      .replace(
        '#include <worldpos_vertex>',
        `#include <worldpos_vertex>
         vWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;`,
      )
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
         uniform float uTime;
         uniform sampler2D uDepth;
         uniform float uHalf;
         uniform float uCell;
         uniform float uN;
         varying float vFade;
         varying float vRush;
         varying vec3 vWorldPos;
         float wHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
         float wNoise(vec2 p) {
           vec2 i = floor(p); vec2 f = fract(p);
           f = f * f * (3.0 - 2.0 * f);
           return mix(mix(wHash(i), wHash(i + vec2(1, 0)), f.x), mix(wHash(i + vec2(0, 1)), wHash(i + vec2(1, 1)), f.x), f.y);
         }`,
      )
      .replace(
        'vec4 diffuseColor = vec4( diffuse, opacity );',
        `vec2 duv = ((vWorldPos.xz + uHalf) / uCell + 0.5) / uN;
         float depth = texture2D(uDepth, duv).r * 16.0 - 2.0;
         if (duv.x < 0.0 || duv.y < 0.0 || duv.x > 1.0 || duv.y > 1.0) depth = 14.0;
         vec3 shallow = vec3(0.16, 0.62, 0.58);
         vec3 mid = vec3(0.05, 0.36, 0.42);
         vec3 deep = vec3(0.02, 0.13, 0.24);
         vec3 wc = mix(shallow, mid, smoothstep(0.3, 3.5, depth));
         wc = mix(wc, deep, smoothstep(3.5, 13.0, depth));
         float n1 = wNoise(vWorldPos.xz * 0.35 + vec2(uTime * 0.25, uTime * 0.18));
         float n2 = wNoise(vWorldPos.xz * 0.9 - vec2(uTime * 0.31, 0.0));
         float foamBand = 1.0 - smoothstep(0.0, 0.4, depth + (n1 - 0.5) * 0.25);
         float foam = foamBand * smoothstep(0.35, 0.65, n2 + 0.25 * sin(depth * 9.0 - uTime * 2.2));
         float churn = wNoise(vWorldPos.xz * 0.8 + vec2(uTime * 0.9, -uTime * 1.3));
         // white water needs water under it: it thins out toward the banks, so
         // its own edge is soft and the waterline stays the plain shallow one
         foam = max(foam, vRush * smoothstep(0.3, 1.2, depth) * smoothstep(0.4, 0.75, churn * 0.55 + n2 * 0.55));
         wc = mix(wc, vec3(0.92, 0.95, 0.93), clamp(foam, 0.0, 1.0) * 0.7);
         float alpha = mix(0.35, 0.93, smoothstep(0.0, 2.6, depth));
         alpha = max(alpha, foam * 0.75);
         vec4 diffuseColor = vec4(wc, alpha * vFade);`,
      )
      .replace(
        '#include <normal_fragment_begin>',
        `#include <normal_fragment_begin>
         float wa = uTime * 1.3;
         vec3 wpert = vec3(
           sin(vWorldPos.x * 0.7 + wa) * 0.5 + sin(vWorldPos.z * 1.9 - wa * 1.4) * 0.35 + (wNoise(vWorldPos.xz * 1.6 + wa * 0.3) - 0.5) * 0.6,
           0.0,
           cos(vWorldPos.z * 0.8 + wa * 0.8) * 0.5 + sin(vWorldPos.x * 1.7 + wa * 1.1) * 0.35 + (wNoise(vWorldPos.zx * 1.4 - wa * 0.2) - 0.5) * 0.6
         ) * 0.09;
         normal = normalize(normal + (viewMatrix * vec4(wpert, 0.0)).xyz);`,
      )
  }

  // The sea: one big plane. Fog swallows its edge long before the far plane.
  const seaGeo = new THREE.PlaneGeometry(16000, 16000, 64, 64).rotateX(-Math.PI / 2)
  seaGeo.setAttribute('aFade', new THREE.Float32BufferAttribute(new Float32Array(seaGeo.attributes.position.count).fill(1), 1))
  seaGeo.setAttribute('aRush', new THREE.Float32BufferAttribute(new Float32Array(seaGeo.attributes.position.count), 1))
  const sea = new THREE.Mesh(seaGeo, mat)
  sea.position.y = island.sea
  sea.renderOrder = 2
  group.add(sea)

  // Inland water (river ribbon + lake) from the island's water grid.
  const inland = inlandGeometry(island)
  if (inland) {
    const mesh = new THREE.Mesh(inland, mat)
    mesh.renderOrder = 2
    group.add(mesh)
  }
  return { group, uniforms }
}

// The inland sheet covers every grid cell with a wet corner, at the heights
// Island.settleWater gives it: the water where wet, and at a dry corner the
// level of the water beside it, dipped just under that corner's ground — so
// the sheet runs flat under the bank and the visible edge is wherever it meets
// the terrain, never a cell's straight side. Its triangles are the terrain's
// own, so that meeting line is exact.
function inlandGeometry(island) {
  const n = island.n
  const W = island.water
  const S = island.surface
  const sea = island.sea
  const wet = (id) => W[id] > sea + 0.01
  const map = new Int32Array(n * n).fill(-1)
  const L = island.level
  const pos = []
  const fade = []
  const rush = []
  const index = []
  // how fast the water's own level falls here (the river's profile, not the
  // sheet, which dips under its banks); a missing neighbour reads as level
  const fall = (i, j) => {
    const at = (ii, jj) => {
      const v = L[clamp(jj, 0, n - 1) * n + clamp(ii, 0, n - 1)]
      return v >= sea ? v : L[j * n + i]
    }
    return Math.hypot(at(i + 1, j) - at(i - 1, j), at(i, j + 1) - at(i, j - 1)) / (2 * island.cell)
  }
  const vert = (i, j) => {
    const id = j * n + i
    if (map[id] >= 0) return map[id]
    map[id] = pos.length / 3
    pos.push(island.xOf(i), S[id], island.xOf(j))
    // a dry corner out over the seabed fades the sheet into the sea
    fade.push(wet(id) ? 1 : smoothstep(sea - 0.3, sea + 0.05, island.h[id]))
    rush.push(L[id] >= sea ? smoothstep(RAPIDS[0], RAPIDS[1], fall(i, j)) : 0)
    return map[id]
  }
  for (let j = 0; j < n - 1; j++) {
    for (let i = 0; i < n - 1; i++) {
      const a = j * n + i
      if (!(wet(a) || wet(a + 1) || wet(a + n) || wet(a + n + 1))) continue
      const va = vert(i, j)
      const vb = vert(i, j + 1)
      const vc = vert(i + 1, j)
      const vd = vert(i + 1, j + 1)
      index.push(va, vb, vc, vb, vd, vc)
    }
  }
  if (!index.length) return null
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geo.setAttribute('aFade', new THREE.Float32BufferAttribute(fade, 1))
  geo.setAttribute('aRush', new THREE.Float32BufferAttribute(rush, 1))
  geo.setIndex(index)
  const nor = new Float32Array(pos.length)
  for (let i = 1; i < nor.length; i += 3) nor[i] = 1
  geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3))
  geo.computeBoundingSphere()
  return geo
}
