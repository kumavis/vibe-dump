// Pitch material: scales, note naming, and MIDI/frequency conversion.

export const SCALES = [
  { id: 'minor-pentatonic', name: 'Minor Pentatonic', mood: 'plain, safe, folk', steps: [0, 3, 5, 7, 10] },
  { id: 'major-pentatonic', name: 'Major Pentatonic', mood: 'open, pastoral', steps: [0, 2, 4, 7, 9] },
  { id: 'hirajoshi', name: 'Hirajoshi', mood: 'Japanese, shakuhachi-adjacent', steps: [0, 2, 3, 7, 8] },
  { id: 'in-sen', name: 'In Sen', mood: 'austere, hollow', steps: [0, 1, 5, 7, 10] },
  { id: 'kumoi', name: 'Kumoi', mood: 'bittersweet, floating', steps: [0, 2, 3, 7, 9] },
  { id: 'dorian', name: 'Dorian', mood: 'wistful but not sad', steps: [0, 2, 3, 5, 7, 9, 10] },
  { id: 'aeolian', name: 'Aeolian', mood: 'plainly minor', steps: [0, 2, 3, 5, 7, 8, 10] },
  { id: 'lydian', name: 'Lydian', mood: 'bright, weightless', steps: [0, 2, 4, 6, 7, 9, 11] },
  { id: 'mixolydian', name: 'Mixolydian', mood: 'warm, modal', steps: [0, 2, 4, 5, 7, 9, 10] },
  { id: 'phrygian', name: 'Phrygian', mood: 'dark, andalusian', steps: [0, 1, 3, 5, 7, 8, 10] },
  { id: 'harmonic-minor', name: 'Harmonic Minor', mood: 'exotic tension', steps: [0, 2, 3, 5, 7, 8, 11] },
  { id: 'whole-tone', name: 'Whole Tone', mood: 'dreamlike, ungrounded', steps: [0, 2, 4, 6, 8, 10] },
  { id: 'chromatic', name: 'Chromatic', mood: 'no gravity at all', steps: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
]

export const SCALE_BY_ID = Object.fromEntries(SCALES.map((s) => [s.id, s]))

export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

export const midiToFreq = (midi) => 440 * Math.pow(2, (midi - 69) / 12)
export const freqToMidi = (freq) => 69 + 12 * Math.log2(freq / 440)

export function midiToName(midi) {
  const m = Math.round(midi)
  return `${NOTE_NAMES[((m % 12) + 12) % 12]}${Math.floor(m / 12) - 1}`
}

/**
 * All scale degrees (as MIDI numbers) inside [lo, hi], ascending.
 * `root` is a pitch class 0-11.
 */
export function scaleNotesInRange(root, steps, lo, hi) {
  const set = new Set(steps.map((s) => (((s + root) % 12) + 12) % 12))
  const out = []
  for (let m = Math.ceil(lo); m <= Math.floor(hi); m++) {
    if (set.has(((m % 12) + 12) % 12)) out.push(m)
  }
  return out
}

/** Nearest member of `notes` to `midi`; ties go downward (flutes sigh). */
export function snapToScale(midi, notes) {
  if (notes.length === 0) return Math.round(midi)
  let best = notes[0]
  let bestD = Infinity
  for (const n of notes) {
    const d = Math.abs(n - midi)
    if (d < bestD - 1e-9) {
      bestD = d
      best = n
    }
  }
  return best
}

// Playable window of the instrument family, in MIDI numbers.
// Bass flute bottoms out around C3 (48); a piccolo tops out around C8, but the
// synthesis stops being flute-like long before that, so we cap at C7 (96).
export const FLUTE_MIN = 48
export const FLUTE_MAX = 96

// Named register bands, used by the presets and the range readout.
export const REGISTERS = [
  { id: 'drone', name: 'Drone', lo: 48, hi: 62 },
  { id: 'low', name: 'Low', lo: 55, hi: 72 },
  { id: 'mid', name: 'Middle', lo: 62, hi: 84 },
  { id: 'high', name: 'High', lo: 74, hi: 96 },
  { id: 'full', name: 'Full', lo: 52, hi: 92 },
]
