// The district's surface (render/district.js): the island's land shading
// (terrain.glsl.js groundAlbedo) on the district's own 6 m heights, normals,
// rain and riparian, with the year laid on it.
//
// It draws its whole rect. Toward the edge its heights and maps ease back into
// the island's (and the island's slot back into the archipelago's, as the
// island packs do), so at the rect's very edge it is the island's ground,
// drawn twice with the island's own mesh overlapping it, and no seam shows. At
// detail weight 0 it is the island's ground everywhere, which is how it
// appears and how it goes.
//
// The year, from the aux map and the carve (common.glsl.js distTexel): the
// patch sinks land the fill made to a reef flat, which the sea then covers;
// the loʻi are cut and filled into terraces, and drawn as paddies (from the
// ahupuaʻa app's loʻi shader: sky in the open water over mud, taro by each
// paddy's age, some lying fallow, banks between them), their inferred
// outlines soft; a fishpond's water is the sea's, lying still; the village's
// ground is trodden bare. The normal map is today's ground, so what the year
// has changed is added to it from the texels themselves (the slope of the
// terraces' risers, the patch's beach) while a texel is bigger than a pixel.
//
// No polity colours and no land view here: the district only takes over once
// the camera is close enough that both have gone (config.js DISTRICT.rig).

import { constants, noise, world, ground, lighting } from './common.glsl.js'
import { albedo } from './terrain.glsl.js'

export const districtVertex = /* glsl */ `
${constants}
${world}
${ground}
in vec4 aNode; // x0, z0, size, lod
uniform vec2 uMorph[12];
uniform float uGrid;
uniform vec3 uCamPos;
out vec3 vWorld;
out float vMetres;

float packMetres(vec2 xz) { return groundMetres(xz); }

void main() {
  vec2 g = floor(position.xz * uGrid + 0.5);
  float cell = aNode.z / uGrid;
  vec2 xz = aNode.xy + g * cell;
  float mt = packMetres(xz);
  float dist = distance(uCamPos, vec3(xz.x, mt * uVert, xz.y));
  vec2 m = uMorph[int(aNode.w)];
  float k = clamp((dist - m.x) / (m.y - m.x), 0.0, 1.0);
  // (the geomorph of terrain.glsl.js)
  vec2 odd = g - 2.0 * floor(g * 0.5);
  if (k > 0.0 && odd.x + odd.y > 0.5) {
    vec2 base = aNode.xy + (g - odd) * cell;
    float hc;
    if (odd.x > 0.5 && odd.y > 0.5) {
      vec2 pc = (g - odd) * 0.5;
      if (mod(pc.x + pc.y, 2.0) > 0.5) hc = 0.5 * (packMetres(base + vec2(2.0, 0.0) * cell) + packMetres(base + vec2(0.0, 2.0) * cell));
      else hc = 0.5 * (packMetres(base) + packMetres(base + vec2(2.0) * cell));
    } else {
      hc = 0.5 * (packMetres(base) + packMetres(base + odd * 2.0 * cell));
    }
    mt = mix(mt, hc, k);
  }
  vMetres = mt;
  if (mt < 0.0) mt -= 25.0 * smoothstep(0.15, 3.0, -mt);
  vWorld = vec3(xz.x, mt * uVert, xz.y);
  gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
}
`

