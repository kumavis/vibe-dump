// The toy's HUD (TOY.md §2 "Loud feedback"): DOM over the canvas, fed each
// frame from the world and its events. The score and the combo, the clock
// and the wave, the lives and the carrier's bar, the boss bar with her
// turrets as segments; your health, the guns' heat, the bombs and the
// torpedo with the reload; over the scene a bracket and a health bar on
// every enemy (red and marked when one is lining up on you), arrows at the
// screen's edge to the nearest ones, the lock-on reticle on a ship, damage
// numbers, the SHOT DOWN and SUNK! stamps, the wave banners and the
// warnings. The screens (start, pause, end) are screens.js's.

import * as THREE from 'three'
import { Screens } from './screens.js'

const _v = new THREE.Vector3()
const fmtClock = (s) => {
  const v = Math.max(0, Math.ceil(s))
  return `${Math.floor(v / 60)}:${String(v % 60).padStart(2, '0')}`
}
const PLANE = '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M12 2.5c.8 0 1.3.9 1.3 2v4.8l8.2 3.4v2l-8.2-2v4.4l2.6 2v1.6L12 20l-3.9.7v-1.6l2.6-2v-4.4l-8.2 2v-2l8.2-3.4V4.5c0-1.1.5-2 1.3-2z"/></svg>'

export class ToyHud {
  constructor(root, toy) {
    this.root = root
    this.toy = toy
    root.innerHTML = `
      <div class="toy-vignette"></div>
      <div class="toy-marks"></div>
      <div class="toy-nums"></div>
      <div class="toy-reticle" aria-hidden="true"></div>
      <div class="toy-lock" aria-hidden="true"><span></span></div>
      <div class="toy-hud">
        <div class="toy-tl"><div class="toy-score">0</div><div class="toy-combo"><b></b><span></span><i><u></u></i></div></div>
        <div class="toy-tm"><div class="toy-clock">3:00</div><div class="toy-wave"></div>
          <div class="toy-boss" hidden><div class="toy-boss-name"></div><div class="toy-boss-bar"></div></div></div>
        <div class="toy-tr"><div class="toy-lives"></div><div class="toy-carrier"><span></span><i><u></u></i></div></div>
        <div class="toy-status">
          <div class="toy-meter toy-hp"><span>Health</span><i><u></u></i></div>
          <div class="toy-meter toy-heat"><span>Guns</span><i><u></u></i></div>
          <div class="toy-ammo"><span class="toy-bombs"></span><span class="toy-torp"></span><span class="toy-reload"></span></div>
        </div>
      </div>
      <div class="toy-banner"></div>
      <div class="toy-stamp"></div>
      <div class="toy-warn" role="status"></div>
      <div class="toy-screen" hidden></div>`
    const q = (s) => root.querySelector(s)
    this.el = {
      vignette: q('.toy-vignette'),
      marks: q('.toy-marks'),
      nums: q('.toy-nums'),
      reticle: q('.toy-reticle'),
      lock: q('.toy-lock'),
      hud: q('.toy-hud'),
      score: q('.toy-score'),
      combo: q('.toy-combo'),
      clock: q('.toy-clock'),
      wave: q('.toy-wave'),
      boss: q('.toy-boss'),
      bossName: q('.toy-boss-name'),
      bossBar: q('.toy-boss-bar'),
      lives: q('.toy-lives'),
      carrier: q('.toy-carrier'),
      hp: q('.toy-hp u'),
      heat: q('.toy-heat'),
      bombs: q('.toy-bombs'),
      torp: q('.toy-torp'),
      reload: q('.toy-reload'),
      banner: q('.toy-banner'),
      stamp: q('.toy-stamp'),
      warn: q('.toy-warn'),
      screen: q('.toy-screen'),
    }
    this.marks = []
    this.nums = []
    this.numFor = new Map()
    this.bannerUntil = 0
    this.stampUntil = 0
    this.time = 0
    this.last = {}
    this.screens = new Screens(this.el.screen, toy, root)
  }

  bind(world) {
    this.world = world
    this.numFor.clear()
    for (const n of this.nums) n.el.classList.remove('go')
    this.last = {}
    this.el.boss.hidden = true
    this.el.banner.className = 'toy-banner'
    this.el.stamp.className = 'toy-stamp'
  }

  startScreen(side) {
    this.screens.start(side)
  }

  pauseScreen(on) {
    this.screens.pause(on)
  }

  endScreen(data) {
    this.screens.end(data)
  }

  hideScreens() {
    this.screens.hide()
  }

