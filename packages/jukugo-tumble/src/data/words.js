// Two-kanji compounds (熟語, jukugo), one per line:
//
//   <kanji> <hiragana reading> <english gloss…> <field>
//
// The field is the semantic neighbourhood a word belongs to, and picks which of
// the eight floor diagrams it wires itself to when nothing else claims it:
//
//   n nature 自然   p people 人   t time 時   l place 場
//   m motion 動     h mind 心     w word 言   o thing 物
//
// The list is grown in clusters around common characters on purpose: a word
// only animates if another word in here shares one of its characters in the
// same position, so 火山 can tumble into 火花, 火星, 火口… and from 火星 on to
// 水星, 木星, 金星. The more a character recurs, the more ways a pair can turn.

export const WORDS = `
火山 かざん volcano n
火花 ひばな spark n
花火 はなび fireworks o
火星 かせい Mars n
水星 すいせい Mercury n
木星 もくせい Jupiter n
金星 きんせい Venus n
土星 どせい Saturn n
流星 りゅうせい meteor n
星空 ほしぞら starry sky n
星座 せいざ constellation n
衛星 えいせい satellite o
惑星 わくせい planet n
明星 みょうじょう morning star n
星雲 せいうん nebula n
火口 かこう crater n
火力 かりょく firepower o
火事 かじ blaze o
消火 しょうか firefighting m
点火 てんか ignition m
出火 しゅっか outbreak of fire m
火曜 かよう Tuesday t
水曜 すいよう Wednesday t
木曜 もくよう Thursday t
金曜 きんよう Friday t
土曜 どよう Saturday t
日曜 にちよう Sunday t
月曜 げつよう Monday t
曜日 ようび day of the week t
山道 やまみち mountain path l
登山 とざん climbing m
山水 さんすい landscape n
山林 さんりん mountain forest n
山頂 さんちょう summit l
山川 さんせん mountains and rivers n
雪山 ゆきやま snowy peak n
氷山 ひょうざん iceberg n
本山 ほんざん head temple l
山脈 さんみゃく mountain range n
山門 さんもん temple gate l
山村 さんそん mountain village l
山間 さんかん among the hills l
山河 さんが hills and rivers n
山男 やまおとこ mountain man p
冬山 ふゆやま winter mountain n
花見 はなみ blossom viewing t
花瓶 かびん vase o
花粉 かふん pollen n
開花 かいか blooming n
花束 はなたば bouquet o
草花 くさばな wildflowers n
花園 はなぞの flower garden l
花道 はなみち runway l
生花 せいか fresh flowers n
造花 ぞうか artificial flower o
花鳥 かちょう flowers and birds n
花屋 はなや florist l
花形 はながた star of the show p
水道 すいどう water main o
水平 すいへい horizontal h
水田 すいでん rice paddy l
水車 すいしゃ waterwheel o
水泳 すいえい swimming m
雨水 あまみず rainwater n
海水 かいすい seawater n
水力 すいりょく water power o
水面 すいめん water surface n
香水 こうすい perfume o
水色 みずいろ pale blue o
水中 すいちゅう underwater l
水分 すいぶん moisture n
水銀 すいぎん quicksilver o
水門 すいもん floodgate l
水鳥 みずとり waterfowl n
水草 みずくさ water plant n
水上 すいじょう on the water l
水都 すいと city of water l
流水 りゅうすい running water n
氷水 こおりみず ice water o
道路 どうろ road l
鉄道 てつどう railway o
歩道 ほどう sidewalk l
書道 しょどう calligraphy w
茶道 さどう tea ceremony h
柔道 じゅうどう judo m
剣道 けんどう kendo m
武道 ぶどう martial arts m
道具 どうぐ tool o
報道 ほうどう news coverage w
道場 どうじょう dojo l
片道 かたみち one way m
近道 ちかみち shortcut l
夜道 よみち night road l
赤道 せきどう equator l
坂道 さかみち hill road l
国道 こくどう highway l
神道 しんとう Shinto h
道徳 どうとく morals h
人道 じんどう humanity h
王道 おうどう royal road h
林道 りんどう forest road l
道中 どうちゅう on the road m
道楽 どうらく pastime h
電車 でんしゃ train o
電話 でんわ telephone o
電気 でんき electricity o
電力 でんりょく electric power o
電子 でんし electron o
電池 でんち battery o
電球 でんきゅう light bulb o
発電 はつでん power generation m
停電 ていでん power outage o
電線 でんせん power line o
電波 でんぱ radio wave o
電報 でんぽう telegram w
充電 じゅうでん charging m
電光 でんこう lightning flash n
電動 でんどう electric-powered o
電流 でんりゅう electric current o
感電 かんでん electric shock m
車道 しゃどう roadway l
汽車 きしゃ steam train o
列車 れっしゃ railway train o
発車 はっしゃ departure m
停車 ていしゃ stopping m
下車 げしゃ getting off m
車窓 しゃそう train window o
車輪 しゃりん wheel o
風車 ふうしゃ windmill o
馬車 ばしゃ carriage o
車内 しゃない inside the car l
新車 しんしゃ new car o
車体 しゃたい car body o
車線 しゃせん lane l
会話 かいわ conversation w
話題 わだい topic w
神話 しんわ myth w
童話 どうわ fairy tale w
昔話 むかしばなし folk tale w
対話 たいわ dialogue w
世話 せわ looking after p
通話 つうわ phone call w
手話 しゅわ sign language w
実話 じつわ true story w
会社 かいしゃ company p
会議 かいぎ meeting p
社会 しゃかい society p
大会 たいかい tournament p
機会 きかい opportunity t
再会 さいかい reunion p
会場 かいじょう venue l
会員 かいいん member p
教会 きょうかい church l
都会 とかい big city l
会長 かいちょう chairperson p
国会 こっかい parliament l
面会 めんかい visit p
学会 がっかい learned society p
茶会 ちゃかい tea gathering p
入会 にゅうかい joining a club m
会見 かいけん press conference w
神社 じんじゃ shrine l
社長 しゃちょう company president p
本社 ほんしゃ head office l
社員 しゃいん employee p
入社 にゅうしゃ joining a firm m
出社 しゅっしゃ going to work m
支社 ししゃ branch office l
社内 しゃない in-house l
女神 めがみ goddess p
精神 せいしん spirit h
神秘 しんぴ mystery h
神経 しんけい nerve h
風神 ふうじん wind god p
雷神 らいじん thunder god p
死神 しにがみ grim reaper p
神聖 しんせい sanctity h
人生 じんせい life t
人間 にんげん human being p
人口 じんこう population p
人気 にんき popularity h
大人 おとな adult p
名人 めいじん master p
友人 ゆうじん friend p
美人 びじん beauty p
人物 じんぶつ figure p
人形 にんぎょう doll o
人工 じんこう artificial o
他人 たにん stranger p
個人 こじん individual p
本人 ほんにん the person themself p
恋人 こいびと sweetheart p
老人 ろうじん elder p
詩人 しじん poet p
旅人 たびびと traveller p
新人 しんじん newcomer p
人体 じんたい human body p
人類 じんるい humankind p
人影 ひとかげ silhouette p
人力 じんりき human power o
人命 じんめい human life h
人情 にんじょう human kindness h
人魚 にんぎょ mermaid p
村人 むらびと villager p
茶人 ちゃじん tea master p
町人 ちょうにん townsfolk p
鉄人 てつじん iron man p
学生 がくせい student p
先生 せんせい teacher p
生活 せいかつ daily life t
生命 せいめい life h
生物 せいぶつ organism n
発生 はっせい outbreak m
誕生 たんじょう birth t
一生 いっしょう lifetime t
野生 やせい wild n
生徒 せいと pupil p
写生 しゃせい sketching w
生死 せいし life and death h
新生 しんせい rebirth t
生家 せいか birthplace l
運命 うんめい fate h
命令 めいれい command w
使命 しめい mission h
寿命 じゅみょう lifespan t
革命 かくめい revolution m
命名 めいめい naming w
宿命 しゅくめい destiny h
運動 うんどう exercise m
運転 うんてん driving m
幸運 こううん good luck h
運河 うんが canal l
運送 うんそう shipping m
運行 うんこう service m
不運 ふうん bad luck h
海運 かいうん sea freight m
動物 どうぶつ animal n
自動 じどう automatic o
行動 こうどう action m
活動 かつどう activity m
動画 どうが video o
感動 かんどう being moved h
移動 いどう moving m
振動 しんどう vibration m
動作 どうさ movement m
動力 どうりょく motive power o
鼓動 こどう heartbeat m
動詞 どうし verb w
不動 ふどう immovable h
言動 げんどう words and deeds m
波動 はどう wave motion n
物語 ものがたり tale w
植物 しょくぶつ plant n
建物 たてもの building l
荷物 にもつ luggage o
着物 きもの kimono o
果物 くだもの fruit o
見物 けんぶつ sightseeing m
物理 ぶつり physics h
宝物 たからもの treasure o
本物 ほんもの the real thing o
名物 めいぶつ local specialty o
物体 ぶったい object o
物音 ものおと a sound o
怪物 かいぶつ monster p
書物 しょもつ books o
鉱物 こうぶつ mineral n
万物 ばんぶつ all creation n
食物 しょくもつ food o
金物 かなもの hardware o
青物 あおもの greens o
言語 げんご language w
英語 えいご English w
国語 こくご national language w
単語 たんご word w
敬語 けいご honorifics w
用語 ようご term w
語学 ごがく language study w
古語 こご archaic word w
新語 しんご neologism w
語源 ごげん etymology w
口語 こうご colloquial speech w
落語 らくご rakugo w
熟語 じゅくご compound word w
標語 ひょうご slogan w
私語 しご whispering w
言葉 ことば words w
発言 はつげん remark w
方言 ほうげん dialect w
予言 よげん prophecy w
名言 めいげん famous saying w
伝言 でんごん message w
無言 むごん silence w
宣言 せんげん declaration w
助言 じょげん advice w
証言 しょうげん testimony w
紅葉 こうよう autumn leaves n
落葉 らくよう falling leaves n
葉書 はがき postcard o
若葉 わかば young leaves n
青葉 あおば green leaves n
枯葉 かれは dead leaves n
葉月 はづき eighth month t
茶葉 ちゃば tea leaves o
辞書 じしょ dictionary w
読書 どくしょ reading w
図書 としょ books w
書店 しょてん bookshop l
書類 しょるい documents w
文書 ぶんしょ document w
聖書 せいしょ Bible w
清書 せいしょ fair copy w
書斎 しょさい study l
書名 しょめい book title w
秘書 ひしょ secretary p
書記 しょき clerk p
古書 こしょ old book w
書画 しょが brush and painting w
読者 どくしゃ reader p
音読 おんどく reading aloud w
朗読 ろうどく recitation w
愛読 あいどく favourite reading w
解読 かいどく decoding w
速読 そくどく speed reading w
黙読 もくどく silent reading w
読点 とうてん comma w
文字 もじ letter w
文学 ぶんがく literature w
文化 ぶんか culture h
作文 さくぶん essay w
文明 ぶんめい civilization h
文章 ぶんしょう prose w
天文 てんもん astronomy n
注文 ちゅうもん order w
論文 ろんぶん thesis w
本文 ほんぶん body text w
文法 ぶんぽう grammar w
漢文 かんぶん classical Chinese w
原文 げんぶん original text w
例文 れいぶん example sentence w
呪文 じゅもん spell w
文通 ぶんつう pen-palling w
文楽 ぶんらく bunraku w
漢字 かんじ kanji w
数字 すうじ numeral w
赤字 あかじ deficit o
黒字 くろじ surplus o
名字 みょうじ surname w
習字 しゅうじ penmanship w
字幕 じまく subtitles w
活字 かつじ movable type o
十字 じゅうじ cross o
誤字 ごじ typo w
太字 ふとじ bold type w
点字 てんじ braille w
字体 じたい typeface w
字画 じかく stroke count w
漢方 かんぽう herbal medicine o
漢詩 かんし Chinese poem w
大学 だいがく university l
学校 がっこう school l
科学 かがく science h
数学 すうがく mathematics h
化学 かがく chemistry h
留学 りゅうがく study abroad m
入学 にゅうがく enrolment m
学者 がくしゃ scholar p
学問 がくもん scholarship h
見学 けんがく field trip m
哲学 てつがく philosophy h
医学 いがく medicine h
学習 がくしゅう learning h
学年 がくねん school year t
学園 がくえん academy l
光学 こうがく optics h
工学 こうがく engineering h
美学 びがく aesthetics h
独学 どくがく self-study h
学力 がくりょく scholastic ability h
学窓 がくそう school days t
大雨 おおあめ downpour n
大切 たいせつ precious h
大事 だいじ important h
大地 だいち the earth n
大陸 たいりく continent l
大工 だいく carpenter p
拡大 かくだい enlargement m
最大 さいだい maximum h
大空 おおぞら the heavens n
大海 たいかい open sea n
大声 おおごえ loud voice w
大使 たいし ambassador p
大木 たいぼく great tree n
大仏 だいぶつ great Buddha l
巨大 きょだい gigantic h
大根 だいこん daikon o
大気 たいき atmosphere n
大雪 おおゆき heavy snow n
大火 たいか great fire n
大河 たいが great river n
大波 おおなみ big wave n
大家 おおや landlord p
大王 だいおう great king p
大橋 おおはし great bridge l
大男 おおおとこ giant p
天気 てんき weather n
元気 げんき vigour h
空気 くうき air n
病気 びょうき illness h
気分 きぶん mood h
勇気 ゆうき courage h
本気 ほんき earnestness h
気候 きこう climate n
湯気 ゆげ steam n
気温 きおん temperature n
気配 けはい presence h
平気 へいき composure h
陽気 ようき cheerfulness h
短気 たんき short temper h
気力 きりょく willpower h
蒸気 じょうき vapour n
気体 きたい gas o
気流 きりゅう air current n
色気 いろけ allure h
気味 きみ a touch of h
天国 てんごく heaven l
天才 てんさい genius p
天使 てんし angel p
天井 てんじょう ceiling l
天地 てんち heaven and earth n
雨天 うてん rainy weather n
晴天 せいてん clear sky n
天下 てんか the whole realm l
天体 てんたい celestial body n
天然 てんねん natural n
天空 てんくう firmament n
青天 せいてん blue sky n
天守 てんしゅ castle keep l
天女 てんにょ celestial maiden p
天馬 てんま pegasus n
天窓 てんまど skylight o
楽天 らくてん optimism h
空港 くうこう airport l
空間 くうかん space l
青空 あおぞら blue sky n
夜空 よぞら night sky n
空白 くうはく blank h
空中 くうちゅう midair l
空想 くうそう daydream h
航空 こうくう aviation o
上空 じょうくう the sky above l
空腹 くうふく hunger h
空手 からて karate m
真空 しんくう vacuum n
空席 くうせき empty seat o
秋空 あきぞら autumn sky n
冬空 ふゆぞら winter sky n
時空 じくう space-time n
日本 にほん Japan l
今日 きょう today t
毎日 まいにち every day t
日記 にっき diary w
休日 きゅうじつ day off t
日光 にっこう sunlight n
朝日 あさひ morning sun n
夕日 ゆうひ evening sun n
日中 にっちゅう daytime t
明日 あした tomorrow t
昨日 きのう yesterday t
平日 へいじつ weekday t
祝日 しゅくじつ holiday t
月日 つきひ the passing days t
日食 にっしょく solar eclipse n
日陰 ひかげ shade n
先日 せんじつ the other day t
元日 がんじつ New Year's Day t
日常 にちじょう everyday life t
日時 にちじ date and time t
本日 ほんじつ this very day t
来日 らいにち visit to Japan m
西日 にしび westering sun n
夏日 なつび hot day t
冬日 ふゆび frosty day t
日米 にちべい Japan and the US l
満月 まんげつ full moon n
新月 しんげつ new moon n
正月 しょうがつ New Year t
月光 げっこう moonlight n
今月 こんげつ this month t
来月 らいげつ next month t
先月 せんげつ last month t
毎月 まいつき every month t
月見 つきみ moon viewing t
年月 ねんげつ the years t
月面 げつめん lunar surface l
名月 めいげつ harvest moon n
半月 はんげつ half moon n
月夜 つきよ moonlit night t
月食 げっしょく lunar eclipse n
月下 げっか under the moon n
光線 こうせん light ray n
観光 かんこう sightseeing m
光景 こうけい spectacle n
発光 はっこう glow n
光速 こうそく speed of light n
栄光 えいこう glory h
光年 こうねん light-year n
逆光 ぎゃっこう backlight n
光明 こうみょう ray of hope h
雷光 らいこう lightning n
光子 こうし photon n
説明 せつめい explanation w
発明 はつめい invention o
透明 とうめい transparent h
照明 しょうめい lighting o
証明 しょうめい proof w
不明 ふめい unknown h
明暗 めいあん light and shade h
明白 めいはく obvious h
今年 ことし this year t
去年 きょねん last year t
来年 らいねん next year t
毎年 まいとし every year t
新年 しんねん new year t
少年 しょうねん boy p
青年 せいねん young adult p
千年 せんねん millennium t
晩年 ばんねん late life t
中年 ちゅうねん middle age t
年代 ねんだい era t
年中 ねんじゅう all year round t
年間 ねんかん a year's span t
年金 ねんきん pension o
今夜 こんや tonight t
今朝 けさ this morning t
今度 こんど next time t
今回 こんかい this time t
今後 こんご from now on t
古今 ここん old and new t
深夜 しんや dead of night t
夜景 やけい night view l
夜中 よなか midnight t
夜行 やこう night travel m
昨夜 さくや last night t
前夜 ぜんや the night before t
徹夜 てつや all-nighter t
夜風 よかぜ night breeze n
夜桜 よざくら night blossoms n
白夜 びゃくや white night n
夜食 やしょく midnight snack o
夜間 やかん night hours t
夜店 よみせ night stall l
夜市 よいち night market l
台風 たいふう typhoon n
風景 ふうけい scenery n
風船 ふうせん balloon o
風呂 ふろ bath l
和風 わふう Japanese style h
洋風 ようふう Western style h
強風 きょうふう gale n
風力 ふうりょく wind power o
風鈴 ふうりん wind chime o
春風 はるかぜ spring breeze n
北風 きたかぜ north wind n
風雨 ふうう wind and rain n
風土 ふうど climate n
突風 とっぷう gust n
風習 ふうしゅう custom h
風味 ふうみ flavour h
風流 ふうりゅう refinement h
風情 ふぜい charm h
海風 うみかぜ sea breeze n
秋風 あきかぜ autumn wind n
南風 みなみかぜ south wind n
東風 こち east wind n
西風 にしかぜ west wind n
古風 こふう old-fashioned h
波風 なみかぜ discord h
梅雨 つゆ rainy season t
雨傘 あまがさ umbrella o
小雨 こさめ drizzle n
雨雲 あまぐも rain cloud n
豪雨 ごうう torrential rain n
雷雨 らいう thunderstorm n
春雨 はるさめ spring rain n
雨戸 あまど storm shutter o
雨量 うりょう rainfall n
雨音 あまおと sound of rain n
秋雨 あきさめ autumn rain n
時雨 しぐれ passing shower n
氷雨 ひさめ freezing rain n
雪国 ゆきぐに snow country l
新雪 しんせつ fresh snow n
雪原 せつげん snowfield l
吹雪 ふぶき blizzard n
初雪 はつゆき first snow n
積雪 せきせつ snow cover n
小雪 こゆき light snow n
白雪 しらゆき white snow n
雪見 ゆきみ snow viewing t
雪女 ゆきおんな snow woman p
雪男 ゆきおとこ yeti p
外国 がいこく foreign country l
国民 こくみん citizens p
国家 こっか nation-state l
中国 ちゅうごく China l
帰国 きこく homecoming m
全国 ぜんこく nationwide l
王国 おうこく kingdom l
国境 こっきょう border l
母国 ぼこく homeland l
国旗 こっき national flag o
島国 しまぐに island nation l
国土 こくど national land l
南国 なんごく southern land l
異国 いこく foreign land l
国宝 こくほう national treasure o
愛国 あいこく patriotism h
米国 べいこく America l
北国 きたぐに northern land l
国王 こくおう king p
入国 にゅうこく entry m
恋愛 れんあい romance h
愛情 あいじょう affection h
愛犬 あいけん beloved dog n
愛用 あいよう favourite use h
友愛 ゆうあい fraternity h
最愛 さいあい dearest h
愛着 あいちゃく attachment h
自愛 じあい self-care h
愛馬 あいば beloved horse n
中心 ちゅうしん centre l
安心 あんしん relief h
心配 しんぱい worry h
心理 しんり psychology h
関心 かんしん interest h
熱心 ねっしん zeal h
本心 ほんしん true intent h
心臓 しんぞう heart h
都心 としん downtown l
用心 ようじん caution h
感心 かんしん admiration h
決心 けっしん resolve h
童心 どうしん childlike heart h
心音 しんおん heartbeat h
良心 りょうしん conscience h
初心 しょしん beginner's mind h
野心 やしん ambition h
心地 ここち feeling h
真心 まごころ sincerity h
心情 しんじょう sentiment h
安全 あんぜん safety h
不安 ふあん anxiety h
平安 へいあん peace h
安定 あんてい stability h
安眠 あんみん sound sleep h
安楽 あんらく comfort h
円安 えんやす weak yen o
平和 へいわ peace h
公平 こうへい fairness h
平野 へいや plain l
平面 へいめん flat plane o
平行 へいこう parallel h
平均 へいきん average h
平凡 へいぼん ordinary h
平等 びょうどう equality h
平地 へいち flatland l
平然 へいぜん calmly h
和食 わしょく Japanese food o
和室 わしつ tatami room l
和紙 わし washi paper o
調和 ちょうわ harmony h
和服 わふく Japanese clothing o
和歌 わか waka poem w
昭和 しょうわ Shōwa era t
令和 れいわ Reiwa era t
和解 わかい reconciliation h
和音 わおん chord o
音楽 おんがく music w
発音 はつおん pronunciation w
足音 あしおと footsteps m
本音 ほんね true feelings h
騒音 そうおん noise o
録音 ろくおん recording o
音声 おんせい audio o
母音 ぼいん vowel w
子音 しいん consonant w
高音 こうおん high note o
低音 ていおん bass o
羽音 はおと whir of wings n
音色 ねいろ timbre o
無音 むおん silence h
観音 かんのん Kannon p
波音 なみおと sound of waves n
音波 おんぱ sound wave n
音感 おんかん ear for music h
楽器 がっき instrument o
楽園 らくえん paradise l
気楽 きらく ease h
娯楽 ごらく entertainment h
快楽 かいらく pleasure h
楽譜 がくふ sheet music w
声楽 せいがく vocal music w
苦楽 くらく joys and sorrows h
楽屋 がくや dressing room l
極楽 ごくらく the Pure Land l
行楽 こうらく outing m
海岸 かいがん coast l
海外 かいがい overseas l
海底 かいてい seabed l
海辺 うみべ seaside l
航海 こうかい voyage m
深海 しんかい deep sea l
海洋 かいよう ocean n
海草 かいそう seaweed n
雲海 うんかい sea of clouds n
海賊 かいぞく pirate p
海鳥 うみどり seabird n
海面 かいめん sea surface n
海図 かいず nautical chart o
海流 かいりゅう ocean current n
北海 ほっかい North Sea l
河川 かせん rivers n
川岸 かわぎし riverbank l
小川 おがわ brook n
川辺 かわべ riverside l
川原 かわら riverbed l
川魚 かわざかな river fish n
石油 せきゆ oil o
宝石 ほうせき gem o
石器 せっき stone tool o
化石 かせき fossil n
石段 いしだん stone steps l
磁石 じしゃく magnet o
石炭 せきたん coal o
岩石 がんせき rock n
石庭 せきてい rock garden l
石像 せきぞう stone statue o
隕石 いんせき meteorite n
石橋 いしばし stone bridge l
小石 こいし pebble n
石垣 いしがき stone wall l
庭石 にわいし garden stone o
木材 もくざい lumber o
木造 もくぞう wooden o
樹木 じゅもく trees n
草木 くさき plants n
木陰 こかげ shade of a tree n
並木 なみき row of trees n
植木 うえき potted plant n
木目 もくめ wood grain o
木刀 ぼくとう wooden sword o
材木 ざいもく timber o
木馬 もくば rocking horse o
木琴 もっきん xylophone o
流木 りゅうぼく driftwood n
庭木 にわき garden tree n
森林 しんりん forest n
竹林 ちくりん bamboo grove n
密林 みつりん jungle n
林業 りんぎょう forestry o
竹馬 たけうま stilts o
竹刀 しない bamboo sword o
爆竹 ばくちく firecracker o
白紙 はくし blank paper o
白鳥 はくちょう swan n
白黒 しろくろ black and white h
純白 じゅんぱく pure white h
白衣 はくい white coat o
告白 こくはく confession w
白熱 はくねつ incandescence n
白米 はくまい white rice o
白線 はくせん white line o
余白 よはく margin o
白馬 はくば white horse n
白雲 はくうん white cloud n
黒板 こくばん blackboard o
暗黒 あんこく darkness n
黒幕 くろまく mastermind p
黒点 こくてん sunspot n
黒潮 くろしお Kuroshio current n
黒船 くろふね black ships o
黒色 こくしょく black o
青春 せいしゅん youth t
青色 あおいろ blue o
青銅 せいどう bronze o
青磁 せいじ celadon o
青雲 せいうん blue clouds n
赤色 あかいろ red o
赤飯 せきはん red bean rice o
赤面 せきめん blushing h
赤土 あかつち red clay n
赤子 あかご baby p
春分 しゅんぶん spring equinox t
立春 りっしゅん first day of spring t
新春 しんしゅん the New Year t
早春 そうしゅん early spring t
晩春 ばんしゅん late spring t
春雷 しゅんらい spring thunder n
春秋 しゅんじゅう years t
夏至 げし summer solstice t
初夏 しょか early summer t
真夏 まなつ midsummer t
夏草 なつくさ summer grass n
夏服 なつふく summer clothes o
晩夏 ばんか late summer t
夏場 なつば summertime t
常夏 とこなつ endless summer t
夏雲 なつぐも summer cloud n
秋分 しゅうぶん autumn equinox t
晩秋 ばんしゅう late autumn t
初秋 しょしゅう early autumn t
立秋 りっしゅう first day of autumn t
中秋 ちゅうしゅう mid-autumn t
千秋 せんしゅう a thousand autumns t
冬至 とうじ winter solstice t
真冬 まふゆ midwinter t
初冬 しょとう early winter t
立冬 りっとう first day of winter t
冬眠 とうみん hibernation n
晩冬 ばんとう late winter t
越冬 えっとう wintering m
冬服 ふゆふく winter clothes o
冬場 ふゆば wintertime t
東京 とうきょう Tokyo l
東西 とうざい east and west l
南北 なんぼく north and south l
東洋 とうよう the East l
西洋 せいよう the West l
中東 ちゅうとう Middle East l
関東 かんとう Kantō l
関西 かんさい Kansai l
北極 ほっきょく North Pole l
南極 なんきょく South Pole l
北方 ほっぽう the north l
南方 なんぽう the south l
北上 ほくじょう heading north m
南下 なんか heading south m
東北 とうほく northeast l
京都 きょうと Kyoto l
北京 ぺきん Beijing l
上京 じょうきょう moving to the capital m
帰京 ききょう return to the capital m
南米 なんべい South America l
北米 ほくべい North America l
手紙 てがみ letter w
上手 じょうず skilful h
下手 へた clumsy h
選手 せんしゅ athlete p
歌手 かしゅ singer p
手足 てあし limbs p
拍手 はくしゅ applause m
握手 あくしゅ handshake m
相手 あいて partner p
手品 てじな magic trick m
手本 てほん model o
手帳 てちょう notebook o
助手 じょしゅ assistant p
入手 にゅうしゅ acquisition m
手首 てくび wrist p
手袋 てぶくろ glove o
手順 てじゅん procedure h
手段 しゅだん means h
名手 めいしゅ expert p
手前 てまえ this side l
素手 すで bare hands p
着手 ちゃくしゅ undertaking m
王手 おうて check m
用紙 ようし form o
紙幣 しへい banknote o
表紙 ひょうし cover o
紙面 しめん page w
色紙 しきし autograph board o
折紙 おりがみ origami o
紙袋 かみぶくろ paper bag o
型紙 かたがみ pattern paper o
半紙 はんし calligraphy paper o
目的 もくてき goal h
目標 もくひょう target h
注目 ちゅうもく attention h
科目 かもく subject w
目次 もくじ table of contents w
目前 もくぜん imminence t
目印 めじるし landmark o
面目 めんぼく honour h
題目 だいもく title w
目玉 めだま eyeball p
役目 やくめ duty h
目線 めせん gaze h
一目 ひとめ glance m
入口 いりぐち entrance l
出口 でぐち exit l
河口 かこう river mouth l
口調 くちょう tone of voice w
窓口 まどぐち service window l
悪口 わるくち slander w
口紅 くちべに lipstick o
口笛 くちぶえ whistling m
早口 はやくち fast talk w
無口 むくち taciturn h
口実 こうじつ excuse w
利口 りこう clever h
傷口 きずぐち wound p
間口 まぐち frontage l
遠足 えんそく school excursion m
満足 まんぞく satisfaction h
不足 ふそく shortage h
足元 あしもと footing l
土足 どそく shoes on m
足跡 あしあと footprint n
素足 すあし bare feet p
補足 ほそく supplement w
発足 ほっそく launch m
足首 あしくび ankle p
裸足 はだし barefoot p
蛇足 だそく superfluity w
地上 ちじょう ground level l
屋上 おくじょう rooftop l
頂上 ちょうじょう peak l
上下 じょうげ up and down l
以上 いじょう or more h
上品 じょうひん elegance h
上着 うわぎ jacket o
向上 こうじょう improvement m
上陸 じょうりく landing m
上昇 じょうしょう ascent m
上流 じょうりゅう upstream l
上司 じょうし boss p
真上 まうえ directly above l
地下 ちか underground l
以下 いか or less h
下品 げひん vulgarity h
下着 したぎ underwear o
廊下 ろうか corridor l
落下 らっか fall m
低下 ていか decline m
下流 かりゅう downstream l
下町 したまち old downtown l
部下 ぶか subordinate p
下駄 げた geta o
靴下 くつした socks o
真下 ました directly below l
門下 もんか disciple p
中央 ちゅうおう middle l
中止 ちゅうし cancellation m
集中 しゅうちゅう focus h
背中 せなか back p
途中 とちゅう halfway m
中身 なかみ contents o
夢中 むちゅう absorption h
中立 ちゅうりつ neutrality h
最中 さいちゅう the midst t
中間 ちゅうかん middle h
中庭 なかにわ courtyard l
時間 じかん time t
期間 きかん period t
瞬間 しゅんかん instant t
世間 せけん the world p
仲間 なかま companion p
間隔 かんかく interval h
居間 いま living room l
昼間 ひるま daytime t
民間 みんかん civilian p
区間 くかん section l
隙間 すきま gap o
行間 ぎょうかん between the lines w
谷間 たにま valley l
雲間 くもま break in the clouds n
時代 じだい era t
時計 とけい clock o
当時 とうじ at that time t
同時 どうじ simultaneous t
時刻 じこく time of day t
一時 いちじ a moment t
時速 じそく speed per hour h
時差 じさ time difference t
臨時 りんじ temporary t
時期 じき season t
常時 じょうじ always t
時折 ときおり now and then t
自分 じぶん oneself p
自然 しぜん nature n
自由 じゆう freedom h
自信 じしん confidence h
自身 じしん oneself p
自宅 じたく one's home l
自立 じりつ independence h
自習 じしゅう self-study h
各自 かくじ each person p
独自 どくじ original h
自転 じてん rotation m
自作 じさく homemade o
突然 とつぜん suddenly t
当然 とうぜん naturally h
偶然 ぐうぜん chance h
全然 ぜんぜん not at all h
必然 ひつぜん inevitability h
漠然 ばくぜん vaguely h
依然 いぜん still t
雑然 ざつぜん clutter h
意見 いけん opinion w
発見 はっけん discovery m
外見 がいけん appearance h
見本 みほん sample o
拝見 はいけん humble look m
一見 いっけん glance m
偏見 へんけん prejudice h
見事 みごと splendid h
下見 したみ preview m
予見 よけん foresight h
見聞 けんぶん experience h
形見 かたみ keepsake o
夢見 ゆめみ dreaming h
新聞 しんぶん newspaper w
伝聞 でんぶん hearsay w
新鮮 しんせん freshness h
最新 さいしん latest h
革新 かくしん innovation m
新品 しんぴん brand-new item o
新婚 しんこん newlyweds p
新緑 しんりょく fresh greenery n
新芽 しんめ sprout n
一新 いっしん renewal m
新米 しんまい novice p
新築 しんちく new build l
新作 しんさく new work o
新型 しんがた new model o
新茶 しんちゃ first tea o
新酒 しんしゅ new sake o
古代 こだい antiquity t
中古 ちゅうこ secondhand o
古典 こてん classic w
古都 こと ancient capital l
稽古 けいこ practice m
復古 ふっこ restoration t
古墳 こふん burial mound l
太古 たいこ ancient times t
懐古 かいこ nostalgia h
古米 こまい old rice o
朝食 ちょうしょく breakfast o
夕食 ゆうしょく dinner o
昼食 ちゅうしょく lunch o
食事 しょくじ meal o
食堂 しょくどう dining hall l
外食 がいしょく eating out m
試食 ししょく tasting m
洋食 ようしょく Western food o
主食 しゅしょく staple food o
食卓 しょくたく dining table o
給食 きゅうしょく school lunch o
断食 だんじき fasting m
間食 かんしょく snack o
食欲 しょくよく appetite h
定食 ていしょく set meal o
菜食 さいしょく vegetarian diet o
食品 しょくひん foodstuff o
草食 そうしょく herbivorous n
色彩 しきさい colour h
景色 けしき view n
黄色 きいろ yellow o
銀色 ぎんいろ silver o
金色 きんいろ gold o
茶色 ちゃいろ brown o
灰色 はいいろ grey o
特色 とくしょく characteristic h
顔色 かおいろ complexion h
原色 げんしょく primary colour o
桜色 さくらいろ cherry pink o
緑色 みどりいろ green o
七色 なないろ seven colours o
脚色 きゃくしょく dramatization w
異色 いしょく unique h
金属 きんぞく metal o
現金 げんきん cash o
料金 りょうきん fee o
金庫 きんこ safe o
黄金 おうごん gold o
税金 ぜいきん tax o
金魚 きんぎょ goldfish n
賞金 しょうきん prize money o
金貨 きんか gold coin o
預金 よきん deposit o
送金 そうきん remittance m
金髪 きんぱつ blond hair p
借金 しゃっきん debt o
代金 だいきん price o
金網 かなあみ wire mesh o
針金 はりがね wire o
銀河 ぎんが galaxy n
銀行 ぎんこう bank l
銀貨 ぎんか silver coin o
銀座 ぎんざ Ginza l
銀髪 ぎんぱつ silver hair p
銀幕 ぎんまく silver screen o
氷河 ひょうが glacier n
河原 かわら dry riverbed l
河童 かっぱ kappa p
流氷 りゅうひょう drift ice n
氷点 ひょうてん freezing point n
薄氷 はくひょう thin ice n
氷柱 つらら icicle n
製氷 せいひょう ice making o
樹氷 じゅひょう rime n
氷結 ひょうけつ freezing n
交流 こうりゅう exchange m
一流 いちりゅう first-rate h
流行 りゅうこう trend h
合流 ごうりゅう confluence m
渓流 けいりゅう mountain stream n
流儀 りゅうぎ style h
放流 ほうりゅう release m
主流 しゅりゅう mainstream h
寒流 かんりゅう cold current n
暖流 だんりゅう warm current n
雷雲 らいうん thundercloud n
暗雲 あんうん dark clouds n
積雲 せきうん cumulus n
雲母 うんも mica n
雲水 うんすい wandering monk p
落雷 らくらい lightning strike n
雷鳴 らいめい thunderclap n
地雷 じらい landmine o
魚雷 ぎょらい torpedo o
遠雷 えんらい distant thunder n
雷鳥 らいちょう ptarmigan n
波長 はちょう wavelength n
津波 つなみ tsunami n
波紋 はもん ripple n
寒波 かんぱ cold wave n
余波 よは aftermath h
荒波 あらなみ rough seas n
小波 さざなみ ripples n
半島 はんとう peninsula l
列島 れっとう archipelago l
諸島 しょとう islands l
島民 とうみん islanders p
離島 りとう remote island l
小島 こじま islet l
孤島 ことう lone island l
鉄橋 てっきょう iron bridge l
陸橋 りっきょう overpass l
桟橋 さんばし jetty l
吊橋 つりばし suspension bridge l
鉄板 てっぱん iron plate o
鉄筋 てっきん rebar o
製鉄 せいてつ ironmaking o
鉄分 てつぶん iron content n
鋼鉄 こうてつ steel o
私鉄 してつ private railway o
鉄則 てっそく ironclad rule h
鉄壁 てっぺき iron wall o
砂鉄 さてつ iron sand n
家族 かぞく family p
家庭 かてい household p
作家 さっか author p
画家 がか painter p
家具 かぐ furniture o
実家 じっか parents' home l
家事 かじ housework m
農家 のうか farmhouse l
家来 けらい retainer p
家屋 かおく house l
家賃 やちん rent o
一家 いっか household p
本家 ほんけ head family p
家紋 かもん family crest o
民家 みんか private house l
家計 かけい household budget o
町家 まちや townhouse l
部屋 へや room l
小屋 こや hut l
本屋 ほんや bookstore l
屋根 やね roof l
屋台 やたい food stall l
宿屋 やどや inn l
酒屋 さかや liquor shop l
屋外 おくがい outdoors l
屋内 おくない indoors l
魚屋 さかなや fishmonger l
茶屋 ちゃや teahouse l
母屋 おもや main house l
本店 ほんてん main store l
売店 ばいてん kiosk l
店員 てんいん shop clerk p
支店 してん branch l
開店 かいてん store opening m
閉店 へいてん closing time m
商店 しょうてん shop l
店長 てんちょう store manager p
茶店 ちゃみせ tea stall l
出店 しゅってん opening a branch m
基本 きほん basics h
本当 ほんとう truth h
絵本 えほん picture book w
本棚 ほんだな bookshelf o
本来 ほんらい originally h
本番 ほんばん the real thing t
資本 しほん capital o
根本 こんぽん root h
脚本 きゃくほん screenplay w
本能 ほんのう instinct h
標本 ひょうほん specimen o
本部 ほんぶ headquarters l
写本 しゃほん manuscript w
協力 きょうりょく cooperation m
努力 どりょく effort h
能力 のうりょく ability h
体力 たいりょく stamina h
魅力 みりょく charm h
重力 じゅうりょく gravity n
圧力 あつりょく pressure n
引力 いんりょく attraction n
視力 しりょく eyesight h
実力 じつりょく real ability h
暴力 ぼうりょく violence m
権力 けんりょく authority h
全力 ぜんりょく all one's might h
握力 あくりょく grip strength h
磁力 じりょく magnetism n
浮力 ふりょく buoyancy n
馬力 ばりき horsepower o
怪力 かいりき herculean strength h
迫力 はくりょく intensity h
出力 しゅつりょく output o
入力 にゅうりょく input o
体重 たいじゅう body weight p
体育 たいいく PE m
身体 しんたい body p
全体 ぜんたい the whole h
体験 たいけん experience h
液体 えきたい liquid o
固体 こたい solid o
体温 たいおん body temperature p
体操 たいそう gymnastics m
正体 しょうたい true identity h
立体 りったい three-dimensional o
団体 だんたい group p
体格 たいかく physique p
具体 ぐたい concreteness h
主体 しゅたい subject h
肉体 にくたい the flesh p
体内 たいない inside the body l
円形 えんけい circle o
図形 ずけい figure o
形式 けいしき form h
地形 ちけい terrain n
外形 がいけい outline o
変形 へんけい transformation m
方形 ほうけい square o
原形 げんけい original form o
象形 しょうけい pictograph w
球形 きゅうけい sphere o
形相 ぎょうそう look h
円周 えんしゅう circumference o
円盤 えんばん disc o
円柱 えんちゅう cylinder o
円満 えんまん harmony h
楕円 だえん ellipse o
半円 はんえん semicircle o
円高 えんだか strong yen o
円陣 えんじん huddle p
円滑 えんかつ smoothness h
円卓 えんたく round table o
円熟 えんじゅく maturity h
点線 てんせん dotted line o
欠点 けってん flaw h
終点 しゅうてん terminus l
頂点 ちょうてん apex l
視点 してん viewpoint h
地点 ちてん spot l
原点 げんてん origin l
焦点 しょうてん focus h
満点 まんてん perfect score h
交点 こうてん intersection o
点数 てんすう score o
弱点 じゃくてん weakness h
起点 きてん starting point l
拠点 きょてん base l
同点 どうてん tie m
要点 ようてん main point w
点検 てんけん inspection m
句点 くてん full stop w
直線 ちょくせん straight line o
曲線 きょくせん curve o
路線 ろせん route l
線路 せんろ railway track l
視線 しせん line of sight h
内線 ないせん extension o
無線 むせん wireless o
前線 ぜんせん front n
線香 せんこう incense stick o
沿線 えんせん along the line l
脱線 だっせん derailment m
斜線 しゃせん slash o
線画 せんが line drawing w
混線 こんせん crossed wires m
配線 はいせん wiring o
映画 えいが movie o
計画 けいかく plan h
絵画 かいが painting o
漫画 まんが manga w
画面 がめん screen o
版画 はんが woodblock print o
企画 きかく project h
区画 くかく plot l
画像 がぞう image o
録画 ろくが video recording o
名画 めいが masterpiece o
壁画 へきが mural o
画数 かくすう stroke count w
洋画 ようが Western painting o
写真 しゃしん photograph o
映写 えいしゃ projection m
描写 びょうしゃ depiction w
複写 ふくしゃ copy o
試写 ししゃ preview screening m
転写 てんしゃ transcription w
模写 もしゃ replica w
真実 しんじつ truth h
真剣 しんけん serious h
真珠 しんじゅ pearl o
真昼 まひる broad daylight t
純真 じゅんしん innocence h
真理 しんり truth h
真意 しんい real intention h
真横 まよこ right beside l
真顔 まがお straight face h
真似 まね imitation m
真価 しんか true worth h
悪夢 あくむ nightmare h
夢想 むそう reverie h
初夢 はつゆめ first dream of the year t
正夢 まさゆめ dream come true h
夢幻 むげん dreams and illusions h
夢路 ゆめじ dreamland l
思想 しそう thought h
感想 かんそう impression h
理想 りそう ideal h
予想 よそう forecast h
発想 はっそう idea h
回想 かいそう recollection h
連想 れんそう association h
愛想 あいそ amiability h
幻想 げんそう illusion h
構想 こうそう concept h
想像 そうぞう imagination h
瞑想 めいそう meditation h
思考 しこう thinking h
意思 いし will h
思案 しあん deliberation h
相思 そうし mutual love h
感情 かんじょう emotion h
感覚 かんかく sense h
感謝 かんしゃ gratitude h
直感 ちょっかん intuition h
共感 きょうかん empathy h
予感 よかん premonition h
敏感 びんかん sensitive h
実感 じっかん real sense h
好感 こうかん good impression h
霊感 れいかん inspiration h
五感 ごかん the five senses h
質感 しつかん texture h
量感 りょうかん volume h
情報 じょうほう information w
友情 ゆうじょう friendship h
表情 ひょうじょう expression h
事情 じじょう circumstances h
同情 どうじょう sympathy h
情熱 じょうねつ passion h
純情 じゅんじょう naivety h
旅情 りょじょう wanderlust h
苦情 くじょう complaint w
情景 じょうけい scene h
詩情 しじょう poetic feeling h
意味 いみ meaning w
注意 ちゅうい caution h
意識 いしき consciousness h
用意 ようい preparation h
意外 いがい unexpected h
得意 とくい forte h
好意 こうい goodwill h
決意 けつい determination h
熱意 ねつい enthusiasm h
敬意 けいい respect h
民意 みんい public will h
合意 ごうい agreement w
任意 にんい optional h
創意 そうい originality h
意図 いと intention h
意義 いぎ significance h
趣味 しゅみ hobby h
興味 きょうみ interest h
味方 みかた ally p
味覚 みかく taste h
正味 しょうみ net h
地味 じみ plain h
美味 びみ delicacy o
甘味 かんみ sweetness o
苦味 にがみ bitterness o
酸味 さんみ sourness o
薬味 やくみ condiment o
味噌 みそ miso o
後味 あとあじ aftertaste h
塩味 しおあじ saltiness o
旅行 りょこう travel m
行列 ぎょうれつ procession m
飛行 ひこう flight m
急行 きゅうこう express m
修行 しゅぎょう ascetic training m
行事 ぎょうじ event t
通行 つうこう passage m
歩行 ほこう walking m
進行 しんこう progress m
行方 ゆくえ whereabouts l
発行 はっこう publication w
実行 じっこう execution m
孝行 こうこう filial piety h
紀行 きこう travelogue w
直行 ちょっこう going direct m
逆行 ぎゃっこう going backward m
一行 いっこう party p
行者 ぎょうじゃ ascetic p
未来 みらい future t
将来 しょうらい prospects t
以来 いらい ever since t
往来 おうらい coming and going m
到来 とうらい arrival m
由来 ゆらい origin h
来客 らいきゃく visitor p
伝来 でんらい introduction m
来週 らいしゅう next week t
外来 がいらい imported h
元来 がんらい by nature h
来世 らいせ afterlife t
再来 さいらい return m
従来 じゅうらい conventional h
来場 らいじょう attendance m
外出 がいしゅつ going out m
出発 しゅっぱつ departure m
輸出 ゆしゅつ export m
出身 しゅっしん hometown l
出版 しゅっぱん publishing w
提出 ていしゅつ submission m
出席 しゅっせき attendance m
演出 えんしゅつ staging w
出血 しゅっけつ bleeding m
出世 しゅっせ getting ahead h
家出 いえで running away m
人出 ひとで turnout p
出場 しゅつじょう taking part m
船出 ふなで setting sail m
出現 しゅつげん appearance m
脱出 だっしゅつ escape m
出題 しゅつだい setting questions w
門出 かどで departure m
輸入 ゆにゅう import m
収入 しゅうにゅう income o
入院 にゅういん hospitalization m
加入 かにゅう joining m
入場 にゅうじょう admission m
入門 にゅうもん introduction w
記入 きにゅう filling in w
入浴 にゅうよく bathing m
侵入 しんにゅう intrusion m
入選 にゅうせん selection h
入荷 にゅうか arrival of goods m
導入 どうにゅう introduction m
突入 とつにゅう plunge m
入園 にゅうえん admission m
子供 こども child p
女子 じょし girl p
男子 だんし boy p
王子 おうじ prince p
弟子 でし disciple p
様子 ようす appearance h
調子 ちょうし condition h
椅子 いす chair o
帽子 ぼうし hat o
菓子 かし sweets o
原子 げんし atom n
分子 ぶんし molecule n
双子 ふたご twins p
子孫 しそん descendants p
扇子 せんす folding fan o
団子 だんご dumpling o
迷子 まいご lost child p
親子 おやこ parent and child p
拍子 ひょうし beat w
障子 しょうじ shoji screen o
子守 こもり babysitting p
粒子 りゅうし particle n
因子 いんし factor h
子馬 こうま foal n
女王 じょおう queen p
少女 しょうじょ girl p
彼女 かのじょ she p
女性 じょせい woman p
長女 ちょうじょ eldest daughter p
王女 おうじょ princess p
美女 びじょ beauty p
女優 じょゆう actress p
巫女 みこ shrine maiden p
魔女 まじょ witch p
乙女 おとめ maiden p
男性 だんせい man p
長男 ちょうなん eldest son p
美男 びなん handsome man p
男女 だんじょ men and women p
次男 じなん second son p
男前 おとこまえ good-looking p
王様 おうさま king p
魔王 まおう demon king p
法王 ほうおう pope p
王者 おうじゃ champion p
王座 おうざ throne o
帝王 ていおう emperor p
王冠 おうかん crown o
仁王 におう guardian kings p
王都 おうと royal capital l
野鳥 やちょう wild bird n
小鳥 ことり little bird n
鳥居 とりい torii gate l
鳥類 ちょうるい birds n
千鳥 ちどり plover n
鳥肌 とりはだ goosebumps h
稚魚 ちぎょ fry n
魚類 ぎょるい fish n
鮮魚 せんぎょ fresh fish o
魚介 ぎょかい seafood o
小魚 こざかな small fish n
魚影 ぎょえい glint of fish n
乗馬 じょうば riding m
競馬 けいば horse racing m
馬鹿 ばか fool p
名馬 めいば fine horse n
落馬 らくば fall from a horse m
出馬 しゅつば candidacy m
馬術 ばじゅつ horsemanship m
草原 そうげん grassland n
雑草 ざっそう weeds n
草履 ぞうり sandals o
牧草 ぼくそう pasture n
薬草 やくそう herb n
若草 わかくさ young grass n
草案 そうあん draft w
起草 きそう drafting w
草地 くさち meadow n
草笛 くさぶえ grass whistle o
煙草 たばこ tobacco o
七草 ななくさ seven herbs n
枯草 かれくさ dry grass n
紅茶 こうちゃ black tea o
緑茶 りょくちゃ green tea o
抹茶 まっちゃ matcha o
喫茶 きっさ tea drinking m
番茶 ばんちゃ coarse tea o
茶碗 ちゃわん rice bowl o
茶室 ちゃしつ tea room l
麦茶 むぎちゃ barley tea o
茶畑 ちゃばたけ tea field l
茶番 ちゃばん farce h
粗茶 そちゃ humble tea o
玄米 げんまい brown rice o
米粒 こめつぶ grain of rice o
欧米 おうべい the West l
精米 せいまい rice polishing o
飲酒 いんしゅ drinking m
洋酒 ようしゅ Western liquor o
禁酒 きんしゅ temperance h
甘酒 あまざけ sweet sake o
酒場 さかば tavern l
地酒 じざけ local sake o
酒造 しゅぞう brewing o
清酒 せいしゅ refined sake o
梅酒 うめしゅ plum wine o
酒杯 しゅはい sake cup o
美酒 びしゅ fine wine o
酒宴 しゅえん feast p
名刀 めいとう famous sword o
短刀 たんとう dagger o
太刀 たち long sword o
小刀 こがたな knife o
刀剣 とうけん blades o
宝刀 ほうとう treasured sword o
抜刀 ばっとう drawing a sword m
帯刀 たいとう wearing a sword m
執刀 しっとう performing surgery m
刀工 とうこう swordsmith p
刀身 とうしん blade o
専門 せんもん speciality h
校門 こうもん school gate l
正門 せいもん main gate l
名門 めいもん illustrious house h
部門 ぶもん division l
関門 かんもん barrier l
門番 もんばん gatekeeper p
仏門 ぶつもん the Buddhist path h
門限 もんげん curfew t
門前 もんぜん before the gate l
開門 かいもん opening the gate m
鬼門 きもん unlucky quarter h
一門 いちもん clan p
出窓 でまど bay window o
同窓 どうそう alumni p
窓辺 まどべ windowside l
窓際 まどぎわ by the window l
丸窓 まるまど round window o
庭園 ていえん garden l
校庭 こうてい schoolyard l
庭師 にわし gardener p
裏庭 うらにわ back garden l
箱庭 はこにわ miniature garden l
前庭 ぜんてい front garden l
公園 こうえん park l
農園 のうえん farm l
菜園 さいえん vegetable garden l
田園 でんえん countryside l
園芸 えんげい gardening m
茶園 ちゃえん tea plantation l
霊園 れいえん cemetery l
都市 とし city l
市場 いちば market l
市民 しみん citizen p
市長 しちょう mayor p
朝市 あさいち morning market l
市内 しない in the city l
市街 しがい streets l
市販 しはん off the shelf o
闇市 やみいち black market l
市立 しりつ municipal l
町長 ちょうちょう town mayor p
町内 ちょうない neighbourhood l
港町 みなとまち port town l
村長 そんちょう village head p
農村 のうそん farm village l
漁村 ぎょそん fishing village l
村民 そんみん villagers p
村里 むらざと village l
寒村 かんそん poor village l
村落 そんらく hamlet l
首都 しゅと capital l
都民 とみん Tokyoites p
都内 とない inside Tokyo l
遷都 せんと moving the capital m
都合 つごう convenience h
都庁 とちょう metropolitan office l
帝都 ていと imperial capital l
魔都 まと demon city l
`
