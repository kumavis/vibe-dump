(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&o(r)}).observe(document,{childList:!0,subtree:!0});function e(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(n){if(n.ep)return;n.ep=!0;const a=e(n);fetch(n.href,a)}})();function Dt(s){const t=s.getContext("webgl2",{antialias:!1,alpha:!1,depth:!1,stencil:!1,premultipliedAlpha:!1,preserveDrawingBuffer:!1,powerPreference:"high-performance"});if(!t)return null;const e=!!(t.getExtension("EXT_color_buffer_float")||t.getExtension("EXT_color_buffer_half_float"));return t.getExtension("OES_texture_float_linear"),{gl:t,floatOk:e}}function dt(s,t,e){const o=s.createShader(t);if(s.shaderSource(o,e),s.compileShader(o),!s.getShaderParameter(o,s.COMPILE_STATUS)){const n=s.getShaderInfoLog(o),a=e.split(`
`).map((r,c)=>`${String(c+1).padStart(3)} ${r}`).join(`
`);throw new Error(`shader compile failed:
${n}
${a}`)}return o}function U(s,t,e,o=""){if(o){const c=e.indexOf(`
`);e=e.slice(0,c+1)+o+e.slice(c+1)}const n=s.createProgram();if(s.attachShader(n,dt(s,s.VERTEX_SHADER,t)),s.attachShader(n,dt(s,s.FRAGMENT_SHADER,e)),s.linkProgram(n),!s.getProgramParameter(n,s.LINK_STATUS))throw new Error(`link failed: ${s.getProgramInfoLog(n)}`);const a={},r=s.getProgramParameter(n,s.ACTIVE_UNIFORMS);for(let c=0;c<r;c++){const h=s.getActiveUniform(n,c),i=h.name.replace(/\[0\]$/,"");a[i]=s.getUniformLocation(n,h.name)}return{p:n,u:a}}function O(s,t,e,{float:o=!0,linear:n=!0,channels:a=4}={}){const r=s.createTexture();s.bindTexture(s.TEXTURE_2D,r);let c,h,i;o?(c=a===2?s.RG16F:s.RGBA16F,h=a===2?s.RG:s.RGBA,i=s.HALF_FLOAT):(c=s.RGBA8,h=s.RGBA,i=s.UNSIGNED_BYTE),s.texImage2D(s.TEXTURE_2D,0,c,t,e,0,h,i,null);const f=n?s.LINEAR:s.NEAREST;s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,f),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MAG_FILTER,f),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE);const u=s.createFramebuffer();s.bindFramebuffer(s.FRAMEBUFFER,u),s.framebufferTexture2D(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,r,0);const l=s.checkFramebufferStatus(s.FRAMEBUFFER)===s.FRAMEBUFFER_COMPLETE;return s.bindFramebuffer(s.FRAMEBUFFER,null),{tex:r,fbo:u,w:t,h:e,ok:l}}function _t(s,t){t&&(s.deleteTexture(t.tex),s.deleteFramebuffer(t.fbo))}function D(s,t){t?(s.bindFramebuffer(s.FRAMEBUFFER,t.fbo),s.viewport(0,0,t.w,t.h)):(s.bindFramebuffer(s.FRAMEBUFFER,null),s.viewport(0,0,s.drawingBufferWidth,s.drawingBufferHeight))}function A(s,t,e,o){s.activeTexture(s.TEXTURE0+t),s.bindTexture(s.TEXTURE_2D,e),o&&s.uniform1i(o,t)}function qt(s){const t=s.createVertexArray();return()=>{s.bindVertexArray(t),s.drawArrays(s.TRIANGLES,0,3)}}const L=`#version 300 es
precision highp float;
precision highp int;
`,st=`
float sdfDecode(float v) {
#ifdef SDF8
  return (v - 0.5) * 256.0;
#else
  return v;
#endif
}
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
`,_=`${L}
out vec2 vUv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2)) * 2.0 - 1.0;
  vUv = p * 0.5 + 0.5;
  gl_Position = vec4(p, 0.0, 1.0);
}`,Ct=`${L}
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
}`,Nt=`${L}
${st}
${ot}
uniform sampler2D uSdf;
uniform vec2 uRes;
uniform vec2 uLight;
uniform float uPxPerM;
uniform float uTime;
uniform float uFall;
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
  float med = fbm(vec3(q * 1.2 + vec2(0.0, uFall * 0.3), uTime * 0.05));
  med = smoothstep(0.22, 0.8, med);

  vec3 col = uCore * (rim * 1.4 + core * 0.55 * (0.7 + 0.3 * uSwell)) + uHalo * (aura * 0.45 + far * 0.08);
  col *= flicker * mix(0.22, 1.5, med);
  // light through hair: the strands glow at their edges
  col += uCore * s.y * rim * 1.5;
  col *= outside * (0.8 + 0.35 * uSwell);
  o = vec4(col, 1.0);
}`,It=`${L}
${ot}
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
}`,Ot=`${L}
${ot}
uniform vec2 uRes;
uniform vec2 uLight;
uniform float uPxPerM;
uniform float uTime;
uniform float uFall;
in vec2 vUv;
out vec4 o;
void main() {
  vec2 p = vUv * uRes;
  vec2 rel = (p - uLight) / uPxPerM;
  float rq = length(rel);
  vec2 rdir = rel / max(rq, 1e-4);
  float flow = fbm(vec3(rdir * 3.5, log(1.0 + rq * 4.0) * 2.2 - uTime * 0.3));
  vec2 sq = vec2((vUv.x - 0.5) * uRes.x / uRes.y, vUv.y);
  float murk = fbm(vec3(sq * 1.3 + vec2(0.0, uFall * 0.05), uTime * 0.02 + 3.0));
  float ripple = fbm(vec3(sq * vec2(2.5, 6.0) + vec2(0.0, -uTime * 0.03), uTime * 0.04));
  o = vec4(flow, murk, ripple, 1.0);
}`,Vt=`${L}
${st}
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
}`,Gt=`${L}
layout(location = 0) in vec2 aCorner;
layout(location = 1) in vec4 aA; // x, y0, z, seed
layout(location = 2) in vec4 aB; // speed, size, brightness, kind
uniform mat4 uViewProj;
uniform vec2 uRes;
uniform float uFall;
uniform float uShutter;
uniform float uTime;
uniform float uWrap;
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

// each mote rises at its own speed and slides a little sideways — water is
// never still — so the streaks fan rather than fall like rain
vec2 slide() {
  float a = aA.w * 37.7;
  return vec2(cos(a), sin(a)) * (0.06 + 0.22 * fract(aA.w * 13.1));
}

vec3 world(float fall) {
  float y = mod(aA.y + fall * aB.x + uWrap * 0.5, uWrap) - uWrap * 0.5;
  vec2 sl = slide() * fall * aB.x;
  float x = mod(aA.x + sl.x + 8.0, 16.0) - 8.0;
  float sway = sin(uTime * (0.21 + aA.w * 0.05) + aA.w * 6.28) * 0.06 * aB.y * 40.0;
  return vec3(x + sway, y, aA.z + sin(sl.y * 0.7 + aA.w * 6.28) * 0.6);
}

void main() {
  vec3 cur = world(uFall);
  // unwrapped previous position, so a mote that just wrapped doesn't streak
  // across the whole screen
  vec2 sl = slide();
  vec3 prev = cur - vec3(sl.x, 1.0, 0.0) * uShutter * aB.x;
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
  float rad = sqrt(core * core + coc * coc);

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
  if (aB.w > 0.5) energy = max(energy, 0.03);
  vColor = (vec3(0.07, 0.11, 0.13) + lit * 3.4) * aB.z * energy;
  vBehind = depth > uFigureDepth ? 1.0 : 0.0;

  gl_Position = vec4(pos / uRes * 2.0 - 1.0, 0.0, 1.0);
}`,$t=`${L}
${st}
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
}`,zt=`${L}
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
}`,Xt=`${L}
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
}`,Ht=`${L}
${st}
${ot}
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
}`,jt=5;class Wt{constructor(t,{particleCount:e=5200,bokehCount:o=40,force8:n=!1}={}){const a=Dt(t);if(!a)throw new Error("webgl2");this.gl=a.gl,this.floatOk=a.floatOk&&!n;const r=this.gl;this.canvas=t,this.quad=qt(r);const c=this.floatOk?"":`#define SDF8
`;this.pSil=U(r,_,Ct,c),this.pEmit=U(r,_,Nt,c),this.pRadial=U(r,_,It),this.pHaze=U(r,_,Ot),this.pScene=U(r,_,Vt,c),this.pPart=U(r,Gt,$t,c),this.pDown=U(r,_,zt),this.pUp=U(r,_,Xt),this.pFinal=U(r,_,Ht,c),this.primTex=r.createTexture(),r.bindTexture(r.TEXTURE_2D,this.primTex),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.NEAREST),r.texImage2D(r.TEXTURE_2D,0,r.RGBA32F,400,1,0,r.RGBA,r.FLOAT,null),this.initParticles(e,o),console.info(`falling-repose: ${this.floatOk?"float":"8-bit"} targets`),this.w=0,this.h=0}initParticles(t,e){const o=this.gl,n=t+e,a=new Float32Array(n*4),r=new Float32Array(n*4);let c=12345;const h=()=>(c=c*16807%2147483647)/2147483647;this.wrap=10;for(let f=0;f<n;f++){const u=f>=t;let l,p;if(u)p=.8+h()*2,l=(h()-.5)*3.2;else{const m=h();p=3.2-Math.pow(m,.8)*13,l=(h()-.5)*(5+(4-p)*.9)}a[f*4]=l,a[f*4+1]=(h()-.5)*this.wrap,a[f*4+2]=p,a[f*4+3]=h(),r[f*4]=(5+Math.floor(h()*8))/8,r[f*4+1]=u?.004+h()*.006:.0025+Math.pow(h(),3)*.006,r[f*4+2]=u?.5+h()*.5:.35+Math.pow(h(),2)*1.4,r[f*4+3]=u?1:0}this.particleTotal=n,this.vao=o.createVertexArray(),o.bindVertexArray(this.vao);const i=o.createBuffer();o.bindBuffer(o.ARRAY_BUFFER,i),o.bufferData(o.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),o.STATIC_DRAW),o.enableVertexAttribArray(0),o.vertexAttribPointer(0,2,o.FLOAT,!1,0,0);for(const[f,u]of[[1,a],[2,r]]){const l=o.createBuffer();o.bindBuffer(o.ARRAY_BUFFER,l),o.bufferData(o.ARRAY_BUFFER,u,o.STATIC_DRAW),o.enableVertexAttribArray(f),o.vertexAttribPointer(f,4,o.FLOAT,!1,0,0),o.vertexAttribDivisor(f,1)}o.bindVertexArray(null)}resize(t,e){if(t===this.w&&e===this.h)return;const o=this.gl;this.w=t,this.h=e;for(const i of[this.sdf,this.emit,this.ra,this.rb,this.haze,this.scene,...this.bloom??[]])_t(o,i);const n=Math.max(1,Math.ceil(t/2)),a=Math.max(1,Math.ceil(e/2)),r={float:this.floatOk};this.sdf=O(o,n,a,r),this.emit=O(o,n,a,r),this.ra=O(o,n,a,r),this.rb=O(o,n,a,r),this.haze=O(o,Math.max(1,Math.ceil(t/4)),Math.max(1,Math.ceil(e/4)),r),this.scene=O(o,t,e,r),this.bloom=[];let c=t,h=e;for(let i=0;i<jt;i++)c=Math.max(1,Math.ceil(c/2)),h=Math.max(1,Math.ceil(h/2)),this.bloom.push(O(o,c,h,r))}render(t){const e=this.gl,{w:o,h:n}=this,a=t.figure;e.bindTexture(e.TEXTURE_2D,this.primTex),e.texSubImage2D(e.TEXTURE_2D,0,0,0,a.count*2,1,e.RGBA,e.FLOAT,a.data,0),D(e,this.sdf),e.useProgram(this.pSil.p),A(e,0,this.primTex,this.pSil.u.uPrims);const r=new Float32Array(48),c=new Int32Array(24);a.groups.slice(0,12).forEach((d,v)=>{r.set([d.cx,d.cy,d.r,d.k+2],v*4),c.set([d.start,d.count],v*2)}),e.uniform4fv(this.pSil.u.uGroups,r),e.uniform2iv(this.pSil.u.uRanges,c),e.uniform1i(this.pSil.u.uGroupCount,Math.min(12,a.groups.length)),e.uniform2f(this.pSil.u.uScale,o/this.sdf.w,n/this.sdf.h),this.quad();const h=t.lightPx;D(e,this.emit);let i=this.pEmit.u;e.useProgram(this.pEmit.p),A(e,0,this.sdf.tex,i.uSdf),e.uniform2f(i.uRes,o,n),e.uniform2f(i.uLight,h[0],h[1]),e.uniform1f(i.uPxPerM,a.pxPerM),e.uniform1f(i.uTime,t.story),e.uniform1f(i.uFall,t.fallSmall),e.uniform3fv(i.uCore,t.palette.core),e.uniform3fv(i.uHalo,t.palette.halo),e.uniform1f(i.uSwell,t.swell),this.quad(),e.useProgram(this.pRadial.p),i=this.pRadial.u,e.uniform2f(i.uCenter,h[0]/o,h[1]/n),e.uniform3fv(i.uAtten,t.palette.atten);const f=10,u=.92,l=[u/(f*f*f),u/(f*f),u/f];let p=this.emit,m=this.ra;for(let d=0;d<3;d++)D(e,m),A(e,0,p.tex,i.uSrc),e.uniform1f(i.uStep,l[d]),this.quad(),p=m,m=m===this.ra?this.rb:this.ra;const x=p;D(e,this.haze),e.useProgram(this.pHaze.p),i=this.pHaze.u,e.uniform2f(i.uRes,o,n),e.uniform2f(i.uLight,h[0],h[1]),e.uniform1f(i.uPxPerM,a.pxPerM),e.uniform1f(i.uTime,t.story),e.uniform1f(i.uFall,t.fallSmall),this.quad(),D(e,this.scene),e.useProgram(this.pScene.p),i=this.pScene.u,A(e,0,this.sdf.tex,i.uSdf),A(e,1,x.tex,i.uScatter),A(e,2,this.emit.tex,i.uEmit),A(e,3,this.haze.tex,i.uHaze),e.uniform2f(i.uRes,o,n),e.uniform2f(i.uLight,h[0],h[1]),e.uniform1f(i.uPxPerM,a.pxPerM),e.uniform1f(i.uExposure,t.exposure),e.uniform3fv(i.uBgTop,t.palette.bgTop),e.uniform3fv(i.uBgBot,t.palette.bgBot),e.uniform3fv(i.uHalo,t.palette.halo),e.uniform3fv(i.uSky,t.palette.sky),e.uniform1f(i.uAA,1),this.quad(),e.enable(e.BLEND),e.blendFunc(e.ONE,e.ONE),e.useProgram(this.pPart.p),i=this.pPart.u,e.uniformMatrix4fv(i.uViewProj,!1,t.cam.viewProj()),e.uniform2f(i.uRes,o,n),e.uniform1f(i.uFall,t.fallSmall),e.uniform1f(i.uShutter,t.shutter),e.uniform1f(i.uTime,t.story),e.uniform1f(i.uWrap,this.wrap),e.uniform1f(i.uFocus,t.focus),e.uniform1f(i.uAperture,t.aperture),e.uniform1f(i.uPxPerUnit,t.cam.pxPerUnit),e.uniform1f(i.uFigureDepth,t.focus),e.uniform1f(i.uExposure,t.exposure),e.uniform1f(i.uAA,1),A(e,0,this.sdf.tex,i.uSdf),A(e,1,x.tex,i.uScatter),e.bindVertexArray(this.vao),e.drawArraysInstanced(e.TRIANGLE_STRIP,0,4,this.particleTotal),e.bindVertexArray(null),e.disable(e.BLEND),e.useProgram(this.pDown.p);let b=this.scene;for(const d of this.bloom)D(e,d),A(e,0,b.tex,this.pDown.u.uSrc),e.uniform2f(this.pDown.u.uTexel,1/b.w,1/b.h),this.quad(),b=d;e.useProgram(this.pUp.p),e.enable(e.BLEND),e.blendFunc(e.ONE,e.ONE);for(let d=this.bloom.length-1;d>0;d--){const v=this.bloom[d],R=this.bloom[d-1];D(e,R),A(e,0,v.tex,this.pUp.u.uSrc),e.uniform2f(this.pUp.u.uTexel,1/v.w,1/v.h),this.quad()}e.disable(e.BLEND),D(e,null),e.useProgram(this.pFinal.p),i=this.pFinal.u,A(e,0,this.scene.tex,i.uScene),A(e,1,this.bloom[0].tex,i.uBloom),A(e,2,this.sdf.tex,i.uSdf),e.uniform2f(i.uRes,o,n),e.uniform1f(i.uTime,t.wall),e.uniform1f(i.uFade,t.fade),e.uniform1f(i.uBloomAmt,t.bloom),e.uniform1f(i.uGrain,.035),e.uniform1i(i.uDebug,t.debug?1:0),this.quad()}}function B(s,t){const e=new Array(9);for(let o=0;o<3;o++)for(let n=0;n<3;n++)e[o*3+n]=s[o*3]*t[n]+s[o*3+1]*t[3+n]+s[o*3+2]*t[6+n];return e}function V(s,t){return[s[0]*t[0]+s[1]*t[1]+s[2]*t[2],s[3]*t[0]+s[4]*t[1]+s[5]*t[2],s[6]*t[0]+s[7]*t[1]+s[8]*t[2]]}const Tt=s=>{const t=Math.cos(s),e=Math.sin(s);return[1,0,0,0,t,-e,0,e,t]},at=s=>{const t=Math.cos(s),e=Math.sin(s);return[t,0,e,0,1,0,-e,0,t]},At=s=>{const t=Math.cos(s),e=Math.sin(s);return[t,-e,0,e,t,0,0,0,1]},it=(s,t,e)=>B(At(e),B(Tt(s),at(t))),S=(s,t)=>[s[0]+t[0],s[1]+t[1],s[2]+t[2]],ct=(s,t)=>[s[0]-t[0],s[1]-t[1],s[2]-t[2]],q=(s,t)=>[s[0]*t,s[1]*t,s[2]*t],Yt=s=>Math.hypot(s[0],s[1],s[2]),H=s=>{const t=Yt(s)||1;return[s[0]/t,s[1]/t,s[2]/t]},mt=(s,t)=>[s[1]*t[2]-s[2]*t[1],s[2]*t[0]-s[0]*t[2],s[0]*t[1]-s[1]*t[0]];class Kt{constructor(){this.pos=[0,0,5],this.target=[0,0,0],this.fov=.6,this.w=1,this.h=1,this.near=.05,this.update()}update(){const t=H(ct(this.target,this.pos)),e=H(mt(t,[0,1,0])),o=mt(e,t);this.R=[e[0],e[1],e[2],o[0],o[1],o[2],-t[0],-t[1],-t[2]],this.focal=1/Math.tan(this.fov/2),this.pxPerUnit=this.focal*this.h/2}toCam(t){return V(this.R,ct(t,this.pos))}project(t){const e=this.toCam(t),o=Math.max(-e[2],this.near),n=this.pxPerUnit/o;return[this.w/2+e[0]*n,this.h/2+e[1]*n,o]}viewProj(){const t=this.R,e=this.pos,o=[-(t[0]*e[0]+t[1]*e[1]+t[2]*e[2]),-(t[3]*e[0]+t[4]*e[1]+t[5]*e[2]),-(t[6]*e[0]+t[7]*e[1]+t[8]*e[2])],n=this.w/this.h,a=this.focal,r=this.near,c=100,h=a/n,i=a,f=(c+r)/(r-c),u=2*c*r/(r-c),l=new Float32Array(16);for(let p=0;p<4;p++){const m=p<3?t[p]:o[0],x=p<3?t[3+p]:o[1],b=p<3?t[6+p]:o[2],d=p<3?0:1;l[p*4+0]=h*m,l[p*4+1]=i*x,l[p*4+2]=f*b+u*d,l[p*4+3]=-b}return l}}const vt=190,Et=[[.027,.044,.04],[.009,.048,.045],[-.01,.045,.041],[-.027,.035,.031]],z=[["pelvis",null,[0,0,0]],["spine","pelvis",[0,.1,-.01]],["chest","spine",[0,.17,0]],["neck","chest",[0,.25,-.025]],["head","neck",[0,.1,.012]]];for(const s of["L","R"]){const t=s==="L"?1:-1;z.push(["clav"+s,"chest",[.02*t,.215,-.01]],["shoulder"+s,"clav"+s,[.155*t,0,-.005]],["elbow"+s,"shoulder"+s,[0,-.29,0]],["wrist"+s,"elbow"+s,[0,-.25,0]],["hip"+s,"pelvis",[.092*t,-.07,0]],["knee"+s,"hip"+s,[0,-.43,0]],["ankle"+s,"knee"+s,[0,-.42,0]]),Et.forEach(([e,o],n)=>{z.push([`f${n}a${s}`,"wrist"+s,[0,-.092+Math.abs(e)*.18,e]]),z.push([`f${n}b${s}`,`f${n}a${s}`,[0,-o,0]])}),z.push(["thumbA"+s,"wrist"+s,[-.006*t,-.022,.03]]),z.push(["thumbB"+s,"thumbA"+s,[0,-.046,0]])}function Qt(){const s=[],t=(o,n,a,r,c,h,i)=>s.push({type:0,j:o,a:n,b:a,ra:r,rb:c,k:h,g:i}),e=(o,n,a,r,c,h)=>s.push({type:1,j:o,c:n,r:a,k:r,g:c,e:h});e("pelvis",[0,0,-.005],[.16,.11,.105],.05,"torso"),e("pelvis",[0,-.06,-.05],[.145,.1,.085],.04,"torso"),e("pelvis",[0,.03,.035],[.13,.09,.07],.04,"torso"),e("spine",[0,.08,0],[.13,.13,.088],.05,"torso"),e("chest",[0,.12,-.005],[.148,.16,.102],.05,"torso"),e("chest",[0,.165,.035],[.145,.08,.075],.03,"torso"),e("chest",[0,.17,-.048],[.145,.09,.07],.03,"torso"),t("chest",[-.14,.235,-.02],[.14,.235,-.02],.05,.05,.04,"torso"),t("neck",[0,-.02,0],[0,.11,.012],.05,.044,.03,"torso"),e("head",[0,.1,-.015],[.074,.095,.1],.02,"head"),e("head",[0,.052,.042],[.062,.075,.062],.02,"head"),e("head",[0,.004,.068],[.042,.028,.034],.015,"head"),e("head",[0,.112,.082],[.058,.018,.022],.012,"head"),t("head",[0,.092,.098],[0,.056,.121],.01,.0115,.008,"head"),e("head",[0,.03,.094],[.024,.014,.013],.008,"head"),e("head",[0,.105,-.06],[.082,.092,.082],.02,"head");for(const o of["L","R"]){const n="arm"+o,a="hand"+o,r="leg"+o;e("shoulder"+o,[.004,-.04,0],[.05,.08,.054],.03,n),t("shoulder"+o,[0,0,0],[0,-.29,0],.043,.033,.03,n),e("shoulder"+o,[0,-.15,.01],[.038,.1,.04],.02,n),t("elbow"+o,[0,0,0],[0,-.25,0],.034,.022,.02,n),e("elbow"+o,[0,-.07,0],[.033,.09,.038],.02,n),e("wrist"+o,[0,-.05,0],[.015,.05,.04],.012,a),e("wrist"+o,[-.004,-.036,.024],[.016,.03,.02],.01,a),Et.forEach(([,c,h],i)=>{const f=i===3?.0075:.0088;t(`f${i}a${o}`,[0,0,0],[0,-c,0],f,f*.86,.005,a),t(`f${i}b${o}`,[0,0,0],[0,-h,0],f*.86,f*.62,.004,a)}),t("thumbA"+o,[0,0,0],[0,-.046,0],.012,.0095,.008,a),t("thumbB"+o,[0,0,0],[0,-.034,0],.0095,.007,.004,a),t("hip"+o,[0,0,0],[0,-.43,0],.082,.05,.04,r),e("hip"+o,[0,-.17,.015],[.072,.19,.078],.03,r),t("knee"+o,[0,0,0],[0,-.41,0],.048,.029,.025,r),e("knee"+o,[0,-.12,-.028],[.046,.13,.052],.02,r),e("ankle"+o,[0,-.035,-.025],[.032,.035,.04],.015,r),t("ankle"+o,[0,-.045,-.01],[0,-.068,.155],.032,.021,.015,r)}return s}function Jt(){const s=[],t=[0,.1,-.015],e=[.08,.1,.105],o=15;for(let n=0;n<o;n++){const r=-.2+(n+.5)/o*2.1,c=Math.sin(n*2.399)*1.15,h=H([Math.sin(c),Math.cos(r),-Math.sin(r)*Math.cos(c)*.9]),i=[t[0]+h[0]*e[0]*.9,t[1]+h[1]*e[1]*.9,t[2]+h[2]*e[2]*.9],f=Math.floor(n/3);s.push({p:i,n:h,len:.26+.3*((n*.618+f*.3)%1),width:.015+.011*(n*.382%1),seed:f*2.71+n%3*.23+.7})}return s}function Zt(s,t){return Math.sin(t*.097+s*1.7)*.5+Math.sin(t*.181+s*3.1)*.3+Math.sin(t*.293+s*5.3)*.2}const xt={spine:[-.1,0,.03],chest:[-.12,.05,.03],neck:[-.15,.25,.05],head:[-.3,.55,.1],clavL:[0,0,.12],shoulderL:[-.3,1.1,1.3],elbowL:[-.85,0,0],wristL:[.35,0,.1],clavR:[0,0,.1],shoulderR:[-.2,.5,.85],elbowR:[-.6,0,0],wristR:[.3,0,.15],hipL:[-.3,.1,.2],kneeL:[.7,0,0],ankleL:[1,0,0],hipR:[-.8,.75,.3],kneeR:[1.55,0,0],ankleR:[.95,0,0]},te={spine:[.22,0,.05],chest:[.18,-.1,.02],neck:[.15,.2,0],head:[.1,.45,.05],clavL:[0,0,.05],shoulderL:[-.95,.6,.55],elbowL:[-1.35,0,0],wristL:[.4,0,.1],clavR:[0,0,.05],shoulderR:[-.7,.3,.45],elbowR:[-1.5,0,0],wristR:[.35,0,.1],hipL:[-1.35,.25,.15],kneeL:[1.95,0,0],ankleL:[.8,0,0],hipR:[-1.1,.4,.22],kneeR:[1.7,0,0],ankleR:[.85,0,0]},ee={spine:[-.2,0,.02],chest:[-.2,.05,.02],neck:[-.2,.3,.03],head:[-.42,.5,.05],clavL:[0,0,.25],shoulderL:[-2.5,.5,.45],elbowL:[-.45,0,0],wristL:[.25,0,.1],clavR:[0,0,.22],shoulderR:[-2.25,.2,.6],elbowR:[-.6,0,0],wristR:[.3,0,.1],hipL:[-.12,.05,.12],kneeL:[.55,0,0],ankleL:[1.05,0,0],hipR:[-.35,.5,.2],kneeR:[1,0,0],ankleR:[1,0,0]};function se(s){if(typeof s=="string")return{open:s==="open"?1:0,curl:s==="curl"?1:0,surrender:s==="surrender"?1:0};const t=.5+.5*Math.sin(s/53-1.4),e=.5+.5*Math.sin(s/71-1.57),o=Math.pow(t,3)*.85,n=Math.pow(e,3)*.85*(1-o);return{open:1-o-n,curl:o,surrender:n}}class oe{constructor(){this.joints=z.map(([t,e,o])=>({name:t,parent:e,offset:o,side:t.endsWith("R")?-1:1,rot:[0,0,0],R:null,p:null})),this.byName=Object.fromEntries(this.joints.map(t=>[t.name,t])),this.shapes=Qt(),this.roots=Jt(),this.data=new Float32Array(vt*8),this.groups=[],this.count=0,this.hair=[]}pose(t,{wind:e=1,reach:o=0,wall:n=t,orient:a,preset:r}){const c=this.byName,h=d=>Zt(d,t),i=Math.max(0,e),f=Math.sin(n*.9)*.015,u=se(r==="open"||r==="curl"||r==="surrender"?r:t),l={};for(const d of Object.keys(xt))l[d]=[0,1,2].map(v=>xt[d][v]*u.open+te[d][v]*u.curl+ee[d][v]*u.surrender);l.spine[0]+=f,l.chest[0]+=f,l.shoulderL[0]-=i*.15,l.shoulderL[2]+=i*.12,l.shoulderR[0]-=i*.12,l.shoulderR[2]+=i*.15,l.hipL[0]-=i*.08,l.hipR[0]-=i*.08;const p={spine:[.06,.05,.04],chest:[.05,.06,.03],neck:[.08,.15,.05],head:[.12,.25,.08],clavL:[0,0,.05],shoulderL:[.3,.3,.2],elbowL:[.3,0,0],wristL:[.2,.2,.15],clavR:[0,0,.05],shoulderR:[.3,.3,.2],elbowR:[.35,0,0],wristR:[.2,.2,.1],hipL:[.2,.15,.1],kneeL:[.3,0,0],ankleL:[.15,0,0],hipR:[.2,.15,.1],kneeR:[.3,0,0],ankleR:[.15,0,0]};let m=1;for(const d of this.joints){const v=l[d.name],R=p[d.name];if(r==="stand"||!v){d.rot=[0,0,0];continue}d.rot=v.map((w,y)=>w+h(m++*3.7+y)*R[y])}if(r!=="stand"){const d=(w,y)=>w+(y-w)*o,v=c.elbowR.rot,R=c.wristR.rot;c.elbowR.rot=[d(v[0],-.12),0,0],c.wristR.rot=[d(R[0],-.3),R[1],R[2]],c.head.rot[1]-=o*.2;for(const w of["L","R"]){const y=w==="L"?0:50,M=w==="R"?o:0;for(let g=0;g<4;g++){const E=(1.5-g)*(.12+M*.1)+h(30+y+g)*.05,G=(.3+g*.08+h(35+y+g)*.12)*(1-M*.75);c[`f${g}a${w}`].rot=[E,0,-G],c[`f${g}b${w}`].rot=[0,0,-G*1.3]}c["thumbA"+w].rot=[-.75-M*.25+h(40+y)*.1,0,-.3],c["thumbB"+w].rot=[0,0,-.3*(1-M)]}}this.fk(a),r!=="stand"&&this.aimReach(o);const x=["pelvis","chest","chest","head","kneeL","kneeR","elbowL","elbowR"],b=[0,0,0];for(const d of x)for(let v=0;v<3;v++)b[v]+=c[d].p[v]/x.length;for(const d of this.joints)d.p=ct(d.p,b);this.torso=q(S(c.chest.p,c.pelvis.p),.5),this.poseHair(t,i)}fk(t){const e=this.byName;for(const o of this.joints){const n=it(o.rot[0],o.rot[1]*o.side,o.rot[2]*o.side);if(!o.parent)o.R=B(t,n),o.p=[0,0,0];else{const a=e[o.parent];o.R=B(a.R,n),o.p=S(a.p,V(a.R,o.offset))}}this.root=t}aimReach(t){const e=this.byName,o=e.shoulderR;if(this.reachAim||(this.reachAim=o.rot.slice()),t>.001){const a=e.clavR.R,r=o.rot[1];let c=null,h=-1e9;const i=(u,l)=>{const p=B(a,it(u,-r,-l)),m=-p[4],x=-p[7];return m+.12*x-.04*(Math.abs(u-o.rot[0])+Math.abs(l-o.rot[2]))};for(let u=-3;u<=.6;u+=.2)for(let l=-.2;l<=2.6;l+=.2){const p=i(u,l);p>h&&(h=p,c=[u,l])}for(const u of[.08,.03])for(const l of[-u,0,u])for(const p of[-u,0,u]){const m=i(c[0]+l,c[1]+p);m>h&&(h=m,c=[c[0]+l,c[1]+p])}const f=.06;this.reachAim[0]+=(c[0]-this.reachAim[0])*f,this.reachAim[2]+=(c[1]-this.reachAim[2])*f}else this.reachAim=o.rot.slice();const n=t*t*(3-2*t);o.rot=[o.rot[0]+(this.reachAim[0]-o.rot[0])*n,o.rot[1],o.rot[2]+(this.reachAim[2]-o.rot[2])*n],this.fk(this.root)}poseHair(t,e){const o=this.byName.head,n=[0,1,0],a=7;this.hair=this.roots.map(r=>{const c=[S(o.p,V(o.R,r.p))],h=V(o.R,r.n);let i=H([h[0]-n[0]*h[1],0,h[2]]);(!isFinite(i[0])||Math.hypot(i[0],i[2])<.001)&&(i=[1,0,0]);const f=[-i[2],0,i[0]],u=r.len/a,l=r.seed,p=Math.min(1.4,e);let m=h;for(let x=1;x<=a;x++){const b=x/a,d=l*3.1+t*(.9+.5*p)-b*3.4,v=(.25+.95*b)*(.6+.35*(1-Math.min(1,p))),R=S(q(i,Math.sin(d)*v),q(f,Math.sin(d*.73+l)*v*.8)),w=H(S(S(q(h,.7*(1-b)+.1),q(n,p*(.7+1.1*b))),R));m=H(S(q(m,.35),q(w,.65+.3*b))),c.push(S(c[c.length-1],q(m,u)))}return{pts:c,width:r.width}})}project(t){const e=this.data;let o=0;const n=new Map,a=this.byName,r=[],c=(u,l,p)=>{if(o>=vt)return;e.set(l,o*8),e.set(p,o*8+4),n.has(u)||(n.set(u,{start:o,count:0,minX:1e9,minY:1e9,maxX:-1e9,maxY:-1e9,k:0}),r.push(u));const m=n.get(u);return m.count++,o++,m},h=(u,l,p,m)=>{u.minX=Math.min(u.minX,l-m),u.maxX=Math.max(u.maxX,l+m),u.minY=Math.min(u.minY,p-m),u.maxY=Math.max(u.maxY,p+m)};this.pxPerM=t.pxPerUnit/t.project([0,0,0])[2];const i=(u,l,p,m,x,b,d)=>{const v=t.project(u),R=t.project(l),w=p*t.pxPerUnit/v[2],y=m*t.pxPerUnit/R[2],M=x*this.pxPerM,g=c(b,[v[0],v[1],R[0],R[1]],[w,y,d?2:0,M]);g&&(h(g,v[0],v[1],w),h(g,R[0],R[1],y),g.k=Math.max(g.k,M))};for(const u of this.shapes){const l=a[u.j],p=l.side;if(u.type===0){const m=[u.a[0]*p,u.a[1],u.a[2]],x=[u.b[0]*p,u.b[1],u.b[2]];i(S(l.p,V(l.R,m)),S(l.p,V(l.R,x)),u.ra,u.rb,u.k,u.g,!1)}else{const m=S(l.p,V(l.R,[u.c[0]*p,u.c[1],u.c[2]]));let x=l.R;u.e&&(x=B(x,it(u.e[0],u.e[1]*p,u.e[2]*p)));const b=B(t.R,x),d=[0,1,2].map(F=>[b[0+F]*u.r[F],b[3+F]*u.r[F]]);let v=0,R=0,w=0;for(const[F,nt]of d)v+=F*F,R+=F*nt,w+=nt*nt;const y=t.project(m),M=t.pxPerUnit/y[2];v*=M*M,R*=M*M,w*=M*M;const g=(v+w)/2,E=Math.sqrt(((v-w)/2)**2+R*R),G=g+E,Ut=Math.max(g-E,1e-6),lt=.5*Math.atan2(2*R,v-w),ft=Math.sqrt(G),Ft=Math.sqrt(Ut),pt=u.k*this.pxPerM,Z=c(u.g,[y[0],y[1],Math.cos(lt),Math.sin(lt)],[ft,Ft,1,pt]);if(!Z)continue;h(Z,y[0],y[1],ft),Z.k=Math.max(Z.k,pt)}}for(const{pts:u,width:l}of this.hair){const p=u.length-1,m=x=>l*Math.pow(1-x,1.4)+.0016;for(let x=0;x<p;x++){const b=m(x/p),d=m((x+1)/p);i(u[x],u[x+1],b,d,Math.max(.0025,b*1.5),"hair",!0)}}this.count=o,this.groups=r.map(u=>{const l=n.get(u),p=(l.minX+l.maxX)/2,m=(l.minY+l.maxY)/2;return{cx:p,cy:m,r:Math.hypot(l.maxX-l.minX,l.maxY-l.minY)/2,start:l.start,count:l.count,k:l.k}});const f=t.project(this.torso);return this.torsoPx=f,this}}const bt=s=>s*s*(3-2*s),ne=s=>Math.min(1,Math.max(0,s));function ie(s){let t=s>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}function rt(s,t,e,o,n){const a=s-t;return a<=0||a>=e+o+n?0:a<e?bt(a/e):a<e+o?1:1-bt((a-e-o)/n)}const wt=1.7,re=27;class ae{constructor(t=0){this.wall=t,this.story=re+t*.9,this.fall=t*wt,this.rate=1,this.blur=1,this.hold=0,this.holding=!1,this.susp=0,this.rush=0,this.reach=0,this.swell=0;const e=ie(1789);this.suspensions=[],this.rushes=[];let o=40;for(let n=0;n<400;n++){this.suspensions.push(o);const a=80+e()*55;this.rushes.push(o+22+e()*(a-40)),o+=a}}suspensionAt(t){let e=0;for(const o of this.suspensions){if(o>t)break;e=Math.max(e,rt(t,o,5,10,7))}return e}rushAt(t){let e=0;for(const o of this.rushes){if(o>t)break;e=Math.max(e,rt(t,o,3.5,5,5))}return e}reachAt(t){let e=0;for(const o of this.suspensions){if(o>t)break;e=Math.max(e,rt(t,o+4,6,6,8))}return e}tick(t,e=!1){t=Math.min(t,.1),this.wall+=t;const o=this.wall,n=Math.PI*2,a=.9+.3*Math.sin(n*o/67)+.18*Math.sin(n*o/31+1.3)+.08*Math.sin(n*o/13+.4);this.susp=this.suspensionAt(o),this.rush=this.rushAt(o),this.reach=this.reachAt(o);const r=1-Math.exp(-t/.6);this.hold+=((this.holding?1:0)-this.hold)*(1-Math.exp(-t/(this.holding?.9:1.6)));const c=e?.45:1;let h=a*(1+.85*this.rush);h=h*(1-this.susp)+-.06*this.susp,h*=1-.97*this.hold,this.rate+=(h*c-this.rate)*r;let i=a*(1+1.3*this.rush);i=i*(1-this.susp)+1.05*this.susp,i*=1-.45*this.hold,this.blur+=(i*c-this.blur)*r,this.story+=t*Math.min(1.6,Math.max(.025,this.rate)),this.fall+=t*this.rate*wt,this.swell=ne(this.susp*1+this.hold*.5)}}const ce=`
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
`,j=[{bass:38,notes:[45,54,57,64],pcs:[0,4,7]},{bass:37,notes:[45,52,57,61],pcs:[7,11,2]},{bass:35,notes:[42,50,54,61],pcs:[9,0,4]},{bass:33,notes:[42,49,54,57],pcs:[4,7,11]},{bass:31,notes:[38,47,54,57],pcs:[5,9,0,4]},{bass:30,notes:[45,50,54,64],pcs:[0,4,7]},{bass:28,notes:[43,50,54,59],pcs:[2,5,9,0]},{bass:33,notes:[40,50,52,55],pcs:[7,0,2,5]}],he=12.5,gt=.62,Rt=[[66,64,62,57],[66,64,62],[62,61,59,57],[69,66,64,62],[66,64]],W=s=>440*Math.pow(2,(s-69)/12);function ue(s,t=7.5){const e=s.sampleRate,o=Math.floor(e*t),n=s.createBuffer(2,o,e);for(let a=0;a<2;a++){const r=n.getChannelData(a);let c=0,h=a?91:17;const i=()=>(h=h*16807%2147483647)/2147483647*2-1,f=Math.floor(e*.028);for(let u=f;u<o;u++){const l=(u-f)/e,p=.55-.5*Math.min(1,l/t);c+=(i()-c)*p,r[u]=c*Math.exp(-6.9*l/(t*.82))*(l<.06?l/.06:1)}for(const[u,l]of[[11,.5],[23,.32],[37,.24],[53,.16]]){const p=Math.floor(e*(u+(a?4:0))*.001);p<o&&(r[p]+=l*(a?-1:1))}}return n}function le(s,t=6){const e=s.sampleRate,o=Math.floor(e*t),n=s.createBuffer(2,o,e);for(let a=0;a<2;a++){const r=n.getChannelData(a);let c=0,h=0,i=0;for(let f=0;f<o;f++){const u=Math.random()*2-1;c=.99765*c+u*.099046,h=.963*h+u*.2965164,i=.57*i+u*1.0526913,r[f]=(c+h+i+u*.1848)*.12}}return n}class fe{constructor(){this.started=!1,this.muted=!1,this.ctx=null}async start(t){if(this.started)return;this.started=!0;const e=!t;if(e){const o=window.AudioContext||window.webkitAudioContext;t=new o({latencyHint:"playback"}),t.resume()}if(this.ctx=t,this.hasShepard=!1,t.audioWorklet){const o=URL.createObjectURL(new Blob([ce],{type:"application/javascript"}));try{await t.audioWorklet.addModule(o),this.hasShepard=!0}catch(n){console.warn("shepard worklet unavailable:",n)}URL.revokeObjectURL(o)}this.build(),this.live=e}build(){const t=this.ctx,e=t.currentTime,o=(M=1)=>{const g=t.createGain();return g.gain.value=M,g};this.master=o(0);const n=t.createDynamicsCompressor();n.threshold.value=-20,n.knee.value=18,n.ratio.value=2.6,n.attack.value=.04,n.release.value=.6,this.master.connect(n).connect(t.destination),this.master.gain.setValueAtTime(0,e),this.master.gain.linearRampToValueAtTime(1e-4,e+.05),this.master.gain.setTargetAtTime(gt,e+.05,2.2),this.dry=o(1),this.dry.connect(this.master),this.verb=t.createConvolver(),this.verb.buffer=ue(t),this.verbIn=o(1);const a=o(.75);this.verbIn.connect(this.verb).connect(a).connect(this.master),this.echoIn=o(1);const r=t.createDelay(3),c=t.createDelay(3);r.delayTime.value=.61,c.delayTime.value=.89;const h=o(.42),i=t.createBiquadFilter();i.type="lowpass",i.frequency.value=2200;const f=t.createChannelMerger(2);this.echoIn.connect(r),r.connect(c),c.connect(i).connect(h).connect(r),r.connect(f,0,0),c.connect(f,0,1);const u=o(.5);f.connect(u),u.connect(this.dry),u.connect(this.verbIn),this.tape=t.createConstantSource(),this.tape.offset.value=0,this.wow=t.createOscillator(),this.wow.frequency.value=.31,this.wowDepth=o(4),this.wow.connect(this.wowDepth),this.tapeBus=o(1),this.tape.connect(this.tapeBus),this.wowDepth.connect(this.tapeBus),this.tape.start(e),this.wow.start(e),this.shepGain=o(0);const l=t.createBiquadFilter();l.type="lowpass",l.frequency.value=2600,l.Q.value=.4,this.hasShepard&&(this.shep=new AudioWorkletNode(t,"shepard",{numberOfInputs:0,outputChannelCount:[2]}),this.shep.connect(l)),l.connect(this.shepGain);const p=o(.35);this.shepGain.connect(p).connect(this.dry),this.shepGain.connect(this.verbIn);const m=[0,1,.45,.24,.14,.085,.05,.03,.018,.01,.006];this.wave=t.createPeriodicWave(new Float32Array(m.length),new Float32Array(m)),this.padFilter=t.createBiquadFilter(),this.padFilter.type="lowpass",this.padFilter.frequency.value=900,this.padFilter.Q.value=.5,this.padBus=o(.11),this.padFilter.connect(this.padBus),this.padBus.connect(this.dry);const x=o(.9);this.padBus.connect(x).connect(this.verbIn),this.voices=[],this.subGain=o(0),this.subGain.connect(this.dry),this.subs=[[12,.62],[0,.5]].map(([M,g])=>{const E=t.createOscillator();E.type="sine",E.frequency.value=W(j[0].bass+M);const G=o(g);return E.connect(G).connect(this.subGain),this.tapeBus.connect(E.detune),E.start(e),{o:E,shift:M}});const b=le(t);this.airSrc=t.createBufferSource(),this.airSrc.buffer=b,this.airSrc.loop=!0,this.airBus=o(0),this.air=[];for(let M=0;M<4;M++){const g=t.createBiquadFilter();g.type="bandpass",g.Q.value=34,g.frequency.value=440;const E=o(1.6);this.airSrc.connect(g).connect(E).connect(this.airBus),this.air.push(g)}this.airBus.connect(this.verbIn);const d=o(.25);this.airBus.connect(d).connect(this.dry),this.airSrc.start(e),this.windSrc=t.createBufferSource(),this.windSrc.buffer=b,this.windSrc.loop=!0,this.windSrc.playbackRate.value=.7,this.windBand=t.createBiquadFilter(),this.windBand.type="bandpass",this.windBand.Q.value=.7,this.windBand.frequency.value=400;const v=t.createBiquadFilter();v.type="lowpass",v.frequency.value=1400,this.windGain=o(0),this.windPan=t.createStereoPanner(),this.windSrc.connect(this.windBand).connect(v).connect(this.windGain).connect(this.windPan),this.windPan.connect(this.dry);const R=o(.3);this.windPan.connect(R).connect(this.verbIn),this.windSrc.start(e),this.bellBus=o(.16),this.bellBus.connect(this.dry);const w=o(.8);this.bellBus.connect(w).connect(this.verbIn);const y=o(.55);this.bellBus.connect(y).connect(this.echoIn),this.lastNow=e,this.mtime=0,this.chordIndex=-1,this.nextChord=0,this.nextMotif=9,this.motifCount=0,this.inSusp=!1,this.lastWall=null}setMuted(t){if(this.muted=t,!this.ctx)return;const e=this.ctx.currentTime;this.master.gain.cancelScheduledValues(e),this.master.gain.setValueAtTime(this.master.gain.value,e),t?(this.master.gain.setTargetAtTime(0,e,.25),this.live&&setTimeout(()=>this.muted&&this.ctx.suspend(),1500)):(this.ctx.resume(),this.master.gain.setTargetAtTime(gt,e,.8))}setHidden(t){!this.ctx||!this.live||this.muted||(t?this.ctx.suspend():this.ctx.resume())}chord(t,e){var a;const o=this.ctx,n=j[t%j.length];for(const r of this.voices){r.env.gain.cancelScheduledValues(e),r.env.gain.setTargetAtTime(0,e,2.4);for(const c of r.osc)c.stop(e+14)}this.voices=[],n.notes.forEach((r,c)=>{const h=o.createGain();h.gain.value=0;const i=.32/Math.sqrt(n.notes.length)*(1-c*.09);h.gain.setValueAtTime(0,e),h.gain.setTargetAtTime(i,e,1.6),h.connect(this.padFilter);const f=[-1,1].map(u=>{const l=o.createOscillator();l.setPeriodicWave(this.wave),l.frequency.value=W(r),l.detune.value=u*(r<48?2.5:5+Math.random()*3),this.tapeBus.connect(l.detune);const p=o.createStereoPanner();return p.pan.value=u*(.25+c*.1),l.connect(p).connect(h),l.start(e),this.unhookOnEnd(l),l});this.voices.push({env:h,osc:f})});for(const{o:r,shift:c}of this.subs)r.frequency.setTargetAtTime(W(n.bass+c),e,.9);this.air.forEach((r,c)=>{const h=n.notes[c%n.notes.length]+12;r.frequency.setTargetAtTime(W(h),e,1.4)}),(a=this.shep)==null||a.port.postMessage({chord:n.pcs})}bell(t,e,o,n){const a=this.ctx,r=W(e),c=[[1,1,3.8],[2,.32,2.2],[3,.1,1.2],[4.16,.05,.7],[5.43,.025,.45]];for(const[h,i,f]of c){const u=a.createOscillator();u.frequency.value=r*h,this.tapeBus.connect(u.detune);const l=a.createGain();l.gain.value=0;const p=o*i;if(n){const m=Math.min(2.6,f*.75+.6);l.gain.setValueAtTime(1e-5,t),l.gain.exponentialRampToValueAtTime(p,t+m),l.gain.linearRampToValueAtTime(0,t+m+.05),u.start(t),u.stop(t+m+.1)}else l.gain.setValueAtTime(0,t),l.gain.linearRampToValueAtTime(p,t+.008),l.gain.setTargetAtTime(0,t+.008,f/4),u.start(t),u.stop(t+f*1.6+.2);u.connect(l).connect(this.bellBus),this.unhookOnEnd(u)}}unhookOnEnd(t){t.onended=()=>{try{this.tapeBus.disconnect(t.detune)}catch{}t.disconnect()}}motif(t,e,o,n){const a=Rt[n%Rt.length];let r=t;a.forEach((c,h)=>{const i=.75-h*.08+Math.random()*.1;this.bell(r,c,i,o),Math.random()<.35&&this.bell(r+.004,c-12,i*.4,o),r+=e*(.85+Math.random()*.3)*(h===a.length-2?1.5:1)})}update(t){var x;if(!this.ctx||!this.master)return;const o=this.ctx.currentTime,n=Math.max(0,Math.min(.25,o-this.lastNow));if(this.lastNow=o,n===0&&this.chordIndex>=0)return;const a=t.wall,r=t.rate,c=o+.03,h=(b,d,v=.25)=>b.setTargetAtTime(d,o,v);this.mtime+=n*Math.max(.05,Math.min(1.8,Math.abs(r))),this.mtime>=this.nextChord&&(this.chordIndex++,this.chord(this.chordIndex,c),this.nextChord+=he);const i=(x=this.shep)==null?void 0:x.parameters;i&&(h(i.get("rate"),-.022*r*(1+.6*t.rush),.4),h(i.get("fifth"),.25+.5*t.susp,1),h(i.get("center"),8.1+.4*Math.sin(a/41)+.3*t.rush,2));const f=.5+.5*Math.sin(a/97*Math.PI*2-1.2),u=.05+.85*f*f+.4*t.rush+.35*t.susp;h(this.shepGain.gain,Math.min(1,u)*.55,1.5);const l=t.swell,p=(650+700*(.5+.5*Math.sin(a/23))+1300*l+900*t.rush)*(1-.45*t.hold);h(this.padFilter.frequency,p,.8),h(this.subGain.gain,.15+.06*l,1),h(this.airBus.gain,.05+.12*l+.03*Math.max(0,Math.sin(a/31)),1.5),h(this.tape.offset,-38*t.hold-8*t.susp,.6),h(this.wowDepth.gain,3+14*t.hold+6*t.susp,.6),h(this.wow.frequency,.12+.25*Math.max(0,Math.min(1.5,r)),.6);const m=Math.max(0,r);if(h(this.windGain.gain,.035*Math.pow(m,1.6)+.06*t.rush,.5),h(this.windBand.frequency,220+420*Math.min(2,m)+600*t.rush,.5),h(this.windPan.pan,.5*Math.sin(a/7.3),.5),this.mtime>=this.nextMotif&&t.susp<.05){const b=.95/Math.max(.35,Math.min(1.6,r));this.motif(c,b,Math.random()<.2,this.motifCount++),this.nextMotif=this.mtime+16+Math.random()*22}else if(Math.random()<n/9&&t.susp<.05){const b=j[Math.max(0,this.chordIndex)%j.length],d=b.notes[Math.floor(Math.random()*b.notes.length)]+24;this.bell(c,d,.18+Math.random()*.15,Math.random()<.3)}t.susp>.6&&!this.inSusp?(this.inSusp=!0,this.motif(c+.5,2.4,!0,0)):t.susp<.1&&(this.inSusp=!1)}}const K=document.getElementById("view"),pe=document.getElementById("sound"),de=matchMedia("(prefers-reduced-motion: reduce)").matches,I=new URLSearchParams(location.search),Y=(s,t)=>I.has(s)?+I.get(s):t;let Q;try{Q=new Wt(K,{force8:I.has("sdf8")})}catch(s){console.error(s),document.body.classList.add("nogl")}const $=new oe,C=new Kt,T=new ae(Number(I.get("t"))||0),k=new fe,tt=[{core:[1,.72,.4],halo:[.7,.42,.2],atten:[3.2,1.7,1.1],bgTop:[.004,.016,.024],bgBot:[0,.002,.004],sky:[.008,.03,.034]},{core:[.8,.88,1],halo:[.26,.38,.55],atten:[2,1.45,.95],bgTop:[.004,.011,.028],bgBot:[0,.001,.005],sky:[.008,.018,.036]},{core:[1,.7,.66],halo:[.5,.28,.36],atten:[1.8,2,1.35],bgTop:[.012,.006,.022],bgBot:[.002,0,.004],sky:[.02,.012,.03]},{core:[.82,1,.9],halo:[.22,.48,.46],atten:[2.8,1.25,1.35],bgTop:[.002,.018,.02],bgBot:[0,.002,.003],sky:[.006,.03,.028]}],me=95;function ve(s){const t=s/me%tt.length,e=Math.floor(t);let o=t-e;o=o*o*(3-2*o);const n=tt[e],a=tt[(e+1)%tt.length],r={};for(const c of Object.keys(n))r[c]=n[c].map((h,i)=>h+(a[c][i]-h)*o);return r}let P={x:0,y:0,sx:0,sy:0},Mt=0;function ut(){document.body.classList.remove("idle"),clearTimeout(Mt),Mt=setTimeout(()=>document.body.classList.add("idle"),2600)}function St(){T.holding=!0,!k.started&&!k.muted&&Lt()}function J(){T.holding=!1}function Lt(){k.start().then(()=>document.body.classList.add("sounding")).catch(s=>console.warn("no sound:",s))}addEventListener("pointerdown",s=>{s.target.closest("#sound")||(ut(),St())});addEventListener("pointerup",J);addEventListener("pointercancel",J);addEventListener("blur",J);addEventListener("pointermove",s=>{ut(),P.x=s.clientX/innerWidth*2-1,P.y=s.clientY/innerHeight*2-1});addEventListener("keydown",s=>{s.repeat||(s.code==="Space"?(s.preventDefault(),St()):s.code==="KeyM"?Bt():s.code==="KeyF"&&Pt())});addEventListener("keyup",s=>{s.code==="Space"&&J()});addEventListener("dblclick",Pt);addEventListener("contextmenu",s=>s.preventDefault());function Pt(){var s,t,e;document.fullscreenElement?(s=document.exitFullscreen)==null||s.call(document):(e=(t=document.documentElement).requestFullscreen)==null||e.call(t).catch(()=>{})}function Bt(){if(!k.started){k.muted=!1,Lt();return}k.setMuted(!k.muted),document.body.classList.toggle("sounding",!k.muted)}pe.addEventListener("click",s=>{s.stopPropagation(),Bt()});let N=(devicePixelRatio||1)>1.5?.8:1;const xe=performance.now();let X=[],ht=0,et=performance.now(),yt=!1;function be(){const s=Math.min(devicePixelRatio||1,2),t=Math.max(2,Math.round(innerWidth*s*N)),e=Math.max(2,Math.round(innerHeight*s*N));return(K.width!==t||K.height!==e)&&(K.width=t,K.height=e),[t,e]}function we(s){if(X.push(s),X.length<40)return;X.sort((e,o)=>e-o);const t=X[20];X=[],t>24&&N>.45?N=Math.max(.45,N*.85):t<12&&N<1&&(N=Math.min(1,N*1.1))}function kt(s){const t=Math.min(.1,(s-et)/1e3);et=s,ht>3&&we(t*1e3),ht++,ge(t),requestAnimationFrame(kt)}function ge(s){if(T.tick(I.has("still")?0:s,de),k.update(T),!Q)return;const[t,e]=be();Q.resize(t,e);const o=T.wall;P.sx+=(P.x-P.sx)*Math.min(1,s*1.5),P.sy+=(P.y-P.sy)*Math.min(1,s*1.5);const n=t/e,a=Math.max(1.36,1.5/n),r=.68-.24*T.susp+.14*T.rush-.08*T.hold,c=a/Math.tan(r/2),h=.1*Math.sin(o/41)+P.sx*.08,i=.1+.07*Math.sin(o/53)+.18*T.rush+P.sy*.06;C.w=t,C.h=e,C.fov=r,C.target=[0,0,0],C.pos=[Math.sin(h)*Math.cos(i)*c,Math.sin(i)*c,Math.cos(h)*Math.cos(i)*c],C.update();const f=T.story,u=Y("roll",1.72+.36*Math.sin(f/31)+.12*Math.sin(f/13+1)),l=Y("twist",1+f*Math.PI*2/75+.45*Math.sin(f/17)),p=Y("yaw",.25*Math.sin(f/21+.5)),m=Y("tilt",-.2+.2*Math.sin(f/17+2)),x=B(at(p),B(Tt(m),B(At(u),at(l)))),b=.35+.6*Math.min(2,Math.max(0,T.blur));$.pose(f,{wind:b,reach:Y("reach",T.reach),wall:o,orient:x,preset:I.get("pose")}),$.project(C);const d=$.torsoPx,v=[d[0]+$.pxPerM*(.12*Math.sin(o/29)+.05*Math.sin(o/11)),d[1]+$.pxPerM*(.08*Math.sin(o/37+2)+.04)],R=Q.wrap*8,w=I.has("t")?1:Math.min(1,(performance.now()-xe)/5e3);Q.render({figure:$,cam:C,lightPx:v,story:f,wall:o,fallSmall:T.fall%R,shutter:.085*Math.max(.12,T.blur),focus:c,aperture:.06,exposure:1+.3*T.swell,swell:T.swell,palette:ve(o+20),fade:w*w,bloom:.3,debug:I.has("fig")}),!yt&&w>=1&&ht>8&&(yt=!0,document.body.classList.add("ready"))}addEventListener("resize",()=>X=[]);document.addEventListener("visibilitychange",()=>{et=performance.now(),document.hidden&&J(),k.setHidden(document.hidden)});ut();requestAnimationFrame(s=>{et=s,requestAnimationFrame(kt)});
