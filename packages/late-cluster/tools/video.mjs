#!/usr/bin/env node
// Render the show to video files, frame-exact and offline (no screen recording).
//
//   node tools/video.mjs --all                 # every segment's clip + the full episode
//   node tools/video.mjs song goodnight        # just those clips (01-…09- names follow the rundown)
//   node tools/video.mjs --full                # (re)build late-cluster-full.mp4 from the existing clips
//
// Options: --out dir (default ./video)  --jobs n (parallel segments, default 3)
//          --scale 1.5 (stage backing-store scale: 1.5 → 1920×1080, 1 → 1280×720)
//          --crf 16  --preset slow  --frames n (only the first n frames: a quick test, no audio sync)
//
// How: a Vite dev server (own port, own dep cache, like shoot.mjs) serves the page; each segment
// renders in its own GPU-backed headless Chromium. The page boots in ?freeze mode on the title card
// (which seeds Math.random, so particles and blinks are reproducible, and runs no frame loop),
// then this script builds the segment's Show from the app's own modules and steps it exactly as
// app.js's frame loop does — resetMotion() at the cut, then show.frame(t, dt) + stage.draw(show)
// every frame — on a virtual clock t = n/30, dt = 1/30. The show is stateful (eased head turns,
// face springs, blinks, airflow particles, shot pushes), so every segment is stepped continuously
// from t = 0; it never seeks. Each frame's pixels are read back and POSTed to the dev server,
// which pipes them into ffmpeg (libx264). Audio is the shipped mp3 decoded by ffmpeg, which honours
// the LAME gapless header (decoder delay + padding), so sample 0 is the segment's t = 0 — the same
// alignment the page gets from audioLead().
//
// Frame counts: each segment is round(duration·30) frames (within half a frame of its cues.json
// duration, independent of the other segments). Each clip's audio is the decoded mp3 trimmed or
// padded (by under a frame, at the tail) to that length; the full episode's audio is those PCM
// streams concatenated and encoded once, so audio and video cut together and nothing drifts.
import { spawn } from 'node:child_process'
import { mkdir, mkdtemp, rm, writeFile, readFile, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath, pathToFileURL } from 'node:url'

const pkg = dirname(dirname(fileURLToPath(import.meta.url)))
const FFMPEG = process.env.FFMPEG ?? (existsSync('/opt/homebrew/bin/ffmpeg') ? '/opt/homebrew/bin/ffmpeg' : 'ffmpeg')
const FPS = 30
const SR = 48000
const SPF = SR / FPS // audio samples per video frame (1600)

// ------------------------------------------------------------------ arguments
const argv = process.argv.slice(2)
const opt = (name, def) => {
  const i = argv.indexOf(`--${name}`)
  if (i < 0) return def
  const v = argv[i + 1]
  argv.splice(i, 2)
  return v
}
const flag = (name) => {
  const i = argv.indexOf(`--${name}`)
  if (i < 0) return false
  argv.splice(i, 1)
  return true
}
const outDir = resolve(opt('out', join(pkg, 'video')))
const jobs = Math.max(1, Number(opt('jobs', 3)))
const scale = Number(opt('scale', 1.5))
const crf = String(opt('crf', 16))
const preset = opt('preset', 'slow')
const frameLimit = (() => {
  const v = opt('frames', null)
  return v == null ? null : Math.max(1, Number(v))
})()
let url = null
const all = flag('all')
const fullOnly = flag('full')
// --bluesky: also make the posting cut (default late-cluster-bluesky.mp4, ≤ 280 MB, < 600 s)
const bluesky = flag('bluesky') || argv.includes('--max-mb')
const maxMB = Number(opt('max-mb', 280))
const maxSeconds = Number(opt('max-seconds', 600))
const blueskyName = opt('out-name', 'late-cluster-bluesky.mp4')
// --youtube: the whole episode with the caption system off (late-cluster-youtube.mp4, CRF like the
// master) + subtitles mirroring the on-stage captions (.srt + .vtt). --no-captions: clips rendered
// with the caption system off (named …-nocaps.mp4). --subs: only the subtitles (no pictures).
const youtube = flag('youtube')
const noCaptions = flag('no-captions')
const subsOnly = flag('subs')
const YT = 'late-cluster-youtube'
const W = Math.round(1280 * scale), H = Math.round(720 * scale)