export const districtFragment = /* glsl */ `
${constants}
${noise}
${world}
${ground}
${lighting}
${albedo}
uniform sampler2D uArchN;
uniform sampler2D uArchL;
uniform sampler2D uParN;   // the island's maps, under the district (its slot's own)
uniform sampler2D uParL;
uniform sampler2D uParS;
uniform vec4 uParRect;
uniform int uParSlot;      // the island's slot, or -1
uniform float uParRain;
uniform sampler2D uDistN;  // the district's normals (today's ground) and occlusion
uniform sampler2D uDistL;  // r rain, g today's beach, b riparian, a the beach of the patched years
uniform sampler2D uDistS;  // its cast shadows
uniform int uDebug;
in vec3 vWorld;
in float vMetres;

// The four texels round xz, raw and as the year has them, and the features
// on them: the year's change to the slope (metres per metre), how much loʻi
// stands here, and its terraces down the valley and paddies across it
// (common.glsl.js), run smoothly between texels, and the village's ground.
struct Year { vec2 dGrad; float loi; float tau; float u; float cls; float trod; };
Year yearAt(vec2 xz) {
  Year y;
  y.dGrad = vec2(0.0);
  y.loi = 0.0;
  y.tau = 0.0;
  y.u = 0.0;
  y.cls = 0.0;
  y.trod = 0.0;
  vec2 p = distGrid(xz);
  vec2 fl = floor(p);
  vec2 fr = p - fl;
  ivec2 i0 = ivec2(fl);
  // (most of the ground is neither patched nor a feature's: nothing to lay on it)
  vec4 a0 = texelFetch(uDistAux, i0, 0);
  vec4 a1 = texelFetch(uDistAux, i0 + ivec2(1, 0), 0);
  vec4 a2 = texelFetch(uDistAux, i0 + ivec2(0, 1), 0);
  vec4 a3 = texelFetch(uDistAux, i0 + ivec2(1, 1), 0);
  if (max(max(a0.r + a0.a, a1.r + a1.a), max(a2.r + a2.a, a3.r + a3.a)) <= 0.0) return y;
  vec2 texel = (uDistRect.zw - uDistRect.xy) / vec2(textureSize(uDistH, 0)) * 100.0; // metres
  float d[4];
  vec4 loi;
  vec4 tau;
  vec4 u;
  vec4 trod;
  vec4 cls;
  for (int k = 0; k < 4; k++) {
    ivec2 q = i0 + ivec2(k & 1, k >> 1);
    vec4 a = texelFetch(uDistAux, q, 0);
    int f = int(a.a * 255.0 + 0.5);
    vec2 cu = texelFetch(uDistCarve, q, 0).rg;
    // (against the heights the normal map was made on: today's, but for a
    // dug channel it has filled or an islet it has sunk, whose offset the
    // carve keeps off the loʻi; district-decode.js)
    float raw = texelFetch(uDistH, q, 0).r;
    if (a.r > 0.0 && (f == 0 || f >= DIST_POND)) raw += cu.y;
    d[k] = distTexel(q) - raw;
    loi[k] = f > 0 && f < DIST_POND ? a.g * featK(f) : 0.0;
    cls[k] = floor(a.b * 255.0 + 0.5);
    tau[k] = cu.x;
    u[k] = cu.y;
    trod[k] = f >= DIST_OTHER ? a.g * featK(f) : 0.0;
  }
  vec4 bw = vec4((1.0 - fr.x) * (1.0 - fr.y), fr.x * (1.0 - fr.y), (1.0 - fr.x) * fr.y, fr.x * fr.y);
  y.dGrad = vec2(mix(d[1] - d[0], d[3] - d[2], fr.y) / texel.x, mix(d[2] - d[0], d[3] - d[1], fr.x) / texel.y);
  y.loi = dot(bw, loi);
  y.trod = dot(bw, trod);
  // (only from texels that are loʻi, so the coordinates don't sag to 0 at the
  // edge, and of the nearest one's step, since tau counts terraces of that
  // step; tau unwrapped round the nearest: it is kept modulo 64)
  vec4 near = texelFetch(uDistAux, ivec2(p + 0.5), 0);
  y.cls = floor(near.b * 255.0 + 0.5);
  vec4 inL = step(vec4(0.001), loi) * (vec4(1.0) - step(vec4(0.5), abs(cls - y.cls))) * bw;
  float sw = max(dot(inL, vec4(1.0)), 1e-4);
  float tRef = texelFetch(uDistCarve, ivec2(p + 0.5), 0).r;
  vec4 tu = tau + 64.0 * floor((vec4(tRef) - tau) / 64.0 + 0.5);
  y.tau = dot(inL, tu) / sw;
  y.u = dot(inL, u) / sw;
  return y;
}

void main() {
  vec2 xz = vWorld.xz;
  if (edgeDist(uDistRect, xz) < 0.0) discard;
  float w = distWeight(xz);
  float kP = uParSlot >= 0 ? slotWeight(uParSlot, xz) : 0.0;
  vec2 uvA = rectUv(uArchRect, xz);
  vec2 uvP = rectUv(uParRect, xz);
  vec2 uvD = rectUv(uDistRect, xz);
  // the island's maps as the island draws them, the district's over them by its weight
  vec4 ntI = mix(texture(uArchN, uvA), texture(uParN, uvP), kP);
  vec4 lA = texture(uArchL, uvA);
  vec4 lI = mix(lA, texture(uParL, uvP), kP);
  if (uParRain < 0.5) lI.r = lA.r;
  vec4 ntD = texture(uDistN, uvD);
  vec4 lD = texture(uDistL, uvD);
  lD.g = mix(lD.g, lD.a, uPatchK); // (the beach of the year)
  vec4 nt = mix(ntI, ntD, w);
  vec4 land = mix(lI, lD, w);

  vec2 dX = dFdx(xz);
  vec2 dY = dFdy(xz);
  float px = length(abs(dX) + abs(dY));
  float fwM = fwidth(vMetres);

  vec3 n0 = nt.xyz * 2.0 - 1.0;
  vec2 grad = -n0.xz / (max(n0.y, 0.03) * NORMAL_E);
  // what the year has done to the slope, while a texel is wider than a pixel
  // or so (finer, it would only sparkle, and the paddies average out to the
  // valley's own slope anyway)
  Year y = yearAt(xz);
  float texelW = (uDistRect.z - uDistRect.x) / float(textureSize(uDistH, 0).x);
  float fine = w * (1.0 - smoothstep(0.6, 1.6, px / texelW));
  grad += y.dGrad * fine;
  vec3 n = normalize(vec3(-grad.x * uExag, 1.0, -grad.y * uExag));
  vec3 nC = normalize(vec3(-grad.x * NEAR_E, 1.0, -grad.y * NEAR_E));
  float ao = mix(1.0, nt.a, 0.85);
  float metres = vMetres;

  // (and the farmed band gives way to forest lower down at the wet valley head, as the trees do)
  vec3 col = groundAlbedo(xz, metres, land.r, land.g, land.b, nC, px, fwM, w);

  // the village: trodden ground between the houses
  float trod = y.trod * w;
  col = mix(col, srgb(vec3(0.55, 0.45, 0.33)) * (0.85 + 0.3 * vnoiseF(xz * 30.0, px * 30.0)), trod * 0.45);

  // --- the loʻi ------------------------------------------------------------
  // A paddy is a terrace (whole tau) and a column across the valley (whole
  // u); the banks (kuāuna) are where either turns over, a couple of metres of
  // grassy earth, the terrace's riser among them. Each paddy at its own stage:
  // most under taro from fresh huli to a full canopy, some just flooded and
  // bare, a few fallow. The tread is cut level, so it is lit level.
  float loi = y.loi * w;
  float waterK = 0.0;
  if (loi > 0.002) {
    float h = hash12(vec2(floor(y.tau) + y.cls * 64.0 + 0.5, floor(y.u) + 11.3));
    float fallow = step(h, 0.07);
    // (most under taro at some stage; one in seven just flooded and bare)
    float age = fract(h * 7.31 + 0.13);
    float bare = step(fract(h * 3.7 + 0.4), 0.14);
    float grow = smoothstep(0.0, 0.8, age);
    float cover = mix(0.4 + 0.57 * grow, 0.04, bare) * (1.0 - fallow);
    // the planting rows, a faint stripe while they are a few pixels apart
    float rows = 0.5 + 0.5 * sin(dot(xz, vec2(0.8, 0.6)) * 380.0);
    cover = mix(cover, cover * (0.8 + 0.3 * rows), 1.0 - smoothstep(0.004, 0.01, px));
    vec3 leafC = mix(srgb(vec3(0.30, 0.46, 0.17)), srgb(vec3(0.40, 0.56, 0.22)), fract(h * 13.7));
    leafC = mix(srgb(vec3(0.42, 0.50, 0.22)), leafC, grow);
    vec3 fallowC = srgb(vec3(0.50, 0.50, 0.30)) * (0.85 + 0.3 * vnoiseF(xz * 60.0, px * 60.0));
    vec3 mud = srgb(vec3(0.33, 0.30, 0.20));
    vec3 paddyC = mix(mix(mud, leafC, cover), fallowC, fallow);
    // the banks, antialiased, thinning to nothing as they get finer than a pixel
    float aaT = fwidth(y.tau);
    float aaU = fwidth(y.u);
    float dT = min(fract(y.tau), 1.0 - fract(y.tau));
    float dU = min(fract(y.u), 1.0 - fract(y.u));
    float wT = 0.07;
    float wU = 1.3 / 29.0;
    float bankT = (1.0 - smoothstep(wT - aaT, wT + aaT, dT)) * (1.0 - smoothstep(0.12, 0.35, aaT));
    float bankU = (1.0 - smoothstep(wU - aaU, wU + aaU, dU)) * (1.0 - smoothstep(0.08, 0.25, aaU));
    float bank = max(bankT, bankU * 0.85);
    vec3 bankC = srgb(vec3(0.38, 0.47, 0.22)) * (0.9 + 0.2 * h);
    col = mix(col, mix(paddyC, bankC, bank), loi);
    // what is left of the paddy is open water, lit as water below
    waterK = loi * (1.0 - bank) * (1.0 - fallow) * (1.0 - cover);
    // a tread lies level; a riser keeps the ground's fall and darkens on its shaded side
    vec2 g2 = mix(grad, vec2(0.0), y.loi * w * (1.0 - bankT));
    g2 += grad * bankT * y.loi * w * 1.5;
    n = normalize(vec3(-g2.x * uExag, 1.0, -g2.y * uExag));
  }

  // shadows: the island's map under the district's, by its weight
  float vis = mix(texture(uParS, uvP).r, texture(uDistS, uvD).r, w);
  vec3 lit = shade(col, n, vWorld, ao, vis);
  if (waterK > 0.0) {
    // open water: the sky in it over muddy brown-green, and the sun's glint
    vec3 V = normalize(cameraPosition - vWorld);
    vec2 rp = xz * 220.0 + vec2(uTime * 0.6, uTime * 0.4);
    vec3 N = normalize(vec3((vnoiseF(rp, px * 220.0) - 0.5) * 0.08, 1.0, (vnoiseF(rp + 13.0, px * 220.0) - 0.5) * 0.08));
    float F = 0.03 + 0.97 * pow(1.0 - max(dot(N, V), 0.0), 5.0);
    vec3 R = reflect(-V, N);
    R.y = abs(R.y);
    vec3 water = vec3(0.09, 0.085, 0.05) * (uSkyColor + uSunColor * max(uSunDir.y, 0.0) * vis);
    water = mix(water, skyMap(R), F * 0.8);
    vec3 H = normalize(uSunDir + V);
    water += uSunColor * pow(max(dot(N, H), 0.0), 300.0) * 4.0 * vis;
    lit = mix(lit, water, waterK);
  }
  if (uDebug == 1) lit = col * 2.0;
  if (uDebug == 2) lit = n * 0.5 + 0.5;
  if (uDebug == 3) lit = vec3(ao);
  if (uDebug == 4) lit = vec3(land.r, land.g, land.b);
  if (uDebug == 5) lit = mix(vec3(0.9, 0.3, 0.1), vec3(0.2, 0.9, 0.3), w);
  if (uDebug == 7) lit = vec3(loi, fract(y.u), trod);
  gl_FragColor = vec4(lit, 1.0);
}
`

