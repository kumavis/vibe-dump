"""Andrews-Parker 1922 'joined forms': headwords HX where H is one of the heads and
X (>= 2 letters) is itself an Andrews headword, and the syllabified pronunciation
has a syllable break after H (so hale|pule, not hal|epule).  Andrews writes no
okina/kahako, so H and X are matched on bare letters (hale = hale; la = lā/la/laʻa...).
For each joined form we then look for the same pair in modern sources:
  hawwiki spaced (H X), hawwiki solid (HX), any spelling with diacritics matched
  by bare letters; Wiktionary; POLLEX; the 905 reviews.
Writes ../tables/andrews_joined.tsv and prints a per-head summary."""
import re, os, collections, pickle
import common as C, lex, corpus_pages

HERE = os.path.dirname(os.path.abspath(__file__))
T = os.path.join(HERE, '..', 'tables')
HEADS = '''hale wai lau kumu hua ala mea kanaka wahi la po laau aina moku manu ia kai mauna olelo pua
keiki wahine kane poe makua aha lumi palapala puke kula hana oihana aupuni kino lima maka poo ahi ua mele
hula waa wa manawa ili papa pae hoku ohana lahui kahua luna kii hui'''.split()
A = lex.andrews()
W, Wd = lex.wikt()
P, _ = lex.pollex()
R = {lex.bare(r['word']): r for r in lex.reviews()}
Wb = collections.defaultdict(set)
for w in list(W) + list(Wd):
    Wb[lex.bare(w)].add(w)
Pb = collections.defaultdict(set)
for w in P:
    Pb[lex.bare(w)].add(w)

keep, st = corpus_pages.load()
uni_b = collections.Counter()      # bare solid token -> count
bi_b = collections.Counter()       # bare 'h x' -> count
for pi, s in keep:
    toks = [lex.bare(t) for t, _ in s]
    for i, t in enumerate(toks):
        uni_b[t] += 1
        if i + 1 < len(toks):
            bi_b[(t, toks[i + 1])] += 1


def syll_break(pron, h):
    """does the Andrews pronunciation have a syllable boundary right after h?"""
    p = re.sub(r"[^a-z\-]", '', pron.lower().replace("'", ''))
    sy = [x for x in p.split('-') if x]
    acc = ''
    for x in sy:
        acc += x
        if acc == h:
            return True
        if len(acc) > len(h):
            return False
    return False


rows = []
for hw, ents in A.items():
    for h in HEADS:
        if hw.startswith(h) and len(hw) - len(h) >= 2:
            x = hw[len(h):]
            if x not in A:
                continue
            if not any(syll_break(e[0], h) for e in ents):
                continue
            rows.append(dict(head=h, joined=hw, mod=x, pos=ents[0][1],
                             hawwiki_spaced=bi_b[(h, x)], hawwiki_solid=uni_b[hw],
                             W=','.join(sorted(Wb.get(hw, []))), P=','.join(sorted(Pb.get(hw, []))),
                             R=R[hw]['verdict'] if hw in R else ''))
with open(os.path.join(T, 'andrews_joined.tsv'), 'w') as f:
    ks = list(rows[0].keys())
    f.write('\t'.join(ks) + '\n')
    for r in sorted(rows, key=lambda r: (r['head'], r['joined'])):
        f.write('\t'.join(str(r[k]) for k in ks) + '\n')
by = collections.defaultdict(list)
for r in rows:
    by[r['head']].append(r)
print('Andrews joined forms (head + headword, syllable break at head):', len(rows))
tot = collections.Counter()
print('head\tjoined\tin_hawwiki_spaced\tin_hawwiki_solid\tboth\tneither\tW\tP')
for h in HEADS:
    rs = by.get(h, [])
    sp = sum(1 for r in rs if r['hawwiki_spaced'] and not r['hawwiki_solid'])
    so = sum(1 for r in rs if r['hawwiki_solid'] and not r['hawwiki_spaced'])
    bo = sum(1 for r in rs if r['hawwiki_solid'] and r['hawwiki_spaced'])
    ne = sum(1 for r in rs if not r['hawwiki_solid'] and not r['hawwiki_spaced'])
    w = sum(1 for r in rs if r['W']); p = sum(1 for r in rs if r['P'])
    tot.update(dict(joined=len(rs), spaced=sp, solid=so, both=bo, neither=ne, W=w, P=p))
    print(f'{h}\t{len(rs)}\t{sp}\t{so}\t{bo}\t{ne}\t{w}\t{p}')
print('TOTAL', dict(tot))

# precision proxy: does Andrews' own etymology bracket analyse the word as H + X?
import json
AJ = json.load(open(f'{C.CACHE}/andrews.json'))
br = collections.defaultdict(list)
for e in AJ:
    br[e['headword']].append(e)
print('\nhead\tjoined\twith_bracket\tbracket_names_head_first\tshare')
agg = collections.Counter()
for h in HEADS:
    rs = by.get(h, [])
    wb = [r for r in rs if r['joined'] in br]
    ok = [r for r in wb if any((e.get('parts') or [''])[0] == h for e in br[r['joined']])]
    agg.update(dict(joined=len(rs), with_bracket=len(wb), ok=len(ok)))
    if rs:
        print(f"{h}\t{len(rs)}\t{len(wb)}\t{len(ok)}\t{(len(ok)/len(wb)) if wb else float('nan'):.2f}")
print('ALL', dict(agg))
