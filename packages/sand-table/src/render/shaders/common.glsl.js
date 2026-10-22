// GLSL shared by every surface in the scene: noise, the one lighting model,
// and the ground itself, read from whichever packs are resident.
//
// The ground is the archipelago pack everywhere, with up to SLOTS island packs
// laid over it. Each island slot has a rect and a detail weight k (0..1): where
// a slot owns a point its own heights show through by k, eased to nothing over
// a margin inside its edge, so at k = 0 an island pack is exactly the
// archipelago and it can come and go without a seam or a pop. Where two island
// rects overlap (Maui's padding reaches Kahoʻolawe) the point belongs to the
// one whose edge is further away. render/world.js keeps a CPU copy of all of
// this (metresAt), line for line, for the camera, picking and pins.

import { NEAR_EXAG, NORMAL_EXAG, SLOTS, PATCHES, DIST_PATCHES } from '../../config.js'

const f = (v) => (Number.isInteger(v) ? v.toFixed(1) : String(v))

// The district's feature indices (aux map alpha): loʻi from 1, fishponds from
// DIST_POND, the rest (the village) from DIST_OTHER, up to 63; and the levels
// the year lays its ground at: just above the tide where a lower patch fills
// a channel dug since (district-decode.js PATCH_FILL; the reef flat a patch
// sinks to or lifts to is its own `depth`), still water in a pond.
export const DIST_INDEX = { loi: 1, pond: 24, other: 48, max: 63 }
export const DIST_FILL = 0.5
export const DIST_POND_LEVEL = -0.6
// a loʻi terrace's smallest step, metres (district-decode.js BASE; the others double it)
export const DIST_BASE = 0.5625

export const constants = /* glsl */ `
#define PI 3.14159265
#define NEAR_E ${f(NEAR_EXAG)}
#define NORMAL_E ${f(NORMAL_EXAG)}
#define SLOTS ${SLOTS}
#define PATCHES ${PATCHES}
#define DIST_PATCHES ${DIST_PATCHES}
#define DIST_POND ${DIST_INDEX.pond}
#define DIST_OTHER ${DIST_INDEX.other}
#define DIST_FILL ${f(DIST_FILL)}
#define DIST_POND_LEVEL ${f(DIST_POND_LEVEL)}
#define DIST_BASE ${f(DIST_BASE)}
`

export const noise = /* glsl */ `
float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1, 0)), u.x), mix(hash12(i + vec2(0, 1)), hash12(i + vec2(1, 1)), u.x), u.y);
}
// value noise faded to its mean once a cell is smaller than a couple of
// pixels (q: cells per pixel), where it would only sparkle; a camera that
// spans 600 km and 1 km needs this everywhere
float vnoiseF(vec2 p, float q) {
  float k = smoothstep(0.25, 0.6, q);
  return k >= 1.0 ? 0.5 : mix(vnoise(p), 0.5, k);
}
float fbm2(vec2 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { s += a * vnoise(p); p = p * 2.03 + 17.1; a *= 0.5; }
  return s;
}
// fbm2 with each octave faded as vnoiseF (q: first-octave cells per pixel)
float fbm2F(vec2 p, float q) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { s += a * vnoiseF(p, q); p = p * 2.03 + 17.1; a *= 0.5; q *= 2.03; }
  return s;
}
vec3 voronoi(vec2 p) {
  vec2 n = floor(p);
  vec2 f = fract(p);
  float d1 = 8.0, d2 = 8.0;
  float id = 0.0;
  for (int j = -1; j <= 1; j++)
  for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j));
    vec2 o = hash22(n + g);
    vec2 r = g + o - f;
    float d = dot(r, r);
    if (d < d1) { d2 = d1; d1 = d; id = hash12(n + g + 3.7); }
    else if (d < d2) { d2 = d; }
  }
  return vec3(sqrt(d1), id, sqrt(d2) - sqrt(d1));
}
`

