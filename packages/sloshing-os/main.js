// main.js — SloshOS 2.0 boot. A desktop OS whose apps are custom-shaped skins
// full of real particle liquid, over a 2004 abstract wallpaper. Grab any skin
// anywhere, shake it, fling it into the screen edges or slam it up into the
// goo bar hanging off the top; minimise it and it gets slurped up into its
// pill.

import { Goo } from './goo.js'
import { RES, skins, desk, safe, readSafe } from './skin.js'
import { Chip } from './chiptune.js'
import { makeAmp } from './amp.js'
import { makeRingToss } from './ringtoss.js'
import { makeClock } from './clock.js'
import { makeLava } from './lava.js'
import { Wallpaper } from './wallpaper.js'
import { Shell, TOP } from './shell.js'

const clamp = (v, a, b) => Math.min(b, Math.max(a, v))

const wallpaper = new Wallpaper(RES)
const goo = new Goo(RES)
const chip = new Chip()
let shell = null
let skinOf = null
let spots = null
let booted = false

// ---- layout: design-space positions, scaled to fit what the goo leaves -----
const ICONS_W = 104
const WIDE = { w: 1280, h: 742, at: { amp: [124, 14], toss: [716, 12], lava: [1066, 26], clock: [426, 292] } }
const TALL = { w: 620, h: 1090, at: { amp: [30, 10], toss: [16, 282], lava: [400, 282], clock: [330, 740] } }

function layout() {
  const top = desk.ceil
  const W = innerWidth - safe.l - safe.r
  const free = innerHeight - top - safe.b
  const L = W / free < 1.05 ? TALL : WIDE
  // the icon column needs ~500 px of height; short landscape phones skip it
  const icons = L === WIDE && innerWidth >= 760 && innerHeight >= 520
  document.body.classList.toggle('no-icons', !icons)
  const S = clamp(Math.min(W / L.w, free / L.h), 0.36, 1)
  // a roomier screen spreads the skins out rather than leaving an empty corner
  const kx = Math.max(S, W / L.w), ky = Math.max(S, free / L.h)
  const out = new Map()
  for (const [k, s] of Object.entries(skinOf)) {
    const [x, y] = L.at[k]
    const sx = L !== WIDE ? x * kx : icons ? ICONS_W + (x - ICONS_W) * kx : (x - ICONS_W * 0.8) * kx
    out.set(s, { x: safe.l + Math.max(4, sx), y: top + y * ky, S })
  }
  return out
}

// ---- boot: paint the skins one per frame behind a boot screen --------------
const bootEl = document.getElementById('boot')
const bootMsg = bootEl.querySelector('.bt-msg')
const bootBar = bootEl.querySelector('.bt-bar i')
const breathe = () => new Promise((r) => requestAnimationFrame(() => setTimeout(r, 0)))
const progress = async (k, msg) => {
  bootBar.style.width = Math.round(k * 100) + '%'
  bootMsg.textContent = msg
  await breathe()
}

// the wallpaper is already alive under the boot screen
requestAnimationFrame(function idle(now) {
  if (booted) return
  wallpaper.render(now / 1000, 1 / 60)
  requestAnimationFrame(idle)
})

boot()

async function boot() {
  await progress(0.06, 'Pouring HydroAmp…')
  const amp = makeAmp(goo, chip)
  await progress(0.32, 'Filling the Ring Toss tank…')
  const toss = makeRingToss(goo, {
    onScore: (n) => n < 6 && shell.balloon('Ring Toss', `${n} of 6 rings home.`, 3000),
    onWin: () => {
      shell.balloon('Ring Toss — perfect!', 'All six rings are on their own pegs. New round in a few seconds…')
      for (let k = 0; k < 8; k++) shell.splash(Math.random() * innerWidth, 220)
    },
  })
  await progress(0.58, 'Heating the lava…')
  const lava = makeLava(goo)
  await progress(0.74, 'Winding the Hydro Clock…')
  const clock = makeClock(goo)
  await progress(0.88, 'Hanging the goo…')
  skinOf = { amp, toss, lava, clock }

  shell = new Shell(goo, {
    apps: [
      { skin: amp, blurb: 'Chiptune player · liquid visualizer' },
      { skin: toss, blurb: 'Pump the jets, ring the pegs' },
      { skin: lava, blurb: 'Hot wax, cold glass' },
      { skin: clock, blurb: 'Time, in tangerine' },
    ],
    chip,
    layout,
  })
  shell.amp = amp
  goo.finalize()

  spots = layout()
  for (const [s, p] of spots) s.place(p.x, p.y, p.S)
  amp.focus()

  // slamming a skin up into the goo is the big splash; other hits just wobble it
  for (const s of skins) {
    s.onImpact = (speed, axis) => {
      const x = s.x + (s.w * s.S) / 2
      const ceilHit = axis === 'y' && s.y < innerHeight / 2
      shell.splash(x, clamp(speed * (ceilHit ? 0.32 : 0.05), 20, 460), ceilHit ? (s.w * s.S) / 3 : 30)
    }
  }

  await progress(1, 'Welcome')
  booted = true
  setTimeout(() => shell.balloon('Welcome to SloshOS', 'Every skin is full of real liquid. Grab one anywhere and give it a shake.'), 700)
  last = performance.now()
  requestAnimationFrame(frame)
}

