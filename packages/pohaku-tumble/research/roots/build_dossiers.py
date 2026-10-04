"""Gather, for each candidate compound, everything the reachable sources say
about it and its two roots, so a reviewer (person or agent) can judge it from
one place.

Inputs: .cache/wiktionary.json, .cache/andrews-parker1922.txt, .cache/hawwiki.xml,
compounds.tsv, ../pollex/hawaiian-reflexes.json (optional).
Output: .cache/dossiers/batch-NNN.json — candidates grouped by first root,
BATCH per file, each with:
  compound   the compounds.tsv row
  wiktionary every Wiktionary entry for the compound (pos, glosses, etymology)
  roots      per root: its homographs (id, pos, glosses, etymology) — ids match
             the "#n" sense ids in .cache/tiers/core-morph.json — plus POLLEX
             reflexes and Andrews–Parker's entries for the root
  andrews    Andrews–Parker's full entries for the compound's unmarked spelling
  hawwiki    up to 6 sentences from Hawaiian Wikipedia using it as one word,
             and up to 6 using it as two
"""
import collections
import csv
import html
import json
import os
import re
import sys
import unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
C = os.path.join(HERE, '.cache')
BATCH = int(sys.argv[1]) if len(sys.argv) > 1 else 20
LEXPOS = {'noun', 'verb', 'adj', 'adv', 'num'}

W = json.load(open(os.path.join(C, 'wiktionary.json')))
heads = W['heads']


def nfc(s):
    return unicodedata.normalize('NFC', s)


def strip(s):
    s = unicodedata.normalize('NFD', s.lower())
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return s.replace('ʻ', '').replace("'", '').replace(' ', '')


def homographs(word):
    """Same grouping as build_lexicon.homographs: one group per distinct etymology."""
    if not word or word[:1].lower() != word[:1] or word.endswith('-'):
        return []
    groups = collections.OrderedDict()
    for h in heads.get(word, []):
        if h['pos'] in LEXPOS:
            groups.setdefault(h['etym'], []).append(h)
    return [{'id': f'{word}#{i}' if len(groups) > 1 else word,
             'etymology': et[:300],
             'senses': [{'pos': h['pos'], 'glosses': h['glosses'][:12]} for h in hs]}
            for i, (et, hs) in enumerate(groups.items())]


# Andrews–Parker: every entry, keyed by its unmarked headword
text = open(os.path.join(C, 'andrews-parker1922.txt'), encoding='utf-8').read()
marks = list(re.finditer(r'(?m)^([A-Z][A-Za-z\-\']{0,30})\s+\(\s*([^)]{1,70})\)\s*[,.]?\s*([a-zA-Z]{1,5})\.', text))
andrews = collections.defaultdict(list)
for i, m in enumerate(marks):
    end = marks[i + 1].start() if i + 1 < len(marks) else len(text)
    body = re.sub(r'\s+', ' ', text[m.start():end]).strip()
    body = re.sub(r' [A-Z]{2,4} \d{2,3} [A-Z]{2,4}\b', '', body)  # running heads
    andrews[strip(m.group(1))].append(body[:700])

# Hawaiian Wikipedia sentences
xml = open(os.path.join(C, 'hawwiki.xml'), encoding='utf-8').read()
corpus = nfc(html.unescape(' '.join(re.findall(r'<text[^>]*>(.*?)</text>', xml, re.S))))
for ch in ["'", '‘', '’', 'ʼ', '`']:
    corpus = corpus.replace(ch, 'ʻ')
corpus = re.sub(r'\{\{[^{}]*\}\}|\[\[(?:[^|\]]*\|)?([^\]]*)\]\]', lambda m: m.group(1) or '', corpus)
corpus = re.sub(r'<[^>]+>|={2,}|\'{2,}', ' ', corpus)
corpus = re.sub(r'\s+', ' ', corpus)
low = corpus.lower()


def contexts(phrase, k=6):
    out = []
    for m in re.finditer(r'(?<![a-zāēīōūʻ])' + re.escape(phrase) + r'(?![a-zāēīōūʻ])', low):
        a, b = max(0, m.start() - 90), min(len(corpus), m.end() + 90)
        out.append('…' + corpus[a:b].strip() + '…')
        if len(out) >= k:
            break
    return out


pollex = collections.defaultdict(list)
pp = os.environ.get('POLLEX') or os.path.join(HERE, '..', 'pollex', 'hawaiian-reflexes.json')
if os.path.exists(pp):
    for x in json.load(open(pp)):
        pollex[nfc(x.get('haw') or '')].append({k: x.get(k) for k in ('haw_gloss', 'level', 'proto', 'proto_gloss', 'cognates')})

rows = [r for r in csv.DictReader(open(os.path.join(HERE, 'compounds.tsv')), delimiter='\t') if r['status'] == 'candidate']
rows.sort(key=lambda r: (r['split'].split('·')[0], r['split']))


def dossier(r):
    a, b = r['split'].split('·')
    return {
        'compound': {k: r[k] for k in ('word', 'split', 'evidence', 'flags', 'degree', 'hawwiki_1w', 'hawwiki_2w', 'root_a', 'root_b', 'wiktionary_gloss', 'andrews_1922', 'andrews_definition')},
        'wiktionary': [{'pos': h['pos'], 'glosses': h['glosses'], 'etymology': h['etym'][:300]} for h in heads.get(r['word'], [])],
        'roots': {p: {'homographs': homographs(p), 'pollex': pollex.get(p, [])[:6], 'andrews': andrews.get(strip(p), [])[:5]} for p in (a, b)},
        'andrews': andrews.get(strip(r['word']), [])[:4],
        'hawwiki': {'one_word': contexts(r['word']), 'two_words': contexts(f'{a} {b}')},
    }


out = os.path.join(C, 'dossiers')
os.makedirs(out, exist_ok=True)
for f in os.listdir(out):
    os.remove(os.path.join(out, f))
n = 0
for i in range(0, len(rows), BATCH):
    json.dump([dossier(r) for r in rows[i:i + BATCH]], open(os.path.join(out, f'batch-{i // BATCH:03d}.json'), 'w'), ensure_ascii=False, indent=1)
    n += 1
print(f'{len(rows)} candidates → {n} batches of ≤{BATCH} in {out}; POLLEX rows: {sum(len(v) for v in pollex.values())}')
