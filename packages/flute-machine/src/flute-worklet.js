// The AudioWorklet half of the voice.
//
// This file is never imported by the app directly. It is concatenated after
// flute-dsp.js and handed to `audioWorklet.addModule` as a Blob URL, so
// everything flute-dsp.js declares is already in scope here.
//
// Two ways in:
//
//   * `processorOptions.score` — the whole performance, up front. Used for
//     offline rendering, where posting messages to a port that is being
//     drained faster than real time is a race you cannot win.
//   * `port.postMessage` — one event at a time, stamped with the frame it
//     should happen on. Used for live play.
//
// Either way events are scheduled by SAMPLE, never by wall clock, which is
// what makes an exported WAV identical to what was heard.

class FluteProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super()
    const o = options.processorOptions || {}
    this.polyphony = o.polyphony || 4
    this.engine = o.engine === 'spectral' ? SpectralFlute : JetWaveguide
    this.tone = o.tone || {}
    this.voices = []
    for (let i = 0; i < this.polyphony; i++) {
      this.voices.push(new this.engine(sampleRate, presetFor(69, this.tone)))
    }
    this.owner = new Array(this.polyphony).fill(-1)
    this.startedAt = new Array(this.polyphony).fill(-1)

    this.queue = []
    this.frame = 0
    this.done = false

    if (o.score) this.load(o.score)

    this.port.onmessage = (e) => {
      const m = e.data
      if (m.type === 'schedule') this.load(m.events)
      else if (m.type === 'tone') this.tone = m.tone
      else if (m.type === 'panic') {
        this.queue.length = 0
        for (const v of this.voices) {
          v.noteOff()
        }
      }
    }
  }

  load(events) {
    for (const ev of events) this.queue.push(ev)
    this.queue.sort((a, b) => a.on - b.on)
  }

  /**
   * Pick a voice for a note.
   *
   * A slurred note continues the most recently started voice — that is what
   * makes a trill a trill rather than a row of separate attacks. Otherwise
   * take a free voice, or steal the one that has been sounding longest, which
   * is the one least likely to be missed.
   */
  allocate(slur) {
    let newest = -1
    for (let i = 0; i < this.voices.length; i++) {
      if (!this.voices[i].isActive()) continue
      if (newest < 0 || this.startedAt[i] > this.startedAt[newest]) newest = i
    }
    if (slur && newest >= 0) return newest

    for (let i = 0; i < this.voices.length; i++) {
      if (!this.voices[i].isActive()) return i
    }
    let oldest = 0
    for (let i = 1; i < this.voices.length; i++) {
      if (this.startedAt[i] < this.startedAt[oldest]) oldest = i
    }
    return oldest
  }

  /** Fire every event whose moment has arrived. */
  fireDue(now) {
    let again = true
    while (again) {
      again = false
      for (const ev of this.queue) {
        if (ev.done) continue
        if (!ev.pending) {
          if (ev.on > now) continue
          const vi = this.allocate(ev.slur)
          const v = this.voices[vi]
          v.setPreset(presetFor(ev.midi, this.tone))
          v.noteOn(ev)
          this.owner[vi] = ev.id
          this.startedAt[vi] = ev.on
          ev.voice = vi
          ev.pending = true
          again = true
        } else if (ev.off <= now) {
          // Do not release a voice that a later note has already taken over.
          if (this.owner[ev.voice] === ev.id) this.voices[ev.voice].noteOff()
          ev.done = true
          again = true
        }
      }
    }
    if (this.queue.length > 64) this.queue = this.queue.filter((ev) => !ev.done)
    else while (this.queue.length && this.queue[0].done) this.queue.shift()
  }

  process(_inputs, outputs) {
    const out = outputs[0][0]
    if (!out) return true
    out.fill(0)

    const n = out.length
    let cursor = 0

    // Walk the quantum in sub-blocks that end on event boundaries, so a note
    // starts on the exact sample it was scheduled for rather than being
    // rounded to the nearest 128.
    while (cursor < n) {
      const now = this.frame + cursor
      this.fireDue(now)

      let next = this.frame + n
      for (const ev of this.queue) {
        if (ev.done) continue
        const at = ev.pending ? ev.off : ev.on
        if (at > now && at < next) next = at
      }

      const len = next - now
      for (const v of this.voices) {
        if (v.isActive()) v.render(out, cursor, len)
      }
      cursor += len
    }

    this.frame += n
    return true
  }
}

registerProcessor('flute-voice', FluteProcessor)