// The archipelago and the island slots' rects and weights, and the district's
// under them (render/district.js). Enough for any shader to work out who owns
// a point; the slots' and the district's textures are in ground.
export const world = /* glsl */ `
uniform float uVert;           // world Y per metre: the exaggeration of the moment / 100
uniform float uExag;           // the exaggeration itself
uniform sampler2D uArchH;      // archipelago heights, metres (R32F, nearest)
uniform vec4 uArchRect;        // its world rect: x0, z0, x1, z1
uniform vec4 uSlotRect[SLOTS];
uniform vec4 uSlotInfo[SLOTS]; // x detail weight k, y on (0/1), z edge margin (world units)

vec2 rectUv(vec4 r, vec2 xz) { return (xz - r.xy) / (r.zw - r.xy); }
float edgeDist(vec4 r, vec2 xz) {
  vec2 a = min(xz - r.xy, r.zw - xz);
  return min(a.x, a.y);
}
// A manual bilinear fetch of a float height texture over a world rect,
// clamped at its edges (float textures aren't filterable everywhere).
float rectMetres(sampler2D t, vec4 r, vec2 xz) {
  vec2 size = vec2(textureSize(t, 0));
  vec2 p = clamp(rectUv(r, xz) * size - 0.5, vec2(0.0), size - 1.001);
  vec2 fl = floor(p);
  vec2 fr = p - fl;
  ivec2 i = ivec2(fl);
  float h00 = texelFetch(t, i, 0).r;
  float h10 = texelFetch(t, i + ivec2(1, 0), 0).r;
  float h01 = texelFetch(t, i + ivec2(0, 1), 0).r;
  float h11 = texelFetch(t, i + ivec2(1, 1), 0).r;
  return mix(mix(h00, h10, fr.x), mix(h01, h11, fr.x), fr.y);
}
// beyond the archipelago pack it is open ocean
float archMetres(vec2 xz) {
  return edgeDist(uArchRect, xz) < 0.0 ? -4000.0 : rectMetres(uArchH, uArchRect, xz);
}
// the island slot that draws xz, or -1 for the archipelago
int ownerAt(vec2 xz) {
  int o = -1;
  float best = 0.0;
  for (int s = 0; s < SLOTS; s++) {
    if (uSlotInfo[s].y < 0.5) continue;
    float e = edgeDist(uSlotRect[s], xz);
    if (e > best) { best = e; o = s; }
  }
  return o;
}
// how much of slot s's own data shows at xz
float slotWeight(int s, vec2 xz) {
  vec4 info = uSlotInfo[s];
  return info.x * smoothstep(0.0, info.z, edgeDist(uSlotRect[s], xz));
}

// The district, a third level under its island: its rect, and x its detail
// weight k, y on (0/1), z the margin over which it eases back into the
// island, w a band at its very edge where it shows nothing of its own. Its
// mesh draws the whole rect; the island's stop short of it by that band, so
// the two overlap there, at the island's own heights, instead of meeting.
uniform vec4 uDistRect;
uniform vec4 uDistInfo;
float distWeight(vec2 xz) {
  if (uDistInfo.y < 0.5) return 0.0;
  return uDistInfo.x * smoothstep(uDistInfo.w, uDistInfo.z, edgeDist(uDistRect, xz));
}
// whether the district's mesh draws xz, so an island's mesh need not
bool distDraws(vec2 xz) {
  return uDistInfo.y > 0.5 && edgeDist(uDistRect, xz) > uDistInfo.w;
}
`

