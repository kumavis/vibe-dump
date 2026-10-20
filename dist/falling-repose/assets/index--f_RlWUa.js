(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const c of n)if(c.type==="childList")for(const u of c.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&s(u)}).observe(document,{childList:!0,subtree:!0});function e(n){const c={};return n.integrity&&(c.integrity=n.integrity),n.referrerPolicy&&(c.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?c.credentials="include":n.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function s(n){if(n.ep)return;n.ep=!0;const c=e(n);fetch(n.href,c)}})();function re(o){const t=o.getContext("webgl2",{antialias:!1,alpha:!1,depth:!1,stencil:!1,premultipliedAlpha:!1,preserveDrawingBuffer:!1,powerPreference:"high-performance"});if(!t)return null;const e=!!(t.getExtension("EXT_color_buffer_float")||t.getExtension("EXT_color_buffer_half_float"));return t.getExtension("OES_texture_float_linear"),{gl:t,floatOk:e}}function At(o,t,e){const s=o.createShader(t);if(o.shaderSource(s,e),o.compileShader(s),!o.getShaderParameter(s,o.COMPILE_STATUS)){const n=o.getShaderInfoLog(s),c=e.split(`
`).map((u,a)=>`${String(a+1).padStart(3)} ${u}`).join(`
`);throw new Error(`shader compile failed:
${n}
${c}`)}return s}function z(o,t,e,s=""){if(s){const a=e.indexOf(`
`);e=e.slice(0,a+1)+s+e.slice(a+1)}const n=o.createProgram();if(o.attachShader(n,At(o,o.VERTEX_SHADER,t)),o.attachShader(n,At(o,o.FRAGMENT_SHADER,e)),o.linkProgram(n),!o.getProgramParameter(n,o.LINK_STATUS))throw new Error(`link failed: ${o.getProgramInfoLog(n)}`);const c={},u=o.getProgramParameter(n,o.ACTIVE_UNIFORMS);for(let a=0;a<u;a++){const h=o.getActiveUniform(n,a),i=h.name.replace(/\[0\]$/,"");c[i]=o.getUniformLocation(n,h.name)}return{p:n,u:c}}function j(o,t,e,{float:s=!0,linear:n=!0,channels:c=4}={}){const u=o.createTexture();o.bindTexture(o.TEXTURE_2D,u);let a,h,i;s?(a=c===2?o.RG16F:o.RGBA16F,h=c===2?o.RG:o.RGBA,i=o.HALF_FLOAT):(a=o.RGBA8,h=o.RGBA,i=o.UNSIGNED_BYTE),o.texImage2D(o.TEXTURE_2D,0,a,t,e,0,h,i,null);const f=n?o.LINEAR:o.NEAREST;o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,f),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,f),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_S,o.CLAMP_TO_EDGE),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_T,o.CLAMP_TO_EDGE);const r=o.createFramebuffer();o.bindFramebuffer(o.FRAMEBUFFER,r),o.framebufferTexture2D(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,u,0);const l=o.checkFramebufferStatus(o.FRAMEBUFFER)===o.FRAMEBUFFER_COMPLETE;return o.bindFramebuffer(o.FRAMEBUFFER,null),{tex:u,fbo:r,w:t,h:e,ok:l}}function ae(o,t){t&&(o.deleteTexture(t.tex),o.deleteFramebuffer(t.fbo))}function q(o,t){t?(o.bindFramebuffer(o.FRAMEBUFFER,t.fbo),o.viewport(0,0,t.w,t.h)):(o.bindFramebuffer(o.FRAMEBUFFER,null),o.viewport(0,0,o.drawingBufferWidth,o.drawingBufferHeight))}function L(o,t,e,s){o.activeTexture(o.TEXTURE0+t),o.bindTexture(o.TEXTURE_2D,e),s&&o.uniform1i(s,t)}function ce(o){const t=o.createVertexArray();return()=>{o.bindVertexArray(t),o.drawArrays(o.TRIANGLES,0,3)}}const U=`#version 300 es
precision highp float;
precision highp int;
`,lt=`
float sdfDecode(vec4 v) {
#ifdef SDF8
  float fine = (v.r - 0.5) * 256.0;
  return abs(fine) < 120.0 ? fine : (v.b - 0.5) * 8192.0;
#else
  return v.r;
#endif
}
`,ft=`
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
}`,he=`${U}
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
}`,ue=`${U}
${lt}
${ft}
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
}`,le=`${U}
${ft}
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
}`,fe=`${U}
${ft}
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
}`,de=`${U}
${lt}
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
}`,pe=`${U}
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
}`,me=`${U}
${lt}
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
}`,ve=`${U}
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
}`,xe=`${U}
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
}`,ge=`${U}
${lt}
${ft}
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
}`,be=`${U}
uniform highp sampler2D uPrims3;
uniform vec4 uGroups3[12]; // centre, radius (blend margin included)
uniform ivec2 uRanges3[12];
uniform int uGroupCount3;
uniform vec4 uBound;
uniform vec3 uCamPos;
uniform vec3 uRight;
uniform vec3 uUp;
uniform vec3 uFwd;
uniform float uFocal;
uniform float uAspect;
in vec2 vUv;
out vec4 o;

float dot2(vec3 v) { return dot(v, v); }

// a cone capped by two spheres of different radii (after Inigo Quilez)
float sdRoundCone(vec3 p, vec3 a, vec3 b, float r1, float r2) {
  vec3 ba = b - a;
  float l2 = dot(ba, ba);
  float rr = r1 - r2;
  float a2 = l2 - rr * rr;
  if (a2 <= 1e-9) return r1 > r2 ? length(p - a) - r1 : length(p - b) - r2;
  float il2 = 1.0 / l2;
  vec3 pa = p - a;
  float y = dot(pa, ba);
  float z = y - l2;
  float x2 = dot2(pa * l2 - ba * y);
  float y2 = y * y * l2;
  float z2 = z * z * l2;
  float k = sign(rr) * rr * rr * x2;
  if (sign(z) * a2 * z2 > k) return sqrt(x2 + z2) * il2 - r2;
  if (sign(y) * a2 * y2 < k) return sqrt(x2 + y2) * il2 - r1;
  return (sqrt(x2 * a2 * il2) + y * rr) * il2 - r1;
}

float sdEllipsoid(vec3 p, vec3 c, vec3 ax, vec3 ay, vec3 az, vec3 r) {
  vec3 d = p - c;
  vec3 q = vec3(dot(ax, d), dot(ay, d), dot(az, d));
  float k0 = length(q / r);
  float k1 = length(q / (r * r));
  return k1 > 1e-6 ? k0 * (k0 - 1.0) / k1 : -min(r.x, min(r.y, r.z));
}

float map(vec3 p, out float hair) {
  float d = 1e5;
  hair = 0.0;
  for (int g = 0; g < 12; g++) {
    if (g >= uGroupCount3) break;
    vec4 G = uGroups3[g];
    if (length(p - G.xyz) - G.w > d) continue;
    ivec2 R = uRanges3[g];
    for (int i = 0; i < 128; i++) {
      if (i >= R.y) break;
      int x = (R.x + i) * 4;
      vec4 A = texelFetch(uPrims3, ivec2(x, 0), 0);
      vec4 B = texelFetch(uPrims3, ivec2(x + 1, 0), 0);
      vec4 C = texelFetch(uPrims3, ivec2(x + 2, 0), 0);
      float di, k, isHair = 0.0;
      // a cone is tagged -1 where an ellipsoid keeps a (positive) radius
      if (C.w < 0.0) {
        di = sdRoundCone(p, A.xyz, B.xyz, A.w, B.w);
        k = C.x;
        isHair = C.y == 2.0 ? 1.0 : 0.0;
      } else {
        vec4 D = texelFetch(uPrims3, ivec2(x + 3, 0), 0);
        di = sdEllipsoid(p, A.xyz, B.xyz, C.xyz, D.xyz, vec3(B.w, C.w, D.w));
        k = A.w;
      }
      k = max(k, 1e-4);
      float h = clamp(0.5 + 0.5 * (d - di) / k, 0.0, 1.0);
      d = mix(d, di, h) - k * h * (1.0 - h);
      hair = mix(hair, isHair, h);
    }
  }
  return d;
}

float map(vec3 p) {
  float h;
  return map(p, h);
}

vec3 normalAt(vec3 p) {
  // a wide sample: overlapping blended shapes ripple the field finely
  vec2 e = vec2(1.0, -1.0) * 0.0015;
  return normalize(e.xyy * map(p + e.xyy) + e.yyx * map(p + e.yyx) + e.yxy * map(p + e.yxy) + e.xxx * map(p + e.xxx));
}

float occlusion(vec3 p, vec3 n) {
  float occ = 0.0, w = 1.0;
  for (int i = 1; i <= 5; i++) {
    float h = 0.006 + 0.02 * float(i);
    occ += (h - map(p + n * h)) * w;
    w *= 0.7;
  }
  return clamp(1.0 - 2.5 * occ / 0.06, 0.0, 1.0);
}

float softShadow(vec3 ro, vec3 rd) {
  // start clear of the surface: where blended shapes overlap the distance
  // estimate is loose, and a shadow ray that starts too close finds itself
  float res = 1.0, t = 0.015;
  for (int i = 0; i < 48; i++) {
    float h = map(ro + rd * t);
    res = min(res, 7.0 * h / t);
    t += clamp(h, 0.005, 0.06);
    if (res < 0.005 || t > 1.2) break;
  }
  return clamp(res, 0.0, 1.0);
}

vec3 aces(vec3 x) {
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

void main() {
  vec2 ndc = vUv * 2.0 - 1.0;
  vec3 rd = normalize(uFwd * uFocal + uRight * ndc.x * uAspect + uUp * ndc.y);
  vec3 ro = uCamPos;
  vec3 bg = mix(vec3(0.05, 0.055, 0.065), vec3(0.2, 0.21, 0.23), smoothstep(-0.2, 1.1, vUv.y));
  bg *= 1.0 - 0.35 * dot(ndc * 0.6, ndc * 0.6);
  vec3 col = bg;

  vec3 oc = ro - uBound.xyz;
  float b = dot(oc, rd);
  float cc = dot(oc, oc) - uBound.w * uBound.w;
  float disc = b * b - cc;
  if (disc > 0.0) {
    float t = max(-b - sqrt(disc), 0.0);
    float t1 = -b + sqrt(disc);
    float hairW = 0.0;
    bool hit = false;
    // the ellipsoid distance is an estimate that can overshoot at a graze,
    // so step short; it costs steps, and this view has time
    for (int i = 0; i < 400; i++) {
      vec3 p = ro + rd * t;
      float d = map(p, hairW);
      if (d < 0.00012 * t + 0.00002) {
        hit = true;
        break;
      }
      t += d * 0.55;
      if (t > t1) break;
    }
    if (hit) {
      vec3 p = ro + rd * t;
      vec3 n = normalAt(p);
      vec3 key = normalize(-uRight * 0.55 + uUp * 0.7 - uFwd * 0.5);
      vec3 fill = normalize(uRight * 0.85 + uUp * 0.05 - uFwd * 0.45);
      vec3 albedo = mix(vec3(0.78, 0.73, 0.68), vec3(0.3, 0.24, 0.19), hairW);
      float ao = occlusion(p, n);
      float sh = softShadow(p + n * 0.006, key);
      float dk = max(dot(n, key), 0.0);
      float df = max(dot(n, fill), 0.0);
      float sky = 0.5 + 0.5 * dot(n, uUp);
      float fres = pow(1.0 - clamp(dot(n, -rd), 0.0, 1.0), 4.0);
      vec3 lit = vec3(1.0, 0.95, 0.88) * dk * sh * 1.6 + vec3(0.55, 0.65, 0.8) * df * 0.45 + vec3(0.3, 0.33, 0.38) * sky * 0.5;
      col = albedo * lit * (0.35 + 0.65 * ao);
      // the piece's own light, from behind: a warm rim on every edge
      col += vec3(1.0, 0.8, 0.55) * fres * 0.9 * (0.5 + 0.5 * ao);
      vec3 hv = normalize(key - rd);
      col += vec3(1.0) * pow(max(dot(n, hv), 0.0), 40.0) * 0.12 * sh * (1.0 - hairW);
    }
  }
  col = aces(col * 1.1);
  o = vec4(pow(col, vec3(1.0 / 2.2)), 1.0);
}`,we=5;class ye{constructor(t,{force8:e=!1}={}){const s=re(t);if(!s)throw new Error("webgl2");this.gl=s.gl,this.floatOk=s.floatOk&&!e;const n=this.gl;this.canvas=t,this.quad=ce(n);const c=this.floatOk?"":`#define SDF8
`;this.pSil=z(n,I,he,c),this.pEmit=z(n,I,ue,c),this.pRadial=z(n,I,le),this.pHaze=z(n,I,fe),this.pScene=z(n,I,de,c),this.pPart=z(n,pe,me,c),this.pDown=z(n,I,ve),this.pUp=z(n,I,xe),this.pFinal=z(n,I,ge,c),this.pSolid=null,this.primTex=n.createTexture(),n.bindTexture(n.TEXTURE_2D,this.primTex),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.NEAREST),n.texImage2D(n.TEXTURE_2D,0,n.RGBA32F,400,1,0,n.RGBA,n.FLOAT,null),this.initParticles(),console.info(`falling-repose: ${this.floatOk?"float":"8-bit"} targets`),this.w=0,this.h=0}initParticles(){const t=this.gl;this.layers=[{count:4600,size:[14,10,14],ahead:6},{count:40,size:[4,4,4],ahead:2.9},{count:5200,size:[36,24,36],ahead:14}];const e=this.layers.reduce((i,f)=>i+f.count,0),s=new Float32Array(e*4),n=new Float32Array(e*4);let c=12345;const u=()=>(c=c*16807%2147483647)/2147483647;let a=0;this.layers.forEach((i,f)=>{for(let r=0;r<i.count;r++,a++){s.set([u(),u(),u(),u()],a*4);const l=(5+Math.floor(u()*8))/8,d=f===1?.004+u()*.006:f===2?.005+Math.pow(u(),2)*.012:.0025+Math.pow(u(),3)*.006,p=f===1?.5+u()*.5:.35+Math.pow(u(),2)*1.4;n.set([l,d,p,f],a*4)}}),this.particleTotal=e,this.vao=t.createVertexArray(),t.bindVertexArray(this.vao);const h=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,h),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),t.STATIC_DRAW),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,2,t.FLOAT,!1,0,0);for(const[i,f]of[[1,s],[2,n]]){const r=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,r),t.bufferData(t.ARRAY_BUFFER,f,t.STATIC_DRAW),t.enableVertexAttribArray(i),t.vertexAttribPointer(i,4,t.FLOAT,!1,0,0),t.vertexAttribDivisor(i,1)}t.bindVertexArray(null)}renderSolid(t){const e=this.gl,s=t.figure;this.pSolid||(this.pSolid=z(e,I,be),this.primTex3=e.createTexture(),e.bindTexture(e.TEXTURE_2D,this.primTex3),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texImage2D(e.TEXTURE_2D,0,e.RGBA32F,s.data3.length/4,1,0,e.RGBA,e.FLOAT,null)),e.bindTexture(e.TEXTURE_2D,this.primTex3),e.texSubImage2D(e.TEXTURE_2D,0,0,0,s.count3*4,1,e.RGBA,e.FLOAT,s.data3,0),q(e,null);const n=this.pSolid.u;e.useProgram(this.pSolid.p),L(e,0,this.primTex3,n.uPrims3);const c=new Float32Array(48),u=new Int32Array(24),a=[1e9,1e9,1e9],h=[-1e9,-1e9,-1e9];s.groups3.slice(0,12).forEach((r,l)=>{c.set([...r.c,r.r+r.k],l*4),u.set([r.start,r.count],l*2);for(let d=0;d<3;d++)a[d]=Math.min(a[d],r.c[d]-r.r),h[d]=Math.max(h[d],r.c[d]+r.r)}),e.uniform4fv(n.uGroups3,c),e.uniform2iv(n.uRanges3,u),e.uniform1i(n.uGroupCount3,Math.min(12,s.groups3.length));const i=a.map((r,l)=>(r+h[l])/2);e.uniform4f(n.uBound,i[0],i[1],i[2],Math.hypot(h[0]-a[0],h[1]-a[1],h[2]-a[2])/2+.05);const f=t.cam.R;e.uniform3fv(n.uCamPos,t.cam.pos),e.uniform3f(n.uRight,f[0],f[1],f[2]),e.uniform3f(n.uUp,f[3],f[4],f[5]),e.uniform3f(n.uFwd,-f[6],-f[7],-f[8]),e.uniform1f(n.uFocal,t.cam.focal),e.uniform1f(n.uAspect,this.w/this.h),this.quad()}resize(t,e,s=2,n=1){if(t===this.w&&e===this.h&&s===this.sdfDiv&&n===this.pr)return;const c=this.gl;this.w=t,this.h=e,this.sdfDiv=s,this.pr=n;for(const r of[this.sdf,this.emit,this.ra,this.rb,this.haze,this.scene,...this.bloom??[]])ae(c,r);const u=Math.max(1,Math.ceil(t/2)),a=Math.max(1,Math.ceil(e/2)),h={float:this.floatOk};this.sdf=j(c,Math.max(1,Math.ceil(t/s)),Math.max(1,Math.ceil(e/s)),{float:this.floatOk,channels:this.floatOk?2:4}),this.emit=j(c,u,a,h),this.ra=j(c,u,a,h),this.rb=j(c,u,a,h),this.haze=j(c,Math.max(1,Math.ceil(t/4)),Math.max(1,Math.ceil(e/4)),h),this.scene=j(c,t,e,h),this.bloom=[];let i=t/n,f=e/n;for(let r=0;r<we;r++)i=Math.max(1,Math.ceil(i/2)),f=Math.max(1,Math.ceil(f/2)),this.bloom.push(j(c,i,f,h))}render(t){const e=this.gl,{w:s,h:n}=this,c=t.figure;if(t.solid)return this.renderSolid(t);e.bindTexture(e.TEXTURE_2D,this.primTex),e.texSubImage2D(e.TEXTURE_2D,0,0,0,c.count*2,1,e.RGBA,e.FLOAT,c.data,0),q(e,this.sdf),e.useProgram(this.pSil.p),L(e,0,this.primTex,this.pSil.u.uPrims);const u=new Float32Array(48),a=new Int32Array(24);c.groups.slice(0,12).forEach((m,y)=>{u.set([m.cx,m.cy,m.r,m.k+2],y*4),a.set([m.start,m.count],y*2)}),e.uniform4fv(this.pSil.u.uGroups,u),e.uniform2iv(this.pSil.u.uRanges,a),e.uniform1i(this.pSil.u.uGroupCount,Math.min(12,c.groups.length)),e.uniform2f(this.pSil.u.uScale,s/this.sdf.w,n/this.sdf.h),this.quad();const h=t.lightPx;q(e,this.emit);let i=this.pEmit.u;e.useProgram(this.pEmit.p),L(e,0,this.sdf.tex,i.uSdf),e.uniform2f(i.uRes,s,n),e.uniform2f(i.uLight,h[0],h[1]),e.uniform1f(i.uPxPerM,c.pxPerM),e.uniform1f(i.uTime,t.story),e.uniform1f(i.uDrift,t.drift),e.uniform3fv(i.uCore,t.palette.core),e.uniform3fv(i.uHalo,t.palette.halo),e.uniform1f(i.uSwell,t.swell),this.quad(),e.useProgram(this.pRadial.p),i=this.pRadial.u,e.uniform2f(i.uCenter,h[0]/s,h[1]/n),e.uniform3fv(i.uAtten,t.palette.atten);const f=10,r=.92,l=[r/(f*f*f),r/(f*f),r/f];let d=this.emit,p=this.ra;for(let m=0;m<3;m++)q(e,p),L(e,0,d.tex,i.uSrc),e.uniform1f(i.uStep,l[m]),this.quad(),d=p,p=p===this.ra?this.rb:this.ra;const v=d;q(e,this.haze),e.useProgram(this.pHaze.p),i=this.pHaze.u,e.uniform2f(i.uRes,s,n),e.uniform2f(i.uLight,h[0],h[1]),e.uniform1f(i.uPxPerM,c.pxPerM),e.uniform1f(i.uTime,t.story),e.uniform1f(i.uDrift,t.drift),this.quad(),q(e,this.scene),e.useProgram(this.pScene.p),i=this.pScene.u,L(e,0,this.sdf.tex,i.uSdf),L(e,1,v.tex,i.uScatter),L(e,2,this.emit.tex,i.uEmit),L(e,3,this.haze.tex,i.uHaze),e.uniform2f(i.uRes,s,n),e.uniform2f(i.uLight,h[0],h[1]),e.uniform1f(i.uPxPerM,c.pxPerM),e.uniform1f(i.uExposure,t.exposure),e.uniform3fv(i.uBgTop,t.palette.bgTop),e.uniform3fv(i.uBgBot,t.palette.bgBot),e.uniform3fv(i.uHalo,t.palette.halo),e.uniform3fv(i.uSky,t.palette.sky),e.uniform1f(i.uAA,1),this.quad(),e.enable(e.BLEND),e.blendFunc(e.ONE,e.ONE),e.useProgram(this.pPart.p),i=this.pPart.u,e.uniformMatrix4fv(i.uViewProj,!1,t.cam.viewProj()),e.uniform2f(i.uRes,s,n),e.uniform1f(i.uFall,t.fallSmall),e.uniform1f(i.uShutter,t.shutter),e.uniform1f(i.uTime,t.story);const w=[],x=[],g=t.cam.forward();for(const m of this.layers)w.push(...m.size),x.push(...t.cam.pos.map((y,R)=>y+g[R]*m.ahead));e.uniform3fv(i.uBoxSize,w),e.uniform3fv(i.uBoxCenter,x),e.uniform1f(i.uFocus,t.focus),e.uniform1f(i.uAperture,t.aperture),e.uniform1f(i.uPxPerUnit,t.cam.pxPerUnit),e.uniform1f(i.uFigureDepth,t.focus),e.uniform1f(i.uExposure,t.exposure),e.uniform1f(i.uAA,1),L(e,0,this.sdf.tex,i.uSdf),L(e,1,v.tex,i.uScatter),e.bindVertexArray(this.vao),e.drawArraysInstanced(e.TRIANGLE_STRIP,0,4,this.particleTotal),e.bindVertexArray(null),e.disable(e.BLEND),e.useProgram(this.pDown.p);let E=this.scene;for(const m of this.bloom){q(e,m),L(e,0,E.tex,this.pDown.u.uSrc);const y=Math.max(1,E.w/m.w/2);e.uniform2f(this.pDown.u.uTexel,y/E.w,y/E.h),this.quad(),E=m}e.useProgram(this.pUp.p),e.enable(e.BLEND),e.blendFunc(e.ONE,e.ONE);for(let m=this.bloom.length-1;m>0;m--){const y=this.bloom[m],R=this.bloom[m-1];q(e,R),L(e,0,y.tex,this.pUp.u.uSrc),e.uniform2f(this.pUp.u.uTexel,1/y.w,1/y.h),this.quad()}e.disable(e.BLEND),q(e,null),e.useProgram(this.pFinal.p),i=this.pFinal.u,L(e,0,this.scene.tex,i.uScene),L(e,1,this.bloom[0].tex,i.uBloom),L(e,2,this.sdf.tex,i.uSdf),e.uniform2f(i.uRes,s,n),e.uniform1f(i.uTime,t.wall),e.uniform1f(i.uFade,t.fade),e.uniform1f(i.uBloomAmt,t.bloom),e.uniform1f(i.uGrain,.035),e.uniform1f(i.uPx,t.pr??1),e.uniform1i(i.uDebug,t.debug?1:0),this.quad()}}function F(o,t){const e=new Array(9);for(let s=0;s<3;s++)for(let n=0;n<3;n++)e[s*3+n]=o[s*3]*t[n]+o[s*3+1]*t[3+n]+o[s*3+2]*t[6+n];return e}function D(o,t){return[o[0]*t[0]+o[1]*t[1]+o[2]*t[2],o[3]*t[0]+o[4]*t[1]+o[5]*t[2],o[6]*t[0]+o[7]*t[1]+o[8]*t[2]]}const Nt=o=>{const t=Math.cos(o),e=Math.sin(o);return[1,0,0,0,t,-e,0,e,t]},vt=o=>{const t=Math.cos(o),e=Math.sin(o);return[t,0,e,0,1,0,-e,0,t]},Ot=o=>{const t=Math.cos(o),e=Math.sin(o);return[t,-e,0,e,t,0,0,0,1]},rt=(o,t,e)=>F(Ot(e),F(Nt(o),vt(t))),k=(o,t)=>[o[0]+t[0],o[1]+t[1],o[2]+t[2]],xt=(o,t)=>[o[0]-t[0],o[1]-t[1],o[2]-t[2]],N=(o,t)=>[o[0]*t,o[1]*t,o[2]*t],Me=o=>Math.hypot(o[0],o[1],o[2]),ot=o=>{const t=Me(o)||1;return[o[0]/t,o[1]/t,o[2]/t]},St=(o,t)=>[o[1]*t[2]-o[2]*t[1],o[2]*t[0]-o[0]*t[2],o[0]*t[1]-o[1]*t[0]];class Re{constructor(){this.pos=[0,0,5],this.target=[0,0,0],this.fov=.6,this.w=1,this.h=1,this.near=.05,this.update()}update(){const t=ot(xt(this.target,this.pos)),e=ot(St(t,[0,1,0])),s=St(e,t);this.R=[e[0],e[1],e[2],s[0],s[1],s[2],-t[0],-t[1],-t[2]],this.focal=1/Math.tan(this.fov/2),this.pxPerUnit=this.focal*this.h/2}forward(){return[-this.R[6],-this.R[7],-this.R[8]]}toCam(t){return D(this.R,xt(t,this.pos))}project(t){const e=this.toCam(t),s=Math.max(-e[2],this.near),n=this.pxPerUnit/s;return[this.w/2+e[0]*n,this.h/2+e[1]*n,s]}viewProj(){const t=this.R,e=this.pos,s=[-(t[0]*e[0]+t[1]*e[1]+t[2]*e[2]),-(t[3]*e[0]+t[4]*e[1]+t[5]*e[2]),-(t[6]*e[0]+t[7]*e[1]+t[8]*e[2])],n=this.w/this.h,c=this.focal,u=this.near,a=100,h=c/n,i=c,f=(a+u)/(u-a),r=2*a*u/(u-a),l=new Float32Array(16);for(let d=0;d<4;d++){const p=d<3?t[d]:s[0],v=d<3?t[3+d]:s[1],w=d<3?t[6+d]:s[2],x=d<3?0:1;l[d*4+0]=h*p,l[d*4+1]=i*v,l[d*4+2]=f*w+r*x,l[d*4+3]=-w}return l}}const at=190,Gt=[[.023,.044,.04],[.008,.048,.045],[-.0085,.045,.041],[-.023,.035,.031]],Y=[["pelvis",null,[0,0,0]],["spine","pelvis",[0,.1,-.01]],["chest","spine",[0,.17,0]],["neck","chest",[0,.25,-.025]],["head","neck",[0,.1,.012]]];for(const o of["L","R"]){const t=o==="L"?1:-1;Y.push(["clav"+o,"chest",[.02*t,.215,-.01]],["shoulder"+o,"clav"+o,[.155*t,0,-.005]],["elbow"+o,"shoulder"+o,[0,-.29,0]],["wrist"+o,"elbow"+o,[0,-.25,0]],["hip"+o,"pelvis",[.092*t,-.07,0]],["knee"+o,"hip"+o,[0,-.43,0]],["ankle"+o,"knee"+o,[0,-.42,0]]),Gt.forEach(([e,s],n)=>{Y.push([`f${n}a${o}`,"wrist"+o,[0,-.092+Math.abs(e)*.18,e]]),Y.push([`f${n}b${o}`,`f${n}a${o}`,[0,-s,0]])}),Y.push(["thumbA"+o,"wrist"+o,[-.006*t,-.022,.03]]),Y.push(["thumbB"+o,"thumbA"+o,[0,-.046,0]])}function Te(){const o=[],t=(s,n,c,u,a,h,i)=>o.push({type:0,j:s,a:n,b:c,ra:u,rb:a,k:h,g:i}),e=(s,n,c,u,a,h)=>o.push({type:1,j:s,c:n,r:c,k:u,g:a,e:h});e("pelvis",[0,0,-.005],[.16,.11,.105],.05,"torso"),e("pelvis",[0,-.06,-.05],[.145,.1,.085],.04,"torso"),e("pelvis",[0,.03,.035],[.13,.09,.07],.04,"torso"),e("spine",[0,.09,-.004],[.122,.19,.086],.05,"torso"),e("chest",[0,.12,-.005],[.148,.16,.102],.05,"torso"),e("chest",[0,.165,.035],[.145,.08,.075],.03,"torso"),e("chest",[0,.17,-.048],[.145,.09,.07],.03,"torso"),t("chest",[-.14,.235,-.02],[.14,.235,-.02],.05,.05,.04,"torso"),t("neck",[0,-.02,0],[0,.11,.012],.05,.044,.03,"torso"),e("head",[0,.1,-.015],[.074,.095,.1],.02,"head"),e("head",[0,.052,.042],[.062,.075,.062],.02,"head"),e("head",[0,.004,.068],[.042,.028,.034],.015,"head"),e("head",[0,.112,.076],[.058,.018,.019],.012,"head"),t("head",[0,.09,.094],[0,.062,.11],.0095,.011,.008,"head"),e("head",[0,.03,.094],[.024,.014,.013],.008,"head"),e("head",[0,.105,-.06],[.082,.092,.082],.02,"head");for(const s of["L","R"]){const n="arm"+s,c="hand"+s,u="leg"+s;e("shoulder"+s,[.004,-.04,0],[.05,.08,.054],.03,n),t("shoulder"+s,[0,0,0],[0,-.29,0],.043,.033,.03,n),e("shoulder"+s,[0,-.15,.01],[.038,.1,.04],.02,n),t("elbow"+s,[0,0,0],[0,-.25,0],.034,.022,.02,n),e("elbow"+s,[0,-.07,0],[.033,.09,.038],.02,n),e("wrist"+s,[0,-.05,0],[.015,.05,.042],.012,c),e("wrist"+s,[-.004,-.036,.024],[.016,.03,.02],.01,c),Gt.forEach(([,a,h],i)=>{const f=i===3?.0075:.0088;t(`f${i}a${s}`,[0,0,0],[0,-a,0],f,f*.86,.005,c),t(`f${i}b${s}`,[0,0,0],[0,-h,0],f*.86,f*.62,.004,c)}),t("thumbA"+s,[0,0,0],[0,-.046,0],.012,.0095,.008,c),t("thumbB"+s,[0,0,0],[0,-.034,0],.0095,.007,.004,c),t("hip"+s,[0,0,0],[0,-.43,0],.082,.05,.04,u),e("hip"+s,[0,-.17,.015],[.072,.19,.078],.03,u),t("knee"+s,[0,0,0],[0,-.41,0],.048,.029,.025,u),e("knee"+s,[0,-.12,-.028],[.046,.13,.052],.02,u),e("ankle"+s,[0,-.045,-.016],[.028,.027,.03],.025,u),e("ankle"+s,[0,-.048,.06],[.035,.03,.1],.025,u,[.12,0,0]),e("ankle"+s,[0,-.06,.13],[.04,.017,.05],.025,u)}return o}function Ee(){const o=[],t=[0,.1,-.015],e=[.08,.1,.105],s=15;for(let n=0;n<s;n++){const u=-.2+(n+.5)/s*2.1,a=Math.sin(n*2.399)*1.15,h=ot([Math.sin(a),Math.cos(u),-Math.sin(u)*Math.cos(a)*.9]),i=[t[0]+h[0]*e[0]*.9,t[1]+h[1]*e[1]*.9,t[2]+h[2]*e[2]*.9],f=Math.floor(n/3);o.push({p:i,n:h,len:.26+.3*((n*.618+f*.3)%1),width:.015+.011*(n*.382%1),seed:f*2.71+n%3*.23+.7})}return o}const kt=(o,t)=>o===0?Math.max(.0025,t*1.5):Math.max(6e-4,t*.2);function Ae(o,t){return Math.sin(t*.097+o*1.7)*.5+Math.sin(t*.181+o*3.1)*.3+Math.sin(t*.293+o*5.3)*.2}const Lt={spine:[-.1,0,.03],chest:[-.12,.05,.03],neck:[-.15,.25,.05],head:[-.3,.55,.1],clavL:[0,0,.12],shoulderL:[-.3,1.1,1.3],elbowL:[-.85,0,0],wristL:[.35,0,.1],clavR:[0,0,.1],shoulderR:[-.2,.5,.85],elbowR:[-.6,0,0],wristR:[.3,0,.15],hipL:[-.3,.1,.2],kneeL:[.7,0,0],ankleL:[1,0,0],hipR:[-.8,.75,.3],kneeR:[1.55,0,0],ankleR:[.95,0,0]},Se={spine:[.22,0,.05],chest:[.18,-.1,.02],neck:[.15,.2,0],head:[.1,.45,.05],clavL:[0,0,.05],shoulderL:[-.95,.6,.55],elbowL:[-1.35,0,0],wristL:[.4,0,.1],clavR:[0,0,.05],shoulderR:[-.7,.3,.45],elbowR:[-1.5,0,0],wristR:[.35,0,.1],hipL:[-1.35,.25,.15],kneeL:[1.95,0,0],ankleL:[.8,0,0],hipR:[-1.1,.4,.22],kneeR:[1.7,0,0],ankleR:[.85,0,0]},ke={spine:[-.2,0,.02],chest:[-.2,.05,.02],neck:[-.2,.3,.03],head:[-.42,.5,.05],clavL:[0,0,.25],shoulderL:[-2.5,.5,.45],elbowL:[-.45,0,0],wristL:[.25,0,.1],clavR:[0,0,.22],shoulderR:[-2.25,.2,.6],elbowR:[-.6,0,0],wristR:[.3,0,.1],hipL:[-.12,.05,.12],kneeL:[.55,0,0],ankleL:[1.05,0,0],hipR:[-.35,.5,.2],kneeR:[1,0,0],ankleR:[1,0,0]};function Le(o){if(typeof o=="string")return{open:o==="open"?1:0,curl:o==="curl"?1:0,surrender:o==="surrender"?1:0};const t=.5+.5*Math.sin(o/53-1.4),e=.5+.5*Math.sin(o/71-1.57),s=Math.pow(t,3)*.85,n=Math.pow(e,3)*.85*(1-s);return{open:1-s-n,curl:s,surrender:n}}class Pe{constructor(){this.joints=Y.map(([t,e,s])=>({name:t,parent:e,offset:s,side:t.endsWith("R")?-1:1,rot:[0,0,0],R:null,p:null})),this.byName=Object.fromEntries(this.joints.map(t=>[t.name,t])),this.shapes=Te(),this.roots=Ee(),this.data=new Float32Array(at*8),this.groups=[],this.count=0,this.hair=[]}pose(t,{wind:e=1,reach:s=0,wall:n=t,orient:c,preset:u}){const a=this.byName,h=x=>Ae(x,t),i=Math.max(0,e),f=Math.sin(n*.9)*.015,r=Le(u==="open"||u==="curl"||u==="surrender"?u:t),l={};for(const x of Object.keys(Lt))l[x]=[0,1,2].map(g=>Lt[x][g]*r.open+Se[x][g]*r.curl+ke[x][g]*r.surrender);l.spine[0]+=f,l.chest[0]+=f,l.shoulderL[0]-=i*.15,l.shoulderL[2]+=i*.12,l.shoulderR[0]-=i*.12,l.shoulderR[2]+=i*.15,l.hipL[0]-=i*.08,l.hipR[0]-=i*.08;const d={spine:[.06,.05,.04],chest:[.05,.06,.03],neck:[.08,.15,.05],head:[.12,.25,.08],clavL:[0,0,.05],shoulderL:[.3,.3,.2],elbowL:[.3,0,0],wristL:[.2,.2,.15],clavR:[0,0,.05],shoulderR:[.3,.3,.2],elbowR:[.35,0,0],wristR:[.2,.2,.1],hipL:[.2,.15,.1],kneeL:[.3,0,0],ankleL:[.15,0,0],hipR:[.2,.15,.1],kneeR:[.3,0,0],ankleR:[.15,0,0]};let p=1;for(const x of this.joints){const g=l[x.name],E=d[x.name];if(u==="stand"||!g){x.rot=[0,0,0];continue}x.rot=g.map((m,y)=>m+h(p++*3.7+y)*E[y])}if(u!=="stand"){const x=(m,y)=>m+(y-m)*s,g=a.elbowR.rot,E=a.wristR.rot;a.elbowR.rot=[x(g[0],-.12),0,0],a.wristR.rot=[x(E[0],-.3),E[1],E[2]],a.head.rot[1]-=s*.2;for(const m of["L","R"]){const y=m==="L"?0:50,R=m==="R"?s:0;for(let T=0;T<4;T++){const A=(1.5-T)*(.12+R*.1)+h(30+y+T)*.05,W=(.3+T*.08+h(35+y+T)*.12)*(1-R*.75);a[`f${T}a${m}`].rot=[A,0,-W],a[`f${T}b${m}`].rot=[0,0,-W*1.3]}a["thumbA"+m].rot=[-.75-R*.25+h(40+y)*.1,0,-.3],a["thumbB"+m].rot=[0,0,-.3*(1-R)]}}this.fk(c),u!=="stand"&&this.aimReach(s,n);const v=["pelvis","chest","chest","head","kneeL","kneeR","elbowL","elbowR"],w=[0,0,0];for(const x of v)for(let g=0;g<3;g++)w[g]+=a[x].p[g]/v.length;for(const x of this.joints)x.p=xt(x.p,w);this.torso=N(k(a.chest.p,a.pelvis.p),.5),this.poseHair(t,i)}fk(t){const e=this.byName;for(const s of this.joints){const n=rt(s.rot[0],s.rot[1]*s.side,s.rot[2]*s.side);if(!s.parent)s.R=F(t,n),s.p=[0,0,0];else{const c=e[s.parent];s.R=F(c.R,n),s.p=k(c.p,D(c.R,s.offset))}}this.root=t}aimReach(t,e){const s=this.byName,n=s.shoulderR,c=this.reachWall===void 0?0:Math.min(.1,Math.max(0,e-this.reachWall));if(this.reachWall=e,this.reachAim||(this.reachAim=n.rot.slice()),t>.001){const a=s.clavR.R,h=n.rot[1];let i=null,f=-1e9;const r=(d,p)=>{const v=F(a,rt(d,-h,-p)),w=-v[4],x=-v[7];return w+.12*x-.04*(Math.abs(d-n.rot[0])+Math.abs(p-n.rot[2]))};if(this.reachGoal)i=this.reachGoal.slice(),f=r(i[0],i[1]);else for(let d=-3;d<=.6;d+=.2)for(let p=-.2;p<=2.6;p+=.2){const v=r(d,p);v>f&&(f=v,i=[d,p])}for(const d of[.08,.08,.03,.03])for(const p of[-d,0,d])for(const v of[-d,0,d]){const w=r(i[0]+p,i[1]+v);w>f&&(f=w,i=[i[0]+p,i[1]+v])}this.reachGoal=i;const l=1-Math.exp(-c/.45);this.reachAim[0]+=(this.reachGoal[0]-this.reachAim[0])*l,this.reachAim[2]+=(this.reachGoal[1]-this.reachAim[2])*l}else this.reachAim=n.rot.slice(),this.reachGoal=null;const u=t*t*(3-2*t);n.rot=[n.rot[0]+(this.reachAim[0]-n.rot[0])*u,n.rot[1],n.rot[2]+(this.reachAim[2]-n.rot[2])*u],this.fk(this.root)}poseHair(t,e){const s=this.byName.head,n=[0,1,0],c=[1,0,0],u=[0,0,1],a=7,h=Math.min(1.4,e),i=this.hairT===void 0?0:Math.max(0,t-this.hairT);this.hairT=t,this.hairPhase=(this.hairPhase??t)+i*(.9+.5*h);const f=this.hairPhase;this.hair=this.roots.map(r=>{const l=[k(s.p,D(s.R,r.p))],d=D(s.R,r.n),p=r.len/a,v=r.seed;let w=d;for(let x=1;x<=a;x++){const g=x/a,E=v*3.1+f-g*3.4,m=(.15+.57*g)*(.6+.35*(1-Math.min(1,h))),y=k(N(c,Math.sin(E)*m),N(u,Math.sin(E*.73+v)*m*.8)),R=k(k(N(d,.7*(1-g)+.1),N(n,h*(.7+1.1*g))),y);R[1]=Math.max(R[1],.15);const T=ot(R);w=ot(k(N(w,.35),N(T,.65+.3*g))),l.push(k(l[l.length-1],N(w,p)))}return{pts:l,width:r.width}})}pack3D(){const t=this.data3??(this.data3=new Float32Array(at*16)),e=this.byName;let s=0;const n=new Map,c=[],u=(a,h,i)=>{if(s>=at)return;h.forEach((r,l)=>t.set(r,s*16+l*4)),n.has(a)||(n.set(a,{start:s,count:0,lo:[1e9,1e9,1e9],hi:[-1e9,-1e9,-1e9],k:0}),c.push(a));const f=n.get(a);f.count++;for(const[r,l]of i)for(let d=0;d<3;d++)f.lo[d]=Math.min(f.lo[d],r[d]-l),f.hi[d]=Math.max(f.hi[d],r[d]+l);f.k=Math.max(f.k,h[2][3]<0?h[2][0]:h[0][3]),s++};for(const a of this.shapes){const h=e[a.j],i=h.side;if(a.type===0){const f=k(h.p,D(h.R,[a.a[0]*i,a.a[1],a.a[2]])),r=k(h.p,D(h.R,[a.b[0]*i,a.b[1],a.b[2]]));u(a.g,[[...f,a.ra],[...r,a.rb],[a.k,0,0,-1],[0,0,0,0]],[[f,a.ra],[r,a.rb]])}else{const f=k(h.p,D(h.R,[a.c[0]*i,a.c[1],a.c[2]]));let r=h.R;a.e&&(r=F(r,rt(a.e[0],a.e[1]*i,a.e[2]*i)));const l=p=>[r[p],r[3+p],r[6+p]],d=Math.max(...a.r);u(a.g,[[...f,a.k],[...l(0),a.r[0]],[...l(1),a.r[1]],[...l(2),a.r[2]]],[[f,d]])}}for(const{pts:a,width:h}of this.hair){const i=a.length-1,f=r=>h*Math.pow(1-r,1.4)+.0016;for(let r=0;r<i;r++){const l=f(r/i),d=f((r+1)/i);u("hair",[[...a[r],l],[...a[r+1],d],[kt(r,l),2,0,-1],[0,0,0,0]],[[a[r],l],[a[r+1],d]])}}return this.count3=s,this.groups3=c.map(a=>{const h=n.get(a),i=h.lo.map((r,l)=>(r+h.hi[l])/2),f=Math.hypot(h.hi[0]-h.lo[0],h.hi[1]-h.lo[1],h.hi[2]-h.lo[2])/2;return{c:i,r:f,k:h.k,start:h.start,count:h.count}}),this}lookPoint(t){const e=this.byName,s=(n,c)=>{var u;return(u=e[n])!=null&&u.p?k(e[n].p,D(e[n].R,c)):null};if(t==="face")return s("head",[0,.065,.07]);if(t==="hand"||t==="handR")return s("wristR",[0,-.085,0]);if(t==="handL")return s("wristL",[0,-.085,0]);if(t==="foot"||t==="footR")return s("ankleR",[0,-.04,.03]);if(t==="footL")return s("ankleL",[0,-.04,.03]);if(t==="hair"){const n=this.hair.flatMap(c=>c.pts);return n.length?N(n.reduce((c,u)=>k(c,u),[0,0,0]),1/n.length):null}return s(t,[0,0,0])}project(t){const e=this.data;let s=0;const n=new Map,c=this.byName,u=[],a=(r,l,d)=>{if(s>=at)return;e.set(l,s*8),e.set(d,s*8+4),n.has(r)||(n.set(r,{start:s,count:0,minX:1e9,minY:1e9,maxX:-1e9,maxY:-1e9,k:0}),u.push(r));const p=n.get(r);return p.count++,s++,p},h=(r,l,d,p)=>{r.minX=Math.min(r.minX,l-p),r.maxX=Math.max(r.maxX,l+p),r.minY=Math.min(r.minY,d-p),r.maxY=Math.max(r.maxY,d+p)};this.pxPerM=t.pxPerUnit/t.project([0,0,0])[2];const i=(r,l,d,p,v,w,x)=>{const g=t.project(r),E=t.project(l),m=d*t.pxPerUnit/g[2],y=p*t.pxPerUnit/E[2],R=v*this.pxPerM,T=a(w,[g[0],g[1],E[0],E[1]],[m,y,x?2:0,R]);T&&(h(T,g[0],g[1],m),h(T,E[0],E[1],y),T.k=Math.max(T.k,R))};for(const r of this.shapes){const l=c[r.j],d=l.side;if(r.type===0){const p=[r.a[0]*d,r.a[1],r.a[2]],v=[r.b[0]*d,r.b[1],r.b[2]];i(k(l.p,D(l.R,p)),k(l.p,D(l.R,v)),r.ra,r.rb,r.k,r.g,!1)}else{const p=k(l.p,D(l.R,[r.c[0]*d,r.c[1],r.c[2]]));let v=l.R;r.e&&(v=F(v,rt(r.e[0],r.e[1]*d,r.e[2]*d)));const w=F(t.R,v),x=[0,1,2].map(G=>[w[0+G]*r.r[G],w[3+G]*r.r[G]]);let g=0,E=0,m=0;for(const[G,pt]of x)g+=G*G,E+=G*pt,m+=pt*pt;const y=t.project(p),R=t.pxPerUnit/y[2];g*=R*R,E*=R*R,m*=R*R;const T=(g+m)/2,A=Math.sqrt(((g-m)/2)**2+E*E),W=T+A,ne=Math.max(T-A,1e-6),Rt=.5*Math.atan2(2*E,g-m),Tt=Math.sqrt(W),ie=Math.sqrt(ne),Et=r.k*this.pxPerM,it=a(r.g,[y[0],y[1],Math.cos(Rt),Math.sin(Rt)],[Tt,ie,1,Et]);if(!it)continue;h(it,y[0],y[1],Tt),it.k=Math.max(it.k,Et)}}for(const{pts:r,width:l}of this.hair){const d=r.length-1,p=v=>l*Math.pow(1-v,1.4)+.0016;for(let v=0;v<d;v++){const w=p(v/d),x=p((v+1)/d);i(r[v],r[v+1],w,x,kt(v,w),"hair",!0)}}this.count=s,this.groups=u.map(r=>{const l=n.get(r),d=(l.minX+l.maxX)/2,p=(l.minY+l.maxY)/2;return{cx:d,cy:p,r:Math.hypot(l.maxX-l.minX,l.maxY-l.minY)/2,start:l.start,count:l.count,k:l.k}});const f=t.project(this.torso);return this.torsoPx=f,this}}const Pt=o=>o*o*(3-2*o),Be=o=>Math.min(1,Math.max(0,o));function Ue(o){let t=o>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function mt(o,t,e,s,n){const c=o-t;return c<=0||c>=e+s+n?0:c<e?Pt(c/e):c<e+s?1:1-Pt((c-e-s)/n)}const Bt=1.7,De=27;class Fe{constructor(t=0){this.wall=t,this.story=De+t*.9,this.fall=t*Bt,this.rate=1,this.blur=1,this.hold=0,this.holding=!1,this.susp=0,this.rush=0,this.reach=0,this.swell=0;const e=Ue(1789);this.suspensions=[],this.rushes=[];let s=40;for(let n=0;n<400;n++){this.suspensions.push(s);const c=80+e()*55;this.rushes.push(s+22+e()*(c-40)),s+=c}}suspensionAt(t){let e=0;for(const s of this.suspensions){if(s>t)break;e=Math.max(e,mt(t,s,5,10,7))}return e}rushAt(t){let e=0;for(const s of this.rushes){if(s>t)break;e=Math.max(e,mt(t,s,3.5,5,5))}return e}reachAt(t){let e=0;for(const s of this.suspensions){if(s>t)break;e=Math.max(e,mt(t,s+4,6,6,8))}return e}tick(t,e=!1){t=Math.min(t,.1),this.wall+=t;const s=this.wall,n=Math.PI*2,c=.9+.3*Math.sin(n*s/67)+.18*Math.sin(n*s/31+1.3)+.08*Math.sin(n*s/13+.4);this.susp=this.suspensionAt(s),this.rush=this.rushAt(s),this.reach=this.reachAt(s);const u=1-Math.exp(-t/.6);this.hold+=((this.holding?1:0)-this.hold)*(1-Math.exp(-t/(this.holding?.9:1.6)));const a=e?.45:1;let h=c*(1+.85*this.rush);h=h*(1-this.susp)+-.06*this.susp,h*=1-.97*this.hold,this.rate+=(h*a-this.rate)*u;let i=c*(1+1.3*this.rush);i=i*(1-this.susp)+1.05*this.susp,i*=1-.45*this.hold,this.blur+=(i*a-this.blur)*u,this.story+=t*Math.min(1.6,Math.max(.025,this.rate)),this.fall+=t*this.rate*Bt,this.swell=Be(this.susp*1+this.hold*.5)}}const ze=`
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
`,tt=[{bass:38,notes:[45,54,57,64],pcs:[0,4,7]},{bass:37,notes:[45,52,57,61],pcs:[7,11,2]},{bass:35,notes:[42,50,54,61],pcs:[9,0,4]},{bass:33,notes:[42,49,54,57],pcs:[4,7,11]},{bass:31,notes:[38,47,54,57],pcs:[5,9,0,4]},{bass:30,notes:[45,50,54,64],pcs:[0,4,7]},{bass:28,notes:[43,50,54,59],pcs:[2,5,9,0]},{bass:33,notes:[40,50,52,55],pcs:[7,0,2,5]}],Ce=12.5,Ut=.62,Dt=[[66,64,62,57],[66,64,62],[62,61,59,57],[69,66,64,62],[66,64]],et=o=>440*Math.pow(2,(o-69)/12);function _e(o,t=7.5){const e=o.sampleRate,s=Math.floor(e*t),n=o.createBuffer(2,s,e);for(let c=0;c<2;c++){const u=n.getChannelData(c);let a=0,h=c?91:17;const i=()=>(h=h*16807%2147483647)/2147483647*2-1,f=Math.floor(e*.028);for(let r=f;r<s;r++){const l=(r-f)/e,d=.55-.5*Math.min(1,l/t);a+=(i()-a)*d,u[r]=a*Math.exp(-6.9*l/(t*.82))*(l<.06?l/.06:1)}for(const[r,l]of[[11,.5],[23,.32],[37,.24],[53,.16]]){const d=Math.floor(e*(r+(c?4:0))*.001);d<s&&(u[d]+=l*(c?-1:1))}}return n}function qe(o,t=6){const e=o.sampleRate,s=Math.floor(e*t),n=o.createBuffer(2,s,e);for(let c=0;c<2;c++){const u=n.getChannelData(c);let a=0,h=0,i=0;for(let f=0;f<s;f++){const r=Math.random()*2-1;a=.99765*a+r*.099046,h=.963*h+r*.2965164,i=.57*i+r*1.0526913,u[f]=(a+h+i+r*.1848)*.12}}return n}class Ie{constructor(){this.started=!1,this.muted=!1,this.ctx=null}async start(t){if(this.started)return;this.started=!0;const e=!t;if(e){const s=window.AudioContext||window.webkitAudioContext;t=new s({latencyHint:"playback"}),t.resume()}if(this.ctx=t,this.hasShepard=!1,t.audioWorklet){const s=URL.createObjectURL(new Blob([ze],{type:"application/javascript"}));try{await t.audioWorklet.addModule(s),this.hasShepard=!0}catch(n){console.warn("shepard worklet unavailable:",n)}URL.revokeObjectURL(s)}this.build(),this.live=e}build(){const t=this.ctx,e=t.currentTime,s=(R=1)=>{const T=t.createGain();return T.gain.value=R,T};this.master=s(0);const n=t.createDynamicsCompressor();n.threshold.value=-20,n.knee.value=18,n.ratio.value=2.6,n.attack.value=.04,n.release.value=.6,this.master.connect(n).connect(t.destination),this.master.gain.setValueAtTime(0,e),this.master.gain.linearRampToValueAtTime(1e-4,e+.05),this.master.gain.setTargetAtTime(Ut,e+.05,2.2),this.dry=s(1),this.dry.connect(this.master),this.verb=t.createConvolver(),this.verb.buffer=_e(t),this.verbIn=s(1);const c=s(.75);this.verbIn.connect(this.verb).connect(c).connect(this.master),this.echoIn=s(1);const u=t.createDelay(3),a=t.createDelay(3);u.delayTime.value=.61,a.delayTime.value=.89;const h=s(.42),i=t.createBiquadFilter();i.type="lowpass",i.frequency.value=2200;const f=t.createChannelMerger(2);this.echoIn.connect(u),u.connect(a),a.connect(i).connect(h).connect(u),u.connect(f,0,0),a.connect(f,0,1);const r=s(.5);f.connect(r),r.connect(this.dry),r.connect(this.verbIn),this.tape=t.createConstantSource(),this.tape.offset.value=0,this.wow=t.createOscillator(),this.wow.frequency.value=.31,this.wowDepth=s(4),this.wow.connect(this.wowDepth),this.tapeBus=s(1),this.tape.connect(this.tapeBus),this.wowDepth.connect(this.tapeBus),this.tape.start(e),this.wow.start(e),this.shepGain=s(0);const l=t.createBiquadFilter();l.type="lowpass",l.frequency.value=2600,l.Q.value=.4,this.hasShepard&&(this.shep=new AudioWorkletNode(t,"shepard",{numberOfInputs:0,outputChannelCount:[2]}),this.shep.connect(l)),l.connect(this.shepGain);const d=s(.35);this.shepGain.connect(d).connect(this.dry),this.shepGain.connect(this.verbIn);const p=[0,1,.45,.24,.14,.085,.05,.03,.018,.01,.006];this.wave=t.createPeriodicWave(new Float32Array(p.length),new Float32Array(p)),this.padFilter=t.createBiquadFilter(),this.padFilter.type="lowpass",this.padFilter.frequency.value=900,this.padFilter.Q.value=.5,this.padBus=s(.11),this.padFilter.connect(this.padBus),this.padBus.connect(this.dry);const v=s(.9);this.padBus.connect(v).connect(this.verbIn),this.voices=[],this.subGain=s(0),this.subGain.connect(this.dry),this.subs=[[12,.62],[0,.5]].map(([R,T])=>{const A=t.createOscillator();A.type="sine",A.frequency.value=et(tt[0].bass+R);const W=s(T);return A.connect(W).connect(this.subGain),this.tapeBus.connect(A.detune),A.start(e),{o:A,shift:R}});const w=qe(t);this.airSrc=t.createBufferSource(),this.airSrc.buffer=w,this.airSrc.loop=!0,this.airBus=s(0),this.air=[];for(let R=0;R<4;R++){const T=t.createBiquadFilter();T.type="bandpass",T.Q.value=34,T.frequency.value=440;const A=s(1.6);this.airSrc.connect(T).connect(A).connect(this.airBus),this.air.push(T)}this.airBus.connect(this.verbIn);const x=s(.25);this.airBus.connect(x).connect(this.dry),this.airSrc.start(e),this.windSrc=t.createBufferSource(),this.windSrc.buffer=w,this.windSrc.loop=!0,this.windSrc.playbackRate.value=.7,this.windBand=t.createBiquadFilter(),this.windBand.type="bandpass",this.windBand.Q.value=.7,this.windBand.frequency.value=400;const g=t.createBiquadFilter();g.type="lowpass",g.frequency.value=1400,this.windGain=s(0),this.windPan=t.createStereoPanner(),this.windSrc.connect(this.windBand).connect(g).connect(this.windGain).connect(this.windPan),this.windPan.connect(this.dry);const E=s(.3);this.windPan.connect(E).connect(this.verbIn),this.windSrc.start(e),this.bellBus=s(.16),this.bellBus.connect(this.dry);const m=s(.8);this.bellBus.connect(m).connect(this.verbIn);const y=s(.55);this.bellBus.connect(y).connect(this.echoIn),this.lastNow=e,this.mtime=0,this.chordIndex=-1,this.nextChord=0,this.nextMotif=9,this.motifCount=0,this.inSusp=!1,this.lastWall=null}setMuted(t){if(this.muted=t,!this.ctx)return;const e=this.ctx.currentTime;this.master.gain.cancelScheduledValues(e),this.master.gain.setValueAtTime(this.master.gain.value,e),t?(this.master.gain.setTargetAtTime(0,e,.25),this.live&&setTimeout(()=>this.muted&&this.ctx.suspend(),1500)):(this.ctx.resume(),this.master.gain.setTargetAtTime(Ut,e,.8))}setHidden(t){!this.ctx||!this.live||this.muted||(t?this.ctx.suspend():this.ctx.resume())}chord(t,e){var c;const s=this.ctx,n=tt[t%tt.length];for(const u of this.voices){u.env.gain.cancelScheduledValues(e),u.env.gain.setTargetAtTime(0,e,2.4);for(const a of u.osc)a.stop(e+14)}this.voices=[],n.notes.forEach((u,a)=>{const h=s.createGain();h.gain.value=0;const i=.32/Math.sqrt(n.notes.length)*(1-a*.09);h.gain.setValueAtTime(0,e),h.gain.setTargetAtTime(i,e,1.6),h.connect(this.padFilter);const f=[-1,1].map(r=>{const l=s.createOscillator();l.setPeriodicWave(this.wave),l.frequency.value=et(u),l.detune.value=r*(u<48?2.5:5+Math.random()*3),this.tapeBus.connect(l.detune);const d=s.createStereoPanner();return d.pan.value=r*(.25+a*.1),l.connect(d).connect(h),l.start(e),this.unhookOnEnd(l),l});this.voices.push({env:h,osc:f})});for(const{o:u,shift:a}of this.subs)u.frequency.setTargetAtTime(et(n.bass+a),e,.9);this.air.forEach((u,a)=>{const h=n.notes[a%n.notes.length]+12;u.frequency.setTargetAtTime(et(h),e,1.4)}),(c=this.shep)==null||c.port.postMessage({chord:n.pcs})}bell(t,e,s,n){const c=this.ctx,u=et(e),a=[[1,1,3.8],[2,.32,2.2],[3,.1,1.2],[4.16,.05,.7],[5.43,.025,.45]];for(const[h,i,f]of a){const r=c.createOscillator();r.frequency.value=u*h,this.tapeBus.connect(r.detune);const l=c.createGain();l.gain.value=0;const d=s*i;if(n){const p=Math.min(2.6,f*.75+.6);l.gain.setValueAtTime(1e-5,t),l.gain.exponentialRampToValueAtTime(d,t+p),l.gain.linearRampToValueAtTime(0,t+p+.05),r.start(t),r.stop(t+p+.1)}else l.gain.setValueAtTime(0,t),l.gain.linearRampToValueAtTime(d,t+.008),l.gain.setTargetAtTime(0,t+.008,f/4),r.start(t),r.stop(t+f*1.6+.2);r.connect(l).connect(this.bellBus),this.unhookOnEnd(r)}}unhookOnEnd(t){t.onended=()=>{try{this.tapeBus.disconnect(t.detune)}catch{}t.disconnect()}}motif(t,e,s,n){const c=Dt[n%Dt.length];let u=t;c.forEach((a,h)=>{const i=.75-h*.08+Math.random()*.1;this.bell(u,a,i,s),Math.random()<.35&&this.bell(u+.004,a-12,i*.4,s),u+=e*(.85+Math.random()*.3)*(h===c.length-2?1.5:1)})}update(t){var v;if(!this.ctx||!this.master)return;const s=this.ctx.currentTime,n=Math.max(0,Math.min(.25,s-this.lastNow));if(this.lastNow=s,n===0&&this.chordIndex>=0)return;const c=t.wall,u=t.rate,a=s+.03,h=(w,x,g=.25)=>w.setTargetAtTime(x,s,g);this.mtime+=n*Math.max(.05,Math.min(1.8,Math.abs(u))),this.mtime>=this.nextChord&&(this.chordIndex++,this.chord(this.chordIndex,a),this.nextChord+=Ce);const i=(v=this.shep)==null?void 0:v.parameters;i&&(h(i.get("rate"),-.022*u*(1+.6*t.rush),.4),h(i.get("fifth"),.25+.5*t.susp,1),h(i.get("center"),8.1+.4*Math.sin(c/41)+.3*t.rush,2));const f=.5+.5*Math.sin(c/97*Math.PI*2-1.2),r=.05+.85*f*f+.4*t.rush+.35*t.susp;h(this.shepGain.gain,Math.min(1,r)*.55,1.5);const l=t.swell,d=(650+700*(.5+.5*Math.sin(c/23))+1300*l+900*t.rush)*(1-.45*t.hold);h(this.padFilter.frequency,d,.8),h(this.subGain.gain,.15+.06*l,1),h(this.airBus.gain,.05+.12*l+.03*Math.max(0,Math.sin(c/31)),1.5),h(this.tape.offset,-38*t.hold-8*t.susp,.6),h(this.wowDepth.gain,3+14*t.hold+6*t.susp,.6),h(this.wow.frequency,.12+.25*Math.max(0,Math.min(1.5,u)),.6);const p=Math.max(0,u);if(h(this.windGain.gain,.035*Math.pow(p,1.6)+.06*t.rush,.5),h(this.windBand.frequency,220+420*Math.min(2,p)+600*t.rush,.5),h(this.windPan.pan,.5*Math.sin(c/7.3),.5),this.mtime>=this.nextMotif&&t.susp<.05){const w=.95/Math.max(.35,Math.min(1.6,u));this.motif(a,w,Math.random()<.2,this.motifCount++),this.nextMotif=this.mtime+16+Math.random()*22}else if(Math.random()<n/9&&t.susp<.05){const w=tt[Math.max(0,this.chordIndex)%tt.length],x=w.notes[Math.floor(Math.random()*w.notes.length)]+24;this.bell(a,x,.18+Math.random()*.15,Math.random()<.3)}t.susp>.6&&!this.inSusp?(this.inSusp=!0,this.motif(a+.5,2.4,!0,0)):t.susp<.1&&(this.inSusp=!1)}}const K=document.getElementById("view"),Ne=document.getElementById("sound"),Oe=document.getElementById("reset"),Ge=matchMedia("(prefers-reduced-motion: reduce)").matches,Xe=["t","still","fig","solid","pose","roll","twist","yaw","tilt","reach","sdf8","rung","govern","zoom","vyaw","vpitch","look"];function Xt(o){const t=decodeURIComponent(o.slice(1)),e=/[=&]/.test(t)?t:t.split("~").map(s=>s.replace("_","=")).join("&");return[...new URLSearchParams(e)].filter(([s])=>Xe.includes(s))}const P=new URLSearchParams(location.search);for(const[o,t]of Xt(location.hash))P.set(o,t);const Vt=o=>JSON.stringify(Xt(o).sort()),Ve=Vt(location.hash);addEventListener("hashchange",()=>{Vt(location.hash)!==Ve&&location.reload()});const H=(o,t)=>P.has(o)?+P.get(o):t,Ft=P.get("look"),zt=P.has("solid");let ut;try{ut=new ye(K,{force8:P.has("sdf8")})}catch(o){console.error(o),document.body.classList.add("nogl")}const X=new Pe,V=new Re,S=new Fe(Number(P.get("t"))||0),_=new Ie,ct=[{core:[1,.72,.4],halo:[.7,.42,.2],atten:[3.2,1.7,1.1],bgTop:[.004,.016,.024],bgBot:[0,.002,.004],sky:[.008,.03,.034]},{core:[.8,.88,1],halo:[.26,.38,.55],atten:[2,1.45,.95],bgTop:[.004,.011,.028],bgBot:[0,.001,.005],sky:[.008,.018,.036]},{core:[1,.7,.66],halo:[.5,.28,.36],atten:[1.8,2,1.35],bgTop:[.012,.006,.022],bgBot:[.002,0,.004],sky:[.02,.012,.03]},{core:[.82,1,.9],halo:[.22,.48,.46],atten:[2.8,1.25,1.35],bgTop:[.002,.018,.02],bgBot:[0,.002,.003],sky:[.006,.03,.028]}],He=95;function $e(o){const t=o/He%ct.length,e=Math.floor(t);let s=t-e;s=s*s*(3-2*s);const n=ct[e],c=ct[(e+1)%ct.length],u={};for(const a of Object.keys(n))u[a]=n[a].map((h,i)=>h+(c[a][i]-h)*s);return u}const C={x:0,y:0,sx:0,sy:0},M={yaw:H("vyaw",0),pitch:H("vpitch",0),zoom:H("zoom",1)};M.tyaw=M.yaw;M.tpitch=M.pitch;M.tzoom=M.zoom;const je=.5,We=4.5,Ct=1.3,B=new Map;let $=!1,Q=null,dt=!1,_t=0;function nt(){document.body.classList.remove("idle"),clearTimeout(_t),_t=setTimeout(()=>document.body.classList.add("idle"),2600)}function Ht(){S.holding=!0,!_.started&&!_.muted&&$t()}function Z(){S.holding=dt}function $t(){_.start().then(()=>document.body.classList.add("sounding")).catch(o=>console.warn("no sound:",o))}const jt=o=>Math.max(-Ct,Math.min(Ct,o)),Wt=o=>Math.max(je,Math.min(We,o));function J(o,t){M.tyaw-=o*.006,M.tpitch=jt(M.tpitch+t*.005),wt()}function gt(o){M.tzoom=Wt(M.tzoom*o),wt()}function Yt(){M.tyaw=0,M.tpitch=0,M.tzoom=1,M.yaw=Math.atan2(Math.sin(M.yaw),Math.cos(M.yaw)),wt()}function wt(){const o=Math.abs(Math.atan2(Math.sin(M.tyaw),Math.cos(M.tyaw)))>.03||Math.abs(M.tpitch)>.03||Math.abs(Math.log(M.tzoom))>.03;document.body.classList.toggle("moved",o)}const Kt=o=>{var t,e;return(e=(t=o.target).closest)==null?void 0:e.call(t,"button")};addEventListener("pointerdown",o=>{if(!Kt(o)){nt();try{K.setPointerCapture(o.pointerId)}catch{}if(B.set(o.pointerId,{x:o.clientX,y:o.clientY,x0:o.clientX,y0:o.clientY}),B.size===1)$=!1,Ht();else if(B.size===2){const[t,e]=[...B.values()];Q={d0:Math.hypot(t.x-e.x,t.y-e.y)||1,zoom0:M.tzoom},$=!0,Z()}}});addEventListener("pointermove",o=>{nt(),o.pointerType==="mouse"&&B.size===0&&(C.x=o.clientX/innerWidth*2-1,C.y=o.clientY/innerHeight*2-1);const t=B.get(o.pointerId);if(!t)return;const e=o.clientX-t.x,s=o.clientY-t.y;if(t.x=o.clientX,t.y=o.clientY,B.size===1)!$&&Math.hypot(t.x-t.x0,t.y-t.y0)>6&&($=!0,Z()),$&&J(e,s);else if(B.size===2&&Q){const[n,c]=[...B.values()],u=Math.hypot(n.x-c.x,n.y-c.y)||1;M.tzoom=Wt(Q.zoom0*Q.d0/u),J(e/2,s/2)}});function Jt(o){B.delete(o.pointerId),B.size<2&&(Q=null),B.size===0&&($=!1,Z())}addEventListener("pointerup",Jt);addEventListener("pointercancel",Jt);addEventListener("blur",()=>{B.clear(),Q=null,$=!1,dt=!1,Z()});addEventListener("wheel",o=>{o.preventDefault(),nt();const t=o.deltaMode===1?o.deltaY*16:o.deltaMode===2?o.deltaY*innerHeight:o.deltaY;gt(Math.exp(Math.max(-200,Math.min(200,t))*.0015))},{passive:!1});addEventListener("keydown",o=>{nt();const t=o.key;if(t==="ArrowLeft")J(-28,0);else if(t==="ArrowRight")J(28,0);else if(t==="ArrowUp")J(0,-28);else if(t==="ArrowDown")J(0,28);else if(t==="+"||t==="=")gt(1/1.15);else if(t==="-"||t==="_")gt(1.15);else{if(o.repeat)return;if(o.code==="Space")dt=!0,Ht();else if(o.code==="KeyM")Zt();else if(o.code==="KeyF")Qt();else if(o.code==="KeyR"||t==="0")Yt();else return}o.preventDefault()});addEventListener("keyup",o=>{o.code==="Space"&&(dt=!1,(B.size===0||$)&&Z())});addEventListener("dblclick",o=>{Kt(o)||Qt()});addEventListener("contextmenu",o=>o.preventDefault());function Qt(){var o,t,e;document.fullscreenElement?(o=document.exitFullscreen)==null||o.call(document):(e=(t=document.documentElement).requestFullscreen)==null||e.call(t).catch(()=>{})}function Zt(){if(!_.started){_.muted=!1,$t();return}_.setMuted(!_.muted),document.body.classList.toggle("sounding",!_.muted)}Ne.addEventListener("click",o=>{o.stopPropagation(),Zt()});Oe.addEventListener("click",o=>{o.stopPropagation(),Yt()});const O=[[.5,2],[.6,2],[.7,2],[.85,2],[1,2],[1,1],[1.25,1],[1.5,1],[1.75,1],[2,1]],Ye=83e5,yt=12e3,b={rung:P.has("rung")?Math.max(0,Math.min(O.length-1,+P.get("rung")|0)):(devicePixelRatio||1)>=2?7:5,ceiling:O.length-1,climbUntil:performance.now()+yt,refresh:1/0,slowStreak:0,samples:[],quietUntil:performance.now()+2500,windowStart:0},Ke=P.has("govern")||!P.has("rung")&&!navigator.webdriver;let te=performance.now(),ee=0,st=performance.now(),qt=!1;function bt(o){const t=Math.sqrt(Ye/Math.max(1,innerWidth*innerHeight));return Math.min(O[o][0],t)}const Je=o=>o+1<O.length&&(bt(o+1)>bt(o)+1e-6||O[o+1][1]<O[o][1]);function Qe(){const o=bt(b.rung),t=Math.max(2,Math.round(innerWidth*o)),e=Math.max(2,Math.round(innerHeight*o));return(K.width!==t||K.height!==e)&&(K.width=t,K.height=e),[t,e,O[b.rung][1],o]}function It(o,t){o=Math.max(0,Math.min(O.length-1,o)),o!==b.rung&&(b.rung=o,b.slowStreak=0,Mt(t))}function Mt(o,t=700){b.samples=[],b.quietUntil=o+t}function Ze(o,t){if(t<b.quietUntil)return;b.samples.length===0&&(b.windowStart=t),b.samples.push(o);const e=b.samples.length;if(e<45&&!(e>=6&&t-b.windowStart>1500))return;const s=b.samples.slice().sort((h,i)=>h-i);b.samples=[];const n=s[e>>1],c=s[Math.floor(e*.9)];if(b.refresh=Math.max(4,Math.min(b.refresh,s[Math.floor(e*.1)])),b.rung>0&&(n>Math.max(19.5,b.refresh*1.25)||n>40)){const h=n>Math.max(34,b.refresh*2.2)||n>66;b.slowStreak++,(h||b.slowStreak>=2)&&(It(b.rung-(h?2:1),t),b.ceiling=Math.min(b.ceiling,b.rung));return}b.slowStreak=0,n<b.refresh*1.08&&c<b.refresh*1.4&&n<22&&t<b.climbUntil&&b.rung<b.ceiling&&Je(b.rung)&&It(b.rung+1,t)}function oe(o){const t=o-st;st=o;const e=Math.min(.1,t/1e3);Ke&&Ze(t,o),ee++,to(e),requestAnimationFrame(oe)}function to(o){if(S.tick(P.has("still")?0:o,Ge),_.update(S),!ut)return;const[t,e,s,n]=Qe();ut.resize(t,e,s,n);const c=S.wall;C.sx+=(C.x-C.sx)*Math.min(1,o*1.5),C.sy+=(C.y-C.sy)*Math.min(1,o*1.5);const u=1-Math.exp(-o/.14);M.yaw+=(M.tyaw-M.yaw)*u,M.pitch+=(M.tpitch-M.pitch)*u,M.zoom=Math.exp(Math.log(M.zoom)+(Math.log(M.tzoom)-Math.log(M.zoom))*(1-Math.exp(-o/.2)));const a=t/e,h=Math.max(1.36,1.5/a),i=.68-.24*S.susp+.14*S.rush-.08*S.hold,f=h/Math.tan(i/2)*M.zoom,r=.1*Math.sin(c/41)+C.sx*.08+M.yaw,l=jt(.1+.07*Math.sin(c/53)+.18*S.rush+C.sy*.06+M.pitch);V.w=t,V.h=e,V.fov=i;const d=Ft&&X.lookPoint(Ft)||[0,0,0];V.target=d,V.pos=[d[0]+Math.sin(r)*Math.cos(l)*f,d[1]+Math.sin(l)*f,d[2]+Math.cos(r)*Math.cos(l)*f],V.update();const p=S.story,v=H("roll",1.72+.36*Math.sin(p/31)+.12*Math.sin(p/13+1)),w=H("twist",1+p*Math.PI*2/75+.45*Math.sin(p/17)),x=H("yaw",.25*Math.sin(p/21+.5)),g=H("tilt",-.2+.2*Math.sin(p/17+2)),E=F(vt(x),F(Nt(g),F(Ot(v),vt(w)))),m=.35+.6*Math.min(2,Math.max(0,S.blur));X.pose(p,{wind:m,reach:H("reach",S.reach),wall:c,orient:E,preset:P.get("pose")}),X.project(V),zt&&X.pack3D();const y=X.torsoPx,R=[y[0]+X.pxPerM*(.12*Math.sin(c/29)+.05*Math.sin(c/11)),y[1]+X.pxPerM*(.08*Math.sin(c/37+2)+.04)],T=960,A=P.has("t")?1:Math.min(1,(performance.now()-te)/5e3);ut.render({figure:X,cam:V,lightPx:R,story:p,wall:c,fallSmall:S.fall%T,drift:S.fall%65536,shutter:.085*Math.max(.12,S.blur),focus:f,aperture:.06,exposure:1+.3*S.swell,swell:S.swell,palette:$e(c+20),fade:A*A,bloom:.3,pr:n,debug:P.has("fig"),solid:zt}),!qt&&A>=1&&ee>8&&(qt=!0,document.body.classList.add("ready"))}addEventListener("resize",()=>{const o=performance.now();Mt(o),b.ceiling=O.length-1,b.climbUntil=o+yt,b.slowStreak=0});document.addEventListener("visibilitychange",()=>{st=performance.now(),Mt(st,1500),document.hidden&&Z(),_.setHidden(document.hidden)});nt();const ht=[];function se(o){if(ht.push(o),ht.length<18){requestAnimationFrame(se);return}const t=ht.slice(1).map((e,s)=>e-ht[s]).sort((e,s)=>e-s);b.refresh=Math.max(4,t[t.length>>1]),st=o,te=o,b.quietUntil=o+2500,b.climbUntil=o+yt,requestAnimationFrame(oe)}requestAnimationFrame(se);
