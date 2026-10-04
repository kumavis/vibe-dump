#!/usr/bin/env python3
"""Subset Alegreya down to the characters this app can ever draw.

    pip install fonttools brotli
    python3 tools/build-fonts.py <dir-with-Alegreya-ttfs>

The source TTFs are Google Fonts' static instances (the @expo-google-fonts
npm package ships them: `npm pack @expo-google-fonts/alegreya`). Three cuts
are kept, registered in style.css as one family, 'PT Alegreya': regular,
italic and semibold. Each is cut to Latin, the ʻokina (U+02BB), the kahakō
vowels in both cases, the punctuation the page sets, and every character
that appears anywhere in src/ or index.html — the whole word list and root
glossary, not just what is on screen, because any word can turn up and any
root's cognates can reach a card. Re-run it whenever the data is
regenerated; it names any character the font itself lacks.
"""
import pathlib
import sys
import unicodedata

from fontTools import subset
from fontTools.ttLib import TTFont

HERE = pathlib.Path(__file__).resolve().parent.parent
OUT = HERE / 'src' / 'fonts'

ASCII = ''.join(chr(c) for c in range(0x20, 0x7F))
# The ʻokina is a letter (U+02BB), never an apostrophe; kahakō vowels are
# precomposed (NFC), so each is one glyph in both cases.
HAWAIIAN = 'ʻāēīōūĀĒĪŌŪ'
# Cognates and Proto-Polynesian forms pick up a few more: the eng of *taŋata,
# the glottal stop some sources write as ʔ.
POLYNESIAN = 'ŋŊʔ'
PUNCTUATION = '·—–‘’“”…×←→•°№   '

CUTS = [
    ('400Regular', 'alegreya-400.woff2'),
    ('400Regular_Italic', 'alegreya-400-italic.woff2'),
    ('600SemiBold', 'alegreya-600.woff2'),
]

# Ligatures and kerning; real small caps (the English line under a field
# name, the stats); old-style and lining, proportional and tabular figures
# (the turn counter must not jitter); marks, for any combining sequence.
FEATURES = ['kern', 'liga', 'ccmp', 'locl', 'mark', 'mkmk', 'smcp', 'c2sc', 'onum', 'lnum', 'pnum', 'tnum', 'case']


def source_chars():
    """Every non-ASCII character in the app's own files, and where it came from."""
    found = {}
    paths = [HERE / 'index.html', *sorted((HERE / 'src').rglob('*.js')), *sorted((HERE / 'src').rglob('*.css'))]
    for path in paths:
        for ch in path.read_text(encoding='utf-8'):
            if ord(ch) > 0x7E:
                found.setdefault(ch, set()).add(path.relative_to(HERE).as_posix())
    return found


def cut(src, dest, text):
    opts = subset.Options()
    opts.flavor = 'woff2'
    opts.layout_features = FEATURES
    opts.name_IDs = ['*']
    opts.notdef_outline = True
    opts.hinting = False
    font = subset.load_font(str(src), opts)
    sub = subset.Subsetter(opts)
    sub.populate(text=text)
    sub.subset(font)
    subset.save_font(font, str(dest), opts)
    print(f'{dest.name}: {dest.stat().st_size / 1024:.1f} KB')


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    src_dir = pathlib.Path(sys.argv[1])
    found = source_chars()
    text = ''.join(sorted(set(ASCII + HAWAIIAN + POLYNESIAN + PUNCTUATION) | set(found)))

    # Anything shown that the font can't draw would fall back to another face
    # mid-word. Letters and marks matter wherever they are; other symbols only
    # in the data and the page (comments are full of box-drawing rules).
    cmap = TTFont(next(src_dir.rglob('Alegreya_400Regular.ttf'))).getBestCmap()
    for ch, where in sorted(found.items()):
        shown = any(w.startswith('src/data/') or w == 'index.html' for w in where)
        if ord(ch) not in cmap and (shown or unicodedata.category(ch)[0] in 'LM'):
            print(f'not in Alegreya: U+{ord(ch):04X} {unicodedata.name(ch, "?")} ({", ".join(sorted(where))})')

    OUT.mkdir(parents=True, exist_ok=True)
    for name, out in CUTS:
        cut(next(src_dir.rglob(f'Alegreya_{name}.ttf')), OUT / out, text)


if __name__ == '__main__':
    main()
