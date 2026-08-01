import * as THREE from 'three'
import { makeIrisTexture, makeAlienIrisTexture } from './iris.js'
import { castMetal } from './metal.js'

// ---------------------------------------------------------------------------
// The eye of provenance: a thick, beveled, cast-gold triangle with an eye set
// into it.
//
// Two ideas hold the whole thing up.
//
// 1. The APERTURE is a hole. A recessed face plate fills the triangle's window
//    and carries an almond cut through it; the eyeball lives behind that plate,
//    deep enough that its spherical silhouette never shows. Everything you see
//    of the eye is shaped by the casting, which is what makes it read as an
//    engraved emblem rather than a marble sitting in a hoop.
//
// 2. The LIDS are exact hemispheres concentric with the eyeball — upper pole
//    +Y, lower pole -Y — so at zero rotation their rims meet on the equator and
//    together they close the sphere seamlessly. Opening is a single rotation
//    about X: the rim is a circle, so its front-view silhouette arcs away from
//    the pupil in precisely the curve a real eyelid makes. Nothing is rebuilt
//    to blink, and "shut" is exact rather than something to tune.
// ---------------------------------------------------------------------------

const EYE_R = 0.72 // eyeball radius
const LID_R = EYE_R * 1.025
const EYE_Z = -0.85 // how far the eyeball sits behind the face plate
const EYE_WIDEN = 1.18 // the eye is an almond, not a circle

const TRI_R = 2.25 // circumradius of the outer triangle
const TRI_W = 0.34 // border width — the window's circumradius is TRI_R - 2*TRI_W
const TRI_D = 0.36 // extrusion depth
const WIN_R = TRI_R - 2 * TRI_W

const APERTURE = { w: 0.72, top: 0.5, bottom: 0.38 }

// Trace a closed polygon with the corners rounded off — cast metal never has a
// mathematically sharp corner, and the round is what catches a highlight.
function roundedPolyPath(path, pts, r) {
  const n = pts.length
  for (let i = 0; i < n; i++) {
    const prev = pts[(i + n - 1) % n]
    const cur = pts[i]
    const next = pts[(i + 1) % n]
    const a = cur.clone().addScaledVector(prev.clone().sub(cur).normalize(), r)
    const b = cur.clone().addScaledVector(next.clone().sub(cur).normalize(), r)
    if (i === 0) path.moveTo(a.x, a.y)
    else path.lineTo(a.x, a.y)
    path.quadraticCurveTo(cur.x, cur.y, b.x, b.y)
  }
  path.closePath()
}

function trianglePoints(R) {
  const pts = []
  for (let i = 0; i < 3; i++) {
    const a = Math.PI / 2 + (i * Math.PI * 2) / 3
    pts.push(new THREE.Vector2(Math.cos(a) * R, Math.sin(a) * R))
  }
  return pts
}

// Two arcs meeting in a point at each corner. The upper curve is taller than
// the lower one, which is the difference between an eye and a lens.
function almondPath(path, { w, top, bottom }) {
  path.moveTo(-w, 0)
  path.quadraticCurveTo(0, top * 2, w, 0)
  path.quadraticCurveTo(0, -bottom * 2, -w, 0)
  path.closePath()
}

// A spherical cap whose pole faces +Z, with UVs re-projected flat down the Z
// axis so a round texture (the iris) lands on it undistorted.
function capGeometry(radius, halfAngle, seg = 48) {
  const geo = new THREE.SphereGeometry(radius, seg, Math.max(8, seg >> 1), 0, Math.PI * 2, 0, halfAngle)
  geo.rotateX(Math.PI / 2)
  const pos = geo.attributes.position
  const uv = geo.attributes.uv
  const rMax = radius * Math.sin(halfAngle)
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, 0.5 + pos.getX(i) / (2 * rMax), 0.5 + pos.getY(i) / (2 * rMax))
  }
  uv.needsUpdate = true
  return geo
}

