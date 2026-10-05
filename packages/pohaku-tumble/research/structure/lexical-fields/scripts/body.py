#!/usr/bin/env python3
"""Body-part field: (1) extension network coded from Wiktionary + POLLEX(P&E) senses;
(2) the limb frame [part] x [lima | wāwae] (Andrews-Parker 1922 headwords/examples);
(3) kua- landscape series and wao- zones (Malo 1903)."""
from lex import *
import csv, collections, re
out = []
def P_(*a):
    s = ' '.join(str(x) for x in a); print(s); out.append(s)

# hand coding of the NON-body senses printed by the lookup (see NOTES §6.1).  H = separate etymon in POLLEX (homograph).
CODE = {
 'poʻo':    {'LAND': 'summit', 'PERSON': 'director', 'H': 'cavity (*poko)'},
 'maka':    {'PLANT': 'bud', 'PERSON': 'beloved one', 'ARTIFACT': 'mesh of net; blade, point', 'H': 'raw (*mata 2)'},
 'ihu':     {'ANIMAL': 'snout, beak, trunk', 'ARTIFACT': 'prow of a boat'},
 'waha':    {'SPACE': 'opening', 'H': 'carry on back (*waha 2)'},
 'lae':     {'LAND': 'headland, cape, point'},
 'alo':     {'SPACE': 'front; presence', 'ARTIFACT': 'upper surface of a bowl', 'ORIENT': 'leeward'},
 'kua':     {'SPACE': 'rear', 'ORIENT': 'windward', 'LAND': 'ridge (kua-hiwi, kua-lono: Malo)', 'H': 'chop (*tua)'},
 'lima':    {'NUMBER': 'five'},
 'wāwae':   {},
 'piko':    {'LAND': 'summit; border of land', 'PLANT': 'leaf-vein joint', 'ARTIFACT': 'end of rope; door thatch', 'PERSON': 'relation', 'SENSITIVE': 'genitals; umbilical cord'},
 'naʻau':   {'MIND': 'mind, heart, feelings'},
 'puʻuwai': {},
 'ʻāʻī':    {},
 'poʻohiwi': {},
 'kino':    {'PERSON': 'person, self', 'ARTIFACT': 'hull; body of a text', 'SPACE': 'main portion'},
 'ʻōpū':    {'MIND': 'disposition'},
 'niho':    {'ANIMAL': 'tusk, beak, claw', 'ARTIFACT': 'ivory'},
 'nuku':    {'ANIMAL': 'snout, beak', 'LAND': 'mouth of harbour', 'MIND': 'scold, rant'},
 'pepeiao': {'PLANT': 'cotyledon, stipule', 'ARTIFACT': 'dumpling', 'BODY2': 'heart valve'},
 'hulu':    {'ANIMAL': 'fur, feather', 'PERSON': 'esteemed older relative; precious', 'H': 'cloth (*sulu)'},
 'iwi':     {'PLANT': 'core of pandanus key'},
 'ʻili':    {'PLANT': 'peel, bark', 'ARTIFACT': 'hide, leather', 'SPACE': 'surface', 'LAND': 'land division (ʻili ʻāina)'},
 'kuli':    {'H': 'deaf (*tuli)'},
 'kuʻekuʻe': {},
 'manamana': {'PLANT': 'branches', 'ANIMAL': 'claws', 'SPACE': 'rays'},
 'alelo':   {'MIND': 'language'},
 'koko':    {'H': 'Euphorbia (*toto 2)'},
 'ʻiʻo':    {'PERSON': 'relative', 'MIND': 'essence; true, genuine', 'PLANT': 'grain of wood'},
 'kapuaʻi': {'NUMBER': 'foot (measure)', 'ANIMAL': 'paw', 'SPACE': 'footprint'},
 'ake':     {'MIND': 'yearn, desire'},
 'hope':    {'SPACE': 'rear, aft (body sense lost; PEP *sope buttocks)', 'TIME': 'after, last', 'PERSON': 'younger'},
}
dom = collections.Counter()
P_('## 1. extension network (coded)')
with open(OUT + '/body_extensions.tsv', 'w') as f:
    w = csv.writer(f, delimiter='\t')
    w.writerow(['term', 'C', 'in POLLEX', 'domains', 'senses'])
    for t, d in CODE.items():
        doms = [k for k in d if k != 'H']
        for k in doms:
            dom[k] += 1
        row = [t, count(t), int(bool(pollex(t))), ','.join(doms) or '-', '; '.join('%s=%s' % kv for kv in d.items())]
        w.writerow(row); P_('\t'.join(map(str, row)))
n = len(CODE)
P_('terms coded:', n, '| with >=1 extension:', sum(1 for d in CODE.values() if any(k != 'H' for k in d)),
   '| with a homograph:', sum(1 for d in CODE.values() if 'H' in d))
P_('domain counts:', dict(dom.most_common()))

P_('\n## 2. limb frame [part] x [lima | wāwae]  (Andrews-Parker 1922)')
LIMB = [('manamana', 'finger', 'toes'), ('kuʻekuʻe', 'elbow', 'heel; ankle joints'), ('poho', 'palm, hollow of the hand', 'hollow of the foot'), ('kupeʻe', 'bracelet', 'anklet')]
with open(OUT + '/body_limb_frame.tsv', 'w') as f:
    w = csv.writer(f, delimiter='\t')
    w.writerow(['part', '+ lima', '+ wāwae', 'A: X+lima', 'A: X+wawae', 'C: X lima', 'C: X wāwae', 'POLLEX(part)'])
    for p, a, b in LIMB:
        s = strip(p)
        A1 = len(andrews(s + 'lima')) or ('ex' if s + ' lima' in re.sub(r'\s+', ' ', open(CACHE + '/andrews-parker1922.txt').read().lower()) else 0)
        A2 = len(andrews(s + 'wawae')) or ('ex' if s + ' wawae' in re.sub(r'\s+', ' ', open(CACHE + '/andrews-parker1922.txt').read().lower()) else 0)
        row = [p, a, b, A1, A2, phrase(p + ' lima'), phrase(p + ' wāwae'), pgloss(p)[:80]]
        w.writerow(row); P_('\t'.join(map(str, row)))

P_('\n## 3. kua- landscape series (Malo 1903 ch. on land) and wao- zones')
for t in ['kuahiwi', 'kualono', 'kuamauna', 'kuahea', 'kualapa', 'kuamoʻo', 'kuapā', 'wao akua', 'wao kanaka', 'wao nahele', 'waonahele', 'wao maukele', 'wao ʻeiwa']:
    P_(t, 'C=', count(t) if ' ' not in t else phrase(t), '| A=', len(andrews(t)), '| W:', wgloss(t, 3)[:80], '| P:', pgloss(t)[:80])
open(OUT + '/body_report.txt', 'w').write('\n'.join(out))
