// glows.js — soft points of light pinned to paper (used by spreads 5 and 6).
//
// Each glow follows an anchor Object3D (usually made with paper.place on a
// panel frame), so it rides its mechanism as the book opens and folds. All the
// glows are one THREE.Points (one draw call). Per frame the caller sets
// glow[i] (0 = off, 1 = normal, >1 = hot) and calls update(), which walks each
// anchor's parent chain to the spread group (no allocations) and refreshes the
// position and brightness attributes.
//
// `lift` pulls each sprite that far toward the camera, so a glow sitting on a
// card's edge is drawn in front of that card instead of being cut by it.

const VERT = /* glsl */ `
uniform float uHalfH;
uniform float uLift;
uniform vec3 uHot;
attribute float aGlow;
attribute float aSize;
attribute vec3 aColor;
varying vec3 vColor;
varying float vGlow;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  mv.xyz += normalize(-mv.xyz) * uLift;
  gl_Position = projectionMatrix * mv;
  float g = max(aGlow, 0.0);
  gl_PointSize = aSize * (0.55 + 0.55 * min(g, 1.6)) * projectionMatrix[1][1] * uHalfH / -mv.z;
  vColor = mix(aColor, uHot, clamp((g - 0.55) * 1.4, 0.0, 0.85));
  vGlow = g;
}
`

const FRAG = /* glsl */ `
uniform float uAlpha;
varying vec3 vColor;
varying float vGlow;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float r2 = dot(d, d) * 4.0;
  if (r2 > 1.0) discard;
  float core = exp(-r2 * 14.0);
  float halo = exp(-r2 * 3.2) * (1.0 - r2) * 0.42;
  gl_FragColor = vec4(vColor * (core * 1.3 + halo) * vGlow * uAlpha, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`

export function createGlows(THREE, group, { anchors, sizes, colors, hot = '#ffffff', lift = 0 }) {
  const n = anchors.length
  const pos = new Float32Array(n * 3)
  const glowArr = new Float32Array(n)
  const sizeArr = new Float32Array(n)
  const colArr = new Float32Array(n * 3)
  const c = new THREE.Color()
  for (let i = 0; i < n; i++) {
    sizeArr[i] = Array.isArray(sizes) ? sizes[i] : sizes
    c.set(Array.isArray(colors) ? colors[i] : colors)
    colArr[i * 3] = c.r
    colArr[i * 3 + 1] = c.g
    colArr[i * 3 + 2] = c.b
    glowArr[i] = 1
  }
  const geometry = new THREE.BufferGeometry()
  const posAttr = new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage)
  const glowAttr = new THREE.BufferAttribute(glowArr, 1).setUsage(THREE.DynamicDrawUsage)
  geometry.setAttribute('position', posAttr)
  geometry.setAttribute('aGlow', glowAttr)
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizeArr, 1))
  geometry.setAttribute('aColor', new THREE.BufferAttribute(colArr, 3))
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e4)

  const uniforms = {
    uHalfH: { value: 400 },
    uLift: { value: lift },
    uHot: { value: new THREE.Color(hot) },
    uAlpha: { value: 0 },
  }
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const points = new THREE.Points(geometry, material)
  points.frustumCulled = false
  points.renderOrder = 5
  const buf = new THREE.Vector2()
  points.onBeforeRender = (renderer) => {
    renderer.getDrawingBufferSize(buf)
    uniforms.uHalfH.value = buf.y / 2
  }
  group.add(points)

  const v = new THREE.Vector3()
  return {
    points,
    glow: glowArr,
    // Group-local position of anchor i (valid after update()).
    position(i, out) {
      return out.set(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2])
    },
    update(alpha) {
      uniforms.uAlpha.value = alpha
      points.visible = alpha > 0.002
      if (!points.visible) return
      for (let i = 0; i < n; i++) {
        v.set(0, 0, 0)
        let o = anchors[i]
        while (o && o !== group) {
          o.updateMatrix()
          v.applyMatrix4(o.matrix)
          o = o.parent
        }
        pos[i * 3] = v.x
        pos[i * 3 + 1] = v.y
        pos[i * 3 + 2] = v.z
      }
      posAttr.needsUpdate = true
      glowAttr.needsUpdate = true
    },
    dispose() {
      geometry.dispose()
      material.dispose()
    },
  }
}
