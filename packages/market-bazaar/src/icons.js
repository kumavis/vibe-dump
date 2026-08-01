// Hand-drawn icon glyphs for speech bubbles — the "sims-style emoji" of the
// bazaar. Drawn as canvas vectors rather than emoji text so headless CI
// screenshots (no color-emoji font) and every visitor's browser render the
// exact same conversation. Only ASCII (digits, ? !) ever goes through
// fillText, which any font supplies.

/** Draw icon `kind` centred at (x, y), `s` = icon box size in px. */
export function drawIcon(ctx, kind, x, y, s) {
  ctx.save()
  ctx.translate(x, y)
  const u = s / 24 // design units: 24-box
  ctx.scale(u, u)
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  const face = (fill) => {
    ctx.fillStyle = fill
    ctx.beginPath()
    ctx.arc(0, 0, 10, 0, Math.PI * 2)
    ctx.fill()
  }
  const eyes = (dy = -2.5) => {
    ctx.fillStyle = '#31261a'
    ctx.beginPath()
    ctx.arc(-3.6, dy, 1.5, 0, Math.PI * 2)
    ctx.arc(3.6, dy, 1.5, 0, Math.PI * 2)
    ctx.fill()
  }
  switch (kind) {
    case 'apple': {
      ctx.fillStyle = '#d9433b'
      ctx.beginPath()
      ctx.arc(-3.2, 1.5, 6.4, 0, Math.PI * 2)
      ctx.arc(3.2, 1.5, 6.4, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#6a4a2a'
      ctx.lineWidth = 1.8
      ctx.beginPath()
      ctx.moveTo(0, -3)
      ctx.quadraticCurveTo(1, -7, 3, -8.5)
      ctx.stroke()
      ctx.fillStyle = '#5a9a3a'
      ctx.beginPath()
      ctx.ellipse(5, -7, 3.4, 1.8, -0.5, 0, Math.PI * 2)
      ctx.fill()
      break
    }
    case 'fish': {
      ctx.fillStyle = '#6fb7c9'
      ctx.beginPath()
      ctx.ellipse(-1, 0, 7.5, 4.5, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.moveTo(6, 0)
      ctx.lineTo(11, -4.5)
      ctx.lineTo(11, 4.5)
      ctx.closePath()
      ctx.fill()
      ctx.fillStyle = '#1a2a33'
      ctx.beginPath()
      ctx.arc(-4.5, -1, 1.1, 0, Math.PI * 2)
      ctx.fill()
      break
    }
    case 'bread': {
      ctx.fillStyle = '#c98f4e'
      ctx.beginPath()
      ctx.ellipse(0, 0.5, 9, 5.5, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#8a5a2a'
      ctx.lineWidth = 1.4
      for (const dx of [-4, 0, 4]) {
        ctx.beginPath()
        ctx.moveTo(dx - 1.5, -2.5)
        ctx.lineTo(dx + 1.5, 0.5)
        ctx.stroke()
      }
      break
    }
    case 'spice': {
      ctx.fillStyle = '#c2452c'
      ctx.beginPath()
      ctx.moveTo(-9, 7)
      ctx.quadraticCurveTo(0, -12, 9, 7)
      ctx.closePath()
      ctx.fill()
      ctx.fillStyle = '#e88a3a'
      for (const [dx, dy] of [[-3, 3], [1, -1], [4, 4], [-1, 5]]) {
        ctx.beginPath()
        ctx.arc(dx, dy, 1, 0, Math.PI * 2)
        ctx.fill()
      }
      break
    }
    case 'potion': {
      ctx.fillStyle = '#cfd8dc'
      ctx.fillRect(-2, -10, 4, 4)
      ctx.fillStyle = '#7fd48a'
      ctx.beginPath()
      ctx.arc(0, 2.5, 7, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#bfe8c5'
      ctx.beginPath()
      ctx.arc(-2.5, 0, 2, 0, Math.PI * 2)
      ctx.fill()
      break
    }
    case 'gem': {
      ctx.fillStyle = '#8f6fd4'
      ctx.beginPath()
      ctx.moveTo(0, -9)
      ctx.lineTo(8, -2)
      ctx.lineTo(0, 10)
      ctx.lineTo(-8, -2)
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = '#c9b8ef'
      ctx.lineWidth = 1.2
      ctx.beginPath()
      ctx.moveTo(-8, -2)
      ctx.lineTo(8, -2)
      ctx.moveTo(0, -9)
      ctx.lineTo(0, 10)
      ctx.stroke()
      break
    }
    case 'lamp': {
      ctx.fillStyle = '#e8b64c'
      ctx.beginPath()
      ctx.ellipse(0, 3, 8, 5, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath() // spout
      ctx.moveTo(6, 1)
      ctx.lineTo(12, -2)
      ctx.lineTo(7, 4)
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = '#e8b64c'
      ctx.lineWidth = 1.6
      ctx.beginPath() // handle
      ctx.arc(-8, 1, 3, -1.2, 2.4)
      ctx.stroke()
      ctx.fillStyle = '#fff3c9'
      ctx.beginPath() // wisp
      ctx.arc(0, -6, 2.2, 0, Math.PI * 2)
      ctx.fill()
      break
    }
    case 'rug': {
      ctx.fillStyle = '#b85a8f'
      ctx.fillRect(-9, -6, 18, 12)
      ctx.fillStyle = '#efe0c0'
      ctx.fillRect(-9, -2, 18, 1.6)
      ctx.fillRect(-9, 2, 18, 1.6)
      ctx.strokeStyle = '#efe0c0'
      ctx.lineWidth = 1.2
      for (let i = -8; i <= 8; i += 3) {
        ctx.beginPath()
        ctx.moveTo(i, 6)
        ctx.lineTo(i, 8)
        ctx.moveTo(i, -6)
        ctx.lineTo(i, -8)
        ctx.stroke()
      }
      break
    }
    case 'scroll': {
      ctx.fillStyle = '#d8cfae'
      ctx.fillRect(-7, -8, 14, 16)
      ctx.fillStyle = '#b8a97e'
      ctx.beginPath()
      ctx.ellipse(0, -8, 7, 2.4, 0, 0, Math.PI * 2)
      ctx.ellipse(0, 8, 7, 2.4, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#7a2a2a'
      ctx.lineWidth = 1.3
      ctx.beginPath()
      ctx.moveTo(-4, -3)
      ctx.lineTo(4, -3)
      ctx.moveTo(-4, 0.5)
      ctx.lineTo(4, 0.5)
      ctx.moveTo(-4, 4)
      ctx.lineTo(1, 4)
      ctx.stroke()
      break
    }
    case 'skull': {
      ctx.fillStyle = '#e8e4da'
      ctx.beginPath()
      ctx.arc(0, -1.5, 7.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillRect(-4.5, 3, 9, 5.5)
      ctx.fillStyle = '#2a2a2a'
      ctx.beginPath()
      ctx.arc(-3, -2, 2.2, 0, Math.PI * 2)
      ctx.arc(3, -2, 2.2, 0, Math.PI * 2)
      ctx.fill()
      for (const dx of [-2.6, 0, 2.6]) {
        ctx.fillRect(dx - 0.7, 4.5, 1.4, 3.5)
      }
      break
    }
    case 'coin': {
      ctx.fillStyle = '#e6b422'
      ctx.beginPath()
      ctx.arc(0, 0, 9, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#a67c00'
      ctx.lineWidth = 1.6
      ctx.beginPath()
      ctx.arc(0, 0, 6.2, 0, Math.PI * 2)
      ctx.stroke()
      ctx.fillStyle = '#a67c00'
      ctx.font = 'bold 9px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('¢', 0, 0.5)
      break
    }
    case 'happy': {
      face('#f5c542')
      eyes()
      ctx.strokeStyle = '#31261a'
      ctx.lineWidth = 1.8
      ctx.beginPath()
      ctx.arc(0, 1, 5, 0.35, Math.PI - 0.35)
      ctx.stroke()
      break
    }
    case 'delighted': {
      face('#f5c542')
      ctx.strokeStyle = '#31261a'
      ctx.lineWidth = 1.8
      ctx.beginPath() // happy closed eyes
      ctx.arc(-3.6, -2, 2, Math.PI, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(3.6, -2, 2, Math.PI, Math.PI * 2)
      ctx.stroke()
      ctx.fillStyle = '#31261a'
      ctx.beginPath()
      ctx.arc(0, 2.5, 4.5, 0, Math.PI)
      ctx.fill()
      break
    }
    case 'neutral': {
      face('#f5c542')
      eyes()
      ctx.strokeStyle = '#31261a'
      ctx.lineWidth = 1.8
      ctx.beginPath()
      ctx.moveTo(-4, 3.5)
      ctx.lineTo(4, 3.5)
      ctx.stroke()
      break
    }
    case 'annoyed': {
      face('#f0a04a')
      eyes()
      ctx.strokeStyle = '#31261a'
      ctx.lineWidth = 1.8
      ctx.beginPath()
      ctx.arc(0, 7.5, 5, Math.PI + 0.45, -0.45)
      ctx.stroke()
      ctx.beginPath() // flat brows
      ctx.moveTo(-5.5, -5.5)
      ctx.lineTo(-1.8, -5)
      ctx.moveTo(5.5, -5.5)
      ctx.lineTo(1.8, -5)
      ctx.stroke()
      break
    }
    case 'angry': {
      face('#e04a3a')
      eyes(-2)
      ctx.strokeStyle = '#31261a'
      ctx.lineWidth = 1.9
      ctx.beginPath()
      ctx.arc(0, 8, 5, Math.PI + 0.5, -0.5)
      ctx.stroke()
      ctx.beginPath() // angled brows
      ctx.moveTo(-5.8, -6.5)
      ctx.lineTo(-1.6, -3.8)
      ctx.moveTo(5.8, -6.5)
      ctx.lineTo(1.6, -3.8)
      ctx.stroke()
      break
    }
    case 'no': {
      ctx.strokeStyle = '#c0392b'
      ctx.lineWidth = 2.6
      ctx.beginPath()
      ctx.arc(0, 0, 8.4, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(-5.5, 5.5)
      ctx.lineTo(5.5, -5.5)
      ctx.stroke()
      break
    }
    case 'yes': {
      ctx.strokeStyle = '#2f9e44'
      ctx.lineWidth = 3.2
      ctx.beginPath()
      ctx.moveTo(-7, 0.5)
      ctx.lineTo(-2, 6)
      ctx.lineTo(8, -6)
      ctx.stroke()
      break
    }
    case 'question':
    case 'exclaim': {
      ctx.fillStyle = kind === 'question' ? '#4a6fd4' : '#e6a817'
      ctx.font = 'bold 22px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(kind === 'question' ? '?' : '!', 0, 1)
      break
    }
    case 'note': {
      ctx.fillStyle = '#4a3a8a'
      ctx.beginPath()
      ctx.ellipse(-3.5, 6, 3.4, 2.5, -0.35, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#4a3a8a'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(-0.6, 5.5)
      ctx.lineTo(-0.6, -7)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(-0.6, -7)
      ctx.quadraticCurveTo(4, -6, 5.5, -1.5)
      ctx.quadraticCurveTo(3, -3.5, -0.6, -3.5)
      ctx.closePath()
      ctx.fill()
      break
    }
    case 'heart': {
      ctx.fillStyle = '#e0508a'
      ctx.beginPath()
      ctx.moveTo(0, 8)
      ctx.bezierCurveTo(-10, 0, -7, -8, 0, -3)
      ctx.bezierCurveTo(7, -8, 10, 0, 0, 8)
      ctx.fill()
      break
    }
    case 'sparkle': {
      ctx.fillStyle = '#e6c84a'
      ctx.beginPath()
      ctx.moveTo(0, -9)
      ctx.quadraticCurveTo(1.6, -1.6, 9, 0)
      ctx.quadraticCurveTo(1.6, 1.6, 0, 9)
      ctx.quadraticCurveTo(-1.6, 1.6, -9, 0)
      ctx.quadraticCurveTo(-1.6, -1.6, 0, -9)
      ctx.fill()
      break
    }
    default: {
      ctx.fillStyle = '#888'
      ctx.font = 'bold 18px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('?', 0, 1)
    }
  }
  ctx.restore()
}

export const MOOD_ICON = {
  happy: 'happy',
  delighted: 'delighted',
  neutral: 'neutral',
  annoyed: 'annoyed',
  angry: 'angry',
}
