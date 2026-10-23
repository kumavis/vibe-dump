// Every pass of the frame, in the order it runs:
//   silhouette  → the figure, flat: signed distance to its outline, in the
//                 square of ceiling it is cut out of (the "cookie")
//   emitters    → that opening boiled down to 4×4 patches of open area, so the
//                 pool of sun it throws on the floor can light the hall back
//   hall        → one ray per pixel through the hall: concrete, the opening
//                 and the sky beyond it, the shafts in the haze, and on the
//                 polished floor a second ray for what it mirrors (HDR)
//   resolve     → that frame blended into the last ones, reprojected (TAA)
//   dust        → motes drifting down through the shafts, lit only inside them
//   down/up     → bloom chain
//   final       → lens, tone, grain, onto the canvas

const HEAD = /* glsl */ `#version 300 es
precision highp float;
precision highp int;
precision highp sampler3D;
`

// Without float render targets the distance field is packed into 8 bits,
// twice: red holds ±128 px at one-pixel steps for the edge, blue ±4096 px at
// coarse steps for far out.
const SDF = /* glsl */ `
float sdfDecode(vec4 v) {
#ifdef SDF8
  float fine = (v.r - 0.5) * 256.0;
  return abs(fine) < 120.0 ? fine : (v.b - 0.5) * 8192.0;
#else
  return v.r;
#endif
}
`

// And without them the frame itself has to fit in 8 bits: light is stored as
// sqrt(x / (1 + x)), which keeps fine steps in the dark and room for the
// glare, and the hit distance as sqrt(t / 512).
const HDR = /* glsl */ `
#ifdef SDF8
vec3 encHDR(vec3 c) { return sqrt(c / (1.0 + c)); }
vec3 decHDR(vec3 e) { vec3 e2 = e * e; return e2 / max(1.0 - e2, 1e-3); }
float encT(float t) { return sqrt(clamp(t / 512.0, 0.0, 1.0)); }
float decT(float a) { return a * a * 512.0; }
#else
vec3 encHDR(vec3 c) { return c; }
vec3 decHDR(vec3 e) { return e; }
float encT(float t) { return t; }
float decT(float a) { return a; }
#endif
`

const NOISE = /* glsl */ `
float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float hash13(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.zyx + 31.32);
  return fract((p3.x + p3.y) * p3.z);
}
vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}
float vnoise2(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1, 0)), f.x), mix(hash12(i + vec2(0, 1)), hash12(i + vec2(1, 1)), f.x), f.y);
}
float fbm2(vec2 p) {
  float a = 0.5, s = 0.0;
  for (int i = 0; i < 4; i++) {
    s += a * vnoise2(p);
    p = p * 2.07 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return s / 0.9375;
}
// interleaved gradient noise — a cheap, well-spread per-pixel jitter
float ign(vec2 p) { return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715)))); }
`

export const vsQuad = /* glsl */ `${HEAD}
out vec2 vUv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2)) * 2.0 - 1.0;
  vUv = p * 0.5 + 0.5;
  gl_Position = vec4(p, 0.0, 1.0);
}`

// ---------------------------------------------------------------------------
// The figure, flat. Each primitive is a projected capsule or ellipse; groups
// carry a bounding circle so a texel far from a hand never pays for its
// fingers. The result is the signed distance in cookie texels, plus how much
// of the nearest surface is hair. (The same pass as Falling Repose's.)
export const fsSilhouette = /* glsl */ `${HEAD}
uniform highp sampler2D uPrims;
uniform vec4 uGroups[12];
uniform ivec2 uRanges[12];
uniform int uGroupCount;
out vec4 o;

float cro(vec2 a, vec2 b) { return a.x * b.y - a.y * b.x; }

float sdCapsule(vec2 p, vec2 pa, vec2 pb, float ra, float rb) {
  vec2 ba = pb - pa;
  float h = dot(ba, ba);
  float b = ra - rb;
  if (h <= b * b + 1e-3) return ra > rb ? length(p - pa) - ra : length(p - pb) - rb;
  p -= pa;
  vec2 q = vec2(dot(p, vec2(ba.y, -ba.x)), dot(p, ba)) / h;
  q.x = abs(q.x);
  vec2 c = vec2(sqrt(h - b * b), b);
  float k = cro(c, q);
  float m = dot(c, q);
  float n = dot(q, q);
  if (k < 0.0) return sqrt(h * n) - ra;
  if (k > c.x) return sqrt(h * (n + 1.0 - 2.0 * q.y)) - rb;
  return m - ra;
}

float sdEllipse(vec2 p, vec2 c, vec2 cs, vec2 r) {
  p -= c;
  p = vec2(cs.x * p.x + cs.y * p.y, -cs.y * p.x + cs.x * p.y);
  float k0 = length(p / r);
  float k1 = length(p / (r * r));
  return k1 > 1e-5 ? k0 * (k0 - 1.0) / k1 : -min(r.x, r.y);
}

void main() {
  vec2 p = gl_FragCoord.xy;
  // texels: nothing reads the field further from the edge than this (the
  // widest penumbra is a few dozen), and starting here lets the group cull
  // below skip every part of the body further off than that
  float d = 64.0;
  float hair = 0.0;
  for (int g = 0; g < 12; g++) {
    if (g >= uGroupCount) break;
    vec4 G = uGroups[g];
    if (length(p - G.xy) - G.z > d + G.w) continue;
    ivec2 R = uRanges[g];
    for (int i = 0; i < 128; i++) {
      if (i >= R.y) break;
      int idx = R.x + i;
      vec4 A = texelFetch(uPrims, ivec2(idx * 2, 0), 0);
      vec4 B = texelFetch(uPrims, ivec2(idx * 2 + 1, 0), 0);
      float di = B.z == 1.0 ? sdEllipse(p, A.xy, A.zw, B.xy) : sdCapsule(p, A.xy, A.zw, B.x, B.y);
      float k = max(B.w, 1e-3);
      float h = clamp(0.5 + 0.5 * (d - di) / k, 0.0, 1.0);
      d = mix(d, di, h) - k * h * (1.0 - h);
      hair = mix(hair, B.z == 2.0 ? 1.0 : 0.0, h);
    }
  }
#ifdef SDF8
  o = vec4(clamp(d / 256.0 + 0.5, 0.0, 1.0), hair, clamp(d / 8192.0 + 0.5, 0.0, 1.0), 1.0);
#else
  o = vec4(d, hair, 0.0, 1.0);
#endif
}`

