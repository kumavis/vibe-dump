# Bundled fonts

The explainer cards are mostly Hawaiian words, so the fonts have to carry the
ʻokina (U+02BB) and the kahakō vowels (ā ē ī ō ū). Both families below do;
they ship with the app as latin + latin-ext subsets, declared in `style.css`
with the same `unicode-range` split Google Fonts uses.

| File | Family | Copyright |
| --- | --- | --- |
| `src/fonts/fraunces-latin-600-normal.woff2`, `-latin-ext-600-normal` | Fraunces SemiBold | © 2020 The Fraunces Project Authors |
| `src/fonts/fraunces-latin-400-italic.woff2`, `-latin-ext-400-italic` | Fraunces Italic | © 2020 The Fraunces Project Authors |
| `src/fonts/inter-latin-400-normal.woff2`, `-latin-ext-400-normal` | Inter Regular | © 2016 The Inter Project Authors |
| `src/fonts/inter-latin-600-normal.woff2`, `-latin-ext-600-normal` | Inter SemiBold | © 2016 The Inter Project Authors |

All are licensed under the SIL Open Font License 1.1
(<https://openfontlicense.org>). Taken unmodified from the `@fontsource/fraunces`
and `@fontsource/inter` 5.3.0 packages.
