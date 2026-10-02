# Bundled fonts

Every glyph in this app is drawn by hand: onto block textures, onto the floor
canvas, into the notes. A canvas won't wait for a fallback font, and the
whole look depends on one Mincho face, so the fonts ship with the app instead
of relying on whatever Japanese font the visitor's system happens to have.

| File | Family | Copyright |
| --- | --- | --- |
| `src/fonts/noto-serif-jp-400.woff2` | Noto Serif JP Regular  | © The Noto Project Authors |
| `src/fonts/noto-serif-jp-600.woff2` | Noto Serif JP SemiBold | © The Noto Project Authors |
| `src/fonts/ibm-plex-mono-400.woff2` | IBM Plex Mono Regular  | © IBM Corp. |
| `src/fonts/ibm-plex-mono-500.woff2` | IBM Plex Mono Medium   | © IBM Corp. |

All four are licensed under the SIL Open Font License 1.1
(<https://openfontlicense.org>). The copyright and license notices are kept
in each file's `name` table.

They are subsets. `tools/build-fonts.py` cuts Noto Serif JP down to every CJK
and kana character that appears anywhere in `src/` or `index.html` (the whole
word list, since any word can come up) plus Latin, and IBM Plex Mono down to
Latin. **Re-run it whenever the word list gains a character**, or that
character will render in a fallback face:

```bash
pip install fonttools brotli
npm pack @expo-google-fonts/noto-serif-jp @expo-google-fonts/ibm-plex-mono
# unpack both tarballs, then
python3 tools/build-fonts.py <noto-serif-jp dir> <ibm-plex-mono dir>
```
