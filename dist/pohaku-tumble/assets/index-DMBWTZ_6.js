(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function t(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(a){if(a.ep)return;a.ep=!0;const o=t(a);fetch(a.href,o)}})();const gh=[{w:"aholoa",a:"aho#1",b:"loa",g:"patient; long-suffering",f:"naʻau",ev:"pending",nodeal:!1},{w:"ahonui",a:"aho#1",b:"nui",g:"patience; patient endurance",f:"naʻau",ev:"keep",nodeal:!1},{w:"ahupuaʻa",a:"ahu",b:"puaʻa",g:"land division, mountains to sea",f:"ʻāina",ev:"keep",nodeal:!1},{w:"akeakamai",a:"ake",b:"akamai",g:"seeker of knowledge; philosopher",f:"naʻau",ev:"keep",nodeal:!0},{w:"akeloa",a:"ake",b:"loa",g:"spleen",f:"kanaka",ev:"pending",nodeal:!1},{w:"akemāmā",a:"ake",b:"māmā",g:"lungs",f:"kanaka",ev:"keep",nodeal:!1},{w:"alahaka",a:"ala#0",b:"haka#0",g:"ladder; rough path over chasms",f:"hele",ev:"keep",nodeal:!1},{w:"alahao",a:"ala#0",b:"hao#0",g:"railroad, railway",f:"hele",ev:"keep",nodeal:!0},{w:"alakaʻi",a:"ala#0",b:"kaʻi",g:"to lead, guide; leader",f:"hele",ev:"keep",nodeal:!1},{w:"alaloa",a:"ala#0",b:"loa",g:"highway; main road around island",f:"hele",ev:"keep",nodeal:!1},{w:"alanui",a:"ala#0",b:"nui",g:"road, street, highway",f:"hele",ev:"keep",nodeal:!1},{w:"alapiʻi",a:"ala#0",b:"piʻi#0",g:"stairs, ladder, ascent",f:"hele",ev:"pending",nodeal:!1},{w:"alawai",a:"ala#0",b:"wai#0",g:"channel; canal",f:"hele",ev:"pending",nodeal:!1},{w:"alaula",a:"ala#0",b:"ʻula?alaʻula",g:"dawn light; sunset glow",f:"lani",ev:"pending",nodeal:!1},{w:"aliʻiwahine",a:"aliʻi",b:"wahine",g:"woman chief; princess or queen",f:"kanaka",ev:"pending",nodeal:!1},{w:"anamanaʻo",a:"ana#1",b:"manaʻo",g:"survey, poll",f:"naʻau",ev:"keep",nodeal:!0},{w:"anapuni",a:"ana#1",b:"puni#0",g:"circumference, perimeter",f:"hele",ev:"keep",nodeal:!0},{w:"anawaena",a:"ana#1",b:"waena",g:"diameter",f:"hele",ev:"keep",nodeal:!0},{w:"ana ʻāina",a:"ana#1",b:"ʻāina",g:"land surveying; to survey land",f:"ʻāina",ev:"pending",nodeal:!1},{w:"aouli",a:"ao#2",b:"uli#0",g:"firmament, the blue sky",f:"lani",ev:"keep",nodeal:!1},{w:"aumiki",a:"au",b:"miki#0",g:"outgoing current; rip current",f:"kai",ev:"keep",nodeal:!1},{w:"aumoe",a:"au?aumoe",b:"moe",g:"midnight, late night",f:"hele",ev:"pending",nodeal:!1},{w:"ʻauwaʻa",a:"ʻau#group",b:"waʻa",g:"fleet of canoes",f:"hana",ev:"pending",nodeal:!1},{w:"aʻa koko",a:"aʻa#0",b:"koko",g:"blood vessel, vein",f:"kanaka",ev:"pending",nodeal:!1},{w:"aʻalele",a:"aʻa#0",b:"lele",g:"artery",f:"kanaka",ev:"pending",nodeal:!1},{w:"aʻalolo",a:"aʻa#0",b:"lolo",g:"nerve",f:"kanaka",ev:"pending",nodeal:!1},{w:"haipule",a:"hai#0",b:"pule#0",g:"devout, religious; to worship",f:"naʻau",ev:"pending",nodeal:!1},{w:"hakakau",a:"haka#0",b:"kau#1",g:"rack; to perch on slender footing",f:"hana",ev:"pending",nodeal:!1},{w:"hakamoa",a:"haka?hakamoa",b:"moa",g:"one-leg wrestling game; cockfighting",f:"kanaka",ev:"pending",nodeal:!1},{w:"hakuhale",a:"haku#0",b:"hale",g:"master or owner of a house",f:"kanaka",ev:"pending",nodeal:!1},{w:"haku mele",a:"haku#2",b:"mele#0",g:"to compose songs; a composer",f:"naʻau",ev:"keep",nodeal:!1},{w:"haku wahine",a:"haku#0",b:"wahine",g:"female head; wife of a chief",f:"kanaka",ev:"pending",nodeal:!1},{w:"haku ʻāina",a:"haku#0",b:"ʻāina",g:"land steward under a chief",f:"kanaka",ev:"pending",nodeal:!1},{w:"haku ʻōlelo",a:"haku#2",b:"ʻōlelo",g:"one who composes words; a writer",f:"naʻau",ev:"pending",nodeal:!1},{w:"hale aliʻi",a:"hale",b:"aliʻi",g:"house of a chief; palace",f:"hana",ev:"keep",nodeal:!1},{w:"halekaua",a:"hale",b:"kaua",g:"fort; fortification",f:"hana",ev:"pending",nodeal:!0},{w:"hale kaʻa",a:"hale",b:"kaʻa#0",g:"carriage house; garage",f:"hana",ev:"pending",nodeal:!0},{w:"halekia",a:"hale",b:"kia#0",g:"pillared porch; veranda",f:"hana",ev:"pending",nodeal:!1},{w:"halelana",a:"hale",b:"lana#0",g:"the ark; a floating house",f:"hana",ev:"pending",nodeal:!0},{w:"halelewa",a:"hale",b:"lewa",g:"portable house; tent",f:"hana",ev:"pending",nodeal:!1},{w:"halelole",a:"hale",b:"lole",g:"tent",f:"hana",ev:"pending",nodeal:!0},{w:"hale lāʻau",a:"hale",b:"lāʻau",g:"wooden house, not thatched",f:"hana",ev:"pending",nodeal:!0},{w:"halemalu",a:"hale",b:"malu",g:"shaded house; shed",f:"hana",ev:"pending",nodeal:!1},{w:"hale moe",a:"hale",b:"moe",g:"sleeping house",f:"hana",ev:"pending",nodeal:!1},{w:"hale mākaʻi",a:"hale",b:"mākaʻi",g:"police station",f:"hana",ev:"keep",nodeal:!1},{w:"hale piʻo",a:"hale",b:"piʻo",g:"house framed with bent poles",f:"hana",ev:"pending",nodeal:!1},{w:"hale pule",a:"hale",b:"pule#0",g:"church; house of worship",f:"hana",ev:"keep",nodeal:!1},{w:"hamoʻula",a:"hamo",b:"ʻula#0",g:"red-stained tapa; red dye",f:"hana",ev:"pending",nodeal:!1},{w:"hana mana",a:"hana#0",b:"mana#0",g:"miracle; a work of the gods",f:"naʻau",ev:"keep",nodeal:!1},{w:"hanupaʻa",a:"hanu",b:"paʻa",g:"a head cold; catarrh",f:"kanaka",ev:"pending",nodeal:!0},{w:"haowaha",a:"hao#0",b:"waha#0",g:"bridle bit",f:"hana",ev:"pending",nodeal:!0},{w:"haupia",a:"hau#0",b:"pia#0",g:"pudding of coconut cream and starch",f:"ulu",ev:"pending",nodeal:!1},{w:"hauʻeli",a:"hau#0",b:"ʻeli",g:"a salt dug from cave rocks",f:"ʻāina",ev:"pending",nodeal:!1},{w:"hauʻoli",a:"hau#mood",b:"ʻoli",g:"happy, glad; joy",f:"naʻau",ev:"pending",nodeal:!1},{w:"heiheinalu",a:"heihei",b:"nalu#0",g:"to race on surfboards",f:"kai",ev:"pending",nodeal:!1},{w:"helekū",a:"hele",b:"kū#0",g:"to walk upright",f:"hele",ev:"pending",nodeal:!1},{w:"heʻe nalu",a:"heʻe#1",b:"nalu#0",g:"surfing; to ride a surfboard",f:"kai",ev:"keep",nodeal:!1},{w:"hikilele",a:"hiki?hikilele",b:"lele",g:"startled; to jump with fright",f:"naʻau",ev:"pending",nodeal:!1},{w:"hikimoe",a:"hiki",b:"moe",g:"the west, where sun sets (poetic)",f:"lani",ev:"pending",nodeal:!1},{w:"hiʻilani",a:"hiʻi",b:"lani",g:"to exalt, praise, admire",f:"naʻau",ev:"pending",nodeal:!1},{w:"hiʻipoi",a:"hiʻi",b:"poi?hiʻipoi",g:"to tend and cherish",f:"kanaka",ev:"pending",nodeal:!1},{w:"hoaaloha",a:"hoa#0",b:"aloha",g:"friend",f:"kanaka",ev:"keep",nodeal:!1},{w:"hoa hana",a:"hoa#0",b:"hana#0",g:"fellow worker; helper",f:"hana",ev:"keep",nodeal:!1},{w:"hoahanauna",a:"hoa#0",b:"hanauna",g:"fellow kin; relatives",f:"kanaka",ev:"pending",nodeal:!1},{w:"hoa hele",a:"hoa#0",b:"hele",g:"fellow traveler",f:"hele",ev:"pending",nodeal:!1},{w:"hoahānau",a:"hoa#0",b:"hānau",g:"cousin; kin of the same generation",f:"kanaka",ev:"keep",nodeal:!1},{w:"hoa kaua",a:"hoa#0",b:"kaua",g:"fellow soldier; adversary in war",f:"kanaka",ev:"pending",nodeal:!0},{w:"hoakipa",a:"hoa#0",b:"kipa#0",g:"visitor",f:"hele",ev:"pending",nodeal:!1},{w:"hoakoa",a:"hoa#0",b:"koa#1",g:"fellow soldier",f:"kanaka",ev:"pending",nodeal:!0},{w:"hoalawaiʻa",a:"hoa#0",b:"lawaiʻa",g:"fellow fisherman",f:"kai",ev:"pending",nodeal:!1},{w:"hoa paio",a:"hoa#0",b:"paio",g:"opponent, adversary",f:"kanaka",ev:"keep",nodeal:!1},{w:"hoaʻai",a:"hoa#0",b:"ʻai",g:"table companion; guest at a meal",f:"ulu",ev:"pending",nodeal:!1},{w:"hoaʻāina",a:"hoa#0",b:"ʻāina",g:"native tenant; tiller of the land",f:"ʻāina",ev:"keep",nodeal:!1},{w:"hoaʻōlelo",a:"hoa#0",b:"ʻōlelo",g:"conversation partner; counsellor",f:"naʻau",ev:"pending",nodeal:!1},{w:"hoe uli",a:"hoe",b:"uli#1",g:"steering paddle",f:"hana",ev:"keep",nodeal:!1},{w:"hoe waʻa",a:"hoe",b:"waʻa",g:"to paddle a canoe; paddler",f:"hana",ev:"pending",nodeal:!1},{w:"holokai",a:"holo#0",b:"kai",g:"seafarer; seafaring",f:"kai",ev:"keep",nodeal:!1},{w:"holo lio",a:"holo#0",b:"lio",g:"horseback riding; horse rider",f:"hele",ev:"keep",nodeal:!0},{w:"holomoku",a:"holo#0",b:"moku",g:"sailor; to sail on a ship",f:"hele",ev:"keep",nodeal:!1},{w:"holowaʻa",a:"holo?holowaʻa",b:"waʻa",g:"trough; chest; oblong box",f:"hana",ev:"pending",nodeal:!1},{w:"holo ʻai",a:"holo#bundle",b:"ʻai",g:"bundle of baked food",f:"ulu",ev:"pending",nodeal:!1},{w:"hope poʻo",a:"hope",b:"poʻo",g:"deputy or associate head",f:"kanaka",ev:"pending",nodeal:!1},{w:"hoʻi hope",a:"hoʻi",b:"hope",g:"to turn back, retreat",f:"hele",ev:"pending",nodeal:!1},{w:"hualiʻi",a:"hua",b:"liʻi#0",g:"small fruit left after harvest",f:"ulu",ev:"pending",nodeal:!1},{w:"hua mele",a:"hua#word",b:"mele#0",g:"musical note",f:"naʻau",ev:"pending",nodeal:!0},{w:"hua moa",a:"hua",b:"moa",g:"hen egg",f:"ulu",ev:"keep",nodeal:!1},{w:"huaʻai",a:"hua",b:"ʻai",g:"fruit, edible fruit",f:"ulu",ev:"pending",nodeal:!1},{w:"huaʻōlelo",a:"hua#word",b:"ʻōlelo",g:"word",f:"naʻau",ev:"pending",nodeal:!1},{w:"huewai",a:"hue",b:"wai#0",g:"water gourd",f:"hana",ev:"keep",nodeal:!1},{w:"hue ʻili",a:"hue",b:"ʻili",g:"skin bottle",f:"hana",ev:"pending",nodeal:!0},{w:"huikala",a:"hui",b:"kala#2",g:"forgiveness; to purify",f:"naʻau",ev:"keep",nodeal:!1},{w:"hukiwai",a:"huki",b:"wai#0",g:"to draw water",f:"hana",ev:"pending",nodeal:!1},{w:"hulilua",a:"huli#0",b:"lua#0",g:"turning two ways; shifting",f:"hele",ev:"pending",nodeal:!1},{w:"huluʻiʻiwi",a:"hulu#0",b:"ʻiʻiwi",g:"ʻiʻiwi feathers, for cloaks",f:"hana",ev:"pending",nodeal:!1},{w:"hunakai",a:"huna#0",b:"kai",g:"sea foam; the sanderling",f:"kai",ev:"keep",nodeal:!1},{w:"hunakaua",a:"huna#0",b:"kaua",g:"a single fighter in an army",f:"kanaka",ev:"pending",nodeal:!0},{w:"huna wai",a:"huna#0",b:"wai#0",g:"drop of water; spray, mist",f:"ʻāina",ev:"pending",nodeal:!1},{w:"hāipu",a:"hā#2",b:"ipu",g:"gourd leaf stalk, used medicinally",f:"ulu",ev:"pending",nodeal:!1},{w:"hākō",a:"hā#2",b:"kō#0",g:"sugar-cane leaf",f:"ulu",ev:"pending",nodeal:!1},{w:"hāliʻikuli",a:"hāliʻi",b:"kuli#1",g:"stingy; one who guards the food",f:"naʻau",ev:"pending",nodeal:!1},{w:"hānaukahi",a:"hānau",b:"kahi#0",g:"an only child",f:"kanaka",ev:"pending",nodeal:!1},{w:"hānau mua",a:"hānau",b:"mua",g:"first-born child",f:"kanaka",ev:"pending",nodeal:!1},{w:"hāniu",a:"hā#2",b:"niu#0",g:"butt end of a coconut frond",f:"ulu",ev:"pending",nodeal:!1},{w:"hōkūao",a:"hōkū",b:"ao#0",g:"Venus as the morning star",f:"lani",ev:"pending",nodeal:!1},{w:"hōkū hele",a:"hōkū",b:"hele",g:"planet",f:"lani",ev:"keep",nodeal:!1},{w:"hōkūlele",a:"hōkū",b:"lele",g:"meteor; shooting star",f:"lani",ev:"pending",nodeal:!1},{w:"hōkūloa",a:"hōkū",b:"loa",g:"Venus; the morning star",f:"lani",ev:"pending",nodeal:!1},{w:"hōkūnaʻi",a:"hōkū",b:"naʻi#0",g:"asteroid",f:"lani",ev:"keep",nodeal:!0},{w:"hōkū ʻaeʻa",a:"hōkū",b:"ʻaeʻa",g:"planet",f:"lani",ev:"keep",nodeal:!1},{w:"hūkai",a:"hū#0",b:"kai",g:"brackish; tasteless",f:"kai",ev:"pending",nodeal:!1},{w:"hūlani",a:"hū#0",b:"lani",g:"to praise highly, exalt",f:"naʻau",ev:"pending",nodeal:!1},{w:"hūpuna",a:"hū#0",b:"puna#0",g:"pool of overflowing spring water",f:"ʻāina",ev:"pending",nodeal:!1},{w:"iwikū",a:"iwi",b:"kū#0",g:"a bone of the lower leg",f:"kanaka",ev:"pending",nodeal:!1},{w:"iwipona",a:"iwi",b:"pona",g:"a joint of the bones",f:"kanaka",ev:"pending",nodeal:!0},{w:"kahakai",a:"kaha#1",b:"kai",g:"seashore, beach",f:"kai",ev:"keep",nodeal:!1},{w:"kahaone",a:"kaha#1",b:"one",g:"sandy beach",f:"kai",ev:"pending",nodeal:!1},{w:"kahapili",a:"kaha#0",b:"pili",g:"tangent to a circle",f:"hele",ev:"pending",nodeal:!0},{w:"kahapōʻai",a:"kaha#0",b:"pōʻai",g:"circumference of a circle",f:"hele",ev:"pending",nodeal:!0},{w:"kahawai",a:"kaha?kahawai",b:"wai#0",g:"stream, creek; ravine, gulch",f:"ʻāina",ev:"keep",nodeal:!1},{w:"kahua hale",a:"kahua",b:"hale",g:"house foundation; house site",f:"hana",ev:"pending",nodeal:!1},{w:"kahu ahi",a:"kahu#0",b:"ahi",g:"fire tender; to tend a fire",f:"hana",ev:"pending",nodeal:!1},{w:"kahu akua",a:"kahu#0",b:"akua",g:"keeper of a god; priest",f:"naʻau",ev:"pending",nodeal:!1},{w:"kahu puaʻa",a:"kahu#0",b:"puaʻa",g:"swineherd",f:"hana",ev:"pending",nodeal:!1},{w:"kahu wai",a:"kahu#0",b:"wai#0",g:"overseer of water distribution",f:"ʻāina",ev:"pending",nodeal:!1},{w:"kahu ʻāina",a:"kahu#0",b:"ʻāina",g:"steward of the land",f:"ʻāina",ev:"pending",nodeal:!1},{w:"kai au",a:"kai",b:"au",g:"sea where a current is visible",f:"kai",ev:"keep",nodeal:!1},{w:"kai ea",a:"kai",b:"ea",g:"rising tide, washing high on land",f:"kai",ev:"keep",nodeal:!1},{w:"kai eʻe",a:"kai",b:"eʻe",g:"tsunami; tidal wave",f:"kai",ev:"keep",nodeal:!1},{w:"kai malolo",a:"kai",b:"malolo",g:"low tide; a calm, quiet sea",f:"kai",ev:"keep",nodeal:!1},{w:"kai piʻi",a:"kai",b:"piʻi#0",g:"high or rising tide",f:"kai",ev:"pending",nodeal:!1},{w:"kai uli",a:"kai",b:"uli#0",g:"the deep blue sea",f:"kai",ev:"keep",nodeal:!1},{w:"kai ʻau",a:"kai",b:"ʻau#1",g:"sea too deep to stand in",f:"kai",ev:"keep",nodeal:!1},{w:"kākāʻōlelo",a:"kaka?kakaʻōlelo",b:"ʻōlelo",g:"orator; counselor to a chief",f:"naʻau",ev:"pending",nodeal:!1},{w:"kalahala",a:"kala#2",b:"hala#0",g:"to pardon wrongdoing",f:"naʻau",ev:"pending",nodeal:!1},{w:"kala hale",a:"kala#gable",b:"hale",g:"gable end of a house",f:"hana",ev:"pending",nodeal:!1},{w:"kanaka makua",a:"kanaka",b:"makua",g:"adult, grown person",f:"kanaka",ev:"pending",nodeal:!1},{w:"kanikau",a:"kani",b:"kau#2",g:"dirge; lament for the dead",f:"naʻau",ev:"keep",nodeal:!0},{w:"kaniwāwae",a:"kani",b:"wāwae",g:"foot soldier; infantry",f:"kanaka",ev:"pending",nodeal:!0},{w:"kapakahi",a:"kapa",b:"kahi#0",g:"crooked, lopsided; one-sided",f:"hele",ev:"keep",nodeal:!1},{w:"kapa komo",a:"kapa",b:"komo",g:"garment, clothing; a dress",f:"hana",ev:"pending",nodeal:!1},{w:"kaukahi",a:"kau?kaukahi",b:"kahi#0",g:"single canoe; standing alone",f:"hana",ev:"pending",nodeal:!1},{w:"kau kānāwai",a:"kau#1",b:"kānāwai",g:"to make laws; lawmaker",f:"naʻau",ev:"keep",nodeal:!1},{w:"kaulahao",a:"kaula",b:"hao#0",g:"chain",f:"hana",ev:"keep",nodeal:!0},{w:"kaula lei",a:"kaula",b:"lei",g:"cord for stringing a lei",f:"hana",ev:"pending",nodeal:!1},{w:"kaulawaha",a:"kaula",b:"waha#0",g:"bridle; to rein in",f:"hana",ev:"pending",nodeal:!0},{w:"kaulike",a:"kau#1",b:"like",g:"fair, just; evenly balanced",f:"naʻau",ev:"keep",nodeal:!1},{w:"kaulua",a:"kau?kaulua",b:"lua#0",g:"double canoe; a pair",f:"hana",ev:"pending",nodeal:!1},{w:"kaupale",a:"kau?kaupale",b:"pale?kaupale",g:"partition; dividing barrier",f:"hana",ev:"pending",nodeal:!1},{w:"kaʻahale",a:"kaʻa#0",b:"hale",g:"covered carriage; house-like cart",f:"hana",ev:"pending",nodeal:!0},{w:"kaʻahele",a:"kaʻa#0",b:"hele",g:"to travel about, tour",f:"hele",ev:"keep",nodeal:!1},{w:"kaʻakaua",a:"kaʻa#0",b:"kaua",g:"to maneuver forces in war",f:"hele",ev:"pending",nodeal:!0},{w:"kaʻalalo",a:"kaʻa#0",b:"lalo",g:"to sail off the wind, leeward",f:"hele",ev:"pending",nodeal:!1},{w:"kaʻaluna",a:"kaʻa#0",b:"luna?kaʻaluna",g:"to sail against the wind",f:"hele",ev:"pending",nodeal:!1},{w:"kaʻapuni",a:"kaʻa#0",b:"puni#0",g:"to go around; to tour",f:"hele",ev:"keep",nodeal:!1},{w:"keiki kāne",a:"keiki",b:"kāne",g:"boy; son",f:"kanaka",ev:"keep",nodeal:!1},{w:"keikipapa",a:"keiki",b:"papa#0",g:"native-born on ancestral land",f:"kanaka",ev:"pending",nodeal:!1},{w:"kia ahi",a:"kia#0",b:"ahi",g:"pillar of fire",f:"lani",ev:"pending",nodeal:!0},{w:"kia ao",a:"kia#0",b:"ao#2",g:"pillar of cloud",f:"lani",ev:"pending",nodeal:!0},{w:"kiakahi",a:"kia#0",b:"kahi#0",g:"steadfast, of one purpose",f:"naʻau",ev:"pending",nodeal:!1},{w:"kiakolu",a:"kia#0",b:"kolu",g:"three-masted ship",f:"hana",ev:"pending",nodeal:!0},{w:"kialua",a:"kia#0",b:"lua#0",g:"two-masted vessel; brig, schooner",f:"hana",ev:"pending",nodeal:!0},{w:"kiaʻipoʻo",a:"kiaʻi",b:"poʻo",g:"bodyguard of a king",f:"kanaka",ev:"pending",nodeal:!1},{w:"kiaʻipuka",a:"kiaʻi",b:"puka",g:"gatekeeper, porter",f:"kanaka",ev:"pending",nodeal:!1},{w:"kiaʻipō",a:"kiaʻi",b:"pō",g:"night watch",f:"hele",ev:"pending",nodeal:!1},{w:"kiaʻāina",a:"kia#0",b:"ʻāina",g:"governor; ruler of an island",f:"kanaka",ev:"keep",nodeal:!1},{w:"kiko kahi",a:"kiko",b:"kahi#0",g:"period (punctuation mark)",f:"naʻau",ev:"pending",nodeal:!0},{w:"kikolā",a:"kiko",b:"lā#1",g:"to keep a daily tally",f:"hele",ev:"pending",nodeal:!1},{w:"kiko moe",a:"kiko",b:"moe",g:"hyphen",f:"naʻau",ev:"pending",nodeal:!0},{w:"kiko nīnau",a:"kiko",b:"nīnau",g:"question mark",f:"naʻau",ev:"keep",nodeal:!0},{w:"kikowaena",a:"kiko",b:"waena",g:"center; center of a circle",f:"hele",ev:"keep",nodeal:!1},{w:"kiloheʻe",a:"kilo",b:"heʻe#0",g:"searching the sea for octopus",f:"kai",ev:"pending",nodeal:!1},{w:"kinoea",a:"kino",b:"ea",g:"gas (state of matter)",f:"lani",ev:"keep",nodeal:!0},{w:"kinopaʻa",a:"kino",b:"paʻa",g:"solid (state of matter)",f:"ʻāina",ev:"keep",nodeal:!0},{w:"kinowai",a:"kino",b:"wai#0",g:"liquid (state of matter)",f:"ʻāina",ev:"keep",nodeal:!0},{w:"kino wailua",a:"kino",b:"wailua",g:"spirit or ghost of the dead",f:"naʻau",ev:"pending",nodeal:!0},{w:"kipikua",a:"kipi#0",b:"kua#1",g:"pickaxe",f:"hana",ev:"pending",nodeal:!0},{w:"kiʻipalapala",a:"kiʻi#0",b:"palapala",g:"picture; portrait",f:"hana",ev:"pending",nodeal:!0},{w:"kiʻi pōhaku",a:"kiʻi#0",b:"pōhaku",g:"petroglyph; stone image",f:"hana",ev:"keep",nodeal:!1},{w:"koʻikahi",a:"koʻi",b:"kahi#1",g:"wood plane",f:"hana",ev:"pending",nodeal:!0},{w:"koʻilipi",a:"koʻi",b:"lipi",g:"axe",f:"hana",ev:"pending",nodeal:!1},{w:"komohale",a:"komo",b:"hale",g:"house-warming; dedicating a new house",f:"hana",ev:"pending",nodeal:!1},{w:"komoʻāina",a:"komo",b:"ʻāina",g:"to enter upon inherited land",f:"ʻāina",ev:"pending",nodeal:!1},{w:"kuahao",a:"kua?kuahao",b:"hao#0",g:"anvil",f:"hana",ev:"pending",nodeal:!1},{w:"kuamauna",a:"kua#0",b:"mauna",g:"mountaintop zone",f:"ʻāina",ev:"pending",nodeal:!1},{w:"kuamoʻo",a:"kua#0",b:"moʻo",g:"backbone; path; way, custom",f:"kanaka",ev:"keep",nodeal:!1},{w:"kuapapa",a:"kua#1",b:"papa#0",g:"peace; quiet, untroubled",f:"naʻau",ev:"pending",nodeal:!1},{w:"kuapaʻa",a:"kua#0",b:"paʻa",g:"hard-backed crab or mollusk",f:"kai",ev:"pending",nodeal:!1},{w:"kuapuʻu",a:"kua#0",b:"puʻu",g:"hump, as of a camel",f:"kanaka",ev:"keep",nodeal:!0},{w:"kuaʻāina",a:"kua#0",b:"ʻāina",g:"countryside, back country",f:"ʻāina",ev:"keep",nodeal:!1},{w:"kuenehale",a:"kuene",b:"hale",g:"house framer; house-building craft",f:"hana",ev:"pending",nodeal:!1},{w:"kuhihewa",a:"kuhi#1",b:"hewa",g:"to mistake, misjudge",f:"naʻau",ev:"pending",nodeal:!1},{w:"kuilua",a:"kui?kuilua",b:"lua#0",g:"to double by adding on",f:"hele",ev:"pending",nodeal:!1},{w:"kulihiamoe",a:"kuli#0",b:"hiamoe",g:"to doze, too drowsy to hear",f:"kanaka",ev:"pending",nodeal:!1},{w:"kumukānāwai",a:"kumu",b:"kānāwai",g:"constitution",f:"naʻau",ev:"keep",nodeal:!0},{w:"kumulau",a:"kumu",b:"lau#0",g:"sprouting stump; prolific source",f:"ulu",ev:"pending",nodeal:!1},{w:"kumulāʻau",a:"kumu",b:"lāʻau",g:"tree",f:"ulu",ev:"keep",nodeal:!1},{w:"kumupaʻa",a:"kumu",b:"paʻa",g:"firm foundation",f:"naʻau",ev:"keep",nodeal:!1},{w:"kumuwai",a:"kumu",b:"wai#0",g:"spring; head of a stream",f:"ʻāina",ev:"pending",nodeal:!1},{w:"kupuna wahine",a:"kupuna",b:"wahine",g:"grandmother",f:"kanaka",ev:"pending",nodeal:!1},{w:"kuʻihao",a:"kuʻi#0",b:"hao#0",g:"blacksmith; to forge iron",f:"hana",ev:"keep",nodeal:!0},{w:"kuʻikahi",a:"kuʻi#1",b:"kahi#0",g:"treaty; peace, union",f:"naʻau",ev:"keep",nodeal:!1},{w:"kuʻi ʻai",a:"kuʻi#0",b:"ʻai",g:"pounding poi; poi pounder",f:"ulu",ev:"pending",nodeal:!1},{w:"kālai pōhaku",a:"kālai",b:"pōhaku",g:"stone carving; stone carver",f:"hana",ev:"pending",nodeal:!1},{w:"kālaiʻāina",a:"kālai",b:"ʻāina",g:"politics; affairs of the land",f:"kanaka",ev:"keep",nodeal:!0},{w:"kālāʻau",a:"kā#0",b:"lāʻau",g:"stick dance; striking sticks together",f:"naʻau",ev:"pending",nodeal:!1},{w:"kāmaʻaloa",a:"kāmaʻa",b:"loa",g:"runners of a hōlua sled",f:"hana",ev:"pending",nodeal:!1},{w:"kāne make",a:"kāne",b:"make",g:"widowed (of a wife)",f:"kanaka",ev:"pending",nodeal:!0},{w:"kāwilimanu",a:"kāwili",b:"manu",g:"catching birds with bird lime",f:"hana",ev:"pending",nodeal:!1},{w:"kēʻai",a:"kē",b:"ʻai",g:"to fast",f:"naʻau",ev:"pending",nodeal:!1},{w:"kōhiʻai",a:"kōhi#0",b:"ʻai",g:"to dig food from the ground",f:"ulu",ev:"pending",nodeal:!1},{w:"kōkea",a:"kō#0",b:"kea",g:"a white sugar cane",f:"ulu",ev:"pending",nodeal:!1},{w:"kōpaʻa",a:"kō#0",b:"paʻa",g:"sugar",f:"ulu",ev:"keep",nodeal:!0},{w:"kōʻula",a:"kō#0",b:"ʻula#0",g:"a reddish sugar cane",f:"ulu",ev:"pending",nodeal:!1},{w:"kūemi",a:"kū#0",b:"emi",g:"to retreat, as from something feared",f:"hele",ev:"pending",nodeal:!1},{w:"kūhewa",a:"kū?kūhewa",b:"hewa",g:"sudden; striking without warning",f:"hele",ev:"pending",nodeal:!1},{w:"kūkaha",a:"kū#0",b:"kaha?kūkaha",g:"to stand sideways, making room",f:"hele",ev:"pending",nodeal:!1},{w:"kūkala",a:"kū#0",b:"kala#1",g:"to proclaim publicly, announce",f:"naʻau",ev:"keep",nodeal:!1},{w:"kūkia",a:"kū#0",b:"kia#0",g:"to stand firm, steady in purpose",f:"naʻau",ev:"pending",nodeal:!1},{w:"kūkulu hema",a:"kūkulu#0",b:"hema",g:"the south; the south point",f:"lani",ev:"pending",nodeal:!1},{w:"kūkulupapa",a:"kūkulu#0",b:"papa#0",g:"to arrange in ranks; classify",f:"hana",ev:"pending",nodeal:!1},{w:"kūlehu",a:"kū#0",b:"lehu",g:"to roast in hot ashes",f:"ulu",ev:"pending",nodeal:!1},{w:"kūloko",a:"kū?kūloko",b:"loko",g:"internal, domestic; of home affairs",f:"kanaka",ev:"pending",nodeal:!1},{w:"kūloupoʻo",a:"kūlou",b:"poʻo",g:"to dive in head first",f:"hele",ev:"pending",nodeal:!1},{w:"kūlālā",a:"kū#0",b:"lālā",g:"plant grown from a cutting",f:"ulu",ev:"pending",nodeal:!1},{w:"kūmaka",a:"kū?kūmaka",b:"maka#0",g:"known by sight; in plain view",f:"naʻau",ev:"pending",nodeal:!1},{w:"kūnihi",a:"kū#0",b:"nihi",g:"set on edge; standing sideways",f:"hele",ev:"pending",nodeal:!1},{w:"kūnānā",a:"kū#0",b:"nānā#1",g:"to stand and watch",f:"naʻau",ev:"pending",nodeal:!1},{w:"kūola",a:"kū#0",b:"ola",g:"to come through danger unharmed",f:"kanaka",ev:"pending",nodeal:!1},{w:"kūpaʻa",a:"kū#0",b:"paʻa",g:"steadfast, unshaken in purpose",f:"naʻau",ev:"keep",nodeal:!1},{w:"kūpono",a:"kū#0",b:"pono",g:"upright, honest; proper, suitable",f:"naʻau",ev:"keep",nodeal:!1},{w:"kūpuni",a:"kū#0",b:"puni#0",g:"to stand around, surround",f:"hele",ev:"pending",nodeal:!1},{w:"kūʻai",a:"kū#0",b:"ʻai",g:"to barter, trade; buy or sell",f:"hana",ev:"pending",nodeal:!1},{w:"kūʻau",a:"kū?kūʻau",b:"ʻau#0",g:"handle; tapa-beating mallet",f:"hana",ev:"pending",nodeal:!1},{w:"kūʻauhau",a:"kū?kūʻauhau",b:"ʻauhau",g:"genealogy; genealogist",f:"kanaka",ev:"pending",nodeal:!1},{w:"kūʻē",a:"kū#0",b:"ʻē#1",g:"to oppose, resist, protest",f:"naʻau",ev:"keep",nodeal:!1},{w:"laelua",a:"lae#0",b:"lua#0",g:"projecting, prominent, as a ridge",f:"ʻāina",ev:"pending",nodeal:!1},{w:"lanaau",a:"lana#0",b:"au",g:"to drift with the current",f:"hele",ev:"pending",nodeal:!1},{w:"lau hala",a:"lau#0",b:"hala#1",g:"pandanus leaf, for plaiting",f:"ulu",ev:"keep",nodeal:!1},{w:"lauhoe",a:"lau#0",b:"hoe",g:"blade of a paddle",f:"hana",ev:"keep",nodeal:!1},{w:"laukanaka",a:"lau#1",b:"kanaka",g:"a populous place",f:"kanaka",ev:"pending",nodeal:!1},{w:"laukoa",a:"lau#0",b:"koa#0",g:"leaf of the koa tree",f:"ulu",ev:"pending",nodeal:!1},{w:"lau kī",a:"lau#0",b:"kī#0",g:"ti leaf",f:"ulu",ev:"pending",nodeal:!1},{w:"lau kō",a:"lau#0",b:"kō#0",g:"sugar cane leaf",f:"ulu",ev:"pending",nodeal:!1},{w:"laulama",a:"lau#1",b:"lama#0",g:"many torches at night",f:"lani",ev:"pending",nodeal:!1},{w:"laulima",a:"lau#1",b:"lima",g:"working together, many hands",f:"hana",ev:"keep",nodeal:!1},{w:"laumake",a:"lau#0",b:"make",g:"poisonous plant; dead leaf",f:"ulu",ev:"pending",nodeal:!0},{w:"laupapa",a:"lau#broad",b:"papa#0",g:"broad flat of reef or lava",f:"ʻāina",ev:"pending",nodeal:!0},{w:"lauwili",a:"lau#0",b:"wili",g:"whirling about; fickle, changeable",f:"naʻau",ev:"pending",nodeal:!1},{w:"lau ʻulu",a:"lau#0",b:"ʻulu",g:"breadfruit leaf",f:"ulu",ev:"pending",nodeal:!1},{w:"lawaiʻa manu",a:"lawaiʻa",b:"manu",g:"bird catcher, fowler",f:"hana",ev:"pending",nodeal:!1},{w:"lawakua",a:"lawa#bind",b:"kua#0",g:"to bind fast on the back",f:"hana",ev:"pending",nodeal:!1},{w:"lawehala",a:"lawe",b:"hala#0",g:"wrongdoing, sin; to transgress",f:"naʻau",ev:"keep",nodeal:!1},{w:"lawehana",a:"lawe",b:"hana#0",g:"worker, laborer",f:"hana",ev:"pending",nodeal:!1},{w:"laweola",a:"lawe",b:"ola",g:"manslaughter; taking life unintentionally",f:"kanaka",ev:"pending",nodeal:!0},{w:"laʻamake",a:"laʻa#season",b:"make",g:"season when plants die back",f:"hele",ev:"pending",nodeal:!0},{w:"laʻaulu",a:"laʻa#season",b:"ulu#0",g:"season when plants grow fast",f:"hele",ev:"pending",nodeal:!1},{w:"lehu ahi",a:"lehu",b:"ahi",g:"ashes left by a fire",f:"ʻāina",ev:"keep",nodeal:!1},{w:"lei aliʻi",a:"lei",b:"aliʻi",g:"crown; diadem; lei of a chief",f:"hana",ev:"pending",nodeal:!1},{w:"lei hala",a:"lei",b:"hala#1",g:"lei of hala (pandanus) fruit",f:"hana",ev:"keep",nodeal:!0},{w:"lelehuna",a:"lele",b:"huna#0",g:"fine windblown spray or mist",f:"lani",ev:"keep",nodeal:!1},{w:"lelepono",a:"lele",b:"pono",g:"to prosper; to fare well",f:"naʻau",ev:"pending",nodeal:!1},{w:"leopaʻa",a:"leo",b:"paʻa",g:"one whose voice is stopped",f:"naʻau",ev:"pending",nodeal:!0},{w:"leowaena",a:"leo",b:"waena",g:"middle voice in part-singing",f:"naʻau",ev:"pending",nodeal:!0},{w:"leo wahine",a:"leo",b:"wahine",g:"highest voice part; female voice",f:"naʻau",ev:"pending",nodeal:!1},{w:"lewa lani",a:"lewa",b:"lani",g:"highest stratum of the heavens",f:"lani",ev:"keep",nodeal:!1},{w:"limahana",a:"lima",b:"hana#0",g:"worker, employee; labor",f:"hana",ev:"keep",nodeal:!1},{w:"lima hema",a:"lima",b:"hema",g:"left hand; left-handed",f:"kanaka",ev:"keep",nodeal:!1},{w:"lima kuhi",a:"lima",b:"kuhi#0",g:"index finger",f:"kanaka",ev:"keep",nodeal:!1},{w:"lima ʻākau",a:"lima",b:"ʻākau",g:"right hand; right-hand man",f:"kanaka",ev:"keep",nodeal:!1},{w:"lokomaikaʻi",a:"loko",b:"maikaʻi",g:"kindness, generosity; good will",f:"naʻau",ev:"keep",nodeal:!1},{w:"loko wai",a:"loko",b:"wai#0",g:"freshwater pond",f:"ʻāina",ev:"keep",nodeal:!1},{w:"lokoʻino",a:"loko",b:"ʻino",g:"unkindness; cruel disposition",f:"naʻau",ev:"keep",nodeal:!1},{w:"lole hana",a:"lole",b:"hana#0",g:"work clothes",f:"hana",ev:"pending",nodeal:!0},{w:"lolelua",a:"lole",b:"lua#0",g:"fickle; double-minded",f:"naʻau",ev:"pending",nodeal:!1},{w:"lolokaʻa",a:"lolo",b:"kaʻa#0",g:"dizziness",f:"kanaka",ev:"pending",nodeal:!0},{w:"lolouila",a:"lolo",b:"uila",g:"computer",f:"hana",ev:"keep",nodeal:!0},{w:"lua pele",a:"lua#1",b:"pele",g:"volcano; volcanic crater",f:"ʻāina",ev:"keep",nodeal:!1},{w:"luapō",a:"lua#1",b:"pō",g:"the grave",f:"ʻāina",ev:"pending",nodeal:!0},{w:"luna hana",a:"luna#1",b:"hana#0",g:"work supervisor; foreman, boss",f:"hana",ev:"keep",nodeal:!1},{w:"lunakahiko",a:"luna#1",b:"kahiko",g:"an elder; elderly man of standing",f:"kanaka",ev:"keep",nodeal:!0},{w:"lunakaua",a:"luna#1",b:"kaua",g:"war captain",f:"kanaka",ev:"pending",nodeal:!0},{w:"luna kiaʻi",a:"luna#1",b:"kiaʻi",g:"overseer; watchman",f:"kanaka",ev:"pending",nodeal:!1},{w:"luna koa",a:"luna#1",b:"koa#1",g:"military officer",f:"kanaka",ev:"pending",nodeal:!0},{w:"luna kānāwai",a:"luna#1",b:"kānāwai",g:"judge; magistrate",f:"kanaka",ev:"keep",nodeal:!0},{w:"lunamanaʻo",a:"luna#1",b:"manaʻo",g:"conscience",f:"naʻau",ev:"keep",nodeal:!0},{w:"luna ʻauhau",a:"luna#1",b:"ʻauhau",g:"tax collector",f:"kanaka",ev:"keep",nodeal:!1},{w:"lunaʻohana",a:"luna#1",b:"ʻohana#0",g:"head of a family",f:"kanaka",ev:"pending",nodeal:!1},{w:"lunaʻōlelo",a:"luna#1",b:"ʻōlelo",g:"apostle; messenger, proclaimer",f:"kanaka",ev:"keep",nodeal:!0},{w:"lā hana",a:"lā#1",b:"hana#0",g:"workday; day of work",f:"hana",ev:"pending",nodeal:!1},{w:"lāhui kaua",a:"lāhui",b:"kaua",g:"warriors; company of soldiers",f:"kanaka",ev:"pending",nodeal:!0},{w:"lāʻau kia",a:"lāʻau",b:"kia#0",g:"limed stick for catching birds",f:"hana",ev:"pending",nodeal:!1},{w:"mahiʻai",a:"mahi",b:"ʻai",g:"farmer; to farm",f:"ulu",ev:"keep",nodeal:!1},{w:"makaʻala",a:"maka#0",b:"ala?makaala",g:"alert, vigilant, watchful",f:"naʻau",ev:"keep",nodeal:!1},{w:"makahiamoe",a:"maka#0",b:"hiamoe",g:"sleepy; to doze off",f:"kanaka",ev:"pending",nodeal:!1},{w:"maka koa",a:"maka#0",b:"koa#1",g:"bold, fearless",f:"naʻau",ev:"keep",nodeal:!1},{w:"makaluku",a:"maka#0",b:"luku",g:"turned against one, for harm",f:"naʻau",ev:"pending",nodeal:!0},{w:"makamomi",a:"maka#0",b:"momi",g:"white speck in the eye",f:"kanaka",ev:"pending",nodeal:!0},{w:"maka mua",a:"maka#0",b:"mua",g:"first; beginning",f:"hele",ev:"keep",nodeal:!1},{w:"makanahele",a:"maka#0",b:"nahele",g:"wild, untamed",f:"ʻāina",ev:"pending",nodeal:!1},{w:"makapaʻa",a:"maka#0",b:"paʻa",g:"blind; with closed eyes",f:"kanaka",ev:"pending",nodeal:!0},{w:"makapōuli",a:"maka#0",b:"pouli",g:"dizzy, faint",f:"kanaka",ev:"keep",nodeal:!1},{w:"makapō",a:"maka#0",b:"pō",g:"blind; a blind person",f:"kanaka",ev:"keep",nodeal:!0},{w:"makawai",a:"maka#0",b:"wai#0",g:"watery-eyed",f:"kanaka",ev:"pending",nodeal:!1},{w:"makehewa",a:"make?makehewa",b:"hewa",g:"in vain; to no profit",f:"naʻau",ev:"pending",nodeal:!1},{w:"make wai",a:"make",b:"wai#0",g:"thirst; thirsty",f:"kanaka",ev:"keep",nodeal:!1},{w:"makua kāne",a:"makua",b:"kāne",g:"father",f:"kanaka",ev:"keep",nodeal:!1},{w:"makualiʻi",a:"makua",b:"liʻi#1",g:"patriarch; progenitor",f:"kanaka",ev:"pending",nodeal:!1},{w:"manawaʻino",a:"manawa",b:"ʻino",g:"ill-natured, unfriendly",f:"naʻau",ev:"pending",nodeal:!1},{w:"manaʻolana",a:"manaʻo",b:"lana#0",g:"hope; to hope",f:"naʻau",ev:"keep",nodeal:!1},{w:"manaʻo paʻa",a:"manaʻo",b:"paʻa",g:"resolve; firm purpose",f:"naʻau",ev:"pending",nodeal:!1},{w:"manaʻoʻiʻo",a:"manaʻo",b:"ʻiʻo#0",g:"faith; to believe",f:"naʻau",ev:"keep",nodeal:!1},{w:"manu ihu",a:"manu",b:"ihu",g:"beak end-piece of a canoe",f:"hana",ev:"pending",nodeal:!1},{w:"maʻalahi",a:"maʻa",b:"lahi",g:"easy, simple",f:"hana",ev:"pending",nodeal:!1},{w:"maʻaweʻula",a:"maʻawe",b:"ʻula#0",g:"path worn down to red earth",f:"hele",ev:"pending",nodeal:!1},{w:"moa mahi",a:"moa",b:"mahi",g:"victorious fighting cock; any conqueror",f:"lani",ev:"pending",nodeal:!1},{w:"moanakai",a:"moana#0",b:"kai",g:"salt sea; salt lake",f:"kai",ev:"pending",nodeal:!0},{w:"moanawai",a:"moana#0",b:"wai#0",g:"a lake of fresh water",f:"ʻāina",ev:"pending",nodeal:!1},{w:"moehewa",a:"moe",b:"hewa",g:"to talk or walk in sleep",f:"kanaka",ev:"keep",nodeal:!1},{w:"moeone",a:"moe",b:"one",g:"an earth-dwelling worm",f:"ʻāina",ev:"pending",nodeal:!1},{w:"moeʻino",a:"moe",b:"ʻino",g:"an unpleasant dream; uneasy sleep",f:"naʻau",ev:"pending",nodeal:!1},{w:"moeʻuhane",a:"moe",b:"ʻuhane",g:"a dream; a vision",f:"naʻau",ev:"keep",nodeal:!1},{w:"mokuhonua",a:"moku",b:"honua#0",g:"continent",f:"ʻāina",ev:"keep",nodeal:!0},{w:"moku kaua",a:"moku",b:"kaua",g:"warship, man-of-war",f:"hana",ev:"keep",nodeal:!0},{w:"mokulele",a:"moku",b:"lele",g:"airplane",f:"hana",ev:"keep",nodeal:!0},{w:"mokuluʻu",a:"moku",b:"luʻu",g:"submarine",f:"hana",ev:"pending",nodeal:!0},{w:"mokumāhu",a:"moku",b:"māhu",g:"steamship",f:"hana",ev:"pending",nodeal:!0},{w:"mokupuni",a:"moku",b:"puni#0",g:"island",f:"ʻāina",ev:"keep",nodeal:!1},{w:"mokuʻāina",a:"moku",b:"ʻāina",g:"state; district; island",f:"ʻāina",ev:"keep",nodeal:!1},{w:"monakō",a:"mona",b:"kō#0",g:"glucose",f:"ulu",ev:"pending",nodeal:!0},{w:"moʻamaka",a:"moʻa",b:"maka#1",g:"partly cooked",f:"ulu",ev:"pending",nodeal:!1},{w:"moʻoaliʻi",a:"moʻo#line",b:"aliʻi",g:"genealogy of chiefs",f:"kanaka",ev:"pending",nodeal:!1},{w:"moʻokanaka",a:"moʻo#line",b:"kanaka",g:"genealogy; list of the people",f:"kanaka",ev:"pending",nodeal:!1},{w:"moʻokupuna",a:"moʻo#line",b:"kupuna",g:"line of ancestors; genealogy",f:"kanaka",ev:"pending",nodeal:!1},{w:"moʻokūʻauhau",a:"moʻo#line",b:"kūʻauhau",g:"genealogy, line of descent",f:"kanaka",ev:"keep",nodeal:!1},{w:"moʻo lele",a:"moʻo",b:"lele",g:"flying serpent, dragon",f:"lani",ev:"pending",nodeal:!0},{w:"moʻoʻōlelo",a:"moʻo#line",b:"ʻōlelo",g:"history; tradition; connected narrative",f:"naʻau",ev:"pending",nodeal:!1},{w:"mulihope",a:"muli",b:"hope",g:"the last; youngest born",f:"kanaka",ev:"pending",nodeal:!1},{w:"naʻauao",a:"naʻau",b:"ao#0",g:"wise, learned; wisdom",f:"naʻau",ev:"keep",nodeal:!1},{w:"naʻaulua",a:"naʻau",b:"lua#0",g:"undecided; of two minds",f:"naʻau",ev:"pending",nodeal:!1},{w:"naʻaupono",a:"naʻau",b:"pono",g:"upright, just",f:"naʻau",ev:"pending",nodeal:!1},{w:"naʻaupō",a:"naʻau",b:"pō",g:"ignorant; ignorance",f:"naʻau",ev:"keep",nodeal:!1},{w:"noho aliʻi",a:"noho",b:"aliʻi",g:"throne; reign",f:"kanaka",ev:"keep",nodeal:!1},{w:"nukuwai",a:"nuku#0",b:"wai#0",g:"mouth of a stream",f:"ʻāina",ev:"pending",nodeal:!1},{w:"nānāao",a:"nānā#1",b:"ao#2",g:"one who reads the clouds",f:"lani",ev:"pending",nodeal:!1},{w:"nānā uli",a:"nānā#1",b:"uli#0",g:"weather foreteller, sky watcher",f:"lani",ev:"pending",nodeal:!1},{w:"olokaʻa",a:"olo?olokaʻa",b:"kaʻa#0",g:"to roll over and over",f:"hele",ev:"pending",nodeal:!1},{w:"omokoko",a:"omo",b:"koko",g:"a leech, a bloodsucker",f:"kanaka",ev:"pending",nodeal:!1},{w:"omoliu",a:"omo",b:"liu",g:"bilge pump; to pump bilge",f:"hana",ev:"pending",nodeal:!0},{w:"one hānau",a:"one",b:"hānau",g:"birthplace; native land",f:"ʻāina",ev:"keep",nodeal:!1},{w:"oneʻā",a:"one",b:"ʻā#0",g:"gunpowder",f:"hana",ev:"pending",nodeal:!0},{w:"pahu kani",a:"pahu#0",b:"kani",g:"drum; percussion instrument",f:"naʻau",ev:"pending",nodeal:!0},{w:"pahukapu",a:"pahu?pahukapu",b:"kapu#0",g:"kapu marker; consecrated place",f:"naʻau",ev:"pending",nodeal:!1},{w:"pahupalapala",a:"pahu#0",b:"palapala",g:"kapa-dye box; writing desk",f:"hana",ev:"pending",nodeal:!1},{w:"pakakahi",a:"paka#4",b:"kahi#0",g:"scattered drops of light rain",f:"lani",ev:"pending",nodeal:!1},{w:"palaimaka",a:"palai#avert",b:"maka#0",g:"averted; to turn the face away",f:"naʻau",ev:"pending",nodeal:!1},{w:"pale kai",a:"pale#1",b:"kai",g:"breakwater; ship railing",f:"kai",ev:"keep",nodeal:!1},{w:"palekaua",a:"pale#1",b:"kaua",g:"shield; defensive armor",f:"hana",ev:"pending",nodeal:!0},{w:"pale keiki",a:"pale#1",b:"keiki",g:"midwife; to deliver a child",f:"kanaka",ev:"pending",nodeal:!1},{w:"palemaka",a:"pale#0",b:"maka#0",g:"veil; covering for the face",f:"hana",ev:"pending",nodeal:!1},{w:"paleuhi",a:"pale#0",b:"uhi#1",g:"a covering; a veil",f:"hana",ev:"pending",nodeal:!1},{w:"panapoʻo",a:"pana",b:"poʻo",g:"scratch the head to remember",f:"naʻau",ev:"pending",nodeal:!1},{w:"panapua",a:"pana",b:"pua",g:"archer; to shoot arrows",f:"hana",ev:"pending",nodeal:!1},{w:"panepoʻo",a:"pane#head",b:"poʻo",g:"back of the head",f:"kanaka",ev:"pending",nodeal:!1},{w:"panipuka",a:"pani",b:"puka",g:"door; gate",f:"hana",ev:"pending",nodeal:!1},{w:"panipū",a:"pani",b:"pū#1",g:"wad of a gun",f:"hana",ev:"pending",nodeal:!0},{w:"papahola",a:"papa#0",b:"hola#0",g:"level court before a heiau",f:"hana",ev:"pending",nodeal:!1},{w:"papakea",a:"papa#0",b:"kea",g:"beach washed only at high tide",f:"kai",ev:"pending",nodeal:!1},{w:"papalalo",a:"papa#0",b:"lalo",g:"lower floor of a house",f:"hana",ev:"pending",nodeal:!1},{w:"papamū",a:"papa#0",b:"mū#2",g:"kōnane game board",f:"hana",ev:"keep",nodeal:!1},{w:"papapalapala",a:"papa#0",b:"palapala",g:"writing table; writing desk",f:"hana",ev:"pending",nodeal:!0},{w:"papapāʻina",a:"papa#0",b:"pāʻina",g:"eating table",f:"hana",ev:"pending",nodeal:!1},{w:"papapōhaku",a:"papa#0",b:"pōhaku",g:"stone slab; slate",f:"ʻāina",ev:"pending",nodeal:!1},{w:"papawaena",a:"papa#0",b:"waena",g:"middle storey of a building",f:"hana",ev:"pending",nodeal:!1},{w:"papa ʻaina",a:"papa#0",b:"ʻaina#0",g:"dining table",f:"hana",ev:"pending",nodeal:!1},{w:"pauaho",a:"pau",b:"aho#1",g:"out of breath; disheartened",f:"naʻau",ev:"keep",nodeal:!1},{w:"paʻahana",a:"paʻa",b:"hana#0",g:"industrious, hard-working",f:"hana",ev:"keep",nodeal:!1},{w:"paʻahao",a:"paʻa",b:"hao#0",g:"prisoner; imprisoned",f:"kanaka",ev:"keep",nodeal:!0},{w:"paʻakai",a:"paʻa",b:"kai",g:"salt",f:"kai",ev:"keep",nodeal:!1},{w:"paʻa kāhili",a:"paʻa",b:"kāhili",g:"kāhili bearer, attendant of a chief",f:"kanaka",ev:"keep",nodeal:!1},{w:"paʻaluhi",a:"paʻa",b:"luhi#0",g:"overcome with weariness",f:"kanaka",ev:"pending",nodeal:!1},{w:"paʻanaʻau",a:"paʻa",b:"naʻau",g:"memorized, known by heart",f:"naʻau",ev:"keep",nodeal:!1},{w:"paʻapū",a:"paʻa",b:"pū?paʻapū",g:"dense, crowded; covered over",f:"hele",ev:"pending",nodeal:!1},{w:"paʻawaha",a:"paʻa",b:"waha#0",g:"a bridle",f:"hana",ev:"pending",nodeal:!0},{w:"paʻaʻili",a:"paʻa",b:"ʻili",g:"many-sided solid (geometry)",f:"hele",ev:"pending",nodeal:!0},{w:"paʻiaʻa",a:"paʻi?paʻiaʻa",b:"aʻa#0",g:"root system, rootlets",f:"ulu",ev:"pending",nodeal:!1},{w:"paʻi kiʻi",a:"paʻi",b:"kiʻi#0",g:"photograph; to take a picture",f:"hana",ev:"keep",nodeal:!1},{w:"paʻi ʻai",a:"paʻi?paʻiʻai",b:"ʻai",g:"hand-pounded, undiluted taro",f:"ulu",ev:"pending",nodeal:!1},{w:"pihalima",a:"piha",b:"lima",g:"a handful",f:"hele",ev:"pending",nodeal:!1},{w:"pīpīwai",a:"pipi#seep",b:"wai#0",g:"place where water oozes up",f:"ʻāina",ev:"pending",nodeal:!1},{w:"poʻohina",a:"poʻo",b:"hina#0",g:"gray-haired; gray with age",f:"kanaka",ev:"pending",nodeal:!1},{w:"poʻokepa",a:"poʻo",b:"kepa",g:"hair cut lopsided in mourning",f:"kanaka",ev:"pending",nodeal:!0},{w:"poʻopaʻa",a:"poʻo",b:"paʻa",g:"stocky hawkfish, a reef fish",f:"kai",ev:"keep",nodeal:!1},{w:"poʻowai",a:"poʻo",b:"wai#0",g:"headwaters; dam feeding an ʻauwai",f:"ʻāina",ev:"keep",nodeal:!1},{w:"poʻoʻōlelo",a:"poʻo",b:"ʻōlelo",g:"title or text of a discourse",f:"naʻau",ev:"pending",nodeal:!1},{w:"puakala",a:"pua",b:"kala#0",g:"Hawaiian prickly poppy",f:"ulu",ev:"pending",nodeal:!1},{w:"puapoʻo",a:"pua",b:"poʻo",g:"comb or crest of a bird",f:"lani",ev:"pending",nodeal:!1},{w:"pukahale",a:"puka",b:"hale",g:"window or doorway of a house",f:"hana",ev:"pending",nodeal:!1},{w:"pukaihu",a:"puka",b:"ihu",g:"nostril",f:"kanaka",ev:"pending",nodeal:!1},{w:"puka makani",a:"puka",b:"makani",g:"window; opening for ventilation",f:"hana",ev:"pending",nodeal:!1},{w:"puʻukani",a:"puʻu",b:"kani",g:"sweet-voiced; a singer",f:"naʻau",ev:"keep",nodeal:!1},{w:"puʻukaua",a:"puʻu",b:"kaua",g:"fortification; stronghold",f:"hana",ev:"pending",nodeal:!0},{w:"puʻukoko",a:"puʻu",b:"koko",g:"a clot of blood",f:"kanaka",ev:"pending",nodeal:!0},{w:"puʻuone",a:"puʻu",b:"one",g:"mound of sand; sand berm",f:"kai",ev:"keep",nodeal:!1},{w:"puʻuwai",a:"puʻu",b:"wai#0",g:"heart",f:"kanaka",ev:"keep",nodeal:!1},{w:"pākū",a:"pā#0",b:"kū#0",g:"partition, screen, curtain",f:"hana",ev:"keep",nodeal:!1},{w:"pāleo",a:"pā#4",b:"leo",g:"to converse; to debate",f:"naʻau",ev:"pending",nodeal:!1},{w:"pālāʻau",a:"pā#0",b:"lāʻau",g:"stick fence; wooden fence",f:"hana",ev:"pending",nodeal:!1},{w:"pānini",a:"pā#0",b:"nini#1",g:"cactus",f:"ulu",ev:"pending",nodeal:!0},{w:"pāpale aliʻi",a:"pāpale",b:"aliʻi",g:"crown; headdress of a king",f:"hana",ev:"pending",nodeal:!0},{w:"pīkai",a:"pī#sprinkle",b:"kai",g:"purify by sprinkling seawater",f:"naʻau",ev:"pending",nodeal:!1},{w:"pōhakuhele",a:"pōhaku",b:"hele",g:"small crab with stone-like shell",f:"kai",ev:"pending",nodeal:!1},{w:"pōhaku paʻa",a:"pōhaku",b:"paʻa",g:"hard stone, as for adzes",f:"ʻāina",ev:"keep",nodeal:!1},{w:"pōʻailani",a:"pōʻai",b:"lani",g:"horizon",f:"lani",ev:"keep",nodeal:!1},{w:"pōʻai lōʻihi",a:"pōʻai",b:"lōʻihi",g:"oval; ellipse",f:"hele",ev:"pending",nodeal:!0},{w:"pōʻai puni",a:"pōʻai",b:"puni#0",g:"to travel all around",f:"hele",ev:"pending",nodeal:!1},{w:"pōʻaono",a:"pō",b:"ʻaono",g:"Saturday",f:"hele",ev:"keep",nodeal:!0},{w:"pōʻele",a:"pō",b:"ʻele",g:"black, dark; dark night",f:"lani",ev:"keep",nodeal:!1},{w:"uhikino",a:"uhi#1",b:"kino",g:"body covering; shield; outer garment",f:"hana",ev:"pending",nodeal:!1},{w:"ululāʻau",a:"ulu#0",b:"lāʻau",g:"forest; thicket of trees",f:"ulu",ev:"keep",nodeal:!1},{w:"uluwehi",a:"ulu#0",b:"wehi",g:"lush growth",f:"ulu",ev:"keep",nodeal:!1},{w:"wahahewa",a:"waha#0",b:"hewa",g:"wicked, false speech",f:"naʻau",ev:"pending",nodeal:!1},{w:"wahaheʻe",a:"waha#0",b:"heʻe#1",g:"to lie; deceitful",f:"naʻau",ev:"keep",nodeal:!1},{w:"waiea",a:"wai#0",b:"ea",g:"ceremonial water at a heiau",f:"naʻau",ev:"pending",nodeal:!1},{w:"waihoʻoluʻu",a:"wai#0",b:"hoʻoluʻu",g:"dye; color",f:"hana",ev:"keep",nodeal:!1},{w:"waikai",a:"wai#0",b:"kai",g:"brackish water",f:"kai",ev:"pending",nodeal:!1},{w:"wailana",a:"wai#0",b:"lana#0",g:"still, calm water",f:"kai",ev:"pending",nodeal:!0},{w:"wailele",a:"wai#0",b:"lele",g:"waterfall",f:"ʻāina",ev:"keep",nodeal:!1},{w:"waimaka",a:"wai#0",b:"maka#0",g:"tears",f:"kanaka",ev:"keep",nodeal:!1},{w:"waipaʻa",a:"wai#0",b:"paʻa",g:"ice; frozen water",f:"ʻāina",ev:"pending",nodeal:!1},{w:"waipiʻi",a:"wai#0",b:"piʻi#0",g:"flood; overflowing water",f:"ʻāina",ev:"pending",nodeal:!1},{w:"wai puna",a:"wai#0",b:"puna#0",g:"spring water",f:"ʻāina",ev:"keep",nodeal:!1},{w:"wai ua",a:"wai#0",b:"ua",g:"rainwater; water from the clouds",f:"lani",ev:"pending",nodeal:!1},{w:"waiū",a:"wai#0",b:"ū#0",g:"milk",f:"kanaka",ev:"keep",nodeal:!1},{w:"waiʻele",a:"wai#0",b:"ʻele",g:"dye for kapa",f:"hana",ev:"pending",nodeal:!1},{w:"waʻapā",a:"waʻa",b:"pā#plate",g:"rowboat; skiff of boards",f:"hana",ev:"pending",nodeal:!0},{w:"wiliau",a:"wili",b:"au",g:"eddy; swirling motion",f:"hele",ev:"pending",nodeal:!1},{w:"ʻahakanaka",a:"ʻaha#0",b:"kanaka",g:"a great company, multitude",f:"kanaka",ev:"pending",nodeal:!1},{w:"ʻaha mele",a:"ʻaha#0",b:"mele#0",g:"concert",f:"naʻau",ev:"keep",nodeal:!1},{w:"ʻahaʻōlelo",a:"ʻaha#0",b:"ʻōlelo",g:"council; legislature",f:"kanaka",ev:"keep",nodeal:!1},{w:"ʻahuao",a:"ʻahu",b:"ao?ʻahuao",g:"mat of young lauhala leaves",f:"hana",ev:"pending",nodeal:!1},{w:"ʻahu ʻula",a:"ʻahu",b:"ʻula#0",g:"feather cloak of high chiefs",f:"hana",ev:"keep",nodeal:!1},{w:"ʻahainu",a:"ʻaha#0",b:"inu",g:"a gathering for drinking",f:"ulu",ev:"pending",nodeal:!1},{w:"ʻahālike",a:"ʻahā",b:"like",g:"square, four equal sides",f:"hele",ev:"pending",nodeal:!1},{w:"ʻahaʻaina",a:"ʻaha#0",b:"ʻaina#0",g:"feast, banquet",f:"ulu",ev:"keep",nodeal:!1},{w:"ʻaialo",a:"ʻai",b:"alo",g:"attendants of a chief",f:"kanaka",ev:"pending",nodeal:!1},{w:"ʻai kapu",a:"ʻai",b:"kapu#0",g:"observing the sacred eating restrictions",f:"naʻau",ev:"keep",nodeal:!1},{w:"ʻauinalā",a:"ʻauina",b:"lā#1",g:"afternoon",f:"hele",ev:"keep",nodeal:!1},{w:"ʻauinapō",a:"ʻauina",b:"pō",g:"late night",f:"hele",ev:"pending",nodeal:!1},{w:"ʻaulike",a:"ʻau#1",b:"like",g:"to swim abreast, evenly",f:"hele",ev:"pending",nodeal:!1},{w:"ʻaulima",a:"ʻau#0",b:"lima",g:"hand stick for making fire",f:"hana",ev:"keep",nodeal:!1},{w:"ʻaumakua",a:"ʻau?ʻaumakua",b:"makua",g:"family or personal god",f:"naʻau",ev:"keep",nodeal:!1},{w:"ʻaumoana",a:"ʻau#group",b:"moana#0",g:"sailor; one long at sea",f:"kai",ev:"pending",nodeal:!1},{w:"ʻauwai",a:"ʻau?ʻauwai",b:"wai#0",g:"irrigation ditch; watercourse",f:"ʻāina",ev:"pending",nodeal:!1},{w:"ʻaʻaniu",a:"ʻaʻa#0",b:"niu#0",g:"clothlike sheath at coconut-frond base",f:"ulu",ev:"pending",nodeal:!1},{w:"ʻaʻapua",a:"ʻaʻa#0",b:"pua",g:"quiver; arrow case",f:"hana",ev:"pending",nodeal:!1},{w:"ʻikepili",a:"ʻike",b:"pili",g:"data",f:"naʻau",ev:"keep",nodeal:!0},{w:"ʻilikai",a:"ʻili",b:"kai",g:"surface of the sea; sea level",f:"kai",ev:"keep",nodeal:!1},{w:"ʻililua",a:"ʻili",b:"lua#0",g:"new skin after healing; aged skin",f:"kanaka",ev:"pending",nodeal:!1},{w:"ʻohākulaʻi",a:"ʻohā",b:"kulaʻi",g:"break young taro from parent corm",f:"ulu",ev:"pending",nodeal:!1},{w:"ʻoihana",a:"ʻoi",b:"hana#0",g:"occupation, trade; department, office",f:"hana",ev:"keep",nodeal:!1},{w:"ʻuala kahiki",a:"ʻuala",b:"kahiki#0",g:"potato (the Irish potato)",f:"ulu",ev:"keep",nodeal:!0},{w:"ʻuku kapa",a:"ʻuku#0",b:"kapa",g:"body louse",f:"kanaka",ev:"pending",nodeal:!1},{w:"ʻukulele",a:"ʻuku#0",b:"lele",g:"ukulele, small four-stringed instrument",f:"naʻau",ev:"keep",nodeal:!0},{w:"ʻuku poʻo",a:"ʻuku#0",b:"poʻo",g:"head louse",f:"kanaka",ev:"pending",nodeal:!1},{w:"ʻulu kahiki",a:"ʻulu",b:"kahiki#0",g:"foreign breadfruit tree",f:"ulu",ev:"pending",nodeal:!0},{w:"ʻōlelo aʻo",a:"ʻōlelo",b:"aʻo",g:"counsel, advice; teachings",f:"naʻau",ev:"pending",nodeal:!1},{w:"ʻōlelo paʻa",a:"ʻōlelo",b:"paʻa",g:"a precept; a command",f:"naʻau",ev:"pending",nodeal:!1},{w:"ʻōpūao",a:"ʻōpū",b:"ao#0",g:"wise-hearted, knowing, intelligent",f:"naʻau",ev:"pending",nodeal:!1},{w:"ʻōpūhue",a:"ʻōpū",b:"hue",g:"a round, flat calabash",f:"hana",ev:"pending",nodeal:!1},{w:"aheahe",a:"ahe",b:"ahe",g:"gentle breeze",f:"lani",ev:"pending",nodeal:!1},{w:"akaaka",a:"aka#bright",b:"aka#bright",g:"clear, bright, luminous",f:"lani",ev:"pending",nodeal:!1},{w:"aniani",a:"ani",b:"ani",g:"cool; blowing softly",f:"lani",ev:"pending",nodeal:!1},{w:"anuanu",a:"anu",b:"anu",g:"cold, chilly",f:"lani",ev:"keep",nodeal:!1},{w:"auau",a:"au",b:"au",g:"hasten, move swiftly",f:"hele",ev:"pending",nodeal:!1},{w:"hakahaka",a:"haka#1",b:"haka#1",g:"empty space, gap, vacancy",f:"ʻāina",ev:"keep",nodeal:!1},{w:"hakuhaku",a:"haku#1",b:"haku#1",g:"lumpy, full of hard lumps",f:"ʻāina",ev:"keep",nodeal:!1},{w:"halahala",a:"hala#0",b:"hala#0",g:"fault-finding, criticism",f:"naʻau",ev:"keep",nodeal:!1},{w:"hanahana",a:"hana#1",b:"hana#1",g:"hot, warm; heated",f:"lani",ev:"pending",nodeal:!1},{w:"hanohano",a:"hano#0",b:"hano#0",g:"honored, dignified; glory",f:"naʻau",ev:"pending",nodeal:!1},{w:"hauhau",a:"hau#0",b:"hau#0",g:"cold (of food)",f:"ulu",ev:"pending",nodeal:!1},{w:"haʻahaʻa",a:"haʻa",b:"haʻa",g:"low; humble, modest",f:"naʻau",ev:"keep",nodeal:!1},{w:"haʻihaʻi",a:"haʻi",b:"haʻi",g:"brittle; to break in pieces",f:"hana",ev:"pending",nodeal:!1},{w:"heahea",a:"hea#0",b:"hea#0",g:"to call in, welcome; hospitable",f:"naʻau",ev:"keep",nodeal:!1},{w:"heluhelu",a:"helu#0",b:"helu#0",g:"to read; to count",f:"naʻau",ev:"pending",nodeal:!1},{w:"hemahema",a:"hema",b:"hema",g:"awkward, clumsy; unskilled",f:"hana",ev:"pending",nodeal:!1},{w:"henehene",a:"hene",b:"hene",g:"to tease, laugh at",f:"naʻau",ev:"keep",nodeal:!1},{w:"hinahina",a:"hina#0",b:"hina#0",g:"a Pacific heliotrope; grayish",f:"ulu",ev:"pending",nodeal:!1},{w:"hinuhinu",a:"hinu",b:"hinu",g:"bright, glossy, shining",f:"lani",ev:"keep",nodeal:!1},{w:"hiʻuhiʻu",a:"hiʻu",b:"hiʻu",g:"loose ends left after plaiting",f:"hana",ev:"pending",nodeal:!1},{w:"hoehoe",a:"hoe",b:"hoe",g:"to paddle, as a canoe",f:"hana",ev:"keep",nodeal:!1},{w:"holoholo",a:"holo#0",b:"holo#0",g:"to go out walking, riding, sailing",f:"hele",ev:"keep",nodeal:!1},{w:"hopohopo",a:"hopo",b:"hopo",g:"anxious, fearful; anxiety",f:"naʻau",ev:"pending",nodeal:!1},{w:"hoʻihoʻi",a:"hoʻi",b:"hoʻi",g:"to return, bring back, restore",f:"hele",ev:"keep",nodeal:!1},{w:"huihui",a:"hui",b:"hui",g:"mixed, mingled; a cluster",f:"kanaka",ev:"keep",nodeal:!1},{w:"hulihuli",a:"huli#0",b:"huli#0",g:"to turn over and over",f:"hele",ev:"keep",nodeal:!1},{w:"huluhulu",a:"hulu#0",b:"hulu#0",g:"fleece, wool; hairy, downy",f:"hana",ev:"keep",nodeal:!1},{w:"humuhumu",a:"humu",b:"humu",g:"to sew, stitch together",f:"hana",ev:"pending",nodeal:!1},{w:"hunahuna",a:"huna#0",b:"huna#0",g:"crumbs, particles, scraps",f:"ʻāina",ev:"keep",nodeal:!1},{w:"huʻahuʻa",a:"huʻa",b:"huʻa",g:"foam, froth",f:"kai",ev:"keep",nodeal:!1},{w:"huʻihuʻi",a:"huʻi#cold",b:"huʻi#cold",g:"cold, chilly",f:"lani",ev:"pending",nodeal:!1},{w:"hāhā",a:"hā#2",b:"hā#2",g:"native lobelias; Gunnera plants",f:"ulu",ev:"pending",nodeal:!1},{w:"iheihe",a:"ihe#fish",b:"ihe#fish",g:"halfbeak, a fish",f:"kai",ev:"pending",nodeal:!1},{w:"ihoiho",a:"iho#0",b:"iho#0",g:"heartwood, core of a tree",f:"ulu",ev:"keep",nodeal:!1},{w:"ikaika",a:"ika",b:"ika",g:"strong; strength",f:"kanaka",ev:"pending",nodeal:!1},{w:"kahakaha",a:"kaha#0",b:"kaha#0",g:"to draw lines; engrave; striped",f:"hana",ev:"keep",nodeal:!1},{w:"kalakala",a:"kala#0",b:"kala#0",g:"thorny, rough, craggy",f:"ʻāina",ev:"keep",nodeal:!1},{w:"kaukau",a:"kau#2",b:"kau#2",g:"to counsel, reason with",f:"naʻau",ev:"pending",nodeal:!1},{w:"kaʻikaʻi",a:"kaʻi",b:"kaʻi",g:"to lift up, carry, lead",f:"hele",ev:"keep",nodeal:!1},{w:"keʻokeʻo",a:"keʻo",b:"keʻo",g:"white",f:"lani",ev:"pending",nodeal:!1},{w:"kihikihi",a:"kihi",b:"kihi",g:"angular, full of corners",f:"hana",ev:"pending",nodeal:!1},{w:"kikokiko",a:"kiko",b:"kiko",g:"dotted, spotted, speckled",f:"lani",ev:"keep",nodeal:!1},{w:"kilakila",a:"kila#0",b:"kila#0",g:"majestic, imposing",f:"ʻāina",ev:"keep",nodeal:!1},{w:"kiʻekiʻe",a:"kiʻe",b:"kiʻe",g:"high, lofty; height",f:"ʻāina",ev:"keep",nodeal:!1},{w:"kolokolo",a:"kolo",b:"kolo",g:"any creeping vine",f:"ulu",ev:"keep",nodeal:!1},{w:"konakona",a:"kona#1",b:"kona#1",g:"rough, uneven; muscular",f:"ʻāina",ev:"pending",nodeal:!1},{w:"konākonā",a:"konā",b:"konā",g:"dislike, contempt",f:"naʻau",ev:"keep",nodeal:!1},{w:"koʻokoʻo",a:"koʻo",b:"koʻo",g:"cane, staff; support, prop",f:"hana",ev:"keep",nodeal:!1},{w:"kupukupu",a:"kupu",b:"kupu",g:"to surge forth; sword fern",f:"ulu",ev:"keep",nodeal:!1},{w:"kuʻukuʻu",a:"kuʻu",b:"kuʻu",g:"to lower bit by bit",f:"hele",ev:"pending",nodeal:!1},{w:"kōkō",a:"kō#1",b:"kō#1",g:"to fulfill; to be pregnant",f:"kanaka",ev:"pending",nodeal:!1},{w:"kūkākūkā",a:"kūkā",b:"kūkā",g:"to discuss, consult together",f:"naʻau",ev:"keep",nodeal:!1},{w:"lahalaha",a:"laha",b:"laha",g:"spread over, as brooding wings",f:"ulu",ev:"pending",nodeal:!1},{w:"lahilahi",a:"lahi",b:"lahi",g:"thin, delicate; thinness",f:"hana",ev:"keep",nodeal:!1},{w:"lamalama",a:"lama#0",b:"lama#0",g:"torch fishing; glowing",f:"kai",ev:"keep",nodeal:!1},{w:"laulau",a:"lau#0",b:"lau#0",g:"food bundle wrapped in leaves",f:"ulu",ev:"pending",nodeal:!1},{w:"lehulehu",a:"lehu#number",b:"lehu#number",g:"multitude, crowd; the public",f:"kanaka",ev:"pending",nodeal:!1},{w:"lenalena",a:"lena",b:"lena",g:"orange-yellow, yellow",f:"lani",ev:"keep",nodeal:!1},{w:"leoleo",a:"leo",b:"leo",g:"to speak loudly",f:"naʻau",ev:"keep",nodeal:!1},{w:"lihilihi",a:"lihi",b:"lihi",g:"eyelashes; eyelids",f:"kanaka",ev:"pending",nodeal:!1},{w:"likiliki",a:"liki",b:"liki",g:"tight; tied on tightly",f:"hana",ev:"pending",nodeal:!1},{w:"limalima",a:"lima",b:"lima",g:"to handle, work with the hands",f:"hana",ev:"keep",nodeal:!1},{w:"linolino",a:"lino",b:"lino",g:"calm, unruffled; bright",f:"naʻau",ev:"pending",nodeal:!1},{w:"liʻiliʻi",a:"liʻi#0",b:"liʻi#0",g:"small, little; few",f:"hele",ev:"keep",nodeal:!1},{w:"lohelohe",a:"lohe",b:"lohe",g:"to hear often, repeatedly",f:"naʻau",ev:"pending",nodeal:!1},{w:"makamaka",a:"maka#0",b:"maka#0",g:"buds, as on a taro corm",f:"ulu",ev:"pending",nodeal:!1},{w:"manamana",a:"mana#1",b:"mana#1",g:"fingers, toes; branches",f:"kanaka",ev:"keep",nodeal:!1},{w:"maʻamaʻa",a:"maʻa",b:"maʻa",g:"accustomed, experienced",f:"naʻau",ev:"keep",nodeal:!1},{w:"maʻomaʻo",a:"maʻo#0",b:"maʻo#0",g:"green, greenness",f:"ulu",ev:"keep",nodeal:!1},{w:"mehameha",a:"meha",b:"meha",g:"loneliness, solitude",f:"naʻau",ev:"pending",nodeal:!1},{w:"melemele",a:"mele#1",b:"mele#1",g:"yellow, light yellow",f:"lani",ev:"keep",nodeal:!1},{w:"mikomiko",a:"miko",b:"miko",g:"lightly salted; savoury",f:"ulu",ev:"keep",nodeal:!1},{w:"milimili",a:"mili",b:"mili",g:"examine admiringly; a cherished favourite",f:"naʻau",ev:"pending",nodeal:!1},{w:"mūmū",a:"mū#4",b:"mū#4",g:"to be silent; to hum",f:"naʻau",ev:"pending",nodeal:!1},{w:"nahenahe",a:"nahe",b:"nahe",g:"soft, gentle; sweet-sounding",f:"naʻau",ev:"pending",nodeal:!1},{w:"naunau",a:"nau",b:"nau",g:"to chew, munch",f:"kanaka",ev:"pending",nodeal:!1},{w:"nihoniho",a:"niho",b:"niho",g:"toothed, notched, serrated",f:"hana",ev:"keep",nodeal:!1},{w:"noʻonoʻo",a:"noʻo",b:"noʻo",g:"to think, reflect; thought",f:"naʻau",ev:"pending",nodeal:!1},{w:"nūnū",a:"nū",b:"nū",g:"pigeon, dove",f:"lani",ev:"pending",nodeal:!1},{w:"okaoka",a:"oka",b:"oka",g:"bits, particles; dust",f:"ʻāina",ev:"keep",nodeal:!1},{w:"paepae",a:"pae#1",b:"pae#1",g:"platform, pavement; prop, support",f:"hana",ev:"keep",nodeal:!1},{w:"pakapaka",a:"paka#4",b:"paka#4",g:"patter of heavy raindrops",f:"lani",ev:"pending",nodeal:!1},{w:"panepane",a:"pane",b:"pane",g:"to talk back",f:"naʻau",ev:"keep",nodeal:!1},{w:"pekapeka",a:"peka",b:"peka",g:"to tattle; tattler",f:"naʻau",ev:"pending",nodeal:!1},{w:"pekupeku",a:"peku",b:"peku",g:"to kick again and again",f:"hele",ev:"keep",nodeal:!1},{w:"pilipili",a:"pili",b:"pili",g:"clinging, sticking close; connected",f:"kanaka",ev:"pending",nodeal:!1},{w:"piopio",a:"pio#2",b:"pio#2",g:"chick; call for chickens",f:"lani",ev:"pending",nodeal:!1},{w:"poepoe",a:"poe#0",b:"poe#0",g:"round; a sphere, globe",f:"hele",ev:"keep",nodeal:!1},{w:"ponopono",a:"pono",b:"pono",g:"neat, tidy, in order",f:"naʻau",ev:"keep",nodeal:!1},{w:"pulepule",a:"pule#1",b:"pule#1",g:"spotted, speckled",f:"lani",ev:"keep",nodeal:!1},{w:"punipuni",a:"puni#1",b:"puni#1",g:"to lie, tell falsehoods",f:"naʻau",ev:"keep",nodeal:!1},{w:"puʻupuʻu",a:"puʻu",b:"puʻu",g:"lumpy; heaped up",f:"ʻāina",ev:"keep",nodeal:!1},{w:"pūpū",a:"pū#1",b:"pū#1",g:"shells; shell beads",f:"kai",ev:"keep",nodeal:!1},{w:"uhiuhi",a:"uhi#1",b:"uhi#1",g:"cover over, as a makeshift",f:"hana",ev:"pending",nodeal:!1},{w:"uliuli",a:"uli#0",b:"uli#0",g:"dark colour: blue, green, black",f:"lani",ev:"keep",nodeal:!1},{w:"waiwai",a:"wai#1",b:"wai#1",g:"goods, wealth; to be rich",f:"hana",ev:"pending",nodeal:!1},{w:"wanawana",a:"wana",b:"wana",g:"spiny, thorny",f:"kai",ev:"keep",nodeal:!1},{w:"wehewehe",a:"wehe",b:"wehe",g:"explain; open up, pull apart",f:"naʻau",ev:"keep",nodeal:!1},{w:"weluwelu",a:"welu",b:"welu",g:"torn to shreds, ragged",f:"hana",ev:"pending",nodeal:!1},{w:"wikiwiki",a:"wiki",b:"wiki",g:"quick, speedy; to hurry",f:"hele",ev:"keep",nodeal:!1},{w:"wiliwili",a:"wili",b:"wili",g:"stir round; whirl about",f:"hele",ev:"pending",nodeal:!1},{w:"wīwī",a:"wī#famine",b:"wī#famine",g:"thin, slender",f:"kanaka",ev:"pending",nodeal:!1},{w:"ʻahaʻaha",a:"ʻaha#1",b:"ʻaha#1",g:"cordage",f:"hana",ev:"keep",nodeal:!1},{w:"ʻakaʻaka",a:"ʻaka",b:"ʻaka",g:"laughter; to laugh",f:"naʻau",ev:"keep",nodeal:!1},{w:"ʻakiʻaki",a:"ʻaki#0",b:"ʻaki#0",g:"nibble, snap again and again",f:"kai",ev:"keep",nodeal:!1},{w:"ʻaleʻale",a:"ʻale",b:"ʻale",g:"rippling, stirring, as water",f:"kai",ev:"keep",nodeal:!1},{w:"ʻaloʻalo",a:"ʻalo",b:"ʻalo",g:"dodge again and again",f:"hele",ev:"keep",nodeal:!1},{w:"ʻaluʻalu",a:"ʻalu",b:"ʻalu",g:"loose, slack; wrinkled",f:"kanaka",ev:"keep",nodeal:!1},{w:"ʻapeʻape",a:"ʻape",b:"ʻape",g:"Gunnera, a giant-leafed plant",f:"ulu",ev:"keep",nodeal:!1},{w:"ʻauʻau",a:"ʻau#1",b:"ʻau#1",g:"to bathe; to swim",f:"kai",ev:"pending",nodeal:!1},{w:"ʻawaʻawa",a:"ʻawa#bitter",b:"ʻawa#bitter",g:"sour, bitter",f:"ulu",ev:"keep",nodeal:!1},{w:"ʻehaʻeha",a:"ʻeha",b:"ʻeha",g:"great pain; sorrow",f:"kanaka",ev:"keep",nodeal:!1},{w:"ʻekeʻeke",a:"ʻeke#cringe",b:"ʻeke#cringe",g:"fussy, over-exacting",f:"naʻau",ev:"pending",nodeal:!1},{w:"ʻeleʻele",a:"ʻele",b:"ʻele",g:"black, dark",f:"lani",ev:"keep",nodeal:!1},{w:"ʻieʻie",a:"ʻie",b:"ʻie",g:"a woody climbing vine (Freycinetia)",f:"ulu",ev:"pending",nodeal:!1},{w:"ʻikeʻike",a:"ʻike",b:"ʻike",g:"to see, to perceive",f:"naʻau",ev:"pending",nodeal:!1},{w:"ʻimoʻimo",a:"ʻimo",b:"ʻimo",g:"to twinkle, as stars",f:"lani",ev:"pending",nodeal:!1},{w:"ʻinoʻino",a:"ʻino",b:"ʻino",g:"spoiled, broken, damaged",f:"naʻau",ev:"keep",nodeal:!1},{w:"ʻiwaʻiwa",a:"ʻiwa#fern",b:"ʻiwa#fern",g:"maidenhair fern",f:"ulu",ev:"pending",nodeal:!1},{w:"ʻoheʻohe",a:"ʻohe",b:"ʻohe",g:"a tall native tree",f:"ulu",ev:"pending",nodeal:!1},{w:"ʻoliʻoli",a:"ʻoli",b:"ʻoli",g:"joy, delight; joyful",f:"naʻau",ev:"keep",nodeal:!1},{w:"ʻoluʻolu",a:"ʻolu",b:"ʻolu",g:"pleasant, nice; comfortable",f:"naʻau",ev:"pending",nodeal:!1},{w:"ʻonaʻona",a:"ʻona",b:"ʻona",g:"dizzy, faint",f:"kanaka",ev:"pending",nodeal:!1},{w:"ʻoniʻoni",a:"ʻoni",b:"ʻoni",g:"move back and forth; wiggle",f:"hele",ev:"pending",nodeal:!1},{w:"ʻopiʻopi",a:"ʻopi",b:"ʻopi",g:"to fold, as cloth",f:"hana",ev:"keep",nodeal:!1},{w:"ʻukiʻuki",a:"ʻuki",b:"ʻuki",g:"a native flax lily (Dianella)",f:"ulu",ev:"pending",nodeal:!1},{w:"ʻulaʻula",a:"ʻula#0",b:"ʻula#0",g:"red, reddish",f:"lani",ev:"keep",nodeal:!1},{w:"ʻēʻē",a:"ʻē#1",b:"ʻē#1",g:"peculiar; contrary, opposite",f:"naʻau",ev:"keep",nodeal:!1},{w:"ʻōʻō",a:"ʻō#0",b:"ʻō#0",g:"digging stick",f:"hana",ev:"keep",nodeal:!1}],vh={"aho#1":{s:"aho",g:"breath",pp:"PCE *aho",cog:[["Tahitian","aho"]]},loa:{s:"loa",g:"long",pp:"PPN *loa",cog:[["Māori","roa"],["Tahitian","roa"],["Sāmoan","loa"]]},nui:{s:"nui",g:"big, great",pp:"PNP *nui",cog:[["Māori","nui"],["Tahitian","nui"],["Sāmoan","nui"]]},ahu:{s:"ahu",g:"heap, cairn",pp:"PPN *qafu",cog:[["Māori","ahu"],["Tahitian","ahu"],["Rapa Nui","ahu"]]},puaʻa:{s:"puaʻa",g:"pig",pp:"PPN *puaka",cog:[["Tahitian","puaʻa"],["Sāmoan","puaʻa"],["Tongan","puaka"]]},ake:{s:"ake",g:"liver; desire",pp:"PPN *qate",cog:[["Māori","ate"],["Tahitian","ate"],["Sāmoan","ate"]]},akamai:{s:"akamai",g:"clever, smart",pp:"PPN *qatamai",cog:[["Māori","atamai"],["Sāmoan","atamai"],["Tongan","ʻatamai"]]},māmā:{s:"māmā",g:"light (weight)",pp:"PPN *maqa-maqa",cog:[["Māori","māmā"],["Tahitian","māmā"],["Sāmoan","māmā"]]},"ala#0":{s:"ala",g:"path, road",pp:"PPN *hala",cog:[["Māori","ara"],["Tahitian","ara"],["Sāmoan","ala"]]},"haka#0":{s:"haka",g:"shelf, perch",pp:"PPN *fata",cog:[["Māori","whata"],["Tahitian","fata"],["Sāmoan","fata"]]},"hao#0":{s:"hao",g:"iron",pp:"PPN *faqo",cog:[["Māori","whao"],["Tahitian","fao"],["Sāmoan","fao"]]},kaʻi:{s:"kaʻi",g:"lead",pp:"PPN *taki",cog:[["Māori","taki"],["Sāmoan","taʻi"],["Tongan","taki"]]},"piʻi#0":{s:"piʻi",g:"climb, rise",pp:"PEP *piki",cog:[["Māori","piki"],["Rapa Nui","piki"]]},"wai#0":{s:"wai",g:"water",pp:"PPN *wai",cog:[["Māori","wai"],["Tahitian","vai"],["Sāmoan","vai"]]},"ʻula?alaʻula":{s:"ula",g:"",pp:"",cog:[]},aliʻi:{s:"aliʻi",g:"chief",pp:"PPN *qariki",cog:[["Māori","ariki"],["Tahitian","ariʻi"],["Sāmoan","aliʻi"]]},wahine:{s:"wahine",g:"woman, female",pp:"PCE *wahine",cog:[["Māori","wahine"],["Tahitian","vahine"],["Marquesan","vehine"]]},"ana#1":{s:"ana",g:"measure",pp:"PPN *haŋa",cog:[["Sāmoan","aga"],["Tongan","hanga"]]},manaʻo:{s:"manaʻo",g:"thought",pp:"PPN *manako",cog:[["Māori","manako"],["Tahitian","manaʻo"],["Sāmoan","manaʻo"]]},"puni#0":{s:"puni",g:"surrounded, around",pp:"PPN *puni",cog:[["Māori","puni"],["Sāmoan","puni"],["Tongan","punipuni"]]},waena:{s:"waena",g:"middle",pp:"PPN *wahe-ŋa",cog:[["Māori","waenga"],["Sāmoan","vāega"],["Tongan","vāhenga"]]},ʻāina:{s:"ʻāina",g:"land",pp:"PPN *kaaiŋa",cog:[["Māori","kāinga"],["Tahitian","ʻāiʻa"],["Sāmoan","ʻāiga"]]},"ao#2":{s:"ao",g:"cloud",pp:"PPN *qao",cog:[["Māori","ao"],["Tahitian","ao"],["Sāmoan","ao"]]},"uli#0":{s:"uli",g:"dark, deep blue",pp:"PPN *quli",cog:[["Māori","uri"],["Tahitian","uri"],["Sāmoan","uli"]]},au:{s:"au",g:"current",pp:"PPN *qau",cog:[["Māori","au"],["Tongan","ʻau"],["Marquesan","au"]]},"miki#0":{s:"miki",g:"recede, suck in",pp:"PPN *miti",cog:[["Māori","miti"],["Tahitian","miti"],["Sāmoan","miti"]]},"au?aumoe":{s:"au",g:"arrive, reach",pp:"",cog:[]},moe:{s:"moe",g:"sleep, lie down",pp:"PPN *mohe",cog:[["Māori","moe"],["Tahitian","moe"],["Sāmoan","moe"]]},"ʻau#group":{s:"ʻau",g:"group",pp:"PPN *kau",cog:[["Māori","kau"],["Sāmoan","ʻau"],["Tongan","kau"]]},waʻa:{s:"waʻa",g:"canoe",pp:"PPN *waka",cog:[["Māori","waka"],["Tahitian","vaʻa"],["Sāmoan","vaʻa"]]},"aʻa#0":{s:"aʻa",g:"root, vein",pp:"PPN *aka",cog:[["Māori","aka"],["Tahitian","aʻa"],["Sāmoan","aʻa"]]},koko:{s:"koko",g:"blood",pp:"PPN *toto",cog:[["Māori","toto"],["Tahitian","toto"],["Sāmoan","toto"]]},lele:{s:"lele",g:"fly, leap",pp:"PPN *lele",cog:[["Māori","rere"],["Sāmoan","lele"],["Tahitian","rere"]]},lolo:{s:"lolo",g:"brain",pp:"PEP *roro",cog:[["Māori","roro"],["Tahitian","roro"],["Rapa Nui","roro"]]},"hai#0":{s:"hai",g:"offering",pp:"PNP *faqi",cog:[["Māori","whai"]]},"pule#0":{s:"pule",g:"prayer",pp:"PPN *pule",cog:[["Māori","pure"],["Tahitian","pure"],["Sāmoan","pule"]]},"kau#1":{s:"kau",g:"place, hang",pp:"PPN *tau",cog:[["Māori","tautau"],["Sāmoan","tau"],["Tongan","tau"]]},"haka?hakamoa":{s:"haka",g:"quarrel",pp:"",cog:[]},moa:{s:"moa",g:"fowl, chicken",pp:"PPN *moa",cog:[["Māori","moa"],["Sāmoan","moa"],["Tongan","moa"]]},"haku#0":{s:"haku",g:"master, owner",pp:"PCE *fatu",cog:[["Tahitian","fatu"]]},hale:{s:"hale",g:"house",pp:"PPN *fale",cog:[["Māori","whare"],["Tahitian","fare"],["Sāmoan","fale"]]},"haku#2":{s:"haku",g:"compose, arrange",pp:"PPN *fatu",cog:[["Sāmoan","fatu"],["Tongan","fatu"]]},"mele#0":{s:"mele",g:"song, chant",pp:"PNP *umele",cog:[["Māori","umere"]]},ʻōlelo:{s:"ʻōlelo",g:"speech, word",pp:"PNP *koo-lelo",cog:[["Māori","kōrero"],["Tahitian","ʻōrero"]]},kaua:{s:"kaua",g:"war",pp:"PPN *tau-qa",cog:[["Māori","taua"],["Tahitian","taua"],["Sāmoan","taua"]]},"kaʻa#0":{s:"kaʻa",g:"roll, turn",pp:"PPN *taka",cog:[["Māori","taka"],["Tahitian","taʻa"],["Sāmoan","taʻa"]]},"kia#0":{s:"kia",g:"pillar, mast",pp:"PPN *tia",cog:[["Māori","tia"]]},"lana#0":{s:"lana",g:"floating",pp:"PNP *laŋa",cog:[["Māori","ranga"]]},lewa:{s:"lewa",g:"floating; sky",pp:"PNP *lewa",cog:[["Māori","rewa"],["Tahitian","reva"],["Rapa Nui","reva"]]},lole:{s:"lole",g:"cloth; reversed",pp:"",cog:[]},lāʻau:{s:"lāʻau",g:"tree, wood",pp:"PPN *raqa-kau",cog:[["Māori","rākau"],["Tahitian","rāʻau"],["Tongan","ʻakau"]]},malu:{s:"malu",g:"shade, shelter",pp:"PPN *malu",cog:[["Māori","maru"],["Tahitian","maru"],["Sāmoan","malu"]]},mākaʻi:{s:"mākaʻi",g:"police, inspect",pp:"PPN *maata-ki",cog:[["Māori","mātaki"],["Tahitian","mātaʻitaʻi"]]},piʻo:{s:"piʻo",g:"bent, arched",pp:"PPN *piko",cog:[["Māori","piko"],["Sāmoan","piʻo"],["Tongan","piko"]]},hamo:{s:"hamo",g:"smear, rub on",pp:"",cog:[]},"ʻula#0":{s:"ʻula",g:"red",pp:"PPN *kula",cog:[["Māori","kura"],["Tahitian","ʻura"],["Sāmoan","ʻula"]]},"hana#0":{s:"hana",g:"work, do",pp:"PPN *saŋa",cog:[["Māori","hanga"],["Tahitian","haʻa"],["Tongan","hanga"]]},"mana#0":{s:"mana",g:"power",pp:"PPN *mana",cog:[["Māori","mana"],["Tahitian","mana"],["Sāmoan","mana"]]},hanu:{s:"hanu",g:"breath, breathe",pp:"PPN *faŋu",cog:[["Sāmoan","fagufagu"],["Tongan","fangu"]]},paʻa:{s:"paʻa",g:"firm, solid",pp:"PPN *paka",cog:[["Māori","paka"],["Tahitian","paʻapaʻa"],["Rapa Nui","pakapaka"]]},"waha#0":{s:"waha",g:"mouth",pp:"PCE *waha",cog:[["Māori","waha"],["Tahitian","vaha"]]},"hau#0":{s:"hau",g:"dew, frost",pp:"PPN *sau",cog:[["Tahitian","hau"],["Sāmoan","sau"],["Rapa Nui","hau"]]},"pia#0":{s:"pia",g:"arrowroot, starch",pp:"PPN *pia",cog:[["Tahitian","pia"],["Sāmoan","pia"],["Rapa Nui","pia"]]},ʻeli:{s:"ʻeli",g:"dig",pp:"PPN *keli",cog:[["Māori","keri"],["Sāmoan","ʻeli"],["Tongan","keli"]]},"hau#mood":{s:"hau",g:"temperament",pp:"PPN *sau",cog:[]},ʻoli:{s:"ʻoli",g:"joy",pp:"PPN *koli",cog:[["Tahitian","ʻori"],["Sāmoan","ʻoliʻoli"],["Rapa Nui","kori"]]},heihei:{s:"heihei",g:"race",pp:"",cog:[]},"nalu#0":{s:"nalu",g:"wave, surf",pp:"PPN *ŋalu",cog:[["Māori","ngaru"],["Sāmoan","galu"],["Tongan","ngalu"]]},hele:{s:"hele",g:"go, walk",pp:"",cog:[["Marquesan","heʻe"]]},"kū#0":{s:"kū",g:"stand",pp:"PPN *tuqu",cog:[["Māori","tū"],["Sāmoan","tū"],["Tahitian","tū"]]},"heʻe#1":{s:"heʻe",g:"slide, slip",pp:"PPN *seke",cog:[["Māori","heke"],["Tahitian","heʻe"],["Sāmoan","seʻe"]]},"hiki?hikilele":{s:"hiki",g:"startle",pp:"",cog:[]},hiki:{s:"hiki",g:"arrive, appear",pp:"PNP *fiti",cog:[["Māori","whiti"],["Tahitian","hiti"],["Rapa Nui","hiti"]]},hiʻi:{s:"hiʻi",g:"carry in arms",pp:"PPN *siki",cog:[["Māori","hiki"],["Tahitian","hiʻi"],["Sāmoan","siʻi"]]},lani:{s:"lani",g:"sky, heaven",pp:"PPN *laŋi",cog:[["Māori","rangi"],["Tahitian","raʻi"],["Sāmoan","lagi"]]},"poi?hiʻipoi":{s:"poi",g:"",pp:"",cog:[]},"hoa#0":{s:"hoa",g:"companion, fellow",pp:"PPN *soa",cog:[["Māori","hoa"],["Tahitian","hoa"],["Sāmoan","soa"]]},aloha:{s:"aloha",g:"love, compassion",pp:"PPN *qarofa",cog:[["Māori","aroha"],["Tahitian","aroha"],["Sāmoan","alofa"]]},hanauna:{s:"hanauna",g:"generation, kin",pp:"PNP *fanau-ŋa",cog:[["Māori","whanaunga"],["Tahitian","fanauʻa"]]},hānau:{s:"hānau",g:"birth, born",pp:"PPN *faanau",cog:[["Māori","whānau"],["Tahitian","fānau"],["Sāmoan","fānau"]]},"kipa#0":{s:"kipa",g:"visit",pp:"PPN *tipa",cog:[["Māori","tipa"],["Sāmoan","tipa"],["Tongan","sipa"]]},"koa#1":{s:"koa",g:"brave, warrior",pp:"PPN *toqa",cog:[["Māori","toa"],["Tahitian","toa"],["Sāmoan","toa"]]},lawaiʻa:{s:"lawaiʻa",g:"fishing, fisher",pp:"PCE *rawa-ika",cog:[["Tahitian","ravaʻai"]]},paio:{s:"paio",g:"contend, fight",pp:"",cog:[]},ʻai:{s:"ʻai",g:"food, eat",pp:"PPN *kai",cog:[["Māori","kai"],["Tahitian","ʻai"],["Sāmoan","ʻai"]]},hoe:{s:"hoe",g:"paddle",pp:"PPN *fohe",cog:[["Māori","hoe"],["Tahitian","hoe"],["Sāmoan","foe"]]},"uli#1":{s:"uli",g:"steer",pp:"PPN *quli",cog:[["Sāmoan","uli"],["Tongan","ʻuli"]]},"holo#0":{s:"holo",g:"run, sail",pp:"PPN *solo",cog:[["Māori","horo"],["Tahitian","horo"],["Sāmoan","solo"]]},kai:{s:"kai",g:"sea",pp:"PPN *tahi",cog:[["Māori","tai"],["Tahitian","tai"],["Sāmoan","tai"]]},lio:{s:"lio",g:"horse",pp:"",cog:[]},moku:{s:"moku",g:"island, ship",pp:"PPN *motu",cog:[["Māori","motu"],["Tahitian","motu"],["Sāmoan","motu"]]},"holo?holowaʻa":{s:"holo",g:"",pp:"",cog:[]},"holo#bundle":{s:"holo",g:"bundle",pp:"PNP *solo",cog:[]},hope:{s:"hope",g:"behind, last",pp:"PEP *sope",cog:[["Māori","hope"],["Tahitian","hope"],["Rapa Nui","hope"]]},poʻo:{s:"poʻo",g:"head",pp:"",cog:[]},hoʻi:{s:"hoʻi",g:"return",pp:"PPN *foki",cog:[["Māori","hoki"],["Tahitian","hoʻi"],["Sāmoan","foʻi"]]},hua:{s:"hua",g:"fruit, egg",pp:"PPN *fua",cog:[["Māori","hua"],["Sāmoan","fua"],["Tongan","fua"]]},"liʻi#0":{s:"liʻi",g:"small",pp:"PPN *riki",cog:[["Māori","riki"],["Tahitian","riʻi"],["Sāmoan","liʻi"]]},"hua#word":{s:"hua",g:"word, letter",pp:"",cog:[]},hue:{s:"hue",g:"gourd, calabash",pp:"PNP *fue",cog:[["Māori","hue"],["Tahitian","hue"],["Rapa Nui","hue"]]},ʻili:{s:"ʻili",g:"skin, surface",pp:"PPN *kili",cog:[["Māori","kiri"],["Tahitian","ʻiri"],["Tongan","kili"]]},hui:{s:"hui",g:"join, unite",pp:"PPN *fuhi",cog:[["Māori","hui"],["Tahitian","hui"],["Sāmoan","fuifui"]]},"kala#2":{s:"kala",g:"loosen, forgive",pp:"PPN *tala",cog:[["Māori","tara"],["Tahitian","tātara"],["Sāmoan","tala"]]},huki:{s:"huki",g:"pull, draw",pp:"PPN *futi",cog:[["Māori","huti"],["Tahitian","huti"],["Sāmoan","futi"]]},"huli#0":{s:"huli",g:"turn",pp:"PPN *fuli",cog:[["Māori","huri"],["Tahitian","huri"],["Sāmoan","fuli"]]},"lua#0":{s:"lua",g:"two",pp:"PPN *rua",cog:[["Māori","rua"],["Tahitian","rua"],["Sāmoan","lua"]]},"hulu#0":{s:"hulu",g:"feather, hair",pp:"PPN *fulu",cog:[["Sāmoan","fulu"],["Tongan","fulu"]]},ʻiʻiwi:{s:"ʻiʻiwi",g:"scarlet honeycreeper",pp:"",cog:[]},"huna#0":{s:"huna",g:"fine particle",pp:"",cog:[["Māori","hungahunga"],["Tahitian","huʻa"],["Sāmoan","fugafuga"]]},"hā#2":{s:"hā",g:"leaf stalk",pp:"PPN *faqa",cog:[["Māori","whā"],["Sāmoan","fā"],["Tongan","faʻa"]]},ipu:{s:"ipu",g:"gourd",pp:"PPN *ipu",cog:[["Tahitian","ipu"],["Sāmoan","ipu"],["Tongan","ipu"]]},"kō#0":{s:"kō",g:"sugar cane",pp:"PEP *too",cog:[["Māori","tō"],["Tahitian","tō"]]},hāliʻi:{s:"hāliʻi",g:"spread, cover",pp:"PPN *faaliki",cog:[["Māori","whāriki"],["Tahitian","fāriʻi"],["Tongan","faliki"]]},"kuli#1":{s:"kuli",g:"knee",pp:"PPN *turi",cog:[["Māori","turi"],["Sāmoan","tuli"],["Tahitian","turi"]]},"kahi#0":{s:"kahi",g:"one",pp:"PNP *tasi",cog:[["Māori","tahi"],["Tahitian","tahi"],["Sāmoan","tasi"]]},mua:{s:"mua",g:"first, front",pp:"PPN *muqa",cog:[["Māori","mua"],["Tahitian","mua"],["Sāmoan","mua"]]},"niu#0":{s:"niu",g:"coconut",pp:"PPN *niu",cog:[["Māori","niu"],["Tahitian","niu"],["Sāmoan","niu"]]},hōkū:{s:"hōkū",g:"star",pp:"PPN *fetuqu",cog:[["Māori","whetū"],["Sāmoan","fetū"],["Tongan","fetuʻu"]]},"ao#0":{s:"ao",g:"daylight, light",pp:"PPN *qaho",cog:[["Māori","ao"],["Tahitian","ao"],["Sāmoan","ao"]]},"naʻi#0":{s:"naʻi",g:"conquer",pp:"PCE *ŋaki",cog:[["Māori","ngaki"]]},ʻaeʻa:{s:"ʻaeʻa",g:"wandering",pp:"",cog:[]},"hū#0":{s:"hū",g:"rise, overflow",pp:"",cog:[]},"puna#0":{s:"puna",g:"spring",pp:"PPN *puna",cog:[["Māori","puna"],["Sāmoan","puna"],["Rapa Nui","puna"]]},iwi:{s:"iwi",g:"bone",pp:"PNP *iwi",cog:[["Māori","iwi"],["Tahitian","ivi"],["Sāmoan","ivi"]]},pona:{s:"pona",g:"joint, node",pp:"PPN *pona",cog:[["Māori","pona"],["Tahitian","pona"],["Sāmoan","pona"]]},"kaha#1":{s:"kaha",g:"place",pp:"PPN *tafa",cog:[["Māori","taha"],["Tahitian","taha"],["Sāmoan","tafa"]]},one:{s:"one",g:"sand",pp:"PPN *qone",cog:[["Māori","one"],["Tahitian","one"],["Sāmoan","oneone"]]},"kaha#0":{s:"kaha",g:"mark, line",pp:"PPN *tafa",cog:[["Sāmoan","tafa"],["Tongan","tafa"]]},pili:{s:"pili",g:"cling, join",pp:"PPN *pili",cog:[["Māori","piri"],["Tahitian","piri"],["Rapa Nui","piri"]]},pōʻai:{s:"pōʻai",g:"circle, encircle",pp:"PPN *pookai",cog:[["Māori","pōkai"],["Tahitian","pōʻai"]]},"kaha?kahawai":{s:"kaha",g:"",pp:"",cog:[]},kahua:{s:"kahua",g:"foundation",pp:"PEP *tafuqa",cog:[["Māori","tahua"],["Tahitian","tahua"],["Marquesan","tohua"]]},"kahu#0":{s:"kahu",g:"keeper",pp:"PPN *tafu",cog:[["Māori","tahu"],["Tahitian","tahu"],["Sāmoan","tafu"]]},ahi:{s:"ahi",g:"fire",pp:"PPN *afi",cog:[["Māori","ahi"],["Tahitian","ahi"],["Sāmoan","afi"]]},akua:{s:"akua",g:"god, spirit",pp:"PPN *qatua",cog:[["Māori","atua"],["Tahitian","atua"],["Sāmoan","atua"]]},ea:{s:"ea",g:"rise; breath, air",pp:"PPN *eqa",cog:[["Māori","ea"],["Sāmoan","ea"],["Tongan","eʻa"]]},eʻe:{s:"eʻe",g:"climb on, board",pp:"PPN *heke",cog:[["Māori","eke"],["Tahitian","eʻe"],["Sāmoan","eʻe"]]},malolo:{s:"malolo",g:"ebbing, low",pp:"PPN *malolo",cog:[["Māori","maroro"],["Tongan","malolo"]]},"ʻau#1":{s:"ʻau",g:"swim",pp:"PPN *kau",cog:[["Māori","kau"],["Tahitian","ʻau"],["Rapa Nui","kau"]]},"kaka?kakaʻōlelo":{s:"kākā",g:"",pp:"",cog:[]},"hala#0":{s:"hala",g:"fault, offense",pp:"PPN *sala",cog:[["Māori","hara"],["Tahitian","hara"],["Sāmoan","sala"]]},"kala#gable":{s:"kala",g:"gable end",pp:"PPN *tara",cog:[["Tahitian","tara"],["Sāmoan","tala"]]},kanaka:{s:"kanaka",g:"person",pp:"PPN *taŋata",cog:[["Māori","tangata"],["Tahitian","taʻata"],["Sāmoan","tagata"]]},makua:{s:"makua",g:"parent; mature",pp:"PPN *matuqa",cog:[["Māori","matua"],["Tahitian","metua"],["Sāmoan","matua"]]},kani:{s:"kani",g:"sound",pp:"PPN *taŋi",cog:[["Māori","tangi"],["Tahitian","taʻi"],["Sāmoan","tagi"]]},"kau#2":{s:"kau",g:"chant",pp:"",cog:[]},wāwae:{s:"wāwae",g:"leg, foot",pp:"PPN *waqe",cog:[["Māori","waewae"],["Tahitian","ʻāvae"],["Sāmoan","vae"]]},kapa:{s:"kapa",g:"bark cloth; edge",pp:"PPN *tapa",cog:[["Tahitian","tapa"],["Tongan","tapa"],["Rapa Nui","tapa"]]},komo:{s:"komo",g:"enter",pp:"PPN *tomo",cog:[["Māori","tomo"],["Tahitian","tomo"],["Sāmoan","tomo"]]},"kau?kaukahi":{s:"kau",g:"group of",pp:"PPN *tau-",cog:[]},kānāwai:{s:"kānāwai",g:"law",pp:"",cog:[]},kaula:{s:"kaula",g:"rope",pp:"PPN *taura",cog:[["Māori","taura"],["Tahitian","taura"],["Tongan","toua"]]},lei:{s:"lei",g:"garland",pp:"PPN *lei",cog:[["Māori","rei"],["Sāmoan","lei"],["Tahitian","rei"]]},like:{s:"like",g:"alike",pp:"PEP *rite",cog:[["Māori","rite"],["Rapa Nui","rite"]]},"kau?kaulua":{s:"kau",g:"group of",pp:"PPN *tau-",cog:[]},"kau?kaupale":{s:"kau",g:"",pp:"",cog:[]},"pale?kaupale":{s:"pale",g:"",pp:"",cog:[]},lalo:{s:"lalo",g:"below, down",pp:"PPN *lalo",cog:[["Māori","raro"],["Tahitian","raro"],["Sāmoan","lalo"]]},"luna?kaʻaluna":{s:"luna",g:"",pp:"",cog:[]},keiki:{s:"keiki",g:"child",pp:"PCE *ta-iti",cog:[["Marquesan","toiti"]]},kāne:{s:"kāne",g:"male, man",pp:"PPN *taqane",cog:[["Māori","tāne"],["Sāmoan","tāne"],["Tahitian","tāne"]]},"papa#0":{s:"papa",g:"flat surface, layer",pp:"PPN *papa",cog:[["Māori","papa"],["Tahitian","papa"],["Sāmoan","papa"]]},kolu:{s:"kolu",g:"three",pp:"PPN *tolu",cog:[["Māori","toru"],["Tahitian","toru"],["Sāmoan","tolu"]]},kiaʻi:{s:"kiaʻi",g:"guard, watch",pp:"PEP *tiaki",cog:[["Māori","tiaki"],["Tahitian","tīaʻi"],["Rapa Nui","tiaki"]]},puka:{s:"puka",g:"hole, opening",pp:"PPN *puta",cog:[["Māori","puta"],["Tahitian","puta"],["Marquesan","puta"]]},pō:{s:"pō",g:"night, darkness",pp:"PPN *poo",cog:[["Māori","pō"],["Tahitian","pō"],["Sāmoan","pō"]]},kiko:{s:"kiko",g:"dot, point",pp:"PEP *tito",cog:[["Tahitian","tito"],["Rapa Nui","tito"],["Marquesan","tito"]]},"lā#1":{s:"lā",g:"sun; day",pp:"PPN *laqaa",cog:[["Māori","rā"],["Tahitian","rā"],["Sāmoan","lā"]]},nīnau:{s:"nīnau",g:"question, ask",pp:"",cog:[]},kilo:{s:"kilo",g:"watch, observe",pp:"PPN *tiro",cog:[["Māori","tiro"],["Sāmoan","tilo"],["Tongan","sio"]]},"heʻe#0":{s:"heʻe",g:"octopus",pp:"PPN *feke",cog:[["Māori","wheke"],["Tahitian","feʻe"],["Sāmoan","feʻe"]]},kino:{s:"kino",g:"body",pp:"PPN *tino",cog:[["Māori","tino"],["Tahitian","tino"],["Sāmoan","tino"]]},wailua:{s:"wailua",g:"spirit, ghost",pp:"PEP *wai-rua",cog:[["Māori","wairua"],["Tahitian","vārua"]]},"kipi#0":{s:"kipi",g:"dig",pp:"PPN *tipi",cog:[["Māori","tipi"],["Tahitian","tipi"],["Sāmoan","tipi"]]},"kua#1":{s:"kua",g:"hew, chop",pp:"PNP *tua",cog:[["Māori","tua"],["Marquesan","tua"]]},"kiʻi#0":{s:"kiʻi",g:"image, picture",pp:"PCE *tiki",cog:[["Māori","tiki"],["Tahitian","tiʻi"]]},palapala:{s:"palapala",g:"writing, print",pp:"",cog:[]},pōhaku:{s:"pōhaku",g:"stone",pp:"PCE *poo-fatu",cog:[["Māori","pōhatu"]]},koʻi:{s:"koʻi",g:"adze, axe",pp:"PPN *toki",cog:[["Māori","toki"],["Tahitian","toʻi"],["Sāmoan","toʻi"]]},"kahi#1":{s:"kahi",g:"scrape, shave",pp:"PPN *tasi",cog:[["Māori","tahi"],["Rapa Nui","tahitahi"]]},lipi:{s:"lipi",g:"blade, edge",pp:"PPN *lipi",cog:[["Māori","ripi"],["Tongan","lipi"]]},"kua?kuahao":{s:"kua",g:"",pp:"",cog:[]},"kua#0":{s:"kua",g:"back",pp:"PPN *tuqa",cog:[["Māori","tua"],["Tahitian","tua"],["Sāmoan","tua"]]},mauna:{s:"mauna",g:"mountain",pp:"PPN *maquŋa",cog:[["Māori","maunga"],["Sāmoan","mauga"],["Tongan","moʻunga"]]},moʻo:{s:"moʻo",g:"lizard",pp:"PPN *moko",cog:[["Māori","moko"],["Tahitian","moʻo"],["Sāmoan","moʻo"]]},puʻu:{s:"puʻu",g:"hill, lump",pp:"PPN *puku",cog:[["Māori","puku"],["Tahitian","puʻu"],["Rapa Nui","puku"]]},kuene:{s:"kuene",g:"lay out, arrange",pp:"",cog:[]},"kuhi#1":{s:"kuhi",g:"suppose",pp:"",cog:[]},hewa:{s:"hewa",g:"wrong, error",pp:"PPN *sewa",cog:[["Māori","hewa"],["Tongan","heva"],["Rapa Nui","heva"]]},"kui?kuilua":{s:"kui",g:"add on",pp:"",cog:[]},"kuli#0":{s:"kuli",g:"deaf",pp:"PPN *tuli",cog:[["Māori","turi"],["Sāmoan","tuli"],["Tahitian","turi"]]},hiamoe:{s:"hiamoe",g:"sleep",pp:"PPN *fia-mohe",cog:[["Māori","hiamoe"],["Sāmoan","fiamoe"],["Tongan","fiemohe"]]},kumu:{s:"kumu",g:"base, source",pp:"PEP *tumu",cog:[["Māori","tumu"],["Tahitian","tumu"],["Rapa Nui","tumu"]]},"lau#0":{s:"lau",g:"leaf",pp:"PPN *lau",cog:[["Māori","rau"],["Sāmoan","lau"],["Tahitian","rau"]]},kupuna:{s:"kupuna",g:"grandparent, ancestor",pp:"PPN *tupuna",cog:[["Māori","tupuna"],["Rapa Nui","tupuna"],["Marquesan","tupuna"]]},"kuʻi#0":{s:"kuʻi",g:"pound, strike",pp:"PPN *tuki",cog:[["Māori","tuki"],["Tahitian","tui"],["Sāmoan","tuʻi"]]},"kuʻi#1":{s:"kuʻi",g:"join, unite",pp:"",cog:[]},kālai:{s:"kālai",g:"carve, hew",pp:"PPN *talai",cog:[["Māori","tārai"],["Sāmoan","talai"],["Tahitian","tarai"]]},"kā#0":{s:"kā",g:"strike, hit",pp:"PPN *taa",cog:[["Māori","tā"],["Sāmoan","tā"],["Tongan","tā"]]},kāmaʻa:{s:"kāmaʻa",g:"sandal, shoe",pp:"PCE *taamaka",cog:[["Māori","tāmaka"],["Tahitian","tamaʻa"]]},make:{s:"make",g:"die; want",pp:"PPN *mate",cog:[["Māori","mate"],["Tahitian","mate"],["Sāmoan","mate"]]},kāwili:{s:"kāwili",g:"snare",pp:"PPN *taa-wili",cog:[["Māori","tāwiri"],["Tahitian","tāviri"],["Tongan","tāvilivili"]]},manu:{s:"manu",g:"bird",pp:"PPN *manu",cog:[["Māori","manu"],["Tahitian","manu"],["Sāmoan","manu"]]},kē:{s:"kē",g:"refuse",pp:"",cog:[["Māori","tē"],["Sāmoan","lē"]]},"kōhi#0":{s:"kōhi",g:"dig, split off",pp:"",cog:[]},kea:{s:"kea",g:"white",pp:"PPN *tea",cog:[["Māori","tea"],["Tahitian","tea"],["Tongan","tea"]]},emi:{s:"emi",g:"draw back, recede",pp:"",cog:[]},"kū?kūhewa":{s:"kū",g:"be hit",pp:"",cog:[]},"kaha?kūkaha":{s:"kaha",g:"",pp:"",cog:[]},"kala#1":{s:"kala",g:"proclaim",pp:"PPN *tala",cog:[["Māori","tara"],["Sāmoan","tala"],["Tongan","tala"]]},"kūkulu#0":{s:"kūkulu",g:"pillar; to build",pp:"PNP *tulu-tulu",cog:[["Māori","turuturu"],["Tahitian","turuturu"],["Rapa Nui","turuturu"]]},hema:{s:"hema",g:"left",pp:"PPN *sema",cog:[["Māori","hema"],["Tongan","hema"]]},lehu:{s:"lehu",g:"ashes",pp:"PPN *refu",cog:[["Tahitian","rehu"],["Sāmoan","lefu"],["Tongan","efuefu"]]},"kū?kūloko":{s:"kū",g:"belonging to",pp:"",cog:[]},loko:{s:"loko",g:"inside; pond",pp:"PPN *loto",cog:[["Māori","roto"],["Tahitian","roto"],["Sāmoan","loto"]]},kūlou:{s:"kūlou",g:"bow the head",pp:"PPN *tuulou",cog:[["Sāmoan","tulou"],["Tongan","tulou"]]},lālā:{s:"lālā",g:"branch",pp:"PPN *raqa-raqa",cog:[["Māori","rārā"],["Sāmoan","lālā"],["Tongan","vaʻavaʻa"]]},"kū?kūmaka":{s:"kū",g:"be hit",pp:"",cog:[]},"maka#0":{s:"maka",g:"eye, face",pp:"PPN *mata",cog:[["Māori","mata"],["Tahitian","mata"],["Sāmoan","mata"]]},nihi:{s:"nihi",g:"edge",pp:"PPN *nifi",cog:[["Māori","ninihi"],["Rapa Nui","nihi"],["Marquesan","nihinihi"]]},"nānā#1":{s:"nānā",g:"look, watch",pp:"PCE *naa-naa",cog:[["Māori","nānā"],["Tahitian","nānā"]]},ola:{s:"ola",g:"life, health",pp:"PPN *ola",cog:[["Māori","ora"],["Tahitian","ora"],["Sāmoan","ola"]]},pono:{s:"pono",g:"right, proper",pp:"PCE *pono",cog:[["Māori","pono"],["Marquesan","pono"]]},"kū?kūʻau":{s:"kū",g:"",pp:"",cog:[]},"ʻau#0":{s:"ʻau",g:"handle, staff",pp:"PPN *kau",cog:[["Māori","kau"],["Sāmoan","ʻau"],["Tongan","kau"]]},"kū?kūʻauhau":{s:"kū",g:"",pp:"",cog:[]},ʻauhau:{s:"ʻauhau",g:"tax, tribute",pp:"PCE *kaufau",cog:[["Māori","kauwhau"],["Tahitian","ʻaufau"]]},"ʻē#1":{s:"ʻē",g:"different",pp:"PPN *kehe",cog:[["Māori","kē"],["Tahitian","ʻē"],["Tongan","kehe"]]},"lae#0":{s:"lae",g:"brow, headland",pp:"PPN *laqe",cog:[["Māori","rae"],["Tahitian","rae"],["Sāmoan","lae"]]},"hala#1":{s:"hala",g:"pandanus",pp:"PPN *fara",cog:[["Tahitian","fara"],["Sāmoan","fala"],["Tongan","fā"]]},"lau#1":{s:"lau",g:"many",pp:"PPN *lau",cog:[["Māori","rau"],["Tahitian","rau"],["Tongan","lau"]]},"koa#0":{s:"koa",g:"koa tree",pp:"PPN *toa",cog:[["Tahitian","toa"],["Sāmoan","toa"],["Tongan","toa"]]},"kī#0":{s:"kī",g:"ti plant",pp:"PPN *tii",cog:[["Māori","tī"],["Sāmoan","tī"],["Tahitian","tī"]]},"lama#0":{s:"lama",g:"torch",pp:"PPN *rama",cog:[["Māori","rama"],["Sāmoan","lama"],["Tahitian","rama"]]},lima:{s:"lima",g:"hand",pp:"PPN *lima",cog:[["Tahitian","rima"],["Sāmoan","lima"],["Tongan","nima"]]},"lau#broad":{s:"lau",g:"breadth, expanse",pp:"PPN *lau",cog:[["Sāmoan","lau"]]},wili:{s:"wili",g:"twist, turn",pp:"PPN *wili",cog:[["Māori","wiri"],["Tahitian","viri"],["Sāmoan","vili"]]},ʻulu:{s:"ʻulu",g:"breadfruit",pp:"PPN *kulu",cog:[["Māori","kuru"],["Tahitian","ʻuru"],["Sāmoan","ʻulu"]]},"lawa#bind":{s:"lawa",g:"bind fast",pp:"PPN *lawa",cog:[["Tongan","lalava"]]},lawe:{s:"lawe",g:"take, carry",pp:"PPN *lawe",cog:[["Māori","rarawe"],["Tahitian","rave"],["Tongan","lave"]]},"laʻa#season":{s:"laʻa",g:"season",pp:"",cog:[]},"ulu#0":{s:"ulu",g:"grow, growth",pp:"",cog:[]},leo:{s:"leo",g:"voice",pp:"PPN *leqo",cog:[["Māori","reo"],["Sāmoan","leo"],["Tahitian","reo"]]},"kuhi#0":{s:"kuhi",g:"point",pp:"PPN *tusu",cog:[["Māori","tuhi"],["Sāmoan","tusi"],["Tongan","tuhu"]]},ʻākau:{s:"ʻākau",g:"right side",pp:"PCE *katau",cog:[["Māori","katau"],["Tahitian","ʻatau"]]},maikaʻi:{s:"maikaʻi",g:"good",pp:"PEP *maqitaki",cog:[["Māori","maitai"],["Tahitian","maitaʻi"]]},ʻino:{s:"ʻino",g:"bad",pp:"PPN *kino",cog:[["Māori","kino"],["Tahitian","ʻino"],["Rapa Nui","kino"]]},uila:{s:"uila",g:"lightning",pp:"PPN *quhila",cog:[["Māori","uira"],["Tahitian","uira"],["Sāmoan","uila"]]},"lua#1":{s:"lua",g:"pit, hole",pp:"PPN *lua",cog:[["Māori","rua"],["Tahitian","rua"],["Sāmoan","lua"]]},pele:{s:"pele",g:"lava, volcano",pp:"",cog:[]},"luna#1":{s:"luna",g:"overseer, officer",pp:"",cog:[]},kahiko:{s:"kahiko",g:"old",pp:"PCE *tafito",cog:[["Māori","tawhito"],["Tahitian","tahito"]]},"ʻohana#0":{s:"ʻohana",g:"family",pp:"PCE *koo-faŋa",cog:[["Māori","kōhanga"],["Tahitian","ʻōfaʻa"]]},lāhui:{s:"lāhui",g:"people, assembly",pp:"PPN *lafu",cog:[["Sāmoan","lafu"]]},mahi:{s:"mahi",g:"cultivate; strong",pp:"PPN *mafi",cog:[["Māori","mahi"],["Tongan","mafi"],["Rapa Nui","mahi"]]},"ala?makaala":{s:"ʻala",g:"",pp:"",cog:[]},luku:{s:"luku",g:"destroy",pp:"PEP *rutu",cog:[["Māori","rutu"],["Tahitian","rutu"],["Rapa Nui","rutu"]]},momi:{s:"momi",g:"pearl",pp:"",cog:[]},nahele:{s:"nahele",g:"forest, the wild",pp:"PCE *ŋasere",cog:[["Māori","ngahere"],["Tahitian","ʻaihere"]]},pouli:{s:"pōuli",g:"dark, darkness",pp:"PPN *poo-quli",cog:[["Māori","pōuri"],["Tahitian","pōuri"],["Tongan","poʻuli"]]},"make?makehewa":{s:"make",g:"exchange",pp:"",cog:[]},"liʻi#1":{s:"liʻi",g:"chief",pp:"",cog:[]},manawa:{s:"manawa",g:"disposition",pp:"",cog:[]},"ʻiʻo#0":{s:"ʻiʻo",g:"true, genuine",pp:"PPN *kiko",cog:[["Māori","kiko"],["Tahitian","ʻiʻo"],["Sāmoan","ʻiʻo"]]},ihu:{s:"ihu",g:"nose, prow",pp:"PPN *isu",cog:[["Māori","ihu"],["Tahitian","ihu"],["Sāmoan","isu"]]},maʻa:{s:"maʻa",g:"accustomed",pp:"",cog:[]},lahi:{s:"lahi",g:"thin, delicate",pp:"PNP *lafi",cog:[["Māori","rahirahi"],["Tahitian","rahirahi"]]},maʻawe:{s:"maʻawe",g:"strand; track",pp:"PNP *ma-kawe",cog:[["Māori","makawe"],["Sāmoan","maʻave"]]},"moana#0":{s:"moana",g:"ocean, open sea",pp:"PPN *moana",cog:[["Māori","moana"],["Tahitian","moana"],["Sāmoan","moana"]]},ʻuhane:{s:"ʻuhane",g:"soul, spirit",pp:"PEP *kuhane",cog:[["Rapa Nui","kuhane"],["Marquesan","kuhane"]]},"honua#0":{s:"honua",g:"land, earth",pp:"PNP *fenua",cog:[["Māori","whenua"],["Tahitian","fenua"],["Rapa Nui","henua"]]},luʻu:{s:"luʻu",g:"dive",pp:"PPN *ruku",cog:[["Māori","ruku"],["Tongan","uku"],["Rapa Nui","ruku"]]},māhu:{s:"māhu",g:"steam",pp:"PNP *ma-qafu",cog:[["Māori","māhu"],["Sāmoan","māfu"]]},mona:{s:"mona",g:"fat",pp:"",cog:[]},moʻa:{s:"moʻa",g:"cooked",pp:"PPN *maqoha",cog:[["Māori","maoa"],["Tahitian","maoa"]]},"maka#1":{s:"maka",g:"raw",pp:"PPN *mata",cog:[["Māori","mata"],["Sāmoan","mata"],["Tongan","mata"]]},"moʻo#line":{s:"moʻo",g:"line, succession",pp:"",cog:[]},kūʻauhau:{s:"kūʻauhau",g:"genealogy",pp:"PCE *kaufau",cog:[["Māori","kauwhau"]]},muli:{s:"muli",g:"last, after",pp:"PPN *muri",cog:[["Māori","muri"],["Tahitian","muri"],["Sāmoan","muli"]]},naʻau:{s:"naʻau",g:"mind, heart",pp:"PPN *ŋaakau",cog:[["Māori","ngākau"],["Tahitian","ʻāʻau"],["Tongan","ngākau"]]},noho:{s:"noho",g:"sit, dwell",pp:"PPN *nofo",cog:[["Māori","noho"],["Tahitian","noho"],["Sāmoan","nofo"]]},"nuku#0":{s:"nuku",g:"mouth, beak",pp:"PPN *ŋutu",cog:[["Māori","ngutu"],["Tahitian","ʻutu"],["Sāmoan","gutu"]]},"olo?olokaʻa":{s:"olo",g:"",pp:"",cog:[]},omo:{s:"omo",g:"suck",pp:"PEP *qomo",cog:[["Māori","omo"],["Marquesan","omo"]]},liu:{s:"liu",g:"bilge water",pp:"PPN *liu",cog:[["Māori","riu"],["Tahitian","riu"],["Sāmoan","liu"]]},"ʻā#0":{s:"ʻā",g:"burning, fire",pp:"PPN *kaha",cog:[["Māori","kā"],["Tahitian","ʻā"],["Rapa Nui","kā"]]},"pahu#0":{s:"pahu",g:"drum, box",pp:"PCE *pasu",cog:[["Māori","pahū"],["Tahitian","pahu"],["Marquesan","pahu"]]},"pahu?pahukapu":{s:"pahu",g:"",pp:"",cog:[]},"kapu#0":{s:"kapu",g:"sacred, forbidden",pp:"PPN *tapu",cog:[["Māori","tapu"],["Tahitian","tapu"],["Sāmoan","tapu"]]},"paka#4":{s:"paka",g:"raindrop, patter",pp:"PPN *pata",cog:[["Māori","pata"],["Marquesan","pata"]]},"palai#avert":{s:"palai",g:"turn away",pp:"",cog:[]},"pale#1":{s:"pale",g:"ward off, defend",pp:"PPN *pale",cog:[["Māori","pare"],["Tahitian","pare"],["Tongan","pale"]]},"pale#0":{s:"pale",g:"covering",pp:"PPN *pale",cog:[["Māori","pare"],["Tongan","pale"]]},"uhi#1":{s:"uhi",g:"cover, covering",pp:"PPN *qufi",cog:[["Māori","uwhi"],["Sāmoan","ufi"],["Tongan","ʻufiʻufi"]]},pana:{s:"pana",g:"shoot, flick",pp:"PPN *pana",cog:[["Māori","pana"],["Tahitian","pana"],["Marquesan","pana"]]},pua:{s:"pua",g:"flower, arrow",pp:"PEP *pua",cog:[["Māori","pua"],["Tahitian","pua"],["Rapa Nui","pua"]]},"pane#head":{s:"pane",g:"back of head",pp:"PPN *pane",cog:[["Māori","pane"],["Marquesan","pane"]]},pani:{s:"pani",g:"close, stopper",pp:"PCE *pani",cog:[["Māori","pani"],["Tahitian","pani"]]},"pū#1":{s:"pū",g:"conch, gun",pp:"PPN *puu",cog:[["Māori","pū"],["Tahitian","pū"],["Sāmoan","pū"]]},"hola#0":{s:"hola",g:"spread",pp:"PPN *fola",cog:[["Māori","hora"],["Sāmoan","fola"],["Tongan","fola"]]},"mū#2":{s:"mū",g:"kōnane, checkers",pp:"",cog:[]},pāʻina:{s:"pāʻina",g:"meal",pp:"",cog:[]},"ʻaina#0":{s:"ʻaina",g:"meal",pp:"PNP *kai-ŋa",cog:[["Sāmoan","ʻaiga"],["Rapa Nui","kainga"],["Marquesan","kaika"]]},pau:{s:"pau",g:"finished, used up",pp:"PNP *pau",cog:[["Māori","pau"],["Tahitian","pau"],["Sāmoan","pau"]]},kāhili:{s:"kāhili",g:"feather standard",pp:"PCE *taafiri",cog:[["Māori","tāwhiri"],["Tahitian","tāhiri"]]},"luhi#0":{s:"luhi",g:"weary",pp:"PCE *rufi",cog:[["Māori","ruhi"]]},"pū?paʻapū":{s:"pū",g:"",pp:"",cog:[]},"paʻi?paʻiaʻa":{s:"paʻi",g:"",pp:"",cog:[]},paʻi:{s:"paʻi",g:"strike, print",pp:"PPN *paki",cog:[["Māori","papaki"],["Sāmoan","paʻi"],["Tongan","paki"]]},"paʻi?paʻiʻai":{s:"paʻi",g:"bundle",pp:"",cog:[]},piha:{s:"piha",g:"full",pp:"",cog:[]},"pipi#seep":{s:"pīpī",g:"seep, sprinkle",pp:"",cog:[]},"hina#0":{s:"hina",g:"gray-haired",pp:"PPN *sina",cog:[["Māori","hina"],["Tahitian","hinahina"],["Rapa Nui","hina"]]},kepa:{s:"kepa",g:"sideways",pp:"PPN *tepa",cog:[["Sāmoan","tepa"],["Tongan","tepa"]]},"kala#0":{s:"kala",g:"thorn, spike",pp:"PPN *tala",cog:[["Māori","tara"],["Tahitian","tara"],["Tongan","tala"]]},makani:{s:"makani",g:"wind",pp:"PPN *mataŋi",cog:[["Māori","matangi"],["Tahitian","mataʻi"],["Sāmoan","matagi"]]},"pā#0":{s:"pā",g:"fence, wall",pp:"PPN *paa",cog:[["Tahitian","pā"],["Sāmoan","pā"],["Tongan","pā"]]},"pā#4":{s:"pā",g:"touch, reach",pp:"PPN *paa",cog:[["Māori","pā"],["Tahitian","pā"]]},"nini#1":{s:"nini",g:"stone fence",pp:"",cog:[]},pāpale:{s:"pāpale",g:"hat",pp:"",cog:[]},"pī#sprinkle":{s:"pī",g:"sprinkle",pp:"",cog:[]},lōʻihi:{s:"lōʻihi",g:"long",pp:"",cog:[]},ʻaono:{s:"ʻaono",g:"six",pp:"",cog:[]},ʻele:{s:"ʻele",g:"dark, black",pp:"PEP *kele",cog:[["Māori","kere"],["Tahitian","ʻereʻere"],["Rapa Nui","kerekere"]]},wehi:{s:"wehi",g:"decoration",pp:"",cog:[]},hoʻoluʻu:{s:"hoʻoluʻu",g:"dip, dye",pp:"",cog:[]},ua:{s:"ua",g:"rain",pp:"PPN *quha",cog:[["Māori","ua"],["Tahitian","ua"],["Sāmoan","ua"]]},"ū#0":{s:"ū",g:"breast",pp:"PPN *huhu",cog:[["Māori","ū"],["Tahitian","ū"],["Sāmoan","susu"]]},"pā#plate":{s:"pā",g:"board, plate",pp:"PPN *paa",cog:[["Sāmoan","pā"]]},"ʻaha#0":{s:"ʻaha",g:"assembly, gathering",pp:"",cog:[]},ʻahu:{s:"ʻahu",g:"garment, covering",pp:"PPN *kafu",cog:[["Māori","kahu"],["Tahitian","ʻahu"],["Sāmoan","ʻafu"]]},"ao?ʻahuao":{s:"ao",g:"young leaf",pp:"",cog:[]},inu:{s:"inu",g:"drink",pp:"PPN *inu",cog:[["Māori","inu"],["Tahitian","inu"],["Sāmoan","inu"]]},ʻahā:{s:"ʻahā",g:"four",pp:"",cog:[]},alo:{s:"alo",g:"front, presence",pp:"PPN *qaro",cog:[["Māori","aro"],["Tahitian","aro"],["Tongan","ʻao"]]},ʻauina:{s:"ʻauina",g:"decline, slope",pp:"",cog:[]},"ʻau?ʻaumakua":{s:"ʻau",g:"",pp:"",cog:[]},"ʻau?ʻauwai":{s:"ʻau",g:"",pp:"",cog:[]},"ʻaʻa#0":{s:"ʻaʻa",g:"sheath, bag",pp:"PPN *kaka",cog:[["Māori","kaka"],["Tahitian","ʻaʻa"],["Sāmoan","ʻaʻa"]]},ʻike:{s:"ʻike",g:"knowledge",pp:"PPN *kite",cog:[["Māori","kite"],["Tahitian","ʻite"]]},ʻohā:{s:"ʻohā",g:"taro offshoot",pp:"",cog:[]},kulaʻi:{s:"kulaʻi",g:"push over",pp:"PPN *tulaki",cog:[["Māori","turaki"],["Tahitian","turaʻi"],["Tongan","tulaki"]]},ʻoi:{s:"ʻoi",g:"main, foremost",pp:"PCE *koi",cog:[["Māori","koi"],["Tahitian","ʻoi"],["Marquesan","koi"]]},ʻuala:{s:"ʻuala",g:"sweet potato",pp:"PPN *kumala",cog:[["Māori","kūmara"],["Sāmoan","ʻumala"],["Tongan","kumala"]]},"kahiki#0":{s:"kahiki",g:"foreign land",pp:"PCE *tafiti",cog:[["Māori","tawhiti"],["Tahitian","tahiti"],["Sāmoan","tahiti"]]},"ʻuku#0":{s:"ʻuku",g:"louse, flea",pp:"PPN *kutu",cog:[["Māori","kutu"],["Tahitian","ʻutu"],["Sāmoan","ʻutu"]]},aʻo:{s:"aʻo",g:"teach, learn",pp:"PPN *ako",cog:[["Māori","ako"],["Tahitian","aʻo"],["Sāmoan","aʻo"]]},ʻōpū:{s:"ʻōpū",g:"belly",pp:"",cog:[["Māori","kōpū"],["Tahitian","ʻōpū"],["Rapa Nui","kōpū"]]},ahe:{s:"ahe",g:"light breeze",pp:"PNP *afe",cog:[["Māori","awhe"]]},"aka#bright":{s:"aka",g:"bright, clear",pp:"",cog:[]},ani:{s:"ani",g:"blow softly",pp:"PPN *aŋi",cog:[["Māori","āngi"],["Sāmoan","agi"],["Tongan","angi"]]},anu:{s:"anu",g:"cold",pp:"PNP *qanu",cog:[["Māori","anu"],["Tahitian","anu"],["Marquesan","anu"]]},"haka#1":{s:"haka",g:"gap, opening",pp:"PNP *fata",cog:[["Rapa Nui","hata"],["Tahitian","fatafata"],["Marquesan","hatahata"]]},"haku#1":{s:"haku",g:"lump, stone",pp:"PPN *fatu",cog:[["Māori","whatu"],["Sāmoan","fatu"],["Rapa Nui","hatu"]]},"hana#1":{s:"hana",g:"warm, hot",pp:"PPN *fana",cog:[["Māori","hana"],["Rapa Nui","hana"]]},"hano#0":{s:"hano",g:"glorious, honored",pp:"",cog:[]},haʻa:{s:"haʻa",g:"low, short",pp:"PNP *saka",cog:[["Māori","hakahaka"],["Sāmoan","saʻa"],["Tahitian","haʻa"]]},haʻi:{s:"haʻi",g:"break",pp:"",cog:[]},"hea#0":{s:"hea",g:"call",pp:"PPN *seqa",cog:[["Tongan","heʻaki"]]},"helu#0":{s:"helu",g:"count",pp:"",cog:[]},hene:{s:"hene",g:"snicker, laugh",pp:"",cog:[]},hinu:{s:"hinu",g:"oil; lustrous",pp:"PPN *sinu",cog:[["Māori","hinu"],["Tahitian","hinu"],["Marquesan","hinu"]]},hiʻu:{s:"hiʻu",g:"tail, end",pp:"PCE *siku",cog:[["Māori","hiku"],["Tahitian","hiʻu"],["Marquesan","hiku"]]},hopo:{s:"hopo",g:"fear",pp:"PPN *sopo",cog:[["Māori","hopo"],["Marquesan","hopo"]]},humu:{s:"humu",g:"sew",pp:"PNP *sumu",cog:[["Marquesan","humu"]]},huʻa:{s:"huʻa",g:"foam",pp:"PNP *fuka",cog:[["Māori","huka"],["Tahitian","huʻa"]]},"huʻi#cold":{s:"huʻi",g:"cold",pp:"",cog:[]},"ihe#fish":{s:"ihe",g:"halfbeak",pp:"PPN *ise",cog:[["Māori","ihe"],["Sāmoan","ise"],["Tahitian","ihe"]]},"iho#0":{s:"iho",g:"core, pith",pp:"PCE *iso",cog:[["Māori","iho"],["Tahitian","iho"]]},ika:{s:"ika",g:"strong",pp:"PPN *kita",cog:[["Māori","kita"]]},keʻo:{s:"keʻo",g:"white, clear",pp:"PMQ *teko",cog:[["Marquesan","teko"]]},kihi:{s:"kihi",g:"corner, tip",pp:"PNP *tifi",cog:[["Māori","tihi"]]},"kila#0":{s:"kila",g:"high place",pp:"PPN *tila",cog:[["Māori","tira"],["Tahitian","tira"],["Sāmoan","tila"]]},kiʻe:{s:"kiʻe",g:"high, lofty",pp:"",cog:[["Māori","tiketike"],["Marquesan","tiketike"]]},kolo:{s:"kolo",g:"creep, crawl",pp:"PPN *tolo",cog:[["Māori","toro"],["Tahitian","toro"],["Sāmoan","tolo"]]},"kona#1":{s:"kona",g:"bump",pp:"",cog:[]},konā:{s:"konā",g:"contemptuous, brusque",pp:"",cog:[]},koʻo:{s:"koʻo",g:"prop, support",pp:"PPN *toko",cog:[["Māori","tokona"],["Tongan","tokoni"],["Marquesan","toko"]]},kupu:{s:"kupu",g:"sprout, grow",pp:"PPN *tupu",cog:[["Māori","tupu"],["Tahitian","tupu"],["Sāmoan","tupu"]]},kuʻu:{s:"kuʻu",g:"release, lower",pp:"PPN *tuku",cog:[["Māori","tuku"],["Sāmoan","tuʻu"],["Tongan","tuku"]]},"kō#1":{s:"kō",g:"fulfill; conceive",pp:"PNP *too",cog:[["Sāmoan","tō"]]},kūkā:{s:"kūkā",g:"consult, confer",pp:"",cog:[]},laha:{s:"laha",g:"spread out",pp:"PPN *lafa-lafa",cog:[["Māori","raha"],["Sāmoan","lafalafa"],["Tongan","lafalafa"]]},"lehu#number":{s:"lehu",g:"four hundred thousand",pp:"",cog:[]},lena:{s:"lena",g:"yellow",pp:"PPN *reŋa",cog:[["Māori","renga"],["Tahitian","reʻareʻa"]]},lihi:{s:"lihi",g:"edge; eyelash",pp:"",cog:[]},liki:{s:"liki",g:"tighten, gird",pp:"PNP *niti",cog:[["Marquesan","niti"],["Tahitian","nitiniti"]]},lino:{s:"lino",g:"calm, shining",pp:"PPN *liŋo",cog:[["Sāmoan","ligoligo"],["Tongan","lingolingo"]]},lohe:{s:"lohe",g:"hear",pp:"",cog:[]},"mana#1":{s:"mana",g:"branch",pp:"PPN *maŋa",cog:[["Māori","manga"],["Sāmoan","maga"],["Tongan","manga"]]},"maʻo#0":{s:"maʻo",g:"green",pp:"",cog:[]},meha:{s:"meha",g:"lonely, solitary",pp:"",cog:[["Māori","mehameha"],["Tahitian","mehameha"]]},"mele#1":{s:"mele",g:"yellow",pp:"",cog:[]},miko:{s:"miko",g:"salted, seasoned",pp:"",cog:[]},mili:{s:"mili",g:"handle, caress",pp:"PPN *mili",cog:[["Māori","miri"],["Sāmoan","mili"],["Tongan","mili"]]},"mū#4":{s:"mū",g:"silent",pp:"PNP *muu",cog:[["Māori","mū"],["Rapa Nui","mumū"]]},nahe:{s:"nahe",g:"soft, gentle",pp:"",cog:[["Māori","ngahengahe"],["Sāmoan","gasegase"]]},nau:{s:"nau",g:"chew",pp:"PPN *ŋau",cog:[["Māori","ngau"],["Sāmoan","gau"],["Tongan","ngau"]]},niho:{s:"niho",g:"tooth",pp:"PPN *nifo",cog:[["Māori","niho"],["Tahitian","niho"],["Sāmoan","nifo"]]},noʻo:{s:"noʻo",g:"think, reflect",pp:"",cog:[]},nū:{s:"nū",g:"hum, coo",pp:"PPN *ŋuu",cog:[["Māori","ngū"],["Sāmoan","gū"],["Tongan","ngū"]]},oka:{s:"oka",g:"dregs, crumbs",pp:"PPN *qota",cog:[["Māori","ota"],["Tahitian","ota"],["Marquesan","ota"]]},"pae#1":{s:"pae",g:"bank, platform",pp:"PCE *pae",cog:[["Māori","pae"],["Tahitian","pae"]]},pane:{s:"pane",g:"answer, reply",pp:"",cog:[]},peka:{s:"peka",g:"tattle",pp:"",cog:[]},peku:{s:"peku",g:"kick",pp:"PCE *petu",cog:[]},"pio#2":{s:"pio",g:"peep, chirp",pp:"",cog:[]},"poe#0":{s:"poe",g:"round",pp:"PEP *poe",cog:[["Tahitian","poe"],["Rapa Nui","poe"],["Marquesan","poe"]]},"pule#1":{s:"pule",g:"speckled",pp:"PPN *pule",cog:[["Māori","purepure"],["Sāmoan","pulepule"],["Tahitian","purepure"]]},"puni#1":{s:"puni",g:"fond of, craving",pp:"",cog:[]},"wai#1":{s:"wai",g:"retain, deposit",pp:"PPN *qai",cog:[["Tongan","ʻai"]]},wana:{s:"wana",g:"sea urchin",pp:"PPN *wana",cog:[["Māori","wanawana"],["Tahitian","vanavana"],["Rapa Nui","vanavana"]]},wehe:{s:"wehe",g:"open, undo",pp:"PCE *wese",cog:[["Māori","wehe"],["Tahitian","vehe"],["Marquesan","vehe"]]},welu:{s:"welu",g:"rag, ragged",pp:"PCE *weru",cog:[["Māori","weweru"]]},wiki:{s:"wiki",g:"quick, hurry",pp:"PCE *witi",cog:[["Tahitian","viti"]]},"wī#famine":{s:"wī",g:"famine",pp:"",cog:[]},"ʻaha#1":{s:"ʻaha",g:"sennit, cord",pp:"PPN *kafa",cog:[["Māori","kaha"],["Sāmoan","ʻafa"],["Tongan","kafa"]]},ʻaka:{s:"ʻaka",g:"laugh",pp:"PPN *kata",cog:[["Māori","kata"],["Tahitian","ʻata"],["Sāmoan","ʻata"]]},"ʻaki#0":{s:"ʻaki",g:"bite, nip",pp:"PPN *kati",cog:[["Māori","kati"],["Sāmoan","ʻati"]]},ʻale:{s:"ʻale",g:"wave, ripple",pp:"PNP *kale",cog:[["Māori","kare"],["Tahitian","ʻare"]]},ʻalo:{s:"ʻalo",g:"dodge, evade",pp:"PPN *kalo",cog:[["Māori","karo"],["Sāmoan","ʻalo"],["Tongan","kalo"]]},ʻalu:{s:"ʻalu",g:"slack, loose",pp:"PPN *kalu",cog:[["Māori","karu"],["Tongan","kalu"],["Rapa Nui","karukaru"]]},ʻape:{s:"ʻape",g:"giant taro",pp:"PPN *kape",cog:[["Sāmoan","ʻape"],["Tahitian","ʻape"],["Tongan","kape"]]},"ʻawa#bitter":{s:"ʻawa",g:"bitter, sour",pp:"PNP *kawa",cog:[["Māori","kawa"],["Tahitian","ʻavaʻava"],["Rapa Nui","kava"]]},ʻeha:{s:"ʻeha",g:"pain, hurt",pp:"",cog:[]},"ʻeke#cringe":{s:"ʻeke",g:"shrink from",pp:"PEP *qete",cog:[["Māori","eti"],["Tahitian","ete"]]},ʻie:{s:"ʻie",g:"climbing vine",pp:"PPN *kie",cog:[["Māori","kiekie"],["Sāmoan","ʻieʻie"],["Tahitian","ʻieʻie"]]},ʻimo:{s:"ʻimo",g:"wink",pp:"PCE *kimo",cog:[["Māori","kimo"],["Tongan","kimokimo"]]},"ʻiwa#fern":{s:"ʻiwa",g:"fern",pp:"PCE *kiwa",cog:[["Māori","kiwakiwa"]]},ʻohe:{s:"ʻohe",g:"native tree",pp:"PPN *kofe",cog:[["Sāmoan","ʻofe"],["Tongan","kofe"],["Tahitian","ʻofe"]]},ʻolu:{s:"ʻolu",g:"pleasant, comfortable",pp:"",cog:[]},ʻona:{s:"ʻona",g:"dizzy, unsteady",pp:"PPN *kona",cog:[["Tongan","kona"],["Sāmoan","ʻoʻona"],["Marquesan","kona"]]},ʻoni:{s:"ʻoni",g:"move, wriggle",pp:"PNP *koli",cog:[["Māori","koni"],["Marquesan","koʻi"]]},ʻopi:{s:"ʻopi",g:"fold, crease",pp:"PPN *kopi",cog:[["Tahitian","ʻopi"],["Marquesan","kopi"],["Māori","kokopi"]]},ʻuki:{s:"ʻuki",g:"flax lily",pp:"",cog:[]},"ʻō#0":{s:"ʻō",g:"pointed stick",pp:"PPN *koho",cog:[["Māori","kō"],["Tahitian","ʻō"],["Sāmoan","ʻoso"]]}},Ja={lani:{key:"lani",label:"lani",en:"sky",place:"compass"},kai:{key:"kai",label:"kai",en:"sea",place:"fishpond"},ʻāina:{key:"ʻāina",label:"ʻāina",en:"land",place:"lava"},ulu:{key:"ulu",label:"ulu",en:"growth",place:"loi"},kanaka:{key:"kanaka",label:"kanaka",en:"people",place:"kauhale"},hana:{key:"hana",label:"hana",en:"work",place:"halau"},naʻau:{key:"naʻau",label:"naʻau",en:"mind",place:"cloud"},hele:{key:"hele",label:"hele",en:"motion",place:"stream"}},gn=vh;function yi(i){return gn[i].s.toUpperCase()}function rr(i){return i.includes("?")}const fc=[],lr=new Set;for(const i of gh)lr.has(i.w)||(lr.add(i.w),fc.push({word:i.w,a:i.a,b:i.b,gloss:i.g,field:i.f,ev:i.ev,nodeal:!!i.nodeal}));function io(i,e,t){let n=i.get(e);n||i.set(e,n=[]),n.push(t)}function dc(i){const e=new Map,t=new Map;for(const n of i)io(e,n.a,n),io(t,n.b,n);return{keepFirst:e,keepSecond:t}}function _h(i){let e=i;for(;;){const{keepFirst:t,keepSecond:n}=dc(e),a=e.filter(o=>n.get(o.b).length-1+t.get(o.a).length-1>=2);if(a.length===e.length)return e;e=a}}const Ln=_h(fc),{keepFirst:xh,keepSecond:Mh}=dc(Ln),ao=new Map;for(const i of Ln)io(ao,i.a,i),i.b!==i.a&&io(ao,i.b,i);function Xn(i,e){const t=e===0?Mh.get(i.b):xh.get(i.a);return t?t.filter(n=>n!==i):[]}function cr(i){return Xn(i,0).length+Xn(i,1).length}const Ki=new Map;for(const i of Ln){if(Ki.has(i.word))continue;const e={size:0},t=[i];for(Ki.set(i.word,e);t.length;){const n=t.pop();e.size++;for(const a of[0,1])for(const o of Xn(n,a))Ki.has(o.word)||(Ki.set(o.word,e),t.push(o))}}function wh(i){var e;return((e=Ki.get(i.word))==null?void 0:e.size)??0}const Zi=new Map;for(const i of Ln)Zi.set(i.a,(Zi.get(i.a)??0)+1),Zi.set(i.b,(Zi.get(i.b)??0)+1);const bh=2*Ln.length,Sh=[...Zi.values()].reduce((i,e)=>i+(e/bh)**2,0),hr=11.5*Math.max(5/11.5,Math.min(1,Math.sqrt(.01/Math.max(Sh,1e-9)))),Xe=Math.PI*2,on=Math.PI/180,pc=1.35,mc=.21,yh=1-Math.pow(mc,pc),gc=45*on,ni=21*on,Eh=[["ʻĀkau",0],["Hikina",90],["Hema",180],["Komohana",270]],ur=["Lā","ʻĀina","Noio","Manu","Nālani","Nā Leo","Haka"],fr=[["Koʻolau",90,-1],["Malanai",90,1],["Kona",270,-1],["Hoʻolua",270,1]];function Th(i,e){const t=su(i*7919+101),n=e.x1-e.x0,a=e.z1-e.z0,o=Math.min(n/42,a/29),s=Math.max(.62,o),r=Ah(e,o),l=2.2*s,c={x0:e.x0-l,x1:e.x1+l,z0:e.z0-l,z1:e.z1+l},h=Ph(e,r,s,t),u=Rh(h,o,t),f=Ch(h,u,i),p=Lh(h,f,s),g=u.map(ee=>Us(h,f,ee,ee.head*h.rcAt(ee.bearing),s)),v=u.map((ee,ce)=>Nh(h,f,p,ee,u[(ce+1)%u.length],s)),m=Ih(h,u,[(e.x0+e.x1)/2,(e.z0+e.z1)/2],t),d=$h(c,f),M=new Uint8Array(d.n);for(let ee=0;ee<d.n;ee++)M[ee]=d.h[ee]>0?1:0;const _=wi({...d,h:Qh(d,M,0)},.5*s).filter(ee=>ee.closed).sort((ee,ce)=>ce.pts.length-ee.pts.length).map(ee=>ga(ee,2,.01*s))[0],w=zh(h,f,p,u[m.lava],s,t);Kh(d,w.line,.02);const P=Po(d),k=wi(P,0).filter(ee=>ee.closed&&Math.abs(No(ee.pts))>1.2*s*s);k.sort((ee,ce)=>Math.abs(No(ce.pts))-Math.abs(No(ee.pts)));const T=k[0].pts;w.edges=Co(w.line,([ee,ce])=>{const O=Math.round((ee-d.x0)/d.step),Ye=Math.round((ce-d.z0)/d.step);return xs(d,O,Ye,ee,ce)>.06*s}).filter(ee=>Mc(ee)>.3*s);const S=ee=>({stream:g[ee],ridges:[v[(ee-1+v.length)%v.length],v[ee]]}),x=Oh(d,T,S(m.fishpond),s,t);let b=null;for(const ee of m.halau){const ce=Bh(d,T,S(ee),s,t);if((!b||ce.clear>b.clear)&&(b=ce),ce.clear>.12*s)break}delete b.clear;const N=Gh(d,T,S(m.kauhale),s,t),L=Hh(h,f,S(m.loi),s,t),V=[.16,.36,.6,.9,1.26,1.7,2.22,2.8],E=eu(d,x.line,.06*s,V.at(-1)*s),C=Po({...d,h:E}),D=Po({...d,h:Zh(d,E,3)}),j=V.map(ee=>({d:ee*s,lines:wi(D,ee*s).map(ce=>ga(ce,2,.008*s))})),F=.82*s,z=Yh(C,h,F,w,x,s,t),G=([ee,ce])=>oa(w.line,ee,ce),B={..._,firm:Co(_.pts,ee=>!G(ee)),flow:Co(_.pts,G)},q=u.filter(ee=>ee.windward).length,I=v.map((ee,ce)=>{const O=Dh(d,ee,s);return{line:O,sea:Uh(d,E,O,F+.25*s,s),moku:ce===q-1||ce===u.length-1}}),Y=I.map(ee=>au(ee.line,B.pts)).filter(Boolean),W=Math.max(10,Math.min(24,Math.round(h.meanR/.62))),Q=[];for(let ee=1;ee<W;ee++){const ce=ee/W;Q.push({level:ce,major:ee%5===0,lines:wi(P,ce).filter(O=>O.pts.length>4).map(O=>ga(O,1,.012*s))})}const te=Wh(h,p,s,t),se=Fh(h,f,p,u[m.stream],s),pe=[qh(r,t),{...x,field:"kai",kind:"fishpond"},{...w,field:"ʻāina",kind:"lava"},{...L,field:"ulu",kind:"loi"},{...N,field:"kanaka",kind:"kauhale"},{...b,field:"hana",kind:"halau"},{...te,field:"naʻau",kind:"cloud"},{...se,field:"hele",kind:"stream"}];return{seed:i,k:s,sheet:c,summit:[h.S[0],h.S[1]],height:{x0:d.x0,z0:d.z0,step:d.step,nx:d.nx,nz:d.nz,h:d.h},coast:k.map(ee=>ga(ee,1,.008*s)),contours:Q,waterlines:j,boundaries:I,trail:B,ahu:Y,streams:g.map((ee,ce)=>({pts:ca(Ii(ee,!1,2),.01*s),windward:u[ce].windward})).filter((ee,ce)=>ce!==m.lava&&ce!==m.stream),reef:z,upland:{x:p.x,z:p.z,r:p.r,ring:p.ring},moku:[{name:"Koʻolau",bearing:Nn(h.mokuSplit[0]+Yn(h.mokuSplit[0],h.mokuSplit[1])/2)},{name:"Kona",bearing:Nn(h.mokuSplit[1]+Yn(h.mokuSplit[1],h.mokuSplit[0])/2)}],swell:jh(c,d,E,F,s),compass:pe[0],places:pe}}function dr(i,e,t,n,a){const{ring:o,x:s,z:r,r:l}=i.upland;if(n<s-l||e>s+l||a<r-l||t>r+l)return!1;if(oa(o,(e+n)/2,(t+a)/2))return!0;for(const[h,u]of o)if(h>=e&&h<=n&&u>=t&&u<=a)return!0;return[[e,t],[n,t],[n,a],[e,a]].some(([h,u])=>oa(o,h,u))}function kh(i,e,t){if(i.line)return ha(i.line,e,t);const n=e-i.x,a=t-i.z;if(i.hw!=null){if(!(Math.abs(n)<=i.hw&&Math.abs(a)<=i.hh))return[i.x+st(n,-i.hw,i.hw),i.z+st(a,-i.hh,i.hh)];const r=i.hw-Math.abs(n),l=i.hh-Math.abs(a);return r<l?[i.x+Math.sign(n||1)*i.hw,t]:[e,i.z+Math.sign(a||1)*i.hh]}const o=Math.hypot(n,a)||1;return[i.x+n/o*i.r,i.z+a/o*i.r]}function Ah(i,e){const t=st(.15*Math.min(i.x1-i.x0,i.z1-i.z0),2.1,3.6);return{x:i.x1-t-4*e,z:i.z0+t+3*e,r:t,sx:1,sz:-1}}function Ph(i,e,t,n){const o=2*t,s={x0:i.x0+o,x1:i.x1-o,z0:i.z0+o,z1:i.z1-o},r=1,l=(s.z1-s.z0)/(s.x1-s.x0)*(.92+.12*n()),c=(12+12*n())*on,h=(B,q)=>[B*Math.cos(c)+q*Math.sin(c),q*Math.cos(c)-B*Math.sin(c)],u=[-1*(.1+.1*n()),1*(.06+.12*n())*l],[f,p]=h(...u),g=n()*Xe,v=.1+.08*n(),m=[2,3,4,5,7,9,12,16].map(B=>[B,(.05+.04*n())/Math.pow(B,.75),n()*Xe]),d=new Float64Array(720),M=[];for(let B=0;B<720;B++){const q=B/720*Xe,[I,Y]=Vt(q),[W,Q]=h(I,Y),te=W*W/(r*r)+Q*Q/(l*l),se=2*(f*W/(r*r)+p*Q/(l*l)),pe=f*f/(r*r)+p*p/(l*l)-1;let ee=(-se+Math.sqrt(se*se-4*te*pe))/(2*te);ee*=1+v*Math.pow(Math.max(0,Math.cos(q-g)),3);for(const[ce,O,Ye]of m)ee*=1+O*Math.cos(ce*q+Ye);d[B]=ee,M.push([u[0]+ee*I,u[1]+ee*Y])}const _=M.map(B=>B[0]),w=M.map(B=>B[1]),P=Math.min(..._),k=Math.max(..._),T=Math.min(...w),S=Math.max(...w);let x=Math.min((s.x1-s.x0)/(k-P),(s.z1-s.z0)/(S-T)),b=0,N=0;for(let B=0;B<60;B++){const q=s.x1-s.x0-x*(k-P),I=s.z1-s.z0-x*(S-T);b=(s.x0+s.x1)/2-x*((P+k)/2)-e.sx*q/2,N=(s.z0+s.z1)/2-x*((T+S)/2)-e.sz*I/2;let Y=1/0;for(const[W,Q]of M)Y=Math.min(Y,Math.hypot(b+x*W-e.x,N+x*Q-e.z));if(Y>=e.r+1.25*t)break;x*=.97}const L=[b+x*u[0],N+x*u[1]],V=d.map(B=>B*x),E=B=>{const q=(B>=0&&B<Xe?B:Nn(B))/Xe*720,I=Math.floor(q),Y=q-I;return V[I%720]*(1-Y)+V[(I+1)%720]*Y},C=B=>{const[q,I]=Vt(B),Y=E(B);return[L[0]+q*Y,L[1]+I*Y]},D=E(g)*.58,[j,F]=Vt(g),z=[(315+(n()-.5)*24)*on,(135+(n()-.5)*24)*on];let G=0;for(const B of V)G+=B/720;return{S:L,rcAt:E,coastAt:C,meanR:G,shoulder:{x:L[0]+j*D,z:L[1]+F*D,s:E(g)*.3,k:.16+.05*n()},mokuSplit:z}}function Rh(i,e,t){const a=[];for(let u=0;u<=1440;u++)a.push(i.coastAt(i.mokuSplit[0]+u/1440*Xe));const o=[0];for(let u=1;u<=1440;u++)o.push(o[u-1]+Math.hypot(a[u][0]-a[u-1][0],a[u][1]-a[u-1][1]));const s=Yn(i.mokuSplit[0],i.mokuSplit[1]),r=Math.round(s/Xe*1440),l=[{from:0,to:o[r],spacing:Math.max(2.8,3.4*e),windward:!0},{from:o[r],to:o[1440],spacing:Math.max(4.4,5.2*e),windward:!1}],c=[];for(const u of l){const f=u.to-u.from,p=Math.max(4,Math.round(f/u.spacing)),g=f/p;for(let v=0;v<p;v++){const m=u.from+(v+.5+(t()-.5)*.45)*g;let d=0;for(;o[d+1]<m;)d++;const M=Nn(i.mokuSplit[0]+(d+(m-o[d])/(o[d+1]-o[d]))/1440*Xe);c.push(u.windward?{bearing:M,windward:!0,depth:.13+.07*t(),head:mc+.1+.14*t(),width:g*(.22+.06*t())}:{bearing:M,windward:!1,depth:.04+.03*t(),head:.5+.14*t(),width:g*(.17+.05*t())})}}const h=t()*Xe;for(const u of c)u.bend=.24*Math.sin(2*u.bearing+h)+.08*(t()-.5),u.wobble=.015+.025*t(),u.phase=t()*Xe,u.freq=4+4*t(),u.mouth=u.windward?t()<.2?.6+.2*t():.08+.4*t():.4+.5*t(),u.reach=3*u.width*1.2;return c}const aa=(i,e)=>i.bearing+i.bend*Math.max(0,e-i.head)**2+i.wobble*(Math.sin(e*i.freq+i.phase)+.5*Math.sin(e*i.freq*2.3+i.phase*1.7));function Ch(i,e,t){const{S:n,shoulder:a}=i,o=bc(t*31+7),s=i.meanR/3.2,r=e.map(l=>1.5*l.wobble+Math.abs(l.bend));return(l,c)=>{const h=l-n[0],u=c-n[1],f=Math.hypot(h,u);let p=Math.atan2(h,-u);p<0&&(p+=Xe);const g=f/i.rcAt(p);let v=1-Math.pow(g,pc);if(v+=.035*(o(l/s,c/s)+.5*o(l/(s*.45)+17,c/(s*.45)-9)),g>=1.16)return v;if(g<1.02){const m=l-a.x,d=c-a.z;v+=a.k*Math.exp(-(m*m+d*d)/(a.s*a.s))*Jt(1.02,.6,g)}for(let m=0;m<e.length;m++){const d=e[m];if(g<d.head)continue;let M=p-d.bearing;if(M>Math.PI?M-=Xe:M<-Math.PI&&(M+=Xe),Math.abs(M)*f>d.reach+r[m]*f)continue;const _=f*Gs(p,aa(d,g)),w=d.width*(.5+.6*g);if(Math.abs(_)>3*w)continue;const P=Jt(d.head,d.head+.16,g)*(1-(1-d.mouth)*Jt(.82,1,g))*(1-Jt(1.04,1.16,g));v-=d.depth*P*Math.exp(-((_/w)**2))}return v}}function Lh(i,e,t){const a=[];for(let l=0;l<240;l++){const c=l/240*Xe,[h,u]=Vt(c);let f=0;const p=.05*t;for(;e(i.S[0]+h*(f+p),i.S[1]+u*(f+p))>yh;)f+=p;a.push(f+p/2)}const o=a.map((l,c)=>{let h=0;for(let u=-3;u<=3;u++)h+=a[(c+u+240)%240];return h/7}),s=o.map((l,c)=>{const[h,u]=Vt(c/240*Xe);return[i.S[0]+h*l,i.S[1]+u*l]}),r=l=>{const c=Nn(l)/Xe*240,h=Math.floor(c),u=c-h;return o[h%240]*(1-u)+o[(h+1)%240]*u};return{x:i.S[0],z:i.S[1],r:Math.max(...o),ring:s,radiusAt:r}}function Us(i,e,t,n,a){const{S:o}=i,s=.12*a,r=[];let l=aa(t,n/i.rcAt(t.bearing)),c=null;for(let h=n;h<i.rcAt(l)*1.3;h+=s){let u=1/0,f=l;for(let d=-6;d<=6;d++){const M=l+d/6*(.5*s)/Math.max(h,s),[_,w]=Vt(M),P=(M-l)*h,k=e(o[0]+_*h,o[1]+w*h)+.002*P*P;k<u&&(u=k,f=M)}l=f+.15*Gs(aa(t,h/i.rcAt(f)),f);const[p,g]=Vt(l),v=[o[0]+p*h,o[1]+g*h],m=e(v[0],v[1]);if(m<=0&&c){const d=c.h/(c.h-m);r.push([c.p[0]+(v[0]-c.p[0])*d,c.p[1]+(v[1]-c.p[1])*d]);break}r.push(v),c={p:v,h:m}}return r}function Nh(i,e,t,n,a,o){const{S:s}=i,r=.12*o;let l=Nn(n.bearing+Yn(n.bearing,a.bearing)/2);const c=[];let h=null;for(let u=t.radiusAt(l);u<i.rcAt(l)*1.3;u+=r){const f=u/i.rcAt(l),p=aa(n,f),g=Yn(p,aa(a,f)),v=p+g*.2,m=g*.6,d=Yn(v,l);d>m&&(l=d-m<Xe-d?v+m:v);let M=-1/0,_=l;for(let S=-6;S<=6;S++){const x=l+S/6*(.6*r)/u;if(Yn(v,x)>m)continue;const[b,N]=Vt(x),L=(x-l)*u,V=e(s[0]+b*u,s[1]+N*u)-.003*L*L;V>M&&(M=V,_=x)}l=_;const[w,P]=Vt(l),k=[s[0]+w*u,s[1]+P*u],T=e(k[0],k[1]);if(T<=0&&h){const S=h.h/(h.h-T);c.push([h.p[0]+(k[0]-h.p[0])*S,h.p[1]+(k[1]-h.p[1])*S]);break}c.push(k),h={p:k,h:T}}return ca(Ii(c,!1,2),.008*o)}function Dh(i,e,t){const[n,a]=e.at(-1);let o=Tt(i,i.h,n,a);if(o<=0)return e;const[s,r]=e.at(-2),l=Math.hypot(n-s,a-r)||1,c=(n-s)/l,h=(a-r)/l,u=.04*t;for(let f=u;f<4*t;f+=u){const p=Tt(i,i.h,n+c*f,a+h*f);if(p<=0){const g=f-u+u*o/(o-p);return[...e,[n+c*g,a+h*g]]}o=p}return e}function Uh(i,e,t,n,a){const[o,s]=t.at(-1),[r,l]=_c(i,e,o,s),c=Math.hypot(r,l)||1,[h,u]=t.at(-2);let f=r/c+(o-h)*2,p=l/c+(s-u)*2;const g=Math.hypot(f,p)||1;f/=g,p/=g;const v=[[o,s]];for(let m=.1*a;m<4*n;m+=.1*a){const d=[o+f*m,s+p*m];if(v.push(d),Tt(i,e,d[0],d[1])>=n)break}return v}const Ao=.8;function Ih(i,e,t,n){const a=e.length,o=[],s=()=>(n()-.5)*30,r=(w,P)=>Math.min(Math.abs(w-P),a-Math.abs(w-P)),l=e.map(w=>{const[P,k]=i.coastAt(w.bearing);return Math.hypot(P-t[0],k-t[1])/i.meanR}),c=(w,P,k=0)=>{for(const[T,S]of[[!0,2],[!0,1],[!1,2],[!1,1]]){const x=e.map((b,N)=>({i:N,score:Math.abs(Gs(b.bearing,w*on))+(b.windward?-b.depth:0)+k*l[N]})).filter(({i:b})=>(!T||P(e[b]))&&o.every(N=>r(b,N)>=S));if(x.length)return x.sort((b,N)=>b.score-N.score).map(({i:b})=>b)}throw new Error("island: no valley left for a place")},h=(...w)=>{const P=c(...w)[0];return o.push(P),P},u=w=>w.windward,f=w=>!w.windward,p=()=>!0,g=h(60+s(),u),v=h(n()<.5?105:15,u),m=h(245+s(),f),d=h(195+s(),f,Ao),M=h(140+s(),p,Ao),_=c(160+s(),p,Ao);return{stream:g,loi:v,lava:m,fishpond:d,halau:_,kauhale:M}}function Fh(i,e,t,n,a){const o=t.radiusAt(n.bearing)+.25*a,s=ca(Ii(Us(i,e,n,o,a),!1,2),.008*a);return{..._o(s),line:s}}function zh(i,e,t,n,a,o){const s=t.radiusAt(n.bearing)+.2*(i.rcAt(n.bearing)-t.radiusAt(n.bearing)),r=Us(i,e,n,s,a),[l,c]=r.at(-1),[h,u]=r.at(-3),f=Math.hypot(l-h,c-u)||1;for(let z=.12*a;z<=.45*a;z+=.11*a)r.push([l+(l-h)/f*z,c+(c-u)/f*z]);const p=Is(Ii(r,!1,2),.06*a),g=(p.length-1)*.06*a,v=.5,m=Ms(o()*1e3),d=Ms(o()*1e3),M=(z,G)=>{const B=z/g,q=a*(.22+.62*Jt(0,.75,B)),I=G<0?m:d,Y=.17*Math.pow(Math.abs(Math.sin(z/(.32*a)+G)),.7)*(1-Jt(v-.08,v+.04,B)),W=.06*I(z/(.07*a))*Jt(v-.04,v+.08,B);return q*(1+.12*I(z/(.9*a))+Y+W)},_=xc(p),w=_.map(([z,G,B,q],I)=>{const Y=M(I*.06*a,-1);return[z-B*Y,G-q*Y]}),P=_.map(([z,G,B,q],I)=>{const Y=M(I*.06*a,1);return[z+B*Y,G+q*Y]}),k=(z,G,B,q,I)=>{const Y=[];for(let W=1;W<12;W++){const Q=W/12,te=I?(o()-.5)*I:0,se=Math.sin(Q*Math.PI)*(q+te);Y.push([z[0]+(G[0]-z[0])*Q+B[0]*se,z[1]+(G[1]-z[1])*Q+B[1]*se])}return Y},[,,T,S]=_[0],[,,x,b]=_.at(-1),N=[-S,T],L=[b,-x],V=[...k(P[0],w[0],N,.6*Pi(P[0],w[0])*.5,0),...w,...k(w.at(-1),P.at(-1),L,.35*Pi(w.at(-1),P.at(-1)),.12*a),...P.slice().reverse()];V.push(V[0]);const E=[],C=[],D=(z,G)=>{const B=st(Math.round(z/(.06*a)),0,_.length-1),[q,I,Y,W]=_[B],Q=(M(z,-1)+M(z,1))/2;return[q+Y*G*Q,I+W*G*Q]};for(let z=.5*a;z<g*v;z+=.55*a+o()*.25*a){const G=(o()-.5)*.9,B=.35+.25*o(),q=(I,Y)=>{const W=[];for(let Q=0;Q<=8;Q++){const te=(Q/8-.5)*2;W.push(D(z-I+.22*a*Y*(1-te*te),G+te*B*Y))}return W};E.push(q(0,1));for(let I=1;I<=3;I++)C.push(q(.07*a*I,1-I*.2))}const j=[],F=.13*a;for(let z=g*v;z<g;z+=F){const G=(M(z,-1)+M(z,1))/2,B=Math.max(2,Math.round(2*G/F));for(let q=0;q<B;q++){const I=(q+.2+.6*o())/B*2-1;Math.abs(I)>.92||j.push(D(z+(o()-.5)*F,I))}}return{..._o(V),line:V,axis:p,lobes:E,ropes:C,stipple:j}}function Oh(i,e,t,n,a){const o=t.stream.at(-1),[s,r]=ha(e,o[0],o[1]),[l,c]=Ei(i,s,r),h=-c,u=l,f=Math.min(...Os(e,s,r,t.ridges,n).map(S=>S.gap)),p=st(.85*f,1.1*n,1.9*n),g=s-l*.2*p,v=r-c*.2*p,m=[];for(let S=0;S<=90;S++){const x=(S/90*2-1)*115*on;m.push([g+p*(Math.cos(x)*l+Math.sin(x)*h),v+p*(Math.cos(x)*c+Math.sin(x)*u)])}const d=m.map(([S,x])=>Tt(i,i.h,S,x)<0);let M=45,_=45;for(;M>0&&d[M-1];)M--;for(;_<90&&d[_+1];)_++;const w=ca(m.slice(Math.max(0,M-1),Math.min(90,_+1)+1),.004*n),P=Mc(w),k=(P>2.4*n?[.3,.7]:[.5]).map(S=>{const[x,b,N,L]=iu(w,S*P+(a()-.5)*.1*P);return{x,z:b,dx:N,dz:L,w:.16*n}}),T=[];for(let S=0;S<200&&T.length<5;S++){const x=a()*Xe,b=Math.sqrt(a())*p*.8,N=g+Math.cos(x)*b,L=v+Math.sin(x)*b;Tt(i,i.h,N,L)>-.01||T.some(V=>Math.hypot(V.x-N,V.z-L)<.45*n)||T.push({x:N,z:L,phase:a()*7,period:5+3*a()})}return{x:g+l*.4*p,z:v+c*.4*p,r:.85*p,line:w,gates:k,rings:T}}function Bh(i,e,t,n,a){const o=t.stream.at(-1),[s,r]=ha(e,o[0],o[1]),l=[t.stream,...t.ridges],c=Os(e,s,r,t.ridges,n).sort((F,z)=>z.gap-F.gap);let h=s,u=r,f=n,p=-1/0;e:for(const F of[1,.8,.65])for(const{s:z,gap:G}of c)for(const B of[.45,.55,.35,.65,.28]){const[q,I]=wc(e,s,r,z*st(B*G,.35*n,1.4*n)),[Y,W]=Ei(i,q,I);let Q=1/0;for(const te of[-.24,0,.24])for(let se=-.1;se>=-2.2;se-=.15){const pe=q+(Y*se-W*te)*n*F,ee=I+(W*se+Y*te)*n*F;for(const ce of l)Q=Math.min(Q,vo(ce,pe,ee))}if(Q>p&&(p=Q,h=q,u=I,f=n*F),Q>.12*n)break e}const[g,v]=Ei(i,h,u),m=-v,d=g,M=(F,z)=>[h+g*F+m*z,u+v*F+d*z],_=1.1*f,w=.46*f,P=-1.05*f,k=[M(P,-w/2),M(P,w/2),M(P-_,w/2),M(P-_,-w/2)],T=[M(P,0),M(P-_,0)],S=[];for(let F=1;F<12;F++){const z=P-_*F/12;S.push([M(z,-w/2),M(z,-w*.06)],[M(z,w*.06),M(z,w/2)])}const x=.88*f,b=-.14*f,N=[-1,1].map(F=>{const z=F*.14*f,G=[];for(let B=0;B<=16;B++){const q=B/16,I=.042*f*Math.pow(Math.sin(q*Math.PI),.7)*(q<.5?1:1-.15*(q-.5));G.push(M(b-x*q,z-I))}for(let B=16;B>=0;B--){const q=B/16,I=.042*f*Math.pow(Math.sin(q*Math.PI),.7)*(q<.5?1:1-.15*(q-.5));G.push(M(b-x*q,z+I))}return G}),L=[.3,.5,.7].map(F=>[M(b-x*F,-.2*f),M(b-x*F,.2*f)]),V=[M(b-x*.42,-.09*f),M(b-x*.42,.09*f),M(b-x*.58,.09*f),M(b-x*.58,-.09*f)],E=[],C=Fs(e,h,u);for(let F=-1.5*n;F<=1.5*n;F+=.08*n){const[z,G]=zs(e,C,F),[B,q]=Ei(i,z,G);for(let I=.03*n;I<.5*n;I+=.08*n){const Y=[z-B*(I+a()*.06*n),G-q*(I+a()*.06*n)];Tt(i,i.h,Y[0],Y[1])<=0||a()>(1-Math.abs(F)/(1.6*n))*(1-I/(.55*n))*1.6||oa(k,Y[0],Y[1])||E.push(Y)}}const D=[...k,k[0]],j=[...k,...N[0],...N[1]];return{..._o(j),line:D,shed:k,ridge:T,thatch:S,hulls:N,beams:L,deck:V,sand:E,clear:p}}function Gh(i,e,t,n,a){const o=t.stream.at(-1),[s,r]=ha(e,o[0],o[1]),{s:l,gap:c}=Os(e,s,r,t.ridges,n).sort((L,V)=>V.gap-L.gap)[0],h=[t.stream,...t.ridges],u=(L,V,E)=>h.every(C=>vo(C,L,V)>E);let f=s,p=r,g=s,v=r;for(const L of[.5,.4,.6,.3]){[f,p]=wc(e,s,r,l*st(L*c,.4*n,1.6*n));const[V,E]=Ei(i,f,p);if(g=f-V*.95*n,v=p-E*.95*n,u(g,v,.8*n))break}const[m,d]=Ei(i,f,p),M=Math.atan2(m,-d),_=[];for(let L=0;L<400&&_.length<5;L++){const V=a()*Xe,E=Math.sqrt(a())*.75*n,C=g+Math.cos(V)*E,D=v+Math.sin(V)*E,j=(.34+.18*a())*n,F=(.22+.12*a())*n,z=M+(a()-.5)*.4,G={x:C,z:D,w:j,h:F,ang:z};Lo(G).some(([q,I])=>Tt(i,i.h,q,I)<.004||!u(q,I,.12*n))||_.some(q=>Math.hypot(q.x-C,q.z-D)<(Math.max(q.w,q.h)+Math.max(j,F))*.55+.05*n)||_.push(G)}const w=_.map((L,V)=>{const E=Lo(L);if(V>=3)return{paepae:E};const C={...L,w:L.w*.72,h:L.h*.62},D=Lo(C),j=Math.cos(L.ang),F=Math.sin(L.ang),z=(C.w-C.h)/2,G=[[L.x-j*z,L.z-F*z],[L.x+j*z,L.z+F*z]],B=[[D[0],G[0]],[D[3],G[0]],[D[1],G[1]],[D[2],G[1]]];return{paepae:E,roof:D,ridge:G,hips:B}}),P=w.flatMap(L=>L.paepae),k=P.map(L=>L[0]),T=P.map(L=>L[1]),S=(Math.min(...k)+Math.max(...k))/2,x=(Math.min(...T)+Math.max(...T))/2,b=(Math.max(...k)-Math.min(...k))/2+.12*n,N=(Math.max(...T)-Math.min(...T))/2+.12*n;return{x:S,z:x,r:Math.hypot(b,N),hw:b,hh:N,houses:w}}function Hh(i,e,t,n,a){const o=.04*n,s=W=>Math.round(W/o),r=xc(Is(t.stream,o)),l=r.length-1,c=([W,Q])=>{const te=W-i.S[0],se=Q-i.S[1];return Math.hypot(te,se)/i.rcAt(Bs(te,se))},h=l-s(.75*n);let u=r.findIndex(W=>c(W)>.6);(u<0||u>h-s(1.5*n))&&(u=Math.max(s(.8*n),h-s(2.2*n)));const f=Math.min(h,u+s(2.6*n)),p=[-1,1].map(W=>{let Q=2.5*n;for(let te=0;te<=1;te+=.2){const[se,pe,ee,ce]=r[Math.round(u-s(.6*n)+(f-u+s(.6*n))*te)];for(let O=.1*n;O<Q;O+=.05*n)t.ridges.some(Ye=>vo(Ye,se+ee*O*W,pe+ce*O*W)<.25*n)&&(Q=O)}return Q}),g=p[0]>p[1]?-1:1,v=st(.8*Math.max(...p),.6*n,1.3*n),m=(W,Q)=>{const te=st(Math.floor(W),0,l-1),se=st(W-te,0,1),[pe,ee,ce,O]=r[te],[Ye,Me,ke,ve]=r[te+1],Ze=pe+(Ye-pe)*se,Re=ee+(Me-ee)*se;return[Ze+(ce+(ke-ce)*se)*Q*g,Re+(O+(ve-O)*se)*Q*g]},d=(W,Q)=>e(...m(W,Q)),M=.07*n,_=v,w=Ms(a()*1e3),P=W=>M+(_-M)*(.45+.55*Jt(u,u+.6*(f-u),W))*(1+.07*w(W*o/(.5*n))),k=st(Math.round((f-u)*o/(.36*n)),5,8),T=Array.from({length:k},()=>.5+a()),S=T.reduce((W,Q)=>W+Q,0),x=[u];for(const W of T)x.push(x.at(-1)+(f-u)*W/S);const b=Array.from({length:13},(W,Q)=>M+(_-M)*Q/12),N=x.map(W=>{const Q=d(W,M);let te=W;return b.map(se=>(te=Vh(d,Q,te,se,s(1.6*n),l),te))}),L=Math.max(...N.map((W,Q)=>Math.abs(W.at(-1)-x[Q])))*o,V=Math.min(1,.5*v/Math.max(L,1e-6));for(const[W,Q]of N.entries())for(let te=0;te<Q.length;te++)Q[te]=x[W]+(Q[te]-x[W])*V;for(let W=1;W<N.length;W++)for(let Q=0;Q<b.length;Q++)N[W][Q]=Math.max(N[W][Q],N[W-1][Q]+s(.14*n));const E=.025*n,C=(W,Q,te)=>{for(let se=1;se<b.length;se++)if(Q<=b[se]){const pe=(Q-b[se-1])/(b[se]-b[se-1]);return W[se-1]+(W[se]-W[se-1])*pe+te}return W.at(-1)+te},D=(W,Q,te,se)=>{const[pe,ee]=[P(C(W,se,0)),P(C(Q,se,0))].map(O=>Math.min(se,O-E)),ce=O=>[te,...b.filter(Ye=>Ye>te+1e-9&&Ye<O-1e-9),O];return[...ce(pe).map(O=>m(C(W,O,E/o),O)),...ce(ee).reverse().map(O=>m(C(Q,O,-E/o),O))]},j=[];for(let W=0;W<k;W++){const Q=N[W],te=N[W+1],se=P(C(te,_,0));if(se-M>.6*n&&a()<.55){const pe=M+(se-M)*(.35+.3*a());j.push(D(Q,te,M,pe-E),D(Q,te,pe+E,_))}else j.push(D(Q,te,M,_))}const F=[],z=Math.max(0,u-s(.6*n));for(let W=z;W<=u;W+=2)F.push(m(W,.02*n+(P(u)+.03*n)*Jt(z,u,W)));const G=C(N[k],_,0);for(let W=u+2;W<=G;W+=2)F.push(m(W,P(W)+.03*n));const B=P(G)*.5,q=C(N[k],B,0),I=[m(q,B),m(q+s(.16*n),B*.45),m(q+s(.3*n),0)],Y=ou(j.flat());return Y.push(Y[0]),{..._o(Y),line:Y,terraces:j,auwai:Ii(F,!1,2),drain:I}}function Vh(i,e,t,n,a,o){let s=t;const r=i(s,n)>e?1:-1;let l=s;for(let c=0;c<a;c++){const h=st(l+r,0,o);if(h===l)return l;if(s=l,l=h,i(l,n)>e!=r>0)break}for(let c=0;c<6;c++){const h=(s+l)/2;i(h,n)>e==r>0?s=h:l=h}return(s+l)/2}function Wh(i,e,t,n){const a=p=>e.radiusAt(p)+.15*t,o=p=>e.radiusAt(p)+.85*t,s=p=>{const g=[];for(let v=0;v<=180;v++){const m=v/180*Xe,[d,M]=Vt(m),_=p(m);g.push([i.S[0]+d*_,i.S[1]+M*_])}return g},r=[],l=e.r+.9*t,c=.04*t,h=(p,g)=>{const v=p-i.S[0],m=g-i.S[1],d=Bs(v,m);return{b:d,f:(Math.hypot(v,m)-a(d))/(o(d)-a(d))}};for(let p=i.S[1]-l;p<=i.S[1]+l;p+=.085*t){let g=null,v=0;for(let m=i.S[0]-l;m<=i.S[0]+l+c;m+=c){const{f:d}=h(m,p),M=d>=0&&d<=1;if(M&&g==null&&(g=m+n()*.1*t,v=(.18+.4*n())*t),g!=null&&(!M||m-g>=v)){const _=M?m:m-c;_-g>.06*t&&r.push({x0:g,z0:p,x1:_,z1:p,...h((g+_)/2,p)}),g=M?m+(.05+.08*n())*t:null,v=(.18+.4*n())*t}}}const u=s(o);let f=0;for(const[p,g]of u)f=Math.max(f,Math.hypot(p-i.S[0],g-i.S[1]));return{x:i.S[0],z:i.S[1],r:f,line:u,inner:s(a),strokes:r}}function qh(i,e){const t=Eh.map(([a,o])=>({name:a,bearing:o*on,cardinal:!0}));for(const[a,o,s]of fr)ur.forEach((r,l)=>t.push({name:r,quadrant:a,bearing:(o+s*11.25*(l+1))*on}));t.sort((a,o)=>a.bearing-o.bearing);const n=[];for(const a of["Koʻolau","Malanai"])for(const o of ur.slice(0,6)){const s=t.find(l=>l.quadrant===a&&l.name===o),r=a==="Koʻolau"?"Hoʻolua":"Kona";n.push({name:o,rises:a,sets:r,path:Xh(s.bearing)})}for(let a=n.length-1;a>0;a--){const o=Math.floor(e()*(a+1));[n[a],n[o]]=[n[o],n[a]]}return{field:"lani",kind:"compass",x:i.x,z:i.z,r:i.r,horizon:.56*i.r,houses:t,quadrants:fr.map(([a],o)=>({name:a,bearing:(45+90*o)*on})),stars:n}}function Xh(i){const e=Math.cos(i)*Math.cos(ni),t=Math.asin(e),n=Math.acos(st(-Math.tan(ni)*Math.tan(t),-1,1)),a=[];for(let o=0;o<=64;o++){const s=-n+2*n*o/64,r=-Math.cos(t)*Math.sin(s),l=e*Math.cos(ni)-Math.cos(t)*Math.cos(s)*Math.sin(ni),c=e*Math.sin(ni)+Math.cos(t)*Math.cos(s)*Math.cos(ni),h=Math.atan2(r,l),u=1-Math.asin(st(c,-1,1))/(Math.PI/2);a.push([Math.sin(h)*u,-Math.cos(h)*u])}for(const o of[a[0],a.at(-1)]){const s=Math.hypot(o[0],o[1]);o[0]/=s,o[1]/=s}return a}function Yh(i,e,t,n,a,o,s){const r=wi(i,t).filter(_=>_.closed);r.sort((_,w)=>w.pts.length-_.pts.length);const l=Is(r[0].pts,.02*o),c=[s(),s(),s()].map(_=>_*Xe),h=_=>Math.sin(2*_+c[0])+.6*Math.sin(3*_+c[1])+.4*Math.sin(5*_+c[2]),u=n.axis.at(-1),f=l.map(([_,w])=>Math.hypot(_-u[0],w-u[1])<2.6*o?!1:Math.hypot(_-a.x,w-a.z)<a.r+1.4*o?!0:h(Bs(_-e.S[0],w-e.S[1]))>-.25),p=[],g=[],v=Vt(gc);let m=0,d=0,M=0;for(let _=1;_<l.length;_++){if(M+=.02*o,!f[_])continue;const[w,P]=l[_],[k,T]=_c(i,i.h,w,P),S=Math.hypot(k,T)||1,x=k/S,b=T/S;if(M>=m){const N=(s()-.5)*.08*o;p.push([w+x*N,P+b*N]),s()<.55&&p.push([w-x*(.13+s()*.06)*o,P-b*(.13+s()*.06)*o]),m=M+(.1+s()*.07)*o}if(M>=d&&x*v[0]+b*v[1]>.2){const N=-b,L=x,V=(s()-.5)*.06;for(const[E,C]of[[.15,.13],[.24,.08]]){const D=w+x*E*o,j=P+b*E*o;g.push({x:D,z:j,pts:[-1,0,1].map(F=>[D+(N+x*V)*F*C*o+x*(1-F*F)*.012*o,j+(L+b*V)*F*C*o+b*(1-F*F)*.012*o])})}d=M+(.5+s()*.25)*o}}return{at:t,dots:p,surf:g}}function jh(i,e,t,n,a){const o=Math.max(.24,.3*Math.min(1.2,a)),s=Math.ceil((i.x1-i.x0)/o)+1,r=Math.ceil((i.z1-i.z0)/o)+1,l=s*r,c=Vt(gc+Math.PI),h=new Float32Array(l);for(let S=0;S<r;S++)for(let x=0;x<s;x++)h[S*s+x]=Tt(e,t,i.x0+x*o,i.z0+S*o);const u=S=>h[S]<=.02*a,f=new Float32Array(l);for(let S=0;S<l;S++)f[S]=.5+.5*Jt(0,3*a,h[S]);const p=(S,x)=>(i.x0+S*o-i.x1)*c[0]+(i.z0+x*o-i.z0)*c[1],g=new Float64Array(l).fill(1/0),v=new ru(l);for(let S=0;S<r;S++)for(let x=0;x<s;x++){if(x!==s-1&&S!==0)continue;const b=S*s+x;u(b)||(g[b]=p(x,S),v.push(b,g[b]))}const m=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1],[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]],d=m.map(([S,x])=>Math.hypot(S,x)*o*2);for(;v.size;){const S=v.pop(),x=v.key;if(x>g[S])continue;const b=S%s,N=(S-b)/s;for(let L=0;L<m.length;L++){const V=b+m[L][0],E=N+m[L][1];if(V<0||E<0||V>=s||E>=r)continue;const C=E*s+V;if(u(C))continue;const D=x+d[L]/(f[S]+f[C]);D<g[C]&&(g[C]=D,v.push(C,D))}}const M=new Float64Array(l);for(let S=0;S<l;S++)M[S]=p(S%s,Math.floor(S/s));const _=Uint32Array.from({length:l},(S,x)=>x).sort((S,x)=>M[S]-M[x]),w=new Float32Array(l),P=Math.exp(-o/(7*a));for(const S of _){if(u(S)){w[S]=1;continue}const x=S%s,b=(S-x)/s,N=Math.round(x-c[0]),L=Math.round(b-c[1]);w[S]=N>=0&&L>=0&&N<s&&L<r?w[L*s+N]*P:0}const k=2.4*a,T=new Float32Array(l);for(let S=0;S<l;S++){if(!Number.isFinite(g[S]))continue;const x=Math.max(0,g[S]-p(S%s,Math.floor(S/s)));T[S]=(1-.92*w[S])*Math.exp(-x/(1.4*k))*Jt(n+.3*a,n+1.6*a,h[S])}return{x0:i.x0,z0:i.z0,step:o,nx:s,nz:r,T:Float32Array.from(g),energy:T,lambda:k,period:42}}function $h(i,e){const t=st((i.x1-i.x0)/320,.1,.15),n=Math.ceil((i.x1-i.x0)/t)+1,a=Math.ceil((i.z1-i.z0)/t)+1,o=new Float32Array(n*a);for(let s=0;s<a;s++)for(let r=0;r<n;r++)o[s*n+r]=e(i.x0+r*t,i.z0+s*t);return{x0:i.x0,z0:i.z0,step:t,nx:n,nz:a,n:n*a,h:o}}function Kh(i,e,t){const n=e.map(c=>c[0]),a=e.map(c=>c[1]),o=Math.max(0,Math.floor((Math.min(...n)-i.x0)/i.step)),s=Math.min(i.nx-1,Math.ceil((Math.max(...n)-i.x0)/i.step)),r=Math.max(0,Math.floor((Math.min(...a)-i.z0)/i.step)),l=Math.min(i.nz-1,Math.ceil((Math.max(...a)-i.z0)/i.step));for(let c=r;c<=l;c++)for(let h=o;h<=s;h++){const u=c*i.nx+h;i.h[u]<t&&oa(e,i.x0+h*i.step,i.z0+c*i.step)&&(i.h[u]=t)}}function Zh(i,e,t){const{nx:n,nz:a}=i;let o=Float32Array.from(e),s=new Float32Array(o.length);for(let r=0;r<t;r++){for(let l=0;l<a;l++)for(let c=0;c<n;c++){const h=l*n+c;s[h]=(o[c>0?h-1:h]+2*o[h]+o[c<n-1?h+1:h])/4}for(let l=0;l<a;l++)for(let c=0;c<n;c++){const h=l*n+c;o[h]=(s[l>0?h-n:h]+2*s[h]+s[l<a-1?h+n:h])/4}}return o}function Jh(i,e,t,n){for(let a=1;a<t.length;a++){const[o,s]=t[a-1],[r,l]=t[a],c=Math.ceil(Math.hypot(r-o,l-s)/(i.step*.5));for(let h=0;h<=c;h++){const u=o+(r-o)*h/c,f=s+(l-s)*h/c,p=Math.ceil(n/i.step),g=Math.round((u-i.x0)/i.step),v=Math.round((f-i.z0)/i.step);for(let m=-p;m<=p;m++)for(let d=-p;d<=p;d++){const M=g+d,_=v+m;M<0||_<0||M>=i.nx||_>=i.nz||Math.hypot(d,m)*i.step<=n+i.step*.5&&(e[_*i.nx+M]=1)}}}}function Qh(i,e,t){const{d2:n}=vc(i,e,t),a=new Float32Array(i.n);for(let o=0;o<i.n;o++)a[o]=Math.sqrt(n[o])*i.step;return a}function vc(i,e,t){const{nx:n,nz:a,n:o}=i,s=1e20,r=new Float64Array(o);for(let d=0;d<o;d++)r[d]=e[d]===t?0:s;const l=new Int32Array(o),c=new Int32Array(o),h=Math.max(n,a),u=new Float64Array(h),f=new Int32Array(h),p=new Float64Array(h+1),g=new Float64Array(h),v=new Int32Array(h),m=d=>{let M=0;f[0]=0,p[0]=-s,p[1]=s;for(let _=1;_<d;_++){let w=(u[_]+_*_-(u[f[M]]+f[M]*f[M]))/(2*_-2*f[M]);for(;w<=p[M];)M--,w=(u[_]+_*_-(u[f[M]]+f[M]*f[M]))/(2*_-2*f[M]);M++,f[M]=_,p[M]=w,p[M+1]=s}M=0;for(let _=0;_<d;_++){for(;p[M+1]<_;)M++;g[_]=(_-f[M])*(_-f[M])+u[f[M]],v[_]=f[M]}};for(let d=0;d<n;d++){for(let M=0;M<a;M++)u[M]=r[M*n+d];m(a);for(let M=0;M<a;M++)r[M*n+d]=g[M],l[M*n+d]=v[M]}for(let d=0;d<a;d++){for(let M=0;M<n;M++)u[M]=r[d*n+M];m(n);for(let M=0;M<n;M++)r[d*n+M]=g[M],c[d*n+M]=l[d*n+v[M]]*n+v[M]}return{d2:r,near:c}}function eu(i,e,t,n){const{nx:a,nz:o,n:s,step:r,h:l}=i,c=new Uint8Array(s);for(let _=0;_<s;_++)c[_]=l[_]>0?1:0;Jh(i,c,e,t);const{d2:h,near:u}=vc(i,c,1),f=new Float32Array(s),p=(n/r+2)**2,g=Math.min(...e.map(_=>_[0]))-n,v=Math.max(...e.map(_=>_[0]))+n,m=Math.min(...e.map(_=>_[1]))-n,d=Math.max(...e.map(_=>_[1]))+n,M=(_,w)=>_>g&&_<v&&w>m&&w<d?vo(e,_,w)-t:1/0;for(let _=0;_<s;_++){const w=_%a,P=(_-w)/a,k=i.x0+w*r,T=i.z0+P*r;if(c[_]){const S=l[_]>0&&(w>0&&!c[_-1]||w<a-1&&!c[_+1]||P>0&&!c[_-a]||P<o-1&&!c[_+a]);f[_]=l[_]>0?S?-xs(i,w,P,k,T):-r:Math.min(0,M(k,T))}else if(h[_]>p)f[_]=Math.sqrt(h[_])*r;else{const S=u[_],x=S%a,b=Math.min(xs(i,x,(S-x)/a,k,T),M(k,T));f[_]=b<1/0?b:Math.sqrt(h[_])*r}}return f}const tu=new Float64Array(8);function xs(i,e,t,n,a){const{nx:o,nz:s,step:r,h:l}=i,c=tu;let h=1/0;for(let u=Math.max(0,t-2);u<=Math.min(s-2,t+1);u++)for(let f=Math.max(0,e-2);f<=Math.min(o-2,e+1);f++){const p=u*o+f,g=l[p],v=l[p+1],m=l[p+o+1],d=l[p+o],M=i.x0+f*r,_=i.z0+u*r;let w=ma(c,0,g,v,M,_,r,0);w=ma(c,w,v,m,M+r,_,0,r),w=ma(c,w,m,d,M+r,_+r,-r,0),w=ma(c,w,d,g,M,_+r,0,-r);for(let P=0;P+3<w;P+=4)h=Math.min(h,nu(n,a,c[P],c[P+1],c[P+2],c[P+3]))}return h}function ma(i,e,t,n,a,o,s,r){if(t>0==n>0)return e;const l=t/(t-n);return i[e]=a+s*l,i[e+1]=o+r*l,e+2}function nu(i,e,t,n,a,o){const s=a-t,r=o-n,l=s*s+r*r,c=l?st(((i-t)*s+(e-n)*r)/l,0,1):0;return Math.hypot(t+s*c-i,n+r*c-e)}function Tt(i,e,t,n){const a=st((t-i.x0)/i.step,0,i.nx-1.001),o=st((n-i.z0)/i.step,0,i.nz-1.001),s=Math.floor(a),r=Math.floor(o),l=a-s,c=o-r,h=r*i.nx+s;return(e[h]*(1-l)+e[h+1]*l)*(1-c)+(e[h+i.nx]*(1-l)+e[h+i.nx+1]*l)*c}function _c(i,e,t,n){const a=i.step;return[Tt(i,e,t+a,n)-Tt(i,e,t-a,n),Tt(i,e,t,n+a)-Tt(i,e,t,n-a)]}function Ei(i,e,t){const n=i.step*3,a=Tt(i,i.h,e-n,t)-Tt(i,i.h,e+n,t),o=Tt(i,i.h,e,t-n)-Tt(i,i.h,e,t+n),s=Math.hypot(a,o)||1;return[a/s,o/s]}const nn=8;function Po(i){const{nx:e,nz:t,h:n}=i,a=Math.ceil((e-1)/nn),o=Math.ceil((t-1)/nn),s=new Float32Array(a*o).fill(1/0),r=new Float32Array(a*o).fill(-1/0);for(let l=0;l<t;l++){const c=Math.max(0,Math.floor((l-1)/nn)),h=Math.min(o-1,Math.floor(l/nn));for(let u=0;u<e;u++){const f=n[l*e+u],p=Math.max(0,Math.floor((u-1)/nn)),g=Math.min(a-1,Math.floor(u/nn));for(let v=c;v<=h;v++)for(let m=p;m<=g;m++){const d=v*a+m;f<s[d]&&(s[d]=f),f>r[d]&&(r[d]=f)}}}return{...i,blocks:{bx:a,bz:o,lo:s,hi:r}}}let Ro={first:new Int32Array(0),second:new Int32Array(0)};function wi(i,e){const{nx:t,nz:n,x0:a,z0:o,step:s,h:r}=i;Ro.first.length<t*n*2&&(Ro={first:new Int32Array(t*n*2).fill(-1),second:new Int32Array(t*n*2).fill(-1)});const{first:l,second:c}=Ro,h=[],u=[],f=(_,w)=>{const P=h.length;h.push(_),u.push(w),l[_]<0?l[_]=P:c[_]=P,l[w]<0?l[w]=P:c[w]=P},p=_=>{const w=r[_],P=r[_+1],k=r[_+t+1],T=r[_+t],S=w>e|(P>e)<<1|(k>e)<<2|(T>e)<<3;if(S===0||S===15)return;const x=_*2,b=(_+1)*2+1,N=(_+t)*2,L=_*2+1;if(S===5||S===10){const E=(w+P+k+T)/4>e;S===5===E?(f(x,b),f(N,L)):(f(L,x),f(b,N));return}let V=-1;for(const[E,C]of[[(S&1)!==(S&2)>>1,x],[(S&2)>>1!==(S&4)>>2,b],[(S&4)>>2!==(S&8)>>3,N],[(S&8)>>3!==(S&1),L]])E&&(V<0?V=C:f(V,C))},g=i.blocks;if(g){const{bx:_,bz:w,lo:P,hi:k}=g;for(let T=0;T<w;T++)for(let S=0;S<_;S++){if(e<P[T*_+S]||e>=k[T*_+S])continue;const x=Math.min(n-1,(T+1)*nn),b=Math.min(t-1,(S+1)*nn);for(let N=T*nn;N<x;N++)for(let L=S*nn;L<b;L++)p(N*t+L)}}else for(let _=0;_<n-1;_++)for(let w=0;w<t-1;w++)p(_*t+w);const v=_=>{const w=_>>1,P=w%t,k=(w-P)/t,T=r[w];if(_&1){const x=(e-T)/(r[w+t]-T);return[a+P*s,o+(k+x)*s]}const S=(e-T)/(r[w+1]-T);return[a+(P+S)*s,o+k*s]},m=new Uint8Array(h.length),d=(_,w,P)=>{let k=_,T=w;for(;;){const S=l[T]===k?c[T]:l[T];if(S<0||m[S])return T;m[S]=1,T=h[S]===T?u[S]:h[S],P.push(T),k=S}},M=[];for(let _=0;_<h.length;_++){if(m[_])continue;m[_]=1;const w=[u[_]],P=d(_,u[_],w),k=[];d(_,h[_],k);const T=[...k.reverse(),h[_],...w];M.push({pts:T.map(v),closed:T[0]===P&&T.length>3})}for(let _=0;_<h.length;_++)l[h[_]]=l[u[_]]=-1,c[h[_]]=c[u[_]]=-1;return M}function ga(i,e,t){return{closed:i.closed,pts:ca(Ii(i.pts,i.closed,e),t)}}function Co(i,e){const t=i.length>2&&Pi(i[0],i.at(-1))<1e-9,n=t?i.length-1:i.length,a=i.slice(0,n).map(e),o=(c,h)=>[(c[0]+h[0])/2,(c[1]+h[1])/2];if(a.every(Boolean))return[i];const s=t?a.indexOf(!1):0,r=[];let l=null;for(let c=0;c<n;c++){const h=(s+c)%n,u=t||h>0?i[(h-1+n)%n]:null;a[h]?(l||(l=u?[o(u,i[h])]:[],r.push(l)),l.push(i[h])):l&&(l.push(o(u,i[h])),l=null)}return l&&t&&l.push(o(i[(s-1+n)%n],i[s])),r.filter(c=>c.length>1)}function Ii(i,e,t){let n=i;for(let a=0;a<t;a++){const o=e?[]:[n[0]];for(let s=0;s<n.length-1;s++){const[r,l]=n[s],[c,h]=n[s+1];o.push([r*.75+c*.25,l*.75+h*.25],[r*.25+c*.75,l*.25+h*.75])}e?o.push(o[0]):o.push(n.at(-1)),n=o}return n}function ca(i,e){if(i.length<3)return i;const t=new Uint8Array(i.length);t[0]=t[i.length-1]=1;const n=[[0,i.length-1]];for(;n.length;){const[a,o]=n.pop(),[s,r]=i[a],[l,c]=i[o],h=l-s,u=c-r,f=Math.hypot(h,u);let p=-1,g=e;for(let v=a+1;v<o;v++){const[m,d]=i[v],M=f>1e-9?Math.abs((m-s)*u-(d-r)*h)/f:Math.hypot(m-s,d-r);M>g&&(g=M,p=v)}p>=0&&(t[p]=1,n.push([a,p],[p,o]))}return i.filter((a,o)=>t[o])}function Is(i,e){const t=[i[0]];let n=0;for(let a=1;a<i.length;a++){const[o,s]=i[a-1],[r,l]=i[a],c=Math.hypot(r-o,l-s);let h=e-n;for(;h<=c;)t.push([o+(r-o)*h/c,s+(l-s)*h/c]),h+=e;n=c-(h-e)}return t}function xc(i){return i.map((e,t)=>{const n=i[Math.max(0,t-1)],a=i[Math.min(i.length-1,t+1)],o=a[0]-n[0],s=a[1]-n[1],r=Math.hypot(o,s)||1;return[e[0],e[1],-s/r,o/r]})}function Mc(i){let e=0;for(let t=1;t<i.length;t++)e+=Pi(i[t-1],i[t]);return e}function iu(i,e){for(let t=1;t<i.length;t++){const n=Pi(i[t-1],i[t]);if(e<=n||t===i.length-1){const a=n?st(e/n,0,1):0,[o,s]=i[t-1],[r,l]=i[t];return[o+(r-o)*a,s+(l-s)*a,(r-o)/(n||1),(l-s)/(n||1)]}e-=n}return[...i[0],1,0]}function wc(i,e,t,n){return zs(i,Fs(i,e,t),n)}function Fs(i,e,t){let n=0,a=1/0;for(let o=0;o<i.length;o++){const s=(i[o][0]-e)**2+(i[o][1]-t)**2;s<a&&(a=s,n=o)}return n}function zs(i,e,t){const n=i.length-1;let a=Math.abs(t);const o=t<0?-1:1;for(;a>0;){const s=(e+o+n)%n,r=Pi(i[e],i[s]);if(r>=a){const l=a/r;return[i[e][0]+(i[s][0]-i[e][0])*l,i[e][1]+(i[s][1]-i[e][1])*l]}a-=r,e=s}return i[e]}function Os(i,e,t,n,a){const o=n.map(r=>r.at(-1)),s=Fs(i,e,t);return[-1,1].map(r=>{for(let l=.1*a;l<8*a;l+=.1*a){const[c,h]=zs(i,s,r*l);if(o.some(([u,f])=>Math.hypot(c-u,h-f)<.25*a))return{s:r,gap:l}}return{s:r,gap:8*a}})}function vo(i,e,t){const[n,a]=ha(i,e,t);return Math.hypot(n-e,a-t)}function ha(i,e,t){let n=i[0],a=1/0;for(let o=1;o<i.length;o++){const[s,r]=i[o-1],[l,c]=i[o],h=l-s,u=c-r,f=h*h+u*u,p=f?st(((e-s)*h+(t-r)*u)/f,0,1):0,g=s+h*p,v=r+u*p,m=(g-e)**2+(v-t)**2;m<a&&(a=m,n=[g,v])}return n}function au(i,e){for(let t=1;t<i.length;t++){const[n,a]=[i[t-1],i[t]];for(let o=1;o<e.length;o++){const[s,r]=[e[o-1],e[o]],l=a[0]-n[0],c=a[1]-n[1],h=r[0]-s[0],u=r[1]-s[1],f=l*u-c*h;if(!f)continue;const p=((s[0]-n[0])*u-(s[1]-n[1])*h)/f,g=((s[0]-n[0])*c-(s[1]-n[1])*l)/f;if(p>=0&&p<=1&&g>=0&&g<=1)return[n[0]+l*p,n[1]+c*p]}}return null}function _o(i){const e=i.map(s=>s[0]),t=i.map(s=>s[1]),n=(Math.min(...e)+Math.max(...e))/2,a=(Math.min(...t)+Math.max(...t))/2;let o=0;for(const[s,r]of i)o=Math.max(o,Math.hypot(s-n,r-a));return{x:n,z:a,r:o}}function Lo({x:i,z:e,w:t,h:n,ang:a}){const o=Math.cos(a),s=Math.sin(a);return[[-t/2,-n/2],[t/2,-n/2],[t/2,n/2],[-t/2,n/2]].map(([r,l])=>[i+r*o-l*s,e+r*s+l*o])}function ou(i){const e=i.slice().sort((o,s)=>o[0]-s[0]||o[1]-s[1]),t=(o,s,r)=>(s[0]-o[0])*(r[1]-o[1])-(s[1]-o[1])*(r[0]-o[0]),n=[];for(const o of e){for(;n.length>=2&&t(n.at(-2),n.at(-1),o)<=0;)n.pop();n.push(o)}const a=[];for(const o of e.reverse()){for(;a.length>=2&&t(a.at(-2),a.at(-1),o)<=0;)a.pop();a.push(o)}return n.slice(0,-1).concat(a.slice(0,-1))}function oa(i,e,t){let n=!1;for(let a=0,o=i.length-1;a<i.length;o=a++){const[s,r]=i[a],[l,c]=i[o];r>t!=c>t&&e<(l-s)*(t-r)/(c-r)+s&&(n=!n)}return n}function No(i){let e=0;for(let t=1;t<i.length;t++)e+=i[t-1][0]*i[t][1]-i[t][0]*i[t-1][1];return e/2}function Vt(i){return[Math.sin(i),-Math.cos(i)]}function Bs(i,e){return Nn(Math.atan2(i,-e))}function Nn(i){return(i%Xe+Xe)%Xe}function Gs(i,e){let t=(i-e)%Xe;return t>Math.PI&&(t-=Xe),t<=-Math.PI&&(t+=Xe),t}function Yn(i,e){return Nn(e-i)}function Pi(i,e){return Math.hypot(e[0]-i[0],e[1]-i[1])}function st(i,e,t){return i<e?e:i>t?t:i}function Jt(i,e,t){const n=st((t-i)/(e-i),0,1);return n*n*(3-2*n)}function su(i){let e=i>>>0;return()=>{e=e+2654435769>>>0;let t=e^e>>>16;return t=Math.imul(t,569420461),t^=t>>>15,t=Math.imul(t,1935289751),t^=t>>>15,(t>>>0)/4294967296}}function va(i,e,t){let n=Math.imul(i|0,668265261)^Math.imul(e|0,374761393)^Math.imul(t|0,2654435761);return n=Math.imul(n^n>>>15,2246822507),n^=n>>>13,n=Math.imul(n,3266489909),n^=n>>>16,(n>>>0)/4294967296*2-1}function bc(i){return(e,t)=>{const n=Math.floor(e),a=Math.floor(t),o=e-n,s=t-a,r=o*o*(3-2*o),l=s*s*(3-2*s),c=va(n,a,i),h=va(n+1,a,i),u=va(n,a+1,i),f=va(n+1,a+1,i);return(c+(h-c)*r)*(1-l)+(u+(f-u)*r)*l}}function Ms(i){const e=bc(Math.floor(i));return t=>e(t,.5)}class ru{constructor(e){this.ids=new Int32Array(e*4),this.keys=new Float64Array(e*4),this.size=0,this.key=0}push(e,t){if(this.size===this.ids.length){const a=new Int32Array(this.ids.length*2),o=new Float64Array(this.keys.length*2);a.set(this.ids),o.set(this.keys),this.ids=a,this.keys=o}let n=this.size++;for(;n>0;){const a=n-1>>1;if(this.keys[a]<=t)break;this.ids[n]=this.ids[a],this.keys[n]=this.keys[a],n=a}this.ids[n]=e,this.keys[n]=t}pop(){const e=this.ids[0];this.key=this.keys[0];const t=this.ids[--this.size],n=this.keys[this.size];let a=0;for(;;){let o=2*a+1;if(o>=this.size||(o+1<this.size&&this.keys[o+1]<this.keys[o]&&o++,this.keys[o]>=n))break;this.ids[a]=this.ids[o],this.keys[a]=this.keys[o],a=o}return this.ids[a]=t,this.keys[a]=n,e}}const lu=Math.max(18,Math.min(65,Math.round(Ln.length/8))),Sc=lu/.92,pr=Math.max(4,Math.round(Math.sqrt(Sc/1.125))),Hs={cols:Math.max(4,Math.round(Sc/pr)),rows:pr},mr=21*Hs.cols/9,gr=14.5*Hs.rows/8,Ct={x0:-mr,x1:mr,z0:-gr,z1:gr},sn=1.5,Vs={h:.12},cu=Vs.h/2+sn,Ws=1.45,ei={slabs:{hx:cu+.05,hz:.55},marks:{x0:-1.8,x1:2,z0:-.92,z1:Ws}};function xo(i){let e=i>>>0;return()=>{e=e+1831565813>>>0;let t=e;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}const oo={x:.35,z:.45};function hu(i){const{cols:e,rows:t}=Hs,n=(Ct.x1-Ct.x0)/e,a=(Ct.z1-Ct.z0)/t,o=[];for(let s=0;s<t;s++)for(let r=0;r<e;r++){if(i()<.08)continue;const l=[Ct.x0+(r+.5)*n,Ct.z0+(s+.5)*a],c=l[0]+(i()-.5)*2*oo.x,h=l[1]+(i()-.5)*2*oo.z;o.push({x:c,z:h,dir:"h",cell:l})}return o}function yc(){const i=(sn+Vs.h)/2;return[[-i,0],[i,0]]}function uu(i,e,t){const n=kh(i,e,t);if(!_r(n,e,t))return n;let a=n,o=1/0;for(const s of fu(i)){const r=Math.hypot(s[0]-e,s[1]-t);r<o&&!_r(s,e,t)&&(a=s,o=r)}return a}const vr=.5;function _r([i,e],t,n){const{hx:a}=ei.slabs;return Math.abs(i-t)<a+vr&&e-n>-.55-vr&&e-n<Ws+.15}function fu(i){if(i.line)return xr(i.line);const{x:e,z:t}=i;if(i.hw!=null){const{hw:a,hh:o}=i;return xr([[e-a,t-o],[e+a,t-o],[e+a,t+o],[e-a,t+o],[e-a,t-o]])}const n=Math.ceil(2*Math.PI*i.r/.05);return Array.from({length:n},(a,o)=>{const s=o/n*2*Math.PI;return[e+Math.cos(s)*i.r,t+Math.sin(s)*i.r]})}function xr(i){const e=[i[0]];for(let t=1;t<i.length;t++){const[n,a]=i[t-1],[o,s]=i[t],r=Math.max(1,Math.ceil(Math.hypot(o-n,s-a)/.05));for(let l=1;l<=r;l++)e.push([n+(o-n)*l/r,a+(s-a)*l/r])}return e}function Ec(i,e,t){const n=Mr(i)%5-2,a=Mr(i+"#")%3;return pu(e.x,e.z,t.x,t.z,n*.09,a)}const du=.45;function pu(i,e,t,n,a,o){const s=t-i,r=n-e,l=Math.abs(s),c=Math.abs(r),h=Math.sign(s)||1,u=Math.sign(r)||1;let f;if(l>=c){const p=l-c,[g,v]=o===0?[p/2,p/2]:o===1?[0,p]:[p,0];f=[[i,e],[i+h*g,e],[t-h*v,n],[t,n]]}else{const p=c-l,[g,v]=o===0?[p/2,p/2]:o===1?[0,p]:[p,0];f=[[i,e],[i,e+u*g],[t,n-u*v],[t,n]]}if(a){const p=Math.hypot(s,r)||1,g=-r/p,v=s/p;f=f.map(([m,d])=>[m+g*a,d+v*a])}return f=f.filter((p,g)=>g===0||Math.hypot(p[0]-f[g-1][0],p[1]-f[g-1][1])>1e-4),mu(f,du)}function mu(i,e){if(i.length<3)return i;const t=[i[0]];for(let n=1;n<i.length-1;n++){const[a,o]=i[n-1],[s,r]=i[n],[l,c]=i[n+1],h=Math.hypot(s-a,r-o),u=Math.hypot(l-s,c-r),f=Math.min(e,h/2,u/2),p=[s+(a-s)/h*f,r+(o-r)/h*f],g=[s+(l-s)/u*f,r+(c-r)/u*f];for(let v=0;v<=6;v++){const m=v/6,d=1-m;t.push([d*d*p[0]+2*d*m*s+m*m*g[0],d*d*p[1]+2*d*m*r+m*m*g[1]])}}return t.push(i.at(-1)),t}function Mr(i){let e=2166136261;for(let t=0;t<i.length;t++)e=Math.imul(e^i.charCodeAt(t),16777619);return e>>>0}const gu=6,vu=60,Do={depth:3,cap:40,dead:.1},_u=12,_a=.12,wr=1.12,xu=.2,Mu=new Set(["fishpond","loi","kauhale","halau"]),wu=.15,bu=Math.PI/18;class Su{constructor(e){const t=xo(e);this.rng=t,this.island=Th(e,Ct),this.features=this.island.places,this.featureOf=new Map(this.features.map(o=>[o.field,o])),this.clearPaths=new Map,this.fieldEnds=new Map,this.small=this.features.filter(o=>Mu.has(o.kind)).map(o=>({pts:Eu(o),covered:new Set}));const n=yc(),a=hu(t).map(o=>this.settle(o)).filter(Boolean);this.pairs=a.map(({x:o,z:s,dir:r},l)=>({id:l,x:o,z:s,dir:r,entry:null,history:[],turnedAt:-1/0,tiles:n.map(([c,h],u)=>({id:l*2+u,pair:l,index:u,x:o+c,z:s+h,stone:""}))})),this.tiles=this.pairs.flatMap(o=>o.tiles),this.used=new Set,this.turnCount=0,this.deal()}settle(e){let t=this.fits(e)?e:null;if(!t){const n=[];for(let a=-4;a<=4;a++)for(let o=-4;o<=4;o++)n.push({...e,x:e.cell[0]+a/4*oo.x,z:e.cell[1]+o/4*oo.z});n.sort((a,o)=>Math.hypot(a.x-e.x,a.z-e.z)-Math.hypot(o.x-e.x,o.z-e.z)),t=n.find(a=>this.fits(a))??null}if(t){const n=yr(t);for(const{pts:a,covered:o}of this.small)a.forEach((s,r)=>Er(s,n)&&o.add(r))}return t}fits(e){const t=yr(e);if(dr(this.island,t.x0,t.z0,t.x1,t.z1))return!1;const n=this.island.compass,a=Math.max(t.x0-n.x,0,n.x-t.x1),o=Math.max(t.z0-n.z,0,n.z-t.z1);return Math.hypot(a,o)<n.r*wr?!1:this.small.every(({pts:s,covered:r})=>{let l=r.size;return s.forEach((c,h)=>!r.has(h)&&Er(c,t)&&l++),l<=wu*s.length})}deal(){const e=this.rng,t=l=>!l.nodeal&&!this.used.has(l.word)&&wh(l)>=_u,n=l=>l[Math.floor(e()*l.length)],a=[...this.pairs];for(let l=a.length-1;l>0;l--){const c=Math.floor(e()*(l+1));[a[l],a[c]]=[a[c],a[l]]}const o=[],s=new Set;for(const l of a){let c=null;const h=o.filter(u=>Math.hypot(u.x-l.x,u.z-l.z)<9);if(h.length&&e()<.6){const u=n(h),f=e()<.5?u.entry.a:u.entry.b,p=(ao.get(f)??[]).filter(g=>t(g)&&cr(g)>=3);p.length&&(c=n(p))}for(let u=5;!c&&u>=2;u--){const f=Ln.filter(p=>t(p)&&cr(p)>=u);f.length&&(c=n(f))}if(!c){s.add(l);continue}this.setWord(l,c),o.push(l)}const r=l=>[0,1].some(c=>Xn(l,c).some(h=>!this.used.has(h.word)));for(let l=0;l<4;l++){const c=o.filter(h=>!this.canTurn(h,1/0));if(!c.length)break;for(const h of c){const u=Ln.filter(f=>t(f)&&r(f));u.length&&this.redeal(h,n(u))}}s.size&&(this.pairs=this.pairs.filter(l=>!s.has(l)),this.pairs.forEach((l,c)=>{l.id=c,l.tiles.forEach((h,u)=>{h.id=c*2+u,h.pair=c})}),this.tiles=this.pairs.flatMap(l=>l.tiles))}redeal(e,t){this.used.delete(e.entry.word),e.entry=null,this.setWord(e,t)}setWord(e,t){e.entry&&(this.used.delete(e.entry.word),e.history.push(e.entry),e.history.length>gu&&e.history.shift()),e.entry=t,this.used.add(t.word),e.tiles[0].stone=t.a,e.tiles[1].stone=t.b}targets(e,t){var r;const n=(r=e.history.at(-1))==null?void 0:r.word,a=t-e.turnedAt>=vu,o=[];for(const l of[0,1])for(const c of Xn(e.entry,l)){if(this.used.has(c.word))continue;let h=0;if(c.word===n){if(!a)continue;h=2}else e.history.some(u=>u.word===c.word)&&(h=1);o.push({index:l,entry:c,tier:h})}const s=Math.min(...o.map(l=>l.tier));return o.filter(l=>l.tier===s)}canTurn(e,t){return this.targets(e,t).length>0}canTurnTwice(e,t){return this.targets(e,t).some(({entry:n})=>[0,1].some(a=>Xn(n,a).some(o=>!this.used.has(o.word))))}chooseTurn(e,t,n=this.linkedFraction()){const a=this.targets(e,t);if(!a.length)return null;const o=e.tiles.map(c=>this.tiles.filter(h=>h.pair!==e.id&&Math.hypot(h.x-c.x,h.z-c.z)<=hr)),s=(c,h)=>!rr(h)&&o[c].some(u=>u.stone===h&&this.lineClear(e.tiles[c],u,h)),r=a.map(({index:c,entry:h,tier:u})=>{const f=s(c,c===0?h.a:h.b),p=s(c,e.tiles[c].stone);let g=1;f&&(g+=n<.5?6:n>.55?0:1.5),p&&n>.55&&(g+=3),h.field!==e.entry.field&&(g+=.6);const v=this.reach(e,h);return g*=v===0?Do.dead:v,{index:c,entry:h,tier:u,w:g}});let l=Math.random()*r.reduce((c,h)=>c+h.w,0);for(const c of r)if((l-=c.w)<=0)return c;return r.at(-1)}reach(e,t){const n=new Set(e.history.map(s=>s.word)).add(e.entry.word).add(t.word);let a=[t],o=0;for(let s=0;s<Do.depth&&a.length;s++){const r=[];for(const l of a)for(const c of[0,1])for(const h of Xn(l,c))if(!(n.has(h.word)||this.used.has(h.word))&&(n.add(h.word),r.push(h),++o>=Do.cap))return o;a=r}return o}turn(e,t,n){this.setWord(e,t.entry),e.turnedAt=n,this.turnCount++}linkedPairs(){const e=new Set;for(const t of this.desiredLinks().values())t.kind==="pair"&&e.add(t.a.pair).add(t.b.pair);return e}linkedFraction(){return this.linkedPairs().size/Math.max(1,this.pairs.length)}desiredLinks(){const e=new Map;for(const a of this.tiles){if(rr(a.stone))continue;let o=e.get(a.stone);o||e.set(a.stone,o=[]),o.push(a)}const t=new Map,n=new Set;for(const[a,o]of e){if(o.length<2)continue;const s=[];for(let c=0;c<o.length;c++)for(let h=c+1;h<o.length;h++){if(o[c].pair===o[h].pair)continue;const u=Math.hypot(o[c].x-o[h].x,o[c].z-o[h].z);u<=hr&&this.lineClear(o[c],o[h],a)&&s.push([u,c,h])}s.sort((c,h)=>c[0]-h[0]);const r=o.map((c,h)=>h),l=c=>r[c]===c?c:r[c]=l(r[c]);for(const[,c,h]of s){const u=l(c),f=l(h);if(u===f)continue;r[u]=f;const[p,g]=br(o[c],o[h]),v=Sr(p,g,a);t.set(v,{key:v,kind:"pair",stone:a,a:p,b:g}),n.add(p.pair).add(g.pair)}}for(const a of this.pairs){if(n.has(a.id))continue;const o=a.entry.field,s=`f:${a.id}:${o}`,r=this.featureOf.get(o);t.set(s,{key:s,kind:"field",pair:a,feature:r,...this.fieldEnd(s,a,r)})}return t}lineClear(e,t,n){const[a,o]=br(e,t),s=Sr(a,o,n);let r=this.clearPaths.get(s);if(r===void 0){const l=Ec(s,a,o);r=l.every((c,h)=>h===0||this.reaches(l[h-1],c)===null),this.clearPaths.set(s,r)}return r}fieldEnd(e,t,n){let a=this.fieldEnds.get(e);if(a)return a;const o=[t.x,t.z],s=uu(n,t.x,t.z),r=n.kind==="compass";a={end:s,room:this.reaches(o,s,r)??1/0};const l=Math.hypot(s[0]-t.x,s[1]-t.z),c=Math.atan2(s[1]-t.z,s[0]-t.x),h=(u,f)=>u>=l||u-.3-yu(f)>=.3;for(let u=1;u<=12&&!h(a.room,c);u++){const f=c+(u%2?1:-1)*Math.ceil(u/2)*bu,p=[t.x+Math.cos(f)*l,t.z+Math.sin(f)*l],g=Math.min(this.reaches(o,p,r)??1/0,l-.01);if(h(g,f)){a={end:p,room:g};break}}return this.fieldEnds.set(e,a),a}reaches(e,t,n=!1){const a=this.reachesUpland(e,t),o=n?null:this.reachesCompass(e,t);return a===null?o:o===null?a:Math.min(a,o)}reachesUpland([e,t],[n,a]){const o=Math.hypot(n-e,a-t),s=Math.ceil(o/.1);for(let r=0;r<=s;r++){const l=e+(n-e)*r/s,c=t+(a-t)*r/s;if(dr(this.island,l-_a,c-_a,l+_a,c+_a))return o*r/s}return null}reachesCompass([e,t],[n,a]){const o=this.island.compass,s=o.r*wr+xu,r=n-e,l=a-t,c=e-o.x,h=t-o.z,u=r*r+l*l,f=c*r+h*l,p=c*c+h*h-s*s;if(p<=0)return 0;const g=f*f-u*p;if(g<0||u===0)return null;const v=(-f-Math.sqrt(g))/u;return v>=0&&v<=1?v*Math.sqrt(u):null}}function yu(i){const{hx:e,hz:t}=ei.slabs;return Math.min(e/Math.abs(Math.cos(i)||1e-9),t/Math.abs(Math.sin(i)||1e-9))}function br(i,e){return i.id<e.id?[i,e]:[e,i]}function Sr(i,e,t){return`p:${i.id}-${e.id}:${t}`}function yr(i){const e=ei.marks;return{x0:i.x+e.x0,z0:i.z+e.z0,x1:i.x+e.x1,z1:i.z+e.z1}}function Er([i,e],t){return i>t.x0&&i<t.x1&&e>t.z0&&e<t.z1}function Eu(i){const t=i.hw??i.r,n=i.hh??i.r,a=[];for(let o=0;o<24;o++)for(let s=0;s<24;s++){const r=i.x+t*((2*o+1)/24-1),l=i.z+n*((2*s+1)/24-1);i.hw==null&&Math.hypot(r-i.x,l-i.z)>i.r||a.push([r,l])}return a}/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const qs="160",Tu=0,Tr=1,ku=2,Tc=1,Au=2,tn=3,Dn=0,Ut=1,mn=2,Pn=0,Ti=1,kr=2,Ar=3,Pr=4,Pu=5,Wn=100,Ru=101,Cu=102,Rr=103,Cr=104,Lu=200,Nu=201,Du=202,Uu=203,ws=204,bs=205,Iu=206,Fu=207,zu=208,Ou=209,Bu=210,Gu=211,Hu=212,Vu=213,Wu=214,qu=0,Xu=1,Yu=2,so=3,ju=4,$u=5,Ku=6,Zu=7,kc=0,Ju=1,Qu=2,Rn=0,ef=1,tf=2,nf=3,af=4,of=5,sf=6,Ac=300,Ri=301,Ci=302,Ss=303,ys=304,Mo=306,Es=1e3,Kt=1001,Ts=1002,Mt=1003,Lr=1004,Uo=1005,Ot=1006,rf=1007,Li=1008,Cn=1009,lf=1010,cf=1011,Xs=1012,Pc=1013,kn=1014,An=1015,sa=1016,Rc=1017,Cc=1018,jn=1020,hf=1021,Zt=1023,uf=1024,ff=1025,$n=1026,Ni=1027,df=1028,Lc=1029,Nc=1030,Dc=1031,Uc=1033,Io=33776,Fo=33777,zo=33778,Oo=33779,Nr=35840,Dr=35841,Ur=35842,Ir=35843,Ic=36196,Fr=37492,zr=37496,Or=37808,Br=37809,Gr=37810,Hr=37811,Vr=37812,Wr=37813,qr=37814,Xr=37815,Yr=37816,jr=37817,$r=37818,Kr=37819,Zr=37820,Jr=37821,Bo=36492,Qr=36494,el=36495,pf=36283,tl=36284,nl=36285,il=36286,Fc=3e3,Kn=3001,mf=3200,gf=3201,zc=0,vf=1,Ht="",vt="srgb",xn="srgb-linear",Ys="display-p3",wo="display-p3-linear",ro="linear",Qe="srgb",lo="rec709",co="p3",ii=7680,al=519,_f=512,xf=513,Mf=514,Oc=515,wf=516,bf=517,Sf=518,yf=519,ol=35044,sl="300 es",ks=1035,vn=2e3,ho=2001;class Fi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const a=this._listeners[e];if(a!==void 0){const o=a.indexOf(t);o!==-1&&a.splice(o,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const a=n.slice(0);for(let o=0,s=a.length;o<s;o++)a[o].call(this,e);e.target=null}}}const St=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let rl=1234567;const Qi=Math.PI/180,ra=180/Math.PI;function zi(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(St[i&255]+St[i>>8&255]+St[i>>16&255]+St[i>>24&255]+"-"+St[e&255]+St[e>>8&255]+"-"+St[e>>16&15|64]+St[e>>24&255]+"-"+St[t&63|128]+St[t>>8&255]+"-"+St[t>>16&255]+St[t>>24&255]+St[n&255]+St[n>>8&255]+St[n>>16&255]+St[n>>24&255]).toLowerCase()}function Lt(i,e,t){return Math.max(e,Math.min(t,i))}function js(i,e){return(i%e+e)%e}function Ef(i,e,t,n,a){return n+(i-e)*(a-n)/(t-e)}function Tf(i,e,t){return i!==e?(t-i)/(e-i):0}function ea(i,e,t){return(1-t)*i+t*e}function kf(i,e,t,n){return ea(i,e,1-Math.exp(-t*n))}function Af(i,e=1){return e-Math.abs(js(i,e*2)-e)}function Pf(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Rf(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Cf(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Lf(i,e){return i+Math.random()*(e-i)}function Nf(i){return i*(.5-Math.random())}function Df(i){i!==void 0&&(rl=i);let e=rl+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Uf(i){return i*Qi}function If(i){return i*ra}function As(i){return(i&i-1)===0&&i!==0}function Ff(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function uo(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function zf(i,e,t,n,a){const o=Math.cos,s=Math.sin,r=o(t/2),l=s(t/2),c=o((e+n)/2),h=s((e+n)/2),u=o((e-n)/2),f=s((e-n)/2),p=o((n-e)/2),g=s((n-e)/2);switch(a){case"XYX":i.set(r*h,l*u,l*f,r*c);break;case"YZY":i.set(l*f,r*h,l*u,r*c);break;case"ZXZ":i.set(l*u,l*f,r*h,r*c);break;case"XZX":i.set(r*h,l*g,l*p,r*c);break;case"YXY":i.set(l*p,r*h,l*g,r*c);break;case"ZYZ":i.set(l*g,l*p,r*h,r*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+a)}}function Mi(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Pt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const xa={DEG2RAD:Qi,RAD2DEG:ra,generateUUID:zi,clamp:Lt,euclideanModulo:js,mapLinear:Ef,inverseLerp:Tf,lerp:ea,damp:kf,pingpong:Af,smoothstep:Pf,smootherstep:Rf,randInt:Cf,randFloat:Lf,randFloatSpread:Nf,seededRandom:Df,degToRad:Uf,radToDeg:If,isPowerOfTwo:As,ceilPowerOfTwo:Ff,floorPowerOfTwo:uo,setQuaternionFromProperEuler:zf,normalize:Pt,denormalize:Mi};class Ge{constructor(e=0,t=0){Ge.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,a=e.elements;return this.x=a[0]*t+a[3]*n+a[6],this.y=a[1]*t+a[4]*n+a[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Lt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),a=Math.sin(t),o=this.x-e.x,s=this.y-e.y;return this.x=o*n-s*a+e.x,this.y=o*a+s*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ze{constructor(e,t,n,a,o,s,r,l,c){ze.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,a,o,s,r,l,c)}set(e,t,n,a,o,s,r,l,c){const h=this.elements;return h[0]=e,h[1]=a,h[2]=r,h[3]=t,h[4]=o,h[5]=l,h[6]=n,h[7]=s,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,a=t.elements,o=this.elements,s=n[0],r=n[3],l=n[6],c=n[1],h=n[4],u=n[7],f=n[2],p=n[5],g=n[8],v=a[0],m=a[3],d=a[6],M=a[1],_=a[4],w=a[7],P=a[2],k=a[5],T=a[8];return o[0]=s*v+r*M+l*P,o[3]=s*m+r*_+l*k,o[6]=s*d+r*w+l*T,o[1]=c*v+h*M+u*P,o[4]=c*m+h*_+u*k,o[7]=c*d+h*w+u*T,o[2]=f*v+p*M+g*P,o[5]=f*m+p*_+g*k,o[8]=f*d+p*w+g*T,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],a=e[2],o=e[3],s=e[4],r=e[5],l=e[6],c=e[7],h=e[8];return t*s*h-t*r*c-n*o*h+n*r*l+a*o*c-a*s*l}invert(){const e=this.elements,t=e[0],n=e[1],a=e[2],o=e[3],s=e[4],r=e[5],l=e[6],c=e[7],h=e[8],u=h*s-r*c,f=r*l-h*o,p=c*o-s*l,g=t*u+n*f+a*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return e[0]=u*v,e[1]=(a*c-h*n)*v,e[2]=(r*n-a*s)*v,e[3]=f*v,e[4]=(h*t-a*l)*v,e[5]=(a*o-r*t)*v,e[6]=p*v,e[7]=(n*l-c*t)*v,e[8]=(s*t-n*o)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,a,o,s,r){const l=Math.cos(o),c=Math.sin(o);return this.set(n*l,n*c,-n*(l*s+c*r)+s+e,-a*c,a*l,-a*(-c*s+l*r)+r+t,0,0,1),this}scale(e,t){return this.premultiply(Go.makeScale(e,t)),this}rotate(e){return this.premultiply(Go.makeRotation(-e)),this}translate(e,t){return this.premultiply(Go.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let a=0;a<9;a++)if(t[a]!==n[a])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Go=new ze;function Bc(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function fo(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Of(){const i=fo("canvas");return i.style.display="block",i}const ll={};function ta(i){i in ll||(ll[i]=!0,console.warn(i))}const cl=new ze().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),hl=new ze().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Ma={[xn]:{transfer:ro,primaries:lo,toReference:i=>i,fromReference:i=>i},[vt]:{transfer:Qe,primaries:lo,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[wo]:{transfer:ro,primaries:co,toReference:i=>i.applyMatrix3(hl),fromReference:i=>i.applyMatrix3(cl)},[Ys]:{transfer:Qe,primaries:co,toReference:i=>i.convertSRGBToLinear().applyMatrix3(hl),fromReference:i=>i.applyMatrix3(cl).convertLinearToSRGB()}},Bf=new Set([xn,wo]),qe={enabled:!0,_workingColorSpace:xn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!Bf.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,e,t){if(this.enabled===!1||e===t||!e||!t)return i;const n=Ma[e].toReference,a=Ma[t].fromReference;return a(n(i))},fromWorkingColorSpace:function(i,e){return this.convert(i,this._workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this._workingColorSpace)},getPrimaries:function(i){return Ma[i].primaries},getTransfer:function(i){return i===Ht?ro:Ma[i].transfer}};function ki(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ho(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let ai;class Gc{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{ai===void 0&&(ai=fo("canvas")),ai.width=e.width,ai.height=e.height;const n=ai.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=ai}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=fo("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const a=n.getImageData(0,0,e.width,e.height),o=a.data;for(let s=0;s<o.length;s++)o[s]=ki(o[s]/255)*255;return n.putImageData(a,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(ki(t[n]/255)*255):t[n]=ki(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Gf=0;class Hc{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Gf++}),this.uuid=zi(),this.data=e,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},a=this.data;if(a!==null){let o;if(Array.isArray(a)){o=[];for(let s=0,r=a.length;s<r;s++)a[s].isDataTexture?o.push(Vo(a[s].image)):o.push(Vo(a[s]))}else o=Vo(a);n.url=o}return t||(e.images[this.uuid]=n),n}}function Vo(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Gc.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Hf=0;class Nt extends Fi{constructor(e=Nt.DEFAULT_IMAGE,t=Nt.DEFAULT_MAPPING,n=Kt,a=Kt,o=Ot,s=Li,r=Zt,l=Cn,c=Nt.DEFAULT_ANISOTROPY,h=Ht){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Hf++}),this.uuid=zi(),this.name="",this.source=new Hc(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=a,this.magFilter=o,this.minFilter=s,this.anisotropy=c,this.format=r,this.internalFormat=null,this.type=l,this.offset=new Ge(0,0),this.repeat=new Ge(1,1),this.center=new Ge(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ze,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(ta("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===Kn?vt:Ht),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Ac)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Es:e.x=e.x-Math.floor(e.x);break;case Kt:e.x=e.x<0?0:1;break;case Ts:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Es:e.y=e.y-Math.floor(e.y);break;case Kt:e.y=e.y<0?0:1;break;case Ts:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return ta("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===vt?Kn:Fc}set encoding(e){ta("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=e===Kn?vt:Ht}}Nt.DEFAULT_IMAGE=null;Nt.DEFAULT_MAPPING=Ac;Nt.DEFAULT_ANISOTROPY=1;class lt{constructor(e=0,t=0,n=0,a=1){lt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=a}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,a){return this.x=e,this.y=t,this.z=n,this.w=a,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,a=this.z,o=this.w,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*a+s[12]*o,this.y=s[1]*t+s[5]*n+s[9]*a+s[13]*o,this.z=s[2]*t+s[6]*n+s[10]*a+s[14]*o,this.w=s[3]*t+s[7]*n+s[11]*a+s[15]*o,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,a,o;const l=e.elements,c=l[0],h=l[4],u=l[8],f=l[1],p=l[5],g=l[9],v=l[2],m=l[6],d=l[10];if(Math.abs(h-f)<.01&&Math.abs(u-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+v)<.1&&Math.abs(g+m)<.1&&Math.abs(c+p+d-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const _=(c+1)/2,w=(p+1)/2,P=(d+1)/2,k=(h+f)/4,T=(u+v)/4,S=(g+m)/4;return _>w&&_>P?_<.01?(n=0,a=.707106781,o=.707106781):(n=Math.sqrt(_),a=k/n,o=T/n):w>P?w<.01?(n=.707106781,a=0,o=.707106781):(a=Math.sqrt(w),n=k/a,o=S/a):P<.01?(n=.707106781,a=.707106781,o=0):(o=Math.sqrt(P),n=T/o,a=S/o),this.set(n,a,o,t),this}let M=Math.sqrt((m-g)*(m-g)+(u-v)*(u-v)+(f-h)*(f-h));return Math.abs(M)<.001&&(M=1),this.x=(m-g)/M,this.y=(u-v)/M,this.z=(f-h)/M,this.w=Math.acos((c+p+d-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Vf extends Fi{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new lt(0,0,e,t),this.scissorTest=!1,this.viewport=new lt(0,0,e,t);const a={width:e,height:t,depth:1};n.encoding!==void 0&&(ta("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===Kn?vt:Ht),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ot,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new Nt(a,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(e,t,n=1){(this.width!==e||this.height!==t||this.depth!==n)&&(this.width=e,this.height=t,this.depth=n,this.texture.image.width=e,this.texture.image.height=t,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.texture.isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new Hc(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Jn extends Vf{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Vc extends Nt{constructor(e=null,t=1,n=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:a},this.magFilter=Mt,this.minFilter=Mt,this.wrapR=Kt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Wf extends Nt{constructor(e=null,t=1,n=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:a},this.magFilter=Mt,this.minFilter=Mt,this.wrapR=Kt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ua{constructor(e=0,t=0,n=0,a=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=a}static slerpFlat(e,t,n,a,o,s,r){let l=n[a+0],c=n[a+1],h=n[a+2],u=n[a+3];const f=o[s+0],p=o[s+1],g=o[s+2],v=o[s+3];if(r===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u;return}if(r===1){e[t+0]=f,e[t+1]=p,e[t+2]=g,e[t+3]=v;return}if(u!==v||l!==f||c!==p||h!==g){let m=1-r;const d=l*f+c*p+h*g+u*v,M=d>=0?1:-1,_=1-d*d;if(_>Number.EPSILON){const P=Math.sqrt(_),k=Math.atan2(P,d*M);m=Math.sin(m*k)/P,r=Math.sin(r*k)/P}const w=r*M;if(l=l*m+f*w,c=c*m+p*w,h=h*m+g*w,u=u*m+v*w,m===1-r){const P=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=P,c*=P,h*=P,u*=P}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,a,o,s){const r=n[a],l=n[a+1],c=n[a+2],h=n[a+3],u=o[s],f=o[s+1],p=o[s+2],g=o[s+3];return e[t]=r*g+h*u+l*p-c*f,e[t+1]=l*g+h*f+c*u-r*p,e[t+2]=c*g+h*p+r*f-l*u,e[t+3]=h*g-r*u-l*f-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,a){return this._x=e,this._y=t,this._z=n,this._w=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,a=e._y,o=e._z,s=e._order,r=Math.cos,l=Math.sin,c=r(n/2),h=r(a/2),u=r(o/2),f=l(n/2),p=l(a/2),g=l(o/2);switch(s){case"XYZ":this._x=f*h*u+c*p*g,this._y=c*p*u-f*h*g,this._z=c*h*g+f*p*u,this._w=c*h*u-f*p*g;break;case"YXZ":this._x=f*h*u+c*p*g,this._y=c*p*u-f*h*g,this._z=c*h*g-f*p*u,this._w=c*h*u+f*p*g;break;case"ZXY":this._x=f*h*u-c*p*g,this._y=c*p*u+f*h*g,this._z=c*h*g+f*p*u,this._w=c*h*u-f*p*g;break;case"ZYX":this._x=f*h*u-c*p*g,this._y=c*p*u+f*h*g,this._z=c*h*g-f*p*u,this._w=c*h*u+f*p*g;break;case"YZX":this._x=f*h*u+c*p*g,this._y=c*p*u+f*h*g,this._z=c*h*g-f*p*u,this._w=c*h*u-f*p*g;break;case"XZY":this._x=f*h*u-c*p*g,this._y=c*p*u-f*h*g,this._z=c*h*g+f*p*u,this._w=c*h*u+f*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+s)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,a=Math.sin(n);return this._x=e.x*a,this._y=e.y*a,this._z=e.z*a,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],a=t[4],o=t[8],s=t[1],r=t[5],l=t[9],c=t[2],h=t[6],u=t[10],f=n+r+u;if(f>0){const p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(h-l)*p,this._y=(o-c)*p,this._z=(s-a)*p}else if(n>r&&n>u){const p=2*Math.sqrt(1+n-r-u);this._w=(h-l)/p,this._x=.25*p,this._y=(a+s)/p,this._z=(o+c)/p}else if(r>u){const p=2*Math.sqrt(1+r-n-u);this._w=(o-c)/p,this._x=(a+s)/p,this._y=.25*p,this._z=(l+h)/p}else{const p=2*Math.sqrt(1+u-n-r);this._w=(s-a)/p,this._x=(o+c)/p,this._y=(l+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Lt(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const a=Math.min(1,t/n);return this.slerp(e,a),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,a=e._y,o=e._z,s=e._w,r=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+s*r+a*c-o*l,this._y=a*h+s*l+o*r-n*c,this._z=o*h+s*c+n*l-a*r,this._w=s*h-n*r-a*l-o*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,a=this._y,o=this._z,s=this._w;let r=s*e._w+n*e._x+a*e._y+o*e._z;if(r<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,r=-r):this.copy(e),r>=1)return this._w=s,this._x=n,this._y=a,this._z=o,this;const l=1-r*r;if(l<=Number.EPSILON){const p=1-t;return this._w=p*s+t*this._w,this._x=p*n+t*this._x,this._y=p*a+t*this._y,this._z=p*o+t*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,r),u=Math.sin((1-t)*h)/c,f=Math.sin(t*h)/c;return this._w=s*u+this._w*f,this._x=n*u+this._x*f,this._y=a*u+this._y*f,this._z=o*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=Math.random(),t=Math.sqrt(1-e),n=Math.sqrt(e),a=2*Math.PI*Math.random(),o=2*Math.PI*Math.random();return this.set(t*Math.cos(a),n*Math.sin(o),n*Math.cos(o),t*Math.sin(a))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class X{constructor(e=0,t=0,n=0){X.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(ul.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(ul.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,a=this.z,o=e.elements;return this.x=o[0]*t+o[3]*n+o[6]*a,this.y=o[1]*t+o[4]*n+o[7]*a,this.z=o[2]*t+o[5]*n+o[8]*a,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,a=this.z,o=e.elements,s=1/(o[3]*t+o[7]*n+o[11]*a+o[15]);return this.x=(o[0]*t+o[4]*n+o[8]*a+o[12])*s,this.y=(o[1]*t+o[5]*n+o[9]*a+o[13])*s,this.z=(o[2]*t+o[6]*n+o[10]*a+o[14])*s,this}applyQuaternion(e){const t=this.x,n=this.y,a=this.z,o=e.x,s=e.y,r=e.z,l=e.w,c=2*(s*a-r*n),h=2*(r*t-o*a),u=2*(o*n-s*t);return this.x=t+l*c+s*u-r*h,this.y=n+l*h+r*c-o*u,this.z=a+l*u+o*h-s*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,a=this.z,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*a,this.y=o[1]*t+o[5]*n+o[9]*a,this.z=o[2]*t+o[6]*n+o[10]*a,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,a=e.y,o=e.z,s=t.x,r=t.y,l=t.z;return this.x=a*l-o*r,this.y=o*s-n*l,this.z=n*r-a*s,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Wo.copy(this).projectOnVector(e),this.sub(Wo)}reflect(e){return this.sub(Wo.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Lt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,a=this.z-e.z;return t*t+n*n+a*a}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const a=Math.sin(t)*e;return this.x=a*Math.sin(n),this.y=Math.cos(t)*e,this.z=a*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),a=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=a,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=(Math.random()-.5)*2,t=Math.random()*Math.PI*2,n=Math.sqrt(1-e**2);return this.x=n*Math.cos(t),this.y=n*Math.sin(t),this.z=e,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Wo=new X,ul=new ua;class fa{constructor(e=new X(1/0,1/0,1/0),t=new X(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Wt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Wt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Wt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const o=n.getAttribute("position");if(t===!0&&o!==void 0&&e.isInstancedMesh!==!0)for(let s=0,r=o.count;s<r;s++)e.isMesh===!0?e.getVertexPosition(s,Wt):Wt.fromBufferAttribute(o,s),Wt.applyMatrix4(e.matrixWorld),this.expandByPoint(Wt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),wa.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),wa.copy(n.boundingBox)),wa.applyMatrix4(e.matrixWorld),this.union(wa)}const a=e.children;for(let o=0,s=a.length;o<s;o++)this.expandByObject(a[o],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,Wt),Wt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Vi),ba.subVectors(this.max,Vi),oi.subVectors(e.a,Vi),si.subVectors(e.b,Vi),ri.subVectors(e.c,Vi),Mn.subVectors(si,oi),wn.subVectors(ri,si),Fn.subVectors(oi,ri);let t=[0,-Mn.z,Mn.y,0,-wn.z,wn.y,0,-Fn.z,Fn.y,Mn.z,0,-Mn.x,wn.z,0,-wn.x,Fn.z,0,-Fn.x,-Mn.y,Mn.x,0,-wn.y,wn.x,0,-Fn.y,Fn.x,0];return!qo(t,oi,si,ri,ba)||(t=[1,0,0,0,1,0,0,0,1],!qo(t,oi,si,ri,ba))?!1:(Sa.crossVectors(Mn,wn),t=[Sa.x,Sa.y,Sa.z],qo(t,oi,si,ri,ba))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Wt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Wt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ln[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ln[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ln[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ln[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ln[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ln[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ln[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ln[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ln),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const ln=[new X,new X,new X,new X,new X,new X,new X,new X],Wt=new X,wa=new fa,oi=new X,si=new X,ri=new X,Mn=new X,wn=new X,Fn=new X,Vi=new X,ba=new X,Sa=new X,zn=new X;function qo(i,e,t,n,a){for(let o=0,s=i.length-3;o<=s;o+=3){zn.fromArray(i,o);const r=a.x*Math.abs(zn.x)+a.y*Math.abs(zn.y)+a.z*Math.abs(zn.z),l=e.dot(zn),c=t.dot(zn),h=n.dot(zn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>r)return!1}return!0}const qf=new fa,Wi=new X,Xo=new X;class $s{constructor(e=new X,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):qf.setFromPoints(e).getCenter(n);let a=0;for(let o=0,s=e.length;o<s;o++)a=Math.max(a,n.distanceToSquared(e[o]));return this.radius=Math.sqrt(a),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Wi.subVectors(e,this.center);const t=Wi.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),a=(n-this.radius)*.5;this.center.addScaledVector(Wi,a/n),this.radius+=a}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Xo.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Wi.copy(e.center).add(Xo)),this.expandByPoint(Wi.copy(e.center).sub(Xo))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const cn=new X,Yo=new X,ya=new X,bn=new X,jo=new X,Ea=new X,$o=new X;class Wc{constructor(e=new X,t=new X(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,cn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=cn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(cn.copy(this.origin).addScaledVector(this.direction,t),cn.distanceToSquared(e))}distanceSqToSegment(e,t,n,a){Yo.copy(e).add(t).multiplyScalar(.5),ya.copy(t).sub(e).normalize(),bn.copy(this.origin).sub(Yo);const o=e.distanceTo(t)*.5,s=-this.direction.dot(ya),r=bn.dot(this.direction),l=-bn.dot(ya),c=bn.lengthSq(),h=Math.abs(1-s*s);let u,f,p,g;if(h>0)if(u=s*l-r,f=s*r-l,g=o*h,u>=0)if(f>=-g)if(f<=g){const v=1/h;u*=v,f*=v,p=u*(u+s*f+2*r)+f*(s*u+f+2*l)+c}else f=o,u=Math.max(0,-(s*f+r)),p=-u*u+f*(f+2*l)+c;else f=-o,u=Math.max(0,-(s*f+r)),p=-u*u+f*(f+2*l)+c;else f<=-g?(u=Math.max(0,-(-s*o+r)),f=u>0?-o:Math.min(Math.max(-o,-l),o),p=-u*u+f*(f+2*l)+c):f<=g?(u=0,f=Math.min(Math.max(-o,-l),o),p=f*(f+2*l)+c):(u=Math.max(0,-(s*o+r)),f=u>0?o:Math.min(Math.max(-o,-l),o),p=-u*u+f*(f+2*l)+c);else f=s>0?-o:o,u=Math.max(0,-(s*f+r)),p=-u*u+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),a&&a.copy(Yo).addScaledVector(ya,f),p}intersectSphere(e,t){cn.subVectors(e.center,this.origin);const n=cn.dot(this.direction),a=cn.dot(cn)-n*n,o=e.radius*e.radius;if(a>o)return null;const s=Math.sqrt(o-a),r=n-s,l=n+s;return l<0?null:r<0?this.at(l,t):this.at(r,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,a,o,s,r,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return c>=0?(n=(e.min.x-f.x)*c,a=(e.max.x-f.x)*c):(n=(e.max.x-f.x)*c,a=(e.min.x-f.x)*c),h>=0?(o=(e.min.y-f.y)*h,s=(e.max.y-f.y)*h):(o=(e.max.y-f.y)*h,s=(e.min.y-f.y)*h),n>s||o>a||((o>n||isNaN(n))&&(n=o),(s<a||isNaN(a))&&(a=s),u>=0?(r=(e.min.z-f.z)*u,l=(e.max.z-f.z)*u):(r=(e.max.z-f.z)*u,l=(e.min.z-f.z)*u),n>l||r>a)||((r>n||n!==n)&&(n=r),(l<a||a!==a)&&(a=l),a<0)?null:this.at(n>=0?n:a,t)}intersectsBox(e){return this.intersectBox(e,cn)!==null}intersectTriangle(e,t,n,a,o){jo.subVectors(t,e),Ea.subVectors(n,e),$o.crossVectors(jo,Ea);let s=this.direction.dot($o),r;if(s>0){if(a)return null;r=1}else if(s<0)r=-1,s=-s;else return null;bn.subVectors(this.origin,e);const l=r*this.direction.dot(Ea.crossVectors(bn,Ea));if(l<0)return null;const c=r*this.direction.dot(jo.cross(bn));if(c<0||l+c>s)return null;const h=-r*bn.dot($o);return h<0?null:this.at(h/s,o)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ht{constructor(e,t,n,a,o,s,r,l,c,h,u,f,p,g,v,m){ht.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,a,o,s,r,l,c,h,u,f,p,g,v,m)}set(e,t,n,a,o,s,r,l,c,h,u,f,p,g,v,m){const d=this.elements;return d[0]=e,d[4]=t,d[8]=n,d[12]=a,d[1]=o,d[5]=s,d[9]=r,d[13]=l,d[2]=c,d[6]=h,d[10]=u,d[14]=f,d[3]=p,d[7]=g,d[11]=v,d[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ht().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,a=1/li.setFromMatrixColumn(e,0).length(),o=1/li.setFromMatrixColumn(e,1).length(),s=1/li.setFromMatrixColumn(e,2).length();return t[0]=n[0]*a,t[1]=n[1]*a,t[2]=n[2]*a,t[3]=0,t[4]=n[4]*o,t[5]=n[5]*o,t[6]=n[6]*o,t[7]=0,t[8]=n[8]*s,t[9]=n[9]*s,t[10]=n[10]*s,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,a=e.y,o=e.z,s=Math.cos(n),r=Math.sin(n),l=Math.cos(a),c=Math.sin(a),h=Math.cos(o),u=Math.sin(o);if(e.order==="XYZ"){const f=s*h,p=s*u,g=r*h,v=r*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=p+g*c,t[5]=f-v*c,t[9]=-r*l,t[2]=v-f*c,t[6]=g+p*c,t[10]=s*l}else if(e.order==="YXZ"){const f=l*h,p=l*u,g=c*h,v=c*u;t[0]=f+v*r,t[4]=g*r-p,t[8]=s*c,t[1]=s*u,t[5]=s*h,t[9]=-r,t[2]=p*r-g,t[6]=v+f*r,t[10]=s*l}else if(e.order==="ZXY"){const f=l*h,p=l*u,g=c*h,v=c*u;t[0]=f-v*r,t[4]=-s*u,t[8]=g+p*r,t[1]=p+g*r,t[5]=s*h,t[9]=v-f*r,t[2]=-s*c,t[6]=r,t[10]=s*l}else if(e.order==="ZYX"){const f=s*h,p=s*u,g=r*h,v=r*u;t[0]=l*h,t[4]=g*c-p,t[8]=f*c+v,t[1]=l*u,t[5]=v*c+f,t[9]=p*c-g,t[2]=-c,t[6]=r*l,t[10]=s*l}else if(e.order==="YZX"){const f=s*l,p=s*c,g=r*l,v=r*c;t[0]=l*h,t[4]=v-f*u,t[8]=g*u+p,t[1]=u,t[5]=s*h,t[9]=-r*h,t[2]=-c*h,t[6]=p*u+g,t[10]=f-v*u}else if(e.order==="XZY"){const f=s*l,p=s*c,g=r*l,v=r*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=f*u+v,t[5]=s*h,t[9]=p*u-g,t[2]=g*u-p,t[6]=r*h,t[10]=v*u+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Xf,e,Yf)}lookAt(e,t,n){const a=this.elements;return Ft.subVectors(e,t),Ft.lengthSq()===0&&(Ft.z=1),Ft.normalize(),Sn.crossVectors(n,Ft),Sn.lengthSq()===0&&(Math.abs(n.z)===1?Ft.x+=1e-4:Ft.z+=1e-4,Ft.normalize(),Sn.crossVectors(n,Ft)),Sn.normalize(),Ta.crossVectors(Ft,Sn),a[0]=Sn.x,a[4]=Ta.x,a[8]=Ft.x,a[1]=Sn.y,a[5]=Ta.y,a[9]=Ft.y,a[2]=Sn.z,a[6]=Ta.z,a[10]=Ft.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,a=t.elements,o=this.elements,s=n[0],r=n[4],l=n[8],c=n[12],h=n[1],u=n[5],f=n[9],p=n[13],g=n[2],v=n[6],m=n[10],d=n[14],M=n[3],_=n[7],w=n[11],P=n[15],k=a[0],T=a[4],S=a[8],x=a[12],b=a[1],N=a[5],L=a[9],V=a[13],E=a[2],C=a[6],D=a[10],j=a[14],F=a[3],z=a[7],G=a[11],B=a[15];return o[0]=s*k+r*b+l*E+c*F,o[4]=s*T+r*N+l*C+c*z,o[8]=s*S+r*L+l*D+c*G,o[12]=s*x+r*V+l*j+c*B,o[1]=h*k+u*b+f*E+p*F,o[5]=h*T+u*N+f*C+p*z,o[9]=h*S+u*L+f*D+p*G,o[13]=h*x+u*V+f*j+p*B,o[2]=g*k+v*b+m*E+d*F,o[6]=g*T+v*N+m*C+d*z,o[10]=g*S+v*L+m*D+d*G,o[14]=g*x+v*V+m*j+d*B,o[3]=M*k+_*b+w*E+P*F,o[7]=M*T+_*N+w*C+P*z,o[11]=M*S+_*L+w*D+P*G,o[15]=M*x+_*V+w*j+P*B,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],a=e[8],o=e[12],s=e[1],r=e[5],l=e[9],c=e[13],h=e[2],u=e[6],f=e[10],p=e[14],g=e[3],v=e[7],m=e[11],d=e[15];return g*(+o*l*u-a*c*u-o*r*f+n*c*f+a*r*p-n*l*p)+v*(+t*l*p-t*c*f+o*s*f-a*s*p+a*c*h-o*l*h)+m*(+t*c*u-t*r*p-o*s*u+n*s*p+o*r*h-n*c*h)+d*(-a*r*h-t*l*u+t*r*f+a*s*u-n*s*f+n*l*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const a=this.elements;return e.isVector3?(a[12]=e.x,a[13]=e.y,a[14]=e.z):(a[12]=e,a[13]=t,a[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],a=e[2],o=e[3],s=e[4],r=e[5],l=e[6],c=e[7],h=e[8],u=e[9],f=e[10],p=e[11],g=e[12],v=e[13],m=e[14],d=e[15],M=u*m*c-v*f*c+v*l*p-r*m*p-u*l*d+r*f*d,_=g*f*c-h*m*c-g*l*p+s*m*p+h*l*d-s*f*d,w=h*v*c-g*u*c+g*r*p-s*v*p-h*r*d+s*u*d,P=g*u*l-h*v*l-g*r*f+s*v*f+h*r*m-s*u*m,k=t*M+n*_+a*w+o*P;if(k===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const T=1/k;return e[0]=M*T,e[1]=(v*f*o-u*m*o-v*a*p+n*m*p+u*a*d-n*f*d)*T,e[2]=(r*m*o-v*l*o+v*a*c-n*m*c-r*a*d+n*l*d)*T,e[3]=(u*l*o-r*f*o-u*a*c+n*f*c+r*a*p-n*l*p)*T,e[4]=_*T,e[5]=(h*m*o-g*f*o+g*a*p-t*m*p-h*a*d+t*f*d)*T,e[6]=(g*l*o-s*m*o-g*a*c+t*m*c+s*a*d-t*l*d)*T,e[7]=(s*f*o-h*l*o+h*a*c-t*f*c-s*a*p+t*l*p)*T,e[8]=w*T,e[9]=(g*u*o-h*v*o-g*n*p+t*v*p+h*n*d-t*u*d)*T,e[10]=(s*v*o-g*r*o+g*n*c-t*v*c-s*n*d+t*r*d)*T,e[11]=(h*r*o-s*u*o-h*n*c+t*u*c+s*n*p-t*r*p)*T,e[12]=P*T,e[13]=(h*v*a-g*u*a+g*n*f-t*v*f-h*n*m+t*u*m)*T,e[14]=(g*r*a-s*v*a-g*n*l+t*v*l+s*n*m-t*r*m)*T,e[15]=(s*u*a-h*r*a+h*n*l-t*u*l-s*n*f+t*r*f)*T,this}scale(e){const t=this.elements,n=e.x,a=e.y,o=e.z;return t[0]*=n,t[4]*=a,t[8]*=o,t[1]*=n,t[5]*=a,t[9]*=o,t[2]*=n,t[6]*=a,t[10]*=o,t[3]*=n,t[7]*=a,t[11]*=o,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],a=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,a))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),a=Math.sin(t),o=1-n,s=e.x,r=e.y,l=e.z,c=o*s,h=o*r;return this.set(c*s+n,c*r-a*l,c*l+a*r,0,c*r+a*l,h*r+n,h*l-a*s,0,c*l-a*r,h*l+a*s,o*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,a,o,s){return this.set(1,n,o,0,e,1,s,0,t,a,1,0,0,0,0,1),this}compose(e,t,n){const a=this.elements,o=t._x,s=t._y,r=t._z,l=t._w,c=o+o,h=s+s,u=r+r,f=o*c,p=o*h,g=o*u,v=s*h,m=s*u,d=r*u,M=l*c,_=l*h,w=l*u,P=n.x,k=n.y,T=n.z;return a[0]=(1-(v+d))*P,a[1]=(p+w)*P,a[2]=(g-_)*P,a[3]=0,a[4]=(p-w)*k,a[5]=(1-(f+d))*k,a[6]=(m+M)*k,a[7]=0,a[8]=(g+_)*T,a[9]=(m-M)*T,a[10]=(1-(f+v))*T,a[11]=0,a[12]=e.x,a[13]=e.y,a[14]=e.z,a[15]=1,this}decompose(e,t,n){const a=this.elements;let o=li.set(a[0],a[1],a[2]).length();const s=li.set(a[4],a[5],a[6]).length(),r=li.set(a[8],a[9],a[10]).length();this.determinant()<0&&(o=-o),e.x=a[12],e.y=a[13],e.z=a[14],qt.copy(this);const c=1/o,h=1/s,u=1/r;return qt.elements[0]*=c,qt.elements[1]*=c,qt.elements[2]*=c,qt.elements[4]*=h,qt.elements[5]*=h,qt.elements[6]*=h,qt.elements[8]*=u,qt.elements[9]*=u,qt.elements[10]*=u,t.setFromRotationMatrix(qt),n.x=o,n.y=s,n.z=r,this}makePerspective(e,t,n,a,o,s,r=vn){const l=this.elements,c=2*o/(t-e),h=2*o/(n-a),u=(t+e)/(t-e),f=(n+a)/(n-a);let p,g;if(r===vn)p=-(s+o)/(s-o),g=-2*s*o/(s-o);else if(r===ho)p=-s/(s-o),g=-s*o/(s-o);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,a,o,s,r=vn){const l=this.elements,c=1/(t-e),h=1/(n-a),u=1/(s-o),f=(t+e)*c,p=(n+a)*h;let g,v;if(r===vn)g=(s+o)*u,v=-2*u;else if(r===ho)g=o*u,v=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=v,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let a=0;a<16;a++)if(t[a]!==n[a])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const li=new X,qt=new ht,Xf=new X(0,0,0),Yf=new X(1,1,1),Sn=new X,Ta=new X,Ft=new X,fl=new ht,dl=new ua;class bo{constructor(e=0,t=0,n=0,a=bo.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=a}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,a=this._order){return this._x=e,this._y=t,this._z=n,this._order=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const a=e.elements,o=a[0],s=a[4],r=a[8],l=a[1],c=a[5],h=a[9],u=a[2],f=a[6],p=a[10];switch(t){case"XYZ":this._y=Math.asin(Lt(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-s,o)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Lt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(r,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,o),this._z=0);break;case"ZXY":this._x=Math.asin(Lt(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-s,c)):(this._y=0,this._z=Math.atan2(l,o));break;case"ZYX":this._y=Math.asin(-Lt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(l,o)):(this._x=0,this._z=Math.atan2(-s,c));break;case"YZX":this._z=Math.asin(Lt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,o)):(this._x=0,this._y=Math.atan2(r,p));break;case"XZY":this._z=Math.asin(-Lt(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(r,o)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return fl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(fl,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return dl.setFromEuler(this),this.setFromQuaternion(dl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}bo.DEFAULT_ORDER="XYZ";class Ks{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let jf=0;const pl=new X,ci=new ua,hn=new ht,ka=new X,qi=new X,$f=new X,Kf=new ua,ml=new X(1,0,0),gl=new X(0,1,0),vl=new X(0,0,1),Zf={type:"added"},Jf={type:"removed"};class wt extends Fi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:jf++}),this.uuid=zi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=wt.DEFAULT_UP.clone();const e=new X,t=new bo,n=new ua,a=new X(1,1,1);function o(){n.setFromEuler(t,!1)}function s(){t.setFromQuaternion(n,void 0,!1)}t._onChange(o),n._onChange(s),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:a},modelViewMatrix:{value:new ht},normalMatrix:{value:new ze}}),this.matrix=new ht,this.matrixWorld=new ht,this.matrixAutoUpdate=wt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=wt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ks,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ci.setFromAxisAngle(e,t),this.quaternion.multiply(ci),this}rotateOnWorldAxis(e,t){return ci.setFromAxisAngle(e,t),this.quaternion.premultiply(ci),this}rotateX(e){return this.rotateOnAxis(ml,e)}rotateY(e){return this.rotateOnAxis(gl,e)}rotateZ(e){return this.rotateOnAxis(vl,e)}translateOnAxis(e,t){return pl.copy(e).applyQuaternion(this.quaternion),this.position.add(pl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(ml,e)}translateY(e){return this.translateOnAxis(gl,e)}translateZ(e){return this.translateOnAxis(vl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(hn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?ka.copy(e):ka.set(e,t,n);const a=this.parent;this.updateWorldMatrix(!0,!1),qi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?hn.lookAt(qi,ka,this.up):hn.lookAt(ka,qi,this.up),this.quaternion.setFromRotationMatrix(hn),a&&(hn.extractRotation(a.matrixWorld),ci.setFromRotationMatrix(hn),this.quaternion.premultiply(ci.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(Zf)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Jf)),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),hn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),hn.multiply(e.parent.matrixWorld)),e.applyMatrix4(hn),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,a=this.children.length;n<a;n++){const s=this.children[n].getObjectByProperty(e,t);if(s!==void 0)return s}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const a=this.children;for(let o=0,s=a.length;o<s;o++)a[o].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(qi,e,$f),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(qi,Kf,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,a=t.length;n<a;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,a=t.length;n<a;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,a=t.length;n<a;n++){const o=t[n];(o.matrixWorldAutoUpdate===!0||e===!0)&&o.updateMatrixWorld(e)}}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const a=this.children;for(let o=0,s=a.length;o<s;o++){const r=a[o];r.matrixWorldAutoUpdate===!0&&r.updateWorldMatrix(!1,!0)}}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const a={};a.uuid=this.uuid,a.type=this.type,this.name!==""&&(a.name=this.name),this.castShadow===!0&&(a.castShadow=!0),this.receiveShadow===!0&&(a.receiveShadow=!0),this.visible===!1&&(a.visible=!1),this.frustumCulled===!1&&(a.frustumCulled=!1),this.renderOrder!==0&&(a.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(a.userData=this.userData),a.layers=this.layers.mask,a.matrix=this.matrix.toArray(),a.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(a.matrixAutoUpdate=!1),this.isInstancedMesh&&(a.type="InstancedMesh",a.count=this.count,a.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(a.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(a.type="BatchedMesh",a.perObjectFrustumCulled=this.perObjectFrustumCulled,a.sortObjects=this.sortObjects,a.drawRanges=this._drawRanges,a.reservedRanges=this._reservedRanges,a.visibility=this._visibility,a.active=this._active,a.bounds=this._bounds.map(r=>({boxInitialized:r.boxInitialized,boxMin:r.box.min.toArray(),boxMax:r.box.max.toArray(),sphereInitialized:r.sphereInitialized,sphereRadius:r.sphere.radius,sphereCenter:r.sphere.center.toArray()})),a.maxGeometryCount=this._maxGeometryCount,a.maxVertexCount=this._maxVertexCount,a.maxIndexCount=this._maxIndexCount,a.geometryInitialized=this._geometryInitialized,a.geometryCount=this._geometryCount,a.matricesTexture=this._matricesTexture.toJSON(e),this.boundingSphere!==null&&(a.boundingSphere={center:a.boundingSphere.center.toArray(),radius:a.boundingSphere.radius}),this.boundingBox!==null&&(a.boundingBox={min:a.boundingBox.min.toArray(),max:a.boundingBox.max.toArray()}));function o(r,l){return r[l.uuid]===void 0&&(r[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?a.background=this.background.toJSON():this.background.isTexture&&(a.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(a.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){a.geometry=o(e.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const l=r.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];o(e.shapes,u)}else o(e.shapes,l)}}if(this.isSkinnedMesh&&(a.bindMode=this.bindMode,a.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(o(e.skeletons,this.skeleton),a.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let l=0,c=this.material.length;l<c;l++)r.push(o(e.materials,this.material[l]));a.material=r}else a.material=o(e.materials,this.material);if(this.children.length>0){a.children=[];for(let r=0;r<this.children.length;r++)a.children.push(this.children[r].toJSON(e).object)}if(this.animations.length>0){a.animations=[];for(let r=0;r<this.animations.length;r++){const l=this.animations[r];a.animations.push(o(e.animations,l))}}if(t){const r=s(e.geometries),l=s(e.materials),c=s(e.textures),h=s(e.images),u=s(e.shapes),f=s(e.skeletons),p=s(e.animations),g=s(e.nodes);r.length>0&&(n.geometries=r),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=a,n;function s(r){const l=[];for(const c in r){const h=r[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const a=e.children[n];this.add(a.clone())}return this}}wt.DEFAULT_UP=new X(0,1,0);wt.DEFAULT_MATRIX_AUTO_UPDATE=!0;wt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Xt=new X,un=new X,Ko=new X,fn=new X,hi=new X,ui=new X,_l=new X,Zo=new X,Jo=new X,Qo=new X;let Aa=!1;class jt{constructor(e=new X,t=new X,n=new X){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,a){a.subVectors(n,t),Xt.subVectors(e,t),a.cross(Xt);const o=a.lengthSq();return o>0?a.multiplyScalar(1/Math.sqrt(o)):a.set(0,0,0)}static getBarycoord(e,t,n,a,o){Xt.subVectors(a,t),un.subVectors(n,t),Ko.subVectors(e,t);const s=Xt.dot(Xt),r=Xt.dot(un),l=Xt.dot(Ko),c=un.dot(un),h=un.dot(Ko),u=s*c-r*r;if(u===0)return o.set(0,0,0),null;const f=1/u,p=(c*l-r*h)*f,g=(s*h-r*l)*f;return o.set(1-p-g,g,p)}static containsPoint(e,t,n,a){return this.getBarycoord(e,t,n,a,fn)===null?!1:fn.x>=0&&fn.y>=0&&fn.x+fn.y<=1}static getUV(e,t,n,a,o,s,r,l){return Aa===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Aa=!0),this.getInterpolation(e,t,n,a,o,s,r,l)}static getInterpolation(e,t,n,a,o,s,r,l){return this.getBarycoord(e,t,n,a,fn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(o,fn.x),l.addScaledVector(s,fn.y),l.addScaledVector(r,fn.z),l)}static isFrontFacing(e,t,n,a){return Xt.subVectors(n,t),un.subVectors(e,t),Xt.cross(un).dot(a)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,a){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[a]),this}setFromAttributeAndIndices(e,t,n,a){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,a),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Xt.subVectors(this.c,this.b),un.subVectors(this.a,this.b),Xt.cross(un).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return jt.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return jt.getBarycoord(e,this.a,this.b,this.c,t)}getUV(e,t,n,a,o){return Aa===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Aa=!0),jt.getInterpolation(e,this.a,this.b,this.c,t,n,a,o)}getInterpolation(e,t,n,a,o){return jt.getInterpolation(e,this.a,this.b,this.c,t,n,a,o)}containsPoint(e){return jt.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return jt.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,a=this.b,o=this.c;let s,r;hi.subVectors(a,n),ui.subVectors(o,n),Zo.subVectors(e,n);const l=hi.dot(Zo),c=ui.dot(Zo);if(l<=0&&c<=0)return t.copy(n);Jo.subVectors(e,a);const h=hi.dot(Jo),u=ui.dot(Jo);if(h>=0&&u<=h)return t.copy(a);const f=l*u-h*c;if(f<=0&&l>=0&&h<=0)return s=l/(l-h),t.copy(n).addScaledVector(hi,s);Qo.subVectors(e,o);const p=hi.dot(Qo),g=ui.dot(Qo);if(g>=0&&p<=g)return t.copy(o);const v=p*c-l*g;if(v<=0&&c>=0&&g<=0)return r=c/(c-g),t.copy(n).addScaledVector(ui,r);const m=h*g-p*u;if(m<=0&&u-h>=0&&p-g>=0)return _l.subVectors(o,a),r=(u-h)/(u-h+(p-g)),t.copy(a).addScaledVector(_l,r);const d=1/(m+v+f);return s=v*d,r=f*d,t.copy(n).addScaledVector(hi,s).addScaledVector(ui,r)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const qc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},yn={h:0,s:0,l:0},Pa={h:0,s:0,l:0};function es(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class Oe{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const a=e;a&&a.isColor?this.copy(a):typeof a=="number"?this.setHex(a):typeof a=="string"&&this.setStyle(a)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=vt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,qe.toWorkingColorSpace(this,t),this}setRGB(e,t,n,a=qe.workingColorSpace){return this.r=e,this.g=t,this.b=n,qe.toWorkingColorSpace(this,a),this}setHSL(e,t,n,a=qe.workingColorSpace){if(e=js(e,1),t=Lt(t,0,1),n=Lt(n,0,1),t===0)this.r=this.g=this.b=n;else{const o=n<=.5?n*(1+t):n+t-n*t,s=2*n-o;this.r=es(s,o,e+1/3),this.g=es(s,o,e),this.b=es(s,o,e-1/3)}return qe.toWorkingColorSpace(this,a),this}setStyle(e,t=vt){function n(o){o!==void 0&&parseFloat(o)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let a;if(a=/^(\w+)\(([^\)]*)\)/.exec(e)){let o;const s=a[1],r=a[2];switch(s){case"rgb":case"rgba":if(o=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return n(o[4]),this.setRGB(Math.min(255,parseInt(o[1],10))/255,Math.min(255,parseInt(o[2],10))/255,Math.min(255,parseInt(o[3],10))/255,t);if(o=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return n(o[4]),this.setRGB(Math.min(100,parseInt(o[1],10))/100,Math.min(100,parseInt(o[2],10))/100,Math.min(100,parseInt(o[3],10))/100,t);break;case"hsl":case"hsla":if(o=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return n(o[4]),this.setHSL(parseFloat(o[1])/360,parseFloat(o[2])/100,parseFloat(o[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(a=/^\#([A-Fa-f\d]+)$/.exec(e)){const o=a[1],s=o.length;if(s===3)return this.setRGB(parseInt(o.charAt(0),16)/15,parseInt(o.charAt(1),16)/15,parseInt(o.charAt(2),16)/15,t);if(s===6)return this.setHex(parseInt(o,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=vt){const n=qc[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ki(e.r),this.g=ki(e.g),this.b=ki(e.b),this}copyLinearToSRGB(e){return this.r=Ho(e.r),this.g=Ho(e.g),this.b=Ho(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=vt){return qe.fromWorkingColorSpace(yt.copy(this),e),Math.round(Lt(yt.r*255,0,255))*65536+Math.round(Lt(yt.g*255,0,255))*256+Math.round(Lt(yt.b*255,0,255))}getHexString(e=vt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=qe.workingColorSpace){qe.fromWorkingColorSpace(yt.copy(this),t);const n=yt.r,a=yt.g,o=yt.b,s=Math.max(n,a,o),r=Math.min(n,a,o);let l,c;const h=(r+s)/2;if(r===s)l=0,c=0;else{const u=s-r;switch(c=h<=.5?u/(s+r):u/(2-s-r),s){case n:l=(a-o)/u+(a<o?6:0);break;case a:l=(o-n)/u+2;break;case o:l=(n-a)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=qe.workingColorSpace){return qe.fromWorkingColorSpace(yt.copy(this),t),e.r=yt.r,e.g=yt.g,e.b=yt.b,e}getStyle(e=vt){qe.fromWorkingColorSpace(yt.copy(this),e);const t=yt.r,n=yt.g,a=yt.b;return e!==vt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${a.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(a*255)})`}offsetHSL(e,t,n){return this.getHSL(yn),this.setHSL(yn.h+e,yn.s+t,yn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(yn),e.getHSL(Pa);const n=ea(yn.h,Pa.h,t),a=ea(yn.s,Pa.s,t),o=ea(yn.l,Pa.l,t);return this.setHSL(n,a,o),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,a=this.b,o=e.elements;return this.r=o[0]*t+o[3]*n+o[6]*a,this.g=o[1]*t+o[4]*n+o[7]*a,this.b=o[2]*t+o[5]*n+o[8]*a,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const yt=new Oe;Oe.NAMES=qc;let Qf=0;class Oi extends Fi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Qf++}),this.uuid=zi(),this.name="",this.type="Material",this.blending=Ti,this.side=Dn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ws,this.blendDst=bs,this.blendEquation=Wn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Oe(0,0,0),this.blendAlpha=0,this.depthFunc=so,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=al,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ii,this.stencilZFail=ii,this.stencilZPass=ii,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const a=this[t];if(a===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}a&&a.isColor?a.set(n):a&&a.isVector3&&n&&n.isVector3?a.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ti&&(n.blending=this.blending),this.side!==Dn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ws&&(n.blendSrc=this.blendSrc),this.blendDst!==bs&&(n.blendDst=this.blendDst),this.blendEquation!==Wn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==so&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==al&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ii&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ii&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ii&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function a(o){const s=[];for(const r in o){const l=o[r];delete l.metadata,s.push(l)}return s}if(t){const o=a(e.textures),s=a(e.images);o.length>0&&(n.textures=o),s.length>0&&(n.images=s)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const a=t.length;n=new Array(a);for(let o=0;o!==a;++o)n[o]=t[o].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Zs extends Oi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Oe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=kc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const rt=new X,Ra=new Ge;class Dt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=ol,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=An,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let a=0,o=this.itemSize;a<o;a++)this.array[e+a]=t.array[n+a];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Ra.fromBufferAttribute(this,t),Ra.applyMatrix3(e),this.setXY(t,Ra.x,Ra.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)rt.fromBufferAttribute(this,t),rt.applyMatrix3(e),this.setXYZ(t,rt.x,rt.y,rt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)rt.fromBufferAttribute(this,t),rt.applyMatrix4(e),this.setXYZ(t,rt.x,rt.y,rt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)rt.fromBufferAttribute(this,t),rt.applyNormalMatrix(e),this.setXYZ(t,rt.x,rt.y,rt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)rt.fromBufferAttribute(this,t),rt.transformDirection(e),this.setXYZ(t,rt.x,rt.y,rt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Mi(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Pt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Mi(t,this.array)),t}setX(e,t){return this.normalized&&(t=Pt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Mi(t,this.array)),t}setY(e,t){return this.normalized&&(t=Pt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Mi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Pt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Mi(t,this.array)),t}setW(e,t){return this.normalized&&(t=Pt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Pt(t,this.array),n=Pt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,a){return e*=this.itemSize,this.normalized&&(t=Pt(t,this.array),n=Pt(n,this.array),a=Pt(a,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=a,this}setXYZW(e,t,n,a,o){return e*=this.itemSize,this.normalized&&(t=Pt(t,this.array),n=Pt(n,this.array),a=Pt(a,this.array),o=Pt(o,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=a,this.array[e+3]=o,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==ol&&(e.usage=this.usage),e}}class Xc extends Dt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Yc extends Dt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class Zn extends Dt{constructor(e,t,n){super(new Float32Array(e),t,n)}}let ed=0;const Gt=new ht,ts=new wt,fi=new X,zt=new fa,Xi=new fa,mt=new X;class ti extends Fi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:ed++}),this.uuid=zi(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Bc(e)?Yc:Xc)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const o=new ze().getNormalMatrix(e);n.applyNormalMatrix(o),n.needsUpdate=!0}const a=this.attributes.tangent;return a!==void 0&&(a.transformDirection(e),a.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Gt.makeRotationFromQuaternion(e),this.applyMatrix4(Gt),this}rotateX(e){return Gt.makeRotationX(e),this.applyMatrix4(Gt),this}rotateY(e){return Gt.makeRotationY(e),this.applyMatrix4(Gt),this}rotateZ(e){return Gt.makeRotationZ(e),this.applyMatrix4(Gt),this}translate(e,t,n){return Gt.makeTranslation(e,t,n),this.applyMatrix4(Gt),this}scale(e,t,n){return Gt.makeScale(e,t,n),this.applyMatrix4(Gt),this}lookAt(e){return ts.lookAt(e),ts.updateMatrix(),this.applyMatrix4(ts.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(fi).negate(),this.translate(fi.x,fi.y,fi.z),this}setFromPoints(e){const t=[];for(let n=0,a=e.length;n<a;n++){const o=e[n];t.push(o.x,o.y,o.z||0)}return this.setAttribute("position",new Zn(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new fa);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new X(-1/0,-1/0,-1/0),new X(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,a=t.length;n<a;n++){const o=t[n];zt.setFromBufferAttribute(o),this.morphTargetsRelative?(mt.addVectors(this.boundingBox.min,zt.min),this.boundingBox.expandByPoint(mt),mt.addVectors(this.boundingBox.max,zt.max),this.boundingBox.expandByPoint(mt)):(this.boundingBox.expandByPoint(zt.min),this.boundingBox.expandByPoint(zt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new $s);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new X,1/0);return}if(e){const n=this.boundingSphere.center;if(zt.setFromBufferAttribute(e),t)for(let o=0,s=t.length;o<s;o++){const r=t[o];Xi.setFromBufferAttribute(r),this.morphTargetsRelative?(mt.addVectors(zt.min,Xi.min),zt.expandByPoint(mt),mt.addVectors(zt.max,Xi.max),zt.expandByPoint(mt)):(zt.expandByPoint(Xi.min),zt.expandByPoint(Xi.max))}zt.getCenter(n);let a=0;for(let o=0,s=e.count;o<s;o++)mt.fromBufferAttribute(e,o),a=Math.max(a,n.distanceToSquared(mt));if(t)for(let o=0,s=t.length;o<s;o++){const r=t[o],l=this.morphTargetsRelative;for(let c=0,h=r.count;c<h;c++)mt.fromBufferAttribute(r,c),l&&(fi.fromBufferAttribute(e,c),mt.add(fi)),a=Math.max(a,n.distanceToSquared(mt))}this.boundingSphere.radius=Math.sqrt(a),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.array,a=t.position.array,o=t.normal.array,s=t.uv.array,r=a.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Dt(new Float32Array(4*r),4));const l=this.getAttribute("tangent").array,c=[],h=[];for(let b=0;b<r;b++)c[b]=new X,h[b]=new X;const u=new X,f=new X,p=new X,g=new Ge,v=new Ge,m=new Ge,d=new X,M=new X;function _(b,N,L){u.fromArray(a,b*3),f.fromArray(a,N*3),p.fromArray(a,L*3),g.fromArray(s,b*2),v.fromArray(s,N*2),m.fromArray(s,L*2),f.sub(u),p.sub(u),v.sub(g),m.sub(g);const V=1/(v.x*m.y-m.x*v.y);isFinite(V)&&(d.copy(f).multiplyScalar(m.y).addScaledVector(p,-v.y).multiplyScalar(V),M.copy(p).multiplyScalar(v.x).addScaledVector(f,-m.x).multiplyScalar(V),c[b].add(d),c[N].add(d),c[L].add(d),h[b].add(M),h[N].add(M),h[L].add(M))}let w=this.groups;w.length===0&&(w=[{start:0,count:n.length}]);for(let b=0,N=w.length;b<N;++b){const L=w[b],V=L.start,E=L.count;for(let C=V,D=V+E;C<D;C+=3)_(n[C+0],n[C+1],n[C+2])}const P=new X,k=new X,T=new X,S=new X;function x(b){T.fromArray(o,b*3),S.copy(T);const N=c[b];P.copy(N),P.sub(T.multiplyScalar(T.dot(N))).normalize(),k.crossVectors(S,N);const V=k.dot(h[b])<0?-1:1;l[b*4]=P.x,l[b*4+1]=P.y,l[b*4+2]=P.z,l[b*4+3]=V}for(let b=0,N=w.length;b<N;++b){const L=w[b],V=L.start,E=L.count;for(let C=V,D=V+E;C<D;C+=3)x(n[C+0]),x(n[C+1]),x(n[C+2])}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Dt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,p=n.count;f<p;f++)n.setXYZ(f,0,0,0);const a=new X,o=new X,s=new X,r=new X,l=new X,c=new X,h=new X,u=new X;if(e)for(let f=0,p=e.count;f<p;f+=3){const g=e.getX(f+0),v=e.getX(f+1),m=e.getX(f+2);a.fromBufferAttribute(t,g),o.fromBufferAttribute(t,v),s.fromBufferAttribute(t,m),h.subVectors(s,o),u.subVectors(a,o),h.cross(u),r.fromBufferAttribute(n,g),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,m),r.add(h),l.add(h),c.add(h),n.setXYZ(g,r.x,r.y,r.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let f=0,p=t.count;f<p;f+=3)a.fromBufferAttribute(t,f+0),o.fromBufferAttribute(t,f+1),s.fromBufferAttribute(t,f+2),h.subVectors(s,o),u.subVectors(a,o),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)mt.fromBufferAttribute(e,t),mt.normalize(),e.setXYZ(t,mt.x,mt.y,mt.z)}toNonIndexed(){function e(r,l){const c=r.array,h=r.itemSize,u=r.normalized,f=new c.constructor(l.length*h);let p=0,g=0;for(let v=0,m=l.length;v<m;v++){r.isInterleavedBufferAttribute?p=l[v]*r.data.stride+r.offset:p=l[v]*h;for(let d=0;d<h;d++)f[g++]=c[p++]}return new Dt(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new ti,n=this.index.array,a=this.attributes;for(const r in a){const l=a[r],c=e(l,n);t.setAttribute(r,c)}const o=this.morphAttributes;for(const r in o){const l=[],c=o[r];for(let h=0,u=c.length;h<u;h++){const f=c[h],p=e(f,n);l.push(p)}t.morphAttributes[r]=l}t.morphTargetsRelative=this.morphTargetsRelative;const s=this.groups;for(let r=0,l=s.length;r<l;r++){const c=s[r];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const a={};let o=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,f=c.length;u<f;u++){const p=c[u];h.push(p.toJSON(e.data))}h.length>0&&(a[l]=h,o=!0)}o&&(e.data.morphAttributes=a,e.data.morphTargetsRelative=this.morphTargetsRelative);const s=this.groups;s.length>0&&(e.data.groups=JSON.parse(JSON.stringify(s)));const r=this.boundingSphere;return r!==null&&(e.data.boundingSphere={center:r.center.toArray(),radius:r.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const a=e.attributes;for(const c in a){const h=a[c];this.setAttribute(c,h.clone(t))}const o=e.morphAttributes;for(const c in o){const h=[],u=o[c];for(let f=0,p=u.length;f<p;f++)h.push(u[f].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const s=e.groups;for(let c=0,h=s.length;c<h;c++){const u=s[c];this.addGroup(u.start,u.count,u.materialIndex)}const r=e.boundingBox;r!==null&&(this.boundingBox=r.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const xl=new ht,On=new Wc,Ca=new $s,Ml=new X,di=new X,pi=new X,mi=new X,ns=new X,La=new X,Na=new Ge,Da=new Ge,Ua=new Ge,wl=new X,bl=new X,Sl=new X,Ia=new X,Fa=new X;class Qt extends wt{constructor(e=new ti,t=new Zs){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const a=t[n[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,s=a.length;o<s;o++){const r=a[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=o}}}}getVertexPosition(e,t){const n=this.geometry,a=n.attributes.position,o=n.morphAttributes.position,s=n.morphTargetsRelative;t.fromBufferAttribute(a,e);const r=this.morphTargetInfluences;if(o&&r){La.set(0,0,0);for(let l=0,c=o.length;l<c;l++){const h=r[l],u=o[l];h!==0&&(ns.fromBufferAttribute(u,e),s?La.addScaledVector(ns,h):La.addScaledVector(ns.sub(t),h))}t.add(La)}return t}raycast(e,t){const n=this.geometry,a=this.material,o=this.matrixWorld;a!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ca.copy(n.boundingSphere),Ca.applyMatrix4(o),On.copy(e.ray).recast(e.near),!(Ca.containsPoint(On.origin)===!1&&(On.intersectSphere(Ca,Ml)===null||On.origin.distanceToSquared(Ml)>(e.far-e.near)**2))&&(xl.copy(o).invert(),On.copy(e.ray).applyMatrix4(xl),!(n.boundingBox!==null&&On.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,On)))}_computeIntersections(e,t,n){let a;const o=this.geometry,s=this.material,r=o.index,l=o.attributes.position,c=o.attributes.uv,h=o.attributes.uv1,u=o.attributes.normal,f=o.groups,p=o.drawRange;if(r!==null)if(Array.isArray(s))for(let g=0,v=f.length;g<v;g++){const m=f[g],d=s[m.materialIndex],M=Math.max(m.start,p.start),_=Math.min(r.count,Math.min(m.start+m.count,p.start+p.count));for(let w=M,P=_;w<P;w+=3){const k=r.getX(w),T=r.getX(w+1),S=r.getX(w+2);a=za(this,d,e,n,c,h,u,k,T,S),a&&(a.faceIndex=Math.floor(w/3),a.face.materialIndex=m.materialIndex,t.push(a))}}else{const g=Math.max(0,p.start),v=Math.min(r.count,p.start+p.count);for(let m=g,d=v;m<d;m+=3){const M=r.getX(m),_=r.getX(m+1),w=r.getX(m+2);a=za(this,s,e,n,c,h,u,M,_,w),a&&(a.faceIndex=Math.floor(m/3),t.push(a))}}else if(l!==void 0)if(Array.isArray(s))for(let g=0,v=f.length;g<v;g++){const m=f[g],d=s[m.materialIndex],M=Math.max(m.start,p.start),_=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let w=M,P=_;w<P;w+=3){const k=w,T=w+1,S=w+2;a=za(this,d,e,n,c,h,u,k,T,S),a&&(a.faceIndex=Math.floor(w/3),a.face.materialIndex=m.materialIndex,t.push(a))}}else{const g=Math.max(0,p.start),v=Math.min(l.count,p.start+p.count);for(let m=g,d=v;m<d;m+=3){const M=m,_=m+1,w=m+2;a=za(this,s,e,n,c,h,u,M,_,w),a&&(a.faceIndex=Math.floor(m/3),t.push(a))}}}}function td(i,e,t,n,a,o,s,r){let l;if(e.side===Ut?l=n.intersectTriangle(s,o,a,!0,r):l=n.intersectTriangle(a,o,s,e.side===Dn,r),l===null)return null;Fa.copy(r),Fa.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(Fa);return c<t.near||c>t.far?null:{distance:c,point:Fa.clone(),object:i}}function za(i,e,t,n,a,o,s,r,l,c){i.getVertexPosition(r,di),i.getVertexPosition(l,pi),i.getVertexPosition(c,mi);const h=td(i,e,t,n,di,pi,mi,Ia);if(h){a&&(Na.fromBufferAttribute(a,r),Da.fromBufferAttribute(a,l),Ua.fromBufferAttribute(a,c),h.uv=jt.getInterpolation(Ia,di,pi,mi,Na,Da,Ua,new Ge)),o&&(Na.fromBufferAttribute(o,r),Da.fromBufferAttribute(o,l),Ua.fromBufferAttribute(o,c),h.uv1=jt.getInterpolation(Ia,di,pi,mi,Na,Da,Ua,new Ge),h.uv2=h.uv1),s&&(wl.fromBufferAttribute(s,r),bl.fromBufferAttribute(s,l),Sl.fromBufferAttribute(s,c),h.normal=jt.getInterpolation(Ia,di,pi,mi,wl,bl,Sl,new X),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a:r,b:l,c,normal:new X,materialIndex:0};jt.getNormal(di,pi,mi,u.normal),h.face=u}return h}class Bi extends ti{constructor(e=1,t=1,n=1,a=1,o=1,s=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:a,heightSegments:o,depthSegments:s};const r=this;a=Math.floor(a),o=Math.floor(o),s=Math.floor(s);const l=[],c=[],h=[],u=[];let f=0,p=0;g("z","y","x",-1,-1,n,t,e,s,o,0),g("z","y","x",1,-1,n,t,-e,s,o,1),g("x","z","y",1,1,e,n,t,a,s,2),g("x","z","y",1,-1,e,n,-t,a,s,3),g("x","y","z",1,-1,e,t,n,a,o,4),g("x","y","z",-1,-1,e,t,-n,a,o,5),this.setIndex(l),this.setAttribute("position",new Zn(c,3)),this.setAttribute("normal",new Zn(h,3)),this.setAttribute("uv",new Zn(u,2));function g(v,m,d,M,_,w,P,k,T,S,x){const b=w/T,N=P/S,L=w/2,V=P/2,E=k/2,C=T+1,D=S+1;let j=0,F=0;const z=new X;for(let G=0;G<D;G++){const B=G*N-V;for(let q=0;q<C;q++){const I=q*b-L;z[v]=I*M,z[m]=B*_,z[d]=E,c.push(z.x,z.y,z.z),z[v]=0,z[m]=0,z[d]=k>0?1:-1,h.push(z.x,z.y,z.z),u.push(q/T),u.push(1-G/S),j+=1}}for(let G=0;G<S;G++)for(let B=0;B<T;B++){const q=f+B+C*G,I=f+B+C*(G+1),Y=f+(B+1)+C*(G+1),W=f+(B+1)+C*G;l.push(q,I,W),l.push(I,Y,W),F+=6}r.addGroup(p,F,x),p+=F,f+=j}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Bi(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Di(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const a=i[t][n];a&&(a.isColor||a.isMatrix3||a.isMatrix4||a.isVector2||a.isVector3||a.isVector4||a.isTexture||a.isQuaternion)?a.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=a.clone():Array.isArray(a)?e[t][n]=a.slice():e[t][n]=a}}return e}function Rt(i){const e={};for(let t=0;t<i.length;t++){const n=Di(i[t]);for(const a in n)e[a]=n[a]}return e}function nd(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function jc(i){return i.getRenderTarget()===null?i.outputColorSpace:qe.workingColorSpace}const id={clone:Di,merge:Rt};var ad=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,od=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Qn extends Oi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=ad,this.fragmentShader=od,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Di(e.uniforms),this.uniformsGroups=nd(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const a in this.uniforms){const s=this.uniforms[a].value;s&&s.isTexture?t.uniforms[a]={type:"t",value:s.toJSON(e).uuid}:s&&s.isColor?t.uniforms[a]={type:"c",value:s.getHex()}:s&&s.isVector2?t.uniforms[a]={type:"v2",value:s.toArray()}:s&&s.isVector3?t.uniforms[a]={type:"v3",value:s.toArray()}:s&&s.isVector4?t.uniforms[a]={type:"v4",value:s.toArray()}:s&&s.isMatrix3?t.uniforms[a]={type:"m3",value:s.toArray()}:s&&s.isMatrix4?t.uniforms[a]={type:"m4",value:s.toArray()}:t.uniforms[a]={value:s}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const a in this.extensions)this.extensions[a]===!0&&(n[a]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class $c extends wt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ht,this.projectionMatrix=new ht,this.projectionMatrixInverse=new ht,this.coordinateSystem=vn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class $t extends $c{constructor(e=50,t=1,n=.1,a=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=a,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=ra*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Qi*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ra*2*Math.atan(Math.tan(Qi*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(e,t,n,a,o,s){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=a,this.view.width=o,this.view.height=s,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Qi*.5*this.fov)/this.zoom,n=2*t,a=this.aspect*n,o=-.5*a;const s=this.view;if(this.view!==null&&this.view.enabled){const l=s.fullWidth,c=s.fullHeight;o+=s.offsetX*a/l,t-=s.offsetY*n/c,a*=s.width/l,n*=s.height/c}const r=this.filmOffset;r!==0&&(o+=e*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(o,o+a,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const gi=-90,vi=1;class sd extends wt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const a=new $t(gi,vi,e,t);a.layers=this.layers,this.add(a);const o=new $t(gi,vi,e,t);o.layers=this.layers,this.add(o);const s=new $t(gi,vi,e,t);s.layers=this.layers,this.add(s);const r=new $t(gi,vi,e,t);r.layers=this.layers,this.add(r);const l=new $t(gi,vi,e,t);l.layers=this.layers,this.add(l);const c=new $t(gi,vi,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,a,o,s,r,l]=t;for(const c of t)this.remove(c);if(e===vn)n.up.set(0,1,0),n.lookAt(1,0,0),a.up.set(0,1,0),a.lookAt(-1,0,0),o.up.set(0,0,-1),o.lookAt(0,1,0),s.up.set(0,0,1),s.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===ho)n.up.set(0,-1,0),n.lookAt(-1,0,0),a.up.set(0,-1,0),a.lookAt(1,0,0),o.up.set(0,0,1),o.lookAt(0,1,0),s.up.set(0,0,-1),s.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:a}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[o,s,r,l,c,h]=this.children,u=e.getRenderTarget(),f=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,a),e.render(t,o),e.setRenderTarget(n,1,a),e.render(t,s),e.setRenderTarget(n,2,a),e.render(t,r),e.setRenderTarget(n,3,a),e.render(t,l),e.setRenderTarget(n,4,a),e.render(t,c),n.texture.generateMipmaps=v,e.setRenderTarget(n,5,a),e.render(t,h),e.setRenderTarget(u,f,p),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Kc extends Nt{constructor(e,t,n,a,o,s,r,l,c,h){e=e!==void 0?e:[],t=t!==void 0?t:Ri,super(e,t,n,a,o,s,r,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class rd extends Jn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},a=[n,n,n,n,n,n];t.encoding!==void 0&&(ta("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),t.colorSpace=t.encoding===Kn?vt:Ht),this.texture=new Kc(a,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Ot}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},a=new Bi(5,5,5),o=new Qn({name:"CubemapFromEquirect",uniforms:Di(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ut,blending:Pn});o.uniforms.tEquirect.value=t;const s=new Qt(a,o),r=t.minFilter;return t.minFilter===Li&&(t.minFilter=Ot),new sd(1,10,this).update(e,s),t.minFilter=r,s.geometry.dispose(),s.material.dispose(),this}clear(e,t,n,a){const o=e.getRenderTarget();for(let s=0;s<6;s++)e.setRenderTarget(this,s),e.clear(t,n,a);e.setRenderTarget(o)}}const is=new X,ld=new X,cd=new ze;class Gn{constructor(e=new X(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,a){return this.normal.set(e,t,n),this.constant=a,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const a=is.subVectors(n,t).cross(ld.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(a,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(is),a=this.normal.dot(n);if(a===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const o=-(e.start.dot(this.normal)+this.constant)/a;return o<0||o>1?null:t.copy(e.start).addScaledVector(n,o)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||cd.getNormalMatrix(e),a=this.coplanarPoint(is).applyMatrix4(e),o=this.normal.applyMatrix3(n).normalize();return this.constant=-a.dot(o),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Bn=new $s,Oa=new X;class Js{constructor(e=new Gn,t=new Gn,n=new Gn,a=new Gn,o=new Gn,s=new Gn){this.planes=[e,t,n,a,o,s]}set(e,t,n,a,o,s){const r=this.planes;return r[0].copy(e),r[1].copy(t),r[2].copy(n),r[3].copy(a),r[4].copy(o),r[5].copy(s),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=vn){const n=this.planes,a=e.elements,o=a[0],s=a[1],r=a[2],l=a[3],c=a[4],h=a[5],u=a[6],f=a[7],p=a[8],g=a[9],v=a[10],m=a[11],d=a[12],M=a[13],_=a[14],w=a[15];if(n[0].setComponents(l-o,f-c,m-p,w-d).normalize(),n[1].setComponents(l+o,f+c,m+p,w+d).normalize(),n[2].setComponents(l+s,f+h,m+g,w+M).normalize(),n[3].setComponents(l-s,f-h,m-g,w-M).normalize(),n[4].setComponents(l-r,f-u,m-v,w-_).normalize(),t===vn)n[5].setComponents(l+r,f+u,m+v,w+_).normalize();else if(t===ho)n[5].setComponents(r,u,v,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Bn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Bn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Bn)}intersectsSprite(e){return Bn.center.set(0,0,0),Bn.radius=.7071067811865476,Bn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Bn)}intersectsSphere(e){const t=this.planes,n=e.center,a=-e.radius;for(let o=0;o<6;o++)if(t[o].distanceToPoint(n)<a)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const a=t[n];if(Oa.x=a.normal.x>0?e.max.x:e.min.x,Oa.y=a.normal.y>0?e.max.y:e.min.y,Oa.z=a.normal.z>0?e.max.z:e.min.z,a.distanceToPoint(Oa)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Zc(){let i=null,e=!1,t=null,n=null;function a(o,s){t(o,s),n=i.requestAnimationFrame(a)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(a),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(o){t=o},setContext:function(o){i=o}}}function hd(i,e){const t=e.isWebGL2,n=new WeakMap;function a(c,h){const u=c.array,f=c.usage,p=u.byteLength,g=i.createBuffer();i.bindBuffer(h,g),i.bufferData(h,u,f),c.onUploadCallback();let v;if(u instanceof Float32Array)v=i.FLOAT;else if(u instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(t)v=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else v=i.UNSIGNED_SHORT;else if(u instanceof Int16Array)v=i.SHORT;else if(u instanceof Uint32Array)v=i.UNSIGNED_INT;else if(u instanceof Int32Array)v=i.INT;else if(u instanceof Int8Array)v=i.BYTE;else if(u instanceof Uint8Array)v=i.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)v=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:g,type:v,bytesPerElement:u.BYTES_PER_ELEMENT,version:c.version,size:p}}function o(c,h,u){const f=h.array,p=h._updateRange,g=h.updateRanges;if(i.bindBuffer(u,c),p.count===-1&&g.length===0&&i.bufferSubData(u,0,f),g.length!==0){for(let v=0,m=g.length;v<m;v++){const d=g[v];t?i.bufferSubData(u,d.start*f.BYTES_PER_ELEMENT,f,d.start,d.count):i.bufferSubData(u,d.start*f.BYTES_PER_ELEMENT,f.subarray(d.start,d.start+d.count))}h.clearUpdateRanges()}p.count!==-1&&(t?i.bufferSubData(u,p.offset*f.BYTES_PER_ELEMENT,f,p.offset,p.count):i.bufferSubData(u,p.offset*f.BYTES_PER_ELEMENT,f.subarray(p.offset,p.offset+p.count)),p.count=-1),h.onUploadCallback()}function s(c){return c.isInterleavedBufferAttribute&&(c=c.data),n.get(c)}function r(c){c.isInterleavedBufferAttribute&&(c=c.data);const h=n.get(c);h&&(i.deleteBuffer(h.buffer),n.delete(c))}function l(c,h){if(c.isGLBufferAttribute){const f=n.get(c);(!f||f.version<c.version)&&n.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);const u=n.get(c);if(u===void 0)n.set(c,a(c,h));else if(u.version<c.version){if(u.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");o(u.buffer,c,h),u.version=c.version}}return{get:s,remove:r,update:l}}class la extends ti{constructor(e=1,t=1,n=1,a=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:a};const o=e/2,s=t/2,r=Math.floor(n),l=Math.floor(a),c=r+1,h=l+1,u=e/r,f=t/l,p=[],g=[],v=[],m=[];for(let d=0;d<h;d++){const M=d*f-s;for(let _=0;_<c;_++){const w=_*u-o;g.push(w,-M,0),v.push(0,0,1),m.push(_/r),m.push(1-d/l)}}for(let d=0;d<l;d++)for(let M=0;M<r;M++){const _=M+c*d,w=M+c*(d+1),P=M+1+c*(d+1),k=M+1+c*d;p.push(_,w,k),p.push(w,P,k)}this.setIndex(p),this.setAttribute("position",new Zn(g,3)),this.setAttribute("normal",new Zn(v,3)),this.setAttribute("uv",new Zn(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new la(e.width,e.height,e.widthSegments,e.heightSegments)}}var ud=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,fd=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,dd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,pd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,md=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,gd=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,vd=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,_d=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,xd=`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Md=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,wd=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,bd=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Sd=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,yd=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Ed=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Td=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
	}
	#pragma unroll_loop_end
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
		bool clipped = true;
		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
		}
		#pragma unroll_loop_end
		if ( clipped ) discard;
	#endif
#endif`,kd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Ad=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Pd=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Rd=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Cd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Ld=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Nd=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Dd=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Ud=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Id=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Fd=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,zd=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Od=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Bd=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Gd="gl_FragColor = linearToOutputTexel( gl_FragColor );",Hd=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,Vd=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Wd=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,qd=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Xd=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Yd=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,jd=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,$d=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Kd=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Zd=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Jd=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Qd=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,ep=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,tp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,np=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,ip=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,ap=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,op=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,sp=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,rp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lp=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,cp=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,hp=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,up=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,fp=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,dp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,pp=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,mp=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,gp=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,vp=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,_p=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,xp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Mp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,wp=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,bp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Sp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,yp=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Ep=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,Tp=`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,kp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,Ap=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Pp=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Rp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Cp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Lp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Np=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Dp=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Up=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Ip=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Fp=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,zp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Op=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Bp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Gp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Hp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Vp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Wp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,qp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Xp=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,Yp=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,jp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,$p=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Kp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Zp=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Jp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Qp=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,em=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,tm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,nm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,im=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color *= toneMappingExposure;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	return color;
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,am=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,om=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,sm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,rm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,lm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,cm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const hm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,um=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,fm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,dm=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,pm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,mm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,gm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,vm=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,_m=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,xm=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Mm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,wm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,bm=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Sm=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ym=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Em=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Tm=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,km=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Am=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Pm=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Rm=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Cm=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Lm=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Nm=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Dm=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Um=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Im=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Fm=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,zm=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Om=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Bm=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Gm=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Hm=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Vm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ne={alphahash_fragment:ud,alphahash_pars_fragment:fd,alphamap_fragment:dd,alphamap_pars_fragment:pd,alphatest_fragment:md,alphatest_pars_fragment:gd,aomap_fragment:vd,aomap_pars_fragment:_d,batching_pars_vertex:xd,batching_vertex:Md,begin_vertex:wd,beginnormal_vertex:bd,bsdfs:Sd,iridescence_fragment:yd,bumpmap_pars_fragment:Ed,clipping_planes_fragment:Td,clipping_planes_pars_fragment:kd,clipping_planes_pars_vertex:Ad,clipping_planes_vertex:Pd,color_fragment:Rd,color_pars_fragment:Cd,color_pars_vertex:Ld,color_vertex:Nd,common:Dd,cube_uv_reflection_fragment:Ud,defaultnormal_vertex:Id,displacementmap_pars_vertex:Fd,displacementmap_vertex:zd,emissivemap_fragment:Od,emissivemap_pars_fragment:Bd,colorspace_fragment:Gd,colorspace_pars_fragment:Hd,envmap_fragment:Vd,envmap_common_pars_fragment:Wd,envmap_pars_fragment:qd,envmap_pars_vertex:Xd,envmap_physical_pars_fragment:ap,envmap_vertex:Yd,fog_vertex:jd,fog_pars_vertex:$d,fog_fragment:Kd,fog_pars_fragment:Zd,gradientmap_pars_fragment:Jd,lightmap_fragment:Qd,lightmap_pars_fragment:ep,lights_lambert_fragment:tp,lights_lambert_pars_fragment:np,lights_pars_begin:ip,lights_toon_fragment:op,lights_toon_pars_fragment:sp,lights_phong_fragment:rp,lights_phong_pars_fragment:lp,lights_physical_fragment:cp,lights_physical_pars_fragment:hp,lights_fragment_begin:up,lights_fragment_maps:fp,lights_fragment_end:dp,logdepthbuf_fragment:pp,logdepthbuf_pars_fragment:mp,logdepthbuf_pars_vertex:gp,logdepthbuf_vertex:vp,map_fragment:_p,map_pars_fragment:xp,map_particle_fragment:Mp,map_particle_pars_fragment:wp,metalnessmap_fragment:bp,metalnessmap_pars_fragment:Sp,morphcolor_vertex:yp,morphnormal_vertex:Ep,morphtarget_pars_vertex:Tp,morphtarget_vertex:kp,normal_fragment_begin:Ap,normal_fragment_maps:Pp,normal_pars_fragment:Rp,normal_pars_vertex:Cp,normal_vertex:Lp,normalmap_pars_fragment:Np,clearcoat_normal_fragment_begin:Dp,clearcoat_normal_fragment_maps:Up,clearcoat_pars_fragment:Ip,iridescence_pars_fragment:Fp,opaque_fragment:zp,packing:Op,premultiplied_alpha_fragment:Bp,project_vertex:Gp,dithering_fragment:Hp,dithering_pars_fragment:Vp,roughnessmap_fragment:Wp,roughnessmap_pars_fragment:qp,shadowmap_pars_fragment:Xp,shadowmap_pars_vertex:Yp,shadowmap_vertex:jp,shadowmask_pars_fragment:$p,skinbase_vertex:Kp,skinning_pars_vertex:Zp,skinning_vertex:Jp,skinnormal_vertex:Qp,specularmap_fragment:em,specularmap_pars_fragment:tm,tonemapping_fragment:nm,tonemapping_pars_fragment:im,transmission_fragment:am,transmission_pars_fragment:om,uv_pars_fragment:sm,uv_pars_vertex:rm,uv_vertex:lm,worldpos_vertex:cm,background_vert:hm,background_frag:um,backgroundCube_vert:fm,backgroundCube_frag:dm,cube_vert:pm,cube_frag:mm,depth_vert:gm,depth_frag:vm,distanceRGBA_vert:_m,distanceRGBA_frag:xm,equirect_vert:Mm,equirect_frag:wm,linedashed_vert:bm,linedashed_frag:Sm,meshbasic_vert:ym,meshbasic_frag:Em,meshlambert_vert:Tm,meshlambert_frag:km,meshmatcap_vert:Am,meshmatcap_frag:Pm,meshnormal_vert:Rm,meshnormal_frag:Cm,meshphong_vert:Lm,meshphong_frag:Nm,meshphysical_vert:Dm,meshphysical_frag:Um,meshtoon_vert:Im,meshtoon_frag:Fm,points_vert:zm,points_frag:Om,shadow_vert:Bm,shadow_frag:Gm,sprite_vert:Hm,sprite_frag:Vm},le={common:{diffuse:{value:new Oe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ze},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ze}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ze}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ze}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ze},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ze},normalScale:{value:new Ge(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ze},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ze}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ze}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ze}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Oe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Oe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0},uvTransform:{value:new ze}},sprite:{diffuse:{value:new Oe(16777215)},opacity:{value:1},center:{value:new Ge(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ze},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0}}},an={basic:{uniforms:Rt([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.fog]),vertexShader:Ne.meshbasic_vert,fragmentShader:Ne.meshbasic_frag},lambert:{uniforms:Rt([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.fog,le.lights,{emissive:{value:new Oe(0)}}]),vertexShader:Ne.meshlambert_vert,fragmentShader:Ne.meshlambert_frag},phong:{uniforms:Rt([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.fog,le.lights,{emissive:{value:new Oe(0)},specular:{value:new Oe(1118481)},shininess:{value:30}}]),vertexShader:Ne.meshphong_vert,fragmentShader:Ne.meshphong_frag},standard:{uniforms:Rt([le.common,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.roughnessmap,le.metalnessmap,le.fog,le.lights,{emissive:{value:new Oe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ne.meshphysical_vert,fragmentShader:Ne.meshphysical_frag},toon:{uniforms:Rt([le.common,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.gradientmap,le.fog,le.lights,{emissive:{value:new Oe(0)}}]),vertexShader:Ne.meshtoon_vert,fragmentShader:Ne.meshtoon_frag},matcap:{uniforms:Rt([le.common,le.bumpmap,le.normalmap,le.displacementmap,le.fog,{matcap:{value:null}}]),vertexShader:Ne.meshmatcap_vert,fragmentShader:Ne.meshmatcap_frag},points:{uniforms:Rt([le.points,le.fog]),vertexShader:Ne.points_vert,fragmentShader:Ne.points_frag},dashed:{uniforms:Rt([le.common,le.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ne.linedashed_vert,fragmentShader:Ne.linedashed_frag},depth:{uniforms:Rt([le.common,le.displacementmap]),vertexShader:Ne.depth_vert,fragmentShader:Ne.depth_frag},normal:{uniforms:Rt([le.common,le.bumpmap,le.normalmap,le.displacementmap,{opacity:{value:1}}]),vertexShader:Ne.meshnormal_vert,fragmentShader:Ne.meshnormal_frag},sprite:{uniforms:Rt([le.sprite,le.fog]),vertexShader:Ne.sprite_vert,fragmentShader:Ne.sprite_frag},background:{uniforms:{uvTransform:{value:new ze},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ne.background_vert,fragmentShader:Ne.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Ne.backgroundCube_vert,fragmentShader:Ne.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ne.cube_vert,fragmentShader:Ne.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ne.equirect_vert,fragmentShader:Ne.equirect_frag},distanceRGBA:{uniforms:Rt([le.common,le.displacementmap,{referencePosition:{value:new X},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ne.distanceRGBA_vert,fragmentShader:Ne.distanceRGBA_frag},shadow:{uniforms:Rt([le.lights,le.fog,{color:{value:new Oe(0)},opacity:{value:1}}]),vertexShader:Ne.shadow_vert,fragmentShader:Ne.shadow_frag}};an.physical={uniforms:Rt([an.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ze},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ze},clearcoatNormalScale:{value:new Ge(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ze},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ze},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ze},sheen:{value:0},sheenColor:{value:new Oe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ze},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ze},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ze},transmissionSamplerSize:{value:new Ge},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ze},attenuationDistance:{value:0},attenuationColor:{value:new Oe(0)},specularColor:{value:new Oe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ze},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ze},anisotropyVector:{value:new Ge},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ze}}]),vertexShader:Ne.meshphysical_vert,fragmentShader:Ne.meshphysical_frag};const Ba={r:0,b:0,g:0};function Wm(i,e,t,n,a,o,s){const r=new Oe(0);let l=o===!0?0:1,c,h,u=null,f=0,p=null;function g(m,d){let M=!1,_=d.isScene===!0?d.background:null;_&&_.isTexture&&(_=(d.backgroundBlurriness>0?t:e).get(_)),_===null?v(r,l):_&&_.isColor&&(v(_,1),M=!0);const w=i.xr.getEnvironmentBlendMode();w==="additive"?n.buffers.color.setClear(0,0,0,1,s):w==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,s),(i.autoClear||M)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),_&&(_.isCubeTexture||_.mapping===Mo)?(h===void 0&&(h=new Qt(new Bi(1,1,1),new Qn({name:"BackgroundCubeMaterial",uniforms:Di(an.backgroundCube.uniforms),vertexShader:an.backgroundCube.vertexShader,fragmentShader:an.backgroundCube.fragmentShader,side:Ut,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(P,k,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),a.update(h)),h.material.uniforms.envMap.value=_,h.material.uniforms.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=d.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=d.backgroundIntensity,h.material.toneMapped=qe.getTransfer(_.colorSpace)!==Qe,(u!==_||f!==_.version||p!==i.toneMapping)&&(h.material.needsUpdate=!0,u=_,f=_.version,p=i.toneMapping),h.layers.enableAll(),m.unshift(h,h.geometry,h.material,0,0,null)):_&&_.isTexture&&(c===void 0&&(c=new Qt(new la(2,2),new Qn({name:"BackgroundMaterial",uniforms:Di(an.background.uniforms),vertexShader:an.background.vertexShader,fragmentShader:an.background.fragmentShader,side:Dn,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),a.update(c)),c.material.uniforms.t2D.value=_,c.material.uniforms.backgroundIntensity.value=d.backgroundIntensity,c.material.toneMapped=qe.getTransfer(_.colorSpace)!==Qe,_.matrixAutoUpdate===!0&&_.updateMatrix(),c.material.uniforms.uvTransform.value.copy(_.matrix),(u!==_||f!==_.version||p!==i.toneMapping)&&(c.material.needsUpdate=!0,u=_,f=_.version,p=i.toneMapping),c.layers.enableAll(),m.unshift(c,c.geometry,c.material,0,0,null))}function v(m,d){m.getRGB(Ba,jc(i)),n.buffers.color.setClear(Ba.r,Ba.g,Ba.b,d,s)}return{getClearColor:function(){return r},setClearColor:function(m,d=1){r.set(m),l=d,v(r,l)},getClearAlpha:function(){return l},setClearAlpha:function(m){l=m,v(r,l)},render:g}}function qm(i,e,t,n){const a=i.getParameter(i.MAX_VERTEX_ATTRIBS),o=n.isWebGL2?null:e.get("OES_vertex_array_object"),s=n.isWebGL2||o!==null,r={},l=m(null);let c=l,h=!1;function u(E,C,D,j,F){let z=!1;if(s){const G=v(j,D,C);c!==G&&(c=G,p(c.object)),z=d(E,j,D,F),z&&M(E,j,D,F)}else{const G=C.wireframe===!0;(c.geometry!==j.id||c.program!==D.id||c.wireframe!==G)&&(c.geometry=j.id,c.program=D.id,c.wireframe=G,z=!0)}F!==null&&t.update(F,i.ELEMENT_ARRAY_BUFFER),(z||h)&&(h=!1,S(E,C,D,j),F!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(F).buffer))}function f(){return n.isWebGL2?i.createVertexArray():o.createVertexArrayOES()}function p(E){return n.isWebGL2?i.bindVertexArray(E):o.bindVertexArrayOES(E)}function g(E){return n.isWebGL2?i.deleteVertexArray(E):o.deleteVertexArrayOES(E)}function v(E,C,D){const j=D.wireframe===!0;let F=r[E.id];F===void 0&&(F={},r[E.id]=F);let z=F[C.id];z===void 0&&(z={},F[C.id]=z);let G=z[j];return G===void 0&&(G=m(f()),z[j]=G),G}function m(E){const C=[],D=[],j=[];for(let F=0;F<a;F++)C[F]=0,D[F]=0,j[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:D,attributeDivisors:j,object:E,attributes:{},index:null}}function d(E,C,D,j){const F=c.attributes,z=C.attributes;let G=0;const B=D.getAttributes();for(const q in B)if(B[q].location>=0){const Y=F[q];let W=z[q];if(W===void 0&&(q==="instanceMatrix"&&E.instanceMatrix&&(W=E.instanceMatrix),q==="instanceColor"&&E.instanceColor&&(W=E.instanceColor)),Y===void 0||Y.attribute!==W||W&&Y.data!==W.data)return!0;G++}return c.attributesNum!==G||c.index!==j}function M(E,C,D,j){const F={},z=C.attributes;let G=0;const B=D.getAttributes();for(const q in B)if(B[q].location>=0){let Y=z[q];Y===void 0&&(q==="instanceMatrix"&&E.instanceMatrix&&(Y=E.instanceMatrix),q==="instanceColor"&&E.instanceColor&&(Y=E.instanceColor));const W={};W.attribute=Y,Y&&Y.data&&(W.data=Y.data),F[q]=W,G++}c.attributes=F,c.attributesNum=G,c.index=j}function _(){const E=c.newAttributes;for(let C=0,D=E.length;C<D;C++)E[C]=0}function w(E){P(E,0)}function P(E,C){const D=c.newAttributes,j=c.enabledAttributes,F=c.attributeDivisors;D[E]=1,j[E]===0&&(i.enableVertexAttribArray(E),j[E]=1),F[E]!==C&&((n.isWebGL2?i:e.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](E,C),F[E]=C)}function k(){const E=c.newAttributes,C=c.enabledAttributes;for(let D=0,j=C.length;D<j;D++)C[D]!==E[D]&&(i.disableVertexAttribArray(D),C[D]=0)}function T(E,C,D,j,F,z,G){G===!0?i.vertexAttribIPointer(E,C,D,F,z):i.vertexAttribPointer(E,C,D,j,F,z)}function S(E,C,D,j){if(n.isWebGL2===!1&&(E.isInstancedMesh||j.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;_();const F=j.attributes,z=D.getAttributes(),G=C.defaultAttributeValues;for(const B in z){const q=z[B];if(q.location>=0){let I=F[B];if(I===void 0&&(B==="instanceMatrix"&&E.instanceMatrix&&(I=E.instanceMatrix),B==="instanceColor"&&E.instanceColor&&(I=E.instanceColor)),I!==void 0){const Y=I.normalized,W=I.itemSize,Q=t.get(I);if(Q===void 0)continue;const te=Q.buffer,se=Q.type,pe=Q.bytesPerElement,ee=n.isWebGL2===!0&&(se===i.INT||se===i.UNSIGNED_INT||I.gpuType===Pc);if(I.isInterleavedBufferAttribute){const ce=I.data,O=ce.stride,Ye=I.offset;if(ce.isInstancedInterleavedBuffer){for(let Me=0;Me<q.locationSize;Me++)P(q.location+Me,ce.meshPerAttribute);E.isInstancedMesh!==!0&&j._maxInstanceCount===void 0&&(j._maxInstanceCount=ce.meshPerAttribute*ce.count)}else for(let Me=0;Me<q.locationSize;Me++)w(q.location+Me);i.bindBuffer(i.ARRAY_BUFFER,te);for(let Me=0;Me<q.locationSize;Me++)T(q.location+Me,W/q.locationSize,se,Y,O*pe,(Ye+W/q.locationSize*Me)*pe,ee)}else{if(I.isInstancedBufferAttribute){for(let ce=0;ce<q.locationSize;ce++)P(q.location+ce,I.meshPerAttribute);E.isInstancedMesh!==!0&&j._maxInstanceCount===void 0&&(j._maxInstanceCount=I.meshPerAttribute*I.count)}else for(let ce=0;ce<q.locationSize;ce++)w(q.location+ce);i.bindBuffer(i.ARRAY_BUFFER,te);for(let ce=0;ce<q.locationSize;ce++)T(q.location+ce,W/q.locationSize,se,Y,W*pe,W/q.locationSize*ce*pe,ee)}}else if(G!==void 0){const Y=G[B];if(Y!==void 0)switch(Y.length){case 2:i.vertexAttrib2fv(q.location,Y);break;case 3:i.vertexAttrib3fv(q.location,Y);break;case 4:i.vertexAttrib4fv(q.location,Y);break;default:i.vertexAttrib1fv(q.location,Y)}}}}k()}function x(){L();for(const E in r){const C=r[E];for(const D in C){const j=C[D];for(const F in j)g(j[F].object),delete j[F];delete C[D]}delete r[E]}}function b(E){if(r[E.id]===void 0)return;const C=r[E.id];for(const D in C){const j=C[D];for(const F in j)g(j[F].object),delete j[F];delete C[D]}delete r[E.id]}function N(E){for(const C in r){const D=r[C];if(D[E.id]===void 0)continue;const j=D[E.id];for(const F in j)g(j[F].object),delete j[F];delete D[E.id]}}function L(){V(),h=!0,c!==l&&(c=l,p(c.object))}function V(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:u,reset:L,resetDefaultState:V,dispose:x,releaseStatesOfGeometry:b,releaseStatesOfProgram:N,initAttributes:_,enableAttribute:w,disableUnusedAttributes:k}}function Xm(i,e,t,n){const a=n.isWebGL2;let o;function s(h){o=h}function r(h,u){i.drawArrays(o,h,u),t.update(u,o,1)}function l(h,u,f){if(f===0)return;let p,g;if(a)p=i,g="drawArraysInstanced";else if(p=e.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",p===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[g](o,h,u,f),t.update(u,o,f)}function c(h,u,f){if(f===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<f;g++)this.render(h[g],u[g]);else{p.multiDrawArraysWEBGL(o,h,0,u,0,f);let g=0;for(let v=0;v<f;v++)g+=u[v];t.update(g,o,1)}}this.setMode=s,this.render=r,this.renderInstances=l,this.renderMultiDraw=c}function Ym(i,e,t){let n;function a(){if(n!==void 0)return n;if(e.has("EXT_texture_filter_anisotropic")===!0){const T=e.get("EXT_texture_filter_anisotropic");n=i.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function o(T){if(T==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const s=typeof WebGL2RenderingContext<"u"&&i.constructor.name==="WebGL2RenderingContext";let r=t.precision!==void 0?t.precision:"highp";const l=o(r);l!==r&&(console.warn("THREE.WebGLRenderer:",r,"not supported, using",l,"instead."),r=l);const c=s||e.has("WEBGL_draw_buffers"),h=t.logarithmicDepthBuffer===!0,u=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),f=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),p=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),v=i.getParameter(i.MAX_VERTEX_ATTRIBS),m=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),d=i.getParameter(i.MAX_VARYING_VECTORS),M=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),_=f>0,w=s||e.has("OES_texture_float"),P=_&&w,k=s?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:s,drawBuffers:c,getMaxAnisotropy:a,getMaxPrecision:o,precision:r,logarithmicDepthBuffer:h,maxTextures:u,maxVertexTextures:f,maxTextureSize:p,maxCubemapSize:g,maxAttributes:v,maxVertexUniforms:m,maxVaryings:d,maxFragmentUniforms:M,vertexTextures:_,floatFragmentTextures:w,floatVertexTextures:P,maxSamples:k}}function jm(i){const e=this;let t=null,n=0,a=!1,o=!1;const s=new Gn,r=new ze,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const p=u.length!==0||f||n!==0||a;return a=f,n=u.length,p},this.beginShadows=function(){o=!0,h(null)},this.endShadows=function(){o=!1},this.setGlobalState=function(u,f){t=h(u,f,0)},this.setState=function(u,f,p){const g=u.clippingPlanes,v=u.clipIntersection,m=u.clipShadows,d=i.get(u);if(!a||g===null||g.length===0||o&&!m)o?h(null):c();else{const M=o?0:n,_=M*4;let w=d.clippingState||null;l.value=w,w=h(g,f,_,p);for(let P=0;P!==_;++P)w[P]=t[P];d.clippingState=w,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,f,p,g){const v=u!==null?u.length:0;let m=null;if(v!==0){if(m=l.value,g!==!0||m===null){const d=p+v*4,M=f.matrixWorldInverse;r.getNormalMatrix(M),(m===null||m.length<d)&&(m=new Float32Array(d));for(let _=0,w=p;_!==v;++_,w+=4)s.copy(u[_]).applyMatrix4(M,r),s.normal.toArray(m,w),m[w+3]=s.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,m}}function $m(i){let e=new WeakMap;function t(s,r){return r===Ss?s.mapping=Ri:r===ys&&(s.mapping=Ci),s}function n(s){if(s&&s.isTexture){const r=s.mapping;if(r===Ss||r===ys)if(e.has(s)){const l=e.get(s).texture;return t(l,s.mapping)}else{const l=s.image;if(l&&l.height>0){const c=new rd(l.height/2);return c.fromEquirectangularTexture(i,s),e.set(s,c),s.addEventListener("dispose",a),t(c.texture,s.mapping)}else return null}}return s}function a(s){const r=s.target;r.removeEventListener("dispose",a);const l=e.get(r);l!==void 0&&(e.delete(r),l.dispose())}function o(){e=new WeakMap}return{get:n,dispose:o}}class Qs extends $c{constructor(e=-1,t=1,n=1,a=-1,o=.1,s=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=a,this.near=o,this.far=s,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,a,o,s){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=a,this.view.width=o,this.view.height=s,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,a=(this.top+this.bottom)/2;let o=n-e,s=n+e,r=a+t,l=a-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;o+=c*this.view.offsetX,s=o+c*this.view.width,r-=h*this.view.offsetY,l=r-h*this.view.height}this.projectionMatrix.makeOrthographic(o,s,r,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const bi=4,yl=[.125,.215,.35,.446,.526,.582],qn=20,as=new Qs,El=new Oe;let os=null,ss=0,rs=0;const Hn=(1+Math.sqrt(5))/2,_i=1/Hn,Tl=[new X(1,1,1),new X(-1,1,1),new X(1,1,-1),new X(-1,1,-1),new X(0,Hn,_i),new X(0,Hn,-_i),new X(_i,0,Hn),new X(-_i,0,Hn),new X(Hn,_i,0),new X(-Hn,_i,0)];class kl{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,a=100){os=this._renderer.getRenderTarget(),ss=this._renderer.getActiveCubeFace(),rs=this._renderer.getActiveMipmapLevel(),this._setSize(256);const o=this._allocateTargets();return o.depthBuffer=!0,this._sceneToCubeUV(e,n,a,o),t>0&&this._blur(o,0,0,t),this._applyPMREM(o),this._cleanup(o),o}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Rl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Pl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(os,ss,rs),e.scissorTest=!1,Ga(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ri||e.mapping===Ci?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),os=this._renderer.getRenderTarget(),ss=this._renderer.getActiveCubeFace(),rs=this._renderer.getActiveMipmapLevel();const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Ot,minFilter:Ot,generateMipmaps:!1,type:sa,format:Zt,colorSpace:xn,depthBuffer:!1},a=Al(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Al(e,t,n);const{_lodMax:o}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Km(o)),this._blurMaterial=Zm(o,e,t)}return a}_compileMaterial(e){const t=new Qt(this._lodPlanes[0],e);this._renderer.compile(t,as)}_sceneToCubeUV(e,t,n,a){const r=new $t(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,f=h.toneMapping;h.getClearColor(El),h.toneMapping=Rn,h.autoClear=!1;const p=new Zs({name:"PMREM.Background",side:Ut,depthWrite:!1,depthTest:!1}),g=new Qt(new Bi,p);let v=!1;const m=e.background;m?m.isColor&&(p.color.copy(m),e.background=null,v=!0):(p.color.copy(El),v=!0);for(let d=0;d<6;d++){const M=d%3;M===0?(r.up.set(0,l[d],0),r.lookAt(c[d],0,0)):M===1?(r.up.set(0,0,l[d]),r.lookAt(0,c[d],0)):(r.up.set(0,l[d],0),r.lookAt(0,0,c[d]));const _=this._cubeSize;Ga(a,M*_,d>2?_:0,_,_),h.setRenderTarget(a),v&&h.render(g,r),h.render(e,r)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=f,h.autoClear=u,e.background=m}_textureToCubeUV(e,t){const n=this._renderer,a=e.mapping===Ri||e.mapping===Ci;a?(this._cubemapMaterial===null&&(this._cubemapMaterial=Rl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Pl());const o=a?this._cubemapMaterial:this._equirectMaterial,s=new Qt(this._lodPlanes[0],o),r=o.uniforms;r.envMap.value=e;const l=this._cubeSize;Ga(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(s,as)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;for(let a=1;a<this._lodPlanes.length;a++){const o=Math.sqrt(this._sigmas[a]*this._sigmas[a]-this._sigmas[a-1]*this._sigmas[a-1]),s=Tl[(a-1)%Tl.length];this._blur(e,a-1,a,o,s)}t.autoClear=n}_blur(e,t,n,a,o){const s=this._pingPongRenderTarget;this._halfBlur(e,s,t,n,a,"latitudinal",o),this._halfBlur(s,e,n,n,a,"longitudinal",o)}_halfBlur(e,t,n,a,o,s,r){const l=this._renderer,c=this._blurMaterial;s!=="latitudinal"&&s!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new Qt(this._lodPlanes[a],c),f=c.uniforms,p=this._sizeLods[n]-1,g=isFinite(o)?Math.PI/(2*p):2*Math.PI/(2*qn-1),v=o/g,m=isFinite(o)?1+Math.floor(h*v):qn;m>qn&&console.warn(`sigmaRadians, ${o}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${qn}`);const d=[];let M=0;for(let T=0;T<qn;++T){const S=T/v,x=Math.exp(-S*S/2);d.push(x),T===0?M+=x:T<m&&(M+=2*x)}for(let T=0;T<d.length;T++)d[T]=d[T]/M;f.envMap.value=e.texture,f.samples.value=m,f.weights.value=d,f.latitudinal.value=s==="latitudinal",r&&(f.poleAxis.value=r);const{_lodMax:_}=this;f.dTheta.value=g,f.mipInt.value=_-n;const w=this._sizeLods[a],P=3*w*(a>_-bi?a-_+bi:0),k=4*(this._cubeSize-w);Ga(t,P,k,3*w,2*w),l.setRenderTarget(t),l.render(u,as)}}function Km(i){const e=[],t=[],n=[];let a=i;const o=i-bi+1+yl.length;for(let s=0;s<o;s++){const r=Math.pow(2,a);t.push(r);let l=1/r;s>i-bi?l=yl[s-i+bi-1]:s===0&&(l=0),n.push(l);const c=1/(r-2),h=-c,u=1+c,f=[h,h,u,h,u,u,h,h,u,u,h,u],p=6,g=6,v=3,m=2,d=1,M=new Float32Array(v*g*p),_=new Float32Array(m*g*p),w=new Float32Array(d*g*p);for(let k=0;k<p;k++){const T=k%3*2/3-1,S=k>2?0:-1,x=[T,S,0,T+2/3,S,0,T+2/3,S+1,0,T,S,0,T+2/3,S+1,0,T,S+1,0];M.set(x,v*g*k),_.set(f,m*g*k);const b=[k,k,k,k,k,k];w.set(b,d*g*k)}const P=new ti;P.setAttribute("position",new Dt(M,v)),P.setAttribute("uv",new Dt(_,m)),P.setAttribute("faceIndex",new Dt(w,d)),e.push(P),a>bi&&a--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Al(i,e,t){const n=new Jn(i,e,t);return n.texture.mapping=Mo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ga(i,e,t,n,a){i.viewport.set(e,t,n,a),i.scissor.set(e,t,n,a)}function Zm(i,e,t){const n=new Float32Array(qn),a=new X(0,1,0);return new Qn({name:"SphericalGaussianBlur",defines:{n:qn,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:a}},vertexShader:er(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function Pl(){return new Qn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:er(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function Rl(){return new Qn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:er(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function er(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Jm(i){let e=new WeakMap,t=null;function n(r){if(r&&r.isTexture){const l=r.mapping,c=l===Ss||l===ys,h=l===Ri||l===Ci;if(c||h)if(r.isRenderTargetTexture&&r.needsPMREMUpdate===!0){r.needsPMREMUpdate=!1;let u=e.get(r);return t===null&&(t=new kl(i)),u=c?t.fromEquirectangular(r,u):t.fromCubemap(r,u),e.set(r,u),u.texture}else{if(e.has(r))return e.get(r).texture;{const u=r.image;if(c&&u&&u.height>0||h&&u&&a(u)){t===null&&(t=new kl(i));const f=c?t.fromEquirectangular(r):t.fromCubemap(r);return e.set(r,f),r.addEventListener("dispose",o),f.texture}else return null}}}return r}function a(r){let l=0;const c=6;for(let h=0;h<c;h++)r[h]!==void 0&&l++;return l===c}function o(r){const l=r.target;l.removeEventListener("dispose",o);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function s(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:s}}function Qm(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let a;switch(n){case"WEBGL_depth_texture":a=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":a=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":a=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":a=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:a=i.getExtension(n)}return e[n]=a,a}return{has:function(n){return t(n)!==null},init:function(n){n.isWebGL2?(t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance")):(t("WEBGL_depth_texture"),t("OES_texture_float"),t("OES_texture_half_float"),t("OES_texture_half_float_linear"),t("OES_standard_derivatives"),t("OES_element_index_uint"),t("OES_vertex_array_object"),t("ANGLE_instanced_arrays")),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture")},get:function(n){const a=t(n);return a===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),a}}}function eg(i,e,t,n){const a={},o=new WeakMap;function s(u){const f=u.target;f.index!==null&&e.remove(f.index);for(const g in f.attributes)e.remove(f.attributes[g]);for(const g in f.morphAttributes){const v=f.morphAttributes[g];for(let m=0,d=v.length;m<d;m++)e.remove(v[m])}f.removeEventListener("dispose",s),delete a[f.id];const p=o.get(f);p&&(e.remove(p),o.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function r(u,f){return a[f.id]===!0||(f.addEventListener("dispose",s),a[f.id]=!0,t.memory.geometries++),f}function l(u){const f=u.attributes;for(const g in f)e.update(f[g],i.ARRAY_BUFFER);const p=u.morphAttributes;for(const g in p){const v=p[g];for(let m=0,d=v.length;m<d;m++)e.update(v[m],i.ARRAY_BUFFER)}}function c(u){const f=[],p=u.index,g=u.attributes.position;let v=0;if(p!==null){const M=p.array;v=p.version;for(let _=0,w=M.length;_<w;_+=3){const P=M[_+0],k=M[_+1],T=M[_+2];f.push(P,k,k,T,T,P)}}else if(g!==void 0){const M=g.array;v=g.version;for(let _=0,w=M.length/3-1;_<w;_+=3){const P=_+0,k=_+1,T=_+2;f.push(P,k,k,T,T,P)}}else return;const m=new(Bc(f)?Yc:Xc)(f,1);m.version=v;const d=o.get(u);d&&e.remove(d),o.set(u,m)}function h(u){const f=o.get(u);if(f){const p=u.index;p!==null&&f.version<p.version&&c(u)}else c(u);return o.get(u)}return{get:r,update:l,getWireframeAttribute:h}}function tg(i,e,t,n){const a=n.isWebGL2;let o;function s(p){o=p}let r,l;function c(p){r=p.type,l=p.bytesPerElement}function h(p,g){i.drawElements(o,g,r,p*l),t.update(g,o,1)}function u(p,g,v){if(v===0)return;let m,d;if(a)m=i,d="drawElementsInstanced";else if(m=e.get("ANGLE_instanced_arrays"),d="drawElementsInstancedANGLE",m===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[d](o,g,r,p*l,v),t.update(g,o,v)}function f(p,g,v){if(v===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let d=0;d<v;d++)this.render(p[d]/l,g[d]);else{m.multiDrawElementsWEBGL(o,g,0,r,p,0,v);let d=0;for(let M=0;M<v;M++)d+=g[M];t.update(d,o,1)}}this.setMode=s,this.setIndex=c,this.render=h,this.renderInstances=u,this.renderMultiDraw=f}function ng(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(o,s,r){switch(t.calls++,s){case i.TRIANGLES:t.triangles+=r*(o/3);break;case i.LINES:t.lines+=r*(o/2);break;case i.LINE_STRIP:t.lines+=r*(o-1);break;case i.LINE_LOOP:t.lines+=r*o;break;case i.POINTS:t.points+=r*o;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",s);break}}function a(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:a,update:n}}function ig(i,e){return i[0]-e[0]}function ag(i,e){return Math.abs(e[1])-Math.abs(i[1])}function og(i,e,t){const n={},a=new Float32Array(8),o=new WeakMap,s=new lt,r=[];for(let c=0;c<8;c++)r[c]=[c,0];function l(c,h,u){const f=c.morphTargetInfluences;if(e.isWebGL2===!0){const g=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,v=g!==void 0?g.length:0;let m=o.get(h);if(m===void 0||m.count!==v){let C=function(){V.dispose(),o.delete(h),h.removeEventListener("dispose",C)};var p=C;m!==void 0&&m.texture.dispose();const _=h.morphAttributes.position!==void 0,w=h.morphAttributes.normal!==void 0,P=h.morphAttributes.color!==void 0,k=h.morphAttributes.position||[],T=h.morphAttributes.normal||[],S=h.morphAttributes.color||[];let x=0;_===!0&&(x=1),w===!0&&(x=2),P===!0&&(x=3);let b=h.attributes.position.count*x,N=1;b>e.maxTextureSize&&(N=Math.ceil(b/e.maxTextureSize),b=e.maxTextureSize);const L=new Float32Array(b*N*4*v),V=new Vc(L,b,N,v);V.type=An,V.needsUpdate=!0;const E=x*4;for(let D=0;D<v;D++){const j=k[D],F=T[D],z=S[D],G=b*N*4*D;for(let B=0;B<j.count;B++){const q=B*E;_===!0&&(s.fromBufferAttribute(j,B),L[G+q+0]=s.x,L[G+q+1]=s.y,L[G+q+2]=s.z,L[G+q+3]=0),w===!0&&(s.fromBufferAttribute(F,B),L[G+q+4]=s.x,L[G+q+5]=s.y,L[G+q+6]=s.z,L[G+q+7]=0),P===!0&&(s.fromBufferAttribute(z,B),L[G+q+8]=s.x,L[G+q+9]=s.y,L[G+q+10]=s.z,L[G+q+11]=z.itemSize===4?s.w:1)}}m={count:v,texture:V,size:new Ge(b,N)},o.set(h,m),h.addEventListener("dispose",C)}let d=0;for(let _=0;_<f.length;_++)d+=f[_];const M=h.morphTargetsRelative?1:1-d;u.getUniforms().setValue(i,"morphTargetBaseInfluence",M),u.getUniforms().setValue(i,"morphTargetInfluences",f),u.getUniforms().setValue(i,"morphTargetsTexture",m.texture,t),u.getUniforms().setValue(i,"morphTargetsTextureSize",m.size)}else{const g=f===void 0?0:f.length;let v=n[h.id];if(v===void 0||v.length!==g){v=[];for(let w=0;w<g;w++)v[w]=[w,0];n[h.id]=v}for(let w=0;w<g;w++){const P=v[w];P[0]=w,P[1]=f[w]}v.sort(ag);for(let w=0;w<8;w++)w<g&&v[w][1]?(r[w][0]=v[w][0],r[w][1]=v[w][1]):(r[w][0]=Number.MAX_SAFE_INTEGER,r[w][1]=0);r.sort(ig);const m=h.morphAttributes.position,d=h.morphAttributes.normal;let M=0;for(let w=0;w<8;w++){const P=r[w],k=P[0],T=P[1];k!==Number.MAX_SAFE_INTEGER&&T?(m&&h.getAttribute("morphTarget"+w)!==m[k]&&h.setAttribute("morphTarget"+w,m[k]),d&&h.getAttribute("morphNormal"+w)!==d[k]&&h.setAttribute("morphNormal"+w,d[k]),a[w]=T,M+=T):(m&&h.hasAttribute("morphTarget"+w)===!0&&h.deleteAttribute("morphTarget"+w),d&&h.hasAttribute("morphNormal"+w)===!0&&h.deleteAttribute("morphNormal"+w),a[w]=0)}const _=h.morphTargetsRelative?1:1-M;u.getUniforms().setValue(i,"morphTargetBaseInfluence",_),u.getUniforms().setValue(i,"morphTargetInfluences",a)}}return{update:l}}function sg(i,e,t,n){let a=new WeakMap;function o(l){const c=n.render.frame,h=l.geometry,u=e.get(l,h);if(a.get(u)!==c&&(e.update(u),a.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",r)===!1&&l.addEventListener("dispose",r),a.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),a.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;a.get(f)!==c&&(f.update(),a.set(f,c))}return u}function s(){a=new WeakMap}function r(l){const c=l.target;c.removeEventListener("dispose",r),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:o,dispose:s}}class Jc extends Nt{constructor(e,t,n,a,o,s,r,l,c,h){if(h=h!==void 0?h:$n,h!==$n&&h!==Ni)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===$n&&(n=kn),n===void 0&&h===Ni&&(n=jn),super(null,a,o,s,r,l,h,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=r!==void 0?r:Mt,this.minFilter=l!==void 0?l:Mt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const Qc=new Nt,eh=new Jc(1,1);eh.compareFunction=Oc;const th=new Vc,nh=new Wf,ih=new Kc,Cl=[],Ll=[],Nl=new Float32Array(16),Dl=new Float32Array(9),Ul=new Float32Array(4);function Gi(i,e,t){const n=i[0];if(n<=0||n>0)return i;const a=e*t;let o=Cl[a];if(o===void 0&&(o=new Float32Array(a),Cl[a]=o),e!==0){n.toArray(o,0);for(let s=1,r=0;s!==e;++s)r+=t,i[s].toArray(o,r)}return o}function ut(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function ft(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function So(i,e){let t=Ll[e];t===void 0&&(t=new Int32Array(e),Ll[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function rg(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function lg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ut(t,e))return;i.uniform2fv(this.addr,e),ft(t,e)}}function cg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(ut(t,e))return;i.uniform3fv(this.addr,e),ft(t,e)}}function hg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ut(t,e))return;i.uniform4fv(this.addr,e),ft(t,e)}}function ug(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(ut(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),ft(t,e)}else{if(ut(t,n))return;Ul.set(n),i.uniformMatrix2fv(this.addr,!1,Ul),ft(t,n)}}function fg(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(ut(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),ft(t,e)}else{if(ut(t,n))return;Dl.set(n),i.uniformMatrix3fv(this.addr,!1,Dl),ft(t,n)}}function dg(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(ut(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),ft(t,e)}else{if(ut(t,n))return;Nl.set(n),i.uniformMatrix4fv(this.addr,!1,Nl),ft(t,n)}}function pg(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function mg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ut(t,e))return;i.uniform2iv(this.addr,e),ft(t,e)}}function gg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(ut(t,e))return;i.uniform3iv(this.addr,e),ft(t,e)}}function vg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ut(t,e))return;i.uniform4iv(this.addr,e),ft(t,e)}}function _g(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function xg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ut(t,e))return;i.uniform2uiv(this.addr,e),ft(t,e)}}function Mg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(ut(t,e))return;i.uniform3uiv(this.addr,e),ft(t,e)}}function wg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ut(t,e))return;i.uniform4uiv(this.addr,e),ft(t,e)}}function bg(i,e,t){const n=this.cache,a=t.allocateTextureUnit();n[0]!==a&&(i.uniform1i(this.addr,a),n[0]=a);const o=this.type===i.SAMPLER_2D_SHADOW?eh:Qc;t.setTexture2D(e||o,a)}function Sg(i,e,t){const n=this.cache,a=t.allocateTextureUnit();n[0]!==a&&(i.uniform1i(this.addr,a),n[0]=a),t.setTexture3D(e||nh,a)}function yg(i,e,t){const n=this.cache,a=t.allocateTextureUnit();n[0]!==a&&(i.uniform1i(this.addr,a),n[0]=a),t.setTextureCube(e||ih,a)}function Eg(i,e,t){const n=this.cache,a=t.allocateTextureUnit();n[0]!==a&&(i.uniform1i(this.addr,a),n[0]=a),t.setTexture2DArray(e||th,a)}function Tg(i){switch(i){case 5126:return rg;case 35664:return lg;case 35665:return cg;case 35666:return hg;case 35674:return ug;case 35675:return fg;case 35676:return dg;case 5124:case 35670:return pg;case 35667:case 35671:return mg;case 35668:case 35672:return gg;case 35669:case 35673:return vg;case 5125:return _g;case 36294:return xg;case 36295:return Mg;case 36296:return wg;case 35678:case 36198:case 36298:case 36306:case 35682:return bg;case 35679:case 36299:case 36307:return Sg;case 35680:case 36300:case 36308:case 36293:return yg;case 36289:case 36303:case 36311:case 36292:return Eg}}function kg(i,e){i.uniform1fv(this.addr,e)}function Ag(i,e){const t=Gi(e,this.size,2);i.uniform2fv(this.addr,t)}function Pg(i,e){const t=Gi(e,this.size,3);i.uniform3fv(this.addr,t)}function Rg(i,e){const t=Gi(e,this.size,4);i.uniform4fv(this.addr,t)}function Cg(i,e){const t=Gi(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Lg(i,e){const t=Gi(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Ng(i,e){const t=Gi(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Dg(i,e){i.uniform1iv(this.addr,e)}function Ug(i,e){i.uniform2iv(this.addr,e)}function Ig(i,e){i.uniform3iv(this.addr,e)}function Fg(i,e){i.uniform4iv(this.addr,e)}function zg(i,e){i.uniform1uiv(this.addr,e)}function Og(i,e){i.uniform2uiv(this.addr,e)}function Bg(i,e){i.uniform3uiv(this.addr,e)}function Gg(i,e){i.uniform4uiv(this.addr,e)}function Hg(i,e,t){const n=this.cache,a=e.length,o=So(t,a);ut(n,o)||(i.uniform1iv(this.addr,o),ft(n,o));for(let s=0;s!==a;++s)t.setTexture2D(e[s]||Qc,o[s])}function Vg(i,e,t){const n=this.cache,a=e.length,o=So(t,a);ut(n,o)||(i.uniform1iv(this.addr,o),ft(n,o));for(let s=0;s!==a;++s)t.setTexture3D(e[s]||nh,o[s])}function Wg(i,e,t){const n=this.cache,a=e.length,o=So(t,a);ut(n,o)||(i.uniform1iv(this.addr,o),ft(n,o));for(let s=0;s!==a;++s)t.setTextureCube(e[s]||ih,o[s])}function qg(i,e,t){const n=this.cache,a=e.length,o=So(t,a);ut(n,o)||(i.uniform1iv(this.addr,o),ft(n,o));for(let s=0;s!==a;++s)t.setTexture2DArray(e[s]||th,o[s])}function Xg(i){switch(i){case 5126:return kg;case 35664:return Ag;case 35665:return Pg;case 35666:return Rg;case 35674:return Cg;case 35675:return Lg;case 35676:return Ng;case 5124:case 35670:return Dg;case 35667:case 35671:return Ug;case 35668:case 35672:return Ig;case 35669:case 35673:return Fg;case 5125:return zg;case 36294:return Og;case 36295:return Bg;case 36296:return Gg;case 35678:case 36198:case 36298:case 36306:case 35682:return Hg;case 35679:case 36299:case 36307:return Vg;case 35680:case 36300:case 36308:case 36293:return Wg;case 36289:case 36303:case 36311:case 36292:return qg}}class Yg{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Tg(t.type)}}class jg{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Xg(t.type)}}class $g{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const a=this.seq;for(let o=0,s=a.length;o!==s;++o){const r=a[o];r.setValue(e,t[r.id],n)}}}const ls=/(\w+)(\])?(\[|\.)?/g;function Il(i,e){i.seq.push(e),i.map[e.id]=e}function Kg(i,e,t){const n=i.name,a=n.length;for(ls.lastIndex=0;;){const o=ls.exec(n),s=ls.lastIndex;let r=o[1];const l=o[2]==="]",c=o[3];if(l&&(r=r|0),c===void 0||c==="["&&s+2===a){Il(t,c===void 0?new Yg(r,i,e):new jg(r,i,e));break}else{let u=t.map[r];u===void 0&&(u=new $g(r),Il(t,u)),t=u}}}class Qa{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const o=e.getActiveUniform(t,a),s=e.getUniformLocation(t,o.name);Kg(o,s,this)}}setValue(e,t,n,a){const o=this.map[t];o!==void 0&&o.setValue(e,n,a)}setOptional(e,t,n){const a=t[n];a!==void 0&&this.setValue(e,n,a)}static upload(e,t,n,a){for(let o=0,s=t.length;o!==s;++o){const r=t[o],l=n[r.id];l.needsUpdate!==!1&&r.setValue(e,l.value,a)}}static seqWithValue(e,t){const n=[];for(let a=0,o=e.length;a!==o;++a){const s=e[a];s.id in t&&n.push(s)}return n}}function Fl(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const Zg=37297;let Jg=0;function Qg(i,e){const t=i.split(`
`),n=[],a=Math.max(e-6,0),o=Math.min(e+6,t.length);for(let s=a;s<o;s++){const r=s+1;n.push(`${r===e?">":" "} ${r}: ${t[s]}`)}return n.join(`
`)}function e0(i){const e=qe.getPrimaries(qe.workingColorSpace),t=qe.getPrimaries(i);let n;switch(e===t?n="":e===co&&t===lo?n="LinearDisplayP3ToLinearSRGB":e===lo&&t===co&&(n="LinearSRGBToLinearDisplayP3"),i){case xn:case wo:return[n,"LinearTransferOETF"];case vt:case Ys:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function zl(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),a=i.getShaderInfoLog(e).trim();if(n&&a==="")return"";const o=/ERROR: 0:(\d+)/.exec(a);if(o){const s=parseInt(o[1]);return t.toUpperCase()+`

`+a+`

`+Qg(i.getShaderSource(e),s)}else return a}function t0(i,e){const t=e0(e);return`vec4 ${i}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function n0(i,e){let t;switch(e){case ef:t="Linear";break;case tf:t="Reinhard";break;case nf:t="OptimizedCineon";break;case af:t="ACESFilmic";break;case sf:t="AgX";break;case of:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function i0(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Si).join(`
`)}function a0(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(Si).join(`
`)}function o0(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function s0(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let a=0;a<n;a++){const o=i.getActiveAttrib(e,a),s=o.name;let r=1;o.type===i.FLOAT_MAT2&&(r=2),o.type===i.FLOAT_MAT3&&(r=3),o.type===i.FLOAT_MAT4&&(r=4),t[s]={type:o.type,location:i.getAttribLocation(e,s),locationSize:r}}return t}function Si(i){return i!==""}function Ol(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Bl(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const r0=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ps(i){return i.replace(r0,c0)}const l0=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function c0(i,e){let t=Ne[e];if(t===void 0){const n=l0.get(e);if(n!==void 0)t=Ne[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Ps(t)}const h0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Gl(i){return i.replace(h0,u0)}function u0(i,e,t,n){let a="";for(let o=parseInt(e);o<parseInt(t);o++)a+=n.replace(/\[\s*i\s*\]/g,"[ "+o+" ]").replace(/UNROLLED_LOOP_INDEX/g,o);return a}function Hl(i){let e="precision "+i.precision+` float;
precision `+i.precision+" int;";return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function f0(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Tc?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===Au?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===tn&&(e="SHADOWMAP_TYPE_VSM"),e}function d0(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Ri:case Ci:e="ENVMAP_TYPE_CUBE";break;case Mo:e="ENVMAP_TYPE_CUBE_UV";break}return e}function p0(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Ci:e="ENVMAP_MODE_REFRACTION";break}return e}function m0(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case kc:e="ENVMAP_BLENDING_MULTIPLY";break;case Ju:e="ENVMAP_BLENDING_MIX";break;case Qu:e="ENVMAP_BLENDING_ADD";break}return e}function g0(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function v0(i,e,t,n){const a=i.getContext(),o=t.defines;let s=t.vertexShader,r=t.fragmentShader;const l=f0(t),c=d0(t),h=p0(t),u=m0(t),f=g0(t),p=t.isWebGL2?"":i0(t),g=a0(t),v=o0(o),m=a.createProgram();let d,M,_=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(d=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v].filter(Si).join(`
`),d.length>0&&(d+=`
`),M=[p,"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v].filter(Si).join(`
`),M.length>0&&(M+=`
`)):(d=[Hl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors&&t.isWebGL2?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Si).join(`
`),M=[p,Hl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Rn?"#define TONE_MAPPING":"",t.toneMapping!==Rn?Ne.tonemapping_pars_fragment:"",t.toneMapping!==Rn?n0("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ne.colorspace_pars_fragment,t0("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Si).join(`
`)),s=Ps(s),s=Ol(s,t),s=Bl(s,t),r=Ps(r),r=Ol(r,t),r=Bl(r,t),s=Gl(s),r=Gl(r),t.isWebGL2&&t.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,d=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+d,M=["precision mediump sampler2DArray;","#define varying in",t.glslVersion===sl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===sl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+M);const w=_+d+s,P=_+M+r,k=Fl(a,a.VERTEX_SHADER,w),T=Fl(a,a.FRAGMENT_SHADER,P);a.attachShader(m,k),a.attachShader(m,T),t.index0AttributeName!==void 0?a.bindAttribLocation(m,0,t.index0AttributeName):t.morphTargets===!0&&a.bindAttribLocation(m,0,"position"),a.linkProgram(m);function S(L){if(i.debug.checkShaderErrors){const V=a.getProgramInfoLog(m).trim(),E=a.getShaderInfoLog(k).trim(),C=a.getShaderInfoLog(T).trim();let D=!0,j=!0;if(a.getProgramParameter(m,a.LINK_STATUS)===!1)if(D=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(a,m,k,T);else{const F=zl(a,k,"vertex"),z=zl(a,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+a.getError()+" - VALIDATE_STATUS "+a.getProgramParameter(m,a.VALIDATE_STATUS)+`

Program Info Log: `+V+`
`+F+`
`+z)}else V!==""?console.warn("THREE.WebGLProgram: Program Info Log:",V):(E===""||C==="")&&(j=!1);j&&(L.diagnostics={runnable:D,programLog:V,vertexShader:{log:E,prefix:d},fragmentShader:{log:C,prefix:M}})}a.deleteShader(k),a.deleteShader(T),x=new Qa(a,m),b=s0(a,m)}let x;this.getUniforms=function(){return x===void 0&&S(this),x};let b;this.getAttributes=function(){return b===void 0&&S(this),b};let N=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return N===!1&&(N=a.getProgramParameter(m,Zg)),N},this.destroy=function(){n.releaseStatesOfProgram(this),a.deleteProgram(m),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Jg++,this.cacheKey=e,this.usedTimes=1,this.program=m,this.vertexShader=k,this.fragmentShader=T,this}let _0=0;class x0{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,a=this._getShaderStage(t),o=this._getShaderStage(n),s=this._getShaderCacheForMaterial(e);return s.has(a)===!1&&(s.add(a),a.usedTimes++),s.has(o)===!1&&(s.add(o),o.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new M0(e),t.set(e,n)),n}}class M0{constructor(e){this.id=_0++,this.code=e,this.usedTimes=0}}function w0(i,e,t,n,a,o,s){const r=new Ks,l=new x0,c=[],h=a.isWebGL2,u=a.logarithmicDepthBuffer,f=a.vertexTextures;let p=a.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(x){return x===0?"uv":`uv${x}`}function m(x,b,N,L,V){const E=L.fog,C=V.geometry,D=x.isMeshStandardMaterial?L.environment:null,j=(x.isMeshStandardMaterial?t:e).get(x.envMap||D),F=j&&j.mapping===Mo?j.image.height:null,z=g[x.type];x.precision!==null&&(p=a.getMaxPrecision(x.precision),p!==x.precision&&console.warn("THREE.WebGLProgram.getParameters:",x.precision,"not supported, using",p,"instead."));const G=C.morphAttributes.position||C.morphAttributes.normal||C.morphAttributes.color,B=G!==void 0?G.length:0;let q=0;C.morphAttributes.position!==void 0&&(q=1),C.morphAttributes.normal!==void 0&&(q=2),C.morphAttributes.color!==void 0&&(q=3);let I,Y,W,Q;if(z){const kt=an[z];I=kt.vertexShader,Y=kt.fragmentShader}else I=x.vertexShader,Y=x.fragmentShader,l.update(x),W=l.getVertexShaderID(x),Q=l.getFragmentShaderID(x);const te=i.getRenderTarget(),se=V.isInstancedMesh===!0,pe=V.isBatchedMesh===!0,ee=!!x.map,ce=!!x.matcap,O=!!j,Ye=!!x.aoMap,Me=!!x.lightMap,ke=!!x.bumpMap,ve=!!x.normalMap,Ze=!!x.displacementMap,Re=!!x.emissiveMap,R=!!x.metalnessMap,y=!!x.roughnessMap,K=x.anisotropy>0,ae=x.clearcoat>0,ie=x.iridescence>0,oe=x.sheen>0,_e=x.transmission>0,fe=K&&!!x.anisotropyMap,me=ae&&!!x.clearcoatMap,ye=ae&&!!x.clearcoatNormalMap,De=ae&&!!x.clearcoatRoughnessMap,ne=ie&&!!x.iridescenceMap,Ve=ie&&!!x.iridescenceThicknessMap,Be=oe&&!!x.sheenColorMap,Ae=oe&&!!x.sheenRoughnessMap,we=!!x.specularMap,ge=!!x.specularColorMap,Le=!!x.specularIntensityMap,He=_e&&!!x.transmissionMap,it=_e&&!!x.thicknessMap,Ie=!!x.gradientMap,re=!!x.alphaMap,U=x.alphaTest>0,he=!!x.alphaHash,ue=!!x.extensions,Ee=!!C.attributes.uv1,be=!!C.attributes.uv2,je=!!C.attributes.uv3;let $e=Rn;return x.toneMapped&&(te===null||te.isXRRenderTarget===!0)&&($e=i.toneMapping),{isWebGL2:h,shaderID:z,shaderType:x.type,shaderName:x.name,vertexShader:I,fragmentShader:Y,defines:x.defines,customVertexShaderID:W,customFragmentShaderID:Q,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:p,batching:pe,instancing:se,instancingColor:se&&V.instanceColor!==null,supportsVertexTextures:f,outputColorSpace:te===null?i.outputColorSpace:te.isXRRenderTarget===!0?te.texture.colorSpace:xn,map:ee,matcap:ce,envMap:O,envMapMode:O&&j.mapping,envMapCubeUVHeight:F,aoMap:Ye,lightMap:Me,bumpMap:ke,normalMap:ve,displacementMap:f&&Ze,emissiveMap:Re,normalMapObjectSpace:ve&&x.normalMapType===vf,normalMapTangentSpace:ve&&x.normalMapType===zc,metalnessMap:R,roughnessMap:y,anisotropy:K,anisotropyMap:fe,clearcoat:ae,clearcoatMap:me,clearcoatNormalMap:ye,clearcoatRoughnessMap:De,iridescence:ie,iridescenceMap:ne,iridescenceThicknessMap:Ve,sheen:oe,sheenColorMap:Be,sheenRoughnessMap:Ae,specularMap:we,specularColorMap:ge,specularIntensityMap:Le,transmission:_e,transmissionMap:He,thicknessMap:it,gradientMap:Ie,opaque:x.transparent===!1&&x.blending===Ti,alphaMap:re,alphaTest:U,alphaHash:he,combine:x.combine,mapUv:ee&&v(x.map.channel),aoMapUv:Ye&&v(x.aoMap.channel),lightMapUv:Me&&v(x.lightMap.channel),bumpMapUv:ke&&v(x.bumpMap.channel),normalMapUv:ve&&v(x.normalMap.channel),displacementMapUv:Ze&&v(x.displacementMap.channel),emissiveMapUv:Re&&v(x.emissiveMap.channel),metalnessMapUv:R&&v(x.metalnessMap.channel),roughnessMapUv:y&&v(x.roughnessMap.channel),anisotropyMapUv:fe&&v(x.anisotropyMap.channel),clearcoatMapUv:me&&v(x.clearcoatMap.channel),clearcoatNormalMapUv:ye&&v(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:De&&v(x.clearcoatRoughnessMap.channel),iridescenceMapUv:ne&&v(x.iridescenceMap.channel),iridescenceThicknessMapUv:Ve&&v(x.iridescenceThicknessMap.channel),sheenColorMapUv:Be&&v(x.sheenColorMap.channel),sheenRoughnessMapUv:Ae&&v(x.sheenRoughnessMap.channel),specularMapUv:we&&v(x.specularMap.channel),specularColorMapUv:ge&&v(x.specularColorMap.channel),specularIntensityMapUv:Le&&v(x.specularIntensityMap.channel),transmissionMapUv:He&&v(x.transmissionMap.channel),thicknessMapUv:it&&v(x.thicknessMap.channel),alphaMapUv:re&&v(x.alphaMap.channel),vertexTangents:!!C.attributes.tangent&&(ve||K),vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!C.attributes.color&&C.attributes.color.itemSize===4,vertexUv1s:Ee,vertexUv2s:be,vertexUv3s:je,pointsUvs:V.isPoints===!0&&!!C.attributes.uv&&(ee||re),fog:!!E,useFog:x.fog===!0,fogExp2:E&&E.isFogExp2,flatShading:x.flatShading===!0,sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:V.isSkinnedMesh===!0,morphTargets:C.morphAttributes.position!==void 0,morphNormals:C.morphAttributes.normal!==void 0,morphColors:C.morphAttributes.color!==void 0,morphTargetsCount:B,morphTextureStride:q,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:x.dithering,shadowMapEnabled:i.shadowMap.enabled&&N.length>0,shadowMapType:i.shadowMap.type,toneMapping:$e,useLegacyLights:i._useLegacyLights,decodeVideoTexture:ee&&x.map.isVideoTexture===!0&&qe.getTransfer(x.map.colorSpace)===Qe,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===mn,flipSided:x.side===Ut,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionDerivatives:ue&&x.extensions.derivatives===!0,extensionFragDepth:ue&&x.extensions.fragDepth===!0,extensionDrawBuffers:ue&&x.extensions.drawBuffers===!0,extensionShaderTextureLOD:ue&&x.extensions.shaderTextureLOD===!0,extensionClipCullDistance:ue&&x.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()}}function d(x){const b=[];if(x.shaderID?b.push(x.shaderID):(b.push(x.customVertexShaderID),b.push(x.customFragmentShaderID)),x.defines!==void 0)for(const N in x.defines)b.push(N),b.push(x.defines[N]);return x.isRawShaderMaterial===!1&&(M(b,x),_(b,x),b.push(i.outputColorSpace)),b.push(x.customProgramCacheKey),b.join()}function M(x,b){x.push(b.precision),x.push(b.outputColorSpace),x.push(b.envMapMode),x.push(b.envMapCubeUVHeight),x.push(b.mapUv),x.push(b.alphaMapUv),x.push(b.lightMapUv),x.push(b.aoMapUv),x.push(b.bumpMapUv),x.push(b.normalMapUv),x.push(b.displacementMapUv),x.push(b.emissiveMapUv),x.push(b.metalnessMapUv),x.push(b.roughnessMapUv),x.push(b.anisotropyMapUv),x.push(b.clearcoatMapUv),x.push(b.clearcoatNormalMapUv),x.push(b.clearcoatRoughnessMapUv),x.push(b.iridescenceMapUv),x.push(b.iridescenceThicknessMapUv),x.push(b.sheenColorMapUv),x.push(b.sheenRoughnessMapUv),x.push(b.specularMapUv),x.push(b.specularColorMapUv),x.push(b.specularIntensityMapUv),x.push(b.transmissionMapUv),x.push(b.thicknessMapUv),x.push(b.combine),x.push(b.fogExp2),x.push(b.sizeAttenuation),x.push(b.morphTargetsCount),x.push(b.morphAttributeCount),x.push(b.numDirLights),x.push(b.numPointLights),x.push(b.numSpotLights),x.push(b.numSpotLightMaps),x.push(b.numHemiLights),x.push(b.numRectAreaLights),x.push(b.numDirLightShadows),x.push(b.numPointLightShadows),x.push(b.numSpotLightShadows),x.push(b.numSpotLightShadowsWithMaps),x.push(b.numLightProbes),x.push(b.shadowMapType),x.push(b.toneMapping),x.push(b.numClippingPlanes),x.push(b.numClipIntersection),x.push(b.depthPacking)}function _(x,b){r.disableAll(),b.isWebGL2&&r.enable(0),b.supportsVertexTextures&&r.enable(1),b.instancing&&r.enable(2),b.instancingColor&&r.enable(3),b.matcap&&r.enable(4),b.envMap&&r.enable(5),b.normalMapObjectSpace&&r.enable(6),b.normalMapTangentSpace&&r.enable(7),b.clearcoat&&r.enable(8),b.iridescence&&r.enable(9),b.alphaTest&&r.enable(10),b.vertexColors&&r.enable(11),b.vertexAlphas&&r.enable(12),b.vertexUv1s&&r.enable(13),b.vertexUv2s&&r.enable(14),b.vertexUv3s&&r.enable(15),b.vertexTangents&&r.enable(16),b.anisotropy&&r.enable(17),b.alphaHash&&r.enable(18),b.batching&&r.enable(19),x.push(r.mask),r.disableAll(),b.fog&&r.enable(0),b.useFog&&r.enable(1),b.flatShading&&r.enable(2),b.logarithmicDepthBuffer&&r.enable(3),b.skinning&&r.enable(4),b.morphTargets&&r.enable(5),b.morphNormals&&r.enable(6),b.morphColors&&r.enable(7),b.premultipliedAlpha&&r.enable(8),b.shadowMapEnabled&&r.enable(9),b.useLegacyLights&&r.enable(10),b.doubleSided&&r.enable(11),b.flipSided&&r.enable(12),b.useDepthPacking&&r.enable(13),b.dithering&&r.enable(14),b.transmission&&r.enable(15),b.sheen&&r.enable(16),b.opaque&&r.enable(17),b.pointsUvs&&r.enable(18),b.decodeVideoTexture&&r.enable(19),x.push(r.mask)}function w(x){const b=g[x.type];let N;if(b){const L=an[b];N=id.clone(L.uniforms)}else N=x.uniforms;return N}function P(x,b){let N;for(let L=0,V=c.length;L<V;L++){const E=c[L];if(E.cacheKey===b){N=E,++N.usedTimes;break}}return N===void 0&&(N=new v0(i,b,x,o),c.push(N)),N}function k(x){if(--x.usedTimes===0){const b=c.indexOf(x);c[b]=c[c.length-1],c.pop(),x.destroy()}}function T(x){l.remove(x)}function S(){l.dispose()}return{getParameters:m,getProgramCacheKey:d,getUniforms:w,acquireProgram:P,releaseProgram:k,releaseShaderCache:T,programs:c,dispose:S}}function b0(){let i=new WeakMap;function e(o){let s=i.get(o);return s===void 0&&(s={},i.set(o,s)),s}function t(o){i.delete(o)}function n(o,s,r){i.get(o)[s]=r}function a(){i=new WeakMap}return{get:e,remove:t,update:n,dispose:a}}function S0(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Vl(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Wl(){const i=[];let e=0;const t=[],n=[],a=[];function o(){e=0,t.length=0,n.length=0,a.length=0}function s(u,f,p,g,v,m){let d=i[e];return d===void 0?(d={id:u.id,object:u,geometry:f,material:p,groupOrder:g,renderOrder:u.renderOrder,z:v,group:m},i[e]=d):(d.id=u.id,d.object=u,d.geometry=f,d.material=p,d.groupOrder=g,d.renderOrder=u.renderOrder,d.z=v,d.group=m),e++,d}function r(u,f,p,g,v,m){const d=s(u,f,p,g,v,m);p.transmission>0?n.push(d):p.transparent===!0?a.push(d):t.push(d)}function l(u,f,p,g,v,m){const d=s(u,f,p,g,v,m);p.transmission>0?n.unshift(d):p.transparent===!0?a.unshift(d):t.unshift(d)}function c(u,f){t.length>1&&t.sort(u||S0),n.length>1&&n.sort(f||Vl),a.length>1&&a.sort(f||Vl)}function h(){for(let u=e,f=i.length;u<f;u++){const p=i[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:a,init:o,push:r,unshift:l,finish:h,sort:c}}function y0(){let i=new WeakMap;function e(n,a){const o=i.get(n);let s;return o===void 0?(s=new Wl,i.set(n,[s])):a>=o.length?(s=new Wl,o.push(s)):s=o[a],s}function t(){i=new WeakMap}return{get:e,dispose:t}}function E0(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new X,color:new Oe};break;case"SpotLight":t={position:new X,direction:new X,color:new Oe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new X,color:new Oe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new X,skyColor:new Oe,groundColor:new Oe};break;case"RectAreaLight":t={color:new Oe,position:new X,halfWidth:new X,halfHeight:new X};break}return i[e.id]=t,t}}}function T0(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ge};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ge};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ge,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let k0=0;function A0(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function P0(i,e){const t=new E0,n=T0(),a={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)a.probe.push(new X);const o=new X,s=new ht,r=new ht;function l(h,u){let f=0,p=0,g=0;for(let L=0;L<9;L++)a.probe[L].set(0,0,0);let v=0,m=0,d=0,M=0,_=0,w=0,P=0,k=0,T=0,S=0,x=0;h.sort(A0);const b=u===!0?Math.PI:1;for(let L=0,V=h.length;L<V;L++){const E=h[L],C=E.color,D=E.intensity,j=E.distance,F=E.shadow&&E.shadow.map?E.shadow.map.texture:null;if(E.isAmbientLight)f+=C.r*D*b,p+=C.g*D*b,g+=C.b*D*b;else if(E.isLightProbe){for(let z=0;z<9;z++)a.probe[z].addScaledVector(E.sh.coefficients[z],D);x++}else if(E.isDirectionalLight){const z=t.get(E);if(z.color.copy(E.color).multiplyScalar(E.intensity*b),E.castShadow){const G=E.shadow,B=n.get(E);B.shadowBias=G.bias,B.shadowNormalBias=G.normalBias,B.shadowRadius=G.radius,B.shadowMapSize=G.mapSize,a.directionalShadow[v]=B,a.directionalShadowMap[v]=F,a.directionalShadowMatrix[v]=E.shadow.matrix,w++}a.directional[v]=z,v++}else if(E.isSpotLight){const z=t.get(E);z.position.setFromMatrixPosition(E.matrixWorld),z.color.copy(C).multiplyScalar(D*b),z.distance=j,z.coneCos=Math.cos(E.angle),z.penumbraCos=Math.cos(E.angle*(1-E.penumbra)),z.decay=E.decay,a.spot[d]=z;const G=E.shadow;if(E.map&&(a.spotLightMap[T]=E.map,T++,G.updateMatrices(E),E.castShadow&&S++),a.spotLightMatrix[d]=G.matrix,E.castShadow){const B=n.get(E);B.shadowBias=G.bias,B.shadowNormalBias=G.normalBias,B.shadowRadius=G.radius,B.shadowMapSize=G.mapSize,a.spotShadow[d]=B,a.spotShadowMap[d]=F,k++}d++}else if(E.isRectAreaLight){const z=t.get(E);z.color.copy(C).multiplyScalar(D),z.halfWidth.set(E.width*.5,0,0),z.halfHeight.set(0,E.height*.5,0),a.rectArea[M]=z,M++}else if(E.isPointLight){const z=t.get(E);if(z.color.copy(E.color).multiplyScalar(E.intensity*b),z.distance=E.distance,z.decay=E.decay,E.castShadow){const G=E.shadow,B=n.get(E);B.shadowBias=G.bias,B.shadowNormalBias=G.normalBias,B.shadowRadius=G.radius,B.shadowMapSize=G.mapSize,B.shadowCameraNear=G.camera.near,B.shadowCameraFar=G.camera.far,a.pointShadow[m]=B,a.pointShadowMap[m]=F,a.pointShadowMatrix[m]=E.shadow.matrix,P++}a.point[m]=z,m++}else if(E.isHemisphereLight){const z=t.get(E);z.skyColor.copy(E.color).multiplyScalar(D*b),z.groundColor.copy(E.groundColor).multiplyScalar(D*b),a.hemi[_]=z,_++}}M>0&&(e.isWebGL2?i.has("OES_texture_float_linear")===!0?(a.rectAreaLTC1=le.LTC_FLOAT_1,a.rectAreaLTC2=le.LTC_FLOAT_2):(a.rectAreaLTC1=le.LTC_HALF_1,a.rectAreaLTC2=le.LTC_HALF_2):i.has("OES_texture_float_linear")===!0?(a.rectAreaLTC1=le.LTC_FLOAT_1,a.rectAreaLTC2=le.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(a.rectAreaLTC1=le.LTC_HALF_1,a.rectAreaLTC2=le.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),a.ambient[0]=f,a.ambient[1]=p,a.ambient[2]=g;const N=a.hash;(N.directionalLength!==v||N.pointLength!==m||N.spotLength!==d||N.rectAreaLength!==M||N.hemiLength!==_||N.numDirectionalShadows!==w||N.numPointShadows!==P||N.numSpotShadows!==k||N.numSpotMaps!==T||N.numLightProbes!==x)&&(a.directional.length=v,a.spot.length=d,a.rectArea.length=M,a.point.length=m,a.hemi.length=_,a.directionalShadow.length=w,a.directionalShadowMap.length=w,a.pointShadow.length=P,a.pointShadowMap.length=P,a.spotShadow.length=k,a.spotShadowMap.length=k,a.directionalShadowMatrix.length=w,a.pointShadowMatrix.length=P,a.spotLightMatrix.length=k+T-S,a.spotLightMap.length=T,a.numSpotLightShadowsWithMaps=S,a.numLightProbes=x,N.directionalLength=v,N.pointLength=m,N.spotLength=d,N.rectAreaLength=M,N.hemiLength=_,N.numDirectionalShadows=w,N.numPointShadows=P,N.numSpotShadows=k,N.numSpotMaps=T,N.numLightProbes=x,a.version=k0++)}function c(h,u){let f=0,p=0,g=0,v=0,m=0;const d=u.matrixWorldInverse;for(let M=0,_=h.length;M<_;M++){const w=h[M];if(w.isDirectionalLight){const P=a.directional[f];P.direction.setFromMatrixPosition(w.matrixWorld),o.setFromMatrixPosition(w.target.matrixWorld),P.direction.sub(o),P.direction.transformDirection(d),f++}else if(w.isSpotLight){const P=a.spot[g];P.position.setFromMatrixPosition(w.matrixWorld),P.position.applyMatrix4(d),P.direction.setFromMatrixPosition(w.matrixWorld),o.setFromMatrixPosition(w.target.matrixWorld),P.direction.sub(o),P.direction.transformDirection(d),g++}else if(w.isRectAreaLight){const P=a.rectArea[v];P.position.setFromMatrixPosition(w.matrixWorld),P.position.applyMatrix4(d),r.identity(),s.copy(w.matrixWorld),s.premultiply(d),r.extractRotation(s),P.halfWidth.set(w.width*.5,0,0),P.halfHeight.set(0,w.height*.5,0),P.halfWidth.applyMatrix4(r),P.halfHeight.applyMatrix4(r),v++}else if(w.isPointLight){const P=a.point[p];P.position.setFromMatrixPosition(w.matrixWorld),P.position.applyMatrix4(d),p++}else if(w.isHemisphereLight){const P=a.hemi[m];P.direction.setFromMatrixPosition(w.matrixWorld),P.direction.transformDirection(d),m++}}}return{setup:l,setupView:c,state:a}}function ql(i,e){const t=new P0(i,e),n=[],a=[];function o(){n.length=0,a.length=0}function s(u){n.push(u)}function r(u){a.push(u)}function l(u){t.setup(n,u)}function c(u){t.setupView(n,u)}return{init:o,state:{lightsArray:n,shadowsArray:a,lights:t},setupLights:l,setupLightsView:c,pushLight:s,pushShadow:r}}function R0(i,e){let t=new WeakMap;function n(o,s=0){const r=t.get(o);let l;return r===void 0?(l=new ql(i,e),t.set(o,[l])):s>=r.length?(l=new ql(i,e),r.push(l)):l=r[s],l}function a(){t=new WeakMap}return{get:n,dispose:a}}class C0 extends Oi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=mf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class L0 extends Oi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const N0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,D0=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function U0(i,e,t){let n=new Js;const a=new Ge,o=new Ge,s=new lt,r=new C0({depthPacking:gf}),l=new L0,c={},h=t.maxTextureSize,u={[Dn]:Ut,[Ut]:Dn,[mn]:mn},f=new Qn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ge},radius:{value:4}},vertexShader:N0,fragmentShader:D0}),p=f.clone();p.defines.HORIZONTAL_PASS=1;const g=new ti;g.setAttribute("position",new Dt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new Qt(g,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Tc;let d=this.type;this.render=function(k,T,S){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||k.length===0)return;const x=i.getRenderTarget(),b=i.getActiveCubeFace(),N=i.getActiveMipmapLevel(),L=i.state;L.setBlending(Pn),L.buffers.color.setClear(1,1,1,1),L.buffers.depth.setTest(!0),L.setScissorTest(!1);const V=d!==tn&&this.type===tn,E=d===tn&&this.type!==tn;for(let C=0,D=k.length;C<D;C++){const j=k[C],F=j.shadow;if(F===void 0){console.warn("THREE.WebGLShadowMap:",j,"has no shadow.");continue}if(F.autoUpdate===!1&&F.needsUpdate===!1)continue;a.copy(F.mapSize);const z=F.getFrameExtents();if(a.multiply(z),o.copy(F.mapSize),(a.x>h||a.y>h)&&(a.x>h&&(o.x=Math.floor(h/z.x),a.x=o.x*z.x,F.mapSize.x=o.x),a.y>h&&(o.y=Math.floor(h/z.y),a.y=o.y*z.y,F.mapSize.y=o.y)),F.map===null||V===!0||E===!0){const B=this.type!==tn?{minFilter:Mt,magFilter:Mt}:{};F.map!==null&&F.map.dispose(),F.map=new Jn(a.x,a.y,B),F.map.texture.name=j.name+".shadowMap",F.camera.updateProjectionMatrix()}i.setRenderTarget(F.map),i.clear();const G=F.getViewportCount();for(let B=0;B<G;B++){const q=F.getViewport(B);s.set(o.x*q.x,o.y*q.y,o.x*q.z,o.y*q.w),L.viewport(s),F.updateMatrices(j,B),n=F.getFrustum(),w(T,S,F.camera,j,this.type)}F.isPointLightShadow!==!0&&this.type===tn&&M(F,S),F.needsUpdate=!1}d=this.type,m.needsUpdate=!1,i.setRenderTarget(x,b,N)};function M(k,T){const S=e.update(v);f.defines.VSM_SAMPLES!==k.blurSamples&&(f.defines.VSM_SAMPLES=k.blurSamples,p.defines.VSM_SAMPLES=k.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),k.mapPass===null&&(k.mapPass=new Jn(a.x,a.y)),f.uniforms.shadow_pass.value=k.map.texture,f.uniforms.resolution.value=k.mapSize,f.uniforms.radius.value=k.radius,i.setRenderTarget(k.mapPass),i.clear(),i.renderBufferDirect(T,null,S,f,v,null),p.uniforms.shadow_pass.value=k.mapPass.texture,p.uniforms.resolution.value=k.mapSize,p.uniforms.radius.value=k.radius,i.setRenderTarget(k.map),i.clear(),i.renderBufferDirect(T,null,S,p,v,null)}function _(k,T,S,x){let b=null;const N=S.isPointLight===!0?k.customDistanceMaterial:k.customDepthMaterial;if(N!==void 0)b=N;else if(b=S.isPointLight===!0?l:r,i.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0){const L=b.uuid,V=T.uuid;let E=c[L];E===void 0&&(E={},c[L]=E);let C=E[V];C===void 0&&(C=b.clone(),E[V]=C,T.addEventListener("dispose",P)),b=C}if(b.visible=T.visible,b.wireframe=T.wireframe,x===tn?b.side=T.shadowSide!==null?T.shadowSide:T.side:b.side=T.shadowSide!==null?T.shadowSide:u[T.side],b.alphaMap=T.alphaMap,b.alphaTest=T.alphaTest,b.map=T.map,b.clipShadows=T.clipShadows,b.clippingPlanes=T.clippingPlanes,b.clipIntersection=T.clipIntersection,b.displacementMap=T.displacementMap,b.displacementScale=T.displacementScale,b.displacementBias=T.displacementBias,b.wireframeLinewidth=T.wireframeLinewidth,b.linewidth=T.linewidth,S.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const L=i.properties.get(b);L.light=S}return b}function w(k,T,S,x,b){if(k.visible===!1)return;if(k.layers.test(T.layers)&&(k.isMesh||k.isLine||k.isPoints)&&(k.castShadow||k.receiveShadow&&b===tn)&&(!k.frustumCulled||n.intersectsObject(k))){k.modelViewMatrix.multiplyMatrices(S.matrixWorldInverse,k.matrixWorld);const V=e.update(k),E=k.material;if(Array.isArray(E)){const C=V.groups;for(let D=0,j=C.length;D<j;D++){const F=C[D],z=E[F.materialIndex];if(z&&z.visible){const G=_(k,z,x,b);k.onBeforeShadow(i,k,T,S,V,G,F),i.renderBufferDirect(S,null,V,G,k,F),k.onAfterShadow(i,k,T,S,V,G,F)}}}else if(E.visible){const C=_(k,E,x,b);k.onBeforeShadow(i,k,T,S,V,C,null),i.renderBufferDirect(S,null,V,C,k,null),k.onAfterShadow(i,k,T,S,V,C,null)}}const L=k.children;for(let V=0,E=L.length;V<E;V++)w(L[V],T,S,x,b)}function P(k){k.target.removeEventListener("dispose",P);for(const S in c){const x=c[S],b=k.target.uuid;b in x&&(x[b].dispose(),delete x[b])}}}function I0(i,e,t){const n=t.isWebGL2;function a(){let U=!1;const he=new lt;let ue=null;const Ee=new lt(0,0,0,0);return{setMask:function(be){ue!==be&&!U&&(i.colorMask(be,be,be,be),ue=be)},setLocked:function(be){U=be},setClear:function(be,je,$e,dt,kt){kt===!0&&(be*=dt,je*=dt,$e*=dt),he.set(be,je,$e,dt),Ee.equals(he)===!1&&(i.clearColor(be,je,$e,dt),Ee.copy(he))},reset:function(){U=!1,ue=null,Ee.set(-1,0,0,0)}}}function o(){let U=!1,he=null,ue=null,Ee=null;return{setTest:function(be){be?pe(i.DEPTH_TEST):ee(i.DEPTH_TEST)},setMask:function(be){he!==be&&!U&&(i.depthMask(be),he=be)},setFunc:function(be){if(ue!==be){switch(be){case qu:i.depthFunc(i.NEVER);break;case Xu:i.depthFunc(i.ALWAYS);break;case Yu:i.depthFunc(i.LESS);break;case so:i.depthFunc(i.LEQUAL);break;case ju:i.depthFunc(i.EQUAL);break;case $u:i.depthFunc(i.GEQUAL);break;case Ku:i.depthFunc(i.GREATER);break;case Zu:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ue=be}},setLocked:function(be){U=be},setClear:function(be){Ee!==be&&(i.clearDepth(be),Ee=be)},reset:function(){U=!1,he=null,ue=null,Ee=null}}}function s(){let U=!1,he=null,ue=null,Ee=null,be=null,je=null,$e=null,dt=null,kt=null;return{setTest:function(Ke){U||(Ke?pe(i.STENCIL_TEST):ee(i.STENCIL_TEST))},setMask:function(Ke){he!==Ke&&!U&&(i.stencilMask(Ke),he=Ke)},setFunc:function(Ke,At,en){(ue!==Ke||Ee!==At||be!==en)&&(i.stencilFunc(Ke,At,en),ue=Ke,Ee=At,be=en)},setOp:function(Ke,At,en){(je!==Ke||$e!==At||dt!==en)&&(i.stencilOp(Ke,At,en),je=Ke,$e=At,dt=en)},setLocked:function(Ke){U=Ke},setClear:function(Ke){kt!==Ke&&(i.clearStencil(Ke),kt=Ke)},reset:function(){U=!1,he=null,ue=null,Ee=null,be=null,je=null,$e=null,dt=null,kt=null}}}const r=new a,l=new o,c=new s,h=new WeakMap,u=new WeakMap;let f={},p={},g=new WeakMap,v=[],m=null,d=!1,M=null,_=null,w=null,P=null,k=null,T=null,S=null,x=new Oe(0,0,0),b=0,N=!1,L=null,V=null,E=null,C=null,D=null;const j=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let F=!1,z=0;const G=i.getParameter(i.VERSION);G.indexOf("WebGL")!==-1?(z=parseFloat(/^WebGL (\d)/.exec(G)[1]),F=z>=1):G.indexOf("OpenGL ES")!==-1&&(z=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),F=z>=2);let B=null,q={};const I=i.getParameter(i.SCISSOR_BOX),Y=i.getParameter(i.VIEWPORT),W=new lt().fromArray(I),Q=new lt().fromArray(Y);function te(U,he,ue,Ee){const be=new Uint8Array(4),je=i.createTexture();i.bindTexture(U,je),i.texParameteri(U,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(U,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let $e=0;$e<ue;$e++)n&&(U===i.TEXTURE_3D||U===i.TEXTURE_2D_ARRAY)?i.texImage3D(he,0,i.RGBA,1,1,Ee,0,i.RGBA,i.UNSIGNED_BYTE,be):i.texImage2D(he+$e,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,be);return je}const se={};se[i.TEXTURE_2D]=te(i.TEXTURE_2D,i.TEXTURE_2D,1),se[i.TEXTURE_CUBE_MAP]=te(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(se[i.TEXTURE_2D_ARRAY]=te(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),se[i.TEXTURE_3D]=te(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),r.setClear(0,0,0,1),l.setClear(1),c.setClear(0),pe(i.DEPTH_TEST),l.setFunc(so),Re(!1),R(Tr),pe(i.CULL_FACE),ve(Pn);function pe(U){f[U]!==!0&&(i.enable(U),f[U]=!0)}function ee(U){f[U]!==!1&&(i.disable(U),f[U]=!1)}function ce(U,he){return p[U]!==he?(i.bindFramebuffer(U,he),p[U]=he,n&&(U===i.DRAW_FRAMEBUFFER&&(p[i.FRAMEBUFFER]=he),U===i.FRAMEBUFFER&&(p[i.DRAW_FRAMEBUFFER]=he)),!0):!1}function O(U,he){let ue=v,Ee=!1;if(U)if(ue=g.get(he),ue===void 0&&(ue=[],g.set(he,ue)),U.isWebGLMultipleRenderTargets){const be=U.texture;if(ue.length!==be.length||ue[0]!==i.COLOR_ATTACHMENT0){for(let je=0,$e=be.length;je<$e;je++)ue[je]=i.COLOR_ATTACHMENT0+je;ue.length=be.length,Ee=!0}}else ue[0]!==i.COLOR_ATTACHMENT0&&(ue[0]=i.COLOR_ATTACHMENT0,Ee=!0);else ue[0]!==i.BACK&&(ue[0]=i.BACK,Ee=!0);Ee&&(t.isWebGL2?i.drawBuffers(ue):e.get("WEBGL_draw_buffers").drawBuffersWEBGL(ue))}function Ye(U){return m!==U?(i.useProgram(U),m=U,!0):!1}const Me={[Wn]:i.FUNC_ADD,[Ru]:i.FUNC_SUBTRACT,[Cu]:i.FUNC_REVERSE_SUBTRACT};if(n)Me[Rr]=i.MIN,Me[Cr]=i.MAX;else{const U=e.get("EXT_blend_minmax");U!==null&&(Me[Rr]=U.MIN_EXT,Me[Cr]=U.MAX_EXT)}const ke={[Lu]:i.ZERO,[Nu]:i.ONE,[Du]:i.SRC_COLOR,[ws]:i.SRC_ALPHA,[Bu]:i.SRC_ALPHA_SATURATE,[zu]:i.DST_COLOR,[Iu]:i.DST_ALPHA,[Uu]:i.ONE_MINUS_SRC_COLOR,[bs]:i.ONE_MINUS_SRC_ALPHA,[Ou]:i.ONE_MINUS_DST_COLOR,[Fu]:i.ONE_MINUS_DST_ALPHA,[Gu]:i.CONSTANT_COLOR,[Hu]:i.ONE_MINUS_CONSTANT_COLOR,[Vu]:i.CONSTANT_ALPHA,[Wu]:i.ONE_MINUS_CONSTANT_ALPHA};function ve(U,he,ue,Ee,be,je,$e,dt,kt,Ke){if(U===Pn){d===!0&&(ee(i.BLEND),d=!1);return}if(d===!1&&(pe(i.BLEND),d=!0),U!==Pu){if(U!==M||Ke!==N){if((_!==Wn||k!==Wn)&&(i.blendEquation(i.FUNC_ADD),_=Wn,k=Wn),Ke)switch(U){case Ti:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case kr:i.blendFunc(i.ONE,i.ONE);break;case Ar:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Pr:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case Ti:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case kr:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Ar:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Pr:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}w=null,P=null,T=null,S=null,x.set(0,0,0),b=0,M=U,N=Ke}return}be=be||he,je=je||ue,$e=$e||Ee,(he!==_||be!==k)&&(i.blendEquationSeparate(Me[he],Me[be]),_=he,k=be),(ue!==w||Ee!==P||je!==T||$e!==S)&&(i.blendFuncSeparate(ke[ue],ke[Ee],ke[je],ke[$e]),w=ue,P=Ee,T=je,S=$e),(dt.equals(x)===!1||kt!==b)&&(i.blendColor(dt.r,dt.g,dt.b,kt),x.copy(dt),b=kt),M=U,N=!1}function Ze(U,he){U.side===mn?ee(i.CULL_FACE):pe(i.CULL_FACE);let ue=U.side===Ut;he&&(ue=!ue),Re(ue),U.blending===Ti&&U.transparent===!1?ve(Pn):ve(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),l.setFunc(U.depthFunc),l.setTest(U.depthTest),l.setMask(U.depthWrite),r.setMask(U.colorWrite);const Ee=U.stencilWrite;c.setTest(Ee),Ee&&(c.setMask(U.stencilWriteMask),c.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),c.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),K(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?pe(i.SAMPLE_ALPHA_TO_COVERAGE):ee(i.SAMPLE_ALPHA_TO_COVERAGE)}function Re(U){L!==U&&(U?i.frontFace(i.CW):i.frontFace(i.CCW),L=U)}function R(U){U!==Tu?(pe(i.CULL_FACE),U!==V&&(U===Tr?i.cullFace(i.BACK):U===ku?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):ee(i.CULL_FACE),V=U}function y(U){U!==E&&(F&&i.lineWidth(U),E=U)}function K(U,he,ue){U?(pe(i.POLYGON_OFFSET_FILL),(C!==he||D!==ue)&&(i.polygonOffset(he,ue),C=he,D=ue)):ee(i.POLYGON_OFFSET_FILL)}function ae(U){U?pe(i.SCISSOR_TEST):ee(i.SCISSOR_TEST)}function ie(U){U===void 0&&(U=i.TEXTURE0+j-1),B!==U&&(i.activeTexture(U),B=U)}function oe(U,he,ue){ue===void 0&&(B===null?ue=i.TEXTURE0+j-1:ue=B);let Ee=q[ue];Ee===void 0&&(Ee={type:void 0,texture:void 0},q[ue]=Ee),(Ee.type!==U||Ee.texture!==he)&&(B!==ue&&(i.activeTexture(ue),B=ue),i.bindTexture(U,he||se[U]),Ee.type=U,Ee.texture=he)}function _e(){const U=q[B];U!==void 0&&U.type!==void 0&&(i.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function fe(){try{i.compressedTexImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function me(){try{i.compressedTexImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ye(){try{i.texSubImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function De(){try{i.texSubImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ne(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ve(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Be(){try{i.texStorage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ae(){try{i.texStorage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function we(){try{i.texImage2D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ge(){try{i.texImage3D.apply(i,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Le(U){W.equals(U)===!1&&(i.scissor(U.x,U.y,U.z,U.w),W.copy(U))}function He(U){Q.equals(U)===!1&&(i.viewport(U.x,U.y,U.z,U.w),Q.copy(U))}function it(U,he){let ue=u.get(he);ue===void 0&&(ue=new WeakMap,u.set(he,ue));let Ee=ue.get(U);Ee===void 0&&(Ee=i.getUniformBlockIndex(he,U.name),ue.set(U,Ee))}function Ie(U,he){const Ee=u.get(he).get(U);h.get(he)!==Ee&&(i.uniformBlockBinding(he,Ee,U.__bindingPointIndex),h.set(he,Ee))}function re(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),f={},B=null,q={},p={},g=new WeakMap,v=[],m=null,d=!1,M=null,_=null,w=null,P=null,k=null,T=null,S=null,x=new Oe(0,0,0),b=0,N=!1,L=null,V=null,E=null,C=null,D=null,W.set(0,0,i.canvas.width,i.canvas.height),Q.set(0,0,i.canvas.width,i.canvas.height),r.reset(),l.reset(),c.reset()}return{buffers:{color:r,depth:l,stencil:c},enable:pe,disable:ee,bindFramebuffer:ce,drawBuffers:O,useProgram:Ye,setBlending:ve,setMaterial:Ze,setFlipSided:Re,setCullFace:R,setLineWidth:y,setPolygonOffset:K,setScissorTest:ae,activeTexture:ie,bindTexture:oe,unbindTexture:_e,compressedTexImage2D:fe,compressedTexImage3D:me,texImage2D:we,texImage3D:ge,updateUBOMapping:it,uniformBlockBinding:Ie,texStorage2D:Be,texStorage3D:Ae,texSubImage2D:ye,texSubImage3D:De,compressedTexSubImage2D:ne,compressedTexSubImage3D:Ve,scissor:Le,viewport:He,reset:re}}function F0(i,e,t,n,a,o,s){const r=a.isWebGL2,l=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap;let u;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(R,y){return p?new OffscreenCanvas(R,y):fo("canvas")}function v(R,y,K,ae){let ie=1;if((R.width>ae||R.height>ae)&&(ie=ae/Math.max(R.width,R.height)),ie<1||y===!0)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap){const oe=y?uo:Math.floor,_e=oe(ie*R.width),fe=oe(ie*R.height);u===void 0&&(u=g(_e,fe));const me=K?g(_e,fe):u;return me.width=_e,me.height=fe,me.getContext("2d").drawImage(R,0,0,_e,fe),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+R.width+"x"+R.height+") to ("+_e+"x"+fe+")."),me}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+R.width+"x"+R.height+")."),R;return R}function m(R){return As(R.width)&&As(R.height)}function d(R){return r?!1:R.wrapS!==Kt||R.wrapT!==Kt||R.minFilter!==Mt&&R.minFilter!==Ot}function M(R,y){return R.generateMipmaps&&y&&R.minFilter!==Mt&&R.minFilter!==Ot}function _(R){i.generateMipmap(R)}function w(R,y,K,ae,ie=!1){if(r===!1)return y;if(R!==null){if(i[R]!==void 0)return i[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let oe=y;if(y===i.RED&&(K===i.FLOAT&&(oe=i.R32F),K===i.HALF_FLOAT&&(oe=i.R16F),K===i.UNSIGNED_BYTE&&(oe=i.R8)),y===i.RED_INTEGER&&(K===i.UNSIGNED_BYTE&&(oe=i.R8UI),K===i.UNSIGNED_SHORT&&(oe=i.R16UI),K===i.UNSIGNED_INT&&(oe=i.R32UI),K===i.BYTE&&(oe=i.R8I),K===i.SHORT&&(oe=i.R16I),K===i.INT&&(oe=i.R32I)),y===i.RG&&(K===i.FLOAT&&(oe=i.RG32F),K===i.HALF_FLOAT&&(oe=i.RG16F),K===i.UNSIGNED_BYTE&&(oe=i.RG8)),y===i.RGBA){const _e=ie?ro:qe.getTransfer(ae);K===i.FLOAT&&(oe=i.RGBA32F),K===i.HALF_FLOAT&&(oe=i.RGBA16F),K===i.UNSIGNED_BYTE&&(oe=_e===Qe?i.SRGB8_ALPHA8:i.RGBA8),K===i.UNSIGNED_SHORT_4_4_4_4&&(oe=i.RGBA4),K===i.UNSIGNED_SHORT_5_5_5_1&&(oe=i.RGB5_A1)}return(oe===i.R16F||oe===i.R32F||oe===i.RG16F||oe===i.RG32F||oe===i.RGBA16F||oe===i.RGBA32F)&&e.get("EXT_color_buffer_float"),oe}function P(R,y,K){return M(R,K)===!0||R.isFramebufferTexture&&R.minFilter!==Mt&&R.minFilter!==Ot?Math.log2(Math.max(y.width,y.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?y.mipmaps.length:1}function k(R){return R===Mt||R===Lr||R===Uo?i.NEAREST:i.LINEAR}function T(R){const y=R.target;y.removeEventListener("dispose",T),x(y),y.isVideoTexture&&h.delete(y)}function S(R){const y=R.target;y.removeEventListener("dispose",S),N(y)}function x(R){const y=n.get(R);if(y.__webglInit===void 0)return;const K=R.source,ae=f.get(K);if(ae){const ie=ae[y.__cacheKey];ie.usedTimes--,ie.usedTimes===0&&b(R),Object.keys(ae).length===0&&f.delete(K)}n.remove(R)}function b(R){const y=n.get(R);i.deleteTexture(y.__webglTexture);const K=R.source,ae=f.get(K);delete ae[y.__cacheKey],s.memory.textures--}function N(R){const y=R.texture,K=n.get(R),ae=n.get(y);if(ae.__webglTexture!==void 0&&(i.deleteTexture(ae.__webglTexture),s.memory.textures--),R.depthTexture&&R.depthTexture.dispose(),R.isWebGLCubeRenderTarget)for(let ie=0;ie<6;ie++){if(Array.isArray(K.__webglFramebuffer[ie]))for(let oe=0;oe<K.__webglFramebuffer[ie].length;oe++)i.deleteFramebuffer(K.__webglFramebuffer[ie][oe]);else i.deleteFramebuffer(K.__webglFramebuffer[ie]);K.__webglDepthbuffer&&i.deleteRenderbuffer(K.__webglDepthbuffer[ie])}else{if(Array.isArray(K.__webglFramebuffer))for(let ie=0;ie<K.__webglFramebuffer.length;ie++)i.deleteFramebuffer(K.__webglFramebuffer[ie]);else i.deleteFramebuffer(K.__webglFramebuffer);if(K.__webglDepthbuffer&&i.deleteRenderbuffer(K.__webglDepthbuffer),K.__webglMultisampledFramebuffer&&i.deleteFramebuffer(K.__webglMultisampledFramebuffer),K.__webglColorRenderbuffer)for(let ie=0;ie<K.__webglColorRenderbuffer.length;ie++)K.__webglColorRenderbuffer[ie]&&i.deleteRenderbuffer(K.__webglColorRenderbuffer[ie]);K.__webglDepthRenderbuffer&&i.deleteRenderbuffer(K.__webglDepthRenderbuffer)}if(R.isWebGLMultipleRenderTargets)for(let ie=0,oe=y.length;ie<oe;ie++){const _e=n.get(y[ie]);_e.__webglTexture&&(i.deleteTexture(_e.__webglTexture),s.memory.textures--),n.remove(y[ie])}n.remove(y),n.remove(R)}let L=0;function V(){L=0}function E(){const R=L;return R>=a.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+a.maxTextures),L+=1,R}function C(R){const y=[];return y.push(R.wrapS),y.push(R.wrapT),y.push(R.wrapR||0),y.push(R.magFilter),y.push(R.minFilter),y.push(R.anisotropy),y.push(R.internalFormat),y.push(R.format),y.push(R.type),y.push(R.generateMipmaps),y.push(R.premultiplyAlpha),y.push(R.flipY),y.push(R.unpackAlignment),y.push(R.colorSpace),y.join()}function D(R,y){const K=n.get(R);if(R.isVideoTexture&&Ze(R),R.isRenderTargetTexture===!1&&R.version>0&&K.__version!==R.version){const ae=R.image;if(ae===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ae.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{W(K,R,y);return}}t.bindTexture(i.TEXTURE_2D,K.__webglTexture,i.TEXTURE0+y)}function j(R,y){const K=n.get(R);if(R.version>0&&K.__version!==R.version){W(K,R,y);return}t.bindTexture(i.TEXTURE_2D_ARRAY,K.__webglTexture,i.TEXTURE0+y)}function F(R,y){const K=n.get(R);if(R.version>0&&K.__version!==R.version){W(K,R,y);return}t.bindTexture(i.TEXTURE_3D,K.__webglTexture,i.TEXTURE0+y)}function z(R,y){const K=n.get(R);if(R.version>0&&K.__version!==R.version){Q(K,R,y);return}t.bindTexture(i.TEXTURE_CUBE_MAP,K.__webglTexture,i.TEXTURE0+y)}const G={[Es]:i.REPEAT,[Kt]:i.CLAMP_TO_EDGE,[Ts]:i.MIRRORED_REPEAT},B={[Mt]:i.NEAREST,[Lr]:i.NEAREST_MIPMAP_NEAREST,[Uo]:i.NEAREST_MIPMAP_LINEAR,[Ot]:i.LINEAR,[rf]:i.LINEAR_MIPMAP_NEAREST,[Li]:i.LINEAR_MIPMAP_LINEAR},q={[_f]:i.NEVER,[yf]:i.ALWAYS,[xf]:i.LESS,[Oc]:i.LEQUAL,[Mf]:i.EQUAL,[Sf]:i.GEQUAL,[wf]:i.GREATER,[bf]:i.NOTEQUAL};function I(R,y,K){if(K?(i.texParameteri(R,i.TEXTURE_WRAP_S,G[y.wrapS]),i.texParameteri(R,i.TEXTURE_WRAP_T,G[y.wrapT]),(R===i.TEXTURE_3D||R===i.TEXTURE_2D_ARRAY)&&i.texParameteri(R,i.TEXTURE_WRAP_R,G[y.wrapR]),i.texParameteri(R,i.TEXTURE_MAG_FILTER,B[y.magFilter]),i.texParameteri(R,i.TEXTURE_MIN_FILTER,B[y.minFilter])):(i.texParameteri(R,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(R,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(R===i.TEXTURE_3D||R===i.TEXTURE_2D_ARRAY)&&i.texParameteri(R,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(y.wrapS!==Kt||y.wrapT!==Kt)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(R,i.TEXTURE_MAG_FILTER,k(y.magFilter)),i.texParameteri(R,i.TEXTURE_MIN_FILTER,k(y.minFilter)),y.minFilter!==Mt&&y.minFilter!==Ot&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),y.compareFunction&&(i.texParameteri(R,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(R,i.TEXTURE_COMPARE_FUNC,q[y.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){const ae=e.get("EXT_texture_filter_anisotropic");if(y.magFilter===Mt||y.minFilter!==Uo&&y.minFilter!==Li||y.type===An&&e.has("OES_texture_float_linear")===!1||r===!1&&y.type===sa&&e.has("OES_texture_half_float_linear")===!1)return;(y.anisotropy>1||n.get(y).__currentAnisotropy)&&(i.texParameterf(R,ae.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,a.getMaxAnisotropy())),n.get(y).__currentAnisotropy=y.anisotropy)}}function Y(R,y){let K=!1;R.__webglInit===void 0&&(R.__webglInit=!0,y.addEventListener("dispose",T));const ae=y.source;let ie=f.get(ae);ie===void 0&&(ie={},f.set(ae,ie));const oe=C(y);if(oe!==R.__cacheKey){ie[oe]===void 0&&(ie[oe]={texture:i.createTexture(),usedTimes:0},s.memory.textures++,K=!0),ie[oe].usedTimes++;const _e=ie[R.__cacheKey];_e!==void 0&&(ie[R.__cacheKey].usedTimes--,_e.usedTimes===0&&b(y)),R.__cacheKey=oe,R.__webglTexture=ie[oe].texture}return K}function W(R,y,K){let ae=i.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(ae=i.TEXTURE_2D_ARRAY),y.isData3DTexture&&(ae=i.TEXTURE_3D);const ie=Y(R,y),oe=y.source;t.bindTexture(ae,R.__webglTexture,i.TEXTURE0+K);const _e=n.get(oe);if(oe.version!==_e.__version||ie===!0){t.activeTexture(i.TEXTURE0+K);const fe=qe.getPrimaries(qe.workingColorSpace),me=y.colorSpace===Ht?null:qe.getPrimaries(y.colorSpace),ye=y.colorSpace===Ht||fe===me?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ye);const De=d(y)&&m(y.image)===!1;let ne=v(y.image,De,!1,a.maxTextureSize);ne=Re(y,ne);const Ve=m(ne)||r,Be=o.convert(y.format,y.colorSpace);let Ae=o.convert(y.type),we=w(y.internalFormat,Be,Ae,y.colorSpace,y.isVideoTexture);I(ae,y,Ve);let ge;const Le=y.mipmaps,He=r&&y.isVideoTexture!==!0&&we!==Ic,it=_e.__version===void 0||ie===!0,Ie=P(y,ne,Ve);if(y.isDepthTexture)we=i.DEPTH_COMPONENT,r?y.type===An?we=i.DEPTH_COMPONENT32F:y.type===kn?we=i.DEPTH_COMPONENT24:y.type===jn?we=i.DEPTH24_STENCIL8:we=i.DEPTH_COMPONENT16:y.type===An&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),y.format===$n&&we===i.DEPTH_COMPONENT&&y.type!==Xs&&y.type!==kn&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),y.type=kn,Ae=o.convert(y.type)),y.format===Ni&&we===i.DEPTH_COMPONENT&&(we=i.DEPTH_STENCIL,y.type!==jn&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),y.type=jn,Ae=o.convert(y.type))),it&&(He?t.texStorage2D(i.TEXTURE_2D,1,we,ne.width,ne.height):t.texImage2D(i.TEXTURE_2D,0,we,ne.width,ne.height,0,Be,Ae,null));else if(y.isDataTexture)if(Le.length>0&&Ve){He&&it&&t.texStorage2D(i.TEXTURE_2D,Ie,we,Le[0].width,Le[0].height);for(let re=0,U=Le.length;re<U;re++)ge=Le[re],He?t.texSubImage2D(i.TEXTURE_2D,re,0,0,ge.width,ge.height,Be,Ae,ge.data):t.texImage2D(i.TEXTURE_2D,re,we,ge.width,ge.height,0,Be,Ae,ge.data);y.generateMipmaps=!1}else He?(it&&t.texStorage2D(i.TEXTURE_2D,Ie,we,ne.width,ne.height),t.texSubImage2D(i.TEXTURE_2D,0,0,0,ne.width,ne.height,Be,Ae,ne.data)):t.texImage2D(i.TEXTURE_2D,0,we,ne.width,ne.height,0,Be,Ae,ne.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){He&&it&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Ie,we,Le[0].width,Le[0].height,ne.depth);for(let re=0,U=Le.length;re<U;re++)ge=Le[re],y.format!==Zt?Be!==null?He?t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,re,0,0,0,ge.width,ge.height,ne.depth,Be,ge.data,0,0):t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,re,we,ge.width,ge.height,ne.depth,0,ge.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):He?t.texSubImage3D(i.TEXTURE_2D_ARRAY,re,0,0,0,ge.width,ge.height,ne.depth,Be,Ae,ge.data):t.texImage3D(i.TEXTURE_2D_ARRAY,re,we,ge.width,ge.height,ne.depth,0,Be,Ae,ge.data)}else{He&&it&&t.texStorage2D(i.TEXTURE_2D,Ie,we,Le[0].width,Le[0].height);for(let re=0,U=Le.length;re<U;re++)ge=Le[re],y.format!==Zt?Be!==null?He?t.compressedTexSubImage2D(i.TEXTURE_2D,re,0,0,ge.width,ge.height,Be,ge.data):t.compressedTexImage2D(i.TEXTURE_2D,re,we,ge.width,ge.height,0,ge.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):He?t.texSubImage2D(i.TEXTURE_2D,re,0,0,ge.width,ge.height,Be,Ae,ge.data):t.texImage2D(i.TEXTURE_2D,re,we,ge.width,ge.height,0,Be,Ae,ge.data)}else if(y.isDataArrayTexture)He?(it&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Ie,we,ne.width,ne.height,ne.depth),t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ne.width,ne.height,ne.depth,Be,Ae,ne.data)):t.texImage3D(i.TEXTURE_2D_ARRAY,0,we,ne.width,ne.height,ne.depth,0,Be,Ae,ne.data);else if(y.isData3DTexture)He?(it&&t.texStorage3D(i.TEXTURE_3D,Ie,we,ne.width,ne.height,ne.depth),t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ne.width,ne.height,ne.depth,Be,Ae,ne.data)):t.texImage3D(i.TEXTURE_3D,0,we,ne.width,ne.height,ne.depth,0,Be,Ae,ne.data);else if(y.isFramebufferTexture){if(it)if(He)t.texStorage2D(i.TEXTURE_2D,Ie,we,ne.width,ne.height);else{let re=ne.width,U=ne.height;for(let he=0;he<Ie;he++)t.texImage2D(i.TEXTURE_2D,he,we,re,U,0,Be,Ae,null),re>>=1,U>>=1}}else if(Le.length>0&&Ve){He&&it&&t.texStorage2D(i.TEXTURE_2D,Ie,we,Le[0].width,Le[0].height);for(let re=0,U=Le.length;re<U;re++)ge=Le[re],He?t.texSubImage2D(i.TEXTURE_2D,re,0,0,Be,Ae,ge):t.texImage2D(i.TEXTURE_2D,re,we,Be,Ae,ge);y.generateMipmaps=!1}else He?(it&&t.texStorage2D(i.TEXTURE_2D,Ie,we,ne.width,ne.height),t.texSubImage2D(i.TEXTURE_2D,0,0,0,Be,Ae,ne)):t.texImage2D(i.TEXTURE_2D,0,we,Be,Ae,ne);M(y,Ve)&&_(ae),_e.__version=oe.version,y.onUpdate&&y.onUpdate(y)}R.__version=y.version}function Q(R,y,K){if(y.image.length!==6)return;const ae=Y(R,y),ie=y.source;t.bindTexture(i.TEXTURE_CUBE_MAP,R.__webglTexture,i.TEXTURE0+K);const oe=n.get(ie);if(ie.version!==oe.__version||ae===!0){t.activeTexture(i.TEXTURE0+K);const _e=qe.getPrimaries(qe.workingColorSpace),fe=y.colorSpace===Ht?null:qe.getPrimaries(y.colorSpace),me=y.colorSpace===Ht||_e===fe?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,me);const ye=y.isCompressedTexture||y.image[0].isCompressedTexture,De=y.image[0]&&y.image[0].isDataTexture,ne=[];for(let re=0;re<6;re++)!ye&&!De?ne[re]=v(y.image[re],!1,!0,a.maxCubemapSize):ne[re]=De?y.image[re].image:y.image[re],ne[re]=Re(y,ne[re]);const Ve=ne[0],Be=m(Ve)||r,Ae=o.convert(y.format,y.colorSpace),we=o.convert(y.type),ge=w(y.internalFormat,Ae,we,y.colorSpace),Le=r&&y.isVideoTexture!==!0,He=oe.__version===void 0||ae===!0;let it=P(y,Ve,Be);I(i.TEXTURE_CUBE_MAP,y,Be);let Ie;if(ye){Le&&He&&t.texStorage2D(i.TEXTURE_CUBE_MAP,it,ge,Ve.width,Ve.height);for(let re=0;re<6;re++){Ie=ne[re].mipmaps;for(let U=0;U<Ie.length;U++){const he=Ie[U];y.format!==Zt?Ae!==null?Le?t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,U,0,0,he.width,he.height,Ae,he.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,U,ge,he.width,he.height,0,he.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Le?t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,U,0,0,he.width,he.height,Ae,we,he.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,U,ge,he.width,he.height,0,Ae,we,he.data)}}}else{Ie=y.mipmaps,Le&&He&&(Ie.length>0&&it++,t.texStorage2D(i.TEXTURE_CUBE_MAP,it,ge,ne[0].width,ne[0].height));for(let re=0;re<6;re++)if(De){Le?t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,ne[re].width,ne[re].height,Ae,we,ne[re].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,ge,ne[re].width,ne[re].height,0,Ae,we,ne[re].data);for(let U=0;U<Ie.length;U++){const ue=Ie[U].image[re].image;Le?t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,U+1,0,0,ue.width,ue.height,Ae,we,ue.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,U+1,ge,ue.width,ue.height,0,Ae,we,ue.data)}}else{Le?t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,Ae,we,ne[re]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,ge,Ae,we,ne[re]);for(let U=0;U<Ie.length;U++){const he=Ie[U];Le?t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,U+1,0,0,Ae,we,he.image[re]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+re,U+1,ge,Ae,we,he.image[re])}}}M(y,Be)&&_(i.TEXTURE_CUBE_MAP),oe.__version=ie.version,y.onUpdate&&y.onUpdate(y)}R.__version=y.version}function te(R,y,K,ae,ie,oe){const _e=o.convert(K.format,K.colorSpace),fe=o.convert(K.type),me=w(K.internalFormat,_e,fe,K.colorSpace);if(!n.get(y).__hasExternalTextures){const De=Math.max(1,y.width>>oe),ne=Math.max(1,y.height>>oe);ie===i.TEXTURE_3D||ie===i.TEXTURE_2D_ARRAY?t.texImage3D(ie,oe,me,De,ne,y.depth,0,_e,fe,null):t.texImage2D(ie,oe,me,De,ne,0,_e,fe,null)}t.bindFramebuffer(i.FRAMEBUFFER,R),ve(y)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ae,ie,n.get(K).__webglTexture,0,ke(y)):(ie===i.TEXTURE_2D||ie>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ie<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,ae,ie,n.get(K).__webglTexture,oe),t.bindFramebuffer(i.FRAMEBUFFER,null)}function se(R,y,K){if(i.bindRenderbuffer(i.RENDERBUFFER,R),y.depthBuffer&&!y.stencilBuffer){let ae=r===!0?i.DEPTH_COMPONENT24:i.DEPTH_COMPONENT16;if(K||ve(y)){const ie=y.depthTexture;ie&&ie.isDepthTexture&&(ie.type===An?ae=i.DEPTH_COMPONENT32F:ie.type===kn&&(ae=i.DEPTH_COMPONENT24));const oe=ke(y);ve(y)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,oe,ae,y.width,y.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,oe,ae,y.width,y.height)}else i.renderbufferStorage(i.RENDERBUFFER,ae,y.width,y.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,R)}else if(y.depthBuffer&&y.stencilBuffer){const ae=ke(y);K&&ve(y)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,ae,i.DEPTH24_STENCIL8,y.width,y.height):ve(y)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ae,i.DEPTH24_STENCIL8,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,y.width,y.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,R)}else{const ae=y.isWebGLMultipleRenderTargets===!0?y.texture:[y.texture];for(let ie=0;ie<ae.length;ie++){const oe=ae[ie],_e=o.convert(oe.format,oe.colorSpace),fe=o.convert(oe.type),me=w(oe.internalFormat,_e,fe,oe.colorSpace),ye=ke(y);K&&ve(y)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,ye,me,y.width,y.height):ve(y)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ye,me,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,me,y.width,y.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function pe(R,y){if(y&&y.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,R),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(y.depthTexture).__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),D(y.depthTexture,0);const ae=n.get(y.depthTexture).__webglTexture,ie=ke(y);if(y.depthTexture.format===$n)ve(y)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ae,0,ie):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ae,0);else if(y.depthTexture.format===Ni)ve(y)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ae,0,ie):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ae,0);else throw new Error("Unknown depthTexture format")}function ee(R){const y=n.get(R),K=R.isWebGLCubeRenderTarget===!0;if(R.depthTexture&&!y.__autoAllocateDepthBuffer){if(K)throw new Error("target.depthTexture not supported in Cube render targets");pe(y.__webglFramebuffer,R)}else if(K){y.__webglDepthbuffer=[];for(let ae=0;ae<6;ae++)t.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer[ae]),y.__webglDepthbuffer[ae]=i.createRenderbuffer(),se(y.__webglDepthbuffer[ae],R,!1)}else t.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer=i.createRenderbuffer(),se(y.__webglDepthbuffer,R,!1);t.bindFramebuffer(i.FRAMEBUFFER,null)}function ce(R,y,K){const ae=n.get(R);y!==void 0&&te(ae.__webglFramebuffer,R,R.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),K!==void 0&&ee(R)}function O(R){const y=R.texture,K=n.get(R),ae=n.get(y);R.addEventListener("dispose",S),R.isWebGLMultipleRenderTargets!==!0&&(ae.__webglTexture===void 0&&(ae.__webglTexture=i.createTexture()),ae.__version=y.version,s.memory.textures++);const ie=R.isWebGLCubeRenderTarget===!0,oe=R.isWebGLMultipleRenderTargets===!0,_e=m(R)||r;if(ie){K.__webglFramebuffer=[];for(let fe=0;fe<6;fe++)if(r&&y.mipmaps&&y.mipmaps.length>0){K.__webglFramebuffer[fe]=[];for(let me=0;me<y.mipmaps.length;me++)K.__webglFramebuffer[fe][me]=i.createFramebuffer()}else K.__webglFramebuffer[fe]=i.createFramebuffer()}else{if(r&&y.mipmaps&&y.mipmaps.length>0){K.__webglFramebuffer=[];for(let fe=0;fe<y.mipmaps.length;fe++)K.__webglFramebuffer[fe]=i.createFramebuffer()}else K.__webglFramebuffer=i.createFramebuffer();if(oe)if(a.drawBuffers){const fe=R.texture;for(let me=0,ye=fe.length;me<ye;me++){const De=n.get(fe[me]);De.__webglTexture===void 0&&(De.__webglTexture=i.createTexture(),s.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(r&&R.samples>0&&ve(R)===!1){const fe=oe?y:[y];K.__webglMultisampledFramebuffer=i.createFramebuffer(),K.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,K.__webglMultisampledFramebuffer);for(let me=0;me<fe.length;me++){const ye=fe[me];K.__webglColorRenderbuffer[me]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,K.__webglColorRenderbuffer[me]);const De=o.convert(ye.format,ye.colorSpace),ne=o.convert(ye.type),Ve=w(ye.internalFormat,De,ne,ye.colorSpace,R.isXRRenderTarget===!0),Be=ke(R);i.renderbufferStorageMultisample(i.RENDERBUFFER,Be,Ve,R.width,R.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+me,i.RENDERBUFFER,K.__webglColorRenderbuffer[me])}i.bindRenderbuffer(i.RENDERBUFFER,null),R.depthBuffer&&(K.__webglDepthRenderbuffer=i.createRenderbuffer(),se(K.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ie){t.bindTexture(i.TEXTURE_CUBE_MAP,ae.__webglTexture),I(i.TEXTURE_CUBE_MAP,y,_e);for(let fe=0;fe<6;fe++)if(r&&y.mipmaps&&y.mipmaps.length>0)for(let me=0;me<y.mipmaps.length;me++)te(K.__webglFramebuffer[fe][me],R,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+fe,me);else te(K.__webglFramebuffer[fe],R,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+fe,0);M(y,_e)&&_(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(oe){const fe=R.texture;for(let me=0,ye=fe.length;me<ye;me++){const De=fe[me],ne=n.get(De);t.bindTexture(i.TEXTURE_2D,ne.__webglTexture),I(i.TEXTURE_2D,De,_e),te(K.__webglFramebuffer,R,De,i.COLOR_ATTACHMENT0+me,i.TEXTURE_2D,0),M(De,_e)&&_(i.TEXTURE_2D)}t.unbindTexture()}else{let fe=i.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(r?fe=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),t.bindTexture(fe,ae.__webglTexture),I(fe,y,_e),r&&y.mipmaps&&y.mipmaps.length>0)for(let me=0;me<y.mipmaps.length;me++)te(K.__webglFramebuffer[me],R,y,i.COLOR_ATTACHMENT0,fe,me);else te(K.__webglFramebuffer,R,y,i.COLOR_ATTACHMENT0,fe,0);M(y,_e)&&_(fe),t.unbindTexture()}R.depthBuffer&&ee(R)}function Ye(R){const y=m(R)||r,K=R.isWebGLMultipleRenderTargets===!0?R.texture:[R.texture];for(let ae=0,ie=K.length;ae<ie;ae++){const oe=K[ae];if(M(oe,y)){const _e=R.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,fe=n.get(oe).__webglTexture;t.bindTexture(_e,fe),_(_e),t.unbindTexture()}}}function Me(R){if(r&&R.samples>0&&ve(R)===!1){const y=R.isWebGLMultipleRenderTargets?R.texture:[R.texture],K=R.width,ae=R.height;let ie=i.COLOR_BUFFER_BIT;const oe=[],_e=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,fe=n.get(R),me=R.isWebGLMultipleRenderTargets===!0;if(me)for(let ye=0;ye<y.length;ye++)t.bindFramebuffer(i.FRAMEBUFFER,fe.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ye,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,fe.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ye,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,fe.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,fe.__webglFramebuffer);for(let ye=0;ye<y.length;ye++){oe.push(i.COLOR_ATTACHMENT0+ye),R.depthBuffer&&oe.push(_e);const De=fe.__ignoreDepthValues!==void 0?fe.__ignoreDepthValues:!1;if(De===!1&&(R.depthBuffer&&(ie|=i.DEPTH_BUFFER_BIT),R.stencilBuffer&&(ie|=i.STENCIL_BUFFER_BIT)),me&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,fe.__webglColorRenderbuffer[ye]),De===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[_e]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[_e])),me){const ne=n.get(y[ye]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,ne,0)}i.blitFramebuffer(0,0,K,ae,0,0,K,ae,ie,i.NEAREST),c&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,oe)}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),me)for(let ye=0;ye<y.length;ye++){t.bindFramebuffer(i.FRAMEBUFFER,fe.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ye,i.RENDERBUFFER,fe.__webglColorRenderbuffer[ye]);const De=n.get(y[ye]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,fe.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ye,i.TEXTURE_2D,De,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,fe.__webglMultisampledFramebuffer)}}function ke(R){return Math.min(a.maxSamples,R.samples)}function ve(R){const y=n.get(R);return r&&R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function Ze(R){const y=s.render.frame;h.get(R)!==y&&(h.set(R,y),R.update())}function Re(R,y){const K=R.colorSpace,ae=R.format,ie=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||R.format===ks||K!==xn&&K!==Ht&&(qe.getTransfer(K)===Qe?r===!1?e.has("EXT_sRGB")===!0&&ae===Zt?(R.format=ks,R.minFilter=Ot,R.generateMipmaps=!1):y=Gc.sRGBToLinear(y):(ae!==Zt||ie!==Cn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",K)),y}this.allocateTextureUnit=E,this.resetTextureUnits=V,this.setTexture2D=D,this.setTexture2DArray=j,this.setTexture3D=F,this.setTextureCube=z,this.rebindTextures=ce,this.setupRenderTarget=O,this.updateRenderTargetMipmap=Ye,this.updateMultisampleRenderTarget=Me,this.setupDepthRenderbuffer=ee,this.setupFrameBufferTexture=te,this.useMultisampledRTT=ve}function z0(i,e,t){const n=t.isWebGL2;function a(o,s=Ht){let r;const l=qe.getTransfer(s);if(o===Cn)return i.UNSIGNED_BYTE;if(o===Rc)return i.UNSIGNED_SHORT_4_4_4_4;if(o===Cc)return i.UNSIGNED_SHORT_5_5_5_1;if(o===lf)return i.BYTE;if(o===cf)return i.SHORT;if(o===Xs)return i.UNSIGNED_SHORT;if(o===Pc)return i.INT;if(o===kn)return i.UNSIGNED_INT;if(o===An)return i.FLOAT;if(o===sa)return n?i.HALF_FLOAT:(r=e.get("OES_texture_half_float"),r!==null?r.HALF_FLOAT_OES:null);if(o===hf)return i.ALPHA;if(o===Zt)return i.RGBA;if(o===uf)return i.LUMINANCE;if(o===ff)return i.LUMINANCE_ALPHA;if(o===$n)return i.DEPTH_COMPONENT;if(o===Ni)return i.DEPTH_STENCIL;if(o===ks)return r=e.get("EXT_sRGB"),r!==null?r.SRGB_ALPHA_EXT:null;if(o===df)return i.RED;if(o===Lc)return i.RED_INTEGER;if(o===Nc)return i.RG;if(o===Dc)return i.RG_INTEGER;if(o===Uc)return i.RGBA_INTEGER;if(o===Io||o===Fo||o===zo||o===Oo)if(l===Qe)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(o===Io)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(o===Fo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(o===zo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(o===Oo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(o===Io)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(o===Fo)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(o===zo)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(o===Oo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(o===Nr||o===Dr||o===Ur||o===Ir)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(o===Nr)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(o===Dr)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(o===Ur)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(o===Ir)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(o===Ic)return r=e.get("WEBGL_compressed_texture_etc1"),r!==null?r.COMPRESSED_RGB_ETC1_WEBGL:null;if(o===Fr||o===zr)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(o===Fr)return l===Qe?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(o===zr)return l===Qe?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(o===Or||o===Br||o===Gr||o===Hr||o===Vr||o===Wr||o===qr||o===Xr||o===Yr||o===jr||o===$r||o===Kr||o===Zr||o===Jr)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(o===Or)return l===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(o===Br)return l===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(o===Gr)return l===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(o===Hr)return l===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(o===Vr)return l===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(o===Wr)return l===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(o===qr)return l===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(o===Xr)return l===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(o===Yr)return l===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(o===jr)return l===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(o===$r)return l===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(o===Kr)return l===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(o===Zr)return l===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(o===Jr)return l===Qe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(o===Bo||o===Qr||o===el)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(o===Bo)return l===Qe?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(o===Qr)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(o===el)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(o===pf||o===tl||o===nl||o===il)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(o===Bo)return r.COMPRESSED_RED_RGTC1_EXT;if(o===tl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(o===nl)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(o===il)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return o===jn?n?i.UNSIGNED_INT_24_8:(r=e.get("WEBGL_depth_texture"),r!==null?r.UNSIGNED_INT_24_8_WEBGL:null):i[o]!==void 0?i[o]:null}return{convert:a}}class O0 extends $t{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Ji extends wt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const B0={type:"move"};class cs{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ji,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ji,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new X,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new X),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ji,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new X,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new X),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let a=null,o=null,s=null;const r=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){s=!0;for(const v of e.hand.values()){const m=t.getJointPose(v,n),d=this._getHandJoint(c,v);m!==null&&(d.matrix.fromArray(m.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=m.radius),d.visible=m!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],f=h.position.distanceTo(u.position),p=.02,g=.005;c.inputState.pinching&&f>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(o=t.getPose(e.gripSpace,n),o!==null&&(l.matrix.fromArray(o.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,o.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(o.linearVelocity)):l.hasLinearVelocity=!1,o.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(o.angularVelocity)):l.hasAngularVelocity=!1));r!==null&&(a=t.getPose(e.targetRaySpace,n),a===null&&o!==null&&(a=o),a!==null&&(r.matrix.fromArray(a.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,a.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(a.linearVelocity)):r.hasLinearVelocity=!1,a.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(a.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(B0)))}return r!==null&&(r.visible=a!==null),l!==null&&(l.visible=o!==null),c!==null&&(c.visible=s!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Ji;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class G0 extends Fi{constructor(e,t){super();const n=this;let a=null,o=1,s=null,r="local-floor",l=1,c=null,h=null,u=null,f=null,p=null,g=null;const v=t.getContextAttributes();let m=null,d=null;const M=[],_=[],w=new Ge;let P=null;const k=new $t;k.layers.enable(1),k.viewport=new lt;const T=new $t;T.layers.enable(2),T.viewport=new lt;const S=[k,T],x=new O0;x.layers.enable(1),x.layers.enable(2);let b=null,N=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(I){let Y=M[I];return Y===void 0&&(Y=new cs,M[I]=Y),Y.getTargetRaySpace()},this.getControllerGrip=function(I){let Y=M[I];return Y===void 0&&(Y=new cs,M[I]=Y),Y.getGripSpace()},this.getHand=function(I){let Y=M[I];return Y===void 0&&(Y=new cs,M[I]=Y),Y.getHandSpace()};function L(I){const Y=_.indexOf(I.inputSource);if(Y===-1)return;const W=M[Y];W!==void 0&&(W.update(I.inputSource,I.frame,c||s),W.dispatchEvent({type:I.type,data:I.inputSource}))}function V(){a.removeEventListener("select",L),a.removeEventListener("selectstart",L),a.removeEventListener("selectend",L),a.removeEventListener("squeeze",L),a.removeEventListener("squeezestart",L),a.removeEventListener("squeezeend",L),a.removeEventListener("end",V),a.removeEventListener("inputsourceschange",E);for(let I=0;I<M.length;I++){const Y=_[I];Y!==null&&(_[I]=null,M[I].disconnect(Y))}b=null,N=null,e.setRenderTarget(m),p=null,f=null,u=null,a=null,d=null,q.stop(),n.isPresenting=!1,e.setPixelRatio(P),e.setSize(w.width,w.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(I){o=I,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(I){r=I,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||s},this.setReferenceSpace=function(I){c=I},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return a},this.setSession=async function(I){if(a=I,a!==null){if(m=e.getRenderTarget(),a.addEventListener("select",L),a.addEventListener("selectstart",L),a.addEventListener("selectend",L),a.addEventListener("squeeze",L),a.addEventListener("squeezestart",L),a.addEventListener("squeezeend",L),a.addEventListener("end",V),a.addEventListener("inputsourceschange",E),v.xrCompatible!==!0&&await t.makeXRCompatible(),P=e.getPixelRatio(),e.getSize(w),a.renderState.layers===void 0||e.capabilities.isWebGL2===!1){const Y={antialias:a.renderState.layers===void 0?v.antialias:!0,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:o};p=new XRWebGLLayer(a,t,Y),a.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),d=new Jn(p.framebufferWidth,p.framebufferHeight,{format:Zt,type:Cn,colorSpace:e.outputColorSpace,stencilBuffer:v.stencil})}else{let Y=null,W=null,Q=null;v.depth&&(Q=v.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Y=v.stencil?Ni:$n,W=v.stencil?jn:kn);const te={colorFormat:t.RGBA8,depthFormat:Q,scaleFactor:o};u=new XRWebGLBinding(a,t),f=u.createProjectionLayer(te),a.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),d=new Jn(f.textureWidth,f.textureHeight,{format:Zt,type:Cn,depthTexture:new Jc(f.textureWidth,f.textureHeight,W,void 0,void 0,void 0,void 0,void 0,void 0,Y),stencilBuffer:v.stencil,colorSpace:e.outputColorSpace,samples:v.antialias?4:0});const se=e.properties.get(d);se.__ignoreDepthValues=f.ignoreDepthValues}d.isXRRenderTarget=!0,this.setFoveation(l),c=null,s=await a.requestReferenceSpace(r),q.setContext(a),q.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(a!==null)return a.environmentBlendMode};function E(I){for(let Y=0;Y<I.removed.length;Y++){const W=I.removed[Y],Q=_.indexOf(W);Q>=0&&(_[Q]=null,M[Q].disconnect(W))}for(let Y=0;Y<I.added.length;Y++){const W=I.added[Y];let Q=_.indexOf(W);if(Q===-1){for(let se=0;se<M.length;se++)if(se>=_.length){_.push(W),Q=se;break}else if(_[se]===null){_[se]=W,Q=se;break}if(Q===-1)break}const te=M[Q];te&&te.connect(W)}}const C=new X,D=new X;function j(I,Y,W){C.setFromMatrixPosition(Y.matrixWorld),D.setFromMatrixPosition(W.matrixWorld);const Q=C.distanceTo(D),te=Y.projectionMatrix.elements,se=W.projectionMatrix.elements,pe=te[14]/(te[10]-1),ee=te[14]/(te[10]+1),ce=(te[9]+1)/te[5],O=(te[9]-1)/te[5],Ye=(te[8]-1)/te[0],Me=(se[8]+1)/se[0],ke=pe*Ye,ve=pe*Me,Ze=Q/(-Ye+Me),Re=Ze*-Ye;Y.matrixWorld.decompose(I.position,I.quaternion,I.scale),I.translateX(Re),I.translateZ(Ze),I.matrixWorld.compose(I.position,I.quaternion,I.scale),I.matrixWorldInverse.copy(I.matrixWorld).invert();const R=pe+Ze,y=ee+Ze,K=ke-Re,ae=ve+(Q-Re),ie=ce*ee/y*R,oe=O*ee/y*R;I.projectionMatrix.makePerspective(K,ae,ie,oe,R,y),I.projectionMatrixInverse.copy(I.projectionMatrix).invert()}function F(I,Y){Y===null?I.matrixWorld.copy(I.matrix):I.matrixWorld.multiplyMatrices(Y.matrixWorld,I.matrix),I.matrixWorldInverse.copy(I.matrixWorld).invert()}this.updateCamera=function(I){if(a===null)return;x.near=T.near=k.near=I.near,x.far=T.far=k.far=I.far,(b!==x.near||N!==x.far)&&(a.updateRenderState({depthNear:x.near,depthFar:x.far}),b=x.near,N=x.far);const Y=I.parent,W=x.cameras;F(x,Y);for(let Q=0;Q<W.length;Q++)F(W[Q],Y);W.length===2?j(x,k,T):x.projectionMatrix.copy(k.projectionMatrix),z(I,x,Y)};function z(I,Y,W){W===null?I.matrix.copy(Y.matrixWorld):(I.matrix.copy(W.matrixWorld),I.matrix.invert(),I.matrix.multiply(Y.matrixWorld)),I.matrix.decompose(I.position,I.quaternion,I.scale),I.updateMatrixWorld(!0),I.projectionMatrix.copy(Y.projectionMatrix),I.projectionMatrixInverse.copy(Y.projectionMatrixInverse),I.isPerspectiveCamera&&(I.fov=ra*2*Math.atan(1/I.projectionMatrix.elements[5]),I.zoom=1)}this.getCamera=function(){return x},this.getFoveation=function(){if(!(f===null&&p===null))return l},this.setFoveation=function(I){l=I,f!==null&&(f.fixedFoveation=I),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=I)};let G=null;function B(I,Y){if(h=Y.getViewerPose(c||s),g=Y,h!==null){const W=h.views;p!==null&&(e.setRenderTargetFramebuffer(d,p.framebuffer),e.setRenderTarget(d));let Q=!1;W.length!==x.cameras.length&&(x.cameras.length=0,Q=!0);for(let te=0;te<W.length;te++){const se=W[te];let pe=null;if(p!==null)pe=p.getViewport(se);else{const ce=u.getViewSubImage(f,se);pe=ce.viewport,te===0&&(e.setRenderTargetTextures(d,ce.colorTexture,f.ignoreDepthValues?void 0:ce.depthStencilTexture),e.setRenderTarget(d))}let ee=S[te];ee===void 0&&(ee=new $t,ee.layers.enable(te),ee.viewport=new lt,S[te]=ee),ee.matrix.fromArray(se.transform.matrix),ee.matrix.decompose(ee.position,ee.quaternion,ee.scale),ee.projectionMatrix.fromArray(se.projectionMatrix),ee.projectionMatrixInverse.copy(ee.projectionMatrix).invert(),ee.viewport.set(pe.x,pe.y,pe.width,pe.height),te===0&&(x.matrix.copy(ee.matrix),x.matrix.decompose(x.position,x.quaternion,x.scale)),Q===!0&&x.cameras.push(ee)}}for(let W=0;W<M.length;W++){const Q=_[W],te=M[W];Q!==null&&te!==void 0&&te.update(Q,Y,c||s)}G&&G(I,Y),Y.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Y}),g=null}const q=new Zc;q.setAnimationLoop(B),this.setAnimationLoop=function(I){G=I},this.dispose=function(){}}}function H0(i,e){function t(m,d){m.matrixAutoUpdate===!0&&m.updateMatrix(),d.value.copy(m.matrix)}function n(m,d){d.color.getRGB(m.fogColor.value,jc(i)),d.isFog?(m.fogNear.value=d.near,m.fogFar.value=d.far):d.isFogExp2&&(m.fogDensity.value=d.density)}function a(m,d,M,_,w){d.isMeshBasicMaterial||d.isMeshLambertMaterial?o(m,d):d.isMeshToonMaterial?(o(m,d),u(m,d)):d.isMeshPhongMaterial?(o(m,d),h(m,d)):d.isMeshStandardMaterial?(o(m,d),f(m,d),d.isMeshPhysicalMaterial&&p(m,d,w)):d.isMeshMatcapMaterial?(o(m,d),g(m,d)):d.isMeshDepthMaterial?o(m,d):d.isMeshDistanceMaterial?(o(m,d),v(m,d)):d.isMeshNormalMaterial?o(m,d):d.isLineBasicMaterial?(s(m,d),d.isLineDashedMaterial&&r(m,d)):d.isPointsMaterial?l(m,d,M,_):d.isSpriteMaterial?c(m,d):d.isShadowMaterial?(m.color.value.copy(d.color),m.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function o(m,d){m.opacity.value=d.opacity,d.color&&m.diffuse.value.copy(d.color),d.emissive&&m.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(m.map.value=d.map,t(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.bumpMap&&(m.bumpMap.value=d.bumpMap,t(d.bumpMap,m.bumpMapTransform),m.bumpScale.value=d.bumpScale,d.side===Ut&&(m.bumpScale.value*=-1)),d.normalMap&&(m.normalMap.value=d.normalMap,t(d.normalMap,m.normalMapTransform),m.normalScale.value.copy(d.normalScale),d.side===Ut&&m.normalScale.value.negate()),d.displacementMap&&(m.displacementMap.value=d.displacementMap,t(d.displacementMap,m.displacementMapTransform),m.displacementScale.value=d.displacementScale,m.displacementBias.value=d.displacementBias),d.emissiveMap&&(m.emissiveMap.value=d.emissiveMap,t(d.emissiveMap,m.emissiveMapTransform)),d.specularMap&&(m.specularMap.value=d.specularMap,t(d.specularMap,m.specularMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest);const M=e.get(d).envMap;if(M&&(m.envMap.value=M,m.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=d.reflectivity,m.ior.value=d.ior,m.refractionRatio.value=d.refractionRatio),d.lightMap){m.lightMap.value=d.lightMap;const _=i._useLegacyLights===!0?Math.PI:1;m.lightMapIntensity.value=d.lightMapIntensity*_,t(d.lightMap,m.lightMapTransform)}d.aoMap&&(m.aoMap.value=d.aoMap,m.aoMapIntensity.value=d.aoMapIntensity,t(d.aoMap,m.aoMapTransform))}function s(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,d.map&&(m.map.value=d.map,t(d.map,m.mapTransform))}function r(m,d){m.dashSize.value=d.dashSize,m.totalSize.value=d.dashSize+d.gapSize,m.scale.value=d.scale}function l(m,d,M,_){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.size.value=d.size*M,m.scale.value=_*.5,d.map&&(m.map.value=d.map,t(d.map,m.uvTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function c(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.rotation.value=d.rotation,d.map&&(m.map.value=d.map,t(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function h(m,d){m.specular.value.copy(d.specular),m.shininess.value=Math.max(d.shininess,1e-4)}function u(m,d){d.gradientMap&&(m.gradientMap.value=d.gradientMap)}function f(m,d){m.metalness.value=d.metalness,d.metalnessMap&&(m.metalnessMap.value=d.metalnessMap,t(d.metalnessMap,m.metalnessMapTransform)),m.roughness.value=d.roughness,d.roughnessMap&&(m.roughnessMap.value=d.roughnessMap,t(d.roughnessMap,m.roughnessMapTransform)),e.get(d).envMap&&(m.envMapIntensity.value=d.envMapIntensity)}function p(m,d,M){m.ior.value=d.ior,d.sheen>0&&(m.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),m.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(m.sheenColorMap.value=d.sheenColorMap,t(d.sheenColorMap,m.sheenColorMapTransform)),d.sheenRoughnessMap&&(m.sheenRoughnessMap.value=d.sheenRoughnessMap,t(d.sheenRoughnessMap,m.sheenRoughnessMapTransform))),d.clearcoat>0&&(m.clearcoat.value=d.clearcoat,m.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(m.clearcoatMap.value=d.clearcoatMap,t(d.clearcoatMap,m.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,t(d.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(m.clearcoatNormalMap.value=d.clearcoatNormalMap,t(d.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===Ut&&m.clearcoatNormalScale.value.negate())),d.iridescence>0&&(m.iridescence.value=d.iridescence,m.iridescenceIOR.value=d.iridescenceIOR,m.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(m.iridescenceMap.value=d.iridescenceMap,t(d.iridescenceMap,m.iridescenceMapTransform)),d.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=d.iridescenceThicknessMap,t(d.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),d.transmission>0&&(m.transmission.value=d.transmission,m.transmissionSamplerMap.value=M.texture,m.transmissionSamplerSize.value.set(M.width,M.height),d.transmissionMap&&(m.transmissionMap.value=d.transmissionMap,t(d.transmissionMap,m.transmissionMapTransform)),m.thickness.value=d.thickness,d.thicknessMap&&(m.thicknessMap.value=d.thicknessMap,t(d.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=d.attenuationDistance,m.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(m.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(m.anisotropyMap.value=d.anisotropyMap,t(d.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=d.specularIntensity,m.specularColor.value.copy(d.specularColor),d.specularColorMap&&(m.specularColorMap.value=d.specularColorMap,t(d.specularColorMap,m.specularColorMapTransform)),d.specularIntensityMap&&(m.specularIntensityMap.value=d.specularIntensityMap,t(d.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,d){d.matcap&&(m.matcap.value=d.matcap)}function v(m,d){const M=e.get(d).light;m.referencePosition.value.setFromMatrixPosition(M.matrixWorld),m.nearDistance.value=M.shadow.camera.near,m.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:a}}function V0(i,e,t,n){let a={},o={},s=[];const r=t.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(M,_){const w=_.program;n.uniformBlockBinding(M,w)}function c(M,_){let w=a[M.id];w===void 0&&(g(M),w=h(M),a[M.id]=w,M.addEventListener("dispose",m));const P=_.program;n.updateUBOMapping(M,P);const k=e.render.frame;o[M.id]!==k&&(f(M),o[M.id]=k)}function h(M){const _=u();M.__bindingPointIndex=_;const w=i.createBuffer(),P=M.__size,k=M.usage;return i.bindBuffer(i.UNIFORM_BUFFER,w),i.bufferData(i.UNIFORM_BUFFER,P,k),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,_,w),w}function u(){for(let M=0;M<r;M++)if(s.indexOf(M)===-1)return s.push(M),M;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(M){const _=a[M.id],w=M.uniforms,P=M.__cache;i.bindBuffer(i.UNIFORM_BUFFER,_);for(let k=0,T=w.length;k<T;k++){const S=Array.isArray(w[k])?w[k]:[w[k]];for(let x=0,b=S.length;x<b;x++){const N=S[x];if(p(N,k,x,P)===!0){const L=N.__offset,V=Array.isArray(N.value)?N.value:[N.value];let E=0;for(let C=0;C<V.length;C++){const D=V[C],j=v(D);typeof D=="number"||typeof D=="boolean"?(N.__data[0]=D,i.bufferSubData(i.UNIFORM_BUFFER,L+E,N.__data)):D.isMatrix3?(N.__data[0]=D.elements[0],N.__data[1]=D.elements[1],N.__data[2]=D.elements[2],N.__data[3]=0,N.__data[4]=D.elements[3],N.__data[5]=D.elements[4],N.__data[6]=D.elements[5],N.__data[7]=0,N.__data[8]=D.elements[6],N.__data[9]=D.elements[7],N.__data[10]=D.elements[8],N.__data[11]=0):(D.toArray(N.__data,E),E+=j.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,L,N.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(M,_,w,P){const k=M.value,T=_+"_"+w;if(P[T]===void 0)return typeof k=="number"||typeof k=="boolean"?P[T]=k:P[T]=k.clone(),!0;{const S=P[T];if(typeof k=="number"||typeof k=="boolean"){if(S!==k)return P[T]=k,!0}else if(S.equals(k)===!1)return S.copy(k),!0}return!1}function g(M){const _=M.uniforms;let w=0;const P=16;for(let T=0,S=_.length;T<S;T++){const x=Array.isArray(_[T])?_[T]:[_[T]];for(let b=0,N=x.length;b<N;b++){const L=x[b],V=Array.isArray(L.value)?L.value:[L.value];for(let E=0,C=V.length;E<C;E++){const D=V[E],j=v(D),F=w%P;F!==0&&P-F<j.boundary&&(w+=P-F),L.__data=new Float32Array(j.storage/Float32Array.BYTES_PER_ELEMENT),L.__offset=w,w+=j.storage}}}const k=w%P;return k>0&&(w+=P-k),M.__size=w,M.__cache={},this}function v(M){const _={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(_.boundary=4,_.storage=4):M.isVector2?(_.boundary=8,_.storage=8):M.isVector3||M.isColor?(_.boundary=16,_.storage=12):M.isVector4?(_.boundary=16,_.storage=16):M.isMatrix3?(_.boundary=48,_.storage=48):M.isMatrix4?(_.boundary=64,_.storage=64):M.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",M),_}function m(M){const _=M.target;_.removeEventListener("dispose",m);const w=s.indexOf(_.__bindingPointIndex);s.splice(w,1),i.deleteBuffer(a[_.id]),delete a[_.id],delete o[_.id]}function d(){for(const M in a)i.deleteBuffer(a[M]);s=[],a={},o={}}return{bind:l,update:c,dispose:d}}class ah{constructor(e={}){const{canvas:t=Of(),context:n=null,depth:a=!0,stencil:o=!0,alpha:s=!1,antialias:r=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=e;this.isWebGLRenderer=!0;let f;n!==null?f=n.getContextAttributes().alpha:f=s;const p=new Uint32Array(4),g=new Int32Array(4);let v=null,m=null;const d=[],M=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=vt,this._useLegacyLights=!1,this.toneMapping=Rn,this.toneMappingExposure=1;const _=this;let w=!1,P=0,k=0,T=null,S=-1,x=null;const b=new lt,N=new lt;let L=null;const V=new Oe(0);let E=0,C=t.width,D=t.height,j=1,F=null,z=null;const G=new lt(0,0,C,D),B=new lt(0,0,C,D);let q=!1;const I=new Js;let Y=!1,W=!1,Q=null;const te=new ht,se=new Ge,pe=new X,ee={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function ce(){return T===null?j:1}let O=n;function Ye(A,H){for(let Z=0;Z<A.length;Z++){const J=A[Z],$=t.getContext(J,H);if($!==null)return $}return null}try{const A={alpha:!0,depth:a,stencil:o,antialias:r,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${qs}`),t.addEventListener("webglcontextlost",re,!1),t.addEventListener("webglcontextrestored",U,!1),t.addEventListener("webglcontextcreationerror",he,!1),O===null){const H=["webgl2","webgl","experimental-webgl"];if(_.isWebGL1Renderer===!0&&H.shift(),O=Ye(H,A),O===null)throw Ye(H)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&O instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),O.getShaderPrecisionFormat===void 0&&(O.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}let Me,ke,ve,Ze,Re,R,y,K,ae,ie,oe,_e,fe,me,ye,De,ne,Ve,Be,Ae,we,ge,Le,He;function it(){Me=new Qm(O),ke=new Ym(O,Me,e),Me.init(ke),ge=new z0(O,Me,ke),ve=new I0(O,Me,ke),Ze=new ng(O),Re=new b0,R=new F0(O,Me,ve,Re,ke,ge,Ze),y=new $m(_),K=new Jm(_),ae=new hd(O,ke),Le=new qm(O,Me,ae,ke),ie=new eg(O,ae,Ze,Le),oe=new sg(O,ie,ae,Ze),Be=new og(O,ke,R),De=new jm(Re),_e=new w0(_,y,K,Me,ke,Le,De),fe=new H0(_,Re),me=new y0,ye=new R0(Me,ke),Ve=new Wm(_,y,K,ve,oe,f,l),ne=new U0(_,oe,ke),He=new V0(O,Ze,ke,ve),Ae=new Xm(O,Me,Ze,ke),we=new tg(O,Me,Ze,ke),Ze.programs=_e.programs,_.capabilities=ke,_.extensions=Me,_.properties=Re,_.renderLists=me,_.shadowMap=ne,_.state=ve,_.info=Ze}it();const Ie=new G0(_,O);this.xr=Ie,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const A=Me.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=Me.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return j},this.setPixelRatio=function(A){A!==void 0&&(j=A,this.setSize(C,D,!1))},this.getSize=function(A){return A.set(C,D)},this.setSize=function(A,H,Z=!0){if(Ie.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}C=A,D=H,t.width=Math.floor(A*j),t.height=Math.floor(H*j),Z===!0&&(t.style.width=A+"px",t.style.height=H+"px"),this.setViewport(0,0,A,H)},this.getDrawingBufferSize=function(A){return A.set(C*j,D*j).floor()},this.setDrawingBufferSize=function(A,H,Z){C=A,D=H,j=Z,t.width=Math.floor(A*Z),t.height=Math.floor(H*Z),this.setViewport(0,0,A,H)},this.getCurrentViewport=function(A){return A.copy(b)},this.getViewport=function(A){return A.copy(G)},this.setViewport=function(A,H,Z,J){A.isVector4?G.set(A.x,A.y,A.z,A.w):G.set(A,H,Z,J),ve.viewport(b.copy(G).multiplyScalar(j).floor())},this.getScissor=function(A){return A.copy(B)},this.setScissor=function(A,H,Z,J){A.isVector4?B.set(A.x,A.y,A.z,A.w):B.set(A,H,Z,J),ve.scissor(N.copy(B).multiplyScalar(j).floor())},this.getScissorTest=function(){return q},this.setScissorTest=function(A){ve.setScissorTest(q=A)},this.setOpaqueSort=function(A){F=A},this.setTransparentSort=function(A){z=A},this.getClearColor=function(A){return A.copy(Ve.getClearColor())},this.setClearColor=function(){Ve.setClearColor.apply(Ve,arguments)},this.getClearAlpha=function(){return Ve.getClearAlpha()},this.setClearAlpha=function(){Ve.setClearAlpha.apply(Ve,arguments)},this.clear=function(A=!0,H=!0,Z=!0){let J=0;if(A){let $=!1;if(T!==null){const de=T.texture.format;$=de===Uc||de===Dc||de===Lc}if($){const de=T.texture.type,xe=de===Cn||de===kn||de===Xs||de===jn||de===Rc||de===Cc,Se=Ve.getClearColor(),Te=Ve.getClearAlpha(),Ue=Se.r,Pe=Se.g,Ce=Se.b;xe?(p[0]=Ue,p[1]=Pe,p[2]=Ce,p[3]=Te,O.clearBufferuiv(O.COLOR,0,p)):(g[0]=Ue,g[1]=Pe,g[2]=Ce,g[3]=Te,O.clearBufferiv(O.COLOR,0,g))}else J|=O.COLOR_BUFFER_BIT}H&&(J|=O.DEPTH_BUFFER_BIT),Z&&(J|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),O.clear(J)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",re,!1),t.removeEventListener("webglcontextrestored",U,!1),t.removeEventListener("webglcontextcreationerror",he,!1),me.dispose(),ye.dispose(),Re.dispose(),y.dispose(),K.dispose(),oe.dispose(),Le.dispose(),He.dispose(),_e.dispose(),Ie.dispose(),Ie.removeEventListener("sessionstart",kt),Ie.removeEventListener("sessionend",Ke),Q&&(Q.dispose(),Q=null),At.stop()};function re(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function U(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;const A=Ze.autoReset,H=ne.enabled,Z=ne.autoUpdate,J=ne.needsUpdate,$=ne.type;it(),Ze.autoReset=A,ne.enabled=H,ne.autoUpdate=Z,ne.needsUpdate=J,ne.type=$}function he(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function ue(A){const H=A.target;H.removeEventListener("dispose",ue),Ee(H)}function Ee(A){be(A),Re.remove(A)}function be(A){const H=Re.get(A).programs;H!==void 0&&(H.forEach(function(Z){_e.releaseProgram(Z)}),A.isShaderMaterial&&_e.releaseShaderCache(A))}this.renderBufferDirect=function(A,H,Z,J,$,de){H===null&&(H=ee);const xe=$.isMesh&&$.matrixWorld.determinant()<0,Se=fh(A,H,Z,J,$);ve.setMaterial(J,xe);let Te=Z.index,Ue=1;if(J.wireframe===!0){if(Te=ie.getWireframeAttribute(Z),Te===void 0)return;Ue=2}const Pe=Z.drawRange,Ce=Z.attributes.position;let ot=Pe.start*Ue,It=(Pe.start+Pe.count)*Ue;de!==null&&(ot=Math.max(ot,de.start*Ue),It=Math.min(It,(de.start+de.count)*Ue)),Te!==null?(ot=Math.max(ot,0),It=Math.min(It,Te.count)):Ce!=null&&(ot=Math.max(ot,0),It=Math.min(It,Ce.count));const pt=It-ot;if(pt<0||pt===1/0)return;Le.setup($,J,Se,Z,Te);let rn,tt=Ae;if(Te!==null&&(rn=ae.get(Te),tt=we,tt.setIndex(rn)),$.isMesh)J.wireframe===!0?(ve.setLineWidth(J.wireframeLinewidth*ce()),tt.setMode(O.LINES)):tt.setMode(O.TRIANGLES);else if($.isLine){let Fe=J.linewidth;Fe===void 0&&(Fe=1),ve.setLineWidth(Fe*ce()),$.isLineSegments?tt.setMode(O.LINES):$.isLineLoop?tt.setMode(O.LINE_LOOP):tt.setMode(O.LINE_STRIP)}else $.isPoints?tt.setMode(O.POINTS):$.isSprite&&tt.setMode(O.TRIANGLES);if($.isBatchedMesh)tt.renderMultiDraw($._multiDrawStarts,$._multiDrawCounts,$._multiDrawCount);else if($.isInstancedMesh)tt.renderInstances(ot,pt,$.count);else if(Z.isInstancedBufferGeometry){const Fe=Z._maxInstanceCount!==void 0?Z._maxInstanceCount:1/0,yo=Math.min(Z.instanceCount,Fe);tt.renderInstances(ot,pt,yo)}else tt.render(ot,pt)};function je(A,H,Z){A.transparent===!0&&A.side===mn&&A.forceSinglePass===!1?(A.side=Ut,A.needsUpdate=!0,pa(A,H,Z),A.side=Dn,A.needsUpdate=!0,pa(A,H,Z),A.side=mn):pa(A,H,Z)}this.compile=function(A,H,Z=null){Z===null&&(Z=A),m=ye.get(Z),m.init(),M.push(m),Z.traverseVisible(function($){$.isLight&&$.layers.test(H.layers)&&(m.pushLight($),$.castShadow&&m.pushShadow($))}),A!==Z&&A.traverseVisible(function($){$.isLight&&$.layers.test(H.layers)&&(m.pushLight($),$.castShadow&&m.pushShadow($))}),m.setupLights(_._useLegacyLights);const J=new Set;return A.traverse(function($){const de=$.material;if(de)if(Array.isArray(de))for(let xe=0;xe<de.length;xe++){const Se=de[xe];je(Se,Z,$),J.add(Se)}else je(de,Z,$),J.add(de)}),M.pop(),m=null,J},this.compileAsync=function(A,H,Z=null){const J=this.compile(A,H,Z);return new Promise($=>{function de(){if(J.forEach(function(xe){Re.get(xe).currentProgram.isReady()&&J.delete(xe)}),J.size===0){$(A);return}setTimeout(de,10)}Me.get("KHR_parallel_shader_compile")!==null?de():setTimeout(de,10)})};let $e=null;function dt(A){$e&&$e(A)}function kt(){At.stop()}function Ke(){At.start()}const At=new Zc;At.setAnimationLoop(dt),typeof self<"u"&&At.setContext(self),this.setAnimationLoop=function(A){$e=A,Ie.setAnimationLoop(A),A===null?At.stop():At.start()},Ie.addEventListener("sessionstart",kt),Ie.addEventListener("sessionend",Ke),this.render=function(A,H){if(H!==void 0&&H.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),H.parent===null&&H.matrixWorldAutoUpdate===!0&&H.updateMatrixWorld(),Ie.enabled===!0&&Ie.isPresenting===!0&&(Ie.cameraAutoUpdate===!0&&Ie.updateCamera(H),H=Ie.getCamera()),A.isScene===!0&&A.onBeforeRender(_,A,H,T),m=ye.get(A,M.length),m.init(),M.push(m),te.multiplyMatrices(H.projectionMatrix,H.matrixWorldInverse),I.setFromProjectionMatrix(te),W=this.localClippingEnabled,Y=De.init(this.clippingPlanes,W),v=me.get(A,d.length),v.init(),d.push(v),en(A,H,0,_.sortObjects),v.finish(),_.sortObjects===!0&&v.sort(F,z),this.info.render.frame++,Y===!0&&De.beginShadows();const Z=m.state.shadowsArray;if(ne.render(Z,A,H),Y===!0&&De.endShadows(),this.info.autoReset===!0&&this.info.reset(),Ve.render(v,A),m.setupLights(_._useLegacyLights),H.isArrayCamera){const J=H.cameras;for(let $=0,de=J.length;$<de;$++){const xe=J[$];tr(v,A,xe,xe.viewport)}}else tr(v,A,H);T!==null&&(R.updateMultisampleRenderTarget(T),R.updateRenderTargetMipmap(T)),A.isScene===!0&&A.onAfterRender(_,A,H),Le.resetDefaultState(),S=-1,x=null,M.pop(),M.length>0?m=M[M.length-1]:m=null,d.pop(),d.length>0?v=d[d.length-1]:v=null};function en(A,H,Z,J){if(A.visible===!1)return;if(A.layers.test(H.layers)){if(A.isGroup)Z=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(H);else if(A.isLight)m.pushLight(A),A.castShadow&&m.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||I.intersectsSprite(A)){J&&pe.setFromMatrixPosition(A.matrixWorld).applyMatrix4(te);const xe=oe.update(A),Se=A.material;Se.visible&&v.push(A,xe,Se,Z,pe.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||I.intersectsObject(A))){const xe=oe.update(A),Se=A.material;if(J&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),pe.copy(A.boundingSphere.center)):(xe.boundingSphere===null&&xe.computeBoundingSphere(),pe.copy(xe.boundingSphere.center)),pe.applyMatrix4(A.matrixWorld).applyMatrix4(te)),Array.isArray(Se)){const Te=xe.groups;for(let Ue=0,Pe=Te.length;Ue<Pe;Ue++){const Ce=Te[Ue],ot=Se[Ce.materialIndex];ot&&ot.visible&&v.push(A,xe,ot,Z,pe.z,Ce)}}else Se.visible&&v.push(A,xe,Se,Z,pe.z,null)}}const de=A.children;for(let xe=0,Se=de.length;xe<Se;xe++)en(de[xe],H,Z,J)}function tr(A,H,Z,J){const $=A.opaque,de=A.transmissive,xe=A.transparent;m.setupLightsView(Z),Y===!0&&De.setGlobalState(_.clippingPlanes,Z),de.length>0&&uh($,de,H,Z),J&&ve.viewport(b.copy(J)),$.length>0&&da($,H,Z),de.length>0&&da(de,H,Z),xe.length>0&&da(xe,H,Z),ve.buffers.depth.setTest(!0),ve.buffers.depth.setMask(!0),ve.buffers.color.setMask(!0),ve.setPolygonOffset(!1)}function uh(A,H,Z,J){if((Z.isScene===!0?Z.overrideMaterial:null)!==null)return;const de=ke.isWebGL2;Q===null&&(Q=new Jn(1,1,{generateMipmaps:!0,type:Me.has("EXT_color_buffer_half_float")?sa:Cn,minFilter:Li,samples:de?4:0})),_.getDrawingBufferSize(se),de?Q.setSize(se.x,se.y):Q.setSize(uo(se.x),uo(se.y));const xe=_.getRenderTarget();_.setRenderTarget(Q),_.getClearColor(V),E=_.getClearAlpha(),E<1&&_.setClearColor(16777215,.5),_.clear();const Se=_.toneMapping;_.toneMapping=Rn,da(A,Z,J),R.updateMultisampleRenderTarget(Q),R.updateRenderTargetMipmap(Q);let Te=!1;for(let Ue=0,Pe=H.length;Ue<Pe;Ue++){const Ce=H[Ue],ot=Ce.object,It=Ce.geometry,pt=Ce.material,rn=Ce.group;if(pt.side===mn&&ot.layers.test(J.layers)){const tt=pt.side;pt.side=Ut,pt.needsUpdate=!0,nr(ot,Z,J,It,pt,rn),pt.side=tt,pt.needsUpdate=!0,Te=!0}}Te===!0&&(R.updateMultisampleRenderTarget(Q),R.updateRenderTargetMipmap(Q)),_.setRenderTarget(xe),_.setClearColor(V,E),_.toneMapping=Se}function da(A,H,Z){const J=H.isScene===!0?H.overrideMaterial:null;for(let $=0,de=A.length;$<de;$++){const xe=A[$],Se=xe.object,Te=xe.geometry,Ue=J===null?xe.material:J,Pe=xe.group;Se.layers.test(Z.layers)&&nr(Se,H,Z,Te,Ue,Pe)}}function nr(A,H,Z,J,$,de){A.onBeforeRender(_,H,Z,J,$,de),A.modelViewMatrix.multiplyMatrices(Z.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),$.onBeforeRender(_,H,Z,J,A,de),$.transparent===!0&&$.side===mn&&$.forceSinglePass===!1?($.side=Ut,$.needsUpdate=!0,_.renderBufferDirect(Z,H,J,$,A,de),$.side=Dn,$.needsUpdate=!0,_.renderBufferDirect(Z,H,J,$,A,de),$.side=mn):_.renderBufferDirect(Z,H,J,$,A,de),A.onAfterRender(_,H,Z,J,$,de)}function pa(A,H,Z){H.isScene!==!0&&(H=ee);const J=Re.get(A),$=m.state.lights,de=m.state.shadowsArray,xe=$.state.version,Se=_e.getParameters(A,$.state,de,H,Z),Te=_e.getProgramCacheKey(Se);let Ue=J.programs;J.environment=A.isMeshStandardMaterial?H.environment:null,J.fog=H.fog,J.envMap=(A.isMeshStandardMaterial?K:y).get(A.envMap||J.environment),Ue===void 0&&(A.addEventListener("dispose",ue),Ue=new Map,J.programs=Ue);let Pe=Ue.get(Te);if(Pe!==void 0){if(J.currentProgram===Pe&&J.lightsStateVersion===xe)return ar(A,Se),Pe}else Se.uniforms=_e.getUniforms(A),A.onBuild(Z,Se,_),A.onBeforeCompile(Se,_),Pe=_e.acquireProgram(Se,Te),Ue.set(Te,Pe),J.uniforms=Se.uniforms;const Ce=J.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Ce.clippingPlanes=De.uniform),ar(A,Se),J.needsLights=ph(A),J.lightsStateVersion=xe,J.needsLights&&(Ce.ambientLightColor.value=$.state.ambient,Ce.lightProbe.value=$.state.probe,Ce.directionalLights.value=$.state.directional,Ce.directionalLightShadows.value=$.state.directionalShadow,Ce.spotLights.value=$.state.spot,Ce.spotLightShadows.value=$.state.spotShadow,Ce.rectAreaLights.value=$.state.rectArea,Ce.ltc_1.value=$.state.rectAreaLTC1,Ce.ltc_2.value=$.state.rectAreaLTC2,Ce.pointLights.value=$.state.point,Ce.pointLightShadows.value=$.state.pointShadow,Ce.hemisphereLights.value=$.state.hemi,Ce.directionalShadowMap.value=$.state.directionalShadowMap,Ce.directionalShadowMatrix.value=$.state.directionalShadowMatrix,Ce.spotShadowMap.value=$.state.spotShadowMap,Ce.spotLightMatrix.value=$.state.spotLightMatrix,Ce.spotLightMap.value=$.state.spotLightMap,Ce.pointShadowMap.value=$.state.pointShadowMap,Ce.pointShadowMatrix.value=$.state.pointShadowMatrix),J.currentProgram=Pe,J.uniformsList=null,Pe}function ir(A){if(A.uniformsList===null){const H=A.currentProgram.getUniforms();A.uniformsList=Qa.seqWithValue(H.seq,A.uniforms)}return A.uniformsList}function ar(A,H){const Z=Re.get(A);Z.outputColorSpace=H.outputColorSpace,Z.batching=H.batching,Z.instancing=H.instancing,Z.instancingColor=H.instancingColor,Z.skinning=H.skinning,Z.morphTargets=H.morphTargets,Z.morphNormals=H.morphNormals,Z.morphColors=H.morphColors,Z.morphTargetsCount=H.morphTargetsCount,Z.numClippingPlanes=H.numClippingPlanes,Z.numIntersection=H.numClipIntersection,Z.vertexAlphas=H.vertexAlphas,Z.vertexTangents=H.vertexTangents,Z.toneMapping=H.toneMapping}function fh(A,H,Z,J,$){H.isScene!==!0&&(H=ee),R.resetTextureUnits();const de=H.fog,xe=J.isMeshStandardMaterial?H.environment:null,Se=T===null?_.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:xn,Te=(J.isMeshStandardMaterial?K:y).get(J.envMap||xe),Ue=J.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,Pe=!!Z.attributes.tangent&&(!!J.normalMap||J.anisotropy>0),Ce=!!Z.morphAttributes.position,ot=!!Z.morphAttributes.normal,It=!!Z.morphAttributes.color;let pt=Rn;J.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(pt=_.toneMapping);const rn=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,tt=rn!==void 0?rn.length:0,Fe=Re.get(J),yo=m.state.lights;if(Y===!0&&(W===!0||A!==x)){const Bt=A===x&&J.id===S;De.setState(J,A,Bt)}let at=!1;J.version===Fe.__version?(Fe.needsLights&&Fe.lightsStateVersion!==yo.state.version||Fe.outputColorSpace!==Se||$.isBatchedMesh&&Fe.batching===!1||!$.isBatchedMesh&&Fe.batching===!0||$.isInstancedMesh&&Fe.instancing===!1||!$.isInstancedMesh&&Fe.instancing===!0||$.isSkinnedMesh&&Fe.skinning===!1||!$.isSkinnedMesh&&Fe.skinning===!0||$.isInstancedMesh&&Fe.instancingColor===!0&&$.instanceColor===null||$.isInstancedMesh&&Fe.instancingColor===!1&&$.instanceColor!==null||Fe.envMap!==Te||J.fog===!0&&Fe.fog!==de||Fe.numClippingPlanes!==void 0&&(Fe.numClippingPlanes!==De.numPlanes||Fe.numIntersection!==De.numIntersection)||Fe.vertexAlphas!==Ue||Fe.vertexTangents!==Pe||Fe.morphTargets!==Ce||Fe.morphNormals!==ot||Fe.morphColors!==It||Fe.toneMapping!==pt||ke.isWebGL2===!0&&Fe.morphTargetsCount!==tt)&&(at=!0):(at=!0,Fe.__version=J.version);let Un=Fe.currentProgram;at===!0&&(Un=pa(J,H,$));let or=!1,Hi=!1,Eo=!1;const bt=Un.getUniforms(),In=Fe.uniforms;if(ve.useProgram(Un.program)&&(or=!0,Hi=!0,Eo=!0),J.id!==S&&(S=J.id,Hi=!0),or||x!==A){bt.setValue(O,"projectionMatrix",A.projectionMatrix),bt.setValue(O,"viewMatrix",A.matrixWorldInverse);const Bt=bt.map.cameraPosition;Bt!==void 0&&Bt.setValue(O,pe.setFromMatrixPosition(A.matrixWorld)),ke.logarithmicDepthBuffer&&bt.setValue(O,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(J.isMeshPhongMaterial||J.isMeshToonMaterial||J.isMeshLambertMaterial||J.isMeshBasicMaterial||J.isMeshStandardMaterial||J.isShaderMaterial)&&bt.setValue(O,"isOrthographic",A.isOrthographicCamera===!0),x!==A&&(x=A,Hi=!0,Eo=!0)}if($.isSkinnedMesh){bt.setOptional(O,$,"bindMatrix"),bt.setOptional(O,$,"bindMatrixInverse");const Bt=$.skeleton;Bt&&(ke.floatVertexTextures?(Bt.boneTexture===null&&Bt.computeBoneTexture(),bt.setValue(O,"boneTexture",Bt.boneTexture,R)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}$.isBatchedMesh&&(bt.setOptional(O,$,"batchingTexture"),bt.setValue(O,"batchingTexture",$._matricesTexture,R));const To=Z.morphAttributes;if((To.position!==void 0||To.normal!==void 0||To.color!==void 0&&ke.isWebGL2===!0)&&Be.update($,Z,Un),(Hi||Fe.receiveShadow!==$.receiveShadow)&&(Fe.receiveShadow=$.receiveShadow,bt.setValue(O,"receiveShadow",$.receiveShadow)),J.isMeshGouraudMaterial&&J.envMap!==null&&(In.envMap.value=Te,In.flipEnvMap.value=Te.isCubeTexture&&Te.isRenderTargetTexture===!1?-1:1),Hi&&(bt.setValue(O,"toneMappingExposure",_.toneMappingExposure),Fe.needsLights&&dh(In,Eo),de&&J.fog===!0&&fe.refreshFogUniforms(In,de),fe.refreshMaterialUniforms(In,J,j,D,Q),Qa.upload(O,ir(Fe),In,R)),J.isShaderMaterial&&J.uniformsNeedUpdate===!0&&(Qa.upload(O,ir(Fe),In,R),J.uniformsNeedUpdate=!1),J.isSpriteMaterial&&bt.setValue(O,"center",$.center),bt.setValue(O,"modelViewMatrix",$.modelViewMatrix),bt.setValue(O,"normalMatrix",$.normalMatrix),bt.setValue(O,"modelMatrix",$.matrixWorld),J.isShaderMaterial||J.isRawShaderMaterial){const Bt=J.uniformsGroups;for(let ko=0,mh=Bt.length;ko<mh;ko++)if(ke.isWebGL2){const sr=Bt[ko];He.update(sr,Un),He.bind(sr,Un)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return Un}function dh(A,H){A.ambientLightColor.needsUpdate=H,A.lightProbe.needsUpdate=H,A.directionalLights.needsUpdate=H,A.directionalLightShadows.needsUpdate=H,A.pointLights.needsUpdate=H,A.pointLightShadows.needsUpdate=H,A.spotLights.needsUpdate=H,A.spotLightShadows.needsUpdate=H,A.rectAreaLights.needsUpdate=H,A.hemisphereLights.needsUpdate=H}function ph(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return P},this.getActiveMipmapLevel=function(){return k},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(A,H,Z){Re.get(A.texture).__webglTexture=H,Re.get(A.depthTexture).__webglTexture=Z;const J=Re.get(A);J.__hasExternalTextures=!0,J.__hasExternalTextures&&(J.__autoAllocateDepthBuffer=Z===void 0,J.__autoAllocateDepthBuffer||Me.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),J.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(A,H){const Z=Re.get(A);Z.__webglFramebuffer=H,Z.__useDefaultFramebuffer=H===void 0},this.setRenderTarget=function(A,H=0,Z=0){T=A,P=H,k=Z;let J=!0,$=null,de=!1,xe=!1;if(A){const Te=Re.get(A);Te.__useDefaultFramebuffer!==void 0?(ve.bindFramebuffer(O.FRAMEBUFFER,null),J=!1):Te.__webglFramebuffer===void 0?R.setupRenderTarget(A):Te.__hasExternalTextures&&R.rebindTextures(A,Re.get(A.texture).__webglTexture,Re.get(A.depthTexture).__webglTexture);const Ue=A.texture;(Ue.isData3DTexture||Ue.isDataArrayTexture||Ue.isCompressedArrayTexture)&&(xe=!0);const Pe=Re.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(Pe[H])?$=Pe[H][Z]:$=Pe[H],de=!0):ke.isWebGL2&&A.samples>0&&R.useMultisampledRTT(A)===!1?$=Re.get(A).__webglMultisampledFramebuffer:Array.isArray(Pe)?$=Pe[Z]:$=Pe,b.copy(A.viewport),N.copy(A.scissor),L=A.scissorTest}else b.copy(G).multiplyScalar(j).floor(),N.copy(B).multiplyScalar(j).floor(),L=q;if(ve.bindFramebuffer(O.FRAMEBUFFER,$)&&ke.drawBuffers&&J&&ve.drawBuffers(A,$),ve.viewport(b),ve.scissor(N),ve.setScissorTest(L),de){const Te=Re.get(A.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+H,Te.__webglTexture,Z)}else if(xe){const Te=Re.get(A.texture),Ue=H||0;O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,Te.__webglTexture,Z||0,Ue)}S=-1},this.readRenderTargetPixels=function(A,H,Z,J,$,de,xe){if(!(A&&A.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Se=Re.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&xe!==void 0&&(Se=Se[xe]),Se){ve.bindFramebuffer(O.FRAMEBUFFER,Se);try{const Te=A.texture,Ue=Te.format,Pe=Te.type;if(Ue!==Zt&&ge.convert(Ue)!==O.getParameter(O.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Ce=Pe===sa&&(Me.has("EXT_color_buffer_half_float")||ke.isWebGL2&&Me.has("EXT_color_buffer_float"));if(Pe!==Cn&&ge.convert(Pe)!==O.getParameter(O.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Pe===An&&(ke.isWebGL2||Me.has("OES_texture_float")||Me.has("WEBGL_color_buffer_float")))&&!Ce){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}H>=0&&H<=A.width-J&&Z>=0&&Z<=A.height-$&&O.readPixels(H,Z,J,$,ge.convert(Ue),ge.convert(Pe),de)}finally{const Te=T!==null?Re.get(T).__webglFramebuffer:null;ve.bindFramebuffer(O.FRAMEBUFFER,Te)}}},this.copyFramebufferToTexture=function(A,H,Z=0){const J=Math.pow(2,-Z),$=Math.floor(H.image.width*J),de=Math.floor(H.image.height*J);R.setTexture2D(H,0),O.copyTexSubImage2D(O.TEXTURE_2D,Z,0,0,A.x,A.y,$,de),ve.unbindTexture()},this.copyTextureToTexture=function(A,H,Z,J=0){const $=H.image.width,de=H.image.height,xe=ge.convert(Z.format),Se=ge.convert(Z.type);R.setTexture2D(Z,0),O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,Z.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Z.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,Z.unpackAlignment),H.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,J,A.x,A.y,$,de,xe,Se,H.image.data):H.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,J,A.x,A.y,H.mipmaps[0].width,H.mipmaps[0].height,xe,H.mipmaps[0].data):O.texSubImage2D(O.TEXTURE_2D,J,A.x,A.y,xe,Se,H.image),J===0&&Z.generateMipmaps&&O.generateMipmap(O.TEXTURE_2D),ve.unbindTexture()},this.copyTextureToTexture3D=function(A,H,Z,J,$=0){if(_.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const de=A.max.x-A.min.x+1,xe=A.max.y-A.min.y+1,Se=A.max.z-A.min.z+1,Te=ge.convert(J.format),Ue=ge.convert(J.type);let Pe;if(J.isData3DTexture)R.setTexture3D(J,0),Pe=O.TEXTURE_3D;else if(J.isDataArrayTexture||J.isCompressedArrayTexture)R.setTexture2DArray(J,0),Pe=O.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,J.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,J.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,J.unpackAlignment);const Ce=O.getParameter(O.UNPACK_ROW_LENGTH),ot=O.getParameter(O.UNPACK_IMAGE_HEIGHT),It=O.getParameter(O.UNPACK_SKIP_PIXELS),pt=O.getParameter(O.UNPACK_SKIP_ROWS),rn=O.getParameter(O.UNPACK_SKIP_IMAGES),tt=Z.isCompressedTexture?Z.mipmaps[$]:Z.image;O.pixelStorei(O.UNPACK_ROW_LENGTH,tt.width),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,tt.height),O.pixelStorei(O.UNPACK_SKIP_PIXELS,A.min.x),O.pixelStorei(O.UNPACK_SKIP_ROWS,A.min.y),O.pixelStorei(O.UNPACK_SKIP_IMAGES,A.min.z),Z.isDataTexture||Z.isData3DTexture?O.texSubImage3D(Pe,$,H.x,H.y,H.z,de,xe,Se,Te,Ue,tt.data):Z.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),O.compressedTexSubImage3D(Pe,$,H.x,H.y,H.z,de,xe,Se,Te,tt.data)):O.texSubImage3D(Pe,$,H.x,H.y,H.z,de,xe,Se,Te,Ue,tt),O.pixelStorei(O.UNPACK_ROW_LENGTH,Ce),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,ot),O.pixelStorei(O.UNPACK_SKIP_PIXELS,It),O.pixelStorei(O.UNPACK_SKIP_ROWS,pt),O.pixelStorei(O.UNPACK_SKIP_IMAGES,rn),$===0&&J.generateMipmaps&&O.generateMipmap(Pe),ve.unbindTexture()},this.initTexture=function(A){A.isCubeTexture?R.setTextureCube(A,0):A.isData3DTexture?R.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?R.setTexture2DArray(A,0):R.setTexture2D(A,0),ve.unbindTexture()},this.resetState=function(){P=0,k=0,T=null,ve.reset(),Le.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return vn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===Ys?"display-p3":"srgb",t.unpackColorSpace=qe.workingColorSpace===wo?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===vt?Kn:Fc}set outputEncoding(e){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=e===Kn?vt:xn}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(e){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=e}}class W0 extends ah{}W0.prototype.isWebGL1Renderer=!0;class q0 extends wt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t}}class X0 extends Nt{constructor(e=null,t=1,n=1,a,o,s,r,l,c=Mt,h=Mt,u,f){super(null,s,r,l,c,h,a,o,u,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Y0 extends Nt{constructor(e,t,n,a,o,s,r,l,c){super(e,t,n,a,o,s,r,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class j0 extends Oi{constructor(e){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new Oe(0),this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.fog=e.fog,this}}class $0 extends Oi{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Oe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Oe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=zc,this.normalScale=new Ge(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class oh extends wt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Oe(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}}class K0 extends oh{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(wt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Oe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const hs=new ht,Xl=new X,Yl=new X;class Z0{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ge(512,512),this.map=null,this.mapPass=null,this.matrix=new ht,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Js,this._frameExtents=new Ge(1,1),this._viewportCount=1,this._viewports=[new lt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Xl.setFromMatrixPosition(e.matrixWorld),t.position.copy(Xl),Yl.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Yl),t.updateMatrixWorld(),hs.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(hs),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(hs)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class J0 extends Z0{constructor(){super(new Qs(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Q0 extends oh{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(wt.DEFAULT_UP),this.updateMatrix(),this.target=new wt,this.shadow=new J0}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class ev{constructor(e,t,n=0,a=1/0){this.ray=new Wc(e,t),this.near=n,this.far=a,this.camera=null,this.layers=new Ks,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}intersectObject(e,t=!0,n=[]){return Rs(e,this,n,t),n.sort(jl),n}intersectObjects(e,t=!0,n=[]){for(let a=0,o=e.length;a<o;a++)Rs(e[a],this,n,t);return n.sort(jl),n}}function jl(i,e){return i.distance-e.distance}function Rs(i,e,t,n){if(i.layers.test(e.layers)&&i.raycast(e,t),n===!0){const a=i.children;for(let o=0,s=a.length;o<s;o++)Rs(a[o],e,t,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:qs}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=qs);function tv(i,e=1e-4){e=Math.max(e,Number.EPSILON);const t={},n=i.getIndex(),a=i.getAttribute("position"),o=n?n.count:a.count;let s=0;const r=Object.keys(i.attributes),l={},c={},h=[],u=["getX","getY","getZ","getW"],f=["setX","setY","setZ","setW"];for(let M=0,_=r.length;M<_;M++){const w=r[M],P=i.attributes[w];l[w]=new Dt(new P.array.constructor(P.count*P.itemSize),P.itemSize,P.normalized);const k=i.morphAttributes[w];k&&(c[w]=new Dt(new k.array.constructor(k.count*k.itemSize),k.itemSize,k.normalized))}const p=e*.5,g=Math.log10(1/e),v=Math.pow(10,g),m=p*v;for(let M=0;M<o;M++){const _=n?n.getX(M):M;let w="";for(let P=0,k=r.length;P<k;P++){const T=r[P],S=i.getAttribute(T),x=S.itemSize;for(let b=0;b<x;b++)w+=`${~~(S[u[b]](_)*v+m)},`}if(w in t)h.push(t[w]);else{for(let P=0,k=r.length;P<k;P++){const T=r[P],S=i.getAttribute(T),x=i.morphAttributes[T],b=S.itemSize,N=l[T],L=c[T];for(let V=0;V<b;V++){const E=u[V],C=f[V];if(N[C](s,S[E](_)),x)for(let D=0,j=x.length;D<j;D++)L[D][C](s,x[D][E](_))}}t[w]=s,h.push(s),s++}}const d=i.clone();for(const M in i.attributes){const _=l[M];if(d.setAttribute(M,new Dt(_.array.slice(0,s*_.itemSize),_.itemSize,_.normalized)),M in c)for(let w=0;w<c[M].length;w++){const P=c[M][w];d.morphAttributes[M][w]=new Dt(P.array.slice(0,s*P.itemSize),P.itemSize,P.normalized)}}return d.setIndex(h),d}const nt=i=>i<0?0:i>1?1:i,Et=i=>i*i*(3-2*i),na=i=>i<.5?4*i*i*i:1-Math.pow(-2*i+2,3)/2,Yi=i=>1-Math.pow(1-i,3),eo="#e8dcc3",sh="#efe6d3",ct="#2a211b",We="#5a4c40",et="#8d7d6c",xi="#9c3f24",nv="#33302c",iv="#b3aca1",av="#4a3a2c",to="'PT Alegreya'",gt=(i,{weight:e=400,italic:t=!1}={})=>`${t?"italic ":""}${e} ${i}px ${to}, serif`,us=new X(1,0,0),rh=new X(0,1,0),no=.09,ov=.06,lh=6,fs=.22,pn=384,En=256,$l=0,sv=1,rv=3;class lv{constructor(e){const t=new ah({canvas:e,antialias:!0,alpha:!0,premultipliedAlpha:!0});t.setClearColor(0,0),t.outputColorSpace=vt,t.shadowMap.enabled=!0,t.shadowMap.type=tn,this.renderer=t;const n=new q0;this.scene=n,this.camera=new Qs(-1,1,1,-1,.1,400),n.add(new K0(16446698,12365461,1.9));const a=new Q0(16772827,2.9);a.castShadow=!0,a.shadow.mapSize.set(1024,1024),a.shadow.radius=4,a.shadow.blurSamples=12,a.shadow.bias=-6e-4,a.shadow.camera.near=1,a.shadow.camera.far=120,n.add(a,a.target),this.sun=a,this.sunDir=new X(-.55,1,-.35).normalize(),this.rake=new X(-.74,.62,-.3).normalize();const o=new Qt(new la(400,400),new j0({color:new Oe(av),opacity:.2}));o.rotation.x=-Math.PI/2,o.receiveShadow=!0,n.add(o);const s=hv();this.slabs=Array.from({length:lh},(r,l)=>uv(s,xo(24301+l*977))),s.dispose(),this.blobGeo=new la(sn+1.1,2.1),this.blobTex=Sv(),this.glyphs=new yv,this.blocks=new Map,this.raycaster=new ev,this.v=new X,this.w=1,this.h=1}setSize(e,t,n){this.w=e,this.h=t,this.renderer.setPixelRatio(n),this.renderer.setSize(e,t,!1)}setView({tx:e,tz:t,yaw:n,pitch:a,ppu:o}){const s=this.camera,r=this.w/2/o,l=this.h/2/o;s.left=-r,s.right=r,s.top=l,s.bottom=-l,s.updateProjectionMatrix();const c=80;s.position.set(e+c*Math.sin(n)*Math.cos(a),c*Math.sin(a),t+c*Math.cos(n)*Math.cos(a)),s.up.copy(rh),s.lookAt(e,0,t),s.updateMatrixWorld();const h=this.sun;h.target.position.set(e,0,t),h.position.copy(this.sunDir).multiplyScalar(40).add(h.target.position);const u=Math.max(r,l/Math.sin(a))+3,f=h.shadow.camera;f.left=-u,f.right=u,f.top=u,f.bottom=-u,f.updateProjectionMatrix()}project(e,t,n){const a=this.v.set(e,t,n).project(this.camera);return[(a.x+1)/2*this.w,(1-a.y)/2*this.h]}floorAffine(){const[e,t]=this.project(0,0,0),[n,a]=this.project(1,0,0),[o,s]=this.project(0,0,1);return[n-e,a-t,o-e,s-t,e,t]}addTile(e){const t=new cv(this,e);return this.blocks.set(e.id,t),t}block(e){return this.blocks.get(e.id)}pick(e,t){const n=new Ge(e/this.w*2-1,-(t/this.h)*2+1);this.raycaster.setFromCamera(n,this.camera);const a=this.raycaster.intersectObjects([...this.blocks.values()].map(o=>o.stone),!1);return a.length?a[0].object.userData.tile:null}update(e){for(const t of this.blocks.values())t.update(e)}render(){this.renderer.render(this.scene,this.camera)}}class cv{constructor(e,t){this.s=e,this.tile=t;const n=xo(2654435761^t.id*2654435761),a=new Ji;a.position.set(t.x,.5,t.z),this.u=dv(e,n);const o=new Qt(e.slabs[Math.floor(n()*lh)],xv(this.u));this.rolls=Math.floor(n()*4),o.quaternion.setFromAxisAngle(us,this.rolls*Math.PI/2),o.castShadow=!0,o.receiveShadow=!0,o.userData.tile=t,a.add(o),e.scene.add(a),this.group=a,this.stone=o;const s=new Qt(e.blobGeo,new Zs({color:2826005,alphaMap:e.blobTex,transparent:!0,opacity:.55,depthWrite:!1}));s.rotation.x=-Math.PI/2,s.position.set(t.x,.002,t.z),s.renderOrder=-1,e.scene.add(s),this.blob=s,this.faces=[null,null,null,null],this.waiting=new Set,this.peck(this.face($l),t.stone,1),this.roll=null,this.drop=null}face(e){return(e-this.rolls+4)%4}peck(e,t,n){this.free(e);const a=yi(t);this.faces[e]=a,this.u.uLift.value.setComponent(e,n),this.u.uCut.value.setComponent(e,1),this.waiting.add(e),this.s.glyphs.acquire(a,o=>{this.faces[e]===a&&(this.u.uGlyph.value[e]=o,this.waiting.delete(e))})}free(e){const t=this.faces[e];t&&(this.s.glyphs.release(t),this.faces[e]=null,this.waiting.delete(e),this.u.uGlyph.value[e]=this.s.glyphs.blank,this.u.uLift.value.setComponent(e,0),this.u.uCut.value.setComponent(e,0))}dropIn(e,t=.7){this.drop={t0:e,dur:t,spin:(Math.random()-.5)*.9},this.group.position.y=99}turn(e,t,n=.86){this.roll&&this.finishRoll();const a={top:this.face($l),front:this.face(sv),back:this.face(rv)};return this.peck(a.back,e,1),this.roll={t0:t,dur:n,faces:a,hop:.22+Math.random()*.12},t+n}landsAt(){return this.roll?this.roll.t0+this.roll.dur:0}hurry(e){if(!this.waiting.size||this.drop&&e<this.drop.t0)return;const t=this.roll,n=t&&e<t.t0+.2*t.dur?t.faces.back:-1;for(const a of this.waiting)a!==n&&this.s.glyphs.hurry(this.faces[a])}finishRoll(){const{faces:e}=this.roll;this.free(e.front),this.u.uLift.value.setComponent(e.top,fs),this.rolls=(this.rolls+1)%4,this.stone.quaternion.setFromAxisAngle(us,this.rolls*Math.PI/2),this.group.quaternion.identity(),this.group.position.y=.5,this.roll=null}update(e){this.hurry(e);const t=this.group;let n=0;if(this.drop){const s=nt((e-this.drop.t0)/this.drop.dur);if(t.visible=e>=this.drop.t0,e<this.drop.t0)n=30;else if(s<.62){const r=s/.62;n=3.2*(1-r*r)}else{const r=(s-.62)/.38;n=.16*Math.sin(Math.PI*r)*(1-r*.4)}t.quaternion.setFromAxisAngle(rh,this.drop.spin*(1-Et(s))),t.position.y=.5+n,s>=1&&(this.drop=null,t.quaternion.identity(),t.position.y=.5)}else if(this.roll){const s=this.roll,r=nt((e-s.t0)/s.dur),c=(r<.8?1.04*na(r/.8):1.04-.04*Et((r-.8)/.2))*(Math.PI/2);if(t.quaternion.setFromAxisAngle(us,c),n=.5*(Math.abs(Math.cos(c))+Math.abs(Math.sin(c)))-.5+s.hop*Math.sin(Math.PI*Math.min(1,r/.85)),t.position.y=.5+n,this.u.uLift.value.setComponent(s.faces.top,1-(1-fs)*Et(nt((r-.15)/.7))),this.faces[s.faces.front]){const h=1-Et(nt(r/.5));this.u.uLift.value.setComponent(s.faces.front,fs*h),this.u.uCut.value.setComponent(s.faces.front,h)}r>=1&&this.finishRoll()}const a=this.blob,o=Math.min(1,n/1.4);a.material.opacity=.55*(1-o)*(1-o),a.scale.setScalar(1+o*.7)}}const Ai=[sn/2,.5,.5];function hv(){const t=[8,5,5].map(s=>s+2*3),n=new Bi(1,1,1,...t);n.deleteAttribute("normal"),n.deleteAttribute("uv");const a=n.attributes.position;for(let s=0;s<a.count;s++){const r=[a.getX(s),a.getY(s),a.getZ(s)].map((l,c)=>{const h=Math.round((l+.5)*t[c]),u=Ai[c]-no;return h<=3?-Ai[c]+h/3*no:h>=t[c]-3?Ai[c]-(t[c]-h)/3*no:-u+(h-3)/(t[c]-6)*2*u});a.setXYZ(s,...r)}const o=tv(n,1e-6);return n.dispose(),o}function uv(i,e){const t=i.clone(),n=fv(e),a=[e()*50,e()*50,e()*50],o=new X(e()-.5,e()-.5,e()-.5).multiplyScalar(.02),s=t.attributes.position,r=new X,l=new X,c=new X;for(let h=0;h<s.count;h++){r.fromBufferAttribute(s,h);const u=[r.x*2.1+a[0],r.y*2.1+a[1],r.z*2.1+a[2]],f=.03+(no-.03)*xa.smoothstep(n(u[0]*.9,u[1]*.9,u[2]*.9),.3,.8);l.set(xa.clamp(r.x,-.75+f,Ai[0]-f),xa.clamp(r.y,-.5+f,Ai[1]-f),xa.clamp(r.z,-.5+f,Ai[2]-f)),c.subVectors(r,l).normalize();const p=.006*(n(...u)*2-1)+.003*(n(u[0]*2.7,u[1]*2.7,u[2]*2.7)*2-1);r.copy(l).addScaledVector(c,f+p+o.dot(r)),s.setXYZ(h,r.x,r.y,r.z)}return t.computeVertexNormals(),t}function fv(i){const e=Uint8Array.from({length:256},(s,r)=>r);for(let s=255;s>0;s--){const r=Math.floor(i()*(s+1));[e[s],e[r]]=[e[r],e[s]]}const t=Float32Array.from({length:256},()=>i()),n=(s,r,l)=>t[e[e[e[s&255]+r&255]+l&255]],a=s=>s*s*(3-2*s),o=(s,r,l)=>s+(r-s)*l;return(s,r,l)=>{const c=Math.floor(s),h=Math.floor(r),u=Math.floor(l),f=a(s-c),p=a(r-h),g=a(l-u);return o(o(o(n(c,h,u),n(c+1,h,u),f),o(n(c,h+1,u),n(c+1,h+1,u),f),p),o(o(n(c,h,u+1),n(c+1,h,u+1),f),o(n(c,h+1,u+1),n(c+1,h+1,u+1),f),p),g)}}function dv(i,e){const t=i.glyphs.blank;return{uSeed:{value:new X(e()*40,e()*40,e()*40)},uSun:{value:i.rake},uGlyph:{value:[t,t,t,t]},uLift:{value:new lt},uCut:{value:new lt}}}const ch=_v(new Oe(nv),.45).multiplyScalar(1.2),pv=ch.clone().multiplyScalar(.72),mv=ch.clone().multiplyScalar(1.45),gv=new Oe(iv),vv=new Oe("#5d6430");function _v(i,e){const t=.2126*i.r+.7152*i.g+.0722*i.b;return i.lerp(new Oe(t,t,t),e)}function xv(i){const e=new $0({color:16777215,roughness:.9,metalness:0});return e.customProgramCacheKey=()=>"pohaku-basalt",e.onBeforeCompile=t=>{Object.assign(t.uniforms,i,{uDark:{value:pv},uLight:{value:mv},uPecked:{value:gv},uOlivine:{value:vv}}),t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
${Mv}`).replace("#include <begin_vertex>",`#include <begin_vertex>
vObj = position;`).replace("#include <project_vertex>",`#include <project_vertex>
        vWorldY = (modelMatrix * vec4(transformed, 1.0)).y;
        vSunObj = uSun * mat3(modelMatrix);`),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
${wv}`).replace("#include <color_fragment>",`#include <color_fragment>
${bv}`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor = rough;`).replace("#include <normal_fragment_maps>","normal = bumpNormal(-vViewPosition, normal, height, faceDirection);").replace("#include <aomap_fragment>",`#include <aomap_fragment>
        // Darker toward the floor: the ambient occlusion a real renderer would
        // find where stone meets ground. In world space, so it stays put as
        // the stone rolls.
        float aoY = smoothstep(0.0, 0.5, vWorldY);
        aoY = aoY * aoY * (3.0 - 2.0 * aoY);
        reflectedLight.indirectDiffuse *= mix(0.45, 1.0, aoY);
        reflectedLight.directDiffuse *= mix(0.7, 1.0, aoY) * (1.0 - 0.85 * rim) * (1.0 - 0.45 * pit);
        reflectedLight.directSpecular *= 1.0 - rim;`)},e}const Mv=`
uniform vec3 uSun;
varying vec3 vObj;
varying vec3 vSunObj;
varying float vWorldY;
`,wv=`
#define SLAB ${sn.toFixed(4)}
#define HALF vec3(${(sn/2).toFixed(4)}, 0.5, 0.5)
#define BEVEL ${ov.toFixed(4)}
#define GLYPH vec2(${pn}.0, ${En}.0)
uniform vec3 uSeed;
uniform sampler2D uGlyph[4];
uniform vec4 uLift;
uniform vec4 uCut;
uniform vec3 uDark;
uniform vec3 uLight;
uniform vec3 uPecked;
uniform vec3 uOlivine;
varying vec3 vObj;
varying vec3 vSunObj;
varying float vWorldY;

// Hash without Sine (Dave Hoskins, MIT).
float hash13(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.zyx + 31.32);
  return fract((p3.x + p3.y) * p3.z);
}
vec3 hash33(vec3 p3) {
  p3 = fract(p3 * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yxz + 33.33);
  return fract((p3.xxy + p3.yxx) * p3.zyx);
}

float vnoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash13(i), hash13(i + vec3(1, 0, 0)), u.x), mix(hash13(i + vec3(0, 1, 0)), hash13(i + vec3(1, 1, 0)), u.x), u.y),
    mix(mix(hash13(i + vec3(0, 0, 1)), hash13(i + vec3(1, 0, 1)), u.x), mix(hash13(i + vec3(0, 1, 1)), hash13(i + vec3(1, 1, 1)), u.x), u.y),
    u.z);
}

// Distance to the nearest of a jittered lattice of points, and a random
// number belonging to that point's cell. Only the eight cells nearest p are
// searched, not all 27 round it: a point in any other cell is at least half
// a cell away, and a pit is never that wide.
vec2 worley(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 o = step(0.5, f) - 1.0;
  float best = 9.0;
  float id = 0.0;
  for (int z = 0; z <= 1; z++)
  for (int y = 0; y <= 1; y++)
  for (int x = 0; x <= 1; x++) {
    vec3 c = o + vec3(x, y, z);
    vec3 d = c + hash33(i + c) - f;
    float dd = dot(d, d);
    if (dd < best) {
      best = dd;
      id = hash13(i + c + 41.7);
    }
  }
  return vec2(sqrt(best), id);
}

// The glyph on face k: r pecked, g how bright each peck broke. Explicit
// gradients, because the face (and so the texture) changes from one pixel to
// the next along the stone's edges.
vec2 glyphAt(int k, vec2 uv, vec2 gx, vec2 gy) {
  if (k == 0) return textureGrad(uGlyph[0], uv, gx, gy).rg;
  if (k == 1) return textureGrad(uGlyph[1], uv, gx, gy).rg;
  if (k == 2) return textureGrad(uGlyph[2], uv, gx, gy).rg;
  return textureGrad(uGlyph[3], uv, gx, gy).rg;
}

// How deep the groove is: the coverage seen a few texels blurred, which a
// coarser level of the mip chain gives for nothing — walls that slope.
float grooveAt(int k, vec2 uv, float lod) {
  if (k == 0) return textureLod(uGlyph[0], uv, lod).r;
  if (k == 1) return textureLod(uGlyph[1], uv, lod).r;
  if (k == 2) return textureLod(uGlyph[2], uv, lod).r;
  return textureLod(uGlyph[3], uv, lod).r;
}

// Bump mapping from a height in world units (Mikkelsen, "Bump Mapping
// Unparametrized Surfaces on the GPU"), unnormalised so a slope is a slope.
vec3 bumpNormal(vec3 pos, vec3 n, float h, float faceDir) {
  vec3 sx = dFdx(pos);
  vec3 sy = dFdy(pos);
  vec3 r1 = cross(sy, n);
  vec3 r2 = cross(n, sx);
  float det = dot(sx, r1) * faceDir;
  vec3 grad = sign(det) * (dFdx(h) * r1 + dFdy(h) * r2);
  return normalize(abs(det) * n - grad);
}
`,bv=`
vec3 dpx = dFdx(vObj);
vec3 dpy = dFdy(vObj);
// Stone units per pixel: detail finer than about a pixel is faded out
// rather than left to shimmer.
float px = max(max(length(dpx), length(dpy)), 1e-5);

// The body: slow drift between a darker and a lighter grey, and a finer
// grain over it. The fine detail, here and in the pits below, is only worked
// out where it can be seen: zoomed out, or on a small screen, it is skipped.
vec3 sp = vObj + uSeed;
float tone = 0.55 * vnoise(sp * 2.1) + 0.3 * vnoise(sp * 4.7 + 9.1) + 0.15 * vnoise(sp * 11.0 + 3.3);
// Each stone a shade of its own, as stones gathered from one shore are.
vec3 rock = mix(uDark, uLight, smoothstep(0.25, 0.78, tone)) * (0.84 + 0.32 * hash13(uSeed));
float near = smoothstep(2.5, 6.0, 0.026 / px);
if (near > 0.0) rock *= 0.9 + 0.2 * mix(0.5, vnoise(sp * 38.0), near);
// Pale specks of feldspar in the groundmass, seen once the stone is nearer.
float nearer = smoothstep(1.5, 3.0, 0.011 / px);
if (nearer > 0.0) rock *= 1.0 + 0.45 * smoothstep(0.82, 0.93, vnoise(sp * 90.0)) * nearer;

// Vesicles and olivine, one Worley field: where the rock is frothy up to two
// cells in five hold a pit, where it is dense none; one in sixty holds a
// crystal.
const float CELLS = 24.0;
float aa = px * CELLS * 0.75;
float seen = smoothstep(1.2, 3.0, 1.0 / (CELLS * px));
vec2 wv = seen > 0.0 ? worley(sp * CELLS) : vec2(9.0, 0.0);
float hasPit = step(wv.y, 0.42 * smoothstep(0.2, 0.75, vnoise(sp * 3.3 + 5.0))) * seen;
float rad = mix(0.1, 0.34, pow(fract(wv.y * 37.0), 2.2));
float pit = hasPit * (1.0 - smoothstep(rad - aa, rad + aa, wv.x));
float lip = hasPit * smoothstep(rad - aa, rad + aa, wv.x) * (1.0 - smoothstep(rad + aa, rad + 0.1 + aa, wv.x));
float olivine = step(0.984, wv.y) * (1.0 - smoothstep(0.17 - aa, 0.17 + aa, wv.x)) * seen;
rock *= (1.0 - 0.62 * pit) * (1.0 + 0.22 * lip);
rock = mix(rock, uOlivine, 0.85 * olivine);

// Which of the four faces a roll passes through this is (−1: the slab's
// ends, which carry nothing), and the face's own coordinates: across, and
// up the letters, which on face k is the outward normal of face k − 1.
vec3 q = abs(vObj) - (HALF - BEVEL);
int k = -1;
if (q.y >= q.x && q.y >= q.z) k = vObj.y > 0.0 ? 0 : 2;
else if (q.z >= q.x) k = vObj.z > 0.0 ? 1 : 3;
float th = float(max(k, 0)) * PI_HALF;
vec3 fn = vec3(0.0, cos(th), sin(th));
vec3 up = vec3(0.0, sin(th), -cos(th));
vec2 uv = vec2(vObj.x / SLAB + 0.5, dot(vObj, up) + 0.5);
vec2 gx = vec2(dpx.x / SLAB, dot(dpx, up));
vec2 gy = vec2(dpy.x / SLAB, dot(dpy, up));
vec2 glyph = vec2(0.0);
float groove = 0.0;
float cut = 0.0;
float lift = 0.0;
float rim = 0.0;
if (k >= 0) {
  glyph = glyphAt(k, uv, gx, gy);
  float lod = max(log2(max(length(gx * GLYPH), length(gy * GLYPH))), 2.2);
  groove = min(1.0, 1.15 * grooveAt(k, uv, lod));
  cut = uCut[k];
  lift = uLift[k];
  // The thin shadow inside the letter: a point in the groove is shaded
  // where, a groove's depth toward the sun, the stone is shallower than here.
  vec3 L = normalize(vSunObj);
  float ln = dot(L, fn);
  if (ln > 0.0 && groove > 0.0) {
    vec2 toSun = vec2(L.x / SLAB, dot(L, up)) / max(ln, 0.25);
    float there = min(1.0, 1.15 * grooveAt(k, uv + toSun * 0.011, lod));
    rim = cut * clamp((groove - there) * 3.0, 0.0, 1.0);
  }
}
float pecked = glyph.r * cut;
vec3 broken = uPecked * (0.46 + 0.54 * glyph.g) * (0.9 + 0.2 * tone);
diffuseColor.rgb = mix(rock, broken, pecked * lift);

float height = 0.004 * tone - 0.007 * pit - 0.013 * groove * cut;
float rough = mix(0.9, 0.97, pecked) - 0.5 * olivine;
`;function Sv(){const t=document.createElement("canvas");t.width=192,t.height=128;const n=t.getContext("2d"),a=n.createImageData(192,128),o=(sn+1.1)/2,s=2.1/2;for(let r=0;r<128;r++)for(let l=0;l<192;l++){const c=(l+.5)/192*2*o-o,h=(r+.5)/128*2*s-s,u=.07,f=Math.abs(c)-(sn/2-u),p=Math.abs(h)-(.5-u),g=Math.hypot(Math.max(f,0),Math.max(p,0))+Math.min(Math.max(f,p),0)-u,v=g<=0?1:Math.pow(Math.max(0,1-g/.5),2.6),m=Math.round(v*255),d=(r*192+l)*4;a.data[d]=a.data[d+1]=a.data[d+2]=m,a.data[d+3]=255}return n.putImageData(a,0,0),new Y0(t)}class yv{constructor(){this.map=new Map,this.idle=[],this.queue=[],this.asked=!1,this.blank=hh(new Uint8Array([0,0]),1,1)}acquire(e,t){let n=this.map.get(e);n||(n={text:e,tex:null,refs:0,waiting:[]},this.map.set(e,n),this.queue.push(n),this.ask()),n.refs===0&&(this.idle=this.idle.filter(a=>a!==e)),n.refs++,n.tex?t(n.tex):n.waiting.push(t)}release(e){var n;const t=this.map.get(e);if(t&&(t.refs--,!(t.refs>0)))for(this.idle.push(e);this.idle.length>48;){const a=this.map.get(this.idle.shift());(n=a.tex)==null||n.dispose(),this.map.delete(a.text)}}hurry(e){const t=this.map.get(e);!t||t.tex||(this.queue.splice(this.queue.indexOf(t),1),this.peck(t))}peck(e){e.tex=Av(e.text);for(const t of e.waiting)t(e.tex);e.waiting=[]}ask(){if(this.asked)return;this.asked=!0;const e=t=>this.work(t);window.requestIdleCallback?requestIdleCallback(e,{timeout:50}):setTimeout(e,0)}work(e){this.asked=!1;const t=e&&!e.didTimeout,n=performance.now(),a=()=>t?e.timeRemaining()>3:performance.now()-n<8;for(let o=0;this.queue.length&&(o===0||a());o++){const s=this.queue.shift();this.map.get(s.text)===s&&this.peck(s)}this.queue.length&&this.ask()}}const Ev=108,Tv=84,Cs=.88*pn,Kl=.6,Ls=.05,Ha=2.6;let ji=null,Va=0;function kv(i){if(Va)return Va;i.font=gt(100,{weight:600});let e=0;for(const t of ao.keys()){const n=yi(t),a=[...n].length;a<=5&&(e=Math.max(e,i.measureText(n).width/100+Ls*(a-1)))}return Va=Math.max(Tv,Math.min(Ev,Math.floor(Cs/e))),Va}function Av(i){ji||(ji=document.createElement("canvas"),ji.width=pn,ji.height=En);const e=ji.getContext("2d",{willReadFrequently:!0});e.setTransform(1,0,0,1,0,0),e.fillStyle="#000",e.fillRect(0,0,pn,En),e.fillStyle="#fff",e.textAlign="left",e.textBaseline="alphabetic";const t=xo(Pv(i)),n=[...i],a=x=>{e.font=gt(x,{weight:600});const b=n.map((L,V)=>e.measureText(n.slice(0,V).join("")).width+Ls*x*V),N=e.measureText(i).width+Ls*x*(n.length-1);return{at:b,width:N}},o=kv(e);let s=o,r=a(s),l=Math.min(1,Cs/r.width);l<Kl&&(s=Math.floor(o*l/Kl),r=a(s),l=Math.min(1,Cs/r.width)),e.font=gt(s,{weight:600});const c=e.measureText("H").actualBoundingBoxAscent,h=En/2+c/2,u=pn/2-r.width*l/2;n.forEach((x,b)=>{e.save(),e.translate(u+r.at[b]*l,h+(t()-.5)*s*.025),e.rotate((t()-.5)*.035),e.scale(l,1),e.fillText(x,0,0),e.restore()});const f=e.measureText(i),p=Math.ceil(Ha*4),g=Math.max(0,Math.floor(u-p)),v=Math.max(0,Math.floor(h-f.actualBoundingBoxAscent-p)),m=Math.min(pn,Math.ceil(u+r.width*l+p))-g,d=Math.min(En,Math.ceil(h+f.actualBoundingBoxDescent+p))-v,M=e.getImageData(g,v,m,d).data,_=(x,b)=>{const N=Math.round(b)*m+Math.round(x);return x<0||b<0||x>m-1||b>d-1?0:M[N*4]/255},w=new Float32Array(m*d),P=new Float32Array(m*d),k=(x,b,N,L)=>{const V=N+.5,E=Math.max(0,Math.floor(x-V)),C=Math.min(m-1,Math.ceil(x+V)),D=Math.max(0,Math.floor(b-V)),j=Math.min(d-1,Math.ceil(b+V));for(let F=D;F<=j;F++){const z=F+.5-b;for(let G=E;G<=C;G++){const B=G+.5-x,q=B*B+z*z;if(q>=V*V)continue;const I=Math.min(1,V-Math.sqrt(q)),Y=F*m+G;I>w[Y]&&(w[Y]=I),I>.5&&(P[Y]=L)}}},T=Ha*1.15;for(let x=T/2;x<d;x+=T)for(let b=T/2;b<m;b+=T){const N=b+(t()-.5)*T,L=x+(t()-.5)*T,V=_(N,L),E=Ha*(.75+t()*.5),C=.35+.65*t()*t()+.35*t();if(V>.38+t()*.3)k(N,L,E,Math.min(1,C));else if(V>.02&&t()<.12){const D=Ha*2;k(N+(t()-.5)*D,L+(t()-.5)*D,E*.7,C*.7)}}const S=new Uint8Array(pn*En*2);for(let x=0;x<d;x++){const b=(En-1-(v+x))*pn+g;for(let N=0;N<m;N++){const L=x*m+N;S[(b+N)*2]=Math.round(w[L]*255),S[(b+N)*2+1]=Math.round(P[L]*255)}}return hh(S,pn,En)}function hh(i,e,t){const n=new X0(i,e,t,Nc);return n.unpackAlignment=1,n.generateMipmaps=!0,n.minFilter=Li,n.magFilter=Ot,n.anisotropy=4,n.needsUpdate=!0,n.onUpdate=()=>{n.image.data=null},n}function Pv(i){let e=2166136261;for(let t=0;t<i.length;t++)e=Math.imul(e^i.charCodeAt(t),16777619);return e>>>0}const Rv=12.5,Cv=2.6;class Lv{constructor(){this.links=new Map}sync(e,t,{origin:n=null,holdUntil:a=()=>t}={}){let o=0;for(const[s,r]of e){const l=this.links.get(s);if(l){l.to===0&&this.animate(l,t,1,l.anchor);continue}const c=Nv(r);c.p=0,c.from=0,c.to=0,c.anchor="start",r.kind==="pair"&&n!=null&&r.b.id===n&&(c.anchor="end"),this.links.set(s,c);const h=Math.max(t,a(r))+o;o+=.06,this.animate(c,h,1,c.anchor)}for(const[s,r]of this.links){if(e.has(s)||r.to===0)continue;let l=r.kind==="field"||n===r.a.id?"end":"start";r.p<.999&&(l=r.anchor),this.animate(r,t,0,l)}}animate(e,t,n,a){e.from=e.p,e.to=n,e.t0=t,e.anchor=a;const o=Math.abs(n-e.from)*e.len;e.dur=n?Math.min(1.25,Math.max(.45,o/14)):Math.min(.7,Math.max(.28,o/22))}update(e){for(const[t,n]of this.links){const a=nt((e-n.t0)/n.dur);n.p=n.from+(n.to-n.from)*na(a),n.moving=a<1&&e>=n.t0,n.to===1&&(n.doneAt=n.t0+n.dur),a>=1&&n.to===0&&this.links.delete(t)}}count(){let e=0;for(const t of this.links.values())t.to===1&&e++;return e}}function Nv(i){if(i.kind==="pair"){const c={...i,...Jl(Ec(i.key,i.a,i.b))};return c.portA=ds(c,Zl(i.a),!1),c.portB=ds(c,Zl(i.b),!0),c}const{pair:e,end:t,room:n}=i;let[a,o]=t,s=!1;const r=Math.hypot(a-e.x,o-e.z);if(r>Math.min(Rv,n)){const c=Math.min(Cv,n-.3)/r;a=e.x+(a-e.x)*c,o=e.z+(o-e.z)*c,s=!0}const l={...i,stub:s,...Jl([[e.x,e.z],[a,o]])};return l.portA=ds(l,{x:e.x,z:e.z,...ei.slabs},!1),l}function Zl(i){return{x:i.x-yc()[i.index][0],z:i.z,...ei.slabs}}function Jl(i){const e=[0];for(let t=1;t<i.length;t++)e.push(e[t-1]+Math.hypot(i[t][0]-i[t-1][0],i[t][1]-i[t-1][1]));return{pts:i,cum:e,len:e.at(-1)}}function Vn(i,e){const{pts:t,cum:n}=i;if(e<=0)return t[0];if(e>=i.len)return t.at(-1);let a=1;for(;n[a]<e;)a++;const o=(e-n[a-1])/(n[a]-n[a-1]||1);return[t[a-1][0]+(t[a][0]-t[a-1][0])*o,t[a-1][1]+(t[a][1]-t[a-1][1])*o]}function Ql(i){const e=i.p*i.len;return i.anchor==="start"?[0,e]:[i.len-e,i.len]}function ds(i,e,t){for(let a=0;a<=i.len;a+=.04){const[o,s]=Vn(i,t?i.len-a:a);if(Math.abs(o-e.x)>e.hx||Math.abs(s-e.z)>e.hz)return t?i.len-a:a}return t?0:i.len}const _t=Math.PI*2,Dv=sn+Vs.h/2,Uv=.5,ps=Gv(eo,et,.34),xt={frame:[0,.6],coast:[.05,.95],relief:[.45,1.25],bounds:[.9,1.7],marks:[1.2,1.95],labels:[1.45,2.2],stones:1.35};class Iv{constructor(e){this.canvas=e,this.ctx=e.getContext("2d"),this.dpr=1,this.island=null}resize(e,t,n){this.w=e,this.h=t,this.dpr=n,this.canvas.width=Math.round(e*n),this.canvas.height=Math.round(t*n)}floor(e=1){const[t,n,a,o,s,r]=this.A,l=this.dpr;this.ctx.setTransform(t*l*e,n*l*e,a*l*e,o*l*e,s*l,r*l)}screen(){this.ctx.setTransform(this.dpr,0,0,this.dpr,0,0)}device(){this.ctx.setTransform(1,0,0,1,0,0)}toScreen(e,t){const[n,a,o,s,r,l]=this.A;return[n*e+o*t+r,a*e+s*t+l]}visibleRect(e=3){const[t,n,a,o,s,r]=this.A,l=t*o-n*a,c=(p,g)=>{const v=p-s,m=g-r;return[(o*v-a*m)/l,(-n*v+t*m)/l]},h=[c(0,0),c(this.w,0),c(0,this.h),c(this.w,this.h)],u=h.map(p=>p[0]),f=h.map(p=>p[1]);return{x0:Math.min(...u)-e,x1:Math.max(...u)+e,z0:Math.min(...f)-e,z1:Math.max(...f)+e}}project(e){const t=new Path2D;return t.addPath(e,this.M),t}ink(e,t,n,a=1,o=null,s=0){if(a<=0)return;const r=this.ctx;this.device(),r.globalAlpha=a,r.lineWidth=t*this.dpr,r.strokeStyle=n,r.setLineDash(o?o.map(l=>l*this.dpr):[]),r.lineDashOffset=s*this.dpr,r.stroke(this.project(e)),r.globalAlpha=1}fillWorld(e,t,n=1){if(n<=0)return;const a=this.ctx;this.device(),a.globalAlpha=n,a.fillStyle=t,a.fill(this.project(e)),a.globalAlpha=1}stroke(e,t,n){const a=this.ctx;this.screen(),a.lineWidth=e,a.strokeStyle=t,a.setLineDash(n??[]),a.stroke()}keepOut(e){const t=new Path2D;t.rect(0,0,this.canvas.width,this.canvas.height),t.addPath(e,this.M),this.device(),this.ctx.clip(t,"evenodd")}keepIn(e){this.device(),this.ctx.clip(this.project(e))}draw(e){const t=this.ctx,n=e.board.island;this.A=e.A,this.now=e.now;const[a,o,s,r,l,c]=e.A,h=this.dpr;this.M=new DOMMatrix([a*h,o*h,s*h,r*h,l*h,c*h]),this.island!==n&&this.prepare(n,e.board.pairs),this.device(),t.clearRect(0,0,this.canvas.width,this.canvas.height),t.lineCap="round",t.lineJoin="round";const u=e.intro,f=this.visibleRect();this.sheet(Yt(u,xt.frame)),this.sea(u),this.relief(u),t.save(),this.keepOut(this.paths.upland),this.survey(u);const p=new Map;for(const _ of e.links.links.values())_.kind==="field"&&_.to===1&&p.set(_.feature,(p.get(_.feature)??0)+1);const g=Yt(u,xt.marks),v=Yt(u,xt.labels);n.places.forEach((_,w)=>{if(!ec(f,_.x,_.z,_.r+3))return;const P=Yi(nt(g*1.4-w*.05));P>0&&this.place(_,P)}),this.mokuLabels(v);for(const _ of n.places)this.fieldLabel(_,v,p.get(_)??0);const m=Et(nt((u-xt.stones)/.5)),d=Et(nt((u-xt.stones-.6)/.8)),M=e.board.pairs.filter(_=>ec(f,_.x,_.z,2.5));this.pairMarks(M,e.noted,m,d);for(const _ of e.links.links.values())_.kind==="field"&&this.fieldLink(_,e.noted.has(_.pair));for(const _ of e.links.links.values())_.kind==="pair"&&this.pairLink(_);for(const _ of e.links.links.values())_.kind==="pair"&&this.pairLabel(_);for(const _ of e.ripples)this.ripple(_);t.restore()}prepare(e,t){this.island=e,this.K=e.k;const n=l=>Je(l.map(c=>c.pts??c)),{sheet:a}=e,o=new Path2D;o.rect(a.x0,a.z0,a.x1-a.x0,a.z1-a.z0);const s=e.compass,r=new Path2D;r.arc(s.x,s.z,s.r*1.13,0,_t),this.paths={frame:o,disc:r,coast:n(e.coast),minor:Fv(e),major:n(e.contours.filter(l=>l.major).flatMap(l=>l.lines)),water:e.waterlines.map(l=>n(l.lines)),ahupuaa:Je(e.boundaries.filter(l=>!l.moku).map(l=>l.line)),moku:Je(e.boundaries.filter(l=>l.moku).map(l=>l.line)),offshore:Je(e.boundaries.map(l=>l.sea)),trail:Je(e.trail.firm),trailFlow:Je(e.trail.flow),windward:n(e.streams.filter(l=>l.windward)),leeward:n(e.streams.filter(l=>!l.windward)),reef:ms(e.reef.dots),upland:Je([e.upland.ring],!0),pond:Je([e.places.find(l=>l.kind==="fishpond").line],!0),cloud:Je([e.places.find(l=>l.kind==="cloud").line],!0)},this.placeArt=new Map(e.places.map(l=>[l,this.art(l)])),this.crests=null,this.surfAt=null,this.layoutLabels(e,t),this.compassType(s)}art(e){const t=this.K;switch(e.kind){case"compass":{const{x:n,z:a,r:o,horizon:s}=e,r=new Path2D;r.arc(n,a,o,0,_t),r.moveTo(n+s,a),r.arc(n,a,s,0,_t);const l=new Path2D,c=new Path2D;for(const f of e.houses){const[p,g]=Tn(f.bearing-_t/64);l.moveTo(n+p*s,a+g*s),l.lineTo(n+p*o,a+g*o);const[v,m]=Tn(f.bearing);if(l.moveTo(n+v*o,a+m*o),l.lineTo(n+v*o*1.04,a+m*o*1.04),!f.cardinal)continue;const d=f.bearing-_t/64-Math.PI/2,M=f.bearing+_t/64-Math.PI/2;c.moveTo(n+Math.cos(d)*s,a+Math.sin(d)*s),c.arc(n,a,o,d,M),c.arc(n,a,s,M,d,!0),c.closePath()}const h=new Path2D;for(const f of[0,Math.PI/2]){const[p,g]=Tn(f);h.moveTo(n-p*s,a-g*s),h.lineTo(n+p*s,a+g*s)}const u=new Path2D;return u.arc(n,a,o*.035,0,_t),{rings:r,spokes:l,cardinal:c,axes:h,centre:u}}case"fishpond":{const n=e.gates.map(c=>[c.x,c.z,c.w/2]),a=new Path2D,o=new Path2D,s=.045*t,r=zv(tc(e.line,.02*t));for(const c of[-1,1]){let h=!1;for(const[u,f,p,g]of r){if(n.some(([M,_,w])=>Math.hypot(u-M,f-_)<w)){h=!1;continue}const m=u+p*s*c,d=f+g*s*c;h?a.lineTo(m,d):a.moveTo(m,d),h=!0}}r.forEach(([c,h,u,f],p)=>{p%5||n.some(([g,v,m])=>Math.hypot(c-g,h-v)<m)||(o.moveTo(c-u*s,h-f*s),o.lineTo(c+u*s,h+f*s))});const l=new Path2D;for(const c of e.gates){const h=-c.dz,u=c.dx;for(const f of[-1,1]){const p=c.x+c.dx*f*c.w*.5,g=c.z+c.dz*f*c.w*.5;l.moveTo(p-h*s*2,g-u*s*2),l.lineTo(p+h*s*2,g+u*s*2)}l.moveTo(c.x-c.dx*c.w*.5,c.z-c.dz*c.w*.5),l.lineTo(c.x+c.dx*c.w*.5,c.z+c.dz*c.w*.5);for(let f=-1.5;f<=1.5;f++){const p=c.x+c.dx*c.w*.22*f,g=c.z+c.dz*c.w*.22*f;l.moveTo(p-h*s*.8,g-u*s*.8),l.lineTo(p+h*s*.8,g+u*s*.8)}}return{wall:a,joints:o,gates:l}}case"lava":return{edge:Je(e.edges),lobes:Je(e.lobes),ropes:Je(e.ropes),stipple:ms(e.stipple)};case"loi":return{banks:Je(e.terraces,!0),auwai:Je([e.auwai,e.drain])};case"kauhale":{const n=Je(e.houses.map(r=>r.paepae),!0),a=Je(e.houses.filter(r=>r.roof).map(r=>r.roof),!0),o=Je(e.houses.filter(r=>r.roof).flatMap(r=>[r.ridge,...r.hips])),s=new Path2D;for(const r of e.houses){if(!r.roof)continue;const[l,c,h,u]=r.roof;for(let f=1;f<9;f++){const p=f/9,g=[l[0]+(c[0]-l[0])*p,l[1]+(c[1]-l[1])*p],v=[u[0]+(h[0]-u[0])*p,u[1]+(h[1]-u[1])*p];for(const[m,d]of[[g,v],[v,g]])s.moveTo(...m),s.lineTo(m[0]+(d[0]-m[0])*.32,m[1]+(d[1]-m[1])*.32)}}return{paepae:n,roofs:a,ridges:o,thatch:s}}case"halau":return{shed:Je([e.shed],!0),ridge:Je([e.ridge]),thatch:Je(e.thatch),hulls:Je(e.hulls,!0),beams:Je([...e.beams,e.deck]),sand:ms(e.sand)};case"cloud":return{};case"stream":return{line:Je([e.line])}}return{}}measure(e,t,n,a=0){const o=this.ctx;o.font=gt(t,n),o.letterSpacing=`${a}px`;const s=o.measureText(e).width;return o.letterSpacing="0px",s/100}layoutLabels(e,t){const n=this.K,a=Math.round(92*n),o=Math.round(17*Math.max(.9,n));this.labelSize={word:a,small:o,gap:.36*Math.max(.9,n)};const s=[],r=e.places.find(S=>S.kind==="cloud"),l=e.places.find(S=>S.kind==="lava"),c=e.compass,{sheet:h}=e,u=S=>S.kind==="stream"||S.kind==="lava",f=e.places.filter(S=>!u(S)&&S!==r).map(S=>({p:S,x:S.x,z:S.z,r:S===c?S.r*1.28:S.r})),p=new Map,g=[...e.places.filter(u).map(S=>({own:S,cost:400,line:S.line})),...e.boundaries.map(S=>({own:null,cost:S.moku?120:40,line:S.line}))];for(const{own:S,cost:x,line:b}of g)for(const[N,L]of tc(b,.1)){const V=Math.floor(N)*4096+Math.floor(L);p.has(V)||p.set(V,[]),p.get(V).push({x:N,z:L,own:S,cost:x})}const v=ei.marks,m=t.map(S=>({x0:S.x+v.x0,x1:S.x+v.x1,z0:S.z-1.3,z1:S.z+v.z1})),d=t.map(S=>({x0:S.x+v.x1,x1:S.x+v.x1+1.6,z0:S.z+.85,z1:S.z+v.z1})),M=[],_=(S,x,b,N)=>{let L=Math.hypot((S.x0+S.x1)/2,(S.z0+S.z1)/2)*3;(S.x0<h.x0+.3||S.x1>h.x1-.3||S.z0<h.z0+.3||S.z1>h.z1-.3)&&(L+=1e7);for(const E of m)L+=1e6*gs(S,E);if(L>=N)return L;const V=b?{x0:S.x0-b,x1:S.x1+b,z0:S.z0-b,z1:S.z1+b}:S;for(const E of s)L+=1e6*gs(V,E);if(L>=N)return L;(x===r?nc(S,e.upland.ring):ic(S,r.x,r.z,r.r+.2))&&(L+=1e7);for(const E of f){if(E.p===x)continue;const C=ic(S,E.x,E.z,E.r+.15);C&&(L+=E.p===c?1e7:3e3*C)}x!==l&&nc(S,l.line)&&(L+=2e4);for(const E of d)L+=2e4*gs(S,E);if(L>=N)return L;for(let E=Math.floor(S.x0);E<=Math.floor(S.x1);E++)for(let C=Math.floor(S.z0);C<=Math.floor(S.z1);C++)for(const D of p.get(E*4096+C)??M)D.own!==x&&D.x>S.x0&&D.x<S.x1&&D.z>S.z0&&D.z<S.z1&&(L+=D.cost);if(x){const E=e.height,C=_n(E,E.h,(S.x0+S.x1)/2,(S.z0+S.z1)/2)<=0,D=x.kind==="fishpond"||x.kind==="compass";C!==D&&(L+=D?600:250)}return L},w=(S,x,b,N)=>{let L=null,V=1/0;for(const E of S){const C=N(E),D=_(E,x,b,V-C)+C;D<V&&(V=D,L=E)}return L},P=(S,x,b,N)=>({x0:S-b/2,x1:S+b/2,z0:x-N/2,z1:x+N/2});this.labels=new Map;for(const S of e.places){const x=Ja[S.field],b=Math.max(this.measure(x.label,a,{italic:!0}),this.measure(`${x.label.toUpperCase()} · ${x.en.toUpperCase()} — 00`,o,{weight:600},1.5)+.06),N=a/100*.74,L=N+this.labelSize.gap+.06,V=.25*n,E=[];if(u(S)){const D=S.kind==="stream"?S.line:S.axis,j=S.kind==="lava"?1*n:0;for(let F=.1;F<=.91;F+=.05){const z=Math.round(F*(D.length-1)),[G,B]=D[z],[q,I]=D[Math.min(D.length-1,z+1)],Y=Math.hypot(q-G,I-B)||1,W=-(I-B)/Y,Q=(q-G)/Y;for(const te of[-1,1])for(const se of[0,.5,1.1,1.8]){const pe=W*te,ee=Q*te,ce=V+j+se*n;E.push({...P(G+pe*ce+pe*b/2,B+ee*ce+ee*L/2,b,L),gap:se})}}}else for(let D=0;D<24;D++){const j=D/24*_t,F=Math.cos(j),z=Math.sin(j),G=S===r?Bv(S.line,S.x,S.z,F,z):S.kind==="compass"?S.r*1.3:S.r;for(const B of[0,.5,1.1,1.8,2.6]){const q=G+V+B*n;E.push({...P(S.x+F*q+F*b/2,S.z+z*q+z*L/2,b,L),gap:B})}}const C=w(E,S,0,D=>500*D.gap);s.push(C),this.labels.set(S,{x:C.x0,z:C.z0+N,box:C})}const k=Math.round(34*n);this.moku=e.moku.map(S=>{const x=S.name.toUpperCase(),b=k*.5,N=this.measure(x,k,{},b),L=k/100*.9,V=[];for(let C=-.9;C<=.91;C+=.15){const D=S.bearing+C,j=Ov(e,D),[F,z]=Tn(D);for(let G=.3;G<=.86;G+=.06){const B=e.summit[0]+F*j*G,q=e.summit[1]+z*j*G;V.push({...P(B,q,N,L),db:C})}}const E=w(V,null,.9,C=>Math.abs(C.db)*40);return s.push(E),{text:x,px:k,spacing:b,x:E.x0,z:E.z1-.1*L,box:E}});const T=[...this.labels.values(),...this.moku].map(({box:S})=>{const x=new Path2D,b=.08;return x.rect(S.x0-b,S.z0-b,S.x1-S.x0+2*b,S.z1-S.z0+2*b),{path:x,when:xt.labels}});for(const S of e.places)if(S.kind==="kauhale"||S.kind==="halau"){const x=new Path2D;x.arc(S.x,S.z,S.r*.95,0,_t),T.push({path:x,when:xt.marks})}else S.kind==="loi"&&T.push({path:Je([S.line],!0),when:xt.marks});this.gaps=T}fieldLabel(e,t,n){if(t<=0)return;const a=this.labels.get(e),o=Ja[e.field],s=this.ctx;this.floor(.01),s.globalAlpha=t,s.textAlign="left",s.textBaseline="alphabetic",s.fillStyle=ps,s.font=gt(this.labelSize.word,{italic:!0}),s.fillText(o.label,a.x*100,a.z*100),s.fillStyle=et,s.font=gt(this.labelSize.small,{weight:600}),s.letterSpacing="1.5px",s.fillText(`${o.label.toUpperCase()} · ${o.en.toUpperCase()} — ${String(n).padStart(2,"0")}`,a.x*100+4,(a.z+this.labelSize.gap)*100),s.letterSpacing="0px",s.globalAlpha=1}mokuLabels(e){if(e<=0)return;const t=this.ctx;this.floor(.01),t.globalAlpha=e*.75,t.fillStyle=et,t.textAlign="left",t.textBaseline="alphabetic";for(const n of this.moku)t.font=gt(n.px),t.letterSpacing=`${n.spacing}px`,t.fillText(n.text,n.x*100,n.z*100);t.letterSpacing="0px",t.globalAlpha=1}sheet(e){if(e<=0)return;const{sheet:t}=this.island,n=.16*this.K,a=new Path2D;a.rect(t.x0+n,t.z0+n,t.x1-t.x0-2*n,t.z1-t.z0-2*n),this.ink(this.paths.frame,1.4,We,e),this.ink(a,.7,et,e);const o=new Path2D,s=n*.5;for(let r=Math.ceil(t.x0);r<t.x1-1;r+=2)o.rect(r,t.z0,1,s),o.rect(r,t.z1-s,1,s);for(let r=Math.ceil(t.z0);r<t.z1-1;r+=2)o.rect(t.x0,r,s,1),o.rect(t.x1-s,r,s,1);this.fillWorld(o,et,e*.55)}sea(e){const t=this.ctx,n=Yt(e,xt.relief);t.save(),this.keepIn(this.paths.frame),this.keepOut(this.paths.disc);const a=this.paths.water.length;t.save(),this.keepOut(this.paths.pond),this.paths.water.forEach((r,l)=>{const c=Et(nt(n*1.6-l*.08));this.ink(r,.75,et,c*(.06+.6*Math.pow(1-l/a,1.5)))}),t.restore();const o=Et(Yt(e,[xt.marks[0],xt.marks[1]+1]));o>0&&this.swell(o);const s=Yt(e,xt.marks);this.ink(this.paths.reef,1.5,We,s*.7,[.01,1e4]),this.surf(s),t.restore()}swell(e){var a;const t=this.island.swell,n=this.now/t.period%1;if(!this.crests||Math.abs(n-this.crests.ph)*t.lambda>.02){const o=((a=this.crests)==null?void 0:a.S)??new Float32Array(t.nx*t.nz);for(let r=0;r<o.length;r++)o[r]=Number.isFinite(t.T[r])?Math.sin(_t*(t.T[r]/t.lambda-n)):-1;const s=[new Path2D,new Path2D,new Path2D];for(const r of wi({...t,h:o},0)){let l=null,c=-1;for(const[h,u]of r.pts){const f=_n(t,t.T,h,u),g=Number.isFinite(f)&&Math.cos(_t*(f/t.lambda-n))>0?Math.min(3,Math.floor(_n(t,t.energy,h,u)*4))-1:-1;g!==c?(l&&c>=0&&l.lineTo(h,u),l=g>=0?s[g]:null,l&&l.moveTo(h,u),c=g):l&&l.lineTo(h,u)}}this.crests={ph:n,buckets:s,S:o}}this.crests.buckets.forEach((o,s)=>this.ink(o,.8,et,e*[.16,.28,.42][s],[6,7]))}surf(e){var a;if(e<=0)return;const t=this.island.swell,n=Math.floor(this.now/t.period%1*240);if(((a=this.surfAt)==null?void 0:a.at)!==n){const o=n/240,s=[new Path2D,new Path2D,new Path2D];for(const r of this.island.reef.surf){const l=_n(t,t.T,r.x,r.z),c=Number.isFinite(l)?((l/t.lambda-o)%1+1)%1:.5,h=s[Math.min(2,Math.floor(Math.pow(Math.cos(Math.PI*c),8)*3))];h.moveTo(r.pts[0][0],r.pts[0][1]);for(let u=1;u<r.pts.length;u++)h.lineTo(r.pts[u][0],r.pts[u][1])}this.surfAt={at:n,buckets:s}}this.surfAt.buckets.forEach((o,s)=>this.ink(o,.8,We,e*[.3,.5,.8][s]))}relief(e){const t=Et(Yt(e,xt.relief));if(t>0){const[a,o,s,r]=this.A,l=a*a+o*o+s*s+r*r,c=a*r-o*s,h=Math.sqrt(Math.max(0,(l-Math.sqrt(Math.max(0,l*l-4*c*c)))/2));this.broken(e,u=>{for(const{lo:f,path:p}of this.paths.minor)this.ink(p,.7,et,t*u*.32*Et(nt((f*h-3)/2)));this.ink(this.paths.major,1.05,et,t*u*.8)})}const n=Yt(e,xt.coast);if(n>=1)this.ink(this.paths.coast,1.35,ct);else if(n>0){const a=new Path2D;for(const o of this.island.coast){const s=Math.max(2,Math.ceil(o.pts.length*Yi(n)));a.moveTo(...o.pts[0]);for(let r=1;r<s;r++)a.lineTo(...o.pts[r])}this.ink(a,1.35,ct)}}broken(e,t){const n=this.ctx;this.gapsAt!==this.M&&(this.gapsAt=this.M,this.gapsOut=this.gaps.map(a=>{const o=new Path2D;return o.rect(0,0,this.canvas.width,this.canvas.height),o.addPath(a.path,this.M),o})),n.save(),this.device();for(const a of this.gapsOut)n.clip(a,"evenodd");t(1),n.restore();for(const a of this.gaps){const o=1-Yt(e,a.when);o<=0||(n.save(),this.keepIn(a.path),t(o),n.restore())}}survey(e){const t=this.island,n=this.ctx,a=Yt(e,xt.bounds),o=(r,l)=>this.broken(e,c=>{n.save(),this.keepIn(this.paths.cloud),this.ink(r,.9,xi,c*.12),this.ink(l,1.9,xi,c*.25,[10,3,1.5,3]),n.restore(),n.save(),this.keepOut(this.paths.cloud),this.ink(r,.9,xi,c*.45),this.ink(l,1.9,xi,c*.85,[10,3,1.5,3]),n.restore()});if(a>=1)o(this.paths.ahupuaa,this.paths.moku),this.ink(this.paths.offshore,.9,xi,.35,[2.5,3.5]);else if(a>0){const r=new Path2D,l=new Path2D;t.boundaries.forEach((c,h)=>{const u=nt(a*1.5-h/t.boundaries.length*.5),f=c.moku?l:r,p=Math.ceil(c.line.length*Et(u));if(!(p<2)){f.moveTo(...c.line[0]);for(let g=1;g<p;g++)f.lineTo(...c.line[g])}}),o(r,l)}const s=Yt(e,xt.marks);if(!(s<=0)){this.ink(this.paths.windward,.95,We,s*.75),this.ink(this.paths.leeward,.85,et,s*.85,[4,2.5]),this.broken(e,r=>{this.ink(this.paths.trail,1.35,We,s*r*.8,[.01,3.4]),this.ink(this.paths.trailFlow,1.35,We,s*r*.8,[.01,7])}),this.screen(),n.globalAlpha=s,n.setLineDash([]),n.lineWidth=.9,n.strokeStyle=We,n.fillStyle=eo;for(const[r,l]of t.ahu){const[c,h]=this.toScreen(r,l);n.beginPath();for(const[u,f,p]of[[-2.1,0,1.75],[2.1,0,1.75],[0,-2.9,1.6]])n.moveTo(c+u+p,h+f),n.arc(c+u,h+f,p,0,_t);n.fill(),n.stroke()}n.globalAlpha=1}}place(e,t){const n=this.placeArt.get(e),a=this.now,o=this.K,s=this.ctx;switch(e.kind){case"compass":this.compass(e,n,t);break;case"fishpond":{this.ink(n.wall,.9,We,t),this.ink(n.joints,.6,et,t*.8),this.ink(n.gates,.8,We,t),this.floor(),s.beginPath();for(const r of e.rings){const l=(a+r.phase)%r.period/2.6;if(l>=1)continue;const c=(.04+.3*Yi(l))*o;s.moveTo(r.x+c,r.z),s.arc(r.x,r.z,c,0,_t)}s.globalAlpha=t*.55,this.stroke(.7,et),s.globalAlpha=1;break}case"lava":this.ink(n.edge,1,We,t),this.ink(n.lobes,.8,We,t*.8),this.ink(n.ropes,.65,et,t*.85),this.ink(n.stipple,1.1,We,t*.6,[.01,1e4]);break;case"loi":this.fillWorld(n.banks,ps,t*.6),this.ink(n.banks,.85,We,t),this.ink(n.auwai,.9,We,t*.85,[2.5,2.5],-a*5);break;case"kauhale":this.ink(n.paepae,.85,We,t),this.ink(n.thatch,.55,et,t*.9),this.ink(n.roofs,.8,We,t),this.ink(n.ridges,.7,We,t);break;case"halau":this.ink(n.sand,1,et,t*.6,[.01,1e4]),this.ink(n.thatch,.55,et,t*.9),this.ink(n.shed,.85,We,t),this.ink(n.ridge,.75,We,t),this.ink(n.hulls,.85,We,t),this.ink(n.beams,.75,We,t);break;case"cloud":this.cloud(e,t);break;case"stream":this.ink(n.line,1.5,We,t*.9),this.ink(n.line,1.6,ct,t*.7,[1.2,11],-a*7);break}}cloud(e,t){const n=this.now,a=this.ctx,o=this.island.seed,s=o*.37%_t,r=o*.71%_t,l=[[],[],[]];for(const c of e.strokes){const u=(.55+.3*Math.sin(3*c.b-n*.021+s)+.2*Math.sin(5*c.b+n*.013+r)+.12*Math.sin(11*c.b-n*.034))*Math.pow(Math.sin(Math.PI*c.f),.5);u<.3||l[Math.min(2,Math.floor((u-.3)*5))].push(c)}l.forEach((c,h)=>{if(c.length){this.floor(),a.beginPath();for(const u of c)a.moveTo(u.x0,u.z0),a.lineTo(u.x1,u.z1);a.globalAlpha=t*[.25,.42,.6][h],this.stroke(.6,et)}}),a.globalAlpha=1}compass(e,t,n){const a=this.ctx,{x:o,z:s,horizon:r}=e;this.fillWorld(t.cardinal,ps,n*.8),this.ink(t.rings,1,We,n),this.ink(t.spokes,.7,et,n),this.ink(t.axes,.6,et,n*.6,[2,4]),this.ink(t.centre,.8,We,n);const l=66,c=Math.floor(this.now/l),h=e.stars[(c%e.stars.length+e.stars.length)%e.stars.length],u=(this.now-c*l)/60,f=u<=1?Et(nt(u*12))*Et(nt((1-u)*12)):0,p=v=>[o+v[0]*r,s+v[1]*r];if(f>0){const v=h.path,m=u*(v.length-1);this.floor(),a.beginPath(),v.forEach((S,x)=>x?a.lineTo(...p(S)):a.moveTo(...p(S))),a.globalAlpha=n*f*.6,this.stroke(.9,et,[.01,3]),this.floor(),a.beginPath(),a.moveTo(...p(v[0]));for(let S=1;S<=Math.floor(m);S++)a.lineTo(...p(v[S]));const d=Math.floor(m),M=m-d,_=v[d],w=v[Math.min(v.length-1,d+1)],P=p([_[0]+(w[0]-_[0])*M,_[1]+(w[1]-_[1])*M]);a.lineTo(...P),a.globalAlpha=n*f*.8,this.stroke(.9,We);const[k,T]=this.toScreen(...P);this.screen(),a.globalAlpha=n*f,a.fillStyle=ct,a.beginPath(),a.arc(k,T,2.3,0,_t),a.fill(),a.strokeStyle=ct,a.lineWidth=.8,a.beginPath();for(let S=0;S<4;S++){const x=S*Math.PI/2;a.moveTo(k+Math.cos(x)*3.8,T+Math.sin(x)*3.8),a.lineTo(k+Math.cos(x)*6.5,T+Math.sin(x)*6.5)}a.stroke(),a.globalAlpha=1}a.textAlign="center",a.textBaseline="middle";let g=null;for(const v of this.compassNames){const m=f>0&&v.name===h.name&&(v.quadrant===h.rises||v.quadrant===h.sets),d=m?v.lit:v.style;this.floor(.01),a.translate(v.x*100,v.z*100),a.rotate(v.ang),d!==g&&(a.font=d.font,a.letterSpacing=d.spacing,g=d),a.fillStyle=v.cardinal||m?ct:We,a.globalAlpha=n*(v.cardinal||m?1:.85),a.fillText(v.text,0,0)}this.floor(.01),a.globalAlpha=n,a.letterSpacing="0px",a.font=this.compassQuadrantFont,a.fillStyle=et;for(const v of e.quadrants){const[m,d]=Tn(v.bearing);a.fillText(v.name,(o+m*r*.6)*100,(s+d*r*.6)*100)}a.font=this.compassCredit.font,a.textAlign="center",a.textBaseline="alphabetic",a.globalAlpha=n*.9;for(const v of this.compassCredit.chars)this.floor(.01),a.translate(v.x*100,v.z*100),a.rotate(v.ang),a.fillText(v.text,0,0);a.globalAlpha=1}compassType(e){const t=this.ctx,{x:n,z:a,r:o,horizon:s}=e,r=(s+o)/2,l=(o-s)*100*.86,c=Math.round(o*7.4),h=(d,M,_)=>{t.font=gt(M,{weight:_}),t.letterSpacing=`${M*.06}px`;const w=t.measureText(d).width;return w>l&&(M=Math.floor(M*l/w)),t.letterSpacing="0px",t.font=gt(M,{weight:_}),{font:t.font,spacing:`${M*.06}px`}};this.compassNames=e.houses.map(d=>{const M=d.name.toUpperCase(),_=d.cardinal?Math.round(c*1.1):c,[w,P]=Tn(d.bearing),k=h(M,_,600);return{name:d.name,quadrant:d.quadrant,cardinal:d.cardinal,text:M,x:n+w*r,z:a+P*r,ang:d.bearing-Math.PI/2+(d.bearing>Math.PI?Math.PI:0),style:d.cardinal?k:h(M,_,400),lit:k}}),t.font=gt(Math.round(c*1.05),{italic:!0}),this.compassQuadrantFont=t.font;const u=Math.round(c*.9);t.font=gt(u,{italic:!0});const f=[..."after PVS / Nainoa Thompson"],p=f.map(d=>t.measureText(d).width/100),g=p.reduce((d,M)=>d+M,0),v=o*1.05+u/100*.7;let m=-g/2;this.compassCredit={font:t.font,chars:f.map((d,M)=>{const _=Math.PI-(m+p[M]/2)/v;m+=p[M];const[w,P]=Tn(_);return{text:d,x:n+w*v,z:a+P*v,ang:_-Math.PI}})}}pairMarks(e,t,n,a){if(n<=0)return;const o=this.ctx,s=Dv+.2,r=Uv+.2;for(const h of[!1,!0]){this.floor(),o.beginPath();for(const u of e){if(t.has(u)!==h)continue;const f=h?.34:.22;for(const[p,g,v,m]of[[u.x-s,u.z-r,1,1],[u.x+s,u.z-r,-1,1],[u.x-s,u.z+r,1,-1],[u.x+s,u.z+r,-1,-1]])o.moveTo(p+v*f,g),o.lineTo(p,g),o.lineTo(p,g+m*f)}o.globalAlpha=n,this.stroke(h?1.4:1,h?ct:et)}if(o.globalAlpha=1,a<=0)return;const l=this.now,c=e.map(h=>{const u=h.caption;let f=u.prev1,p=u.prev2,g=0;if(l>=u.t0){const d=Math.floor((l-u.t0)/.026);f=u.text1.slice(0,d),p=u.text2.slice(0,Math.max(0,d-u.text1.length*.4)),d<u.text1.length?g=1:p.length<u.text2.length&&(g=2)}else if(l>=u.t0-.3){const d=nt((u.t0-l)/.3);f=u.prev1.slice(0,Math.ceil(u.prev1.length*d)),p=u.prev2.slice(0,Math.ceil(u.prev2.length*d))}const v=(h.x-s)*100,m=(h.z+r+.34)*100;return{p:h,x:v,y0:(h.z-r-.1)*100,y1:m,y2:m+27,l1:f,l2:p,cursor:g,noted:t.has(h)}});o.globalAlpha=a,this.floor(.01),o.textAlign="left",o.textBaseline="alphabetic",o.fillStyle=et,o.font=gt(14);for(const h of c)o.fillText(String(h.p.id+1).padStart(3,"0"),h.x,h.y0);for(const[h,u,f,p]of[["l1","y1",gt(17,{weight:600}),"1.6px"],["l2","y2",gt(17),"0px"]]){o.font=f,o.letterSpacing=p;const g=h==="l1"?1:2;for(const v of c)o.fillStyle=g===2?et:v.noted?ct:We,o.fillText(v[h],v.x,v[u]),v.cursor===g&&(o.fillStyle=ct,o.fillRect(v.x+o.measureText(v[h]).width+2,v[u]-14,9,17))}o.letterSpacing="0px",o.globalAlpha=1}span(e){const[t,n]=Ql(e);if(n-t<.005)return null;const a=this.ctx;this.floor(),a.beginPath();const o=Vn(e,t);a.moveTo(o[0],o[1]);for(let r=1;r<e.pts.length;r++)if(!(e.cum[r]<=t)){if(e.cum[r]>=n)break;a.lineTo(e.pts[r][0],e.pts[r][1])}const s=Vn(e,n);return a.lineTo(s[0],s[1]),[t,n]}dot(e,t,n,a,o){const s=this.ctx,[r,l]=this.toScreen(e,t);this.screen(),s.beginPath(),s.arc(r,l,n,0,_t),a&&(s.fillStyle=a,s.fill()),o&&(s.setLineDash([]),s.lineWidth=1,s.strokeStyle=o,s.stroke())}pairLink(e){const t=this.span(e);if(!t)return;const[n,a]=t;this.stroke(1.3,ct);for(const o of[e.portA,e.portB])if(o>=n-.001&&o<=a+.001){const[s,r]=Vn(e,o);this.dot(s,r,2.6,eo,ct)}if(e.moving){const[o,s]=Vn(e,e.anchor==="start"?a:n);this.dot(o,s,2.4,ct)}}pairLabel(e){const[t,n]=Ql(e),a=e.len/2;if(a<t||a>n)return;const o=e.anchor==="start"?n-a:a-t,s=Et(nt(o/.8));if(s<=0)return;const r=this.ctx,[l,c]=Vn(e,a),[h,u]=this.toScreen(l,c),f=yi(e.stone),p=.6+.4*s;r.setTransform(this.dpr*p,0,0,this.dpr*p,h*this.dpr,u*this.dpr),r.font=gt(10.5,{weight:600}),r.letterSpacing="0.8px";const g=r.measureText(f).width+12,v=15;r.globalAlpha=s,r.beginPath(),r.roundRect(-g/2,-v/2,g,v,v/2),r.fillStyle=sh,r.fill(),r.setLineDash([]),r.lineWidth=1,r.strokeStyle=ct,r.stroke(),r.fillStyle=ct,r.textAlign="center",r.textBaseline="middle",r.fillText(f,-.4,.8),r.textBaseline="alphabetic",r.letterSpacing="0px",r.globalAlpha=1,this.pulse(h,u,e,g/2,v/2)}pulse(e,t,n,a,o){const s=(this.now-n.doneAt)/.9;if(!(s>=0&&s<1))return;const r=this.ctx,l=16*Yi(s);this.screen(),r.beginPath(),r.roundRect(e-a-l,t-o-l,2*(a+l),2*(o+l),o+l),r.globalAlpha=(1-s)*.8,r.setLineDash([]),r.lineWidth=1,r.strokeStyle=ct,r.stroke(),r.globalAlpha=1}fieldLink(e,t){const n=this.span(e);if(!n)return;const[a,o]=n,s=t?xi:We;if(this.stroke(t?1.2:1,s,[3,3.5]),e.portA>=a&&e.portA<=o){const[v,m]=Vn(e,e.portA);this.dot(v,m,2.2,eo,s)}if(o<e.len-.001)return;const r=this.ctx,[l,c]=e.pts.at(-1),[h,u]=this.toScreen(l,c),[f,p]=this.toScreen(...e.pts[0]),g=Math.atan2(u-p,h-f);this.screen(),r.setLineDash([]),r.strokeStyle=s,r.fillStyle=s,r.lineWidth=1,r.beginPath(),e.stub?(r.moveTo(h+Math.cos(g+2.6)*6,u+Math.sin(g+2.6)*6),r.lineTo(h,u),r.lineTo(h+Math.cos(g-2.6)*6,u+Math.sin(g-2.6)*6),r.stroke(),r.font=gt(12,{italic:!0}),r.textAlign=Math.cos(g)>=0?"left":"right",r.textBaseline="middle",r.fillText(Ja[e.feature.field].label,h+Math.cos(g)*9,u+Math.sin(g)*9),r.textBaseline="alphabetic"):(r.moveTo(h+3.2,u),r.lineTo(h,u+3.2),r.lineTo(h-3.2,u),r.lineTo(h,u-3.2),r.closePath(),r.fill(),this.pulse(h,u,e,3,3))}ripple(e){const t=nt((this.now-e.t0)/e.dur);if(t<=0||t>=1)return;const n=Yi(t),a=sn/2+.06+.7*n,o=.56+.7*n,s=this.ctx;this.floor(),s.beginPath(),s.roundRect(e.x-a,e.z-o,2*a,2*o,.12+.5*n),s.globalAlpha=(1-t)*.7,this.stroke(1,ct),s.globalAlpha=1}}function Yt(i,[e,t]){return nt((i-e)/(t-e))}function ec(i,e,t,n){return e+n>i.x0&&e-n<i.x1&&t+n>i.z0&&t-n<i.z1}function Tn(i){return[Math.sin(i),-Math.cos(i)]}function Je(i,e=!1){const t=new Path2D;for(const n of i)if(!(!n||n.length<2)){t.moveTo(n[0][0],n[0][1]);for(let a=1;a<n.length;a++)t.lineTo(n[a][0],n[a][1]);e&&t.closePath()}return t}function ms(i){const e=new Path2D;for(const[t,n]of i)e.moveTo(t,n),e.lineTo(t+.001,n);return e}const Wa=[0,.04,.06,.08,.1,.125,.15,.2];function Fv(i){const e=i.height,t=i.contours,n=t[1].level-t[0].level,a=e.step,o=(l,c)=>{const h=_n(e,e.h,l+a,c)-_n(e,e.h,l-a,c),u=_n(e,e.h,l,c+a)-_n(e,e.h,l,c-a);return n/(Math.hypot(h,u)/(2*a)||1e-9)},s=l=>{let c=0;for(;c+1<Wa.length&&l>=Wa[c+1];)c++;return c},r=Wa.map(()=>[]);for(const l of t)if(!l.major)for(const{pts:c}of l.lines){let h=null,u=-1;for(let f=1;f<c.length;f++){const[p,g]=c[f-1],[v,m]=c[f],d=s(o((p+v)/2,(g+m)/2));d!==u&&(h=[c[f-1]],r[d].push(h),u=d),h.push(c[f])}}return Wa.map((l,c)=>({lo:l,path:Je(r[c])}))}function tc(i,e){const t=[i[0]];for(let n=1;n<i.length;n++){const[a,o]=i[n-1],[s,r]=i[n],l=Math.max(1,Math.ceil(Math.hypot(s-a,r-o)/e));for(let c=1;c<=l;c++)t.push([a+(s-a)*c/l,o+(r-o)*c/l])}return t}function zv(i){return i.map((e,t)=>{const n=i[Math.max(0,t-1)],a=i[Math.min(i.length-1,t+1)],o=a[0]-n[0],s=a[1]-n[1],r=Math.hypot(o,s)||1;return[e[0],e[1],-s/r,o/r]})}function _n(i,e,t,n){const a=(t-i.x0)/i.step,o=(n-i.z0)/i.step,s=Math.max(0,Math.min(i.nx-2,Math.floor(a))),r=Math.max(0,Math.min(i.nz-2,Math.floor(o))),l=nt(a-s),c=nt(o-r),h=r*i.nx+s;return(e[h]*(1-l)+e[h+1]*l)*(1-c)+(e[h+i.nx]*(1-l)+e[h+i.nx+1]*l)*c}function Ov(i,e){const[t,n]=Tn(e),a=i.height,[o,s]=i.summit;let r=0;for(;r<60&&_n(a,a.h,o+t*r,s+n*r)>0;)r+=.1;return r}function Bv(i,e,t,n,a){let o=0;for(let s=1;s<i.length;s++){const[r,l]=i[s-1],[c,h]=i[s],u=c-r,f=h-l,p=n*f-a*u;if(!p)continue;const g=((r-e)*f-(l-t)*u)/p,v=((r-e)*a-(l-t)*n)/p;g>0&&v>=0&&v<=1&&(o=Math.max(o,g))}return o}function nc(i,e){const t=(a,o)=>{let s=!1;for(let r=0,l=e.length-1;r<e.length;l=r++){const[c,h]=e[r],[u,f]=e[l];h>o!=f>o&&a<(u-c)*(o-h)/(f-h)+c&&(s=!s)}return s};return[[i.x0,i.z0],[i.x1,i.z0],[i.x0,i.z1],[i.x1,i.z1],[(i.x0+i.x1)/2,(i.z0+i.z1)/2]].some(([a,o])=>t(a,o))||e.some(([a,o])=>a>i.x0&&a<i.x1&&o>i.z0&&o<i.z1)}function gs(i,e){const t=Math.min(i.x1,e.x1)-Math.max(i.x0,e.x0),n=Math.min(i.z1,e.z1)-Math.max(i.z0,e.z0);return t>0&&n>0?t*n:0}function ic(i,e,t,n){const a=Math.max(i.x0-e,0,e-i.x1),o=Math.max(i.z0-t,0,t-i.z1),s=Math.hypot(a,o);return s<n?n-s:0}function Gv(i,e,t){const n=parseInt(i.slice(1),16),a=parseInt(e.slice(1),16),o=s=>Math.round((n>>s&255)*(1-t)+(a>>s&255)*t);return`rgb(${o(16)}, ${o(8)}, ${o(0)})`}const Hv={letters:"abcdefghijklmnopqrstuvwxyz"},po={vowels:"aeiouaeiouāēīōū",consonants:"hklmnpw"},Vv={vowels:po.vowels.toUpperCase(),consonants:po.consonants.toUpperCase()},Wv={vowels:"aeiou",consonants:"fhklmnŋpqrstvw"},qv={vowels:po.vowels,consonants:"fghklmnprstvw"},ia=/[\p{L}ʻ]/u,vs=/[aeiouāēīōū]/iu;class Xv{constructor(e,t){this.root=e,this.canvas=t,this.ctx=t.getContext("2d"),this.measure=document.createElement("canvas").getContext("2d"),this.list=[],this.queue=[],this.dpr=1}resize(e,t,n){this.w=e,this.h=t,this.dpr=n,this.canvas.width=Math.round(e*n),this.canvas.height=Math.round(t*n)}has(e){return this.list.some(t=>t.pair===e&&!t.closing)}noted(){return new Set(this.list.filter(e=>!e.closing).map(e=>e.pair))}open(e,t){const n=document.createElement("div");n.className="card",n.innerHTML=`
      <div class="card-head"><span class="no"></span><span class="rule"></span><span class="field"></span></div>
      <div class="card-word" lang="haw"><span class="k"></span><span class="sep"></span><span class="k"></span><i class="ring"></i></div>
      <div class="card-gloss"></div>
      <div class="card-parts">
        <div><b lang="haw"></b><span class="sense"></span><p class="pp"><span class="code"></span><i></i></p></div>
        <div><b lang="haw"></b><span class="sense"></span><p class="pp"><span class="code"></span><i></i></p></div>
      </div>
      <div class="card-cog"></div>
      <div class="card-hist"></div>`,this.root.appendChild(n);const a=c=>n.querySelector(c),o={pair:e,el:n,no:a(".no"),field:a(".field"),word:a(".card-word"),ks:[...n.querySelectorAll(".k")],sep:a(".sep"),gloss:a(".card-gloss"),parts:[...n.querySelectorAll(".card-parts > div")].map(c=>({el:c,stone:c.querySelector("b"),gloss:c.querySelector(".sense"),code:c.querySelector(".code"),pp:c.querySelector(".pp i")})),cog:a(".card-cog"),hist:a(".card-hist"),hot:null,scrambles:[],t0:t,closing:null,x:null,y:null,side:null,from:null,offset:null,moved:0,bad:0,pulse:-10},s=getComputedStyle(o.cog);o.room=o.word.clientWidth||200,o.wordPx=parseFloat(getComputedStyle(o.word).getPropertyValue("--word"))||36,o.cogRoom=o.cog.clientWidth||200,o.cogFont=`${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;const r=e.entry,l=e.history.at(-1);return l&&(o.hot=l.a!==r.a?0:1),this.fill(o,r,l),o.no.textContent=`No. ${String(e.id+1).padStart(3,"0")}`,this.list.push(o),this.queue.push({at:t+.32,run:()=>n.classList.add("open")}),o}close(e,t){e.closing||(e.closing=t,e.el.classList.remove("open"))}fill(e,t,n){const a=ac(t);this.setWord(e,a,t),this.fit(e,a,t),e.gloss.textContent=t.gloss,this.setField(e,t);for(const o of[0,1])this.setPart(e,o,o?t.b:t.a);e.parts.forEach((o,s)=>o.el.classList.toggle("hot",s===e.hot)),e.cogs=this.cognates(e,t),e.cog.textContent=Ns(e.cogs),this.setHist(e,n)}setField(e,t){const n=Ja[t.field];e.field.innerHTML=`<i lang="haw">${Xa(n.label)}</i><span class="dot">·</span><span class="sc">${Xa(n.en)}</span>`}setPart(e,t,n){const a=e.parts[t];a.stone.textContent=yi(n);const o=qa(n);a.code.textContent=o.code,a.pp.textContent=o.form,a.gloss.textContent=gn[n].g}setWord(e,t,n){e.ks[0].textContent=t.a,e.ks[1].textContent=t.b,e.sep.textContent=t.sep,e.word.classList.toggle("pending",n.ev==="pending")}setHist(e,t){e.hist.innerHTML=t?`was <i lang="haw">${Xa(t.word)}</i>${t.ev==="pending"?'<i class="ring"></i>':""} ${Xa(t.gloss)}`:"&nbsp;"}fit(e,t,n){const a=this.measure;a.font=gt(100,{weight:600});const o=[a.measureText(t.a).width/100,a.measureText(t.b).width/100];a.font=gt(100);const s=o[0]+o[1]+a.measureText(t.sep).width/100+(n.ev==="pending"?.36:0);e.ks.forEach((r,l)=>r.style.width=`${o[l].toFixed(3)}em`),e.word.style.fontSize=`${Math.min(e.wordPx,(e.room-2)/s).toFixed(2)}px`}cognates(e,t){if(e.hot==null)return[];const n=[];this.measure.font=e.cogFont;for(const a of gn[e.hot?t.b:t.a].cog){if(n.length&&this.measure.measureText(Ns([...n,a])).width>e.cogRoom)break;n.push(a)}return n}turn(e,t,n,a){const o=this.list.find(s=>s.pair===e&&!s.closing);o&&this.queue.push({at:a,run:()=>this.startTurn(o,t,n,e.entry,a)})}startTurn(e,t,n,a,o){const s=e.ks[t],r=ac(a);s.classList.remove("turn"),s.offsetWidth,s.classList.add("turn"),e.word.classList.add("glide"),this.fit(e,r,a),this.queue.push({at:o+.3,run:()=>this.setWord(e,r,a)}),this.queue.push({at:o+.7,run:()=>e.word.classList.remove("glide")}),e.pulse=o;const l=t?a.b:a.a,c=t?n.b:n.a,h=e.parts[t];e.hot=t,e.parts.forEach((f,p)=>f.el.classList.toggle("hot",p===t));const u=this.cognates(e,a);e.scrambles=[{el:e.gloss,t0:o+.1,dur:.7,...sc(n.gloss,a.gloss)},{el:h.stone,t0:o+.05,dur:.5,...Ds(yi(c),yi(l),Vv)},{el:h.pp,t0:o+.08,dur:.5,...Ds(qa(c).form,qa(l).form,Wv)},{el:h.gloss,t0:o+.1,dur:.6,...sc(gn[c].g,gn[l].g)},{el:e.cog,t0:o+.18,dur:.75,...$v(e.cogs,u)}],e.cogs=u,h.code.textContent=qa(l).code,this.setField(e,a),this.setHist(e,n)}update(e,t,n,a){for(let l;(l=this.queue.filter(c=>c.at<=t)).length;){this.queue=this.queue.filter(c=>c.at>t);for(const c of l)c.run()}const o=this.list.map(l=>[l.el.offsetWidth||236,l.el.offsetHeight||180]);for(const l of this.list){const c=l.pair;[l.ax,l.ay]=e.project(c.x,1,c.z),l.below=Math.max(70,e.project(c.x,0,c.z+Ws)[1]-l.ay+8),l.beside=Math.abs(e.project(c.x+ei.slabs.hx,1,c.z)[0]-l.ax)+16}const s=this.list.filter(l=>!l.closing),r=this.h<Yv?[...oc,"e","w"]:oc;this.list.forEach((l,c)=>{const{ax:h,ay:u}=l,[f,p]=o[c];l.hMax=Math.max(l.hMax??0,p),l.hs=l.hs==null?p:l.hs+(l.hMax-l.hs)*(1-Math.exp(-n*6));const g=l.hs,v=jv(f,g,l.below,l.beside),m=w=>{const P=h+v[w][0],k=u+v[w][1];let T=0;for(const S of s)S===l||S.x==null||(T+=$a(P,k,f,g,S.x,S.y,S.w,S.h)*3,T+=$a(P,k,f,g,S.ax-20,S.ay-20,40,40)*2);for(const S of a)T+=$a(P,k,f,g,S.x,S.y,S.w,S.h)*2;return T+=(f*g-$a(P,k,f,g,8,8,this.w-16,this.h-16))*2,T},d=()=>r.reduce((w,P)=>m(P)<m(w)?P:w);if(!l.side)l.side=d(),l.from=v[l.side],l.fromEast=Ya(l.side),l.moved=t,l.bad=0,l.el.classList.toggle("from-right",!Ya(l.side));else if(!l.closing){const w=m(l.side);if(l.bad=w>f*g*.18?l.bad+n:0,l.bad>.5&&t-l.moved>3){const P=d();P!==l.side&&m(P)<w*.4&&(l.from=l.offset,l.fromEast=l.east,l.side=P,l.moved=t,l.bad=0,l.el.classList.toggle("from-right",!Ya(P)))}}const M=na(nt((t-l.moved)/.6)),_=v[l.side];l.offset=[l.from[0]+(_[0]-l.from[0])*M,l.from[1]+(_[1]-l.from[1])*M],l.east=l.fromEast+(Ya(l.side)-l.fromEast)*M,l.x=Math.max(8,Math.min(this.w-f-8,h+l.offset[0])),l.y=Math.max(8,Math.min(this.h-g-8,u+l.offset[1])),l.w=f,l.h=p,l.el.style.transform=`translate3d(${l.x.toFixed(1)}px, ${l.y.toFixed(1)}px, 0)`;for(const w of l.scrambles)Zv(w,t)});for(const l of this.list)l.closing&&t-l.closing>=.9&&l.el.remove();this.list=this.list.filter(l=>!l.closing||t-l.closing<.9),this.draw(t)}draw(e){const t=this.ctx;t.setTransform(1,0,0,1,0,0),t.clearRect(0,0,this.canvas.width,this.canvas.height),t.setTransform(this.dpr,0,0,this.dpr,0,0),t.lineCap="round",t.lineJoin="round";for(const n of this.list){const{ax:a,ay:o}=n,s=n.x+n.w*(1-n.east),r=s>=a?1:-1,l=n.y+34,c=l-o;let h=a+r*Math.abs(c);r*(h-s)>-12&&(h=s-r*12);const u=[[a,o],[h,l],[s,l]];let f=na(nt((e-n.t0)/.38));if(n.closing&&(f=Math.min(f,1-na(nt((e-n.closing-.4)/.35)))),f<=0)continue;const p=[Math.hypot(u[1][0]-u[0][0],u[1][1]-u[0][1]),Math.abs(u[2][0]-u[1][0])];let g=(p[0]+p[1])*f;t.beginPath(),t.moveTo(a,o);for(let d=0;d<2&&g>0;d++){const M=Math.min(1,g/(p[d]||1));t.lineTo(u[d][0]+(u[d+1][0]-u[d][0])*M,u[d][1]+(u[d+1][1]-u[d][1])*M),g-=p[d]}t.strokeStyle=ct,t.lineWidth=1,t.stroke();const v=Et(nt(f*3));t.beginPath(),t.arc(a,o,3.2*v,0,Math.PI*2),t.fillStyle=ct,t.fill(),t.beginPath(),t.arc(a,o,7*v,0,Math.PI*2),t.strokeStyle=ct,t.stroke();const m=(e-n.pulse)/.9;m>=0&&m<1&&(t.beginPath(),t.arc(a,o,7+26*Et(m),0,Math.PI*2),t.globalAlpha=1-m,t.stroke(),t.globalAlpha=1),f>=1&&!n.closing&&(t.beginPath(),t.arc(s,l,2.4,0,Math.PI*2),t.fillStyle=sh,t.fill(),t.stroke())}}}function ac(i){const e=i.word,t=$i(gn[i.a].s).length;if($i(e).replace(/ /g,"")===$i(gn[i.a].s)+$i(gn[i.b].s)){let n=0,a=0;for(;n<t;)$i(e[a++])&&e[a-1]!==" "&&n++;const o=e.slice(a);return o[0]===" "?{a:e.slice(0,a),sep:" ",b:o.slice(1)}:{a:e.slice(0,a),sep:"·",b:o}}return{a:e,sep:"",b:""}}function qa(i){const e=gn[i].pp,t=e.match(/^(\S+) (\*.*)$/);return t?{code:t[1],form:t[2]}:{code:"",form:e}}function $i(i){return i.toLowerCase().normalize("NFD").replace(/[\p{M}ʻ]/gu,"")}function Xa(i){return i.replace(/[&<>"]/g,e=>`&${{"&":"amp","<":"lt",">":"gt",'"':"quot"}[e]};`)}const oc=["ne","nw","se","sw"],Yv=520,Ya=i=>i.endsWith("e")?1:0,ja=44;function jv(i,e,t,n){return{ne:[ja,-64-e],nw:[-ja-i,-64-e],se:[ja,t],sw:[-ja-i,t],e:[n,-74],w:[-n-i,-74]}}function $a(i,e,t,n,a,o,s,r){const l=Math.max(0,Math.min(i+t,a+s)-Math.max(i,a)),c=Math.max(0,Math.min(e+n,o+r)-Math.max(e,o));return l*c}function Ns(i){return i.map(([e,t])=>`${e} ${t}`).join(" · ")}function Ds(i,e,t){const n=Math.max([...i].length,[...e].length);return{runs:[{from:[...i],to:[...e],sets:Array(n).fill(t)}],text:e}}function sc(i,e){const t=[...i],n=[...e],a=rc(t),o=rc(n),s=Array.from({length:Math.max(t.length,n.length)},(r,l)=>(l<n.length?o[l]:a[l])?po:Hv);return{runs:[{from:t,to:n,sets:s}],text:e}}function $v(i,e){var o,s;const t=[],n=(r,l)=>r[l]?`${l?" · ":""}${r[l][0]} `:"",a=(r,l)=>({from:[...r],to:[...l],sets:null});for(let r=0;r<Math.max(i.length,e.length);r++)i[r]&&e[r]?(t.push(a(n(i,r),n(e,r))),t.push(Ds(i[r][1],e[r][1],qv).runs[0])):t.push(a(n(i,r)+(((o=i[r])==null?void 0:o[1])??""),n(e,r)+(((s=e[r])==null?void 0:s[1])??"")));return{runs:t,text:Ns(e)}}const Kv=/[ʻāēīōū]/iu;function rc(i){const e=i.map(()=>!1);for(let t=0;t<i.length;t++){if(!ia.test(i[t]))continue;let n=t;for(;n<i.length&&ia.test(i[n]);)n++;i.slice(t,n).some(a=>Kv.test(a))&&e.fill(!0,t,n),t=n}return e}function Zv(i,e){const t=(e-i.t0)/i.dur;if(t<0||i.done)return;if(t>=1){i.el.textContent=i.text,i.done=!0;return}const n=i.runs.reduce((s,r)=>s+lc(r),0)||1;let a="",o=0;for(const s of i.runs)a+=Jv(s,t,o,n),o+=lc(s);i.el.textContent=a}const lc=i=>Math.max(i.from.length,i.to.length);function Jv({from:i,to:e,sets:t},n,a,o){var u;const s=f=>(a+f)/o*.75+.2;if(!t)return(n>=s(0)?e:i).join("");let r=Math.round(i.length+(e.length-i.length)*Math.min(1,n*1.6));for(;r<e.length&&n>=s(Math.max(0,r-1));)r++;const l=[];for(let f=0;f<r;f++){const p=s(f);n>=p||i[f]===e[f]?l.push(e[f]??""):n<p-.35&&f<i.length?l.push(i[f]):i[f]===" "||e[f]!==void 0&&!ia.test(e[f])?l.push(e[f]??" "):e[f]==="ʻ"?l.push(i[f]??""):l.push(null)}const c=r-1;(u=t[c])!=null&&u.vowels&&n<s(c)&&ia.test(l[c]??"")&&!vs.test(l[c])&&(l[c]=null);let h="";for(let f=0;f<r;f++){if(l[f]!=null){h+=l[f];continue}const p=t[f];let g=p.letters;if(p.vowels){const v=l.slice(f+1).find(M=>M!==""),m=h.at(-1)??"";g=ia.test(m)&&!vs.test(m)||v===void 0||v!==null&&!vs.test(v)||Math.random()<.5?p.vowels:p.consonants}h+=g[Math.floor(Math.random()*g.length)]}return h}const _s=.86,Qv=.15,cc={wait:15,rest:40},e_=180,t_=10;class n_{constructor({board:e,scene:t,links:n,notes:a,ripples:o}){this.board=e,this.scene=t,this.links=n,this.notes=a,this.ripples=o,this.paused=!1,this.meta=new WeakMap,this.carded=new Map}start(e){this.t0=e,this.nextBackground=e+3.6,this.nextNoteCheck=e+1.7}capacity(){const{w:e,h:t}=this.scene,n=e<520?1:e<700?2:e<1440?3:4;return t<520?Math.min(n,1):t<700?Math.min(n,2):n}inView(e=.1){const{w:t,h:n}=this.scene;return this.board.pairs.filter(a=>{const[o,s]=this.scene.project(a.x,.5,a.z);return o>t*e&&o<t*(1-e)&&s>n*(e+.06)&&s<n*(1-e-.04)})}linkedInView(){const e=this.inView();if(!e.length)return;const t=this.board.linkedPairs();return e.filter(n=>t.has(n.id)).length/e.length}rolling(e){return e.tiles.some(t=>this.scene.block(t).roll||this.scene.block(t).drop)}turnPair(e,t){if(this.rolling(e))return!1;const n=this.board.chooseTurn(e,t,this.linkedInView());if(!n)return!1;const a=e.entry,o=e.tiles[n.index];this.board.turn(e,n,t);const s=t+.12,r=this.scene.block(o).turn(o.stone,s,_s),l=e.entry,c=e.caption;e.caption={prev1:c.text1,prev2:c.text2,text1:l.word.toUpperCase(),text2:l.gloss,t0:s+_s*.62},this.notes.turn(e,n.index,a,s+_s*.32),this.ripples.push({x:o.x,z:o.z,t0:r-.1,dur:.95});const h=u=>this.scene.block(u).landsAt();return this.links.sync(this.board.desiredLinks(),t,{origin:o.id,holdUntil:u=>u.kind==="pair"?Math.max(h(u.a),h(u.b)):Math.max(...u.pair.tiles.map(h))}),!0}openNote(e,t){const n=this.notes.open(e,t);return this.meta.set(n,{nextTurn:t+1.15,turnsLeft:2}),n}closeNote(e,t){this.notes.close(e,t),this.carded.set(e.pair,t)}poke(e,t){if(!this.board.canTurn(e,t))return;if(!this.notes.has(e)){const a=this.notes.list.filter(o=>!o.closing);a.length>=this.capacity()&&this.closeNote(a[0],t),this.openNote(e,t)}const n=this.notes.list.find(a=>a.pair===e&&!a.closing);if(n){const a=this.meta.get(n);a.nextTurn=t+4.5,a.turnsLeft=Math.max(a.turnsLeft,1)}this.turnPair(e,t)}update(e){if(this.ripples.splice(0,this.ripples.length,...this.ripples.filter(a=>e-a.t0<a.dur)),this.paused)return;const t=this.inView(),n=new Set(this.inView(-.05));for(const a of this.notes.list){if(a.closing)continue;const o=this.meta.get(a);if(!n.has(a.pair)){this.closeNote(a,e);continue}e<o.nextTurn||(o.turnsLeft>0?this.turnPair(a.pair,e)?(o.turnsLeft--,o.nextTurn=e+(o.turnsLeft>0?4.2+Math.random()*1.6:3.4)):(o.nextTurn=e+.6,this.rolling(a.pair)||(o.turnsLeft=0)):this.closeNote(a,e))}if(e>=this.nextNoteCheck){this.nextNoteCheck=e+.45;const a=this.notes.list.filter(o=>!o.closing);if(a.length<this.capacity()){const o=this.pickForNote(t,a,e);o&&(this.openNote(o,e),this.nextNoteCheck=e+.9+Math.random()*.8)}}if(e>=this.nextBackground){const a=this.notes.noted(),o=t.filter(s=>!a.has(s)&&!this.rolling(s)&&e-s.turnedAt>6&&this.board.canTurn(s,e)&&!this.recalls(s,e));o.length&&this.turnPair(o[Math.floor(Math.random()*o.length)],e),this.nextBackground=e+(1.5+Math.random()*1.1)*Math.max(1,t_/Math.max(1,t.length))}}recalls(e,t){const n=this.carded.get(e);return n==null||t-n>e_||e.turnedAt>n?!1:this.board.targets(e,t).every(a=>a.tier===2)}pickForNote(e,t,n){const a=new Set(this.inView(Qv)),o=t.map(l=>this.scene.project(l.pair.x,1,l.pair.z));let s=null,r=-1/0;for(const l of e){if(!a.has(l)||this.notes.has(l)||this.rolling(l))continue;const c=n-(this.carded.get(l)??-1/0);if(c<cc.wait)continue;const[h,u]=this.scene.project(l.x,1,l.z);let f=1/0;for(const[g,v]of o)f=Math.min(f,Math.hypot(g-h,v-u));let p=Math.min(f,420)+Math.random()*160-(n-l.turnedAt<4?300:0);c<cc.rest&&(p-=600),this.board.canTurnTwice(l,n)||(p-=1e3),this.board.targets(l,n).some(g=>g.tier===0)||(p-=1e3),p>r&&(s=l,r=p)}return s}}const hc={x:6,z:4},Ka={x:(Ct.x0+Ct.x1)/2,z:(Ct.z0+Ct.z1)/2},Ui={x:Math.max(0,(Ct.x1-Ct.x0)/2-hc.x),z:Math.max(0,(Ct.z1-Ct.z0)/2-hc.z)},mo={x:Math.min(1,Ui.x/3.9),z:Math.min(1,Ui.z/1.8)},uc={x:Ui.x+3.9*mo.x,z:Ui.z+1.8*mo.z},go=(i,e,t)=>Math.max(e-t,Math.min(e+t,i));function i_(i,e,t,n,a={dx:0,dz:0,zoom:1}){const o=Math.max(34,Math.min(60,Math.min(t,n)/17)),s=(r,l=0)=>Math.sin(e/r*Math.PI*2+l);return i.ppu=o*a.zoom*(1+.035*s(53)),i.tx=go(Ka.x+mo.x*(2.5*s(97)+1.4*s(41))+a.dx,Ka.x,Ui.x),i.tz=go(Ka.z+mo.z*1.8*s(83,1)+a.dz,Ka.z,Ui.z),i.yaw=(-3+5*s(120))*Math.PI/180,i.pitch=(55+2.5*s(71))*Math.PI/180,i}const dn=i=>document.getElementById(i),a_=Number(new URLSearchParams(location.search).get("slow"))||1,Za=()=>performance.now()/1e3/a_,o_=matchMedia("(prefers-reduced-motion: reduce)").matches;async function s_(){const i="Pōhaku ʻāina";await Promise.all([document.fonts.load(`400 16px ${to}`,i),document.fonts.load(`italic 400 16px ${to}`,i),document.fonts.load(`600 16px ${to}`,i)]).catch(()=>{});const e=new URLSearchParams(location.search),t=Number(e.get("seed"))||1031,n=new Su(t),a=new lv(dn("gl")),o=new Iv(dn("floor")),s=new Xv(dn("cards"),dn("hud")),r=new Lv,l=[],c={tx:0,tz:0,yaw:0,pitch:1,ppu:50},h={dx:0,dz:0,zoom:1},u=new n_({board:n,scene:a,links:r,notes:s,ripples:l});let f=[];function p(){const E=innerWidth,C=innerHeight,D=Math.min(devicePixelRatio||1,2);a.setSize(E,C,D),o.resize(E,C,D),s.resize(E,C,D),f=["title","legend","stats"].map(j=>{const F=dn(j).getBoundingClientRect();return{x:F.left-12,y:F.top-12,w:F.width+24,h:F.height+24}})}addEventListener("resize",p),p();const g=n.island.compass,v=()=>{let E=1/0,C=1/0,D=-1/0,j=-1/0;for(let F=0;F<16;F++){const z=F/16*Math.PI*2,[G,B]=a.project(g.x+Math.cos(z)*g.r,0,g.z+Math.sin(z)*g.r);E=Math.min(E,G),C=Math.min(C,B),D=Math.max(D,G),j=Math.max(j,B)}return{x:E,y:C,w:D-E,h:j-C}},m=E=>i_(c,o_?0:E-d,innerWidth,innerHeight,h),d=Za();m(d),a.setView(c);const M=d+xt.stones;for(const E of n.pairs){const C=Math.hypot(E.x-c.tx,E.z-c.tz),D=M+C*.035+Math.random()*.12;for(const F of E.tiles)a.addTile(F).dropIn(D+F.index*.06);const j=E.entry;E.caption={prev1:"",prev2:"",text1:j.word.toUpperCase(),text2:j.gloss,t0:D+1}}const _=E=>{const C=E.kind==="pair"?[E.a,E.b]:E.pair.tiles;return Math.max(...C.map(D=>a.block(D).drop.t0+a.block(D).drop.dur))+.1},w=[...n.desiredLinks()].sort(([,E],[,C])=>_(E)-_(C));r.sync(new Map(w),d,{holdUntil:_});const P=[...r.links.values()];u.start(M-.15);const k=dn("stage");let T=null;k.addEventListener("pointerdown",E=>{T={x:E.clientX,y:E.clientY,moved:0,id:E.pointerId},k.setPointerCapture(E.pointerId)}),k.addEventListener("pointermove",E=>{if(!T)return;const C=E.clientX-T.x,D=E.clientY-T.y;T.moved+=Math.abs(C)+Math.abs(D),T.x=E.clientX,T.y=E.clientY,T.moved>4&&k.classList.add("dragging");const[j,F,z,G]=a.floorAffine(),B=j*G-F*z;h.dx=go(h.dx-(G*C-z*D)/B,0,uc.x),h.dz=go(h.dz-(-F*C+j*D)/B,0,uc.z)});const S=E=>{if(T){if(T.moved<5){const C=a.pick(E.clientX,E.clientY);C&&u.poke(n.pairs[C.pair],Za())}T=null,k.classList.remove("dragging")}};k.addEventListener("pointerup",S),k.addEventListener("pointercancel",()=>{T=null,k.classList.remove("dragging")}),k.addEventListener("wheel",E=>{E.preventDefault(),h.zoom=Math.max(.6,Math.min(1.9,h.zoom*Math.exp(-E.deltaY*.0012)))},{passive:!1}),addEventListener("keydown",E=>{E.code==="Space"&&(E.preventDefault(),u.paused=!u.paused)});const x={turns:dn("st-turns"),links:dn("st-links"),pairs:dn("st-pairs")};x.pairs.textContent=String(n.pairs.length);let b=Za(),N=!1,L=!1;function V(){const E=Za(),C=Math.min(.1,E-b);b=E,m(E),a.setView(c),u.update(E),r.update(E),a.update(E),a.render(),o.draw({A:a.floorAffine(),board:n,links:r,ripples:l,now:E,intro:E-d,noted:s.noted()}),s.update(a,E,C,[...f,v()]),x.turns.textContent=String(n.turnCount).padStart(4,"0"),x.links.textContent=String(r.count()).padStart(2,"0"),N||(N=!0,document.body.classList.add("ready")),!L&&P.every(D=>D.p>=1||D.to===0)&&s.list.some(D=>D.el.classList.contains("open"))&&(L=!0,document.body.classList.add("opened")),requestAnimationFrame(V)}requestAnimationFrame(V)}s_();