const rundown = (await import(pathToFileURL(join(pkg, 'src/rundown.js')).href)).default
const cuesOf = async (id) => JSON.parse(await readFile(join(pkg, 'src/segments', id, 'cues.json'), 'utf8'))
// the scene list is src/rundown.js, read at run time; clips are numbered by position in it. Each
// segment is round(duration·30) frames on its own, so a clip stays valid when another segment
// changes (only renumbering it would need a rename); its audio is trimmed/padded to match.
const durations = []
for (const id of rundown) durations.push(existsSync(join(pkg, 'src/segments', id, 'cues.json')) ? (await cuesOf(id)).duration : null)
const frameCounts = durations.map((d) => (d == null ? null : Math.round(d * FPS)))
const needCounts = (list) => {
  const bad = list.filter((id) => frameCounts[rundown.indexOf(id)] == null)
  if (bad.length) throw new Error(`no cues.json for ${bad.join(', ')}: render its audio first`)
}
const clipName = (id, nocaps = false) => `${String(rundown.indexOf(id) + 1).padStart(2, '0')}-${id}${nocaps ? '-nocaps' : ''}.mp4`
const FULL = 'late-cluster-full.mp4'

let ids = all ? rundown.slice() : argv.filter((a) => !a.startsWith('--'))
// lossless sidecars (temp, this run only) when the run renders the whole rundown for a posting cut
const keepLossless = bluesky && rundown.every((id) => ids.includes(id)) && !frameLimit
const unknown = ids.filter((id) => !rundown.includes(id))
if (unknown.length || (!ids.length && !fullOnly && !bluesky && !youtube && !subsOnly)) {
  if (unknown.length) console.error(`not in the rundown: ${unknown.join(', ')}`)
  console.error('usage: node tools/video.mjs --all | <id> [id …] | --full   [--out dir] [--jobs n] [--scale 1.5] [--crf 16] [--preset slow] [--frames n] [--bluesky [--max-mb 280] [--max-seconds 600] [--out-name late-cluster-bluesky.mp4]] [--youtube] [--no-captions] [--subs]')
  process.exit(2)
}
await mkdir(outDir, { recursive: true })

// ------------------------------------------------------------------ helpers
function run(cmd, args, { input, quiet = true } = {}) {
  return new Promise((res, rej) => {
    const p = spawn(cmd, args, { stdio: [input ? 'pipe' : 'ignore', 'pipe', 'pipe'] })
    const out = [], err = []
    p.stdout.on('data', (b) => out.push(b))
    p.stderr.on('data', (b) => (err.push(b), quiet || process.stderr.write(b)))
    p.on('error', rej)
    p.on('close', (code) => (code === 0 ? res(Buffer.concat(out)) : rej(new Error(`${cmd} ${args.join(' ')} → ${code}\n${Buffer.concat(err).toString().slice(-2000)}`))))
    if (input) p.stdin.end(input)
  })
}

/** the segment's mp3 decoded (gapless: sample 0 = t 0), trimmed/padded to n frames, f32le stereo */
async function segmentPcm(id, frames) {
  const cues = await cuesOf(id)
  const pcm = await run(FFMPEG, ['-v', 'error', '-i', join(pkg, 'public', cues.audio), '-f', 'f32le', '-ac', '2', '-ar', String(SR), '-'])
  const want = frames * SPF * 8
  if (pcm.length >= want) return pcm.subarray(0, want)
  return Buffer.concat([pcm, Buffer.alloc(want - pcm.length)])
}

