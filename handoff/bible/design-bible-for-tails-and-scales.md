# What the Roguelike Design Bible means for Tails & Scales

## The short answer

The handbook distils 311 talks about single-player roguelikes. Tails & Scales is a two-player, one-battle wargame, so permadeath, meta-progression, hidden rules and "broken on purpose" builds don't apply. The craft underneath does: readable threats, balance by situation, measuring a generator's output, dressing kept apart from layout, and stories sifted from the log. The game already has the hard parts (deterministic core, odds tooltips, replays). For the work in progress, the handbook says four things:

1. Decide what "balanced" means for each board size and terrain set, and measure each board rather than averages.
2. Check that the AI uses fliers and burrowers the way people will, because the prices come from the AI.
3. Build the lived-in world as a seeded, view-only layer, with one identity per board and nothing on the table that looks like cover unless it is cover.
4. Paint the enemy's threat zones, because burrowers and fliers make that danger unreadable from the table.

## Top recommendations

Ranked by value against effort.

**1. Define "balanced" and gate every size × set cell. (S; feeds new-race balance)**
Write a target into ROADMAP before F5a's prices are fitted, for example each pairing at 45-55% per size and never outside 35-65% on any terrain set. Have army-sim gate each cell and report the spread between a race's best and worst cell.
- *Why:* decide the experience you are tuning for before you simulate (ch. 03, Decide what balanced means first; Phenry Ewing 2022). A filter under which only some strategies work splits players (ch. 05, Layers, and active over passive; John Harris 2024).
- *Today:* the gates judge each size over a board mix, so a 50% average can hide a 30/70 fortified Grand.

**2. Plot board measurements against win rates. (M; feeds balance)**
Have the sim log per-seed numbers next to each result: open-ground and cover fraction, longest open lane, fortified pieces and decks, and objective-to-cover distance. Plot the Hive and Aerie win rates against them and inspect the extreme seeds by hand before touching prices.
- *Why:* this is expressive range analysis (ch. 11, Expressive range analysis; Abdelrahman Madkour 2022), and line-of-sight sampling gives an openness measure (ch. 09, Measuring the space; Albert Ford 2020).
- *Today:* nothing links a seed to an outcome.

**3. Audit how the AI plays the new modes. (S-M; feeds balance)**
Add three things to army-sim:
- a choice-frequency table (spells cast, burrows, fly-overs, swoops), treating anything under about 2% as dead;
- a counter for free loops (fliers falling back and acting again, units camping on decks);
- degenerate bots that spam one unit, use only one mode, or hide until the last round.

*Why:* options can be never worth a turn (ch. 06, Turns are a resource you forgot you had; Dylan White 2021). Free actions breed degenerate play (ch. 06; Nicholas Feinberg 2016). If a dumb bot can win, the design is broken (ch. 03, Three converging methods; Jon Perry 2025). An automated player plays unlike a human (ch. 15, Let a machine play the game; Lachlan Kingsford 2026).

*Today:* a price fitted over an AI blind spot prices the blind spot; "fliers dominate Grand" may partly be the AI's flier role.

**4. Playtest F5a with strangers before prices freeze, and log human battles. (S, then M; feeds balance)**
Run 3-5 testers against written hypotheses ("players can predict where a burrower surfaces"), including wargame newcomers on a phone, noting every question asked twice (ch. 13, Listen for the recurring question; Caelyn Sandel 2020). Then record every human battle so the price fit can be checked against people.
- *Why:* rounds of 3-5 testers around one hypothesis, each round shipping a change (ch. 16, Cronin's method; Brian Cronin 2025).
- *Today:* the October playtest produced F12-F19, so this method pays here.

**5. A "Threats" overlay. (M; feeds the new races)**
Add a movement-phase toggle that paints, with `paintReach`, the ground enemies can shoot next turn (move plus range) and, shaded apart, the ground they can likely charge (move plus 2D6, from the odds code). Burrow and fly reach get their own hatch.
- *Why:* designers converge on showing threat zones (ch. 06, Predictable enemies; Tyriq Plummer 2025), before the choice is made (ch. 13, Show the outcome before the commitment; Dylan White 2020).
- *Today:* nothing answers "where will I be hit?". No core change needed.

**6. A seeded dressing layer with a no-touch check. (M; the base of the cinematic work)**
Add `view/dressing.js` after the terrain view: it reads seed, set, chunks, objectives and zones, places nothing the core sees, and draws from hash(board seed, aspect salt, index). A terrain-check row proves chunks, layout draws and rng state are identical with dressing on and off.
- *Why:* keep layout and dressing as separate layers (ch. 09, Practical patterns; Sergio Garces 2022). Hash each value, don't draw it (ch. 11, Don't generate, hash; Andrew Clifton 2020).
- *Today:* `scatterTufts` uses Math.random. Seeding lets peers and replays show the same place.

