import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
# Fetched pages and the built tables live outside git (POLLEX states no open licence):
# research/roots/.cache/pollex/, or $POLLEX_DATA.
DATA = os.environ.get('POLLEX_DATA') or os.path.join(HERE, '..', 'roots', '.cache', 'pollex')
d = json.load(open(os.path.join(DATA, 'hawaiian-reflexes.json'), encoding='utf-8'))

# (normalised Hawaiian form, expected POLLEX protoform or None if unknown)
CHECKS = [
    ('maka', '*mata'), ('wai', '*wai'), ('kai', '*tahi'), ('ahi', '*afi'), ('moku', '*motu'),
    ('ala', '*hala'), ('lani', '*lagi'), ('ao', None), ('pō', '*poo'), ('lā', '*laqaa'),
    ('one', '*qone'), ('ʻāina', None), ('kino', '*tino'), ('paʻa', '*paka'), ('hale', '*fale'),
    ('waʻa', '*waka'), ('iʻa', '*ika'), ('puaʻa', '*puaka'),
]

results = []
for haw, want in CHECKS:
    hits = [o for o in d if haw in o['haw_forms']]
    protos = [(o['proto'], o['proto_ng'], o['level'], o['pollex_id'], o['proto_gloss'], o['haw_gloss'],
               {k: len(v) for k, v in (o['cognates'] or {}).items()}) for o in hits]
    ok = None if want is None else any(o['proto'] == want for o in hits)
    results.append({'haw': haw, 'expected': want, 'match': ok, 'hits': protos})
    print(f"{haw:8} expect {str(want):8} -> {'OK' if ok else ('n/a' if ok is None else 'MISS')}")
    for p in protos:
        print('         ', p[0], p[2], p[3], '|', p[4][:45], '|', p[5][:45], '|', p[6])
json.dump(results, open(os.path.join(DATA, 'raw', 'spotcheck.json'), 'w', encoding='utf-8'),
          ensure_ascii=False, indent=1)
