// The HUD (ENGINEERING.md §7; R7 §4.11; R8 §5.1): DOM over the canvas. The
// battle clock in its zone; the record's beats as one-line subtitles; the
// plot inset (a radar plot on a ship with radar, a lookout plot otherwise);
// the unit's instruments in its own units (knots, feet and yards for the US
// Navy; km/h and metres for the Imperial Navy; a toggle); the target bracket
// with range and time of flight; the aim reticle; the release cue and the
// torpedo envelope; the time-of-flight countdown and the spotting tags; the
// checkpoint prompt and the restart offers. Its words name the ship and what
// happened, never "Kill", "Destroyed" or "Mission accomplished".

import * as THREE from 'three'

const STYLE = `
.pt-hud { position: fixed; inset: 0; pointer-events: none; font: 12px/1.35 Inter, system-ui, sans-serif; color: #e9e4d6; text-shadow: 0 1px 2px rgba(0,0,0,.85); z-index: 20; }
.pt-hud .clock { position: absolute; left: 14px; top: 12px; }
.pt-hud .clock b { font-size: 18px; font-weight: 600; letter-spacing: .02em; font-variant-numeric: tabular-nums; }
.pt-hud .clock .sub { opacity: .75; }
.pt-hud .subs { position: absolute; left: 50%; bottom: 64px; transform: translateX(-50%); text-align: center; max-width: min(720px, 90vw); }
.pt-hud .subs div { margin: 2px 0; padding: 2px 10px; background: rgba(8,10,12,.45); border-radius: 3px; transition: opacity .6s; }
.pt-hud .plot { position: absolute; right: 14px; top: 12px; width: 168px; height: 168px; border-radius: 50%; background: rgba(6,12,10,.55); border: 1px solid rgba(200,220,200,.25); }
.pt-hud .plot-label { position: absolute; right: 14px; top: 184px; width: 168px; text-align: center; opacity: .7; font-size: 11px; }
.pt-hud .inst { position: absolute; left: 14px; bottom: 14px; min-width: 210px; padding: 8px 10px; background: rgba(8,10,12,.45); border-radius: 4px; font-variant-numeric: tabular-nums; white-space: pre; }
.pt-hud .inst .warn { color: #f0b860; }
.pt-hud .msg { position: absolute; left: 50%; top: 26%; transform: translateX(-50%); text-align: center; font-size: 15px; padding: 6px 14px; background: rgba(8,10,12,.5); border-radius: 4px; }
.pt-hud .msg:empty, .pt-hud .subs:empty, .pt-hud .keys:empty { display: none; }
.pt-hud .keys { position: absolute; right: 14px; bottom: 14px; max-width: 300px; padding: 8px 10px; background: rgba(8,10,12,.45); border-radius: 4px; font-size: 11px; white-space: pre-line; }
.pt-hud .mark { position: absolute; transform: translate(-50%, -50%); white-space: nowrap; font-size: 11px; }
.pt-hud .bracket { width: 34px; height: 34px; border: 1px solid rgba(240,230,200,.85); border-radius: 2px; }
.pt-hud .bracket span { position: absolute; left: 40px; top: 4px; }
.pt-hud .reticle { width: 22px; height: 22px; border: 1px solid rgba(255,255,255,.9); border-radius: 50%; }
.pt-hud .reticle span { position: absolute; left: 28px; top: 2px; }
.pt-hud .pip { width: 8px; height: 8px; border-radius: 50%; border: 1px solid #f6e3a0; }
.pt-hud .ccip { width: 14px; height: 14px; border: 1px solid #f6e3a0; transform: translate(-50%, -50%) rotate(45deg); }
.pt-hud .ccip.on { background: rgba(246,227,160,.6); }
.pt-hud .cue { position: absolute; left: 50%; top: 62%; transform: translateX(-50%); padding: 3px 10px; border: 1px solid #f6e3a0; border-radius: 3px; }
.pt-hud .cue:empty { display: none; }
.pt-hud .vignette { position: absolute; inset: 0; background: radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,.95) 75%); opacity: 0; transition: opacity .3s; }
`

const KN = 0.514444
const DEG = Math.PI / 180
const TELEGRAPH = [
  [-0.75, 'back full'],
  [-0.3, 'back one third'],
  [-0.02, 'stop'],
  [0.4, 'ahead one third'],
  [0.7, 'ahead two thirds'],
  [0.86, 'ahead standard'],
  [0.97, 'ahead full'],
  [2, 'ahead flank'],
]
const telegraphName = (f) => TELEGRAPH.find(([v]) => f <= v)?.[1] ?? 'ahead flank'

