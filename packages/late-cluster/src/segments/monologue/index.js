// Segment 2: Larry's monologue. Larry on his mark in front of the curtain. When a joke has a real
// artefact behind it, the camera slides him to the left third ("mono-side") and the artefact builds
// over his right shoulder. Pushes on the big punchlines, cutaways to Sibyl and the band.
//
// Preview: /?seg=monologue   ·   frames: node tools/shoot.mjs monologue 5 12 …

const A = { x: 600, y: 78, w: 630, h: 500 } // the over-the-shoulder graphics area (stage units)

export default {
  title: 'The Monologue',
  bumper: { sub: 'Larry Nx, standing up' },
  cast: ['hy', 'al', 'dee', 'pete', 'sibyl'],
  defaultShot: 'mono',
  built: { from: 1, bumps: ['built'] },

  shots: [
    { at: 0, shot: 'mono' },
    { at: 'week', after: 0.9, shot: 'mono-side', push: 1.0 },
    { at: 'algo', shot: 'mono-side' },
    { at: 'band-nod', after: 0.15, shot: 'band' },
    { at: 'nobody', shot: 'mono' },
    { at: 'checker-in', after: -0.4, shot: 'mono-side', push: 0.8 },
    { at: 'mom', shot: 'mono-close', push: 0.5, size: 0.75 },
    { at: 'gets', shot: 'mono-side' },
    { at: 'joke', shot: 'mono-close', push: 2.0, size: 0.8 },
    { at: 'bot-up', after: -0.15, shot: 'mono-bot' },
    { at: 'discord', shot: 'mono-side' },
    { at: 'jevbot', after: 0.4, shot: 'mono-side' },
    { at: 'to-sibyl', shot: 'podium' },
    { at: 'talk', shot: 'mono', push: 0 },
    { at: 'to-band', shot: 'band', zoom: 1.35 },
    { at: 'back-mono', shot: 'mono-side' },
    { at: 'throw', after: -0.15, shot: 'mono' },
    { at: 'throw.end', after: -0.4, shot: 'wide', larry: 'mono', push: 2.4 },
  ],

  setup(show) {
    const { SHOTS, draw } = show
    // Larry on his mark, camera slid right so he sits in the left third
    SHOTS['mono-side'] = (s, o = {}) => {
      const L = SHOTS.mono(s, o)
      return { ...L, cam: { ...L.cam, x: L.cam.x + (o.dx ?? 178) } }
    }
    // a push in on Larry's head (size: 0..1, how close)
    SHOTS['mono-close'] = (s, o = {}) => {
      const L = SHOTS.mono(s, o)
      const k = o.size ?? 1
      return { ...L, cam: { x: L.cam.x, y: 470, zoom: 1.78 + (3.1 - 1.78) * k }, audience: 0 }
    }
    // Larry plus the website bot, popping up from below frame at his left (screen right)
    SHOTS['mono-bot'] = (s, o = {}) => {
      const L = SHOTS.mono(s, o)
      const up = o.up ?? 1
      return {
        ...L,
        cam: { ...L.cam, x: L.cam.x + 60 },
        place: { ...L.place, bot: { x: 1170, y: 760 - 290 * up, scale: 1.05, look: 'larry', z: 6, floor: 1300 } },
      }
    }
    this.cluster = draw.makeCluster('mono-simclusters', { x: A.x + 30, y: A.y + 80, w: 290, h: 240 }, { clusters: 3, perCluster: 22 })
  },

  direct(t, show) {
    const lar = show.puppet('larry')

    // the bot rises on its cue, says its line, ducks back down
    if (show.between('bot-up', 'discord')) {
      const up = show.tween(t, show.at('bot-up'), show.at('bot-up') + 0.45, 0, 1, 'outBack') *
        show.tween(t, show.at('built.end') + 1.2, show.at('built.end') + 1.6, 1, 0, 'inCubic')
      show.shot('mono-bot', { up })
      lar.lookAt(show.since('built') > -0.1 && show.since('built.end') < 1.2 ? 'bot' : 'camera')
      show.puppet('bot').lookAt(show.speaking('bot') ? 'camera' : 'larry')
    }

    // in mono-side Larry glances at the graphic as each one lands, then back to us
    const glances = ['checker-in', 'footer-in', 'four-in', 'refusal-in', 'algo']
    for (const g of glances) {
      const u = show.since(g)
      if (u > 0.05 && u < 0.9) lar.lookAt(0.9) // three-quarter, towards screen right
    }
    // a little nod to sell the punchlines
    for (const id of ['monday', 'tribute', 'anyway', 'four', 'refused', 'ethical']) {
      const L = show.line(id)
      if (L.active && L.progress > 0.6) lar.nod(-0.05)
    }
    if (show.line('mom').active) lar.tilt(0.08)

    // the band: they nod along to "tribute band", and turn to camera for their unison line
    if (show.between('band-nod', 'nobody')) {
      for (const id of ['hy', 'al', 'dee', 'pete']) show.puppet(id).nod(0.06 * Math.sin((t - show.at('band-nod')) * 9))
    }
    // Sibyl, as Jevbot: deadpan to camera
    if (show.between('to-sibyl', 'talk')) show.puppet('sibyl').lookAt('camera')

    // lower thirds
    show.chyron('larry', { from: 0.9, to: 'week' })
    show.chyron({ name: 'Hy Oid & The Formants', title: 'A tribute band', color: show.P.magenta }, { from: show.at('band-nod') + 0.3, to: 'nobody' })
    show.chyron({ name: 'Sibyl Ant', title: 'Doing Jevbot · it has one setting', color: show.P.sky }, { from: show.at('to-sibyl') + 0.15, to: 'talk' })
  },

  drawFront(ctx, t, show) {
    const { draw, P } = show
    // the bot's confetti from its party popper
    const hb = show.headOf('bot')
    if (hb && show.since('built') > 0) draw.confetti(ctx, hb.x - hb.size * 0.2, hb.y + hb.size * 0.3, show.since('built') - 0.1, { seed: 7, count: 30, spread: 1.4 })

    // the graphics only live in the mono-side framing; they fade as the camera pushes off it
    const side = sideness(show)
    if (side <= 0.01) return
    ctx.save()
    ctx.globalAlpha *= side
    this.graphics(ctx, t, show)
    ctx.restore()
  },

  graphics(ctx, t, show) {
    const { draw, P } = show

    // ---- 2. catoid week rolls into chimera vocal synth week: a split-flap board
    if (show.between('week', 'algo')) {
      const u = show.since('week')
      frame(show, ctx, A.x + 20, A.y + 60, 590, 250, 'THIS WEEK ON BLUESKY', show.progress(show.at('week') + 0.9, 0.4))
      if (u > 1.4) {
        draw.splitFlap(ctx, A.x + 50, A.y + 150, 'CATOID WEEK', { age: u - 1.4, size: 26 })
        if (u > 2.6) draw.seg(ctx, A.x + 40, A.y + 132, A.x + 50 + 11 * 24.3, A.y + 132, P.red, 3, { hot: true })
      }
      if (u > 2.8) draw.splitFlap(ctx, A.x + 50, A.y + 230, 'CHIMERA VOCAL SYNTH', { age: u - 2.8, size: 26 })
      if (u > 3.6) draw.splitFlap(ctx, A.x + 50, A.y + 284, 'WEEK', { age: u - 3.6, size: 26 })
      // …and both weeks were one day
      const m = show.since('monday')
      if (m > 0.6) draw.stamp(ctx, A.x + 320, A.y + 390, 'TOTAL DURATION: 1 DAY', { age: m - 0.9, size: 26, rot: -0.07 })
    }

    // ---- 3. named after an algorithm Bluesky doesn't run
    if (show.between('algo', 'band-nod')) {
      const a = show.progress('algo', 0.4)
      frame(show, ctx, A.x + 10, A.y + 30, 610, 420, 'WHERE THE NAME COMES FROM', a)
      draw.drawGraph(ctx, this.cluster, t)
      draw.label(ctx, 'SIMCLUSTERS', A.x + 340, A.y + 140, { size: 24, color: P.sky, weight: 'm', ls: 0.12, alpha: a })
      draw.label(ctx, 'A TWITTER', A.x + 340, A.y + 180, { size: 15, color: P.blueMid, ls: 0.2, alpha: a })
      draw.label(ctx, 'RECOMMENDATION', A.x + 340, A.y + 202, { size: 15, color: P.blueMid, ls: 0.2, alpha: a })
      draw.label(ctx, 'ALGORITHM · c. 2020', A.x + 340, A.y + 224, { size: 15, color: P.blueMid, ls: 0.2, alpha: a })
      if (show.since('norun') > 0.2) {
        draw.butterfly(ctx, A.x + 90, A.y + 360, 46, P.bsky)
        draw.label(ctx, 'BLUESKY:', A.x + 140, A.y + 368, { size: 20, color: P.bsky, weight: 'm', ls: 0.12 })
        draw.stamp(ctx, A.x + 410, A.y + 362, 'NOT INSTALLED', { age: show.since('norun') - 0.9, size: 26, rot: -0.08 })
      }
    }

    // ---- 4. the membership checker (a web page) and its footer
    // (it stays up for "every joke gets built": this site was one; it fades as the camera pushes in)
    if (show.between('checker-in', 'bot-up')) this.checker(ctx, t, show)

    // ---- 6. the Discord paradox
    // (held into the Jevbot line so the quoted reply can be read; the dial replaces it)
    const dialAt = show.at('jevbot') + 1.3
    if (show.at('discord') <= t && t < dialAt) this.discords(ctx, t, show)

    // ---- 9. Jevbot's one setting (before the cut to Sibyl)
    if (dialAt <= t && t < show.at('to-sibyl')) this.dial(ctx, t, show)

    // ---- 10. the website bot that wouldn't
    if (show.between('back-mono', 'throw')) this.refusal(ctx, t, show)
  },

  // ------------------------------------------------------------------ graphics

  checker(ctx, t, show) {
    const { draw, P } = show
    const a = show.progress('checker-in', 0.45)
    const x = A.x + 10, y = A.y + 10, w = 610, h = 470
    browser(show, ctx, x, y, w, h, 'are you in the simcluster?', a)
    if (a < 0.5) return
    draw.label(ctx, 'ARE YOU IN THE SIMCLUSTER?', x + w / 2, y + 92, { size: 24, color: P.white, align: 'center', weight: 'm', ls: 0.08 })
    draw.label(ctx, 'FIND OUT! JUST ENTER YOUR HANDLE', x + w / 2, y + 120, { size: 13, color: P.blueMid, align: 'center', ls: 0.2 })
    // the handle field
    draw.box(ctx, x + 120, y + 140, w - 240, 38, { color: P.blueMid, radius: 6 })
    draw.typewriter(ctx, '@larry.nx', x + 136, y + 166, show.progress(show.at('checker-in') + 0.3, 1.0), { size: 17, color: P.gold, t })
    // the score: a needle that hunts, then lands on 61 when he says so
    const cx = x + w / 2, cy = y + 300, r = 92
    const arc = new Path2D()
    arc.arc(cx, cy, r, Math.PI, 2 * Math.PI)
    draw.beam(ctx, arc, P.blueMid, 2)
    for (let i = 0; i <= 10; i++) {
      const an = Math.PI + (i / 10) * Math.PI
      draw.seg(ctx, cx + Math.cos(an) * (r - 8), cy + Math.sin(an) * (r - 8), cx + Math.cos(an) * r, cy + Math.sin(an) * r, P.blueMid, 1.4)
    }
    const landed = show.since('mine') > 0.3
    const hunt = 50 + 35 * Math.sin(t * 2.3) + 10 * Math.sin(t * 5.1)
    const val = landed ? show.tween(t, show.at('mine') + 0.3, show.at('mine') + 0.9, hunt, 61, 'outBack') : hunt
    const an = Math.PI + (val / 100) * Math.PI
    draw.seg(ctx, cx, cy, cx + Math.cos(an) * (r - 14), cy + Math.sin(an) * (r - 14), landed ? P.gold : P.amber, 3, { hot: true })
    draw.dot(ctx, cx, cy, 5, P.gold)
    draw.label(ctx, landed ? '61 / 100' : '?? / 100', cx, cy + 40, { size: 28, color: landed ? P.gold : P.blueMid, align: 'center', weight: 'm', ls: 0.1 })
    // the footer, verbatim from the page
    const f = show.progress('footer-in', 0.5)
    if (f > 0) {
      const fy = y + h - 104
      draw.box(ctx, x + 18, fy - 8, w - 36, 92, { color: P.amber, radius: 6, alpha: f, hot: show.since('footer-in') < 0.8 })
      draw.paragraph(ctx, 'Your score is a function of who started the crawl, not who you are. The map is not the territory. The simcluster is liquid. So are you.', x + 34, fy + 18, w - 70, { size: 17, color: P.white, alpha: f, ls: 0.03, lineHeight: 23 })
      draw.label(ctx, 'FOOTER OF “ARE YOU IN THE SIMCLUSTER?” BY @SHIMMERMATHLABS.COM', x + w / 2, y + h + 24, { size: 12, color: P.blueMid, align: 'center', ls: 0.12, alpha: f })
    }
    // everyone posted their score anyway: little score posts pile up
    const p = show.since('anyway')
    if (p > 0 && show.since('mine') < 0) {
      const chips = [['MY SCORE: 88', -1], ['74 LOL', 1], ['GOT A 93 (DO NOT TRUST)', -1], ['12. HOW', 1]]
      chips.forEach(([txt, sgn], i) => {
        const age = p - i * 0.22
        if (age < 0) return
        const bx = x + 40 + (i % 2) * 300 + (sgn > 0 ? 30 : 0), by = y + 210 + i * 34 - Math.min(age, 0.3) * 40
        const tw = draw.labelWidth(ctx, txt, { size: 15, weight: 'm', ls: 0.06 }) + 34
        draw.box(ctx, bx, by, tw, 30, { color: P.bsky, radius: 10, hot: age < 0.25 })
        draw.butterfly(ctx, bx + 14, by + 15, 12, P.bsky)
        draw.label(ctx, txt, bx + 26, by + 21, { size: 15, color: P.white, weight: 'm', ls: 0.06 })
      })
    }
  },

  discords(ctx, t, show) {
    const { draw, P } = show
    // the extra three pop on the word "four" (falls back to the cue)
    const fw = show.line('four').words?.find((w) => /^four/i.test(w[2]))
    const fourAt = fw ? fw[0] : show.at('four-in')
    const n = t >= fourAt ? 4 : 1
    frame(show, ctx, A.x + 10, A.y + 20, 610, 470, 'OFFICIAL SIMCLUSTER DISCORDS', show.progress('discord', 0.4))
    for (let i = 0; i < n; i++) {
      const born = i === 0 ? show.at('discord') + 0.2 : fourAt + (i - 1) * 0.15
      const age = t - born
      if (age < 0) continue
      const k = show.ease.outBack(show.clamp(age / 0.35))
      const cx = A.x + 100 + i * 143, cy = A.y + 150
      ctx.save()
      ctx.translate(cx, cy)
      ctx.scale(k, k)
      const path = draw.roundPath(-55, -55, 110, 110, 30)
      draw.occlude(ctx, path)
      draw.beam(ctx, path, P.violet, 2, { hot: age < 0.3 })
      // a little game-controller face
      draw.ring(ctx, -18, -6, 8, P.violet, 2)
      draw.ring(ctx, 18, -6, 8, P.violet, 2)
      draw.seg(ctx, -22, 22, 22, 22, P.violet, 2)
      ctx.restore()
      draw.label(ctx, `#${i + 1}`, cx, cy + 86, { size: 18, color: P.violet, align: 'center', weight: 'm', ls: 0.1, alpha: show.clamp(age / 0.3) })
    }
    // the first one: voted down
    if (show.since('ambig') > 0.6 && t < fourAt) draw.stamp(ctx, A.x + 100, A.y + 150, 'NO', { age: show.since('ambig') - 0.9, size: 34, rot: -0.2 })
    if (show.since('ambig') > 0 && t < fourAt) {
      draw.label(ctx, 'MEMBERSHIP: FUZZY ✓', A.x + 330, A.y + 140, { size: 18, color: P.lime, ls: 0.1, alpha: show.progress('ambig', 0.4) })
      draw.label(ctx, 'DISCORD: NOT FUZZY ✗', A.x + 330, A.y + 176, { size: 18, color: P.red, ls: 0.1, alpha: show.progress(show.at('ambig') + 0.8, 0.4) })
    }
    // and the verbatim reply that said it first
    const s = show.since('four-in') - 0.45
    if (s > 0) {
      draw.skeetCard(ctx, {
        x: A.x + 40, y: A.y + 270, w: 560, appear: s / 0.4, reveal: (s - 0.1) / 0.8,
        name: 'scythiamarrow', handle: 'scythiamarrow.bsky.social', time: 'Oct 19', initials: 'S', color: P.violet,
        text: 'I’m in like three simcluster discords… But I’d be down to join a fourth.', likes: 16,
      })
    }
  },

  dial(ctx, t, show) {
    const { draw, P } = show
    const a = show.progress(show.at('jevbot') + 1.3, 0.35)
    frame(show, ctx, A.x + 70, A.y + 40, 500, 440, 'JEVBOT · SETTINGS', a)
    const cx = A.x + 320, cy = A.y + 250, r = 110
    draw.ring(ctx, cx, cy, r, P.sky, 2.2, { alpha: a })
    draw.ring(ctx, cx, cy, r - 16, P.blueDim, 1.2, { alpha: a })
    // one notch, one position
    const an = -Math.PI / 2 + 0.04 * Math.sin(t * 30) * show.clamp(show.since('jevbot') - 1.8) // it jiggles; it doesn't turn
    draw.seg(ctx, cx, cy, cx + Math.cos(an) * (r - 24), cy + Math.sin(an) * (r - 24), P.gold, 4, { hot: true, alpha: a })
    draw.dot(ctx, cx, cy, 7, P.gold, a)
    draw.label(ctx, 'YEAH ABSOLUTELY', cx, cy - r - 18, { size: 20, color: P.gold, align: 'center', weight: 'm', ls: 0.1, alpha: a })
    draw.label(ctx, 'OTHER SETTINGS: NONE', cx, cy + r + 40, { size: 15, color: P.blueMid, align: 'center', ls: 0.15, alpha: a * show.progress(show.at('jevbot') + 2.1, 0.3) })
  },

  refusal(ctx, t, show) {
    const { draw, P } = show
    // a request terminal…
    const a = show.progress(show.at('back-mono') + 0.3, 0.4)
    const x = A.x + 20, y = A.y + 20, w = 600
    if (show.since('refusal-in') < 0.2) {
      frame(show, ctx, x, y, w, 300, 'WEBSITES ON REQUEST', a)
      draw.typewriter(ctx, '> build me a fan page', x + 30, y + 90, show.progress(show.at('builder') + 0.6, 1.0), { size: 20, color: P.green, t })
      if (show.since('builder') > 1.8) draw.label(ctx, 'built it!', x + 50, y + 126, { size: 20, color: P.lime, weight: 'm' })
      draw.typewriter(ctx, '> now rig the voting', x + 30, y + 190, show.progress(show.at('rig') + 0.4, 1.0), { size: 20, color: P.amber, t })
      return
    }
    // …and its real answer: ONLY the cropped verbatim fragment
    const s = show.since('refusal-in')
    frame(show, ctx, A.x + 5, A.y + 20, 630, 470, 'WEBSITES ON REQUEST · THE ANSWER', show.clamp(s / 0.3))
    const ch = draw.skeetCard(ctx, {
      x: A.x + 20, y: A.y + 90, w: 600, appear: s / 0.4, reveal: (s - 0.2) / 1.0,
      name: 'buildthis', handle: 'buildthis.bisks.net', time: 'Jul 31', initials: 'B', color: P.green,
      text: '… that’s fraud against simcluster-guests, not a build.', textSize: 26,
    })
    draw.label(ctx, 'EXCERPT · THE WEBSITE BOT, ASKED TO RIG A VOTE', A.x + 610, A.y + 90 + ch + 24, { size: 12, color: P.blueMid, align: 'right', ls: 0.18, alpha: show.clamp(s / 0.4) })
    if (show.since('ethical') > 1.2) draw.stamp(ctx, A.x + 320, A.y + 410, 'MOST ETHICAL MEMBER', { age: show.since('ethical') - 1.5, size: 28, color: P.gold, rot: -0.06 })
  },
}

