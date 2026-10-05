// Mass-transfer binary: a swollen red giant overflowing its Roche lobe, a river
// of its gas arcing across to a hot companion and winding into a disk round it.
export default /* glsl */ `
vec2 stream(float u) {
  // L1 to the edge of the disk, bending with the orbit (Coriolis)
  vec2 a = vec2(.02, .0), b = vec2(.17, -.12), c = vec2(.32, -.06);
  return mix(mix(a, b, u), mix(b, c, u), u);
}

vec3 art(vec2 uv) {
  vec2 p = P(uv);
  p += uTilt * .01;
  float t = uTime;
  vec3 col = vec3(.008, .006, .02);
  col += stars(p, .028, uSeed, .9) + stars(p, .07, uSeed + 2., .7);

  // giant: teardrop toward L1, boiling surface, limb darkening
  vec2 G = vec2(-.26, .02);
  vec2 g = p - G;
  float ga = atan(g.y, g.x);
  float R = .25 * (1. + .2 * pow(max(cos(ga), 0.), 4.));
  float gr = length(g) / R;
  vec3 gcol = hueShift(vec3(1., .36, .1), (uSeed - .5) * .5);
  col += gcol * exp(-max(gr - 1., 0.) * 5.) * .7 * smoothstep(.97, 1.15, gr);
  col += gcol * exp(-length(g) * 5.) * .25;
  if (gr < 1.) {
    vec2 sg = g / R;
    float z = sqrt(1. - gr * gr);
    float gran = fbm(sg / (z + .35) * 4.5 + t * .03 + uSeed * 5.);
    float cells = 1. - ridged(sg / (z + .4) * 3. + t * .02 + uSeed * 2.) * .5;
    vec3 surf = mix(vec3(.85, .2, .04), vec3(1., .78, .42), smoothstep(.3, .85, gran)) * (.8 + .4 * cells);
    float limb = pow(max(z, 0.), .5);
    col = surf * limb * 1.7 + gcol * (1. - limb) * .5;
  }

  // the stream, flowing
  float best = 1e3, bu = 0.;
  vec2 a = stream(0.);
  for (int i = 1; i <= 16; i++) {
    float u1 = float(i) / 16.;
    vec2 b = stream(u1);
    vec2 ab = b - a;
    float h = clamp(dot(p - a, ab) / dot(ab, ab), 0., 1.);
    float dd = length(p - a - ab * h);
    if (dd < best) { best = dd; bu = u1 - (1. - h) / 16.; }
    a = b;
  }
  float sw = .01 + bu * .008;
  float flow = .75 + .25 * sin(bu * 22. - t * 3.);
  float fade = smoothstep(.0, .12, bu);
  col += vec3(1., .55, .25) * exp(-best * best / (sw * sw * 4.)) * .5 * fade;
  col += vec3(1., .8, .55) * exp(-best * best / (sw * sw * .5)) * flow * 1.4 * fade;

  // compact star and its accretion disk
  vec2 C = vec2(.33, -.03);
  vec2 cq = (p - C) * rot(.18);
  vec2 dq = vec2(cq.x, cq.y / .3);
  float dr = length(dq);
  float omega = t * .9 / pow(max(dr, .02), 1.5) * .02;
  vec2 sq = rot(omega) * dq;
  float swirl = fbm4(sq * 22. + uSeed * 3.);
  float disk = smoothstep(.16, .11, dr) * smoothstep(.012, .03, dr);
  vec3 dc = mix(vec3(.5, .55, 1.), vec3(1., .95, .9), smoothstep(.13, .02, dr));
  col = mix(col, dc * (.45 + 1.2 * swirl) * 1.5, disk * .9);
  col += vec3(.6, .7, 1.) * exp(-dr * 14.) * .6;
  col += vec3(1., .8, .5) * exp(-length(p - stream(1.)) * 70.) * .8;   // hot spot where the stream lands

  col = toneHDR(col * 1.08);
  col += flare(p - C, 1., vec3(.65, .8, 1.));
  return col;
}
`
