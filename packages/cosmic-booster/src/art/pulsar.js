// Pulsar: a neutron star whose magnetic axis is tipped off its spin axis, so the
// two beams sweep a cone and flare whenever one swings toward us. Dipole field
// lines ride with the beams; an equatorial wind ring and synchrotron haze sit
// around it, as in the heart of the Crab.
export default /* glsl */ `
vec3 art(vec2 uv) {
  vec2 p = P(uv) - vec2(-.02, .0);
  float t = uTime;
  float r = length(p);

  // the nebula it's blowing
  vec2 w = p * rot(.4 + uSeed);
  float n = fbm(w * 2.4 + uSeed * 10.);
  float fil = ridged(w * 3.2 + n * 1.6 + uSeed * 5.);
  float env = exp(-dot(w * vec2(.8, 1.2), w * vec2(.8, 1.2)) * 4.);
  vec3 col = vec3(.008, .012, .032);
  col += vec3(.22, .34, 1.) * pow(max(n, 0.), 2.2) * env * 1.3;
  col += vec3(1., .42, .3) * pow(max(fil, 0.), 5.) * env * .9;
  col += vec3(.45, .25, .9) * pow(max(fil, 0.), 3.) * env * .25;
  col = hueShift(col, (uSeed - .5) * 1.2);

  // spin axis tipped toward us; magnetic axis precesses round it
  float incl = .62;
  float ph = t * 1.15;
  vec3 m = vec3(sin(incl) * cos(ph), cos(incl), sin(incl) * sin(ph));
  mat2 tip = rot(.42);
  m.yz = tip * m.yz;
  m.xy = rot(-.32) * m.xy;
  vec2 ad = normalize(m.xy);
  float al = length(m.xy);
  float facing = pow(abs(m.z), 10.);

  float along = dot(p, ad);
  float perp = abs(p.x * ad.y - p.y * ad.x);
  float aa = abs(along);
  float wid = .006 + aa * .16;
  float beam = exp(-sq(perp / wid)) * exp(-aa * 2.2) * smoothstep(.0, .04, aa);
  beam *= .55 + .7 * fbm4(vec2(aa * 9. - t * 3.5, perp * 26.));
  col += vec3(.55, .82, 1.) * beam * (.6 + 1.6 * al) * 1.6;

  // dipole field lines: r = L sin^2(theta) in the plane of the axis
  float ct = along / max(r, 1e-4);
  float st2 = max(1. - ct * ct, 1e-4);
  float lines = 0.;
  for (int k = 0; k < 5; k++) {
    float L = .07 * pow(1.55, float(k));
    float d = abs(r - L * st2);
    float pulse = .55 + .45 * sin(ct * 9. - t * 4. + float(k) * 1.7);
    lines += exp(-d * d / (.0000045 + r * .00003)) * pulse * exp(-r * 3.2);
  }
  col += vec3(.6, .5, 1.) * lines * .9;

  // equatorial wind ring, fixed to the spin axis
  vec2 sa = normalize((rot(-.32) * vec2(0., cos(.42))));
  float eq = dot(p, vec2(sa.y, -sa.x));
  float ax = dot(p, sa) / max(sin(.42), .2);
  float ring = length(vec2(eq, ax));
  float ringGlow = exp(-sq((ring - .19) / .012));
  float ang = atan(ax, eq);
  ringGlow *= .4 + .9 * fbm4(vec2(cos(ang), sin(ang)) * 3. + uSeed * 4.);
  col += vec3(.75, .8, 1.) * ringGlow * .55;

  col = toneHDR(col * 1.1);
  col += stars(p, .03, uSeed + 1., .9) * (1. - env * .6);

  // the star itself, and the flash as a beam crosses our line of sight
  col += flare(p, .7 + facing * 1.4, vec3(.6, .8, 1.));
  col += vec3(.45, .7, 1.) * facing * exp(-r * 2.4) * 1.3;
  col += vec3(.8, .9, 1.) * .0009 / (r * r + .0009) * 1.5;
  return col;
}
`
