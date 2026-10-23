// Stellar nursery: domain-warped gas lit from a hollowed-out core, dark dust
// pillars rim-lit along their edges, and a knot of young hot stars.
export default /* glsl */ `
vec3 art(vec2 uv) {
  vec2 p = P(uv);
  p += uTilt * .015;
  float t = uTime * .012;
  vec2 o = vec2(uSeed * 37.1, uSeed * 13.7);
  vec2 q = vec2(fbm4(p * 1.5 + o), fbm4(p * 1.5 + o + vec2(5.2, 1.3)));
  vec2 r = vec2(fbm4(p * 1.9 + 2.4 * q + vec2(1.7, 9.2) + t),
                fbm4(p * 1.9 + 2.4 * q + vec2(8.3, 2.8) - t));
  float n = fbm(p * 2.1 + 2.8 * r + o);

  vec2 c = vec2(.14, .03) + (hash22(o) - .5) * .1;
  float cav = length((p - c) * vec2(1., 1.25));
  float inner = smoothstep(.42, .04, cav);
  float env = smoothstep(.95, .12, length((p - c * .5) * vec2(.72, 1.)));

  vec3 ha = vec3(1., .2, .42);
  vec3 o3 = vec3(.12, .78, .9);
  vec3 gold = vec3(1., .72, .38);

  vec3 col = vec3(.008, .008, .026);
  float gas = smoothstep(.32, .95, n);
  col += ha * pow(max(gas, 0.), 1.7) * (.35 + .9 * r.x) * env * 1.7;
  col += vec3(.45, .2, .95) * pow(max(r.y, 0.), 4.) * env * .55;
  col += o3 * sq(gas * r.y * 1.35) * 3.2 * inner;
  col += gold * sq(max(n - .5, 0.) * 2.2) * 2.2 * inner;
  col += vec3(.9, .95, 1.) * exp(-cav * cav * 45.) * .55;

  // dust: dark pillars, with a hot rim where the light from the core eats them
  float d = fbm(p * 2.7 + q * 1.7 + 20.);
  float dust = smoothstep(.5, .7, d) * (1. - inner * .5);
  float rim = smoothstep(.45, .5, d) - smoothstep(.5, .56, d);
  col *= 1. - .94 * dust;
  col += vec3(1., .55, .45) * rim * (.3 + 1.4 * inner) * env;

  col = hueShift(col, (uSeed - .5) * 1.4);
  col = toneHDR(col * 1.3);

  col += stars(p, .026, uSeed, 1.) * (1. - dust * .9);
  col += stars(p, .07, uSeed + 3., .9) * (1. - dust * .7);
  for (int i = 0; i < 4; i++) {
    vec2 sp = c + (hash22(vec2(float(i), uSeed * 9.)) - .5) * vec2(.1, .07);
    col += flare(p - sp, .3 + .3 * hash11(float(i) + uSeed), vec3(.75, .88, 1.)) * .8;
  }
  return col;
}
`
