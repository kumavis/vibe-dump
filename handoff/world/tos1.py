# turn the full (S1+S2) tree into S1 alone, for its commit and its frames
import re, os
import sys
os.chdir(sys.argv[1] if len(sys.argv) > 1 else '/home/user/vibe-dump-wt/world/packages/tails-and-scales')
def ed(p, f):
    s = open(p).read(); t = f(s)
    assert t != s, p
    open(p, 'w').write(t)
# dressing/index.js: no ground
def idx(s):
    s = s.replace("import { Ground, decalPainter, strewer } from './ground.js'\n", "")
    a = s.index("    // S2: the ground under the pieces"); b = s.index("    this.quality(this.stage.quality)")
    s = s[:a] + s[b:]
    s = s.replace("    this.ground?.quality(f)\n", "")
    s = s.replace("""//   S2: the pieces' footprints painted into the mat, their debris, the
//       tufts and flowers in clumps (ground.js)
//
// Draw calls: the sky 1, the surround 5, the debris 4: 10, against the 6
// the wooden table, its frame and the box under the mat drew.""", """//
// Draw calls: the sky 1, the surround 5: 6, against the 6 the wooden
// table, its frame and the box under the mat drew.""")
    return s
ed('view/dressing/index.js', idx)
os.remove('view/dressing/ground.js')
# place.js: no S2 block
def pl(s):
    a = s.index("  // ---- S2: the pieces in the ground"); b = s.index("  return out\n}\n\n// Every item the plan stands")
    return s[:a] + s[b:]
ed('view/dressing/place.js', pl)
# table.js: no dress or strew
def tb(s):
    s = s.replace("""    this.clean = null
    // ((S2) and the dressing's ground painted in again: dress())
    if (this.marks?.length || this.dresser) this.scorch(this.marks ?? [])""", """    this.clean = null
    if (this.marks?.length) this.scorch(this.marks)""")
    s = s.replace("      if (!marks.length && !this.dresser) return", "      if (!marks.length) return")
    s = s.replace("""    // ((S2) the battlefield's dressing's ground, under the scorch)
    this.dresser?.(g, c, this.W, this.H)
""", "")
    s = s.replace("""
  // (S2) The dressing's ground painted into the mat under the scorch, by
  // `fn(g, canvas, W, H)` (null: none), from the mat's own paint each time.
  dress(fn) {
    this.dresser = fn
    this.scorch(this.marks ?? [])
  }""", "")
    s = s.replace("""    // ((S2) the dressing's own, seeded, clumped where it may stand)
    if (this.strew) return this.strew(this)
""", "")
    return s
ed('view/table.js', tb)
