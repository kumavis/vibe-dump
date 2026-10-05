// Ringed giant, ray-traced: an oblate banded sphere and a ring plane, each
// casting its shadow on the other. Tilting the card swings the camera a little,
// so the rings open and close like a lenticular print.
export default /* glsl */ `
const float RIN = 1.32;
const float ROUT = 2.32;
const float OBL = .91;

float ringDensity(float r) {
  float x = (r - RIN) / (ROUT - RIN);
  float d = .55 + .45 * gnoise(vec2(r * 14., 1.3)) + .25 * gnoise(vec2(r * 47., 7.7));
  d *= smoothstep(0., .06, x) * smoothstep(1., .93, x);
  d *= mix(.25, 1., smoothstep(.1, .3, x));                 // faint inner C ring
  d *= 1. - .92 * exp(-sq((r - 1.96) / .035));          // Cassini division
  d *= 1. - .8 * exp(-sq((r - 2.2) / .008));            // Encke gap
  return clamp(d, 0., 1.);
}

float sphereHit(vec3 ro, vec3 rd) {
  ro.y /= OBL; rd.y /= OBL;
  float a = dot(rd, rd), b = dot(ro, rd), c = dot(ro, ro) - 1.;
  float h = b * b - a * c;
  if (h < 0.) return -1.;
  return (-b - sqrt(h)) / a;
}

vec3 bands(vec3 n, float seed) {
  float lat = n.y;
  float lon = atan(n.z, n.x) + uTime * .04;
  float warp = fbm4(vec2(lon * 1.6, lat * 9.) + seed * 7.) - .5;
  float b = lat * 7.5 + warp * 1.4 + .35 * sin(lat * 23. + warp * 4.);
  vec3 c1 = vec3(.93, .82, .6), c2 = vec3(.78, .58, .36), c3 = vec3(.98, .92, .78);
  vec3 c = mix(c1, c2, .5 + .5 * sin(b));
  c = mix(c, c3, smoothstep(.6, 1., sin(b * 1.7 + 1.)) * .5);
  c = mix(c, vec3(.62, .66, .7), smoothstep(.72, .98, abs(lat)));  // pale poles
  return c;
}

vec3 art(vec2 uv) {
  vec2 p = P(uv);
  float el = .3 + uTilt.y * .09;
  float az = -.35 + uTilt.x * .2;
  vec3 ro = 7.4 * vec3(sin(az) * cos(el), sin(el), cos(az) * cos(el));
  vec3 fw = normalize(-ro);
  vec3 rt = normalize(cross(fw, vec3(0, 1, 0)));
  vec3 up = cross(rt, fw);
  vec2 pp = rot(-.36) * (p - vec2(.04, -.02));
  vec3 rd = normalize(fw * 1.55 + rt * pp.x + up * pp.y);
  vec3 L = normalize(vec3(-.75, .32, .65));

  vec3 bg = vec3(.006, .008, .02) + stars(p, .03, uSeed, 1.) + stars(p, .075, uSeed + 2., .8);
  bg += vec3(.18, .14, .3) * pow(max(fbm4(p * 1.5 + uSeed * 9.), 0.), 3.) * .25;
  vec3 col = bg;

  float ts = sphereHit(ro, rd);
  float tr = -ro.y / rd.y;
  vec3 rp = ro + rd * tr;
  float rr = length(rp.xz);
  bool ringOk = tr > 0. && rr > RIN && rr < ROUT;

  vec3 tint = hueShift(vec3(1.), 0.);
  float hs = uSeed < .55 ? 0. : (uSeed - .55) * 6.;

  if (ts > 0.) {
    vec3 sp = ro + rd * ts;
    vec3 n = normalize(vec3(sp.x, sp.y / (OBL * OBL), sp.z));
    float ndl = dot(n, L);
    float lit = smoothstep(-.12, .55, ndl);
    // ring shadow on the planet
    float tsh = -sp.y / L.y;
    vec3 shp = sp + L * tsh;
    float shr = length(shp.xz);
    if (tsh > 0. && shr > RIN && shr < ROUT) lit *= 1. - .85 * ringDensity(shr);
    vec3 c = hueShift(bands(n, uSeed), hs);
    float rim = pow(max(1. - max(dot(n, -rd), 0.), 0.), 3.);
    col = c * (lit * 1.25 + .025) + vec3(.5, .7, 1.) * rim * smoothstep(-.3, .4, ndl) * .7;
    col += c * .05 * smoothstep(.0, -.3, ndl) * (rp.y > 0. ? 1. : .4); // ringshine on the night side
  }
  if (ringOk && (ts < 0. || tr < ts)) {
    float dens = ringDensity(rr);
    float sh = sphereHit(rp + L * .001, L) > 0. ? .08 : 1.;
    float side = sign(ro.y) == sign(L.y) ? 1. : .35;
    vec3 rc = mix(vec3(.82, .72, .56), vec3(.96, .9, .8), gnoise(vec2(rr * 30., 2.)) * .5 + .5);
    rc = hueShift(rc, hs);
    vec3 lc = rc * sh * side * (.95 + .4 * abs(L.y));
    col = mix(col, lc, dens * .92);
  }
  col = toneHDR(col * 1.08);
  // the sun glinting off the limb
  return col;
}
`
