import { createContext, program, target, dispose, bindTarget, bindTex, fullscreen } from './gl.js'
import { ROOM, roomDefines } from './room.js'
import { norm3, cross3 } from './mat.js'
import * as S from './shaders.js'

const BLOOM_LEVELS = 6
// texels a side of the square of ceiling the figure is cut into
export const COOKIE = 640

// A small tileable 3D noise for the dust in the air: two channels of value
// noise, each two octaves, wrapping at the edges so it can drift forever.
function noiseVolume(n = 64) {
  const data = new Uint8Array(n * n * n * 2)
  let seed = 9001
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  const lattice = (p) => {
    const L = new Float32Array(p * p * p)
    for (let i = 0; i < L.length; i++) L[i] = rnd()
    return L
  }
  const s = (x) => x * x * (3 - 2 * x)
  const value = (L, p, x, y, z) => {
    const fx = (x * p) / n, fy = (y * p) / n, fz = (z * p) / n
    const ix = Math.floor(fx), iy = Math.floor(fy), iz = Math.floor(fz)
    const tx = s(fx - ix), ty = s(fy - iy), tz = s(fz - iz)
    const at = (a, b, c) => L[(((c % p) + p) % p) * p * p + (((b % p) + p) % p) * p + (((a % p) + p) % p)]
    const lerp = (a, b, t) => a + (b - a) * t
    return lerp(
      lerp(lerp(at(ix, iy, iz), at(ix + 1, iy, iz), tx), lerp(at(ix, iy + 1, iz), at(ix + 1, iy + 1, iz), tx), ty),
      lerp(lerp(at(ix, iy, iz + 1), at(ix + 1, iy, iz + 1), tx), lerp(at(ix, iy + 1, iz + 1), at(ix + 1, iy + 1, iz + 1), tx), ty),
      tz,
    )
  }
  const oct = [
    [lattice(4), 4, 0.55],
    [lattice(8), 8, 0.3],
    [lattice(16), 16, 0.15],
  ]
  const oct2 = [
    [lattice(8), 8, 0.6],
    [lattice(16), 16, 0.4],
  ]
  let i = 0
  for (let z = 0; z < n; z++)
    for (let y = 0; y < n; y++)
      for (let x = 0; x < n; x++, i += 2) {
        let a = 0, b = 0
        for (const [L, p, w] of oct) a += value(L, p, x, y, z) * w
        for (const [L, p, w] of oct2) b += value(L, p, x, y, z) * w
        data[i] = Math.round(a * 255)
        data[i + 1] = Math.round(b * 255)
      }
  return { data, n }
}

// The whole frame, pass by pass. `render(frame)` takes everything that moves —
// the figure as cut into the ceiling, the camera, the sun, the clocks — and
// draws it.
export class Renderer {
  constructor(canvas, { force8 = false } = {}) {
    const ctx = createContext(canvas)
    if (!ctx) throw new Error('webgl2')
    this.gl = ctx.gl
    this.floatOk = ctx.floatOk && !force8
    const gl = this.gl
    // an extension that is there is not always a target that renders: try one
    // of each kind first, and fall back to 8 bits if either fails
    if (this.floatOk) {
      const probes = [target(gl, 4, 4, { float: true }), target(gl, 4, 4, { float: true, channels: 2 })]
      this.floatOk = probes.every((t) => t.ok)
      for (const t of probes) dispose(gl, t)
    }
    this.canvas = canvas
    this.quad = fullscreen(gl)

    const sdf = this.floatOk ? '' : '#define SDF8\n'
    const room = roomDefines()
    this.pSil = program(gl, S.vsQuad, S.fsSilhouette, sdf)
    this.pEmit = program(gl, S.vsQuad, S.fsEmitters, sdf)
    this.pHall = program(gl, S.vsQuad, S.fsHall, sdf + room)
    this.pResolve = program(gl, S.vsQuad, S.fsResolve, sdf)
    this.pDust = program(gl, injectVs(S.vsDust, sdf + room), S.fsDust)
    this.pDown = program(gl, S.vsQuad, S.fsDown, sdf)
    this.pUp = program(gl, S.vsQuad, S.fsUp)
    this.pFinal = program(gl, S.vsQuad, S.fsFinal, sdf)
    this.pAdapt = program(gl, S.vsQuad, S.fsAdapt)

    // primitive table for the silhouette shader
    this.primTex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, this.primTex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, 400, 1, 0, gl.RGBA, gl.FLOAT, null)

