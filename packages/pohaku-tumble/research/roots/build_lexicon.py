"""Assemble the candidate two-root compounds for Pōhaku Tumble's option B and
write the review sheets.

Inputs (from fetch_sources.sh, extract_wiktionary.py, extract_andrews.py):
  .cache/wiktionary.json   Wiktionary headwords + root+root analyses
  .cache/andrews.json      Andrews–Parker (1922) bracketed etymologies
  .cache/hawwiki.xml       Hawaiian Wikipedia, for spellings in running text
  ../pollex/hawaiian-reflexes.json   optional: POLLEX protoforms for roots

Outputs:
  compounds.tsv            every candidate, its evidence, flags, and blank
                           columns for the Pukui & Elbert check
  roots.tsv                the root glossary those candidates draw on
  .cache/tiers/*.json      candidate lexicons the simulation runs against

Evidence for a compound (none of these is Pukui & Elbert itself):
  W   Wiktionary analyses it as root + root
  A   Andrews–Parker analyses it as root + root, and the compound is a
      Wiktionary headword, so its modern spelling is attested
  A*  Andrews–Parker only: modern spelling pieced together from the roots'
      spellings, so the ʻokina, kahakō and word break are unconfirmed
"""
import collections
import html
import json
import os
import random
import re
import unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
C = os.path.join(HERE, '.cache')
W = json.load(open(os.path.join(C, 'wiktionary.json')))
A = json.load(open(os.path.join(C, 'andrews.json')))
heads = W['heads']

LEXPOS = {'noun', 'verb', 'adj', 'adv', 'num'}
STOP = set('the a an to of in on at as for and or is be by it with from that this which his her its'.split())


def nfc(s):
    return unicodedata.normalize('NFC', s)


def strip(s):
    s = unicodedata.normalize('NFD', s.lower())
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return s.replace('ʻ', '').replace("'", '').replace('‘', '').replace('’', '')


def toks(s):
    return {x.rstrip('s') for x in re.findall(r'[a-z]+', (s or '').lower()) if x not in STOP and len(x) > 2}


def lexical(word):
    """Wiktionary homographs of `word` that are content words (not affixes, names, particles)."""
    if not word or word[:1].lower() != word[:1] or word.endswith('-'):
        return []
    return [h for h in heads.get(word, []) if h['pos'] in LEXPOS]


def senses(word):
    return [g for h in heads.get(word, []) for g in h['glosses']]


def homographs(word):
    """Distinct etymologies of a root, each with its glosses — different words that share a spelling."""
    groups = collections.OrderedDict()
    for h in lexical(word):
        groups.setdefault(h['etym'], []).extend(h['glosses'])
    return list(groups.items())


index = collections.defaultdict(list)
for w in heads:
    if lexical(w):
        index[strip(w)].append(w)


def lev(a, b):
    prev = list(range(len(b) + 1))
    for i, ca in enumerate(a, 1):
        cur = [i]
        for j, cb in enumerate(b, 1):
            cur.append(min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (ca != cb)))
        prev = cur
    return prev[-1]


# ── 1. merge Wiktionary and Andrews–Parker ────────────────────────────────

cands = {}


def add(word, parts, level, **kw):
    rec = cands.setdefault(word, {'word': word, 'parts': parts, 'evidence': [], 'notes': []})
    if level not in rec['evidence']:
        rec['evidence'].append(level)
    for k, v in kw.items():
        if v and not rec.get(k):
            rec[k] = v
    if rec['parts'] != parts:
        rec['notes'].append(f'alt split {"·".join(parts)} ({level})')


for x in W['analyses']:
    if x['kind'] != 'compound2':
        continue
    w = x['word']
    if ' ' in w or '-' in w or not w.lstrip('ʻ')[:1].islower():
        continue
    a, b = x['parts']
    if a + b != w:
        continue
    add(w, [a, b], 'W', wikt_part_glosses=x['part_glosses'])


def rank_root(part, gloss, compound_def):
    out = []
    for c in index.get(part, []):
        st = toks(' '.join(senses(c)))
        out.append((2 * len(toks(gloss) & st) + 0.25 * len(toks(compound_def) & st), c))
    out.sort(key=lambda x: -x[0])
    return out


