"""Shared loaders and normalisation for the derivation/reduplication study.
Read-only use of .../.cache data."""
import json, re, unicodedata, os
from collections import defaultdict

CACHE = 'roots/.cache'
W = 'structure/derivation-reduplication'
OK = 'ʻ'
VOW = 'aeiouāēīōū'
LONG = {'ā': 'a', 'ē': 'e', 'ī': 'i', 'ō': 'o', 'ū': 'u'}
SHORT2LONG = {v: k for k, v in LONG.items()}
CONS = 'hklmnpwʻ'

def norm(s):
    s = unicodedata.normalize('NFC', s.strip().lower())
    for ch in "'‘’ʼ`´":
        s = s.replace(ch, OK)
    return s

def strip_marks(s):
    """remove okina and macrons -> Andrews-style spelling"""
    s = norm(s).replace(OK, '')
    return ''.join(LONG.get(c, c) for c in s)

def shorten(s):
    return ''.join(LONG.get(c, c) for c in s)

def is_haw(s):
    return bool(s) and all(c in VOW + CONS for c in s)

def syllables(w):
    """split into (C)V units; a long vowel is one V unit (mora count separately)."""
    out = []
    i = 0
    while i < len(w):
        c = w[i]
        if c in CONS:
            if i + 1 < len(w) and w[i + 1] in VOW:
                out.append(w[i:i + 2]); i += 2
            else:
                out.append(c); i += 1
        else:
            out.append(c); i += 1
    return out

def load_kaikki():
    ents = defaultdict(list)
    for line in open(f'{CACHE}/kaikki-haw.jsonl'):
        e = json.loads(line)
        w = norm(e['word'])
        gl = []
        cats = set()
        for c in e.get('categories', []):
            cats.add(c['name'] if isinstance(c, dict) else c)
        for s in e.get('senses', []):
            gl.extend(s.get('glosses', []))
            for c in s.get('categories', []):
                cats.add(c['name'] if isinstance(c, dict) else c)
        ents[w].append({'pos': e.get('pos'), 'glosses': gl, 'cats': sorted(cats),
                        'etym': e.get('etymology_text', ''),
                        'tpls': e.get('etymology_templates', [])})
    return ents

NONLEX_POS = {'character', 'prefix', 'suffix', 'infix', 'interfix', 'name', 'symbol', 'punct', 'abbrev', 'circumfix'}

def load_pollex():
    d = json.load(open(f'{CACHE}/pollex/hawaiian-reflexes.json'))
    px = defaultdict(list)
    for x in d:
        for f in x['haw_forms']:
            px[norm(f)].append({'gloss': x['haw_gloss'], 'proto': x['proto'], 'level': x['level'],
                                'proto_gloss': x['proto_gloss'], 'flags': x['haw_flags'], 'source': x['source']})
    return px

ANDREWS_HEAD = re.compile(r"^([A-Z][a-z]+)\s+\(([^)]{1,40})\)\s*[,.]?\s*(adj|adv|n|v|prep|conj|int|part|pron)\b")

def load_andrews():
    """headwords (lowercased, unmarked) -> list of entry texts (first ~6 lines)"""
    lines = open(f'{CACHE}/andrews-parker1922.txt', encoding='utf-8', errors='replace').read().split('\n')
    heads = defaultdict(list)
    for i, l in enumerate(lines):
        m = ANDREWS_HEAD.match(l.strip())
        if m:
            txt = ' '.join(x.strip() for x in lines[i:i + 8])
            # cut at next headword-ish start
            heads[m.group(1).lower()].append(re.sub(r'\s+', ' ', txt))
    return heads

def lexicon():
    """word -> dict(glosses, pos, W, P)"""
    k = load_kaikki()
    p = load_pollex()
    lex = {}
    for w, es in k.items():
        if ' ' in w or not is_haw(w.replace('-', '')):
            continue
        es2 = [e for e in es if e['pos'] not in NONLEX_POS]
        if not es2:
            continue
        lex[w] = {'W': True, 'P': False, 'pos': sorted({e['pos'] for e in es2}),
                  'glosses': [g for e in es2 for g in e['glosses']], 'pgloss': [], 'cats': sorted({c for e in es2 for c in e['cats']})}
    for w, xs in p.items():
        if ' ' in w or not is_haw(w):
            continue
        if w not in lex:
            lex[w] = {'W': False, 'P': True, 'pos': [], 'glosses': [], 'pgloss': [], 'cats': []}
        lex[w]['P'] = True
        lex[w]['pgloss'].extend(x['gloss'] for x in xs)
        lex[w]['proto'] = sorted({x['proto'] for x in xs})
    return lex

def gl(lex, w, n=110):
    e = lex.get(w)
    if not e:
        return ''
    g = '; '.join(e['glosses'])
    if e['pgloss']:
        g = (g + ' || PE: ' if g else 'PE: ') + '; '.join(e['pgloss'])
    return g[:n]
