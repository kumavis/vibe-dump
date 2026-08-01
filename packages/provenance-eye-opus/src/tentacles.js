import * as THREE from 'three'

// ---------------------------------------------------------------------------
// The other thing behind the triangle.
//
// Each tentacle is a tapered tube swept once along a curve at build time, then
// animated entirely in the vertex shader:
//
//   * every vertex carries `aT` (0 at the root, 1 at the tip) and `aAxis` (the
//     centreline point it was swept from). Growth collapses everything past
//     the advancing tip onto that centreline — zero-radius rings are
//     zero-area triangles, so the tentacle genuinely grows out of nothing
//     instead of scaling or being clipped.
//   * the writhe is a pair of out-of-phase sines whose amplitude ramps with
//     aT², so the root stays anchored in the casting and the tip does the
//     flailing.
// ---------------------------------------------------------------------------

const BASE_R = 0.9 // like the petals, inside the triangle's incircle (1.125)

function rng(seed) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

// Sweep a tapered, subtly ribbed tube along a curve. Local +Y is "outward".
function tubeGeometry(curve, { rings = 34, radial = 7, radius = 0.13 } = {}) {
  const frames = curve.computeFrenetFrames(rings - 1, false)
  const vertCount = rings * (radial + 1)
  const position = new Float32Array(vertCount * 3)
  const normal = new Float32Array(vertCount * 3)
  const uv = new Float32Array(vertCount * 2)
  const aT = new Float32Array(vertCount)
  const aAround = new Float32Array(vertCount)
  const aAxis = new Float32Array(vertCount * 3)
  const index = []

  const P = new THREE.Vector3()
  const V = new THREE.Vector3()

  for (let i = 0; i < rings; i++) {
    const t = i / (rings - 1)
    curve.getPointAt(t, P)
    const N = frames.normals[i]
    const B = frames.binormals[i]
    // Fat just past the root, tapering to a point, with a low ripple so the
    // silhouette has some muscle to it.
    // Stays thick well past halfway before running out to a fine point — a
    // taper that starts too early reads as a leaf rather than a limb.
    const taper = Math.pow(1 - t, 0.8) * (0.5 + 0.5 * Math.sin(Math.min(1, t * 5.0) * Math.PI * 0.5))
    const r = radius * taper * (1 + 0.09 * Math.sin(t * 26))
    for (let j = 0; j <= radial; j++) {
      const a = (j / radial) * Math.PI * 2
      const cx = Math.cos(a)
      const sy = Math.sin(a)
      V.set(N.x * cx + B.x * sy, N.y * cx + B.y * sy, N.z * cx + B.z * sy)
      const k = i * (radial + 1) + j
      position[k * 3 + 0] = P.x + V.x * r
      position[k * 3 + 1] = P.y + V.y * r
      position[k * 3 + 2] = P.z + V.z * r
      normal[k * 3 + 0] = V.x
      normal[k * 3 + 1] = V.y
      normal[k * 3 + 2] = V.z
      uv[k * 2 + 0] = j / radial
      uv[k * 2 + 1] = t
      aT[k] = t
      aAround[k] = j / radial
      aAxis[k * 3 + 0] = P.x
      aAxis[k * 3 + 1] = P.y
      aAxis[k * 3 + 2] = P.z
    }
  }

  for (let i = 0; i < rings - 1; i++) {
    for (let j = 0; j < radial; j++) {
      const a = i * (radial + 1) + j
      const b = a + radial + 1
      index.push(a, b, a + 1, b, b + 1, a + 1)
    }
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(position, 3))
  geo.setAttribute('normal', new THREE.BufferAttribute(normal, 3))
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
  geo.setAttribute('aT', new THREE.BufferAttribute(aT, 1))
  geo.setAttribute('aAround', new THREE.BufferAttribute(aAround, 1))
  geo.setAttribute('aAxis', new THREE.BufferAttribute(aAxis, 3))
  geo.setIndex(index)
  return geo
}

