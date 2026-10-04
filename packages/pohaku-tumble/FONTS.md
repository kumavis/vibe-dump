# Bundled fonts

Every letter in this app is drawn by the app itself: pecked into the stone
textures, set on the floor canvas, typed into the cards. A canvas won't wait
for a fallback font, and Hawaiian needs a face that has the ʻokina (U+02BB)
and every kahakō vowel in both cases, so the font ships with the app instead
of relying on whatever the visitor's system has.

One family, Alegreya, in three cuts, registered in `src/style.css` as
`'PT Alegreya'` (and drawn on the canvases through `font()` in
`src/palette.js`):

| File | Cut | Copyright |
| --- | --- | --- |
| `src/fonts/alegreya-400.woff2` | Alegreya Regular | © 2011 The Alegreya Project Authors |
| `src/fonts/alegreya-400-italic.woff2` | Alegreya Italic | © 2011 The Alegreya Project Authors |
| `src/fonts/alegreya-600.woff2` | Alegreya SemiBold | © 2011 The Alegreya Project Authors |

Alegreya is by Juan Pablo del Peral, Huerta Tipográfica
(<https://github.com/huertatipografica/Alegreya>). It is licensed under the
SIL Open Font License 1.1 (<https://openfontlicense.org>); the copyright and
licence notices are kept in each file's `name` table. The licence declares no
Reserved Font Name, so the subsets may keep Alegreya's name inside the files.

They are subsets. `tools/build-fonts.py` cuts each one to Latin, the ʻokina,
the kahakō vowels, the punctuation the page sets, and every character that
appears anywhere in `src/` or `index.html` — the whole word list and root
glossary, since any word can come up and any root's cognates can reach a card.
It keeps kerning, ligatures, real small capitals and the figure styles.
**Re-run it whenever the data is regenerated**, or a new character will render
in a fallback face; the script names any character Alegreya itself lacks
(it has no ◦, so the cards draw that circle in CSS):

```bash
pip install fonttools brotli
npm pack @expo-google-fonts/alegreya
# unpack the tarball, then
python3 tools/build-fonts.py <unpacked package dir>
```
