// Bun.ant: Anthropic's private extensions in their Bun fork.
//
// CellSegmenter is required by the TUI renderer (see ./cell-segmenter.js).
// The four stubs are the ones the FreeBSD port provides; the bundle calls
// them on daemon / background-session paths, each inside try/catch:
//   memoryPressureLevel()  macOS memory-pressure level; null = unknown
//   setDumpable(false)     prctl(PR_SET_DUMPABLE); there is nothing to dump
//                          or ptrace in a page, so it reports success
//   getPeerPid(fd), getPeerUid(fd)  unix-socket peer credentials; none here
// Everything else the bundle probes on Bun.ant (posixFsAt, loginTty,
// ttyName, the windows* helpers) is guarded with typeof / ?. and stays absent.
import { CellSegmenter } from './cell-segmenter.js'

export function makeAnt(stringWidth) {
  class BoundCellSegmenter extends CellSegmenter {
    _measure(g) {
      return stringWidth(g, { ambiguousIsNarrow: this.ambiguousIsNarrow })
    }
  }
  Object.defineProperty(BoundCellSegmenter, 'name', { value: 'CellSegmenter' })

  return {
    CellSegmenter: BoundCellSegmenter,
    memoryPressureLevel: () => null,
    setDumpable: () => true,
    getPeerPid: () => null,
    getPeerUid: () => null,
  }
}
