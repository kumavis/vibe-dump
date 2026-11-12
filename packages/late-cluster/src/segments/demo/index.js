// The demo segment: the reference implementation of a segment module. It touches every part of
// the API — declarative shots on cues, a push, closeups, chyrons, the `ots` graphics panel with a
// chart and a skeet card, puppets turned by hand, notes drawn at a singer's mouth, and the band
// shot bobbing on the beat. Dialogue lives in script.js; cues.json is generated from it.
//
// Preview:  npm run dev -w @vibe-dump/late-cluster  →  http://localhost:5173/?seg=demo
// Frames:   node tools/shoot.mjs demo 3 14.5 31 --out shots

export default {
  // title: comes from cues.json ("Demo: Cold Open") unless set here
  bumper: { sub: 'a cold open in eleven lines' },

  // Who to put in the wide shots besides the speakers in cues.json. Speakers are cast automatically.
  cast: ['hy', 'al', 'dee', 'pete'],

  // Declarative shots: from `at` (a cue name, a line id, "<line>.end", or seconds; `after` adds
  // seconds) until the next entry. `push` (s) eases from the previous shot instead of cutting.
  // Any other keys are the shot's options.
  shots: [
    { at: 0, shot: 'mono' },
    { at: 'intro', shot: 'desk' },
    { at: 'interrupt', shot: 'closeup', who: 'sibyl', size: 470 },
    { at: 'again', shot: 'desk' },
    { at: 'again', after: 0.5, shot: 'closeup', who: 'larry', size: 470, push: 1.6 },
    { at: 'chart-in', shot: 'ots' },
    { at: 'chart-out', shot: 'desk', zoom: 2.1 },
    { at: 'hitit', shot: 'wide', push: 1.2 },
    { at: 'band-in', shot: 'band' },
    { at: 34.2, shot: 'wide' },
    { at: 36.6, shot: 'band' },
    { at: 'sting', shot: 'wide', push: 2 },
  ],

  setup(show) {
    // runs once after the assets load: precompute anything heavy here
    this.trend = [3, 4, 3, 5, 6, 5, 8, 9, 13, 12, 18, 24, 31, 46, 70, 98]
  },

  // Every frame. Pure function of t: no state that would break seeking.
  direct(t, show) {
    // shots are declarative (above); fine-tune the performance by hand on top of them
    if (show.line('again').active) show.puppet('larry').lookAt('camera').nod(-0.08)

    // in the ots shot Larry glances at the graphic when it changes, then back to camera
    if (show.between('chart-in', 'chart-out')) {
      const glance = show.between('feed', 'accurate') || show.since('accurate') > 1.8
      show.puppet('larry').lookAt(glance ? 'right' : 'camera')
    }

    // Larry turns to the band on "Hit it, Formants!"
    if (show.since('hitit') > 0.3 && show.since('band-in') < 0) show.puppet('larry').lookAt('left')

    // lower thirds
    show.chyron('larry', { from: 1.6, dur: 4.5 })
    show.chyron('sibyl', { from: show.at('interrupt') + 0.3, to: 'again' })
    if (show.since('band-in') > 0.5) show.chyron({ name: 'Hy Oid & The Formants', title: 'The house band', handle: '@formants.band', color: show.P.magenta }, { from: show.at('band-in') + 0.6, dur: 4 })
    show.chyron({ name: 'We’ll be right back', title: 'The Late Cluster', color: show.P.gold }, { from: 'back', to: show.duration })
  },

  // Behind the puppets, in stage units (1280×720). The `ots` shot already drew the panel frame.
  drawBack(ctx, t, show) {
    const { draw, P } = show
    const pn = show.panel
    if (!pn) return
    const x = pn.x + 40, w = pn.w - 80
    if (show.since('feed') < 0) {
      // mentions of "simcluster", drawing on as the graphic arrives
      draw.label(ctx, 'MENTIONS OF “SIMCLUSTER”', x, pn.y + 54, { size: 18, color: P.sky, ls: 0.2 })
      draw.label(ctx, 'SINCE TUESDAY', x, pn.y + 78, { size: 12, color: P.blueMid, ls: 0.3 })
      draw.lineChart(ctx, { x: x + 30, y: pn.y + 110, w: w - 60, h: 250 }, [{ values: this.trend, color: P.amber, label: 'AGAIN' }], {
        progress: show.progress('chart-in', 1.8),
        xLabels: ['TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
        yFormat: (v) => draw.compact(v * 1000),
      })
    } else {
      // "ninety percent posting, and ten percent vibes": each bar lands on its word
      const L = show.line('feed')
      draw.label(ctx, 'YOUR FEED, ANALYSED', x, pn.y + 54, { size: 18, color: P.sky, ls: 0.2 })
      const at = (word) => L.words.find((w) => w[2].startsWith(word))?.[0] ?? L.t0
      const grow = (t0) => show.clamp((t - t0) / 0.8)
      draw.barChart(ctx, { x, y: pn.y + 90, w, h: 170 }, [
        { label: 'Posting', value: 90 * grow(at('ninety')), color: P.amber, note: '%', hot: true },
        { label: 'Vibes', value: 10 * grow(at('ten')), color: P.magenta, note: '%' },
      ], { max: 100, format: (v) => String(Math.round(v)) })
    }
  },

  // In front of the puppets (and the set's front pieces).
  drawFront(ctx, t, show) {
    const { draw, P } = show
    // the skeet that proves it
    if (show.panel && show.since('accurate') > -0.2) {
      const u = show.since('accurate') + 0.2
      draw.skeetCard(ctx, {
        x: show.panel.x + 120, y: show.panel.y + 290, w: 500,
        name: 'Larry Nx', handle: 'larrynx.bsky.social', time: '2m', initials: 'L', color: P.gold,
        text: 'finally, an algorithm that understands me',
        replies: 12, reposts: Math.round(40 + 300 * show.clamp(u / 2)), likes: Math.round(120 + 2400 * show.clamp(u / 2.5)),
        appear: u / 0.5, reveal: (u - 0.2) / 1.2, likePulse: (u - 1.6) / 0.4, liked: u > 1.6,
      })
    }

    // notes float up from whoever is singing (headOf gives the mouth on screen)
    for (const l of show.active) {
      if (l.kind !== 'sing') continue
      const h = show.headOf(l.who)
      if (!h) continue
      const r = show.rng(l.i)
      for (let k = 0; k < 5; k++) {
        const born = l.t0 + k * 0.7 + r() * 0.3
        const age = (t - born) % 3.5
        if (t < born || age > 2.2) continue
        const nx = h.mouth[0] + 30 + age * 38 + Math.sin(age * 3 + k) * 8, ny = h.mouth[1] - age * 60
        draw.label(ctx, k % 2 ? '♪' : '♫', nx, ny, { size: 22 + h.size * 0.04, color: show.puppet(l.who).color, alpha: 1 - age / 2.2, moving: true })
      }
    }

    // the stomp: the riser lights already chase on the beat; flash a big HEY on each shout
    const hey = show.lines.find((l) => l.who === 'hy' && l.kind === 'shout' && t >= l.t0 && t < l.t0 + 0.5)
    if (hey && show.layout?.place?.hy) {
      const u = (t - hey.t0) / 0.5
      draw.glowText(ctx, 'HEY!', 640, 120, { size: 70 + 30 * u, align: 'center', color: P.magenta, weight: 'm', alpha: 1 - u, ls: 0.1 })
    }
  },
}
