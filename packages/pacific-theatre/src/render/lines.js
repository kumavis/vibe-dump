// Moku and ahupuaʻa boundaries, drawn as lines draped on the ground.
//
// Each segment is an instanced quad whose two ends look up the ground under
// them in the vertex shader (groundMetres, common.glsl.js), so the lines sit on
// whichever pack is showing there at the exaggeration of the moment, island
// detail and all, with nothing to rebuild as the camera zooms. The quad is
// widened in screen space to a fixed number of pixels and lifted a little off
// the surface, more the further it is from the camera. Segments are split to
// about 150 m first, so a long straight run still follows the ridges between
// its ends. Shared edges between neighbouring polygons are drawn once.
//
// The lines are kept in one batch per island, each with its own bounds, so a
// close view over one island doesn't pay for the other seven.

import * as THREE from 'three'
import { constants, world, ground } from './shaders/common.glsl.js'
import { islandKey } from '../geo.js'

const MAX_SEG = 1.5 // world units (150 m)

const lineVertex = /* glsl */ `
${constants}
${world}
${ground}
in vec4 aSeg;            // the segment's ends: ax, az, bx, bz
uniform vec2 uResolution;  // drawing buffer, px
uniform float uWidth;      // px
uniform vec3 uCamPos;
out float vFade;

vec3 draped(vec2 xz) {
  vec3 p = vec3(xz.x, max(groundMetres(xz), 0.0) * uVert, xz.y);
  p.y += 0.015 + distance(uCamPos, p) * 0.0022;
  return p;
}

void main() {
  vec3 A = draped(aSeg.xy);
  vec3 B = draped(aSeg.zw);
  mat4 pv = projectionMatrix * viewMatrix;
  vec4 ca = pv * vec4(A, 1.0);
  vec4 cb = pv * vec4(B, 1.0);
  // a segment through the near plane is cut where it crosses it
  const float W0 = 1e-3;
  if (ca.w < W0 && cb.w < W0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  if (ca.w < W0) ca = mix(ca, cb, (W0 - ca.w) / (cb.w - ca.w));
  if (cb.w < W0) cb = mix(cb, ca, (W0 - cb.w) / (ca.w - cb.w));
  vec2 sa = ca.xy / ca.w;
  vec2 sb = cb.xy / cb.w;
  vec2 d = (sb - sa) * uResolution;
  float len = length(d);
  vec2 dir = len > 1e-5 ? d / len : vec2(1.0, 0.0);
  vec2 nrm = vec2(-dir.y, dir.x);
  bool atB = position.x > 0.5;
  vec4 c = atB ? cb : ca;
  // half the width either side, and as far again past each end so the joins close
  vec2 off = (nrm * position.y + dir * (atB ? 0.5 : -0.5)) * uWidth / uResolution;
  c.xy += off * c.w;
  gl_Position = c;
  vFade = 1.0;
}
`

const lineFragment = /* glsl */ `
uniform vec3 uColor;
uniform float uOpacity;
in float vFade;
void main() {
  gl_FragColor = vec4(uColor, uOpacity * vFade);
}
`

/** Rings of a Polygon / MultiPolygon, as arrays of [lon, lat]. */
function ringsOf(g) {
  if (!g) return []
  if (g.type === 'Polygon') return g.coordinates
  if (g.type === 'MultiPolygon') return g.coordinates.flat()
  if (g.type === 'LineString') return [g.coordinates]
  if (g.type === 'MultiLineString') return g.coordinates
  return []
}

/** Unique edges of a FeatureCollection, split to MAX_SEG, batched by island. */
function buildSegments(fc, proj) {
  const byIsland = new Map()
  const seen = new Set()
  const q = (v) => Math.round(v * 1e6)
  for (const f of fc?.features || []) {
    const key = islandKey(f.properties?.island) || 'other'
    let arr = byIsland.get(key)
    if (!arr) byIsland.set(key, (arr = []))
    for (const ring of ringsOf(f.geometry)) {
      for (let i = 0; i + 1 < ring.length; i++) {
        const p = ring[i]
        const r = ring[i + 1]
        const ka = `${q(p[0])},${q(p[1])}`
        const kb = `${q(r[0])},${q(r[1])}`
        if (ka === kb) continue
        const k = ka < kb ? `${ka}|${kb}` : `${kb}|${ka}`
        if (seen.has(k)) continue
        seen.add(k)
        const [ax, az] = proj.toWorld(p)
        const [bx, bz] = proj.toWorld(r)
        const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, bz - az) / MAX_SEG))
        for (let s = 0; s < n; s++) {
          const t0 = s / n
          const t1 = (s + 1) / n
          arr.push(ax + (bx - ax) * t0, az + (bz - az) * t0, ax + (bx - ax) * t1, az + (bz - az) * t1)
        }
      }
    }
  }
  return byIsland
}

