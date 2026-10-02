#!/usr/bin/env python3
"""Subset the bundled fonts down to the characters this app can ever draw.

    pip install fonttools brotli
    python3 tools/build-fonts.py <dir-with-NotoSerifJP-ttfs> <dir-with-IBMPlexMono-ttfs>

The source TTFs are Google Fonts' static instances (the @expo-google-fonts
npm packages ship them: `npm pack @expo-google-fonts/noto-serif-jp
@expo-google-fonts/ibm-plex-mono`). The serif is cut to every CJK and kana
character that appears anywhere in src/ or index.html — the whole word list,
not just what's on screen, because any word can turn up — plus ASCII. Re-run
it whenever the word list grows a new character.
"""
import pathlib
import sys

from fontTools import subset

HERE = pathlib.Path(__file__).resolve().parent.parent
OUT = HERE / 'src' / 'fonts'

# The serif needs ASCII too: the card's headline and floor watermark set Latin
# in it alongside the kanji.
LATIN = ''.join(chr(c) for c in range(0x20, 0x7F)) + 'āēīōūĀĒĪŌŪ·—–−’‘“”…←→↑↓×'


def source_chars():
    chars = set()
    for path in [HERE / 'index.html', *sorted((HERE / 'src').rglob('*.js')), *sorted((HERE / 'src').rglob('*.css'))]:
        for ch in path.read_text(encoding='utf-8'):
            cp = ord(ch)
            if (
                0x3000 <= cp <= 0x30FF  # punctuation, hiragana, katakana
                or 0x4E00 <= cp <= 0x9FFF  # unified ideographs
                or 0xFF00 <= cp <= 0xFFEF  # full-width forms
            ):
                chars.add(ch)
    return chars


def cut(src, dest, text):
    opts = subset.Options()
    opts.flavor = 'woff2'
    opts.layout_features = ['kern', 'liga', 'palt', 'vert', 'locl']
    opts.name_IDs = ['*']
    opts.notdef_outline = True
    opts.hinting = False
    font = subset.load_font(str(src), opts)
    sub = subset.Subsetter(opts)
    sub.populate(text=text)
    sub.subset(font)
    subset.save_font(font, str(dest), opts)
    print(f'{dest.name}: {dest.stat().st_size / 1024:.0f} KB')


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    serif_dir, mono_dir = map(pathlib.Path, sys.argv[1:])
    cjk = source_chars()
    print(f'{len(cjk)} CJK/kana characters')
    text = ''.join(sorted(cjk)) + LATIN
    OUT.mkdir(parents=True, exist_ok=True)
    for weight, name in [(400, '400Regular'), (600, '600SemiBold')]:
        cut(next(serif_dir.rglob(f'NotoSerifJP_{name}.ttf')), OUT / f'noto-serif-jp-{weight}.woff2', text)
    for weight, name in [(400, '400Regular'), (500, '500Medium')]:
        cut(next(mono_dir.rglob(f'IBMPlexMono_{name}.ttf')), OUT / f'ibm-plex-mono-{weight}.woff2', LATIN)


if __name__ == '__main__':
    main()