**7. One identity per board. (M; cinematic)**
Roll a theme from the dressing stream (orchard, quarry, burned hamlet, border keep), correlated with the rules terrain present, and let it set palette, props, backdrop, name and history together. Start with four to eight themes.
- *Why:* a little of everything everywhere makes levels taste the same (ch. 09, Chunkier variation; Rich Wilson 2021). Correlate attributes instead (ch. 10, Vary the higher-level structure; Jason Grinblat 2017).
- *Keep the rules sets plain:* chunkier rules terrain would amplify the swing (ch. 09, Tensions and open questions; Tom Francis 2023).

**8. An after-action report. (M)**
Show VP by round, objective changes, points destroyed per unit, the two or three rolls furthest from their odds, and a few sifted headlines (a last model holding an objective). Each scrubs the replay to that moment.
- *Why:* a post-mortem lets the loser find the decision that lost (ch. 04, The morgue; Quinten Konyn 2025). Events become story only once they are sifted (ch. 12, Output is not story; Max Kreminski 2019).
- *Today:* one sentence plus "Watch the replay".

**9. A live projected score. (S)**
Show "if the round ended now: 2 – 1" and mark each objective as held, contested or open. On End, warn about reachable objectives being left and about units that haven't acted (DESIGN.md computes `end.ready` but doesn't show it).
- *Why:* players fail long loops without seeing them as loops (ch. 04, The long-loop problem; Jeff Lait 2025).

**10. A plain-verdict odds tip, and tips for the rule-breakers. (S-M; feeds the new races)**
Lead with "≈1.2 of 5 slain · in cover" or "charge: 58%" and put the dice chain on an expandable line. Generate keyword and terrain tips from the rules data ("Fly: ignores walls and rough ground"). Name swarm's re-roll, its threshold, and swoop's +S inside the odds.
- *Why:* half of tested players ignored dice notation they couldn't read (ch. 13, Options cost everyone; Thomas Biskup 2019); even veterans miss rule-bending options (ch. 04, Genre literacy; Courtney Liessen 2024).

Also cheap: a labelled AI points handicap; there is no difficulty setting (ch. 03, Hand the dial to the player; Andrew Aversa 2018).

## The three things in progress

### Cinematic battlefields

All of this sits on recommendation 6 and needs no parity re-record.

