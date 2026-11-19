# Tails & Scales: session handoff, 19 November 2026

This folder hands three unfinished workstreams on `packages/tails-and-scales` to a new session. All code is
pushed; nothing is running anywhere. Read this file, then the `STATE.md` of the stream you pick up. Delete the
folder (or just never merge this branch) once the work has moved on: it is a carrier, not part of the app.

| Stream | Branch at tip | Where it stopped | First thing to do |
|---|---|---|---|
| Units: distances in tails | `wt/units` at `bd388055` | Code, re-recorded corpus and Node checks done. Browser checks half run, one fix unproven. | Run the owed browser checks, take the screenshots, PR to main. |
| Battlefields: a lived-in world | `wt/world` at `0b656695` | Five commits (surround and sky, grounding, fixes, lanes, themes). The last three have never been seen on screen. | Shoot the frames and judge them before building more. |
| F5a: two new races | `wt/f5a` at `e5fdc905` | Built and recorded, sweep half run. Blocked on balance; the lab is mid phase 4 (prices by terrain set). | Finish the lab's phase 4, then decide and build. |

`main` is at `7ca17bcd`: the three branches' base `681fcf5c` plus one docs-only merge (the design-bible report,
pull request 92). None of the three is merged to main. Recommended order: units first (it is nearest done and the other two must
absorb it), then battlefields, then F5a. A fourth item has no branch yet: most of the design-bible report's
lessons have not been applied (see "Work item: apply the design-bible report" below).

## The owner's standing instructions

These were given in chat and still govern. Quoted where the wording matters.

- Keep working the Tails & Scales roadmap. Push feature branches, open pull requests to main and merge on
  green CI. Pages deploys from main.
- "you are the project manager and quality control master": individual tasks run in subagents, the main session
  briefs them, reviews what comes back (reads the report, spot-checks, looks at the screenshots) and does the git
  and pull-request work. Which model the subagents run on is the owner's choice and is not recorded in the repo;
  ask them.
- Units: "i want our unit of measurement to be metric units. our better yet maybe some in-universe unit. whatever
  it is, i dont want it to be done via a conversion, the units should have their ranges defined in round numbers
  not hard to read numbers like 1.73469". The name was then confirmed: "tail works, go with it".
- Battlefields: "more cinematic battlefields. so far most have just been decorated with a few props, but it
  doesnt sell a rich lived in world".
- Balance between races, answered at the handoff: "approximately even but some terrain will be handled better by
  certain races". So the HOME target below is the one that binds, and a race's home terrain is a trait to say out
  loud, not a flaw to flatten.
- No Grand price retune for the two original races; that is a roadmap item.
- Browser checks run headless. (They already do: every check launches Chromium through Playwright with no
  window.)

## Rules that hold across all three streams

- **Parity.** Every battle already recorded in `sim/oracle/` must replay byte-identical unless a change is
  declared and proven. Units is the one declared exception so far (wording only, proven by
  `sim/wording-proof.mjs`). F5a's rules must be reachable only through the new races' own flags and data: never
  keyed on `fly` alone (the Glider Wing flies), never terrain generation, missions' boards or the older races'
  data or AI.
- **Checks are never loosened, skipped or quarantined** to get a pass. A check that fails gets a root cause.
- **No history rewriting on pushed branches.** A subagent's amend and force-push was refused in the old session,
  and the main session did not route around it. See the battlefield stream for the one commit this affects.
- **Copy rule.** No other game or company is named anywhere in the app or its docs.
- **Repo rules** are in the root `CLAUDE.md`: commit only `packages/tails-and-scales/` and
  `dist/tails-and-scales/`; lockfile changes in their own commit; shared gallery output is generated at deploy
  and never committed; thumbnails are re-shot by hand and only when the picture really changed.
- **Attribution.** End commits and pull-request bodies with the lines your own session specifies. Put no model
  name in code, docs or commit subjects.
- **Rounded numbers still to flag to the owner** (rules data, not conversions): blast templates of 1.6, 2.4 and
  2.6 tails; base sizes 0.3 to 1.5; the 0.45 base limit for riding a vehicle.

## Stream 1: units (`units/STATE.md`)

The native unit of length is renamed the **tail**, one for one, with no conversion and no number changed.
`core/rules.js` exports `LENGTH` and the helpers `tails(n)` ("6.3 tails", singular only for exactly 1) and
`tl(n)` ("6.3t", for tight places). A copy lint in `sim/boundaries.mjs` rejects the inch mark in user-facing
copy.

