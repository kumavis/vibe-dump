"""(2) Structure history left inside words: closed series whose members are attested, with their protoforms.
For each cell: Wiktionary head? (gloss), Andrews 1922 headword (unmarked spelling)?, POLLEX reflex & protoform, hawwiki count.
Writes paradigms.md."""
import json, re, unicodedata, collections
from common import *

W = json.load(open(WIKT))['heads']
A = json.load(open('roots/.cache/andrews.json'))
F = json.load(open(f'{OUT}/hawwiki_freq.json'))
P = load_pollex()

def strip(s):
    s = unicodedata.normalize('NFD', s.lower()); s = ''.join(ch for ch in s if unicodedata.category(ch) != 'Mn')
    return s.replace('ʻ', '')

# andrews.json structure probe
if isinstance(A, dict):
    akeys = A.get('entries') or A
else:
    akeys = A
andrews_heads = set()
if isinstance(akeys, list):
    for e in akeys:
        h = e.get('head') or e.get('word') or e.get('headword')
        if h: andrews_heads.add(strip(h))
elif isinstance(akeys, dict):
    for h in akeys: andrews_heads.add(strip(h))

pol = collections.defaultdict(list)
for x in P:
    for f in x['haw_forms']:
        pol[unicodedata.normalize('NFC', f.lower())].append(f"{x['proto_ng']} ({x['level']})")

def cell(w):
    w = unicodedata.normalize('NFC', w)
    g = W.get(w)
    gl = '; '.join(s for h in (g or []) for s in h['glosses'][:1])[:50] if g else ''
    return {'w': w, 'wikt': bool(g), 'gloss': gl, 'andrews': strip(w) in andrews_heads,
            'pollex': ', '.join(sorted(set(pol.get(w, []))))[:40], 'freq': F.get(w, 0)}

out = []
def table(title, rows, cols, fn, note=''):
    out.append(f'\n### {title}\n')
    if note: out.append(note + '\n')
    out.append('| | ' + ' | '.join(cols) + ' |')
    out.append('|---|' + '---|' * len(cols))
    stats = collections.Counter()
    for r in rows:
        cells = []
        for c in cols:
            w = fn(r, c)
            if not w:
                cells.append('—'); continue
            k = cell(w)
            stats['cells'] += 1; stats['wikt'] += k['wikt']; stats['andrews'] += k['andrews']; stats['pollex'] += bool(k['pollex'])
            mark = ('W' if k['wikt'] else '') + ('A' if k['andrews'] else '') + ('P' if k['pollex'] else '')
            cells.append(f"{w} [{mark or '–'}; {k['freq']}]" + (f" ‹{k['gloss']}›" if k['gloss'] else '') + (f" {k['pollex']}" if k['pollex'] else ''))
        out.append(f'| {r} | ' + ' | '.join(cells) + ' |')
    out.append(f"\ncells {stats['cells']}: Wiktionary {stats['wikt']}, Andrews {stats['andrews']}, POLLEX {stats['pollex']}  "
               "(W = Wiktionary head, A = Andrews–Parker 1922 head (unmarked), P = POLLEX/P&E reflex; number = hawwiki tokens)")
    return stats

# Possessive pronouns: initial (k-/Ø/n-) × class (a/o) × person
POSS = {('k', 'a'): ['kaʻu', 'kāu', 'kāna'], ('k', 'o'): ['koʻu', 'kou', 'kona'],
        ('', 'a'): ['aʻu', 'āu', 'āna'], ('', 'o'): ['oʻu', 'ou', 'ona'],
        ('n', 'a'): ['naʻu', 'nāu', 'nāna'], ('n', 'o'): ['noʻu', 'nou', 'nona']}
table('Singular possessives: (k- | Ø- | n-) × (a | o) × (1sg -ʻu < *-ku | 2sg -u < *-u | 3sg -na < *-na)',
      [f'{i or "Ø"}-{c}' for i, c in POSS], ['1sg', '2sg', '3sg'],
      lambda r, c: POSS[(r.split('-')[0].replace('Ø', ''), r.split('-')[1])][['1sg', '2sg', '3sg'].index(c)],
      'POLLEX: kaʻu < *te-qa-ku, koʻu < *te-o-ku, kāu < *te-qa-u, kou < *te-o-u, kāna < *te-qa-na, kona < *te-o-na; '
      'aʻu/oʻu < *-ku "1sg possessive suffix" (AN), āu/ou < *-u (PN; POc *-mu), āna/ona < *-na.')