    this.cookie = target(gl, COOKIE, COOKIE, { float: this.floatOk, channels: this.floatOk ? 2 : 4 })
    // (8 bits is plenty for a diffuse bounce, and reads back the same everywhere)
    this.emitters = target(gl, 4, 4, { float: false, linear: false })
    // The emitters are the same for every pixel, so rather than every pixel
    // fetching all sixteen, they are read back — a frame or two late, through
    // a buffer, so nothing waits — and handed to the hall as uniforms.
    this.emitPBO = gl.createBuffer()
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, this.emitPBO)
    gl.bufferData(gl.PIXEL_PACK_BUFFER, 64, gl.STREAM_READ)
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null)
    this.emitBytes = new Uint8Array(64)
    this.emitFence = null
    this.emitRead = false
    this.patches = new Float32Array(64)
    // the eye's adaptation: one texel holding the log of how bright the frame
    // has lately been, kept from frame to frame (float targets only: it is a
    // logarithm, and can be negative)
    this.adapt = this.floatOk ? [target(gl, 1, 1, { linear: false }), target(gl, 1, 1, { linear: false })] : null
    this.adaptFlip = 0
    this.adaptFresh = true

    const { data, n } = noiseVolume(64)
    this.noise = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_3D, this.noise)
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1)
    gl.texImage3D(gl.TEXTURE_3D, 0, gl.RG8, n, n, n, 0, gl.RG, gl.UNSIGNED_BYTE, data)
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4)
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    for (const w of [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T, gl.TEXTURE_WRAP_R]) gl.texParameteri(gl.TEXTURE_3D, w, gl.REPEAT)
    gl.bindTexture(gl.TEXTURE_3D, null)

    this.initDust()
    console.info(`cenotaph: ${this.floatOk ? 'float' : '8-bit'} targets`)
    this.w = 0
    this.h = 0
    this.flip = 0
  }

  // Motes, each a fixed spot in the square of the opening and a height in
  // the hall; the shader slides it along the sun so it stays in the prism the
  // light falls through.
  initDust() {
    const gl = this.gl
    const count = 9000
    const A = new Float32Array(count * 4)
    const B = new Float32Array(count * 4)
    let seed = 4242
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
    for (let i = 0; i < count; i++) {
      A.set([rnd(), rnd(), rnd(), rnd()], i * 4)
      const fall = 0.25 + rnd() * 0.75
      const size = 0.004 + Math.pow(rnd(), 3) * 0.02
      const bright = 0.3 + Math.pow(rnd(), 2) * 1.7
      B.set([fall, size, bright, 0], i * 4)
    }
    this.dustCount = count
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

  // `pr` is canvas pixels per CSS pixel; the bloom is sized in CSS pixels so
  // its glow keeps the same reach whatever rung the governor is on.
  resize(w, h, pr = 1) {
    if (w === this.w && h === this.h && pr === this.pr) return false
    const gl = this.gl
    this.w = w
    this.h = h
    this.pr = pr
    for (const t of [this.cur, this.dust, ...(this.hist ?? []), ...(this.bloom ?? [])]) dispose(gl, t)
    const f = { float: this.floatOk }
    this.cur = target(gl, w, h, { float: this.floatOk, linear: false })
    this.hist = [target(gl, w, h, f), target(gl, w, h, f)]
    this.dust = target(gl, w, h, f)
    this.bloom = []
    let bw = w / pr, bh = h / pr
    for (let i = 0; i < BLOOM_LEVELS; i++) {
      bw = Math.max(1, Math.ceil(bw / 2))
      bh = Math.max(1, Math.ceil(bh / 2))
      this.bloom.push(target(gl, bw, bh, f))
    }
    return true
  }

  // the uniforms every pass that knows about the hall shares
  hallUniforms(u, F) {
    const gl = this.gl
    gl.uniform2f(u.uCookieRot, Math.cos(F.cookieRot), Math.sin(F.cookieRot))
    gl.uniform1f(u.uCookieM, F.cookieM)
    gl.uniform3fv(u.uSun, F.sun)
    gl.uniform2f(u.uSunXZ, F.sun[0] / F.sun[1], F.sun[2] / F.sun[1])
    gl.uniform3fv(u.uSunColor, F.palette.sun)
    gl.uniform3fv(u.uSkyColor, F.palette.sky)
    gl.uniform3fv(u.uFogColor, F.palette.fog)
    gl.uniform4fv(u.uBeamBox, F.beamBox)
    // a frame square to the sun, for the dust
    const L = F.sun
    const b = norm3(cross3(L, [0, 0, 1]))
    gl.uniform3fv(u.uBeamB, b)
    gl.uniform3fv(u.uBeamC, cross3(L, b))
    gl.uniform1f(u.uTime, F.story)
    gl.uniform1f(u.uDrift, F.drift)
    const t = F.tune
    gl.uniform3f(u.uFog, t.fogBase, t.fogLow, t.fogHeight)
    gl.uniform4f(u.uDust, t.dustFloor, t.dustAmount, t.dustLo, t.dustHi)
    gl.uniform2f(u.uDustScale, t.dustAcross, t.dustAlong)
    gl.uniform1f(u.uPhaseG, t.phaseG)
    gl.uniform1f(u.uSunSpread, t.spread)
    gl.uniform1f(u.uBounceGain, t.bounce)
    gl.uniform4f(u.uFloor, t.polish, t.roughLo, t.roughHi, t.floorAlbedo)
  }

  camUniforms(u, cam) {
    const gl = this.gl
    const R = cam.R
    gl.uniform3fv(u.uCamPos, cam.pos)
    gl.uniform3f(u.uRight, R[0], R[1], R[2])
    gl.uniform3f(u.uUp, R[3], R[4], R[5])
    gl.uniform3f(u.uFwd, -R[6], -R[7], -R[8])
    gl.uniform1f(u.uFocal, cam.focal)
    gl.uniform1f(u.uAspect, this.w / this.h)
  }

  // The sixteen cells of the opening as patches of light: where each one's
  // open part is, under this frame's turn of the opening, and how big. The
  // sunlit floor shines with the sun's light at that angle, through the haze,
  // off concrete of albedo 0.24.
  emitUniforms(u, F) {
    const gl = this.gl
    const b = this.emitBytes
    const span = ROOM.HOLE_SPAN
    const c = Math.cos(F.cookieRot), s = Math.sin(F.cookieRot)
    let n = 0, ax = 0, az = 0, area = 0
    for (let i = 0; i < 16; i++) {
      const A = (b[i * 4] / 255) * (span / 4) ** 2
      if (A < 0.01) continue
      const lx = (((i & 3) + b[i * 4 + 1] / 255) / 4 - 0.5) * span
      const lz = (((i >> 2) + b[i * 4 + 2] / 255) / 4 - 0.5) * span
      const x = ROOM.HOLE_X + c * lx - s * lz
      const z = ROOM.HOLE_Z + s * lx + c * lz
      this.patches.set([x, z, A, 0], n * 4)
      n++
      ax += x * A
      az += z * A
      area += A
    }
    const [sx, sy, sz] = F.sun
    const X = area > 0 ? ax / area : ROOM.HOLE_X, Z = area > 0 ? az / area : ROOM.HOLE_Z
    gl.uniform4fv(u.uPatch, this.patches)
    gl.uniform1i(u.uPatchN, n)
    gl.uniform3f(u.uSkyC, X, ROOM.H, Z)
    gl.uniform3f(u.uPoolC, X - (sx / sy) * ROOM.H, 0, Z - (sz / sy) * ROOM.H)
    gl.uniform1f(u.uArea, area)
    const t = F.tune, H = ROOM.H, HF = t.fogHeight
    const tau = (t.fogBase * H) / sy + t.fogLow * (HF / sy) * (1 - Math.exp(-H / HF))
    const k = ((sy * 0.24) / Math.PI) * Math.exp(-tau)
    gl.uniform3f(u.uPoolRad, F.palette.sun[0] * k, F.palette.sun[1] * k, F.palette.sun[2] * k)
  }

  // Run a pass once for the whole frame, or, comparing two tunings side by
  // side, once for each side under a scissor. F.sides lists each side's span
  // across the frame (0..1) and the tuning, palette and exposure it shows.
  eachSide(F, width, height, draw) {
    const gl = this.gl
    const sides = F.sides?.length ? F.sides : [{}]
    if (sides.length === 1) return draw({ ...F, ...sides[0] })
    gl.enable(gl.SCISSOR_TEST)
    for (const side of sides) {
      const a = Math.round(side.x0 * width), b = Math.round(side.x1 * width)
      gl.scissor(a, 0, b - a, height)
      draw({ ...F, ...side })
    }
    gl.disable(gl.SCISSOR_TEST)
  }

  render(F) {
    const gl = this.gl
    const { w, h } = this
    const fig = F.figure

    // the emitters read back on an earlier frame, if they have arrived
    if (this.emitFence && gl.clientWaitSync(this.emitFence, 0, 0) !== gl.TIMEOUT_EXPIRED) {
      gl.deleteSync(this.emitFence)
      this.emitFence = null
      gl.bindBuffer(gl.PIXEL_PACK_BUFFER, this.emitPBO)
      gl.getBufferSubData(gl.PIXEL_PACK_BUFFER, 0, this.emitBytes)
      gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null)
    }

    // 1 · the figure, flat, cut into the ceiling
    gl.bindTexture(gl.TEXTURE_2D, this.primTex)
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, fig.count * 2, 1, gl.RGBA, gl.FLOAT, fig.data, 0)
    bindTarget(gl, this.cookie)
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
    this.quad()

    // 2 · the opening as sixteen patches of light
    bindTarget(gl, this.emitters)
    gl.useProgram(this.pEmit.p)
    bindTex(gl, 0, this.cookie.tex, this.pEmit.u.uCookie)
    this.quad()
    // the first frame reads at once, so the hall never starts unlit; after
    // that, through the buffer, a frame or two behind
    if (!this.emitRead) {
      gl.readPixels(0, 0, 4, 4, gl.RGBA, gl.UNSIGNED_BYTE, this.emitBytes)
      this.emitRead = true
    } else if (!this.emitFence) {
      gl.bindBuffer(gl.PIXEL_PACK_BUFFER, this.emitPBO)
      gl.readPixels(0, 0, 4, 4, gl.RGBA, gl.UNSIGNED_BYTE, 0)
      gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null)
      this.emitFence = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0)
    }

    // 3 · the hall
    bindTarget(gl, this.cur)
    gl.useProgram(this.pHall.p)
    let u = this.pHall.u
    bindTex(gl, 0, this.cookie.tex, u.uCookie)
    gl.activeTexture(gl.TEXTURE2)
    gl.bindTexture(gl.TEXTURE_3D, this.noise)
    gl.uniform1i(u.uNoise, 2)
    this.camUniforms(u, F.cam)
    gl.uniform2f(u.uRes, w, h)
    gl.uniform2f(u.uJitter, F.jitter[0], F.jitter[1])
    gl.uniform1i(u.uFrame, F.frame)
    gl.uniform1i(u.uSteps, F.steps)
    gl.uniform1i(u.uReflSteps, F.reflSteps)
    this.eachSide(F, w, h, (S) => {
      this.emitUniforms(u, S)
      this.hallUniforms(u, S)
      this.quad()
    })
    gl.activeTexture(gl.TEXTURE2)
    gl.bindTexture(gl.TEXTURE_3D, null)

    // 4 · resolve into the history
    const prev = this.hist[this.flip], next = this.hist[1 - this.flip]
    this.flip = 1 - this.flip
    bindTarget(gl, next)
    gl.useProgram(this.pResolve.p)
    u = this.pResolve.u
    bindTex(gl, 0, this.cur.tex, u.uCur)
    bindTex(gl, 1, prev.tex, u.uHist)
    this.camUniforms(u, F.cam)
    gl.uniform2f(u.uRes, w, h)
    gl.uniformMatrix4fv(u.uPrevViewProj, false, F.prevViewProj)
    gl.uniform1f(u.uBlend, F.blend)
    gl.uniform1f(u.uValid, F.histValid ? 1 : 0)
    this.quad()
    const scene = next

    // 5 · dust, on a layer of its own so the history never smears it
    bindTarget(gl, this.dust)
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE)
    gl.useProgram(this.pDust.p)
    u = this.pDust.u
    bindTex(gl, 0, this.cookie.tex, u.uCookie)
    bindTex(gl, 3, this.cur.tex, u.uScene)
    gl.uniformMatrix4fv(u.uViewProj, false, F.cam.viewProj())
    gl.uniform2f(u.uRes, w, h)
    gl.uniform1f(u.uFall, F.dustFall)
    gl.uniform1f(u.uShutter, F.shutter)
    gl.uniform3fv(u.uCamPos, F.cam.pos)
    gl.uniform1f(u.uPxPerUnit, F.cam.pxPerUnit)
    gl.uniform1f(u.uFocus, F.focus)
    gl.bindVertexArray(this.vao)
    this.eachSide(F, w, h, (S) => {
      this.hallUniforms(u, S)
      gl.uniform1f(u.uMoteGlow, S.tune.moteGlow)
      gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, S.dust ? Math.round(this.dustCount * S.tune.motes) : 0)
    })
    gl.bindVertexArray(null)
    gl.disable(gl.BLEND)

    // 6 · bloom
    gl.useProgram(this.pDown.p)
    let src = scene
    for (const t of this.bloom) {
      bindTarget(gl, t)
      bindTex(gl, 0, src.tex, this.pDown.u.uSrc)
      // the first step can shrink by more than 2x (when supersampling); widen
      // its taps to match so nothing between them is skipped
      const spread = Math.max(1, src.w / t.w / 2)
      gl.uniform2f(this.pDown.u.uTexel, spread / src.w, spread / src.h)
      gl.uniform1i(this.pDown.u.uFirst, src === scene ? 1 : 0)
      this.quad()
      src = t
    }
    // how bright the frame is, from the smallest level, before the up chain
    // adds into the levels above it; the eye eases toward that
    let adapted = null
    if (this.adapt) {
      const a0 = this.adapt[this.adaptFlip], a1 = this.adapt[1 - this.adaptFlip]
      this.adaptFlip = 1 - this.adaptFlip
      bindTarget(gl, a1)
      gl.useProgram(this.pAdapt.p)
      bindTex(gl, 0, this.bloom[this.bloom.length - 1].tex, this.pAdapt.u.uSrc)
      bindTex(gl, 1, a0.tex, this.pAdapt.u.uPrev)
      gl.uniform1f(this.pAdapt.u.uDt, this.adaptFresh ? -1 : F.dt)
      this.quad()
      this.adaptFresh = false
      adapted = a1
    }
    // each coarser level adds in at a little over half the weight of the one
    // above it, so the glow stays near what glows instead of greying the hall
    gl.useProgram(this.pUp.p)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.CONSTANT_COLOR, gl.ONE)
    gl.blendColor(0.55, 0.55, 0.55, 1)
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
    bindTex(gl, 0, scene.tex, u.uScene)
    bindTex(gl, 1, this.bloom[0].tex, u.uBloom)
    bindTex(gl, 2, this.cookie.tex, u.uCookie)
    bindTex(gl, 3, this.dust.tex, u.uDust)
    bindTex(gl, 4, (adapted ?? this.cookie).tex, u.uAdapt)
    gl.uniform1i(u.uAdaptOn, adapted ? 1 : 0)
    gl.uniform1f(u.uKey, F.adaptKey)
    gl.uniform2f(u.uRes, w, h)
    gl.uniform1f(u.uTime, F.wall)
    gl.uniform1f(u.uFade, F.fade)
    gl.uniform1f(u.uPx, F.pr ?? 1)
    gl.uniform1i(u.uDebug, F.debug ? 1 : 0)
    this.eachSide(F, gl.drawingBufferWidth, gl.drawingBufferHeight, (S) => {
      gl.uniform1f(u.uExposure, S.exposure)
      gl.uniform1f(u.uBloomAmt, S.tune.bloom)
      gl.uniform1f(u.uGrain, S.tune.grain)
      gl.uniform1f(u.uFringe, S.tune.fringe)
      this.quad()
    })
    if (F.logAdapt && adapted) {
      bindTarget(gl, adapted)
      const px = new Float32Array(4)
      gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.FLOAT, px)
      bindTarget(gl, null)
      console.info(`cenotaph: adapted log luminance ${px[0].toFixed(3)}`)
    }
  }
}

// defines go straight after the #version line, in a vertex shader too
function injectVs(src, defines) {
  const nl = src.indexOf('\n')
  return src.slice(0, nl + 1) + defines + src.slice(nl + 1)
}