// The patches on the island packs (DATA.md "Patches, on any pack";
// render/patches.js): the ground as it was before a harbour was dredged or a
// reef filled. Each patch's mask is cropped to where it marks anything and
// kept in one atlas with all the others; a patch has a box in the world, its
// place in the atlas, and its weight in the year (1 before its until, easing
// to 0 over a couple of seconds as the year crosses it). A raise lifts
// today's sea to the reef flat at its depth, a lower sinks today's land to
// it, the raises first; a soft edge is a weight. Each slot names the run of
// patches its pack has, which render/patches.js writes raises first.
// render/patches.js keeps the CPU copy (apply), for world.metresAt.
export const patches = /* glsl */ `
uniform sampler2D uPatchMap;       // the cropped masks (R8, linear), each with a texel of nothing round it
uniform vec4 uPatchBox[PATCHES];   // each patch's crop in the world: x0, z0, x1, z1, outer edges
uniform vec4 uPatchUv[PATCHES];    // the same in the atlas: u0, v0, u1, v1
uniform vec4 uPatchInfo[PATCHES];  // x its weight in the year, y the reef flat's depth (metres), z 1 a raise, -1 a lower
uniform vec2 uSlotPatch[SLOTS];    // each slot's patches: x the first, y how many
uniform vec4 uSlotPatchBox[SLOTS]; // and the box round all of them (world), so the rest of the island skips the loop
bool inPatchBox(int s, vec2 xz) {
  vec4 b = uSlotPatchBox[s];
  return xz.x >= b.x && xz.y >= b.y && xz.x <= b.z && xz.y <= b.w;
}
// (render/patches.js writes only the patches with any weight in the year,
// so a year after them all costs nothing; and a patch's box is the first
// thing read, since most of the ground is in none of them)
float patchMask(int i, vec2 xz) {
  vec4 b = uPatchBox[i];
  if (xz.x < b.x || xz.y < b.y || xz.x > b.z || xz.y > b.w) return 0.0;
  vec4 u = uPatchUv[i];
  return textureLod(uPatchMap, mix(u.xy, u.zw, (xz - b.xy) / (b.zw - b.xy)), 0.0).r;
}
// how much of the ground the last patchedMetres was asked about is a patch's
// reef flat in the year (0..1): the sea reads it after the depth, rather
// than walk the patches again (patchReef)
float gPatchReef = 0.0;
// slot s's heights h at xz, as the year has them
float patchedMetres(int s, vec2 xz, float h) {
  gPatchReef = 0.0;
  if (!inPatchBox(s, xz)) return h;
  int a = int(uSlotPatch[s].x);
  int n = int(uSlotPatch[s].y);
  for (int i = 0; i < PATCHES; i++) {
    if (i >= n) break;
    float m = patchMask(a + i, xz);
    if (m <= 0.0) continue;
    vec4 info = uPatchInfo[a + i];
    h = mix(h, info.z > 0.0 ? max(h, info.y) : min(h, info.y), m * info.x);
    gPatchReef = max(gPatchReef, m * info.x);
  }
  return h;
}
`

