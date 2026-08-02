# SMF scenario shell — unification spec

Playtest feedback on the prototype batch: *"unclear how to play each
prototype and they don't really feel like they are part of the same game."*
This spec fixes both. Every `smf-*` package presents as a **shift at the
same foundry**: identical chrome, identical rhythm (work order → begin
shift → checklist → shift complete), scenario-specific content only where
the design differs.

## The shared shell

Canonical files in this directory — copy VERBATIM into each package's
`src/` (repo rule: no cross-package imports; the doc copy is the source of
truth, packages carry duplicates):

- `smf.css` — all chrome styling (panel, cards, bars, checklist, log,
  buttons, banner, briefing). A package's own stylesheet loads *after* it
  and may only add scenario-specific styles (canvas-adjacent visuals),
  never restyle `smf-` classes.
- `briefing.js` — `mountBriefing(root, opts)`: the WORK ORDER card shown
  on load (sim paused), `BEGIN SHIFT ▸` starts play, persistent `☰ BRIEF`
  button (top-left) reopens it (pausing again), Esc closes.

## Required structure (every package)

1. **Identity block** at the top of the telemetry panel, exactly:
   - `.smf-h1` → `SLIME MOLD FOUNDRY`
   - `.smf-sub` → `SCENARIO NN — NAME` (numbers below)
   - `.smf-tag` → the layer line (below)
2. **Speed buttons**: exactly `⏸ ×1 ×8 ×32` as `.smf-btn` (+`.on`), in that
   order, immediately under the identity block. No other speed sets.
3. **Briefing**: `mountBriefing` wired so the sim runs at speed 0 while the
   card is open and ×1 on BEGIN SHIFT. The world must be visible and alive
   behind the dimmed card (pre-warmed first frame), so the gallery
   screenshot (~1.2s) shows the game *and* how to play it.
4. **SHIFT CHECKLIST** card (`.smf-cardh` title exactly that) listing the
   milestone flags; player-verb milestones prefixed with
   `<span class="you">YOU:</span>`.
5. **EVENT LOG** card (title exactly that), newest first, `.smf-log`.
6. **Completion banner**: `.smf-banner`, text `SHIFT COMPLETE — <detail>`
   where `<detail>` is scenario-specific (e.g. `COLONY RELOCATED T+98s`).
7. **Help footer** `.smf-help`, one line, format:
   `<primary verbs> · <camera if any> · ☰ BRIEF reopens the work order`
8. **Legend** `.smf-legend` ending with the two-color law line:
   `■ matter · ■ signal · ■ value field` (colored spans, field omitted only
   if the scenario truly has no field).
9. **Panel toggle** `.smf-toggle` top-right (`HIDE ▸` / `◂ TELEMETRY`).
10. Keep `window.smf = sim`. The briefing must not touch the sim — pause is
    the shell holding speed at 0, so harnesses are unaffected.

## Scenario numbering, tags, and briefing copy

The `situation` voice is a dispatch memo from the foundry — terse, second
person, no lore dump. Verbs name real inputs. Objectives are checkable.

### SCENARIO 00 — GRADUATION (`smf-graduation`)
- tag: `L0→L1 · HANDS TO BLUEPRINTS`
- workOrder: `FOUNDRY WORK ORDER 00`
- situation: `New territory. The contract rate is climbing and your hands
  are the only tool on site. The foundry notices repetition — build the
  same line three times and it will offer to remember it for you.`
- verbs: `[PALETTE, 'pick extractor or furnace']`,
  `[CLICK MAP, 'place it — extractors on ore, furnaces adjacent']`,
  `[R, 'rotate a remembered pattern']`,
  `[STAMP, 'place a whole remembered line at once']`
- objective: `Meet the final contract rate. Let repetition earn you the stamp.`
- banner detail: `CONTRACT SECURED`