class LineSet {
  constructor(fc, proj, uniforms, { color, width, order }) {
    this.group = new THREE.Group()
    this.uniforms = {
      ...uniforms,
      uResolution: { value: new THREE.Vector2(1, 1) },
      uWidth: { value: width },
      uCamPos: { value: new THREE.Vector3() },
      uColor: { value: new THREE.Color(...color) },
      uOpacity: { value: 1 },
    }
    this.material = new THREE.ShaderMaterial({
      vertexShader: lineVertex,
      fragmentShader: lineFragment,
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -4,
    })
    // the quad: x 0 at A, 1 at B; y the side
    const quad = new Float32Array([0, -1, 0, 0, 1, 0, 1, -1, 0, 1, 1, 0])
    this.count = 0
    for (const [, segs] of buildSegments(fc, proj)) {
      if (!segs.length) continue
      const g = new THREE.InstancedBufferGeometry()
      g.setAttribute('position', new THREE.BufferAttribute(quad, 3))
      g.setIndex([0, 2, 1, 1, 2, 3])
      const data = new Float32Array(segs)
      g.setAttribute('aSeg', new THREE.InstancedBufferAttribute(data, 4))
      g.instanceCount = data.length / 4
      this.count += g.instanceCount
      // (bounds by hand: three's would only see the unit quad)
      let x0 = Infinity
      let x1 = -Infinity
      let z0 = Infinity
      let z1 = -Infinity
      for (let i = 0; i < data.length; i += 2) {
        x0 = Math.min(x0, data[i])
        x1 = Math.max(x1, data[i])
        z0 = Math.min(z0, data[i + 1])
        z1 = Math.max(z1, data[i + 1])
      }
      const c = new THREE.Vector3((x0 + x1) / 2, 60, (z0 + z1) / 2)
      g.boundingSphere = new THREE.Sphere(c, Math.hypot(x1 - x0, z1 - z0, 300) / 2 + 10)
      const mesh = new THREE.Mesh(g, this.material)
      mesh.renderOrder = order
      this.group.add(mesh)
    }
  }

  update(camera, resolution, opacity) {
    this.uniforms.uResolution.value.copy(resolution)
    this.uniforms.uCamPos.value.copy(camera.position)
    this.uniforms.uOpacity.value = opacity
    this.group.visible = opacity > 0.01 && this.count > 0
  }
}

export class Boundaries {
  constructor(data, uniforms) {
    this.group = new THREE.Group()
    // moku lines warm and wider, ahupuaʻa lines pale and fine (the ahupuaʻa
    // app's overlay colours, in the scene's linear light)
    this.moku = new LineSet(data.moku, data.proj, uniforms, { color: [1.5, 1.08, 0.52], width: 2.2, order: 3 })
    this.ahupuaa = new LineSet(data.ahupuaa, data.proj, uniforms, { color: [1.25, 1.2, 1.06], width: 1.3, order: 2 })
    this.group.add(this.ahupuaa.group, this.moku.group)
    this.visible = true
    this._res = new THREE.Vector2()
  }

  /** Moku lines show from far off; ahupuaʻa lines fade in as the camera closes in on an island. */
  update(camera, renderer, distance, light = 1) {
    renderer.getDrawingBufferSize(this._res)
    const dpr = renderer.getPixelRatio()
    const on = this.visible ? 1 : 0
    const s = (a, b, x) => {
      const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
      return t * t * (3 - 2 * t)
    }
    this.moku.uniforms.uWidth.value = (1.3 + 1.1 * (1 - s(800, 4000, distance))) * dpr
    this.ahupuaa.uniforms.uWidth.value = 1.25 * dpr
    this.moku.uniforms.uColor.value.setRGB(1.5 * light, 1.08 * light, 0.52 * light)
    this.ahupuaa.uniforms.uColor.value.setRGB(1.25 * light, 1.2 * light, 1.06 * light)
    this.moku.update(camera, this._res, on * (0.55 + 0.4 * (1 - s(1500, 6000, distance))))
    this.ahupuaa.update(camera, this._res, on * 0.75 * (1 - s(220, 650, distance)))
  }
}
