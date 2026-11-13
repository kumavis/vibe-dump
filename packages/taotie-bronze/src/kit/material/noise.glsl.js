// GLSL noise chunks for the patina shader. All are evaluated in VESSEL space in
// millimetres (see patina.js: positions are taken through the shared vessel
// matrix), so a corrosion territory has a physical size — a 60 mm malachite
// patch is 60 mm on a 25 cm fangyi and on a 1.3 m ding alike — patterns run
// continuously across separately built parts, and they stay glued to the
// vessel if it is turned.
//
// Budget (SwiftShader screenshots): one patina pixel costs ~10 simplex taps and
// two 8-cell Worley lookups. Keep new layers on the fields already computed.

// 3D simplex noise — Ashima Arts / Stefan Gustavson (MIT). Returns ~[-1, 1].
export const simplex3 = /* glsl */ `
vec3 tt_mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 tt_mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 tt_permute(vec4 x) { return tt_mod289(((x * 34.0) + 10.0) * x); }
vec4 tt_taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = tt_mod289(i);
  vec4 p = tt_permute(tt_permute(tt_permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = tt_taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`

// Fractal sums and domain warping. Mineral territories are not clouds: their
// outlines are fractal and folded, which is what warping the lookup by a
// second, coarser field produces. fbm3/fbm2 keep their old names.
export const fbm = /* glsl */ `
float fbm3(vec3 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 3; i++) { s += a * snoise(p); p = p * 2.03 + 17.1; a *= 0.5; }
  return s / 0.875;
}
float fbm2(vec3 p) {
  return (0.6667 * snoise(p) + 0.3333 * snoise(p * 2.07 + 11.3));
}
// a smooth vector field ~[-1, 1]^3 (3 taps) for domain warping
vec3 tt_warp(vec3 p) {
  return vec3(snoise(p), snoise(p + vec3(31.7, -12.3, 7.9)), snoise(p + vec3(-19.1, 23.9, -41.3)));
}
// ridged fbm: thin bright veins / banding (2 taps)
float tt_ridged(vec3 p) {
  float a = 1.0 - abs(snoise(p));
  float b = 1.0 - abs(snoise(p * 2.11 + 5.3));
  return (a * a * 0.65 + b * b * 0.35);
}
`

// Hash + Worley F1. worley3 is the full 27-cell search (kept for compatibility);
// worley8 searches the 8 nearest cells with damped jitter: ~3× cheaper, near
// enough for pustules, botryoidal domes and pits.
export const worley = /* glsl */ `
vec3 tt_hash33(vec3 p) {
  p = fract(p * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.xxy + p.yxx) * p.zyx);
}
float worley3(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  float d = 8.0;
  for (int z = -1; z <= 1; z++)
  for (int y = -1; y <= 1; y++)
  for (int x = -1; x <= 1; x++) {
    vec3 o = vec3(float(x), float(y), float(z));
    vec3 r = o + tt_hash33(i + o) - f;
    d = min(d, dot(r, r));
  }
  return sqrt(d);
}
// returns (F1 distance, cell id hash 0..1)
vec2 worley8(vec3 p) {
  vec3 b = floor(p - 0.5);
  float d = 8.0, id = 0.0;
  for (int z = 0; z <= 1; z++)
  for (int y = 0; y <= 1; y++)
  for (int x = 0; x <= 1; x++) {
    vec3 c = b + vec3(float(x), float(y), float(z));
    vec3 h = tt_hash33(c);
    vec3 r = c + 0.5 + (h - 0.5) * 0.85 - p;
    float dd = dot(r, r);
    if (dd < d) { d = dd; id = h.x; }
  }
  return vec2(sqrt(d), id);
}
`

export const noiseChunk = simplex3 + fbm + worley
