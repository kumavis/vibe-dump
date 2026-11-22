// Deterministic frame capture for the explainer video (capture-time only:
// nothing here changes the app; it injects a stylesheet and an overlay).
//
// Time: Playwright's fake clock drives performance.now / rAF / timers, and every
// Web Animation (WAAPI, CSS animations, CSS transitions) is paused and seeked to
// the same virtual time each frame. Frames are rendered one at a time with
// Page.captureScreenshot, so the output is exactly 30 fps however slow the
// renderer is. Zooms re-rasterise the page (clip.scale), so punch-ins stay sharp.
import { chromium } from '/home/user/vibe-dump/node_modules/playwright/index.mjs'
import { serve } from './serve.mjs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
export const DIST = path.resolve(HERE, '../../dist')
export const CHROME = '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome'

// Design canvas: 540 × 960 CSS px at DPR 2 = 1080 × 1920 output.
export const W = 540, H = 960, DPR = 2, FPS = 30
// The page viewport is taller than the frame so a punch-in can centre panes
// that sit near the bottom of the app; nothing is drawn below the app.
export const VIEW_H = 1400
// Output-frame layout (CSS px of the 540 × 960 frame).
export const SAFE_TOP = 118          // top 12 % is platform UI
export const BAND_H = 150            // caption band: 118 .. 268
export const APP_Y = 262             // app starts just under the band
export const APP_H = H - APP_Y       // 698
export const SAFE_BOTTOM = 787       // bottom 18 % is platform UI

const CSS = `
html, body { background: #0e1014 !important; overflow: hidden !important; }
.app { height: ${APP_H}px !important; margin-top: ${APP_Y}px !important;
  grid-template-rows: 0 0 minmax(0, 1fr) auto !important; }
.app > .topbar, .app > .side { display: none !important; }
.app .t-timeline { display: none !important; }
.app .instr-bar { display: none !important; }
#vo { position: fixed; left: 0; top: 0; width: ${W}px; height: ${H}px; transform-origin: 0 0;
  z-index: 2147483000; pointer-events: none; font-family: var(--sans); }
#vo .band { position: absolute; left: -20px; right: -20px; top: -40px; height: ${APP_Y + 40}px;
  background: linear-gradient(#0e1014 0, #0e1014 ${APP_Y + 30}px, rgba(14,16,20,0)); }
#vo .brand { position: absolute; left: 22px; top: 62px; display: flex; align-items: center; gap: 9px;
  font: 600 15px/1 var(--sans); color: #aab1bc; letter-spacing: .02em; }
#vo .brand svg { width: 20px; height: 20px; }
#vo .chap { position: absolute; left: 24px; top: ${SAFE_TOP + 6}px; font: 700 12.5px/1 var(--mono);
  letter-spacing: .14em; text-transform: uppercase; color: #8e96ff; }
#vo .cap { position: absolute; left: 24px; right: 20px; top: ${SAFE_TOP + 28}px;
  font: 750 29px/1.2 var(--sans); color: #e7e9ec; letter-spacing: -.012em; text-wrap: balance; }
#vo .cap b { color: #8e96ff; font-weight: 800; }
#vo .cap code { font: 700 .9em/1 var(--mono); color: #5bb5ea; background: rgba(91,181,234,.12);
  border-radius: 5px; padding: 1px 5px; letter-spacing: 0; }
#vo .cap em { font-style: normal; color: #f2734f; }
#vo .cap i { font-style: normal; color: #4cc38a; }
#vo .prog { position: absolute; left: 0; right: 0; top: ${APP_Y - 2}px; height: 2px; background: #232831; }
#vo .prog > div { height: 100%; width: 0; background: #8e96ff; }
#vo .end { position: absolute; inset: 0; background: #0e1014; opacity: 0; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 22px; text-align: center; }
#vo .end .logo svg { width: 92px; height: 92px; }
#vo .end h1 { margin: 0; font: 800 48px/1 var(--sans); color: #e7e9ec; letter-spacing: -.02em; }
#vo .end p { margin: 0; font: 600 22px/1.35 var(--sans); color: #aab1bc; }
#vo .end p b { color: #8e96ff; }
#vo .end .url { font: 600 15px/1 var(--mono); color: #737c88; margin-top: 8px; }
#vo .ring { position: absolute; border: 2.5px solid #8e96ff; border-radius: 9px; opacity: 0;
  box-shadow: 0 0 0 4px rgba(142,150,255,.18); }
`

