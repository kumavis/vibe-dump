// A very small WebGL2 toolkit: compile programs, make render targets, draw a
// fullscreen triangle. Everything else in the piece is shaders.

export function createContext(canvas) {
  const gl = canvas.getContext('webgl2', {
    antialias: false,
    alpha: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: false,
    powerPreference: 'high-performance',
  })
  if (!gl) return null
  // Half-float render targets carry the HDR light and the signed distance
  // field. EXT_color_buffer_float is the WebGL2 way; some mobile GPUs only
  // expose the half-float variant. Without either we fall back to 8-bit and
  // encode, which costs precision but still draws.
  const floatOk = !!(gl.getExtension('EXT_color_buffer_float') || gl.getExtension('EXT_color_buffer_half_float'))
  gl.getExtension('OES_texture_float_linear')
  return { gl, floatOk }
}

function compile(gl, type, src) {
  const sh = gl.createShader(type)
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh)
    const numbered = src
      .split('\n')
      .map((l, i) => `${String(i + 1).padStart(3)} ${l}`)
      .join('\n')
    throw new Error(`shader compile failed:\n${log}\n${numbered}`)
  }
  return sh
}

export function program(gl, vsSrc, fsSrc, defines = '') {
  if (defines) {
    // defines go straight after the #version line
    const nl = fsSrc.indexOf('\n')
    fsSrc = fsSrc.slice(0, nl + 1) + defines + fsSrc.slice(nl + 1)
  }
  const p = gl.createProgram()
  gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, vsSrc))
  gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, fsSrc))
  gl.linkProgram(p)
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(`link failed: ${gl.getProgramInfoLog(p)}`)
  const uniforms = {}
  const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS)
  for (let i = 0; i < n; i++) {
    const info = gl.getActiveUniform(p, i)
    const name = info.name.replace(/\[0\]$/, '')
    uniforms[name] = gl.getUniformLocation(p, info.name)
  }
  return { p, u: uniforms }
}

// A colour target with its framebuffer. `linear` picks the filter; every
// target clamps at the edges so radial blurs that walk off-screen read black-ish
// edge texels rather than wrapping round to the other side.
export function target(gl, w, h, { float = true, linear = true, channels = 4 } = {}) {
  const tex = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, tex)
  let internal, format, type
  if (float) {
    internal = channels === 2 ? gl.RG16F : gl.RGBA16F
    format = channels === 2 ? gl.RG : gl.RGBA
    type = gl.HALF_FLOAT
  } else {
    internal = gl.RGBA8
    format = gl.RGBA
    type = gl.UNSIGNED_BYTE
  }
  gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, type, null)
  const f = linear ? gl.LINEAR : gl.NEAREST
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, f)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, f)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  const fbo = gl.createFramebuffer()
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0)
  const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  return { tex, fbo, w, h, ok }
}

export function dispose(gl, t) {
  if (!t) return
  gl.deleteTexture(t.tex)
  gl.deleteFramebuffer(t.fbo)
}

export function bindTarget(gl, t) {
  if (t) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo)
    gl.viewport(0, 0, t.w, t.h)
  } else {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
  }
}

export function bindTex(gl, unit, tex, loc) {
  gl.activeTexture(gl.TEXTURE0 + unit)
  gl.bindTexture(gl.TEXTURE_2D, tex)
  if (loc) gl.uniform1i(loc, unit)
}

// The fullscreen triangle needs no buffer — the vertex shader conjures it from
// gl_VertexID — but WebGL still wants a VAO bound.
export function fullscreen(gl) {
  const vao = gl.createVertexArray()
  return () => {
    gl.bindVertexArray(vao)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }
}
