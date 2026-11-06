// The prologue's ground (render/geology.js): the sea floor and the islands of
// a stage, drawn from the geology's height images under a sea made clear
// enough to read the floor through.
//
// Everything the plate carries is drawn where it stood at the clock's age:
// the heights are read at the world point less the drift (uDrift), so the
// stages slide north-west as the age runs down while the mesh, and the
// hotspot on it, stay put. Two stages are read at once and crossfaded
// (uStageMix), and where a stage is only today's floor smoothed, the
// seafloor pack's own detail stands in; beyond the seafloor box the floor
// eases to an abyssal depth.
//
// On the floor, the debris fields a step names are a soft wash with their
// outline (uField, rastered in the stage's own frame, so they ride with it),
// and during a slide the mass is a translucent body running along the
// field's long axis, the wash revealed behind it.

import { lighting } from './common.glsl.js'

const common = /* glsl */ `
uniform float uVert;        // world Y per metre (the exaggeration of the moment)
uniform vec4 uGeoRect;      // the seafloor box, world: x0, z0, x1, z1
uniform sampler2D uStageA;  // metres (half float, linear)
uniform sampler2D uStageB;
uniform float uStageMix;
uniform sampler2D uSeafloor; // the seafloor pack (today's ground, sharper than the stages' smoothed floors)
uniform vec2 uDrift;        // the plate's drift at the clock's age, world units
uniform float uAbyss;       // metres, beyond the box
uniform vec4 uSlideAxis;    // a slide's axis in the stage's frame: origin xz, unit direction xz
uniform vec4 uSlide;        // x length, y half width (world), z the front (0..1), w the body's strength (0 none)

vec2 geoUv(vec2 q) { return (q - uGeoRect.xy) / (uGeoRect.zw - uGeoRect.xy); }

// how far inside the box (in uv), negative outside
float geoInside(vec2 uv) { return min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y)); }

float stageMetres(vec2 q) {
  vec2 uv = geoUv(q);
  float a = texture(uStageA, uv).r;
  float b = texture(uStageB, uv).r;
  float m = mix(a, b, uStageMix);
  // where a stage is only today's floor smoothed, the floor's own detail:
  // so a crossfade between stages does not soften and sharpen the deep
  // floor, and only what the stages change moves
  float sf = texture(uSeafloor, uv).r;
  m += (sf - m) * (1.0 - smoothstep(120.0, 400.0, abs(sf - m)));
  return mix(uAbyss, m, smoothstep(0.0, 0.025, geoInside(uv)));
}

// the slide's body: where it stands along the axis (front), an ellipse a
// fifth of the run long and most of the field wide; 1 at its middle
float slideBody(vec2 q) {
  if (uSlide.w <= 0.0) return 0.0;
  vec2 d = q - uSlideAxis.xy;
  float along = dot(d, uSlideAxis.zw);
  float across = dot(d, vec2(-uSlideAxis.w, uSlideAxis.z));
  float c = uSlide.z * uSlide.x;
  float u = (along - c) / max(1.0, 0.14 * uSlide.x);
  float v = across / max(1.0, 0.7 * uSlide.y);
  return exp(-(u * u + v * v) * 1.6) * uSlide.w;
}
`

export const geologyVertex = /* glsl */ `
${common}
out vec3 vWorld;
out vec2 vQ;
out float vBody;
void main() {
  vec2 xz = position.xz;
  vec2 q = xz - uDrift;
  float m = stageMetres(q);
  float body = slideBody(q);
  // (the moving mass stands a little proud of the floor it runs over)
  m += body * 700.0;
  vec4 w = modelMatrix * vec4(xz.x, m * uVert, xz.y, 1.0);
  vWorld = w.xyz;
  vQ = q;
  vBody = body;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`