- **Proof.** Only four log lines in the core carried the inch mark into the recorded hashes. All 97 battles were
  recorded again; `sim/wording-proof.mjs` shows every state line and shadow snapshot identical and every changed
  log line returning its old hash when the old wording is put back. No `CORE_VERSION` bump.
- **Done:** four commits pushed; every Node check passes after the re-record; `parity --browser` 97 of 97.
- **Owed before the pull request:**
  1. `input-check` whole (it failed one row, the spell bar still expecting the inch mark; `bd388055` fixes the
     expectation and has not been run) and its `--self-test` with mutants `ring-at-rider,rays-from-ground,deck-unsaid`.
  2. `hud-check` and its plain `--self-test`, `ui-check` (watch the 360 px layout), `play-check`,
     `title-shot --ref 681fcf5c` (expect zero pixels changed).
  3. The screenshots, with `units/shots.mjs` (never run; it may need selector fixes). Look at each one: the
     card with a ranged and a blast weapon, move and shot tooltips, the dice tray after a charge, the battle
     log, the help's spell rows, the card at 360 px.
  4. The gallery entry commit, then the pull request, merge on green.
- **After it merges:** `wt/world` and `wt/f5a` each merge `origin/main` (no rebase) and pass the copy lint.
  F5a also words its two race files and help rows with the helpers, runs `wording-proof --only races`, then
  re-records `races/` in its own commit. Later, a mechanical sweep of the roughly 640 inch marks in docs and 600
  in comments.

## Stream 2: battlefields (`world/STATE.md`, `world/plan.md`)

View-only dressing, seeded from the board, in `view/dressing/`. Direction chosen: a landscape world (fields,
woods, hills, a sky, a time of day) with the mat's edge kept crisp, instead of a deeper tabletop diorama.
`?dress=0` restores the old look exactly, and the pixel gates shoot with it.

- **Rules the dressing keeps:** never `Math.random` or the core's rng; flat decals anywhere, low clutter only on
  open walkable ground clear of pieces, objectives and zones, anything tall only inside a rules piece or off the
  mat; at most 12 draw calls and 40,000 triangles. The tip is at exactly 12 calls.
- **Reviewed and accepted as a base:** S1 (surround and sky) and S2 (pieces grounded). Four before-and-after
  pairs are in `world/pairs/`; the owner has been sent them and has not commented.
- **Built but never looked at:** the fixes commit, S3 (worn lanes) and S4 (themes: farm, quarry, border keep,
  burned hamlet, with structures off the mat). The browser was busy for that whole round. Expect visual bugs.
  `world/queue.sh`, `go.sh` and `shoot.mjs` shoot the frames; the list of what to look at first is in
  `world/STATE.md`.
