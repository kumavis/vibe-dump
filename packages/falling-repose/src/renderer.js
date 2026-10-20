import { createContext, program, target, dispose, bindTarget, bindTex, fullscreen } from './gl.js'
import * as S from './shaders.js'

const BLOOM_LEVELS = 5

// The whole frame, pass by pass. `render(frame)` takes everything that moves —
// the projected figure, the camera, the clocks, the palette — and draws it.
export class Renderer {
  constructor(canvas, { force8 = false } = {}) {
    const ctx = createContext(canvas)
    if (!ctx) throw new Error('webgl2')
    this.gl = ctx.gl
    this.floatOk = ctx.floatOk && !force8
    const gl = this.gl
    this.canvas = canvas
    this.quad = fullscreen(gl)

    const defs = this.floatOk ? '' : '#define SDF8\n'
    this.pSil = program(gl, S.vsQuad, S.fsSilhouette, defs)
    this.pEmit = program(gl, S.vsQuad, S.fsEmit, defs)
    this.pRadial = program(gl, S.vsQuad, S.fsRadial)
    this.pHaze = program(gl, S.vsQuad, S.fsHaze)
    this.pScene = program(gl, S.vsQuad, S.fsScene, defs)
    this.pPart = program(gl, S.vsParticles, S.fsParticles, defs)
    this.pDown = program(gl, S.vsQuad, S.fsDown)
    this.pUp = program(gl, S.vsQuad, S.fsUp)
    this.pFinal = program(gl, S.vsQuad, S.fsFinal, defs)

    // primitive table for the silhouette shader
    this.primTex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, this.primTex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, 400, 1, 0, gl.RGBA, gl.FLOAT, null)

