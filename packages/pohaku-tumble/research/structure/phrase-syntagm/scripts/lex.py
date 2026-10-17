"""Lexical attestation sets used by every other script.

W  Wiktionary (kaikki-haw.jsonl): headwords, plus forms listed under derived/related.
P  POLLEX Hawaiian reflexes (98% cited to Pukui & Elbert 1986) -- P&E spellings.
A  Andrews-Parker 1922 OCR headwords (no okina/kahako; letters only).
R  the 905 compound reviews from the roots study (scratchpad/lang/review).
All spellings normalised with common.norm (NFC, lower, okina U+02BB)."""
import json, re, glob, os
from collections import defaultdict
import common as C

CACHE = C.CACHE
REVIEW = 'review/(scratch) review'


def wikt():
    """norm headword -> list of {pos, glosses, etym, raw}; and derived-form set"""
    heads = defaultdict(list)
    derived = set()
    for line in open(f'{CACHE}/kaikki-haw.jsonl', encoding='utf-8'):
        e = json.loads(line)
        w = C.norm(e['word'])
        gl = [g for s in e.get('senses', []) for g in s.get('glosses', [])]
        heads[w].append({'pos': e.get('pos'), 'glosses': gl, 'etym': e.get('etymology_text') or '',
                         'raw': e['word']})
        for k in ('derived', 'related'):
            for d in e.get(k, []) or []:
                if d.get('word'):
                    derived.add(C.norm(d['word']))
    return heads, derived


def pollex():
    rows = json.load(open(f'{CACHE}/pollex/hawaiian-reflexes.json', encoding='utf-8'))
    by = defaultdict(list)
    for r in rows:
        forms = set(r.get('haw_forms') or []) | {r['haw']}
        for f in forms:
            f = re.sub(r'[()]', '', f).strip()
            by[C.norm(f)].append(r)
    return by, rows


_HEAD = re.compile(r"(?m)^([A-Z][A-Za-z\-']{0,30})\s+\(\s*([^)]{1,70})\)\s*[,.:]?\s*([a-z]{1,5})[.,]")


def andrews():
    """letters-only headword -> list of (pron, pos).  Headwords are taken from
    lines 'Word (pron), pos.' ; OCR'd headword repaired from the pronunciation
    when they differ by <=1 letter (same rule as extract_andrews.py)."""
    t = open(f'{CACHE}/andrews-parker1922.txt', encoding='utf-8').read()
    out = defaultdict(list)
    tr = str.maketrans({'3': 'a', '&': 'a', '5': 'o', '6': 'o', '!': 'i', '1': 'i', '0': 'o', '8': 'a', '4': 'a'})
    for m in _HEAD.finditer(t):
        hw = re.sub(r'[^a-z]', '', m.group(1).lower())
        pw = re.sub(r'[^a-z]', '', m.group(2).translate(tr).lower())
        if pw and set(pw) <= set('aeiouhklmnpw') and abs(len(pw) - len(hw)) <= 1:
            hw = pw
        out[hw].append((m.group(2), m.group(3), m.group(1)))
    return out


def reviews():
    R = []
    for f in sorted(glob.glob(f'{REVIEW}/batch-*.json')):
        R.extend(json.load(open(f)))
    return R


def bare(s):
    return C.strip_marks(s).replace(' ', '').replace('-', '')