# Non-singular pronouns: person × number
PRON = {'1 incl': ['kāua', 'kākou'], '1 excl': ['māua', 'mākou'], '2': ['ʻolua', 'ʻoukou'], '3': ['lāua', 'lākou']}
table('Non-singular pronouns: person × number (dual -ua/-lua < PN *-rua "two"; plural -kou < NP *-tou << PN *-utolu "three")',
      list(PRON), ['dual', 'plural'], lambda r, c: PRON[r][['dual', 'plural'].index(c)],
      'POLLEX notes: TAA-UA << PN *ki-taa-rua; MAA-UA << *ki-maa-rua; LAA-UA << *ki-laa-rua; KOO-LUA << *kimo-rua; '
      'TAA-TOU << *taa-utolu; MAA-TOU << *maa-utolu; LAA-TOU << *ki-laa-utolu; KOU-TOU << *kimo-utolu. '
      'PN *(ki)taa-utolu is reflected as Fijian kedatou "1st person TRIAL inclusive" (pollex.eva.mpg.de/entry/taa-utolu/).')

# Demonstratives: base × deixis
DEM = {'kē- (the one)': ['kēia', 'kēnā', 'kēlā'], 'pe-/pē- (like)': ['penei', 'pēnā', 'pēlā'], 'bare particle': ['nei', 'nā', 'lā']}
table('Demonstratives: base × deixis (near speaker | near addressee | distant)', list(DEM), ['near me', 'near you', 'yonder'],
      lambda r, c: DEM[r][['near me', 'near you', 'yonder'].index(c)],
      'POLLEX: kēia < *tee-ia, kēnā < *tee-hena, kēlā < *tee-laa (te "article" + deictic); penei < *pee-heni, pēnā < *pee-hena, '
      'pēlā < *pee-laa (*pee- "be like"); nei < *nei, nā < *naa, lā < *raa.')

# Numerals
ROOTS_N = ['kahi', 'lua', 'kolu', 'hā', 'lima', 'ono', 'hiku', 'walu', 'iwa']
PREF = ['', 'ʻe', 'ʻa', 'hoʻo', 'pā', 'kua', 'kau', 'ka']
def numform(r, c):
    p = c if c != 'bare' else ''
    w = p + r
    if p == 'hoʻo' and r[0] in 'aeiouāōū':
        w = 'hoʻ' + r
    return w
st = table('Numerals: prefix × root (1–9)', ROOTS_N, ['bare', 'ʻe', 'ʻa', 'hoʻo', 'pā', 'kua', 'kau'], numform,
           'POLLEX: kahi < *tasi, lua < *rua, kolu < *tolu, hā < *faa, lima < *lima, ono < *ono, hiku < *fitu, walu < *walu, '
           'iwa < *hiwa; ʻekahi < *te-tasi (flagged Problematic), ʻakahi < PCE *kaa-tasi, ʻa- < EP *ka(a)- "counting particle"; '
           'hoʻokahi < *faka-tasi, hoʻolua < *faka-rua; kaulua < *tau-lua; kau- < PN *tau- "prefix to numerals" (Kau/kolu).')

# plural lengthening
pl = []
for w, hs in W.items():
    for h in hs:
        for g in h['glosses']:
            m = re.match(r'plural of (\S+)', g)
            if m:
                pl.append((w, m.group(1).strip('.,;')))
out.append('\n### Plural by vowel length (Wiktionary "plural of" glosses)\n')
out.append('| plural | singular | position lengthened | POLLEX (plural) | hawwiki pl / sg |\n|---|---|---|---|---|')
for p, s in sorted(set(pl)):
    pos = ''
    sp = strip(p); ss = strip(s)
    if sp == ss and len(p) == len(s):
        diffs = [i for i, (a, b) in enumerate(zip(p, s)) if a != b]
        # syllable position from end
        if diffs:
            i = diffs[0]
            vowels_after = sum(1 for ch in strip(p[i:]) if ch in 'aeiou')
            pos = f'vowel {vowels_after} from end'
    out.append(f"| {p} | {s} | {pos or 'other'} | {', '.join(sorted(set(pol.get(p, []))))} | {F.get(p,0)} / {F.get(s,0)} |")

open(f'{OUT}/paradigms.md', 'w').write('\n'.join(out))
print('\n'.join(out))