export function createTentacles(envMap, { count = 9 } = {}) {
  const rand = rng(0x27d4eb2f)
  const group = new THREE.Group()
  group.visible = false

  const uniforms = {
    uTime: { value: 0 },
    uReach: { value: 0 },
    uGlow: { value: 0 },
    uGlowColor: { value: new THREE.Color(0x2effb0) },
  }

  // Barely metallic: at metalness 0.35 these read as painted tin against a dark
  // environment. Wet flesh wants a diffuse body with a tight specular on top.
  const material = new THREE.MeshStandardMaterial({
    color: 0x24413f,
    roughness: 0.34,
    metalness: 0.08,
    envMap,
    envMapIntensity: 0.8,
    emissive: 0x04140f,
    side: THREE.DoubleSide,
  })

  material.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uniforms.uTime
    shader.uniforms.uReach = uniforms.uReach
    shader.uniforms.uGlow = uniforms.uGlow
    shader.uniforms.uGlowColor = uniforms.uGlowColor
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
        attribute float aT;
        attribute float aAround;
        attribute vec3 aAxis;
        attribute float aPhase;
        uniform float uTime;
        uniform float uReach;
        varying vec3 vTNormal;
        varying vec3 vTView;
        varying float vT;
        varying float vAround;`
      )
      .replace(
        '#include <begin_vertex>',
        `vec3 transformed = vec3( position );
        vT = aT;
        vAround = aAround;
        // Collapse the ungrown remainder onto the centreline.
        float vis = 1.0 - smoothstep( uReach - 0.16, uReach, aT );
        transformed = mix( aAxis, transformed, vis );
        // Writhe. Depends only on aT, so collapsed rings stay degenerate.
        float amp = aT * aT;
        transformed.x += sin( aT * 5.2 - uTime * 1.6 + aPhase ) * 0.34 * amp;
        transformed.z += cos( aT * 3.4 - uTime * 1.15 + aPhase * 1.7 ) * 0.3 * amp;
        transformed.y += sin( aT * 2.1 - uTime * 0.9 + aPhase * 2.3 ) * 0.12 * amp;`
      )
      .replace(
        '#include <project_vertex>',
        `#include <project_vertex>
        vTView = -mvPosition.xyz;
        vTNormal = normalize( normalMatrix * objectNormal );`
      )
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        uniform float uGlow;
        uniform vec3 uGlowColor;
        varying vec3 vTNormal;
        varying vec3 vTView;
        varying float vT;
        varying float vAround;`
      )
      .replace(
        '#include <map_fragment>',
        `#include <map_fragment>
        // Two staggered rows of round suckers down one side. vAround runs 0..1
        // around the tube, so the rows sit at a fixed angle in the sweep's own
        // frame; measuring a real 2D distance keeps them discs rather than the
        // barcode a pair of independent bands produces.
        float sx = ( vAround - 0.5 ) * 2.6;
        float row = min( abs( sx - 0.34 ), abs( sx + 0.34 ) );
        float sy = ( fract( vT * 17.0 ) - 0.5 ) * 1.5;
        float sucker = smoothstep( 0.3, 0.09, length( vec2( row, sy ) ) )
                     * ( 1.0 - smoothstep( 0.5, 0.88, vT ) );
        diffuseColor.rgb = mix( diffuseColor.rgb, vec3( 0.38, 0.5, 0.41 ), sucker * 0.5 );`
      )
      .replace(
        '#include <roughnessmap_fragment>',
        `#include <roughnessmap_fragment>
        roughnessFactor = clamp( roughnessFactor - sucker * 0.14, 0.05, 1.0 );`
      )
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        float fres = pow( 1.0 - abs( dot( normalize( vTNormal ), normalize( vTView ) ) ), 3.2 );
        totalEmissiveRadiance += uGlowColor * ( fres * 0.55 + 0.05 ) * uGlow * ( 0.25 + 0.75 * vT );`
      )
  }

  for (let i = 0; i < count; i++) {
    // Fan them across the upper half of the circle, biased away from straight
    // down (that is where the cloud is) and never perfectly even.
    const spread = Math.PI * 1.62
    const a = -spread / 2 + (i / (count - 1)) * spread + (rand() - 0.5) * 0.16
    const len = 2.6 + rand() * 1.9
    const curlSign = rand() < 0.5 ? -1 : 1
    const curl = (0.5 + rand() * 0.9) * curlSign
    const lean = (rand() - 0.5) * 0.9

    const pts = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(curl * 0.1, len * 0.3, -0.15 + lean * 0.1),
      new THREE.Vector3(curl * 0.5, len * 0.62, -0.35 + lean * 0.3),
      new THREE.Vector3(curl * 1.15, len * 0.86, -0.25 + lean * 0.7),
      new THREE.Vector3(curl * 1.85, len, 0.1 + lean),
    ]
    const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal', 0.5)
    const geo = tubeGeometry(curve, { rings: 34, radial: 9, radius: 0.23 + rand() * 0.1 })
    // Per-tentacle phase, baked as an attribute so all nine share one material.
    const phase = new Float32Array(geo.attributes.position.count).fill(rand() * Math.PI * 2)
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1))
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, len * 0.5, 0), len * 1.2)

    const pivot = new THREE.Group()
    pivot.rotation.z = a
    pivot.position.z = -0.8 - rand() * 0.5
    const mesh = new THREE.Mesh(geo, material)
    mesh.position.y = BASE_R
    pivot.add(mesh)
    group.add(pivot)
  }

  return {
    group,
    update(t, { reach, glow }) {
      uniforms.uTime.value = t
      uniforms.uReach.value = reach
      uniforms.uGlow.value = glow
      group.visible = reach > 0.001
    },
  }
}
