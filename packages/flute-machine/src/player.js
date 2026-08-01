// The player: pulls phrases out of the improviser and feeds them to the
// engine, staying a couple of seconds ahead of the clock.
//
// It also records. Everything it schedules is appended to a score, which is
// what gets saved as JSON, exported as MIDI, and re-rendered as WAV — so the
// file is a transcript of what actually happened rather than a promise that
// re-running the generator will produce it again.

import { Improviser } from './generator.js'

const LOOKAHEAD = 2.5 // seconds of music kept queued ahead of the clock
const TICK = 120 // ms between scheduler wakeups

export class Player {
  constructor(engine) {
    this.engine = engine
    this.improviser = null
    this.timer = null
    this.playing = false
    this.startedAt = 0
    this.cursor = 0 // seconds of music emitted so far, relative to startedAt
    this.score = []
    this.phrasesLeft = Infinity
    this.onPhrase = null
    this.onStop = null
    this.playbackNotes = null // when replaying a loaded score
    this.playbackIndex = 0
  }

  get elapsed() {
    return this.playing ? this.engine.currentTime - this.startedAt : 0
  }

  get scoreDuration() {
    return this.score.reduce((m, n) => Math.max(m, n.t + n.d), 0)
  }

  /** Start improvising. `mode` 'endless' plays until stopped; 'burst' stops. */
  start(settings, seed, { record = true } = {}) {
    this.stop({ silent: true })
    this.improviser = new Improviser(settings, seed)
    this.settings = settings
    this.seed = seed
    if (record) this.score = []
    this.playbackNotes = null
    this.phrasesLeft = settings.mode === 'burst' ? settings.burstPhrases || 1 : Infinity
    this.beginClock()
  }

  /** Replay a fixed list of notes (a loaded session), exactly as recorded. */
  play(notes) {
    this.stop({ silent: true })
    this.improviser = null
    this.playbackNotes = notes.slice().sort((a, b) => a.t - b.t)
    this.playbackIndex = 0
    this.score = notes.slice()
    this.beginClock()
  }

  beginClock() {
    this.playing = true
    this.startedAt = this.engine.currentTime + 0.15
    this.cursor = 0
    this.tick()
    this.timer = setInterval(() => this.tick(), TICK)
  }

  tick() {
    if (!this.playing) return
    const now = this.engine.currentTime - this.startedAt

    if (this.playbackNotes) {
      // Straight playback: push everything inside the lookahead window.
      const batch = []
      while (
        this.playbackIndex < this.playbackNotes.length &&
        this.playbackNotes[this.playbackIndex].t < now + LOOKAHEAD
      ) {
        batch.push(this.playbackNotes[this.playbackIndex++])
      }
      if (batch.length) this.engine.schedule(batch, this.startedAt)
      if (this.playbackIndex >= this.playbackNotes.length) {
        const last = this.playbackNotes[this.playbackNotes.length - 1]
        if (!last || now > last.t + last.d + 1.5) this.finish()
      }
      return
    }

    while (this.cursor < now + LOOKAHEAD && this.phrasesLeft > 0) {
      const phrase = this.improviser.nextPhrase()
      const at = this.cursor

      const notes = phrase.notes.map((n) => ({
        t: at + n.time,
        d: n.duration,
        midi: n.midi,
        vel: n.velocity,
        slur: !!n.slur,
        tongue: n.tongue,
        bendCents: n.bendCents || 0,
        portamento: n.portamento || 0,
        flutter: n.flutter || 0,
      }))

      this.engine.schedule(notes, this.startedAt)
      this.score.push(...notes)
      this.cursor = at + phrase.duration + phrase.restAfter
      this.phrasesLeft--

      if (this.onPhrase) this.onPhrase(phrase, at)
    }

    if (this.phrasesLeft <= 0 && now > this.cursor - 0.5) this.finish()
  }

  /**
   * Throw away the part of the plan that has not been played yet and carry on
   * from here. Phrases are scheduled whole and can run twenty seconds, so
   * without this a change of key would not be audible until the current one
   * finished — which reads as the control being broken.
   */
  replan() {
    if (!this.playing || !this.improviser) return
    const now = this.engine.currentTime - this.startedAt
    // Leave a moment so a note that is about to speak is not cut off.
    const cut = now + 0.25
    this.engine.cancelAfter(this.startedAt + cut)
    this.score = this.score.filter((n) => n.t < cut)
    this.cursor = cut
    this.improviser.lastDegree = null
    this.tick()
  }

  finish() {
    const tail = 2.0
    clearInterval(this.timer)
    this.timer = null
    // Let the last note ring before we call it stopped.
    setTimeout(() => {
      if (!this.playing) return
      this.playing = false
      if (this.onStop) this.onStop()
    }, tail * 1000)
  }

  stop({ silent = false } = {}) {
    if (this.timer) clearInterval(this.timer)
    this.timer = null
    const was = this.playing
    this.playing = false
    this.engine.panic()
    if (was && !silent && this.onStop) this.onStop()
  }
}
