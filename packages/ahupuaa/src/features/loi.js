// Loʻi kalo — the irrigated taro terraces.
//
// Each paddy is a flat sheet of water held by earthen banks (kuāuna), stepping
// down the valley floor. The water shader shows the sky in the open water and
// the taro as a canopy of heart-shaped leaves; every paddy is at a different
// stage, from fresh-planted huli to a full canopy, with a few lying fallow and
// flooded — which is what makes a loʻi complex read as a patchwork from above.
// The ʻauwai, the ditch that feeds them, runs along the valley side.

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
    const bank = col('#5f8a3a', 0.15, Math.random)
    const bankDry = col('#7a7a45', 0.1, Math.random)
    const lift = 0.06 // metres above the carved floor, to dodge depth fights
    for (const complex of sites.loi) {
      for (const p of complex.paddies) {
        const y = (p.level + lift) * Y_PER_M
        const q = p.quad
        // two triangles per paddy (quads are wound either way; double-sided)
        for (const k of [0, 1, 2, 0, 2, 3]) {
          pos.push(q[k][0], y, q[k][1])
          age.push(p.age)
          flood.push(p.flood)
        }
        // banks around the paddy edge
        const pts = [...q, q[0]].map((c) => [c[0], y, c[1]])
        B.wall(pts, 0.011, 0.007, Math.random() < 0.8 ? bank : bankDry, MAT.plain, 0.6)
      }
      // the ʻauwai: a narrow channel of water along the valley side
      const a = complex.auwai
      for (let i = 0; i < a.length - 1; i++) {
        const p0 = a[i]
        const p1 = a[i + 1]
        const dx = p1[0] - p0[0]
        const dz = p1[1] - p0[1]
        const l = Math.hypot(dx, dz) || 1
        if (l > 1.2) continue
        const nx = (-dz / l) * 0.012
        const nz = (dx / l) * 0.012
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
