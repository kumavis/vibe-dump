// Planetary nebula: a dying sun's shed shells. Oxygen-teal inside, a knotty
// hydrogen-red ring, faint outer petals, and the white-hot ember at the centre.
export default /* glsl */ `
vec3 art(vec2 uv) {
  vec2 p = P(uv);
  float s = uSeed * 10.;
  vec3 col = vec3(.006, .008, .022);
  col += stars(p, .026, uSeed, .9) + stars(p, .07, uSeed + 9., .8);

  vec2 q = rot(.55 + uSeed) * (p - vec2(.0, .01));
  q *= vec2(1., 1.28);
  float r = length(q);
  vec2 dir = q / max(r, 1e-4);
  float R = .2 + .012 * (fbm4(dir * 2. + s) - .5) * 2.;
  float x = (r - R) / .07;

  vec3 o3 = vec3(.2, .75, 1.);
  vec3 ha = vec3(1., .3, .2);
  vec3 ye = vec3(1., .78, .35);

  float inner = smoothstep(.06, -.04, r - R) * (.5 + .7 * fbm(q * 9. + s));
  col += o3 * inner * .9;
  col += vec3(.45, .55, 1.) * exp(-r * r * 60.) * .4;
  col += ye * exp(-x * x * 1.6) * .8 * (.5 + fbm4(q * 14. + s));
  float knots = ridged(q * 18. + s);
  col += ha * exp(-sq((x - .7) / .9)) * (.5 + 1.6 * pow(max(knots, 0.), 3.)) * 1.2;
  // dark globules on the outer edge
  vec2 g = q * 60.;
  vec2 gid = floor(g);
  float glob = 0.;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 c = gid + vec2(i, j);
    vec2 cp = (c + hash22(c + s)) / 60.;
    float on = exp(-sq((length(cp) - R - .045) / .03));
    glob = max(glob, on * smoothstep(.25, .0, length(g - c - hash22(c + s))));
  }
  col *= 1. - .6 * glob;
  col += ha * glob * .25;

  // outer petals
  float a = atan(q.y, q.x);
  float petals = pow(max(.5 + .5 * cos(a * 7. + fbm4(dir * 3. + s) * 3.), 0.), 3.);
  float halo = exp(-sq((r - .36) / .07)) * (.2 + petals * .55);
  col += mix(ha, vec3(.85, .3, .7), .4) * halo * .55;

  col = hueShift(col, (uSeed - .5) * 1.3);
  col = toneHDR(col * 1.15);
  col += flare(p - vec2(.0, .01), .75, vec3(.7, .85, 1.));
  return col;
}
`
