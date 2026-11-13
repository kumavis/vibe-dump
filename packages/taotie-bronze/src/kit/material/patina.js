// PatinaMaterial — MeshStandardMaterial + a layered burial-corrosion model
// (research/02 §2–§6 is the authority for every colour and number here).
//
// A Shang bronze out of the ground is a stack, built from the metal outward
// (research/02 §3.1–3.2):
//   metal (Cu–Sn–Pb: F0 from the tin table, lead dulls it) → tarnish film →
//   [black inlay paste in the sunk lines, as made] → cuprite Cu₂O (liver /
//   oxblood, sub-metallic sheen, on the metal everywhere) → EITHER the noble
//   tin-oxide sheet (Type I: black / olive / grey, glossy, keeps the cast
//   surface) OR the carbonate crust (Type II: malachite, botryoidal and
//   banded, with azurite islands), per territory → soot low on the body →
//   chloride pustules punched through from the metal → burial earth and a
//   calcareous film packed into recesses and onto the side that lay down.
// Handling and cleaning then ERASE from the top down on convex arrises
// (§3.4.9): earth → crust → noble sheet → cuprite → burnished warm metal.
//
// Every mesh of a vessel shares ONE uniform set (`patina`), so a single slider
// re-ages the whole vessel. Per-material state is only the relief textures and
// two small hints (constant cavity, interior). Noise runs in VESSEL space, mm:
// positions go through a shared matrix the stage sets from the vessel root
// (`setPatinaVessel`), so territories run continuously across separately built
// parts and stay put if the vessel is turned.

import * as THREE from 'three'
import { noiseChunk } from './noise.glsl.js'

/**
 * Parameter metadata — the Patina drawer is generated from this. Grouped the
 * way a conservator would describe a surface. Defaults are a mid excavated look.
 * Physical units where research/02 §6 gives them (tin / lead as weight
 * fractions, thicknesses and scales in mm).
 */
export const PATINA_PARAMS = {
  age: { group: 'master', label: 'Time in the ground', min: 0, max: 1, step: 0.005, default: 1 },
  // Alloy
  tin: { group: 'Alloy', label: 'Tin (Sn wt)', min: 0, max: 0.3, step: 0.005, default: 0.14, hint: 'F0 from the §1.2 table: copper-pink → warm gold (0.12) → pale gold → speculum' },
  lead: { group: 'Alloy', label: 'Lead (Pb wt)', min: 0, max: 0.25, step: 0.005, default: 0.03, hint: 'greys and dulls the metal' },
  polish: { group: 'Alloy', label: 'Polish', min: 0, max: 1, step: 0.01, default: 0.6, hint: 'abraded fields / relief tops: roughness 0.40 → 0.12; recesses stay as-cast' },
  tarnish: { group: 'Alloy', label: 'Tarnish', min: 0, max: 1, step: 0.01, default: 0.5, hint: 'thin oxide film: gold → brown-gold' },
  // Corrosion
  cuprite: { group: 'Corrosion', label: 'Cuprite', min: 0, max: 1, step: 0.01, default: 0.7, hint: 'red-brown Cu₂O on the metal, shows where the crust is thin or worn' },
  tinOxide: { group: 'Corrosion', label: 'Noble patina', min: 0, max: 1, step: 0.01, default: 0.2, hint: 'Type I tin-oxide sheet territories (water patina)' },
  tinOxideTone: { group: 'Corrosion', label: 'Noble tone', min: 0, max: 2, step: 0.01, default: 1, hint: '0 black 黑漆古 · 1 olive · 2 grey 水银古' },
  malachite: { group: 'Corrosion', label: 'Malachite', min: 0, max: 1, step: 0.01, default: 0.6 },
  malachiteHue: { group: 'Corrosion', label: 'Malachite hue', min: 0, max: 1, step: 0.01, default: 0.45, hint: 'blue-green → yellow-green' },
  malachiteTone: { group: 'Corrosion', label: 'Malachite tone', min: 0, max: 1, step: 0.01, default: 0.5, hint: 'dark compact wet-looking → pale earthy crust' },
  malachiteScale: { group: 'Corrosion', label: 'Crust grain', min: 0.5, max: 8, step: 0.1, default: 2, unit: 'mm', hint: 'botryoidal dome size' },
  crust: { group: 'Corrosion', label: 'Crust thickness', min: 0, max: 4, step: 0.05, default: 1, unit: 'mm', hint: 'thick crust fills the line work' },
  azurite: { group: 'Corrosion', label: 'Azurite', min: 0, max: 0.5, step: 0.01, default: 0.05 },
  chloride: { group: 'Corrosion', label: 'Chloride', min: 0, max: 1, step: 0.01, default: 0.08, hint: 'bronze disease: pale powdery pustules over pits' },
  soot: { group: 'Corrosion', label: 'Soot', min: 0, max: 1, step: 0.01, default: 0, hint: 'tenorite/soot on the lower body and legs (fire)' },
  crevice: { group: 'Corrosion', label: 'Crevice bias', min: 0, max: 1, step: 0.01, default: 0.7, hint: 'how strongly crust prefers recesses' },
  patchScale: { group: 'Corrosion', label: 'Territory size', min: 20, max: 200, step: 1, default: 70, unit: 'mm' },
  mottleScale: { group: 'Corrosion', label: 'Mottle size', min: 3, max: 40, step: 0.5, default: 12, unit: 'mm' },
  // Surface
  earth: { group: 'Surface', label: 'Burial soil', min: 0, max: 1, step: 0.01, default: 0.3 },
  earthColor: { group: 'Surface', label: 'Soil colour', type: 'color', default: '#8f7048' },
  calcite: { group: 'Surface', label: 'Calcareous film', min: 0, max: 1, step: 0.01, default: 0.15, hint: 'whitish lime dusting that pales the crust' },
  burialSide: { group: 'Surface', label: 'Burial side', min: 0, max: 1, step: 0.01, default: 0.3, hint: 'one side lay in the soil' },
  recessDirt: { group: 'Surface', label: 'Recess dirt', min: 0, max: 1, step: 0.01, default: 0.3 },
  wax: { group: 'Surface', label: 'Museum wax', min: 0, max: 1, step: 0.01, default: 0 },
  inlay: { group: 'Surface', label: 'Black inlay', min: 0, max: 1, step: 0.01, default: 0, hint: 'paste in the sunk lines (as made)' },
  wear: { group: 'Surface', label: 'Wear', min: 0, max: 1, step: 0.01, default: 0.2, hint: 'erases from the top down on arrises' },
  seed: { group: 'Surface', label: 'Seed', min: 0, max: 99, step: 1, default: 7 },
}

