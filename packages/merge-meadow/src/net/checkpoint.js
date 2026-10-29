// Rest-pose checkpoints (design §4.4). Every everyMs (3 s) the owner writes, in
// ONE change (the caller's flush), the pose of each owned entity that moved more
// than minMove (0.1 m) or turned more than minTurnDeg (5°) since the pose the doc
// holds, rounded to mm / 0.1°. Also on ownership release and on pagehide
// (flushNow). Checkpoints serve resting entities and worlds opened with nobody
// online; a live joiner converges from the stream (S2: 7 entities with a hunting
// T-rex grew the doc by 46 B/s). Ops are `checkpoint {id, p, r}`, which track A's
// ops write per axis so a concurrent editor change to another axis still merges.
const DEG = 180 / Math.PI
const r3 = (x) => Math.round(x * 1000) / 1000
const r1 = (x) => Math.round(x * 10) / 10
const wrapDeg = (a) => { const w = ((a + 180) % 360 + 360) % 360 - 180; return w === -180 ? 180 : w }

export function makeCheckpointer ({ world, owns, everyMs = 3000, minMove = 0.1, minTurnDeg = 5, flush, now = () => Date.now() }) {
  let last = now()
  const written = new Map() // id -> [x, y, z, yawDeg] last written by me
  let rowsWritten = 0

  const far = (a, b) => !b || Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) > minMove || Math.abs(wrapDeg(a[3] - b[3])) > minTurnDeg

  function opFor (e) {
    const l = e?.live; const tr = e?.c?.transform
    if (!l?.p || !tr || e.local) return null
    const pose = [l.p[0], l.p[1], l.p[2], wrapDeg((l.yaw ?? 0) * DEG)]
    const dp = tr.p ?? [0, 0, 0]; const dr = tr.r ?? [0, 0, 0]
    const docPose = [Number(dp[0]) || 0, Number(dp[1]) || 0, Number(dp[2]) || 0, Number(dr[1]) || 0]
    // skip if the doc already holds it, or if I already wrote it and the patch has not come back yet
    if (!far(pose, docPose) || !far(pose, written.get(e.id))) return null
    const p = [r3(pose[0]), r3(pose[1]), r3(pose[2])]
    const yaw = r1(pose[3])
    written.set(e.id, [p[0], p[1], p[2], yaw])
    return { op: 'checkpoint', id: e.id, p, r: [Number(dr[0]) || 0, yaw, Number(dr[2]) || 0] }
  }

  function collect (ids) {
    const ops = []
    for (const id of ids) { const op = opFor(world.get(id)); if (op) ops.push(op) }
    return ops
  }

  function emit (ops) {
    if (!ops.length) return ops
    rowsWritten += ops.length
    flush?.(ops)
    return ops
  }

  return {
    tick (t = now()) {
      if (t - last < everyMs) return []
      last = t
      const ids = [...world.entities.keys()].filter((id) => owns(id)).sort()
      for (const id of [...written.keys()]) if (!world.entities.has(id)) written.delete(id)
      return emit(collect(ids))
    },
    // ids: entities just lost (no longer owned, so passed explicitly); default all owned
    flushNow (ids) {
      const list = ids ?? [...world.entities.keys()].filter((id) => owns(id))
      return emit(collect([...list].sort()))
    },
    stats: () => ({ rowsWritten }),
  }
}
