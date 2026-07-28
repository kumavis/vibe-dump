// The session file.
//
// It carries two things: the settings, so you can keep improvising in the same
// style, and the concrete notes, so playback is identical even if the
// generator changes later. The notes are the truth for playback; the settings
// are the truth for "make more like this".

import { DEFAULT_SETTINGS } from './generator.js'

export const FORMAT = 'flute-machine.session'
export const FORMAT_VERSION = 1

/** Round-trip a performance. Times are absolute seconds from the start. */
export function toSession({ score, settings, seed, presetId, tone, title }) {
  const duration = score.reduce((m, n) => Math.max(m, n.t + n.d), 0)
  return {
    format: FORMAT,
    formatVersion: FORMAT_VERSION,
    app: 'flute-machine',
    createdAt: new Date().toISOString(),
    title: title || 'flute machine take',
    duration: Math.round(duration * 1000) / 1000,
    seed,
    presetId: presetId ?? null,
    settings: { ...settings },
    tone: { ...tone },
    notes: score.map((n) => ({
      t: round(n.t, 4),
      d: round(n.d, 4),
      midi: n.midi,
      vel: round(n.vel, 3),
      ...(n.slur ? { slur: 1 } : {}),
      ...(n.bendCents ? { bend: round(n.bendCents, 1) } : {}),
      ...(n.portamento ? { porta: round(n.portamento, 3) } : {}),
      ...(n.flutter ? { flutter: round(n.flutter, 1) } : {}),
    })),
  }
}

const round = (x, n) => {
  const f = Math.pow(10, n)
  return Math.round(x * f) / f
}

/**
 * Read a session file. Tolerant of missing fields — anything absent falls back
 * to a default — but a file without notes is an error, because there would be
 * nothing to play.
 */
export function fromSession(json) {
  if (!json || typeof json !== 'object') throw new Error('Not a session file.')
  if (json.format !== FORMAT) throw new Error('This is not a Flute Machine session file.')
  if (!Array.isArray(json.notes) || json.notes.length === 0) {
    throw new Error('That session has no notes in it.')
  }
  if (json.formatVersion > FORMAT_VERSION) {
    throw new Error(`That file was made by a newer version (format ${json.formatVersion}).`)
  }

  const notes = json.notes
    .filter((n) => Number.isFinite(n.t) && Number.isFinite(n.midi))
    .map((n) => ({
      t: Math.max(0, +n.t),
      d: Math.max(0.02, +n.d || 0.25),
      midi: Math.max(24, Math.min(108, +n.midi)),
      vel: Math.max(0.02, Math.min(1, +n.vel || 0.7)),
      slur: !!n.slur,
      bendCents: +n.bend || 0,
      portamento: +n.porta || 0,
      flutter: +n.flutter || 0,
    }))
    .sort((a, b) => a.t - b.t)

  if (!notes.length) throw new Error('No usable notes in that session.')

  return {
    notes,
    settings: { ...DEFAULT_SETTINGS, ...(json.settings || {}) },
    tone: { breathiness: 0.4, vibrato: 0.5, brightness: 0.5, ...(json.tone || {}) },
    seed: Number.isFinite(json.seed) ? json.seed >>> 0 : 1,
    presetId: json.presetId ?? null,
    title: json.title || 'loaded take',
  }
}

/** A filename that sorts usefully and does not collide. */
export function stamp(ext) {
  const d = new Date()
  const p = (x) => String(x).padStart(2, '0')
  return `flute-machine-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(
    d.getMinutes()
  )}${p(d.getSeconds())}.${ext}`
}
