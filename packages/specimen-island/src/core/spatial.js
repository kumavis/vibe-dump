// Uniform grid over the XZ plane. Static colliders live in one so movement and
// ray casts only ever look at the handful of trunks and walls nearby.

export class SpatialHash {
  constructor(cellSize = 16) {
    this.cell = cellSize
    this.map = new Map()
  }
  key(cx, cz) {
    return (cx + 32768) * 65536 + (cz + 32768)
  }
  insert(item, minX, minZ, maxX, maxZ) {
    const c = this.cell
    const x0 = Math.floor(minX / c)
    const x1 = Math.floor(maxX / c)
    const z0 = Math.floor(minZ / c)
    const z1 = Math.floor(maxZ / c)
    for (let cx = x0; cx <= x1; cx++) {
      for (let cz = z0; cz <= z1; cz++) {
        const k = this.key(cx, cz)
        let list = this.map.get(k)
        if (!list) this.map.set(k, (list = []))
        list.push(item)
      }
    }
  }
  remove(item, minX, minZ, maxX, maxZ) {
    const c = this.cell
    for (let cx = Math.floor(minX / c); cx <= Math.floor(maxX / c); cx++) {
      for (let cz = Math.floor(minZ / c); cz <= Math.floor(maxZ / c); cz++) {
        const list = this.map.get(this.key(cx, cz))
        if (!list) continue
        const i = list.indexOf(item)
        if (i >= 0) list.splice(i, 1)
      }
    }
  }
  cellItems(cx, cz) {
    return this.map.get(this.key(cx, cz))
  }
  // Collect unique items overlapping a box. `stamp` dedupes without a Set.
  query(minX, minZ, maxX, maxZ, out = []) {
    const c = this.cell
    const stamp = ++this._stamp || (this._stamp = 1)
    for (let cx = Math.floor(minX / c); cx <= Math.floor(maxX / c); cx++) {
      for (let cz = Math.floor(minZ / c); cz <= Math.floor(maxZ / c); cz++) {
        const list = this.map.get(this.key(cx, cz))
        if (!list) continue
        for (const it of list) {
          if (it._stamp === stamp) continue
          it._stamp = stamp
          out.push(it)
        }
      }
    }
    return out
  }
}