// on resize or rotation each skin moves to its new spot, keeping whatever
// offset the user had dragged it from its old one
addEventListener('resize', () => {
  readSafe()
  desk.ceil = TOP + safe.t
  wallpaper.resize()
  if (!booted) return
  const next = layout()
  for (const [s, p] of next) {
    const o = spots.get(s)
    const k = p.S / o.S
    const a = s.anim
    if (a) {
      // mid-animation: remap where it will come back to, and retarget an
      // animation that is heading somewhere on the desktop
      const h = s.home || o
      s.home = { x: p.x + (h.x - o.x) * k, y: p.y + (h.y - o.y) * k, S: p.S }
      if (a.kind !== 'min' && a.kind !== 'close') {
        a.to = { ...a.to, x: p.x + (a.to.x - o.x) * k, y: p.y + (a.to.y - o.y) * k, S: p.S }
      }
    } else if (s.state === 'open') {
      s.place(
        clamp(p.x + (s.x - o.x) * k, safe.l, innerWidth - safe.r - 60),
        clamp(p.y + (s.y - o.y) * k, desk.ceil, innerHeight - 60), p.S)
    } else {
      const h = s.home || o
      s.home = { x: p.x + (h.x - o.x) * k, y: p.y + (h.y - o.y) * k, S: p.S }
    }
  }
  spots = next
})

// goo drops falling off the bar land in the liquid of whatever skin they hit
// first, topmost first; a drop over a skin's body just slides past it
const probe = new Int32Array(8)
// ties (never-focused skins) paint in creation order, so later counts as higher
const byDepth = (a, b) => (+b.el.style.zIndex || 0) - (+a.el.style.zIndex || 0) || skins.indexOf(b) - skins.indexOf(a)
function dripInto() {
  const drops = shell.goobar.drops
  if (!drops.length) return
  const order = skins.filter((s) => s.state === 'open' && !s.anim).sort(byDepth)
  for (let i = drops.length - 1; i >= 0; i--) {
    const d = drops[i]
    for (const s of order) {
      const lx = (d.x - s.x) / s.S, ly = (d.y - s.y) / s.S
      if (lx < 0 || ly < 0 || lx > s.w || ly > s.h || s.shape(lx, ly) > 0) continue
      const v = s.vesselAt(lx, ly)
      if (v && v.fluid.near(lx - v.x, ly - v.y, v.fluid.s * 1.5, probe) >= 2) {
        v.fluid.burst(lx - v.x, ly - v.y, 26, 260 + d.vy * 0.3)
        drops.splice(i, 1)
      }
      break
    }
  }
}

// ---- loop ----
let last = performance.now()
let frames = 0
const debug = location.hash === '#debug' ? (window.__perf = { sim: 0, draw: 0, n: 0 }) : null
function frame(now) {
  const dt = clamp((now - last) / 1000, 0.001, 0.05)
  last = now
  const t = now / 1000

  const p0 = performance.now()
  chip.tick()
  for (const s of skins) {
    s.update(dt)
    s.tick?.(dt)
  }
  shell.step(dt)
  dripInto()
  const p1 = performance.now()
  goo.render(t)
  for (const s of skins) s.draw(t, dt)
  shell.draw(t, goo)
  wallpaper.render(t, dt)
  if (debug) {
    debug.sim += p1 - p0
    debug.draw += performance.now() - p1
    debug.n++
  }

  if (++frames === 3) document.body.classList.add('ready')
  requestAnimationFrame(frame)
}
