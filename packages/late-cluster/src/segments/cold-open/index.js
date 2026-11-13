// Cold open: "Built it." — a post asks for a talk show, a bot builds it, the lights snap on and
// Larry finds himself hosting it (his tuxedo drawing itself on as he talks); then the titles: the
// logo over the skyline window, the Formants' theme, and Sibyl Ant's announce lighting one skyline
// node per guest as she names them, ending on "Larry… Nx!" and the walk to the monologue mark.
//
// Preview: /?seg=cold-open   ·   frames: node tools/shoot.mjs cold-open 1.5 5 6.9 …
import { logo } from '../../stage/chrome.js'
import { buildSet } from '../../stage/set.js'

// the BUILT counter: this segment takes it 0 → 1 on the bot's "Built it."
const BUILT = { from: 0, bumps: ['built.end'] }

// the tuxedo's pieces, in centimetres about the neck base (the same shapes as the house `tux`, so
// the hand-off to the real costume is seamless)
const f = (n) => (Math.round(n * 10) / 10).toString()
const circ = (cx, cy, r) => `M${f(cx + r)} ${f(cy)} A${f(r)} ${f(r)} 0 1 0 ${f(cx - r)} ${f(cy)} A${f(r)} ${f(r)} 0 1 0 ${f(cx + r)} ${f(cy)}`
function torso(S, N, H, slope = 6) {
  const sl = slope + 2.5
  const p = (x, y) => `${f(x)} ${f(y)}`
  return [
    `M${p(-N, -1)}`,
    `C${p(-N - 3.5, 0.6)} ${p(-S + 6, sl - 4.2)} ${p(-S + 1.5, sl - 1.2)}`,
    `C${p(-S - 1.6, sl + 0.2)} ${p(-S - 2.6, sl + 4)} ${p(-S - 2.5, sl + 9)}`,
    H > 40
      ? `C${p(-S - 2.5, 24)} ${p(-S - 0.5, 30)} ${p(-S - 0.6, 36)} L${p(-S - 1.4, H)} L${p(S + 1.4, H)} L${p(S + 0.6, 36)} C${p(S + 0.5, 30)} ${p(S + 2.5, 24)} ${p(S + 2.5, sl + 9)}`
      : `L${p(-S - 2, H)} L${p(S + 2, H)} L${p(S + 2.5, sl + 9)}`,
    `C${p(S + 2.6, sl + 4)} ${p(S + 1.6, sl + 0.2)} ${p(S - 1.5, sl - 1.2)}`,
    `C${p(S - 6, sl - 4.2)} ${p(N + 3.5, 0.6)} ${p(N, -1)} Z`,
  ].join(' ')
}

