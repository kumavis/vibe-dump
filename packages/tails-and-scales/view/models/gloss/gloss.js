// The Ssithra's glossy finish: the materials every smooth serpent figure (serpents.js) is painted with.
//
//   env()               a small procedural studio sky (a 256x128 equirect HalfFloat texture, made on the CPU,
//                       no renderer needed, linear-filterable on every WebGL2 device): a DIM dome, a bright
//                       horizon band, two crisp light panels and the sun, the table's green below. three
//                       turns it into a PMREM itself the first time a material samples it. The stage has no
//                       scene.environment (and setting one would change every other material on the table),
//                       so each glossy material carries this as its own envMap. It is for reflections: its
//                       diffuse light is cut to 0.45 (uEnvDiffuse) so a figure's paint reads as the classic
//                       figures'. Made with the first glossy material, never as the module loads: three.js
//                       draws Math.random for every texture's uuid, and the table is painted from Math.random
//                       as the page loads (view/index.js), so a page drawing the classic figures (cache.js's
//                       style) makes none and draws as it did before this module was in the bundle.
//   skin(opts)          the scaled skin: MeshPhysicalMaterial (vertex colours, clearcoat) whose shader grows
//                       scales out of object-space position and normal (a 3D cellular pattern: no UVs), domes
//                       each scale in the normal and washes its edges darker. The coat follows the scales, the
//                       env reflects at about a third and only its hot spots (sGate: the sun, the window's
//                       core; the dim dome and the horizon band hardly at all), the base's own specular is
//                       low, and the rim is half in the skin's own hue, so the lacquer reads as the skin's
//                       own surface, not as glass or jelly laid over the markings
//   belly(opts)         the belly scutes' lacquer: the same, without cells (the scutes are geometry)
//   gloss(color, opts)  everything else that shines: horn, bone, wood, eyes (clearcoated)
//   satinMetal(color)   brass or bronze that is mostly its own colour (the shield's face: polished metal
//                       mirrors the dark table)
//   polished(color)     metal: brass, gold, steel (metalness 1, it needs the env map to read as metal)
//   glow(color)         emissive gems and venom
//
// Every one of them shares one onBeforeCompile patch with a level of detail on the SCREEN FOOTPRINT
// (prototype C's tgSmall, here per vertex from the depth and the projection, in the figure's own units per
// CSS pixel, so it is the same at any device pixel ratio and for a brute scaled 2.15 as for a scaleguard):
// as a figure shrinks toward 28 px the coat and base roughen, the env and window reflections dim, the
// scales fade out and the markings fade toward the skin's plain colour, so a small figure shows one soft
// highlight instead of a scatter of glints. And with it, two terms from the splat Bushtails' shading, so
// the two armies share a light: a warm rim (rr³) and the lavender shadow lift (the key light comes back
// into the shadow side tinted lavender instead of going dark).
import * as THREE from 'three'

