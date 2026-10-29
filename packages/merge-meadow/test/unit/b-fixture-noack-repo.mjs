// Like b-fixture-open-repo.mjs, but standing in for a sync server that never
// acknowledges (it has not advertised a storage id): local writes cannot be confirmed.
import { readFileSync } from 'node:fs'
import { Repo } from '@automerge/automerge-repo'

export async function openRepo (sync, { peerId } = {}) {
  const repo = new Repo({ network: [], ...(peerId ? { peerId } : {}) })
  repo.import(new Uint8Array(readFileSync(process.env.MERGE_MEADOW_TEST_DOC)), { docId: process.env.MERGE_MEADOW_TEST_DOC_ID })
  return { repo, storageId: undefined, close: () => repo.shutdown() }
}
