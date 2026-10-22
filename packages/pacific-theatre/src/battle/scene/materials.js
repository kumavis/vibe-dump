// The two unit materials (ENGINEERING.md §§6–7): one for every ship (hulls,
// parts and turrets, instanced per kit) and one for every aircraft (instanced
// per kit, its marking from the one insignia atlas by a per-instance
// rectangle). Both are lit by the shared lighting chunk (the sun, the sky,
// the moon and the eight point lights of star shells, searchlights and gun
// flashes), write logarithmic depth (the four chunks), discard what is below
// the sea (a sinking ship goes under without depth games) and keep a minimum
// size on screen (aircraft 3 px of span, ships a few pixels of length, so a
// strike reads at 20 km and a column at 30). Instance matrices are written
// camera-relative by the renderers (units.js); these shaders do not care.

import * as THREE from 'three'
import { constants, noise, lighting } from '../../render/shaders/common.glsl.js'
import { logDepthParsVertex, logDepthVertex, logDepthParsFragment, logDepthFragment } from '../../render/shaders/logdepth.glsl.js'

const unitVertex = /* glsl */ `
${logDepthParsVertex}
in float aMat;
#ifdef AIRCRAFT
in vec4 aInsignia;
out vec4 vInsignia;
#endif
#ifdef USE_INSTANCING
in vec4 aState;              // x: fire (0..1), y: alive (1 alive, 2 sinking/falling), z: listing roll already in the matrix, w: spare
#endif
uniform float uMinPx;        // the smallest the unit may be drawn, pixels across its length or span
uniform float uSize;         // its length or span, metres
uniform float uPxPerRad;     // the viewport's height in pixels over its field of view in radians
out vec3 vWorld;
out vec3 vNormal;
out vec3 vColor;
out float vMat;
out vec2 vUv;
out float vFire;
void main() {
  mat4 im = mat4(1.0);
  vFire = 0.0;
  #ifdef USE_INSTANCING
  im = instanceMatrix;
  vFire = aState.x;
  #endif
  mat4 mm = modelMatrix * im;
  vec3 origin = (mm * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
  float dist = max(1.0, distance(cameraPosition, origin));
  float px = uSize / dist * uPxPerRad;
  float k = max(1.0, uMinPx / max(px, 1e-4));
  vec4 wp = mm * vec4(position * k, 1.0);
  vWorld = wp.xyz;
  vNormal = normalize(mat3(mm) * normal);
  vColor = color;
  vMat = aMat;
  vUv = uv;
  #ifdef AIRCRAFT
  vInsignia = aInsignia;
  #endif
  gl_Position = projectionMatrix * viewMatrix * wp;
  ${logDepthVertex}
}
`

const unitFragment = /* glsl */ `
${constants}
${noise}
${lighting}
${logDepthParsFragment}
uniform float uSeaY;         // world y of the sea surface (0 in a box)
#ifdef AIRCRAFT
uniform sampler2D uInsignia;
in vec4 vInsignia;
#endif
in vec3 vWorld;
in vec3 vNormal;
in vec3 vColor;
in float vMat;
in vec2 vUv;
in float vFire;
void main() {
  ${logDepthFragment}
  if (vWorld.y < uSeaY - 0.05) discard;
  vec3 n = normalize(vNormal);
  if (!gl_FrontFacing) n = -n;
  vec3 a = vColor;
  int m = int(vMat + 0.5);
  if (m == 1) {
    // planking: fine courses along the length, faded once finer than a pixel
    float px = length(fwidth(vWorld.xz));
    float f = 1.0 - smoothstep(0.1, 0.4, px);
    a *= 1.0 - f * 0.08 * step(0.5, fract(vWorld.x * 3.0 + hash12(floor(vWorld.xz * vec2(3.0, 0.08))) * 0.7));
  } else if (m == 2) {
    // glass: dark, with the sky in it
    vec3 V = normalize(cameraPosition - vWorld);
    vec3 R = reflect(-V, n);
    a = mix(a * 0.6, skyMap(R) * 0.6, 0.45);
  } else if (m == 3) {
    #ifdef AIRCRAFT
    vec4 t = texture(uInsignia, mix(vInsignia.xy, vInsignia.zw, vUv));
    if (t.a < 0.5) discard;
    a = t.rgb;
    #else
    discard;
    #endif
  } else if (m == 4) {
    // a propeller's blur: a thin, dithered disc
    if (hash12(gl_FragCoord.xy) > 0.28) discard;
  }
  vec3 col = shade(a, n, vWorld, 1.0, 1.0);
  // a burning unit glows where it burns, flickering
  if (vFire > 0.01) {
    float fl = 0.6 + 0.4 * vnoise(vWorld.xz * 0.3 + uTime * 3.0);
    col += vec3(1.0, 0.42, 0.12) * vFire * fl * 0.35 * smoothstep(0.0, 3.0, vWorld.y);
  }
  gl_FragColor = vec4(col, 1.0);
}
`

function make(light, { aircraft = false, minPx, size = 100, atlas = null } = {}) {
  const uniforms = {
    ...light,
    uMinPx: { value: minPx },
    uSize: { value: size },
    uPxPerRad: { value: 800 / ((50 * Math.PI) / 180) },
    uSeaY: { value: 0 },
  }
  if (aircraft) uniforms.uInsignia = { value: atlas?.texture ?? null }
  return new THREE.ShaderMaterial({
    name: aircraft ? 'aircraft' : 'ship',
    vertexShader: unitVertex,
    fragmentShader: unitFragment,
    uniforms,
    defines: aircraft ? { AIRCRAFT: 1 } : {},
    vertexColors: true,
    side: THREE.DoubleSide,
  })
}

/** The ship material (one per kit mesh, sharing the light bag by reference): uSize is the kit's length. */
export function shipMaterial(light, size) {
  return make(light, { minPx: 5, size })
}

/** The aircraft material: uSize is the kit's span; atlas: insigniaAtlas(). */
export function aircraftMaterial(light, size, atlas) {
  return make(light, { aircraft: true, minPx: 3, size, atlas })
}

/** Keep every unit material's pixels-per-radian in step with the camera and the canvas. */
export function setPixelScale(materials, camera, heightPx) {
  const v = heightPx / ((camera.fov * Math.PI) / 180)
  for (const m of materials) m.uniforms.uPxPerRad.value = v
}
