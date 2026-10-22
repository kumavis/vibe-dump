# Write fronts/lines.geojson (the declared lines) and fronts/manifest.json (DATA.md §6), after build.py.
#
#   python3 -I tools/fronts/lines.py
import json, sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from paths import OUT


def line(name, ja, frm, to, coords, sources, note=None):
    p = {'name': name, 'ja': ja, 'from': frm, 'to': to, 'sources': sources}
    if note:
        p['note'] = note
    return {'type': 'Feature', 'properties': p, 'geometry': {'type': 'LineString', 'coordinates': coords}}


LINES = [
    line("Japan's planned perimeter", {'kanji': '第一段作戦の攻略範囲', 'romaji': 'Daiichidan sakusen no kōryaku han\'i', 'verify': True},
         '1941-12-07', '1942-06-04',
         [[156.5, 50.8], [167.8, 19.6], [172.6, 8.4], [174.8, -0.8], [160.0, -6.4], [152.0, -8.2], [141.0, -10.6], [127.0, -11.2], [116.0, -10.6],
          [105.0, -8.6], [97.0, -3.0], [94.2, 5.0], [92.2, 10.0], [92.3, 14.0], [94.6, 16.6], [97.6, 20.2], [103.0, 21.2], [110.0, 21.6], [114.2, 22.3]],
         [{'id': 'morton-1962', 'where': 'Map 1, "Approximate limit of objective area", December 1941'}],
         'The objective area of the first operations as the Green Books draw it: the Kurils, Wake, the Marshalls and the Gilberts, the Bismarcks, New Guinea, the Indies, Malaya, Burma and Hong Kong. Schematic; the Japanese name is a description, not a quotation, and wants a reader of the plans.'),
    line('the Absolute National Defence Zone', {'kanji': '絶対国防圏', 'romaji': 'Zettai kokubōken'},
         '1943-09-30', '1944-07-18',
         [[156.5, 50.8], [150.0, 40.0], [143.4, 27.0], [146.6, 16.2], [151.0, 10.5], [153.4, 7.4], [150.0, 3.0], [144.0, -0.8], [141.0, -2.4],
          [140.6, -5.0], [139.4, -8.2], [133.0, -9.4], [127.0, -10.4], [122.0, -10.8], [116.0, -10.4], [106.0, -8.6], [98.0, -3.4], [94.6, 2.6],
          [92.5, 7.0], [92.0, 12.0], [93.0, 17.0], [93.2, 20.5]],
         [{'id': 'morton-1962', 'where': 'Maps 9 and 14, Japan\'s national defence zone'}],
         'Decided at the Imperial Conference of 30 September 1943: the Kurils, the Bonins, the Marianas and the Carolines, western New Guinea, the Banda Sea, the Indies and Burma. It is shown until Tōjō Hideki\'s cabinet falls after the loss of Saipan.'),
    line('the 16th parallel', {'kanji': '北緯16度線', 'romaji': 'Hokui jūroku-do sen'},
         '1945-09-02', '1945-09-03', [[104.9, 16.0], [108.5, 16.0]],
         [{'id': 'go1-1945', 'where': 'paragraph 1 (a) and (c)'}],
         'General Order No. 1: Japanese forces in French Indochina north of the line surrender to Chiang Kai-shek, south of it to South East Asia Command.'),
    line('the 38th parallel', {'kanji': '北緯38度線', 'romaji': 'Hokui sanjūhachi-do sen'},
         '1945-09-02', '1945-09-03', [[124.6, 38.0], [128.8, 38.0]],
         [{'id': 'go1-1945', 'where': 'paragraph 1 (b) and (e)'}],
         'General Order No. 1: Japanese forces in Korea north of the line surrender to the Soviet Far East command, south of it to the US Army Forces, Pacific.'),
]

