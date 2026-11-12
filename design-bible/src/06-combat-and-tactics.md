# 06. Combat and tactics

Most roguelikes are, turn by turn, a sequence of small tactical decisions: step or strike, drink or flee, hold the doorway or break for the stairs. This chapter is about what makes those decisions worth making. It covers the verbs a turn offers, what each action costs, how turn-based play relates to real time, how much of the threat the player can see and count, how space, monsters and traps create problems, how tactics survive when fighting is optional, and what happens to the turn when several people share it.

The talks rarely argue for bigger combat rulesets. They come at tactics from the other direction: a small, legible set of verbs, a price on every action, threats the player can read, and enemies, terrain and hazards that combine into problems with more than one answer. The speakers range from designers of classic roguelikes and card games to people building real-time hybrids, pacifist crawlers and online multiplayer, and several of the same principles recur across them.

## In brief

- Bump-to-attack, where one direction key moves or hits depending on what is there, is an elegant foundation, and its shared input makes designs like one-key party movement possible {{X4be22WoVgg#0}} {{X4be22WoVgg#3}}.
- A turn is one mutually exclusive choice, and it does not need many options to be deep, only options that are never no-ops {{TeURjrAYFEU#5}} {{kvgKKRLil_8#0}} {{CLi4PWxDmAI#13}}.
- Degenerate optimal play comes from actions that cost nothing, above all from a free out-of-combat state, so audit your game for free actions {{b8uoQHedFV0#7}} {{b8uoQHedFV0#10}} {{b8uoQHedFV0#16}}.
- Time is an implicit resource that can outweigh the explicit costs you design, to the point where options feel not worth a turn {{kvgKKRLil_8#9}}.
- Nauticrawl's real-time beta failed because players could no longer tell what killed them, and was rescued by turns that emerge from the simulation; Diablo's per-action time costs carried over to real time with much of the data intact {{wxmio1S3iN0#5}} {{wxmio1S3iN0#7}} {{OwFrTY3IoQQ#5}}.
- Tactics need readable threats: predictable enemies, displayed threat zones and a field of view that is symmetric and consistent with targeting {{ohH6LBM2EiU#1}} {{OVSi3NzA0KM#6}} {{rNi5nO5yqLs#0}} {{UNBAoc0TJSs#2}} {{y1zkrTcNJbc#0}}.
- Keep the damage math countable so players can plan {{VVRomN99Ygw#8}}, and give them levers over the odds, because randomness they have some control over frustrates them less {{kaojiu9syPE#12}} {{kaojiu9syPE#11}}.
- Give monsters and weapons distinct zones of influence and tricks that target position, items or tempo rather than only hit points {{lfb6uehmrWo#15}} {{lfb6uehmrWo#9}} {{0MdNwIHwXy0#3}} {{3S6uRMCdvNs#2}}.
- A trap that is hidden, instant, single-tile damage is a hit-point tax; separate trigger from hazard and make combinations of hazards the challenge {{ymgmhtkRLyY#1}} {{NjIduRLJL7U#0}} {{ymgmhtkRLyY#3}} {{NjIduRLJL7U#18}}.
- Every multiplayer turn scheme the talks describe trades something away (freedom from waiting, coordination at larger player counts, direct interaction between players), so choose which one to sacrifice {{neuJCYmbAG8#5}} {{zwhNSbFVKQM#2}} {{neuJCYmbAG8#6}} {{UNBAoc0TJSs#7}} {{UNBAoc0TJSs#8}}.

## Bump, step, act: the grammar of a roguelike turn

### Bump-to-attack as a foundation

The oldest rule in the genre is also one of its best. Michael Brough asks how big an idea it was, before it became standard, that in Rogue you press a direction key and either move, if the square is empty, or hit, if something is there; he uses it to push back on the reputation of roguelikes as inelegant {{X4be22WoVgg#0}}. One input, two outcomes, decided by the state of the board: that is the grammar most roguelikes still speak.

Its value shows in how far it can be bent. Brough points out that Rogue's own invisible monsters and blindness make the outcome of a direction key uncertain, since stepping toward an empty-looking square may swing at an unseen phantom. Described in the abstract, "you choose a direction and the game picks the action" sounds absurd, yet inside Rogue it feels natural {{X4be22WoVgg#1}}. His own 868-HACK folds ranged attacks into the same key: press toward an enemy anywhere in line and you fire at it and stay put, where Rogue needs a separate throw command. He admits it makes no physical sense and justifies it by the cyberspace setting {{X4be22WoVgg#2}}. Nightmare Cooperative goes further and moves a whole party with one set of direction keys. Each character moves or attacks depending on what lies in that direction, so a single press can have one character fighting, another heading for the exit and a third picking up treasure. Brough notes this only works because movement and combat share an input; with a separate attack command the party would swing at empty air {{X4be22WoVgg#3}}. The opposite extreme is the Wii Shiren, which John Harris describes as the only game in its series that lets you directly control every party member each turn from a shared inventory. It slows play, but it turns boss fights into a real tactical challenge {{0MdNwIHwXy0#12}}.

### Removing or splitting the bump

Some designs drop the bump on purpose. In Dylan White's Rift Wizard the player cannot walk into enemies at all, though enemies happily melee the player, so every kill has to come from spells {{VVRomN99Ygw#0}}. Leif Bloomquist went the other way in his Commodore 64 multiplayer roguelike: an explicit attack command, combining every weapon the player holds, because he wanted to add ranged weapons later and bump-to-attack would not accommodate them. The distinction between using a potion and swinging a sword needed some coaching, but players picked it up quickly, helped by a first level that works as a tutorial {{Y0K-e83wYnQ#3}}. The choice between bump and explicit command is therefore about which verbs you need later: a bump is elegant when movement and melee are the main verbs, and can get in the way when ranged attacks must be aimed.

### The turn as one mutually exclusive choice

Under the input sits the real unit of tactics: the turn. Sersa Victory treats it as the canonical mutually exclusive choice. You can drink a potion, swap rings or zap a fireball, but only one of them before the monsters and the environment act, and in a crunch moment, where one wrong move means permadeath, picking that single action is tense {{TeURjrAYFEU#5}}. Dylan White sorts the options into three kinds: move to reposition, attack to make a small change to the board, or spend resources to make a big change to the game state. He calls the last "spellcasting" whatever the setting; in science fiction the same role is played by items or devices {{kvgKKRLil_8#0}}.

This does not need many options to be deep. Darius Kazemi points to Hoplite, which offers only three or four choices at any moment, but every one of them has dire consequences, so there are effectively no no-op moves {{CLi4PWxDmAI#13}}. Todd Furmanski describes the other side of the same tension in his Myst-style first-person roguelike: dozens of possible actions, one of which decides life or death, and unlimited time to choose. Because both Myst and Rogue are turn-based, you can pause, make coffee and wonder whether the bottle cap you found will help {{ST6s_8ekeOg#9}}. Darren Grey adds that controlling a single character gives the player a rhythm squad games do not offer in the same way: move quickly when safe, then stop and think hard when things get hairy {{C2sm-z7Ag4U#17}}.

### Change one rule and everything moves

Because the grammar is so small, changing a single rule reshapes the whole game. Pippin Barr and Jonathan Lessard's Chogue, a chess-and-Rogue hybrid, is a run of such experiments. Choosing chess's one-hit capture over Rogue's chipping away at hit points was, Lessard says, pivotal; their variant Cherry Chogue reversed it by giving pieces hit points equal to their chess value (a rook has five), and that changed everything {{l1YEJBKehAY#5}}. They also found that "turn-based" hides several models: chess moves one chosen unit per turn, Rogue moves every unit on a side. Moving all of black's pieces each turn made chess thinking stranger and scarier, but it was tedious, raised questions of order, and made it hard to track which pieces had moved, so they went back to chess turns {{l1YEJBKehAY#6}}. Even the question of whether a knight can jump a dungeon wall needed a ruling; Barr argued that lifting a piece and placing it elsewhere is teleportation from the pieces' point of view, so knights ignore walls {{l1YEJBKehAY#4}}.

Movement rules alone can carry a game. Josh Ge describes the 7DRL (a roguelike made in seven days) Knight, where the mounted player can only accelerate, turn or slow down gradually, so the single square you can reach next turn is where you will be, and you have to plan to line up sword strikes on moving foes {{jviNpRGuCIU#6}}. Nick Bush's Word Processor makes the hero a blinking text cursor and takes its ordinary behaviours as movement rules: it wraps from the end of a line to the start of the next, cannot cross untyped white space (which acts as a wall), and cannot move diagonally {{R8DSq8qSJ44@1660#1}}.

### When the battle format is already solved

The same logic applies at the scale of a whole combat system. Benjamin Berman's advice to card roguelike designers is blunt: Hearthstone's battle format is so hard to beat that you should either devote your whole development to building a better combat system, as he says Dicey Dungeons does, or adopt it and innovate elsewhere, where persistent worlds, quest navigation and randomly authored cards are all up for grabs {{DT9_7sW5knY#5}}.

**In practice.** Pick the smallest set of verbs that makes every turn a real choice, ideally one where no option is a no-op {{CLi4PWxDmAI#13}} {{TeURjrAYFEU#5}}. Decide early whether movement and attack share an input, based on whether you will need aimed ranged attacks {{X4be22WoVgg#3}} {{Y0K-e83wYnQ#3}}. When you experiment, change one rule at a time (damage model, who moves per turn, how a piece moves) and play it, because each one alters everything downstream {{l1YEJBKehAY#5}} {{l1YEJBKehAY#6}}.

## Every action should cost something: free actions and time as a resource

A turn is only a real choice if taking it costs something. The talks find that cost in time, in pressure and even in the player's hands, and they warn about what happens when it is missing or too high.

### Free actions breed degenerate play

Nicholas Feinberg, speaking about Dungeon Crawl Stone Soup, puts the problem at the root: degenerate optimal play comes from actions that cost nothing. He notes that real time is heretical in a roguelike, but what Crypt of the NecroDancer really solves is the existence of free actions, like rearranging workers in Civilization, and real time is only one way to price them {{b8uoQHedFV0#7}}.

His sharpest target is the split between being in combat and out of combat, which he calls the "great sin" of Crawl and all the old-school roguelikes. It is not a formal game state, only whether enemies are near, and out of combat turns are nearly free. So players precast buffs and summons so they are active at the start of every fight, and retry abilities with a failure chance until they succeed. It is hard to balance around, because there is no formal line and an enemy may be just around the corner {{b8uoQHedFV0#10}}. His closing advice for anyone building a tactical game is to be wary of free actions, think about how the game plays in and out of combat, or avoid an out-of-combat state entirely {{b8uoQHedFV0#16}}.

> Be wary of free actions. Consider how the game will act in and out of combat, or whether you can avoid an out-of-combat state entirely. {{b8uoQHedFV0#16}}

Crawl's own fix for allies shows what pricing an action does. Each order to an ally costs a turn, just like moving or attacking. If orders were free, players would micromanage a dozen orc minions every turn of every fight and the game would bog down; with a cost, the player has to decide whether telling all the orcs to focus the wizard matters more than attacking himself {{b8uoQHedFV0#8}}.

### Time pressure transforms solved patterns

Feinberg's NecroDancer example shows the cost can be time itself. Red dragons follow exact patterns, so a fixed dance beats them every time without taking damage. Repeating that dance against hundreds of dragons in Crawl or Angband would be tedious, but with only about a second per move, executing the manoeuvre becomes satisfying in itself; the time pressure does not just add challenge, it transforms the action {{b8uoQHedFV0#6}}. Dan Recht sees the same mechanism as short-term risk management: on every beat, you decide whether to act now or wait for the next one while everything else moves {{FnJxkId-1eE#9}}.

### Turns are a resource you forgot you had

Even without real time, a turn costs something, and it can cost more than you intend. Dylan White found in Rift Wizard that players were reluctant to use many spells because they did not feel worth a turn. Time is an implicit, fungible, constantly renewing resource that cannot be hoarded, and in a turn-based game it can outweigh the explicit resource a spell spends. His lesson: think carefully about time, and look for other implicit resource systems you did not know you had {{kvgKKRLil_8#9}}. Feinberg and White are describing the same lever from opposite ends: a turn that is too cheap invites degenerate repetition, a turn that is too dear makes options dead.

### Other clocks

A run needs some pressure to move forward, and the talks offer several kinds of clock. Rosalind Miles Chapman describes wandering monsters, common in roguelike-adjacent board games, as a clock with more counterplay than a timer, because combat is usually the most detailed system in the game: you can evade them or power through. It only works if they are threatening and not worth farming {{j9ykOdQRUQk#3}}. Tom Francis shows how much the type of clock matters in Heat Signature, where each ship has its own alarm. A timed escape turns the mission into speed stealth; a fleeing target runs for a teleporter pad, so getting there first lets you trap them; no alarm at all makes detection risky but without long-term consequence, which opens up luring tactics. The same layout plays differently under each {{3vSCncV5hkI#11}}. Gavin Verhey, from Magic: The Gathering, makes the general point about pace: a very fast format punishes multicolour decks and slow build-around plans, while a glacially slow one makes maximal greed always correct and games feel samey. The sweet spot is in the middle, where aggressive and controlling strategies are both viable {{lGm8cZC8Lfk#21}}.

### The physical cost of input, and the value of cheap turns

Cost can also live in the player's hands. Yong Zhen Zhou notes that fighting-game motion inputs put a physical cost on stronger attacks, mirroring the character's exertion, and impose limits: Guile's Sonic Boom needs down-back held to charge, so it cannot be used while walking forward {{KRZHT-gktD0#4}}. His broader rule is to map high-effort actions to high-effort inputs, like burst breakers that need all four attack buttons slammed at once, or heavy attacks put on triggers and multi-button combos {{KRZHT-gktD0#5}}.

Not every turn should be expensive, though. Pandamander uses Kahneman's split between fast, automatic System 1 thinking and slow, deliberate System 2 to point out that System 1 drives dashing in Hades and dodging in The Binding of Isaac, and also the relaxing autopilot stretches of Slay the Spire, where automatically picking block cards is a trough players enjoy, sometimes while watching a video {{KtQh4QrsUzs#4}}.

**In practice.** Audit your game for actions that cost nothing: buffs that can be precast, failure chances that can be retried, orders that take no time {{b8uoQHedFV0#10}} {{b8uoQHedFV0#8}}. Decide whether you have an out-of-combat state and, if so, what stops it being free {{b8uoQHedFV0#16}}. Check whether some options are dead because they are not worth a turn {{kvgKKRLil_8#9}}. For each clock (hunger, wanderers, alarms, beat timers), decide deliberately what it is for {{3vSCncV5hkI#11}} {{j9ykOdQRUQk#3}}, and leave room for low-cost turns so the expensive ones stand out {{KtQh4QrsUzs#4}}.

## Turn-based, real-time and the hybrids between

If time is the currency of a turn, the next question is whether it should run on its own clock.

### A constraint that became the design

The first roguelikes were turn-based because of technical constraints. Santiago Zapata recounts a little-known episode in which Moria was briefly turned into a real-time game; players did not like it and it went back to turn-based. For Zapata it shows how a constraint became a core design element, and probably the most contentious one today {{ZMdxP7fO6wE#11}}.

### Two ways to break a crawl

The failures on either side are instructive. Andrea Interguglielmi always meant Nauticrawl's crawl to be slow and turn-based, about wonder and discovery, but he did not want big "your turn / enemy turn" banners breaking the immersion of the machine simulation, so the world drifted into real time {{wxmio1S3iN0#6}}. In beta, real-time enemies plus real-time machine maintenance, with blinking warning lights demanding attention, overwhelmed players. Testers liked pressing the buttons, but they died without understanding why, and only three or four finished {{wxmio1S3iN0#5}}. His fix close to the deadline was to make turns emerge from the simulation: the player pipes pressure into the engine, and each move needs pressure to build. Levers speed buildup, but stressing the engine releases heat and noise that strain the stealth device and draw more power, so the turn system became part of the machine itself, a side effect he had not foreseen {{wxmio1S3iN0#7}}.

Zapata's turn-based side-scrolling Mega Man Roguelike failed in the opposite direction. A jump hung in the air between turns, rising a tile per turn before falling, and arm-cannon bullets travelled as world objects, so you had to calculate when they would hit; it was too hard to understand what was happening. He took away that experiments are worth doing, but at small scale {{TMxzVy7-VYQ#8}}. Both failures come down to the same thing: the player could no longer read cause and effect.

### Time costs survive the conversion

David Brevik's account of Diablo is the bridge between the two worlds. The original pitch was turn-based with permadeath, but never a simple my-turn, your-turn system: moving orthogonally cost 10 points and diagonally 14, like time segments, so the order of actors constantly changed {{OwFrTY3IoQQ#1}}. When the team went real-time, that scheme carried over: costs became fractions of a second (1 second orthogonal, 1.4 diagonal) at roughly 10 turns per second, the numbers stayed tunable, and much of the underlying data still applied. The main change was letting player and monster turns resolve simultaneously {{OwFrTY3IoQQ#5}}. Diablo II then sped up through a series of micro-decisions: a 5x5 subgrid inside each tile, varied monster footprints, 16-direction movement and running (added because players hated the 30 to 40 second walk across town, and limited by a stamina bar Brevik calls a terrible decision). Faster players forced faster monsters {{OwFrTY3IoQQ#8}}.

### Hybrids

Between the poles sit several hybrids. Tyriq Plummer describes Red Rogue, which offers a real-time action mode and a mode where time advances only when the player acts; in the latter the game stops dead, particle effects included, when input stops {{OVSi3NzA0KM#3}}. Andrea Roberts's physics-driven Roundguard splits each turn into a planning and prediction phase followed by a reaction phase, in which class skills such as the Rogue's double jump salvage a shot mid-bounce {{2BHfpAF76J8#3}}. Roundguard also inverts the usual source of uncertainty: in a grid roguelike you control your hero completely and the enemies are the unknown, whereas here the player's own shot is unpredictable and enemies are stationary or follow learnable paths. The same predict-then-react habits apply, aimed at yourself {{2BHfpAF76J8#4}}. Leif Bloomquist's networked C64 roguelike is real-time at heart: the server updates every player and monster on a 50 ms tick, while timers attached to each entity limit how often it can move, for example one square per 300 ms {{Y0K-e83wYnQ#9}}.

**In practice.** If you go real-time or hybrid, protect the player's ability to understand what killed them; Nauticrawl's beta shows how quickly that goes {{wxmio1S3iN0#5}}. If you might convert later, a time-cost (energy) scheduler, where each action has a cost and actors act in cost order, can carry over to real time by mapping costs to fractions of a second, as Diablo's did {{OwFrTY3IoQQ#5}}. And if your hybrid moves uncertainty somewhere new, as Roundguard does, keep the other side predictable {{2BHfpAF76J8#4}}.

## Fair fights: readable threats and odds the player can work with

Whatever the clock, tactics need information. A player can only plan against what they can predict, see and count.

### Predictable enemies

Dan Norder's account of Chase, a BASIC-era proto-roguelike, is the purest case. Its robots always take the shortest passable route to the player, so you can predict exactly where they will go and lure them into fences or into each other; there is no real combat, and all the tactics come from that predictability. One early variant even let players skip printing the map {{ohH6LBM2EiU#1}}. Tyriq Plummer makes the same point about Spelunky: for all its arcade feel, its enemies and traps are simple and consistent enough to predict and plan around, so surveying a situation before jumping in usually pays {{OVSi3NzA0KM#6}}.

Into the Breach takes it to the limit. Justin Ma says Subset wanted the focus to be a puzzle you can see right now, not predicting and manipulating enemy AI as in Fire Emblem, where you stand in a space to steer where enemies go {{rNi5nO5yqLs#0}}. John Harris describes the same idea applied to a single monster in Shiren 6: behemoths are slow, one-hit-kill giants with one hit point, you are warned about them in advance, and they are visible even on dark levels, so you beat them by attacking from behind or throwing items over their barrier {{0MdNwIHwXy0#16}}. Plummer's Scrubbin' Trubble shows enemy threat zones and planned actions so players can make informed decisions quickly {{UNBAoc0TJSs#2}}, and Benjamin Berman finds the same principle in card design: a good card makes clear how the opponent has to play around it, so each side builds a puzzle board for the other to solve, which works against an AI as well {{DT9_7sW5knY#7}}. Several independent designers, then, converge on displaying the threat rather than hiding it.

### Field of view must agree with targeting

What you can see has to match what can hit you. Albert Ford sets three requirements for a roguelike field-of-view algorithm: efficient (fast), consistent with targeting, and symmetric, meaning if I can see you, you can see me {{y1zkrTcNJbc#0}}. Inconsistency produces unfairness: seeing something you cannot target, targeting something you cannot see, and worst of all, something you cannot see targeting you {{y1zkrTcNJbc#1}}.

> If it's something that you can't see and it can target you, then you're in danger. {{y1zkrTcNJbc#1}}

### Hidden information on purpose

Hiding information is not always a flaw; it depends on what the hiding is for. Nic Tringali describes secretly committed information, like Dune's battle wheels or Netrunner's face-down ice: the opponent takes the place of the deck or the dice, you push your luck against what they created, and the exchange feels simultaneous until the two hidden plans reconcile {{R8DSq8qSJ44@17074#8}}. Jeff Lait's 1812 7DRL uses stale information as its subject: the general learns troop positions only through messengers, so the farther the troops go, the more out of date the picture, an illusion of strategic control he drew from War and Peace {{LQPGmxytTws#15}}. And sometimes information is hidden by accident. Johnathan Pagnutti graphed the weighted move transitions of Slay the Spire's Jaw Worm and found that it spends most of its time blocking and buffing strength before chomping hard, a texture he had not noticed in about 300 hours of play {{Uf34SbuWIos#2}}. If you want players to learn an enemy's pattern, check that it can actually be read from play.

### Randomness the player can count and control

The second half of fairness is the dice. Dylan White keeps Rift Wizard's damage formula simple enough to count: percentage resistances and shields that each block one instance of damage. A Fireball deals 9; an enemy with -50 fire resistance takes 14 (rounding up) and dies in one hit; fairies with 9 HP and one shield need two Fireballs. Players can evaluate a level by counting hits {{VVRomN99Ygw#8}}.

Evan Debenham, developer of Shattered Pixel Dungeon, works on how randomness feels. Under uniform rolls, armour often blocked almost nothing, so players ignored it and dumped every upgrade into weapons; switching to a pyramid distribution (summing dice, so middle results are likeliest) made armour consistently protective while keeping low rolls possible, and rebalanced offence and defence {{kaojiu9syPE#4}}. His principle is that players are less frustrated by randomness they have some control over, so mechanics that let them manipulate the odds change how RNG feels without changing the underlying system much {{kaojiu9syPE#12}}. Shattered keeps base hit chance a little low but guarantees a hit on a surprise attack, from stealth or using the environment, such as striking an enemy as it steps into a doorway; that rewards positioning and gives early-game players a skill-based answer to bad luck {{kaojiu9syPE#11}}. Debenham's lead example is Darkest Dungeon 2, which replaced many of the first game's numeric stats with combat tokens: hit chance is normally 100%, halved by a blind token on the attacker or a dodge token on the target. The Leper now has high damage and blinds himself, so the play is to clear the tokens, and although the player does much the same thing, the tokens feel more interactive {{kaojiu9syPE#13}}.

### When the math is opaque and loss is permanent

Stella Vermilion's account of the Nuzlocke, a self-imposed Pokémon challenge in which a fainted Pokémon is gone for good, shows what happens without that transparency. Pokémon looks like rock-paper-scissors, but its multiplicative damage formula stacks a random roll between 85 and 100, type effectiveness, weather, items, misses, critical hits, secondary effects, trainer AI and random moves like Metronome, and on the razor's edge of permanent loss that complexity matters {{R8DSq8qSJ44@31561#3}}. Battles become wars of resource attrition: can you knock out their team before yours falls, given who resists or is weak to the current threat {{R8DSq8qSJ44@31561#4}}? Sometimes the right play is a calculated sacrifice, because switching in after a knockout denies the enemy a free hit, permanently spending a Pokémon the way a roguelike spends non-regenerating hit points {{R8DSq8qSJ44@31561#6}}. Younès Rabii's account of Pokemon Glitch shows a lever against overwhelming numbers: against a wildly overlevelled enemy, the answer was Curse, which takes an eighth of the target's HP each turn regardless of how large the pool is, plus luck and sacrifices {{Ove6z8zDsjE#6}}. Percentage damage gives the player a tool that the size of the enemy's numbers cannot outscale.

Severe outcomes need rationing too. Thomas Biskup argues Ultimate ADOM's limb severing must stay rare, limited to special weapons and circumstances, because if every one of thousands of fights could hack off limbs, the player would soon be crippled {{iZUXjbcAfYs#19}}.

**In practice.** Show threats: make enemy behaviour simple and consistent, display threat zones or intents, and make your field of view symmetric and consistent with targeting {{ohH6LBM2EiU#1}} {{UNBAoc0TJSs#2}} {{y1zkrTcNJbc#0}}. Keep the damage math countable {{VVRomN99Ygw#8}}. Shape your random distributions so key defences are reliable, and give the player levers over the dice (guaranteed hits for good positioning, tokens they can remove) {{kaojiu9syPE#4}} {{kaojiu9syPE#12}} {{kaojiu9syPE#11}} {{kaojiu9syPE#13}}, and consider percentage effects that big enemy numbers cannot outscale {{Ove6z8zDsjE#6}}. Hide information only when the hiding is the point, and keep crippling outcomes rare {{iZUXjbcAfYs#19}}.

## Space is the weapon: positioning, zones of influence and geometry

Information tells the player what a threat is; space decides where it can reach.

### The dungeon as a tactical surface

John Harris credits Rogue with an advance over earlier dungeon games, which were sequences of spaces that might contain an encounter: in Rogue the space mattered because the monsters could use it too. Several monsters could attack at once, doorways were safe spots and dark rooms left you open from any direction, so the dungeon itself became a source of opportunities {{KY-TmRw5sR8#7}}.

### Zones of influence and distinct weapons

Brian Walker, discussing Brogue, borrows from chess: pieces differ only in how they move and attack, yet their interlocking zones of influence produce all of chess's depth. Monsters and effects can do the same, through water-bound monsters, flyers that cross chasms, line-of-sight effects, directional ranged attacks, known-shape area attacks, light-dependent effects and monsters that avoid choke points {{lfb6uehmrWo#15}}. Weapons should follow the same rule. Walker's answer to weapons that feel alike is to make them as different as possible: Brogue's axe hits every adjacent enemy, not just three in front, which helps against a crowd and gives no edge one-on-one {{lfb6uehmrWo#9}}.

bhauth shows how this ties strategy to tactics in Dungeon Crawl Stone Soup. Shields lose effectiveness the more attacks you take per turn, and axes hit all adjacent enemies, so choosing axe plus shield (a strategic, character-build decision) links directly to how you position against groups (a tactical one). That link between a strategic layer joining all encounters and the tactical layer within each, bhauth argues, is part of what makes DCSS interesting {{tg-CjNodlmY#1}}. Shawn Main gives the reason it matters: challenges should test the player along multiple axes, because if one option, faster or stronger, is always better, the player learns to pick it and choices stop mattering {{WLBJJTc6LWI#9}}. Positional variety is one of the cheapest ways to get multiple axes.

### Positioning rules that create tactics

Small rules about space create whole tactical vocabularies:

- **Cover with an escape valve.** In Wildermyth scenery acts as cover, but an attack against an enemy flanked by an ally always hits, and hunters with daggers deal double damage when flanking, so cover never becomes too annoying and positioning becomes the core of the tactics {{vtU3Xa0ShKw#18}}.
- **Rewarding exposure.** Matthew Davis wanted Into the Breach to invert XCOM's hide-behind-cover play by motivating players to step in front of damage to protect civilians {{rNi5nO5yqLs#8}}.
- **Height.** Red Rogue's side view makes dropping onto an enemy from above inflict a long stun (and enemies can do it to you), while ranged weapons fire only horizontally, so seeking high ground conflicts with shooting. Plummer says this one twist turns an otherwise standard roguelike into something fresh {{OVSi3NzA0KM#4}}.
- **Asymmetric movement and missiles.** Ultimate ADOM dropped diagonal movement for want of a friendly keyboard mapping, and testers did not notice; because missiles still fly in any direction, ranged attacks reach points melee cannot, giving them a new strategic edge {{hnoF_bL-HjI#16}}.
- **Grid geometry.** Zeno Rogue says what matters most in HyperRogue is that you move and fight like in Rogue; on its hyperbolic heptagonal tiling, a heptagon gives one more neighbouring direction, so when several monsters attack you can step onto one and defeat them {{wOlSws-OI2o#2}}.
- **Protected squares.** NetHack's Elbereth engraving frightens most monsters off your square; in Adeon's speedrun he stands on it on the up stairs so a fleeing quest nemesis keeps approaching, getting scared and taking free hits {{rIB0y_kwFuY#4}}.

### Geometry decides the fight

Quinten Konyn's reconstruction of a death from a morgue file (the post-mortem log a roguelike writes when you die) is a worked example. He seems to have retreated around a corner, where a ranged enemy could hit him but his axe could not reach it; he stepped out to fight, was blasted, and an orc warrior landed the killing blow {{a9flzzXJVcg#2}}. His axe was useless against a shape on the map it could not cover.

> In this position, it can attack me, but I couldn't attack it. {{a9flzzXJVcg#2}}

**In practice.** Design threats as shapes on the map: reach, lines, areas, terrain they cross or cannot cross {{lfb6uehmrWo#15}}. Make each weapon and ability change which shapes are safe for the player, and tie build choices to those shapes so strategic and tactical decisions feed each other {{lfb6uehmrWo#9}} {{tg-CjNodlmY#1}}. Look for one positional rule (flanking, height, geometry) that gives your game its own vocabulary {{OVSi3NzA0KM#4}}.

## Enemies as problems, not damage sponges

### One clear trick per monster

The monsters that occupy that space are the other half of the problem. A monster earns its place by posing a distinct problem. John Harris's tour of the Shiren series is full of them: archers that attack from range, a radish that slows you with poison grass, fast monsters that lay traps, one that turns your items into rice balls, and a thief walrus that steals from your pack and from the floor. These monsters go after your resources and your position, not just your hit points {{0MdNwIHwXy0#3}}. Eric Billingsley praises Brogue's relatively small roster for the same reason: each monster has something special, so after a few plays you know what to expect, and the game has variety without an overwhelming amount to learn {{3S6uRMCdvNs#2}}.

Atty Vohra, automating tabletop combat prep, relays Matt Colville's view that combat should tell an evolving story: think about a monster's theme and how it acts under certain conditions, such as a cornered goblin boss yelling at its underlings to attack at once, and build mechanics around those situations so the monster feels like it reacts and has tactics {{0ydWz1EvMJs#2}}. Tom Francis designs Heat Signature's enemy traits with the same bypass-and-constraint logic as its ships: heat sensors see through walls at short range, glitch dash teleports guards to suspicious sounds (five of them, the second you make noise), and trackers walk the ship methodically without needing to detect you, but their path is visible, so you can dodge, trick and trap them {{3vSCncV5hkI#8}}. A trick can also escalate. NetHack's demons can summon more demons when they hit, and each new one can summon again, so players learn to kill them fast {{rIB0y_kwFuY#25}}.

Benet Devereux looks to biology for tricks. Some cone snails tailor their venom to the prey, suggesting a monster that mixes a custom cocktail aimed at the player character's particular vulnerability {{0iNW5AYYWWw#4}}. The anglerfish suggests an invisible ambusher with a visible lure, whose light could also spoil the player's dark adaptation if your game has that mechanic {{0iNW5AYYWWw#5}}.

### Getting variety from a small roster

A roster with distinct tricks goes further than a big one. Billingsley could fit only about 14 enemies into Into Ruins on the Pico-8; because the game has no XP-based player scaling, early enemies like goblins can reappear deeper, perhaps in larger groups, and still threaten {{3S6uRMCdvNs#8}}. Todd Furmanski had only two hardware sprites on the Atari 2600 for Dragon's Descent, so each room shows the player plus one other thing (key, treasure, exit or monster); he mixes enemy AI with room layouts so each room needs some simple tactical thought {{l9eE4mT8xqI#7}}. Tuning such a roster takes small moves. Josh Grams's space game has two enemies, one of them an acid jelly that splits into smaller contact-kill jellies when shot. Eight were terrifying; he cut their number, let them steer only every few turns and halved their sight range, and was struck afterwards by how small each change was {{TsaRxD3g_os#4}}.

At the playful end, Tyler Coleman scripts a boss from a Shakespearean sonnet: it attacks on stressed syllables, moves on unstressed ones and chooses its attack pattern from the rhyme scheme, giving five or six patterns per boss, and there are plenty of sonnets {{R8DSq8qSJ44@18888#8}}.

**In practice.** Give each enemy one clear trick, preferably one that targets something other than hit points: position, items, information, tempo {{0MdNwIHwXy0#3}}. Make the trick readable {{3vSCncV5hkI#8}}. Then get variety from combinations and placements rather than from more monsters {{3S6uRMCdvNs#8}} {{l9eE4mT8xqI#7}}, and tune with small changes to count, frequency and range {{TsaRxD3g_os#4}}.

## Traps that are more than a hit-point tax

### The diagnosis

Monsters are not the only threat a dungeon poses. Two talks four years apart agree on what is wrong with roguelike traps. Reed Lockwood describes the worst case, which he says common traps trend toward: hidden, springing without warning, dealing flat damage instantly to one tile and only to the player. It amounts to a hit point tax for walking over unexplored tiles, and it leads to tedium, either mapping every step carefully or building hit points and perception until traps stop mattering {{ymgmhtkRLyY#1}}. Sersa Victory and Joris Dormans, building on Lockwood's talk, add that traps are usually one-and-done encounters limited to damage or standard conditions, end as soon as they begin, offer few meaningful choices, and feel like a surprise tax for moving through the dungeon {{NjIduRLJL7U#0}}.

> This amounts to just like a hit point tax for traveling over unexplored dungeon tiles. {{ymgmhtkRLyY#1}}

That is a waste, because traps can give a dungeon character as a hazardous place rather than an empty room to fight monsters in, and they are often neglected {{ymgmhtkRLyY#0}}. Lockwood also explains why borrowing from action games fails: turn-based play removes reaction time, so dodging depends on character attributes rather than skill, and symbolic graphics stop the player reading clues like a hole in a wall; they depend on the character's perception, after which the trap appears as a discrete object {{ymgmhtkRLyY#2}}.

### Simple fixes

Lockwood's fixes start small. Model a trap as two connected parts, a trigger (pressure plate, tripwire, magic field) and one or more hazards (a crossbow, say), so you can hide one and reveal the other; a visible grate on the floor signals something is wrong without saying what. He also concludes that multi-tile traps tend to beat single-tile ones {{ymgmhtkRLyY#3}}. Effects should go beyond damage: status effects like paralysis or poison, inventory effects like burning scrolls or magnets yanking weapons away (unbalancing in a game with no other inventory effects), and movement effects like teleporters, conveyor belts and rushing water {{ymgmhtkRLyY#6}}. Timed traps such as a periodic swinging axe do little alone in a turn-based game, because without random move speed the player knows they will clear it, but combined with other pressure like a monster fight they force real tactical choices. Slow traps, such as rooms filling with water, closing walls and rolling boulders, use time the same way {{ymgmhtkRLyY#8}}.

### Treat traps like monsters

Victory traces a tabletop lineage, from Dragon Magazine in the 1980s through D&D encounter traps in the 2000s to the Treacherous Traps series and the magazine Knock, that improved traps by treating them like monsters: more than one action, effects that worsen over time, and several ways to overcome them {{NjIduRLJL7U#1}}. With Dormans she turns this into a pattern language, judged against six desired player behaviours (deliberation, collaboration, investigation, avoiding, exploiting and enduring), because behaviour is observable where fun is not {{NjIduRLJL7U#3}}. The patterns fall into three groups:

- **Time:** foreshadowing (clues earlier in the delve), a ramp-up window before activation, staged effects that ratchet up, and a sequence of several actions to disable rather than one {{NjIduRLJL7U#4}}.
- **Space:** separate trigger and effect, networked traps that set each other off (a boulder rolling over another pressure plate), remote solutions found elsewhere in the dungeon, and forced division, which needs simultaneous action in two places in party or multiplayer games {{NjIduRLJL7U#5}}.
- **Consequences:** lingering effects such as curses, disease or degraded gear, delayed payoff in a later area, encounter triggers that start a fight or an NPC interaction, and salvage value in the trap's parts {{NjIduRLJL7U#6}}.

Their worked example starts from "take the idol, the statue sprays acid, save or take damage". Add foreshadowing (remains with acid-corroded armour earlier), a three-turn ramp-up as the serpent statue grinds open, giving time to reposition, use an escape item or destroy it, and an encounter trigger: the acid burns through a sarcophagus and releases a mummy into the next chamber {{NjIduRLJL7U#7}}.

### Combinations are the challenge

Dormans's closing lesson, which he admits he keeps forgetting, is not to over-design individual hazards. Make the combinations challenging, as combat encounters gain dynamism from mixing soldiers, bruisers, leaders and summoners {{NjIduRLJL7U#18}}. It is the same conclusion Lockwood reached about timed traps, and the same one the previous section reached about enemies.

**In practice.** Never ship a trap that is only hidden, instant, single-tile damage {{ymgmhtkRLyY#1}}. Separate trigger from hazard and decide which to show {{ymgmhtkRLyY#3}}. Give effects beyond hit points {{ymgmhtkRLyY#6}}. Extend the trap in time, space or consequences so the player has something to decide {{NjIduRLJL7U#4}} {{NjIduRLJL7U#5}} {{NjIduRLJL7U#6}}. And place hazards where they combine with monsters and other hazards {{NjIduRLJL7U#18}}.

## Winning without fighting: escape, stealth and non-violent tactics

### The rogue's way

Everything so far assumes the player fights. Several talks argue that some of the best tactics avoid fighting altogether. Darren Grey reads the genre's name literally. Heroes have big swords, rogues small daggers; heroes are brave, rogues cautious if not actively running away; heroes duel honourably, rogues sneak up and backstab and win by craftiness rather than strength {{C2sm-z7Ag4U#6}}. So a game must give the player real escape options: you rarely need to kill a monster to progress when you can head for the stairs, and monsters that are literally unkillable teach that attacking repeatedly just gets you killed {{C2sm-z7Ag4U#9}}. His 7DRL Toby the Trapper puts it all together: the gnome cannot attack the ogres, dies in one hit, moves at double their speed and can harm them only with traps that chain together, so the player always feels surrounded, yet clever movement and trap placement offer ways through {{C2sm-z7Ag4U#14}}.

### Why combat is the default, and what replaces it

Ludipe explains why combat is so easy to reach for: there are many reference games, its symbols (a warrior and a goblin, each with five hearts) are read instantly, and an active opposing force creates excitement. Pacifist design has to supply those things another way {{pYtlU9wGopo#2}}. Opposition need not be an active enemy. Desktop Dungeons uses big static enemies, and in The Waking Knot a roaming fireball is a force of nature to navigate and manipulate, not an enemy to defeat {{pYtlU9wGopo#5}}.

Movement alone can carry tactics. Nick Bush's Word Processor has no combat at all, only navigation, yet it has "warp strafing": lure a mouse-bound enemy to the edge of a line, then wrap to the other side. "Orphan awareness" means watching the next line, because a wrap can drop you mid-column beside an enemy {{R8DSq8qSJ44@1660#4}}. Dan Norder suggests that Chase-style pursuers could suit roguelikes better if they dealt heavy damage or status effects instead of instant death, with Chase's electrified fences becoming traps, fields or lava {{ohH6LBM2EiU#10}}.

### Stealth as information management

Stealth turns tactics into managing what enemies know. Eric Billingsley found Brogue's stealth range, which depends on tile light and your last action, hard to judge without an overlay. In Into Ruins enemies spot you only when you are lit, so they see the way you do; stealth items let you see further into darkness rather than making you harder to spot, and you can stay in shadow, knock over torches with thrown items and sneak past {{3S6uRMCdvNs#13}}. Alexandra Leonhart's cyberpunk prototype gives every entity its own fog of war, so play becomes acting on what you think enemies can perceive: minimising your signal and hacking cameras to control how institutions read you {{R8DSq8qSJ44@28748#10}}.

### Keeping the mechanics, changing the meaning

Tabea Iseli's non-violent crawler Grimoire Groves, in which you heal plants rather than fight them, shows how much of combat's tactics can survive. Crowd control is fun and important for managing enemies, so the team reduced each effect to its mechanics: burning is just damage over time, so once damage became energizing it became energizing over time, and freezing became a plant napping in a sleep bubble {{ZJAgY73c8bA#9}}. Projectiles were harder. Even a pink cotton ball thrown at a plant felt like an attack, so they moved to indirect spells cast on the ground, inspired by MMO healing circles that people choose to stand in, which Iseli likens to consent; their working projectile became a cloud that rains on a plant {{ZJAgY73c8bA#8}}.

> No matter what we were throwing at the plants, it could be a pink fluffy cotton ball, but it was still feeling violent. {{ZJAgY73c8bA#8}}

**In practice.** If fighting is optional or absent, make movement, information and evasion carry the decisions {{R8DSq8qSJ44@1660#4}} {{pYtlU9wGopo#5}}. Give real escape routes and at least some threats that cannot be fought {{C2sm-z7Ag4U#9}}. Tie detection to something the player can see, like light {{3S6uRMCdvNs#13}}. When you reskin combat, strip each effect down to what it does mechanically and keep that {{ZJAgY73c8bA#9}}.

## Sharing the turn: tactics with more than one player

### The goals that conflict

Turns get harder when more than one person is taking them. Tyriq Plummer sets three goals for multiplayer turn design: no timers pressuring decisions, no player waiting ages on others (which means limiting the decision space so choices are quick and easy to input), and multiplayer that actually matters, with collaboration and risk-taking for others rather than parallel solo play {{neuJCYmbAG8#5}}. Adrian Zeyfang's goal for Crypt of the NecroDancer's online mode, Synchrony, is that every player feels they are playing single-player locally: local actions are never delayed, so players can keep the beat, and distant players never affect nearby interactions {{zwhNSbFVKQM#2}}. None of the designs below keeps all of these at once.

### Simultaneous queued turns

Plummer's HVNTRS has each player queue an action; the turn resolves once everyone has chosen. Coordination is easy, everyone stays engaged, and several brains on one problem narrow the options. But order still matters (two players entering the same tile, a move before or after a shield bash), so you need clear priority rules, and waiting for every input is irritating in low-stakes moments such as backtracking {{neuJCYmbAG8#6}}.

### Parallel asynchronous schedules

His next prototype, Clean Sweep, tried to remove the waiting with a "parallel asynchronous schedule": each creature advances its turn only when its most relevant player acts, so once an enemy spots a player it syncs to that player's actions. Players act independently, which allows more complexity, and it works well when they are far apart or separated by walls {{neuJCYmbAG8#10}}. While one enemy targets player one, player two moves freely; it was fun with two players {{UNBAoc0TJSs#0}}. Plummer expects that forcing a monster to switch attention between players will be exploitable, so a game using this schedule should be designed around those exploits as tactics, not retrofitted onto an existing roguelike {{neuJCYmbAG8#12}}.

In Scrubbin' Trubble, the game that grew from Clean Sweep, fully independent turns failed at three or four players: too fast, chaotic and unpredictable to cooperate. Players had to talk constantly and telegraph every action, and they stepped on each other's moves, causing desyncs {{UNBAoc0TJSs#7}}. Plummer's pivot promoted a contingency queueing mechanic to the core: actions resolve only when every player in the same dynamically defined combat zone has committed, while players outside combat move freely, so the game slows down when it makes sense. It sacrificed the goal of never waiting on others {{UNBAoc0TJSs#8}}. Zones brought a bonus, definite starts and ends to fights, which allow end-of-fight quips and no-damage score bonuses, and new problems: edge cases about which nearby players share a zone, and slow deciders holding up everyone in the fight {{UNBAoc0TJSs#9}}.

### Time that does not pass

Synchrony takes a different route. When a player does not act on a given turn ID, time simply does not pass for them: nearby monsters do not move, and countdowns and status effects do not tick. A single-tempo Cadence far from a double-tempo Bolt ideally never notices Bolt is in the game {{zwhNSbFVKQM#5}}. Its rollback netcode, which predicts and then corrects remote actions, forced rule changes. Player-to-player collision was removed because a contested tile looked like a player being shoved off a square they had already reached; disabling collision was the simplest fix and helped in narrow procedural corridors too {{zwhNSbFVKQM#9}}. And when two players hit a one-hit slime, the slower player's attack could retroactively become a move onto the now-empty tile, appearing to teleport them, so a slain monster drops an invisible "tombstone" blocker for the rest of the turn; the late attack hits the tombstone and looks like a swing at thin air {{zwhNSbFVKQM#10}}.

At the far end, Leif Bloomquist's Dungeon of the Rogue Daemon is effectively real-time: turns are 50 ms long, and idle players are booted after five minutes {{bpSnPNr6ETc#7}}.

### Smaller warnings

- **Friendly fire.** HVNTRS's multi-tile axe and spear can hit allies, meant to encourage talk about positioning; Plummer concedes it may simply be unpleasant in a game that is already tough {{neuJCYmbAG8#8}}.
- **Cooperative puzzles.** Bloomquist plans puzzles that need several players in the right places at the right time, still in development {{bpSnPNr6ETc#4}}.
- **Net fun.** Gavin Verhey notes that a PvE game can let the player crush the computer, strip all its action points, and nobody minds; in PvP every effect must be weighed for fun gained against fun taken from the opponent {{lGm8cZC8Lfk#7}}. Magic largely removed aggressively priced land destruction because the victim feels knocked out of the game while the attacker barely registers playing one card {{lGm8cZC8Lfk#8}}.

**In practice.** Decide which goal you will sacrifice, because none of these designs kept all of them: queued simultaneous turns give up some freedom from waiting {{neuJCYmbAG8#6}}, independent schedules give up coordination at larger player counts {{UNBAoc0TJSs#7}}, combat zones bring waiting back inside fights {{UNBAoc0TJSs#8}}, and Synchrony's rollback netcode demands that players not interfere directly in the same turn {{zwhNSbFVKQM#9}} {{zwhNSbFVKQM#10}}. Once players share a world, design any effect that touches another player for net fun {{lGm8cZC8Lfk#7}}.

## Tensions and open questions

**How much should a turn cost?** Nicholas Feinberg traces degenerate play to actions that are free or nearly free, especially out of combat {{b8uoQHedFV0#7}} {{b8uoQHedFV0#10}}. Dylan White found the opposite failure in Rift Wizard: a turn cost so much that players left spells unused because they were not worth one {{kvgKKRLil_8#9}}. Pandamander adds that cheap, automatic turns have value of their own, as relaxing troughs between hard decisions {{KtQh4QrsUzs#4}}. The talks do not give a single right price. What it depends on is which actions you want players to repeat, which you want them to weigh, and whether the low-cost stretches are rest or tedium.

**Show the threat, or hide it?** Chase, Into the Breach, Shiren 6's behemoths and Scrubbin' Trubble's threat zones all put the threat in plain view {{ohH6LBM2EiU#1}} {{rNi5nO5yqLs#0}} {{0MdNwIHwXy0#16}} {{UNBAoc0TJSs#2}}. Albert Ford treats an unseen enemy that can target you as a fairness failure {{y1zkrTcNJbc#1}}. Yet Nic Tringali values secretly committed information for the push-your-luck tension it creates {{R8DSq8qSJ44@17074#8}}, and Jeff Lait's 1812 makes stale information its subject {{LQPGmxytTws#15}}. The difference seems to be whether the hidden information is the game's subject, with the player knowing what they do not know, or an accident of the interface, as Johnathan Pagnutti's Jaw Worm graph suggests can happen even in a well-loved game {{Uf34SbuWIos#2}}.

**Bump or explicit attack?** Michael Brough's case for bump-to-attack rests on its elegance and on what a shared input enables, such as moving a party with one key {{X4be22WoVgg#0}} {{X4be22WoVgg#3}}. Leif Bloomquist chose an explicit attack command because bumping would not accommodate the ranged weapons he planned {{Y0K-e83wYnQ#3}}, while Brough folds ranged fire into the direction key at the cost of physical sense {{X4be22WoVgg#2}}. The choice depends on which verbs you will need later and how much you are willing to bend fiction to keep one input.

**Which multiplayer goal to give up.** Tyriq Plummer's goals (no timers, no long waits, multiplayer that matters) and Adrian Zeyfang's (every player feels local) cannot all be kept by any scheme in the talks {{neuJCYmbAG8#5}} {{zwhNSbFVKQM#2}}. Queued simultaneous turns make players wait {{neuJCYmbAG8#6}}; independent schedules broke down at three or four players {{UNBAoc0TJSs#7}}; combat zones bring waiting back inside fights {{UNBAoc0TJSs#8}}; Synchrony's rollback netcode required removing player collision and adding invisible tombstones {{zwhNSbFVKQM#9}} {{zwhNSbFVKQM#10}}. Which sacrifice is acceptable depends on player count and on how closely players are meant to cooperate. Bloomquist's cooperative puzzles, which need several players in the right places at the right time, are still in development {{bpSnPNr6ETc#4}}, and whether the attention-switching exploits Plummer expects can be turned into good tactics is untested {{neuJCYmbAG8#12}}.

**Turn-based or real time.** Moria's players rejected real time {{ZMdxP7fO6wE#11}}, Nauticrawl's drift into it overwhelmed testers {{wxmio1S3iN0#5}}, and Santiago Zapata's turn-based Mega Man failed the other way {{TMxzVy7-VYQ#8}}, yet Feinberg argues NecroDancer's time pressure transforms rote patterns into satisfying play {{b8uoQHedFV0#6}}. The talks do not settle which side is right, but the two failures that are explained, Nauticrawl's and the Mega Man roguelike's, share a cause: the player could no longer read cause and effect.

## Checklist

1. Does every turn offer a real choice, with no option that is a no-op?
2. Do movement and attack share an input, and will that still work when you add ranged or area attacks?
3. Which actions in your game cost nothing, and can players precast, retry or micromanage with them?
4. Do you have an out-of-combat state, and what stops it being free?
5. Are any spells or abilities going unused because they are not worth a turn?
6. For each clock in the game (hunger, wanderers, alarms, beats), what is it for, and what counterplay does it allow?
7. If your game runs in real time or is a hybrid, can a player who dies say what killed them?
8. Can the player predict what each enemy will do next, or see its threat zone or intent?
9. Is your field of view symmetric and consistent with targeting?
10. Can a player count the damage math, and what levers do they have over the dice?
11. Does each monster have one clear trick that targets something besides hit points?
12. Does each weapon change which shapes on the map are safe?
13. Does any trap in the game amount to hidden, instant, single-tile damage?
14. Can a player escape or avoid a fight they cannot win?
15. In multiplayer, which turn goal have you chosen to give up?

## See also

- [03. Death, difficulty and progression](03-death-difficulty-and-progression.md): randomness, fairness and the cost of losing that shape how fights feel.
- [05. Systems and emergence](05-systems-and-emergence.md): interacting rules and hazards that combine into tactical problems.
- [07. Characters, items and builds](07-characters-items-and-builds.md): how build choices feed tactical positioning and weapon roles.
- [08. Monsters, NPCs and AI](08-monsters-npcs-and-ai.md): enemy behaviour, intents and predictability in depth.
- [09. Level generation](09-level-generation.md): the terrain and trap placement that fights happen on.
- [13. Interface and accessibility](13-interface-and-accessibility.md): showing threats, field of view and input design.
