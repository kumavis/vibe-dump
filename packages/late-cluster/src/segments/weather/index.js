// Segment 3 · The Simcluster Channel: Local on the 8's.
// A credited tribute to @samantha.wiki's real "The Simcluster Channel" (weather.samantha.wiki,
// launched 2026-10-20): a Weather-Channel parody that forecasts the cluster's posts per hour with a
// small time-series model on a Raspberry Pi. The Samantha puppet presents in front of the window
// (`ots`), Larry reacts from the picture-in-picture, and the map does the heavy lifting.
//
// Frames: node tools/shoot.mjs weather 4 10 15 20 25 28 33 38 40.5 43.5 46 49 54.8 56 58 63 70

const REAL_POST = "You're watching The Simcluster Channel! And here's your Local on the 8's...\nToday's high/low posts/hour is 177/29 with a high around 4pm ET."
const GN_POST = 'Everyone says gm but nobody says gn :('

export default {
  title: "The Simcluster Channel: Local on the 8's",
  bumper: { sub: 'the cluster forecasts itself' },
  cast: ['samantha'],
  disclaimer: { text: 'Samantha is a puppet playing a posting persona. Parody, and a tribute to The Simcluster Channel.', from: 'channel', dur: 6 },
  built: { from: 2, bumps: ['builtit'] },
  defaultShot: 'desk',

  shots: [
    { at: 0, shot: 'desk' },
    { at: 'intro2', after: 0.6, shot: 'desk', zoom: 2.2, push: 2 },
    { at: 'jingle', shot: 'ots', who: 'samantha', pip: 'larry', pipLabel: 'LARRY NX · STUDIO' },
    { at: 'desk', shot: 'desk' },
    { at: 'button', after: 1.6, shot: 'desk', zoom: 2.15, push: 1.4 },
  ],

  setup(show) {
    const { draw } = show
    // the cluster as a region: a made-up country in the left two thirds of the panel
    this.R = { x: 548, y: 118, w: 440, h: 392 }
    this.map = draw.blobRegion('simcluster-channel', this.R, { points: 48 })
    this.districts = [
      { name: 'CORVID WOODS', x: 760, y: 168, at: 0.2 },
      { name: 'PIRANESI HALLS', x: 618, y: 300, at: 0.5 },
      { name: 'CATOID HILLS', x: 902, y: 268, at: 0.8 },
      { name: 'TOP CHICKEN RIDGE', x: 790, y: 360, at: 1.1 },
      { name: 'DISCORD BASIN', x: 660, y: 430, at: 1.4 },
      { name: 'SH*TPOST COAST', x: 850, y: 498, at: 1.7, sea: true },
    ]
    // Corvid Woods: the advisory polygon in the north of the region
    const woods = new Path2D()
    const wp = [[690, 140], [760, 128], [838, 142], [852, 196], [790, 214], [712, 206], [684, 176]]
    wp.forEach(([x, y], i) => (i ? woods.lineTo(x, y) : woods.moveTo(x, y)))
    woods.closePath()
    this.woods = woods
    this.woodsPts = wp
    // catoids scattered across the hills (one has antlers: the rat-deer)
    const r = show.rng('catoids')
    this.cats = Array.from({ length: 7 }, (_, i) => ({ x: 600 + r() * 340, y: 230 + r() * 210, s: 0.7 + r() * 0.4, d: i * 0.18, deer: i === 3 }))
    Object.assign(this.cats[3], { x: 772, y: 296, s: 1.15 })
  },

  direct(t, show) {
    const sam = show.puppet('samantha')
    const larry = show.puppet('larry')
    // Larry: to camera at the desk; in the PiP he watches the forecast
    if (show.since('jingle') < 0) larry.lookAt('camera')
    if (show.between('intro2', 'jingle')) larry.nod(0.04 * Math.sin(t * 3))
    // Samantha: to camera for the patter, turned to the map for the weather, to the PiP for Larry
    if (show.since('jingle') >= 0) {
      let look = 'camera'
      if (show.between('advisory', 'catoid') && !show.line('reading').active) look = 'right'
      if (show.between('website', 'hundred')) look = 'right'
      if (show.since('back') >= 0) look = 'right'
      sam.lookAt(look)
      if (show.line('gn').active) sam.tilt(0.08)
      if (show.line('shipped').active) sam.nod(-0.05)
    }
    if (show.since('desk') >= 0) larry.lookAt('camera')

    // lower thirds
    show.chyron('samantha', { from: show.at('channel') + 0.4, dur: 4.2 })
    show.chyron({ name: 'The Simcluster Channel', title: 'A tribute · weather.samantha.wiki', color: show.P.sky }, { from: 'pi', to: 'desk' })
  },

  drawBack(ctx, t, show) {
    const { draw, P } = show
    const pn = show.panel
    if (!pn) return
    const s = (name) => show.since(name)

    // the Weather Channel header strip (always on in the ots shot)
    draw.occlude(ctx, draw.rectPath(pn.x + 2, pn.y + 2, pn.w - 4, 40), '#04102a', 1)
    for (let k = 0; k < 4; k++) draw.seg(ctx, pn.x + 6, pn.y + 8 + k * 9, pn.x + pn.w - 6, pn.y + 8 + k * 9, P.blueDim, 0.6, { alpha: 0.35 })
    draw.label(ctx, 'THE SIMCLUSTER CHANNEL', pn.x + 18, pn.y + 29, { size: 16, color: P.white, weight: 'm', ls: 0.18 })
    draw.label(ctx, "LOCAL ON THE 8'S", pn.x + pn.w - 18, pn.y + 29, { size: 16, color: P.gold, weight: 'm', ls: 0.18, align: 'right' })
    draw.seg(ctx, pn.x + 2, pn.y + 42, pn.x + pn.w - 2, pn.y + 42, P.sky, 1.2, { hot: true })

    // ---- the title card while the Formants play the tag, and as she says the real opener
    if (s('map') < 0) {
      const u = show.progress('jingle', 0.8)
      for (let k = 0; k < 14; k++) {
        const y = pn.y + 60 + k * 30
        draw.seg(ctx, pn.x + 20, y, pn.x + 20 + (pn.w - 40) * show.ease.outCubic(show.clamp(u * 1.4 - k * 0.04)), y, k % 2 ? P.blueDim : P.blueMid, 1, { alpha: 0.35 })
      }
      const ty = s('channel') < 0 ? 215 : show.tween(t, show.at('channel'), show.at('channel') + 0.6, 215, 160, 'inOutCubic')
      draw.glowText(ctx, "LOCAL ON THE 8'S", pn.x + pn.w / 2, ty, { size: 54, align: 'center', color: P.gold, weight: 'm', ls: 0.12, alpha: u })
      draw.label(ctx, 'YOUR CLUSTER FORECAST', pn.x + pn.w / 2, ty + 40, { size: 16, align: 'center', color: P.sky, ls: 0.4, alpha: u * (1 - show.progress('channel', 0.4)) })
      if (s('channel') < 0) {
        draw.label(ctx, 'A TRIBUTE TO THE SIMCLUSTER CHANNEL', pn.x + pn.w / 2, ty + 90, { size: 14, align: 'center', color: P.white, ls: 0.25, alpha: show.clamp(show.since('jingle') - 0.8) })
        draw.label(ctx, 'by @samantha.wiki · weather.samantha.wiki · 20 Oct 2026', pn.x + pn.w / 2, ty + 116, { size: 13, align: 'center', color: P.blueMid, ls: 0.1, alpha: show.clamp(show.since('jingle') - 1.2) })
      }
      return
    }

    // ---- the map
    const R = this.R
    const mapIn = show.progress('map', 0.8)
    ctx.save()
    ctx.globalAlpha = mapIn
    // sea hatching
    for (let k = 0; k < 9; k++) {
      const y = R.y + 10 + k * 46
      draw.seg(ctx, R.x - 6, y, R.x + R.w + 6, y, P.blueDim, 0.7, { alpha: 0.18 })
    }
    draw.occlude(ctx, this.map.path, '#020814', 1)
    draw.region(ctx, this.map, { color: P.sky })
    // a radar sweep from the centre
    const cx = R.x + R.w / 2, cy = R.y + R.h / 2
    const ang = t * 1.4
    draw.seg(ctx, cx, cy, cx + Math.cos(ang) * 190, cy + Math.sin(ang) * 170, P.green, 1, { alpha: 0.35 })
    ctx.restore()

    // district labels type on, with their little glyphs
    for (const d of this.districts) {
      const u = show.progress(show.at('map') + d.at, 0.6)
      if (u <= 0) continue
      const n = Math.ceil(d.name.length * u)
      draw.label(ctx, d.name.slice(0, n), d.x, d.y, { size: 12, align: 'center', color: d.sea ? P.cyan : P.sky, ls: 0.16, alpha: 0.9 })
    }
    // Corvid Woods: little pines
    const pines = show.clamp(show.progress(show.at('map') + 0.3, 0.6))
    for (let i = 0; i < 6; i++) {
      const x = 712 + i * 21, y = 196 + (i % 2) * 6
      if (pines <= i / 6) continue
      draw.beamPts(ctx, [[x - 6, y], [x, y - 14], [x + 6, y]], P.green, 1.2, { alpha: 0.8, close: true })
    }
    // Piranesi Halls: columns
    for (let i = 0; i < 4; i++) {
      const x = 590 + i * 18, y = 324
      if (pines <= i / 4) continue
      draw.seg(ctx, x, y - 16, x, y, P.white, 1.2, { alpha: 0.6 })
    }
    if (pines > 0) draw.seg(ctx, 584, 306, 650, 306, P.white, 1.2, { alpha: 0.6 * pines })
    // Top Chicken Ridge: a jagged ridge line
    if (pines > 0.5) draw.beamPts(ctx, [[742, 384], [760, 372], [774, 380], [790, 366], [806, 378], [822, 370], [838, 384]], P.coral, 1.2, { alpha: 0.7 })

    // ---- readouts (right column, above the PiP)
    const rx = 1012, rw = 216
    if (s('high') > -0.2) {
      draw.box(ctx, rx, 112, rw, 240, { color: P.blueMid, cut: 8, width: 1.2, fillAlpha: 0.9 })
      draw.label(ctx, 'TODAY · POSTS / HOUR', rx + rw / 2, 136, { size: 11, align: 'center', color: P.sky, ls: 0.2 })
      const hl = show.line('high'), ll = show.line('low')
      const hiAt = hl.words.find((w) => w[2].startsWith('177'))?.[0] ?? hl.t0
      const loAt = ll.words.find((w) => w[2].startsWith('29'))?.[0] ?? ll.t0
      draw.label(ctx, 'HIGH', rx + 20, 178, { size: 14, color: P.red, weight: 'm', ls: 0.2 })
      draw.splitFlap(ctx, rx + 96, 196, '177', { age: t - hiAt, size: 34, color: P.red })
      if (t > loAt - 0.3) {
        draw.label(ctx, 'LOW', rx + 20, 246, { size: 14, color: P.sky, weight: 'm', ls: 0.2 })
        draw.splitFlap(ctx, rx + 96, 264, '29', { age: t - loAt, size: 34, color: P.sky, cells: 3 })
      }
      if (t > loAt + 0.8) {
        draw.label(ctx, 'PEAK AROUND 4 PM ET', rx + rw / 2, 304, { size: 11, align: 'center', color: P.gold, ls: 0.15 })
        draw.label(ctx, 'REAL · SIMCLUSTER CHANNEL, 20 OCT', rx + rw / 2, 332, { size: 11, align: 'center', color: P.blueMid, ls: 0.02 })
      }
    }

    // ---- the Claims Advisory over Corvid Woods
    if (s('advisory') > 0) {
      const a = show.clamp(s('advisory') / 0.4) * (s('outlook') > 0 ? 0.35 : 1)
      const pulse = 0.55 + 0.45 * Math.sin(t * 5)
      ctx.save()
      ctx.clip(this.woods)
      for (let k = -12; k < 14; k++) draw.seg(ctx, 680 + k * 14, 130, 720 + k * 14, 220, P.amber, 1, { alpha: 0.45 * a * pulse })
      ctx.restore()
      draw.beam(ctx, this.woods, P.amber, 1.8, { alpha: a, hot: pulse > 0.8 })
      if (s('front') < 0) {
        // the advisory banner across the top of the map
        const bx = 548, by = 52 + 64 - 2
        draw.box(ctx, bx, by, 450, 26, { color: P.amber, cut: 4, width: 1.4, fillAlpha: 0.92 })
        const adv = 'CLAIMS ADVISORY · CORVID WOODS · UNTIL FURTHER HEURISTIC'
        const advSize = Math.min(13, (10 * 432) / draw.labelWidth(ctx, adv, { size: 10, weight: 'm', ls: 0.06 }))
        draw.label(ctx, adv, bx + 225, by + 18, { size: advSize, align: 'center', color: P.amber, weight: 'm', ls: 0.06, alpha: 0.6 + 0.4 * pulse })
      }
    }

    // ---- the Piranesi front rolls in from the west: its triangles are tiny open books
    if (s('front') > 0) {
      const dx = Math.min(70, s('front') * 14)
      const pts = [[548, 250], [580, 290], [600, 340], [598, 400], [620, 450]].map(([x, y]) => [x + dx, y])
      const bookMark = (c, x, y, ang) => {
        c.save()
        c.translate(x, y)
        c.rotate(ang - Math.PI / 2 + Math.PI)
        const L = new Path2D(), Rr = new Path2D()
        L.moveTo(0, 0); L.lineTo(-9, -3); L.lineTo(-9, 7); L.lineTo(0, 10); L.closePath()
        Rr.moveTo(0, 0); Rr.lineTo(9, -3); Rr.lineTo(9, 7); Rr.lineTo(0, 10); Rr.closePath()
        draw.occlude(c, L); draw.occlude(c, Rr)
        draw.beam(c, L, P.coral, 1.3, { hot: true }); draw.beam(c, Rr, P.coral, 1.3, { hot: true })
        c.restore()
      }
      draw.front(ctx, pts, { kind: bookMark, color: P.coral, progress: show.progress('front', 1.6), spacing: 34 })
      draw.label(ctx, 'PIRANESI FRONT', pts[0][0] + 6, 236, { size: 12, color: P.coral, weight: 'm', ls: 0.15, alpha: show.progress('front', 0.6) })
      if (s('reading') > 0 && s('catoid') < 0.3) {
        const rl = show.line('reading')
        const inAt = rl.words.find((w) => w[2].startsWith('inches'))?.[0] ?? rl.t0
        const u = show.clamp((t - inAt) / 0.5)
        if (u > 0) {
          draw.box(ctx, 600, 470, 340, 40, { color: P.coral, cut: 6, width: 1.3, fillAlpha: 0.92 })
          draw.label(ctx, 'ACCUMULATION', 616, 487, { size: 11, color: P.coral, ls: 0.25, alpha: u })
          draw.label(ctx, '2–3 IN. OF ASSIGNED READING', 616, 503, { size: 13, color: P.white, weight: 'm', ls: 0.08, alpha: u })
          // a growing stack of books
          const nb = Math.floor(show.clamp((t - inAt) / 1.2) * 3) + 1
          for (let k = 0; k < nb; k++) draw.box(ctx, 896, 498 - k * 9, 34, 8, { color: [P.coral, P.gold, P.sky][k], radius: 2, width: 1.1 })
        }
      }
    }

    // ---- scattered catoids (one rat-deer), then the vocal-synth pressure system
    if (s('catoid') > 0 && s('outlook') < 0) {
      for (const c of this.cats) {
        const u = show.clamp((s('catoid') - c.d) / 0.3)
        if (u <= 0) continue
        const cy = c.y + 6 * Math.sin(t * 2 + c.d * 9)
        catGlyph(ctx, draw, P, c.x, cy, c.s * show.ease.outBack(u), c.deer, t)
        if (c.deer) draw.label(ctx, 'RAT-DEER?', c.x + 18, cy + 4, { size: 11, color: P.gold, ls: 0.12, alpha: u })
      }
    }
    if (s('synth') > 0 && s('outlook') < 0) {
      const sx = 900, sy = 400
      const u = show.progress('synth', 0.8)
      draw.isobar(ctx, sx, sy, 70 * u, { seed: 4, color: P.magenta })
      draw.isobar(ctx, sx, sy, 42 * u, { seed: 7, color: P.magenta })
      draw.label(ctx, 'H', sx, sy + 9, { size: 26, align: 'center', color: P.magenta, weight: 'm', alpha: u })
      draw.label(ctx, 'VOCAL SYNTH FRONT', sx, sy - 58, { size: 11, align: 'center', color: P.magenta, ls: 0.15, alpha: u })
      for (let k = 0; k < 4; k++) {
        const a = t * 0.9 + (k * Math.PI) / 2
        headGlyph(ctx, draw, P, sx + Math.cos(a) * 58, sy + Math.sin(a) * 38, 0.8, t + k)
      }
      // ...and where it's headed
      const sl = show.line('synth')
      const hAt = sl.words.find((w) => w[2].startsWith('heads'))?.[0] ?? sl.t1
      const au = show.clamp((t - hAt) / 0.4)
      if (au > 0) {
        draw.arrow(ctx, 968, 330, 968 + 50 * au, 330 + 40 * au, P.gold, 2, { hot: true })
        draw.label(ctx, 'ETA: THIS STUDIO', 960, 320, { size: 11, align: 'right', color: P.gold, weight: 'm', ls: 0.15, alpha: au })
      }
    }

    // ---- 5-day outlook strip + gm/gn chances
    if (s('outlook') > 0 && s('pi') < 0.5) {
      const up = show.ease.outCubic(show.progress('outlook', 0.6)) * (1 - show.ease.inCubic(show.progress('pi', 0.5)))
      const y0 = 402 + (1 - up) * 130
      const days = [
        ['FRI', 'CATOID', 'cat'], ['SAT', 'RAT-DEER', 'deer'], ['SUN', 'SINGING', 'head'], ['MON', 'READING', 'book'], ['TUE', '??? WEEK', 'q'],
      ]
      draw.box(ctx, 548, y0, 446, 118, { color: P.sky, cut: 6, width: 1.3, fillAlpha: 0.95 })
      draw.label(ctx, '5-DAY OUTLOOK', 560, y0 + 18, { size: 11, color: P.sky, ls: 0.3 })
      days.forEach(([d, lab, kind], i) => {
        const x = 560 + i * 87, u = show.clamp((s('outlook') - 0.3 - i * 0.15) / 0.3)
        if (u <= 0) return
        draw.label(ctx, d, x + 40, y0 + 40, { size: 13, align: 'center', color: P.white, weight: 'm', ls: 0.2, alpha: u })
        const gx = x + 40, gy = y0 + 70
        if (kind === 'cat') catGlyph(ctx, draw, P, gx, gy, 0.9 * u, false, t)
        if (kind === 'deer') catGlyph(ctx, draw, P, gx, gy, 0.9 * u, true, t)
        if (kind === 'head') headGlyph(ctx, draw, P, gx, gy, 1.1 * u, t)
        if (kind === 'book') draw.book(ctx, gx, gy, { scale: 0.42 * u, open: 0.85, color: P.coral })
        if (kind === 'q') draw.label(ctx, '?', gx, gy + 10, { size: 30, align: 'center', color: P.gold, weight: 'm', alpha: u })
        draw.label(ctx, lab, x + 40, y0 + 106, { size: 11, align: 'center', color: P.sky, ls: 0.06, alpha: u })
      })
      // chance of gm / gn, in the readout column
      const gmL = show.line('gm'), gnL = show.line('gn')
      const gmU = show.clamp((t - gmL.t0 - 0.6) / 0.9), gnU = show.clamp((t - gnL.t0) / 0.6)
      draw.box(ctx, rx, 112, rw, 240, { color: P.gold, cut: 8, width: 1.2, fillAlpha: 1 })
      draw.label(ctx, 'CHANCE OF', rx + rw / 2, 138, { size: 11, align: 'center', color: P.gold, ls: 0.3 })
      draw.label(ctx, 'GM', rx + 20, 182, { size: 22, color: P.white, weight: 'm', ls: 0.1 })
      draw.box(ctx, rx + 70, 164, 120, 20, { color: P.blueMid, width: 1, fillAlpha: 1 })
      if (gmU > 0) draw.box(ctx, rx + 72, 166, 116 * gmU, 16, { color: P.lime, width: 1, fill: P.lime, fillAlpha: 0.5, hot: true })
      draw.label(ctx, `${Math.round(100 * gmU)}%`, rx + 130, 208, { size: 16, align: 'center', color: P.lime, weight: 'm' })
      if (gnU > 0) {
        draw.label(ctx, 'GN', rx + 20, 262, { size: 22, color: P.white, weight: 'm', ls: 0.1, alpha: gnU })
        draw.box(ctx, rx + 70, 244, 120, 20, { color: P.blueMid, width: 1, fillAlpha: 1 })
        draw.box(ctx, rx + 72, 246, 4, 16, { color: P.violet, width: 1, fill: P.violet, fillAlpha: 0.5 })
        draw.label(ctx, 'RARE :(', rx + 130, 288, { size: 16, align: 'center', color: P.violet, weight: 'm', alpha: gnU })
      }
    }

    // ---- the footnote: what the real forecast runs on
    if (s('pi') > 0) {
      const u = show.progress('pi', 0.5)
      draw.box(ctx, rx, 112, rw, 240, { color: P.green, cut: 8, width: 1.2, fillAlpha: 1 })
      draw.label(ctx, 'FORECAST MODEL', rx + rw / 2, 140, { size: 11, align: 'center', color: P.green, ls: 0.3, alpha: u })
      draw.label(ctx, 'TIMESTRAL 209M', rx + rw / 2, 176, { size: 17, align: 'center', color: P.white, weight: 'm', ls: 0.06, alpha: u })
      draw.label(ctx, 'ON A RASPBERRY PI 5', rx + rw / 2, 202, { size: 13, align: 'center', color: P.white, ls: 0.1, alpha: u })
      // a little board
      draw.box(ctx, rx + 70, 222, 76, 46, { color: P.green, radius: 4, width: 1.2, alpha: u })
      for (let k = 0; k < 8; k++) draw.dot(ctx, rx + 78 + k * 8.5, 228, 1.4, P.gold, u)
      draw.box(ctx, rx + 92, 238, 24, 20, { color: P.blueMid, width: 1, alpha: u })
      draw.label(ctx, '(REAL)', rx + rw / 2, 290, { size: 11, align: 'center', color: P.green, ls: 0.2, alpha: u })
      draw.label(ctx, 'OUR MODEL: ONE LARYNX', rx + rw / 2, 330, { size: 11, align: 'center', color: P.blueMid, ls: 0.15, alpha: show.clamp(s('pi') - 1.2) })
    }

    // credit line along the panel foot
    draw.label(ctx, 'AFTER WEATHER.SAMANTHA.WIKI · THE SIMCLUSTER CHANNEL BY @SAMANTHA.WIKI', 556, pn.y + pn.h - 7, { size: 11, color: P.blueMid, ls: 0.02, alpha: 0.85 })
  },

  drawFront(ctx, t, show) {
    const { draw, P } = show
    const pn = show.panel
    const s = (name) => show.since(name)
    if (!pn) return

    // her real post, as she says it
    if (s('channel') > -0.1 && s('map') < 0.4) {
      const u = s('channel') + 0.1
      const out = show.clamp(s('map') / 0.4)
      draw.skeetCard(ctx, {
        x: pn.x + 20, y: 196 + out * 40, w: 452, scale: 1,  // clear of the PiP (x ≥ 992)
        name: 'Samantha', handle: 'samantha.wiki', time: '20 Oct 2026', initials: 'S', color: P.sky,
        text: REAL_POST, likes: 124,
        appear: (u / 0.5) * (1 - out), reveal: (u - 0.2) / 2.6,
      })
    }

    // the crow over Corvid Woods (a first sighting) + the CLAIM stamp
    if (s('advisory') > 0 && s('catoid') < 0) {
      const u = s('advisory')
      const leave = show.clamp((s('front') - 1.5) / 1.5)
      const a = u * 1.6
      const x = 770 + Math.cos(a) * 70 + leave * 300, y = 165 + Math.sin(a) * 22 - leave * 120
      draw.crow(ctx, x, y, { scale: 0.85, flap: (t * 2.2) % 1, facing: Math.sin(a) > 0 ? -1 : 1 })
    }
    if (s('stamp') > -0.15 && s('front') < 1.2) {
      const fade = 1 - show.clamp((s('front') - 0.6) / 0.6)
      ctx.save()
      ctx.globalAlpha = fade
      draw.stamp(ctx, 770, 260, 'CLAIM', { age: s('stamp'), rot: -0.14, size: 40 })
      ctx.restore()
    }

    // her real gn post
    if (s('gn') > -0.1 && s('website') < 0.3) {
      const u = s('gn') + 0.1
      const out = show.clamp(s('website') / 0.3)
      draw.skeetCard(ctx, {
        x: pn.x + 40, y: 150, w: 430,
        name: 'Samantha', handle: 'samantha.wiki', time: '20 Oct 2026', initials: 'S', color: P.sky,
        text: GN_POST, likes: 36,
        appear: (u / 0.4) * (1 - out), reveal: (u - 0.1) / 0.8,
      })
    }

    // "It shipped during that sentence..": a browser window lands on the map
    const shipAt = show.at('shipped')
    if (t > shipAt + 0.6 && s('pi') < 0.3) {
      const u = show.clamp((t - shipAt - 0.6) / 0.35)
      const k = show.ease.outBack(u)
      const k2 = k * (1 - show.clamp(s('pi') / 0.3)), w = 300 * k2, h = 150 * k2, x = 770 - w / 2, y = 290 - h / 2
      if (k2 > 0.05) {
        draw.box(ctx, x, y, w, h, { color: P.lime, radius: 8, width: 1.6, fillAlpha: 0.96, hot: u < 1 })
        draw.seg(ctx, x, y + 26 * k2, x + w, y + 26 * k2, P.lime, 1)
        for (let i = 0; i < 3; i++) draw.ring(ctx, x + (14 + i * 14) * k2, y + 13 * k2, 3.5 * k2, [P.red, P.gold, P.green][i], 1.2)
        if (u >= 1 && k2 > 0.95) {
          draw.label(ctx, 'websitebymorning.example', x + 64, y + 18, { size: 11, color: P.blueMid, ls: 0.05 })
          draw.label(ctx, 'WEBSITE BY MORNING', x + w / 2, y + 66, { size: 20, align: 'center', color: P.white, weight: 'm', ls: 0.1 })
          draw.label(ctx, 'STATUS: IT IS MORNING SOMEWHERE', x + w / 2, y + 96, { size: 11, align: 'center', color: P.lime, ls: 0.12 })
          draw.label(ctx, 'SHIPPED MID-SENTENCE', x + w / 2, y + 124, { size: 11, align: 'center', color: P.gold, ls: 0.2 })
        }
        draw.confetti(ctx, 770, 290, t - shipAt - 0.6, { seed: 3 })
      }
    }
  },
}