export class Hud {
  constructor(box, { container = document.body } = {}) {
    this.box = box
    if (!document.getElementById('pt-hud-style')) {
      const st = document.createElement('style')
      st.id = 'pt-hud-style'
      st.textContent = STYLE
      document.head.appendChild(st)
    }
    const el = document.createElement('div')
    el.className = 'pt-hud'
    el.innerHTML = `
      <div class="vignette"></div>
      <div class="clock"><b></b><div class="sub"></div></div>
      <canvas class="plot" width="168" height="168"></canvas><div class="plot-label"></div>
      <div class="subs"></div>
      <div class="msg"></div>
      <div class="cue"></div>
      <div class="inst"></div>
      <div class="keys"></div>
      <div class="mark bracket" style="display:none"><span></span></div>
      <div class="mark reticle" style="display:none"><span></span></div>
      <div class="mark pip" style="display:none"></div>
      <div class="mark ccip" style="display:none"></div>`
    container.appendChild(el)
    this.el = el
    this.$ = (s) => el.querySelector(s)
    this.clockB = this.$('.clock b')
    this.clockS = this.$('.clock .sub')
    this.plot = this.$('.plot')
    this.plotLabel = this.$('.plot-label')
    this.subs = this.$('.subs')
    this.msg = this.$('.msg')
    this.cue = this.$('.cue')
    this.inst = this.$('.inst')
    this.keys = this.$('.keys')
    this.bracket = this.$('.bracket')
    this.reticle = this.$('.reticle')
    this.pip = this.$('.pip')
    this.ccip = this.$('.ccip')
    this.vignette = this.$('.vignette')
    this.beatIndex = 0
    this.lines = []
    this.units = null // null: the unit's own; 'imperial' | 'metric'
    this.textT = 0
    this.message = ''
    this.messageUntil = 0
    this.keysUntil = 0
    this.visible = true
    this.v = new THREE.Vector3()
  }

  toggleUnits() {
    const own = this.box.sim?.player?.state?.units ?? 'imperial'
    const cur = this.units ?? own
    this.units = cur === 'imperial' ? 'metric' : 'imperial'
  }

  /** A message in the middle of the screen (the checkpoint, the end), for `s` seconds or until replaced. */
  say(text, s = 4) {
    this.message = text
    this.messageUntil = performance.now() / 1000 + s
  }

  showKeys(text, s = 3) {
    this.keys.textContent = text
    this.keysUntil = performance.now() / 1000 + s
  }

  setVisible(on) {
    this.visible = on
    this.el.style.display = on ? '' : 'none'
  }

  /** Project a world point to the screen: [x, y] in CSS pixels, or null behind the camera. */
  project(x, y, z) {
    const cam = this.box.camera
    this.v.set(x, y, z).project(cam)
    if (this.v.z > 1 || this.v.z < -1) return null
    return [((this.v.x + 1) / 2) * innerWidth, ((1 - this.v.y) / 2) * innerHeight]
  }

  place(el, p) {
    if (!p) {
      el.style.display = 'none'
      return
    }
    el.style.display = ''
    el.style.left = `${p[0]}px`
    el.style.top = `${p[1]}px`
  }

