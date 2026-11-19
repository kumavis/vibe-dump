# Tails & Scales: from inches to tails (scope, read-only)

Tree: packages/tails-and-scales at 681fcf5. All paths below are relative to that package.
Every site was found by grep plus an AST scan of every .js/.mjs string, template and regex literal
(the scanner is scratchpad/units/scan.mjs, its raw output scratchpad/units/marks.tsv). proto/, dist/
and sim/baselines/ were left out.
Owner's decision (from the PM, mid-task): the unit is the **tail**, plural **tails**. The name table
from item 4 is dropped.

Kinds: (a) an inch mark after a number or a dice expression, (b) the word inch/inches,
(c) a unit implied in prose. "Seen" = a player sees it; "dev" = only a developer or a bad URL/data.

## 1. Where a unit of length is named in code and copy

### core/ (13 player-facing sites, 4 of them traced)
| site | string | seen | kind | reaches |
|---|---|---|---|---|
| core/actions/move.js:347 | `<b>X</b> move|advance|fall back ${L.toFixed(1)}".` | log | a | **trace + written** |
| core/actions/move.js:363 | same, long hull | log | a | **trace + written** |
| core/actions/move.js:380 | `<b>X</b> advance: +${r[0]}".` | log | a | **trace + written** |
| core/actions/transport.js:190 | `<b>X</b> board the V (${L.toFixed(1)}").` | log | a | **trace + written** |
| core/actions/move.js:377 | dice note `+${r[0]}"` | tray | a | G.out only |
| core/actions/charge.js:249 | dice label `Charge ${plan.need}" (2D6)` | tray | a | G.out only |
| core/actions/charge.js:255 | `Charge ${plan.need}" rolled again (2D6)` | tray | a | G.out only |
| core/actions/shoot.js:359 | scatter note `${sc}"` | tray | a | G.out only |
| core/actions/shoot.js:191 | `out of range (${range.toFixed(1)}" / ${w.range}")` | tooltip `✖ …` (input/tools/shoot.js:34,41) | a | legal() why, local |
| core/actions/shoot.js:197 | same with the lobbed reach | tooltip | a | local |
| core/actions/transport.js:123 | `X's bases are too large for the V (${base}" over its ${maxBase}")` | refusal | a | local |
| core/commands.js:399, :400 | `the charge can't end on cell c (rolled ${P.rolled}")` | dev (bad command) | a | local |
| core/nav.js:892 | `hullReach: … in ${fp.cell}" cells, the grid's ${this.cell}"` | dev throw | a | – |
| core/rules.js:12, :18 | comments "Distances are inches", ENGAGE "inches" | – | b | – |
No `log()` call elsewhere carries a distance (grep of every `log(G` with a number interpolated).

