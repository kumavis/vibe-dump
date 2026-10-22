// Lines draped on the ground: the coast's ink, the front's outlines and
// perimeters, the declared lines, a box's outline on the table.
//
// Each segment is an instanced quad whose two ends look up the ground under
// them in the vertex shader (groundMetres, shaders/ground.glsl.js), so the
// lines sit on whatever the scene's pack shows there at the exaggeration of
// the moment, with nothing to rebuild as the camera zooms. The quad is widened
// in screen space to a fixed number of pixels and lifted a little off the
// surface, more the further it is from the camera. Segments are split to
// `maxSeg` world units first, so a long straight run still follows the
// ridges between its ends. Shared edges between neighbouring polygons are
// drawn once.
//
// Copied from holo-i-ke-au's render/lines.js (b480c27) as LineSet, made
// unit-agnostic (the split length, the lift and the bounds come from the
// caller in its scene's units), with the batch key an option (the Hawaiian
// batches were per island), long lon/lat legs densified before they are
// projected (≤ 50 km, so an edge drawn straight on a plate carrée source map
// is not a chord across the azimuthal table), the four log-depth chunks
// (shaders/logdepth.glsl.js), and no polygonOffset, which does nothing under
// the logarithmic depth buffer: the lines rely on their lift. The Hawaiian
// Boundaries (moku and ahupuaʻa) are gone.
//
// Dashes (the table workflow's extension, for the front's perimeters, the
// declared lines and the date line): every segment carries its distance
// along its own line at both ends (aDist), and a set made with `dash` draws
// a dash and a gap of uDash.x world units (uDash.y of it inked); the caller
// scales uDash.x with the camera's distance each frame (setDash) so the
// dashes keep their size on screen. A set without `dash` draws solid, as
// before.

import * as THREE from 'three'
import { constants } from './shaders/common.glsl.js'
import { world, ground } from './shaders/ground.glsl.js'
import { logDepthParsVertex, logDepthVertex, logDepthParsFragment, logDepthFragment } from './shaders/logdepth.glsl.js'
import { densifyLonLat } from '../geo.js'

const lineVertex = /* glsl */ `
${constants}
${world}
${ground}
${logDepthParsVertex}
in vec4 aSeg;            // the segment's ends: ax, az, bx, bz
in vec2 aDist;           // distance along its line at A and at B, world units
uniform vec2 uResolution;  // drawing buffer, px
uniform float uWidth;      // px
uniform vec2 uLift;        // world units off the ground: x + y × the distance to the camera
uniform vec3 uCamPos;
out float vFade;
out float vS;

vec3 draped(vec2 xz) {
  vec3 p = vec3(xz.x, max(groundMetres(xz), 0.0) * uVert, xz.y);
  p.y += uLift.x + distance(uCamPos, p) * uLift.y;
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
  vS = position.x > 0.5 ? aDist.y : aDist.x;
  if (ca.w < W0 && cb.w < W0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); vFade = 0.0; ${logDepthVertex} return; }
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
  ${logDepthVertex}
}
`

const lineFragment = /* glsl */ `
${logDepthParsFragment}
uniform vec3 uColor;
uniform float uOpacity;
uniform vec2 uDash;        // dash and gap, world units (0: solid); the inked share
in float vFade;
in float vS;
void main() {
  ${logDepthFragment}
  float a = uOpacity * vFade;
  if (uDash.x > 0.0) {
    float u = vS / uDash.x;
    float ph = fract(u);
    float w = max(fwidth(u) * 1.2, 1e-3);
    a *= smoothstep(0.0, w, ph) * (1.0 - smoothstep(uDash.y - w, uDash.y, ph));
  }
  gl_FragColor = vec4(uColor, a);
}
`

/** Rings and lines of a geometry, as arrays of [lon, lat]. */
export function ringsOf(g) {
  if (!g) return []
  if (g.type === 'Polygon') return g.coordinates
  if (g.type === 'MultiPolygon') return g.coordinates.flat()
  if (g.type === 'LineString') return [g.coordinates]
  if (g.type === 'MultiLineString') return g.coordinates
  if (g.type === 'GeometryCollection') return g.geometries.flatMap(ringsOf)
  return []
}

/**
 * Unique edges, split to maxSeg world units, batched by key. `source` is a
 * FeatureCollection in lon/lat (projected with proj, its long legs densified
 * first), or, with `world: true`, an array of polylines already in world
 * [x, z].
 */
