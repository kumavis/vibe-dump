import * as THREE from 'three'
import { clamp } from '../core/mathx.js'

// The missile seeker on screen. Aboard anything carrying a Seeker
// (game/missiles.js) as `seeker`, a sight mark in the middle of the screen —
// where an unguided missile goes. While the seeker is on, a ring where it is
// looking, as wide as its lock cone, and corner brackets on whatever it holds
// — open and counting while it tracks, closed and solid once locked. A short
// line under the ring says what the last missile did (splash, decoyed, lost).
// Like the rest of the HUD it writes the DOM only when something changes.

const _p = new THREE.Vector3()
const _t = new THREE.Vector3()

export class LockBox {
  constructor(G) {
    this.G = G
    const root = document.createElement('div')
    root.id = 'seekerHud'
    root.innerHTML = '<div class="sk-pip"></div><div class="sk-cone"></div><div class="sk-box"><i class="tl"></i><i class="tr"></i><i class="bl"></i><i class="br"></i><span class="sk-tag"></span></div><div class="sk-note"></div>'
    document.getElementById('hud').appendChild(root)
    this.root = root
    this.pip = root.querySelector('.sk-pip')
    this.cone = root.querySelector('.sk-cone')
    this.box = root.querySelector('.sk-box')
    this.tag = root.querySelector('.sk-tag')
    this.note = root.querySelector('.sk-note')
    this.noteT = 0
    this.last = {}
    const say = (text, cls, t = 1.8) => {
      this.note.textContent = text
      this.note.className = 'sk-note ' + cls
      this.noteT = t
    }
    G.events.on('missile:detonated', ({ cause, armed, hits, kills }) => {
      if (G.vehicle?.seeker == null) return
      if (!armed) say('DUD — too close to arm', 'warn')
      else if (kills) say(`SPLASH · ${kills} KILLED`, 'bad')
      else if (hits) say(`SPLASH · ${hits} HIT`, 'bad')
      else say(cause === 'selfdestruct' ? 'MISSILE SELF-DESTRUCT' : 'SPLASH · NO HIT', '')
    })
    G.events.on('missile:decoyed', ({ by }) => G.vehicle?.seeker && say(by?.kind === 'flare' ? 'DECOYED — FLARE' : 'SEEKER SWITCHED TARGET', 'warn'))
    G.events.on('missile:lost', () => G.vehicle?.seeker && say('MISSILE LOST LOCK', 'warn'))
  }

  // a world point on screen (CSS px), or null behind the camera
  screen(p) {
    _p.copy(p).project(this.G.camera)
    if (_p.z > 1) return null
    return [((_p.x + 1) / 2) * innerWidth, ((1 - _p.y) / 2) * innerHeight]
  }

  update(dt) {
    const G = this.G
    const sk = G.vehicle?.seeker
    this.noteT = Math.max(0, this.noteT - dt)
    const on = !!sk && sk.mode !== 'off'
    this.set('show', !!sk || this.noteT > 0, (v) => this.root.classList.toggle('show', v))
    this.set('pip', sk ? 'block' : 'none', (v) => (this.pip.style.display = v))
    this.set('noteA', this.noteT > 0 ? Math.min(1, this.noteT * 2).toFixed(2) : '0', (v) => (this.note.style.opacity = v))
    this.set('coneOn', on ? 'block' : 'none', (v) => (this.cone.style.display = v))
    if (!on) {
      // the seeker is off: the last word stays just under the middle of the screen
      this.set('noteAt', `translate(${(innerWidth / 2).toFixed(0)}px, ${(innerHeight * 0.6).toFixed(0)}px) translateX(-50%)`, (v) => (this.note.style.transform = v))
      this.set('boxOn', 'none', (v) => (this.box.style.display = v))
      return
    }
    const cam = G.camera
    const pxPerTan = innerHeight / 2 / Math.tan(THREE.MathUtils.degToRad(cam.fov / 2))
    // the ring: centred on the sight, its radius the cone's half-angle
    const c = this.screen(_t.copy(sk.origin).addScaledVector(sk.axis, 400))
    if (c) {
      const r = Math.tan(sk.S.cone) * pxPerTan
      this.set('coneAt', `translate(${(c[0] - r).toFixed(1)}px, ${(c[1] - r).toFixed(1)}px)`, (v) => (this.cone.style.transform = v))
      this.set('cone', `${(2 * r).toFixed(0)}px`, (v) => (this.cone.style.width = this.cone.style.height = v))
      this.set('noteAt', `translate(${c[0].toFixed(1)}px, ${(c[1] + r + 10).toFixed(1)}px) translateX(-50%)`, (v) => (this.note.style.transform = v))
    }
    this.set('coneCls', 'sk-cone ' + sk.mode, (v) => (this.cone.className = v))
    // the brackets on what it holds, sized to the body at that range
    const src = sk.target
    const at = src && (G.missiles.locate(src, _t) || _t.set(src.x, src.y, src.z))
    const s = at && this.screen(at)
    if (!s) {
      this.set('boxOn', 'none', (v) => (this.box.style.display = v))
      return
    }
    const half = clamp((((src.radius || 1) * 1.6 + 0.6) / Math.max(1, cam.position.distanceTo(at))) * pxPerTan, 12, 90)
    this.set('boxOn', 'block', (v) => (this.box.style.display = v))
    this.set('boxCls', 'sk-box ' + sk.mode, (v) => (this.box.className = v))
    this.set('boxAt', `translate(${(s[0] - half).toFixed(1)}px, ${(s[1] - half).toFixed(1)}px)`, (v) => (this.box.style.transform = v))
    this.set('box', `${(2 * half).toFixed(0)}px`, (v) => (this.box.style.width = this.box.style.height = v))
    // the range from the launcher's nose, as the vehicle panel shows it
    this.set('tag', sk.locked ? `LOCK · ${Math.round(sk.range)} m` : `${Math.round(sk.progress * 100)}%`, (v) => (this.tag.textContent = v))
  }

  set(key, value, apply) {
    if (this.last[key] === value) return
    this.last[key] = value
    apply(value)
  }
}
