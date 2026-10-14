"""Tally manual semantic codes (tables/codes_*.tsv) with Wilson 95% intervals, split by pair source."""
import csv, math
from collections import Counter, defaultdict
from common import *

def wilson(k, n, z=1.96):
    if n == 0: return (0, 0)
    p = k / n; d = 1 + z*z/n; c = p + z*z/(2*n); h = z*math.sqrt(p*(1-p)/n + z*z/(4*n*n))
    return ((c - h)/d, (c + h)/d)
def pct(k, n):
    lo, hi = wilson(k, n); return f'{k}/{n} = {k/n:.0%} [{lo:.0%}–{hi:.0%}]' if n else '0/0'
out = []
def say(*a):
    s = ' '.join(str(x) for x in a); print(s); out.append(s)

# ---------------- hoʻo-
hp = {(r['derived'], r['base']): r for r in csv.DictReader(open(f'{W}/tables/hoo_pairs.tsv'), delimiter='\t')}
hc = list(csv.DictReader(open(f'{W}/tables/codes_hoo.tsv'), delimiter='\t'))
for r in hc:
    r['src'] = 'curated' if hp[(r['derived'], r['base'])]['src_wikt_analysis'] == '1' else 'formal'
say('== hoʻo- sample (n=%d, seeded random from %d attested pairs)' % (len(hc), len(hp)))
for src in ('curated', 'formal', 'all'):
    s = [r for r in hc if src == 'all' or r['src'] == src]
    sp = sum(r['value'] == 'SPUR' for r in s)
    say(f'  {src}: spurious {pct(sp, len(s))}')
gen = [r for r in hc if r['value'] != 'SPUR']
V = lambda r: r['value'].split('+')
say('  genuine pairs:', len(gen))
for lab, test in [('causative (CAUS or CAUS-N)', lambda r: 'CAUS' in V(r) or 'CAUS-N' in V(r)),
                  ('  of which factitive from noun (CAUS-N)', lambda r: 'CAUS-N' in V(r)),
                  ('simulative/pretence (SIM)', lambda r: 'SIM' in V(r)),
                  ('both CAUS and SIM senses', lambda r: 'CAUS' in V(r) and 'SIM' in V(r)),
                  ('deliberate (DELIB)', lambda r: 'DELIB' in V(r)),
                  ('verbaliser (VBL)', lambda r: 'VBL' in V(r)),
                  ('no change (SAME)', lambda r: 'SAME' in V(r)),
                  ('other related (OTHER)', lambda r: 'OTHER' in V(r)),
                  ('opaque', lambda r: 'OPAQUE' in V(r)),
                  ('one of P&E 1986 values, direct fit (R)', lambda r: V(r)[0] in ('CAUS', 'CAUS-N', 'SIM', 'DELIB', 'VBL') and r['fit'] == 'R'),
                  ('causative, direct fit (R)', lambda r: (('CAUS' in V(r)) or ('CAUS-N' in V(r))) and r['fit'] == 'R')]:
    say(f'  {lab}: {pct(sum(test(r) for r in gen), len(gen))}')
cur_n = sum(1 for r in hp.values() if r['src_wikt_analysis'] == '1'); for_n = len(hp) - cur_n
fs = [r for r in hc if r['src'] == 'formal']; f_sp = sum(r['value'] == 'SPUR' for r in fs) / len(fs)
cs = [r for r in hc if r['src'] == 'curated']; c_sp = sum(r['value'] == 'SPUR' for r in cs) / max(1, len(cs))
est_gen = cur_n * (1 - c_sp) + for_n * (1 - f_sp)
caus_share = sum(('CAUS' in V(r) or 'CAUS-N' in V(r)) and r['fit'] == 'R' for r in gen) / len(gen)
sim_share = sum('SIM' in V(r) and r['fit'] == 'R' for r in gen) / len(gen)
say(f'  estimate: genuine attested pairs ≈ {cur_n}×{1-c_sp:.2f} + {for_n}×{1-f_sp:.2f} = {est_gen:.0f}; causative series (direct fit) ≈ {est_gen*caus_share:.0f}; simulative ≈ {est_gen*sim_share:.0f}')
# base-class conditioning for SIM: human nouns
human = {'kamaliʻi', 'mikanele', 'lani', 'makua', 'kāne', 'malihini'}
hs = [r for r in gen if r['base'] in human]
say(f'  human-noun bases → SIM: {sum("SIM" in V(r) for r in hs)}/{len(hs)}; non-human bases → SIM: {sum("SIM" in V(r) for r in gen if r["base"] not in human)}/{len(gen)-len(hs)}')

