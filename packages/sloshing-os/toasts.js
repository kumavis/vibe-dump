// toasts.js — notification toasts that behave like lava-lamp globules.
// DOM blobs live inside a container with an SVG goo filter, so rising ambient
// globules visibly merge into the toast bubbles. Text sits on an unfiltered
// twin layer so it stays crisp.

const gooLayer = document.getElementById('toast-goo')
const textLayer = document.getElementById('toast-text')

const blobs = []   // toasts + ambient globules, one physics pool
let slotSerial = 0

function columnX() { return innerWidth - 128 }

function makeBlobEl(w, h, cls = '') {
  const el = document.createElement('div')
  el.className = 'goo-blob ' + cls
  el.style.width = w + 'px'
  el.style.height = h + 'px'
  gooLayer.appendChild(el)
  return el
}

export function toast(msg) {
  const w = Math.min(228, Math.max(132, 46 + msg.length * 7.2))
  const b = {
    kind: 'toast',
    el: makeBlobEl(w, 66),
    text: document.createElement('div'),
    w, h: 66,
    x: columnX() + (Math.random() - 0.5) * 20,
    y: innerHeight + 90,
    vy: 0, vx: 0,
    slot: slotSerial++,
    born: performance.now(),
    ttl: 6800 + Math.random() * 1200,
    phase: Math.random() * Math.PI * 2,
    leaving: false,
  }
  b.text.className = 'toast-msg'
  b.text.textContent = msg
  b.text.style.width = w + 'px'
  textLayer.appendChild(b.text)
  blobs.push(b)
  // a couple of escort droplets so every toast surfaces with goo activity
  spawnGlobule(b.x + (Math.random() - 0.5) * 40)
  spawnGlobule(b.x + (Math.random() - 0.5) * 40)
}

function spawnGlobule(x = columnX() + (Math.random() - 0.5) * 70) {
  const s = 10 + Math.random() * 22
  blobs.push({
    kind: 'globule',
    el: makeBlobEl(s, s, 'mini'),
    w: s, h: s,
    x, y: innerHeight + 30,
    vy: -(26 + Math.random() * 40), vx: 0,
    wob: Math.random() * Math.PI * 2,
    phase: Math.random() * Math.PI * 2,
  })
}

let ambientAcc = 0

// stir: horizontal desktop agitation (from window drags) shoves the goo too
export function stepToasts(dt, stir) {
  ambientAcc += dt
  if (ambientAcc > 1.6) {
    ambientAcc = 0
    if (Math.random() < 0.75) spawnGlobule()
  }

  const now = performance.now()
  // stack: living toasts sorted by age, newest at the bottom of the pile
  const living = blobs.filter(b => b.kind === 'toast' && !b.leaving)
    .sort((a, b) => b.born - a.born)

  for (let i = blobs.length - 1; i >= 0; i--) {
    const b = blobs[i]
    b.phase += dt * 3

    if (b.kind === 'toast') {
      if (!b.leaving && now - b.born > b.ttl) b.leaving = true
      let ty
      if (b.leaving) {
        b.vy += -260 * dt // detach and float away like hot wax
        b.y += b.vy * dt
        ty = null
      } else {
        const idx = living.indexOf(b)
        ty = innerHeight - 150 - idx * 88
        b.vy += ((ty - b.y) * 14 - b.vy * 5.2) * dt
        b.y += b.vy * dt
      }
      b.vx += ((columnX() - b.x) * 6 - b.vx * 4 + (stir || 0) * 0.04) * dt
      b.x += b.vx * dt

      const settled = !b.leaving && ty !== null && Math.abs(b.y - ty) < 26
      b.text.style.opacity = b.leaving ? '0' : settled ? '1' : '0'
      if (b.y < -120) { removeBlob(i); continue }
    } else {
      b.wob += dt * 4
      b.y += b.vy * dt
      b.x += Math.sin(b.wob) * 14 * dt + (stir || 0) * 0.00025
      if (b.y < -60) { removeBlob(i); continue }
    }

    const sx = 1 + Math.sin(b.phase) * 0.09
    const sy = 1 - Math.sin(b.phase) * 0.09
    b.el.style.transform =
      `translate(${b.x - b.w / 2}px, ${b.y - b.h / 2}px) scale(${sx}, ${sy})`
    if (b.text) {
      b.text.style.transform =
        `translate(${b.x - b.w / 2}px, ${b.y - 14}px)`
    }
  }
}

function removeBlob(i) {
  const b = blobs[i]
  b.el.remove()
  if (b.text) b.text.remove()
  blobs.splice(i, 1)
}
