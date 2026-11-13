// SEG 6 — The Panel: the Mayor and the Alligator.
// Larry's old-school questions get FILED instead of answered. norvid labels (CLAIM stamps, caws),
// proposes everything as a concept, assigns it to Abel; Abel's contraption has already built it
// (two builds = two BUILT bumps). The vector crow arrives for good: it bursts out of the machine,
// circles Larry, and at "my beautiful city" flies off to circle the skyline for the rest of the show.

import { headPalette } from '../../engine/palette.js'

const GUESTS = ['norvid', 'abel']
const MACHINE_SIDE = -1.9 // the contraption stands left of the couch (x = Abel − 285), clear of the furniture
const MACHINE_X = 1330 + MACHINE_SIDE * 150

export default {
  bumper: { sub: 'the mayor and the alligator' },
  guests: GUESTS,
  cast: ['borjev'],
  set: { eKey: true },
  built: { from: 8, bumps: ['built1', 'built2'] },
  disclaimer: { text: 'Guests are puppets playing posting personas. Parody.', from: 'enter', dur: 6 },
  defaultShot: 'desk',

  shots: [
    { at: 0, shot: 'desk' },
    { at: 'welcome', after: 0.4, shot: 'desk', zoom: 1.45, push: 1.4 },
    { at: 'enter', shot: 'panel', guests: GUESTS },
    { at: 'reply', shot: 'ots', pip: 'abel', pipLabel: 'ABEL · LIVE' },
    { at: 'under', shot: 'panel-cu', who: 'abel', size: 440, look: 'larry' },
    { at: 'what', shot: 'panel', guests: GUESTS },
    { at: 'like', shot: 'panel-cu', who: 'norvid', size: 440, look: 'larry' },
    { at: 'another', shot: 'desk', look: 'norvid' },
    { at: 'real', shot: 'panel', guests: GUESTS },
    { at: 'museum', shot: 'panel-cu', who: 'norvid', size: 400, look: 'larry' },
    { at: 'goodnews', shot: 'panel', guests: GUESTS }, // widened in direct()
    { at: 'classic', shot: 'desk', look: 'camera' },
    { at: 'concept2', shot: 'panel-cu', who: 'norvid', size: 420, look: 'larry' },
    { at: 'already', shot: 'panel', guests: GUESTS }, // widened in direct()
    { at: 'duck', shot: 'desk', zoom: 1.45 },
    { at: 'pop', shot: 'panel', guests: GUESTS },
    { at: 'city', shot: 'panel', guests: GUESTS }, // widened to the skyline in direct()
    { at: 'buddy', shot: 'panel-cu', who: 'norvid', size: 420, look: 'larry', dx: 120 },
    { at: 'thankyou', shot: 'panel', guests: GUESTS },
    { at: 'claim2', after: 0.6, shot: 'wide', push: 2.2 },
  ],

  setup(show) {
    const { SHOTS } = show
    // Abel's mid-green head read dim next to everyone else in close-up: lift its structure lines
    show.puppet('abel').dress({ head: headPalette('#6dffa6', { blueMid: '#55e08f', blueDim: '#3aa868', frame: '#1c4a2f' }) })
    // a guest close-up framed on their panel seat: shots.closeup() reads markOf(), which remembers the
    // last placement (after an ots shot that's the pip monitor, so the camera landed on a black wall)
    SHOTS['panel-cu'] = (s, o) => {
      const mark = SHOTS.panel(s, { guests: GUESTS }).place[o.who]
      const saved = s._lastPlace[o.who]
      s._lastPlace[o.who] = { x: mark.x, y: mark.y, scale: mark.scale ?? 1, look: mark.look }
      try { return SHOTS.closeup(s, o) } finally { if (saved) s._lastPlace[o.who] = saved; else delete s._lastPlace[o.who] }
    }
  },

  direct(t, show) {
    const larry = show.puppet('larry'), norvid = show.puppet('norvid'), abel = show.puppet('abel')

    // the contraption: sheet off on "good news, everyone!", running from "it's already running"
    abel.prop({ side: MACHINE_SIDE, unveil: show.progress('unveil', 1.1), run: show.since('release') > 0 ? 1 : 0.35 * show.clamp(show.since('exhibit')) })

    // the build moments: pull back so the machine (on the floor beside Abel) and Larry share the frame
    const wideBuild = show.between('goodnews', 'classic') || show.between('already', 'duck')
    if (wideBuild) show.camera({ x: 1470, y: 712, zoom: 0.98 })
    // "my beautiful city": the whole skyline window, where the crow is headed
    if (show.between('city', 'buddy')) show.camera({ x: 1580, y: 545, zoom: 0.95 })

    // BorJev, popping up from behind the furniture and sinking again once it's opted out
    if (show.between('pop', 'city')) {
      const up = show.tween(t, show.at('pop'), show.at('pop') + 0.6, 0, 1, 'outBack') * (1 - show.tween(t, show.at('optin') + 0.35, show.at('optin') + 1.1, 0, 1, 'inCubic'))
      show.shot('panel', { guests: GUESTS, pop: 'borjev', popUp: up, popScale: 0.85 })
      show.puppet('borjev').lookAt(show.since('who') > 0 ? 'abel' : 'larry')
    }

    // who looks at whom
    const sp = show.speaker
    if (sp === 'larry') {
      norvid.lookAt('larry'); abel.lookAt('larry')
    } else if (sp === 'norvid' || sp === 'abel') {
      larry.lookAt(sp)
      ;(sp === 'norvid' ? abel : norvid).lookAt(sp)
    }
    if (show.line('assign').active || show.since('assign') > 0 && show.since('goodnews') < 0) norvid.lookAt('abel')
    if (show.between('reply', 'under')) larry.lookAt('camera')
    if (show.line('like').active) norvid.lookAt('camera')
    if (show.between('unveil', 'classic')) { norvid.lookAt('abel'); larry.lookAt('abel') }
    if (show.between('release', 'pop')) { norvid.lookAt('larry'); abel.lookAt('larry') }
    if (show.between('exhibit', 'exhibit-out') && show.speaker !== 'abel') larry.lookAt('camera')
    if (show.between('thankyou', 'claim2')) { larry.lookAt('camera') }
    if (show.since('claim2') > 0) { norvid.lookAt('camera'); abel.lookAt('camera'); larry.lookAt('norvid') }

    // the crow hunts the host: Larry ducks and flinches while it circles
    if (show.between('release', 'city')) {
      const k = show.since('release') - 1.0
      if (k > 0) larry.nod(-0.1 - 0.05 * Math.sin(t * 6)).shake(show.line('duck').active ? 3 : 1)
    }
    // "my beautiful city": Larry turns to the skyline behind him
    if (show.line('city').active) larry.lookAt(show.line('city').word >= 2 ? 'left' : 'camera').nod(0.06)

    // the crow lives in the skyline window from the moment it gets there
    show.set.crow = show.since('city') > CROW_HOME ? 'circling' : false  // (assigned every frame: seek-safe)

    // lower thirds (guests carry the PUPPET · PARODY tag automatically)
    show.chyron('norvid', { from: show.at('enter') + 0.7, to: 'reply' })
    show.chyron('abel', { from: show.at('under') + 0.2, to: 'what' })
    show.chyron('borjev', { from: show.at('pop') + 0.5, to: show.at('optin') + 0.3 })
    if (show.since('claim2') > 0.8) show.chyron({ name: 'The Late Cluster', title: 'Back after this. If the crow allows it.', color: show.P.gold }, { from: show.at('claim2') + 0.8, to: show.duration })
  },

  drawBack(ctx, t, show) {
    const { draw, P } = show
    const pn = show.panel
    // ---- ots graphics
    if (pn && show.between('reply', 'under')) replyChart(ctx, show, pn)
    // the crow while it is behind Larry's head
    drawCrow(ctx, show, false)
    void draw; void P
  },

  drawFront(ctx, t, show) {
    const { draw, P } = show

    // ---- CLAIM stamps (on what's being labelled)
    stampOn(ctx, show, 'larry', 'claim1', 'CLAIM', { until: 'reply', dy: 0.42, rot: -0.14, color: P.red })
    if (show.since('claim2') > -0.2) {
      const age = show.since('claim2')
      draw.stamp(ctx, 640, 120, 'CLAIM', { age, rot: -0.12, size: 64, color: P.red })
    }

    // ---- "what else is like this": the label floats over the frame like a quote-post
    if (show.between('like', 'another')) {
      const u = show.since('like')
      draw.typewriter(ctx, 'WHAT ELSE IS LIKE THIS', 640 - 290, 110, show.clamp(u / 0.9), { size: 32, color: P.violet })
    }

    // ---- the alligator surfaces on "alligator"
    const ul = show.line('under')
    if (ul.t0 <= t && show.since('what') < 0 && ul.word >= 7) {
      const g = show.clamp((t - ul.words[7][0]) / 0.5)
      draw.occlude(ctx, draw.rectPath(930, 470, 260, 110))
      for (let k = 0; k < 3; k++) draw.seg(ctx, 900 + k * 18, 552 + k * 6, 1220 - k * 18, 552 + k * 6, P.cyan, 1.2, { alpha: 0.5 - k * 0.12 })
      draw.gator(ctx, 1060, 560 - 40 * show.ease.outBack(g), { scale: 1.1, jaw: 0.4 + 0.4 * Math.sin(t * 5), facing: -1 })
    }

    // ---- build one: the museum exhibit (Larry in a glass case)
    if (show.between('exhibit', 'exhibit-out')) museumCase(ctx, show)

    // ---- the crow (in front of Larry's head)
    drawCrow(ctx, show, true)

    // ---- BorJev: skeet card for the old post it is quoting
    if (show.between('pop', 'optin')) {
      const u = show.since('escape') + 0.2
      if (u > 0) {
        const ch = draw.skeetCard(ctx, {
          x: 375, y: 66, w: 500,  // below the APPLAUSE/LAUGH sign
          name: 'norvid_studies', handle: 'norvid-studies.bsky.social', time: 'Nov 22, 2024', initials: 'N', color: P.violet,
          text: 'what simcluster is this and how do i escape',
          appear: u / 0.4, reveal: (u - 0.15) / 1.4,
        })
        draw.label(ctx, 'QUOTED BY @BORJEV.BSKY.SOCIAL', 383, 66 + ch + 20, { size: 13, color: P.amber, ls: 0.2, alpha: show.clamp((u - 0.6) / 0.4) })
      }
    }
    // opted out: the label slams on BorJev as he sinks
    if (show.between('optin', 'city')) {
      const age = show.since('optin')
      const h = show.headOf('borjev')
      const [bx, by] = h ? [h.x, h.y] : show.toScreen(1218, 600)
      draw.stamp(ctx, bx + 30, Math.min(by, 330), 'OPT-IN ONLY', { age, rot: -0.08, size: 28, color: P.amber })
    }

    // ---- "buddy that's my freaking simcluster": the real post
    if (show.between('buddy', 'thankyou')) {
      const u = show.since('buddy') - 0.6
      if (u > -0.2) {
        draw.skeetCard(ctx, {
          x: 700, y: 70, w: 520,  // right of norvid's head (the close-up is framed with dx)
          name: 'norvid_studies', handle: 'norvid-studies.bsky.social', time: 'Jul 20, 2026', initials: 'N', color: P.violet,
          text: "buddy that's my freaking simcluster", likes: 48,
          appear: (u + 0.2) / 0.4, reveal: u / 0.9, likePulse: (u - 1.0) / 0.4, liked: u > 1.0,
        })
      }
    }
  },
}