andrews_stats = collections.Counter()
for r in A:
    if r['parse'] == 'unparsed':
        continue
    a, c = r['parts']
    hw = r['headword']
    if r['parse'] == 'nonconcat':
        # Andrews' headword OCR is often a letter off (kialiia for kialua); trust the parts
        if set(a + c) <= set('aeiouhklmnpw') and lev(hw, a + c) <= 2:
            hw = a + c
            andrews_stats['ocr repaired'] += 1
        else:
            andrews_stats['ocr unrecoverable'] += 1
            continue
    ra, rc = rank_root(a, r['part_glosses'][0], r['def']), rank_root(c, r['part_glosses'][1], r['def'])
    if not ra or not rc:
        andrews_stats['a part is not a Wiktionary content word'] += 1
        continue
    combos = [(sa + sc, wa + wc, wa, wc) for sa, wa in ra for sc, wc in rc]
    attested = sorted((cmb for cmb in combos if cmb[1] in heads), key=lambda x: -x[0])
    if attested:
        _, word, wa, wc = attested[0]
        level = 'A'
    else:
        word, wa, wc = ra[0][1] + rc[0][1], ra[0][1], rc[0][1]
        level = 'A*'
    andrews_stats[level] += 1
    add(word, [wa, wc], level, andrews=hw, andrews_ety=r['ety'], andrews_def=r['def'][:220],
        andrews_part_glosses=r['part_glosses'])


# ── 2. flags: exclusion screen, prefixes, two-word spellings ──────────────

SENSITIVE = re.compile(
    r'(\bsex|copulat|intercourse|coitus|genital|penis|vagina|vulva|clitor|testic|scrot|labia|pubic|phall|semen|sperm|menstru|'
    r'excre|fec(es|al)|faec|\bdung\b|manure|urin|defecat|\bfart|flatul|\banus\b|\banal\b|rectum|buttock|diarrh|'
    r'gonorr|syphil|venereal|prostitut|harlot|whore|adulter|fornicat|incest|\brap(e|ed|ing)\b|lewd|obscen|\blust|lasciv|masturb|sodom|'
    r'derogator|slur|offensive|vulgar|'
    r'sorcer|witchcraft|black magic|pray(ed|ing)? (to|unto) death|death.?pray|ʻanāʻanā|anaana|evil spirit|\bkill(ed|ing)? by)', re.I)


def part_glosses(r):
    """What the sources say each part means in this compound."""
    ag = r.get('andrews_part_glosses') or ['', '']
    wg = r.get('wikt_part_glosses') or ['', '']
    return [(ag[i] or '') + ' ' + (wg[i] or '') for i in (0, 1)]


def grammatical(w):
    hs = heads.get(w, [])
    return bool(hs) and not any(h['pos'] in LEXPOS for h in hs)


def is_loan(w):
    hs = lexical(w)
    return bool(hs) and all(('bor' in h['templates'] or 'bor+' in h['templates']) and 'inh' not in h['templates'] for h in hs)


def screen(rec):
    reasons = []
    for t in senses(rec['word']) + [rec.get('andrews_def', '')]:
        m = SENSITIVE.search(t or '')
        if m:
            reasons.append(f'compound: "{m.group(0)}"')
            break
    for p in rec['parts']:
        if not lexical(p):
            reasons.append(f'{p}: no content-word entry')
            continue
        for t in senses(p):
            m = SENSITIVE.search(t)
            if m:
                reasons.append(f'{p}: "{m.group(0)}"')
                break
        if is_loan(p):
            reasons.append(f'{p}: loan')
    if is_loan(rec['word']) or re.search(r'\b(Eng|Gr|Lat|Heb)\.', rec.get('andrews_ety', '')):
        reasons.append('compound is a loan')
    if grammatical(rec['word']):
        reasons.append('grammatical word')
    return reasons


# Forms Wiktionary also lists as prefixes (pā-, kā-, pō-, kai-, hoʻo-…). Several
# are real roots too (pō night, kai sea, pā enclosure), so a compound only
# counts as prefix-led when nothing in the sources glosses its first part with
# one of that root's content senses — "Po, intensive" is a prefix, "Kai, sea" a root.
PREFIXLIKE = {w.rstrip('-') for w, hs in heads.items() if any(h['pos'] == 'prefix' for h in hs)}


