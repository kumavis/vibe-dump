// Built or Bit? — segment 5. A desk game show: Larry reads "simcluster ___" idea cards, Sibyl
// (at a game-show stand) rules BUILT or BIT, and every BIT gets built by the website bot before
// the red bulb finishes coming on. Introduces the giant E key, which stays on the desk from here.
//
// Frames: node tools/shoot.mjs built-or-bit 3 9 14.5 20 27.5 29.6 35.5 41 45 46.5 57 59.4 64 66.5

import { EKEY as KEY } from '../../stage/set.js' // where set.js draws the E key on the desk (world)
const WIDE = { x: 1560, y: 600, zoom: 1 } // the game shot's camera
const BOT = { x: 1990, y: 600, scale: 0.6, look: 'larry', z: 6, floor: null, seat: 760 }
const TOWER = { x: 1110, y: 318, w: 240 } // the scoreboard (world)
const BULB = { built: [1170, 440], bit: [1290, 440], r: 44 }
const CARD = { x: 470, y: 66, w: 540, h: 128 } // the idea card (stage)

export default {
  title: 'Built or Bit?',
  bumper: { sub: 'the game show where every joke ships' },
  built: { from: 4, bumps: ['b1', 'b2', 'b3', 'b4'] },
  cast: ['sibyl', 'bot'],
  defaultShot: 'desk',

  setup(show) {
    const { SHOTS } = show
    // the game: Sibyl at her stand, Larry at the desk, the bot at the end of the desk,
    // pulled back to make room for the scoreboard (left) and the idea cards (top)
    SHOTS['bob-wide'] = (s, o = {}) => {
      const L = SHOTS.deskWith(s, { with: 'sibyl' })
      L.cam = { x: WIDE.x + (o.sx ?? 0), y: WIDE.y + (o.sy ?? 0), zoom: WIDE.zoom }
      L.place.bot = { ...BOT }
      return L
    }
    // push in on Larry and the E key
    SHOTS['bob-key'] = (s, o = {}) => {
      const L = SHOTS.deskWith(s, { with: 'sibyl' })
      delete L.place.sibyl
      L.cam = { x: 1760 + (o.sx ?? 0), y: 625 + (o.sy ?? 0), zoom: o.zoom ?? 2 }
      L.place.bot = { ...BOT }
      return L
    }
    // the button: Larry, the key and the bot
    SHOTS['bob-end'] = (s, o = {}) => {
      const L = SHOTS.deskWith(s, { with: 'sibyl' })
      delete L.place.sibyl
      L.cam = { x: 1768, y: 610, zoom: o.zoom ?? 1.5 }
      L.place.bot = { ...BOT }
      return L
    }
  },

  // ------------------------------------------------------------------ timing helpers
  word(show, id, w) {
    const L = show.line(id)
    const hit = L.words.find((x) => x[2].toLowerCase().startsWith(w))
    return hit ? hit[0] : L.t0
  },
  // the moments
  land(show) { return show.at('thud') },
  // cut in on the desk just before the key starts to fall
  keyCut(show) { return show.at('thud') - 0.55 },
  // red (BIT) bulb level 0..1
  redLevel(t, show) {
    const win = (a, b, max = 1) => {
      if (t < a || t >= b + 0.18) return 0
      if (t >= b) return Math.floor((t - b) / 0.045) % 2 ? 0 : max * 0.6 // the flick-off
      return max * show.clamp((t - a) / 0.35)
    }
    return Math.max(
      t >= show.at('buzz-demo') && t < show.at('buzz-demo') + 0.95 ? 1 : 0,
      win(show.at('red3'), show.at('b1') + 0.08),
      win(show.at('r4'), show.at('b2') + 0.06, 0.45),
      win(this.word(show, 'r5', 'bit'), show.at('b3') + 0.08),
      win(this.word(show, 'r6', 'bit'), show.at('b4') + 0.08),
    )
  },
  greenLevel(t, show) {
    let g = 0
    for (const c of ['ding1', 'ding2']) {
      const u = t - show.at(c)
      if (u >= 0 && u < 2.2) g = Math.max(g, u < 1.6 ? 1 : 1 - (u - 1.6) / 0.6)
    }
    for (const b of ['b1', 'b2', 'b3']) {
      const u = t - show.at(b) - 0.08
      if (u >= 0 && u < 2.6) g = Math.max(g, u < 2 ? 1 : 1 - (u - 2) / 0.6)
    }
    if (t >= show.at('b4') + 0.08) g = 1
    return g
  },
  bumpsBefore(t, show) {
    return ['b1', 'b2', 'b3'].filter((b) => t >= show.at(b)).length
  },

  // ------------------------------------------------------------------ direction
  direct(t, show) {
    const at = (n) => show.at(n)
    const L = (id) => show.line(id)
    const land = this.land(show)

    // ---- shots
    const shake = (t0, amp, dur = 0.5) => {
      const u = t - t0
      return u >= 0 && u < dur ? amp * (1 - u / dur) * Math.sin(u * 70) : 0
    }
    const sy = shake(land, 9) + shake(at('shatter'), 7, 0.6)
    const sx = shake(at('shatter') + 0.03, 6, 0.6)
    if (t < at('buzz-demo')) show.shot('desk')
    else if (t < L('c4r').t0 - 0.05) show.shot('bob-wide', { sx, sy })
    else if (t < at('card5')) show.closeup('larry', { size: 470 })
    else if (t < this.keyCut(show)) show.shot('bob-wide', { sx, sy })
    else if (t < L('e2').t0 - 0.1) show.shot('bob-key', { sy: shake(land, 9), zoom: 2 + 0.15 * show.ease.inOutSine(show.progress(land + 0.4, 1.4)) })
    else if (t < L('e3').t0 - 0.1) show.shot('bob-wide')
    else if (t < at('card6')) show.shot('bob-key', { zoom: 2.1 })
    else if (t < L('reveal').t0 - 0.05) show.shot('bob-wide', { sx, sy })
    else if (t < L('button').t0 - 0.15) show.shot('bob-key', { zoom: 2 })
    else show.shot('bob-end', { zoom: 1.5 + 0.12 * show.ease.inOutSine(show.progress(L('button').t0, 2.4)) })

    // ---- the E key: falls, lands with a thud, and stays on the desk
    show.set.eKey = t >= land

    // ---- performances
    const larry = show.puppet('larry'), sibyl = show.puppet('sibyl'), bot = show.puppet('bot')
    // Sibyl watches Larry, turns to the bot when it builds
    if (show.speaking('bot') || (t > at('b1') && t < at('b1') + 1.2)) sibyl.lookAt('bot')
    else if (L('rules2').active) sibyl.lookAt('camera')
    else sibyl.lookAt('larry')
    // Larry: reads cards to camera, turns to whoever rules
    if (t < at('buzz-demo')) larry.lookAt('camera')
    else if (show.speaking('bot') || (t > at('b4') && t < L('reveal').t0)) larry.lookAt('bot')
    else if (show.speaking('sibyl')) larry.lookAt('sibyl')
    else larry.lookAt('camera')
    // the key: he eyes it, leans away, won't touch it
    if (t >= land && t < L('e2').t0) {
      larry.lookAt(2.15).nod(-0.28).tilt(0.08)
      if (t > land + 0.05 && t < land + 0.6) larry.shake(2.5 * (1 - (t - land) / 0.6))
    }
    if (L('e3').active) larry.lookAt('camera').nod(-0.04)
    // the reveal: he looks around the studio
    if (L('reveal').active || (t > L('reveal').t0 && t < L('reveal').t1 + 0.4)) {
      const u = t - L('reveal').t0
      larry.lookAt(u < 0.5 ? 'left' : u < 0.9 ? 'right' : 'camera')
    }
    // the bot: a little hop on every build; inhales at the end
    for (const b of ['b1', 'b2', 'b3', 'b4']) {
      const u = t - at(b)
      if (u > 0 && u < 0.5) bot.nod(0.18 * Math.sin((u / 0.5) * Math.PI))
    }
    if (show.speaking('bot')) bot.lookAt('camera')
    if (t >= at('inhale')) {
      const u = show.progress('inhale', at('blackout') - at('inhale'))
      bot.lookAt('camera').scaleTo(1 + 0.22 * show.ease.outQuad(u)).nod(0.12 * u)
    }
    // the shatter rattles Sibyl
    if (t > at('shatter') && t < at('shatter') + 0.4) sibyl.shake(3)

    // ---- chrome
    show.chyron('larry', { from: 0.5, dur: 4.2 })
    show.chyron({ name: 'Sibyl Ant', title: 'Judge · Built or Bit?', color: show.puppet('sibyl').color }, { from: L('rules2').t0 + 0.2, dur: 3.2 })
    show.chyron('bot', { from: at('b1') + 0.2, to: L('c3r').t1 + 0.3 })
    if (t >= at('blackout')) show.caption(null)
  },

  // ------------------------------------------------------------------ the scoreboard (studio, behind the puppets)
  drawBack(ctx, t, show) {
    const { draw, P } = show
    if (t < show.at('buzz-demo') - 0.01) return
    show.world(ctx, (c) => this.tower(c, t, show))
  },

  tower(ctx, t, show) {
    const { draw, P } = show
    const { x, y, w } = TOWER
    const g = this.greenLevel(t, show)
    const r = this.redLevel(t, show)
    const shatter = show.at('shatter')
    // legs
    for (const lx of [x + 40, x + w - 40]) draw.seg(ctx, lx, y + 300, lx, 958, P.goldDim, 2, { alpha: 0.9 })
    draw.seg(ctx, x + 10, 958, x + w - 10, 958, P.goldDim, 2)
    // cabinet
    draw.box(ctx, x, y, w, 300, { color: P.gold, radius: 12, width: 2.2 })
    draw.box(ctx, x + 8, y + 8, w - 16, 52, { color: P.goldMid, radius: 6, width: 1.2 })
    draw.label(ctx, 'BUILT OR BIT?', x + w / 2, y + 41, { size: 24, align: 'center', color: P.gold, weight: 'm', ls: 0.1 })
    // chase lights round the marquee
    const n = 14
    for (let i = 0; i < n; i++) {
      const u = i / (n - 1)
      const on = (Math.floor(t * 6) + i) % 3 === 0
      draw.dot(ctx, x + 14 + u * (w - 28), y + 70, 2.6, on ? P.gold : P.goldDim, on ? 1 : 0.5)
    }
    // the bulbs
    this.bulb(ctx, BULB.built[0], BULB.built[1], BULB.r, P.green, g, 0, t, show, -1)
    const cracks = this.bumpsBefore(Math.min(t, shatter - 0.001), show)
    if (t < shatter) this.bulb(ctx, BULB.bit[0], BULB.bit[1], BULB.r, P.red, r * (cracks ? 0.75 + 0.25 * (show.noise(t * 9, 3) > -0.3 ? 1 : 0) : 1), cracks, t, show, 1)
    else this.shards(ctx, t - shatter, show)
    draw.label(ctx, 'BUILT', BULB.built[0], y + 196, { size: 20, align: 'center', color: g > 0.3 ? P.white : P.green, weight: 'm', ls: 0.12, alpha: 0.6 + 0.4 * g })
    draw.label(ctx, 'BIT', BULB.bit[0], y + 196, { size: 20, align: 'center', color: t >= shatter ? P.blueDim : r > 0.3 ? P.white : P.red, weight: 'm', ls: 0.12, alpha: t >= shatter ? 0.5 : 0.6 + 0.4 * r })
    // the round timer: a minute from the first card; stops when the show builds itself
    const t0 = show.at('game-on'), stopAt = shatter
    const left = show.clamp(60 - (Math.min(t, stopAt) - t0), 0, 60)
    const s = Math.ceil(left)
    const txt = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
    draw.box(ctx, x + 22, y + 218, w - 44, 66, { color: P.goldMid, radius: 6, width: 1.2 })
    draw.label(ctx, 'ROUND 1', x + 38, y + 256, { size: 13, color: P.goldMid, ls: 0.2 })
    const frozen = t >= stopAt
    const blink = frozen && Math.floor((t - stopAt) * 3) % 2 === 1
    if (!blink) draw.label(ctx, txt, x + w - 36, y + 264, { size: 34, align: 'right', color: s <= 10 ? P.red : P.amber, weight: 'm', ls: 0.06 })
  },

  bulb(ctx, x, y, r, color, level, cracks, t, show, seed) {
    const { draw, P } = show
    const circ = new Path2D()
    circ.arc(x, y, r, 0, Math.PI * 2)
    draw.occlude(ctx, circ)
    if (level > 0.02) {
      draw.dot(ctx, x, y, r * 1.6, color, 0.08 * level)
      draw.dot(ctx, x, y, r * 0.95, color, 0.35 * level)
      for (let k = 0; k < 10; k++) {
        const a = (k / 10) * Math.PI * 2 + 0.2
        draw.seg(ctx, x + Math.cos(a) * (r + 8), y + Math.sin(a) * (r + 8), x + Math.cos(a) * (r + 8 + 16 * level), y + Math.sin(a) * (r + 8 + 16 * level), color, 2, { alpha: level })
      }
    }
    draw.ring(ctx, x, y, r, color, 2 + 1.5 * level, { alpha: 0.55 + 0.45 * level, hot: level > 0.5 })
    // filament
    const f = [[-14, 14], [-9, -6], [-4, 6], [0, -8], [4, 6], [9, -6], [14, 14]].map(([a, b]) => [x + a, y + b])
    draw.beamPts(ctx, f, level > 0.3 ? P.white : color, 1.4, { alpha: 0.5 + 0.5 * level, hot: level > 0.5 })
    // socket
    draw.box(ctx, x - 16, y + r - 2, 32, 16, { color, radius: 3, width: 1.2, alpha: 0.7 })
    // cracks, one per build so far
    const R = show.rng(`crack${seed}`)
    for (let c = 0; c < cracks; c++) {
      const a0 = R() * Math.PI * 2
      let px = x + Math.cos(a0) * r, py = y + Math.sin(a0) * r
      const pts = [[px, py]]
      for (let k = 0; k < 3; k++) {
        const a = a0 + Math.PI + R.range(-0.7, 0.7)
        px += Math.cos(a) * r * 0.32
        py += Math.sin(a) * r * 0.32
        pts.push([px, py])
      }
      draw.beamPts(ctx, pts, P.white, 1.3, { alpha: 0.85 })
    }
  },

  shards(ctx, age, show) {
    const { draw, P } = show
    const [x, y] = BULB.bit
    // the empty socket, sparking
    draw.box(ctx, x - 16, y + BULB.r - 2, 32, 16, { color: P.red, radius: 3, width: 1.2, alpha: 0.6 })
    const R = show.rng('shards')
    if (age < 2.2) {
      for (let k = 0; k < 16; k++) {
        const a = R() * Math.PI * 2, v = R.range(140, 420), spin = R.range(-12, 12), sz = R.range(7, 16)
        const px = x + Math.cos(a) * (BULB.r * 0.6 + v * age)
        const py = y + Math.sin(a) * (BULB.r * 0.6 + v * age) + 520 * age * age
        const rot = spin * age
        const pts = [0, 2.1, 4.2].map((q) => [px + Math.cos(rot + q) * sz, py + Math.sin(rot + q) * sz * 0.7])
        draw.beamPts(ctx, pts, k % 3 ? P.red : P.white, 1.6, { close: true, alpha: Math.max(0, 1 - age / 2.2), hot: age < 0.3 })
      }
      if (age < 0.25) draw.dot(ctx, x, y, BULB.r * (1 + age * 6), P.white, 0.6 * (1 - age / 0.25))
    }
    // sparks from the socket for a while
    const sp = show.rng(`spark${Math.floor(age * 8)}`)
    if (age < 6 && sp() < 0.55) for (let k = 0; k < 3; k++) {
      const a = -Math.PI / 2 + sp.range(-1, 1)
      draw.seg(ctx, x, y + BULB.r, x + Math.cos(a) * sp.range(8, 22), y + BULB.r + Math.sin(a) * sp.range(8, 22), P.amber, 1.2)
    }
  },

  // ------------------------------------------------------------------ in front: cards, the falling key, the blackout
  drawFront(ctx, t, show) {
    const { draw, P } = show
    const at = (n) => show.at(n)
    const land = this.land(show)
    const isWide = this.wideAt(t, show)

    // the E key falling from the flies onto the desk
    if (t >= land - 0.42 && t < land) {
      const u = show.clamp((t - (land - 0.42)) / 0.42)
      const y = show.lerp(KEY.y - 620, KEY.y, show.ease.inQuad(u))
      show.world(ctx, (c) => {
        for (let k = 1; k <= 3; k++) draw.seg(c, KEY.x - 14 + k * 7, y - 40 - k * 18, KEY.x - 14 + k * 7, y - 40 - k * 18 - 40, P.cyan, 1, { alpha: 0.5 })
        draw.keycap(c, KEY.x, y, { label: 'E', scale: KEY.scale, glow: 0.6 })
      })
    }
    // the thud: dust puffs either side
    if (t >= land && t < land + 0.6) {
      const u = (t - land) / 0.6
      show.world(ctx, (c) => {
        for (const s of [-1, 1]) for (let k = 0; k < 3; k++) {
          const x0 = KEY.x + s * (22 + u * 40 + k * 8), y0 = KEY.y + 12 - k * 6 - u * 10
          draw.seg(c, x0, y0, x0 + s * 10, y0 - 4, P.white, 1.2, { alpha: 1 - u })
        }
      })
    }

    // the bot's confetti on every build
    for (const b of ['b1', 'b2', 'b3', 'b4']) {
      const age = t - at(b) - 0.1
      if (age < 0 || age > 1.5) continue
      const h = show.headOf('bot')
      if (h) draw.confetti(ctx, h.x + h.size * 0.35, h.y + h.size * 0.55, age, { seed: b.charCodeAt(1), count: 26 })
      if (isWide) {
        const [gx, gy] = show.toScreen(...BULB.built)
        draw.confetti(ctx, gx, gy, age, { seed: 9 + b.charCodeAt(1), count: 18 })
      }
    }

    // the inhale: air rushing into the bot
    if (t >= at('inhale') && t < at('blackout')) {
      const h = show.headOf('bot')
      if (h) {
        const u = show.progress('inhale', at('blackout') - at('inhale'))
        for (let k = 0; k < 6; k++) {
          const a = Math.PI * 0.55 + (k / 5) * Math.PI * 0.9
          const d0 = h.size * (0.9 - 0.5 * ((u * 2 + k * 0.17) % 1))
          const [mx, my] = h.mouth
          draw.seg(ctx, mx + Math.cos(a) * d0, my + Math.sin(a) * d0, mx + Math.cos(a) * (d0 - 22), my + Math.sin(a) * (d0 - 22), P.white, 1.4, { alpha: 0.7 })
        }
      }
    }

    if (isWide && t >= at('card1') - 0.01) this.cards(ctx, t, show)

    // the blackout: lights out, the E key glowing on the desk
    if (t >= at('blackout')) {
      const u = t - at('blackout')
      ctx.save()
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = '#000'
      ctx.globalAlpha = Math.min(0.94, u / 0.06)
      ctx.fillRect(0, 0, 1280, 720)
      ctx.restore()
      const [kx, ky] = show.toScreen(KEY.x, KEY.y)
      const z = show.cam.zoom
      // a thin spotlight onto the key
      const spot = new Path2D()
      spot.moveTo(kx - 6, -10); spot.lineTo(kx + 6, -10); spot.lineTo(kx + 48 * z, ky + 20 * z); spot.lineTo(kx - 48 * z, ky + 20 * z); spot.closePath()
      draw.beam(ctx, spot, P.cyan, 1, { alpha: 0.18 * Math.min(1, u / 0.4) })
      show.world(ctx, (c) => draw.keycap(c, KEY.x, KEY.y, { label: 'E', scale: KEY.scale, glow: 0.7 + 0.3 * Math.sin(t * 3) }))
      draw.label(ctx, 'PRESS E TO LEAVE', kx, ky + 62 * z, { size: 22, align: 'center', color: P.cyan, weight: 'm', ls: 0.3, alpha: show.clamp((u - 0.6) / 0.5) * 0.9 })
    }
  },

  wideAt(t, show) {
    const L = (id) => show.line(id)
    const at = (n) => show.at(n)
    if (t < at('buzz-demo')) return false
    if (t >= L('c4r').t0 - 0.05 && t < at('card5')) return false
    if (t >= this.keyCut(show) && t < L('e2').t0 - 0.1) return false
    if (t >= L('e3').t0 - 0.1 && t < at('card6')) return false
    if (t >= L('reveal').t0 - 0.05) return false
    return true
  },

  // ------------------------------------------------------------------ the idea cards
  cards(ctx, t, show) {
    const { draw, P } = show
    const at = (n) => show.at(n)
    const deck = [
      { cue: 'card1', flip: 'ding1', idea: ['SIMCLUSTER', 'UNIVERSITY'], back: 'university' },
      { cue: 'card2', flip: 'ding2', idea: ['A SIMCLUSTER', 'PODCAST'], back: 'podcast' },
      { cue: 'card3', flip: 'b1', skeet: { text: '[terrible ideas file #6710] Simcluster Hamilton', time: '5 Nov 2026', likes: 18 }, back: 'hamilton' },
      { cue: 'card4', flip: 'b2', idea: ['A HOT DOG TOPPINGS', 'TIER LIST'], back: 'hotdog' },
      { cue: 'card5', flip: null, skeet: { text: 'PRESS E TO LEAVE would be a good title for the inevitable simcluster documentary', time: '26 Oct 2026', likes: 30 }, stamp: 'b3' },
      { cue: 'card6', flip: 'b4', idea: ['A SIMCLUSTER', 'LATE-NIGHT TALK SHOW'], back: 'show' },
    ]
    let i = -1
    deck.forEach((d, k) => { if (t >= at(d.cue)) i = k })
    if (i < 0) return
    const d = deck[i]
    const age = t - at(d.cue)
    // flip in from edge-on, then flip over to the back when it's ruled
    const inU = show.clamp(age / 0.35)
    let sx = show.ease.outBack(inU), face = 'front'
    if (d.flip && t >= at(d.flip) + 0.08) {
      const u = show.clamp((t - at(d.flip) - 0.08) / 0.3)
      sx = Math.abs(Math.cos(u * Math.PI))
      face = u < 0.5 ? 'front' : 'back'
    }
    const cx = CARD.x + CARD.w / 2
    ctx.save()
    ctx.translate(cx, 0)
    ctx.scale(Math.max(0.02, sx), 1)
    ctx.translate(-cx, 0)
    if (face === 'front') {
      if (d.skeet) {
        draw.skeetCard(ctx, {
          x: CARD.x, y: CARD.y - 4, w: CARD.w, scale: 0.86,
          name: 'norvid_studies', handle: 'norvid-studies.bsky.social', time: d.skeet.time, initials: 'n', color: P.violet,
          text: d.skeet.text, likes: d.skeet.likes, appear: 1, reveal: show.clamp((age - 0.2) / 1.0), textSize: 20,
        })
      } else this.ideaCard(ctx, t, show, d, i)
    } else this.backCard(ctx, t, show, d.back, t - at(d.flip))
    ctx.restore()
    if (d.stamp && t >= at(d.stamp) - 0.15) draw.stamp(ctx, CARD.x + CARD.w - 120, CARD.y + 104, 'BUILT', { age: t - at(d.stamp) - 0.1, rot: -0.14, color: P.green, size: 34 })
    // the deck counter
    draw.label(ctx, `CARD ${i + 1} OF 6`, CARD.x + CARD.w, CARD.y - 10, { size: 11, align: 'right', color: P.goldMid, ls: 0.3 })
  },

  ideaCard(ctx, t, show, d, i) {
    const { draw, P } = show
    const { x, y, w, h } = CARD
    draw.box(ctx, x, y, w, h, { color: P.gold, radius: 10, width: 2, hot: true })
    draw.box(ctx, x + 7, y + 7, w - 14, h - 14, { color: P.goldDim, radius: 7, width: 1 })
    draw.label(ctx, 'IDEA', x + 22, y + 30, { size: 12, color: P.goldMid, ls: 0.4 })
    const size = d.idea[1].length > 14 ? 30 : 36
    draw.label(ctx, d.idea[0], x + w / 2, y + 60, { size: 22, align: 'center', color: P.gold, weight: 'm', ls: 0.12 })
    draw.glowText(ctx, d.idea[1], x + w / 2, y + 100, { size, align: 'center', color: P.white, weight: 'm', ls: 0.08 })
  },

  backCard(ctx, t, show, kind, age) {
    const { draw, P } = show
    const { x, y, w, h } = CARD
    // a little browser window: what got built
    draw.box(ctx, x, y, w, h, { color: P.green, radius: 10, width: 2, hot: age < 0.6 })
    draw.seg(ctx, x, y + 26, x + w, y + 26, P.green, 1.2, { alpha: 0.7 })
    for (let k = 0; k < 3; k++) draw.ring(ctx, x + 18 + k * 16, y + 13, 4.5, P.green, 1.2, { alpha: 0.8 })
    const tag = (s) => draw.label(ctx, s, x + w - 16, y + 18, { size: 11, align: 'right', color: P.green, ls: 0.25 })
    const mid = x + w / 2
    if (kind === 'university') {
      tag('REAL · SINCE JUNE')
      draw.label(ctx, 'WELCOME TO', mid, y + 56, { size: 16, align: 'center', color: P.green, ls: 0.3 })
      draw.glowText(ctx, 'SIMCLUSTER UNIVERSITY', mid, y + 86, { size: 28, align: 'center', color: P.white, weight: 'm', ls: 0.08 })
      draw.label(ctx, "YOU'RE ALREADY ENROLLED", mid, y + 112, { size: 14, align: 'center', color: P.lime, ls: 0.25 })
    } else if (kind === 'podcast') {
      tag('REAL · 12 EPISODES')
      // a microphone
      const mx = x + 70, my = y + 76
      draw.ring(ctx, mx, my - 8, 16, P.green, 1.6)
      draw.seg(ctx, mx, my + 8, mx, my + 30, P.green, 1.6)
      draw.seg(ctx, mx - 12, my + 30, mx + 12, my + 30, P.green, 1.6)
      draw.label(ctx, 'UNNAMED SIMCLUSTER PODCAST', x + 110, y + 64, { size: 18, color: P.white, weight: 'm', ls: 0.06 })
      draw.label(ctx, 'NAME:', x + 110, y + 100, { size: 18, color: P.green, ls: 0.15 })
      draw.box(ctx, x + 180, y + 82, 200, 26, { color: P.green, radius: 3, width: 1.2 })
      if (Math.floor(t * 2.2) % 2 === 0) draw.seg(ctx, x + 190, y + 87, x + 190, y + 103, P.white, 1.6)
    } else if (kind === 'hamilton') {
      tag('BUILT IN 4 SECONDS')
      draw.label(ctx, 'NOW PLAYING', mid, y + 50, { size: 13, align: 'center', color: P.green, ls: 0.4 })
      draw.glowText(ctx, 'SIMCLUSTER HAMILTON', mid, y + 84, { size: 30, align: 'center', color: P.gold, weight: 'm', ls: 0.08 })
      draw.label(ctx, 'THE MUSICAL · NOW IN ITS FIRST MINUTE', mid, y + 110, { size: 12, align: 'center', color: P.lime, ls: 0.15 })
      // two little stars
      for (const s of [-1, 1]) draw.label(ctx, '*', mid + s * 210, y + 86, { size: 26, align: 'center', color: P.gold })
    } else if (kind === 'hotdog') {
      tag('BUILT BEFORE SHE FINISHED')
      const rows = [['S', P.gold, 3], ['A', P.lime, 2], ['B', P.sky, 4]]
      rows.forEach(([lbl, c, n], r) => {
        const ry = y + 34 + r * 30
        draw.box(ctx, x + 14, ry, 34, 26, { color: c, radius: 3, width: 1.2 })
        draw.label(ctx, lbl, x + 31, ry + 19, { size: 16, align: 'center', color: c, weight: 'm' })
        draw.seg(ctx, x + 54, ry + 27, x + w - 14, ry + 27, P.green, 0.8, { alpha: 0.4 })
        for (let k = 0; k < n; k++) this.hotdog(ctx, x + 90 + k * 64, ry + 14, show, (r * 5 + k) % 4)
      })
    } else if (kind === 'show') {
      tag('NOW LIVE')
      draw.glowText(ctx, 'THE LATE CLUSTER', mid, y + 74, { size: 38, align: 'center', color: P.gold, weight: 'm', ls: 0.1 })
      draw.label(ctx, 'YOU ARE WATCHING IT', mid, y + 106, { size: 15, align: 'center', color: P.lime, ls: 0.3 })
    }
  },

  hotdog(ctx, x, y, show, k) {
    const { draw, P } = show
    const bun = draw.roundPath(x - 24, y - 7, 48, 14, 7)
    draw.occlude(ctx, bun)
    draw.beam(ctx, bun, P.amber, 1.3)
    draw.seg(ctx, x - 20, y, x + 20, y, P.coral, 2.4)
    const top = [P.gold, P.lime, P.red, P.white][k]
    for (let i = -2; i <= 2; i++) draw.seg(ctx, x + i * 7 - 3, y - 2 + (i % 2) * 2, x + i * 7 + 3, y + 2 - (i % 2) * 2, top, 1.2)
  },
}
