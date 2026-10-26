// The backdrop: three parallax layers of twinkling stars scrolling past, a
// couple of soft nebula clouds, a far-off planet and the odd shooting star.
// `speed` is how fast the ship is "flying"; cranking it up between stages
// stretches the stars into warp streaks.

const STAR_COLORS = ['#ffffff', '#ffffff', '#ffffff', '#cfe0ff', '#fff2c9', '#ffd2e8', '#c9fff4']

export class Starfield {
  constructor() {
    this.stars = []
    this.clouds = []
    this.shooting = []
    this.w = 0
    this.h = 0
    this.speed = 1
    this.targetSpeed = 1
    this.planet = null
    this.tint = ['#3b1f7a', '#0f3a6e']
  }

  resize(w, h) {
    const first = this.w === 0
    this.w = w
    this.h = h
    const want = Math.round((w * h) / 2600)
    while (this.stars.length < want) this.stars.push(this.makeStar(Math.random() * h))
    if (this.stars.length > want) this.stars.length = want
    for (const s of this.stars) if (s.x > w) s.x = Math.random() * w
    if (first) {
      this.clouds = [0, 1, 2].map((i) => this.makeCloud(Math.random() * h, i))
      this.planet = this.makePlanet(h * 0.3)
    }
  }

  setTint(a, b) {
    this.tint = [a, b]
    this.clouds.forEach((c, i) => {
      c.color = i % 2 ? b : a
      c.sprite = null
    })
  }

  makeStar(y) {
    const layer = Math.random() < 0.6 ? 0 : Math.random() < 0.7 ? 1 : 2
    return {
      x: Math.random() * this.w,
      y,
      layer,
      size: [0.8, 1.4, 2.2][layer] * (0.7 + Math.random() * 0.5),
      vel: [18, 42, 90][layer],
      tw: Math.random() * Math.PI * 2,
      twSpeed: 1 + Math.random() * 3,
      color: STAR_COLORS[(Math.random() * STAR_COLORS.length) | 0],
    }
  }

  makeCloud(y, i) {
    return {
      x: Math.random() * this.w,
      y,
      r: 220 + Math.random() * 260,
      color: this.tint[i % 2],
      vel: 6 + Math.random() * 4,
      alpha: 0.18 + Math.random() * 0.12,
      sprite: null, // drawn on first use; a recycled cloud gets a new one
    }
  }

  makePlanet(y) {
    const palettes = [
      ['#ff9a6b', '#a33b4a', '#3a0f2f'],
      ['#7fd6ff', '#2c5fb8', '#0c1846'],
      ['#c7a3ff', '#6a3fbf', '#1e0f4a'],
      ['#a5f59c', '#2f8f63', '#0b2f2a'],
    ]
    const p = palettes[(Math.random() * palettes.length) | 0]
    const r = 40 + Math.random() * 70
    return {
      x: r + Math.random() * (this.w - 2 * r),
      y,
      r,
      colors: p,
      ring: Math.random() < 0.5,
      vel: 4,
    }
  }

  update(dt) {
    this.speed += (this.targetSpeed - this.speed) * Math.min(1, dt * 1.6)
    const sp = this.speed
    for (const s of this.stars) {
      s.y += s.vel * sp * dt
      s.tw += s.twSpeed * dt
      if (s.y > this.h + 40) {
        Object.assign(s, this.makeStar(-10 - Math.random() * 30))
      }
    }
    this.clouds.forEach((c, i) => {
      c.y += c.vel * sp * dt
      if (c.y - c.r > this.h) Object.assign(c, this.makeCloud(-c.r - Math.random() * 200, i))
    })
    if (this.planet) {
      this.planet.y += this.planet.vel * sp * dt
      if (this.planet.y - this.planet.r * 2 > this.h) this.planet = this.makePlanet(-this.h * 0.8 - 300)
    }
    if (Math.random() < dt * 0.25) {
      const fromLeft = Math.random() < 0.5
      this.shooting.push({
        x: fromLeft ? Math.random() * this.w * 0.5 : this.w * (0.5 + Math.random() * 0.5),
        y: Math.random() * this.h * 0.5,
        vx: (fromLeft ? 1 : -1) * (500 + Math.random() * 300),
        vy: 180 + Math.random() * 120,
        life: 0.9,
      })
    }
    for (const s of this.shooting) {
      s.x += s.vx * dt
      s.y += s.vy * dt
      s.life -= dt
    }
    this.shooting = this.shooting.filter((s) => s.life > 0)
  }