// ── The environment: sky, horizon, table ───────────────────────────────────
const EW = 256, EH = 128
function makeEnv() {
  const data = new Uint16Array(EW * EH * 4)
  const half = THREE.DataUtils.toHalfFloat
  // A studio more than a sky: a DIM dome (so a lacquer's 4% reflection at facing angles doesn't haze a
  // dark paint), a bright band at the horizon (the line every glossy curve shows), and a few hot, crisp
  // panels for the gloss to catch: a broad window up behind the table's camera, a cool rim panel where
  // the fill light is, and the sun.
  const zen = new THREE.Color('#7f9fd6').multiplyScalar(0.3), sky = new THREE.Color('#b9c8de').multiplyScalar(0.32), hor = new THREE.Color('#fff2dc').multiplyScalar(0.9)
  const gnd = new THREE.Color('#6a7f4e').multiplyScalar(0.4), deep = new THREE.Color('#3c4529').multiplyScalar(0.3)
  const sun = new THREE.Vector3(-20, 40, 18).normalize()
  const panel = (axis, up, w, h, soft) => {
    const z = axis.clone().normalize(), x = new THREE.Vector3().crossVectors(up, z).normalize(), y = new THREE.Vector3().crossVectors(z, x)
    return (d) => {
      const f = d.dot(z)
      if (f <= 0) return 0
      const u = Math.abs(d.dot(x) / f), v = Math.abs(d.dot(y) / f)
      return THREE.MathUtils.smoothstep(w - u, 0, soft) * THREE.MathUtils.smoothstep(h - v, 0, soft)
    }
  }
  const Y = new THREE.Vector3(0, 1, 0)
  const win = panel(new THREE.Vector3(10, 22, 30), Y, 0.34, 0.2, 0.03) // the window, warm white
  const rim = panel(new THREE.Vector3(20, 12, -20), Y, 0.5, 0.16, 0.05) // the rim panel, cool
  const d = new THREE.Vector3(), c = new THREE.Color()
  for (let j = 0; j < EH; j++) {
    const th = ((j + 0.5) / EH - 0.5) * Math.PI
    for (let i = 0; i < EW; i++) {
      const ph = ((i + 0.5) / EW - 0.5) * Math.PI * 2
      d.set(Math.cos(th) * Math.cos(ph), Math.sin(th), Math.cos(th) * Math.sin(ph))
      const y = d.y
      if (y >= 0) {
        // the dome: a bright band at the horizon, dim and bluer overhead
        c.copy(hor).lerp(sky, THREE.MathUtils.smoothstep(y, 0.02, 0.14)).lerp(zen, Math.pow(Math.max(0, (y - 0.14) / 0.86), 0.8))
        const w = win(d), r = rim(d)
        c.r += 2.6 * w + 1.0 * r, c.g += 2.5 * w + 1.15 * r, c.b += 2.3 * w + 1.4 * r
        // the sun, small and hot, with a halo
        const s = d.dot(sun)
        c.addScalar(40 * THREE.MathUtils.smoothstep(s, 0.9985, 0.9994) + 0.4 * Math.pow(Math.max(0, s), 64))
      } else {
        // the table: green, darkening away from the horizon
        c.copy(gnd).lerp(deep, Math.min(1, -y / 0.4))
      }
      const o = (j * EW + i) * 4
      data[o] = half(c.r), data[o + 1] = half(c.g), data[o + 2] = half(c.b), data[o + 3] = half(1)
    }
  }
  // (HalfFloat, not Float: a float texture can't be linearly filtered without OES_texture_float_linear,
  // which many WebGL2 devices lack; a half float always can)
  const t = new THREE.DataTexture(data, EW, EH, THREE.RGBAFormat, THREE.HalfFloatType)
  t.mapping = THREE.EquirectangularReflectionMapping
  t.magFilter = t.minFilter = THREE.LinearFilter
  t.colorSpace = THREE.LinearSRGBColorSpace
  t.needsUpdate = true
  return t
}
let ENV = null
export const env = () => (ENV ??= makeEnv())

// ── The level of detail's one global: the viewport's height in CSS pixels ─────
// (set from the renderer before each draw of a glossy material: the drawing buffer's height divided by
// the pixel ratio, so the footprint is the same at DPR 1 and 2)
const VIEW_H = { value: 800 }
const _vp = new THREE.Vector4()
function viewH(renderer) {
  renderer.getCurrentViewport(_vp)
  VIEW_H.value = Math.max(1, _vp.w / (renderer.getRenderTarget() ? 1 : renderer.getPixelRatio()))
}

