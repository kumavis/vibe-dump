# Units rename (inches → tails): state at checkpoint

Branch `wt/units` (worktree /home/user/vibe-dump-wt/units, package packages/tails-and-scales), pushed to origin. Base main 681fcf5c. Tip **bd388055**. Nothing is uncommitted except the untracked `node_modules` symlink, which must never be staged.

## The commits (oldest first)
1. **736fd6c8** "tails-and-scales: distances in tails". The code across every layer and the docs.
   - `LENGTH = { one: 'tail', many: 'tails', mark: 't' }` plus the helpers `tails(n)` (the word) and `tl(n)` (the mark) in core/rules.js. A string argument prints as given; a number prints to at most one decimal; the word is singular only for exactly "1".
   - Every layer's copy reworded with them, and the help screen too.
   - The Howdah's riders now step off "at either end". The boarding refusal no longer prints the base sizes.
   - The developer-only refusals are reworded too.
   - Copy lint: sim/boundaries.mjs rule 5, with 6 `--self-test` plants. It uses rollup's parseAst.
   - data-check §1: the `COPY_SINCE_R0` allowance for the Grenadiers' line.
   - The checks re-anchored on `LENGTH` via `sim/lib.mjs lengthWords`.
   - `sim/wording-proof.mjs` added.
   - Docs: DESIGN's new "Units: the tail" section, just above §0; ROADMAP's new "Units" Standing rule bullet; and a `- [x] **Units: distances in tails**` item at the very end of Done.
2. **45723864** "…the corpus recorded again for the tail's wording, the PIN on 736fd6c". `parity --record`: 74 files and 97 battles, where only the `trace` and `written` fields changed (n and shadow identical, checked by script). sim/oracle/PIN changed from 494ce08 to 736fd6c8. The commit body holds the proof's per-set table.
3. **a2511108** "property's P-spell reads the code's LENGTH". A fix to commit 1's property edit: P-spell's mods had no `rules`, so `mods.rules.LENGTH` threw. spellTask now gets the code dir's rules.js.
4. **bd388055** "input-check's spell bar row reads the mark". The fix for input-check's one failing row (below). **Not yet proven.**

These are five commits counting the gallery entry, not the three that were planned. 3 and 4 are fixes to the checks that turned up during the gates.

## Wording proof (before commit 2, against the corpus as committed at 736fd6c)
`node sim/wording-proof.mjs`: exit 0, 51 s.
- 97 of 97 battles hold.
- 36,708 trace lines. All 17,726 state lines are identical, and all 17,726 shadow snapshots are identical.
- 8,714 of 18,982 log lines were reworded, and 8,714 of 19,721 battle-log writes.
- No other line differed.

By set: pairs 24, human 18, pilot 4, army 6, fort 10, scale 14, keg 3, vehicle 10, powder 2, hull 6. The full table is in commit 2's body and in logs/wording-proof.log.

How the proof works: it reruns the working tree's pure core through the Folder. Each line passes if it matches its recorded hash, or if it is a log line whose `(\d) tails?` put back as `$1"` gives its recorded hash.

