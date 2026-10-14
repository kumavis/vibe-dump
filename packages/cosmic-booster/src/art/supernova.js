// Supernova: a blinding core, a ragged shell of glowing filaments thrown out
// round it, a fainter shock front further out, and light rays raking the dust.
export default /* glsl */ `
vec3 art(vec2 uv) {
  vec2 p = P(uv) - vec2(.02, 0.);
  float r = length(p);
  vec2 dir = p / max(r, 1e-4);
  float t = uTime * .05;
  float s = uSeed * 10.;

  float R = .27 + .045 * (fbm4(dir * 1.8 + s) - .5) * 2.;
  float shell = exp(-sq((r - R) / (.09 + .05 * fbm4(dir * 3. + s + 4.))));
  vec2 w = p * 5.5 + vec2(fbm4(p * 3. + s + t), fbm4(p * 3. + s + 5.2 - t)) * 2.;
  float fil = ridged(w + s);
  float fil2 = ridged(w * 1.7 + 3.1 + s);

  vec3 col = vec3(.01, .008, .025);
  col += vec3(.12, .2, .8) * exp(-r * r * 26.) * (.6 + .8 * fbm(p * 7. + s)) * 1.4;  // synchrotron heart
  col += vec3(1., .3, .14) * pow(max(fil, 0.), 4.) * shell * 2.4;
  col += vec3(1., .75, .32) * pow(max(fil2, 0.), 6.) * shell * 2.;
  col += vec3(.2, .95, .75) * pow(max(fil * fil2, 0.), 4.) * shell * 1.4;
  col += vec3(.8, .25, .5) * shell * .14;

  // outer shock
  float Rs = .43 + .01 * sin(uTime * .7);
  float shock = exp(-sq((r - Rs) / .006)) * (.5 + .8 * fbm4(dir * 4. + s + 9.));
  shock += exp(-sq((r - Rs) / .05)) * .12;
  col += vec3(.55, .7, 1.) * shock;

  // god rays: angular noise, falling off with distance
  float a = atan(p.y, p.x);
  float rays = pow(max(fbm4(vec2(cos(a), sin(a)) * 9. + s), 0.), 5.) * 3.;
  rays += pow(max(fbm4(vec2(cos(a), sin(a)) * 23. + s + 7.), 0.), 8.) * 3.;
  col += vec3(1., .85, .7) * rays * exp(-r * 4.5) * .9;

  col = hueShift(col, (uSeed - .5) * 1.);
  col = toneHDR(col * 1.2);
  col += stars(p, .03, uSeed + 4., 1.) * smoothstep(.15, .5, r);

  // the core: bright enough to drown its own nebula
  col += flare(p, 1.5, vec3(1., .9, .8)) * 1.2;
  col += vec3(1., .8, .6) * exp(-r * 9.) * 1.2;
  col += vec3(.6, .7, 1.) * exp(-abs(p.y) * 160.) * exp(-abs(p.x) * 3.5) * .9;  // anamorphic streak
  return col;
}
`
