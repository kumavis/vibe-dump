// SHA-256 helpers over WebCrypto (page, Worker and Node 22 all have
// globalThis.crypto.subtle; it needs a secure context in a browser, which
// GitHub Pages and localhost are).

const hex = (buf) => Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('')

export async function sha256Hex (bytes) {
  return hex(await crypto.subtle.digest('SHA-256', bytes))
}

const enc = new TextEncoder()

/**
 * Hash of a file tree, defined so a shell can reproduce it:
 *   cd <dir> && find . -type f -printf '%P\n' | LC_ALL=C sort | xargs sha256sum | sha256sum
 * i.e. sha256 over "<sha256hex>  <relpath>\n" lines sorted by path.
 * @param {Iterable<[string, Uint8Array]>} entries  [relpath, bytes]
 * @param {number} [concurrency]
 * @returns {Promise<{ sha256: string, files: Map<string,string> }>}
 */
export async function treeSha256 (entries, concurrency = 8) {
  const list = Array.from(entries)
  const sums = new Map()
  let next = 0
  async function worker () {
    while (next < list.length) {
      const [p, bytes] = list[next++]
      sums.set(p, await sha256Hex(bytes))
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, list.length) }, worker))
  // Plain code-unit order == LC_ALL=C byte order for these ASCII paths.
  const paths = [...sums.keys()].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
  const listing = paths.map((p) => `${sums.get(p)}  ${p}\n`).join('')
  return { sha256: await sha256Hex(enc.encode(listing)), files: sums }
}
