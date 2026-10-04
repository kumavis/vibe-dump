"""POLLEX: (a) Hawaiian reflexes written as two or more words; (b) reconstructed
protoforms with an internal hyphen (a compound or phrase reconstructed for the
proto-language) and whether Pukui & Elbert's spelling (as POLLEX cites it) writes
the Hawaiian reflex as one word or two.  Writes ../tables/pollex_compounds.tsv."""
import json, re, os, collections
import common as C

OUT = os.path.join(os.path.dirname(__file__), '..', 'tables')
rows = json.load(open(f'{C.CACHE}/pollex/hawaiian-reflexes.json', encoding='utf-8'))
print('POLLEX Hawaiian reflex rows:', len(rows))
sp = [r for r in rows if ' ' in re.sub(r'\(.*?\)', '', r['haw']).strip()]
print('(a) reflex written with a space:', len(sp), 'rows;', len({C.norm(r['haw']) for r in sp}), 'distinct forms')

def proto_parts(p):
    p = p.strip().lstrip('*')
    p = re.sub(r'\(.*?\)', '', p)
    return [x for x in re.split(r'[-\s]+', p) if x]

hy = [r for r in rows if re.search(r'\w-\w', r['proto'].lstrip('*')) or ' ' in r['proto'].strip().lstrip('*')]
# exclude reduplications *kalu-kalu, *kao-kao, *kore-kore (two identical parts)
red = [r for r in hy if len(set(proto_parts(r['proto']))) == 1]
comp = [r for r in hy if len(set(proto_parts(r['proto']))) > 1]
print('(b) protoforms with internal hyphen/space:', len(hy), '; reduplications', len(red), '; multi-part', len(comp))
lvl = collections.Counter(r['level'] for r in comp)
stat = collections.Counter()
out = []
for r in comp:
    h = re.sub(r'\(.*?\)', '', r['haw']).strip()
    n = len(h.split())
    parts = proto_parts(r['proto'])
    w = 'two+' if n > 1 else 'one'
    stat[(len(parts), w)] += 1
    out.append((r['proto'], r['level'], len(parts), h, w, r['haw_gloss'][:60], r['proto_gloss'][:60]))
with open(os.path.join(OUT, 'pollex_compounds.tsv'), 'w') as f:
    f.write('proto\tlevel\tn_parts\thaw\thaw_words\thaw_gloss\tproto_gloss\n')
    for o in out:
        f.write('\t'.join(map(str, o)) + '\n')
print('   by level:', dict(lvl))
print('   (n proto parts, Hawaiian written as):', dict(stat))
two = [o for o in out if o[2] == 2]
print('   two-part protoforms:', len(two), '; Hawaiian one word', sum(o[4] == 'one' for o in two),
      '; two words', sum(o[4] == 'two+' for o in two))
print('   examples two words:', [(o[0], o[3]) for o in two if o[4] == 'two+'][:30])
print('   examples one word:', [(o[0], o[3]) for o in two if o[4] == 'one'][:30])

# --- restrict to root+root: drop parts that are (proto-)affixes or 1-2 letter forms
AFF = {'faka', 'faa', 'fa', 'aa', 'qaa', 'qa', 'ma', 'maa', 'ta', 'taa', 'fe', 'ga', 'ŋa', 'kiga', 'a', 'ia', 'na',
       'ina', 'fia', 'ka', 'ki', 'ko', 'te', 'e', 'i', 'o', 'u', 'ti', 'faki', 'ha', 'he', 'hia', 'kina', 'sia', 'tia',
       'mia', 'lia', 'ria', 'pea', 'taki', 'aki', 'faaka'}
def lexical(p):
    return p.lower() not in AFF and len(re.sub(r'[^a-zāēīōū]', '', p.lower())) >= 3
rr = [o for o in out if o[2] == 2 and all(lexical(p) for p in proto_parts(o[0]))]
print('\nroot+root two-part protoforms (both parts >=3 letters, not affixes):', len(rr))
c = collections.Counter('hyphen' if '-' in o[3] else o[4] for o in rr)
print('   Hawaiian reflex written:', dict(c))
with open(os.path.join(OUT, 'pollex_rootroot.tsv'), 'w') as f:
    f.write('proto\tlevel\thaw\twritten\thaw_gloss\tproto_gloss\n')
    for o in rr:
        f.write('\t'.join(map(str, (o[0], o[1], o[3], 'hyphen' if '-' in o[3] else o[4], o[5], o[6]))) + '\n')
# by level: older reconstructions more often solid?
bl = collections.defaultdict(collections.Counter)
for o in rr:
    bl[o[1]]['two' if o[4] == 'two+' else 'one'] += 1
print('   by level:', {k: dict(v) for k, v in bl.items()})

# stricter: also drop PPN formatives *koo-, *kaa-, *kau-, *fai-, *kolo-, *ata- , *qau- that
# behave as prefixes in many items, and require that BOTH Hawaiian parts exist as
# independent POLLEX Hawaiian forms (so the compound is still analysable today).
FORM = AFF | {'koo', 'kaa', 'kau', 'fai', 'kolo', 'ata', 'qau', 'karaa', 'kaka', 'kakala', 'koro', 'faafaa', 'aqu'}
hawforms = {C.norm(re.sub(r'\(.*?\)', '', r['haw']).strip()) for r in rows}
def split_haw(h):
    h = C.norm(h).replace('-', ' ')
    if ' ' in h:
        return h.split()[:2]
    for i in range(2, len(h) - 1):
        a, b = h[:i], h[i:]
        if a in hawforms and b in hawforms:
            return [a, b]
    return None
strict = []
for o in rr:
    parts = proto_parts(o[0])
    if any(p.lower() in FORM for p in parts):
        continue
    sp = split_haw(o[3])
    if not sp or not all(p in hawforms for p in sp):
        continue
    strict.append((o, sp))
c = collections.Counter('two+' if o[4] == 'two+' else ('hyphen' if '-' in o[3] else 'one') for o, sp in strict)
print('\nstrict root+root (no formatives; both Hawaiian parts are themselves POLLEX Hawaiian forms):', len(strict), dict(c))
print('   one-word examples:', [o[3] for o, sp in strict if o[4] == 'one'][:60])
with open(os.path.join(OUT, 'pollex_rootroot_strict.tsv'), 'w') as f:
    f.write('proto\tlevel\thaw\tparts\twritten\thaw_gloss\n')
    for o, sp in strict:
        f.write('\t'.join(map(str, (o[0], o[1], o[3], '+'.join(sp), 'hyphen' if '-' in o[3] else o[4], o[5]))) + '\n')
