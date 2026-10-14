// goo.js — turns particles into liquid. One shared WebGL canvas renders every
// vessel on the desktop into its own tile of an atlas, then each skin copies
// its tile into its own 2-D canvas with drawImage. Two passes:
//
//   1. splat: every particle is a soft point sprite added into a half-res
//      float field (density in R, speed in G, tint in B)
//   2. shade: threshold the field (metaballs), take normals from its gradient
//      and light it like candy — specular glints, fresnel rim, caustics, foam,
//      a meniscus highlight, neon spill outside the surface
//
// No WebGL? A 2-D fallback draws plain blobs so nothing breaks.

const THRESH = 0.6 // field value at the liquid surface
const BULK = 3.0   // field value deep in the bulk, minus THRESH

export function rgb(hex) {
  const v = parseInt(hex.slice(1), 16)
  return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255]
}

const SPLAT_VS = `
attribute vec2 aPos;
attribute float aSize;
attribute vec2 aData;
uniform vec2 uField;
varying vec2 vData;
void main() {
  vec2 c = aPos / uField * 2.0 - 1.0;
  gl_Position = vec4(c.x, -c.y, 0.0, 1.0);
  gl_PointSize = aSize;
  vData = aData;
}`

const SPLAT_FS = `
precision mediump float;
varying vec2 vData;
uniform float uScale;
void main() {
  vec2 p = gl_PointCoord * 2.0 - 1.0;
  float r2 = dot(p, p);
  if (r2 >= 1.0) discard;
  float w = 1.0 - r2;
  w = w * w * w;
  gl_FragColor = vec4(w, w * vData.x, w * vData.y, 0.0) * uScale;
}`

const SHADE_VS = `
attribute vec2 aCorner;
uniform vec4 uRect;
uniform vec2 uCanvas;
uniform vec2 uLocalSize;
varying vec2 vAtlas;
varying vec2 vLocal;
void main() {
  vAtlas = uRect.xy + aCorner * uRect.zw;
  vLocal = aCorner * uLocalSize;
  vec2 c = vAtlas / uCanvas * 2.0 - 1.0;
  gl_Position = vec4(c.x, -c.y, 0.0, 1.0);
}`

