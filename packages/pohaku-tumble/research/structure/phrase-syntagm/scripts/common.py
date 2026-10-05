# Copied from ../grammatical-paradigms/common.py (sibling study, same session) so this
# directory is self-contained; corpus.pkl is rebuilt here.
"""Shared loaders for the grammatical-paradigms study.

Read-only use of the local caches under .../roots/.cache.
Nothing here writes outside this directory.
"""
import json, re, os, unicodedata, pickle, html
from collections import defaultdict, Counter

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = 'roots/.cache'
OK = 'ʻ'                      # U+02BB
VOW = 'aeiouāēīōū'
LONG = {'ā': 'a', 'ē': 'e', 'ī': 'i', 'ō': 'o', 'ū': 'u'}
CONS = 'hklmnpwʻ'


def norm(s):
    """NFC, lowercase, every okina look-alike -> U+02BB."""
    s = unicodedata.normalize('NFC', s.strip())
    for ch in "'‘’ʼ`´":
        s = s.replace(ch, OK)
    return s.lower()


def strip_marks(s):
    """drop okina and macrons -> Andrews-style spelling."""
    s = norm(s).replace(OK, '')
    return ''.join(LONG.get(c, c) for c in s)


def is_native(s):
    return bool(s) and all(c in VOW + CONS for c in s)


# ---------------------------------------------------------------- Wiktionary
def load_kaikki():
    """word(normalised) -> list of {pos, glosses, etym, forms, raw_word}"""
    ents = defaultdict(list)
    for line in open(f'{CACHE}/kaikki-haw.jsonl', encoding='utf-8'):
        e = json.loads(line)
        w = norm(e['word'])
        gl = []
        for s in e.get('senses', []):
            gl.extend(s.get('glosses', []))
        ents[w].append({'pos': e.get('pos'), 'glosses': gl,
                        'etym': e.get('etymology_text', ''),
                        'forms': [f.get('form') for f in e.get('forms', [])],
                        'raw_word': e['word']})
    return ents


# ---------------------------------------------------------------- POLLEX
def load_pollex():
    """haw form(normalised) -> list of rows"""
    rows = json.load(open(f'{CACHE}/pollex/hawaiian-reflexes.json', encoding='utf-8'))
    by = defaultdict(list)
    for r in rows:
        for f in r.get('haw_forms') or [r['haw']]:
            by[norm(f)].append(r)
    return by, rows


# ---------------------------------------------------------------- Andrews-Parker 1922
_AP = None


def andrews_parker(word):
    """headword entries in the Andrews-Parker OCR for an undiacritised word.
    Parker sometimes writes the glottal stop as an apostrophe (Ka'u, Na'u); those
    are matched too and flagged.  Returns list of (pos, first ~160 chars, apostrophe_headword)."""
    global _AP
    if _AP is None:
        _AP = open(f'{CACHE}/andrews-parker1922.txt', encoding='utf-8').read().split('\n')
    w = strip_marks(word)
    head = re.compile(r"^([A-Z][a-z']*)[!,]?\s+\(([^)]*)\)[,.:]?\s*(.*)$")
    out = []
    for i, line in enumerate(_AP):
        m = head.match(line)
        if not m:
            continue
        hw = m.group(1)
        if hw.replace("'", '').lower() != w:
            continue
        rest = m.group(3)
        pm = re.match(r"((?:[a-z]+\.\s*(?:and\s+)?)+)", rest)
        pos = pm.group(1).strip() if pm else ''
        txt = re.sub(r'\s+', ' ', ' '.join(_AP[i:i + 3]))
        out.append((pos, txt[:170], "'" in hw))
    return out


# ---------------------------------------------------------------- Hawaiian Wikipedia
TOKRE = re.compile(r"[A-Za-zĀĒĪŌŪāēīōūʻ'‘’ʼ]+")


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
    text = re.sub(r'^[=*#:;|!].*$', lambda m: m.group(0).lstrip('=*#:;|! ').rstrip('= '), text, flags=re.M)
    return text


# Word-salad filter.  Some 280 Hawaiian Wikipedia pages carry long paragraphs of
# machine-made pseudo-Hawaiian (e.g. "paʻlaʻalshai nā kānaka ... mea paʻakikī kona
# hele aku uaʻlanahai").  Real Hawaiian never has an okina before a consonant, so a
# paragraph is dropped if any token has one, or carries one of the salad's recurring
# forms (found by co-occurrence with such tokens; see NOTES.md, "Corpus").
SALAD = set('''paʻlaʻalshai uaʻlanahai wāʻkalama maʻmaikaīama uaʻalʻmaia naʻmahana aiʻmana kīwaʻma
uaʻmaika aliʻka uaʻmakaʻiakama waʻmīauaua poīmaunāʻmō akiouʻmaiki onāukiʻma aiʻmailʻama
kīʻnekelana kaʻmikīaʻmauʻka amaʻalʻana meakanu uaʻamakilaʻama lunaʻamaua maʻikaʻika wāʻana
waiʻanikama uamaiʻakomi rapanui'''.split())
ILLEGAL = re.compile(r"ʻ[^aeiouāēīōū]")