### data/ (3 player sites)
| site | string | seen | kind |
|---|---|---|---|
| data/races/squirrel.js:37 | Grenadiers `'Blast — lobs 2 templates; a miss scatters D6+1".'` | card | a |
| data/races/squirrel.js:79 | Elder `` `Grey whiskers — friends within ${AURA}" use his Ld 9.` `` | card | a |
| data/races/serpent.js:68 | Hierophant `` `Coiled will — friends within ${AURA}" use her Ld 9.` `` | card | a |
| data/races/serpent.js:135 | Howdah "they step off at its head or **tail**" | card | name collision (anatomy) |
| data/mission.js:302, :303, :320 | mission refusals ("even whole numbers of inches", `zone ${deploy}" deep leaves under 6"…`, `less than 1" inside`) | dev | b, a |
| data/schema.js:255, :258, :261, :263 | footprint refusals (`toFixed(3)}"`) | dev | a |
| data/schema.js:264, :265 | "turn is the inches a 45° pivot costs", "per inch" | dev | b |
| data/races/*.js comments | 32 marks/words in comments | – | – |
The races' other numbers are bare data (`range: 18`, `blast: 1.6`, `base: 0.32`); the card adds the mark.

### present/ (10)
present/conditions.js:65 (the helper `inches(n)` → `${+(+n).toFixed(1)}"`), :76 (tip "An enemy is within 1": …"),
:91 (`ran ${inches(advRoll)} farther` / `'a D6" farther'`), :186 (`High ground, ${inches(y)} up`, `Advanced +${advRoll}"`),
:243 (`advanced +${advRoll}"`); present/hud-model.js:159 (`Advance (+D6") — can still charge`), :168
(`Charge! Rolled ${rolled}" — click…`), :188 (`click a friend within ${w.range}"`), :195 (`Click an enemy within 12" …`),
:232 (`a ${w.blast}" template under the enemy`). All seen, kind a.

### input/ (7)
input/human.js:833 (`⤒ Board X · ${L.toFixed(1)}" of ${max}"`), :851 (`End charge here · ${d.toFixed(1)}" of ${rolled}"`);
input/tools/charge.js:11 (`✖ out of charge range (${gap.toFixed(1)}")`), :13 (`Charge: need ${need}" on 2D6 — N%`);
input/tools/move.js:49 (`${d}" of ${max}" (${up}" climbing) · as far as it goes`), :173 (`${turn}" turning`),
:174 (`${L}" of ${max}" (…)`). All tooltips, kind a.

### ui/ (17)
ui/card.js:51 (stat M `${t.M}"`), :54-:57 (four spell lines `spell N+ · ${range}" · …`), :59 (`${w.range}"`),
:61 (`blast ${w.blast}" ×${shots}`), :165 (`▲ high ground, ${y.toFixed(1)}" up`);
ui/tooltip.js:210, :211 (`${range.toFixed(1)}" / ${w.range}"`), :217 (`template(s) (${w.blast}")`), :220
(`(${w.range}", lobbed down)`), :221 (`${range}" / ${reach}"${lob}`);
ui/actions.js:94 (spell bar title `· ${x.range}" ·`), :95 (`<small>…· ${x.range}"</small>`);
ui/groupbar.js:90 (title "a D6 more **inches**", kind b). All seen.

### view/ (3)
view/overlay.js:311 (ladder text `⤒ ${2h}"`), view/units.js:894 (label `▲<i>${labelY}"</i>`),
view/effects/shots.js:139 (floating `scatter ${d}"`). Minimap: no unit text (view/minimap.js:139 is a comment).
view/terrain.js:1725 is a dev throw (`toFixed(4)}"`).

### app/, match/, net/, style.css, package.json
app/: none (every `"` there is a quotation). match/, net/: none. style.css: no `content:` string with a unit
(2 comments). package.json gallery description names no unit: no change.

### index.html (help screen: 23 marks, 3 words, all seen)
:123 (`within 1"`, `D6"`), :125 (`within 12"`, `within 1"` ×3), :127 (`within 6"`), :132 (`D6+1"`), :134 (keg `3"`),
:135 (`its 3" blast`), :139 (Elder row: `18"`, `2.4"`, `12"`, `18"`), :140 (Hierophant row: `18"`, `12"`, `18"`, `3"`),
:142 (Lobbing: `36"`, `37.9"`, `2"`, `33.9"`, and "the shot's **inches**"), :157 ("the path and **inches**"),
:163 ("the path and **inches**"), :172 (`within 3"`). Kind (c) prose with no unit: none found ("within 6 of" does not occur).

### sim/ checks that assert on such strings (fail on a rename)
| site | what it pins |
|---|---|
| sim/present-check.mjs:898 | dice label `/^Charge \d+" \(2D6\)$/` |
| sim/present-check.mjs:958 | log html `/… (move|advance|fall back) (\d+\.\d)"\.$/` |
| sim/present-check.mjs:964 | log html `/… advance: \+(\d)"\.$/` |
| sim/property.mjs:4228 | `/^Charge \d+" rolled again \(2D6\)$/` |
| sim/property.mjs:6186 | **self-test anchor**: shoot.js's `out of range (…" / …")` line verbatim |
| sim/property.mjs:6364 | **self-test anchor**: transport.js:123's line verbatim |
| sim/hud-check.mjs:230, :234 | tooltip `/(\d+\.\d)" of (\d+)" \((\d+\.\d)" climbing\)/` |
| sim/hud-check.mjs:599 | hint starts `Charge! Rolled ${rolled}"` |
| sim/input-check.mjs:1433 | `/^⤒ Board War-Cart · \d+\.\d" of \d+"$/` |
| sim/input-check.mjs:1893, :1981 | aim tooltip `/" of /` |
| sim/input-check.mjs:2837, :3080 | deck tooltip built as `${range}" / ${reach}"` |
| sim/input-check.mjs:2245-2251 (tips lane, Node half) | each condition tip: its title, 1-2 sentences by `/[.!?](?=\s|$)/`, ≤300 chars. A mark with a full stop would count as a sentence; the word adds length (still far under 300). The Chromium half compares the DOM with `tipOf`, so it follows the change by itself. |
| sim/play-check.mjs:344 | `/"\s*of/` decides a move tooltip showed; a rename makes the lane quietly play no moves |
| sim/data-check.mjs:§1 (lines 349-370) | the Grenadiers' abilities deep-equal the R0 legacy text (see §2) |
| sim/data-check.mjs:866-868 | mission refusals `/zone 15" deep/`, `/zone 0" deep/`, `/less than 1" inside/` (only if mission.js is reworded) |
| sim/data-check.mjs:2038, :2040 | schema refusals "the inches a 45° pivot costs", "per inch" (only if schema.js is reworded) |
| sim/fog-check.mjs:171, :174, :175 | hand-built event fixtures (`move 5.7".`, `Charge 6" (2D6)`, `advance: +3".`). Synthetic input, so they don't fail, but they go stale: update them. |
| sim/corpus.mjs:201 | `' advance: +'`: carries no mark, safe |
hud-check's other tooltip asserts, ui-check, macro-check, replay-check, self-test.mjs and mutation.mjs: no
assert on a unit string. self-test and mutation have no anchor holding a mark. Around 400 other `"` uses in
sim/ are the checks' own messages and comments; renaming them is optional.

## 2. What is traced, hashed or pinned

- **Trace** (core/journal.js:37-51). `log()` calls `traceLog`, which writes `log <side> <text without markup> rng:…`.
  The four log sites above (move.js:347, :363, :380; transport.js:190) are the only marked strings in the
  trace. State lines (`traceState`) print positions and wounds, never text.
- **Battle-log stream (`written`)**. Each `log` event is stored as `@<trace length> <cls>: <html>`
  (sim/oracle/shadow.mjs header), so the same four lines are there too, with their markup.
- **Shadow** (sim/oracle/shadow.mjs shadowString). Turn, units, chunks and rng. No text, so it is
  **unchanged**.
- **stateHash / shadowState** (core/hash.js). They leave the journal out explicitly, so they are **unchanged**.
  data-check §10's PINNED hashes and property's PINNED_UNDER still hold, and no CORE_VERSION bump is
  forced.
- **RULES_ID** (core/version.js). `abilities` is in PRESENTATION and CONSTANTS is an explicit list, so a new
  `LENGTH` export in rules.js and every copy edit leave it unmoved. data-check §5 already asserts that ability
  text does not move it (data-check:618).
- **G.out only** (presentation events, never hashed): the dice labels and notes (charge.js:249, :255;
  shoot.js:359; move.js:377), the hints, the tooltips and the refusal whys. They are pinned only by the
  checks listed in §1.
- **The corpus** has 97 battles: pairs.json 24, plus army 6, fort 10, hull 6, human 18, keg 3, pilot 4, powder 2,
  scale 14, vehicle 10. Each battle stores `trace`, `shadow` and `written` as **per-line** 10-hex sha256
  prefixes (sim/lib.mjs:54 hashLines; verdict at :149). Expect every battle to fail parity, because every one
  moves a unit. Within each battle only the `log … move|advance|fall back|board` lines and their `written`
  echoes differ.
- **data-check §1** (sim/data-check.mjs:349-370) deep-equals each legacy unit's normalised record, `abilities`
  included, to the R0 `rules.js` (LEGACY_REF cacf5f5). The casters' abilities are swapped for the legacy text
  before the compare (`spells ? {...legacyShaped, abilities: L.abilities}`), so **the Elder's and Hierophant's
  AURA lines are free**. **The Grenadiers' `D6+1"` line fails.** No mechanism exists for a deliberate copy
  change. The precedents are the `cost` and `spells` carve-outs. Proposal: add a small table
  `COPY_SINCE_R0 = { grenadier: [['D6+1"', 'D6+1 tails']] }`, apply it to the legacy record's abilities before
  `expected()`, and comment it as the units rename. Keep the `Sidewind` startsWith test untouched. Then
  §1 still holds every other byte to R0.

### House procedure and the proof
- ROADMAP Standing rules (lines 8-25) say to re-record "only for a change that is *meant* to alter play". This
  change alters no play but does change trace and written hashes, so it needs an **explicit exception from the
  PM**, recorded in DESIGN as a "wording re-record". I found no precedent: every past re-record changed play.
  DESIGN §4.1 rule 8's "the trace format is unchanged" still holds, because the state lines' format does not
  move.
- **CORE_VERSION: no bump.** It versions consensus behaviour and the stateHash format (core/version.js
  header, DESIGN:993). Neither moves. An old-build peer and a new-build peer fold and hash alike, and each
  shows its own wording.
- **Re-record**: `node sim/parity.mjs --record` in Node, in a commit of its own (DESIGN:1816). Then move
  sim/oracle/PIN's first line to that code's commit in the same push, and `node sim/parity.mjs --pin` must
  pass. Then `--browser` checks it. pairs.json `engines` stays as is (it is v22.22.0 here).
- **Proof (proposed): only the wording moved.** It needs no PIN run.
  1. `node sim/parity.mjs --dump <dir>` on the new code, before recording.
  2. A one-off script over each battle, checked against the *old* committed JSON:
     - `n` is equal, and the `shadow` string is byte-identical;
     - for every trace line i, either h10(new[i]) equals old[i], or new[i] starts with `log `, contains the unit,
       and h10(invert(new[i])) equals old[i];
     - the same rule for `written`;
     - here invert is the exact inverse wording map, e.g. `/(\d) tails?\b/g → '$1"'` (plus `(\d)t\b` if the mark
       ever reached a log line, which it should not).
  3. Report per battle: lines changed, all `log` lines, every state line and shadow identical, every changed
     line reproduces the old hash after inversion. This proves that every die, position and result is the
     same. The map must be injective: today no log line has a digit followed by " tail" (checked by grep).
     The Howdah's "head or tail" is ability copy, not a log line.
  4. Keep the script in sim/ (e.g. sim/wording-proof.mjs) for F5a's turn, or attach it to the commit message.

## 3. Awkward numbers

**Rules data** (out of scope; report to the owner, because changing them changes how battles play):
- Blast templates: Blasting acorns 1.6 (squirrel.js:35), Venom lobber 1.6 (serpent.js:131), Thornburst 2.4
  (squirrel.js:74), Acid globe 2.6 (serpent.js:53). Shown on the card (card.js:61), the tooltip (tooltip.js:217),
  the HUD (hud-model.js:232) and the help (index.html:139). Venom Mist, the Trebuchet and the keg are 3.
- Base sizes 0.3, 0.32, 0.34, 0.42, 0.45, 0.95, 1.05, 1.25 and 1.5, and the transports' maxBase 0.45. Seen only in the
  boarding refusal at transport.js:123 ("0.95" over its 0.45""), which shows two decimals.
- Not shown, so no player impact: deck radius 1.4/1.6, deckY 0.7/1.65, HIGH_GROUND/STEP 0.4, HIGH 1.2, CLIMB_R 1.22,
  PIVOT_S 0.5, the Howdah's footprint turn 0.25, the nav cell 0.5.
- Whole numbers already: moves 3-14, ranges 8-36, ENGAGE 1, CHARGE 12, AURA 6, OBJECTIVE 3, board 40×28 (deploy 8),
  scatter D6+1.

**Display formats** (fix in scope):
- transport.js:123: drop the numbers ("its bases are too large for the War-Cart's deck"). Or keep them,
  since they are rules data. Recommend dropping: it also clears property.mjs:6364's anchor wording.
- Every measured display is already ≤ 1 decimal: toFixed(1) in move/charge/board/shoot/tooltip/card, conditions' `+(+n).toFixed(1)`,
  view/units labelY to a tenth, overlay 2h toFixed(1). Integers are printed raw (need, rolled, advRoll, scatter, range, max).
  The help's Lobbing numbers 37.9 and 33.9 are derived and show one decimal, so they are fine.
- Dev-only long floats (no change): data/schema.js:255-263 toFixed(3), view/terrain.js:1725 toFixed(4), ?debug's perf/minimap
  toFixed(2) (no unit).
- Proposed guard: one shared formatter (below) that never prints more than one decimal, and a copy lint.

## 4. Style

- **Mark: a lowercase `t` straight after the number** (`18t`, `6.3t`, `+3t`). Toughness is always a capital T
  *before* its number (`T3`), and the mark is always lowercase and *after* it, so `M 6t … T3` stays unambiguous.
  The mark carries no full stop (the tips lane counts `.` as a sentence end). Second choice if the PM dislikes
  the single letter: `tl` (`18tl`).
- **Full word** in prose and in anything read as a sentence: battle-log lines ("Nutkin move 6.3 tails.", "advance:
  +3 tails.", "board the War-Cart (2.1 tails)."), abilities ("friends within 6 tails", "scatters D6+1 tails"), condition tips,
  hints ("Click an enemy within 12 tails…", "Charge! Rolled 7 tails…"), refusals, and help prose including the
  spell rows ("Thornburst (6+, 18 tails): … a 2.4-tail template"). After a dice expression, always use the word
  ("+D6 tails", never "D6t").
- **Mark** where space is tight or numbers are paired: dice tray labels and notes ("Charge 7t (2D6)", "+3t", "4t"),
  tooltips ("4.2t of 7t (1.2t climbing)", "14.2t / 12t", "⤒ Board War-Cart · 4.2t of 7t"), floating 3D text
  ("scatter 4t", "⤒ 2.4t"), unit labels ("▲2.2t"), the card's stat M ("6t"), its weapon lines ("18t · A2 · S3",
  "blast 1.6t ×2", "spell 7+ · 18t · …") and the spell bar's small line. The minimap needs none.
- **Singular and plural**: "tail" only when the printed number is exactly `1` ("within 1 tail", "+1 tail"). Every
  other number is plural: "0.5 tails", "1.0 tails" (a measured distance always prints a decimal), "12 tails". The
  mark never inflects.
- **Collisions**: the title "Tails & Scales", the race "Bushtail Clans" and the Howdah's anatomical "head or tail"
  (serpent.js:135). Reword the last to "front or back" or "at either end", so "tail" means only the unit in copy.
  Also present/pace.js has a local variable `tail` (code only).
- **Single source of truth**: `core/rules.js`, beside the table constants it measures:
  `export const LENGTH = Object.freeze({ one: 'tail', many: 'tails', mark: 't' })`, plus two pure helpers there:
  `tails(n)` → `"1 tail"` / `"6.3 tails"` (≤ 1 decimal, `+(+n).toFixed(1)`), and `tl(n)` → `"6.3t"`.
  Why rules.js: every layer may import it. boundaries.mjs puts rules.js on the core, data, present and view/input/ui/app
  surfaces, minus d6 and roll. data/races already import AURA from it. sim imports anything. It is not
  in RULES_ID's CONSTANTS, so it is presentation. It must be frozen (data-check §6). Not
  `core/units.js`, a name already taken. present/conditions.js's `inches()` becomes a re-export or is deleted.
  index.html is static: write the help by hand in the house style, and add a **copy lint** row to
  sim/boundaries.mjs, which already reads every file. It fails on `\d"`, `D6"` or `\binch` in a string literal or in
  index.html's text, so a stray mark can't come back. The lint gets a `--self-test` plant.
  Checks read the helpers (e.g. `new RegExp(\`of \\d+${LENGTH.mark}\`)`) instead of hard-coding the word.

## 5. Documents and comments
- Counts on main: **DESIGN.md 552 marks on 260 lines, plus 36 "inch(es)"; ROADMAP.md 50 marks on 32 lines, plus 4.**
  That is about 640, not thousands. On wt/f5a: DESIGN 563 and 37, ROADMAP 50 and 4.
- Code comments: core 199, data 32, present 40, view 67, input 37, ui 11, app 2, match 1, sim 212 (marks plus words).
- **Recommended now**: a short "Units" section in DESIGN §0 and a ROADMAP Standing rule. It says the table's unit
  is the tail; one world unit is one tail; every length in this document, the code and its comments written
  with `"` or "inch" before this change means tails, one for one; new text uses the word or `t`; LENGTH lives in
  core/rules.js. Also fix core/rules.js:12's header comment. A sweep of DESIGN and ROADMAP would collide with
  F5a's heavy edits for no player benefit, so leave them. Run a mechanical sweep later, after F5a has merged,
  as its own commit (`sed` of `(\d)"` → `\1t` in prose and comments), reviewed by diff, with no code
  change.

## 6. Staging plan
1. **Decide** (PM): the mark, the wording table above, the wording re-record exception, the Howdah reword, the
   transport refusal.
2. **Code, one commit.** core/rules.js LENGTH and helpers; core 13 sites; data 3 abilities, plus the Howdah line,
   plus the optional dev refusals; present 10; input 7; ui 17; view 3; index.html 26; data-check's
   COPY_SINCE_R0; sim asserts (present-check 3, property 1 plus 2 anchors, hud-check 2, input-check 5, play-check 1,
   fog fixtures 3, data-check 866-868 and 2038-2040 if those texts move); the boundaries copy lint with a self-test.
   About 80 string sites and 20 check sites.
3. **Node gates** (quick): boundaries and flag-lint (each with --self-test), data-check, present-check (with
   --self-test), property and its anchors, self-test, mutation and --core, replay-check, merge-sim, fog-check. Then parity:
   the expected failures only.
4. **Re-record and proof, a commit of its own.** `parity --dump` → the proof script (§2), which must pass for all
   97 battles → `parity --record` → PIN moved → `parity` and `parity --pin` pass. Compute: about 3 Node corpus
   passes (minutes each on a quiet machine).
5. **Chromium**: `parity --browser`; input-check (default, `--only aim`, `--only tips`, `--carts`, `--hulls`);
   hud-check; play-check; ui-check and macro-check (the strings grow, so check the 360 px layout and the spell bar's
   `<small>`). Tens of minutes. Argued out because none reads text or unit strings: perturb, dmath-check, fold-cost,
   scale-check, scale-bench, render-bench, camera-check, terrain-check, mirror-check, bake-check, peers, net-check,
   bundle-check, rematch-check, undo-check, and property's hour-long --self-test beyond the two anchors (run only
   the anchor mutants if it allows `--only`). Then `npm run build`, `npm run verify`, and commit dist/. Thumbnail:
   no re-shoot (no unit text in frame).
6. **F5a** (wt/f5a: bird.js, insect.js, the help rows for the new spells, the races/ corpus set, CORE_VERSION 17).
   F5a is 9 commits ahead of a base that is 162 behind 681fcf5. When it merges this change, it must: give its
   two races' abilities the word (bird.js:104, insect.js:118: the casters' AURA lines, which §1 exempts, plus any
   other `"`); word its help rows; pass the copy lint; re-record **races/** (and anything its CORE_VERSION 17 change
   already re-records) with the same proof script; and add its own Units notes. The order matters. If F5a lands
   first, this change re-records 97 battles plus races/ in one pass, which is simplest. If this lands first,
   F5a re-records races/ for the wording within its own re-record.

## 7. Open decisions (with recommendations)
1. The mark: **`t`** (rec.) or `tl`.
2. Is a wording-only re-record allowed under the parity rule? **Yes, as a named exception, with the proof script and no
   CORE_VERSION bump.**
3. Order against F5a: **after F5a merges** (one re-record, no rework on the branch), unless F5a is more than about a week out.
4. data-check §1: **a COPY_SINCE_R0 allowance for the Grenadiers' line**, rather than leaving R0's `D6+1"`.
5. The Howdah's "head or tail": **reword it** ("at either end").
6. The boarding refusal's 0.95 and 0.45: **drop the numbers**.
7. Blast templates 1.6, 2.4 and 2.6 are rules data: **report them to the owner** as the remaining non-round defined numbers.
   Any change goes through RULES_ID and a play re-record, outside this change.
8. Docs: **a Units section now**, and a mechanical sweep after F5a. Comments: the same note covers them, plus
   rules.js:12 fixed now.
9. The copy lint: **add it** (boundaries.mjs plus a self-test) so no mark creeps back.
10. Dev-only refusals (schema.js, mission.js, nav.js, terrain.js): **reword them to tails for consistency**. It is
   cheap, and data-check 866-868 and 2038-2040 follow.
