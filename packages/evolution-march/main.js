// Evolution March — a cartoony Canvas 2D journey through 10 eras of life,
// from primordial soup to a solar-punk future. Auto-advances and loops.

const canvas = document.getElementById('stage')
const ctx = canvas.getContext('2d')
const eraLabel = document.getElementById('era-label')
const progressBar = document.getElementById('progress-bar')

// --- Sizing / hi-dpi handling -------------------------------------------
let W = 0
let H = 0
let DPR = 1

function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2)
  W = window.innerWidth
  H = window.innerHeight
  canvas.width = Math.floor(W * DPR)
  canvas.height = Math.floor(H * DPR)
  canvas.style.width = W + 'px'
  canvas.style.height = H + 'px'
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
}
window.addEventListener('resize', resize)
resize()

// --- Small drawing helpers ----------------------------------------------
function lerp(a, b, t) {
  return a + (b - a) * t
}

// Vertical sky gradient from two colors.
function sky(top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, H)
  g.addColorStop(0, top)
  g.addColorStop(1, bottom)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)
}

// Filled circle.
function circle(x, y, r, color) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fill()
}

// Rounded rect path.
function roundRect(x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

// A lumpy cartoon ground band hugging the bottom.
function ground(color, heightFrac) {
  const top = H * (1 - heightFrac)
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(0, H)
  ctx.lineTo(0, top + 10)
  for (let x = 0; x <= W; x += 60) {
    const y = top + Math.sin((x / W) * Math.PI * 4) * 8
    ctx.lineTo(x, y)
  }
  ctx.lineTo(W, H)
  ctx.closePath()
  ctx.fill()
}

// Sun / glow disc.
function sun(x, y, r, core, halo) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r * 2.4)
  g.addColorStop(0, core)
  g.addColorStop(0.4, core)
  g.addColorStop(1, halo)
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(x, y, r * 2.4, 0, Math.PI * 2)
  ctx.fill()
}

