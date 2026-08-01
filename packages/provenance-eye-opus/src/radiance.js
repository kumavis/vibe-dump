import * as THREE from 'three'
import { castMetal } from './metal.js'

// ---------------------------------------------------------------------------
// What happens behind the triangle when the eye shuts: a fan of god-rays, a
// bloom-free halo, and a corona of gold sun-petals that unfurl out of hiding.
//
// Everything here is anchored at radius 0.95 or less, which is inside the
// triangle's incircle (1.125) — so a fully retracted petal is hidden behind the
// casting no matter which direction it points, without a stencil or a clip
// plane.
// ---------------------------------------------------------------------------

const PETAL_BASE_R = 0.95

function rng(seed) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

// --- god-rays --------------------------------------------------------------
function createBeams({ count = 30, inner = 0.5, outer = 9.5 } = {}) {
  const rand = rng(0xb5297a4d)
  const position = new Float32Array(count * 4 * 3)
  const across = new Float32Array(count * 4)
  const along = new Float32Array(count * 4)
  const seed = new Float32Array(count * 4)
  const index = new Uint16Array(count * 6)

  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + (rand() - 0.5) * 0.14
    // Angular half-width, wildly varied so the fan reads as light and not as a
    // gear. A handful of very wide, very faint wedges fill the gaps.
    const w = (Math.PI / count) * (0.14 + rand() * rand() * 2.6)
    const r1 = outer * (0.42 + rand() * 0.58)
    const s = rand()
    const pts = [
      [a - w, inner, -1, 0],
      [a + w, inner, 1, 0],
      [a + w, r1, 1, 1],
      [a - w, r1, -1, 1],
    ]
    for (let v = 0; v < 4; v++) {
      const k = i * 4 + v
      const [ang, rad, ac, al] = pts[v]
      position[k * 3 + 0] = Math.cos(ang) * rad
      position[k * 3 + 1] = Math.sin(ang) * rad
      position[k * 3 + 2] = 0
      across[k] = ac
      along[k] = al
      seed[k] = s
    }
    const o = i * 4
    index.set([o, o + 1, o + 2, o, o + 2, o + 3], i * 6)
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(position, 3))
  geo.setAttribute('aAcross', new THREE.BufferAttribute(across, 1))
  geo.setAttribute('aAlong', new THREE.BufferAttribute(along, 1))
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
  geo.setIndex(new THREE.BufferAttribute(index, 1))

  const uniforms = {
    uTime: { value: 0 },
    uIntensity: { value: 0 },
    uWarm: { value: new THREE.Color(0xfff0c4) },
    uCold: { value: new THREE.Color(0x8effd2) },
    uAlien: { value: 0 },
  }

  const material = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    vertexShader: `
      attribute float aAcross;
      attribute float aAlong;
      attribute float aSeed;
      varying float vAcross;
      varying float vAlong;
      varying float vSeed;
      void main() {
        vAcross = aAcross;
        vAlong = aAlong;
        vSeed = aSeed;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uIntensity;
      uniform vec3 uWarm;
      uniform vec3 uCold;
      uniform float uAlien;
      varying float vAcross;
      varying float vAlong;
      varying float vSeed;
      void main() {
        if ( uIntensity <= 0.001 ) discard;
        float core = pow( max( 0.0, 1.0 - abs( vAcross ) ), 2.4 );
        // Bright at the root, gone by the tip, with a short ramp-in so a beam
        // never starts on a hard edge.
        float fade = pow( max( 0.0, 1.0 - vAlong ), 1.5 ) * smoothstep( 0.0, 0.09, vAlong );
        float flick = 0.72 + 0.28 * sin( uTime * ( 1.1 + vSeed * 2.4 ) + vSeed * 41.0 );
        float a = core * fade * flick * uIntensity * 0.9;
        if ( a < 0.003 ) discard;
        vec3 col = mix( uWarm, uCold, uAlien );
        gl_FragColor = vec4( col * a, a );
      }
    `,
  })

  const mesh = new THREE.Mesh(geo, material)
  mesh.renderOrder = 1
  mesh.frustumCulled = false
  return { mesh, uniforms }
}

