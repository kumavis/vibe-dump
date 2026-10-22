// Sun shadows cast by the land itself, from ahupuaʻa's shadow.js: each texel
// marches toward the sun over the heights and records how much of the sun's
// disc clears the ridges (the classic heightfield soft shadow, its penumbra
// widening with distance).
//
// One map per pack, over the pack's own rect, redrawn when the sun has moved
// (or the exaggeration, which a box holds fixed), a strip per frame so the
// cost is spread out rather than landing on one frame.
//
// Copied from holo-i-ke-au's render/shadow.js (b480c27) and adapted for a
// box over the single-pack ground (shaders/ground.glsl.js): the Hawaiian
// packMetres blended a slot over the archipelago; here it is the box's own
// pack, archMetres. It is a fullscreen pass into its own target, so it needs
// no log-depth chunks. The table has no cast shadows (its relief is
// hillshaded); a box's ground attaches the map with PackTerrain.setShadow.
// Handed to the engine workflow at the fork.

import * as THREE from 'three'
import { constants } from './shaders/common.glsl.js'
import { world } from './shaders/ground.glsl.js'
import { fullscreenTriangle } from './pipeline.js'

const fragment = /* glsl */ `
${constants}
${world}
uniform vec4 uOwnRect;
uniform vec3 uSunDir;
uniform float uStep;   // world units: about one texel of the map
uniform float uTop;    // world Y of the highest ground; a ray above it is clear
in vec2 vUv;
float packMetres(vec2 xz) { return archMetres(xz); }
void main() {
  vec2 xz = uOwnRect.xy + vUv * (uOwnRect.zw - uOwnRect.xy);
  float h0 = max(packMetres(xz), 0.0) * uVert + uStep * 0.02;
  vec2 d = normalize(uSunDir.xz + 1e-6);
  float rise = uSunDir.y / max(length(uSunDir.xz), 1e-4); // world y per unit
  float lit = 1.0;
  float t = uStep * 0.7;
  for (int i = 0; i < 56; i++) {
    vec2 p = xz + d * t;
    float ray = h0 + t * rise;
    float g = max(packMetres(p), 0.0) * uVert;
    lit = min(lit, 10.0 * (ray - g) / t + 0.5);
    if (lit <= 0.0 || ray > uTop) break;
    t = t * 1.085 + uStep * 0.35;
  }
  float s = clamp(lit, 0.0, 1.0);
  s = s * s * (3.0 - 2.0 * s);
  s *= smoothstep(-0.02, 0.04, uSunDir.y);
  gl_FragColor = vec4(s, s, s, 1.0);
}
`

export class PackShadow {
  /** terrain: the box's PackTerrain (its uniforms carry the ground); maxSize: the map's longer side, texels. */
  constructor(terrain, maxSize = 1024, fragmentShader = fragment) {
    const { W, H } = terrain
    const f = Math.min(1, maxSize / Math.max(W, H))
    const w = Math.max(16, Math.round(W * f))
    const h = Math.max(16, Math.round(H * f))
    this.terrain = terrain
    this.rt = new THREE.WebGLRenderTarget(w, h, {
      type: THREE.UnsignedByteType,
      format: THREE.RedFormat, // (one channel: a quarter of the memory)
      depthBuffer: false,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    })
    const r = terrain.pack.rect
    this.uniforms = {
      ...terrain.uniforms,
      uSunDir: { value: new THREE.Vector3(0, 1, 0) },
      uStep: { value: Math.max((r.x1 - r.x0) / w, (r.z1 - r.z0) / h) },
      uTop: { value: 1 },
    }
    this.material = new THREE.ShaderMaterial({
      vertexShader: `out vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
      fragmentShader,
      uniforms: this.uniforms,
      depthTest: false,
      depthWrite: false,
    })
    this.scene = new THREE.Scene()
    const m = new THREE.Mesh(fullscreenTriangle(), this.material)
    m.frustumCulled = false
    this.scene.add(m)
    this.cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    this.h = h
    this.strips = 4
    this.strip = -1
    this.drawn = { sun: new THREE.Vector3(0, -2, 0), vert: -1, k: -1 }
  }

  get texture() {
    return this.rt.texture
  }

  /** Redraw a strip if the sun or the exaggeration has moved since the last full map (k: a detail weight, 1 in a box). */
  update(renderer, sunDir, vert, k = 1, top) {
    const u = this.uniforms
    const was = this.drawn
    if (this.strip < 0) {
      const moved = sunDir.angleTo(was.sun) > 0.004 || Math.abs(vert - was.vert) > was.vert * 0.015 || Math.abs(k - was.k) > 0.03
      if (!moved) return
      u.uSunDir.value.copy(sunDir)
      u.uTop.value = top
      was.sun.copy(sunDir)
      was.vert = vert
      was.k = k
      // (a first map is drawn whole; later ones a strip a frame)
      if (!this.ever) {
        this.ever = true
        return this.draw(renderer, -1)
      }
      this.strip = 0
    }
    this.draw(renderer, this.strip)
    this.strip = this.strip + 1 >= this.strips ? -1 : this.strip + 1
  }

  draw(renderer, strip) {
    const rt = this.rt
    if (strip >= 0) {
      const sh = Math.ceil(this.h / this.strips)
      rt.scissor.set(0, strip * sh, rt.width, sh)
      rt.scissorTest = true
    } else rt.scissorTest = false
    const prev = renderer.getRenderTarget()
    renderer.setRenderTarget(rt)
    renderer.render(this.scene, this.cam)
    renderer.setRenderTarget(prev)
    rt.scissorTest = false
  }

  dispose() {
    this.rt.dispose()
    this.material.dispose()
  }
}
