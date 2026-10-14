// Graphics autodetect. Two halves, both pure so they can be unit-tested
// without a browser:
//
//   detectRung()      a first guess from the GPU name, core count, memory and
//                     how many pixels the tier would have to fill
//   TierController    watches real frame times and steps along the ladder —
//                     down when frames are slow, up at most once — and keeps a
//                     change only if it measurably helped, so it never thrashes
//
// The ladder runs cheapest first. Each rung is a quality tier (see QUALITY in
// ui/menus.js) plus the pixel ratio it renders at; sub-1 ratios on Low are the
// last resort for very slow GPUs, and the 1.25 rung trims Medium on high-DPI
// screens before giving up its shadows.

export const RUNGS = [
  ['low', 0.7],
  ['low', 0.85],
  ['low', 1],
  ['medium', 1.25],
  ['medium', 1.5],
  ['high', 2],
]

// GPU classes: where they start and how many megapixels they can fill at that
// tier before we would rather lower the resolution (or the tier).
export const GPU_CLASSES = {
  software: { tier: 'low', budget: 1.2 },
  mobileLow: { tier: 'low', budget: 1.3 },
  mobile: { tier: 'medium', budget: 2.2 },
  integratedLow: { tier: 'low', budget: 2.2 },
  integrated: { tier: 'medium', budget: 3.8 },
  discrete: { tier: 'high', budget: 8.5 },
  unknown: { tier: 'medium', budget: 3.8 },
}

const TIER_ORDER = ['low', 'medium', 'high']

// Frame-time rules. Times are frame intervals in milliseconds; a window is
// judged by its mean with the slowest tenth trimmed off (so a hitch doesn't
// count, but a 16/33 ms vsync stutter does) and by its 90th percentile.
export const ADAPT = {
  warmup: 20, // frames ignored at start and after every change (shader compiles, vegetation rebuilds)
  minFrames: 40, // a measuring window needs this many frames…
  minSeconds: 1.5, // …and this much time,
  maxSeconds: 6, // or this much time with at least `slowFrames` frames on a very slow device
  slowFrames: 8,
  slowMs: 26, // mean above this (under ~38 fps) steps down
  verySlowMs: 55, // mean above this (under ~18 fps) steps down two rungs
  fastMs: 18.5, // 90th percentile under this (~54 fps and steady) counts toward the one upgrade
  fastWindows: 2, // consecutive fast windows before upgrading
  helped: 0.92, // a downgrade is kept only if the mean dropped below this fraction
  severeMs: 45, // once settled, only a mean above this (under ~22 fps)…
  severeWindows: 2, // …for this many windows in a row still steps down
  maxSample: 4000, // longer gaps are a background tab or a debugger, not the GPU
}

// Ladder for this screen: rungs that would render identically (a 1× screen
// gives Medium 1.25 and 1.5 the same pixels) collapse into one.
export function buildLadder(dpr = 1) {
  const ladder = []
  for (const [tier, pr] of RUNGS) {
    const pixelRatio = pr < 1 ? pr * Math.min(1, dpr) : Math.min(pr, dpr)
    const prev = ladder[ladder.length - 1]
    if (prev && prev.tier === tier && Math.abs(prev.pixelRatio - pixelRatio) < 0.01) continue
    ladder.push({ tier, pixelRatio })
  }
  return ladder
}

// Sort a WebGL renderer string into a GPU class.
export function classifyGpu(renderer = '', vendor = '', mobile = false) {
  const s = `${renderer} ${vendor}`.toLowerCase()
  if (!s.trim()) return 'unknown'
  if (/swiftshader|llvmpipe|softpipe|lavapipe|software|basic render|mesa offscreen/.test(s)) return 'software'
  const apple = s.match(/apple m(\d+)\s*(pro|max|ultra)?/)
  if (apple) return apple[2] ? 'discrete' : 'integrated'
  if (/apple gpu|apple/.test(s)) return mobile ? 'mobile' : 'integrated'
  const adreno = s.match(/adreno\D*(\d+)/)
  if (adreno) return Number(adreno[1]) >= 700 ? 'mobile' : 'mobileLow'
  if (/immortalis|mali-?g7\d/.test(s)) return 'mobile'
  if (/mali|powervr|img tec|videocore|vivante|tegra/.test(s)) return 'mobileLow'
  if (/nvidia|geforce|quadro|rtx|gtx|tesla/.test(s)) return /\bmx\s?\d|geforce\s?(gt\s|\d{3}m\b)|\bnvs\b|\bion\b/.test(s) ? 'integrated' : 'discrete'
  if (/intel/.test(s)) {
    if (/\barc\b/.test(s)) return 'discrete'
    if (/iris/.test(s)) return 'integrated'
    return 'integratedLow'
  }
  if (/radeon|amd|\bati\b/.test(s)) {
    if (/\brx\s?\d|radeon pro|r9\s|vega\s?(56|64)|\bw\d{4}\b/.test(s)) return 'discrete'
    if (/radeon\s?r[2-5]\b|\bhd\s?\d{4}/.test(s)) return 'integratedLow'
    return 'integrated'
  }
  return mobile ? 'mobileLow' : 'unknown'
}

