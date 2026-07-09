/**
 * E-graph core: union-find canonicalization, hash-consing (the memoizer),
 * monotone cell values with a single lattice `join`, and congruence repair.
 *
 * This module (and everything in engine/) is DOM-free and runs headless.
 *
 * Contract clauses enforced here (see the v2 correctness contract):
 * - A1 lattice discipline: every component of a CellValue has an ACI join —
 *   `alts` is a grow-only set (join = union), `best` is min in a TOTAL order
 *   (CO-3), `provenance` is a set keyed by canonical provenance keys (CO-2).
 * - A4 soundness: the literal-collision tripwire (CO-7) — two distinct
 *   literals in one class is a witness that INV-SOUND broke.
 * - A5 canonicalization: ids are resolved through find() at use time; spans
 *   are only reachable through the canonicalizing accessor `spansOf` (CO-6).
 */
import type { Span } from '../lang/span'
import { spanKey } from '../lang/span'

export type EClassId = number
export type Value = number | boolean
export type BinOp = '+' | '-' | '*' | '<' | '<=' | '=='

export type ENode =
  | { op: 'lit'; value: Value }
  | { op: BinOp; args: [EClassId, EClassId] }
  | { op: 'if'; args: [EClassId, EClassId, EClassId] }
  | { op: 'call'; fn: string; args: EClassId[] }

export function nodeChildren(node: ENode): EClassId[] {
  return node.op === 'lit' ? [] : node.args
}

/**
 * CO-2: provenance is a lattice value. An entry is identified by
 * (rule, round, sorted canonical premise ids at firing time); join = set
 * union over these keys, which is ACI by construction. `detail` is derived
 * display text, deterministic given the key, not part of identity.
 *
 * Why `round` is safe inside the key: shuffling permutes delta application
 * WITHIN a round; round contents are determined by the start-of-round
 * snapshot (A2) and are therefore schedule-invariant. NOTE this is only true
 * because CO-1 removed per-firing fuel from the rules — with a per-firing
 * budget, which instances fired in a round would depend on the schedule and
 * `round` would leak schedule into the lattice. CO-1 and CO-2 are
 * interdependent.
 */
export interface ProvenanceEntry {
  rule: string
  round: number
  /** Canonical ids of the classes the firing read, sorted, at firing time. */
  premises: EClassId[]
  detail: string
}

export function provKeyOf(p: ProvenanceEntry): string {
  return `${p.rule}@${p.round}|${[...p.premises].sort((a, b) => a - b).join(',')}`
}

/**
 * CO-3: `best` is min in a TOTAL order: (cost, tieKey). The tieKey is the
 * candidate's fully-expanded extracted term (children rendered by THEIR best
 * tieKeys), not a hash over canonical child ids — child ids are
 * schedule-dependent (A3.2), so keying on them would let ties resolve
 * differently across shuffled runs even though the quotient structures
 * agree. The extracted-term string is invariant modulo class renaming.
 * Recomputed during the cost fixpoint (CO-5), since unions change children.
 */
export interface BestEntry {
  cost: number
  node: ENode
  tieKey: string
}

/** The lattice value held by each e-class cell. */
export interface CellValue {
  /** Grow-only set of alternatives, keyed by canonical node key. Join = union. */
  alts: Map<string, ENode>
  /** Join = min by (cost, tieKey) — a total order, see CO-3. */
  best: BestEntry | null
  /** Grow-only set keyed by provKeyOf. Join = union. */
  provenance: Map<string, ProvenanceEntry>
}

export function emptyCell(): CellValue {
  return { alts: new Map(), best: null, provenance: new Map() }
}

function betterBest(a: BestEntry, b: BestEntry): BestEntry {
  if (a.cost !== b.cost) return a.cost < b.cost ? a : b
  return a.tieKey <= b.tieKey ? a : b
}

/**
 * The single lattice join (A1). Commutative, associative, idempotent:
 *   alts       — set union
 *   best       — min in the (cost, tieKey) total order
 *   provenance — set union by provenance key
 * Returns a NEW CellValue; never mutates its inputs.
 */
