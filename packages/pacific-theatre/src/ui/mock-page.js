// Dev-only (ui.html, not in the build): the round-two interface of a box
// (ROUND-2.md §1.1–1.2, §5) with the real link.js and the real UI modules,
// driven by src/ui/mock-battle.js over a real battle file instead of the
// engine, which is being rebuilt beside it. No WebGL: a plan of the box in a
// 2D canvas (the table's coast, the sites, the units where the record has
// them at the battle's time), and a click on it selects the nearest unit
// within 24 px, as the box's picking will (ROUND-2 §4).
//
//   npx vite --port 5297            (inside packages/pacific-theatre)
//   http://127.0.0.1:5297/ui.html?box=pearl-harbor&t=07:55
//   …#battle=midway&unit=vf-3-cap-noon%2312&station=pilot   the URL's unit, offered after the box is entered
//
// window.__app is a small stand-in for App with what link.js and the tools
// read (data, battle, ui, events, updaters, url, mode, frames, ready,
// settle(), stats()); app.battle.calls lists every call link.js made into
// the Battle API, for the smoke test.

import { dataBase } from '../config.js'
import { loadData } from '../data/load.js'
import { EventCard } from './card.js'
import { h } from './dom.js'
import { link } from '../link.js'
import { MockBattle } from './mock-battle.js'
import { ASSIST_VALUES, loadAssist, saveAssist } from './setting.js'

const status = document.getElementById('mock-status')
const warnings = []
const warn = (m) => {
  warnings.push(m)
  console.warn(m)
}

