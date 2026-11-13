// kit-tour: a silent tour of the shared kit for segment authors (not in the rundown).
// Open /?seg=kit-tour&autostart=1&mute=1, or shoot it: node tools/shoot.mjs kit-tour 2 6 10 …
// Every 4 seconds a new shot or prop; read the code for how each is called.

const T = (n) => n * 4 // the tour's beats

export default {
  title: 'Kit tour',
  duration: 60,
  bumper: false,
  cast: ['samantha', 'norvid', 'abel', 'borjev', 'eppy', 'bot', 'sibyl', 'hy', 'al', 'dee', 'pete'],
  guests: ['norvid', 'abel', 'samantha', 'borjev'],
  disclaimer: { text: 'Guests are puppets playing posting personas. No real accounts were harmed.', from: 0, dur: 5 },
  // the episode-long runner: n = from + bumps passed
  built: { from: 3, bumps: [T(1) + 1, T(5) + 1, T(7) + 2] },
  set: { crow: 'circling' },

  shots: [
    { at: 0, shot: 'ots', who: 'samantha', pip: 'larry' },
    { at: T(1), shot: 'remote', guest: 'samantha', label: 'Remote guest · demo feed' },
    { at: T(2), shot: 'remote2', guests: ['norvid', 'abel'] },
    { at: T(3), shot: 'podium' },
    { at: T(4), shot: 'deskWith', with: 'bot' },
    { at: T(5), shot: 'sports', ticker: 'Top Chicken retains crown · Limbo bar lowered again · Seal still balancing' },
    { at: T(6), shot: 'stage' },
    { at: T(7), shot: 'panel', guests: ['norvid', 'abel'], pop: 'borjev' },
    { at: T(8), shot: 'guest', guest: 'norvid' },
    { at: T(9), shot: 'desk' },
    { at: T(11), shot: 'wide' },
    { at: T(12), shot: 'closeup', who: 'abel' },
  ],

  setup(show) {
    const { draw } = show
    this.map = draw.blobRegion('weather-land', { x: 620, y: 110, w: 520, h: 360 })
  },

  direct(t, show) {
    // panel: BorJev pops up from behind the couch; Abel unveils the contraption
    if (t >= T(7) && t < T(8)) {
      show.shot('panel', { guests: ['norvid', 'abel'], pop: 'borjev', popUp: show.tween(t, T(7) + 0.5, T(7) + 1.2, 0, 1, 'outBack') })
      show.puppet('abel').prop({ unveil: show.progress(T(7) + 1.5, 1.2) })
    }
    // the hologram effect: a guest flickers out mid-sentence
    if (t >= T(8) && t < T(9)) show.puppet('norvid').fx('hologram', { amount: show.tween(t, T(8) + 2.6, T(8) + 3.4, 1, 0), flicker: 0.8 })
    // shake and scale gags
    if (t >= T(9) && t < T(11)) {
      show.set.eKey = true
      show.set.crow = 'perched-desk'
      if (t > T(10) + 2) show.puppet('larry').shake(5).scaleTo(show.tween(t, T(10) + 2, T(10) + 3, 1, 1.15, 'outBack'))
    }
    if (t >= T(11) && t < T(12)) show.set.crow = 'circling'
    // the line-up: free placement with show.camera + puppet().place (head sizes side by side)
    if (t >= T(13)) {
      const ids = ['larry', 'eppy', 'bot', 'samantha', 'norvid', 'abel', 'borjev']
      show.shot('wide', { band: false }).camera({ x: 1000, y: 640, zoom: 0.92 })
      ids.forEach((id, i) => show.puppet(id).place({ x: 580 + i * 140, y: 600, scale: 1, look: 'camera', floor: 960, z: 5, seat: null, instrument: null, clip: null, fx: null }))
      show.set.desk = show.set.chair = show.set.couch = false
    }
    // chyrons: guests get the PUPPET · PARODY tag automatically
    show.chyron('samantha', { from: 0.6, dur: 3 })
    show.chyron({ id: 'samantha', title: 'Remote guest · demo' }, { from: T(1) + 0.4, dur: 3 })
    show.chyron('norvid', { from: T(8) + 0.3, dur: 3 })
    show.chyron('eppy', { from: T(5) + 0.4, dur: 3 })
  },

  drawBack(ctx, t, show) {
    const { draw, P } = show
    const pn = show.panel
    if (t < T(1) && pn) {
      // the weather map
      draw.region(ctx, this.map, { color: P.sky })
      draw.isobar(ctx, 860, 290, 120, { label: '1012', seed: 2 })
      draw.isobar(ctx, 860, 290, 70, { seed: 5 })
      draw.front(ctx, [[660, 200], [760, 250], [860, 230], [980, 300], [1100, 280]], { kind: 'cold', progress: show.progress(0.5, 2) })
      draw.front(ctx, [[700, 420], [820, 380], [940, 400], [1080, 360]], { kind: 'warm', progress: show.progress(1, 2) })
      draw.sun(ctx, 720, 150, 22, t)
      draw.rain(ctx, 1000, 180, 1, t)
      draw.storm(ctx, 1100, 420, 0.9, t)
      draw.snow(ctx, 760, 330, 0.8, t)
    }
    if (t >= T(5) && t < T(6) && pn) {
      draw.label(ctx, 'TOP CHICKEN STANDINGS', pn.x + 30, pn.y + 44, { size: 18, color: P.coral, ls: 0.2 })
      const tops = draw.podium3(ctx, pn.x + pn.w / 2 - 60, pn.y + pn.h - 30, 360, { labels: ['1', '2', '3'], rise: show.progress(T(5) + 0.3, 1) })
      draw.chicken(ctx, tops[0][0], tops[0][1] - 40, { scale: 0.9, crown: true, bob: t * 2 })
      draw.seal(ctx, tops[1][0], tops[1][1] - 22, { scale: 0.6, ball: true, t })
      draw.gator(ctx, tops[2][0] + 10, tops[2][1] - 14, { scale: 0.45, jaw: 0.5 + 0.5 * Math.sin(t * 3) })
      draw.splitFlap(ctx, pn.x + pn.w - 250, pn.y + 120, 'FINAL', { age: show.since(T(5)), size: 30 })
    }
  },

  drawFront(ctx, t, show) {
    const { draw, P } = show
    if (t >= T(6) && t < T(7)) draw.glowText(ctx, 'SIM CLUSTER, SIM CLUSTER', 640, 110, { size: 42, align: 'center', color: P.magenta, weight: 'm', ls: 0.1 })
    if (t >= T(2) && t < T(3)) draw.stamp(ctx, 640, 470, 'CLAIM', { age: show.since(T(2) + 1.2), rot: -0.15 })
    if (t >= T(3) && t < T(4)) {
      const h = show.headOf('sibyl')
      if (h) draw.speechBubble(ctx, h.mouth[0] + 10, h.mouth[1] - 20, 'Please remain\nclustered.', { appear: show.progress(T(3) + 0.5, 0.4), side: 1 })
    }
    if (t >= T(9) && t < T(11)) {
      // the props board
      const u = show.since(T(9))
      draw.box(ctx, 40, 40, 560, 380, { color: P.blueMid, cut: 10, fillAlpha: 0.85 })
      draw.keycap(ctx, 110, 110, { label: 'E', pressed: (Math.sin(t * 4) + 1) / 2, glow: 0.6 })
      draw.label(ctx, 'PRESS E TO LEAVE', 170, 118, { size: 16, color: P.cyan, ls: 0.2 })
      draw.crow(ctx, 470, 110, { scale: 1, flap: (t * 2) % 1 })
      draw.elephant(ctx, 120, 290, { scale: 0.8, trunk: Math.sin(t * 2) })
      draw.book(ctx, 270, 250, { scale: 0.9, open: (Math.sin(t) + 1) / 2, title: 'List of claims' })
      draw.limboBar(ctx, 470, 370, { w: 180, height: 70 + 30 * Math.sin(t), wobble: Math.sin(t * 6) })
      draw.crown(ctx, 380, 210, 1)
      draw.confetti(ctx, 470, 250, u % 1.6, { seed: Math.floor(u / 1.6) })
      draw.ticker(ctx, 440, 'Breaking: the simcluster is trending again', t, { tag: 'Live' })
    }
    if (t >= T(11) && t < T(12)) draw.creditsRoll(ctx, ['The Late Cluster', ['Host', 'Larry Nx'], ['Weather', 'Samantha'], { head: 'Good night' }], show.since(T(11)), { rect: { x: 400, y: 120, w: 480, h: 200 }, speed: 60 })
  },
}
