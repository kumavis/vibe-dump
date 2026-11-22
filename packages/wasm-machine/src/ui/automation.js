// window.__wasmMachine.api: a small promise-based surface for scripts
// (recording, tests). Every action resolves once the UI has settled: all
// running animations finished and two frames painted. See tools/AUTOMATION.md.
import { prefs, setPref, SPEEDS } from './prefs.js'
import { LESSONS } from './lessons.js'

const frame = () => new Promise((r) => requestAnimationFrame(() => r()))
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export function automation(app) {
  const s = app.session

  async function settled({ timeout = 5000 } = {}) {
    const t0 = performance.now()
    await frame()
    for (;;) {
      const live = document.getAnimations().filter((a) => a.playState === 'running' || a.playState === 'pending')
      if (!live.length || performance.now() - t0 > timeout) break
      await Promise.race([Promise.all(live.map((a) => a.finished.catch(() => {}))), sleep(timeout)])
    }
    await frame()
    await frame()
  }

  function state() {
    const m = s.machine
    const t = app.tutorial
    const beat = app.mode === 'tutorial' ? t.currentBeat() : null
    return {
      mode: app.mode,
      view: app.view,
      lesson: app.mode === 'tutorial' && t.lesson ? t.lesson.id : null,
      phase: app.mode === 'tutorial' ? t.phase : 'run',
      walk: t.walkState ? t.walkState() : null,
      program: s.prog ? s.prog.name : null,
      status: m ? m.status : s.prog && s.prog.error ? 'error' : 'none',
      steps: m ? m.steps : 0,
      running: s.running,
      stack: m ? m.stack.map((v) => ({ type: v.type, value: String(v.value) })) : [],
      frames: s.frames().length,
      results: m && m.results ? m.results.map((v) => String(v.value)) : null,
      trap: m && m.trap ? m.trap.kind : null,
      beat: beat ? beat.text : null,
      error: s.prog && s.prog.error ? s.prog.error.message : null,
    }
  }

  /** True when another step would do something (walk or machine). */
  function canStep() {
    if (app.mode === 'tutorial' && app.tutorial.phase === 'walk') return true
    return !!s.machine && s.machine.status === 'ready'
  }

  async function repeat(kind, n, gap) {
    for (let i = 0; i < n; i++) {
      if (kind === 'step' && !canStep()) break
      app.act(kind)
      await settled()
      if (gap) await sleep(gap)
    }
    return state()
  }

  return {
    LESSONS: LESSONS.map((l) => ({ id: l.id, title: l.title })),
    SPEEDS,
    settled,
    state,
    canStep,
    async lesson(n) {
      if (app.mode !== 'tutorial') app.setMode('tutorial', { load: false })
      app.tutorial.go(n)
      await settled()
      return state()
    },
    async example(id) {
      await app.loadExample(id)
      await settled()
      return state()
    },
    step: (n = 1, { gap = 0 } = {}) => repeat('step', n, gap),
    back: (n = 1, { gap = 0 } = {}) => repeat('back', n, gap),
    over: () => repeat('over', 1, 0),
    out: () => repeat('out', 1, 0),
    async restart() {
      app.act('restart')
      await settled()
      return state()
    },
    async seek(n) {
      app.act('seek', n)
      await settled()
      return state()
    },
    /** Step until the call finishes (or `max` steps), waiting `gap` ms between steps. */
    async play({ gap = 400, max = 10000 } = {}) {
      for (let i = 0; i < max && canStep(); i++) {
        app.act('step')
        await settled()
        if (gap) await sleep(gap)
      }
      return state()
    },
    /** Run with the transport at a speed index (0..SPEEDS.length-1); resolves when it stops. */
    async run({ speed = prefs.speed, timeout = 60000 } = {}) {
      app.transport.setSpeedIndex(speed)
      if (!s.running) app.act('run')
      const t0 = performance.now()
      while (s.running && performance.now() - t0 < timeout) await sleep(50)
      if (s.running) s.pause()
      await settled()
      return state()
    },
    pause() {
      s.pause()
      return state()
    },
    async invoke(name, args = []) {
      const err = s.invoke(name, args)
      if (err) throw new Error(err)
      await settled()
      return state()
    },
    async mode(m) {
      app.setMode(m)
      await settled()
      return state()
    },
    async view(v) {
      app.setView(v === 'binary' ? 'binary' : 'machine')
      await settled()
      return state()
    },
    async theme(t) {
      setPref('theme', t === 'light' ? 'light' : 'dark')
      app.applyTheme()
      await settled()
    },
    async motion(on) {
      if (!!on !== prefs.anim) app.toggleAnim()
      app.toast.classList.remove('show')
      await settled()
    },
    async hex(on) {
      if (!!on !== prefs.hex) app.toggleHex()
      await settled()
    },
    /** Narrow layouts: 'side' | 'code' | 'stack' | 'frames' | 'store' | 'bytes'. */
    async pane(id) {
      app.setMobileTab(id)
      await settled()
    },
    spotlight(name) {
      app.spotlight(name)
    },
  }
}
