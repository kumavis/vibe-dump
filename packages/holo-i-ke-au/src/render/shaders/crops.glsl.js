// What grows, by class (DATA.md "Crops, on the era layers"): the crop map of
// an island (overlay/crops.js) read by the ground shaders, the island packs'
// (terrain.glsl.js) and the district's (district.glsl.js), and by the
// district's trees (features/kit.js), which stand back from the fields.
//
// The crop map holds every keyframe at once, one in each channel, each byte
// a class in its high four bits and the share of the texel cultivated in its
// low four; a channel whose keyframe has no crop mask is nothing. The year
// shows the nearest keyframe (uCropSelA); when the year crosses into another
// the fields go over to it one by one (uCropSelB, uCropMix), never a blend
// of two classes.
//
// The class is read at the middle of a field, not under each pixel: the
// ground is laid out in strips of fields, each field about 110 × 70 m, the
// strips turned their own way in each region of 2.4 km and each strip's
// fields set off along it from its neighbours', and each field takes the
// class of the texel its middle falls in. So the edge of a crop follows the
// edges of fields, not the texels of the map, at any scale of map (Oʻahu's
// 68 m, Hawaiʻi's 150 m, or a district's ground, which takes its island's).
// A field is planted or lies fallow by its own pick against the share,
// a strip's fields more or less together; pasture and lawn cover theirs
// whole, since grazing is not cultivation, and so does a class where the
// cultivation mask has none. A cultivated texel of no class is the era's
// default: loʻi on a wet floor, dryland fields elsewhere.
//
// features/crops.js places the trees of the pasture, the orchards and the
// lawns on the lattices this draws them on from afar, and overlay/crops.js
// keeps the fields (cropCell, cropHash) on the CPU, line for line.

export const CROP_REGION = 24
export const CROP_CELL = [1.1, 0.7]
// the trees' lattices, world units in a region's own frame: [step along, step across, chance a point holds one]
export const CROP_LATTICE = { pasture: [0.6, 0.6, 0.22], lawn: [0.45, 0.45, 0.12], orchard: [0.16, 0.18, 1], coffee: [0.1, 0.14, 1] }
// the classes (DATA.md)
export const CROP = { none: 0, loi: 1, dryland: 2, rice: 3, cane: 4, pineapple: 5, pasture: 6, orchard: 7, lawn: 8 }
// an orchard field is coffee where its own second pick is at least this
export const COFFEE_PICK = 0.65

const f = (v) => (Number.isInteger(v) ? v.toFixed(1) : String(v))

// The fields, the class of a field, and how much of it is planted: what the
// trees need as well as the ground.
export const cropCells = /* glsl */ `
uniform vec4 uCropSelA;  // the keyframe shown: one of the crop map's channels
uniform vec4 uCropSelB;  // the one its fields are going over to
uniform float uCropMix;  // how far: a field whose own pick is under this has gone over

#define CROP_REGION ${f(CROP_REGION)}
const vec2 CROP_CELL = vec2(${f(CROP_CELL[0])}, ${f(CROP_CELL[1])});

float cropHash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

// A field: its middle (world), where xz lies in it (0..1 along and across),
// the region's frame (q, world units from the region's middle, e1 along),
// its place among the region's fields (lid: along its strip, the strip) and
// an id unique across regions, and its picks (planted; which keyframe, while
// the fields go over).
struct CropCell { vec2 centre; vec2 q; vec2 f; vec2 lid; vec2 id; vec2 rid; vec2 e1; float pick; float pickKf; };
CropCell cropCell(vec2 xz) {
  CropCell c;
  c.rid = floor(xz / CROP_REGION);
  float a = (cropHash(c.rid + 71.3) - 0.5) * 1.4;
  c.e1 = vec2(cos(a), sin(a));
  vec2 e2 = vec2(-c.e1.y, c.e1.x);
  vec2 o = (c.rid + 0.5) * CROP_REGION;
  vec2 d = xz - o;
  c.q = vec2(dot(d, c.e1), dot(d, e2));
  float row = floor(c.q.y / CROP_CELL.y);
  float off = cropHash(vec2(row, 3.7) + c.rid * 13.0);
  float gx = c.q.x / CROP_CELL.x + off;
  c.lid = vec2(floor(gx), row);
  c.f = vec2(gx - c.lid.x, c.q.y / CROP_CELL.y - row);
  vec2 qc = vec2((c.lid.x + 0.5 - off) * CROP_CELL.x, (row + 0.5) * CROP_CELL.y);
  c.centre = o + qc.x * c.e1 + qc.y * e2;
  c.id = c.lid + c.rid * 97.0;
  c.pick = 0.5 * cropHash(c.id + 13.1) + 0.5 * cropHash(vec2(row, 7.9) + c.rid * 13.0);
  c.pickKf = cropHash(c.id + 41.7);
  return c;
}

// the class (x) and the share cultivated (y) at world p on a crop map over
// rect, nearest texel, in the keyframe a field of this pick shows
vec2 cropAt(sampler2D t, vec4 rect, vec2 p, float pick) {
  vec2 uv = rectUv(rect, p);
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x >= 1.0 || uv.y >= 1.0) return vec2(0.0);
  vec2 size = vec2(textureSize(t, 0));
  vec4 b = texelFetch(t, ivec2(uv * size), 0);
  float v = floor(dot(b, pick < uCropMix ? uCropSelB : uCropSelA) * 255.0 + 0.5);
  float cls = floor(v / 16.0);
  return vec2(cls > 8.5 ? 0.0 : cls, (v - cls * 16.0) / 15.0);
}

// how much of a field of this class and share is planted: pasture and lawn
// whole, a crop at least half (and whole where the cultivation mask has
// none, so the class alone says it is there), a cultivated texel of no class
// by its share
float cropCover(vec2 cs) {
  if (cs.x < 0.5) return cs.y;
  if (abs(cs.x - 6.0) < 0.5 || cs.x > 7.5 || cs.y <= 0.0) return 1.0;
  return mix(0.55, 1.0, cs.y);
}
`

