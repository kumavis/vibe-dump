// Video mode (?video): the narrated cut, rendered offline one frame at a time.
// A capture script (video/capture.mjs) loads a cut — segments that each play
// one step from p0 to p1 under a stretch of narration, with its captions — and
// then asks for every output frame by number. Nothing here runs on the wall
// clock, so a slow software renderer still produces smooth motion.
//
// A cut: { fps, segments: [{ step, p0, p1, frames, shot?, inset?, drift?, captions: [{ t0, t1, text }] }] }
//   step    index into STEPS          p0, p1   how far through it to play
//   frames  length in frames (video/tts.py fills it in from the narration)
//   shot    a shot name, or [[u, name], ...] cues by segment progress u
//   inset   picture-in-picture for the segment: {shot, label}, a shot name, null for none,
//           or cues like shot (default: the step's own)
//   drift   degrees per second the camera orbits its target once it has arrived
//   captions  times are seconds from the segment's start

import * as THREE from 'three'
import { fmtTime, clamp } from './util.js'

const FADE = 0.22 // caption fade in/out, seconds
const SETTLE = 1.8 // seconds after a shot cue before drift starts (the longest flight)
const _axis = new THREE.Vector3(0, 1, 0)
const _off = new THREE.Vector3()

// A value, or [[u, value], ...] cues by segment progress u — with the u at
// which the current cue began.
function cue(v, u) {
  if (!Array.isArray(v)) return { value: v, from: 0 }
  let out = { value: v[0][1], from: 0 }
  for (const [from, x] of v) if (u >= from) out = { value: x, from }
  return out
}

export class VideoMode {
  // ctx: { timeline, director, camera, stages, steps, shotAt(step, p), hasShot(name),
  //        renderFrame(ms), dismissIntro(), realAt(i, p), ready }
  constructor(ctx) {
    this.ctx = ctx
    this.cut = null
    this.seg = null
    this.shot = null
    this.inset = undefined
    this.drift = 0
    this.driftAngle = 0
    this.hud = document.getElementById('vhud')
    this.cap = document.getElementById('vcap')
    this.capSpan = this.cap.querySelector('span')
    this.capText = null
    this.hudKey = ''
  }

  // Resolves once the die photograph is on the die (the first frames must not
  // show the procedural stand-in).
  ready() {
    return this.ctx.ready
  }

  load(cut) {
    const { timeline, dismissIntro, hasShot, steps } = this.ctx
    // Catch a misspelt shot or inset now, not an hour into a render.
    for (const s of cut.segments) {
      if (!steps[s.step]) throw new Error(`cut: no step ${s.step}`)
      if (!(s.frames > 0)) throw new Error(`cut: segment ${s.name || s.step} has no frames (run tts.py)`)
      for (const v of [s.shot, s.inset]) {
        const names = Array.isArray(v) ? v.map((c) => c[1]) : [v]
        for (const n of names) {
          const name = n && typeof n === 'object' ? n.shot : n
          if (name && !hasShot(name)) throw new Error(`cut: unknown shot "${name}"`)
        }
      }
    }
    dismissIntro()
    // The cut sets the step and its progress every frame; the timeline only has
    // to be "playing" so motion (packets, shader time) advances.
    timeline.speed = 0
    timeline.playing = true
    let f = 0
    for (const s of cut.segments) {
      s.first = f
      f += s.frames
    }
    this.cut = cut
    this.frames = f
    this.hud.hidden = false
    this.cap.hidden = false
    this.seek(0)
    return { total: f / cut.fps, frames: f }
  }

  // Jump to frame n without a camera flight: the director lands on the shot
  // active there, so a render can start mid-cut and still match a full one.
  seek(n) {
    const { director, steps, timeline, shotAt } = this.ctx
    this.place(n)
    const name = this.shot || shotAt(steps[this.seg.step], timeline.p)
    if (name) director.go(name, { instant: true })
    // The first frame renders paused: streams that start in it are drawn in
    // their steady state (spread along their routes) instead of filling up over
    // several seconds, and leftover packets from before are dropped.
    this.prefill = true
  }

  segAt(n) {
    const segs = this.cut.segments
    for (const s of segs) if (n < s.first + s.frames) return s
    return segs[segs.length - 1]
  }

  // Set the timeline, shot, inset, HUD and captions for frame n.
  place(n) {
    const { timeline, stages, steps, realAt } = this.ctx
    const seg = this.segAt(n)
    this.seg = seg
    const fps = this.cut.fps
    const local = (n - seg.first) / fps
    const u = clamp((n - seg.first) / seg.frames, 0, 1)
    timeline.i = seg.step
    // p never reaches 1: the timeline would advance to the next step by itself
    timeline.p = Math.min(0.9995, seg.p0 + (seg.p1 - seg.p0) * u)
    const shot = cue(seg.shot, u)
    this.shot = shot.value || null
    this.inset = 'inset' in seg ? cue(seg.inset, u).value : undefined
    // drift starts once the camera has had time to arrive at the current shot
    this.drift = seg.drift || 0
    this.driftAngle = this.drift * Math.max(0, local - (shot.from * seg.frames) / fps - SETTLE)

    // captions
    let text = ''
    let alpha = 0
    for (const c of seg.captions || []) {
      if (local >= c.t0 && local < c.t1) {
        text = c.text
        alpha = Math.min(1, (local - c.t0) / FADE, (c.t1 - local) / FADE)
      }
    }
    if (text !== this.capText) {
      this.capText = text
      this.capSpan.textContent = text
    }
    this.cap.style.opacity = text ? clamp(alpha, 0, 1) : 0

    // where we are: the stage, the CPU mode it stands for, and the boot clock
    const st = steps[seg.step]
    const stage = stages[st.stage]
    const [head, mode] = stage.long.split(' — ')
    const key = `${st.stage}`
    if (key !== this.hudKey) {
      this.hudKey = key
      this.hud.style.setProperty('--c', stage.color)
      this.hud.querySelector('.st').textContent = head
      this.hud.querySelector('.mode').textContent = mode || stage.name
    }
    const real = realAt(seg.step, timeline.p)
    this.hud.querySelector('.clk').textContent = real <= 0 ? 't = 0' : `t ≈ ${fmtTime(real)} after the power button`
  }

  // Render frame n.
  frame(n) {
    const { timeline, renderFrame } = this.ctx
    this.place(n)
    const ms = 1000 / this.cut.fps
    if (this.prefill) {
      this.prefill = false
      timeline.playing = false
      renderFrame(ms)
      timeline.playing = true
    } else renderFrame(ms)
  }

  // After the director has placed the camera: a slow orbit about the target,
  // a function of time within the segment (not accumulated frame by frame),
  // so a given frame always gets the same camera.
  afterCamera() {
    const { director, camera } = this.ctx
    if (!this.drift || director.flight || !director.current) return
    const s = director.shotFor(director.current)
    if (!s) return
    _off.subVectors(s.pos, s.target).applyAxisAngle(_axis, THREE.MathUtils.degToRad(this.driftAngle))
    camera.position.copy(s.target).add(_off)
    director.controls.target.copy(s.target)
    camera.lookAt(s.target)
  }
}
