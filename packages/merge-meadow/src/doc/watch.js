// The one read path for doc consumers (rule §2.3, design §16.2).
// automerge-repo 2.5.6 computes 'change' patches from a base it only advances
// when every listener returns; one throwing listener made a later spawn+despawn
// net to zero patches (spike S4, 300 leaked critters). So each watcher keeps its
// own last heads, diffs itself, and is isolated in try/catch.
import { getHeads, diff } from '@automerge/automerge/slim'

const same = (a, b) => a.length === b.length && a.every((h, i) => h === b[i])

export function watch (handle, fn, { immediate = true, onError = (e) => console.error('[watch]', e) } = {}) {
  let heads = null
  let stopped = false
  const call = (arg) => { try { fn(arg) } catch (e) { onError(e) } }
  const run = () => {
    if (stopped) return
    let doc
    try { doc = handle.doc() } catch { return } // not ready yet: the 'change' that makes it ready re-runs this
    if (!doc) return
    const now = getHeads(doc)
    if (heads && same(now, heads)) return
    const patches = diff(doc, heads ?? [], now)
    const initial = heads === null
    heads = now
    call({ doc, patches, heads: now, initial })
  }
  const onDelete = () => { if (!stopped) call({ doc: undefined, patches: [], heads: [], deleted: true }) }
  // 'heads-changed' fires before 'change' and also when patches are empty; both
  // funnel into run(), which dedupes on our own heads
  handle.on('heads-changed', run)
  handle.on('change', run)
  handle.on('delete', onDelete)
  if (immediate) run()
  else { try { heads = getHeads(handle.doc()) } catch { heads = null } }
  return () => {
    stopped = true
    handle.off('heads-changed', run)
    handle.off('change', run)
    handle.off('delete', onDelete)
  }
}