/** a catoid: a vector cat head (with antlers, it's a rat-deer) */
function catGlyph(ctx, draw, P, x, y, s, deer, t) {
  if (s <= 0.02) return
  const c = deer ? P.gold : P.lime
  const head = new Path2D()
  head.moveTo(x - 10 * s, y - 4 * s)
  head.lineTo(x - 9 * s, y - 16 * s)
  head.lineTo(x - 3 * s, y - 9 * s)
  head.lineTo(x + 3 * s, y - 9 * s)
  head.lineTo(x + 9 * s, y - 16 * s)
  head.lineTo(x + 10 * s, y - 4 * s)
  head.bezierCurveTo(x + 11 * s, y + 6 * s, x - 11 * s, y + 6 * s, x - 10 * s, y - 4 * s)
  draw.occlude(ctx, head)
  draw.beam(ctx, head, c, 1.3)
  draw.dot(ctx, x - 4 * s, y - 3 * s, 1.2, P.white)
  draw.dot(ctx, x + 4 * s, y - 3 * s, 1.2, P.white)
  draw.seg(ctx, x - 14 * s, y, x - 6 * s, y + 1 * s, c, 0.8, { alpha: 0.7 })
  draw.seg(ctx, x + 14 * s, y, x + 6 * s, y + 1 * s, c, 0.8, { alpha: 0.7 })
  if (deer) {
    for (const sd of [-1, 1]) draw.beamPts(ctx, [[x + sd * 6 * s, y - 12 * s], [x + sd * 12 * s, y - 26 * s], [x + sd * 18 * s, y - 30 * s], [x + sd * 12 * s, y - 26 * s], [x + sd * 9 * s, y - 32 * s]], P.gold, 1.2)
  }
}

/** a tiny singing vector head (for the vocal-synth front) */
function headGlyph(ctx, draw, P, x, y, s, t) {
  if (s <= 0.02) return
  const p = new Path2D()
  p.ellipse(x, y, 9 * s, 11 * s, 0, 0, Math.PI * 2)
  draw.occlude(ctx, p)
  draw.beam(ctx, p, P.magenta, 1.2)
  const open = 2 + 2 * Math.abs(Math.sin(t * 6))
  const m = new Path2D()
  m.ellipse(x + 2 * s, y + 4 * s, 3 * s, open * s * 0.6, 0, 0, Math.PI * 2)
  draw.beam(ctx, m, P.pink, 1)
  draw.dot(ctx, x + 3 * s, y - 3 * s, 1.1, P.white)
  draw.label(ctx, '♪', x + 12 * s, y - 8 * s - 4 * Math.sin(t * 3), { size: 10 * s, color: P.magenta, moving: true })
}