# ---------------- other affixes
ac = list(csv.DictReader(open(f'{W}/tables/codes_affix.tsv'), delimiter='\t'))
say('\n== other affixes (all curated pairs coded)')
by = defaultdict(Counter)
for r in ac: by[r['affix']][r['code']] += 1
say('  affix   pairs genuine  R  SAME  P  OPAQUE SPUR/DUP   R/genuine')
rows = []
for af, c in sorted(by.items(), key=lambda x: -sum(x[1].values())):
    n = sum(c.values()); g = n - c['SPUR'] - c['DUP']
    rows.append((af, n, g, c['R'], c['SAME'], c['P'], c['OPAQUE'], c['SPUR'] + c['DUP']))
    say(f'  {af:7s} {n:4d} {g:6d} {c["R"]:3d} {c["SAME"]:4d} {c["P"]:3d} {c["OPAQUE"]:5d} {c["SPUR"]+c["DUP"]:6d}    ' + (pct(c['R'], g) if g else '-'))
small = [r for r in rows if r[0] not in ('-na',)]
g = sum(r[2] for r in small); R = sum(r[3] for r in small)
say('  all prefixes/suffixes except -na, pooled: R ' + pct(R, g))
with open(f'{W}/tables/affix_regularity.tsv', 'w') as f:
    f.write('affix\tpairs\tgenuine\tR\tSAME\tP\tOPAQUE\tSPUR_DUP\n')
    for r in rows: f.write('\t'.join(map(str, r)) + '\n')

# ---------------- reduplication
rc = list(csv.DictReader(open(f'{W}/tables/codes_redup.tsv'), delimiter='\t'))
say('\n== reduplication sample (n=%d, seeded random from attested pairs)' % len(rc))
for src, test in [('curated (Wiktionary names base)', lambda r: r['curated'] == '1'), ('formal only', lambda r: r['curated'] != '1'), ('all', lambda r: True)]:
    s = [r for r in rc if test(r)]
    c = Counter(r['value'] for r in s)
    say(f'  {src}: n={len(s)} spurious/err {pct(c["SPUR"]+c["ERR"], len(s))}; ' + ', '.join(f'{k}:{v}' for k, v in c.most_common()))
gen = [r for r in rc if r['value'] not in ('SPUR', 'ERR', 'UNGLOSSED')]
c = Counter(r['value'] for r in gen)
say('  genuine & glossed:', len(gen), dict(c))
EP = ('ITER', 'INT', 'PL')                 # Elbert & Pukui 1979: frequentative, increased action, plural action
AUS = EP + ('ATTEN', 'QUAL', 'CONV', 'NARR')  # + Austronesian categories named by Alderete & MacMillan
say('  E&P core values (iterative/intensive/plural): ' + pct(sum(r['value'] in EP for r in gen), len(gen)))
say('  …direct fit R only: ' + pct(sum(r['value'] in EP and r['fit'] == 'R' for r in gen), len(gen)))
say('  any A&M-listed value (adds attenuative, quality-from-noun, conversion, narrowing): ' + pct(sum(r['value'] in AUS for r in gen), len(gen)))
say('  …direct fit R only: ' + pct(sum(r['value'] in AUS and r['fit'] == 'R' for r in gen), len(gen)))
say('  no glossed difference (SAME): ' + pct(c['SAME'], len(gen)))
say('  opaque or naming: ' + pct(c['OPAQUE'] + c['NAME'], len(gen)))
say('  largest single value among genuine: ' + str(max(((v, k) for k, v in c.items() if k != 'SAME')))) 
open(f'{W}/tables/stats.txt', 'w').write('\n'.join(out) + '\n')
