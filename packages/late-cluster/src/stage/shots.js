// Named camera setups. A shot is a function (show, opts) → layout:
//
//   { cam: { x, y, zoom },                 world point at the centre of the frame, world→stage scale
//     place: { <castId>: { x, y, scale, look, z, floor, instrument } },   who is on screen, where
//     audience: 0..1,                       the front-row silhouettes along the bottom edge
//     panel: { x, y, w, h } | null }        the graphics panel (stage units) for `ots`
//
// place.x / place.y is the centre of the head in world units; scale 1 = an adult head (TILE world
// units across its framing tile); look = 'camera' | 'left' | 'right' | <castId> | azimuth (rad);
// floor = world y of the floor under a standing puppet (legs are drawn down to it), or null when
// seated / behind furniture; seat = world y where a seated body ends. Puppets not in `place` are hidden.
//
// Add your own: SHOTS.myShot = (show, opts) => ({ cam, place, … }) — or position puppets freely
// from direct() with show.camera({...}) and show.puppet(id).place({...}).
import { WORLD, CHAIR, COUCH } from './set.js'

export const TILE = 200

/** where people stand / sit (head centres, world units) */
export const MARKS = {
  desk: { x: 1790, y: 548 },
  mono: { x: 970, y: 452 },
  chair: { x: CHAIR.x, y: 588 },
  couch: [{ x: 1330, y: 602 }, { x: 1218, y: 602 }],
  band: {
    hy: { x: 138, y: 578, instrument: 'keys', floor: 800 },
    al: { x: 268, y: 578, instrument: 'bass', floor: 800 },
    pete: { x: 404, y: 512, instrument: 'drums', floor: 740 },
    dee: { x: 556, y: 578, instrument: 'mic', floor: 800 },
  },
  anncr: { x: 690, y: 548, floor: WORLD.floor },
  lectern: { x: 690, y: 540 },
  presenter: { x: 1460, y: 520 },
  stand: { x: 1470, y: 545 },
}

/**
 * Put a puppet inside a monitor (stage rect) for layout L: adds L.monitors[] (drawn by the stage:
 * bezel behind, glass/label/LIVE in front) and places the puppet so its head fills the screen,
 * clipped to it, with the 'monitor' effect.
 */
export function monitor(L, who, r, o = {}) {
  const z = L.cam.zoom
  const scale = (r.h * 0.78) / (TILE * z)
  const sx = r.x + r.w / 2, sy = r.y + r.h * 0.42
  L.monitors = [...(L.monitors ?? []), { rect: r, who, ...o }]
  L.place[who] = { x: L.cam.x + (sx - 640) / z, y: L.cam.y + (sy - 360) / z, scale, look: o.look ?? 'camera', z: 8, floor: null, clip: r, fx: { kind: 'monitor' } }
  return L
}

const BAND = ['hy', 'al', 'pete', 'dee']

const larryAt = (where, look = 'camera') =>
  where === 'mono' ? { ...MARKS.mono, scale: 1, look, z: 5, floor: WORLD.floor } : { ...MARKS.desk, scale: 1, look, z: 5, floor: null, seat: 760 }

function guestSeats(ids) {
  const seats = [MARKS.chair, ...MARKS.couch]
  const out = {}
  ids.slice(0, 3).forEach((id, i) => (out[id] = { ...seats[i], scale: 1, look: 'larry', z: 4 - i * 0.1, floor: null, seat: i ? 790 : 800 }))
  return out
}

function bandPlace(show, look = 'camera') {
  const out = {}
  for (const id of BAND) {
    const m = MARKS.band[id]
    out[id] = { x: m.x, y: m.y, scale: 0.92, look, z: id === 'pete' ? 1 : 2, floor: m.floor, instrument: m.instrument }
  }
  return out
}