// ---------------------------------------------------------------------------
// The opening, boiled down: a 4×4 grid over the cookie, each cell holding how
// much of it is open and where the open part's centre is. Sixteen patches of
// sky in the ceiling, and sixteen of sun on the floor, light the hall.
//   r  open fraction of the cell
//   gb centroid of the open part, as a fraction of the cell (0.5 = centre)
export const fsEmitters = /* glsl */ `${HEAD}
${SDF}
uniform sampler2D uCookie;
out vec4 o;
const int N = 24;
void main() {
  vec2 cell = floor(gl_FragCoord.xy);
  float open = 0.0;
  vec2 c = vec2(0.0);
  for (int j = 0; j < N; j++)
    for (int i = 0; i < N; i++) {
      vec2 f = (vec2(i, j) + 0.5) / float(N);
      vec2 uv = (cell + f) / 4.0;
      float d = sdfDecode(textureLod(uCookie, uv, 0.0));
      float a = clamp(0.5 - d, 0.0, 1.0);
      open += a;
      c += f * a;
    }
  float n = float(N * N);
  o = vec4(open / n, open > 1e-4 ? c / open : vec2(0.5), 1.0);
}`

// ---------------------------------------------------------------------------
// The hall. Everything in it is analytic — a box, two rows of piers, a slab
// with a hole in it — so a ray finds what it hits exactly, and the budget goes
// to the light. The sun is a direction; the hole is the only way it gets in.
// For any point in the hall the question "is it in the sun" is one lookup:
// follow the sun back up to the ceiling and ask the cookie whether that spot
// is open. The distance the cookie stores turns into penumbra for free — the
// further the light has fallen from the edge, the softer the edge it draws.
const HALL = /* glsl */ `
uniform sampler2D uCookie;
// the opening as patches of light, worked out once a frame on the CPU from
// the emitter pass (see renderer.js): xz, area; how many; the area-weighted
// centres of the sky in the ceiling and the sun on the floor; their total;
// and the radiance of the sunlit floor
uniform vec4 uPatch[16];
uniform int uPatchN;
uniform vec3 uSkyC;
uniform vec3 uPoolC;
uniform float uArea;
uniform vec3 uPoolRad;
uniform highp sampler3D uNoise;
uniform vec2 uCookieRot; // cos, sin of the opening's turn in the ceiling
uniform float uCookieM; // metres per cookie texel
uniform vec3 uSun; // toward the sun
uniform vec2 uSunXZ; // uSun.xz / uSun.y: how far the light slides per metre it falls
uniform vec3 uSunColor; // irradiance of the sun, square on
uniform vec3 uSkyColor; // radiance of the sky seen through the opening
uniform vec3 uFogColor; // tint of the air's own faint glow
uniform vec4 uBeamBox; // xz bounds of the opening (margin included)
uniform vec3 uBeamB; // two directions square to the sun, for the dust's frame
uniform vec3 uBeamC;
uniform float uTime;
uniform float uDrift;
// the tuning (see tune.js)
uniform vec3 uFog; // haze everywhere, extra haze at the floor, its height (m)
uniform vec4 uDust; // clear air between streaks, dust in them, threshold, edge
uniform vec2 uDustScale; // across the light, along it (per metre)
uniform float uPhaseG; // how strongly the haze scatters forward
uniform float uSunSpread; // half-angle of the sun, for its penumbra
uniform float uBounceGain;
uniform vec4 uFloor; // reflection, polish roughness, worn roughness, tone

const float PI = 3.14159265;
const vec2 HOLE_C = vec2(ROOM_HOLE_X, ROOM_HOLE_Z);
const float SPAN = ROOM_HOLE_SPAN;
const float TOP = ROOM_H + ROOM_SLAB;
// the opening widens a touch toward the top, as a cast skylight would
const float SPLAY = 0.12;

// the haze: thin everywhere, thicker toward the floor, and dust on top
#define FOG_BASE uFog.x
#define FOG_LOW uFog.y
#define FOG_HF uFog.z
// how wide the sun is, as a half-angle: a little more than the real one,
// for the haze it shines through
#define SUN_SPREAD uSunSpread

vec2 rot(vec2 v, vec2 cs) { return vec2(cs.x * v.x - cs.y * v.y, cs.y * v.x + cs.x * v.y); }

vec2 cookieUV(vec2 xz) {
  vec2 r = xz - HOLE_C;
  r = vec2(uCookieRot.x * r.x + uCookieRot.y * r.y, -uCookieRot.y * r.x + uCookieRot.x * r.y);
  return r / SPAN + 0.5;
}

// signed distance (m) from a point on the ceiling to the opening's edge,
// negative inside it
float holeSdf(vec2 xz) {
  vec2 uv = cookieUV(xz);
  float d = sdfDecode(textureLod(uCookie, clamp(uv, 0.0, 1.0), 0.0)) * uCookieM;
  float outside = length(max(abs(uv - 0.5) - 0.5, 0.0)) * SPAN;
  // past the square's edge, a true lower bound (the shaft march skips by it)
  return outside > 0.0 ? length(vec2(max(d, 0.0), outside)) : d;
}

// how much of the sun reaches p, through the opening
float sunVis(vec3 p) {
  float h = max(ROOM_H - p.y, 0.0);
  vec2 q = p.xz + uSunXZ * h;
  if (q.x < uBeamBox.x || q.y < uBeamBox.y || q.x > uBeamBox.z || q.y > uBeamBox.w) return 0.0;
  float d = holeSdf(q);
  float pen = 0.02 + h * SUN_SPREAD / uSun.y;
  return 1.0 - smoothstep(-pen, pen, d);
}

float fogDensity(vec3 p) { return FOG_BASE + FOG_LOW * exp(-max(p.y, 0.0) / FOG_HF); }

// optical depth from o along unit d for distance t, in closed form
float opticalDepth(vec3 o, vec3 d, float t) {
  float k = d.y / FOG_HF;
  float e0 = exp(-max(o.y, 0.0) / FOG_HF);
  float low = abs(k) < 1e-4 ? e0 * t : e0 * (1.0 - exp(-k * t)) / k;
  return FOG_BASE * t + FOG_LOW * low;
}

// what the sun has lost on its way down from the opening to p
float sunPath(vec3 p) {
  float h = max(ROOM_H - p.y, 0.0);
  return exp(-opticalDepth(p, uSun, h / uSun.y));
}

// dust: the motes too small to see one by one, in slow streaks that run
// along the light and sink down it as the figure falls. The noise is read in a
// frame turned to the sun and stretched along it, so it lies in the shafts the
// way the shafts lie in the hall.
float dust(vec3 p) {
  vec3 q = vec3(dot(p, uBeamB) * uDustScale.x + uTime * 0.0013, dot(p, uBeamC) * uDustScale.x, dot(p, uSun) * uDustScale.y + uDrift);
  float n = textureLod(uNoise, q, 0.0).r * 0.6 + textureLod(uNoise, q * 3.0 + vec3(0.37, uTime * 0.002, 0.11), 0.0).g * 0.4;
  return uDust.x + uDust.y * smoothstep(uDust.z, max(uDust.w, uDust.z + 0.01), n);
}

float hg(float c, float g) {
  float g2 = g * g;
  return (1.0 - g2) / (4.0 * PI * pow(max(1.0 + g2 - 2.0 * g * c, 1e-4), 1.5));
}
// forward-scattering haze, with a little back-scatter so the shafts still
// read when the sun is behind the eye
float phase(float c) { return mix(hg(c, uPhaseG), hg(c, -0.25), 0.22); }

// ---- the opening as light --------------------------------------------------
// The emitters: sixteen patches of the opening. Each is a patch of sky in the
// ceiling shining down, and the same patch of sun thrown onto the floor
// shining up — the floor's bounce is most of what lights this hall.

struct Patch { vec3 sky; vec3 pool; float area; };

Patch emitter(int i) {
  vec4 e = uPatch[i];
  Patch P;
  P.sky = vec3(e.x, ROOM_H, e.y);
  P.pool = vec3(e.x - uSunXZ.x * ROOM_H, 0.0, e.y - uSunXZ.y * ROOM_H);
  P.area = e.z;
  return P;
}

// irradiance at p (normal n) from a small lambertian patch of unit radiance
// at e facing ne, area A; softened so it never blows up close to
float patchE(vec3 p, vec3 n, vec3 e, vec3 ne, float A) {
  vec3 v = e - p;
  float r2 = dot(v, v);
  vec3 w = v * inversesqrt(max(r2, 1e-6));
  return A * max(dot(n, w), 0.0) * max(-dot(ne, w), 0.0) / (r2 + A * 0.5);
}

// the radiance of the sunlit floor, as an emitter
vec3 poolRadiance() { return uPoolRad; }

// The shaft itself is a light: what the haze scatters out of it sideways
// glows on everything near. Four points down its axis, from the opening to the
// pool, each carrying a share of what the haze takes out of the sun.
const float BEAM_SCATTER = 0.08; // the share of the light let in that the haze throws sideways
vec3 beamPoint(int k, vec3 skyC, vec3 poolC) { return mix(skyC, poolC, (float(k) + 0.5) / 4.0); }
vec3 beamIntensity(float area) { return uSunColor * (uSun.y * area * BEAM_SCATTER / (4.0 * PI * 4.0)); }

// The eye adapts in a dark hall, and the light that bounces round and round
// it is more than one bounce can say: this lifts it so the concrete reads.
#define BOUNCE_GAIN uBounceGain

// all the light that comes back off the floor and down from the sky
vec3 bounce(vec3 p, vec3 n, vec3 skyC, vec3 poolC, float area) {
  float sky = 0.0, pool = 0.0;
  for (int i = 0; i < 16; i++) {
    if (i >= uPatchN) break;
    Patch P = emitter(i);
    sky += patchE(p, n, P.sky, vec3(0, -1, 0), P.area);
    pool += patchE(p, n, P.pool, vec3(0, 1, 0), P.area);
  }
  float beam = 0.0;
  for (int k = 0; k < 4; k++) {
    vec3 v = beamPoint(k, skyC, poolC) - p;
    float r2 = dot(v, v);
    beam += max(dot(n, v), 0.0) * inversesqrt(r2) / (r2 + 16.0);
  }
  vec3 pr = poolRadiance();
  // and the faint second bounce off everything else, without direction
  return uSkyColor * sky + BOUNCE_GAIN * (pr * pool + beamIntensity(area) * beam + (uSkyColor * 0.002 + pr * 0.008) * (0.75 - 0.25 * n.y));
}

// ---- the hall's surfaces ---------------------------------------------------
// materials: 0 floor, 1 ceiling, 2 wall, 3 pier, 4 opening (sky or reveal)
struct Hit { float t; vec3 n; int mat; };

void slab(float o, float d, float lo, float hi, inout float t0, inout float t1) {
  if (abs(d) < 1e-7) {
    if (o < lo || o > hi) t0 = 1e9;
    return;
  }
  float a = (lo - o) / d, b = (hi - o) / d;
  t0 = max(t0, min(a, b));
  t1 = min(t1, max(a, b));
}

Hit traceHall(vec3 o, vec3 d) {
  Hit h;
  // the inside of the box
  vec3 hi = vec3(ROOM_HALF_W, ROOM_H, ROOM_Z1), lo = vec3(-ROOM_HALF_W, 0.0, ROOM_Z0);
  vec3 inv = 1.0 / vec3(abs(d.x) < 1e-7 ? 1e-7 : d.x, abs(d.y) < 1e-7 ? 1e-7 : d.y, abs(d.z) < 1e-7 ? 1e-7 : d.z);
  vec3 tExit = max((lo - o) * inv, (hi - o) * inv);
  h.t = min(tExit.x, min(tExit.y, tExit.z));
  if (h.t == tExit.y) {
    h.mat = d.y < 0.0 ? 0 : 1;
    h.n = vec3(0.0, d.y < 0.0 ? 1.0 : -1.0, 0.0);
  } else if (h.t == tExit.x) {
    h.mat = 2;
    h.n = vec3(-sign(d.x), 0.0, 0.0);
  } else {
    h.mat = 2;
    h.n = vec3(0.0, 0.0, -sign(d.z));
  }
  // the piers: for each row, the stretch of ray inside its slab of x, then
  // the piers along that stretch, nearest first
  for (int row = 0; row < 2; row++) {
    float px = row == 0 ? -ROOM_PIER_X : ROOM_PIER_X;
    float a = 0.0, b = h.t;
    slab(o.x, d.x, px - ROOM_PIER_HALF, px + ROOM_PIER_HALF, a, b);
    if (a >= b) continue;
    float za = o.z + d.z * a, zb = o.z + d.z * b;
    float k0 = floor((min(za, zb) - ROOM_PIER_Z0 + ROOM_PIER_HALF) / ROOM_PIER_DZ);
    float k1 = floor((max(za, zb) - ROOM_PIER_Z0 + ROOM_PIER_HALF) / ROOM_PIER_DZ);
    k0 = max(k0, 0.0);
    k1 = min(k1, float(ROOM_PIER_N - 1));
    float dir = d.z >= 0.0 ? 1.0 : -1.0;
    float kStart = dir > 0.0 ? k0 : k1;
    for (int i = 0; i < 12; i++) {
      float k = kStart + dir * float(i);
      if (k < k0 || k > k1) break;
      float pz = ROOM_PIER_Z0 + k * ROOM_PIER_DZ;
      float ta = 0.0, tb = h.t, xa = 0.0, xb = h.t;
      slab(o.x, d.x, px - ROOM_PIER_HALF, px + ROOM_PIER_HALF, xa, xb);
      slab(o.z, d.z, pz - ROOM_PIER_HALF, pz + ROOM_PIER_HALF, ta, tb);
      float tin = max(xa, ta), tout = min(xb, tb);
      if (tin < tout && tin > 1e-3 && tin < h.t) {
        h.t = tin;
        h.mat = 3;
        h.n = xa > ta ? vec3(-sign(d.x), 0.0, 0.0) : vec3(0.0, 0.0, -sign(d.z));
        break;
      }
    }
  }
  return h;
}

// ---- concrete ----------------------------------------------------------------
// Smooth cast concrete in the walls, piers and ceiling (see concrete() below).
// The floor is ground and polished, with saw-cut joints every six metres and
// the aggregate showing through.

// distance to the nearest grid line, in metres, over a cell of size s
vec2 gridDist(vec2 p, vec2 s) {
  vec2 f = abs(fract(p / s + 0.5) - 0.5) * s;
  return f;
}

// an anti-aliased line: 1 on the line of half-width w, given the footprint fp
// (wider than a pixel it is drawn as-is; narrower, it fades rather than shimmers)
float line(float dist, float w, float fp) {
  float W = max(w, fp);
  return (w / W) * (1.0 - smoothstep(W * 0.5, W * 1.5, dist));
}

struct Surf { vec3 albedo; float rough; vec3 n; float ao; };

// coordinates on a vertical face: along it, and up
vec2 faceUV(vec3 p, vec3 n) { return abs(n.x) > 0.5 ? vec2(p.z, p.y) : vec2(p.x, p.y); }

Surf concrete(vec3 p, vec3 n, int mat, float fp) {
  Surf s;
  s.n = n;
  s.ao = 1.0;
  if (mat == 0) {
    // the floor
    vec2 q = p.xz;
    float mott = fbm2(q * 0.07) * 0.6 + fbm2(q * 0.45 + 7.0) * 0.4;
    float speck = hash12(floor(q * 90.0));
    float agg = smoothstep(0.82, 0.95, speck) * (1.0 - smoothstep(0.004, 0.02, fp));
    // dark, so what it mirrors can show in it
    vec3 base = vec3(1.0, 0.971, 0.929) * uFloor.w * mix(0.72, 1.18, mott);
    base = mix(base, vec3(0.34, 0.33, 0.31), agg * 0.5);
    vec2 g = gridDist(q, vec2(6.0));
    float joint = max(line(g.x, 0.012, fp), line(g.y, 0.012, fp));
    s.albedo = base * (1.0 - 0.8 * joint);
    // the polish: glassy, worn duller in broad swirls, never perfect
    float wear = fbm2(q * 0.11 + 3.0);
    s.rough = mix(uFloor.y, uFloor.z, smoothstep(0.35, 0.85, wear)) + joint * 0.3;
    // ambient occlusion where the floor meets the walls and the piers
    float dw = min(ROOM_HALF_W - abs(p.x), min(p.z - ROOM_Z0, ROOM_Z1 - p.z));
    float zc = ROOM_PIER_Z0 + clamp(floor((p.z - ROOM_PIER_Z0) / ROOM_PIER_DZ + 0.5), 0.0, float(ROOM_PIER_N - 1)) * ROOM_PIER_DZ;
    vec2 pd = abs(vec2(abs(p.x) - ROOM_PIER_X, p.z - zc)) - ROOM_PIER_HALF;
    float dp = length(max(pd, 0.0)) + min(max(pd.x, pd.y), 0.0);
    s.ao = (1.0 - 0.55 * exp(-dw / 1.6)) * (1.0 - 0.5 * exp(-dp / 1.2));
    return s;
  }
  // Walls, piers and ceiling: concrete the way Tadao Ando casts it, against
  // varnished formwork, into one smooth and nearly even grey with only the
  // softest cloudiness of the pour. The ceiling is left at that: it is meant
  // to be lost in the dark.
  vec2 uv = mat == 1 ? p.xz : faceUV(p, n);
  float cloud = fbm2(uv * 0.16 + float(mat) * 5.0);
  vec3 base = vec3(0.34, 0.335, 0.325) * mix(0.93, 1.05, cloud);
  s.rough = 0.85;
  if (mat == 1) {
    s.albedo = base;
    s.ao = 1.0 - 0.35 * exp(-min(ROOM_HALF_W - abs(p.x), min(p.z - ROOM_Z0, ROOM_Z1 - p.z)) / 2.0);
    return s;
  }
  // The walls and piers keep the marks of the formwork and nothing else:
  // panels of 1.8 m by 0.9 m, the tatami module, each a hair different from its
  // neighbours, with hairline joints between them and the tie holes they leave.
  // A pier's face is measured from its own middle, so its two panels sit
  // square on it, a joint down the centre line.
  if (mat == 3) {
    float zc = ROOM_PIER_Z0 + clamp(floor((p.z - ROOM_PIER_Z0) / ROOM_PIER_DZ + 0.5), 0.0, float(ROOM_PIER_N - 1)) * ROOM_PIER_DZ;
    uv.x = abs(n.x) > 0.5 ? p.z - zc : p.x - sign(p.x) * ROOM_PIER_X;
  }
  vec2 cell = vec2(1.8, 0.9);
  vec2 id = floor(uv / cell);
  vec2 f = uv - (id + 0.5) * cell;
  base *= 0.985 + 0.03 * hash12(id + float(mat) * 17.0);
  vec2 g = cell * 0.5 - abs(f);
  float joint = max(line(g.x, 0.0015, fp), line(g.y, 0.0015, fp));
  // tie holes: on the walls three across and two up in each panel, at its
  // sixths and quarters; on a pier one in the middle of each panel, so two
  // across the face
  vec2 tc = mat == 3 ? cell : vec2(cell.x / 3.0, cell.y * 0.5);
  vec2 tq = mod(uv, tc) - tc * 0.5;
  float r = 0.016, W = max(r, fp);
  float hole = (r / W) * (r / W) * (1.0 - smoothstep(W * 0.6, W * 1.4, length(tq)));
  s.albedo = base * (1.0 - 0.12 * joint) * (1.0 - 0.6 * hole);
  s.ao = 1.0 - 0.5 * hole;
  // darker toward the floor where they meet it, and at the ceiling
  s.ao *= (1.0 - 0.45 * exp(-p.y / 1.4)) * (1.0 - 0.3 * exp(-(ROOM_H - p.y) / 1.5));
  return s;
}

// ---- the sky beyond the opening --------------------------------------------
vec3 sky(vec3 d, bool disc) {
  float mu = dot(d, uSun);
  vec3 c = uSkyColor * (0.75 + 0.45 * d.y);
  c += uSunColor * (0.05 * pow(max(mu, 0.0), 6.0) + 0.25 * pow(max(mu, 0.0), 80.0));
  if (disc) c += uSunColor * 1500.0 * smoothstep(0.99996, 0.99999, mu);
  return c;
}

// What a ray that has reached the ceiling inside the opening sees: up
// through the thickness of the slab, either the cast reveal of the opening
// (lit by the sun where it faces it) or the sky.
vec3 opening(vec3 p, vec3 d, bool disc) {
  float t = 0.0;
  float hz = max(length(d.xz), 1e-3);
  for (int i = 0; i < 20; i++) {
    vec3 q = p + d * t;
    if (q.y >= TOP) return sky(d, disc);
    float f = holeSdf(q.xz) - SPLAY * (q.y - ROOM_H);
    if (f > -0.004) {
      // the reveal: its normal faces into the opening and a little up
      vec2 e = vec2(0.05, 0.0);
      vec2 gr = vec2(holeSdf(q.xz + e.xy) - holeSdf(q.xz - e.xy), holeSdf(q.xz + e.yx) - holeSdf(q.xz - e.yx));
      vec3 n = normalize(vec3(-gr.x, SPLAY * 2.0 * e.x, -gr.y));
      float lit = max(dot(n, uSun), 0.0);
      // does the sun reach it over the top edge of the slab?
      vec2 top = q.xz + uSunXZ * (TOP - q.y);
      lit *= 1.0 - smoothstep(-0.05, 0.05, holeSdf(top) - SPLAY * ROOM_SLAB);
      vec3 alb = vec3(0.4, 0.39, 0.37);
      return alb / PI * (uSunColor * lit + uSkyColor * PI * 0.55 * (0.5 + 0.5 * n.y));
    }
    t += max(-f * 0.85 / (hz + SPLAY * max(d.y, 0.0)), 0.004);
  }
  return sky(d, disc);
}

// ---- light in the air ------------------------------------------------------
// The shafts: march only the stretch of ray inside the slanted prism the
// opening's bounds sweep down to the floor (in sheared coordinates the prism
// is an upright box).
vec3 shafts(vec3 o, vec3 d, float tEnd, int steps, float jit) {
  vec2 so = o.xz + uSunXZ * (ROOM_H - o.y);
  vec2 sd = d.xz - uSunXZ * d.y;
  float t0 = 0.0, t1 = tEnd;
  slab(so.x, sd.x, uBeamBox.x, uBeamBox.z, t0, t1);
  slab(so.y, sd.y, uBeamBox.y, uBeamBox.w, t0, t1);
  slab(o.y, d.y, 0.0, ROOM_H, t0, t1);
  if (t1 <= t0) return vec3(0.0);
  float dt = (t1 - t0) / float(steps);
  // transmittance back to the eye, from the closed form at each end and
  // interpolated between (it changes slowly)
  float tau0 = opticalDepth(o, d, t0), tau1 = opticalDepth(o, d, t1);
  // Most of the prism is dark. The spot on the ceiling a sample looks up
  // through moves stepM per step, and the cookie is a distance field, so a
  // sample that far outside the edge rules out every later one that can't
  // have closed the gap: skip them, and the lit samples are the same.
  float stepM = max(length(sd) * dt, 1e-4);
  float penMax = 0.02 + ROOM_H * SUN_SPREAD / uSun.y;
  float acc = 0.0;
  int i = 0;
  for (int it = 0; it < 128; it++) {
    if (i >= steps) break;
    float f = (float(i) + jit) / float(steps);
    float t = mix(t0, t1, f);
    vec3 p = o + d * t;
    float dd = holeSdf(so + sd * t); // where p looks up through the ceiling
    float pen = 0.02 + (ROOM_H - p.y) * SUN_SPREAD / uSun.y;
    if (dd >= pen) {
      i += clamp(int((dd - penMax) * 0.9 / stepM), 1, steps);
      continue;
    }
    float v = 1.0 - smoothstep(-pen, pen, dd);
    acc += v * fogDensity(p) * dust(p) * sunPath(p) * exp(-mix(tau0, tau1, f));
    i++;
  }
  return uSunColor * (acc * dt * phase(dot(d, uSun)));
}

// The air's own glow: haze lit faintly by the floor's bounce and the sky in
// the opening, from the totals of both. A few coarse steps; it has no edges.
vec3 airGlow(vec3 o, vec3 d, float tEnd, float jit, vec3 skyC, vec3 poolC, float area) {
  const int N = 7;
  float tMax = min(tEnd, 260.0);
  vec3 acc = vec3(0.0);
  vec3 pool = poolRadiance();
  for (int i = 0; i < N; i++) {
    float f = (float(i) + jit) / float(N);
    float t = tMax * f * f; // denser near the eye
    float dt = tMax * (2.0 * f + 1.0 / float(N)) / float(N);
    vec3 p = o + d * t;
    // the sky patch faces down at us, the sunlit pool faces up
    vec3 vs = skyC - p, vp = poolC - p;
    float rs = dot(vs, vs), rp = dot(vp, vp);
    float es = area * max(vs.y, 0.0) * inversesqrt(rs) / (rs + area);
    float ep = area * max(-vp.y, 0.0) * inversesqrt(rp) / (rp + area);
    float eb = 0.0;
    for (int k = 0; k < 4; k++) {
      vec3 v = beamPoint(k, skyC, poolC) - p;
      eb += 1.0 / (dot(v, v) + 16.0);
    }
    vec3 L = uSkyColor * es + BOUNCE_GAIN * (pool * ep + beamIntensity(area) * eb) + uFogColor;
    acc += L * fogDensity(p) * exp(-opticalDepth(o, d, t)) * dt;
  }
  return acc / (4.0 * PI);
}

// ---- shading a hit ---------------------------------------------------------
float ggxD(float nh, float a) {
  float a2 = a * a;
  float k = nh * nh * (a2 - 1.0) + 1.0;
  return a2 / (PI * k * k);
}
float smithV(float nv, float nl, float a) {
  float k = a * 0.5;
  return 0.25 / ((nv * (1.0 - k) + k) * (nl * (1.0 - k) + k));
}
float schlick(float c) {
  float f = 1.0 - clamp(c, 0.0, 1.0);
  float f2 = f * f;
  return 0.04 + 0.96 * f2 * f2 * f;
}

// a microfacet normal, importance-sampled from the GGX lobe
vec3 ggxSample(vec3 n, float a, vec2 xi) {
  float phi = 2.0 * PI * xi.x;
  float ct = sqrt((1.0 - xi.y) / (1.0 + (a * a - 1.0) * xi.y));
  float st = sqrt(max(1.0 - ct * ct, 0.0));
  vec3 t = abs(n.y) < 0.99 ? normalize(cross(n, vec3(0, 1, 0))) : vec3(1, 0, 0);
  vec3 b = cross(n, t);
  return normalize(t * st * cos(phi) + b * st * sin(phi) + n * ct);
}

// the diffuse and the sun's specular at a surface; v points back at the eye
// (the floor's own highlight goes out in spec, apart from the diffuse, so
// the polish can take its share of the diffuse alone)
vec3 lightSurface(vec3 p, Surf s, vec3 v, int mat, vec3 skyC, vec3 poolC, float area, out vec3 spec) {
  vec3 n = s.n;
  float sun = sunVis(p + n * 0.02) * max(dot(n, uSun), 0.0);
  vec3 col = vec3(0.0);
  spec = vec3(0.0);
  if (sun > 0.0) {
    vec3 E = uSunColor * sun * sunPath(p);
    col += s.albedo / PI * E;
    if (mat == 0) {
      // the polished floor's highlight, from the sun itself
      float a = max(s.rough * s.rough, 0.002);
      vec3 hv = normalize(uSun + v);
      float nl = max(dot(n, uSun), 1e-3), nv = max(dot(n, v), 1e-3);
      spec = E * ggxD(max(dot(n, hv), 0.0), a) * smithV(nv, nl, a) * schlick(max(dot(v, hv), 0.0));
    }
  }
  col += s.albedo / PI * bounce(p, n, skyC, poolC, area) * s.ao;
  return col;
}
`

