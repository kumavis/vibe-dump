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
DOM subtree — one `#os` element, fixed at 1440x900 logical pixels — and the
reveal *moves* it, still running, into a `CSS3DObject` sitting exactly where
the monitor's screen is. Three things make that invisible:

**The panel never reflows.** `#os` is always 1440x900 and is scaled to fit the
window by a transform on its parent. In the page that transform is a CSS
`scale()`; inside the monitor it is a perspective matrix from three.js. The
element itself never learns which.

**The camera starts at the one distance that matches.** The on-screen height of
a plane of world height `H` at distance `d` is `H · (viewportPx/2) / (d · tan(fov/2))`.
Set that equal to the height the page was already drawing the panel at and
solve for `d` (`screenFitDistance()` in `scene/camera-rig.js`). Measured in
Chromium at three aspect ratios, the panel lands within a thousandth of a pixel
of where it was a frame earlier. A single correction pass — apparent size goes
as `1/d`, so the ratio of measured heights *is* the error — is kept for the
cases where it does not.

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
frame. The panel is `inert` while it is in the monitor: a 1440x900 desktop
rendered six pixels tall should not be tab-focusable.

## Layout

```
src/
  main.js            boot; fits the panel to the window
  os/
    shell.js         owns the filesystem, window manager, prefs, programs
    wm.js            drag, eight-way resize, snap, minimise, tile, focus stack
    appbar.js        menus, open-window chips, theme switch, clock
    desktop.js       icon field, wallpaper, context menu
    fs.js            the virtual filesystem — and its notes describe the room
    motifs.js        kranok, chofa, naga, chedi, lotus, prajam yam, as SVG
    icons.js         the plain line icons, kept separate from the ornament
    reveal.js        the loader, and the lazy import of everything below
    apps/            explorer, reader, terminal, settings, motif viewer, about
  scene/
    index.js         assembly, lights, interaction, the hand-off
    camera-rig.js    poses, the flight path, the handheld drift
    monitor.js       the panel, the hole, and the live desktop behind it
    materials.js     palette, procedural textures, fake bloom, contact dirt
    room.js desk.js printer.js solder.js board.js
```

Nothing under `scene/` is in the initial bundle. The desktop ships as about
31 kB of gzipped JavaScript; the 234 kB of three.js and room arrive only when
somebody runs the executable.

## The room

Art direction borrows from *Stray*'s interiors: ninety percent near-black, all
the chroma in the lights, one warm practical fighting a violet window shaft in
a very small volume of dusty air. Everything is built from primitives with
vertex colours and canvas textures drawn at boot — there are no image assets in
this package at all.

The printer prints a chedi, layer by layer, revealed with a clipping plane
while the gantry steps up one layer height at a time. The board wakes up and
runs a chase across eight LEDs. The soldering station starts switched off.