export const SHOTS = {
  /** everything: band, curtain, desk; whoever is cast is in their spot */
  wide(show, o = {}) {
    const place = { larry: larryAt(o.larry ?? 'desk', o.look ?? 'camera') }
    if (o.band !== false) Object.assign(place, bandPlace(show))
    Object.assign(place, guestSeats(o.guests ?? show.guests))
    if (show.cast.includes('sibyl') || o.sibyl) place.sibyl = { ...MARKS.anncr, scale: 0.9, look: 'camera', z: 2 }
    return { cam: { x: 1000, y: 585, zoom: 0.64 }, place, audience: 1 }
  },

  /** Larry standing centre in front of the curtain */
  mono(show, o = {}) {
    const L = larryAt('mono', o.look ?? 'camera')
    return { cam: { x: L.x, y: L.y + 86, zoom: o.zoom ?? 1.78 }, place: { larry: L }, audience: 1 }
  },

  /** Larry at the desk, medium close */
  desk(show, o = {}) {
    const L = larryAt('desk', o.look ?? 'camera')
    return { cam: { x: L.x - 40, y: L.y + 66, zoom: o.zoom ?? 1.85 }, place: { larry: L }, audience: 0 }
  },

  /** the interview: one guest in the chair screen-left, Larry at the desk screen-right */
  guest(show, o = {}) {
    const g = o.guest ?? show.guests[0]
    const place = { larry: larryAt('desk', g ?? 'camera') }
    if (g) place[g] = { ...MARKS.chair, scale: o.guestScale ?? 1, look: 'larry', z: 4, floor: null, seat: 800 }
    const cx = (MARKS.chair.x + MARKS.desk.x) / 2
    return { cam: { x: cx - 10, y: 640, zoom: o.zoom ?? 1.42 }, place, audience: 0 }
  },

  /** Larry and two or three guests on the couch and chair */
  panel(show, o = {}) {
    const ids = o.guests ?? show.guests.filter((id) => id !== o.pop).slice(0, 3)
    const place = { larry: larryAt('desk', o.look ?? ids[0] ?? 'camera'), ...guestSeats(ids) }
    const left = ids.length >= 3 ? MARKS.couch[1].x : ids.length === 2 ? MARKS.couch[0].x : MARKS.chair.x
    const cx = (left + MARKS.desk.x) / 2
    const zoom = Math.min(1.4, 1100 / (MARKS.desk.x - left + 260))
    const cam = { x: cx, y: 650, zoom }
    if (o.pop) {
      // a small puppet popping up from behind the couch: popUp 0 (hidden) … 1 (up)
      const u = Math.max(0, Math.min(1, o.popUp ?? 1))
      const top = (612 - cam.y) * zoom + 360
      place[o.pop] = { x: ids.length >= 3 ? MARKS.couch[1].x - 70 : MARKS.couch[1].x, y: 720 - u * 150, scale: o.popScale ?? 0.9, look: 'larry', z: 1, floor: null, clip: { x: 0, y: -100, w: 1280, h: top + 100 } }
    }
    return { cam, place, audience: 0 }
  },

  /** Hy Oid & The Formants on the bandstand */
  band(show, o = {}) {
    const place = bandPlace(show, o.look ?? 'camera')
    if (o.with) for (const id of [].concat(o.with)) place[id] = { ...MARKS.anncr, scale: 0.9, look: 'camera', z: 2 }
    return { cam: { x: 352, y: 640, zoom: o.zoom ?? 1.5 }, place, audience: 0.8 }
  },

  /**
   * News style: one presenter (`who`, default Larry) fills a third of the frame on `side`
   * ('left' default), the rest is a graphics panel (show.panel, stage units) the segment draws into.
   * Larry sits at his desk; anyone else stands at the presenter's mark in front of the window.
   * `pip: '<id>'` adds a small picture-in-picture monitor with that puppet in the panel's corner.
   */
  ots(show, o = {}) {
    const who = o.who ?? 'larry'
    const right = o.side === 'right'
    const zoom = o.zoom ?? 1.75
    const P0 = who === 'larry' ? larryAt('desk') : { ...MARKS.presenter, scale: 1, z: 5, floor: WORLD.floor }
    const sx = right ? 960 : 270
    const cam = { x: P0.x - (sx - 640) / zoom - (right ? -40 : 40) / zoom, y: P0.y + 70, zoom }
    const panel = o.panel ?? (right ? { x: 40, y: 64, w: 690, h: 470 } : { x: 520, y: 64, w: 720, h: 470 })
    const place = { [who]: { ...P0, look: o.look ?? (right ? 'left' : 'right'), instrument: o.desk ?? P0.instrument } }
    const set = who === 'larry' ? {} : { chair: false, couch: false, desk: false }
    const L = { cam, place, audience: 0, panel, set }
    if (o.pip) {
      const w = 230, h = 150
      const r = right ? { x: panel.x + 18, y: panel.y + panel.h - h - 18, w, h } : { x: panel.x + panel.w - w - 18, y: panel.y + panel.h - h - 18, w, h }
      monitor(L, o.pip, r, { label: o.pipLabel ?? show.CAST[o.pip]?.name ?? o.pip, live: o.pipLive ?? false, noStand: true })
    }
    return L
  },

  /** sports desk: ots with a sports desk in front of the correspondent and a ticker lane (`ticker: 'text'`) */
  sports(show, o = {}) {
    const L = SHOTS.ots(show, { who: 'eppy', desk: 'sportsdesk', ...o, panel: o.panel ?? (o.side === 'right' ? { x: 40, y: 54, w: 690, h: 430 } : { x: 520, y: 54, w: 720, h: 430 }) })
    L.lane = { y: 676, h: 36, text: o.ticker ?? null, tag: o.tickerTag ?? 'SCORES' }
    return L
  },

  /**
   * A remote guest on the big studio monitor (screen-left), Larry at the desk (screen-right).
   * { guest, label, live (default true) }
   */
  remote(show, o = {}) {
    const g = o.guest ?? show.guests[0]
    const zoom = o.zoom ?? 1.6
    const L0 = larryAt('desk', 'left')
    const L = { cam: { x: L0.x - (960 - 640) / zoom, y: L0.y + 70, zoom }, place: { larry: L0 }, audience: 0, set: { chair: false, couch: false } }
    if (g) monitor(L, g, { x: 60, y: 60, w: 560, h: 400 }, { label: o.label ?? show.CAST[g]?.name ?? g, live: o.live ?? true })
    return L
  },

  /** two remote guests on two monitors side by side, Larry at the desk screen-right. { guests: [a, b], labels, live } */
  remote2(show, o = {}) {
    const [a, b] = o.guests ?? show.guests.slice(0, 2)
    const zoom = o.zoom ?? 1.6
    const L0 = larryAt('desk', 'left')
    const L = { cam: { x: L0.x - (1030 - 640) / zoom, y: L0.y + 70, zoom }, place: { larry: L0 }, audience: 0, set: { chair: false, couch: false } }
    if (a) monitor(L, a, { x: 40, y: 90, w: 390, h: 300 }, { label: o.labels?.[0] ?? show.CAST[a]?.name ?? a, live: o.live ?? true })
    if (b) monitor(L, b, { x: 460, y: 90, w: 390, h: 300 }, { label: o.labels?.[1] ?? show.CAST[b]?.name ?? b, live: o.live ?? true })
    return L
  },

  /** Sibyl (or `who`) at the announcer's lectern, medium shot */
  podium(show, o = {}) {
    const who = o.who ?? 'sibyl'
    const m = MARKS.lectern
    const place = { [who]: { ...m, scale: 1, look: o.look ?? 'camera', z: 4, floor: WORLD.floor, instrument: 'lectern' } }
    return { cam: { x: m.x + 20, y: m.y + 100, zoom: o.zoom ?? 1.7 }, place, audience: 0.5 }
  },

  /** Larry at the desk plus one house character at a stand beside it: { with: 'sibyl'|'eppy'|…, stand: 'stand'|'lectern' } */
  deskWith(show, o = {}) {
    const w = o.with ?? 'sibyl'
    const place = { larry: larryAt('desk', o.look ?? w), [w]: { ...MARKS.stand, scale: 1, look: 'larry', z: 4, floor: WORLD.floor, instrument: o.stand ?? 'stand' } }
    const cx = (MARKS.stand.x + MARKS.desk.x) / 2
    return { cam: { x: cx, y: 640, zoom: o.zoom ?? 1.4 }, place, audience: 0, set: { chair: false, couch: false } }
  },

  /** the musical number: `lead` (Larry) centre stage, the band in a row behind him, room above for lyrics */
  stage(show, o = {}) {
    const lead = o.lead ?? 'larry'
    const band = o.band ?? BAND
    const place = { [lead]: { x: 970, y: 470, scale: 1, look: o.look ?? 'camera', z: 6, floor: WORLD.floor } }
    const n = band.length
    band.forEach((id, i) => {
      const u = n > 1 ? i / (n - 1) : 0.5
      const x = 970 + (u - 0.5) * 2 * 210 + (u < 0.5 ? -40 : 40)
      place[id] = { x, y: 430 + Math.abs(u - 0.5) * 40, scale: 0.78, look: 'camera', z: 2, floor: WORLD.floor }
    })
    return { cam: { x: 970, y: 470, zoom: o.zoom ?? 1.15 }, place, audience: 1, set: { chair: false, couch: false } }
  },

  /** a close-up of one puppet's head (opts.who, or show.shot('closeup', {who})) — see also closeup(who) */
  closeup(show, o = {}) {
    const who = o.who ?? 'larry'
    const base = show.markOf(who)
    const zoom = (o.size ?? 520) / (TILE * (base.scale ?? 1))
    const place = { [who]: { ...base, look: o.look ?? base.look ?? 'camera' } }
    return { cam: { x: base.x + (o.dx ?? 0), y: base.y + TILE * 0.18 * (base.scale ?? 1), zoom }, place, audience: 0 }
  },

  /** the title card: the desk and the skyline, Larry idling, room for the logo on the left */
  title(show) {
    const place = { larry: larryAt('desk', 'camera') }
    return { cam: { x: 1590, y: 590, zoom: 1.45 }, place, audience: 0 }
  },
}

/** the house: everyone who isn't a guest */
export const HOUSE_IDS = ['larry', 'sibyl', 'hy', 'al', 'dee', 'pete', 'eppy', 'bot']
