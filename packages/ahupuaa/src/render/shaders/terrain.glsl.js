import { constants, noise, heightFetch, lighting, overlay } from './common.glsl.js'

export const terrainVertex = /* glsl */ `
${constants}
${heightFetch}
in vec4 aNode; // x0, z0, size, lod
uniform vec2 uMorph[8];
uniform float uGrid;
uniform vec3 uCamPos;
out vec3 vWorld;
out vec2 vUv;
out float vMetres;

void main() {
  vec2 g = position.xz * uGrid;
  vec2 xz = aNode.xy + position.xz * aNode.z;
  float h = metresAt(xz) * Y_PER_M;
  float dist = distance(uCamPos, vec3(xz.x, h, xz.y));
  vec2 m = uMorph[int(aNode.w)];
  float k = clamp((dist - m.x) / (m.y - m.x), 0.0, 1.0);
  g -= fract(g * 0.5) * 2.0 * k;
  xz = aNode.xy + g / uGrid * aNode.z;
  float mt = metresAt(xz);
  vMetres = mt;
  // The sea is drawn from the height texture; the seabed under it only needs to
  // be visible in the last few centimetres at the shoreline. Sink it below that
  // so the two surfaces never fight over depth.
  if (mt < 0.0) mt -= 25.0 * smoothstep(0.15, 3.0, -mt);
  h = mt * Y_PER_M;
  vWorld = vec3(xz.x, h, xz.y);
  vUv = worldToUv(xz);
  gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
}
`

