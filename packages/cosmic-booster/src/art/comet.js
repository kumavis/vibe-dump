// Comet: a green coma round an icy nucleus, a straight blue ion tail combed out
// by the solar wind, and a broad curving dust tail, both pointing away from a
// Sun off the top-right of the frame.
export default /* glsl */ `
vec3 art(vec2 uv) {
  vec2 p = P(uv);
  float t = uTime;
  vec2 H = vec2(.3, .2);
  vec2 d = normalize(vec2(-1., -.58));
  vec2 v = p - H;
  float s = dot(v, d);
  float u = v.x * d.y - v.y * d.x;
  float r = length(v);

  vec3 col = vec3(.006, .008, .022);
  // a faint band of Milky Way behind
  vec2 mw = rot(.6) * p;
  col += vec3(.3, .28, .4) * pow(max(fbm(mw * vec2(2., 6.) + uSeed * 4.), 0.), 2.5) * exp(-mw.y * mw.y * 18.) * .45;
  col = tonemap(col);
  col += stars(p, .026, uSeed, 1.) + stars(p, .065, uSeed + 7., .8);

  float fwd = smoothstep(-.02, .03, s);
  // ion tail: straight, narrow, streaming outward
  float wi = .008 + s * .07;
  float ion = exp(-sq(u / wi)) * exp(-s * 1.4) * fwd;
  float streams = .45 + .9 * fbm4(vec2(u / wi * 1.4, s * 3. - t * .35));
  col += vec3(.3, .55, 1.) * ion * streams * 1.9;
  // dust tail: curved, wide, warm, with faint striae
  float ud = u - s * s * .55 - s * .04;
  float wd = .012 + s * .2;
  float dust = exp(-sq(ud / wd)) * exp(-s * 1.7) * fwd;
  float striae = (.7 + .3 * sin(ud / wd * 9. + s * 14.)) * (.6 + .6 * fbm4(vec2(ud / wd * 2., s * 5.) + uSeed * 3.));
  col += vec3(1., .88, .64) * dust * striae * 1.4;

  // coma and nucleus
  col += vec3(.35, 1., .65) * exp(-r * 22.) * .9;
  col += vec3(.7, 1., .85) * exp(-r * 70.) * 1.2;
  col += flare(v, .9, vec3(.7, 1., .9)) * .9;

  // grit shed along the orbit, glinting
  vec2 g = vec2(s * 60., u * 160.);
  vec2 id = floor(g);
  float spark = step(.985, hash12(id + uSeed * 3.)) * fwd * exp(-s * 2.);
  spark *= exp(-dot(fract(g) - .5, fract(g) - .5) * 30.) * (.6 + .4 * sin(t * 3. + hash12(id) * TAU));
  col += vec3(.9, .95, 1.) * spark * 1.5;

  col = hueShift(col, (uSeed - .5) * .6);
  return col;
}
`