- **Review notes not yet answered by a frame:** the surround had land but no sign of people (S4's job); the
  Powder board read as a burned square in golden fields; forest floors were flat discs; walls stood on clean
  grass; clutter could poke through a base; a near wood sometimes walled off the top of the default view.
- **Owed checks:** `render-bench` (dressed, on a quiet machine), `title-shot`, `terrain-shots`, `snap-check`,
  `dressing-check --browser` (written, never run), `bake-check`.
- **At merge:** the title screen and the gallery thumbnail change, so the dressed title reference is pinned
  again and `thumbnail.jpg` re-shot. The seeded board name exists (`place.js` `nameOf`) and goes on screen only
  after units has merged.
- **One wart:** commit `0f5462a7` has no blank line after its subject, so its subject runs on. The owner left
  the call to the session, and the call is: leave the history as it is and merge that pull request normally.
  One long subject costs less than losing the per-slice commits to a squash. Do not rewrite history.
- **Still planned:** S5 camps behind each zone, S6 light moving over the rounds, S7 dressing at objectives, S8
  battle scars that persist, S9 ambient life, S10 an opening camera move and a slightly lower orbit.

## Stream 3: F5a, the Deepdelve Hive and the Highwind Aerie (`f5a/lab/STATE.md`)

On the branch: the two races with burrow, swarm and swoop, the view, prices, 14 recorded `races/` battles
(corpus 111), `CORE_VERSION` 17, PIN `c95203b`. The design and decisions Q1 to Q31 are in that branch's
`DESIGN.md` and `ROADMAP.md`.

- **Unfinished build steps:** the sweep of every standing check stopped part way (`f5a/sweep/summary.txt`;
  `property` failed there), then three reviews, fixes, the gallery entry and the pull request.
  `f5a/build-workflow.js` holds the prompts those steps used. `f5a/uncommitted-property-aggressive.diff` is a
  seven-line, untested edit that was sitting in the work tree (it makes Hive against Aerie hotseat battles
  aggressive so the Hive's spell is cast).
- **Why it is blocked:** both races swing between terrain sets. Gate: the first race's score share in 46 to 54.

  | Target | Meaning |
  |---|---|
  | EVEN | both sets of a size inside 46 to 54 |
  | HOME | the mean of the two sets inside 46 to 54, and neither set outside 40 to 60 |

- **What the lab found** (about 100,000 battles; `f5a/lab/diagnosis.md`, `phase2.md`, `phase3.md`):
  - The Hive's swing was the keep's raised objective, which burrowers could never hold. Lever **H3b** fixes it:
    a burrower on the ground counts at a raised objective, with range measured from the edge of the deck the
    objective stands on. Taken. Patch: `f5a/lab/p2/patches/h3b-undermine.diff`.
  - The Aerie's swing (15 to 30 points stronger on fortified) is the fortified set's zone ramparts: every army's
    walkers lose time leaving their own zone and fliers do not. The Aerie is caught and killed less there. It is
    not decks, objective control, cover, the head start or the AI's taste for high ground.
  - No Aerie-side movement rule narrowed it (a toll for crossing walls, fewer units flying). All dropped.
  - The same ramparts are what keep the two original races even on fortified boards: removing them moves that
    pair by 9 to 13 points. So terrain and the older races' AI stay out of F5a. This is recorded here for the
    roadmap; it is not yet written into `ROADMAP.md`.
  - The Aerie's strength grows with board size, and price moves it steeply (about 11 points per 10 percent at
    Field).
- **Phase 4, in progress:** price the new races by terrain set as well as by size. The set is chosen on the
  setup screen before lists are built, so the price can be shown honestly. The mechanism is written in the
  scratch copy and proven to leave battles identical with no entries. First factors, solved from earlier data
  only: Aerie fliers about 0.95 and 1.10 at Skirmish (classic, fortified), 1.07 and 1.23 at Field, and about 2.0
  at Grand. The fit runs were stopped at 12 of 60 cells, and those cells' battle data was not carried over, so
  the fit starts again. Seed 8888 is unused and reserved for the judgment.
- **Decisions the next session owns:**
  - Whether a Grand price of twice the Skirmish price is sane, or whether Grand needs a list rule for fliers
    instead.
  - Preset lists break under surcharges (the Aerie's presets go over the points limit); a preset must be legal
    on every set it can be fought on.
  - HOME is the binding target (the owner's answer above). EVEN is still worth reporting beside it.
- **Then the build, in `wt/f5a`:** H3b with its scene in the property checks, the set-price mechanism (cost
  lookup, mission validation, the muster and card showing the right price, data-check), the price data and
  presets, each race's terrain trait said on the Muster rows and the unit cards (what it crosses, what stops it,
  where it is at home), docs, `races/` recorded again, the sweep, reviews, fixes, the units wording, gallery
  entry, pull request.

## Questions for the owner

Answered at the handoff:
- **Even everywhere, or home terrain?** "approximately even but some terrain will be handled better by certain
  races". HOME binds.
- **The design-bible report:** commit it. Done; see the next section.
- **The battlefield commit's run-on subject:** left to the session. Decided: leave it, merge normally.

Still open:
1. The report's own questions two to six: may the two original races gain counters to fliers and burrowers
   (that moves their proven balance and the recorded battles); is "anything solid on the table is a rules piece"
   the rule, and does the landscape direction stand; whose world each board is and whether the tail is explicitly
   a Bushtail's; whether the default newcomer reads hit, wound and save; whether to prototype the three-battle
   March and labelled AI handicaps.
2. The rules numbers that are not round (blast templates, base sizes), listed above.

## Work item: apply the design-bible report

The report is `packages/tails-and-scales/DESIGN-BIBLE-NOTES.md` on main (pull request 92), with a status table
dated 19 November 2026. Most of it has **not** been applied. Nothing from it is in `ROADMAP.md` yet, so the first
step is to turn what the owner wants into roadmap items.

| # | Recommendation | Status at the handoff |
|---|---|---|
| 1 | Define "balanced" per size and terrain set | Partly: the owner has decided and the lab judges per cell. Not in ROADMAP, not gated per cell in army-sim. |
| 2 | Plot board measurements against win rates | Partly: done once by hand for the new races. No standing per-seed logging. |
| 3 | Audit how the AI plays the new modes | Partly: swarm fights, perching and charges were measured. No choice-frequency table, free-loop counter or degenerate bots. |
| 4 | Playtest F5a with strangers; log human battles | Not done |
| 5 | A Threats overlay (where can I be shot or charged next turn) | Not done |
| 6 | A seeded dressing layer with a no-touch check | Built on `wt/world`; the browser half of its check has never run |
| 7 | One identity per board | Built on `wt/world`, unseen; the board name is not on screen |
| 8 | An after-action report | Not done |
| 9 | A live projected score | Not done |
| 10 | A plain-verdict odds tip, and tips for the rule-breakers | Not done |
| | A labelled AI points handicap | Not done |

Smaller points from its three "in progress" sections that were also left out:
- **Units:** distances still print one decimal (the report says whole or half tails by default); nothing says
  in-world whose tail it is; no tail ticks on the range rings.
- **Battlefields:** no per-piece tint and lean, no two-line history per board; camps, objectives and moving light
  are planned slices, not built.
- **Balance:** no free-loop audit, no count of objective turns held by a unit nobody could charge, no second
  terrain-independent hook per mode, no luck measurement, no mode by terrain by hazard test matrix.
- **Bigger bets:** the three-battle March, drills, and the board shown at Muster in every mode. None started.

Suggested order once the three streams have merged: 9 and 10 (small, and they help every new player), then 5
(it matters most for burrowers and fliers, so it pairs with F5a), then 8, then 4 before F5a's prices are called
final.

## Running the checks on another machine

- The streams lived in git worktrees beside the main checkout (`../vibe-dump-wt/units`, `world`, `f5a`), each
  with an untracked `node_modules` symlink to the main checkout's. Never stage that symlink. Recreate with
  `git worktree add ../vibe-dump-wt/units wt/units`, and so on.
- Install with `npm ci` from the lockfile. The old session's rule was never to run `npm install`, so the
  lockfile never moved by accident.
- Checks are `node sim/<name>.mjs` from the package directory; build with `npx vite build` there (the output
  `dist/` in the package is ignored). `node sim/parity.mjs` is the quick gate (97 battles on main, about a
  minute).
- Browser checks read `CHROMIUM_PATH` when set and otherwise use Playwright's own Chromium. They pass
  `--use-gl=angle --use-angle=swiftshader` on purpose: keep software rendering so pixel comparisons stay stable.
- On the old 4-core box the long ones were: `input-check` about an hour, `parity --browser` 35 minutes,
  `present-check --self-test` 33 minutes, `title-shot` 18 minutes. Only one browser check ran at a time, and
  timing checks (`render-bench`, `scale-bench`, `fold-cost`) need a quiet machine. `f5a/sweep/summary.txt` is a
  full list of the standing checks with times.
- `units/c.sh`, `n.sh`, `cpus2.cjs` and `realtmp.cjs` are the old box's lane scripts (a short temp path for
  Chromium, a narrower worker pool, a log line per run). They are examples; a normal machine needs none of
  the workarounds.
- Every absolute path in these files that starts `/tmp/claude-0/.../scratchpad/` or `/home/user/` is from the
  old container. The file it names is in this folder under the same relative path, unless it was large: battle
  data, logs, screenshots, builds and package copies were left behind and can be regenerated.

## Known misses on main, and other carried items

- `snap-check`: over-stale, collapse-hangs and shudder-holds rows; `lobby-rig`: the no-relog row.
- `army-sim`: the Skirmish Trebuchet gate at seed 1111 and the keg gates; at Field, the Scaleguard and Brute
  misses.
- Roadmap candidates raised and not yet written down: the AI standing its front rows on its own ramparts, for
  every race; the fortified set's zone ramparts as a balance factor. (The Grand rebalance for the original pair
  is already an open item in `ROADMAP.md`.)
- After F5a: F5b and F9d on the roadmap.

## What is in this folder

| Path | Contents |
|---|---|
| `units/` | `STATE.md`, `scope.md` (the code-surface map and style decisions), `summary.txt` (every check run), `shots.mjs`, lane scripts |
| `world/` | `STATE.md`, `plan.md` (art direction and slices), `inventory.md`, the shooting scripts, `pairs/` (four before-and-after images) |
| `f5a/lab/` | `STATE.md`, `notebook.md`, `diagnosis.md`, `phase2.md`, `phase3.md`, every lab script, `p2/patches/` |
| `f5a/prices/` | the earlier price fitting: `rounds.md` and the Q31 probes |
| `f5a/sweep/` | `summary.txt`, the as-built notes, lane scripts |
| `f5a/build-workflow.js` | the build's prompts, for reference |
| `f5a/uncommitted-property-aggressive.diff` | the untested edit left in the F5a work tree |
| `bible/` | the report as first delivered (the copy on main is the one to keep) and the game brief written for its readers |