## Checks against the tip
Logs are in scratchpad/units/logs/*.log; summary.txt has every run with its exit, time and load.

**Node.** These ran after commit 2. Commits 3 and 4 touch only sim/property.mjs and sim/input-check.mjs, so they don't change these results except where noted.

| Check | Result |
|---|---|
| boundaries | pass (1 s) |
| boundaries --self-test | pass (21 s) |
| flag-lint | pass (0 s) |
| flag-lint --self-test | pass (0 s) |
| data-check | pass (9 s) |
| self-test | pass (26 s) |
| present-check | pass (330 s) |
| present-check --self-test (no-advance-roll, no-charge-result, no-charge-face, no-charge-failed, no-move, walk-speed) | pass (1989 s) |
| property | pass (1027 s), run on commit 3's file |
| property --self-test (ward-anywhere, board-any-base: the two moved anchors) | pass (250 s) |
| replay-check | pass (218 s) |
| merge-sim | pass (443 s) |
| mutation | pass (463 s) |
| mutation --core | pass (106 s) |
| parity | 97/97 (55 s) |
| parity --pin | 97/97 (52 s) |
| parity --page | 97/97 (258 s) |
| fog-check | pass (6 s), run before commit 2 |
| macro-check | pass (47 s), run before commit 2 |
| pilot-check | pass (34 s), run before commit 2 |
| parity before the record | 97/97 differ, as expected, each first at a log line |

Before commit 2, present-check and property failed. That was expected: they hold battles to the corpus. present-check's first run also had a real bug (the card's "advanced +N"" expectation), fixed in commit 1.

**Chromium.** CHROMIUM_PATH=/opt/pw-browsers/chromium, run through the lane script c.sh.

| Check | Result |
|---|---|
| parity --browser | **97/97 pass** (2105 s), on commit 2's code |
| input-check (whole) | **FAIL**, one row (3587 s; details below) |
| input-check --self-test --mutations ring-at-rider,rays-from-ground,deck-unsaid | **not completed**: stopped at the checkpoint while running its unedited base pass |
| hud-check | not yet run |
| hud-check --self-test | not yet run. hud-check has **no --mutations flag**; run plain `--self-test` |
| ui-check | not yet run. Watch the 360 px layout: the Advance button reads "Advance (+D6 tails) — …" |
| play-check | not yet run |
| title-shot --ref 681fcf5c | not yet run |

### input-check
- **Which row:** the caster's spell bar. Every other row passed.
- **The failure:** `FAIL spell 1 on the bar reads {"on":false,"key":"1","name":"Thornburst","small":"6+ · 72% · 18t","line":"a template of 2.4 tails under the enemy, S5 AP-2"}, not key 1, Thornburst, cast 6+ and 18" with a line of what it does`.
- **Why:** sim/input-check.mjs:780 expected `small` to end with ` · ${range}"`. My first scan missed this assertion.
- **The fix:** commit 4 makes it end with ` · ${tl(range)}`, which is exactly what ui/actions.js now renders ("18t").
- **Proven:** no. Run input-check (whole, about 1 h on this box) and its `--self-test` with the mutants above.
- **Other assertions:** I grepped sim/ again for comparisons built with the inch mark and found no others. hud-check's climb regex (230) and its "Charge! Rolled" hint check (603), and ui-check, are already re-anchored but not yet run.

## Still owed before a PR
1. Chromium: input-check (whole) and its --self-test mutants; hud-check and its --self-test; ui-check; play-check; `title-shot --ref 681fcf5c`, which should show 0 pixels changed (the title has no unit text).
2. Screenshots, not taken yet. The script is ready but has never run: scratchpad/units/shots.mjs. Build first (`npx vite build` in the package), then `CHROMIUM_PATH=… node shots.mjs <package>/dist`. It writes these to scratchpad/units/shots/, and each must be looked at before handing over:
   - units-card-blast.png, units-card-ranged.png (the card, with a blast weapon and with a ranged one)
   - units-move-tooltip.png, units-shot-tooltip.png
   - units-help-spells.png
   - units-card-360.png
   - units-dice-charge.png, units-battle-log.png, both from a watched battle: it waits up to 15 min for a "Charge Nt" tray row.
   The script may need small fixes, for example the selectors `#card` and `#tooltip` and the `.spells` help list.
3. The gallery entry commit, under the repo's new convention (CLAUDE.md at the worktree root): build the one app, `npm run assemble:apps -- tails-and-scales`, `npm run verify`, then commit only dist/tails-and-scales. Planned subject: "Rebuild the gallery entry for Tails & Scales (distances in tails)". Never run npm install.
4. The PR itself.

## Decisions I made that you haven't seen
- **Wording choices:**
  - The hint for a blast reads "a template of 1.6 tails under the enemy". The help uses compound adjectives instead ("a 2.4-tail template", "its 3-tail blast", "a 2-tail rampart").
  - The help gained one opening line: "Every distance on the table is measured in tails, written t where room is short: a move of 6t, a range of 18t."
  - Help "the path and inches" became "the path and its length"; "the shot's inches" became "the shot's tooltip".
  - The Advance button reads "Advance (+D6 tails) — …"; the condition tip reads "It ran D6 tails farther".
  - Refusals read "out of range (14.2 / 18 tails)". The footprint refusal reads "turn is what a 45° pivot costs in tails".
  - The card's facts read "advanced +3 tails". The conditions' header reads "Advanced +3 tails" and "High ground, 2.2 tails up". The card's high-ground chip and the unit labels use the mark ("▲ 2.2t").
- **PIN:** set to commit 1 (736fd6c8, the code that produced the hashes), following the house precedent of pinning the code commit.
- **Proof's `--base`:** `sim/wording-proof.mjs` takes `--base <ref>` (the corpus read from another commit), meant for F5a. DESIGN's Units section tells F5a to run `wording-proof --only races` before re-recording races/.
- **Lint memo:** the copy lint caches its results per file text, which brings boundaries --self-test from 48 s to 21 s.
- **Commit 1's body** says present-check and property "follow" the corpus into commit 2. They did, but property also needed fix commit 3.

## Traps on this box (a faster machine will hit them too)
- present-check and property hold battles to the corpus, so they **can't pass between the code commit and the re-record**. Judge them after the record. present-check's fog section fails the same way.
- input-check (whole) takes about an hour, and parity --browser 35 min with PARALLEL=1. The present-check --self-test on 6 mutants took 33 min.
- hud-check's parseArgs is strict and has no `--mutations`, so that line exits 2.
- Editing a lane script while bash is running it doesn't take effect. Write a new script.
- Chromium needs the short TMPDIR trick in c.sh (a /proc/<pid>/fd/9 path held open) plus realtmp.cjs. CHROMIUM_PATH=/opt/pw-browsers/chromium is the binary itself, not a directory. Pass the launch args `--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader`.
- In this tool environment, foreground `sleep` is refused. Wait on a pid with `timeout 590 tail --pid=<pid> -f /dev/null`, with the Bash call's timeout set to 600000.
- The lane scripts (c.sh, n.sh, cpus2.cjs, realtmp.cjs) are in scratchpad/units/. They cd into the units worktree and log to logs/ and summary.txt.