// The ground anywhere, for surfaces that aren't one pack's own mesh: the sea
// (for its depth) and the lines (draped on it), and the district's own mesh.
//
// The district's ground is its lidar as it is today, with the year laid on
// it: its patches (today's sea lifted back to the reef flat a channel was
// dredged through, the land the fill made sunk back toward one) and the
// features rastered into its aux map, each by its own weight in the year
// (uFeatK, eased as the year crosses its dates): a loʻi's terraces cut and
// filled into the slope, a fishpond's water. render/district.js keeps the CPU
// copy (metresAt), line for line.
const slotIndices = Array.from({ length: SLOTS }, (_, i) => i)
export const ground = /* glsl */ `
${patches}
${slotIndices.map((i) => `uniform sampler2D uSlotH${i};`).join('\n')}
float slotMetres(int s, vec2 xz) {
  // (samplers can only be picked by a constant index; the patches are laid
  // on whichever it was once, so the loop is compiled once, not per slot)
  float h = -4000.0;
${slotIndices.map((i) => `  ${i ? 'else ' : ''}if (s == ${i}) h = rectMetres(uSlotH${i}, uSlotRect[${i}], xz);`).join('\n')}
  return patchedMetres(s, xz, h);
}
// the archipelago and the islands, without the district
float islandMetres(vec2 xz) {
  float m = archMetres(xz);
  int o = ownerAt(xz);
  if (o >= 0) {
    float w = slotWeight(o, xz);
    if (w > 0.0) m = mix(m, slotMetres(o, xz), w);
  }
  return m;
}

uniform sampler2D uDistH;     // heights today, metres (R32F, nearest)
uniform sampler2D uDistAux;   // r the lower patches' weight, g a feature's mask, b its paddy (hash, and the bank in the top bit), a its index
uniform sampler2D uDistCarve; // a loʻi's r terraces down the valley (modulo 64), g paddies across it (RG16F); off the loʻi, a filled channel's level in r, the normals' offset in g
// The district's patches (district-decode.js patchMap), over the box they
// reach: r which lower patches a texel belongs to (a group, 0 none), g and a
// the weights of the two raise patches over it, b their indices (low and
// high four bits). By group, the lower patches' weight in the year (the most
// of any patch in it) and their depth; by raise patch, its own.
uniform sampler2D uDistPatch;
uniform vec4 uDistPatchBox;               // x0, y0, x1, y1 in the district's texels, the far edges exclusive
uniform vec4 uDistLower[DIST_PATCHES];    // by group: x weight in the year, y depth
uniform vec4 uDistRaise[DIST_PATCHES];    // by raise patch: x weight in the year, y depth
uniform float uDistRaiseTop;              // the highest depth a raise lifts to in the year: ground above it no raise can reach
uniform vec4 uFeatK[16];      // each rastered feature's weight in the year, by index (loʻi DIST_LOI, ponds DIST_POND, the rest after)
float featK(int i) { return uFeatK[i >> 2][i & 3]; }
vec4 distPatchAt(ivec2 p) {
  vec4 b = uDistPatchBox;
  if (float(p.x) < b.x || float(p.y) < b.y || float(p.x) >= b.z || float(p.y) >= b.w) return vec4(0.0);
  return texelFetch(uDistPatch, p - ivec2(b.xy), 0);
}
// today's height h at texel p with the patches of the year laid on it
// (district-decode.js patchLevel): the raises first, then the lowers, whose
// byte in the aux map is under 128 a weight toward the reef flat and from
// 128 a weight toward the fill, at the level the carve keeps there
float distPatched(ivec2 p, float h, float r) {
  // (ground no raise can reach and no lower patch has is today's, without a look at the patch map)
  if (r < 0.5 && h >= uDistRaiseTop) return h;
  vec4 q = distPatchAt(p);
  if (q.g + q.a > 0.0) {
    int ix = int(q.b * 255.0 + 0.5);
    vec4 ra = uDistRaise[ix & 15];
    vec4 rb = uDistRaise[ix >> 4];
    h = mix(h, max(h, ra.y), q.g * ra.x);
    h = mix(h, max(h, rb.y), q.a * rb.x);
  }
  if (r > 0.5) {
    vec4 L = uDistLower[int(q.r * 255.0 + 0.5)];
    if (r < 127.5) h = mix(h, L.y, r / 127.0 * L.x);
    else h = mix(h, max(DIST_FILL, texelFetch(uDistCarve, p, 0).r), (r - 128.0) / 127.0 * L.x);
  }
  return h;
}
float distTexel(ivec2 p) {
  float h = texelFetch(uDistH, p, 0).r;
  vec4 a = texelFetch(uDistAux, p, 0);
  h = distPatched(p, h, a.r * 255.0);
  int f = int(a.a * 255.0 + 0.5);
  if (f > 0) {
    float k = featK(f);
    if (f < DIST_POND) {
      // a loʻi: cut or filled to its terrace's level (district-decode.js loiLevel)
      float tau = texelFetch(uDistCarve, p, 0).r;
      float stp = DIST_BASE * exp2(floor(a.b * 255.0 + 0.5));
      float L = tau + 64.0 * floor((h / stp - tau) / 64.0 + 0.5);
      h += ((floor(L) + 0.5) * stp - h) * a.g * k;
    } else if (f < DIST_OTHER) h = mix(h, DIST_POND_LEVEL, a.g * k);
  }
  return h;
}
vec2 distGrid(vec2 xz) {
  vec2 size = vec2(textureSize(uDistH, 0));
  return clamp(rectUv(uDistRect, xz) * size - 0.5, vec2(0.0), size - 1.001);
}
float distMetres(vec2 xz) {
  vec2 p = distGrid(xz);
  vec2 fl = floor(p);
  vec2 fr = p - fl;
  ivec2 i = ivec2(fl);
  // (the four texels in a loop: one copy of distTexel where it is inlined)
  vec4 t;
  for (int k = 0; k < 4; k++) t[k] = distTexel(i + ivec2(k & 1, k >> 1));
  return mix(mix(t.x, t.y, fr.x), mix(t.z, t.w, fr.x), fr.y);
}
float groundMetres(vec2 xz) {
  gPatchReef = 0.0;
  float w = distWeight(xz);
  // (each read once, behind a branch: a software renderer inlines all of
  // it, and runs what a choice of two values would have it compute)
  float m = 0.0;
  if (w < 1.0) m = islandMetres(xz);
  if (w > 0.0) m = mix(m, distMetres(xz), w);
  return m;
}
// a fishpond's water at xz (0..1), for the sea to lie calm in it
float distPond(vec2 xz) {
  if (distWeight(xz) <= 0.0) return 0.0;
  ivec2 i = ivec2(distGrid(xz) + 0.5);
  vec4 a = texelFetch(uDistAux, i, 0);
  int f = int(a.a * 255.0 + 0.5);
  return f >= DIST_POND && f < DIST_OTHER ? a.g * featK(f) : 0.0;
}
// how much of the water at xz is the reef flat a patch makes in the year
// (0..1), for the sea to show reef there and not open water (ocean.glsl.js);
// asked straight after groundMetres(xz), whose islands' part it reads
float patchReef(vec2 xz) {
  float r = 0.0;
  int o = ownerAt(xz);
  if (o >= 0) r = gPatchReef * slotWeight(o, xz);
  float w = distWeight(xz);
  if (w > 0.0) {
    ivec2 i = ivec2(distGrid(xz) + 0.5);
    vec4 q = distPatchAt(i);
    float d = 0.0;
    if (q.g + q.a > 0.0) {
      int ix = int(q.b * 255.0 + 0.5);
      d = max(q.g * uDistRaise[ix & 15].x, q.a * uDistRaise[ix >> 4].x);
    }
    float lr = texelFetch(uDistAux, i, 0).r * 255.0;
    if (lr > 0.5 && lr < 127.5) d = max(d, lr / 127.0 * uDistLower[int(q.r * 255.0 + 0.5)].x);
    r = mix(r, d, w);
  }
  return r;
}
`