// First guess. `info`: { renderer, vendor, cores, memory, width, height, dpr, mobile }.
// Returns the ladder index plus what led to it.
export function detectRung(info, ladder = buildLadder(info.dpr)) {
  const gpu = classifyGpu(info.renderer, info.vendor, info.mobile)
  const cls = GPU_CLASSES[gpu]
  let tier = cls.tier
  const why = [gpu]
  // the simulation and vegetation also cost CPU: small machines cap the tier
  const cap = (t, reason) => {
    if (TIER_ORDER.indexOf(tier) > TIER_ORDER.indexOf(t)) {
      tier = t
      why.push(reason)
    }
  }
  if ((info.cores && info.cores <= 2) || (info.memory && info.memory <= 2)) cap('low', 'few cores/little memory')
  else if ((info.cores && info.cores <= 4) || (info.memory && info.memory <= 4)) cap('medium', '4 cores/4 GB')
  let top = 0
  ladder.forEach((r, i) => {
    if (r.tier === tier) top = i
  })
  // then fit the pixel count into what this class of GPU can fill
  const css = (info.width || 1280) * (info.height || 800)
  const budget = cls.budget * 1e6 * 1.15
  let index = top
  while (index > 0 && css * ladder[index].pixelRatio ** 2 > budget) index--
  if (index !== top) why.push(`${(css / 1e6).toFixed(1)} MP screen`)
  return { index, gpu, reason: why.join(', ') }
}

// Read the GPU name from a WebGL context. Firefox and Safari may only give a
// generic name, which classifies as `unknown` (a Medium start).
export function readGpuInfo(gl) {
  let renderer = ''
  let vendor = ''
  try {
    const ext = gl.getExtension('WEBGL_debug_renderer_info')
    renderer = String(gl.getParameter(ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER) || '')
    vendor = String(gl.getParameter(ext ? ext.UNMASKED_VENDOR_WEBGL : gl.VENDOR) || '')
  } catch {
    /* context lost or extension blocked */
  }
  const nav = typeof navigator === 'undefined' ? {} : navigator
  return {
    renderer,
    vendor,
    cores: nav.hardwareConcurrency || 0,
    memory: nav.deviceMemory || 0,
    mobile: typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches,
  }
}

// Feed it frame intervals; it answers with a move ({ index, from, reason }) or
// null. Rules, in order:
//   - after a downgrade, keep it only if the mean improved; otherwise go back
//     up and stop for good (a 30 fps cap or a CPU-bound scene isn't the GPU)
//   - after the one upgrade, go back down and stop if the frames got slow
//   - slow windows step down (two rungs if very slow); a downgrade also spends
//     the upgrade, since a higher rung was just shown to be too slow
//   - fast, steady windows earn the one upgrade
//   - once settled (after the opening of play), only severe slowness moves it
export class TierController {
  constructor(ladder, index, opts = {}) {
    this.ladder = ladder
    this.index = Math.max(0, Math.min(ladder.length - 1, index))
    this.o = { ...ADAPT, ...opts }
    this.upgrades = 1
    this.settled = false
    this.done = false
    this.pending = null // the last move, judged by the next window
    this.fast = 0
    this.severe = 0
    this.moves = []
    this.restart()
  }

  get rung() {
    return this.ladder[this.index]
  }

  restart() {
    this.samples = []
    this.seconds = 0
    this.skip = this.o.warmup
  }

  settle() {
    this.settled = true
  }

  sample(ms) {
    if (this.done || !(ms > 0) || ms > this.o.maxSample) return null
    if (this.skip > 0) {
      this.skip--
      return null
    }
    const o = this.o
    this.samples.push(ms)
    this.seconds += ms / 1000
    const n = this.samples.length
    if (!((n >= o.minFrames && this.seconds >= o.minSeconds) || (n >= o.slowFrames && this.seconds >= o.maxSeconds))) return null
    const sorted = this.samples.sort((a, b) => a - b)
    const keep = Math.max(1, Math.floor(n * 0.9))
    let sum = 0
    for (let i = 0; i < keep; i++) sum += sorted[i]
    const mean = sum / keep
    const p90 = sorted[Math.min(n - 1, keep)]
    this.samples = []
    this.seconds = 0
    this.last = { mean, p90 }
    return this.decide(mean, p90)
  }

  decide(mean, p90) {
    const o = this.o
    const judged = this.pending
    this.pending = null
    if (judged) {
      if (judged.dir < 0 && mean > judged.mean * o.helped) return this.stop(judged.from, 'downgrade did not help')
      if (judged.dir > 0 && mean > o.slowMs) return this.stop(judged.from, 'upgrade did not hold')
    }
    if (this.settled) {
      this.severe = mean > o.severeMs ? this.severe + 1 : 0
      if (this.severe >= o.severeWindows && this.index > 0) {
        this.severe = 0
        return this.move(-1, mean, 'severe slowdown')
      }
      return null
    }
    if (mean > o.slowMs && this.index > 0) {
      this.upgrades = 0
      this.fast = 0
      return this.move(mean > o.verySlowMs ? -2 : -1, mean, `mean ${mean.toFixed(1)} ms`)
    }
    if (p90 < o.fastMs && this.upgrades > 0 && this.index < this.ladder.length - 1) {
      if (++this.fast >= o.fastWindows) {
        this.upgrades--
        this.fast = 0
        return this.move(1, mean, `p90 ${p90.toFixed(1)} ms`)
      }
    } else this.fast = 0
    return null
  }

  move(steps, mean, reason) {
    const from = this.index
    this.index = Math.max(0, Math.min(this.ladder.length - 1, from + steps))
    this.pending = { dir: Math.sign(steps), from, mean }
    this.restart()
    const m = { index: this.index, from, reason }
    this.moves.push(m)
    return m
  }

  // revert to a known-good rung and stop adapting
  stop(index, reason) {
    const from = this.index
    this.index = index
    this.done = true
    const m = { index, from, reason }
    this.moves.push(m)
    return m
  }
}
