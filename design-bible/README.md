# Roguelike Design Bible

The Roguelike Design Bible is a working handbook for designing and building roguelikes, distilled from the talks given at Roguelike Celebration between 2016 and 2026. It tells you what practitioners recommend, what they warn against, and where they disagree, and every statement links to the moment in a talk where someone said it. It is written for people making roguelikes and roguelike-influenced games who have played the genre but have not watched the talks.

## Contents

Word counts are prose words in each chapter, as counted by `build_bible.py check`.

| Chapter | What it covers | Words |
|---|---|---:|
| [00. Core principles](00-core-principles.md) | The short version: forty principles, the main disagreements, a design brief for a new game and reading paths through the book. | 8,602 |
| [01. What is a roguelike?](01-what-is-a-roguelike.md) | What definitions of the genre are for, the core package of permadeath, generation and turns, and the roguelike as a layer on other genres. | 6,098 |
| [02. History and lineage: where the conventions came from](02-history-and-lineage.md) | Where the genre's conventions came from, which of them began as technical constraints, and how old games are kept playable. | 8,781 |
| [03. Death, difficulty and progression](03-death-difficulty-and-progression.md) | Why permadeath exists, what makes a death fair, how much should carry between runs, and how randomness, clocks, pacing and difficulty settings shape a run. | 22,363 |
| [04. Learning and discovery](04-learning-and-discovery.md) | How players come to understand a roguelike across runs, how to teach without spoiling discovery, and what to deliberately leave hidden. | 16,352 |
| [05. Systems and emergence](05-systems-and-emergence.md) | Building rules that combine: which systems to simulate, how many pieces to have, architectures that let everything interact, and what to do with exploits. | 19,817 |
| [06. Combat and tactics](06-combat-and-tactics.md) | The turn as a decision: verbs, the cost of actions, real time versus turns, readable threats, space, traps, non-violent tactics and shared turns. | 8,709 |
| [07. Characters, items and builds](07-characters-items-and-builds.md) | Where character power lives, how upgrades are offered and connected into a build space, how much brokenness to allow, and how items and inventory earn their place. | 13,576 |
| [08. Monsters, NPCs and AI](08-monsters-npcs-and-ai.md) | Creature behaviour players can read and exploit, choosing a decision architecture, and NPC minds, agendas, relationships and conversation. | 7,414 |
| [09. Level generation](09-level-generation.md) | What a generated level is for, how layouts are built, planned, validated and furnished, and how levels join into a run. | 14,043 |
| [10. Content generation](10-content-generation.md) | Generating what players find in a level, from items and names to text, histories, quests, events and puzzles, and the meanings players read into it. | 19,105 |
| [11. Generative methods](11-generative-methods.md) | The machinery under every generator, from seeds and noise to wave function collapse, solvers, grammars and language models, and how to check and steer it. | 23,002 |
| [12. Narrative and worldbuilding](12-narrative-and-worldbuilding.md) | How stories work inside a loop of death and restarts: emergent stories, authored story for replay, tone, setting, generated characters and plots. | 22,905 |
| [13. Interface and accessibility](13-interface-and-accessibility.md) | Commands, automation, previews, messages, legibility of large simulations, letters versus tiles, and accessibility for players unlike the designer. | 12,943 |
| [14. Art and audio](14-art-and-audio.md) | Presentation as a budget and a language: characters and tiles, art on a small budget, juice, sound, and music written for repetition. | 13,122 |
| [15. Architecture and tools](15-architecture-and-tools.md) | Structuring code for content breadth, separating simulation from presentation, determinism, modding, and the tools that let a small team iterate. | 18,687 |
| [16. Production and process](16-production-and-process.md) | How roguelikes get made: first projects, prototyping, cutting, estimating, playtesting, working with an audience and sustaining a long project. | 17,083 |
| [17. Community and business](17-community-and-business.md) | Sharing runs, online play, modding and open development, reading feedback, and finding an audience, funding and selling a roguelike. | 14,054 |
| [18. Beyond roguelikes](18-beyond-roguelikes.md) | Roguelike structure found in other forms, grafted onto other genres and carried off the screen onto paper, rooms and other media. | 11,689 |

