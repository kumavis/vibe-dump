// Segment 4: TOP CHICKEN TONIGHT — Eppy Glottis at the sports desk.
// Larry throws to sports; a swoosh logo; then the sports shot's graphics panel runs the show:
// TONIGHT'S CROWN → STANDINGS (+ the fantasy-league bump) → RULES DESK: THE GRACE LIMIT →
// THE LINE (with a telestrator, and the chicken popping in for the sign-off) → back to Larry.
// Frames: node tools/shoot.mjs top-chicken 1 9 12 16 23 28 37 43.5 47 55 60 63 67

const TICKER = [
  'Cat post odds: EVEN',
  "Catoid odds: 3-1",
  'Telestrator review confirms: number went up',
  'No hypotheticals allowed on the field',
  'Chicken declines to comment',
  'All figures play money except the vibes, which are immeasurable',
].join('   ◆   ')

const ROWS = [
  ['@posted.a.cat', 12, 3, '4,410'],
  ['@made.a.website', 9, 6, '3,987'],
  ['@read.piranesi', 7, 7, '2,112'],
  ['@a.bot.honestly', 5, 9, '1,808'],
]

// a little vector stick figure standing on footY, `h` tall; `walk` is a stride phase
function figure(show, ctx, x, footY, h, color, walk = 0, o = {}) {
  const { draw } = show
  const s = h / 100
  const sw = Math.sin(walk * Math.PI * 2) * 14 * s
  const hip = footY - 42 * s, neck = footY - 80 * s
  const lean = (o.lean ?? 0) * s
  const head = new Path2D()
  head.arc(x + lean, neck - 11 * s, 10 * s, 0, Math.PI * 2)
  draw.occlude(ctx, head)
  draw.beam(ctx, head, color, 1.8, { hot: o.hot })
  draw.beamPts(ctx, [[x + lean, neck - 1 * s], [x, hip]], color, 1.8)
  draw.beamPts(ctx, [[x - sw, footY], [x, hip], [x + sw, footY]], color, 1.8)
  draw.beamPts(ctx, [[x - 16 * s - sw * 0.6, hip - 6 * s], [x + lean * 0.6, neck + 8 * s], [x + 16 * s + sw * 0.6, hip - 6 * s]], color, 1.6)
}

