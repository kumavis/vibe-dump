import json, time, urllib.request, urllib.parse
UA = 'vibe-dump-research/1.0 (aaron@kumavis.me)'
def get(params):
    url = 'https://en.wiktionary.org/w/api.php?' + urllib.parse.urlencode(params)
    for attempt in range(6):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.load(r)
        except Exception as e:
            time.sleep(2 ** attempt)
    raise RuntimeError(url)
titles = []
cont = {}
while True:
    d = get({'action': 'query', 'list': 'categorymembers', 'cmtitle': 'Category:Hawaiian lemmas', 'cmlimit': 500, 'format': 'json', 'cmnamespace': 0, **cont})
    titles += [m['title'] for m in d['query']['categorymembers']]
    if 'continue' not in d: break
    cont = d['continue']
    time.sleep(0.5)
json.dump(titles, open('lemmas.json', 'w'), ensure_ascii=False)
print(len(titles))