// ── The skin shader ────────────────────────────────────────────────────────
// Everything a skin pass needs from the vertex shader is the object-space position and normal (so it
// survives bake.js, which keeps both, in the figure's space), and, for the skin, its plain colour.
const VERT_PARS = /* glsl */ `
varying vec3 vObjPos;
varying vec3 vObjN;
varying float vSmall;
uniform float uViewH, uLodScale;
#ifdef SKIN_PLAIN
attribute vec3 plain;
varying vec3 vPlain;
#endif
`
const VERT_MAIN = /* glsl */ `
vObjPos = position;
vObjN = normal;
#ifdef SKIN_PLAIN
vPlain = plain;
#endif
`
// after project_vertex: the figure's own units per CSS pixel here (its model matrix carries only the
// figure's scale: serpents.js folds every part's own scale into its geometry), 0 close up → 1 at 28 px
const VERT_LOD = /* glsl */ `
{
  float objScale = max(length(modelMatrix[0].xyz) * uLodScale, 1e-4);
  float depth = isOrthographic ? 1.0 : max(-mvPosition.z, 1e-3);
  float foot = 2.0 * depth / (projectionMatrix[1][1] * uViewH * objScale);
  vSmall = smoothstep(0.009, 0.03, foot);
}
`
const FRAG_PARS = /* glsl */ `
varying vec3 vObjPos;
varying vec3 vObjN;
varying float vSmall;
#ifdef SKIN_PLAIN
varying vec3 vPlain;
#endif
uniform mat3 normalMatrix;
uniform float uScaleFreq, uBump, uWash, uCrease, uCellTone, uCoatFollow, uEnvDiffuse, uKeel;
uniform float uEnvSpec, uEnvCoat, uLodEnv, uLodRough, uLodCoatRough, uLodCoat, uMarkFade, uRim, uRimPow, uRimTint, uLift;
uniform vec3 uRimColor;
uniform float uEnvFloor, uEnvKnee;
// the env's reflection gated by its own brightness: the hot spots (the window, the rim panel, the sun) reflect
// in full; the broad, dim rest (the dome, the horizon band, the table) only at uEnvFloor. On a skin, a dim
// reflection spread over a broad curve is a translucent veil over the markings (glass, jelly); a lacquer
// shows its light sources and its colour (1: no gate)
vec3 sGate(vec3 r) {
  return r * mix(uEnvFloor, 1.0, smoothstep(uEnvKnee, 2.0 * uEnvKnee, dot(r, vec3(0.2126, 0.7152, 0.0722))));
}
// Dave Hoskins' hash without sine (fract-based: the same on every GPU, no precision cliff for large p)
vec3 sHash3(vec3 p3) {
  p3 = fract(p3 * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yxz + 33.33);
  return fract((p3.xxy + p3.yxx) * p3.zyx);
}
// a 3D cellular pattern: the nearest cell's centre, and the nearest two distances
void sCells(vec3 x, out vec3 c1, out float d1, out float d2) {
  vec3 i = floor(x), f = fract(x);
  d1 = 9.0; d2 = 9.0; c1 = vec3(0.0);
  for (int k = -1; k <= 1; k++) for (int j = -1; j <= 1; j++) for (int l = -1; l <= 1; l++) {
    vec3 g = vec3(float(l), float(j), float(k));
    vec3 o = g + 0.5 + 0.75 * (sHash3(i + g) - 0.5);
    vec3 r = o - f;
    float d = dot(r, r);
    if (d < d1) { d2 = d1; d1 = d; c1 = i + o; } else if (d < d2) { d2 = d; }
  }
  d1 = sqrt(d1); d2 = sqrt(d2);
}
`
// after color_fragment: the markings fade toward the plain skin as the figure shrinks
const FRAG_PLAIN = /* glsl */ `
#ifdef SKIN_PLAIN
diffuseColor.rgb = mix(diffuseColor.rgb, diffuse * vPlain, uMarkFade * vSmall);
#endif
`
// after normal_fragment_maps: `normal` is the smooth view-space normal, diffuseColor holds the paint
const FRAG_SCALES = /* glsl */ `
#ifdef SKIN_SCALES
{
  vec3 sp = vObjPos * uScaleFreq;
  // how many pixels a scale spans: the pattern fades out below ~4 px (no shimmer at game scale), and with
  // the figure's footprint; it isn't computed at all once it's gone
  float cellPx = 1.0 / max(length(fwidth(sp)), 1e-4);
  float vis = smoothstep(2.5, 6.0, cellPx) * (1.0 - smoothstep(0.0, 0.6, vSmall));
  if (vis > 0.0) {
  vec3 c1; float d1, d2;
  sCells(sp, c1, d1, d2);
  vec3 on = normalize(vObjN);
  vec3 g = sp - c1;
  g -= on * dot(g, on);
  // each scale a low dome, and keeled: overlapping downward like shingles (its lower edge stands proud)
  vec3 dn = g * uBump;
  vec3 down = vec3(0.0, -1.0, 0.0) - on * dot(vec3(0.0, -1.0, 0.0), on);
  dn += down * uKeel * (0.5 - clamp(d1, 0.0, 1.0));
  normal = normalize(normal + vis * (normalMatrix * dn));
  // the wash: the seams between scales sit darker, as paint pools there; each scale a touch its own tone
  float seam = smoothstep(0.0, uCrease, d2 - d1);
  float tone = 1.0 + uCellTone * (sHash3(c1 + 17.0).x - 0.5);
  float k = mix(uWash, 1.06, seam) * tone;
  diffuseColor.rgb *= mix(1.0, k, vis);
  roughnessFactor = mix(roughnessFactor, min(1.0, roughnessFactor + 0.35 * (1.0 - seam)), vis);
  }
}
#endif
`
// after lights_physical_fragment: a small figure's coat and base roughen (one soft highlight, not glints)
const FRAG_ROUGH = /* glsl */ `
material.roughness = mix(material.roughness, max(material.roughness, uLodRough), vSmall);
#ifdef USE_CLEARCOAT
material.clearcoatRoughness = mix(material.clearcoatRoughness, max(material.clearcoatRoughness, uLodCoatRough), vSmall);
material.clearcoat *= 1.0 - uLodCoat * vSmall;
#endif
`
// after lights_fragment_end: the splat Bushtails' two terms, under the strongest directional light
const FRAG_RIM = /* glsl */ `
#if NUM_DIR_LIGHTS > 0
{
  vec3 sKey = vec3(0.0), sDir = vec3(0.0, 1.0, 0.0);
  float sLum = 0.0;
  for (int i = 0; i < NUM_DIR_LIGHTS; i++) {
    float l = dot(directionalLights[i].color, vec3(0.2126, 0.7152, 0.0722));
    if (l > sLum) { sLum = l; sKey = directionalLights[i].color; sDir = directionalLights[i].direction; }
  }
  float sNL = dot(geometryNormal, sDir);
  // the shadow side keeps some of the key light, lavender (the splat's vec3(0.40, 0.32, 0.58) lift)
  reflectedLight.indirectDiffuse += material.diffuseColor * sKey * RECIPROCAL_PI * uLift * vec3(0.40, 0.32, 0.58) * (1.0 - smoothstep(-0.1, 0.35, sNL));
  // the warm rim, softer on a small figure (uRimTint: in the surface's own hue instead, at full value, so
  // a dark paint's rim is its colour brightened, not a pale fringe)
  float sRr = 1.0 - saturate(dot(geometryNormal, geometryViewDir));
  vec3 sHue = material.diffuseColor / max(max(material.diffuseColor.r, max(material.diffuseColor.g, material.diffuseColor.b)), 1e-3);
  reflectedLight.indirectSpecular += mix(uRimColor, uRimColor * sHue, uRimTint) * pow(sRr, uRimPow) * uRim * (1.0 - 0.6 * vSmall) * sLum * RECIPROCAL_PI;
}
#endif
`

