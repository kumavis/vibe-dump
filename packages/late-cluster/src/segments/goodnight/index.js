// The last segment — Goodnight. Every runner pays off: the crow lands on the desk, the BUILT
// counter's final tally (14), the gm/gn payoff (Sibyl tries "gn" raw, the engine finds no vowel,
// the panel shows the raw output; the bot builds a site that checks, bump to 15), the heart line
// and its two answers, gn (finally), and Larry presses the giant E key: the stage powers down like a
// CRT and the credits roll over the skyline while the Formants sing a lullaby.
//
// The heart line has two real posts, shown verbatim with handle, date and like count:
// what it is — @shimmermathlabs.com, 2026-10-26, 3 likes:
//   https://bsky.app/profile/shimmermathlabs.com/post/3mys3uefthc23
// how you get in — @prer.at, 2023-04-11, 61 likes: https://bsky.app/profile/prer.at/post/3jt4ocfa6sl2i
//   (it is about joining "the ingroup" in 2023; the show does not present it as a definition of
//   the word simcluster). The gn card: @ganweaving.bsky.social, 2025-11-27.

import { EKEY } from '../../stage/set.js'

const WIN = { x: 1220, y: 140, w: 740, h: 500 } // the skyline window (world units, src/stage/set.js)
const PERCH = { x: 1868, y: 695 }                 // where set crow 'perched-desk' sits (world)

// ---- the credits: four still pages (a scroll at this length was too fast to read), each held
// ~3 s with a crossfade. Lines: { head } · { small } · { text, color } · [role, name] · { gap }
// · { role, star } (a centred top billing: the role small, the name big).
// The local renderer keeps the case of handles and URLs (the shared creditsRoll upper-cases).
const PAGES = [
  { w: 1, lines: [
    { head: 'The Late Cluster' }, { small: 'with Larry Nx' }, { gap: 0.8 },
    { role: 'Chief Executive Prompter', star: 'kumavis' }, { gap: 0.6 },
    ['Host', 'Larry Nx'], ['Announcer', 'Sibyl Ant'], ['Music', 'Hy Oid & The Formants'], ['Sports desk', 'Eppy Glottis'],
  ] },
  { w: 1, lines: [
    ['Built it', 'A website bot'], ['Claims adjuster', 'A crow'], ['Podcast name', '[ field left blank ]'],
    ['Exit strategy', 'The E key'], { gap: 1 }, { small: 'No hypotheticals survived this production' },
  ] },
  { w: 1.25, lines: [
    { head: 'Puppets played the posting personas of' }, { gap: 0.4 },
    { text: '@norvid-studies.bsky.social' }, { text: '@abeliansoup.bsky.social' }, { text: '@borjev.bsky.social' },
    { text: '@samantha.wiki' },
    { gap: 0.4 }, { small: 'Parody.' },
  ] },
  { w: 1.15, lines: [
    { text: 'Every voice and every head on this show is', color: 'gold' },
    { head: 'CHIMERA', size: 40 },
    { text: 'a physical-modelling vocal synth by jamesondh', color: 'gold' }, { gap: 0.6 },
    { text: 'github.com/jamesondh/chimera-vocal-synth (MIT)', color: 'cyan' },
    { gap: 1 }, { small: 'Made during chimera vocal synth week' },
  ] },
]
const LH = 40

// @prer.at, 2023-04-11 (verbatim; the blank lines are the post's own paragraph breaks)
const PRERAT = 'you join the ingroup by acting like you are in the ingroup\n\nthere is a bunch of other stuff people say about it, but none of that rly matters\n\nno permissions - you just start memeing'

