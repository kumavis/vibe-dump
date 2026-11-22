// Record the explainer: node tools/video/record.mjs [outDir] [--only id,id] [--stills]
// Writes <outDir>/master.mp4 (video only, near-lossless) and <outDir>/timeline.json
// (captions with global times, step ticks for the audio bed). Then run encode.sh.
import fs from 'node:fs'
import { spawn } from 'node:child_process'
import * as E from './engine.mjs'
import { SHOTS } from './shots.mjs'

const args = process.argv.slice(2)
const OUT = args.find((a) => !a.startsWith('--')) || '/tmp/claude-0/-home-user-vibe-dump/d8ade1bc-f153-570f-9724-d63f442457f8/scratchpad/video'
const onlyArg = args.indexOf('--only')
const ONLY = onlyArg >= 0 ? args[onlyArg + 1].split(',') : null
fs.mkdirSync(OUT, { recursive: true })

const FPS = E.FPS
const shots = SHOTS.filter((s) => !ONLY || ONLY.includes(s.id))
const TOTAL = shots.reduce((a, s) => a + Math.round(s.dur * FPS), 0)

const ease = (u) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2)
const lerpCam = (a, b, u) => ({ x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u, w: a.w + (b.w - a.w) * u })

const ff = spawn('/usr/bin/ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(FPS), '-i', '-',
  '-c:v', 'libx264', '-preset', 'medium', '-crf', '10', '-pix_fmt', 'yuv420p', '-r', String(FPS), `${OUT}/master.mp4`], { stdio: ['pipe', 'inherit', 'inherit'] })
const write = (buf) => new Promise((r) => (ff.stdin.write(buf) ? r() : ff.stdin.once('drain', r)))

const rig = await E.launch()
const timeline = { fps: FPS, frames: TOTAL, shots: [], cues: [], ticks: [] }
let g = 0 // global frame counter
const t0 = Date.now()

for (const shot of shots) {
  if (shot.open) await E.open(rig, shot.open) // open: null continues on the current page
  if (shot.setup) await shot.setup(rig)
  await E.freeze(rig)

  // resolve camera targets now that the layout is final
  const cams = []
  for (const [t, target, dur = 0] of shot.cam) {
    let cam = E.FULL
    if (target !== 'full') {
      const spec = typeof target === 'string' ? { sel: target } : target
      const r = spec.sel ? await E.rect(rig, spec.sel) : spec
      cam = E.fit(r, spec)
    }
    cams.push({ t, cam, dur })
  }
  const camAt = (t) => {
    let cur = cams[0].cam
    for (let i = 1; i < cams.length; i++) {
      const k = cams[i]
      if (t < k.t) break
      const u = k.dur ? Math.min(1, (t - k.t) / k.dur) : 1
      cur = lerpCam(cur, k.cam, ease(u))
    }
    return cur
  }

  const n = Math.round(shot.dur * FPS)
  const startG = g
  timeline.shots.push({ id: shot.id, start: g / FPS, dur: n / FPS })
  shot.cues.forEach(([t, html], i) => {
    const end = i + 1 < shot.cues.length ? shot.cues[i + 1][0] : shot.dur
    timeline.cues.push({ shot: shot.id, start: +(startG / FPS + t).toFixed(3), end: +(startG / FPS + end).toFixed(3), html })
  })
  const acts = shot.acts.map(([t, kind, ...a]) => ({ t, kind, a, done: false }))
  let until = null
  let msAcc = 0

  for (let f = 0; f < n; f++) {
    const t = f / FPS
    for (const act of acts) {
      if (act.done || act.t > t + 1e-6) continue
      act.done = true
      if (typeof act.kind === 'function') await act.kind(rig.page, rig)
      else if (act.kind === 'step') { await rig.page.evaluate(() => window.__wasmMachine.act('step')); timeline.ticks.push(+(g / FPS).toFixed(3)) }
      else if (act.kind === 'run') {
        const [speed, stopAt] = act.a
        await rig.page.evaluate((sp) => { window.__wasmMachine.transport.setSpeedIndex(sp); if (!window.__wasmMachine.session.running) window.__wasmMachine.act('run') }, speed)
        until = stopAt ?? null
        timeline.ticks.push(+(g / FPS).toFixed(3))
      } else if (act.kind === 'speed') await rig.page.evaluate((sp) => window.__wasmMachine.transport.setSpeedIndex(sp), act.a[0])
      else if (act.kind === 'pause') { await rig.page.evaluate(() => window.__wasmMachine.session.pause()); until = null }
      else if (act.kind === 'spot') await rig.page.evaluate((n) => window.__wasmMachine.spotlight(n), act.a[0])
    }
    // advance exactly one frame of virtual time (integer ms, no drift)
    const ms = Math.round(((f + 1) * 1000) / FPS) - Math.round((f * 1000) / FPS)
    msAcc += ms
    if (until != null) {
      // run frame by frame and stop exactly at `until` (the transport has no step breakpoint)
      await rig.page.clock.runFor(ms)
      const st = await rig.page.evaluate((u) => { const s = window.__wasmMachine.session; const m = s.machine; if (m && m.steps >= u && s.running) s.pause(); return m ? m.steps : 0 }, until)
      if (st >= until) until = null
    }

    // captions
    let cap = '', capO = 0
    for (let i = 0; i < shot.cues.length; i++) {
      const [ts, html] = shot.cues[i]
      const te = i + 1 < shot.cues.length ? shot.cues[i + 1][0] : Infinity
      if (t >= ts && t < te) {
        cap = html
        const fin = Math.min(1, (t - ts) / 0.22 + (i === 0 ? 1 : 0)) // first cue of a shot cuts in with the picture
        const fout = Math.min(1, (te - t) / 0.12)
        capO = Math.max(0, Math.min(fin, fout))
      }
    }
    const ov = {
      cap, capO: +capO.toFixed(3), chap: shot.chap, chapO: 1,
      prog: (g + 1) / TOTAL,
      rate: (shot.slow || []).reduce((r, [a, b, k]) => (t >= a && t < b ? k : r), 1),
      end: shot.end ? ease(Math.min(1, t / 0.5)) : 0,
    }
    if (shot.perFrame) await rig.page.evaluate(shot.perFrame)
    const cam = camAt(t)
    const buf = await E.frame(rig, until != null ? 0 : ms, ov, cam)
    await write(buf)
    g++
  }
  await E.thaw(rig)
  console.log(`${shot.id}: ${n} frames, total ${g}/${TOTAL}, ${((Date.now() - t0) / 1000).toFixed(0)} s`)
}

ff.stdin.end()
await new Promise((r) => ff.on('close', r))
await rig.close()
fs.writeFileSync(`${OUT}/timeline.json`, JSON.stringify(timeline, null, 1))
console.log(`done: ${g} frames = ${(g / FPS).toFixed(2)} s -> ${OUT}/master.mp4`)
