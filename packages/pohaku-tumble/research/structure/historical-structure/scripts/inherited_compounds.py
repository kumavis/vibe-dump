"""(3) Inherited compounds: POLLEX protoforms with internal morpheme boundaries whose Hawaiian reflex is attested
(98% of POLLEX Hawaiian rows cite Pukui & Elbert 1986, so the Hawaiian spelling is P&E's).

Classification of each hyphenated protoform (first rule that fires):
  grammatical   pronoun / possessive / demonstrative / deictic construction (gloss-based + morpheme list)
  reduplication parts identical, or a CV(V) copy of the start of the next part (*ma-mate, *sa-sake)
  affixed       a part is a known PPN affix (POLLEX affix entries + standard list)
  prefix-like   first part is a CV(V) element POLLEX also uses as a prefix (koo-, paa-, poo-, tii-, tuu-, taa-, maa-, tau-, saa-, kau-, pa-)
                -> could be root or prefix; kept separate
  compound      every part is a lexical-looking root (none of the above)
For 'compound' rows: does each part survive as a FREE Hawaiian word?  Regular Hawaiian reflex of the part is looked
up in Wiktionary heads and POLLEX Hawaiian forms (exact spelling; else ʻokina/kahakō-insensitive = 'loose').
Cross-reference with roots/compounds.tsv and the 905 reviews.
"""
import collections, csv, glob, json, re, unicodedata
from common import *

d = load_pollex()
W = json.load(open(WIKT))['heads']

def nfc(s): return unicodedata.normalize('NFC', s)
def strip(s):
    s = unicodedata.normalize('NFD', s.lower()); s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return s.replace('ʻ', '').replace(' ', '').replace('-', '').replace('·', '')

LAW = {'t': 'k', 'k': 'ʻ', 'q': '', 'h': '', 'f': 'h', 's': 'h', 'r': 'l', 'ŋ': 'n', 'v': 'w'}
MAC = {'aa': 'ā', 'ee': 'ē', 'ii': 'ī', 'oo': 'ō', 'uu': 'ū'}
def haw_reflex(p):
    s = ''.join(LAW.get(c, c) for c in p)
    for k, v in MAC.items(): s = s.replace(k, v)
    return nfc(s)

pol_forms = set(); pol_strip = set()
for x in d:
    for f in x['haw_forms']:
        pol_forms.add(nfc(f.lower())); pol_strip.add(strip(f))
w_forms = {nfc(k.lower()) for k in W}; w_strip = {strip(k) for k in W}

AFFIX_PRE = {'faka', 'faa', 'fia', 'ka', 'kaa', 'ma', 'pee', 'soko', 'soo', 'ta', 'taki', 'toko', 'tuqa', 'ŋa',
             'aa', 'qaa', 'a', 'fe', 'ko', 'te', 'tee', 't', 'ki', 'kimo', 'i'}
AFFIX_SUF = {'ŋa', 'ŋaa', 'a', 'ia', 'ki', 'fia', 'ina', 'na', 'ku', 'u', 'tou', 'ua', 'utolu', 'nei', 'hena', 'heni', 'laa',
             'hia', 'sia', 'tia', 'ŋia', 'mia', 'ria', 'kia', 'si', 'fi', 'qi', 'ŋi'}
PREFIX_LIKE = {'koo', 'paa', 'poo', 'tii', 'tuu', 'taa', 'maa', 'tau', 'saa', 'kau', 'pa', 'puu', 'fau'}
GRAM_GLOSS = re.compile(r'pronoun|possessive|demonstrative|like this|like that|this way|here,|there|article|particle', re.I)

def classify(x):
    parts = x['proto_ng'].lstrip('*').split('-')
    g = x['proto_gloss'] + ' ' + x['haw_gloss']
    if GRAM_GLOSS.search(x['proto_gloss']) or (parts[0] in {'taa', 'maa', 'laa', 'kou', 'koo'} and parts[-1] in {'tou', 'ua', 'lua'}):
        return 'grammatical'
    if len(set(parts)) == 1:
        return 'reduplication'
    for a, b in zip(parts, parts[1:]):
        if len(a) <= 3 and b.startswith(a[:2]) and a[0] == b[0] and a not in {'faka'}:
            # CV(V) copy of following root (*ma-mate, *sa-sake, *tii-tii)
            if a[:2] == b[:2]:
                return 'reduplication'
    if any(p in AFFIX_PRE for p in parts[:-1]) or any(p in AFFIX_SUF for p in parts[1:]):
        return 'affixed'
    if parts[0] in PREFIX_LIKE:
        return 'prefix-like'
    return 'compound'

# same-etymon test: the part's proto string is itself a POLLEX protoform whose Hawaiian reflex is the expected form
proto_free = collections.defaultdict(set)
for x in d:
    pn = x['proto_ng'].lstrip('*')
    if '-' not in pn.strip('-'):
        for f in x['haw_forms']:
            proto_free[pn].add(strip(re.sub(r'[/()]', '', f)))
def etymon_free(p):
    h = strip(haw_reflex(p))
    return any(h == f or (f.startswith(h) and len(f) == 2 * len(h)) for f in proto_free.get(p, ()))

def part_status(p):
    h = haw_reflex(p)
    if h in w_forms or h in pol_forms:
        return h, 'free'
    if strip(h) in w_strip or strip(h) in pol_strip:
        return h, 'loose'
    return h, 'absent'