// ---------------------------------------------------------------- helpers (pure functions of t)

const CROW_HOME = 2.4 // seconds after the "city" cue when the crow reaches the skyline

/** a rubber stamp slammed onto a puppet's chest, from `cue` until `until` */
function stampOn(ctx, show, who, cue, text, o) {
  if (!show.between(show.at(cue) - 0.15, show.at(o.until))) return
  const h = show.headOf(who)
  if (!h) return
  show.draw.stamp(ctx, h.x - h.size * 0.05, h.y + h.size * o.dy, text, { age: show.since(cue), rot: o.rot, size: o.size ?? 46, color: o.color })
}

/** where the crow is now (stage units), or null; `front` = whether it's in front of Larry's head */
function crowState(show) {
  const t = show.t
  const r0 = show.at('release')
  if (t < r0 + 0.1) return null
  const h = show.headOf('larry')
  const fun = show.toScreen(MACHINE_X + 30, 960 - 195) // the contraption's funnel
  const orbit = (tt) => {
    if (!h) return null
    const a = (tt - r0) * 3.1
    const rx = h.size * 0.62, ry = h.size * 0.13
    return { x: h.x + Math.cos(a) * rx, y: h.y - h.size * 0.42 + Math.sin(a) * ry, facing: -Math.sin(a) >= 0 ? 1 : -1, front: Math.sin(a) > 0, scale: Math.max(0.6, h.size / 200) }
  }
  const city = show.at('city')
  if (t < city + 0.3) {
    const o = orbit(t)
    const u = show.clamp((t - r0 - 0.1) / 1.0)
    if (u < 1 || !o) {
      // bursting out of the funnel and swooping to the host
      const tgt = o ?? { x: 900, y: 200, scale: 1 }
      const e = show.ease.inOutCubic(u)
      const x = show.lerp(fun[0], tgt.x, e), y = show.lerp(fun[1], tgt.y, e) - Math.sin(Math.PI * u) * 160
      return { x, y, facing: tgt.x > fun[0] ? 1 : -1, front: true, scale: show.lerp(0.9, tgt.scale ?? 1, e) }
    }
    return o
  }
  // off to the skyline: meet the set crow's own circling path exactly where it will be
  const tHome = city + CROW_HOME
  if (t >= tHome) return null
  const home = show.toScreen(...setCrowAt(show, tHome))
  const from = orbit(city + 0.3) ?? { x: 900, y: 200, scale: 1 }
  const u = show.clamp((t - city - 0.3) / (CROW_HOME - 0.3))
  const e = show.ease.inOutSine(u)
  const homeScale = 0.7 * show.cam.zoom
  return { x: show.lerp(from.x, home[0], e), y: show.lerp(from.y, home[1], e) - Math.sin(Math.PI * u) * 90, facing: home[0] > from.x ? 1 : -1, front: true, scale: show.lerp(from.scale, homeScale, e) }
}

