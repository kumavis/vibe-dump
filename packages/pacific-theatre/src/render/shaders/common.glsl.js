// GLSL shared by every lit surface in both scenes: the constants, noise, and
// the one lighting model.
//
// Adapted from holo-i-ke-au's shaders/common.glsl.js (b480c27): `noise` is
// copied as it is; `lighting` is the Hawaiian sun, sky and moon model with up
// to eight point lights added (star shells, searchlight pools and gun
// flashes, ENGINEERING §7); the Hawaiian world, slots, patches, district,
// polity and land chunks are gone. The ground (one pack per scene) is
// ground.glsl.js, which keeps the Hawaiian function names so the ocean,
// lines, routes and shadow shaders compile unchanged against it.
//
// The light uniforms are one bag (app.light.uniforms) shared by reference by
// every material of both scenes; uPointPos[i].w is the light's radius in
// world units, uPointCol[i] its colour times intensity, and only the first
// uPointCount are lit.

export const MAX_POINT_LIGHTS = 8

export const constants = /* glsl */ `
#define PI 3.14159265
#define MAX_POINT_LIGHTS ${MAX_POINT_LIGHTS}
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

// The lighting every lit surface shares, from ahupuaʻa's common.glsl.js. The
// sun and sky colours already include the time of day; the cloud shadows are
// left out, so sunVisibility() is the open sky. Point lights fall off with
// the inverse square of distance (softened inside a fifth of their radius, so
// a flash beside a hull does not blow out to white) and are clipped to
// nothing at their radius.
export const lighting = /* glsl */ `
uniform vec3 uSunDir;
uniform vec3 uSunColor;
uniform vec3 uSkyColor;
uniform vec3 uGroundColor;
uniform vec3 uMoonDir;
uniform vec3 uMoonColor;
uniform float uTime;
uniform sampler2D uSkyMap;      // equirect sky radiance, elevation squashed to the horizon
uniform vec4 uPointPos[MAX_POINT_LIGHTS]; // xyz world position, w radius (world units)
uniform vec3 uPointCol[MAX_POINT_LIGHTS]; // colour × intensity
uniform int uPointCount;

vec2 dirToSkyUv(vec3 d) {
  float y = clamp(d.y, -1.0, 1.0);
  return vec2(atan(d.z, d.x) / (2.0 * PI) + 0.5, sign(y) * sqrt(abs(y)) * 0.5 + 0.5);
}
vec3 skyMap(vec3 d) { return texture(uSkyMap, dirToSkyUv(d)).rgb; }

float sunVisibility(vec3 p) { return 1.0; }

vec3 ambientLight(vec3 n) {
  return mix(uGroundColor, uSkyColor, n.y * 0.5 + 0.5);
}

// how much of point light i reaches p, before the facing term
float pointFalloff(int i, vec3 p, out vec3 L) {
  vec3 d = uPointPos[i].xyz - p;
  float r = max(uPointPos[i].w, 1e-6);
  float dist = length(d);
  L = d / max(dist, 1e-6);
  float soft = 0.2 * r;
  return (soft * soft) / (soft * soft + dist * dist) * (1.0 - smoothstep(0.75 * r, r, dist));
}

// the point lights' diffuse light on a surface at p facing n
vec3 pointLights(vec3 n, vec3 p) {
  vec3 sum = vec3(0.0);
  for (int i = 0; i < MAX_POINT_LIGHTS; i++) {
    if (i >= uPointCount) break;
    vec3 L;
    float k = pointFalloff(i, p, L);
    sum += uPointCol[i] * k * max(dot(n, L), 0.0);
  }
  return sum;
}

// their glint on a mirror-like surface (the sea): view direction V, normal N, shininess
vec3 pointGlints(vec3 N, vec3 V, vec3 p, float shine) {
  vec3 sum = vec3(0.0);
  for (int i = 0; i < MAX_POINT_LIGHTS; i++) {
    if (i >= uPointCount) break;
    vec3 L;
    float k = pointFalloff(i, p, L);
    vec3 H = normalize(L + V);
    sum += uPointCol[i] * k * pow(max(dot(N, H), 0.0), shine);
  }
  return sum;
}

vec3 shade(vec3 albedo, vec3 n, vec3 p, float ao, float vis) {
  float ndl = max(dot(n, uSunDir), 0.0);
  float ndm = max(dot(n, uMoonDir), 0.0);
  vec3 direct = uSunColor * ndl * vis + uMoonColor * ndm + pointLights(n, p);
  return albedo * (direct + ambientLight(n) * ao);
}
`
