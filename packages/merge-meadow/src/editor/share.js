// Share / Fork / Download / Open / version links (design §2.3). The doc URL is
// the edit capability and `key` the agent secret; both live in the fragment,
// built by track B's buildLink so every link in the app has one spelling.
import { save, getHeads } from '@automerge/automerge/slim'
import { buildLink, newKey, DEFAULT_SYNC } from '../net/link.js'

export const PACKAGE_HINT = '~/vibe-dump/packages/merge-meadow'

// `claude mcp add` line for the Agent panel (design §6.3): the link travels in
// the env so the server connects on start. Single quotes keep & and # literal
// in a POSIX shell; a quote inside is closed, escaped and reopened.
const sq = (s) => `'${String(s).replace(/'/g, "'\\''")}'`
export function mcpSetupLine ({ link, path = PACKAGE_HINT } = {}) {
  const dir = String(path || PACKAGE_HINT).replace(/\/+$/, '')
  const env = link ? `-e MERGE_MEADOW_LINK=${sq(link)} ` : ''
  return `claude mcp add merge-meadow ${env}-- node ${dir}/agent/mcp.mjs`
}
export function cliLine ({ link, path = PACKAGE_HINT } = {}) {
  const dir = String(path || PACKAGE_HINT).replace(/\/+$/, '')
  return `node ${dir}/agent/cli.mjs ${sq(link ?? '')} describe`
}

const slugOf = (s) => String(s || 'world').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'world'
export function fileNameFor (title, date = new Date()) {
  const d = date.toISOString().slice(0, 16).replace(/[:T]/g, '-')
  return `${slugOf(title)}-${d}.automerge`
}

const syncOf = (link) => (link?.sync && link.sync !== DEFAULT_SYNC ? link.sync : undefined)
export const editLink = (link, docUrl, base) => buildLink({ docUrl, key: link?.key || undefined, sync: syncOf(link) }, base)
export const viewLink = (link, docUrl, viewKey, base) => buildLink({ docUrl, view: viewKey, sync: syncOf(link) }, base)
// a version link is handed out as a read-only view: it never carries the editor
// key (which gates capture/logs/eval on every live host tab, and hosting agents)
export const versionLinkFor = (link, docUrl, heads, base) => buildLink({ docUrl, sync: syncOf(link), heads }, base)

async function copyText (text, clipboard) {
  try { await clipboard?.writeText(text); return true } catch { return false }
}

// clipboard / saveFile / base are injectable for tests
export function makeShare ({ handle, link, repo, clipboard = globalThis.navigator?.clipboard, base = globalThis.location, saveFile, title = () => '' }) {
  const persist = async (h) => { try { await repo?.flush?.([h.documentId]) } catch {} }
  const download = saveFile ?? ((name, bytes) => {
    const url = URL.createObjectURL(new Blob([bytes], { type: 'application/octet-stream' }))
    const a = document.createElement('a'); a.href = url; a.download = name
    document.body.append(a); a.click(); a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 5000)
  })
  return {
    link: () => editLink(link, handle.url, base),
    async copyLink () { const text = editLink(link, handle.url, base); return { text, copied: await copyText(text, clipboard) } },
    async copy (text) { return copyText(text, clipboard) },
    // a fork is a fresh doc (history compacted) under a fresh agent key
    async fork () {
      if (!repo?.clone) throw new Error('fork needs the repo')
      const h = repo.clone(handle)
      await persist(h)
      return { url: h.url, link: buildLink({ docUrl: h.url, key: newKey(), sync: syncOf(link) }, base) }
    },
    download () {
      const bytes = save(handle.doc())
      const name = fileNameFor(title())
      download(name, bytes)
      return { name, bytes: bytes.byteLength }
    },
    async open (file) {
      if (!repo?.import) throw new Error('open needs the repo')
      const bytes = new Uint8Array(await file.arrayBuffer())
      const h = repo.import(bytes)
      await persist(h)
      return { url: h.url, link: buildLink({ docUrl: h.url, key: newKey(), sync: syncOf(link) }, base) }
    },
    viewLink: (viewKey) => (viewKey ? viewLink(link, handle.url, viewKey, base) : null),
    // Automerge's hex heads (what view() takes), not automerge-repo's base58 handle.heads()
    versionLink: (heads = getHeads(handle.doc())) => versionLinkFor(link, handle.url, [...heads], base),
  }
}