/** where set.js's 'circling' crow is at segment time tt in the current camera (world; mirrors setCrow) */
function setCrowAt(show, tt) {
  const W = { x: 1220, y: 140, w: 740, h: 500 }
  const a = (tt + 1000) * 0.45
  const cam = show.cam
  const vx0 = Math.max(W.x, cam.x - 640 / cam.zoom), vx1 = Math.min(W.x + W.w, cam.x + 640 / cam.zoom)
  const top = cam.y - 360 / cam.zoom
  const cx = vx1 > vx0 ? (vx0 + vx1) / 2 : W.x + W.w * 0.55
  const rx = vx1 > vx0 ? Math.max(60, (vx1 - vx0) * 0.42) : 230
  const cy = Math.min(W.y + W.h - 110, Math.max(W.y + 150, top + 140 / cam.zoom))
  const ry = Math.min(70, 34 / Math.max(0.5, cam.zoom) * 1.6)
  return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]
}

function drawCrow(ctx, show, front) {
  const c = crowState(show)
  if (!c || c.front !== front) return
  show.draw.crow(ctx, c.x, c.y, { scale: c.scale, flap: (show.t * 2.6) % 1, facing: c.facing })
}

/** "39% of Abel's posts are replies to norvid" */
function replyChart(ctx, show, pn) {
  const { draw, P } = show
  const u = show.since('reply')
  const x = pn.x + 40
  draw.label(ctx, 'WHO ABEL REPLIES TO', x, pn.y + 50, { size: 20, color: P.green, ls: 0.2 })
  draw.label(ctx, 'OWN POSTS, AUG 18 – NOV 12, 2026', x, pn.y + 74, { size: 13, color: P.blueMid, ls: 0.3 })
  // a pie: the norvid slice grows to 39 %
  const cx = x + 150, cy = pn.y + 220, r = 105
  const frac = 0.39 * show.ease.outCubic(show.clamp((u - 0.4) / 1.4))
  const rest = new Path2D()
  rest.arc(cx, cy, r, -Math.PI / 2 + frac * Math.PI * 2, Math.PI * 1.5)
  draw.beam(ctx, rest, P.blueMid, 1.4)
  if (frac > 0.005) {
    const sl = new Path2D()
    sl.moveTo(cx, cy)
    sl.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2)
    sl.closePath()
    ctx.save()
    ctx.globalAlpha = 0.22
    ctx.fillStyle = P.violet
    ctx.fill(sl)
    ctx.restore()
    draw.beam(ctx, sl, P.violet, 2.6, { hot: true })
  }
  const am = -Math.PI / 2 + frac * Math.PI
  draw.crow(ctx, cx + Math.cos(am) * r * 0.55, cy + Math.sin(am) * r * 0.55, { scale: 0.75, perched: true, facing: 1 })
  draw.label(ctx, `${Math.round(frac * 100)}%`, x + 300, pn.y + 190, { size: 64, color: P.violet, weight: 'm' })
  draw.label(ctx, 'REPLIES TO NORVID', x + 300, pn.y + 222, { size: 16, color: P.white, ls: 0.15 })
  draw.label(ctx, '389 OF 995 POSTS', x + 300, pn.y + 248, { size: 15, color: P.blueMid, ls: 0.2, alpha: show.clamp((u - 1.6) / 0.4) })
  // the alligator, lurking under the slice
  const g = show.clamp((u - 2.2) / 0.6)
  if (g > 0) draw.gator(ctx, cx + 30, cy + r + 34 - 8 * g, { scale: 0.42, jaw: 0.3 + 0.3 * Math.sin(show.t * 3), facing: 1 })
}