  update(dt) {
    if (!this.visible) return
    const box = this.box
    const sim = box.sim
    if (!sim) return
    const now = performance.now() / 1000
    const clock = sim.clock
    // the beats: new ones become subtitles for six seconds
    while (this.beatIndex < sim.beats.length) {
      const b = sim.beats[this.beatIndex++]
      if (b.kind === 'checkpoint') continue
      this.lines.push({ text: b.text, until: now + 6 })
    }
    this.lines = this.lines.filter((l) => l.until > now).slice(-3)
    this.textT -= dt
    const textNow = this.textT <= 0
    if (textNow) {
      this.textT = 0.1
      const zone = box.battleData?.clock?.name ?? clock.zone
      this.clockB.textContent = clock.label(sim.t, { seconds: true })
      const sc = box.battle?.timeScale ?? 1
      this.clockS.textContent = `${zone} · ${clock.dateLabel(sim.t)}${sc !== 1 ? ` · ×${sc}` : ''}${box.battle && !box.battle.running ? ' · paused' : ''}`
      this.subs.innerHTML = ''
      for (const l of this.lines) {
        const d = document.createElement('div')
        d.textContent = l.text
        this.subs.appendChild(d)
      }
      this.msg.textContent = now < this.messageUntil ? this.message : ''
      if (now > this.keysUntil) this.keys.textContent = ''
    }
    const pl = sim.player
    this.drawPlot(pl)
    if (!pl || !sim.state.alive[pl.unitIndex]) {
      this.inst.style.display = 'none'
      for (const m of [this.bracket, this.reticle, this.pip, this.ccip]) m.style.display = 'none'
      this.cue.textContent = ''
      this.vignette.style.opacity = 0
      return
    }
    this.inst.style.display = ''
    const st = pl.state
    const units = this.units ?? st.units
    const imp = units === 'imperial'
    const spd = (ms) => (imp ? `${(ms / KN).toFixed(0)} kn` : `${(ms * 3.6).toFixed(0)} km/h`)
    const alt = (m) => (imp ? `${Math.round(m * 3.28084).toLocaleString('en')} ft` : `${Math.round(m).toLocaleString('en')} m`)
    const rng = (m) => (imp ? `${Math.round(m * 1.09361).toLocaleString('en')} yd` : `${Math.round(m).toLocaleString('en')} m`)
    const hdg = (d) => `${String(Math.round(((d % 360) + 360) % 360)).padStart(3, '0')}°`
    if (pl.kind === 'aircraft') {
      if (textNow) {
        const lines = [
          `${spd(st.ias)} IAS   ${alt(st.alt)}`,
          `heading ${hdg(st.heading)}   throttle ${Math.round(st.throttle * 100)} %`,
          `${st.g.toFixed(1)} g${st.stall ? '   <span class="warn">stall</span>' : ''}${st.shake > 0 ? '   <span class="warn">overspeed</span>' : ''}${st.broken ? '   <span class="warn">controls damaged</span>' : ''}`,
          st.ammo.filter((a) => a.left > 0 || a.position !== 'rear').map((a) => `${a.calibreMm} mm ${a.left}`).join('  '),
          `${st.bombs ? `bombs ${st.bombs}   ` : ''}${st.torpedoes ? `torpedo ${st.torpedoes}   ` : ''}fuel ${Math.floor(st.endurance / 60)} min`,
          st.home ? `home ${hdg(st.home.bearing)} ${imp ? `${(st.home.range / 1852).toFixed(0)} nm` : `${(st.home.range / 1000).toFixed(0)} km`}` : '',
          st.aa > 0 ? '<span class="warn">AA</span>' : '',
        ]
        this.inst.innerHTML = lines.filter(Boolean).join('\n')
      }
      // the target, its lead pip, the CCIP and the release cue
      const t = st.target
      if (t) {
        const s = sim.state
        this.place(this.bracket, this.project(s.pos[3 * t.index], s.pos[3 * t.index + 1], s.pos[3 * t.index + 2]))
        this.bracket.querySelector('span').textContent = rng(t.range)
        const showPip = box.aid !== 'record' && (box.aid === 'guided' || t.range < 400)
        this.place(this.pip, showPip && t.lead ? this.project(t.lead[0], t.lead[1], t.lead[2]) : null)
      } else {
        this.bracket.style.display = 'none'
        this.pip.style.display = 'none'
      }
      const c = st.ccip
      const showCcip = c && box.aid !== 'record' && (box.aid === 'guided' || st.alt < 1500) && st.pitch < -20
      this.place(this.ccip, showCcip ? this.project(c.x, 0, c.z) : null)
      this.ccip.classList.toggle('on', !!c?.onTarget)
      let cue = ''
      if (st.release && st.pitch < -20) cue = 'release'
      else if (st.envelope && st.alt < 120) cue = st.envelope.ok ? 'in the envelope' : st.envelope.why
      if (cue !== this.cue.textContent) this.cue.textContent = cue
      this.vignette.style.opacity = st.blackout > 0.9 ? 0.9 : st.blackout > 0.4 ? 0.45 : 0
      this.reticle.style.display = 'none'
    } else {
      if (textNow) {
        const fires = st.fires.reduce((a, b) => a + b, 0)
        const ls = st.lastSalvo
        const flight = ls && sim.t < ls.landsAt ? `salvo in the air ${(ls.landsAt - sim.t).toFixed(1)} s` : ls && ls.tags.length ? `last salvo: ${[...new Set(ls.tags)].join(', ')}${ls.straddle ? ' (straddle)' : ''}` : ''
        const ready = st.turrets.filter((t) => t.role === 'main' || t.battery === 0)
        const lines = [
          `${spd(st.speed)}   ordered ${telegraphName(st.telegraph >= 0 ? st.telegraph : st.telegraph)}`,
          `heading ${hdg(st.heading)}   rudder ${Math.abs(st.rudder).toFixed(0)}° ${st.rudder > 0.5 ? 'starboard' : st.rudder < -0.5 ? 'port' : ''}`,
          `main battery ${ready.filter((t) => t.ready).length}/${ready.length} ready${st.aimTof != null ? `   time of flight ${st.aimTof.toFixed(1)} s` : ''}`,
          flight,
          `damage: fighting ${Math.round(Math.max(0, 1 - st.fight) * 100)} %  afloat ${Math.round(Math.max(0, 1 - st.float) * 100)} %${Math.abs(st.list) > 1 ? `  list ${Math.abs(st.list).toFixed(0)}°` : ''}${fires ? `  fires ${fires}` : ''}`,
          st.systemsOut.length ? `<span class="warn">${st.systemsOut.join(', ')}</span>` : '',
          st.torpedoesReady ? `torpedoes ready: ${st.torpedoesReady}` : '',
        ]
        this.inst.innerHTML = lines.filter(Boolean).join('\n')
      }
      const s = sim.state
      const i = pl.unitIndex
      const inp = pl.input
      // the aim reticle: where the main battery is laid
      if (inp.aimRange != null && inp.aimAz != null) {
        const a = inp.aimAz * DEG
        const px = s.pos[3 * i] + Math.sin(a) * inp.aimRange
        const pz = s.pos[3 * i + 2] - Math.cos(a) * inp.aimRange
        this.place(this.reticle, this.project(px, 0, pz))
        this.reticle.querySelector('span').textContent = `${rng(inp.aimRange)}${st.aimTof != null ? ` · ${st.aimTof.toFixed(1)} s` : ''}`
      } else this.reticle.style.display = 'none'
      const t = st.target
      if (t && box.aid !== 'record') {
        this.place(this.bracket, this.project(s.pos[3 * t.index], 12, s.pos[3 * t.index + 2]))
        this.bracket.querySelector('span').textContent = `${sim.slots[t.index].name} · ${rng(t.range)}${t.tof ? ` · ${t.tof.toFixed(1)} s` : ''}${t.how === 'radar' ? ' · radar' : ''}`
      } else this.bracket.style.display = 'none'
      this.pip.style.display = 'none'
      this.ccip.style.display = 'none'
      this.cue.textContent = ''
      this.vignette.style.opacity = 0
    }
  }

