// XR smoke test with an emulated Meta Quest 3 (IWER, injected before any app
// code with addInitScript). Run by hand, never in CI:
//
//   npm run build -w @vibe-dump/merge-meadow       # or point --url at a dev server
//   node test/xr.mjs [--url <page url>] [--out <dir, default $TMPDIR/merge-meadow-xr>] [--chromium <path>]
//
// Without --url it serves this package's dist/ on a free port and opens a new,
// offline world (#sync=none). It needs the page to expose globalThis.__mm with
// { renderer (or scene.renderer), rig, world, reconciler, interaction }, finds a
// grabbable entity and a mount by itself, and checks: the Enter-VR button shows
// only with an XR runtime and starts immersive-vr; trigger selects and grabs, a
// controller move drags and the release writes the transform; the left stick
// moves; the right stick snap-turns around the head; squeeze near a mount rides
// it and squeeze again gets off; ending the session restores the desktop eye.
// Prints a JSON report and exits 1 if any check failed.
import { createServer } from 'node:http'
import { readFile, mkdir, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { tmpdir } from 'node:os'
import * as THREE from 'three'

const here = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
const arg = (name, d) => { const i = process.argv.indexOf('--' + name); return i > 0 ? process.argv[i + 1] : d }
const OUT = path.resolve(arg('out', path.join(tmpdir(), 'merge-meadow-xr')))
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.wasm': 'application/wasm', '.json': 'application/json', '.svg': 'image/svg+xml', '.glb': 'model/gltf-binary', '.png': 'image/png', '.jpg': 'image/jpeg' }
function serve (root) {
  return new Promise((resolve) => {
    const s = createServer(async (q, r) => {
      let p = decodeURIComponent(q.url.split('?')[0].split('#')[0]); if (p.endsWith('/')) p += 'index.html'
      const f = path.join(root, path.normalize(p).replace(/^(\.\.[/\\])+/, ''))
      try { const b = await readFile(f); r.writeHead(200, { 'content-type': TYPES[path.extname(f)] ?? 'application/octet-stream' }); r.end(b) } catch { r.writeHead(404); r.end() }
    }).listen(0, '127.0.0.1', () => resolve(s))
  })
}

// The repo's Playwright may want a browser build this machine does not have;
// fall back to whatever Chromium is installed under /opt/pw-browsers.
async function launch (chromium) {
  const args = ['--enable-unsafe-swiftshader', '--use-angle=swiftshader']
  const exe = arg('chromium', process.env.CHROMIUM_PATH)
  if (exe) return chromium.launch({ executablePath: exe, args })
  try { return await chromium.launch({ args }) } catch (e) {
    const base = '/opt/pw-browsers'
    for (const d of (existsSync(base) ? await readdir(base) : []).filter((x) => /^chromium-\d+$/.test(x)).sort().reverse()) {
      for (const sub of ['chrome-linux64/chrome', 'chrome-linux/chrome']) {
        const p = path.join(base, d, sub)
        if (existsSync(p)) return chromium.launch({ executablePath: p, args })
      }
    }
    throw e
  }
}

const checks = []
const check = (name, ok, detail) => { checks.push({ name, ok: !!ok, ...(detail !== undefined ? { detail } : {}) }); return ok }
const v3 = (a) => new THREE.Vector3().fromArray(a)
const m4 = (a) => new THREE.Matrix4().fromArray(a)

async function main () {
  const { chromium } = await import('playwright')
  const IWER = await readFile(require.resolve('iwer/build/iwer.min.js'), 'utf8')
  let srv = null
  let url = arg('url')
  if (!url) {
    const dist = path.join(here, '..', 'dist')
    if (!existsSync(path.join(dist, 'index.html'))) throw new Error('no dist/: build the package first, or pass --url')
    srv = await serve(dist)
    url = `http://127.0.0.1:${srv.address().port}/#sync=none`
  }
  await mkdir(OUT, { recursive: true })
  const browser = await launch(chromium)
  const report = { url }
  try {
    // ---- without an XR runtime the button must stay hidden (the thumbnail rule)
    {
      const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
      await page.goto(url)
      await page.waitForFunction(() => globalThis.__mm?.renderer || globalThis.__mm?.scene?.renderer, null, { timeout: 60000 })
      await sleep(500)
      const r = await page.evaluate(() => ({ hasXr: 'xr' in navigator, hidden: [...document.querySelectorAll('.mm-vr-button')].every((b) => b.hidden) }))
      check('button hidden without an XR runtime', r.hidden, r)
      await page.close()
    }

    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } })
    await ctx.addInitScript({ content: IWER })
    await ctx.addInitScript(() => {
      const d = new globalThis.IWER.XRDevice(globalThis.IWER.metaQuest3)
      d.installRuntime({ forceInstall: true }); d.stereoEnabled = true
      globalThis.__xrdevice = d
    })
    const page = await ctx.newPage()
    const logs = []
    page.on('console', (m) => { if (m.type() === 'error') logs.push(m.text().slice(0, 300)) })
    page.on('pageerror', (e) => logs.push('pageerror: ' + e.message.slice(0, 300)))
    await page.goto(url)
    await page.waitForFunction(() => (globalThis.__mm?.renderer || globalThis.__mm?.scene?.renderer) && globalThis.__mm?.interaction && globalThis.__mm?.reconciler, null, { timeout: 60000 })
    // main.js keeps the makeScene() object on __mm.scene; the checks below want the renderer itself
    await page.evaluate(() => { const m = globalThis.__mm; if (!m.renderer) m.renderer = m.scene.renderer })
    await page.waitForFunction(() => [...document.querySelectorAll('.mm-vr-button')].some((b) => !b.hidden), null, { timeout: 10000 }).catch(() => {})
    const pre = await page.evaluate(async () => ({ vr: await navigator.xr.isSessionSupported('immersive-vr'), visible: [...document.querySelectorAll('.mm-vr-button')].some((b) => !b.hidden) }))
    check('immersive-vr supported under IWER and the button shows', pre.vr && pre.visible, pre)

    // ---- enter VR through our own button
    await page.click('.mm-vr-button:not([hidden])')
    const entered = await page.waitForFunction(() => __mm.renderer.xr.isPresenting, null, { timeout: 15000 }).then(() => true, () => false)
    check('session starts from the button', entered)
    if (!entered) throw new Error('no XR session')
    await sleep(800)
    report.session = await page.evaluate(() => {
      const s = __mm.renderer.xr.getSession()
      return { inputSources: [...s.inputSources].map((i) => `${i.handedness}:${i.targetRayMode}`), hands: __mm.rig.hands.map((h) => ({ connected: h.connected, handedness: h.handedness })), head: __mm.rig.head.position.toArray().map((v) => +v.toFixed(3)) }
    })
    check('both controllers connected', report.session.hands.every((h) => h.connected), report.session.hands)

    // ---- pick a target: the nearest pickable, preferably static, non-mount entity in front
    const scan = () => page.evaluate(() => {
      const { world, reconciler, rig } = __mm
      rig.root.updateMatrixWorld(true)
      const rows = []
      for (const e of world.entities.values()) {
        const o = reconciler.objectFor(e.id); if (!o || !reconciler.visualFor(e.id)) continue
        const b = reconciler.bounds(e.id)
        rows.push({ id: e.id, mount: !!e.c.mount, moves: !!e.c.body, dead: !!e.c.tags?.dead, local: !!e.local, m: o.matrixWorld.toArray(), h: b && !b.isEmpty() ? (b.max.y + b.min.y) / 2 : 0.5 })
      }
      return { rig: rig.root.matrixWorld.toArray(), rows }
    })
    const toLocal = (rigM, p) => p.clone().applyMatrix4(m4(rigM).invert())
    let s = await scan()
    const front = s.rows.filter((r) => !r.mount && !r.dead && !r.local).map((r) => ({ ...r, local: toLocal(s.rig, new THREE.Vector3().setFromMatrixPosition(m4(r.m))) }))
      // static things first: a wandering sheep can leave the ray between aim and trigger
      .filter((r) => r.local.z < -1).sort((a, b) => (a.moves - b.moves) || a.local.length() - b.local.length())
    const target = front[0]
    if (!check('an entity in front of the player to grab', target, s.rows.length)) throw new Error('nothing to grab')
    report.target = target.id

    // ---- aim the right controller at it and pull the trigger
    const ctl = new THREE.Vector3(0.2, 1.3, -0.3)
    const aimAt = target.local.clone().setY(target.local.y + target.h * Number(target.m[5] || 1))
    const q = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().lookAt(ctl, aimAt, new THREE.Vector3(0, 1, 0)))
    await page.evaluate(([p, qq]) => { const c = __xrdevice.controllers.right; c.position.set(...p); c.quaternion.set(...qq) }, [ctl.toArray(), q.toArray()])
    await sleep(400)
    await page.evaluate(() => __xrdevice.controllers.right.updateButtonValue('trigger', 1))
    await sleep(500)
    const sel = await page.evaluate(() => ({ selected: __mm.interaction.selected, grabbing: __mm.interaction.grabbing }))
    check('trigger selects and grabs the entity it points at', sel.selected === target.id && sel.grabbing === target.id, sel)
    const before = await page.evaluate((id) => { const o = __mm.reconciler.objectFor(id); return o.getWorldPosition(o.position.clone()).toArray() }, target.id)
    await page.evaluate(() => { const c = __xrdevice.controllers.right; c.position.set(c.position.x + 0.5, c.position.y, c.position.z) })
    await sleep(700)
    const during = await page.evaluate((id) => { const o = __mm.reconciler.objectFor(id); return o.getWorldPosition(o.position.clone()).toArray() }, target.id)
    await page.evaluate(() => __xrdevice.controllers.right.updateButtonValue('trigger', 0))
    await sleep(500)
    const after = await page.evaluate((id) => { const t = __mm.world.doc?.entities?.[id]?.components?.transform; return { doc: t ? [...t.p].map(Number) : null, grabbing: __mm.interaction.grabbing } }, target.id)
    const moved = v3(during).distanceTo(v3(before))
    check('dragging moves the entity with the controller (0.5 m)', moved > 0.3 && moved < 0.8, +moved.toFixed(3))
    check('release ends the grab and writes the transform', after.grabbing === null && after.doc && v3(after.doc).distanceTo(v3(during)) < 0.25, after)

    // ---- left stick: smooth move
    const r0 = await page.evaluate(() => __mm.rig.root.position.toArray())
    await page.evaluate(() => __xrdevice.controllers.left.updateAxes('thumbstick', 0, -1))
    await sleep(700)
    await page.evaluate(() => __xrdevice.controllers.left.updateAxes('thumbstick', 0, 0))
    const r1 = await page.evaluate(() => __mm.rig.root.position.toArray())
    check('left stick moves the rig', v3(r1).distanceTo(v3(r0)) > 0.5, +v3(r1).distanceTo(v3(r0)).toFixed(3))

    // ---- right stick: 30° snap turn that pivots around the head
    await page.evaluate(() => __xrdevice.position.set(0.4, 1.6, 0.2)) // stand off-centre in the room
    await sleep(300)
    const h0 = await page.evaluate(() => __mm.rig.head.getWorldPosition(__mm.rig.head.position.clone()).toArray())
    const y0 = await page.evaluate(() => __mm.rig.root.rotation.y)
    await page.evaluate(() => __xrdevice.controllers.right.updateAxes('thumbstick', 1, 0))
    await sleep(400)
    await page.evaluate(() => __xrdevice.controllers.right.updateAxes('thumbstick', 0, 0))
    await sleep(300)
    const h1 = await page.evaluate(() => __mm.rig.head.getWorldPosition(__mm.rig.head.position.clone()).toArray())
    const dy = (await page.evaluate(() => __mm.rig.root.rotation.y)) - y0
    const drift = Math.hypot(h1[0] - h0[0], h1[2] - h0[2])
    check('snap turn is 30° and keeps the head in place', Math.abs(Math.abs(dy) - Math.PI / 6) < 1e-3 && drift < 0.01, { yaw: +dy.toFixed(4), drift: +drift.toFixed(4) })

    // ---- squeeze near a mount: ride it, squeeze again: off
    s = await scan()
    const mount = s.rows.find((r) => r.mount && !r.dead)
    if (check('a mount exists', mount)) {
      // the horse is simulated and flees at up to 9 m/s: hold it still for the squeeze
      // (live.held, which the built-in steer/integrate respect) and stand next to where
      // it is NOW, not where the scan saw it
      await page.evaluate((id) => {
        const e = __mm.world.get(id); e.live.held = true
        const o = __mm.reconciler.objectFor(id); o.updateMatrixWorld(true)
        const p = o.getWorldPosition(o.position.clone())
        __mm.rig.teleport({ x: p.x + 0.8, y: 0, z: p.z })
      }, mount.id)
      await sleep(300)
      // hold each squeeze until the state flips: a stereo SwiftShader frame can outlast a
      // 250 ms press, and the pointer's edge flags are per frame
      await page.evaluate(() => __xrdevice.controllers.left.updateButtonValue('squeeze', 1))
      await page.waitForFunction(() => __mm.interaction.mounted != null, null, { timeout: 4000 }).catch(() => {})
      await page.evaluate(() => __xrdevice.controllers.left.updateButtonValue('squeeze', 0))
      await sleep(400)
      const on = await page.evaluate(() => ({ mounted: __mm.interaction.mounted, parent: __mm.rig.root.parent?.name ?? null }))
      check('squeeze near a mount rides it', on.mounted === mount.id && /^anchor:/.test(on.parent ?? ''), on)
      await page.evaluate((id) => { delete __mm.world.get(id).live.held }, mount.id)
      const cam0 = await page.evaluate(() => __mm.renderer.xr.getCamera().getWorldPosition(__mm.rig.head.position.clone()).toArray())
      const mnt0 = await page.evaluate((id) => __mm.reconciler.objectFor(id).position.toArray(), mount.id)
      await sleep(1500)
      const cam1 = await page.evaluate(() => __mm.renderer.xr.getCamera().getWorldPosition(__mm.rig.head.position.clone()).toArray())
      const mnt1 = await page.evaluate((id) => __mm.reconciler.objectFor(id).position.toArray(), mount.id)
      report.ride = { mountMoved: +v3(mnt1).distanceTo(v3(mnt0)).toFixed(3), cameraMoved: +v3(cam1).distanceTo(v3(cam0)).toFixed(3) }
      await page.screenshot({ path: path.join(OUT, 'xr-mounted.jpg'), type: 'jpeg', quality: 80 })
      await page.evaluate(() => __xrdevice.controllers.left.updateButtonValue('squeeze', 1))
      await page.waitForFunction(() => __mm.interaction.mounted == null, null, { timeout: 4000 }).catch(() => {})
      await page.evaluate(() => __xrdevice.controllers.left.updateButtonValue('squeeze', 0))
      await sleep(400)
      const off = await page.evaluate(() => ({ mounted: __mm.interaction.mounted, parent: __mm.rig.root.parent?.type ?? null }))
      check('squeeze again dismounts into the scene', off.mounted === null && off.parent === 'Scene', off)
    }
    // ---- wrist palette (when the app configured one): right trigger on an item spawns it
    await page.evaluate(() => { const c = __xrdevice.controllers.left; c.position.set(-0.15, 1.2, -0.35); c.quaternion.set(-0.5, 0, 0, 0.866) })
    await sleep(400)
    const pal = await page.evaluate(() => {
      const g = __mm.interaction.palette
      if (!g?.visible || !g.children.length) return null
      __mm.rig.root.updateMatrixWorld(true)
      const it = g.children[0]
      return { rig: __mm.rig.root.matrixWorld.toArray(), item: it.matrixWorld.toArray(), h: it.scale.y, n: __mm.world.entities.size }
    })
    if (pal) {
      const at = toLocal(pal.rig, new THREE.Vector3().setFromMatrixPosition(m4(pal.item))).add(new THREE.Vector3(0, pal.h * 0.5, 0))
      const from = new THREE.Vector3(0.25, 1.25, -0.2)
      const qq = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().lookAt(from, at, new THREE.Vector3(0, 1, 0)))
      await page.evaluate(([p, q4]) => { const c = __xrdevice.controllers.right; c.position.set(...p); c.quaternion.set(...q4) }, [from.toArray(), qq.toArray()])
      await sleep(400)
      await page.evaluate(() => __xrdevice.controllers.right.updateButtonValue('trigger', 1)); await sleep(300)
      await page.evaluate(() => __xrdevice.controllers.right.updateButtonValue('trigger', 0)); await sleep(400)
      const n1 = await page.evaluate(() => __mm.world.entities.size)
      check('the wrist palette spawns an entity', n1 === pal.n + 1, { before: pal.n, after: n1 })
    } else report.palette = 'none configured'
    await page.screenshot({ path: path.join(OUT, 'xr-emulated.jpg'), type: 'jpeg', quality: 80 })

    // ---- end the session: the desktop eye comes back
    await page.evaluate(() => __mm.renderer.xr.getSession().end())
    await sleep(600)
    const end = await page.evaluate(() => ({ presenting: __mm.renderer.xr.isPresenting, head: __mm.rig.head.position.toArray().map((v) => +v.toFixed(3)) }))
    check('session end restores the desktop camera', !end.presenting && Math.abs(end.head[1] - 1.6) < 1e-3 && end.head[0] === 0, end)
    check('no page errors', logs.length === 0, logs.slice(0, 5))
    await ctx.close()
  } finally {
    await browser.close()
    srv?.close()
  }
  report.checks = checks
  report.ok = checks.every((c) => c.ok)
  console.log(JSON.stringify(report, null, 1))
  process.exit(report.ok ? 0 : 1)
}

main().catch((e) => { console.error(e); console.log(JSON.stringify({ checks, ok: false, error: String(e?.message ?? e) }, null, 1)); process.exit(1) })
