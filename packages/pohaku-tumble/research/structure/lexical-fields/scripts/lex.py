#!/usr/bin/env python3
"""Lookup helpers for the lexical-fields study.  Read-only use of the cached sources:

  W  = Wiktionary Hawaiian (kaikki wiktextract dump, every sense)
  P  = POLLEX Hawaiian reflexes (98% cited to Pukui & Elbert 1986; spelling = P&E's)
  A  = Andrews, Dictionary of the Hawaiian Language, rev. Parker 1922 (OCR; no okina/kahako)
  C  = Hawaiian Wikipedia running text (token and n-gram counts, modern spelling)

Normalisation: NFC, okina look-alikes -> U+02BB, lowercase.
"""
import json, re, os, unicodedata, collections, html, pickle

CACHE = 'roots/.cache'
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(os.path.dirname(HERE), 'tables')
OK = 'ʻ'
OKINA_LIKE = "'‘’ʼ`ʽ"
STRIP = str.maketrans({'ā': 'a', 'ē': 'e', 'ī': 'i', 'ō': 'o', 'ū': 'u', OK: None, ' ': None, '-': None})


def norm(w):
    w = unicodedata.normalize('NFC', w)
    for c in OKINA_LIKE:
        w = w.replace(c, OK)
    return w.lower().strip()


def strip(w):
    """Andrews-style spelling: no okina, no kahako, no spaces/hyphens."""
    return norm(w).translate(STRIP)

# ---------------------------------------------------------------- Wiktionary
_W = None
def W():
    global _W
    if _W is None:
        _W = collections.defaultdict(list)
        for line in open(os.path.join(CACHE, 'kaikki-haw.jsonl'), encoding='utf-8'):
            e = json.loads(line)
            gl = []
            for s in e.get('senses', []):
                gl.extend(s.get('glosses', []) or s.get('raw_glosses', []))
            _W[norm(e['word'])].append({'pos': e.get('pos'), 'glosses': gl,
                                        'etym': e.get('etymology_text', ''),
                                        'cats': [c['name'] if isinstance(c, dict) else c for s in e.get('senses', []) for c in s.get('categories', [])]})
    return _W

def wikt(word):
    return W().get(norm(word), [])

def wgloss(word, n=6):
    out = []
    for e in wikt(word):
        out.append('%s: %s' % (e['pos'], '; '.join(e['glosses'][:n])))
    return ' | '.join(out)

# ---------------------------------------------------------------- POLLEX
_P = None
def P():
    global _P
    if _P is None:
        _P = collections.defaultdict(list)
        for r in json.load(open(os.path.join(CACHE, 'pollex/hawaiian-reflexes.json'), encoding='utf-8')):
            forms = set([norm(r['haw'])] + [norm(f) for f in r.get('haw_forms', [])])
            for f in forms:
                _P[f].append(r)
    return _P

def pollex(word):
    return P().get(norm(word), [])

def pgloss(word):
    return ' | '.join('%s (%s %s "%s")' % (r['haw_gloss'], r['level'], r['proto'], r['proto_gloss']) for r in pollex(word))

# ---------------------------------------------------------------- Andrews-Parker
_A = None
def A():
    global _A
    if _A is None:
        t = open(os.path.join(CACHE, 'andrews-parker1922.txt'), encoding='utf-8').read()
        heads = list(re.finditer(r"(?m)^([A-Z][A-Za-z\-' ]{0,40}?)\s+\(\s*([^)]{1,80})\)\s*[,.]?", t))
        _A = collections.defaultdict(list)
        for i, m in enumerate(heads):
            end = heads[i + 1].start() if i + 1 < len(heads) else len(t)
            body = re.sub(r'\s+', ' ', t[m.start(): min(end, m.start() + 900)])
            _A[strip(m.group(1))].append(body)
    return _A

def andrews(word):
    return A().get(strip(word), [])

# ---------------------------------------------------------------- Corpus (hawwiki)
CORPUS_PKL = os.path.join(OUT, 'hawwiki_tokens.pkl')

