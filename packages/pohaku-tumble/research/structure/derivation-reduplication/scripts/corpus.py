"""Tokenise Hawaiian Wikipedia (ns 0) into a word-frequency table. Writes tables/hawwiki_freq.tsv"""
import re, html
from collections import Counter
from common import *

txt = open(f'{CACHE}/hawwiki.xml', encoding='utf-8').read()
pages = re.findall(r'<page>(.*?)</page>', txt, re.S)
freq = Counter()
bigr = Counter()
npages = 0
for p in pages:
    if '<ns>0</ns>' not in p or '<redirect' in p:
        continue
    m = re.search(r'<text[^>]*>(.*?)</text>', p, re.S)
    if not m:
        continue
    npages += 1
    t = html.unescape(m.group(1))
    t = re.sub(r'<ref[^>]*/>|<ref.*?</ref>', ' ', t, flags=re.S)
    for _ in range(3):
        t = re.sub(r'\{\{[^{}]*\}\}', ' ', t)
    t = re.sub(r'\{\|.*?\|\}', ' ', t, flags=re.S)
    t = re.sub(r'\[\[(?:[^\]|]*\|)?([^\]]*)\]\]', r'\1', t)
    t = re.sub(r'\[https?://\S+\s*([^\]]*)\]', r'\1', t)
    t = re.sub(r'<[^>]+>', ' ', t)
    t = t.replace("'''", ' ').replace("''", ' ')
    t = re.sub(r"(?<=\w)['‘’`](?=\w)|(?<=\s)['‘’`](?=\w)|^['‘’`](?=\w)", OK, t, flags=re.M)
    t = unicodedata.normalize('NFC', t.lower())
    toks = re.findall(r'[ʻaeiouāēīōūhklmnpw]+', t)
    # keep only tokens bounded by non-letters in the original (approximate: drop pieces of foreign words)
    words = re.findall(r"[^\W\d_]+(?:ʻ[^\W\d_]+)*|ʻ[^\W\d_]+", t)
    prev = None
    for w in words:
        w = w.strip(OK) if not w.startswith(OK) else w
        if is_haw(w):
            freq[w] += 1
            if prev: bigr[(prev, w)] += 1
            prev = w
        else:
            prev = None
with open(f'{W}/tables/hawwiki_freq.tsv', 'w') as f:
    for w, n in freq.most_common():
        f.write(f'{w}\t{n}\n')
import pickle
pickle.dump((freq, bigr), open(f'{W}/tables/hawwiki_counts.pkl', 'wb'))
print('content pages:', npages, ' tokens:', sum(freq.values()), ' types:', len(freq))
print(freq.most_common(40))