const X264 = (o) => ['-c:v', 'libx264', '-preset', preset, '-crf', crf, '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-g', String(FPS * 5), '-x264-params', 'aq-mode=3', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-color_range', 'tv', ...o]
const AAC = ['-c:a', 'aac', '-b:a', '192k', '-ar', String(SR), '-ac', '2']
// write the bt709 colour description into the stream's VUI (the encoder options alone left it unset)
const VUI = ['-bsf:v', 'h264_metadata=colour_primaries=1:transfer_characteristics=1:matrix_coefficients=1:video_full_range_flag=0']

// ------------------------------------------------------------------ the full episode from the clips
async function buildFull(tmp) {
  const missing = rundown.filter((id) => !existsSync(join(outDir, clipName(id))))
  if (missing.length) throw new Error(`can't build ${FULL}: missing clips for ${missing.join(', ')}`)
  needCounts(rundown)
  // the clips' video streams, back to back: each remuxed video-only first (concatenating the clips
  // themselves would carry each one's AAC priming offset into the video timestamps)
  const parts = []
  for (const id of rundown) {
    const part = join(tmp, `${id}.v.mp4`)
    await run(FFMPEG, ['-v', 'error', '-y', '-i', join(outDir, clipName(id)), '-map', '0:v:0', '-c:v', 'copy', part])
    parts.push(part)
  }
  await assemble(tmp, parts, FULL)
  for (const f of parts) await rm(f, { force: true })
}

/** video-only parts (each starting at 0, in rundown order) + the segments' PCM back to back → out */
async function assemble(tmp, parts, name) {
  const list = join(tmp, `${name}.txt`)
  await writeFile(list, parts.map((f) => `file '${f.replace(/'/g, "'\\''")}'\n`).join(''))
  const pcms = []
  for (const [i, id] of rundown.entries()) pcms.push(await segmentPcm(id, frameCounts[i]))
  const pcmFile = join(tmp, `${name}.f32`)
  await writeFile(pcmFile, Buffer.concat(pcms))
  const t0 = Date.now()
  await run(FFMPEG, ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list, '-f', 'f32le', '-ar', String(SR), '-ac', '2', '-i', pcmFile, '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy', ...VUI, ...AAC, '-movflags', '+faststart', join(outDir, name)])
  await rm(pcmFile, { force: true })
  console.log(`${name}  ${frameCounts.reduce((a, b) => a + b, 0)} frames  (${((Date.now() - t0) / 1000).toFixed(1)} s to mux)`)
}

// ------------------------------------------------------------------ the posting cut (size-capped)
/** two-pass x264 at the bitrate that fits maxMB, from the lossless sidecars (else the clips) */
async function buildBluesky(tmp) {
  needCounts(rundown)
  const frames = frameCounts.reduce((a, b) => a + b, 0)
  const dur = frames / FPS
  if (dur >= maxSeconds) throw new Error(`the episode is ${dur.toFixed(2)} s: over the ${maxSeconds} s limit`)
  const lossless = rundown.map((id) => join(tmp, `${id}.lossless.mkv`))
  let parts
  if (lossless.every((f) => existsSync(f))) parts = lossless
  else {
    const missing = rundown.filter((id) => !existsSync(join(outDir, clipName(id))))
    if (missing.length) throw new Error(`can't build ${blueskyName}: missing clips for ${missing.join(', ')}`)
    console.warn(`${blueskyName}: no lossless frames from this run (render with --all --bluesky for those); encoding from the CRF ${crf} clips, a second generation`)
    parts = []
    for (const id of rundown) {
      const part = join(tmp, `${id}.bv.mp4`)
      await run(FFMPEG, ['-v', 'error', '-y', '-i', join(outDir, clipName(id)), '-map', '0:v:0', '-c:v', 'copy', part])
      parts.push(part)
    }
  }
  const list = join(tmp, 'bluesky.txt')
  await writeFile(list, parts.map((f) => `file '${f.replace(/'/g, "'\\''")}'\n`).join(''))
  const pcmFile = join(tmp, 'bluesky.f32')
  const pcms = []
  for (const [i, id] of rundown.entries()) pcms.push(await segmentPcm(id, frameCounts[i]))
  await writeFile(pcmFile, Buffer.concat(pcms))
  pcms.length = 0
  const out = join(outDir, blueskyName)
  const limit = maxMB * 1e6
  // the budget: 2 % for the container, AAC at 192 kb/s, the rest is video
  let kbps = Math.floor((limit * 8 * 0.98 - 192000 * dur) / dur / 1000)
  const log = join(tmp, 'x264pass')
  const enc = (pass, k, dest) => ['-c:v', 'libx264', '-preset', preset, '-b:v', `${k}k`, '-pass', String(pass), '-passlogfile', log, '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-g', String(FPS * 5), '-x264-params', 'aq-mode=3', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-color_range', 'tv']
  const t0 = Date.now()
  console.log(`${blueskyName}: ${dur.toFixed(3)} s, two-pass at ${kbps} kb/s video (limit ${maxMB} MB)`)
  await run(FFMPEG, ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list, '-map', '0:v:0', ...enc(1, kbps), '-an', '-f', 'null', '-'])
  for (let attempt = 0; attempt < 4; attempt++) {
    await run(FFMPEG, ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list, '-f', 'f32le', '-ar', String(SR), '-ac', '2', '-i', pcmFile, '-map', '0:v:0', '-map', '1:a:0', ...enc(2, kbps), ...AAC, '-movflags', '+faststart', out])
    const size = (await stat(out)).size
    console.log(`${blueskyName}  ${(size / 1e6).toFixed(1)} MB at ${kbps} kb/s  (${((Date.now() - t0) / 1000).toFixed(0)} s)`)
    if (size <= limit) break
    if (attempt === 3) throw new Error(`${blueskyName} is still over ${maxMB} MB`)
    kbps = Math.floor((kbps * (limit * 0.98)) / size)
  }
  for (const f of parts) if (!lossless.includes(f)) await rm(f, { force: true })
  await rm(pcmFile, { force: true })
}

