(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const c of a)if(c.type==="childList")for(const l of c.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&s(l)}).observe(document,{childList:!0,subtree:!0});function e(a){const c={};return a.integrity&&(c.integrity=a.integrity),a.referrerPolicy&&(c.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?c.credentials="include":a.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function s(a){if(a.ep)return;a.ep=!0;const c=e(a);fetch(a.href,c)}})();function He(o){const t=o.getContext("webgl2",{antialias:!1,alpha:!1,depth:!1,stencil:!1,premultipliedAlpha:!1,preserveDrawingBuffer:!1,powerPreference:"high-performance"});if(!t)return null;const e=!!(t.getExtension("EXT_color_buffer_float")||t.getExtension("EXT_color_buffer_half_float"));return t.getExtension("OES_texture_float_linear"),{gl:t,floatOk:e}}function oe(o,t,e){const s=o.createShader(t);if(o.shaderSource(s,e),o.compileShader(s),!o.getShaderParameter(s,o.COMPILE_STATUS)){const a=o.getShaderInfoLog(s),c=e.split(`
`).map((l,r)=>`${String(r+1).padStart(3)} ${l}`).join(`
`);throw new Error(`shader compile failed:
${a}
${c}`)}return s}function J(o,t,e,s=""){if(s){const r=e.indexOf(`
`);e=e.slice(0,r+1)+s+e.slice(r+1)}const a=o.createProgram();if(o.attachShader(a,oe(o,o.VERTEX_SHADER,t)),o.attachShader(a,oe(o,o.FRAGMENT_SHADER,e)),o.linkProgram(a),!o.getProgramParameter(a,o.LINK_STATUS))throw new Error(`link failed: ${o.getProgramInfoLog(a)}`);const c={},l=o.getProgramParameter(a,o.ACTIVE_UNIFORMS);for(let r=0;r<l;r++){const n=o.getActiveUniform(a,r),h=n.name.replace(/\[0\]$/,"");c[h]=o.getUniformLocation(a,n.name)}return{p:a,u:c}}function G(o,t,e,{float:s=!0,linear:a=!0,channels:c=4}={}){const l=o.createTexture();o.bindTexture(o.TEXTURE_2D,l);let r,n,h;s?(r=c===2?o.RG16F:o.RGBA16F,n=c===2?o.RG:o.RGBA,h=o.HALF_FLOAT):(r=o.RGBA8,n=o.RGBA,h=o.UNSIGNED_BYTE),o.texImage2D(o.TEXTURE_2D,0,r,t,e,0,n,h,null);const f=a?o.LINEAR:o.NEAREST;o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,f),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,f),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_S,o.CLAMP_TO_EDGE),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_T,o.CLAMP_TO_EDGE);const i=o.createFramebuffer();o.bindFramebuffer(o.FRAMEBUFFER,i),o.framebufferTexture2D(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,l,0);const u=o.checkFramebufferStatus(o.FRAMEBUFFER)===o.FRAMEBUFFER_COMPLETE;return o.bindFramebuffer(o.FRAMEBUFFER,null),{tex:l,fbo:i,w:t,h:e,ok:u}}function se(o,t){t&&(o.deleteTexture(t.tex),o.deleteFramebuffer(t.fbo))}function X(o,t){t?(o.bindFramebuffer(o.FRAMEBUFFER,t.fbo),o.viewport(0,0,t.w,t.h)):(o.bindFramebuffer(o.FRAMEBUFFER,null),o.viewport(0,0,o.drawingBufferWidth,o.drawingBufferHeight))}function C(o,t,e,s){o.activeTexture(o.TEXTURE0+t),o.bindTexture(o.TEXTURE_2D,e),s&&o.uniform1i(s,t)}function Ne(o){const t=o.createVertexArray();return()=>{o.bindVertexArray(t),o.drawArrays(o.TRIANGLES,0,3)}}const T={HALF_W:46,Z0:-128,Z1:72,H:30,SLAB:1.1,PIER_X:27,PIER_HALF:1.8,PIER_Z0:-119,PIER_DZ:19,PIER_N:10,HOLE_X:4,HOLE_Z:-16,HOLE_SPAN:26},qe=9;function Ge(){return Object.entries(T).map(([o,t])=>Number.isInteger(t)&&o.endsWith("_N")?`#define ROOM_${o} ${t}
`:`#define ROOM_${o} ${t.toFixed(4)}
`).join("")}const Xe=.9;function bt(o){const t=T,e=Xe;let[s,a,c]=o;s=Math.max(-46+e,Math.min(t.HALF_W-e,s)),c=Math.max(t.Z0+e,Math.min(t.Z1-e,c)),a=Math.max(.6,Math.min(t.H-1.5,a));for(const l of[-27,t.PIER_X]){const r=Math.round((c-t.PIER_Z0)/t.PIER_DZ);if(r<0||r>=t.PIER_N)continue;const n=t.PIER_Z0+r*t.PIER_DZ,h=t.PIER_HALF+e,f=s-l,i=c-n;Math.abs(f)<h&&Math.abs(i)<h&&(h-Math.abs(f)<h-Math.abs(i)?s=l+Math.sign(f||1)*h:c=n+Math.sign(i||1)*h)}return s=Math.max(-46+e,Math.min(t.HALF_W-e,s)),c=Math.max(t.Z0+e,Math.min(t.Z1-e,c)),[s,a,c]}function V(o,t){const e=new Array(9);for(let s=0;s<3;s++)for(let a=0;a<3;a++)e[s*3+a]=o[s*3]*t[a]+o[s*3+1]*t[3+a]+o[s*3+2]*t[6+a];return e}function j(o,t){return[o[0]*t[0]+o[1]*t[1]+o[2]*t[2],o[3]*t[0]+o[4]*t[1]+o[5]*t[2],o[6]*t[0]+o[7]*t[1]+o[8]*t[2]]}const ye=o=>{const t=Math.cos(o),e=Math.sin(o);return[1,0,0,0,t,-e,0,e,t]},Vt=o=>{const t=Math.cos(o),e=Math.sin(o);return[t,0,e,0,1,0,-e,0,t]},be=o=>{const t=Math.cos(o),e=Math.sin(o);return[t,-e,0,e,t,0,0,0,1]},Pt=(o,t,e)=>V(be(e),V(ye(o),Vt(t))),D=(o,t)=>[o[0]+t[0],o[1]+t[1],o[2]+t[2]],$t=(o,t)=>[o[0]-t[0],o[1]-t[1],o[2]-t[2]],Q=(o,t)=>[o[0]*t,o[1]*t,o[2]*t],je=o=>Math.hypot(o[0],o[1],o[2]),ct=o=>{const t=je(o)||1;return[o[0]/t,o[1]/t,o[2]/t]},Ut=(o,t)=>[o[1]*t[2]-o[2]*t[1],o[2]*t[0]-o[0]*t[2],o[0]*t[1]-o[1]*t[0]];class we{constructor(){this.pos=[0,0,5],this.target=[0,0,0],this.fov=.6,this.w=1,this.h=1,this.near=.05,this.update()}update(){const t=ct($t(this.target,this.pos)),e=ct(Ut(t,[0,1,0])),s=Ut(e,t);this.R=[e[0],e[1],e[2],s[0],s[1],s[2],-t[0],-t[1],-t[2]],this.focal=1/Math.tan(this.fov/2),this.pxPerUnit=this.focal*this.h/2}forward(){return[-this.R[6],-this.R[7],-this.R[8]]}toCam(t){return j(this.R,$t(t,this.pos))}project(t){const e=this.toCam(t),s=Math.max(-e[2],this.near),a=this.pxPerUnit/s;return[this.w/2+e[0]*a,this.h/2+e[1]*a,s]}viewProj(){const t=this.R,e=this.pos,s=[-(t[0]*e[0]+t[1]*e[1]+t[2]*e[2]),-(t[3]*e[0]+t[4]*e[1]+t[5]*e[2]),-(t[6]*e[0]+t[7]*e[1]+t[8]*e[2])],a=this.w/this.h,c=this.focal,l=this.near,r=100,n=c/a,h=c,f=(r+l)/(l-r),i=2*r*l/(l-r),u=new Float32Array(16);for(let p=0;p<4;p++){const d=p<3?t[p]:s[0],m=p<3?t[3+p]:s[1],y=p<3?t[6+p]:s[2],v=p<3?0:1;u[p*4+0]=n*d,u[p*4+1]=h*m,u[p*4+2]=f*y+i*v,u[p*4+3]=-y}return u}}const $=`#version 300 es
precision highp float;
precision highp int;
precision highp sampler3D;
`,Nt=`
float sdfDecode(vec4 v) {
#ifdef SDF8
  float fine = (v.r - 0.5) * 256.0;
  return abs(fine) < 120.0 ? fine : (v.b - 0.5) * 8192.0;
#else
  return v.r;
#endif
}
`,Mt=`
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
`,Yt=`
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
`,st=`${$}
out vec2 vUv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2)) * 2.0 - 1.0;
  vUv = p * 0.5 + 0.5;
  gl_Position = vec4(p, 0.0, 1.0);
}`,Ve=`${$}
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
}`,$e=`${$}
${Nt}
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
}`,Re=`
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
`,We=`${$}
${Nt}
${Mt}
${Yt}
${Re}
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
}`,Ze=`${$}
${Mt}
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
}`,Ye=`${$}
${Nt}
${Mt}
${Yt}
${Re}
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
}`,Ke=`${$}
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
}`,Je=`${$}
${Mt}
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
}`,Qe=`${$}
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
}`,to=`${$}
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
}`,eo=`${$}
${Nt}
${Mt}
${Yt}
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
}`,oo=6,tt=640;function so(o=64){const t=new Uint8Array(o*o*o*2);let e=9001;const s=()=>(e=e*16807%2147483647)/2147483647,a=f=>{const i=new Float32Array(f*f*f);for(let u=0;u<i.length;u++)i[u]=s();return i},c=f=>f*f*(3-2*f),l=(f,i,u,p,d)=>{const m=u*i/o,y=p*i/o,v=d*i/o,x=Math.floor(m),b=Math.floor(y),g=Math.floor(v),k=c(m-x),M=c(y-b),E=c(v-g),_=(H,B,N)=>f[(N%i+i)%i*i*i+(B%i+i)%i*i+(H%i+i)%i],L=(H,B,N)=>H+(B-H)*N;return L(L(L(_(x,b,g),_(x+1,b,g),k),L(_(x,b+1,g),_(x+1,b+1,g),k),M),L(L(_(x,b,g+1),_(x+1,b,g+1),k),L(_(x,b+1,g+1),_(x+1,b+1,g+1),k),M),E)},r=[[a(4),4,.55],[a(8),8,.3],[a(16),16,.15]],n=[[a(8),8,.6],[a(16),16,.4]];let h=0;for(let f=0;f<o;f++)for(let i=0;i<o;i++)for(let u=0;u<o;u++,h+=2){let p=0,d=0;for(const[m,y,v]of r)p+=l(m,y,u,i,f)*v;for(const[m,y,v]of n)d+=l(m,y,u,i,f)*v;t[h]=Math.round(p*255),t[h+1]=Math.round(d*255)}return{data:t,n:o}}class ao{constructor(t,{force8:e=!1}={}){const s=He(t);if(!s)throw new Error("webgl2");this.gl=s.gl,this.floatOk=s.floatOk&&!e;const a=this.gl;if(this.floatOk){const h=[G(a,4,4,{float:!0}),G(a,4,4,{float:!0,channels:2})];this.floatOk=h.every(f=>f.ok);for(const f of h)se(a,f)}this.canvas=t,this.quad=Ne(a);const c=this.floatOk?"":`#define SDF8
`,l=Ge();this.pSil=J(a,st,Ve,c),this.pEmit=J(a,st,$e,c),this.pHall=J(a,st,We,c+l),this.pResolve=J(a,st,Ze,c),this.pDust=J(a,no(Ye,c+l),Ke),this.pDown=J(a,st,Je,c),this.pUp=J(a,st,Qe),this.pFinal=J(a,st,eo,c),this.pAdapt=J(a,st,to),this.primTex=a.createTexture(),a.bindTexture(a.TEXTURE_2D,this.primTex),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.NEAREST),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,a.NEAREST),a.texImage2D(a.TEXTURE_2D,0,a.RGBA32F,400,1,0,a.RGBA,a.FLOAT,null),this.cookie=G(a,tt,tt,{float:this.floatOk,channels:this.floatOk?2:4}),this.emitters=G(a,4,4,{float:!1,linear:!1}),this.emitPBO=a.createBuffer(),a.bindBuffer(a.PIXEL_PACK_BUFFER,this.emitPBO),a.bufferData(a.PIXEL_PACK_BUFFER,64,a.STREAM_READ),a.bindBuffer(a.PIXEL_PACK_BUFFER,null),this.emitBytes=new Uint8Array(64),this.emitFence=null,this.emitRead=!1,this.patches=new Float32Array(64),this.adapt=this.floatOk?[G(a,1,1,{linear:!1}),G(a,1,1,{linear:!1})]:null,this.adaptFlip=0,this.adaptFresh=!0;const{data:r,n}=so(64);this.noise=a.createTexture(),a.bindTexture(a.TEXTURE_3D,this.noise),a.pixelStorei(a.UNPACK_ALIGNMENT,1),a.texImage3D(a.TEXTURE_3D,0,a.RG8,n,n,n,0,a.RG,a.UNSIGNED_BYTE,r),a.pixelStorei(a.UNPACK_ALIGNMENT,4),a.texParameteri(a.TEXTURE_3D,a.TEXTURE_MIN_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_3D,a.TEXTURE_MAG_FILTER,a.LINEAR);for(const h of[a.TEXTURE_WRAP_S,a.TEXTURE_WRAP_T,a.TEXTURE_WRAP_R])a.texParameteri(a.TEXTURE_3D,h,a.REPEAT);a.bindTexture(a.TEXTURE_3D,null),this.initDust(),console.info(`cenotaph: ${this.floatOk?"float":"8-bit"} targets`),this.w=0,this.h=0,this.flip=0}initDust(){const t=this.gl,e=9e3,s=new Float32Array(e*4),a=new Float32Array(e*4);let c=4242;const l=()=>(c=c*16807%2147483647)/2147483647;for(let n=0;n<e;n++){s.set([l(),l(),l(),l()],n*4);const h=.25+l()*.75,f=.004+Math.pow(l(),3)*.02,i=.3+Math.pow(l(),2)*1.7;a.set([h,f,i,0],n*4)}this.dustCount=e,this.vao=t.createVertexArray(),t.bindVertexArray(this.vao);const r=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,r),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),t.STATIC_DRAW),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,2,t.FLOAT,!1,0,0);for(const[n,h]of[[1,s],[2,a]]){const f=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,f),t.bufferData(t.ARRAY_BUFFER,h,t.STATIC_DRAW),t.enableVertexAttribArray(n),t.vertexAttribPointer(n,4,t.FLOAT,!1,0,0),t.vertexAttribDivisor(n,1)}t.bindVertexArray(null)}resize(t,e,s=1){if(t===this.w&&e===this.h&&s===this.pr)return!1;const a=this.gl;this.w=t,this.h=e,this.pr=s;for(const n of[this.cur,this.dust,...this.hist??[],...this.bloom??[]])se(a,n);const c={float:this.floatOk};this.cur=G(a,t,e,{float:this.floatOk,linear:!1}),this.hist=[G(a,t,e,c),G(a,t,e,c)],this.dust=G(a,t,e,c),this.bloom=[];let l=t/s,r=e/s;for(let n=0;n<oo;n++)l=Math.max(1,Math.ceil(l/2)),r=Math.max(1,Math.ceil(r/2)),this.bloom.push(G(a,l,r,c));return!0}hallUniforms(t,e){const s=this.gl;s.uniform2f(t.uCookieRot,Math.cos(e.cookieRot),Math.sin(e.cookieRot)),s.uniform1f(t.uCookieM,e.cookieM),s.uniform3fv(t.uSun,e.sun),s.uniform2f(t.uSunXZ,e.sun[0]/e.sun[1],e.sun[2]/e.sun[1]),s.uniform3fv(t.uSunColor,e.palette.sun),s.uniform3fv(t.uSkyColor,e.palette.sky),s.uniform3fv(t.uFogColor,e.palette.fog),s.uniform4fv(t.uBeamBox,e.beamBox);const a=e.sun,c=ct(Ut(a,[0,0,1]));s.uniform3fv(t.uBeamB,c),s.uniform3fv(t.uBeamC,Ut(a,c)),s.uniform1f(t.uTime,e.story),s.uniform1f(t.uDrift,e.drift);const l=e.tune;s.uniform3f(t.uFog,l.fogBase,l.fogLow,l.fogHeight),s.uniform4f(t.uDust,l.dustFloor,l.dustAmount,l.dustLo,l.dustHi),s.uniform2f(t.uDustScale,l.dustAcross,l.dustAlong),s.uniform1f(t.uPhaseG,l.phaseG),s.uniform1f(t.uSunSpread,l.spread),s.uniform1f(t.uBounceGain,l.bounce),s.uniform4f(t.uFloor,l.polish,l.roughLo,l.roughHi,l.floorAlbedo)}camUniforms(t,e){const s=this.gl,a=e.R;s.uniform3fv(t.uCamPos,e.pos),s.uniform3f(t.uRight,a[0],a[1],a[2]),s.uniform3f(t.uUp,a[3],a[4],a[5]),s.uniform3f(t.uFwd,-a[6],-a[7],-a[8]),s.uniform1f(t.uFocal,e.focal),s.uniform1f(t.uAspect,this.w/this.h)}emitUniforms(t,e){const s=this.gl,a=this.emitBytes,c=T.HOLE_SPAN,l=Math.cos(e.cookieRot),r=Math.sin(e.cookieRot);let n=0,h=0,f=0,i=0;for(let M=0;M<16;M++){const E=a[M*4]/255*(c/4)**2;if(E<.01)continue;const _=(((M&3)+a[M*4+1]/255)/4-.5)*c,L=(((M>>2)+a[M*4+2]/255)/4-.5)*c,H=T.HOLE_X+l*_-r*L,B=T.HOLE_Z+r*_+l*L;this.patches.set([H,B,E,0],n*4),n++,h+=H*E,f+=B*E,i+=E}const[u,p,d]=e.sun,m=i>0?h/i:T.HOLE_X,y=i>0?f/i:T.HOLE_Z;s.uniform4fv(t.uPatch,this.patches),s.uniform1i(t.uPatchN,n),s.uniform3f(t.uSkyC,m,T.H,y),s.uniform3f(t.uPoolC,m-u/p*T.H,0,y-d/p*T.H),s.uniform1f(t.uArea,i);const v=e.tune,x=T.H,b=v.fogHeight,g=v.fogBase*x/p+v.fogLow*(b/p)*(1-Math.exp(-x/b)),k=p*.24/Math.PI*Math.exp(-g);s.uniform3f(t.uPoolRad,e.palette.sun[0]*k,e.palette.sun[1]*k,e.palette.sun[2]*k)}render(t){const e=this.gl,{w:s,h:a}=this,c=t.figure;this.emitFence&&e.clientWaitSync(this.emitFence,0,0)!==e.TIMEOUT_EXPIRED&&(e.deleteSync(this.emitFence),this.emitFence=null,e.bindBuffer(e.PIXEL_PACK_BUFFER,this.emitPBO),e.getBufferSubData(e.PIXEL_PACK_BUFFER,0,this.emitBytes),e.bindBuffer(e.PIXEL_PACK_BUFFER,null)),e.bindTexture(e.TEXTURE_2D,this.primTex),e.texSubImage2D(e.TEXTURE_2D,0,0,0,c.count*2,1,e.RGBA,e.FLOAT,c.data,0),X(e,this.cookie),e.useProgram(this.pSil.p),C(e,0,this.primTex,this.pSil.u.uPrims);const l=new Float32Array(48),r=new Int32Array(24);c.groups.slice(0,12).forEach((d,m)=>{l.set([d.cx,d.cy,d.r,d.k+2],m*4),r.set([d.start,d.count],m*2)}),e.uniform4fv(this.pSil.u.uGroups,l),e.uniform2iv(this.pSil.u.uRanges,r),e.uniform1i(this.pSil.u.uGroupCount,Math.min(12,c.groups.length)),this.quad(),X(e,this.emitters),e.useProgram(this.pEmit.p),C(e,0,this.cookie.tex,this.pEmit.u.uCookie),this.quad(),this.emitRead?this.emitFence||(e.bindBuffer(e.PIXEL_PACK_BUFFER,this.emitPBO),e.readPixels(0,0,4,4,e.RGBA,e.UNSIGNED_BYTE,0),e.bindBuffer(e.PIXEL_PACK_BUFFER,null),this.emitFence=e.fenceSync(e.SYNC_GPU_COMMANDS_COMPLETE,0)):(e.readPixels(0,0,4,4,e.RGBA,e.UNSIGNED_BYTE,this.emitBytes),this.emitRead=!0),X(e,this.cur),e.useProgram(this.pHall.p);let n=this.pHall.u;C(e,0,this.cookie.tex,n.uCookie),this.emitUniforms(n,t),e.activeTexture(e.TEXTURE2),e.bindTexture(e.TEXTURE_3D,this.noise),e.uniform1i(n.uNoise,2),this.hallUniforms(n,t),this.camUniforms(n,t.cam),e.uniform2f(n.uRes,s,a),e.uniform2f(n.uJitter,t.jitter[0],t.jitter[1]),e.uniform1i(n.uFrame,t.frame),e.uniform1i(n.uSteps,t.steps),e.uniform1i(n.uReflSteps,t.reflSteps),this.quad(),e.activeTexture(e.TEXTURE2),e.bindTexture(e.TEXTURE_3D,null);const h=this.hist[this.flip],f=this.hist[1-this.flip];this.flip=1-this.flip,X(e,f),e.useProgram(this.pResolve.p),n=this.pResolve.u,C(e,0,this.cur.tex,n.uCur),C(e,1,h.tex,n.uHist),this.camUniforms(n,t.cam),e.uniform2f(n.uRes,s,a),e.uniformMatrix4fv(n.uPrevViewProj,!1,t.prevViewProj),e.uniform1f(n.uBlend,t.blend),e.uniform1f(n.uValid,t.histValid?1:0),this.quad();const i=f;X(e,this.dust),e.clearColor(0,0,0,1),e.clear(e.COLOR_BUFFER_BIT),e.enable(e.BLEND),e.blendFunc(e.ONE,e.ONE),e.useProgram(this.pDust.p),n=this.pDust.u,C(e,0,this.cookie.tex,n.uCookie),C(e,3,this.cur.tex,n.uScene),this.hallUniforms(n,t),e.uniformMatrix4fv(n.uViewProj,!1,t.cam.viewProj()),e.uniform2f(n.uRes,s,a),e.uniform1f(n.uFall,t.dustFall),e.uniform1f(n.uShutter,t.shutter),e.uniform3fv(n.uCamPos,t.cam.pos),e.uniform1f(n.uPxPerUnit,t.cam.pxPerUnit),e.uniform1f(n.uFocus,t.focus),e.uniform1f(n.uMoteGlow,t.tune.moteGlow),e.bindVertexArray(this.vao),e.drawArraysInstanced(e.TRIANGLE_STRIP,0,4,t.dust?Math.round(this.dustCount*t.tune.motes):0),e.bindVertexArray(null),e.disable(e.BLEND),e.useProgram(this.pDown.p);let u=i;for(const d of this.bloom){X(e,d),C(e,0,u.tex,this.pDown.u.uSrc);const m=Math.max(1,u.w/d.w/2);e.uniform2f(this.pDown.u.uTexel,m/u.w,m/u.h),e.uniform1i(this.pDown.u.uFirst,u===i?1:0),this.quad(),u=d}let p=null;if(this.adapt){const d=this.adapt[this.adaptFlip],m=this.adapt[1-this.adaptFlip];this.adaptFlip=1-this.adaptFlip,X(e,m),e.useProgram(this.pAdapt.p),C(e,0,this.bloom[this.bloom.length-1].tex,this.pAdapt.u.uSrc),C(e,1,d.tex,this.pAdapt.u.uPrev),e.uniform1f(this.pAdapt.u.uDt,this.adaptFresh?-1:t.dt),this.quad(),this.adaptFresh=!1,p=m}e.useProgram(this.pUp.p),e.enable(e.BLEND),e.blendFunc(e.CONSTANT_COLOR,e.ONE),e.blendColor(.55,.55,.55,1);for(let d=this.bloom.length-1;d>0;d--){const m=this.bloom[d],y=this.bloom[d-1];X(e,y),C(e,0,m.tex,this.pUp.u.uSrc),e.uniform2f(this.pUp.u.uTexel,1/m.w,1/m.h),this.quad()}if(e.disable(e.BLEND),X(e,null),e.useProgram(this.pFinal.p),n=this.pFinal.u,C(e,0,i.tex,n.uScene),C(e,1,this.bloom[0].tex,n.uBloom),C(e,2,this.cookie.tex,n.uCookie),C(e,3,this.dust.tex,n.uDust),C(e,4,(p??this.cookie).tex,n.uAdapt),e.uniform1i(n.uAdaptOn,p?1:0),e.uniform1f(n.uKey,t.adaptKey),e.uniform2f(n.uRes,s,a),e.uniform1f(n.uTime,t.wall),e.uniform1f(n.uFade,t.fade),e.uniform1f(n.uExposure,t.exposure),e.uniform1f(n.uBloomAmt,t.tune.bloom),e.uniform1f(n.uGrain,t.tune.grain),e.uniform1f(n.uFringe,t.tune.fringe),e.uniform1f(n.uPx,t.pr??1),e.uniform1i(n.uDebug,t.debug?1:0),this.quad(),t.logAdapt&&p){X(e,p);const d=new Float32Array(4);e.readPixels(0,0,1,1,e.RGBA,e.FLOAT,d),X(e,null),console.info(`cenotaph: adapted log luminance ${d[0].toFixed(3)}`)}}}function no(o,t){const e=o.indexOf(`
`);return o.slice(0,e+1)+t+o.slice(e+1)}const Lt=190,Me=[[.023,.044,.04],[.008,.048,.045],[-.0085,.045,.041],[-.023,.035,.031]],ut=[["pelvis",null,[0,0,0]],["spine","pelvis",[0,.1,-.01]],["chest","spine",[0,.17,0]],["neck","chest",[0,.25,-.025]],["head","neck",[0,.1,.012]]];for(const o of["L","R"]){const t=o==="L"?1:-1;ut.push(["clav"+o,"chest",[.02*t,.215,-.01]],["shoulder"+o,"clav"+o,[.155*t,0,-.005]],["elbow"+o,"shoulder"+o,[0,-.29,0]],["wrist"+o,"elbow"+o,[0,-.25,0]],["hip"+o,"pelvis",[.092*t,-.07,0]],["knee"+o,"hip"+o,[0,-.43,0]],["ankle"+o,"knee"+o,[0,-.42,0]]),Me.forEach(([e,s],a)=>{ut.push([`f${a}a${o}`,"wrist"+o,[0,-.092+Math.abs(e)*.18,e]]),ut.push([`f${a}b${o}`,`f${a}a${o}`,[0,-s,0]])}),ut.push(["thumbA"+o,"wrist"+o,[-.006*t,-.022,.03]]),ut.push(["thumbB"+o,"thumbA"+o,[0,-.046,0]])}function io(){const o=[],t=(s,a,c,l,r,n,h)=>o.push({type:0,j:s,a,b:c,ra:l,rb:r,k:n,g:h}),e=(s,a,c,l,r,n)=>o.push({type:1,j:s,c:a,r:c,k:l,g:r,e:n});e("pelvis",[0,0,-.005],[.16,.11,.105],.05,"torso"),e("pelvis",[0,-.06,-.05],[.145,.1,.085],.04,"torso"),e("pelvis",[0,.03,.035],[.13,.09,.07],.04,"torso"),e("spine",[0,.09,-.004],[.122,.19,.086],.05,"torso"),e("chest",[0,.12,-.005],[.148,.16,.102],.05,"torso"),e("chest",[0,.165,.035],[.145,.08,.075],.03,"torso"),e("chest",[0,.17,-.048],[.145,.09,.07],.03,"torso"),t("chest",[-.14,.235,-.02],[.14,.235,-.02],.05,.05,.04,"torso"),t("neck",[0,-.02,0],[0,.11,.012],.05,.044,.03,"torso"),e("head",[0,.1,-.015],[.074,.095,.1],.02,"head"),e("head",[0,.052,.042],[.062,.075,.062],.02,"head"),e("head",[0,.004,.068],[.042,.028,.034],.015,"head"),e("head",[0,.112,.076],[.058,.018,.019],.012,"head"),t("head",[0,.09,.094],[0,.062,.11],.0095,.011,.008,"head"),e("head",[0,.03,.094],[.024,.014,.013],.008,"head"),e("head",[0,.105,-.06],[.082,.092,.082],.02,"head");for(const s of["L","R"]){const a="arm"+s,c="hand"+s,l="leg"+s;e("shoulder"+s,[.004,-.04,0],[.05,.08,.054],.03,a),t("shoulder"+s,[0,0,0],[0,-.29,0],.043,.033,.03,a),e("shoulder"+s,[0,-.15,.01],[.038,.1,.04],.02,a),t("elbow"+s,[0,0,0],[0,-.25,0],.034,.022,.02,a),e("elbow"+s,[0,-.07,0],[.033,.09,.038],.02,a),e("wrist"+s,[0,-.05,0],[.015,.05,.042],.012,c),e("wrist"+s,[-.004,-.036,.024],[.016,.03,.02],.01,c),Me.forEach(([,r,n],h)=>{const f=h===3?.0075:.0088;t(`f${h}a${s}`,[0,0,0],[0,-r,0],f,f*.86,.005,c),t(`f${h}b${s}`,[0,0,0],[0,-n,0],f*.86,f*.62,.004,c)}),t("thumbA"+s,[0,0,0],[0,-.046,0],.012,.0095,.008,c),t("thumbB"+s,[0,0,0],[0,-.034,0],.0095,.007,.004,c),t("hip"+s,[0,0,0],[0,-.43,0],.082,.05,.04,l),e("hip"+s,[0,-.17,.015],[.072,.19,.078],.03,l),t("knee"+s,[0,0,0],[0,-.41,0],.048,.03,.025,l),e("knee"+s,[0,-.12,-.028],[.046,.13,.052],.02,l),t("knee"+s,[0,-.29,-.024],[0,-.425,-.034],.017,.02,.02,l),e("ankle"+s,[0,-.004,0],[.033,.024,.028],.022,l),e("ankle"+s,[0,-.045,-.016],[.028,.027,.03],.025,l),e("ankle"+s,[0,-.038,.058],[.035,.032,.1],.03,l,[.17,0,0]),e("ankle"+s,[0,-.06,.13],[.04,.017,.05],.025,l)}return o}function ro(){const o=[],t=[0,.1,-.015],e=[.08,.1,.105],s=15;for(let a=0;a<s;a++){const l=-.2+(a+.5)/s*2.1,r=Math.sin(a*2.399)*1.15,n=ct([Math.sin(r),Math.cos(l),-Math.sin(l)*Math.cos(r)*.9]),h=[t[0]+n[0]*e[0]*.9,t[1]+n[1]*e[1]*.9,t[2]+n[2]*e[2]*.9],f=Math.floor(a/3);o.push({p:h,n,len:.26+.3*((a*.618+f*.3)%1),width:.015+.011*(a*.382%1),seed:f*2.71+a%3*.23+.7})}return o}const ae=(o,t)=>o===0?Math.max(.0025,t*1.5):Math.max(6e-4,t*.2);function co(o,t){return Math.sin(t*.097+o*1.7)*.5+Math.sin(t*.181+o*3.1)*.3+Math.sin(t*.293+o*5.3)*.2}const ne={spine:[-.1,0,.03],chest:[-.12,.05,.03],neck:[-.15,.25,.05],head:[-.3,.55,.1],clavL:[0,0,.12],shoulderL:[-.3,1.1,1.3],elbowL:[-.85,0,0],wristL:[.35,0,.1],clavR:[0,0,.1],shoulderR:[-.2,.5,.85],elbowR:[-.6,0,0],wristR:[.3,0,.15],hipL:[-.3,.1,.2],kneeL:[.7,0,0],ankleL:[1,0,0],hipR:[-.8,.75,.3],kneeR:[1.55,0,0],ankleR:[.95,0,0]},lo={spine:[.22,0,.05],chest:[.18,-.1,.02],neck:[.15,.2,0],head:[.1,.45,.05],clavL:[0,0,.05],shoulderL:[-.95,.6,.55],elbowL:[-1.35,0,0],wristL:[.4,0,.1],clavR:[0,0,.05],shoulderR:[-.7,.3,.45],elbowR:[-1.5,0,0],wristR:[.35,0,.1],hipL:[-1.35,.25,.15],kneeL:[1.95,0,0],ankleL:[.8,0,0],hipR:[-1.1,.4,.22],kneeR:[1.7,0,0],ankleR:[.85,0,0]},ho={spine:[-.2,0,.02],chest:[-.2,.05,.02],neck:[-.2,.3,.03],head:[-.42,.5,.05],clavL:[0,0,.25],shoulderL:[-2.5,.5,.45],elbowL:[-.45,0,0],wristL:[.25,0,.1],clavR:[0,0,.22],shoulderR:[-2.25,.2,.6],elbowR:[-.6,0,0],wristR:[.3,0,.1],hipL:[-.12,.05,.12],kneeL:[.55,0,0],ankleL:[1.05,0,0],hipR:[-.35,.5,.2],kneeR:[1,0,0],ankleR:[1,0,0]};function uo(o){if(typeof o=="string")return{open:o==="open"?1:0,curl:o==="curl"?1:0,surrender:o==="surrender"?1:0};const t=.5+.5*Math.sin(o/53-1.4),e=.5+.5*Math.sin(o/71-1.57),s=Math.pow(t,3)*.85,a=Math.pow(e,3)*.85*(1-s);return{open:1-s-a,curl:s,surrender:a}}class fo{constructor(){this.joints=ut.map(([t,e,s])=>({name:t,parent:e,offset:s,side:t.endsWith("R")?-1:1,rot:[0,0,0],R:null,p:null})),this.byName=Object.fromEntries(this.joints.map(t=>[t.name,t])),this.shapes=io(),this.roots=ro(),this.data=new Float32Array(Lt*8),this.groups=[],this.count=0,this.hair=[]}pose(t,{wind:e=1,reach:s=0,wall:a=t,orient:c,preset:l}){const r=this.byName,n=v=>co(v,t),h=Math.max(0,e),f=Math.sin(a*.9)*.015,i=uo(l==="open"||l==="curl"||l==="surrender"?l:t),u={};for(const v of Object.keys(ne))u[v]=[0,1,2].map(x=>ne[v][x]*i.open+lo[v][x]*i.curl+ho[v][x]*i.surrender);u.spine[0]+=f,u.chest[0]+=f,u.shoulderL[0]-=h*.15,u.shoulderL[2]+=h*.12,u.shoulderR[0]-=h*.12,u.shoulderR[2]+=h*.15,u.hipL[0]-=h*.08,u.hipR[0]-=h*.08;const p={spine:[.06,.05,.04],chest:[.05,.06,.03],neck:[.08,.15,.05],head:[.12,.25,.08],clavL:[0,0,.05],shoulderL:[.3,.3,.2],elbowL:[.3,0,0],wristL:[.2,.2,.15],clavR:[0,0,.05],shoulderR:[.3,.3,.2],elbowR:[.35,0,0],wristR:[.2,.2,.1],hipL:[.2,.15,.1],kneeL:[.3,0,0],ankleL:[.15,0,0],hipR:[.2,.15,.1],kneeR:[.3,0,0],ankleR:[.15,0,0]};let d=1;for(const v of this.joints){const x=u[v.name],b=p[v.name];if(l==="stand"||!x){v.rot=[0,0,0];continue}v.rot=x.map((g,k)=>g+n(d++*3.7+k)*b[k])}if(l!=="stand"){const v=(g,k)=>g+(k-g)*s,x=r.elbowR.rot,b=r.wristR.rot;r.elbowR.rot=[v(x[0],-.12),0,0],r.wristR.rot=[v(b[0],-.3),b[1],b[2]],r.head.rot[1]-=s*.2;for(const g of["L","R"]){const k=g==="L"?0:50,M=g==="R"?s:0;for(let E=0;E<4;E++){const _=(1.5-E)*(.12+M*.1)+n(30+k+E)*.05,L=(.3+E*.08+n(35+k+E)*.12)*(1-M*.75);r[`f${E}a${g}`].rot=[_,0,-L],r[`f${E}b${g}`].rot=[0,0,-L*1.3]}r["thumbA"+g].rot=[-.75-M*.25+n(40+k)*.1,0,-.3],r["thumbB"+g].rot=[0,0,-.3*(1-M)]}}this.fk(c),l!=="stand"&&this.aimReach(s,a);const m=["pelvis","chest","chest","head","kneeL","kneeR","elbowL","elbowR"],y=[0,0,0];for(const v of m)for(let x=0;x<3;x++)y[x]+=r[v].p[x]/m.length;for(const v of this.joints)v.p=$t(v.p,y);this.torso=Q(D(r.chest.p,r.pelvis.p),.5),this.poseHair(t,h)}fk(t){const e=this.byName;for(const s of this.joints){const a=Pt(s.rot[0],s.rot[1]*s.side,s.rot[2]*s.side);if(!s.parent)s.R=V(t,a),s.p=[0,0,0];else{const c=e[s.parent];s.R=V(c.R,a),s.p=D(c.p,j(c.R,s.offset))}}this.root=t}aimReach(t,e){const s=this.byName,a=s.shoulderR,c=this.reachWall===void 0?0:Math.min(.1,Math.max(0,e-this.reachWall));if(this.reachWall=e,this.reachAim||(this.reachAim=a.rot.slice()),t>.001){const r=s.clavR.R,n=a.rot[1];let h=null,f=-1e9;const i=(p,d)=>{const m=V(r,Pt(p,-n,-d)),y=-m[4],v=-m[7];return y+.12*v-.04*(Math.abs(p-a.rot[0])+Math.abs(d-a.rot[2]))};if(this.reachGoal)h=this.reachGoal.slice(),f=i(h[0],h[1]);else for(let p=-3;p<=.6;p+=.2)for(let d=-.2;d<=2.6;d+=.2){const m=i(p,d);m>f&&(f=m,h=[p,d])}for(const p of[.08,.08,.03,.03])for(const d of[-p,0,p])for(const m of[-p,0,p]){const y=i(h[0]+d,h[1]+m);y>f&&(f=y,h=[h[0]+d,h[1]+m])}this.reachGoal=h;const u=1-Math.exp(-c/.45);this.reachAim[0]+=(this.reachGoal[0]-this.reachAim[0])*u,this.reachAim[2]+=(this.reachGoal[1]-this.reachAim[2])*u}else this.reachAim=a.rot.slice(),this.reachGoal=null;const l=t*t*(3-2*t);a.rot=[a.rot[0]+(this.reachAim[0]-a.rot[0])*l,a.rot[1],a.rot[2]+(this.reachAim[2]-a.rot[2])*l],this.fk(this.root)}poseHair(t,e){const s=this.byName.head,a=[0,1,0],c=[1,0,0],l=[0,0,1],r=7,n=Math.min(1.4,e),h=this.hairT===void 0?0:Math.max(0,t-this.hairT);this.hairT=t,this.hairPhase=(this.hairPhase??t)+h*(.9+.5*n);const f=this.hairPhase;this.hair=this.roots.map(i=>{const u=[D(s.p,j(s.R,i.p))],p=j(s.R,i.n),d=i.len/r,m=i.seed;let y=p;for(let v=1;v<=r;v++){const x=v/r,b=m*3.1+f-x*3.4,g=(.15+.57*x)*(.6+.35*(1-Math.min(1,n))),k=D(Q(c,Math.sin(b)*g),Q(l,Math.sin(b*.73+m)*g*.8)),M=D(D(Q(p,.7*(1-x)+.1),Q(a,n*(.7+1.1*x))),k);M[1]=Math.max(M[1],.15);const E=ct(M);y=ct(D(Q(y,.35),Q(E,.65+.3*x))),u.push(D(u[u.length-1],Q(y,d)))}return{pts:u,width:i.width}})}pack3D(){const t=this.data3??(this.data3=new Float32Array(Lt*16)),e=this.byName;let s=0;const a=new Map,c=[],l=(r,n,h)=>{if(s>=Lt)return;n.forEach((i,u)=>t.set(i,s*16+u*4)),a.has(r)||(a.set(r,{start:s,count:0,lo:[1e9,1e9,1e9],hi:[-1e9,-1e9,-1e9],k:0}),c.push(r));const f=a.get(r);f.count++;for(const[i,u]of h)for(let p=0;p<3;p++)f.lo[p]=Math.min(f.lo[p],i[p]-u),f.hi[p]=Math.max(f.hi[p],i[p]+u);f.k=Math.max(f.k,n[2][3]<0?n[2][0]:n[0][3]),s++};for(const r of this.shapes){const n=e[r.j],h=n.side;if(r.type===0){const f=D(n.p,j(n.R,[r.a[0]*h,r.a[1],r.a[2]])),i=D(n.p,j(n.R,[r.b[0]*h,r.b[1],r.b[2]]));l(r.g,[[...f,r.ra],[...i,r.rb],[r.k,0,0,-1],[0,0,0,0]],[[f,r.ra],[i,r.rb]])}else{const f=D(n.p,j(n.R,[r.c[0]*h,r.c[1],r.c[2]]));let i=n.R;r.e&&(i=V(i,Pt(r.e[0],r.e[1]*h,r.e[2]*h)));const u=d=>[i[d],i[3+d],i[6+d]],p=Math.max(...r.r);l(r.g,[[...f,r.k],[...u(0),r.r[0]],[...u(1),r.r[1]],[...u(2),r.r[2]]],[[f,p]])}}for(const{pts:r,width:n}of this.hair){const h=r.length-1,f=i=>n*Math.pow(1-i,1.4)+.0016;for(let i=0;i<h;i++){const u=f(i/h),p=f((i+1)/h);l("hair",[[...r[i],u],[...r[i+1],p],[ae(i,u),2,0,-1],[0,0,0,0]],[[r[i],u],[r[i+1],p]])}}return this.count3=s,this.groups3=c.map(r=>{const n=a.get(r),h=n.lo.map((i,u)=>(i+n.hi[u])/2),f=Math.hypot(n.hi[0]-n.lo[0],n.hi[1]-n.lo[1],n.hi[2]-n.lo[2])/2;return{c:h,r:f,k:n.k,start:n.start,count:n.count}}),this}lookPoint(t){const e=this.byName,s=(a,c)=>{var l;return(l=e[a])!=null&&l.p?D(e[a].p,j(e[a].R,c)):null};if(t==="face")return s("head",[0,.065,.07]);if(t==="hand"||t==="handR")return s("wristR",[0,-.085,0]);if(t==="handL")return s("wristL",[0,-.085,0]);if(t==="foot"||t==="footR")return s("ankleR",[0,-.04,.03]);if(t==="footL")return s("ankleL",[0,-.04,.03]);if(t==="hair"){const a=this.hair.flatMap(c=>c.pts);return a.length?Q(a.reduce((c,l)=>D(c,l),[0,0,0]),1/a.length):null}return s(t,[0,0,0])}project(t){const e=this.data;let s=0;const a=new Map,c=this.byName,l=[],r=(i,u,p)=>{if(s>=Lt)return;e.set(u,s*8),e.set(p,s*8+4),a.has(i)||(a.set(i,{start:s,count:0,minX:1e9,minY:1e9,maxX:-1e9,maxY:-1e9,k:0}),l.push(i));const d=a.get(i);return d.count++,s++,d},n=(i,u,p,d)=>{i.minX=Math.min(i.minX,u-d),i.maxX=Math.max(i.maxX,u+d),i.minY=Math.min(i.minY,p-d),i.maxY=Math.max(i.maxY,p+d)};this.pxPerM=t.pxPerUnit/t.project([0,0,0])[2];const h=(i,u,p,d,m,y,v)=>{const x=t.project(i),b=t.project(u),g=p*t.pxPerUnit/x[2],k=d*t.pxPerUnit/b[2],M=m*this.pxPerM,E=r(y,[x[0],x[1],b[0],b[1]],[g,k,v?2:0,M]);E&&(n(E,x[0],x[1],g),n(E,b[0],b[1],k),E.k=Math.max(E.k,M))};for(const i of this.shapes){const u=c[i.j],p=u.side;if(i.type===0){const d=[i.a[0]*p,i.a[1],i.a[2]],m=[i.b[0]*p,i.b[1],i.b[2]];h(D(u.p,j(u.R,d)),D(u.p,j(u.R,m)),i.ra,i.rb,i.k,i.g,!1)}else{const d=D(u.p,j(u.R,[i.c[0]*p,i.c[1],i.c[2]]));let m=u.R;i.e&&(m=V(m,Pt(i.e[0],i.e[1]*p,i.e[2]*p)));const y=V(t.R,m),v=[0,1,2].map(q=>[y[0+q]*i.r[q],y[3+q]*i.r[q]]);let x=0,b=0,g=0;for(const[q,O]of v)x+=q*q,b+=q*O,g+=O*O;const k=t.project(d),M=t.pxPerUnit/k[2];x*=M*M,b*=M*M,g*=M*M;const E=(x+g)/2,_=Math.sqrt(((x-g)/2)**2+b*b),L=E+_,H=Math.max(E-_,1e-6),B=.5*Math.atan2(2*b,x-g),N=Math.sqrt(L),lt=Math.sqrt(H),it=i.k*this.pxPerM,rt=r(i.g,[k[0],k[1],Math.cos(B),Math.sin(B)],[N,lt,1,it]);if(!rt)continue;n(rt,k[0],k[1],N),rt.k=Math.max(rt.k,it)}}for(const{pts:i,width:u}of this.hair){const p=i.length-1,d=m=>u*Math.pow(1-m,1.4)+.0016;for(let m=0;m<p;m++){const y=d(m/p),v=d((m+1)/p);h(i[m],i[m+1],y,v,ae(m,y),"hair",!0)}}this.count=s,this.groups=l.map(i=>{const u=a.get(i),p=(u.minX+u.maxX)/2,d=(u.minY+u.maxY)/2;return{cx:p,cy:d,r:Math.hypot(u.maxX-u.minX,u.maxY-u.minY)/2,start:u.start,count:u.count,k:u.k}});const f=t.project(this.torso);return this.torsoPx=f,this}}const ie=o=>o*o*(3-2*o),po=o=>Math.min(1,Math.max(0,o));function mo(o){let t=o>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function jt(o,t,e,s,a){const c=o-t;return c<=0||c>=e+s+a?0:c<e?ie(c/e):c<e+s?1:1-ie((c-e-s)/a)}const re=1.7,vo=27;class xo{constructor(t=0){this.wall=t,this.story=vo+t*.9,this.fall=t*re,this.rate=1,this.blur=1,this.hold=0,this.holding=!1,this.susp=0,this.rush=0,this.reach=0,this.swell=0;const e=mo(1789);this.suspensions=[],this.rushes=[];let s=40;for(let a=0;a<400;a++){this.suspensions.push(s);const c=80+e()*55;this.rushes.push(s+22+e()*(c-40)),s+=c}}suspensionAt(t){let e=0;for(const s of this.suspensions){if(s>t)break;e=Math.max(e,jt(t,s,5,10,7))}return e}rushAt(t){let e=0;for(const s of this.rushes){if(s>t)break;e=Math.max(e,jt(t,s,3.5,5,5))}return e}reachAt(t){let e=0;for(const s of this.suspensions){if(s>t)break;e=Math.max(e,jt(t,s+4,6,6,8))}return e}tick(t,e=!1){t=Math.min(t,.1),this.wall+=t;const s=this.wall,a=Math.PI*2,c=.9+.3*Math.sin(a*s/67)+.18*Math.sin(a*s/31+1.3)+.08*Math.sin(a*s/13+.4);this.susp=this.suspensionAt(s),this.rush=this.rushAt(s),this.reach=this.reachAt(s);const l=1-Math.exp(-t/.6);this.hold+=((this.holding?1:0)-this.hold)*(1-Math.exp(-t/(this.holding?.9:1.6)));const r=e?.45:1;let n=c*(1+.85*this.rush);n=n*(1-this.susp)+-.06*this.susp,n*=1-.97*this.hold,this.rate+=(n*r-this.rate)*l;let h=c*(1+1.3*this.rush);h=h*(1-this.susp)+1.05*this.susp,h*=1-.45*this.hold,this.blur+=(h*r-this.blur)*l,this.story+=t*Math.min(1.6,Math.max(.025,this.rate)),this.fall+=t*this.rate*re,this.swell=po(this.susp*1+this.hold*.5)}}const go=`
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
`,Ot=[{bass:38,notes:[45,54,57,64],pcs:[0,4,7]},{bass:37,notes:[45,52,57,61],pcs:[7,11,2]},{bass:35,notes:[42,50,54,61],pcs:[9,0,4]},{bass:33,notes:[42,49,54,57],pcs:[4,7,11]},{bass:31,notes:[38,47,54,57],pcs:[5,9,0,4]},{bass:30,notes:[45,50,54,64],pcs:[0,4,7]},{bass:28,notes:[43,50,54,59],pcs:[2,5,9,0]},{bass:33,notes:[40,50,52,55],pcs:[7,0,2,5]}],yo=14,bo={level:.4,reverb:.85,lowCut:40,shepard:1,pad:1,air:1,hall:1,dust:1,breath:1},Wt=["shepard","pad","air","hall","dust","breath"],xt=o=>440*Math.pow(2,(o-69)/12);function Kt(o){let t=o>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function wo(o,t){const e=o.sampleRate,s=Math.floor(e*t),a=o.createBuffer(2,s,e),c=.045;for(let l=0;l<2;l++){const r=a.getChannelData(l),n=Kt(l?7919:104729),h=1-Math.exp(-2*Math.PI*400/e),f=1-Math.exp(-2*Math.PI*3e3/e);let i=0,u=0;const p=Math.floor(e*c);for(let d=p;d<s;d++){const m=(d-p)/e,y=n()*2-1;i+=(y-i)*h,u+=(y-u)*f;const v=i,x=u-i,b=y-u,g=E=>Math.exp(-6.9*m/E),k=1-Math.exp(-m/.07),M=1+.18*Math.exp(-m/2.5)*(Math.cos(2*Math.PI*m/.268)+.6*Math.cos(2*Math.PI*m/.175));r[d]=(v*2.2*g(13)+x*1.1*g(9)+b*.5*g(3.5))*k*M}for(let d=0;d<26;d++){const m=48+Math.pow(n(),.8)*320,y=Math.floor(e*(c+m*.001));y<s&&(r[y]+=(n()<.5?-1:1)*.55*Math.exp(-m/260)*(.4+.6*n()))}}return a}function ce(o,t=6,e=1){const s=o.sampleRate,a=Math.floor(s*t),c=o.createBuffer(2,a,s);for(let l=0;l<2;l++){const r=c.getChannelData(l),n=Kt(e*31+l);let h=0,f=0,i=0;for(let u=0;u<a;u++){const p=n()*2-1;h=.99765*h+p*.099046,f=.963*f+p*.2965164,i=.57*i+p*1.0526913,r[u]=(h+f+i+p*.1848)*.12}}return c}class Ro{constructor({layers:t=Wt,tune:e=bo}={}){this.tune=e,this.started=!1,this.muted=!1,this.ctx=null,this.on=new Set(t),this.rand=Kt(2718)}async start(t){if(this.started)return;this.started=!0;const e=!t;if(e){const s=window.AudioContext||window.webkitAudioContext;t=new s({latencyHint:"playback"}),t.resume()}if(this.ctx=t,this.hasShepard=!1,t.audioWorklet&&this.on.has("shepard")){const s=URL.createObjectURL(new Blob([go],{type:"application/javascript"}));try{await t.audioWorklet.addModule(s),this.hasShepard=!0}catch(a){console.warn("shepard worklet unavailable:",a)}URL.revokeObjectURL(s)}this.build(),this.live=e}build(){const t=this.ctx,e=t.currentTime,s=(i=1)=>{const u=t.createGain();return u.gain.value=i,u};this.g=s,this.master=s(0),this.lowCut=t.createBiquadFilter(),this.lowCut.type="highpass",this.lowCut.frequency.value=this.tune.lowCut,this.lowCut.Q.value=.6;const a=t.createDynamicsCompressor();a.threshold.value=-22,a.knee.value=14,a.ratio.value=3,a.attack.value=.03,a.release.value=.5;const c=t.createDynamicsCompressor();c.threshold.value=-6,c.knee.value=0,c.ratio.value=20,c.attack.value=.002,c.release.value=.2,this.master.connect(this.lowCut).connect(a).connect(c).connect(s(.8)).connect(t.destination),this.master.gain.setValueAtTime(0,e),this.master.gain.linearRampToValueAtTime(1e-4,e+.05),this.master.gain.setTargetAtTime(this.tune.level,e+.05,2.6),this.dry=s(1),this.dry.connect(this.master);const l=(navigator.hardwareConcurrency||4)<=4||matchMedia("(pointer: coarse)").matches;this.verb=t.createConvolver(),this.verb.buffer=wo(t,l?7:12),this.verbIn=s(1),this.verbOut=s(this.tune.reverb),this.verbIn.connect(this.verb).connect(this.verbOut).connect(this.master),this.tape=t.createConstantSource(),this.tape.offset.value=0,this.wow=t.createOscillator(),this.wow.frequency.value=.31,this.wowDepth=s(4),this.wow.connect(this.wowDepth),this.tapeBus=s(1),this.tape.connect(this.tapeBus),this.wowDepth.connect(this.tapeBus),this.tape.start(e),this.wow.start(e);const r=ce(t,6,1);this.noise=r,this.shepGain=s(0);const n=t.createBiquadFilter();n.type="lowpass",n.frequency.value=2200,n.Q.value=.4,this.hasShepard&&(this.shep=new AudioWorkletNode(t,"shepard",{numberOfInputs:0,outputChannelCount:[2]}),this.shep.connect(n)),n.connect(this.shepGain),this.shepGain.connect(s(.18)).connect(this.dry),this.shepGain.connect(this.verbIn);const h=[0,1,.45,.24,.14,.085,.05,.03,.018,.01,.006];this.wave=t.createPeriodicWave(new Float32Array(h.length),new Float32Array(h)),this.padFilter=t.createBiquadFilter(),this.padFilter.type="lowpass",this.padFilter.frequency.value=800,this.padFilter.Q.value=.5,this.padBus=s(this.on.has("pad")?.055:0),this.padFilter.connect(this.padBus),this.padBus.connect(s(.6)).connect(this.dry),this.padBus.connect(this.verbIn),this.voices=[],this.subGain=s(0),this.subGain.connect(this.dry),this.subGain.connect(s(.3)).connect(this.verbIn),this.subs=[[12,.62],[0,.5]].map(([i,u])=>{const p=t.createOscillator();p.type="sine",p.frequency.value=xt(Ot[0].bass+i);const d=s(u);return p.connect(d).connect(this.subGain),this.tapeBus.connect(p.detune),p.start(e),{o:p,shift:i}}),this.airSrc=t.createBufferSource(),this.airSrc.buffer=r,this.airSrc.loop=!0,this.airBus=s(0),this.air=[];for(let i=0;i<4;i++){const u=t.createBiquadFilter();u.type="bandpass",u.Q.value=34,u.frequency.value=440,this.airSrc.connect(u).connect(s(1.6)).connect(this.airBus),this.air.push(u)}this.airBus.connect(this.verbIn),this.airBus.connect(s(.2)).connect(this.dry),this.airSrc.start(e),this.hallSrc=t.createBufferSource(),this.hallSrc.buffer=ce(t,7,2),this.hallSrc.loop=!0,this.hallSrc.playbackRate.value=.5,this.hallLow=t.createBiquadFilter(),this.hallLow.type="lowpass",this.hallLow.frequency.value=140,this.hallLow.Q.value=.6;const f=t.createBiquadFilter();f.type="bandpass",f.frequency.value=5200,f.Q.value=.5,this.hallGain=s(0),this.hallSrc.connect(this.hallLow).connect(this.hallGain),this.hallSrc.connect(f).connect(s(.05)).connect(this.hallGain),this.hallGain.connect(this.dry),this.hallGain.connect(s(.5)).connect(this.verbIn),this.hallSrc.start(e),this.dustBus=s(0),this.dustBus.connect(s(.35)).connect(this.dry),this.dustBus.connect(this.verbIn),this.breathBus=s(this.on.has("breath")?1:0),this.breathBus.connect(s(.4)).connect(this.dry),this.breathBus.connect(s(1.3)).connect(this.verbIn),this.lastNow=e,this.mtime=0,this.chordIndex=-1,this.nextChord=0,this.nextGrain=e+2,this.inSusp=!1,this.held=!1,this.lastBreath=-100}setMuted(t){if(this.muted=t,!this.ctx)return;const e=this.ctx.currentTime;this.master.gain.cancelScheduledValues(e),this.master.gain.setValueAtTime(this.master.gain.value,e),t?(this.master.gain.setTargetAtTime(0,e,.25),this.live&&setTimeout(()=>this.muted&&this.ctx.suspend(),1500)):(this.ctx.resume(),this.master.gain.setTargetAtTime(this.tune.level,e,.8))}setHidden(t){!this.ctx||!this.live||this.muted||(t?this.ctx.suspend():this.ctx.resume())}chord(t,e){var c;const s=this.ctx,a=Ot[t%Ot.length];this.current=a;for(const l of this.voices){l.env.gain.cancelScheduledValues(e),l.env.gain.setTargetAtTime(0,e,2.8);for(const r of l.osc)r.stop(e+16)}this.voices=[],this.on.has("pad")&&a.notes.forEach((l,r)=>{const n=s.createGain();n.gain.value=0;const h=.32/Math.sqrt(a.notes.length)*(1-r*.09);n.gain.setValueAtTime(0,e),n.gain.setTargetAtTime(h,e,2.2),n.connect(this.padFilter);const f=[-1,1].map(i=>{const u=s.createOscillator();u.setPeriodicWave(this.wave),u.frequency.value=xt(l),u.detune.value=i*(l<48?2.5:5+this.rand()*3),this.tapeBus.connect(u.detune);const p=s.createStereoPanner();return p.pan.value=i*(.25+r*.1),u.connect(p).connect(n),u.start(e),this.unhookOnEnd(u),u});this.voices.push({env:n,osc:f})});for(const{o:l,shift:r}of this.subs)l.frequency.setTargetAtTime(xt(a.bass+r),e,.9);this.air.forEach((l,r)=>{const n=a.notes[r%a.notes.length]+12;l.frequency.setTargetAtTime(xt(n),e,1.4)}),(c=this.shep)==null||c.port.postMessage({chord:a.pcs})}grain(t,e){const s=this.ctx,a=this.current??Ot[0],c=this.rand,r=a.notes[Math.floor(c()*a.notes.length)]+24+12*Math.floor(c()*2.2),n=e?.6+c()*1.6:.025+c()*c()*.08,h=(e?.05:.11)*(.3+c()*.7)*Math.pow(2,-(r-80)/24),f=s.createOscillator();f.frequency.value=xt(r),f.detune.setValueAtTime(c()*20-10,t),f.detune.linearRampToValueAtTime(e?-6:-30-c()*40,t+n);const i=s.createGain();i.gain.value=0,i.gain.setValueAtTime(0,t),i.gain.linearRampToValueAtTime(h,t+n*(e?.4:.18)),i.gain.linearRampToValueAtTime(0,t+n);const u=s.createStereoPanner();u.pan.value=(c()*2-1)*.85,f.connect(i).connect(u).connect(this.dustBus),f.start(t),f.stop(t+n+.05),f.onended=()=>{f.disconnect(),i.disconnect(),u.disconnect()}}breath(t,e=1){const s=this.ctx,a=this.rand,c=s.createBufferSource();c.buffer=this.noise;const l=a()*(this.noise.duration-2),r=.55+a()*.25,n=s.createBiquadFilter();n.type="bandpass",n.Q.value=.8,n.frequency.setValueAtTime(1500+a()*500,t),n.frequency.exponentialRampToValueAtTime(520,t+r);const h=s.createBiquadFilter();h.type="highpass",h.frequency.value=260;const f=s.createGain();f.gain.value=0,f.gain.setValueAtTime(0,t),f.gain.linearRampToValueAtTime(.9*e,t+.05),f.gain.setTargetAtTime(.35*e,t+.05,.12),f.gain.setTargetAtTime(0,t+r*.55,r*.18);const i=s.createStereoPanner();i.pan.value=(a()-.5)*.3,c.connect(h).connect(n).connect(f).connect(i).connect(this.breathBus),c.start(t,l,r+1);const u=s.createOscillator();u.type="sine",u.frequency.setValueAtTime(95,t+r*.5),u.frequency.exponentialRampToValueAtTime(48,t+r*.5+.18);const p=s.createGain();p.gain.value=0,p.gain.setValueAtTime(0,t+r*.5),p.gain.linearRampToValueAtTime(.22*e,t+r*.5+.015),p.gain.setTargetAtTime(0,t+r*.5+.02,.05),u.connect(p).connect(i),u.start(t+r*.5),u.stop(t+r*.5+.5),c.onended=()=>{c.disconnect(),h.disconnect(),n.disconnect(),f.disconnect()},u.onended=()=>{u.disconnect(),p.disconnect(),i.disconnect()}}unhookOnEnd(t){t.onended=()=>{try{this.tapeBus.disconnect(t.detune)}catch{}t.disconnect()}}update(t,e=1){var b;if(!this.ctx||!this.master)return;const a=this.ctx.currentTime,c=Math.max(0,Math.min(.25,a-this.lastNow));if(this.lastNow=a,c===0&&this.chordIndex>=0)return;const l=t.wall,r=t.rate,n=a+.03,h=(g,k,M=.25)=>g.setTargetAtTime(k,a,M),f=this.tune,i=g=>this.on.has(g)?f[g]??1:0;!this.muted&&f.level!==this.lastLevel&&(this.lastLevel!==void 0&&h(this.master.gain,f.level,.3),this.lastLevel=f.level),h(this.verbOut.gain,f.reverb,.3),h(this.lowCut.frequency,f.lowCut,.3),h(this.padBus.gain,i("pad")*.055,.3),h(this.breathBus.gain,i("breath"),.3),this.mtime+=c*Math.max(.05,Math.min(1.8,Math.abs(r))),this.mtime>=this.nextChord&&(this.chordIndex++,this.chord(this.chordIndex,n),this.nextChord+=yo);const u=(b=this.shep)==null?void 0:b.parameters;u&&(h(u.get("rate"),-.02*r*(1+.6*t.rush),.4),h(u.get("fifth"),.25+.5*t.susp,1),h(u.get("center"),7.9+.4*Math.sin(l/41)+.3*t.rush,2));const p=.5+.5*Math.sin(l/97*Math.PI*2-1.2),d=.05+.8*p*p+.3*t.rush+.35*t.susp;h(this.shepGain.gain,i("shepard")*Math.min(1,d)*.17,1.5);const m=t.swell,y=(550+600*(.5+.5*Math.sin(l/23))+1100*m+600*t.rush)*(1-.45*t.hold);h(this.padFilter.frequency,y,.8),h(this.subGain.gain,i("pad")*(.08+.03*m),1),h(this.airBus.gain,i("air")*(.08+.18*m+.05*Math.max(0,Math.sin(l/31))),1.5);const v=.5+.5*Math.sin(l/11.3)*Math.sin(l/29+1);h(this.hallGain.gain,i("hall")*(.08+.06*v+.05*t.hold),2),h(this.hallLow.frequency,90+70*v,2),h(this.tape.offset,-38*t.hold-8*t.susp,.6),h(this.wowDepth.gain,3+14*t.hold+6*t.susp,.6),h(this.wow.frequency,.12+.25*Math.max(0,Math.min(1.5,r)),.6);const x=Math.max(t.hold,t.susp);if(h(this.dustBus.gain,i("dust")*(.7+.7*e),1),i("dust")>0){const g=2+9*Math.min(1.5,Math.max(0,r))*(1-x)+1.2*x;for(this.nextGrain<a&&(this.nextGrain=a);this.nextGrain<a+.12;)this.grain(this.nextGrain,this.rand()<x),this.nextGrain+=-Math.log(1-this.rand())/g}i("breath")>0&&(t.susp>.35&&!this.inSusp||t.holding&&!this.held)&&l-this.lastBreath>6&&(this.breath(n+.05,t.holding?.8:1),this.lastBreath=l),t.susp>.35?this.inSusp=!0:t.susp<.1&&(this.inSusp=!1),this.held=t.holding}}const ft=[{group:"Light",key:"exposure",label:"exposure",min:.5,max:8,step:.05,value:2.5},{group:"Light",key:"sun",label:"sun strength",min:5,max:120,step:1,value:40},{group:"Light",key:"sky",label:"sky in the opening",min:0,max:.5,step:.005,value:.13},{group:"Light",key:"spread",label:"sun softness",min:.001,max:.03,step:5e-4,value:.0075},{group:"Light",key:"bounce",label:"bounce light",min:0,max:4,step:.05,value:1},{group:"Light",key:"palette",label:"colour (−1 cycles)",min:-1,max:4,step:1,value:-1},{group:"Air",key:"fogBase",label:"haze",min:0,max:.03,step:2e-4,value:.0062},{group:"Air",key:"fogLow",label:"haze near the floor",min:0,max:.05,step:5e-4,value:.011},{group:"Air",key:"fogHeight",label:"floor haze height (m)",min:.5,max:20,step:.1,value:5},{group:"Air",key:"phaseG",label:"forward scatter",min:0,max:.9,step:.01,value:.55},{group:"Air",key:"glow",label:"air glow",min:0,max:.06,step:.001,value:.01},{group:"Dust",key:"dustFloor",label:"clear air between",min:0,max:1,step:.01,value:.1},{group:"Dust",key:"dustAmount",label:"dust in the streaks",min:0,max:4,step:.05,value:1.5},{group:"Dust",key:"dustLo",label:"streak threshold",min:0,max:.95,step:.01,value:.45},{group:"Dust",key:"dustHi",label:"streak edge",min:.05,max:1,step:.01,value:.85},{group:"Dust",key:"dustAcross",label:"streak fineness",min:.01,max:.4,step:.005,value:.07},{group:"Dust",key:"dustAlong",label:"streak length (inv)",min:.001,max:.1,step:.001,value:.011},{group:"Dust",key:"motes",label:"motes",min:0,max:1,step:.01,value:.5},{group:"Dust",key:"moteGlow",label:"mote brightness",min:0,max:5,step:.05,value:1},{group:"Floor",key:"polish",label:"reflection",min:0,max:1,step:.01,value:.45},{group:"Floor",key:"roughLo",label:"polish roughness",min:.01,max:.6,step:.005,value:.08},{group:"Floor",key:"roughHi",label:"worn roughness",min:.01,max:.9,step:.005,value:.32},{group:"Floor",key:"floorAlbedo",label:"floor tone",min:.02,max:.5,step:.005,value:.14},{group:"Lens",key:"bloom",label:"bloom",min:0,max:.4,step:.005,value:.09},{group:"Lens",key:"grain",label:"grain",min:0,max:.12,step:.002,value:.03},{group:"Lens",key:"fringe",label:"colour fringe",min:0,max:.02,step:5e-4,value:.003},{group:"Sound",key:"level",label:"master",min:0,max:1,step:.01,value:.4},{group:"Sound",key:"reverb",label:"reverb",min:0,max:2,step:.01,value:.85},{group:"Sound",key:"lowCut",label:"low cut (Hz)",min:20,max:300,step:1,value:40},{group:"Sound",key:"shepard",label:"falling glide",min:0,max:2,step:.01,value:1},{group:"Sound",key:"pad",label:"pad and bass",min:0,max:2,step:.01,value:1},{group:"Sound",key:"air",label:"choir",min:0,max:2,step:.01,value:1},{group:"Sound",key:"hall",label:"room air",min:0,max:2,step:.01,value:1},{group:"Sound",key:"dust",label:"dust grains",min:0,max:2,step:.01,value:1},{group:"Sound",key:"breath",label:"breath",min:0,max:2,step:.01,value:1}],Mo=typeof matchMedia=="function"&&matchMedia("(pointer: coarse)").matches,at=Object.fromEntries(ft.map(o=>[o.key,o.key==="lowCut"&&Mo?110:o.value])),zt="cenotaph.tune";function ko(){try{const o=JSON.parse(localStorage.getItem(zt)||"{}");return Object.fromEntries(ft.map(t=>[t.key,Number.isFinite(o[t.key])?o[t.key]:at[t.key]]))}catch{return{...at}}}function le(o){try{localStorage.setItem(zt,JSON.stringify(o))}catch{}}const A={...at},Ct=(o,t)=>{const e=Math.max(0,Math.min(4,Math.ceil(-Math.log10(o.step))));return(+t).toFixed(e)};function Eo(){Object.assign(A,ko());const o=document.createElement("div");o.id="tune",o.innerHTML=`
    <button type="button" class="head" aria-expanded="true">tune <span class="caret">▾</span></button>
    <div class="body">
      <div class="groups"></div>
      <div class="actions">
        <button type="button" data-act="copy">Copy</button>
        <button type="button" data-act="reset">Reset</button>
        <span class="note" aria-live="polite"></span>
      </div>
    </div>`;const t=o.querySelector(".groups"),e=new Map;let s=!0;try{s=localStorage.getItem(zt+".open")!=="0"}catch{}for(const r of[...new Set(ft.map(n=>n.group))]){const n=document.createElement("details");n.open=r==="Floor"||r==="Dust",n.innerHTML=`<summary>${r}</summary>`;for(const h of ft.filter(f=>f.group===r)){const f=document.createElement("label");f.className="row",f.innerHTML=`<span class="name">${h.label}</span><input type="range" id="tune-${h.key}" min="${h.min}" max="${h.max}" step="${h.step}"><output></output>`;const i=f.querySelector("input"),u=f.querySelector("output");i.value=A[h.key],u.textContent=Ct(h,A[h.key]),f.classList.toggle("changed",A[h.key]!==at[h.key]),i.addEventListener("input",()=>{A[h.key]=+i.value,u.textContent=Ct(h,A[h.key]),f.classList.toggle("changed",A[h.key]!==at[h.key]),le(A)}),i.addEventListener("dblclick",p=>{p.stopPropagation(),A[h.key]=at[h.key],i.value=A[h.key],i.dispatchEvent(new Event("input"))}),e.set(h.key,{input:i,out:u,row:f}),n.appendChild(f)}t.appendChild(n)}const a=o.querySelector(".head"),c=r=>{s=r,o.classList.toggle("closed",!s),a.setAttribute("aria-expanded",String(s));try{localStorage.setItem(zt+".open",s?"1":"0")}catch{}};c(s),a.addEventListener("click",()=>c(!s));const l=o.querySelector(".note");return o.querySelector('[data-act="copy"]').addEventListener("click",()=>{var f;const n=ft.filter(i=>A[i.key]!==at[i.key]).map(i=>`${i.key}=${Ct(i,A[i.key])}`).join(" ")||"(all defaults)",h=()=>l.textContent="Copied";((f=navigator.clipboard)==null?void 0:f.writeText(n).then(h,()=>{l.textContent=n}))??(l.textContent=n)}),o.querySelector('[data-act="reset"]').addEventListener("click",()=>{Object.assign(A,at),le(A);for(const[r,n]of e){const h=ft.find(f=>f.key===r);n.input.value=A[r],n.out.textContent=Ct(h,A[r]),n.row.classList.remove("changed")}l.textContent="Reset"}),document.body.appendChild(o),o}const pt=document.getElementById("view"),Ao=document.getElementById("reset"),So=document.getElementById("sound"),To=matchMedia("(prefers-reduced-motion: reduce)").matches,_o=["t","still","cookie","pose","roll","twist","yaw","tilt","reach","sdf8","rung","govern","x","y","z","vyaw","vpitch","nodust","exp","fov","layers","adaptlog","adaptkey","debug"];function ke(o){const t=decodeURIComponent(o.slice(1)),e=/[=&]/.test(t)?t:t.split("~").map(s=>s.replace("_","=")).join("&");return[...new URLSearchParams(e)].filter(([s])=>_o.includes(s))}const P=new URLSearchParams(location.search);for(const[o,t]of ke(location.hash))P.set(o,t);const Ee=o=>JSON.stringify(ke(o).sort()),Po=Ee(location.hash);addEventListener("hashchange",()=>{Ee(location.hash)!==Po&&location.reload()});const U=(o,t)=>P.has(o)?+P.get(o):t;let It;try{It=new ao(pt,{force8:P.has("sdf8")})}catch(o){console.error(o),document.body.classList.add("nogl")}const Dt=new fo,W=new we,I=new xo(Number(P.get("t"))||0);P.has("debug")&&Eo();const Y=new Ro({tune:A,layers:P.has("layers")?P.get("layers").split(/[,.]/).filter(o=>Wt.includes(o)):Wt}),et=new we;et.w=et.h=tt;et.fov=.1;et.update();{const o=tt*qe/T.HOLE_SPAN;et.pos=[0,0,et.pxPerUnit/o],et.target=[0,0,0],et.update()}const gt=[{sun:[.69,.75,.92],sky:[.27,.35,.54],fog:[.015,.017,.024]},{sun:[1,.96,.9],sky:[.46,.6,.86],fog:[.02,.022,.026]},{sun:[1,.8,.58],sky:[.5,.6,.74],fog:[.02,.021,.024]},{sun:[1,.6,.44],sky:[.66,.5,.6],fog:[.024,.019,.022]},{sun:[.62,.74,1],sky:[.22,.3,.5],fog:[.014,.017,.024]}],Lo=95;function Oo(o){const t=A.palette>=0?Math.min(gt.length-1,A.palette|0):o/Lo%gt.length,e=Math.floor(t);let s=Math.max(0,(t-e-.6)/.4);s=s*s*(3-2*s);const a=gt[e],c=gt[(e+1)%gt.length],l=(r,n)=>a[r].map((h,f)=>(h+(c[r][f]-h)*s)*n);return{sun:l("sun",A.sun),sky:l("sky",A.sun*A.sky),fog:l("fog",A.sun*A.glow)}}function he(o){const t=.28+.035*Math.sin(o/83+1),e=-.52+.03*Math.sin(o/67);return ct([t,1,e])}const F={x:U("x",-10),y:U("y",3.2),z:U("z",30),yaw:.22,pitch:.27},R={pos:bt([F.x,F.y,F.z]),yaw:U("vyaw",0),pitch:U("vpitch",0)};R.tpos=R.pos.slice();R.tyaw=R.yaw;R.tpitch=R.pitch;const ue=1.35,Z={x:0,y:0,sx:0,sy:0},z=new Map,K=new Set;let nt=!1,mt=null,qt=!1,fe=0;function kt(){document.body.classList.remove("idle"),clearTimeout(fe),fe=setTimeout(()=>document.body.classList.add("idle"),2600)}function Ae(){I.holding=!0,!Y.started&&!Y.muted&&Se()}function vt(){I.holding=qt}function Se(){Y.start().then(()=>document.body.classList.add("sounding")).catch(o=>console.warn("no sound:",o))}const Te=o=>Math.max(-ue,Math.min(ue,o));function Co(){const o=F.yaw+R.tyaw;return[Math.sin(o),0,-Math.cos(o)]}function dt(o,t){R.tyaw-=o*.0035,R.tpitch=Te(F.pitch+R.tpitch+t*.0035)-F.pitch,Jt()}function wt(o,t=0){const e=Co(),s=[-e[2],0,e[0]],a=e[0]*o+s[0]*t,c=e[2]*o+s[2]*t,l=Math.max(1,Math.ceil(Math.hypot(a,c)/.5));let r=R.tpos;for(let n=0;n<l;n++)r=bt([r[0]+a/l,r[1],r[2]+c/l]);R.tpos=r,Jt()}function _e(){R.tyaw=0,R.tpitch=0,R.tpos=bt([F.x,F.y,F.z]),R.yaw=Math.atan2(Math.sin(R.yaw),Math.cos(R.yaw)),Jt()}function Jt(){const o=Math.hypot(R.tpos[0]-F.x,R.tpos[1]-F.y,R.tpos[2]-F.z),t=Math.abs(Math.atan2(Math.sin(R.tyaw),Math.cos(R.tyaw)))>.03||Math.abs(R.tpitch)>.03||o>.5;document.body.classList.toggle("moved",t)}const Gt=o=>{var t,e;return(e=(t=o.target).closest)==null?void 0:e.call(t,"button, #tune")};addEventListener("pointerdown",o=>{if(!Gt(o)){kt();try{pt.setPointerCapture(o.pointerId)}catch{}z.set(o.pointerId,{x:o.clientX,y:o.clientY,x0:o.clientX,y0:o.clientY}),z.size===1?(nt=!1,Ae()):(Pe(),nt=!0,vt())}});function Pe(){if(z.size===2){const[o,t]=[...z.values()];mt={d:Math.hypot(o.x-t.x,o.y-t.y)||1}}else mt=null}addEventListener("pointermove",o=>{kt(),o.pointerType==="mouse"&&z.size===0&&(Z.x=o.clientX/innerWidth*2-1,Z.y=o.clientY/innerHeight*2-1);const t=z.get(o.pointerId);if(!t)return;const e=o.clientX-t.x,s=o.clientY-t.y;if(t.x=o.clientX,t.y=o.clientY,z.size===1)!nt&&Math.hypot(t.x-t.x0,t.y-t.y0)>6&&(nt=!0,vt()),nt&&dt(e,s);else if(z.size===2&&mt){const[a,c]=[...z.values()],l=Math.hypot(a.x-c.x,a.y-c.y)||1;wt((l-mt.d)*.12),mt.d=l,dt(e/2,s/2)}});function Le(o){z.delete(o.pointerId),Pe(),z.size===0&&(nt=!1,vt())}addEventListener("pointerup",Le);addEventListener("pointercancel",Le);addEventListener("blur",()=>{z.clear(),K.clear(),mt=null,nt=!1,qt=!1,vt()});addEventListener("wheel",o=>{if(Gt(o))return;o.preventDefault(),kt();const t=o.deltaMode===1?o.deltaY*16:o.deltaMode===2?o.deltaY*innerHeight:o.deltaY;wt(-Math.max(-240,Math.min(240,t))*.03)},{passive:!1});const Do=["KeyW","KeyA","KeyS","KeyD"];addEventListener("keydown",o=>{if(kt(),Gt(o)&&o.target.tagName==="INPUT")return;if(o.metaKey||o.ctrlKey||o.altKey){K.clear();return}const t=o.key;if(t==="ArrowLeft")dt(28,0);else if(t==="ArrowRight")dt(-28,0);else if(t==="ArrowUp")dt(0,28);else if(t==="ArrowDown")dt(0,-28);else if(t==="+"||t==="=")wt(3);else if(t==="-"||t==="_")wt(-3);else if(Do.includes(o.code))K.add(o.code);else{if(o.repeat)return;if(o.code==="Space")qt=!0,Ae();else if(o.code==="KeyM")Ce();else if(o.code==="KeyF")Oe();else if(o.code==="KeyR"||t==="0")_e();else return}o.preventDefault()});addEventListener("keyup",o=>{K.delete(o.code),o.key==="Meta"&&K.clear(),o.code==="Space"&&(qt=!1,(z.size===0||nt)&&vt())});addEventListener("dblclick",o=>{Gt(o)||Oe()});addEventListener("contextmenu",o=>o.preventDefault());function Oe(){var o,t,e;document.fullscreenElement?(o=document.exitFullscreen)==null||o.call(document):(e=(t=document.documentElement).requestFullscreen)==null||e.call(t).catch(()=>{})}function Ce(){if(!Y.started){Y.muted=!1,Se();return}Y.setMuted(!Y.muted),document.body.classList.toggle("sounding",!Y.muted)}So.addEventListener("click",o=>{o.stopPropagation(),Ce()});Ao.addEventListener("click",o=>{o.stopPropagation(),_e()});const ot=[[.4,16,6],[.5,20,8],[.6,24,10],[.7,28,12],[.85,32,12],[1,36,14],[1,48,18],[1.25,48,18],[1.5,56,20],[2,64,24]],Bo=83e5,Qt=12e3,Ht=navigator.webdriver,w={rung:P.has("rung")?Math.max(0,Math.min(ot.length-1,+P.get("rung")|0)):Ht?6:4,ceiling:ot.length-1,climbUntil:performance.now()+Qt,refresh:1/0,slowStreak:0,samples:[],quietUntil:performance.now()+2500,windowStart:0},Fo=P.has("govern")||!P.has("rung")&&!Ht;let De=performance.now(),yt=0,Rt=performance.now(),pe=!1;function Zt(o){const t=Math.sqrt(Bo/Math.max(1,innerWidth*innerHeight));return Math.min(ot[o][0],t)}const Io=o=>o+1<ot.length&&(Zt(o+1)>Zt(o)+1e-6||ot[o+1][1]>ot[o][1]);function Uo(){const o=Zt(w.rung),t=Math.max(2,Math.round(innerWidth*o)),e=Math.max(2,Math.round(innerHeight*o));return(pt.width!==t||pt.height!==e)&&(pt.width=t,pt.height=e),[t,e,o]}function de(o,t){o=Math.max(0,Math.min(ot.length-1,o)),o!==w.rung&&(w.rung=o,w.slowStreak=0,te(t))}function te(o,t=700){w.samples=[],w.quietUntil=o+t}function zo(o,t){if(t<w.quietUntil)return;w.samples.length===0&&(w.windowStart=t),w.samples.push(o);const e=w.samples.length;if(e<45&&!(e>=6&&t-w.windowStart>1500))return;const s=w.samples.slice().sort((n,h)=>n-h);w.samples=[];const a=s[e>>1],c=s[Math.floor(e*.9)];if(w.refresh=Math.max(4,Math.min(w.refresh,s[Math.floor(e*.1)])),w.rung>0&&(a>Math.max(19.5,w.refresh*1.25)||a>40)){const n=a>Math.max(34,w.refresh*2.2)||a>66;w.slowStreak++,(n||w.slowStreak>=2)&&(de(w.rung-(n?2:1),t),w.ceiling=Math.min(w.ceiling,w.rung));return}w.slowStreak=0,a<w.refresh*1.08&&c<w.refresh*1.4&&a<22&&t<w.climbUntil&&w.rung<w.ceiling&&Io(w.rung)&&de(w.rung+1,t)}function me(o,t){let e=1,s=0;for(;o>0;)e/=t,s+=e*(o%t),o=Math.floor(o/t);return s}const ve=Array.from({length:16},(o,t)=>[me(t+1,2)-.5,me(t+1,3)-.5]);let xe=null,ge=1;const Ho=118,No=U("adaptkey",-3.8);let Bt=0;function Be(o){const t=o-Rt;Rt=o;const e=Math.min(.1,t/1e3);Fo&&zo(t,o),yt++,qo(e),requestAnimationFrame(Be)}function qo(o){if(I.tick(P.has("still")?0:o,To),Y.update(I,ge),!It)return;const[t,e,s]=Uo();It.resize(t,e,s)&&(Bt=0);const a=I.wall,[,c,l]=ot[w.rung];if(K.size){const S=9*o;wt((K.has("KeyW")?S:0)-(K.has("KeyS")?S:0),(K.has("KeyD")?S:0)-(K.has("KeyA")?S:0))}Z.sx+=(Z.x-Z.sx)*Math.min(1,o*1.5),Z.sy+=(Z.y-Z.sy)*Math.min(1,o*1.5);const r=1-Math.exp(-o/.14);R.yaw+=(R.tyaw-R.yaw)*r,R.pitch+=(R.tpitch-R.pitch)*r;const n=1-Math.exp(-o/.45);R.pos=bt(R.pos.map((S,ht)=>S+(R.tpos[ht]-S)*n));const h=t/e,f=Math.min(Math.tan(.475)*1.6/h,Math.tan(.75)),i=U("fov",2*Math.atan(Math.max(Math.tan(.475),f))),u=F.yaw+R.yaw+.035*Math.sin(a/47)+Z.sx*.03,p=Te(F.pitch+R.pitch+.02*Math.sin(a/61+1)-Z.sy*.02+.03*I.hold),d=[.5*Math.sin(a/97),.25*Math.sin(a/71+2),.4*Math.sin(a/89+4)],m=bt([R.pos[0]+d[0],R.pos[1]+d[1],R.pos[2]+d[2]]),y=[Math.sin(u)*Math.cos(p),Math.sin(p),-Math.cos(u)*Math.cos(p)];W.w=t,W.h=e,W.fov=i,W.pos=m,W.target=[m[0]+y[0],m[1]+y[1],m[2]+y[2]],W.update();{const S=he(a),ht=[T.HOLE_X-S[0]/S[1]*T.H*.5,T.H*.5,T.HOLE_Z-S[2]/S[1]*T.H*.5],[At,St,Tt]=W.project(ht),_t=W.toCam(ht),ze=Math.max(Math.abs(At/t-.5),Math.abs(St/e-.5));ge=_t[2]<0?Math.max(0,Math.min(1,(.9-ze)/.4))*Math.min(1,40/Tt):0}const v=I.story+Ho,x=U("roll",1.72+.36*Math.sin(v/31)+.12*Math.sin(v/13+1)),b=U("twist",1+v*Math.PI*2/75+.45*Math.sin(v/17)),g=U("yaw",.25*Math.sin(v/21+.5)),k=U("tilt",-.2+.2*Math.sin(v/17+2)),M=V(Vt(g),V(ye(k),V(be(x),Vt(b)))),E=.35+.6*Math.min(2,Math.max(0,I.blur));Dt.pose(v,{wind:E,reach:U("reach",I.reach),wall:a,orient:M,preset:P.get("pose")}),Dt.project(et);const _=-.22+.14*Math.sin(v/89+.7),L=T.HOLE_SPAN/tt,H=he(a);let B=1e9,N=1e9,lt=-1e9,it=-1e9;for(const S of Dt.groups)B=Math.min(B,S.cx-S.r),N=Math.min(N,S.cy-S.r),lt=Math.max(lt,S.cx+S.r),it=Math.max(it,S.cy+S.r);const rt=Math.cos(_),q=Math.sin(_),O=[1e9,1e9,-1e9,-1e9];for(const[S,ht]of[[B,N],[lt,N],[B,it],[lt,it]]){const At=(Math.max(0,Math.min(tt,S))/tt-.5)*T.HOLE_SPAN,St=(Math.max(0,Math.min(tt,ht))/tt-.5)*T.HOLE_SPAN,Tt=T.HOLE_X+rt*At-q*St,_t=T.HOLE_Z+q*At+rt*St;O[0]=Math.min(O[0],Tt),O[1]=Math.min(O[1],_t),O[2]=Math.max(O[2],Tt),O[3]=Math.max(O[3],_t)}const Et=.8,Ie=[O[0]-Et,O[1]-Et,O[2]+Et,O[3]+Et],ee=W.viewProj(),Ue=Math.max(1/(Bt+1),Ht||P.has("still")?.06:.12),Xt=P.has("t")?1:Math.min(1,(performance.now()-De)/5e3);It.render({figure:Dt,cam:W,prevViewProj:xe??ee,histValid:Bt>0,blend:Ue,jitter:ve[yt%ve.length],frame:yt,steps:c,reflSteps:l,sun:H,cookieRot:_,cookieM:L,beamBox:Ie,story:v,wall:a,drift:I.fall*.0021%1,dustFall:I.fall*.05,shutter:.04*Math.max(.12,I.blur),focus:45,dust:!P.has("nodust"),exposure:U("exp",A.exposure)*(1+.2*I.swell),tune:A,palette:Oo(a),fade:Xt*Xt,dt:o,adaptKey:No,logAdapt:P.has("adaptlog")&&yt%4===0,pr:s,debug:P.has("cookie")}),xe=ee,Bt++,!pe&&Xt>=1&&yt>(Ht?14:8)&&(pe=!0,document.body.classList.add("ready"))}addEventListener("resize",()=>{const o=performance.now();te(o),w.ceiling=ot.length-1,w.climbUntil=o+Qt,w.slowStreak=0});document.addEventListener("visibilitychange",()=>{Rt=performance.now(),te(Rt,1500),document.hidden&&vt(),Y.setHidden(document.hidden)});kt();const Ft=[];function Fe(o){if(Ft.push(o),Ft.length<18){requestAnimationFrame(Fe);return}const t=Ft.slice(1).map((e,s)=>e-Ft[s]).sort((e,s)=>e-s);w.refresh=Math.max(4,t[t.length>>1]),Rt=o,De=o,w.quietUntil=o+2500,w.climbUntil=o+Qt,requestAnimationFrame(Be)}requestAnimationFrame(Fe);
