// shell.js — the OS around the skins. The taskbar is goo hanging from the top
// of the screen (goobar.js) with the start orb, task pills and tray floating
// in it; skins get slurped up into their pill when minimised. Plus a tray
// with balloon tips, a start menu that oozes out of the orb, desktop icons,
// and an honest-to-goodness "It's now safe to turn off your computer."

import { desk, skins, RES, safe, readSafe } from './skin.js'
import { Fluid } from './fluid.js'
import { Grid, circle } from './sdf.js'
import { Painter, withShadow } from './skinart.js'
import { rgb } from './goo.js'
import { drawDuck, Glitter } from './fx.js'
import { GooBar, GOO_D } from './goobar.js'

export const TOP = GOO_D + 8 // skins live below the goo
const ORB = 64 // start orb canvas size (CSS px)

const el = (tag, cls, html) => {
  const e = document.createElement(tag)
  if (cls) e.className = cls
  if (html != null) e.innerHTML = html
  return e
}

// ---- little glossy icons ---------------------------------------------------

function canvasIcon(size, draw) {
  const c = document.createElement('canvas')
  c.width = c.height = Math.round(size * RES)
  c.style.width = c.style.height = size + 'px'
  const ctx = c.getContext('2d')
  ctx.scale(RES, RES)
  draw(ctx, size)
  return c
}

const SVG = {
  speaker: (on) => `<svg viewBox="0 0 20 20" width="18" height="18"><defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#9fdcff"/></linearGradient></defs>
    <path d="M3 7.5h3.2L10.5 4v12L6.2 12.5H3z" fill="url(#sg)" stroke="#0b3a66" stroke-width=".8"/>
    ${on ? '<path d="M13 7c1.2 1.6 1.2 4.4 0 6M15.3 5c2.2 2.8 2.2 7.2 0 10" fill="none" stroke="#7dffc0" stroke-width="1.4" stroke-linecap="round"/>' : '<path d="M13.2 7.6l4.4 4.8M17.6 7.6l-4.4 4.8" stroke="#ff6a8a" stroke-width="1.5" stroke-linecap="round"/>'}</svg>`,
  wave: `<svg viewBox="0 0 20 20" width="18" height="18"><defs><radialGradient id="wg" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#e8fdff"/><stop offset=".5" stop-color="#3fc8ff"/><stop offset="1" stop-color="#0a4fb0"/></radialGradient></defs>
    <circle cx="10" cy="10" r="7.5" fill="url(#wg)" stroke="#06305e" stroke-width=".7"/>
    <path d="M3.5 11c2-1.6 3.4-1.6 5.2 0s3.4 1.6 5.2 0 2.6-1.2 3 0" fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".9"/></svg>`,
  drop: `<svg viewBox="0 0 24 24" width="26" height="26"><defs><linearGradient id="dg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#bff3ff"/></linearGradient></defs>
    <path d="M12 2.5C9 7 5.5 10.3 5.5 14.3a6.5 6.5 0 0 0 13 0C18.5 10.3 15 7 12 2.5z" fill="url(#dg)" stroke="rgba(0,40,90,.55)" stroke-width=".9"/>
    <ellipse cx="9.6" cy="13" rx="1.4" ry="2.6" fill="#fff" opacity=".9" transform="rotate(20 9.6 13)"/></svg>`,
}

function pondIcon(size) {
  return canvasIcon(size, (ctx, s) => {
    const g = ctx.createRadialGradient(s * 0.4, s * 0.55, 2, s * 0.5, s * 0.62, s * 0.5)
    g.addColorStop(0, '#bff6ff')
    g.addColorStop(0.45, '#2fb8ff')
    g.addColorStop(1, '#0a3d9a')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.ellipse(s / 2, s * 0.64, s * 0.46, s * 0.27, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.8)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.ellipse(s / 2, s * 0.64, s * 0.46, s * 0.27, 0, Math.PI * 1.1, Math.PI * 1.7)
    ctx.stroke()
    drawDuck(ctx, s * 0.52, s * 0.52, s * 0.17, -0.1)
  })
}