/**
 * Presets, calibrated against photographs (research/02 §4). Each is a complete
 * look AT age = 1; the age dial then walks it back to the as-cast metal.
 */
export const PATINA_PRESETS = {
  // fresh from the mould: warm golden bronze, black paste in the line work
  'as-cast': {
    age: 1, tin: 0.14, lead: 0.03, polish: 0.65, tarnish: 0.12, cuprite: 0, tinOxide: 0, malachite: 0, azurite: 0, chloride: 0, soot: 0,
    earth: 0, calcite: 0, recessDirt: 0.15, wax: 0, inlay: 0.85, wear: 0, crust: 0,
  },
  // Houmuwu: pale grey-green / blue-green mottling over brown, cuprite flecks
  'excavated-green': {
    age: 1, tin: 0.12, lead: 0.03, polish: 0.4, tarnish: 0.6, cuprite: 0.9, tinOxide: 0.7, tinOxideTone: 1.9, malachite: 0.74, malachiteHue: 0.0, malachiteTone: 0.62,
    malachiteScale: 2.5, crust: 1.1, azurite: 0.04, chloride: 0.12, soot: 0.1, crevice: 0.7, patchScale: 60, mottleScale: 8,
    earth: 0.32, earthColor: '#8a7354', calcite: 0.85, burialSide: 0.3, recessDirt: 0.3, wax: 0, inlay: 0, wear: 0.15,
  },
  // Freer F1915.136: vivid, thick, waxy emerald crust; red-brown on arrises
  'malachite-crust': {
    age: 1, tin: 0.14, lead: 0.03, polish: 0.4, tarnish: 0.6, cuprite: 0.9, tinOxide: 0, tinOxideTone: 1, malachite: 0.95, malachiteHue: 0.42, malachiteTone: 0.12,
    malachiteScale: 1.6, crust: 0.9, azurite: 0.05, chloride: 0.03, soot: 0, crevice: 0.6, patchScale: 60, mottleScale: 10,
    earth: 0.08, earthColor: '#6e5b42', calcite: 0, burialSide: 0.2, recessDirt: 0.45, wax: 0.45, inlay: 0, wear: 0.3,
  },
  // Met fangyi / zun / gu: cleaned and waxed: smooth olive-grey, green in recesses
  'olive-museum': {
    age: 1, tin: 0.14, lead: 0.05, polish: 0.5, tarnish: 0.8, cuprite: 0.45, tinOxide: 0.88, tinOxideTone: 1.25, malachite: 0.42, malachiteHue: 0.4,
    malachiteScale: 1.5, crust: 0.25, azurite: 0.02, chloride: 0.02, soot: 0, crevice: 0.95, patchScale: 80, mottleScale: 9,
    earth: 0.1, earthColor: '#6b5a42', calcite: 0.12, burialSide: 0.1, recessDirt: 0.55, wax: 0.6, inlay: 0, wear: 0.25,
  },
  // 黑漆古 / Met fanglei 55.160: glossy black noble skin, red-brown blotches, lime streaks
  'water-black': {
    age: 1, tin: 0.16, lead: 0.02, polish: 0.7, tarnish: 0.9, cuprite: 0.7, tinOxide: 0.8, tinOxideTone: 0, malachite: 0.08, malachiteHue: 0.35,
    malachiteScale: 1.5, crust: 0.1, azurite: 0, chloride: 0.03, soot: 0, crevice: 0.6, patchScale: 110, mottleScale: 16,
    earth: 0.05, earthColor: '#5a4a38', calcite: 0.12, burialSide: 0.2, recessDirt: 0.4, wax: 0.3, inlay: 0, wear: 0.15,
  },
  // carbonate-rich burial: azurite islands through the malachite (never a teal blend)
  'azurite-bloom': {
    age: 1, tin: 0.13, lead: 0.04, polish: 0.4, tarnish: 0.6, cuprite: 0.9, tinOxide: 0, tinOxideTone: 1, malachite: 0.85, malachiteHue: 0.4,
    malachiteScale: 2.2, crust: 1.2, azurite: 0.35, chloride: 0.1, soot: 0, crevice: 0.7, patchScale: 70, mottleScale: 12,
    earth: 0.25, earthColor: '#8a7354', calcite: 0.2, burialSide: 0.3, recessDirt: 0.3, wax: 0, inlay: 0, wear: 0.15,
  },
  // active chlorides: pale chalky bluish-green pustules in pits, clustered low and on seams
  'bronze-disease': {
    age: 1, tin: 0.13, lead: 0.05, polish: 0.4, tarnish: 0.7, cuprite: 0.8, tinOxide: 0.55, tinOxideTone: 1.2, malachite: 0.45, malachiteHue: 0.45,
    malachiteScale: 2, crust: 0.6, azurite: 0.03, chloride: 0.7, soot: 0, crevice: 0.8, patchScale: 70, mottleScale: 10,
    earth: 0.15, earthColor: '#7a6548', calcite: 0.1, burialSide: 0.3, recessDirt: 0.45, wax: 0, inlay: 0, wear: 0.15,
  },
  // kept above ground and handled: warm metal on every high point, near-black recesses
  'heirloom': {
    age: 1, tin: 0.13, lead: 0.04, polish: 0.7, tarnish: 0.75, cuprite: 0.5, tinOxide: 0.8, tinOxideTone: 0.25, malachite: 0.1, malachiteHue: 0.5,
    malachiteScale: 1.5, crust: 0.15, azurite: 0, chloride: 0, soot: 0.05, crevice: 0.9, patchScale: 80, mottleScale: 12,
    earth: 0, calcite: 0, burialSide: 0, recessDirt: 0.8, wax: 0.3, inlay: 0.2, wear: 0.75,
  },
}

