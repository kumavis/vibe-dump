// The logarithmic depth buffer, for our own shaders (ENGINEERING.md §2).
//
// One WebGLRenderer({ logarithmicDepthBuffer: true }) draws both scenes. three
// r160 then defines USE_LOGDEPTHBUF (and, on WebGL2, USE_LOGDEPTHBUF_EXT) in
// every ShaderMaterial and uploads logDepthBufFC = 2 / log2(camera.far + 1) to
// any program that declares it, but adds no code: a ShaderMaterial without
// these four chunks keeps writing ordinary depth while every built-in
// material writes log depth, and the two occlude each other wrongly. So every
// ShaderMaterial drawn into a scene includes all four (fullscreen passes with
// the depth test off do not); the smoke test asserts that every scene
// material's compiled source holds vFragDepth.
//
// Not three's own chunks: they call isPerspectiveMatrix() and EPSILON from
// its <common>, and <common> defines PI as 3.141592653589793 against our
// constants chunk's 3.14159265, a macro redefinition GLSL ES 3.00 rejects.
// The same arithmetic as three's, written out (R9 §3.3).
//
//   vertex:   ${logDepthParsVertex} at the top, ${logDepthVertex} after gl_Position is written
//   fragment: ${logDepthParsFragment} at the top, ${logDepthFragment} anywhere in main()
//
// Something drawn at the far plane on purpose (the sky dome and the stars at
// gl_Position.xyww) uses logDepthVertexFar instead, which keeps the depth
// the rasteriser gives it (1.0), so the land always stands in front of it.
//
// polygonOffset does nothing once a fragment writes its own depth: lines and
// routes rely on their lift, and a box's sea bed sinks below its water.

export const logDepthParsVertex = /* glsl */ `
#ifdef USE_LOGDEPTHBUF
out float vFragDepth;
out float vIsPerspective;
#endif
`

export const logDepthVertex = /* glsl */ `
#ifdef USE_LOGDEPTHBUF
  vFragDepth = 1.0 + gl_Position.w;
  vIsPerspective = projectionMatrix[2][3] == -1.0 ? 1.0 : 0.0;
#endif
`

// (the sky's: depth as rasterised, at the far plane)
export const logDepthVertexFar = /* glsl */ `
#ifdef USE_LOGDEPTHBUF
  vFragDepth = 1.0 + gl_Position.w;
  vIsPerspective = 0.0;
#endif
`

export const logDepthParsFragment = /* glsl */ `
#ifdef USE_LOGDEPTHBUF
uniform float logDepthBufFC;
in float vFragDepth;
in float vIsPerspective;
#endif
`

export const logDepthFragment = /* glsl */ `
#ifdef USE_LOGDEPTHBUF
  // (an orthographic camera keeps the ordinary depth, as three's own chunk does)
  gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2(vFragDepth) * logDepthBufFC * 0.5;
#endif
`
