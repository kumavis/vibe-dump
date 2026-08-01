import * as THREE from 'three'

// ---------------------------------------------------------------------------
// Backdrop: an inside-out gradient dome plus a field of stars. Both are dirt
// cheap — the dome is one screen-filling pass with no texture reads, the stars
// are a single Points draw — because every millisecond here is a millisecond
// the cloud and the gold do not get.
// ---------------------------------------------------------------------------

function rng(seed) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

export function createSky() {
  const group = new THREE.Group()

  const uniforms = {
    uTime: { value: 0 },
    uGlow: { value: 0 },
    uAlien: { value: 0 },
    uTop: { value: new THREE.Color(0x080a26) },
    uHorizon: { value: new THREE.Color(0x2f2a6b) },
    uFloor: { value: new THREE.Color(0x090616) },
    uWarm: { value: new THREE.Color(0xffb060) },
    uCold: { value: new THREE.Color(0x2bffb0) },
  }

  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(90, 32, 24),
    new THREE.ShaderMaterial({
      uniforms,
      side: THREE.BackSide,
      depthWrite: false,
      vertexShader: `
        varying vec3 vDir;
        void main() {
          vDir = normalize( position );
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
      `,
      fragmentShader: `
        uniform vec3 uTop;
        uniform vec3 uHorizon;
        uniform vec3 uFloor;
        uniform vec3 uWarm;
        uniform vec3 uCold;
        uniform float uTime;
        uniform float uGlow;
        uniform float uAlien;
        varying vec3 vDir;
        void main() {
          float h = vDir.y;
          vec3 col = mix( uHorizon, uTop, smoothstep( 0.02, 0.75, h ) );
          col = mix( col, uFloor, smoothstep( 0.0, -0.42, h ) );
          // A dim warm band just under the horizon. Its only job is to give the
          // cloud's underside something to be darker than.
          col += vec3( 0.09, 0.05, 0.10 ) * exp( -pow( ( h + 0.08 ) * 7.0, 2.0 ) );
          // Slow bands of high cirrus, just enough to keep the sky from being
          // a flat ramp.
          float band = sin( h * 9.0 + vDir.x * 2.2 + uTime * 0.045 ) * 0.5 + 0.5;
          col += vec3( 0.035, 0.022, 0.06 ) * band * smoothstep( -0.1, 0.5, h );
          // The whole sky lifts a little when the eye radiates.
          float toEye = pow( max( 0.0, dot( normalize( vDir ), vec3( 0.0, 0.12, 1.0 ) ) ), 3.0 );
          col += mix( uWarm, uCold, uAlien ) * uGlow * ( 0.06 + 0.16 * toEye );
          gl_FragColor = vec4( col, 1.0 );
        }
      `,
    })
  )
  dome.renderOrder = -10
  group.add(dome)

  // --- stars ---------------------------------------------------------------
  const rand = rng(0x1d872b41)
  const COUNT = 460
  const pos = new Float32Array(COUNT * 3)
  const seed = new Float32Array(COUNT)
  const size = new Float32Array(COUNT)
  for (let i = 0; i < COUNT; i++) {
    // Weighted toward the upper hemisphere — there is a cloud in the way of
    // the lower one.
    const u = rand() * 2 - 1
    const y = Math.abs(u) * 0.85 + 0.02
    const r = Math.sqrt(Math.max(0, 1 - y * y))
    const a = rand() * Math.PI * 2
    const R = 52 + rand() * 20
    pos[i * 3 + 0] = Math.cos(a) * r * R
    pos[i * 3 + 1] = y * R
    pos[i * 3 + 2] = Math.sin(a) * r * R
    seed[i] = rand()
    size[i] = 1 + rand() * rand() * 4.5
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
  geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1))

  const starUniforms = { uTime: { value: 0 }, uPixelRatio: { value: 1 }, uFade: { value: 1 } }
  const stars = new THREE.Points(
    geo,
    new THREE.ShaderMaterial({
      uniforms: starUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        attribute float aSeed;
        attribute float aSize;
        uniform float uTime;
        uniform float uPixelRatio;
        varying float vTwinkle;
        varying float vSeed;
        void main() {
          vSeed = aSeed;
          vTwinkle = 0.55 + 0.45 * sin( uTime * ( 0.6 + aSeed * 2.2 ) + aSeed * 37.0 );
          vec4 mv = modelViewMatrix * vec4( position, 1.0 );
          gl_Position = projectionMatrix * mv;
          gl_PointSize = aSize * uPixelRatio * ( 0.75 + 0.5 * vTwinkle );
        }
      `,
      fragmentShader: `
        varying float vTwinkle;
        varying float vSeed;
        uniform float uFade;
        void main() {
          float d = length( gl_PointCoord - 0.5 ) * 2.0;
          float a = ( 1.0 - smoothstep( 0.15, 1.0, d ) ) * vTwinkle * uFade;
          if ( a < 0.01 ) discard;
          vec3 tint = mix( vec3( 0.78, 0.85, 1.0 ), vec3( 1.0, 0.9, 0.72 ), vSeed );
          gl_FragColor = vec4( tint * a, a );
        }
      `,
    })
  )
  stars.renderOrder = -9
  stars.frustumCulled = false
  group.add(stars)

  return {
    group,
    update(t, { glow, alien, pixelRatio }) {
      uniforms.uTime.value = t
      uniforms.uGlow.value = glow
      uniforms.uAlien.value = alien
      starUniforms.uTime.value = t
      starUniforms.uPixelRatio.value = pixelRatio
      // The stars wash out as the eye floods the sky.
      starUniforms.uFade.value = 1 - Math.min(0.75, glow * 0.9)
    },
  }
}
