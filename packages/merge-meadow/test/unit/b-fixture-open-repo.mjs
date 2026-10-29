// Injected into agent/mcp.mjs (a child process) through MERGE_MEADOW_OPEN_REPO by
// b-mcp.test.mjs: an in-process repo with no network, holding a copy of the test
// doc (saved bytes + doc id from the environment). No sync server, public or local.
import { readFileSync } from 'node:fs'
import { Repo } from '@automerge/automerge-repo'

export async function openRepo (sync, { peerId } = {}) {
  const repo = new Repo({ network: [], ...(peerId ? { peerId } : {}) })
  repo.import(new Uint8Array(readFileSync(process.env.MERGE_MEADOW_TEST_DOC)), { docId: process.env.MERGE_MEADOW_TEST_DOC_ID })
  // no sync server at all: there is nothing to acknowledge local writes (noServer)
  return { repo, storageId: undefined, noServer: true, close: () => repo.shutdown() }
}