// ------------------------------------------------------------------ subtitles (.srt + .vtt)
// Mirrors the on-stage caption system, frame by frame (captured while stepping each segment): what
// the caption bar shows (a line, with the speaker's name; sung lines in ♪ … ♪) and the [LAUGHTER] /
// [APPLAUSE] captions it shows when nobody is talking. Timeline = the full files: each segment's
// offset is the sum of the rendered clips' frame counts, so there is no drift.
const SUB_MAX = 42
function wrapTokens(tokens, firstReserve, max) {
  const lines = []
  let cur = []
  let len = 0
  for (const tok of tokens) {
    const cap = max - (lines.length === 0 ? firstReserve : 0)
    if (cur.length && len + 1 + tok.length > cap) {
      lines.push(cur)
      cur = []
      len = 0
    }
    len += (cur.length ? 1 : 0) + tok.length
    cur.push(tok)
  }
  if (cur.length) lines.push(cur)
  return lines
}
const stamp = (t, sep) => {
  const ms = Math.max(0, Math.round(t * 1000))
  const p = (n, w = 2) => String(n).padStart(w, '0')
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)}${sep}${p(ms % 1000, 3)}`
}
function subtitleCues() {
  needCounts(rundown)
  const out = []
  let off = 0
  for (const [i, id] of rundown.entries()) {
    const runs = capRuns.get(id)
    if (!runs) throw new Error(`no caption capture for ${id}`)
    // name the speaker at each segment's first line, whenever it changes, and after a long gap
    let lastWho = null, lastEnd = -Infinity
    for (const r of runs) {
      const start = (off + r.n0) / FPS, end = (off + r.n1 + 1) / FPS
      if (r.type === 'sfx') {
        out.push({ start, end, text: `[${r.text}]`, sfx: true })
        continue
      }
      const sung = r.kind === 'sing'
      const label = (r.who !== lastWho || start - lastEnd > 5) && r.name ? `${r.name.toUpperCase()}: ` : ''
      lastWho = r.who
      lastEnd = end
      const tokens = r.words?.length ? r.words : r.text.split(/\s+/).filter(Boolean)
      const times = r.wordT?.length === tokens.length ? r.wordT : null
      const lines = wrapTokens(tokens, label.length + (sung ? 2 : 0), sung ? SUB_MAX - 2 : SUB_MAX)
      // two lines per cue; a longer caption becomes several cues, split at its word timings
      const chunks = []
      for (let k = 0, w = 0; k < lines.length; k += 2) {
        const ls = lines.slice(k, k + 2)
        chunks.push({ ls, w0: w })
        w += ls.reduce((a, l) => a + l.length, 0)
      }
      const totalChars = tokens.join(' ').length
      chunks.forEach((c, k) => {
        let s0 = start
        if (k > 0) {
          if (times) s0 = Math.max(start, off / FPS + times[c.w0] - 0.05)
          else s0 = start + ((end - start) * tokens.slice(0, c.w0).join(' ').length) / totalChars
        }
        c.start = s0
      })
      chunks.forEach((c, k) => {
        const e0 = k + 1 < chunks.length ? chunks[k + 1].start : end
        let text = c.ls.map((l) => l.join(' ')).join('\n')
        if (sung) text = `♪ ${text} ♪`
        if (k === 0 && label) text = label + text
        out.push({ start: c.start, end: e0, text })
      })
    }
    off += frameCounts[i]
  }
  // tidy: merge flickering sound captions, drop slivers, no overlaps, at least 0.7 s where possible
  const cues = []
  for (const c of out) {
    const prev = cues[cues.length - 1]
    if (c.sfx && prev?.sfx && c.start - prev.end < 0.4) {
      // back-to-back sound captions (the sign flipping APPLAUSE ↔ LAUGH): one cue naming both
      prev.end = c.end
      const kind = c.text.slice(1, -1)
      if (!prev.kinds.includes(kind)) prev.kinds.push(kind)
      prev.text = `[${prev.kinds.join(' AND ')}]`
    } else cues.push({ ...c, kinds: c.sfx ? [c.text.slice(1, -1)] : null })
  }
  const kept = cues.filter((c) => !(c.sfx && c.end - c.start < 0.4))
  kept.sort((a, b) => a.start - b.start)
  for (let k = 0; k < kept.length; k++) {
    const next = kept[k + 1]
    if (kept[k].end - kept[k].start < 0.7) kept[k].end = kept[k].start + 0.7
    if (next && kept[k].end > next.start) kept[k].end = next.start
  }
  // a line too short to read that runs straight into the next one (a quick exchange): share a cue
  const merged = []
  for (const c of kept) {
    const prev = merged[merged.length - 1]
    if (prev && !prev.sfx && !c.sfx && prev.end - prev.start < 0.7 && c.start - prev.end < 0.05 && !prev.text.includes('\n') && !c.text.includes('\n')) {
      prev.text = `${prev.text}\n${c.text}`
      prev.end = c.end
    } else merged.push(c)
  }
  for (let k = 0; k < merged.length; k++) {
    const next = merged[k + 1]
    if (merged[k].end - merged[k].start < 0.7) merged[k].end = merged[k].start + 0.7
    if (next && merged[k].end > next.start) merged[k].end = next.start
  }
  return merged.filter((c) => c.end - c.start > 0.05)
}
async function writeSubs() {
  const cues = subtitleCues()
  const srt = cues.map((c, k) => `${k + 1}\n${stamp(c.start, ',')} --> ${stamp(c.end, ',')}\n${c.text}\n`).join('\n')
  const vtt = 'WEBVTT\n\n' + cues.map((c, k) => `${k + 1}\n${stamp(c.start, '.')} --> ${stamp(c.end, '.')}\n${c.text}\n`).join('\n')
  await writeFile(join(outDir, `${YT}.srt`), srt, 'utf8')
  await writeFile(join(outDir, `${YT}.vtt`), vtt, 'utf8')
  console.log(`${YT}.srt / .vtt  ${cues.length} cues, ${stamp(cues[0]?.start ?? 0, '.')} → ${stamp(cues.at(-1)?.end ?? 0, '.')}`)
}

// ------------------------------------------------------------------ the page side: one segment
/** runs inside the page: build the Show from the app's modules and step it like app.js's tick() */
async function pageRender({ id, frames, fps, sink, w, h, captions = true, dry = false }) {
  const [{ Show }, { load }, { Stage }] = await Promise.all([import('/src/show/show.js'), import('/src/show/segments.js'), import('/src/stage/stage.js')])
  const lc = window.__lc
  // same module instances as the app's? (otherwise puppets/heads would be a second copy)
  if (!(lc.stage instanceof Stage)) throw new Error('module identity check failed: /src/stage/stage.js is not the app’s instance')
  const st = lc.stage
  if (st.canvas.width !== w || st.canvas.height !== h) throw new Error(`stage backing store is ${st.canvas.width}×${st.canvas.height}, wanted ${w}×${h}`)
  const d = await load(id, { audio: false })
  const show = new Show({ module: d.module, cues: d.cues, tele: d.tele, puppets: lc.puppets })
  show.captions = true
  d.module.setup?.(show) // as playSegment()
  show.resetMotion() // as tick() on the transport's new epoch: the cut
  const dt = 1 / fps
  let pending = null
  const ms = { frame: 0, draw: 0, read: 0, wait: 0 }
  // what the caption system shows each frame (the same state whether or not it is drawn): runs of
  // { n0, n1, key, … }. Visible = the bar's fade above half (line) or the laugh level above half.
  const runs = []
  const capOf = () => {
    const c = show.captionNow
    if (c && c.alpha > 0.5) return { type: 'line', who: c.who ?? null, name: c.name ?? '', kind: c.kind ?? 'say', text: String(c.text), words: c.words ? c.words.map((x) => x[2]) : null, wordT: c.words ? c.words.map((x) => x[0]) : null }
    if (!c && show.laughing > 0.5) return { type: 'sfx', text: show.signText === 'APPLAUSE' ? 'APPLAUSE' : 'LAUGHTER' }
    return null
  }
  for (let n = 0; n < frames; n++) {
    const t = n / fps
    show.captions = captions
    const a = performance.now()
    show.frame(t, dt, { light: false, paused: false })
    const cap = capOf()
    const key = cap ? `${cap.type}|${cap.who}|${cap.kind}|${cap.text}` : null
    const lastRun = runs[runs.length - 1]
    if (key && lastRun && lastRun.key === key && lastRun.n1 === n - 1) lastRun.n1 = n
    else if (key) runs.push({ ...cap, key, n0: n, n1: n })
    if (dry) continue
    const b = performance.now()
    st.draw(show, { captions })
    const c = performance.now()
    const px = st.ctx.getImageData(0, 0, w, h).data
    const e = performance.now()
    if (pending) {
      const r = await pending
      if (!r.ok) throw new Error(`sink: ${r.status} ${await r.text()}`)
    }
    ms.frame += b - a, ms.draw += c - b, ms.read += e - c, ms.wait += performance.now() - e
    // a Blob body uploads ~100× faster than a typed array (≈1 ms vs ≈270 ms for 8 MB), but the
    // blobs only go once collected, and a small JS heap never triggers GC: collect every 16 frames
    if (n % 16 === 15) window.gc?.()
    pending = fetch(`${sink}?n=${n}`, { method: 'POST', body: new Blob([px]) })
  }
  if (pending) {
    const r = await pending
    if (!r.ok) throw new Error(`sink: ${r.status} ${await r.text()}`)
  }
  for (const k in ms) ms[k] = +(ms[k] / frames).toFixed(1)
  return { k: st.k, glow: st.glowOn, w: st.canvas.width, h: st.canvas.height, ms, runs }
}

// ------------------------------------------------------------------ main
const tmp = await mkdtemp(join(tmpdir(), 'late-cluster-video-'))
let server = null, cleaned = false
const browsers = new Set()
async function cleanup(keepTmp = false) {
  if (cleaned) return
  cleaned = true
  for (const b of browsers) await b.close().catch(() => {})
  await server?.close().catch(() => {})
  if (keepTmp) console.error(`kept the temp folder (lossless frames): ${tmp}`)
  else await rm(tmp, { recursive: true, force: true }).catch(() => {})
}
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => cleanup().then(() => process.exit(130)))

const sinks = new Map() // job → { n, write(buf) }
function sinkPlugin() {
  return {
    name: 'late-cluster:video-sink',
    configureServer(s) {
      s.middlewares.use('/__video', (req, res) => {
        const job = sinks.get(req.url.split('?')[0].replace(/^\//, ''))
        const n = Number(new URL(req.url, 'http://x').searchParams.get('n'))
        const chunks = []
        req.on('data', (c) => chunks.push(c))
        req.on('end', async () => {
          try {
            if (!job) throw new Error('no such job')
            const buf = Buffer.concat(chunks)
            if (buf.length !== job.bytes) throw new Error(`frame ${n}: ${buf.length} bytes, wanted ${job.bytes}`)
            if (n !== job.n) throw new Error(`frame ${n} arrived, wanted ${job.n}`)
            job.n++
            await job.write(buf)
            res.end('ok')
          } catch (e) {
            res.statusCode = 500
            res.end(String(e.message))
          }
        })
      })
    },
  }
}

async function launch() {
  const { chromium } = await import('playwright')
  const gc = '--js-flags=--expose-gc'
  const gpu = ['--enable-gpu', '--use-angle=metal', '--ignore-gpu-blocklist', gc]
  try {
    return await chromium.launch({ channel: 'chromium', args: gpu })
  } catch (e) {
    console.warn(`GPU Chromium failed (${e.message.split('\n')[0]}); falling back to the default build`)
    return await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', gc] })
  }
}

const capRuns = new Map() // id → caption runs (frames of that segment)
/** task: { id, kind: 'clip' | 'yt' | 'subs', captions } */
async function renderSegment(task) {
  const { id, kind } = task
  const captions = task.captions ?? true
  const dry = kind === 'subs'
  const job = `${id}.${kind}`
  const i = rundown.indexOf(id)
  const frames = frameLimit ?? frameCounts[i]
  const t0 = Date.now()
  const vfile = join(tmp, kind === 'yt' ? `${id}.yt.mp4` : `${id}.video.mp4`)
  // with --bluesky (and the whole episode being rendered) a lossless sidecar of the same yuv420p
  // frames is kept for the run, so the posting cut is encoded from first-generation pictures
  const lossless = keepLossless && kind === 'clip' && captions ? join(tmp, `${id}.lossless.mkv`) : null
  const conv = 'scale=out_color_matrix=bt709:out_range=tv:flags=lanczos+accurate_rnd+full_chroma_int,format=yuv420p,setparams=color_primaries=bt709:color_trc=bt709:colorspace=bt709:range=tv'
  const outs = lossless
    ? ['-filter_complex', `[0:v]${conv},split=2[m][l]`, '-map', '[m]', ...X264([]), '-an', vfile, '-map', '[l]', '-c:v', 'libx264', '-qp', '0', '-preset', 'ultrafast', '-an', lossless]
    : ['-vf', conv, ...X264([]), '-an', vfile]
  const enc = dry ? null : spawn(FFMPEG, ['-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${W}x${H}`, '-framerate', String(FPS), '-i', 'pipe:0', ...outs], { stdio: ['pipe', 'ignore', 'pipe'] })
  const encErr = []
  enc?.stdin.on('error', (e) => encErr.push(Buffer.from(`stdin: ${e.message}\n`)))
  enc?.stderr.on('data', (b) => encErr.push(b))
  const encDone = dry ? Promise.resolve() : new Promise((res, rej) => enc.on('close', (c) => (c === 0 ? res() : rej(new Error(`ffmpeg (video ${id}) → ${c}\n${Buffer.concat(encErr).toString().slice(-2000)}`)))))
  let last = Date.now()
  if (!dry) sinks.set(job, {
    n: 0,
    bytes: W * H * 4,
    write: (buf) =>
      new Promise((res, rej) => {
        const n = sinks.get(job).n
        if (Date.now() - last > 15000 || n === frames) {
          last = Date.now()
          console.log(`  ${job}: ${n}/${frames} frames  (${((Date.now() - t0) / 1000).toFixed(0)} s)`)
        }
        if (enc.stdin.write(buf)) res()
        else enc.stdin.once('drain', res)
      }),
  })
  const browser = await launch()
  browsers.add(browser)
  try {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 + 46 }, deviceScaleFactor: scale })
    const page = await ctx.newPage()
    page.on('console', (m) => (m.type() === 'error' || m.type() === 'warning') && !/GPU stall|ReadPixels/.test(m.text()) && console.log(`  [${id}] ${m.type()}: ${m.text()}`))
    page.on('pageerror', (e) => console.log(`  [${id}] pageerror: ${e.message}`))
    await page.goto(`${url}?seg=title&t=0&freeze=1`, { waitUntil: 'load', timeout: 120000 })
    await page.waitForFunction(() => window.__ready === true, null, { timeout: 120000 })
    const gl = await page.evaluate(() => {
      try {
        const g = window.__lc.stage.gl.gl.getContext()
        const d = g.getExtension('WEBGL_debug_renderer_info')
        return d ? g.getParameter(d.UNMASKED_RENDERER_WEBGL) : '?'
      } catch (e) {
        return 'n/a'
      }
    })
    const info = await page.evaluate(pageRender, { id, frames, fps: FPS, sink: `/__video/${job}`, w: W, h: H, captions, dry })
    capRuns.set(id, info.runs)
    if (dry) console.log(`  ${id}: stepped ${frames} frames for subtitles (${info.runs.length} caption runs)`)
    else console.log(`  ${job}: rendered ${frames} frames at ${info.w}×${info.h}, captions ${captions ? 'on' : 'off'} (k ${info.k}, glow ${info.glow}, ${gl}; ms/frame ${JSON.stringify(info.ms)})`)
  } finally {
    await browser.close().catch(() => {})
    browsers.delete(browser)
    sinks.delete(job)
    enc?.stdin.end()
  }
  await encDone
  if (dry || kind === 'yt') return // the YouTube parts stay video-only in tmp until assembled
  const out = join(outDir, (frameLimit ? 'test-' : '') + clipName(id, !captions))
  const pcmFile = join(tmp, `${id}.f32`)
  await writeFile(pcmFile, await segmentPcm(id, frames))
  await run(FFMPEG, ['-v', 'error', '-y', '-i', vfile, '-f', 'f32le', '-ar', String(SR), '-ac', '2', '-i', pcmFile, '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy', ...VUI, ...AAC, '-movflags', '+faststart', out])
  await rm(vfile, { force: true })
  await rm(pcmFile, { force: true })
  const mb = ((await stat(out)).size / 1e6).toFixed(1)
  console.log(`${out}  ${frames} frames = ${(frames / FPS).toFixed(3)} s (cues ${durations[i]} s)  ${mb} MB  ${((Date.now() - t0) / 1000).toFixed(0)} s`)
}