export default {
  title: 'Built It',
  bumper: false, // the logo reveal happens inside the segment
  cast: ['hy', 'al', 'dee', 'pete', 'sibyl'],
  guests: [],
  drift: true,
  defaultShot: 'desk',
  disclaimer: { text: 'Tonight’s guests are puppets playing posting personas. Parody.', from: 'samantha', dur: 8 },

  // the counter only appears once something has been built: direct() hides it until the bump
  built: BUILT,

  shots: [
    { at: 0, shot: 'co-black' },
    { at: 'lights', shot: 'desk', zoom: 2.05 },
    { at: 'joke', shot: 'desk', zoom: 1.85, v: 2, push: 1.2 },
    { at: 'contract', after: 0.6, shot: 'desk', zoom: 2.25, v: 3, push: 1.4 },
    { at: 'givme', shot: 'desk', zoom: 1.85, v: 4 },
    { at: 'already', shot: 'band', zoom: 1.75 },
    { at: 'theme', shot: 'co-window', zoom: 1.62, y: 392 },
    { at: 'hook', shot: 'band', zoom: 1.5 },
    { at: 'hook', after: 4, shot: 'band', zoom: 1.78, v: 2, push: 3.6 },
    { at: 'bed', shot: 'co-window', zoom: 1.62, y: 392, v: 2 },
    { at: 'roll', shot: 'podium', zoom: 1.7 },
    { at: 'throat', after: 2.4, shot: 'podium', zoom: 2.3, v: 2, push: 1.1 },
    { at: 'larry', shot: 'co-window', zoom: 1.62, y: 392, v: 3 },
    { at: 'nx', shot: 'wide', larry: 'mono' },
    { at: 'nx', after: 1.3, shot: 'mono', push: 3.2 },
  ],

  setup(show) {
    const { SHOTS } = show
    this._bumpT = show.at('built.end')
    // a camera on nothing: the cold open's black screen (the overlay does the rest)
    SHOTS['co-black'] = () => ({ cam: { x: 1590, y: 392, zoom: 1.62 }, place: {}, audience: 0, set: { desk: false, chair: false, couch: false } })
    // the skyline window, nobody in front of it
    SHOTS['co-window'] = (s, o = {}) => ({ cam: { x: 1590, y: o.y ?? 392, zoom: o.zoom ?? 1.62 }, place: {}, audience: 0, set: { desk: false, chair: false, couch: false } })

    // the skyline's own towers (the set builds them from a fixed seed): one rooftop per guest
    const S = buildSet()
    const pick = (x, y) => S.nodes.filter((n) => n.on).reduce((b, n) => (Math.hypot(n.x - x, n.y - y) < Math.hypot(b.x - x, b.y - y) ? n : b))
    const P = show.P
    this.nodes = [
      { id: 'samantha', name: 'SAMANTHA', role: 'THE WEATHER', at: pick(1300, 450), color: '#34e0ff', dy: -62 },
      { id: 'norvid', name: 'NORVID', role: 'THE PANEL', at: pick(1480, 500), color: '#9a6bff', dy: -92 },
      { id: 'abel', name: 'ABEL', role: 'THE PANEL', at: pick(1665, 455), color: '#3fd17a', dy: -62 },
      { id: 'band', name: 'HY OID & THE FORMANTS', role: 'MUSIC', at: pick(1845, 500), color: P.magenta, dy: -92 },
    ]
    this.home = { x: 1590, y: 300 } // Larry's node: high over the city
    // when each node lights: on its name
    const word = (id, w) => {
      const L = show.line(id)
      const hit = L.words?.find((x) => x[2].toLowerCase().startsWith(w))
      return hit ? hit[0] : show.at(id)
    }
    this.lit = {
      samantha: word('samantha', 'samantha'),
      norvid: word('panel', 'norvid'),
      abel: word('panel', 'abel'),
      band: word('band', 'hy'),
    }
    this.nxAt = show.at('nx')
  },

  direct(t, show) {
    this.built = t < this._bumpT ? null : BUILT
    const L = show.puppet('larry')
    const lightsOn = show.since('lights') >= 0
    show.onAir = lightsOn
    show.set.dim = this.isWindow(show) ? 0.08 : 0.34

    // Larry: surprised to exist (looks down at himself), then to camera, then to the band
    if (show.between('lights', 'joke')) {
      const u = show.since('lights')
      if (u < 0.9) L.lookAt('camera').nod(0.12)
      else if (u < 2.2) L.lookAt(Math.PI / 2 - 0.35).nod(-0.32)
      else L.lookAt('camera')
    }
    if (show.between('contract', 'givme')) L.lookAt('camera').nod(-0.04)
    if (show.since('givme') > 0.2 && show.since('already') < 0) L.lookAt('left')
    // Hy answers to camera; the band nods along during the hook
    if (show.between('already', 'theme')) show.puppet('hy').lookAt(Math.PI / 2 + 0.25)
    // Sibyl leans into the finish
    if (show.between('throat', 'larry')) show.puppet('sibyl').nod(-0.05 * show.progress('throat', 3.5))

    // the walk to the mark and the bow
    if (show.since('nx') >= 0) {
      L.lookAt('camera')
      const b = show.since('nx')
      const bow = show.window(b, 1.0, 2.4, 0.45)
      L.nod(-0.42 * bow)
    }

    // chyrons
    show.chyron({ name: '6 minutes later', title: 'meanwhile, in the simcluster', color: show.P.amber }, { from: 'later', to: show.at('built') + 0.1 })
    show.chyron({ name: 'Hy Oid & The Formants', title: 'The house band', handle: '@formants.band', color: show.P.magenta }, { from: show.at('hook') + 0.5, dur: 3.5 })
    show.chyron('sibyl', { from: show.at('roll') + 0.3, dur: 3.4 })
    show.chyron({ name: 'Larry Nx', title: 'Your host · six minutes old', color: '#ffc861' }, { from: show.at('nx') + 1.6, to: 'end' }) // off before the last frame (the next scene hard-cuts from it)
  },

  drawBack(ctx, t, show) {
    const { draw, P } = show
    if (!this.isWindow(show)) return
    // the guest nodes, lit one by one over the skyline
    if (show.since('bed') >= 0) {
      show.world(ctx, (w) => {
        const lit = this.nodes.filter((n) => t >= this.lit[n.id])
        // links between the lit rooftops, drawing on
        for (let i = 1; i < lit.length; i++) {
          const a = lit[i - 1].at, b = lit[i].at
          const u = show.clamp((t - this.lit[lit[i].id]) / 0.6)
          const mx = (a.x + b.x) / 2, my = Math.min(a.y, b.y) - 50
          const pts = []
          for (let k = 0; k <= 20 * u; k++) {
            const s = k / 20
            pts.push([(1 - s) * (1 - s) * a.x + 2 * (1 - s) * s * mx + s * s * b.x, (1 - s) * (1 - s) * a.y + 2 * (1 - s) * s * my + s * s * b.y])
          }
          draw.beamPts(w, pts, lit[i].color, 1.6, { alpha: 0.8 })
        }
        // the finale: every node wires to Larry's, high over the city
        if (show.since('larry') >= 0) {
          const u = show.clamp(show.since('larry') / 0.9)
          for (const n of this.nodes) {
            const a = n.at, b = this.home
            draw.seg(w, a.x, a.y, a.x + (b.x - a.x) * u, a.y + (b.y - a.y) * u, P.gold, 1.4, { alpha: 0.75, hot: true })
          }
        }
      })
    }
  },

  drawFront(ctx, t, show) {
    const { draw, P } = show
    const win = this.isWindow(show)

    // ---------------------------------------------------------------- 1. cold: black, a post, a clock
    if (show.since('lights') < 0) {
      draw.occlude(ctx, draw.rectPath(0, 0, 1280, 720), '#000', 1)
      const u = show.since('card')
      const later = show.since('later') >= 0
      const h1 = draw.skeetCard(ctx, {
        x: 250, y: 110, w: 700, scale: 1.3,
        name: 'somebody', handle: 'somebody.should', time: later ? '6m' : 'now', initials: 'S', color: P.bsky,
        text: 'simcluster talk show when?',
        replies: later ? 1 : 0, reposts: 0, likes: later ? 2 : 0,
        appear: u / 0.35, reveal: (u - 0.35) / 1.6, t,
      })
      // the clock: six minutes go by in two and a half seconds
      const cu = show.clamp(show.since('later') / 2.55)
      if (show.since('card') > 0.4) {
        const cx = 1080, cy = 210, r = 60
        const a = show.clamp(show.since('card') / 0.5)
        draw.ring(ctx, cx, cy, r, P.amber, 1.8, { hot: true, alpha: a })
        for (let i = 0; i < 12; i++) {
          const g = (i / 12) * Math.PI * 2
          draw.seg(ctx, cx + Math.sin(g) * r * 0.82, cy - Math.cos(g) * r * 0.82, cx + Math.sin(g) * r * 0.94, cy - Math.cos(g) * r * 0.94, P.amber, 1.2, { alpha: 0.7 * a })
        }
        const sec = (0.02 * show.since('card') + cu * 6) * Math.PI * 2
        const min = (10 / 60 + cu * 6 / 60) * Math.PI * 2
        draw.seg(ctx, cx, cy, cx + Math.sin(min) * r * 0.62, cy - Math.cos(min) * r * 0.62, P.white, 2.6, { hot: true, alpha: a })
        draw.seg(ctx, cx, cy, cx + Math.sin(sec) * r * 0.86, cy - Math.cos(sec) * r * 0.86, P.amber, 1.4, { hot: true, alpha: a })
        draw.dot(ctx, cx, cy, 3, P.white, a)
        draw.label(ctx, later ? `+${Math.min(6, Math.floor(cu * 6 + 0.001))}:00` : '0:00', cx, cy + r + 30, { size: 16, align: 'center', color: P.amber, ls: 0.2, alpha: a })
      }
      // the reply: built it.
      const b = show.since('built')
      if (b > -0.1) {
        const y2 = 110 + h1 + 30
        draw.seg(ctx, 307, 110 + h1 - 4, 307, y2 + 22, P.blueDim, 1.4, { alpha: show.clamp((b + 0.1) / 0.2) })
        const h2 = draw.skeetCard(ctx, {
          x: 250, y: y2, w: 700, scale: 1.3,
          name: 'a website bot', handle: 'made.a.website', time: 'now', initials: 'B', color: '#5effc8',
          text: 'built it.',
          replies: 0, reposts: Math.round(40 * show.clamp((b - 0.6) / 0.6)), likes: Math.round(300 * show.clamp((b - 0.4) / 0.7)),
          appear: (b + 0.1) / 0.3, reveal: b / 0.4, likePulse: (b - 0.5) / 0.4, liked: b > 0.5, t,
        })
        const c = show.since('built.end')
        if (c >= 0) {
          draw.confetti(ctx, 640, y2 + h2 * 0.4, c, { seed: 7, count: 46, spread: 1.6 })
          draw.confetti(ctx, 470, y2 + h2 * 0.5, c - 0.12, { seed: 11, count: 30, spread: 1.2 })
          draw.confetti(ctx, 820, y2 + h2 * 0.5, c - 0.2, { seed: 13, count: 30, spread: 1.2 })
        }
      }
      return
    }

    // ---------------------------------------------------------------- 2. lights: the tux draws itself on
    const flash = 1 - show.clamp(show.since('lights') / 0.35)
    if (flash > 0) {
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      ctx.globalAlpha = 0.4 * flash
      ctx.fillStyle = '#fff3d6'
      ctx.fillRect(0, 0, 1280, 720)
      ctx.restore()
    }
    if (show.since('lights') >= 0 && show.since('givme') < 1.3) this.tuxBuild(ctx, t, show)

    // ---------------------------------------------------------------- 3. titles
    if (win) {
      // the logo over the skyline: sweeps on at the top of the theme, smaller over the guest list
      const intro = show.between('theme', 'bed')
      const finale = show.since('larry') >= 0
      const sweep = show.clamp(show.since('theme') / 1.6)
      if (intro) {
        const a = show.clamp(show.since('theme') / 0.5)
        ctx.save()
        ctx.beginPath()
        ctx.rect(0, 0, 640 - 360 + 720 * show.ease.outCubic(sweep), 720)
        ctx.clip()
        draw.occlude(ctx, draw.rectPath(260, 120, 760, 230, 18), '#000', 0.82 * a)
        logo(ctx, 640, 268, 1.0, { t, align: 'center', alpha: a, sweep })
        ctx.restore()
        if (sweep < 1) {
          const x = 640 - 360 + 720 * show.ease.outCubic(sweep)
          draw.seg(ctx, x, 90, x, 360, P.gold, 2, { hot: true, alpha: 1 - sweep })
        }
      } else {
        const a = finale ? 1 : show.clamp(show.since('bed') / 0.5)
        const s = finale ? 0.62 : 0.5
        draw.occlude(ctx, draw.rectPath(420, 26, 440, 150), '#000', 0.5 * a)
        logo(ctx, 640, finale ? 130 : 118, s, { t, align: 'center', alpha: a, sub: finale })
      }
      // guest labels (screen space, above the captions)
      if (!intro) {
        for (const n of this.nodes) {
          const lt = this.lit[n.id]
          if (t < lt) continue
          const age = t - lt
          const [sx, sy] = show.toScreen(n.at.x, n.at.y)
          const pop = Math.exp(-age * 3)
          draw.ring(ctx, sx, sy, 9 + 22 * (1 - Math.exp(-age * 4)), n.color, 1.6, { alpha: 0.9 * pop })
          draw.ring(ctx, sx, sy, 7, n.color, 1.8, { hot: true })
          draw.dot(ctx, sx, sy, 4 + 3 * pop, n.color, 1)
          const ly = sy + n.dy
          const a = show.clamp(age / 0.3)
          draw.seg(ctx, sx, sy - 9, sx, ly + 8, n.color, 1, { alpha: 0.6 * a })
          const tw = Math.max(draw.labelWidth(ctx, n.name, { size: 16, ls: 0.14, weight: 'm' }), draw.labelWidth(ctx, n.role, { size: 12, ls: 0.22 })) + 22
          const lx = show.clamp(sx, tw / 2 + 12, 1268 - tw / 2)
          draw.box(ctx, lx - tw / 2, ly - 32, tw, 44, { color: n.color, cut: 5, width: 1.2, alpha: 0.85 * a, fillAlpha: 0.85 * a })
          draw.label(ctx, n.name, lx, ly - 12, { size: 16, align: 'center', color: P.white, weight: 'm', ls: 0.14, alpha: a })
          draw.label(ctx, n.role, lx, ly + 5, { size: 12, align: 'center', color: n.color, ls: 0.22, alpha: a })
        }
        if (finale) {
          const [hx, hy] = show.toScreen(this.home.x, this.home.y)
          const age = show.since('larry')
          draw.ring(ctx, hx, hy, 10 + 26 * (1 - Math.exp(-age * 3)), P.gold, 2, { hot: true, alpha: Math.exp(-age * 1.5) })
          draw.dot(ctx, hx, hy, 7, P.gold, 1)
          draw.ring(ctx, hx, hy, 12, P.gold, 2, { hot: true })
        }
      }
    }

    // notes float from the Formants while they sing the hook
    for (const l of show.active) {
      if (l.kind !== 'sing') continue
      const h = show.headOf(l.who)
      if (!h) continue
      const r = show.rng(l.i)
      for (let k = 0; k < 5; k++) {
        const born = l.t0 + k * 0.8 + r() * 0.3
        const age = (t - born) % 3.5
        if (t < born || age > 2) continue
        draw.label(ctx, k % 2 ? '♪' : '♫', h.mouth[0] + 24 + age * 34 + Math.sin(age * 3 + k) * 6, h.mouth[1] - age * 55, { size: 18 + h.size * 0.04, color: show.puppet(l.who).color, alpha: 1 - age / 2, moving: true })
      }
    }
    // HEY!
    const hey = show.lines.find((l) => l.who === 'hy' && l.kind === 'shout' && t >= l.t0 && t < l.t0 + 0.5)
    if (hey) {
      const u = (t - hey.t0) / 0.5
      draw.glowText(ctx, 'HEY!', 640, 130, { size: 70 + 30 * u, align: 'center', color: P.magenta, weight: 'm', alpha: 1 - u, ls: 0.1 })
    }

    // the reveal: a follow-spot on the mark
    if (show.since('nx') >= 0) {
      const a = show.clamp(show.since('nx') / 0.3)
      show.world(ctx, (w) => {
        const p = new Path2D()
        p.moveTo(940, 70)
        p.lineTo(1000, 70)
        p.lineTo(1090, 958)
        p.lineTo(850, 958)
        p.closePath()
        w.save()
        w.globalCompositeOperation = 'lighter'
        w.globalAlpha = 0.045 * a
        w.fillStyle = '#ffe6a8'
        w.fill(p)
        w.restore()
        const e = new Path2D()
        e.ellipse(970, 958, 125, 16, 0, 0, Math.PI * 2)
        draw.beam(w, e, P.gold, 1.6, { alpha: 0.6 * a, hot: true })
      })
    }
  },

  /** is the skyline-window shot up? (from t alone, so it's right on a frozen frame) */
  isWindow(show) {
    return show.between('theme', 'hook') || show.between('bed', 'roll') || show.between('larry', 'nx')
  },

  /** the tuxedo drawing itself on over Larry, piece by piece: bow tie first, lapels last */
  tuxBuild(ctx, t, show) {
    const { draw, P } = show
    const p = show.puppets.get('larry')
    if (!p?.screen || !p.visible || !p.head) return
    const { x, y, size } = p.screen
    const nk = p.head.neck()
    const u = nk.cm * (p.look.bodyScale ?? 0.66)
    const nx = x - size / 2 + nk.x, ny = y - size / 2 + nk.y
    const turn = Math.cos(p.az) * 0.75
    const sway = p.tilt * 0.6
    const c = p.look.costume
    const deskY = show.toScreen(0, 728)[1]
    const bottom = (Math.min(760, 1125) - 0) // seat, world
    const H = (show.toScreen(0, bottom)[1] - ny) / u
    const cx = turn * 4.5, v = 30
    const pt = (s) => new Path2D(s)

    // when each piece lands (seconds since its cue)
    const k = {
      tie: show.since('lights') - 0.5,
      shirt: show.since('joke') - 0.1,
      studs: show.since('joke') - 1.4,
      jacket: show.since('contract') - 0.2,
      lapels: show.since('givme') + 0.1,
      square: show.since('givme') - 0.75,
    }
    const pop = (a) => (a >= 0 ? 1 + 0.6 * Math.exp(-a * 7) * Math.sin(Math.min(1, a / 0.25) * Math.PI) : 0)

    ctx.save()
    ctx.beginPath()
    ctx.rect(0, 0, 1280, deskY)
    ctx.clip()
    ctx.translate(nx + Math.sin(sway) * 2.5 * u, ny)
    ctx.rotate(sway * 0.3)
    const sq = 1 - 0.18 * Math.abs(turn)
    ctx.scale(u * sq, u * (1 + 0.006 * p.breathe))
    const px = (n) => (0.85 * n) / u // stage px → cm line width

    // erase the finished costume, leave a dim construction outline
    const body = pt(torso(18, 6.2, H))
    ctx.save()
    ctx.fillStyle = '#000'
    ctx.strokeStyle = '#000'
    ctx.lineWidth = px(6)
    ctx.fill(body)
    ctx.stroke(body)
    ctx.restore()
    // the shirt front's black (so the head's neck ends cleanly)
    // construction lines: a dashed mannequin with a little grid
    const ghost = 1 - show.clamp(k.jacket / 1.4)
    draw.beam(ctx, body, P.blueMid, px(1.1), { alpha: 0.55 * ghost + 0.1, dash: [px(4), px(5)] })
    if (ghost > 0) {
      const g = new Path2D()
      for (let yy = 6; yy < H; yy += 7) {
        g.moveTo(-17, yy)
        g.lineTo(17, yy)
      }
      g.moveTo(0, 0)
      g.lineTo(0, H)
      ctx.save()
      ctx.clip(body)
      draw.beam(ctx, g, P.blueDim, px(0.8), { alpha: 0.35 * ghost })
      ctx.restore()
    }

    // the jacket: a scan line paints it on from the shoulders down
    if (k.jacket >= 0) {
      const ju = show.clamp(k.jacket / 1.3)
      const yCut = -2 + (H + 4) * show.ease.inOutCubic(ju)
      ctx.save()
      ctx.beginPath()
      ctx.rect(-40, -10, 80, yCut + 10)
      ctx.clip()
      draw.beam(ctx, body, c.color, px(1.8 * 0.92))
      draw.beam(ctx, pt(`M-14.5 9 C-15.4 20 -15 ${f(H - 10)} -14.2 ${f(H)} M14.5 9 C15.4 20 15 ${f(H - 10)} 14.2 ${f(H)}`), c.color, px(0.92), { alpha: 0.55 })
      ctx.restore()
      if (ju < 1) draw.seg(ctx, -24, yCut, 24, yCut, P.white, px(2), { hot: true, alpha: 0.9 })
    }
    // shirt front + collar
    if (k.shirt >= 0) {
      const a = show.clamp(k.shirt / 0.3)
      const shirt = pt(`M${f(-6.4)} -1.5 L${f(cx)} ${f(v + 2)} L${f(6.4)} -1.5 Z`)
      draw.occlude(ctx, shirt)
      draw.beam(ctx, shirt, c.shirt, px(1.2 * 0.92), { alpha: 0.8 * a, hot: k.shirt < 0.3 })
      draw.beam(ctx, pt(`M${f(cx - 2.2)} 6 L${f(cx - 1.3)} ${f(v - 3)} M${f(cx + 2.2)} 6 L${f(cx + 1.3)} ${f(v - 3)}`), c.shirt, px(0.8 * 0.92), { alpha: 0.35 * a })
      const cc = cx * 0.4
      const collar = pt(`M-5.4 -2 L${f(cc - 2.2)} 3 L-6.6 2.6 Z M5.4 -2 L${f(cc + 2.2)} 3 L6.6 2.6 Z`)
      draw.occlude(ctx, collar)
      draw.beam(ctx, collar, c.shirt, px(1.3 * 0.92), { alpha: a })
    }
    // studs, one at a time
    ;[9, 15.5, 22].forEach((yy, i) => {
      const a = k.studs - i * 0.22
      if (a < 0) return
      const xx = cx * (0.4 + (0.6 * yy) / v)
      ctx.save()
      ctx.translate(xx, yy)
      ctx.scale(pop(a), pop(a))
      draw.occlude(ctx, pt(circ(0, 0, 0.75)))
      draw.beam(ctx, pt(circ(0, 0, 0.7)), c.tie, px(1.1 * 0.92), { hot: true })
      ctx.restore()
    })
    // the lapels: traced on, last
    if (k.lapels >= 0) {
      const lu = show.clamp(k.lapels / 0.7)
      for (const s of [-1, 1]) {
        const d = pt(`M${f(s * 6.2)} -1.5 L${f(cx)} ${f(v + 2)} L${f(s * 11.8)} 15 L${f(s * 15.6)} 8.2 L${f(s * 10.6)} 10.4 L${f(s * 8.4)} 4.5 Z`)
        if (lu >= 1) draw.occlude(ctx, d)
        draw.beam(ctx, d, c.color, px(1.5 * 0.92), { dash: [lu * 95, 200], hot: lu < 1 })
        if (lu >= 1) draw.beam(ctx, pt(`M${f(s * 8)} 3 L${f(cx + s * 1.6)} ${f(v - 3)}`), draw.mix(c.color, '#ffffff', 0.4), px(0.9 * 0.92), { alpha: 0.5 })
      }
      if (lu >= 1) draw.beam(ctx, pt(circ(cx, v + 4.5, 0.9)), c.color, px(1.2 * 0.92))
    }
    // bow tie: first, and it pops
    if (k.tie >= 0) {
      const cc = cx * 0.4, yy = 2.6
      ctx.save()
      ctx.translate(cc, yy)
      ctx.scale(pop(k.tie), pop(k.tie))
      const d = pt(`M0 0 L-4.6 -2.2 L-4.3 2.4 Z M0 0 L4.6 -2.2 L4.3 2.4 Z`)
      draw.occlude(ctx, d)
      draw.beam(ctx, d, c.tie, px(1.5 * 0.92), { hot: true })
      const knot = pt('M-0.9 -1.2 L0.9 -1.2 L0.9 1.2 L-0.9 1.2 Z')
      draw.occlude(ctx, knot)
      draw.beam(ctx, knot, c.tie, px(1.2 * 0.92), { hot: true })
      ctx.restore()
          }
    // pocket square: the finishing touch
    if (k.square >= 0) {
      const sx = 12.5 + cx * 0.5, sy = 17
      ctx.save()
      ctx.translate(sx, sy)
      ctx.scale(pop(k.square), pop(k.square))
      draw.beam(ctx, pt('M-4 0 L4 -0.4'), c.color, px(1.3 * 0.92))
      const d = pt('M-3.2 -0.2 L-2 -3.2 L-0.6 -1 L0.8 -3.8 L2.2 -1.2 L3.2 -2.9 L3.4 -0.4 Z')
      draw.occlude(ctx, d)
      draw.beam(ctx, d, c.square, px(1.2 * 0.92), { hot: true })
      ctx.restore()
    }
    ctx.restore()
  },
}
