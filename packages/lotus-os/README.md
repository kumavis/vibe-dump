# Lotus OS

A toy desktop — gold ornament on black lacquer, folders, resizable windows, a
terminal that actually walks the filesystem — with one program on it that is
not a program. Run `reveal.run` and the camera pulls back off the screen until
you can see the monitor it has been playing on, and the workbench under that.

```
npm run dev -w @vibe-dump/lotus-os      # http://localhost:5173
npm run build -w @vibe-dump/lotus-os
npm run shots -w @vibe-dump/lotus-os    # drives the whole thing in a browser
```

## The trick

The interesting part is that there is no cut. The operating system is a single
DOM subtree — one `#os` element — and the reveal *moves* it, still running,
into a `CSS3DObject` sitting exactly where the monitor's screen is. Three
things make that invisible:

**The monitor is built to the shape of your window.** `#os` is the browser
window, edge to edge, one logical pixel to one page pixel (`os/screen.js`), and
the monitor's active area is built to whatever aspect that is — 16:10, 21:9,
portrait if you turn a phone over. That is not decoration. The hand-off below
solves for *height*, and matching the height only matches the width as well if
the two rectangles are already the same shape. What is held fixed instead is
the diagonal: however it comes out, the person at this desk owns one 27 inch
monitor.

**The camera starts at the one distance that matches.** The on-screen height of
a plane of world height `H` at distance `d` is `H · (viewportPx/2) / (d · tan(fov/2))`.
Set that equal to the height the page was already drawing the panel at and
solve for `d` (`screenFitDistance()` in `scene/camera-rig.js`). Measured in
Chromium on the exact hand-off frame: nothing at all at 16:10, 0.05px at 16:9,
0.06px into a 900x1300 portrait window and 0.32px into a 2400x760 slot. A
single correction pass — apparent size goes as `1/d`, so the ratio of measured
heights *is* the error — is kept for the cases where it does not.

**The screen is a hole in the canvas.** The WebGL canvas sits on top of the
CSS3D layer, and a plane coincident with the screen is drawn with
`blending: NoBlending`, `opacity: 0`, `premultipliedAlpha: true` and
`fog: false`. `NoBlending` is what lets an alpha of zero actually reach the
frame buffer — with `NormalBlending` three forces alpha back to 1 and the
`opacity: 0` silently does nothing. Because the plane still writes depth,
geometry behind it is masked and geometry in front of it (the bezel, a cable,
the desk edge) correctly covers the desktop.

Moving a subtree loses scroll offsets, focus and the clock on every running CSS
animation, so `keepState()` snapshots all three and puts them back in the same
frame. The panel is `inert` while it is in the monitor: a desktop rendered six
pixels tall should not be tab-focusable.

One floor survives from when the panel was nailed to 1440x900: under 900x560 it
stops shrinking and the page scales the whole layer down instead, because below
that the app bar stops being an app bar. `scale` is 1 in every window bigger
than that, which is nearly all of them.

## Resizing the window while you are in the room

Because the monitor is built to the window's shape, changing the window's shape
while you are standing in the room is changing the monitor. It does not cut to
the new shape — it goes there on a spring, slightly under-damped, so it
overshoots a couple of millimetres and comes back; the panel rocks on its hinge,
kicked once by an impulse the size of the change and signed by which way it
went; the power light drops to amber and blinks at six hertz while it re-acquires
its signal; and the machine inside puts up its own OSD in the corner with the
new resolution, the way a monitor does. The desktop is stretched along with the
panel on the way, because the CSS3D copy is scaled from where the panel *is*
this frame and not from where it is heading.

None of that is allowed to happen anywhere near the hand-off. At the screen pose
and on the flight home the new shape is taken instantly and the camera is
re-solved for it, because for those frames the hole in the canvas has to be
exactly the rectangle the page is about to draw — and a spring that is still
moving is a rectangle that is not.

## Layout

```
src/
  main.js            boot; sizes the panel to the window, and the monitor's OSD
  os/
    screen.js        how big the panel is: the window, down to a floor
    shell.js         owns the filesystem, window manager, prefs, programs
    wm.js            drag, eight-way resize, snap, minimise, tile, focus stack
    appbar.js        menus, open-window chips, theme switch, clock
    desktop.js       icon field, wallpaper, context menu
    fs.js            the virtual filesystem — and its notes describe the room
    motifs.js        kranok, chofa, naga, chedi, lotus, prajam yam, as SVG
    icons.js         the plain line icons, kept separate from the ornament
    reveal.js        the loader, and the lazy import of everything below
    apps/            explorer, reader, terminal, settings, motif viewer, about,
                     frame (an iframe with a neighbouring app in it)
    embeds.js        which neighbours the frame is allowed to show
  scene/
    index.js         assembly, lights, interaction, the hand-off
    camera-rig.js    poses, the flight path, the handheld drift
    monitor.js       the panel, the hole, the live desktop behind it — and
                     the shape it takes from the window, and the spring, nod
                     and blink it takes getting there
    materials.js     palette, procedural textures, fake bloom, contact dirt
    room.js desk.js printer.js solder.js board.js
```

Nothing under `scene/` is in the initial bundle. The desktop ships as about
34 kB of gzipped JavaScript; the 234 kB of three.js and room arrive only when
somebody runs the executable.

## The neighbour

`Automata Graph` on the desktop is not a program on this machine. It is
[Rule Explorer](../rule-explorer) — another app out of the same gallery — in an
iframe filling the window body, running its own event loop and its own WebGL
context. The OS's contribution is the edges, which is what a window manager was
always supposed to be. It survives `reveal.run` too: the frame goes into the
monitor with the rest of the panel and keeps drawing on it.

Where the page comes from depends on the build, and the window's toolbar says
which:

| build       | source                                                          |
| ----------- | --------------------------------------------------------------- |
| gallery     | `../rule-explorer/`, a sibling directory on the deployed site    |
| `npm run dev` | the same path, served off the sibling's `dist/` by a middleware in `vite.config.js` — build it once and the window works in dev too |
| `standalone.mjs` | the neighbour's published address on `window.__LOTUS_EMBEDS__`, because one page has no next door |

The sibling path wins wherever it resolves: same origin, no second host that has
to be up, and the copy you just built rather than the copy that happens to be
deployed. Only the single-file build falls back to the published URL, and that
window then needs the network *and* needs the viewer to permit framing another
host. Both can fail, they fail identically to look at — a browser error page,
delivered by a `load` event, sitting in the window like a crash — and only
`securitypolicyviolation` tells them apart, so that is what the failure card is
built on. If a host refuses, the window says so by name instead of showing the
wreckage.

The two packages stay independent: nothing here imports anything from there.
The only things that cross are a directory name and a URL in `embeds.js`, read
by a dev-server middleware and by a by-hand build tool.

## The room

Art direction borrows from *Stray*'s interiors: ninety percent near-black, all
the chroma in the lights, one warm practical fighting a violet window shaft in
a very small volume of dusty air. Everything is built from primitives with
vertex colours and canvas textures drawn at boot — there are no image assets in
this package at all.

The printer prints a chedi, layer by layer, revealed with a clipping plane
while the gantry steps up one layer height at a time. The board wakes up and
runs a chase across eight LEDs. The soldering station starts switched off.
