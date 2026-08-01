import * as THREE from 'three'

// ---------------------------------------------------------------------------
// The cloud
//
// One draw call: a merged soup of camera-facing quads, each a soft lump in the
// fragment shader. Lighting is faked from the puff's height inside the cluster
// (warm ivory on top where the eye's light falls, deep indigo underneath) which
// is both cheaper and more controllable than actually lighting a cloud.
//
// The quads are sorted back-to-front once at build time. The camera only ever
// parallaxes a few degrees, so that ordering never goes stale, and we get
// correct alpha blending out of a single mesh.
// ---------------------------------------------------------------------------

function rng(seed) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

// Sum of two uniforms — a cheap bell curve, so puffs bunch toward lobe centers.
function bell(rand) {
  return rand() + rand() - 1
}

export function createCloud({ puffCount = 150 } = {}) {
  const rand = rng(0x51ed270b)

  // Lobes: a wide flat-bottomed raft with a few risen mounds on top. The mound
  // under the triangle is deliberately the tallest, so the artifact looks like
  // it is resting on something rather than hovering over it.
  const lobes = [
    // Crown: small puffs, because this is the edge that reads against the sky
    // and it needs the most silhouette detail.
    { x: 0.0, y: 0.7, z: 0.05, rx: 0.75, ry: 0.3, rz: 0.45, n: 0.13, s: [0.36, 0.58] },
    { x: -1.05, y: 0.48, z: 0.2, rx: 0.75, ry: 0.28, rz: 0.45, n: 0.11, s: [0.4, 0.66] },
    { x: 1.1, y: 0.45, z: 0.15, rx: 0.75, ry: 0.28, rz: 0.45, n: 0.11, s: [0.4, 0.66] },
    // Shoulders.
    { x: -2.15, y: 0.12, z: -0.1, rx: 0.95, ry: 0.3, rz: 0.5, n: 0.12, s: [0.55, 0.9] },
    { x: 2.2, y: 0.08, z: -0.05, rx: 0.95, ry: 0.3, rz: 0.5, n: 0.12, s: [0.55, 0.9] },
    // Body: wide, flat-based, and pushed FORWARD, so a handful of puffs pass in
    // front of the triangle's bottom bar. That overlap is what makes the emblem
    // sit in the cloud rather than in front of it.
    { x: -0.7, y: -0.25, z: 0.7, rx: 1.7, ry: 0.3, rz: 0.55, n: 0.13, s: [0.8, 1.3] },
    { x: 0.9, y: -0.28, z: 0.75, rx: 1.7, ry: 0.3, rz: 0.55, n: 0.13, s: [0.8, 1.3] },
    // Outriggers running off both edges of the frame.
    { x: -3.9, y: -0.15, z: -0.45, rx: 1.1, ry: 0.18, rz: 0.4, n: 0.075, s: [0.7, 1.15] },
    { x: 3.95, y: -0.18, z: -0.4, rx: 1.1, ry: 0.18, rz: 0.4, n: 0.075, s: [0.7, 1.15] },
  ]

  // Where the emblem presses into the crown. Puffs near this get shaded down,
  // which is the contact shadow that welds the two together.
  const CONTACT = { x: 0, y: 0.74, rx: 1.05, ry: 0.55, strength: 0.3 }

  const weightTotal = lobes.reduce((a, l) => a + l.n, 0)

  const puffs = []
  for (let i = 0; i < puffCount; i++) {
    let pick = rand() * weightTotal
    let lobe = lobes[0]
    for (const l of lobes) {
      pick -= l.n
      if (pick <= 0) { lobe = l; break }
    }
    const x = lobe.x + bell(rand) * lobe.rx
    let y = lobe.y + bell(rand) * lobe.ry
    const z = lobe.z + bell(rand) * lobe.rz
    // Cumulus have a flat base: fold anything that strays below it back up.
    if (y < -0.55) y = -0.55 + (-0.55 - y) * 0.25
    const [sMin, sMax] = lobe.s
    const size = sMin + rand() * (sMax - sMin)
    const dx = (x - CONTACT.x) / CONTACT.rx
    const dy = (y - CONTACT.y) / CONTACT.ry
    const shade = 1 - CONTACT.strength * Math.exp(-(dx * dx + dy * dy) * 1.6)
    puffs.push({ x, y, z, size, shade, seed: rand() })
  }

  // Far puffs first so alpha blending composites correctly from one buffer.
  puffs.sort((a, b) => a.z - b.z)

  const n = puffs.length
  const position = new Float32Array(n * 4 * 3)
  const corner = new Float32Array(n * 4 * 2)
  const size = new Float32Array(n * 4)
  const tint = new Float32Array(n * 4)
  const shade = new Float32Array(n * 4)
  const seed = new Float32Array(n * 4)
  const index = new Uint16Array(n * 6)

  // Vertical extent of the whole cluster, used to grade top-lit vs shadowed.
  let minY = Infinity
  let maxY = -Infinity
  for (const p of puffs) {
    minY = Math.min(minY, p.y)
    maxY = Math.max(maxY, p.y)
  }
  const span = Math.max(0.001, maxY - minY)

  const CORNERS = [[-1, -1], [1, -1], [1, 1], [-1, 1]]
  for (let i = 0; i < n; i++) {
    const p = puffs[i]
    const t = (p.y - minY) / span
    for (let v = 0; v < 4; v++) {
      const k = i * 4 + v
      position[k * 3 + 0] = p.x
      position[k * 3 + 1] = p.y
      position[k * 3 + 2] = p.z
      corner[k * 2 + 0] = CORNERS[v][0]
      corner[k * 2 + 1] = CORNERS[v][1]
      size[k] = p.size
      tint[k] = t
      shade[k] = p.shade
      seed[k] = p.seed
    }
    const o = i * 4
    index.set([o, o + 1, o + 2, o, o + 2, o + 3], i * 6)
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(position, 3))
  geo.setAttribute('aCorner', new THREE.BufferAttribute(corner, 2))
  geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1))
  geo.setAttribute('aTint', new THREE.BufferAttribute(tint, 1))
  geo.setAttribute('aShade', new THREE.BufferAttribute(shade, 1))
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
  geo.setIndex(new THREE.BufferAttribute(index, 1))
  // A generous manual bounding sphere — the vertex shader expands each quad in
  // view space, which frustum culling can't see.
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 7)

  const uniforms = {
    uTime: { value: 0 },
    uGlow: { value: 0 },
    uGlowColor: { value: new THREE.Color(0xffd58a) },
    uTop: { value: new THREE.Color(0xfff6e8) },
    uMid: { value: new THREE.Color(0xcbbbec) },
    uBottom: { value: new THREE.Color(0x5b4d92) },
  }

  const material = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    vertexShader: `
      attribute vec2 aCorner;
      attribute float aSize;
      attribute float aTint;
      attribute float aShade;
      attribute float aSeed;
      uniform float uTime;
      varying vec2 vCorner;
      varying float vTint;
      varying float vShade;
      varying float vSeed;
      void main() {
        vCorner = aCorner;
        vTint = aTint;
        vShade = aShade;
        vSeed = aSeed;
        vec3 p = position;
        // A slow, per-puff breathing drift so the cloud is never quite still.
        float ph = aSeed * 6.2831853;
        p.x += sin( uTime * 0.13 + ph ) * 0.075;
        p.y += sin( uTime * 0.17 + ph * 1.7 ) * 0.05;
        vec4 mv = modelViewMatrix * vec4( p, 1.0 );
        float s = aSize * ( 1.0 + 0.045 * sin( uTime * 0.31 + ph * 2.3 ) );
        mv.xy += aCorner * s;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      uniform vec3 uTop;
      uniform vec3 uMid;
      uniform vec3 uBottom;
      uniform vec3 uGlowColor;
      uniform float uGlow;
      varying vec2 vCorner;
      varying float vTint;
      varying float vShade;
      varying float vSeed;
      void main() {
        float d = length( vCorner );
        // A lumpy rim: three low harmonics keyed off the puff's seed, so no two
        // puffs share a silhouette and the cluster never reads as circles.
        float a0 = atan( vCorner.y, vCorner.x );
        float ph = vSeed * 6.2831853;
        float lump = 1.0
          + 0.13 * sin( a0 * 3.0 + ph )
          + 0.08 * sin( a0 * 5.0 - ph * 2.1 )
          + 0.05 * sin( a0 * 8.0 + ph * 3.7 );
        float alpha = 1.0 - smoothstep( 0.08, 1.0, d / lump );
        alpha = pow( alpha, 1.3 ) * 0.86;
        if ( alpha < 0.004 ) discard;

        // Colour by height in the cluster, then again by height within the
        // puff itself — that second gradient is what sells the volume.
        vec3 col = mix( uBottom, uMid, smoothstep( -0.05, 0.5, vTint ) );
        col = mix( col, uTop, smoothstep( 0.4, 0.95, vTint ) );
        float selfShade = mix( 0.5, 1.18, 0.5 + 0.5 * vCorner.y );
        col *= selfShade * vShade;

        // Light spilling down out of the eye when it radiates — weighted hard
        // toward the crown so the top of the cloud rims gold.
        col += uGlowColor * uGlow * pow( vTint, 1.6 ) * ( 0.35 + 0.65 * selfShade );

        gl_FragColor = vec4( col, alpha );
      }
    `,
  })

  const mesh = new THREE.Mesh(geo, material)
  mesh.renderOrder = 2
  mesh.frustumCulled = false

  return { mesh, uniforms }
}
