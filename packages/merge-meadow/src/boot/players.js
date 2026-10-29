// Players are LOCAL entities (design §3.1, §9): `player:<peerId>`, one per live
// presence peer, never written to the doc. Mine follows the rig and is
// streamed at 20 Hz by the pose stream (ownership says players own
// themselves); remote ones get their live pose from that stream. Riding is a
// `rider` component on my player, so the built-in mount/control systems and
// ownership ("a ridden mount follows its rider's peer") see it like any rider.
// It is also published in presence (`info.riding`) and put on the remote
// player entities built from it, so EVERY peer computes the same owner for a
// ridden mount (design §4.1), not just the rider's own.
export const PLAYER = 'player:'
export const AVATAR = Object.freeze({ kind: 'billboard', image: 'emoji:🧑', size: 1.7 })

const base = () => ({ transform: { p: [0, 0, 0], r: [0, 0, 0], s: [1, 1, 1] }, controller: { kind: 'input' }, tags: { player: true } })

// a remote peer's `info.riding`, checked: presence info is whatever a peer sent
export function ridingOf (info) {
  const r = info?.riding
  if (!r || typeof r !== 'object' || typeof r.mount !== 'string' || !r.mount || r.mount.length > 80) return null
  const seat = Number.isInteger(r.seat) && r.seat >= 0 && r.seat < 16 ? r.seat : 0
  return { mount: r.mount, seat }
}

export function makePlayers ({ world, presence, peerId, rig, avatar = AVATAR }) {
  const selfId = PLAYER + peerId
  let riding = null
  let move = [0, 0]
  const remote = new Set()

  const self = (extra = {}) => world.addLocal(selfId, { name: presence?.info?.()?.name ?? 'you', components: { ...base(), ...extra } })
  self()

  const shape = new Map() // remote player id -> the info key it was built from
  function sync () {
    const live = presence?.peers?.() ?? new Map()
    for (const [id, p] of live) {
      const eid = PLAYER + id
      const name = String(p.info?.name ?? id)
      const rider = ridingOf(p.info)
      const key = JSON.stringify([name, rider])
      if (!remote.has(eid) || shape.get(eid) !== key || !world.get(eid)) {
        world.addLocal(eid, { name, components: { ...base(), representation: { ...avatar }, ...(rider ? { rider } : {}) } })
        remote.add(eid); shape.set(eid, key)
      }
    }
    for (const eid of [...remote]) if (!live.has(eid.slice(PLAYER.length))) { world.removeLocal(eid); remote.delete(eid); shape.delete(eid) }
  }

  // my live pose from the rig, unless the mount system seats me
  function updateSelf () {
    const e = world.get(selfId)
    if (!e || riding || !rig?.pose) return
    const pose = rig.pose()
    if (!Array.isArray(pose?.p)) return
    e.live.p = [pose.p[0], pose.p[1], pose.p[2]]
    e.live.yaw = Number(pose.yaw) || 0
    e.live.anim = 'idle'
  }

  return {
    selfId,
    sync,
    updateSelf,
    setMove (v) { move = Array.isArray(v) ? [Number(v[0]) || 0, Number(v[1]) || 0] : [0, 0] },
    inputs: () => new Map([[selfId, { move }]]),
    mount (id, seat = 0) { riding = id; self({ rider: { mount: id, seat } }); presence?.set?.({ riding: { mount: id, seat } }) },
    dismount () { riding = null; self(); presence?.set?.({ riding: null }) },
    get riding () { return riding },
    rename () { self(riding ? { rider: { mount: riding, seat: 0 } } : {}) },
  }
}