// The whole frame's light in one pass, at the governor's resolution.
export const fsHall = /* glsl */ `${HEAD}
${SDF}
${HDR}
${NOISE}
${HALL}
uniform vec2 uRes;
uniform vec2 uJitter;
uniform vec3 uCamPos;
uniform vec3 uRight;
uniform vec3 uUp;
uniform vec3 uFwd;
uniform float uFocal;
uniform float uAspect;
uniform int uFrame;
uniform int uSteps;
uniform int uReflSteps;
in vec2 vUv;
out vec4 o;

// everything a ray sees along its way and where it lands, bar reflections
vec3 look(vec3 ro, vec3 rd, Hit h, int steps, float jit, float fp, bool primary, vec3 skyC, vec3 poolC, float area, out Surf s, out vec3 p, out vec3 surf) {
  p = ro + rd * h.t;
  vec3 col;
  s.rough = 1.0;
  s.n = h.n;
  if (h.mat == 1) {
    // the ceiling — or, inside the opening, whatever is up through it
    float d = holeSdf(p.xz);
    // (the field stops 64 texels out, about 2.6 m: a footprint wider than 5 m
    // would read that as near the edge)
    float cov = clamp(0.5 - d / clamp(fp, 1e-3, 5.0), 0.0, 1.0);
    vec3 up = cov > 0.0 ? opening(p, rd, primary) : vec3(0.0);
    s = concrete(p, h.n, 1, fp);
    vec3 spec;
    vec3 cl = cov < 1.0 ? lightSurface(p, s, -rd, 1, skyC, poolC, area, spec) : vec3(0.0);
    col = mix(cl, up, cov);
    surf = col;
    s.rough = 1.0;
  } else {
    s = concrete(p, h.n, h.mat, fp);
    vec3 spec;
    col = lightSurface(p, s, -rd, h.mat, skyC, poolC, area, spec);
    surf = col;
    col += spec;
  }
  float T = exp(-opticalDepth(ro, rd, h.t));
  col *= T;
  surf *= T;
  col += shafts(ro, rd, h.t, steps, jit);
  col += airGlow(ro, rd, h.t, fract(jit + 0.37), skyC, poolC, area);
  return col;
}

void main() {
  vec2 frag = gl_FragCoord.xy + uJitter;
  vec2 ndc = frag / uRes * 2.0 - 1.0;
  vec3 rd = normalize(uFwd * uFocal + uRight * ndc.x * uAspect + uUp * ndc.y);
  vec3 ro = uCamPos;
  float jit = fract(ign(gl_FragCoord.xy) + float(uFrame % 64) * 0.618034);

  // the opening's totals, for the air's glow
  vec3 skyC = uSkyC, poolC = uPoolC;
  float area = uArea;

  Hit h = traceHall(ro, rd);
  float pixAngle = 2.0 / (uRes.y * uFocal);
  float fp = h.t * pixAngle / max(abs(dot(rd, h.n)), 0.08);
  Surf s;
  vec3 p, surf;
  vec3 col = look(ro, rd, h, uSteps, jit, fp * 0.7, true, skyC, poolC, area, s, p, surf);
  // what the resolve reprojects by: where the eye sees this pixel's light come from
  float tOut = h.t;

  if (h.mat == 0) {
    // the polished floor: a second ray, scattered by how worn the polish is
    vec3 v = -rd;
    // a low-discrepancy walk over the lobe, offset per pixel, so the frames
    // the resolve blends cover it evenly; and none of the long tail, whose
    // rare rays into the bright opening would only be glitter
    vec2 xi = fract(float(uFrame % 64) * vec2(0.7548777, 0.5698403) + hash22(gl_FragCoord.xy));
    xi.y *= 0.8;
    float a = max(s.rough * s.rough, 0.0015);
    vec3 m = ggxSample(s.n, a, xi);
    vec3 r = reflect(rd, m);
    if (r.y <= 0.002) r = reflect(rd, s.n);
    Hit h2 = traceHall(p + s.n * 0.01, r);
    Surf s2;
    vec3 p2, surf2;
    float fp2 = (h.t + h2.t) * pixAngle / max(abs(dot(r, h2.n)), 0.08) + h2.t * a;
    vec3 refl = look(p + s.n * 0.01, r, h2, uReflSteps, fract(jit + 0.5), fp2, false, skyC, poolC, area, s2, p2, surf2);
    float F = schlick(max(dot(v, m), 0.0)) * uFloor.x;
    vec3 mirrored = refl * F * exp(-opticalDepth(ro, rd, h.t));
    // the polish takes its share from the floor's own colour
    col += mirrored - F * surf;
    // a mirror image moves on screen as if it were as far away as the thing
    // it mirrors; reproject by that, as much as the image is what shows
    float lm = dot(mirrored, vec3(0.2126, 0.7152, 0.0722)), lc = dot(col, vec3(0.2126, 0.7152, 0.0722));
    tOut = mix(h.t, h.t + h2.t, clamp(lm / max(lc, 1e-5), 0.0, 1.0));
  }
  o = vec4(encHDR(max(col, 0.0)), encT(tOut));
}`

