// PatinaMaterial — MeshStandardMaterial + a layered burial-corrosion model.
//
// A Shang bronze out of the ground is a stack, built from the metal outward:
//   metal (Cu–Sn–Pb)  →  tarnish film  →  cuprite Cu₂O (red-brown, grows
//   first, directly on the metal)  →  noble tin-oxide "water patina" where
//   the burial was wet and still  →  carbonate crusts (malachite green,
//   azurite blue) that grow where water stood: recesses, grooves, the foot of
//   motif walls  →  chlorides (pale powdery "bronze disease")  →  soil packed
//   into the recesses. Handling and cleaning wear that stack back from the high
//   points and arrises down to cuprite and then to metal.
//
// Every mesh of a vessel shares ONE uniform set (`patina`), so a single slider
// re-ages the whole vessel. Per-material state is only the relief textures.
// The relief dataTexture (height / cavity / edge / groove) is what puts each
// layer where the chemistry puts it — nothing here is painted per vessel.

import * as THREE from 'three'
import { noiseChunk } from './noise.glsl.js'

/**
 * Parameter metadata — the Patina drawer is generated from this. Grouped the
 * way a conservator would describe a surface. Defaults are a mid excavated look.
 */
export const PATINA_PARAMS = {
  age: { group: 'master', label: 'Time in the ground', min: 0, max: 1, step: 0.005, default: 1 },
  // Alloy
  tin: { group: 'Alloy', label: 'Tin', min: 0, max: 1, step: 0.01, default: 0.5, hint: 'copper-red → golden → silvery' },
  polish: { group: 'Alloy', label: 'Polish', min: 0, max: 1, step: 0.01, default: 0.5 },
  tarnish: { group: 'Alloy', label: 'Tarnish', min: 0, max: 1, step: 0.01, default: 0.5 },
  // Corrosion
  cuprite: { group: 'Corrosion', label: 'Cuprite', min: 0, max: 1, step: 0.01, default: 0.6 },
  malachite: { group: 'Corrosion', label: 'Malachite', min: 0, max: 1, step: 0.01, default: 0.6 },
  malachiteHue: { group: 'Corrosion', label: 'Malachite hue', min: 0, max: 1, step: 0.01, default: 0.45, hint: 'blue-green → yellow-green' },
  malachiteScale: { group: 'Corrosion', label: 'Crust grain', min: 0.5, max: 20, step: 0.1, default: 4, unit: 'mm' },
  azurite: { group: 'Corrosion', label: 'Azurite', min: 0, max: 1, step: 0.01, default: 0.1 },
  chloride: { group: 'Corrosion', label: 'Chloride', min: 0, max: 1, step: 0.01, default: 0.1 },
  tinOxide: { group: 'Corrosion', label: 'Tin oxide', min: 0, max: 1, step: 0.01, default: 0.1 },
  crevice: { group: 'Corrosion', label: 'Crevice bias', min: 0, max: 1, step: 0.01, default: 0.7 },
  patchScale: { group: 'Corrosion', label: 'Patch size', min: 10, max: 300, step: 1, default: 70, unit: 'mm' },
  // Surface
  earth: { group: 'Surface', label: 'Burial soil', min: 0, max: 1, step: 0.01, default: 0.4 },
  earthColor: { group: 'Surface', label: 'Soil colour', type: 'color', default: '#6e5b42' },
  inlay: { group: 'Surface', label: 'Black inlay', min: 0, max: 1, step: 0.01, default: 0.2 },
  wear: { group: 'Surface', label: 'Wear', min: 0, max: 1, step: 0.01, default: 0.3 },
  seed: { group: 'Surface', label: 'Seed', min: 0, max: 99, step: 1, default: 7 },
}