// --- The ten eras --------------------------------------------------------
// Each era: label, sky colors, and a draw(t) where t is anim time in seconds.
const eras = [
  {
    label: 'Primordial Soup',
    sky: ['#3a1f4d', '#7a2e5a'],
    draw(t) {
      sky('#3a1f4d', '#7a2e5a')
      // murky soup
      ground('#5e2a55', 0.45)
      // rising bubbles
      for (let i = 0; i < 40; i++) {
        const x = (i * 137.5) % W
        const speed = 30 + (i % 5) * 12
        const y = H - ((t * speed + i * 60) % (H + 40))
        const r = 4 + (i % 4) * 3
        ctx.globalAlpha = 0.5
        circle(x, y, r, '#b86fa8')
        ctx.globalAlpha = 1
      }
      // wiggly microorganisms
      for (let i = 0; i < 6; i++) {
        const cx = W * (0.15 + i * 0.13)
        const cy = H * 0.55 + Math.sin(t * 2 + i) * 24
        circle(cx, cy, 26, '#ffd1f0')
        circle(cx, cy, 12, '#9b2d7a')
        // flagellum tail
        ctx.strokeStyle = '#ffd1f0'
        ctx.lineWidth = 4
        ctx.beginPath()
        ctx.moveTo(cx + 24, cy)
        ctx.quadraticCurveTo(cx + 48, cy + Math.sin(t * 6 + i) * 18, cx + 64, cy)
        ctx.stroke()
      }
    },
  },
  {
    label: 'First Fish',
    sky: ['#16466b', '#0b6e8f'],
    draw(t) {
      sky('#16466b', '#0b6e8f')
      // light shafts
      ctx.globalAlpha = 0.12
      for (let i = 0; i < 6; i++) {
        ctx.fillStyle = '#bff0ff'
        ctx.beginPath()
        const sx = (i / 6) * W
        ctx.moveTo(sx, 0)
        ctx.lineTo(sx + 60, 0)
        ctx.lineTo(sx + 160, H)
        ctx.lineTo(sx + 100, H)
        ctx.closePath()
        ctx.fill()
      }
      ctx.globalAlpha = 1
      ground('#0a5468', 0.22)
      // seaweed
      for (let i = 0; i < 10; i++) {
        const x = W * (i / 10) + 30
        ctx.strokeStyle = '#2fbf8f'
        ctx.lineWidth = 8
        ctx.beginPath()
        ctx.moveTo(x, H)
        ctx.quadraticCurveTo(x + Math.sin(t * 2 + i) * 30, H - 90, x + Math.sin(t + i) * 20, H - 160)
        ctx.stroke()
      }
      // schooling fish
      for (let i = 0; i < 14; i++) {
        const x = ((t * 90 + i * 90) % (W + 120)) - 60
        const y = H * 0.3 + Math.sin(t * 2 + i) * 30 + (i % 3) * 40
        drawFish(x, y, 26, '#ffd76a', t)
      }
    },
  },
  {
    label: 'Onto Land',
    sky: ['#5fae6b', '#cfe98a'],
    draw(t) {
      sky('#7ec0a4', '#cfe98a')
      sun(W * 0.78, H * 0.22, 36, '#fff6c8', 'rgba(255,246,200,0)')
      // water on left, mud bank on right
      ctx.fillStyle = '#3f9fb0'
      ctx.fillRect(0, H * 0.62, W * 0.45, H)
      ground('#7a5a3a', 0.34)
      // reeds
      for (let i = 0; i < 8; i++) {
        const x = W * 0.5 + i * 40
        ctx.strokeStyle = '#3e8e4a'
        ctx.lineWidth = 5
        ctx.beginPath()
        ctx.moveTo(x, H)
        ctx.lineTo(x + Math.sin(t + i) * 10, H - 130)
        ctx.stroke()
      }
      // amphibian crawling out
      const ax = lerp(W * 0.3, W * 0.6, (Math.sin(t * 0.6) + 1) / 2)
      const ay = H * 0.68
      drawAmphibian(ax, ay, t)
    },
  },
  {
    label: 'Age of Dinosaurs',
    sky: ['#b5532e', '#f0a85a'],
    draw(t) {
      sky('#b5532e', '#f0a85a')
      sun(W * 0.2, H * 0.3, 50, '#ffe0a0', 'rgba(255,224,160,0)')
      // volcano silhouettes
      ctx.fillStyle = '#5a2f24'
      for (let i = 0; i < 3; i++) {
        const bx = W * (0.2 + i * 0.3)
        ctx.beginPath()
        ctx.moveTo(bx - 140, H * 0.7)
        ctx.lineTo(bx, H * 0.35)
        ctx.lineTo(bx + 140, H * 0.7)
        ctx.closePath()
        ctx.fill()
      }
      ground('#4a6b32', 0.28)
      // big sauropod
      drawDino(W * 0.55 + Math.sin(t * 0.4) * 30, H * 0.68, t)
    },
  },
  {
    label: 'Early Mammals',
    sky: ['#9fc8e8', '#e8f3d8'],
    draw(t) {
      sky('#9fc8e8', '#e8f3d8')
      sun(W * 0.8, H * 0.2, 40, '#fffbe0', 'rgba(255,251,224,0)')
      // rolling hills
      ctx.fillStyle = '#8fb86a'
      hill(0.6, '#8fb86a')
      hill(0.5, '#7aa858')
      ground('#5f9242', 0.2)
      // trees
      for (let i = 0; i < 5; i++) drawTree(W * (0.12 + i * 0.2), H * 0.78, 1)
      // small furry mammal hopping
      for (let i = 0; i < 3; i++) {
        const x = ((t * 70 + i * 220) % (W + 100)) - 50
        const hop = Math.abs(Math.sin(t * 4 + i)) * 24
        drawMammal(x, H * 0.82 - hop, t)
      }
    },
  },
  {
    label: 'Early Humans',
    sky: ['#36304f', '#a85c3c'],
    draw(t) {
      sky('#36304f', '#a85c3c')
      circle(W * 0.82, H * 0.22, 30, '#f6efd0') // moon
      ground('#3a2e26', 0.26)
      // cave mouth
      ctx.fillStyle = '#241d18'
      ctx.beginPath()
      ctx.ellipse(W * 0.2, H * 0.78, 120, 90, 0, Math.PI, Math.PI * 2)
      ctx.fill()
      // campfire with flicker
      const fx = W * 0.55
      const fy = H * 0.82
      const flick = 1 + Math.sin(t * 12) * 0.18
      ctx.fillStyle = '#5a3a22'
      ctx.fillRect(fx - 26, fy + 6, 52, 8)
      sun(fx, fy - 6, 26 * flick, '#ffd24a', 'rgba(255,120,30,0)')
      circle(fx, fy - 10, 14 * flick, '#fff0a0')
      // a couple of figures by the fire
      drawHuman(fx - 90, fy, '#caa37a', t)
      drawHuman(fx + 80, fy, '#b58a63', t)
    },
  },
  {
    label: 'First Villages',
    sky: ['#8fc3e0', '#f4e2b0'],
    draw(t) {
      sky('#8fc3e0', '#f4e2b0')
      sun(W * 0.75, H * 0.24, 42, '#fff4c0', 'rgba(255,244,192,0)')
      ground('#7fae4e', 0.24)
      // tilled fields rows
      ctx.strokeStyle = '#6a8e3f'
      ctx.lineWidth = 4
      for (let i = 0; i < 8; i++) {
        const y = H * 0.82 + i * 8
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(W, y - 6)
        ctx.stroke()
      }
      // huts
      for (let i = 0; i < 4; i++) drawHut(W * (0.2 + i * 0.18), H * 0.74)
      // windmill-ish sails turning
      drawWheat(t)
    },
  },
  {
    label: 'Industrial Age',
    sky: ['#6e6a63', '#b59a6f'],
    draw(t) {
      sky('#6e6a63', '#c9a878')
      // hazy sun
      sun(W * 0.7, H * 0.26, 38, 'rgba(255,220,140,0.7)', 'rgba(255,220,140,0)')
      ground('#4a4138', 0.22)
      // factory blocks + smokestacks
      for (let i = 0; i < 4; i++) {
        const bx = W * (0.12 + i * 0.22)
        const bh = 140 + (i % 2) * 50
        ctx.fillStyle = '#3a322b'
        ctx.fillRect(bx, H * 0.78 - bh, 110, bh)
        // stack
        const sx = bx + 30
        ctx.fillStyle = '#2a241f'
        ctx.fillRect(sx, H * 0.78 - bh - 70, 26, 70)
        // smoke puffs
        for (let p = 0; p < 4; p++) {
          const py = H * 0.78 - bh - 70 - ((t * 30 + p * 40) % 160)
          ctx.globalAlpha = 0.4
          circle(sx + 13 + Math.sin(t + p) * 14, py, 16 + p * 4, '#8c857c')
          ctx.globalAlpha = 1
        }
        // lit windows
        ctx.fillStyle = '#ffcf6a'
        for (let wy = 0; wy < 4; wy++)
          for (let wx = 0; wx < 3; wx++)
            ctx.fillRect(bx + 14 + wx * 32, H * 0.78 - bh + 18 + wy * 30, 16, 18)
      }
    },
  },
  {
    label: 'Modern City',
    sky: ['#1b2a4a', '#5a6fa8'],
    draw(t) {
      sky('#1b2a4a', '#6a7fb8')
      // skyline of glass towers
      const colors = ['#2e3e64', '#374a78', '#2a3a5c']
      for (let i = 0; i < 9; i++) {
        const bw = 80
        const bx = i * (W / 9)
        const bh = 160 + (Math.sin(i * 12.9) * 0.5 + 0.5) * 240
        ctx.fillStyle = colors[i % 3]
        ctx.fillRect(bx, H - bh, bw - 8, bh)
        // window grid, some twinkling
        for (let wy = 0; wy < Math.floor(bh / 26); wy++)
          for (let wx = 0; wx < 3; wx++) {
            const on = (Math.sin(i * 3 + wy * 1.7 + wx + t) + 1) / 2 > 0.4
            ctx.fillStyle = on ? '#ffe27a' : '#1c2742'
            ctx.fillRect(bx + 10 + wx * 22, H - bh + 16 + wy * 26, 14, 16)
          }
      }
      // blinking plane light
      const px = (t * 120) % (W + 100)
      circle(px, H * 0.18, 3, '#ff5a5a')
    },
  },
  {
    label: 'Solar-Punk Future',
    sky: ['#bdeef0', '#ffe9a8'],
    draw(t) {
      sky('#bdeef0', '#d8f6c8')
      sun(W * 0.82, H * 0.2, 54, '#fff7d0', 'rgba(255,247,208,0)')
      ground('#6fcf8e', 0.24)
      // green eco-towers with foliage and solar panels
      for (let i = 0; i < 5; i++) {
        const bx = W * (0.1 + i * 0.19)
        const bh = 180 + (i % 3) * 60
        const bw = 90
        // tapered white tower
        roundRect(bx, H * 0.78 - bh, bw, bh, 18)
        ctx.fillStyle = '#f4fbf6'
        ctx.fill()
        // green terraces
        for (let g = 0; g < 4; g++) {
          ctx.fillStyle = '#5cc47a'
          roundRect(bx - 6, H * 0.78 - bh + 30 + g * (bh / 4), bw + 12, 16, 8)
          ctx.fill()
        }
        // rooftop solar panel
        ctx.fillStyle = '#2c6fb0'
        ctx.fillRect(bx + 14, H * 0.78 - bh - 14, bw - 28, 12)
      }
      // spinning wind turbines
      for (let i = 0; i < 3; i++) {
        drawTurbine(W * (0.2 + i * 0.3), H * 0.5, t + i)
      }
      // floating drone/airship
      const ax = W * 0.5 + Math.sin(t * 0.5) * W * 0.3
      ctx.fillStyle = '#ffffff'
      roundRect(ax - 40, H * 0.2, 80, 30, 15)
      ctx.fill()
      ctx.fillStyle = '#8affc1'
      roundRect(ax - 24, H * 0.2 + 8, 48, 12, 6)
      ctx.fill()
    },
  },
]

