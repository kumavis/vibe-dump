// The replay bar (DESIGN §2.7, N3): along the bottom while a battle is
// watched back (app/replay.js). ⏮ watches it from the start, ▶ / ⏸ plays
// on from the move shown or stops there, the slider scrubs to a move
// (shown as it is let go of, and a moment after the last nudge), Live is
// the battle as it stands (a battle still going on), 💾 saves its log as a
// replay file, and ✕ (a battle that is over, or a file's) puts the bar
// away. The speed is the page's own (⏩).
const $ = (s) => document.querySelector(s)

export class ReplayBar {
  constructor() {
    this.root = $('#replay')
    this.slider = $('#rpAt')
    this.wait = 0
  }

  get up() {
    return !this.root.classList.contains('hidden')
  }

  // { start, play, scrub(k), live, save, close }
  wire(on) {
    $('#rpStart').onclick = () => on.start()
    $('#rpPlay').onclick = () => on.play()
    $('#rpLive').onclick = () => on.live()
    $('#rpSave').onclick = () => on.save()
    $('#rpClose').onclick = () => on.close()
    const go = () => {
      clearTimeout(this.wait)
      this.wait = 0
      on.scrub(Number(this.slider.value))
    }
    // (held, or about to scrub: the battle moving on leaves the slider be)
    this.slider.onpointerdown = () => (this.held = true)
    this.slider.onpointerup = this.slider.onpointercancel = () => (this.held = false)
    this.slider.oninput = () => {
      this.label(Number(this.slider.value))
      clearTimeout(this.wait)
      this.wait = setTimeout(go, 250)
    }
    this.slider.onchange = go
  }

  // { min, max, at, first, playing, live, atLive, closable }
  render(m) {
    this.m = m
    this.slider.min = m.min
    this.slider.max = m.max
    if (!this.held && !this.wait) {
      this.slider.value = m.at
      this.label(m.at)
    }
    $('#rpPlay').textContent = m.playing ? '⏸' : '▶'
    $('#rpPlay').title = m.playing ? 'Pause' : 'Play on from here'
    $('#rpLive').classList.toggle('hidden', !m.live)
    $('#rpLive').classList.toggle('on', m.atLive)
    $('#rpClose').classList.toggle('hidden', !m.closable)
    this.root.classList.remove('hidden')
    document.body.classList.add('replaying')
  }

  // where the slider stands, in moves of the battle
  label(k) {
    const m = this.m
    if (!m) return
    $('#rpLabel').textContent = m.live && m.atLive && k === m.max ? `Live · move ${m.max - m.first + 1}` : k < m.first ? 'Before the battle' : `Move ${k - m.first + 1} of ${m.max - m.first + 1}`
  }

  hide() {
    clearTimeout(this.wait)
    this.root.classList.add('hidden')
    document.body.classList.remove('replaying')
  }
}
