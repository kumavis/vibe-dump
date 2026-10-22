// The table's relief shader (ENGINEERING.md §10, DESIGN.md §5.2): the
// theatre as a printed relief map, the land in a hypsometric tint and the sea
// floor seen through water tinted by its depth, as a bathymetric chart has
// it, both hillshaded from the baked normals rebuilt at the exaggeration of
// the moment, with the chart's isobaths drawn in.
//
// The CDLOD mesh is render/pack.js's, with the Hawaiian geomorph
// (pack.js cdlodMorph) and the single-pack ground (render/shaders/
// ground.glsl.js); three departures from the Hawaiian island terrain
// (R9 §2.3): no sea-floor node is skipped (the floor is the picture), the
// sea bed is not sunk (there is no second surface for it to fight), and the
// normals come baked at uNormalE (18 on the table) so the abyssal plain does
// not terrace once rebuilt near 30.
//
// The sea is not a second surface. The floor is drawn where it lies, and its
// colour is a function of its depth on a log scale (a chart's blues: pale
// over the shelves, a mid blue down the slopes, the abyssal plain deep, the
// trenches darkest), so the Marianas Trench reads dark and the Yellow Sea and
// the Sunda shelf pale; its relief shows through the water less the deeper it
// lies. Isobaths at 200 m (the shelf's edge, a little stronger), 1,000,
// 2,000, 4,000, 6,000 and 8,000 m are drawn as hairlines a pixel wide, each
// fading out where it would crowd (its spacing on screen under a few
// pixels), so the far view keeps the shelf edge and the trenches and the near
// view gains the slopes.
//
// The light is the table's fixed war-room afternoon (render/sky.js WAR_ROOM),
// through the shared lighting model. The front (front.js) lays its held-land
// mask on in applyFront().

import { constants, noise, lighting } from '../render/shaders/common.glsl.js'
import { world } from '../render/shaders/ground.glsl.js'
import { logDepthParsVertex, logDepthVertex, logDepthParsFragment, logDepthFragment } from '../render/shaders/logdepth.glsl.js'
import { cdlodMorph } from '../render/pack.js'

export const reliefVertex = /* glsl */ `
${constants}
${world}
${logDepthParsVertex}
in vec4 aNode; // x0, z0, size, lod
uniform vec2 uMorph[12];
uniform float uGrid;
uniform vec3 uCamPos;
out vec3 vWorld;
out float vMetres;
float packMetres(vec2 xz) { return archMetres(xz); }

void main() {
${cdlodMorph}
  vMetres = mt;
  vWorld = vec3(xz.x, mt * uVert, xz.y);
  gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
  ${logDepthVertex}
}
`

/** The tints and the isobaths, shared by the relief and anything that wants the chart's colour at a depth. */
export const chart = /* glsl */ `
vec3 srgb(vec3 c) { return pow(c, vec3(2.2)); }

// The land's tint by height, a relief map's: a sage lowland, the olive and
// sand of the hills, the browns of the ranges, grey rock, snow.
vec3 hypsometric(float m) {
  vec3 c = srgb(vec3(0.56, 0.63, 0.47));
  c = mix(c, srgb(vec3(0.66, 0.67, 0.48)), smoothstep(30.0, 300.0, m));
  c = mix(c, srgb(vec3(0.77, 0.71, 0.53)), smoothstep(300.0, 900.0, m));
  c = mix(c, srgb(vec3(0.70, 0.57, 0.42)), smoothstep(900.0, 2000.0, m));
  c = mix(c, srgb(vec3(0.57, 0.50, 0.44)), smoothstep(2000.0, 3600.0, m));
  c = mix(c, srgb(vec3(0.80, 0.79, 0.78)), smoothstep(3800.0, 5200.0, m));
  c = mix(c, srgb(vec3(0.96, 0.96, 0.97)), smoothstep(5200.0, 6500.0, m));
  return c;
}

// The water's tint by depth, on a log scale of depth: a pale sea-glass over
// the shelf, a clear mid blue down the slope, a quiet slate blue on the
// abyssal plain, the trenches near ink.
vec3 bathymetric(float depth) {
  float t = log(1.0 + max(depth, 0.0) / 40.0) / log(1.0 + 11000.0 / 40.0);
  vec3 c = srgb(vec3(0.80, 0.90, 0.89));
  c = mix(c, srgb(vec3(0.56, 0.75, 0.82)), smoothstep(0.06, 0.34, t));
  c = mix(c, srgb(vec3(0.27, 0.46, 0.63)), smoothstep(0.34, 0.66, t));
  c = mix(c, srgb(vec3(0.14, 0.26, 0.40)), smoothstep(0.66, 0.86, t));
  c = mix(c, srgb(vec3(0.105, 0.20, 0.33)), smoothstep(0.86, 0.92, t));
  c = mix(c, srgb(vec3(0.03, 0.06, 0.14)), smoothstep(0.925, 0.985, t));
  return c;
}

// An isobath at \`level\` metres as a hairline (fw: the depth's change per
// pixel), gone where lines that far apart would crowd closer than a few
// pixels (gap: the spacing to its neighbours, metres).
float isobath(float d, float level, float fw, float gap) {
  float line = 1.0 - smoothstep(0.35 * fw, 1.25 * fw, abs(d - level));
  return line * (1.0 - smoothstep(0.06 * gap, 0.22 * gap, fw));
}
float isobaths(float d, float fw) {
  float a = isobath(d, 200.0, fw, 800.0) * 1.35;
  a = max(a, isobath(d, 1000.0, fw, 800.0));
  a = max(a, isobath(d, 2000.0, fw, 1000.0));
  a = max(a, isobath(d, 4000.0, fw, 2000.0));
  a = max(a, isobath(d, 6000.0, fw, 2000.0));
  a = max(a, isobath(d, 8000.0, fw, 2000.0));
  return a;
}
`

