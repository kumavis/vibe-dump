// main.js — SloshOS 2.0 boot. A desktop OS whose apps are custom-shaped skins
// full of real particle liquid, over a 2004 abstract wallpaper. Grab any skin
// anywhere, shake it, fling it into the screen edges or slam it down onto the
// goo bar hanging off the top; minimise it and it gets slurped up into its
// pill.

import { Goo } from './goo.js'
import { RES, skins } from './skin.js'
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

const amp = makeAmp(goo, chip)
const toss = makeRingToss(goo, {
  onScore: (n) => n < 6 && shell.balloon('Ring Toss', `${n} of 6 rings home.`, 3000),
  onWin: () => {
    shell.balloon('Ring Toss — perfect!', 'All six rings are on their own pegs. New round in a few seconds…')
    for (let k = 0; k < 8; k++) shell.splash(Math.random() * innerWidth, 220)
  },
})
const lava = makeLava(goo)
const clock = makeClock(goo)

// ---- layout: design-space positions, scaled to fit what the goo leaves -----
const ICONS_W = 104
const WIDE = { w: 1280, h: 742, at: { amp: [124, 14], toss: [716, 12], lava: [1066, 26], clock: [426, 292] } }
const TALL = { w: 620, h: 1090, at: { amp: [30, 10], toss: [16, 282], lava: [400, 282], clock: [330, 740] } }
const skinOf = { amp, toss, lava, clock }

function layout() {
  const free = innerHeight - TOP
  const L = innerWidth / free < 1.05 ? TALL : WIDE
  const icons = L === WIDE && innerWidth >= 760
  document.body.classList.toggle('no-icons', !icons)
  const S = clamp(Math.min(innerWidth / L.w, free / L.h), 0.36, 1)
  // a roomier screen spreads the skins out rather than leaving an empty corner
  const kx = Math.max(S, innerWidth / L.w), ky = Math.max(S, free / L.h)
  const spots = new Map()
  for (const [k, s] of Object.entries(skinOf)) {
    let [x, y] = L.at[k]
    if (L === WIDE && !icons) x -= ICONS_W * 0.8
    spots.set(s, { x: Math.max(4, x * kx), y: TOP + y * ky, S })
  }
  return spots
}

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

for (const [s, p] of layout()) s.place(p.x, p.y, p.S)
amp.focus()

// slamming a skin up into the goo is the big splash; other hits just wobble it
for (const s of skins) {
  s.onImpact = (speed, axis) => {
    const x = s.x + (s.w * s.S) / 2
    const ceilHit = axis === 'y' && s.y < innerHeight / 2
    shell.splash(x, clamp(speed * (ceilHit ? 0.32 : 0.05), 20, 460), ceilHit ? (s.w * s.S) / 3 : 30)
  }
}

addEventListener('resize', () => {
  wallpaper.resize()
  for (const [s, p] of layout()) {
    if (s.state === 'open') s.place(clamp(s.x, 0, innerWidth - 60), clamp(s.y, TOP, innerHeight - 60), p.S)
    else s.home = p
  }
})

setTimeout(() => shell.balloon('Welcome to SloshOS', 'Every skin is full of real liquid. Grab one anywhere and give it a shake.'), 900)

// goo drops falling off the bar land in whatever liquid they hit
const probe = new Int32Array(8)
function dripInto() {
  const drops = shell.goobar.drops
  for (let i = drops.length - 1; i >= 0; i--) {
    const d = drops[i]
    for (const s of skins) {
      if (s.state !== 'open' || s.anim) continue
      const lx = (d.x - s.x) / s.S, ly = (d.y - s.y) / s.S
      if (lx < 0 || ly < 0 || lx > s.w || ly > s.h) continue
      const v = s.vesselAt(lx, ly)
      if (!v || v.fluid.near(lx - v.x, ly - v.y, v.fluid.s * 1.5, probe) < 2) continue
      v.fluid.burst(lx - v.x, ly - v.y, 26, 260 + d.vy * 0.3)
      drops.splice(i, 1)
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
requestAnimationFrame(frame)
