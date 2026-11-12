#!/usr/bin/env node
// Render the film to an MP4, frame by frame.
//
//   node tools/render.mjs <url> <durations.json> <narration.wav> <out.mp4> [--fps 30] [--size 1280x720] [--scale 1.5] [--workers 4]
//                        [--start S --seconds N]   just that stretch, picture only, for patching a finished render
//
// <url> is the built app (e.g. a `vite preview`). The page is put in offline
// mode and stepped one frame at a time, so the result does not depend on how
// fast this machine can draw. Workers each render a contiguous stretch; a
// worker first replays the film up to its starting point without drawing, so
// every moving part is exactly where it would have been.
// Needs: playwright (Chromium) and ffmpeg on the PATH.
import { createRequire } from 'module'
import { spawn, execFileSync } from 'child_process'
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'fs'
import path from 'path'
const { chromium } = createRequire(import.meta.url)('playwright')

const [url, durFile, wav, out] = process.argv.slice(2)
const opt = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d }
const fps = +opt('--fps', 30), [W, H] = opt('--size', '1280x720').split('x').map(Number), scale = +opt('--scale', 1.5)
const workers = +opt('--workers', 4), limit = +opt('--seconds', 0), begin = Math.round(+opt('--start', 0) * fps)
const durations = JSON.parse(readFileSync(durFile, 'utf8'))
const CREDITS = 14 // seconds of closing card listing the sources
const filmFrames = Math.round(durations.reduce((a, b) => a + b, 0) * fps)
const end = limit ? begin + Math.round(limit * fps) : filmFrames + CREDITS * fps, frames = end - begin
const tmp = out + '.parts'; mkdirSync(tmp, { recursive: true })
console.log(`${frames} frames, ${(frames / fps / 60).toFixed(1)} min, ${W * scale}x${H * scale} @ ${fps} fps, ${workers} workers`)

async function work(k) {
  const first = begin + Math.floor(frames * k / workers), last = begin + Math.floor(frames * (k + 1) / workers)
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined })
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: scale })
  await page.addInitScript(d => {
    let s = 20261112; Math.random = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296) // same "random" in every worker
    globalThis.__AION_DUR = d
  }, durations)
  page.on('pageerror', e => { console.error(`worker ${k}:`, e.message); process.exit(1) })
  await page.goto(url); await page.waitForFunction(() => window.__aion, null, { timeout: 120000 })
  await page.evaluate(() => window.__aion.offline())
  for (let done = 0; done < Math.min(first, filmFrames);) { // replay, unseen, up to this worker's first frame
    const n = Math.min(600, Math.min(first, filmFrames) - done)
    await page.evaluate(([dt, n]) => window.__aion.step(dt, false, n), [1 / fps, n]); done += n
  }
  const part = path.join(tmp, `part-${k}.mp4`)
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2', part], { stdio: ['pipe', 'inherit', 'inherit'] })
  const t0 = Date.now()
  for (let f = first; f < last; f++) {
    if (f === Math.max(first, filmFrames)) await page.evaluate(() => window.__aion.credits())
    // dt 0 on a worker's first frame: draw where the replay left off (it drew nothing) without moving on
    if (f < filmFrames) await page.evaluate(dt => window.__aion.step(dt, true), f > first ? 1 / fps : 0)
    const jpg = await page.screenshot({ type: 'jpeg', quality: 93 })
    if (!ff.stdin.write(jpg)) await new Promise(r => ff.stdin.once('drain', r))
    if ((f - first) % 600 === 599) console.log(`worker ${k}: ${f - first + 1}/${last - first}  (${((Date.now() - t0) / (f - first + 1)).toFixed(0)} ms/frame)`)
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await browser.close()
  return part
}

const parts = await Promise.all(Array.from({ length: workers }, (_, k) => work(k)))
const list = path.join(tmp, 'list.txt'); writeFileSync(list, parts.map(p => `file '${path.resolve(p)}'`).join('\n'))
const sound = begin ? [] : [...(limit ? ['-t', String(limit)] : []), '-i', wav, '-af', 'apad', '-c:a', 'aac', '-b:a', '128k', '-shortest']
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, ...sound,
  '-c:v', 'copy', '-movflags', '+faststart', out], { stdio: 'inherit' })
rmSync(tmp, { recursive: true })
console.log('wrote', out)