### SCENARIO 01 — DYING PATCH (`smf-dying-patch`)
- tag: `FIELD & ORGANISM · THE BASELINE LOOP`
- workOrder: `FOUNDRY WORK ORDER 01`
- situation: `ALPHA's patch is nearly spent. The organism handles growth,
  sleep and retreat on its own — you are its endocrine system, and it
  needs exactly two hormones from you.`
- verbs: `[YOUR MOVES, 'place the survey beacon at Patch B when the signal
  dies']`, `[YOUR MOVES, 'grant resorb authority when the mold asks']`,
  `[DRAG / WHEEL, 'pan and zoom — far out for the tile view']`
- objective: `Relocate the colony to Patch B. Retreat pays for the move.`
- banner detail: `COLONY RELOCATED — T+<t>s` (existing banner, reworded)

### SCENARIO 02 — THE JAM (`smf-the-jam`)
- tag: `L2→L3 · ALERT ROUTING`
- workOrder: `FOUNDRY WORK ORDER 02`
- situation: `Lanes earn matter; jams stop them; your hands clear them.
  Buy more lanes and the jams outrun you — the foundry pays fluency in
  signal parts. Alerts are items here, not popups.`
- verbs: `[CLICK JAM, 'clear it by hand']`,
  `[PANEL, 'buy lanes for income; probes, a responder and tanks once earned']`
- objective: `Bank the quota with your hands in your pockets.`
- banner detail: `QUOTA BANKED HANDS-FREE`

### SCENARIO 03 — PARTS BENCH (`smf-parts-bench`)
- tag: `SIGNAL PLUMBING · FIVE CONTRACTS`
- workOrder: `FOUNDRY WORK ORDER 03`
- situation: `Five control contracts, no code. Computation is plumbing:
  valves scale, tanks remember, gates decide — and all of it jams,
  saturates and chatters where you can see it.`
- verbs: `[TABS, 'pick a contract']`, `[PALETTE + CLICK, 'place a part']`,
  `[DRAG ACROSS CELLS, 'run a trace']`,
  `[DRAG ON A PART, 'tune its valve k / gate N']`,
  `[INSPECTOR, 'flip a gate NO/NC · remove']`
- objective: `Hold each contract inside its band for 12 straight seconds.`
- banner detail: `ALL CONTRACTS HELD`

### SCENARIO 05 — THE SEAL (`smf-the-seal`)
- tag: `L4 · SEALS & BLAST RADIUS`
- workOrder: `FOUNDRY WORK ORDER 05`
- situation: `Seal your module into a word the planner can build with.
  Contracts can stay green while behavior fails. Breaking your own seal
  has a price — this foundry makes you look at it first.`
- verbs: `[SEAL, 'measure a live window into a contract']`,
  `[HOLD BREAK, 'preview the blast radius; release early to cancel']`,
  `[FIX / RESEAL, 'descend, repair, re-measure']`
- objective: `Recover full product rate under a contract the failure taught you.`
- banner detail: `RE-VERIFIED — CONTRACT ENRICHED`

### SCENARIO 06 — CONTINENTAL (`smf-continental`)
- tag: `PERFORMANCE · WIELDING THE WHOLE ORGANISM`
- workOrder: `FOUNDRY WORK ORDER 06`
- situation: `Fifty thousand structures and one brush. The organism reads
  the field, not your clicks — pour value where it should live, starve
  what it should abandon, and watch provinces move.`
- verbs: `[DRAG, 'pour survey field (costs income)']`,
  `[ALT-DRAG or RIGHT-DRAG, 'starve a region']`,
  `[WHEEL, 'zoom continent ↔ machine']`
- objective: `Pull a province to your pour; make the mold eat one you starve.`
- banner detail: `PROVINCE REDIRECTED`

## Verification per package (before it counts as unified)

- `node harness.mjs` still exits 0 (the shell must not touch the sim).
- `npx vite build` green.
- Playwright: at ~1.2s the page shows the briefing card over a live scene
  with zero console errors; after clicking BEGIN SHIFT the sim advances;
  `☰ BRIEF` reopens the card and the sim clock stops while it is open.
