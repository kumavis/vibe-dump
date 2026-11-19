# strip.py <dir> <A|B>: the full (A+S3+S4) dressing cut back to A, or to A+S3 (B)
import sys, os
d, level = sys.argv[1], sys.argv[2]
os.chdir(d)
def cut(s, a, b, keep_b=True):
    i = s.index(a); j = s.index(b, i)
    return s[:i] + s[j:]
def rm(s, t):
    assert t in s, t[:60]
    return s.replace(t, '')
P='view/dressing/place.js'; s=open(P).read()
s = cut(s, "// ---- S4: themes ---", "// ---- the plan ---")
s = cut(s, "  // ---- S4: the theme, its name", "  // the trees: copses")
s = rm(s, "      // (S4) clear of the works and their yards\n      if (out.works.some((w) => hypot(w.x - x, w.z - z) < w.r + 2.5)) return\n")
s = cut(s, "    // (S4) the theme's own strewing", "    // (a cap, cut from the end")
s = s.replace(", works: [], yards: [] }", " }").replace("'trees', 'works', 'debris'", "'trees', 'debris'")
s = s.replace("import { sin, cos, hypot, atan2 } from '../../core/dmath.js'", "import { sin, cos, hypot } from '../../core/dmath.js'")
if level == 'A':
    s = cut(s, "// ---- S3: the lanes ---", "// ---- the plan ---")
    s = cut(s, "  // ---- S3: the lanes, painted", "  // the trees: copses")
open(P,'w').write(s)
G='view/dressing/ground.js'; s=open(G).read()
s = cut(s, "    // (S4) the theme's wash", "    // (S3) the lanes first")
if level == 'A':
    s = cut(s, "    // (S3) the lanes first", "    for (const d of p.decals) {")
s = s.replace("p.palette?.verge ?? '#7d8a48'", "'#7d8a48'").replace("p.palette?.lane ?? '#7a6846'", "'#7a6846'")
open(G,'w').write(s)
S='view/dressing/surround.js'; s=open(S).read()
s = rm(s, "import { worksGeometry } from './works.js'\n")
s = cut(s, "    // (S4) the works, one mesh", "    // the long grass off the mat")
s = rm(s, "    // (the works go with the trees: none on 'low' or ?lowfi)\n    if (this.works) this.works.visible = f > 0\n")
s = cut(s, "  // (S4) the works' yards, trodden bare", "  // (S3) the lanes again across the meadow")
s = rm(s, "  charred: ['#3a3328', '#2a2620'],\n")
s = s.replace("""        // ((S4) round a burned field, the near trees scorched)
        const charred = p.theme === 'burned' && outside(W, H, t.x, t.z) < 32 * k && t.tint < 0.7
        mesh.setColorAt(i, charred ? col.setRGB(0.32, 0.27, 0.22) : col.setHSL(0, 0, 0.82 + t.tint * 0.3))""", """        mesh.setColorAt(i, col.setHSL(0, 0, 0.82 + t.tint * 0.3))""")
if level == 'A':
    s = s.replace("""// (S3) The lanes' roads off the mat; (S4) the works and their yards, a
// burned field's scorch past the mat's edge and its scorched trees.
//
// Draw calls: the ground 1, the edge and stakes 1, the trees 2, the grass 1,
// the works 1.""", "// Draw calls: the ground 1, the edge and stakes 1, the trees 2, the grass 1.")
    s = cut(s, "  // (S3) the lanes off the mat", "  // the near ground, round the mat")
    s = cut(s, "  // (S3) the lanes again across the meadow", "  const t = new THREE.CanvasTexture(c)")
else:
    s = s.replace("""// (S3) The lanes' roads off the mat; (S4) the works and their yards, a
// burned field's scorch past the mat's edge and its scorched trees.
//
// Draw calls: the ground 1, the edge and stakes 1, the trees 2, the grass 1,
// the works 1.""", """// (S3) The lanes' roads off the mat, out to the land and the cart track.
//
// Draw calls: the ground 1, the edge and stakes 1, the trees 2, the grass 1.""")
s = s.replace("g.fillStyle = p.palette?.meadow ?? '#74813f'", "g.fillStyle = '#74813f'")
open(S,'w').write(s)
os.remove('view/dressing/works.js')
