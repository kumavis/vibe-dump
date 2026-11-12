# Roguelike Design Bible — editorial spec

The bible distils eleven years of Roguelike Celebration talks (2016–2026) into a working
reference for people designing and building roguelikes. It is a design handbook, not a
literature review: it tells the reader what to do, what to avoid, what the trade-offs
are, and where practitioners disagree — and every one of those statements links to the
moment in a talk where someone said it.

## Sources and the chain of evidence

```
talk video → transcript (data/roguelike-celebration/transcripts/<id>.json)
           → notes      (data/roguelike-celebration/notes/<note-id>.json)
           → chapter    (design-bible/src/NN-name.md  → rendered to design-bible/NN-name.md)
```

- A **note** file holds one talk's *insights*. Each insight has a claim, a detail
  paragraph, a verbatim quote and a timestamp, all machine-checked against the transcript
  (`data/roguelike-celebration/NOTES_SPEC.md`, `verify_notes.py`).
- An **insight key** is `<note-id>#<n>`: the note id and the 0-based position of the
  insight in that file's `insights` array, e.g. `lfb6uehmrWo#4`. Note ids are YouTube
  video ids, or `<video-id>@<start-seconds>` for a talk that only exists inside a
  full-day stream recording.
- Chapters are written against **packs** (`design-bible/packs/NN-topic.md`), which list
  every insight for a topic with its key.

## Citing

In chapter source files, cite by writing insight keys in double braces, directly after
the statement they support:

```markdown
Brogue balances powerful items by making them situational rather than weaker {{lfb6uehmrWo#4}}.
Several designers treat the hunger clock as a pacing tool, not a survival sim {{b8uoQHedFV0#7}} {{IaB7iQhts_c#2}}.
```

`build_bible.py render` turns each run of keys into one parenthetical of links that open
the video at that moment — `([Brian Walker 2016, 12:34](https://youtu.be/lfb6uehmrWo?t=754))` —
and fails on any key that does not exist. Never write a YouTube link, a timestamp or a
speaker-year reference by hand; always use a key.

Rules:

1. **Every claim that comes from a talk carries a key.** A paragraph of synthesis may end
   with several keys; a sentence that attributes a view to a named person or game must be
   followed by the key for that insight. Connective text and the chapter's own framing
   need no citation, but must not smuggle in facts.
2. **Say only what the insight supports.** Work from the insight's claim, detail and
   quote. Do not strengthen ("always", "the best"), generalise from one game to all
   games, or add facts from your own knowledge of the game or speaker. When one person
   said it, write that one person said it; when several independent talks converge, say
   so and cite them all — convergence is the most valuable thing the bible can show.
3. **Attribute.** Name the speaker and the game in the prose when presenting a specific
   position, technique or case ("Brian Walker describes how Brogue…"). The reader should
   not need to click to know whose idea it is.
4. **Show disagreement.** Where talks pull in different directions, set the positions
   side by side, each with its key, and say what the choice depends on. Do not average
   them into mush or pick a winner the sources don't pick.
5. **Quotes are optional and rare.** At most about one pull quote per section, as a
   blockquote ending with its key:

   ```markdown
   > If you're tweaking, you're not getting anything done. {{KKwgKTbiEY0#3}}
   ```

   The quoted words must come from that insight's `quote` field; you may fix
   capitalisation and punctuation and trim from either end, nothing else. Auto-caption
   quotes with garbled words are not quotable — paraphrase instead.
6. You may cite an insight from another topic's pack when it belongs in your chapter.

## Chapter shape

Each chapter is one file, `design-bible/src/NN-name.md`:

```markdown
# NN. Chapter title

One or two paragraphs: what this chapter covers, why it matters to someone making a
roguelike, and how the talks approach it.

## In brief

- Five to ten takeaways, one sentence each, each with its key(s). These are the
  chapter's strongest, best-supported points — the ones a reader who reads nothing else
  should leave with.

## <Theme section>

Prose that builds an argument: the problem, the principle, how specific games solve it,
what goes wrong. Use `###` subsections for distinct ideas. Use short bulleted lists for
enumerable things (a set of techniques, a checklist), not for arguments.

**In practice** paragraphs or lists give concrete, usable technique where the talks do.

…more theme sections…

## Tensions and open questions

Where the talks disagree or leave problems unsolved.

## Checklist

Eight to fifteen questions a designer should ask of their own game, each traceable to the
chapter (keys optional here).

## See also