def prefix_led(r):
    p = r['parts'][0]
    return p in PREFIXLIKE and not (toks(part_glosses(r)[0]) & toks(' '.join(senses(p))))


for r in cands.values():
    r['screen'] = screen(r)
    r['prefix_led'] = prefix_led(r)
    r['wikt_two_word'] = ' '.join(r['parts']) in heads
    r['wikt_gloss'] = '; '.join(senses(r['word']))[:120]


# ── 3. Hawaiian Wikipedia: is the spelling used, as one word or two? ──────

xml = open(os.path.join(C, 'hawwiki.xml'), encoding='utf-8').read()
corpus = nfc(html.unescape(' '.join(re.findall(r'<text[^>]*>(.*?)</text>', xml, re.S))))
for ch in ["'", '‘', '’', 'ʼ', '`']:
    corpus = corpus.replace(ch, 'ʻ')
words = re.findall(r'[a-zA-Zāēīōūʻ]+', corpus.lower())
freq = collections.Counter(words)
bigrams = collections.Counter(zip(words, words[1:]))
for r in cands.values():
    r['hawwiki_one'] = freq[r['word']]
    r['hawwiki_two'] = bigrams[tuple(r['parts'])]


# ── 4. homographs: which root does each part of the compound mean? ────────

for r in cands.values():
    r['hom'] = []
    for i, p in enumerate(r['parts']):
        hs = homographs(p)
        if len(hs) <= 1:
            r['hom'].append(0)
            continue
        best, bs = None, 0
        for k, (_, gl) in enumerate(hs):
            s = len(toks(part_glosses(r)[i]) & toks(' '.join(gl)))
            if s > bs:
                best, bs = k, s
        r['hom'].append(best)  # None: the sources don't say which


def morpheme_parts(r):
    out = []
    for p, h in zip(r['parts'], r['hom']):
        out.append(p if len(homographs(p)) <= 1 else f'{p}#{0 if h is None else h}')
    return out


# ── 5. tiers for the simulation ───────────────────────────────────────────

allc = sorted(cands.values(), key=lambda r: r['word'])
clean = [r for r in allc if not r['screen']]
core = [r for r in clean if not r['prefix_led']]
tiers = {
    'attested-W': [r for r in core if 'W' in r['evidence']],
    'attested-WA': [r for r in core if set(r['evidence']) & {'W', 'A'}],
    'all-screened': clean,
    'core': core,
    'core-morph': [{**r, 'parts': morpheme_parts(r)} for r in core],
}
hoo = []
for x in W['analyses']:
    if x['kind'] == 'prefixed' and x['parts'][0] == 'hoʻo-' and ' ' not in x['word']:
        base = x['parts'][1]
        if x['word'] == 'hoʻo' + base and lexical(base):
            rr = {'word': x['word'], 'parts': ['hoʻo', base], 'evidence': ['W-hoʻo'], 'notes': []}
            if not screen({**rr, 'parts': [base]}):
                hoo.append(rr)
