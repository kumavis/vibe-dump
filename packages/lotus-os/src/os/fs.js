// fs.js — the contents of the machine.
//
// A plain tree. Every node gets `parent` and `path` filled in by index() at
// boot, so the explorer and the terminal can share one model. The writing is
// deliberately continuous with the room you find at the end of reveal.run:
// the bench log talks about the printer, the board and the iron that are
// sitting on the desk the monitor turns out to be standing on.

export const KINDS = {
  folder: { icon: 'folder', label: 'Folder' },
  doc: { icon: 'doc', label: 'Document' },
  motif: { icon: 'image', label: 'Motif' },
  app: { icon: 'gear', label: 'Program' },
  exec: { icon: 'exec', label: 'Executable' },
}

const doc = (name, body, extra = {}) => ({ kind: 'doc', name, body: body.trim(), ...extra })
const folder = (name, children, extra = {}) => ({ kind: 'folder', name, children, ...extra })
const motif = (name, motif_, caption, extra = {}) => ({ kind: 'motif', name, motif: motif_, caption, ...extra })

export const TREE = folder('/', [
  doc(
    'read-me.txt',
    `
LOTUS OS  ·  build 0.9.4 "bai sema"

A desktop is a metaphor that forgot it was one. This one remembers: it is a
lacquer cabinet with gold on the edges, and every window is a door cut into a
wall you can move.

  · Double-click anything on the desktop.
  · Windows drag by the bar, resize from any edge, and snap to the sides.
  · The theme switch lives at the right end of the app bar. Dark is home.

There is one program on this machine that is not a program. It is called
reveal.run and it does not open a window. Save your work first — there is no
work, and nothing to save, so consider it saved.
`,
  ),

  folder('Wat', [
    doc(
      'ornament.txt',
      `
NOTES ON THE ORNAMENT
---------------------

Everything decorative on this machine is one of six shapes, and none of them
is a picture of anything holy. That distinction matters. Temple ornament in
Thailand is a grammar, not an iconography — the flame-scroll and the roof fin
and the serpent's crest are all the same curve under different pressure.

  kranok       the flame scroll. A teardrop that eats its own tail. Every
               larger kranok is made of smaller kranok. Draw one, then draw
               it again inside itself, and you are 80% of the way there.

  chofa        the "sky tassel" at the end of a roof ridge. A beak. Reads as
               a single hooked stroke rising off a horizontal.

  bai raka     the fins running down the roof edge below the chofa. A rhythm
               of decreasing hooks. Good as a border, terrible as a focal
               point.

  naga         the serpent along the stair rail. Its body is a repeated
               kranok; its crest is a fan of them.

  chedi        the bell-and-spire silhouette. A stack of diminishing rings
               over a bell over a square base. Reads at 8 pixels.

  prajam yam   the four-petal diaper pattern. Rotationally symmetric, tiles
               on a 45-degree lattice. The only motif here that wants to be
               repeated forever, which is why it is the wallpaper.

Restraint rule, learned the hard way: at most one ornament per surface, and
the ornament never carries information. If you take all of it away the
interface still works. That is the test.
`,
    ),
    motif('lotus.motif', 'lotus', 'Open bloom, eight petals, two layers — the mark in the app bar.'),
    motif('bud.motif', 'bud', 'Lotus bud in profile. The Sukhothai prang is this shape at building scale.'),
    motif('kranok.motif', 'kranok', 'One flame-scroll unit. Nests inside itself; the whole grammar in one curve.'),
    motif('chofa.motif', 'chofa', 'Sky tassel. The hook that finishes a roof ridge.'),
    motif('chedi.motif', 'chedi', 'Bell, rings, spire. The silhouette that still reads at eight pixels.'),
    motif('naga.motif', 'naga', 'Serpent balustrade — a body of repeated scrolls, a crest of the same.'),
    motif('prajam-yam.motif', 'prajamYam', 'Four-petal diaper tile. The wallpaper lattice, one cell of it.'),
  ]),

  folder('Notes', [
    doc(
      'bench-log.txt',
      `
BENCH LOG
=========

Tue — Board rev C is alive. Regulator no longer runs at 71C, which was the
whole point of rev C. The eight status LEDs run a chase off the little
microcontroller in the corner; the chase is pointless and I like it.

Tue, later — Reflowed the crooked header. The iron holder is the good one now,
the heavy brass-wool kind, so the tip stops rolling off the bench and
branding the desk. Three brands on the desk already. Four, counting the one
under the monitor stand where it does not show.

Wed — Printer: retraction down to 3.4mm, temp 208. The spire test prints
clean up to the third ring and then the top of the spire ghosts. Not the
printer's fault. It is a 0.9mm feature at 0.4mm nozzle. Reprint at 0.2 layer
height, walk away, come back in an hour and stop hovering over it.

Wed, late — Wrote the reveal program. It does one thing: it pulls the camera
back off this screen far enough that you can see the desk. This is either a
screensaver or a confession.

Thu — The chase pattern on the board is now eight LEDs of a kranok curve,
which nobody will ever notice, including me, in a week.
`,
    ),
    doc(
      'print-queue.txt',
      `
PRINT QUEUE
-----------

  [x]  bracket, monitor arm, rev B ......... 41 min   petg
  [x]  spool holder, right side ............ 2 h 10   pla
  [ ]  chedi, 60mm, 0.2 layer .............. 1 h 04   pla, purple
  [ ]  case, board rev C ................... 3 h 22   petg   (needs redraw)
  [ ]  cable comb x6 ....................... 22 min   scrap

Purple filament: about 400g left on the spool, by weight. Enough for the
chedi twice, which is good, because the first one will fail.
`,
    ),
    folder('Old', [
      doc(
        'first-boot.txt',
        `
first boot — no window manager yet, just a wallpaper and a clock.

The clock was wrong by six hours and I left it that way for a month because
fixing it meant admitting I was going to keep using this.
`,
      ),
      doc(
        'names.txt',
        `
Names considered for this machine, in order:

  WAT/OS          too much
  Prang           people will read it as "prang" the sound
  Bai Sema        boundary stones. Nice idea: an OS is a marked-off ground.
  Chedi           taken, by a font
  Lotus           taken, by a spreadsheet, forty years ago, and I do not care

LOTUS it is. The spreadsheet is not using it anymore.
`,
      ),
    ]),
  ]),

  folder('Workbench', [
    doc(
      'board-rev-c.txt',
      `
BOARD, REV C
============

  MCU        low-power 32-bit, 48 MHz, more than enough
  Status     8 x 0603 in a row along the top edge, amber
  Display    small mono OLED, 0.96", SPI
  Power      5V in over USB-C, 3v3 regulator (the one that used to cook)
  Extras     one tactile button, one trimpot nobody has turned since rev A

What it does: nothing, beautifully. The firmware runs a chase across the
eight LEDs and draws a lotus on the OLED, one petal at a time, then erases
it. Total useful output: zero. Total time spent: not the point.

Known issues
  · The trimpot is still not connected to anything.
  · The silkscreen on the back says REV B. Ignore it.
  · Jumper from D7 to the header is a bodge wire and will stay a bodge wire.
`,
    ),
    doc(
      'soldering.txt',
      `
SOLDERING, THE SHORT VERSION

  · Tin the tip. Every time. Yes, again.
  · Heat the joint, not the solder.
  · If it looks like a ball, it is cold. Reheat it, add flux, try again.
  · Brass wool over wet sponge — thermal shock kills tips.
  · The fume fan is not optional. It is six inches from your face.
  · 350C for leaded, 380C if the ground plane is fighting you, never 450C
    "to make it faster", that is how tips die.
`,
    ),
    doc(
      'printer.conf',
      `
# slicer profile — the only settings that ever change

layer_height        = 0.20
first_layer_height  = 0.28
nozzle              = 0.40
temperature         = 208
bed_temperature     = 60
retract_length      = 3.40
retract_speed       = 40
fan_speed           = 100    # from layer 3
perimeters          = 3
top_solid_layers    = 5
infill              = 0.15   # gyroid
supports            = off    # design it so you do not need them
`,
    ),
  ]),

  folder('System', [
    { kind: 'app', name: 'Appearance', app: 'settings', icon: 'gear' },
    { kind: 'app', name: 'Terminal', app: 'terminal', icon: 'terminal' },
    { kind: 'app', name: 'About This Machine', app: 'about', icon: 'info' },
    doc(
      'display.conf',
      `
# display
panel        = 1440 x 900, 16:10
scaling      = fit, integer-agnostic
scanlines    = only when embodied
glare        = only when embodied

# "embodied" means the screen has stopped being the whole world and gone
# back to being a panel on a desk. See reveal.run.
`,
    ),
  ]),

  { kind: 'app', name: 'Terminal', app: 'terminal', icon: 'terminal' },

  {
    kind: 'exec',
    name: 'reveal.run',
    icon: 'exec',
    caption: 'Pull the camera back off this screen.',
  },
])

