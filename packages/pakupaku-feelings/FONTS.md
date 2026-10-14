# Bundled fonts

| Face | Where it comes from | Used for |
| --- | --- | --- |
| Patrick Hand | `@fontsource/patrick-hand` (npm) | English on the paper, chips and headings |
| Nunito 400/700/800 | `@fontsource/nunito` (npm) | English body text |
| Klee One SemiBold, subset | `src/fonts/klee-one-600.woff2`, cut by `tools/build-fonts.py` | Japanese on the paper, chips and headings |

All three are licensed under the SIL Open Font License 1.1
(<https://openfontlicense.org>). Klee One is © 2020 The Klee Project Authors
(<https://github.com/fontworks-fonts/Klee>); its copyright and licence notices
are kept in the subset's `name` table.

Patrick Hand has no Japanese, so Japanese characters fall through to Klee One
in the same font stack. Klee One is several megabytes whole; the subset keeps
only the characters in `src/ja.js` and `src/i18n.js` plus Japanese
punctuation, and its `@font-face` has a CJK `unicode-range`, so a reader in
English never downloads it. Japanese body text uses the system's Japanese
face.

**Re-run the subset whenever the Japanese text gains a character**, or that
character will render in a fallback face:

```bash
pip install fonttools brotli
npm pack @expo-google-fonts/klee-one && tar xzf expo-google-fonts-klee-one-*.tgz
python3 tools/build-fonts.py package/600SemiBold/KleeOne_600SemiBold.ttf
```