const U = (name) => 'u' + name[0].toUpperCase() + name.slice(1)

/** The shared uniform set. patina.<param>.value — one object for every PatinaMaterial. */
export const patina = {}
for (const [k, d] of Object.entries(PATINA_PARAMS)) {
  patina[k] = { value: d.type === 'color' ? new THREE.Color(d.default) : d.default }
}
// 0 beauty · 1 clay (neutral grey: relief only) · 2 height · 3 mask (layer coverages, false colour)
patina.mode = { value: 0 }
// vessel space: world → vessel matrix, and the vessel's bbox in that space (mm)
patina.vesselInverse = { value: new THREE.Matrix4() }
patina.vesselMin = { value: new THREE.Vector3(-150, 0, -150) }
patina.vesselSize = { value: new THREE.Vector3(300, 300, 300) }

/** Set any subset of parameters (colours as '#rrggbb' or THREE.Color). */
export function setPatina(values = {}) {
  for (const [k, v] of Object.entries(values)) {
    if (!patina[k] || !(k in PATINA_PARAMS)) continue
    if (patina[k].value instanceof THREE.Color) patina[k].value.set(v)
    else patina[k].value = v
  }
}

/** Current parameters as plain values (colours as hex strings). */
export function getPatina() {
  const out = {}
  for (const k of Object.keys(PATINA_PARAMS)) {
    const v = patina[k].value
    out[k] = v instanceof THREE.Color ? '#' + v.getHexString() : v
  }
  return out
}

export const PATINA_MODES = { beauty: 0, clay: 1, height: 2, mask: 3 }

export function setPatinaMode(mode) {
  patina.mode.value = PATINA_MODES[mode] ?? 0
}

/**
 * Tell the patina what it is on: the vessel root (its world matrix defines
 * vessel space, its bbox the size) or an explicit { min, max } box in mm.
 * The stage calls this whenever it shows a new subject. Noise stays in mm, so
 * scales are physical; the box gives height-above-base (soot, soil), the axis
 * (interior / inward faces) and a gentle size bias on territory size.
 */
export function setPatinaVessel(target) {
  if (!target) return
  if (target.isObject3D) {
    target.updateMatrixWorld(true)
    patina.vesselInverse.value.copy(target.matrixWorld).invert()
    const box = new THREE.Box3()
    const inv = patina.vesselInverse.value
    target.traverse((o) => {
      if (!o.isMesh || !o.geometry) return
      if (!o.geometry.boundingBox) o.geometry.computeBoundingBox()
      const b = o.geometry.boundingBox.clone().applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld))
      box.union(b)
    })
    if (box.isEmpty()) return
    patina.vesselMin.value.copy(box.min)
    box.getSize(patina.vesselSize.value)
  } else {
    patina.vesselInverse.value.identity()
    patina.vesselMin.value.fromArray(target.min)
    patina.vesselSize.value.fromArray(target.max).sub(patina.vesselMin.value)
  }
}

export class PatinaMaterial extends THREE.MeshStandardMaterial {
  /**
   * @param {object} o
   * @param {import('../relief/bake.js').ReliefMap|null} [o.relief]
   * @param {boolean} [o.cavityAttribute] read a per-vertex `cavity` attribute (0 recess → 1 exposed)
   * @param {number} [o.cavity] constant cavity for plain meshes (0 recess → 1 exposed), default 0.8
   * @param {number} [o.interior] 0..1: this mesh is an inside surface (bowl, inner wall): more soil, sulfide-dark, no wear
   * @param {number} [o.normalStrength] scales the relief normal map
   */
  constructor({ relief = null, cavityAttribute = false, cavity = 0.8, interior = 0, normalStrength = 1, ...params } = {}) {
    super({ color: 0xffffff, roughness: 0.5, metalness: 1, envMapIntensity: 1, ...params })
    this.isPatinaMaterial = true
    this.relief = relief
    this.cavityAttribute = cavityAttribute
    this.defines = this.defines || {}
    if (relief) {
      this.normalMap = relief.normalTexture
      this.normalScale = new THREE.Vector2(normalStrength, normalStrength)
      this.defines.PATINA_RELIEF = ''
    }
    if (cavityAttribute) this.defines.PATINA_CAVITY_ATTR = ''
    this.local = {
      uReliefData: { value: relief ? relief.dataTexture : null },
      uReliefRange: { value: new THREE.Vector2(relief ? relief.min : 0, relief ? relief.max : 1) },
      uConstCavity: { value: cavity },
      uInterior: { value: interior },
    }
    this.onBeforeCompile = (shader) => patchShader(shader, this)
  }

  customProgramCacheKey() {
    return 'patina2:' + (this.relief ? 'R' : '') + (this.cavityAttribute ? 'C' : '')
  }
}

// ----------------------------------------------------------------- shader

