// TRANSPORT: restart, step back, step, step over, step out, run/pause with a
// speed control, and a scrubbable timeline of executed steps.
import { h, icon } from './dom.js'
import { prefs, setPref, SPEEDS, speedLabel } from './prefs.js'

export class Transport {
  constructor(session, actions) {
    this.session = session
    this.a = actions
    const btn = (name, label, key, fn, cls = '') => h('button', { type: 'button', class: 'tbtn ' + cls, 'aria-label': `${label} (${key})`, title: `${label}  ·  ${key}`, onclick: fn }, icon(name, 16))
    this.bRestart = btn('restart', 'Restart', 'R', () => actions.restart())
    this.bBack = btn('back', 'Step back', '←', () => actions.back())
    this.bStep = btn('step', 'Step', '→', () => actions.step(), 'primary')
    this.bOver = btn('over', 'Step over', 'O', () => actions.over())
    this.bOut = btn('out', 'Step out', 'U', () => actions.out())
    this.bRun = btn('play', 'Run', 'Space', () => actions.toggleRun(), 'run')
    this.speed = h('input', { type: 'range', min: 0, max: SPEEDS.length - 1, step: 1, value: prefs.speed, class: 'speed', 'aria-label': 'Run speed' })
    this.speedOut = h('output', { class: 'speed-out mono' }, speedLabel(SPEEDS[prefs.speed]))
    this.speed.addEventListener('input', () => {
      setPref('speed', +this.speed.value)
      this.speedOut.textContent = speedLabel(SPEEDS[prefs.speed])
      this.speed.setAttribute('aria-valuetext', speedLabel(SPEEDS[prefs.speed]))
    })
    this.timeline = h('input', { type: 'range', min: 0, max: 0, step: 1, value: 0, class: 'timeline', 'aria-label': 'Timeline: executed steps' })
    this.timeline.addEventListener('input', () => actions.seek(+this.timeline.value))
    this.counter = h('span', { class: 'step-count mono', 'aria-live': 'off' })
    this.note = h('span', { class: 'tl-note' })
    this.el = h('footer', { class: 'transport', 'aria-label': 'Transport' },
      h('div', { class: 't-buttons', role: 'group', 'aria-label': 'Execution controls' }, this.bRestart, this.bBack, this.bStep, this.bOver, this.bOut, this.bRun),
      h('label', { class: 't-speed', title: 'Run speed ([ and ])' }, h('span', { class: 'dim' }, 'speed'), this.speed, this.speedOut),
      h('div', { class: 't-timeline' }, this.timeline, h('div', { class: 't-tl-meta' }, this.counter, this.note)))
  }

  setSpeedIndex(i) {
    i = Math.max(0, Math.min(SPEEDS.length - 1, i))
    setPref('speed', i)
    this.speed.value = i
    this.speedOut.textContent = speedLabel(SPEEDS[i])
  }

  update() {
    const sess = this.session
    const m = sess.machine
    const walk = this.a.walkState && this.a.walkState()
    if (walk) {
      // a tutorial walk (validation / binary tour) drives the transport instead of the machine
      this.timeline.min = 0
      this.timeline.max = walk.total
      this.timeline.value = walk.pos
      this.counter.textContent = `${walk.label} ${walk.pos} / ${walk.total}`
      this.note.textContent = walk.note || ''
      this.bBack.disabled = walk.pos === 0
      this.bStep.disabled = false
      this.bOver.disabled = this.bOut.disabled = true
      this.bRun.disabled = true
      this.bRestart.disabled = walk.pos === 0
      this.setRunIcon(false)
      return
    }
    const ready = m && m.status === 'ready'
    this.bRun.disabled = !ready && !sess.running
    this.bStep.disabled = !m || (!ready && !(m.status === 'idle' && this.a.canAutoInvoke && this.a.canAutoInvoke()))
    this.bOver.disabled = this.bOut.disabled = !ready
    this.bBack.disabled = !m || !m.canStepBack
    this.bRestart.disabled = !m || (m.steps === 0 && m.status !== 'done' && m.status !== 'trapped' && m.status !== 'exited')
    this.setRunIcon(sess.running)
    if (!m) {
      this.timeline.max = 0
      this.counter.textContent = 'step 0'
      this.note.textContent = ''
      return
    }
    const lo = sess.earliestStep()
    const hi = Math.max(sess.prog.maxStep, m.steps)
    this.timeline.min = lo
    this.timeline.max = hi
    this.timeline.value = m.steps
    this.timeline.disabled = hi === lo || sess.running
    this.counter.textContent = `step ${m.steps.toLocaleString()}${hi > m.steps ? ' / ' + hi.toLocaleString() : ''}`
    this.note.textContent = lo > 0 ? `history kept from step ${lo.toLocaleString()} (older steps can't be rewound)` : ''
    this.note.classList.toggle('warn', lo > 0)
  }

  setRunIcon(running) {
    const b = this.bRun
    const want = running ? 'pause' : 'play'
    if (b.dataset.icon !== want) {
      b.dataset.icon = want
      b.replaceChildren(icon(want, 16))
      b.setAttribute('aria-label', running ? 'Pause (Space)' : 'Run (Space)')
      b.title = running ? 'Pause  ·  Space' : 'Run  ·  Space'
    }
    b.classList.toggle('on', running)
  }
}