// --- the halo the beams come out of ---------------------------------------
function createHalo() {
  const uniforms = {
    uIntensity: { value: 0 },
    uWarm: { value: new THREE.Color(0xffdc9c) },
    uCold: { value: new THREE.Color(0x76ffcd) },
    uAlien: { value: 0 },
  }
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
      `,
      fragmentShader: `
        uniform float uIntensity;
        uniform vec3 uWarm;
        uniform vec3 uCold;
        uniform float uAlien;
        varying vec2 vUv;
        void main() {
          if ( uIntensity <= 0.001 ) discard;
          float d = length( vUv - 0.5 ) * 2.0;
          if ( d > 1.0 ) discard;
          // Two lobes: a tight hot core and a wide atmospheric bloom. This is
          // the cheap stand-in for a post-processing bloom pass, which we skip
          // so the very first frame is never late.
          float a = pow( max( 0.0, 1.0 - d ), 3.2 ) * 0.85 + pow( max( 0.0, 1.0 - d ), 1.15 ) * 0.28;
          a *= uIntensity;
          gl_FragColor = vec4( mix( uWarm, uCold, uAlien ) * a, a );
        }
      `,
    })
  )
  mesh.renderOrder = 0
  return { mesh, uniforms }
}

// --- sun petals ------------------------------------------------------------
function petalShape(length, width) {
  const s = new THREE.Shape()
  s.moveTo(0, 0)
  s.bezierCurveTo(width, length * 0.16, width * 0.52, length * 0.74, 0, length)
  s.bezierCurveTo(-width * 0.52, length * 0.74, -width, length * 0.16, 0, 0)
  return s
}

function createPetals(envMap) {
  const group = new THREE.Group()
  // Two tones so the corona has depth: hot, near-white gold on the long rays,
  // a deeper amber on the short ones behind them.
  const materials = [
    castMetal({ color: 0xffc85a, roughness: 0.2, envMap, envMapIntensity: 2.3, side: THREE.DoubleSide }, { grain: 0.14, grainScale: 3.0 }),
    castMetal({ color: 0xd98a2b, roughness: 0.3, envMap, envMapIntensity: 1.7, side: THREE.DoubleSide }, { grain: 0.2, grainScale: 4.0 }),
  ]

  const rings = [
    { n: 18, length: 2.45, width: 0.28, z: -0.62, offset: 0, delay: 0.0, tilt: 0.1, mat: 0 },
    { n: 18, length: 1.45, width: 0.44, z: -0.48, offset: 0.5, delay: 0.18, tilt: -0.16, mat: 1 },
  ]

  const rand = rng(0x7f4a7c15)
  const petals = []
  for (const ring of rings) {
    const geo = new THREE.ExtrudeGeometry(petalShape(ring.length, ring.width), {
      depth: 0.075,
      bevelEnabled: true,
      bevelThickness: 0.028,
      bevelSize: 0.028,
      bevelSegments: 2,
      curveSegments: 10,
      steps: 1,
    })
    geo.computeVertexNormals()
    for (let i = 0; i < ring.n; i++) {
      const a = ((i + ring.offset) / ring.n) * Math.PI * 2
      const pivot = new THREE.Group()
      pivot.rotation.z = a
      pivot.position.z = ring.z
      const mesh = new THREE.Mesh(geo, materials[ring.mat])
      mesh.position.y = PETAL_BASE_R
      pivot.add(mesh)
      group.add(pivot)
      petals.push({
        pivot,
        mesh,
        delay: ring.delay + (i % 4) * 0.045,
        tilt: ring.tilt,
        base: a,
        // Uneven ray lengths: a perfectly regular corona reads as a gear.
        len: 0.72 + rand() * 0.55,
      })
    }
  }

  return { group, petals, materials }
}

export function createRadiance(envMap, { beamCount = 30, haloScale = 13 } = {}) {
  const group = new THREE.Group()
  const beams = createBeams({ count: beamCount })
  const halo = createHalo()
  const petals = createPetals(envMap)
  halo.mesh.scale.setScalar(haloScale)

  beams.mesh.position.z = -0.75
  halo.mesh.position.z = -1.1
  group.add(halo.mesh, beams.mesh, petals.group)

  const warmEmissive = new THREE.Color(0x000000)

  return {
    group,

    update(t, { intensity, petalAmount, alien }) {
      beams.uniforms.uTime.value = t
      beams.uniforms.uIntensity.value = intensity
      beams.uniforms.uAlien.value = alien
      halo.uniforms.uIntensity.value = intensity * 0.85
      halo.uniforms.uAlien.value = alien
      beams.mesh.rotation.z = t * 0.035

      // Petals unfurl on a stagger, each rotating a little as it clears the
      // casting so the corona has some torque to it.
      for (const p of petals.petals) {
        const k = THREE.MathUtils.clamp((petalAmount - p.delay) / (1 - p.delay), 0, 1)
        // A soft overshoot: petals arrive, spring a hair past, and settle.
        const e = k * k * (3 - 2 * k)
        const spring = e + Math.sin(e * Math.PI) * 0.075
        const s = Math.max(0.0001, spring)
        p.mesh.scale.set(s, s * p.len, s)
        p.pivot.rotation.z = p.base + (1 - e) * p.tilt * 2.4 + Math.sin(t * 0.4 + p.base) * 0.012 * e
        p.pivot.visible = k > 0.001
      }
      // Only the faintest self-glow: the petals should look like lit metal,
      // not like plastic with a lamp inside.
      const glow = Math.max(0, petalAmount) * intensity
      warmEmissive.setRGB(0.16 * glow, 0.09 * glow, 0.02 * glow)
      for (const m of petals.materials) m.emissive.copy(warmEmissive)
      petals.group.visible = petalAmount > 0.001
    },
  }
}