def _clean(text):
    text = html.unescape(text)
    text = re.sub(r'<ref[^>]*/>', ' ', text)
    text = re.sub(r'<ref.*?</ref>', ' ', text, flags=re.S)
    text = re.sub(r'<!--.*?-->', ' ', text, flags=re.S)
    for _ in range(6):
        text = re.sub(r'\{\{[^{}]*\}\}', ' ', text)
    text = re.sub(r'\{\|.*?\|\}', ' ', text, flags=re.S)
    text = re.sub(r'\[\[(?:[^\]|]*:)[^\]]*\]\]', ' ', text)
    text = re.sub(r'\[\[([^\]|]*)\|([^\]]*)\]\]', r'\2', text)
    text = re.sub(r'\[\[([^\]]*)\]\]', r'\1', text)
    text = re.sub(r'\[https?://\S+\s*([^\]]*)\]', r'\1', text)
    text = re.sub(r'https?://\S+', ' ', text)
    text = re.sub(r'<[^>]+>', ' ', text)
    text = re.sub(r"'{2,}", '', text)
    return text

def corpus():
    """List of articles, each a list of sentences, each a list of lowercased tokens."""
    if os.path.exists(CORPUS_PKL):
        return pickle.load(open(CORPUS_PKL, 'rb'))
    raw = open(os.path.join(CACHE, 'hawwiki.xml'), encoding='utf-8').read()
    arts = []
    for p in re.findall(r'<page>(.*?)</page>', raw, flags=re.S):
        ns = re.search(r'<ns>(\d+)</ns>', p)
        if not ns or ns.group(1) != '0' or '<redirect' in p:
            continue
        m = re.search(r'<text[^>]*>(.*?)</text>', p, flags=re.S)
        if not m:
            continue
        t = unicodedata.normalize('NFC', _clean(m.group(1)))
        t = t.replace('‘', OK).replace('’', OK).replace('ʼ', OK)
        t = re.sub(r"(?<=[a-zA-ZāēīōūĀĒĪŌŪ])'(?=[a-zA-ZāēīōūĀĒĪŌŪ])", OK, t)
        t = re.sub(r"(?<=\s)'(?=[aeiouāēīōūAEIOUĀĒĪŌŪ])", OK, t)
        t = t.lower()
        sents = []
        for s in re.split(r'[.!?;:\n]+', t):
            toks = [x.strip(OK) if x.endswith(OK) and len(x) > 1 and not x.startswith(OK) else x
                    for x in re.split(r"[^a-zāēīōū%s\-]+" % OK, s) if x and x != '-']
            if toks:
                sents.append(toks)
        arts.append(sents)
    pickle.dump(arts, open(CORPUS_PKL, 'wb'))
    return arts

_UNI = None
def unigrams():
    global _UNI
    if _UNI is None:
        _UNI = collections.Counter(t for a in corpus() for s in a for t in s)
    return _UNI

def count(word):
    return unigrams().get(norm(word), 0)

def phrase(ph):
    """Count a space-separated token sequence (exact, marks included)."""
    seq = norm(ph).split()
    n = len(seq)
    c = 0
    for a in corpus():
        for s in a:
            for i in range(len(s) - n + 1):
                if s[i:i + n] == seq:
                    c += 1
    return c

def phrases(list_of_phrases):
    """Count many phrases in one pass. Returns dict."""
    seqs = {p: tuple(norm(p).split()) for p in list_of_phrases}
    bylen = collections.defaultdict(dict)
    for p, s in seqs.items():
        bylen[len(s)][s] = p
    res = collections.Counter({p: 0 for p in list_of_phrases})
    for a in corpus():
        for s in a:
            for n, d in bylen.items():
                for i in range(len(s) - n + 1):
                    k = tuple(s[i:i + n])
                    if k in d:
                        res[d[k]] += 1
    return dict(res)

def kwic(ph, k=5, width=6):
    seq = norm(ph).split()
    n = len(seq)
    out = []
    for a in corpus():
        for s in a:
            for i in range(len(s) - n + 1):
                if s[i:i + n] == seq:
                    out.append(' '.join(s[max(0, i - width): i + n + width]))
                    if len(out) >= k:
                        return out
    return out

def evidence(word):
    """One-line evidence summary for a form."""
    w = norm(word)
    return {'form': w, 'W': bool(wikt(w)), 'P': bool(pollex(w)), 'A': len(andrews(w)) > 0,
            'C': count(w) if ' ' not in w else phrase(w)}

if __name__ == '__main__':
    import sys
    c = corpus()
    print('articles', len(c), 'sentences', sum(len(a) for a in c), 'tokens', sum(len(s) for a in c for s in a))
    for w in sys.argv[1:]:
        print(w, evidence(w), wgloss(w)[:200], '//', pgloss(w)[:200])