// --- Creature & object sprites ------------------------------------------
function drawFish(x, y, s, color, t) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.ellipse(x, y, s, s * 0.55, 0, 0, Math.PI * 2)
  ctx.fill()
  // tail
  ctx.beginPath()
  const tw = Math.sin(t * 8) * 4
  ctx.moveTo(x - s, y)
  ctx.lineTo(x - s - 18, y - 12 + tw)
  ctx.lineTo(x - s - 18, y + 12 + tw)
  ctx.closePath()
  ctx.fill()
  circle(x + s * 0.5, y - 4, 3, '#222') // eye
}

function drawAmphibian(x, y, t) {
  ctx.fillStyle = '#5fa85f'
  ctx.beginPath()
  ctx.ellipse(x, y, 46, 22, 0, 0, Math.PI * 2)
  ctx.fill()
  circle(x + 40, y - 10, 18, '#5fa85f') // head
  circle(x + 48, y - 18, 6, '#fff') // eye
  circle(x + 49, y - 18, 3, '#222')
  // legs
  ctx.strokeStyle = '#4a8a4a'
  ctx.lineWidth = 7
  for (const dx of [-20, 20]) {
    ctx.beginPath()
    ctx.moveTo(x + dx, y + 14)
    ctx.lineTo(x + dx + Math.sin(t * 4 + dx) * 8, y + 30)
    ctx.stroke()
  }
}

