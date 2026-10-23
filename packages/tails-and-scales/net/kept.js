// What a page keeps of an online match across reloads (DESIGN §2.7, N3),
// in IndexedDB beside the match's document (net/repo.js's): the entries
// it accepted, [[id, sum], …] in fold order (match/fold.js's knownOf),
// which its next life holds the log to (the Folder's keep: the tamper
// alarm across reloads), and how many there were (the rejoin's "N moves
// since you were last here").
//
//   loadKept(id)          → { known, n, at } or null (none kept, or
//                         IndexedDB refused: a private window's, a
//                         sandbox's, where nothing outlives the page)
//   saveKept(id, value)   → a promise that settles, never rejects
//
// A page writes it only once the document holding those entries is on
// disk (app/online.js flushes the repo first): kept entries the stored
// document lacks would read as gone after a reload, a false alarm.
const DB = 'tails-and-scales-kept'
const STORE = 'matches'

let opening = null
function db() {
  opening ??= new Promise((resolve) => {
    try {
      const req = indexedDB.open(DB, 1)
      req.onupgradeneeded = () => req.result.createObjectStore(STORE)
      req.onsuccess = () => resolve(req.result)
      req.onerror = () => resolve(null)
      req.onblocked = () => resolve(null)
    } catch {
      resolve(null)
    }
  })
  return opening
}

// one request on the store, its result, or null whatever went wrong
async function ask(mode, fn) {
  const d = await db()
  if (!d) return null
  return new Promise((resolve) => {
    try {
      const req = fn(d.transaction(STORE, mode).objectStore(STORE))
      req.onsuccess = () => resolve(req.result ?? null)
      req.onerror = () => resolve(null)
    } catch {
      resolve(null)
    }
  })
}

export async function loadKept(id) {
  const v = await ask('readonly', (s) => s.get(id))
  return v && Array.isArray(v.known) && v.known.every((x) => Array.isArray(x) && typeof x[0] === 'string' && typeof x[1] === 'string') ? v : null
}

export async function saveKept(id, value) {
  await ask('readwrite', (s) => s.put(value, id))
}
