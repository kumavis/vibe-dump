// Ribbons draped on the district's ground: the streams, the trail up the
// valley, and the battle's fronts. As lines.js drapes the boundaries, every
// corner of every segment looks the ground up in the vertex shader
// (common.glsl.js groundMetres), so a ribbon lies on the ground of the year
// at the exaggeration of the moment, patch and terraces and all; unlike the
// boundaries it has a width on the ground, in world units, and only a floor
// of a pixel or so on the screen.
//
// Three looks: water (a stream: dark water with the sky in it, gone where
// the ground of the year is under the sea, so a stream ends at the shore of
// the year), earth (the trail, worn bare), and a band (a front: a faint
// soft-edged wash of its side's colour, fading out toward its ends rather
// than cut off square).

import * as THREE from 'three'
import { constants, noise, world, ground, lighting } from '../render/shaders/common.glsl.js'

const vertexShader = /* glsl */ `
${constants}
${world}
${ground}
in vec4 aSeg;   // the segment's ends: ax, az, bx, bz
in vec4 aInfo;  // width at a and at b (world units), distance along at a and at b
in float aEnd;  // the whole line's length
uniform vec3 uCamPos;
uniform float uPxK;    // world units per pixel per unit of distance from the camera
uniform float uMinPx;
uniform float uLift;
out float vSide;
out float vS;
out float vEnd;
out float vGround;
out vec3 vWorld;
void main() {
  vec2 a = aSeg.xy;
  vec2 b = aSeg.zw;
  vec2 d = b - a;
  float L = length(d);
  vec2 dir = L > 1e-6 ? d / L : vec2(1.0, 0.0);
  vec2 nrm = vec2(-dir.y, dir.x);
  bool atB = position.x > 0.5;
  vec2 c = atB ? b : a;
  float w = atB ? aInfo.y : aInfo.x;
  vec3 C = vec3(c.x, max(groundMetres(c), 0.0) * uVert, c.y);
  float dist = distance(uCamPos, C);
  w = max(w, uMinPx * dist * uPxK);
  // (half the width either side, and a quarter of it on past each end so the joins close)
  vec2 xz = c + nrm * position.y * w * 0.5 + dir * (atB ? 0.25 : -0.25) * w;
  float g = groundMetres(xz);
  vGround = g;
  vSide = position.y;
  vS = atB ? aInfo.w : aInfo.z;
  vEnd = aEnd;
  vec3 p = vec3(xz.x, max(g, 0.0) * uVert, xz.y);
  p.y += uLift;
  vWorld = p;
  // The ground is drawn by a mesh coarser than the ribbon away from the
  // camera, which can stand metres over a stream's bed: drawn a little toward
  // the eye (as ahupuaʻa draws its ʻauwai), it isn't swallowed, and on the
  // screen it doesn't move.
  vec3 toCam = uCamPos - p;
  float dc = length(toCam);
  p += toCam / max(dc, 1e-3) * min(dc * 0.012, 1.2);
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
}
`

const fragmentShader = /* glsl */ `
${constants}
${noise}
${world}
${lighting}
uniform vec3 uColor;
uniform float uAlpha;
uniform int uMode;    // 0 water, 1 earth, 2 band
uniform float uEndFade; // world units over which a line fades in at its start and out at its end (0: cut square)
in float vSide;
in float vS;
in float vEnd;
in float vGround;
in vec3 vWorld;
void main() {
  float a = uAlpha;
  if (uEndFade > 0.0) {
    float f = min(uEndFade, vEnd * 0.3);
    a *= smoothstep(0.0, f, vS) * smoothstep(0.0, f, vEnd - vS);
  }
  vec3 col;
  float edge = abs(vSide);
  if (uMode == 0) {
    // a stream: gone where the ground of the year is the sea's
    a *= smoothstep(0.05, 0.4, vGround) * (1.0 - smoothstep(0.7, 1.0, edge));
    // (a stream from a kilometre up is the sky in it, broken by its riffles)
    vec3 V = normalize(cameraPosition - vWorld);
    float F = 0.04 + 0.96 * pow(1.0 - max(V.y, 0.0), 5.0);
    vec3 water = vec3(0.10, 0.19, 0.21) * (uSkyColor * 1.3 + uSunColor * max(uSunDir.y, 0.0));
    float riffle = vnoise(vec2(vS * 9.0 - uTime * 1.5, vSide * 2.0));
    col = mix(water, skyMap(reflect(-V, vec3(0.0, 1.0, 0.0))), 0.45 + 0.55 * F) * (0.9 + 0.35 * riffle);
  } else if (uMode == 1) {
    // the trail: worn earth, a little uneven along it
    a *= 1.0 - smoothstep(0.55, 1.0, edge);
    float k = 0.85 + 0.3 * vnoise(vec2(vS * 2.3, vSide * 1.7));
    col = uColor * k * (uSunColor * max(uSunDir.y, 0.0) * 0.8 + uSkyColor);
  } else {
    // a front: soft across, a little stronger at its middle
    a *= (1.0 - smoothstep(0.2, 1.0, edge)) * (0.75 + 0.25 * sin(vS * 1.3 + uTime * 0.6));
    col = uColor * (uSunColor * max(uSunDir.y, 0.0) * 0.7 + uSkyColor * 1.1);
  }
  if (a <= 0.003) discard;
  gl_FragColor = vec4(col, a);
}
`

