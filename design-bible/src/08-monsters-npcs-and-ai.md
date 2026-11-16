# 08. Monsters, NPCs and AI

Every creature in a roguelike is a small promise about how the world behaves: the bat that flutters, the guard who notices, the merchant who remembers what you did. This chapter covers how to build those behaviours, from the monster that chases you down a corridor to the villain scheming three kingdoms away, and how to choose the machinery underneath them. It matters because monsters are most of what a roguelike player reads and plays against turn after turn, and because AI is where an ambitious design most easily spends a year building something the player never notices.

The talks come at the subject from two ends. Monster talks are about behaviour in the moment: what a creature notices, how it moves, and which decision structure (state machine, decision tree, search) drives it. NPC talks are about minds and societies: drives, beliefs, relationships, agendas and conversation. Both ends share a conclusion. The goal is not an optimal opponent or a complete simulation but a character the player can read, predict and act on, and cheap tricks often deliver more of that than deep systems do.

## In brief

- Make monsters feel like characters rather than perfect opponents: players project far more intelligence than the code contains, and a lack of behavioural variety is a designer's lasting regret {{9iTJ9Z8p0ao#7}} {{Gs9Nb5ZYRY0#1}} {{Gk5uWXBANkA#7}}.
- Give each creature a few distinct, observable rules (how it moves, what triggers it, when it flees) that the player can learn and exploit {{b45orGdFwi0#5}} {{K5FXzxDIQdQ#5}} {{wxmio1S3iN0#8}} {{IaB7iQhts_c#9}}.
- Treat perception (vision, noise, smell, whom a creature targets) as a design lever, not a technical detail {{wtlLa7BGZcs#4}} {{0iNW5AYYWWw#3}} {{neuJCYmbAG8#11}}.
- Pick the simplest decision structure that expresses the behaviour you want: state machines are easy but explode as they react to more inputs, decision trees kept as data can be logged and tuned, and search adapts to new rules for free but is costly and, if every monster optimises one shared reward, gives them all perfect shared information {{Uf34SbuWIos#1}} {{isB82kORimk#9}} {{9iTJ9Z8p0ao#8}} {{9iTJ9Z8p0ao#13}} {{9iTJ9Z8p0ao#6}}.
- Route player and monster actions through one shared implementation so each behaviour is written once {{JxI3Eu5DPwE#7}}.
- Pathfinding cost is a design constraint, and in non-grid games it has bent designs and helped sink at least one concept {{huMHQGr8PgM#4}} {{Uo9-IcHhq_w#13}}.
- Build NPC minds from simple parts with private knowledge: weighted drives, beliefs rather than the truth, and personal values that make the same event read differently to different characters {{RYZSdPuvta8#0}} {{Rs_-yMsJDq8#6}} {{XFFyN10o87I#3}} {{BDcZSWHu8RQ#10}}.
- NPC agendas can start as states and triggers tied to systems your game already has, and deepen, as Dwarf Fortress's villains do, into networks of relationships and agreements that pass goals from character to character {{rmddpcmIJ2I#2}} {{rmddpcmIJ2I#7}} {{4-7TtPX5uhg#10}}.
- Track relationships on at least two independent axes, such as like and respect, rather than one reputation bar, and attach concrete behaviour to each combination {{LKCRim02opc#1}} {{LKCRim02opc#4}} {{x0Xh4oCX9t0#2}}.
- Complexity that the player cannot follow becomes chaos: minds that shift too fast are frustrating, and talking NPCs that cannot hold up can be replaced by framing {{q7E1N-fJnrA#13}} {{G5rq5ei2Lec#11}} {{uZdEXqRkBZA#8}}.

## Monsters with character: behaviour players can read and exploit

### Characters, not optimal killers

The talks that touch monster AI agree on one thing: the job is not to build the strongest possible opponent but to build creatures that feel like individuals. Lachlan Kingsford, who drives monsters with Monte Carlo tree search (MCTS, a search that plays out many random futures and keeps the moves that scored best), says outright that enemy AI should feel like characters rather than be perfect. Kingsford's way to get there is to give each monster its own reward function and parameters: an apprentice rewarded for its master's survival, a goblin master that gets more search iterations than its apprentice and so plays more cleverly, a scared guard that overestimates the player's hit points and so behaves timidly. Varying these knobs makes the monster manual mean something beyond move, attack and flee, while still leaving room for opportunistic attacks {{9iTJ9Z8p0ao#7}}.

The history of the genre shows how little code that impression needs. David Craddock's account of Rogue describes monsters with minimal AI, forced by memory limits; most simply hit harder and had more hit points deeper down. Yet Michael Toy recalled playtesters swearing to behaviours that did not exist, and players learned to exploit the few that did, such as luring the zigzagging bat into narrow corridors to shoot it {{Gs9Nb5ZYRY0#1}}. Players project intelligence onto a creature; a single distinctive quirk gives them something to project onto and something to play against.

The cost of skipping this is sameness. Jeff Olson's biggest regret is Alphaman's simplistic monster AI: given one thing to change, Olson would add behavioural variation so creatures felt different from one another {{Gk5uWXBANkA#7}}.

> My monster AI was simplistic. If there was one thing to change it would be to go back and work on the AI. {{Gk5uWXBANkA#7}}

### Legible rules the player can exploit

What makes a behaviour worth having is that the player can see it, predict it and use it. The examples in the talks are almost all small, observable rules:

- **Flee, but know when you're cornered.** John Harris describes monsters in the Advanced Rogue family that run when a fight goes badly, stand and fight when escape would only trap them, and, given a loop of rooms, can be chased forever {{b45orGdFwi0#5}}.
- **Pursue the way a creature would.** Glenn Wichman reworked Rogue's pursuit so that when you leave a room, a chasing monster heads for the door instead of straight at you {{IaB7iQhts_c#9}}.
- **Wait, then chase.** In Colin Liotta's roguelike puzzle for the MIT Mystery Hunt, some monsters stay put until they see you and then give chase, while dragons pathfind toward the most efficient kill; one level is solved by building a boulder bridge and timing the crossing so you are never seen {{5VsM8bOywIY#7}}.
- **Distinguish by movement alone.** Seth Cooper's Trogue has two enemies: bats that move randomly for one damage and snakes that patrol back and forth for two {{K5FXzxDIQdQ#5}}.

A rule can also come from the fiction. Nick Bush built Word Processor's enemies around the idea that they are people using a mouse: they can cross white space the player's cursor cannot, but they cannot warp. They escalate from distracted, cowardly OSINT operatives who can't harm you but summon a mod when they catch you, to mods who can end the run, to admins who move anywhere at double speed {{R8DSq8qSJ44@1660#3}}. Each tier is a different, readable threat rather than the same threat with bigger numbers.

Andrea Interguglielmi's Nauticrawl shows a rule doing structural work. Interguglielmi reprogrammed its enemies to react only when something makes noise and moves, justified in the fiction as energy conservation on an abandoned world. Nothing happens until the player commits to a move, which gave players unlimited time to experiment with their machine's settings, made play more strategic, and made silently waiting enemies feel creepier {{wxmio1S3iN0#8}}.

### Perception is a design lever

How a monster finds you is as much a part of its character as what it does when it gets there. Rich Wilson counts an "organic awareness model", such as vision cones, as one of the marks of simulation depth in immersive sims, set against enemies that always know where the player is {{wtlLa7BGZcs#4}}. Benet Devereux proposes smell as a separate sense, inspired by foraging desert ants: a smell map could let a character detect the acid of a green dragon in a corridor it cannot see, but unlike line of sight, scents can mask each other or wash off, so a fresh corpse in the room might hide the dragon's scent and let you walk into danger {{0iNW5AYYWWw#3}}.

With more than one player, perception has to answer "which of you?". Tyriq Plummer's Clean Sweep picks a creature's target by three rules: line of sight (breaking it frees the creature to retarget), proximity (stepping adjacent steals attention, and closer players are likelier to draw it), and activity (a creature switches to a visible nearby player who has taken more actions than its current target, so an idle player is passed over for a busy one) {{neuJCYmbAG8#11}}.

### Monsters in the system: traps and items

Reed Lockwood argues that monster interaction is the most interesting dimension of trap design: traps that injure monsters, monsters that know about traps or even set them, traps that summon monsters, captured or friendly monsters that spot traps or lead you to them, and monsters that deliberately trigger traps that won't hurt them. Lockwood's conclusion is to design encounters holistically with monsters in mind {{ymgmhtkRLyY#10}}.

Letting monsters use items is where the talks disagree. Nicholas Feinberg explains that Dungeon Crawl Stone Soup removed monsters' ability to pick up items. It had produced good tactics, such as keeping an orc's friends from re-grabbing her scimitar of distortion, but optimal players spent the end of every fight throwing dangerous weapons into lava or corners. Feinberg judges removal a net improvement with some loss, because it is hard for any tactical mechanic to be interesting enough to justify a frequent annoyance {{b8uoQHedFV0#9}}. Harris describes the opposite choice in Advanced Rogue, where monsters pick up and use the same kinds of weapons you do. A gnome with a found two-handed sword killed Harris in one hit on level 1, kobolds throwing rocks in dark rooms caused three of Harris's first five deaths, and picking up stray missile weapons becomes a tactic in itself, to deny them to enemies {{b45orGdFwi0#9}}. The choice turns on whether the denial play stays an occasional decision or becomes a chore after every fight. Leif Bloomquist adds a further wrinkle for persistent multiplayer worlds where monsters act while no one is online: Bloomquist would cap monsters at one or two items, and notes that item-using monsters open the possibility of NPCs you can't tell apart from players {{Y0K-e83wYnQ#12}}.

### Emergent surprises

Simple rules combined with other systems produce behaviour nobody wrote. Jonathan Lessard describes Chogue, which crossed chess's king-capture victory with Rogue's levels: the king avoids capture at all costs and appears only on a late level, so after the player fights down and corners him, he flees down the stairs and the player has to clear yet another level, which Lessard calls both hilarious and frustrating {{l1YEJBKehAY#11}}. Jason Grinblat relays Skyrim's "treasure foxes": fleeing foxes maximised distance measured in navmesh triangles rather than true distance, and geometrically complex camps and treasure sites have more triangles, so foxes ran toward treasure and players came to believe following a fox led to loot {{kvCky6BbTuE#1}}. Such surprises are a warning to test what your rules do together, and an opportunity, since some are worth keeping.

Sometimes a deliberate imperfection fixes a problem optimal play creates. With four-directional movement, two characters can dodge around each other forever. Thomas Biskup's provisional fix in Ultimate ADOM is to have monster AI sometimes hesitate rather than always take the optimal step, which forces one side to move; Biskup says it is good enough for now, not a final answer {{hnoF_bL-HjI#17}}.

The wish for monsters that learn remains open. One of Rogue's creators said that, had work continued, they would have used neural networks to make monsters that got smarter as you fought them {{IaB7iQhts_c#14}}.

**In practice:** give each creature a few distinct rules the player can observe and exploit: how it moves (Trogue's random bats and patrolling snakes) {{K5FXzxDIQdQ#5}}, what wakes it (Nauticrawl's noise) {{wxmio1S3iN0#8}}, and when it gives up (Advanced Rogue's fleeing monsters) {{b45orGdFwi0#5}}. Decide early whether monsters interact with traps and items, because those interactions can deepen tactics {{ymgmhtkRLyY#10}} but can also leave the player a chore after every fight {{b8uoQHedFV0#9}}.

## Choosing a decision architecture: state machines, trees, search and shared actions

Once you know what a creature should do, you have to choose the structure that decides it.

### Finite state machines

The simplest structure is a finite state machine (FSM): a set of states, such as waiting, wandering or chasing, with triggers that switch between them. Leif Bloomquist's multiplayer Commodore 64 roguelike uses exactly this, getting personality by tweaking transitions: some monsters sit until something enters visual range, others wander aimlessly {{Y0K-e83wYnQ#8}}.

Johnathan Pagnutti uses Slay the Spire's Jaw Worm to show a probabilistic state machine. It always opens with Chomp (heavy damage), then weights Bellow (permanent strength plus block) over Thrash (some damage plus block) over Chomp, and it can't Bellow or Chomp twice in a row or Thrash three times in a row {{Uf34SbuWIos#0}}. Those no-repeat rules expose the weakness of FSMs. To encode "not three Thrashes in a row" you duplicate states: a "thrashed once" node and a "thrashed twice" node with no arrow back to Thrash. That is manageable for one enemy, but Pagnutti notes FSMs are hard to make very reactive, and extending the graph to react to player input makes it explode {{Uf34SbuWIos#1}}.

### Decision trees as data

Kate Compton calls decision trees "the ultimate chain of if statements", and argues for storing them as data rather than as nested code. Once a tree is data you can log which branches fire, so you can see how often monsters drink potions or why they attack, and spot an aggro flag set too high without replaying a hundred times. You can mutate branches so monsters from the same "school" decide slightly differently, or use decision forests and tree-learning algorithms to learn better trees {{isB82kORimk#9}}.

### Search: MCTS

Kingsford's MCTS sits at the other end. Its big advantage is that it searches over the game's actual rules, so it adapts to design changes for free: add a new spell to your wizard and the wizard uses it, with no new AI code {{9iTJ9Z8p0ao#8}}. It has two costs. The first is fictional: if the whole dungeon optimises one reward, "kill the player", then the monsters share perfect information. Kingsford says that approach is not bad but you have to lean into it, for instance with a brain-controlling wizard or a big-brother AI, or it feels abstract; the suggestion is to treat each dungeon level as a separate game for simulation {{9iTJ9Z8p0ao#6}}. The per-monster rewards described at the start of this chapter are the alternative. The second cost is CPU. Simulating real game logic is heavy, GPU use would require branchless logic, and running MCTS for every monster every turn will probably feel slow without efficiency work. Kingsford's advice is to let this shape the design toward fewer, more deeply simulated actors, taking inspiration from small-scale roguelikes like 868-HACK rather than Angband {{9iTJ9Z8p0ao#13}}.

How to choose: an FSM is simple and gives personality through its transitions {{Y0K-e83wYnQ#8}}, but grows unwieldy as it reacts to more inputs {{Uf34SbuWIos#1}}; a decision tree held as data can be logged and tuned {{isB82kORimk#9}}; search uses anything the rules allow {{9iTJ9Z8p0ao#8}} but needs fiction to explain its shared knowledge {{9iTJ9Z8p0ao#6}} and a small cast to stay fast {{9iTJ9Z8p0ao#13}}.

### Plumbing that makes AI cheaper

Two talks describe structures that make any of these approaches easier to build.

- **Shared actions.** Bob Nystrom has both player input and monster AI produce Action objects that the game loop performs. The hero's turn comes from input, a monster's from AI, but stepping, opening doors, attacking and spell effects are implemented once for both. Without this layer you write each behaviour twice {{JxI3Eu5DPwE#7}}.
- **Advertisements.** Compton describes The Sims storing object behaviour in an editable language in which each object advertises what it will provide separately from what it actually provides. Agents choose by the advertisement. Fans exploited the gap to build a cigarette table that advertised relief from loneliness, didn't deliver it, and so lured Sims to smoke forever {{E5-3Ui7oO8U#1}}.
- **Blackboards.** A blackboard is a shared space every program reads from and writes to in its own way. Compton used one for a virtual character in which Chancery handled dialogue, Tracery generated text, and a MIDI controller could also move the puppet {{E5-3Ui7oO8U#16}}.

### Movement cost shapes the bestiary

Moving around the map can be expensive for an AI, and the talks show it constraining designs. On grids, Albert Ford is working on combining field of view with jump point search: plain A* gives paths that zigzag between cardinal and diagonal steps, and string-pulling straightens them only at extra cost for a mainly aesthetic gain, while FOV plus jump point search gives straight diagonal lines and the jump point speedup together {{y1zkrTcNJbc#5}}.

Off the grid, pathfinding has bent whole designs. Arvi Teikari explains that in Noita, where every pixel can move and sand and water constantly rearrange the terrain, robust and fast pathfinding for many agents (such as a god-game tribe using ladders) proved effectively too costly, one of the problems behind the abandoned god-game concept. The team tried jet-pack fliers to simplify it, then gave up on AI for years, revisiting it only in the roguelite phase {{huMHQGr8PgM#4}}. Brian Walker found pathfinding in a procedural platformer far harder than on a grid: deciding whether one point can be jumped to from another is finicky with headroom and obstacles, and making creatures carry it out is harder still, so Walker leans on flying enemies and teleporters because ground monsters get stuck {{Uo9-IcHhq_w#13}}. Physical locomotion has its own version of the problem. Liza Knipscher's Bioloom separates visual IK legs from physics-driven data legs, and replaced a hard-to-tune spring-damper, which made creatures bounce wildly, with keeping a constant height off the ground and capping self-applied velocity {{jBhcHdV5HHo#14}}.

**In practice:** pick the simplest structure that expresses the behaviours you want; keep behaviour in data so you can log and tune it; route player and monster actions through one implementation; and let what movement costs decide which creatures you make.

## Minds from simple parts: needs, beliefs and plans

Monsters mostly need to decide what to do this turn. Creatures and NPCs that live longer in the world need something more like a mind: drives that compete, knowledge that is partial, and plans that make sense from where they stand.

### Concerns, intentions and weighted choice

The talks that build NPC minds do it by composing simple parts, not by writing one clever brain. Dustin Freeman's Spirit of the Ages gives the clearest recipe. Each entity holds a set of generic concerns, such as fear of snakes, homesickness or wander, which lie dormant when irrelevant. Each turn, every relevant concern produces a specific intention (wander becomes "pathfind with A* to this grid coordinate"), one intention is chosen by weighted random selection, and it controls the entity until it is done {{RYZSdPuvta8#0}}.

The weights come from priority buckets modelled on Maslow's hierarchy, but treated as probabilities rather than a strict stack. A bear only starts fearing a deer after being attacked repeatedly; that newly relevant safety concern then becomes more likely to win, but is not guaranteed, and a strange mood in the self-actualisation bucket can still be picked over hunger {{RYZSdPuvta8#1}}. Concerns that stay relevant but go unchosen gradually rise in priority, so normally rational parts can turn obsessive. Freeman calls an inherited destiny concern "a cognitive land mine": an entity can ignore all physiological and safety needs once it sees its destined homeland, and a fish that randomly wants to live in the desert grows ever more frustrated {{RYZSdPuvta8#8}}.

Freeman's template is the Internal Family Systems model from therapy, which treats a mind as simple parts with their own needs and relationships, including "legacy burdens" inherited from family or culture that look irrational from outside but have internal reasons. Its appeal for AI is that each part is like a one-note sitcom character, easy to imagine and easy to write {{RYZSdPuvta8#7}}. Concerns spread in the same spirit: by inheritance at birth, from close groups, and from context, so if a creature is homesick when it gets a head pat, homesickness is reinforced and becomes more common {{RYZSdPuvta8#10}}. Freeman is candid about what remains unsolved: how a creature should be unburdened (convince it it's safe, redirect the fear to its real cause, reassure it), how two escalating concerns should resolve, perhaps through a finite "moral fortitude" resource, and whether a fear one penguin learns of seals should spread to all penguins, nearby kin or a new subspecies. Threshold and single-instance propagation rules strike Freeman as equally unsatisfying {{RYZSdPuvta8#12}}.

### Acting on beliefs, not on the truth

Stephen G. Ware's work on story planners reaches the same idea of a partial, personal mind from another direction. Planners that assume full observability produce characters who act on knowledge they couldn't have, such as a guard charging in from off-screen to slay a bandit whose robbery he never saw. Ware's Sabre planner fixes this by explaining a character's action only through a plan the character believes will work, given what they know and have observed, even if it wouldn't really work {{Rs_-yMsJDq8#6}}. It also models hope (a plan that achieves my goals), fear (a plan by others that is bad for me) and relief (a plan that prevents a fear), so characters anticipate each other and personality sets how much risk they take: a risky bandit tries a second robbery at the guarded market, a careful one avoids it {{Rs_-yMsJDq8#7}}. Finally, characters should only choose plans on their Pareto front, meaning no alternative is better in some way without being worse in another. Without that rule, Ware's hungry guard kept stealing food, then arresting and killing himself as a criminal {{Rs_-yMsJDq8#8}}.

> A plan only makes sense if there was no other plan that was better in some ways without being worse. {{Rs_-yMsJDq8#8}}

### Subjectivity from three directions

Three projects, presented in two talks, give each character its own reading of the world.

- **Implanted beliefs and rumours.** Bad News generates a town, then implants each character's beliefs about others; the live actor playing a character must stick to that character's beliefs, such as where someone works {{XFFyN10o87I#3}}. Knowledge spreads as rumours: confidence grows with more evidence, but characters can misremember {{XFFyN10o87I#4}}.
- **Characters that sift their own stories.** Max Kreminski describes Felt, where characters run story-sifting patterns as introspective actions that produce motivation tokens. Someone treated meanly three times may produce a "get revenge" token that later actions consume, while another character notices the same person was having a bad day and chooses kindness {{BDcZSWHu8RQ#9}}.
- **Values that judge.** In Kreminski's Cozy Mystery Construction Kit, each scientist in a snowed-in observatory gets random values (science, survival, comfort, order) used to judge whether an action is a crime, so leaving the break-room door unlocked reads differently to someone who values security than to someone who values comfort {{BDcZSWHu8RQ#10}}.

In each case the same event produces different reactions, and that difference is where conflict comes from.

### Small models, real lessons, and the legibility limit

A tiny mind model can carry a whole game. Jeff Lait's 7DRL Fatherhood has the player building a dam against a flood with three children who drift into playing tag. Because the children seek attention, scolding instantly sends a child back to work but reinforces tag, while praising a child already working seems to do nothing yet draws the others to the rewarded behaviour. The immediate feedback points the opposite way from the right strategy, which is the lesson {{LQPGmxytTws#10}}.

The limit runs the other way. Cat Manning calls Prom Week a fascinating artifact whose characters nonetheless waffled back and forth and changed moods too quickly to follow, which made them chaotic and frustrating; Manning sees work to be done in making such complexity legible without making it simplistic, but has no clear answer {{q7E1N-fJnrA#13}}.

**In practice:** give each agent a few simple drives and private knowledge; let choice be weighted rather than strict so creatures surprise you; rule out plans that are dominated by better ones; and damp how fast moods and opinions change so players can follow them.

## NPCs with agendas: from toggled copies to villainous schemes

A mind gives an NPC reasons; an agenda puts those reasons to work in the world where the player can run into them. The techniques here form a spectrum from cheap illusion to deep simulation.

### Cheap illusions of purpose

You don't need a simulation for an NPC to seem to have somewhere to be. Nathan Savant points to Elden Ring, whose NPCs feel random but motivated because you never know where they'll show up. The trick is simple: the game places several copies of each NPC wherever they make sense and, as the player hits triggers, disables one and enables another, so the character appears to travel {{rmddpcmIJ2I#0}}. Hades uses the same toggle in a roguelike structure, respawning hub NPCs slightly differently with new dialogue after each death; Savant led with Elden Ring precisely so designers wouldn't assume the technique belongs only in a hub town {{rmddpcmIJ2I#1}}.

An older version of the idea gives every character a script. Aaron A. Reed describes Veronika Megler's The Hobbit, built to fix the problem that static adventure puzzles lose interest once solved: every character plays the game alongside the player by its own little script. A goblin wanders and attacks; Gandalf roams, picks up interesting objects and drops them when bored; areas change between plays, so maps may not be accurate {{CE7o3GGif30#8}}.

### Savant's modular recipe

Savant builds reactive NPCs from states and triggers. The minimal villain needs only a location, a couple of animations and a trigger. When the villain wants to blow up City Hall, spawn them outside City Hall next to a bomb; when the player interacts, swap to a handcuffed animation; when the player looks away, hide them in jail until a timer or trigger brings them back. A second outcome, such as sealing them in a time crystal, adds one animation, and repeated escapes can escalate into stronger villains that need stronger means of capture {{rmddpcmIJ2I#2}}.

To vary the plot, fix a plan's start and end and make the middle interchangeable. The villain starts in the lair and ends at City Hall, but in between may shop for parts and build a bomb, forage for supplies, or steal someone else's bomb; a random number picks the path, and branching states let events change the goal entirely {{rmddpcmIJ2I#3}}.

Motivation decides which systems an NPC listens to. A villain who wants to hurt people responds to being thwarted by seeking revenge on the hero's loved ones; a merchant built into the same reactivity system ignores revenge and responds to the economy or a rare item in the region, which means the game must actually have an economy. Savant also imagines wizard cops who hunt players grown too powerful in one branch of magic {{rmddpcmIJ2I#8}}. The triggers themselves can be any value in the game, not just dialogue or engine volumes: three points in fire magic, three rooms of power, 3,000 gold. Because state-based NPCs only need to check a number, any system can be a key {{rmddpcmIJ2I#7}}. A recurring guardian shows how far this goes: a villain who attacks whenever you approach a particular door builds suspense about what is behind it across the whole run, until a meta-progression unlock removes them {{rmddpcmIJ2I#5}}.

The discipline that holds this together is knowing the story you are telling. If the hero is meant to thwart the villain, the villain's plans must be thwartable, and the triggers you choose and what they change must fit that story; Savant says the same setup serves a taunting dungeon villain, economy-driven merchants or a rival heading for the same dungeon {{rmddpcmIJ2I#4}}.

### Deep schemes: Dwarf Fortress villains

Tarn Adams shows what the deep end looks like. Dwarf Fortress villains get inherent goals from their type (a necromancer wants bodies to raise) and specific goals from world-generation history (a grudge against the village that expelled them for not ageing). Adams found that simple motivations alone produce no scheme {{4-7TtPX5uhg#7}}, and so gave schemes something to act on: layered relationships such as friendships, lovers and even divorce, and new positions like an advisor and a spymaster, with each relationship carrying simple flags ("these people don't like each other", "have history") and personality traits like greedy {{4-7TtPX5uhg#8}}.

Villains then recruit. They pick a target through relationship flags and roll against the MICE motives from counterintelligence (money, ideology, coercion, ego), building a chained, nested network; a necromancer's apprentice, promised immortality, goes to a town and finds a node through relationships. These rolls happen offscreen to set the stage for the player {{4-7TtPX5uhg#9}}. Once the network is compromised, the villain feeds goals down it and each node uses its own tools: a necromancer who wants bodies gets a war started, and a revenge goal reaches a spymaster who knows how to assassinate. Adams admits some links, like "war creates bodies", start hard-coded {{4-7TtPX5uhg#10}}. Each agreement a character makes is stored as a small object, which measures how compromised they are, gives villains deeds to boast about in villain talk, and serves as blackmail leverage when a link dies; if the advisor dies, the necromancer loses access to the ruler and must start over {{4-7TtPX5uhg#12}}. Agents know only the link they are part of and their progress on it, not the rest of the chain, and occasionally check it for local repair. That produces feedback loops, such as two kingdoms' advisors each advising the other's ruler badly, which Adams finds entertaining when players piece them together later {{4-7TtPX5uhg#22}}.

Jasmine Otto proposes, as a goal rather than a finished system, making this kind of plot generation multiscale: a faction-level game triggers peer-to-peer character interactions and then zooms back out to the larger picture {{NjIDVIIg1lY#10}}.

### NPCs who push back, and crowds with culture

Agency can also mean refusal. Kreminski relays Meg Jayanth's account of writing 80 Days: to avoid an "entitlement simulator" where the world exists to serve the player, NPCs are sometimes more powerful than the player and have boundaries and lives of their own that push back on what the player demands {{TvlZinAvpwg#6}}. At the other end of the scale, agendas can be texture. In Mark R Johnson's Ultima Ratio Regum even how NPCs move is set by culture, some grouping up and others keeping wider distance, so watching a crowd walk should tell you where they come from {{qh9vyoMviJI#2}}.

**In practice:** start with states and triggers tied to systems your game already has, choose triggers that tell the story you mean, and add deeper machinery (relationships, networks, stored agreements) only where the player will see the result.

## Relationships, rivals and companions

Agendas are about what NPCs want from the world. Relationships are about what they think of you, and of each other, and that state can drive as much behaviour as any plan.

### Beyond the reputation bar

Jim Shepard argues that per-NPC relationship state is fuel for procedural generation, and that it lets relationship stories happen during play instead of outside it {{LKCRim02opc#0}}. The usual model wastes that fuel. Standard faction reputation is a single number that takes NPCs from not knowing you to adoring you through grinding; games keep it that simple because they track dozens of factions, but Shepard calls it silly and thinks we can do better {{LKCRim02opc#1}}.

### Like and respect

Shepard's core model uses two independent axes: like, and respect (does this NPC think you are good at your job and handle difficulty?). Default respect depends on personality, and the two values move independently though they interact {{LKCRim02opc#4}}. The grid's quadrants give distinct behaviour for allies and foes alike:

- An ally who likes but doesn't respect you gives small help, gold but not the +1 assault rifle, which they expect to end up in an enemy's inventory {{LKCRim02opc#5}}.
- An ally who respects but dislikes you supports the mission but not you, and doesn't care if you die so long as it succeeds {{LKCRim02opc#6}}.
- A foe who likes you might drug the guards' soup so you survive; a foe who likes and respects you may switch sides or seek to prove they can beat you, which makes a true rival {{LKCRim02opc#5}}.
- A foe who neither likes nor respects you underestimates you, and you can exploit that by surprising them {{LKCRim02opc#6}}.

Applying these values to foes is deliberate. Shepard's example is The Princess Bride: someone with an opposing goal can still like you, and a foe who hates you acts irrationally and aggressively, which players can exploit {{LKCRim02opc#2}}. Foes form opinions during combat from your fighting style, taunts, choices like showing mercy or rescuing hostages, and even impressive gear; outside combat, reputation precedes you {{LKCRim02opc#3}}.

What moves the values is personality. NPCs read events through personality flags. When you split treasure, the traditionalist Paladin respects you more while the selfish Rogue likes the gold but thinks you're a sucker; overheal the Paladin with a powerful scroll and he is insulted, while the survival-first Rogue respects it. The resulting values decide how each NPC answers requests and behaves in critical moments {{LKCRim02opc#7}}. Because the values are open to the procedural engine, magic can touch them too: charm moves like, respect and affection temporarily, then swings them the other way when it wears off {{LKCRim02opc#17}}.

> These two values can move alongside each other but we have to remember that they are two different distinct values that are not linked. {{LKCRim02opc#4}}

### The same idea elsewhere

Other games also go beyond a single reputation number. Brenda Romero singles out Jagged Alliance among tactical games for its mercenaries' web of likes, dislikes and hatreds, which decided who would work with whom and evolved as the player acted; some relationships overrode others, and mercenaries would quit if a buddy died through poor management {{_vf3HO3wn20#1}}. Aaron Reed's Blue Lacuna tracks the player's relationship with the character Progue on two axes, submission/dominance and romantic/paternal, moved by a library of more than 100 dynamic conversations, and classifies the result into one of 12 archetypes (a paternal but frustrated Progue becomes the "bitter dad") that change his behaviour, dialogue and plot options. Reed says this character simulation, not the environment, was what players remembered {{x0Xh4oCX9t0#2}}.

At faction scale, Caves of Qud ties its 60+ factions' preferences to generated history. Jason Grinblat explains that dogs, the only faction that starts out liking you, want secrets about humanoid settlements and the sultans they admire or despise, and you can trade such secrets to talking creatures for reputation after the ritual of sharing water {{ClGAApZYIvI#8}}. Enough reputation turns even the hostile goat folk friendly: they invite you into their villages and may fight alongside you {{kDKQM27U-Nc#15}}.

### Romance and companions

Shepard extends the model to romance and argues it should be opt-in, because the stakes are high and some players don't want it; once a player opts in, misfortunes are fair game {{LKCRim02opc#9}}. Affection is modelled as a single float from none to maximum that rises when an NPC inclined toward you sees you do things that raise like or respect, including how you treat others, as with being rude to a waiter on a date {{LKCRim02opc#12}}. The proposed payoff is mechanical rather than a cutscene: a partner who is a top-tier side-by-side combat ally of player-character strength, who inspires your followers and whose deeds with you enter the procedural history {{LKCRim02opc#10}}. Unrequited affection costs something too: an NPC into you who isn't loved back behaves differently and distractingly, and a player character who falls for someone may suffer combat debuffs or stutter. You may have to cut someone from the party or match them with someone else. Shepard compares this unfairness to starvation or misread scrolls; having opted in, the player asked for it {{LKCRim02opc#14}}.

Other games make a companion a resource with a price. Caves of Qud's high-Ego proselytize ability persuades a creature to join you, but you can hold only one follower that way, so converting a second loses the first {{kDKQM27U-Nc#16}}. In Sersa Victory's Rogue remake, inert golems come to life as bodyguards only if you sacrifice a magic ring into their chest slot, losing it for good, so you weigh the ring's power against a tough ally {{TeURjrAYFEU#11}}. Tyriq Plummer notes the ceiling of AI companions: a human party member can dig into a roguelike's full system complexity, building and operating a second Qud-style character to synergise with yours, in ways no AI ally can and that would be tedious for one player running several units {{neuJCYmbAG8#3}}.

**In practice:** track at least two dimensions of relationship per NPC, let personality decide how events move them, make them readable to the player, and attach concrete gameplay consequences, with an opt-in where the stakes are personal.

## Talking to NPCs: conversation, expression and the limits of believability

Relationships need a channel, and the most obvious one is talk. It is also where the illusion of a mind is most likely to break.

### Conversations, not kiosks

Most game NPCs are kiosks: they hold a fixed pool of lines and speak only when questioned. Johnson's goal for Ultima Ratio Regum is NPCs who converse like real people, with greetings, farewells and questions back to the player, whose behaviour depends on how the player answers {{qh9vyoMviJI#0}}. That ambition created a problem Johnson hadn't expected. When any of millions of NPCs might hold valuable information among hundreds or thousands of possible questions, players who like optimal play will ask every NPC every question, which is effective and boring {{qh9vyoMviJI#12}}. The fix gives conversation costs. NPCs get bored and end conversations sooner when asked about things they don't care for, and talk longer on topics they like; and within a cultural or religious group, word that you have been asking about a topic spreads extremely quickly, so others grow suspicious and refuse. The aim is to make players think about which questions to ask, of whom and how {{qh9vyoMviJI#13}}.

### Decoupling what is said from how it is played

Nic Junius locates the limit of dialogue elsewhere. In most games the player controls only what is said; the line reading, gestures and expressions are fixed to each choice, so each option can be played only one way, and the number of versions of a scene is capped however many options you write {{cDxL6JoxYQc#6}}. Breaking that coupling lets players play with the feel of a scene, acting out a character rather than picking lines, which Junius presents as a new dimension of interactivity and invites others to explore {{cDxL6JoxYQc#7}}.

> If we break the tight coupling between our dialogue lines and our reads and gestures and expressions we suddenly have the freedom to play with the feel of the scene. {{cDxL6JoxYQc#7}}

The approach has three parts that build on each other:

- **Every action is expressive.** Any action a character takes should convey something beyond its basic function that others can interpret and react to. Gestures need grounding in text and context to be readable; without it they are vague gestures at nothing {{cDxL6JoxYQc#8}}.
- **Annotate gestures with affect.** Fighting games describe each attack with frame data; Junius swaps danger and hit properties for emotional affect, so other characters can perceive the emotion a gesture carries and choose responses accordingly {{cDxL6JoxYQc#9}}.
- **A shared physical language.** Build a small language of physical actions that human and AI characters both use, so each reads the other's gestures through relationships and context. Junius's example has variants like pointing aggressively or lazily and shrugging nonchalantly or dismissively: a character who likes the first answers with a nonchalant shrug, and the first, deeming the occasion formal, points aggressively back {{cDxL6JoxYQc#10}}.

### When not to let NPCs talk

The other answer is to avoid the problem. Tim Keenan explains that Duskers uses logs instead of NPCs because its emotional pillars were isolation and realism, and a talking NPC would reveal itself as unreal since the AI "just isn't that good"; having everything already have happened was a huge benefit {{G5rq5ei2Lec#11}}. Framing can also do the work believability can't. G blekkenhorst wrote the digital entity in You Are a Strange Sensor as a fully static script for a self-absorbed character who isn't quite listening, asking players to touch artifacts and describe their texture and temperature. Players afterwards thought it had been responding directly to them; blekkenhorst attributes this to how used we are to computers misunderstanding us, which earns them a lot of benefit of the doubt {{uZdEXqRkBZA#8}}.

Reality television offers techniques for getting people to act without real conversation. Dennis Greger lists spotlighting a participant (point a camera at someone and wait), directing their attention to others ("there's something about the way Albert is looking at you"), and hinting that you know a secret you can't share, which sends people off to investigate {{50u5_hXZkv4#6}}. Greger describes them for human participants; they suggest NPC prompts that would need no dialogue model at all.

**In practice:** either give conversation real consequences and costs, so that whom you ask and how you ask both matter {{qh9vyoMviJI#13}}, or sidestep the limits of talking NPCs through framing, such as logs {{G5rq5ei2Lec#11}}, a character who isn't listening {{uZdEXqRkBZA#8}}, or prompts that point the player at something to do {{50u5_hXZkv4#6}}.

## Tensions and open questions

**Should monsters use items?** Nicholas Feinberg removed item pickup from Dungeon Crawl Stone Soup because optimal players spent the end of every fight hiding dangerous weapons, judging it a net improvement with some loss {{b8uoQHedFV0#9}}. John Harris describes Advanced Rogue going the other way, where item-using monsters made early levels deadly and denying them missile weapons became a tactic {{b45orGdFwi0#9}}. The choice depends on whether denial stays an occasional decision or becomes a ritual after every fight. Leif Bloomquist leaves a further question open for persistent worlds: if monsters carry items while no one is online, at what point do they become indistinguishable from players, and does it matter {{Y0K-e83wYnQ#12}}?

**One mind or many?** Lachlan Kingsford holds both positions on MCTS. A whole dungeon optimising one reward gives monsters shared perfect information, which works if the fiction supplies an omniscient controller {{9iTJ9Z8p0ao#6}}; per-monster rewards and search budgets make each creature a distinct character instead {{9iTJ9Z8p0ao#7}}. Which you want depends on whether your game's fiction has a mastermind and whether players should face a coordinated opponent or a crowd of individuals.

**How deep should NPC minds go?** Dustin Freeman's escalating concerns {{RYZSdPuvta8#8}}, Tarn Adams' nested villain networks {{4-7TtPX5uhg#22}} and Jim Shepard's personality-driven relationships {{LKCRim02opc#7}} all add depth, while Cat Manning's experience of Prom Week warns that characters whose moods change too fast become chaotic and frustrating, and Manning has no clear answer for making that complexity legible without simplifying it {{q7E1N-fJnrA#13}}. Nathan Savant shows how far cheap states and triggers can go instead {{rmddpcmIJ2I#0}}. The choice depends on how much of the machinery the player can observe: Adams' feedback loops pay off because players piece them together later {{4-7TtPX5uhg#22}}.

**Should NPCs talk?** Mark R Johnson and Nic Junius both invest in richer conversation, with costs for over-asking {{qh9vyoMviJI#13}} and a shared language of gestures {{cDxL6JoxYQc#10}}. Tim Keenan avoided talking NPCs in Duskers because the AI would reveal itself as unreal and break isolation {{G5rq5ei2Lec#11}}, and G blekkenhorst got the impression of listening from a static script {{uZdEXqRkBZA#8}}. The choice depends on whether conversation is the game's core verb or a risk to its tone.

**Unsolved problems.** Freeman does not know how a learned fear should spread (to one creature, its kin, its species or a new subspecies), and finds both threshold and single-instance rules unsatisfying; how a burdened creature is unburdened and how two escalating concerns resolve also remain open {{RYZSdPuvta8#12}}. Monsters that learn as you fight them were wished for at Rogue's own panel {{IaB7iQhts_c#14}}, and Thomas Biskup calls the hesitation fix for four-way dodging good enough for now rather than a final answer {{hnoF_bL-HjI#17}}. Jasmine Otto's multiscale plot generation, moving between faction and character levels, is stated as a goal rather than a finished system {{NjIDVIIg1lY#10}}.

## Checklist

- Can a player describe, in one sentence each, how your three most common monsters behave differently?
- Which monster rules can the player observe, predict and exploit, and which are invisible?
- How do your monsters notice the player: sight, noise, smell, or omniscience? Is that a deliberate choice?
- In multiplayer, how does a creature decide whom to target, and can players manipulate it?
- Do monsters interact with traps and items, and does any of that interaction create a chore after every fight?
- Have you tested what your monster rules do together with your other systems, and kept the surprises worth keeping?
- Is your decision structure the simplest one that expresses the behaviours you want, and will it survive adding reactions to new inputs?
- Is monster behaviour held in data you can log and tune, and do player and monsters share one implementation of actions?
- What does pathfinding cost in your game, and is it quietly deciding which creatures you can make?
- Do your NPCs act on what they know, rather than on the true state of the world?
- Are your NPCs' moods and opinions changing slowly enough for the player to follow?
- Do NPC agendas hook into systems the game already has, and do the triggers tell the story you intend?
- Are relationships tracked on more than one axis, and does each combination change how an NPC behaves?
- Do companions cost something, and are personal stakes such as romance opt-in?
- If NPCs talk, what stops the player from interrogating everyone, and if they can't talk convincingly, what framing replaces conversation?

## See also

- [05. Systems and emergence](05-systems-and-emergence.md): the interacting systems that monster rules plug into and the surprises they produce.
- [06. Combat and tactics](06-combat-and-tactics.md): the encounters, traps and tactical choices monster behaviour serves.
- [04. Learning and discovery](04-learning-and-discovery.md): how players learn creature rules across runs.
- [09. Level generation](09-level-generation.md): the maps that pathfinding has to work across.
- [12. Narrative and worldbuilding](12-narrative-and-worldbuilding.md): procedural history, factions and story sifting behind NPC agendas.
- [15. Architecture and tools](15-architecture-and-tools.md): action objects, data-driven behaviour and the engine plumbing for AI.