// The district's cast shadows (render/shadow.js), from its own heights and
// the island's beyond them, without the year's paddies (a metre of terrace
// casts nothing that shows at this scale).
export const districtShadowFragment = /* glsl */ `
${constants}
${world}
${ground}
uniform vec3 uSunDir;
uniform float uStep;
uniform float uTop;
in vec2 vUv;
float rawMetres(vec2 xz) {
  float w = distWeight(xz);
  float m = w < 1.0 ? islandMetres(xz) : 0.0;
  return w > 0.0 ? mix(m, rectMetres(uDistH, uDistRect, xz), w) : m;
}
void main() {
  vec2 xz = uDistRect.xy + vUv * (uDistRect.zw - uDistRect.xy);
  float h0 = max(rawMetres(xz), 0.0) * uVert + uStep * 0.02;
  vec2 d = normalize(uSunDir.xz + 1e-6);
  float rise = uSunDir.y / max(length(uSunDir.xz), 1e-4);
  float lit = 1.0;
  float t = uStep * 0.7;
  for (int i = 0; i < 56; i++) {
    vec2 p = xz + d * t;
    float ray = h0 + t * rise;
    float g = max(rawMetres(p), 0.0) * uVert;
    lit = min(lit, 10.0 * (ray - g) / t + 0.5);
    if (lit <= 0.0 || ray > uTop) break;
    t = t * 1.085 + uStep * 0.35;
  }
  float s = clamp(lit, 0.0, 1.0);
  s = s * s * (3.0 - 2.0 * s);
  s *= smoothstep(-0.02, 0.04, uSunDir.y);
  gl_FragColor = vec4(s, s, s, 1.0);
}
`
