// Segment 7 — "Someday (Built It)". Larry's intro at the desk, then the musical number on a local
// variant of the `stage` shot: karaoke lyrics with a bouncing ball, each dream drawing itself as a
// little vector vignette and getting stamped BUILT IT by a bot that pops up stage right, HEY!
// bursts on the shouts, stomp/clap accents, lights down for the breakdown (Larry alone in the
// spotlight), full band for the last chorus, a spotlight for the tag, then
// Larry names the band, Hy points out the one song they didn't play, the studio's DAYS SINCE A
// P(DOOM) SONG TRENDED board flips to 0, and the band takes a bow through the applause play-off.

const BAND = ['hy', 'al', 'pete', 'dee']
// Larry's sung lines, in order (the karaoke line)
const LEAD = ['v1-a', 'v1-b', 'c1-a', 'c1-b', 'c1-c', 'v2-a', 'v2-b', 'c2-a', 'c2-b', 'c2-c', 'bd-a', 'bd-b', 'c3-a', 'c3-b', 'c3-c', 'tag']

export default {
  title: 'Someday (Built It)',
  bumper: { sub: 'a musical number · Hy Oid & The Formants' },
  cast: ['hy', 'al', 'dee', 'pete', 'bot'],
  set: { eKey: true, crow: 'circling' },
  built: { from: 10, bumps: ['built-1', 'built-2', 'built-3', 'built-4'] },
  shots: [
    { at: 0, shot: 'desk' },
    { at: 'intro-2', shot: 'closeup', who: 'larry', size: 560, push: 0.9 },
    { at: 'intro-4', shot: 'desk', zoom: 1.75 },
  ],

  setup(show) {
    // the musical-number shot, extended: the bot pops up stage right, the band can step out of
    // the light (the tag)
    show.SHOTS.songStage = (s, o = {}) => {
      const L = s.SHOTS.stage(s, { zoom: o.zoom ?? 1.15, band: BAND })
      L.set = { ...(L.set ?? {}), desk: false }
      if (o.alone) for (const id of BAND) delete L.place[id]
      const z = L.cam.zoom
      const toWorld = (sx, sy) => ({ x: L.cam.x + (sx - 640) / z, y: L.cam.y + (sy - 360) / z })
      if (o.bot > 0) {
        const p = toWorld(1150, 760 - 330 * o.bot)
        L.place.bot = { ...p, scale: 0.6, look: o.botLook ?? 'left', z: 9, floor: null, seat: null, instrument: null, clip: { x: 0, y: 0, w: 1280, h: 720 } }
      }
      return L
    }
    this.lead = LEAD
  },

  direct(t, show) {
    const { tween, clamp } = show
    if (t < show.at('band-in')) {
      // the intro at the desk: the E key on the desk, the crow circling the skyline
      if (show.line('intro-2').active) show.puppet('larry').nod(-0.05)
      return
    }
    const win = (a, b, fi = 0.25, fo = 0.3) => clamp(Math.min((t - a) / fi, (b - t) / fo))
    // the bot pops up for each "Built it."
    const bt = (id) => show.at(id)
    const bot = Math.max(
      win(bt('built-1') - 0.35, show.at('built-1.end') + 0.6),
      win(bt('built-2') - 0.35, show.at('both.end') + 0.3),
      win(bt('built-3') - 0.35, show.at('in-it.end') + 0.4),
      win(bt('built-4') - 0.35, show.at('built-4.end') + 1.2),
    )
    const pop = show.ease.outBack(clamp(bot))
    const alone = show.between('tag-in', show.at('built-4.end') + 0.4)
    // the camera: a touch closer for the breakdown, closer still for the tag
    let zoom = 1.15
    zoom += 0.14 * clamp(show.progress('breakdown', 2)) * (1 - clamp(show.progress('reveal', 0.6)))
    zoom += 0.3 * clamp(show.progress('tag-in', 3)) * (1 - clamp(show.progress(show.at('built-4.end') + 0.4, 0.8)))
    show.shot('songStage', { zoom, bot: pop, alone, botLook: 'larry' })

    // the lights: down for the breakdown, nearly out for the tag
    const down = Math.max(
      clamp(show.progress('breakdown', 1)) * (1 - clamp(show.progress('reveal', 0.25))),
      clamp(show.progress('tag-in', 0.6)) * (1 - clamp(show.progress(show.at('built-4.end') + 0.2, 0.8))),
    )
    this.down = down
    show.set.dim = 0.34 + 0.5 * down

    // who looks where
    const larry = show.puppet('larry')
    if (show.line('both').active || show.between('both', show.at('both.end') + 0.4)) larry.lookAt('hy'), show.puppet('hy').lookAt('larry')
    if (show.between('built-3', 'reveal')) larry.lookAt(show.between('when', 'in-it') ? 'right' : 'camera')
    if (show.between('reveal', show.at('reveal') + 0.5)) larry.nod(0.06)
    // the button: Larry presents the band, Hy turns to camera with the p(doom) line, Larry gives
    // the camera a deadpan look as the board flips, then everyone takes a bow through the play-off
    if (show.since('btn-1') > 0.6) {
      const flip = show.since('flip')
      larry.lookAt(flip > 0.15 ? 'camera' : 'hy')
      const off = show.since('bow')
      if (off > 0) larry.nod(-0.09 * Math.sin(Math.PI * clamp(off / 1.4)))
      BAND.forEach((id, i) => {
        const p = show.puppet(id)
        p.lookAt(id === 'hy' || flip > 0 ? 'camera' : 'larry')
        const u = off - 0.2 - 0.18 * i
        if (u > 0 && u < 1.5) p.nod(-0.18 * Math.sin(Math.PI * u / 1.5))
      })
    }

    // sung lead lines: the karaoke line up top is the caption
    for (const id of LEAD) {
      const L = show.line(id)
      if (t >= L.t0 - 0.05 && t < L.t1 + 0.7) show.caption(null)
    }
    // the tag: a little closer, everyone else in the dark
    if (alone) for (const id of BAND) show.puppet(id).hide()
  },

  drawBack(ctx, t, show) {
    const { draw, P } = show
    if (t < show.at('band-in')) return
    const down = this.down ?? 0
    // spotlight cone onto Larry when the lights are down
    const h = show.headOf('larry')
    if (h && down > 0.02) {
      const g = ctx.createLinearGradient(0, 0, 0, 720)
      g.addColorStop(0, `rgba(255,236,190,${0.0})`)
      g.addColorStop(0.35, `rgba(255,236,190,${0.06 * down})`)
      g.addColorStop(1, `rgba(255,236,190,${0.12 * down})`)
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.moveTo(h.x - 40, -10)
      ctx.lineTo(h.x + 40, -10)
      ctx.lineTo(h.x + h.size * 0.95, 720)
      ctx.lineTo(h.x - h.size * 0.95, 720)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
      draw.seg(ctx, h.x - 40, -10, h.x - h.size * 0.95, 720, P.gold, 1, { alpha: 0.25 * down })
      draw.seg(ctx, h.x + 40, -10, h.x + h.size * 0.95, 720, P.gold, 1, { alpha: 0.25 * down })
    }
  },

  drawFront(ctx, t, show) {
    const { draw, P, clamp } = show
    if (t < show.at('band-in')) return
    const down = this.down ?? 0

    // ---- lights down: everything but Larry's pool of light goes dark
    const h = show.headOf('larry')
    if (down > 0.01 && h) {
      const g = ctx.createRadialGradient(h.x, h.y + h.size * 0.35, h.size * 0.42, h.x, h.y + h.size * 0.35, h.size * 1.05)
      g.addColorStop(0, 'rgba(0,0,0,0)')
      g.addColorStop(1, `rgba(0,0,0,${0.82 * down})`)
      // the bot keeps its own light
      const path = new Path2D()
      path.rect(0, 0, 1280, 720)
      const b = show.headOf('bot')
      if (b) path.rect(b.x + b.size * 0.8, b.y - b.size * 0.7, -b.size * 1.6, b.size * 2.2)
      ctx.save()
      ctx.fillStyle = g
      ctx.fill(path, 'evenodd')
      ctx.restore()
    }
    // ---- stomp / clap accents
    this.accents(ctx, t, show)

    // ---- the dreams
    this.dreams(ctx, t, show)

    // ---- HEY! / ARE WE? bursts on the gang shouts
    for (const l of show.lines) {
      if (l.kind !== 'shout' || l.who !== 'hy') continue
      const u = (t - l.t0) / 0.55
      if (u < 0 || u > 1) continue
      const k = show.lines.filter((x) => x.kind === 'shout' && x.who === 'hy' && x.t0 < l.t0).length
      const side = k % 2 ? 1 : -1
      const final = l.t0 > show.at('reveal')
      const x = 640 + side * (final ? 290 : 300), y = 246 - 16 * u
      const size = (l.text === 'HEY!' ? 60 : 42) * (1 + 0.35 * show.ease.outCubic(clamp(u * 3)))
      draw.glowText(ctx, l.text, x, y, { size, align: 'center', color: final && k % 2 ? P.gold : P.magenta, weight: 'm', alpha: 1 - u * u, ls: 0.08 })
      if (final) draw.confetti(ctx, x, y - 30, u * 0.55, { seed: k, count: 14 })
    }

    // ---- the karaoke line
    this.karaoke(ctx, t, show)

    // ---- the closing button: the studio safety board resets
    this.doomBoard(ctx, t, show)

    // ---- the hook: whoa-oh in the lyric slot
    const hook = show.line('hook-hy')
    if (t >= hook.t0 - 0.3 && t < hook.t1 + 0.4) {
      const a = clamp(Math.min((t - hook.t0 + 0.3) / 0.3, (hook.t1 + 0.4 - t) / 0.4))
      draw.glowText(ctx, 'WHOA-OH-OH-OH,  WHOA-OH-OH', 640, 150, { size: 40, align: 'center', color: P.magenta, weight: 'm', alpha: a, ls: 0.1 })
      draw.label(ctx, 'HY OID & THE FORMANTS', 640, 184, { size: 14, align: 'center', color: P.pink, alpha: 0.75 * a, ls: 0.3 })
    }
    // ---- song title card as the band comes in
    const ti = show.progress('band-in', 0.4) * (1 - show.progress(show.at('hook-hy') + 2.6, 0.6))
    if (ti > 0) {
      // one line, clear of the APPLAUSE/LAUGH sign above and the whoa-oh line below
      draw.label(ctx, 'NOW SINGING · SOMEDAY (BUILT IT)', 640, 96, { size: 20, align: 'center', color: P.white, alpha: ti, weight: 'm', ls: 0.15 })
    }
  },

  // a workplace-safety board, DAYS SINCE A P(DOOM) SONG TRENDED: it drops in during Hy's line
  // reading 3 and split-flaps to 0 on the `flip` cue (two ticks in the mix), flashing red
  doomBoard(ctx, t, show) {
    const { draw, P, clamp } = show
    const inA = clamp(show.since(show.at('pdoom') + 0.9) / 0.35)
    if (inA <= 0) return
    const x = 440, y = 84, w = 400, hh = 148
    const fa = show.since('flip')
    const flash = fa > 0.2 && fa < 1.4 ? 1 - (fa - 0.2) / 1.2 : 0
    const col = draw.mix(P.amber, P.red, fa > 0.2 ? 0.5 + 0.5 * flash : 0)
    draw.box(ctx, x, y, w, hh, { color: col, fill: '#000', fillAlpha: 0.9 * inA, cut: 6, width: 1.6 + 1.6 * flash, alpha: inA, hot: flash > 0.3 })
    // hazard stripes along the top
    ctx.save()
    ctx.beginPath()
    ctx.rect(x + 6, y + 6, w - 12, 14)
    ctx.clip()
    for (let sx = x - 20; sx < x + w + 20; sx += 22) draw.seg(ctx, sx, y + 22, sx + 14, y + 4, P.amber, 4, { alpha: 0.8 * inA })
    ctx.restore()
    // the number: one split-flap cell
    const fx = x + 30, fy = y + 128
    if (fa < 0) draw.splitFlap(ctx, fx, fy, '3', { size: 66, color: P.amber })
    else draw.splitFlap(ctx, fx, fy, '0', { size: 66, age: fa, color: P.red })
    // the legend
    const lines = ['DAYS SINCE A', 'P(DOOM) SONG', 'TRENDED']
    let size = 28
    while (size > 14 && Math.max(...lines.map((l) => draw.labelWidth(ctx, l, { size, weight: 'm', ls: 0.12 }))) > w - 150) size -= 1
    lines.forEach((l, i) => draw.label(ctx, l, x + 120, y + 62 + i * (size + 10), { size, weight: 'm', color: i === 1 ? P.white : P.amber, ls: 0.12, alpha: inA }))
  },

  // a stomp ring at Al's head and clap sparks at Pete's, from the arrangement's grid
  accents(ctx, t, show) {
    const { draw, P } = show
    const m = show.music
    if (!m || !m.active) return
    const half = m.id === 'c1' || m.id === 'c2'
    const n = m.n
    const pickup = m.id === 'd' ? 2 : 0
    const skips = { a: [7, 27, 31], b: [19, 23], d: [0, 1, 5, 9, 18] }[m.id] ?? []
    const kick = half ? n === 0 : !skips.includes(n) && !(m.id === 'd' && n >= 19)
    const clap = half ? n === 4 : (n - pickup) % 2 === 1 && n >= pickup
    const age = m.phase * (60 / m.bpm)
    if (kick && age < 0.4) {
      const a = show.headOf('al')
      if (a) {
        draw.ring(ctx, a.x, a.y + a.size * 0.55, a.size * (0.18 + age * 0.9), P.magenta, 1.4, { alpha: 0.55 * (1 - age / 0.4) })
      }
    }
    if (clap && age < 0.3) {
      const p = show.headOf('pete')
      if (p) {
        const r = show.rng(n * 7 + m.t0)
        for (let i = 0; i < 8; i++) {
          const ang = (i / 8) * Math.PI * 2 + r() * 0.3
          const d0 = p.size * 0.42, d1 = d0 + p.size * (0.1 + age * 0.9)
          draw.seg(ctx, p.x + Math.cos(ang) * d0, p.y + Math.sin(ang) * d0, p.x + Math.cos(ang) * d1, p.y + Math.sin(ang) * d1, P.gold, 1.4, { alpha: 1 - age / 0.3 })
        }
      }
    }
  },

  // Larry's line of the moment in big vector letters, sung words lit, a ball hopping word to word
  karaoke(ctx, t, show) {
    const { draw, P, clamp } = show
    // each line holds (fully sung, in gold) until the next one comes up, so the lyric slot never
    // sits empty between sections
    const endOf = (id, i) => {
      if (id === 'tag') return show.at('built-4.end') + 2.4
      const l = show.line(id)
      const next = i + 1 < LEAD.length ? show.line(LEAD[i + 1]).t0 - 0.45 : l.t1 + 0.55
      return Math.max(l.t1 + 0.55, Math.min(next, l.t1 + 3))
    }
    let L = null, end = 0
    LEAD.forEach((id, i) => {
      const l = show.line(id), e = endOf(id, i)
      if (t >= l.t0 - 0.45 && t < e) L = l, end = e
    })
    if (!L) return
    const a = clamp(Math.min((t - L.t0 + 0.45) / 0.25, (end - t) / 0.35))
    const words = L.words.map((w) => w[2].toUpperCase())
    const tag = L.id === 'tag'
    let size = L.id.endsWith('-a') && L.id.startsWith('c') || L.id.endsWith('-b') && /^c\d/.test(L.id) ? 64 : 46
    const sp = () => size * 0.55
    const width = () => words.reduce((s, w) => s + draw.labelWidth(ctx, w, { size, weight: 'm', ls: 0.06 }), 0) + sp() * (words.length - 1)
    while (width() > 1060 && size > 20) size -= 2
    const W = width()
    const y = tag ? 160 : 156
    let x = 640 - W / 2
    const cx = []
    words.forEach((w, i) => {
      const ww = draw.labelWidth(ctx, w, { size, weight: 'm', ls: 0.06 })
      const [w0, w1] = L.words[i]
      const sung = t >= w0
      const now = t >= w0 && t < w1 + 0.05
      const col = tag ? (sung ? P.gold : P.goldDim) : now ? P.white : sung ? P.gold : P.blueMid
      draw.label(ctx, w, x, y, { size, weight: 'm', ls: 0.06, color: col, alpha: a * (sung ? 1 : 0.6) })
      if (now) draw.label(ctx, w, x, y, { size, weight: 'm', ls: 0.06, color: P.gold, alpha: a * 0.35, hot: true })
      cx.push(x + ww / 2)
      x += ww + sp()
    })
    // the bouncing ball: lands on each word as it is sung
    const starts = L.words.map((w) => w[0])
    let bx, by
    const top = y - size * 1.05
    if (t < starts[0]) {
      const u = clamp((t - (starts[0] - 0.45)) / 0.45)
      bx = show.lerp(cx[0] - 80, cx[0], u)
      by = top - Math.sin(Math.PI * (0.5 + u * 0.5)) * 30
    } else {
      let i = starts.findLastIndex((s) => t >= s)
      const next = i + 1 < starts.length ? starts[i + 1] : L.t1
      const u = clamp((t - starts[i]) / Math.max(0.12, next - starts[i]))
      const toX = i + 1 < cx.length ? cx[i + 1] : cx[i] + 40
      bx = show.lerp(cx[i], toX, u)
      by = top - Math.sin(Math.PI * u) * Math.min(30, 14 + (toX - cx[i]) * 0.2)
      if (i === starts.length - 1 && t > L.t1) by = top
    }
    const sq = by > top - 3 ? 1.25 : 1
    ctx.save()
    ctx.translate(bx, by)
    ctx.scale(sq, 1 / sq)
    draw.ring(ctx, 0, 0, 7, P.gold, 2.2, { alpha: a, hot: true })
    draw.dot(ctx, 0, 0, 5, P.gold, a)
    ctx.restore()
  },

  // the dreams: each draws itself while it is sung about, then gets stamped
  dreams(ctx, t, show) {
    const { draw, P, clamp } = show
    const prog = (id, d) => clamp(show.progress(id, d))
    const stampAge = (id) => show.since(id) - 0.08
    const fade = (from, dur = 0.5) => 1 - clamp(show.progress(from, dur))

    // 1 · the posting-weather channel (verse 1 → chorus 1 → "Built it.")
    {
      const a = prog('v1-a', 0.5) * fade(show.at('built-1.end') + 1.6)
      if (a > 0) this.weather(ctx, 24, 170, a, prog('v1-a', 3), prog('v1-b', 3), t, show, show.since('built-1'))
    }
    // 2 · the museum and 3 · the podcast with no name (verse 2 → "Built it." → "Both of them?")
    {
      const out = fade(show.at('both.end') + 1.5)
      const a1 = prog('v2-a', 0.5) * out
      if (a1 > 0) this.museum(ctx, 24, 170, a1, prog('v2-a', 2.8), show.since('built-2'), show)
      const a2 = prog('v2-b', 0.5) * out
      if (a2 > 0) this.podcast(ctx, 1052, 170, a2, prog('v2-b', 2.8), show.since('both.end') + 0.05, t, show)
    }
    // 4 · a song made out of mouths (breakdown → "Built it." → "When?" → "You are in it.")
    {
      const a = prog('bd-a', 0.6) * fade(show.at('reveal') + 0.2, 0.4)
      if (a > 0) this.songSheet(ctx, 24, 170, a, prog('bd-a', 3.4), prog('bd-b', 2.8), show.since('built-3'), t, show)
      // "You are in it.": the whole frame becomes the vignette, with a YOU ARE HERE pin on Larry
      const yu = show.since(show.at('in-it.end') - 0.5)
      const h = show.headOf('larry')
      if (yu > 0 && h) {
        const k = clamp(yu / 0.45), out2 = 1 - clamp((yu - 4.2) / 0.6)
        if (out2 > 0) {
          const ins = show.lerp(300, 16, show.ease.outCubic(k))
          draw.box(ctx, ins, ins * 0.56, 1280 - 2 * ins, 720 - 2 * ins * 0.56, { color: P.gold, fill: null, cut: 12, alpha: out2, hot: k < 1 })
          const px = h.x, py = h.y - h.size * 0.62
          const drop = show.ease.outBack(clamp((yu - 0.25) / 0.4))
          const pin = drop * (1 - clamp(show.progress(show.at('c3-a') - 0.75, 0.3)))
          if (pin > 0) {
            draw.beamPts(ctx, [[px, py - 6], [px - 14, py - 34], [px + 14, py - 34]], P.red, 2.4, { close: true, alpha: out2 * pin, hot: true })
            draw.label(ctx, 'YOU ARE HERE', px + 22, py - 40, { size: 20, color: P.red, weight: 'm', ls: 0.15, alpha: out2 * pin })
          }
          const tl = k * out2
          draw.box(ctx, 640 - 70, ins * 0.56 - 12, 140, 24, { color: P.gold, fill: '#000', cut: 4, alpha: tl })
          draw.label(ctx, 'THIS SONG', 640, ins * 0.56 + 5, { size: 13, align: 'center', color: P.gold, alpha: tl, ls: 0.35 })
        }
      }
    }
    // 5 · the tag: "just as a joke" (spoken bubble) → BUILT IT
    {
      if (show.since('built-4') > -0.15 && show.since('built-4.end') < 2.4) {
        if (show.since('built-4') > 0) draw.occlude(ctx, draw.roundPath(790, 186, 230, 64, 8), '#000', 0.85)
        draw.stamp(ctx, 905, 220, 'BUILT IT', { age: show.since('built-4') - 0.08, rot: -0.08, size: 36, color: P.lime })
      }
    }
  },

  // a vignette frame: black card, a title, corner brackets drawn in by `p`
  card(ctx, x, y, w, hh, title, a, p, show, color) {
    const { draw, P } = show
    draw.box(ctx, x, y, w, hh, { color: color ?? P.sky, fill: '#000', fillAlpha: 0.82 * a, cut: 8, alpha: a * Math.min(1, p * 3) })
    draw.label(ctx, title, x + 12, y + 24, { size: 11, color: color ?? P.sky, alpha: a, ls: 0.25 })
  },

  weather(ctx, x, y, a, p1, p2, t, show, sAge) {
    const { draw, P, clamp } = show
    const w = 244, hh = 190
    this.card(ctx, x, y, w, hh, 'THE SIMCLUSTER CHANNEL', a, p1, show)
    draw.label(ctx, 'LOCAL ON THE 8’S', x + 12, y + 42, { size: 11, color: P.amber, alpha: a * p1, ls: 0.25 })
    if (p1 > 0.15) draw.sun(ctx, x + 44, y + 92, 18, t)
    if (p1 > 0.35) draw.cloud(ctx, x + 92, y + 84, 0.7)
    if (p1 > 0.55) draw.rain(ctx, x + 92, y + 96, 0.7, t)
    // high / low posts per hour (the real forecast from the channel's launch post)
    const hi = Math.round(177 * clamp(p2 * 1.4))
    draw.label(ctx, 'HIGH', x + 136, y + 78, { size: 12, color: P.coral, alpha: a * clamp(p2 * 3), ls: 0.2 })
    draw.label(ctx, String(hi), x + 176, y + 82, { size: 26, color: P.white, alpha: a * clamp(p2 * 3), weight: 'm' })
    draw.label(ctx, 'LOW', x + 136, y + 114, { size: 12, color: P.sky, alpha: a * clamp(p2 * 3 - 0.6), ls: 0.2 })
    draw.label(ctx, String(Math.round(29 * clamp(p2 * 1.4))), x + 176, y + 118, { size: 26, color: P.white, alpha: a * clamp(p2 * 3 - 0.6), weight: 'm' })
    draw.label(ctx, 'POSTS / HOUR', x + 136, y + 136, { size: 10, color: P.blueMid, alpha: a * clamp(p2 * 3 - 0.6), ls: 0.25 })
    // the claims advisory crawls in last
    const ca = clamp(p2 * 2.2 - 1)
    if (ca > 0) {
      draw.box(ctx, x + 10, y + hh - 40, w - 20, 28, { color: P.amber, fill: '#000', cut: 4, alpha: a * ca })
      draw.label(ctx, 'CLAIMS ADVISORY · CORVID WOODS', x + w / 2, y + hh - 21, { size: 10, align: 'center', color: P.amber, alpha: a * ca, ls: 0.12 })
    }
    if (sAge > -0.15) draw.stamp(ctx, x + w / 2, y + hh / 2 + 4, 'BUILT IT', { age: sAge - 0.08, rot: -0.14, size: 34, color: P.lime })
  },

  museum(ctx, x, y, a, p, sAge, show) {
    const { draw, P, clamp } = show
    const w = 244, hh = 190
    this.card(ctx, x, y, w, hh, 'SIMCLUSTER MUSEUM', a, p, show, P.goldMid)
    const cx = x + w / 2, base = y + hh - 34
    // pediment, columns and steps draw on in order
    const ped = clamp(p * 3)
    draw.beamPts(ctx, [[cx - 90, y + 82], [cx, y + 82 - 34 * ped], [cx + 90, y + 82]], P.gold, 2, { close: true, alpha: a * ped })
    for (let i = 0; i < 5; i++) {
      const c = clamp(p * 5 - 1 - i * 0.5)
      if (c <= 0) continue
      const xx = cx - 72 + i * 36
      draw.seg(ctx, xx - 7, y + 90, xx - 7, y + 90 + (base - y - 90) * c, P.gold, 1.4, { alpha: a })
      draw.seg(ctx, xx + 7, y + 90, xx + 7, y + 90 + (base - y - 90) * c, P.gold, 1.4, { alpha: a })
    }
    const st = clamp(p * 3 - 1.8)
    if (st > 0) {
      draw.seg(ctx, cx - 96 * st, base + 2, cx + 96 * st, base + 2, P.gold, 2, { alpha: a })
      draw.seg(ctx, cx - 106 * st, base + 10, cx + 106 * st, base + 10, P.gold, 2, { alpha: a })
    }
    if (sAge > -0.15) draw.stamp(ctx, cx, y + hh / 2 + 6, 'BUILT IT', { age: sAge - 0.08, rot: -0.12, size: 34, color: P.lime })
  },

  podcast(ctx, x, y, a, p, sAge, t, show) {
    const { draw, P, clamp } = show
    const w = 196, hh = 190
    this.card(ctx, x, y, w, hh, 'PODCAST', a, p, show, P.violet)
    const cx = x + w / 2
    const m = clamp(p * 2.5)
    draw.box(ctx, cx - 18, y + 46, 36, 64 * m, { color: P.violet, fill: null, radius: 16, alpha: a * m })
    if (m >= 1) {
      draw.beamPts(ctx, [[cx - 30, y + 92], [cx - 30, y + 110], [cx, y + 126], [cx + 30, y + 110], [cx + 30, y + 92]], P.violet, 1.6, { alpha: a })
      draw.seg(ctx, cx, y + 126, cx, y + 146, P.violet, 1.6, { alpha: a })
      draw.seg(ctx, cx - 20, y + 146, cx + 20, y + 146, P.violet, 1.6, { alpha: a })
    }
    const nm = clamp(p * 2.5 - 1.3)
    if (nm > 0) {
      draw.label(ctx, 'NAME:', x + 16, y + hh - 18, { size: 12, color: P.violet, alpha: a * nm, ls: 0.2 })
      draw.seg(ctx, x + 70, y + hh - 20, x + 70 + (w - 90) * nm, y + hh - 20, P.white, 1.4, { alpha: a * (0.6 + 0.4 * Math.sin(t * 8)), dash: [6, 5] })
    }
    if (sAge > -0.15) draw.stamp(ctx, cx, y + hh / 2 + 6, 'BUILT IT', { age: sAge - 0.08, rot: 0.14, size: 30, color: P.lime })
  },

  songSheet(ctx, x, y, a, p1, p2, sAge, t, show) {
    const { draw, P, clamp } = show
    const w = 244, hh = 190
    this.card(ctx, x, y, w, hh, 'A SONG, MADE OF MOUTHS', a, p1, show, P.pink)
    // a staff that draws on, then notes that are little mouths
    for (let i = 0; i < 5; i++) {
      const s = clamp(p1 * 2.5 - i * 0.15)
      draw.seg(ctx, x + 20, y + 60 + i * 12, x + 20 + (w - 40) * s, y + 60 + i * 12, P.pink, 1, { alpha: a * 0.6 })
    }
    const notes = [[0.12, 3], [0.27, 1], [0.42, 2], [0.57, 0], [0.72, 2], [0.87, 4]]
    notes.forEach(([u, k], i) => {
      const s = clamp(p2 * 7 - i)
      if (s <= 0) return
      const nx = x + 20 + (w - 40) * u, ny = y + 60 + k * 12 + 6
      const open = 0.4 + 0.6 * Math.abs(Math.sin(t * 6 + i))
      draw.beamPts(ctx, [[nx - 11, ny], [nx, ny - 5 * open], [nx + 11, ny], [nx, ny + 6 * open]], P.coral, 1.8, { close: true, alpha: a * s })
      draw.seg(ctx, nx + 11, ny, nx + 11, ny - 34, P.coral, 1.4, { alpha: a * s })
    })
    draw.label(ctx, 'ALL OF US · SINGING ALONG', x + w / 2, y + hh - 20, { size: 11, align: 'center', color: P.pink, alpha: a * clamp(p2 * 2 - 1), ls: 0.2 })
    if (sAge > -0.15) draw.stamp(ctx, x + w / 2, y + hh / 2 + 6, 'BUILT IT', { age: sAge - 0.08, rot: -0.1, size: 34, color: P.lime })
  },
}