/** First-pass presets; research/02-… is authoritative for colours. */
export const PATINA_PRESETS = {
  // fresh from the mould: golden bronze, black paste in the line work
  'as-cast': { age: 0, tin: 0.55, polish: 0.85, tarnish: 0, cuprite: 0, malachite: 0, azurite: 0, chloride: 0, tinOxide: 0, earth: 0, inlay: 0.9, wear: 0, crevice: 0.5 },
  // the classic Anyang excavation surface
  'excavated-green': { age: 1, tin: 0.5, polish: 0.4, tarnish: 0.6, cuprite: 0.7, malachite: 0.66, malachiteHue: 0.42, malachiteScale: 4, azurite: 0.1, chloride: 0.12, tinOxide: 0.08, earth: 0.42, earthColor: '#6e5b42', inlay: 0.15, crevice: 0.75, wear: 0.22, patchScale: 70 },
  // "black lacquer" 黑漆古: a glossy noble tin-oxide skin from waterlogged burial
  'water-black': { age: 1, tin: 0.65, polish: 0.7, tarnish: 0.9, cuprite: 0.25, malachite: 0.1, malachiteHue: 0.3, azurite: 0, chloride: 0.02, tinOxide: 0.95, earth: 0.1, earthColor: '#3d352b', inlay: 0.3, crevice: 0.6, wear: 0.3, patchScale: 110 },
  // cleaned and waxed in a 20th-century collection: olive-brown with green in the recesses
  'olive-museum': { age: 0.85, tin: 0.5, polish: 0.55, tarnish: 0.85, cuprite: 0.6, malachite: 0.42, malachiteHue: 0.72, malachiteScale: 3, azurite: 0.02, chloride: 0.02, tinOxide: 0.45, earth: 0.12, earthColor: '#5a4a35', inlay: 0.2, crevice: 0.95, wear: 0.5, patchScale: 90 },
  // carbonate-rich burial: azurite rosettes through the malachite
  'azurite-bloom': { age: 1, tin: 0.45, polish: 0.3, tarnish: 0.6, cuprite: 0.75, malachite: 0.62, malachiteHue: 0.3, malachiteScale: 5, azurite: 0.45, chloride: 0.18, tinOxide: 0.05, earth: 0.3, earthColor: '#7a6548', inlay: 0.1, crevice: 0.7, wear: 0.15, patchScale: 55 },
  // handed down above ground: dark, handled, high points polished to metal
  'heirloom': { age: 0.45, tin: 0.5, polish: 0.75, tarnish: 0.9, cuprite: 0.45, malachite: 0.04, malachiteHue: 0.5, azurite: 0, chloride: 0, tinOxide: 0.15, earth: 0, inlay: 0.45, crevice: 0.6, wear: 0.75, patchScale: 80 },
}

const U = (name) => 'u' + name[0].toUpperCase() + name.slice(1)

/** The shared uniform set. patina.<param>.value — one object for every PatinaMaterial. */
export const patina = {}
for (const [k, d] of Object.entries(PATINA_PARAMS)) {
  patina[k] = { value: d.type === 'color' ? new THREE.Color(d.default) : d.default }
}
// 0 beauty · 1 clay (neutral grey: relief only) · 2 height (relief height as greyscale)
patina.mode = { value: 0 }