// The lighting every lit surface shares, from ahupuaʻa's common.glsl.js. The
// sun and sky colours already include the time of day. The island weather and
// its cloud shadows are left out for now, so sunVisibility() is the open sky.
export const lighting = /* glsl */ `
uniform vec3 uSunDir;
uniform vec3 uSunColor;
uniform vec3 uSkyColor;
uniform vec3 uGroundColor;
uniform vec3 uMoonDir;
uniform vec3 uMoonColor;
uniform float uTime;
uniform sampler2D uSkyMap;      // equirect sky radiance, elevation squashed to the horizon

vec2 dirToSkyUv(vec3 d) {
  float y = clamp(d.y, -1.0, 1.0);
  return vec2(atan(d.z, d.x) / (2.0 * PI) + 0.5, sign(y) * sqrt(abs(y)) * 0.5 + 0.5);
}
vec3 skyMap(vec3 d) { return texture(uSkyMap, dirToSkyUv(d)).rgb; }

float sunVisibility(vec3 p) { return 1.0; }

vec3 ambientLight(vec3 n) {
  return mix(uGroundColor, uSkyColor, n.y * 0.5 + 0.5);
}

vec3 shade(vec3 albedo, vec3 n, vec3 p, float ao, float vis) {
  float ndl = max(dot(n, uSunDir), 0.0);
  float ndm = max(dot(n, uMoonDir), 0.0);
  vec3 direct = uSunColor * ndl * vis + uMoonColor * ndm;
  return albedo * (direct + ambientLight(n) * ao);
}
`

