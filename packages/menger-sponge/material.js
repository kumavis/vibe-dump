import * as THREE from 'three'

// ---------------------------------------------------------------------------
// The Borg look: near-black brushed metal, dense procedural greebles, and a
// network of sickly green seams that flare white-hot while the sponge moves.
//
// Everything here is procedural. No textures, no files, no network — which is
// also what keeps the app working under the Pages sub-path with zero asset URLs.
// ---------------------------------------------------------------------------

// Linear-space shader colours. These are fed straight to the shader as vec3s,
// so they must NOT go through Color()'s sRGB conversion.
const GREEN_LIN = [0.19, 1.0, 0.17] // sickly Borg green ≈ sRGB #78ff72
const HOT_LIN = [1.6, 2.2, 1.35] // >1 white-green core — this is what blooms

export const PALETTE = {
  // F0, not albedo (see createBorgMaterial). Every light and the whole
  // environment are green, so a metal this reflective renders as green metal —
  // which is the one thing a Borg cube must not be. Keeping F0 dark is what
  // buys the contrast between near-black panels and hot green seams.
  metal: 0x4f5854,
  void: 0x03060a,
  fog: 0x040806,
  // The key is heavily green-tinted on purpose. The camera looks DOWN at the
  // cube, so the top face is the largest bright surface in frame; a neutral key
  // clipped it to a colourless white glare that read as grey plastic. Tinting
  // the key means even a blown-out top face stays green-lit metal.
  keyLight: 0x5cffa0,
  fillLight: 0x18ffa0,
  rimLight: 0x9fc4dd,
  coreLight: 0x7cff6a,
}

// Shared uniforms — the render loop writes uTime / uPulse* every frame, and the
// backdrop borrows uTime so its scanlines stay in step.
export const U = {
  uTime: { value: 0 },
  uBump: { value: 0.02 },
  uPanelDensity: { value: 7.0 },
  uGrooveWorld: { value: 0.009 },
  uPulseGain: { value: 1.0 },
  // Scales the above-idle heat. The render loop drives it down as the visible
  // cube count goes up, so the emissive total stays roughly constant across
  // levels instead of scaling with the number of pieces. See main.js.
  uHeatGain: { value: 1.0 },
  uHeatFloor: { value: 0.16 },
  uPulseDir: { value: new THREE.Vector3(0.3, 0.8, 0.5).normalize() },
  uGreen: { value: new THREE.Vector3(...GREEN_LIN) },
  uHot: { value: new THREE.Vector3(...HOT_LIN) },
}

// ---------------------------------------------------------------------------
// Vertex injection
//
// Instanced attributes are only readable in the vertex stage, so they are
// forwarded as varyings. vBScale is the cube's world edge length: it is what
// keeps panel and groove sizes physically constant instead of scaling with the
// cube, so a level-3 leaf looks like a small piece of the same machine rather
// than a shrunken copy of the whole thing.
// ---------------------------------------------------------------------------
const VERT_PARS = /* glsl */ `
attribute float aGlow;
attribute float aSeed;
attribute float aKind;
attribute float aOccl;
varying float vBGlow;
varying float vBSeed;
varying float vBKind;
varying float vBOccl;
varying float vBFacing;
varying float vBScale;
varying vec2  vBUv;
varying vec3  vBNrmL;
varying vec3  vBWPos;
varying vec3  vBWNrm;
`

// `transformed` exists after begin_vertex; `worldPosition` does not yet (it is
// built later in worldpos_vertex), hence the manual multiply.
const VERT_BODY = /* glsl */ `
vBUv    = uv;
vBNrmL  = normal;
vBGlow  = aGlow;
vBSeed  = aSeed;
vBKind  = aKind;
vBOccl  = aOccl;
vBScale = length( instanceMatrix[ 0 ].xyz );
vBWPos  = ( modelMatrix * instanceMatrix * vec4( transformed, 1.0 ) ).xyz;

// Does this face look out of the sponge, or into it? Taken from the live
// instance centre rather than a baked attribute, which means it interpolates
// for free: at depth 0 every cube sits on the origin and the term switches
// itself off, and at every other depth the shell lights up while the tunnel
// walls fall away. That contrast is the only thing that makes the holes in a
// level-3 sponge read as holes instead of more greebles.
vec3  bwc = ( modelMatrix * instanceMatrix * vec4( 0.0, 0.0, 0.0, 1.0 ) ).xyz;
vec3  bwn = normalize( mat3( modelMatrix * instanceMatrix ) * normal );
float br  = length( bwc );
vBFacing  = br > 1e-4 ? dot( bwn, bwc / br ) : 1.0;
vBWNrm    = bwn;
`

