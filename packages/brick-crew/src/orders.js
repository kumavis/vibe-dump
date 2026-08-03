// ---------------------------------------------------------------------------
// Orders — the few dials the viewer is allowed to turn.
//
// Brick Crew is a diorama: left alone it runs the street on its own forever.
// This module is the small hole you can reach through. Nothing here drives the
// simulation directly; it just holds what has been asked for, and the sim and
// the renderer read it at the moments they would have read a constant.
//
// Two of the three take effect at a seam rather than instantly, which is the
// honest thing — you cannot re-crew a shift that is already on site, or change
// the house that is already half built. What you set is what turns up next,
// and the panel says so.
// ---------------------------------------------------------------------------

import { ROSTER, HOUSE_TYPES, PAINT, ROOFS } from './config.js'

/** Roles you can move robots between. The foreman is not one of them. */
export const CREWABLE = ['mason', 'barrow', 'carrier']
/** Nobody wants to watch two masons build a house, or forty. */
export const CREW_MIN = 4
export const CREW_MAX = 16
const ROLE_MIN = 1
const ROLE_MAX = 10

const listeners = new Set()
const notify = () => listeners.forEach((fn) => fn(orders))

/** Working copy of the shipped roster, keyed by role. */
const counts = Object.fromEntries(ROSTER.map((s) => [s.role, s.n]))

export const orders = {
  /** Sim time multiplier. The camera and the paper still run at wall speed. */
  speed: 1,
  /** Index into HOUSE_TYPES, or null to let the street carry on in order. */
  house: null,
  /** Index into PAINT, or null for the same. */
  paint: null,
  /** Index into ROOFS, or null to let the street carry on in order. */
  roof: null,

  get counts() {
    return { ...counts }
  },
  get crewSize() {
    return Object.values(counts).reduce((a, b) => a + b, 0)
  },

  /**
   * One entry per robot, in the order the yard should build them — which is
   * also the order they walk in at the gate.
   */
  roles() {
    return ROSTER.flatMap((slot) =>
      Array.from({ length: counts[slot.role] ?? slot.n }, () => slot.role))
  },

  /**
   * Which of those are gangers. The first body of each trade off the line is
   * that gang's head worker — white hat, and the one who holds the drawing at
   * the start of the shift. Both the yard and the site work it out the same
   * way from the same list, so they always agree on who is in charge.
   */
  leads(roles) {
    const seen = new Set()
    return roles.map((role) => {
      if (role === 'foreman' || seen.has(role)) return false
      seen.add(role)
      return true
    })
  },

  /** Move one robot into or out of a role. Returns whether anything changed. */
  adjust(role, delta) {
    if (!CREWABLE.includes(role)) return false
    const next = counts[role] + delta
    if (next < ROLE_MIN || next > ROLE_MAX) return false
    const size = orders.crewSize + delta
    if (size < CREW_MIN || size > CREW_MAX) return false
    counts[role] = next
    notify()
    return true
  },

  setSpeed(v) {
    if (orders.speed === v) return
    orders.speed = v
    notify()
  },

  /** `null` puts the choice back in the developer's hands. */
  setHouse(i) {
    orders.house = i
    notify()
  },
  setPaint(i) {
    orders.paint = i
    notify()
  },
  setRoof(i) {
    orders.roof = i
    notify()
  },

  /**
   * What to build on the next plot. A pick is spent once used, so the street
   * carries on by itself afterwards rather than repeating your choice forever.
   */
  takeHouse(day) {
    const i = orders.house ?? (day - 1) % HOUSE_TYPES.length
    if (orders.house != null) {
      orders.house = null
      notify()
    }
    return HOUSE_TYPES[i % HOUSE_TYPES.length]
  },
  takePaint(day) {
    const i = orders.paint ?? (day - 1) % PAINT.length
    if (orders.paint != null) {
      orders.paint = null
      notify()
    }
    return PAINT[i % PAINT.length]
  },
  takeRoof(day) {
    // offset from the wall colour so the two do not march in lockstep
    const i = orders.roof ?? (day + 2) % ROOFS.length
    if (orders.roof != null) {
      orders.roof = null
      notify()
    }
    return ROOFS[i % ROOFS.length]
  },

  onChange(fn) {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },
}
