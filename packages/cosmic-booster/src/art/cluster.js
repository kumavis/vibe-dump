// Open cluster: seven blue-white sisters with diffraction spikes, wrapped in
// the streaky blue reflection nebula they happen to be passing through.
export default /* glsl */ `
vec3 art(vec2 uv) {
  vec2 p = P(uv);
  p += uTilt * .012;
  float s = uSeed * 10.;
  vec3 col = vec3(.006, .01, .028);

  // reflection nebula: dust combed into streaks, lit blue by the stars
  vec2 w = rot(.45) * p;
  float neb = fbm(w * vec2(2.2, 8.) + vec2(fbm4(p * 3. + s), 0.) * 1.2 + s);
  float neb2 = fbm4(p * 2. + s + 3.);
  col += vec3(.2, .4, 1.) * pow(max(neb, 0.), 2.5) * pow(max(neb2, 0.), 1.2) * 3.;
  col += vec3(.55, .7, 1.) * pow(max(neb, 0.), 5.) * 1.6;
  col = toneHDR(col);
  col += stars(p, .022, uSeed, 1.) + stars(p, .055, uSeed + 4., .9);

  // the dipper
  vec2 S[7];
  S[0] = vec2(-.02, .0);   S[1] = vec2(.15, -.08);  S[2] = vec2(.12, .09);
  S[3] = vec2(.21, .14);   S[4] = vec2(.27, .03);   S[5] = vec2(-.28, .02);
  S[6] = vec2(-.27, .07);
  float B[7];
  B[0] = 1.5; B[1] = 1.; B[2] = 1.05; B[3] = .8; B[4] = .95; B[5] = 1.1; B[6] = .6;
  mat2 m = rot((uSeed - .5) * .5);
  for (int i = 0; i < 7; i++) {
    vec2 sp = m * S[i] + vec2(.02, -.03);
    vec2 d = p - sp;
    col += flare(d, B[i] * .75, vec3(.62, .78, 1.)) * .9;
    col += vec3(.3, .5, 1.) * exp(-length(d) * 14.) * .12 * B[i];
  }
  return col;
}
`