def _paragraphs():
    raw = open(f'{CACHE}/hawwiki.xml', encoding='utf-8').read()
    pages = re.findall(r'<page>(.*?)</page>', raw, flags=re.S)
    for pi, p in enumerate(pages):
        ns = re.search(r'<ns>(\d+)</ns>', p)
        if not ns or ns.group(1) != '0' or '<redirect' in p:
            continue
        m = re.search(r'<text[^>]*>(.*?)</text>', p, flags=re.S)
        if not m:
            continue
        t = unicodedata.normalize('NFC', _clean(m.group(1)))
        for para in t.split('\n'):
            ptoks = [norm(x).rstrip(OK) for x in TOKRE.findall(para)]
            ptoks = [x for x in ptoks if x]
            if ptoks:
                yield pi, para, ptoks


def _split_sents(para):
    out = []
    for s in re.split(r'[.?!;:()\[\]"“”,]+', para):
        toks = []
        for tok in TOKRE.findall(s):
            n = norm(tok).rstrip(OK)
            if not n or n == OK:
                continue
            toks.append((n, tok.lstrip("ʻ'‘’ʼ")[:1].isupper()))
        if toks:
            out.append(toks)
    return out


def build_corpus(nb_threshold=0.5, iterations=3):
    """List of sentences; each sentence = list of (norm_token, is_capitalised).
    Word-salad filter (see NOTES.md, Corpus):
      pass 1  paragraph dropped if a token has an okina before a consonant or is in SALAD;
      pass 2  bigrams seen >= 8 times in pass-1 salad and never in salad-free pages are
              markers; paragraph dropped if it has >= 2 marker bigrams;
      pass 3  sentence-level naive-Bayes score (mean log-ratio of unigram probabilities,
              salad vs kept text, add-0.5 smoothing), re-estimated `iterations` times;
              sentences scoring > nb_threshold are dropped.
    Returns (sents, stats)."""
    import math
    paras = list(_paragraphs())
    st = Counter()
    salad1 = set()
    dirty_pages = set()
    for k, (pi, para, ptoks) in enumerate(paras):
        if any(x in SALAD or ILLEGAL.search(x) for x in ptoks):
            salad1.add(k)
            dirty_pages.add(pi)
    sb, cb = Counter(), Counter()
    for k, (pi, para, ptoks) in enumerate(paras):
        bg = list(zip(ptoks, ptoks[1:]))
        if k in salad1:
            sb.update(bg)
        elif pi not in dirty_pages:
            cb.update(bg)
    markers = {b for b, n in sb.items() if n >= 8 and cb[b] == 0}
    st['marker_bigrams'] = len(markers)
    salad_s, keep_s = [], []        # sentences
    for k, (pi, para, ptoks) in enumerate(paras):
        ss = _split_sents(para)
        if k in salad1:
            st['dropped_paragraphs_pass1'] += 1
            st['dropped_tokens_pass1'] += len(ptoks)
            salad_s.extend(ss)
            continue
        nm = sum(1 for b in zip(ptoks, ptoks[1:]) if b in markers)
        if nm >= 2:
            st['dropped_paragraphs_pass2'] += 1
            st['dropped_tokens_pass2'] += len(ptoks)
            salad_s.extend(ss)
            continue
        keep_s.extend(ss)
    base_salad = list(salad_s)
    for it in range(iterations):
        S = Counter(t for s in salad_s for t, _ in s)
        C = Counter(t for s in keep_s for t, _ in s)
        NS, NC = sum(S.values()), sum(C.values())
        V = len(set(S) | set(C))
        lS, lC = math.log(NS + 0.5 * V), math.log(NC + 0.5 * V)

        def score(s):
            return sum(math.log(S[t] + 0.5) - lS - math.log(C[t] + 0.5) + lC for t, _ in s) / len(s)
        newkeep, flagged = [], []
        for s in keep_s:
            (flagged if score(s) > nb_threshold else newkeep).append(s)
        salad_s = base_salad + flagged
        if it == iterations - 1:
            keep_s = newkeep
            st['dropped_sentences_pass3'] = len(flagged)
            st['dropped_tokens_pass3'] = sum(len(s) for s in flagged)
    st['kept_tokens'] = sum(len(s) for s in keep_s)
    st['sentences'] = len(keep_s)
    st['pages_with_pass1_salad'] = len(dirty_pages)
    return keep_s, dict(st)


def corpus():
    pk = os.path.join(HERE, 'corpus.pkl')
    if os.path.exists(pk):
        return pickle.load(open(pk, 'rb'))
    sents, npages = build_corpus()
    pickle.dump((sents, npages), open(pk, 'wb'))
    return sents, npages


def unigram_counts(sents, lower_only=False):
    c = Counter()
    for s in sents:
        for t, cap in s:
            if lower_only and cap:
                continue
            c[t] += 1
    return c