// The far-view polity overlay: each moku tinted by the polity holding it,
// crossfaded between the two keyframe eras either side of the chosen year
// (overlay/polity.js rasterises the moku and fills the palette).
export const polity = /* glsl */ `
uniform sampler2D uMokuId;   // moku index per texel over the archipelago (R8, nearest), 0 none
uniform vec4 uMokuRect;
uniform sampler2D uPalette;  // 256 × 2: polity colour per moku, row 0 the era before, row 1 after; a: held
uniform float uEraMix;
uniform float uPolityK;      // overall strength: full far out, gone close in
uniform float uHoverMoku;

float mokuAt(vec2 xz) {
  vec2 uv = rectUv(uMokuRect, xz);
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x >= 1.0 || uv.y >= 1.0) return 0.0;
  ivec2 size = textureSize(uMokuId, 0);
  return floor(texelFetch(uMokuId, ivec2(uv * vec2(size)), 0).r * 255.0 + 0.5);
}

vec3 applyPolity(vec3 col, vec2 xz, vec3 light) {
  if (uPolityK < 0.002 && uHoverMoku < 0.5) return col;
  float id = mokuAt(xz);
  if (id < 0.5) return col;
  vec4 a = texelFetch(uPalette, ivec2(int(id), 0), 0);
  vec4 b = texelFetch(uPalette, ivec2(int(id), 1), 0);
  // (a moku held in one era and not the other fades its tint rather than its hue)
  vec3 c = a.a > 0.5 && b.a > 0.5 ? mix(a.rgb, b.rgb, uEraMix) : (a.a > 0.5 ? a.rgb : b.rgb);
  float held = mix(a.a, b.a, uEraMix);
  if (a.a < 0.5 && b.a < 0.5) c = vec3(0.96, 0.93, 0.86); // (held by no one: hover shows it pale)
  // the hue from the polity, the brightness from the lit ground under it, so
  // the relief still reads through the colour and a cool hue over tan land
  // doesn't settle to grey
  vec3 lin = pow(c, vec3(2.2));
  float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
  vec3 tint = lin / max(dot(lin, vec3(0.2126, 0.7152, 0.0722)), 0.05) * lum * 1.05;
  float k = uPolityK * 0.66 * held;
  if (abs(id - uHoverMoku) < 0.5) k = max(k, 0.3) + 0.12;
  return mix(col, tint, clamp(k, 0.0, 1.0));
}
`