  /** A world event the HUD shows: numbers, stamps, banners, the hurt flash. */
  event(e, w) {
    switch (e.type) {
      case 'hit':
        this.number(e, w)
        break
      case 'shotdown':
        this.stamp('Shot down', `+${e.pts}`, 'down')
        break
      case 'sunk':
        this.stamp('Sunk!', `+${e.pts}`, 'sunk')
        break
      case 'point-out':
        if (e.th?.enemy) this.stamp(e.part?.name === 'magazine' ? 'Magazine!' : 'Turret out!', '', 'down')
        break
      case 'lost':
        this.stamp('Aircraft lost', e.lives > 0 ? `${e.lives} left` : '', 'lost')
        break
      case 'carrier-lost':
        this.stamp('The carrier is lost', '', 'lost')
        break
      case 'banner':
        this.banner(e.text, e.sub, e.small)
        break
      case 'hurt':
        this.el.vignette.classList.remove('go')
        void this.el.vignette.offsetWidth
        this.el.vignette.classList.add('go')
        break
      case 'jam':
        this.warnT = { text: 'Guns hot!', until: this.time + 1.2 }
        break
      default:
    }
  }

  banner(text, sub = '', small = false) {
    const b = this.el.banner
    b.innerHTML = `<b>${text}</b>${sub ? `<span>${sub}</span>` : ''}`
    b.className = `toy-banner${small ? ' small' : ''}`
    void b.offsetWidth
    b.classList.add('go')
  }

  stamp(text, sub, kind) {
    const s = this.el.stamp
    s.innerHTML = `<b>${text}</b>${sub ? `<span>${sub}</span>` : ''}`
    s.className = `toy-stamp ${kind}`
    void s.offsetWidth
    s.classList.add('go')
  }

  /** A damage number where the hit landed (hits on one target close together add up in one number). */
  number(e, w) {
    const key = e.th
    const now = this.time
    let n = this.numFor.get(key)
    if (n && now - n.t < 0.35 && n.el.classList.contains('go')) {
      n.amount += e.amount
      n.t = now
    } else {
      n = this.nums.find((x) => now - x.t > 0.9) || null
      if (!n) {
        if (this.nums.length >= 14) n = this.nums.reduce((a, b) => (a.t < b.t ? a : b))
        else {
          const el = document.createElement('div')
          el.className = 'toy-num'
          this.el.nums.appendChild(el)
          n = { el, t: -9 }
          this.nums.push(n)
        }
      }
      n.amount = e.amount
      n.t = now
      n.x = e.x
      n.y = e.y + 4
      n.z = e.z
      this.numFor.set(key, n)
    }
    n.big = e.weapon !== 'bullet' || e.part
    n.el.textContent = String(Math.round(n.amount))
    n.el.classList.toggle('big', !!n.big)
    n.el.classList.remove('go')
    void n.el.offsetWidth
    n.el.classList.add('go')
  }

  /** World (arena-frame) point to the screen: { x, y, on } (on: in front of the camera and inside the screen). */
  project(w, x, y, z) {
    const cam = this.toy.scene.camera
    _v.set(x + w.centre.x, y, z + w.centre.z).project(cam)
    const W = innerWidth
    const H = innerHeight
    const behind = _v.z > 1
    let sx = ((_v.x + 1) / 2) * W
    let sy = ((1 - _v.y) / 2) * H
    if (behind) {
      sx = W - sx
      sy = H - sy
    }
    return { x: sx, y: sy, on: !behind && sx > 0 && sx < W && sy > 0 && sy < H, behind }
  }

  mark(i) {
    let m = this.marks[i]
    if (!m) {
      const el = document.createElement('div')
      el.className = 'toy-mark'
      el.innerHTML = '<i><u></u></i>'
      this.el.marks.appendChild(el)
      m = { el, bar: el.querySelector('u'), cls: '' }
      this.marks[i] = m
    }
    return m
  }