const SHADE_FS = (precision) => `
precision ${precision} float;
uniform sampler2D uField;
uniform sampler2D uMask;
uniform float uNoMask;
uniform vec2 uFieldSize;
uniform vec2 uCanvas;
uniform vec2 uLocalSize;
uniform float uFS;
uniform float uInv;
uniform float uGradK;
uniform vec3 uColA;
uniform vec3 uColB;
uniform vec3 uGlow;
uniform float uGlowAmt;
uniform float uAlpha;
uniform float uAlphaEdge;
uniform float uCaustics;
uniform float uFoam;
uniform float uDeep;
uniform float uTime;
varying vec2 vAtlas;
varying vec2 vLocal;

const float T = ${THRESH.toFixed(3)};
const float BULK = ${BULK.toFixed(3)};

vec4 field(vec2 a) {
  vec2 f = a * uFS;
  return texture2D(uField, vec2(f.x / uFieldSize.x, 1.0 - f.y / uFieldSize.y)) * uInv;
}

// caustic web: bright ridges where three drifting sine sheets cancel out
float caustic(vec2 p, float t) {
  float v = sin(p.x + t) + sin(p.y * 1.31 - t * 0.83) + sin((p.x + p.y) * 0.71 + t * 1.27);
  float w = sin(p.x * 1.7 - p.y * 0.9 - t * 1.1) + sin(p.y * 1.9 + t * 0.7);
  v = abs(v) / 3.0;
  w = abs(w) / 2.0;
  return pow(1.0 - v, 5.0) * 0.45 + pow(1.0 - w, 7.0) * 0.3;
}

void main() {
  float mask = uNoMask > 0.5 ? 1.0 : texture2D(uMask, vAtlas / uCanvas).a;
  if (mask < 0.004) { gl_FragColor = vec4(0.0); return; }
  vec4 S = field(vAtlas);
  float f = S.r;
  if (f < 0.04) { gl_FragColor = vec4(0.0); return; }
  float e = 1.0 / uFS;
  float fl = field(vAtlas - vec2(e, 0.0)).r;
  float fr = field(vAtlas + vec2(e, 0.0)).r;
  float fu = field(vAtlas - vec2(0.0, e)).r;
  float fd = field(vAtlas + vec2(0.0, e)).r;
  vec2 g = vec2(fr - fl, fd - fu) * 0.5;

  float aa = max(length(g) * uFS, 0.015);
  float cov = smoothstep(T - aa, T + aa, f);
  float glow = uGlowAmt * smoothstep(T * 0.08, T, f) * (1.0 - cov);
  glow *= glow;

  float depth = clamp((f - T) / BULK, 0.0, 1.0);
  float inv = 1.0 / max(f, 0.001);
  float tint = clamp(S.b * inv, 0.0, 1.0);
  float speed = clamp(S.g * inv, 0.0, 1.0);
  vec3 base = mix(uColA, uColB, tint);

  // normals only near the skin of the liquid; the bulk stays glassy-flat
  vec3 n = normalize(vec3(-g * uGradK * (1.0 - smoothstep(0.08, 0.45, depth)), 1.0));
  float yy = vLocal.y / uLocalSize.y;

  float deep = clamp(depth * 0.85 + yy * 0.3, 0.0, 1.0);
  vec3 col = mix(base * 1.3 + 0.07, base * uDeep, deep);
  vec3 L = normalize(vec3(-0.5, -0.8, 0.75));
  float dif = max(dot(n, L), 0.0);
  col *= 0.72 + 0.5 * dif;
  col *= 1.0 - clamp(n.y, 0.0, 1.0) * 0.5;
  float rim = pow(1.0 - n.z, 1.4);
  col += uGlow * rim * 0.6;

  if (uCaustics > 0.0) {
    float c = caustic(vLocal * 0.055, uTime * 0.8);
    col += (uGlow * 0.6 + 0.4) * c * uCaustics * smoothstep(0.05, 0.5, depth) * (1.0 - yy * 0.6);
  }
  float band = smoothstep(T * 1.02, T * 1.3, f) * (1.0 - smoothstep(T * 1.45, T * 2.1, f));
  col = mix(col, vec3(1.0), band * clamp(-n.y * 2.2, 0.0, 1.0) * 0.65);
  col = mix(col, vec3(1.0), clamp(speed * 1.6 - 0.4, 0.0, 0.75) * (1.0 - depth) * uFoam);

  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
  float nh = max(dot(n, H), 0.0);
  float sp = (pow(nh, 70.0) * 1.4 + pow(nh, 12.0) * 0.16) * cov;

  float alpha = cov * mix(uAlphaEdge, uAlpha, smoothstep(0.0, 0.3, depth));
  vec3 rgb = col * alpha + vec3(sp) + uGlow * glow;
  float a = alpha + glow * 0.55;
  a = clamp(max(a, max(rgb.r, max(rgb.g, rgb.b))), 0.0, 1.0);
  gl_FragColor = vec4(min(rgb, vec3(a)), a) * mask;
}`

function compile(gl, type, src) {
  const sh = gl.createShader(type)
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh))
  return sh
}

function program(gl, vs, fs) {
  const p = gl.createProgram()
  gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, vs))
  gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fs))
  gl.linkProgram(p)
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p))
  const u = {}
  const nu = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS)
  for (let i = 0; i < nu; i++) {
    const name = gl.getActiveUniform(p, i).name
    u[name] = gl.getUniformLocation(p, name)
  }
  const a = {}
  const na = gl.getProgramParameter(p, gl.ACTIVE_ATTRIBUTES)
  for (let i = 0; i < na; i++) {
    const name = gl.getActiveAttrib(p, i).name
    a[name] = gl.getAttribLocation(p, name)
  }
  return { p, u, a }
}

