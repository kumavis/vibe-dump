const clock = document.getElementById('clock')
const timeEl = document.getElementById('time')
const hexEl = document.getElementById('hex')

const pad = (n) => String(n).padStart(2, '0')

// Map hours/minutes/seconds straight onto an RGB hex string:
// 14:32:08 -> #143208. The clock literally *is* its own color.
function tick() {
  const now = new Date()
  const hh = pad(now.getHours())
  const mm = pad(now.getMinutes())
  const ss = pad(now.getSeconds())

  const hex = `#${hh}${mm}${ss}`
  timeEl.textContent = `${hh}:${mm}:${ss}`
  hexEl.textContent = hex

  clock.style.backgroundColor = hex
  // Pick readable text by the perceived brightness of the background.
  const r = parseInt(hh, 16)
  const g = parseInt(mm, 16)
  const b = parseInt(ss, 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  clock.style.color = luminance > 0.55 ? '#0b0c1e' : '#f8fafc'
}

tick()
setInterval(tick, 1000)
