// The table's relief shader (ENGINEERING.md §10): the theatre as a relief
// map, the land in a hypsometric tint and the sea floor seen through water
// tinted by its depth, as a printed bathymetric chart has it, both
// hillshaded from the baked normals rebuilt at the exaggeration of the moment.
//
// The CDLOD mesh is render/pack.js's, with the Hawaiian geomorph
// (pack.js cdlodMorph) and the single-pack ground (render/shaders/
// ground.glsl.js); three departures from the Hawaiian island terrain
// (R9 §2.3): no sea-floor node is skipped (the floor is the picture), the
// sea bed is not sunk (there is no second surface for it to fight), and the
// normals come baked at uNormalE (18 on the table) so the abyssal plain does
// not terrace once rebuilt near 30. The chart sea is not a second surface:
// the floor is drawn where it lies, its colour a function of its depth, so
// the Marianas Trench reads dark and the shelves pale.
//
// The light is the table's fixed war-room afternoon (render/sky.js WAR_ROOM),
// through the shared lighting model. Stage 0 draws the relief alone; the
// front's held-land mask, cross-faded by the WarClock's frontPair, is the
// table workflow's to lay on in applyFront().

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

export const reliefFragment = /* glsl */ `
${constants}
${noise}
${world}
${lighting}
${logDepthParsFragment}
uniform sampler2D uOwnN;   // normals at uNormalE (rgb), ambient occlusion (a)
uniform vec4 uOwnRect;
uniform int uDebug;
in vec3 vWorld;
in float vMetres;

vec3 srgb(vec3 c) { return pow(c, vec3(2.2)); }

// The land's tint by height, a relief map's: a sage lowland, the olive and
// sand of the hills, the browns of the ranges, grey rock, snow.
vec3 hypsometric(float m) {
  vec3 c = srgb(vec3(0.55, 0.62, 0.44));
  c = mix(c, srgb(vec3(0.66, 0.67, 0.46)), smoothstep(30.0, 300.0, m));
  c = mix(c, srgb(vec3(0.78, 0.72, 0.52)), smoothstep(300.0, 900.0, m));
  c = mix(c, srgb(vec3(0.71, 0.57, 0.40)), smoothstep(900.0, 2000.0, m));
  c = mix(c, srgb(vec3(0.57, 0.49, 0.42)), smoothstep(2000.0, 3600.0, m));
  c = mix(c, srgb(vec3(0.80, 0.79, 0.78)), smoothstep(3800.0, 5200.0, m));
  c = mix(c, srgb(vec3(0.96, 0.96, 0.97)), smoothstep(5200.0, 6500.0, m));
  return c;
}

// The water's tint by depth, a chart's blues on a log scale of depth: pale
// over the shelves, a mid blue down the slopes, the abyssal plain deep, the
// trenches darkest.
vec3 bathymetric(float depth) {
  float t = log(1.0 + max(depth, 0.0) / 40.0) / log(1.0 + 11000.0 / 40.0);
  vec3 c = srgb(vec3(0.72, 0.86, 0.87));
  c = mix(c, srgb(vec3(0.50, 0.71, 0.80)), smoothstep(0.08, 0.38, t));
  c = mix(c, srgb(vec3(0.31, 0.51, 0.68)), smoothstep(0.38, 0.72, t));
  c = mix(c, srgb(vec3(0.19, 0.34, 0.53)), smoothstep(0.72, 0.9, t));
  c = mix(c, srgb(vec3(0.07, 0.14, 0.28)), smoothstep(0.92, 0.985, t));
  return c;
}

// (the table workflow's: the front's held land, hatched where contested)
vec3 applyFront(vec3 col, vec2 xz, float metres) { return col; }

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
  float relief = mix(1.0, hs, 0.6 - 0.25 * smoothstep(1000.0, 8000.0, depth));
  vec3 sea = tint * light * relief * mix(1.0, ao, 0.5);
  // a sandy floor shows through the first few tens of metres
  vec3 sand = shade(srgb(vec3(0.82, 0.78, 0.64)), n, vWorld, ao, 1.0);
  sea = mix(sand, sea, smoothstep(0.0, 60.0, depth) * 0.75 + 0.25);

  float w = max(fwidth(m), 1e-3);
  vec3 col = mix(sea, land, smoothstep(-w, w, m));
  col = applyFront(col, xz, m);
  if (uDebug == 2) col = n * 0.5 + 0.5;
  if (uDebug == 3) col = vec3(ao);
  if (uDebug == 4) col = vec3(hs * 0.5);
  gl_FragColor = vec4(col, 1.0);
}
`
