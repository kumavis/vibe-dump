// PLACEHOLDER content pack — replaced by the asteroids work. See ../README.md.
import { drawSaucer } from '../../art.js'

export default {
  levels: {
    asteroids: {
      update(g) {
        if (g.phase === 'main' && g.phaseT > 3) g.levelDone()
      },
      progress: (g) => Math.min(1, g.phaseT / 3),
    },
  },
  bosses: {
    krax: {
      name: 'krax (placeholder)',
      create: (g) => ({ x: g.W / 2, y: -120, ty: 170, r: 110, hp: 20, maxHp: 20 }),
      update(b, dt, g) {
        g.bossEnter(b, dt)
      },
      shot(b, x, y, owner, g) {
        if (!g.near(x, y, b.x, b.y, b.r * 0.6)) return false
        if (!b.entering) g.damageBoss(b, 1, owner, x, y)
        return true
      },
      hits: () => false,
      draw(b, g, ctx) {
        drawSaucer(ctx, b.x, b.y, b.r, 'zorb', g.time, { flash: b.flash })
      },
      explodeAt: (b) => [b.x + (Math.random() - 0.5) * b.r, b.y],
    },
  },
  enemies: {},
}
