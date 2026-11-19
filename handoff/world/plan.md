# Cinematic battlefields: art direction and plan

Shots: scratchpad/world/shots/now-*.png. Inventory of the scene: inventory.md beside this file.

## What the screenshots say
- **The world ends at the table edge.** Beyond the mat there is a walnut plane, then a flat near-black void, which is both background and fog colour. From any low angle the top half of the frame is black (now-skirm-fort-s4-low, now-grand-fort-s5-low). From the default camera, a third of the frame is bare wood (now-mid-battle). That empty space is the single biggest reason it reads as "props on a table".
- **Nothing is grounded.** Platforms, towers, wall columns and rocks sit on the grass with hard edges: no trodden earth, no spill of stones, no soil where a post meets the ground. The forest is a flat dark disc under lollipop trees (now-skirm-classic-s411-high).
- **One meadow everywhere.** Every board is the same green, mottled evenly, with 700 grass cones sprayed uniformly, including against the pieces. There are no paths, no wear where armies would walk, and nothing that says where we are. Field and Grand just have more of the same (now-grand-fort-s5-high).
- **Toy notes.** Unmortared grey cubes for walls (now-field-open-s7), stacked tan pillars with pyramid caps, one fixed noon light.
- **What already works:** the figures (the fur is the best thing on screen), clear objectives and zones, good soft shadows, and the **powder board** (now-mid-powder-battle). Scorched ground, wrecks, smoke and a warmer light already make a place. That is the proof: identity plus grounding sells the board.

## The direction
The battle should look like a moment in a real place seen from a little above. A lived-in borderland of fields, orchards, quarries and keeps, at a particular time of day, where two armies have camped and met. The play area keeps its board legibility: plain, readable ground, every solid thing a rules piece, crisp edges, and zones and objectives unchanged. Everything around it and underneath it tells the story. The light changes over the battle, the ground remembers it, and each board has a name.

### Framing A: landscape world (recommended)
The walnut table, frame and black void go. The mat becomes a field: the same plane, still the rules area, edged by a 0.4" band of mown or trodden ground and low boundary stakes at the corners and zone lines. The stakes are off the mat, with pennants in each seat's colour. Beyond it, one large ground ring painted in the board's theme: hedged fields, a cart track that continues the board's paths, a stream or quarry face. At the rim, a merged low-poly hill silhouette and an instanced treeline. Above it, a sky dome with a gradient and a sun disc, with the fog turned into horizon haze of the same colour. Behind each deployment zone, off the mat, sits that army's camp: tents, a banner, a cookfire with smoke. The overview still reads as a board because the mat edge is a hard line of colour and wear, and because the surround is lower in contrast and slightly desaturated (haze). Seen low, the camera finds a horizon instead of a void.
- **Costs:** about 6-10 draw calls (sky 1, ground ring 1, hills 1, treeline 1-2, camps 2, stakes 1); one 1024 px ground-ring canvas; a sky shader. The far plane (400) and fog distances are retuned, and maxPolarAngle can rise a little.
- **Breaks:** the title frame and thumbnail (deliberately), the terrain-shots frame (the harness must hide the dressing), and the "pocket tabletop" self-description, which the title copy may want to keep or drop.

### Framing B: deepened diorama
Keep the wooden table and make it a room. The mat becomes a thick modular board with a cut edge showing soil strata and a turf top. Under a warm lamp pool the light falls off into a dim study. Around it: dice trays, rulers, army cases, paint pots, a mug, a window with daylight. The pieces get grounding and basing like painted models.
- **Costs:** similar draw calls, and more texture work for the room.
- **Breaks:** less, because the title keeps its frame. But it answers the owner's words the wrong way. "A rich lived-in world" would become a rich lived-in table, and the low camera still ends at a wall. Its best idea, the cut board edge, can be kept in A as the mat's border.

**Recommendation: A.** Keep B's cut edge as an option for the mat border if A's open edge ever reads as unbounded in playtest.