// ------------------------------------------------------------------ local helpers

/** 1 while the current shot is mono-side (camera slid right of Larry's mark), 0 off it */
function sideness(show) {
  const cam = show.layout?.cam
  if (!cam || cam.zoom > 2.4) return 0
  return show.clamp((cam.x - 1000) / 130)
}

/** a titled graphics frame with a black fill */
function frame(show, ctx, x, y, w, h, title, appear = 1) {
  const { draw, P } = show
  if (appear <= 0) return
  draw.box(ctx, x, y, w, h, { color: P.blueMid, cut: 12, alpha: appear })
  draw.label(ctx, title, x + 24, y + 34, { size: 16, color: P.sky, ls: 0.22, alpha: appear })
  draw.seg(ctx, x + 24, y + 46, x + w - 24, y + 46, P.blueDim, 1, { alpha: appear })
}

/** a browser window with an address bar */
function browser(show, ctx, x, y, w, h, url, appear = 1) {
  const { draw, P } = show
  if (appear <= 0) return
  const k = show.ease.outCubic(appear)
  const hh = h * k
  draw.box(ctx, x, y, w, hh, { color: P.sky, radius: 10, alpha: appear })
  if (k < 0.6) return
  for (let i = 0; i < 3; i++) draw.ring(ctx, x + 22 + i * 18, y + 22, 5, [P.red, P.amber, P.lime][i], 1.4)
  draw.box(ctx, x + 90, y + 10, w - 110, 26, { color: P.blueDim, radius: 12 })
  draw.label(ctx, url, x + 106, y + 28, { size: 13, color: P.blueMid, ls: 0.06 })
  draw.seg(ctx, x, y + 46, x + w, y + 46, P.blueDim, 1)
}
