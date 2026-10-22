# Bundled fonts

The cards are English with romanised Japanese and Japanese in kanji and kana,
so the Latin faces have to carry the macrons of Hepburn romanisation (Sōryū,
Kidō Butai, Chōkai: ā ē ī ō ū) and the app needs a Japanese face for the
`ja` lines. The Latin families below ship with the app as latin + latin-ext
subsets, declared in `style.css` with the same `unicode-range` split Google
Fonts uses. They are holo-i-ke-au's (b480c27), copied unmodified.

| File | Family | Copyright |
| --- | --- | --- |
| `src/fonts/fraunces-latin-600-normal.woff2`, `-latin-ext-600-normal` | Fraunces SemiBold | © 2020 The Fraunces Project Authors |
| `src/fonts/fraunces-latin-400-italic.woff2`, `-latin-ext-400-italic` | Fraunces Italic | © 2020 The Fraunces Project Authors |
| `src/fonts/inter-latin-400-normal.woff2`, `-latin-ext-400-normal` | Inter Regular | © 2016 The Inter Project Authors |
| `src/fonts/inter-latin-600-normal.woff2`, `-latin-ext-600-normal` | Inter SemiBold | © 2016 The Inter Project Authors |

All are licensed under the SIL Open Font License 1.1
(<https://openfontlicense.org>). Taken unmodified from the `@fontsource/fraunces`
and `@fontsource/inter` 5.3.0 packages.

## Japanese: a Noto Sans JP subset

| File | Family | Copyright |
| --- | --- | --- |
| `src/fonts/noto-sans-jp-subset.woff2` | Noto Sans JP Regular (version 2.004), subset | (c) 2014-2021 Adobe (http://www.adobe.com/), with Reserved Font Name 'Source' |

Licensed under the SIL Open Font License 1.1 (<https://openfontlicense.org>);
a subset is a Modified Version under the OFL, and it keeps the family name
Noto Sans JP, which carries no Reserved Font Name ('Source' is Adobe's, for
the Source Han Sans family it is built from, and is not used here).

Japanese text (`lang="ja"`: the boot screen's lines, place and ship names,
the battles' names and readings, the after-card's headings) is set through
`:lang(ja)` in `style.css` with the `--jp` stack: the subset first, declared
with a CJK `unicode-range` (U+3000-30FF, U+3400-4DBF, U+4E00-9FFF,
U+F900-FAFF, U+FF00-FFEF) so Latin text never falls into it, then the
system's Japanese face (Hiragino, Yu Gothic, Meiryo, Noto Sans CJK) for any
character the subset lacks. One static weight, 400: titles are set larger in
the regular weight; a second weight or the variable axis would double the
cost.

`tools/subset-font.mjs` cuts it to exactly the CJK characters the app shows:
it scans the data directory's JSON (`public/data/` by default; a directory
given on the command line instead) and the app's own strings (`index.html`,
`NOTICE.md` and every `.js` under `src/`: the boot lines, the after-card's
あなたの出撃 / あなたの戦い / 記録 / その後, the help's 太平洋戦争), fetches the
Google Fonts TTF of Noto Sans JP 400 through `tools/lib/fetch.mjs` (curl,
with the ledger) into the downloads directory (`--downloads`, or
`$PACIFIC_THEATRE_DOWNLOADS`, or the system's temporary directory), never into
the repository, and writes the woff2 with `subset-font` 2.4.0.

**The subset committed now was cut from Stage 0's fixtures (`node
tools/subset-font.mjs test-data`): 78 characters, 14.4 KB (about 190 bytes a
character).** It covers the app's own strings and the fixtures' names, not
the real record's. At integration, once the content and the battles have
landed, run `node tools/subset-font.mjs` on `public/data/`, commit the new
woff2 and put its count here; R9 measured about 225 bytes a character, so
about 120 KB for the 526 characters it estimated.