function drawDino(x, y, t) {
  ctx.fillStyle = '#6a9c4a'
  // body
  ctx.beginPath()
  ctx.ellipse(x, y - 40, 90, 50, 0, 0, Math.PI * 2)
  ctx.fill()
  // long neck + head
  ctx.lineWidth = 36
  ctx.strokeStyle = '#6a9c4a'
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(x + 50, y - 60)
  ctx.quadraticCurveTo(x + 140, y - 200, x + 180, y - 230 + Math.sin(t) * 8)
  ctx.stroke()
  circle(x + 188, y - 235 + Math.sin(t) * 8, 22, '#6a9c4a')
  circle(x + 196, y - 242 + Math.sin(t) * 8, 4, '#222')
  // tail
  ctx.beginPath()
  ctx.moveTo(x - 60, y - 50)
  ctx.quadraticCurveTo(x - 180, y - 70, x - 240, y - 20)
  ctx.lineWidth = 26
  ctx.stroke()
  // legs
  ctx.lineWidth = 28
  for (const dx of [-40, 40]) {
    ctx.beginPath()
    ctx.moveTo(x + dx, y - 10)
    ctx.lineTo(x + dx + Math.sin(t * 3 + dx) * 6, y + 50)
    ctx.stroke()
  }
}

function drawMammal(x, y, t) {
  ctx.fillStyle = '#b07a45'
  ctx.beginPath()
  ctx.ellipse(x, y, 22, 15, 0, 0, Math.PI * 2)
  ctx.fill()
  circle(x + 18, y - 8, 11, '#b07a45') // head
  // ears
  ctx.beginPath()
  ctx.ellipse(x + 22, y - 18, 4, 8, 0.4, 0, Math.PI * 2)
  ctx.fill()
  circle(x + 23, y - 9, 2.5, '#222') // eye
  // tail
  ctx.strokeStyle = '#b07a45'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.moveTo(x - 20, y)
  ctx.quadraticCurveTo(x - 36, y - 10, x - 30, y - 22)
  ctx.stroke()
}

