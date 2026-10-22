// The ground, one pack per scene (ENGINEERING.md §7): the table's relief
// pack in kilometres, or a battle box's pack in metres.
//
// It replaces holo-i-ke-au's world, patches and ground chunks
// (shaders/common.glsl.js at b480c27), which read an archipelago, five island
// slots, a district and 32 patches, and keeps their function names, above
// all groundMetres(), so that the ocean, lines, routes and shadow shaders
// written against those compile unchanged in both scenes (R9 §2.3). The
// Hawaiian names that no longer mean anything answer as an empty slot would:
// ownerAt() is -1, no district draws, no patch lifts a reef.
//
// Heights are metres on the GPU as everywhere; uVert (exaggeration / unit) is
// the only conversion to world y. rectMetres is the Hawaiian manual bilinear
// fetch, unchanged: float textures are not filterable everywhere, and the
// heights must never be filtered as split bytes anyway. Beyond the pack's
// edge the ground is uOutside metres (a flat -4,000 m sea): a box is sized to
// hold every coast seen from the action.
//
// Each scene's ground uniforms are its own (ground.uniforms), never merged
// into the light bag: uVert, uExag, uNormalE, uArchH, uArchRect, uOutside.
// The CPU copy of groundMetres is PackTerrain.metresAt (render/pack.js), as
// the ground interface's metresAt.

export const world = /* glsl */ `
uniform float uVert;        // world y per metre: exaggeration / unit
uniform float uExag;        // the exaggeration itself
uniform float uNormalE;     // the exaggeration the pack's normals were baked at
uniform sampler2D uArchH;   // the scene's pack, metres (R32F, nearest)
uniform vec4 uArchRect;     // its world rect: x0, z0, x1, z1
uniform float uOutside;     // metres beyond the pack's edge

vec2 rectUv(vec4 r, vec2 xz) { return (xz - r.xy) / (r.zw - r.xy); }
float edgeDist(vec4 r, vec2 xz) {
  vec2 a = min(xz - r.xy, r.zw - xz);
  return min(a.x, a.y);
}
// A manual bilinear fetch of a float height texture over a world rect,
// clamped at its edges.
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
float archMetres(vec2 xz) {
  return edgeDist(uArchRect, xz) < 0.0 ? uOutside : rectMetres(uArchH, uArchRect, xz);
}
// (the Hawaiian slots and district, as an empty archipelago answers)
int ownerAt(vec2 xz) { return -1; }
float slotWeight(int s, vec2 xz) { return 0.0; }
float distWeight(vec2 xz) { return 0.0; }
bool distDraws(vec2 xz) { return false; }
// A gradient (metres per metre) from a packed normal baked at uNormalE.
vec2 normalGrad(vec3 packed) {
  vec3 n0 = packed * 2.0 - 1.0;
  return -n0.xz / (max(n0.y, 0.03) * uNormalE);
}
`

export const ground = /* glsl */ `
float gPatchReef = 0.0;
float patchedMetres(int s, vec2 xz, float h) { return h; }
float groundMetres(vec2 xz) { return archMetres(xz); }
float distPond(vec2 xz) { return 0.0; }
float patchReef(vec2 xz) { return 0.0; }
`