export default {
  title: 'Goodnight',
  cast: ['sibyl', 'bot'],
  guests: [],
  set: { eKey: true, crow: false },
  built: { from: 14, bumps: ['built'] },
  disclaimer: { text: 'Puppets play posting personas. Parody.', from: 'gn-post', dur: 4.5 },

  shots: [
    { at: 0, shot: 'wide' },
    { at: 'intro', after: 1.0, shot: 'desk', push: 2.4 },
    { at: 'tally', shot: 'desk', zoom: 1.7 },
    { at: 'wish', after: 0.6, shot: 'deskWith', with: 'sibyl' },
    { at: 'raw', shot: 'ots', who: 'sibyl' },
    { at: 'built', shot: 'deskWith', with: 'bot' },
    { at: 'built.end', after: 0.25, shot: 'ots' },
    { at: 'friends', after: 0.1, shot: 'closeup', who: 'larry', size: 540 },  // the name plate drops below the caption
    { at: 'gm', shot: 'desk' },
    { at: 'trumpet', shot: 'ots' },
    { at: 'presse', after: -0.3, shot: 'desk' },
  ],

  direct(t, show) {
    const larry = show.puppet('larry')
    // set flags are module state: restore them every frame so seeking backwards undoes the press/CRT
    for (const k of ['desk', 'chair', 'couch', 'onair', 'sign', 'dim']) delete show.set[k]
    show.set.eKey = true

    // the crow: circling (drawn by us) until it lands on the desk
    show.set.crow = show.since('crow-land') >= 0 ? 'perched-desk' : false

    // the E key: pressed on 'press'
    if (show.since('press') >= -0.15) show.set.eKey = show.clamp((show.since('press') + 0.15) / 0.15)

    // the desk push into the key
    if (show.since('presse') >= -0.3 && show.since('crt') < 0.7) {
      const u = show.ease.inOutCubic(show.progress(show.at('presse') - 0.3, 1.4))
      show.camera({ x: show.lerp(1750, 1665, u), y: show.lerp(614, 650, u), zoom: show.lerp(1.85, 2.4, u) })  // the key clears the chyron
      const down = show.since('presse') > 0.5
      larry.lookAt(down ? 'left' : 'camera').nod(down ? -0.3 : 0)
    }

    // credits: the camera sits on the skyline, the studio is gone
    if (show.since('crt') > 0.7) {
      show.shot('desk')
      show.camera({ x: WIN.x + WIN.w / 2, y: WIN.y + WIN.h / 2 - 10, zoom: 1.62 })
      larry.hide()
      Object.assign(show.set, { desk: false, chair: false, couch: false, crow: false, eKey: false, onair: false, sign: false, dim: 0.55 })
    }

    // performance
    if (show.between('tally', 'wish')) larry.lookAt('camera').nod(0.05)
    if (show.between('wish', 'built')) larry.lookAt(show.between('tag', 'built') ? 'camera' : 'sibyl')
    if (show.between('wish', 'built')) show.puppet('sibyl').lookAt(show.between('raw-gn', 'tag') ? 'camera' : 'larry').tilt(show.since('raw-gn') > 0 && show.since('tag') < 0 ? -0.08 : 0)
    if (show.between('built', 'built.end')) larry.lookAt('bot')
    if (show.between('built.end', 'friends')) larry.lookAt(show.between('heart', 'heart.end') || show.between('join', 'friends') ? 'camera' : 'right')
    if (show.between('trumpet', 'presse')) larry.lookAt(show.between('see', 'gn') || show.between('trumpet', 'ganweaving') ? 'camera' : 'right')
    if (show.between('friends', 'gm')) larry.lookAt('camera').nod(-0.06)

    // chyrons
    show.chyron('larry', { from: 1.4, dur: 3.6 })
    show.chyron('sibyl', { from: show.at('wish') + 0.8, to: show.at('raw-gn') - 0.1 })
    show.chyron({ name: 'Update', title: 'Someone said gn · Confirmed', color: show.P.magenta }, { from: show.at('gn-post') + 0.6, to: show.at('presse') - 0.35 })
    show.chyron({ name: 'The Late Cluster', title: 'Brought to you by the letter E', color: show.P.cyan }, { from: show.at('presse') + 0.1, to: show.at('crt') })
  },

  drawBack(ctx, t, show) {
    const { draw, P } = show
    const pn = show.panel
    if (!pn) return

    // ---- gn, read raw: the engine's output, labelled as such (ots with Sibyl)
    if (show.between('raw', 'built')) rawGn(ctx, show, pn)

    // ---- the gn website the bot just built (during the laugh)
    if (show.between('built.end', 'heart')) {
      site(ctx, show, pn, 'NO.', P.red, show.progress('built.end', 0.5))
    }
  },

  drawFront(ctx, t, show) {
    const { draw, P } = show
    const pn = show.panel

    // ---- the crow, circling the skyline then diving to the desk
    if (show.since('crow-land') < 0) {
      show.world(ctx, (c) => {
        const t0 = show.at('crow-dive'), t1 = show.at('crow-land')
        const circ = (tt) => {
          const a = tt * 0.9
          return [WIN.x + WIN.w * 0.5 + Math.cos(a) * 230, WIN.y + 330 + Math.sin(a) * 50, -Math.sin(a) >= 0 ? 1 : -1]  // low enough to stay in the desk push
        }
        if (t < t0) {
          const [x, y, f] = circ(t)
          draw.crow(c, x, y, { scale: 0.7, flap: (t * 2.2) % 1, facing: f })
        } else {
          const u = show.ease.inOutSine(show.clamp((t - t0) / (t1 - t0)))
          const [x0, y0] = circ(t0)
          const mx = (x0 + PERCH.x) / 2 + 120, my = Math.min(y0, PERCH.y) - 20
          const x = (1 - u) * (1 - u) * x0 + 2 * u * (1 - u) * mx + u * u * PERCH.x
          const y = (1 - u) * (1 - u) * y0 + 2 * u * (1 - u) * my + u * u * PERCH.y
          draw.crow(c, x, y, { scale: show.lerp(0.7, 0.75, u), flap: u > 0.85 ? 0.25 : (t * 3) % 1, facing: u > 0.6 ? -1 : 1 })
        }
      })
    }

    // ---- the BUILT counter's final tally: point at it
    if (show.between('tally', 'raw')) {
      const a = show.window(t, show.at('tally') + 0.6, show.at('wish') + 0.5, 0.3)
      draw.arrow?.(ctx, 330, 150, 250, 70, P.gold, 2.4, { alpha: a })
      draw.label(ctx, 'FINAL TALLY', 340, 172, { size: 22, color: P.gold, weight: 'm', ls: 0.2, alpha: a })
      draw.label(ctx, 'NIGHT’S NOT OVER', 340, 196, { size: 12, color: P.amber, ls: 0.3, alpha: a * 0.7 })
    }
    if (show.between('built', 'built.end') || (show.since('built') > 0 && show.since('built') < 1.4)) {
      const h = show.headOf('bot')
      if (h && show.since('built') < 1.4) draw.confetti(ctx, h.x + h.size * 0.35, h.y - h.size * 0.2, show.since('built'), { seed: 16, count: 30 })
    }

    if (pn) {
      // ---- the heart line and its two answers (both real posts: verbatim, real handle/date/likes).
      // What it is: the "my friends" card, alone and big. Then it hands over: it slides up and
      // shrinks to a header while the prerat card (how you get in) types on underneath.
      if (show.between('heart', 'gm')) {
        const a = show.clamp(show.since('heart') / 0.5)
        const n = show.since('nerds'), u = show.since('prerat')
        const ho = show.ease.inOutCubic(show.clamp((u + 0.2) / 0.6))   // the hand-over
        draw.label(ctx, 'WHAT IS THE SIMCLUSTER?', pn.x + 40, pn.y + show.lerp(40, 22, ho), { size: show.lerp(20, 16, ho), color: P.sky, ls: 0.2, alpha: a })
        if (ho < 0.5) draw.label(ctx, 'ASKED ALL NIGHT', pn.x + 40, pn.y + 64, { size: 12, color: P.blueMid, ls: 0.3, alpha: a * (1 - ho * 2) })
        // the open question, until the first card answers it
        const q = a * (1 - show.clamp((n + 0.1) / 0.35))
        if (q > 0) draw.glowText(ctx, '?', pn.x + pn.w / 2, pn.y + 320, { size: 200, align: 'center', color: P.sky, weight: 'm', alpha: q * (0.75 + 0.25 * Math.sin(t * 3)) })
        draw.skeetCard(ctx, {
          x: pn.x + show.lerp(40, 30, ho), y: pn.y + show.lerp(150, 38, ho), w: show.lerp(640, 580, ho), scale: show.lerp(1, 0.7, ho),
          name: 'shimmermathlabs.com', handle: 'shimmermathlabs.com', time: '2026-10-26', initials: 's', color: P.bsky,
          text: 'simcluster is how nerds say “my friends”', likes: 3, textSize: 30,
          appear: n / 0.45, reveal: (n - 0.1) / 0.7,
        })
        draw.skeetCard(ctx, {
          x: pn.x + 30, y: pn.y + 150, w: 670, scale: 0.93,
          name: 'prerat', handle: 'prer.at', time: '2023-04-11', initials: 'p', color: P.sky,
          text: PRERAT, likes: 61, textSize: 23,
          appear: (u - 0.25) / 0.45, reveal: (u - 0.4) / 2.4,
        })
      }

      // ---- gn: the neighbour who always says it, then Larry finally does
      if (show.since('trumpet') > 0.05 && show.since('presse') < -0.3) {
        // display name, handle, date and the text: nothing else about this account
        const u = show.since('trumpet') - 0.05
        draw.skeetCard(ctx, {
          x: pn.x + 30, y: pn.y + show.lerp(140, 36, show.ease.inOutCubic(show.progress(show.at('gn') - 0.5, 0.45))), w: 660, scale: 1.25, textSize: 34,
          name: 'GanWeaving', handle: 'ganweaving.bsky.social', time: '2025-11-27', initials: 'G', color: P.cyan,
          text: 'Good night, weirdos!',
          appear: u / 0.4, reveal: (u - 0.1) / 0.6,
        })
        if (show.since('gn') > -0.2) {
          const g = show.since('gn-post')
          const likes = g < 0 ? 0 : Math.round(Math.pow(show.clamp(g / 2.2), 2) * 99_999)
          draw.skeetCard(ctx, {
            x: pn.x + 190, y: pn.y + 230, w: 500,
            name: 'Larry Nx', handle: 'larry.nx', time: 'now', initials: 'L', color: P.gold,
            text: 'gn', textSize: 44, replies: g > 0.4 ? Math.round(1200 * show.clamp(g / 2)) : 0, reposts: g > 0.3 ? Math.round(8000 * show.clamp(g / 2)) : 0, likes,
            appear: (show.since('gn') + 0.2) / 0.35, reveal: show.since('gn') / 0.5, likePulse: (g % 0.5) / 0.5, liked: g > 0,
          })
          if (g > 0 && g < 1.6) draw.confetti(ctx, pn.x + 520, pn.y + 330, g, { seed: 77, count: 40, spread: 1.4 })
          if (g > 0.6 && g < 1.8 + 1.6) draw.confetti(ctx, pn.x + 300, pn.y + 260, g - 0.6, { seed: 78, count: 30 })
        }
      }
    }

    // ---- the elephant in the audience
    if (show.between('trumpet', 'see')) {
      const u = show.since('trumpet')
      const rise = show.ease.outBack(show.clamp(u / 0.35)) * (1 - show.ease.inCubic(show.clamp((u - 1.6) / 0.4)))
      if (rise > 0.01) draw.elephant(ctx, 700, 800 - rise * 200, { scale: 1.5, trunk: Math.sin(u * 7) * (u < 1.3 ? 1 : 0.2), facing: 1 })
    }

    // ---- PRESS E TO LEAVE
    if (show.between('presse', 'crt')) {
      const a = show.clamp(show.since('presse') / 0.5)
      const [kx, ky] = show.toScreen(EKEY.x, EKEY.y)
      draw.glowText(ctx, 'PRESS E TO LEAVE', kx, ky - 120, { size: 30, align: 'center', color: P.cyan, weight: 'm', ls: 0.2, alpha: a })
    }

    // the key goes down: a flash
    const pk = show.since('press')
    if (pk > 0 && pk < 0.6) {
      const [kx, ky] = show.toScreen(EKEY.x, EKEY.y)
      draw.ring(ctx, kx, ky - 6, 70 + pk * 220, P.cyan, 3 * (1 - pk / 0.6), { alpha: 1 - pk / 0.6, hot: true })
    }

    // ---- the CRT power-down, then the credits over the skyline
    const c = show.since('crt')
    if (c >= 0) crtOff(ctx, show, c)
    if (c > 0.7) credits(ctx, show)
  },
}