/** Walk the tree once, filling in parent, path and a stable id. */
export function index(root = TREE) {
  const byPath = new Map()
  const walk = (node, parent, prefix) => {
    node.parent = parent
    node.path = parent === null ? '/' : `${prefix === '/' ? '' : prefix}/${node.name}`
    node.id = node.path
    byPath.set(node.path, node)
    if (node.kind === 'folder') for (const child of node.children) walk(child, node, node.path)
    return node
  }
  walk(root, null, '')
  return { root, byPath }
}

export const isContainer = (node) => node?.kind === 'folder'

export function childrenOf(node) {
  if (!isContainer(node)) return []
  // Folders first, then everything else, each alphabetical — except the
  // executable, which always sinks to the end where it can be noticed.
  return [...node.children].sort((a, b) => {
    const rank = (n) => (n.kind === 'exec' ? 2 : n.kind === 'folder' ? 0 : 1)
    return rank(a) - rank(b) || a.name.localeCompare(b.name)
  })
}

export function resolve(byPath, cwd, arg) {
  if (!arg) return cwd
  if (arg === '/') return byPath.get('/')
  if (arg === '.') return cwd
  if (arg === '..') return cwd.parent ?? cwd
  const abs = arg.startsWith('/')
  const parts = arg.split('/').filter(Boolean)
  let node = abs ? byPath.get('/') : cwd
  for (const part of parts) {
    if (part === '.') continue
    if (part === '..') {
      node = node.parent ?? node
      continue
    }
    if (!isContainer(node)) return null
    const next = node.children.find((c) => c.name.toLowerCase() === part.toLowerCase())
    if (!next) return null
    node = next
  }
  return node
}

export const iconFor = (node) => node.icon ?? KINDS[node.kind]?.icon ?? 'doc'

export function sizeOf(node) {
  if (node.kind === 'folder') return node.children.length
  if (node.body) return new TextEncoder().encode(node.body).length
  return 0
}
