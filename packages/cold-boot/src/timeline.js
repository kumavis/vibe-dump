// Playback state for the walkthrough: which step we're on, how far through it,
// and whether it's playing. Steps own their own duration (seconds of animation
// at 1x) and their own real-world time span, which the clock interpolates
// logarithmically — a step that covers 400 ns and one that covers 30 s get
// comparable screen time, and the clock shows how wildly they differ.

export class Timeline {
  constructor(steps) {
    this.steps = steps
    this.i = 0
    this.p = 0
    this.playing = false
    this.speed = 1
    this.listeners = new Set()
    this.total = steps.reduce((s, st) => s + st.dur, 0)
    let acc = 0
    this.starts = steps.map((st) => {
      const a = acc
      acc += st.dur
      return a
    })
  }
  on(fn) {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }
  emit(kind) {
    for (const fn of this.listeners) fn(kind, this)
  }
  get step() {
    return this.steps[this.i]
  }
  update(dt) {
    if (!this.playing) return
    const st = this.step
    this.p += (dt * this.speed) / st.dur
    if (this.p >= 1) {
      if (st.hold) {
        // A step can ask to hold at its end (e.g. the final one).
        this.p = 1
        this.playing = false
        this.emit('pause')
      } else if (this.i < this.steps.length - 1) {
        this.i++
        this.p = 0
        this.emit('step')
      } else {
        this.p = 1
        this.playing = false
        this.emit('pause')
      }
    }
  }
  go(i, p = 0) {
    const ni = Math.max(0, Math.min(this.steps.length - 1, i))
    const changed = ni !== this.i
    this.i = ni
    this.p = Math.max(0, Math.min(1, p))
    if (changed) this.emit('step')
    this.emit('seek')
  }
  next() {
    if (this.i < this.steps.length - 1) this.go(this.i + 1)
    else this.go(this.i, 1)
  }
  prev() {
    // First press rewinds to the start of the step; a second goes back one.
    if (this.p > 0.08) this.go(this.i, 0)
    else this.go(this.i - 1)
  }
  play() {
    if (this.i === this.steps.length - 1 && this.p >= 1) this.go(0)
    this.playing = true
    this.emit('play')
  }
  pause() {
    this.playing = false
    this.emit('pause')
  }
  toggle() {
    if (this.playing) this.pause()
    else this.play()
  }
  // Global position 0..1 across the whole walkthrough (for the scrubber).
  get global() {
    return (this.starts[this.i] + this.p * this.step.dur) / this.total
  }
  seekGlobal(f) {
    const t = Math.max(0, Math.min(1, f)) * this.total
    let i = this.steps.length - 1
    for (let k = 0; k < this.steps.length; k++) {
      if (t < this.starts[k] + this.steps[k].dur) {
        i = k
        break
      }
    }
    this.go(i, (t - this.starts[i]) / this.steps[i].dur)
  }
  // Real-world seconds since the power button for the current position.
  realTime() {
    const st = this.step
    const [a, b] = st.t || [0, 0]
    if (a <= 0 || b <= 0 || b <= a) return a + (b - a) * this.p
    return a * Math.pow(b / a, this.p)
  }
}
