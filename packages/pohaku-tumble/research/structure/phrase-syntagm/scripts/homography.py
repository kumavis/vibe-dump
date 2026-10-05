"""Homography / polysemy of the units that would sit on blocks in a phrase frame.
For each head and each modifier column (shared by >=3 heads, stable level): number of
Wiktionary etymologies (homographs), and number of senses; POLLEX: number of distinct
protoforms the Hawaiian form reflects (P&E spelling).  Writes ../tables/homography.tsv"""
import json, csv, os, collections
import common as C, lex
HERE = os.path.dirname(os.path.abspath(__file__))
T = os.path.join(HERE, '..', 'tables')
ety = collections.defaultdict(set); senses = collections.Counter()
for line in open(f'{C.CACHE}/kaikki-haw.jsonl', encoding='utf-8'):
    e = json.loads(line)
    if e['word'][:1].isupper():
        continue
    w = C.norm(e['word'])
    if e.get('pos') in ('name', 'character'):
        continue
    ety[w].add(e.get('etymology_number', 1))
    senses[w] += len(e.get('senses', []))
P, _ = lex.pollex()
cols = list(csv.DictReader(open(os.path.join(T, 'columns_stable.tsv')), delimiter='\t'))
summ = list(csv.DictReader(open(os.path.join(T, 'paradigm_summary.tsv')), delimiter='\t'))
heads = [r['head'] for r in summ]
mods = [r['modifier'] for r in cols if int(r['n_heads']) >= 3]
out = []
for kind, ws in (('head', heads), ('modifier', mods)):
    for w in ws:
        protos = {r['proto'] for r in P.get(w, [])}
        out.append((kind, w, len(ety.get(w, [])), senses.get(w, 0), len(protos)))
with open(os.path.join(T, 'homography.tsv'), 'w') as f:
    f.write('slot\tform\twikt_etymologies\twikt_senses\tpollex_protoforms\n')
    for o in out:
        f.write('\t'.join(map(str, o)) + '\n')
for kind in ('head', 'modifier'):
    rs = [o for o in out if o[0] == kind]
    inW = [o for o in rs if o[2]]
    print(kind, len(rs), 'in W', len(inW), '; >=2 etymologies', sum(1 for o in inW if o[2] >= 2),
          '; >=2 POLLEX protoforms', sum(1 for o in rs if o[4] >= 2),
          '; mean senses', round(sum(o[3] for o in inW) / len(inW), 1))
    print('   homographs:', [(o[1], o[2], o[4]) for o in rs if o[2] >= 2 or o[4] >= 2])