/** the website the bot built: a browser window with one huge answer */
function site(ctx, show, pn, answer, color, appear) {
  const { draw, P } = show
  if (appear <= 0) return
  const e = show.ease.outBack(show.clamp(appear))
  const w = 520 * e, h = 330 * e
  const x = pn.x + pn.w / 2 - w / 2, y = pn.y + 70
  draw.occlude(ctx, draw.rectPath(x, y, w, h))
  draw.box(ctx, x, y, w, h, { color: P.green, radius: 10 })
  if (e < 0.9) return
  draw.seg(ctx, x, y + 34, x + w, y + 34, P.green, 1.2)
  for (let i = 0; i < 3; i++) draw.ring(ctx, x + 20 + i * 18, y + 17, 5, P.green, 1.2)
  draw.label(ctx, 'did-anyone-say-gn.website', x + 86, y + 22, { size: 13, color: P.green, ls: 0.06 })
  draw.label(ctx, 'HAS ANYONE SAID GN TONIGHT?', x + w / 2, y + 86, { size: 18, align: 'center', color: P.white, ls: 0.2 })
  draw.glowText(ctx, answer, x + w / 2, y + 210, { size: 110, align: 'center', color, weight: 'm', ls: 0.05 })
  draw.label(ctx, '1 ATTEMPT TONIGHT · REJECTED: NO VOWEL', x + w / 2, y + h - 44, { size: 12, align: 'center', color: P.amber, ls: 0.22 })
  draw.label(ctx, 'BUILT JUST NOW · CHECKS EVERY POST', x + w / 2, y + h - 22, { size: 11, align: 'center', color: P.blueMid, ls: 0.25 })
}