// (the chunk is inlined: onBeforeCompile sees #include lines, not their text)
function swap(src, a, b) {
  if (!src.includes(a)) throw new Error(`gloss.js: three changed its shader chunks (no "${a}")`)
  return src.replace(a, b)
}
let LIGHTS_MAPS = THREE.ShaderChunk.lights_fragment_maps
LIGHTS_MAPS = swap(LIGHTS_MAPS, 'iblIrradiance += getIBLIrradiance( geometryNormal );', 'iblIrradiance += uEnvDiffuse * getIBLIrradiance( geometryNormal );')
LIGHTS_MAPS = swap(LIGHTS_MAPS, 'radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );', 'radiance += sEnvK * uEnvSpec * sGate( getIBLRadiance( geometryViewDir, geometryNormal, material.roughness ) );')
LIGHTS_MAPS = swap(LIGHTS_MAPS, 'clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );', 'clearcoatRadiance += sEnvK * uEnvCoat * sGate( getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness ) );')
LIGHTS_MAPS = 'float sEnvK = 1.0 - uLodEnv * vSmall;\n' + LIGHTS_MAPS

// the shader's parameters (each a uniform): the scales, the env's three strengths, the level of detail,
// the rim and the lift
const SKIN_PARAMS = {
  uScaleFreq: 52, uBump: 0.5, uWash: 0.8, uCrease: 0.1, uCellTone: 0.1, uCoatFollow: 0.7, uKeel: 0.45,
  uEnvDiffuse: 0.45, uEnvSpec: 1, uEnvCoat: 1, uEnvFloor: 1, uEnvKnee: 1,
  uLodEnv: 0.75, uLodRough: 0.62, uLodCoatRough: 0.42, uLodCoat: 0.35, uMarkFade: 0.9, uLodScale: 1,
  uRim: 0.22, uRimPow: 3, uRimTint: 0, uRimColor: [1.0, 0.86, 0.66], uLift: 0.35,
}

