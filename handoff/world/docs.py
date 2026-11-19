# docs.py <A|B|C>: DESIGN §4.3 and ROADMAP's line for that commit (run in order)
import sys, os
os.chdir('/home/user/vibe-dump-wt/world/packages/tails-and-scales')
level = sys.argv[1]
D = open('DESIGN.md').read()
R = open('ROADMAP.md').read()
def rep(s, a, b):
    assert a in s, a[:70]
    return s.replace(a, b)
if level == 'A':
    # the unit of length is the tail: this section's own marks
    D = rep(D, "Low clutter (0.3\" tall at most) goes only on a walkable nav cell, 1\" or more from", "Low clutter (0.3 tails tall at most) goes only on a walkable nav cell, 1 tail or more from")
    D = rep(D, "the low clutter shrinks away within 1.6\" of where the pointer meets the ground;", "the low clutter shrinks away within 1.6 tails of where the pointer meets the ground, and the low clutter, the tufts and flowers and a wood's ferns under every figure's base (`bases.js`: a mask of where the bases stand, read by the clutter's shaders at each item's centre; `sim/dressing-check.mjs` holds every item that meets a base hidden by it);")
    D = rep(D, "broadleaf and pine trees from 12\" out;", "broadleaf and pine trees from 12 tails out (from (A) the wood along one side in two or three stands with open ground between, from 20 tails back, so no seed walls the top of a battle's view with trunks);")
    D = rep(D, "debris thinning outward from 1\" (pebbles, splinters, leaves) and, inside a wood's footprint, litter, twigs and ferns; the tufts and flowers in seeded clumps by the pieces and along the margins. Draw calls: 4 (the debris).",
        "debris thinning outward from 1 tail (pebbles, splinters, leaves) and, inside a wood's footprint, litter, twigs and ferns; the tufts and flowers in seeded clumps by the pieces and along the margins, wholly on the mat. (A) The works' feet (a rampart's, bastion's or keep's deck and stair, a stone wall's blocks) worn hard: packed earth out past a tail, a damp line at the foot, rubble spilled in fans, moss; a ladder's foot trodden bare; each forest floor under a cover of its own (its rim's shape, out a little and ragged, soft at the edge, darker at the core, its litter in it), and more undergrowth inside the wood's footprint. Draw calls: 4 (the debris) and 1 (the floors' cover).")
if level == 'B':
    D = rep(D, "- **To come.** S3, paths and wear along the real lanes (the view's own route over the chunks' footprints; the core's nav is read, never asked to plan). S4,",
        "- **S3, the lanes (built).** `place.js`'s lanesOf: the ways the armies would walk, found by A* on a grid of the view's own (half-tail cells) over the table as made, shut where a rules piece stands or the nav grid says nobody walks (read, never asked to plan); open ground cheapest, a corridor between pieces and rough ground dearer, a seeded noise to let a lane wander. Lanes span the objectives (a tree), run in from each army's own edge to its nearest objective and out to the cart track, and from each ladder's foot. Painted into the mat under everything (flattened grass, bare earth down the middle, kicked stones), as heavy as the lane's wear, which is heaviest in a gap between pieces and at a ladder's foot; off the mat, each army's road runs on into the land it came from and the spur joins the cart track. No clutter stands on a lane. Draw calls: none (painted).\n- **To come.** S4,")
if level == 'C':
    D = rep(D, "- **To come.** S4, a theme and a name per board (orchard, quarry, border keep, burned hamlet), the name shown once the strings work in flight lands. S5,",
        "- **S4, themes (built).** `place.js`'s themeOf: one identity per board from the rules terrain on it: the Powder Field a burned hamlet, a fortified board a border keep, else a quarry where rock and stone outweigh the green and a farmstead where they don't. The theme sets the palette (the mat's wash, its lanes, the meadow round it), its own low clutter on the mat (a quarry's stone chips, a keep's, a burned field's charred sticks) under the three classes, and the works of the people who live there, off the mat, on the side the wood is not (`works.js`, all merged into one mesh): a farmstead (house, barn, well, cart, a fenced paddock, hay stooks, a second cottage); a quarry (the cut, a crane, a works hut, spoil heaps, dressed blocks, a cart); a border keep's outer wall behind one army with its gatehouse where that army's road goes through, towers, the garrison's huts and tents, a watch beacon; a burned hamlet (cottages burned to their walls, chimneys standing, a burned cart, charred fields, the near trees scorched, the scorch running on past the mat's edge and fading). The works' yards are trodden into the ground; 'low' and `?lowfi` draw no works, as they draw no trees. The board's name (`nameOf`, from the theme's syllables) is kept with the theme, not yet shown: it goes on screen once the strings work in flight lands. Draw calls: 1 (the works).\n- **To come.** S5,")
open('DESIGN.md', 'w').write(D)
line_old = [l for l in R.split('\n') if l.startswith('- [ ] **S1-S10 Battlefield dressing**')][0]
built = {'A': 'S1 (the surround and the sky) and S2 (the pieces in the ground) built, with their fixes', 'B': 'S1 (the surround and the sky), S2 (the pieces in the ground) and S3 (the lanes) built', 'C': 'S1 (the surround and the sky), S2 (the pieces in the ground), S3 (the lanes) and S4 (themes) built'}[level]
rest = {'A': 'S3-S10 to come', 'B': 'S4-S10 to come', 'C': 'S5-S10 to come, and the board\'s name on screen'}[level]
line_new = f"- [ ] **S1-S10 Battlefield dressing** (DESIGN §4.3): a seeded, view-only world round the board and ground under its pieces; {built}, `?dress=0` the old table, checks `sim/dressing-check.mjs` (Node; `--browser` owed) and `sim/boundaries.mjs` rule 5; {rest}."
R = R.replace(line_old, line_new)
open('ROADMAP.md', 'w').write(R)
print('docs', level)