    this.initParticles()
    console.info(`falling-repose: ${this.floatOk ? 'float' : '8-bit'} targets`)
    this.w = 0
    this.h = 0
  }

  // Three layers of motes, each wrapping round its own box ahead of the camera
  // (see vsParticles). Box heights divide 120 so the fall can be reduced mod
  // 960 without a jump; the layer is the instance's `kind`.
  initParticles() {
    const gl = this.gl
    this.layers = [
      { count: 4600, size: [14, 10, 14], ahead: 6 }, // near motes
      { count: 40, size: [4, 4, 4], ahead: 2.9 }, // soft discs near the lens
      { count: 5200, size: [36, 24, 36], ahead: 14 }, // wide and sparse, for far out
    ]
    const total = this.layers.reduce((n, l) => n + l.count, 0)
    const A = new Float32Array(total * 4)
    const B = new Float32Array(total * 4)
    let seed = 12345
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
    let i = 0
    this.layers.forEach((layer, kind) => {
      for (let k = 0; k < layer.count; k++, i++) {
        A.set([rnd(), rnd(), rnd(), rnd()], i * 4)
        // rise speed is a whole number of eighths
        const speed = (5 + Math.floor(rnd() * 8)) / 8
        const size =
          kind === 1 ? 0.004 + rnd() * 0.006 : kind === 2 ? 0.005 + Math.pow(rnd(), 2) * 0.012 : 0.0025 + Math.pow(rnd(), 3) * 0.006
        const bright = kind === 1 ? 0.5 + rnd() * 0.5 : 0.35 + Math.pow(rnd(), 2) * 1.4
        B.set([speed, size, bright, kind], i * 4)
      }
    })
    this.particleTotal = total
    this.vao = gl.createVertexArray()
    gl.bindVertexArray(this.vao)
    const corner = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, corner)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
    for (const [loc, data] of [
      [1, A],
      [2, B],
    ]) {
      const buf = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buf)
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
      gl.enableVertexAttribArray(loc)
      gl.vertexAttribPointer(loc, 4, gl.FLOAT, false, 0, 0)
      gl.vertexAttribDivisor(loc, 1)
    }
    gl.bindVertexArray(null)
  }

  // `sdfDiv` is how many pixels share one texel of the silhouette's distance
  // field: 1 at full quality, 2 when the frame-rate governor needs it back.
  // `pr` is canvas pixels per CSS pixel; the bloom is sized in CSS pixels so
  // its glow keeps the same reach whatever rung the governor is on.
  resize(w, h, sdfDiv = 2, pr = 1) {
    if (w === this.w && h === this.h && sdfDiv === this.sdfDiv && pr === this.pr) return
    const gl = this.gl
    this.w = w
    this.h = h
    this.sdfDiv = sdfDiv
    this.pr = pr
    for (const t of [this.sdf, this.emit, this.ra, this.rb, this.haze, this.scene, ...(this.bloom ?? [])]) dispose(gl, t)
    const hw = Math.max(1, Math.ceil(w / 2)), hh = Math.max(1, Math.ceil(h / 2))
    const f = { float: this.floatOk }
    this.sdf = target(gl, Math.max(1, Math.ceil(w / sdfDiv)), Math.max(1, Math.ceil(h / sdfDiv)), {
      float: this.floatOk,
      channels: this.floatOk ? 2 : 4,
    })
    this.emit = target(gl, hw, hh, f)
    this.ra = target(gl, hw, hh, f)
    this.rb = target(gl, hw, hh, f)
    this.haze = target(gl, Math.max(1, Math.ceil(w / 4)), Math.max(1, Math.ceil(h / 4)), f)
    this.scene = target(gl, w, h, f)
    this.bloom = []
    let bw = w / pr, bh = h / pr
    for (let i = 0; i < BLOOM_LEVELS; i++) {
      bw = Math.max(1, Math.ceil(bw / 2))
      bh = Math.max(1, Math.ceil(bh / 2))
      this.bloom.push(target(gl, bw, bh, f))
    }
  }

  render(F) {
    const gl = this.gl
    const { w, h } = this
    const fig = F.figure

    // 1 · silhouette
    gl.bindTexture(gl.TEXTURE_2D, this.primTex)
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, fig.count * 2, 1, gl.RGBA, gl.FLOAT, fig.data, 0)
    bindTarget(gl, this.sdf)
    gl.useProgram(this.pSil.p)
    bindTex(gl, 0, this.primTex, this.pSil.u.uPrims)
    const G = new Float32Array(48), Rg = new Int32Array(24)
    fig.groups.slice(0, 12).forEach((g, i) => {
      G.set([g.cx, g.cy, g.r, g.k + 2], i * 4)
      Rg.set([g.start, g.count], i * 2)
    })
    gl.uniform4fv(this.pSil.u.uGroups, G)
    gl.uniform2iv(this.pSil.u.uRanges, Rg)
    gl.uniform1i(this.pSil.u.uGroupCount, Math.min(12, fig.groups.length))
    gl.uniform2f(this.pSil.u.uScale, w / this.sdf.w, h / this.sdf.h)
    this.quad()

    // 2 · emission
    const light = F.lightPx
    bindTarget(gl, this.emit)
    let u = this.pEmit.u
    gl.useProgram(this.pEmit.p)
    bindTex(gl, 0, this.sdf.tex, u.uSdf)
    gl.uniform2f(u.uRes, w, h)
    gl.uniform2f(u.uLight, light[0], light[1])
    gl.uniform1f(u.uPxPerM, fig.pxPerM)
    gl.uniform1f(u.uTime, F.story)
    gl.uniform1f(u.uDrift, F.drift)
    gl.uniform3fv(u.uCore, F.palette.core)
    gl.uniform3fv(u.uHalo, F.palette.halo)
    gl.uniform1f(u.uSwell, F.swell)
    this.quad()

    // 3 · radial scatter, three passes
    gl.useProgram(this.pRadial.p)
    u = this.pRadial.u
    gl.uniform2f(u.uCenter, light[0] / w, light[1] / h)
    gl.uniform3fv(u.uAtten, F.palette.atten)
    const N = 10, L = 0.92
    const steps = [L / (N * N * N), L / (N * N), L / N]
    let src = this.emit, dst = this.ra
    for (let i = 0; i < 3; i++) {
      bindTarget(gl, dst)
      bindTex(gl, 0, src.tex, u.uSrc)
      gl.uniform1f(u.uStep, steps[i])
      this.quad()
      src = dst
      dst = dst === this.ra ? this.rb : this.ra
    }
    const scatter = src

    // 4 · haze fields, then the scene
    bindTarget(gl, this.haze)
    gl.useProgram(this.pHaze.p)
    u = this.pHaze.u
    gl.uniform2f(u.uRes, w, h)
    gl.uniform2f(u.uLight, light[0], light[1])
    gl.uniform1f(u.uPxPerM, fig.pxPerM)
    gl.uniform1f(u.uTime, F.story)
    gl.uniform1f(u.uDrift, F.drift)
    this.quad()

    bindTarget(gl, this.scene)
    gl.useProgram(this.pScene.p)
    u = this.pScene.u
    bindTex(gl, 0, this.sdf.tex, u.uSdf)
    bindTex(gl, 1, scatter.tex, u.uScatter)
    bindTex(gl, 2, this.emit.tex, u.uEmit)
    bindTex(gl, 3, this.haze.tex, u.uHaze)
    gl.uniform2f(u.uRes, w, h)
    gl.uniform2f(u.uLight, light[0], light[1])
    gl.uniform1f(u.uPxPerM, fig.pxPerM)
    gl.uniform1f(u.uExposure, F.exposure)
    gl.uniform3fv(u.uBgTop, F.palette.bgTop)
    gl.uniform3fv(u.uBgBot, F.palette.bgBot)
    gl.uniform3fv(u.uHalo, F.palette.halo)
    gl.uniform3fv(u.uSky, F.palette.sky)
    gl.uniform1f(u.uAA, 1.0)
    this.quad()

    // 5 · particles, additive over the scene
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE)
    gl.useProgram(this.pPart.p)
    u = this.pPart.u
    gl.uniformMatrix4fv(u.uViewProj, false, F.cam.viewProj())
    gl.uniform2f(u.uRes, w, h)
    gl.uniform1f(u.uFall, F.fallSmall)
    gl.uniform1f(u.uShutter, F.shutter)
    gl.uniform1f(u.uTime, F.story)
    const sizes = [], centers = []
    const fwd = F.cam.forward()
    for (const l of this.layers) {
      sizes.push(...l.size)
      centers.push(...F.cam.pos.map((c, k) => c + fwd[k] * l.ahead))
    }
    gl.uniform3fv(u.uBoxSize, sizes)
    gl.uniform3fv(u.uBoxCenter, centers)
    gl.uniform1f(u.uFocus, F.focus)
    gl.uniform1f(u.uAperture, F.aperture)
    gl.uniform1f(u.uPxPerUnit, F.cam.pxPerUnit)
    gl.uniform1f(u.uFigureDepth, F.focus)
    gl.uniform1f(u.uExposure, F.exposure)
    gl.uniform1f(u.uAA, 1.0)
    bindTex(gl, 0, this.sdf.tex, u.uSdf)
    bindTex(gl, 1, scatter.tex, u.uScatter)
    gl.bindVertexArray(this.vao)
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, this.particleTotal)
    gl.bindVertexArray(null)
    gl.disable(gl.BLEND)

    // 6 · bloom
    gl.useProgram(this.pDown.p)
    let prev = this.scene
    for (const t of this.bloom) {
      bindTarget(gl, t)
      bindTex(gl, 0, prev.tex, this.pDown.u.uSrc)
      // the first step can shrink by more than 2x (when supersampling); widen
      // its taps to match so nothing between them is skipped
      const spread = Math.max(1, prev.w / t.w / 2)
      gl.uniform2f(this.pDown.u.uTexel, spread / prev.w, spread / prev.h)
      this.quad()
      prev = t
    }
    gl.useProgram(this.pUp.p)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE)
    for (let i = this.bloom.length - 1; i > 0; i--) {
      const from = this.bloom[i], to = this.bloom[i - 1]
      bindTarget(gl, to)
      bindTex(gl, 0, from.tex, this.pUp.u.uSrc)
      gl.uniform2f(this.pUp.u.uTexel, 1 / from.w, 1 / from.h)
      this.quad()
    }
    gl.disable(gl.BLEND)

    // 7 · final
    bindTarget(gl, null)
    gl.useProgram(this.pFinal.p)
    u = this.pFinal.u
    bindTex(gl, 0, this.scene.tex, u.uScene)
    bindTex(gl, 1, this.bloom[0].tex, u.uBloom)
    bindTex(gl, 2, this.sdf.tex, u.uSdf)
    gl.uniform2f(u.uRes, w, h)
    gl.uniform1f(u.uTime, F.wall)
    gl.uniform1f(u.uFade, F.fade)
    gl.uniform1f(u.uBloomAmt, F.bloom)
    gl.uniform1f(u.uGrain, 0.035)
    gl.uniform1f(u.uPx, F.pr ?? 1)
    gl.uniform1i(u.uDebug, F.debug ? 1 : 0)
    this.quad()
  }
}
