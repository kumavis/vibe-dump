// The one playhead everything reads: segment time t (s) as the listener hears it.
//
// Adapted from chimera's src/show/transport.ts (audible-playhead clock): playing, the playhead is
// the saved position plus the audible time since the source started, using the context's output
// timestamp (which already allows for output latency) or currentTime less the reported latency.
//
// Differences: one shared AudioContext for the whole show (created on the first user gesture),
// a buffer per segment on a timeline 0..duration (t = 0 is the first sample of the segment's audio;
// segments cut straight into one another), an `audioLead` (seconds of decoder delay at the head of
// the decoded mp3, skipped so t = 0 is the first real sample), and a silent mode (no AudioContext
// at all: ?mute=1, or no audio file) that runs the same timeline on performance.now().

export class Transport {
  constructor({ muted = false } = {}) {
    this.muted = muted
    this.ctx = null
    this.gain = null
    this.buffer = null
    this.src = null
    this.offset = 0 // paused position (segment time)
    this.startedAt = 0 // clock time at which `offset` was being heard
    this.playing = false
    this.duration = 0
    this.audioLead = 0
    this.epoch = 0
    this.listeners = new Set()
    this.ended = false
  }

  /** Create/resume the AudioContext. Call from inside a user gesture. */
  unlock() {
    if (this.muted) return
    if (!this.ctx) {
      try {
        this.ctx = new AudioContext({ latencyHint: 'playback' })
        this.gain = this.ctx.createGain()
        this.gain.connect(this.ctx.destination)
        this.ctx.onstatechange = () => {
          if (this.ctx.state !== 'running' && this.playing && this.ctx.state !== 'suspended') this.pause()
        }
      } catch (e) {
        console.warn('audio: no AudioContext, running silent', e)
        this.muted = true
        return
      }
    }
    this.ctx.resume().catch(() => {})
  }

  async decode(arrayBuffer) {
    if (this.muted || !this.ctx) return null
    // decodeAudioData detaches its argument: decode a copy so a cached fetch can be decoded again
    return await this.ctx.decodeAudioData(arrayBuffer.slice(0))
  }

  /** Load a segment (paused at t = 0): its decoded buffer (or null for silent) and duration. */
  load({ buffer = null, duration, audioLead = 0 }) {
    this.stopSource()
    this.buffer = this.muted ? null : buffer
    this.duration = duration
    this.audioLead = audioLead
    this.offset = 0
    this.playing = false
    this.ended = false
    this.epoch++
    this.emit()
  }

  subscribe(f) {
    this.listeners.add(f)
    return () => this.listeners.delete(f)
  }

  emit() {
    for (const f of this.listeners) f()
  }

  get isPlaying() {
    return this.playing
  }

  play() {
    if (this.playing) return
    // resuming at (or a hair before) the end: the segment is over — say so (the app moves on to the
    // next one) rather than silently starting this one again from the top
    if (this.offset >= this.duration - 0.02) {
      this.offset = this.duration
      this.ended = true
      this.emit()
      return
    }
    this.ended = false
    if (this.ctx) this.ctx.resume().catch(() => {})
    this.startSource()
    this.playing = true
    this.emit()
  }

  pause() {
    if (!this.playing) return
    this.offset = this.time()
    this.stopSource()
    this.playing = false
    this.emit()
  }

  toggle() {
    this.playing ? this.pause() : this.play()
  }

  seek(t) {
    this.offset = Math.max(0, Math.min(this.duration, t))
    this.epoch++
    this.ended = false
    if (this.playing) {
      this.stopSource()
      this.startSource()
    }
    this.emit()
  }

  /** the audible playhead, segment seconds */
  time() {
    if (!this.playing) return this.offset
    const t = this.offset + Math.max(0, this.now() - this.startedAt)
    if (t >= this.duration) {
      this.playing = false
      this.offset = this.duration
      this.ended = true
      this.stopSource()
      queueMicrotask(() => this.emit())
      return this.duration
    }
    return t
  }

  // ---------------------------------------------------------------- internals

  /** the clock: audible context time, or wall time when silent */
  now() {
    if (!this.buffer || !this.ctx) return performance.now() / 1000
    const c = this.ctx
    const ts = typeof c.getOutputTimestamp === 'function' ? c.getOutputTimestamp() : null
    if (ts && ts.contextTime !== undefined && ts.performanceTime !== undefined && ts.contextTime > 0) {
      const t = ts.contextTime + Math.max(0, (performance.now() - ts.performanceTime) / 1000)
      return Math.min(t, c.currentTime)
    }
    return c.currentTime - (c.outputLatency || c.baseLatency || 0)
  }

  startSource() {
    if (!this.buffer || !this.ctx) {
      this.startedAt = this.now()
      return
    }
    const c = this.ctx
    const src = c.createBufferSource()
    src.buffer = this.buffer
    src.connect(this.gain)
    this.src = src
    // the moment playback (re)starts, in context time; audible time catches up by the latency
    const at = c.currentTime + 0.02
    this.startedAt = at
    src.start(at, this.offset + this.audioLead)
  }

  stopSource() {
    const s = this.src
    this.src = null
    if (!s) return
    try {
      s.stop()
    } catch {}
    s.disconnect()
  }

  setVolume(v) {
    if (this.gain) this.gain.gain.value = v
  }
}
