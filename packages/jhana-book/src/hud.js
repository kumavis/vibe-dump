// hud.js — the quiet DOM layer: dots, edge arrows, sound toggle, breath ring,
// first-load hint, "begin again"; plus all reader input (click halves, keys,
// swipe, drag-orbit) routed to callbacks.

const DEG = Math.PI / 180
const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : v)

export class Hud {
  // opts: { canvas, titles, lines, nohud, orbit, onPrev, onNext, onDot, onSound, onAgain }
  constructor(opts) {
    this.o = opts
    this.el = document.getElementById('hud')
    this.dotsEl = document.getElementById('dots')
    this.hintEl = document.getElementById('hint')
    this.ringEl = document.querySelector('#breath span')
    this.soundEl = document.getElementById('sound')
    this.againEl = document.getElementById('again')
    this.prevEl = document.getElementById('arrow-prev')
    this.nextEl = document.getElementById('arrow-next')
    this.liveEl = document.getElementById('live')
    this.lines = opts.lines || []
    this.hidden = false
    this.tint = ''
    this.current = -2
    this.pointerTarget = { x: 0, y: 0 }
    this.lastMove = -1e9
    this.inside = false
    if (opts.nohud) this.el.classList.add('off')

    // dots — one per spread; clickable from any state, including closed
    this.dots = opts.titles.map((title, i) => {
      const b = document.createElement('button')
      b.className = 'dot'
      b.type = 'button'
      b.title = title
      b.setAttribute('aria-label', title)
      b.addEventListener('click', (e) => {
        e.stopPropagation()
        if (e.detail > 0) b.blur() // pointer click: keep the keys for turning
        opts.onDot(i)
      })
      this.dotsEl.appendChild(b)
      return b
    })

    const button = (el, fn) =>
      el.addEventListener('click', (e) => {
        e.stopPropagation()
        if (e.detail > 0) el.blur()
        fn()
      })
    button(this.prevEl, opts.onPrev)
    button(this.nextEl, opts.onNext)
    button(this.againEl, opts.onAgain)
    button(this.soundEl, opts.onSound)

    this.bindPointer(opts.canvas)
    this.bindKeys()
  }

  // ---- input -------------------------------------------------------------------

  bindPointer(canvas) {
    const orbit = this.o.orbit
    let down = null
    canvas.addEventListener('pointerdown', (e) => {
      if (e.button !== undefined && e.button !== 0) return
      if (down) {
        down.cancelled = true // a second finger: a pinch, not a tap or a swipe
        return
      }
      down = { x: e.clientX, y: e.clientY, type: e.pointerType, drag: false, yaw: orbit.yaw, pitch: orbit.pitch }
      down.id = e.pointerId
      canvas.setPointerCapture?.(e.pointerId)
    })
    canvas.addEventListener('pointermove', (e) => {
      if (!down) return
      const dx = e.clientX - down.x
      const dy = e.clientY - down.y
      // a mouse drag gently orbits; touch keeps horizontal swipes for turning
      if (down.type === 'mouse' && !down.drag && Math.hypot(dx, dy) > 6) down.drag = true
      if (down.drag) {
        orbit.dragging = true
        orbit.yaw = clamp(down.yaw - dx * 0.0035, -25 * DEG, 25 * DEG)
        orbit.pitch = clamp(down.pitch + dy * 0.003, -10 * DEG, 15 * DEG)
      }
    })
    const end = (e, cancelled) => {
      if (!down || e.pointerId !== down.id) return
      const d = down
      down = null
      orbit.dragging = false
      if (cancelled || d.drag || d.cancelled) return
      const dx = e.clientX - d.x
      const dy = e.clientY - d.y
      if (d.type !== 'mouse' && Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        if (dx < 0) this.o.onNext()
        else this.o.onPrev()
        return
      }
      if (Math.hypot(dx, dy) > 12) return
      if (e.clientX < window.innerWidth / 2) this.o.onPrev('click')
      else this.o.onNext('click')
    }
    canvas.addEventListener('pointerup', (e) => end(e, false))
    canvas.addEventListener('pointercancel', (e) => end(e, true))

    // parallax target + edge arrows
    window.addEventListener('pointermove', (e) => {
      const w = window.innerWidth
      const h = window.innerHeight
      this.pointerTarget.x = clamp((e.clientX / w) * 2 - 1, -1, 1)
      this.pointerTarget.y = clamp(1 - (e.clientY / h) * 2, -1, 1)
      this.lastMove = performance.now()
      this.inside = true
      if (e.pointerType === 'mouse') {
        const fx = e.clientX / w
        this.prevEl.classList.toggle('near', fx < 0.12)
        this.nextEl.classList.toggle('near', fx > 0.88)
      }
    })
    document.documentElement.addEventListener('pointerleave', () => {
      this.inside = false
      this.prevEl.classList.remove('near')
      this.nextEl.classList.remove('near')
    })
  }

  bindKeys() {
    window.addEventListener('keydown', (e) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return
      const tag = e.target && e.target.tagName
      const control = tag === 'INPUT' || tag === 'BUTTON' || tag === 'SELECT' || tag === 'TEXTAREA'
      if (e.key === 'Escape') {
        this.toggle()
        return
      }
      if (control && (e.key === ' ' || e.key === 'Enter' || tag === 'INPUT')) return
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        this.o.onNext()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        this.o.onPrev()
      }
    })
  }

  // Pointer for parallax/scenes: the real position while it moves inside the
  // window, (0, 0) once it has been still for a while or left.
  pointerGoal(now) {
    const idle = !this.inside || now - this.lastMove > 6000
    return idle ? null : this.pointerTarget
  }

  // ---- state -------------------------------------------------------------------

  toggle() {
    this.hidden = !this.hidden
    this.el.classList.toggle('hidden', this.hidden)
    this.el.inert = this.hidden // hidden buttons leave the tab order
  }

  // n: rest/target state (0…11), turning: bool
  setState(n, turning) {
    const k = n >= 1 && n <= 10 ? n - 1 : -1
    if (k !== this.current) {
      this.current = k
      this.dots.forEach((d, i) => {
        d.classList.toggle('on', i === k)
        d.setAttribute('aria-current', i === k ? 'page' : 'false')
      })
    }
    this.prevEl.classList.toggle('none', n <= 0)
    this.nextEl.classList.toggle('none', n >= 11)
    this.againEl.classList.toggle('show', n === 11 && !turning)
  }

  firstTurn() {
    this.hintEl.classList.add('gone')
  }

  // For screen readers: the text printed on the spread at rest n (0…11).
  announce(n) {
    const text = (n >= 1 && n <= 10 && this.lines[n - 1]) || 'The Jhānas, a pop-up book'
    if (this.liveEl && this.liveEl.textContent !== text) this.liveEl.textContent = text
  }

  setTint(color) {
    const r = Math.round(color.r * 255)
    const g = Math.round(color.g * 255)
    const b = Math.round(color.b * 255)
    const css = `${r} ${g} ${b}`
    if (css !== this.tint) {
      this.tint = css
      this.el.style.setProperty('--accent', css)
    }
  }

  setBreath(b) {
    // the ring's fill swells from a seed to the full 22 px circle
    this.ringEl.style.transform = `scale(${(0.32 + 0.68 * b).toFixed(3)})`
    this.ringEl.style.opacity = (0.18 + 0.32 * b).toFixed(3)
  }

  setSound(on) {
    this.soundEl.classList.toggle('on', on)
    this.soundEl.setAttribute('aria-pressed', on ? 'true' : 'false')
    this.soundEl.title = on ? 'Sound on' : 'Sound off'
  }
}