function patchShader(shader, mat) {
  for (const k of Object.keys(PATINA_PARAMS)) shader.uniforms[U(k)] = patina[k]
  shader.uniforms.uPatinaMode = patina.mode
  shader.uniforms.uVesselInv = patina.vesselInverse
  shader.uniforms.uVesselMin = patina.vesselMin
  shader.uniforms.uVesselSize = patina.vesselSize
  Object.assign(shader.uniforms, mat.local)

  shader.vertexShader = shader.vertexShader
    .replace(
      '#include <common>',
      `#include <common>
uniform mat4 uVesselInv;
varying vec3 vPatinaPos;
varying vec3 vPatinaNrm;
#ifdef PATINA_CAVITY_ATTR
attribute float cavity;
varying float vCavity;
#endif`,
    )
    .replace(
      '#include <project_vertex>',
      `#include <project_vertex>
{
  mat4 tt_m = uVesselInv * modelMatrix;
  vPatinaPos = (tt_m * vec4(transformed, 1.0)).xyz;
  vPatinaNrm = normalize(mat3(tt_m) * objectNormal);
}
#ifdef PATINA_CAVITY_ATTR
vCavity = cavity;
#endif`,
    )

  const decl = Object.entries(PATINA_PARAMS)
    .map(([k, d]) => `uniform ${d.type === 'color' ? 'vec3' : 'float'} ${U(k)};`)
    .join('\n')

  shader.fragmentShader = shader.fragmentShader
    .replace(
      '#include <common>',
      `#include <common>
${decl}
uniform float uPatinaMode;
uniform sampler2D uReliefData;
uniform vec2 uReliefRange;
uniform float uConstCavity;
uniform float uInterior;
uniform vec3 uVesselMin;
uniform vec3 uVesselSize;
varying vec3 vPatinaPos;
varying vec3 vPatinaNrm;
#ifdef PATINA_CAVITY_ATTR
varying float vCavity;
#endif
${noiseChunk}
${LAYERS}`,
    )
    .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>\n${APPLY}`)
    // dielectric corrosion products have their own F0 (cuprite ≈ 0.2, SnO₂ ≈ 0.08)
    .replace('#include <lights_physical_fragment>', `#include <lights_physical_fragment>\nmaterial.specularColor = mix(vec3(ttF0), diffuseColor.rgb, metalnessFactor);`)
}

