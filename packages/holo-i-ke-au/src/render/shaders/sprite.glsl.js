// The battle's figures (features/soldiers.js): camera-facing quads cut out of
// one sheet of pixel art (features/sprites.js), each a whole number of screen
// pixels to the sprite pixel and laid on the pixel grid, so nothing in them
// is ever resampled: no blur, and no shimmer as the camera moves, only a
// figure stepping a whole pixel at a time, as pixel art does.
//
// Each figure is a foot on the ground of the year (its metres, turned into
// world Y by the exaggeration of the moment, so it never floats while the
// valley is stretched), a frame of the sheet, a scale, a facing and how much
// of it is shown. The foot is projected and rounded to a pixel corner, and
// the quad is built round it in pixels: 8 by 16 times the scale (16 wide for
// the field piece), standing on it. Two figures that belong together, a pair
// at the front or the piece and its crew, share a foot and are set apart
// across the screen by whole sprite pixels (dx), so they stand toe to toe at
// every zoom.
//
// The quad keeps the depth of its foot drawn toward the eye by half the
// figure's own height there (and a figure's own nudge), so the ground right
// at its feet doesn't cut them off but a ridge in front of it still hides
// it. The sheet is read texel by texel (texelFetch), the edges are cut by its
// alpha, never blended, and a figure dissolves in and out by whole sprite
// pixels (an ordered dither) rather than fading. Each has a small dark
// ellipse on the ground under it, drawn before it, darkening what is there.

import { constants, world, lighting } from './common.glsl.js'

// what both draws share: the foot, snapped to the pixel grid, and the quad round it
const place = /* glsl */ `
in vec4 aFoot;   // x, the ground there (metres), z, a nudge toward the eye (world units)
in vec4 aCell;   // the frame in the sheet: x, y, w, h (sheet pixels, y down from the top)
in vec4 aDraw;   // k (screen pixels to a sprite pixel), facing times tint (+ right, - left), shown (0..1), dx (sprite pixels across the screen)
uniform vec2 uViewport;   // the target drawn into, in pixels
uniform float uPxW;       // world units a screen pixel spans, per unit of distance from the eye
// the foot projected and rounded to a pixel corner (x, y), and its depth drawn toward the eye by
// pull (as a fraction of the figure's height) and the figure's own nudge (z); w < 0 when not drawn
vec4 footPixel(vec3 foot, float pull) {
  vec4 clip = projectionMatrix * viewMatrix * vec4(foot, 1.0);
  if (aDraw.z <= 0.0 || clip.w <= 0.0) return vec4(0.0, 0.0, 0.0, -1.0);
  vec2 px = floor((clip.xy / clip.w * 0.5 + 0.5) * uViewport + 0.5);
  px.x += aDraw.w * aDraw.x;
  vec3 toEye = cameraPosition - foot;
  float de = length(toEye);
  float h = aCell.w * aDraw.x * uPxW * de;
  float d = min(pull * h + aFoot.w, de * 0.5);
  vec4 cb = projectionMatrix * viewMatrix * vec4(foot + toEye / de * d, 1.0);
  return vec4(px, cb.z / cb.w, 1.0);
}
vec3 footWorld() {
  return vec3(aFoot.x, max(aFoot.y, 0.0) * uVert, aFoot.z);
}
`

// an ordered dither by sprite pixel, for dissolving in and out
const bayer = /* glsl */ `
float bayer4(ivec2 p) {
  int i = (p.x & 3) + 4 * (p.y & 3);
  int m[16] = int[16](0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5);
  return (float(m[i]) + 0.5) / 16.0;
}
`