// The ground's look by class, laid over the ground's own colour before it
// is lit. Each class has its fields and their mean (cropTint), which they
// fade to as they get finer than a pixel; far enough out that a field is
// smaller than a pixel, three fields under the pixel are averaged instead of
// one picked, so the map neither sparkles nor shows its texels. A classed
// field lying fallow is the ground's own colour halfway to its class's.
//
// (Only the materials of packs with a crop map compile this, CROPS: a
// software renderer runs a branch whether or not it is taken.)
export const cropGround = /* glsl */ `
${cropCells}
// the open water in the paddies at the last applyCrops (0..1), for the light on it
float gCropWater = 0.0;

// a thin line of width w (world units) at distance d from its middle, antialiased over a pixel of px
float cropLine(float d, float w, float px) {
  return (1.0 - smoothstep(w * 0.5 - px * 0.5, w * 0.5 + px * 0.5, d)) * min(1.0, w / max(px, 1e-5) * 1.5);
}

// each class from afar: what its fields average to, and how much of that is water
vec3 cropTint(float cls, float rain) {
  if (cls < 1.5) return srgb(vec3(0.31, 0.42, 0.25));
  if (cls < 2.5) return srgb(vec3(0.52, 0.50, 0.32));
  if (cls < 3.5) return srgb(vec3(0.51, 0.59, 0.31));
  if (cls < 4.5) return srgb(vec3(0.42, 0.51, 0.22));
  if (cls < 5.5) return srgb(vec3(0.45, 0.43, 0.32));
  if (cls < 6.5) return srgb(mix(vec3(0.59, 0.57, 0.37), vec3(0.50, 0.55, 0.31), smoothstep(0.30, 0.50, rain)));
  if (cls < 7.5) return srgb(vec3(0.38, 0.44, 0.25));
  return srgb(vec3(0.45, 0.55, 0.30));
}
float cropTintWater(float cls) { return cls < 1.5 ? 0.08 : cls < 3.5 && cls > 2.5 ? 0.12 : 0.0; }

// a lattice of trees in the region's frame (step along, step across, the
// chance a point holds one), as features/crops.js plants it: how much of the
// ground at q is under a crown of radius r (world units). A crown lies
// within its own lattice cell (the jitter keeps it a fifth of a step from
// the edge, and every r here is under that), so one cell is enough.
float cropCrowns(vec2 q, vec3 lat, vec2 rid, float seed, float r, float px) {
  vec2 n = floor(q / lat.xy);
  vec2 cid = n + rid * 997.0;
  if (lat.z < 1.0 && cropHash(cid + seed) >= lat.z) return 0.0;
  vec2 jit = lat.z < 1.0 ? vec2(cropHash(cid + seed + 3.1), cropHash(cid + seed + 5.7)) * 0.6 + 0.2 : vec2(0.5);
  float d = length((n + jit) * lat.xy - q);
  return 1.0 - smoothstep(r - px * 0.5, r + px * 0.5, d);
}

// The near look of one field of class cls: c the field, gm the fall (metres
// per metre), px world units a pixel, fwM metres a pixel; water: the
// paddies' open water.
vec3 cropLook(float cls, CropCell c, vec2 xz, float metres, float gm, float rain, float px, float fwM, out float water) {
  water = 0.0;
  vec2 qm = c.q * 100.0;      // metres in the region's frame
  float pm = px * 100.0;      // metres a pixel
  vec3 tint = cropTint(cls, rain);
  if (cls < 1.5 || (cls > 2.5 && cls < 3.5)) {
    // Loʻi and rice: terraces a metre of fall each, paced off into paddies
    // across (taro's about 28 m, rice's 22) and never longer than 35 m, their
    // banks wandering a little; a field's paddies near one stage, each a
    // little its own (a rice field's nearer still); banks between them, a
    // rice field's bunds narrower and barer. What is left of a paddy is open
    // water.
    bool rice = cls > 2.5;
    float tau = metres;
    vec2 wob = vec2(vnoise(qm * 0.021), vnoise(qm * 0.021 + 17.0)) - 0.5;
    float u = qm.x / (rice ? 22.0 : 28.0) + wob.x * 0.7;
    float v = qm.y / (rice ? 26.0 : 35.0) + wob.y * 0.7;
    float hp = cropHash(vec2(floor(tau) + floor(v) * 131.0, floor(u)) + c.rid * 7.3);
    float h = fract(c.pick * 3.1 + hp * (rice ? 0.1 : 0.25));
    float fine = 1.0 - smoothstep(4.0, 14.0, pm);
    vec3 col;
    float open;
    if (!rice) {
      // (a paddy now and then just flooded, or fallow; the rest under taro, a field's of an age)
      float fallow = step(fract(hp * 5.9 + 0.3), 0.03);
      float bare = step(fract(hp * 3.7 + 0.4), 0.06);
      float grow = smoothstep(0.0, 0.8, h);
      float cover = mix(0.72 + 0.25 * grow, 0.15, bare) * (1.0 - fallow);
      // (kalo's leaves a deep blue-green, the paddies wet and darker than the dry ground about them)
      vec3 leaf = mix(srgb(vec3(0.38, 0.47, 0.27)), mix(srgb(vec3(0.28, 0.42, 0.24)), srgb(vec3(0.33, 0.47, 0.27)), fract(hp * 13.7)), grow);
      vec3 mud = srgb(vec3(0.30, 0.29, 0.22));
      col = mix(mix(mud, leaf, cover), srgb(vec3(0.46, 0.48, 0.30)), fallow);
      open = (1.0 - cover) * (1.0 - fallow) * 0.7;
    } else {
      // seedlings standing in water, the green crop, the crop gone gold, stubble
      float st = fract(h * 5.13 + 0.21);
      vec3 green = mix(srgb(vec3(0.50, 0.61, 0.29)), srgb(vec3(0.55, 0.65, 0.31)), fract(hp * 11.3));
      vec3 gold = srgb(vec3(0.66, 0.62, 0.36));
      vec3 stubble = srgb(vec3(0.57, 0.52, 0.37));
      float cover = st < 0.15 ? 0.35 : 0.95;
      col = st < 0.15 ? mix(srgb(vec3(0.36, 0.37, 0.27)), green, cover) : st < 0.7 ? green : st < 0.92 ? gold : stubble;
      open = st < 0.15 ? 0.6 : st < 0.7 ? 0.08 : 0.0;
    }
    // the banks: along the terraces (tau turning over) and across them (u, v)
    float bw = rice ? 1.2 : 2.0;
    float dT = min(fract(tau), 1.0 - fract(tau));
    float bankT = cropLine(dT, bw * max(gm, 0.004), fwM) * smoothstep(0.004, 0.012, gm);
    float dU = min(fract(u), 1.0 - fract(u)) * (rice ? 22.0 : 28.0);
    float dV = min(fract(v), 1.0 - fract(v)) * (rice ? 26.0 : 35.0);
    float bank = max(bankT, max(cropLine(dU, bw, pm), cropLine(dV, bw, pm))) * fine;
    vec3 bankC = rice ? srgb(vec3(0.50, 0.50, 0.33)) : srgb(vec3(0.39, 0.47, 0.24));
    col = mix(col, bankC, bank * 0.85);
    water = mix(open * (1.0 - bank), cropTintWater(cls), 1.0 - fine);
    return mix(tint, col, fine);
  }
  if (cls < 2.5) {
    // Dryland fields: long plots between low walls, three across a field and
    // two along it, sweet potato in mounds, dry taro, grass gone to straw,
    // now and then bare earth; the walls along the strips, where the
    // leeward field systems ran theirs
    float k = cropHash(c.id + 2.3);
    vec2 pid = vec2(floor(c.f.x * 2.0 + k * 0.8), floor(c.f.y * 3.0));
    float h = cropHash(c.id * 3.1 + pid);
    vec3 plot = h < 0.38 ? srgb(vec3(0.47, 0.48, 0.29)) : h < 0.62 ? srgb(vec3(0.44, 0.47, 0.31)) : h < 0.9 ? srgb(vec3(0.57, 0.54, 0.36)) : srgb(vec3(0.52, 0.43, 0.30));
    float fine = 1.0 - smoothstep(6.0, 18.0, pm);
    float rows = 0.5 + 0.5 * sin(qm.x * 4.2);
    plot *= mix(1.0, 0.9 + 0.16 * rows, (1.0 - smoothstep(0.25, 0.6, pm)) * step(h, 0.62));
    float dW = min(fract(c.f.y * 3.0), 1.0 - fract(c.f.y * 3.0)) * CROP_CELL.y / 3.0;
    plot = mix(plot, srgb(vec3(0.47, 0.44, 0.38)), cropLine(dW, 0.016, px) * 0.7);
    return mix(tint, plot, fine);
  }
  if (cls < 4.5) {
    // Cane: blocks of about two fields by two, each at its own stage (tall
    // and dark, young over the furrows, cut to stubble), striped along its
    // rows; dirt roads round each block
    vec2 g = c.q / (CROP_CELL * 2.0);
    vec2 bid = floor(g);
    vec2 bf = g - bid;
    float h = cropHash(bid + c.rid * 977.0 + 3.3);
    float fine = 1.0 - smoothstep(8.0, 30.0, pm);
    vec3 tall = mix(srgb(vec3(0.35, 0.47, 0.18)), srgb(vec3(0.44, 0.53, 0.22)), 0.5 + 0.5 * sin(qm.y * 0.9 + vnoiseF(xz * 9.0, px * 9.0) * 4.0));
    vec3 young = mix(srgb(vec3(0.50, 0.44, 0.30)), srgb(vec3(0.47, 0.55, 0.27)), 0.6 + 0.4 * sin(qm.y * 3.9));
    vec3 cut = srgb(vec3(0.50, 0.42, 0.29));
    vec3 cane = h < 0.12 ? cut : h < 0.32 ? young : tall;
    // (the rows: a few metres apart, while they are a few pixels)
    cane *= mix(1.0, 0.9 + 0.18 * (0.5 + 0.5 * sin(qm.y * 3.9)), 1.0 - smoothstep(0.3, 0.9, pm));
    vec2 dB = min(bf, 1.0 - bf) * CROP_CELL * 2.0;
    float road = max(cropLine(dB.x, 0.06, px), cropLine(dB.y, 0.06, px));
    cane = mix(cane, srgb(vec3(0.62, 0.54, 0.41)), road * 0.85);
    return mix(tint, cane, fine);
  }
  if (cls < 5.5) {
    // Pineapple: beds a couple of metres apart in blocks of a few, the
    // plants' grey-green over red earth, a field at a time newly set, grown,
    // or lying in red fallow; a red road at the field's ends
    float h = cropHash(c.id + 5.9);
    float grown = h < 0.25 ? 0.4 : h < 0.9 ? 0.75 : 0.1;
    vec3 soil = srgb(vec3(0.55, 0.32, 0.20));
    vec3 plant = srgb(vec3(0.36, 0.47, 0.33));
    float bed = 0.5 + 0.5 * sin(qm.y * 6.2832 / 2.2);
    float rowsK = 1.0 - smoothstep(0.4, 1.2, pm);
    float pl = mix(grown, smoothstep(1.0 - grown - 0.15, 1.0 - grown + 0.15, bed), rowsK);
    // (the beds in blocks, a path between: a stripe that holds out to a few metres a pixel)
    float blocks = 1.0 - smoothstep(0.42, 0.48, abs(fract(qm.y / 9.0) - 0.5)) * (1.0 - smoothstep(1.5, 4.0, pm));
    vec3 pine = mix(soil, plant, pl * mix(1.0, 0.25, 1.0 - blocks));
    float dE = min(c.f.x, 1.0 - c.f.x) * CROP_CELL.x;
    pine = mix(pine, srgb(vec3(0.58, 0.37, 0.24)), cropLine(dE, 0.05, px));
    float fine = 1.0 - smoothstep(8.0, 30.0, pm);
    return mix(mix(soil, plant, grown), pine, fine);
  }
  if (cls < 6.5) {
    // Pasture: grass grazed unevenly, drier to leeward; fences along some of
    // the fields' edges, paddocks of two fields by three; a few trees
    vec3 grass = tint * (0.92 + 0.16 * vnoiseF(xz * 3.0, px * 3.0)) * (0.96 + 0.08 * vnoiseF(xz * 21.0, px * 21.0));
    vec2 dE = vec2(min(c.f.x, 1.0 - c.f.x), min(c.f.y, 1.0 - c.f.y)) * CROP_CELL;
    vec2 L = c.lid;
    float fx = c.f.x < 0.5 ? 1.0 - step(0.5, mod(L.x, 2.0)) : 1.0 - step(0.5, mod(L.x + 1.0, 2.0));
    float fz = c.f.y < 0.5 ? 1.0 - step(0.5, mod(L.y, 3.0)) : 1.0 - step(0.5, mod(L.y + 1.0, 3.0));
    float fence = max(cropLine(dE.x, 0.012, px) * fx, cropLine(dE.y, 0.012, px) * fz);
    grass = mix(grass, srgb(vec3(0.34, 0.31, 0.25)), fence * 0.6);
    float tree = cropCrowns(c.q, vec3(${f(CROP_LATTICE.pasture[0])}, ${f(CROP_LATTICE.pasture[1])}, ${f(CROP_LATTICE.pasture[2])}), c.rid, 211.0, 0.075, px) * (1.0 - smoothstep(0.08, 0.2, px));
    return mix(grass, srgb(vec3(0.26, 0.32, 0.16)), tree * 0.85);
  }
  if (cls < 7.5) {
    // Orchards and coffee: rows of small trees over mown grass, or coffee's
    // close hedgerows over red-brown earth, a field at a time
    bool coffee = cropHash(c.id + 9.4) >= ${f(COFFEE_PICK)};
    vec3 under = coffee ? srgb(vec3(0.46, 0.38, 0.27)) : srgb(vec3(0.50, 0.51, 0.31));
    float crowns = coffee
      ? cropCrowns(c.q, vec3(${f(CROP_LATTICE.coffee[0])}, ${f(CROP_LATTICE.coffee[1])}, 1.0), c.rid, 0.0, 0.05, px)
      : cropCrowns(c.q, vec3(${f(CROP_LATTICE.orchard[0])}, ${f(CROP_LATTICE.orchard[1])}, 1.0), c.rid, 0.0, 0.06, px);
    float cov = coffee ? 0.55 : 0.45;
    float k = mix(crowns, cov, smoothstep(0.03, 0.09, px));
    vec3 leaf = coffee ? srgb(vec3(0.22, 0.32, 0.15)) : srgb(vec3(0.26, 0.36, 0.17));
    return mix(under, leaf, k);
  }
  // Lawn: mown green, striped by the mower close in; a few shade trees
  float stripe = 0.5 + 0.5 * sign(sin(qm.x * 0.39));
  vec3 lawn = tint * mix(1.0, 0.95 + 0.1 * stripe, 1.0 - smoothstep(0.6, 2.0, pm)) * (0.96 + 0.08 * vnoiseF(xz * 12.0, px * 12.0));
  float tree = cropCrowns(c.q, vec3(${f(CROP_LATTICE.lawn[0])}, ${f(CROP_LATTICE.lawn[1])}, ${f(CROP_LATTICE.lawn[2])}), c.rid, 307.0, 0.07, px) * (1.0 - smoothstep(0.08, 0.2, px));
  return mix(lawn, srgb(vec3(0.24, 0.33, 0.15)), tree * 0.85);
}

// the era's default for a cultivated texel of no class: loʻi on a wet
// floor, dryland fields elsewhere
float cropDefault(float slope, float rain, float rip) {
  return slope < 0.06 && rip > 0.22 && rain > 0.36 ? 1.0 : 2.0;
}

// a classed field lying fallow: the ground's own colour halfway to its class's
vec3 cropFallow(vec3 base, float cls, float rain) {
  return mix(base, cropTint(cls, rain), 0.45);
}

// one field under a far pixel, by its class's mean: premultiplied colour, and its water added to w
vec4 cropFarTap(vec2 s, vec3 col, float def, float rain, inout float w) {
  float cv = cropCover(s);
  float cl = s.x < 0.5 ? def : s.x;
  w += cropTintWater(cl) * cv;
  return vec4(cropTint(cl, rain), 1.0) * cv + vec4(cropFallow(col, cl, rain), 1.0) * (1.0 - cv) * step(0.5, s.x);
}

// The ground's colour col with what grows over it: the crop map t over rect
// at world xz; dX, dY the pixel's footprint (dFdx and dFdy of xz), px its
// size; slope as the ground has it (1 − n.y at the valley's exaggeration),
// gm the true fall (metres per metre), fwM metres a pixel; rain, sand and
// riparian as the land map has them (nothing grows on the beach). Sets
// gCropWater.
vec3 applyCrops(vec3 col, sampler2D t, vec4 rect, vec2 xz, vec2 dX, vec2 dY, float px, float metres, float slope, float gm, float fwM, float rain, float sand, float rip) {
  gCropWater = 0.0;
  float ground = smoothstep(0.3, 2.0, metres) * (1.0 - smoothstep(0.1, 0.45, sand * (1.0 - smoothstep(4.0, 9.0, metres))));
  if (ground <= 0.0) return col;
  float def = cropDefault(slope, rain, rip);
  CropCell c = cropCell(xz);
  vec2 cs = cropAt(t, rect, c.centre, c.pickKf);
  // with fields finer than a pixel, three under the pixel (its own and two
  // across its footprint), by their mean
  float far = smoothstep(0.12, 0.5, px / CROP_CELL.y);
  vec4 avg = vec4(0.0);
  float avgW = 0.0;
  if (far > 0.0) {
    avg = cropFarTap(cs, col, def, rain, avgW);
    for (int k = 0; k < 2; k++) {
      CropCell ck = cropCell(xz + (k == 0 ? 0.33 : -0.33) * (dX + dY));
      avg += cropFarTap(cropAt(t, rect, ck.centre, ck.pickKf), col, def, rain, avgW);
    }
    avg /= 3.0;
    avgW /= 3.0;
  }
  vec4 near = vec4(0.0);
  float nearW = 0.0;
  float cover = cropCover(cs);
  if (far < 1.0 && cover > 0.0) {
    float cls = cs.x < 0.5 ? def : cs.x;
    // planted or fallow, a field at a time, until the fields get finer than
    // a few pixels; a classed texel's fallow fields are its own, a
    // cultivated one's of no class the ground's
    float planted = mix(step(c.pick, cover), cover, smoothstep(0.08, 0.3, px / CROP_CELL.y));
    float w;
    vec3 look = cropLook(cls, c, xz, metres, gm, rain, px, fwM, w);
    near = vec4(look, 1.0) * planted + vec4(cropFallow(col, cls, rain), 1.0) * (1.0 - planted) * step(0.5, cs.x);
    nearW = w * planted;
  }
  vec4 m = mix(near, avg, far);
  // (a little of the ground's own light and dark kept, so the fields aren't flat sheets)
  float k = m.a * 0.92 * ground;
  gCropWater = m.a > 1e-4 ? mix(nearW, avgW, far) / m.a * k : 0.0;
  return mix(col, m.rgb / max(m.a, 1e-4), k);
}

// the light on a paddy's open water, as the district's loʻi have it: the sky
// in it over muddy brown-green, and the sun's glint, a little quieter
vec3 cropWaterLit(vec3 lit, vec3 p, vec2 xz, float px, float vis, float k) {
  if (k <= 0.0) return lit;
  vec3 V = normalize(cameraPosition - p);
  vec2 rp = xz * 220.0 + vec2(uTime * 0.6, uTime * 0.4);
  vec3 N = normalize(vec3((vnoiseF(rp, px * 220.0) - 0.5) * 0.08, 1.0, (vnoiseF(rp + 13.0, px * 220.0) - 0.5) * 0.08));
  float F = 0.03 + 0.97 * pow(1.0 - max(dot(N, V), 0.0), 5.0);
  vec3 R = reflect(-V, N);
  R.y = abs(R.y);
  vec3 water = vec3(0.09, 0.085, 0.05) * (uSkyColor + uSunColor * max(uSunDir.y, 0.0) * vis);
  water = mix(water, skyMap(R), F * 0.6);
  vec3 H = normalize(uSunDir + V);
  water += uSunColor * pow(max(dot(N, H), 0.0), 300.0) * 3.0 * vis;
  return mix(lit, water, k * 0.75);
}
`