// ---------------------------------------------------------------------------
// Temporal resolve: reproject last frame's history through the depth this
// frame found, clamp it to what this frame's neighbourhood allows, and blend.
// The hall's light is all noise at one sample a pixel; over a few frames it
// is not.
export const fsResolve = /* glsl */ `${HEAD}
${HDR}
uniform sampler2D uCur;
uniform sampler2D uHist;
uniform vec2 uRes;
uniform vec3 uCamPos;
uniform vec3 uRight;
uniform vec3 uUp;
uniform vec3 uFwd;
uniform float uFocal;
uniform float uAspect;
uniform mat4 uPrevViewProj;
uniform float uBlend; // weight of the new frame
uniform float uValid; // 0 when there is no history worth keeping
in vec2 vUv;
out vec4 o;

vec3 toYCoCg(vec3 c) { return vec3(0.25 * c.r + 0.5 * c.g + 0.25 * c.b, 0.5 * c.r - 0.5 * c.b, -0.25 * c.r + 0.5 * c.g - 0.25 * c.b); }
vec3 fromYCoCg(vec3 c) { return vec3(c.x + c.y - c.z, c.x + c.z, c.x - c.y - c.z); }
// compress the range so a single blazing texel doesn't run the neighbourhood
vec3 squash(vec3 c) { return c / (1.0 + max(c.r, max(c.g, c.b))); }
vec3 unsquash(vec3 c) { return c / max(1.0 - max(c.r, max(c.g, c.b)), 1e-4); }
// a NaN or an infinity from one bad sample reads as black, not as poison
vec3 safe(vec3 c) { return c.r + c.g + c.b < 1e30 ? max(c, 0.0) : vec3(0.0); }

void main() {
  ivec2 ip = ivec2(gl_FragCoord.xy);
  vec4 cur = texelFetch(uCur, ip, 0);
  cur = vec4(safe(decHDR(cur.rgb)), decT(cur.a));
  vec3 m1 = vec3(0.0), m2 = vec3(0.0);
  vec3 c0 = toYCoCg(squash(cur.rgb));
  for (int j = -1; j <= 1; j++)
    for (int i = -1; i <= 1; i++) {
      vec3 c = toYCoCg(squash(safe(decHDR(texelFetch(uCur, clamp(ip + ivec2(i, j), ivec2(0), ivec2(uRes) - 1), 0).rgb))));
      m1 += c;
      m2 += c * c;
    }
  m1 /= 9.0;
  vec3 sigma = sqrt(max(m2 / 9.0 - m1 * m1, 0.0));
  vec3 lo = m1 - sigma * 1.6, hi = m1 + sigma * 1.6;

  vec2 ndc = vUv * 2.0 - 1.0;
  vec3 rd = normalize(uFwd * uFocal + uRight * ndc.x * uAspect + uUp * ndc.y);
  vec3 wp = uCamPos + rd * cur.a;
  vec4 clip = uPrevViewProj * vec4(wp, 1.0);
  vec2 puv = clip.xy / clip.w * 0.5 + 0.5;
  bool inside = clip.w > 0.0 && all(greaterThanEqual(puv, vec2(0.0))) && all(lessThanEqual(puv, vec2(1.0)));

  vec3 res = c0;
  if (uValid > 0.5 && inside) {
    vec3 hist = toYCoCg(squash(decHDR(textureLod(uHist, puv, 0.0).rgb)));
    hist = clamp(hist, lo, hi);
    // a texel that moved a long way on screen trusts its history less
    vec2 motion = (puv - vUv) * uRes;
    float w = clamp(uBlend + length(motion) * 0.02, uBlend, 0.6);
    res = mix(hist, c0, w);
  }
  vec3 outc = safe(unsquash(fromYCoCg(res)));
  o = vec4(encHDR(outc), encT(cur.a));
}`

