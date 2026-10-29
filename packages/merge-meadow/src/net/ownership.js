// Effective owner of every entity, recomputed once per tick (design §4.1):
//   owner(e) = player:<p>          -> p                      players own themselves
//           ?? riderPeer(e)                                  a ridden mount follows its rider's peer
//           ?? (isLive(e.owner) ? e.owner : null)            an explicit pin, while that peer is present
//           ?? host                                          lowest live candidate (presence.host())
// Local non-player entities belong to this peer. update() reports gains and
// losses so the caller can forget/hold stream buffers and checkpoint on loss.
//
// Pins follow S2's conditional protocol: a grab is refused while the entity is
// pinned to another live peer; release writes the final transform and clears the
// pin in one change, and only if the pin is still mine; a drag whose pin is no
// longer mine (pinnedToMe() false) aborts and writes nothing.
const PLAYER = 'player:'
const MAX_RIDER_DEPTH = 4

export function makeOwnership ({ presence, world, peerId }) {
  const map = new Map() // id -> owner peer id | null
  let host = null

  const pinOf = (e) => String(e?.owner ?? '')
  const peerName = (p) => { const i = presence.info?.(p); return i?.name ? `${i.name}` : p }

  // mount id -> the rider entity that controls it (lowest id wins a contested seat)
  const ridersOf = () => {
    const riders = new Map()
    for (const e of world.entities.values()) {
      const m = e.c?.rider?.mount
      // doc strings are ImmutableString: a dismounted rider's '' is not === ''
      if (m == null || String(m) === '') continue
      const k = String(m)
      const cur = riders.get(k)
      if (!cur || e.id < cur.id) riders.set(k, e)
    }
    return riders
  }

  function ownerOf (e, riders, depth = 0) {
    if (e.id.startsWith(PLAYER)) return e.id.slice(PLAYER.length)
    if (e.local) return peerId
    const r = depth < MAX_RIDER_DEPTH ? riders.get(e.id) : null
    if (r) return ownerOf(r, riders, depth + 1)
    const pin = pinOf(e)
    if (pin && presence.isLive(pin)) return pin
    return host
  }

  const owns = (id) => {
    if (map.has(id)) return map.get(id) === peerId
    // not seen by update() yet (spawned this tick): decide on the spot, same rule
    const e = world.get?.(id)
    return !!e && ownerOf(e, ridersOf()) === peerId
  }
  const owner = (id) => {
    if (map.has(id)) return map.get(id)
    const e = world.get?.(id)
    return e ? ownerOf(e, ridersOf()) : null
  }

  // isHost gates doc systems' world.spawn(): without it every peer would spawn once
  world.setOwnership?.({ owns, owner, isHost: () => presence.host() === peerId })

  function canGrab (id) {
    const e = world.get?.(id)
    if (!e) return 'no such entity'
    const riders = ridersOf()
    const r = riders.get(id)
    if (r) { const o = ownerOf(r, riders); if (o && o !== peerId) return `ridden by ${peerName(o)}` }
    const pin = pinOf(e)
    if (pin && pin !== peerId && presence.isLive(pin)) return `held by ${peerName(pin)}`
    return true
  }

  return {
    update () {
      host = presence.host()
      const riders = ridersOf()
      const gained = []; const lost = []
      for (const e of world.entities.values()) {
        const o = ownerOf(e, riders)
        const prev = map.has(e.id) ? map.get(e.id) : undefined
        if (o === prev) continue
        map.set(e.id, o)
        if (o === peerId) gained.push(e.id)
        else if (prev === peerId) lost.push(e.id)
      }
      for (const id of [...map.keys()]) if (!world.entities.has(id)) map.delete(id)
      gained.sort(); lost.sort()
      return { gained, lost }
    },
    owner,
    owns,
    host: () => host,
    owned () { return [...map].filter(([, o]) => o === peerId).map(([id]) => id).sort() },
    canGrab,
    pinnedToMe (id) { return pinOf(world.get?.(id)) === peerId },
    // compare-and-set: the pin lands only if `owner` is still what I saw
    pinOps (id) {
      if (canGrab(id) !== true) return []
      return [{ op: 'pin', id, owner: peerId, ifOwner: pinOf(world.get(id)) }]
    },
    // transform: { p, r?, s? } written in the same change as the unpin
    unpinOps (id, { transform } = {}) {
      if (pinOf(world.get?.(id)) !== peerId) return []
      return [
        ...(transform ? [{ op: 'transform', id, ...transform }] : []),
        { op: 'unpin', id, ifOwner: peerId },
      ]
    },
  }
}