async function start() {
  status.textContent = 'reading the record'
  const data = await loadData(dataBase(), warn)
  const q = new URLSearchParams(location.search)
  const app = {
    data,
    warn,
    warnings,
    events: new EventTarget(),
    updaters: [],
    mode: 'table',
    active: null,
    idle: { idle: true },
    url: { kept: {}, written: null, battle: null, t: null, moment: null, unit: null, station: null },
    clock: { date: 0, setDate(d) { this.date = d } },
    frames: 0,
    ready: false,
    assist: loadAssist(),
    setMode(m) {
      this.mode = m
    },
    setAssist(v) {
      if (!ASSIST_VALUES.includes(v)) return
      this.assist = v
      this.battle.assist = v
      saveAssist(v)
    },
    pushUrl() {
      writeHash(true)
    },
    replaceUrl() {
      writeHash(true)
    },
    prefetch() {},
    settle() {},
    stats() {
      return { scene: 'mock', mode: this.mode, distance: 0 }
    },
  }
  window.__app = app
  app.battle = new MockBattle(app)
  app.battle.assist = app.assist

  // the interface: the card, and what link.js builds on it (the bar, the unit list)
  const root = h('div', { id: 'ui' })
  document.body.appendChild(root)
  const help = h('div', { class: 'help hidden' })
  const ui = { root, help, tour: { setting: false, active: false, open() {}, back() {}, next() {} }, onCardClosed() {} }
  ui.card = new EventCard(root, app, ui)
  ui.openBriefing = (d) => ui.card.openBriefing(d)
  ui.openAfter = (d) => ui.card.openAfter(d)
  ui.openCredits = () => ui.card.openCredits()
  app.ui = ui
  link(app, ui)

  // the keys ui.js owns in the app: Esc (the list, then the card), the arrows (the stops)
  addEventListener('keydown', (e) => {
    if (e.defaultPrevented || e.target.closest?.('input, textarea')) return
    if (e.key === 'Escape') {
      if (ui.unitList?.isOpen) return ui.unitList.close()
      if (ui.card.isOpen) return ui.card.close()
    }
    if (app.mode === 'watch' && (e.key === 'ArrowRight' || e.key === 'ArrowLeft') && !e.target.closest?.('button')) {
      e.preventDefault()
      ui.onStep(e.key === 'ArrowRight' ? 1 : -1)
    }
  })

  // the hash: #battle, #t, #moment, #unit, #station, as App writes them
  let written = null
  let timer = 0
  function writeHash(now = false) {
    const sim = app.battle.sim
    if (!sim) return
    if (!now && (timer -= 1) > 0) return
    timer = 15
    const p = new URLSearchParams()
    p.set('battle', app.url.battle)
    p.set('t', sim.clock.label(sim.t, { seconds: true }))
    for (const k of ['moment', 'unit', 'station']) if (app.url[k]) p.set(k, app.url[k])
    const hash = `#${p.toString().replace(/%3A/g, ':')}`
    if (hash === written) return
    written = hash
    history.replaceState(null, '', `${location.pathname}${location.search}${hash}`)
  }
  app.writeHash = writeHash

  // into the box: the hash's battle (with its unit), or ?box=
  status.textContent = 'entering the box'
  const hash = new URLSearchParams(location.hash.replace(/^#/, ''))
  if (!hash.get('battle')) hash.set('battle', q.get('box') || 'pearl-harbor')
  if (!hash.get('t') && q.get('t')) hash.set('t', q.get('t'))
  await app.urlBattle(hash)
  if (q.has('paused')) app.battle.pause()
  status.textContent = ''

  // the plan, and the frame
  const plan = new Plan(document.getElementById('plan'), app)
  app.plan = plan
  plan.canvas.addEventListener('click', (e) => {
    const i = plan.pick(e.clientX, e.clientY)
    if (i != null) app.battle.select(i)
  })
  let last = performance.now()
  const frame = (now) => {
    const dt = Math.max(0, Math.min(0.1, (now - last) / 1000))
    last = now
    app.battle.tick(dt)
    for (const u of app.updaters) u(dt)
    plan.draw()
    writeHash()
    app.frames++
    requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
  app.ready = true
}

/** The box from above: the coast, the sites, the units at the battle's time; a pick within 24 px. */
class Plan {
  constructor(canvas, app) {
    this.canvas = canvas
    this.app = app
    this.ctx = canvas.getContext('2d')
    this.pts = []
    this.coast = null
    addEventListener('resize', () => (this.sized = false))
  }

  fit() {
    const c = this.canvas
    const dpr = Math.min(2, devicePixelRatio || 1)
    c.width = Math.round(innerWidth * dpr)
    c.height = Math.round(innerHeight * dpr)
    c.style.width = `${innerWidth}px`
    c.style.height = `${innerHeight}px`
    this.dpr = dpr
    const box = this.app.battle.loaded?.box
    if (!box) return
    const [lo0, la0, lo1, la1] = box.bounds
    const a = box.proj.toWorld([lo0, la1])
    const b = box.proj.toWorld([lo1, la0])
    this.w = { x0: Math.min(a[0], b[0]), x1: Math.max(a[0], b[0]), z0: Math.min(a[1], b[1]), z1: Math.max(a[1], b[1]) }
    // (room for the bar below and the card on the right on a wide screen)
    const right = innerWidth > 760 ? 400 : 0
    const W = innerWidth - right - 32
    const H = innerHeight - 140
    this.s = Math.min(W / (this.w.x1 - this.w.x0), H / (this.w.z1 - this.w.z0))
    this.ox = 16 + (W - (this.w.x1 - this.w.x0) * this.s) / 2
    this.oy = 60 + (H - (this.w.z1 - this.w.z0) * this.s) / 2
    this.coast = this.coastPaths(box)
    this.sized = true
    this.boxId = box.id
  }

  toScreen(x, z) {
    return [this.ox + (x - this.w.x0) * this.s, this.oy + (z - this.w.z0) * this.s]
  }

  coastPaths(box) {
    const coast = this.app.data.coast
    const out = []
    const [lo0, la0, lo1, la1] = box.bounds
    const pad = 0.5
    for (const f of coast?.features || []) {
      const g = f.geometry
      if (!g) continue
      const polys = g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : []
      for (const p of polys) {
        const ring = p[0]
        if (!ring?.length) continue
        let hit = false
        for (const [lon, lat] of ring) if (lon > lo0 - pad && lon < lo1 + pad && lat > la0 - pad && lat < la1 + pad) hit = true
        if (hit) out.push(ring.map((ll) => box.proj.toWorld(ll)))
      }
    }
    return out
  }

  draw() {
    const app = this.app
    const sim = app.battle.sim
    if (!sim) return
    if (!this.sized || this.boxId !== app.battle.loaded?.box.id) this.fit()
    const ctx = this.ctx
    const d = this.dpr
    ctx.setTransform(d, 0, 0, d, 0, 0)
    ctx.clearRect(0, 0, innerWidth, innerHeight)
    // the box's sea and its edge
    const [ax, ay] = this.toScreen(this.w.x0, this.w.z0)
    const [bx, by] = this.toScreen(this.w.x1, this.w.z1)
    ctx.fillStyle = '#10283b'
    ctx.fillRect(ax, ay, bx - ax, by - ay)
    ctx.strokeStyle = 'rgba(238,242,241,0.18)'
    ctx.strokeRect(ax + 0.5, ay + 0.5, bx - ax - 1, by - ay - 1)
    ctx.save()
    ctx.beginPath()
    ctx.rect(ax, ay, bx - ax, by - ay)
    ctx.clip()
    ctx.fillStyle = '#2f3b33'
    ctx.strokeStyle = 'rgba(220,196,154,0.55)'
    for (const ring of this.coast || []) {
      ctx.beginPath()
      ring.forEach(([x, z], i) => {
        const [sx, sy] = this.toScreen(x, z)
        if (i) ctx.lineTo(sx, sy)
        else ctx.moveTo(sx, sy)
      })
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
    }
    // the sites
    ctx.fillStyle = 'rgba(220,196,154,0.5)'
    for (const s of sim.record.sites) {
      const [sx, sy] = this.toScreen(s.x, s.z)
      ctx.fillRect(sx - 1.5, sy - 1.5, 3, 3)
    }
    // the units
    const sel = app.battle.state?.selected
    const held = sim.player?.unitIndex ?? -1
    this.pts = []
    const col = (side, a = 1) => (side === 'jp' ? `rgba(214,96,82,${a})` : `rgba(160,196,230,${a})`)
    for (const p of sim.positions()) {
      const [sx, sy] = this.toScreen(p.x, p.z)
      if (sx < ax - 20 || sx > bx + 20 || sy < ay - 20 || sy > by + 20) continue
      this.pts.push({ index: p.index, sx, sy })
      ctx.save()
      ctx.translate(sx, sy)
      ctx.rotate((p.h || 0) * (Math.PI / 180))
      if (p.kind === 'ship') {
        ctx.fillStyle = col(p.side, p.sunk ? 0.25 : 0.95)
        ctx.beginPath()
        ctx.moveTo(0, -6)
        ctx.lineTo(2.4, -2)
        ctx.lineTo(2.4, 5)
        ctx.lineTo(-2.4, 5)
        ctx.lineTo(-2.4, -2)
        ctx.closePath()
        ctx.fill()
      } else if (p.kind === 'parked') {
        ctx.fillStyle = 'rgba(200,200,190,0.45)'
        ctx.fillRect(-1, -1, 2, 2)
      } else {
        ctx.fillStyle = col(p.side, 0.9)
        ctx.beginPath()
        ctx.moveTo(0, -3.5)
        ctx.lineTo(2.6, 2.5)
        ctx.lineTo(-2.6, 2.5)
        ctx.closePath()
        ctx.fill()
      }
      ctx.restore()
      if (p.index === sel || p.index === held) {
        // the selection's bracket (the held unit's ring)
        ctx.strokeStyle = p.index === held ? '#e9d6b3' : '#dcc49a'
        ctx.lineWidth = 1.5
        const r = 11
        ctx.beginPath()
        for (const [dx, dy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
          ctx.moveTo(sx + dx * r, sy + dy * (r - 4))
          ctx.lineTo(sx + dx * r, sy + dy * r)
          ctx.lineTo(sx + dx * (r - 4), sy + dy * r)
        }
        ctx.stroke()
        if (p.index === held) {
          ctx.beginPath()
          ctx.arc(sx, sy, 15, 0, Math.PI * 2)
          ctx.stroke()
        }
        ctx.lineWidth = 1
      }
    }
    ctx.restore()
  }

  /** The nearest unit within 24 px of the pointer (scene/pick.js's rule). */
  pick(cx, cy) {
    let best = null
    let bd = 24 * 24
    for (const p of this.pts) {
      const d2 = (p.sx - cx) ** 2 + (p.sy - cy) ** 2
      if (d2 < bd) [best, bd] = [p.index, d2]
    }
    return best
  }
}

start().catch((err) => {
  console.error(err)
  status.textContent = `something went wrong: ${err.message}`
})