// In-page runtime: virtual-time animation sync + overlay state.
const INIT = `(() => {
  const born = new WeakMap()
  const orig = Element.prototype.animate
  Element.prototype.animate = function (...a) { const an = orig.apply(this, a); born.set(an, performance.now()); return an }
  const track = new Map()
  window.__vt = {
    on: false,
    // rate < 1 plays the app's animations in slow motion (virtual time per animation)
    sync(rate = 1) {
      const now = performance.now()
      const dt = this.last == null ? 0 : now - this.last
      this.last = now
      for (const a of document.getAnimations()) {
        let st = track.get(a)
        if (!st) {
          st = { t: born.has(a) ? (now - born.get(a)) * rate : 0 }
          track.set(a, st)
          if (a.playState !== 'finished') a.pause()
        } else st.t += dt * rate
        if (a.playState === 'finished' || st.done) continue
        const end = a.effect ? a.effect.getComputedTiming().endTime : 0
        if (st.t >= end && Number.isFinite(end)) { st.done = true; try { a.finish() } catch { a.currentTime = end } }
        else { if (a.playState !== 'paused') a.pause(); a.currentTime = Math.max(0, st.t) }
      }
    },
    release() { this.last = null; for (const a of document.getAnimations()) { try { a.finish() } catch {} } track.clear() },
  }
})()`

export async function launch() {
  const srv = await serve(DIST)
  const browser = await chromium.launch({ executablePath: CHROME, args: ['--font-render-hinting=none', '--disable-lcd-text'] })
  const ctx = await browser.newContext({ viewport: { width: W, height: VIEW_H }, deviceScaleFactor: DPR, reducedMotion: 'no-preference' })
  const page = await ctx.newPage()
  await page.clock.install()
  await page.addInitScript(INIT)
  const cdp = await ctx.newCDPSession(page)
  const api = (fn, ...a) => page.evaluate(([fn, a]) => window.__wasmMachine.api[fn](...a), [fn, a])
  return { srv, browser, page, cdp, api, close: async () => { await browser.close(); srv.close() } }
}

export async function open(rig, query) {
  const { page, srv } = rig
  await page.clock.resume()
  await page.goto(`${srv.url}/?present&theme=dark&motion=on&${query}`)
  await page.waitForFunction(() => window.__wasmMachine?.api)
  await page.addStyleTag({ content: CSS })
  await page.evaluate(() => {
    if (document.getElementById('vo')) return
    const logo = document.querySelector('.topbar .brand svg')?.outerHTML || ''
    const vo = document.createElement('div')
    vo.id = 'vo'
    vo.innerHTML = `<div class="band"></div><div class="brand">${logo}<span>Wasm Machine</span></div>
      <div class="chap"></div><div class="cap"></div><div class="prog"><div></div></div><div class="ring"></div>
      <div class="end"><div class="logo">${logo}</div><h1>Wasm Machine</h1><p>Step through it yourself:<br><b>every instruction, every byte.</b></p><div class="url">vibe-dump · wasm-machine</div></div>`
    document.body.appendChild(vo)
  })
  await rig.api('settled')
}

/** Stop real time: from here on, time only advances by frames. */
export async function freeze(rig) {
  const { page } = rig
  await rig.api('settled')
  const now = await page.evaluate(() => Date.now())
  await page.clock.pauseAt(now + 20)
  await page.evaluate(() => { window.__vt.on = true })
}