try {
  const T0 = Date.now()
  const tasks = [...ids.map((id) => ({ id, kind: 'clip', captions: !noCaptions }))]
  if (youtube) tasks.push(...rundown.map((id) => ({ id, kind: 'yt', captions: false })))
  else if (subsOnly) tasks.push(...rundown.map((id) => ({ id, kind: 'subs' })))
  if (tasks.length) {
    {
      const { createServer } = await import('vite')
      server = await createServer({
        root: pkg,
        configFile: join(pkg, 'vite.config.js'),
        logLevel: 'error',
        cacheDir: join(tmp, 'vite'),
        clearScreen: false,
        plugins: [sinkPlugin()],
        server: { port: 0, strictPort: false, hmr: false, watch: null },
      })
      await server.listen()
      url = server.resolvedUrls.local[0]
    }
    if (!url.endsWith('/')) url += '/'
    if (!frameLimit) needCounts(tasks.map((x) => x.id))
    console.log(`rendering ${tasks.length} segment job(s) at ${W}×${H} ${FPS} fps, x264 ${preset} crf ${crf}, ${Math.min(jobs, tasks.length)} at a time → ${outDir}`)
    const queue = tasks.slice().sort((a, b) => frameCounts[rundown.indexOf(b.id)] - frameCounts[rundown.indexOf(a.id)]) // longest first
    let failed = 0
    await Promise.all(
      Array.from({ length: Math.min(jobs, queue.length) }, async () => {
        while (queue.length) {
          const task = queue.shift()
          try {
            await renderSegment(task)
          } catch (e) {
            failed++
            console.error(`${task.id} (${task.kind}): ${e.stack ?? e.message}`)
          }
        }
      }),
    )
    if (failed) throw new Error(`${failed} segment(s) failed`)
  }
  if ((all || fullOnly) && !frameLimit) await buildFull(tmp)
  if (bluesky && !frameLimit) await buildBluesky(tmp)
  if (youtube && !frameLimit) {
    await assemble(tmp, rundown.map((id) => join(tmp, `${id}.yt.mp4`)), `${YT}.mp4`)
    for (const id of rundown) await rm(join(tmp, `${id}.yt.mp4`), { force: true })
  }
  if ((youtube || subsOnly) && !frameLimit) await writeSubs()
  console.log(`done in ${((Date.now() - T0) / 1000).toFixed(0)} s`)
  await cleanup()
  process.exit(0)
} catch (e) {
  console.error(e.message)
  // a failure after the frames were rendered keeps the lossless sidecars for a look/retry
  await cleanup(keepLossless && rundown.some((id) => existsSync(join(tmp, `${id}.lossless.mkv`))))
  process.exit(1)
}
