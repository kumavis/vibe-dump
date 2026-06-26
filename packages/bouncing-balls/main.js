const canvas = document.getElementById('scene')
const ctx = canvas.getContext('2d')

let width = 0
let height = 0
const dpr = Math.min(window.devicePixelRatio || 1, 2)

function resize() {
  width = window.innerWidth
  height = window.innerHeight
  canvas.width = width * dpr
  canvas.height = height * dpr
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
}
resize()
window.addEventListener('resize', resize)

const COLORS = ['#f472b6', '#818cf8', '#22d3ee', '#34d399', '#facc15', '#fb7185']
const GRAVITY = 0.25
const balls = []

function spawn(x, y) {
  const radius = 8 + Math.random() * 26
  balls.push({
    x: x ?? Math.random() * width,
    y: y ?? Math.random() * height * 0.5,
    vx: (Math.random() - 0.5) * 8,
    vy: (Math.random() - 0.5) * 4,
    radius,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  })
}

for (let i = 0; i < 18; i++) spawn()

canvas.addEventListener('pointerdown', (event) => {
  for (let i = 0; i < 5; i++) spawn(event.clientX, event.clientY)
})

function step() {
  // Translucent fill instead of clear, so the orbs leave fading trails.
  ctx.fillStyle = 'rgba(5, 6, 15, 0.25)'
  ctx.fillRect(0, 0, width, height)

  for (const ball of balls) {
    ball.vy += GRAVITY
    ball.x += ball.vx
    ball.y += ball.vy

    if (ball.x - ball.radius < 0) {
      ball.x = ball.radius
      ball.vx *= -0.85
    } else if (ball.x + ball.radius > width) {
      ball.x = width - ball.radius
      ball.vx *= -0.85
    }
    if (ball.y + ball.radius > height) {
      ball.y = height - ball.radius
      ball.vy *= -0.8
      ball.vx *= 0.98
    }

    ctx.beginPath()
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
    ctx.fillStyle = ball.color
    ctx.shadowColor = ball.color
    ctx.shadowBlur = 24
    ctx.fill()
    ctx.shadowBlur = 0
  }

  // Keep the population in check so clicks stay fun but cheap.
  if (balls.length > 120) balls.splice(0, balls.length - 120)

  requestAnimationFrame(step)
}

step()
