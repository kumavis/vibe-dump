// screenshots of the battlefield as it is (no tracked file touched)
import { createRequire } from 'node:module'
const { chromium } = createRequire('/home/user/vibe-dump-wt/world/packages/tails-and-scales/package.json')('playwright')
import { startStaticServer } from '/home/user/vibe-dump-wt/world/scripts/static-server.mjs'
import { writeFileSync } from 'node:fs'
const OUT = '/tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/world/shots'
const DIST = process.env.DIST || '/home/user/vibe-dump-wt/world/packages/tails-and-scales/dist'
const only = process.argv.slice(2)
const PREFIX = process.env.PREFIX || 'now', EXTRA = process.env.EXTRA ? '&' + process.env.EXTRA : ''
const srv = await startStaticServer(DIST)
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
const T = 180000
async function open(q, vp = { width: 1280, height: 800 }) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1 })
  const page = await ctx.newPage(); page.setDefaultTimeout(T)
  page.on('pageerror', (e) => console.log('pageerror', e.message))
  await page.goto(`${srv.url}/?debug&${q}${EXTRA}`, { timeout: T })
  await page.waitForFunction(() => window.__ts, null, { timeout: T })
  return { ctx, page }
}
const wait = (p, ms) => p.waitForTimeout(ms)
// deploy done: watch mode, AI both seats, wait until battle stage and idle
async function battle(page) {
  await page.evaluate(() => window.__ts.start('watch'))
  await page.waitForFunction(() => { const s = window.__ts.S; return s.stage === 'battle' && s.round >= 1 && window.__ts.session?.G?.pending?.k !== 'deploy' }, null, { timeout: T })
  await wait(page, 4500)
  await page.evaluate(() => { window.__ts.clock.speed = 0 })
  await wait(page, 500)
}
// default battle view: the rig's first view
async function defaultView(page) {
  await page.evaluate(() => { const r = window.__ts; r.S.titleSpin = false })
}
// low close cinematic: rendered by hand from a pose (no HUD), as terrain-shots does
async function cine(page, name, f = 1, pose = null) {
  const url = await page.evaluate(([f, pose]) => {
    const r = window.__ts, b = r.board, c = r.camera
    const W = b?.W ?? 40, H = b?.H ?? 28
    c.clearViewOffset(); c.fov = 30; c.aspect = innerWidth / innerHeight; c.updateProjectionMatrix()
    if (pose) { c.position.set(...pose.pos); c.lookAt(...pose.at) }
    else { c.position.set(-W * 0.36 * f, 2.4 * f, H * 0.40 * f); c.lookAt(W * 0.06, 0.6, -H * 0.05) }
    c.updateMatrixWorld()
    r.renderer.render(r.scenery.scene, c)
    const i = r.renderer.info.render
    window.__last = { calls: i.calls, tris: i.triangles }
    return r.renderer.domElement.toDataURL('image/png')
  }, [f, pose])
  writeFileSync(`${OUT}/${PREFIX}-${name}.png`, Buffer.from(url.split(',')[1], 'base64')); console.log('shot', name, JSON.stringify(await page.evaluate(() => window.__last)))
}
const shot = async (page, name) => { await page.screenshot({ path: `${OUT}/${PREFIX}-${name}.png` }); console.log('shot', name) }
const info = async (page, name) => {
  const s = await page.evaluate(() => { const r = window.__ts.renderer.info; return { calls: r.render.calls, tris: r.render.triangles, geo: r.memory.geometries, tex: r.memory.textures, far: window.__ts.camera.far, pos: window.__ts.camera.position.toArray().map((v) => +v.toFixed(1)), tgt: window.__ts.controls.target.toArray().map((v) => +v.toFixed(1)), board: window.__ts.board } })
  console.log('info', name, JSON.stringify(s))
}
const window_W = (q) => (q.includes('grand') ? 80 : q.includes('field') ? 60 : 40)
const want = (n) => !only.length || only.includes(n)
try {
  if (want('title')) {
    const { ctx, page } = await open('seed=1')
    await wait(page, 2500); await shot(page, 'title'); await info(page, 'title')
    await cine(page, 'title-low'); await ctx.close()
  }
  const cases = [
    ['skirm-classic-s1', 'seed=1&dice=1&mission=classic&terrain=classic'],
    ['skirm-classic-s411', 'seed=411&dice=1&mission=classic&terrain=classic'],
    ['skirm-fort-s4', 'seed=4&dice=1&mission=classic&terrain=fortified'],
    ['skirm-fort-s30', 'seed=30&dice=1&mission=classic&terrain=fortified'],
    ['field-open-s7', 'seed=7&dice=1&mission=field&terrain=open'],
    ['grand-fort-s5', 'seed=5&dice=1&mission=grand&terrain=fortified'],
  ]
  for (const [n, q] of cases) {
    if (!want(n)) continue
    const { ctx, page } = await open(q)
    await battle(page); await defaultView(page); await shot(page, n); await info(page, n)
    await cine(page, n + '-low'); await cine(page, n + '-high', 1, { pos: [0, (window_W(q)) * 0.9, (window_W(q)) * 0.55], at: [0, 0, 0] })
    await ctx.close()
  }
  for (const [n, q, R] of [['mid', 'seed=4&dice=3&mission=classic&terrain=fortified', 75], ['mid-powder', 'seed=3&dice=2&mission=powder&terrain=powder', 60]]) {
    if (!want(n)) continue
    const { ctx, page } = await open(q)
    await page.evaluate(() => window.__ts.start('watch'))
    await page.waitForFunction(() => window.__ts.S.stage === 'battle', null, { timeout: T })
    await page.evaluate(() => { window.__ts.clock.speed = 8 })
    const t0 = Date.now()
    await wait(page, R * 1000)
    console.log(n, 'mirror', await page.evaluate(() => { const m = window.__ts.player.mirror; return JSON.stringify({ turn: m?.turn ?? m?.round, dead: (m?.chunks ?? []).filter?.((c) => c && c.alive === false).length }) }))
    await page.evaluate(() => { window.__ts.clock.speed = 1 })
    await wait(page, 1500)
    await shot(page, n + '-battle'); await info(page, n)
    const W = q.includes('powder') ? 80 : 40
    await cine(page, n + '-battle-low', W === 80 ? 0.45 : 0.75)
    await ctx.close()
  }
  for (const n of only.filter((x) => x.startsWith('measure:'))) {
    const [, m, t, sd] = n.split(':'), q = `seed=${sd}&dice=1&mission=${m}&terrain=${t}`
    const { ctx, page } = await open(q)
    await battle(page)
    console.log(n, JSON.stringify(await page.evaluate(() => {
      // what the dressing draws (its meshes, instanced counted whole) and
      // what it put away (the wooden table's meshes, hidden)
      const tri = (m) => ((m.geometry.index ? m.geometry.index.count : m.geometry.attributes.position.count) / 3) * (m.isInstancedMesh ? m.count : 1)
      let calls = 0, tris = 0, hidden = 0, hiddenTris = 0
      const seen = new Set()
      window.__ts.scenery.scene.traverse((o) => {
        let d = false
        for (let p = o; p; p = p.parent) if (p.userData.dressing) d = true
        if (!o.isMesh) return
        if (d && o.visible && (!o.isInstancedMesh || o.count > 0)) { calls++; tris += tri(o) }
      })
      return { calls, tris: Math.round(tris), theme: window.__ts.view?.dressingPlan?.()?.theme }
    })))
    await ctx.close()
  }
  if (want('lowfi')) {
    const { ctx, page } = await open('seed=411&dice=1&mission=classic&terrain=classic&lowfi')
    await battle(page); await shot(page, 'lowfi-battle'); await ctx.close()
  }
  if (want('phone')) {
    const { ctx, page } = await open('seed=1&dice=1&mission=classic&terrain=classic', { width: 390, height: 844 })
    await wait(page, 2000); await shot(page, 'phone-title')
    await battle(page); await shot(page, 'phone-battle'); await ctx.close()
  }
} finally { await browser.close(); srv.close() }