// Names are b-prefixed so they cannot collide with common.glsl (rand, saturate,
// pow2, …), which is included right above this block.
const FRAG_PARS = /* glsl */ `
uniform float uTime;
uniform float uBump;
uniform float uPanelDensity;
uniform float uGrooveWorld;
uniform float uPulseGain;
uniform float uHeatGain;
uniform float uHeatFloor;
uniform vec3  uPulseDir;
uniform vec3  uGreen;
uniform vec3  uHot;

varying vec3  vBWNrm;
varying float vBGlow;
varying float vBSeed;
varying float vBKind;
varying float vBOccl;
varying float vBFacing;
varying float vBScale;
varying vec2  vBUv;
varying vec3  vBNrmL;
varying vec3  vBWPos;

float bHash11( float p ){ p = fract( p * 0.1031 ); p *= p + 33.33; p *= p + p; return fract( p ); }
float bHash21( vec2 p ){ vec3 q = fract( vec3( p.xyx ) * 0.1031 ); q += dot( q, q.yzx + 33.33 ); return fract( ( q.x + q.y ) * q.z ); }

// Screen-space anti-aliased "x is below e" — a box filter of the step over the
// pixel footprint. With 8000 boxes and bloom, a bare step() on an emissive line
// shimmers violently, so nothing here is ever allowed to use one.
float bBelow( float x, float e ){ float w = max( fwidth( x ), 1e-5 ); return clamp( ( e - x ) / w + 0.5, 0.0, 1.0 ); }

// Coverage of the band [a,b] under the same footprint. This is the function
// that keeps a level-3 leaf from turning into a solid glowing blob: a pair of
// smoothsteps would settle at ~0.5 once the band is thinner than a pixel, but
// true coverage falls off as (b-a)/footprint, so sub-pixel detail fades out.
float bBand( float x, float a, float b ){
  float w = max( fwidth( x ), 1e-5 );
  return clamp( ( min( x + 0.5 * w, b ) - max( x - 0.5 * w, a ) ) / w, 0.0, 1.0 );
}
`