export const geologyFragment = /* glsl */ `
#define PI 3.14159265
${common}
${lighting}
uniform vec2 uTexel;        // one texel of the stage images, in uv
uniform float uClear;       // the sea: 0 opaque as the main view's, 1 clear to the floor
uniform sampler2D uField;   // r a lit field's fill, g its outline, b a scar's outline (in the stage's frame)
uniform float uFieldK;      // the wash's strength
uniform vec3 uHotspot;      // x, z (world, fixed), radius
in vec3 vWorld;
in vec2 vQ;
in float vBody;

vec3 srgb(vec3 c) { return pow(c, vec3(2.2)); }

void main() {
  vec2 q = vQ;
  float m = stageMetres(q);
  // the slope from the heights themselves, a texel either side
  vec2 e = uTexel * (uGeoRect.zw - uGeoRect.xy);
  float hx = stageMetres(q + vec2(e.x, 0.0)) - stageMetres(q - vec2(e.x, 0.0));
  float hz = stageMetres(q + vec2(0.0, e.y)) - stageMetres(q - vec2(0.0, e.y));
  // (the floor's relief read at a steady exaggeration, so the arch and the
  // blocks hold their shading as the camera's exaggeration eases)
  float vx = max(uVert, 0.045) * 1.6;
  vec3 N = normalize(vec3(-hx * vx / (2.0 * e.x), 1.0, -hz * vx / (2.0 * e.y)));
  vec3 V = normalize(cameraPosition - vWorld);
  float px = length(fwidth(vWorld.xz));

  vec3 col;
  if (m > 0.0) {
    // land: green low, browner and greyer with height
    vec3 low = srgb(vec3(0.33, 0.42, 0.22));
    vec3 mid = srgb(vec3(0.46, 0.40, 0.28));
    vec3 high = srgb(vec3(0.52, 0.49, 0.45));
    vec3 alb = mix(low, mid, smoothstep(300.0, 1400.0, m));
    alb = mix(alb, high, smoothstep(2200.0, 3600.0, m));
    // a bright beach line at the shore
    alb = mix(alb, srgb(vec3(0.80, 0.74, 0.58)), 1.0 - smoothstep(0.0, max(40.0, fwidth(m) * 1.5), m));
    col = shade(alb, N, vWorld, 1.0, 1.0);
  } else {
    float depth = -m;
    // the floor: pale sediment, lit as the land is, then seen through the water
    vec3 floorC = shade(srgb(vec3(0.62, 0.60, 0.55)), N, vWorld, 1.0, 1.0);
    vec3 amb = uSkyColor * 1.6 + uSunColor * max(uSunDir.y, 0.0);
    vec3 shelf = srgb(vec3(0.20, 0.62, 0.66)) * 0.25 * amb;
    vec3 deep = srgb(vec3(0.10, 0.28, 0.52)) * 0.16 * amb;
    vec3 body = mix(shelf, deep, smoothstep(40.0, 1800.0, depth));
    vec3 opaque = mix(vec3(0.03, 0.20, 0.21), vec3(0.004, 0.030, 0.075), smoothstep(5.0, 45.0, depth));
    opaque = mix(opaque, vec3(0.002, 0.018, 0.060), smoothstep(200.0, 1500.0, depth)) * amb;
    // clear enough that the floor four or five kilometres down still reads,
    // dim enough that the depth does
    float T = mix(0.85, 0.32, smoothstep(0.0, 5500.0, depth));
    vec3 tint = mix(vec3(0.55, 0.85, 0.92), vec3(0.30, 0.50, 0.85), smoothstep(100.0, 3000.0, depth));
    vec3 seen = floorC * tint * T * 0.4 + body * (1.0 - T);
    col = mix(opaque, seen, uClear);
    // the shore, a fine light line
    float shore = 1.0 - smoothstep(0.0, max(30.0, fwidth(m) * 1.2), depth);
    col = mix(col, srgb(vec3(0.85, 0.88, 0.86)) * amb * 0.35, shore * 0.6);
    // the surface's sheen toward the horizon
    float F = 0.02 + 0.98 * pow(1.0 - max(V.y, 0.0), 5.0);
    col = mix(col, skyMap(reflect(-V, vec3(0.0, 1.0, 0.0))), F * 0.7);
  }

  // a lit field: its wash, revealed up to a running slide's front, and its outline
  vec2 uv = geoUv(q);
  if (uFieldK > 0.002 && geoInside(uv) > 0.0) {
    vec3 f = texture(uField, uv).rgb;
    float reveal = 1.0;
    if (uSlide.w > 0.0 || uSlide.z < 1.0) {
      float along = dot(q - uSlideAxis.xy, uSlideAxis.zw) / max(1.0, uSlide.x);
      reveal = 1.0 - smoothstep(uSlide.z - 0.04, uSlide.z + 0.02, along);
    }
    vec3 washC = srgb(vec3(0.93, 0.70, 0.42));
    float lum = max(0.04, dot(col, vec3(0.2126, 0.7152, 0.0722)));
    col = mix(col, washC * lum * 2.2, f.r * 0.42 * uFieldK * reveal);
    col = mix(col, washC * max(lum * 3.0, 0.08), f.g * 0.85 * uFieldK * reveal);
    col = mix(col, srgb(vec3(0.95, 0.92, 0.85)) * max(lum * 2.5, 0.06), f.b * 0.7 * uFieldK);
  }
  // the sliding mass, translucent
  if (vBody > 0.003) {
    vec3 massC = shade(srgb(vec3(0.70, 0.56, 0.40)), N, vWorld, 1.0, 1.0);
    col = mix(col, massC, clamp(vBody, 0.0, 1.0) * 0.5);
  }
  // the hotspot, where it has always been: a faint warm glow on the floor
  if (uHotspot.z > 0.0) {
    float d = length(vWorld.xz - uHotspot.xy) / uHotspot.z;
    col += srgb(vec3(1.0, 0.55, 0.25)) * 0.05 * exp(-d * d) * uClear;
  }
  gl_FragColor = vec4(col, 1.0);
}
`
