// (F7b) A fortified Skirmish battle played here at the table, for the checks
// that read what the player sees of heights (sim/hud-check.mjs's tooltips,
// sim/input-check.mjs's see-through and LOS ray): a hotseat battle on the
// `fortified` set, started from the title's button and the battle-setup
// panel as a player starts one (?terrain=fortified the panel's default),
// both seats' deployments ended as the autoload placed them (each side's own
// rampart holding some of its units, DESIGN §4.2.4's works), then driven
// phase by phase with the ?debug block's buttons (endPhase), its pointer
// moved by Playwright over what it wants to hover.
//
// What it finds is read off the match through the Session's preview (the
// dice locked: core's own queries, sightInfo among them), never guessed:
//   climbs(seat)  each unit of `seat` on a deck whose move plan climbs one of
//                 the ladders down (its prev chain steps from the top to the
//                 foot): { u, foot, top, h, ladder }
//   shots(seat)   each pair of a unit of `seat` standing on the ground with
//                 a ranged weapon and an enemy on a deck it sees past a
//                 parapet (sightInfo: visible, a parapet among its
//                 obscurers): { s, e, info }
// and the page: tip() the tooltip's text as shown ('' hidden) and its LOS
// block's verdict class, beams() the LOS rays drawn (view/overlay.js's los:
// how many, their colour), faded() how many meshes are drawn see-through
// (view/terrain.js's seeThrough: their material's userData.seeThrough),
// xrays() the rings drawn through what hides them (view/units.js's xray),
// and memory() renderer.info.memory with the scene's own objects.
//
// Library only (no CLI). Seed 3 with dice 1 by default: its works stand on
// both sides, the Bushtails win the roll-off, and seat 0's trebuchet (36",
// on the ground) sees the Coil's units on their rampart past its parapets.
import { IDLE_MS } from './chromium.mjs'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export async function fortScene(page, url, { seed = 3, dice = 1 } = {}) {
  const ev = (fn, arg) => page.evaluate(fn, arg)
  await page.goto(`${url}/?debug&lowfi&seed=${seed}&dice=${dice}&terrain=fortified`, { timeout: IDLE_MS })
  await page.waitForSelector('#title:not(.hidden)', { timeout: IDLE_MS })
  await page.click('[data-mode="hotseat"]')
  await page.click('#setupStart')
  // both deployments ended as placed
  for (let k = 0; k < 2; k++) {
    await page.waitForFunction(() => window.__ts?.session?.G?.pending?.k === 'deploy' && window.__ts.player.idle, null, { timeout: IDLE_MS })
    await ev(() => window.__ts.endPhase())
  }
  const terrain = await ev(() => window.__ts.G.setup.terrain)
  if (terrain !== 'fortified') throw new Error(`the battle is fought on ${terrain}, not fortified`)

  // the seat whose phase it is here, and the phase (once idle on it)
  const at = async () => {
    await page.waitForFunction(() => window.__ts.phaseResolve, null, { timeout: IDLE_MS })
    return ev(() => ({ seat: window.__ts.session.decisionFor(), phase: window.__ts.S.phase, round: window.__ts.S.round }))
  }
  // End pressed until `seat`'s `phase` (or throws after a round and more)
  const until = async (seat, phase) => {
    for (let n = 0; n < 24; n++) {
      const s = await at()
      if (s.seat === seat && s.phase === phase) return s
      await ev(() => window.__ts.select(null))
      await ev(() => window.__ts.endPhase())
    }
    throw new Error(`never reached seat ${seat}'s ${phase} phase`)
  }
  // the camera put at `pos` looking at `target` ([x, y, z] each), as the
  // controls take it (they keep it within their angles and distances), and
  // held there: a glide still under way (the rig's, as a phase begins)
  // writes the camera each frame until it ends, so the pose is set again
  // until three frames drawn leave it where it was put
  const pose = async (pos, target) => {
    for (let k = 0; k < 60; k++) {
      const held = await ev(([pos, target]) => new Promise((r) => {
        const { camera, controls } = window.__ts
        camera.position.set(...pos)
        controls.target.set(...target)
        controls.update()
        const p0 = camera.position.clone(), t0 = controls.target.clone()
        let n = 3
        const f = () => (--n ? requestAnimationFrame(f) : r(camera.position.distanceTo(p0) < 1e-3 && controls.target.distanceTo(t0) < 1e-3))
        requestAnimationFrame(f)
      }), [pos, target])
      if (held) return
      await sleep(500)
    }
    throw new Error('the camera never held a pose (a glide that never ends)')
  }
  // a point of the table on the page, in CSS px
  const screen = (x, y, z) => ev(([x, y, z]) => window.__ts.screen(x, y, z), [x, y, z])
  // (moved there in two steps, the last a few pixels: a pointermove lands
  // on the table's canvas whatever came before; `on` what the page has
  // under the point, which must be the canvas)
  const hover = async (x, y, z) => {
    const [px, py] = await screen(x, y, z)
    await page.mouse.move(px + 4, py + 3)
    await page.mouse.move(px, py, { steps: 2 })
    await sleep(350)
    const on = await ev(([x, y]) => document.elementFromPoint(x, y)?.tagName ?? 'nothing', [px, py])
    return { x: px, y: py, on }
  }
  const away = async () => {
    await page.mouse.move(4, 4)
    await sleep(200)
  }
  const tip = () => ev(() => {
    const t = document.querySelector('#tooltip')
    if (t.style.display !== 'block') return { text: '', los: null }
    const los = t.querySelector('.los')
    return { text: t.innerText, los: los ? [...los.classList].find((k) => k.startsWith('los-'))?.slice(4) ?? null : null }
  })
  const beams = () => ev(() => {
    let n = 0, color = null
    window.__ts.scenery.scene.traverse((o) => {
      if (!o.userData.losRay || !o.visible || o.material.depthFunc !== 3) return
      n++
      color = `#${o.material.color.getHexString()}`
    })
    return { n, color }
  })
  // (after two frames drawn and 200 ms: the see-through is worked out in a
  // frame, at most every 150 ms (view/index.js's SEE_EVERY), and on a busy
  // machine a frame can take longer than any fixed wait)
  const faded = () => ev(async () => {
    const t0 = performance.now()
    for (let k = 0; k < 2 || performance.now() - t0 < 200; k++) await new Promise((r) => requestAnimationFrame(r))
    let n = 0
    window.__ts.scenery.scene.traverse((o) => o.isMesh && o.visible && o.material?.userData?.seeThrough && n++)
    return n
  })
  // (a ring's see-through copy: GreaterDepth, 6 in three.js's constants)
  const xrays = () => ev(() => {
    let n = 0
    window.__ts.scenery.scene.traverse((o) => o.isMesh && o.visible && !o.userData.losRay && o.material?.depthFunc === 6 && o.material.visible && n++)
    return n
  })
  const memory = () => ev(() => ({ ...window.__ts.renderer.info.memory, scene: window.__ts.scenery.scene.children.length }))
  const select = (id) => ev((id) => window.__ts.select(id === null ? null : window.__ts.G.units.find((u) => u.id === id)), id)

  const climbs = (seat) => ev((seat) => window.__ts.session.preview((G, q) => {
    const out = [], nav = G.nav
    for (const u of G.units) {
      if (u.side !== seat || !q.alive(u) || q.floorAt(G, u.pos.x, u.pos.z) <= 0.4) continue
      const plan = q.movePlan(G, u, 0)
      for (const c of G.terrain.chunks) {
        if (!c.alive || !c.link) continue
        const f = nav.index(c.link.foot.x, c.link.foot.z), t = nav.index(c.link.top.x, c.link.top.z)
        if (plan.res.prev[f] === t && isFinite(plan.res.dist[f])) out.push({ u: u.id, foot: c.link.foot, top: c.link.top, h: c.link.h, ladder: c.id, at: plan.res.dist[f], max: plan.max })
      }
    }
    return out
  }), seat)
  const shots = (seat) => ev((seat) => window.__ts.session.preview((G, q) => {
    const out = []
    const parapet = (id) => G.terrain.chunks.find((c) => c.id === id)?.kind === 'parapet'
    for (const s of G.units) {
      if (s.side !== seat || !q.alive(s) || !s.t.ranged || q.floorAt(G, s.pos.x, s.pos.z) > 0.4 || !q.canShoot(G, s)) continue
      for (const e of G.units) {
        if (e.side === seat || !q.alive(e) || q.floorAt(G, e.pos.x, e.pos.z) <= 0.4) continue
        const info = q.sightInfo(G, s, e)
        if (info.ok && info.obscure.some(parapet)) out.push({ s: s.id, e: e.id, range: q.shotInfo(G, s, e).ok, y: q.floorAt(G, e.pos.x, e.pos.z), x: e.pos.x, z: e.pos.z, info })
      }
    }
    return out
  }), seat)
  return { ev, at, until, pose, screen, hover, away, tip, beams, faded, xrays, memory, select, climbs, shots }
}