function buildSegments(source, proj, { maxSeg, batch, world: inWorld, densifyKm }) {
  const byKey = new Map()
  const seen = new Set()
  const q = (v) => Math.round(v * 1e6)
  const add = (key, line, toXZ) => {
    let arr = byKey.get(key)
    if (!arr) byKey.set(key, (arr = { seg: [], dist: [] }))
    let along = 0
    for (let i = 0; i + 1 < line.length; i++) {
      const p = line[i]
      const r = line[i + 1]
      const ka = `${q(p[0])},${q(p[1])}`
      const kb = `${q(r[0])},${q(r[1])}`
      if (ka === kb) continue
      const [ax, az] = toXZ(p)
      const [bx, bz] = toXZ(r)
      const L = Math.hypot(bx - ax, bz - az)
      const k = ka < kb ? `${ka}|${kb}` : `${kb}|${ka}`
      if (seen.has(k)) {
        along += L
        continue
      }
      seen.add(k)
      const n = Math.max(1, Math.ceil(L / maxSeg))
      for (let s = 0; s < n; s++) {
        const t0 = s / n
        const t1 = (s + 1) / n
        arr.seg.push(ax + (bx - ax) * t0, az + (bz - az) * t0, ax + (bx - ax) * t1, az + (bz - az) * t1)
        arr.dist.push(along + L * t0, along + L * t1)
      }
      along += L
    }
  }
  if (inWorld) {
    for (const line of source || []) add('all', line, (p) => p)
  } else {
    for (const f of source?.features || []) {
      const key = batch ? batch(f) : 'all'
      for (const ring of ringsOf(f.geometry)) add(key, densifyKm ? densifyLonLat(ring, densifyKm) : ring, (p) => proj.toWorld(p))
    }
  }
  return byKey
}

export class LineSet {
  /**
   * source, proj: see buildSegments. uniforms: the scene's bag (light and
   * ground). opts: { color: [r, g, b] (linear, may exceed 1), width (px),
   * order (renderOrder), maxSeg (world units), lift: [base, k] (world units,
   * and per unit of camera distance), height (world units: the tallest the
   * ground gets, for the bounds), batch (feature → key), densifyKm, world,
   * dash ([dash and gap, inked share]: world units, scaled each frame by
   * setDash; omitted: solid) }
   */
  constructor(source, proj, uniforms, opts = {}) {
    const { color = [1, 1, 1], width = 1.5, order = 3, maxSeg = 1.5, lift = [0.015, 0.0022], height = 60, batch = null, densifyKm = 50, world: inWorld = false, dash = null } = opts
    this.group = new THREE.Group()
    this.uniforms = {
      ...uniforms,
      uResolution: { value: new THREE.Vector2(1, 1) },
      uWidth: { value: width },
      uLift: { value: new THREE.Vector2(lift[0], lift[1]) },
      uCamPos: { value: new THREE.Vector3() },
      uColor: { value: new THREE.Color(...color) },
      uOpacity: { value: 1 },
      uDash: { value: new THREE.Vector2(dash ? dash[0] : 0, dash ? dash[1] : 0.55) },
    }
    this.dashed = !!dash
    this.material = new THREE.ShaderMaterial({
      vertexShader: lineVertex,
      fragmentShader: lineFragment,
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: false,
    })
    // the quad: x 0 at A, 1 at B; y the side
    const quad = new Float32Array([0, -1, 0, 0, 1, 0, 1, -1, 0, 1, 1, 0])
    this.count = 0
    this.geometries = []
    for (const [, { seg: segs, dist }] of buildSegments(source, proj, { maxSeg, batch, world: inWorld, densifyKm })) {
      if (!segs.length) continue
      const g = new THREE.InstancedBufferGeometry()
      g.setAttribute('position', new THREE.BufferAttribute(quad, 3))
      g.setIndex([0, 2, 1, 1, 2, 3])
      const data = new Float32Array(segs)
      g.setAttribute('aSeg', new THREE.InstancedBufferAttribute(data, 4))
      g.setAttribute('aDist', new THREE.InstancedBufferAttribute(new Float32Array(dist), 2))
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
      const c = new THREE.Vector3((x0 + x1) / 2, height / 2, (z0 + z1) / 2)
      g.boundingSphere = new THREE.Sphere(c, Math.hypot(x1 - x0, z1 - z0, height) / 2 + maxSeg)
      const mesh = new THREE.Mesh(g, this.material)
      mesh.renderOrder = order
      this.group.add(mesh)
      this.geometries.push(g)
    }
  }

  /** A dashed set's dash and gap, world units (scale it with the camera's distance to keep its size on screen). */
  setDash(length, share = this.uniforms.uDash.value.y) {
    if (this.dashed) this.uniforms.uDash.value.set(length, share)
  }

  update(camera, resolution, opacity = 1) {
    this.uniforms.uResolution.value.copy(resolution)
    this.uniforms.uCamPos.value.copy(camera.position)
    this.uniforms.uOpacity.value = opacity
    this.group.visible = opacity > 0.01 && this.count > 0
  }

  dispose() {
    for (const g of this.geometries) g.dispose()
    this.material.dispose()
    this.group.clear()
  }
}
