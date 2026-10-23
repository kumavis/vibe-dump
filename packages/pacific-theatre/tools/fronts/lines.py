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
    # the prologue (ROUND-2.md §1.3; research/content-2.md): schematic, by the hand regions of build.py's PROLOGUE
    '1931-09-18': ([{'id': 'morton-1962', 'where': 'ch. II, Japanese Policy and Strategy, 1931 – July 1941'},
                    {'id': 'jm-144', 'where': 'ch. I: the rights in Manchuria (the leased territory, the railway zones, troops in the railway zones) and the chronology of the Manchurian Incident'},
                    {'id': 'peace-and-war-1943', 'where': 'ch. II, Japanese Conquest of Manchuria, 1931–1932'}],
                   'The eve of the Mukden Incident: Japan with Korea, Taiwan and Karafuto; on the mainland the Kwantung Leased Territory at the tip of the Liaotung Peninsula, '
                   'with Dairen and Port Arthur, and the zone along the South Manchuria Railway to Changchun, where Japan kept troops by treaty; the South Seas Mandate across the central Pacific. '
                   'Manchuria is China\'s. Schematic.'),
    '1932-03-01': ([{'id': 'jm-144', 'where': 'ch. I: Mukden, Changchun and Kirin occupied on 18 September 1931, Harbin on 4 February 1932, Manchukuo established on 1 March 1932, Jehol occupied from January to March 1933'},
                    {'id': 'peace-and-war-1943', 'where': 'ch. II, Japanese Conquest of Manchuria, 1931–1932'},
                    {'id': 'morton-1962', 'where': 'ch. II, Japanese Policy and Strategy, 1931 – July 1941'}],
                   'Manchukuo proclaimed: the Kwantung Army has taken Manchuria\'s cities and railways since September, and the new state is drawn with the provinces it claimed, '
                   'less Jehol, which the army occupies from January to March 1933. Schematic.'),
    '1937-12-31': ([{'id': 'jm-70', 'where': 'General Reference Maps I and II, the operations in north China, July 1937 – June 1938, and in central and south China, August 1937 – March 1939'},
                    {'id': 'jm-144', 'where': 'ch. II: the chronology of 1937'},
                    {'id': 'atlas-battle-fronts-1945', 'where': 'p. 4, the period ending 1 July 1943: the extent of occupied China, within which the earlier extent is drawn'}],
                   'The end of 1937, after the Marco Polo Bridge: Manchukuo with Jehol; the railways and cities of Hopeh and Chahar, Suiyuan to Paotow, northern Shansi to Taiyuan, '
                   'Shantung north of the Yellow River to Tsinan, and the Shanghai–Nanking–Hangchow corridor, taken from July to December as the Japanese army\'s post-war monographs date them. '
                   'Occupied China, its cities and railways, is drawn inside the extent the Atlas\'s first page gives it in 1943. Schematic.'),
    '1938-12-31': ([{'id': 'jm-144', 'where': 'ch. III, p. 42: the front at the end of 1938, and the chronology of 1938'},
                    {'id': 'jm-70', 'where': 'General Reference Maps I and II; p. 47, northern Kiangsu'},
                    {'id': 'atlas-battle-fronts-1945', 'where': 'p. 4, the period ending 1 July 1943: the extent of occupied China, within which the earlier extent is drawn'}],
                   'Hankow and Canton taken: the front at the end of 1938 as a Japanese monograph gives it, from Suiyuan down the Yellow River to Tungkwan and Kaifeng, '
                   'south along the Peiping–Hankow railway to Yochow and east by Yungsiu to Hangchow, with an arc round Canton; northern Kiangsu east of Hsuchow is not yet held. Schematic.'),
    '1940-09-30': ([{'id': 'peace-and-war-1943', 'where': 'p. 96, Japanese Penetration Into Indochina'},
                    {'id': 'morton-1962', 'where': 'ch. II: the right to occupy Tonkin Province'},
                    {'id': 'jm-70', 'where': 'pp. 62–68: Nanning, northern French Indo-China, Chekiang in April 1941'},
                    {'id': 'atlas-battle-fronts-1945', 'where': 'p. 4, the period ending 1 July 1943: occupied China'},
                    {'id': 'romanus-1953', 'where': 'Map 1, Japanese Plan, December 1941'}],
                   'Northern Indochina garrisoned: under the agreement of 22 September 1940 Japanese troops enter Tonkin and its airfields; the south of French Indochina has no Japanese troops yet. '
                   'Occupied China as on the eve of the war, less the coast south of Hangchow taken in April 1941, with the Nanning area, which Japan\'s army holds until November 1940. Schematic.'),
    '1941-07-31': ([{'id': 'peace-and-war-1943', 'where': 'p. 123, Japanese Occupation of Southern Indochina'},
                    {'id': 'morton-1962', 'where': 'ch. IV: the move into southern Indochina'},
                    {'id': 'jm-70', 'where': 'p. 69, Advance into Southern French Indo-China'},
                    {'id': 'atlas-battle-fronts-1945', 'where': 'p. 4, the period ending 1 July 1943: occupied China'},
                    {'id': 'romanus-1953', 'where': 'Map 1, Japanese Plan, December 1941'}],
                   'Southern Indochina garrisoned: from about 22 July 1941 Vichy grants Japan the right to keep troops and bases in the south, and Japanese forces move in. '
                   'Occupied China as on the eve of the war. Schematic.'),
    '1941-12-06': ([{'id': 'morton-1962', 'where': 'Map 1, The Japanese Plan for War, December 1941'}, {'id': 'atlas-battle-fronts-1945', 'where': 'p. 4, the period ending 1 July 1943: occupied China'}],
                   'The eve of the war: Japan with Korea, Taiwan, Karafuto and Manchukuo; occupied China drawn from the Atlas\'s first page of July 1943, which is the nearest public-domain map of that front; French Indochina garrisoned under the agreements with Vichy; Thailand neutral. Schematic.'),
    '1942-05-08': ([{'id': 'morton-1962', 'where': 'Map I, The Japanese Offensive, December 1941 – May 1942'}, {'id': 'atlas-battle-fronts-1945', 'where': 'p. 4: occupied China'}],
                   'The end of the first offensive, the day the Coral Sea battle ends: Malaya, Burma, the Indies and Luzon held; Mindanao and the Visayas contested until the surrenders of May; Dutch New Guinea and Portuguese Timor contested; Thailand allied with Japan. Schematic.'),
    '1942-09-15': ([{'id': 'morton-1962', 'where': 'Maps I and 9'}, {'id': 'milner-1957', 'where': 'Map II, the Japanese advance on Port Moresby'}, {'id': 'atlas-battle-fronts-1945', 'where': 'p. 4: occupied China'}],
                   'The high-water mark: the Kokoda Track at Ioribaiwa, Guadalcanal contested, the Aleutians and the islands of the central Pacific held. Schematic.'),
    '1943-11-01': ([{'id': 'atlas-battle-fronts-1945', 'where': 'p. 20, the period ending 1 November 1943'},
                    {'id': 'zimmerman-1949', 'where': 'p. 2: the Resident Commissioner removed to Malaita in May 1942'}],
                   'Traced from the Atlas page for the second half of October 1943 by its colours (enemy-held white, Allied pink, neutral grey), registered to Natural Earth\'s coast. '
                   'Where the trace misreads the page, the record stands: New Ireland, inside the page\'s white, is held; so is Choiseul, inside the white with its name lettered across it; '
                   'Malaita, where the British Resident Commissioner moved in May 1942 (Zimmerman, The Guadalcanal Campaign), is Allied, though the edge of the page\'s Allied sea crosses it.'),
    '1944-08-15': ([{'id': 'atlas-battle-fronts-1945', 'where': 'p. 58, the period ending 15 August 1944'}],
                   'Traced from the Atlas page for the first half of August 1944: the Marianas lost, New Guinea west to Sansapor, the Ichi-gō offensive in China. '
                   'Where the trace misreads the page, the record stands: New Ireland, the coast from Wewak to the Sepik and the railway south of Changsha to Hengyang, which fell on 8 August, '
                   'are held, as the page\'s own white, and its black of the period\'s gains at Hengyang, show.'),
    '1945-01-15': ([{'id': 'atlas-battle-fronts-1945', 'where': 'p. 78, the period ending 15 January 1945'}, {'id': 'smith-1963', 'where': 'Map 1'}],
                   'Traced from the Atlas page for the first half of January 1945: Leyte and Mindoro, the landing at Lingayen Gulf, the corridor through China. '
                   'Where the trace misreads the page, the record stands: Bougainville, inside the page\'s white, is held and cut off, as Smith\'s Triumph in the Philippines draws it, '
                   'less the Torokina perimeter, which is drawn schematically; and the Vogelkop is held and cut off at Sorong too, where the pink of the Allied sea lane past Sansapor crosses its western tip.'),
    '1945-07-01': ([{'id': 'atlas-battle-fronts-1945', 'where': 'p. 98, the period to 1 July 1945'}],
                   'Traced from the Atlas page to 1 July 1945: Okinawa ended, Borneo landings, Burma retaken, Indochina held outright since the coup of 9 March 1945. '
                   'Where the trace misreads the page, the record stands: New Ireland, inside the page\'s white, is held, and so is the Vogelkop at Sorong, under the pink of the Allied sea lane past Sansapor.'),
    '1945-09-02': ([{'id': 'go1-1945', 'where': 'paragraph 1 (a)–(e)'}, {'id': 'atlas-battle-fronts-1945', 'where': 'p. 100, the period to 1 August 1945'}],
                   'The surrender: General Order No. 1\'s zones laid over the land Japan still held on the Atlas\'s page to 1 August 1945, Manchuria, Karafuto and the Kurils as the Soviet forces had taken them, the 16th and 38th parallels dividing Indochina and Korea. The zones are drawn by territory and parallel, so schematic; where the order leaves the split between South East Asia Command and the Australian forces to be arranged, Sumatra and Java go to the first and Borneo and the islands east to the second, as the surrenders were taken. New Ireland, held to the surrender inside the page\'s white, and the Vogelkop at Sorong, under the pink of the Allied sea lane past Sansapor, go to the Australian forces.'),
}

if __name__ == '__main__':
    fc = {'type': 'FeatureCollection', 'features': LINES}
    json.dump(fc, open(OUT + 'lines.geojson', 'w'), ensure_ascii=False, indent=1)
    kfs = ['1931-09-18', '1932-03-01', '1937-12-31', '1938-12-31', '1940-09-30', '1941-07-31', '1941-12-06', '1942-05-08', '1942-09-15', '1943-11-01', '1944-08-15', '1945-01-15', '1945-07-01', '1945-09-02']
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
