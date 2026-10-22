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

## Japanese: a Noto Sans JP subset, to come

Japanese text (`lang="ja"`: the boot screen's lines, place and ship names,
the after-card's headings) is set through `:lang(ja)` in `style.css` with the
`--jp` stack, which for now falls back to the system's Japanese face
(Hiragino, Yu Gothic, Meiryo, Noto Sans CJK). A subset of **Noto Sans JP**
(the Noto project's, SIL OFL 1.1; its copyright line goes in this table with
the subset) will replace it:
one static weight, 400 (titles are set larger in the regular weight; a second
weight or the variable axis would double the cost), cut to exactly the CJK
characters the app's data uses. `tools/subset-font.mjs` scans
`public/data/**/*.json` for them and writes `src/fonts/noto-sans-jp-subset.woff2`
with `subset-font` 2.4.0 from the Google Fonts TTF, fetched through
`tools/lib/fetch.mjs` into the downloads directory with the ledger, never into
the repository. It runs at integration, once the content and the battles have
landed (it can only count what they use); R9 measured about 225 bytes a
character, about 120 KB for 526 characters. The integrator then adds its
`@font-face` (with a CJK `unicode-range`: U+3000-30FF, U+4E00-9FFF,
U+FF00-FFEF) at the head of `--jp`, and puts the glyph count here.
