// Split the greeting into per-letter spans so each can react to the cursor.
const greeting = document.getElementById('greeting')
const text = greeting.textContent
greeting.textContent = ''

const letters = [...text].map((char) => {
  const span = document.createElement('span')
  span.textContent = char === ' ' ? ' ' : char
  greeting.appendChild(span)
  return span
})

// On mouse move, lift the letters nearest the cursor — a little "wave".
window.addEventListener('pointermove', (event) => {
  for (const span of letters) {
    const rect = span.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const distance = Math.abs(event.clientX - cx)
    const lift = Math.max(0, 1 - distance / 160)
    span.style.transform = `translateY(${-lift * 26}px)`
  }
})

window.addEventListener('pointerleave', () => {
  for (const span of letters) span.style.transform = 'translateY(0)'
})