  /** The plot inset: radar contacts or what the lookouts see, north up, 30 km to the rim (or 15 nm). */
  drawPlot(pl) {
    const c = this.plot
    const g = c.getContext('2d')
    const W = c.width
    const R = W / 2
    g.clearRect(0, 0, W, W)
    const sim = this.box.sim
    if (!pl) {
      c.style.display = 'none'
      this.plotLabel.textContent = ''
      return
    }
    c.style.display = ''
    const st = pl.state
    const span = pl.kind === 'aircraft' ? 20000 : 30000
    g.strokeStyle = 'rgba(200,230,200,.22)'
    for (const k of [1 / 3, 2 / 3]) {
      g.beginPath()
      g.arc(R, R, R * k, 0, Math.PI * 2)
      g.stroke()
    }
    const radar = (sim._X[pl.unitIndex].model.sensors || []).length > 0
    this.plotLabel.textContent = `${radar ? 'radar plot' : 'lookouts'} · ${pl.kind === 'aircraft' ? '20 km' : '30 km'}`
    for (const ct of st.contacts || []) {
      if (ct.range > span) continue
      const a = ct.bearing * DEG
      const x = R + (Math.sin(a) * ct.range * R) / span
      const y = R - (Math.cos(a) * ct.range * R) / span
      g.fillStyle = ct.friendly ? 'rgba(150,200,255,.9)' : 'rgba(255,170,140,.95)'
      g.beginPath()
      g.arc(x, y, ct.kind === 'ship' ? 2.6 : 1.4, 0, Math.PI * 2)
      g.fill()
    }
    // own ship or aircraft, and its heading
    g.strokeStyle = 'rgba(240,235,210,.95)'
    g.beginPath()
    const h = st.heading * DEG
    g.moveTo(R, R)
    g.lineTo(R + Math.sin(h) * 10, R - Math.cos(h) * 10)
    g.stroke()
  }

  dispose() {
    this.el.remove()
  }
}
