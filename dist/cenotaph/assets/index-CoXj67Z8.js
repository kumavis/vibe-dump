(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const l of n)if(l.type==="childList")for(const c of l.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&s(c)}).observe(document,{childList:!0,subtree:!0});function e(n){const l={};return n.integrity&&(l.integrity=n.integrity),n.referrerPolicy&&(l.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?l.credentials="include":n.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function s(n){if(n.ep)return;n.ep=!0;const l=e(n);fetch(n.href,l)}})();function so(o){const t=o.getContext("webgl2",{antialias:!1,alpha:!1,depth:!1,stencil:!1,premultipliedAlpha:!1,preserveDrawingBuffer:!1,powerPreference:"high-performance"});if(!t)return null;const e=!!(t.getExtension("EXT_color_buffer_float")||t.getExtension("EXT_color_buffer_half_float"));return t.getExtension("OES_texture_float_linear"),{gl:t,floatOk:e}}function xe(o,t,e){const s=o.createShader(t);if(o.shaderSource(s,e),o.compileShader(s),!o.getShaderParameter(s,o.COMPILE_STATUS)){const n=o.getShaderInfoLog(s),l=e.split(`
`).map((c,r)=>`${String(r+1).padStart(3)} ${c}`).join(`
`);throw new Error(`shader compile failed:
${n}
${l}`)}return s}function tt(o,t,e,s=""){if(s){const r=e.indexOf(`
`);e=e.slice(0,r+1)+s+e.slice(r+1)}const n=o.createProgram();if(o.attachShader(n,xe(o,o.VERTEX_SHADER,t)),o.attachShader(n,xe(o,o.FRAGMENT_SHADER,e)),o.linkProgram(n),!o.getProgramParameter(n,o.LINK_STATUS))throw new Error(`link failed: ${o.getProgramInfoLog(n)}`);const l={},c=o.getProgramParameter(n,o.ACTIVE_UNIFORMS);for(let r=0;r<c;r++){const a=o.getActiveUniform(n,r),u=a.name.replace(/\[0\]$/,"");l[u]=o.getUniformLocation(n,a.name)}return{p:n,u:l}}function j(o,t,e,{float:s=!0,linear:n=!0,channels:l=4}={}){const c=o.createTexture();o.bindTexture(o.TEXTURE_2D,c);let r,a,u;s?(r=l===2?o.RG16F:o.RGBA16F,a=l===2?o.RG:o.RGBA,u=o.HALF_FLOAT):(r=o.RGBA8,a=o.RGBA,u=o.UNSIGNED_BYTE),o.texImage2D(o.TEXTURE_2D,0,r,t,e,0,a,u,null);const f=n?o.LINEAR:o.NEAREST;o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,f),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,f),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_S,o.CLAMP_TO_EDGE),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_T,o.CLAMP_TO_EDGE);const i=o.createFramebuffer();o.bindFramebuffer(o.FRAMEBUFFER,i),o.framebufferTexture2D(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,c,0);const h=o.checkFramebufferStatus(o.FRAMEBUFFER)===o.FRAMEBUFFER_COMPLETE;return o.bindFramebuffer(o.FRAMEBUFFER,null),{tex:c,fbo:i,w:t,h:e,ok:h}}function ge(o,t){t&&(o.deleteTexture(t.tex),o.deleteFramebuffer(t.fbo))}function X(o,t){t?(o.bindFramebuffer(o.FRAMEBUFFER,t.fbo),o.viewport(0,0,t.w,t.h)):(o.bindFramebuffer(o.FRAMEBUFFER,null),o.viewport(0,0,o.drawingBufferWidth,o.drawingBufferHeight))}function D(o,t,e,s){o.activeTexture(o.TEXTURE0+t),o.bindTexture(o.TEXTURE_2D,e),s&&o.uniform1i(s,t)}function no(o){const t=o.createVertexArray();return()=>{o.bindVertexArray(t),o.drawArrays(o.TRIANGLES,0,3)}}const O={HALF_W:46,Z0:-128,Z1:72,H:30,SLAB:1.1,PIER_X:27,PIER_HALF:1.8,PIER_Z0:-119,PIER_DZ:19,PIER_N:10,HOLE_X:4,HOLE_Z:-16,HOLE_SPAN:26},ao=9;function io(){return Object.entries(O).map(([o,t])=>Number.isInteger(t)&&o.endsWith("_N")?`#define ROOM_${o} ${t}
`:`#define ROOM_${o} ${t.toFixed(4)}
`).join("")}const ro=.9;function Mt(o){const t=O,e=ro;let[s,n,l]=o;s=Math.max(-46+e,Math.min(t.HALF_W-e,s)),l=Math.max(t.Z0+e,Math.min(t.Z1-e,l)),n=Math.max(.6,Math.min(t.H-1.5,n));for(const c of[-27,t.PIER_X]){const r=Math.round((l-t.PIER_Z0)/t.PIER_DZ);if(r<0||r>=t.PIER_N)continue;const a=t.PIER_Z0+r*t.PIER_DZ,u=t.PIER_HALF+e,f=s-c,i=l-a;Math.abs(f)<u&&Math.abs(i)<u&&(u-Math.abs(f)<u-Math.abs(i)?s=c+Math.sign(f||1)*u:l=a+Math.sign(i||1)*u)}return s=Math.max(-46+e,Math.min(t.HALF_W-e,s)),l=Math.max(t.Z0+e,Math.min(t.Z1-e,l)),[s,n,l]}function $(o,t){const e=new Array(9);for(let s=0;s<3;s++)for(let n=0;n<3;n++)e[s*3+n]=o[s*3]*t[n]+o[s*3+1]*t[3+n]+o[s*3+2]*t[6+n];return e}function V(o,t){return[o[0]*t[0]+o[1]*t[1]+o[2]*t[2],o[3]*t[0]+o[4]*t[1]+o[5]*t[2],o[6]*t[0]+o[7]*t[1]+o[8]*t[2]]}const Be=o=>{const t=Math.cos(o),e=Math.sin(o);return[1,0,0,0,t,-e,0,e,t]},se=o=>{const t=Math.cos(o),e=Math.sin(o);return[t,0,e,0,1,0,-e,0,t]},Ie=o=>{const t=Math.cos(o),e=Math.sin(o);return[t,-e,0,e,t,0,0,0,1]},It=(o,t,e)=>$(Ie(e),$(Be(o),se(t))),B=(o,t)=>[o[0]+t[0],o[1]+t[1],o[2]+t[2]],ne=(o,t)=>[o[0]-t[0],o[1]-t[1],o[2]-t[2]],et=(o,t)=>[o[0]*t,o[1]*t,o[2]*t],co=o=>Math.hypot(o[0],o[1],o[2]),dt=o=>{const t=co(o)||1;return[o[0]/t,o[1]/t,o[2]/t]},$t=(o,t)=>[o[1]*t[2]-o[2]*t[1],o[2]*t[0]-o[0]*t[2],o[0]*t[1]-o[1]*t[0]];class Ue{constructor(){this.pos=[0,0,5],this.target=[0,0,0],this.fov=.6,this.w=1,this.h=1,this.near=.05,this.update()}update(){const t=dt(ne(this.target,this.pos)),e=dt($t(t,[0,1,0])),s=$t(e,t);this.R=[e[0],e[1],e[2],s[0],s[1],s[2],-t[0],-t[1],-t[2]],this.focal=1/Math.tan(this.fov/2),this.pxPerUnit=this.focal*this.h/2}forward(){return[-this.R[6],-this.R[7],-this.R[8]]}toCam(t){return V(this.R,ne(t,this.pos))}project(t){const e=this.toCam(t),s=Math.max(-e[2],this.near),n=this.pxPerUnit/s;return[this.w/2+e[0]*n,this.h/2+e[1]*n,s]}viewProj(){const t=this.R,e=this.pos,s=[-(t[0]*e[0]+t[1]*e[1]+t[2]*e[2]),-(t[3]*e[0]+t[4]*e[1]+t[5]*e[2]),-(t[6]*e[0]+t[7]*e[1]+t[8]*e[2])],n=this.w/this.h,l=this.focal,c=this.near,r=100,a=l/n,u=l,f=(r+c)/(c-r),i=2*r*c/(c-r),h=new Float32Array(16);for(let p=0;p<4;p++){const d=p<3?t[p]:s[0],x=p<3?t[3+p]:s[1],R=p<3?t[6+p]:s[2],b=p<3?0:1;h[p*4+0]=a*d,h[p*4+1]=u*x,h[p*4+2]=f*R+i*b,h[p*4+3]=-R}return h}}const Y=`#version 300 es
precision highp float;
precision highp int;
precision highp sampler3D;
`,Yt=`
float sdfDecode(vec4 v) {
#ifdef SDF8
  float fine = (v.r - 0.5) * 256.0;
  return abs(fine) < 120.0 ? fine : (v.b - 0.5) * 8192.0;
#else
  return v.r;
#endif
}
`,Lt=`
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
`,ce=`
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
`,ct=`${Y}
out vec2 vUv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2)) * 2.0 - 1.0;
  vUv = p * 0.5 + 0.5;
  gl_Position = vec4(p, 0.0, 1.0);
}`,lo=`${Y}
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
}`,ho=`${Y}
${Yt}
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
}`,He=`
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
`,uo=`${Y}
${Yt}
${Lt}
${ce}
${He}
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
}`,fo=`${Y}
${Lt}
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
}`,po=`${Y}
${Yt}
${Lt}
${ce}
${He}
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
}`,mo=`${Y}
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
}`,vo=`${Y}
${Lt}
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
}`,xo=`${Y}
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
}`,go=`${Y}
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
}`,yo=`${Y}
${Yt}
${Lt}
${ce}
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
}`,bo=6,ot=640;function wo(o=64){const t=new Uint8Array(o*o*o*2);let e=9001;const s=()=>(e=e*16807%2147483647)/2147483647,n=f=>{const i=new Float32Array(f*f*f);for(let h=0;h<i.length;h++)i[h]=s();return i},l=f=>f*f*(3-2*f),c=(f,i,h,p,d)=>{const x=h*i/o,R=p*i/o,b=d*i/o,g=Math.floor(x),M=Math.floor(R),w=Math.floor(b),k=l(x-g),m=l(R-M),v=l(b-w),y=(_,F,q)=>f[(q%i+i)%i*i*i+(F%i+i)%i*i+(_%i+i)%i],L=(_,F,q)=>_+(F-_)*q;return L(L(L(y(g,M,w),y(g+1,M,w),k),L(y(g,M+1,w),y(g+1,M+1,w),k),m),L(L(y(g,M,w+1),y(g+1,M,w+1),k),L(y(g,M+1,w+1),y(g+1,M+1,w+1),k),m),v)},r=[[n(4),4,.55],[n(8),8,.3],[n(16),16,.15]],a=[[n(8),8,.6],[n(16),16,.4]];let u=0;for(let f=0;f<o;f++)for(let i=0;i<o;i++)for(let h=0;h<o;h++,u+=2){let p=0,d=0;for(const[x,R,b]of r)p+=c(x,R,h,i,f)*b;for(const[x,R,b]of a)d+=c(x,R,h,i,f)*b;t[u]=Math.round(p*255),t[u+1]=Math.round(d*255)}return{data:t,n:o}}class Ro{constructor(t,{force8:e=!1}={}){const s=so(t);if(!s)throw new Error("webgl2");this.gl=s.gl,this.floatOk=s.floatOk&&!e;const n=this.gl;if(this.floatOk){const u=[j(n,4,4,{float:!0}),j(n,4,4,{float:!0,channels:2})];this.floatOk=u.every(f=>f.ok);for(const f of u)ge(n,f)}this.canvas=t,this.quad=no(n);const l=this.floatOk?"":`#define SDF8
`,c=io();this.pSil=tt(n,ct,lo,l),this.pEmit=tt(n,ct,ho,l),this.pHall=tt(n,ct,uo,l+c),this.pResolve=tt(n,ct,fo,l),this.pDust=tt(n,Mo(po,l+c),mo),this.pDown=tt(n,ct,vo,l),this.pUp=tt(n,ct,xo),this.pFinal=tt(n,ct,yo,l),this.pAdapt=tt(n,ct,go),this.primTex=n.createTexture(),n.bindTexture(n.TEXTURE_2D,this.primTex),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.NEAREST),n.texImage2D(n.TEXTURE_2D,0,n.RGBA32F,400,1,0,n.RGBA,n.FLOAT,null),this.cookie=j(n,ot,ot,{float:this.floatOk,channels:this.floatOk?2:4}),this.emitters=j(n,4,4,{float:!1,linear:!1}),this.emitPBO=n.createBuffer(),n.bindBuffer(n.PIXEL_PACK_BUFFER,this.emitPBO),n.bufferData(n.PIXEL_PACK_BUFFER,64,n.STREAM_READ),n.bindBuffer(n.PIXEL_PACK_BUFFER,null),this.emitBytes=new Uint8Array(64),this.emitFence=null,this.emitRead=!1,this.patches=new Float32Array(64),this.adapt=this.floatOk?[j(n,1,1,{linear:!1}),j(n,1,1,{linear:!1})]:null,this.adaptFlip=0,this.adaptFresh=!0;const{data:r,n:a}=wo(64);this.noise=n.createTexture(),n.bindTexture(n.TEXTURE_3D,this.noise),n.pixelStorei(n.UNPACK_ALIGNMENT,1),n.texImage3D(n.TEXTURE_3D,0,n.RG8,a,a,a,0,n.RG,n.UNSIGNED_BYTE,r),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.texParameteri(n.TEXTURE_3D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_3D,n.TEXTURE_MAG_FILTER,n.LINEAR);for(const u of[n.TEXTURE_WRAP_S,n.TEXTURE_WRAP_T,n.TEXTURE_WRAP_R])n.texParameteri(n.TEXTURE_3D,u,n.REPEAT);n.bindTexture(n.TEXTURE_3D,null),this.initDust(),console.info(`cenotaph: ${this.floatOk?"float":"8-bit"} targets`),this.w=0,this.h=0,this.flip=0}initDust(){const t=this.gl,e=9e3,s=new Float32Array(e*4),n=new Float32Array(e*4);let l=4242;const c=()=>(l=l*16807%2147483647)/2147483647;for(let a=0;a<e;a++){s.set([c(),c(),c(),c()],a*4);const u=.25+c()*.75,f=.004+Math.pow(c(),3)*.02,i=.3+Math.pow(c(),2)*1.7;n.set([u,f,i,0],a*4)}this.dustCount=e,this.vao=t.createVertexArray(),t.bindVertexArray(this.vao);const r=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,r),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),t.STATIC_DRAW),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,2,t.FLOAT,!1,0,0);for(const[a,u]of[[1,s],[2,n]]){const f=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,f),t.bufferData(t.ARRAY_BUFFER,u,t.STATIC_DRAW),t.enableVertexAttribArray(a),t.vertexAttribPointer(a,4,t.FLOAT,!1,0,0),t.vertexAttribDivisor(a,1)}t.bindVertexArray(null)}resize(t,e,s=1){if(t===this.w&&e===this.h&&s===this.pr)return!1;const n=this.gl;this.w=t,this.h=e,this.pr=s;for(const a of[this.cur,this.dust,...this.hist??[],...this.bloom??[]])ge(n,a);const l={float:this.floatOk};this.cur=j(n,t,e,{float:this.floatOk,linear:!1}),this.hist=[j(n,t,e,l),j(n,t,e,l)],this.dust=j(n,t,e,l),this.bloom=[];let c=t/s,r=e/s;for(let a=0;a<bo;a++)c=Math.max(1,Math.ceil(c/2)),r=Math.max(1,Math.ceil(r/2)),this.bloom.push(j(n,c,r,l));return!0}hallUniforms(t,e){const s=this.gl;s.uniform2f(t.uCookieRot,Math.cos(e.cookieRot),Math.sin(e.cookieRot)),s.uniform1f(t.uCookieM,e.cookieM),s.uniform3fv(t.uSun,e.sun),s.uniform2f(t.uSunXZ,e.sun[0]/e.sun[1],e.sun[2]/e.sun[1]),s.uniform3fv(t.uSunColor,e.palette.sun),s.uniform3fv(t.uSkyColor,e.palette.sky),s.uniform3fv(t.uFogColor,e.palette.fog),s.uniform4fv(t.uBeamBox,e.beamBox);const n=e.sun,l=dt($t(n,[0,0,1]));s.uniform3fv(t.uBeamB,l),s.uniform3fv(t.uBeamC,$t(n,l)),s.uniform1f(t.uTime,e.story),s.uniform1f(t.uDrift,e.drift);const c=e.tune;s.uniform3f(t.uFog,c.fogBase,c.fogLow,c.fogHeight),s.uniform4f(t.uDust,c.dustFloor,c.dustAmount,c.dustLo,c.dustHi),s.uniform2f(t.uDustScale,c.dustAcross,c.dustAlong),s.uniform1f(t.uPhaseG,c.phaseG),s.uniform1f(t.uSunSpread,c.spread),s.uniform1f(t.uBounceGain,c.bounce),s.uniform4f(t.uFloor,c.polish,c.roughLo,c.roughHi,c.floorAlbedo)}camUniforms(t,e){const s=this.gl,n=e.R;s.uniform3fv(t.uCamPos,e.pos),s.uniform3f(t.uRight,n[0],n[1],n[2]),s.uniform3f(t.uUp,n[3],n[4],n[5]),s.uniform3f(t.uFwd,-n[6],-n[7],-n[8]),s.uniform1f(t.uFocal,e.focal),s.uniform1f(t.uAspect,this.w/this.h)}emitUniforms(t,e){const s=this.gl,n=this.emitBytes,l=O.HOLE_SPAN,c=Math.cos(e.cookieRot),r=Math.sin(e.cookieRot);let a=0,u=0,f=0,i=0;for(let m=0;m<16;m++){const v=n[m*4]/255*(l/4)**2;if(v<.01)continue;const y=(((m&3)+n[m*4+1]/255)/4-.5)*l,L=(((m>>2)+n[m*4+2]/255)/4-.5)*l,_=O.HOLE_X+c*y-r*L,F=O.HOLE_Z+r*y+c*L;this.patches.set([_,F,v,0],a*4),a++,u+=_*v,f+=F*v,i+=v}const[h,p,d]=e.sun,x=i>0?u/i:O.HOLE_X,R=i>0?f/i:O.HOLE_Z;s.uniform4fv(t.uPatch,this.patches),s.uniform1i(t.uPatchN,a),s.uniform3f(t.uSkyC,x,O.H,R),s.uniform3f(t.uPoolC,x-h/p*O.H,0,R-d/p*O.H),s.uniform1f(t.uArea,i);const b=e.tune,g=O.H,M=b.fogHeight,w=b.fogBase*g/p+b.fogLow*(M/p)*(1-Math.exp(-g/M)),k=p*.24/Math.PI*Math.exp(-w);s.uniform3f(t.uPoolRad,e.palette.sun[0]*k,e.palette.sun[1]*k,e.palette.sun[2]*k)}eachSide(t,e,s,n){var r;const l=this.gl,c=(r=t.sides)!=null&&r.length?t.sides:[{}];if(c.length===1)return n({...t,...c[0]});l.enable(l.SCISSOR_TEST);for(const a of c){const u=Math.round(a.x0*e),f=Math.round(a.x1*e);l.scissor(u,0,f-u,s),n({...t,...a})}l.disable(l.SCISSOR_TEST)}render(t){const e=this.gl,{w:s,h:n}=this,l=t.figure;this.emitFence&&e.clientWaitSync(this.emitFence,0,0)!==e.TIMEOUT_EXPIRED&&(e.deleteSync(this.emitFence),this.emitFence=null,e.bindBuffer(e.PIXEL_PACK_BUFFER,this.emitPBO),e.getBufferSubData(e.PIXEL_PACK_BUFFER,0,this.emitBytes),e.bindBuffer(e.PIXEL_PACK_BUFFER,null)),e.bindTexture(e.TEXTURE_2D,this.primTex),e.texSubImage2D(e.TEXTURE_2D,0,0,0,l.count*2,1,e.RGBA,e.FLOAT,l.data,0),X(e,this.cookie),e.useProgram(this.pSil.p),D(e,0,this.primTex,this.pSil.u.uPrims);const c=new Float32Array(48),r=new Int32Array(24);l.groups.slice(0,12).forEach((d,x)=>{c.set([d.cx,d.cy,d.r,d.k+2],x*4),r.set([d.start,d.count],x*2)}),e.uniform4fv(this.pSil.u.uGroups,c),e.uniform2iv(this.pSil.u.uRanges,r),e.uniform1i(this.pSil.u.uGroupCount,Math.min(12,l.groups.length)),this.quad(),X(e,this.emitters),e.useProgram(this.pEmit.p),D(e,0,this.cookie.tex,this.pEmit.u.uCookie),this.quad(),this.emitRead?this.emitFence||(e.bindBuffer(e.PIXEL_PACK_BUFFER,this.emitPBO),e.readPixels(0,0,4,4,e.RGBA,e.UNSIGNED_BYTE,0),e.bindBuffer(e.PIXEL_PACK_BUFFER,null),this.emitFence=e.fenceSync(e.SYNC_GPU_COMMANDS_COMPLETE,0)):(e.readPixels(0,0,4,4,e.RGBA,e.UNSIGNED_BYTE,this.emitBytes),this.emitRead=!0),X(e,this.cur),e.useProgram(this.pHall.p);let a=this.pHall.u;D(e,0,this.cookie.tex,a.uCookie),e.activeTexture(e.TEXTURE2),e.bindTexture(e.TEXTURE_3D,this.noise),e.uniform1i(a.uNoise,2),this.camUniforms(a,t.cam),e.uniform2f(a.uRes,s,n),e.uniform2f(a.uJitter,t.jitter[0],t.jitter[1]),e.uniform1i(a.uFrame,t.frame),e.uniform1i(a.uSteps,t.steps),e.uniform1i(a.uReflSteps,t.reflSteps),this.eachSide(t,s,n,d=>{this.emitUniforms(a,d),this.hallUniforms(a,d),this.quad()}),e.activeTexture(e.TEXTURE2),e.bindTexture(e.TEXTURE_3D,null);const u=this.hist[this.flip],f=this.hist[1-this.flip];this.flip=1-this.flip,X(e,f),e.useProgram(this.pResolve.p),a=this.pResolve.u,D(e,0,this.cur.tex,a.uCur),D(e,1,u.tex,a.uHist),this.camUniforms(a,t.cam),e.uniform2f(a.uRes,s,n),e.uniformMatrix4fv(a.uPrevViewProj,!1,t.prevViewProj),e.uniform1f(a.uBlend,t.blend),e.uniform1f(a.uValid,t.histValid?1:0),this.quad();const i=f;X(e,this.dust),e.clearColor(0,0,0,1),e.clear(e.COLOR_BUFFER_BIT),e.enable(e.BLEND),e.blendFunc(e.ONE,e.ONE),e.useProgram(this.pDust.p),a=this.pDust.u,D(e,0,this.cookie.tex,a.uCookie),D(e,3,this.cur.tex,a.uScene),e.uniformMatrix4fv(a.uViewProj,!1,t.cam.viewProj()),e.uniform2f(a.uRes,s,n),e.uniform1f(a.uFall,t.dustFall),e.uniform1f(a.uShutter,t.shutter),e.uniform3fv(a.uCamPos,t.cam.pos),e.uniform1f(a.uPxPerUnit,t.cam.pxPerUnit),e.uniform1f(a.uFocus,t.focus),e.bindVertexArray(this.vao),this.eachSide(t,s,n,d=>{this.hallUniforms(a,d),e.uniform1f(a.uMoteGlow,d.tune.moteGlow),e.drawArraysInstanced(e.TRIANGLE_STRIP,0,4,d.dust?Math.round(this.dustCount*d.tune.motes):0)}),e.bindVertexArray(null),e.disable(e.BLEND),e.useProgram(this.pDown.p);let h=i;for(const d of this.bloom){X(e,d),D(e,0,h.tex,this.pDown.u.uSrc);const x=Math.max(1,h.w/d.w/2);e.uniform2f(this.pDown.u.uTexel,x/h.w,x/h.h),e.uniform1i(this.pDown.u.uFirst,h===i?1:0),this.quad(),h=d}let p=null;if(this.adapt){const d=this.adapt[this.adaptFlip],x=this.adapt[1-this.adaptFlip];this.adaptFlip=1-this.adaptFlip,X(e,x),e.useProgram(this.pAdapt.p),D(e,0,this.bloom[this.bloom.length-1].tex,this.pAdapt.u.uSrc),D(e,1,d.tex,this.pAdapt.u.uPrev),e.uniform1f(this.pAdapt.u.uDt,this.adaptFresh?-1:t.dt),this.quad(),this.adaptFresh=!1,p=x}e.useProgram(this.pUp.p),e.enable(e.BLEND),e.blendFunc(e.CONSTANT_COLOR,e.ONE),e.blendColor(.55,.55,.55,1);for(let d=this.bloom.length-1;d>0;d--){const x=this.bloom[d],R=this.bloom[d-1];X(e,R),D(e,0,x.tex,this.pUp.u.uSrc),e.uniform2f(this.pUp.u.uTexel,1/x.w,1/x.h),this.quad()}if(e.disable(e.BLEND),X(e,null),e.useProgram(this.pFinal.p),a=this.pFinal.u,D(e,0,i.tex,a.uScene),D(e,1,this.bloom[0].tex,a.uBloom),D(e,2,this.cookie.tex,a.uCookie),D(e,3,this.dust.tex,a.uDust),D(e,4,(p??this.cookie).tex,a.uAdapt),e.uniform1i(a.uAdaptOn,p?1:0),e.uniform1f(a.uKey,t.adaptKey),e.uniform2f(a.uRes,s,n),e.uniform1f(a.uTime,t.wall),e.uniform1f(a.uFade,t.fade),e.uniform1f(a.uPx,t.pr??1),e.uniform1i(a.uDebug,t.debug?1:0),this.eachSide(t,e.drawingBufferWidth,e.drawingBufferHeight,d=>{e.uniform1f(a.uExposure,d.exposure),e.uniform1f(a.uBloomAmt,d.tune.bloom),e.uniform1f(a.uGrain,d.tune.grain),e.uniform1f(a.uFringe,d.tune.fringe),this.quad()}),t.logAdapt&&p){X(e,p);const d=new Float32Array(4);e.readPixels(0,0,1,1,e.RGBA,e.FLOAT,d),X(e,null),console.info(`cenotaph: adapted log luminance ${d[0].toFixed(3)}`)}}}function Mo(o,t){const e=o.indexOf(`
`);return o.slice(0,e+1)+t+o.slice(e+1)}const Ut=190,qe=[[.023,.044,.04],[.008,.048,.045],[-.0085,.045,.041],[-.023,.035,.031]],xt=[["pelvis",null,[0,0,0]],["spine","pelvis",[0,.1,-.01]],["chest","spine",[0,.17,0]],["neck","chest",[0,.25,-.025]],["head","neck",[0,.1,.012]]];for(const o of["L","R"]){const t=o==="L"?1:-1;xt.push(["clav"+o,"chest",[.02*t,.215,-.01]],["shoulder"+o,"clav"+o,[.155*t,0,-.005]],["elbow"+o,"shoulder"+o,[0,-.29,0]],["wrist"+o,"elbow"+o,[0,-.25,0]],["hip"+o,"pelvis",[.092*t,-.07,0]],["knee"+o,"hip"+o,[0,-.43,0]],["ankle"+o,"knee"+o,[0,-.42,0]]),qe.forEach(([e,s],n)=>{xt.push([`f${n}a${o}`,"wrist"+o,[0,-.092+Math.abs(e)*.18,e]]),xt.push([`f${n}b${o}`,`f${n}a${o}`,[0,-s,0]])}),xt.push(["thumbA"+o,"wrist"+o,[-.006*t,-.022,.03]]),xt.push(["thumbB"+o,"thumbA"+o,[0,-.046,0]])}function ko(){const o=[],t=(s,n,l,c,r,a,u)=>o.push({type:0,j:s,a:n,b:l,ra:c,rb:r,k:a,g:u}),e=(s,n,l,c,r,a)=>o.push({type:1,j:s,c:n,r:l,k:c,g:r,e:a});e("pelvis",[0,0,-.005],[.16,.11,.105],.05,"torso"),e("pelvis",[0,-.06,-.05],[.145,.1,.085],.04,"torso"),e("pelvis",[0,.03,.035],[.13,.09,.07],.04,"torso"),e("spine",[0,.09,-.004],[.122,.19,.086],.05,"torso"),e("chest",[0,.12,-.005],[.148,.16,.102],.05,"torso"),e("chest",[0,.165,.035],[.145,.08,.075],.03,"torso"),e("chest",[0,.17,-.048],[.145,.09,.07],.03,"torso"),t("chest",[-.14,.235,-.02],[.14,.235,-.02],.05,.05,.04,"torso"),t("neck",[0,-.02,0],[0,.11,.012],.05,.044,.03,"torso"),e("head",[0,.1,-.015],[.074,.095,.1],.02,"head"),e("head",[0,.052,.042],[.062,.075,.062],.02,"head"),e("head",[0,.004,.068],[.042,.028,.034],.015,"head"),e("head",[0,.112,.076],[.058,.018,.019],.012,"head"),t("head",[0,.09,.094],[0,.062,.11],.0095,.011,.008,"head"),e("head",[0,.03,.094],[.024,.014,.013],.008,"head"),e("head",[0,.105,-.06],[.082,.092,.082],.02,"head");for(const s of["L","R"]){const n="arm"+s,l="hand"+s,c="leg"+s;e("shoulder"+s,[.004,-.04,0],[.05,.08,.054],.03,n),t("shoulder"+s,[0,0,0],[0,-.29,0],.043,.033,.03,n),e("shoulder"+s,[0,-.15,.01],[.038,.1,.04],.02,n),t("elbow"+s,[0,0,0],[0,-.25,0],.034,.022,.02,n),e("elbow"+s,[0,-.07,0],[.033,.09,.038],.02,n),e("wrist"+s,[0,-.05,0],[.015,.05,.042],.012,l),e("wrist"+s,[-.004,-.036,.024],[.016,.03,.02],.01,l),qe.forEach(([,r,a],u)=>{const f=u===3?.0075:.0088;t(`f${u}a${s}`,[0,0,0],[0,-r,0],f,f*.86,.005,l),t(`f${u}b${s}`,[0,0,0],[0,-a,0],f*.86,f*.62,.004,l)}),t("thumbA"+s,[0,0,0],[0,-.046,0],.012,.0095,.008,l),t("thumbB"+s,[0,0,0],[0,-.034,0],.0095,.007,.004,l),t("hip"+s,[0,0,0],[0,-.43,0],.082,.05,.04,c),e("hip"+s,[0,-.17,.015],[.072,.19,.078],.03,c),t("knee"+s,[0,0,0],[0,-.41,0],.048,.03,.025,c),e("knee"+s,[0,-.12,-.028],[.046,.13,.052],.02,c),t("knee"+s,[0,-.29,-.024],[0,-.425,-.034],.017,.02,.02,c),e("ankle"+s,[0,-.004,0],[.033,.024,.028],.022,c),e("ankle"+s,[0,-.045,-.016],[.028,.027,.03],.025,c),e("ankle"+s,[0,-.038,.058],[.035,.032,.1],.03,c,[.17,0,0]),e("ankle"+s,[0,-.06,.13],[.04,.017,.05],.025,c)}return o}function Eo(){const o=[],t=[0,.1,-.015],e=[.08,.1,.105],s=15;for(let n=0;n<s;n++){const c=-.2+(n+.5)/s*2.1,r=Math.sin(n*2.399)*1.15,a=dt([Math.sin(r),Math.cos(c),-Math.sin(c)*Math.cos(r)*.9]),u=[t[0]+a[0]*e[0]*.9,t[1]+a[1]*e[1]*.9,t[2]+a[2]*e[2]*.9],f=Math.floor(n/3);o.push({p:u,n:a,len:.26+.3*((n*.618+f*.3)%1),width:.015+.011*(n*.382%1),seed:f*2.71+n%3*.23+.7})}return o}const ye=(o,t)=>o===0?Math.max(.0025,t*1.5):Math.max(6e-4,t*.2);function So(o,t){return Math.sin(t*.097+o*1.7)*.5+Math.sin(t*.181+o*3.1)*.3+Math.sin(t*.293+o*5.3)*.2}const be={spine:[-.1,0,.03],chest:[-.12,.05,.03],neck:[-.15,.25,.05],head:[-.3,.55,.1],clavL:[0,0,.12],shoulderL:[-.3,1.1,1.3],elbowL:[-.85,0,0],wristL:[.35,0,.1],clavR:[0,0,.1],shoulderR:[-.2,.5,.85],elbowR:[-.6,0,0],wristR:[.3,0,.15],hipL:[-.3,.1,.2],kneeL:[.7,0,0],ankleL:[1,0,0],hipR:[-.8,.75,.3],kneeR:[1.55,0,0],ankleR:[.95,0,0]},Ao={spine:[.22,0,.05],chest:[.18,-.1,.02],neck:[.15,.2,0],head:[.1,.45,.05],clavL:[0,0,.05],shoulderL:[-.95,.6,.55],elbowL:[-1.35,0,0],wristL:[.4,0,.1],clavR:[0,0,.05],shoulderR:[-.7,.3,.45],elbowR:[-1.5,0,0],wristR:[.35,0,.1],hipL:[-1.35,.25,.15],kneeL:[1.95,0,0],ankleL:[.8,0,0],hipR:[-1.1,.4,.22],kneeR:[1.7,0,0],ankleR:[.85,0,0]},Lo={spine:[-.2,0,.02],chest:[-.2,.05,.02],neck:[-.2,.3,.03],head:[-.42,.5,.05],clavL:[0,0,.25],shoulderL:[-2.5,.5,.45],elbowL:[-.45,0,0],wristL:[.25,0,.1],clavR:[0,0,.22],shoulderR:[-2.25,.2,.6],elbowR:[-.6,0,0],wristR:[.3,0,.1],hipL:[-.12,.05,.12],kneeL:[.55,0,0],ankleL:[1.05,0,0],hipR:[-.35,.5,.2],kneeR:[1,0,0],ankleR:[1,0,0]};function To(o){if(typeof o=="string")return{open:o==="open"?1:0,curl:o==="curl"?1:0,surrender:o==="surrender"?1:0};const t=.5+.5*Math.sin(o/53-1.4),e=.5+.5*Math.sin(o/71-1.57),s=Math.pow(t,3)*.85,n=Math.pow(e,3)*.85*(1-s);return{open:1-s-n,curl:s,surrender:n}}class Po{constructor(){this.joints=xt.map(([t,e,s])=>({name:t,parent:e,offset:s,side:t.endsWith("R")?-1:1,rot:[0,0,0],R:null,p:null})),this.byName=Object.fromEntries(this.joints.map(t=>[t.name,t])),this.shapes=ko(),this.roots=Eo(),this.data=new Float32Array(Ut*8),this.groups=[],this.count=0,this.hair=[]}pose(t,{wind:e=1,reach:s=0,wall:n=t,orient:l,preset:c}){const r=this.byName,a=b=>So(b,t),u=Math.max(0,e),f=Math.sin(n*.9)*.015,i=To(c==="open"||c==="curl"||c==="surrender"?c:t),h={};for(const b of Object.keys(be))h[b]=[0,1,2].map(g=>be[b][g]*i.open+Ao[b][g]*i.curl+Lo[b][g]*i.surrender);h.spine[0]+=f,h.chest[0]+=f,h.shoulderL[0]-=u*.15,h.shoulderL[2]+=u*.12,h.shoulderR[0]-=u*.12,h.shoulderR[2]+=u*.15,h.hipL[0]-=u*.08,h.hipR[0]-=u*.08;const p={spine:[.06,.05,.04],chest:[.05,.06,.03],neck:[.08,.15,.05],head:[.12,.25,.08],clavL:[0,0,.05],shoulderL:[.3,.3,.2],elbowL:[.3,0,0],wristL:[.2,.2,.15],clavR:[0,0,.05],shoulderR:[.3,.3,.2],elbowR:[.35,0,0],wristR:[.2,.2,.1],hipL:[.2,.15,.1],kneeL:[.3,0,0],ankleL:[.15,0,0],hipR:[.2,.15,.1],kneeR:[.3,0,0],ankleR:[.15,0,0]};let d=1;for(const b of this.joints){const g=h[b.name],M=p[b.name];if(c==="stand"||!g){b.rot=[0,0,0];continue}b.rot=g.map((w,k)=>w+a(d++*3.7+k)*M[k])}if(c!=="stand"){const b=(w,k)=>w+(k-w)*s,g=r.elbowR.rot,M=r.wristR.rot;r.elbowR.rot=[b(g[0],-.12),0,0],r.wristR.rot=[b(M[0],-.3),M[1],M[2]],r.head.rot[1]-=s*.2;for(const w of["L","R"]){const k=w==="L"?0:50,m=w==="R"?s:0;for(let v=0;v<4;v++){const y=(1.5-v)*(.12+m*.1)+a(30+k+v)*.05,L=(.3+v*.08+a(35+k+v)*.12)*(1-m*.75);r[`f${v}a${w}`].rot=[y,0,-L],r[`f${v}b${w}`].rot=[0,0,-L*1.3]}r["thumbA"+w].rot=[-.75-m*.25+a(40+k)*.1,0,-.3],r["thumbB"+w].rot=[0,0,-.3*(1-m)]}}this.fk(l),c!=="stand"&&this.aimReach(s,n);const x=["pelvis","chest","chest","head","kneeL","kneeR","elbowL","elbowR"],R=[0,0,0];for(const b of x)for(let g=0;g<3;g++)R[g]+=r[b].p[g]/x.length;for(const b of this.joints)b.p=ne(b.p,R);this.torso=et(B(r.chest.p,r.pelvis.p),.5),this.poseHair(t,u)}fk(t){const e=this.byName;for(const s of this.joints){const n=It(s.rot[0],s.rot[1]*s.side,s.rot[2]*s.side);if(!s.parent)s.R=$(t,n),s.p=[0,0,0];else{const l=e[s.parent];s.R=$(l.R,n),s.p=B(l.p,V(l.R,s.offset))}}this.root=t}aimReach(t,e){const s=this.byName,n=s.shoulderR,l=this.reachWall===void 0?0:Math.min(.1,Math.max(0,e-this.reachWall));if(this.reachWall=e,this.reachAim||(this.reachAim=n.rot.slice()),t>.001){const r=s.clavR.R,a=n.rot[1];let u=null,f=-1e9;const i=(p,d)=>{const x=$(r,It(p,-a,-d)),R=-x[4],b=-x[7];return R+.12*b-.04*(Math.abs(p-n.rot[0])+Math.abs(d-n.rot[2]))};if(this.reachGoal)u=this.reachGoal.slice(),f=i(u[0],u[1]);else for(let p=-3;p<=.6;p+=.2)for(let d=-.2;d<=2.6;d+=.2){const x=i(p,d);x>f&&(f=x,u=[p,d])}for(const p of[.08,.08,.03,.03])for(const d of[-p,0,p])for(const x of[-p,0,p]){const R=i(u[0]+d,u[1]+x);R>f&&(f=R,u=[u[0]+d,u[1]+x])}this.reachGoal=u;const h=1-Math.exp(-l/.45);this.reachAim[0]+=(this.reachGoal[0]-this.reachAim[0])*h,this.reachAim[2]+=(this.reachGoal[1]-this.reachAim[2])*h}else this.reachAim=n.rot.slice(),this.reachGoal=null;const c=t*t*(3-2*t);n.rot=[n.rot[0]+(this.reachAim[0]-n.rot[0])*c,n.rot[1],n.rot[2]+(this.reachAim[2]-n.rot[2])*c],this.fk(this.root)}poseHair(t,e){const s=this.byName.head,n=[0,1,0],l=[1,0,0],c=[0,0,1],r=7,a=Math.min(1.4,e),u=this.hairT===void 0?0:Math.max(0,t-this.hairT);this.hairT=t,this.hairPhase=(this.hairPhase??t)+u*(.9+.5*a);const f=this.hairPhase;this.hair=this.roots.map(i=>{const h=[B(s.p,V(s.R,i.p))],p=V(s.R,i.n),d=i.len/r,x=i.seed;let R=p;for(let b=1;b<=r;b++){const g=b/r,M=x*3.1+f-g*3.4,w=(.15+.57*g)*(.6+.35*(1-Math.min(1,a))),k=B(et(l,Math.sin(M)*w),et(c,Math.sin(M*.73+x)*w*.8)),m=B(B(et(p,.7*(1-g)+.1),et(n,a*(.7+1.1*g))),k);m[1]=Math.max(m[1],.15);const v=dt(m);R=dt(B(et(R,.35),et(v,.65+.3*g))),h.push(B(h[h.length-1],et(R,d)))}return{pts:h,width:i.width}})}pack3D(){const t=this.data3??(this.data3=new Float32Array(Ut*16)),e=this.byName;let s=0;const n=new Map,l=[],c=(r,a,u)=>{if(s>=Ut)return;a.forEach((i,h)=>t.set(i,s*16+h*4)),n.has(r)||(n.set(r,{start:s,count:0,lo:[1e9,1e9,1e9],hi:[-1e9,-1e9,-1e9],k:0}),l.push(r));const f=n.get(r);f.count++;for(const[i,h]of u)for(let p=0;p<3;p++)f.lo[p]=Math.min(f.lo[p],i[p]-h),f.hi[p]=Math.max(f.hi[p],i[p]+h);f.k=Math.max(f.k,a[2][3]<0?a[2][0]:a[0][3]),s++};for(const r of this.shapes){const a=e[r.j],u=a.side;if(r.type===0){const f=B(a.p,V(a.R,[r.a[0]*u,r.a[1],r.a[2]])),i=B(a.p,V(a.R,[r.b[0]*u,r.b[1],r.b[2]]));c(r.g,[[...f,r.ra],[...i,r.rb],[r.k,0,0,-1],[0,0,0,0]],[[f,r.ra],[i,r.rb]])}else{const f=B(a.p,V(a.R,[r.c[0]*u,r.c[1],r.c[2]]));let i=a.R;r.e&&(i=$(i,It(r.e[0],r.e[1]*u,r.e[2]*u)));const h=d=>[i[d],i[3+d],i[6+d]],p=Math.max(...r.r);c(r.g,[[...f,r.k],[...h(0),r.r[0]],[...h(1),r.r[1]],[...h(2),r.r[2]]],[[f,p]])}}for(const{pts:r,width:a}of this.hair){const u=r.length-1,f=i=>a*Math.pow(1-i,1.4)+.0016;for(let i=0;i<u;i++){const h=f(i/u),p=f((i+1)/u);c("hair",[[...r[i],h],[...r[i+1],p],[ye(i,h),2,0,-1],[0,0,0,0]],[[r[i],h],[r[i+1],p]])}}return this.count3=s,this.groups3=l.map(r=>{const a=n.get(r),u=a.lo.map((i,h)=>(i+a.hi[h])/2),f=Math.hypot(a.hi[0]-a.lo[0],a.hi[1]-a.lo[1],a.hi[2]-a.lo[2])/2;return{c:u,r:f,k:a.k,start:a.start,count:a.count}}),this}lookPoint(t){const e=this.byName,s=(n,l)=>{var c;return(c=e[n])!=null&&c.p?B(e[n].p,V(e[n].R,l)):null};if(t==="face")return s("head",[0,.065,.07]);if(t==="hand"||t==="handR")return s("wristR",[0,-.085,0]);if(t==="handL")return s("wristL",[0,-.085,0]);if(t==="foot"||t==="footR")return s("ankleR",[0,-.04,.03]);if(t==="footL")return s("ankleL",[0,-.04,.03]);if(t==="hair"){const n=this.hair.flatMap(l=>l.pts);return n.length?et(n.reduce((l,c)=>B(l,c),[0,0,0]),1/n.length):null}return s(t,[0,0,0])}project(t){const e=this.data;let s=0;const n=new Map,l=this.byName,c=[],r=(i,h,p)=>{if(s>=Ut)return;e.set(h,s*8),e.set(p,s*8+4),n.has(i)||(n.set(i,{start:s,count:0,minX:1e9,minY:1e9,maxX:-1e9,maxY:-1e9,k:0}),c.push(i));const d=n.get(i);return d.count++,s++,d},a=(i,h,p,d)=>{i.minX=Math.min(i.minX,h-d),i.maxX=Math.max(i.maxX,h+d),i.minY=Math.min(i.minY,p-d),i.maxY=Math.max(i.maxY,p+d)};this.pxPerM=t.pxPerUnit/t.project([0,0,0])[2];const u=(i,h,p,d,x,R,b)=>{const g=t.project(i),M=t.project(h),w=p*t.pxPerUnit/g[2],k=d*t.pxPerUnit/M[2],m=x*this.pxPerM,v=r(R,[g[0],g[1],M[0],M[1]],[w,k,b?2:0,m]);v&&(a(v,g[0],g[1],w),a(v,M[0],M[1],k),v.k=Math.max(v.k,m))};for(const i of this.shapes){const h=l[i.j],p=h.side;if(i.type===0){const d=[i.a[0]*p,i.a[1],i.a[2]],x=[i.b[0]*p,i.b[1],i.b[2]];u(B(h.p,V(h.R,d)),B(h.p,V(h.R,x)),i.ra,i.rb,i.k,i.g,!1)}else{const d=B(h.p,V(h.R,[i.c[0]*p,i.c[1],i.c[2]]));let x=h.R;i.e&&(x=$(x,It(i.e[0],i.e[1]*p,i.e[2]*p)));const R=$(t.R,x),b=[0,1,2].map(z=>[R[0+z]*i.r[z],R[3+z]*i.r[z]]);let g=0,M=0,w=0;for(const[z,rt]of b)g+=z*z,M+=z*rt,w+=rt*rt;const k=t.project(d),m=t.pxPerUnit/k[2];g*=m*m,M*=m*m,w*=m*m;const v=(g+w)/2,y=Math.sqrt(((g-w)/2)**2+M*M),L=v+y,_=Math.max(v-y,1e-6),F=.5*Math.atan2(2*M,g-w),q=Math.sqrt(L),it=Math.sqrt(_),Pt=i.k*this.pxPerM,Q=r(i.g,[k[0],k[1],Math.cos(F),Math.sin(F)],[q,it,1,Pt]);if(!Q)continue;a(Q,k[0],k[1],q),Q.k=Math.max(Q.k,Pt)}}for(const{pts:i,width:h}of this.hair){const p=i.length-1,d=x=>h*Math.pow(1-x,1.4)+.0016;for(let x=0;x<p;x++){const R=d(x/p),b=d((x+1)/p);u(i[x],i[x+1],R,b,ye(x,R),"hair",!0)}}this.count=s,this.groups=c.map(i=>{const h=n.get(i),p=(h.minX+h.maxX)/2,d=(h.minY+h.maxY)/2;return{cx:p,cy:d,r:Math.hypot(h.maxX-h.minX,h.maxY-h.minY)/2,start:h.start,count:h.count,k:h.k}});const f=t.project(this.torso);return this.torsoPx=f,this}}const we=o=>o*o*(3-2*o),_o=o=>Math.min(1,Math.max(0,o));function Oo(o){let t=o>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function te(o,t,e,s,n){const l=o-t;return l<=0||l>=e+s+n?0:l<e?we(l/e):l<e+s?1:1-we((l-e-s)/n)}const Re=1.7,Co=27;class Fo{constructor(t=0){this.wall=t,this.story=Co+t*.9,this.fall=t*Re,this.rate=1,this.blur=1,this.hold=0,this.holding=!1,this.susp=0,this.rush=0,this.reach=0,this.swell=0;const e=Oo(1789);this.suspensions=[],this.rushes=[];let s=40;for(let n=0;n<400;n++){this.suspensions.push(s);const l=80+e()*55;this.rushes.push(s+22+e()*(l-40)),s+=l}}suspensionAt(t){let e=0;for(const s of this.suspensions){if(s>t)break;e=Math.max(e,te(t,s,5,10,7))}return e}rushAt(t){let e=0;for(const s of this.rushes){if(s>t)break;e=Math.max(e,te(t,s,3.5,5,5))}return e}reachAt(t){let e=0;for(const s of this.suspensions){if(s>t)break;e=Math.max(e,te(t,s+4,6,6,8))}return e}tick(t,e=!1){t=Math.min(t,.1),this.wall+=t;const s=this.wall,n=Math.PI*2,l=.9+.3*Math.sin(n*s/67)+.18*Math.sin(n*s/31+1.3)+.08*Math.sin(n*s/13+.4);this.susp=this.suspensionAt(s),this.rush=this.rushAt(s),this.reach=this.reachAt(s);const c=1-Math.exp(-t/.6);this.hold+=((this.holding?1:0)-this.hold)*(1-Math.exp(-t/(this.holding?.9:1.6)));const r=e?.45:1;let a=l*(1+.85*this.rush);a=a*(1-this.susp)+-.06*this.susp,a*=1-.97*this.hold,this.rate+=(a*r-this.rate)*c;let u=l*(1+1.3*this.rush);u=u*(1-this.susp)+1.05*this.susp,u*=1-.45*this.hold,this.blur+=(u*r-this.blur)*c,this.story+=t*Math.min(1.6,Math.max(.025,this.rate)),this.fall+=t*this.rate*Re,this.swell=_o(this.susp*1+this.hold*.5)}}const Do=`
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
`,Ht=[{bass:38,notes:[45,54,57,64],pcs:[0,4,7]},{bass:37,notes:[45,52,57,61],pcs:[7,11,2]},{bass:35,notes:[42,50,54,61],pcs:[9,0,4]},{bass:33,notes:[42,49,54,57],pcs:[4,7,11]},{bass:31,notes:[38,47,54,57],pcs:[5,9,0,4]},{bass:30,notes:[45,50,54,64],pcs:[0,4,7]},{bass:28,notes:[43,50,54,59],pcs:[2,5,9,0]},{bass:33,notes:[40,50,52,55],pcs:[7,0,2,5]}],Bo=14,Io={level:.4,reverb:.85,lowCut:40,shepard:1,pad:1,air:1,hall:1,dust:1,breath:1},ae=["shepard","pad","air","hall","dust","breath"],yt=o=>440*Math.pow(2,(o-69)/12);function le(o){let t=o>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function Uo(o,t){const e=o.sampleRate,s=Math.floor(e*t),n=o.createBuffer(2,s,e),l=.045;for(let c=0;c<2;c++){const r=n.getChannelData(c),a=le(c?7919:104729),u=1-Math.exp(-2*Math.PI*400/e),f=1-Math.exp(-2*Math.PI*3e3/e);let i=0,h=0;const p=Math.floor(e*l);for(let d=p;d<s;d++){const x=(d-p)/e,R=a()*2-1;i+=(R-i)*u,h+=(R-h)*f;const b=i,g=h-i,M=R-h,w=v=>Math.exp(-6.9*x/v),k=1-Math.exp(-x/.07),m=1+.18*Math.exp(-x/2.5)*(Math.cos(2*Math.PI*x/.268)+.6*Math.cos(2*Math.PI*x/.175));r[d]=(b*2.2*w(13)+g*1.1*w(9)+M*.5*w(3.5))*k*m}for(let d=0;d<26;d++){const x=48+Math.pow(a(),.8)*320,R=Math.floor(e*(l+x*.001));R<s&&(r[R]+=(a()<.5?-1:1)*.55*Math.exp(-x/260)*(.4+.6*a()))}}return n}function Me(o,t=6,e=1){const s=o.sampleRate,n=Math.floor(s*t),l=o.createBuffer(2,n,s);for(let c=0;c<2;c++){const r=l.getChannelData(c),a=le(e*31+c);let u=0,f=0,i=0;for(let h=0;h<n;h++){const p=a()*2-1;u=.99765*u+p*.099046,f=.963*f+p*.2965164,i=.57*i+p*1.0526913,r[h]=(u+f+i+p*.1848)*.12}}return l}class Ho{constructor({layers:t=ae,tune:e=Io}={}){this.tune=e,this.started=!1,this.muted=!1,this.ctx=null,this.on=new Set(t),this.rand=le(2718)}async start(t){if(this.started)return;this.started=!0;const e=!t;if(e){const s=window.AudioContext||window.webkitAudioContext;t=new s({latencyHint:"playback"}),t.resume()}if(this.ctx=t,this.hasShepard=!1,t.audioWorklet&&this.on.has("shepard")){const s=URL.createObjectURL(new Blob([Do],{type:"application/javascript"}));try{await t.audioWorklet.addModule(s),this.hasShepard=!0}catch(n){console.warn("shepard worklet unavailable:",n)}URL.revokeObjectURL(s)}this.build(),this.live=e}build(){const t=this.ctx,e=t.currentTime,s=(i=1)=>{const h=t.createGain();return h.gain.value=i,h};this.g=s,this.master=s(0),this.lowCut=t.createBiquadFilter(),this.lowCut.type="highpass",this.lowCut.frequency.value=this.tune.lowCut,this.lowCut.Q.value=.6;const n=t.createDynamicsCompressor();n.threshold.value=-22,n.knee.value=14,n.ratio.value=3,n.attack.value=.03,n.release.value=.5;const l=t.createDynamicsCompressor();l.threshold.value=-6,l.knee.value=0,l.ratio.value=20,l.attack.value=.002,l.release.value=.2,this.master.connect(this.lowCut).connect(n).connect(l).connect(s(.8)).connect(t.destination),this.master.gain.setValueAtTime(0,e),this.master.gain.linearRampToValueAtTime(1e-4,e+.05),this.master.gain.setTargetAtTime(this.tune.level,e+.05,2.6),this.dry=s(1),this.dry.connect(this.master);const c=(navigator.hardwareConcurrency||4)<=4||matchMedia("(pointer: coarse)").matches;this.verb=t.createConvolver(),this.verb.buffer=Uo(t,c?7:12),this.verbIn=s(1),this.verbOut=s(this.tune.reverb),this.verbIn.connect(this.verb).connect(this.verbOut).connect(this.master),this.tape=t.createConstantSource(),this.tape.offset.value=0,this.wow=t.createOscillator(),this.wow.frequency.value=.31,this.wowDepth=s(4),this.wow.connect(this.wowDepth),this.tapeBus=s(1),this.tape.connect(this.tapeBus),this.wowDepth.connect(this.tapeBus),this.tape.start(e),this.wow.start(e);const r=Me(t,6,1);this.noise=r,this.shepGain=s(0);const a=t.createBiquadFilter();a.type="lowpass",a.frequency.value=2200,a.Q.value=.4,this.hasShepard&&(this.shep=new AudioWorkletNode(t,"shepard",{numberOfInputs:0,outputChannelCount:[2]}),this.shep.connect(a)),a.connect(this.shepGain),this.shepGain.connect(s(.18)).connect(this.dry),this.shepGain.connect(this.verbIn);const u=[0,1,.45,.24,.14,.085,.05,.03,.018,.01,.006];this.wave=t.createPeriodicWave(new Float32Array(u.length),new Float32Array(u)),this.padFilter=t.createBiquadFilter(),this.padFilter.type="lowpass",this.padFilter.frequency.value=800,this.padFilter.Q.value=.5,this.padBus=s(this.on.has("pad")?.055:0),this.padFilter.connect(this.padBus),this.padBus.connect(s(.6)).connect(this.dry),this.padBus.connect(this.verbIn),this.voices=[],this.subGain=s(0),this.subGain.connect(this.dry),this.subGain.connect(s(.3)).connect(this.verbIn),this.subs=[[12,.62],[0,.5]].map(([i,h])=>{const p=t.createOscillator();p.type="sine",p.frequency.value=yt(Ht[0].bass+i);const d=s(h);return p.connect(d).connect(this.subGain),this.tapeBus.connect(p.detune),p.start(e),{o:p,shift:i}}),this.airSrc=t.createBufferSource(),this.airSrc.buffer=r,this.airSrc.loop=!0,this.airBus=s(0),this.air=[];for(let i=0;i<4;i++){const h=t.createBiquadFilter();h.type="bandpass",h.Q.value=34,h.frequency.value=440,this.airSrc.connect(h).connect(s(1.6)).connect(this.airBus),this.air.push(h)}this.airBus.connect(this.verbIn),this.airBus.connect(s(.2)).connect(this.dry),this.airSrc.start(e),this.hallSrc=t.createBufferSource(),this.hallSrc.buffer=Me(t,7,2),this.hallSrc.loop=!0,this.hallSrc.playbackRate.value=.5,this.hallLow=t.createBiquadFilter(),this.hallLow.type="lowpass",this.hallLow.frequency.value=140,this.hallLow.Q.value=.6;const f=t.createBiquadFilter();f.type="bandpass",f.frequency.value=5200,f.Q.value=.5,this.hallGain=s(0),this.hallSrc.connect(this.hallLow).connect(this.hallGain),this.hallSrc.connect(f).connect(s(.05)).connect(this.hallGain),this.hallGain.connect(this.dry),this.hallGain.connect(s(.5)).connect(this.verbIn),this.hallSrc.start(e),this.dustBus=s(0),this.dustBus.connect(s(.35)).connect(this.dry),this.dustBus.connect(this.verbIn),this.breathBus=s(this.on.has("breath")?1:0),this.breathBus.connect(s(.4)).connect(this.dry),this.breathBus.connect(s(1.3)).connect(this.verbIn),this.lastNow=e,this.mtime=0,this.chordIndex=-1,this.nextChord=0,this.nextGrain=e+2,this.inSusp=!1,this.held=!1,this.lastBreath=-100}setMuted(t){if(this.muted=t,!this.ctx)return;const e=this.ctx.currentTime;this.master.gain.cancelScheduledValues(e),this.master.gain.setValueAtTime(this.master.gain.value,e),t?(this.master.gain.setTargetAtTime(0,e,.25),this.live&&setTimeout(()=>this.muted&&this.ctx.suspend(),1500)):(this.ctx.resume(),this.master.gain.setTargetAtTime(this.tune.level,e,.8))}setHidden(t){!this.ctx||!this.live||this.muted||(t?this.ctx.suspend():this.ctx.resume())}chord(t,e){var l;const s=this.ctx,n=Ht[t%Ht.length];this.current=n;for(const c of this.voices){c.env.gain.cancelScheduledValues(e),c.env.gain.setTargetAtTime(0,e,2.8);for(const r of c.osc)r.stop(e+16)}this.voices=[],this.on.has("pad")&&n.notes.forEach((c,r)=>{const a=s.createGain();a.gain.value=0;const u=.32/Math.sqrt(n.notes.length)*(1-r*.09);a.gain.setValueAtTime(0,e),a.gain.setTargetAtTime(u,e,2.2),a.connect(this.padFilter);const f=[-1,1].map(i=>{const h=s.createOscillator();h.setPeriodicWave(this.wave),h.frequency.value=yt(c),h.detune.value=i*(c<48?2.5:5+this.rand()*3),this.tapeBus.connect(h.detune);const p=s.createStereoPanner();return p.pan.value=i*(.25+r*.1),h.connect(p).connect(a),h.start(e),this.unhookOnEnd(h),h});this.voices.push({env:a,osc:f})});for(const{o:c,shift:r}of this.subs)c.frequency.setTargetAtTime(yt(n.bass+r),e,.9);this.air.forEach((c,r)=>{const a=n.notes[r%n.notes.length]+12;c.frequency.setTargetAtTime(yt(a),e,1.4)}),(l=this.shep)==null||l.port.postMessage({chord:n.pcs})}grain(t,e){const s=this.ctx,n=this.current??Ht[0],l=this.rand,r=n.notes[Math.floor(l()*n.notes.length)]+24+12*Math.floor(l()*2.2),a=e?.6+l()*1.6:.025+l()*l()*.08,u=(e?.05:.11)*(.3+l()*.7)*Math.pow(2,-(r-80)/24),f=s.createOscillator();f.frequency.value=yt(r),f.detune.setValueAtTime(l()*20-10,t),f.detune.linearRampToValueAtTime(e?-6:-30-l()*40,t+a);const i=s.createGain();i.gain.value=0,i.gain.setValueAtTime(0,t),i.gain.linearRampToValueAtTime(u,t+a*(e?.4:.18)),i.gain.linearRampToValueAtTime(0,t+a);const h=s.createStereoPanner();h.pan.value=(l()*2-1)*.85,f.connect(i).connect(h).connect(this.dustBus),f.start(t),f.stop(t+a+.05),f.onended=()=>{f.disconnect(),i.disconnect(),h.disconnect()}}breath(t,e=1){const s=this.ctx,n=this.rand,l=s.createBufferSource();l.buffer=this.noise;const c=n()*(this.noise.duration-2),r=.55+n()*.25,a=s.createBiquadFilter();a.type="bandpass",a.Q.value=.8,a.frequency.setValueAtTime(1500+n()*500,t),a.frequency.exponentialRampToValueAtTime(520,t+r);const u=s.createBiquadFilter();u.type="highpass",u.frequency.value=260;const f=s.createGain();f.gain.value=0,f.gain.setValueAtTime(0,t),f.gain.linearRampToValueAtTime(.9*e,t+.05),f.gain.setTargetAtTime(.35*e,t+.05,.12),f.gain.setTargetAtTime(0,t+r*.55,r*.18);const i=s.createStereoPanner();i.pan.value=(n()-.5)*.3,l.connect(u).connect(a).connect(f).connect(i).connect(this.breathBus),l.start(t,c,r+1);const h=s.createOscillator();h.type="sine",h.frequency.setValueAtTime(95,t+r*.5),h.frequency.exponentialRampToValueAtTime(48,t+r*.5+.18);const p=s.createGain();p.gain.value=0,p.gain.setValueAtTime(0,t+r*.5),p.gain.linearRampToValueAtTime(.22*e,t+r*.5+.015),p.gain.setTargetAtTime(0,t+r*.5+.02,.05),h.connect(p).connect(i),h.start(t+r*.5),h.stop(t+r*.5+.5),l.onended=()=>{l.disconnect(),u.disconnect(),a.disconnect(),f.disconnect()},h.onended=()=>{h.disconnect(),p.disconnect(),i.disconnect()}}unhookOnEnd(t){t.onended=()=>{try{this.tapeBus.disconnect(t.detune)}catch{}t.disconnect()}}update(t,e=1){var M;if(!this.ctx||!this.master)return;const n=this.ctx.currentTime,l=Math.max(0,Math.min(.25,n-this.lastNow));if(this.lastNow=n,l===0&&this.chordIndex>=0)return;const c=t.wall,r=t.rate,a=n+.03,u=(w,k,m=.25)=>w.setTargetAtTime(k,n,m),f=this.tune,i=w=>this.on.has(w)?f[w]??1:0;!this.muted&&f.level!==this.lastLevel&&(this.lastLevel!==void 0&&u(this.master.gain,f.level,.3),this.lastLevel=f.level),u(this.verbOut.gain,f.reverb,.3),u(this.lowCut.frequency,f.lowCut,.3),u(this.padBus.gain,i("pad")*.055,.3),u(this.breathBus.gain,i("breath"),.3),this.mtime+=l*Math.max(.05,Math.min(1.8,Math.abs(r))),this.mtime>=this.nextChord&&(this.chordIndex++,this.chord(this.chordIndex,a),this.nextChord+=Bo);const h=(M=this.shep)==null?void 0:M.parameters;h&&(u(h.get("rate"),-.02*r*(1+.6*t.rush),.4),u(h.get("fifth"),.25+.5*t.susp,1),u(h.get("center"),7.9+.4*Math.sin(c/41)+.3*t.rush,2));const p=.5+.5*Math.sin(c/97*Math.PI*2-1.2),d=.05+.8*p*p+.3*t.rush+.35*t.susp;u(this.shepGain.gain,i("shepard")*Math.min(1,d)*.17,1.5);const x=t.swell,R=(550+600*(.5+.5*Math.sin(c/23))+1100*x+600*t.rush)*(1-.45*t.hold);u(this.padFilter.frequency,R,.8),u(this.subGain.gain,i("pad")*(.08+.03*x),1),u(this.airBus.gain,i("air")*(.08+.18*x+.05*Math.max(0,Math.sin(c/31))),1.5);const b=.5+.5*Math.sin(c/11.3)*Math.sin(c/29+1);u(this.hallGain.gain,i("hall")*(.08+.06*b+.05*t.hold),2),u(this.hallLow.frequency,90+70*b,2),u(this.tape.offset,-38*t.hold-8*t.susp,.6),u(this.wowDepth.gain,3+14*t.hold+6*t.susp,.6),u(this.wow.frequency,.12+.25*Math.max(0,Math.min(1.5,r)),.6);const g=Math.max(t.hold,t.susp);if(u(this.dustBus.gain,i("dust")*(.7+.7*e),1),i("dust")>0){const w=2+9*Math.min(1.5,Math.max(0,r))*(1-g)+1.2*g;for(this.nextGrain<n&&(this.nextGrain=n);this.nextGrain<n+.12;)this.grain(this.nextGrain,this.rand()<g),this.nextGrain+=-Math.log(1-this.rand())/w}i("breath")>0&&(t.susp>.35&&!this.inSusp||t.holding&&!this.held)&&c-this.lastBreath>6&&(this.breath(a+.05,t.holding?.8:1),this.lastBreath=c),t.susp>.35?this.inSusp=!0:t.susp<.1&&(this.inSusp=!1),this.held=t.holding}}const ht=[{group:"Light",key:"exposure",label:"exposure",min:.5,max:8,step:.05,value:2.5},{group:"Light",key:"sun",label:"sun strength",min:5,max:120,step:1,value:40},{group:"Light",key:"sky",label:"sky in the opening",min:0,max:.5,step:.005,value:.13},{group:"Light",key:"spread",label:"sun softness",min:.001,max:.06,step:5e-4,value:.03},{group:"Light",key:"bounce",label:"bounce light",min:0,max:4,step:.05,value:1},{group:"Light",key:"palette",label:"colour (−1 cycles)",min:-1,max:4,step:1,value:-1},{group:"Air",key:"fogBase",label:"haze",min:0,max:.03,step:2e-4,value:.0062},{group:"Air",key:"fogLow",label:"haze near the floor",min:0,max:.05,step:5e-4,value:.011},{group:"Air",key:"fogHeight",label:"floor haze height (m)",min:.5,max:20,step:.1,value:5},{group:"Air",key:"phaseG",label:"forward scatter",min:0,max:.9,step:.01,value:.55},{group:"Air",key:"glow",label:"air glow",min:0,max:.06,step:.001,value:.01},{group:"Dust",key:"dustFloor",label:"clear air between",min:0,max:1,step:.01,value:.09},{group:"Dust",key:"dustAmount",label:"dust in the streaks",min:0,max:4,step:.05,value:.65},{group:"Dust",key:"dustLo",label:"streak threshold",min:0,max:.95,step:.01,value:.78},{group:"Dust",key:"dustHi",label:"streak edge",min:.05,max:1,step:.01,value:.79},{group:"Dust",key:"dustAcross",label:"streak fineness",min:.01,max:.4,step:.005,value:.335},{group:"Dust",key:"dustAlong",label:"streak length (inv)",min:.001,max:.1,step:.001,value:.004},{group:"Dust",key:"motes",label:"motes",min:0,max:1,step:.01,value:.76},{group:"Dust",key:"moteGlow",label:"mote brightness",min:0,max:5,step:.05,value:.95},{group:"Floor",key:"polish",label:"reflection",min:0,max:1,step:.01,value:.35},{group:"Floor",key:"roughLo",label:"polish roughness",min:.01,max:.6,step:.005,value:.04},{group:"Floor",key:"roughHi",label:"worn roughness",min:.01,max:.9,step:.005,value:.26},{group:"Floor",key:"floorAlbedo",label:"floor tone",min:.02,max:.5,step:.005,value:.13},{group:"Lens",key:"bloom",label:"bloom",min:0,max:.4,step:.005,value:.205},{group:"Lens",key:"grain",label:"grain",min:0,max:.12,step:.002,value:0},{group:"Lens",key:"fringe",label:"colour fringe",min:0,max:.02,step:5e-4,value:.003},{group:"Sound",key:"level",label:"master",min:0,max:1,step:.01,value:.4},{group:"Sound",key:"reverb",label:"reverb",min:0,max:2,step:.01,value:.85},{group:"Sound",key:"lowCut",label:"low cut (Hz)",min:20,max:300,step:1,value:40},{group:"Sound",key:"shepard",label:"falling glide",min:0,max:2,step:.01,value:1},{group:"Sound",key:"pad",label:"pad and bass",min:0,max:2,step:.01,value:1},{group:"Sound",key:"air",label:"choir",min:0,max:2,step:.01,value:1},{group:"Sound",key:"hall",label:"room air",min:0,max:2,step:.01,value:1},{group:"Sound",key:"dust",label:"dust grains",min:0,max:2,step:.01,value:1},{group:"Sound",key:"breath",label:"breath",min:0,max:2,step:.01,value:1}],qo=typeof matchMedia=="function"&&matchMedia("(pointer: coarse)").matches,W=Object.fromEntries(ht.map(o=>[o.key,o.key==="lowCut"&&qo?110:o.value])),lt="cenotaph.tune",qt=(o,t)=>{try{const e=localStorage.getItem(o);return e==null?t:JSON.parse(e)}catch{return t}},zt=(o,t)=>{try{localStorage.setItem(o,JSON.stringify(t))}catch{}},ke=o=>Object.fromEntries(ht.map(t=>[t.key,Number.isFinite(o==null?void 0:o[t.key])?o[t.key]:W[t.key]])),T={...W},S={view:"mine",ref:"published",split:.5};let J={};function kt(){return S.ref!=="published"&&J[S.ref]?J[S.ref]:W}const wt=(o,t)=>{const e=Math.max(0,Math.min(4,Math.ceil(-Math.log10(o.step))));return(+t).toFixed(e)},zo=o=>ht.filter(t=>o[t.key]!==W[t.key]).map(t=>`${t.key}=${wt(t,o[t.key])}`).join(" ");function No(o){const t={};for(const[,e,s]of o.matchAll(/([A-Za-z]+)\s*[=:]\s*(-?[\d.]+)/g))e in W&&Number.isFinite(+s)&&(t[e]=+s);return t}const Ee=o=>String(o).replace(/[&<>"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[t]);function Go(){Object.assign(T,ke(qt(lt,{}))),J=Object.fromEntries(Object.entries(qt(lt+".presets",{})).map(([m,v])=>[m,ke(v)])),Object.assign(S,qt(lt+".compare",{})),S.ref!=="published"&&!J[S.ref]&&(S.ref="published"),["mine","split","ref"].includes(S.view)||(S.view="mine"),S.split=Math.min(.95,Math.max(.05,+S.split||.5));const o=()=>zt(lt,T),t=()=>zt(lt+".compare",S),e=()=>zt(lt+".presets",J),s=document.createElement("div");s.id="tune",s.className="tune-ui",s.innerHTML=`
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
    </div>`;const n=s.querySelector(".groups"),l=s.querySelector(".note"),c=m=>l.textContent=m,r=new Map,a=document.createElement("div");a.id="tune-split",a.className="tune-ui",a.innerHTML='<span class="label left"></span><span class="grip" aria-hidden="true"></span><span class="label right">mine</span>';const u=document.createElement("div");u.id="tune-badge",u.className="tune-ui";function f(){for(const[m,v]of r){const y=ht.find(_=>_.key===m);v.input.value=T[m],v.out.textContent=wt(y,T[m]),v.row.classList.toggle("changed",T[m]!==W[m]);const L=kt()[m];v.ref.textContent=S.view!=="mine"&&L!==T[m]?wt(y,L):""}}function i(){for(const y of s.querySelectorAll("[data-view]"))y.setAttribute("aria-pressed",String(y.dataset.view===S.view));const m=s.querySelector("#tune-ref");m.innerHTML=["published",...Object.keys(J)].map(y=>`<option value="${Ee(y)}">${Ee(y)}</option>`).join(""),m.value=S.ref;const v=S.ref==="published"?"published":S.ref;a.hidden=S.view!=="split",a.style.left=`${S.split*100}%`,a.querySelector(".left").textContent=v,u.hidden=S.view!=="ref",u.textContent=`showing ${v} · C flips back`,s.querySelector('[data-act="load"]').disabled=S.ref==="published",s.querySelector('[data-act="delete"]').disabled=S.ref==="published",f(),t()}for(const m of[...new Set(ht.map(v=>v.group))]){const v=document.createElement("details");v.open=m==="Floor"||m==="Dust",v.innerHTML=`<summary>${m}</summary>`;for(const y of ht.filter(L=>L.group===m)){const L=document.createElement("label");L.className="row",L.innerHTML=`<span class="name">${y.label}</span><input type="range" id="tune-${y.key}" min="${y.min}" max="${y.max}" step="${y.step}"><output></output><span class="ref"></span>`;const _=L.querySelector("input"),F=L.querySelector("output"),q=L.querySelector(".ref");_.addEventListener("input",()=>{T[y.key]=+_.value,S.view==="ref"&&(S.view="mine",i()),F.textContent=wt(y,T[y.key]),L.classList.toggle("changed",T[y.key]!==W[y.key]);const it=kt()[y.key];q.textContent=S.view!=="mine"&&it!==T[y.key]?wt(y,it):"",o()}),_.addEventListener("dblclick",it=>{it.stopPropagation(),_.value=W[y.key],_.dispatchEvent(new Event("input"))}),r.set(y.key,{input:_,out:F,row:L,ref:q}),v.appendChild(L)}n.appendChild(v)}let h=qt(lt+".open",!0)!==!1;const p=s.querySelector(".head"),d=m=>{h=m,s.classList.toggle("closed",!h),p.setAttribute("aria-expanded",String(h)),zt(lt+".open",h)};d(h),p.addEventListener("click",()=>d(!h));const x=m=>{S.view=m,i()};for(const m of s.querySelectorAll("[data-view]"))m.addEventListener("click",()=>x(m.dataset.view));s.querySelector("#tune-ref").addEventListener("change",m=>{S.ref=m.target.value,i()});const R=s.querySelector("#tune-name"),b=()=>{const m=R.value.trim()||`preset ${Object.keys(J).length+1}`;if(m==="published")return c('"published" is taken');J[m]={...T},e(),S.ref=m,R.value="",i(),c(`Saved "${m}"`)};s.querySelector('[data-act="save"]').addEventListener("click",b),R.addEventListener("keydown",m=>{m.key==="Enter"&&b()});let g=null;const M=s.querySelector('[data-act="undo"]'),w=()=>{g={...T},M.disabled=!1};M.addEventListener("click",()=>{g&&(Object.assign(T,g),g=null,M.disabled=!0,o(),f(),c("Undone"))}),s.querySelector('[data-act="random"]').addEventListener("click",()=>{let m=[...n.querySelectorAll("details[open] summary")].map(v=>v.textContent);m.length||(m=[...new Set(ht.map(v=>v.group))].filter(v=>v!=="Sound")),w();for(const v of ht.filter(y=>m.includes(y.group))){const y=W[v.key];let L;if(v.key==="palette")L=Math.floor(Math.random()*(v.max-v.min+1))+v.min;else{const _=Math.random()*2-1,F=Math.pow(Math.abs(_),1.6);L=_>0?y+F*(v.max-y):y-F*(y-v.min),L=Math.min(v.max,Math.max(v.min,Math.round(L/v.step)*v.step))}T[v.key]=+L.toFixed(6)}T.dustHi<T.dustLo+.05&&(T.dustHi=Math.min(1,T.dustLo+.05)),T.roughHi<T.roughLo&&(T.roughHi=T.roughLo),o(),f(),c(`Rolled ${m.join(", ")}`)}),s.querySelector('[data-act="load"]').addEventListener("click",()=>{S.ref!=="published"&&(w(),Object.assign(T,J[S.ref]),o(),f(),c(`Loaded "${S.ref}"`))}),s.querySelector('[data-act="delete"]').addEventListener("click",()=>{if(S.ref==="published")return;const m=S.ref;delete J[m],e(),S.ref="published",i(),c(`Deleted "${m}"`)}),s.querySelector('[data-act="copy"]').addEventListener("click",()=>{var v;const m=zo(T)||"(all published values)";c(m),(v=navigator.clipboard)==null||v.writeText(m).then(()=>c("Copied: "+m),()=>{})}),s.querySelector('[data-act="reset"]').addEventListener("click",()=>{w(),Object.assign(T,W),o(),f(),c("Reset to the published values")});const k=s.querySelector("#tune-paste");return k.addEventListener("change",()=>{const m=No(k.value),v=Object.keys(m).length;if(!v)return c("No values found in that line");w(),Object.assign(T,W,m),o(),f(),k.value="",c(`Applied ${v} value${v===1?"":"s"}`)}),a.addEventListener("pointerdown",m=>{m.preventDefault(),a.setPointerCapture(m.pointerId);const v=L=>{S.split=Math.min(.95,Math.max(.05,L.clientX/innerWidth)),a.style.left=`${S.split*100}%`},y=()=>{a.removeEventListener("pointermove",v),a.removeEventListener("pointerup",y),a.removeEventListener("pointercancel",y),t()};a.addEventListener("pointermove",v),a.addEventListener("pointerup",y),a.addEventListener("pointercancel",y)}),addEventListener("keydown",m=>{var v,y;m.code!=="KeyC"||m.repeat||m.metaKey||m.ctrlKey||m.altKey||(y=(v=m.target).closest)!=null&&y.call(v,"input, select")||x(S.view==="ref"?"mine":"ref")}),document.body.append(a,u,s),i(),s}const st=document.getElementById("view"),jo=document.getElementById("reset"),Xo=document.getElementById("sound"),Vo=matchMedia("(prefers-reduced-motion: reduce)").matches,$o=["t","still","cookie","pose","roll","twist","yaw","tilt","reach","sdf8","rung","govern","x","y","z","vyaw","vpitch","nodust","exp","fov","layers","adaptlog","adaptkey","debug"];function ze(o){const t=decodeURIComponent(o.slice(1)),e=/[=&]/.test(t)?t:t.split("~").map(s=>s.replace("_","=")).join("&");return[...new URLSearchParams(e)].filter(([s])=>$o.includes(s))}const C=new URLSearchParams(location.search);for(const[o,t]of ze(location.hash))C.set(o,t);const Ne=o=>JSON.stringify(ze(o).sort()),Wo=Ne(location.hash);addEventListener("hashchange",()=>{Ne(location.hash)!==Wo&&location.reload()});const U=(o,t)=>C.has(o)?+C.get(o):t;let Xt;try{Xt=new Ro(st,{force8:C.has("sdf8")})}catch(o){console.error(o),document.body.classList.add("nogl")}const Nt=new Po,K=new Ue,I=new Fo(Number(C.get("t"))||0);C.has("debug")&&Go();const Z=new Ho({tune:T,layers:C.has("layers")?C.get("layers").split(/[,.]/).filter(o=>ae.includes(o)):ae}),nt=new Ue;nt.w=nt.h=ot;nt.fov=.1;nt.update();{const o=ot*ao/O.HOLE_SPAN;nt.pos=[0,0,nt.pxPerUnit/o],nt.target=[0,0,0],nt.update()}const bt=[{sun:[.69,.75,.92],sky:[.27,.35,.54],fog:[.015,.017,.024]},{sun:[1,.96,.9],sky:[.46,.6,.86],fog:[.02,.022,.026]},{sun:[1,.8,.58],sky:[.5,.6,.74],fog:[.02,.021,.024]},{sun:[1,.6,.44],sky:[.66,.5,.6],fog:[.024,.019,.022]},{sun:[.62,.74,1],sky:[.22,.3,.5],fog:[.014,.017,.024]}],Zo=95;function Ge(o,t){const e=t.palette>=0?Math.min(bt.length-1,t.palette|0):o/Zo%bt.length,s=Math.floor(e);let n=Math.max(0,(e-s-.6)/.4);n=n*n*(3-2*n);const l=bt[s],c=bt[(s+1)%bt.length],r=(a,u)=>l[a].map((f,i)=>(f+(c[a][i]-f)*n)*u);return{sun:r("sun",t.sun),sky:r("sky",t.sun*t.sky),fog:r("fog",t.sun*t.glow)}}function Se(o){const t=.28+.035*Math.sin(o/83+1),e=-.52+.03*Math.sin(o/67);return dt([t,1,e])}const H={x:U("x",-10),y:U("y",3.2),z:U("z",30),yaw:.22,pitch:.27},E={pos:Mt([H.x,H.y,H.z]),yaw:U("vyaw",0),pitch:U("vpitch",0)};E.tpos=E.pos.slice();E.tyaw=E.yaw;E.tpitch=E.pitch;const Ae=1.35,G=new Map,ut=new Set;let ft=!1,gt=null,Kt=!1,mt=!1,Le=0,he=-1/0;function Tt(){document.body.classList.remove("idle"),clearTimeout(Le),Le=setTimeout(()=>document.body.classList.add("idle"),2600)}function ie(){I.holding=!0,!Z.started&&!Z.muted&&je()}function pt(){I.holding=Kt||mt}function je(){Z.start().then(()=>document.body.classList.add("sounding")).catch(o=>console.warn("no sound:",o))}const Xe=o=>Math.max(-Ae,Math.min(Ae,o));function Yo(){const o=H.yaw+E.tyaw;return[Math.sin(o),0,-Math.cos(o)]}const Te=.0022,Ko=.005;function ee(o,t,e){E.tyaw+=o*e,E.tpitch=Xe(H.pitch+E.tpitch-t*e)-H.pitch,E.slow=!1,he=performance.now(),ue()}function Et(o,t=0){const e=Yo(),s=[-e[2],0,e[0]],n=e[0]*o+s[0]*t,l=e[2]*o+s[2]*t,c=Math.max(1,Math.ceil(Math.hypot(n,l)/.5));let r=E.tpos;for(let a=0;a<c;a++)r=Mt([r[0]+n/c,r[1],r[2]+l/c]);E.tpos=r,E.slow=!1,he=performance.now(),ue()}function Ve(){E.tyaw=0,E.tpitch=0,E.tpos=Mt([H.x,H.y,H.z]),E.yaw=Math.atan2(Math.sin(E.yaw),Math.cos(E.yaw)),E.slow=!0,ue()}function ue(){const o=Math.hypot(E.tpos[0]-H.x,E.tpos[1]-H.y,E.tpos[2]-H.z),t=Math.abs(Math.atan2(Math.sin(E.tyaw),Math.cos(E.tyaw)))>.03||Math.abs(E.tpitch)>.03||o>.5;document.body.classList.toggle("moved",t)}const Jt=o=>{var t,e;return(e=(t=o.target).closest)==null?void 0:e.call(t,"button, .tune-ui")};let Wt=typeof st.requestPointerLock=="function";const St=()=>document.pointerLockElement===st;document.addEventListener("pointerlockerror",()=>{Wt=!1});document.addEventListener("pointerlockchange",()=>{document.body.classList.toggle("locked",St()),!St()&&mt&&(mt=!1,pt())});function Jo(){var o;try{const t=st.requestPointerLock();(o=t==null?void 0:t.catch)==null||o.call(t,()=>{Wt=!1})}catch{Wt=!1}}addEventListener("pointerdown",o=>{if(!Jt(o)){if(Tt(),o.pointerType==="mouse"&&Wt){St()||Jo(),mt=!0,ie();return}try{st.setPointerCapture(o.pointerId)}catch{}G.set(o.pointerId,{x:o.clientX,y:o.clientY,x0:o.clientX,y0:o.clientY}),G.size===1?(ft=!1,ie()):($e(),ft=!0,pt())}});function $e(){if(G.size===2){const[o,t]=[...G.values()];gt={d:Math.hypot(o.x-t.x,o.y-t.y)||1}}else gt=null}addEventListener("pointermove",o=>{if(Tt(),St()){const l=c=>Math.max(-200,Math.min(200,c||0));ee(l(o.movementX),l(o.movementY),Te);return}const t=G.get(o.pointerId);if(!t)return;const e=o.clientX-t.x,s=o.clientY-t.y;t.x=o.clientX,t.y=o.clientY;const n=o.pointerType==="mouse"?Te*1.4:Ko;if(G.size===1)!ft&&Math.hypot(t.x-t.x0,t.y-t.y0)>6&&(ft=!0,pt()),ft&&ee(e,s,n);else if(G.size===2&&gt){const[l,c]=[...G.values()],r=Math.hypot(l.x-c.x,l.y-c.y)||1;Et((r-gt.d)*.12),gt.d=r,ee(e/2,s/2,n)}});function We(o){o.pointerType==="mouse"&&mt&&(mt=!1,pt()),G.delete(o.pointerId),$e(),G.size===0&&(ft=!1,pt())}addEventListener("pointerup",We);addEventListener("pointercancel",We);addEventListener("blur",()=>{G.clear(),ut.clear(),gt=null,ft=!1,Kt=!1,mt=!1,pt()});addEventListener("wheel",o=>{if(Jt(o))return;o.preventDefault(),Tt();const t=o.deltaMode===1?o.deltaY*16:o.deltaMode===2?o.deltaY*innerHeight:o.deltaY;Et(-Math.max(-240,Math.min(240,t))*.03)},{passive:!1});const Vt={KeyW:[1,0],ArrowUp:[1,0],KeyS:[-1,0],ArrowDown:[-1,0],KeyD:[0,1],ArrowRight:[0,1],KeyA:[0,-1],ArrowLeft:[0,-1]};addEventListener("keydown",o=>{if(Tt(),Jt(o)&&/^(INPUT|SELECT)$/.test(o.target.tagName))return;if(o.metaKey||o.ctrlKey||o.altKey){ut.clear();return}const t=o.key;if(o.code in Vt||o.key==="Shift")ut.add(o.key==="Shift"?"Shift":o.code);else if(t==="+"||t==="=")Et(3);else if(t==="-"||t==="_")Et(-3);else{if(o.repeat)return;if(o.code==="Space")Kt=!0,ie();else if(o.code==="KeyM")Ye();else if(o.code==="KeyF")Ze();else if(o.code==="KeyR"||t==="0")Ve();else return}o.preventDefault()});addEventListener("keyup",o=>{ut.delete(o.code),o.key==="Shift"&&ut.delete("Shift"),o.key==="Meta"&&ut.clear(),o.code==="Space"&&(Kt=!1,(G.size===0||ft)&&pt())});addEventListener("dblclick",o=>{!Jt(o)&&!St()&&Ze()});addEventListener("contextmenu",o=>o.preventDefault());function Ze(){var o,t,e;document.fullscreenElement?(o=document.exitFullscreen)==null||o.call(document):(e=(t=document.documentElement).requestFullscreen)==null||e.call(t).catch(()=>{})}function Ye(){if(!Z.started){Z.muted=!1,je();return}Z.setMuted(!Z.muted),document.body.classList.toggle("sounding",!Z.muted)}Xo.addEventListener("click",o=>{o.stopPropagation(),Ye()});jo.addEventListener("click",o=>{o.stopPropagation(),Ve()});const at=[[.4,16,6],[.5,20,8],[.6,24,10],[.7,28,12],[.85,32,12],[1,36,14],[1,48,18],[1.25,48,18],[1.5,56,20],[2,64,24]],Qo=83e5,fe=12e3,Zt=navigator.webdriver,A={rung:C.has("rung")?Math.max(0,Math.min(at.length-1,+C.get("rung")|0)):Zt?6:4,ceiling:at.length-1,climbUntil:performance.now()+fe,refresh:1/0,slowStreak:0,samples:[],quietUntil:performance.now()+2500,windowStart:0},ts=C.has("govern")||!C.has("rung")&&!Zt;let Ke=performance.now(),Rt=0,At=performance.now(),Pe=!1;function re(o){const t=Math.sqrt(Qo/Math.max(1,innerWidth*innerHeight));return Math.min(at[o][0],t)}const es=o=>o+1<at.length&&(re(o+1)>re(o)+1e-6||at[o+1][1]>at[o][1]);function os(){const o=re(A.rung),t=Math.max(2,Math.round(innerWidth*o)),e=Math.max(2,Math.round(innerHeight*o));return(st.width!==t||st.height!==e)&&(st.width=t,st.height=e),[t,e,o]}function _e(o,t){o=Math.max(0,Math.min(at.length-1,o)),o!==A.rung&&(A.rung=o,A.slowStreak=0,pe(t))}function pe(o,t=700){A.samples=[],A.quietUntil=o+t}function ss(o,t){if(t<A.quietUntil)return;A.samples.length===0&&(A.windowStart=t),A.samples.push(o);const e=A.samples.length;if(e<45&&!(e>=6&&t-A.windowStart>1500))return;const s=A.samples.slice().sort((a,u)=>a-u);A.samples=[];const n=s[e>>1],l=s[Math.floor(e*.9)];if(A.refresh=Math.max(4,Math.min(A.refresh,s[Math.floor(e*.1)])),A.rung>0&&(n>Math.max(19.5,A.refresh*1.25)||n>40)){const a=n>Math.max(34,A.refresh*2.2)||n>66;A.slowStreak++,(a||A.slowStreak>=2)&&(_e(A.rung-(a?2:1),t),A.ceiling=Math.min(A.ceiling,A.rung));return}A.slowStreak=0,n<A.refresh*1.08&&l<A.refresh*1.4&&n<22&&t<A.climbUntil&&A.rung<A.ceiling&&es(A.rung)&&_e(A.rung+1,t)}function Oe(o,t){let e=1,s=0;for(;o>0;)e/=t,s+=e*(o%t),o=Math.floor(o/t);return s}const Ce=Array.from({length:16},(o,t)=>[Oe(t+1,2)-.5,Oe(t+1,3)-.5]);function oe(o,t,e,s){return{tune:o,palette:Ge(s,o),exposure:U("exp",o.exposure)*(1+.2*I.swell),x0:t,x1:e}}function ns(o){return S.view==="split"?[oe(kt(),0,S.split,o),oe(T,S.split,1,o)]:[oe(S.view==="ref"?kt():T,0,1,o)]}let Fe=null,De=1;const as=118,is=U("adaptkey",-3.8);let Gt=0;function Je(o){const t=o-At;At=o;const e=Math.min(.1,t/1e3);ts&&ss(t,o),Rt++,rs(e),requestAnimationFrame(Je)}function rs(o){if(I.tick(C.has("still")?0:o,Vo),Z.tune=S.view==="ref"?kt():T,Z.update(I,De),!Xt)return;const[t,e,s]=os();Xt.resize(t,e,s)&&(Gt=0);const n=I.wall,[,l,c]=at[A.rung];let r=0,a=0;for(const P of ut)Vt[P]&&(r+=Vt[P][0],a+=Vt[P][1]);if(r||a){const P=(ut.has("Shift")?18:6)*o/Math.hypot(r,a);Et(r*P,a*P)}const u=1-Math.exp(-o/(E.slow?.4:.03));E.yaw+=(E.tyaw-E.yaw)*u,E.pitch+=(E.tpitch-E.pitch)*u;const f=1-Math.exp(-o/(E.slow?.45:.12));E.pos=Mt(E.pos.map((P,vt)=>P+(E.tpos[vt]-P)*f));const i=t/e,h=Math.min(Math.tan(.475)*1.6/i,Math.tan(.75)),p=U("fov",2*Math.atan(Math.max(Math.tan(.475),h))),d=(performance.now()-he)/1e3,x=d<4?0:Math.min(1,(d-4)/8),R=H.yaw+E.yaw+x*.035*Math.sin(n/47),b=Xe(H.pitch+E.pitch+x*.02*Math.sin(n/61+1)+.03*I.hold),g=[.5*x*Math.sin(n/97),.25*x*Math.sin(n/71+2),.4*x*Math.sin(n/89+4)],M=Mt([E.pos[0]+g[0],E.pos[1]+g[1],E.pos[2]+g[2]]),w=[Math.sin(R)*Math.cos(b),Math.sin(b),-Math.cos(R)*Math.cos(b)];K.w=t,K.h=e,K.fov=p,K.pos=M,K.target=[M[0]+w[0],M[1]+w[1],M[2]+w[2]],K.update();{const P=Se(n),vt=[O.HOLE_X-P[0]/P[1]*O.H*.5,O.H*.5,O.HOLE_Z-P[2]/P[1]*O.H*.5],[Ct,Ft,Dt]=K.project(vt),Bt=K.toCam(vt),oo=Math.max(Math.abs(Ct/t-.5),Math.abs(Ft/e-.5));De=Bt[2]<0?Math.max(0,Math.min(1,(.9-oo)/.4))*Math.min(1,40/Dt):0}const k=I.story+as,m=U("roll",1.72+.36*Math.sin(k/31)+.12*Math.sin(k/13+1)),v=U("twist",1+k*Math.PI*2/75+.45*Math.sin(k/17)),y=U("yaw",.25*Math.sin(k/21+.5)),L=U("tilt",-.2+.2*Math.sin(k/17+2)),_=$(se(y),$(Be(L),$(Ie(m),se(v)))),F=.35+.6*Math.min(2,Math.max(0,I.blur));Nt.pose(k,{wind:F,reach:U("reach",I.reach),wall:n,orient:_,preset:C.get("pose")}),Nt.project(nt);const q=-.22+.14*Math.sin(k/89+.7),it=O.HOLE_SPAN/ot,Pt=Se(n);let Q=1e9,z=1e9,rt=-1e9,_t=-1e9;for(const P of Nt.groups)Q=Math.min(Q,P.cx-P.r),z=Math.min(z,P.cy-P.r),rt=Math.max(rt,P.cx+P.r),_t=Math.max(_t,P.cy+P.r);const de=Math.cos(q),me=Math.sin(q),N=[1e9,1e9,-1e9,-1e9];for(const[P,vt]of[[Q,z],[rt,z],[Q,_t],[rt,_t]]){const Ct=(Math.max(0,Math.min(ot,P))/ot-.5)*O.HOLE_SPAN,Ft=(Math.max(0,Math.min(ot,vt))/ot-.5)*O.HOLE_SPAN,Dt=O.HOLE_X+de*Ct-me*Ft,Bt=O.HOLE_Z+me*Ct+de*Ft;N[0]=Math.min(N[0],Dt),N[1]=Math.min(N[1],Bt),N[2]=Math.max(N[2],Dt),N[3]=Math.max(N[3],Bt)}const Ot=.8,to=[N[0]-Ot,N[1]-Ot,N[2]+Ot,N[3]+Ot],ve=K.viewProj(),eo=Math.max(1/(Gt+1),Zt||C.has("still")?.06:.12),Qt=C.has("t")?1:Math.min(1,(performance.now()-Ke)/5e3);Xt.render({figure:Nt,cam:K,prevViewProj:Fe??ve,histValid:Gt>0,blend:eo,jitter:Ce[Rt%Ce.length],frame:Rt,steps:l,reflSteps:c,sun:Pt,cookieRot:q,cookieM:it,beamBox:to,story:k,wall:n,drift:I.fall*.0021%1,dustFall:I.fall*.05,shutter:.04*Math.max(.12,I.blur),focus:45,dust:!C.has("nodust"),exposure:U("exp",T.exposure)*(1+.2*I.swell),tune:T,palette:Ge(n,T),sides:ns(n),fade:Qt*Qt,dt:o,adaptKey:is,logAdapt:C.has("adaptlog")&&Rt%4===0,pr:s,debug:C.has("cookie")}),Fe=ve,Gt++,!Pe&&Qt>=1&&Rt>(Zt?14:8)&&(Pe=!0,document.body.classList.add("ready"))}addEventListener("resize",()=>{const o=performance.now();pe(o),A.ceiling=at.length-1,A.climbUntil=o+fe,A.slowStreak=0});document.addEventListener("visibilitychange",()=>{At=performance.now(),pe(At,1500),document.hidden&&pt(),Z.setHidden(document.hidden)});Tt();const jt=[];function Qe(o){if(jt.push(o),jt.length<18){requestAnimationFrame(Qe);return}const t=jt.slice(1).map((e,s)=>e-jt[s]).sort((e,s)=>e-s);A.refresh=Math.max(4,t[t.length>>1]),At=o,Ke=o,A.quietUntil=o+2500,A.climbUntil=o+fe,requestAnimationFrame(Je)}requestAnimationFrame(Qe);
