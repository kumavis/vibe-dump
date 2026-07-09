/**
 * Canonical-state fingerprints for confluence comparison (A3).
 *
 * Class ids are schedule-dependent (A3.2): allocation order and which id
 * survives a union vary, and only the quotient structure is invariant. So a
 * run's state is fingerprinted by CONTENT, never by id: per class we use its
 * source spans (grow-only, id-free), the STRUCTURAL form of each alternative
 * — op plus each child's complete signature (the child's best tieKey, a
 * fully expanded extracted term, or its span set when un-costed) — the best
 * (cost, tieKey), and its provenance as (rule@round) facts. Display-oriented
 * depth-capped pretty strings are deliberately NOT used: their '…' elision
 * could make genuinely different states fingerprint equal. Two quiescent
 * runs are equal iff their sorted class-fingerprint multisets are equal.
 * Residual limit: two distinct classes could in principle share a signature
 * only if they have identical spans, identical alt structure and identical
 * best terms — which at a congruence-closed fixpoint implies they would
 * have been hashcons-merged; the bijection helper in tests asserts
 * uniqueness loudly rather than assuming it.
 *
 * Provenance scope note (CO-2): premise ids inside provenance keys need the
 * cross-run renaming bijection to compare exactly — the test suite does that
 * (tests/confluence.test.ts); this fingerprint uses the id-free projection
 * (rule, round, premise count), which the bijection preserves. `round` is
 * only meaningful within the BSP family (bsp/shuffle); chaos mode numbers
 * "rounds" per firing, so cross-scheduler comparisons must exclude
 * provenance — pass includeProvenance: false.
 */
import { spanKey } from '../lang/span'
import type { EvalResult } from './scheduler'
import type { SnapClass } from './roundlog'

export interface FingerprintOptions {
  includeProvenance?: boolean
}

export function classFingerprint(c: SnapClass, opts: FingerprintOptions = {}): string {
  const spans = c.spans
    .map((s) => spanKey(s))
    .sort()
    .join(';')
  // Structural, id-free, full-depth: op + complete child signatures.
  const altSig = (a: SnapClass['alts'][number]): string => {
    if (a.op === 'lit') return `lit:${typeof a.value}:${a.value}`
    const head = a.op === 'call' ? `call ${a.fn}` : a.op
    return `${head}(${a.argKeys.join('§')})`
  }
  const alts = c.alts.map(altSig).sort().join(' | ')
  const best = c.best ? `${c.best.cost}:${c.best.tieKey}` : '∞'
  const parts = [`spans[${spans}]`, `alts[${alts}]`, `best[${best}]`, `demanded[${c.demanded}]`]
  if (opts.includeProvenance ?? true) {
    const prov = c.provenance
      .map((p) => `${p.rule}@${p.round}#${p.premises.length}`)
      .sort()
      .join(';')
    parts.push(`prov[${prov}]`)
  }
  return parts.join(' ')
}

/** Sorted multiset of class fingerprints — the run's canonical-state signature. */
export function runFingerprint(result: EvalResult, opts: FingerprintOptions = {}): string {
  const snap = result.snapshots[result.snapshots.length - 1]
  return snap.classes
    .map((c) => classFingerprint(c, opts))
    .sort()
    .join('\n')
}

export interface ConfluenceComparison {
  /** All runs quiesced and their full canonical states agree. */
  ok: boolean
  /** True when non-quiescent runs were excluded from the state comparison. */
  partial: boolean
  detail: string
}

/**
 * CO-1.4: full-state confluence is claimed for QUIESCENT runs only (A3.1).
 * If every run quiesced, compare full canonical fingerprints + extraction.
 * If any run exhausted its budget, compare extracted values only among runs
 * that found a literal — exhausted runs hold different prefixes of the
 * knowledge, but everything in any prefix is true, so literal answers must
 * still agree.
 */
export function compareRuns(runs: EvalResult[]): ConfluenceComparison {
  if (runs.length === 0) return { ok: true, partial: false, detail: 'no runs' }
  const allQuiescent = runs.every((r) => r.status === 'quiescent')
  if (allQuiescent) {
    const fp0 = runFingerprint(runs[0])
    const ex0 = runs[0].extraction.pretty
    const ok = runs.every((r) => runFingerprint(r) === fp0 && r.extraction.pretty === ex0)
    return {
      ok,
      partial: false,
      detail: ok
        ? `all ${runs.length} runs quiesced with identical canonical state and answer ${ex0}`
        : 'runs diverged — this would falsify CALM; it is an engine bug',
    }
  }
  const literals = runs.filter((r) => r.extraction.isLiteral).map((r) => r.extraction.pretty)
  const ok = literals.every((v) => v === literals[0])
  return {
    ok,
    partial: true,
    detail: ok
      ? `confluent-so-far: ${literals.length}/${runs.length} runs found ${literals[0] ?? 'no literal yet'} (non-quiescent runs excluded from state comparison)`
      : 'extracted literals diverged — engine bug',
  }
}
