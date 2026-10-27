// Getting Claude Code: drop your own `claude` binary (or the npm platform
// .tgz), or download the pinned release from npm. Shows the cache state.

import { h } from './dom.js'
import { progressText, progressFraction } from './format.js'
import { describeManifest } from '../host/acquire.js'
import { CC_VERSION } from '../host/constants.js'

export function binaryPanel (session) {
  const state = h('p', { id: 'cache-state', class: 'state' })
  const input = h('input', { id: 'binary-drop', type: 'file' })
  const drop = h('label', { class: 'drop', for: 'binary-drop' },
    h('strong', null, 'Drop your ', h('code', null, 'claude'), ' binary here'),
    h('small', null, `or click to choose it (the file the official installer put on your disk, or the npm platform .tgz; version ${CC_VERSION})`),
    input)
  const download = h('button', { id: 'download', type: 'button' }, `Download ${CC_VERSION} from npm`)
  const bar = h('progress', { id: 'extract-progress', max: 1, hidden: true })
  const phase = h('span', { id: 'extract-phase', class: 'muted' })
  const clearBtn = h('button', { type: 'button', class: 'link', id: 'clear-cache' }, 'clear the cache')
  const details = h('pre', { id: 'manifest-details', class: 'small' })

  const run = (p) => p.catch(() => {}) // errors are shown through session state

  input.addEventListener('change', () => {
    const file = input.files?.[0]
    if (file) run(session.extractFile(file))
    input.value = ''
  })
  for (const ev of ['dragenter', 'dragover']) drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add('over') })
  for (const ev of ['dragleave', 'drop']) drop.addEventListener(ev, () => drop.classList.remove('over'))
  drop.addEventListener('drop', (e) => {
    e.preventDefault()
    const file = e.dataTransfer?.files?.[0]
    if (file) run(session.extractFile(file))
  })
  download.addEventListener('click', () => run(session.download()))
  clearBtn.addEventListener('click', () => run(session.clearCache()))

  const render = () => {
    const st = session.state
    const busy = st.cache === 'extracting'
    input.disabled = busy || st.extractor !== 'ok'
    download.disabled = busy || st.extractor !== 'ok'
    drop.classList.toggle('disabled', input.disabled)
    state.dataset.state = st.cache
    state.textContent =
      st.extractor === 'loading' ? 'Checking the cache…'
        : st.extractor === 'error' ? `The extractor did not load: ${st.error}`
          : st.cache === 'present' ? `Ready: ${describeManifest(st.manifest)}`
            : st.cache === 'extracting' ? 'Extracting…'
              : st.cache === 'error' ? `Cache error: ${st.error}`
                : 'Not cached yet. Drop the binary or download it (about 130 MB, once).'
    const p = busy ? st.progress : null
    bar.hidden = !p
    const f = progressFraction(p)
    if (f == null) bar.removeAttribute('value'); else bar.value = f
    phase.textContent = p ? progressText(p) : ''
    clearBtn.hidden = st.cache !== 'present'
    details.textContent = st.manifest ? manifestDetails(st.manifest) : ''
  }
  session.addEventListener('change', render)
  session.addEventListener('progress', render)
  render()

  return h('section', { class: 'panel', id: 'panel-binary' },
    h('h2', null, 'Claude Code'),
    state, drop,
    h('div', { class: 'row' }, download, phase),
    bar,
    h('details', null, h('summary', null, 'Cache details'), details, clearBtn))
}

function manifestDetails (m) {
  const lines = [
    `version      ${m.version}`,
    `modules      ${m.moduleCount ?? '?'} (cached ${m.files}, excluded ${m.excluded?.length ?? 0})`,
    `tree sha256  ${m.sha256 ?? '?'}`,
    `source       ${m.source?.kind ?? '?'} ${m.source?.container ?? ''} ${m.source?.platform ?? ''}`.trimEnd(),
    `created      ${m.createdAt ?? '?'}`
  ]
  for (const r of m.rewrites?.rewrites ?? []) lines.push(`rewrite      ${r.ok ? 'ok ' : 'BAD'} ${r.id}: ${r.matches} matches in ${r.files} files`)
  return lines.join('\n')
}