WHERE = {
    '1941-12-06': ([{'id': 'morton-1962', 'where': 'Map 1, The Japanese Plan for War, December 1941'}, {'id': 'atlas-battle-fronts-1945', 'where': 'p. 4, the period ending 1 July 1943: occupied China'}],
                   'The eve of the war: Japan with Korea, Taiwan, Karafuto and Manchukuo; occupied China drawn from the Atlas\'s first page of July 1943, which is the nearest public-domain map of that front; French Indochina garrisoned under the agreements with Vichy; Thailand neutral. Schematic.'),
    '1942-05-08': ([{'id': 'morton-1962', 'where': 'Map I, The Japanese Offensive, December 1941 – May 1942'}, {'id': 'atlas-battle-fronts-1945', 'where': 'p. 4: occupied China'}],
                   'The end of the first offensive, the day the Coral Sea battle ends: Malaya, Burma, the Indies and Luzon held; Mindanao and the Visayas contested until the surrenders of May; Dutch New Guinea and Portuguese Timor contested; Thailand allied with Japan. Schematic.'),
    '1942-09-15': ([{'id': 'morton-1962', 'where': 'Maps I and 9'}, {'id': 'milner-1957', 'where': 'Map II, the Japanese advance on Port Moresby'}, {'id': 'atlas-battle-fronts-1945', 'where': 'p. 4: occupied China'}],
                   'The high-water mark: the Kokoda Track at Ioribaiwa, Guadalcanal contested, the Aleutians and the islands of the central Pacific held. Schematic.'),
    '1943-11-01': ([{'id': 'atlas-battle-fronts-1945', 'where': 'p. 20, the period ending 1 November 1943'},
                    {'id': 'zimmerman-1949', 'where': 'p. 2: the Resident Commissioner removed to Malaita in May 1942'}],
                   'Traced from the Atlas page for the second half of October 1943 by its colours (enemy-held white, Allied pink, neutral grey), registered to Natural Earth\'s coast. '
                   'Where the trace misreads the page, the record stands: New Ireland, inside the page\'s white, is held; Malaita, where the British Resident Commissioner moved in May 1942 '
                   '(Zimmerman, The Guadalcanal Campaign), is Allied, though the edge of the page\'s Allied sea crosses it.'),
    '1944-08-15': ([{'id': 'atlas-battle-fronts-1945', 'where': 'p. 58, the period ending 15 August 1944'}],
                   'Traced from the Atlas page for the first half of August 1944: the Marianas lost, New Guinea west to Sansapor, the Ichi-gō offensive in China. '
                   'Where the trace misreads the page, the record stands: New Ireland, the coast from Wewak to the Sepik and the railway south of Changsha to Hengyang, which fell on 8 August, '
                   'are held, as the page\'s own white, and its black of the period\'s gains at Hengyang, show.'),
    '1945-01-15': ([{'id': 'atlas-battle-fronts-1945', 'where': 'p. 78, the period ending 15 January 1945'}, {'id': 'smith-1963', 'where': 'Map 1'}],
                   'Traced from the Atlas page for the first half of January 1945: Leyte and Mindoro, the landing at Lingayen Gulf, the corridor through China. '
                   'Where the trace misreads the page, the record stands: Bougainville, inside the page\'s white, is held and cut off, as Smith\'s Triumph in the Philippines draws it, '
                   'less the Torokina perimeter, which is drawn schematically.'),
    '1945-07-01': ([{'id': 'atlas-battle-fronts-1945', 'where': 'p. 98, the period to 1 July 1945'}],
                   'Traced from the Atlas page to 1 July 1945: Okinawa ended, Borneo landings, Burma retaken, Indochina held outright since the coup of 9 March 1945. '
                   'Where the trace misreads the page, the record stands: New Ireland, inside the page\'s white, is held.'),
    '1945-09-02': ([{'id': 'go1-1945', 'where': 'paragraph 1 (a)–(e)'}, {'id': 'atlas-battle-fronts-1945', 'where': 'p. 100, the period to 1 August 1945'}],
                   'The surrender: General Order No. 1\'s zones laid over the land Japan still held on the Atlas\'s page to 1 August 1945, Manchuria, Karafuto and the Kurils as the Soviet forces had taken them, the 16th and 38th parallels dividing Indochina and Korea. The zones are drawn by territory and parallel, so schematic; where the order leaves the split between South East Asia Command and the Australian forces to be arranged, Sumatra and Java go to the first and Borneo and the islands east to the second, as the surrenders were taken. New Ireland, held to the surrender inside the page\'s white, goes to the Australian forces.'),
}

if __name__ == '__main__':
    fc = {'type': 'FeatureCollection', 'features': LINES}
    json.dump(fc, open(OUT + 'lines.geojson', 'w'), ensure_ascii=False, indent=1)
    kfs = ['1941-12-06', '1942-05-08', '1942-09-15', '1943-11-01', '1944-08-15', '1945-01-15', '1945-07-01', '1945-09-02']
    man = {'keyframes': [], 'lines': 'fronts/lines.geojson',
           'method': ('Land of 2,500 km² and more (Natural Earth 1:50m), on a 0.1-degree grid. Japan\'s states are assigned by territory, '
                      'today\'s admin-0 borders standing in for those of the 1940s, with Manchukuo and Tibet drawn by hand. From 1943-11-01 '
                      'the Atlas page\'s colours say who held each cell (enemy-held white, Allied pink and deep red, neutral grey, enemy '
                      'gains black), the page registered to Natural Earth\'s coast by a cubic fit to local coastline matches (about 2 px, '
                      '8 km, residual). The smaller islands are left to places.json\'s held intervals. Perimeters on the Atlas keyframes '
                      'are the page\'s white sea where it meets the pink, away from land and the page\'s frame. Where the trace misreads the page (a narrow island or a '
                      'thin coast whose cells take the colour of the sea round it), the record\'s state is laid over it, schematic, with its sources (each keyframe\'s note).')}
    for k in kfs:
        src, note = WHERE[k]
        man['keyframes'].append({'id': k, 'date': k, 'file': f'fronts/{k}.geojson', 'sources': src + [{'id': 'natural-earth', 'where': '1:50m land and admin-0 countries, for the coast and the borders'}], 'note': note})
    json.dump(man, open(OUT + 'manifest.json', 'w'), ensure_ascii=False, indent=1)
    print('lines', len(LINES), 'keyframes', len(kfs))
