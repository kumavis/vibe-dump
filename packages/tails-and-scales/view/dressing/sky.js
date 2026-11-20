// The sky over the battlefield (DESIGN's "Battlefield dressing", S1): a
// dome that travels with the camera, its colour from the zenith down to a
// haze at the horizon (the scene's fog, the same colour, so the ground runs
// into it seamlessly), the sun's disc and glow, and a few soft clouds; and
// the times of day a board is fought at (place.js's dayOf), each a sun and
// a sky the stage lights the table with (view/stage.js daylight).
//
// One draw call: a sphere drawn first, writing no depth, under no fog.
import * as THREE from 'three'

// Each time of day: the sun (its bearing and height, radians; its colour
// and strength), the sky light (the hemisphere's sky and ground colours and
// strength), the fill, and the dome's zenith, horizon and the haze below it.
// 'noon' lights the table exactly as it always was (the stage's own
// numbers); none is darker than late golden hour.
export const SKIES = Object.freeze({
  morning: { bearing: -1.6, height: 0.7, sun: '#ffe8c8', sunI: 2.25, sky: '#d9e4f2', skyI: 0.85, ground: '#3e3322', fill: '#a8bce8', fillI: 0.35, zenith: '#4f86c8', horizon: '#b8cad8', glow: '#ffd9a0' },
  noon: { bearing: -0.675, height: 0.93, sun: '#fff0d6', sunI: 2.3, sky: '#d6e6ff', skyI: 0.85, ground: '#3b2a1a', fill: '#9fb8ff', fillI: 0.35, zenith: '#3f78c0', horizon: '#aec6dc', glow: '#fff1d0' },
  afternoon: { bearing: 0.35, height: 0.64, sun: '#ffd6a0', sunI: 2.25, sky: '#e6dccb', skyI: 0.82, ground: '#43321e', fill: '#a9b6e0', fillI: 0.33, zenith: '#5079b4', horizon: '#d2c2a4', glow: '#ffc27a' },
  smoke: { bearing: -0.675, height: 0.7, sun: '#ffc58f', sunI: 2.15, sky: '#d9c0a6', skyI: 0.8, ground: '#3b2a1a', fill: '#9fb0d8', fillI: 0.33, zenith: '#6a7486', horizon: '#ae967c', glow: '#ff9a50' },
})
// where the sun stands for a sky, as far from the table as it always was
export function sunAt(sky, dist = Math.hypot(16, 34, 20)) {
  const c = Math.cos(sky.height)
  return new THREE.Vector3(Math.sin(sky.bearing) * c * dist, Math.sin(sky.height) * dist, Math.cos(sky.bearing) * c * dist)
}

const vert = `
varying vec3 vDir;
void main() {
  vDir = normalize(position);
  vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_Position = p.xyww;
}`
const frag = `
uniform vec3 zenith;
uniform vec3 horizon;
uniform vec3 glow;
uniform vec3 sunDir;
uniform float seed;
varying vec3 vDir;
float h21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7)) + seed) * 43758.5453); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), u.x), mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), u.x), u.y);
}
void main() {
  vec3 d = normalize(vDir);
  float y = d.y;
  vec3 c = mix(horizon, zenith, pow(clamp(y, 0.0, 1.0), 0.35));
  float s = max(dot(d, sunDir), 0.0);
  c += glow * (pow(s, 7.0) * 0.28 + pow(s, 60.0) * 0.5);
  c = mix(c, vec3(1.0, 0.98, 0.92) * 1.6, smoothstep(0.9993, 0.9997, s));
  if (y > 0.02) {
    vec2 q = d.xz / (y + 0.12) * 1.6;
    float n = vnoise(q) * 0.62 + vnoise(q * 2.3 + 3.1) * 0.38;
    float cloud = smoothstep(0.56, 0.86, n) * smoothstep(0.02, 0.25, y) * 0.55;
    c = mix(c, mix(horizon, vec3(1.0), 0.6) + glow * pow(s, 4.0) * 0.25, cloud);
  }
  gl_FragColor = vec4(c, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`

export class Sky {
  constructor(scene) {
    this.uniforms = {
      zenith: { value: new THREE.Color() }, horizon: { value: new THREE.Color() }, glow: { value: new THREE.Color() },
      sunDir: { value: new THREE.Vector3(0, 1, 0) }, seed: { value: 0 },
    }
    const mat = new THREE.ShaderMaterial({ uniforms: this.uniforms, vertexShader: vert, fragmentShader: frag, side: THREE.BackSide, depthWrite: false, fog: false })
    const dome = (this.mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), mat))
    dome.frustumCulled = false
    dome.renderOrder = -10
    dome.userData.dressing = true
    // (the dome on the camera, wherever it is: drawn at the far plane, by
    // gl_Position's xyww, so its size is any)
    dome.onBeforeRender = (r, s, camera) => {
      dome.position.copy(camera.position)
      dome.scale.setScalar(camera.far * 0.5)
      dome.updateMatrixWorld()
    }
    scene.add(dome)
  }

  // the dome's colours for a time of day, and its clouds' seed
  set(sky, seed) {
    const u = this.uniforms
    u.zenith.value.set(sky.zenith)
    u.horizon.value.set(sky.horizon)
    u.glow.value.set(sky.glow)
    u.sunDir.value.copy(sunAt(sky)).normalize()
    u.seed.value = (seed % 1000) / 10
  }

  dispose() {
    this.mesh.removeFromParent()
    this.mesh.geometry.dispose()
    this.mesh.material.dispose()
  }
}
