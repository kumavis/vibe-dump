import * as THREE from 'three'
import {
  makeGoblinSkin,
  makeLeather,
  makeCanvasCloth,
  makeMetal,
  makeEmissivePanel,
} from './textures.js'

// ---------------------------------------------------------------------------
// The material library
//
// Every geometry part in body.js / gear.js / weapons.js tags itself with a
// material *key*; this is where those keys become actual materials. The texture
// sets are memoised and therefore shared, so any material that needs its own
// repeat clones the textures first (cheap — the clone shares the image data).
// ---------------------------------------------------------------------------

/** Clone a texture set and apply a repeat + anisotropy. */
function tuned(set, { repeat = [1, 1], aniso = 8, rotation = 0 } = {}) {
  const out = {}
  for (const [k, tex] of Object.entries(set || {})) {
    if (!tex) continue
    const t = tex.clone()
    t.needsUpdate = true
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(repeat[0], repeat[1])
    t.rotation = rotation
    t.anisotropy = aniso
    out[k] = t
  }
  return out
}

/**
 * @param {object} o
 * @param {THREE.WebGLRenderer} [o.renderer]  for max anisotropy
 * @param {number} [o.quality]                1 = full-size textures
 * @returns {Record<string, THREE.Material>}
 */
export function createMaterials({ renderer, quality = 1 } = {}) {
  const aniso = renderer ? Math.min(8, renderer.capabilities.getMaxAnisotropy()) : 4
  // 512 is the sweet spot: a 1024 skin set costs ~3x the build time and is
  // barely distinguishable at the repeats we use.
  const big = quality >= 1 ? 1024 : 512
  const mid = 512

  const skinTex = tuned(makeGoblinSkin({ size: big, seed: 7 }), { repeat: [3, 2], aniso })
  const leatherTex = tuned(makeLeather({ size: mid, color: '#4a3324', wear: 0.55 }), { repeat: [2, 3], aniso })
  const strapTex = tuned(makeLeather({ size: mid, seed: 41, color: '#3b2a1e', wear: 0.75 }), { repeat: [1, 5], aniso })
  const clothTex = tuned(makeCanvasCloth({ size: mid, color: '#6d5136', stripe: '#2f5d5a' }), { repeat: [3, 3], aniso })
  const patchTex = tuned(makeCanvasCloth({ size: mid, seed: 29, color: '#5a4a52' }), { repeat: [2, 2], aniso })
  // Bindings read as bandage, not barber's pole: keep the weave repeat low or
  // the sweep's stretched V turns it into hoops.
  const wrapTex = tuned(makeCanvasCloth({ size: mid, seed: 31, color: '#9c8f74' }), { repeat: [1, 2], aniso })
  const capeTex = tuned(makeCanvasCloth({ size: mid, seed: 37, color: '#7d2f34', stripe: '#c8a35a' }), {
    repeat: [3, 3],
    aniso,
  })
  const kiltTex = tuned(makeLeather({ size: mid, seed: 43, color: '#54402c', wear: 0.65 }), { repeat: [2, 2], aniso })
  // Low rust + low scratch: at repeat 2 the brushed streaks and rust blooms
  // stack into orange/blue banding that reads as plastic, not steel.
  const metalTex = tuned(makeMetal({ size: mid, base: '#79808a', rust: 0.16, scratch: 0.38 }), { repeat: [1, 1], aniso })
  const hazardTex = tuned(makeMetal({ size: mid, seed: 53, base: '#6a7078', rust: 0.4, hazard: true }), {
    repeat: [1, 1],
    aniso,
  })
  const darkTex = tuned(makeMetal({ size: mid, seed: 59, base: '#3f444c', rust: 0.28, scratch: 0.3 }), {
    repeat: [1, 1],
    aniso,
  })
  const brassTex = tuned(makeMetal({ size: mid, seed: 61, base: '#b08a4a', rust: 0.14, scratch: 0.5 }), {
    repeat: [1, 1],
    aniso,
  })
  // Bone/horn takes the leather *normal* only — its albedo (cell plates and
  // stitch rows) turns every tusk into a striped traffic cone.
  const boneTex = tuned(makeLeather({ size: mid, seed: 67, color: '#cbbf9e', wear: 0.85 }), { repeat: [1, 1], aniso })
  const glowTex = tuned(makeEmissivePanel({ size: mid, color: '#48e8ff', density: 1.2 }), { repeat: [1, 1], aniso })
  const hoseTex = tuned(makeLeather({ size: mid, seed: 71, color: '#22242a', wear: 0.3 }), { repeat: [1, 8], aniso })

  // `envMapIntensity` is the r160 way to scale image-based lighting — there is
  // no scene-level control until r163. Dielectrics want only a whisper of it;
  // the metals need it or they render black.
  const std = (o) =>
    new THREE.MeshStandardMaterial({ roughness: 1, metalness: 0, envMapIntensity: 0.35, ...o })

  const materials = {
    // ---- flesh ----
    skin: std({
      ...skinTex,
      color: '#a9c088',
      emissive: '#48e8ff',
      emissiveIntensity: 0.9,
      roughness: 1,
      metalness: 0,
    }),
    eye: std({ color: '#0b0d10', roughness: 0.18, metalness: 0.1 }),
    iris: std({ color: '#0a0a08', emissive: '#ffb03d', emissiveIntensity: 2.6, roughness: 0.25 }),
    bone: std({
      normalMap: boneTex.normalMap,
      roughnessMap: boneTex.roughnessMap,
      color: '#e2d8bb',
      roughness: 0.62,
      metalness: 0,
    }),

    // ---- cloth ----
    cloth: std({ ...clothTex, color: '#a08b6a', roughness: 1 }),
    patch: std({ ...patchTex, color: '#8f7d84', roughness: 1 }),
    wrap: std({ ...wrapTex, color: '#c9bda1', roughness: 1 }),
    cape: std({ ...capeTex, color: '#b8666a', roughness: 1, side: THREE.DoubleSide }),
    kilt: std({ ...kiltTex, color: '#9a7a56', roughness: 1, side: THREE.DoubleSide }),

    // ---- leather / rubber ----
    leather: std({ ...leatherTex, color: '#8a6a4c', roughness: 1 }),
    strap: std({ ...strapTex, color: '#6f5540', roughness: 1 }),
    hose: std({ ...hoseTex, color: '#4a4d55', roughness: 0.85 }),

    // ---- metal ----
    // Plain brushed steel is the default; the hazard stripes are an accent for
    // exactly one piece (the breastplate), or they read as circus tent.
    metal: std({ ...metalTex, color: '#c2c9d1', roughness: 1, metalness: 0.92, envMapIntensity: 1.5 }),
    hazard: std({ ...hazardTex, color: '#c4cad1', roughness: 1, metalness: 0.85, envMapIntensity: 1.3 }),
    metalDark: std({ ...darkTex, color: '#9aa0a9', roughness: 1, metalness: 0.9, envMapIntensity: 1.35 }),
    brass: std({ ...brassTex, color: '#e0b878', roughness: 1, metalness: 0.94, envMapIntensity: 1.5 }),

    // ---- glow / glass ----
    emissive: std({
      ...glowTex,
      color: '#0a1418',
      emissive: '#48e8ff',
      emissiveIntensity: 1.6,
      roughness: 0.5,
      metalness: 0.2,
    }),
    glass: new THREE.MeshStandardMaterial({
      color: '#12303a',
      emissive: '#2b6f7d',
      emissiveIntensity: 0.55,
      roughness: 0.08,
      metalness: 0.85,
      envMapIntensity: 2.2,
      transparent: true,
      opacity: 0.62,
    }),
  }

  materials.plate = materials.metal
  materials.blade = materials.metal

  return materials
}

/** Free every GPU resource a material library holds. */
export function disposeMaterials(materials) {
  for (const mat of Object.values(materials || {})) {
    for (const key of ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'emissiveMap']) {
      if (mat[key]) mat[key].dispose()
    }
    mat.dispose()
  }
}