// Surface description + one function per layer. Each layer returns a coverage
// 0..1 from the shared `Surf`, so a specialist can retune one in isolation.
const LAYERS = /* glsl */ `
struct Surf {
  vec3 p;        // vessel-space position, mm
  vec3 n;        // vessel-space geometric normal
  float up;      // n.y
  float hgt;     // height above the base, 0..1 of the vessel
  float h01;     // relief height, 0..1 over the panel's range (0.5 on plain meshes)
  float cav;     // 0 deep recess → 1 fully exposed
  float edge;    // 1 on sharp raised arrises (relief edge channel ∪ geometric convexity)
  float groove;  // 1 inside sunk line work
  float rec;     // recess preference after crevice bias, 0..1
  float inside;  // 0..1 interior / sheltered (inward-facing, interior flag)
  float burial;  // -1..1 facing the side that lay in the soil
  float T;       // territory field 0..1 (patchScale, domain-warped)
  float T2;      // second, independent territory field 0..1 (azurite, noble-vs-crust split)
  float M;       // mottle 0..1 (mottleScale)
  float G;       // speckle 0..1 (≈ grain size), LOD-faded to 0.5
  float B;       // botryoidal dome height 0..1 (malachiteScale), LOD-faded
  float px;      // pixel footprint, mm
};

float tt_ss(float a, float b, float x) { return smoothstep(a, b, x); }
// remap an amount (0..1) into a coverage of field f: amount ≈ area fraction
float tt_cover(float amount, float f, float soft) {
  return amount <= 0.001 ? 0.0 : smoothstep(1.0 - amount - soft, 1.0 - amount + soft, f);
}
// fades a band of noise to its mean once it drops under ~1.5 px
float tt_lod(float scaleMM, float px) { return 1.0 - smoothstep(0.25, 0.75, px / max(scaleMM, 1e-3)); }

vec3 tt_pal(vec3 dark, vec3 mid, vec3 light, float t) {
  return t < 0.5 ? mix(dark, mid, t * 2.0) : mix(mid, light, t * 2.0 - 1.0);
}

// research/02 §1.2: F0 vs Sn wt, linear, rows every 5 %
vec3 tt_metalF0(float sn, float pb) {
  float x = clamp(sn, 0.0, 0.3) * 20.0;
  vec3 c;
  if (x < 1.0) c = mix(vec3(0.955, 0.638, 0.538), vec3(0.940, 0.660, 0.500), x);
  else if (x < 2.0) c = mix(vec3(0.940, 0.660, 0.500), vec3(0.910, 0.700, 0.470), x - 1.0);
  else if (x < 3.0) c = mix(vec3(0.910, 0.700, 0.470), vec3(0.860, 0.725, 0.510), x - 2.0);
  else if (x < 4.0) c = mix(vec3(0.860, 0.725, 0.510), vec3(0.800, 0.735, 0.590), x - 3.0);
  else if (x < 5.0) c = mix(vec3(0.800, 0.735, 0.590), vec3(0.740, 0.720, 0.655), x - 4.0);
  else c = mix(vec3(0.740, 0.720, 0.655), vec3(0.700, 0.690, 0.660), x - 5.0);
  float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
  return mix(c, vec3(l) * 0.92, clamp(pb * 2.0, 0.0, 0.5));
}

// §2.5 noble patina palettes, tone 0 black · 1 olive · 2 grey; t = dark → light
vec3 tt_nobleColor(float tone, float t) {
  vec3 blk = tt_pal(vec3(0.006, 0.007, 0.006), vec3(0.014, 0.017, 0.012), vec3(0.030, 0.037, 0.024), t);
  vec3 olv = tt_pal(vec3(0.032, 0.046, 0.032), vec3(0.085, 0.115, 0.075), vec3(0.185, 0.235, 0.165), t);
  vec3 gry = tt_pal(vec3(0.070, 0.090, 0.085), vec3(0.145, 0.180, 0.172), vec3(0.300, 0.355, 0.335), t);
  return tone < 1.0 ? mix(blk, olv, tone) : mix(olv, gry, tone - 1.0);
}

// §2.3 malachite: hue 0 blue-green · 0.5 the research's malachite · 1 yellow-green
vec3 tt_malachiteColor(float hue, float t) {
  vec3 bg = tt_pal(vec3(0.012, 0.070, 0.064), vec3(0.045, 0.185, 0.170), vec3(0.200, 0.400, 0.380), t);
  vec3 gr = tt_pal(vec3(0.013, 0.102, 0.045), vec3(0.047, 0.254, 0.107), vec3(0.205, 0.479, 0.287), t);
  vec3 yg = tt_pal(vec3(0.030, 0.090, 0.025), vec3(0.100, 0.225, 0.062), vec3(0.290, 0.440, 0.170), t);
  return hue < 0.5 ? mix(bg, gr, hue * 2.0) : mix(gr, yg, hue * 2.0 - 1.0);
}

float layerCuprite(Surf S, float amt) {
  // a near-continuous film on the metal: territory only thins it at low amounts
  return tt_cover(amt, 0.5 * S.T + 0.3 * S.M + 0.2 * S.rec + 0.08 * (S.G - 0.5), 0.18);
}

float layerNoble(Surf S, float amt) {
  // Type I sheet: broad smooth territories, indifferent to relief, better on the exterior
  float f = 0.62 * (1.0 - S.T) + 0.28 * S.T2 + 0.1 * S.M - 0.15 * S.inside;
  return tt_cover(amt, f, 0.12);
}

float layerMalachite(Surf S, float amt) {
  // Type II crust: territories + strong recess preference, up-facing and burial-side bias,
  // thinner on convex arrises; mottled, fractal-edged boundaries
  float f = 0.5 * S.T + 0.6 * S.rec * (0.4 + 0.6 * uCrevice) + 0.12 * max(S.up, 0.0)
          + 0.15 * uBurialSide * S.burial - 0.3 * S.edge + 0.22 * (S.M - 0.5) + 0.06 * (S.G - 0.5) + 0.1 * S.inside;
  return tt_cover(amt, f, 0.1);
}

float layerAzurite(Surf S, float amt) {
  // discrete islands from a thresholded low-frequency field — not cavity-driven
  float f = 0.72 * S.T2 + 0.2 * S.M + 0.08 * S.inside + 0.04 * (S.G - 0.5);
  return tt_cover(amt * 0.7, f, 0.025);
}

float layerSoil(Surf S, float amt) {
  // packed into recesses, onto up-facing ledges, the burial side, underside and interior
  float f = 0.75 * S.rec + 0.22 * max(S.up, 0.0) * (1.0 - S.edge) + 0.3 * uBurialSide * max(S.burial, 0.0)
          + 0.35 * S.inside + 0.3 * max(-S.up, 0.0) * (1.0 - tt_ss(0.0, 0.25, S.hgt)) + 0.2 * (S.M - 0.5) - 0.25 * S.edge;
  return tt_cover(amt, f, 0.09);
}

float layerSoot(Surf S, float amt) {
  float low = 1.0 - tt_ss(0.0, 0.4, S.hgt);
  return amt * clamp(low * (0.6 + 0.4 * S.M) + 0.5 * max(-S.up, 0.0) * low, 0.0, 1.0) * (1.0 - S.inside);
}

// erase driver: convex arrises, rims and handles first (handling), noisy
float layerWear(Surf S, float amt) {
  float hi = S.edge * 0.9 + 0.3 * tt_ss(0.7, 1.0, S.h01) * tt_ss(0.75, 1.0, S.cav) + 0.35 * tt_ss(0.9, 1.0, S.hgt) * (1.0 - S.inside);
  float e = amt * tt_ss(0.15, 0.85, hi + 0.35 * (S.M - 0.5) + 0.25 * (S.G - 0.5));
  return clamp(e * (1.0 - 0.8 * S.inside), 0.0, 1.0);
}

// bump from a scalar height (mm) via screen-space derivatives (Mikkelsen)
vec3 tt_bump(vec3 n, float h, vec3 viewPos) {
  vec3 sx = dFdx(viewPos), sy = dFdy(viewPos);
  vec3 r1 = cross(sy, n), r2 = cross(n, sx);
  float det = dot(sx, r1);
  vec3 grad = sign(det) * (dFdx(h) * r1 + dFdy(h) * r2);
  return normalize(abs(det) * n - grad);
}
`

