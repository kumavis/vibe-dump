# Sources: utah-teapot (the Utah teapot dressed as a Shang bronze)

A Taotie Kit showpiece, not a museum object. There are **no photographs** in this folder and none were used.

**Form.** Martin Newell's teapot (University of Utah, 1975): 32 bicubic Bézier patches (rim, body, handle,
spout, lid, knob; Frank Crow's bottom). The control points are copied verbatim from three.js
`examples/jsm/geometries/TeapotGeometry.js` (MIT licence, © three.js authors; Eric Haines' tessellator) into
`src/artifacts/utah-teapot/newell.js`. That data carries Jim Blinn's vertical squash (÷ 1.3) — the proportions of
the famous rendering, not of the taller real Melitta kettle (the original is in the Computer History Museum,
Mountain View). The lid is used as Newell drew it (`fitLid` off), so the shadow gap round it is his.

**Scale.** Chosen, not measured: 240 mm from the spout tip to the back of the handle (37.30 mm per Newell unit;
117.5 mm to the top of the knob before relief). Spout toward +X, handle toward −X, front +Z.

**Proof.** `node reference/utah-teapot/check-form.mjs` builds the artifact's own undecorated meshes
(`utah-teapot/shell.js`, relief off) and measures every TeapotGeometry vertex (blinn on, fitLid off, the same
scale) against them: patch data vs TeapotGeometry 6 × 10⁻⁶ mm; vertices vs our meshes max 0.10 mm, rms 0.015 mm
at q 1 (the rest is our tessellation's chord error on the rim bead). Target < 0.2 mm.

**Décor.** Designed for this piece with the kit's rounded vocabulary (KIT.md § Rounded bands), calibrated by eye
on the project's Met fangyi and Nezu you reference photographs; no single bronze is copied.
