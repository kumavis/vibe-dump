// AudioBuffer -> 16-bit PCM WAV.
//
// The alternative was MediaRecorder, but that only gives you webm/opus, only
// records in real time, and is lossy. Rendering the score through an
// OfflineAudioContext and encoding the result ourselves is deterministic,
// faster than realtime, and produces a file that opens anywhere.

/** Encode an AudioBuffer (mono or stereo) as a 16-bit PCM WAV Blob. */
export function encodeWav(buffer) {
  const channels = Math.min(2, buffer.numberOfChannels)
  const frames = buffer.length
  const sampleRate = buffer.sampleRate
  const bytesPerSample = 2
  const blockAlign = channels * bytesPerSample
  const dataBytes = frames * blockAlign

  const out = new ArrayBuffer(44 + dataBytes)
  const view = new DataView(out)

  const ascii = (offset, str) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i))
  }

  ascii(0, 'RIFF')
  view.setUint32(4, 36 + dataBytes, true)
  ascii(8, 'WAVE')
  ascii(12, 'fmt ')
  view.setUint32(16, 16, true) // PCM chunk size
  view.setUint16(20, 1, true) // format = PCM
  view.setUint16(22, channels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * blockAlign, true) // byte rate
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, 8 * bytesPerSample, true)
  ascii(36, 'data')
  view.setUint32(40, dataBytes, true)

  const data = []
  for (let c = 0; c < channels; c++) data.push(buffer.getChannelData(c))

  let offset = 44
  for (let i = 0; i < frames; i++) {
    for (let c = 0; c < channels; c++) {
      // Clamp before scaling so a hot mix wraps around to silence rather than
      // to a full-scale click.
      const s = Math.max(-1, Math.min(1, data[c][i]))
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true)
      offset += 2
    }
  }

  return new Blob([out], { type: 'audio/wav' })
}

/** Trigger a browser download for a Blob. */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  // Revoke on the next turn — revoking synchronously can cancel the download
  // in some browsers.
  setTimeout(() => URL.revokeObjectURL(url), 10000)
}