export function join(a: CellValue, b: CellValue): CellValue {
  const alts = new Map(a.alts)
  for (const [k, n] of b.alts) if (!alts.has(k)) alts.set(k, n)
  let best: BestEntry | null
  if (a.best === null) best = b.best
  else if (b.best === null) best = a.best
  else best = betterBest(a.best, b.best)
  const provenance = new Map(a.provenance)
  for (const [k, p] of b.provenance) if (!provenance.has(k)) provenance.set(k, p)
  return { alts, best, provenance }
}

/** Structural key for a node whose child ids are ALREADY canonical. */
export function nodeKeyOf(node: ENode): string {
  switch (node.op) {
    case 'lit':
      return `lit:${typeof node.value}:${node.value}`
    case 'call':
      return `call:${node.fn}:${node.args.join(',')}`
    default:
      return `${node.op}:${node.args.join(',')}`
  }
}

export interface MergeRecord {
  a: EClassId
  b: EClassId
  result: EClassId
  rule: string
  detail: string
}

export interface TighteningRecord {
  classId: EClassId
  cost: number
}

/** CO-7: thrown (in strict mode) when the literal-collision tripwire fires. */
export class SoundnessError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SoundnessError'
  }
}

export interface EGraphOptions {
  /**
   * CO-7 tripwire mode: strict (default) throws SoundnessError; non-strict
   * records the violation (the UI shows a red engine-bug banner instead of
   * silently corrupt results). There is no legitimate program that triggers
   * the tripwire — mewlang is deterministic — so any trigger is an engine bug.
   */
  strictSoundness?: boolean
}

export class EGraph {
  private parent: number[] = []
  private rank: number[] = []
  /** canonical id -> cell */
  private cells = new Map<EClassId, CellValue>()
  /** canonical id -> source span keys. Access ONLY via spansOf (CO-6). */
  private spanSets = new Map<EClassId, Set<string>>()
  /** canonical child id -> (nodeKey -> the parent node and the class it lives in) */
  private parentsOf = new Map<EClassId, Map<string, { node: ENode; classId: EClassId }>>()
  /** canonical node key -> class id (values canonicalized on read). THE memoizer. */
  private hashcons = new Map<string, EClassId>()
  private worklist: EClassId[] = []
  private strictSoundness: boolean

  /** CO-7: non-strict mode records violations here for the UI banner. */
  soundnessViolations: string[] = []

  /** Classes allocated since the last drain — the round's "topology" report. */
  newClasses: EClassId[] = []
  /** Unions actually performed since the last drain (incl. congruence repairs). */
  mergeLog: MergeRecord[] = []
  /** Canonical ids whose cell value changed since the last drain. */
  dirty = new Set<EClassId>()

  constructor(opts: EGraphOptions = {}) {
    this.strictSoundness = opts.strictSoundness ?? true
  }

  find(x: EClassId): EClassId {
    let root = x
    while (this.parent[root] !== root) root = this.parent[root]
    while (this.parent[x] !== root) {
      const next = this.parent[x]
      this.parent[x] = root
      x = next
    }
    return root
  }

  canonicalize(node: ENode): ENode {
    if (node.op === 'lit') return node
    if (node.op === 'call') {
      return { op: 'call', fn: node.fn, args: node.args.map((a) => this.find(a)) }
    }
    if (node.op === 'if') {
      const [c, t, e] = node.args
      return { op: 'if', args: [this.find(c), this.find(t), this.find(e)] }
    }
    const [a, b] = node.args
    return { op: node.op, args: [this.find(a), this.find(b)] }
  }

  nodeKey(node: ENode): string {
    return nodeKeyOf(this.canonicalize(node))
  }

  private allocClass(): EClassId {
    const id = this.parent.length
    this.parent.push(id)
    this.rank.push(0)
    this.cells.set(id, emptyCell())
    this.spanSets.set(id, new Set())
    this.parentsOf.set(id, new Map())
    this.newClasses.push(id)
    return id
  }

