// Render the narrated cut to an MP4: open the built app in ?video mode, step it
// frame by frame at the cut's fps, screenshot each frame (captions are DOM, so
// a page screenshot rather than a canvas grab), then mux with the narration.
//
// usage: node video/capture.mjs <timed.json> <audio.wav> <outdir> [--frames a:b] [--preroll s] [--pr r]
//   --pr 0.75 renders the 3-D at 75 % (captions stay full resolution).
//   timed.json / audio.wav come from video/tts.py. Run `npm run build` first:
//   this shoots dist/, like the thumbnails. CHROMIUM_PATH picks the browser.
import { chromium } from 'playwright'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { startStaticServer } from '../../../scripts/static-server.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const [timedPath, audioPath, outdir, ...rest] = process.argv.slice(2)
if (!outdir) {
  console.error('usage: node video/capture.mjs <timed.json> <audio.wav> <outdir> [--frames a:b] [--preroll s] [--pr 0.75]')
  process.exit(2)
}
const opt = (name, def) => {
  const i = rest.indexOf(name)
  return i >= 0 ? rest[i + 1] : def
}
const cut = JSON.parse(fs.readFileSync(timedPath, 'utf8'))
const [W, H] = cut.size || [1920, 1080]
const framesDir = path.join(outdir, 'frames')
fs.mkdirSync(framesDir, { recursive: true })

const { url, close } = await startStaticServer(path.join(here, '..', 'dist'))
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  // Without a GPU, SwiftShader renders WebGL in software; GPU=1 uses the real one.
  args: process.env.GPU ? ['--enable-gpu', '--ignore-gpu-blocklist'] : ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  headless: !process.env.GPU,
})
// The video layout is designed at 1920x1080 CSS px; other output sizes scale it.
const page = await browser.newPage({ viewport: { width: 1920, height: Math.round((1920 * H) / W) }, deviceScaleFactor: W / 1920, reducedMotion: 'no-preference' })
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
const pr = opt('--pr', '')
await page.goto(`${url}/index.html?video${pr ? `&pr=${pr}` : ''}`, { waitUntil: 'load', timeout: 180000 })
await page.waitForFunction(() => document.body.classList.contains('ready'), null, { timeout: 300000 })
await page.evaluate(() => window.__coldboot.video.ready())
const { total, frames } = await page.evaluate((c) => window.__coldboot.video.load(c), cut)
const [a, b] = (opt('--frames', `0:${frames}`) || '').split(':').map(Number)
const partial = a !== 0 || b !== frames
console.log(`${total.toFixed(2)} s, ${frames} frames at ${cut.fps} fps; rendering ${a}..${b - 1}`)
// start exactly where a full render would be at frame a (shot, drift, captions)
await page.evaluate((n) => window.__coldboot.video.seek(n), a)

// The page only queues WebGL work; Chromium's GPU process draws it when the
// frame is composited. A screenshot is what makes that happen, so every frame
// rendered — even ones we throw away — is followed by one, or the work piles up.
const settle = () => page.screenshot({ type: 'jpeg', quality: 10, clip: { x: 0, y: 0, width: 4, height: 4 }, timeout: 120000 })

// Let streams fill and lights settle before the first captured frame.
const preroll = Number(opt('--preroll', 1.5))
for (let k = 0; k < Math.round(preroll * cut.fps); k++) {
  await page.evaluate((n) => window.__coldboot.video.frame(n), a)
  await settle()
}

const t0 = Date.now()
for (let f = a; f < b; f++) {
  await page.evaluate((n) => window.__coldboot.video.frame(n), f)
  await page.screenshot({ path: path.join(framesDir, `f${String(f).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 94, timeout: 120000 })
  if ((f - a) % 30 === 29) {
    const per = (Date.now() - t0) / (f - a + 1)
    console.log(`frame ${f + 1}/${b} · ${(per / 1000).toFixed(2)} s/frame · ~${Math.round(((b - f - 1) * per) / 60000)} min left`)
  }
}
await browser.close()
await close()
if (errors.length) console.log('page errors:\n  ' + errors.join('\n  '))

// Encode what's on disk (frames a..b) with the matching slice of the narration.
// (a range render is a preview and gets its own name, so it can't replace the whole)
const out = path.join(outdir, partial ? `${path.basename(outdir)}-${a}-${b}.mp4` : `${path.basename(outdir)}.mp4`)
const r = spawnSync(
  'ffmpeg',
  ['-y', '-v', 'error', '-framerate', String(cut.fps), '-start_number', String(a), '-i', path.join(framesDir, 'f%05d.jpg'),
    '-ss', String(a / cut.fps), '-t', String((b - a) / cut.fps), '-i', audioPath,
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-ar', '48000', '-ac', '2', '-movflags', '+faststart', '-shortest', out],
  { stdio: 'inherit' },
)
if (r.status !== 0) process.exit(r.status || 1)
console.log(`wrote ${out}`)
