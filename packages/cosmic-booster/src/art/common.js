// GLSL shared by every card's art shader. Each art module supplies one function,
// `vec3 art(vec2 uv)`, that is pasted after this preamble and rendered into the
// card's own render target — so the paint is resolution-independent and the
// expensive ones (the black hole marches ~160 steps a pixel) cost the same
// whether the card fills the screen or sits in the spread.
//
// Convention: colours are display-referred (what you'd pick in a colour picker),
// tone-mapped inside the art, with anything that should bloom left above 1.

export const ART_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

export const ART_PRELUDE = /* glsl */ `
precision highp float;
uniform float uTime;
uniform float uSeed;
uniform vec2 uRes;
uniform vec2 uTilt;
varying vec2 vUv;

#define PI 3.14159265359
#define TAU 6.28318530718

float sq(float x) { return x * x; }
float hash11(float p) { p = fract(p * .1031); p *= p + 33.33; p *= p + p; return fract(p); }
float hash12(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
vec2 hash22(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.xx + p3.yz) * p3.zy); }
vec3 hash33(vec3 p3) { p3 = fract(p3 * vec3(.1031, .1030, .0973)); p3 += dot(p3, p3.yxz + 33.33); return fract((p3.xxy + p3.yxx) * p3.zyx); }
float hash13(vec3 p3) { p3 = fract(p3 * .1031); p3 += dot(p3, p3.zyx + 31.32); return fract((p3.x + p3.y) * p3.z); }

// Quintic gradient noise, roughly -0.7..0.7.
float gnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * f * (f * (f * 6. - 15.) + 10.);
  vec2 ga = hash22(i) * 2. - 1.;
  vec2 gb = hash22(i + vec2(1, 0)) * 2. - 1.;
  vec2 gc = hash22(i + vec2(0, 1)) * 2. - 1.;
  vec2 gd = hash22(i + vec2(1, 1)) * 2. - 1.;
  return mix(mix(dot(ga, f), dot(gb, f - vec2(1, 0)), u.x),
             mix(dot(gc, f - vec2(0, 1)), dot(gd, f - vec2(1, 1)), u.x), u.y);
}

float gnoise3(vec3 p) {
  vec3 i = floor(p), f = fract(p);
  vec3 u = f * f * f * (f * (f * 6. - 15.) + 10.);
  #define G3(o) dot(hash33(i + o) * 2. - 1., f - o)
  float n = mix(mix(mix(G3(vec3(0, 0, 0)), G3(vec3(1, 0, 0)), u.x),
                    mix(G3(vec3(0, 1, 0)), G3(vec3(1, 1, 0)), u.x), u.y),
                mix(mix(G3(vec3(0, 0, 1)), G3(vec3(1, 0, 1)), u.x),
                    mix(G3(vec3(0, 1, 1)), G3(vec3(1, 1, 1)), u.x), u.y), u.z);
  #undef G3
  return n;
}

const mat2 ROT_OCT = mat2(1.6, 1.2, -1.2, 1.6);

// fbm in 0..1
float fbm(vec2 p) {
  float s = 0., a = .5;
  for (int i = 0; i < 6; i++) { s += a * gnoise(p); p = ROT_OCT * p + 17.1; a *= .5; }
  return clamp(.5 + .75 * s, 0., 1.);
}
float fbm4(vec2 p) {
  float s = 0., a = .5;
  for (int i = 0; i < 4; i++) { s += a * gnoise(p); p = ROT_OCT * p + 17.1; a *= .5; }
  return clamp(.5 + .75 * s, 0., 1.);
}
float fbm3(vec3 p) {
  float s = 0., a = .5;
  for (int i = 0; i < 5; i++) { s += a * gnoise3(p); p = p * 2.03 + 11.7; a *= .5; }
  return clamp(.5 + .75 * s, 0., 1.);
}
// Sharp creases where the noise crosses zero: filaments, veins, shock fronts.
float ridged(vec2 p) {
  float s = 0., a = .5, w = 1.;
  for (int i = 0; i < 5; i++) {
    float n = 1. - abs(gnoise(p) * 1.6);
    n *= n * w;
    w = clamp(n * 1.5, 0., 1.);
    s += a * n;
    p = ROT_OCT * p + 9.3;
    a *= .5;
  }
  return s;
}

mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }

// Centre-origin, height-normalised coordinates: y runs -0.5..0.5.
vec2 P(vec2 uv) { return (uv - .5) * vec2(uRes.x / uRes.y, 1.); }
float pxSize() { return 1. / uRes.y; }

vec3 tonemap(vec3 c) { return 1. - exp(-max(c, 0.)); }
// Tone-map but let the brightest light through above 1, where the bloom finds it.
vec3 toneHDR(vec3 c) { return tonemap(c) + min(max(c - 1.6, 0.) * .3, vec3(.5)); }

vec3 hueShift(vec3 c, float a) {
  const vec3 k = vec3(.57735);
  float ca = cos(a);
  return c * ca + cross(k, c) * sin(a) + k * dot(k, c) * (1. - ca);
}

vec3 spectrum(float t) { return .5 + .5 * cos(TAU * (t + vec3(0., .33, .67))); }

// Rough star colour from a 0 (cool red) .. 1 (hot blue) temperature.
vec3 starTint(float t) {
  return mix(mix(vec3(1., .62, .38), vec3(1., .93, .82), smoothstep(0., .45, t)),
             vec3(.72, .82, 1.), smoothstep(.45, 1., t));
}

// Jittered-grid star field. p in P() units, cell = grid spacing, a few bright
// stars get a soft halo. Pixel-accurate cores so it stays crisp at any size.
vec3 stars(vec2 p, float cell, float seed, float gain) {
  vec2 g = p / cell;
  vec2 id = floor(g);
  vec3 col = vec3(0);
  float px = pxSize();
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 c = id + vec2(i, j);
    vec2 h = hash22(c + seed * 17.31);
    float m = hash12(c * 1.37 + seed * 3.17 + 11.7);
    vec2 d = p - (c + .1 + .8 * h) * cell;
    float mag = pow(max(m, 0.), 24.);
    float r = length(d);
    float rad = px * (.6 + 1.3 * mag);
    float core = exp(-r * r / (rad * rad));
    // the halo has to die inside the 3x3 neighbourhood or it clips to a square
    float halo = exp(-r / (px * (1.2 + 5. * mag))) * mag * smoothstep(cell * 1.1, cell * .2, r);
    float tw = .78 + .22 * sin(uTime * (.6 + 2.4 * h.x) + h.y * TAU);
    col += starTint(hash12(c + 5.5)) * (core * (.14 + 2.4 * mag) + halo * .6) * tw;
  }
  return col * gain;
}

// A hero star: hot core, glow and four diffraction spikes. s ~ apparent size.
vec3 flare(vec2 d, float s, vec3 tint) {
  float r = length(d);
  float core = exp(-r * r / (s * s * .0005));
  float glow = exp(-r / (s * .03)) * .7 + s * .0035 / (r + s * .012);
  float w = max(s * .0016, pxSize() * .7);
  float sx = exp(-abs(d.y) / w) * exp(-abs(d.x) / (s * .1));
  float sy = exp(-abs(d.x) / w) * exp(-abs(d.y) / (s * .1));
  return tint * (glow * .7 + (sx + sy) * .9) + vec3(core) * 2.4;
}
`

// Assemble a fragment shader from an art body.
export function artFragment(body) {
  return `${ART_PRELUDE}\n${body}\nvoid main() {
  vec3 c = art(vUv);
  // never let a stray NaN/Inf into the bloom chain, where it smears into a white-out
  if (!(c.r < 1e4 && c.g < 1e4 && c.b < 1e4)) c = vec3(0.);
  gl_FragColor = vec4(clamp(c, 0., 64.), 1.0);
}\n`
}
