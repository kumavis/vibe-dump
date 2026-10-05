// Loʻi kalo — the irrigated taro terraces.
//
// Each paddy is a flat sheet of water held by earthen banks (kuāuna), stepping
// down the valley floor: a roughly four-sided polygon the generator laid out
// along the contours and clipped to the land (gen/loi.js). The water shader
// shows the sky in the open water and the taro as a canopy of heart-shaped
// leaves; every paddy is at a different stage, from fresh-planted huli to a
// full canopy, with a few lying fallow and flooded — which is what makes a
// loʻi complex read as a patchwork from above.
// Where a paddy stands above the ground beside it, its bank becomes a
// stone-faced riser down to that ground. The ʻauwai, the ditches that feed
// them, run along the valley sides.

import * as THREE from 'three'
import { Y_PER_M } from '../config.js'
import { constants, noise, heightFetch, lighting } from '../render/shaders/common.glsl.js'
import { Builder, MAT, col } from './kit.js'

const paddyVertex = /* glsl */ `
${constants}
in float aAge;
in float aFlood;
out vec3 vWorld;
out float vAge;
out float vFlood;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorld = wp.xyz;
  vAge = aAge;
  vFlood = aFlood;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`

const paddyFragment = /* glsl */ `
${constants}
${noise}
${heightFetch}
${lighting}
in vec3 vWorld;
in float vAge;
in float vFlood;
void main() {
  vec3 V = normalize(cameraPosition - vWorld);
  float px = length(fwidth(vWorld.xz));
  // open water: sky reflection over muddy brown-green
  vec2 rp = vWorld.xz * 220.0 + vec2(uTime * 0.6, uTime * 0.4);
  vec3 N = normalize(vec3((vnoise(rp) - 0.5) * 0.08, 1.0, (vnoise(rp + 13.0) - 0.5) * 0.08));
  float F = 0.03 + 0.97 * pow(1.0 - max(dot(N, V), 0.0), 5.0);
  vec3 R = reflect(-V, N);
  float vis = sunVisibility(vWorld);
  vec3 water = vec3(0.10, 0.09, 0.05) * (uSkyColor + uSunColor * max(uSunDir.y, 0.0) * vis);
  water = mix(water, skyMap(R), F);
  vec3 H = normalize(uSunDir + V);
  water += uSunColor * pow(max(dot(N, H), 0.0), 300.0) * 4.0 * vis;

  // taro: one heart-shaped leaf per ~1.3 m cell, size by the paddy's age
  float grow = vFlood > 0.5 ? smoothstep(0.0, 1.0, vAge) : 0.0;
  vec2 q = vWorld.xz * 120.0;
  vec3 v = voronoi(q);
  vec2 cellId = floor(q) + 0.5;
  float leafR = mix(0.15, 0.62, grow) * (0.8 + 0.4 * v.y);
  float leaf = 1.0 - smoothstep(leafR - 0.08, leafR, v.x);
  // when leaves are smaller than pixels, use their average coverage
  float cover = clamp(grow * 1.1 - 0.05, 0.0, 0.95);
  float detailK = smoothstep(0.0012, 0.0035, px);
  leaf = mix(leaf, cover, detailK);
  // at a distance, the planting rows still show as faint stripes
  float rows = 0.5 + 0.5 * sin(dot(vWorld.xz, vec2(0.8, 0.6)) * 380.0);
  leaf = mix(leaf, leaf * (0.8 + 0.3 * rows), detailK * (1.0 - smoothstep(0.004, 0.01, px)));
  vec3 leafC = mix(vec3(0.12, 0.30, 0.06), vec3(0.24, 0.45, 0.10), v.y);
  // young huli are paler and redder in the stem
  leafC = mix(vec3(0.20, 0.30, 0.08), leafC, grow);
  float ndl = 0.55 + 0.45 * max(uSunDir.y, 0.0);
  vec3 leafLit = leafC * (uSunColor * ndl * vis + uSkyColor * 0.9);
  // veins / sheen
  leafLit *= 0.9 + 0.2 * smoothstep(0.0, 0.25, v.z);
  vec3 col = mix(water, leafLit, clamp(leaf, 0.0, 1.0));
  gl_FragColor = vec4(col, 1.0);
}
`

