"""How a cross-language 'tumble' (Hawaiian word <-> its cognate in another language) would behave.
For each POLLEX row: Hawaiian reflex vs first strict cognate in each language (same proto, same unit count).
- identical: same segment string in the common alphabet (no visible change)
- differs only by regular correspondences (every position predicted by the modal correspondence table)
- differs irregularly
Also: gloss overlap (crude: share a content word >3 letters after lowercasing) to estimate 'same meaning'."""
import collections, json, re
from common import *
d = load_pollex()
MOD = {  # modal reflexes from correspondences.tsv (PPN+PNP rows)
 'Hawaiian': {'p':'p','t':'k','k':'ʔ','q':'','m':'m','n':'n','ŋ':'n','f':'h','s':'h','h':'','w':'w','l':'l','r':'l','':''},
 'Maori':    {'p':'p','t':'t','k':'k','q':'','m':'m','n':'n','ŋ':'ŋ','f':'f|h','s':'h','h':'','w':'w','l':'r','r':'r','':''},
 'Tahitian': {'p':'p','t':'t','k':'ʔ|','q':'','m':'m','n':'n','ŋ':'ʔ|','f':'f|h','s':'h','h':'','w':'v','l':'r','r':'r','':''},
 'Samoan':   {'p':'p','t':'t','k':'ʔ','q':'','m':'m','n':'n','ŋ':'ŋ','f':'f','s':'s','h':'','w':'v','l':'l','r':'l','':''},
 'Tongan':   {'p':'p','t':'t','k':'k','q':'ʔ','m':'m','n':'n','ŋ':'ŋ','f':'f','s':'h','h':'h','w':'v','l':'l','r':'','':''},
}
STOP = set('the and with that this from used have been into which when name kind also form like very make made other part'.split())
def words(g): return {w for w in re.findall(r'[a-z]{4,}', g.lower()) if w not in STOP}
res = {}
for L in ['Maori', 'Tahitian', 'Samoan', 'Tongan']:
    c = collections.Counter(); seen = set()
    for x in d:
        if x['level'] not in ('PPN', 'PNP'):  # PPN-level only, so all 5 languages are expected to have reflexes
            continue
        pu = clean_strict(x['proto_ng'], 'proto')
        hu = None
        for f in x['haw_raw'].split(','):
            u = clean_strict(f.strip(), 'Hawaiian')
            if u and pu and len(u) == len(pu): hu = u; break
        if not hu: continue
        cu = None; cg = ''
        for f, g in x['cognates'][L]:
            u = clean_strict(f, L)
            if u and len(u) == len(pu): cu = u; cg = g; break
        if not cu or x['pollex_id'] in seen: continue
        seen.add(x['pollex_id'])
        c['pairs'] += 1
        hs = ''.join(o + v for o, v in hu); cs = ''.join(o + v for o, v in cu)
        if hs == cs: c['identical'] += 1
        else:
            reg = all((ro in MOD[L][po].split('|')) and (ho == MOD['Hawaiian'][po]) and hv == pv == rv
                      for (po, pv), (ho, hv), (ro, rv) in zip(pu, hu, cu))
            c['regular difference' if reg else 'irregular difference'] += 1
        if words(x['haw_gloss']) & words(cg): c['gloss overlap'] += 1
    res[L] = c
for L, c in res.items():
    n = c['pairs']
    print(f"{L}: {n} PPN/PNP etyma with strict Hawaiian+{L} reflexes; identical {c['identical']} ({100*c['identical']/n:.0f}%), "
          f"regular difference {c['regular difference']} ({100*c['regular difference']/n:.0f}%), irregular {c['irregular difference']} ({100*c['irregular difference']/n:.0f}%); "
          f"English-gloss word overlap {c['gloss overlap']} ({100*c['gloss overlap']/n:.0f}%)")
json.dump({L: dict(c) for L, c in res.items()}, open(f'{OUT}/cognate_frame.json', 'w'), indent=1)