**Nothing solid-looking on the table that isn't a rules piece.** Every memo agreed on this. Dressing falls into three classes:
- flat decals, which may go anywhere;
- low clutter (under about 0.3"), only on walkable cells and clear of objectives;
- tall props, only inside an existing chunk's footprint or off the mat.

Each prop gets one placement try, redrawn rather than nudged on failure (ch. 09, Furnishing rooms; Pierre Vigier 2022). Dressing fades under rings, rays and the cursor and stays quieter than the figures: what looks meaningful and isn't sends players hunting (ch. 04, Fairness; Plotkin 2026).

**How to dress a board:**
- **Ground every piece.** Give each terrain kind a footprint-shaped decal and debris that thins outward, and move the tufts into these clusters. Props dropped on a plane look like wargame models (ch. 14, Ground the props; Max Bottega 2024). That look is a flaw or the point, depending on the diorama question below.
- **Dress in ordered layers:** paths pathfound with core/nav through objectives and gaps, which also teach the lanes (ch. 09, Noise is not a design; Todd Furmanski 2020); then wear, clutter, ground cover and each race's camp behind its zone, repeats capped (ch. 09, Standout levels and landmarks; Sergio Garces 2022).
- **Place things for a reason:** relationships ("a cart track joins the hedge gaps"), not stamps (ch. 09, Meaning and context; John Harris 2016), and a two-line history rationalised from the board's rubble and keep (ch. 11, Generating histories; Jason Grinblat 2017).
- **Hero pieces at objectives, plain ground between** (ch. 14, Direct the eye; Max Bottega 2024). Keep a plain baseline with a rare tail written as data and checked over 1,000 seeds (ch. 10, Plain backgrounds make the strange stand out; Elliot Trinidad 2023).
- **A place name from per-race morpheme lists** (ch. 10, One generator per culture; Sraëka-Lillian 2021), shown on setup, the log header and replays.
- **Variety.** A per-chunk hash tint and lean so no two hedges match (ch. 14, Shader-driven variety; Alexander Birke and Sofie Kjær Schmidt 2025).
- **Light that tells the clock.** Morning to dusk over the rounds, using stage.js's existing evening state (ch. 12, A thin layer of fiction can sell a mechanic; Aron Pietroń and Michał Ogłoziński 2023).
- **Don't mirror the dressing.** Judge it on real battle screenshots at phone and thumbnail size (00, principle 40; Mike Cook 2026).

### The unit of length

- **Keep tail = 1 inch exactly.** Nothing moves. Rounding any range to suit the unit is a balance change that needs the gates re-run (ch. 03, Small turns of the dial; Dan DiIorio 2025). Show whole or half tails by default, not `14.3"`, because small numbers read as designed (ch. 13; Benjamin Berman 2019).
- **Route every distance through one formatter** (`fmtLen`) and lint against hard-coded inch marks (ch. 15, Text is presentation too; Bucklew and Frang 2026).
- **Decide whose tail it is.** Players read numbers as facts about the world (ch. 12, Every number is a claim; Xalavier Nelson Jr. 2021), so "tail" says the Bushtails measure the world. Say it once in-world, model a Bushtail's tail about one tail long so the figure is a ruler, put tail ticks on rings, and never let the UI wink at the pun (Shepard 2016).

### Balancing the terrain-dependent races

The order: measure, remove exploits, add counters and board fixes, and change prices last.

1. **Set the per-cell target** (rec. 1). The handbook leans towards keeping the swing and balancing by situation, not by shrinking numbers (00, principle 23; Brian Walker 2016). It still draws the line at dominance: if fliers win most Grand battles, every Grand list becomes Aerie.
2. **Find the swing.** Use the seed metrics (rec. 2), plus burrow and fly connectivity rows in terrain-check with broken-board controls (ch. 09, Movement, grids and the systems that touch space; Jonathan Lessard 2018).
3. **Remove free loops** (rec. 3). If falling back is the flier's best move, price it.
4. **Check unanswerable positions.** Count objective turns held by a unit no enemy could charge. A flier on a tower is the map deciding before the dice (ch. 06, Geometry decides the fight; Quinten Konyn 2025). Give every race a common answer to fliers and burrowers (ch. 07, Balance still matters; Gavin Verhey 2024).
5. **Give each mode a second, terrain-independent hook.** A one-hook power dies to one counter (ch. 05, What happens when an element stands alone; Nick McConnell 2021). Decks switch burrowing off, and open ground leaves fliers nothing to fly over.
6. **Then fix the board mix or slot limits, then prices.** Prefer small reach changes (ch. 06, Getting variety from a small roster; Josh Grams 2020).
7. **Measure luck.** Re-fold battles with one die changed and count how often the winner flips. Flatten a dive or emergence roll if it alone decides battles (00, principle 8; Shawn Main 2017). The speakers disagree on how far to smooth.
8. **One rule set for blasts, collapse and cover** (ch. 05, The convergent principle; Tyriq Plummer 2017): is a flier over a keg hit, or a burrowed unit? Add P-height scenes before F5a ships, ideally as a mode × terrain × hazard matrix with one test per cell (ch. 15, How it goes wrong; George Moromisato 2022).
9. **Say the trait:** "strong on open ground" on Muster rows; on each new card, what it crosses, what stops it, what counters it.

## Bigger bets

**A three-battle March against the AI.** Play three Skirmish battles on three seeds. Casualties stay off the next list, and after each win you draft one of three reinforcements under the cap. Survivors keep a name and a tally, never stats.
- *Why:* a roguelike layer needs exclusive power choices, escalating challenge and an end (ch. 18, Distil the target genre's best loop into a run; Shawn Main 2021); loss plus a name gives attachment (ch. 18, Player-imposed permadeath; Stella Vermilion 2026).
- *Cost:* M, all in app/ as setup chaining, with no core change and offline only. Drop it if nobody replays it.

**Drills, not a manual.** Three or four fixed-seed scenarios: cover, a charge, an objective, a blast.
- *Why:* teach up front only what isn't fun to discover (ch. 04, The toolkit; Andrea Roberts 2020), and tip only players who struggle (ch. 04; Andrea Interguglielmi 2019).
- *Cost:* M plus a small corpus of their own, so they never touch the recorded battles.

**Make the board part of the choice.** Show the size and set (or the map) at Muster in every mode, and optionally the sim's AI-vs-AI odds, labelled as such.
- *Why:* hiding what players must plan around reads as unfair luck (ch. 04, Known and unknown; Tringali 2023). Simulation can become a player-facing odds document (ch. 18, Generators and simulation for tabletop; Phenry Ewing 2022).
- *Cost:* S to S-M. The risk is that published odds undercut the balance claim.

## Endorsed already, and what not to borrow

**Already endorsed:** a sealed deterministic core with races as data; undo only within a decision; odds tooltips, rings and rays; setup randomness through mirrored seeds; per-round scoring as the clock; bulk generator checks with real movers; simulation for balance; hazards that hit everyone; new rules as flags; cosmetic randomness off the rules stream.

**Don't borrow:** game-breaking builds (the broken build is the opponent's bad evening); power carried between battles (breaks prices and fairness); hidden rules (a wargame lives on open information); rubber-banding or dynamic difficulty (unfair between humans, exposed by the hashes); generated rules or units (corpus and balance cost); hunger clocks (the round limit does it); live language-model text or learning AI (not deterministic); flavour in the core log (keep it in the view).

## Questions for the owner

1. Is the terrain swing an advertised trait (set shown or chosen at Muster) or a flaw to flatten everywhere? Who picks the set?
2. May the Bushtails and the Coil gain counters to fliers and burrowers, moving their proven balance and the corpus?
3. Diorama or world: does the mat-on-a-table stay, or does the table dissolve into a landscape? Is "anything solid on the table is a rules piece" the rule?
4. Whose world is it: does each board belong to one people and carry a history of their wars, and is the tail explicitly a Bushtail's?
5. Is the default newcomer a wargamer who reads hit, wound and save, or a video-game player? The answer sets the odds-tip default and whether drills earn their own corpus.
6. Prototype the vs-AI March, and add labelled AI handicaps?