/** Sibyl's raw "Gn.": what the pronunciation engine did with it, so the mangle reads as deliberate */
function rawGn(ctx, show, pn) {
  const { draw, P } = show
  const a = show.clamp(show.since('raw') / 0.3)
  const x = pn.x + 70, y = pn.y + 64
  draw.label(ctx, 'PRONUNCIATION ENGINE · RAW OUTPUT', x, y, { size: 20, color: P.gold, ls: 0.2, weight: 'm', alpha: a })
  draw.label(ctx, 'NO RESPELLING · DICTIONARY ONLY', x, y + 30, { size: 13, color: P.sky, ls: 0.3, alpha: a * 0.8 })
  const rows = [['INPUT', 'gn', P.white, 0], ['IPA', '/gn/', P.red, 0.15], ['VOWELS', '0', P.red, 0.3]]
  rows.forEach(([k, v, col, d], i) => {
    const ra = show.clamp((show.since('raw-gn') - d) / 0.25)
    const ry = y + 112 + i * 70
    draw.label(ctx, k, x + 20, ry, { size: 17, color: P.sky, ls: 0.25, alpha: ra })
    draw.label(ctx, v, x + 200, ry + 6, { size: 46, color: col, weight: 'm', ls: 0.06, alpha: ra })
  })
  const sa = show.clamp((show.since('raw-gn.end') - 0.15) / 0.3)
  if (sa > 0) {
    draw.stamp(ctx, x + 470, y + 186, 'NOT A WORD', { age: show.since('raw-gn.end') - 0.15, rot: -0.12, size: 34, color: P.red })
  }
}