export class Loi {
  constructor(sites, terrain, shared) {
    this.group = new THREE.Group()
    const pos = []
    const age = []
    const flood = []
    const B = new Builder()
    const bank = col('#557d36', 0.15, Math.random)
    const bankDry = col('#6e6e42', 0.1, Math.random)
    const lift = 0.06 // metres above the carved floor, to dodge depth fights
    const v2 = (q) => new THREE.Vector2(q[0], q[1])
    for (const complex of sites.loi) {
      for (const p of complex.paddies) {
        const y = (p.level + lift) * Y_PER_M
        const poly = p.poly
        for (const [a, b, c] of THREE.ShapeUtils.triangulateShape(poly.map(v2), [])) {
          for (const k of [a, b, c]) {
            pos.push(poly[k][0], y, poly[k][1])
            age.push(p.age)
            flood.push(p.flood)
          }
        }
        // the bank round it, reaching down to the lowest ground just outside
        // (on the downhill side that is the riser to the next terrace): read
        // all along each side, not just at the corners, as a four-sided
        // paddy's long sides can pass over a dip its corners miss
        let floor = p.level
        const n = poly.length
        let sa = 0
        for (let i = 0; i < n; i++) sa += poly[i][0] * poly[(i + 1) % n][1] - poly[(i + 1) % n][0] * poly[i][1]
        const sg = sa > 0 ? 1 : -1
        for (let i = 0; i < n; i++) {
          const a = poly[i]
          const b = poly[(i + 1) % n]
          const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
          // (outward, a metre and two metres)
          const ox = ((b[1] - a[1]) / l) * sg * 0.01
          const oz = (-(b[0] - a[0]) / l) * sg * 0.01
          const k = Math.max(1, Math.ceil(l / 0.04))
          for (let s = 0; s < k; s++) {
            const x = a[0] + ((b[0] - a[0]) * s) / k
            const z = a[1] + ((b[1] - a[1]) * s) / k
            floor = Math.min(floor, terrain.metresAt(x, z), terrain.metresAt(x + ox, z + oz), terrain.metresAt(x + 2 * ox, z + 2 * oz))
          }
        }
        // (as deep as a stream bed cut in beside it, if need be)
        const bottom = Math.max(floor, p.level - 8) - 0.25
        const top = p.level + 0.35
        const H = (top - bottom) / 1.3
        const pts = [...poly, poly[0]].map((c) => [c[0], (bottom + 0.3 * H) * Y_PER_M, c[1]])
        B.wall(pts, 0.009, H * Y_PER_M, Math.random() < 0.8 ? bank : bankDry, MAT.plain, 0.6)
      }
      // the ʻauwai: narrow channels of water along the valley sides
      for (const a of complex.auwai) {
        for (let i = 0; i < a.length - 1; i++) {
          const p0 = a[i]
          const p1 = a[i + 1]
          const dx = p1[0] - p0[0]
          const dz = p1[1] - p0[1]
          const l = Math.hypot(dx, dz) || 1
          if (l > 1.2) continue
          const nx = (-dz / l) * 0.008
          const nz = (dx / l) * 0.008
          const y0 = Math.max(terrain.heightAt(p0[0], p0[1]), p0[2] * Y_PER_M) + 0.002
          const y1 = Math.max(terrain.heightAt(p1[0], p1[1]), p1[2] * Y_PER_M) + 0.002
          const quad = [
            [p0[0] - nx, y0, p0[1] - nz],
            [p1[0] - nx, y1, p1[1] - nz],
            [p1[0] + nx, y1, p1[1] + nz],
            [p0[0] + nx, y0, p0[1] + nz],
          ]
          for (const k of [0, 1, 2, 0, 2, 3]) {
            pos.push(...quad[k])
            age.push(0)
            flood.push(0)
          }
        }
      }
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    g.setAttribute('aAge', new THREE.Float32BufferAttribute(age, 1))
    g.setAttribute('aFlood', new THREE.Float32BufferAttribute(flood, 1))
    g.computeBoundingSphere()
    this.material = new THREE.ShaderMaterial({
      vertexShader: paddyVertex,
      fragmentShader: paddyFragment,
      uniforms: { ...shared.uniforms },
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -2,
    })
    this.paddies = new THREE.Mesh(g, this.material)
    this.group.add(this.paddies)
    this.banksGeometry = B.geometry()
  }
}
