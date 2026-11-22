// Final encode: node tools/video/encode.mjs [workDir] [--crf N]
// master.mp4 + timeline.json -> ../../video/wasm-machine-explainer.mp4 (+ poster .jpg)
// Audio: one soft, short tick per machine step / run start (synthesised with ffmpeg sine + decay).
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const args = process.argv.slice(2)
const WORK = args.find((a) => !a.startsWith('--')) || '/tmp/claude-0/-home-user-vibe-dump/d8ade1bc-f153-570f-9724-d63f442457f8/scratchpad/video'
const crfI = args.indexOf('--crf')
const CRF = crfI >= 0 ? args[crfI + 1] : '24'
const OUTDIR = path.resolve(HERE, '../../video')
fs.mkdirSync(OUTDIR, { recursive: true })
const FF = '/usr/bin/ffmpeg'
const run = (a) => execFileSync(FF, ['-v', 'error', '-y', ...a], { stdio: 'inherit' })

const tl = JSON.parse(fs.readFileSync(`${WORK}/timeline.json`, 'utf8'))
const dur = tl.frames / tl.fps

// 1. tick: 55 ms, 1.9 kHz + 3.8 kHz partial, fast exponential decay, quiet
run(['-f', 'lavfi', '-i', `aevalsrc='(0.55*sin(2*PI*1900*t)+0.2*sin(2*PI*3800*t)+0.25*sin(2*PI*620*t))*exp(-t*70)':s=48000:d=0.055`,
  '-af', 'volume=0.30', `${WORK}/tick.wav`])

// 2. place ticks (batches of 32 to keep the filter graph small)
const ticks = tl.ticks
const parts = []
for (let b = 0; b * 32 < ticks.length; b++) {
  const chunk = ticks.slice(b * 32, b * 32 + 32)
  const ins = chunk.flatMap(() => ['-i', `${WORK}/tick.wav`])
  const fl = chunk.map((t, i) => `[${i}]adelay=${Math.round(t * 1000)}:all=1[d${i}]`).join(';') +
    ';' + chunk.map((_, i) => `[d${i}]`).join('') + `amix=inputs=${chunk.length}:normalize=0,apad=whole_dur=${dur}[a]`
  const out = `${WORK}/ticks${b}.wav`
  run([...ins, '-filter_complex', fl, '-map', '[a]', '-t', String(dur), '-ar', '48000', '-ac', '2', out])
  parts.push(out)
}
const mixIns = parts.flatMap((p) => ['-i', p])
run([...mixIns, '-filter_complex', `${parts.map((_, i) => `[${i}]`).join('')}amix=inputs=${parts.length}:normalize=0,afade=t=out:st=${dur - 0.6}:d=0.6[a]`,
  '-map', '[a]', '-t', String(dur), '-ar', '48000', '-ac', '2', `${WORK}/audio.wav`])

// 3. final mux/encode
const out = `${OUTDIR}/wasm-machine-explainer.mp4`
run(['-i', `${WORK}/master.mp4`, '-i', `${WORK}/audio.wav`, '-map', '0:v', '-map', '1:a',
  '-c:v', 'libx264', '-preset', 'veryslow', '-crf', CRF, '-tune', 'animation', '-profile:v', 'high', '-level', '4.1',
  '-pix_fmt', 'yuv420p', '-r', '30', '-g', '60', '-x264-params', 'keyint_min=30',
  '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart', '-shortest', out])

// 4. poster: the stack-machine punch-in (i32.add pushed 5) — frame from the first shot
const posterT = tl.posterT ?? 7.4
run(['-ss', String(posterT), '-i', out, '-frames:v', '1', '-q:v', '2', `${OUTDIR}/wasm-machine-explainer.jpg`])
console.log(out, (fs.statSync(out).size / 1e6).toFixed(2), 'MB')
