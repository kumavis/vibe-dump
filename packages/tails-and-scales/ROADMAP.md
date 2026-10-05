# Tails & Scales — roadmap

The running record of planned work. Update it as items land: tick them, link
the commit, and add whatever the work turned up.

## Standing rules

- **Behaviour parity.** Refactors must not change how a battle plays. With the
  app built, `node test/parity.mjs` replays twelve seeded AI-vs-AI battles in
  the browser (`?debug&fast`) and compares each trace line against
  `test/baseline.json`. Set `CHROMIUM_PATH` to the pre-installed Chromium if
  Playwright's own isn't installed. Re-record (`--record`) only for a change
  that is *meant* to alter play, and say so in the commit.
- **Determinism.** Everything that can change an outcome draws from the logic
  RNG (`rng.js`), never `Math.random`, and reads logical positions, never
  animated ones. Visual randomness stays on `Math.random`.
- **Copy.** Call it a tabletop wargame. Don't name other games or companies in
  docs, in-game copy, code comments or commit messages.
- **Repo conventions** (see the root `CLAUDE.md`): `npm run build` and
  `npm run verify` before every push, `dist/` committed, and lockfile changes
  in a commit of their own.

## Queue

1. [ ] **Architecture design.** Hands-on Automerge research, competing
   architecture proposals, judged and merged into one spec.
2. [ ] **Refactor.** A deterministic core that runs headless in Node (state,
   rules, commands, AI); a presenter seam so the browser paces it with
   animation while tests and network catch-up run it instantly; races,
   abilities and terrain as data; view, UI and input split out of `main.js`.
   Parity is checked after every step.
3. [ ] **Verify the refactor.** Parity in the browser and in Node, browser
   play-through tests, an adversarial review.
4. [ ] **Remote multiplayer over Automerge.** The match setup and an
   append-only command log live in an Automerge document; every client
   replays it through the core. Join by link, spectate, desync detection.
   (The claude.ai artifact blocks outside connections, so online play works
   from GitHub Pages or a local server.)
5. [ ] Playing as the serpents (side 1) starts with your side of the board in
   front of you.
6. [ ] Spectating is viewed from the side: one army left, one right.
7. [ ] The End-phase button lights up when you have nothing left to do.
8. [ ] After round 5, the win screen offers **Keep playing**.
9. [ ] A new race: insectoids (about six unit types, models, abilities).
10. [ ] A new race: bird-people (about six unit types, models, abilities).
11. [ ] Race selection shows a mini 3D diorama of the race's figures.
12. [ ] More terrain, including fortifications you can climb onto (2.5D
    elevation: raised walkable tops, stairs and ramps, height for line of
    sight and cover, destructible platforms).
13. [ ] Verify the features, rebuild, re-shoot the thumbnail if needed,
    publish.

## Done

- Charge destination picking; clean table on a new game; inside-out serpent
  bodies and open shells fixed; exact pathfinding distances; Auto race
  closed.
- Battles replay exactly (logic RNG, logical positions, sampled wrecking,
  trace, `?fast`), plus the parity tooling in `test/`.