  update(dt, w) {
    this.time += dt
    const el = this.el
    const me = w.me
    const W = innerWidth
    const H = innerHeight
    this.el.hud.hidden = !this.toy.running && !this.toy.paused && !w.over && w.t === 0
    // the score, the combo
    const sc = String(w.score || 0)
    if (this.last.score !== sc) {
      el.score.textContent = sc
      this.last.score = sc
    }
    const c = w.combo
    const live = c && w.t <= c.until && c.count >= 3
    el.combo.classList.toggle('on', !!live)
    if (live) {
      const t = `×${c.mult}`
      if (this.last.mult !== t) {
        el.combo.querySelector('b').textContent = t
        this.last.mult = t
        el.combo.classList.remove('pop')
        void el.combo.offsetWidth
        el.combo.classList.add('pop')
      }
      el.combo.querySelector('span').textContent = `combo ${c.count}`
      el.combo.querySelector('u').style.width = `${Math.max(0, ((c.until - w.t) / 2.6) * 100).toFixed(1)}%`
    } else this.last.mult = null
    // the clock and the wave
    const left = w.duration ? fmtClock(w.duration - w.t) : ''
    if (this.last.clock !== left) {
      el.clock.textContent = left
      this.last.clock = left
    }
    const wave = w.waveName || ''
    if (this.last.wave !== wave) {
      el.wave.textContent = wave
      this.last.wave = wave
    }
    // the lives and the carrier
    const lives = Math.max(0, w.lives ?? 3)
    if (this.last.lives !== lives) {
      el.lives.innerHTML = Array.from({ length: 3 }, (_, i) => `<span class="${i < lives ? 'on' : ''}">${PLANE}</span>`).join('')
      this.last.lives = lives
    }
    const cv = w.carrier
    if (cv) {
      const f = Math.max(0, cv.hp / cv.hpMax)
      el.carrier.querySelector('span').textContent = 'Carrier'
      el.carrier.querySelector('u').style.width = `${(f * 100).toFixed(1)}%`
      el.carrier.classList.toggle('low', f < 0.35)
      el.carrier.classList.toggle('hit', w.t - (cv.hitT ?? -9) < 0.3)
    }
    // the boss bar: her turrets as segments, then her magazine
    const boss = w.boss
    el.boss.hidden = !boss
    if (boss) {
      const key = boss.points.map((p) => `${p.open ? 1 : 0}${Math.ceil((p.hp / p.hpMax) * 20)}`).join('') + boss.alive
      if (this.last.boss !== key) {
        this.last.boss = key
        el.bossName.textContent = boss.name
        el.bossBar.innerHTML = boss.points.map((p) => `<span class="${p.hp <= 0 ? 'out' : p.open ? 'open' : 'shut'}${p.name === 'magazine' ? ' mag' : ''}" title="${p.label}"><u style="width:${((p.hp / p.hpMax) * 100).toFixed(1)}%"></u></span>`).join('')
      }
    }
    // your health, the guns, the bombs and the torpedo
    if (me) el.hp.style.width = `${Math.max(0, (me.hp / me.hpMax) * 100).toFixed(1)}%`
    el.hp.parentElement.parentElement.classList.toggle('low', me && me.hp < 35)
    const g = w.gun
    el.heat.querySelector('u').style.width = `${((g?.heat ?? 0) * 100).toFixed(1)}%`
    el.heat.classList.toggle('jam', !!g?.jam)
    const am = w.ammo
    if (am) {
      const key = `${am.bombs}${am.torpedo}${Math.ceil(am.reloadIn)}${w.ring?.ready ? 1 : 0}${am.armed ? 1 : 0}`
      if (this.last.ammo !== key) {
        this.last.ammo = key
        el.bombs.innerHTML = Array.from({ length: am.bombsMax }, (_, i) => `<b class="${i < am.bombs ? 'on' : ''}"></b>`).join('')
        el.torp.innerHTML = `<b class="${am.torpedo ? (am.armed ? 'on armed' : 'on') : ''}"></b>`
        el.torp.title = am.torpedo ? (am.armed ? 'Torpedo armed (low over the water)' : 'Torpedo: fly low to arm') : 'No torpedo'
        el.reload.textContent = am.bombs < am.bombsMax || !am.torpedo ? `reload ${Math.ceil(am.reloadIn)}s` : ''
      }
    }
    // the markers over the enemies, the arrows to the ones off screen
    let n = 0
    const off = []
    if (me && w.t > 0) {
      for (const th of w.things) {
        if (!th.enemy || th.alive !== 1) continue
        const top = th.kind === 'ship' ? (th.model?.H ?? 20) * 0.35 : 0
        const p = this.project(w, th.x, th.y + top, th.z)
        if (!p.on) {
          off.push({ th, p, d: Math.hypot(th.x - me.x, th.z - me.z) })
          continue
        }
        const m = this.mark(n++)
        const cls = `toy-mark ${th.kind}${th.aiming ? ' aiming' : ''}${w.t - (th.hitT ?? -9) < 0.12 ? ' flash' : ''}`
        if (m.cls !== cls) {
          m.el.className = cls
          m.cls = cls
        }
        m.el.style.transform = `translate(${p.x.toFixed(0)}px, ${p.y.toFixed(0)}px)`
        m.bar.style.width = `${Math.max(0, (th.hp / th.hpMax) * 100).toFixed(0)}%`
        m.el.style.display = ''
        // the weak points: big glowing rings where they can be hit
        if (th.points) {
          for (const pt of th.points) {
            if (pt.hp <= 0 || !pt.open) continue
            const P = this.toy.pointWorld(th, pt)
            const q = this.project(w, P.x, P.y, P.z)
            if (!q.on) continue
            const mm = this.mark(n++)
            const c2 = `toy-mark point${pt.name === 'magazine' ? ' mag' : ''}${w.t - (pt.hitT ?? -9) < 0.12 ? ' flash' : ''}`
            if (mm.cls !== c2) {
              mm.el.className = c2
              mm.cls = c2
            }
            mm.el.style.transform = `translate(${q.x.toFixed(0)}px, ${q.y.toFixed(0)}px)`
            mm.bar.style.width = `${Math.max(0, (pt.hp / pt.hpMax) * 100).toFixed(0)}%`
            mm.el.style.display = ''
          }
        }
      }
      off.sort((a, b) => a.d - b.d)
      for (const o of off.slice(0, 3)) {
        const m = this.mark(n++)
        const cx = W / 2
        const cy = H / 2
        const ang = Math.atan2(o.p.y - cy, o.p.x - cx)
        // (inside the screen's edge, clear of the corners' readouts and the status at the foot)
        const rx = W / 2 - 34
        const ry = H / 2 - 34
        const k = Math.min(rx / Math.abs(Math.cos(ang) || 1e-6), ry / Math.abs(Math.sin(ang) || 1e-6))
        const ay = Math.max(110 - cy, Math.min(H - 130 - cy, Math.sin(ang) * k))
        const cls = `toy-mark arrow ${o.th.kind}${o.th.aiming ? ' aiming' : ''}`
        if (m.cls !== cls) {
          m.el.className = cls
          m.cls = cls
        }
        m.el.style.transform = `translate(${(cx + Math.cos(ang) * k).toFixed(0)}px, ${(cy + ay).toFixed(0)}px) rotate(${ang.toFixed(3)}rad)`
        m.el.style.display = ''
      }
    }
    for (let i = n; i < this.marks.length; i++) if (this.marks[i].el.style.display !== 'none') this.marks[i].el.style.display = 'none'
    // the reticle over the nose, the lock-on bracket on a ship
    if (me && me.alive === 1) {
      const c2 = Math.cos(me.pitch)
      const p = this.project(w, me.x + Math.sin(me.yaw) * c2 * 220, me.y + Math.sin(me.pitch) * 220, me.z - Math.cos(me.yaw) * c2 * 220)
      el.reticle.style.transform = `translate(${p.x.toFixed(0)}px, ${p.y.toFixed(0)}px)`
      el.reticle.style.display = ''
    } else el.reticle.style.display = 'none'
    const lk = w.lock
    if (lk?.th && lk.th.alive === 1 && me?.alive === 1) {
      const th = lk.th
      const P = lk.part ? this.toy.pointWorld(th, lk.part) : { x: th.x, y: (th.model?.deck ?? 8) + 4, z: th.z }
      const p = this.project(w, P.x, P.y, P.z)
      el.lock.style.display = p.on ? '' : 'none'
      const s = 90 - 50 * Math.min(1, lk.progress)
      el.lock.style.transform = `translate(${p.x.toFixed(0)}px, ${p.y.toFixed(0)}px)`
      el.lock.style.width = el.lock.style.height = `${s.toFixed(0)}px`
      el.lock.classList.toggle('locked', !!lk.locked)
      el.lock.classList.toggle('far', !!lk.locked && !lk.inRange)
      el.lock.querySelector('span').textContent = !lk.locked ? '' : !lk.weapon ? 'Locked · reloading' : lk.inRange ? (lk.weapon === 'torpedo' ? 'Drop! · torpedo' : 'Drop!') : 'Locked · closer'
    } else el.lock.style.display = 'none'
    // the damage numbers rise from where they landed
    for (const nm of this.nums) {
      const age = this.time - nm.t
      if (age > 0.9) continue
      const p = this.project(w, nm.x, nm.y, nm.z)
      nm.el.style.left = `${p.x.toFixed(0)}px`
      nm.el.style.top = `${(p.y - age * 50).toFixed(0)}px`
      nm.el.style.visibility = p.on ? 'visible' : 'hidden'
    }
    // the warnings, the loudest first
    let warn = ''
    if (me?.edge) warn = 'Turning back'
    else if (w.things.some((th) => th.aiming)) warn = 'On your tail!'
    else if (w.flakNear > w.t) warn = 'Flak!'
    else if (this.warnT && this.time < this.warnT.until) warn = this.warnT.text
    if (this.last.warn !== warn) {
      el.warn.textContent = warn
      el.warn.classList.toggle('on', !!warn)
      this.last.warn = warn
    }
  }

  dispose() {
    this.root.innerHTML = ''
  }
}
