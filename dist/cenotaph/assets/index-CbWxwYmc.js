(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const l of n)if(l.type==="childList")for(const c of l.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&s(c)}).observe(document,{childList:!0,subtree:!0});function t(n){const l={};return n.integrity&&(l.integrity=n.integrity),n.referrerPolicy&&(l.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?l.credentials="include":n.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function s(n){if(n.ep)return;n.ep=!0;const l=t(n);fetch(n.href,l)}})();function Wt(o){const e=o.getContext("webgl2",{antialias:!1,alpha:!1,depth:!1,stencil:!1,premultipliedAlpha:!1,preserveDrawingBuffer:!1,powerPreference:"high-performance"});if(!e)return null;const t=!!(e.getExtension("EXT_color_buffer_float")||e.getExtension("EXT_color_buffer_half_float"));return e.getExtension("OES_texture_float_linear"),{gl:e,floatOk:t}}function ct(o,e,t){const s=o.createShader(e);if(o.shaderSource(s,t),o.compileShader(s),!o.getShaderParameter(s,o.COMPILE_STATUS)){const n=o.getShaderInfoLog(s),l=t.split(`
`).map((c,r)=>`${String(r+1).padStart(3)} ${c}`).join(`
`);throw new Error(`shader compile failed:
${n}
${l}`)}return s}function oe(o,e,t,s=""){if(s){const r=t.indexOf(`
`);t=t.slice(0,r+1)+s+t.slice(r+1)}const n=o.createProgram();if(o.attachShader(n,ct(o,o.VERTEX_SHADER,e)),o.attachShader(n,ct(o,o.FRAGMENT_SHADER,t)),o.linkProgram(n),!o.getProgramParameter(n,o.LINK_STATUS))throw new Error(`link failed: ${o.getProgramInfoLog(n)}`);const l={},c=o.getProgramParameter(n,o.ACTIVE_UNIFORMS);for(let r=0;r<c;r++){const a=o.getActiveUniform(n,r),u=a.name.replace(/\[0\]$/,"");l[u]=o.getUniformLocation(n,a.name)}return{p:n,u:l}}function X(o,e,t,{float:s=!0,linear:n=!0,channels:l=4}={}){const c=o.createTexture();o.bindTexture(o.TEXTURE_2D,c);let r,a,u;s?(r=l===2?o.RG16F:o.RGBA16F,a=l===2?o.RG:o.RGBA,u=o.HALF_FLOAT):(r=o.RGBA8,a=o.RGBA,u=o.UNSIGNED_BYTE),o.texImage2D(o.TEXTURE_2D,0,r,e,t,0,a,u,null);const f=n?o.LINEAR:o.NEAREST;o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,f),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,f),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_S,o.CLAMP_TO_EDGE),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_T,o.CLAMP_TO_EDGE);const i=o.createFramebuffer();o.bindFramebuffer(o.FRAMEBUFFER,i),o.framebufferTexture2D(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,c,0);const h=o.checkFramebufferStatus(o.FRAMEBUFFER)===o.FRAMEBUFFER_COMPLETE;return o.bindFramebuffer(o.FRAMEBUFFER,null),{tex:c,fbo:i,w:e,h:t,ok:h}}function lt(o,e){e&&(o.deleteTexture(e.tex),o.deleteFramebuffer(e.fbo))}function V(o,e){e?(o.bindFramebuffer(o.FRAMEBUFFER,e.fbo),o.viewport(0,0,e.w,e.h)):(o.bindFramebuffer(o.FRAMEBUFFER,null),o.viewport(0,0,o.drawingBufferWidth,o.drawingBufferHeight))}function B(o,e,t,s){o.activeTexture(o.TEXTURE0+e),o.bindTexture(o.TEXTURE_2D,t),s&&o.uniform1i(s,e)}function Zt(o){const e=o.createVertexArray();return()=>{o.bindVertexArray(e),o.drawArrays(o.TRIANGLES,0,3)}}const O={HALF_W:46,Z0:-128,Z1:72,H:30,SLAB:1.1,PIER_X:27,PIER_HALF:1.8,PIER_Z0:-119,PIER_DZ:19,PIER_N:10,HOLE_X:4,HOLE_Z:-16,HOLE_SPAN:26},Yt=9;function Kt(){return Object.entries(O).map(([o,e])=>Number.isInteger(e)&&o.endsWith("_N")?`#define ROOM_${o} ${e}
`:`#define ROOM_${o} ${e.toFixed(4)}
`).join("")}const Jt=.9;function ke(o){const e=O,t=Jt;let[s,n,l]=o;s=Math.max(-46+t,Math.min(e.HALF_W-t,s)),l=Math.max(e.Z0+t,Math.min(e.Z1-t,l)),n=Math.max(.6,Math.min(e.H-1.5,n));for(const c of[-27,e.PIER_X]){const r=Math.round((l-e.PIER_Z0)/e.PIER_DZ);if(r<0||r>=e.PIER_N)continue;const a=e.PIER_Z0+r*e.PIER_DZ,u=e.PIER_HALF+t,f=s-c,i=l-a;Math.abs(f)<u&&Math.abs(i)<u&&(u-Math.abs(f)<u-Math.abs(i)?s=c+Math.sign(f||1)*u:l=a+Math.sign(i||1)*u)}return s=Math.max(-46+t,Math.min(e.HALF_W-t,s)),l=Math.max(e.Z0+t,Math.min(e.Z1-t,l)),[s,n,l]}function W(o,e){const t=new Array(9);for(let s=0;s<3;s++)for(let n=0;n<3;n++)t[s*3+n]=o[s*3]*e[n]+o[s*3+1]*e[3+n]+o[s*3+2]*e[6+n];return t}function $(o,e){return[o[0]*e[0]+o[1]*e[1]+o[2]*e[2],o[3]*e[0]+o[4]*e[1]+o[5]*e[2],o[6]*e[0]+o[7]*e[1]+o[8]*e[2]]}const St=o=>{const e=Math.cos(o),t=Math.sin(o);return[1,0,0,0,e,-t,0,t,e]},Je=o=>{const e=Math.cos(o),t=Math.sin(o);return[e,0,t,0,1,0,-t,0,e]},At=o=>{const e=Math.cos(o),t=Math.sin(o);return[e,-t,0,t,e,0,0,0,1]},De=(o,e,t)=>W(At(t),W(St(o),Je(e))),I=(o,e)=>[o[0]+e[0],o[1]+e[1],o[2]+e[2]],Qe=(o,e)=>[o[0]-e[0],o[1]-e[1],o[2]-e[2]],se=(o,e)=>[o[0]*e,o[1]*e,o[2]*e],Qt=o=>Math.hypot(o[0],o[1],o[2]),pe=o=>{const e=Qt(o)||1;return[o[0]/e,o[1]/e,o[2]/e]},je=(o,e)=>[o[1]*e[2]-o[2]*e[1],o[2]*e[0]-o[0]*e[2],o[0]*e[1]-o[1]*e[0]];class Lt{constructor(){this.pos=[0,0,5],this.target=[0,0,0],this.fov=.6,this.w=1,this.h=1,this.near=.05,this.update()}update(){const e=pe(Qe(this.target,this.pos)),t=pe(je(e,[0,1,0])),s=je(t,e);this.R=[t[0],t[1],t[2],s[0],s[1],s[2],-e[0],-e[1],-e[2]],this.focal=1/Math.tan(this.fov/2),this.pxPerUnit=this.focal*this.h/2}forward(){return[-this.R[6],-this.R[7],-this.R[8]]}toCam(e){return $(this.R,Qe(e,this.pos))}project(e){const t=this.toCam(e),s=Math.max(-t[2],this.near),n=this.pxPerUnit/s;return[this.w/2+t[0]*n,this.h/2+t[1]*n,s]}viewProj(){const e=this.R,t=this.pos,s=[-(e[0]*t[0]+e[1]*t[1]+e[2]*t[2]),-(e[3]*t[0]+e[4]*t[1]+e[5]*t[2]),-(e[6]*t[0]+e[7]*t[1]+e[8]*t[2])],n=this.w/this.h,l=this.focal,c=this.near,r=100,a=l/n,u=l,f=(r+c)/(c-r),i=2*r*c/(c-r),h=new Float32Array(16);for(let p=0;p<4;p++){const d=p<3?e[p]:s[0],x=p<3?e[3+p]:s[1],R=p<3?e[6+p]:s[2],g=p<3?0:1;h[p*4+0]=a*d,h[p*4+1]=u*x,h[p*4+2]=f*R+i*g,h[p*4+3]=-R}return h}}const K=`#version 300 es
precision highp float;
precision highp int;
precision highp sampler3D;
`,Ve=`
float sdfDecode(vec4 v) {
#ifdef SDF8
  float fine = (v.r - 0.5) * 256.0;
  return abs(fine) < 120.0 ? fine : (v.b - 0.5) * 8192.0;
#else
  return v.r;
#endif
}
`,Le=`
#ifdef SDF8
vec3 encHDR(vec3 c) { return sqrt(c / (1.0 + c)); }
vec3 decHDR(vec3 e) { vec3 e2 = e * e; return e2 / max(1.0 - e2, 1e-3); }
float encT(float t) { return sqrt(clamp(t / 512.0, 0.0, 1.0)); }
float decT(float a) { return a * a * 512.0; }
#else
vec3 encHDR(vec3 c) { return c; }
vec3 decHDR(vec3 e) { return e; }
float encT(float t) { return t; }
float decT(float a) { return a; }
#endif
`,ot=`
float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float hash13(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.zyx + 31.32);
  return fract((p3.x + p3.y) * p3.z);
}
vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}
float vnoise2(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash12(i), hash12(i + vec2(1, 0)), f.x), mix(hash12(i + vec2(0, 1)), hash12(i + vec2(1, 1)), f.x), f.y);
}
float fbm2(vec2 p) {
  float a = 0.5, s = 0.0;
  for (int i = 0; i < 4; i++) {
    s += a * vnoise2(p);
    p = p * 2.07 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return s / 0.9375;
}
// interleaved gradient noise — a cheap, well-spread per-pixel jitter
float ign(vec2 p) { return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715)))); }
`,re=`${K}
out vec2 vUv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2)) * 2.0 - 1.0;
  vUv = p * 0.5 + 0.5;
  gl_Position = vec4(p, 0.0, 1.0);
}`,eo=`${K}
uniform highp sampler2D uPrims;
uniform vec4 uGroups[12];
uniform ivec2 uRanges[12];
uniform int uGroupCount;
out vec4 o;

float cro(vec2 a, vec2 b) { return a.x * b.y - a.y * b.x; }

float sdCapsule(vec2 p, vec2 pa, vec2 pb, float ra, float rb) {
  vec2 ba = pb - pa;
  float h = dot(ba, ba);
  float b = ra - rb;
  if (h <= b * b + 1e-3) return ra > rb ? length(p - pa) - ra : length(p - pb) - rb;
  p -= pa;
  vec2 q = vec2(dot(p, vec2(ba.y, -ba.x)), dot(p, ba)) / h;
  q.x = abs(q.x);
  vec2 c = vec2(sqrt(h - b * b), b);
  float k = cro(c, q);
  float m = dot(c, q);
  float n = dot(q, q);
  if (k < 0.0) return sqrt(h * n) - ra;
  if (k > c.x) return sqrt(h * (n + 1.0 - 2.0 * q.y)) - rb;
  return m - ra;
}

float sdEllipse(vec2 p, vec2 c, vec2 cs, vec2 r) {
  p -= c;
  p = vec2(cs.x * p.x + cs.y * p.y, -cs.y * p.x + cs.x * p.y);
  float k0 = length(p / r);
  float k1 = length(p / (r * r));
  return k1 > 1e-5 ? k0 * (k0 - 1.0) / k1 : -min(r.x, r.y);
}

void main() {
  vec2 p = gl_FragCoord.xy;
  // texels: nothing reads the field further from the edge than this (the
  // widest penumbra is a few dozen), and starting here lets the group cull
  // below skip every part of the body further off than that
  float d = 64.0;
  float hair = 0.0;
  for (int g = 0; g < 12; g++) {
    if (g >= uGroupCount) break;
    vec4 G = uGroups[g];
    if (length(p - G.xy) - G.z > d + G.w) continue;
    ivec2 R = uRanges[g];
    for (int i = 0; i < 128; i++) {
      if (i >= R.y) break;
      int idx = R.x + i;
      vec4 A = texelFetch(uPrims, ivec2(idx * 2, 0), 0);
      vec4 B = texelFetch(uPrims, ivec2(idx * 2 + 1, 0), 0);
      float di = B.z == 1.0 ? sdEllipse(p, A.xy, A.zw, B.xy) : sdCapsule(p, A.xy, A.zw, B.x, B.y);
      float k = max(B.w, 1e-3);
      float h = clamp(0.5 + 0.5 * (d - di) / k, 0.0, 1.0);
      d = mix(d, di, h) - k * h * (1.0 - h);
      hair = mix(hair, B.z == 2.0 ? 1.0 : 0.0, h);
    }
  }
#ifdef SDF8
  o = vec4(clamp(d / 256.0 + 0.5, 0.0, 1.0), hair, clamp(d / 8192.0 + 0.5, 0.0, 1.0), 1.0);
#else
  o = vec4(d, hair, 0.0, 1.0);
#endif
}`,to=`${K}
${Ve}
uniform sampler2D uCookie;
out vec4 o;
const int N = 24;
void main() {
  vec2 cell = floor(gl_FragCoord.xy);
  float open = 0.0;
  vec2 c = vec2(0.0);
  for (int j = 0; j < N; j++)
    for (int i = 0; i < N; i++) {
      vec2 f = (vec2(i, j) + 0.5) / float(N);
      vec2 uv = (cell + f) / 4.0;
      float d = sdfDecode(textureLod(uCookie, uv, 0.0));
      float a = clamp(0.5 - d, 0.0, 1.0);
      open += a;
      c += f * a;
    }
  float n = float(N * N);
  o = vec4(open / n, open > 1e-4 ? c / open : vec2(0.5), 1.0);
}`,Tt=`
uniform sampler2D uCookie;
// the opening as patches of light, worked out once a frame on the CPU from
// the emitter pass (see renderer.js): xz, area; how many; the area-weighted
// centres of the sky in the ceiling and the sun on the floor; their total;
// and the radiance of the sunlit floor
uniform vec4 uPatch[16];
uniform int uPatchN;
uniform vec3 uSkyC;
uniform vec3 uPoolC;
uniform float uArea;
uniform vec3 uPoolRad;
uniform highp sampler3D uNoise;
uniform vec2 uCookieRot; // cos, sin of the opening's turn in the ceiling
uniform float uCookieM; // metres per cookie texel
uniform vec3 uSun; // toward the sun
uniform vec2 uSunXZ; // uSun.xz / uSun.y: how far the light slides per metre it falls
uniform vec3 uSunColor; // irradiance of the sun, square on
uniform vec3 uSkyColor; // radiance of the sky seen through the opening
uniform vec3 uFogColor; // tint of the air's own faint glow
uniform vec4 uBeamBox; // xz bounds of the opening (margin included)
uniform vec3 uBeamB; // two directions square to the sun, for the dust's frame
uniform vec3 uBeamC;
uniform float uTime;
uniform float uDrift;
// the tuning (see tune.js)
uniform vec3 uFog; // haze everywhere, extra haze at the floor, its height (m)
uniform vec4 uDust; // clear air between streaks, dust in them, threshold, edge
uniform vec2 uDustScale; // across the light, along it (per metre)
uniform float uPhaseG; // how strongly the haze scatters forward
uniform float uSunSpread; // half-angle of the sun, for its penumbra
uniform float uBounceGain;
uniform vec4 uFloor; // reflection, polish roughness, worn roughness, tone

const float PI = 3.14159265;
const vec2 HOLE_C = vec2(ROOM_HOLE_X, ROOM_HOLE_Z);
const float SPAN = ROOM_HOLE_SPAN;
const float TOP = ROOM_H + ROOM_SLAB;
// the opening widens a touch toward the top, as a cast skylight would
const float SPLAY = 0.12;

// the haze: thin everywhere, thicker toward the floor, and dust on top
#define FOG_BASE uFog.x
#define FOG_LOW uFog.y
#define FOG_HF uFog.z
// how wide the sun is, as a half-angle: a little more than the real one,
// for the haze it shines through
#define SUN_SPREAD uSunSpread

vec2 rot(vec2 v, vec2 cs) { return vec2(cs.x * v.x - cs.y * v.y, cs.y * v.x + cs.x * v.y); }

vec2 cookieUV(vec2 xz) {
  vec2 r = xz - HOLE_C;
  r = vec2(uCookieRot.x * r.x + uCookieRot.y * r.y, -uCookieRot.y * r.x + uCookieRot.x * r.y);
  return r / SPAN + 0.5;
}

// signed distance (m) from a point on the ceiling to the opening's edge,
// negative inside it
float holeSdf(vec2 xz) {
  vec2 uv = cookieUV(xz);
  float d = sdfDecode(textureLod(uCookie, clamp(uv, 0.0, 1.0), 0.0)) * uCookieM;
  float outside = length(max(abs(uv - 0.5) - 0.5, 0.0)) * SPAN;
  // past the square's edge, a true lower bound (the shaft march skips by it)
  return outside > 0.0 ? length(vec2(max(d, 0.0), outside)) : d;
}

// how much of the sun reaches p, through the opening
float sunVis(vec3 p) {
  float h = max(ROOM_H - p.y, 0.0);
  vec2 q = p.xz + uSunXZ * h;
  if (q.x < uBeamBox.x || q.y < uBeamBox.y || q.x > uBeamBox.z || q.y > uBeamBox.w) return 0.0;
  float d = holeSdf(q);
  float pen = 0.02 + h * SUN_SPREAD / uSun.y;
  return 1.0 - smoothstep(-pen, pen, d);
}

float fogDensity(vec3 p) { return FOG_BASE + FOG_LOW * exp(-max(p.y, 0.0) / FOG_HF); }

// optical depth from o along unit d for distance t, in closed form
float opticalDepth(vec3 o, vec3 d, float t) {
  float k = d.y / FOG_HF;
  float e0 = exp(-max(o.y, 0.0) / FOG_HF);
  float low = abs(k) < 1e-4 ? e0 * t : e0 * (1.0 - exp(-k * t)) / k;
  return FOG_BASE * t + FOG_LOW * low;
}

// what the sun has lost on its way down from the opening to p
float sunPath(vec3 p) {
  float h = max(ROOM_H - p.y, 0.0);
  return exp(-opticalDepth(p, uSun, h / uSun.y));
}

// dust: the motes too small to see one by one, in slow streaks that run
// along the light and sink down it as the figure falls. The noise is read in a
// frame turned to the sun and stretched along it, so it lies in the shafts the
// way the shafts lie in the hall.
float dust(vec3 p) {
  vec3 q = vec3(dot(p, uBeamB) * uDustScale.x + uTime * 0.0013, dot(p, uBeamC) * uDustScale.x, dot(p, uSun) * uDustScale.y + uDrift);
  float n = textureLod(uNoise, q, 0.0).r * 0.6 + textureLod(uNoise, q * 3.0 + vec3(0.37, uTime * 0.002, 0.11), 0.0).g * 0.4;
  return uDust.x + uDust.y * smoothstep(uDust.z, max(uDust.w, uDust.z + 0.01), n);
}

float hg(float c, float g) {
  float g2 = g * g;
  return (1.0 - g2) / (4.0 * PI * pow(max(1.0 + g2 - 2.0 * g * c, 1e-4), 1.5));
}
// forward-scattering haze, with a little back-scatter so the shafts still
// read when the sun is behind the eye
float phase(float c) { return mix(hg(c, uPhaseG), hg(c, -0.25), 0.22); }

// ---- the opening as light --------------------------------------------------
// The emitters: sixteen patches of the opening. Each is a patch of sky in the
// ceiling shining down, and the same patch of sun thrown onto the floor
// shining up — the floor's bounce is most of what lights this hall.

struct Patch { vec3 sky; vec3 pool; float area; };

Patch emitter(int i) {
  vec4 e = uPatch[i];
  Patch P;
  P.sky = vec3(e.x, ROOM_H, e.y);
  P.pool = vec3(e.x - uSunXZ.x * ROOM_H, 0.0, e.y - uSunXZ.y * ROOM_H);
  P.area = e.z;
  return P;
}

// irradiance at p (normal n) from a small lambertian patch of unit radiance
// at e facing ne, area A; softened so it never blows up close to
float patchE(vec3 p, vec3 n, vec3 e, vec3 ne, float A) {
  vec3 v = e - p;
  float r2 = dot(v, v);
  vec3 w = v * inversesqrt(max(r2, 1e-6));
  return A * max(dot(n, w), 0.0) * max(-dot(ne, w), 0.0) / (r2 + A * 0.5);
}

// the radiance of the sunlit floor, as an emitter
vec3 poolRadiance() { return uPoolRad; }

// The shaft itself is a light: what the haze scatters out of it sideways
// glows on everything near. Four points down its axis, from the opening to the
// pool, each carrying a share of what the haze takes out of the sun.
const float BEAM_SCATTER = 0.08; // the share of the light let in that the haze throws sideways
vec3 beamPoint(int k, vec3 skyC, vec3 poolC) { return mix(skyC, poolC, (float(k) + 0.5) / 4.0); }
vec3 beamIntensity(float area) { return uSunColor * (uSun.y * area * BEAM_SCATTER / (4.0 * PI * 4.0)); }

// The eye adapts in a dark hall, and the light that bounces round and round
// it is more than one bounce can say: this lifts it so the concrete reads.
#define BOUNCE_GAIN uBounceGain

// all the light that comes back off the floor and down from the sky
vec3 bounce(vec3 p, vec3 n, vec3 skyC, vec3 poolC, float area) {
  float sky = 0.0, pool = 0.0;
  for (int i = 0; i < 16; i++) {
    if (i >= uPatchN) break;
    Patch P = emitter(i);
    sky += patchE(p, n, P.sky, vec3(0, -1, 0), P.area);
    pool += patchE(p, n, P.pool, vec3(0, 1, 0), P.area);
  }
  float beam = 0.0;
  for (int k = 0; k < 4; k++) {
    vec3 v = beamPoint(k, skyC, poolC) - p;
    float r2 = dot(v, v);
    beam += max(dot(n, v), 0.0) * inversesqrt(r2) / (r2 + 16.0);
  }
  vec3 pr = poolRadiance();
  // and the faint second bounce off everything else, without direction
  return uSkyColor * sky + BOUNCE_GAIN * (pr * pool + beamIntensity(area) * beam + (uSkyColor * 0.002 + pr * 0.008) * (0.75 - 0.25 * n.y));
}

// ---- the hall's surfaces ---------------------------------------------------
// materials: 0 floor, 1 ceiling, 2 wall, 3 pier, 4 opening (sky or reveal)
struct Hit { float t; vec3 n; int mat; };

void slab(float o, float d, float lo, float hi, inout float t0, inout float t1) {
  if (abs(d) < 1e-7) {
    if (o < lo || o > hi) t0 = 1e9;
    return;
  }
  float a = (lo - o) / d, b = (hi - o) / d;
  t0 = max(t0, min(a, b));
  t1 = min(t1, max(a, b));
}

Hit traceHall(vec3 o, vec3 d) {
  Hit h;
  // the inside of the box
  vec3 hi = vec3(ROOM_HALF_W, ROOM_H, ROOM_Z1), lo = vec3(-ROOM_HALF_W, 0.0, ROOM_Z0);
  vec3 inv = 1.0 / vec3(abs(d.x) < 1e-7 ? 1e-7 : d.x, abs(d.y) < 1e-7 ? 1e-7 : d.y, abs(d.z) < 1e-7 ? 1e-7 : d.z);
  vec3 tExit = max((lo - o) * inv, (hi - o) * inv);
  h.t = min(tExit.x, min(tExit.y, tExit.z));
  if (h.t == tExit.y) {
    h.mat = d.y < 0.0 ? 0 : 1;
    h.n = vec3(0.0, d.y < 0.0 ? 1.0 : -1.0, 0.0);
  } else if (h.t == tExit.x) {
    h.mat = 2;
    h.n = vec3(-sign(d.x), 0.0, 0.0);
  } else {
    h.mat = 2;
    h.n = vec3(0.0, 0.0, -sign(d.z));
  }
  // the piers: for each row, the stretch of ray inside its slab of x, then
  // the piers along that stretch, nearest first
  for (int row = 0; row < 2; row++) {
    float px = row == 0 ? -ROOM_PIER_X : ROOM_PIER_X;
    float a = 0.0, b = h.t;
    slab(o.x, d.x, px - ROOM_PIER_HALF, px + ROOM_PIER_HALF, a, b);
    if (a >= b) continue;
    float za = o.z + d.z * a, zb = o.z + d.z * b;
    float k0 = floor((min(za, zb) - ROOM_PIER_Z0 + ROOM_PIER_HALF) / ROOM_PIER_DZ);
    float k1 = floor((max(za, zb) - ROOM_PIER_Z0 + ROOM_PIER_HALF) / ROOM_PIER_DZ);
    k0 = max(k0, 0.0);
    k1 = min(k1, float(ROOM_PIER_N - 1));
    float dir = d.z >= 0.0 ? 1.0 : -1.0;
    float kStart = dir > 0.0 ? k0 : k1;
    for (int i = 0; i < 12; i++) {
      float k = kStart + dir * float(i);
      if (k < k0 || k > k1) break;
      float pz = ROOM_PIER_Z0 + k * ROOM_PIER_DZ;
      float ta = 0.0, tb = h.t, xa = 0.0, xb = h.t;
      slab(o.x, d.x, px - ROOM_PIER_HALF, px + ROOM_PIER_HALF, xa, xb);
      slab(o.z, d.z, pz - ROOM_PIER_HALF, pz + ROOM_PIER_HALF, ta, tb);
      float tin = max(xa, ta), tout = min(xb, tb);
      if (tin < tout && tin > 1e-3 && tin < h.t) {
        h.t = tin;
        h.mat = 3;
        h.n = xa > ta ? vec3(-sign(d.x), 0.0, 0.0) : vec3(0.0, 0.0, -sign(d.z));
        break;
      }
    }
  }
  return h;
}

// ---- concrete ----------------------------------------------------------------
// Smooth cast concrete in the walls, piers and ceiling (see concrete() below).
// The floor is ground and polished, with saw-cut joints every six metres and
// the aggregate showing through.

// distance to the nearest grid line, in metres, over a cell of size s
vec2 gridDist(vec2 p, vec2 s) {
  vec2 f = abs(fract(p / s + 0.5) - 0.5) * s;
  return f;
}

// an anti-aliased line: 1 on the line of half-width w, given the footprint fp
// (wider than a pixel it is drawn as-is; narrower, it fades rather than shimmers)
float line(float dist, float w, float fp) {
  float W = max(w, fp);
  return (w / W) * (1.0 - smoothstep(W * 0.5, W * 1.5, dist));
}

struct Surf { vec3 albedo; float rough; vec3 n; float ao; };

// coordinates on a vertical face: along it, and up
vec2 faceUV(vec3 p, vec3 n) { return abs(n.x) > 0.5 ? vec2(p.z, p.y) : vec2(p.x, p.y); }

Surf concrete(vec3 p, vec3 n, int mat, float fp) {
  Surf s;
  s.n = n;
  s.ao = 1.0;
  if (mat == 0) {
    // the floor
    vec2 q = p.xz;
    float mott = fbm2(q * 0.07) * 0.6 + fbm2(q * 0.45 + 7.0) * 0.4;
    float speck = hash12(floor(q * 90.0));
    float agg = smoothstep(0.82, 0.95, speck) * (1.0 - smoothstep(0.004, 0.02, fp));
    // dark, so what it mirrors can show in it
    vec3 base = vec3(1.0, 0.971, 0.929) * uFloor.w * mix(0.72, 1.18, mott);
    base = mix(base, vec3(0.34, 0.33, 0.31), agg * 0.5);
    vec2 g = gridDist(q, vec2(6.0));
    float joint = max(line(g.x, 0.012, fp), line(g.y, 0.012, fp));
    s.albedo = base * (1.0 - 0.8 * joint);
    // the polish: glassy, worn duller in broad swirls, never perfect
    float wear = fbm2(q * 0.11 + 3.0);
    s.rough = mix(uFloor.y, uFloor.z, smoothstep(0.35, 0.85, wear)) + joint * 0.3;
    // ambient occlusion where the floor meets the walls and the piers
    float dw = min(ROOM_HALF_W - abs(p.x), min(p.z - ROOM_Z0, ROOM_Z1 - p.z));
    float zc = ROOM_PIER_Z0 + clamp(floor((p.z - ROOM_PIER_Z0) / ROOM_PIER_DZ + 0.5), 0.0, float(ROOM_PIER_N - 1)) * ROOM_PIER_DZ;
    vec2 pd = abs(vec2(abs(p.x) - ROOM_PIER_X, p.z - zc)) - ROOM_PIER_HALF;
    float dp = length(max(pd, 0.0)) + min(max(pd.x, pd.y), 0.0);
    s.ao = (1.0 - 0.55 * exp(-dw / 1.6)) * (1.0 - 0.5 * exp(-dp / 1.2));
    return s;
  }
  // Walls, piers and ceiling: concrete the way Tadao Ando casts it, against
  // varnished formwork, into one smooth and nearly even grey with only the
  // softest cloudiness of the pour. The ceiling is left at that: it is meant
  // to be lost in the dark.
  vec2 uv = mat == 1 ? p.xz : faceUV(p, n);
  float cloud = fbm2(uv * 0.16 + float(mat) * 5.0);
  vec3 base = vec3(0.34, 0.335, 0.325) * mix(0.93, 1.05, cloud);
  s.rough = 0.85;
  if (mat == 1) {
    s.albedo = base;
    s.ao = 1.0 - 0.35 * exp(-min(ROOM_HALF_W - abs(p.x), min(p.z - ROOM_Z0, ROOM_Z1 - p.z)) / 2.0);
    return s;
  }
  // The walls and piers keep the marks of the formwork and nothing else:
  // panels of 1.8 m by 0.9 m, the tatami module, each a hair different from its
  // neighbours, with hairline joints between them and the tie holes they leave.
  // A pier's face is measured from its own middle, so its two panels sit
  // square on it, a joint down the centre line.
  if (mat == 3) {
    float zc = ROOM_PIER_Z0 + clamp(floor((p.z - ROOM_PIER_Z0) / ROOM_PIER_DZ + 0.5), 0.0, float(ROOM_PIER_N - 1)) * ROOM_PIER_DZ;
    uv.x = abs(n.x) > 0.5 ? p.z - zc : p.x - sign(p.x) * ROOM_PIER_X;
  }
  vec2 cell = vec2(1.8, 0.9);
  vec2 id = floor(uv / cell);
  vec2 f = uv - (id + 0.5) * cell;
  base *= 0.985 + 0.03 * hash12(id + float(mat) * 17.0);
  vec2 g = cell * 0.5 - abs(f);
  float joint = max(line(g.x, 0.0015, fp), line(g.y, 0.0015, fp));
  // tie holes: on the walls three across and two up in each panel, at its
  // sixths and quarters; on a pier one in the middle of each panel, so two
  // across the face
  vec2 tc = mat == 3 ? cell : vec2(cell.x / 3.0, cell.y * 0.5);
  vec2 tq = mod(uv, tc) - tc * 0.5;
  float r = 0.016, W = max(r, fp);
  float hole = (r / W) * (r / W) * (1.0 - smoothstep(W * 0.6, W * 1.4, length(tq)));
  s.albedo = base * (1.0 - 0.12 * joint) * (1.0 - 0.6 * hole);
  s.ao = 1.0 - 0.5 * hole;
  // darker toward the floor where they meet it, and at the ceiling
  s.ao *= (1.0 - 0.45 * exp(-p.y / 1.4)) * (1.0 - 0.3 * exp(-(ROOM_H - p.y) / 1.5));
  return s;
}

// ---- the sky beyond the opening --------------------------------------------
vec3 sky(vec3 d, bool disc) {
  float mu = dot(d, uSun);
  vec3 c = uSkyColor * (0.75 + 0.45 * d.y);
  c += uSunColor * (0.05 * pow(max(mu, 0.0), 6.0) + 0.25 * pow(max(mu, 0.0), 80.0));
  if (disc) c += uSunColor * 1500.0 * smoothstep(0.99996, 0.99999, mu);
  return c;
}

// What a ray that has reached the ceiling inside the opening sees: up
// through the thickness of the slab, either the cast reveal of the opening
// (lit by the sun where it faces it) or the sky.
vec3 opening(vec3 p, vec3 d, bool disc) {
  float t = 0.0;
  float hz = max(length(d.xz), 1e-3);
  for (int i = 0; i < 20; i++) {
    vec3 q = p + d * t;
    if (q.y >= TOP) return sky(d, disc);
    float f = holeSdf(q.xz) - SPLAY * (q.y - ROOM_H);
    if (f > -0.004) {
      // the reveal: its normal faces into the opening and a little up
      vec2 e = vec2(0.05, 0.0);
      vec2 gr = vec2(holeSdf(q.xz + e.xy) - holeSdf(q.xz - e.xy), holeSdf(q.xz + e.yx) - holeSdf(q.xz - e.yx));
      vec3 n = normalize(vec3(-gr.x, SPLAY * 2.0 * e.x, -gr.y));
      float lit = max(dot(n, uSun), 0.0);
      // does the sun reach it over the top edge of the slab?
      vec2 top = q.xz + uSunXZ * (TOP - q.y);
      lit *= 1.0 - smoothstep(-0.05, 0.05, holeSdf(top) - SPLAY * ROOM_SLAB);
      vec3 alb = vec3(0.4, 0.39, 0.37);
      return alb / PI * (uSunColor * lit + uSkyColor * PI * 0.55 * (0.5 + 0.5 * n.y));
    }
    t += max(-f * 0.85 / (hz + SPLAY * max(d.y, 0.0)), 0.004);
  }
  return sky(d, disc);
}

// ---- light in the air ------------------------------------------------------
// The shafts: march only the stretch of ray inside the slanted prism the
// opening's bounds sweep down to the floor (in sheared coordinates the prism
// is an upright box).
vec3 shafts(vec3 o, vec3 d, float tEnd, int steps, float jit) {
  vec2 so = o.xz + uSunXZ * (ROOM_H - o.y);
  vec2 sd = d.xz - uSunXZ * d.y;
  float t0 = 0.0, t1 = tEnd;
  slab(so.x, sd.x, uBeamBox.x, uBeamBox.z, t0, t1);
  slab(so.y, sd.y, uBeamBox.y, uBeamBox.w, t0, t1);
  slab(o.y, d.y, 0.0, ROOM_H, t0, t1);
  if (t1 <= t0) return vec3(0.0);
  float dt = (t1 - t0) / float(steps);
  // transmittance back to the eye, from the closed form at each end and
  // interpolated between (it changes slowly)
  float tau0 = opticalDepth(o, d, t0), tau1 = opticalDepth(o, d, t1);
  // Most of the prism is dark. The spot on the ceiling a sample looks up
  // through moves stepM per step, and the cookie is a distance field, so a
  // sample that far outside the edge rules out every later one that can't
  // have closed the gap: skip them, and the lit samples are the same.
  float stepM = max(length(sd) * dt, 1e-4);
  float penMax = 0.02 + ROOM_H * SUN_SPREAD / uSun.y;
  float acc = 0.0;
  int i = 0;
  for (int it = 0; it < 128; it++) {
    if (i >= steps) break;
    float f = (float(i) + jit) / float(steps);
    float t = mix(t0, t1, f);
    vec3 p = o + d * t;
    float dd = holeSdf(so + sd * t); // where p looks up through the ceiling
    float pen = 0.02 + (ROOM_H - p.y) * SUN_SPREAD / uSun.y;
    if (dd >= pen) {
      i += clamp(int((dd - penMax) * 0.9 / stepM), 1, steps);
      continue;
    }
    float v = 1.0 - smoothstep(-pen, pen, dd);
    acc += v * fogDensity(p) * dust(p) * sunPath(p) * exp(-mix(tau0, tau1, f));
    i++;
  }
  return uSunColor * (acc * dt * phase(dot(d, uSun)));
}

// The air's own glow: haze lit faintly by the floor's bounce and the sky in
// the opening, from the totals of both. A few coarse steps; it has no edges.
vec3 airGlow(vec3 o, vec3 d, float tEnd, float jit, vec3 skyC, vec3 poolC, float area) {
  const int N = 7;
  float tMax = min(tEnd, 260.0);
  vec3 acc = vec3(0.0);
  vec3 pool = poolRadiance();
  for (int i = 0; i < N; i++) {
    float f = (float(i) + jit) / float(N);
    float t = tMax * f * f; // denser near the eye
    float dt = tMax * (2.0 * f + 1.0 / float(N)) / float(N);
    vec3 p = o + d * t;
    // the sky patch faces down at us, the sunlit pool faces up
    vec3 vs = skyC - p, vp = poolC - p;
    float rs = dot(vs, vs), rp = dot(vp, vp);
    float es = area * max(vs.y, 0.0) * inversesqrt(rs) / (rs + area);
    float ep = area * max(-vp.y, 0.0) * inversesqrt(rp) / (rp + area);
    float eb = 0.0;
    for (int k = 0; k < 4; k++) {
      vec3 v = beamPoint(k, skyC, poolC) - p;
      eb += 1.0 / (dot(v, v) + 16.0);
    }
    vec3 L = uSkyColor * es + BOUNCE_GAIN * (pool * ep + beamIntensity(area) * eb) + uFogColor;
    acc += L * fogDensity(p) * exp(-opticalDepth(o, d, t)) * dt;
  }
  return acc / (4.0 * PI);
}

// ---- shading a hit ---------------------------------------------------------
float ggxD(float nh, float a) {
  float a2 = a * a;
  float k = nh * nh * (a2 - 1.0) + 1.0;
  return a2 / (PI * k * k);
}
float smithV(float nv, float nl, float a) {
  float k = a * 0.5;
  return 0.25 / ((nv * (1.0 - k) + k) * (nl * (1.0 - k) + k));
}
float schlick(float c) {
  float f = 1.0 - clamp(c, 0.0, 1.0);
  float f2 = f * f;
  return 0.04 + 0.96 * f2 * f2 * f;
}

// a microfacet normal, importance-sampled from the GGX lobe
vec3 ggxSample(vec3 n, float a, vec2 xi) {
  float phi = 2.0 * PI * xi.x;
  float ct = sqrt((1.0 - xi.y) / (1.0 + (a * a - 1.0) * xi.y));
  float st = sqrt(max(1.0 - ct * ct, 0.0));
  vec3 t = abs(n.y) < 0.99 ? normalize(cross(n, vec3(0, 1, 0))) : vec3(1, 0, 0);
  vec3 b = cross(n, t);
  return normalize(t * st * cos(phi) + b * st * sin(phi) + n * ct);
}

// the diffuse and the sun's specular at a surface; v points back at the eye
// (the floor's own highlight goes out in spec, apart from the diffuse, so
// the polish can take its share of the diffuse alone)
vec3 lightSurface(vec3 p, Surf s, vec3 v, int mat, vec3 skyC, vec3 poolC, float area, out vec3 spec) {
  vec3 n = s.n;
  float sun = sunVis(p + n * 0.02) * max(dot(n, uSun), 0.0);
  vec3 col = vec3(0.0);
  spec = vec3(0.0);
  if (sun > 0.0) {
    vec3 E = uSunColor * sun * sunPath(p);
    col += s.albedo / PI * E;
    if (mat == 0) {
      // the polished floor's highlight, from the sun itself
      float a = max(s.rough * s.rough, 0.002);
      vec3 hv = normalize(uSun + v);
      float nl = max(dot(n, uSun), 1e-3), nv = max(dot(n, v), 1e-3);
      spec = E * ggxD(max(dot(n, hv), 0.0), a) * smithV(nv, nl, a) * schlick(max(dot(v, hv), 0.0));
    }
  }
  col += s.albedo / PI * bounce(p, n, skyC, poolC, area) * s.ao;
  return col;
}
`,oo=`${K}
${Ve}
${Le}
${ot}
${Tt}
uniform vec2 uRes;
uniform vec2 uJitter;
uniform vec3 uCamPos;
uniform vec3 uRight;
uniform vec3 uUp;
uniform vec3 uFwd;
uniform float uFocal;
uniform float uAspect;
uniform int uFrame;
uniform int uSteps;
uniform int uReflSteps;
in vec2 vUv;
out vec4 o;

// everything a ray sees along its way and where it lands, bar reflections
vec3 look(vec3 ro, vec3 rd, Hit h, int steps, float jit, float fp, bool primary, vec3 skyC, vec3 poolC, float area, out Surf s, out vec3 p, out vec3 surf) {
  p = ro + rd * h.t;
  vec3 col;
  s.rough = 1.0;
  s.n = h.n;
  if (h.mat == 1) {
    // the ceiling — or, inside the opening, whatever is up through it
    float d = holeSdf(p.xz);
    // (the field stops 64 texels out, about 2.6 m: a footprint wider than 5 m
    // would read that as near the edge)
    float cov = clamp(0.5 - d / clamp(fp, 1e-3, 5.0), 0.0, 1.0);
    vec3 up = cov > 0.0 ? opening(p, rd, primary) : vec3(0.0);
    s = concrete(p, h.n, 1, fp);
    vec3 spec;
    vec3 cl = cov < 1.0 ? lightSurface(p, s, -rd, 1, skyC, poolC, area, spec) : vec3(0.0);
    col = mix(cl, up, cov);
    surf = col;
    s.rough = 1.0;
  } else {
    s = concrete(p, h.n, h.mat, fp);
    vec3 spec;
    col = lightSurface(p, s, -rd, h.mat, skyC, poolC, area, spec);
    surf = col;
    col += spec;
  }
  float T = exp(-opticalDepth(ro, rd, h.t));
  col *= T;
  surf *= T;
  col += shafts(ro, rd, h.t, steps, jit);
  col += airGlow(ro, rd, h.t, fract(jit + 0.37), skyC, poolC, area);
  return col;
}

void main() {
  vec2 frag = gl_FragCoord.xy + uJitter;
  vec2 ndc = frag / uRes * 2.0 - 1.0;
  vec3 rd = normalize(uFwd * uFocal + uRight * ndc.x * uAspect + uUp * ndc.y);
  vec3 ro = uCamPos;
  float jit = fract(ign(gl_FragCoord.xy) + float(uFrame % 64) * 0.618034);

  // the opening's totals, for the air's glow
  vec3 skyC = uSkyC, poolC = uPoolC;
  float area = uArea;

  Hit h = traceHall(ro, rd);
  float pixAngle = 2.0 / (uRes.y * uFocal);
  float fp = h.t * pixAngle / max(abs(dot(rd, h.n)), 0.08);
  Surf s;
  vec3 p, surf;
  vec3 col = look(ro, rd, h, uSteps, jit, fp * 0.7, true, skyC, poolC, area, s, p, surf);
  // what the resolve reprojects by: where the eye sees this pixel's light come from
  float tOut = h.t;

  if (h.mat == 0) {
    // the polished floor: a second ray, scattered by how worn the polish is
    vec3 v = -rd;
    // a low-discrepancy walk over the lobe, offset per pixel, so the frames
    // the resolve blends cover it evenly; and none of the long tail, whose
    // rare rays into the bright opening would only be glitter
    vec2 xi = fract(float(uFrame % 64) * vec2(0.7548777, 0.5698403) + hash22(gl_FragCoord.xy));
    xi.y *= 0.8;
    float a = max(s.rough * s.rough, 0.0015);
    vec3 m = ggxSample(s.n, a, xi);
    vec3 r = reflect(rd, m);
    if (r.y <= 0.002) r = reflect(rd, s.n);
    Hit h2 = traceHall(p + s.n * 0.01, r);
    Surf s2;
    vec3 p2, surf2;
    float fp2 = (h.t + h2.t) * pixAngle / max(abs(dot(r, h2.n)), 0.08) + h2.t * a;
    vec3 refl = look(p + s.n * 0.01, r, h2, uReflSteps, fract(jit + 0.5), fp2, false, skyC, poolC, area, s2, p2, surf2);
    float F = schlick(max(dot(v, m), 0.0)) * uFloor.x;
    vec3 mirrored = refl * F * exp(-opticalDepth(ro, rd, h.t));
    // the polish takes its share from the floor's own colour
    col += mirrored - F * surf;
    // a mirror image moves on screen as if it were as far away as the thing
    // it mirrors; reproject by that, as much as the image is what shows
    float lm = dot(mirrored, vec3(0.2126, 0.7152, 0.0722)), lc = dot(col, vec3(0.2126, 0.7152, 0.0722));
    tOut = mix(h.t, h.t + h2.t, clamp(lm / max(lc, 1e-5), 0.0, 1.0));
  }
  o = vec4(encHDR(max(col, 0.0)), encT(tOut));
}`,so=`${K}
${Le}
uniform sampler2D uCur;
uniform sampler2D uHist;
uniform vec2 uRes;
uniform vec3 uCamPos;
uniform vec3 uRight;
uniform vec3 uUp;
uniform vec3 uFwd;
uniform float uFocal;
uniform float uAspect;
uniform mat4 uPrevViewProj;
uniform float uBlend; // weight of the new frame
uniform float uValid; // 0 when there is no history worth keeping
in vec2 vUv;
out vec4 o;

vec3 toYCoCg(vec3 c) { return vec3(0.25 * c.r + 0.5 * c.g + 0.25 * c.b, 0.5 * c.r - 0.5 * c.b, -0.25 * c.r + 0.5 * c.g - 0.25 * c.b); }
vec3 fromYCoCg(vec3 c) { return vec3(c.x + c.y - c.z, c.x + c.z, c.x - c.y - c.z); }
// compress the range so a single blazing texel doesn't run the neighbourhood
vec3 squash(vec3 c) { return c / (1.0 + max(c.r, max(c.g, c.b))); }
vec3 unsquash(vec3 c) { return c / max(1.0 - max(c.r, max(c.g, c.b)), 1e-4); }
// a NaN or an infinity from one bad sample reads as black, not as poison
vec3 safe(vec3 c) { return c.r + c.g + c.b < 1e30 ? max(c, 0.0) : vec3(0.0); }

void main() {
  ivec2 ip = ivec2(gl_FragCoord.xy);
  vec4 cur = texelFetch(uCur, ip, 0);
  cur = vec4(safe(decHDR(cur.rgb)), decT(cur.a));
  vec3 m1 = vec3(0.0), m2 = vec3(0.0);
  vec3 c0 = toYCoCg(squash(cur.rgb));
  for (int j = -1; j <= 1; j++)
    for (int i = -1; i <= 1; i++) {
      vec3 c = toYCoCg(squash(safe(decHDR(texelFetch(uCur, clamp(ip + ivec2(i, j), ivec2(0), ivec2(uRes) - 1), 0).rgb))));
      m1 += c;
      m2 += c * c;
    }
  m1 /= 9.0;
  vec3 sigma = sqrt(max(m2 / 9.0 - m1 * m1, 0.0));
  vec3 lo = m1 - sigma * 1.6, hi = m1 + sigma * 1.6;

  vec2 ndc = vUv * 2.0 - 1.0;
  vec3 rd = normalize(uFwd * uFocal + uRight * ndc.x * uAspect + uUp * ndc.y);
  vec3 wp = uCamPos + rd * cur.a;
  vec4 clip = uPrevViewProj * vec4(wp, 1.0);
  vec2 puv = clip.xy / clip.w * 0.5 + 0.5;
  bool inside = clip.w > 0.0 && all(greaterThanEqual(puv, vec2(0.0))) && all(lessThanEqual(puv, vec2(1.0)));

  vec3 res = c0;
  if (uValid > 0.5 && inside) {
    vec3 hist = toYCoCg(squash(decHDR(textureLod(uHist, puv, 0.0).rgb)));
    hist = clamp(hist, lo, hi);
    // a texel that moved a long way on screen trusts its history less
    vec2 motion = (puv - vUv) * uRes;
    float w = clamp(uBlend + length(motion) * 0.02, uBlend, 0.6);
    res = mix(hist, c0, w);
  }
  vec3 outc = safe(unsquash(fromYCoCg(res)));
  o = vec4(encHDR(outc), encT(cur.a));
}`,no=`${K}
${Ve}
${Le}
${ot}
${Tt}
layout(location = 0) in vec2 aCorner;
layout(location = 1) in vec4 aA; // position in the prism (0..1)^3, seed
layout(location = 2) in vec4 aB; // fall speed, size (m), brightness, spare
uniform mat4 uViewProj;
uniform vec2 uRes;
uniform float uFall;
uniform float uShutter;
uniform vec3 uCamPos;
uniform float uPxPerUnit;
uniform float uFocus;
uniform sampler2D uScene;
uniform float uMoteGlow;
out vec2 vLocal;
out float vHalfLen;
out float vRad;
out vec3 vColor;

const float TAU = 6.2831853;

vec3 placeAt(float fall) {
  float s = aA.w;
  // height wraps through the hall; xz is a fixed spot in the opening's square,
  // slid along the sun by height so it stays inside the prism
  float y = mod(aA.y * ROOM_H - fall * aB.x, ROOM_H);
  vec2 local = (aA.xz - 0.5) * SPAN;
  local += 0.35 * vec2(sin(fall * (0.9 + s) + s * 40.0), cos(fall * (0.7 + s) + s * 17.0));
  vec2 xz = HOLE_C + rot(local, uCookieRot) - uSunXZ * (ROOM_H - y);
  return vec3(xz.x, y, xz.y);
}

void main() {
  vec3 cur = placeAt(uFall);
  vec3 prev = cur + vec3(0.0, uShutter * aB.x, 0.0);
  float vis = sunVis(cur);
  vec4 c0 = uViewProj * vec4(cur, 1.0);
  vec4 c1 = uViewProj * vec4(prev, 1.0);
  if (vis < 0.02 || c0.w < 0.3 || c1.w < 0.3) {
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    return;
  }
  vec2 s0 = (c0.xy / c0.w * 0.5 + 0.5) * uRes;
  vec2 s1 = (c1.xy / c1.w * 0.5 + 0.5) * uRes;
  float depth = c0.w;
  // behind a pier, or past the wall the eye is looking at
  float sceneT = decT(texture(uScene, clamp(s0 / uRes, 0.0, 1.0)).a);
  if (distance(cur, uCamPos) > sceneT + 0.5) {
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    return;
  }
  float core = aB.y * uPxPerUnit / depth;
  float coc = 0.012 * uPxPerUnit * abs(depth - uFocus) / (depth * uFocus);
  float rad = clamp(sqrt(core * core + coc * coc), 0.6, uRes.y * 0.02);
  vec2 ax = s0 - s1;
  float len = length(ax);
  vec2 u = len > 1e-3 ? ax / len : vec2(0.0, 1.0);
  vec2 v = vec2(-u.y, u.x);
  float halfLen = len * 0.5 + rad + 1.0;
  float halfWid = rad + 1.0;
  vec2 mid = (s0 + s1) * 0.5;
  vec2 pos = mid + u * aCorner.x * halfLen + v * aCorner.y * halfWid;
  vLocal = vec2(aCorner.x * halfLen, aCorner.y * halfWid);
  vHalfLen = len * 0.5;
  vRad = rad;
  vec3 dir = normalize(cur - uCamPos);
  // a mote scatters the sun forward, the way the haze does but more so
  float ph = phase(dot(dir, uSun)) * 4.0 + 0.05;
  float energy = max(core, 0.25) * max(core, 0.25) / (rad * rad);
  float wrap = smoothstep(0.0, 1.5, cur.y) * (1.0 - smoothstep(ROOM_H - 2.0, ROOM_H, cur.y));
  vColor = uSunColor * sunPath(cur) * vis * wrap * ph * aB.z * energy * exp(-opticalDepth(uCamPos, dir, depth)) * 0.0065 * uMoteGlow;
  gl_Position = vec4(pos / uRes * 2.0 - 1.0, 0.0, 1.0);
}`,ao=`${K}
in vec2 vLocal;
in float vHalfLen;
in float vRad;
in vec3 vColor;
out vec4 o;
void main() {
  float dx = max(abs(vLocal.x) - vHalfLen, 0.0);
  float dist = length(vec2(dx, vLocal.y));
  float a = exp(-dist * dist / max(vRad * vRad * 0.5, 0.2));
  o = vec4(vColor * a, 1.0);
}`,io=`${K}
${Le}
uniform sampler2D uSrc;
uniform vec2 uTexel;
uniform int uFirst; // reading the frame itself, which may be encoded
in vec2 vUv;
out vec4 o;
vec3 at(vec2 uv) {
  vec3 c = texture(uSrc, uv).rgb;
  return uFirst == 1 ? decHDR(c) : c;
}
void main() {
  vec2 h = uTexel * 0.5;
  vec3 c = at(vUv) * 4.0;
  c += at(vUv - h);
  c += at(vUv + h);
  c += at(vUv + vec2(h.x, -h.y));
  c += at(vUv - vec2(h.x, -h.y));
  o = vec4(c / 8.0, 1.0);
}`,ro=`${K}
uniform sampler2D uSrc;
uniform vec2 uTexel;
in vec2 vUv;
out vec4 o;
void main() {
  vec2 h = uTexel * 0.5;
  vec3 c = texture(uSrc, vUv + vec2(-h.x * 2.0, 0.0)).rgb;
  c += texture(uSrc, vUv + vec2(-h.x, h.y)).rgb * 2.0;
  c += texture(uSrc, vUv + vec2(0.0, h.y * 2.0)).rgb;
  c += texture(uSrc, vUv + vec2(h.x, h.y)).rgb * 2.0;
  c += texture(uSrc, vUv + vec2(h.x * 2.0, 0.0)).rgb;
  c += texture(uSrc, vUv + vec2(h.x, -h.y)).rgb * 2.0;
  c += texture(uSrc, vUv + vec2(0.0, -h.y * 2.0)).rgb;
  c += texture(uSrc, vUv + vec2(-h.x, -h.y)).rgb * 2.0;
  o = vec4(c / 12.0, 1.0);
}`,co=`${K}
uniform sampler2D uSrc;
uniform sampler2D uPrev;
uniform float uDt; // seconds since the last frame; negative to start afresh
out vec4 o;
void main() {
  float acc = 0.0, wsum = 0.0;
  for (int j = 0; j < 5; j++)
    for (int i = 0; i < 5; i++) {
      vec2 uv = (vec2(i, j) + 0.5) / 5.0;
      float w = 1.0 - 0.6 * length(uv - 0.5);
      vec3 c = textureLod(uSrc, uv, 0.0).rgb;
      acc += w * log(max(dot(c, vec3(0.2126, 0.7152, 0.0722)), 1e-4));
      wsum += w;
    }
  float now = acc / wsum;
  if (uDt < 0.0) {
    o = vec4(now, 0.0, 0.0, 1.0);
    return;
  }
  float prev = texelFetch(uPrev, ivec2(0), 0).r;
  float tau = now > prev ? 0.6 : 2.5;
  o = vec4(mix(prev, now, 1.0 - exp(-uDt / tau)), 0.0, 0.0, 1.0);
}`,lo=`${K}
${Ve}
${Le}
${ot}
uniform sampler2D uScene;
uniform sampler2D uBloom;
uniform sampler2D uCookie;
uniform sampler2D uDust;
uniform sampler2D uAdapt;
uniform int uAdaptOn;
uniform float uKey; // the log luminance the eye is happy at; brighter stops it down
uniform vec2 uRes;
uniform float uTime;
uniform float uFade;
uniform float uExposure;
uniform float uBloomAmt;
uniform float uGrain;
uniform float uFringe;
uniform float uPx;
uniform int uDebug;
in vec2 vUv;
out vec4 o;

vec3 aces(vec3 x) {
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

void main() {
  vec2 uv = vUv;
  if (uDebug == 1) {
    // the cookie itself: the opening, black on paper, in its square
    vec2 q = (uv - 0.5) * vec2(uRes.x / uRes.y, 1.0) + 0.5;
    if (q.x < 0.0 || q.x > 1.0) {
      o = vec4(0.3, 0.3, 0.3, 1.0);
      return;
    }
    vec4 st = texture(uCookie, q);
    float m = clamp(0.5 - sdfDecode(st), 0.0, 1.0);
    o = vec4(mix(vec3(0.85, 0.83, 0.8), vec3(0.05 + 0.4 * st.y, 0.05, 0.05), m), 1.0);
    return;
  }
  vec2 cc = uv - 0.5;
  cc.x *= uRes.x / uRes.y;
  float r2 = dot(cc, cc);
  vec2 ca = (uv - 0.5) * r2 * uFringe;
  vec3 col;
  col.r = decHDR(texture(uScene, uv - ca).rgb).r;
  col.g = decHDR(texture(uScene, uv).rgb).g;
  col.b = decHDR(texture(uScene, uv + ca).rgb).b;
  col += texture(uDust, uv).rgb;
  col += texture(uBloom, uv).rgb * uBloomAmt;
  // the eye only ever stops down, never opens up past the set exposure, so
  // the dark stays dark and only a glare is tamed
  float adapt = uAdaptOn == 1 ? clamp(exp(uKey - texelFetch(uAdapt, ivec2(0), 0).r), 0.12, 1.0) : 1.0;
  col *= uExposure * adapt;

  float vig = 1.0 - smoothstep(0.2, 1.3, length(cc * vec2(0.9, 1.1)) * 1.2);
  col *= mix(0.35, 1.0, vig);

  col = aces(col);
  // grade: black stays black; the shadows cool, the light warms
  float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = mix(col, col * vec3(0.94, 1.0, 1.05), 1.0 - smoothstep(0.0, 0.45, l));
  col = pow(col, vec3(1.0 / 2.2));

  // grain the size of a CSS pixel, so it looks the same at every resolution
  float g = hash12(floor(gl_FragCoord.xy / max(uPx, 1e-3)) + fract(uTime * 7.31) * 913.0) - 0.5;
  col += g * uGrain * (0.3 + sqrt(l));
  col *= uFade;
  col += (ign(gl_FragCoord.xy + fract(uTime) * 61.0) - 0.5) / 255.0;
  o = vec4(max(col, 0.0), 1.0);
}`,ho=6,ne=640;function uo(o=64){const e=new Uint8Array(o*o*o*2);let t=9001;const s=()=>(t=t*16807%2147483647)/2147483647,n=f=>{const i=new Float32Array(f*f*f);for(let h=0;h<i.length;h++)i[h]=s();return i},l=f=>f*f*(3-2*f),c=(f,i,h,p,d)=>{const x=h*i/o,R=p*i/o,g=d*i/o,b=Math.floor(x),M=Math.floor(R),w=Math.floor(g),A=l(x-b),m=l(R-M),v=l(g-w),y=(P,C,U)=>f[(U%i+i)%i*i*i+(C%i+i)%i*i+(P%i+i)%i],S=(P,C,U)=>P+(C-P)*U;return S(S(S(y(b,M,w),y(b+1,M,w),A),S(y(b,M+1,w),y(b+1,M+1,w),A),m),S(S(y(b,M,w+1),y(b+1,M,w+1),A),S(y(b,M+1,w+1),y(b+1,M+1,w+1),A),m),v)},r=[[n(4),4,.55],[n(8),8,.3],[n(16),16,.15]],a=[[n(8),8,.6],[n(16),16,.4]];let u=0;for(let f=0;f<o;f++)for(let i=0;i<o;i++)for(let h=0;h<o;h++,u+=2){let p=0,d=0;for(const[x,R,g]of r)p+=c(x,R,h,i,f)*g;for(const[x,R,g]of a)d+=c(x,R,h,i,f)*g;e[u]=Math.round(p*255),e[u+1]=Math.round(d*255)}return{data:e,n:o}}class fo{constructor(e,{force8:t=!1}={}){const s=Wt(e);if(!s)throw new Error("webgl2");this.gl=s.gl,this.floatOk=s.floatOk&&!t;const n=this.gl;if(this.floatOk){const u=[X(n,4,4,{float:!0}),X(n,4,4,{float:!0,channels:2})];this.floatOk=u.every(f=>f.ok);for(const f of u)lt(n,f)}this.canvas=e,this.quad=Zt(n);const l=this.floatOk?"":`#define SDF8
`,c=Kt();this.pSil=oe(n,re,eo,l),this.pEmit=oe(n,re,to,l),this.pHall=oe(n,re,oo,l+c),this.pResolve=oe(n,re,so,l),this.pDust=oe(n,po(no,l+c),ao),this.pDown=oe(n,re,io,l),this.pUp=oe(n,re,ro),this.pFinal=oe(n,re,lo,l),this.pAdapt=oe(n,re,co),this.primTex=n.createTexture(),n.bindTexture(n.TEXTURE_2D,this.primTex),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.NEAREST),n.texImage2D(n.TEXTURE_2D,0,n.RGBA32F,400,1,0,n.RGBA,n.FLOAT,null),this.cookie=X(n,ne,ne,{float:this.floatOk,channels:this.floatOk?2:4}),this.emitters=X(n,4,4,{float:!1,linear:!1}),this.emitPBO=n.createBuffer(),n.bindBuffer(n.PIXEL_PACK_BUFFER,this.emitPBO),n.bufferData(n.PIXEL_PACK_BUFFER,64,n.STREAM_READ),n.bindBuffer(n.PIXEL_PACK_BUFFER,null),this.emitBytes=new Uint8Array(64),this.emitFence=null,this.emitRead=!1,this.patches=new Float32Array(64),this.adapt=this.floatOk?[X(n,1,1,{linear:!1}),X(n,1,1,{linear:!1})]:null,this.adaptFlip=0,this.adaptFresh=!0;const{data:r,n:a}=uo(64);this.noise=n.createTexture(),n.bindTexture(n.TEXTURE_3D,this.noise),n.pixelStorei(n.UNPACK_ALIGNMENT,1),n.texImage3D(n.TEXTURE_3D,0,n.RG8,a,a,a,0,n.RG,n.UNSIGNED_BYTE,r),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.texParameteri(n.TEXTURE_3D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_3D,n.TEXTURE_MAG_FILTER,n.LINEAR);for(const u of[n.TEXTURE_WRAP_S,n.TEXTURE_WRAP_T,n.TEXTURE_WRAP_R])n.texParameteri(n.TEXTURE_3D,u,n.REPEAT);n.bindTexture(n.TEXTURE_3D,null),this.initDust(),console.info(`cenotaph: ${this.floatOk?"float":"8-bit"} targets`),this.w=0,this.h=0,this.flip=0}initDust(){const e=this.gl,t=9e3,s=new Float32Array(t*4),n=new Float32Array(t*4);let l=4242;const c=()=>(l=l*16807%2147483647)/2147483647;for(let a=0;a<t;a++){s.set([c(),c(),c(),c()],a*4);const u=.25+c()*.75,f=.004+Math.pow(c(),3)*.02,i=.3+Math.pow(c(),2)*1.7;n.set([u,f,i,0],a*4)}this.dustCount=t,this.vao=e.createVertexArray(),e.bindVertexArray(this.vao);const r=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,r),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0);for(const[a,u]of[[1,s],[2,n]]){const f=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,f),e.bufferData(e.ARRAY_BUFFER,u,e.STATIC_DRAW),e.enableVertexAttribArray(a),e.vertexAttribPointer(a,4,e.FLOAT,!1,0,0),e.vertexAttribDivisor(a,1)}e.bindVertexArray(null)}resize(e,t,s=1){if(e===this.w&&t===this.h&&s===this.pr)return!1;const n=this.gl;this.w=e,this.h=t,this.pr=s;for(const a of[this.cur,this.dust,...this.hist??[],...this.bloom??[]])lt(n,a);const l={float:this.floatOk};this.cur=X(n,e,t,{float:this.floatOk,linear:!1}),this.hist=[X(n,e,t,l),X(n,e,t,l)],this.dust=X(n,e,t,l),this.bloom=[];let c=e/s,r=t/s;for(let a=0;a<ho;a++)c=Math.max(1,Math.ceil(c/2)),r=Math.max(1,Math.ceil(r/2)),this.bloom.push(X(n,c,r,l));return!0}hallUniforms(e,t){const s=this.gl;s.uniform2f(e.uCookieRot,Math.cos(t.cookieRot),Math.sin(t.cookieRot)),s.uniform1f(e.uCookieM,t.cookieM),s.uniform3fv(e.uSun,t.sun),s.uniform2f(e.uSunXZ,t.sun[0]/t.sun[1],t.sun[2]/t.sun[1]),s.uniform3fv(e.uSunColor,t.palette.sun),s.uniform3fv(e.uSkyColor,t.palette.sky),s.uniform3fv(e.uFogColor,t.palette.fog),s.uniform4fv(e.uBeamBox,t.beamBox);const n=t.sun,l=pe(je(n,[0,0,1]));s.uniform3fv(e.uBeamB,l),s.uniform3fv(e.uBeamC,je(n,l)),s.uniform1f(e.uTime,t.story),s.uniform1f(e.uDrift,t.drift);const c=t.tune;s.uniform3f(e.uFog,c.fogBase,c.fogLow,c.fogHeight),s.uniform4f(e.uDust,c.dustFloor,c.dustAmount,c.dustLo,c.dustHi),s.uniform2f(e.uDustScale,c.dustAcross,c.dustAlong),s.uniform1f(e.uPhaseG,c.phaseG),s.uniform1f(e.uSunSpread,c.spread),s.uniform1f(e.uBounceGain,c.bounce),s.uniform4f(e.uFloor,c.polish,c.roughLo,c.roughHi,c.floorAlbedo)}camUniforms(e,t){const s=this.gl,n=t.R;s.uniform3fv(e.uCamPos,t.pos),s.uniform3f(e.uRight,n[0],n[1],n[2]),s.uniform3f(e.uUp,n[3],n[4],n[5]),s.uniform3f(e.uFwd,-n[6],-n[7],-n[8]),s.uniform1f(e.uFocal,t.focal),s.uniform1f(e.uAspect,this.w/this.h)}emitUniforms(e,t){const s=this.gl,n=this.emitBytes,l=O.HOLE_SPAN,c=Math.cos(t.cookieRot),r=Math.sin(t.cookieRot);let a=0,u=0,f=0,i=0;for(let m=0;m<16;m++){const v=n[m*4]/255*(l/4)**2;if(v<.01)continue;const y=(((m&3)+n[m*4+1]/255)/4-.5)*l,S=(((m>>2)+n[m*4+2]/255)/4-.5)*l,P=O.HOLE_X+c*y-r*S,C=O.HOLE_Z+r*y+c*S;this.patches.set([P,C,v,0],a*4),a++,u+=P*v,f+=C*v,i+=v}const[h,p,d]=t.sun,x=i>0?u/i:O.HOLE_X,R=i>0?f/i:O.HOLE_Z;s.uniform4fv(e.uPatch,this.patches),s.uniform1i(e.uPatchN,a),s.uniform3f(e.uSkyC,x,O.H,R),s.uniform3f(e.uPoolC,x-h/p*O.H,0,R-d/p*O.H),s.uniform1f(e.uArea,i);const g=t.tune,b=O.H,M=g.fogHeight,w=g.fogBase*b/p+g.fogLow*(M/p)*(1-Math.exp(-b/M)),A=p*.24/Math.PI*Math.exp(-w);s.uniform3f(e.uPoolRad,t.palette.sun[0]*A,t.palette.sun[1]*A,t.palette.sun[2]*A)}eachSide(e,t,s,n){var r;const l=this.gl,c=(r=e.sides)!=null&&r.length?e.sides:[{}];if(c.length===1)return n({...e,...c[0]});l.enable(l.SCISSOR_TEST);for(const a of c){const u=Math.round(a.x0*t),f=Math.round(a.x1*t);l.scissor(u,0,f-u,s),n({...e,...a})}l.disable(l.SCISSOR_TEST)}render(e){const t=this.gl,{w:s,h:n}=this,l=e.figure;this.emitFence&&t.clientWaitSync(this.emitFence,0,0)!==t.TIMEOUT_EXPIRED&&(t.deleteSync(this.emitFence),this.emitFence=null,t.bindBuffer(t.PIXEL_PACK_BUFFER,this.emitPBO),t.getBufferSubData(t.PIXEL_PACK_BUFFER,0,this.emitBytes),t.bindBuffer(t.PIXEL_PACK_BUFFER,null)),t.bindTexture(t.TEXTURE_2D,this.primTex),t.texSubImage2D(t.TEXTURE_2D,0,0,0,l.count*2,1,t.RGBA,t.FLOAT,l.data,0),V(t,this.cookie),t.useProgram(this.pSil.p),B(t,0,this.primTex,this.pSil.u.uPrims);const c=new Float32Array(48),r=new Int32Array(24);l.groups.slice(0,12).forEach((d,x)=>{c.set([d.cx,d.cy,d.r,d.k+2],x*4),r.set([d.start,d.count],x*2)}),t.uniform4fv(this.pSil.u.uGroups,c),t.uniform2iv(this.pSil.u.uRanges,r),t.uniform1i(this.pSil.u.uGroupCount,Math.min(12,l.groups.length)),this.quad(),V(t,this.emitters),t.useProgram(this.pEmit.p),B(t,0,this.cookie.tex,this.pEmit.u.uCookie),this.quad(),this.emitRead?this.emitFence||(t.bindBuffer(t.PIXEL_PACK_BUFFER,this.emitPBO),t.readPixels(0,0,4,4,t.RGBA,t.UNSIGNED_BYTE,0),t.bindBuffer(t.PIXEL_PACK_BUFFER,null),this.emitFence=t.fenceSync(t.SYNC_GPU_COMMANDS_COMPLETE,0)):(t.readPixels(0,0,4,4,t.RGBA,t.UNSIGNED_BYTE,this.emitBytes),this.emitRead=!0),V(t,this.cur),t.useProgram(this.pHall.p);let a=this.pHall.u;B(t,0,this.cookie.tex,a.uCookie),t.activeTexture(t.TEXTURE2),t.bindTexture(t.TEXTURE_3D,this.noise),t.uniform1i(a.uNoise,2),this.camUniforms(a,e.cam),t.uniform2f(a.uRes,s,n),t.uniform2f(a.uJitter,e.jitter[0],e.jitter[1]),t.uniform1i(a.uFrame,e.frame),t.uniform1i(a.uSteps,e.steps),t.uniform1i(a.uReflSteps,e.reflSteps),this.eachSide(e,s,n,d=>{this.emitUniforms(a,d),this.hallUniforms(a,d),this.quad()}),t.activeTexture(t.TEXTURE2),t.bindTexture(t.TEXTURE_3D,null);const u=this.hist[this.flip],f=this.hist[1-this.flip];this.flip=1-this.flip,V(t,f),t.useProgram(this.pResolve.p),a=this.pResolve.u,B(t,0,this.cur.tex,a.uCur),B(t,1,u.tex,a.uHist),this.camUniforms(a,e.cam),t.uniform2f(a.uRes,s,n),t.uniformMatrix4fv(a.uPrevViewProj,!1,e.prevViewProj),t.uniform1f(a.uBlend,e.blend),t.uniform1f(a.uValid,e.histValid?1:0),this.quad();const i=f;V(t,this.dust),t.clearColor(0,0,0,1),t.clear(t.COLOR_BUFFER_BIT),t.enable(t.BLEND),t.blendFunc(t.ONE,t.ONE),t.useProgram(this.pDust.p),a=this.pDust.u,B(t,0,this.cookie.tex,a.uCookie),B(t,3,this.cur.tex,a.uScene),t.uniformMatrix4fv(a.uViewProj,!1,e.cam.viewProj()),t.uniform2f(a.uRes,s,n),t.uniform1f(a.uFall,e.dustFall),t.uniform1f(a.uShutter,e.shutter),t.uniform3fv(a.uCamPos,e.cam.pos),t.uniform1f(a.uPxPerUnit,e.cam.pxPerUnit),t.uniform1f(a.uFocus,e.focus),t.bindVertexArray(this.vao),this.eachSide(e,s,n,d=>{this.hallUniforms(a,d),t.uniform1f(a.uMoteGlow,d.tune.moteGlow),t.drawArraysInstanced(t.TRIANGLE_STRIP,0,4,d.dust?Math.round(this.dustCount*d.tune.motes):0)}),t.bindVertexArray(null),t.disable(t.BLEND),t.useProgram(this.pDown.p);let h=i;for(const d of this.bloom){V(t,d),B(t,0,h.tex,this.pDown.u.uSrc);const x=Math.max(1,h.w/d.w/2);t.uniform2f(this.pDown.u.uTexel,x/h.w,x/h.h),t.uniform1i(this.pDown.u.uFirst,h===i?1:0),this.quad(),h=d}let p=null;if(this.adapt){const d=this.adapt[this.adaptFlip],x=this.adapt[1-this.adaptFlip];this.adaptFlip=1-this.adaptFlip,V(t,x),t.useProgram(this.pAdapt.p),B(t,0,this.bloom[this.bloom.length-1].tex,this.pAdapt.u.uSrc),B(t,1,d.tex,this.pAdapt.u.uPrev),t.uniform1f(this.pAdapt.u.uDt,this.adaptFresh?-1:e.dt),this.quad(),this.adaptFresh=!1,p=x}t.useProgram(this.pUp.p),t.enable(t.BLEND),t.blendFunc(t.CONSTANT_COLOR,t.ONE),t.blendColor(.55,.55,.55,1);for(let d=this.bloom.length-1;d>0;d--){const x=this.bloom[d],R=this.bloom[d-1];V(t,R),B(t,0,x.tex,this.pUp.u.uSrc),t.uniform2f(this.pUp.u.uTexel,1/x.w,1/x.h),this.quad()}if(t.disable(t.BLEND),V(t,null),t.useProgram(this.pFinal.p),a=this.pFinal.u,B(t,0,i.tex,a.uScene),B(t,1,this.bloom[0].tex,a.uBloom),B(t,2,this.cookie.tex,a.uCookie),B(t,3,this.dust.tex,a.uDust),B(t,4,(p??this.cookie).tex,a.uAdapt),t.uniform1i(a.uAdaptOn,p?1:0),t.uniform1f(a.uKey,e.adaptKey),t.uniform2f(a.uRes,s,n),t.uniform1f(a.uTime,e.wall),t.uniform1f(a.uFade,e.fade),t.uniform1f(a.uPx,e.pr??1),t.uniform1i(a.uDebug,e.debug?1:0),this.eachSide(e,t.drawingBufferWidth,t.drawingBufferHeight,d=>{t.uniform1f(a.uExposure,d.exposure),t.uniform1f(a.uBloomAmt,d.tune.bloom),t.uniform1f(a.uGrain,d.tune.grain),t.uniform1f(a.uFringe,d.tune.fringe),this.quad()}),e.logAdapt&&p){V(t,p);const d=new Float32Array(4);t.readPixels(0,0,1,1,t.RGBA,t.FLOAT,d),V(t,null),console.info(`cenotaph: adapted log luminance ${d[0].toFixed(3)}`)}}}function po(o,e){const t=o.indexOf(`
`);return o.slice(0,t+1)+e+o.slice(t+1)}const Be=190,Pt=[[.023,.044,.04],[.008,.048,.045],[-.0085,.045,.041],[-.023,.035,.031]],me=[["pelvis",null,[0,0,0]],["spine","pelvis",[0,.1,-.01]],["chest","spine",[0,.17,0]],["neck","chest",[0,.25,-.025]],["head","neck",[0,.1,.012]]];for(const o of["L","R"]){const e=o==="L"?1:-1;me.push(["clav"+o,"chest",[.02*e,.215,-.01]],["shoulder"+o,"clav"+o,[.155*e,0,-.005]],["elbow"+o,"shoulder"+o,[0,-.29,0]],["wrist"+o,"elbow"+o,[0,-.25,0]],["hip"+o,"pelvis",[.092*e,-.07,0]],["knee"+o,"hip"+o,[0,-.43,0]],["ankle"+o,"knee"+o,[0,-.42,0]]),Pt.forEach(([t,s],n)=>{me.push([`f${n}a${o}`,"wrist"+o,[0,-.092+Math.abs(t)*.18,t]]),me.push([`f${n}b${o}`,`f${n}a${o}`,[0,-s,0]])}),me.push(["thumbA"+o,"wrist"+o,[-.006*e,-.022,.03]]),me.push(["thumbB"+o,"thumbA"+o,[0,-.046,0]])}function mo(){const o=[],e=(s,n,l,c,r,a,u)=>o.push({type:0,j:s,a:n,b:l,ra:c,rb:r,k:a,g:u}),t=(s,n,l,c,r,a)=>o.push({type:1,j:s,c:n,r:l,k:c,g:r,e:a});t("pelvis",[0,0,-.005],[.16,.11,.105],.05,"torso"),t("pelvis",[0,-.06,-.05],[.145,.1,.085],.04,"torso"),t("pelvis",[0,.03,.035],[.13,.09,.07],.04,"torso"),t("spine",[0,.09,-.004],[.122,.19,.086],.05,"torso"),t("chest",[0,.12,-.005],[.148,.16,.102],.05,"torso"),t("chest",[0,.165,.035],[.145,.08,.075],.03,"torso"),t("chest",[0,.17,-.048],[.145,.09,.07],.03,"torso"),e("chest",[-.14,.235,-.02],[.14,.235,-.02],.05,.05,.04,"torso"),e("neck",[0,-.02,0],[0,.11,.012],.05,.044,.03,"torso"),t("head",[0,.1,-.015],[.074,.095,.1],.02,"head"),t("head",[0,.052,.042],[.062,.075,.062],.02,"head"),t("head",[0,.004,.068],[.042,.028,.034],.015,"head"),t("head",[0,.112,.076],[.058,.018,.019],.012,"head"),e("head",[0,.09,.094],[0,.062,.11],.0095,.011,.008,"head"),t("head",[0,.03,.094],[.024,.014,.013],.008,"head"),t("head",[0,.105,-.06],[.082,.092,.082],.02,"head");for(const s of["L","R"]){const n="arm"+s,l="hand"+s,c="leg"+s;t("shoulder"+s,[.004,-.04,0],[.05,.08,.054],.03,n),e("shoulder"+s,[0,0,0],[0,-.29,0],.043,.033,.03,n),t("shoulder"+s,[0,-.15,.01],[.038,.1,.04],.02,n),e("elbow"+s,[0,0,0],[0,-.25,0],.034,.022,.02,n),t("elbow"+s,[0,-.07,0],[.033,.09,.038],.02,n),t("wrist"+s,[0,-.05,0],[.015,.05,.042],.012,l),t("wrist"+s,[-.004,-.036,.024],[.016,.03,.02],.01,l),Pt.forEach(([,r,a],u)=>{const f=u===3?.0075:.0088;e(`f${u}a${s}`,[0,0,0],[0,-r,0],f,f*.86,.005,l),e(`f${u}b${s}`,[0,0,0],[0,-a,0],f*.86,f*.62,.004,l)}),e("thumbA"+s,[0,0,0],[0,-.046,0],.012,.0095,.008,l),e("thumbB"+s,[0,0,0],[0,-.034,0],.0095,.007,.004,l),e("hip"+s,[0,0,0],[0,-.43,0],.082,.05,.04,c),t("hip"+s,[0,-.17,.015],[.072,.19,.078],.03,c),e("knee"+s,[0,0,0],[0,-.41,0],.048,.03,.025,c),t("knee"+s,[0,-.12,-.028],[.046,.13,.052],.02,c),e("knee"+s,[0,-.29,-.024],[0,-.425,-.034],.017,.02,.02,c),t("ankle"+s,[0,-.004,0],[.033,.024,.028],.022,c),t("ankle"+s,[0,-.045,-.016],[.028,.027,.03],.025,c),t("ankle"+s,[0,-.038,.058],[.035,.032,.1],.03,c,[.17,0,0]),t("ankle"+s,[0,-.06,.13],[.04,.017,.05],.025,c)}return o}function vo(){const o=[],e=[0,.1,-.015],t=[.08,.1,.105],s=15;for(let n=0;n<s;n++){const c=-.2+(n+.5)/s*2.1,r=Math.sin(n*2.399)*1.15,a=pe([Math.sin(r),Math.cos(c),-Math.sin(c)*Math.cos(r)*.9]),u=[e[0]+a[0]*t[0]*.9,e[1]+a[1]*t[1]*.9,e[2]+a[2]*t[2]*.9],f=Math.floor(n/3);o.push({p:u,n:a,len:.26+.3*((n*.618+f*.3)%1),width:.015+.011*(n*.382%1),seed:f*2.71+n%3*.23+.7})}return o}const ht=(o,e)=>o===0?Math.max(.0025,e*1.5):Math.max(6e-4,e*.2);function xo(o,e){return Math.sin(e*.097+o*1.7)*.5+Math.sin(e*.181+o*3.1)*.3+Math.sin(e*.293+o*5.3)*.2}const ut={spine:[-.1,0,.03],chest:[-.12,.05,.03],neck:[-.15,.25,.05],head:[-.3,.55,.1],clavL:[0,0,.12],shoulderL:[-.3,1.1,1.3],elbowL:[-.85,0,0],wristL:[.35,0,.1],clavR:[0,0,.1],shoulderR:[-.2,.5,.85],elbowR:[-.6,0,0],wristR:[.3,0,.15],hipL:[-.3,.1,.2],kneeL:[.7,0,0],ankleL:[1,0,0],hipR:[-.8,.75,.3],kneeR:[1.55,0,0],ankleR:[.95,0,0]},go={spine:[.22,0,.05],chest:[.18,-.1,.02],neck:[.15,.2,0],head:[.1,.45,.05],clavL:[0,0,.05],shoulderL:[-.95,.6,.55],elbowL:[-1.35,0,0],wristL:[.4,0,.1],clavR:[0,0,.05],shoulderR:[-.7,.3,.45],elbowR:[-1.5,0,0],wristR:[.35,0,.1],hipL:[-1.35,.25,.15],kneeL:[1.95,0,0],ankleL:[.8,0,0],hipR:[-1.1,.4,.22],kneeR:[1.7,0,0],ankleR:[.85,0,0]},yo={spine:[-.2,0,.02],chest:[-.2,.05,.02],neck:[-.2,.3,.03],head:[-.42,.5,.05],clavL:[0,0,.25],shoulderL:[-2.5,.5,.45],elbowL:[-.45,0,0],wristL:[.25,0,.1],clavR:[0,0,.22],shoulderR:[-2.25,.2,.6],elbowR:[-.6,0,0],wristR:[.3,0,.1],hipL:[-.12,.05,.12],kneeL:[.55,0,0],ankleL:[1.05,0,0],hipR:[-.35,.5,.2],kneeR:[1,0,0],ankleR:[1,0,0]};function bo(o){if(typeof o=="string")return{open:o==="open"?1:0,curl:o==="curl"?1:0,surrender:o==="surrender"?1:0};const e=.5+.5*Math.sin(o/53-1.4),t=.5+.5*Math.sin(o/71-1.57),s=Math.pow(e,3)*.85,n=Math.pow(t,3)*.85*(1-s);return{open:1-s-n,curl:s,surrender:n}}class wo{constructor(){this.joints=me.map(([e,t,s])=>({name:e,parent:t,offset:s,side:e.endsWith("R")?-1:1,rot:[0,0,0],R:null,p:null})),this.byName=Object.fromEntries(this.joints.map(e=>[e.name,e])),this.shapes=mo(),this.roots=vo(),this.data=new Float32Array(Be*8),this.groups=[],this.count=0,this.hair=[]}pose(e,{wind:t=1,reach:s=0,wall:n=e,orient:l,preset:c}){const r=this.byName,a=g=>xo(g,e),u=Math.max(0,t),f=Math.sin(n*.9)*.015,i=bo(c==="open"||c==="curl"||c==="surrender"?c:e),h={};for(const g of Object.keys(ut))h[g]=[0,1,2].map(b=>ut[g][b]*i.open+go[g][b]*i.curl+yo[g][b]*i.surrender);h.spine[0]+=f,h.chest[0]+=f,h.shoulderL[0]-=u*.15,h.shoulderL[2]+=u*.12,h.shoulderR[0]-=u*.12,h.shoulderR[2]+=u*.15,h.hipL[0]-=u*.08,h.hipR[0]-=u*.08;const p={spine:[.06,.05,.04],chest:[.05,.06,.03],neck:[.08,.15,.05],head:[.12,.25,.08],clavL:[0,0,.05],shoulderL:[.3,.3,.2],elbowL:[.3,0,0],wristL:[.2,.2,.15],clavR:[0,0,.05],shoulderR:[.3,.3,.2],elbowR:[.35,0,0],wristR:[.2,.2,.1],hipL:[.2,.15,.1],kneeL:[.3,0,0],ankleL:[.15,0,0],hipR:[.2,.15,.1],kneeR:[.3,0,0],ankleR:[.15,0,0]};let d=1;for(const g of this.joints){const b=h[g.name],M=p[g.name];if(c==="stand"||!b){g.rot=[0,0,0];continue}g.rot=b.map((w,A)=>w+a(d++*3.7+A)*M[A])}if(c!=="stand"){const g=(w,A)=>w+(A-w)*s,b=r.elbowR.rot,M=r.wristR.rot;r.elbowR.rot=[g(b[0],-.12),0,0],r.wristR.rot=[g(M[0],-.3),M[1],M[2]],r.head.rot[1]-=s*.2;for(const w of["L","R"]){const A=w==="L"?0:50,m=w==="R"?s:0;for(let v=0;v<4;v++){const y=(1.5-v)*(.12+m*.1)+a(30+A+v)*.05,S=(.3+v*.08+a(35+A+v)*.12)*(1-m*.75);r[`f${v}a${w}`].rot=[y,0,-S],r[`f${v}b${w}`].rot=[0,0,-S*1.3]}r["thumbA"+w].rot=[-.75-m*.25+a(40+A)*.1,0,-.3],r["thumbB"+w].rot=[0,0,-.3*(1-m)]}}this.fk(l),c!=="stand"&&this.aimReach(s,n);const x=["pelvis","chest","chest","head","kneeL","kneeR","elbowL","elbowR"],R=[0,0,0];for(const g of x)for(let b=0;b<3;b++)R[b]+=r[g].p[b]/x.length;for(const g of this.joints)g.p=Qe(g.p,R);this.torso=se(I(r.chest.p,r.pelvis.p),.5),this.poseHair(e,u)}fk(e){const t=this.byName;for(const s of this.joints){const n=De(s.rot[0],s.rot[1]*s.side,s.rot[2]*s.side);if(!s.parent)s.R=W(e,n),s.p=[0,0,0];else{const l=t[s.parent];s.R=W(l.R,n),s.p=I(l.p,$(l.R,s.offset))}}this.root=e}aimReach(e,t){const s=this.byName,n=s.shoulderR,l=this.reachWall===void 0?0:Math.min(.1,Math.max(0,t-this.reachWall));if(this.reachWall=t,this.reachAim||(this.reachAim=n.rot.slice()),e>.001){const r=s.clavR.R,a=n.rot[1];let u=null,f=-1e9;const i=(p,d)=>{const x=W(r,De(p,-a,-d)),R=-x[4],g=-x[7];return R+.12*g-.04*(Math.abs(p-n.rot[0])+Math.abs(d-n.rot[2]))};if(this.reachGoal)u=this.reachGoal.slice(),f=i(u[0],u[1]);else for(let p=-3;p<=.6;p+=.2)for(let d=-.2;d<=2.6;d+=.2){const x=i(p,d);x>f&&(f=x,u=[p,d])}for(const p of[.08,.08,.03,.03])for(const d of[-p,0,p])for(const x of[-p,0,p]){const R=i(u[0]+d,u[1]+x);R>f&&(f=R,u=[u[0]+d,u[1]+x])}this.reachGoal=u;const h=1-Math.exp(-l/.45);this.reachAim[0]+=(this.reachGoal[0]-this.reachAim[0])*h,this.reachAim[2]+=(this.reachGoal[1]-this.reachAim[2])*h}else this.reachAim=n.rot.slice(),this.reachGoal=null;const c=e*e*(3-2*e);n.rot=[n.rot[0]+(this.reachAim[0]-n.rot[0])*c,n.rot[1],n.rot[2]+(this.reachAim[2]-n.rot[2])*c],this.fk(this.root)}poseHair(e,t){const s=this.byName.head,n=[0,1,0],l=[1,0,0],c=[0,0,1],r=7,a=Math.min(1.4,t),u=this.hairT===void 0?0:Math.max(0,e-this.hairT);this.hairT=e,this.hairPhase=(this.hairPhase??e)+u*(.9+.5*a);const f=this.hairPhase;this.hair=this.roots.map(i=>{const h=[I(s.p,$(s.R,i.p))],p=$(s.R,i.n),d=i.len/r,x=i.seed;let R=p;for(let g=1;g<=r;g++){const b=g/r,M=x*3.1+f-b*3.4,w=(.15+.57*b)*(.6+.35*(1-Math.min(1,a))),A=I(se(l,Math.sin(M)*w),se(c,Math.sin(M*.73+x)*w*.8)),m=I(I(se(p,.7*(1-b)+.1),se(n,a*(.7+1.1*b))),A);m[1]=Math.max(m[1],.15);const v=pe(m);R=pe(I(se(R,.35),se(v,.65+.3*b))),h.push(I(h[h.length-1],se(R,d)))}return{pts:h,width:i.width}})}pack3D(){const e=this.data3??(this.data3=new Float32Array(Be*16)),t=this.byName;let s=0;const n=new Map,l=[],c=(r,a,u)=>{if(s>=Be)return;a.forEach((i,h)=>e.set(i,s*16+h*4)),n.has(r)||(n.set(r,{start:s,count:0,lo:[1e9,1e9,1e9],hi:[-1e9,-1e9,-1e9],k:0}),l.push(r));const f=n.get(r);f.count++;for(const[i,h]of u)for(let p=0;p<3;p++)f.lo[p]=Math.min(f.lo[p],i[p]-h),f.hi[p]=Math.max(f.hi[p],i[p]+h);f.k=Math.max(f.k,a[2][3]<0?a[2][0]:a[0][3]),s++};for(const r of this.shapes){const a=t[r.j],u=a.side;if(r.type===0){const f=I(a.p,$(a.R,[r.a[0]*u,r.a[1],r.a[2]])),i=I(a.p,$(a.R,[r.b[0]*u,r.b[1],r.b[2]]));c(r.g,[[...f,r.ra],[...i,r.rb],[r.k,0,0,-1],[0,0,0,0]],[[f,r.ra],[i,r.rb]])}else{const f=I(a.p,$(a.R,[r.c[0]*u,r.c[1],r.c[2]]));let i=a.R;r.e&&(i=W(i,De(r.e[0],r.e[1]*u,r.e[2]*u)));const h=d=>[i[d],i[3+d],i[6+d]],p=Math.max(...r.r);c(r.g,[[...f,r.k],[...h(0),r.r[0]],[...h(1),r.r[1]],[...h(2),r.r[2]]],[[f,p]])}}for(const{pts:r,width:a}of this.hair){const u=r.length-1,f=i=>a*Math.pow(1-i,1.4)+.0016;for(let i=0;i<u;i++){const h=f(i/u),p=f((i+1)/u);c("hair",[[...r[i],h],[...r[i+1],p],[ht(i,h),2,0,-1],[0,0,0,0]],[[r[i],h],[r[i+1],p]])}}return this.count3=s,this.groups3=l.map(r=>{const a=n.get(r),u=a.lo.map((i,h)=>(i+a.hi[h])/2),f=Math.hypot(a.hi[0]-a.lo[0],a.hi[1]-a.lo[1],a.hi[2]-a.lo[2])/2;return{c:u,r:f,k:a.k,start:a.start,count:a.count}}),this}lookPoint(e){const t=this.byName,s=(n,l)=>{var c;return(c=t[n])!=null&&c.p?I(t[n].p,$(t[n].R,l)):null};if(e==="face")return s("head",[0,.065,.07]);if(e==="hand"||e==="handR")return s("wristR",[0,-.085,0]);if(e==="handL")return s("wristL",[0,-.085,0]);if(e==="foot"||e==="footR")return s("ankleR",[0,-.04,.03]);if(e==="footL")return s("ankleL",[0,-.04,.03]);if(e==="hair"){const n=this.hair.flatMap(l=>l.pts);return n.length?se(n.reduce((l,c)=>I(l,c),[0,0,0]),1/n.length):null}return s(e,[0,0,0])}project(e){const t=this.data;let s=0;const n=new Map,l=this.byName,c=[],r=(i,h,p)=>{if(s>=Be)return;t.set(h,s*8),t.set(p,s*8+4),n.has(i)||(n.set(i,{start:s,count:0,minX:1e9,minY:1e9,maxX:-1e9,maxY:-1e9,k:0}),c.push(i));const d=n.get(i);return d.count++,s++,d},a=(i,h,p,d)=>{i.minX=Math.min(i.minX,h-d),i.maxX=Math.max(i.maxX,h+d),i.minY=Math.min(i.minY,p-d),i.maxY=Math.max(i.maxY,p+d)};this.pxPerM=e.pxPerUnit/e.project([0,0,0])[2];const u=(i,h,p,d,x,R,g)=>{const b=e.project(i),M=e.project(h),w=p*e.pxPerUnit/b[2],A=d*e.pxPerUnit/M[2],m=x*this.pxPerM,v=r(R,[b[0],b[1],M[0],M[1]],[w,A,g?2:0,m]);v&&(a(v,b[0],b[1],w),a(v,M[0],M[1],A),v.k=Math.max(v.k,m))};for(const i of this.shapes){const h=l[i.j],p=h.side;if(i.type===0){const d=[i.a[0]*p,i.a[1],i.a[2]],x=[i.b[0]*p,i.b[1],i.b[2]];u(I(h.p,$(h.R,d)),I(h.p,$(h.R,x)),i.ra,i.rb,i.k,i.g,!1)}else{const d=I(h.p,$(h.R,[i.c[0]*p,i.c[1],i.c[2]]));let x=h.R;i.e&&(x=W(x,De(i.e[0],i.e[1]*p,i.e[2]*p)));const R=W(e.R,x),g=[0,1,2].map(j=>[R[0+j]*i.r[j],R[3+j]*i.r[j]]);let b=0,M=0,w=0;for(const[j,D]of g)b+=j*j,M+=j*D,w+=D*D;const A=e.project(d),m=e.pxPerUnit/A[2];b*=m*m,M*=m*m,w*=m*m;const v=(b+w)/2,y=Math.sqrt(((b-w)/2)**2+M*M),S=v+y,P=Math.max(v-y,1e-6),C=.5*Math.atan2(2*M,b-w),U=Math.sqrt(S),G=Math.sqrt(P),ue=i.k*this.pxPerM,fe=r(i.g,[A[0],A[1],Math.cos(C),Math.sin(C)],[U,G,1,ue]);if(!fe)continue;a(fe,A[0],A[1],U),fe.k=Math.max(fe.k,ue)}}for(const{pts:i,width:h}of this.hair){const p=i.length-1,d=x=>h*Math.pow(1-x,1.4)+.0016;for(let x=0;x<p;x++){const R=d(x/p),g=d((x+1)/p);u(i[x],i[x+1],R,g,ht(x,R),"hair",!0)}}this.count=s,this.groups=c.map(i=>{const h=n.get(i),p=(h.minX+h.maxX)/2,d=(h.minY+h.maxY)/2;return{cx:p,cy:d,r:Math.hypot(h.maxX-h.minX,h.maxY-h.minY)/2,start:h.start,count:h.count,k:h.k}});const f=e.project(this.torso);return this.torsoPx=f,this}}const ft=o=>o*o*(3-2*o),Ro=o=>Math.min(1,Math.max(0,o));function Mo(o){let e=o>>>0;return()=>{e=e+1831565813>>>0;let t=e;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}function Ye(o,e,t,s,n){const l=o-e;return l<=0||l>=t+s+n?0:l<t?ft(l/t):l<t+s?1:1-ft((l-t-s)/n)}const pt=1.7,ko=27;class Eo{constructor(e=0){this.wall=e,this.story=ko+e*.9,this.fall=e*pt,this.rate=1,this.blur=1,this.hold=0,this.holding=!1,this.susp=0,this.rush=0,this.reach=0,this.swell=0;const t=Mo(1789);this.suspensions=[],this.rushes=[];let s=40;for(let n=0;n<400;n++){this.suspensions.push(s);const l=80+t()*55;this.rushes.push(s+22+t()*(l-40)),s+=l}}suspensionAt(e){let t=0;for(const s of this.suspensions){if(s>e)break;t=Math.max(t,Ye(e,s,5,10,7))}return t}rushAt(e){let t=0;for(const s of this.rushes){if(s>e)break;t=Math.max(t,Ye(e,s,3.5,5,5))}return t}reachAt(e){let t=0;for(const s of this.suspensions){if(s>e)break;t=Math.max(t,Ye(e,s+4,6,6,8))}return t}tick(e,t=!1){e=Math.min(e,.1),this.wall+=e;const s=this.wall,n=Math.PI*2,l=.9+.3*Math.sin(n*s/67)+.18*Math.sin(n*s/31+1.3)+.08*Math.sin(n*s/13+.4);this.susp=this.suspensionAt(s),this.rush=this.rushAt(s),this.reach=this.reachAt(s);const c=1-Math.exp(-e/.6);this.hold+=((this.holding?1:0)-this.hold)*(1-Math.exp(-e/(this.holding?.9:1.6)));const r=t?.45:1;let a=l*(1+.85*this.rush);a=a*(1-this.susp)+-.06*this.susp,a*=1-.97*this.hold,this.rate+=(a*r-this.rate)*c;let u=l*(1+1.3*this.rush);u=u*(1-this.susp)+1.05*this.susp,u*=1-.45*this.hold,this.blur+=(u*r-this.blur)*c,this.story+=e*Math.min(1.6,Math.max(.025,this.rate)),this.fall+=e*this.rate*pt,this.swell=Ro(this.susp*1+this.hold*.5)}}const So=`
const TABLE = 4096
const SIN = new Float32Array(TABLE + 1)
for (let i = 0; i <= TABLE; i++) SIN[i] = Math.sin((i / TABLE) * Math.PI * 2)
function sinT(ph) {
  const x = ph * TABLE
  const i = x | 0
  return SIN[i] + (SIN[i + 1] - SIN[i]) * (x - i)
}

class Shepard extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'rate', defaultValue: -0.016, minValue: -2, maxValue: 2, automationRate: 'k-rate' },
      { name: 'center', defaultValue: 8.1, minValue: 4, maxValue: 13, automationRate: 'k-rate' },
      { name: 'width', defaultValue: 1.0, minValue: 0.3, maxValue: 3, automationRate: 'k-rate' },
      { name: 'linger', defaultValue: 0.9, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
      { name: 'fifth', defaultValue: 0.3, minValue: 0, maxValue: 1, automationRate: 'k-rate' },
    ]
  }
  constructor() {
    super()
    this.N = 10
    this.base = 18.354 // D0: the glide's octaves are Ds
    this.logBase = Math.log2(this.base)
    this.pos = 0.58
    this.ph = new Float64Array(this.N * 4)
    for (let i = 0; i < this.ph.length; i++) this.ph[i] = Math.random()
    this.chord = [0, 4, 7]
    this.port.onmessage = (e) => {
      if (e.data && e.data.chord) this.chord = e.data.chord
    }
  }
  amp(oct, center, width) {
    const d = (this.logBase + oct - center) / width
    return Math.exp(-0.5 * d * d)
  }
  voice(L, R, k, oa, ob, mul, gain, center, width) {
    const n = L.length
    const lb = Math.log2(mul)
    const a0 = this.amp(oa + lb, center, width) * gain
    const a1 = this.amp(ob + lb, center, width) * gain
    if (a0 < 1e-5 && a1 < 1e-5) return
    const f0 = this.base * mul * Math.pow(2, oa)
    const f1 = this.base * mul * Math.pow(2, ob)
    let pL = this.ph[k], pR = this.ph[k + 1]
    for (let i = 0; i < n; i++) {
      const t = i / n
      const f = f0 + (f1 - f0) * t
      const a = a0 + (a1 - a0) * t
      pL += (f * 0.9986) / sampleRate
      pR += (f * 1.0014) / sampleRate
      if (pL >= 1) pL -= Math.floor(pL)
      if (pR >= 1) pR -= Math.floor(pR)
      let p2L = pL * 2, p2R = pR * 2
      if (p2L >= 1) p2L -= 1
      if (p2R >= 1) p2R -= 1
      L[i] += a * (sinT(pL) + 0.14 * sinT(p2L))
      R[i] += a * (sinT(pR) + 0.14 * sinT(p2R))
    }
    this.ph[k] = pL
    this.ph[k + 1] = pR
  }
  process(inputs, outputs, p) {
    const out = outputs[0]
    const L = out[0]
    const R = out[1] || out[0]
    const n = L.length
    const rate = p.rate[0], center = p.center[0], width = p.width[0]
    const linger = p.linger[0], fifth = p.fifth[0]

    // How close is the glide to one of the chord's tones? Close → slow.
    const pc = (((this.pos % 1) + 1) % 1) * 12
    let near = 6
    for (const c of this.chord) {
      const d = (((pc - c) % 12) + 12) % 12
      near = Math.min(near, d, 12 - d)
    }
    const caught = Math.exp(-(near * near) / (2 * 0.3 * 0.3))
    const slow = (1 - linger * 0.96 * caught) / (1 - linger * 0.96 * 0.2)
    const p0 = this.pos
    const p1 = p0 + (rate * slow * n) / sampleRate
    this.pos = p1

    const N = this.N
    const norm = 0.36 / width
    for (let v = 0; v < N; v++) {
      const o1 = (((v + p1) % N) + N) % N
      let o0 = (((v + p0) % N) + N) % N
      if (Math.abs(o1 - o0) > 1) o0 = o1 // wrapped round the far edge, where it's silent
      this.voice(L, R, v * 4, o0, o1, 1, norm, center, width)
      if (fifth > 0.001) this.voice(L, R, v * 4 + 2, o0, o1, 1.5, norm * fifth * caught, center, width)
    }
    return true
  }
}
registerProcessor('shepard', Shepard)
`,Ie=[{bass:38,notes:[45,54,57,64],pcs:[0,4,7]},{bass:37,notes:[45,52,57,61],pcs:[7,11,2]},{bass:35,notes:[42,50,54,61],pcs:[9,0,4]},{bass:33,notes:[42,49,54,57],pcs:[4,7,11]},{bass:31,notes:[38,47,54,57],pcs:[5,9,0,4]},{bass:30,notes:[45,50,54,64],pcs:[0,4,7]},{bass:28,notes:[43,50,54,59],pcs:[2,5,9,0]},{bass:33,notes:[40,50,52,55],pcs:[7,0,2,5]}],Ao=14,Lo={level:.4,reverb:.85,lowCut:40,shepard:1,pad:1,air:1,hall:1,dust:1,breath:1},et=["shepard","pad","air","hall","dust","breath"],be=o=>440*Math.pow(2,(o-69)/12);function st(o){let e=o>>>0;return()=>{e=e+1831565813>>>0;let t=e;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}function To(o,e){const t=o.sampleRate,s=Math.floor(t*e),n=o.createBuffer(2,s,t),l=.045;for(let c=0;c<2;c++){const r=n.getChannelData(c),a=st(c?7919:104729),u=1-Math.exp(-2*Math.PI*400/t),f=1-Math.exp(-2*Math.PI*3e3/t);let i=0,h=0;const p=Math.floor(t*l);for(let d=p;d<s;d++){const x=(d-p)/t,R=a()*2-1;i+=(R-i)*u,h+=(R-h)*f;const g=i,b=h-i,M=R-h,w=v=>Math.exp(-6.9*x/v),A=1-Math.exp(-x/.07),m=1+.18*Math.exp(-x/2.5)*(Math.cos(2*Math.PI*x/.268)+.6*Math.cos(2*Math.PI*x/.175));r[d]=(g*2.2*w(13)+b*1.1*w(9)+M*.5*w(3.5))*A*m}for(let d=0;d<26;d++){const x=48+Math.pow(a(),.8)*320,R=Math.floor(t*(l+x*.001));R<s&&(r[R]+=(a()<.5?-1:1)*.55*Math.exp(-x/260)*(.4+.6*a()))}}return n}function dt(o,e=6,t=1){const s=o.sampleRate,n=Math.floor(s*e),l=o.createBuffer(2,n,s);for(let c=0;c<2;c++){const r=l.getChannelData(c),a=st(t*31+c);let u=0,f=0,i=0;for(let h=0;h<n;h++){const p=a()*2-1;u=.99765*u+p*.099046,f=.963*f+p*.2965164,i=.57*i+p*1.0526913,r[h]=(u+f+i+p*.1848)*.12}}return l}class Po{constructor({layers:e=et,tune:t=Lo}={}){this.tune=t,this.started=!1,this.muted=!1,this.ctx=null,this.on=new Set(e),this.rand=st(2718)}async start(e){if(this.started)return;this.started=!0;const t=!e;if(t){const s=window.AudioContext||window.webkitAudioContext;e=new s({latencyHint:"playback"}),e.resume()}if(this.ctx=e,this.hasShepard=!1,e.audioWorklet&&this.on.has("shepard")){const s=URL.createObjectURL(new Blob([So],{type:"application/javascript"}));try{await e.audioWorklet.addModule(s),this.hasShepard=!0}catch(n){console.warn("shepard worklet unavailable:",n)}URL.revokeObjectURL(s)}this.build(),this.live=t}build(){const e=this.ctx,t=e.currentTime,s=(i=1)=>{const h=e.createGain();return h.gain.value=i,h};this.g=s,this.master=s(0),this.lowCut=e.createBiquadFilter(),this.lowCut.type="highpass",this.lowCut.frequency.value=this.tune.lowCut,this.lowCut.Q.value=.6;const n=e.createDynamicsCompressor();n.threshold.value=-22,n.knee.value=14,n.ratio.value=3,n.attack.value=.03,n.release.value=.5;const l=e.createDynamicsCompressor();l.threshold.value=-6,l.knee.value=0,l.ratio.value=20,l.attack.value=.002,l.release.value=.2,this.master.connect(this.lowCut).connect(n).connect(l).connect(s(.8)).connect(e.destination),this.master.gain.setValueAtTime(0,t),this.master.gain.linearRampToValueAtTime(1e-4,t+.05),this.master.gain.setTargetAtTime(this.tune.level,t+.05,2.6),this.dry=s(1),this.dry.connect(this.master);const c=(navigator.hardwareConcurrency||4)<=4||matchMedia("(pointer: coarse)").matches;this.verb=e.createConvolver(),this.verb.buffer=To(e,c?7:12),this.verbIn=s(1),this.verbOut=s(this.tune.reverb),this.verbIn.connect(this.verb).connect(this.verbOut).connect(this.master),this.tape=e.createConstantSource(),this.tape.offset.value=0,this.wow=e.createOscillator(),this.wow.frequency.value=.31,this.wowDepth=s(4),this.wow.connect(this.wowDepth),this.tapeBus=s(1),this.tape.connect(this.tapeBus),this.wowDepth.connect(this.tapeBus),this.tape.start(t),this.wow.start(t);const r=dt(e,6,1);this.noise=r,this.shepGain=s(0);const a=e.createBiquadFilter();a.type="lowpass",a.frequency.value=2200,a.Q.value=.4,this.hasShepard&&(this.shep=new AudioWorkletNode(e,"shepard",{numberOfInputs:0,outputChannelCount:[2]}),this.shep.connect(a)),a.connect(this.shepGain),this.shepGain.connect(s(.18)).connect(this.dry),this.shepGain.connect(this.verbIn);const u=[0,1,.45,.24,.14,.085,.05,.03,.018,.01,.006];this.wave=e.createPeriodicWave(new Float32Array(u.length),new Float32Array(u)),this.padFilter=e.createBiquadFilter(),this.padFilter.type="lowpass",this.padFilter.frequency.value=800,this.padFilter.Q.value=.5,this.padBus=s(this.on.has("pad")?.055:0),this.padFilter.connect(this.padBus),this.padBus.connect(s(.6)).connect(this.dry),this.padBus.connect(this.verbIn),this.voices=[],this.subGain=s(0),this.subGain.connect(this.dry),this.subGain.connect(s(.3)).connect(this.verbIn),this.subs=[[12,.62],[0,.5]].map(([i,h])=>{const p=e.createOscillator();p.type="sine",p.frequency.value=be(Ie[0].bass+i);const d=s(h);return p.connect(d).connect(this.subGain),this.tapeBus.connect(p.detune),p.start(t),{o:p,shift:i}}),this.airSrc=e.createBufferSource(),this.airSrc.buffer=r,this.airSrc.loop=!0,this.airBus=s(0),this.air=[];for(let i=0;i<4;i++){const h=e.createBiquadFilter();h.type="bandpass",h.Q.value=34,h.frequency.value=440,this.airSrc.connect(h).connect(s(1.6)).connect(this.airBus),this.air.push(h)}this.airBus.connect(this.verbIn),this.airBus.connect(s(.2)).connect(this.dry),this.airSrc.start(t),this.hallSrc=e.createBufferSource(),this.hallSrc.buffer=dt(e,7,2),this.hallSrc.loop=!0,this.hallSrc.playbackRate.value=.5,this.hallLow=e.createBiquadFilter(),this.hallLow.type="lowpass",this.hallLow.frequency.value=140,this.hallLow.Q.value=.6;const f=e.createBiquadFilter();f.type="bandpass",f.frequency.value=5200,f.Q.value=.5,this.hallGain=s(0),this.hallSrc.connect(this.hallLow).connect(this.hallGain),this.hallSrc.connect(f).connect(s(.05)).connect(this.hallGain),this.hallGain.connect(this.dry),this.hallGain.connect(s(.5)).connect(this.verbIn),this.hallSrc.start(t),this.dustBus=s(0),this.dustBus.connect(s(.35)).connect(this.dry),this.dustBus.connect(this.verbIn),this.breathBus=s(this.on.has("breath")?1:0),this.breathBus.connect(s(.4)).connect(this.dry),this.breathBus.connect(s(1.3)).connect(this.verbIn),this.lastNow=t,this.mtime=0,this.chordIndex=-1,this.nextChord=0,this.nextGrain=t+2,this.inSusp=!1,this.held=!1,this.lastBreath=-100}setMuted(e){if(this.muted=e,!this.ctx)return;const t=this.ctx.currentTime;this.master.gain.cancelScheduledValues(t),this.master.gain.setValueAtTime(this.master.gain.value,t),e?(this.master.gain.setTargetAtTime(0,t,.25),this.live&&setTimeout(()=>this.muted&&this.ctx.suspend(),1500)):(this.ctx.resume(),this.master.gain.setTargetAtTime(this.tune.level,t,.8))}setHidden(e){!this.ctx||!this.live||this.muted||(e?this.ctx.suspend():this.ctx.resume())}chord(e,t){var l;const s=this.ctx,n=Ie[e%Ie.length];this.current=n;for(const c of this.voices){c.env.gain.cancelScheduledValues(t),c.env.gain.setTargetAtTime(0,t,2.8);for(const r of c.osc)r.stop(t+16)}this.voices=[],this.on.has("pad")&&n.notes.forEach((c,r)=>{const a=s.createGain();a.gain.value=0;const u=.32/Math.sqrt(n.notes.length)*(1-r*.09);a.gain.setValueAtTime(0,t),a.gain.setTargetAtTime(u,t,2.2),a.connect(this.padFilter);const f=[-1,1].map(i=>{const h=s.createOscillator();h.setPeriodicWave(this.wave),h.frequency.value=be(c),h.detune.value=i*(c<48?2.5:5+this.rand()*3),this.tapeBus.connect(h.detune);const p=s.createStereoPanner();return p.pan.value=i*(.25+r*.1),h.connect(p).connect(a),h.start(t),this.unhookOnEnd(h),h});this.voices.push({env:a,osc:f})});for(const{o:c,shift:r}of this.subs)c.frequency.setTargetAtTime(be(n.bass+r),t,.9);this.air.forEach((c,r)=>{const a=n.notes[r%n.notes.length]+12;c.frequency.setTargetAtTime(be(a),t,1.4)}),(l=this.shep)==null||l.port.postMessage({chord:n.pcs})}grain(e,t){const s=this.ctx,n=this.current??Ie[0],l=this.rand,r=n.notes[Math.floor(l()*n.notes.length)]+24+12*Math.floor(l()*2.2),a=t?.6+l()*1.6:.025+l()*l()*.08,u=(t?.05:.11)*(.3+l()*.7)*Math.pow(2,-(r-80)/24),f=s.createOscillator();f.frequency.value=be(r),f.detune.setValueAtTime(l()*20-10,e),f.detune.linearRampToValueAtTime(t?-6:-30-l()*40,e+a);const i=s.createGain();i.gain.value=0,i.gain.setValueAtTime(0,e),i.gain.linearRampToValueAtTime(u,e+a*(t?.4:.18)),i.gain.linearRampToValueAtTime(0,e+a);const h=s.createStereoPanner();h.pan.value=(l()*2-1)*.85,f.connect(i).connect(h).connect(this.dustBus),f.start(e),f.stop(e+a+.05),f.onended=()=>{f.disconnect(),i.disconnect(),h.disconnect()}}breath(e,t=1){const s=this.ctx,n=this.rand,l=s.createBufferSource();l.buffer=this.noise;const c=n()*(this.noise.duration-2),r=.55+n()*.25,a=s.createBiquadFilter();a.type="bandpass",a.Q.value=.8,a.frequency.setValueAtTime(1500+n()*500,e),a.frequency.exponentialRampToValueAtTime(520,e+r);const u=s.createBiquadFilter();u.type="highpass",u.frequency.value=260;const f=s.createGain();f.gain.value=0,f.gain.setValueAtTime(0,e),f.gain.linearRampToValueAtTime(.9*t,e+.05),f.gain.setTargetAtTime(.35*t,e+.05,.12),f.gain.setTargetAtTime(0,e+r*.55,r*.18);const i=s.createStereoPanner();i.pan.value=(n()-.5)*.3,l.connect(u).connect(a).connect(f).connect(i).connect(this.breathBus),l.start(e,c,r+1);const h=s.createOscillator();h.type="sine",h.frequency.setValueAtTime(95,e+r*.5),h.frequency.exponentialRampToValueAtTime(48,e+r*.5+.18);const p=s.createGain();p.gain.value=0,p.gain.setValueAtTime(0,e+r*.5),p.gain.linearRampToValueAtTime(.22*t,e+r*.5+.015),p.gain.setTargetAtTime(0,e+r*.5+.02,.05),h.connect(p).connect(i),h.start(e+r*.5),h.stop(e+r*.5+.5),l.onended=()=>{l.disconnect(),u.disconnect(),a.disconnect(),f.disconnect()},h.onended=()=>{h.disconnect(),p.disconnect(),i.disconnect()}}unhookOnEnd(e){e.onended=()=>{try{this.tapeBus.disconnect(e.detune)}catch{}e.disconnect()}}update(e,t=1){var M;if(!this.ctx||!this.master)return;const n=this.ctx.currentTime,l=Math.max(0,Math.min(.25,n-this.lastNow));if(this.lastNow=n,l===0&&this.chordIndex>=0)return;const c=e.wall,r=e.rate,a=n+.03,u=(w,A,m=.25)=>w.setTargetAtTime(A,n,m),f=this.tune,i=w=>this.on.has(w)?f[w]??1:0;!this.muted&&f.level!==this.lastLevel&&(this.lastLevel!==void 0&&u(this.master.gain,f.level,.3),this.lastLevel=f.level),u(this.verbOut.gain,f.reverb,.3),u(this.lowCut.frequency,f.lowCut,.3),u(this.padBus.gain,i("pad")*.055,.3),u(this.breathBus.gain,i("breath"),.3),this.mtime+=l*Math.max(.05,Math.min(1.8,Math.abs(r))),this.mtime>=this.nextChord&&(this.chordIndex++,this.chord(this.chordIndex,a),this.nextChord+=Ao);const h=(M=this.shep)==null?void 0:M.parameters;h&&(u(h.get("rate"),-.02*r*(1+.6*e.rush),.4),u(h.get("fifth"),.25+.5*e.susp,1),u(h.get("center"),7.9+.4*Math.sin(c/41)+.3*e.rush,2));const p=.5+.5*Math.sin(c/97*Math.PI*2-1.2),d=.05+.8*p*p+.3*e.rush+.35*e.susp;u(this.shepGain.gain,i("shepard")*Math.min(1,d)*.17,1.5);const x=e.swell,R=(550+600*(.5+.5*Math.sin(c/23))+1100*x+600*e.rush)*(1-.45*e.hold);u(this.padFilter.frequency,R,.8),u(this.subGain.gain,i("pad")*(.08+.03*x),1),u(this.airBus.gain,i("air")*(.08+.18*x+.05*Math.max(0,Math.sin(c/31))),1.5);const g=.5+.5*Math.sin(c/11.3)*Math.sin(c/29+1);u(this.hallGain.gain,i("hall")*(.08+.06*g+.05*e.hold),2),u(this.hallLow.frequency,90+70*g,2),u(this.tape.offset,-38*e.hold-8*e.susp,.6),u(this.wowDepth.gain,3+14*e.hold+6*e.susp,.6),u(this.wow.frequency,.12+.25*Math.max(0,Math.min(1.5,r)),.6);const b=Math.max(e.hold,e.susp);if(u(this.dustBus.gain,i("dust")*(.7+.7*t),1),i("dust")>0){const w=2+9*Math.min(1.5,Math.max(0,r))*(1-b)+1.2*b;for(this.nextGrain<n&&(this.nextGrain=n);this.nextGrain<n+.12;)this.grain(this.nextGrain,this.rand()<b),this.nextGrain+=-Math.log(1-this.rand())/w}i("breath")>0&&(e.susp>.35&&!this.inSusp||e.holding&&!this.held)&&c-this.lastBreath>6&&(this.breath(a+.05,e.holding?.8:1),this.lastBreath=c),e.susp>.35?this.inSusp=!0:e.susp<.1&&(this.inSusp=!1),this.held=e.holding}}const le=[{group:"Light",key:"exposure",label:"exposure",min:.5,max:8,step:.05,value:2.5},{group:"Light",key:"sun",label:"sun strength",min:5,max:120,step:1,value:40},{group:"Light",key:"sky",label:"sky in the opening",min:0,max:.5,step:.005,value:.13},{group:"Light",key:"spread",label:"sun softness",min:.001,max:.06,step:5e-4,value:.03},{group:"Light",key:"bounce",label:"bounce light",min:0,max:4,step:.05,value:1},{group:"Light",key:"palette",label:"colour (−1 cycles)",min:-1,max:4,step:1,value:-1},{group:"Air",key:"fogBase",label:"haze",min:0,max:.03,step:2e-4,value:.0062},{group:"Air",key:"fogLow",label:"haze near the floor",min:0,max:.05,step:5e-4,value:.011},{group:"Air",key:"fogHeight",label:"floor haze height (m)",min:.5,max:20,step:.1,value:5},{group:"Air",key:"phaseG",label:"forward scatter",min:0,max:.9,step:.01,value:.55},{group:"Air",key:"glow",label:"air glow",min:0,max:.06,step:.001,value:.01},{group:"Dust",key:"dustFloor",label:"clear air between",min:0,max:1,step:.01,value:.09},{group:"Dust",key:"dustAmount",label:"dust in the streaks",min:0,max:4,step:.05,value:.65},{group:"Dust",key:"dustLo",label:"streak threshold",min:0,max:.95,step:.01,value:.78},{group:"Dust",key:"dustHi",label:"streak edge",min:.05,max:1,step:.01,value:.79},{group:"Dust",key:"dustAcross",label:"streak fineness",min:.01,max:.4,step:.005,value:.335},{group:"Dust",key:"dustAlong",label:"streak length (inv)",min:.001,max:.1,step:.001,value:.004},{group:"Dust",key:"motes",label:"motes",min:0,max:1,step:.01,value:.76},{group:"Dust",key:"moteGlow",label:"mote brightness",min:0,max:5,step:.05,value:.95},{group:"Floor",key:"polish",label:"reflection",min:0,max:1,step:.01,value:.35},{group:"Floor",key:"roughLo",label:"polish roughness",min:.01,max:.6,step:.005,value:.04},{group:"Floor",key:"roughHi",label:"worn roughness",min:.01,max:.9,step:.005,value:.26},{group:"Floor",key:"floorAlbedo",label:"floor tone",min:.02,max:.5,step:.005,value:.13},{group:"Lens",key:"bloom",label:"bloom",min:0,max:.4,step:.005,value:.205},{group:"Lens",key:"grain",label:"grain",min:0,max:.12,step:.002,value:0},{group:"Lens",key:"fringe",label:"colour fringe",min:0,max:.02,step:5e-4,value:.003},{group:"Sound",key:"level",label:"master",min:0,max:1,step:.01,value:.4},{group:"Sound",key:"reverb",label:"reverb",min:0,max:2,step:.01,value:.85},{group:"Sound",key:"lowCut",label:"low cut (Hz)",min:20,max:300,step:1,value:40},{group:"Sound",key:"shepard",label:"falling glide",min:0,max:2,step:.01,value:1},{group:"Sound",key:"pad",label:"pad and bass",min:0,max:2,step:.01,value:1},{group:"Sound",key:"air",label:"choir",min:0,max:2,step:.01,value:1},{group:"Sound",key:"hall",label:"room air",min:0,max:2,step:.01,value:1},{group:"Sound",key:"dust",label:"dust grains",min:0,max:2,step:.01,value:1},{group:"Sound",key:"breath",label:"breath",min:0,max:2,step:.01,value:1}],_o=typeof matchMedia=="function"&&matchMedia("(pointer: coarse)").matches,Z=Object.fromEntries(le.map(o=>[o.key,o.key==="lowCut"&&_o?110:o.value])),ce="cenotaph.tune",Ue=(o,e)=>{try{const t=localStorage.getItem(o);return t==null?e:JSON.parse(t)}catch{return e}},He=(o,e)=>{try{localStorage.setItem(o,JSON.stringify(e))}catch{}},mt=o=>Object.fromEntries(le.map(e=>[e.key,Number.isFinite(o==null?void 0:o[e.key])?o[e.key]:Z[e.key]])),T={...Z},k={view:"mine",ref:"published",split:.5};let Q={};function Ee(){return k.ref!=="published"&&Q[k.ref]?Q[k.ref]:Z}const Re=(o,e)=>{const t=Math.max(0,Math.min(4,Math.ceil(-Math.log10(o.step))));return(+e).toFixed(t)},Oo=o=>le.filter(e=>o[e.key]!==Z[e.key]).map(e=>`${e.key}=${Re(e,o[e.key])}`).join(" ");function Co(o){const e={};for(const[,t,s]of o.matchAll(/([A-Za-z]+)\s*[=:]\s*(-?[\d.]+)/g))t in Z&&Number.isFinite(+s)&&(e[t]=+s);return e}const vt=o=>String(o).replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e]);function Fo(){Object.assign(T,mt(Ue(ce,{}))),Q=Object.fromEntries(Object.entries(Ue(ce+".presets",{})).map(([m,v])=>[m,mt(v)])),Object.assign(k,Ue(ce+".compare",{})),k.ref!=="published"&&!Q[k.ref]&&(k.ref="published"),["mine","split","ref"].includes(k.view)||(k.view="mine"),k.split=Math.min(.95,Math.max(.05,+k.split||.5));const o=()=>He(ce,T),e=()=>He(ce+".compare",k),t=()=>He(ce+".presets",Q),s=document.createElement("div");s.id="tune",s.className="tune-ui",s.innerHTML=`
    <button type="button" class="head" aria-expanded="true">tune <span class="caret">▾</span></button>
    <div class="body">
      <div class="compare">
        <div class="seg" role="group" aria-label="What the screen shows">
          <button type="button" data-view="mine" title="your values">Mine</button>
          <button type="button" data-view="split" title="the reference on the left, yours on the right">Split</button>
          <button type="button" data-view="ref" title="the reference (C flips)">Ref</button>
        </div>
        <label class="pick">vs <select id="tune-ref" aria-label="Reference"></select></label>
      </div>
      <div class="presets">
        <input id="tune-name" type="text" placeholder="preset name" aria-label="Preset name" maxlength="24" autocomplete="off" spellcheck="false">
        <button type="button" data-act="save" title="save your values under this name">Save</button>
        <button type="button" data-act="load" title="load the reference preset into your values">Load</button>
        <button type="button" data-act="delete" title="delete the reference preset">Delete</button>
      </div>
      <div class="groups"></div>
      <div class="actions">
        <button type="button" data-act="random" title="roll new values for the open groups (all but Sound if none is open)">Random</button>
        <button type="button" data-act="undo" title="take back the last Random, Reset, Load or paste" disabled>Undo</button>
        <button type="button" data-act="copy" title="copy your changed values as one line">Copy</button>
        <button type="button" data-act="reset" title="put every value back to the published one">Reset</button>
      </div>
      <div class="actions">
        <input id="tune-paste" type="text" placeholder="paste a copied line here" aria-label="Paste values" autocomplete="off" spellcheck="false">
      </div>
      <div class="note" aria-live="polite"></div>
    </div>`;const n=s.querySelector(".groups"),l=s.querySelector(".note"),c=m=>l.textContent=m,r=new Map,a=document.createElement("div");a.id="tune-split",a.className="tune-ui",a.innerHTML='<span class="label left"></span><span class="grip" aria-hidden="true"></span><span class="label right">mine</span>';const u=document.createElement("div");u.id="tune-badge",u.className="tune-ui";function f(){for(const[m,v]of r){const y=le.find(P=>P.key===m);v.input.value=T[m],v.out.textContent=Re(y,T[m]),v.row.classList.toggle("changed",T[m]!==Z[m]);const S=Ee()[m];v.ref.textContent=k.view!=="mine"&&S!==T[m]?Re(y,S):""}}function i(){for(const y of s.querySelectorAll("[data-view]"))y.setAttribute("aria-pressed",String(y.dataset.view===k.view));const m=s.querySelector("#tune-ref");m.innerHTML=["published",...Object.keys(Q)].map(y=>`<option value="${vt(y)}">${vt(y)}</option>`).join(""),m.value=k.ref;const v=k.ref==="published"?"published":k.ref;a.hidden=k.view!=="split",a.style.left=`${k.split*100}%`,a.querySelector(".left").textContent=v,u.hidden=k.view!=="ref",u.textContent=`showing ${v} · C flips back`,s.querySelector('[data-act="load"]').disabled=k.ref==="published",s.querySelector('[data-act="delete"]').disabled=k.ref==="published",f(),e()}for(const m of[...new Set(le.map(v=>v.group))]){const v=document.createElement("details");v.open=m==="Floor"||m==="Dust",v.innerHTML=`<summary>${m}</summary>`;for(const y of le.filter(S=>S.group===m)){const S=document.createElement("label");S.className="row",S.innerHTML=`<span class="name">${y.label}</span><input type="range" id="tune-${y.key}" min="${y.min}" max="${y.max}" step="${y.step}"><output></output><span class="ref"></span>`;const P=S.querySelector("input"),C=S.querySelector("output"),U=S.querySelector(".ref");P.addEventListener("input",()=>{T[y.key]=+P.value,k.view==="ref"&&(k.view="mine",i()),C.textContent=Re(y,T[y.key]),S.classList.toggle("changed",T[y.key]!==Z[y.key]);const G=Ee()[y.key];U.textContent=k.view!=="mine"&&G!==T[y.key]?Re(y,G):"",o()}),P.addEventListener("dblclick",G=>{G.stopPropagation(),P.value=Z[y.key],P.dispatchEvent(new Event("input"))}),r.set(y.key,{input:P,out:C,row:S,ref:U}),v.appendChild(S)}n.appendChild(v)}let h=Ue(ce+".open",!0)!==!1;const p=s.querySelector(".head"),d=m=>{h=m,s.classList.toggle("closed",!h),p.setAttribute("aria-expanded",String(h)),He(ce+".open",h)};d(h),p.addEventListener("click",()=>d(!h));const x=m=>{k.view=m,i()};for(const m of s.querySelectorAll("[data-view]"))m.addEventListener("click",()=>x(m.dataset.view));s.querySelector("#tune-ref").addEventListener("change",m=>{k.ref=m.target.value,i()});const R=s.querySelector("#tune-name"),g=()=>{const m=R.value.trim()||`preset ${Object.keys(Q).length+1}`;if(m==="published")return c('"published" is taken');Q[m]={...T},t(),k.ref=m,R.value="",i(),c(`Saved "${m}"`)};s.querySelector('[data-act="save"]').addEventListener("click",g),R.addEventListener("keydown",m=>{m.key==="Enter"&&g()});let b=null;const M=s.querySelector('[data-act="undo"]'),w=()=>{b={...T},M.disabled=!1};M.addEventListener("click",()=>{b&&(Object.assign(T,b),b=null,M.disabled=!0,o(),f(),c("Undone"))}),s.querySelector('[data-act="random"]').addEventListener("click",()=>{let m=[...n.querySelectorAll("details[open] summary")].map(v=>v.textContent);m.length||(m=[...new Set(le.map(v=>v.group))].filter(v=>v!=="Sound")),w();for(const v of le.filter(y=>m.includes(y.group))){const y=Z[v.key];let S;if(v.key==="palette")S=Math.floor(Math.random()*(v.max-v.min+1))+v.min;else{const P=Math.random()*2-1,C=Math.pow(Math.abs(P),1.6);S=P>0?y+C*(v.max-y):y-C*(y-v.min),S=Math.min(v.max,Math.max(v.min,Math.round(S/v.step)*v.step))}T[v.key]=+S.toFixed(6)}T.dustHi<T.dustLo+.05&&(T.dustHi=Math.min(1,T.dustLo+.05)),T.roughHi<T.roughLo&&(T.roughHi=T.roughLo),o(),f(),c(`Rolled ${m.join(", ")}`)}),s.querySelector('[data-act="load"]').addEventListener("click",()=>{k.ref!=="published"&&(w(),Object.assign(T,Q[k.ref]),o(),f(),c(`Loaded "${k.ref}"`))}),s.querySelector('[data-act="delete"]').addEventListener("click",()=>{if(k.ref==="published")return;const m=k.ref;delete Q[m],t(),k.ref="published",i(),c(`Deleted "${m}"`)}),s.querySelector('[data-act="copy"]').addEventListener("click",()=>{var v;const m=Oo(T)||"(all published values)";c(m),(v=navigator.clipboard)==null||v.writeText(m).then(()=>c("Copied: "+m),()=>{})}),s.querySelector('[data-act="reset"]').addEventListener("click",()=>{w(),Object.assign(T,Z),o(),f(),c("Reset to the published values")});const A=s.querySelector("#tune-paste");return A.addEventListener("change",()=>{const m=Co(A.value),v=Object.keys(m).length;if(!v)return c("No values found in that line");w(),Object.assign(T,Z,m),o(),f(),A.value="",c(`Applied ${v} value${v===1?"":"s"}`)}),a.addEventListener("pointerdown",m=>{m.preventDefault(),a.setPointerCapture(m.pointerId);const v=S=>{k.split=Math.min(.95,Math.max(.05,S.clientX/innerWidth)),a.style.left=`${k.split*100}%`},y=()=>{a.removeEventListener("pointermove",v),a.removeEventListener("pointerup",y),a.removeEventListener("pointercancel",y),e()};a.addEventListener("pointermove",v),a.addEventListener("pointerup",y),a.addEventListener("pointercancel",y)}),addEventListener("keydown",m=>{var v,y;m.code!=="KeyC"||m.repeat||m.metaKey||m.ctrlKey||m.altKey||(y=(v=m.target).closest)!=null&&y.call(v,"input, select")||x(k.view==="ref"?"mine":"ref")}),document.body.append(a,u,s),i(),s}const ve=document.getElementById("view"),Do=document.getElementById("reset"),Bo=document.getElementById("sound"),Io=matchMedia("(prefers-reduced-motion: reduce)").matches,Uo=["t","still","cookie","pose","roll","twist","yaw","tilt","reach","sdf8","rung","govern","x","y","z","vyaw","vpitch","nodust","exp","fov","layers","adaptlog","adaptkey","debug"];function _t(o){const e=decodeURIComponent(o.slice(1)),t=/[=&]/.test(e)?e:e.split("~").map(s=>s.replace("_","=")).join("&");return[...new URLSearchParams(t)].filter(([s])=>Uo.includes(s))}const F=new URLSearchParams(location.search);for(const[o,e]of _t(location.hash))F.set(o,e);const Ot=o=>JSON.stringify(_t(o).sort()),Ho=Ot(location.hash);addEventListener("hashchange",()=>{Ot(location.hash)!==Ho&&location.reload()});const z=(o,e)=>F.has(o)?+F.get(o):e;let Ge;try{Ge=new fo(ve,{force8:F.has("sdf8")})}catch(o){console.error(o),document.body.classList.add("nogl")}const ze=new wo,J=new Lt,H=new Eo(Number(F.get("t"))||0);F.has("debug")&&Fo();const Y=new Po({tune:T,layers:F.has("layers")?F.get("layers").split(/[,.]/).filter(o=>et.includes(o)):et}),ae=new Lt;ae.w=ae.h=ne;ae.fov=.1;ae.update();{const o=ne*Yt/O.HOLE_SPAN;ae.pos=[0,0,ae.pxPerUnit/o],ae.target=[0,0,0],ae.update()}const we=[{sun:[.69,.75,.92],sky:[.27,.35,.54],fog:[.015,.017,.024]},{sun:[1,.96,.9],sky:[.46,.6,.86],fog:[.02,.022,.026]},{sun:[1,.8,.58],sky:[.5,.6,.74],fog:[.02,.021,.024]},{sun:[1,.6,.44],sky:[.66,.5,.6],fog:[.024,.019,.022]},{sun:[.62,.74,1],sky:[.22,.3,.5],fog:[.014,.017,.024]}],zo=95;function Ct(o,e){const t=e.palette>=0?Math.min(we.length-1,e.palette|0):o/zo%we.length,s=Math.floor(t);let n=Math.max(0,(t-s-.6)/.4);n=n*n*(3-2*n);const l=we[s],c=we[(s+1)%we.length],r=(a,u)=>l[a].map((f,i)=>(f+(c[a][i]-f)*n)*u);return{sun:r("sun",e.sun),sky:r("sky",e.sun*e.sky),fog:r("fog",e.sun*e.glow)}}function xt(o){const e=.28+.035*Math.sin(o/83+1),t=-.52+.03*Math.sin(o/67);return pe([e,1,t])}const q={x:z("x",-10),y:z("y",3.2),z:z("z",30),yaw:.22,pitch:.27},L={pos:ke([q.x,q.y,q.z]),yaw:z("vyaw",0),pitch:z("vpitch",0)};L.tpos=L.pos.slice();L.tyaw=L.yaw;L.tpitch=L.pitch;const gt=1.35,ee={x:0,y:0,sx:0,sy:0},N=new Map,te=new Set;let he=!1,ge=null,$e=!1,yt=0;function Te(){document.body.classList.remove("idle"),clearTimeout(yt),yt=setTimeout(()=>document.body.classList.add("idle"),2600)}function Ft(){H.holding=!0,!Y.started&&!Y.muted&&Dt()}function ye(){H.holding=$e}function Dt(){Y.start().then(()=>document.body.classList.add("sounding")).catch(o=>console.warn("no sound:",o))}const Bt=o=>Math.max(-gt,Math.min(gt,o));function qo(){const o=q.yaw+L.tyaw;return[Math.sin(o),0,-Math.cos(o)]}function xe(o,e){L.tyaw-=o*.0035,L.tpitch=Bt(q.pitch+L.tpitch+e*.0035)-q.pitch,nt()}function Se(o,e=0){const t=qo(),s=[-t[2],0,t[0]],n=t[0]*o+s[0]*e,l=t[2]*o+s[2]*e,c=Math.max(1,Math.ceil(Math.hypot(n,l)/.5));let r=L.tpos;for(let a=0;a<c;a++)r=ke([r[0]+n/c,r[1],r[2]+l/c]);L.tpos=r,nt()}function It(){L.tyaw=0,L.tpitch=0,L.tpos=ke([q.x,q.y,q.z]),L.yaw=Math.atan2(Math.sin(L.yaw),Math.cos(L.yaw)),nt()}function nt(){const o=Math.hypot(L.tpos[0]-q.x,L.tpos[1]-q.y,L.tpos[2]-q.z),e=Math.abs(Math.atan2(Math.sin(L.tyaw),Math.cos(L.tyaw)))>.03||Math.abs(L.tpitch)>.03||o>.5;document.body.classList.toggle("moved",e)}const We=o=>{var e,t;return(t=(e=o.target).closest)==null?void 0:t.call(e,"button, .tune-ui")};addEventListener("pointerdown",o=>{if(!We(o)){Te();try{ve.setPointerCapture(o.pointerId)}catch{}N.set(o.pointerId,{x:o.clientX,y:o.clientY,x0:o.clientX,y0:o.clientY}),N.size===1?(he=!1,Ft()):(Ut(),he=!0,ye())}});function Ut(){if(N.size===2){const[o,e]=[...N.values()];ge={d:Math.hypot(o.x-e.x,o.y-e.y)||1}}else ge=null}addEventListener("pointermove",o=>{Te(),o.pointerType==="mouse"&&N.size===0&&(ee.x=o.clientX/innerWidth*2-1,ee.y=o.clientY/innerHeight*2-1);const e=N.get(o.pointerId);if(!e)return;const t=o.clientX-e.x,s=o.clientY-e.y;if(e.x=o.clientX,e.y=o.clientY,N.size===1)!he&&Math.hypot(e.x-e.x0,e.y-e.y0)>6&&(he=!0,ye()),he&&xe(t,s);else if(N.size===2&&ge){const[n,l]=[...N.values()],c=Math.hypot(n.x-l.x,n.y-l.y)||1;Se((c-ge.d)*.12),ge.d=c,xe(t/2,s/2)}});function Ht(o){N.delete(o.pointerId),Ut(),N.size===0&&(he=!1,ye())}addEventListener("pointerup",Ht);addEventListener("pointercancel",Ht);addEventListener("blur",()=>{N.clear(),te.clear(),ge=null,he=!1,$e=!1,ye()});addEventListener("wheel",o=>{if(We(o))return;o.preventDefault(),Te();const e=o.deltaMode===1?o.deltaY*16:o.deltaMode===2?o.deltaY*innerHeight:o.deltaY;Se(-Math.max(-240,Math.min(240,e))*.03)},{passive:!1});const No=["KeyW","KeyA","KeyS","KeyD"];addEventListener("keydown",o=>{if(Te(),We(o)&&/^(INPUT|SELECT)$/.test(o.target.tagName))return;if(o.metaKey||o.ctrlKey||o.altKey){te.clear();return}const e=o.key;if(e==="ArrowLeft")xe(28,0);else if(e==="ArrowRight")xe(-28,0);else if(e==="ArrowUp")xe(0,28);else if(e==="ArrowDown")xe(0,-28);else if(e==="+"||e==="=")Se(3);else if(e==="-"||e==="_")Se(-3);else if(No.includes(o.code))te.add(o.code);else{if(o.repeat)return;if(o.code==="Space")$e=!0,Ft();else if(o.code==="KeyM")qt();else if(o.code==="KeyF")zt();else if(o.code==="KeyR"||e==="0")It();else return}o.preventDefault()});addEventListener("keyup",o=>{te.delete(o.code),o.key==="Meta"&&te.clear(),o.code==="Space"&&($e=!1,(N.size===0||he)&&ye())});addEventListener("dblclick",o=>{We(o)||zt()});addEventListener("contextmenu",o=>o.preventDefault());function zt(){var o,e,t;document.fullscreenElement?(o=document.exitFullscreen)==null||o.call(document):(t=(e=document.documentElement).requestFullscreen)==null||t.call(e).catch(()=>{})}function qt(){if(!Y.started){Y.muted=!1,Dt();return}Y.setMuted(!Y.muted),document.body.classList.toggle("sounding",!Y.muted)}Bo.addEventListener("click",o=>{o.stopPropagation(),qt()});Do.addEventListener("click",o=>{o.stopPropagation(),It()});const ie=[[.4,16,6],[.5,20,8],[.6,24,10],[.7,28,12],[.85,32,12],[1,36,14],[1,48,18],[1.25,48,18],[1.5,56,20],[2,64,24]],Go=83e5,at=12e3,Xe=navigator.webdriver,E={rung:F.has("rung")?Math.max(0,Math.min(ie.length-1,+F.get("rung")|0)):Xe?6:4,ceiling:ie.length-1,climbUntil:performance.now()+at,refresh:1/0,slowStreak:0,samples:[],quietUntil:performance.now()+2500,windowStart:0},jo=F.has("govern")||!F.has("rung")&&!Xe;let Nt=performance.now(),Me=0,Ae=performance.now(),bt=!1;function tt(o){const e=Math.sqrt(Go/Math.max(1,innerWidth*innerHeight));return Math.min(ie[o][0],e)}const Xo=o=>o+1<ie.length&&(tt(o+1)>tt(o)+1e-6||ie[o+1][1]>ie[o][1]);function Vo(){const o=tt(E.rung),e=Math.max(2,Math.round(innerWidth*o)),t=Math.max(2,Math.round(innerHeight*o));return(ve.width!==e||ve.height!==t)&&(ve.width=e,ve.height=t),[e,t,o]}function wt(o,e){o=Math.max(0,Math.min(ie.length-1,o)),o!==E.rung&&(E.rung=o,E.slowStreak=0,it(e))}function it(o,e=700){E.samples=[],E.quietUntil=o+e}function $o(o,e){if(e<E.quietUntil)return;E.samples.length===0&&(E.windowStart=e),E.samples.push(o);const t=E.samples.length;if(t<45&&!(t>=6&&e-E.windowStart>1500))return;const s=E.samples.slice().sort((a,u)=>a-u);E.samples=[];const n=s[t>>1],l=s[Math.floor(t*.9)];if(E.refresh=Math.max(4,Math.min(E.refresh,s[Math.floor(t*.1)])),E.rung>0&&(n>Math.max(19.5,E.refresh*1.25)||n>40)){const a=n>Math.max(34,E.refresh*2.2)||n>66;E.slowStreak++,(a||E.slowStreak>=2)&&(wt(E.rung-(a?2:1),e),E.ceiling=Math.min(E.ceiling,E.rung));return}E.slowStreak=0,n<E.refresh*1.08&&l<E.refresh*1.4&&n<22&&e<E.climbUntil&&E.rung<E.ceiling&&Xo(E.rung)&&wt(E.rung+1,e)}function Rt(o,e){let t=1,s=0;for(;o>0;)t/=e,s+=t*(o%e),o=Math.floor(o/e);return s}const Mt=Array.from({length:16},(o,e)=>[Rt(e+1,2)-.5,Rt(e+1,3)-.5]);function Ke(o,e,t,s){return{tune:o,palette:Ct(s,o),exposure:z("exp",o.exposure)*(1+.2*H.swell),x0:e,x1:t}}function Wo(o){return k.view==="split"?[Ke(Ee(),0,k.split,o),Ke(T,k.split,1,o)]:[Ke(k.view==="ref"?Ee():T,0,1,o)]}let kt=null,Et=1;const Zo=118,Yo=z("adaptkey",-3.8);let qe=0;function Gt(o){const e=o-Ae;Ae=o;const t=Math.min(.1,e/1e3);jo&&$o(e,o),Me++,Ko(t),requestAnimationFrame(Gt)}function Ko(o){if(H.tick(F.has("still")?0:o,Io),Y.tune=k.view==="ref"?Ee():T,Y.update(H,Et),!Ge)return;const[e,t,s]=Vo();Ge.resize(e,t,s)&&(qe=0);const n=H.wall,[,l,c]=ie[E.rung];if(te.size){const _=9*o;Se((te.has("KeyW")?_:0)-(te.has("KeyS")?_:0),(te.has("KeyD")?_:0)-(te.has("KeyA")?_:0))}ee.sx+=(ee.x-ee.sx)*Math.min(1,o*1.5),ee.sy+=(ee.y-ee.sy)*Math.min(1,o*1.5);const r=1-Math.exp(-o/.14);L.yaw+=(L.tyaw-L.yaw)*r,L.pitch+=(L.tpitch-L.pitch)*r;const a=1-Math.exp(-o/.45);L.pos=ke(L.pos.map((_,de)=>_+(L.tpos[de]-_)*a));const u=e/t,f=Math.min(Math.tan(.475)*1.6/u,Math.tan(.75)),i=z("fov",2*Math.atan(Math.max(Math.tan(.475),f))),h=q.yaw+L.yaw+.035*Math.sin(n/47)+ee.sx*.03,p=Bt(q.pitch+L.pitch+.02*Math.sin(n/61+1)-ee.sy*.02+.03*H.hold),d=[.5*Math.sin(n/97),.25*Math.sin(n/71+2),.4*Math.sin(n/89+4)],x=ke([L.pos[0]+d[0],L.pos[1]+d[1],L.pos[2]+d[2]]),R=[Math.sin(h)*Math.cos(p),Math.sin(p),-Math.cos(h)*Math.cos(p)];J.w=e,J.h=t,J.fov=i,J.pos=x,J.target=[x[0]+R[0],x[1]+R[1],x[2]+R[2]],J.update();{const _=xt(n),de=[O.HOLE_X-_[0]/_[1]*O.H*.5,O.H*.5,O.HOLE_Z-_[2]/_[1]*O.H*.5],[_e,Oe,Ce]=J.project(de),Fe=J.toCam(de),$t=Math.max(Math.abs(_e/e-.5),Math.abs(Oe/t-.5));Et=Fe[2]<0?Math.max(0,Math.min(1,(.9-$t)/.4))*Math.min(1,40/Ce):0}const g=H.story+Zo,b=z("roll",1.72+.36*Math.sin(g/31)+.12*Math.sin(g/13+1)),M=z("twist",1+g*Math.PI*2/75+.45*Math.sin(g/17)),w=z("yaw",.25*Math.sin(g/21+.5)),A=z("tilt",-.2+.2*Math.sin(g/17+2)),m=W(Je(w),W(St(A),W(At(b),Je(M)))),v=.35+.6*Math.min(2,Math.max(0,H.blur));ze.pose(g,{wind:v,reach:z("reach",H.reach),wall:n,orient:m,preset:F.get("pose")}),ze.project(ae);const y=-.22+.14*Math.sin(g/89+.7),S=O.HOLE_SPAN/ne,P=xt(n);let C=1e9,U=1e9,G=-1e9,ue=-1e9;for(const _ of ze.groups)C=Math.min(C,_.cx-_.r),U=Math.min(U,_.cy-_.r),G=Math.max(G,_.cx+_.r),ue=Math.max(ue,_.cy+_.r);const fe=Math.cos(y),j=Math.sin(y),D=[1e9,1e9,-1e9,-1e9];for(const[_,de]of[[C,U],[G,U],[C,ue],[G,ue]]){const _e=(Math.max(0,Math.min(ne,_))/ne-.5)*O.HOLE_SPAN,Oe=(Math.max(0,Math.min(ne,de))/ne-.5)*O.HOLE_SPAN,Ce=O.HOLE_X+fe*_e-j*Oe,Fe=O.HOLE_Z+j*_e+fe*Oe;D[0]=Math.min(D[0],Ce),D[1]=Math.min(D[1],Fe),D[2]=Math.max(D[2],Ce),D[3]=Math.max(D[3],Fe)}const Pe=.8,Xt=[D[0]-Pe,D[1]-Pe,D[2]+Pe,D[3]+Pe],rt=J.viewProj(),Vt=Math.max(1/(qe+1),Xe||F.has("still")?.06:.12),Ze=F.has("t")?1:Math.min(1,(performance.now()-Nt)/5e3);Ge.render({figure:ze,cam:J,prevViewProj:kt??rt,histValid:qe>0,blend:Vt,jitter:Mt[Me%Mt.length],frame:Me,steps:l,reflSteps:c,sun:P,cookieRot:y,cookieM:S,beamBox:Xt,story:g,wall:n,drift:H.fall*.0021%1,dustFall:H.fall*.05,shutter:.04*Math.max(.12,H.blur),focus:45,dust:!F.has("nodust"),exposure:z("exp",T.exposure)*(1+.2*H.swell),tune:T,palette:Ct(n,T),sides:Wo(n),fade:Ze*Ze,dt:o,adaptKey:Yo,logAdapt:F.has("adaptlog")&&Me%4===0,pr:s,debug:F.has("cookie")}),kt=rt,qe++,!bt&&Ze>=1&&Me>(Xe?14:8)&&(bt=!0,document.body.classList.add("ready"))}addEventListener("resize",()=>{const o=performance.now();it(o),E.ceiling=ie.length-1,E.climbUntil=o+at,E.slowStreak=0});document.addEventListener("visibilitychange",()=>{Ae=performance.now(),it(Ae,1500),document.hidden&&ye(),Y.setHidden(document.hidden)});Te();const Ne=[];function jt(o){if(Ne.push(o),Ne.length<18){requestAnimationFrame(jt);return}const e=Ne.slice(1).map((t,s)=>t-Ne[s]).sort((t,s)=>t-s);E.refresh=Math.max(4,e[e.length>>1]),Ae=o,Nt=o,E.quietUntil=o+2500,E.climbUntil=o+at,requestAnimationFrame(Gt)}requestAnimationFrame(jt);