function drainIcon(size) {
  return canvasIcon(size, (ctx, s) => {
    const c = s / 2
    let g = ctx.createLinearGradient(0, s * 0.1, 0, s * 0.9)
    g.addColorStop(0, '#ffffff')
    g.addColorStop(0.45, '#9fb6d8')
    g.addColorStop(0.55, '#3a4a6a')
    g.addColorStop(1, '#c6d6f0')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(c, c, s * 0.42, 0, Math.PI * 2)
    ctx.fill()
    g = ctx.createRadialGradient(c, c, 1, c, c, s * 0.34)
    g.addColorStop(0, '#02101e')
    g.addColorStop(1, '#0d3d6a')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(c, c, s * 0.33, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#d8e6ff'
    ctx.lineWidth = 2.2
    for (let k = -2; k <= 2; k++) {
      const x = c + k * s * 0.12
      const hh = Math.sqrt(Math.max(0, (s * 0.33) ** 2 - (x - c) ** 2)) - 2
      ctx.beginPath()
      ctx.moveTo(x, c - hh)
      ctx.lineTo(x, c + hh)
      ctx.stroke()
    }
    ctx.strokeStyle = 'rgba(90,220,255,0.8)'
    ctx.lineWidth = 1.2
    ctx.beginPath()
    ctx.arc(c, c, s * 0.2, 0.3, 4.2)
    ctx.stroke()
  })
}

// ---------------------------------------------------------------------------

export class Shell {
  constructor(goo, { apps, chip, layout, onShake }) {
    this.apps = apps // [{ skin, blurb }]
    this.chip = chip
    this.layout = layout
    this.onShake = onShake
    this.focused = null
    desk.ceil = TOP + safe.t
    desk.onFocus = (s) => this.setFocus(s)
    desk.onState = () => this.syncTasks()

    this.buildOrb(goo)
    this.buildBar()
    this.buildMenu()
    this.buildIcons()
    this.buildBalloon()
    this.buildShutdown()

    addEventListener('pointerdown', (e) => {
      if (this.menuOpen && !this.menu.contains(e.target) && !this.start.contains(e.target)) this.toggleMenu(false)
      if (!e.target.closest('.dicon')) this.icons.querySelectorAll('.dicon.sel').forEach((n) => n.classList.remove('sel'))
    })
    addEventListener('keydown', (e) => { if (e.key === 'Escape') this.toggleMenu(false) })
  }

  // ---- start orb: a glass ball of goo -------------------------------------

  buildOrb(goo) {
    const R = 27, C = ORB / 2
    const inside = circle(C, C, R - 3)
    const f = new Fluid(new Grid(inside, ORB, ORB, 2), { spacing: 6, max: 260, gravity: 1100, stiffness: 0.55, nearStiffness: 1.1 })
    f.fill((x, y) => y > C - 2, (x, y) => (y - C) / R)
    f.settle()
    this.orbVessel = goo.add({
      x: 0, y: 0, w: ORB, h: ORB, inside, fluid: f,
      look: { a: rgb('#3df0ff'), b: rgb('#8a3dff'), glow: rgb('#b0f8ff'), glowAmt: 0.5, caustics: 0.5, alpha: 0.86 },
    })
    this.orbGlitter = new Glitter(f, 14)
    const back = new Painter(ORB, ORB, RES, 8)
    back.part(circle(C, C, R + 2), { type: 'chrome', color: [0.85, 0.95, 1.15], bevel: 5, pillow: 0.7 })
    back.part(circle(C, C, R - 2.5), { type: 'glass', color: [0.04, 0.06, 0.16], bevel: 5, recess: true, pillow: 0 })
    this.orbBack = withShadow(back.canvas(), RES, { blur: 10, dy: 3, glow: 'rgba(80,220,255,0.7)', glowBlur: 16 })
    const front = new Painter(ORB, ORB, RES, 8)
    front.shine(circle(C, C, R - 2.5), { bevel: 6, gloss: 0.5, glossAlpha: 0.45 })
    this.orbFront = front.canvas()
  }

  drawOrb(t, goo) {
    const ctx = this.orbCtx
    const m = 8
    ctx.setTransform(RES, 0, 0, RES, m * RES, m * RES)
    ctx.clearRect(-m, -m, ORB + m * 2, ORB + m * 2)
    ctx.drawImage(this.orbBack, -m, -m, ORB + m * 2, ORB + m * 2)
    goo.blit(ctx, this.orbVessel, 0, 0)
    this.orbGlitter.draw(ctx, 0, 0, t)
    // the SloshOS droplet logo floating in the ball
    ctx.save()
    ctx.translate(ORB / 2, ORB / 2 + Math.sin(t * 2) * 1.2)
    ctx.fillStyle = 'rgba(255,255,255,0.92)'
    ctx.shadowColor = 'rgba(0,40,120,0.7)'
    ctx.shadowBlur = 4
    ctx.beginPath()
    ctx.moveTo(0, -13)
    ctx.bezierCurveTo(-4, -6, -9, -2, -9, 3)
    ctx.arc(0, 3, 9, Math.PI, 0, true)
    ctx.bezierCurveTo(9, -2, 4, -6, 0, -13)
    ctx.fill()
    ctx.shadowBlur = 0
    ctx.fillStyle = 'rgba(40,140,255,0.55)'
    ctx.beginPath()
    ctx.ellipse(-3, 3, 2, 4, 0.3, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
    ctx.drawImage(this.orbFront, -m, -m, ORB + m * 2, ORB + m * 2)
  }

  // ---- the goo bar --------------------------------------------------------

  buildBar() {
    this.goobar = new GooBar(RES, safe.t)
    const bar = (this.bar = el('div'))
    bar.id = 'topbar'
    // poking the goo itself (anywhere the pills aren't) makes it wobble
    const hit = el('div', 'goohit')
    hit.addEventListener('pointerdown', (e) => this.goobar.splash(e.clientX, 300, 34))
    hit.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'mouse') this.goobar.splash(e.clientX, Math.min(90, Math.abs(e.movementX) * 4), 24)
    })
    bar.appendChild(hit)

    const start = (this.start = el('div', 'start'))
    start.title = 'Start'
    const oc = el('canvas', 'orb')
    oc.width = oc.height = (ORB + 16) * RES
    oc.style.width = oc.style.height = ORB + 16 + 'px'
    this.orbCtx = oc.getContext('2d')
    start.appendChild(oc)
    start.addEventListener('pointerdown', (e) => {
      e.preventDefault()
      this.toggleMenu()
      this.orbVessel.fluid.burst(ORB / 2, ORB - 12, 30, 420)
      this.goobar.splash(44, 160, 40)
    })
    start.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return
      const r = oc.getBoundingClientRect()
      const f = this.orbVessel.fluid
      f.impulse(e.clientX - r.left - 8, e.clientY - r.top - 8, 14, e.movementX * 18, e.movementY * 18)
    })
    bar.appendChild(start)

    this.tasks = el('div', 'tasks')
    bar.appendChild(this.tasks)
    this.taskBtns = new Map()
    this.pillX = new Map()
    for (const { skin } of this.apps) {
      const b = el('button', 'task')
      b.appendChild(canvasIcon(24, (ctx, s) => ctx.drawImage(skin.icon(s), 0, 0, s, s)))
      b.appendChild(el('span', 'label', skin.title))
      b.title = skin.title
      // splash on click, not on press: a press-splash bobs the pill out from
      // under the pointer and the click never lands
      b.addEventListener('click', (e) => {
        this.goobar.splash(e.clientX, 180, 40)
        this.taskClick(skin)
      })
      this.tasks.appendChild(b)
      this.taskBtns.set(skin, b)
      // the jelly orbs on the skin itself
      skin.onMinimize = () => {
        const r = b.getBoundingClientRect()
        skin.minimize(r.left + r.width / 2, r.top + r.height / 2)
      }
      skin.onClose = () => skin.close()
    }

    const tray = (this.tray = el('div', 'tray'))
    const vol = (this.volBtn = el('button', 'ti', SVG.speaker(false)))
    vol.title = 'HydroAmp — play / pause'
    vol.addEventListener('click', () => { this.amp?.togglePlay?.(); this.syncTray() })
    const duck = el('button', 'ti')
    duck.appendChild(canvasIcon(20, (ctx, s) => drawDuck(ctx, s * 0.45, s * 0.62, s * 0.3, -0.05)))
    duck.title = 'Duck Messenger'
    duck.addEventListener('click', () => {
      this.balloon('Duck Messenger', 'Quack. (2 ducks online — both in HydroAmp.)')
      this.amp?.hop?.()
    })
    const net = el('button', 'ti', SVG.wave)
    net.title = 'Wet LAN — connected, 100 Mbps'
    net.addEventListener('click', () => this.balloon('Wet LAN', 'Connected. Signal: drenched. Packets arriving slightly damp.'))
    this.clock = el('button', 'tclock', '<b></b><small></small>')
    this.clock.title = 'Hydro Clock'
    this.clock.addEventListener('click', () => this.open(this.apps.find((a) => a.skin.id === 'clock').skin))
    tray.append(vol, duck, net, this.clock)
    bar.appendChild(tray)
    document.body.appendChild(bar)
    this.trayW = 0
    // resizing rebuilds the full-screen goo targets: do it once things settle
    let rt = 0
    addEventListener('resize', () => {
      clearTimeout(rt)
      rt = setTimeout(() => {
        readSafe()
        this.goobar.top = safe.t
        this.goobar.resize()
        this.trayW = 0
      }, 160)
    })
  }

  splash(x, amount, width = 40) {
    this.goobar.splash(x, amount, width)
    if (x < 120) this.orbVessel.fluid.burst(ORB / 2, ORB - 10, 30, amount * 1.2)
  }

  // pills, orb and tray bob in the goo; the goo flows around them. Pills
  // share whatever room the orb and tray leave, dropping their labels when
  // it gets tight.
  float(dt) {
    const g = this.goobar
    const top = safe.t
    const tight = innerWidth - safe.l - safe.r < 520
    if (tight !== this.tight) {
      this.tight = tight
      this.bar.classList.toggle('tight', tight)
      this.trayW = 0
    }
    if (!this.trayW) this.trayW = this.tray.offsetWidth
    const tw = this.trayW
    const tx = innerWidth - safe.r - tw - 10
    const x0 = safe.l + 92
    const pills = [...this.taskBtns.values()].filter((b) => !b.hidden)
    const n = Math.max(1, pills.length)
    const room = tx - 10 - x0
    let gap = 10
    let pw = Math.min(156, (room - gap * (n - 1)) / n)
    const compact = pw < 112
    if (compact) {
      gap = 6
      pw = Math.max(30, Math.min(46, (room - gap * (n - 1)) / n))
    }
    if (compact !== this.compact) {
      this.compact = compact
      this.bar.classList.toggle('compact', compact)
    }
    const obs = []
    const ob = top + g.wave(safe.l + 44) * 0.5 + Math.sin(g.t * 1.3) * 1.5
    this.start.style.transform = `translate(${safe.l}px,${ob}px)`
    obs.push({ x: safe.l + 44, y: 30 + ob, r: 30 })
    let x = x0
    for (const b of pills) {
      let px = this.pillX.get(b) ?? x
      px += (x - px) * Math.min(1, 8 * dt)
      this.pillX.set(b, px)
      const cx = px + pw / 2
      const y = top + 9 + g.wave(cx) * 0.45 + Math.sin(g.t * 1.6 + px * 0.02) * 1.6
      const rot = g.slope(cx) * 0.35 + Math.sin(g.t * 1.1 + px * 0.03) * 0.012
      const wpx = pw.toFixed(1) + 'px'
      if (b.style.width !== wpx) b.style.width = wpx
      b.style.transform = `translate(${px}px,${y}px) rotate(${rot}rad)`
      obs.push({ x: px, y, w: pw, h: 34 })
      x += pw + gap
    }
    const ty = top + 9 + g.wave(tx + tw / 2) * 0.45 + Math.sin(g.t * 1.4 + 2) * 1.2
    this.tray.style.transform = `translate(${tx}px,${ty}px)`
    obs.push({ x: tx, y: ty, w: tw, h: 34 })
    g.obstacles = obs
  }

  // ---- tasks + focus ------------------------------------------------------

  taskClick(skin) {
    if (skin.state === 'open' && this.focused === skin && !skin.anim) {
      const r = this.taskBtns.get(skin).getBoundingClientRect()
      skin.minimize(r.left + r.width / 2, r.top + r.height / 2)
    } else this.open(skin)
  }

  open(skin) {
    const b = this.taskBtns.get(skin)
    if (skin.state === 'min') {
      const r = b.getBoundingClientRect()
      skin.restore(r.left + r.width / 2, r.top + r.height / 2)
    } else if (skin.state === 'closed') {
      const ic = this.iconFor.get(skin)
      const r = (ic && ic.offsetParent ? ic : b).getBoundingClientRect()
      skin.restore(r.left + r.width / 2, r.top + r.height / 2)
    } else skin.restore()
    this.syncTasks()
  }

  setFocus(skin) {
    this.focused = skin
    this.syncTasks()
  }

  syncTasks() {
    for (const [skin, b] of this.taskBtns) {
      b.hidden = skin.state === 'closed' && !skin.anim
      b.classList.toggle('active', skin === this.focused && skin.state === 'open')
      b.classList.toggle('min', skin.state === 'min')
    }
  }

  syncTray() {
    const on = this.chip.mode === 'play'
    if (this.volOn !== on) {
      this.volOn = on
      this.volBtn.innerHTML = SVG.speaker(on)
    }
    const d = new Date()
    const hh = d.getHours() % 12 || 12
    const mm = String(d.getMinutes()).padStart(2, '0')
    const txt = `${hh}:${mm} ${d.getHours() < 12 ? 'AM' : 'PM'}`
    if (txt !== this.clockTxt) {
      this.clockTxt = txt
      this.clock.firstChild.textContent = txt
      this.clock.lastChild.textContent = d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })
      this.trayW = 0
    }
  }

  // ---- start menu ---------------------------------------------------------

  buildMenu() {
    const m = (this.menu = el('div', '', ''))
    m.id = 'startmenu'
    const head = el('div', 'sm-head')
    head.appendChild(canvasIcon(40, (ctx, s) => {
      const g = ctx.createLinearGradient(0, 0, 0, s)
      g.addColorStop(0, '#bff6ff')
      g.addColorStop(1, '#2a7bff')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.roundRect(1, 1, s - 2, s - 2, 8)
      ctx.fill()
      ctx.strokeStyle = 'rgba(255,255,255,0.9)'
      ctx.lineWidth = 2
      ctx.stroke()
      drawDuck(ctx, s * 0.46, s * 0.62, s * 0.26, -0.1)
    }))
    head.appendChild(el('div', 'sm-user', '<b>sloshboy</b><small>SloshOS 2.0 · Aqua Edition</small>'))
    m.appendChild(head)
    const body = el('div', 'sm-body')
    const left = el('div', 'sm-left')
    for (const { skin, blurb } of this.apps) {
      const it = el('button', 'sm-app')
      it.appendChild(canvasIcon(34, (ctx, s) => ctx.drawImage(skin.icon(s), 0, 0, s, s)))
      it.appendChild(el('span', '', `<b>${skin.title}</b><small>${blurb}</small>`))
      it.addEventListener('click', () => { this.open(skin); this.toggleMenu(false) })
      left.appendChild(it)
    }
    body.appendChild(left)
    const right = el('div', 'sm-right')
    const place = (label, icon, fn) => {
      const it = el('button', 'sm-place')
      if (icon) it.appendChild(icon)
      it.appendChild(el('span', '', label))
      it.addEventListener('click', () => { this.toggleMenu(false); fn() })
      right.appendChild(it)
    }
    place('My Pond', pondIcon(22), () => this.pond())
    place('Drain', drainIcon(22), () => this.drain())
    right.appendChild(el('hr'))
    place('Shake Desktop', null, () => this.shake())
    place('Tidy Up', null, () => this.tidy())
    place('Help &amp; Bubbles', null, () => this.balloon('Help & Bubbles', 'Grab any skin anywhere and throw it. Click liquid to plop it. Ring Toss: pump the jets (← →) until every ring is on its own colour.'))
    body.appendChild(right)
    m.appendChild(body)
    const foot = el('div', 'sm-foot')
    const off = el('button', 'sm-off', '<i></i>Shut Down…')
    off.addEventListener('click', () => { this.toggleMenu(false); this.shutdown() })
    foot.appendChild(off)
    m.appendChild(foot)
    m.inert = true
    document.body.appendChild(m)
  }

  toggleMenu(open = !this.menuOpen) {
    this.menuOpen = open
    this.menu.classList.toggle('open', open)
    // a closed menu must not keep focus, or Space re-fires its last item
    this.menu.inert = !open
    this.start.classList.toggle('on', open)
    if (open) {
      clearTimeout(this.ballT)
      this.ball?.classList.remove('show')
    }
  }

  // ---- desktop icons ------------------------------------------------------

  buildIcons() {
    const box = (this.icons = el('div', ''))
    box.id = 'icons'
    this.iconFor = new Map()
    const add = (label, canvas, fn, skin) => {
      const d = el('div', 'dicon')
      d.appendChild(canvas)
      d.appendChild(el('span', '', label))
      d.addEventListener('click', (e) => {
        box.querySelectorAll('.dicon.sel').forEach((n) => n.classList.remove('sel'))
        d.classList.add('sel')
        if (e.pointerType && e.pointerType !== 'mouse') fn()
      })
      d.addEventListener('dblclick', fn)
      box.appendChild(d)
      if (skin) this.iconFor.set(skin, d)
    }
    for (const { skin } of this.apps) add(skin.title, canvasIcon(48, (ctx, s) => ctx.drawImage(skin.icon(s), 0, 0, s, s)), () => this.open(skin), skin)
    add('My Pond', pondIcon(48), () => this.pond())
    add('Drain', drainIcon(48), () => this.drain())
    document.body.appendChild(box)
  }

  // ---- actions ------------------------------------------------------------

  shake() {
    for (const s of skins) {
      if (s.state !== 'open') continue
      s.tvx = (Math.random() - 0.5) * 2600
      s.tvy = -600 - Math.random() * 1400
      s.skv += (Math.random() - 0.5) * 6
    }
    for (let k = 0; k < 6; k++) this.splash(Math.random() * innerWidth, 260)
    this.onShake?.()
  }

  tidy() {
    const spots = this.layout()
    for (const s of skins) {
      const p = spots.get(s)
      if (p) s.glide(p.x, p.y, p.S)
    }
  }

  pond() {
    this.shake()
    this.balloon('My Pond', 'Moisture levels nominal. Everything has been agitated, as requested.')
  }

  drain() {
    this.balloon('Drain', 'The Drain is empty. Nothing has ever been thrown away here, except ducks, and they came back.')
  }

  // ---- balloon tips ---------------------------------------------------------

  buildBalloon() {
    const b = (this.ball = el('div', '', '<button class="bx">×</button><b></b><p></p>'))
    b.id = 'balloon'
    b.querySelector('.bx').addEventListener('click', () => b.classList.remove('show'))
    document.body.appendChild(b)
  }

  balloon(title, text, ms = 6500) {
    const b = this.ball
    b.querySelector('b').textContent = title
    b.querySelector('p').textContent = text
    b.classList.remove('show')
    void b.offsetWidth
    b.classList.add('show')
    clearTimeout(this.ballT)
    this.ballT = setTimeout(() => b.classList.remove('show'), ms)
  }

  // ---- shut down ------------------------------------------------------------

  buildShutdown() {
    const s = (this.off = el('div', '', '<p>It\'s now safe to turn off<br>your computer.</p><small>(tap anywhere to slosh back in)</small>'))
    s.id = 'shutdown'
    s.addEventListener('pointerdown', () => {
      s.classList.add('boot')
      setTimeout(() => {
        s.classList.remove('show', 'boot')
        this.balloon('Welcome back', 'SloshOS recovered from an unexpected dryness.')
        for (const sk of skins) sk.stv -= 3
      }, 1600)
    })
    document.body.appendChild(s)
  }

  shutdown() {
    this.off.classList.add('show')
  }

  // ---- per frame --------------------------------------------------------------

  step(dt) {
    this.goobar.step(dt)
    this.float(dt)
    this.orbVessel.fluid.step(dt, 0, 0)
  }

  draw(t, goo) {
    this.goobar.render(t)
    this.drawOrb(t, goo)
    this.syncTray()
  }
}