/** an old tube switching off: the picture squeezes to a line, the line to a dot, the dot fades */
function crtOff(ctx, show, c) {
  const { draw, P } = show
  if (c < 0.32) {
    const u = show.ease.inCubic(c / 0.32)
    const half = Math.max(2, 360 * (1 - u))
    draw.occlude(ctx, draw.rectPath(0, 0, 1280, 360 - half), '#000')
    draw.occlude(ctx, draw.rectPath(0, 360 + half, 1280, 360 - half), '#000')
    draw.seg(ctx, 0, 360 - half, 1280, 360 - half, P.white, 2 + 3 * u, { alpha: u, hot: true })
    draw.seg(ctx, 0, 360 + half, 1280, 360 + half, P.white, 2 + 3 * u, { alpha: u, hot: true })
    return
  }
  // full black from here until the credits fade the skyline in
  const fadeIn = show.clamp((c - 1.2) / 1.2)
  draw.occlude(ctx, draw.rectPath(0, 0, 1280, 720), '#000', 1 - fadeIn * 0.999)
  if (c < 0.62) {
    const v = show.ease.inQuad((c - 0.32) / 0.3)
    const hw = Math.max(3, 640 * (1 - v))
    draw.seg(ctx, 640 - hw, 360, 640 + hw, 360, P.white, 4, { hot: true })
  } else if (c < 1.1) {
    const v = (c - 0.62) / 0.48
    draw.dot(ctx, 640, 360, 5 * (1 - v * 0.6), P.white, 1 - v)
  }
}