const QUAD = new Float32Array([0, -1, 0, 0, 1, 0, 1, -1, 0, 1, 1, 0])

export class Ribbons {
  constructor(shared, camera) {
    this.shared = shared
    this.camera = camera
    this.group = new THREE.Group()
    this.batches = []
    this._res = new THREE.Vector2()
  }

  /**
   * One batch, one draw call: `lines` are { pts: [[x, z], …], width: [w, …] |
   * number } (world units); opts { mode: 'water' | 'earth' | 'band', colour,
   * alpha, minPx, lift, order, endFade }.
   */
  add(lines, { mode = 'earth', colour = [1, 1, 1], alpha = 1, minPx = 1, lift = 0.004, order = 5, endFade = 0 } = {}) {
    const seg = []
    const info = []
    const ends = []
    for (const { pts, width } of lines) {
      let total = 0
      for (let i = 0; i + 1 < pts.length; i++) total += Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1])
      let s = 0
      for (let i = 0; i + 1 < pts.length; i++) {
        const [ax, az] = pts[i]
        const [bx, bz] = pts[i + 1]
        const L = Math.hypot(bx - ax, bz - az)
        if (L < 1e-6) continue
        const wa = Array.isArray(width) ? width[i] : width
        const wb = Array.isArray(width) ? width[i + 1] : width
        seg.push(ax, az, bx, bz)
        info.push(wa, wb, s, s + L)
        ends.push(total)
        s += L
      }
    }
    if (!seg.length) return null
    const g = new THREE.InstancedBufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(QUAD, 3))
    g.setIndex([0, 2, 1, 1, 2, 3])
    g.setAttribute('aSeg', new THREE.InstancedBufferAttribute(new Float32Array(seg), 4))
    g.setAttribute('aInfo', new THREE.InstancedBufferAttribute(new Float32Array(info), 4))
    g.setAttribute('aEnd', new THREE.InstancedBufferAttribute(new Float32Array(ends), 1))
    g.instanceCount = seg.length / 4
    const uniforms = {
      ...this.shared.uniforms,
      uCamPos: { value: new THREE.Vector3() },
      uPxK: { value: 0.001 },
      uMinPx: { value: minPx },
      uLift: { value: lift },
      uColor: { value: new THREE.Color(...colour) },
      uAlpha: { value: alpha },
      uMode: { value: mode === 'water' ? 0 : mode === 'earth' ? 1 : 2 },
      uEndFade: { value: endFade },
    }
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      // (widened on the ground, not on the screen, so seen from above a quad
      // can come out wound either way)
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -4,
    })
    const mesh = new THREE.Mesh(g, material)
    mesh.frustumCulled = false
    mesh.renderOrder = order
    this.group.add(mesh)
    const batch = { mesh, uniforms, alpha, count: g.instanceCount }
    this.batches.push(batch)
    return batch
  }

  /** Every frame: the camera, and each batch's strength (its base alpha times `k`, per batch). */
  update(renderer) {
    renderer.getDrawingBufferSize(this._res)
    const cam = this.camera
    const pxK = (2 * Math.tan((cam.fov * Math.PI) / 360)) / Math.max(1, this._res.y / renderer.getPixelRatio())
    for (const b of this.batches) {
      b.uniforms.uCamPos.value.copy(cam.position)
      b.uniforms.uPxK.value = pxK
      b.mesh.visible = b.uniforms.uAlpha.value > 0.003
    }
  }

  dispose() {
    for (const b of this.batches) {
      b.mesh.geometry.dispose()
      b.mesh.material.dispose()
    }
  }
}