// All five variables this block drives — diffuseColor (F0), roughnessFactor,
// metalnessFactor, normal (view space) and totalEmissiveRadiance — are declared
// and still unconsumed at the emissivemap_fragment hook, so the entire look
// fits in one injection point.
const FRAG_BODY = /* glsl */ `
// ---- per-face identity ----------------------------------------------------
vec3  an     = abs( vBNrmL );
float faceId = an.y + an.z * 2.0 + step( 0.0, dot( vBNrmL, vec3( 1.0 ) ) ) * 3.0;
float fSeed  = vBSeed * 71.317 + faceId * 13.77;

// How well this face resolves on screen, as a face-fraction per pixel. A
// level-3 leaf is only ~13 px across, and its greebles are clamped to a minimum
// physical width, so without this gate the fine detail stays fat relative to
// the face and 8000 of them merge into one glowing blob. Fading the greebles
// out below the resolution limit is both cheaper and what a real lens does.
float fpx    = max( fwidth( vBUv.x ), fwidth( vBUv.y ) );
float detail = 1.0 - smoothstep( 0.020, 0.070, fpx );

// ---- panel grid, at constant PHYSICAL panel size --------------------------
float divN  = clamp( floor( vBScale * uPanelDensity ), 1.0, 6.0 )
            + floor( bHash11( fSeed ) * 2.0 );
vec2  g     = vBUv * divN;
vec2  cell  = floor( g );
vec2  f     = fract( g );
float plate = bHash21( cell + vec2( fSeed, faceId ) );

float gw     = clamp( uGrooveWorld / max( vBScale, 1e-4 ), 0.006, 0.040 );
vec2  dCell  = min( f, 1.0 - f ) / divN;
float groove = bBelow( min( dCell.x, dCell.y ), gw );

// ---- cube-edge chamfer + the lit lattice seam just inside it --------------
vec2  dEdge = min( vBUv, 1.0 - vBUv );
float edge  = min( dEdge.x, dEdge.y );
float rA    = clamp( 0.010 / max( vBScale, 1e-4 ), 0.010, 0.028 );
float rB    = rA + clamp( 0.014 / max( vBScale, 1e-4 ), 0.012, 0.026 );
float bevel = bBelow( edge, rA );
float seam  = bBand( edge, rA, rB );

// ---- brushed grain + grime ------------------------------------------------
vec2  bu    = mix( vBUv, vBUv.yx, step( 0.5, bHash11( fSeed + 3.1 ) ) );
float grain = bHash21( vec2( floor( bu.x * 190.0 ), floor( bu.y * 6.0 ) ) );
float grime = bHash21( floor( vBUv * 9.0 ) + fSeed );

// ---- vents + indicator pips ------------------------------------------------
float slots = bBelow( abs( fract( f.y * 5.0 ) - 0.5 ), 0.20 )
            * bBand( f.x, 0.20, 0.80 )
            * bBand( f.y, 0.18, 0.82 );
float vent  = step( 0.70, plate ) * slots * detail;

float pip   = step( 0.55, bHash11( fSeed + plate * 17.0 ) )
            * bBand( f.x, 0.075, 0.145 ) * bBand( f.y, 0.075, 0.145 ) * detail;

// ---- conduits, with data-flow dashes crawling along them ------------------
float cw = 0.9 * gw;
float px0 = 0.20 + 0.60 * bHash11( fSeed + 11.7 );
float py0 = 0.20 + 0.60 * bHash11( fSeed + 23.3 );
float cx = bBand( vBUv.x, px0 - cw, px0 + cw );
float cy = bBand( vBUv.y, py0 - cw, py0 + cw );
float dx = mix( 0.32, 1.0, smoothstep( 0.32, 0.46, fract( vBUv.y * 8.0 - uTime * 0.55 + vBSeed * 6.28 ) ) );
float dy = mix( 0.32, 1.0, smoothstep( 0.32, 0.46, fract( vBUv.x * 8.0 + uTime * 0.42 + vBSeed * 9.42 ) ) );
float conduit = max( cx * step( 0.40, bHash11( fSeed + 5.5 ) ) * dx,
                     cy * step( 0.62, bHash11( fSeed + 9.1 ) ) * dy ) * detail;

// ---- surface response ------------------------------------------------------
float recess = max( max( groove, bevel ), vent * 0.85 );
float ao     = 1.0 - 0.78 * recess;

// vBOccl is the cell's static exposure (see sponge.js): 1 on the outer shell,
// near 0 deep inside the lattice. It is what turns the tunnels into tunnels.
float shell = mix( 0.22, 1.0, smoothstep( -0.25, 0.60, vBFacing ) );
float expo  = ( 0.30 + 0.70 * vBOccl ) * shell;
diffuseColor.rgb *= ao * expo * ( 0.44 + 0.64 * plate ) * ( 0.90 + 0.20 * grime );
// Grime is a dielectric, so it both roughens the steel and de-metallises it.
// Up-facing greeble is roughened hard. The key light and the env's cold kicker
// both come from above, and on a polished up-face they collapsed into one
// clipped white specular blob — the brightest thing in the frame, on the
// largest visible surface. Spreading that highlight turns it back into a sheen.
float upFace = clamp( vBWNrm.y, 0.0, 1.0 );
roughnessFactor   = clamp( roughnessFactor * ( 0.82 + 0.40 * plate )
                         + 0.26 * recess + 0.30 * grime * grime
                         + 0.20 * upFace * upFace
                         + ( grain - 0.5 ) * 0.09 * detail, 0.10, 0.98 );
metalnessFactor   = clamp( metalnessFactor - 0.34 * recess - 0.16 * grime, 0.30, 1.0 );

// ---- derivative bump: machined relief with zero textures ------------------
// The variable "normal" is VIEW space here, so the position gradient has to
// come from view-space position (-vViewPosition), never from world position.
float hgt = -0.85 * groove - 1.25 * bevel - 0.60 * vent
          +  0.14 * plate  + 0.05 * grain + 0.22 * ( conduit + pip );
vec3  vpos = -vViewPosition;
vec3  dpx  = dFdx( vpos ), dpy = dFdy( vpos );
vec3  r1   = cross( dpy, normal ), r2 = cross( normal, dpx );
float det  = dot( dpx, r1 );
vec3  grad = sign( det ) * ( dFdx( hgt ) * r1 + dFdy( hgt ) * r2 );
normal = normalize( abs( det ) * normal - uBump * detail * grad );

// ---- green energy ----------------------------------------------------------
// The emissive budget is deliberately tight. At level 3 the seams cover a
// sizeable fraction of every 13-pixel face, so anything generous here stops
// being "glowing seams" and becomes one white blob with a cube-shaped edge.
// Only the ABOVE-IDLE part of the heat is scaled by uHeatGain, so a settled
// dwell looks identical at level 1 and level 3 while the charge/flash peak is
// divided down as the piece count (and therefore the total lit area) grows.
float heat = clamp( uHeatFloor + ( clamp( vBGlow, 0.0, 1.0 ) - uHeatFloor ) * uHeatGain, 0.0, 1.0 );
float idle = 0.32 + 0.10 * sin( uTime * 1.6 + vBSeed * 37.0 );
float pw   = pow( 0.5 + 0.5 * sin( dot( vBWPos, uPulseDir ) * 5.1 - uTime * 2.3 ), 6.0 ) * uPulseGain;
float amp  = idle + 0.68 * heat + 0.40 * pw * ( 0.30 + 0.70 * heat );

// Corner blocks run a little hotter than the edge struts, so the lattice's
// joints read as the load-bearing hardware.
float lit  = ( seam * 0.88 + conduit * 0.50 + 0.85 * pip + 0.22 * vent ) * ( 1.0 + 0.25 * vBKind );

vec3 em  = uGreen * lit * amp;
em      += uHot   * lit * heat * heat * 0.32;   // white-hot core mid-piston
em      += uHot   * pip * pw * 0.30;            // pips strobe as the pulse passes
em      += uGreen * 0.006 * ( 1.0 - recess ) * ( 0.6 + 1.4 * heat );

vec3  Vdir = normalize( vViewPosition );
float fres = pow( 1.0 - saturate( dot( normal, Vdir ) ), 3.5 );
em += uGreen * fres * ( 0.03 + 0.14 * heat );   // silhouette halo — the lattice reads from far off

totalEmissiveRadiance += em * ( 0.12 + 0.88 * vBOccl ) * shell;
diffuseColor.rgb      += uGreen * 0.030 * heat; // F0 tints green while charging
`

