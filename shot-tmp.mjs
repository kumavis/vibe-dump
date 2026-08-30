import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { join, extname } from 'node:path'
const root = 'packages/aperiodic-garden/dist'
const TYPES = { '.html':'text/html','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml' }
const server = createServer(async (req,res)=>{ let p = join(root, decodeURIComponent(req.url.split('?')[0])); try { if ((await stat(p)).isDirectory()) p = join(p,'index.html') } catch {}; try { const b = await readFile(p); res.writeHead(200,{'content-type':TYPES[extname(p)]||'application/octet-stream'}); res.end(b) } catch { res.writeHead(404); res.end('nope') } })
await new Promise(r=>server.listen(4185, r))
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--no-sandbox'] })
const page = await browser.newPage({ viewport:{width:1280,height:800}, deviceScaleFactor:2 })
const errs = []
page.on('console', m => { if (m.type()==='error') errs.push(m.text()) })
page.on('pageerror', e => errs.push('PAGEERROR: '+e.message))
await page.goto('http://127.0.0.1:4185/', { waitUntil:'load' })
await page.waitForTimeout(2000)
await page.click('#play')
await page.waitForTimeout(1200)
// lay a river-heavy garden, then zoom in on the water
const info = await page.evaluate(() => {
  const G = window.aperiodicGarden, g = G.game
  for (let i = 0; i < 34 && !g.over; i++) {
    const fits = g.fits
    if (!fits.length) break
    let best = null, bs = -Infinity
    for (const f of fits) {
      const h = g._harmony(f.o, f.cells, g.tile)
      const s = h.joins * 12 + h.match * 3 + h.touch + Math.random() * 2
      if (s > bs) { bs = s; best = f }
    }
    g.place(best)
  }
  G.refresh()
  const lakes = g.board.tiles.filter(t => t.ports.size === 1).length
  return { placed: g.placed, lakes, sites: g.sites.map(s => ({ t: s.title, done: s.done })), mouths: g.board.openMouths.size }
})
console.log(JSON.stringify(info))
await page.waitForTimeout(1200)
await page.screenshot({ path:'r1-wide.png', scale:'css' })
// close in on the river
await page.evaluate(() => {
  const G = window.aperiodicGarden, s = G.scene
  const t = G.game.board.tiles.find(x => x.ports.size >= 2)
  const c = G.game.centreOf(t.cells[0])
  s.wantTarget.set(c[0] * 0.42, 0.3, c[1] * 0.42); s.target.copy(s.wantTarget)
  s.wantDist = 3.2; s.dist = 3.2; s.polar = 1.15
})
await page.waitForTimeout(1400)
await page.screenshot({ path:'r2-seam.png', scale:'css' })
// let the wildlife turn up, then look for it
await page.evaluate(() => {
  const A = window.__amb = window.aperiodicGarden.scene.scene
})
const life = await page.evaluate(async () => {
  // hurry the clock so every species has had a turn
  const G = window.aperiodicGarden
  return new Promise((done) => {
    let seen = {}
    let n = 0
    const tick = () => {
      const amb = G.ambience
      if (amb) for (const c of amb.critters) if (c.party) seen[c.spec.key] = true
      if (++n > 400) return done(Object.keys(seen))
      requestAnimationFrame(tick)
    }
    tick()
  })
})
console.log('critters seen:', JSON.stringify(life))

// straight down on the peak, to see the valley
await page.evaluate(() => {
  const s = window.aperiodicGarden.scene
  const m = s.mountain
  s.wantTarget.set(m.position.x, 0.4, m.position.z); s.target.copy(s.wantTarget)
  s.wantDist = 6.5; s.dist = 6.5; s.polar = 0.30; s.azimuth = 0
})
await page.waitForTimeout(1400)
await page.screenshot({ path:'r3-peak-top.png', scale:'css' })
await page.evaluate(() => { const s = window.aperiodicGarden.scene; s.polar = 1.05; s.wantDist = 5.5; s.dist = 5.5 })
await page.waitForTimeout(1400)
await page.screenshot({ path:'r4-peak-side.png', scale:'css' })
console.log(errs.length ? 'CONSOLE ERRORS:\n'+errs.slice(0,8).join('\n') : 'no console errors')
await browser.close(); server.close()
