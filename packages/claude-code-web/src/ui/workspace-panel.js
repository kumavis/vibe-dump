// The workspace (/home/user/workspace) as the Worker last synced it. Reads
// the persisted snapshot, so it is filled in after a reload before Claude
// Code boots. Click a file to preview it.

import { h, clear } from './dom.js'
import { formatBytes } from './format.js'
import { readText } from '../host/snapshot.js'

export function workspacePanel (session) {
  const list = h('ul', { id: 'workspace-list', class: 'files' })
  const preview = h('pre', { id: 'workspace-preview', class: 'small', hidden: true })
  const empty = h('p', { class: 'muted' }, 'Empty. Files Claude Code writes appear here and are kept in this browser.')
  const refresh = h('button', { type: 'button', class: 'link', onclick: () => session.refreshWorkspace() }, 'refresh')

  const render = () => {
    const { files, snapshot } = session.workspace
    clear(list)
    empty.hidden = files.length > 0
    for (const f of files) {
      const item = h('li', { dataset: { path: f.path } },
        h('button', {
          type: 'button',
          class: 'file',
          onclick: () => {
            const text = f.type === 'file' ? readText(snapshot, f.path) : `-> ${f.type}`
            preview.hidden = false
            preview.textContent = text && text.length > 20000 ? `${text.slice(0, 20000)}\n…` : text ?? ''
          }
        }, f.rel),
        h('span', { class: 'muted' }, f.type === 'file' ? formatBytes(f.size) : f.type))
      list.append(item)
    }
  }
  session.addEventListener('workspace', render)
  render()

  return h('section', { class: 'panel', id: 'panel-workspace' },
    h('h2', null, 'Workspace ', refresh),
    h('p', { class: 'muted small' }, '/home/user/workspace'),
    empty, list, preview)
}
