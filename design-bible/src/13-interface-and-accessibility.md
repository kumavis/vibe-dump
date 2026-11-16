# 13. Interface and accessibility

A roguelike's player meets its rules only through the screen, the keys and the message log. That makes the interface the place where a deep game is either opened up or shut off: whether a newcomer can tell a small dragon from a big one, whether a veteran can move as fast as they think, whether a blind player can play at all. This chapter covers commands and input devices, the cost of options, speed and automation, previews and tooltips, the meaning carried by messages and labels, ways of making large simulations legible, the choice between letters, tiles and symbols, the mechanics of putting them on a screen, and accessibility for blind players, children, parents, newcomers and different minds.

The talks share a through-line. A game's depth should live in its systems, not in the effort it takes to operate them, and the people best placed to tell you where that effort lies are the players you are not. Several speakers learned this from playtests that went badly or from communities whose praise turned out not to speak for everyone. The genre's text heritage turns out to be an advantage here as well as a burden: a game that already describes its world in words is unusually close to being playable without sight.

## In brief

- Interface work is a large part of a roguelike's design, not polish applied at the end: Subset Games spends half or more of its development time on UX, and Angband made itself approachable without making itself easier {{rNi5nO5yqLs#2}} {{eeSk665OXkM#6}}.
- Do not let veterans alone judge your interface: Thomas Biskup found that twenty years of praise for ADOM's UI from power users did not survive contact with Steam, Santiago Zapata argues that competition has raised the bar, and Josh Ge urges importing the conveniences of non-roguelike games {{hnoF_bL-HjI#1}} {{hnoF_bL-HjI#2}} {{wwc7pZqs9UA#9}} {{9se2M27LuOs#11}}.
- Keep the depth in the game logic and the command set small, design the simple interface first and add power-user tools afterwards, and make every action reachable without memorised keys {{hnoF_bL-HjI#6}} {{hnoF_bL-HjI#4}} {{iZUXjbcAfYs#25}} {{9se2M27LuOs#10}}.
- Make movement the main verb and let context decide what a move does, as bump-to-attack, step-on stairs and single-button designs independently show {{R8DSq8qSJ44@32392#3}} {{QBZkvtGucBU#7}} {{Uo9-IcHhq_w#11}}.
- Never make the player wait on animation, and automate decisions that have only one right answer {{xSYVQc7cH-4#6}} {{xSYVQc7cH-4#12}} {{9se2M27LuOs#13}} {{eeSk665OXkM#8}} {{tg-CjNodlmY#2}}.
- Show outcomes before the player commits, and get previews cheaply and exactly by running the real game code on a copy of the game state, which you must design for from the start {{qO3CIpP62Q0#4}} {{jhcHlg7YhPg#11}} {{p48ArjJweSo#9}}.
- For deep simulations, give players instruments for sense-making, such as filters, chronicles, journals and summaries of hidden state, rather than a raw feed of events {{BDcZSWHu8RQ#6}} {{NjIDVIIg1lY#0}} {{D8A9dpITLAU#2}} {{q7E1N-fJnrA#9}}.
- Treat ASCII versus tiles as a trade-off between telling symbols apart and knowing what they mean, and if you add tiles, re-encode every signal the glyphs carried {{UIsNv3UOzvA#7}} {{Xwa1KbXqeGQ#1}} {{UIsNv3UOzvA#4}}.
- A text-based roguelike is unusually close to playable by blind players, but only testing with visually impaired players shows what they need {{e8Itfp3MHQ4#9}} {{e8Itfp3MHQ4#6}}.
- Find the players you are not with cheap simulations and by listening for recurring newcomer questions: unreadable fonts for pre-literate children, sitting further back for older eyes, random button-mashing on menus {{NANqgqeqh2k#8}} {{wPN5bPxWXm8#6}} {{wPN5bPxWXm8#7}} {{wPN5bPxWXm8#5}}.

## The interface is the design: why roguelike UI decides who can play

### Presentation failures look like design failures

A roguelike's rules can be sound and still lose the player, because the player meets the rules only through the screen. Two very different teams make the same point. Erik Osheim and Robert Au describe Angband's ergonomic changes as an attempt to make the game approachable and comfortable for new players without making it any easier. The first of them were on-screen monster and item lists: before them, you could not easily tell whether the detected red `d` five tiles away was a small dragon or a big one, and an item list helps you set goals once objects are detected {{eeSk665OXkM#6}}. Nothing about the game's difficulty changed; what changed was whether you could see the information the game already had.

Justin Ma and Matthew Davis of Subset Games tell the same story at larger scale. Early playtests of Into the Breach were painful because players did not understand what to expect or what to do. Their diagnosis was that the design was fine and the presentation was not; fixes such as animated tooltips made a massive difference, and the biggest lesson was how little people understood of what the developers thought was clear. They estimate that half or more of the development time on their games goes to user experience (UX) {{rNi5nO5yqLs#2}}.

> It wasn't a case of the design being bad, it was a case of the presentation being problematic. {{rNi5nO5yqLs#2}}

If you take one thing from this section, take that budget figure. UX is not a coat of polish applied once the systems are finished; on Subset's games it is, by their estimate, half or more of the work.

### The community bubble

The sharpest warning comes from Thomas Biskup, whose ADOM had nearly twenty years of feedback calling its interface slick and optimised. When the game reached Steam, the reaction was that it was unplayable. Biskup takes the blame for getting caught in the community bubble, which fed decisions that were not good for the game, and draws a blunt conclusion: roguelike communities, however great, are probably the biggest obstacle to mainstream-friendly interfaces {{hnoF_bL-HjI#1}}. The reason is who those communities are. They are dominated by power users, whom Biskup likens to Olympic athletes: they feel every inefficiency, demand optimised tools, endless options and ever more detail, and they argue so well and so confidently that their feedback feels universally valid when it is not {{hnoF_bL-HjI#2}}. What works for them is not what works for casual or mainstream players.

Biskup is candid about the cost in ADOM itself, naming the game's accessibility, with too many hard-to-use commands and a UI cobbled onto a decades-old game, as one of its biggest sins and something very hard to change later {{PTIsUSbQ0TA#2}}. A year earlier Biskup had already listed making ADOM less hard for newcomers who do not know how roguelikes work as the first priority for the game's future, with the graphical interface as the place to do it {{iZUXjbcAfYs#3}}.

### The bar has risen

Several designers who otherwise have little in common converge on the view that the genre can no longer afford its old interfaces. Santiago Zapata argues that roguelikes reaching a wider audience cannot rely on unusable interfaces or mechanics nobody understands, because competition has raised the bar, and sees this as healthy for the genre {{wwc7pZqs9UA#9}}. Slashie, the handle under which Zapata gave a 2026 talk on two decades of their games, calls the longest-running design question in that work how far a traditional roguelike's entry barrier can be lowered, now that players have largely moved to phones, without losing its essence {{R8DSq8qSJ44@32392#2}}. Josh Ge points to Cogmind's player statistics, which show heavy use of the mouse and of tiles: documentation, a tutorial, full mouse support and a tileset greatly widen the audience, though a first game can still be ASCII and keyboard-only, and some of these features need to be in the design from the beginning {{jviNpRGuCIU#19}}. Ge's prescription is to import the standard conveniences of non-roguelike games, such as clicking a stat to learn what it does, as long as the result stays a roguelike {{9se2M27LuOs#11}}. Casey Yano makes the parallel case for digital card games: a computer can explain rules in context, shuffle for you, and clarify rules by enforcing them in code, so the digital version should never feel like a sad substitute for the physical one {{KYlq0Msu6hc#1}}.

### Counterweights

Three things pull against simply modernising. First, conventions are sticky. Tabitha Sable shows that the software people are used to shapes what they want next, so old hardware limits persist for decades: modern editors still offer vi key bindings descended from a terminal without arrow keys {{6ohPU0sECFE#6}}. Biskup accepted this for ADOM's existing players, promising the "old guard" no more groundbreaking overhauls that force them to unlearn what they had learned, while still improving accessibility {{iZUXjbcAfYs#4}}. Changing an interface has a cost for the people already fluent in it.

Second, polish is not the same as speed. John Bond calls polish the luck variable because it affects everything: players accept Persona 5's slow menus because they are so well polished {{bpGRyzWCWwk#6}}. Jeremiah Reid argues that even strategy and resource-management games benefit from juice in buttons and unlocks, since no one can argue their game has enough polish {{xSYVQc7cH-4#19}}. Polish buys tolerance, but it does not excuse an interface that wastes the player's time; the section on speed below sets limits on it.

Third, there is no clean answer. Todd Furmanski says anyone who claims UI is easy is lying: controllers make mundane actions hard to teach, a phone is a flat glass surface, and both too much interface and none at all can be bad. It is a matter of picking your poison {{ST6s_8ekeOg#8}}.

**In practice.** Budget for UX from the first day, and expect it to be a large share of the work {{rNi5nO5yqLs#2}}. Distrust feedback that comes only from veterans, however articulate {{hnoF_bL-HjI#2}}. Separate "harder to operate" from "harder to win" and remove the first without touching the second {{eeSk665OXkM#6}}. And keep Ma and Davis's open question in view: what would a classic roguelike with the best, clearest UI look like? They think it a hard but worthwhile goal; the interviewer recalled user-testing NetHack with students who had never played and finding that cheat sheets were never enough {{rNi5nO5yqLs#10}}.

## Simple surface, deep game: commands, options and detail levels

### Depth in the logic, not in the keys

The genre's strength is intricate mechanics that combine. Biskup's rule is to keep that depth in the game logic and hide it from the interface: a cool action that needs ten key presses will be used by perhaps one player in a thousand, so do not clutter the UI or over-explain how to do the clever things {{hnoF_bL-HjI#6}}.

> Hide the complexity on the UI side. Have it in the game logic, that's wonderful, but not in the user interface. {{hnoF_bL-HjI#6}}

Biskup's numbers for Ultimate ADOM make the argument concrete. ADOM has more than 100 keyboard commands, configuration spread over several files, and mouse support that took twenty years. Ultimate ADOM targets seven keys (WASD, E, F and space), because about 90% of players die within roughly 3,000 turns and never need the power commands; the interface has to be understandable without explanation for those short-lived players, which 100 commands make impossible {{hnoF_bL-HjI#4}}. The order of work matters as much as the count. Ultimate ADOM is designed mobile-first and controller-first, with power-user tools added afterwards, because reducing an already complex interface to simplicity, as ADOM's team had to, is a constant struggle {{iZUXjbcAfYs#25}}. Start simple and add speed for experts; do not start complex and try to subtract.

### Contextual action through movement

The strongest convergence in this section is on one idea: make movement the main verb and let the situation decide what a move means. Independent designers arrived at it, or at the related aim of cutting menus and prompts, from different directions.

- **Movement plus one button.** Slashie traces a line from CastlevaniaRL through a game where skills were first triggered by movement to Rodney and Slashie's later Steam roguelike: streamline the UI and the systems so that depth comes from simple commands and movement, drop redundant or historical commands, and trigger actions by moving or using the space around you instead of through menus {{R8DSq8qSJ44@32392#3}}. In Rodney, as Zapata described it in 2016, you have movement and a single action button, and a wall-jump skill fires when you run into a wall {{TMxzVy7-VYQ#13}}.
- **Bump as the core verb, rare verbs on demand.** George Moromisato explains how NetHack keeps a huge verb set without swamping newcomers: moving, and attacking by bumping, is the key command, and rarer verbs sit in secondary menus. A newcomer just moves and attacks until a closed door or a need to search teaches a new verb; finding a lamp prompts them to look up whether lamps can be rubbed. Diablo takes the other route of a single default click action, so no manual is needed {{QBZkvtGucBU#7}}.
- **Place things so stepping on them means using them.** Brian Walker's Brogue puts stairs in dead-end alcoves, walled on all sides but one, where the open side is not a choke point or hallway, so there is no other reason to enter the tile and stepping onto it can mean using the stairs, with no separate command {{Uo9-IcHhq_w#11}}.
- **Items that need no further input.** Michael Brough points out that Rogue's scroll of teleportation sends you somewhere random rather than somewhere chosen, consistent with Rogue's choice that item effects need no further input after activation; a chosen destination would need another prompt {{X4be22WoVgg#8}}.
- **No menu at all.** Spencer Egart's procedural ritual spells refuse a menu or targeting popup altogether: everything the effect needs, such as its target or element, must be specified by the ritual's own actions. That puts a burden on the generator, which has to know each effect's requirements and make sure some step satisfies them, for example a step that names the target {{q4Tf0vf2kiI#3}}.
- **Borrow controls players already know.** Nick Bush's Word Processor starts from the observation that Rogue was shaped by the Unix terminal and asks what a roguelike would be if its creator had only used a word processor. Bush's first takeaway is to ask which mechanics are already intuitive for players on a given platform, and to build from those {{R8DSq8qSJ44@1660#0}}.

### Mouse, touch and the keys you never find

The keyboard may not be the device most of your players use. Cogmind uses every key and about 300 commands, yet Ge's player data shows keyboard users are a minority; among movement inputs the numpad is most common and vi-keys least. Ge's advice is to make every action reachable by mouse first, add drag-and-drop inventory, and let players move to the faster keyboard gradually {{9se2M27LuOs#10}}. Zapata reached the same conclusion for phones: ports of desktop roguelikes with many commands were very hard to play on touch screens, so a mobile roguelike has to be designed for touch from the start {{TMxzVy7-VYQ#14}}.

Memorised shortcuts fail casual players silently. Biskup tells of an experienced gamer, an ADOM fan, who spent years not knowing potions could be drunk, because `d` drops and drink is Shift-D; the fan assumed potions were only for selling. A casual player who tries something and fails gives up on the concept {{hnoF_bL-HjI#3}}. Some of these conventions are not design at all: the `hjkl` movement keys of vi and roguelikes come from the ADM-3A terminal, whose keyboard had no arrow keys but printed arrows on h, j, k and l {{6ohPU0sECFE#2}}. A hardware accident of one early terminal is not a reason to make it your only scheme.

### Options cost everyone

Options look free to the person who asked for them. Biskup's rule is that every visible option costs every player the effort of understanding it, and a page of 60 options makes a game look forbidding. A well-designed game with good defaults does not need a thousand options; Ultimate ADOM starts with essentials only (sound, resolution, key customisation) in a structured menu where players expect it {{hnoF_bL-HjI#5}}.

The alternative to options is designed layers of detail. Ultimate ADOM offers detail levels, from bars only, through some numbers, to full modifiers and engine internals for power users. Biskup stresses that this has to be planned from the beginning; ADOM has one detail level baked into its DNA and retrofitting more would mean rewriting too much {{hnoF_bL-HjI#14}}. A test result shows why it matters: more than half of the role-players tested could not read dice notation like 4d3+2 and silently ignored it. A range like 6-14 loses the distribution that 4d3+2 conveys, but casual players do not care, and the simplest display might be a single strength number {{hnoF_bL-HjI#9}}. So the simpler mode spells out abbreviations like DV and PV and shows a battle axe as 3 to 8 damage, keeping dice notation for experts; Biskup admits there is still too much statistics on screen {{PTIsUSbQ0TA#16}}.

Three supporting techniques make layers like these cheaper:

- **Small numbers.** Benjamin Berman's rule for accessible card combat is to put everything you need on the card: short decks, small-number arithmetic, few keywords, and no inflated values with extra zeroes {{DT9_7sW5knY#6}}.
- **Explanations generated from data.** Because Ultimate ADOM models maps, items, monsters, races and quests as data in an entity-component system (ECS), the game can introspect any definition and generate a readable tooltip, so the Archer can be shown as "+1 strength, +4 toughness", and hovering over anything shows its statistics and modifiers. In hard-coded ADOM every explanation was written by hand {{PTIsUSbQ0TA#5}}.
- **Per-platform rules.** Biskup imagines a mobile variant of Ultimate ADOM that drops item identification or status effects where they would be too fiddly, on the same engine {{iZUXjbcAfYs#14}}.

Density is not automatically the enemy. bhauth argues that aesthetics and information density are not directly in conflict, only that doing both is harder than doing one; Dungeon Crawl Stone Soup (DCSS) chooses dense numbers over spectacle {{tg-CjNodlmY#12}}. What matters is whether the player can choose how much of that density to see.

### Multiplayer reaches the same rules

Tyriq Plummer arrived at the same constraints for a different reason: in a multiplayer roguelike, other players are waiting for your turn. HVNTRS is deterministic with no dice, has no menus, puts every action within two button presses, and hides no information, which also makes it welcoming to newcomers {{neuJCYmbAG8#7}}. In Scrubbin' Trubble Plummer's team limited the decision space with small inventories, distinct enemies and a clearly readable state, avoiding menu diving and colour-swap enemy variants whose differences must be memorised, so players could glance at the board and act {{UNBAoc0TJSs#1}}. When designers solving for speed and designers solving for newcomers converge on the same rules, the rules are probably sound.

**In practice.**

- One core verb, usually movement, with bump and step-on triggers for the common actions {{R8DSq8qSJ44@32392#3}} {{QBZkvtGucBU#7}}.
- Every action reachable by mouse or touch; the keyboard as an accelerator, not a requirement {{9se2M27LuOs#10}}.
- Few visible options with good defaults {{hnoF_bL-HjI#5}}.
- Detail levels designed in from the start, with simple numbers at the bottom and the full model at the top {{hnoF_bL-HjI#14}}.

## Respecting the player's time: speed, automation and tedium

### Never make the player wait on the presentation

For Jeremiah Reid, one rule for animation in a traditional roguelike must be followed: never block the player from acting as fast as they want. Mashing a key to fly across the map is a staple of the genre, and critics associate juice with slow press-wait-press play, citing Dungeons of Dredmor {{xSYVQc7cH-4#6}}. Reid's technique: apply every keypress immediately and speed up the animations still pending. With anticipation delays, pressing right twice originally moved the player only once; Reid now processes every input and doubles the speed of each outstanding animation, so a dozen tiles cross in about twice the time of a single move {{xSYVQc7cH-4#12}}.

Thomas Robertson marks the exception. Big super attacks are a big deal and have always stopped everything, so input can simply be inhibited while the queue of effects is non-empty, with skip or fast-forward offered so the player is not held up {{f1t4yPjfZyM#2}}. The two positions fit together: ordinary moves must never wait on visuals, and a rare spectacle may pause play if the player can cut it short.

Latency in the systems behind the screen does the same damage. Colin Liotta describes the roguelike puzzle in the 2017 MIT Mystery Hunt, whose server simulated each turn; under a hundred teams' load every move took about ten seconds, and with no undo, an accidental bump into an enemy meant an agonising restart {{5VsM8bOywIY#1}}.

### Automate the no-brainers

The second convergence is on automating decisions that have only one right answer. Ge's example from Cogmind is a single key that swaps a damaged part for a less damaged one of the same type, picking up the better part, attaching it, and dropping or storing the old one; inventory sorting and stat comparison bars do the same job elsewhere. Ge stresses that plenty of real decisions remain {{9se2M27LuOs#13}}. Cogmind also labels robots, parts and objects automatically as they come into view, because nobody should need a look command to identify the debris after an explosion; the labels are optional and their duration configurable {{9se2M27LuOs#12}}. Angband's one-keystroke "fire at nearest monster" replaced a target-cursor-fire sequence and made missile attacks roughly as easy as bumping to melee, with less strain on the hands {{eeSk665OXkM#8}}.

DCSS shows where automation comes from in a community game. bhauth explains that many common activities, auto-explore among them, have automation because whenever players got annoyed by something repetitive, someone submitted a fix; auto-explore can even run instantly, helping real-time speedrunners average 20 moves a second, while a careful win-streak player would reveal as few tiles as possible {{tg-CjNodlmY#2}}. In a first-person open world the same problem appears as walking: Furmanski notes that one walking speed is boring over long distances and awkward near objects, so Forska lets you click a far island or a nearby tree's shadow and be placed there {{ST6s_8ekeOg#3}}.

The cost of not thinking about this is shown by the game that preceded Dwarf Fortress. Zach and Tarn Adams's Mutant Miner became an interminable turn-based slog once it had several miners, mostly clicking repeatedly with nothing to fight, because, in their words, they had not thought about the interface at all {{Zh6dnx9FM1g#7}}.

### When effort is the point

Not everyone wants friction removed. Zeno Rogue notes that auto-travel is controversial in traditional roguelikes, and HyperRogue omits it: navigating hyperbolic space is a challenge in its own right {{wOlSws-OI2o#4}}. When the host, Alexei, said that memorising NetHack's whole-keyboard commands made playing feel wizard-like, Martin Pichlmair agreed that getting the body to do the work brings the player closer to the game {{EMb6B2cIJps#12}}. Yong Zhen Zhou calls simplifying demanding inputs a mixed bag: it improves accessibility, but the motions give a game energy, act as a limiter and reward practice {{KRZHT-gktD0#7}}. And some games make menu time a deliberate risk: Plummer notes that Vagante and Cave Blazers do not pause while the inventory is open, so swapping gear or hunting for a healing item mid-fight is dangerous {{OVSi3NzA0KM#13}}.

The choice depends on whether the effort is the game. If navigating, executing or managing under pressure is what you want the player to master, keep it, as HyperRogue and Vagante do {{wOlSws-OI2o#4}} {{OVSi3NzA0KM#13}}. If it is a toll the player pays to reach the next decision, automate it, and keep the automation optional, as Cogmind does with its labels {{9se2M27LuOs#12}}.

**In practice.** Apply input immediately and let visuals catch up {{xSYVQc7cH-4#12}}. Let rare spectacles pause play only if they can be skipped {{f1t4yPjfZyM#2}}. Automate decisions with one right answer {{9se2M27LuOs#13}}. Ask of each manual action whether its effort is part of the fun.

## Making consequences visible: previews, tooltips and threat display

### Interface design is directing attention

Joseph Hewitt frames UI with a magician's principle: just as a card trick works by directing the viewer's attention to one card, a game has to direct the player's attention deliberately to what they need to know and do. When players miss a required mechanic, it is because the designer failed to draw their attention to it {{dCWWId16VAo#1}}. Everything in this section is a technique for aiming attention at consequences before they happen.

### Show the outcome before the commitment

Several talks converge on previews: let the player see what an action will do before they commit to it. Brian Cronin says Monster Train needed damage previews to ship. With many units, statuses and artifacts on the board, resolution was confusing; hovering a card now shows a red X on every unit that will die, updating if another spell changes the equation, and players really enjoy it {{qO3CIpP62Q0#4}}. Dylan White shows Rift Wizard displaying every tile that is unsafe from enemy ranged attacks, so you can see which cultists can hit you and position accordingly {{VVRomN99Ygw#13}}.

The hard part is implementation, and two talks give the same answer from opposite sides. Cronin's black box sim makes previews easy: copy the world state, run the command on the copy, and read the resulting state changes to show, say, total damage. Because the preview runs the normal game code, it is accurate for every effect, including passive relic-style effects. Undo works the same way, by saving the world state at the start of a turn and copying it back, and custom world states also make automated tests possible {{jhcHlg7YhPg#11}}. Danny Day describes the opposite experience in Desktop Dungeons. Its combat prediction shows damage you will take and pips for follow-up hits, but simulated events were not allowed to change game state, so effects like a Naga weakening you with each attack forced the team to duplicate state. Ideally a simulated event chain would take a game state and return a new one, repeating until one side died; a decoupled, copyable state would have made it easy. Day adds that subtle displays, such as a missing second pip meaning you will die, make players think the game demands a lot of maths {{p48ArjJweSo#9}}. If you want previews, make your game state copyable from the start.

### Signal the stakes ahead of the choice

Previews cover single actions. Signals cover situations. Darren Grey argues that games should signal danger clearly, by flashing the screen red, special threat messages, different wall colours on hard levels or highlighted bosses, to break the player out of a heroic-charge mindset; Grey also warns against monsters that look cuddly but are terrifying {{C2sm-z7Ag4U#10}}. John Bond applies the same idea to route choice: door iconography, like Hades' room reward icons or a door's art and size, tells players what lies beyond so they can plan. Designers usually do not want to surprise players at these moments; even a forced choice like a big hellish portal should warn that it will be hellish {{bpGRyzWCWwk#4}}.

Feedback after the action has to register quickly too. Lisa Brown found original Rogue lacked intensity because its text-only combat made you watch your health to understand danger; in Nuclear Throne, Slay the Spire or Loot Rascals the outcome is visible at once {{BjqZdMW8U9Q#4}}. The most important change to Leif Bloomquist's Commodore 64 roguelike since the previous year's demo, prompted by playtest feedback, went the other way: replacing sound-only combat feedback with explicit messages of damage dealt and misses {{ASGn5J9PHbs#5}}. The common point is speed of understanding, not a particular medium.

### Reminders on demand

The player should never have to memorise what the game can remind them of. Casey Yano is proudest of Slay the Spire's hover tooltips; they once had a one-second delay, which was removed because waiting to recall what something did was more annoying than an instant tooltip {{KYlq0Msu6hc#15}}. Jim Shepard recommends presenting item function first and flavour text separately, as Magic cards and Tangledeep's item cards do, with stats in distinct colours and flavour underneath, so the text never obstructs players who do not care {{jd7K0EmkvPk#13}}.

Keep it on one screen where you can. Berman's advice for card combat is that it should all fit on one screen, as Slay the Spire's layout and most breakout mobile and strategy hits do {{DT9_7sW5knY#9}}. Tarn Adams describes the same roguelike philosophy, avoiding separate shop screens and keeping everything on one screen where possible; Dwarf Fortress extends it to conversation, which happens as speech in the world so listeners can act while responding {{Zh6dnx9FM1g#16}}. Digitisation can remove interface burdens entirely: Berman credits Hearthstone with turning Magic's turn-interrupting Counterspell into a hidden secret played on your own turn, keeping interaction while removing interrupts, and urges designers to embrace the constraints of digital play {{DT9_7sW5knY#8}}.

### When displays mislead or overwhelm

Displays fail in recognisable ways:

- **Misread encodings.** Josh Grams's turn-based space flight prototype subdivided each hex into four steps to show fractional velocity and drew a line of shadow markers ahead of the ship; many players read each shadow as one turn rather than the whole line as one turn {{TsaRxD3g_os#1}}.
- **Accumulation.** Cat Manning notes that Crusader Kings II surfaces trait effects clearly through icons and tooltips, but long-lived characters pile up an overwhelming wall of icons that are hard to tell apart, and a stat like 60+ learning can only be traced by summing traits {{q7E1N-fJnrA#7}}.
- **Lost affordances in a reskin.** David Dunham reskinned Thousand Hells' cards as tiles. It is obvious how many cards remain in a deck but hard to tell how many tiles remain in a bag {{oipNr8RE5bA#7}}, though the horizontal tiles also gave more room for explanatory text with play unchanged {{oipNr8RE5bA#8}}. A visual change can cost information the old form carried for free.
- **Walls of text.** Evan Debenham's fix for Shattered Pixel Dungeon's seven years of changes was a changelog presented as a grid of clickable icons, each opening the details for that item, character or enemy, so full detail fits a phone screen {{NMWQIdfCgQg#5}}.

**In practice.**

- Preview anything that can be simulated, and build state you can copy so previews are cheap and exact {{jhcHlg7YhPg#11}}.
- Signal danger before the choice, not after {{C2sm-z7Ag4U#10}} {{bpGRyzWCWwk#4}}.
- Make tooltips instant {{KYlq0Msu6hc#15}}.
- Fit play on one screen where possible {{DT9_7sW5knY#9}}.
- Test whether players read your symbols the way you meant them {{TsaRxD3g_os#1}}.

## What the interface says: messages, labels and tone

Every message, label and statistic tells the player something beyond its information: how to feel about an event, what the designer values, what the "real" way to play is. Decide what you want each one to say.

### The message log

The classic roguelike reports events in a text log, and not everyone thinks it should stay that way. Biskup's graphical Ultimate ADOM aims to show effects visually with very little text so players watch the environment instead of reading message boxes; text messages can be turned on, but the hovering texts in the latest ADOM showed Biskup that watching is much more compelling {{PTIsUSbQ0TA#9}}.

Whatever style you choose must not cost information. Zack Johnson wanted Kingdom of Loathing's whole output convertible into haiku, but a game becomes unplayable if events are abstracted into jokes. Doing it properly meant categorising every kind of text the combat script could produce, writing haikus for each, and later putting exact numbers like HP lost into hover text {{jNUMRG_tvrY#5}}. Even plain messages take work: Nicholas Feinberg notes that Crawl needs hundreds of lines of special-case code just to pluralise monster and item names correctly, because "add an s" fails for names like hippogriff {{GMkBT4UbvAs#6}}.

### Tone as design

Tone in the interface carries meaning. In Caves of Qud, Jason Grinblat's team kept the body swap feeling like a transgression by giving it no journal entry and no achievement, only a terse, neutral message: "your mind is stranded here". In a game full of baroque language, dropping to console-readout simplicity carried authorial weight {{kvCky6BbTuE#12}}.

The interface can also be the character. Nathan Savant argues that UI exists to communicate character state, yet most games use it only for health; it can be animated, obscured or distorted to show mental state, such as blocking the screen for blindness or scrambling skills after a head blow {{WTLPXhLjwLU#5}}. Andrea Interguglielmi's Nauticrawl makes the whole classic UI diegetic (part of the game world): the player sees only cockpit monitors, with hull integrity as HP, fuel as hunger and battery as stamina, and the map on a radar with fog of war {{wxmio1S3iN0#2}}. Alexandra Leonhart reads the message log as an institution's feedback on your actions and sees an unexplored space in an unreliable message-log narrator {{R8DSq8qSJ44@28748#5}}. That idea runs straight into Johnson's rule, and the tension is worth noticing: a narrator that lies is a design choice only if the player can eventually tell.

### What labels say about how to play

How you present options states your view of them. Andrew Aversa lays out a scale for presenting permadeath: no option at all is the strongest statement of intent; a preselected toggle is a big nudge; nesting it in a submenu downplays it; hiding it behind file editing says you cannot do this; listing options with none highlighted is the most equitable and likely gets roughly even consideration {{kn2QkH5lByw#2}}. Labels work the same way: Wolfenstein and Doom mock their easy modes, Celeste offers assists after a gentle screen recommending playing as intended first, and ADOM lists its modes equitably, though Aversa saw it later tell a standard-mode player they could progress to the "real" classic mode {{kn2QkH5lByw#3}}.

Statistics are labels too, and some designers steer deliberately. Dan DiIorio refused Richard Garfield's suggestion of a win-rate statistic in Luck be a Landlord: a player who wins after four losses should feel triumphant, not be reminded of 20% {{fSmaqjbU2xg#10}}. Andrea Roberts's Roundguard puts unlocks, mastered relics and score progress front and centre each run, to say that dying did not erase what you learned {{WtdCY6NxX6I#8}}. NetHack's developers chose not to warn before a player breaks a conduct (a self-imposed restriction a player chooses to play under), because the point of a conduct is avoiding the actions that violate it {{KLHJsJuJfYg#6}}. And the game's last word on a run is itself an interface: Quinten Konyn describes DCSS's morgue file, a roughly 19 KB text record of a dead character covering overview, inventory, skills, spells, death messages, the map where you died, vanquished monsters, notes and timelines {{a9flzzXJVcg#0}}.

Aversa's equitable listing and DiIorio's or Roberts's deliberate steering are both legitimate. The difference is whether you have decided what message you are sending.

**In practice.** For each label, mode name and statistic, ask what it implies about the intended way to play, and whether you mean it {{kn2QkH5lByw#2}}. Let style shape text but never hide game information {{jNUMRG_tvrY#5}}.

## Windows onto the simulation: making deep systems legible

### Too many events, not too many commands

For simulation-heavy games the interface problem changes shape. Max Kreminski warns that games like Dwarf Fortress and Crusader Kings II expose complex simulations directly through inscrutable UI, leaving players lost in a deluge of mostly insignificant events. Rather than having the simulation simplified, which would take creative burden off the player, Kreminski wants players given tools to make sense of it {{BDcZSWHu8RQ#6}}. Jasmine Otto calls such a tool a "narrative instrument": in a social simulation with hundreds of characters, the interface must let players aim their attention at the parts relevant to them, like a Sims player checking on a rival while 80 other Sims go unobserved {{NjIDVIIg1lY#0}}.

### Sense-making tools

The talks offer a set of concrete instruments:

- **A chronicle of the world.** Jonathan Lessard's game exposes its simulation through "chronicles", a live, exhaustive, hyperlinked wiki of the world inspired by Dwarf Fortress's Legends mode, which updates as the game advances and includes graphs such as population over time {{D8A9dpITLAU#2}}.
- **A journal that reorders fragments.** Caves of Qud logs each discovered history snippet about a sultan in chronological order, so fragments found out of order read as a story; before the journal, players had to take diligent notes {{ClGAApZYIvI#3}}.
- **Summaries of hidden state.** Manning describes how Crusader Kings III surfaces hidden AI personality as a two-word epithet built from the two most extreme of nine hidden attributes, so a compassionate but greedy character might show as a "vindictive ravener"; in CK2 the equivalent stats were unreadable without looking under the hood {{q7E1N-fJnrA#9}}. Shepard suggests emoji, such as hearts, question marks and frowns, to show NPC relationship states cheaply and across dialects {{LKCRim02opc#15}}.
- **Abstraction.** Nic Tringali's The Banished Vault replaces orbiting bodies with a delta-v map, a tree of stable orbits with one or two energy numbers per hop, so a continuous physics problem becomes a readable graph {{nSJA2yVsTFM#0}}.
- **Filters and search.** Mark R Johnson's Ultima Ratio Regum groups its roughly 500 dialogue questions by topic, filters them by NPC class, colours them by the player's fluency in the current dialect, and narrows them as you type {{qh9vyoMviJI#11}}. Kreminski's Synthesifter, a designer-facing tool, pairs a filterable event log with positive and negative examples and live candidate matches for refining a pattern {{oaDI0lWkedg#7}}.

### Show the seams

Aaron Reed argues that procedural text should usually show its seams, because players only appreciate variation once they can see what changed and why. In Ice-Bound nobody appreciated how text varied with the active symbols and emphasised themes until a mode was added that highlighted the varying text, which became a window into how their actions shaped the collaboration. Reed allows hiding procedurality when that is the intent {{x0Xh4oCX9t0#13}}. The same holds for any hidden simulation: a change the player cannot see is a change they cannot value.

### Open problems

Two problems remain unsolved. Rich Wilson frames the lack of verbs for feelings like grief in first-person games as a problem of "interaction articulation": how players can express deeper intent, and whether the game has receptors for it. Radial menus give range but break immediacy; Wilson sees VR hand interaction as a promising direction {{wtlLa7BGZcs#14}}. Scott Anderson calls 3D or top-down falling-sand simulation a really hard interface problem: volumes are small because of memory and compute, and players struggle to see into them {{R8DSq8qSJ44@15170#13}}.

**In practice.** Give players filters, histories and summaries of hidden state rather than a raw event feed {{BDcZSWHu8RQ#6}} {{D8A9dpITLAU#2}}. Let them see what changed and why {{x0Xh4oCX9t0#13}}.

## Letters, tiles and symbols: choosing a visual vocabulary

The sections so far have been about what the interface shows and how the player drives it. The next two turn to the symbols themselves and the machinery that draws them. The argument over ASCII versus tiles is usually conducted as a matter of taste or nostalgia. The talks treat it more usefully, as a trade-off between what each kind of symbol makes easy and what it makes hard. Once you see the trade-off, the choice stops being about looks and becomes a question of what your player has to recognise, how fast, and how often {{UIsNv3UOzvA#7}} {{Xwa1KbXqeGQ#1}}.

### Association against differentiation

Joel Ryan, who drew the tileset for Sil-Q, gives the clearest frame, an idea Ryan credits to an article. A visual vocabulary has to do two jobs: let the player *associate* a symbol with what it means, and let the player *differentiate* one symbol from another. ASCII is weak at the first and strong at the second. Every new roguelike asks you to learn a fresh set of glyph-to-monster mappings, but the letters of your own alphabet are about as easy to tell apart as symbols get, and a glyph classifies: a `T` tells you something about any troll-class monster before you have met it. Tiles are the reverse. You know a red dragon is a red dragon the moment you see it, but telling one tile from another at a glance is harder, so Ryan concludes that tile artists should spend their effort on differentiation {{UIsNv3UOzvA#7}}.

Evan Ovadia states the cost side of ASCII bluntly. A newcomer looking at an ASCII screen sees noise: you cannot tell whether a `T` or a pair of quote marks is a friend, an enemy, an object or food, and you have to learn the code before the game becomes fun, whereas sprites are understood at a glance {{Xwa1KbXqeGQ#1}}.

> ASCII requires you to learn before you can have fun. {{Xwa1KbXqeGQ#1}}

But Ovadia also finds that, once learned, ASCII gives a clearer read of a tactical situation than detailed sprites: in a comparison of identical scenes, the ASCII version was easier to parse {{Xwa1KbXqeGQ#4}}. Ovadia's own game, Domino, takes a middle path that its designer calls symbolic graphics. A claw symbol does not say "goblin", but it does tell you that this is a scary enemy {{Xwa1KbXqeGQ#1}}. Domino's non-humanoid symbols make it possible to emphasise each creature's distinguishing traits, and stairs, trees, tables and chairs are deliberately left off the domino-shaped backing tiles that creatures stand on, so threats stand out from scenery; Ovadia admits that the dominoes' height and the pentagonal terrain cost some clarity {{Xwa1KbXqeGQ#4}}. Symbols can also carry detail plain ASCII cannot, such as a small mark showing whether a character attacks with a sword or a gun, again at a slight cost in clarity {{Xwa1KbXqeGQ#5}}.

droqen pushes the abstraction argument from the design side. ASCII display and visible numbers boil a game's presentation down, so both developer and player can concentrate on the mechanics and what they say. In droqen's Signal Pals, health drawn as three of five bubbles still makes the player think in numbers, and the frog and lizard enemies are purely iconic: one is simply the enemy with three hit points, the other the one with two {{6Whz8bvjAKo#5}}. Darren Grey reads the genre's ASCII heritage the same way, as a priority of utilitarian gameplay over looks; it can be prettied up, as Brogue does, but the utility of the display matters more than its appearance {{C2sm-z7Ag4U#0}}.

### The imaginative case for letters

The second argument for glyphs is not about efficiency at all. The Rogue panel recalls ten or more players in the UC Santa Cruz stat lab screaming when a `T` appeared. The letter looked no scarier than a `B`, but after a while of play, Glenn Wichman says, you did not see a T on the screen, you saw a troll {{IaB7iQhts_c#2}}. Leonard Richardson describes the same effect as a kind of imaginative play: the letter that is plain text at the top of the screen becomes a deadly monster on the map, and learning that `H` meant hobgoblin, or that the IBM PC's box-drawing characters were doorways, was the same pleasure as imagining that a bedroom was a spaceship. Richardson sets this against the school of thought that the `H` should be replaced with a realistic tile {{ntVjLNl2_ro#2}}.

Santiago Zapata points out that this was never planned. Rogue's terminal display relied on the player's imagination the way tabletop sessions did, but that was a happy accident: Rogue's developers have said they would have used graphics if they could {{ZMdxP7fO6wE#6}}. Nick Montfort sees a contribution in it anyway. Systems that make `@` and the letters A to Z stand for creatures defamiliarise the alphabet and suggest two levels of meaning at once, which Montfort values even when the result is not visually spectacular {{blXH5pO8GA4#9}}.

### Encoding signals, and exploiting their limits

Whatever vocabulary you choose, it carries information beyond identity, and switching vocabularies means moving that information over deliberately. Ryan's work on Sil-Q is the worked example. Sil was not made with tiles in mind, and much of its state lived in brightness and tinting that tiles could not reproduce. Unaware monsters, drawn brighter in ASCII, got an exclamation mark; rage became swapped floor and wall tiles; weapons that glow blue near monsters they slay needed a three-layer system of floor, glow and weapon; damage numbers became overlay tiles {{UIsNv3UOzvA#4}}. The rewards for doing this are real. Alan Malloy notes that DCSS ships both a character display and a tiles interface drawn by volunteer artists, because many people are unwilling to look at the ASCII version but would love to play the tiles one {{QV57CYrIZow#1}}.

Ambiguity can also be a mechanic rather than a defect. In NetHack the Wizard of Yendor's decoys are drawn with the same purple `@`, so the limit of the character set creates real confusion about which symbol is the real wizard, as commentary on Adeon's speedrun points out {{rIB0y_kwFuY#20}}. When ambiguity is not intended, give the player a cheap way to resolve it. Players of Leif Bloomquist's Commodore 64 roguelike mistook a low-resolution sign for a hammer, so signs describe themselves when walked over {{ASGn5J9PHbs#6}}.

For tiles seen from above, Alexander Birke and Sofie Kjær Schmidt give readability rules from Sea of Rifts, where players must decode ship factions and types from afar. Put detail on the tops of objects, because that is what you see first; use strong colour and shape contrast, so spiky boats wear contrasting colours to signal danger and enemies are bright purple against the ocean; and exaggerate what matters, as with a weapon boom made unrealistically large so it reads at any camera distance {{FC9GAL2piJI#4}}.

### Text as the graphics

A few designers push the vocabulary question to its limit and treat text itself as the display. Todd Furmanski proposes running a fully simulated 3D space while showing the player only a textual description with a simple examine parser, on the grounds that abstracting space is nothing new in a genre where a `D` is a dragon {{ST6s_8ekeOg#5}}. Elsewhere Furmanski pairs turn-based simulation with Myst-style static images: one composed picture per turn frees the designer from frame rates, characters stuck in walls and 16-button controller tutorials, and leaves that obsessive attention free for painterly styles such as pencil sketch or Mediterranean mosaic {{tmrYfnMrifw#6}}. Hardware can also take text away: making Dragon's Descent for the Atari 2600, Furmanski found that a text bitmap eats a sizeable chunk of the cartridge, so the game became an arcade action game and gave up what text does for roguelikes {{l9eE4mT8xqI#5}}.

The strangest example comes from print. Younès Rabii reads the novel *La Horde du Contrevent* as a roguelike that did not know it was one. It represents each character with a typographic symbol and lays them out on the page like a console display, so the reader sees the formation (a teardrop with the leader in front, for moving against the wind) and how tight the situation is, and it notates winds with punctuation: periods and commas for slowing wind, slashes for big gusts {{6ik6jB2YhZg#4}}. Its pages are numbered downward from 700, turning the page count into a countdown towards a climax, much as a deeper dungeon level means you are nearer the end but at greater risk {{6ik6jB2YhZg#5}}.

**In practice.** Choose your vocabulary for how quickly players must tell threats apart, not for how it looks in a screenshot. If you use tiles, put your effort into differentiation {{UIsNv3UOzvA#7}} and keep scenery visually quieter than creatures {{Xwa1KbXqeGQ#4}}. If you offer tiles alongside ASCII, list every signal the glyphs carried, such as brightness and tint, and re-encode each one {{UIsNv3UOzvA#4}}. Where a symbol could be misread, make it explain itself on contact {{ASGn5J9PHbs#6}}.

## Building the display: terminals, fonts, grids and overlays

How you put characters and tiles on the screen shapes what you can show. The talks cover the full range, from 300-baud terminals to browsers, emoji and spreadsheets, and the constraints of each are specific enough to plan around.

### The terminal heritage

Rogue's interface was shaped by bandwidth. At 300 baud, 30 characters a second, with cursor addressing alone costing four characters, a full redraw was slow, so Ken Arnold drew the inventory as a small window in the upper-right corner and repainted only that region; Arnold also cut keystrokes, such as the space presses needed after messages {{IaB7iQhts_c#7}}. The screen size most terminal emulators still default to, 80 by 24 characters, comes from the DEC VT100, the de facto standard terminal of the late 1970s, as Tabitha Sable explains {{6ohPU0sECFE#3}}. Sable also explains why the curses library's optimisations were fragile: terminals interpret control sequences that alter their internal state, so on a mismatched terminal the first map might draw, but as soon as the character moves the optimised line redraw emits junk and the screen turns to line noise. The talk suggests reproducing it with a strict VT52 or VT100 emulator and `TERM` set to `vt220` {{tmrYfnMrifw#11}}.

### Modern text-mode rendering

Patrick Devine's Go library for terminal sprites shows how simple the core loop can be: clear the screen, update sprite positions, redraw, forever. In the demo the main source of lag was the size of the terminal, and Devine relies on tmux to avoid actually performing full redraws {{ckDp6p4HbqA#0}}. To get more resolution than one glyph per cell, the sprites use Unicode quadrant block characters: each cell has four independently lit "pixels", 16 combinations, drawn with the foreground and background colours. The demo's character sprite is 6 by 6 cells, and for lack of a drawing tool, sprites are authored as ASCII text and converted to quadrant characters {{ckDp6p4HbqA#3}}. The caveats are practical. You need a good monospaced font and adjusted line spacing; Linux works best, while macOS and Windows terminals often break the spacing (Devine recommends iTerm2); and the code points involve UTF-16 handling rather than UTF-8 {{ckDp6p4HbqA#4}}. Terminals offer 256 colours, more than 1980s 8-bit consoles, but each quadrant cell can show only two colours and its pixels are taller than wide, which causes artifacting {{ckDp6p4HbqA#5}}.

Font geometry matters even when you are not using block characters. Gabriel Santos recommends a 1:1 font aspect ratio for top-down ASCII games and something nearer 1:2 for side or isometric views; after much experiment, Santos's own side-view game settled on 16:29 {{5sFVVQcUWVE#4}}. To stay pixel perfect at any window size, the game's font was made in more than 20 pixel-exact sizes, down to 3 by 5 pixels, and the game picks one dynamically as the window scales {{5sFVVQcUWVE#5}}.

Emoji grids bring their own trap. Joe Sondow notes that emoji are monospaced across platforms and so can form a grid, but no whitespace character matches their width, since ideographic and other spaces vary by platform; a perfectly aligned emoji grid therefore cannot use spaces. Sondow turns this to advantage, using odd spaces to jitter the fish so they look more organic {{4byHHDeVKoA#3}}.

### Browsers and odd substrates

In the browser you can stop treating the UI as part of the game grid. Chris McCormick lays hit points and other text over the game canvas as ordinary HTML elements with a web font and absolute positioning, which makes UI iteration take seconds; rot.js can alternatively render fonts inside its console {{dJbUmDsyJRw#9}}. For differing screen sizes McCormick reads the character's position and centres the whole view on it with a CSS translate transform, and on mobile simply shows less, smaller {{dJbUmDsyJRw#14}}. In an engine, Sea of Rifts generates its parchment panels rather than drawing paper for every size: Birke's shader applies a paper texture and thresholds a noisy greyscale signed distance field (SDF) to get frayed pirate-map edges, nine-slicing makes resizing work, and screen-space noise plus per-element vertex colour offsets hide the repetition of a shared SDF; the same method produces shadows {{FC9GAL2piJI#15}}.

Unusual substrates show which display ideas are essential. Seth Cooper's Trogue, built in a tile rewrite language, implements exploration with two cover layers of large emoji: darkness, cleared permanently as you explore, and fog, which refills every move so only the area near the player is visible. Each move rewrites tiles near the player to clear both, and even the HUD must live on the grid, placed by dropping tiles and moving them into position {{K5FXzxDIQdQ#4}}.

> The fog refills every time the player moves but the darkness doesn't. {{K5FXzxDIQdQ#4}}

Tyler Robertson shows that a spreadsheet works as a turn-based engine because it only updates when the player clicks: direction buttons drive X and Y values, and formulas across the grid draw an `@` wherever the coordinates match. The same property makes it poor for real-time games {{hdhKErNIYgE#4}}.

Input handling belongs with the display layer, because modes such as targeting change what a click on the grid means. Danny Day's Desktop Dungeons swaps the active click handler: casting a fireball removes the normal handler and installs a fireball handler listening to the same events, which emits a cast-fireball event on a grid click, or removes itself and restores the default on right-click or cancel. The default handler never needs to know how fireballs work, and new spells need no other system to know about them {{p48ArjJweSo#7}}.

### Geometry and view

What the screen shows is also a choice about geometry. Zeno Rogue noticed that roguelike screenshots often show the whole level, which is rarer in other games, and uses HyperRogue's hyperbolic projections to combine a close view of the character with a large part of the level on one screen; players prefer different projections, so several are offered {{wOlSws-OI2o#10}}. Lee Tusman's survey of one-dimensional dungeons finds the spare axis put to use: Stutterstep plays along a single line and shows items and equipment along the second dimension {{-e4gF_SKWPk#6}}, and One Dimensional Dungeon can be played vertically, with a flip-flop mode that switches orientation every level {{-e4gF_SKWPk#9}}. And not every display convention travels. Tyriq Plummer observes that line of sight, nearly universal in traditional roguelikes, is rare in roguelike platformers, which mostly use fog of war or darkness instead; Plummer could not make line of sight run efficiently in real time in Catacomb Kids, which is now designed without it {{OVSi3NzA0KM#8}}.

**In practice.** Pick a rendering technique for the information it must carry: block characters buy resolution at the cost of two colours per cell {{ckDp6p4HbqA#5}}, emoji grids cost you whitespace alignment {{4byHHDeVKoA#3}}, HTML overlays buy fast iteration {{dJbUmDsyJRw#9}}. Choose a font aspect ratio to suit your camera {{5sFVVQcUWVE#4}}. Keep input modes as swappable handlers rather than flags in one handler {{p48ArjJweSo#7}}. Then test on the actual terminals, fonts, browsers and screen sizes your players will use, because these techniques depend on fonts, line spacing and terminal types {{ckDp6p4HbqA#4}} {{tmrYfnMrifw#11}}.

## Playing without seeing: blind and low-vision accessibility

Almost everything the talks say about blind players comes from one research project: Alexei Pepers' work on an accessible NetHack, presented in 2016 and revisited in a 2018 Q&A. That is a narrow base, and you should treat it as one team's well-tested findings rather than settled consensus. But it is detailed, it was tested with visually impaired players {{e8Itfp3MHQ4#6}}, and its central claim, that roguelikes are unusually close to accessible already, should encourage anyone working in the genre {{e8Itfp3MHQ4#9}}.

### The goal and the opportunity

Pepers starts from a gap. Accessibility research had focused on access more than on the games, producing titles that were fully accessible but simple and not very replayable; making Battleship accessible is easy but not much fun. Pepers' project asked whether a deep, replayable game like NetHack could be made fully accessible {{e8Itfp3MHQ4#0}}. Roguelikes turn out to be unusually good candidates. Because ASCII cannot show that you are levitating, the game tells you in text, and even graphical effects like a wand of lightning come with a text description; so much of the game is already text that relatively few changes make it fully accessible {{e8Itfp3MHQ4#9}}.

The baseline is not good enough on its own, though. Some visually impaired players already play NetHack by having a screen reader read the raw map aloud as "hash dot dot dot hash", which Pepers calls terrible; they do it because they want to play that badly {{e8Itfp3MHQ4#1}}. Combat text works fine; what blind players mainly struggle with is positional movement {{5y_IAdOwaYs#12}}.

### What the team built

The core addition was a view command that lists every visible object, monster and dungeon feature with its exact tile offset from the player, because in a tile-based game you need positions like "two tiles north" to interact with anything. A cursor-based "feel" mode lets the player probe individual tiles, and in hallways each move reports how many tiles are visible and accessible in each direction {{e8Itfp3MHQ4#4}}.

Visually impaired players said the most taxing part of play was moving through the dungeon as a whole: holding a mental map of the level and backtracking through it. The team added a list of remembered features, such as staircases, altars and fountains, that the player can select to auto-travel to, and a way to select a visible item, walk over it and pick it up. The aim was to remove frustration without removing gameplay {{e8Itfp3MHQ4#5}}. Pepers modelled these on DCSS's time-saving auto-path functions, and the NetHack dev team later implemented their own version of some of the changes {{5y_IAdOwaYs#12}}.

### The unsolved problem: precise space in plain words

The hard problem is spatial. "You see a wand and a kobold to the southwest" does not tell you whether you can reach the wand first, whether you can route around the encounter, or whether you are lined up to zap. Interactive fiction sidesteps this by abstracting space into rooms; a tile roguelike cannot, and Pepers says giving precise positions in text that is neither technical nor verbose is really hard, and is where future work must go {{e8Itfp3MHQ4#13}}. Every description sits between giving enough information to play and staying immersive without burying the player in text. The view command struck the balance ("you see your little dog named Sirius"); the hallway tile counts after every move did not {{e8Itfp3MHQ4#11}}.

Each existing alternative solves part of the problem and costs something else:

- **Raw screen reading of the ASCII map** works and is miserable {{e8Itfp3MHQ4#1}}.
- **Lists and auto-targeting.** Angband's monster list and auto-targeting make its combat accessible, but its map exploration cannot be done through text, so it suits players with partial vision who enlarge the tiles {{e8Itfp3MHQ4#3}}.
- **Auto-explore.** Crawl's auto-explore lets blind players move through a level without seeing it, but they never know where they are and go from encounter to encounter, losing exploration {{e8Itfp3MHQ4#3}}. This is the accessibility side of the automation argument in "Respecting the player's time" above: the same feature that removes a toll for one player removes the game for another. For games with irregular, Angband-style rooms, Pepers suggests offering auto-explore as an option for those who want it, paired with orientation aids such as absolute coordinates ("50 tiles right into the dungeon") rather than only local offsets {{e8Itfp3MHQ4#16}}.
- **Dropping the map.** Fully accessible text and audio roguelikes, such as the audio game Entombed, get rid of the tile map and use interactive-fiction rooms instead. That changes the game fundamentally: combat becomes a choice of dodge or attack against the monster's choice, not positional tactics {{e8Itfp3MHQ4#2}}.
- **Spatial audio.** Directional sound works for an accessible Doom, but in NetHack you need the exact tile, not a direction. Pepers thinks combining directional audio with precise text, to reduce text overload, is worth exploring {{e8Itfp3MHQ4#15}}.

### Process lessons

The most transferable lesson is about testing. The team left the ASCII map on so screen readers could fall back on it; players immediately asked to turn it off, because the screen reader read the whole map after every useful line of text. Sighted developers misjudge how screen readers behave {{e8Itfp3MHQ4#6}}.

> There's really no substitute for getting the feedback directly from visually impaired players. They know what's best for them. {{e8Itfp3MHQ4#6}}

Real play also finds what designers did not imagine. NetHack players steal from shops by sending a pet in while standing in the doorway, which requires knowing exactly where the pet drops each item; the view command re-read the entire shop inventory each time. The team had not anticipated this, and Pepers suggests announcing where pets drop items as a fix {{e8Itfp3MHQ4#8}}. Where players disagree strongly, such as compass directions against up/down/left/right, make it an option: any single choice angers half the user base, and options already fit the roguelike habit of configuration files {{e8Itfp3MHQ4#7}}. And the work pays off beyond its audience. The view command helps newer players identify unfamiliar ASCII symbols and lets anyone learn in one keypress that the weapon across the room is a silver saber, an extra incentive to invest {{e8Itfp3MHQ4#10}}.

### Later work

The ideas have spread. NetHack 3.6 added a listing of monster and object locations closely resembling the research team's, though buried in menus, and BrogueSpeak set out to make Brogue fully audio accessible without a screen reader by converting text to speech and sound internally {{e8Itfp3MHQ4#14}}. Outside roguelikes proper, Chelsea Thompto's The Fog uses ARIA tags so screen readers skip its decorative generated symbol text and read only the legible words {{-xrcmY7LNPI#3}}. In browser roguelikes, Chris McCormick's HTML overlays can be reached by tab navigation; asked about it by an audience member, McCormick saw a risk of players editing the game live, while the session host noted it could serve accessibility, and the speaker added that the game can be fully keyboard driven {{dJbUmDsyJRw#15}}. Andrew Doull singles out Roguelike Radio's episode on designing for visually impaired players, including how they use screen readers, as personally important {{NaqP13nkpfU#3}}.

**In practice**, a feature list drawn from this work:

- A command that lists everything visible with exact offsets from the player {{e8Itfp3MHQ4#4}}.
- A cursor that can probe individual tiles {{e8Itfp3MHQ4#4}}.
- A list of remembered features with travel-to, and select-to-pick-up for visible items {{e8Itfp3MHQ4#5}}.
- Optional auto-explore with an absolute position report {{e8Itfp3MHQ4#16}}.
- An option to hide the map from screen readers {{e8Itfp3MHQ4#6}}.
- Options for contested conventions such as direction words {{e8Itfp3MHQ4#7}}.
- Decorative text marked so screen readers skip it {{-xrcmY7LNPI#3}}.
- Testing with visually impaired players, early {{e8Itfp3MHQ4#6}}.

## Testing for players unlike you: children, parents, newcomers and different minds

Pepers' central lesson, that sighted developers misjudge what blind players need {{e8Itfp3MHQ4#6}}, generalises. Beyond vision, accessibility in the talks is mostly a testing discipline. You cannot design for players unlike you from first principles; you have to find cheap ways to simulate them, watch them, or listen for the signs that they are stuck.

### Listen for the recurring question

Caelyn Sandel gives the simplest diagnostic: questions and confusions that keep coming up among new players mark accessibility gaps in the interface or design. If newcomers repeatedly fail to find the same part of the UI, make it more apparent; work out how you are not speaking the new player's language, and speak it {{NANqgqeqh2k#8}}. Sandel's example of what not to do is Caves of Qud's F1 quick-start help, which offers "10 things you should do when you start to play" but is still technical reading that points to other menus. Many players will simply give up, and Sandel stresses that being daunted by it says nothing about whether they could master Qud's complexity {{NANqgqeqh2k#1}}.

Tools face the same problem. JP LeBreton's Playscii opens on a pre-filled starting document instead of a blank page, which invites play immediately; it even has a bottom edge that invites panning, teaching that documents can be any size. Where the tool breaks conventions, a bundled manual covers the rest {{MJZvWgcxV0M#6}}.

### Michael Langford's toolkit for children and parents

The most concrete material comes from Michael Langford, who designs for children playing with their parents. Almost every item is a test a small team can run without special equipment.

- **Hands.** Record a child playing with a variety of controllers. Kids climb up the controller and flick sticks fighting dead zones; during testing, remap shoulder buttons down and see whether they can then finish. Chorded held inputs almost always trip up children, and on keyboards they are an injury risk for adults too {{wPN5bPxWXm8#1}}.
- **Remapping.** In-game button remapping fixes almost all parents' control problems without reworking the scheme; system-level remapping is cumbersome and fails with multiple controllers. Hold-to-activate modes can become equippable items the player toggles to {{wPN5bPxWXm8#2}}.
- **Random input.** Kids snack, wiggle and bump every button. Test menus by shaking a wrapped controller at them, and add stronger confirmation wherever random presses could delete a profile, end a run or spend a rare item; pause and load menus are where the damage happens, and adults make the same accidents {{wPN5bPxWXm8#5}}.
- **Literacy.** Simulate a pre-literate player with a "fake localisation": replace your font's glyphs with unreadable characters of similar size. If someone else can still get through, a child probably can; where they cannot, add icons, such as a heart or a bullseye for archery, to the important text {{wPN5bPxWXm8#6}}.
- **Eyesight.** For parents' older eyes, play from one and a half times your normal distance from the screen, then cut and enlarge the on-screen text {{wPN5bPxWXm8#7}}.
- **Slow machines.** Run the game on slow hardware and look for deaths right after a load screen: players look away during the load and die on arrival. Langford cites Swords of Ditto as a problem case, and says not to optimise the loading, which is a lot of work, but to add a partially obscuring confirmation screen or a transit hub, which need not appear on fast systems {{wPN5bPxWXm8#8}}.

> Any time they die right after a load screen, that's what you got to fix. Don't go fix your load screen performance. {{wPN5bPxWXm8#8}}

Langford's co-op advice runs against a usual design instinct. Children survive multiplayer with simple "cheese" strategies such as circling and shooting, the kind a parent tells a child to use. Have testers role-play those deliberately weak strategies, note which items and characters enable them, and flip the incentive: fight cheese in single player, but let it work in multiplayer so the child can play alongside the parent {{wPN5bPxWXm8#3}}. Then check who those cheese-friendly characters are. Young children want to play a character like themselves, and although there is no ability difference by gender at those ages, a child will want the matching character if the easy ones do not offer it {{wPN5bPxWXm8#4}}.

### Different minds and different limits

Hannah Blair Salzman argues that roguelikes are especially valuable to neurodivergent players: they engage mind and hands without requiring hyperfocus on one enormous game of the kind that takes hundreds of hours, and Salzman thanks roguelike developers for helping such players in ways they may not have imagined {{6GSXaM1PTMg#5}}. This is a case for the genre's short, self-contained runs as an accessibility feature in its own right.

At the other end of the spectrum, accessibility can mean protecting players who want to be frightened. For immersive horror that blurs the line with reality, G blekkenhorst offered content warnings with a way to ask about specifics, an allergen list for touchable objects, and sealed real bones in The Archive, and recommends the tabletop-RPG practice of asking for lines and veils (topics to exclude entirely, and topics to keep off-screen) along with a list of content players do want. The goal is people "miserable in the exact way they want to be miserable" {{uZdEXqRkBZA#10}}.

**In practice**, cheap tests a small team can run this week:

- Log every question new players ask; anything asked twice is a design bug {{NANqgqeqh2k#8}}.
- Swap your font for gibberish glyphs and have someone play through {{wPN5bPxWXm8#6}}.
- Play from 1.5 times your usual distance {{wPN5bPxWXm8#7}}.
- Mash random buttons on every menu and see what you lose {{wPN5bPxWXm8#5}}.
- Run a build on your slowest machine and watch the moment after each load {{wPN5bPxWXm8#8}}.
- Check that every held or chorded input can be remapped or toggled {{wPN5bPxWXm8#1}} {{wPN5bPxWXm8#2}}.
- Make your first screen something to play with, not a page of reading {{MJZvWgcxV0M#6}} {{NANqgqeqh2k#1}}.

## Beyond the keyboard: platforms, controllers and the player's body

Roguelikes grew up on keyboards, and most talks assume one. A smaller group asks what happens when the input device, the screen or the network changes, and their findings suggest the change is not cosmetic.

### The controller is part of the game

Yong Zhen Zhou argues from alternative-controller ("alt.ctrl") design that redesigning a game's controller expands what the game is. Conventional design attends to what happens behind the screen; alt.ctrl design also designs the interface and sometimes the display. Zhou's hypothetical is a horror game wired to smart-home lights that switch off as a health bar, so the layout of your house, how fast you can run and whether someone else can help all become part of play {{KRZHT-gktD0#0}}. Input semantics also set the player's role: pressing A to jump makes you Mario's puppeteer, while voice control would make you his drill sergeant {{KRZHT-gktD0#3}}.

> If it was suddenly voice controlled, your role is like a drill sergeant. {{KRZHT-gktD0#3}}

Zhou's view of physical input fits the caution, noted under automation above, that simplifying demanding inputs can strip a game's energy. It applies even when you never build a controller. Slay the Spire plays identically everywhere, but Zhou finds a hand full of Shivs feels better on a phone, because you physically fling the cards out; every input has a physical sensation that contributes to the experience {{KRZHT-gktD0#6}}. Examples in the same talk include Line Wobbler, a one-dimensional dungeon crawler played on a single LED strip and controlled by a spring door stopper because it wobbles nicely {{KRZHT-gktD0#1}}.

### Adapting turn-based play to other inputs

Turn-based play changes what a controller needs to do, sometimes for the better. Josh Grams, making a turn-based space flight game, found that combining turning, accelerating and shooting in one turn was a UX problem: real time lets you do all three at once, but turns raise questions of how to specify and cancel parts of a move, and confirming each turn felt slow. One-step rotation took three turns to turn around, so each direction got its own key, and turning to any direction costs one turn {{TsaRxD3g_os#2}}. On a gamepad, pointing the analog stick seemed perfect, but players rest their thumbs on the stick and small wiggles cost turns; merging consecutive aiming turns did not help enough. A suggestion from Grams's cousin fixed it: a single move button that accelerates when held and coasts when released, with an overlay showing where the stick points and when it will trigger a turn {{TsaRxD3g_os#6}}.

The fact that a traditional roguelike waits for input makes surprising devices workable. Qristy Overton played Brogue on a custom Makey Makey dance pad. It works because Brogue needs only about 18 inputs (directions, search, rest, apply, inventory, throw, yes, no, enter) and turns advance only when a key is pressed. An off-the-shelf mat lacked enough buttons, and since every press needs one foot on a ground pad, the ground foil wore out; Overton would add more ground pads next time {{zlJNIJOog9M#0}}. At the far end, Bad News is staged in a small room with a model theatre: the player uses an iPad and speaks commands from a printed sheet, such as knocking on a door, while a curtain opens whenever a live actor plays a townsperson from a hidden screen, and a "wizard" runs the simulation out of sight {{XFFyN10o87I#5}}.

The player's environment counts too. Julian Jarboe asks sound designers to imagine their game on very different setups: a small ThinkPad with drugstore earbuds and no mouse on a cramped commuter train, a surround-sound system with a projector and recliner, a 4K monitor with good headphones in a rented bedroom. Designers already think about accessibility and numpads; this is "same deal but for ears" {{zGbQi5LJwIw#5}}.

### Reaching players wherever they are

Platform reach is itself an accessibility question: can the player get to the game at all? Alan Malloy describes DCSS's online servers, which let players play over SSH or in the browser through WebTiles from any device with an internet connection, with nothing to download. One game can be continued from home or work, updates arrive automatically, players can choose old versions that still receive severe bug fixes, and phone ports talk to the WebTiles server {{QV57CYrIZow#2}}. Drew Streib's NAO server added a JavaScript terminal over websockets (Chromium's hterm) so people on networks that block telnet, such as at work, can play NetHack in a browser {{J4RK-3zW8vY#8}}. Thomas Biskup counts more than 24 platforms for ADOM, including Amiga and Raspberry Pi, maintained out of love even though few people play there, while requests for iOS and Android keep coming {{a3ZYDA2JVSM#22}}.

Leif Bloomquist's Dungeon of the Rogue Daemon, presented across three talks from 2018 to 2020, takes cross-platform play furthest. A single shared server instance is played from a Commodore 64 client written in 6502 assembler, a JavaScript port for browser and mobile, and a telnet client, with a translation layer converting the view to PETSCII, ASCII or UTF-8 {{Y0K-e83wYnQ#6}}. The JavaScript port exists because few people own an internet-connected C64; it keeps the original gameplay, controls, character set and sound effects, and the font binary is the only code the clients directly share {{ASGn5J9PHbs#2}}. Shared play was a goal from the start, and Bloomquist's aim is that each client keeps the flavour of its platform while the game stays fair between them; the server is written in JavaScript, and by 2020 the mobile interface was still rough {{bpSnPNr6ETc#5}}. Bloomquist's wider vision is that any retro machine, from a VIC-20 to an Apple II, could connect and play together {{Y0K-e83wYnQ#6}}.

**In practice.** Design input around the gestures the platform does well, as with flinging cards on a phone, rather than porting keystrokes one for one {{KRZHT-gktD0#6}}. When you map a turn-based game to analog or physical input, check that accidental input cannot spend a turn {{TsaRxD3g_os#6}} and that the game still waits for a deliberate action {{zlJNIJOog9M#0}}. Imagine the cheapest and the most lavish setup your game will run on {{zGbQi5LJwIw#5}}. And if you can let players reach the game from a browser or a remote server, you remove the barrier of installing it at all {{QV57CYrIZow#2}} {{J4RK-3zW8vY#8}}.

## Tensions and open questions

### Automation against embodied effort

Ge's Cogmind, Dungeon Crawl Stone Soup and Angband automate repetitive actions with one right answer, and in DCSS the automation grew from players' own fixes {{9se2M27LuOs#13}} {{tg-CjNodlmY#2}} {{eeSk665OXkM#8}}. Against this, Zeno Rogue leaves auto-travel out of HyperRogue because navigation is the challenge {{wOlSws-OI2o#4}}, Martin Pichlmair and Yong Zhen Zhou value physical execution as part of the experience {{EMb6B2cIJps#12}} {{KRZHT-gktD0#7}}, and Vagante makes menu time a risk on purpose {{OVSi3NzA0KM#13}}. Accessibility adds a third view. For blind players, Crawl's auto-explore is what lets them move through a level at all, but it also leaves them disoriented and strips out exploration; Pepers' answer is to offer it as an option and pair it with orientation aids {{e8Itfp3MHQ4#3}} {{e8Itfp3MHQ4#16}}. The choice depends on whether the effort is the game you are making, and for whom: one player's toll is another player's skill, and a third player's only way in.

### Modernising against the people already fluent

Biskup calls power-user communities the biggest obstacle to mainstream interfaces {{hnoF_bL-HjI#1}}, yet also promised ADOM's veterans no more overhauls that force them to unlearn what they know {{iZUXjbcAfYs#4}}, and Tabitha Sable shows how long familiar conventions survive once people are used to them {{6ohPU0sECFE#6}}. Biskup's own route was to design Ultimate ADOM simple-first rather than reduce an already complex interface {{iZUXjbcAfYs#25}}. For an existing game with an existing audience, the talks do not say how much relearning is acceptable.

### Fewer options against options as accommodation

Biskup argues that every visible option costs every player, and that good defaults beat long option pages {{hnoF_bL-HjI#5}}. The accessibility talks reach for options as the remedy: Pepers makes contested conventions, such as compass directions, configurable because any single choice angers half the users {{e8Itfp3MHQ4#7}}, and Michael Langford finds in-game button remapping fixes almost all parents' control problems {{wPN5bPxWXm8#2}}. The two can coexist if accommodations sit in a structured menu where players expect them, as Ultimate ADOM's essentials-only options do {{hnoF_bL-HjI#5}}, but where the line falls is a judgement each game makes.

### Letters against pictures

Evan Ovadia says ASCII makes you learn before you can have fun {{Xwa1KbXqeGQ#1}}, and DCSS ships tiles because many people will not look at its ASCII version {{QV57CYrIZow#1}}. Glenn Wichman, Leonard Richardson and droqen value glyphs for what the player's imagination and attention do with them {{IaB7iQhts_c#2}} {{ntVjLNl2_ro#2}} {{6Whz8bvjAKo#5}}, and even Ovadia found a learned ASCII screen easier to parse than detailed sprites {{Xwa1KbXqeGQ#4}}. The association-differentiation frame Joel Ryan borrows turns the argument into a question of what your players must do most: recognise things on first sight, which favours tiles, or tell them apart quickly, which favours glyphs {{UIsNv3UOzvA#7}}. Offering both, as DCSS does, keeps both audiences, but adding tiles means re-encoding every signal the glyphs carried, as Sil-Q's tileset had to {{UIsNv3UOzvA#4}}.

### Speed against spectacle

Jeremiah Reid's rule is that animation must never block input {{xSYVQc7cH-4#6}}; Thomas Robertson lets a rare super attack halt play as long as it can be skipped {{f1t4yPjfZyM#2}}; John Bond notes that polish makes players tolerate slow menus {{bpGRyzWCWwk#6}}. The reconciliation offered in this chapter is that ordinary moves never wait and rare spectacles may pause if the player can cut them short, but how rare is rare enough is left to the designer.

### Style against legibility

Kingdom of Loathing's haiku mode may restyle text but must not hide game information {{jNUMRG_tvrY#5}}. Alexandra Leonhart sees an unexplored space in a message log that is an unreliable narrator {{R8DSq8qSJ44@28748#5}}, and Nathan Savant would obscure or distort the UI to show a character's mental state {{WTLPXhLjwLU#5}}. Hiding or distorting information can be the point; nobody in the talks says how to do it without the player losing trust in the screen.

### Neutral presentation against deliberate steering

Andrew Aversa describes listing modes with none highlighted as the most equitable choice {{kn2QkH5lByw#2}}. Dan DiIorio and Andrea Roberts deliberately shape what players see about their own record, declining to show a win rate or putting unlocks front and centre {{fSmaqjbU2xg#10}} {{WtdCY6NxX6I#8}}. Both are legitimate; what matters is knowing which message you are sending.

### Unsolved problems

- **Precise space in plain words.** How to tell a blind player exactly where things are without technical or verbose text is, Pepers says, where future work must go {{e8Itfp3MHQ4#13}} {{e8Itfp3MHQ4#11}}. Directional audio combined with text is one idea Pepers thinks worth exploring {{e8Itfp3MHQ4#15}}.
- **The clearest classic roguelike.** Justin Ma and Matthew Davis ask what a classic roguelike with the best, clearest UI would look like, and think it hard but worthwhile {{rNi5nO5yqLs#10}}. Slashie asks how far the entry barrier can be lowered without losing the genre's essence {{R8DSq8qSJ44@32392#2}}.
- **Expressing intent.** Rich Wilson's "interaction articulation", how a player expresses something like grief, has no settled answer {{wtlLa7BGZcs#14}}.
- **Seeing into volumes.** Scott Anderson calls the interface for 3D falling-sand simulation a really hard problem {{R8DSq8qSJ44@15170#13}}.

## Checklist

1. What share of your schedule is set aside for UX, and does it start on day one?
2. Whose feedback shaped your interface: only veterans, or also people who have never played a roguelike?
3. Which actions are harder to operate than they need to be, as distinct from harder to win?
4. How many keys must a new player learn, and can every action be reached by mouse or touch?
5. Is movement your main verb, and which actions could be triggered by bumping or stepping instead of by a command?
6. Does every visible option earn its cost, and are detail levels built in rather than bolted on?
7. Can the player act as fast as they want, or does any animation or server round trip make them wait?
8. Which decisions have only one right answer, and have you automated them, optionally?
9. Which manual efforts are part of the fun, and which are tolls?
10. Can the player preview an action's outcome, and is your game state copyable so previews run the real code?
11. Are dangers signalled before the choice, and are tooltips instant?
12. What does each mode name, statistic and message tell the player about how they are meant to play?
13. If your game simulates a lot, what tools let the player find what matters and see what changed?
14. If you offer tiles and ASCII, has every signal of one been carried over to the other?
15. Have you tested with players unlike you: someone blind or low-vision, a child, someone who cannot read your font, someone on the slowest machine?

## See also

- [04. Learning and discovery](04-learning-and-discovery.md): tutorials, onboarding and how players learn a game's rules through its interface.
- [03. Death, difficulty and progression](03-death-difficulty-and-progression.md): making a game approachable without making it easier, and how permadeath options are presented.
- [14. Art and audio](14-art-and-audio.md): tilesets, glyphs and sound as the material of the visual vocabulary.
- [15. Architecture and tools](15-architecture-and-tools.md): copyable game state, entity-component systems and input handling behind previews and tooltips.
- [02. History and lineage](02-history-and-lineage.md): the terminals and hardware that left the genre its keys and screens.
- [05. Systems and emergence](05-systems-and-emergence.md): the deep simulations whose events the interface has to make legible.
