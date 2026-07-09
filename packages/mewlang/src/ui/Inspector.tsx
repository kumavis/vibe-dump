import { useMemo } from 'react'
import { classById, currentSnapshot, resolveSelection, useStore } from './store'

export function Inspector() {
  const run = useStore((s) => s.run)
  const round = useStore((s) => s.round)
  const selected = useStore((s) => s.selected)
  const source = useStore((s) => s.source)
  const select = useStore((s) => s.select)

  const snapshot = useMemo(() => currentSnapshot({ run, round }), [run, round])
  const selId = resolveSelection(run, selected, round)
  const cls = classById(snapshot, selId)

  if (!run) {
    return <div className="inspector-empty">Compile a program, then click any node in the graph to inspect its e-class.</div>
  }
  if (!cls) {
    return (
      <div className="inspector-empty">
        No class selected{selected ? ' (it does not exist at this round — step forward)' : ''}. Click a
        node in the graph, or click a term in the source.
      </div>
    )
  }

  const isRoot = snapshot!.rootId === cls.id
  // CO-2.3: presentation order is derived at render time, never stored —
  // provenance itself is an unordered lattice set.
  const prov = [...cls.provenance].sort(
    (a, b) =>
      a.round - b.round || a.rule.localeCompare(b.rule) || a.premises.join().localeCompare(b.premises.join()),
  )

  return (
    <div className="inspector">
      <h3>{cls.label}</h3>
      <div className="class-id">
        e-class #{cls.id}
        {isRoot && ' · root (main)'} · {cls.settled ? 'settled' : 'unsettled'} · round {round}
      </div>

      <section>
        <h4>
          alternatives ({cls.alts.length}) — grow-only set
        </h4>
        <ul className="alt-list">
          {cls.alts.map((a) => (
            <li key={a.key} className={cls.best && a.key === cls.best.key ? 'best' : ''}>
              {a.pretty}
              {cls.best && a.key === cls.best.key && <span className="cost">best · cost {cls.best.cost}</span>}
            </li>
          ))}
        </ul>
        {!cls.best && <div style={{ color: 'var(--text-dim)', fontSize: 12 }}>no finite-cost form known yet</div>}
      </section>

      <section>
        <h4>provenance — who learned what, when</h4>
        {prov.length === 0 ? (
          <div style={{ color: 'var(--text-dim)', fontSize: 12 }}>
            empty — interned at compile time; no rule has ever touched this class
            {!cls.demanded && ' (and it is not demanded)'}
          </div>
        ) : (
          <ul className="prov-list">
            {prov.map((p, i) => (
              <li key={i}>
                {/* chaos mode records provenance round-free (round 0) — it has no rounds */}
                <span className="round-tag">{p.round === 0 ? 'async' : `R${p.round}`}</span>
                <span className="rule">{p.rule}</span> {p.detail}
                {p.premises.length > 0 && (
                  <span style={{ color: 'var(--text-dim)' }}> ⟨from #{p.premises.join(', #')}⟩</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h4>source spans ({cls.spans.length})</h4>
        <ul className="span-list">
          {cls.spans
            .slice()
            .sort((a, b) => a.start - b.start)
            .map((s, i) => (
              <li
                key={i}
                title="click to re-select (scrolls the editor)"
                onClick={() => select(cls.id)}
              >
                [{s.start}–{s.end}] {source.slice(s.start, s.end).replace(/\s+/g, ' ').trim() || '…'}
              </li>
            ))}
        </ul>
      </section>
    </div>
  )
}