const APPLY = /* glsl */ `
float ttF0 = 0.04;
{
  Surf S;
  S.p = vPatinaPos;
  S.n = normalize(vPatinaNrm) * (gl_FrontFacing ? 1.0 : -1.0);
  S.up = S.n.y;
  S.hgt = clamp((S.p.y - uVesselMin.y) / max(uVesselSize.y, 1.0), 0.0, 1.0);
  S.px = max(length(fwidth(vPatinaPos)), 1e-3);

  // geometric curvature (signed, 1/mm) from the interpolated normal: + convex arris, − concave crease
  vec3 vp = -vViewPosition;
  vec3 dpx = dFdx(vp), dpy = dFdy(vp);
  float kx = dot(dFdx(nonPerturbedNormal), dpx) / max(dot(dpx, dpx), 1e-6);
  float ky = dot(dFdy(nonPerturbedNormal), dpy) / max(dot(dpy, dpy), 1e-6);
  float kc = 0.5 * (kx + ky);
  float gEdge = tt_ss(0.06, 0.35, kc);
  float gCrease = tt_ss(0.03, 0.25, -kc);

  // shelter from the vessel's own shape: faces turned toward the axis (inner walls,
  // the inner sides of legs), undersides, and the per-mesh interior hint
  vec3 axis = uVesselMin + 0.5 * uVesselSize;
  vec2 rad = S.p.xz - axis.xz;
  float inward = max(0.0, -dot(normalize(S.n.xz + 1e-5), normalize(rad + 1e-5))) * length(S.n.xz);
  S.inside = clamp(max(uInterior, inward * 0.55 * tt_ss(0.2, 0.6, S.hgt)), 0.0, 1.0);

  bool plain = true;
  #ifdef PATINA_RELIEF
    if (vNormalMapUv.x > -0.5) {
      vec4 rd = texture2D(uReliefData, vNormalMapUv);
      S.h01 = rd.r; S.cav = rd.g; S.edge = rd.b; S.groove = rd.a;
      plain = false;
    }
  #endif
  if (plain) {
    #ifdef PATINA_CAVITY_ATTR
      S.cav = vCavity;
    #else
      S.cav = uConstCavity;
    #endif
    S.h01 = 0.5; S.edge = 0.0; S.groove = 0.0;
    #ifdef PATINA_RELIEF
      S.inside = max(S.inside, 0.7); // the inner wall of a decorated panel (uv = -1)
    #endif
  }
  S.edge = max(S.edge, gEdge);
  S.cav = clamp(S.cav - 0.45 * gCrease - 0.25 * max(-S.up, 0.0) - 0.3 * S.inside, 0.0, 1.0);
  S.rec = clamp((1.0 - S.cav) * mix(0.55, 1.35, uCrevice), 0.0, 1.0);
  S.burial = dot(S.n, normalize(vec3(0.3, -0.2, 0.93)));

  // ---- noise fields, vessel space mm
  vec3 so = vec3(uSeed * 17.13, uSeed * -9.71, uSeed * 5.37);
  float sizeBias = clamp(pow(max(uVesselSize.y, 50.0) / 300.0, 0.3), 0.75, 1.6);
  float tS = max(uPatchScale * sizeBias, 5.0);
  vec3 w = tt_warp(S.p / (tS * 1.6) + so);
  S.T = clamp(0.5 + 0.75 * fbm3(S.p / tS + 0.4 * w - so), 0.0, 1.0);
  S.T2 = clamp(0.5 + 0.8 * snoise(S.p / (tS * 0.55) + 1.4 * w + so.zxy), 0.0, 1.0);
  float mS = max(uMottleScale, 1.0);
  S.M = clamp(0.5 + 0.75 * tt_lod(mS, S.px) * fbm2(S.p / mS + 0.6 * w * (tS / mS) * 0.08 + so.yzx), 0.0, 1.0);
  float gS = max(uMalachiteScale, 0.3);
  float gLod = tt_lod(gS, S.px);
  S.G = clamp(0.5 + 0.6 * gLod * snoise(S.p / (gS * 0.6) - so), 0.0, 1.0);
  vec2 wb = worley8(S.p / gS + so.zyx);
  S.B = mix(0.5, clamp(1.0 - wb.x * wb.x * 1.6, 0.0, 1.0), gLod);

  // ---- the master dial: each layer arrives at its own point in the burial
  float a = clamp(uAge, 0.0, 1.0);
  float aT = tt_ss(0.0, 0.25, a);    // use-life tarnish
  float aC = tt_ss(0.08, 0.5, a);    // early cuprite
  float aN = tt_ss(0.3, 0.8, a);     // noble sheet
  float aM = tt_ss(0.35, 0.92, a);   // carbonate crust
  float aL = tt_ss(0.6, 1.0, a);     // late: azurite, chlorides, soil, lime
  float aW = tt_ss(0.05, 0.6, a);    // handling / cleaning

  float cCup = layerCuprite(S, uCuprite * aC);
  float cNob = layerNoble(S, uTinOxide * aN);
  float cMalR = layerMalachite(S, uMalachite * aM);
  float cAz = layerAzurite(S, uAzurite * aL) * tt_ss(0.0, 0.5, cMalR + 0.4);
  float cSoot = layerSoot(S, uSoot * aL);
  float cSoil = layerSoil(S, uEarth * aL);
  // chloride pustules: Poisson clusters (mottle × territory), denser low on the body,
  // at creases and on the burial side; each a spot of the crust-grain size over a pit
  float clus = tt_ss(0.6, 0.9, 0.55 * S.M + 0.45 * S.T2 + 0.25 * (1.0 - S.hgt) + 0.2 * gCrease + 0.1 * S.burial);
  vec2 wc = worley8(S.p / max(gS * 1.6, 0.6) - so.yxz);
  float spotR = 0.08 + 0.2 * uChloride;
  float cChlRaw = uChloride * aL * clus * step(wc.y, 0.15 + 0.45 * uChloride);
  float cChl = cChlRaw * (1.0 - tt_ss(spotR, spotR + 0.12, wc.x)) * gLod;
  float pitRing = cChlRaw * (tt_ss(spotR, spotR + 0.08, wc.x) - tt_ss(spotR + 0.1, spotR + 0.3, wc.x)) * gLod;
  // calcareous film: whitish dusting within soil territories and on up-facing crust
  float cCal = uCalcite * aL * clamp(tt_ss(0.35, 0.8, 0.6 * S.M + 0.4 * S.T2 + 0.25 * max(S.up, 0.0) + 0.2 * S.rec) * 0.75, 0.0, 1.0);

  // occlusion: crust occludes the noble sheet (alternatives per territory); cuprite rim
  // where a malachite island thins out
  cNob *= 1.0 - cMalR;
  float malRim = tt_ss(0.02, 0.2, cMalR) - tt_ss(0.25, 0.6, cMalR);

  // ---- wear / cleaning erase, top down (§3.4.9)
  float e = layerWear(S, uWear * aW);
  float kSoil = 1.0 - tt_ss(0.0, 0.15, e);
  float kCrust = 1.0 - tt_ss(0.1, 0.4, e);
  float kNoble = 1.0 - tt_ss(0.35, 0.65, e);
  float kCup = 1.0 - tt_ss(0.6, 0.9, e);
  cSoil *= kSoil; cCal *= kSoil;
  float cMal = cMalR * kCrust; cAz *= kCrust; cChl *= kCrust;
  cNob *= kNoble;
  cCup = max(cCup, malRim * uCuprite * aC * 0.8) * kCup;

  // crust thickness, mm: malachite deeper in recesses, botryoidal; soil lumps; chloride powder
  float tMal = cMal * uCrust * (0.3 + 0.7 * S.rec) * (0.55 + 0.45 * S.B);
  float tAz = cAz * uCrust * 0.7 * (0.6 + 0.4 * S.B);
  float tSoil = cSoil * (0.4 + 1.6 * S.rec) * (0.6 + 0.4 * S.M);
  float thick = max(max(tMal, tAz), tSoil) + cChl * 0.25;

  // ---- L0 metal: F0 from tin, lead-dulled; tarnish browns it (§1.2); as-cast skin in recesses
  float tarn = clamp(uTarnish * aT + 0.15 * a * (1.0 - e), 0.0, 1.0) * (1.0 - 0.6 * tt_ss(0.7, 1.0, e));
  vec3 F0m = tt_metalF0(uTin, uLead);
  vec3 col = F0m * mix(vec3(1.0), vec3(0.78, 0.60, 0.45), tarn);
  col *= 1.0 - 0.35 * tarn * S.rec; // the film is darker where it is not polished off
  float polishR = mix(0.40, 0.12, uPolish);
  float rough = mix(polishR, 0.47, tt_ss(0.25, 0.8, S.rec)) + 0.06 * tarn;
  // burnished by handling where wear reached the metal; micro-pitted elsewhere once corroded
  rough = mix(rough, 0.24, tt_ss(0.7, 1.0, e) * (1.0 - uPolish * 0.5));
  rough += 0.12 * aC * uCuprite * (1.0 - e) * (S.G - 0.3);
  float metal = 1.0;
  float f0 = 0.04;

  // ---- inlay paste in the sunk lines (on the metal, under all corrosion)
  float cInl = uInlay * tt_ss(0.25, 0.7, S.groove);
  col = mix(col, vec3(0.007, 0.006, 0.005) * (0.8 + 0.4 * S.G), cInl);
  rough = mix(rough, 0.6, cInl); metal = mix(metal, 0.0, cInl);
  cCup *= 1.0 - cInl * 0.85; cNob *= 1.0 - cInl * 0.85;

  // ---- L1 cuprite: liver / oxblood, compact & sub-metallic sheen (F0 ≈ 0.2)
  float cupT = clamp(0.45 * S.M + 0.35 * S.G + 0.3 * (1.0 - S.rec) - 0.1, 0.0, 1.0);
  vec3 cupCol = tt_pal(vec3(0.050, 0.012, 0.008), vec3(0.105, 0.026, 0.016), vec3(0.190, 0.052, 0.030), cupT * 0.8);
  cupCol = mix(cupCol, cupCol * vec3(0.7, 0.62, 0.62), S.rec); // darker, browner in recesses
  col = mix(col, cupCol, cCup); rough = mix(rough, mix(0.38, 0.62, S.G), cCup); metal = mix(metal, 0.0, cCup); f0 = mix(f0, 0.18, cCup);

  // ---- L2 noble tin-oxide sheet: glossy, conformal, lighter on high points
  float nobT = clamp(0.3 + 0.22 * S.M + 0.35 * (1.0 - S.rec) * S.h01 * 1.4 - 0.25 * S.rec, 0.0, 1.0);
  vec3 nobCol = tt_nobleColor(uTinOxideTone, nobT);
  col = mix(col, nobCol, cNob); rough = mix(rough, 0.2 + 0.12 * S.rec + 0.06 * S.M, cNob); metal = mix(metal, 0.0, cNob); f0 = mix(f0, 0.075, cNob);

  // ---- L3 soot / tenorite low on the body
  col = mix(col, vec3(0.022, 0.018, 0.014), cSoot * 0.85); rough = mix(rough, 0.8, cSoot * 0.85); metal = mix(metal, 0.0, cSoot * 0.85);

  // ---- L4 malachite: dark in recesses & under thin crust, banded light on domes
  float band = tt_ridged(S.p / (gS * 2.2) + w * 0.6);
  float malT = clamp(0.5 + 0.4 * (S.M - 0.5) + 0.12 * (S.B - 0.5) * tt_ss(0.0, 0.8, uCrust) + 0.12 * (band - 0.5) - 0.42 * S.rec + 0.45 * (S.T - 0.5) - 0.06 + 0.7 * (uMalachiteTone - 0.5), 0.0, 1.0);
  vec3 malCol = tt_malachiteColor(uMalachiteHue, malT);
  // thin crust lets the cuprite through: red-brown show-through
  float thin = 1.0 - tt_ss(0.05, 0.45, tMal + 0.25 * cMal * (1.0 - uCrust * 0.3));
  malCol = mix(malCol, cupCol + malCol * 0.25, thin * 0.5 * uCuprite);
  col = mix(col, malCol, cMal);
  rough = mix(rough, mix(0.45, 0.8, tt_ss(0.2, 2.0, uCrust)) - 0.1 * S.B, cMal); metal = mix(metal, 0.0, cMal); f0 = mix(f0, 0.065, cMal);

  // ---- L5 azurite islands: thresholded, never blended into teal
  vec3 azCol = tt_pal(vec3(0.012, 0.036, 0.162), vec3(0.026, 0.098, 0.392), vec3(0.144, 0.287, 0.631), clamp(0.35 + 0.5 * (S.B - 0.5) + 0.4 * (S.M - 0.5), 0.0, 1.0));
  col = mix(col, azCol, cAz); rough = mix(rough, 0.55, cAz); metal = mix(metal, 0.0, cAz); f0 = mix(f0, 0.06, cAz);

  // ---- L6 chlorides: pale chalky bluish green over a pit, dark ring of cuprite
  col = mix(col, cupCol * 0.55, pitRing * 0.8);
  vec3 chlCol = tt_pal(vec3(0.159, 0.423, 0.238), vec3(0.314, 0.597, 0.381), vec3(0.546, 0.761, 0.597), S.G);
  col = mix(col, chlCol, cChl); rough = mix(rough, 0.97, cChl); metal = mix(metal, 0.0, cChl);

  // ---- L8 soil and calcareous film
  vec3 soilCol = uEarthColor * uEarthColor; // sRGB pick → ~linear
  soilCol = mix(soilCol * 0.62, mix(soilCol, vec3(0.644, 0.509, 0.301), 0.4), clamp(S.M * 0.8 + 0.4 * (S.G - 0.5), 0.0, 1.0));
  col = mix(col, soilCol, cSoil); rough = mix(rough, 0.95, cSoil); metal = mix(metal, 0.0, cSoil); f0 = mix(f0, 0.04, cSoil);
  vec3 calCol = tt_pal(vec3(0.509, 0.462, 0.361), vec3(0.694, 0.644, 0.533), vec3(0.855, 0.815, 0.716), S.G);
  float calA = cCal * (0.35 + 0.45 * cSoil) * (1.0 - cChl);
  // lime film: lightens and greys what it sits on rather than painting it beige
  float lumC = dot(col, vec3(0.2126, 0.7152, 0.0722));
  vec3 film = mix(calCol * 0.7, mix(col, vec3(lumC), 0.55) * 1.5 + vec3(lumC) * 0.6, 0.65);
  col = mix(col, film, calA); rough = mix(rough, 0.88, calA); metal = mix(metal, 0.0, calA);

  // ---- dirt and wax in recesses on cleaned pieces (§3.4.10), museum wax sheen
  float dirt = uRecessDirt * pow(S.rec, 1.5) * (1.0 - cSoil);
  col *= 1.0 - 0.7 * dirt; rough = min(1.0, rough + 0.3 * dirt);
  rough = mix(rough, min(rough, 0.34), uWax * (1.0 - metal) * (1.0 - cChl)); f0 += 0.02 * uWax * (1.0 - metal);

  ttF0 = f0;
  if (uPatinaMode > 0.5) {
    if (uPatinaMode > 2.5) {
      // mask: which layer is on top, false colour, unlit
      vec3 m = mix(vec3(0.85, 0.65, 0.25), vec3(1.0), tt_ss(0.7, 1.0, e));           // metal (white = worn bright)
      m = mix(m, vec3(0.75, 0.10, 0.05), cCup);                                       // cuprite red
      m = mix(m, vec3(0.55, 0.25, 0.75), cNob);                                       // noble sheet violet
      m = mix(m, vec3(0.05, 0.05, 0.05), max(cInl, cSoot * 0.85));                    // inlay / soot black
      m = mix(m, vec3(0.10, 0.80, 0.25), cMal);                                       // malachite green
      m = mix(m, vec3(0.10, 0.30, 1.00), cAz);                                        // azurite blue
      m = mix(m, vec3(0.20, 1.00, 1.00), cChl);                                       // chloride cyan
      m = mix(m, vec3(1.00, 0.85, 0.10), cSoil);                                      // soil yellow
      m = mix(m, vec3(1.00, 0.70, 0.80), calA);                                       // calcite pink
      m *= 0.55 + 0.45 * clamp(1.0 - thick * 0.25, 0.0, 1.0);                         // darker = thicker crust
      totalEmissiveRadiance = m;
      col = vec3(0.0); rough = 1.0; metal = 0.0;
    } else {
      // clay / height: relief only, no patina
      float g = uPatinaMode > 1.5 ? 0.0 : 0.42;
      col = vec3(g); rough = 0.62; metal = 0.0; ttF0 = 0.04;
      if (uPatinaMode > 1.5) totalEmissiveRadiance = plain ? vec3(0.12) : vec3(S.h01);
    }
  } else {
    // encrustation softens the cast line work: flatten the relief normal under thick crust
    // (and in grooves filled flush with paste), then add the crust's own lumps and pits
    float flatK = clamp(tt_ss(0.0, 1.4, thick) * 0.9 + cInl * 0.6, 0.0, 0.95);
    normal = normalize(mix(normal, nonPerturbedNormal, flatK));
    float bumpH = (tMal * 0.35 * (S.B - 0.5) + tSoil * 0.4 * (S.M - 0.5) + tAz * 0.3 * S.B + cChl * 0.15 - pitRing * 0.25) * gLod
                + 0.02 * aC * (S.G - 0.5) * gLod;
    normal = tt_bump(normal, bumpH, vp);
  }

  diffuseColor.rgb = col;
  roughnessFactor = clamp(rough, 0.04, 1.0);
  metalnessFactor = clamp(metal, 0.0, 1.0);
}
`