  /**
   * Intern a node: return the existing class if this structure is known
   * (hash-consing = structural memoization), else allocate a fresh class.
   */
  add(node: ENode, spans: Span[] = [], prov?: ProvenanceEntry): EClassId {
    const canon = this.canonicalize(node)
    const key = nodeKeyOf(canon)
    const existing = this.hashcons.get(key)
    if (existing !== undefined) {
      const id = this.find(existing)
      this.addSpans(id, spans)
      if (prov) this.addProvenance(id, prov)
      return id
    }
    const id = this.allocClass()
    const provenance = new Map<string, ProvenanceEntry>()
    if (prov) provenance.set(provKeyOf(prov), prov)
    this.joinInto(id, { alts: new Map([[key, canon]]), best: null, provenance })
    this.addSpans(id, spans)
    this.hashcons.set(key, id)
    for (const child of nodeChildren(canon)) {
      const c = this.find(child)
      this.parentsOf.get(c)!.set(key, { node: canon, classId: id })
    }
    return id
  }

  /** All writes to a cell funnel through the lattice join (A1). */
  private joinInto(id: EClassId, delta: CellValue): boolean {
    const cur = this.cells.get(id)!
    const next = join(cur, delta)
    const changed =
      next.alts.size !== cur.alts.size ||
      next.provenance.size !== cur.provenance.size ||
      (next.best?.cost ?? Infinity) !== (cur.best?.cost ?? Infinity)
    this.cells.set(id, next)
    if (changed) this.dirty.add(id)
    this.checkLiteralCollision(id, next)
    return changed
  }

  /**
   * CO-7 literal-collision tripwire: a class containing two DISTINCT literals
   * directly witnesses that INV-SOUND is broken (two unequal values proved
   * equal). On by default; any trigger is an engine bug by definition.
   */
  private checkLiteralCollision(id: EClassId, cell: CellValue): void {
    let seen: Value | undefined
    let seenAny = false
    for (const n of cell.alts.values()) {
      if (n.op !== 'lit') continue
      if (seenAny && n.value !== seen) {
        const msg = `soundness violation: class #${id} contains distinct literals ${String(seen)} and ${String(n.value)}`
        if (this.strictSoundness) throw new SoundnessError(msg)
        if (!this.soundnessViolations.includes(msg)) this.soundnessViolations.push(msg)
        return
      }
      seen = n.value
      seenAny = true
    }
  }

  addProvenance(id: EClassId, prov: ProvenanceEntry): void {
    this.joinInto(this.find(id), {
      alts: new Map(),
      best: null,
      provenance: new Map([[provKeyOf(prov), prov]]),
    })
  }

  addSpans(id: EClassId, spans: Span[]): void {
    if (spans.length === 0) return
    const set = this.spanSets.get(this.find(id))!
    for (const s of spans) set.add(spanKey(s))
  }

  /**
   * `AddAlt(classId, node)` — CO-6: both the target id and the node's child
   * ids are canonicalized HERE, at application time, never at emission time.
   * A union applied earlier in the same merge phase may have retired the ids
   * the rule captured from the snapshot.
   */
  addAlt(classId: EClassId, node: ENode, prov: ProvenanceEntry): void {
    const nodeClass = this.add(node, [], prov)
    const target = this.find(classId)
    this.addProvenance(target, prov)
    this.union(target, nodeClass, prov.rule, prov.detail)
  }

