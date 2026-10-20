(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&o(r)}).observe(document,{childList:!0,subtree:!0});function e(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(n){if(n.ep)return;n.ep=!0;const a=e(n);fetch(n.href,a)}})();function Qt(s){const t=s.getContext("webgl2",{antialias:!1,alpha:!1,depth:!1,stencil:!1,premultipliedAlpha:!1,preserveDrawingBuffer:!1,powerPreference:"high-performance"});if(!t)return null;const e=!!(t.getExtension("EXT_color_buffer_float")||t.getExtension("EXT_color_buffer_half_float"));return t.getExtension("OES_texture_float_linear"),{gl:t,floatOk:e}}function Rt(s,t,e){const o=s.createShader(t);if(s.shaderSource(o,e),s.compileShader(o),!s.getShaderParameter(o,s.COMPILE_STATUS)){const n=s.getShaderInfoLog(o),a=e.split(`
`).map((r,h)=>`${String(h+1).padStart(3)} ${r}`).join(`
`);throw new Error(`shader compile failed:
${n}
${a}`)}return o}function q(s,t,e,o=""){if(o){const h=e.indexOf(`
`);e=e.slice(0,h+1)+o+e.slice(h+1)}const n=s.createProgram();if(s.attachShader(n,Rt(s,s.VERTEX_SHADER,t)),s.attachShader(n,Rt(s,s.FRAGMENT_SHADER,e)),s.linkProgram(n),!s.getProgramParameter(n,s.LINK_STATUS))throw new Error(`link failed: ${s.getProgramInfoLog(n)}`);const a={},r=s.getProgramParameter(n,s.ACTIVE_UNIFORMS);for(let h=0;h<r;h++){const l=s.getActiveUniform(n,h),i=l.name.replace(/\[0\]$/,"");a[i]=s.getUniformLocation(n,l.name)}return{p:n,u:a}}function X(s,t,e,{float:o=!0,linear:n=!0,channels:a=4}={}){const r=s.createTexture();s.bindTexture(s.TEXTURE_2D,r);let h,l,i;o?(h=a===2?s.RG16F:s.RGBA16F,l=a===2?s.RG:s.RGBA,i=s.HALF_FLOAT):(h=s.RGBA8,l=s.RGBA,i=s.UNSIGNED_BYTE),s.texImage2D(s.TEXTURE_2D,0,h,t,e,0,l,i,null);const d=n?s.LINEAR:s.NEAREST;s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,d),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MAG_FILTER,d),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE);const c=s.createFramebuffer();s.bindFramebuffer(s.FRAMEBUFFER,c),s.framebufferTexture2D(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,r,0);const u=s.checkFramebufferStatus(s.FRAMEBUFFER)===s.FRAMEBUFFER_COMPLETE;return s.bindFramebuffer(s.FRAMEBUFFER,null),{tex:r,fbo:c,w:t,h:e,ok:u}}function Jt(s,t){t&&(s.deleteTexture(t.tex),s.deleteFramebuffer(t.fbo))}function z(s,t){t?(s.bindFramebuffer(s.FRAMEBUFFER,t.fbo),s.viewport(0,0,t.w,t.h)):(s.bindFramebuffer(s.FRAMEBUFFER,null),s.viewport(0,0,s.drawingBufferWidth,s.drawingBufferHeight))}function S(s,t,e,o){s.activeTexture(s.TEXTURE0+t),s.bindTexture(s.TEXTURE_2D,e),o&&s.uniform1i(o,t)}function Zt(s){const t=s.createVertexArray();return()=>{s.bindVertexArray(t),s.drawArrays(s.TRIANGLES,0,3)}}const U=`#version 300 es
precision highp float;
precision highp int;
`,ct=`
float sdfDecode(float v) {
#ifdef SDF8
  return (v - 0.5) * 256.0;
#else
  return v;
#endif
}
`,ht=`
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
float vnoise(vec3 p) {
  vec3 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash13(i), hash13(i + vec3(1, 0, 0)), f.x),
        mix(hash13(i + vec3(0, 1, 0)), hash13(i + vec3(1, 1, 0)), f.x), f.y),
    mix(mix(hash13(i + vec3(0, 0, 1)), hash13(i + vec3(1, 0, 1)), f.x),
        mix(hash13(i + vec3(0, 1, 1)), hash13(i + vec3(1, 1, 1)), f.x), f.y),
    f.z);
}
float fbm(vec3 p) {
  float a = 0.5, s = 0.0;
  for (int i = 0; i < 4; i++) {
    s += a * vnoise(p);
    p = p * 2.03 + vec3(1.7, 9.2, 3.1);
    a *= 0.5;
  }
  return s / 0.9375;
}
// interleaved gradient noise — a cheap, well-spread per-pixel jitter
float ign(vec2 p) { return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715)))); }
`,I=`${U}
out vec2 vUv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2)) * 2.0 - 1.0;
  vUv = p * 0.5 + 0.5;
  gl_Position = vec4(p, 0.0, 1.0);
}`,te=`${U}
uniform highp sampler2D uPrims;
uniform vec4 uGroups[12];
uniform ivec2 uRanges[12];
uniform int uGroupCount;
uniform vec2 uScale;
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
  vec2 p = gl_FragCoord.xy * uScale;
  float d = 1e5;
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
  d = clamp(d / 256.0 + 0.5, 0.0, 1.0);
#endif
  o = vec4(d, hair, 0.0, 1.0);
}`,ee=`${U}
${ct}
${ht}
uniform sampler2D uSdf;
uniform vec2 uRes;
uniform vec2 uLight;
uniform float uPxPerM;
uniform float uTime;
uniform float uDrift;
uniform vec3 uCore;
uniform vec3 uHalo;
uniform float uSwell;
in vec2 vUv;
out vec4 o;

void main() {
  vec2 p = vUv * uRes;
  vec2 s = texture(uSdf, vUv).xy;
  s.x = sdfDecode(s.x);
  float dpx = s.x;
  float d = max(dpx, 0.0) / uPxPerM;
  float outside = smoothstep(-0.5, 1.5, dpx);

  float rim = exp(-d / 0.010);
  float aura = exp(-d / 0.075) ;
  float far = exp(-d / 0.32);

  vec2 q = (p - uLight) / uPxPerM;
  float core = exp(-dot(q, q) / 0.16);

  vec2 dir = normalize(p - uLight + 1e-3);
  // angular noise turning slowly: broad beams, and finer ones inside them
  float a1 = vnoise(vec3(dir * 2.6, uTime * 0.09));
  float a2 = vnoise(vec3(dir * 7.0 + 4.0, uTime * 0.17));
  float a3 = vnoise(vec3(dir * 15.0 + 9.0, uTime * 0.29));
  float flicker = 0.18 + 1.3 * a1 * a1 + 1.5 * a2 * a2 * a2 + 0.35 * a3;

  // silt: clouds of it drifting up past a falling body
  float med = fbm(vec3(q * 1.2 + vec2(0.0, uDrift * 0.3), uTime * 0.05));
  med = smoothstep(0.22, 0.8, med);

  vec3 col = uCore * (rim * 1.4 + core * 0.55 * (0.7 + 0.3 * uSwell)) + uHalo * (aura * 0.45 + far * 0.08);
  col *= flicker * mix(0.22, 1.5, med);
  // light through hair: the strands glow at their edges
  col += uCore * s.y * rim * 1.5;
  col *= outside * (0.8 + 0.35 * uSwell);
  o = vec4(col, 1.0);
}`,se=`${U}
${ht}
uniform sampler2D uSrc;
uniform vec2 uCenter;
uniform float uStep;
uniform vec3 uAtten;
in vec2 vUv;
out vec4 o;
const int N = 10;
void main() {
  vec2 toC = uCenter - vUv;
  float j = ign(gl_FragCoord.xy);
  vec3 acc = vec3(0.0);
  for (int i = 0; i < N; i++) {
    float f = (float(i) + j) * uStep;
    acc += texture(uSrc, vUv + toC * f).rgb * exp(-uAtten * f);
  }
  o = vec4(acc / float(N), 1.0);
}`,oe=`${U}
${ht}
uniform vec2 uRes;
uniform vec2 uLight;
uniform float uPxPerM;
uniform float uTime;
uniform float uDrift;
in vec2 vUv;
out vec4 o;
void main() {
  vec2 p = vUv * uRes;
  vec2 rel = (p - uLight) / uPxPerM;
  float rq = length(rel);
  vec2 rdir = rel / max(rq, 1e-4);
  float flow = fbm(vec3(rdir * 3.5, log(1.0 + rq * 4.0) * 2.2 - uTime * 0.3));
  vec2 sq = vec2((vUv.x - 0.5) * uRes.x / uRes.y, vUv.y);
  float murk = fbm(vec3(sq * 1.3 + vec2(0.0, uDrift * 0.05), uTime * 0.02 + 3.0));
  float ripple = fbm(vec3(sq * vec2(2.5, 6.0) + vec2(0.0, -uTime * 0.03), uTime * 0.04));
  o = vec4(flow, murk, ripple, 1.0);
}`,ne=`${U}
${ct}
uniform sampler2D uSdf;
uniform sampler2D uScatter;
uniform sampler2D uEmit;
uniform sampler2D uHaze;
uniform vec2 uRes;
uniform vec2 uLight;
uniform float uPxPerM;
uniform float uExposure;
uniform vec3 uBgTop;
uniform vec3 uBgBot;
uniform vec3 uHalo;
uniform vec3 uSky;
uniform float uAA;
in vec2 vUv;
out vec4 o;

void main() {
  vec2 p = vUv * uRes;
  float d = sdfDecode(texture(uSdf, vUv).x);
  float cov = clamp(0.5 - d / uAA, 0.0, 1.0);

  vec3 bg = mix(uBgBot, uBgTop, smoothstep(-0.2, 1.15, vUv.y));
  vec2 q = (p - uLight) / uPxPerM;
  float rq = length(q);
  bg += uHalo * (exp(-rq * 1.1) * 0.035 + exp(-rq * 3.0) * 0.08);

  vec3 hz = texture(uHaze, vUv).rgb;
  // a far, faint brightness overhead — where we fell from — rippling
  float sky = smoothstep(0.35, 1.25, vUv.y);
  bg += uSky * sky * sky * (0.35 + 0.9 * hz.b * hz.b);
  // haze: big slow banks of murk the light has to push through
  bg *= mix(0.7, 1.25, hz.g);

  // in-scattered light thins with distance from the source
  float fall = 0.03 + 0.97 / (1.0 + pow(rq / 0.42, 1.6));
  vec3 sc = texture(uScatter, vUv).rgb * uExposure * fall;
  // the shafts pour: a murk pattern that streams outward along them
  sc *= mix(0.45, 1.5, smoothstep(0.25, 0.75, hz.r));
  vec3 em = texture(uEmit, vUv).rgb;
  vec3 col = bg + sc + em * 0.55;
  col *= 1.0 - cov;
  o = vec4(col, 1.0);
}`,ie=`${U}
layout(location = 0) in vec2 aCorner;
layout(location = 1) in vec4 aA; // box position (0..1)^3, seed
layout(location = 2) in vec4 aB; // speed, size, brightness, kind
uniform mat4 uViewProj;
uniform vec2 uRes;
uniform float uFall;
uniform float uShutter;
uniform float uTime;
uniform vec3 uBoxSize[3];
uniform vec3 uBoxCenter[3];
uniform float uFocus;
uniform float uAperture;
uniform float uPxPerUnit;
uniform float uFigureDepth;
uniform sampler2D uScatter;
uniform float uExposure;
out vec2 vLocal;
out float vHalfLen;
out float vRad;
out vec3 vColor;
out float vBehind;
out float vKind;

const float PERIOD = 960.0;
const float TAU = 6.2831853;

// the sideways wander: whole cycles per period, so it closes on itself
vec2 wander(float fall) {
  float s = aA.w;
  vec2 m = floor(fract(vec2(s * 7.13, s * 3.71)) * 24.0) + 6.0;
  vec2 ph = vec2(s * 41.3, s * 17.9);
  float amp = (0.25 + 0.9 * fract(s * 5.37)) * (aB.w > 1.5 ? 2.5 : 1.0);
  return amp * sin(TAU * m * fall / PERIOD + ph);
}

void main() {
  int kind = int(aB.w + 0.5);
  vec3 S = uBoxSize[kind];
  vec3 C = uBoxCenter[kind];
  // the soft discs at the lens barely streak: a long blurred pill reads as a
  // smear on the glass, not a mote in the water
  float shutter = kind == 1 ? uShutter * 0.2 : uShutter;
  vec2 w0 = wander(uFall);
  vec2 w1 = wander(uFall - shutter);
  vec3 raw = S * (aA.xyz - 0.5) + vec3(w0.x, uFall * aB.x, w0.y);
  vec3 cur = C + mod(raw - C + S * 0.5, S) - S * 0.5;
  // a little time-driven sway on top, too small to need wrapping
  cur.x += sin(uTime * (0.21 + aA.w * 0.05) + aA.w * TAU) * 0.06 * aB.y * 40.0;
  // the previous position is unwrapped, so a mote that just crossed a box
  // face doesn't streak across the whole screen
  vec3 prev = cur - vec3(w0.x - w1.x, shutter * aB.x, w0.y - w1.y);

  vec4 c0 = uViewProj * vec4(cur, 1.0);
  vec4 c1 = uViewProj * vec4(prev, 1.0);
  vKind = aB.w;
  if (c0.w < 0.15 || c1.w < 0.15) {
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    return;
  }
  vec2 s0 = (c0.xy / c0.w * 0.5 + 0.5) * uRes;
  vec2 s1 = (c1.xy / c1.w * 0.5 + 0.5) * uRes;
  float depth = c0.w;

  float core = max(aB.y * uPxPerUnit / depth, 0.7);
  float coc = uAperture * uPxPerUnit * abs(depth - uFocus) / (depth * uFocus);
  float rad = min(sqrt(core * core + coc * coc), uRes.y * 0.25);

  vec2 ax = s0 - s1;
  float len = length(ax);
  vec2 u = len > 1e-3 ? ax / len : vec2(1.0, 0.0);
  vec2 v = vec2(-u.y, u.x);
  float halfLen = len * 0.5 + rad + 1.0;
  float halfWid = rad + 1.0;
  vec2 mid = (s0 + s1) * 0.5;
  vec2 pos = mid + u * aCorner.x * halfLen + v * aCorner.y * halfWid;
  vLocal = vec2(aCorner.x * halfLen, aCorner.y * halfWid);
  vHalfLen = len * 0.5;
  vRad = rad;

  // lit by the shafts it is passing through
  vec3 lit = texture(uScatter, clamp(mid / uRes, 0.0, 1.0)).rgb * uExposure;
  float energy = (core * core) / (rad * rad); // defocus spreads the same light
  energy *= (2.0 * rad) / (len + 2.0 * rad) * 0.7 + 0.3; // and so does motion
  // but a lens-close disc of silt should still be there, faintly
  if (kind == 1) energy = max(energy, 0.015);
  // fade out toward the faces of its box, where it wraps, and into the murk
  vec3 q = abs(cur - C) / (S * 0.5);
  float edge = 1.0 - smoothstep(0.72, 0.98, max(q.x, max(q.y, q.z)));
  float fog = 0.3 + 0.7 * exp(-depth / 16.0);
  // nothing right against the lens: it would be a blurred pane, not a mote
  float near = smoothstep(0.7, 1.5, depth);
  vColor = (vec3(0.07, 0.11, 0.13) + lit * 3.4) * aB.z * energy * edge * fog * near;
  vBehind = depth > uFigureDepth ? 1.0 : 0.0;

  gl_Position = vec4(pos / uRes * 2.0 - 1.0, 0.0, 1.0);
}`,ae=`${U}
${ct}
uniform sampler2D uSdf;
uniform vec2 uRes;
uniform float uAA;
in vec2 vLocal;
in float vHalfLen;
in float vRad;
in vec3 vColor;
in float vBehind;
in float vKind;
out vec4 o;
void main() {
  float dx = max(abs(vLocal.x) - vHalfLen, 0.0);
  float dist = length(vec2(dx, vLocal.y));
  // bright at the head, fading down the tail, so the direction reads
  float along = clamp(vLocal.x / max(vHalfLen, 1e-3) * 0.5 + 0.5, 0.0, 1.0);
  float tail = mix(0.08, 1.0, along * along);
  float a;
  if (vKind > 0.5) {
    // out-of-focus disc with a faint brighter rim, as a lens draws it
    float edge = smoothstep(vRad, vRad - 1.5, dist);
    a = edge * (0.75 + 0.35 * smoothstep(vRad * 0.55, vRad, dist));
  } else {
    a = exp(-dist * dist / max(vRad * vRad * 0.45, 0.25)) * tail * (vHalfLen > 0.5 ? 1.6 : 1.0);
  }
  if (vBehind > 0.5) {
    float d = sdfDecode(texture(uSdf, gl_FragCoord.xy / uRes).x);
    a *= clamp(0.5 + d / uAA, 0.0, 1.0);
  }
  o = vec4(vColor * a, 1.0);
}`,re=`${U}
uniform sampler2D uSrc;
uniform vec2 uTexel;
in vec2 vUv;
out vec4 o;
void main() {
  vec2 h = uTexel * 0.5;
  vec3 c = texture(uSrc, vUv).rgb * 4.0;
  c += texture(uSrc, vUv - h).rgb;
  c += texture(uSrc, vUv + h).rgb;
  c += texture(uSrc, vUv + vec2(h.x, -h.y)).rgb;
  c += texture(uSrc, vUv - vec2(h.x, -h.y)).rgb;
  o = vec4(c / 8.0, 1.0);
}`,ce=`${U}
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
}`,he=`${U}
${ct}
${ht}
uniform sampler2D uScene;
uniform sampler2D uBloom;
uniform sampler2D uSdf;
uniform vec2 uRes;
uniform float uTime;
uniform float uFade;
uniform float uBloomAmt;
uniform float uGrain;
uniform int uDebug;
in vec2 vUv;
out vec4 o;

vec3 aces(vec3 x) {
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

void main() {
  vec2 uv = vUv;
  if (uDebug == 1) {
    float dd = sdfDecode(texture(uSdf, uv).x);
    float m = clamp(0.5 - dd, 0.0, 1.0);
    float hr = texture(uSdf, uv).y;
    o = vec4(mix(vec3(0.85, 0.83, 0.8), vec3(0.05 + 0.4 * hr, 0.05, 0.05), m), 1.0);
    return;
  }
  vec2 cc = uv - 0.5;
  cc.x *= uRes.x / uRes.y;
  float r2 = dot(cc, cc);
  vec2 ca = (uv - 0.5) * r2 * 0.018;
  vec3 col;
  col.r = texture(uScene, uv - ca).r;
  col.g = texture(uScene, uv).g;
  col.b = texture(uScene, uv + ca).b;

  // bloom washes over the outline but not into the body: the cut-out stays black
  float d = sdfDecode(texture(uSdf, uv).x);
  vec3 bl = texture(uBloom, uv).rgb;
  col += bl * uBloomAmt * smoothstep(-1.2, 1.2, d);

  float vig = smoothstep(1.25, 0.15, length(cc * vec2(0.92, 1.08)) * 1.25);
  col *= mix(0.25, 1.0, vig);

  col = aces(col);
  // grade: lift nothing (black is black), cool the shadows, warm the light
  float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = mix(col, col * vec3(0.92, 1.0, 1.06), 1.0 - smoothstep(0.0, 0.5, l));
  col = pow(col, vec3(1.0 / 2.2));

  float g = hash12(uv * uRes + fract(uTime * 7.31) * 913.0) - 0.5;
  col += g * uGrain * (0.35 + sqrt(l));
  col *= uFade;
  col += (ign(gl_FragCoord.xy + fract(uTime) * 61.0) - 0.5) / 255.0 * step(0.0005, l);
  o = vec4(max(col, 0.0), 1.0);
}`,ue=5;class le{constructor(t,{force8:e=!1}={}){const o=Qt(t);if(!o)throw new Error("webgl2");this.gl=o.gl,this.floatOk=o.floatOk&&!e;const n=this.gl;this.canvas=t,this.quad=Zt(n);const a=this.floatOk?"":`#define SDF8
`;this.pSil=q(n,I,te,a),this.pEmit=q(n,I,ee,a),this.pRadial=q(n,I,se),this.pHaze=q(n,I,oe),this.pScene=q(n,I,ne,a),this.pPart=q(n,ie,ae,a),this.pDown=q(n,I,re),this.pUp=q(n,I,ce),this.pFinal=q(n,I,he,a),this.primTex=n.createTexture(),n.bindTexture(n.TEXTURE_2D,this.primTex),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.NEAREST),n.texImage2D(n.TEXTURE_2D,0,n.RGBA32F,400,1,0,n.RGBA,n.FLOAT,null),this.initParticles(),console.info(`falling-repose: ${this.floatOk?"float":"8-bit"} targets`),this.w=0,this.h=0}initParticles(){const t=this.gl;this.layers=[{count:4600,size:[14,10,14],ahead:6},{count:40,size:[4,4,4],ahead:2.9},{count:5200,size:[36,24,36],ahead:14}];const e=this.layers.reduce((i,d)=>i+d.count,0),o=new Float32Array(e*4),n=new Float32Array(e*4);let a=12345;const r=()=>(a=a*16807%2147483647)/2147483647;let h=0;this.layers.forEach((i,d)=>{for(let c=0;c<i.count;c++,h++){o.set([r(),r(),r(),r()],h*4);const u=(5+Math.floor(r()*8))/8,f=d===1?.004+r()*.006:d===2?.005+Math.pow(r(),2)*.012:.0025+Math.pow(r(),3)*.006,p=d===1?.5+r()*.5:.35+Math.pow(r(),2)*1.4;n.set([u,f,p,d],h*4)}}),this.particleTotal=e,this.vao=t.createVertexArray(),t.bindVertexArray(this.vao);const l=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,l),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),t.STATIC_DRAW),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,2,t.FLOAT,!1,0,0);for(const[i,d]of[[1,o],[2,n]]){const c=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,c),t.bufferData(t.ARRAY_BUFFER,d,t.STATIC_DRAW),t.enableVertexAttribArray(i),t.vertexAttribPointer(i,4,t.FLOAT,!1,0,0),t.vertexAttribDivisor(i,1)}t.bindVertexArray(null)}resize(t,e,o=2){if(t===this.w&&e===this.h&&o===this.sdfDiv)return;const n=this.gl;this.w=t,this.h=e,this.sdfDiv=o;for(const d of[this.sdf,this.emit,this.ra,this.rb,this.haze,this.scene,...this.bloom??[]])Jt(n,d);const a=Math.max(1,Math.ceil(t/2)),r=Math.max(1,Math.ceil(e/2)),h={float:this.floatOk};this.sdf=X(n,Math.max(1,Math.ceil(t/o)),Math.max(1,Math.ceil(e/o)),{float:this.floatOk,channels:this.floatOk?2:4}),this.emit=X(n,a,r,h),this.ra=X(n,a,r,h),this.rb=X(n,a,r,h),this.haze=X(n,Math.max(1,Math.ceil(t/4)),Math.max(1,Math.ceil(e/4)),h),this.scene=X(n,t,e,h),this.bloom=[];let l=t,i=e;for(let d=0;d<ue;d++)l=Math.max(1,Math.ceil(l/2)),i=Math.max(1,Math.ceil(i/2)),this.bloom.push(X(n,l,i,h))}render(t){const e=this.gl,{w:o,h:n}=this,a=t.figure;e.bindTexture(e.TEXTURE_2D,this.primTex),e.texSubImage2D(e.TEXTURE_2D,0,0,0,a.count*2,1,e.RGBA,e.FLOAT,a.data,0),z(e,this.sdf),e.useProgram(this.pSil.p),S(e,0,this.primTex,this.pSil.u.uPrims);const r=new Float32Array(48),h=new Int32Array(24);a.groups.slice(0,12).forEach((m,y)=>{r.set([m.cx,m.cy,m.r,m.k+2],y*4),h.set([m.start,m.count],y*2)}),e.uniform4fv(this.pSil.u.uGroups,r),e.uniform2iv(this.pSil.u.uRanges,h),e.uniform1i(this.pSil.u.uGroupCount,Math.min(12,a.groups.length)),e.uniform2f(this.pSil.u.uScale,o/this.sdf.w,n/this.sdf.h),this.quad();const l=t.lightPx;z(e,this.emit);let i=this.pEmit.u;e.useProgram(this.pEmit.p),S(e,0,this.sdf.tex,i.uSdf),e.uniform2f(i.uRes,o,n),e.uniform2f(i.uLight,l[0],l[1]),e.uniform1f(i.uPxPerM,a.pxPerM),e.uniform1f(i.uTime,t.story),e.uniform1f(i.uDrift,t.drift),e.uniform3fv(i.uCore,t.palette.core),e.uniform3fv(i.uHalo,t.palette.halo),e.uniform1f(i.uSwell,t.swell),this.quad(),e.useProgram(this.pRadial.p),i=this.pRadial.u,e.uniform2f(i.uCenter,l[0]/o,l[1]/n),e.uniform3fv(i.uAtten,t.palette.atten);const d=10,c=.92,u=[c/(d*d*d),c/(d*d),c/d];let f=this.emit,p=this.ra;for(let m=0;m<3;m++)z(e,p),S(e,0,f.tex,i.uSrc),e.uniform1f(i.uStep,u[m]),this.quad(),f=p,p=p===this.ra?this.rb:this.ra;const x=f;z(e,this.haze),e.useProgram(this.pHaze.p),i=this.pHaze.u,e.uniform2f(i.uRes,o,n),e.uniform2f(i.uLight,l[0],l[1]),e.uniform1f(i.uPxPerM,a.pxPerM),e.uniform1f(i.uTime,t.story),e.uniform1f(i.uDrift,t.drift),this.quad(),z(e,this.scene),e.useProgram(this.pScene.p),i=this.pScene.u,S(e,0,this.sdf.tex,i.uSdf),S(e,1,x.tex,i.uScatter),S(e,2,this.emit.tex,i.uEmit),S(e,3,this.haze.tex,i.uHaze),e.uniform2f(i.uRes,o,n),e.uniform2f(i.uLight,l[0],l[1]),e.uniform1f(i.uPxPerM,a.pxPerM),e.uniform1f(i.uExposure,t.exposure),e.uniform3fv(i.uBgTop,t.palette.bgTop),e.uniform3fv(i.uBgBot,t.palette.bgBot),e.uniform3fv(i.uHalo,t.palette.halo),e.uniform3fv(i.uSky,t.palette.sky),e.uniform1f(i.uAA,1),this.quad(),e.enable(e.BLEND),e.blendFunc(e.ONE,e.ONE),e.useProgram(this.pPart.p),i=this.pPart.u,e.uniformMatrix4fv(i.uViewProj,!1,t.cam.viewProj()),e.uniform2f(i.uRes,o,n),e.uniform1f(i.uFall,t.fallSmall),e.uniform1f(i.uShutter,t.shutter),e.uniform1f(i.uTime,t.story);const g=[],v=[],b=t.cam.forward();for(const m of this.layers)g.push(...m.size),v.push(...t.cam.pos.map((y,R)=>y+b[R]*m.ahead));e.uniform3fv(i.uBoxSize,g),e.uniform3fv(i.uBoxCenter,v),e.uniform1f(i.uFocus,t.focus),e.uniform1f(i.uAperture,t.aperture),e.uniform1f(i.uPxPerUnit,t.cam.pxPerUnit),e.uniform1f(i.uFigureDepth,t.focus),e.uniform1f(i.uExposure,t.exposure),e.uniform1f(i.uAA,1),S(e,0,this.sdf.tex,i.uSdf),S(e,1,x.tex,i.uScatter),e.bindVertexArray(this.vao),e.drawArraysInstanced(e.TRIANGLE_STRIP,0,4,this.particleTotal),e.bindVertexArray(null),e.disable(e.BLEND),e.useProgram(this.pDown.p);let T=this.scene;for(const m of this.bloom)z(e,m),S(e,0,T.tex,this.pDown.u.uSrc),e.uniform2f(this.pDown.u.uTexel,1/T.w,1/T.h),this.quad(),T=m;e.useProgram(this.pUp.p),e.enable(e.BLEND),e.blendFunc(e.ONE,e.ONE);for(let m=this.bloom.length-1;m>0;m--){const y=this.bloom[m],R=this.bloom[m-1];z(e,R),S(e,0,y.tex,this.pUp.u.uSrc),e.uniform2f(this.pUp.u.uTexel,1/y.w,1/y.h),this.quad()}e.disable(e.BLEND),z(e,null),e.useProgram(this.pFinal.p),i=this.pFinal.u,S(e,0,this.scene.tex,i.uScene),S(e,1,this.bloom[0].tex,i.uBloom),S(e,2,this.sdf.tex,i.uSdf),e.uniform2f(i.uRes,o,n),e.uniform1f(i.uTime,t.wall),e.uniform1f(i.uFade,t.fade),e.uniform1f(i.uBloomAmt,t.bloom),e.uniform1f(i.uGrain,.035),e.uniform1i(i.uDebug,t.debug?1:0),this.quad()}}function F(s,t){const e=new Array(9);for(let o=0;o<3;o++)for(let n=0;n<3;n++)e[o*3+n]=s[o*3]*t[n]+s[o*3+1]*t[3+n]+s[o*3+2]*t[6+n];return e}function H(s,t){return[s[0]*t[0]+s[1]*t[1]+s[2]*t[2],s[3]*t[0]+s[4]*t[1]+s[5]*t[2],s[6]*t[0]+s[7]*t[1]+s[8]*t[2]]}const Ct=s=>{const t=Math.cos(s),e=Math.sin(s);return[1,0,0,0,t,-e,0,e,t]},pt=s=>{const t=Math.cos(s),e=Math.sin(s);return[t,0,e,0,1,0,-e,0,t]},qt=s=>{const t=Math.cos(s),e=Math.sin(s);return[t,-e,0,e,t,0,0,0,1]},ft=(s,t,e)=>F(qt(e),F(Ct(s),pt(t))),k=(s,t)=>[s[0]+t[0],s[1]+t[1],s[2]+t[2]],mt=(s,t)=>[s[0]-t[0],s[1]-t[1],s[2]-t[2]],N=(s,t)=>[s[0]*t,s[1]*t,s[2]*t],fe=s=>Math.hypot(s[0],s[1],s[2]),st=s=>{const t=fe(s)||1;return[s[0]/t,s[1]/t,s[2]/t]},Tt=(s,t)=>[s[1]*t[2]-s[2]*t[1],s[2]*t[0]-s[0]*t[2],s[0]*t[1]-s[1]*t[0]];class de{constructor(){this.pos=[0,0,5],this.target=[0,0,0],this.fov=.6,this.w=1,this.h=1,this.near=.05,this.update()}update(){const t=st(mt(this.target,this.pos)),e=st(Tt(t,[0,1,0])),o=Tt(e,t);this.R=[e[0],e[1],e[2],o[0],o[1],o[2],-t[0],-t[1],-t[2]],this.focal=1/Math.tan(this.fov/2),this.pxPerUnit=this.focal*this.h/2}forward(){return[-this.R[6],-this.R[7],-this.R[8]]}toCam(t){return H(this.R,mt(t,this.pos))}project(t){const e=this.toCam(t),o=Math.max(-e[2],this.near),n=this.pxPerUnit/o;return[this.w/2+e[0]*n,this.h/2+e[1]*n,o]}viewProj(){const t=this.R,e=this.pos,o=[-(t[0]*e[0]+t[1]*e[1]+t[2]*e[2]),-(t[3]*e[0]+t[4]*e[1]+t[5]*e[2]),-(t[6]*e[0]+t[7]*e[1]+t[8]*e[2])],n=this.w/this.h,a=this.focal,r=this.near,h=100,l=a/n,i=a,d=(h+r)/(r-h),c=2*h*r/(r-h),u=new Float32Array(16);for(let f=0;f<4;f++){const p=f<3?t[f]:o[0],x=f<3?t[3+f]:o[1],g=f<3?t[6+f]:o[2],v=f<3?0:1;u[f*4+0]=l*p,u[f*4+1]=i*x,u[f*4+2]=d*g+c*v,u[f*4+3]=-g}return u}}const At=190,_t=[[.027,.044,.04],[.009,.048,.045],[-.01,.045,.041],[-.027,.035,.031]],Y=[["pelvis",null,[0,0,0]],["spine","pelvis",[0,.1,-.01]],["chest","spine",[0,.17,0]],["neck","chest",[0,.25,-.025]],["head","neck",[0,.1,.012]]];for(const s of["L","R"]){const t=s==="L"?1:-1;Y.push(["clav"+s,"chest",[.02*t,.215,-.01]],["shoulder"+s,"clav"+s,[.155*t,0,-.005]],["elbow"+s,"shoulder"+s,[0,-.29,0]],["wrist"+s,"elbow"+s,[0,-.25,0]],["hip"+s,"pelvis",[.092*t,-.07,0]],["knee"+s,"hip"+s,[0,-.43,0]],["ankle"+s,"knee"+s,[0,-.42,0]]),_t.forEach(([e,o],n)=>{Y.push([`f${n}a${s}`,"wrist"+s,[0,-.092+Math.abs(e)*.18,e]]),Y.push([`f${n}b${s}`,`f${n}a${s}`,[0,-o,0]])}),Y.push(["thumbA"+s,"wrist"+s,[-.006*t,-.022,.03]]),Y.push(["thumbB"+s,"thumbA"+s,[0,-.046,0]])}function pe(){const s=[],t=(o,n,a,r,h,l,i)=>s.push({type:0,j:o,a:n,b:a,ra:r,rb:h,k:l,g:i}),e=(o,n,a,r,h,l)=>s.push({type:1,j:o,c:n,r:a,k:r,g:h,e:l});e("pelvis",[0,0,-.005],[.16,.11,.105],.05,"torso"),e("pelvis",[0,-.06,-.05],[.145,.1,.085],.04,"torso"),e("pelvis",[0,.03,.035],[.13,.09,.07],.04,"torso"),e("spine",[0,.08,0],[.13,.13,.088],.05,"torso"),e("chest",[0,.12,-.005],[.148,.16,.102],.05,"torso"),e("chest",[0,.165,.035],[.145,.08,.075],.03,"torso"),e("chest",[0,.17,-.048],[.145,.09,.07],.03,"torso"),t("chest",[-.14,.235,-.02],[.14,.235,-.02],.05,.05,.04,"torso"),t("neck",[0,-.02,0],[0,.11,.012],.05,.044,.03,"torso"),e("head",[0,.1,-.015],[.074,.095,.1],.02,"head"),e("head",[0,.052,.042],[.062,.075,.062],.02,"head"),e("head",[0,.004,.068],[.042,.028,.034],.015,"head"),e("head",[0,.112,.082],[.058,.018,.022],.012,"head"),t("head",[0,.092,.098],[0,.056,.121],.01,.0115,.008,"head"),e("head",[0,.03,.094],[.024,.014,.013],.008,"head"),e("head",[0,.105,-.06],[.082,.092,.082],.02,"head");for(const o of["L","R"]){const n="arm"+o,a="hand"+o,r="leg"+o;e("shoulder"+o,[.004,-.04,0],[.05,.08,.054],.03,n),t("shoulder"+o,[0,0,0],[0,-.29,0],.043,.033,.03,n),e("shoulder"+o,[0,-.15,.01],[.038,.1,.04],.02,n),t("elbow"+o,[0,0,0],[0,-.25,0],.034,.022,.02,n),e("elbow"+o,[0,-.07,0],[.033,.09,.038],.02,n),e("wrist"+o,[0,-.05,0],[.015,.05,.04],.012,a),e("wrist"+o,[-.004,-.036,.024],[.016,.03,.02],.01,a),_t.forEach(([,h,l],i)=>{const d=i===3?.0075:.0088;t(`f${i}a${o}`,[0,0,0],[0,-h,0],d,d*.86,.005,a),t(`f${i}b${o}`,[0,0,0],[0,-l,0],d*.86,d*.62,.004,a)}),t("thumbA"+o,[0,0,0],[0,-.046,0],.012,.0095,.008,a),t("thumbB"+o,[0,0,0],[0,-.034,0],.0095,.007,.004,a),t("hip"+o,[0,0,0],[0,-.43,0],.082,.05,.04,r),e("hip"+o,[0,-.17,.015],[.072,.19,.078],.03,r),t("knee"+o,[0,0,0],[0,-.41,0],.048,.029,.025,r),e("knee"+o,[0,-.12,-.028],[.046,.13,.052],.02,r),e("ankle"+o,[0,-.035,-.025],[.032,.035,.04],.015,r),t("ankle"+o,[0,-.045,-.01],[0,-.068,.155],.032,.021,.015,r)}return s}function me(){const s=[],t=[0,.1,-.015],e=[.08,.1,.105],o=15;for(let n=0;n<o;n++){const r=-.2+(n+.5)/o*2.1,h=Math.sin(n*2.399)*1.15,l=st([Math.sin(h),Math.cos(r),-Math.sin(r)*Math.cos(h)*.9]),i=[t[0]+l[0]*e[0]*.9,t[1]+l[1]*e[1]*.9,t[2]+l[2]*e[2]*.9],d=Math.floor(n/3);s.push({p:i,n:l,len:.26+.3*((n*.618+d*.3)%1),width:.015+.011*(n*.382%1),seed:d*2.71+n%3*.23+.7})}return s}function ve(s,t){return Math.sin(t*.097+s*1.7)*.5+Math.sin(t*.181+s*3.1)*.3+Math.sin(t*.293+s*5.3)*.2}const Et={spine:[-.1,0,.03],chest:[-.12,.05,.03],neck:[-.15,.25,.05],head:[-.3,.55,.1],clavL:[0,0,.12],shoulderL:[-.3,1.1,1.3],elbowL:[-.85,0,0],wristL:[.35,0,.1],clavR:[0,0,.1],shoulderR:[-.2,.5,.85],elbowR:[-.6,0,0],wristR:[.3,0,.15],hipL:[-.3,.1,.2],kneeL:[.7,0,0],ankleL:[1,0,0],hipR:[-.8,.75,.3],kneeR:[1.55,0,0],ankleR:[.95,0,0]},xe={spine:[.22,0,.05],chest:[.18,-.1,.02],neck:[.15,.2,0],head:[.1,.45,.05],clavL:[0,0,.05],shoulderL:[-.95,.6,.55],elbowL:[-1.35,0,0],wristL:[.4,0,.1],clavR:[0,0,.05],shoulderR:[-.7,.3,.45],elbowR:[-1.5,0,0],wristR:[.35,0,.1],hipL:[-1.35,.25,.15],kneeL:[1.95,0,0],ankleL:[.8,0,0],hipR:[-1.1,.4,.22],kneeR:[1.7,0,0],ankleR:[.85,0,0]},be={spine:[-.2,0,.02],chest:[-.2,.05,.02],neck:[-.2,.3,.03],head:[-.42,.5,.05],clavL:[0,0,.25],shoulderL:[-2.5,.5,.45],elbowL:[-.45,0,0],wristL:[.25,0,.1],clavR:[0,0,.22],shoulderR:[-2.25,.2,.6],elbowR:[-.6,0,0],wristR:[.3,0,.1],hipL:[-.12,.05,.12],kneeL:[.55,0,0],ankleL:[1.05,0,0],hipR:[-.35,.5,.2],kneeR:[1,0,0],ankleR:[1,0,0]};function ge(s){if(typeof s=="string")return{open:s==="open"?1:0,curl:s==="curl"?1:0,surrender:s==="surrender"?1:0};const t=.5+.5*Math.sin(s/53-1.4),e=.5+.5*Math.sin(s/71-1.57),o=Math.pow(t,3)*.85,n=Math.pow(e,3)*.85*(1-o);return{open:1-o-n,curl:o,surrender:n}}class we{constructor(){this.joints=Y.map(([t,e,o])=>({name:t,parent:e,offset:o,side:t.endsWith("R")?-1:1,rot:[0,0,0],R:null,p:null})),this.byName=Object.fromEntries(this.joints.map(t=>[t.name,t])),this.shapes=pe(),this.roots=me(),this.data=new Float32Array(At*8),this.groups=[],this.count=0,this.hair=[]}pose(t,{wind:e=1,reach:o=0,wall:n=t,orient:a,preset:r}){const h=this.byName,l=v=>ve(v,t),i=Math.max(0,e),d=Math.sin(n*.9)*.015,c=ge(r==="open"||r==="curl"||r==="surrender"?r:t),u={};for(const v of Object.keys(Et))u[v]=[0,1,2].map(b=>Et[v][b]*c.open+xe[v][b]*c.curl+be[v][b]*c.surrender);u.spine[0]+=d,u.chest[0]+=d,u.shoulderL[0]-=i*.15,u.shoulderL[2]+=i*.12,u.shoulderR[0]-=i*.12,u.shoulderR[2]+=i*.15,u.hipL[0]-=i*.08,u.hipR[0]-=i*.08;const f={spine:[.06,.05,.04],chest:[.05,.06,.03],neck:[.08,.15,.05],head:[.12,.25,.08],clavL:[0,0,.05],shoulderL:[.3,.3,.2],elbowL:[.3,0,0],wristL:[.2,.2,.15],clavR:[0,0,.05],shoulderR:[.3,.3,.2],elbowR:[.35,0,0],wristR:[.2,.2,.1],hipL:[.2,.15,.1],kneeL:[.3,0,0],ankleL:[.15,0,0],hipR:[.2,.15,.1],kneeR:[.3,0,0],ankleR:[.15,0,0]};let p=1;for(const v of this.joints){const b=u[v.name],T=f[v.name];if(r==="stand"||!b){v.rot=[0,0,0];continue}v.rot=b.map((m,y)=>m+l(p++*3.7+y)*T[y])}if(r!=="stand"){const v=(m,y)=>m+(y-m)*o,b=h.elbowR.rot,T=h.wristR.rot;h.elbowR.rot=[v(b[0],-.12),0,0],h.wristR.rot=[v(T[0],-.3),T[1],T[2]],h.head.rot[1]-=o*.2;for(const m of["L","R"]){const y=m==="L"?0:50,R=m==="R"?o:0;for(let A=0;A<4;A++){const P=(1.5-A)*(.12+R*.1)+l(30+y+A)*.05,$=(.3+A*.08+l(35+y+A)*.12)*(1-R*.75);h[`f${A}a${m}`].rot=[P,0,-$],h[`f${A}b${m}`].rot=[0,0,-$*1.3]}h["thumbA"+m].rot=[-.75-R*.25+l(40+y)*.1,0,-.3],h["thumbB"+m].rot=[0,0,-.3*(1-R)]}}this.fk(a),r!=="stand"&&this.aimReach(o,n);const x=["pelvis","chest","chest","head","kneeL","kneeR","elbowL","elbowR"],g=[0,0,0];for(const v of x)for(let b=0;b<3;b++)g[b]+=h[v].p[b]/x.length;for(const v of this.joints)v.p=mt(v.p,g);this.torso=N(k(h.chest.p,h.pelvis.p),.5),this.poseHair(t,i)}fk(t){const e=this.byName;for(const o of this.joints){const n=ft(o.rot[0],o.rot[1]*o.side,o.rot[2]*o.side);if(!o.parent)o.R=F(t,n),o.p=[0,0,0];else{const a=e[o.parent];o.R=F(a.R,n),o.p=k(a.p,H(a.R,o.offset))}}this.root=t}aimReach(t,e){const o=this.byName,n=o.shoulderR,a=this.reachWall===void 0?0:Math.min(.1,Math.max(0,e-this.reachWall));if(this.reachWall=e,this.reachAim||(this.reachAim=n.rot.slice()),t>.001){const h=o.clavR.R,l=n.rot[1];let i=null,d=-1e9;const c=(f,p)=>{const x=F(h,ft(f,-l,-p)),g=-x[4],v=-x[7];return g+.12*v-.04*(Math.abs(f-n.rot[0])+Math.abs(p-n.rot[2]))};for(let f=-3;f<=.6;f+=.2)for(let p=-.2;p<=2.6;p+=.2){const x=c(f,p);x>d&&(d=x,i=[f,p])}for(const f of[.08,.03])for(const p of[-f,0,f])for(const x of[-f,0,f]){const g=c(i[0]+p,i[1]+x);g>d&&(d=g,i=[i[0]+p,i[1]+x])}(!this.reachGoal||d>c(this.reachGoal[0],this.reachGoal[1])+.05)&&(this.reachGoal=i);const u=1-Math.exp(-a/.45);this.reachAim[0]+=(this.reachGoal[0]-this.reachAim[0])*u,this.reachAim[2]+=(this.reachGoal[1]-this.reachAim[2])*u}else this.reachAim=n.rot.slice(),this.reachGoal=null;const r=t*t*(3-2*t);n.rot=[n.rot[0]+(this.reachAim[0]-n.rot[0])*r,n.rot[1],n.rot[2]+(this.reachAim[2]-n.rot[2])*r],this.fk(this.root)}poseHair(t,e){const o=this.byName.head,n=[0,1,0],a=[1,0,0],r=[0,0,1],h=7,l=Math.min(1.4,e),i=this.hairT===void 0?0:Math.max(0,t-this.hairT);this.hairT=t,this.hairPhase=(this.hairPhase??t)+i*(.9+.5*l);const d=this.hairPhase;this.hair=this.roots.map(c=>{const u=[k(o.p,H(o.R,c.p))],f=H(o.R,c.n),p=c.len/h,x=c.seed;let g=f;for(let v=1;v<=h;v++){const b=v/h,T=x*3.1+d-b*3.4,m=(.25+.95*b)*(.6+.35*(1-Math.min(1,l))),y=k(N(a,Math.sin(T)*m),N(r,Math.sin(T*.73+x)*m*.8)),R=st(k(k(N(f,.7*(1-b)+.1),N(n,l*(.7+1.1*b))),y));g=st(k(N(g,.35),N(R,.65+.3*b))),u.push(k(u[u.length-1],N(g,p)))}return{pts:u,width:c.width}})}project(t){const e=this.data;let o=0;const n=new Map,a=this.byName,r=[],h=(c,u,f)=>{if(o>=At)return;e.set(u,o*8),e.set(f,o*8+4),n.has(c)||(n.set(c,{start:o,count:0,minX:1e9,minY:1e9,maxX:-1e9,maxY:-1e9,k:0}),r.push(c));const p=n.get(c);return p.count++,o++,p},l=(c,u,f,p)=>{c.minX=Math.min(c.minX,u-p),c.maxX=Math.max(c.maxX,u+p),c.minY=Math.min(c.minY,f-p),c.maxY=Math.max(c.maxY,f+p)};this.pxPerM=t.pxPerUnit/t.project([0,0,0])[2];const i=(c,u,f,p,x,g,v)=>{const b=t.project(c),T=t.project(u),m=f*t.pxPerUnit/b[2],y=p*t.pxPerUnit/T[2],R=x*this.pxPerM,A=h(g,[b[0],b[1],T[0],T[1]],[m,y,v?2:0,R]);A&&(l(A,b[0],b[1],m),l(A,T[0],T[1],y),A.k=Math.max(A.k,R))};for(const c of this.shapes){const u=a[c.j],f=u.side;if(c.type===0){const p=[c.a[0]*f,c.a[1],c.a[2]],x=[c.b[0]*f,c.b[1],c.b[2]];i(k(u.p,H(u.R,p)),k(u.p,H(u.R,x)),c.ra,c.rb,c.k,c.g,!1)}else{const p=k(u.p,H(u.R,[c.c[0]*f,c.c[1],c.c[2]]));let x=u.R;c.e&&(x=F(x,ft(c.e[0],c.e[1]*f,c.e[2]*f)));const g=F(t.R,x),v=[0,1,2].map(_=>[g[0+_]*c.r[_],g[3+_]*c.r[_]]);let b=0,T=0,m=0;for(const[_,lt]of v)b+=_*_,T+=_*lt,m+=lt*lt;const y=t.project(p),R=t.pxPerUnit/y[2];b*=R*R,T*=R*R,m*=R*R;const A=(b+m)/2,P=Math.sqrt(((b-m)/2)**2+T*T),$=A+P,Wt=Math.max(A-P,1e-6),wt=.5*Math.atan2(2*T,b-m),Mt=Math.sqrt($),Kt=Math.sqrt(Wt),yt=c.k*this.pxPerM,it=h(c.g,[y[0],y[1],Math.cos(wt),Math.sin(wt)],[Mt,Kt,1,yt]);if(!it)continue;l(it,y[0],y[1],Mt),it.k=Math.max(it.k,yt)}}for(const{pts:c,width:u}of this.hair){const f=c.length-1,p=x=>u*Math.pow(1-x,1.4)+.0016;for(let x=0;x<f;x++){const g=p(x/f),v=p((x+1)/f);i(c[x],c[x+1],g,v,Math.max(.0025,g*1.5),"hair",!0)}}this.count=o,this.groups=r.map(c=>{const u=n.get(c),f=(u.minX+u.maxX)/2,p=(u.minY+u.maxY)/2;return{cx:f,cy:p,r:Math.hypot(u.maxX-u.minX,u.maxY-u.minY)/2,start:u.start,count:u.count,k:u.k}});const d=t.project(this.torso);return this.torsoPx=d,this}}const St=s=>s*s*(3-2*s),Me=s=>Math.min(1,Math.max(0,s));function ye(s){let t=s>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function dt(s,t,e,o,n){const a=s-t;return a<=0||a>=e+o+n?0:a<e?St(a/e):a<e+o?1:1-St((a-e-o)/n)}const Lt=1.7,Re=27;class Te{constructor(t=0){this.wall=t,this.story=Re+t*.9,this.fall=t*Lt,this.rate=1,this.blur=1,this.hold=0,this.holding=!1,this.susp=0,this.rush=0,this.reach=0,this.swell=0;const e=ye(1789);this.suspensions=[],this.rushes=[];let o=40;for(let n=0;n<400;n++){this.suspensions.push(o);const a=80+e()*55;this.rushes.push(o+22+e()*(a-40)),o+=a}}suspensionAt(t){let e=0;for(const o of this.suspensions){if(o>t)break;e=Math.max(e,dt(t,o,5,10,7))}return e}rushAt(t){let e=0;for(const o of this.rushes){if(o>t)break;e=Math.max(e,dt(t,o,3.5,5,5))}return e}reachAt(t){let e=0;for(const o of this.suspensions){if(o>t)break;e=Math.max(e,dt(t,o+4,6,6,8))}return e}tick(t,e=!1){t=Math.min(t,.1),this.wall+=t;const o=this.wall,n=Math.PI*2,a=.9+.3*Math.sin(n*o/67)+.18*Math.sin(n*o/31+1.3)+.08*Math.sin(n*o/13+.4);this.susp=this.suspensionAt(o),this.rush=this.rushAt(o),this.reach=this.reachAt(o);const r=1-Math.exp(-t/.6);this.hold+=((this.holding?1:0)-this.hold)*(1-Math.exp(-t/(this.holding?.9:1.6)));const h=e?.45:1;let l=a*(1+.85*this.rush);l=l*(1-this.susp)+-.06*this.susp,l*=1-.97*this.hold,this.rate+=(l*h-this.rate)*r;let i=a*(1+1.3*this.rush);i=i*(1-this.susp)+1.05*this.susp,i*=1-.45*this.hold,this.blur+=(i*h-this.blur)*r,this.story+=t*Math.min(1.6,Math.max(.025,this.rate)),this.fall+=t*this.rate*Lt,this.swell=Me(this.susp*1+this.hold*.5)}}const Ae=`
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
`,tt=[{bass:38,notes:[45,54,57,64],pcs:[0,4,7]},{bass:37,notes:[45,52,57,61],pcs:[7,11,2]},{bass:35,notes:[42,50,54,61],pcs:[9,0,4]},{bass:33,notes:[42,49,54,57],pcs:[4,7,11]},{bass:31,notes:[38,47,54,57],pcs:[5,9,0,4]},{bass:30,notes:[45,50,54,64],pcs:[0,4,7]},{bass:28,notes:[43,50,54,59],pcs:[2,5,9,0]},{bass:33,notes:[40,50,52,55],pcs:[7,0,2,5]}],Ee=12.5,Pt=.62,Bt=[[66,64,62,57],[66,64,62],[62,61,59,57],[69,66,64,62],[66,64]],et=s=>440*Math.pow(2,(s-69)/12);function Se(s,t=7.5){const e=s.sampleRate,o=Math.floor(e*t),n=s.createBuffer(2,o,e);for(let a=0;a<2;a++){const r=n.getChannelData(a);let h=0,l=a?91:17;const i=()=>(l=l*16807%2147483647)/2147483647*2-1,d=Math.floor(e*.028);for(let c=d;c<o;c++){const u=(c-d)/e,f=.55-.5*Math.min(1,u/t);h+=(i()-h)*f,r[c]=h*Math.exp(-6.9*u/(t*.82))*(u<.06?u/.06:1)}for(const[c,u]of[[11,.5],[23,.32],[37,.24],[53,.16]]){const f=Math.floor(e*(c+(a?4:0))*.001);f<o&&(r[f]+=u*(a?-1:1))}}return n}function Le(s,t=6){const e=s.sampleRate,o=Math.floor(e*t),n=s.createBuffer(2,o,e);for(let a=0;a<2;a++){const r=n.getChannelData(a);let h=0,l=0,i=0;for(let d=0;d<o;d++){const c=Math.random()*2-1;h=.99765*h+c*.099046,l=.963*l+c*.2965164,i=.57*i+c*1.0526913,r[d]=(h+l+i+c*.1848)*.12}}return n}class Pe{constructor(){this.started=!1,this.muted=!1,this.ctx=null}async start(t){if(this.started)return;this.started=!0;const e=!t;if(e){const o=window.AudioContext||window.webkitAudioContext;t=new o({latencyHint:"playback"}),t.resume()}if(this.ctx=t,this.hasShepard=!1,t.audioWorklet){const o=URL.createObjectURL(new Blob([Ae],{type:"application/javascript"}));try{await t.audioWorklet.addModule(o),this.hasShepard=!0}catch(n){console.warn("shepard worklet unavailable:",n)}URL.revokeObjectURL(o)}this.build(),this.live=e}build(){const t=this.ctx,e=t.currentTime,o=(R=1)=>{const A=t.createGain();return A.gain.value=R,A};this.master=o(0);const n=t.createDynamicsCompressor();n.threshold.value=-20,n.knee.value=18,n.ratio.value=2.6,n.attack.value=.04,n.release.value=.6,this.master.connect(n).connect(t.destination),this.master.gain.setValueAtTime(0,e),this.master.gain.linearRampToValueAtTime(1e-4,e+.05),this.master.gain.setTargetAtTime(Pt,e+.05,2.2),this.dry=o(1),this.dry.connect(this.master),this.verb=t.createConvolver(),this.verb.buffer=Se(t),this.verbIn=o(1);const a=o(.75);this.verbIn.connect(this.verb).connect(a).connect(this.master),this.echoIn=o(1);const r=t.createDelay(3),h=t.createDelay(3);r.delayTime.value=.61,h.delayTime.value=.89;const l=o(.42),i=t.createBiquadFilter();i.type="lowpass",i.frequency.value=2200;const d=t.createChannelMerger(2);this.echoIn.connect(r),r.connect(h),h.connect(i).connect(l).connect(r),r.connect(d,0,0),h.connect(d,0,1);const c=o(.5);d.connect(c),c.connect(this.dry),c.connect(this.verbIn),this.tape=t.createConstantSource(),this.tape.offset.value=0,this.wow=t.createOscillator(),this.wow.frequency.value=.31,this.wowDepth=o(4),this.wow.connect(this.wowDepth),this.tapeBus=o(1),this.tape.connect(this.tapeBus),this.wowDepth.connect(this.tapeBus),this.tape.start(e),this.wow.start(e),this.shepGain=o(0);const u=t.createBiquadFilter();u.type="lowpass",u.frequency.value=2600,u.Q.value=.4,this.hasShepard&&(this.shep=new AudioWorkletNode(t,"shepard",{numberOfInputs:0,outputChannelCount:[2]}),this.shep.connect(u)),u.connect(this.shepGain);const f=o(.35);this.shepGain.connect(f).connect(this.dry),this.shepGain.connect(this.verbIn);const p=[0,1,.45,.24,.14,.085,.05,.03,.018,.01,.006];this.wave=t.createPeriodicWave(new Float32Array(p.length),new Float32Array(p)),this.padFilter=t.createBiquadFilter(),this.padFilter.type="lowpass",this.padFilter.frequency.value=900,this.padFilter.Q.value=.5,this.padBus=o(.11),this.padFilter.connect(this.padBus),this.padBus.connect(this.dry);const x=o(.9);this.padBus.connect(x).connect(this.verbIn),this.voices=[],this.subGain=o(0),this.subGain.connect(this.dry),this.subs=[[12,.62],[0,.5]].map(([R,A])=>{const P=t.createOscillator();P.type="sine",P.frequency.value=et(tt[0].bass+R);const $=o(A);return P.connect($).connect(this.subGain),this.tapeBus.connect(P.detune),P.start(e),{o:P,shift:R}});const g=Le(t);this.airSrc=t.createBufferSource(),this.airSrc.buffer=g,this.airSrc.loop=!0,this.airBus=o(0),this.air=[];for(let R=0;R<4;R++){const A=t.createBiquadFilter();A.type="bandpass",A.Q.value=34,A.frequency.value=440;const P=o(1.6);this.airSrc.connect(A).connect(P).connect(this.airBus),this.air.push(A)}this.airBus.connect(this.verbIn);const v=o(.25);this.airBus.connect(v).connect(this.dry),this.airSrc.start(e),this.windSrc=t.createBufferSource(),this.windSrc.buffer=g,this.windSrc.loop=!0,this.windSrc.playbackRate.value=.7,this.windBand=t.createBiquadFilter(),this.windBand.type="bandpass",this.windBand.Q.value=.7,this.windBand.frequency.value=400;const b=t.createBiquadFilter();b.type="lowpass",b.frequency.value=1400,this.windGain=o(0),this.windPan=t.createStereoPanner(),this.windSrc.connect(this.windBand).connect(b).connect(this.windGain).connect(this.windPan),this.windPan.connect(this.dry);const T=o(.3);this.windPan.connect(T).connect(this.verbIn),this.windSrc.start(e),this.bellBus=o(.16),this.bellBus.connect(this.dry);const m=o(.8);this.bellBus.connect(m).connect(this.verbIn);const y=o(.55);this.bellBus.connect(y).connect(this.echoIn),this.lastNow=e,this.mtime=0,this.chordIndex=-1,this.nextChord=0,this.nextMotif=9,this.motifCount=0,this.inSusp=!1,this.lastWall=null}setMuted(t){if(this.muted=t,!this.ctx)return;const e=this.ctx.currentTime;this.master.gain.cancelScheduledValues(e),this.master.gain.setValueAtTime(this.master.gain.value,e),t?(this.master.gain.setTargetAtTime(0,e,.25),this.live&&setTimeout(()=>this.muted&&this.ctx.suspend(),1500)):(this.ctx.resume(),this.master.gain.setTargetAtTime(Pt,e,.8))}setHidden(t){!this.ctx||!this.live||this.muted||(t?this.ctx.suspend():this.ctx.resume())}chord(t,e){var a;const o=this.ctx,n=tt[t%tt.length];for(const r of this.voices){r.env.gain.cancelScheduledValues(e),r.env.gain.setTargetAtTime(0,e,2.4);for(const h of r.osc)h.stop(e+14)}this.voices=[],n.notes.forEach((r,h)=>{const l=o.createGain();l.gain.value=0;const i=.32/Math.sqrt(n.notes.length)*(1-h*.09);l.gain.setValueAtTime(0,e),l.gain.setTargetAtTime(i,e,1.6),l.connect(this.padFilter);const d=[-1,1].map(c=>{const u=o.createOscillator();u.setPeriodicWave(this.wave),u.frequency.value=et(r),u.detune.value=c*(r<48?2.5:5+Math.random()*3),this.tapeBus.connect(u.detune);const f=o.createStereoPanner();return f.pan.value=c*(.25+h*.1),u.connect(f).connect(l),u.start(e),this.unhookOnEnd(u),u});this.voices.push({env:l,osc:d})});for(const{o:r,shift:h}of this.subs)r.frequency.setTargetAtTime(et(n.bass+h),e,.9);this.air.forEach((r,h)=>{const l=n.notes[h%n.notes.length]+12;r.frequency.setTargetAtTime(et(l),e,1.4)}),(a=this.shep)==null||a.port.postMessage({chord:n.pcs})}bell(t,e,o,n){const a=this.ctx,r=et(e),h=[[1,1,3.8],[2,.32,2.2],[3,.1,1.2],[4.16,.05,.7],[5.43,.025,.45]];for(const[l,i,d]of h){const c=a.createOscillator();c.frequency.value=r*l,this.tapeBus.connect(c.detune);const u=a.createGain();u.gain.value=0;const f=o*i;if(n){const p=Math.min(2.6,d*.75+.6);u.gain.setValueAtTime(1e-5,t),u.gain.exponentialRampToValueAtTime(f,t+p),u.gain.linearRampToValueAtTime(0,t+p+.05),c.start(t),c.stop(t+p+.1)}else u.gain.setValueAtTime(0,t),u.gain.linearRampToValueAtTime(f,t+.008),u.gain.setTargetAtTime(0,t+.008,d/4),c.start(t),c.stop(t+d*1.6+.2);c.connect(u).connect(this.bellBus),this.unhookOnEnd(c)}}unhookOnEnd(t){t.onended=()=>{try{this.tapeBus.disconnect(t.detune)}catch{}t.disconnect()}}motif(t,e,o,n){const a=Bt[n%Bt.length];let r=t;a.forEach((h,l)=>{const i=.75-l*.08+Math.random()*.1;this.bell(r,h,i,o),Math.random()<.35&&this.bell(r+.004,h-12,i*.4,o),r+=e*(.85+Math.random()*.3)*(l===a.length-2?1.5:1)})}update(t){var x;if(!this.ctx||!this.master)return;const o=this.ctx.currentTime,n=Math.max(0,Math.min(.25,o-this.lastNow));if(this.lastNow=o,n===0&&this.chordIndex>=0)return;const a=t.wall,r=t.rate,h=o+.03,l=(g,v,b=.25)=>g.setTargetAtTime(v,o,b);this.mtime+=n*Math.max(.05,Math.min(1.8,Math.abs(r))),this.mtime>=this.nextChord&&(this.chordIndex++,this.chord(this.chordIndex,h),this.nextChord+=Ee);const i=(x=this.shep)==null?void 0:x.parameters;i&&(l(i.get("rate"),-.022*r*(1+.6*t.rush),.4),l(i.get("fifth"),.25+.5*t.susp,1),l(i.get("center"),8.1+.4*Math.sin(a/41)+.3*t.rush,2));const d=.5+.5*Math.sin(a/97*Math.PI*2-1.2),c=.05+.85*d*d+.4*t.rush+.35*t.susp;l(this.shepGain.gain,Math.min(1,c)*.55,1.5);const u=t.swell,f=(650+700*(.5+.5*Math.sin(a/23))+1300*u+900*t.rush)*(1-.45*t.hold);l(this.padFilter.frequency,f,.8),l(this.subGain.gain,.15+.06*u,1),l(this.airBus.gain,.05+.12*u+.03*Math.max(0,Math.sin(a/31)),1.5),l(this.tape.offset,-38*t.hold-8*t.susp,.6),l(this.wowDepth.gain,3+14*t.hold+6*t.susp,.6),l(this.wow.frequency,.12+.25*Math.max(0,Math.min(1.5,r)),.6);const p=Math.max(0,r);if(l(this.windGain.gain,.035*Math.pow(p,1.6)+.06*t.rush,.5),l(this.windBand.frequency,220+420*Math.min(2,p)+600*t.rush,.5),l(this.windPan.pan,.5*Math.sin(a/7.3),.5),this.mtime>=this.nextMotif&&t.susp<.05){const g=.95/Math.max(.35,Math.min(1.6,r));this.motif(h,g,Math.random()<.2,this.motifCount++),this.nextMotif=this.mtime+16+Math.random()*22}else if(Math.random()<n/9&&t.susp<.05){const g=tt[Math.max(0,this.chordIndex)%tt.length],v=g.notes[Math.floor(Math.random()*g.notes.length)]+24;this.bell(h,v,.18+Math.random()*.15,Math.random()<.3)}t.susp>.6&&!this.inSusp?(this.inSusp=!0,this.motif(h+.5,2.4,!0,0)):t.susp<.1&&(this.inSusp=!1)}}const W=document.getElementById("view"),Be=document.getElementById("sound"),ke=document.getElementById("reset"),Ue=matchMedia("(prefers-reduced-motion: reduce)").matches,B=new URLSearchParams(location.search),G=(s,t)=>B.has(s)?+B.get(s):t;let rt;try{rt=new le(W,{force8:B.has("sdf8")})}catch(s){console.error(s),document.body.classList.add("nogl")}const j=new we,O=new de,E=new Te(Number(B.get("t"))||0),C=new Pe,at=[{core:[1,.72,.4],halo:[.7,.42,.2],atten:[3.2,1.7,1.1],bgTop:[.004,.016,.024],bgBot:[0,.002,.004],sky:[.008,.03,.034]},{core:[.8,.88,1],halo:[.26,.38,.55],atten:[2,1.45,.95],bgTop:[.004,.011,.028],bgBot:[0,.001,.005],sky:[.008,.018,.036]},{core:[1,.7,.66],halo:[.5,.28,.36],atten:[1.8,2,1.35],bgTop:[.012,.006,.022],bgBot:[.002,0,.004],sky:[.02,.012,.03]},{core:[.82,1,.9],halo:[.22,.48,.46],atten:[2.8,1.25,1.35],bgTop:[.002,.018,.02],bgBot:[0,.002,.003],sky:[.006,.03,.028]}],De=95;function Fe(s){const t=s/De%at.length,e=Math.floor(t);let o=t-e;o=o*o*(3-2*o);const n=at[e],a=at[(e+1)%at.length],r={};for(const h of Object.keys(n))r[h]=n[h].map((l,i)=>l+(a[h][i]-l)*o);return r}const D={x:0,y:0,sx:0,sy:0},w={yaw:G("vyaw",0),pitch:G("vpitch",0),zoom:G("zoom",1)};w.tyaw=w.yaw;w.tpitch=w.pitch;w.tzoom=w.zoom;const Ce=.5,qe=4.5,kt=1.3,L=new Map;let V=!1,Q=null,ut=!1,Ut=0;function nt(){document.body.classList.remove("idle"),clearTimeout(Ut),Ut=setTimeout(()=>document.body.classList.add("idle"),2600)}function zt(){E.holding=!0,!C.started&&!C.muted&&It()}function Z(){E.holding=ut}function It(){C.start().then(()=>document.body.classList.add("sounding")).catch(s=>console.warn("no sound:",s))}const Nt=s=>Math.max(-kt,Math.min(kt,s)),Ot=s=>Math.max(Ce,Math.min(qe,s));function K(s,t){w.tyaw-=s*.006,w.tpitch=Nt(w.tpitch+t*.005),bt()}function vt(s){w.tzoom=Ot(w.tzoom*s),bt()}function Gt(){w.tyaw=0,w.tpitch=0,w.tzoom=1,w.yaw=Math.atan2(Math.sin(w.yaw),Math.cos(w.yaw)),bt()}function bt(){const s=Math.abs(Math.atan2(Math.sin(w.tyaw),Math.cos(w.tyaw)))>.03||Math.abs(w.tpitch)>.03||Math.abs(Math.log(w.tzoom))>.03;document.body.classList.toggle("moved",s)}const Vt=s=>{var t,e;return(e=(t=s.target).closest)==null?void 0:e.call(t,"button")};addEventListener("pointerdown",s=>{if(!Vt(s)){nt();try{W.setPointerCapture(s.pointerId)}catch{}if(L.set(s.pointerId,{x:s.clientX,y:s.clientY,x0:s.clientX,y0:s.clientY}),L.size===1)V=!1,zt();else if(L.size===2){const[t,e]=[...L.values()];Q={d0:Math.hypot(t.x-e.x,t.y-e.y)||1,zoom0:w.tzoom},V=!0,Z()}}});addEventListener("pointermove",s=>{nt(),s.pointerType==="mouse"&&L.size===0&&(D.x=s.clientX/innerWidth*2-1,D.y=s.clientY/innerHeight*2-1);const t=L.get(s.pointerId);if(!t)return;const e=s.clientX-t.x,o=s.clientY-t.y;if(t.x=s.clientX,t.y=s.clientY,L.size===1)!V&&Math.hypot(t.x-t.x0,t.y-t.y0)>6&&(V=!0,Z()),V&&K(e,o);else if(L.size===2&&Q){const[n,a]=[...L.values()],r=Math.hypot(n.x-a.x,n.y-a.y)||1;w.tzoom=Ot(Q.zoom0*Q.d0/r),K(e/2,o/2)}});function Xt(s){L.delete(s.pointerId),L.size<2&&(Q=null),L.size===0&&(V=!1,Z())}addEventListener("pointerup",Xt);addEventListener("pointercancel",Xt);addEventListener("blur",()=>{L.clear(),Q=null,V=!1,ut=!1,Z()});addEventListener("wheel",s=>{s.preventDefault(),nt();const t=s.deltaMode===1?s.deltaY*16:s.deltaMode===2?s.deltaY*innerHeight:s.deltaY;vt(Math.exp(Math.max(-200,Math.min(200,t))*.0015))},{passive:!1});addEventListener("keydown",s=>{nt();const t=s.key;if(t==="ArrowLeft")K(-28,0);else if(t==="ArrowRight")K(28,0);else if(t==="ArrowUp")K(0,-28);else if(t==="ArrowDown")K(0,28);else if(t==="+"||t==="=")vt(1/1.15);else if(t==="-"||t==="_")vt(1.15);else{if(s.repeat)return;if(s.code==="Space")ut=!0,zt();else if(s.code==="KeyM")$t();else if(s.code==="KeyF")Ht();else if(s.code==="KeyR"||t==="0")Gt();else return}s.preventDefault()});addEventListener("keyup",s=>{s.code==="Space"&&(ut=!1,(L.size===0||V)&&Z())});addEventListener("dblclick",s=>{Vt(s)||Ht()});addEventListener("contextmenu",s=>s.preventDefault());function Ht(){var s,t,e;document.fullscreenElement?(s=document.exitFullscreen)==null||s.call(document):(e=(t=document.documentElement).requestFullscreen)==null||e.call(t).catch(()=>{})}function $t(){if(!C.started){C.muted=!1,It();return}C.setMuted(!C.muted),document.body.classList.toggle("sounding",!C.muted)}Be.addEventListener("click",s=>{s.stopPropagation(),$t()});ke.addEventListener("click",s=>{s.stopPropagation(),Gt()});const J=[[.5,2],[.6,2],[.7,2],[.85,2],[1,2],[1,1],[1.25,1],[1.5,1],[1.75,1],[2,1]],_e=83e5,M={rung:B.has("rung")?Math.max(0,Math.min(J.length-1,+B.get("rung")|0)):(devicePixelRatio||1)>=2?7:5,ceiling:J.length-1,blockedUntil:0,backoff:3e4,climbed:!1,samples:[],quietUntil:performance.now()+2500,windowStart:0},ze=B.has("govern")||!B.has("rung")&&!navigator.webdriver,Ie=performance.now();let jt=0,ot=performance.now(),Dt=!1;function xt(s){const t=Math.sqrt(_e/Math.max(1,innerWidth*innerHeight));return Math.min(J[s][0],t)}function Ne(){const s=xt(M.rung),t=Math.max(2,Math.round(innerWidth*s)),e=Math.max(2,Math.round(innerHeight*s));return(W.width!==t||W.height!==e)&&(W.width=t,W.height=e),[t,e,J[M.rung][1]]}function Ft(s,t){s=Math.max(0,Math.min(J.length-1,s)),s!==M.rung&&(M.climbed=s>M.rung,M.rung=s,gt(t))}function gt(s,t=700){M.samples=[],M.quietUntil=s+t}function Oe(s,t){if(t<M.quietUntil)return;M.samples.length===0&&(M.windowStart=t),M.samples.push(s);const e=M.samples.length;if(e<45&&!(e>=6&&t-M.windowStart>1500))return;const o=M.samples.slice().sort((r,h)=>r-h),n=o[e>>1],a=o[Math.floor(e*.9)];M.samples=[],t>M.blockedUntil&&(M.ceiling=J.length-1),n>19.5&&M.rung>0?(M.climbed&&(M.ceiling=M.rung-1,M.blockedUntil=t+M.backoff,M.backoff=Math.min(M.backoff*2,6e5)),Ft(M.rung-(n>34?2:1),t),M.climbed=!1):n<17.6&&a<22&&M.rung<M.ceiling&&xt(M.rung+1)>xt(M.rung)+1e-6?Ft(M.rung+1,t):M.climbed=!1}function Yt(s){const t=s-ot;ot=s;const e=Math.min(.1,t/1e3);ze&&Oe(t,s),jt++,Ge(e),requestAnimationFrame(Yt)}function Ge(s){if(E.tick(B.has("still")?0:s,Ue),C.update(E),!rt)return;const[t,e,o]=Ne();rt.resize(t,e,o);const n=E.wall;D.sx+=(D.x-D.sx)*Math.min(1,s*1.5),D.sy+=(D.y-D.sy)*Math.min(1,s*1.5);const a=1-Math.exp(-s/.14);w.yaw+=(w.tyaw-w.yaw)*a,w.pitch+=(w.tpitch-w.pitch)*a,w.zoom=Math.exp(Math.log(w.zoom)+(Math.log(w.tzoom)-Math.log(w.zoom))*(1-Math.exp(-s/.2)));const r=t/e,h=Math.max(1.36,1.5/r),l=.68-.24*E.susp+.14*E.rush-.08*E.hold,i=h/Math.tan(l/2)*w.zoom,d=.1*Math.sin(n/41)+D.sx*.08+w.yaw,c=Nt(.1+.07*Math.sin(n/53)+.18*E.rush+D.sy*.06+w.pitch);O.w=t,O.h=e,O.fov=l,O.target=[0,0,0],O.pos=[Math.sin(d)*Math.cos(c)*i,Math.sin(c)*i,Math.cos(d)*Math.cos(c)*i],O.update();const u=E.story,f=G("roll",1.72+.36*Math.sin(u/31)+.12*Math.sin(u/13+1)),p=G("twist",1+u*Math.PI*2/75+.45*Math.sin(u/17)),x=G("yaw",.25*Math.sin(u/21+.5)),g=G("tilt",-.2+.2*Math.sin(u/17+2)),v=F(pt(x),F(Ct(g),F(qt(f),pt(p)))),b=.35+.6*Math.min(2,Math.max(0,E.blur));j.pose(u,{wind:b,reach:G("reach",E.reach),wall:n,orient:v,preset:B.get("pose")}),j.project(O);const T=j.torsoPx,m=[T[0]+j.pxPerM*(.12*Math.sin(n/29)+.05*Math.sin(n/11)),T[1]+j.pxPerM*(.08*Math.sin(n/37+2)+.04)],y=960,R=B.has("t")?1:Math.min(1,(performance.now()-Ie)/5e3);rt.render({figure:j,cam:O,lightPx:m,story:u,wall:n,fallSmall:E.fall%y,drift:E.fall%65536,shutter:.085*Math.max(.12,E.blur),focus:i,aperture:.06,exposure:1+.3*E.swell,swell:E.swell,palette:Fe(n+20),fade:R*R,bloom:.3,debug:B.has("fig")}),!Dt&&R>=1&&jt>8&&(Dt=!0,document.body.classList.add("ready"))}addEventListener("resize",()=>gt(performance.now()));document.addEventListener("visibilitychange",()=>{ot=performance.now(),gt(ot,1500),document.hidden&&Z(),C.setHidden(document.hidden)});nt();requestAnimationFrame(s=>{ot=s,requestAnimationFrame(Yt)});