// ---------------------------------------------------------------------------
// Dust: motes falling through the shafts. Each lives in the slanted prism the
// opening sweeps down to the floor, wrapping round in height as it falls, so
// all of them are where the light might be; the cookie says which are. The
// fall is the figure's own clock, slowed to the speed of dust.
export const vsDust = /* glsl */ `${HEAD}
${SDF}
${HDR}
${NOISE}
${HALL}
layout(location = 0) in vec2 aCorner;
layout(location = 1) in vec4 aA; // position in the prism (0..1)^3, seed
layout(location = 2) in vec4 aB; // fall speed, size (m), brightness, spare
uniform mat4 uViewProj;
uniform vec2 uRes;
uniform float uFall;
uniform float uShutter;
uniform vec3 uCamPos;
uniform float uPxPerUnit;
uniform float uFocus;
uniform sampler2D uScene;
uniform float uMoteGlow;
out vec2 vLocal;
out float vHalfLen;
out float vRad;
out vec3 vColor;

const float TAU = 6.2831853;

vec3 placeAt(float fall) {
  float s = aA.w;
  // height wraps through the hall; xz is a fixed spot in the opening's square,
  // slid along the sun by height so it stays inside the prism
  float y = mod(aA.y * ROOM_H - fall * aB.x, ROOM_H);
  vec2 local = (aA.xz - 0.5) * SPAN;
  local += 0.35 * vec2(sin(fall * (0.9 + s) + s * 40.0), cos(fall * (0.7 + s) + s * 17.0));
  vec2 xz = HOLE_C + rot(local, uCookieRot) - uSunXZ * (ROOM_H - y);
  return vec3(xz.x, y, xz.y);
}

void main() {
  vec3 cur = placeAt(uFall);
  vec3 prev = cur + vec3(0.0, uShutter * aB.x, 0.0);
  float vis = sunVis(cur);
  vec4 c0 = uViewProj * vec4(cur, 1.0);
  vec4 c1 = uViewProj * vec4(prev, 1.0);
  if (vis < 0.02 || c0.w < 0.3 || c1.w < 0.3) {
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    return;
  }
  vec2 s0 = (c0.xy / c0.w * 0.5 + 0.5) * uRes;
  vec2 s1 = (c1.xy / c1.w * 0.5 + 0.5) * uRes;
  float depth = c0.w;
  // behind a pier, or past the wall the eye is looking at
  float sceneT = decT(texture(uScene, clamp(s0 / uRes, 0.0, 1.0)).a);
  if (distance(cur, uCamPos) > sceneT + 0.5) {
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    return;
  }
  float core = aB.y * uPxPerUnit / depth;
  float coc = 0.012 * uPxPerUnit * abs(depth - uFocus) / (depth * uFocus);
  float rad = clamp(sqrt(core * core + coc * coc), 0.6, uRes.y * 0.02);
  vec2 ax = s0 - s1;
  float len = length(ax);
  vec2 u = len > 1e-3 ? ax / len : vec2(0.0, 1.0);
  vec2 v = vec2(-u.y, u.x);
  float halfLen = len * 0.5 + rad + 1.0;
  float halfWid = rad + 1.0;
  vec2 mid = (s0 + s1) * 0.5;
  vec2 pos = mid + u * aCorner.x * halfLen + v * aCorner.y * halfWid;
  vLocal = vec2(aCorner.x * halfLen, aCorner.y * halfWid);
  vHalfLen = len * 0.5;
  vRad = rad;
  vec3 dir = normalize(cur - uCamPos);
  // a mote scatters the sun forward, the way the haze does but more so
  float ph = phase(dot(dir, uSun)) * 4.0 + 0.05;
  float energy = max(core, 0.25) * max(core, 0.25) / (rad * rad);
  float wrap = smoothstep(0.0, 1.5, cur.y) * (1.0 - smoothstep(ROOM_H - 2.0, ROOM_H, cur.y));
  vColor = uSunColor * sunPath(cur) * vis * wrap * ph * aB.z * energy * exp(-opticalDepth(uCamPos, dir, depth)) * 0.0065 * uMoteGlow;
  gl_Position = vec4(pos / uRes * 2.0 - 1.0, 0.0, 1.0);
}`