// ---------------------------------------------------------------------------
// The material
//
// Do not "fix" the base colour. For a metal, `color` is F0; diffuse is zero at
// metalness 1. A near-black F0 reflects nothing and the cube disappears. The
// blackness has to come from the environment being 98% black (see makeBorgEnv),
// not from the albedo — that is exactly why the Borg cube reads as black steel
// and still throws hard green glints.
// ---------------------------------------------------------------------------
export function createBorgMaterial() {
  const mat = new THREE.MeshStandardMaterial({
    color: PALETTE.metal,
    metalness: 1.0,
    roughness: 0.42,
    envMapIntensity: 0.32,
    dithering: true, // kills banding in the near-black falloff
  })
  // The derivative bump needs dFdx/dFdy, which are core in GLSL ES 3.0 — no
  // extension pragma required on the WebGL2 path, and three's WebGL1 fallback
  // already enables GL_OES_standard_derivatives for the physical shader.
  mat.customProgramCacheKey = () => 'borg-v1'

  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, U)
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\n' + VERT_PARS)
      .replace('#include <begin_vertex>', '#include <begin_vertex>\n' + VERT_BODY)
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\n' + FRAG_PARS)
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n' + FRAG_BODY)
  }

  return mat
}

// ---------------------------------------------------------------------------
// Environment: a float equirect built in JS, 98% black with three hot green
// bars and one cold steel kicker. Those four blobs are literally the only thing
// the metal reflects, which is what makes it read near-black yet shiny.
// ---------------------------------------------------------------------------
export function makeBorgEnv(renderer) {
  const W = 256
  const H = 128
  const data = new Float32Array(W * H * 4)
  const bars = [
    { u: 0.18, v: 0.42, w: 0.045, h: 0.16, i: 5.5 },
    { u: 0.66, v: 0.55, w: 0.03, h: 0.34, i: 3.0 },
    { u: 0.9, v: 0.3, w: 0.07, h: 0.06, i: 1.6 },
  ]
  for (let y = 0; y < H; y++) {
    const v = y / (H - 1)
    for (let x = 0; x < W; x++) {
      const u = x / (W - 1)
      let r = 0.006 + 0.01 * (1 - v)
      let g = 0.014 + 0.03 * (1 - v)
      let b = 0.01 + 0.016 * (1 - v)
      for (const bar of bars) {
        const du = Math.abs(((u - bar.u + 1.5) % 1) - 0.5) // wraps in longitude
        const dv = v - bar.v
        const f = Math.exp(-(du * du) / (bar.w * bar.w) - (dv * dv) / (bar.h * bar.h))
        r += 0.18 * bar.i * f
        g += 1.0 * bar.i * f
        b += 0.42 * bar.i * f
      }
      // One cold kicker, so the whole thing is not monochrome green. Kept dim:
      // it is the only near-white thing the metal can reflect, and turned up it
      // clips the up-facing panels to a grey glare.
      const du2 = Math.abs(((u - 0.42 + 1.5) % 1) - 0.5)
      const dv2 = v - 0.22
      const f2 = Math.exp(-(du2 * du2) / 0.0036 - (dv2 * dv2) / 0.02)
      r += 0.3 * f2
      g += 0.44 * f2
      b += 0.6 * f2
      const i = (y * W + x) * 4
      data[i] = r
      data[i + 1] = g
      data[i + 2] = b
      data[i + 3] = 1
    }
  }
  const tex = new THREE.DataTexture(data, W, H, THREE.RGBAFormat, THREE.FloatType)
  tex.mapping = THREE.EquirectangularReflectionMapping
  tex.colorSpace = THREE.NoColorSpace // the values above are already linear
  tex.minFilter = THREE.LinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.needsUpdate = true

  const pmrem = new THREE.PMREMGenerator(renderer)
  pmrem.compileEquirectangularShader()
  const rt = pmrem.fromEquirectangular(tex)
  tex.dispose()
  pmrem.dispose()
  return rt.texture
}

