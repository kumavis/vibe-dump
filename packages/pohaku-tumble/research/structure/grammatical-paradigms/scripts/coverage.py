"""Per-paradigm coverage of cells in each source, from tables/attestation.tsv.
A cell counts for Wiktionary / POLLEX only if a grammatical sense/row was found
(not 'lex-only' or '—').  Output: tables/coverage.txt"""
import csv, os, collections, common
rows=list(csv.DictReader(open(os.path.join(common.HERE,'tables','attestation.tsv')),delimiter='\t'))
out=['paradigm | cells | Wiktionary gram. sense | POLLEX gram. row | hawwiki exact >=1 | hawwiki exact >=10']
by=collections.defaultdict(list)
for r in rows: by[r['paradigm']].append(r)
for p,rs in by.items():
    w=sum(1 for r in rs if r['W'] not in ('—','lex-only'))
    px=sum(1 for r in rs if r['P'] not in ('—','lex-only'))
    h1=sum(1 for r in rs if int(r['WP'])>=1); h10=sum(1 for r in rs if int(r['WP'])>=10)
    out.append(f'{p:15s} {len(rs):3d} {w:3d} {px:3d} {h1:3d} {h10:3d}')
    out.append('     missing in Wiktionary: '+', '.join(r['form'] for r in rs if r['W'] in ('—','lex-only')))
    out.append('     missing in POLLEX (keyword screen): '+', '.join(r['form'] for r in rs if r['P'] in ('—','lex-only')))
open(os.path.join(common.HERE,'tables','coverage.txt'),'w').write('\n'.join(out)+'\n')
print('\n'.join(out))