/** Set any subset of parameters (colours as '#rrggbb' or THREE.Color). */
export function setPatina(values = {}) {
  for (const [k, v] of Object.entries(values)) {
    if (!patina[k]) continue
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

export const PATINA_MODES = { beauty: 0, clay: 1, height: 2 }

export function setPatinaMode(mode) {
  patina.mode.value = PATINA_MODES[mode] ?? 0
}

export class PatinaMaterial extends THREE.MeshStandardMaterial {
  /**
   * @param {object} o
   * @param {import('../relief/bake.js').ReliefMap|null} [o.relief]
   * @param {boolean} [o.cavityAttribute] read a per-vertex `cavity` attribute (0 recess → 1 exposed)
   * @param {number} [o.cavity] constant cavity when neither relief nor attribute exists
   * @param {number} [o.normalStrength] scales the relief normal map
   */
  constructor({ relief = null, cavityAttribute = false, cavity = 0.8, normalStrength = 1, ...params } = {}) {
    super({ color: 0xffffff, roughness: 0.5, metalness: 1, envMapIntensity: 1.5, ...params })
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
    }
    this.onBeforeCompile = (shader) => patchShader(shader, this)
  }

  customProgramCacheKey() {
    return 'patina:' + (this.relief ? 'R' : '') + (this.cavityAttribute ? 'C' : '')
  }
}

// ----------------------------------------------------------------- shader

function patchShader(shader, mat) {
  for (const k of Object.keys(PATINA_PARAMS)) shader.uniforms[U(k)] = patina[k]
  shader.uniforms.uPatinaMode = patina.mode
  Object.assign(shader.uniforms, mat.local)

  shader.vertexShader = shader.vertexShader
    .replace(
      '#include <common>',
      `#include <common>
varying vec3 vPatinaPos;
#ifdef PATINA_CAVITY_ATTR
attribute float cavity;
varying float vCavity;
#endif`,
    )
    .replace(
      '#include <project_vertex>',
      `#include <project_vertex>
vPatinaPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
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
varying vec3 vPatinaPos;
#ifdef PATINA_CAVITY_ATTR
varying float vCavity;
#endif
${noiseChunk}
${LAYERS}`,
    )
    .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>\n${APPLY}`)
}

// One function per layer. Each returns a coverage 0..1 from the shared
// surface description `S`, so a specialist can retune one layer in isolation.
const LAYERS = /* glsl */ `
struct Surf {
  vec3 p;        // vessel-space position, mm
  float h01;     // relief height, 0..1 over the panel's range
  float cav;     // 0 deep recess → 1 fully exposed
  float edge;    // 1 on sharp raised arrises
  float groove;  // 1 inside sunk line work
  float terr;    // corrosion territory field 0..1 (patchScale)
  float grain;   // crust grain field 0..1 (malachiteScale)
  float rec;     // recess preference after crevice bias, 0..1
};

// remap an amount (0..1) into a coverage of field f: amount ≈ area fraction
float tt_cover(float amount, float f, float soft) {
  return amount <= 0.0 ? 0.0 : smoothstep(1.0 - amount - soft, 1.0 - amount + soft, f);
}

vec3 tt_metalColor(float tin) {
  // linear-space F0: copper-rich → golden α-bronze → silvery high-tin speculum
  vec3 copper = vec3(0.86, 0.40, 0.25);
  vec3 bronze = vec3(0.72, 0.47, 0.20);
  vec3 silver = vec3(0.62, 0.60, 0.53);
  return tin < 0.5 ? mix(copper, bronze, tin * 2.0) : mix(bronze, silver, tin * 2.0 - 1.0);
}

float layerCuprite(Surf S, float amt) {
  // cuprite forms a near-continuous film on the metal; territory only thins it
  return tt_cover(amt, 0.55 * S.terr + 0.25 * S.grain + 0.2 * S.rec + 0.1, 0.15);
}

float layerTinOxide(Surf S, float amt) {
  // noble patina: broad, smooth territories, indifferent to relief
  return tt_cover(amt, 0.8 * S.terr + 0.2 * S.grain, 0.12);
}

float layerMalachite(Surf S, float amt) {
  float f = mix(S.terr, S.rec, uCrevice * 0.75) * 0.75 + 0.25 * S.grain;
  return tt_cover(amt, f, 0.06);
}

float layerAzurite(Surf S, float amt) {
  // rosettes: point-seeded where the carbonate crust is already thick
  float w = 1.0 - worley3(S.p / max(uPatchScale * 0.35, 1.0) + uSeed * 3.1);
  return tt_cover(amt * 0.6, 0.65 * w + 0.35 * S.rec * S.terr + 0.1 * S.grain, 0.05);
}

float layerChloride(Surf S, float amt) {
  float w = 1.0 - worley3(S.p / max(uMalachiteScale * 1.6, 0.5) - uSeed * 1.7);
  return tt_cover(amt * 0.7, 0.7 * w * w + 0.3 * S.grain, 0.04);
}

float layerEarth(Surf S, float amt) {
  return tt_cover(amt, S.rec * 0.85 + 0.15 * S.grain, 0.08);
}

float layerWear(Surf S, float amt) {
  // handling reaches arrises and the tops of plateaus first
  float hi = clamp(S.edge * 1.3 + (S.h01 - 0.7) * 1.2 + (S.cav - 0.75) * 0.8, 0.0, 1.0);
  return tt_cover(amt, 0.7 * hi + 0.3 * S.grain, 0.1);
}

vec3 tt_malachiteColor(float hue, float grain) {
  vec3 blueGreen = vec3(0.05, 0.19, 0.15);
  vec3 green = vec3(0.08, 0.21, 0.10);
  vec3 yellowGreen = vec3(0.15, 0.20, 0.06);
  vec3 c = hue < 0.5 ? mix(blueGreen, green, hue * 2.0) : mix(green, yellowGreen, hue * 2.0 - 1.0);
  return c * (0.5 + 0.7 * grain); // botryoidal crust: lighter bulbs, darker interstices
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
{
  Surf S;
  S.p = vPatinaPos;
  #ifdef PATINA_RELIEF
    vec4 rd = texture2D(uReliefData, vNormalMapUv);
    S.h01 = rd.r; S.cav = rd.g; S.edge = rd.b; S.groove = rd.a;
  #elif defined(PATINA_CAVITY_ATTR)
    S.h01 = 0.5; S.cav = vCavity; S.edge = 0.0; S.groove = 0.0;
  #else
    S.h01 = 0.5; S.cav = uConstCavity; S.edge = 0.0; S.groove = 0.0;
  #endif
  // geometric arrises (flange bevels, handle edges) from screen-space curvature, per mm
  float curv = length(fwidth(nonPerturbedNormal)) / max(length(fwidth(vViewPosition)), 1e-3);
  S.edge = max(S.edge, smoothstep(0.08, 0.45, curv));

  vec3 seedOff = vec3(uSeed * 17.13, uSeed * -9.71, uSeed * 5.37);
  S.terr = clamp(0.5 + 0.62 * fbm3(S.p / max(uPatchScale, 1.0) + seedOff), 0.0, 1.0);
  // pixel footprint in mm: noise finer than ~2 px would only alias into
  // sparkle, so each band fades to its mean as it drops below the pixel
  float px = length(fwidth(vPatinaPos));
  float grainLod = 1.0 - smoothstep(0.2, 0.6, px / max(uMalachiteScale, 0.3));
  S.grain = clamp(0.5 + 0.6 * grainLod * fbm2(S.p / max(uMalachiteScale, 0.3) - seedOff), 0.0, 1.0);
  S.rec = clamp(mix(0.5, (1.0 - S.cav) * 1.25, uCrevice) + 0.1 * (S.terr - 0.5), 0.0, 1.0);

  // the master dial: each layer arrives at its own point in the burial
  float a = uAge;
  float tarnish = uTarnish * smoothstep(0.0, 0.35, a);
  float cCup = layerCuprite(S, uCuprite * smoothstep(0.12, 0.55, a));
  float cTin = layerTinOxide(S, uTinOxide * smoothstep(0.3, 0.85, a));
  float cMal = layerMalachite(S, uMalachite * smoothstep(0.35, 0.95, a));
  float cAz = layerAzurite(S, uAzurite * smoothstep(0.55, 1.0, a)) * smoothstep(0.0, 0.3, cMal + uAzurite * 0.3);
  float cChl = layerChloride(S, uChloride * smoothstep(0.6, 1.0, a));
  float cEar = layerEarth(S, uEarth * smoothstep(0.55, 1.0, a));
  float wear = layerWear(S, uWear);

  // wear strips from the top down: soil and crust first, then cuprite
  cEar *= 1.0 - wear;
  cMal *= 1.0 - wear * 0.9;
  cAz *= 1.0 - wear * 0.9;
  cChl *= 1.0 - wear;
  cTin *= 1.0 - wear * 0.5;
  cCup *= 1.0 - wear * wear * 0.7;

  // ---- metal
  vec3 col = tt_metalColor(uTin);
  col = mix(col, col * vec3(0.30, 0.24, 0.18), tarnish);
  float rough = mix(0.5, 0.14, uPolish) + 0.18 * tarnish;
  float metal = 1.0;

  // ---- cuprite (thin, semi-metallic sheen)
  vec3 cupCol = mix(vec3(0.075, 0.022, 0.012), vec3(0.045, 0.016, 0.010), S.grain);
  col = mix(col, cupCol, cCup); rough = mix(rough, 0.5, cCup); metal = mix(metal, 0.12, cCup);

  // ---- tin oxide: glossy grey-green to black
  vec3 tinCol = mix(vec3(0.010, 0.013, 0.010), vec3(0.07, 0.085, 0.06), S.terr);
  col = mix(col, tinCol, cTin); rough = mix(rough, 0.3, cTin); metal = mix(metal, 0.0, cTin);

  // ---- carbonates
  vec3 malCol = tt_malachiteColor(uMalachiteHue, S.grain);
  col = mix(col, malCol, cMal); rough = mix(rough, 0.88, cMal); metal = mix(metal, 0.0, cMal);
  vec3 azCol = vec3(0.015, 0.06, 0.30) * (0.7 + 0.6 * S.grain);
  col = mix(col, azCol, cAz); rough = mix(rough, 0.85, cAz); metal = mix(metal, 0.0, cAz);

  // ---- chlorides: pale powdery
  col = mix(col, vec3(0.33, 0.47, 0.32), cChl); rough = mix(rough, 0.97, cChl); metal = mix(metal, 0.0, cChl);

  // ---- soil packed into recesses
  col = mix(col, uEarthColor * (0.7 + 0.5 * S.grain), cEar); rough = mix(rough, 1.0, cEar); metal = mix(metal, 0.0, cEar);

  // ---- black inlay paste in the sunk lines, under any crust
  float inl = uInlay * smoothstep(0.25, 0.7, S.groove) * (1.0 - 0.8 * cMal) * (1.0 - cEar);
  col = mix(col, vec3(0.012, 0.010, 0.009), inl); rough = mix(rough, 0.6, inl); metal = mix(metal, 0.0, inl);

  // ---- crust softens the cast line work, and adds its own lumps
  float crust = clamp(max(max(cMal, cAz), max(cEar * 0.85, cChl * 0.6)), 0.0, 1.0);

  if (uPatinaMode > 0.5) {
    // clay / height: relief only, no patina
    float g = uPatinaMode > 1.5 ? 0.0 : 0.42;
    col = vec3(g); rough = 0.62; metal = 0.0;
    #ifdef PATINA_RELIEF
      if (uPatinaMode > 1.5) totalEmissiveRadiance = vec3(S.h01);
    #else
      if (uPatinaMode > 1.5) totalEmissiveRadiance = vec3(0.12); // no height field: keep plain parts out of the way
    #endif
  } else {
    normal = normalize(mix(normal, nonPerturbedNormal, crust * 0.55));
    normal = tt_bump(normal, crust * (0.08 + 0.16 * S.grain) * grainLod, -vViewPosition);
  }

  diffuseColor.rgb = col;
  roughnessFactor = clamp(rough, 0.04, 1.0);
  metalnessFactor = clamp(metal, 0.0, 1.0);
}
`