// ---------------------------------------------------------------------------
// Backdrop: a BackSide sphere with a faint lat/long grid and drifting
// scanlines. Every value here sits far under the bloom threshold, so the
// backdrop can never bloom or lift the black.
// ---------------------------------------------------------------------------
export function makeBackdrop() {
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(60, 32, 16),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: { uTime: U.uTime },
      vertexShader: /* glsl */ `
        varying vec3 vDir;
        void main () {
          vDir = normalize( position );
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }`,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        varying vec3 vDir;
        void main () {
          vec3 d = normalize( vDir );
          float h = d.y * 0.5 + 0.5;
          vec3 col = mix( vec3( 0.004, 0.010, 0.008 ), vec3( 0.010, 0.024, 0.018 ), pow( h, 1.6 ) );

          vec2 sph = vec2( atan( d.z, d.x ), asin( clamp( d.y, -1.0, 1.0 ) ) );
          vec2 g   = vec2( sph.x * ( 8.0 / 3.14159265 ), sph.y * ( 8.0 / 1.57079633 ) );
          vec2 gf  = abs( fract( g ) - 0.5 );
          // Clamp fwidth or the atan seam draws a bright meridian.
          vec2 w   = min( fwidth( g ) * 1.2, vec2( 0.05 ) );
          float grid = ( 1.0 - smoothstep( 0.012, 0.012 + w.x, gf.x ) )
                     + ( 1.0 - smoothstep( 0.012, 0.012 + w.y, gf.y ) );
          col += vec3( 0.02, 0.10, 0.05 ) * clamp( grid, 0.0, 1.0 ) * 0.20;

          col *= 0.55 + 0.75 * smoothstep( 0.95, 0.15, length( d.xy ) );
          col *= 0.92 + 0.08 * sin( d.y * 140.0 + uTime * 0.6 );
          // ±0.25% dither — removes 8-bit gradient banding in the void.
          col += ( fract( sin( dot( gl_FragCoord.xy, vec2( 12.9898, 78.233 ) ) ) * 43758.5453 ) - 0.5 ) * 0.0025;
          gl_FragColor = vec4( col, 1.0 );
        }`,
    }),
  )
  sky.frustumCulled = false
  return sky
}
