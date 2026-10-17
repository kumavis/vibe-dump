// Black hole, ray-marched. Each pixel's light path is integrated backwards
// through a Schwarzschild-like pull (units of the Schwarzschild radius, with the
// h² term that gives a photon sphere at 1.5), so the far side of the accretion
// disk is lensed up over the shadow and under it, and a thin photon ring hugs
// the edge. The disk's near side is Doppler-boosted, the starfield behind is
// lensed too, and tilting the card swings the camera — the disk opens and
// closes as you turn it in your hand.
export default /* glsl */ `
const float RIN = 2.6;
const float ROUT = 11.5;

vec3 diskColor(float k) {
  vec3 c = mix(vec3(.6, .05, .08), vec3(1., .32, .06), smoothstep(0., .38, k));
  c = mix(c, vec3(1., .66, .18), smoothstep(.3, .66, k));
  c = mix(c, vec3(1., .94, .78), smoothstep(.72, 1.02, k));
  c = mix(c, vec3(.8, .88, 1.), smoothstep(1., 1.3, k));
  return c;
}

vec4 diskSample(vec3 hit, vec3 rd) {
  float r = length(hit.xz);
  float a = atan(hit.z, hit.x);
  float om = pow(max(r, 0.), -1.5);
  float ph = a - uTime * om * 1.1;
  vec2 cs = vec2(cos(ph), sin(ph));
  float n = fbm3(vec3(cs * 1.5, r * 1.6) + uSeed * 3.);
  float fine = gnoise3(vec3(cs * 3.5, r * 9.));
  float lanes = .75 + .25 * sin(r * 11. + n * 6.);
  float streak = (.35 + 1.1 * n + .35 * fine) * lanes;
  float x = (r - RIN) / (ROUT - RIN);
  float prof = smoothstep(0., .025, x) * pow(max(1. - x, 0.), 1.4) * pow(max(RIN / r, 0.), 1.1);

  float v = min(sqrt(.5 / max(r - 1., .4)), .72);
  vec3 vdir = normalize(vec3(-hit.z, 0., hit.x));
  float cosT = dot(vdir, -normalize(rd));
  float gam = 1. / sqrt(1. - v * v);
  float g = sqrt(max(1. - 1. / r, 0.)) / (gam * (1. - v * cosT));
  float I = prof * streak * pow(max(g, 0.), 3.2) * 3.2;
  float k = clamp(.98 - x * 1.35 + (g - 1.) * .75, 0., 1.3);
  float alpha = clamp(prof * streak * 1.7, 0., .97);
  return vec4(diskColor(k) * I, alpha);
}

vec3 sky(vec3 d) {
  vec3 col = vec3(.003, .003, .01);
  float n = fbm3(d * 2.1 + uSeed * 5.);
  float n2 = fbm3(d * 4.3 + 7.);
  col += vec3(.3, .12, .5) * pow(max(n, 0.), 3.5) * .55;
  col += vec3(.06, .25, .5) * pow(max(n2 * n, 0.), 2.5) * .45;
  for (int L = 0; L < 2; L++) {
    float sc = L == 0 ? 70. : 170.;
    vec3 g = d * sc;
    vec3 id = floor(g);
    vec3 f = fract(g) - .5;
    vec3 h = hash33(id + float(L) * 31.);
    float dist = length(f - (h - .5) * .6);
    float m = pow(max(hash13(id + 7.7 + float(L)), 0.), 9.);
    float sz = .07 + .13 * m;
    col += starTint(h.z) * exp(-dist * dist / (sz * sz)) * (.35 + 4. * m) * step(.4, hash13(id + 3.3));
  }
  return col;
}

vec3 art(vec2 uv) {
  vec2 p = P(uv) - vec2(0., .075);
  float el = .105 + uTilt.y * .075;
  float az = uTilt.x * .3;
  float D = 19.;
  vec3 ro = D * vec3(sin(az) * cos(el), sin(el), cos(az) * cos(el));
  vec3 fw = normalize(-ro);
  vec3 rt = normalize(cross(fw, vec3(0, 1, 0)));
  vec3 up = cross(rt, fw);
  vec2 pp = rot(-.13) * p;
  vec3 rd = normalize(fw * .6 + rt * pp.x + up * pp.y);

  vec3 pos = ro, dir = rd;
  vec3 hv = cross(pos, dir);
  float h2 = dot(hv, hv);
  vec3 col = vec3(0);
  float T = 1.;
  bool captured = false;
  float minR = 1e3;
  // velocity Verlet: second order, so the step count changing from one pixel to
  // the next doesn't print faint rings into the lensed starfield
  vec3 acc = -1.5 * h2 * pos / pow(max(length(pos), 0.), 5.);
  for (int i = 0; i < 180; i++) {
    float r = length(pos);
    minR = min(minR, r);
    if (r < 1.) { captured = true; break; }
    if (r > 48. || T < .01) break;
    float dt = clamp(.065 * r, .012, 1.4);
    vec3 np = pos + dir * dt + .5 * acc * dt * dt;
    vec3 nacc = -1.5 * h2 * np / pow(max(length(np), .5), 5.);
    dir += .5 * (acc + nacc) * dt;
    acc = nacc;
    if (pos.y * np.y < 0.) {
      vec3 hit = mix(pos, np, pos.y / (pos.y - np.y));
      float hr = length(hit.xz);
      if (hr > RIN && hr < ROUT) {
        vec4 d = diskSample(hit, dir);
        col += T * d.rgb;
        T *= 1. - d.a;
      }
    }
    pos = np;
  }
  if (!captured) col += T * sky(normalize(dir));
  // the photon sphere's own faint glow, where paths wound round before escaping
  col += vec3(1., .8, .55) * exp(-sq((minR - 1.55) / .08)) * .35 * T;
  return toneHDR(col * 1.05);
}
`
