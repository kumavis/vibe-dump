# Tails & Scales: a brief for readers of the design bible

**What it is.** A pocket tabletop wargame played in the browser (Three.js): a 3D table of miniature-style figures, played against an AI, hotseat, or online peer to peer. Package: `packages/tails-and-scales` in this repo. It is not a roguelike: a session is one battle between two armies, with no campaign, no progression between battles and no story beyond names and card copy.

**The peoples.** Two today: the Bushtail Clans (squirrels: quick, many, fond of bombs) and the Coil of Ssithra (serpent-folk). Two more are being built: the Deepdelve Hive (insect-folk: two units burrow under scenery, one swarms) and the Highwind Aerie (bird-folk: most units fly, some dive on the charge). Each race has six unit types (a hero with three spells, troops, elite, fast, monster or artillery) and a transport (War-Cart, Shell-Back Howdah) whose riders shoot from its deck.

**A battle.** Alternating turns; each turn runs phases: move (or advance, or fall back), shoot, charge, fight, morale. Dice are D6s: roll to hit, to wound, to save; 2D6 charges and spell casts; blast templates scatter and blow scenery apart. Victory is by objectives: one point per objective held at each round's end, over 5 to 7 rounds. Sizes: Skirmish (40x28 table, 500-point armies), Field (60x40, 1,000), Grand (80x56, 1,500), plus a powder-keg mission. Armies are built from a points list (the Muster screen) under slot limits, or taken from presets.

**The battlefield.** Generated from a board seed, point-mirrored for fairness. Terrain is rules data: hedges, walls, forests, rocks, rubble, crates (cover, line of sight, rough ground, breakable or not); the fortified set adds ramparts, bastions, a keep, watchtowers and timber platforms climbed by stairs and ladders, and timber platforms collapse; powder kegs explode. Visually the table is a plain ground with those pieces on it and a few props: the owner says it "doesn't sell a rich lived-in world" and wants more cinematic battlefields.

**The interface.** Unit cards, odds tooltips before a shot or charge, range rings, line-of-sight rays, a dice tray, a battle log, a minimap, a rules/help screen, undo within a decision, a phone layout. For big battles: groups, orders, macros and an autopilot. Online play is deterministic lockstep over a shared log with state hashes, with an optional courtesy fog of war; battles can be watched and scrubbed as replays.

**The AI.** A scripted, deterministic opponent: roles per unit type (shooter, melee, line, raider, artillery, hero, transport), scored positions and targets, no learning. It plays both seats in tens of thousands of simulated battles that fit unit prices and judge balance gates.

**Engineering.** A pure deterministic core (seeded RNG, its own deterministic math), a presentation layer mirroring it, and a view. A corpus of about 111 recorded battles is replayed for byte-identical parity in Node and Chromium; property tests and mutation self-tests guard the rules. Changing how any recorded battle plays is expensive, so new rules are added as branches only new units reach.

**What the team is working on now (your memo should speak to these where your chapters do).**
1. **Balance of the two new races.** They swing with terrain: the burrowers are strong on open boards and weak around fortifications; the fliers are the reverse, and dominate large boards.
2. **The unit of length.** Distances are in inches today (ranges are whole numbers: 18, 12, 36; moves 5 to 14). The owner wants an in-universe unit with round numbers and no conversion. Working name: the "tail".
3. **Cinematic battlefields.** A richer, lived-in world on and around the table, without changing the rules terrain.
4. **Later on the roadmap:** the new races' vehicles, siege towers, battlefield hazards. No campaign or run structure is planned yet.

For more: `packages/tails-and-scales/ROADMAP.md` ("Queue", from about line 338) and `DESIGN.md` (about 4,600 lines: search it, do not read it whole).