export async function thaw(rig) {
  await rig.page.evaluate(() => { window.__vt.release(); window.__vt.on = false })
  await rig.page.clock.resume()
}

/** Advance virtual time by `ms`, sync animations, apply overlay state, return a JPEG frame. */
export async function frame(rig, ms, ov, cam) {
  const { page, cdp } = rig
  if (ms > 0) await page.clock.runFor(ms)
  await page.evaluate(({ ov, cam, W }) => {
    window.__vt.sync(ov.rate ?? 1)
    const vo = document.getElementById('vo')
    const s = W / cam.w
    vo.style.transform = `translate(${cam.x}px, ${cam.y}px) scale(${1 / s})`
    if (ov.cap !== undefined) {
      const c = vo.querySelector('.cap')
      if (c.dataset.raw !== ov.cap) { c.dataset.raw = ov.cap; c.innerHTML = ov.cap }
      c.style.opacity = ov.capO
      c.style.transform = `translateY(${(1 - ov.capO) * 8}px)`
    }
    const ch = vo.querySelector('.chap')
    if (ch.textContent !== ov.chap) ch.textContent = ov.chap || ''
    ch.style.opacity = ov.chapO ?? 1
    vo.querySelector('.prog > div').style.width = (ov.prog * 100).toFixed(3) + '%'
    vo.querySelector('.end').style.opacity = ov.end || 0
    const r = vo.querySelector('.ring')
    if (ov.ring) {
      // ring rect is in page coords; convert to the overlay's frame coords
      const x = (ov.ring.x - cam.x) * s, y = (ov.ring.y - cam.y) * s
      Object.assign(r.style, { left: x - 5 + 'px', top: y - 5 + 'px', width: ov.ring.w * s + 10 + 'px', height: ov.ring.h * s + 10 + 'px', opacity: ov.ring.o })
    } else r.style.opacity = 0
    const bd = vo.querySelector('.band'), br = vo.querySelector('.brand')
    bd.style.opacity = 1; br.style.opacity = ov.end ? 0 : 1
  }, { ov, cam, W })
  const s = W / cam.w
  const shot = await cdp.send('Page.captureScreenshot', {
    format: 'jpeg', quality: 94, optimizeForSpeed: false,
    clip: { x: cam.x, y: cam.y, width: cam.w, height: cam.w * H / W, scale: s * DPR },
  })
  return Buffer.from(shot.data, 'base64')
}

/** Page rect of an element (CSS px), or null. */
export const rect = (rig, sel) => rig.page.evaluate((sel) => {
  const el = document.querySelector(sel)
  if (!el) return null
  const r = el.getBoundingClientRect()
  return { x: r.x, y: r.y, w: r.width, h: r.height }
}, sel)

/**
 * Camera that fits page rect `r` into the frame's content zone (below the
 * caption band, above the bottom safe zone), at most `max`× zoom.
 */
export function fit(r, { max = 2.2, zoneTop = APP_Y + 12, zoneBot = SAFE_BOTTOM - 6, pad = 10, anchor = 'center' } = {}) {
  if (!r) return FULL
  const zw = W - 2 * pad, zh = zoneBot - zoneTop
  const s = Math.max(1, Math.min(max, zw / r.w, zh / r.h))
  const cx = r.x + r.w / 2
  const zy = anchor === 'top' ? zoneTop + (r.h * s) / 2 : (zoneTop + zoneBot) / 2
  const cy = r.y + r.h / 2
  let x = cx - (W / 2) / s, y = cy - zy / s
  const w = W / s
  x = Math.max(0, Math.min(W - w, x))
  // never show more empty canvas below the app than the bottom safe zone hides
  const maxY = H + (H - SAFE_BOTTOM) / s - w * H / W
  y = Math.max(0, Math.min(maxY, y))
  return { x, y, w }
}
export const FULL = { x: 0, y: 0, w: W }