function patch(mat, { scales = false, plain = false, params = {} } = {}) {
  const u = { ...SKIN_PARAMS, ...params }
  mat.userData.shader = { scales, plain, ...u }
  mat.onBeforeCompile = (sh) => {
    for (const [k, v] of Object.entries(u)) sh.uniforms[k] = { value: Array.isArray(v) ? new THREE.Vector3(...v) : v }
    sh.uniforms.uViewH = VIEW_H
    const defs = (scales ? '#define SKIN_SCALES\n' : '') + (plain ? '#define SKIN_PLAIN\n' : '')
    let vs = defs + sh.vertexShader
    vs = swap(vs, '#include <common>', '#include <common>\n' + VERT_PARS)
    vs = swap(vs, '#include <begin_vertex>', '#include <begin_vertex>\n' + VERT_MAIN)
    vs = swap(vs, '#include <project_vertex>', '#include <project_vertex>\n' + VERT_LOD)
    let fs = defs + sh.fragmentShader
    fs = swap(fs, '#include <common>', '#include <common>\n' + FRAG_PARS)
    fs = swap(fs, '#include <color_fragment>', '#include <color_fragment>\n' + FRAG_PLAIN)
    fs = swap(fs, '#include <normal_fragment_maps>', '#include <normal_fragment_maps>\n' + FRAG_SCALES)
    // the coat follows the scales most of the way: one lacquer over the skin, each scale catching its own
    // glint, so the reflections are the skin's, not a sheet of glass over it
    fs = swap(fs, '#include <clearcoat_normal_fragment_maps>', '#include <clearcoat_normal_fragment_maps>\n#ifdef USE_CLEARCOAT\nclearcoatNormal = normalize(mix(nonPerturbedNormal, normal, uCoatFollow));\n#endif\n')
    fs = swap(fs, '#include <lights_physical_fragment>', '#include <lights_physical_fragment>\n' + FRAG_ROUGH)
    fs = swap(fs, '#include <lights_fragment_maps>', LIGHTS_MAPS)
    fs = swap(fs, '#include <lights_fragment_end>', '#include <lights_fragment_end>\n' + FRAG_RIM)
    // (the coat hides the base only as much as it reflects: with its env reflection dimmed, three's full
    // Fresnel hiding turned every grazing edge dark, a bottle-glass outline)
    fs = swap(fs, 'outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc )', 'outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc * min( 1.0, uEnvCoat * sEnvK + 0.1 ) )')
    sh.vertexShader = vs
    sh.fragmentShader = fs
  }
  mat.onBeforeRender = viewH
  mat.customProgramCacheKey = () => `ssithra-${scales ? 1 : 0}${plain ? 1 : 0}`
  return mat
}

// one material per finish, shared by every figure (as kit.js's M is)
const cache = new Map()
const once = (key, make) => {
  if (!cache.has(key)) cache.set(key, make())
  return cache.get(key)
}

