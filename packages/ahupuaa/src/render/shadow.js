// Sun shadows cast by the land itself, as a top-down map.
//
// Each texel marches toward the sun over the height texture and records how
// much of the sun's disc clears the ridges (soft, with a penumbra that widens
// with distance — the classic heightfield soft-shadow trick). It only needs
// redrawing when the sun has moved, and everything lit samples it by world xz:
// the land, the sea, the trees standing on it. When the clock runs fast (the
// tour sweeps through hours in seconds) it is redrawn a strip per frame, so the
// cost is spread out instead of landing on one frame.

import * as THREE from 'three'
import { constants, heightFetch } from './shaders/common.glsl.js'
import { fullscreenTriangle } from './pipeline.js'

const fragment = /* glsl */ `
${constants}
${heightFetch}
uniform vec3 uSunDir;
in vec2 vUv;
void main() {
  vec2 xz = (vUv - 0.5) * WORLD;
  float h0 = max(metresAt(xz), 0.0) * Y_PER_M + 0.02;
  vec2 d = normalize(uSunDir.xz + 1e-6);
  float rise = uSunDir.y / max(length(uSunDir.xz), 1e-4); // world y per unit
  float lit = 1.0;
  float t = 0.12;
  for (int i = 0; i < 56; i++) {
    vec2 p = xz + d * t;
    float ray = h0 + t * rise;
    float g = max(metresAt(p), 0.0) * Y_PER_M;
    lit = min(lit, 10.0 * (ray - g) / t + 0.5);
    if (lit <= 0.0 || ray > 26.0) break;
    t *= 1.085;
    t += 0.06;
  }
  float s = clamp(lit, 0.0, 1.0);
  s = s * s * (3.0 - 2.0 * s);
  // below the horizon nothing is sunlit
  s *= smoothstep(-0.02, 0.04, uSunDir.y);
  gl_FragColor = vec4(s, s, s, 1.0);
}
`

export class TerrainShadow {
  constructor(heightTex, size = 1024) {
    this.rt = new THREE.WebGLRenderTarget(size, size, {
      type: THREE.UnsignedByteType,
      depthBuffer: false,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    })
    this.material = new THREE.ShaderMaterial({
      vertexShader: `out vec2 vUv; void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
      fragmentShader: fragment,
      uniforms: { uHeight: { value: heightTex }, uSunDir: { value: new THREE.Vector3(0, 1, 0) } },
      depthTest: false,
      depthWrite: false,
    })
    this.scene = new THREE.Scene()
    const m = new THREE.Mesh(fullscreenTriangle(), this.material)
    m.frustumCulled = false
    this.scene.add(m)
    this.cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    this.last = new THREE.Vector3(0, -2, 0)
    this.size = size
    this.strips = 4
    this.strip = -1 // the strip being redrawn, or -1 when up to date
  }

  get texture() {
    return this.rt.texture
  }

  update(renderer, sunDir, force = false) {
    if (force || !this.drawn) {
      this.drawn = true
      this.draw(renderer, sunDir, -1)
      return
    }
    if (this.strip < 0) {
      if (sunDir.angleTo(this.last) < 0.004) return
      // start a sweep with the sun where it is now
      this.material.uniforms.uSunDir.value.copy(sunDir)
      this.last.copy(sunDir)
      this.strip = 0
    }
    this.draw(renderer, null, this.strip)
    this.strip = this.strip + 1 >= this.strips ? -1 : this.strip + 1
  }

  /** Redraw one horizontal strip of the map (or all of it, strip -1). */
  draw(renderer, sunDir, strip) {
    if (sunDir) {
      this.material.uniforms.uSunDir.value.copy(sunDir)
      this.last.copy(sunDir)
    }
    const rt = this.rt
    if (strip >= 0) {
      const h = this.size / this.strips
      rt.scissor.set(0, strip * h, this.size, h)
      rt.scissorTest = true
    } else rt.scissorTest = false
    const prev = renderer.getRenderTarget()
    renderer.setRenderTarget(rt)
    renderer.render(this.scene, this.cam)
    renderer.setRenderTarget(prev)
    rt.scissorTest = false
  }
}