/** build one: "this interview, but it's a museum exhibit" — Larry in a glass case with a placard */
function museumCase(ctx, show) {
  const { draw, P } = show
  const u = show.since('exhibit')
  const out = show.clamp((show.t - show.at('exhibit-out') + 0.45) / 0.45)
  const grow = show.ease.outCubic(show.clamp(u / 0.7)) * (1 - out)
  if (grow <= 0) return
  // the case is world-anchored around Larry at his desk
  show.world(ctx, (c) => {
    const x0 = 1630, x1 = 1950, top = 405, bot = 728
    const y0 = bot - (bot - top) * grow
    const glass = draw.rectPath(x0, y0, x1 - x0, bot - y0)
    c.save()
    c.globalAlpha = 0.08
    c.fillStyle = P.cyan
    c.fill(glass)
    c.restore()
    draw.beam(c, glass, P.cyan, 3 / show.cam.zoom, { hot: true })
    draw.seg(c, x0 + 12, y0 + 12, x1 - 12, y0 + 12, P.cyan, 1.2 / show.cam.zoom, { alpha: 0.5 })
    // glints
    for (const k of [0.16, 0.22, 0.8]) draw.seg(c, x0 + (x1 - x0) * k, y0 + 30, x0 + (x1 - x0) * k + 40, y0 + 110, P.white, 1.2 / show.cam.zoom, { alpha: 0.35 * grow })
    // velvet rope in front of the desk
    if (grow > 0.5) {
      for (const px of [1600, 1980]) {
        draw.seg(c, px, 960, px, 860, P.gold, 2.4 / show.cam.zoom)
        draw.ring(c, px, 855, 7, P.gold, 2 / show.cam.zoom)
      }
      const rope = new Path2D()
      rope.moveTo(1600, 862)
      rope.quadraticCurveTo(1790, 930, 1980, 862)
      draw.beam(c, rope, P.red, 3.2 / show.cam.zoom, { hot: true })
    }
  })
  // the placard, in stage units, beside the case
  const a = show.clamp((u - 0.5) / 0.4) * (1 - out)
  if (a <= 0) return
  if (!show.headOf('larry')) return
  const bx = 30, by = 70
  draw.occlude(ctx, draw.rectPath(bx, by, 300, 132))
  draw.box(ctx, bx, by, 300, 132, { color: P.gold, cut: 6 })
  draw.label(ctx, 'EXHIBIT 31', bx + 16, by + 30, { size: 16, color: P.gold, weight: 'm', ls: 0.25, alpha: a })
  draw.label(ctx, 'TALK SHOW HOST, ASKING', bx + 16, by + 56, { size: 13, color: P.white, ls: 0.12, alpha: a })
  draw.label(ctx, 'A QUESTION · c. 1962', bx + 16, by + 76, { size: 13, color: P.white, ls: 0.12, alpha: a })
  draw.label(ctx, 'MIXED MEDIA (TUXEDO)', bx + 16, by + 98, { size: 12.5, color: P.blueMid, ls: 0.2, alpha: a })
  draw.label(ctx, 'PLEASE DO NOT TAP THE GLASS', bx + 16, by + 119, { size: 12.5, color: P.coral, ls: 0.2, alpha: a })
}