  union(a: EClassId, b: EClassId, rule: string, detail: string): EClassId {
    a = this.find(a) // CO-6: canonicalize at application time
    b = this.find(b)
    if (a === b) return a
    if (this.rank[a] < this.rank[b]) [a, b] = [b, a]
    if (this.rank[a] === this.rank[b]) this.rank[a]++
    // b merges into a
    this.parent[b] = a
    this.joinInto(a, this.cells.get(b)!)
    this.cells.delete(b)
    const bSpans = this.spanSets.get(b)!
    const aSpans = this.spanSets.get(a)!
    for (const s of bSpans) aSpans.add(s)
    this.spanSets.delete(b)
    const bParents = this.parentsOf.get(b)!
    const aParents = this.parentsOf.get(a)!
    for (const [k, v] of bParents) if (!aParents.has(k)) aParents.set(k, v)
    this.parentsOf.delete(b)
    this.dirty.add(a)
    this.mergeLog.push({ a, b, result: a, rule, detail })
    this.worklist.push(a)
    return a
  }

  /**
   * Congruence repair to fixpoint (egg-style rebuild): re-canonicalize parent
   * nodes of merged classes; when two nodes collapse to the same structure,
   * union their classes. CO-6: this runs to fixpoint WITHIN the merge phase —
   * never deferred across rounds — so every round starts congruence-closed
   * and A2's snapshot semantics stay simple. Returns the unions performed so
   * the scheduler can surface them as R-congruence firings.
   */
  rebuild(): MergeRecord[] {
    const congruences: MergeRecord[] = []
    while (this.worklist.length > 0) {
      const raw = this.worklist.pop()!
      const id = this.find(raw)
      const ps = this.parentsOf.get(id)
      if (!ps || ps.size === 0) continue
      const entries = [...ps.entries()]
      ps.clear()
      for (const [oldKey, { node, classId }] of entries) {
        const canon = this.canonicalize(node)
        const newKey = nodeKeyOf(canon)
        const owner = this.find(classId)
        const hcOld = this.hashcons.get(oldKey)
        if (hcOld !== undefined && oldKey !== newKey) this.hashcons.delete(oldKey)
        const hcNew = this.hashcons.get(newKey)
        if (hcNew !== undefined) {
          const other = this.find(hcNew)
          if (other !== owner) {
            // Two structurally identical nodes in different classes: congruence.
            const before = this.mergeLog.length
            const result = this.union(owner, other, 'R-congruence', `congruent ${newKey}`)
            for (const m of this.mergeLog.slice(before)) congruences.push(m)
            this.hashcons.set(newKey, result)
          } else {
            this.hashcons.set(newKey, owner)
          }
        } else {
          this.hashcons.set(newKey, owner)
        }
        // Refresh the owning class's alt entry under the new key.
        const ownerNow = this.find(classId)
        const cell = this.cells.get(ownerNow)!
        if (oldKey !== newKey && cell.alts.has(oldKey)) {
          const alts = new Map(cell.alts)
          alts.delete(oldKey)
          alts.set(newKey, canon)
          this.cells.set(ownerNow, { ...cell, alts })
          this.dirty.add(ownerNow) // re-keying (or collapsing) alts IS a cell change
          this.checkLiteralCollision(ownerNow, this.cells.get(ownerNow)!)
        } else if (!cell.alts.has(newKey)) {
          this.joinInto(ownerNow, { alts: new Map([[newKey, canon]]), best: null, provenance: new Map() })
        }
        // Re-register as parent of each (canonical) child.
        for (const child of nodeChildren(canon)) {
          const c = this.find(child)
          this.parentsOf.get(c)!.set(newKey, { node: canon, classId: ownerNow })
        }
      }
    }
    return congruences
  }