Also in this directory: [sources.md](sources.md), every talk with its link and the chapters that cite it.

## How to read the citations

Each parenthetical link names the speaker and the year of the talk, for example (Brian Walker 2016, 12:34), and opens the talk on YouTube at the moment the point is made. A run of several links after one statement means several talks support it; where independent speakers converge, the text says so. Pull quotes in blockquotes are verbatim from the talk's transcript.

## How it was made, and how far to trust it

- **Source.** Every video on the Roguelike Celebration YouTube channel as of 12 November 2026. Transcripts exist for 319 of 323 videos (three stream recordings have no captions; one video is private). Captions are human-made for 144 talks, YouTube auto-generated for the rest, and local speech-to-text (Whisper) for six talks whose YouTube captions were unusable.
- **Notes.** Readers extracted 4,014 insights from 311 talks (298 separately published talks plus 13 talks from the 2026 Sunday stream that had not been published separately). Full-day stream recordings were otherwise left out because they repeat the individual talks. Every insight carries a verbatim quote that is machine-checked against the transcript.
- **Chapters.** 18 thematic chapters, about 270,000 words, about 6,800 citations. Each chapter was outlined, written in parts, assembled, then audited by an independent reader.
- **Audit.** 6,791 citations were checked against the insights they cite and 272 statements (about 4%) were corrected. 393 insights were re-read against the transcripts in context: 372 were judged faithful, 21 partly faithful, none unfaithful; the flagged insights were then corrected. So a small share of statements will still say slightly more or less than the speaker did; follow the link when it matters.
- **Limits.** Auto-generated captions mishear names and terms. The whole pipeline (transcript reading, synthesis, audit) was done by AI models (Claude) directed by a human, and no human has checked the chapters line by line against the videos. The bible reports what speakers said, which is not the same as what is true of every game. And it reflects who spoke at one conference.

## Layout

- `NN-*.md`: the rendered chapters, with citations turned into links. These are generated; do not edit them.
- `src/`: the chapter sources, which cite insights as `{{key}}` tokens (`<note-id>#<n>`).
- `outlines/`: each chapter's outline (thesis, sections and the insights assigned to each).
- `packs/`: the insight packs the chapters were written from, including `packs/cited/`, every insight a chapter cites, for auditing. Generated and not kept in git; rebuild with `python3 build_bible.py packs` and `python3 build_bible.py cited NN`.
- `sources.md`: every talk, with links and where it is cited.
- `SPEC.md`: the editorial spec (citing, voice, chapter shape).
- `build_bible.py`: the build tool (Python 3 standard library only).

The evidence lives in `../data/roguelike-celebration/`: `transcripts/` (one transcript per video), `notes/` (one file of insights per talk), `NOTES_SPEC.md` (how notes are written) and `verify_notes.py` (checks notes and their quotes against the transcripts).

## Rebuilding and extending

Run these from this directory:

- `python3 build_bible.py packs`: rebuild `packs/NN-<topic>.md` and `packs/talks.md` from the notes.
- `python3 build_bible.py render [NN ...]`: render `src/NN-*.md` to `NN-*.md`, turning keys into links; fails on any key that does not exist.
- `python3 build_bible.py check [NN ...]`: report word and citation counts, coverage and problems (such as uncited prose) without writing anything; add `--json` for machine-readable output.
- `python3 build_bible.py sources`: write `sources.md`.
- `python3 build_bible.py all`: packs, then render, then sources, stopping on errors.

To add a new talk:

1. Add its row to `../data/roguelike-celebration/manifest.tsv` and fetch its transcript with `python3 fetch_transcripts.py --ids <id>` (in that directory).
2. Write `notes/<id>.json` following `NOTES_SPEC.md`, then check it with `python3 verify_notes.py <id>`.
3. Run `python3 build_bible.py packs`, and cite the new insights by key (`{{<id>#<n>}}`) in the relevant chapter source in `src/`.
4. Run `python3 build_bible.py check NN`, then `render NN` and `sources` (or `all`).

## Credit

The ideas in this bible belong to the speakers. Roguelike Celebration ([roguelike.club](https://roguelike.club)) hosts the talks. Quotations are short excerpts used for commentary, and every link goes to the original video.
