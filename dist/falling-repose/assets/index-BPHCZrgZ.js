(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const c of r.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&o(c)}).observe(document,{childList:!0,subtree:!0});function e(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(n){if(n.ep)return;n.ep=!0;const r=e(n);fetch(n.href,r)}})();function ee(s){const t=s.getContext("webgl2",{antialias:!1,alpha:!1,depth:!1,stencil:!1,premultipliedAlpha:!1,preserveDrawingBuffer:!1,powerPreference:"high-performance"});if(!t)return null;const e=!!(t.getExtension("EXT_color_buffer_float")||t.getExtension("EXT_color_buffer_half_float"));return t.getExtension("OES_texture_float_linear"),{gl:t,floatOk:e}}function At(s,t,e){const o=s.createShader(t);if(s.shaderSource(o,e),s.compileShader(o),!s.getShaderParameter(o,s.COMPILE_STATUS)){const n=s.getShaderInfoLog(o),r=e.split(`
`).map((c,u)=>`${String(u+1).padStart(3)} ${c}`).join(`
`);throw new Error(`shader compile failed:
${n}
${r}`)}return o}function _(s,t,e,o=""){if(o){const u=e.indexOf(`
`);e=e.slice(0,u+1)+o+e.slice(u+1)}const n=s.createProgram();if(s.attachShader(n,At(s,s.VERTEX_SHADER,t)),s.attachShader(n,At(s,s.FRAGMENT_SHADER,e)),s.linkProgram(n),!s.getProgramParameter(n,s.LINK_STATUS))throw new Error(`link failed: ${s.getProgramInfoLog(n)}`);const r={},c=s.getProgramParameter(n,s.ACTIVE_UNIFORMS);for(let u=0;u<c;u++){const h=s.getActiveUniform(n,u),i=h.name.replace(/\[0\]$/,"");r[i]=s.getUniformLocation(n,h.name)}return{p:n,u:r}}function H(s,t,e,{float:o=!0,linear:n=!0,channels:r=4}={}){const c=s.createTexture();s.bindTexture(s.TEXTURE_2D,c);let u,h,i;o?(u=r===2?s.RG16F:s.RGBA16F,h=r===2?s.RG:s.RGBA,i=s.HALF_FLOAT):(u=s.RGBA8,h=s.RGBA,i=s.UNSIGNED_BYTE),s.texImage2D(s.TEXTURE_2D,0,u,t,e,0,h,i,null);const p=n?s.LINEAR:s.NEAREST;s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,p),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MAG_FILTER,p),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE);const a=s.createFramebuffer();s.bindFramebuffer(s.FRAMEBUFFER,a),s.framebufferTexture2D(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,c,0);const l=s.checkFramebufferStatus(s.FRAMEBUFFER)===s.FRAMEBUFFER_COMPLETE;return s.bindFramebuffer(s.FRAMEBUFFER,null),{tex:c,fbo:a,w:t,h:e,ok:l}}function se(s,t){t&&(s.deleteTexture(t.tex),s.deleteFramebuffer(t.fbo))}function I(s,t){t?(s.bindFramebuffer(s.FRAMEBUFFER,t.fbo),s.viewport(0,0,t.w,t.h)):(s.bindFramebuffer(s.FRAMEBUFFER,null),s.viewport(0,0,s.drawingBufferWidth,s.drawingBufferHeight))}function S(s,t,e,o){s.activeTexture(s.TEXTURE0+t),s.bindTexture(s.TEXTURE_2D,e),o&&s.uniform1i(o,t)}function oe(s){const t=s.createVertexArray();return()=>{s.bindVertexArray(t),s.drawArrays(s.TRIANGLES,0,3)}}const U=`#version 300 es
precision highp float;
precision highp int;
`,ht=`
float sdfDecode(vec4 v) {
#ifdef SDF8
  float fine = (v.r - 0.5) * 256.0;
  return abs(fine) < 120.0 ? fine : (v.b - 0.5) * 8192.0;
#else
  return v.r;
#endif
}
`,ut=`
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
`,N=`${U}
out vec2 vUv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2)) * 2.0 - 1.0;
  vUv = p * 0.5 + 0.5;
  gl_Position = vec4(p, 0.0, 1.0);
}`,ne=`${U}
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
  o = vec4(clamp(d / 256.0 + 0.5, 0.0, 1.0), hair, clamp(d / 8192.0 + 0.5, 0.0, 1.0), 1.0);
#else
  o = vec4(d, hair, 0.0, 1.0);
#endif
}`,ie=`${U}
${ht}
${ut}
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
  vec4 st = texture(uSdf, vUv);
  vec2 s = vec2(sdfDecode(st), st.y);
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
}`,re=`${U}
${ut}
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
}`,ae=`${U}
${ut}
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
}`,ce=`${U}
${ht}
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
  float d = sdfDecode(texture(uSdf, vUv));
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
}`,he=`${U}
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
  // how far behind the body's plane: a soft crossfade rather than a hard
  // test, or a mote crossing that plane over the cut-out pops on or off
  vBehind = smoothstep(uFigureDepth - 0.25, uFigureDepth + 0.25, depth);

  gl_Position = vec4(pos / uRes * 2.0 - 1.0, 0.0, 1.0);
}`,ue=`${U}
${ht}
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
  if (vBehind > 0.0) {
    float d = sdfDecode(texture(uSdf, gl_FragCoord.xy / uRes));
    a *= mix(1.0, clamp(0.5 + d / uAA, 0.0, 1.0), vBehind);
  }
  o = vec4(vColor * a, 1.0);
}`,le=`${U}
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
}`,fe=`${U}
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
}`,pe=`${U}
${ht}
${ut}
uniform sampler2D uScene;
uniform sampler2D uBloom;
uniform sampler2D uSdf;
uniform vec2 uRes;
uniform float uTime;
uniform float uFade;
uniform float uBloomAmt;
uniform float uGrain;
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
    float dd = sdfDecode(texture(uSdf, uv));
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
  float d = sdfDecode(texture(uSdf, uv));
  vec3 bl = texture(uBloom, uv).rgb;
  col += bl * uBloomAmt * smoothstep(-1.2, 1.2, d);

  float vig = smoothstep(1.25, 0.15, length(cc * vec2(0.92, 1.08)) * 1.25);
  col *= mix(0.25, 1.0, vig);

  col = aces(col);
  // grade: lift nothing (black is black), cool the shadows, warm the light
  float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = mix(col, col * vec3(0.92, 1.0, 1.06), 1.0 - smoothstep(0.0, 0.5, l));
  col = pow(col, vec3(1.0 / 2.2));

  // grain the size of a CSS pixel, so it looks the same at every resolution
  float g = hash12(floor(gl_FragCoord.xy / max(uPx, 1e-3)) + fract(uTime * 7.31) * 913.0) - 0.5;
  col += g * uGrain * (0.35 + sqrt(l));
  col *= uFade;
  col += (ign(gl_FragCoord.xy + fract(uTime) * 61.0) - 0.5) / 255.0 * step(0.0005, l);
  o = vec4(max(col, 0.0), 1.0);
}`,de=5;class me{constructor(t,{force8:e=!1}={}){const o=ee(t);if(!o)throw new Error("webgl2");this.gl=o.gl,this.floatOk=o.floatOk&&!e;const n=this.gl;this.canvas=t,this.quad=oe(n);const r=this.floatOk?"":`#define SDF8
`;this.pSil=_(n,N,ne,r),this.pEmit=_(n,N,ie,r),this.pRadial=_(n,N,re),this.pHaze=_(n,N,ae),this.pScene=_(n,N,ce,r),this.pPart=_(n,he,ue,r),this.pDown=_(n,N,le),this.pUp=_(n,N,fe),this.pFinal=_(n,N,pe,r),this.primTex=n.createTexture(),n.bindTexture(n.TEXTURE_2D,this.primTex),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.NEAREST),n.texImage2D(n.TEXTURE_2D,0,n.RGBA32F,400,1,0,n.RGBA,n.FLOAT,null),this.initParticles(),console.info(`falling-repose: ${this.floatOk?"float":"8-bit"} targets`),this.w=0,this.h=0}initParticles(){const t=this.gl;this.layers=[{count:4600,size:[14,10,14],ahead:6},{count:40,size:[4,4,4],ahead:2.9},{count:5200,size:[36,24,36],ahead:14}];const e=this.layers.reduce((i,p)=>i+p.count,0),o=new Float32Array(e*4),n=new Float32Array(e*4);let r=12345;const c=()=>(r=r*16807%2147483647)/2147483647;let u=0;this.layers.forEach((i,p)=>{for(let a=0;a<i.count;a++,u++){o.set([c(),c(),c(),c()],u*4);const l=(5+Math.floor(c()*8))/8,f=p===1?.004+c()*.006:p===2?.005+Math.pow(c(),2)*.012:.0025+Math.pow(c(),3)*.006,d=p===1?.5+c()*.5:.35+Math.pow(c(),2)*1.4;n.set([l,f,d,p],u*4)}}),this.particleTotal=e,this.vao=t.createVertexArray(),t.bindVertexArray(this.vao);const h=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,h),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),t.STATIC_DRAW),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,2,t.FLOAT,!1,0,0);for(const[i,p]of[[1,o],[2,n]]){const a=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,a),t.bufferData(t.ARRAY_BUFFER,p,t.STATIC_DRAW),t.enableVertexAttribArray(i),t.vertexAttribPointer(i,4,t.FLOAT,!1,0,0),t.vertexAttribDivisor(i,1)}t.bindVertexArray(null)}resize(t,e,o=2,n=1){if(t===this.w&&e===this.h&&o===this.sdfDiv&&n===this.pr)return;const r=this.gl;this.w=t,this.h=e,this.sdfDiv=o,this.pr=n;for(const a of[this.sdf,this.emit,this.ra,this.rb,this.haze,this.scene,...this.bloom??[]])se(r,a);const c=Math.max(1,Math.ceil(t/2)),u=Math.max(1,Math.ceil(e/2)),h={float:this.floatOk};this.sdf=H(r,Math.max(1,Math.ceil(t/o)),Math.max(1,Math.ceil(e/o)),{float:this.floatOk,channels:this.floatOk?2:4}),this.emit=H(r,c,u,h),this.ra=H(r,c,u,h),this.rb=H(r,c,u,h),this.haze=H(r,Math.max(1,Math.ceil(t/4)),Math.max(1,Math.ceil(e/4)),h),this.scene=H(r,t,e,h),this.bloom=[];let i=t/n,p=e/n;for(let a=0;a<de;a++)i=Math.max(1,Math.ceil(i/2)),p=Math.max(1,Math.ceil(p/2)),this.bloom.push(H(r,i,p,h))}render(t){const e=this.gl,{w:o,h:n}=this,r=t.figure;e.bindTexture(e.TEXTURE_2D,this.primTex),e.texSubImage2D(e.TEXTURE_2D,0,0,0,r.count*2,1,e.RGBA,e.FLOAT,r.data,0),I(e,this.sdf),e.useProgram(this.pSil.p),S(e,0,this.primTex,this.pSil.u.uPrims);const c=new Float32Array(48),u=new Int32Array(24);r.groups.slice(0,12).forEach((m,y)=>{c.set([m.cx,m.cy,m.r,m.k+2],y*4),u.set([m.start,m.count],y*2)}),e.uniform4fv(this.pSil.u.uGroups,c),e.uniform2iv(this.pSil.u.uRanges,u),e.uniform1i(this.pSil.u.uGroupCount,Math.min(12,r.groups.length)),e.uniform2f(this.pSil.u.uScale,o/this.sdf.w,n/this.sdf.h),this.quad();const h=t.lightPx;I(e,this.emit);let i=this.pEmit.u;e.useProgram(this.pEmit.p),S(e,0,this.sdf.tex,i.uSdf),e.uniform2f(i.uRes,o,n),e.uniform2f(i.uLight,h[0],h[1]),e.uniform1f(i.uPxPerM,r.pxPerM),e.uniform1f(i.uTime,t.story),e.uniform1f(i.uDrift,t.drift),e.uniform3fv(i.uCore,t.palette.core),e.uniform3fv(i.uHalo,t.palette.halo),e.uniform1f(i.uSwell,t.swell),this.quad(),e.useProgram(this.pRadial.p),i=this.pRadial.u,e.uniform2f(i.uCenter,h[0]/o,h[1]/n),e.uniform3fv(i.uAtten,t.palette.atten);const p=10,a=.92,l=[a/(p*p*p),a/(p*p),a/p];let f=this.emit,d=this.ra;for(let m=0;m<3;m++)I(e,d),S(e,0,f.tex,i.uSrc),e.uniform1f(i.uStep,l[m]),this.quad(),f=d,d=d===this.ra?this.rb:this.ra;const x=f;I(e,this.haze),e.useProgram(this.pHaze.p),i=this.pHaze.u,e.uniform2f(i.uRes,o,n),e.uniform2f(i.uLight,h[0],h[1]),e.uniform1f(i.uPxPerM,r.pxPerM),e.uniform1f(i.uTime,t.story),e.uniform1f(i.uDrift,t.drift),this.quad(),I(e,this.scene),e.useProgram(this.pScene.p),i=this.pScene.u,S(e,0,this.sdf.tex,i.uSdf),S(e,1,x.tex,i.uScatter),S(e,2,this.emit.tex,i.uEmit),S(e,3,this.haze.tex,i.uHaze),e.uniform2f(i.uRes,o,n),e.uniform2f(i.uLight,h[0],h[1]),e.uniform1f(i.uPxPerM,r.pxPerM),e.uniform1f(i.uExposure,t.exposure),e.uniform3fv(i.uBgTop,t.palette.bgTop),e.uniform3fv(i.uBgBot,t.palette.bgBot),e.uniform3fv(i.uHalo,t.palette.halo),e.uniform3fv(i.uSky,t.palette.sky),e.uniform1f(i.uAA,1),this.quad(),e.enable(e.BLEND),e.blendFunc(e.ONE,e.ONE),e.useProgram(this.pPart.p),i=this.pPart.u,e.uniformMatrix4fv(i.uViewProj,!1,t.cam.viewProj()),e.uniform2f(i.uRes,o,n),e.uniform1f(i.uFall,t.fallSmall),e.uniform1f(i.uShutter,t.shutter),e.uniform1f(i.uTime,t.story);const w=[],v=[],g=t.cam.forward();for(const m of this.layers)w.push(...m.size),v.push(...t.cam.pos.map((y,T)=>y+g[T]*m.ahead));e.uniform3fv(i.uBoxSize,w),e.uniform3fv(i.uBoxCenter,v),e.uniform1f(i.uFocus,t.focus),e.uniform1f(i.uAperture,t.aperture),e.uniform1f(i.uPxPerUnit,t.cam.pxPerUnit),e.uniform1f(i.uFigureDepth,t.focus),e.uniform1f(i.uExposure,t.exposure),e.uniform1f(i.uAA,1),S(e,0,this.sdf.tex,i.uSdf),S(e,1,x.tex,i.uScatter),e.bindVertexArray(this.vao),e.drawArraysInstanced(e.TRIANGLE_STRIP,0,4,this.particleTotal),e.bindVertexArray(null),e.disable(e.BLEND),e.useProgram(this.pDown.p);let A=this.scene;for(const m of this.bloom){I(e,m),S(e,0,A.tex,this.pDown.u.uSrc);const y=Math.max(1,A.w/m.w/2);e.uniform2f(this.pDown.u.uTexel,y/A.w,y/A.h),this.quad(),A=m}e.useProgram(this.pUp.p),e.enable(e.BLEND),e.blendFunc(e.ONE,e.ONE);for(let m=this.bloom.length-1;m>0;m--){const y=this.bloom[m],T=this.bloom[m-1];I(e,T),S(e,0,y.tex,this.pUp.u.uSrc),e.uniform2f(this.pUp.u.uTexel,1/y.w,1/y.h),this.quad()}e.disable(e.BLEND),I(e,null),e.useProgram(this.pFinal.p),i=this.pFinal.u,S(e,0,this.scene.tex,i.uScene),S(e,1,this.bloom[0].tex,i.uBloom),S(e,2,this.sdf.tex,i.uSdf),e.uniform2f(i.uRes,o,n),e.uniform1f(i.uTime,t.wall),e.uniform1f(i.uFade,t.fade),e.uniform1f(i.uBloomAmt,t.bloom),e.uniform1f(i.uGrain,.035),e.uniform1f(i.uPx,t.pr??1),e.uniform1i(i.uDebug,t.debug?1:0),this.quad()}}function F(s,t){const e=new Array(9);for(let o=0;o<3;o++)for(let n=0;n<3;n++)e[o*3+n]=s[o*3]*t[n]+s[o*3+1]*t[3+n]+s[o*3+2]*t[6+n];return e}function $(s,t){return[s[0]*t[0]+s[1]*t[1]+s[2]*t[2],s[3]*t[0]+s[4]*t[1]+s[5]*t[2],s[6]*t[0]+s[7]*t[1]+s[8]*t[2]]}const qt=s=>{const t=Math.cos(s),e=Math.sin(s);return[1,0,0,0,t,-e,0,e,t]},mt=s=>{const t=Math.cos(s),e=Math.sin(s);return[t,0,e,0,1,0,-e,0,t]},zt=s=>{const t=Math.cos(s),e=Math.sin(s);return[t,-e,0,e,t,0,0,0,1]},pt=(s,t,e)=>F(zt(e),F(qt(s),mt(t))),k=(s,t)=>[s[0]+t[0],s[1]+t[1],s[2]+t[2]],vt=(s,t)=>[s[0]-t[0],s[1]-t[1],s[2]-t[2]],O=(s,t)=>[s[0]*t,s[1]*t,s[2]*t],ve=s=>Math.hypot(s[0],s[1],s[2]),st=s=>{const t=ve(s)||1;return[s[0]/t,s[1]/t,s[2]/t]},Et=(s,t)=>[s[1]*t[2]-s[2]*t[1],s[2]*t[0]-s[0]*t[2],s[0]*t[1]-s[1]*t[0]];class xe{constructor(){this.pos=[0,0,5],this.target=[0,0,0],this.fov=.6,this.w=1,this.h=1,this.near=.05,this.update()}update(){const t=st(vt(this.target,this.pos)),e=st(Et(t,[0,1,0])),o=Et(e,t);this.R=[e[0],e[1],e[2],o[0],o[1],o[2],-t[0],-t[1],-t[2]],this.focal=1/Math.tan(this.fov/2),this.pxPerUnit=this.focal*this.h/2}forward(){return[-this.R[6],-this.R[7],-this.R[8]]}toCam(t){return $(this.R,vt(t,this.pos))}project(t){const e=this.toCam(t),o=Math.max(-e[2],this.near),n=this.pxPerUnit/o;return[this.w/2+e[0]*n,this.h/2+e[1]*n,o]}viewProj(){const t=this.R,e=this.pos,o=[-(t[0]*e[0]+t[1]*e[1]+t[2]*e[2]),-(t[3]*e[0]+t[4]*e[1]+t[5]*e[2]),-(t[6]*e[0]+t[7]*e[1]+t[8]*e[2])],n=this.w/this.h,r=this.focal,c=this.near,u=100,h=r/n,i=r,p=(u+c)/(c-u),a=2*u*c/(c-u),l=new Float32Array(16);for(let f=0;f<4;f++){const d=f<3?t[f]:o[0],x=f<3?t[3+f]:o[1],w=f<3?t[6+f]:o[2],v=f<3?0:1;l[f*4+0]=h*d,l[f*4+1]=i*x,l[f*4+2]=p*w+a*v,l[f*4+3]=-w}return l}}const St=190,It=[[.027,.044,.04],[.009,.048,.045],[-.01,.045,.041],[-.027,.035,.031]],W=[["pelvis",null,[0,0,0]],["spine","pelvis",[0,.1,-.01]],["chest","spine",[0,.17,0]],["neck","chest",[0,.25,-.025]],["head","neck",[0,.1,.012]]];for(const s of["L","R"]){const t=s==="L"?1:-1;W.push(["clav"+s,"chest",[.02*t,.215,-.01]],["shoulder"+s,"clav"+s,[.155*t,0,-.005]],["elbow"+s,"shoulder"+s,[0,-.29,0]],["wrist"+s,"elbow"+s,[0,-.25,0]],["hip"+s,"pelvis",[.092*t,-.07,0]],["knee"+s,"hip"+s,[0,-.43,0]],["ankle"+s,"knee"+s,[0,-.42,0]]),It.forEach(([e,o],n)=>{W.push([`f${n}a${s}`,"wrist"+s,[0,-.092+Math.abs(e)*.18,e]]),W.push([`f${n}b${s}`,`f${n}a${s}`,[0,-o,0]])}),W.push(["thumbA"+s,"wrist"+s,[-.006*t,-.022,.03]]),W.push(["thumbB"+s,"thumbA"+s,[0,-.046,0]])}function ge(){const s=[],t=(o,n,r,c,u,h,i)=>s.push({type:0,j:o,a:n,b:r,ra:c,rb:u,k:h,g:i}),e=(o,n,r,c,u,h)=>s.push({type:1,j:o,c:n,r,k:c,g:u,e:h});e("pelvis",[0,0,-.005],[.16,.11,.105],.05,"torso"),e("pelvis",[0,-.06,-.05],[.145,.1,.085],.04,"torso"),e("pelvis",[0,.03,.035],[.13,.09,.07],.04,"torso"),e("spine",[0,.08,0],[.13,.13,.088],.05,"torso"),e("chest",[0,.12,-.005],[.148,.16,.102],.05,"torso"),e("chest",[0,.165,.035],[.145,.08,.075],.03,"torso"),e("chest",[0,.17,-.048],[.145,.09,.07],.03,"torso"),t("chest",[-.14,.235,-.02],[.14,.235,-.02],.05,.05,.04,"torso"),t("neck",[0,-.02,0],[0,.11,.012],.05,.044,.03,"torso"),e("head",[0,.1,-.015],[.074,.095,.1],.02,"head"),e("head",[0,.052,.042],[.062,.075,.062],.02,"head"),e("head",[0,.004,.068],[.042,.028,.034],.015,"head"),e("head",[0,.112,.082],[.058,.018,.022],.012,"head"),t("head",[0,.092,.098],[0,.056,.121],.01,.0115,.008,"head"),e("head",[0,.03,.094],[.024,.014,.013],.008,"head"),e("head",[0,.105,-.06],[.082,.092,.082],.02,"head");for(const o of["L","R"]){const n="arm"+o,r="hand"+o,c="leg"+o;e("shoulder"+o,[.004,-.04,0],[.05,.08,.054],.03,n),t("shoulder"+o,[0,0,0],[0,-.29,0],.043,.033,.03,n),e("shoulder"+o,[0,-.15,.01],[.038,.1,.04],.02,n),t("elbow"+o,[0,0,0],[0,-.25,0],.034,.022,.02,n),e("elbow"+o,[0,-.07,0],[.033,.09,.038],.02,n),e("wrist"+o,[0,-.05,0],[.015,.05,.04],.012,r),e("wrist"+o,[-.004,-.036,.024],[.016,.03,.02],.01,r),It.forEach(([,u,h],i)=>{const p=i===3?.0075:.0088;t(`f${i}a${o}`,[0,0,0],[0,-u,0],p,p*.86,.005,r),t(`f${i}b${o}`,[0,0,0],[0,-h,0],p*.86,p*.62,.004,r)}),t("thumbA"+o,[0,0,0],[0,-.046,0],.012,.0095,.008,r),t("thumbB"+o,[0,0,0],[0,-.034,0],.0095,.007,.004,r),t("hip"+o,[0,0,0],[0,-.43,0],.082,.05,.04,c),e("hip"+o,[0,-.17,.015],[.072,.19,.078],.03,c),t("knee"+o,[0,0,0],[0,-.41,0],.048,.029,.025,c),e("knee"+o,[0,-.12,-.028],[.046,.13,.052],.02,c),e("ankle"+o,[0,-.035,-.025],[.032,.035,.04],.015,c),t("ankle"+o,[0,-.045,-.01],[0,-.068,.155],.032,.021,.015,c)}return s}function be(){const s=[],t=[0,.1,-.015],e=[.08,.1,.105],o=15;for(let n=0;n<o;n++){const c=-.2+(n+.5)/o*2.1,u=Math.sin(n*2.399)*1.15,h=st([Math.sin(u),Math.cos(c),-Math.sin(c)*Math.cos(u)*.9]),i=[t[0]+h[0]*e[0]*.9,t[1]+h[1]*e[1]*.9,t[2]+h[2]*e[2]*.9],p=Math.floor(n/3);s.push({p:i,n:h,len:.26+.3*((n*.618+p*.3)%1),width:.015+.011*(n*.382%1),seed:p*2.71+n%3*.23+.7})}return s}function we(s,t){return Math.sin(t*.097+s*1.7)*.5+Math.sin(t*.181+s*3.1)*.3+Math.sin(t*.293+s*5.3)*.2}const Lt={spine:[-.1,0,.03],chest:[-.12,.05,.03],neck:[-.15,.25,.05],head:[-.3,.55,.1],clavL:[0,0,.12],shoulderL:[-.3,1.1,1.3],elbowL:[-.85,0,0],wristL:[.35,0,.1],clavR:[0,0,.1],shoulderR:[-.2,.5,.85],elbowR:[-.6,0,0],wristR:[.3,0,.15],hipL:[-.3,.1,.2],kneeL:[.7,0,0],ankleL:[1,0,0],hipR:[-.8,.75,.3],kneeR:[1.55,0,0],ankleR:[.95,0,0]},Me={spine:[.22,0,.05],chest:[.18,-.1,.02],neck:[.15,.2,0],head:[.1,.45,.05],clavL:[0,0,.05],shoulderL:[-.95,.6,.55],elbowL:[-1.35,0,0],wristL:[.4,0,.1],clavR:[0,0,.05],shoulderR:[-.7,.3,.45],elbowR:[-1.5,0,0],wristR:[.35,0,.1],hipL:[-1.35,.25,.15],kneeL:[1.95,0,0],ankleL:[.8,0,0],hipR:[-1.1,.4,.22],kneeR:[1.7,0,0],ankleR:[.85,0,0]},ye={spine:[-.2,0,.02],chest:[-.2,.05,.02],neck:[-.2,.3,.03],head:[-.42,.5,.05],clavL:[0,0,.25],shoulderL:[-2.5,.5,.45],elbowL:[-.45,0,0],wristL:[.25,0,.1],clavR:[0,0,.22],shoulderR:[-2.25,.2,.6],elbowR:[-.6,0,0],wristR:[.3,0,.1],hipL:[-.12,.05,.12],kneeL:[.55,0,0],ankleL:[1.05,0,0],hipR:[-.35,.5,.2],kneeR:[1,0,0],ankleR:[1,0,0]};function Re(s){if(typeof s=="string")return{open:s==="open"?1:0,curl:s==="curl"?1:0,surrender:s==="surrender"?1:0};const t=.5+.5*Math.sin(s/53-1.4),e=.5+.5*Math.sin(s/71-1.57),o=Math.pow(t,3)*.85,n=Math.pow(e,3)*.85*(1-o);return{open:1-o-n,curl:o,surrender:n}}class Te{constructor(){this.joints=W.map(([t,e,o])=>({name:t,parent:e,offset:o,side:t.endsWith("R")?-1:1,rot:[0,0,0],R:null,p:null})),this.byName=Object.fromEntries(this.joints.map(t=>[t.name,t])),this.shapes=ge(),this.roots=be(),this.data=new Float32Array(St*8),this.groups=[],this.count=0,this.hair=[]}pose(t,{wind:e=1,reach:o=0,wall:n=t,orient:r,preset:c}){const u=this.byName,h=v=>we(v,t),i=Math.max(0,e),p=Math.sin(n*.9)*.015,a=Re(c==="open"||c==="curl"||c==="surrender"?c:t),l={};for(const v of Object.keys(Lt))l[v]=[0,1,2].map(g=>Lt[v][g]*a.open+Me[v][g]*a.curl+ye[v][g]*a.surrender);l.spine[0]+=p,l.chest[0]+=p,l.shoulderL[0]-=i*.15,l.shoulderL[2]+=i*.12,l.shoulderR[0]-=i*.12,l.shoulderR[2]+=i*.15,l.hipL[0]-=i*.08,l.hipR[0]-=i*.08;const f={spine:[.06,.05,.04],chest:[.05,.06,.03],neck:[.08,.15,.05],head:[.12,.25,.08],clavL:[0,0,.05],shoulderL:[.3,.3,.2],elbowL:[.3,0,0],wristL:[.2,.2,.15],clavR:[0,0,.05],shoulderR:[.3,.3,.2],elbowR:[.35,0,0],wristR:[.2,.2,.1],hipL:[.2,.15,.1],kneeL:[.3,0,0],ankleL:[.15,0,0],hipR:[.2,.15,.1],kneeR:[.3,0,0],ankleR:[.15,0,0]};let d=1;for(const v of this.joints){const g=l[v.name],A=f[v.name];if(c==="stand"||!g){v.rot=[0,0,0];continue}v.rot=g.map((m,y)=>m+h(d++*3.7+y)*A[y])}if(c!=="stand"){const v=(m,y)=>m+(y-m)*o,g=u.elbowR.rot,A=u.wristR.rot;u.elbowR.rot=[v(g[0],-.12),0,0],u.wristR.rot=[v(A[0],-.3),A[1],A[2]],u.head.rot[1]-=o*.2;for(const m of["L","R"]){const y=m==="L"?0:50,T=m==="R"?o:0;for(let R=0;R<4;R++){const P=(1.5-R)*(.12+T*.1)+h(30+y+R)*.05,j=(.3+R*.08+h(35+y+R)*.12)*(1-T*.75);u[`f${R}a${m}`].rot=[P,0,-j],u[`f${R}b${m}`].rot=[0,0,-j*1.3]}u["thumbA"+m].rot=[-.75-T*.25+h(40+y)*.1,0,-.3],u["thumbB"+m].rot=[0,0,-.3*(1-T)]}}this.fk(r),c!=="stand"&&this.aimReach(o,n);const x=["pelvis","chest","chest","head","kneeL","kneeR","elbowL","elbowR"],w=[0,0,0];for(const v of x)for(let g=0;g<3;g++)w[g]+=u[v].p[g]/x.length;for(const v of this.joints)v.p=vt(v.p,w);this.torso=O(k(u.chest.p,u.pelvis.p),.5),this.poseHair(t,i)}fk(t){const e=this.byName;for(const o of this.joints){const n=pt(o.rot[0],o.rot[1]*o.side,o.rot[2]*o.side);if(!o.parent)o.R=F(t,n),o.p=[0,0,0];else{const r=e[o.parent];o.R=F(r.R,n),o.p=k(r.p,$(r.R,o.offset))}}this.root=t}aimReach(t,e){const o=this.byName,n=o.shoulderR,r=this.reachWall===void 0?0:Math.min(.1,Math.max(0,e-this.reachWall));if(this.reachWall=e,this.reachAim||(this.reachAim=n.rot.slice()),t>.001){const u=o.clavR.R,h=n.rot[1];let i=null,p=-1e9;const a=(f,d)=>{const x=F(u,pt(f,-h,-d)),w=-x[4],v=-x[7];return w+.12*v-.04*(Math.abs(f-n.rot[0])+Math.abs(d-n.rot[2]))};if(this.reachGoal)i=this.reachGoal.slice(),p=a(i[0],i[1]);else for(let f=-3;f<=.6;f+=.2)for(let d=-.2;d<=2.6;d+=.2){const x=a(f,d);x>p&&(p=x,i=[f,d])}for(const f of[.08,.08,.03,.03])for(const d of[-f,0,f])for(const x of[-f,0,f]){const w=a(i[0]+d,i[1]+x);w>p&&(p=w,i=[i[0]+d,i[1]+x])}this.reachGoal=i;const l=1-Math.exp(-r/.45);this.reachAim[0]+=(this.reachGoal[0]-this.reachAim[0])*l,this.reachAim[2]+=(this.reachGoal[1]-this.reachAim[2])*l}else this.reachAim=n.rot.slice(),this.reachGoal=null;const c=t*t*(3-2*t);n.rot=[n.rot[0]+(this.reachAim[0]-n.rot[0])*c,n.rot[1],n.rot[2]+(this.reachAim[2]-n.rot[2])*c],this.fk(this.root)}poseHair(t,e){const o=this.byName.head,n=[0,1,0],r=[1,0,0],c=[0,0,1],u=7,h=Math.min(1.4,e),i=this.hairT===void 0?0:Math.max(0,t-this.hairT);this.hairT=t,this.hairPhase=(this.hairPhase??t)+i*(.9+.5*h);const p=this.hairPhase;this.hair=this.roots.map(a=>{const l=[k(o.p,$(o.R,a.p))],f=$(o.R,a.n),d=a.len/u,x=a.seed;let w=f;for(let v=1;v<=u;v++){const g=v/u,A=x*3.1+p-g*3.4,m=(.25+.95*g)*(.6+.35*(1-Math.min(1,h))),y=k(O(r,Math.sin(A)*m),O(c,Math.sin(A*.73+x)*m*.8)),T=k(k(O(f,.7*(1-g)+.1),O(n,h*(.7+1.1*g))),y);T[1]=Math.max(T[1],.15);const R=st(T);w=st(k(O(w,.35),O(R,.65+.3*g))),l.push(k(l[l.length-1],O(w,d)))}return{pts:l,width:a.width}})}project(t){const e=this.data;let o=0;const n=new Map,r=this.byName,c=[],u=(a,l,f)=>{if(o>=St)return;e.set(l,o*8),e.set(f,o*8+4),n.has(a)||(n.set(a,{start:o,count:0,minX:1e9,minY:1e9,maxX:-1e9,maxY:-1e9,k:0}),c.push(a));const d=n.get(a);return d.count++,o++,d},h=(a,l,f,d)=>{a.minX=Math.min(a.minX,l-d),a.maxX=Math.max(a.maxX,l+d),a.minY=Math.min(a.minY,f-d),a.maxY=Math.max(a.maxY,f+d)};this.pxPerM=t.pxPerUnit/t.project([0,0,0])[2];const i=(a,l,f,d,x,w,v)=>{const g=t.project(a),A=t.project(l),m=f*t.pxPerUnit/g[2],y=d*t.pxPerUnit/A[2],T=x*this.pxPerM,R=u(w,[g[0],g[1],A[0],A[1]],[m,y,v?2:0,T]);R&&(h(R,g[0],g[1],m),h(R,A[0],A[1],y),R.k=Math.max(R.k,T))};for(const a of this.shapes){const l=r[a.j],f=l.side;if(a.type===0){const d=[a.a[0]*f,a.a[1],a.a[2]],x=[a.b[0]*f,a.b[1],a.b[2]];i(k(l.p,$(l.R,d)),k(l.p,$(l.R,x)),a.ra,a.rb,a.k,a.g,!1)}else{const d=k(l.p,$(l.R,[a.c[0]*f,a.c[1],a.c[2]]));let x=l.R;a.e&&(x=F(x,pt(a.e[0],a.e[1]*f,a.e[2]*f)));const w=F(t.R,x),v=[0,1,2].map(z=>[w[0+z]*a.r[z],w[3+z]*a.r[z]]);let g=0,A=0,m=0;for(const[z,ft]of v)g+=z*z,A+=z*ft,m+=ft*ft;const y=t.project(d),T=t.pxPerUnit/y[2];g*=T*T,A*=T*T,m*=T*T;const R=(g+m)/2,P=Math.sqrt(((g-m)/2)**2+A*A),j=R+P,Zt=Math.max(R-P,1e-6),yt=.5*Math.atan2(2*A,g-m),Rt=Math.sqrt(j),te=Math.sqrt(Zt),Tt=a.k*this.pxPerM,it=u(a.g,[y[0],y[1],Math.cos(yt),Math.sin(yt)],[Rt,te,1,Tt]);if(!it)continue;h(it,y[0],y[1],Rt),it.k=Math.max(it.k,Tt)}}for(const{pts:a,width:l}of this.hair){const f=a.length-1,d=x=>l*Math.pow(1-x,1.4)+.0016;for(let x=0;x<f;x++){const w=d(x/f),v=d((x+1)/f);i(a[x],a[x+1],w,v,Math.max(.0025,w*1.5),"hair",!0)}}this.count=o,this.groups=c.map(a=>{const l=n.get(a),f=(l.minX+l.maxX)/2,d=(l.minY+l.maxY)/2;return{cx:f,cy:d,r:Math.hypot(l.maxX-l.minX,l.maxY-l.minY)/2,start:l.start,count:l.count,k:l.k}});const p=t.project(this.torso);return this.torsoPx=p,this}}const Pt=s=>s*s*(3-2*s),Ae=s=>Math.min(1,Math.max(0,s));function Ee(s){let t=s>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function dt(s,t,e,o,n){const r=s-t;return r<=0||r>=e+o+n?0:r<e?Pt(r/e):r<e+o?1:1-Pt((r-e-o)/n)}const Bt=1.7,Se=27;class Le{constructor(t=0){this.wall=t,this.story=Se+t*.9,this.fall=t*Bt,this.rate=1,this.blur=1,this.hold=0,this.holding=!1,this.susp=0,this.rush=0,this.reach=0,this.swell=0;const e=Ee(1789);this.suspensions=[],this.rushes=[];let o=40;for(let n=0;n<400;n++){this.suspensions.push(o);const r=80+e()*55;this.rushes.push(o+22+e()*(r-40)),o+=r}}suspensionAt(t){let e=0;for(const o of this.suspensions){if(o>t)break;e=Math.max(e,dt(t,o,5,10,7))}return e}rushAt(t){let e=0;for(const o of this.rushes){if(o>t)break;e=Math.max(e,dt(t,o,3.5,5,5))}return e}reachAt(t){let e=0;for(const o of this.suspensions){if(o>t)break;e=Math.max(e,dt(t,o+4,6,6,8))}return e}tick(t,e=!1){t=Math.min(t,.1),this.wall+=t;const o=this.wall,n=Math.PI*2,r=.9+.3*Math.sin(n*o/67)+.18*Math.sin(n*o/31+1.3)+.08*Math.sin(n*o/13+.4);this.susp=this.suspensionAt(o),this.rush=this.rushAt(o),this.reach=this.reachAt(o);const c=1-Math.exp(-t/.6);this.hold+=((this.holding?1:0)-this.hold)*(1-Math.exp(-t/(this.holding?.9:1.6)));const u=e?.45:1;let h=r*(1+.85*this.rush);h=h*(1-this.susp)+-.06*this.susp,h*=1-.97*this.hold,this.rate+=(h*u-this.rate)*c;let i=r*(1+1.3*this.rush);i=i*(1-this.susp)+1.05*this.susp,i*=1-.45*this.hold,this.blur+=(i*u-this.blur)*c,this.story+=t*Math.min(1.6,Math.max(.025,this.rate)),this.fall+=t*this.rate*Bt,this.swell=Ae(this.susp*1+this.hold*.5)}}const Pe=`
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
`,tt=[{bass:38,notes:[45,54,57,64],pcs:[0,4,7]},{bass:37,notes:[45,52,57,61],pcs:[7,11,2]},{bass:35,notes:[42,50,54,61],pcs:[9,0,4]},{bass:33,notes:[42,49,54,57],pcs:[4,7,11]},{bass:31,notes:[38,47,54,57],pcs:[5,9,0,4]},{bass:30,notes:[45,50,54,64],pcs:[0,4,7]},{bass:28,notes:[43,50,54,59],pcs:[2,5,9,0]},{bass:33,notes:[40,50,52,55],pcs:[7,0,2,5]}],Be=12.5,kt=.62,Ut=[[66,64,62,57],[66,64,62],[62,61,59,57],[69,66,64,62],[66,64]],et=s=>440*Math.pow(2,(s-69)/12);function ke(s,t=7.5){const e=s.sampleRate,o=Math.floor(e*t),n=s.createBuffer(2,o,e);for(let r=0;r<2;r++){const c=n.getChannelData(r);let u=0,h=r?91:17;const i=()=>(h=h*16807%2147483647)/2147483647*2-1,p=Math.floor(e*.028);for(let a=p;a<o;a++){const l=(a-p)/e,f=.55-.5*Math.min(1,l/t);u+=(i()-u)*f,c[a]=u*Math.exp(-6.9*l/(t*.82))*(l<.06?l/.06:1)}for(const[a,l]of[[11,.5],[23,.32],[37,.24],[53,.16]]){const f=Math.floor(e*(a+(r?4:0))*.001);f<o&&(c[f]+=l*(r?-1:1))}}return n}function Ue(s,t=6){const e=s.sampleRate,o=Math.floor(e*t),n=s.createBuffer(2,o,e);for(let r=0;r<2;r++){const c=n.getChannelData(r);let u=0,h=0,i=0;for(let p=0;p<o;p++){const a=Math.random()*2-1;u=.99765*u+a*.099046,h=.963*h+a*.2965164,i=.57*i+a*1.0526913,c[p]=(u+h+i+a*.1848)*.12}}return n}class De{constructor(){this.started=!1,this.muted=!1,this.ctx=null}async start(t){if(this.started)return;this.started=!0;const e=!t;if(e){const o=window.AudioContext||window.webkitAudioContext;t=new o({latencyHint:"playback"}),t.resume()}if(this.ctx=t,this.hasShepard=!1,t.audioWorklet){const o=URL.createObjectURL(new Blob([Pe],{type:"application/javascript"}));try{await t.audioWorklet.addModule(o),this.hasShepard=!0}catch(n){console.warn("shepard worklet unavailable:",n)}URL.revokeObjectURL(o)}this.build(),this.live=e}build(){const t=this.ctx,e=t.currentTime,o=(T=1)=>{const R=t.createGain();return R.gain.value=T,R};this.master=o(0);const n=t.createDynamicsCompressor();n.threshold.value=-20,n.knee.value=18,n.ratio.value=2.6,n.attack.value=.04,n.release.value=.6,this.master.connect(n).connect(t.destination),this.master.gain.setValueAtTime(0,e),this.master.gain.linearRampToValueAtTime(1e-4,e+.05),this.master.gain.setTargetAtTime(kt,e+.05,2.2),this.dry=o(1),this.dry.connect(this.master),this.verb=t.createConvolver(),this.verb.buffer=ke(t),this.verbIn=o(1);const r=o(.75);this.verbIn.connect(this.verb).connect(r).connect(this.master),this.echoIn=o(1);const c=t.createDelay(3),u=t.createDelay(3);c.delayTime.value=.61,u.delayTime.value=.89;const h=o(.42),i=t.createBiquadFilter();i.type="lowpass",i.frequency.value=2200;const p=t.createChannelMerger(2);this.echoIn.connect(c),c.connect(u),u.connect(i).connect(h).connect(c),c.connect(p,0,0),u.connect(p,0,1);const a=o(.5);p.connect(a),a.connect(this.dry),a.connect(this.verbIn),this.tape=t.createConstantSource(),this.tape.offset.value=0,this.wow=t.createOscillator(),this.wow.frequency.value=.31,this.wowDepth=o(4),this.wow.connect(this.wowDepth),this.tapeBus=o(1),this.tape.connect(this.tapeBus),this.wowDepth.connect(this.tapeBus),this.tape.start(e),this.wow.start(e),this.shepGain=o(0);const l=t.createBiquadFilter();l.type="lowpass",l.frequency.value=2600,l.Q.value=.4,this.hasShepard&&(this.shep=new AudioWorkletNode(t,"shepard",{numberOfInputs:0,outputChannelCount:[2]}),this.shep.connect(l)),l.connect(this.shepGain);const f=o(.35);this.shepGain.connect(f).connect(this.dry),this.shepGain.connect(this.verbIn);const d=[0,1,.45,.24,.14,.085,.05,.03,.018,.01,.006];this.wave=t.createPeriodicWave(new Float32Array(d.length),new Float32Array(d)),this.padFilter=t.createBiquadFilter(),this.padFilter.type="lowpass",this.padFilter.frequency.value=900,this.padFilter.Q.value=.5,this.padBus=o(.11),this.padFilter.connect(this.padBus),this.padBus.connect(this.dry);const x=o(.9);this.padBus.connect(x).connect(this.verbIn),this.voices=[],this.subGain=o(0),this.subGain.connect(this.dry),this.subs=[[12,.62],[0,.5]].map(([T,R])=>{const P=t.createOscillator();P.type="sine",P.frequency.value=et(tt[0].bass+T);const j=o(R);return P.connect(j).connect(this.subGain),this.tapeBus.connect(P.detune),P.start(e),{o:P,shift:T}});const w=Ue(t);this.airSrc=t.createBufferSource(),this.airSrc.buffer=w,this.airSrc.loop=!0,this.airBus=o(0),this.air=[];for(let T=0;T<4;T++){const R=t.createBiquadFilter();R.type="bandpass",R.Q.value=34,R.frequency.value=440;const P=o(1.6);this.airSrc.connect(R).connect(P).connect(this.airBus),this.air.push(R)}this.airBus.connect(this.verbIn);const v=o(.25);this.airBus.connect(v).connect(this.dry),this.airSrc.start(e),this.windSrc=t.createBufferSource(),this.windSrc.buffer=w,this.windSrc.loop=!0,this.windSrc.playbackRate.value=.7,this.windBand=t.createBiquadFilter(),this.windBand.type="bandpass",this.windBand.Q.value=.7,this.windBand.frequency.value=400;const g=t.createBiquadFilter();g.type="lowpass",g.frequency.value=1400,this.windGain=o(0),this.windPan=t.createStereoPanner(),this.windSrc.connect(this.windBand).connect(g).connect(this.windGain).connect(this.windPan),this.windPan.connect(this.dry);const A=o(.3);this.windPan.connect(A).connect(this.verbIn),this.windSrc.start(e),this.bellBus=o(.16),this.bellBus.connect(this.dry);const m=o(.8);this.bellBus.connect(m).connect(this.verbIn);const y=o(.55);this.bellBus.connect(y).connect(this.echoIn),this.lastNow=e,this.mtime=0,this.chordIndex=-1,this.nextChord=0,this.nextMotif=9,this.motifCount=0,this.inSusp=!1,this.lastWall=null}setMuted(t){if(this.muted=t,!this.ctx)return;const e=this.ctx.currentTime;this.master.gain.cancelScheduledValues(e),this.master.gain.setValueAtTime(this.master.gain.value,e),t?(this.master.gain.setTargetAtTime(0,e,.25),this.live&&setTimeout(()=>this.muted&&this.ctx.suspend(),1500)):(this.ctx.resume(),this.master.gain.setTargetAtTime(kt,e,.8))}setHidden(t){!this.ctx||!this.live||this.muted||(t?this.ctx.suspend():this.ctx.resume())}chord(t,e){var r;const o=this.ctx,n=tt[t%tt.length];for(const c of this.voices){c.env.gain.cancelScheduledValues(e),c.env.gain.setTargetAtTime(0,e,2.4);for(const u of c.osc)u.stop(e+14)}this.voices=[],n.notes.forEach((c,u)=>{const h=o.createGain();h.gain.value=0;const i=.32/Math.sqrt(n.notes.length)*(1-u*.09);h.gain.setValueAtTime(0,e),h.gain.setTargetAtTime(i,e,1.6),h.connect(this.padFilter);const p=[-1,1].map(a=>{const l=o.createOscillator();l.setPeriodicWave(this.wave),l.frequency.value=et(c),l.detune.value=a*(c<48?2.5:5+Math.random()*3),this.tapeBus.connect(l.detune);const f=o.createStereoPanner();return f.pan.value=a*(.25+u*.1),l.connect(f).connect(h),l.start(e),this.unhookOnEnd(l),l});this.voices.push({env:h,osc:p})});for(const{o:c,shift:u}of this.subs)c.frequency.setTargetAtTime(et(n.bass+u),e,.9);this.air.forEach((c,u)=>{const h=n.notes[u%n.notes.length]+12;c.frequency.setTargetAtTime(et(h),e,1.4)}),(r=this.shep)==null||r.port.postMessage({chord:n.pcs})}bell(t,e,o,n){const r=this.ctx,c=et(e),u=[[1,1,3.8],[2,.32,2.2],[3,.1,1.2],[4.16,.05,.7],[5.43,.025,.45]];for(const[h,i,p]of u){const a=r.createOscillator();a.frequency.value=c*h,this.tapeBus.connect(a.detune);const l=r.createGain();l.gain.value=0;const f=o*i;if(n){const d=Math.min(2.6,p*.75+.6);l.gain.setValueAtTime(1e-5,t),l.gain.exponentialRampToValueAtTime(f,t+d),l.gain.linearRampToValueAtTime(0,t+d+.05),a.start(t),a.stop(t+d+.1)}else l.gain.setValueAtTime(0,t),l.gain.linearRampToValueAtTime(f,t+.008),l.gain.setTargetAtTime(0,t+.008,p/4),a.start(t),a.stop(t+p*1.6+.2);a.connect(l).connect(this.bellBus),this.unhookOnEnd(a)}}unhookOnEnd(t){t.onended=()=>{try{this.tapeBus.disconnect(t.detune)}catch{}t.disconnect()}}motif(t,e,o,n){const r=Ut[n%Ut.length];let c=t;r.forEach((u,h)=>{const i=.75-h*.08+Math.random()*.1;this.bell(c,u,i,o),Math.random()<.35&&this.bell(c+.004,u-12,i*.4,o),c+=e*(.85+Math.random()*.3)*(h===r.length-2?1.5:1)})}update(t){var x;if(!this.ctx||!this.master)return;const o=this.ctx.currentTime,n=Math.max(0,Math.min(.25,o-this.lastNow));if(this.lastNow=o,n===0&&this.chordIndex>=0)return;const r=t.wall,c=t.rate,u=o+.03,h=(w,v,g=.25)=>w.setTargetAtTime(v,o,g);this.mtime+=n*Math.max(.05,Math.min(1.8,Math.abs(c))),this.mtime>=this.nextChord&&(this.chordIndex++,this.chord(this.chordIndex,u),this.nextChord+=Be);const i=(x=this.shep)==null?void 0:x.parameters;i&&(h(i.get("rate"),-.022*c*(1+.6*t.rush),.4),h(i.get("fifth"),.25+.5*t.susp,1),h(i.get("center"),8.1+.4*Math.sin(r/41)+.3*t.rush,2));const p=.5+.5*Math.sin(r/97*Math.PI*2-1.2),a=.05+.85*p*p+.4*t.rush+.35*t.susp;h(this.shepGain.gain,Math.min(1,a)*.55,1.5);const l=t.swell,f=(650+700*(.5+.5*Math.sin(r/23))+1300*l+900*t.rush)*(1-.45*t.hold);h(this.padFilter.frequency,f,.8),h(this.subGain.gain,.15+.06*l,1),h(this.airBus.gain,.05+.12*l+.03*Math.max(0,Math.sin(r/31)),1.5),h(this.tape.offset,-38*t.hold-8*t.susp,.6),h(this.wowDepth.gain,3+14*t.hold+6*t.susp,.6),h(this.wow.frequency,.12+.25*Math.max(0,Math.min(1.5,c)),.6);const d=Math.max(0,c);if(h(this.windGain.gain,.035*Math.pow(d,1.6)+.06*t.rush,.5),h(this.windBand.frequency,220+420*Math.min(2,d)+600*t.rush,.5),h(this.windPan.pan,.5*Math.sin(r/7.3),.5),this.mtime>=this.nextMotif&&t.susp<.05){const w=.95/Math.max(.35,Math.min(1.6,c));this.motif(u,w,Math.random()<.2,this.motifCount++),this.nextMotif=this.mtime+16+Math.random()*22}else if(Math.random()<n/9&&t.susp<.05){const w=tt[Math.max(0,this.chordIndex)%tt.length],v=w.notes[Math.floor(Math.random()*w.notes.length)]+24;this.bell(u,v,.18+Math.random()*.15,Math.random()<.3)}t.susp>.6&&!this.inSusp?(this.inSusp=!0,this.motif(u+.5,2.4,!0,0)):t.susp<.1&&(this.inSusp=!1)}}const K=document.getElementById("view"),Fe=document.getElementById("sound"),Ce=document.getElementById("reset"),_e=matchMedia("(prefers-reduced-motion: reduce)").matches,B=new URLSearchParams(location.search),V=(s,t)=>B.has(s)?+B.get(s):t;let ct;try{ct=new me(K,{force8:B.has("sdf8")})}catch(s){console.error(s),document.body.classList.add("nogl")}const Y=new Te,G=new xe,E=new Le(Number(B.get("t"))||0),C=new De,rt=[{core:[1,.72,.4],halo:[.7,.42,.2],atten:[3.2,1.7,1.1],bgTop:[.004,.016,.024],bgBot:[0,.002,.004],sky:[.008,.03,.034]},{core:[.8,.88,1],halo:[.26,.38,.55],atten:[2,1.45,.95],bgTop:[.004,.011,.028],bgBot:[0,.001,.005],sky:[.008,.018,.036]},{core:[1,.7,.66],halo:[.5,.28,.36],atten:[1.8,2,1.35],bgTop:[.012,.006,.022],bgBot:[.002,0,.004],sky:[.02,.012,.03]},{core:[.82,1,.9],halo:[.22,.48,.46],atten:[2.8,1.25,1.35],bgTop:[.002,.018,.02],bgBot:[0,.002,.003],sky:[.006,.03,.028]}],qe=95;function ze(s){const t=s/qe%rt.length,e=Math.floor(t);let o=t-e;o=o*o*(3-2*o);const n=rt[e],r=rt[(e+1)%rt.length],c={};for(const u of Object.keys(n))c[u]=n[u].map((h,i)=>h+(r[u][i]-h)*o);return c}const D={x:0,y:0,sx:0,sy:0},M={yaw:V("vyaw",0),pitch:V("vpitch",0),zoom:V("zoom",1)};M.tyaw=M.yaw;M.tpitch=M.pitch;M.tzoom=M.zoom;const Ie=.5,Ne=4.5,Dt=1.3,L=new Map;let X=!1,J=null,lt=!1,Ft=0;function nt(){document.body.classList.remove("idle"),clearTimeout(Ft),Ft=setTimeout(()=>document.body.classList.add("idle"),2600)}function Nt(){E.holding=!0,!C.started&&!C.muted&&Ot()}function Z(){E.holding=lt}function Ot(){C.start().then(()=>document.body.classList.add("sounding")).catch(s=>console.warn("no sound:",s))}const Gt=s=>Math.max(-Dt,Math.min(Dt,s)),Vt=s=>Math.max(Ie,Math.min(Ne,s));function Q(s,t){M.tyaw-=s*.006,M.tpitch=Gt(M.tpitch+t*.005),bt()}function xt(s){M.tzoom=Vt(M.tzoom*s),bt()}function Xt(){M.tyaw=0,M.tpitch=0,M.tzoom=1,M.yaw=Math.atan2(Math.sin(M.yaw),Math.cos(M.yaw)),bt()}function bt(){const s=Math.abs(Math.atan2(Math.sin(M.tyaw),Math.cos(M.tyaw)))>.03||Math.abs(M.tpitch)>.03||Math.abs(Math.log(M.tzoom))>.03;document.body.classList.toggle("moved",s)}const Ht=s=>{var t,e;return(e=(t=s.target).closest)==null?void 0:e.call(t,"button")};addEventListener("pointerdown",s=>{if(!Ht(s)){nt();try{K.setPointerCapture(s.pointerId)}catch{}if(L.set(s.pointerId,{x:s.clientX,y:s.clientY,x0:s.clientX,y0:s.clientY}),L.size===1)X=!1,Nt();else if(L.size===2){const[t,e]=[...L.values()];J={d0:Math.hypot(t.x-e.x,t.y-e.y)||1,zoom0:M.tzoom},X=!0,Z()}}});addEventListener("pointermove",s=>{nt(),s.pointerType==="mouse"&&L.size===0&&(D.x=s.clientX/innerWidth*2-1,D.y=s.clientY/innerHeight*2-1);const t=L.get(s.pointerId);if(!t)return;const e=s.clientX-t.x,o=s.clientY-t.y;if(t.x=s.clientX,t.y=s.clientY,L.size===1)!X&&Math.hypot(t.x-t.x0,t.y-t.y0)>6&&(X=!0,Z()),X&&Q(e,o);else if(L.size===2&&J){const[n,r]=[...L.values()],c=Math.hypot(n.x-r.x,n.y-r.y)||1;M.tzoom=Vt(J.zoom0*J.d0/c),Q(e/2,o/2)}});function $t(s){L.delete(s.pointerId),L.size<2&&(J=null),L.size===0&&(X=!1,Z())}addEventListener("pointerup",$t);addEventListener("pointercancel",$t);addEventListener("blur",()=>{L.clear(),J=null,X=!1,lt=!1,Z()});addEventListener("wheel",s=>{s.preventDefault(),nt();const t=s.deltaMode===1?s.deltaY*16:s.deltaMode===2?s.deltaY*innerHeight:s.deltaY;xt(Math.exp(Math.max(-200,Math.min(200,t))*.0015))},{passive:!1});addEventListener("keydown",s=>{nt();const t=s.key;if(t==="ArrowLeft")Q(-28,0);else if(t==="ArrowRight")Q(28,0);else if(t==="ArrowUp")Q(0,-28);else if(t==="ArrowDown")Q(0,28);else if(t==="+"||t==="=")xt(1/1.15);else if(t==="-"||t==="_")xt(1.15);else{if(s.repeat)return;if(s.code==="Space")lt=!0,Nt();else if(s.code==="KeyM")Yt();else if(s.code==="KeyF")jt();else if(s.code==="KeyR"||t==="0")Xt();else return}s.preventDefault()});addEventListener("keyup",s=>{s.code==="Space"&&(lt=!1,(L.size===0||X)&&Z())});addEventListener("dblclick",s=>{Ht(s)||jt()});addEventListener("contextmenu",s=>s.preventDefault());function jt(){var s,t,e;document.fullscreenElement?(s=document.exitFullscreen)==null||s.call(document):(e=(t=document.documentElement).requestFullscreen)==null||e.call(t).catch(()=>{})}function Yt(){if(!C.started){C.muted=!1,Ot();return}C.setMuted(!C.muted),document.body.classList.toggle("sounding",!C.muted)}Fe.addEventListener("click",s=>{s.stopPropagation(),Yt()});Ce.addEventListener("click",s=>{s.stopPropagation(),Xt()});const q=[[.5,2],[.6,2],[.7,2],[.85,2],[1,2],[1,1],[1.25,1],[1.5,1],[1.75,1],[2,1]],Oe=83e5,wt=12e3,b={rung:B.has("rung")?Math.max(0,Math.min(q.length-1,+B.get("rung")|0)):(devicePixelRatio||1)>=2?7:5,ceiling:q.length-1,climbUntil:performance.now()+wt,refresh:1/0,slowStreak:0,samples:[],quietUntil:performance.now()+2500,windowStart:0},Ge=B.has("govern")||!B.has("rung")&&!navigator.webdriver;let Wt=performance.now(),Kt=0,ot=performance.now(),Ct=!1;function gt(s){const t=Math.sqrt(Oe/Math.max(1,innerWidth*innerHeight));return Math.min(q[s][0],t)}const Ve=s=>s+1<q.length&&(gt(s+1)>gt(s)+1e-6||q[s+1][1]<q[s][1]);function Xe(){const s=gt(b.rung),t=Math.max(2,Math.round(innerWidth*s)),e=Math.max(2,Math.round(innerHeight*s));return(K.width!==t||K.height!==e)&&(K.width=t,K.height=e),[t,e,q[b.rung][1],s]}function _t(s,t){s=Math.max(0,Math.min(q.length-1,s)),s!==b.rung&&(b.rung=s,b.slowStreak=0,Mt(t))}function Mt(s,t=700){b.samples=[],b.quietUntil=s+t}function He(s,t){if(t<b.quietUntil)return;b.samples.length===0&&(b.windowStart=t),b.samples.push(s);const e=b.samples.length;if(e<45&&!(e>=6&&t-b.windowStart>1500))return;const o=b.samples.slice().sort((h,i)=>h-i);b.samples=[];const n=o[e>>1],r=o[Math.floor(e*.9)];if(b.refresh=Math.max(4,Math.min(b.refresh,o[Math.floor(e*.1)])),b.rung>0&&(n>Math.max(19.5,b.refresh*1.25)||n>40)){const h=n>Math.max(34,b.refresh*2.2)||n>66;b.slowStreak++,(h||b.slowStreak>=2)&&(_t(b.rung-(h?2:1),t),b.ceiling=Math.min(b.ceiling,b.rung));return}b.slowStreak=0,n<b.refresh*1.08&&r<b.refresh*1.4&&n<22&&t<b.climbUntil&&b.rung<b.ceiling&&Ve(b.rung)&&_t(b.rung+1,t)}function Qt(s){const t=s-ot;ot=s;const e=Math.min(.1,t/1e3);Ge&&He(t,s),Kt++,$e(e),requestAnimationFrame(Qt)}function $e(s){if(E.tick(B.has("still")?0:s,_e),C.update(E),!ct)return;const[t,e,o,n]=Xe();ct.resize(t,e,o,n);const r=E.wall;D.sx+=(D.x-D.sx)*Math.min(1,s*1.5),D.sy+=(D.y-D.sy)*Math.min(1,s*1.5);const c=1-Math.exp(-s/.14);M.yaw+=(M.tyaw-M.yaw)*c,M.pitch+=(M.tpitch-M.pitch)*c,M.zoom=Math.exp(Math.log(M.zoom)+(Math.log(M.tzoom)-Math.log(M.zoom))*(1-Math.exp(-s/.2)));const u=t/e,h=Math.max(1.36,1.5/u),i=.68-.24*E.susp+.14*E.rush-.08*E.hold,p=h/Math.tan(i/2)*M.zoom,a=.1*Math.sin(r/41)+D.sx*.08+M.yaw,l=Gt(.1+.07*Math.sin(r/53)+.18*E.rush+D.sy*.06+M.pitch);G.w=t,G.h=e,G.fov=i,G.target=[0,0,0],G.pos=[Math.sin(a)*Math.cos(l)*p,Math.sin(l)*p,Math.cos(a)*Math.cos(l)*p],G.update();const f=E.story,d=V("roll",1.72+.36*Math.sin(f/31)+.12*Math.sin(f/13+1)),x=V("twist",1+f*Math.PI*2/75+.45*Math.sin(f/17)),w=V("yaw",.25*Math.sin(f/21+.5)),v=V("tilt",-.2+.2*Math.sin(f/17+2)),g=F(mt(w),F(qt(v),F(zt(d),mt(x)))),A=.35+.6*Math.min(2,Math.max(0,E.blur));Y.pose(f,{wind:A,reach:V("reach",E.reach),wall:r,orient:g,preset:B.get("pose")}),Y.project(G);const m=Y.torsoPx,y=[m[0]+Y.pxPerM*(.12*Math.sin(r/29)+.05*Math.sin(r/11)),m[1]+Y.pxPerM*(.08*Math.sin(r/37+2)+.04)],T=960,R=B.has("t")?1:Math.min(1,(performance.now()-Wt)/5e3);ct.render({figure:Y,cam:G,lightPx:y,story:f,wall:r,fallSmall:E.fall%T,drift:E.fall%65536,shutter:.085*Math.max(.12,E.blur),focus:p,aperture:.06,exposure:1+.3*E.swell,swell:E.swell,palette:ze(r+20),fade:R*R,bloom:.3,pr:n,debug:B.has("fig")}),!Ct&&R>=1&&Kt>8&&(Ct=!0,document.body.classList.add("ready"))}addEventListener("resize",()=>{const s=performance.now();Mt(s),b.ceiling=q.length-1,b.climbUntil=s+wt,b.slowStreak=0});document.addEventListener("visibilitychange",()=>{ot=performance.now(),Mt(ot,1500),document.hidden&&Z(),C.setHidden(document.hidden)});nt();const at=[];function Jt(s){if(at.push(s),at.length<18){requestAnimationFrame(Jt);return}const t=at.slice(1).map((e,o)=>e-at[o]).sort((e,o)=>e-o);b.refresh=Math.max(4,t[t.length>>1]),ot=s,Wt=s,b.quietUntil=s+2500,b.climbUntil=s+wt,requestAnimationFrame(Qt)}requestAnimationFrame(Jt);
