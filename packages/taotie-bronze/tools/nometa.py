#!/usr/bin/env python3
"""Fail if an owner-photographed reference image carries embedded metadata.

    python3 tools/nometa.py            # check reference/nezu-*/ (the project owner's photographs)
    python3 tools/nometa.py --strip    # rewrite offenders without their metadata segments (pixels untouched)

A JPEG is clean when its header holds nothing but JFIF (APP0) and the coding tables: no EXIF/XMP (APP1), ICC (APP2),
Photoshop/IPTC (APP13), other APPn, or comments (COM). PNGs are clean when they have no text/eXIf/time chunks.
"""
import glob, os, sys

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STRIP = '--strip' in sys.argv


def jpeg_segments(d):
    i, out = 2, []
    while i + 4 <= len(d) and d[i] == 0xFF:
        m = d[i + 1]
        n = int.from_bytes(d[i + 2:i + 4], 'big')
        out.append((m, i, 2 + n))
        if m == 0xDA:
            break
        i += 2 + n
    return out


def is_meta(m, payload):
    if m == 0xE0:
        return not payload.startswith(b'JFIF')
    return 0xE1 <= m <= 0xEF or m == 0xFE


bad = 0
for path in sorted(glob.glob(os.path.join(HERE, 'reference', 'nezu-*', '**', '*'), recursive=True)):
    low = path.lower()
    if low.endswith(('.jpg', '.jpeg')):
        d = open(path, 'rb').read()
        segs = jpeg_segments(d)
        hits = [(m, o, n) for m, o, n in segs if is_meta(m, d[o + 4:o + 16])]
        if hits:
            bad += 1
            print(os.path.relpath(path, HERE), ['APP%d' % (m - 0xE0) if m != 0xFE else 'COM' for m, _, _ in hits])
            if STRIP:
                out, last = bytearray(), 0
                for m, o, n in hits:
                    out += d[last:o]
                    last = o + n
                out += d[last:]
                open(path, 'wb').write(bytes(out))
    elif low.endswith('.png'):
        d = open(path, 'rb').read()
        i, hits = 8, []
        while i + 8 <= len(d):
            n = int.from_bytes(d[i:i + 4], 'big')
            kind = d[i + 4:i + 8]
            if kind in (b'tEXt', b'zTXt', b'iTXt', b'eXIf', b'tIME'):
                hits.append(kind.decode())
            i += 12 + n
        if hits:
            bad += 1
            print(os.path.relpath(path, HERE), hits)

if bad and not STRIP:
    print(f'{bad} file(s) carry metadata; run with --strip')
    sys.exit(1)
print('owner photographs: no embedded metadata' if not bad else f'stripped {bad} file(s)')
