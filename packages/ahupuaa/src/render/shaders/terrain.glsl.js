import { constants, noise, heightFetch, lighting, overlay } from './common.glsl.js'

export const terrainVertex = /* glsl */ `
${constants}
${heightFetch}
in vec4 aNode; // x0, z0, size, lod
uniform vec2 uMorph[8];
uniform float uGrid;
uniform vec3 uCamPos;
// the hero falls (waterfalls.js), per fall: A lip x, z, face x, z
// (downstream); B lip metres, pool metres, the sheet's half-width, how far
// out it lands; C the length of the cut, the drop (metres), the face's
// half-width, how wet it runs now (0..1); D the amphitheatre's half-width at
// its mouth, how far its rim curls back downstream (per unit squared off the
// axis) and where it starts, the spray's reach
uniform vec4 uFallA[4];
uniform vec4 uFallB[4];
uniform vec4 uFallC[4];
uniform vec4 uFallD[4];
uniform int uFalls;
out vec3 vWorld;
out vec2 vUv;
out float vMetres;
// The nearest hero fall: where this lies in its frame (x downstream of its
// lip, y across: both linear in xz, so exact anywhere across a triangle),
// which one it is (z), and its numbers. The falls stand at least 8 units
// apart and mark the ground only within 3.5 or so of their lips, so where
// a triangle's corners pick different falls it lies far from both; the
// fragment shader tells by z not coming out whole there.
out vec3 vFall;
flat out vec4 vFallB;
flat out vec4 vFallC;
flat out vec4 vFallD;

void main() {
  vec2 g = floor(position.xz * uGrid + 0.5); // this vertex's grid index in its node
  float cell = aNode.z / uGrid; // grid spacing, world units
  vec2 xz = aNode.xy + g * cell;
  float mt = metresAt(xz);
  float dist = distance(uCamPos, vec3(xz.x, mt * Y_PER_M, xz.y));
  vec2 m = uMorph[int(aNode.w)];
  float k = clamp((dist - m.x) / (m.y - m.x), 0.0, 1.0);
  // Geomorph: toward the outer edge of its range a vertex between the
  // next-coarser grid's vertices blends its height onto that coarser mesh —
  // the midpoint of the parent edge it sits on, or of the parent cell's
  // diagonal (which alternates like ours) — so by the hand-over the two levels
  // are the same surface. Sliding it along the full-detail ground instead
  // makes ridges ripple as the bands sweep past.
  vec2 odd = g - 2.0 * floor(g * 0.5);
  if (k > 0.0 && odd.x + odd.y > 0.5) {
    vec2 base = aNode.xy + (g - odd) * cell;
    float hc;
    if (odd.x > 0.5 && odd.y > 0.5) {
      vec2 pc = (g - odd) * 0.5;
      if (mod(pc.x + pc.y, 2.0) > 0.5) hc = 0.5 * (metresAt(base + vec2(2.0, 0.0) * cell) + metresAt(base + vec2(0.0, 2.0) * cell));
      else hc = 0.5 * (metresAt(base) + metresAt(base + vec2(2.0) * cell));
    } else {
      hc = 0.5 * (metresAt(base) + metresAt(base + odd * 2.0 * cell));
    }
    mt = mix(mt, hc, k);
  }
  vMetres = mt;
  int fi = 0;
  float best = 1e12;
  for (int i = 0; i < 4; i++) {
    if (i >= uFalls) break;
    vec2 d = xz - uFallA[i].xy;
    if (dot(d, d) < best) {
      best = dot(d, d);
      fi = i;
    }
  }
  vec4 A = uFallA[fi];
  vec2 d = xz - A.xy;
  vFall = vec3(dot(d, A.zw), dot(d, vec2(-A.w, A.z)), uFalls > 0 ? float(fi) : 0.5);
  vFallB = uFallB[fi];
  vFallC = uFallC[fi];
  vFallD = uFallD[fi];
  // The sea is drawn from the height texture; the seabed under it only needs to
  // be visible in the last few centimetres at the shoreline. Sink it below that
  // so the two surfaces never fight over depth.
  if (mt < 0.0) mt -= 25.0 * smoothstep(0.15, 3.0, -mt);
  float h = mt * Y_PER_M;
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
in vec3 vFall;
flat in vec4 vFallB;
flat in vec4 vFallC;
flat in vec4 vFallD;

vec3 srgb(vec3 c) { return pow(c, vec3(2.2)); }

// The tree crowns: voronoi() (common.glsl.js) cut to what they use, x the
// distance to the nearest cell's point and y its id, hashed once after the
// search rather than for every closer candidate along the way.
vec2 crowns(vec2 p) {
  vec2 n = floor(p);
  vec2 f = fract(p);
  float d1 = 8.0;
  vec2 best = n;
  for (int j = -1; j <= 1; j++)
  for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j));
    vec2 r = g + hash22(n + g) - f;
    float d = dot(r, r);
    if (d < d1) { d1 = d; best = n + g; }
  }
  return vec2(sqrt(d1), hash12(best + 3.7));
}

// The lava flows stacked in a pali (hm: height in metres). Every 30 m or so
// holds a random number of them, from one massive flow to five thin ones in a
// bunch, squeezed toward its top or its foot: x where this lies among them
// (one per unit, 0 at the cell's foot), y how many metres one of them is
// thick here, z the cell (so every flow and contact has its own number), w
// how many it holds.
vec4 flowsAt(float hm) {
  float ci = floor(hm / 30.0);
  float f = fract(hm / 30.0);
  vec2 h = hash22(vec2(ci, 2.9));
  float k = floor(1.0 + h.x * h.x * 5.0);
  float a = (h.y - 0.5) * 1.6;
  return vec4((f + a * f * (1.0 - f)) * k, 30.0 / (k * (1.0 + a * (1.0 - 2.0 * f))), ci, k);
}

// How much of the flutes on the plane across ax a pixel can hold: 0 once
// they're finer than a few pixels (dX, dY: the pixel's footprint in xz).
float fluteFade(vec2 ax, vec2 dX, vec2 dY) {
  return smoothstep(4.0, 9.0, 0.35 / max(abs(dot(dX, ax)) + abs(dot(dY, ax)), 1e-5));
}

// Flutes on one vertical plane: u runs across the face, h (metres) down it.
// Rounded ribs between sharp grooves, 20 to 100 m apart, wandering a little
// as they run down; each groove is cut deep along some stretches and barely
// at all along others, so they break up into runnels and streaks rather
// than ruling the wall like a curtain. x: how open the face is here (1 on a
// rib, toward 0 down in a groove), y: the ribs' slope across u. k: how much
// of them a pixel can hold (fluteFade); the rest is their mean, and none of
// it is worked out once they're too fine to see.
const vec2 FLUTE_MEAN = vec2(0.938, 0.0);
vec2 flutes(float u, float h, float k) {
  vec2 f = FLUTE_MEAN;
  if (k > 0.0) {
    // the wander: a 1D noise along the face that also stretches and
    // squeezes the spacing, sliding sideways as it runs down
    float wx = u * 1.3 + h * 0.0025;
    float wi = floor(wx);
    float wf = fract(wx);
    float w = mix(hash12(vec2(wi, 7.0)), hash12(vec2(wi + 1.0, 7.0)), wf * wf * (3.0 - 2.0 * wf));
    float t = u * 9.0 + 3.6 * w;
    // (|sin| as a parabola: the same rib and groove, for a fraction of the cost)
    float p = fract(t / PI);
    float a = 4.0 * p * (1.0 - p);
    // the groove's depth, changing along it every 70 m or so (keyed to the
    // groove, so it never changes across one)
    float gi = floor(t / PI + 0.5);
    float hv = h * 0.014 + gi * 0.618;
    float hvi = floor(hv);
    float hvf = fract(hv);
    float d = 0.15 + 0.85 * smoothstep(0.25, 0.75, mix(hash12(vec2(gi, hvi)), hash12(vec2(gi, hvi + 1.0)), hvf * hvf * (3.0 - 2.0 * hvf)));
    f = mix(f, vec2(1.0 - (1.0 - smoothstep(0.0, 0.4, a)) * d, d * (1.0 - 2.0 * p) * (36.0 / PI)), k);
  }
  return f;
}

// A noise on the face of a cliff itself, fourteen metres or so across:
// value noise on the two vertical planes along x and along z, with height in
// metres up both, each weighted by how squarely the face looks along it. So
// unlike anything mapped in plan it never smears down a wall, and unlike
// anything mapped across the face it never swirls as the wall turns or
// breaks where one plane hands over to the next. (Where the two blend,
// their mean is flatter than either; its contrast is put back.)
float faceNoise(vec2 xz, float hm, vec2 nxz) {
  float w = smoothstep(0.25, 0.75, nxz.x * nxz.x / max(dot(nxz, nxz), 1e-6));
  float a = vnoise(vec2(xz.y * 7.0, hm * 0.07));
  float b = vnoise(vec2(xz.x * 7.0 + 31.7, hm * 0.07 + 5.3));
  return 0.5 + (mix(b, a, w) - 0.5) * (1.0 + 1.66 * w * (1.0 - w));
}

// How the nearest hero fall marks the ground here. All of it is worked out
// per pixel on the surface as drawn, so it follows the geomorph exactly and
// never the triangles.
struct Fall {
  float spray; // its spray (0..1)
  float sheet; // the rock right behind its sheet
  float edge;  // how far out toward the fern round its amphitheatre: across
               // to the walls' rim, round the horseshoe's rim, down the cut
               // past where the water lands, up to the brink (0.8 or so at
               // the edge of the rock)
  float zone;  // whether this lies in or around the amphitheatre at all
  float hide;  // how much of the sky its walls hide here
};

Fall fallAt(float metres) {
  Fall f = Fall(0.0, 0.0, 9.0, 0.0, 0.0);
  vec4 B = vFallB;
  vec4 C = vFallC;
  vec4 D = vFallD;
  float s = vFall.x; // downstream of the lip
  float c = vFall.y; // across
  // (none of it reaches further from the lip than this, and none of it on a
  // triangle whose corners picked different falls)
  if (abs(vFall.z - floor(vFall.z + 0.5)) > 1e-3 || s * s + c * c > (C.x + 0.8) * (C.x + 0.8) + 2.5) return f;
  // the spray soaks a rounded bowl from the foot of the face out past where
  // the water lands, and half way up the wall
  float R = D.w * (0.85 + 0.35 * C.w);
  float up = (metres - B.y) / max(0.6 * C.y, 1.0);
  float q = length(vec3((s - 0.6 * B.w) / R, c / R, up < 0.0 ? up * 4.0 : up));
  f.spray = (1.0 - smoothstep(0.35, 1.0, q)) * (0.45 + 0.55 * C.w);
  // the strip right behind the sheet, from the brink down into the bowl, as
  // narrow as the tongue at the brink and spreading as the sheet does
  float down = (B.x - metres) / max(C.y, 1.0);
  float hw = B.z * (0.6 + 0.4 * C.w) * (0.45 + 0.55 * smoothstep(0.0, 0.5, down));
  f.sheet = (1.0 - smoothstep(0.75, 1.15, abs(c) / hw)) * smoothstep(-0.08, -0.02, s) * (1.0 - smoothstep(B.w, B.w + 0.15, s)) * smoothstep(0.0, 0.08, down) * (0.45 + 0.55 * C.w);
  f.spray = max(f.spray, f.sheet);
  // in or around the amphitheatre: near the horseshoe its carve cut (whose
  // rim curls back downstream either side, as carveHero cuts it), within the
  // cut's length and its flaring walls, above the pool; and a margin round
  // it all, where the fern holds the ground (no outcrops of the ordinary
  // pali's rock stand about just beyond its edge)
  float rim = s - D.z - D.y * c * c;
  float across = abs(c) / (C.z + (D.x - C.z) * clamp(s / C.x, 0.0, 1.0));
  f.zone = smoothstep(-0.9, -0.6, rim) * (1.0 - smoothstep(C.x + 0.4, C.x + 0.8, s)) * (1.0 - smoothstep(1.6, 2.0, across)) * smoothstep(B.y, B.y + 15.0, metres);
  f.edge = max(max(across / 1.25, 0.8 - (rim + 0.22) * 2.0), max((s - B.w) / 0.7, (metres - B.x + 30.0) / 30.0));
  // (and deep in it, its walls hide much of the sky)
  f.hide = 0.2 * f.zone * smoothstep(-0.3, 0.0, rim) * (1.0 - smoothstep(0.4, 1.0, across)) * smoothstep(0.1, 0.7, down);
  return f;
}

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
  vec2 dX = dFdx(xz);
  vec2 dY = dFdy(xz);
  vec2 fwXZ = abs(dX) + abs(dY);
  float px = length(fwXZ); // world units per pixel
  float fwM = fwidth(metres);
  // (fbm2's first three octaves and the fourth's mean: the fourth, 35 m
  // across, moves the rain it shifts by no more than 0.004)
  vec2 bp = xz * 0.35;
  float nBig = vnoise(bp) * 0.5;
  bp = bp * 2.03 + 17.1;
  nBig += vnoise(bp) * 0.25;
  bp = bp * 2.03 + 17.1;
  nBig += vnoise(bp) * 0.125 + 0.03125;
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
  // (the steep ground below covers this entirely on the pali, and nothing
  // mapped in plan is worth working out there)
  float steep = smoothstep(0.32, 0.62, slope);
  vec3 col = vec3(0.0);
  float nMid = 0.5;
  if (steep < 1.0) {
    nMid = fbm2(xz * 2.1 + 5.0);
    vec3 ground = mix(grassDry, grassGreen, smoothstep(0.18, 0.42, r + nMid * 0.08));
    float forest = smoothstep(0.30, 0.52, r + (nMid - 0.5) * 0.2);
    vec3 canopyC = mix(shrub, mesic, smoothstep(0.32, 0.55, r));
    canopyC = mix(canopyC, wet, smoothstep(0.55, 0.8, r));
    canopyC = mix(canopyC, cloudF, smoothstep(1150.0, 1500.0, metres));

    // tree crowns: each cell a sunlit dome, faded to an average when they'd alias
    vec2 vc = crowns(xz * 6.0);
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
    // grass: no cells, just tussocky variation at a few scales (fbm2's
    // first three octaves and the fourth's mean: the fourth, under a metre
    // across and a few per cent, is the next term's job)
    vec2 gp = xz * 18.0;
    float gF = vnoise(gp) * 0.5;
    gp = gp * 2.03 + 17.1;
    gF += vnoise(gp) * 0.25;
    gp = gp * 2.03 + 17.1;
    gF += vnoise(gp) * 0.125 + 0.03125;
    float gN = gF * 0.6 + vnoise(xz * 90.0) * 0.4 * (1.0 - smoothstep(0.004, 0.02, px));
    ground *= 0.82 + 0.36 * gN;
    col = mix(ground, canopyC, forest);

    // kula field system: low walls along the contours, rows of ʻuala mounds,
    // plots in different stages
    float field = land.a;
    if (field > 0.02) {
      float rowH = metres / 7.5;
      float plot = hash12(vec2(floor(rowH), floor(dot(xz, vec2(0.7, -0.7)) * 1.6)));
      vec3 cropC = mix(srgb(vec3(0.40, 0.48, 0.20)), srgb(vec3(0.55, 0.42, 0.25)), smoothstep(0.35, 0.75, plot));
      float mounds = (1.0 - smoothstep(0.004, 0.015, px)) * smoothstep(0.3, 0.7, vnoise(xz * 140.0));
      cropC *= 0.85 + 0.25 * mounds;
      float wallLine = 1.0 - smoothstep(0.0, 1.0, abs(fract(rowH) - 0.5) * 2.0 * 7.5 / max(fwM * 1.5, 0.6));
      col = mix(col, cropC, field * 0.85);
      col = mix(col, srgb(vec3(0.33, 0.30, 0.27)), wallLine * field * 0.8);
    }

    // dry, bare, red-earth patches on the leeward slopes
    float bare = (1.0 - smoothstep(0.08, 0.3, r)) * smoothstep(0.55, 0.75, nMid + slope * 0.6);
    col = mix(col, soil, bare * 0.7);
  }

  // --- steep ground: fern-hung pali on the wet side, rock on the dry ----------
  // Everything above is mapped in plan, which on a wall this steep stretches
  // each feature down the whole face into a smear. The pali are drawn in the
  // rock's own terms instead: lava flows stacked in height (metres need no
  // projection at all), flutes across the face, mapped on whichever vertical
  // plane the face looks along, so they run down any wall and never swirl as
  // it turns, and a grain on the face itself (faceNoise) that breaks up all
  // the rest.
  Fall fall = fallAt(metres);
  float spray = fall.spray;
  vec3 nb = n; // the normal, with the flutes pressed in
  if (steep > 0.0) {
    float wetSide = smoothstep(0.25, 0.5, r);
    // the walls of a hero's amphitheatre stand near vertical; the ordinary
    // pali, steep as they are, hold a skin of soil
    float sheer = 1.0 - smoothstep(0.12, 0.3, n.y);
    // the flows, level across a face and dipping gently over hundreds of
    // metres
    float hm = metres + (nBig - 0.5) * 40.0;
    // the grain: clumps of fern, patches of moss, the rock's own blotches;
    // drawn while a clump is several pixels across, and its mean beyond
    float kG = smoothstep(2.5, 5.0, min(0.14 / max(px, 1e-5), 14.0 / max(fwM, 1e-4)));
    float grain = kG > 0.0 ? mix(0.5, faceNoise(xz, hm, n.xz), kG) : 0.5;
    // the flutes, mapped on whichever of sixteen vertical planes (facing
    // every 22.5 degrees round) the face looks along most squarely, so on
    // any face they run within a few degrees of the fall line; they ease
    // off to nothing where it looks between two, so that one plane hands
    // over to the next unseen, and only one is ever worked out
    vec2 fc = normalize(n.xz);
    float an = atan(fc.y, fc.x) * (8.0 / PI);
    float ip = floor(an + 0.5);
    float pw = 1.0 - smoothstep(0.36, 0.5, abs(an - ip));
    // (the plane's axis across the face: the face's own, turned back by
    // the few degrees between them)
    float dl = (an - ip) * (PI / 8.0);
    float cd = 1.0 - 0.5 * dl * dl;
    float sd = dl - dl * dl * dl / 6.0;
    vec2 ax = vec2(fc.x * sd - fc.y * cd, fc.x * cd + fc.y * sd);
    vec2 F = flutes(dot(xz, ax) + mod(ip, 16.0) * 31.0, hm, fluteFade(ax, dX, dY) * pw);
    float g = F.x;
    // The rubbly clinker at the foot of an ʻaʻā flow weathers back into a
    // recess under the massive core above: a dark notch, and on the top of
    // the flow below it a ledge for moss and ferns, wider in a fall's spray.
    // How deep each is cut and how much grows there differs contact by
    // contact (a smooth pāhoehoe flow leaves hardly any) and comes and goes
    // along the face with the grain, so a ledge thins out to nothing rather
    // than ending in a cut. Drawn while a pixel holds less than a few metres
    // of them, and their mean further off, where none of it is worked out.
    float soak = spray * (1.0 - fall.sheet);
    float kS = smoothstep(1.5, 4.0, 4.0 / max(fwM, 1e-4));
    float tone = 0.5; // the flow's own shade
    float notch = 0.1;
    float ledge = 0.08 + 0.1 * soak;
    if (kS > 0.0) {
      vec4 fq = flowsAt(hm);
      float fi = fq.z * 8.0 + floor(fq.x);
      // (how far from the nearest contact between two flows, in metres: up
      // into the recess above it, or down over the lip of the flow below.
      // One at the top of a cell is numbered as the next cell's first, so
      // both sides of it agree.)
      float bk = floor(fq.x + 0.5);
      float dm = (fq.x - bk) * fq.y;
      vec2 cut = hash22(vec2(fq.z * 8.0 + (bk < fq.w ? bk : 8.0), 1.7));
      float deep = smoothstep(0.1, 0.5, cut.x);
      float pxM = 1.5 * fwM + 0.01; // a pixel and a half
      float moss = deep * smoothstep(0.35, 0.75, grain + 0.4 * (cut.y - 0.5) + 0.35 * soak);
      float rw = moss * (2.2 + 2.5 * soak);
      float l = clamp((rw - (dm > 0.0 ? dm : -2.5 * dm)) / max(0.5 * rw, pxM), 0.0, 1.0);
      float o = deep * (0.6 + 0.8 * grain) * smoothstep(-pxM, 0.0, dm) * (1.0 - smoothstep(0.2, 1.4 + grain + pxM, dm));
      tone = mix(tone, hash12(vec2(fi, 4.3)), kS);
      notch = mix(notch, o, kS);
      ledge = mix(ledge, l, kS);
    }
    // how much rock shows. Windward, a sheer wall is rock with moss and
    // ferns on its ledges; the ordinary pali hold a velvet of fern,
    // thinning out as the wall steepens. Leeward the rock shows on much
    // gentler slopes, the grooves and ledges holding what soil there is.
    float rockW = smoothstep(0.25, 0.8, sheer + (grain - 0.5) * 0.5);
    float bareW = rockW * (1.0 - min(ledge * 1.3 + smoothstep(0.72, 0.9, grain) * 0.3, 1.0));
    // A hero's amphitheatre is new-cut rock, bare round the fall and all
    // down its face and walls, whatever the slope there. Toward the rim of
    // its walls, the brink and the mouth of the cut the fern takes it back,
    // in a ragged edge: out along the ledges, down the grooves, onto anything
    // less steep, in clumps and tongues with the grain. None of that reaches
    // deep into the rock or out into the fern, so no islands of either stand
    // apart.
    if (fall.zone > 0.0) {
      float e = fall.edge;
      float P = e + (0.8 * (grain - 0.5) + 0.3 * ledge + 0.12 * (FLUTE_MEAN.x - g) + 0.15 * smoothstep(0.15, 0.45, n.y) + 0.6 * (nBig - 0.5)) * smoothstep(0.35, 0.65, e) * (1.0 - smoothstep(0.78, 1.0, e));
      float rz = (1.0 - smoothstep(0.66, 0.9, P)) * smoothstep(0.38, 0.6, slope);
      rockW = mix(rockW, rz, fall.zone);
      bareW = mix(bareW, rz * (1.0 - min(ledge * 1.3, 1.0)), fall.zone);
    }
    // (leeward the grass takes the ledges, tapering as they do, and a
    // little of the grooves; and behind a fall's sheet the water keeps the
    // rock bare)
    float exposedDry = smoothstep(0.3, 0.7, 1.0 - smoothstep(0.3, 0.62, n.y) - (1.0 - g) * 0.4) * (1.0 - 0.7 * ledge);
    float bareWet = smoothstep(0.3, 0.6, fall.sheet + (grain - 0.5) * 0.5);
    float exposed = max(mix(exposedDry, bareW, wetSide), bareWet);
    // press the ribs into the normal: a couple of metres deep in the fern,
    // and hardly at all on rock, where they're the streaks the water stains
    vec2 bxz = F.y * ax * 0.0175 * (1.0 - 0.85 * rockW);
    vec3 bump = vec3(bxz.x, 0.0, bxz.y);
    nb = normalize(n - (bump - n * dot(n, bump)) * steep);
    // basalt, flow by flow: dark grey to grey-brown windward, darker still
    // where the spray wets it and darkest behind the sheet; leeward the
    // weathered flows run grey, tan and red-brown, the clinker redder
    vec3 basalt = mix(srgb(vec3(0.235, 0.24, 0.23)), srgb(vec3(0.30, 0.295, 0.28)), smoothstep(0.15, 0.85, tone)) * (1.0 - 0.25 * spray - 0.15 * fall.sheet);
    vec3 basaltDry = mix(rock, mix(soil, srgb(vec3(0.55, 0.42, 0.30)), smoothstep(0.5, 0.9, tone)), smoothstep(0.25, 0.75, tone) * 0.8);
    basaltDry = mix(basaltDry, srgb(vec3(0.48, 0.25, 0.16)), notch * 0.5);
    basalt = mix(basaltDry, basalt, wetSide) * (0.9 + 0.2 * grain) * (1.0 - 0.35 * notch);
    // fern velvet, clump by clump; moss on the rock and in the spray, deep
    // and wet; dry grass and shrub on the leeward
    vec3 fern = mix(srgb(vec3(0.20, 0.34, 0.14)), srgb(vec3(0.29, 0.41, 0.18)), grain);
    vec3 veg = mix(fern * (1.0 - 0.2 * rockW), srgb(vec3(0.15, 0.29, 0.09)), max(rockW, spray));
    veg = mix(mix(shrub, grassDry, grain * 0.6), veg, wetSide);
    // (all of it shadowed down in the grooves; on rock those are faint streaks)
    vec3 cliff = mix(veg * mix(0.8, 1.0, g), basalt * mix(0.9, 1.0, g), exposed);
    col = mix(col, cliff, steep);
  }
  // wet ground in a fall's spray: mossy where it isn't steep
  col = mix(col, srgb(vec3(0.13, 0.27, 0.08)), spray * (1.0 - steep) * 0.4);

  // --- the coast -----------------------------------------------------------
  float beach = sand * (1.0 - smoothstep(4.0, 9.0, metres));
  col = mix(col, sandC, smoothstep(0.15, 0.6, beach));
  col = mix(col, lava, smoothstep(0.6, 0.9, slope) * (1.0 - smoothstep(0.0, 25.0, metres)) * 0.7);
  // under water: sand and reef rock, darkened as it gets wet
  float under = 1.0 - smoothstep(-0.3, 0.6, metres);
  vec3 seabed = mix(sandC * 0.85, srgb(vec3(0.42, 0.40, 0.33)), smoothstep(0.35, 0.65, nMid));
  col = mix(col, seabed, under);
  col *= 1.0 - 0.25 * smoothstep(1.5, 0.0, metres) * (1.0 - under);

  ao *= 1.0 - fall.hide; // (deep in a hero's amphitheatre, less sky)
  float vis = sunVisibility(vWorld);
  vec3 lit = shade(col, nb, vWorld, ao, vis);
  if (spray > 0.0) {
    // and glistening: a rough wet sheen of sky (a film of water on rock
    // reflects some of it from any angle, more toward grazing), and the
    // sun's glint, strongest on the rock the sheet runs over
    vec3 V = normalize(cameraPosition - vWorld);
    float e = 1.0 - max(dot(nb, V), 0.0);
    float F = 0.06 + 0.94 * e * e * e * e * e;
    float glint = max(dot(reflect(-V, nb), uSunDir), 0.0);
    glint *= glint;
    glint *= glint;
    glint *= glint;
    glint *= glint;
    lit += spray * (1.0 + fall.sheet) * (uSkyColor * min(F, 0.3) * 0.4 * ao + uSunColor * vis * glint * glint * 0.08);
  }
  vec3 lightLevel = uSunColor * max(dot(n, uSunDir), 0.0) * vis + uSkyColor;
  lit = applyOverlay(lit, xz, px, 0.0, lightLevel * 0.5);
  if (uDebug == 1) lit = col * 2.0;
  if (uDebug == 2) lit = n * 0.5 + 0.5;
  if (uDebug == 3) lit = vec3(ao);
  if (uDebug == 4) lit = vec3(rain, sand, rip);
  if (uDebug == 5) lit = vec3(vis);
  if (uDebug == 6) lit = metres > 0.0 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 0.0, 1.0) * clamp(-metres / 5.0, 0.0, 1.0) + vec3(0.0, 0.3, 0.0);
  if (uDebug == 7) lit = vec3(spray, fall.sheet, fall.zone * (1.0 - smoothstep(0.6, 0.95, fall.edge)));
  gl_FragColor = vec4(lit, 1.0);
}
`
