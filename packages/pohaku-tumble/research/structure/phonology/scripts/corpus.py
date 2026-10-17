#!/usr/bin/env python3
"""Extract running Hawaiian text from the local Hawaiian Wikipedia dump and count
word tokens.  Output: corpus_counts.json {word: count} (normalised spelling,
lowercased, only tokens that are spelled with modern Hawaiian letters AND obey
(C)V phonotactics -- this drops most English/foreign tokens), plus
corpus_bigrams.json for article/possessive checks (top bigrams only), and a few
orthography statistics.
"""
import re, json, os, unicodedata, collections, html

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = 'roots/.cache'
OK = 'ʻ'
V = 'aeiouāēīōū'
C = 'pkhmnlw' + OK
TOK = re.compile(r"[%s%s]+" % (V, C))
CV = re.compile(r"^(?:[%s]?[%s])+$" % (C, V))


def clean(text):
    text = html.unescape(text)
    text = re.sub(r'<ref[^>]*/>', ' ', text)
    text = re.sub(r'<ref.*?</ref>', ' ', text, flags=re.S)
    text = re.sub(r'<!--.*?-->', ' ', text, flags=re.S)
    # templates (nested) -- iterate
    for _ in range(6):
        text = re.sub(r'\{\{[^{}]*\}\}', ' ', text)
    text = re.sub(r'\{\|.*?\|\}', ' ', text, flags=re.S)          # tables
    text = re.sub(r'\[\[(?:[^\]|]*:)[^\]]*\]\]', ' ', text)        # files/categories/interwiki
    text = re.sub(r'\[\[([^\]|]*)\|([^\]]*)\]\]', r'\2', text)
    text = re.sub(r'\[\[([^\]]*)\]\]', r'\1', text)
    text = re.sub(r'\[https?://\S+\s*([^\]]*)\]', r'\1', text)
    text = re.sub(r'https?://\S+', ' ', text)
    text = re.sub(r'<[^>]+>', ' ', text)
    text = re.sub(r"'{2,}", '', text)
    return text


def main():
    raw = open(os.path.join(CACHE, 'hawwiki.xml'), encoding='utf-8').read()
    pages = re.findall(r'<page>(.*?)</page>', raw, flags=re.S)
    counts = collections.Counter()
    bigrams = collections.Counter()
    stats = collections.Counter()
    seqs = []
    for p in pages:
        ns = re.search(r'<ns>(\d+)</ns>', p)
        if not ns or ns.group(1) != '0':
            continue
        if '<redirect' in p:
            continue
        m = re.search(r'<text[^>]*>(.*?)</text>', p, flags=re.S)
        if not m:
            continue
        stats['articles'] += 1
        t = clean(m.group(1))
        t = unicodedata.normalize('NFC', t)
        t = t.replace('‘', OK).replace('’', OK).replace('ʼ', OK)
        t = re.sub(r"(?<=[a-zA-ZāēīōūĀĒĪŌŪ])'(?=[a-zA-ZāēīōūĀĒĪŌŪ])", OK, t)
        t = t.lower()
        # split on anything that is not a letter/okina, keep sentence order
        prev = None
        for raw_tok in re.split(r"[^a-zāēīōū%s]+" % OK, t):
            if not raw_tok:
                prev = None
                continue
            stats['raw_tokens'] += 1
            tok = raw_tok.strip(OK) if raw_tok.endswith(OK) else raw_tok
            if TOK.fullmatch(tok) and CV.match(tok):
                counts[tok] += 1
                stats['kept_tokens'] += 1
                if prev is not None:
                    bigrams[(prev, tok)] += 1
                prev = tok
            else:
                prev = None
    json.dump(counts, open(os.path.join(HERE, 'corpus_counts.json'), 'w'), ensure_ascii=False)
    json.dump({' '.join(k): v for k, v in bigrams.most_common(200000)},
              open(os.path.join(HERE, 'corpus_bigrams.json'), 'w'), ensure_ascii=False)
    # orthography check: how often are diacritic-bearing high-frequency words
    # written without their marks?
    pairs = [('kēia', 'keia'), ('ʻo', 'o'), ('hawaiʻi', 'hawaii'), ('ʻāina', 'aina'), ('kēlā', 'kela'),
             ('nā', 'na'), ('ʻana', 'ana'), ('ʻia', 'ia'), ('mōʻī', 'moi'), ('ʻōlelo', 'olelo'),
             ('ʻaʻole', 'aole'), ('kānaka', 'kanaka'), ('kāne', 'kane'), ('māhele', 'mahele')]
    stats['ortho'] = {a + '/' + b: [counts[a], counts[b]] for a, b in pairs}
    stats['types'] = len(counts)
    json.dump(stats, open(os.path.join(HERE, 'corpus_stats.json'), 'w'), ensure_ascii=False, indent=1)
    print(json.dumps(stats, ensure_ascii=False, indent=1))
    print(counts.most_common(80))


if __name__ == '__main__':
    main()
