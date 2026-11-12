// Built-in "segments" with no audio: the title card (what the gallery screenshot captures), the
// "in production" card for rundown entries that don't exist yet, and the end card with credits.
// They run through the same Show/Stage machinery as real segments.
import { logo } from '../stage/chrome.js'
import { label, seg, box, P, creditsRoll, crow } from '../kit/draw.js'
import { noise1, clamp, unlerp, ease } from '../kit/ease.js'
import { CAST } from '../cast.js'

/** the TONIGHT list when the rundown's segments aren't made yet */
export const TONIGHT_FALLBACK = ['Samantha with the weather', 'norvid & Abel', 'Void, live via decelerated clock', 'music from Hy Oid & The Formants']

export function titleModule(titles = []) {
  return {
    id: 'title',
    title: 'The Late Cluster',
    duration: 1e9,
    cast: ['larry'],
    direct(t, show) {
      show.onAir = false
      show.set.chair = show.set.couch = false
      show.shot('title')
      // Larry idles: mostly to camera, now and then a glance out of the window or down at his cards
      const g = noise1(t * 0.13, 77)
      const L = show.puppet('larry')
      if (g > 0.45) L.lookAt('left')
      else if (g < -0.55) L.lookAt(Math.PI / 2 + 0.55).nod(-0.12)
    },
    drawFront(ctx, t, show) {
      logo(ctx, 92, 262, 0.98, { t })
      if (titles.length) {
        label(ctx, 'TONIGHT', 98, 478, { size: 17, color: P.sky, ls: 0.5, weight: 'm' })
        seg(ctx, 98, 490, 330, 490, P.sky, 1.2, { alpha: 0.6 })
        // the whole rundown (nine segments) in two numbered columns, five then four, short titles
        // (before any ':'), ending above the START button (y 632); room for ten at most
        const short = titles.slice(0, 10).map((tt) => String(tt).split(':')[0].trim().toUpperCase())
        const rows = Math.ceil(short.length / 2)
        short.forEach((tt, i) => {
          const col = short.length > 5 ? Math.floor(i / rows) : 0, row = short.length > 5 ? i % rows : i
          const x = 98 + col * 290, y = 514 + row * 22
          label(ctx, String(i + 1).padStart(2, '0'), x, y, { size: 12, color: P.gold, ls: 0.1, alpha: 0.8 })
          label(ctx, tt, x + 28, y, { size: 14, color: P.white, ls: 0.12, alpha: 0.9 })
        })
      }
    },
  }
}

/** a rundown entry with no segment yet */
export function productionModule(title, n) {
  return {
    id: 'production',
    title,
    duration: 2.6,
    cast: [],
    drift: true,
    direct(t, show) {
      show.shot('wide', { band: false })
      show.set.dim = 0.7
      show.onAir = false
    },
    drawFront(ctx, t, show) {
      const a = Math.min(ease.outCubic(clamp(t / 0.4)), 1 - clamp((t - 2.2) / 0.4))
      ctx.save()
      ctx.globalAlpha = 0.88 * a
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, 1280, 720)
      ctx.restore()
      box(ctx, 360, 250, 560, 200, { color: P.amber, cut: 12, width: 1.6, alpha: a })
      label(ctx, `SEGMENT ${String(n).padStart(2, '0')}`, 640, 300, { size: 14, align: 'center', color: P.sky, ls: 0.5, alpha: a })
      label(ctx, String(title).toUpperCase(), 640, 350, { size: 30, align: 'center', color: P.white, ls: 0.2, weight: 'm', alpha: a })
      label(ctx, 'IN PRODUCTION', 640, 400, { size: 16, align: 'center', color: P.amber, ls: 0.45, alpha: a * (0.6 + 0.4 * Math.sin(t * 5)) })
      crow(ctx, 880, 262, { scale: 0.5, perched: true, facing: -1, alpha: a })
    },
  }
}

/** the credits: the cast from cast.js, then the people behind the curtain */
export function credits() {
  const out = [{ head: 'The Late Cluster' }, ['with', 'Larry Nx'], '']
  out.push({ head: 'Starring' })
  for (const [id, c] of Object.entries(CAST)) out.push([c.title ?? '', c.guest ? `${c.name} (puppet)` : c.name])
  out.push('', { head: 'Voices & faces' }, ['physical models', 'CHIMERA vocal synth'], ['by', 'jamesondh · MIT'], ['', 'github.com/jamesondh/chimera-vocal-synth'], '')
  out.push('Guests are puppets playing posting personas.', 'No accounts were simclustered in the making of this programme.', '', { head: 'Good night, Bluesky' })
  return out
}

export function endModule() {
  const lines = credits()
  return {
    id: 'end',
    title: 'Good night',
    duration: 1e9,
    cast: ['larry', 'hy', 'al', 'pete', 'dee'],
    direct(t, show) {
      show.shot('wide')
      show.onAir = false
      show.set.dim = 0.55
      // the band plays us out
      show.music = { active: true, beat: t * 2, n: Math.floor(t * 2), phase: (t * 2) % 1, pulse: Math.exp(-((t * 2) % 1) * 4.5), bar: Math.floor(t / 2) }
      show.puppet('larry').nod(0.05 * Math.sin(t * 2))
    },
    drawFront(ctx, t, show) {
      const a = ease.outCubic(clamp(unlerp(0.2, 1.4, t)))
      logo(ctx, 640, 200, 0.62, { t, align: 'center', alpha: a })
      // the credits roll in a column under the logo (and loop)
      const rect = { x: 390, y: 300, w: 500, h: 270 }
      ctx.save()
      ctx.globalAlpha = 0.75 * a
      ctx.fillStyle = '#000'
      ctx.fillRect(rect.x, rect.y, rect.w, rect.h)
      ctx.restore()
      const speed = 34
      const total = lines.length * 40 + rect.h
      creditsRoll(ctx, lines, (Math.max(0, t - 1) * speed % total) / speed, { rect, speed })
    },
  }
}
