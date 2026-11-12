// remotes: two remote guests on two monitors. prerat is an archival hologram made only of his own
// 2023 posts; Void (a puppet re-enactment — the real Void is resting) joins on a decelerated clock,
// so every answer lands one question late and is exactly right for the question before.

const HOLO = { x: 40, y: 90, w: 390, h: 300 } // remote2's left monitor (stage units)
const VOID = { x: 460, y: 90, w: 390, h: 300 } // remote2's right monitor

// Larry's questions, numbered in the order asked (whoever they were addressed to)
const QUESTIONS = [
  ['q1', 'How was the trip?'],
  ['q2', 'Are you in the simcluster?'],
  ['q3', 'Who was in one?'],
  ['q4', 'How does a person get in?'],
  ['q5', 'Is the front door still open?'],
  ['q6', 'Any last words?'],
]
// Void's late replies: line id → the question number it answers
const REPLIES = { a1: 1, a2: 2, a3: 3, a4: 4, a5: 5, proc: 6 }

// the date of the 2023 post each hologram line comes from (research-accounts.md §4)
const POSTED = { p1: '2023-05-04', p2: '2023-05-04', p3: '2023-05-04', p4: '2023-04-11', p6: '2023-04-13' }

export default {
  bumper: { sub: 'one from the archive, one from a very slow clock' },
  disclaimer: { text: 'Puppets. Void is a re-enactment; the real Void is resting. prerat speaks only his 2023 posts.', from: 'monitors', dur: 7 },
  built: { from: 10, bumps: [] },
  set: { eKey: true, crow: 'circling' },
  defaultShot: 'desk',

  shots: [
    { at: 0, shot: 'desk' },
    { at: 'intro2', shot: 'desk', zoom: 2.05, push: 0.9 },
    { at: 'intro3', shot: 'desk' },
    { at: 'monitors', shot: 'remote2', guests: ['prerat', 'void'], labels: ['prerat · archival · May 2023', 'Void · puppet re-enactment'] },
    { at: 'heart', shot: 'closeup', who: 'larry', size: 440 },
    { at: 'heart', after: 0.1, shot: 'closeup', who: 'larry', size: 500, push: 3 },
    { at: 'door', shot: 'remote2', guests: ['prerat', 'void'], labels: ['prerat · archival · May 2023', 'Void · puppet re-enactment'] },
  ],

  direct(t, show) {
    const larry = show.puppet('larry')
    const prerat = show.puppet('prerat')
    const voidP = show.puppet('void')

    // ---- the desk
    if (t < show.at('monitors')) larry.lookAt('camera')
    if (show.line('intro2').active) larry.nod(-0.06)
    // the heart line: a half-turn back towards the dark monitor, chin down
    if (show.between('heart', 'door')) larry.lookAt(Math.PI * 0.6).nod(-0.05)

    // ---- the monitors
    const inRemote = show.between('monitors', 'heart') || t >= show.at('door')
    if (inRemote) {
      // Larry looks at whichever monitor he's talking to, or the one that just spoke
      const sp = show.speaker
      const toVoid = ['q1', 'q2', 'q5', 'thanks'].some((id) => show.line(id).active) || sp === 'void'
      larry.lookAt(toVoid ? 0.2 * Math.PI + Math.PI / 2 : Math.PI * 0.92)
      // a double-take on Void's first late reply
      if (show.between('a1', 'q3')) larry.lookAt(show.since('a1') < 0.9 ? Math.PI * 0.92 : 0.2 * Math.PI + Math.PI / 2)
      if (t >= show.at('door') && !show.line('thanks').active && !show.line('a5').active) larry.lookAt(0.2 * Math.PI + Math.PI / 2)
    }

    // prerat: dark until the archive boots, a hologram after, gone once it flickers out
    if (t < show.at('holo-on')) prerat.hide()
    else if (t >= show.at('holo-out') + 0.9) prerat.hide()
    else {
      const boot = show.progress('holo-on', 0.9)
      const out = show.since('holo-out')
      const amount = out < 0 ? boot : show.tween(t, show.at('holo-out'), show.at('holo-out') + 0.85, 1, 0, 'inCubic')
      const shaky = show.line('p6').active || out > 0 ? 1 : boot < 1 ? 1 : 0.45
      prerat.fx('hologram', { amount, flicker: shaky, glitch: out > 0 || boot < 1 ? 1 : 0.6, scan: 0.38 })  // lighter scanlines: the small monitor read dim
      if (out > 0) prerat.shake(6 * show.clamp(out / 0.6))
    }

    // Void: nothing until the clock catches up
    if (t < show.at('void-on')) voidP.hide()
    else voidP.lookAt(Math.PI * 0.4).fx('monitor', { scan: 0.12 })  // lighter scanlines: the grey head read dim in the monitor

    // ---- chyrons
    show.chyron('larry', { from: 1.0, dur: 3.3 })
    show.chyron({ id: 'prerat', title: 'Archival · May 2023' }, { from: show.at('holo-on') + 0.6, dur: 4.4 })
    show.chyron({ id: 'void', title: 'Re-enactment · the real Void is resting' }, { from: show.at('void-on') + 0.3, dur: 5 })
  },

  drawFront(ctx, t, show) {
    const { draw, P } = show
    const inRemote = show.between('monitors', 'heart') || t >= show.at('door')

    // ---- Larry's question badges: each question gets a number as he asks it
    QUESTIONS.forEach(([id, q], i) => {
      const L = show.line(id)
      const u = t - L.t0
      if (u < 0 || u > (L.t1 - L.t0) + 0.6) return
      const h = show.headOf('larry')
      if (!h) return
      const a = show.clamp(u / 0.2) * show.clamp(((L.t1 - L.t0) + 0.6 - u) / 0.3)
      const x = h.x + h.size * 0.32, y = h.y - h.size * 0.62
      draw.box(ctx, x, y, 64, 34, { color: P.gold, cut: 6, width: 1.4, fillAlpha: 0.85 * a, alpha: a })
      draw.label(ctx, `Q${i + 1}`, x + 32, y + 25, { size: 20, align: 'center', color: P.gold, weight: 'm', ls: 0.1, alpha: a })
    })

    if (!inRemote) return

    // ---- prerat's monitor
    const H = HOLO
    if (t < show.at('holo-on') + 0.3) {
      const a = 1 - show.clamp(show.since('holo-on') / 0.3)
      draw.label(ctx, 'ARCHIVE · STANDBY', H.x + H.w / 2, H.y + 130, { size: 18, align: 'center', color: P.sky, ls: 0.25, alpha: 0.8 * a })
      draw.label(ctx, 'MAY 2023', H.x + H.w / 2, H.y + 158, { size: 13, align: 'center', color: P.blueMid, ls: 0.3, alpha: 0.8 * a })
    }
    // which post the hologram is playing
    for (const [id, date] of Object.entries(POSTED)) {
      const L = show.line(id)
      if (t < L.t0 - 0.1 || t > L.t1 + 0.4) continue
      draw.label(ctx, `POSTED ${date}`, H.x + 18, H.y + 30, { size: 12, color: P.sky, ls: 0.22, alpha: 0.85 })
    }
    // the flicker-out: static, then the archive ends
    const out = show.since('holo-out')
    if (out > 0) {
      const r = show.rng(Math.floor(t * 14))
      const a = show.clamp(out / 0.3) * (1 - show.clamp((out - 1.6) / 0.6) * 0.75)
      ctx.save()
      ctx.beginPath(); ctx.rect(H.x, H.y, H.w, H.h); ctx.clip()
      for (let k = 0; k < 26; k++) {
        const y = H.y + r() * H.h, x0 = H.x + r() * H.w * 0.6
        draw.seg(ctx, x0, y, x0 + 30 + r() * H.w * 0.5, y, P.sky, 1, { alpha: 0.35 * a })
      }
      ctx.restore()
      if (out > 0.7) {
        const b = show.clamp((out - 0.7) / 0.4)
        draw.label(ctx, 'SIGNAL LOST', H.x + H.w / 2, H.y + 138, { size: 22, align: 'center', color: P.sky, weight: 'm', ls: 0.25, alpha: b })
        draw.label(ctx, 'ARCHIVE ENDS · 2023', H.x + H.w / 2, H.y + 166, { size: 13, align: 'center', color: P.blueMid, ls: 0.3, alpha: b })
      }
    }

    // ---- Void's monitor
    const V = VOID
    const waiting = t < show.at('void-on') + 0.2
    const proc = show.line('proc')
    if (waiting || t >= proc.t0 - 0.1) {
      // the dot sandglass
      const cx = waiting ? V.x + V.w / 2 : V.x + 60, cy = waiting ? V.y + 112 : V.y + 70, s = waiting ? 1 : 0.6
      const a = waiting ? 1 - show.clamp((show.since('void-on') - 0) / 0.2) : show.clamp((t - proc.t0 + 0.1) / 0.3)
      const fall = (t * 0.35) % 1
      for (let row = 0; row < 7; row++) {
        const n = 7 - row
        for (let k = 0; k < n; k++) {
          const x = cx + (k - (n - 1) / 2) * 7 * s
          draw.dot(ctx, x, cy - (row + 1) * 7 * s, 1.6 * s, P.white, (row / 7 < 1 - fall ? 0.85 : 0.15) * a)
          draw.dot(ctx, x, cy + (row + 1) * 7 * s, 1.6 * s, P.white, ((6 - row) / 7 < fall ? 0.85 : 0.15) * a)
        }
      }
      draw.dot(ctx, cx, cy, 1.6 * s, P.white, a)
      if (waiting) {
        const dots = '.'.repeat(1 + (Math.floor(t * 2) % 3))
        draw.label(ctx, 'CONNECTING' + dots, V.x + V.w / 2 - 70, V.y + 200, { size: 18, color: P.white, ls: 0.25, alpha: a })
        draw.label(ctx, 'DECELERATED CLOCK', V.x + V.w / 2, V.y + 226, { size: 12, align: 'center', color: P.blueMid, ls: 0.3, alpha: a })
        draw.label(ctx, 'VOID · BUILT BY CAMERON', V.x + V.w / 2, V.y + 248, { size: 11, align: 'center', color: P.blueMid, ls: 0.3, alpha: 0.8 * a })
      }
    }

    // the latency readout, and the RE: tag on each late reply
    if (!waiting) {
      draw.label(ctx, 'LATENCY · ONE QUESTION', V.x + 2, V.y + V.h + 36, { size: 12, color: P.blueMid, ls: 0.22, alpha: 0.9 })
      for (const [id, qn] of Object.entries(REPLIES)) {
        const L = show.line(id)
        const u = t - L.t0
        const pending = id === 'proc'
        if (u < -0.15 || (!pending && t > L.t1 + 0.9)) continue
        const a = show.clamp((u + 0.15) / 0.2) * (pending ? 1 : show.clamp((L.t1 + 0.9 - t) / 0.3))
        const q = QUESTIONS[qn - 1][1].toUpperCase()
        const x = V.x + 16, y = V.y + 14
        const head = pending ? `RE: Q${qn} · PENDING` : `RE: Q${qn}`
        const w = Math.max(draw.labelWidth(ctx, head, { size: 15, ls: 0.2 }), draw.labelWidth(ctx, q, { size: 12, ls: 0.15 })) + 24
        const bx = pending ? x + 92 : x
        draw.box(ctx, bx, y, w, 50, { color: P.amber, cut: 5, width: 1.2, fillAlpha: 0.88 * a, alpha: a })
        draw.label(ctx, head, bx + 12, y + 21, { size: 15, color: P.amber, weight: 'm', ls: 0.2, alpha: a })
        draw.label(ctx, q, bx + 12, y + 41, { size: 12, color: P.white, ls: 0.15, alpha: 0.9 * a })
      }
    }
  },
}
