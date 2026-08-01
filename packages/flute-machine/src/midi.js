// Standard MIDI File (type 0) writer.
//
// MIDI is the "take it somewhere else" format: it keeps the notes and their
// timing but loses everything that makes this thing sound like a flute —
// breath noise, the chiff, the way vibrato swells in. The JSON session format
// is the one that replays faithfully here; this one is for your DAW.

const PPQ = 480 // ticks per quarter note
const BPM = 120 // fixed; the generator thinks in seconds, not beats
const TICKS_PER_SECOND = (PPQ * BPM) / 60

/** Variable-length quantity, as MIDI files encode delta times. */
function vlq(value) {
  const bytes = [value & 0x7f]
  let v = value >>> 7
  while (v > 0) {
    bytes.unshift((v & 0x7f) | 0x80)
    v >>>= 7
  }
  return bytes
}

function pushString(arr, str) {
  for (let i = 0; i < str.length; i++) arr.push(str.charCodeAt(i))
}

function pushUint32(arr, v) {
  arr.push((v >>> 24) & 0xff, (v >>> 16) & 0xff, (v >>> 8) & 0xff, v & 0xff)
}

/**
 * Encode note events as a type-0 SMF.
 *
 * `notes` are `{ time, duration, midi, velocity }` with times in seconds.
 * Pitched ornaments that live below the note level (vibrato, bends) are not
 * represented; overblown and flutter notes come through as ordinary notes.
 */
export function encodeMidi(notes, { name = 'Flute Machine' } = {}) {
  const events = []
  for (const n of notes) {
    const pitch = Math.max(0, Math.min(127, Math.round(n.midi)))
    const vel = Math.max(1, Math.min(127, Math.round((n.velocity ?? 0.7) * 127)))
    const onTick = Math.max(0, Math.round(n.time * TICKS_PER_SECOND))
    const offTick = Math.max(onTick + 1, Math.round((n.time + n.duration) * TICKS_PER_SECOND))
    events.push({ tick: onTick, order: 1, bytes: [0x90, pitch, vel] })
    events.push({ tick: offTick, order: 0, bytes: [0x80, pitch, 0x40] })
  }
  // Note-offs sort before note-ons at the same tick so repeated pitches
  // retrigger instead of hanging.
  events.sort((a, b) => a.tick - b.tick || a.order - b.order)

  const track = []

  // Track name.
  track.push(...vlq(0), 0xff, 0x03, ...vlq(name.length))
  pushString(track, name)

  // Tempo (microseconds per quarter note).
  const usPerQuarter = Math.round(60000000 / BPM)
  track.push(...vlq(0), 0xff, 0x51, 0x03)
  track.push((usPerQuarter >> 16) & 0xff, (usPerQuarter >> 8) & 0xff, usPerQuarter & 0xff)

  // Program change: 73 = Flute (GM, 0-indexed).
  track.push(...vlq(0), 0xc0, 73)

  let last = 0
  for (const ev of events) {
    track.push(...vlq(ev.tick - last), ...ev.bytes)
    last = ev.tick
  }

  // End of track.
  track.push(...vlq(0), 0xff, 0x2f, 0x00)

  const bytes = []
  pushString(bytes, 'MThd')
  pushUint32(bytes, 6)
  bytes.push(0x00, 0x00) // format 0
  bytes.push(0x00, 0x01) // one track
  bytes.push((PPQ >> 8) & 0xff, PPQ & 0xff)
  pushString(bytes, 'MTrk')
  pushUint32(bytes, track.length)
  bytes.push(...track)

  return new Blob([new Uint8Array(bytes)], { type: 'audio/midi' })
}