export const terrainFragment = /* glsl */ `
${constants}
${noise}
${heightFetch}
${lighting}
${overlay}
uniform sampler2D uNormal;
uniform sampler2D uLand;  // r rain (log), g sand, b riparian, a cultivation
uniform int uDebug;
in vec3 vWorld;
in vec2 vUv;
in float vMetres;

vec3 srgb(vec3 c) { return pow(c, vec3(2.2)); }

void main() {
  vec4 nt = texture(uNormal, vUv);
  vec3 n = normalize(nt.xyz * 2.0 - 1.0);
  float ao = nt.a;
  vec4 land = texture(uLand, vUv);
  float rain = land.r;
  float sand = land.g;
  float rip = land.b;
  float metres = vMetres;
  float slope = 1.0 - n.y;
  vec2 xz = vWorld.xz;

  // --- vegetation by rainfall ---------------------------------------------
  float px = length(fwidth(xz)); // world units per pixel
  float nBig = fbm2(xz * 0.35);
  float nMid = fbm2(xz * 2.1 + 5.0);
  vec3 grassDry = srgb(vec3(0.70, 0.60, 0.38));
  vec3 grassGreen = srgb(vec3(0.47, 0.55, 0.28));
  vec3 shrub = srgb(vec3(0.42, 0.45, 0.25));
  vec3 mesic = srgb(vec3(0.26, 0.41, 0.17));
  vec3 wet = srgb(vec3(0.15, 0.32, 0.13));
  vec3 cloudF = srgb(vec3(0.17, 0.30, 0.18));
  vec3 soil = srgb(vec3(0.52, 0.29, 0.17));
  vec3 rock = srgb(vec3(0.33, 0.29, 0.26));
  vec3 lava = srgb(vec3(0.17, 0.16, 0.155));
  vec3 sandC = srgb(vec3(0.90, 0.84, 0.70));

  float r = rain + (nBig - 0.5) * 0.12;
  vec3 ground = mix(grassDry, grassGreen, smoothstep(0.18, 0.42, r + nMid * 0.08));
  float forest = smoothstep(0.30, 0.52, r + (nMid - 0.5) * 0.2);
  vec3 canopyC = mix(shrub, mesic, smoothstep(0.32, 0.55, r));
  canopyC = mix(canopyC, wet, smoothstep(0.55, 0.8, r));
  canopyC = mix(canopyC, cloudF, smoothstep(1150.0, 1500.0, metres));

  // tree crowns: each cell a sunlit dome, faded to an average when they'd alias
  vec3 vc = voronoi(xz * 6.0);
  float crownFade = 1.0 - smoothstep(0.02, 0.07, px);
  float dome = sqrt(max(0.0, 1.0 - vc.x * vc.x * 1.6));
  // fake per-crown normal: bulge away from the cell centre
  vec2 toC = (xz * 6.0 - (floor(xz * 6.0) + 0.5));
  float lightSide = dot(normalize(vec3(-toC.x, 0.6, -toC.y)), uSunDir) * 0.5 + 0.5;
  float crown = mix(0.84, (0.62 + 0.45 * dome) * (0.78 + 0.4 * lightSide), crownFade);
  vec3 tint = mix(vec3(0.88, 0.97, 0.86), vec3(1.12, 1.06, 0.88), vc.y);
  canopyC *= mix(vec3(1.0), tint, crownFade * 0.7) * crown;
  // ʻōhiʻa in bloom: a sprinkle of lehua red on the upper forest
  float lehua = step(0.93, hash12(floor(xz * 6.0) + 0.3)) * smoothstep(700.0, 1100.0, metres) * crownFade;
  canopyC = mix(canopyC, srgb(vec3(0.62, 0.12, 0.08)), lehua * 0.35 * smoothstep(0.0, 0.5, dome));
  // riparian strips: kukui's pale silvery green along the gulches
  canopyC = mix(canopyC, srgb(vec3(0.52, 0.60, 0.42)), rip * 0.55 * smoothstep(0.35, 0.6, r));
  // grass: no cells, just tussocky variation at a few scales
  float gN = fbm2(xz * 18.0) * 0.6 + vnoise(xz * 90.0) * 0.4 * (1.0 - smoothstep(0.004, 0.02, px));
  ground *= 0.82 + 0.36 * gN;
  vec3 col = mix(ground, canopyC, forest);

  // kula field system: low walls along the contours, rows of ʻuala mounds,
  // plots in different stages
  float field = land.a;
  if (field > 0.02) {
    float rowH = metres / 7.5;
    float plot = hash12(vec2(floor(rowH), floor(dot(xz, vec2(0.7, -0.7)) * 1.6)));
    vec3 cropC = mix(srgb(vec3(0.40, 0.48, 0.20)), srgb(vec3(0.55, 0.42, 0.25)), smoothstep(0.35, 0.75, plot));
    float mounds = (1.0 - smoothstep(0.004, 0.015, px)) * smoothstep(0.3, 0.7, vnoise(xz * 140.0));
    cropC *= 0.85 + 0.25 * mounds;
    float wallLine = 1.0 - smoothstep(0.0, 1.0, abs(fract(rowH) - 0.5) * 2.0 * 7.5 / max(fwidth(metres) * 1.5, 0.6));
    col = mix(col, cropC, field * 0.85);
    col = mix(col, srgb(vec3(0.33, 0.30, 0.27)), wallLine * field * 0.8);
  }

  // dry, bare, red-earth patches on the leeward slopes
  float bare = (1.0 - smoothstep(0.08, 0.3, r)) * smoothstep(0.55, 0.75, nMid + slope * 0.6);
  col = mix(col, soil, bare * 0.7);

  // --- steep ground: fern-hung pali on the wet side, rock on the dry ----------
  float steep = smoothstep(0.32, 0.62, slope);
  // vertical flutes: grooves running down the fall line
  vec2 fall = normalize(n.xz + 1e-4);
  float across = dot(xz, vec2(-fall.y, fall.x));
  float flute = 0.5 + 0.5 * sin(across * 34.0 + vnoise(xz * 3.0) * 6.0);
  vec3 cliffWet = mix(srgb(vec3(0.22, 0.36, 0.17)), rock, smoothstep(0.55, 0.95, flute) * 0.55);
  vec3 cliffDry = mix(soil, rock, flute * 0.6 + 0.2);
  vec3 cliff = mix(cliffDry, cliffWet, smoothstep(0.25, 0.5, r));
  col = mix(col, cliff, steep);

  // --- the coast -----------------------------------------------------------
  float beach = sand * (1.0 - smoothstep(4.0, 9.0, metres));
  col = mix(col, sandC, smoothstep(0.15, 0.6, beach));
  col = mix(col, lava, smoothstep(0.6, 0.9, slope) * (1.0 - smoothstep(0.0, 25.0, metres)) * 0.7);
  // under water: sand and reef rock, darkened as it gets wet
  float under = 1.0 - smoothstep(-0.3, 0.6, metres);
  vec3 seabed = mix(sandC * 0.85, srgb(vec3(0.42, 0.40, 0.33)), smoothstep(0.35, 0.65, fbm2(xz * 1.3)));
  col = mix(col, seabed, under);
  col *= 1.0 - 0.25 * smoothstep(1.5, 0.0, metres) * (1.0 - under);

  float vis = sunVisibility(vWorld);
  vec3 lit = shade(col, n, vWorld, ao, vis);
  vec3 lightLevel = uSunColor * max(dot(n, uSunDir), 0.0) * vis + uSkyColor;
  lit = applyOverlay(lit, xz, px, 0.0, lightLevel * 0.5);
  if (uDebug == 1) lit = col * 2.0;
  if (uDebug == 2) lit = n * 0.5 + 0.5;
  if (uDebug == 3) lit = vec3(ao);
  if (uDebug == 4) lit = vec3(rain, sand, rip);
  if (uDebug == 5) lit = vec3(vis);
  if (uDebug == 6) lit = metres > 0.0 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 0.0, 1.0) * clamp(-metres / 5.0, 0.0, 1.0) + vec3(0.0, 0.3, 0.0);
  gl_FragColor = vec4(lit, 1.0);
}
`
