// Grand-design spiral: two logarithmic arms seen at an angle, a warm bulge,
// dust lanes on the arms' inner edges and pink star-forming knots along them.
export default /* glsl */ `
vec3 galaxy(vec2 q, float t, float s) {
  float r = length(q);
  float th = atan(q.y, q.x) + t;
  float lr = log(r + .015);
  float ph = 2. * (th - lr * 2.8);
  float wob = (fbm4(q * 6. + s) - .5) * 1.6;
  float arm = pow(max(.5 + .5 * cos(ph + wob), 0.), 2.2);
  float lane = pow(max(.5 + .5 * cos(ph + wob - .6), 0.), 14.);
  float disk = exp(-r * 4.6);
  float clump = .3 + 1.15 * fbm(q * 14. + s);

  vec3 col = vec3(0);
  col += vec3(.5, .68, 1.) * arm * clump * disk * 3.4 * smoothstep(.015, .1, r);
  col += vec3(.7, .75, .95) * disk * .32;
  col += vec3(1., .8, .55) * exp(-r * r * 140.) * 2.6;
  col += vec3(1., .88, .7) * exp(-r * 17.) * .85;
  col *= 1. - .72 * lane * smoothstep(.03, .1, r) * smoothstep(.55, .12, r);

  // HII knots strung along the arms
  vec2 g = q * 34.;
  vec2 id = floor(g);
  vec2 f = fract(g) - .5;
  vec2 h = hash22(id + s);
  float on = step(.78, hash12(id * 1.3 + s)) * smoothstep(.55, .9, arm) * disk * smoothstep(.04, .1, length(q));
  col += vec3(1., .35, .6) * on * exp(-dot(f - (h - .5) * .6, f - (h - .5) * .6) * 70.) * 3.;
  return col;
}

vec3 art(vec2 uv) {
  vec2 p = P(uv);
  float s = uSeed * 10.;
  vec3 col = vec3(.008, .008, .025);
  col += stars(p, .028, uSeed, .9) + stars(p, .07, uSeed + 5., .8);

  float incl = .95 + uTilt.y * .12;
  vec2 q = rot(-.5 + uSeed * .6 + uTilt.x * .05) * (p - vec2(-.03, .01));
  q.y /= cos(incl);
  q *= .82;
  col += galaxy(q, uTime * .025, s);

  // companion, tugging the far arm
  vec2 cq = p - vec2(.33, -.2);
  col += vec3(1., .78, .55) * (exp(-dot(cq, cq) * 600.) * 1.2 + exp(-length(cq) * 30.) * .35);

  // two distant edge-on galaxies for scale
  vec2 d1 = rot(.8) * (p - vec2(-.42, .3));
  col += vec3(1., .88, .7) * exp(-(d1.x * d1.x * 3000. + d1.y * d1.y * 40000.)) * .7;
  vec2 d2 = rot(-.3) * (p - vec2(.45, .34));
  col += vec3(.8, .85, 1.) * exp(-(d2.x * d2.x * 9000. + d2.y * d2.y * 30000.)) * .5;

  col = hueShift(col, (uSeed - .5) * .8);
  return toneHDR(col * 1.15);
}
`