# compounds.tsv & reviews
ctsv = list(csv.DictReader(open(COMPOUNDS), delimiter='\t'))
c_exact = {nfc(r['word']): r for r in ctsv}
c_strip = collections.defaultdict(list)
for r in ctsv: c_strip[strip(r['word'])].append(r)
reviews = {}
for f in sorted(glob.glob(REVIEW_GLOB)):
    for r in json.load(open(f)):
        reviews[nfc(r['word'])] = r
for f in sorted(glob.glob('review/(scratch) adjudicated/*.json')):
    for r in json.load(open(f)):
        if nfc(r['word']) in reviews:
            reviews[nfc(r['word'])]['adjudicated'] = r['verdict']

rows = []
seen = set()
for x in d:
    if '-' not in x['proto_ng'].strip('*-'):
        continue
    cls = classify(x)
    raw = x['haw_raw'].split(',')[0].strip()
    clean = re.sub(r'[/()]', '', raw)
    haw = nfc(to_okina(clean).lower())
    key = (x['pollex_id'], haw)
    if key in seen: continue
    seen.add(key)
    parts = x['proto_ng'].lstrip('*').split('-')
    ps = [part_status(p) for p in parts]
    # compounds.tsv match
    m = c_exact.get(haw)
    how = 'exact' if m else ''
    if not m and c_strip.get(strip(haw)):
        m = c_strip[strip(haw)][0]; how = 'loose'
    rv = reviews.get(nfc(m['word'])) if m else None
    rows.append({
        'class': cls, 'pollex_id': x['pollex_id'], 'proto': x['proto_ng'], 'level': x['level'],
        'haw_PE': nfc(to_okina(raw)), 'haw_norm': haw, 'two_words': ' ' in raw.strip(),
        'parts_haw': ' + '.join(f'{h}({s})' for h, s in ps),
        'both_free': all(s == 'free' for h, s in ps),
        'etymon_free': all(etymon_free(p) for p in parts if p not in {'qa', 'a'}),
        'etyma_free_n': sum(etymon_free(p) for p in parts if p not in {'qa', 'a'}), 'all_present': all(s != 'absent' for h, s in ps),
        'haw_gloss': x['haw_gloss'][:70], 'proto_gloss': x['proto_gloss'][:50], 'flags': ','.join(x['haw_flags']),
        'compounds_tsv': (f"{m['word']} [{m['status']}; {m['evidence']}; deg {m['degree']}]" if m else ''), 'match': how,
        'review': (rv['verdict'] + (f"→adj {rv['adjudicated']}" if rv.get('adjudicated') else '') if rv else ''),
        'review_transparency': rv['transparency'] if rv else '',
        'review_spelling': (rv['form'] + ' / ' + rv['spelling_confidence']) if rv else '',
    })

with open(f'{OUT}/inherited_compounds.tsv', 'w') as fh:
    w = csv.DictWriter(fh, fieldnames=list(rows[0]), delimiter='\t'); w.writeheader(); w.writerows(rows)

cnt = collections.Counter(r['class'] for r in rows)
comp = [r for r in rows if r['class'] == 'compound']
pl = [r for r in rows if r['class'] == 'prefix-like']
print('rows (distinct entry × Hawaiian form):', len(rows), dict(cnt))
print('distinct POLLEX entries:', len({r['pollex_id'] for r in rows}))
for lab, S in [('compound', comp), ('prefix-like', pl)]:
    print(f'\n== {lab}: {len(S)} rows; both parts free in Hawaiian: {sum(r["both_free"] for r in S)}; '
          f'all parts present (free or loose): {sum(r["all_present"] for r in S)}; two-word P&E: {sum(r["two_words"] for r in S)}; '
          f'every part = same etymon free in POLLEX Hawaiian: {sum(r["etymon_free"] for r in S)}; at least one: {sum(r["etyma_free_n"]>0 for r in S)}')
    print('  levels:', collections.Counter(r['level'] for r in S).most_common())
    print('  in compounds.tsv:', sum(bool(r['compounds_tsv']) for r in S), collections.Counter(r['compounds_tsv'].split('[')[1].split(';')[0] if r['compounds_tsv'] else 'not in tsv' for r in S))
    print('  review verdicts:', collections.Counter(r['review'] or 'no review' for r in S))

# families: compounds sharing a first or second part (strict = etymon_free), Hawaiian forms
fam1 = collections.defaultdict(list); fam2 = collections.defaultdict(list)
for r in rows:
    if r['class'] != 'compound': continue
    parts = r['proto'].lstrip('*').split('-')
    fam1[parts[0]].append(r['haw_PE']); fam2[parts[-1]].append(r['haw_PE'])
print('\nfamilies by first part (>=2 distinct Hawaiian words):')
for k, v in sorted(fam1.items(), key=lambda kv: -len(set(kv[1]))):
    if len(set(v)) >= 2: print(f'  *{k}-: {sorted(set(v))}')
print('families by second part (>=2):')
for k, v in sorted(fam2.items(), key=lambda kv: -len(set(kv[1]))):
    if len(set(v)) >= 2: print(f'  -*{k}: {sorted(set(v))}')
json.dump({'first': {k: sorted(set(v)) for k, v in fam1.items()}, 'second': {k: sorted(set(v)) for k, v in fam2.items()}},
          open(f'{OUT}/inherited_families.json', 'w'), ensure_ascii=False, indent=1)