/** the closing credits over the skyline; then the final card */
function credits(ctx, show) {
  const { draw, P } = show
  const t = show.t
  const start = show.at('crt') + 1.1, stop = show.at('final')
  const rect = { x: 250, y: 64, w: 780, h: 540 }
  // the crow, back out in the skyline
  const circle = (tt) => [640 + Math.cos(tt * 0.7) * 470, 170 + Math.sin(tt * 0.7) * 50, -Math.sin(tt * 0.7) >= 0 ? 1 : -1]
  const ca = show.since('caw-out')
  if (ca < 0) {
    const [x, y, f] = circle(t)
    const fa = show.clamp((show.since('crt') - 1.4) / 0.8)
    if (fa > 0) draw.crow(ctx, x, y, { scale: 0.55, flap: (t * 2.2) % 1, facing: f, alpha: 0.8 * fa })
  }
  // a dark band behind the roll so the skyline stays a backdrop
  const bandA = show.clamp((t - start + 0.4) / 0.8) * (1 - show.clamp(show.since('final') / 0.6) * 0.3)
  draw.occlude(ctx, draw.rectPath(rect.x, 0, rect.w, 720), '#000', 0.78 * bandA)

  // the pages: each held, crossfading over 0.35 s; the last fades out as the final card comes up
  const total = PAGES.reduce((a, p) => a + p.w, 0)
  const span = stop - 0.2 - start
  let p0 = start
  const cx = rect.x + rect.w / 2, split = cx - 10
  for (const pg of PAGES) {
    const p1 = p0 + (pg.w / total) * span
    const a = show.clamp((t - p0) / 0.35) * (1 - show.clamp((t - p1 + 0.35) / 0.35))
    if (a > 0) {
      let h = 0
      const lhOf = (ln) => ln.star ? LH * 2.1 : ln.head ? LH * (ln.size ? 1.6 : 1.3) : ln.gap ? LH * 0.7 * ln.gap : LH
      for (const ln of pg.lines) h += lhOf(ln)
      let y = rect.y + rect.h / 2 - h / 2 + LH * 0.6
      for (const ln of pg.lines) {
        const lh = lhOf(ln)
        if (ln.star) {
          draw.label(ctx, ln.role.toUpperCase(), cx, y, { size: 17, align: 'center', color: P.sky, ls: 0.24, alpha: a })
          draw.glowText(ctx, ln.star, cx, y + 44, { size: 40, align: 'center', color: P.white, weight: 'm', ls: 0.06, alpha: a })
        } else if (ln.head) draw.glowText(ctx, ln.head.toUpperCase(), cx, y, { size: ln.size ?? 26, align: 'center', color: P.gold, ls: 0.24, weight: 'm', alpha: a })
        else if (ln.small) draw.label(ctx, ln.small.toUpperCase(), cx, y, { size: 16, align: 'center', color: P.sky, ls: 0.24, alpha: a })
        else if (ln.text) draw.label(ctx, ln.text, cx, y, { size: 23, align: 'center', color: P[ln.color] ?? P.white, ls: 0.04, alpha: a })
        else if (Array.isArray(ln)) {
          draw.label(ctx, ln[0].toUpperCase(), split - 16, y, { size: 17, align: 'right', color: P.sky, ls: 0.16, alpha: a })
          draw.label(ctx, ln[1], split + 16, y, { size: 24, align: 'left', color: P.white, ls: 0.04, alpha: a })
        }
        y += lh
      }
    }
    p0 = p1
  }

  // the final card
  const f = show.since('final')
  if (f > 0) {
    const a = show.clamp(f / 0.8)
    draw.glowText(ctx, 'THE LATE CLUSTER', 640, 290, { size: 56, align: 'center', color: P.gold, weight: 'm', ls: 0.14, alpha: a })
    draw.label(ctx, 'WITH LARRY NX', 640, 330, { size: 16, align: 'center', color: P.gold, ls: 0.4, alpha: a * 0.7 })
    const b = show.clamp((f - 0.9) / 0.5)
    draw.glowText(ctx, 'gn.', 640, 430, { size: 64, align: 'center', color: P.white, weight: 'm', alpha: b })
  }
  // the crow leaves: one last pass across the window with the caw
  if (ca >= 0) {
    const u = ca / 1.6
    draw.crow(ctx, show.lerp(-60, 1340, u), 210 - Math.sin(u * Math.PI) * 60, { scale: 0.8, flap: (t * 3) % 1, facing: 1 })
  }
}