  /**
   * CO-5: recompute `best` for every class TO FIXPOINT. New classes start at
   * ⊥ = ∞ (best null), so no finite cost can flow around a cycle unless some
   * class on it independently acquires a literal-grounded alternative —
   * that ⊥-initialization is exactly what makes cyclic e-graphs (normal
   * after R-if unions) cost-correct. Candidate tieKeys are recomputed every
   * pass because unions change canonical children (CO-3 note).
   * Returns the classes whose COST strictly tightened (for the RoundLog).
   */
  recomputeBest(): TighteningRecord[] {
    const tightened = new Map<EClassId, number>()
    let changed = true
    while (changed) {
      changed = false
      for (const [id, cell] of this.cells) {
        let winner: BestEntry | null = null
        for (const node of cell.alts.values()) {
          const cand = this.candidateBest(node)
          if (!cand) continue
          winner = winner ? betterBest(winner, cand) : cand
        }
        if (!winner) continue
        const cur = cell.best
        if (!cur || winner.cost < cur.cost || (winner.cost === cur.cost && winner.tieKey !== cur.tieKey)) {
          // Monotone: cost never increases; equal-cost updates only re-express
          // the same minimum after child canonicalization/key refinement.
          if (cur && winner.cost === cur.cost && winner.tieKey > cur.tieKey) {
            // keep the smaller tieKey — betterBest above guarantees winner is
            // the class-wide minimum, so this branch means cur's node vanished
            // from alts (it can't: alts grow) or its key drifted; accept winner.
          }
          this.cells.set(id, { ...cell, best: winner })
          if (!cur || winner.cost < cur.cost) tightened.set(id, winner.cost)
          this.dirty.add(id)
          changed = true
        }
      }
    }
    return [...tightened.entries()].map(([classId, cost]) => ({ classId, cost }))
  }

  /** (cost, tieKey) for one candidate node, or null if any child is un-costed. */
  private candidateBest(node: ENode): BestEntry | null {
    const canon = this.canonicalize(node)
    if (canon.op === 'lit') return { cost: 0, node: canon, tieKey: String(canon.value) }
    let cost = 1
    const childKeys: string[] = []
    for (const child of nodeChildren(canon)) {
      const b = this.cells.get(this.find(child))?.best
      if (!b) return null
      cost += b.cost
      childKeys.push(b.tieKey)
    }
    const head = canon.op === 'call' ? `call ${canon.fn}` : canon.op
    return { cost, node: canon, tieKey: `${head}(${childKeys.join(',')})` }
  }

  nodeCost(node: ENode): number {
    return this.candidateBest(node)?.cost ?? Infinity
  }

  /** The literal value of a class, if it has a lit alternative. */
  litOf(id: EClassId): Value | undefined {
    const cell = this.cells.get(this.find(id))
    if (!cell) return undefined
    for (const n of cell.alts.values()) if (n.op === 'lit') return n.value
    return undefined
  }

  getCell(id: EClassId): CellValue {
    return this.cells.get(this.find(id))!
  }

  /**
   * CO-6: THE accessor for spans — always resolves through find(). No other
   * code path may touch the span map (it is private; grep for spansOf).
   */
  spansOf(id: EClassId): Span[] {
    const set = this.spanSets.get(this.find(id))
    if (!set) return []
    return [...set].map((k) => {
      const [start, end] = k.split(':').map(Number)
      return { start, end }
    })
  }

  classIds(): EClassId[] {
    return [...this.cells.keys()]
  }

  classCount(): number {
    return this.cells.size
  }

  /** Enumerate (canonical classId, canonicalized node) pairs — the rules' read set. */
  *allNodes(): Iterable<{ classId: EClassId; node: ENode; key: string }> {
    for (const [id, cell] of this.cells) {
      for (const node of cell.alts.values()) {
        const canon = this.canonicalize(node)
        yield { classId: id, node: canon, key: nodeKeyOf(canon) }
      }
    }
  }

  hasAlt(id: EClassId, key: string): boolean {
    return this.getCell(id).alts.has(key)
  }

  /** Drain per-round bookkeeping; returns what changed since the last drain. */
  drainRoundChanges(): { newClasses: EClassId[]; merges: MergeRecord[]; dirty: EClassId[] } {
    const newClasses = this.newClasses.filter((id) => this.find(id) === id)
    const result = {
      newClasses: [...new Set(newClasses.map((id) => this.find(id)))],
      merges: this.mergeLog.map((m) => ({ ...m, result: this.find(m.result) })),
      dirty: [...this.dirty].map((id) => this.find(id)).filter((id) => this.cells.has(id)),
    }
    this.newClasses = []
    this.mergeLog = []
    this.dirty = new Set()
    return result
  }
}