export class Goo {
  // overlay: the canvas is shown directly instead of copied out of with
  // drawImage, so its drawing buffer need not be preserved between frames
  constructor(res, { overlay = false } = {}) {
    this.res = res
    this.overlay = overlay
    this.fieldRes = Math.min(1, res * 0.5) // field px per CSS px
    this.vessels = []
    this.canvas = document.createElement('canvas')
    this.gl = null
    try { this.initGL() } catch (err) {
      console.warn('SloshOS: WebGL liquid unavailable, using flat blobs —', err.message)
      this.gl = null
    }
    // a GPU reset loses every texture and program: rebuild them on restore
    this.lost = false
    this.canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault()
      this.lost = true
    })
    this.canvas.addEventListener('webglcontextrestored', () => {
      this.maskTex = this.fieldTex = this.fieldFb = null
      try { this.initGL() } catch (err) { this.gl = null }
      this.lost = false
      this.finalize()
    })
  }

  initGL() {
    const opts = { alpha: true, premultipliedAlpha: true, antialias: false, preserveDrawingBuffer: !this.overlay, depth: false, stencil: false }
    let gl = this.canvas.getContext('webgl2', opts)
    this.webgl2 = !!gl
    if (!gl) gl = this.canvas.getContext('webgl', opts)
    if (!gl) throw new Error('no context')
    this.gl = gl
    const hp = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT)
    this.splatProg = program(gl, SPLAT_VS, SPLAT_FS)
    this.shadeProg = program(gl, SHADE_VS, SHADE_FS(hp && hp.precision > 0 ? 'highp' : 'mediump'))
    this.pointMax = gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE)[1]
    this.maxTex = Math.min(4096, gl.getParameter(gl.MAX_TEXTURE_SIZE), gl.getParameter(gl.MAX_RENDERBUFFER_SIZE))
    this.quad = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quad)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW)
    this.pbuf = gl.createBuffer()
  }

  setRes(res) {
    this.res = res
    this.fieldRes = Math.min(1, res * 0.5)
  }

  // vessel: { fluid, w, h, inside(x, y) → sdf, look }
  add(v) {
    this.vessels.push(v)
    return v
  }

  // Pack every vessel into the atlas and bake the masks. Call after add();
  // calling again (e.g. a vessel resized) rebuilds the atlas from scratch.
  finalize() {
    const res = this.res
    const maxW = this.gl ? this.maxTex : 4096
    let x = 0, y = 0, rowH = 0, W = 0
    const order = [...this.vessels].sort((a, b) => b.h - a.h)
    for (const v of order) {
      const pad = v.pad ?? Math.ceil(v.fluid.splat * res) + 4
      const w = Math.ceil(v.w * res) + pad * 2
      const h = Math.ceil(v.h * res) + pad * 2
      if (x + w > maxW) { x = 0; y += rowH; rowH = 0 }
      v.rect = { x: x + pad, y: y + pad, w: Math.ceil(v.w * res), h: Math.ceil(v.h * res) }
      x += w
      rowH = Math.max(rowH, h)
      W = Math.max(W, x)
    }
    this.W = W
    this.H = y + rowH
    this.canvas.width = this.W
    this.canvas.height = this.H

    // masks: each vessel's inside, antialiased, at output resolution. A
    // full-coverage vessel skips the mask in the shader, so with WebGL alone
    // an atlas of only those needs no mask canvas at all.
    const needMask = !this.gl || this.vessels.some((v) => !v.full)
    const mc = document.createElement('canvas')
    mc.width = needMask ? this.W : 1
    mc.height = needMask ? this.H : 1
    const mctx = mc.getContext('2d')
    for (const v of this.vessels) {
      const { x: rx, y: ry, w, h } = v.rect
      if (v.full) {
        if (needMask) {
          mctx.fillStyle = '#fff'
          mctx.fillRect(rx, ry, w, h)
        }
        continue
      }
      const img = mctx.createImageData(w, h)
      for (let j = 0; j < h; j++) {
        for (let i = 0; i < w; i++) {
          const d = v.inside((i + 0.5) / res, (j + 0.5) / res) * res
          const c = Math.max(0, Math.min(1, 0.5 - d))
          img.data[(j * w + i) * 4 + 3] = c * 255
        }
      }
      mctx.putImageData(img, rx, ry)
      v.maskCanvas = null
    }
    this.mask = mc

    if (this.gl) this.setupTargets()
    else this.setupFallback()
  }

  setupTargets() {
    const gl = this.gl
    if (this.maskTex) gl.deleteTexture(this.maskTex)
    if (this.fieldTex) gl.deleteTexture(this.fieldTex)
    if (this.fieldFb) gl.deleteFramebuffer(this.fieldFb)
    this.maskTex = this.fieldTex = this.fieldFb = null
    this.FW = Math.ceil(this.W * (this.fieldRes / this.res))
    this.FH = Math.ceil(this.H * (this.fieldRes / this.res))

    this.maskTex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, this.maskTex)
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.mask)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    this.mask = null

    // half-float field if we can render + filter it, else 8-bit scaled down
    const tryTarget = (internal, format, type, scale) => {
      const tex = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.texImage2D(gl.TEXTURE_2D, 0, internal, this.FW, this.FH, 0, format, type, null)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      const fb = gl.createFramebuffer()
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb)
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0)
      const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      if (!ok) { gl.deleteTexture(tex); gl.deleteFramebuffer(fb); return false }
      Object.assign(this, { fieldTex: tex, fieldFb: fb, scale: scale })
      return true
    }
    let ok = false
    if (this.webgl2 && gl.getExtension('EXT_color_buffer_float')) {
      ok = tryTarget(gl.RGBA16F, gl.RGBA, gl.HALF_FLOAT, 1)
    } else if (!this.webgl2) {
      const hf = gl.getExtension('OES_texture_half_float')
      if (hf && gl.getExtension('OES_texture_half_float_linear') && gl.getExtension('EXT_color_buffer_half_float')) {
        ok = tryTarget(gl.RGBA, gl.RGBA, hf.HALF_FLOAT_OES, 1)
      }
    }
    if (!ok) tryTarget(gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, 0.2)
    this.pdata = new Float32Array(this.vessels.reduce((s, v) => s + v.fluid.max, 0) * 5)
  }

  setupFallback() {
    for (const v of this.vessels) {
      const c = document.createElement('canvas')
      c.width = v.rect.w
      c.height = v.rect.h
      const ctx = c.getContext('2d')
      ctx.drawImage(this.mask, v.rect.x, v.rect.y, v.rect.w, v.rect.h, 0, 0, v.rect.w, v.rect.h)
      v.maskCanvas = c
      v.flat = document.createElement('canvas')
      v.flat.width = v.rect.w
      v.flat.height = v.rect.h
    }
    this.mask = null
  }

  // a skin that's minimised or closed isn't drawn, so neither is its liquid
  static hidden(v) {
    return v.skin && v.skin.state !== 'open' && !v.skin.anim
  }

  render(time) {
    if (this.lost) return
    if (!this.gl) return this.renderFallback()
    const gl = this.gl
    const fs = this.fieldRes
    const fpo = this.fieldRes / this.res // field px per output px

    // ---- splat ----
    let k = 0
    const d = this.pdata
    for (const v of this.vessels) {
      if (Goo.hidden(v)) continue
      const f = v.fluid
      const ox = v.rect.x * fpo, oy = v.rect.y * fpo
      const size = Math.min(this.pointMax, f.splat * 2 * fs)
      const vs = 1 / (v.look.foamSpeed ?? 700)
      const sc = f.scale
      for (let i = 0; i < f.n; i++) {
        d[k++] = ox + f.x[i] * fs
        d[k++] = oy + f.y[i] * fs
        d[k++] = sc ? size * sc[i] : size
        d[k++] = Math.min(1, Math.hypot(f.vx[i], f.vy[i]) * vs)
        d[k++] = f.tint[i]
      }
    }
    const count = k / 5
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fieldFb)
    gl.viewport(0, 0, this.FW, this.FH)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    const sp = this.splatProg
    gl.useProgram(sp.p)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.pbuf)
    gl.bufferData(gl.ARRAY_BUFFER, d.subarray(0, k), gl.DYNAMIC_DRAW)
    gl.enableVertexAttribArray(sp.a.aPos)
    gl.vertexAttribPointer(sp.a.aPos, 2, gl.FLOAT, false, 20, 0)
    gl.enableVertexAttribArray(sp.a.aSize)
    gl.vertexAttribPointer(sp.a.aSize, 1, gl.FLOAT, false, 20, 8)
    gl.enableVertexAttribArray(sp.a.aData)
    gl.vertexAttribPointer(sp.a.aData, 2, gl.FLOAT, false, 20, 12)
    gl.uniform2f(sp.u.uField, this.FW, this.FH)
    gl.uniform1f(sp.u.uScale, this.scale)
    gl.drawArrays(gl.POINTS, 0, count)
    gl.disableVertexAttribArray(sp.a.aPos)
    gl.disableVertexAttribArray(sp.a.aSize)
    gl.disableVertexAttribArray(sp.a.aData)
    gl.disable(gl.BLEND)

    // ---- shade ----
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, this.W, this.H)
    gl.clear(gl.COLOR_BUFFER_BIT)
    const sh = this.shadeProg
    gl.useProgram(sh.p)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this.fieldTex)
    gl.uniform1i(sh.u.uField, 0)
    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, this.maskTex)
    gl.uniform1i(sh.u.uMask, 1)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quad)
    gl.enableVertexAttribArray(sh.a.aCorner)
    gl.vertexAttribPointer(sh.a.aCorner, 2, gl.FLOAT, false, 0, 0)
    gl.uniform2f(sh.u.uFieldSize, this.FW, this.FH)
    gl.uniform2f(sh.u.uCanvas, this.W, this.H)
    gl.uniform1f(sh.u.uFS, fpo)
    gl.uniform1f(sh.u.uInv, 1 / this.scale)
    gl.uniform1f(sh.u.uTime, time)
    for (const v of this.vessels) {
      if (Goo.hidden(v)) continue
      const L = v.look
      gl.uniform1f(sh.u.uNoMask, v.full ? 1 : 0)
      gl.uniform4f(sh.u.uRect, v.rect.x, v.rect.y, v.rect.w, v.rect.h)
      gl.uniform2f(sh.u.uLocalSize, v.w, v.h)
      gl.uniform1f(sh.u.uGradK, 0.8 * v.fluid.s * fs)
      gl.uniform3fv(sh.u.uColA, L.a)
      gl.uniform3fv(sh.u.uColB, L.b ?? L.a)
      gl.uniform3fv(sh.u.uGlow, L.glow ?? L.a)
      gl.uniform1f(sh.u.uGlowAmt, L.glowAmt ?? 0.35)
      gl.uniform1f(sh.u.uAlpha, L.alpha ?? 0.86)
      gl.uniform1f(sh.u.uAlphaEdge, L.alphaEdge ?? 0.95)
      gl.uniform1f(sh.u.uCaustics, L.caustics ?? 0.5)
      gl.uniform1f(sh.u.uFoam, L.foam ?? 1)
      gl.uniform1f(sh.u.uDeep, L.deep ?? 0.42)
      // a vessel can limit shading to where it knows liquid can be
      const rects = v.clip?.()
      if (rects) {
        const r = this.res
        gl.enable(gl.SCISSOR_TEST)
        for (const [x, y, w, h] of rects) {
          gl.scissor(Math.floor(v.rect.x + x * r), Math.floor(this.H - (v.rect.y + (y + h) * r)), Math.ceil(w * r), Math.ceil(h * r))
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
        }
        gl.disable(gl.SCISSOR_TEST)
      } else gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }
    gl.disableVertexAttribArray(sh.a.aCorner)
  }

  renderFallback() {
    for (const v of this.vessels) {
      if (Goo.hidden(v)) continue
      const f = v.fluid
      const c = v.flat.getContext('2d')
      const res = this.res
      c.setTransform(1, 0, 0, 1, 0, 0)
      c.globalCompositeOperation = 'source-over'
      c.clearRect(0, 0, v.flat.width, v.flat.height)
      c.setTransform(res, 0, 0, res, 0, 0)
      const [r, g, b] = v.look.a
      c.fillStyle = `rgba(${(r * 255) | 0},${(g * 255) | 0},${(b * 255) | 0},0.9)`
      c.beginPath()
      const rad = f.s * 0.85
      for (let i = 0; i < f.n; i++) {
        c.moveTo(f.x[i] + rad, f.y[i])
        c.arc(f.x[i], f.y[i], rad, 0, Math.PI * 2)
      }
      c.fill()
      c.setTransform(1, 0, 0, 1, 0, 0)
      c.globalCompositeOperation = 'destination-in'
      c.drawImage(v.maskCanvas, 0, 0)
    }
  }

  // Copy a vessel's liquid into a skin's 2-D context at (x, y) in CSS px.
  blit(ctx, v, x, y) {
    if (this.lost) return
    if (this.gl) ctx.drawImage(this.canvas, v.rect.x, v.rect.y, v.rect.w, v.rect.h, x, y, v.rect.w / this.res, v.rect.h / this.res)
    else ctx.drawImage(v.flat, x, y, v.rect.w / this.res, v.rect.h / this.res)
  }
}