export function createEye(envMap) {
  const group = new THREE.Group()

  // No emissive on any of the gold: a metal that glows on its own is the
  // fastest way to make it look like painted plastic. All of the brightness
  // comes out of the environment map.
  const goldMat = castMetal({ color: 0xffc44f, roughness: 0.17, envMap, envMapIntensity: 2.2 })

  // --- the triangle -------------------------------------------------------
  const shape = new THREE.Shape()
  roundedPolyPath(shape, trianglePoints(TRI_R), 0.26)
  const hole = new THREE.Path()
  roundedPolyPath(hole, trianglePoints(WIN_R), 0.2)
  shape.holes.push(hole)

  const frameGeo = new THREE.ExtrudeGeometry(shape, {
    depth: TRI_D,
    bevelEnabled: true,
    bevelThickness: 0.062,
    bevelSize: 0.058,
    bevelOffset: 0,
    bevelSegments: 3,
    curveSegments: 8,
    steps: 1,
  })
  frameGeo.translate(0, 0, -TRI_D / 2)
  frameGeo.computeVertexNormals()
  group.add(new THREE.Mesh(frameGeo, goldMat))

  // A slimmer triangle set behind the first: a stepped casting, and a dark
  // line for the silhouette to sit against.
  const backShape = new THREE.Shape()
  roundedPolyPath(backShape, trianglePoints(TRI_R + 0.11), 0.3)
  const backHole = new THREE.Path()
  roundedPolyPath(backHole, trianglePoints(WIN_R - 0.05), 0.2)
  backShape.holes.push(backHole)
  const backGeo = new THREE.ExtrudeGeometry(backShape, {
    depth: 0.14,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.03,
    bevelSegments: 2,
    curveSegments: 6,
    steps: 1,
  })
  backGeo.translate(0, 0, -TRI_D / 2 - 0.14)
  const backMat = castMetal(
    { color: 0xa2621a, roughness: 0.52, envMap, envMapIntensity: 1.2 },
    { grain: 0.22, grainScale: 4.0 }
  )
  group.add(new THREE.Mesh(backGeo, backMat))

  // --- face plate ---------------------------------------------------------
  // Fills the window, recessed behind the frame's front face, with the almond
  // cut through it. This is the piece that gives the eye its shape.
  const plateShape = new THREE.Shape()
  roundedPolyPath(plateShape, trianglePoints(WIN_R + 0.07), 0.2)
  const aperture = new THREE.Path()
  almondPath(aperture, APERTURE)
  plateShape.holes.push(aperture)

  const PLATE_D = 0.17
  const plateGeo = new THREE.ExtrudeGeometry(plateShape, {
    depth: PLATE_D,
    bevelEnabled: true,
    bevelThickness: 0.032,
    bevelSize: 0.03,
    bevelSegments: 2,
    curveSegments: 14,
    steps: 1,
  })
  // Front face of the plate lands at z = 0.02, i.e. recessed 0.16 behind the
  // frame, so the border reads as raised.
  plateGeo.translate(0, 0, 0.02 - PLATE_D - 0.032)
  plateGeo.computeVertexNormals()
  // The plate is the biggest flat field in the piece, so it gets the deepest
  // tone and the coarsest grain — otherwise it flattens the whole emblem.
  const plateMat = castMetal(
    { color: 0xd9932f, roughness: 0.31, envMap, envMapIntensity: 1.75, emissive: 0x000000 },
    { grain: 0.24, grainScale: 3.2, rings: 0.05, ringFreq: 46 }
  )
  group.add(new THREE.Mesh(plateGeo, plateMat))

  // Nothing should ever be visible past the eyeball through the aperture.
  const backstop = new THREE.Mesh(
    new THREE.CircleGeometry(1.2, 24),
    new THREE.MeshBasicMaterial({ color: 0x05030a })
  )
  backstop.position.z = EYE_Z - 0.35
  group.add(backstop)

  // --- eyeball ------------------------------------------------------------
  const eye = new THREE.Group()
  eye.scale.set(EYE_WIDEN, 1, 1)
  eye.position.z = EYE_Z
  group.add(eye)

  const scleraMat = new THREE.MeshStandardMaterial({
    color: 0xf4e9d6,
    roughness: 0.4,
    metalness: 0.0,
    envMap,
    envMapIntensity: 0.55,
    emissive: 0x120c06,
  })
  eye.add(new THREE.Mesh(new THREE.SphereGeometry(EYE_R, 44, 32), scleraMat))

  // The gaze pivot: iris, pupil and cornea ride it, so the eye can look around
  // without moving the lids.
  const gaze = new THREE.Group()
  eye.add(gaze)

  const irisTex = makeIrisTexture()
  const alienTex = makeAlienIrisTexture()
  const irisMix = { value: 0 }
  const irisMat = new THREE.MeshStandardMaterial({
    map: irisTex,
    roughness: 0.33,
    metalness: 0.0,
    envMap,
    envMapIntensity: 1.25,
    emissive: 0x000000,
  })
  irisMat.onBeforeCompile = (shader) => {
    shader.uniforms.uAlt = { value: alienTex }
    shader.uniforms.uMix = irisMix
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform sampler2D uAlt;\nuniform float uMix;')
      .replace(
        '#include <map_fragment>',
        `
        vec4 texelA = texture2D( map, vMapUv );
        vec4 texelB = texture2D( uAlt, vMapUv );
        diffuseColor *= mix( texelA, texelB, uMix );
        `
      )
  }
  gaze.add(new THREE.Mesh(capGeometry(EYE_R * 1.004, 0.6), irisMat))

  const pupilMat = new THREE.MeshStandardMaterial({
    color: 0x04030a,
    roughness: 0.16,
    metalness: 0.25,
    envMap,
    envMapIntensity: 0.7,
  })
  const pupil = new THREE.Mesh(capGeometry(EYE_R * 1.012, 0.24, 32), pupilMat)
  gaze.add(pupil)

  // Cornea: a hair larger, barely there, present only for the wet highlight it
  // lifts out of the environment map.
  const corneaMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.03,
    metalness: 0.0,
    envMap,
    envMapIntensity: 2.6,
    transparent: true,
    opacity: 0.17,
    depthWrite: false,
  })
  eye.add(new THREE.Mesh(capGeometry(EYE_R * 1.04, 1.0, 40), corneaMat))

  // --- lids ---------------------------------------------------------------
  const lidMat = castMetal(
    { color: 0xf9c860, roughness: 0.22, envMap, envMapIntensity: 2.0 },
    { grain: 0.12, grainScale: 9.0 }
  )
  const lashMat = new THREE.MeshStandardMaterial({
    color: 0x3d2408,
    metalness: 0.9,
    roughness: 0.45,
    envMap,
    envMapIntensity: 0.6,
  })

  const makeLid = (upper) => {
    const g = new THREE.Group()
    const geo = new THREE.SphereGeometry(
      LID_R, 44, 18, 0, Math.PI * 2,
      upper ? 0 : Math.PI / 2,
      Math.PI / 2
    )
    g.add(new THREE.Mesh(geo, lidMat))
    // The lash line lives on the lid's rim, so it travels with the lid instead
    // of hanging in the middle of an open eye.
    const lash = new THREE.Mesh(
      new THREE.TorusGeometry(LID_R * 0.998, upper ? 0.019 : 0.013, 6, 56),
      lashMat
    )
    lash.rotation.x = -Math.PI / 2
    g.add(lash)
    eye.add(g)
    return g
  }
  const lidUpper = makeLid(true)
  const lidLower = makeLid(false)

  // --- the light that leaks out of a closed eye ---------------------------
  const seamGlow = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uIntensity: { value: 0 },
        uColor: { value: new THREE.Color(0xffe6a8) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float uIntensity;
        uniform vec3 uColor;
        void main() {
          vec2 p = vUv - 0.5;
          // A long thin lens of light: tight in y, tapering to nothing in x.
          float y = exp( -p.y * p.y * 520.0 );
          float x = pow( max( 0.0, 1.0 - abs( p.x ) * 2.0 ), 1.5 );
          float a = y * x * uIntensity;
          if ( a <= 0.002 ) discard;
          gl_FragColor = vec4( uColor * a, a );
        }
      `,
    })
  )
  seamGlow.scale.set(APERTURE.w * 2.9, EYE_R * 1.5, 1)
  seamGlow.position.z = EYE_R * 1.07
  eye.add(seamGlow)

  return {
    group,
    eye,
    gaze,
    lidUpper,
    lidLower,
    pupil,
    materials: { plate: plateMat, sclera: scleraMat, iris: irisMat, lid: lidMat },
    irisMix,
    seam: seamGlow.material.uniforms,
    // Circumradius of the casting, so callers can size a hit target to it.
    radius: TRI_R,
  }
}