// skin({ iridescence, ...shader params }): the body, head, arms and hood
export function skin(opts = {}) {
  return once('skin' + JSON.stringify(opts), () => {
    const { iridescence = 0, clearcoatRoughness = 0.13, specularIntensity = 0.3, ...params } = opts
    const m = new THREE.MeshPhysicalMaterial({
      color: '#ffffff', vertexColors: true, roughness: 0.5, metalness: 0, specularIntensity,
      clearcoat: 1, clearcoatRoughness, envMap: env(), envMapIntensity: 1.0,
      iridescence, iridescenceIOR: 1.6, iridescenceThicknessRange: [180, 420],
    })
    // (the env at about a third on both layers, and gated: only its hot spots reflect, the sun and the
    // brightest of the window, so a broad curve (the brute's coil) carries no dim veil of sky, horizon or
    // window over its markings; the base's own specular low (0.3): the coat is the gloss, a broad base
    // sheen over the paint is what reads as glass. The rim thinner and half in the skin's own hue, so it
    // brightens the colour at the silhouette instead of fringing it pale, a jelly's or a glass's edge.)
    return patch(m, { scales: true, plain: true, params: { uEnvSpec: 0.35, uEnvCoat: 0.3, uEnvFloor: 0.1, uEnvKnee: 3, uRimPow: 4, uRimTint: 0.6, ...params } })
  })
}
export function belly(opts = {}) {
  return once('belly' + JSON.stringify(opts), () => {
    const m = new THREE.MeshPhysicalMaterial({
      color: '#ffffff', vertexColors: true, roughness: 0.36, metalness: 0, specularIntensity: 0.6,
      clearcoat: 1, clearcoatRoughness: 0.07, envMap: env(), envMapIntensity: 1.0,
    })
    return patch(m, { params: { uEnvSpec: 0.6, uEnvCoat: 0.65, ...opts } })
  })
}
export function gloss(color, opts = {}) {
  return once('gloss' + color + JSON.stringify(opts), () => {
    const { shader = {}, ...o } = opts
    return patch(new THREE.MeshPhysicalMaterial({ color, roughness: 0.4, metalness: 0, clearcoat: 0.8, clearcoatRoughness: 0.12, envMap: env(), envMapIntensity: 1.0, ...o }), { params: shader })
  })
}
// metal that is mostly its own colour: a bronze face lit by the sun, not a mirror of the table
export function satinMetal(color, opts = {}) {
  return once('satin' + color + JSON.stringify(opts), () =>
    patch(new THREE.MeshPhysicalMaterial({ color, roughness: 0.42, metalness: 0.35, clearcoat: 0.5, clearcoatRoughness: 0.18, envMap: env(), envMapIntensity: 1.0, ...opts }), { params: { uEnvDiffuse: 0.7, uRim: 0.12 } }))
}
export function polished(color, opts = {}) {
  return once('metal' + color + JSON.stringify(opts), () =>
    patch(new THREE.MeshPhysicalMaterial({ color, roughness: 0.22, metalness: 1, envMap: env(), envMapIntensity: 2.2, clearcoat: 0.4, clearcoatRoughness: 0.08, ...opts }), { params: { uEnvDiffuse: 1, uRim: 0.1, uLift: 0.15 } }))
}
export function glow(color, opts = {}) {
  return once('glow' + color + JSON.stringify(opts), () =>
    patch(new THREE.MeshPhysicalMaterial({ color, emissive: color, emissiveIntensity: 1.6, roughness: 0.15, clearcoat: 1, clearcoatRoughness: 0.05, envMap: env(), envMapIntensity: 1.0, ...opts }), { params: { uRim: 0, uLift: 0 } }))
}

// ── Baking (view/models/bake.js) ───────────────────────────────────────────
// What a glossy part's class adds to bake.js's classKey (the physical parameters, and the shader's), and
// the vertex-coloured material a glossy class is drawn with: the same finish, its colour moved into the
// vertices.
const PHYSICAL = ['type', 'clearcoat', 'clearcoatRoughness', 'specularIntensity', 'iridescence', 'envMapIntensity']
export const isGlossy = (m) => !!m.userData.shader
export function finishFields(m) {
  return [...PHYSICAL.map((k) => m[k]), JSON.stringify(m.userData.shader ?? null)]
}
const classes = new Map()
export function classMaterial(key, m) {
  if (!classes.has(key)) {
    const c = m.clone()
    c.color.set('#ffffff')
    c.vertexColors = true
    const { scales, plain, ...params } = m.userData.shader
    patch(c, { scales, plain, params })
    classes.set(key, c)
  }
  return classes.get(key)
}