Links to related chapters, as relative links to their rendered files.
```

- Organise by **theme**, never talk by talk and never year by year. A section that
  marches through sources one paragraph each is a failure; group what belongs together.
- Lead each section with the idea, not with the source.
- Length follows material: roughly 3,000–9,000 words. Cover the weight-3 insights of the
  chapter's topic almost completely and most weight-2 ones; weight-1 insights are there
  for colour and examples. `build_bible.py check` reports coverage. If you leave a
  weight-3 insight out, it should be because it genuinely belongs in another chapter or
  duplicates a stronger one.
- Technical chapters should be specific enough to implement from: name the algorithm,
  the data structure, the parameters the speaker gave.

## How a chapter is made

1. **Outline.** An architect reads the chapter's pack and writes
   `design-bible/outlines/NN.json`: the chapter's thesis, its theme sections in reading
   order (each with a brief and the insight keys it will draw on), the split of sections
   into *parts* of at most ~130 insights, and the insights deliberately left out, with
   reasons. `build_bible.py partpack NN` validates it and writes one pack per part to
   `design-bible/packs/parts/NN-partK.md`.

   ```json
   {
     "chapter": 3,
     "title": "Death, difficulty and progression",
     "thesis": "2–3 sentences: the chapter's through-line.",
     "sections": [
       {"part": 1, "heading": "Why permadeath",
        "brief": "What this section argues, the order of ideas, which disagreements to stage.",
        "keys": ["lfb6uehmrWo#4", "b8uoQHedFV0#7"]}
     ],
     "omitted": [{"key": "IaB7iQhts_c#9", "reason": "duplicates IaB7iQhts_c#2"}]
   }
   ```

2. **Parts.** A writer per part writes the theme sections assigned to it, and only those,
   to `design-bible/src/parts/NN-partK.md` — `## ` headings exactly as in the outline,
   no chapter title, no "In brief". `build_bible.py check --part NN K` reports coverage.
3. **Assembly.** An editor joins the parts into `design-bible/src/NN-name.md`, writes the
   opening, "In brief", "Tensions and open questions", "Checklist" and "See also", and
   removes repetition between parts.
4. **Audit.** An independent auditor checks every cited statement against the insight it
   cites (`build_bible.py cited NN`), and a sample against the transcripts themselves,
   and corrects what does not hold.

## Voice

Plain, direct, confident where the sources are, candid where they are not. Second person
("you") for advice. Write for a working designer who has played roguelikes but has not
seen these talks. Define a term the first time it appears (Berlin Interpretation,
wave function collapse, 7DRL). No hype, no filler, no "in this chapter we will".
Spell names correctly: the notes already correct caption errors; if two notes spell a
name differently, use the spelling from the talk title.

## Chapters

| # | file | topic id (pack) |
|---|---|---|
| 00 | `00-core-principles.md` | written last, from every chapter's "In brief" |
| 01 | `01-what-is-a-roguelike.md` | `genre-and-definitions` |
| 02 | `02-history-and-lineage.md` | `history-and-preservation` |
| 03 | `03-death-difficulty-and-progression.md` | `difficulty-and-progression` |
| 04 | `04-learning-and-discovery.md` | `learning-and-discovery` |
| 05 | `05-systems-and-emergence.md` | `systems-and-emergence` |
| 06 | `06-combat-and-tactics.md` | `combat-and-tactics` |
| 07 | `07-characters-items-and-builds.md` | `character-and-builds` |
| 08 | `08-monsters-npcs-and-ai.md` | `ai-and-npcs` |
| 09 | `09-level-generation.md` | `level-generation` |
| 10 | `10-content-generation.md` | `content-generation` |
| 11 | `11-generative-methods.md` | `generation-methods` |
| 12 | `12-narrative-and-worldbuilding.md` | `narrative-and-worldbuilding` |
| 13 | `13-interface-and-accessibility.md` | `interface-and-accessibility` |
| 14 | `14-art-and-audio.md` | `art-and-audio` |
| 15 | `15-architecture-and-tools.md` | `architecture-and-tools` |
| 16 | `16-production-and-process.md` | `production-and-process` |
| 17 | `17-community-and-business.md` | `community-and-business` |
| 18 | `18-beyond-roguelikes.md` | `beyond-roguelikes` |

Rendered chapters, `README.md` (contents and how to read the citations) and `sources.md`
(every talk, with links and where it is cited) sit at the top of `design-bible/`.