export const fsDust = /* glsl */ `${HEAD}
in vec2 vLocal;
in float vHalfLen;
in float vRad;
in vec3 vColor;
out vec4 o;
void main() {
  float dx = max(abs(vLocal.x) - vHalfLen, 0.0);
  float dist = length(vec2(dx, vLocal.y));
  float a = exp(-dist * dist / max(vRad * vRad * 0.5, 0.2));
  o = vec4(vColor * a, 1.0);
}`

// ---------------------------------------------------------------------------
// Bloom: the dual-filter (Kawase) chain — cheap, wide, and smooth.
export const fsDown = /* glsl */ `${HEAD}
${HDR}
uniform sampler2D uSrc;
uniform vec2 uTexel;
uniform int uFirst; // reading the frame itself, which may be encoded
in vec2 vUv;
out vec4 o;
vec3 at(vec2 uv) {
  vec3 c = texture(uSrc, uv).rgb;
  return uFirst == 1 ? decHDR(c) : c;
}
void main() {
  vec2 h = uTexel * 0.5;
  vec3 c = at(vUv) * 4.0;
  c += at(vUv - h);
  c += at(vUv + h);
  c += at(vUv + vec2(h.x, -h.y));
  c += at(vUv - vec2(h.x, -h.y));
  o = vec4(c / 8.0, 1.0);
}`

