// A one-word gloss for every character the word list uses: the card spells a
// compound out as its parts (火 fire + 山 mountain), and the part that changes is
// what a tumble is about. Kanji carry many senses; this is the one that most
// often explains the compounds here, not a dictionary entry.

export const KANJI = `
火 fire|山 mountain|花 flower|星 star|水 water|木 tree|金 gold|土 earth|流 flow|空 sky|
座 seat|衛 guard|惑 wander|明 bright|雲 cloud|口 mouth|力 power|事 matter|消 put out|点 point|
出 exit|曜 weekday|日 sun|月 moon|道 way|登 climb|林 grove|頂 top|川 river|雪 snow|
氷 ice|本 origin|脈 vein|門 gate|村 village|間 between|河 river|男 man|冬 winter|見 see|
瓶 jar|粉 powder|開 open|束 bundle|草 grass|園 garden|生 life|造 make|鳥 bird|屋 roof|
形 shape|平 flat|田 field|車 wheel|泳 swim|雨 rain|海 sea|面 face|香 scent|色 colour|
中 middle|分 part|銀 silver|上 above|都 capital|路 road|鉄 iron|歩 walk|書 write|茶 tea|
柔 soft|剣 sword|武 martial|具 tool|報 report|場 place|片 one side|近 near|夜 night|赤 red|
坂 slope|国 country|神 god|徳 virtue|人 person|王 king|楽 music|電 electric|話 talk|気 spirit|
子 child|池 pond|球 ball|発 emit|停 halt|線 line|波 wave|充 fill|光 light|動 move|
感 feel|汽 steam|列 row|下 below|窓 window|輪 ring|風 wind|馬 horse|内 inside|新 new|
体 body|会 meet|題 topic|童 child|昔 long ago|対 facing|世 world|通 pass|手 hand|実 real|
社 shrine|議 debate|大 big|機 chance|再 again|員 member|教 teach|長 long|学 study|入 enter|
支 branch|女 woman|精 essence|秘 secret|経 pass through|雷 thunder|死 death|聖 holy|名 name|友 friend|
美 beauty|物 thing|工 craft|他 other|個 single|恋 love|老 old|詩 poem|旅 journey|類 kind|
影 shadow|命 life|情 feeling|魚 fish|町 town|先 ahead|活 lively|誕 birth|一 one|野 field|
徒 follower|写 copy|家 house|運 carry|令 order|使 use|寿 longevity|革 leather|宿 lodge|転 turn|
幸 fortune|送 send|行 go|不 not|自 self|画 picture|移 shift|振 shake|作 make|鼓 drum|
詞 word|言 say|語 language|植 plant|建 build|荷 load|着 wear|果 fruit|理 reason|宝 treasure|
音 sound|怪 eerie|鉱 ore|万 ten thousand|食 eat|青 blue|英 brilliant|単 single|敬 respect|用 use|
古 old|源 source|落 fall|熟 ripe|標 mark|私 private|葉 leaf|方 direction|予 before|伝 convey|
無 nothing|宣 proclaim|助 help|証 proof|紅 crimson|若 young|枯 wither|辞 word|読 read|図 diagram|
店 shop|文 writing|清 pure|斎 study|記 record|者 someone|朗 clear|愛 love|解 untie|速 fast|
黙 silent|字 character|化 change|章 chapter|天 heaven|注 pour|論 argue|法 law|漢 Han|原 origin|
例 example|呪 curse|数 number|黒 black|習 learn|幕 curtain|十 ten|誤 mistake|太 thick|校 school|
科 course|留 stay|問 question|哲 wisdom|医 heal|年 year|独 alone|切 cut|地 ground|陸 land|
拡 widen|最 most|声 voice|仏 Buddha|巨 giant|根 root|橋 bridge|元 origin|病 ill|勇 brave|
候 season|湯 hot water|温 warm|配 deal out|陽 sunshine|短 short|蒸 steam|味 taste|才 talent|井 well|
晴 clear up|然 so|守 protect|港 harbour|白 white|想 imagine|航 navigate|腹 belly|真 true|席 seat|
秋 autumn|時 time|今 now|毎 every|休 rest|朝 morning|夕 evening|昨 previous|祝 celebrate|陰 shade|
常 usual|来 come|西 west|夏 summer|米 rice|満 full|正 correct|半 half|観 view|景 scenery|
栄 flourish|逆 reverse|説 explain|透 clear through|照 shine|暗 dark|去 leave|少 few|千 thousand|晩 late|
代 generation|度 degree|回 turn|後 after|深 deep|前 before|徹 pierce|桜 cherry|市 market|台 stand|
船 ship|呂 spine|和 harmony|洋 ocean|強 strong|鈴 bell|春 spring|北 north|突 thrust|南 south|
東 east|梅 plum|傘 umbrella|小 small|豪 mighty|戸 door|量 amount|吹 blow|初 first|積 pile|
外 outside|民 people|帰 return|全 whole|境 boundary|母 mother|旗 flag|島 island|異 different|犬 dog|
心 heart|安 calm|関 barrier|熱 heat|臓 organ|決 decide|良 good|定 settle|眠 sleep|円 circle|
公 public|均 even|凡 common|等 equal|室 room|紙 paper|調 tune|服 clothes|歌 song|昭 shining|
足 foot|騒 noisy|録 record|高 high|低 low|羽 feather|器 vessel|娯 amuse|快 pleasant|譜 score|
苦 bitter|極 extreme|岸 shore|底 bottom|辺 edge|賊 bandit|石 stone|油 oil|段 step|磁 magnet|
炭 charcoal|岩 rock|庭 garden|像 image|隕 fall|垣 fence|材 timber|樹 tree|並 line up|目 eye|
刀 blade|琴 koto|森 forest|竹 bamboo|密 dense|業 work|爆 burst|純 pure|衣 garment|告 tell|
余 surplus|板 board|潮 tide|銅 copper|飯 meal|立 stand|早 early|至 reach|越 cross over|京 capital|
選 choose|拍 clap|握 grip|相 mutual|品 goods|帳 notebook|首 neck|袋 bag|順 order|素 bare|
幣 currency|表 surface|折 fold|型 mould|的 target|次 next|印 seal|玉 jewel|役 role|悪 bad|
笛 flute|利 profit|傷 wound|遠 far|跡 trace|補 supplement|裸 naked|蛇 snake|以 by means of|向 face toward|
昇 rise|司 govern|廊 corridor|部 section|駄 clog|靴 shoe|央 centre|止 stop|集 gather|背 back|
途 route|身 body|夢 dream|期 period|瞬 blink|仲 relation|隔 gap|居 dwell|昼 noon|区 ward|
隙 crack|谷 valley|計 measure|当 hit|同 same|刻 carve|差 difference|臨 attend|由 reason|信 trust|
宅 home|各 each|偶 chance|必 certain|漠 vague|依 rely|雑 mixed|意 mind|拝 worship|偏 bias|
聞 hear|鮮 fresh|婚 marriage|緑 green|芽 bud|築 construct|酒 sake|典 code|稽 ponder|復 restore|
墳 tomb|懐 yearn|堂 hall|試 try|主 master|卓 table|給 supply|断 sever|欲 desire|菜 greens|
彩 hue|黄 yellow|灰 ash|特 special|顔 face|七 seven|脚 leg|属 belong|現 appear|料 fee|
庫 storehouse|税 tax|賞 prize|貨 coin|預 deposit|髪 hair|借 borrow|網 net|針 needle|薄 thin|
柱 pillar|製 manufacture|結 tie|交 mingle|合 fit|渓 ravine|儀 rite|放 release|寒 cold|暖 warm|
鳴 cry|津 harbour|紋 crest|荒 rough|諸 various|離 apart|孤 solitary|桟 jetty|吊 hang|筋 sinew|
鋼 steel|則 rule|壁 wall|砂 sand|族 tribe|農 farming|賃 wage|売 sell|閉 close|商 trade|
基 foundation|絵 painting|棚 shelf|番 turn|資 resources|能 ability|協 together|努 strive|魅 charm|重 heavy|
圧 press|引 pull|視 look|暴 violent|権 authority|浮 float|迫 urge|育 raise|験 test|液 fluid|
固 hard|操 handle|団 group|格 status|肉 flesh|式 style|変 change|象 elephant|周 around|盤 platter|
楕 oval|陣 camp|滑 slide|欠 lack|終 end|焦 scorch|弱 weak|起 rise|拠 base|要 need|
検 examine|句 phrase|直 straight|曲 bend|沿 run along|脱 shed|斜 slant|混 mix|映 reflect|漫 casual|
版 printing block|企 plan|描 draw|複 double|模 imitate|珠 pearl|横 sideways|似 resemble|価 value|幻 illusion|
思 think|連 link|構 build|瞑 close eyes|考 consider|案 plan|覚 sense|謝 thank|共 together|敏 nimble|
好 fond|霊 spirit|五 five|質 quality|識 know|得 gain|任 entrust|創 create|義 righteousness|趣 gist|
興 interest|甘 sweet|酸 sour|薬 medicine|噌 miso|塩 salt|飛 fly|急 hurry|修 discipline|進 advance|
孝 filial piety|紀 chronicle|未 not yet|将 about to|往 go forth|到 arrive|客 guest|週 week|従 follow|輸 transport|
提 present|演 perform|血 blood|収 take in|院 institution|加 add|浴 bathe|侵 invade|導 guide|供 offer|
弟 younger brother|様 manner|椅 chair|帽 cap|菓 sweets|双 pair|孫 grandchild|扇 fan|迷 astray|親 parent|
障 hinder|粒 grain|因 cause|彼 he|性 nature|優 gentle|巫 shaman|魔 demon|乙 second|帝 emperor|
冠 crown|仁 benevolence|肌 skin|稚 young|介 shell|乗 ride|競 compete|鹿 deer|術 art|履 footwear|
牧 pasture|煙 smoke|抹 rub|喫 consume|碗 bowl|麦 wheat|畑 farm field|粗 coarse|玄 dark|欧 Europe|
飲 drink|禁 forbid|杯 cup|宴 banquet|抜 pull out|帯 sash|執 grasp|専 sole|限 limit|鬼 demon|
際 edge|丸 round|師 master|裏 back|箱 box|芸 art|街 street|販 sell|闇 darkness|漁 fishing|
里 hamlet|遷 move|庁 agency
`