## Rules the dressing keeps
1. **View-only and seeded.** A new view/dressing/ directory. place.js is pure (no three.js): records from a seed. draw.js builds the meshes. The seed is `hash(setup.board, mission, terrain set, 'dress')`. It arrives through what the view already gets: `view.rebuild(g)` carries `g.setup` and the title's `showTable(seed, …)`. It never draws Math.random (so the figures' stream is untouched) and never imports core/rng.js. sim/boundaries.mjs already refuses that import; add a rule that view/dressing/ imports nothing from core/ but the pure geometry doors.
   **Check (sim/dressing-check.mjs):** (a) in Node, place.js over 1,000 seeds × every set, twice, gives identical records, and every record obeys rule 2 against the core's own chunks, nav and objectives. (b) In Chromium, a watched battle with ?dress=0 and with dressing on ends with the same stateHash, trace and rng state.
2. **Three classes on the mat.** Flat decals go anywhere: painted into the mat canvas or drawn as one decal mesh with depthWrite off, under the overlay. Low clutter (under 0.3") goes only on walkable nav cells, at least 1" from any chunk's footprint edge, outside objective ranges and deployment zones; there is one placement try per item and a failure is dropped, not nudged. Anything taller goes only inside a rules piece's footprint (rubble inside a wall's base, roots inside a forest floor) or off the mat. Nothing that blocks sight or looks like it could.
3. **Quieter than the game.** Dressing sits under rings, rays, reach paint and the cursor: low clutter fades within 1.5" of the pointer's ground point and of a picked unit's ring (one uniform), and decals stay below the overlay's renderOrder. Saturation and contrast stay lower than the figures'.
4. **Same world for both peers and in replays.** It follows from rule 1. Scars are rebuilt from the mirror's events, so a snap reproduces them (sim/snap-check gains a dressing row).
5. **Lowfi and phone.** ?lowfi and the low quality get the sky, ground ring and decals painted into the mat (free), with no treeline, camps, clutter or ambient life. Medium halves the instance counts.
6. **Budgets.** Classic is at ~600 main-pass calls today, so dressing is capped at **12 draw calls and 40 K triangles** on every board, shadows off for everything off the mat, and render-bench must pass unchanged. Debris uses one InstancedMesh per material class.

## Slices, in build order
Each slice is new modules plus a hook or two in view/index.js, view/stage.js and view/table.js. None touches view/units.js, effects/, models/, diorama.js or sfx.js (wt/f5a), or any UI string (wt/units).

**S1. The surround and the sky.** (First slice: the most change for the least risk, nothing on the play area.)
Adds: a sky dome (vertex-gradient shader, sun disc, haze band); fog recoloured to the horizon; a ground ring from the mat edge to ~3× the board, painted from the seed (field strips, hedgerows as painted lines, a track); a merged hill silhouette and an instanced treeline at the rim; the mat edge as a trodden band, with boundary stakes off the mat. The walnut table, frame and under-box are hidden when dressing is on (kept for ?dress=0). One seeded time of day per board (morning, noon or late afternoon) sets sun angle and colour, hemisphere and sky. Files: view/dressing/{place,surround,sky}.js (new), hooks in view/index.js (construct, rebuild, setBoard), view/stage.js (expose sky and sun setters, fog colour), view/table.js (`showTable(on)` for the wood). Cost: +5-6 calls, ~15 K triangles. Checked by: the 12-frame set of this audit re-shot side by side; render-bench; title-shot and terrain-shots run with ?dress=0 and still pass against their references; a new dressed-title reference; phone frame.

**S2. Grounding every rules piece.** Per chunk kind: a footprint decal painted into the mat (trodden earth under platforms, leaf litter and moss under forests, stone chips around walls, scorch around wrecks), debris that thins outward (low clutter, rule 2), and the tufts moved into clusters at piece edges and field margins. Seeded tufts replace the uniform scatter when dressing is on. Files: view/dressing/ground.js; table.js gains a `paintOver(fn)` hook (the scorch path already repaints the canvas). Cost: +2-3 calls (stones, splinters, leaves instanced). Checked by: close and low shots of each kind; dressing-check's class rules.

**S3. Paths and wear along the real lanes.** A view-side grid from the chunk footprints (the core's nav is read, never asked to plan, so its memo is untouched). Its own A* runs through zone centres, objectives and gaps, and the result is painted as worn tracks into the mat and continued into the surround's track. Cost: 0 calls. Checked by: overview shots on 10 seeds per set (the paths must follow open ground and never cross a piece); a playtest note on whether anyone reads a path as a rule.

**S4. A theme and a name per board.** Themes chosen from the terrain present: orchard (trees, hedges), quarry (rocks, columns), border keep (fortified), burned hamlet (powder, already half there), and later river meadow and old ruins. Each sets mat palette, ground-ring painting, surround props, camp style and haze. The name comes from per-race syllable lists. Showing it in the setup panel, the log header and replays is one hook, landed after wt/units. Cost: 0-2 calls. Checked by: one frame per theme; distribution over 1,000 seeds.

**S5. Camps behind each zone.** Race-styled tents, stores and banners in seat colours; a cookfire with smoke reusing the plumes' cloud through a small export. Cost: +2-3 calls (one merged mesh per camp, plus smoke). Checked by: overview and title frames; banners must never sit on the mat.

**S6. Light that follows the battle.** Round k of R moves sun angle, colour and haze from morning towards dusk. The sun stays at least 25° up so shadows never stretch across the board. `mood()` becomes one input among several. Cost: 0. Checked by: round 1 and final-round frames; readability at dusk on the phone.

**S7. Hero dressing at objectives.** Flat only on the play area: a worn flagstone circle, a well mouth or shrine paving painted in, and the objective marker reskinned per theme with its footprint unchanged. Cost: 0-1.

**S8. Battle scars that persist.** Trampled grass along units' moves, painted per phase from the mirror; craters and scorch already exist; wreck smoke lingers. Snap-rebuildable. Cost: 0 (a canvas repaint, throttled).

**S9. Ambient life.** Birds over the surround, drifting leaves, grass and banner sway (vertex shader), chimney smoke. Cost: +2-3. All off on lowfi.

**S10. Opening camera move and beats.** A 3 s glide from the surround onto the battle view, skippable, as a new path in the rig, with every preset unchanged (camera-check). A brief round-start pan. Sound ambience per theme waits until wt/f5a's sfx.js lands.

## The title, the reference and the thumbnail
S1 changes the title: the orbit's top band shows the surround and a strip of sky instead of walnut. That is a declared change. title-shot keeps passing against HEAD with ?dress=0. A second run pins the dressed title against the new commit once the PM accepts the frames. The thumbnail is re-shot by hand after S1 and again after S4 (themes change the title board's look).

## Risks
- **Readability:** the surround must stay lower in contrast than the mat. Paths may read as roads with a rule. Dusk may hide figures. Judge each slice on phone-size and thumbnail-size frames, not only at desktop size.
- **Performance:** classic sits at the 600-call line. Everything must be instanced, merged or painted, and the shadow pass must not see the surround. Phone fill-rate: the sky is one cheap shader, and haze replaces nothing.
- **Pixel gates:** every gate keeps running with ?dress=0 (one URL switch read in view/index.js), so the refactor gates stay meaningful.
- **Branch conflicts:** wt/f5a edits units, effects/shots, models, diorama and sfx; wt/units edits ui/, input/, present/ and index.html strings. These slices add view/dressing/ and touch only view/index.js, stage.js and table.js in small hooks. The board name's UI hook and camp smoke (plumes export) wait until those branches land.
- **Determinism slip:** a dressing that reads anything per viewer (screen size, quality) for placement would make peers differ. Quality may only drop items from the end of a seeded list, never reorder it.

## Questions for the owner
1. **World or diorama?** Recommendation: the landscape world, with the mat's edge kept crisp. It is the literal answer to "a rich lived-in world".
2. **May the title frame and the gallery card change?** Recommendation: yes, once after S1 and once after S4, each re-pinned and re-shot by hand.
3. **Should the light move with the rounds (morning to dusk), or be fixed per board?** Recommendation: move, never darker than late golden hour, the same for both players.
4. **Should each board get a visible name (setup, log header, replays)?** Recommendation: yes, after wt/units lands. It is the cheapest way to make a seed feel like a place.