export const fsUp = /* glsl */ `${HEAD}
uniform sampler2D uSrc;
uniform vec2 uTexel;
in vec2 vUv;
out vec4 o;
void main() {
  vec2 h = uTexel * 0.5;
  vec3 c = texture(uSrc, vUv + vec2(-h.x * 2.0, 0.0)).rgb;
  c += texture(uSrc, vUv + vec2(-h.x, h.y)).rgb * 2.0;
  c += texture(uSrc, vUv + vec2(0.0, h.y * 2.0)).rgb;
  c += texture(uSrc, vUv + vec2(h.x, h.y)).rgb * 2.0;
  c += texture(uSrc, vUv + vec2(h.x * 2.0, 0.0)).rgb;
  c += texture(uSrc, vUv + vec2(h.x, -h.y)).rgb * 2.0;
  c += texture(uSrc, vUv + vec2(0.0, -h.y * 2.0)).rgb;
  c += texture(uSrc, vUv + vec2(-h.x, -h.y)).rgb * 2.0;
  o = vec4(c / 12.0, 1.0);
}`

// ---------------------------------------------------------------------------
// The eye's adaptation: the mean log luminance of the frame, from a 5×5 of the
// smallest bloom level, weighted to the middle where the eye is looking, and
// eased toward. The eye stops down fast in a glare and opens again slowly.
export const fsAdapt = /* glsl */ `${HEAD}
uniform sampler2D uSrc;
uniform sampler2D uPrev;
uniform float uDt; // seconds since the last frame; negative to start afresh
out vec4 o;
void main() {
  float acc = 0.0, wsum = 0.0;
  for (int j = 0; j < 5; j++)
    for (int i = 0; i < 5; i++) {
      vec2 uv = (vec2(i, j) + 0.5) / 5.0;
      float w = 1.0 - 0.6 * length(uv - 0.5);
      vec3 c = textureLod(uSrc, uv, 0.0).rgb;
      acc += w * log(max(dot(c, vec3(0.2126, 0.7152, 0.0722)), 1e-4));
      wsum += w;
    }
  float now = acc / wsum;
  if (uDt < 0.0) {
    o = vec4(now, 0.0, 0.0, 1.0);
    return;
  }
  float prev = texelFetch(uPrev, ivec2(0), 0).r;
  float tau = now > prev ? 0.6 : 2.5;
  o = vec4(mix(prev, now, 1.0 - exp(-uDt / tau)), 0.0, 0.0, 1.0);
}`