// The far view's land mode: cultivation, settlement and native forest in the
// chosen year (overlay/land.js), laid on the ground's colour before it is lit,
// so the relief and the light read through the layers as they do through the
// forest itself. The ground's own vegetation is a model of about 1700; under
// the data it would read as a fourth layer, so it is quietened toward a dry,
// pale ground first, the way a map's base is. Then, bottom to top: forest a
// deep canopy green, cultivation gold, and settlement a warm dark umber that
// deepens toward near-black as the people grow denser, from a faint wash
// where few lived, through scattered specks, to the solid built ground of a
// town. (Not red: specks of red over a map read as an outbreak.)
export const land = /* glsl */ `
uniform sampler2D uArchLandA; // over the archipelago, the keyframe before: r cultivation, g settlement (log), b forest
uniform sampler2D uArchLandB; // and after
uniform float uLandT;         // between them
uniform float uLandK;         // overall strength: the land view, faded close in and as the layers arrive
uniform float uLandEarly;     // 0 before about 1100 .. 1 by 1450: the 1778 layers whole

// Settlement as specks: a dot in some cells of a grid about five pixels
// across at any zoom (the power-of-two cell nearest that, the two nearest
// levels crossfaded), fixed to the ground so they hold still as the camera
// moves. area is the share of the ground they cover: below a quarter, more
// cells take a small dot (each fading in, not popping, as the year moves);
// above it the dots grow until they merge into solid town.
float speckLevel(vec2 xz, float level, float area, float px) {
  float cell = exp2(level);
  vec2 p = xz / cell;
  vec2 id = floor(p);
  // (placed and sized at random within the cell, so a dense town isn't a halftone screen)
  vec2 o = id + 0.15 + 0.7 * hash22(id + level * 13.7);
  float present = clamp((area * 4.0 - hash12(id + level * 7.3 + 5.1)) / 0.08, 0.0, 1.0);
  float r = mix(0.28, 1.1, smoothstep(0.25, 1.0, area)) * (0.75 + 0.5 * hash12(id + level * 3.1 + 9.2));
  float aa = px / cell;
  float speck = present * (1.0 - smoothstep(r - aa, r + aa, length(p - o)));
  return max(speck, smoothstep(0.7, 0.95, area));
}
float landSpecks(vec2 xz, float px, float area) {
  float lv = log2(max(px, 1e-4) * 5.0);
  float l0 = floor(lv);
  return mix(speckLevel(xz, l0, area, px), speckLevel(xz, l0 + 1.0, area, px), lv - l0);
}

vec3 applyLand(vec3 col, vec3 m, float rain, vec2 xz, float px, float metres) {
  float k = uLandK * smoothstep(0.0, 2.0, metres);
  // before the leeward field systems: the 1778 cultivation with its dry
  // fields faded and its people thinned (the contact keyframe's note)
  float cult = m.r * mix(0.12 + 0.88 * smoothstep(0.24, 0.46, rain), 1.0, uLandEarly);
  float sv = max(0.0, m.g - 0.1 * (1.0 - uLandEarly));
  float forest = m.b;
  float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
  vec3 c = mix(col, vec3(lum) * vec3(1.10, 1.0, 0.84) * 1.08, 0.6);
  // the canopy keeps a little of the ground's own light and dark, so it isn't a flat sheet
  vec3 canopy = pow(vec3(0.15, 0.31, 0.13), vec3(2.2)) * (0.75 + 0.5 * clamp(lum / 0.12, 0.0, 1.2));
  c = mix(c, canopy, smoothstep(0.03, 0.85, forest) * 0.88);
  // (rising steeply from a little, since a fifth of the ground in fields is
  // a lot of fields, and at the chain's half-kilometre texels the scattered
  // kuleana of 1853 are each a fifth of one)
  vec3 gold = pow(vec3(0.86, 0.64, 0.22), vec3(2.2));
  c = mix(c, gold, pow(clamp((cult - 0.01) / 0.7, 0.0, 1.0), 0.65) * 0.85);
  // settlement (the bytes are log density, DATA.md): a faint wash from
  // about 8 to 110 people a km², and specks from about 30, covering a
  // tenth of the ground at 100, half at 1,000, merged into solid town by
  // about 10,000
  // (with the whole chain in view a shore's villages are a pixel or two
  // wide, so the specks are let to cover more of it there)
  float far = smoothstep(1.0, 5.0, px);
  float wash = mix(0.2, 0.28, far) * smoothstep(0.15, 0.40, sv);
  float cover = clamp((sv - 0.28) / 0.56, 0.0, 1.0);
  float speck = landSpecks(xz, px, pow(cover, 1.5 - 0.6 * far));
  vec3 umber = pow(mix(vec3(0.36, 0.25, 0.16), vec3(0.16, 0.135, 0.11), smoothstep(0.35, 0.9, sv)), vec3(2.2));
  c = mix(c, umber, max(wash, speck * 0.95));
  return mix(col, c, k);
}
`
