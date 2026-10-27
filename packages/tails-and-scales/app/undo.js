// Local undo (F12; open question 28): a slip taken back, within the phase.
// In a game played on this device alone (vs. the AI, hotseat: never online,
// where the log is append-only, DESIGN §5), ↶ Undo or Ctrl-Z (⌘-Z on a Mac)
// takes back the last entry of the seat played here whose decision it is:
// a placement, a move, a charge's end, one a press, back to its last commit
// point (an End, a Begin battle, and any entry across which the dice
// counter moved: present/hud-model.js's undoable, which the HUD's button
// reads too).
//
// Not by cutting the store: the Folder holds an accepted entry gone from the
// list to be tamper, and freezes (match/fold.js). The battle's Session is
// made again over its log as it stood before that entry was written, the
// same device and seats, so the seats played here play on in it, and the
// flow swaps it in for the battle (app/flow.js's undo: shown on the table,
// the old Session closed). A move made again then folds exactly as it did
// the first time, its entry the same text (sim/replay-check.mjs). The order
// book is kept under the start entry and the seeds (app/flow.js's bookKey),
// which the new Session's log still begins with, so the standing orders
// stand.
//
//   rewind(session, k, { onTrace })   a Session over `session`'s log up to
//                         its accepted entry k (that entry and all after it
//                         left out), folded quietly as it is made (no sink:
//                         the flow's show() hands it the table)
import { Session } from '../match/session.js'
import { LocalStore } from '../match/store.js'

export function rewind(session, k, { onTrace = null } = {}) {
  // The log's own texts up to the entry (what was refused before it too: a
  // fold of them refuses it again, as a replay file keeps it), so the ids
  // the new Session numbers its entries by are past every one it holds
  // (match/session.js counts on from the log's length), and a move made
  // again is written as the one taken back was.
  const texts = JSON.parse(session.store.export()).slice(0, session.folder.placed[k])
  return new Session({ store: new LocalStore(texts), localSeats: session.localSeats, dev: session.dev, rand: session.rand, onTrace })
}