// ---------------------------------------------------------------------------
export const fsFinal = /* glsl */ `${HEAD}
${SDF}
${HDR}
${NOISE}
uniform sampler2D uScene;
uniform sampler2D uBloom;
uniform sampler2D uCookie;
uniform sampler2D uDust;
uniform sampler2D uAdapt;
uniform int uAdaptOn;
uniform float uKey; // the log luminance the eye is happy at; brighter stops it down
uniform vec2 uRes;
uniform float uTime;
uniform float uFade;
uniform float uExposure;
uniform float uBloomAmt;
uniform float uGrain;
uniform float uFringe;
uniform float uPx;
uniform int uDebug;
in vec2 vUv;
out vec4 o;

vec3 aces(vec3 x) {
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

void main() {
  vec2 uv = vUv;
  if (uDebug == 1) {
    // the cookie itself: the opening, black on paper, in its square
    vec2 q = (uv - 0.5) * vec2(uRes.x / uRes.y, 1.0) + 0.5;
    if (q.x < 0.0 || q.x > 1.0) {
      o = vec4(0.3, 0.3, 0.3, 1.0);
      return;
    }
    vec4 st = texture(uCookie, q);
    float m = clamp(0.5 - sdfDecode(st), 0.0, 1.0);
    o = vec4(mix(vec3(0.85, 0.83, 0.8), vec3(0.05 + 0.4 * st.y, 0.05, 0.05), m), 1.0);
    return;
  }
  vec2 cc = uv - 0.5;
  cc.x *= uRes.x / uRes.y;
  float r2 = dot(cc, cc);
  vec2 ca = (uv - 0.5) * r2 * uFringe;
  vec3 col;
  col.r = decHDR(texture(uScene, uv - ca).rgb).r;
  col.g = decHDR(texture(uScene, uv).rgb).g;
  col.b = decHDR(texture(uScene, uv + ca).rgb).b;
  col += texture(uDust, uv).rgb;
  col += texture(uBloom, uv).rgb * uBloomAmt;
  // the eye only ever stops down, never opens up past the set exposure, so
  // the dark stays dark and only a glare is tamed
  float adapt = uAdaptOn == 1 ? clamp(exp(uKey - texelFetch(uAdapt, ivec2(0), 0).r), 0.12, 1.0) : 1.0;
  col *= uExposure * adapt;

  float vig = 1.0 - smoothstep(0.2, 1.3, length(cc * vec2(0.9, 1.1)) * 1.2);
  col *= mix(0.35, 1.0, vig);

  col = aces(col);
  // grade: black stays black; the shadows cool, the light warms
  float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = mix(col, col * vec3(0.94, 1.0, 1.05), 1.0 - smoothstep(0.0, 0.45, l));
  col = pow(col, vec3(1.0 / 2.2));

  // grain the size of a CSS pixel, so it looks the same at every resolution
  float g = hash12(floor(gl_FragCoord.xy / max(uPx, 1e-3)) + fract(uTime * 7.31) * 913.0) - 0.5;
  col += g * uGrain * (0.3 + sqrt(l));
  col *= uFade;
  col += (ign(gl_FragCoord.xy + fract(uTime) * 61.0) - 0.5) / 255.0;
  o = vec4(max(col, 0.0), 1.0);
}`