  draw(ctx) {
    // The sky gradient and the nebula clouds are the biggest fills on screen
    // every frame, so they're built once — the gradient per screen height, each
    // cloud as a small soft sprite that scales up smoothly — instead of anew.
    if (this.bgFor !== ctx || this.bgH !== this.h) {
      const g = ctx.createLinearGradient(0, 0, 0, this.h)
      g.addColorStop(0, '#05030f')
      g.addColorStop(0.55, '#0a0626')
      g.addColorStop(1, '#130a33')
      this.bg = g
      this.bgFor = ctx
      this.bgH = this.h
    }
    ctx.fillStyle = this.bg
    ctx.fillRect(0, 0, this.w, this.h)

    for (const c of this.clouds) {
      c.sprite ??= cloudSprite(c.color, c.alpha)
      ctx.drawImage(c.sprite, c.x - c.r, c.y - c.r, c.r * 2, c.r * 2)
    }

    if (this.planet) drawPlanet(ctx, this.planet)

    const streak = Math.max(0, this.speed - 1.5) * 0.06
    for (const s of this.stars) {
      const a = 0.55 + 0.45 * Math.sin(s.tw)
      ctx.globalAlpha = s.layer === 0 ? a * 0.7 : a
      ctx.fillStyle = s.color
      if (streak > 0) {
        const len = s.vel * this.speed * streak
        ctx.fillRect(s.x - s.size * 0.4, s.y - len, s.size * 0.8, len + s.size)
      } else if (s.layer === 2) {
        // the near stars get a little cross sparkle
        ctx.fillRect(s.x - s.size * 1.6, s.y - 0.4, s.size * 3.2, 0.8)
        ctx.fillRect(s.x - 0.4, s.y - s.size * 1.6, 0.8, s.size * 3.2)
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size * 0.6, 0, Math.PI * 2)
        ctx.fill()
      } else {
        ctx.fillRect(s.x - s.size / 2, s.y - s.size / 2, s.size, s.size)
      }
    }
    ctx.globalAlpha = 1

    for (const s of this.shooting) {
      const a = Math.min(1, s.life * 2)
      const tail = 0.12
      const lg = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * tail, s.y - s.vy * tail)
      lg.addColorStop(0, `rgba(255,255,255,${a})`)
      lg.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.strokeStyle = lg
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(s.x, s.y)
      ctx.lineTo(s.x - s.vx * tail, s.y - s.vy * tail)
      ctx.stroke()
    }
  }
}

const CLOUD_PX = 128

function cloudSprite(color, alpha) {
  const c = document.createElement('canvas')
  c.width = c.height = CLOUD_PX
  const g = c.getContext('2d')
  const h = CLOUD_PX / 2
  const rg = g.createRadialGradient(h, h, 0, h, h, h)
  rg.addColorStop(0, hexA(color, alpha))
  rg.addColorStop(0.6, hexA(color, alpha * 0.4))
  rg.addColorStop(1, hexA(color, 0))
  g.fillStyle = rg
  g.fillRect(0, 0, CLOUD_PX, CLOUD_PX)
  return c
}

function drawPlanet(ctx, p) {
  ctx.save()
  ctx.globalAlpha = 0.85
  if (p.ring) {
    ctx.strokeStyle = hexA(p.colors[0], 0.35)
    ctx.lineWidth = p.r * 0.12
    ctx.beginPath()
    ctx.ellipse(p.x, p.y, p.r * 1.8, p.r * 0.42, -0.35, Math.PI, Math.PI * 2)
    ctx.stroke()
  }
  const g = ctx.createRadialGradient(p.x - p.r * 0.4, p.y - p.r * 0.4, p.r * 0.1, p.x, p.y, p.r)
  g.addColorStop(0, p.colors[0])
  g.addColorStop(0.6, p.colors[1])
  g.addColorStop(1, p.colors[2])
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
  ctx.fill()
  if (p.ring) {
    ctx.strokeStyle = hexA(p.colors[0], 0.5)
    ctx.lineWidth = p.r * 0.12
    ctx.beginPath()
    ctx.ellipse(p.x, p.y, p.r * 1.8, p.r * 0.42, -0.35, 0, Math.PI)
    ctx.stroke()
  }
  ctx.restore()
}

export function hexA(hex, a) {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`
}