function drawHuman(x, y, skin, t) {
  // body
  ctx.strokeStyle = skin
  ctx.lineWidth = 8
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x, y - 36)
  ctx.stroke()
  circle(x, y - 46, 10, skin) // head
  // arms reaching toward fire
  ctx.beginPath()
  ctx.moveTo(x, y - 26)
  ctx.lineTo(x + 20 * Math.sign(0.5 - (x % 2)), y - 18)
  ctx.stroke()
  // legs
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x - 10, y + 16)
  ctx.moveTo(x, y)
  ctx.lineTo(x + 10, y + 16)
  ctx.stroke()
}

function drawHut(x, y) {
  ctx.fillStyle = '#c9a06a'
  ctx.fillRect(x - 35, y, 70, 60)
  // thatch roof
  ctx.fillStyle = '#8a6a3a'
  ctx.beginPath()
  ctx.moveTo(x - 48, y)
  ctx.lineTo(x, y - 44)
  ctx.lineTo(x + 48, y)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#5a3f22'
  ctx.fillRect(x - 10, y + 24, 20, 36) // door
}

function drawTree(x, y, scale) {
  ctx.fillStyle = '#6a4a2a'
  ctx.fillRect(x - 6 * scale, y - 30 * scale, 12 * scale, 40 * scale)
  ctx.fillStyle = '#3e8e4a'
  circle(x, y - 44 * scale, 30 * scale, '#3e8e4a')
  circle(x - 22 * scale, y - 30 * scale, 22 * scale, '#4ba058')
  circle(x + 22 * scale, y - 30 * scale, 22 * scale, '#4ba058')
}

function hill(frac, color) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(0, H)
  for (let x = 0; x <= W; x += 40) {
    ctx.lineTo(x, H * frac + Math.sin(x / 160) * 40)
  }
  ctx.lineTo(W, H)
  ctx.closePath()
  ctx.fill()
}

function drawWheat(t) {
  ctx.strokeStyle = '#d8b24a'
  ctx.lineWidth = 3
  for (let i = 0; i < 30; i++) {
    const x = (i / 30) * W + 10
    const sway = Math.sin(t * 1.5 + i * 0.4) * 6
    ctx.beginPath()
    ctx.moveTo(x, H)
    ctx.lineTo(x + sway, H - 50)
    ctx.stroke()
    circle(x + sway, H - 54, 4, '#e8c660')
  }
}

function drawTurbine(x, y, t) {
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 8
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(x, H * 0.78)
  ctx.stroke()
  // three rotating blades
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(t * 1.5)
  ctx.fillStyle = '#ffffff'
  for (let b = 0; b < 3; b++) {
    ctx.rotate((Math.PI * 2) / 3)
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(-8, -64)
    ctx.lineTo(8, -64)
    ctx.closePath()
    ctx.fill()
  }
  ctx.restore()
  circle(x, y, 6, '#cfe2d4')
}

// --- Timeline / cross-fade ----------------------------------------------
const ERA_DURATION = 5.5 // seconds visible per era
const FADE = 1.2 // cross-fade seconds
let start = performance.now() / 1000

function frame() {
  const now = performance.now() / 1000
  const elapsed = now - start
  const total = eras.length * ERA_DURATION
  const loopTime = elapsed % total
  const index = Math.floor(loopTime / ERA_DURATION)
  const localT = loopTime - index * ERA_DURATION // time within current era

  ctx.clearRect(0, 0, W, H)

  // Draw current era at full opacity.
  ctx.globalAlpha = 1
  eras[index].draw(now)

  // Cross-fade into the next era during the final FADE seconds.
  const remaining = ERA_DURATION - localT
  if (remaining < FADE) {
    const nextIndex = (index + 1) % eras.length
    ctx.globalAlpha = 1 - remaining / FADE
    eras[nextIndex].draw(now)
    ctx.globalAlpha = 1
  }

  // Update HUD: show the era we're predominantly seeing.
  const showIndex = remaining < FADE / 2 ? (index + 1) % eras.length : index
  if (eraLabel.textContent !== eras[showIndex].label) {
    eraLabel.textContent = eras[showIndex].label
  }
  progressBar.style.width = ((loopTime / total) * 100).toFixed(1) + '%'

  requestAnimationFrame(frame)
}

requestAnimationFrame(frame)
