// Small shared helpers: a seeded RNG (so the procedural die and board look the
// same on every load — the thumbnail depends on it), easing, and colour tables.

export function rng(seed = 1) {
  let s = seed >>> 0 || 1
  return () => {
    // mulberry32
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x))
export const lerp = (a, b, t) => a + (b - a) * t
export const smooth = (t) => {
  t = clamp(t)
  return t * t * (3 - 2 * t)
}
export const easeInOut = (t) => {
  t = clamp(t)
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}
// Sub-range of a step's progress: 0 before a, 1 after b, linear between.
export const span = (p, a, b) => clamp((p - a) / (b - a))
// Pulse that is 1 inside [a,b] with soft shoulders of width w.
export const window = (p, a, b, w = 0.04) => smooth((p - a + w) / w) * (1 - smooth((p - b) / w))

// The colour each CPU mode wears everywhere: in the logical-processor strip, on
// the die overlays, on the mode ladder. Amber for the 8086's real mode, green
// for the 386's protected mode, blue for AMD64's long mode.
export const MODE_COLORS = {
  off: '#1b1f2a',
  reset: '#3a3f52',
  wfs: '#6a2d43', // wait-for-SIPI: powered, halted, listening for a start-up IPI
  real: '#ffb547',
  prot: '#4fe08a',
  long: '#58a6ff',
  park: '#7d7fb8', // firmware parked it (hlt / mwait loop)
  os: '#f2f4ff',
}

export const MODE_LABEL = {
  off: 'unpowered',
  reset: 'in reset',
  wfs: 'wait-for-SIPI',
  real: '16-bit real mode',
  prot: '32-bit protected mode',
  long: '64-bit long mode',
  park: 'parked by firmware',
  os: 'running the OS',
}

// Activity colours used by the die/board glow, keyed by what kind of work is
// happening rather than by block.
export const ACT = {
  fetch: '#ffcf6b', // instruction fetch / code
  car: '#ff6bd5', // cache pinned as RAM
  dram: '#7cf2ff', // DRAM traffic
  train: '#ff8a3d', // memory training
  pcie: '#a78bff', // PCIe / config space
  power: '#ff4d4d', // power delivery
  mgmt: '#5ef0b0', // management engines (CSME/PMC)
  ipi: '#ffffff', // inter-processor interrupts
  gpu: '#6bffb0',
}

export function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export function fmtTime(s) {
  if (s <= 0) return '0'
  const units = [
    [1e-9, 'ns'],
    [1e-6, 'µs'],
    [1e-3, 'ms'],
    [1, 's'],
  ]
  let u = units[0]
  for (const cand of units) if (s >= cand[0]) u = cand
  const v = s / u[0]
  const digits = v >= 100 ? 0 : v >= 10 ? 1 : 2
  return `${v.toFixed(digits)} ${u[1]}`
}