export const spriteVertex = /* glsl */ `
${constants}
${world}
${lighting}
${place}
uniform sampler2D uFigS;  // the district's cast shadows (its shadow map), when it is down
uniform float uHasS;
out vec2 vSp;
flat out vec4 vCell;
flat out vec3 vDraw;   // facing, tint, shown
flat out vec3 vLight;
void main() {
  vec3 foot = footWorld();
  vec4 fp = footPixel(foot, 0.5);
  if (fp.w < 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  float k = aDraw.x;
  vec2 size = aCell.zw * k;
  vec2 corner = fp.xy + vec2((position.x - 0.5) * size.x, position.y * size.y);
  gl_Position = vec4(corner / uViewport * 2.0 - 1.0, fp.z, 1.0);
  vSp = vec2(position.x * aCell.z, (1.0 - position.y) * aCell.w);
  vCell = aCell;
  vDraw = vec3(sign(aDraw.y), abs(aDraw.y), aDraw.z);
  // lit as an upright card turned to the eye and tipped a little skyward, in the valley's shadows
  vec3 e = cameraPosition - foot;
  e.y = 0.0;
  vec3 n = normalize(normalize(e + vec3(1e-4, 0.0, 0.0)) + vec3(0.0, 0.9, 0.0));
  float vis = 1.0;
  if (uHasS > 0.5) {
    vec2 uv = rectUv(uDistRect, foot.xz);
    if (uv.x > 0.0 && uv.y > 0.0 && uv.x < 1.0 && uv.y < 1.0) vis = textureLod(uFigS, uv, 0.0).r;
  }
  // (a little under the ground's own, so a figure facing the low sun keeps its earth tones)
  vLight = 0.7 * shade(vec3(1.0), n, foot, 1.0, mix(0.35, 1.0, vis));
}
`

export const spriteFragment = /* glsl */ `
${constants}
${bayer}
uniform sampler2D uSheet;
in vec2 vSp;
flat in vec4 vCell;
flat in vec3 vDraw;
flat in vec3 vLight;
void main() {
  ivec2 wh = ivec2(vCell.zw);
  ivec2 t = clamp(ivec2(floor(vSp)), ivec2(0), wh - 1);
  if (vDraw.x < 0.0) t.x = wh.x - 1 - t.x;
  vec4 c = texelFetch(uSheet, ivec2(vCell.xy) + t, 0);
  if (c.a < 0.25) discard;
  if (vDraw.z < 0.999 && bayer4(t) >= vDraw.z) discard;
  vec3 a = pow(c.rgb, vec3(2.2));
  // (a flash and a match's glow are their own light: the sheet marks them with a lower alpha)
  vec3 col = c.a < 0.9 ? a * 2.4 : a * vDraw.y * vLight;
  gl_FragColor = vec4(col, 1.0);
}
`

export const shadowVertex = /* glsl */ `
${constants}
${world}
${place}
out vec2 vSp;
flat out vec3 vInfo;   // w, h, shown
void main() {
  vec3 foot = footWorld();
  // (a little further than the figure, so its feet are drawn over it)
  vec4 fp = footPixel(foot, 0.42);
  if (fp.w < 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  float k = aDraw.x;
  // four sprite pixels tall, centred on the line of the feet: the half under it shows below them
  vec2 corner = fp.xy + vec2((position.x - 0.5) * aCell.z * k, (position.y * 4.0 - 2.0) * k);
  gl_Position = vec4(corner / uViewport * 2.0 - 1.0, fp.z, 1.0);
  vSp = vec2(position.x * aCell.z, aCell.w + 2.0 - position.y * 4.0);
  vInfo = vec3(aCell.zw, aDraw.z);
}
`

export const shadowFragment = /* glsl */ `
${constants}
${bayer}
in vec2 vSp;
flat in vec3 vInfo;
void main() {
  // a pixel ellipse, the width of the figure less a pixel each side, on the line of its feet
  vec2 c = floor(vSp) + 0.5;
  vec2 q = (c - vec2(vInfo.x * 0.5, vInfo.y)) / vec2(vInfo.x * 0.5 - 0.5, 1.6);
  if (dot(q, q) > 1.0) discard;
  if (vInfo.z < 0.999 && bayer4(ivec2(floor(vSp))) >= vInfo.z) discard;
  gl_FragColor = vec4(vec3(0.55), 1.0);
}
`
