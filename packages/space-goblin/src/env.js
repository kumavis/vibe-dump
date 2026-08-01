import * as THREE from 'three'

// ---------------------------------------------------------------------------
// Procedural environment map
//
// A MeshStandardMaterial with metalness near 1 and no environment to reflect
// renders *black* — physically correct and visually useless. Rather than fake
// it by dialling metalness down (which makes every scavenged plate look like
// painted plastic), this builds a small equirectangular sky in a canvas and
// runs it through PMREM. One 512x256 image, no network, and every piece of
// metal on the goblin suddenly has a sky in it.
// ---------------------------------------------------------------------------

const lerp = (a, b, t) => a + (b - a) * t
const sat = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)

/** Sample a vertical gradient of [stop, [r,g,b]] pairs. */
function gradient(stops, t) {
  if (t <= stops[0][0]) return stops[0][1]
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i][0]) {
      const [t0, c0] = stops[i - 1]
      const [t1, c1] = stops[i]
      const k = (t - t0) / (t1 - t0 || 1)
      return [lerp(c0[0], c1[0], k), lerp(c0[1], c1[1], k), lerp(c0[2], c1[2], k)]
    }
  }
  return stops[stops.length - 1][1]
}

// v = 0 at the zenith, 1 at nadir — matches equirect layout.
const SKY = [
  [0.0, [10, 8, 24]],
  [0.34, [26, 16, 46]],
  [0.47, [74, 34, 58]],
  [0.5, [126, 62, 62]],
  [0.56, [96, 52, 44]],
  [0.72, [48, 28, 26]],
  [1.0, [26, 16, 14]],
]

/** A soft round light source painted into the sky. */
function blob(u, v, cu, cv, radius, falloff = 2) {
  let du = Math.abs(u - cu)
  if (du > 0.5) du = 1 - du // the panorama wraps in u
  const dv = v - cv
  const d = Math.sqrt((du / radius) ** 2 + (dv / radius) ** 2)
  return Math.exp(-(d ** falloff))
}

/**
 * Build the scene environment. Returns the PMREM texture; assign it to
 * `scene.environment` (and dispose it with the app).
 *
 * @param {THREE.WebGLRenderer} renderer
 */
export function createEnvironment(renderer) {
  const W = 512
  const H = 256
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  const img = ctx.createImageData(W, H)
  const data = img.data

  for (let y = 0; y < H; y++) {
    const v = y / (H - 1)
    const base = gradient(SKY, v)
    for (let x = 0; x < W; x++) {
      const u = x / (W - 1)
      let r = base[0]
      let g = base[1]
      let b = base[2]

      // The gas giant: a big warm amber source low on one side. This is what
      // the goblin's plates actually reflect, so it needs real intensity.
      const planet = blob(u, v, 0.18, 0.48, 0.16, 2.2)
      r += planet * 210
      g += planet * 128
      b += planet * 54

      // A small hard key opposite it, for crisp specular hits on the blade.
      const key = blob(u, v, 0.66, 0.3, 0.045, 2)
      r += key * 250
      g += key * 232
      b += key * 205

      // Cold zenith bounce so the top faces don't go dead.
      const cool = blob(u, v, 0.85, 0.12, 0.3, 1.6)
      r += cool * 26
      g += cool * 40
      b += cool * 62

      const i = (y * W + x) * 4
      data[i] = sat(r / 255) * 255
      data[i + 1] = sat(g / 255) * 255
      data[i + 2] = sat(b / 255) * 255
      data[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)

  const equirect = new THREE.CanvasTexture(canvas)
  equirect.mapping = THREE.EquirectangularReflectionMapping
  equirect.colorSpace = THREE.SRGBColorSpace

  const pmrem = new THREE.PMREMGenerator(renderer)
  pmrem.compileEquirectangularShader()
  const target = pmrem.fromEquirectangular(equirect)
  equirect.dispose()
  pmrem.dispose()
  return target.texture
}
