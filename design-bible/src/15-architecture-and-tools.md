# 15. Architecture and tools

This chapter is about the program underneath a roguelike and the tools around it. It covers how to structure code so that hundreds of interacting kinds of content stay manageable, how to keep the rules apart from what the player sees, and how to build the editors, validators, debug views and servers that let a small team iterate on a generated game and see inside it. It matters because a roguelike's content keeps growing and keeps wanting exceptions, and an architecture that cannot absorb them slows everything else down: Danny Day watched Desktop Dungeons' release cadence slip from weekly to every two months for exactly that reason {{p48ArjJweSo#3}}.

The talks come at the subject mostly from shipped games and the people who built them, with toolmakers and a few researchers alongside. What makes them useful together is how often they converge. Developers working on very different games arrive at content held in data, behaviour split into small decoupled units, and a deterministic simulation sealed off from its presentation. Brian Cronin lists what solid architecture of this kind makes achievable: determinism, saves, replays, networking, undo, previews and testing {{jhcHlg7YhPg#0}}. The chapter follows that path from the diagnosis to the architecture to its payoffs, then turns to tools, validation, visibility, foundations and performance.

## In brief

- A roguelike's architectural problem is breadth, not depth: very many kinds of content, each tempted to become a special case, so plan around special cases rather than hoping clean data structures will make them go away {{JxI3Eu5DPwE#2}} {{isB82kORimk#4}} {{isB82kORimk#14}}.
- Write the rules once in a well-tested engine and author content as data that it interprets, as Tracery, Ultimate ADOM, Caves of Qud, Cataclysm, Hades and Backpack Hero all do, while keeping an escape hatch into code for effects the data format cannot yet express {{isB82kORimk#5}} {{iZUXjbcAfYs#13}} {{n6mKigS_71Y#0}} {{ziN33iMQVPo#4}} {{pXib0WTfLbI#10}} {{COeJTtSDd78#2}} {{qO3CIpP62Q0#7}}.
- Pull behaviour out of entities into small, separately addressable units (actions, commands or event handlers) so that each new behaviour does not need to know about every other one {{JxI3Eu5DPwE#5}} {{JxI3Eu5DPwE#6}} {{p48ArjJweSo#4}} {{jhcHlg7YhPg#7}} {{fGLJC5UY2o4#15}}.
- Isolate the simulation from its presentation: one serialisable state including the random number generator, control that flows one way, and a presentation layer that learns about the world only from emitted change records {{jhcHlg7YhPg#3}} {{jhcHlg7YhPg#6}} {{jhcHlg7YhPg#8}} {{qO3CIpP62Q0#12}} {{iZUXjbcAfYs#6}}.
- A deterministic simulation whose initial state and stream of commands or events can be recorded gives you saves, replays, bug reproduction, server-side verification and lockstep networking, but determinism has to be designed in from the start {{jhcHlg7YhPg#10}} {{p48ArjJweSo#11}} {{5VsM8bOywIY#3}} {{qO3CIpP62Q0#5}} {{DT9_7sW5knY#15}}.
- Pick the cheapest networking model your game's tolerance for input lag allows: turn-based games usually manage with deterministic lockstep, and rollback is for games, like a rhythm game, that cannot wait a round trip {{zwhNSbFVKQM#1}} {{UNBAoc0TJSs#5}} {{UNBAoc0TJSs#6}} {{R8DSq8qSJ44@15170#12}}.
- If you want modding, plan for it from the start, build your own content with the same system, and require mods to declare an API version from day one {{mES03vaZo3U#8}} {{KKwgKTbiEY0#4}} {{ke0cLTVg2_M#13}} {{mES03vaZo3U#9}} {{mES03vaZo3U#12}}.
- Judge a tool by its turnaround, the time between making a change and seeing it in the running game, and cut the cost of the operations you do several times a minute {{MJZvWgcxV0M#8}} {{NjYS8XmeaiY#8}} {{MJZvWgcxV0M#5}} {{5VsM8bOywIY#5}} {{dJbUmDsyJRw#12}}.
- Check data automatically where independently authored pieces meet, and let a machine play the real game headlessly to catch crashes and unwinnable builds before human testers see them {{FV_0rmqxbxw#3}} {{FV_0rmqxbxw#11}} {{ziN33iMQVPo#7}} {{Nnx33ctSmRA#10}} {{9iTJ9Z8p0ao#9}} {{9iTJ9Z8p0ao#11}}.
- A procedural game has no static scene to inspect, so build visibility in: an extensible debug menu early, raw data recorded from every run, and crash reports that arrive with the save and the trace attached {{0jFzBf0mCRY#5}} {{FV_0rmqxbxw#10}} {{QV57CYrIZow#5}} {{WeRCGy3-uPY#2}} {{QV57CYrIZow#10}} {{J4RK-3zW8vY#6}}.

## Why roguelike code rots: breadth, special cases and coupling

### The problem is breadth, not depth

Most game architecture advice was written for games whose hard problems sit inside each entity: physics, animation, rendering. Bob Nystrom argues that a roguelike's problem is different. Its entities do many different things, from inventory management to special effects, and there are a great many of them: he sets Fortnite's roughly sixteen kinds of monster against the 317 or so that Angband's wiki lists. That breadth, he says, is an organisational challenge rather than a technical one {{JxI3Eu5DPwE#2}}.

Breadth would be manageable if each piece of content behaved like the others. It does not. Kate Compton points out that roguelikes need lots of content and each piece tends to want custom behaviour, such as a different sound for the axe and the hammer {{isB82kORimk#4}}. And the problem gets worse as the game gets better: chess has few special cases, but a world full of weird generated things that should do something funny on the 4th of July is special cases forever. The more interesting the world, the more common and the more interesting its special cases become, so you should plan around them rather than hope clean data structures will make them go away {{isB82kORimk#14}}.

### How it goes wrong

The talks describe the same failure from several directions, and the convergence is worth taking seriously.

- **The if-chain.** Compton's warning sign is a giant chain of if statements in content logic. Its cost is repeated once per piece of content, or worse, so that is the moment to stop and design a data structure {{isB82kORimk#4}}.
- **The interaction matrix.** George Moromisato shows the same thing as a table: three swords times three creatures is nine cases to program, with a flaming sword doing extra damage to a yeti but something else to a dragon. Under modding the matrix becomes unfillable, because if one mod adds a fireball and another adds a magic creature, nobody decides what the one does to the other {{mES03vaZo3U#1}}.
- **Special cases spread through an inheritance hierarchy.** Day describes Desktop Dungeons' inheritance-based prototype, where gods spread through the code "like fungus". A god that disliked throwing needed a worship check on every throw; one that liked flying needed checks whenever an entity's movement changed. Every prototyping change meant rebuilding these tendrils, and the release cadence slipped from weekly to every two months {{p48ArjJweSo#3}}.
- **Managers that call each other.** Brian Cronin's example is an upgrade that says "when taking damage, discard the top card": the card manager calls the damage manager, which calls the upgrade manager, which calls back into the card manager mid-play. The code can re-enter itself and nothing owns anything, which makes replays and networking hard. He is strict about avoiding global state and singletons {{jhcHlg7YhPg#2}}.
- **Logic mixed with presentation.** On Monster Train, cards called managers that called back into objects, with on-discard effects triggered after animations, until everything relied on global access and, by late development, Cronin felt the codebase was a set of wires not to touch. He adds that Unity's game objects invite this by encouraging you to put lights, models and logic in one place {{qO3CIpP62Q0#11}}.

Old code rots in a further way: it accumulates assumptions about platforms and presentation. Thomas Biskup explains that modernising ADOM with graphics, sound and a modern UI was slow because the team was not building a new game but working on ancient legacy code never planned for anything graphical {{a3ZYDA2JVSM#19}}. NetHack's developers found that porting code for many systems combined with compile-time optional features made the source hard to navigate, so they made many options permanent to simplify it {{9V_CkJ66uJQ#6}}. Flexibility you do not use is still code you have to read.

### The counter-moves

Against this, the talks offer a small set of moves that recur in very different games.

**Decouple behaviours so complexity grows linearly.** Nystrom's actions (covered below) are fairly independent of each other, which lets him keep adding behaviours without feeling the quadratic complexity of the codebase getting worse {{JxI3Eu5DPwE#6}}. The point is not the action class itself but that each new behaviour should not have to know about every other one.

**Turn verbs into nouns.** Nystrom generalises this into a technique he says has always worked for him: when code lacks flexibility, take a verb in the program and make it an object. The operation can then be created in one place, run in another and given extra properties. The command pattern also makes undo in a level editor straightforward, because each command can undo itself and history is just a list of commands {{JxI3Eu5DPwE#8}}.

**Design each system in isolation with plug points.** Joel Clark describes how Blaseball adds mechanics on the fly: each system is designed as its own thing with a clean purpose and defined points other systems can call. A team roster is just a list of players with ways to add or remove one; other systems plug in to add a player, incinerate one or swap one with another team {{zO05p-e57AQ#16}}. On top of that, a modification players can carry can link any two systems together or add new rules to an existing system {{zO05p-e57AQ#17}}. Scott Kovach makes a related point about rule-based logic: behaviour can often be changed by appending rules or adding higher-priority ones, rather than editing old code {{s9Wyn9BJJI4#10}}.

**Reuse a system when the new thing fits its definition.** Kristen Yu describes a game at Improbable that had content explicitly called quests and other content that looked like quests but was not labelled as such. Recognising that these quest-like objects fit the general definition of a quest let the team deliver them through the existing quest system instead of building a second one {{WutTZ4FCHA8#5}}.

**Leave uniform hooks.** Alexei Pepers points to NetHack's per-slot equip functions: equipping boots of levitation runs the boots function, and there is a function for shields even though, as the comment notes, no shield needs special handling yet. The format stays uniform and future features or mods have somewhere to go; Pepers calls writing code a little further than strictly needed a brilliant way to save future problems {{5y_IAdOwaYs#9}}.

### Abstraction is not free

Structure has its own failure mode. Compton, whose advice runs through this chapter, admits that her specification-driven parser for any Tracery-like language, meant to generate programs and build editors automatically, was way overly complicated and probably not that useful; she changed direction after it {{E5-3Ui7oO8U#14}}. And a structure can quietly stop doing the job it was built for. In Stav Hinenzon's Sunshine Shuffle the chore queue was meant to show what was coming up, but responsibility drifted to the graph parser, chores rarely sat in the queue more than a few frames, and the queue ended up as little more than a tie-breaker for things that had to lock everything else {{MyVigc1nDig#5}}.

The practical rule that emerges is Compton's: introduce structure when you see the same kind of special case being written over and over, not before {{isB82kORimk#4}}. When you do, design for the special cases you know are coming rather than for every case you can imagine.

### Why it pays

Cronin gives the strongest reason to invest. Solid gameplay architecture is what makes determinism, save and load, networking, replays, undo and redo, effect previews and testing achievable. On Inkbound players could send replay files, often automatically, to reproduce bugs; on Monster Train the card-outcome preview was hard to implement precisely because the architecture was not solid {{jhcHlg7YhPg#0}}. The rest of this chapter is largely about how to get those benefits.

## Content as data: rules in the engine, things in files

### Don't whittle your own screws

If one position in this chapter has near-universal support, it is this: write the rules once, in an engine, and write the content as data that the engine interprets. Compton frames it as "don't whittle your own screws". Indie developers keep hand-making one-off solutions for each new connection problem, but most content needs fairly standard behaviour, so you should make a standard data structure for it, or better, find one (often in academic work), author many pieces as static data and run them all through one interpreter. Because there is only one interpreter, you can build and test it well; she credits this for Tracery's stability {{isB82kORimk#5}}. Her example of the payoff is Twine: once hypertext was formalised as nodes, text and links with an interpreter, many non-programmers built immense structures without writing a single if statement {{isB82kORimk#6}}.

> A lot of content requires pretty standard behavior, so make a standard data structure for it, or better yet find one. {{isB82kORimk#5}}

Biskup describes the same shape at the scale of a whole game. Ultimate ADOM is a core rules engine that knows all rules, interactions and subsystems, driven by an external configuration that describes items, monsters, quests and the rest, with platform-specific UIs and platform configurations (mobile versus desktop, for example) layered on top {{iZUXjbcAfYs#13}}. The motivation is the one Compton gives: you should not have to hide the rules of your game deep in code behind if-then-else special cases, and externalised data makes modding much easier {{fGLJC5UY2o4#2}}.

### The same move, game after game

The pattern shows up in very different projects, which is the best evidence that it is right:

- **Caves of Qud** defines content in XML files arranged in an inheritance tree; objects inherit properties from parents and can mix in others, and modders can overlay a partial definition that rewrites precise parts of the data tree {{n6mKigS_71Y#0}}. Ray lists how much sits in data: items, creatures, conversations, quests, population tables (what the game uses to pick random items), factions, books, player presets, even custom genders and pronouns {{n6mKigS_71Y#1}}.
- **Cataclysm** defines all its nouns (items, monsters, terrain, furniture, which limbs a character has, martial arts) and many of its verbs in JSON, according to Jeremy Rose {{ziN33iMQVPo#4}}.
- **Ultimate ADOM** uses JSON templates with inheritance, parameterised components and slots. A wall inherits from tile, which inherits from thing; it has a relative-size component, a parameterless "solid" component that blocks movement, and a material slot set to stone carrying resistances and hit point formulas. An orc warrior is a being with default equipment, profession and race slots and a default goal of killing the player that level definitions can override. Biskup chose JSON because modding then needs only a text editor {{fGLJC5UY2o4#11}}.
- **Hades** implements boons and hammers as traits. Alice Lai explains that every ability is defined by numbers in JSON (the Ares Blade Rift projectile has piercing, speed, range, damage rate, impact velocity, where zero means no knockback, and duration), and a trait adds, subtracts, multiplies or toggles those attributes {{pXib0WTfLbI#10}}.
- **Backpack Hero** started with hand-coded items, which forced items to be simple. Jasper Cole describes the refactor to an "item2" system in which an item is configured in the Unity inspector from drop-downs of trigger, effect, value and target: the wooden sword is "on use, damage, 7, selected enemy". Most of the roughly 865 items use it, and modders can use the same system {{COeJTtSDd78#2}}.
- **Monster Train** represents a card as data pointing to parameterised effect scripts. Torch has a CardEffectDamage effect with a target mode and an integer; its description text hooks into that value, so changing the damage from 2 to 3 updates the card text in every language without re-translation {{qO3CIpP62Q0#6}}.
- **Spry Fox** keeps most design content in YAML. Patrick Kemp's reason is that text files are searchable, support find-and-replace and copy-paste, and let designers use mature IDEs and their extensions instead of custom editors; graphical tools are kept for things like terrain and set pieces {{rWPJ5fW1UH8#0}}. Configs can include named, reusable blocks, both for boilerplate and to compose behaviour from several sources, and are expanded at generation time into the final configs the engine reads {{rWPJ5fW1UH8#3}}.
- **Angband and Sil-Q** keep monster and item attributes, placement, names and tile assignments in text files. That let Joel Ryan, a non-programmer, do all of Sil-Q's tile assignment himself, cutting an inherited 4,600-line file down to about 1,400 lines {{UIsNv3UOzvA#3}}.

The same move works for behaviour that looks like it must be code. Johnathan Pagnutti expresses a Slay the Spire enemy's state machine as two tables: a states table giving each move's block, damage and strength, and a transitions table of probabilities, so a row reads "60% of the time after Chomp, Jaw Worm will Bellow" {{Uf34SbuWIos#3}}. Paris Buttfield-Addison describes Yarn Spinner node groups that act either as pools, where many nodes qualify and the least-seen one is dealt out (rooms, random events, barks), or as rules, where conditions do not overlap so exactly one passes: an if-else in which each branch can be added without touching the others {{R8DSq8qSJ44@22364#10}}. The shape of the data matters too. Liza Knipscher moved Bioloom's creature genes from a recursive tree, which was impossible to work with, to a flat list of body parts, each with a path of socket IDs (an eye at 0, 0, 1 is on torso socket zero, then the second position on the head), with colour and size layered on top {{jBhcHdV5HHo#15}}.

### What data buys you

The talks name a consistent set of benefits:

- **Safety and reuse.** Compton notes that JSON content can be copied in large chunks from someone else's work, checked with an online linter, and run safely even when strangers wrote it. George Buckenham's server runs around 500 strangers' bots without restarts, which she says would be inadvisable with arbitrary JavaScript {{isB82kORimk#3}}.
- **Authors who are not programmers.** Benjamin Berman observes that when you get other people to write cards, the first thing they feel is that they do not want to write code; he points to Paradox games and Civilization as succeeding with modding through big structured data {{DT9_7sW5knY#16}}. Ryan's tile work on Sil-Q is the same point in practice {{UIsNv3UOzvA#3}}.
- **Tools that see the whole game.** Because Cataclysm is data, Rose could build an external guide that indexes it, after answering questions by hand-searching for an item's ID and then for what dropped it became too tedious {{ziN33iMQVPo#4}}. Data has structure you must respect, though: showing where an item spawns meant collapsing palette, mapgen and location into one apparent link, and he would consider a triple store for richer queries if rebuilding {{ziN33iMQVPo#10}}.
- **Future generators.** Berman adds that structured card data suits future card generators; in his view the obstacle to machine-learned card generation is a large dataset of cards in a usable representation {{DT9_7sW5knY#16}}.

### Where data stops

Data-driven design has limits, and the talks are specific about where they are.

The first is expressiveness. Cronin found Monster Train's script-per-effect cards worked for independent, linear effects but broke down when effects depended on each other or scaled. X-cost cards like Vent relied on invisible card traits that modified damage implicitly inside a character's bonus-damage calculation, so designers lacked control and engineers ended up writing custom traits and effects for specific cards {{qO3CIpP62Q0#7}}.

The second is what you forget to put in data. Hinenzon argues that timing is essential in any narrative game and designers should control it, but in Sunshine Shuffle the timing of conversation, poker and pacing lived in float variables scattered across C# scripts, some tied to how long UI stayed hidden. Programmers had to step in to tune it, at a cost in iteration time {{MyVigc1nDig#4}}. If a parameter shapes the player's experience, it belongs where designers can reach it.

The third is deliberate: not everything should be configurable. Biskup fixes a middle layer of core RPG rules (attributes, dodge value, protection value) and never intended to let arbitrary rules be injected into Ultimate ADOM, because the more generic an engine gets, the more complicated it becomes. Knowing those rules lets the team store data directly in entities, making lookups and changes easier {{fGLJC5UY2o4#1}}.

**In practice:** put things (items, monsters, terrain, cards, encounters, text, tuning numbers and timings) in data; keep the core rules and the interpreter in well-tested code; and give data an escape hatch for the genuinely special case. Caves of Qud's is explicit: data can attach C# "parts" to objects when behaviour needs real code {{n6mKigS_71Y#0}}. Ultimate ADOM does the same by mapping names in JSON to C# classes, so a modder can drop in a new effect class (see the next section) {{fGLJC5UY2o4#16}}. When a card or item needs custom code, treat that as a sign that the data format is missing a concept, as Cronin's Vent example shows {{qO3CIpP62Q0#7}}.

## Modelling entities: ECS, components and the alternatives

### Where ECS came from

An entity component system (ECS) splits a game object into an entity (an identity), components (data, sometimes with behaviour) and systems (logic that runs over entities with particular components). Nystrom traces it to real-time AAA games of the 1990s, whose game-object classes ran to around 20,000 lines mixing AI, physics, animation and rendering. Pulling each domain into its own component made the entity a bag of components, the game loop ran each domain as a separate phase, and storing each kind of component in a contiguous array avoided cache misses that can be two orders of magnitude slower, which mattered as RAM speed fell behind CPUs {{JxI3Eu5DPwE#0}}.

### The debate: does it fit a roguelike?

Nystrom's position is that classic domain-split ECS is a poor fit for turn-based tile roguelikes. Their physics and graphics are trivial and nearly all the complexity is in AI, so splitting a monster by domain yields a lopsided result: useless animation and physics components and one AI component that does everything. When he polled his audience, only about three people had performance problems traced to cache misses {{JxI3Eu5DPwE#1}}. Wanting ECS without those problems, he says, is like asking a doctor for a C-section when you are not pregnant.

Biskup is the enthusiastic counterweight. He had not heard of ECS until a conversation with Josh Ge of Cogmind at the previous Roguelike Celebration, and Ultimate ADOM adopted one, modified to handle very large numbers of entities {{iZUXjbcAfYs#16}}. But his ECS is not the pure version, in which an entity is only an ID, a component only data and a system all the behaviour. For roguelikes he disagrees with that: in Ultimate ADOM entities are both identifiers and data containers, components hold data plus simple related behaviour (a hit point component knows how to react to damage), and systems handle only complex, reusable logic. Because the game has a fixed core rule set, data can live in the entity; he reports better modularisation and easier modding {{fGLJC5UY2o4#0}}.

The two are less opposed than they look. Nystrom is rejecting the split by *domain* and the performance argument {{JxI3Eu5DPwE#1}}; the benefits Biskup reports are modularisation and modding, not cache performance {{fGLJC5UY2o4#0}}. What the choice depends on is whether your game needs things to change what they are at runtime, which is where Biskup's examples are strongest {{iZUXjbcAfYs#18}}.

### What components buy

Biskup's demonstrations show composition doing things inheritance makes hard:

- **Soul swapping.** To swap the player's soul with an orc's, remove the UI-control component from the player and add it to the orc; because the systems already interpret the components, that is enough. He says this was impossible in ADOM and would have taken hundreds or even a thousand lines in ADOM 2 {{iZUXjbcAfYs#17}}.
- **Changing kind.** ADOM 2's object-oriented design made turning one type of thing into another very hard because they sat in different inheritance hierarchies. With components, a possessed player's lifeless body loses its "being" aspect and gains an item flag, so it can lie on the map or be picked up, though Biskup admits a complex item with equipment, slots and body parts raises its own interaction questions {{iZUXjbcAfYs#18}}.
- **Slots.** Ultimate ADOM's slots plug grouped features onto an entity as swappable sub-entities. They began so that alchemy could turn an iron sword into a mithril one by swapping the material slot, and were extended to race and profession, so a dwarven warrior gets a Dwarf slot and a Warrior slot whose components attach without explicit definition {{fGLJC5UY2o4#10}}.
- **Composed effects.** A battle axe of sharpness inherits from battleaxe and adds an "of sharpness" suffix slot whose triggered-effect component listens for the melee-damage event and runs a list of reusable effects; fire or paralysis could be added to the list. A reflection-based JSON parser maps names to C# classes, so a modder can add a new class implementing a one-method effect interface (actor, cause, target position, target) {{fGLJC5UY2o4#16}}. The amputation effect itself is about ten lines, because it delegates to shared systems: grafting picks and removes the body part, item management drops it, and a blood system handles bleeding {{fGLJC5UY2o4#17}}.

Rich Wilson makes the same case for immersive sims in a sentence: component-based approaches help because you can say "this thing emits fire" and put that on whatever objects you want {{wtlLa7BGZcs#17}}. Biskup also reports that an early Java ECS prototype ran a single level ten times the size of all ADOM's levels combined, with millions of entities, efficiently, though he doubts players want levels that big {{iZUXjbcAfYs#27}}.

### Lighter alternatives

Nystrom offers two patterns that get most of the composition benefit without a full ECS.

**Capability objects.** Instead of an item inheritance hierarchy, which breaks once you want a sword that shoots fireballs, Nystrom gives each item separate fields for capabilities such as attack, defence and use. A fireball-shooting sword or a shield that bashes is just a different mix. "Use" is itself a shallow, wide polymorphic hierarchy, the case where he thinks inheritance works well. He describes it as components split by capability rather than domain, it suits defining content in data files and building item kinds procedurally, and he uses the same idea for monster special moves {{JxI3Eu5DPwE#3}}.

**Type objects.** Twenty goblins share most of their properties, so rather than storing that state in every monster, a single Breed instance holds it and each goblin points to it, keeping only its own position and health. Because Breed is effectively a metaclass, you can add features like a parent breed with your own inheritance rules. Nystrom uses the same pattern for tile types, item types and item modifiers {{JxI3Eu5DPwE#4}}.

Biskup arrived at the same ideas from the ECS side. An ECS needs a typing mechanism, he says, because defining an orc as "having these 37 components with certain values" is crazy; Ultimate ADOM uses named entity templates with multiple inheritance, so an orc warrior or orc shaman still counts as an orc, and a few definitions cover 400 to 500 monsters needing 20 to 30 components each {{fGLJC5UY2o4#7}}. And since one orc warrior can be 30 to 40 entities (race, profession, body parts, items, materials), entities refer to a shared template for as long as they can and copy only changed data locally, flyweight-style. An uninjured orc warrior is an ID plus a template reference; a thousand of them cost little memory {{fGLJC5UY2o4#8}}. Breed objects and entity templates are the same answer to the same problem.

NetHack shows how far a small piece of data-driven polymorphism can go. Pepers describes how it maps each humanoid body part to an equivalent for each body plan: a jelly has a pseudopod for an arm and a dark spot for an eye, animals have forelimbs and claws. A body-part function takes the humanoid term and the creature and returns the right word, so a bear trap closing on your "foot" reads correctly for a polymorphed player or a steed, with exceptions such as sharks having skin rather than scales. Pepers called it her favourite technique: very specific output handled generically {{5y_IAdOwaYs#4}}.

### The costs

Composition creates combinations nobody designed. Biskup lists Ultimate ADOM's: mis-routed events let a player standing on a spider's severed part spin webs; a backpacked orc arm still holding a club gave a third melee attack; opening an animated door replaced the entity and lost its animation; a typing bug turned a sword made of iron into a material itself {{fGLJC5UY2o4#18}}. Structural changes are expensive too: animating a wall into a living being means a tile that is a wall must also become a being, changing its type hierarchy at runtime, which he calls complex and wide-reaching and something to plan for if you want such transformations {{fGLJC5UY2o4#9}}.

**In practice:** if your game is turn-based and your monsters do not need to change kind, Nystrom's capability fields and type objects give you composition and shared data with little machinery {{JxI3Eu5DPwE#3}} {{JxI3Eu5DPwE#4}}. If things must transform (possession, animation, transmutation), components and slots earn their cost, but budget for templates, event routing and a class of emergent bugs {{fGLJC5UY2o4#7}} {{fGLJC5UY2o4#18}}. Either way, choose granularity by capability, not by engine domain {{JxI3Eu5DPwE#1}}.

## Turns, actions and events: where behaviour lives

Once entities are mostly data, the question is where the code that makes things happen should go. Two models dominate the talks, and several others are worth knowing.

### Actions: a turn as an object

Nystrom represents each turn as an Action object, applying the command pattern. Speed systems are the reason: a loop of "the hero moves, then every monster moves" cannot handle actors acting at different rates. His loop gives each actor energy according to its speed; when an actor crosses a threshold it is asked for an action, which the loop performs, iterating as consequences percolate. An action like walking, which may open a door or start an attack, carries a lot of code that would otherwise bloat the actor class, leaving actors as mostly data {{JxI3Eu5DPwE#5}}.

> You can think of it as a first-class turn. {{JxI3Eu5DPwE#5}}

Cronin's black box simulation (see the next section) uses a stricter version. Every state change goes through a self-contained, serialisable world command whose resolve function takes a world state, so there is no global state; a heal-once-per-turn command takes a target team and an amount. Commands never create or call other commands; shared logic goes into static helper functions, and serialised commands are how Inkbound's networking worked {{jhcHlg7YhPg#7}}.

### Events: logic in listeners

Day's answer to Desktop Dungeons' fungal gods was to move all gameplay logic into handlers. Game objects only store state; handlers listen for events, change state and emit further events. A throw emits a throw event; the throw handler, if a potion hits an enemy, emits a quaff event; the potion handler emits begin-levitating; and a god handler can listen to all of these and approve or disapprove, so every god-specific line sits in one place {{p48ArjJweSo#4}}. Each player input starts a cascade through an event queue, and the turn ends when every emitted event has percolated through: a grid click becomes a move event, the movement handler issues reveal events for new tiles, and a regeneration handler hears reveals and updates health and mana {{p48ArjJweSo#5}}. What makes the system earn its keep, Day says, is that handlers can be added and removed at runtime: a damaged enemy gets its own regeneration handler, which listens for reveals and destroys itself once health is full, so nothing has to loop over every enemy asking whether it is hurt {{p48ArjJweSo#6}}.

Biskup's Ultimate ADOM uses events in the same role. Its movement system knows nothing about solidity or spells; it fires events at six to eight phases (alter direction, bump interactions, leave old cell, enter new cell, finish), and any component on the entity or the map cell can intercept them. Confusion alters direction, bumping opens doors or attacks, a bear trap or glue blocks leaving, a cell spell deals damage on leaving, a force field blocks entry, and none of it is if-else code in the movement system {{fGLJC5UY2o4#15}}. Components call systems directly for complex, reused operations like amputation, and everything else is event-driven. Biskup says the event routing was the hardest part to build, because of caching, performance and the fact that adding or removing a component changes the routes; once working, it is a stable base that decouples components {{fGLJC5UY2o4#6}}.

The convergence here is real: Nystrom, Day, Cronin and Biskup all pull behaviour out of the entity and into small, separately addressable units, whether called actions, handlers or commands.

### Costs and fixes

Events trade readability and predictability for flexibility, and the talks give specific remedies:

- **Ordering.** Desktop Dungeons keeps ordering deterministic with fixed handler priorities (god handlers sit high), and breaks event loops by splitting a handler into a high-priority and a low-priority half, where the low half can never issue an event the high half cares about. Day says the real problems were mismatches between UI and game state, not random ordering {{p48ArjJweSo#16}}. Hades shows what happens when ordering is assumed not to matter: Lai describes trait systems that were supposed to be order-agnostic but were not, so a Dionysus poison fog combined with a certain shield instead detonated repeatedly {{pXib0WTfLbI#11}}.
- **Readability.** To recover what decoupling hides, Desktop Dungeons has a verbose-events debug mode: break when a specific event is handled or passed between systems, print everything that happened to it, and step through the saved event log. Good event names keep it workable {{p48ArjJweSo#15}}.
- **Performance.** Day is frank that dynamic event handlers are not performant, with cache misses guaranteed, which makes them a poor fit for real-time games. For turn-based games it is fine: early on the team logged thousands of events per frame without big drops, and the largest queue in Desktop Dungeons is around 50 events {{p48ArjJweSo#12}}.

### Coroutines: for and against

Berman argues that a card-game rules engine should use the language's own coroutines, fibers or async rather than a homemade virtual machine, so that the code's call stack mirrors the game's logical call stack: when something receives damage, you should see a receive-damage function on the stack, which makes debugging far easier {{DT9_7sW5knY#14}}. Cronin, from Monster Train, sees the downside. A coroutine keeps a timed sequence (animate, wait 0.8 seconds, resolve the death trigger, animate) readable in one place, which suits prototyping, but it bundles UI, input, sound and game logic together with no separation of concerns, and Monster Train ended up running its whole game loop as one giant coroutine {{qO3CIpP62Q0#3}}. The difference is what goes in the coroutine: Berman is describing pure rule resolution; Cronin's trouble came from mixing presentation timing into it.

### Other shapes

Several narrower patterns solve particular problems:

- **One controller for everyone.** Leif Bloomquist's Commodore 64 multiplayer roguelike runs a Java server in a loose model-view-controller split where all entity actions, from players and monsters alike, pass through the same controller, so monsters interact with the world the same way players do {{Y0K-e83wYnQ#7}}.
- **Priority queues for blocking events.** Sunshine Shuffle feeds dialogue and poker events as "chores" into one priority queue; blocking events like an all-in or a showdown get higher priority and lock out conversation until resolved, after which a marker returns to the conversation {{MyVigc1nDig#2}}.
- **Finite state machines.** Compton notes that locked and unlocked chests, alive and dead, and menu navigation are all finite state machines, and the interpreter is the hero: one director tracks state instead of every chest checking itself every frame {{isB82kORimk#8}}.
- **A single mechanism.** Dustin Freeman's Spirit of the Ages expresses all AI as concerns, with no meta-controller: each entity is a bag of concerns, and a concern that wants control must raise its own probability, which may provoke reactions from others {{RYZSdPuvta8#9}}.
- **Interpreters over reported actions.** Spencer Egart's ritual spells report every game action to an interpreter that tracks progress through each ritual's steps, tolerating a few intervening actions (taking out chalk before drawing) but timing out so a spell cannot fire by accident hours later; on completion it calls the game's existing spell system {{q4Tf0vf2kiI#7}}.
- **Indexed triggers.** Mark Johnson stores generated riddle solutions as tuples keyed by action type, then exact coordinates and optional modifiers, indexed per map zone, so on each action only that zone's triggers with a matching action type are examined. His example is holding up a sword with particular properties at specific coordinates at night under a full moon {{RDWt6RGN9wM#8}}.

### Choosing

Use **actions or commands** when you need a clean unit of turn, for speed systems, undo, replays or networking {{JxI3Eu5DPwE#5}} {{jhcHlg7YhPg#7}}. Use **events** when many independent rules (gods, traps, curses, mods) need to react to the same moments without knowing about each other, and pay for it with explicit priorities and an event log {{p48ArjJweSo#4}} {{p48ArjJweSo#16}} {{p48ArjJweSo#15}}. Use **coroutines** for rule resolution whose call stack you want to read in the debugger, but keep presentation timing out of them {{DT9_7sW5knY#14}} {{qO3CIpP62Q0#3}}. The models combine: Ultimate ADOM calls systems directly for heavy operations and routes everything else as events {{fGLJC5UY2o4#6}}.

## Isolate the simulation: state, logic and presentation

### The black box

Several talks arrive independently at the same architecture: a simulation that knows nothing about the screen. Cronin calls it the black box sim, and its most important principle is strict separation of four things. Static data (a tank definition) does not change and is loaded from disk or the network; state (ten tank instances with different HP) lives in memory; logic, driven by the player or the system, acts on state; and presentation (UI, animation, sound) tells the player what happened. The interfaces between them should be strict and clear {{jhcHlg7YhPg#3}}.

> Strict separation of data from state, logic, and presentation. {{jhcHlg7YhPg#3}}

After Monster Train, Cronin advocated an isolated world state modified only by a world engine that processes commands and outputs world state changes, to which presentation systems such as sound, animation and achievements subscribe. Commands do not map one-to-one to changes: damage may or may not cause a death. He likens it to model-view-controller, with game objects becoming a view into the state that never needs to touch engine code {{qO3CIpP62Q0#12}}.

The cost of not doing this is clearest in ADOM. Biskup calls its biggest technical problem a user interface that is not separated from game logic but runs through all the code, which makes a viable mobile version practically impossible; the team tried and concluded it was too hard, which motivated a new architecture {{iZUXjbcAfYs#6}}. Ultimate ADOM's answer runs the engine on a separate thread from the Unity UI. Because two threads invite trouble, such as the UI showing damage on an orc the engine has already killed, the engine sends minimal "UI signals" carrying the data the renderer needs, plus a few specifically synchronised queries; Biskup found little data actually needs to cross {{fGLJC5UY2o4#5}}.

### The techniques

The details converge across talks:

- **One serialisable state.** Cronin keeps all simulation state, including the random number generator, in a single highly serialisable world-state structure, mostly integers keyed by entity, with a read-only interface. He avoids floating point himself {{jhcHlg7YhPg#6}}.
- **One-way control.** Input and UI tell the sim what the player wants; the sim never calls back up into them. Cronin compares the sim to an API with strictly formatted inputs and outputs, and says the principles come from 16 years of building shoddy gameplay architecture {{jhcHlg7YhPg#4}}.
- **Presentation reads only change records.** World commands emit world-state-change records carrying everything presentation needs (unit healed, previous and new HP), which drive VFX, animation and sound and are never read inside the sim. Because commands resolve instantly, anything that needs animating must be fully described in a state change {{jhcHlg7YhPg#8}}.
- **UI last.** Desktop Dungeons separated UI from logic within its event system by giving UI handlers the lowest priority, so they see each event only after every game handler has modified it; otherwise the UI might show experience gained before an angry god docked some. The team also added the ability to inject events mid-queue, after the current event or at the end, such as a UI refresh {{p48ArjJweSo#8}}.
- **State as values.** Lachlan Kingsford, using Monte Carlo tree search to balance games, says the game state should be held in memory with actions as pure functions that return a new state without side effects, so many hypothetical moves can be computed quickly; pure functions also let you replay from any point for fuzzing {{9iTJ9Z8p0ao#2}}. Berman recommends storing state in an arena allocator such as Cap'n Proto so it can be copied and sent as byte buffers for multiplayer and for AI that copies state; anyone who has written "entity" in their codebase, he says, has already reinvented one {{DT9_7sW5knY#15}}.
- **Output as data.** Kovach's relational engine takes the idea to its end: rules map game facts into output relations (DOM nodes or grid glyphs) that a small driver outside the engine interprets, and mutable slots like equipment are modelled by aggregating equip and unequip events {{s9Wyn9BJJI4#11}}.

### The payoffs

The benefits are the ones Cronin listed at the end of the chapter's first section {{jhcHlg7YhPg#0}}, and the talks give concrete cases. Because Inkbound's sim was isolated, its game server ran it as a pure C# program without Unity at all, efficiently on Amazon EC2; Cronin adds that an isolated sim could even be written in a different language from the engine {{jhcHlg7YhPg#5}}. An isolated state is far easier to serialise for saves and networking, and Monster Train missed features because it lacked one: server-side run verification against cheating and mid-battle saves were both too much work; snapshots could also have supported rollback or run history {{qO3CIpP62Q0#13}}. Previews need a deterministic simulation, which Cronin says must be designed in from the start, because random number generation and cross-platform floating point both break it. Monster Train did not do that, so sound effects and warnings had to be special-cased for preview mode throughout its coroutine loop {{qO3CIpP62Q0#5}}. The sections on presentation and on saves, replays and networking below follow these payoffs through in detail.

The same lesson comes from Berman: without designing state for copying up front, he faced a years-old card base that could not easily support multiplayer or a textbook AI, requiring months of rewriting {{DT9_7sW5knY#15}}. Berman, Cronin and Biskup each found that this separation is far cheaper at the start than later {{DT9_7sW5knY#15}} {{qO3CIpP62Q0#5}} {{iZUXjbcAfYs#6}}.

### Retrofitting, and living with coupling

None of the talks offers a painless retrofit. Biskup's experience with ADOM is that it may be impossible, and his route was a new engine, though he credits the graphical interface layer the team used for teaching them to separate engine from graphics cleanly {{iZUXjbcAfYs#6}}. Day's UI-last priority shows a smaller step that works inside an existing event system {{p48ArjJweSo#8}}. If you must keep a coupled codebase for now, Cronin's advice from Monster Train is to log extensively, with filterable categories such as gameplay and audio; that was the main way the team followed its callback chains, and he now advocates not using callbacks at all {{qO3CIpP62Q0#14}}.

## Presenting a turn-based world: animation, timing and text

Once the simulation is a black box that takes commands and emits state changes, something still has to show the player what happened. That presentation layer has two jobs in a roguelike: turn instantaneous rule resolution into motion the player can follow, and turn game state into readable sentences. Both go best when the presentation only ever reads from the simulation and never feeds back into it {{jhcHlg7YhPg#9}}.

### Time lives in the presentation, not the simulation

Cronin states the rule plainly for his black-box simulation: it is "a computing machine" with no concept of time or animation. Players need animation to understand what happened, so the presentation layer takes the emitted state changes and sequences them over time (the card play, then the unit move, then the sword swing), one way only. By the time the animations play, the simulation has finished and the commands and changes are gone; the animations are self-sufficient. Cronin admits he is not fully happy with his own animation side {{jhcHlg7YhPg#9}}.

The hard part is what that sequencing has to respect. Jeremiah Reid calls synchronising animations with the logical order of simultaneous turn events the hardest part of juicing a roguelike. If every animation simply plays out at once, a monster can visibly step away before the arrow fired at it has landed. He did not attempt it for his talk's prototype, and such glitches remain in Golden Krone Hotel because scheduling animations is a lot of work {{xSYVQc7cH-4#18}}. Put Cronin and Reid together and the requirement is clear: the presentation needs the simulation's changes in order, with enough structure to know which ones must wait for which. A flat list of "things that moved" is not enough.

### Techniques for scheduling animation

- **Scale everything by elapsed time, then lie about time.** Reid scales every animation by the frame's elapsed time, so a skipped frame means the next frame animates twice as far and choppy frame rates smooth out. Once every animation uses that clock, one global time multiplier can slow everything down to inspect motion that looks wrong, slow it for drama, or speed it up so animation never blocks the player {{xSYVQc7cH-4#7}}.
- **Compose effects from atoms in blocking and concurrent lists.** Thomas Robertson builds procedural super attacks from small atomic effects held in a list that ticks and draws each atom and removes it when it finishes. Atoms can spawn atoms, so a projectile creates an explosion when it arrives, which makes chaining flexible {{f1t4yPjfZyM#1}}. He keeps two lists, a blocking list whose atoms play one after another and a concurrent list whose atoms play at once, because complex attacks need both; in his code an atom can carry child atoms that move into the concurrent list when it finishes, so they all start together {{f1t4yPjfZyM#3}}. This is a small, general answer to Reid's ordering problem: "the arrow lands, then the monster moves" is a blocking sequence, and the explosion's particles are concurrent children.
- **Use a fixed timer when you need exact frames.** Patrick Devine, recreating NES Tetris in a terminal, adds a fixed 60-frames-per-second timer to the clear-update-draw loop so every frame matches the original; he notes other approaches suit sprites, but for blocky terminal movement a timer works best {{ckDp6p4HbqA#2}}.
- **Let data draw itself while prototyping.** Robertson's prototyping approach declares game data as "smart variables" with limits and lists that can draw themselves into any screen rectangle. The main loop just asks the data to draw itself; inventories lay themselves out, and drag bars let him tune values such as movement speed live. It is a developer tool rather than player-facing UI, and he says it gets you about 80% of the way {{H6fPIhLoA1Y#0}}.

### Text is presentation too

A roguelike tells much of its story in generated sentences, and the same principle applies: generate text from the state, do not hand-write it beside the state.

NetHack shows the small version. It wraps message output in a function named `You`, so that the many messages phrased as "You feel hungry" read as plain English in the source; Pepers calls this clever naming that hides the formatting cruft around the underlying print call {{5y_IAdOwaYs#6}}.

Caves of Qud shows the large version, and what it costs to retrofit. Brian Bucklew and Corey Frang describe the localisation rebuild:

- **Replacers instead of a replace loop.** The original templating ran a text replace for every possible placeholder over every string. That was fine with about 20 replacers, worse with 200 and poor with a thousand. The new system matches a placeholder such as `subject.direction` to a function named `Direction` marked with a C# attribute, which gives constant-time lookup and lets modders add replacers without editing one giant function {{R8DSq8qSJ44@5367#2}}.
- **Typed arguments.** At 1.0 the templating was used reliably only in conversations and object descriptions, with inconsistent grammar helpers elsewhere. For localisation the replacers had to accept rich arguments (factions, numbers, calendars, historic entities, lists, booleans) as typed method parameters, with argument types detected at runtime to pick the right replacer. The example shows why: "the gnu sees a snapjaw to its north and stops grazing" and "you see a snapjaw to the north and stop grazing" differ in both conjugation and articles {{R8DSq8qSJ44@5367#3}}.
- **Wrap every string with context for translators.** Following GNU gettext, every translatable string is wrapped in a call, `_S` for static strings and `_T` for templates, whose first argument is a human-readable context such as "inventory take from direction". The context is exported to the translators' file but never shown in game, which matters because the templates themselves are hard to read. `_T` returns a chainable builder for arguments, including some English does not use but other languages need {{R8DSq8qSJ44@5367#4}}.
- **Extract strings from the source mechanically.** The team parses its C# with Microsoft's Roslyn analyzers, collecting every `_T` and `_S` call with its context, file and line into a strings XML table of about 6,000 lines so far. Exported example files prefix every value with a right-pointing triangle, which proved an unexpectedly useful marker of what still needs translating; XML game data goes out through the modding framework's merge support, with C# attributes marking fields that hold display text {{R8DSq8qSJ44@5367#8}}.

What is still missing is telling. Translators mostly work in raw XML with no in-game view of a string in its context, and the team calls tooling one of its big unknowns; the same tool would help English authors write procedural templates {{R8DSq8qSJ44@5367#13}}.

**In practice:** keep presentation one-way. Have the simulation emit ordered changes and let an animation scheduler with blocking and concurrent tracks play them back on its own clock, with a global speed multiplier for debugging and for impatient players {{jhcHlg7YhPg#9}} {{f1t4yPjfZyM#3}} {{xSYVQc7cH-4#7}}. Treat text the same way: build sentences from typed game data through named, discoverable template functions, wrap every player-facing string so it can be extracted, and give writers a way to see a template rendered in context {{R8DSq8qSJ44@5367#2}} {{R8DSq8qSJ44@5367#8}} {{R8DSq8qSJ44@5367#13}}.

## Saves, determinism, replays and networking

Saving a game, replaying it, undoing a move, verifying a run on a server and playing it over a network look like five features. The talks treat them as one question: can you serialise the game's state and the changes to it, and replay those changes deterministically? If you can, each feature is a short step {{jhcHlg7YhPg#10}}. If you cannot, each is a separate, painful retrofit.

### Serialise the changes, not just the state

Day describes the most striking payoff. Desktop Dungeons stores save games as serialised strings of handled events, such as "player built a building", replayed on load. When content is removed, an event with no handler simply fizzles, and because only handled events are stored, saves prune themselves. Across two and a half years of early access players never needed a progress reset; a save-size bug surfaced only three years in, which a reset at release would have hidden {{p48ArjJweSo#11}}. The same stream gives replays almost for free, and Day regrets not building gameplay replays from the start, because retrofitting them proved too complicated. For undo he recommends keeping a stack of game-state snapshots, perhaps one every 20 events, and replaying inputs from the nearest one, rather than making every event reversible, which gets complicated with long chains {{p48ArjJweSo#13}}.

Cronin reaches the same place from the other direction. With all world state in one structure, save and load is serialising that structure, networking is syncing world commands, and a replay is the initial state plus the commands, or just the state changes. Animation and player input usually break determinism, but in his design they sit outside the simulation as its outputs and inputs. Inkbound synchronised world commands over very little bandwidth, and a bug can be reproduced by checking out the matching git commit and running the simulation until the same error appears {{jhcHlg7YhPg#10}}.

> You can serialize the world commands and the initial world state to regenerate the replay. {{jhcHlg7YhPg#10}}

### Store only what generation cannot recreate

A procedurally generated world can be regenerated from its seed, so the save need only hold the difference. Greg L describes a PICO-8 game with generated stone and trees that remembers what you dug out across reloads: at generation it records every destructible object, and the save packs one destroyed-or-not bit per object as tightly as possible. He suggests the approach for web games, online saves and huge maps {{oj3xA28N60I#2}}. The idea is old. Aaron A. Reed describes how Star Trek (1971) stored each quadrant of its 8x8 galaxy only as a three-digit count of Klingons, starbases and stars; the code the player learned to read was the literal in-memory representation, and positions were re-randomised on entry, a lossy compression players rarely noticed and could read as Klingons moving {{CE7o3GGif30#6}}. For simulations that change every cell, Scott Anderson suggests storing falling-sand worlds sparsely, with homogeneous chunks as a single value, per-chunk bit depths of 1, 4 or 8, and possibly HashLife-style memoisation ("hash sand"), though he has not seen it tried {{R8DSq8qSJ44@15170#11}}.

### What goes wrong: the raw-struct save

The opposite approach is to write memory structures straight to disk. Russ, who ran a patched NetHack server at RIT, explains that in NetHack (and similarly Rogue) changing the player structure or many other parts of the source breaks every existing save and bones file, and that this was one of the biggest limits on what they could change on a live server {{SDojcmObQzw#6}}. His fix shows how expensive retrofitting is: to get forward-compatible JSON saves from C, which lacks introspection, he serialised the structs by having the program debug itself, the subject of a master's thesis and about a year of work {{SDojcmObQzw#7}}.

### Networking is a spectrum; pick the cheapest point

Adrian Zeyfang lays out the options for Crypt of the NecroDancer's multiplayer. Authoritative-server state replication sends inputs to a server that propagates updates, so a keypress shows only after a round trip. Deterministic lockstep relays inputs and simulates locally, which works only if the simulation has no outside dependencies or unshared randomness, but it is also called "delay netcode" because inputs still wait for the round trip. For a rhythm game, both lags were unacceptable {{zwhNSbFVKQM#1}}. So the team built rollback: run local inputs at once, snapshot the full game state every tick (globals, RNG seeds, tiles, positions, health, timers, items), and when a late remote input arrives, return to the past turn, insert it and fast-forward. Zeyfang describes it as an undo/redo system for the entire game, in effect a save/load system that must be extremely fast because it runs many times a second {{zwhNSbFVKQM#0}}.

The details show where rollback gets hard. A frame-indexed action buffer was mostly empty, so they keyed it by beat number, which broke when the beat-free Bard character could act at any time: a fast Bard built a lead, a rhythm player's input landed far behind it, and the resulting massive rollbacks caused performance problems and teleporting objects {{zwhNSbFVKQM#3}}. The fix was a sparse map keyed by time-derived turn IDs. Rhythm players snap to beat-aligned IDs so simultaneous beats share one ID; Bard's IDs come straight from the timestamp; Bolt, at double tempo, gets twice as many IDs and acts alone on off-beats; an out-of-order arrival shifts later actions and rolls back to weave the new one in {{zwhNSbFVKQM#4}}. And some state must stay out of rollback entirely: beat-timing judgement is fully client-authoritative and kept out of snapshots, so network trouble can never make a player miss a beat {{zwhNSbFVKQM#6}}.

Tyriq Plummer is the counterweight. Inspired by Zeyfang's talk, he spent two months failing to implement rollback for Scrubbin' Trubble before concluding it is a specific technology for a specific subset of games, and that most online games, turn-based ones especially, do not need it {{UNBAoc0TJSs#5}}. He switched to lockstep: clients send actions to the server, wait for confirmation, then simulate locally, so the server never sends game state but the game must be strictly deterministic. The internet turned out faster than he expected for this {{UNBAoc0TJSs#6}}. Anderson gives the same advice for falling-sand multiplayer: network inputs, not state, keep the simulation including its RNG deterministic, and choose lockstep or rollback as fighting and RTS games do; rollback re-simulation is expensive for sand, lockstep's latency may suit a sandbox, and full state sync would need something like lossless video compression {{R8DSq8qSJ44@15170#12}}.

The choice depends on what latency your game can tolerate. NecroDancer's rhythm cannot wait a round trip; a turn-based game usually can, and lockstep then costs far less. At the light end, the Delve Bros' Stream Heist viewer interface is a plain REST web app polled once a second. It only pretends to be synchronous, which does not matter when Twitch already adds several seconds of delay {{4jNMv79Xb6A#6}}. Networking also changes how you ship: Bloomquist notes that because his multiplayer roguelike is networked, every player, including those on a Commodore 64, always plays the latest version, which lets him introduce features and tweak them by player response {{ASGn5J9PHbs#7}}.

### Replays as verification and as explanation

A deterministic replay can check that a run is honest. For the 2017 MIT Mystery Hunt, whose solvers assume page source and protocols may be part of the puzzle, Colin Liotta ran a puzzle roguelike client-side without trusting the client: on reaching the stairs, the client sent its exact keypress sequence, the server replayed it with identical code, and only a winning replay returned the next level's URL; a failure earned a one-minute timeout {{5VsM8bOywIY#3}}. He wrote it in JavaScript precisely so the same simulation code could run on client and server, and recommends rot.js for web roguelikes {{5VsM8bOywIY#4}}.

Replays also explain. Dungeon Crawl Stone Soup keeps frame-by-frame ttyrec recordings of every online game. Alan Malloy used one to show a player how two stacked damage multipliers took them from 230 health to dead in one turn, and another player used a replay to prove magic mapping had failed in the Realm of Zot, exposing a real bug Malloy would otherwise have closed as unreproducible {{QV57CYrIZow#4}}. Seeds serve the same purpose for generation: Brian Walker built Brogue's seed feature so players could send him seeds for one-in-ten-thousand level-generation bugs that he could then step through, and it later became the basis of seed contests where everyone plays the same levels {{Uo9-IcHhq_w#18}}.

**In practice:** keep the simulation deterministic, with its RNG inside the state, and record the initial state (or seed) plus the stream of commands or events. Saves, replays, bug reproduction, server-side verification and lockstep networking all fall out of that {{jhcHlg7YhPg#10}} {{p48ArjJweSo#13}} {{5VsM8bOywIY#3}} {{UNBAoc0TJSs#6}}. Avoid raw memory dumps as a save format {{SDojcmObQzw#6}}. Reach for rollback only if your game cannot tolerate a round trip of input lag, and keep anything that must never be rolled back, such as rhythm judgement, out of the snapshot {{UNBAoc0TJSs#5}} {{zwhNSbFVKQM#6}}.

## Designing for modders

A data-driven, event-driven architecture is most of a mod system already. The question the talks raise is whether you treat modding as a design goal from the start or bolt it on later, and their answer is consistent.

### Plan for it early

Moromisato, who built Transcendence's mod system, reports hearing the same advice from Brian Bucklew of Caves of Qud and from the Dwarf Fortress developers: plan for modding from the start, because it is much harder to retrofit. You need not have it worked out, only put in some hooks and know the basic architecture {{mES03vaZo3U#8}}. Matt Ritchie built Axu that way, with a mod system that gives modders the same tools he has, and frames it as building broadly, layer by layer like a pyramid rather than a tall tower that falls over {{KKwgKTbiEY0#4}}. Dylan Gedig offers the hindsight version: Peglin builds each orb or relic from reusable Unity components, which made the team's own experimentation fast but did not make the game easy for outside modders, and he says he would now set it up for modding from the start {{ke0cLTVg2_M#13}}. Peglin's case is a useful warning that a component architecture convenient for the team is not automatically a mod system.

### From forks to hooks

Roguelikes were traditionally modded by forking the source. NetHack and its many variants came about that way, adding creatures and items as new code. Moromisato notes that forking is easy for the developer (just open the source), but it gets harder as games grow, limits modding to expert programmers, and forks cannot be combined {{mES03vaZo3U#2}}.

Scripting hooks fix the combination problem. In Moromisato's example, the attack code rolls damage, then calls mod events such as `onAttack` and `onDefend` with the attacker, defender and damage before hit points are decremented. A fireball mod handles `onAttack`, a magic-creature mod handles `onDefend`, and when both are loaded both run, with neither author needing to know about the other. He names Caves of Qud and Transcendence as using scripting like this {{mES03vaZo3U#5}}. This is the way out of the unfillable interaction matrix described at the start of the chapter, where no one decided what one mod's fireball did to another mod's creature {{mES03vaZo3U#1}}.

> If they are both in the same game we call both events and it work and neither mod/programmer has to worry about them being combined. {{mES03vaZo3U#5}}

### What it costs

Hooks multiply. In Transcendence, player requests extended buff events from the attacker to the attacker's items, allies and allies' items. And because mods run code, they exercise the engine harder than your own content does: Moromisato gets many crash reports that turn out to be mods doing unexpected things, and says any engine bug will be found by mods {{mES03vaZo3U#6}}.

Data-only modding has its own limits, which Ray describes from Caves of Qud's XML. Reusing a part works only when its boundaries match the change the modder wants. Rocket boots' jumping and fire trail are one part, so a modder who wants only the fire trail must drop into C# {{n6mKigS_71Y#6}}. Push the other way, making the data more expressive, and you hit a tension between power and comprehensibility: Ray argues Qud's XML effectively is a programming language, if a much simpler one than C#, and conditional behaviour based on other mods or game state is still harder than it could be {{n6mKigS_71Y#7}}. That tension is the subject of the next section.

### Moromisato's practical rules

- **Dogfood the system.** Build your own first-party content with your mod system. All of Transcendence's content is implemented in it; this speeds content creation, exercises the system so modders hit fewer gaps, and features modders ask for often turn out useful for official content {{mES03vaZo3U#9}}.
- **Version the API from day one.** Require every mod to declare the API version it was built against, so the engine can switch to old behaviour when an update changes things. You cannot add this later, because you cannot go back in time once you change the API; Transcendence does modify behaviour by mod version, which is expensive but sometimes worth it {{mES03vaZo3U#12}}.
- **Generate the documentation from the code.** Embed each script function's documentation in the code that registers it, make it required to compile, and generate the docs. Moromisato wishes Transcendence had started that way; its players diff the generated function lists between versions to update a community wiki {{mES03vaZo3U#13}}.

Everest Pipkin takes the idea of permission further. Pipkin works in the browser because its surface is only skin deep: players can view source, so the game's logic becomes transparent, readable and permissible to touch {{O78uYtUZKYs#6}}. That is a design stance as well as a technical one: a game whose workings are open invites players to look underneath.

## Little languages: writing rules in a language built for them

Compton's provocation to roguelike developers is that you have probably already written a programming language. Any file your program uses to control its flow, including a homemade save or data format, is one, and it reflects what your game needs and is about; it may have first-class constructs for things only your game has, such as the number of eggs you hold {{E5-3Ui7oO8U#3}}. The previous section's Caves of Qud XML is an example. Since you will have a language anyway, the talks argue you should design or choose it on purpose.

### Why a language for the domain

Kovach's argument is about where effort goes. General-purpose programming carries incidental chores: package management, dependency versions, learning APIs, choosing data structures. The hard problems are making rules fun, fair and easy to learn and making interfaces that communicate. Choosing or designing a domain-specific language (DSL), a language built for one kind of problem, shifts effort from the first kind to the second {{s9Wyn9BJJI4#0}}. Compton adds that designing a DSL is also a way of thinking about a genre: you ask what its unit operations are and which ones you cannot express well in Python, as she did with Tracery, Tracery 2, Chancery and the speculative idle-game language Greenery {{E5-3Ui7oO8U#0}}. Reed makes the case for writers: procedural text authors should get languages that feel like writing a manuscript, not wrangling a database. 18 Cadence let him write paragraphs tagged with a year and a location, Subcutanean used a simple DSL for text alternatives, and he credits a natural-language programming language with helping him finish Blue Lacuna {{x0Xh4oCX9t0#12}}.

> Give the writer the best tools to write. Even if the writer is yourself. {{x0Xh4oCX9t0#12}}

### Families of rule languages

**Relational rules.** In Kovach's relational game language, the whole world state is a collection of typed facts such as `monster(m)`, `position(p)`, `adjacent(p1,p2)` and `at(m,p)`. Input and output are facts too: keypresses are transcribed into facts each loop, and queries join facts that share variables, for instance to find every pair of adjacent monsters {{s9Wyn9BJJI4#5}}. Logic rules derive new facts from queries and play the role of functions: "touching" from adjacency, "alive" from HP above zero, which stops being true by itself when HP hits zero, and reachability from just two recursive rules (adjacent implies reachable; adjacent plus reachable implies reachable), which settle whether a path exists though not the optimal A* path {{s9Wyn9BJJI4#6}}. Because every fact exists only because some rule fired, you can ask of anything on screen why it is there and trace the chain back through time, which Kovach suggests helps both debugging and players who want to peel back the layers {{s9Wyn9BJJI4#9}}.

Kovach points to two existing languages in this spirit. Stephen Lavelle's PuzzleScript expresses Sokoban's whole push mechanic as one pattern-to-consequence rule, and reversing its arrows yields a pull; the language is useless for general tasks but its whole execution model fits on one slide, which gives designers a simple mental model {{s9Wyn9BJJI4#1}}. Inform 7 lets interactive fiction authors write state and rules in near-natural English, for example defining a container as bursting when its contents outweigh its breaking strain, a definition that is itself a rule updating the world whenever it holds {{s9Wyn9BJJI4#2}}.

**Tile rewriting.** Seth Cooper's TRBT represents a grid game's whole state as a layered 2D board of tiles and every change as a visual rewrite of one tile pattern into another. Moving is rewriting player-plus-blank into blank-plus-player; placing a room is rewriting a rectangle of solid tiles into empty space; winning is matching a gem pattern {{K5FXzxDIQdQ#0}}. Behaviour trees, normally used for agent AI, control the logic of the whole game: order, loop-until-fail, any-order and player-choice nodes over rewrites. A minimal game fills the board, carves a room, places the player and exit, then loops a player node until a gem appears {{K5FXzxDIQdQ#1}}. Hidden state lives in extra layers: in Cooper's roguelike Trogue, underscore-tagged tiles visible only in a debug view sit under patrolling snakes to record their heading and whether they moved this turn {{K5FXzxDIQdQ#2}}.

**Effect graphs.** As an answer to the dependent, scaling card effects that defeated Monster Train's effect scripts (see "Where data stops"), Cronin proposes representing its card effects as a DSL of control-flow nodes and parameter nodes. Awoken Rail Spike becomes draw, upgrade and consume nodes fed by a parameter such as energy spent; changing it to draw one card per card in the discard pile, or doubling it with a multiplier node, is trivial rewiring. Designers get leverage over how effects resolve, and programmers write small, simple nodes {{qO3CIpP62Q0#8}}.

### What makes a little language polite

Compton's talk is a design guide for languages built by people without a programming-language degree. Her first point is that a language is not its syntax but an ecosystem: programs (a Tracery grammar, a Stardew Valley config file), parsers, engines, IDEs, specifications, tools and the people who control each part {{E5-3Ui7oO8U#5}}. What creators care about most are informal properties: is it easy to write, can you remember what a program does after writing it, can you use it in strange places, does it run on your device. Lua, made for Brazilian power plants and now in Roblox, is her example of a language that runs anywhere {{E5-3Ui7oO8U#6}}. From there she lists what a polite ecosystem does:

- **Scaffold the user.** Show the available parts, offer completion, colouring and auto-indent, so people know what to do and when they have done it right, unlike a blank vi buffer {{E5-3Ui7oO8U#8}}.
- **Offer a structure editor.** In an editor like Scratch only valid pieces snap together, so beginners cannot produce an error and can learn about errors later {{E5-3Ui7oO8U#9}}.
- **Make syntax unfoldable.** HTML and Tracery let a beginner start with plain text and unfold more syntax step by step; many Tracery users only ever write hashtags. Compton says Caves of Qud's data is not currently very unfolded {{E5-3Ui7oO8U#10}}.
- **Embed safely.** A polite language can squeeze in anywhere and run user-provided code safely; base Tracery is small enough that students port it to C, and Cheap Bots Done Quick relies on Tracery being mostly safe {{E5-3Ui7oO8U#11}}.
- **Separate engine from tools.** Breaking Tracery's engine out of its parser and tools let George Buckenham build Cheap Bots Done Quick on it; Compton says most of the many tools she built were never that useful {{E5-3Ui7oO8U#12}}. Her chatbot language Chancery went wrong the other way: IDE, simulator and visualisations were bundled too tightly for anyone to pull out just the simulator, so she split it {{E5-3Ui7oO8U#15}}.
- **Model the syntax explicitly.** Railroad diagrams describe what a language's syntax is and are a step toward a specification, though hers for Tracery is unfinished because she keeps iterating on the diagrams {{E5-3Ui7oO8U#13}}.

Read against the modding section, these are also guidelines for mod data: Ray's power-versus-comprehensibility tension is what unfoldable syntax and scaffolding are meant to ease.

### Declarative tools you already have

You do not have to build a language to get some of these benefits. Pagnutti, whose two-table state machine for a Slay the Spire enemy appears in the content-as-data section, set out to write a game simulation as a single SQL query, and says he also simulates games in nothing but Google Sheets {{Uf34SbuWIos#5}}. He simulates Slay the Spire enemy behaviour with a recursive common table expression in SQLite: a seed step loads the start state, and a recursive step joins the transitions and states tables to append each possible next move. Each row tracks round, move trace, current state, running probability (the product of transition probabilities, starting at 1 because the first move is forced) and running damage, block and strength; by round three there are five possible traces. He notes recursive CTEs may not be standard SQL {{Uf34SbuWIos#4}}.

Tyler Robertson goes further and runs games inside Google Sheets. The core tricks:

- **State through self-reference.** Turn on iterative calculation with a maximum of one iteration, and a cell can reference itself; with a checkbox as input, "if checked, increment my value, else keep it" becomes a counter, and each checkbox becomes a controller button {{hdhKErNIYgE#2}}.
- **Event detection from calculation order.** Sheets compute left to right, top to bottom, so a pair of helper formulas, one that fires when the checkbox and its partner disagree and one that then copies the checkbox, can tell which checkbox was clicked most recently. Robertson says this took him about a year to understand {{hdhKErNIYgE#3}}.
- **Rendering by rule.** Conditional formatting colours cells from rules, so tile types become numbers whose colour lives in one place; his pixel-accurate Mario 1-1 used about 90,000 cells, and recolouring the sky meant editing one rule {{hdhKErNIYgE#1}}.
- **A roguelike in cells.** The map is text of dots (walkable) and pound signs (walls); a regex formula renders the player or the map tile, extra formulas check the target cell before moving, edge formulas shift when the player passes the screen centre to make a following camera, and a VLOOKUP can swap characters for emoji tiles {{hdhKErNIYgE#5}}.

The same techniques extend to Snake, checkers, chess, text adventures and even slow 3D rendering; his turn-based strategy game took a month and had cells with 200 nested IF functions {{hdhKErNIYgE#6}}, which shows both the reach of the approach and where it stops being comfortable. Adrian Herbez found a similar limit in OpenSCAD, the code-driven CAD modeller he uses to generate 3D-printable roguelike pieces: its variables are all constants, which makes substantial logic painful, so he generates the data in JavaScript and feeds it in {{cGvig1f68Tg#6}}.

### The cost of a new way of thinking

Kovach frames choosing a language like choosing a roguelike conduct, a self-imposed restriction like never equipping items. C's manual memory, Haskell's lack of mutable state and APL's terseness make some easy things hard but force new ways of thinking, and his relational language deliberately has no functions, no local state, no control flow and one data type {{s9Wyn9BJJI4#4}}. Cooper's experience shows the bill for that. In a tile rewrite language tiles have no identity, so even the player is just an emoji that any rule can match, and a rewrite involving the player tile applies to every player tile on the board. His small user study suggested this requires a different way of thinking about program structure than an object-oriented player entity {{K5FXzxDIQdQ#6}}. A little language pays off when its constraints match your game's problem closely enough that the new way of thinking is the design thinking you needed to do anyway; when they do not, you are paying to learn a conduct that does not help you win.

## Tools that keep designers iterating

The architecture above decides what the game can do; tools decide how quickly a team can find out whether it is any good. The useful way to judge a tool is by its turnaround: how long between making a change and seeing what it does?

### Turnaround is the measure

Two talks from very different corners of the field arrive at the same rule. JP LeBreton, who built the ASCII art and game tool Playscii, borrows the idea of *liveness* from Bret Victor: tighten feedback loops, make hidden things visible, and cut out the compile, reboot and reload steps between an action and its result. He contrasts it with waiting hours for a Quake or Half-Life map to recompile, and he asks of every action in his tool what its turnaround time is {{MJZvWgcxV0M#8}}. Leigh Alexander, coming from generative writing, reaches the same conclusion for content: you cannot tell how a piece of generative text performs by reading it in a spreadsheet, so the spreadsheet has to feed a running instance of the game with near-zero latency, without full builds or code. She credits the writing awards for Reigns: Her Majesty to a toolset that let her, a non-technical designer, work exactly that way {{NjYS8XmeaiY#8}}.

> If you want to do anything good from a content standpoint with spreadsheets and generative tech you need to prioritize minimizing the latency. {{NjYS8XmeaiY#8}}

LeBreton adds a finer-grained version of the same test. Look for operations you do several times a minute that carry high friction, and reduce their cost; weigh not just keystrokes but cognitive cost, meaning how many decisions and UI concepts an operation makes you think about and when. Playscii's spacebar popup for picking a character and colour, which can be docked as persistent UI, came out of that audit {{MJZvWgcxV0M#5}}.

### Techniques for a fast loop

- **Share data between editor and game.** In Playscii a game object refers to the very same art data object the editor works on, so a change appears in the running game instantly, without saving. LeBreton demonstrates by enlarging an animated owl's eyes in art mode and flipping straight back to game mode; character sets and palettes hot-reload too {{MJZvWgcxV0M#9}}. Playscii also exposes a Python REPL console and lets game code modify art at runtime, so you can run a cellular automaton directly on an art document, step by step or over simulated time {{MJZvWgcxV0M#11}}.
- **Make editing and playing one keystroke apart.** One of the first things Liotta built for his roguelike puzzle in the 2017 MIT Mystery Hunt was a level editor that jumped instantly between editing a level and playing it, which let him try many quick ideas and judge each one {{5VsM8bOywIY#5}}.
- **Balance the live game.** Chris McCormick attaches a handler to every on-screen item and monster in Smallest Quest that dumps the object to the browser's developer console. From there he edits it live: a food item goes from 5 to 10 food before he picks it up, and a bat's damage goes to 20 and kills him in one hit. The point is balancing without restarting {{dJbUmDsyJRw#12}}.

### A dashboard derived from the data

Spry Fox's design dashboard, described by Kemp, is the most developed example of making the game's data visible. It is an HTML page that reads the generated configs and offers sortable, filterable views of them. The item view lists all of roughly 8,800 generated items with search and toggleable property columns, and each item carries a button that opens, in VS Code, the source config that produced it; the dashboard has become the team's first stop when investigating an issue {{rWPJ5fW1UH8#8}}. Because loot tables are authored by tag (authors describe the kinds of item to drop, not specific items), the dashboard can resolve what could actually drop and show a "dropped by" column listing every table that can produce a given item, which traces an unexpected item back to its source {{rWPJ5fW1UH8#9}}. For their real-time calendar games, a timeline view draws the scheduled scenarios from a calendar YAML file, colour-coded with durations, so designers can see whether every day has enough for the player to do {{rWPJ5fW1UH8#11}}.

The deeper argument is about where truth lives. Cozy Grove's hand-maintained progression spreadsheet was hugely useful but a lot of work, and it drifted out of sync with the game. With a dashboard generated from the configs there is one source of truth, the game data, and the views update themselves; local copies serve designers mid-iteration and a hosted copy serves non-designers and QA {{rWPJ5fW1UH8#14}}. Spreadsheets still have a place as analysis tools. Pagnutti's advice for colour-scaling a stat table is a small example of making a view honest: apply conditional formatting per stat, since speed and skill are not compared directly, and leave ranges whose values are all identical uncoloured so they do not wash out the information {{DbZe8rWviS0#1}}.

### Tooling for procedural generators

A generator is a tool in its own right, and the talks that discuss building one for others agree on two things: build it from small parts, and accept that making it pleasant to use is real work.

Egart argues that procgen tools should be made of modular, self-contained, reusable steps with exposed parameters, like Lego pieces: the more interconnectable the pieces, the more expressive the tool. His binary space partitioning (BSP) node, for example, exposes the minimum and maximum region size {{YfLYPIXGF7E#5}}. He built his dungeon generator as a visual node graph in Unity using the open-source xNode framework, getting drag-and-drop working in a couple of hours. The graph runs left to right from a blank level through BSP, prefab rooms and A* hallways to a node that places the player spawn, showing that steps that are not geometry belong in the same pipeline {{YfLYPIXGF7E#2}}. His warning is that the secretly hard part is making such a tool friendly to work with, so lean on frameworks that handle the UI; he points to Dungeon Architect, xNode and a similar procedural engine for Unity {{YfLYPIXGF7E#6}}. Pepers names the people who do this work "artificers": like a D&D artificer making a wand a peasant can use, they wrap generation in sliders, buttons and labels so others can use it without rethinking what content is, and she calls it a distinct and valuable skill {{mYMdMAvTHpo#5}}.

Hidden Door applies the same decomposition to a large language model. Brianna McHorse and Chris Foster describe resolving a player's stated intent through many small composable tasks instead of one LLM call: the LLM suggests outcomes, offers ideas and renders prose, while ordered tools built from classic machine learning, procgen and handwritten rules decide whether dice are needed (not to open a cabinet), adjust mood, drama, pacing and genre, and check world physics and plot needs {{aJC3ioashbs#7}}. The payoff is interpretability. Because each component is small, each can be inspected and tuned independently, like a series of lenses, which compensates for how poorly an LLM explains itself; the team also built a shared vocabulary of story coherence, agency, replayability and pacing so several disciplines could tune different parts toward one goal {{aJC3ioashbs#11}}.

Smaller examples show the same instinct to open the generator up:

- Sonat Uzun is building a tool that shows the parts and motifs behind each song in Tea Garden and can force the generator to use particular motifs, for fine-tuning {{SBjsVcffOHg#11}}.
- Emily Halina's work-in-progress Godot tool for Tree-based Reconstructive Partitioning (TRP) runs Monte Carlo tree search (MCTS) from a list of inputs and a default reward function to generate level variants during development; she admits a small example yields similar-looking levels, but says it is enough for ideation {{KWBpQz1mHcA#14}}.
- Martin Austwick is building a pipeline that exports Twine stories as JSON into Python to render branching, procedurally generated narratives as podcast audio for Neutrinowatch {{1sZlIfCcz_c#11}}.

### Building tools, and sharing them

LeBreton's design rule for Playscii is worth borrowing: rather than limit an editor to what old hardware could do, build a more powerful one and write a little code to export down to the simpler format when authenticity matters. He wanted layers, alpha blending, a CRT filter and a built-in engine with off-grid objects, which REXPaint, PabloDraw and PETSCII editors did not offer {{MJZvWgcxV0M#4}}. In the same spirit Playscii's native format is JSON so other engines can parse it, with plugins for PNG and legacy ANSI formats {{MJZvWgcxV0M#15}}. REXPaint itself shows what a shared tool can do for the genre: Josh Ge built it because nothing had the features he needed, other developers use it for UI mock-ups and mapping, and he uses it every day in every aspect of Cogmind {{9se2M27LuOs#4}}.

The caution comes from Nifflas. His expression-driven music tool works for him, but most of the work is writing undocumented expressions that only someone who knows the software inside out could write, so releasing it would need documentation, UX work, funding and a collaborator {{WbgdXalXPus#9}}. An internal tool's speed for its author is not usability for anyone else.

## Catching problems before players do: validation and automated play

Once content lives in data, so do its mistakes, often in how independently authored pieces fit together {{FV_0rmqxbxw#11}}. The answer the talks give is to check automatically, at two levels: the data, statically, before it is checked in; and the game, by having a machine play it.

### Validate data where independent pieces meet

Jurie Horneman's case is a tag-based level system in which levels request rooms by tag. To guarantee a level never asks for a room that does not exist, he rejected optional tags, grey-box placeholder rooms and manual testing after every change, and instead wrote a Python script that loads the level data and the room list and reports every request without a match. Hooked into continuous integration (Jenkins, say), it means bad data is never checked in {{FV_0rmqxbxw#3}}. He generalises the lesson: static validation is always useful, but it matters most where independently authored assets, often from different disciplines, only meet inside the system (levels need rooms, situations need quests), and it should ideally run on every data submission {{FV_0rmqxbxw#11}}.

He is equally clear that it can be expensive. Static analysis is really data mining, and proving that a dynamic location-reservation system would never run out of locations on a large project turned out to be far harder than it sounded. He had to learn a system he had not written, write C++ and Python to export quest and location data, reconcile lockups QA found with his spreadsheet (false negatives), build synthetic games to confirm predicted failures (false positives), rerun the analysis whenever data changed, and still add a runtime fallback so saves would not break forever {{FV_0rmqxbxw#5}}. Cheap cross-reference checks pay off quickly; proofs about dynamic behaviour may not.

Several teams have built the cheap kind into their pipelines, each in a different shape:

- **Validators in the config loader.** Spry Fox's open-sourced DarkConfig library turns YAML configs into gameplay data with hot loading, validates the YAML syntax, and serves as a platform for writing game-specific validators that define what good and bad data look like {{rWPJ5fW1UH8#1}}.
- **A schema generated from types.** Rose's Hitchhiker's Guide to the Cataclysm has to track a game with more than 300 changes a month, some of which change data shapes (numbers becoming strings with units). Hand-writing a schema for over 100 object types and 1,000 properties would be a nightmare, so a library generates a JSON schema from the guide's TypeScript types. A GitHub Action pulls each experimental release, renders every page checking for errors and validates all the game data against the schema; it has caught errors in the schema and some in the game's own data {{ziN33iMQVPo#7}}.
- **Examples that are also tests and docs.** Bucklew and Frang describe how Caves of Qud attaches example input/output pairs to each text replacer as C# attributes (pass the frogs faction, expect "frogs"). The suite runs as unit tests, emits an XML reference of every replacer and its examples with errors listed first, and stops old pre-1.0 helpers from silently drifting {{R8DSq8qSJ44@5367#7}}.
- **Compile the data.** NetHack's special levels go through a level compiler, chosen partly so level files would not sit readable as hints on shared multi-user systems, and partly so mistakes are caught at compile time rather than at runtime {{9V_CkJ66uJQ#8}}.

### Let a machine play the game

The second level of checking is to run the game itself many times. Phenry Ewing describes how Neo Cab's whole design lived in the ink narrative language, so the team could run the actual game headlessly from the command line with a JavaScript runner that made random choices, thousands of times, instead of building a separate model of it. Each run output its core variables and inputs, which they sliced into reports such as how many runs finished and how often game overs came from running out of fuel or money {{Nnx33ctSmRA#10}}. This is one of the payoffs of keeping the simulation separate from its presentation, described earlier in the chapter: if the game can run without a screen, you can drive it.

> Instead of building a model of the game we had one and could drive it. {{Nnx33ctSmRA#10}}

Kingsford goes further with an MCTS player as an automated playtester. Ask it "is this winnable?", simulating to the end of a level, a sensible turn limit or death rather than whole games, and use generic rewards such as reaching the next level and losing health, because the more closely the reward is tied to the current rules, the less it helps as the rules change. He imagines a 7DRL (a roguelike made in seven days) in which, from day one, every file save triggers the game to try for a win in the background while you watch the @ work its way through {{9iTJ9Z8p0ao#9}}. Because his game state is pure, the same agent can also fuzz: play to some point, then fire random playouts from every following turn in parallel to see whether anything throws {{9iTJ9Z8p0ao#10}}.

He is candid about the limits. The agent optimises for the reward you give it, so it plays optimally rather than like a human and cannot tell you whether the game is fun, though rewarding "fun" behaviours, such as grabbing a novelty weapon, can make it more human-like. Its value is making sure human playtesters, whose time is precious, never waste it on a broken build {{9iTJ9Z8p0ao#11}}. And MCTS needs very fast simulation loops: the logic may have to be in a compiled language rather than Python, Lua or Ruby, and multi-threaded. Kingsford learned Rust for roughly a tenfold speedup that paid off when renting AWS compute; multi-threading one tree brings locking problems he flags without solving {{9iTJ9Z8p0ao#5}}.

Oliver Withington's advice for generators belongs here too: make them easy to test by keeping them modular and able to output content in the minimal encoded form needed to evaluate it, without set dressing. Future you, he says, will be very happy {{Ls9wksddN5c#8}}.

### When verification is out of reach

Reed's account of The Hobbit is the counterexample. Its emergent character simulation was so hard to inspect that debugging meant squinting at memory dumps, and the testers trying to verify it was bug-free or winnable gave up. It shipped with infamous bugs: Elrond's weight was unset so Bilbo could carry him, Bard could refuse to slay the dragon, Thorin behaved like a kleptomaniac. Reed notes that this also lent the game its charm {{CE7o3GGif30#10}}. NetHack shows the defensive alternative when you cannot enumerate every state: its code handles cases its developers believe cannot happen, such as two-weaponing a corpse, and Pepers credits that with the game's rarity of crashes under bizarre player behaviour {{5y_IAdOwaYs#8}}.

### In practice: what to automate first

1. Cross-reference checks between independently authored data (every tag request has a matching asset), run in CI on every submission {{FV_0rmqxbxw#3}} {{FV_0rmqxbxw#11}}.
2. Schema or validator checks in the loader, generated from your types where you can {{rWPJ5fW1UH8#1}} {{ziN33iMQVPo#7}}.
3. Examples attached to small text or rule helpers, run as tests {{R8DSq8qSJ44@5367#7}}.
4. Headless random or search-driven playthroughs of the real game, once the simulation can run without its presentation, aimed at crashes and winnability rather than fun {{Nnx33ctSmRA#10}} {{9iTJ9Z8p0ao#9}} {{9iTJ9Z8p0ao#11}}.
5. Proofs about dynamic runtime behaviour only when the stakes justify the cost, and with a runtime fallback anyway {{FV_0rmqxbxw#5}}.

## Seeing inside a running game: debugging, logging and telemetry

A hand-built level can be opened in an editor and looked at. A procedural game has no such scene: the thing that went wrong existed once, for one seed, in one player's run. Visibility has to be built in. Alexander Birke makes the case from Sea of Rifts: a systemic procedural game needs an easily extensible debug menu and visualisations early. Sea of Rifts has a tree-structured debug menu, reuses the in-game map to visualise generation, and has a text debug console into which a component can inject commands to rerun the same conditions; because it takes text, team members have built their own debug menus on an Elgato Stream Deck from text macros {{0jFzBf0mCRY#5}}.

### Record everything, analyse later

Per-decision debug output only goes so far. Horneman points out that with dynamic content selection, each individual pick can be fine while the picks add up over time to a bad experience. You need to log the selection inputs through analytics and analyse them over time, which also lets you retroactively test alternative weights; without that data his teams could only tweak a weight and hope {{FV_0rmqxbxw#10}}.

Dungeon Crawl Stone Soup has the most mature version of this. Malloy describes how every online game emits machine-readable *milestones* (entering a new area, killing a unique, changing god) carrying race, god, level, top skill, killer and the killer's weapon into a database. Morgue files and replays suit humans, not programs; the milestone database, queried through the IRC bot Sequell with a Crawl-specific query language, lets anyone ask targeted questions about any subset of online games without writing SQL {{QV57CYrIZow#5}}. The Blaseball archivists of SIBR, Allie Signet and Joe Maliksi, give the rule behind recording so much: keep everything as raw as possible before you start carving it down, because a remarkable player can break out in a single game and data that seems unimportant today may be the core of tomorrow's story {{WeRCGy3-uPY#2}}. Raw recordings also find uses nobody planned. Drew Streib reports that nethack.alt.org (NAO) holds roughly 200 GB of ttyrec terminal recordings, which have fed analytics and bots, one of which ascended on a public server {{J4RK-3zW8vY#10}}.

> Data you don't think is important today might be at the core of a story you want to tell tomorrow. {{WeRCGy3-uPY#2}}

### Public servers as debugging infrastructure

Servers that host other people's games turn out to be the best crash reporters a roguelike can have. Crawl's online servers post every crash to the developer IRC channel with the morgue, stack trace and save file, and auto-update to trunk so a fixed bug does not recur for players; Malloy jokes "who needs tests when you have players", but says trunk is stable, and crashes that arrive with everything needed to reproduce them are far easier to fix than ones you have to coax out of offline players {{QV57CYrIZow#10}}. Streib makes the same point about NAO: with thousands of games a month, a one-in-a-thousand bug shows up on the server even if no individual player ever hits it, which has made NAO a useful feed of core dumps for the NetHack DevTeam {{J4RK-3zW8vY#6}}.

If you run such a server, Streib's experience covers the plumbing:

- **dgamelaunch** is a generic front end for any TTY game. It forks a ttyrec spooling process alongside each game so others can watch, and its only player interaction is simple in-game mail; the website and IRC bots run outside the jail {{J4RK-3zW8vY#4}}.
- **Security** is a headache. Game binaries have bugs, options editors must be locked down so they cannot write arbitrary files, and the game server should be kept apart from other services because it has "enough holes to drive trucks through". Back up often and get a co-admin {{J4RK-3zW8vY#5}}.
- **Hosting**: NAO stays on simple Linux instances rather than containers or serverless, because live watching needs fast open sockets and Streib avoids patching the stock game binaries; moving to AWS got him out of the hardware-failure business {{J4RK-3zW8vY#7}}.

### Legible code is a debugging tool

The cheapest visibility is code that explains itself. Pepers found NetHack's source shockingly well commented: files such as display.c open with paragraphs in plain English describing exactly what the code does, and inline comments run through whole functions such as sacrifice handling, so a developer can learn the design without knowing C {{5y_IAdOwaYs#0}}. Its comments also use ASCII grid diagrams for spatial behaviour: the boomerang's flight path (reverse the rows for clockwise), polearm range as a numbered grid, and how a ball and chain should move. Pepers suggests any grid-based game can steal the technique {{5y_IAdOwaYs#7}}.

At the far end of the scale, bhauth argues that DCSS has had development effort comparable to a AAA game, spent on what hardcore players and programmers value: online and offline play, statistics, logs, leaderboards, spectating, Lua scripting, macros and search {{tg-CjNodlmY#10}}. Much of that list is the same recording and visibility infrastructure that serves its developers.

## Choosing a foundation: languages, engines and libraries

The talks spend surprisingly little time on which language or engine to use, and what they do say mostly lowers the stakes.

### Your values, or your platforms

At one end, JP LeBreton argues that building your own engine or tool is valuable less for autonomy than for putting your own values into practice. He calls the big engines tools for converting money into content, designed around business models, and argues for a flourishing of small tools with distinct identities, focus or approachability, like those found on itch.io {{MJZvWgcxV0M#13}}. One value he built into Playscii's engine: impose as few speed-related restrictions on behaviour as possible and make the remaining ones easy to lift, because designers exploit whatever is cheap. In Doom, moving floors and ceilings was basically free, so level designers used it everywhere, for elevators, collapsing floors and rising staircases {{MJZvWgcxV0M#10}}.

At the other end, Biskup chose Unity for Ultimate ADOM because the team judged it the best platform for a multi-platform plan (a detailed desktop game, mobile-first iOS and Android versions, consoles later) after finding their own hand-written ports of ADOM very hard and buggy {{iZUXjbcAfYs#10}}. The choice depends on what you need most: control over how your tool thinks, or reach across platforms you cannot afford to port to by hand.

### Starting out

Josh Ge's advice to beginners is that the language matters little: roguelikes have been made in nearly every language, so use one you know, and if starting fresh, Python is the easiest recommendation; C and C++ have resources, but he does not recommend them to beginners who want to make a game rather than debug {{jviNpRGuCIU#1}}. With Python, libtcod supplies both general game-library features and roguelike heavy lifting (map generation, field of view, pathfinding), each replaceable later. Ultima Ratio Regum and Temple of Torment both began from the libtcod tutorial's game, and Armoured Commander's developer went from limited programming experience to a finished, press-covered game in a year {{jviNpRGuCIU#13}}.

Phillip Daigle, learning to program for Rogue's Gate, came to a different choice. He rejected Python as slow to show visible results beyond ASCII, C, Go and Java as a high barrier, and Unity and Unreal as heavy and too hand-holding, and found a sweet spot in GameMaker Studio 2, which handles assets, memory and sprites while still requiring real programming. His caveats: it costs money, older documentation may not match the version, at the time it lacked structs and try/catch and could not use libtcod or pygame, and he would probably pick Godot if starting over {{2C3w7-SU5ek#5}}.

McCormick makes the case for the browser. It is everywhere, needs no compile step, supports live reloading, and comes with images, SVG, WebGL, fonts, touch and mouse input, CSS animation and a developer console for modifying data structures in real time, which makes code portable and players easy to reach {{dJbUmDsyJRw#7}}. With rot.js (the Roguelike Toolkit in JavaScript, by Ondřej Žára), a single script tag gives you console rendering, RNG, pathfinding, field of view, map generation, input, tile maps and scheduling; McCormick pastes the roughly 100-line tutorial result into an index.html and swaps in a tile map in about 29 more lines {{dJbUmDsyJRw#8}}. For Java, Eben Howard presents SquidLib, an Apache 2.0 library with grid math, many dungeon generators and coloured glyph display, in a modular libGDX-based 3.0 line that also targets the web and an older Swing-based line {{60MTG-__dt4#8}}. And if what you want to make is a generative Twitter bot, Joe Sondow notes it needs no code at all with Cheap Bots Done Quick, built on Compton's Tracery grammar, or can be hosted free on AWS Lambda with DynamoDB for state, though many AWS "free" services expire after a year {{4byHHDeVKoA#7}}.

### Perspective

The tools have always shaped what was possible. Ken Arnold wrote the curses library as one abstraction over cursor-addressable terminals, building on the terminal database Bill Joy wrote for vi, so programs did not need rewriting per terminal; Rogue could not have existed without it {{IaB7iQhts_c#1}}. Biskup describes writing early ADOM by "neolithic programming": no syntax highlighting, auto-completion, refactoring tools, easy version control or internet help, typing code for hours or days before a minutes-long compile returned hundreds of errors at once {{a3ZYDA2JVSM#2}}. Any modern choice is a long way from that.

### In practice

- If you already know a language, use it {{jviNpRGuCIU#1}}.
- If you are starting fresh and want ASCII quickly, Python with libtcod {{jviNpRGuCIU#13}}; in the browser, JavaScript with rot.js {{dJbUmDsyJRw#8}}; in Java, SquidLib {{60MTG-__dt4#8}}.
- If you want sprites and an engine that does some work for you while you learn, a 2D engine such as GameMaker or Godot {{2C3w7-SU5ek#5}}.
- If you must ship on many platforms, weigh a large engine against the cost of hand-porting {{iZUXjbcAfYs#10}}.
- If you build your own, decide which values it embodies, and keep its speed restrictions few and liftable {{MJZvWgcxV0M#13}} {{MJZvWgcxV0M#10}}.

## Performance and hard constraints

The section on modelling entities noted that cache-friendly layouts matter little to a typical turn-based tile roguelike: when Nystrom polled his audience, only about three people had performance problems traced to cache misses {{JxI3Eu5DPwE#1}}, and Desktop Dungeons' largest event queue is around 50 events {{p48ArjJweSo#12}}. The talks below locate the places where performance does bite: where every entity interacts with every other, where the world is a simulated grid of cells, where a 3D scene meets a frame budget, and where the platform itself is tiny. Those edges are worth knowing, and the tightest constraints have taught techniques worth keeping.

### Where performance actually bites

**Quadratic interaction.** Knipscher found that Bioloom, an ecosystem sim, struggled at about 50 creatures because interactions such as perceiving one another scale quadratically, while the dream was a thousand. An octree did not get her past similar problems; switching to Unity DOTS had a big learning curve but gave her headroom to develop gameplay and optimise later. She notes that Burst and Jobs can be used without the full ECS {{jBhcHdV5HHo#9}}.

**Cellular automata.** Anderson says that making a cellular automaton fast on modern hardware is mostly about memory, not arithmetic: keep cells small and use cache-friendly layouts such as Morton (Z-order) curves, which linearise the grid while keeping neighbours close in memory {{R8DSq8qSJ44@15170#9}}. Block cellular automata are embarrassingly parallel because blocks share no data within one update, so they can run across threads (Noita uses a checkerboard of blocks) or one block per GPU thread, and dirty chunks let you skip regions that cannot change next tick, such as all-empty or all-solid ones {{R8DSq8qSJ44@15170#10}}. Ian Holmes's Nematode shows how far the approach can be pushed: its whole persistent, multiplayer world, with gases, polymers and rigid bodies, runs inside a cellular automaton, with multiplayer built on the TeaTime model from Croquet in JavaScript with a Node back end {{b2VkgcC1xRc#6}}.

**Many objects.** Biskup reports that Ultimate ADOM's Java prototype with a couple of million objects ran about a hundred times faster than the C# version; he does not know why and puts it down to the team's inexperience with C# performance. He worries more about engine complexity in Unity than about graphics, because separating the engine from its graphical interpretation is something they have already learned {{iZUXjbcAfYs#30}}.

**Bounding the work.** Two talks reduce the problem rather than speed up the code. Todd Furmanski's Forska is a first-person point-and-click game: a click raycasts to a point and renders a static image from a real-time scene graph, so the game has fractions of a second per click for simulation and AI instead of a sixtieth of a second per frame, which he found liberating {{ST6s_8ekeOg#2}}. LeBreton added rooms to Playscii to organise a larger world and limit the scope of simulation and rendering {{MJZvWgcxV0M#12}}.

### Field of view: efficiency against correctness

Field of view (FOV) is the classic roguelike algorithm where cost and correctness trade against each other, and Albert Ford's comparison makes the trade visible. Raycasting, casting a ray in every direction and stopping at obstacles, is essentially repeated line of sight, so it agrees with targeting, but it oversamples tiles near the viewer, as a heat map shows {{y1zkrTcNJbc#2}}. Shadowcasting scans outward in concentric squares by quadrant or octant and visits each visible tile about once (only the seams between quadrants twice), but by default it is inconsistent with line of sight at wall corners, so something can shoot you that you cannot see {{y1zkrTcNJbc#3}}. Ford's fix has two parts. Treat walls as beveled diamonds, cutting off the corners that caused the inconsistent occlusion; and reveal a tile only when its centre is visible, rather than any part of it, which makes the result symmetric. The outcome is an FOV that is efficient, consistent and symmetric {{y1zkrTcNJbc#4}}.

> What you want is to only reveal tiles where you can see the center. {{y1zkrTcNJbc#4}}

### 3D asset budgets

Roguelikes built in 3D from bought or modular assets face a different budget. Sergio Garces, building procedural 3D environments on a budget, gives a checklist:

- **Textures** are the main memory cost. Shrink them, since the difference is often invisible at play distance, and pack ambient occlusion, roughness and metallic maps into the RGB channels of one texture; colour and normal maps cannot be packed {{6U8c6hbVJLY#4}}.
- **Geometry**: add level-of-detail (LOD) meshes to purchased assets that lack them and trim excess triangles even at the highest LOD; use shader-complexity and texture-density debug views to find expensive or oversized assets {{6U8c6hbVJLY#5}}.
- **Draw calls** are the main 3D performance problem. Scatter small repeated objects (grass, bricks, distant buildings) as foliage with varied position, rotation and size and render them as instanced meshes, so a thousand copies cost one draw call {{6U8c6hbVJLY#11}}.

Birke reports the same draw-call problem from kit-based ships in Sea of Rifts, and the same family of fix: combine meshes per ship family, which works because each family shares a few texture atlases {{FC9GAL2piJI#11}}.

### Constraints as craft

Older and smaller platforms forced techniques that remain useful. Greg L's starting point is that numbers on a computer are rows of on/off switches with operations on them, not mathematical numbers; understanding that unlocks effects on constrained platforms {{oj3xA28N60I#0}}. Concretely:

- **Bitfields.** Pack many yes/no flags into one integer and test them with a bitwise AND. His example is a PICO-8 minimap that ANDs a "visited" value with a single-bit mask to decide whether to draw a room; the same pattern appears in controller input and collision layers {{oj3xA28N60I#1}}.
- **Wraparound.** Fixed-width integers wrap, which is why 8-bit games like The Legend of Zelda cap values at 255 and why adding one to 127 in a signed byte yields -128 {{oj3xA28N60I#3}}.
- **Fixed point.** PICO-8 uses 16.16 fixed point, in which the low bits represent halves, quarters and eighths; it behaves like integer math with an adjustment after multiplication {{oj3xA28N60I#4}}.
- **Bit tricks on floats.** The Quake III fast inverse square root reads a float's bits as an integer, shifts right to halve the exponent and subtracts from a magic constant to negate it and correct the bias, landing within about 3% before any refinement {{oj3xA28N60I#8}}.

Greg argues these tricks are becoming more relevant, not less, because modern graphics hardware relies on them, down to Nvidia's four-bit floating-point format {{oj3xA28N60I#9}}.

The genre's history is full of fitting into too little memory. Dan Stormont and Michael Howk found that the earliest Hack ran its level generator as a separate binary because the whole game would not fit into PDP-11 memory; a later refactored iteration ran as one {{R8DSq8qSJ44@24276#8}}. Keni wrote an automatic overlay system for NetHack's Amiga port using a modified GCC, replacing the PC port's intrusive per-function overlay declarations that broke often, but never released it because licensing would have meant shipping all of GCC with a game that was already the largest thing on comp.sources.games {{9V_CkJ66uJQ#11}}. Jeff Olson built Alphaman in QuickBasic on an IBM XT to fit on one floppy and run without a maths coprocessor, so he replaced sines and cosines with integer multiplication and bit shifts and added QuickC modules with embedded assembly when the executables outgrew a 5.25-inch disk {{Gk5uWXBANkA#2}}.

Modern fantasy platforms impose constraints on purpose, and two speakers find them productive. PICO-8's 8,192-token limit pushed Sonat Uzun to keep Tea Garden's music generator to about 1,500 tokens through heavy code sharing: all motifs go through the same iterative loop and all parts use the same write function, and he says the limit helped him invent motif-based generation {{SBjsVcffOHg#10}}. Eiríkr Åsheim describes Uxn, a small self-contained platform of assembly language, VM specification, emulators and ROMs, with 64KB of memory, 8- and 16-bit integers and a four-colour display, and finds its limitations freeing {{qogCwa12jEg#0}}.

## Tensions and open questions

**Does ECS fit a roguelike?** Nystrom argues that domain-split ECS solves problems a turn-based tile roguelike does not have, and that almost nobody in his audience had cache-miss trouble {{JxI3Eu5DPwE#1}}. Biskup reports better modularisation and easier modding from a modified ECS in Ultimate ADOM {{fGLJC5UY2o4#0}}. They are arguing about different things: Nystrom rejects the split by engine domain and the performance case, Biskup values composition. The choice turns on whether things in your game must change what they are at runtime, such as a possessed body becoming an item or a wall coming alive, which is where components earn their cost and their class of emergent bugs {{iZUXjbcAfYs#18}} {{fGLJC5UY2o4#9}} {{fGLJC5UY2o4#18}}. Peglin adds a caution from the other side: a component architecture that makes the team fast is not automatically a mod system {{ke0cLTVg2_M#13}}.

**Coroutines or not.** Berman wants rule resolution written as coroutines so the code's call stack mirrors the game's {{DT9_7sW5knY#14}}; Cronin watched Monster Train's whole game loop become one giant coroutine tangling UI, sound and logic {{qO3CIpP62Q0#3}}. The difference seems to be whether presentation timing goes inside the coroutine, but no talk tests a disciplined coroutine rules engine at scale.

**How far data can go.** Content as data is the chapter's strongest consensus, yet Cronin's card scripts broke down on dependent and scaling effects {{qO3CIpP62Q0#7}}, Biskup deliberately keeps a fixed layer of core rules out of data {{fGLJC5UY2o4#1}}, and Ray finds that as Caves of Qud's XML grows more expressive it becomes a programming language, with a tension between power and comprehensibility that is still open {{n6mKigS_71Y#7}}. Compton's principles for polite languages (unfoldable syntax, scaffolding, structure editors) are the best available guidance for easing that tension {{E5-3Ui7oO8U#8}} {{E5-3Ui7oO8U#10}}, but no talk reports applying them to a large game's mod data.

**When to build structure.** Compton's rule is to introduce structure when you see the same special case written over and over, and she admits to over-engineering a parser she later abandoned {{isB82kORimk#4}} {{E5-3Ui7oO8U#14}}; Hinenzon's chore queue drifted until it did little of what it was built for {{MyVigc1nDig#5}}. Against that, Moromisato, Cronin and Day all say that some things are much harder to retrofit than to design in from the start: modding hooks and API versions, determinism for previews, gameplay replays {{mES03vaZo3U#8}} {{mES03vaZo3U#12}} {{qO3CIpP62Q0#5}} {{p48ArjJweSo#13}}. The talks suggest the line falls between speculative generality, which you should defer, and the few properties (determinism, serialisable state, a versioned extension point) that are cheap early and very expensive late.

**Retrofitting an existing codebase.** No talk offers a clean path from a coupled codebase to an isolated simulation. Biskup concluded ADOM could not be separated and built a new engine {{iZUXjbcAfYs#6}}; Russ spent about a year making NetHack's saves forward-compatible {{SDojcmObQzw#7}}; Day found replays too complicated to add late {{p48ArjJweSo#13}}. Incremental steps exist, such as giving UI handlers the lowest priority {{p48ArjJweSo#8}} and categorised logging while you live with the coupling {{qO3CIpP62Q0#14}}, but how to get from there to a black-box simulation remains unsolved.

**Rollback or lockstep.** Zeyfang needed rollback because NecroDancer's rhythm cannot wait a round trip {{zwhNSbFVKQM#1}}; Plummer lost two months to rollback before lockstep proved enough for a turn-based game {{UNBAoc0TJSs#5}}. The deciding factor is how much input latency the game can tolerate.

**Animation order.** Reid calls synchronising animations with the logical order of simultaneous events the hardest part of juicing a roguelike and left the glitches in Golden Krone Hotel {{xSYVQc7cH-4#18}}. Thomas Robertson's blocking and concurrent effect lists are a plausible general answer {{f1t4yPjfZyM#3}}, but no talk shows a full scheduler that derives ordering from the simulation's change records.

**Own engine or big engine.** LeBreton argues for building your own engine or tool to put your values into practice {{MJZvWgcxV0M#13}}; Biskup chose Unity for multi-platform reach after painful hand-written ports {{iZUXjbcAfYs#10}}. It depends on whether control over how your tool thinks or reach across platforms matters more.

**Which language.** Josh Ge says language matters little and recommends Python with libtcod to beginners {{jviNpRGuCIU#1}} {{jviNpRGuCIU#13}}; Daigle rejected Python as slow to show visible results beyond ASCII and chose GameMaker, though he would pick Godot now {{2C3w7-SU5ek#5}}. And Kingsford's tree-search playtesting needed a compiled, multi-threaded loop, with the locking problems of a shared search tree left unsolved {{9iTJ9Z8p0ao#5}}. Language matters little for writing the game and can matter a lot for the tools that play it thousands of times.

**Little languages and their learning cost.** Kovach frames a restrictive language as a conduct that forces new and useful ways of thinking {{s9Wyn9BJJI4#4}}; Cooper's small user study gave some indication that identity-free tile rewriting asks for a different way of thinking about program structure than a player object does {{K5FXzxDIQdQ#6}}. Whether the bill is worth paying depends on how closely the language's constraints match the problem.

**How much to verify.** Cross-reference validation is cheap and catches real errors {{FV_0rmqxbxw#3}} {{FV_0rmqxbxw#11}}, but Horneman's attempt to prove a dynamic reservation system never ran dry cost far more than expected and still needed a runtime fallback {{FV_0rmqxbxw#5}}. At the far end, The Hobbit's simulation could not be verified at all, shipped with famous bugs that Reed says also lent it charm {{CE7o3GGif30#10}}, while NetHack handles cases its developers believe impossible and rarely crashes {{5y_IAdOwaYs#8}}. How much emergent misbehaviour a game can afford is a design decision as much as an engineering one.

**Tooling still missing.** Caves of Qud's translators work in raw XML with no in-game view of a string in context, and the team calls such tooling a big unknown {{R8DSq8qSJ44@5367#13}}. Anderson's sparse "hash sand" storage for falling-sand worlds is an untested idea {{R8DSq8qSJ44@15170#11}}.

## Checklist

- Where is the giant chain of if statements in your content code, and what data structure would replace it?
- Can a designer add an item, monster or card by editing data alone, and what does it cost when they cannot?
- Are timing values and other tuning that shapes the player's experience in data, or buried in code where only programmers can reach them?
- Does adding a new behaviour require touching existing ones, or can it be added as a new action, command or handler?
- If your events have an order, is it deterministic and documented, and can you replay an event log to see what happened?
- Does any simulation code call into UI, animation or sound, and does the presentation ever write back into game state?
- Is all simulation state, including the random number generator, in one structure you can serialise, copy and compare?
- Can you reproduce a player's bug from their save or replay, and run the game headlessly for automated play?
- Does your networking model match your game's real tolerance for input lag?
- If you want mods, is your own content built with the mod system, and does every mod declare an API version?
- What is the turnaround for your most frequent edit, and which operation do you do several times a minute that could be cheaper?
- Does any hand-maintained spreadsheet duplicate data the game already has?
- Is cross-referenced data (tags, IDs, room requests) validated in continuous integration on every submission?
- Do you have an extensible debug menu, and do you record the inputs to dynamic content selection so you can analyse them later?
- Do crashes from players arrive with a save and a stack trace attached?

## See also

- [Systems and emergence](05-systems-and-emergence.md): the interacting systems this architecture has to hold, and the emergent behaviour it makes possible.
- [Generative methods](11-generative-methods.md): the algorithms that the procgen tools and validators here wrap and test.
- [Art and audio](14-art-and-audio.md): animation and juice, which sit on the presentation side of the simulation boundary.
- [Production and process](16-production-and-process.md): iteration speed, playtesting and team practice around the tools described here.
- [Community and business](17-community-and-business.md): modders, public servers and the players who report the bugs.
- [History and lineage](02-history-and-lineage.md): curses, PDP-11 memory limits and the codebases that today's roguelikes inherit.
