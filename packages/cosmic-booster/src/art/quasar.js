// Quasar: a galaxy's core outshining the galaxy. A thin incandescent disk,
// twin relativistic jets with knots racing outward, radio lobes where they
// splash into intergalactic space.
export default /* glsl */ `
vec3 art(vec2 uv) {
  vec2 p = P(uv);
  float t = uTime;
  float s = uSeed * 10.;
  vec3 col = vec3(.006, .006, .02);
  col += stars(p, .028, uSeed, .9) + stars(p, .07, uSeed + 3., .7);
  // background galaxies
  for (int i = 0; i < 6; i++) {
    vec2 c = (hash22(vec2(float(i), s)) - .5) * vec2(1.2, .9);
    vec2 d = rot(hash11(float(i) + s) * 6.) * (p - c);
    col += mix(vec3(1., .8, .6), vec3(.7, .8, 1.), hash11(float(i) * 3.)) *
           exp(-(d.x * d.x * 8000. + d.y * d.y * 30000.)) * .5;
  }

  float ang = .95 + (uSeed - .5) * .4;
  vec2 j = rot(ang) * p;   // x along the jet
  float ax = abs(j.x);
  // host galaxy
  col += vec3(1., .75, .5) * exp(-length(p * vec2(1., 1.4)) * 6.) * .35;

  // jets: helical, knotted, widening slowly
  float wid = .008 + ax * .045;
  float hel = j.y - sin(ax * 28. - t * 2. * sign(j.x)) * .0011 * ax * 10.;
  float jet = exp(-sq(hel / wid)) * exp(-ax * 1.6) * smoothstep(.0, .03, ax);
  float knots = .5 + .8 * pow(max(.5 + .5 * sin(ax * 34. - t * 2.2), 0.), 6.);
  jet *= knots * (.6 + .6 * fbm4(vec2(ax * 10. - t * .6, j.y * 60.)));
  col += vec3(.45, .6, 1.) * jet * 2.6;
  col += vec3(.85, .9, 1.) * exp(-sq(hel / (wid * .25))) * exp(-ax * 2.4) * smoothstep(.0, .03, ax) * 1.4;

  // lobes
  for (int k = 0; k < 2; k++) {
    float sg = k == 0 ? 1. : -1.;
    vec2 lc = j - vec2(sg * .48, sg * .015);
    float lob = exp(-dot(lc * vec2(1.5, 1.), lc * vec2(1.5, 1.)) * 30.);
    float tex = fbm(lc * 8. + s + float(k) * 4.);
    col += mix(vec3(.95, .25, .65), vec3(.45, .3, 1.), tex) * lob * pow(max(tex, 0.), 1.3) * 3.;
  }

  // disk, edge-on
  vec2 dq = vec2(j.y, j.x / .12);
  float dr = length(dq);
  col += vec3(1., .78, .5) * exp(-dr * dr * 900.) * 1.6;
  col += vec3(1., .6, .35) * exp(-dr * 40.) * .4;

  col = hueShift(col, (uSeed - .5) * .9);
  col = toneHDR(col * 1.1);
  col += flare(p, 1.1, vec3(.8, .85, 1.));
  return col;
}
`