tiers['attested-WA+hoʻo'] = tiers['attested-WA'] + hoo
astar_core = [r for r in core if r['evidence'] == ['A*']]
for keep in (60, 35):
    for k in range(2):
        rnd = random.Random(100 * keep + k)
        sub = tiers['attested-WA'] + rnd.sample(astar_core, len(astar_core) * keep // 100)
        tiers[f'core-{keep}pct-r{k}'] = [{**r, 'parts': morpheme_parts(r)} for r in sub]

os.makedirs(os.path.join(C, 'tiers'), exist_ok=True)
for k, v in tiers.items():
    json.dump([{'word': r['word'], 'parts': r['parts']} for r in v],
              open(os.path.join(C, 'tiers', f'{k}.json'), 'w'), ensure_ascii=False)


# ── 6. review order: most connective first, within the core pool ─────────

first = collections.Counter(p[0] for p in (morpheme_parts(r) for r in core))
second = collections.Counter(p[1] for p in (morpheme_parts(r) for r in core))
for r in allc:
    mp = morpheme_parts(r)
    r['degree'] = first[mp[0]] - 1 + second[mp[1]] - 1 if r in core else None


def status(r):
    if r['screen']:
        return 'screened-out'
    if r not in core:
        return 'prefix-led'
    return 'candidate'


ev_order = {'W': 0, 'A': 1, 'A*': 2}
allc.sort(key=lambda r: (status(r) != 'candidate', min(ev_order[e] for e in r['evidence']),
                         -(r['degree'] or 0), -(r['hawwiki_one'] + r['hawwiki_two']), r['word']))


def gloss_of(r, i):
    p, h = r['parts'][i], r['hom'][i]
    hs = homographs(p)
    if not hs:
        return ''
    g = hs[0 if h is None else h][1]
    return ('?' if h is None and len(hs) > 1 else '') + '; '.join(g)[:48]


def tsv(v):
    return re.sub(r'[\t\n]+', ' ', str(v if v is not None else '')).strip()


cols = ['n', 'word', 'split', 'evidence', 'status', 'flags', 'degree', 'hawwiki_1w', 'hawwiki_2w',
        'root_a', 'root_b', 'wiktionary_gloss', 'andrews_1922', 'andrews_definition',
        'pe_found', 'pe_spelling', 'pe_one_or_two_words', 'pe_meaning_ok', 'review_note']
with open(os.path.join(HERE, 'compounds.tsv'), 'w', encoding='utf-8') as f:
    f.write('\t'.join(cols) + '\n')
    for n, r in enumerate(allc, 1):
        flags = list(r['screen'])
        if r['prefix_led']:
            flags.append(f'{r["parts"][0]}- is also a prefix')
        if r['wikt_two_word']:
            flags.append('Wiktionary writes it as two words')
        if any(h is None and len(homographs(p)) > 1 for p, h in zip(r['parts'], r['hom'])):
            flags.append('homograph root: sense unresolved')
        flags += r['notes']
        row = [n, r['word'], '·'.join(r['parts']), '+'.join(sorted(r['evidence'], key=ev_order.get)), status(r),
               ' | '.join(flags), r['degree'] if r['degree'] is not None else '', r['hawwiki_one'], r['hawwiki_two'],
               f'{r["parts"][0]}: {gloss_of(r, 0)}', f'{r["parts"][1]}: {gloss_of(r, 1)}', r['wikt_gloss'],
               (f'{r["andrews"]} [{r["andrews_ety"]}]' if r.get('andrews') else ''), r.get('andrews_def', '')[:140],
               '', '', '', '', '']
        f.write('\t'.join(tsv(v) for v in row) + '\n')


# ── 7. the root glossary ──────────────────────────────────────────────────

pollex = {}
pp = os.path.join(HERE, '..', 'pollex', 'hawaiian-reflexes.json')
if os.path.exists(pp):
    for x in json.load(open(pp)):
        pollex.setdefault(nfc(x.get('haw') or ''), []).append(x)

use = collections.defaultdict(lambda: [0, 0])
for r in core:
    use[r['parts'][0]][0] += 1
    use[r['parts'][1]][1] += 1
with open(os.path.join(HERE, 'roots.tsv'), 'w', encoding='utf-8') as f:
    f.write('root\tfirst\tsecond\thomographs\tglosses\tloan\tflag\tpollex\n')
    for root, (a, b) in sorted(use.items(), key=lambda x: -(x[1][0] + x[1][1])):
        hs = homographs(root)
        gl = ' ‖ '.join('; '.join(g)[:60] for _, g in hs)
        flag = next((m.group(0) for t in senses(root) for m in [SENSITIVE.search(t)] if m), '')
        px = ' ‖ '.join(sorted({f'{x.get("level", "")} {x.get("proto", "")}'.strip() for x in pollex.get(root, [])}))
        f.write('\t'.join(tsv(v) for v in [root, a, b, len(hs), gl, 'loan' if is_loan(root) else '', flag, px]) + '\n')

print('andrews:', dict(andrews_stats))
print('candidates:', len(allc), dict(collections.Counter('+'.join(sorted(r['evidence'], key=ev_order.get)) for r in allc)))
print('status:', dict(collections.Counter(status(r) for r in allc)))
for k, v in tiers.items():
    print(f'tier {k:<20} {len(v):>5}')
print('roots in core:', len(use), '| with POLLEX protoform:', sum(1 for r in use if r in pollex))