export default {
  bumper: { sub: 'Highlights · standings · the Grace Limit' },
  built: { from: 3, bumps: ['b-built'] },
  cast: ['eppy'],
  defaultShot: 'desk',

  shots: [
    { at: 0, shot: 'desk' },
    { at: 'l-throw', after: 0.6, shot: 'desk', zoom: 2.0, push: 1.6 },
    { at: 'e-welcome', shot: 'sports', ticker: TICKER, zoom: 1.55 },
    { at: 'b-built', after: -0.05, shot: 'closeup', who: 'bot', size: 470 },
    { at: 'e-hypo', shot: 'sports', ticker: TICKER, zoom: 1.55 },
    { at: 'desk', shot: 'desk' },
  ],

  direct(t, show) {
    const larry = show.puppet('larry'), eppy = show.puppet('eppy')
    // Eppy faces us, glancing at the board whenever a new graphic lands
    if (show.since('e-welcome') >= 0 && show.since('desk') < 0) {
      // lift Eppy and his desk (with a wider lens) so the SPORTS desk front clears the caption band
      eppy.place({ y: show.MARKS.presenter.y - 35 })
      const glance = ['crown', 'standings', 'rules', 'walk', 'bonk', 'line']
        .some((c) => show.since(c) > 0.1 && show.since(c) < 1.1)
      eppy.lookAt(glance ? 'right' : 'camera')
      if (show.line('e-hypo').active) eppy.lookAt('right').shake(2)
      if (show.line('e-back').active) eppy.nod(0.1)
    }
    if (show.since('desk') >= 0) larry.lookAt('camera')
    if (show.line('l-four').active) larry.nod(-0.1)
    if (show.line('b-built').active || show.between('b-built', 'e-hypo')) show.puppet('bot').lookAt('camera')

    show.chyron('eppy', { from: show.at('e-welcome') + 0.4, dur: 4.2 })

    // during the logo, captions have nothing to say; hide the lane-less chrome
    if (show.between('logo', 'e-welcome')) show.caption(null)
  },

  drawBack(ctx, t, show) {
    const { draw, P } = show
    const pn = show.panel
    if (!pn || show.since('desk') >= 0) return
    const X = pn.x, Y = pn.y, W = pn.w, H = pn.h
    const head = (txt, sub, c = P.coral) => {
      draw.label(ctx, txt, X + 30, Y + 44, { size: 20, color: c, weight: 'm', ls: 0.2 })
      if (sub) draw.label(ctx, sub, X + 30, Y + 68, { size: 12, color: P.blueMid, ls: 0.3 })
    }

    // ---------------------------------------------------------------- logo (in the panel)
    if (show.since('crown') < 0) {
      this.logo(ctx, t, show, X + W / 2, Y + H / 2 + 10, 0.8)
      return
    }

    // ---------------------------------------------------------------- TONIGHT'S CROWN
    if (show.since('standings') < 0) {
      head("TONIGHT'S CROWN", 'MOST LIKED POST OF THE DAY')
      const floor = Y + H - 30
      const tops = draw.podium3(ctx, X + W / 2 + 60, floor, 330, { labels: ['1', '2', '3'], rise: show.progress('crown', 0.9) })
      // a blank post card rises onto the top step (no real post: the winner is a secret)
      const [cx, cy] = tops[0]
      const u = show.progress(show.at('crown') + 0.6, 0.8)
      if (u > 0) {
        const cw = 150, ch = 92
        const y = cy - ch - 6 + (1 - show.ease.outCubic(u)) * 60
        draw.box(ctx, cx - cw / 2, y, cw, ch, { color: P.bsky, radius: 8, alpha: u })
        draw.avatar(ctx, cx - cw / 2 + 22, y + 22, 11, { color: P.bsky, initials: '?' })
        for (let i = 0; i < 3; i++) draw.seg(ctx, cx - cw / 2 + 16, y + 48 + i * 13, cx + cw / 2 - 16 - i * 22, y + 48 + i * 13, P.blueMid, 1.4, { alpha: u })
        draw.seg(ctx, cx - cw / 2 + 42, y + 18, cx + 20, y + 18, P.white, 1.4, { alpha: u * 0.7 })
        // the crown drops on it
        const dropT = show.at('crown-drop')
        const d = show.clamp((t - dropT + 0.35) / 0.35)
        if (d > 0) {
          const k = show.ease.outBack(d)
          draw.crown(ctx, cx, y - 14 - (1 - k) * 160, 1.1)
        }
        // heart confetti
        const age = t - dropT
        if (age > 0 && age < 1.6) {
          const r = show.rng(7)
          for (let i = 0; i < 16; i++) {
            const a = r.range(-Math.PI, 0), v = r.range(80, 220)
            const hx = cx + Math.cos(a) * v * age, hy = y + Math.sin(a) * v * age + 200 * age * age
            draw.label(ctx, '♥', hx, hy, { size: 14, color: r.pick([P.pink, P.magenta, P.coral]), align: 'center', alpha: 1 - age / 1.6, moving: true })
          }
        }
      }
      // the champion's mascot watches from the side
      draw.chicken(ctx, X + W - 70, floor - 40, { scale: 0.75, bob: t * 1.5, crown: show.since('crown-drop') > 0.3, facing: -1 })  // right side: the sports desk covers the panel's left edge
      return
    }

    // ---------------------------------------------------------------- STANDINGS
    if (show.since('rules') < 0) {
      head('STANDINGS', 'ALL-TIME LEADERBOARD · FICTIONAL TEAMS')
      const cols = [X + 30, X + 290, X + 340, X + 400, X + 510]
      const hy = Y + 112
      ;['TEAM', 'W', 'L', 'LIKES', 'VIBES'].forEach((h, i) => draw.label(ctx, h, cols[i], hy, { size: 13, color: P.amber, weight: 'm', ls: 0.2 }))
      draw.seg(ctx, X + 24, hy + 10, X + W - 24, hy + 10, P.amber, 1.2, { alpha: 0.7 })
      const L = show.line('e-vibes')
      const imm = L.words.find((w) => w[2].toLowerCase().startsWith('imm'))?.[0] ?? L.t0
      ROWS.forEach((row, i) => {
        const ry = hy + 46 + i * 44
        const a = show.progress(show.at('standings') + 0.2 + i * 0.25, 0.3)
        if (a <= 0) return
        draw.label(ctx, row[0], cols[0], ry, { size: 15, color: P.white, alpha: a, ls: 0.05 })
        draw.label(ctx, String(row[1]), cols[1], ry, { size: 15, color: P.sky, alpha: a })
        draw.label(ctx, String(row[2]), cols[2], ry, { size: 15, color: P.sky, alpha: a })
        draw.label(ctx, row[3], cols[3], ry, { size: 15, color: P.sky, alpha: a })
        if (t >= imm - 0.2) draw.splitFlap(ctx, cols[4], ry + 6, 'IMMEASURABLE', { age: t - imm + 0.15 - i * 0.08, size: 13, color: P.magenta })
        else draw.label(ctx, '--', cols[4], ry, { size: 15, color: P.blueMid, alpha: a })
        draw.seg(ctx, X + 24, ry + 14, X + W - 24, ry + 14, P.blueDim, 1, { alpha: 0.5 * a })
      })
      // the bump: a fantasy league, built
      const age = t - show.at('b-built')
      if (age > -0.15) {
        draw.stamp(ctx, X + W / 2, Y + H - 62, 'FANTASY LEAGUE: LIVE', { age, rot: -0.06, size: 28, color: P.lime })
      }
      return
    }

    // ---------------------------------------------------------------- RULES DESK: THE GRACE LIMIT
    if (show.since('line') < 0) {
      head('RULES DESK', null, P.coral)
      draw.glowText(ctx, 'THE GRACE LIMIT', X + 210, Y + 44, { size: 20, color: P.gold, weight: 'm', ls: 0.2 })
      const floor = Y + H - 34
      const bx = X + W / 2 + 40, bw = 250, bh = 118
      draw.seg(ctx, X + 24, floor, X + W - 24, floor, P.blueDim, 1.2)
      const bonk = show.since('bonk')
      const wob = bonk > 0 ? Math.exp(-bonk * 2.2) * Math.sin(bonk * 26) : 0
      draw.limboBar(ctx, bx, floor, { w: bw, height: bh, wobble: wob })
      // the sign on the bar
      draw.box(ctx, bx - 78, floor - bh - 58, 156, 30, { color: P.lime, radius: 4 })
      draw.label(ctx, '~7K FOLLOWERS', bx, floor - bh - 37, { size: 14, color: P.lime, align: 'center', weight: 'm', ls: 0.1 })

      // little contenders stroll under, one cheer each
      const w0 = show.at('walk')
      for (const [k, c] of [[0, P.sky], [1, P.cyan], [2, P.pink]]) {
        const u = (t - w0 - k * 0.55) / 1.8
        if (u < 0 || u > 1.05) continue
        const x = show.lerp(X + 40, X + W - 30, u)
        const under = Math.abs(x - bx) < bw / 2 + 10
        figure(show, ctx, x, floor, 64, c, u * 5, { lean: under ? 6 : 0 })
      }

      // the founder: tall, walks up, bonks the bar, stops
      const f0 = show.at('e-founder'), fb = show.at('bonk')
      if (t >= f0) {
        const stopX = bx - bw / 2 - 26
        const u = show.clamp((t - f0) / (fb - f0))
        const x = show.lerp(X + 40, stopX, show.ease.inOutSine(u)) - (bonk > 0 ? 10 * Math.exp(-bonk * 4) * Math.sin(bonk * 20) * 0 + Math.min(bonk, 0.15) * 40 : 0)
        figure(show, ctx, x, floor, 200, P.gold, u < 1 ? u * 4 : 0, { hot: true, lean: bonk > 0 ? -8 : 0 })
        draw.label(ctx, 'FOUNDER', x, floor - 234, { size: 15, color: P.gold, align: 'center', weight: 'm', ls: 0.2 })
        draw.label(ctx, '"gm top chickens" · 2024', x, floor - 216, { size: 12, color: P.goldMid ?? P.gold, align: 'center', ls: 0.05 })
        if (bonk > 0 && bonk < 1.2) {
          const a = 1 - bonk / 1.2
          draw.glowText(ctx, 'BONK!', bx - bw / 2 + 70, floor - bh + 44 + bonk * 10, { size: 26, color: P.red, weight: 'm', align: 'center', alpha: a })
          for (let i = 0; i < 5; i++) {
            const ang = bonk * 5 + (i * Math.PI * 2) / 5
            draw.label(ctx, '*', x + Math.cos(ang) * 26, floor - 196 + Math.sin(ang) * 8, { size: 14, color: P.gold, align: 'center', alpha: a, moving: true })
          }
        }
      }

      // the rule, stated plainly (real rule)
      // the rule lands as Eppy states it; the punchline line when "she founded the chicken"
      const r = show.progress(show.at('e-rule') + 0.2, 0.4)
      const r2 = show.progress(show.at('e-founded') - 0.1, 0.4)
      if (r > 0) {
        const ry = Y + 72
        draw.box(ctx, X + 24, ry, W - 48, 54, { color: P.gold, cut: 6, alpha: r })
        draw.label(ctx, 'CONTENDERS MUST HAVE FEWER FOLLOWERS THAN @gracekind.net', X + W / 2, ry + 23, { size: 14, color: P.white, align: 'center', alpha: r, ls: 0.06 })
        draw.label(ctx, 'THE FOUNDER IS INELIGIBLE FOR THE LEAGUE SHE FOUNDED.', X + W / 2, ry + 44, { size: 12, color: P.gold, align: 'center', alpha: r2, ls: 0.06 })
      }
      return
    }

    // ---------------------------------------------------------------- THE LINE (through the sign-off)
    head('THE LINE', 'TOP CHICKEN PREDICTION MARKET · PLAY MONEY')
    const age = show.since('line')
    const lx = X + 34, rx = X + 440
    draw.label(ctx, 'BOT TRADER', lx, Y + 128, { size: 16, color: P.white, weight: 'm', ls: 0.2 })
    draw.splitFlap(ctx, lx, Y + 196, '+$19,865.83', { age: age - 0.3, size: 34, color: P.lime })
    draw.label(ctx, 'REAL · PLAY MONEY', lx, Y + 252, { size: 11, color: P.blueMid, ls: 0.25 })
    const ha = show.since('e-humans')
    if (ha > -0.2) {
      draw.label(ctx, 'HUMANS', rx, Y + 128, { size: 16, color: P.white, weight: 'm', ls: 0.2 })
      draw.splitFlap(ctx, rx, Y + 196, '-$4.00', { age: ha, size: 34, color: P.red })
      draw.label(ctx, 'FAKE · ALSO PLAY MONEY', rx, Y + 252, { size: 11, color: P.blueMid, ls: 0.25 })
    }
    // telestrator: circle the big number, arrow, NUMBER GO UP
    const tl = show.since('e-line.end') + 0.2
    if (tl > 0) {
      const cx = lx + 172, cy = Y + 172, rx2 = 200, ry2 = 54
      const u = show.clamp(tl / 0.6)
      const p = new Path2D()
      const a0 = -2.6
      for (let i = 0; i <= 40 * u; i++) {
        const a = a0 + (i / 40) * Math.PI * 2.15
        const wob = 1 + 0.04 * Math.sin(i * 1.7)
        const x = cx + Math.cos(a) * rx2 * wob, y = cy + Math.sin(a) * ry2 * wob
        i ? p.lineTo(x, y) : p.moveTo(x, y)
      }
      draw.beam(ctx, p, P.gold, 3, { hot: true })
      const v = show.clamp((tl - 0.6) / 0.4)
      if (v > 0) {
        // label sits above the SPORTS desk front (which covers the board's lower-left), arrow rises from its right end
        draw.arrow(ctx, X + 300, Y + 312, show.lerp(X + 300, X + 270, v), show.lerp(Y + 312, Y + 236, v), P.gold, 3)
        draw.label(ctx, 'NUMBER GO UP', X + 40, Y + 322, { size: 24, color: P.gold, weight: 'm', ls: 0.12, alpha: show.clamp((tl - 0.9) / 0.3) })
      }
    }
    // humans: a tiny sad face once "still sad" lands
    const sad = show.since('e-fake') - 1.2
    if (sad > 0) {
      draw.label(ctx, ':(', rx + 70, Y + 330, { size: 40, color: P.red, weight: 'm', alpha: show.clamp(sad / 0.3), align: 'center' })
    }

    // sign-off: the board goes FINAL on "sports!", then the chicken pops in for the cluck
    const B = show.line('e-back')
    const fin = t - (B.words.find((w) => w[2].toLowerCase().startsWith('sports'))?.[0] ?? B.t0)
    if (fin > -0.1) draw.stamp(ctx, X + W / 2 + 50, Y + H - 78, 'FINAL', { age: fin, rot: -0.08, size: 30, color: P.gold })
    const so = show.since('e-back.end') + 0.1
    if (so > 0) {
      const k = show.ease.outBack(show.clamp(so / 0.35))
      draw.chicken(ctx, X + W - 110, Y + H - 50 - 20 * k, { scale: 0.9 * k, crown: true, bob: t * 3, facing: -1 })
    }
  },

  drawFront(ctx, t, show) {
    const { draw, P } = show
    // Larry's button: his losing slip
    const slip = show.since('l-four') + 0.1
    if (slip > 0 && show.since('desk') > 0) {
      const k = show.ease.outBack(show.clamp(slip / 0.35))
      ctx.save()
      ctx.translate(1080, 190)
      ctx.rotate(0.06)
      ctx.scale(k, k)
      draw.box(ctx, -130, -80, 260, 160, { color: P.amber, cut: 6 })
      draw.label(ctx, 'BET SLIP', 0, -50, { size: 14, color: P.amber, align: 'center', weight: 'm', ls: 0.3 })
      draw.label(ctx, 'LARRY NX', -110, -18, { size: 13, color: P.white, ls: 0.15 })
      draw.label(ctx, 'PICK: THE CHICKEN', -110, 6, { size: 13, color: P.white, ls: 0.15 })
      draw.label(ctx, 'STAKE: $4.00 (PLAY)', -110, 30, { size: 13, color: P.white, ls: 0.15 })
      ctx.restore()
      if (slip > 0.5) draw.stamp(ctx, 1150, 268, 'LOST', { age: slip - 0.65, rot: -0.2, size: 26, color: P.red })
    }
    // full-screen swoosh logo between Larry's throw and Eppy's welcome
    if (show.between('logo', 'e-welcome')) {
      const u = show.since('logo')
      const out = show.clamp((show.at('e-welcome') - t) / 0.2)
      draw.occlude(ctx, draw.rectPath(0, 0, 1280, 720), '#000', 0.94 * out)
      this.logo(ctx, t, show, 640, 360, 1.25 * out, u)
    }
  },

  // the TOP CHICKEN TONIGHT logo: a swoosh, the words, a spinning wireframe chicken
  logo(ctx, t, show, x, y, k = 1, age = 9) {
    const { draw, P } = show
    if (k <= 0) return
    ctx.save()
    ctx.translate(x, y)
    ctx.scale(k, k)
    // swoosh
    const sw = show.clamp(age / 0.45)
    const p = new Path2D()
    for (let i = 0; i <= 40 * sw; i++) {
      const a = i / 40
      const px = -330 + a * 660, py = 100 - Math.sin(a * Math.PI) * 26 - a * 12
      i ? p.lineTo(px, py) : p.moveTo(px, py)
    }
    draw.beam(ctx, p, P.coral, 5, { hot: true })
    // spinning chicken (a turntable: squash x by cos)
    ctx.save()
    ctx.translate(-230, 38)
    const spin = Math.cos(t * 3.2)
    ctx.scale(Math.max(0.08, Math.abs(spin)), 1)
    draw.chicken(ctx, 0, 0, { scale: 1.2, crown: true, bob: t * 2, facing: spin >= 0 ? 1 : -1 })
    ctx.restore()
    const ta = show.clamp((age - 0.2) / 0.3)
    draw.glowText(ctx, 'TOP CHICKEN', -120, -6, { size: 54, color: P.gold, weight: 'm', ls: 0.06, alpha: ta })
    draw.glowText(ctx, 'TONIGHT', -40, 48, { size: 34, color: P.coral, weight: 'm', ls: 0.4, alpha: show.clamp((age - 0.45) / 0.3) })
    ctx.restore()
  },
}