export const reliefFragment = /* glsl */ `
${constants}
${noise}
${world}
${lighting}
${logDepthParsFragment}
uniform sampler2D uOwnN;   // normals at uNormalE (rgb), ambient occlusion (a)
uniform vec4 uOwnRect;
uniform int uDebug;
uniform float uIso;        // the isobaths' strength (0 hides them)
in vec3 vWorld;
in float vMetres;

${chart}

// (front.js: the front's held land, hatched where contested)
vec3 applyFront(vec3 col, vec2 xz, float metres, float landK) { return col; }

void main() {
  ${logDepthFragment}
  vec2 xz = vWorld.xz;
  vec2 uv = rectUv(uOwnRect, xz);
  vec4 nt = texture(uOwnN, uv);
  vec2 grad = normalGrad(nt.xyz);
  vec3 n = normalize(vec3(-grad.x * uExag, 1.0, -grad.y * uExag));
  float ao = mix(1.0, nt.a, 0.6);
  float m = vMetres;
  // the hillshade: 1 on flat ground, brighter facing the light, darker away
  float level = max(uSunDir.y, 0.15);
  float hs = clamp(dot(n, uSunDir) / level, 0.0, 2.2);

  // --- land ------------------------------------------------------------------
  vec3 land = shade(hypsometric(m), n, vWorld, ao, 1.0);

  // --- sea: the floor through depth-tinted water ------------------------------
  float depth = -m;
  vec3 tint = bathymetric(depth);
  vec3 light = uSunColor * max(uSunDir.y, 0.0) * 0.55 + uSkyColor * 1.5;
  // the floor's relief reads through the water, less in the deeps
  float relief = mix(1.0, hs, 0.62 - 0.27 * smoothstep(1000.0, 8000.0, depth));
  vec3 sea = tint * light * relief * mix(1.0, ao, 0.5);
  // a sandy floor shows through the first few tens of metres
  vec3 sand = shade(srgb(vec3(0.84, 0.80, 0.66)), n, vWorld, ao, 1.0);
  sea = mix(sand, sea, smoothstep(0.0, 60.0, depth) * 0.72 + 0.28);
  // the chart's isobaths: a little darker than the water they cross
  float fw = max(fwidth(depth), 1e-3);
  sea *= 1.0 - 0.2 * uIso * isobaths(depth, fw);

  float w = max(fwidth(m), 1e-3);
  float landK = smoothstep(-w, w, m);
  vec3 col = mix(sea, land, landK);
  col = applyFront(col, xz, m, landK);
  if (uDebug == 2) col = n * 0.5 + 0.5;
  if (uDebug == 3) col = vec3(ao);
  if (uDebug == 4) col = vec3(hs * 0.5);
  gl_FragColor = vec4(col, 1.0);
}
`
