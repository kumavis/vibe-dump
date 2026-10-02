#!/usr/bin/env python3
"""Cut Klee One down to the Japanese this app actually writes.

Patrick Hand (the hand-lettered face for English) has no Japanese, so the
Japanese words on the paper and in the fortune fall through to Klee One — a
handwritten-style face by Fontworks, under the SIL Open Font License 1.1. The
whole font is several megabytes; this keeps only the characters that appear in
src/ja.js and src/i18n.js, plus Japanese punctuation, as one small woff2.

Re-run it whenever the Japanese text gains a character, or that character
will render in a fallback face:

    pip install fonttools brotli
    npm pack @expo-google-fonts/klee-one && tar xzf expo-google-fonts-klee-one-*.tgz
    python3 tools/build-fonts.py package/600SemiBold/KleeOne_600SemiBold.ttf
"""
import pathlib
import sys

from fontTools import subset

here = pathlib.Path(__file__).resolve().parent.parent
source = pathlib.Path(sys.argv[1])
text = ''.join((here / 'src' / name).read_text(encoding='utf-8') for name in ('ja.js', 'i18n.js'))
chars = {c for c in text if ord(c) >= 0x3000}
chars |= set('、。「」『』（）！？・…ー〜　')

out = here / 'src' / 'fonts' / 'klee-one-600.woff2'
options = subset.Options()
options.flavor = 'woff2'
options.layout_features = ['*']
options.name_IDs = ['*']  # keep the copyright and licence notices
options.notdef_outline = True
font = subset.load_font(str(source), options)
sub = subset.Subsetter(options)
sub.populate(text=''.join(sorted(chars)))
sub.subset(font)
subset.save_font(font, str(out), options)
print(f'{out.relative_to(here)}: {len(chars)} characters, {out.stat().st_size // 1024} KiB')
