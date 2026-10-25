import { ITEMS } from '../data/items.js'
import { WEAPONS } from '../data/weapons.js'

// What the player carries: stackable items with caps, and the set of weapons
// they own. Weapon magazines live in the weapon system; reserves live here.

export class Inventory {
  constructor(events) {
    this.events = events
    this.items = {}
    this.weapons = new Set()
  }
  count(id) {
    return this.items[id] || 0
  }
  has(id, n = 1) {
    return this.count(id) >= n
  }
  add(id, n = 1) {
    const def = ITEMS[id]
    const cap = def ? def.max : 99
    const before = this.count(id)
    const after = Math.min(cap, before + n)
    this.items[id] = after
    const got = after - before
    if (got > 0) this.events.emit('item:gained', { item: id, count: got })
    return got
  }
  take(id, n = 1) {
    if (this.count(id) < n) return false
    this.items[id] -= n
    return true
  }
  giveWeapon(id) {
    if (this.weapons.has(id)) return false
    this.weapons.add(id)
    this.events.emit('weapon:gained', { weapon: id })
    return true
  }
  // Apply a loot/cache bundle; returns human-readable lines for a toast.
  grant(bundle) {
    const lines = []
    // ammo first, so a new gun can load straight from it
    for (const [id, n] of Object.entries(bundle.items || {})) {
      const got = this.add(id, n)
      if (got > 0) lines.push(`${got} × ${ITEMS[id].name}`)
    }
    for (const w of bundle.weapons || []) if (this.giveWeapon(w)) lines.unshift(WEAPONS[w].name)
    return lines
  }
}
