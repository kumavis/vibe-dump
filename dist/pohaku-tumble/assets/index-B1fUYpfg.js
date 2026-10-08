(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function t(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(i){if(i.ep)return;i.ep=!0;const o=t(i);fetch(i.href,o)}})();const $h=[{w:"aholoa",a:"aho#1",b:"loa",g:"patient; long-suffering",f:"naʻau",ev:"keep",nodeal:!1},{w:"ahonui",a:"aho#1",b:"nui",g:"patience; patient endurance",f:"naʻau",ev:"keep",nodeal:!1},{w:"ahupuaʻa",a:"ahu",b:"puaʻa",g:"land division, mountains to sea",f:"ʻāina",ev:"keep",nodeal:!1},{w:"akeakamai",a:"ake",b:"akamai",g:"seeker of knowledge; philosopher",f:"naʻau",ev:"keep",nodeal:!0},{w:"akeloa",a:"ake",b:"loa",g:"spleen",f:"kanaka",ev:"keep",nodeal:!1},{w:"akemāmā",a:"ake",b:"māmā",g:"lungs",f:"kanaka",ev:"keep",nodeal:!1},{w:"alahaka",a:"ala#0",b:"haka#0",g:"ladder; rough path over chasms",f:"hele",ev:"keep",nodeal:!1},{w:"alahao",a:"ala#0",b:"hao#0",g:"railroad, railway",f:"hele",ev:"keep",nodeal:!0},{w:"alakaʻi",a:"ala#0",b:"kaʻi",g:"to lead, guide; leader",f:"hele",ev:"keep",nodeal:!1},{w:"alaloa",a:"ala#0",b:"loa",g:"highway; main road around island",f:"hele",ev:"keep",nodeal:!1},{w:"alanui",a:"ala#0",b:"nui",g:"road, street, highway",f:"hele",ev:"keep",nodeal:!1},{w:"alapiʻi",a:"ala#0",b:"piʻi#0",g:"stairs, ladder, ascent",f:"hele",ev:"keep",nodeal:!1},{w:"alawai",a:"ala#0",b:"wai#0",g:"channel; canal",f:"hele",ev:"keep",nodeal:!1},{w:"alaula",a:"ala#0",b:"ʻula?alaʻula",g:"dawn light; sunset glow",f:"lani",ev:"keep",nodeal:!1},{w:"aliʻi wahine",a:"aliʻi",b:"wahine",g:"woman chief; princess or queen",f:"kanaka",ev:"keep",nodeal:!1},{w:"anamanaʻo",a:"ana#1",b:"manaʻo",g:"survey, poll",f:"naʻau",ev:"keep",nodeal:!0},{w:"anapuni",a:"ana#1",b:"puni#0",g:"circumference, perimeter",f:"hele",ev:"keep",nodeal:!0},{w:"anawaena",a:"ana#1",b:"waena",g:"diameter",f:"hele",ev:"keep",nodeal:!0},{w:"ana ʻāina",a:"ana#1",b:"ʻāina",g:"land surveying; to survey land",f:"ʻāina",ev:"keep",nodeal:!1},{w:"aouli",a:"ao#2",b:"uli#0",g:"firmament, the blue sky",f:"lani",ev:"keep",nodeal:!1},{w:"aumiki",a:"au",b:"miki#0",g:"outgoing current; rip current",f:"kai",ev:"keep",nodeal:!1},{w:"aumoe",a:"au?aumoe",b:"moe",g:"midnight, late night",f:"hele",ev:"keep",nodeal:!1},{w:"ʻau waʻa",a:"ʻau#group",b:"waʻa",g:"fleet of canoes",f:"hana",ev:"keep",nodeal:!1},{w:"aʻa koko",a:"aʻa#0",b:"koko",g:"blood vessel, vein",f:"kanaka",ev:"pending",nodeal:!1},{w:"aʻalele",a:"aʻa#0",b:"lele",g:"pulse (lit., leaping vein)",f:"kanaka",ev:"keep",nodeal:!1},{w:"aʻalolo",a:"aʻa#0",b:"lolo",g:"nerve",f:"kanaka",ev:"keep",nodeal:!1},{w:"haipule",a:"hai#0",b:"pule#0",g:"devout, religious; to worship",f:"naʻau",ev:"keep",nodeal:!1},{w:"hakakau",a:"haka#0",b:"kau#1",g:"to straddle; on slender footing",f:"hana",ev:"keep",nodeal:!1},{w:"hākā moa",a:"haka?hakamoa",b:"moa",g:"cockfight; a lua style using no hands",f:"kanaka",ev:"keep",nodeal:!1},{w:"haku hale",a:"haku#0",b:"hale",g:"master or owner of a house",f:"kanaka",ev:"keep",nodeal:!1},{w:"haku mele",a:"haku#2",b:"mele#0",g:"to compose songs; a composer",f:"naʻau",ev:"keep",nodeal:!1},{w:"haku wahine",a:"haku#0",b:"wahine",g:"female head; wife of a chief",f:"kanaka",ev:"keep",nodeal:!1},{w:"hakuʻāina",a:"haku#0",b:"ʻāina",g:"landowner; one who manages land",f:"kanaka",ev:"keep",nodeal:!1},{w:"haku ʻōlelo",a:"haku#2",b:"ʻōlelo",g:"one who composes words; a writer",f:"naʻau",ev:"keep",nodeal:!1},{w:"hale aliʻi",a:"hale",b:"aliʻi",g:"house of a chief; palace",f:"hana",ev:"keep",nodeal:!1},{w:"hale kaua",a:"hale",b:"kaua",g:"fort; fortification",f:"hana",ev:"keep",nodeal:!0},{w:"hale kaʻa",a:"hale",b:"kaʻa#0",g:"carriage house; garage",f:"hana",ev:"keep",nodeal:!0},{w:"hale kia",a:"hale",b:"kia#0",g:"pillared porch; veranda",f:"hana",ev:"keep",nodeal:!1},{w:"hale lana",a:"hale",b:"lana#0",g:"floating house, houseboat; the Ark",f:"hana",ev:"keep",nodeal:!0},{w:"halelewa",a:"hale",b:"lewa",g:"portable house; tent",f:"hana",ev:"keep",nodeal:!1},{w:"hale lole",a:"hale",b:"lole",g:"tent",f:"hana",ev:"keep",nodeal:!0},{w:"hale lāʻau",a:"hale",b:"lāʻau",g:"wooden house, not thatched",f:"hana",ev:"keep",nodeal:!0},{w:"hale malu",a:"hale",b:"malu",g:"shaded house; shed",f:"hana",ev:"keep",nodeal:!1},{w:"hale moe",a:"hale",b:"moe",g:"sleeping house",f:"hana",ev:"keep",nodeal:!1},{w:"hale mākaʻi",a:"hale",b:"mākaʻi",g:"police station",f:"hana",ev:"keep",nodeal:!1},{w:"hale piʻo",a:"hale",b:"piʻo",g:"house framed with bent poles",f:"hana",ev:"keep",nodeal:!1},{w:"hale pule",a:"hale",b:"pule#0",g:"church; house of worship",f:"hana",ev:"keep",nodeal:!1},{w:"hamoʻula",a:"hamo",b:"ʻula#0",g:"red-stained tapa; red dye",f:"hana",ev:"keep",nodeal:!1},{w:"hana mana",a:"hana#0",b:"mana#0",g:"miracle; a work of the gods",f:"naʻau",ev:"keep",nodeal:!1},{w:"hanu paʻa",a:"hanu",b:"paʻa",g:"a head cold; catarrh",f:"kanaka",ev:"keep",nodeal:!0},{w:"hao waha",a:"hao#0",b:"waha#0",g:"bridle bit",f:"hana",ev:"keep",nodeal:!0},{w:"haupia",a:"hau#0",b:"pia#0",g:"pudding of coconut cream and starch",f:"ulu",ev:"keep",nodeal:!1},{w:"hauʻeli",a:"hau#0",b:"ʻeli",g:"a salt dug from cave rocks",f:"ʻāina",ev:"keep",nodeal:!1},{w:"hauʻoli",a:"hau#mood",b:"ʻoli",g:"happy, glad; joy",f:"naʻau",ev:"keep",nodeal:!1},{w:"helekū",a:"hele",b:"kū#0",g:"to walk upright",f:"hele",ev:"keep",nodeal:!1},{w:"heʻe nalu",a:"heʻe#1",b:"nalu#0",g:"surfing; to ride a surfboard",f:"kai",ev:"keep",nodeal:!1},{w:"hikilele",a:"hiki?hikilele",b:"lele",g:"startled; to jump with fright",f:"naʻau",ev:"keep",nodeal:!1},{w:"hikimoe",a:"hiki",b:"moe",g:"the west, where sun sets (poetic)",f:"lani",ev:"keep",nodeal:!1},{w:"hiʻilani",a:"hiʻi",b:"lani",g:"to exalt, praise, admire",f:"naʻau",ev:"keep",nodeal:!1},{w:"hiʻipoi",a:"hiʻi",b:"poi?hiʻipoi",g:"to tend and cherish",f:"kanaka",ev:"keep",nodeal:!1},{w:"hoaaloha",a:"hoa#0",b:"aloha",g:"friend",f:"kanaka",ev:"pending",nodeal:!1},{w:"hoa hana",a:"hoa#0",b:"hana#0",g:"fellow worker; helper",f:"hana",ev:"keep",nodeal:!1},{w:"hoa hanauna",a:"hoa#0",b:"hanauna",g:"a relative of the same generation",f:"kanaka",ev:"keep",nodeal:!1},{w:"hoa hele",a:"hoa#0",b:"hele",g:"fellow traveler",f:"hele",ev:"keep",nodeal:!1},{w:"hoahānau",a:"hoa#0",b:"hānau",g:"cousin; kin of the same generation",f:"kanaka",ev:"keep",nodeal:!1},{w:"hoa kaua",a:"hoa#0",b:"kaua",g:"fellow soldier; adversary in war",f:"kanaka",ev:"keep",nodeal:!0},{w:"hoakoa",a:"hoa#0",b:"koa#1",g:"fellow soldier",f:"kanaka",ev:"keep",nodeal:!0},{w:"hoalawaiʻa",a:"hoa#0",b:"lawaiʻa",g:"fellow fisherman",f:"kai",ev:"pending",nodeal:!1},{w:"hoa paio",a:"hoa#0",b:"paio",g:"opponent, adversary",f:"kanaka",ev:"keep",nodeal:!1},{w:"hoa ʻai",a:"hoa#0",b:"ʻai",g:"table companion; guest at a meal",f:"ulu",ev:"keep",nodeal:!1},{w:"hoaʻāina",a:"hoa#0",b:"ʻāina",g:"native tenant; tiller of the land",f:"ʻāina",ev:"keep",nodeal:!1},{w:"hoa ʻōlelo",a:"hoa#0",b:"ʻōlelo",g:"conversation partner; counselor",f:"naʻau",ev:"keep",nodeal:!1},{w:"hoe uli",a:"hoe",b:"uli#1",g:"steering paddle",f:"hana",ev:"keep",nodeal:!1},{w:"hoe waʻa",a:"hoe",b:"waʻa",g:"to paddle a canoe; paddler",f:"hana",ev:"keep",nodeal:!1},{w:"holokai",a:"holo#0",b:"kai",g:"seafarer; seafaring",f:"kai",ev:"keep",nodeal:!1},{w:"holo lio",a:"holo#0",b:"lio",g:"horseback riding; horse rider",f:"hele",ev:"keep",nodeal:!0},{w:"holomoku",a:"holo#0",b:"moku",g:"sailor; to sail on a ship",f:"hele",ev:"keep",nodeal:!1},{w:"holowaʻa",a:"holo?holowaʻa",b:"waʻa",g:"trough; chest; oblong box",f:"hana",ev:"keep",nodeal:!1},{w:"holo ʻai",a:"holo#bundle",b:"ʻai",g:"bundle of baked food",f:"ulu",ev:"keep",nodeal:!1},{w:"hope poʻo",a:"hope",b:"poʻo",g:"deputy or associate head",f:"kanaka",ev:"keep",nodeal:!1},{w:"hoʻi hope",a:"hoʻi",b:"hope",g:"to turn back, retreat",f:"hele",ev:"keep",nodeal:!1},{w:"hua liʻi",a:"hua",b:"liʻi#0",g:"small fruit left after harvest",f:"ulu",ev:"keep",nodeal:!1},{w:"hua mele",a:"hua#word",b:"mele#0",g:"musical note",f:"naʻau",ev:"keep",nodeal:!0},{w:"hua moa",a:"hua",b:"moa",g:"hen egg",f:"ulu",ev:"keep",nodeal:!1},{w:"hua ʻai",a:"hua",b:"ʻai",g:"fruit, edible fruit",f:"ulu",ev:"keep",nodeal:!1},{w:"huaʻōlelo",a:"hua#word",b:"ʻōlelo",g:"word",f:"naʻau",ev:"keep",nodeal:!1},{w:"hue wai",a:"hue",b:"wai#0",g:"water gourd",f:"hana",ev:"keep",nodeal:!1},{w:"hue ʻili",a:"hue",b:"ʻili",g:"skin bottle",f:"hana",ev:"keep",nodeal:!0},{w:"huikala",a:"hui",b:"kala#2",g:"forgiveness; to purify",f:"naʻau",ev:"keep",nodeal:!1},{w:"huki wai",a:"huki",b:"wai#0",g:"to draw water",f:"hana",ev:"keep",nodeal:!1},{w:"huli lua",a:"huli#0",b:"lua#0",g:"turning two ways; shifting",f:"hele",ev:"keep",nodeal:!1},{w:"huluʻiʻiwi",a:"hulu#0",b:"ʻiʻiwi",g:"ʻiʻiwi feathers, for cloaks",f:"hana",ev:"keep",nodeal:!1},{w:"hunakai",a:"huna#0",b:"kai",g:"the sanderling; beach morning glory",f:"kai",ev:"keep",nodeal:!1},{w:"huna kaua",a:"huna#0",b:"kaua",g:"a unit of a war host; one fighter",f:"kanaka",ev:"keep",nodeal:!0},{w:"huna wai",a:"huna#0",b:"wai#0",g:"drop of water; spray, mist",f:"ʻāina",ev:"keep",nodeal:!1},{w:"hāipu",a:"hā#2",b:"ipu",g:"gourd leaf stalk, used medicinally",f:"ulu",ev:"pending",nodeal:!1},{w:"hākō",a:"hā#2",b:"kō#0",g:"to carve a path, as through coral",f:"ulu",ev:"keep",nodeal:!1},{w:"haliʻi kuli",a:"hāliʻi",b:"kuli#1",g:"to spread the knees; (hence) stingy",f:"naʻau",ev:"keep",nodeal:!1},{w:"hānau kahi",a:"hānau",b:"kahi#0",g:"an only child",f:"kanaka",ev:"keep",nodeal:!1},{w:"hānau mua",a:"hānau",b:"mua",g:"first-born child",f:"kanaka",ev:"keep",nodeal:!1},{w:"hā niu",a:"hā#2",b:"niu#0",g:"butt end of a coconut frond",f:"ulu",ev:"keep",nodeal:!1},{w:"hōkūao",a:"hōkū",b:"ao#0",g:"Venus as the morning star",f:"lani",ev:"keep",nodeal:!1},{w:"hōkū hele",a:"hōkū",b:"hele",g:"planet",f:"lani",ev:"keep",nodeal:!1},{w:"hōkū lele",a:"hōkū",b:"lele",g:"meteor; shooting star",f:"lani",ev:"keep",nodeal:!1},{w:"hōkūloa",a:"hōkū",b:"loa",g:"Venus; the morning star",f:"lani",ev:"keep",nodeal:!1},{w:"hōkūnaʻi",a:"hōkū",b:"naʻi#0",g:"asteroid",f:"lani",ev:"keep",nodeal:!0},{w:"hōkū ʻaeʻa",a:"hōkū",b:"ʻaeʻa",g:"planet",f:"lani",ev:"keep",nodeal:!1},{w:"hūkai",a:"hū#0",b:"kai",g:"brackish; tasteless",f:"kai",ev:"keep",nodeal:!1},{w:"hūlani",a:"hū#0",b:"lani",g:"to praise highly, exalt",f:"naʻau",ev:"keep",nodeal:!1},{w:"hūpuna",a:"hū#0",b:"puna#0",g:"pool of overflowing spring water",f:"ʻāina",ev:"keep",nodeal:!1},{w:"iwikū",a:"iwi",b:"kū#0",g:"a bone of the lower leg",f:"kanaka",ev:"keep",nodeal:!1},{w:"iwi pona",a:"iwi",b:"pona",g:"bone socket, as the eye socket",f:"kanaka",ev:"keep",nodeal:!0},{w:"kahakai",a:"kaha#1",b:"kai",g:"seashore, beach",f:"kai",ev:"keep",nodeal:!1},{w:"kahaone",a:"kaha#1",b:"one",g:"sandy beach",f:"kai",ev:"keep",nodeal:!1},{w:"kahapili",a:"kaha#0",b:"pili",g:"tangent to a circle",f:"hele",ev:"keep",nodeal:!0},{w:"kahapōʻai",a:"kaha#0",b:"pōʻai",g:"circumference of a circle",f:"hele",ev:"keep",nodeal:!0},{w:"kahawai",a:"kaha?kahawai",b:"wai#0",g:"stream, creek; ravine, gulch",f:"ʻāina",ev:"keep",nodeal:!1},{w:"kahua hale",a:"kahua",b:"hale",g:"house foundation; house site",f:"hana",ev:"keep",nodeal:!1},{w:"kahu ahi",a:"kahu#0",b:"ahi",g:"fire tender; to tend a fire",f:"hana",ev:"keep",nodeal:!1},{w:"kahu akua",a:"kahu#0",b:"akua",g:"keeper of a god; priest",f:"naʻau",ev:"keep",nodeal:!1},{w:"kahu puaʻa",a:"kahu#0",b:"puaʻa",g:"swineherd",f:"hana",ev:"keep",nodeal:!1},{w:"kahu wai",a:"kahu#0",b:"wai#0",g:"overseer of water distribution",f:"ʻāina",ev:"keep",nodeal:!1},{w:"kahu ʻāina",a:"kahu#0",b:"ʻāina",g:"steward of the land",f:"ʻāina",ev:"keep",nodeal:!1},{w:"kai au",a:"kai",b:"au",g:"sea where a current is visible",f:"kai",ev:"keep",nodeal:!1},{w:"kai ea",a:"kai",b:"ea",g:"rising tide, washing high on land",f:"kai",ev:"keep",nodeal:!1},{w:"kai eʻe",a:"kai",b:"eʻe",g:"tsunami; tidal wave",f:"kai",ev:"keep",nodeal:!1},{w:"kai malolo",a:"kai",b:"malolo",g:"low tide; a calm, quiet sea",f:"kai",ev:"keep",nodeal:!1},{w:"kai piʻi",a:"kai",b:"piʻi#0",g:"high or rising tide",f:"kai",ev:"keep",nodeal:!1},{w:"kai uli",a:"kai",b:"uli#0",g:"the deep blue sea",f:"kai",ev:"keep",nodeal:!1},{w:"kaiʻau",a:"kai",b:"ʻau#1",g:"sea too deep to stand in",f:"kai",ev:"keep",nodeal:!1},{w:"kākāʻōlelo",a:"kaka?kakaʻōlelo",b:"ʻōlelo",g:"orator; counselor to a chief",f:"naʻau",ev:"keep",nodeal:!1},{w:"kalahala",a:"kala#2",b:"hala#0",g:"to pardon wrongdoing",f:"naʻau",ev:"keep",nodeal:!1},{w:"kala hale",a:"kala#gable",b:"hale",g:"gable end of a house",f:"hana",ev:"keep",nodeal:!1},{w:"kanaka makua",a:"kanaka",b:"makua",g:"adult, grown person",f:"kanaka",ev:"keep",nodeal:!1},{w:"kanikau",a:"kani",b:"kau#2",g:"dirge; lament for the dead",f:"naʻau",ev:"keep",nodeal:!0},{w:"kaniwāwae",a:"kani",b:"wāwae",g:"foot soldier; infantry",f:"kanaka",ev:"keep",nodeal:!0},{w:"kapakahi",a:"kapa",b:"kahi#0",g:"crooked, lopsided; one-sided",f:"hele",ev:"keep",nodeal:!1},{w:"kapa komo",a:"kapa",b:"komo",g:"garment, clothing; a dress",f:"hana",ev:"keep",nodeal:!1},{w:"kaukahi",a:"kau?kaukahi",b:"kahi#0",g:"single canoe; standing alone",f:"hana",ev:"keep",nodeal:!1},{w:"kau kānāwai",a:"kau#1",b:"kānāwai",g:"to make laws; lawmaker",f:"naʻau",ev:"keep",nodeal:!1},{w:"kaula hao",a:"kaula",b:"hao#0",g:"chain",f:"hana",ev:"keep",nodeal:!0},{w:"kaula lei",a:"kaula",b:"lei",g:"cord for stringing a lei",f:"hana",ev:"keep",nodeal:!1},{w:"kaula waha",a:"kaula",b:"waha#0",g:"bridle; to rein in",f:"hana",ev:"keep",nodeal:!0},{w:"kaulike",a:"kau#1",b:"like",g:"fair, just; evenly balanced",f:"naʻau",ev:"keep",nodeal:!1},{w:"kaulua",a:"kau?kaulua",b:"lua#0",g:"double canoe; a pair",f:"hana",ev:"keep",nodeal:!1},{w:"kaupale",a:"kau?kaupale",b:"pale?kaupale",g:"partition; dividing barrier",f:"hana",ev:"keep",nodeal:!1},{w:"kaʻa hale",a:"kaʻa#0",b:"hale",g:"trailer; house on wheels",f:"hana",ev:"keep",nodeal:!0},{w:"kaʻahele",a:"kaʻa#0",b:"hele",g:"to travel about, tour",f:"hele",ev:"keep",nodeal:!1},{w:"kaʻa kaua",a:"kaʻa#0",b:"kaua",g:"to maneuver forces in war",f:"hele",ev:"keep",nodeal:!0},{w:"kaʻalalo",a:"kaʻa#0",b:"lalo",g:"to sail off the wind, leeward",f:"hele",ev:"keep",nodeal:!1},{w:"kaʻaluna",a:"kaʻa#0",b:"luna?kaʻaluna",g:"to sail against the wind",f:"hele",ev:"keep",nodeal:!1},{w:"kaʻapuni",a:"kaʻa#0",b:"puni#0",g:"to go around; to tour",f:"hele",ev:"keep",nodeal:!1},{w:"keiki kāne",a:"keiki",b:"kāne",g:"boy; son",f:"kanaka",ev:"keep",nodeal:!1},{w:"keiki papa",a:"keiki",b:"papa#0",g:"native-born on ancestral land",f:"kanaka",ev:"keep",nodeal:!1},{w:"kia ahi",a:"kia#0",b:"ahi",g:"pillar of fire",f:"lani",ev:"keep",nodeal:!0},{w:"kia ao",a:"kia#0",b:"ao#2",g:"pillar of cloud",f:"lani",ev:"keep",nodeal:!0},{w:"kiakahi",a:"kia#0",b:"kahi#0",g:"steadfast, of one purpose",f:"naʻau",ev:"keep",nodeal:!1},{w:"kia kolu",a:"kia#0",b:"kolu",g:"three-masted ship",f:"hana",ev:"keep",nodeal:!0},{w:"kia lua",a:"kia#0",b:"lua#0",g:"two-masted vessel; brig, schooner",f:"hana",ev:"keep",nodeal:!0},{w:"kiaʻipoʻo",a:"kiaʻi",b:"poʻo",g:"bodyguard of a king",f:"kanaka",ev:"keep",nodeal:!1},{w:"kiaʻi puka",a:"kiaʻi",b:"puka",g:"gatekeeper, porter",f:"kanaka",ev:"keep",nodeal:!1},{w:"kiaʻi pō",a:"kiaʻi",b:"pō",g:"night watch",f:"hele",ev:"keep",nodeal:!1},{w:"kiaʻāina",a:"kia#0",b:"ʻāina",g:"governor; ruler of an island",f:"kanaka",ev:"keep",nodeal:!1},{w:"kiko kahi",a:"kiko",b:"kahi#0",g:"period (punctuation mark)",f:"naʻau",ev:"keep",nodeal:!0},{w:"kikolā",a:"kiko",b:"lā#1",g:"timekeeper (lit., day marker)",f:"hele",ev:"keep",nodeal:!1},{w:"kiko moe",a:"kiko",b:"moe",g:"hyphen",f:"naʻau",ev:"keep",nodeal:!0},{w:"kiko nīnau",a:"kiko",b:"nīnau",g:"question mark",f:"naʻau",ev:"keep",nodeal:!0},{w:"kikowaena",a:"kiko",b:"waena",g:"center; center of a circle",f:"hele",ev:"keep",nodeal:!1},{w:"kilo heʻe",a:"kilo",b:"heʻe#0",g:"searching the sea for octopus",f:"kai",ev:"keep",nodeal:!1},{w:"kinoea",a:"kino",b:"ea",g:"gas (state of matter)",f:"lani",ev:"keep",nodeal:!0},{w:"kinopaʻa",a:"kino",b:"paʻa",g:"solid (state of matter)",f:"ʻāina",ev:"keep",nodeal:!0},{w:"kinowai",a:"kino",b:"wai#0",g:"liquid (state of matter)",f:"ʻāina",ev:"keep",nodeal:!0},{w:"kino wailua",a:"kino",b:"wailua",g:"spirit or ghost of the dead",f:"naʻau",ev:"keep",nodeal:!0},{w:"kipikua",a:"kipi#0",b:"kua#1",g:"pickaxe",f:"hana",ev:"keep",nodeal:!0},{w:"kiʻi palapala",a:"kiʻi#0",b:"palapala",g:"printed picture, as in a newspaper",f:"hana",ev:"keep",nodeal:!0},{w:"kiʻi pōhaku",a:"kiʻi#0",b:"pōhaku",g:"petroglyph; stone image",f:"hana",ev:"keep",nodeal:!1},{w:"koʻi kahi",a:"koʻi",b:"kahi#1",g:"wood plane",f:"hana",ev:"keep",nodeal:!0},{w:"koʻi lipi",a:"koʻi",b:"lipi",g:"axe",f:"hana",ev:"keep",nodeal:!1},{w:"komo hale",a:"komo",b:"hale",g:"house-warming; dedicating a new house",f:"hana",ev:"keep",nodeal:!1},{w:"komo ʻāina",a:"komo",b:"ʻāina",g:"to enter upon inherited land",f:"ʻāina",ev:"keep",nodeal:!1},{w:"kua hao",a:"kua?kuahao",b:"hao#0",g:"anvil",f:"hana",ev:"keep",nodeal:!1},{w:"kuamauna",a:"kua#0",b:"mauna",g:"mountaintop zone",f:"ʻāina",ev:"keep",nodeal:!1},{w:"kuamoʻo",a:"kua#0",b:"moʻo",g:"backbone; path; way, custom",f:"kanaka",ev:"keep",nodeal:!1},{w:"kuapapa",a:"kua#1",b:"papa#0",g:"peace; quiet, untroubled",f:"naʻau",ev:"keep",nodeal:!1},{w:"kuapaʻa",a:"kua#0",b:"paʻa",g:"the chiton, a hard-backed mollusk",f:"kai",ev:"keep",nodeal:!1},{w:"kuapuʻu",a:"kua#0",b:"puʻu",g:"hump, as of a camel",f:"kanaka",ev:"keep",nodeal:!0},{w:"kuaʻāina",a:"kua#0",b:"ʻāina",g:"countryside, back country",f:"ʻāina",ev:"keep",nodeal:!1},{w:"kuenehale",a:"kuene",b:"hale",g:"house framer; house-building craft",f:"hana",ev:"keep",nodeal:!1},{w:"kuhi hewa",a:"kuhi#1",b:"hewa",g:"to mistake, misjudge",f:"naʻau",ev:"keep",nodeal:!1},{w:"kuʻi lua",a:"kui?kuilua",b:"lua#0",g:"to double by adding on",f:"hele",ev:"keep",nodeal:!1},{w:"kuli hiamoe",a:"kuli#0",b:"hiamoe",g:"to doze, too drowsy to hear",f:"kanaka",ev:"keep",nodeal:!1},{w:"kumukānāwai",a:"kumu",b:"kānāwai",g:"constitution",f:"naʻau",ev:"keep",nodeal:!0},{w:"kumulau",a:"kumu",b:"lau#0",g:"sprouting stump; prolific source",f:"ulu",ev:"keep",nodeal:!1},{w:"kumulāʻau",a:"kumu",b:"lāʻau",g:"tree",f:"ulu",ev:"keep",nodeal:!1},{w:"kumupaʻa",a:"kumu",b:"paʻa",g:"firm foundation",f:"naʻau",ev:"keep",nodeal:!1},{w:"kumu wai",a:"kumu",b:"wai#0",g:"spring; head of a stream",f:"ʻāina",ev:"keep",nodeal:!1},{w:"kupuna wahine",a:"kupuna",b:"wahine",g:"grandmother",f:"kanaka",ev:"keep",nodeal:!1},{w:"kuʻi hao",a:"kuʻi#0",b:"hao#0",g:"blacksmith; to forge iron",f:"hana",ev:"keep",nodeal:!0},{w:"kuʻikahi",a:"kuʻi#1",b:"kahi#0",g:"treaty; peace, union",f:"naʻau",ev:"keep",nodeal:!1},{w:"kuʻi ʻai",a:"kuʻi#0",b:"ʻai",g:"pounding poi; poi pounder",f:"ulu",ev:"keep",nodeal:!1},{w:"kālai pōhaku",a:"kālai",b:"pōhaku",g:"stone carving; stone carver",f:"hana",ev:"keep",nodeal:!1},{w:"kālaiʻāina",a:"kālai",b:"ʻāina",g:"politics; affairs of the land",f:"kanaka",ev:"keep",nodeal:!0},{w:"kālāʻau",a:"kā#0",b:"lāʻau",g:"stick dance; striking sticks together",f:"naʻau",ev:"pending",nodeal:!1},{w:"kāmaʻa loa",a:"kāmaʻa",b:"loa",g:"runners of a hōlua sled",f:"hana",ev:"keep",nodeal:!1},{w:"kāne make",a:"kāne",b:"make",g:"widowed (of a wife)",f:"kanaka",ev:"keep",nodeal:!0},{w:"kāwili manu",a:"kāwili",b:"manu",g:"to snare birds; bird snarer",f:"hana",ev:"keep",nodeal:!1},{w:"kē ʻai",a:"kē",b:"ʻai",g:"to fast",f:"naʻau",ev:"keep",nodeal:!1},{w:"kōhi ʻai",a:"kōhi#0",b:"ʻai",g:"to pick taro from the stalk",f:"ulu",ev:"keep",nodeal:!1},{w:"kō kea",a:"kō#0",b:"kea",g:"a white sugar cane",f:"ulu",ev:"keep",nodeal:!1},{w:"kōpaʻa",a:"kō#0",b:"paʻa",g:"sugar",f:"ulu",ev:"keep",nodeal:!0},{w:"kōʻula",a:"kō#0",b:"ʻula#0",g:"a reddish sugar cane",f:"ulu",ev:"keep",nodeal:!1},{w:"kūemi",a:"kū#0",b:"emi",g:"to retreat, as from something feared",f:"hele",ev:"pending",nodeal:!1},{w:"kūhewa",a:"kū?kūhewa",b:"hewa",g:"sudden; striking without warning",f:"hele",ev:"keep",nodeal:!1},{w:"kūkaha",a:"kū#0",b:"kaha?kūkaha",g:"to stand sideways, making room",f:"hele",ev:"keep",nodeal:!1},{w:"kūkala",a:"kū#0",b:"kala#1",g:"to proclaim publicly, announce",f:"naʻau",ev:"keep",nodeal:!1},{w:"kūkia",a:"kū#0",b:"kia#0",g:"to stand firm, steady in purpose",f:"naʻau",ev:"keep",nodeal:!1},{w:"kūkulu hema",a:"kūkulu#0",b:"hema",g:"the south; the south point",f:"lani",ev:"keep",nodeal:!1},{w:"kūkulu papa",a:"kūkulu#0",b:"papa#0",g:"to arrange in ranks; classify",f:"hana",ev:"keep",nodeal:!1},{w:"kūlehu",a:"kū#0",b:"lehu",g:"to roast in hot ashes",f:"ulu",ev:"keep",nodeal:!1},{w:"kūloko",a:"kū?kūloko",b:"loko",g:"internal, domestic; of home affairs",f:"kanaka",ev:"keep",nodeal:!1},{w:"kūlou poʻo",a:"kūlou",b:"poʻo",g:"to dive in head first",f:"hele",ev:"keep",nodeal:!1},{w:"kūlālā",a:"kū#0",b:"lālā",g:"plant grown from a cutting",f:"ulu",ev:"keep",nodeal:!1},{w:"kūmaka",a:"kū?kūmaka",b:"maka#0",g:"known by sight; in plain view",f:"naʻau",ev:"keep",nodeal:!1},{w:"kūnihi",a:"kū#0",b:"nihi",g:"set on edge; standing sideways",f:"hele",ev:"keep",nodeal:!1},{w:"kūnānā",a:"kū#0",b:"nānā#1",g:"puzzled, stumped, undecided",f:"naʻau",ev:"keep",nodeal:!1},{w:"kūola",a:"kū#0",b:"ola",g:"to come through danger unharmed",f:"kanaka",ev:"keep",nodeal:!1},{w:"kūpaʻa",a:"kū#0",b:"paʻa",g:"steadfast, unshaken in purpose",f:"naʻau",ev:"keep",nodeal:!1},{w:"kūpono",a:"kū#0",b:"pono",g:"upright, honest; proper, suitable",f:"naʻau",ev:"keep",nodeal:!1},{w:"kūpuni",a:"kū#0",b:"puni#0",g:"to stand around, surround",f:"hele",ev:"keep",nodeal:!1},{w:"kūʻai",a:"kū#0",b:"ʻai",g:"to barter, trade; buy or sell",f:"hana",ev:"keep",nodeal:!1},{w:"kūʻau",a:"kū?kūʻau",b:"ʻau#0",g:"handle; tapa-beating mallet",f:"hana",ev:"keep",nodeal:!1},{w:"kūʻauhau",a:"kū?kūʻauhau",b:"ʻauhau",g:"genealogy; genealogist",f:"kanaka",ev:"keep",nodeal:!1},{w:"kūʻē",a:"kū#0",b:"ʻē#1",g:"to oppose, resist, protest",f:"naʻau",ev:"keep",nodeal:!1},{w:"lae lua",a:"lae#0",b:"lua#0",g:"projecting, prominent, as a ridge",f:"ʻāina",ev:"keep",nodeal:!1},{w:"lanaau",a:"lana#0",b:"au",g:"to drift with the current",f:"hele",ev:"keep",nodeal:!1},{w:"lau hala",a:"lau#0",b:"hala#1",g:"pandanus leaf, for plaiting",f:"ulu",ev:"keep",nodeal:!1},{w:"lauhoe",a:"lau#0",b:"hoe",g:"blade of a paddle",f:"hana",ev:"keep",nodeal:!1},{w:"laukanaka",a:"lau#1",b:"kanaka",g:"a populous place",f:"kanaka",ev:"keep",nodeal:!1},{w:"lau koa",a:"lau#0",b:"koa#0",g:"leaf of the koa tree",f:"ulu",ev:"keep",nodeal:!1},{w:"lau kī",a:"lau#0",b:"kī#0",g:"ti leaf",f:"ulu",ev:"keep",nodeal:!1},{w:"lau kō",a:"lau#0",b:"kō#0",g:"sugar cane leaf",f:"ulu",ev:"keep",nodeal:!1},{w:"laulama",a:"lau#1",b:"lama#0",g:"many torches at night",f:"lani",ev:"keep",nodeal:!1},{w:"laulima",a:"lau#1",b:"lima",g:"working together, many hands",f:"hana",ev:"keep",nodeal:!1},{w:"laumake",a:"lau#0",b:"make",g:"poisonous plant; dead leaf",f:"ulu",ev:"keep",nodeal:!0},{w:"laupapa",a:"lau#broad",b:"papa#0",g:"broad flat of reef or lava",f:"ʻāina",ev:"keep",nodeal:!0},{w:"lauwili",a:"lau#0",b:"wili",g:"whirling about; fickle, changeable",f:"naʻau",ev:"keep",nodeal:!1},{w:"lau ʻulu",a:"lau#0",b:"ʻulu",g:"breadfruit leaf",f:"ulu",ev:"keep",nodeal:!1},{w:"lawaiʻamanu",a:"lawaiʻa",b:"manu",g:"bird catcher, fowler",f:"hana",ev:"keep",nodeal:!1},{w:"lawakua",a:"lawa#bind",b:"kua#0",g:"to bind fast on the back",f:"hana",ev:"keep",nodeal:!1},{w:"lawehala",a:"lawe",b:"hala#0",g:"wrongdoing, sin; to transgress",f:"naʻau",ev:"keep",nodeal:!1},{w:"lawehana",a:"lawe",b:"hana#0",g:"worker, laborer",f:"hana",ev:"keep",nodeal:!1},{w:"lawe ola",a:"lawe",b:"ola",g:"manslaughter; taking life unintentionally",f:"kanaka",ev:"keep",nodeal:!0},{w:"laʻa make",a:"laʻa#season",b:"make",g:"season when plants die back",f:"hele",ev:"keep",nodeal:!0},{w:"laʻa ulu",a:"laʻa#season",b:"ulu#0",g:"season when plants grow fast",f:"hele",ev:"keep",nodeal:!1},{w:"lehu ahi",a:"lehu",b:"ahi",g:"ashes left by a fire",f:"ʻāina",ev:"keep",nodeal:!1},{w:"lei aliʻi",a:"lei",b:"aliʻi",g:"crown; diadem; lei of a chief",f:"hana",ev:"keep",nodeal:!1},{w:"lei hala",a:"lei",b:"hala#1",g:"lei of hala (pandanus) fruit",f:"hana",ev:"keep",nodeal:!0},{w:"lelehuna",a:"lele",b:"huna#0",g:"fine windblown spray or mist",f:"lani",ev:"keep",nodeal:!1},{w:"lele pono",a:"lele",b:"pono",g:"to prosper; to fare well",f:"naʻau",ev:"keep",nodeal:!1},{w:"leo paʻa",a:"leo",b:"paʻa",g:"a person who cannot speak",f:"naʻau",ev:"keep",nodeal:!0},{w:"leo waena",a:"leo",b:"waena",g:"middle voice in part-singing",f:"naʻau",ev:"keep",nodeal:!0},{w:"leo wahine",a:"leo",b:"wahine",g:"highest voice part; female voice",f:"naʻau",ev:"keep",nodeal:!1},{w:"lewa lani",a:"lewa",b:"lani",g:"highest stratum of the heavens",f:"lani",ev:"keep",nodeal:!1},{w:"limahana",a:"lima",b:"hana#0",g:"worker, employee; labor",f:"hana",ev:"keep",nodeal:!1},{w:"lima hema",a:"lima",b:"hema",g:"left hand; left-handed",f:"kanaka",ev:"keep",nodeal:!1},{w:"lima kuhi",a:"lima",b:"kuhi#0",g:"index finger",f:"kanaka",ev:"keep",nodeal:!1},{w:"lima ʻākau",a:"lima",b:"ʻākau",g:"right hand; right-hand man",f:"kanaka",ev:"keep",nodeal:!1},{w:"lokomaikaʻi",a:"loko",b:"maikaʻi",g:"kindness, generosity; good will",f:"naʻau",ev:"keep",nodeal:!1},{w:"loko wai",a:"loko",b:"wai#0",g:"freshwater pond",f:"ʻāina",ev:"keep",nodeal:!1},{w:"loko ʻino",a:"loko",b:"ʻino",g:"unkindness; cruel disposition",f:"naʻau",ev:"keep",nodeal:!1},{w:"lole hana",a:"lole",b:"hana#0",g:"work clothes",f:"hana",ev:"keep",nodeal:!0},{w:"lolelua",a:"lole",b:"lua#0",g:"fickle; double-minded",f:"naʻau",ev:"keep",nodeal:!1},{w:"lolokaʻa",a:"lolo",b:"kaʻa#0",g:"dizziness",f:"kanaka",ev:"keep",nodeal:!0},{w:"lolo uila",a:"lolo",b:"uila",g:"computer",f:"hana",ev:"keep",nodeal:!0},{w:"lua pele",a:"lua#1",b:"pele",g:"volcano; volcanic crater",f:"ʻāina",ev:"keep",nodeal:!1},{w:"luapō",a:"lua#1",b:"pō",g:"the grave",f:"ʻāina",ev:"keep",nodeal:!0},{w:"luna hana",a:"luna#1",b:"hana#0",g:"work supervisor; foreman, boss",f:"hana",ev:"keep",nodeal:!1},{w:"lunakahiko",a:"luna#1",b:"kahiko",g:"an elder; elderly man of standing",f:"kanaka",ev:"keep",nodeal:!0},{w:"luna kaua",a:"luna#1",b:"kaua",g:"war captain",f:"kanaka",ev:"keep",nodeal:!0},{w:"luna kiaʻi",a:"luna#1",b:"kiaʻi",g:"overseer; watchman",f:"kanaka",ev:"keep",nodeal:!1},{w:"luna koa",a:"luna#1",b:"koa#1",g:"military officer",f:"kanaka",ev:"keep",nodeal:!0},{w:"luna kānāwai",a:"luna#1",b:"kānāwai",g:"judge; magistrate",f:"kanaka",ev:"keep",nodeal:!0},{w:"lunamanaʻo",a:"luna#1",b:"manaʻo",g:"conscience",f:"naʻau",ev:"keep",nodeal:!0},{w:"luna ʻauhau",a:"luna#1",b:"ʻauhau",g:"tax collector",f:"kanaka",ev:"keep",nodeal:!1},{w:"luna ʻohana",a:"luna#1",b:"ʻohana#0",g:"head of a family",f:"kanaka",ev:"keep",nodeal:!1},{w:"lunaʻōlelo",a:"luna#1",b:"ʻōlelo",g:"apostle; messenger, proclaimer",f:"kanaka",ev:"keep",nodeal:!0},{w:"lā hana",a:"lā#1",b:"hana#0",g:"workday; day of work",f:"hana",ev:"keep",nodeal:!1},{w:"lāhui kaua",a:"lāhui",b:"kaua",g:"warriors; company of soldiers",f:"kanaka",ev:"pending",nodeal:!0},{w:"lāʻau kia",a:"lāʻau",b:"kia#0",g:"limed stick for catching birds",f:"hana",ev:"keep",nodeal:!1},{w:"mahi ʻai",a:"mahi",b:"ʻai",g:"farmer; to farm",f:"ulu",ev:"keep",nodeal:!1},{w:"makaʻala",a:"maka#0",b:"ala?makaala",g:"alert, vigilant, watchful",f:"naʻau",ev:"keep",nodeal:!1},{w:"maka hiamoe",a:"maka#0",b:"hiamoe",g:"sleepy; to doze off",f:"kanaka",ev:"keep",nodeal:!1},{w:"maka koa",a:"maka#0",b:"koa#1",g:"bold, fearless",f:"naʻau",ev:"keep",nodeal:!1},{w:"makaluku",a:"maka#0",b:"luku",g:"turned against one, for harm",f:"naʻau",ev:"keep",nodeal:!0},{w:"maka momi",a:"maka#0",b:"momi",g:"white speck in the eye",f:"kanaka",ev:"keep",nodeal:!0},{w:"maka mua",a:"maka#0",b:"mua",g:"first; beginning",f:"hele",ev:"keep",nodeal:!1},{w:"makanahele",a:"maka#0",b:"nahele",g:"wild, untamed",f:"ʻāina",ev:"keep",nodeal:!1},{w:"makapaʻa",a:"maka#0",b:"paʻa",g:"blind in one eye",f:"kanaka",ev:"keep",nodeal:!0},{w:"makapōuli",a:"maka#0",b:"pouli",g:"dizzy, faint",f:"kanaka",ev:"keep",nodeal:!1},{w:"makapō",a:"maka#0",b:"pō",g:"blind; a blind person",f:"kanaka",ev:"keep",nodeal:!0},{w:"maka wai",a:"maka#0",b:"wai#0",g:"watery-eyed",f:"kanaka",ev:"keep",nodeal:!1},{w:"makehewa",a:"make?makehewa",b:"hewa",g:"in vain; to no profit",f:"naʻau",ev:"keep",nodeal:!1},{w:"make wai",a:"make",b:"wai#0",g:"thirst; thirsty",f:"kanaka",ev:"keep",nodeal:!1},{w:"makua kāne",a:"makua",b:"kāne",g:"father",f:"kanaka",ev:"keep",nodeal:!1},{w:"makualiʻi",a:"makua",b:"liʻi#1",g:"patriarch; progenitor",f:"kanaka",ev:"keep",nodeal:!1},{w:"manawa ʻino",a:"manawa",b:"ʻino",g:"ill-natured, unfriendly",f:"naʻau",ev:"keep",nodeal:!1},{w:"manaʻolana",a:"manaʻo",b:"lana#0",g:"hope; to hope",f:"naʻau",ev:"keep",nodeal:!1},{w:"manaʻopaʻa",a:"manaʻo",b:"paʻa",g:"resolve; firm purpose",f:"naʻau",ev:"keep",nodeal:!1},{w:"manaʻoʻiʻo",a:"manaʻo",b:"ʻiʻo#0",g:"faith; to believe",f:"naʻau",ev:"keep",nodeal:!1},{w:"manu ihu",a:"manu",b:"ihu",g:"beak end-piece of a canoe",f:"hana",ev:"keep",nodeal:!1},{w:"maʻalahi",a:"maʻa",b:"lahi",g:"easy, simple",f:"hana",ev:"keep",nodeal:!1},{w:"maʻawe ʻula",a:"maʻawe",b:"ʻula#0",g:"path worn down to red earth",f:"hele",ev:"keep",nodeal:!1},{w:"moa mahi",a:"moa",b:"mahi",g:"victorious fighting cock; any conqueror",f:"lani",ev:"keep",nodeal:!1},{w:"moana kai",a:"moana#0",b:"kai",g:"salt sea; salt lake",f:"kai",ev:"keep",nodeal:!0},{w:"moana wai",a:"moana#0",b:"wai#0",g:"a lake of fresh water",f:"ʻāina",ev:"keep",nodeal:!1},{w:"moehewa",a:"moe",b:"hewa",g:"to talk or walk in sleep",f:"kanaka",ev:"keep",nodeal:!1},{w:"moeone",a:"moe",b:"one",g:"an earth-dwelling worm",f:"ʻāina",ev:"keep",nodeal:!1},{w:"moe ʻino",a:"moe",b:"ʻino",g:"an unpleasant dream; uneasy sleep",f:"naʻau",ev:"keep",nodeal:!1},{w:"moeʻuhane",a:"moe",b:"ʻuhane",g:"a dream; a vision",f:"naʻau",ev:"keep",nodeal:!1},{w:"mokuhonua",a:"moku",b:"honua#0",g:"continent",f:"ʻāina",ev:"keep",nodeal:!0},{w:"moku kaua",a:"moku",b:"kaua",g:"warship, man-of-war",f:"hana",ev:"keep",nodeal:!0},{w:"mokulele",a:"moku",b:"lele",g:"airplane",f:"hana",ev:"keep",nodeal:!0},{w:"mokuluʻu",a:"moku",b:"luʻu",g:"submarine",f:"hana",ev:"keep",nodeal:!0},{w:"mokumāhu",a:"moku",b:"māhu",g:"steamship",f:"hana",ev:"keep",nodeal:!0},{w:"mokupuni",a:"moku",b:"puni#0",g:"island",f:"ʻāina",ev:"keep",nodeal:!1},{w:"mokuʻāina",a:"moku",b:"ʻāina",g:"state; district; island",f:"ʻāina",ev:"keep",nodeal:!1},{w:"monakō",a:"mona",b:"kō#0",g:"glucose",f:"ulu",ev:"keep",nodeal:!0},{w:"moʻa maka",a:"moʻa",b:"maka#1",g:"partly cooked",f:"ulu",ev:"keep",nodeal:!1},{w:"moʻo aliʻi",a:"moʻo#line",b:"aliʻi",g:"genealogy of chiefs",f:"kanaka",ev:"keep",nodeal:!1},{w:"moʻo kanaka",a:"moʻo#line",b:"kanaka",g:"list of commoners, as for taxation",f:"kanaka",ev:"keep",nodeal:!1},{w:"moʻo kupuna",a:"moʻo#line",b:"kupuna",g:"line of ancestors; genealogy",f:"kanaka",ev:"keep",nodeal:!1},{w:"moʻo kūʻauhau",a:"moʻo#line",b:"kūʻauhau",g:"genealogy, line of descent",f:"kanaka",ev:"keep",nodeal:!1},{w:"moʻo lele",a:"moʻo",b:"lele",g:"flying serpent, dragon; a Bible word",f:"lani",ev:"keep",nodeal:!0},{w:"moʻoʻōlelo",a:"moʻo#line",b:"ʻōlelo",g:"history; tradition; connected narrative",f:"naʻau",ev:"keep",nodeal:!1},{w:"muli hope",a:"muli",b:"hope",g:"the last; youngest born",f:"kanaka",ev:"keep",nodeal:!1},{w:"naʻauao",a:"naʻau",b:"ao#0",g:"wise, learned; wisdom",f:"naʻau",ev:"keep",nodeal:!1},{w:"naʻau lua",a:"naʻau",b:"lua#0",g:"undecided; of two minds",f:"naʻau",ev:"keep",nodeal:!1},{w:"naʻau pono",a:"naʻau",b:"pono",g:"upright, just",f:"naʻau",ev:"keep",nodeal:!1},{w:"naʻaupō",a:"naʻau",b:"pō",g:"ignorant; ignorance",f:"naʻau",ev:"keep",nodeal:!1},{w:"noho aliʻi",a:"noho",b:"aliʻi",g:"throne; reign",f:"kanaka",ev:"keep",nodeal:!1},{w:"nuku wai",a:"nuku#0",b:"wai#0",g:"mouth of a stream",f:"ʻāina",ev:"keep",nodeal:!1},{w:"nānā ao",a:"nānā#1",b:"ao#2",g:"one who reads the clouds",f:"lani",ev:"keep",nodeal:!1},{w:"nānā uli",a:"nānā#1",b:"uli#0",g:"weather foreteller, sky watcher",f:"lani",ev:"keep",nodeal:!1},{w:"ʻolokaʻa",a:"olo?olokaʻa",b:"kaʻa#0",g:"to roll over and over",f:"hele",ev:"keep",nodeal:!1},{w:"omo koko",a:"omo",b:"koko",g:"a leech, a bloodsucker",f:"kanaka",ev:"keep",nodeal:!1},{w:"omo liu",a:"omo",b:"liu",g:"bilge pump; to pump bilge",f:"hana",ev:"keep",nodeal:!0},{w:"one hānau",a:"one",b:"hānau",g:"birthplace; native land",f:"ʻāina",ev:"keep",nodeal:!1},{w:"one ʻā",a:"one",b:"ʻā#0",g:"black cinder sand; hence gunpowder",f:"hana",ev:"keep",nodeal:!0},{w:"pahu kani",a:"pahu#0",b:"kani",g:"drum; percussion instrument",f:"naʻau",ev:"keep",nodeal:!0},{w:"pahu kapu",a:"pahu?pahukapu",b:"kapu#0",g:"kapu marker; consecrated place",f:"naʻau",ev:"keep",nodeal:!1},{w:"pahu palapala",a:"pahu#0",b:"palapala",g:"kapa-dye box; writing desk",f:"hana",ev:"keep",nodeal:!1},{w:"pakakahi",a:"paka#4",b:"kahi#0",g:"scattered drops of light rain",f:"lani",ev:"pending",nodeal:!1},{w:"palai maka",a:"palai#avert",b:"maka#0",g:"abashed, shamefaced; to turn away",f:"naʻau",ev:"keep",nodeal:!1},{w:"pale kai",a:"pale#1",b:"kai",g:"breakwater; ship railing",f:"kai",ev:"keep",nodeal:!1},{w:"pale kaua",a:"pale#1",b:"kaua",g:"shield; defensive armor",f:"hana",ev:"keep",nodeal:!0},{w:"pale keiki",a:"pale#1",b:"keiki",g:"midwife; to deliver a child",f:"kanaka",ev:"keep",nodeal:!1},{w:"pale maka",a:"pale#0",b:"maka#0",g:"veil; covering for the face",f:"hana",ev:"keep",nodeal:!1},{w:"pale uhi",a:"pale#0",b:"uhi#1",g:"a covering; a veil",f:"hana",ev:"keep",nodeal:!1},{w:"pana poʻo",a:"pana",b:"poʻo",g:"to tap or snap the head",f:"naʻau",ev:"keep",nodeal:!1},{w:"pana pua",a:"pana",b:"pua",g:"archer; to shoot arrows",f:"hana",ev:"keep",nodeal:!1},{w:"panepoʻo",a:"pane#head",b:"poʻo",g:"pinnacle, summit; most important",f:"kanaka",ev:"keep",nodeal:!1},{w:"pani puka",a:"pani",b:"puka",g:"door; gate",f:"hana",ev:"keep",nodeal:!1},{w:"panipū",a:"pani",b:"pū#1",g:"wad of a gun",f:"hana",ev:"keep",nodeal:!0},{w:"papahola",a:"papa#0",b:"hola#0",g:"level court before a heiau",f:"hana",ev:"keep",nodeal:!1},{w:"papa kea",a:"papa#0",b:"kea",g:"beach washed only at high tide",f:"kai",ev:"keep",nodeal:!1},{w:"papa lalo",a:"papa#0",b:"lalo",g:"lower floor of a house",f:"hana",ev:"keep",nodeal:!1},{w:"papamū",a:"papa#0",b:"mū#2",g:"kōnane game board",f:"hana",ev:"keep",nodeal:!1},{w:"papa palapala",a:"papa#0",b:"palapala",g:"writing table; writing desk",f:"hana",ev:"keep",nodeal:!0},{w:"papa pāʻina",a:"papa#0",b:"pāʻina",g:"eating table",f:"hana",ev:"keep",nodeal:!1},{w:"papa pōhaku",a:"papa#0",b:"pōhaku",g:"stone slab; slate",f:"ʻāina",ev:"keep",nodeal:!1},{w:"papa waena",a:"papa#0",b:"waena",g:"middle storey of a building",f:"hana",ev:"keep",nodeal:!1},{w:"papa ʻaina",a:"papa#0",b:"ʻaina#0",g:"dining table",f:"hana",ev:"keep",nodeal:!1},{w:"pauaho",a:"pau",b:"aho#1",g:"out of breath; disheartened",f:"naʻau",ev:"keep",nodeal:!1},{w:"paʻahana",a:"paʻa",b:"hana#0",g:"industrious, hard-working",f:"hana",ev:"keep",nodeal:!1},{w:"paʻahao",a:"paʻa",b:"hao#0",g:"prisoner; imprisoned",f:"kanaka",ev:"keep",nodeal:!0},{w:"paʻakai",a:"paʻa",b:"kai",g:"salt",f:"kai",ev:"keep",nodeal:!1},{w:"paʻa kāhili",a:"paʻa",b:"kāhili",g:"kāhili bearer, attendant of a chief",f:"kanaka",ev:"keep",nodeal:!1},{w:"paʻa luhi",a:"paʻa",b:"luhi#0",g:"overcome with weariness",f:"kanaka",ev:"keep",nodeal:!1},{w:"paʻanaʻau",a:"paʻa",b:"naʻau",g:"memorized, known by heart",f:"naʻau",ev:"keep",nodeal:!1},{w:"paʻapū",a:"paʻa",b:"pū?paʻapū",g:"dense, crowded; covered over",f:"hele",ev:"keep",nodeal:!1},{w:"paʻawaha",a:"paʻa",b:"waha#0",g:"gag; to gag the mouth",f:"hana",ev:"keep",nodeal:!0},{w:"paʻaʻili",a:"paʻa",b:"ʻili",g:"many-sided solid (geometry)",f:"hele",ev:"keep",nodeal:!0},{w:"paʻi aʻa",a:"paʻi?paʻiaʻa",b:"aʻa#0",g:"root system, rootlets",f:"ulu",ev:"keep",nodeal:!1},{w:"paʻi kiʻi",a:"paʻi",b:"kiʻi#0",g:"photograph; to take a picture",f:"hana",ev:"keep",nodeal:!1},{w:"paʻi ʻai",a:"paʻi?paʻiʻai",b:"ʻai",g:"hand-pounded, undiluted taro",f:"ulu",ev:"keep",nodeal:!1},{w:"piha lima",a:"piha",b:"lima",g:"a handful",f:"hele",ev:"keep",nodeal:!1},{w:"pīpī wai",a:"pipi#seep",b:"wai#0",g:"place where water oozes up",f:"ʻāina",ev:"keep",nodeal:!1},{w:"poʻo hina",a:"poʻo",b:"hina#0",g:"gray-haired; gray with age",f:"kanaka",ev:"keep",nodeal:!1},{w:"poʻo kepa",a:"poʻo",b:"kepa",g:"hair cut lopsided in mourning",f:"kanaka",ev:"keep",nodeal:!0},{w:"poʻopaʻa",a:"poʻo",b:"paʻa",g:"stocky hawkfish, a reef fish",f:"kai",ev:"keep",nodeal:!1},{w:"poʻo wai",a:"poʻo",b:"wai#0",g:"headwaters; dam feeding an ʻauwai",f:"ʻāina",ev:"keep",nodeal:!1},{w:"poʻoʻōlelo",a:"poʻo",b:"ʻōlelo",g:"title or text of a discourse",f:"naʻau",ev:"keep",nodeal:!1},{w:"pua kala",a:"pua",b:"kala#0",g:"Hawaiian prickly poppy",f:"ulu",ev:"keep",nodeal:!1},{w:"puapoʻo",a:"pua",b:"poʻo",g:"comb or crest of a bird",f:"lani",ev:"keep",nodeal:!1},{w:"puka hale",a:"puka",b:"hale",g:"window or doorway of a house",f:"hana",ev:"keep",nodeal:!1},{w:"puka ihu",a:"puka",b:"ihu",g:"nostril",f:"kanaka",ev:"keep",nodeal:!1},{w:"puka makani",a:"puka",b:"makani",g:"window; opening for ventilation",f:"hana",ev:"keep",nodeal:!1},{w:"puʻukani",a:"puʻu",b:"kani",g:"sweet-voiced; a singer",f:"naʻau",ev:"keep",nodeal:!1},{w:"puʻukaua",a:"puʻu",b:"kaua",g:"fortification; stronghold",f:"hana",ev:"keep",nodeal:!0},{w:"puʻu koko",a:"puʻu",b:"koko",g:"clot of blood; the heart",f:"kanaka",ev:"keep",nodeal:!0},{w:"puʻu one",a:"puʻu",b:"one",g:"mound of sand; sand berm",f:"kai",ev:"keep",nodeal:!1},{w:"puʻuwai",a:"puʻu",b:"wai#0",g:"heart",f:"kanaka",ev:"keep",nodeal:!1},{w:"pākū",a:"pā#0",b:"kū#0",g:"partition, screen, curtain",f:"hana",ev:"keep",nodeal:!1},{w:"pāleo",a:"pā#4",b:"leo",g:"to converse; to debate",f:"naʻau",ev:"keep",nodeal:!1},{w:"pā lāʻau",a:"pā#0",b:"lāʻau",g:"wooden fence, hedge",f:"hana",ev:"keep",nodeal:!1},{w:"pānini",a:"pā#0",b:"nini#1",g:"cactus",f:"ulu",ev:"keep",nodeal:!0},{w:"pāpale aliʻi",a:"pāpale",b:"aliʻi",g:"crown; headdress of a king",f:"hana",ev:"keep",nodeal:!0},{w:"pī kai",a:"pī#sprinkle",b:"kai",g:"purify by sprinkling seawater",f:"naʻau",ev:"keep",nodeal:!1},{w:"pōhaku hele",a:"pōhaku",b:"hele",g:"small crab with stone-like shell",f:"kai",ev:"keep",nodeal:!1},{w:"pōhaku paʻa",a:"pōhaku",b:"paʻa",g:"hard stone, as for adzes",f:"ʻāina",ev:"keep",nodeal:!1},{w:"pōʻailani",a:"pōʻai",b:"lani",g:"horizon",f:"lani",ev:"keep",nodeal:!1},{w:"pōʻai lōʻihi",a:"pōʻai",b:"lōʻihi",g:"oval; ellipse",f:"hele",ev:"keep",nodeal:!0},{w:"pōʻai puni",a:"pōʻai",b:"puni#0",g:"to travel all around",f:"hele",ev:"keep",nodeal:!1},{w:"pōʻaono",a:"pō",b:"ʻaono",g:"Saturday",f:"hele",ev:"keep",nodeal:!0},{w:"pōʻele",a:"pō",b:"ʻele",g:"black, dark; dark night",f:"lani",ev:"keep",nodeal:!1},{w:"uhikino",a:"uhi#1",b:"kino",g:"body covering; shield; outer garment",f:"hana",ev:"keep",nodeal:!1},{w:"ulu lāʻau",a:"ulu#0",b:"lāʻau",g:"forest; thicket of trees",f:"ulu",ev:"keep",nodeal:!1},{w:"uluwehi",a:"ulu#0",b:"wehi",g:"lush growth",f:"ulu",ev:"keep",nodeal:!1},{w:"wahahewa",a:"waha#0",b:"hewa",g:"wicked, false speech",f:"naʻau",ev:"keep",nodeal:!1},{w:"wahaheʻe",a:"waha#0",b:"heʻe#1",g:"to lie; deceitful",f:"naʻau",ev:"keep",nodeal:!1},{w:"wai ea",a:"wai#0",b:"ea",g:"small house at a heiau entrance",f:"naʻau",ev:"keep",nodeal:!1},{w:"waihoʻoluʻu",a:"wai#0",b:"hoʻoluʻu",g:"dye; color",f:"hana",ev:"keep",nodeal:!1},{w:"wai kai",a:"wai#0",b:"kai",g:"brackish water",f:"kai",ev:"keep",nodeal:!1},{w:"wailana",a:"wai#0",b:"lana#0",g:"still, calm water",f:"kai",ev:"keep",nodeal:!0},{w:"wailele",a:"wai#0",b:"lele",g:"waterfall",f:"ʻāina",ev:"keep",nodeal:!1},{w:"waimaka",a:"wai#0",b:"maka#0",g:"tears",f:"kanaka",ev:"keep",nodeal:!1},{w:"waipaʻa",a:"wai#0",b:"paʻa",g:"ice; frozen water",f:"ʻāina",ev:"keep",nodeal:!1},{w:"wai piʻi",a:"wai#0",b:"piʻi#0",g:"flood; overflowing water",f:"ʻāina",ev:"keep",nodeal:!1},{w:"wai puna",a:"wai#0",b:"puna#0",g:"spring water",f:"ʻāina",ev:"keep",nodeal:!1},{w:"wai ua",a:"wai#0",b:"ua",g:"rainwater; water from the clouds",f:"lani",ev:"keep",nodeal:!1},{w:"waiū",a:"wai#0",b:"ū#0",g:"milk",f:"kanaka",ev:"keep",nodeal:!1},{w:"waiʻele",a:"wai#0",b:"ʻele",g:"dye for kapa",f:"hana",ev:"keep",nodeal:!1},{w:"waʻapā",a:"waʻa",b:"pā#plate",g:"rowboat; skiff of boards",f:"hana",ev:"keep",nodeal:!0},{w:"wiliau",a:"wili",b:"au",g:"eddy; swirling motion",f:"hele",ev:"keep",nodeal:!1},{w:"ʻahakanaka",a:"ʻaha#0",b:"kanaka",g:"a great company, multitude",f:"kanaka",ev:"keep",nodeal:!1},{w:"ʻaha mele",a:"ʻaha#0",b:"mele#0",g:"concert",f:"naʻau",ev:"keep",nodeal:!1},{w:"ʻahaʻōlelo",a:"ʻaha#0",b:"ʻōlelo",g:"council; legislature",f:"kanaka",ev:"keep",nodeal:!1},{w:"ʻahuao",a:"ʻahu",b:"ao?ʻahuao",g:"mat of soft young pandanus leaves",f:"hana",ev:"pending",nodeal:!1},{w:"ʻahu ʻula",a:"ʻahu",b:"ʻula#0",g:"feather cloak of high chiefs",f:"hana",ev:"keep",nodeal:!1},{w:"ʻaha inu",a:"ʻaha#0",b:"inu",g:"a gathering for drinking",f:"ulu",ev:"keep",nodeal:!1},{w:"ʻahālike",a:"ʻahā",b:"like",g:"square, four equal sides",f:"hele",ev:"keep",nodeal:!1},{w:"ʻahaʻaina",a:"ʻaha#0",b:"ʻaina#0",g:"feast, banquet",f:"ulu",ev:"keep",nodeal:!1},{w:"ʻaialo",a:"ʻai",b:"alo",g:"attendants of a chief",f:"kanaka",ev:"keep",nodeal:!1},{w:"ʻai kapu",a:"ʻai",b:"kapu#0",g:"observing the sacred eating restrictions",f:"naʻau",ev:"keep",nodeal:!1},{w:"ʻauinalā",a:"ʻauina",b:"lā#1",g:"afternoon",f:"hele",ev:"keep",nodeal:!1},{w:"ʻauinapō",a:"ʻauina",b:"pō",g:"late night",f:"hele",ev:"keep",nodeal:!1},{w:"ʻau like",a:"ʻau#1",b:"like",g:"to swim abreast, evenly",f:"hele",ev:"keep",nodeal:!1},{w:"ʻau lima",a:"ʻau#0",b:"lima",g:"hand stick for making fire",f:"hana",ev:"keep",nodeal:!1},{w:"ʻaumakua",a:"ʻau?ʻaumakua",b:"makua",g:"family or personal god",f:"naʻau",ev:"keep",nodeal:!1},{w:"ʻaumoana",a:"ʻau#group",b:"moana#0",g:"sailor; one long at sea",f:"kai",ev:"keep",nodeal:!1},{w:"ʻauwai",a:"ʻau?ʻauwai",b:"wai#0",g:"irrigation ditch; watercourse",f:"ʻāina",ev:"keep",nodeal:!1},{w:"ʻaʻa niu",a:"ʻaʻa#0",b:"niu#0",g:"clothlike sheath at coconut-frond base",f:"ulu",ev:"keep",nodeal:!1},{w:"ʻaʻa pua",a:"ʻaʻa#0",b:"pua",g:"quiver; arrow case",f:"hana",ev:"keep",nodeal:!1},{w:"ʻikepili",a:"ʻike",b:"pili",g:"data",f:"naʻau",ev:"keep",nodeal:!0},{w:"ʻilikai",a:"ʻili",b:"kai",g:"surface of the sea; sea level",f:"kai",ev:"keep",nodeal:!1},{w:"ʻili lua",a:"ʻili",b:"lua#0",g:"new skin after healing; aged skin",f:"kanaka",ev:"keep",nodeal:!1},{w:"ʻohākulaʻi",a:"ʻohā",b:"kulaʻi",g:"to bend young taro off the corm",f:"ulu",ev:"keep",nodeal:!1},{w:"ʻoihana",a:"ʻoi",b:"hana#0",g:"occupation, trade; department, office",f:"hana",ev:"keep",nodeal:!1},{w:"ʻuala kahiki",a:"ʻuala",b:"kahiki#0",g:"potato (the Irish potato)",f:"ulu",ev:"keep",nodeal:!0},{w:"ʻuku kapa",a:"ʻuku#0",b:"kapa",g:"body louse",f:"kanaka",ev:"keep",nodeal:!1},{w:"ʻukulele",a:"ʻuku#0",b:"lele",g:"ukulele, small four-stringed instrument",f:"naʻau",ev:"keep",nodeal:!0},{w:"ʻuku poʻo",a:"ʻuku#0",b:"poʻo",g:"head louse",f:"kanaka",ev:"keep",nodeal:!1},{w:"ʻulu kahiki",a:"ʻulu",b:"kahiki#0",g:"foreign breadfruit tree",f:"ulu",ev:"keep",nodeal:!0},{w:"ʻōlelo aʻo",a:"ʻōlelo",b:"aʻo",g:"counsel, advice; teachings",f:"naʻau",ev:"keep",nodeal:!1},{w:"ʻōlelo paʻa",a:"ʻōlelo",b:"paʻa",g:"a precept; a command",f:"naʻau",ev:"keep",nodeal:!1},{w:"ʻōpūao",a:"ʻōpū",b:"ao#0",g:"wise-hearted, knowing, intelligent",f:"naʻau",ev:"keep",nodeal:!1},{w:"ʻōpūhue",a:"ʻōpū",b:"hue",g:"round, low calabash",f:"hana",ev:"pending",nodeal:!1},{w:"aheahe",a:"ahe",b:"ahe",g:"gentle breeze",f:"lani",ev:"keep",nodeal:!1},{w:"akaaka",a:"aka#bright",b:"aka#bright",g:"clear, bright, luminous",f:"lani",ev:"keep",nodeal:!1},{w:"aniani",a:"ani",b:"ani",g:"cool; blowing softly",f:"lani",ev:"keep",nodeal:!1},{w:"anuanu",a:"anu",b:"anu",g:"cold, chilly",f:"lani",ev:"keep",nodeal:!1},{w:"auau",a:"au",b:"au",g:"hasten, move swiftly",f:"hele",ev:"keep",nodeal:!1},{w:"hakahaka",a:"haka#1",b:"haka#1",g:"empty space, gap, vacancy",f:"ʻāina",ev:"keep",nodeal:!1},{w:"hakuhaku",a:"haku#1",b:"haku#1",g:"lumpy, full of hard lumps",f:"ʻāina",ev:"keep",nodeal:!1},{w:"halahala",a:"hala#0",b:"hala#0",g:"fault-finding, criticism",f:"naʻau",ev:"keep",nodeal:!1},{w:"hanahana",a:"hana#1",b:"hana#1",g:"hot, warm; heated",f:"lani",ev:"keep",nodeal:!1},{w:"hanohano",a:"hano#0",b:"hano#0",g:"honored, dignified; glory",f:"naʻau",ev:"keep",nodeal:!1},{w:"hauhau",a:"hau#0",b:"hau#0",g:"cold (of food)",f:"ulu",ev:"keep",nodeal:!1},{w:"haʻahaʻa",a:"haʻa",b:"haʻa",g:"low; humble, modest",f:"naʻau",ev:"keep",nodeal:!1},{w:"haʻihaʻi",a:"haʻi",b:"haʻi",g:"brittle; to break in pieces",f:"hana",ev:"keep",nodeal:!1},{w:"heahea",a:"hea#0",b:"hea#0",g:"to call in, welcome; hospitable",f:"naʻau",ev:"keep",nodeal:!1},{w:"heluhelu",a:"helu#0",b:"helu#0",g:"to read; to count",f:"naʻau",ev:"keep",nodeal:!1},{w:"hemahema",a:"hema",b:"hema",g:"awkward, clumsy; unskilled",f:"hana",ev:"keep",nodeal:!1},{w:"henehene",a:"hene",b:"hene",g:"to tease, laugh at",f:"naʻau",ev:"keep",nodeal:!1},{w:"hinahina",a:"hina#0",b:"hina#0",g:"a Pacific heliotrope; grayish",f:"ulu",ev:"keep",nodeal:!1},{w:"hinuhinu",a:"hinu",b:"hinu",g:"bright, glossy, shining",f:"lani",ev:"keep",nodeal:!1},{w:"hiʻuhiʻu",a:"hiʻu",b:"hiʻu",g:"loose ends left after plaiting",f:"hana",ev:"keep",nodeal:!1},{w:"hoehoe",a:"hoe",b:"hoe",g:"to paddle, as a canoe",f:"hana",ev:"keep",nodeal:!1},{w:"holoholo",a:"holo#0",b:"holo#0",g:"to go out walking, riding, sailing",f:"hele",ev:"keep",nodeal:!1},{w:"hopohopo",a:"hopo",b:"hopo",g:"anxious, fearful; anxiety",f:"naʻau",ev:"keep",nodeal:!1},{w:"hoʻihoʻi",a:"hoʻi",b:"hoʻi",g:"to return, bring back, restore",f:"hele",ev:"keep",nodeal:!1},{w:"huihui",a:"hui",b:"hui",g:"mixed, mingled; a cluster",f:"kanaka",ev:"keep",nodeal:!1},{w:"hulihuli",a:"huli#0",b:"huli#0",g:"to turn over and over",f:"hele",ev:"keep",nodeal:!1},{w:"huluhulu",a:"hulu#0",b:"hulu#0",g:"fleece, wool; hairy, downy",f:"hana",ev:"keep",nodeal:!1},{w:"humuhumu",a:"humu",b:"humu",g:"to sew, stitch together",f:"hana",ev:"keep",nodeal:!1},{w:"hunahuna",a:"huna#0",b:"huna#0",g:"crumbs, particles, scraps",f:"ʻāina",ev:"keep",nodeal:!1},{w:"huʻahuʻa",a:"huʻa",b:"huʻa",g:"foam, froth",f:"kai",ev:"keep",nodeal:!1},{w:"huʻihuʻi",a:"huʻi#cold",b:"huʻi#cold",g:"cold, chilly",f:"lani",ev:"keep",nodeal:!1},{w:"hāhā",a:"hā#2",b:"hā#2",g:"native lobelias; Gunnera plants",f:"ulu",ev:"keep",nodeal:!1},{w:"iheihe",a:"ihe#fish",b:"ihe#fish",g:"halfbeak, a fish",f:"kai",ev:"keep",nodeal:!1},{w:"ihoiho",a:"iho#0",b:"iho#0",g:"heartwood, core of a tree",f:"ulu",ev:"keep",nodeal:!1},{w:"ikaika",a:"ika",b:"ika",g:"strong; strength",f:"kanaka",ev:"keep",nodeal:!1},{w:"kahakaha",a:"kaha#0",b:"kaha#0",g:"to draw lines; engrave; striped",f:"hana",ev:"keep",nodeal:!1},{w:"kalakala",a:"kala#0",b:"kala#0",g:"thorny, rough, craggy",f:"ʻāina",ev:"keep",nodeal:!1},{w:"kaukau",a:"kau#2",b:"kau#2",g:"to counsel, reason with",f:"naʻau",ev:"keep",nodeal:!1},{w:"kaʻikaʻi",a:"kaʻi",b:"kaʻi",g:"to lift up, carry, lead",f:"hele",ev:"keep",nodeal:!1},{w:"keʻokeʻo",a:"keʻo",b:"keʻo",g:"white",f:"lani",ev:"keep",nodeal:!1},{w:"kihikihi",a:"kihi",b:"kihi",g:"angular, full of corners",f:"hana",ev:"keep",nodeal:!1},{w:"kikokiko",a:"kiko",b:"kiko",g:"dotted, spotted, speckled",f:"lani",ev:"keep",nodeal:!1},{w:"kilakila",a:"kila#0",b:"kila#0",g:"majestic, imposing",f:"ʻāina",ev:"keep",nodeal:!1},{w:"kiʻekiʻe",a:"kiʻe",b:"kiʻe",g:"high, lofty; height",f:"ʻāina",ev:"keep",nodeal:!1},{w:"kolokolo",a:"kolo",b:"kolo",g:"any creeping vine",f:"ulu",ev:"keep",nodeal:!1},{w:"konakona",a:"kona#1",b:"kona#1",g:"rough, uneven; muscular",f:"ʻāina",ev:"keep",nodeal:!1},{w:"konākonā",a:"konā",b:"konā",g:"dislike, contempt",f:"naʻau",ev:"keep",nodeal:!1},{w:"koʻokoʻo",a:"koʻo",b:"koʻo",g:"cane, staff; support, prop",f:"hana",ev:"keep",nodeal:!1},{w:"kupukupu",a:"kupu",b:"kupu",g:"to surge forth; sword fern",f:"ulu",ev:"keep",nodeal:!1},{w:"kuʻukuʻu",a:"kuʻu",b:"kuʻu",g:"to lower bit by bit",f:"hele",ev:"keep",nodeal:!1},{w:"kōkō",a:"kō#1",b:"kō#1",g:"carrying net, as for a calabash",f:"kanaka",ev:"keep",nodeal:!1},{w:"kūkākūkā",a:"kūkā",b:"kūkā",g:"to discuss, consult together",f:"naʻau",ev:"keep",nodeal:!1},{w:"lahalaha",a:"laha",b:"laha",g:"spread over, as brooding wings",f:"ulu",ev:"keep",nodeal:!1},{w:"lahilahi",a:"lahi",b:"lahi",g:"thin, delicate; thinness",f:"hana",ev:"keep",nodeal:!1},{w:"lamalama",a:"lama#0",b:"lama#0",g:"torch fishing; glowing",f:"kai",ev:"keep",nodeal:!1},{w:"laulau",a:"lau#0",b:"lau#0",g:"food bundle wrapped in leaves",f:"ulu",ev:"keep",nodeal:!1},{w:"lehulehu",a:"lehu#number",b:"lehu#number",g:"multitude, crowd; the public",f:"kanaka",ev:"keep",nodeal:!1},{w:"lenalena",a:"lena",b:"lena",g:"orange-yellow, yellow",f:"lani",ev:"keep",nodeal:!1},{w:"leoleo",a:"leo",b:"leo",g:"to speak loudly",f:"naʻau",ev:"keep",nodeal:!1},{w:"lihilihi",a:"lihi",b:"lihi",g:"eyelashes; eyelids",f:"kanaka",ev:"keep",nodeal:!1},{w:"likiliki",a:"liki",b:"liki",g:"tight; tied on tightly",f:"hana",ev:"keep",nodeal:!1},{w:"limalima",a:"lima",b:"lima",g:"to handle, work with the hands",f:"hana",ev:"keep",nodeal:!1},{w:"linolino",a:"lino",b:"lino",g:"calm, unruffled; bright",f:"naʻau",ev:"keep",nodeal:!1},{w:"liʻiliʻi",a:"liʻi#0",b:"liʻi#0",g:"small, little; few",f:"hele",ev:"keep",nodeal:!1},{w:"lohelohe",a:"lohe",b:"lohe",g:"to listen carefully; to eavesdrop",f:"naʻau",ev:"keep",nodeal:!1},{w:"makamaka",a:"maka#0",b:"maka#0",g:"intimate friend, host",f:"ulu",ev:"keep",nodeal:!1},{w:"manamana",a:"mana#1",b:"mana#1",g:"fingers, toes; branches",f:"kanaka",ev:"keep",nodeal:!1},{w:"maʻamaʻa",a:"maʻa",b:"maʻa",g:"accustomed, experienced",f:"naʻau",ev:"keep",nodeal:!1},{w:"maʻomaʻo",a:"maʻo#0",b:"maʻo#0",g:"green, greenness",f:"ulu",ev:"keep",nodeal:!1},{w:"mehameha",a:"meha",b:"meha",g:"loneliness, solitude",f:"naʻau",ev:"keep",nodeal:!1},{w:"melemele",a:"mele#1",b:"mele#1",g:"yellow, light yellow",f:"lani",ev:"keep",nodeal:!1},{w:"mikomiko",a:"miko",b:"miko",g:"lightly salted; savory",f:"ulu",ev:"keep",nodeal:!1},{w:"milimili",a:"mili",b:"mili",g:"examine admiringly; a cherished favorite",f:"naʻau",ev:"keep",nodeal:!1},{w:"mūmū",a:"mū#4",b:"mū#4",g:"silent, mum; to hold water in the mouth",f:"naʻau",ev:"keep",nodeal:!1},{w:"nahenahe",a:"nahe",b:"nahe",g:"soft, gentle; sweet-sounding",f:"naʻau",ev:"keep",nodeal:!1},{w:"naunau",a:"nau",b:"nau",g:"to mumble, speak indistinctly",f:"kanaka",ev:"keep",nodeal:!1},{w:"nihoniho",a:"niho",b:"niho",g:"toothed, notched, serrated",f:"hana",ev:"keep",nodeal:!1},{w:"noʻonoʻo",a:"noʻo",b:"noʻo",g:"to think, reflect; thought",f:"naʻau",ev:"keep",nodeal:!1},{w:"nūnū",a:"nū",b:"nū",g:"pigeon, dove",f:"lani",ev:"keep",nodeal:!1},{w:"okaoka",a:"oka",b:"oka",g:"bits, particles; dust",f:"ʻāina",ev:"keep",nodeal:!1},{w:"paepae",a:"pae#1",b:"pae#1",g:"platform, pavement; prop, support",f:"hana",ev:"keep",nodeal:!1},{w:"pakapaka",a:"paka#4",b:"paka#4",g:"patter of heavy raindrops",f:"lani",ev:"keep",nodeal:!1},{w:"panepane",a:"pane",b:"pane",g:"to talk back",f:"naʻau",ev:"keep",nodeal:!1},{w:"pekapeka",a:"peka",b:"peka",g:"to slander; a slanderer",f:"naʻau",ev:"keep",nodeal:!1},{w:"pekupeku",a:"peku",b:"peku",g:"to kick again and again",f:"hele",ev:"pending",nodeal:!1},{w:"pilipili",a:"pili",b:"pili",g:"clinging, sticking close; connected",f:"kanaka",ev:"keep",nodeal:!1},{w:"piopio",a:"pio#2",b:"pio#2",g:"chick; call for chickens",f:"lani",ev:"keep",nodeal:!1},{w:"poepoe",a:"poe#0",b:"poe#0",g:"round; a sphere, globe",f:"hele",ev:"keep",nodeal:!1},{w:"ponopono",a:"pono",b:"pono",g:"neat, tidy, in order",f:"naʻau",ev:"keep",nodeal:!1},{w:"pulepule",a:"pule#1",b:"pule#1",g:"spotted, speckled",f:"lani",ev:"keep",nodeal:!1},{w:"punipuni",a:"puni#1",b:"puni#1",g:"to lie, tell falsehoods",f:"naʻau",ev:"keep",nodeal:!1},{w:"puʻupuʻu",a:"puʻu",b:"puʻu",g:"lumpy; heaped up",f:"ʻāina",ev:"keep",nodeal:!1},{w:"pūpū",a:"pū#1",b:"pū#1",g:"shells; shell beads",f:"kai",ev:"keep",nodeal:!1},{w:"uhiuhi",a:"uhi#1",b:"uhi#1",g:"to cover over, as makeshift thatch",f:"hana",ev:"keep",nodeal:!1},{w:"uliuli",a:"uli#0",b:"uli#0",g:"dark color: blue, green, black",f:"lani",ev:"keep",nodeal:!1},{w:"waiwai",a:"wai#1",b:"wai#1",g:"goods, wealth; to be rich",f:"hana",ev:"keep",nodeal:!1},{w:"wanawana",a:"wana",b:"wana",g:"spiny, thorny",f:"kai",ev:"keep",nodeal:!1},{w:"wehewehe",a:"wehe",b:"wehe",g:"explain; open up, pull apart",f:"naʻau",ev:"keep",nodeal:!1},{w:"weluwelu",a:"welu",b:"welu",g:"torn to shreds, ragged",f:"hana",ev:"keep",nodeal:!1},{w:"wikiwiki",a:"wiki",b:"wiki",g:"quick, speedy; to hurry",f:"hele",ev:"keep",nodeal:!1},{w:"wiliwili",a:"wili",b:"wili",g:"stir round; whirl about",f:"hele",ev:"keep",nodeal:!1},{w:"wīwī",a:"wī#famine",b:"wī#famine",g:"thin, slender",f:"kanaka",ev:"keep",nodeal:!1},{w:"ʻahaʻaha",a:"ʻaha#1",b:"ʻaha#1",g:"cordage",f:"hana",ev:"keep",nodeal:!1},{w:"ʻakaʻaka",a:"ʻaka",b:"ʻaka",g:"laughter; to laugh",f:"naʻau",ev:"keep",nodeal:!1},{w:"ʻakiʻaki",a:"ʻaki#0",b:"ʻaki#0",g:"nibble, snap again and again",f:"kai",ev:"keep",nodeal:!1},{w:"ʻaleʻale",a:"ʻale",b:"ʻale",g:"rippling, stirring, as water",f:"kai",ev:"keep",nodeal:!1},{w:"ʻaloʻalo",a:"ʻalo",b:"ʻalo",g:"dodge again and again",f:"hele",ev:"keep",nodeal:!1},{w:"ʻaluʻalu",a:"ʻalu",b:"ʻalu",g:"loose, slack; wrinkled",f:"kanaka",ev:"keep",nodeal:!1},{w:"ʻapeʻape",a:"ʻape",b:"ʻape",g:"Gunnera, a giant-leafed plant",f:"ulu",ev:"keep",nodeal:!1},{w:"ʻauʻau",a:"ʻau#1",b:"ʻau#1",g:"to bathe; to swim",f:"kai",ev:"keep",nodeal:!1},{w:"ʻawaʻawa",a:"ʻawa#bitter",b:"ʻawa#bitter",g:"sour, bitter",f:"ulu",ev:"keep",nodeal:!1},{w:"ʻehaʻeha",a:"ʻeha",b:"ʻeha",g:"great pain; sorrow",f:"kanaka",ev:"keep",nodeal:!1},{w:"ʻekeʻeke",a:"ʻeke#cringe",b:"ʻeke#cringe",g:"fussy, over-exacting",f:"naʻau",ev:"keep",nodeal:!1},{w:"ʻeleʻele",a:"ʻele",b:"ʻele",g:"black, dark",f:"lani",ev:"keep",nodeal:!1},{w:"ʻieʻie",a:"ʻie",b:"ʻie",g:"a woody climbing vine (Freycinetia)",f:"ulu",ev:"keep",nodeal:!1},{w:"ʻikeʻike",a:"ʻike",b:"ʻike",g:"to see, to perceive",f:"naʻau",ev:"keep",nodeal:!1},{w:"ʻimoʻimo",a:"ʻimo",b:"ʻimo",g:"to twinkle, as stars",f:"lani",ev:"keep",nodeal:!1},{w:"ʻinoʻino",a:"ʻino",b:"ʻino",g:"spoiled, broken, damaged",f:"naʻau",ev:"keep",nodeal:!1},{w:"ʻiwaʻiwa",a:"ʻiwa#fern",b:"ʻiwa#fern",g:"maidenhair fern",f:"ulu",ev:"keep",nodeal:!1},{w:"ʻoheʻohe",a:"ʻohe",b:"ʻohe",g:"a tall native tree",f:"ulu",ev:"keep",nodeal:!1},{w:"ʻoliʻoli",a:"ʻoli",b:"ʻoli",g:"joy, delight; joyful",f:"naʻau",ev:"keep",nodeal:!1},{w:"ʻoluʻolu",a:"ʻolu",b:"ʻolu",g:"pleasant, nice; comfortable",f:"naʻau",ev:"keep",nodeal:!1},{w:"ʻonaʻona",a:"ʻona",b:"ʻona",g:"dizzy, faint",f:"kanaka",ev:"keep",nodeal:!1},{w:"ʻoniʻoni",a:"ʻoni",b:"ʻoni",g:"move back and forth; wiggle",f:"hele",ev:"keep",nodeal:!1},{w:"ʻopiʻopi",a:"ʻopi",b:"ʻopi",g:"to fold, as cloth",f:"hana",ev:"keep",nodeal:!1},{w:"ʻukiʻuki",a:"ʻuki",b:"ʻuki",g:"a native flax lily (Dianella)",f:"ulu",ev:"keep",nodeal:!1},{w:"ʻulaʻula",a:"ʻula#0",b:"ʻula#0",g:"red, reddish",f:"lani",ev:"keep",nodeal:!1},{w:"ʻēʻē",a:"ʻē#1",b:"ʻē#1",g:"peculiar; contrary, opposite",f:"naʻau",ev:"keep",nodeal:!1},{w:"ʻōʻō",a:"ʻō#0",b:"ʻō#0",g:"digging stick",f:"hana",ev:"keep",nodeal:!1}],Kh={"aho#1":{s:"aho",g:"breath",pp:"PCE *aho",cog:[["Tahitian","aho"]]},loa:{s:"loa",g:"long",pp:"PPN *loa",cog:[["Māori","roa"],["Tahitian","roa"],["Sāmoan","loa"]]},nui:{s:"nui",g:"big, great",pp:"PNP *nui",cog:[["Māori","nui"],["Tahitian","nui"],["Sāmoan","nui"]]},ahu:{s:"ahu",g:"heap, cairn",pp:"PPN *qafu",cog:[["Māori","ahu"],["Tahitian","ahu"],["Rapa Nui","ahu"]]},puaʻa:{s:"puaʻa",g:"pig",pp:"PPN *puaka",cog:[["Tahitian","puaʻa"],["Sāmoan","puaʻa"],["Tongan","puaka"]]},ake:{s:"ake",g:"liver; desire",pp:"PPN *qate",cog:[["Māori","ate"],["Tahitian","ate"],["Sāmoan","ate"]]},akamai:{s:"akamai",g:"clever, smart",pp:"PPN *qatamai",cog:[["Māori","atamai"],["Sāmoan","atamai"],["Tongan","ʻatamai"]]},māmā:{s:"māmā",g:"light (weight)",pp:"PPN *maqa-maqa",cog:[["Māori","māmā"],["Tahitian","māmā"],["Sāmoan","māmā"]]},"ala#0":{s:"ala",g:"path, road",pp:"PPN *hala",cog:[["Māori","ara"],["Tahitian","ara"],["Sāmoan","ala"]]},"haka#0":{s:"haka",g:"shelf, perch",pp:"PPN *fata",cog:[["Māori","whata"],["Tahitian","fata"],["Sāmoan","fata"]]},"hao#0":{s:"hao",g:"iron",pp:"PPN *faqo",cog:[["Māori","whao"],["Tahitian","fao"],["Sāmoan","fao"]]},kaʻi:{s:"kaʻi",g:"lead",pp:"PPN *taki",cog:[["Māori","taki"],["Sāmoan","taʻi"],["Tongan","taki"]]},"piʻi#0":{s:"piʻi",g:"climb, rise",pp:"PEP *piki",cog:[["Māori","piki"],["Rapa Nui","piki"]]},"wai#0":{s:"wai",g:"water",pp:"PPN *wai",cog:[["Māori","wai"],["Tahitian","vai"],["Sāmoan","vai"]]},"ʻula?alaʻula":{s:"ula",g:"flame, red glow",pp:"",cog:[]},aliʻi:{s:"aliʻi",g:"chief",pp:"PPN *qariki",cog:[["Māori","ariki"],["Tahitian","ariʻi"],["Sāmoan","aliʻi"]]},wahine:{s:"wahine",g:"woman, female",pp:"PCE *wahine",cog:[["Māori","wahine"],["Tahitian","vahine"],["Marquesan","vehine"]]},"ana#1":{s:"ana",g:"measure",pp:"PPN *haŋa",cog:[["Sāmoan","aga"],["Tongan","hanga"]]},manaʻo:{s:"manaʻo",g:"thought",pp:"PPN *manako",cog:[["Māori","manako"],["Tahitian","manaʻo"],["Sāmoan","manaʻo"]]},"puni#0":{s:"puni",g:"surrounded, around",pp:"PPN *puni",cog:[["Māori","puni"],["Sāmoan","puni"],["Tongan","punipuni"]]},waena:{s:"waena",g:"middle",pp:"PPN *wahe-ŋa",cog:[["Māori","waenga"],["Sāmoan","vāega"],["Tongan","vāhenga"]]},ʻāina:{s:"ʻāina",g:"land",pp:"PPN *kaaiŋa",cog:[["Māori","kāinga"],["Tahitian","ʻāiʻa"],["Sāmoan","ʻāiga"]]},"ao#2":{s:"ao",g:"cloud",pp:"PPN *qao",cog:[["Māori","ao"],["Tahitian","ao"],["Sāmoan","ao"]]},"uli#0":{s:"uli",g:"dark, deep blue",pp:"PPN *quli",cog:[["Māori","uri"],["Tahitian","uri"],["Sāmoan","uli"]]},au:{s:"au",g:"current",pp:"PPN *qau",cog:[["Māori","au"],["Tongan","ʻau"],["Marquesan","au"]]},"miki#0":{s:"miki",g:"recede, suck in",pp:"PPN *miti",cog:[["Māori","miti"],["Tahitian","miti"],["Sāmoan","miti"]]},"au?aumoe":{s:"au",g:"arrive, reach",pp:"",cog:[]},moe:{s:"moe",g:"sleep, lie down",pp:"PPN *mohe",cog:[["Māori","moe"],["Tahitian","moe"],["Sāmoan","moe"]]},"ʻau#group":{s:"ʻau",g:"group",pp:"PPN *kau",cog:[["Māori","kau"],["Sāmoan","ʻau"],["Tongan","kau"]]},waʻa:{s:"waʻa",g:"canoe",pp:"PPN *waka",cog:[["Māori","waka"],["Tahitian","vaʻa"],["Sāmoan","vaʻa"]]},"aʻa#0":{s:"aʻa",g:"root, vein",pp:"PPN *aka",cog:[["Māori","aka"],["Tahitian","aʻa"],["Sāmoan","aʻa"]]},koko:{s:"koko",g:"blood",pp:"PPN *toto",cog:[["Māori","toto"],["Tahitian","toto"],["Sāmoan","toto"]]},lele:{s:"lele",g:"fly, leap",pp:"PPN *lele",cog:[["Māori","rere"],["Sāmoan","lele"],["Tahitian","rere"]]},lolo:{s:"lolo",g:"brain",pp:"PEP *roro",cog:[["Māori","roro"],["Tahitian","roro"],["Rapa Nui","roro"]]},"hai#0":{s:"hai",g:"offering",pp:"PNP *faqi",cog:[["Māori","whai"]]},"pule#0":{s:"pule",g:"prayer",pp:"PPN *pule",cog:[["Māori","pure"],["Tahitian","pure"],["Sāmoan","pule"]]},"kau#1":{s:"kau",g:"place, hang",pp:"PPN *tau",cog:[["Māori","tautau"],["Sāmoan","tau"],["Tongan","tau"]]},"haka?hakamoa":{s:"hākā",g:"quarrel",pp:"",cog:[]},moa:{s:"moa",g:"fowl, chicken",pp:"PPN *moa",cog:[["Māori","moa"],["Sāmoan","moa"],["Tongan","moa"]]},"haku#0":{s:"haku",g:"master, owner",pp:"PCE *fatu",cog:[["Tahitian","fatu"]]},hale:{s:"hale",g:"house",pp:"PPN *fale",cog:[["Māori","whare"],["Tahitian","fare"],["Sāmoan","fale"]]},"haku#2":{s:"haku",g:"compose, arrange",pp:"PPN *fatu",cog:[["Sāmoan","fatu"],["Tongan","fatu"]]},"mele#0":{s:"mele",g:"song, chant",pp:"PNP *umele",cog:[["Māori","umere"]]},ʻōlelo:{s:"ʻōlelo",g:"speech, word",pp:"PNP *koo-lelo",cog:[["Māori","kōrero"],["Tahitian","ʻōrero"]]},kaua:{s:"kaua",g:"war",pp:"PPN *tau-qa",cog:[["Māori","taua"],["Tahitian","taua"],["Sāmoan","taua"]]},"kaʻa#0":{s:"kaʻa",g:"roll, turn",pp:"PPN *taka",cog:[["Māori","taka"],["Tahitian","taʻa"],["Sāmoan","taʻa"]]},"kia#0":{s:"kia",g:"pillar, mast",pp:"PPN *tia",cog:[["Māori","tia"]]},"lana#0":{s:"lana",g:"floating",pp:"PNP *laŋa",cog:[["Māori","ranga"]]},lewa:{s:"lewa",g:"floating; sky",pp:"PNP *lewa",cog:[["Māori","rewa"],["Tahitian","reva"],["Rapa Nui","reva"]]},lole:{s:"lole",g:"cloth; reversed",pp:"",cog:[]},lāʻau:{s:"lāʻau",g:"tree, wood",pp:"PPN *raqa-kau",cog:[["Māori","rākau"],["Tahitian","rāʻau"],["Tongan","ʻakau"]]},malu:{s:"malu",g:"shade, shelter",pp:"PPN *malu",cog:[["Māori","maru"],["Tahitian","maru"],["Sāmoan","malu"]]},mākaʻi:{s:"mākaʻi",g:"police, inspect",pp:"PPN *maata-ki",cog:[["Māori","mātaki"],["Tahitian","mātaʻitaʻi"]]},piʻo:{s:"piʻo",g:"bent, arched",pp:"PPN *piko",cog:[["Māori","piko"],["Sāmoan","piʻo"],["Tongan","piko"]]},hamo:{s:"hamo",g:"smear, rub on",pp:"",cog:[]},"ʻula#0":{s:"ʻula",g:"red",pp:"PPN *kula",cog:[["Māori","kura"],["Tahitian","ʻura"],["Sāmoan","ʻula"]]},"hana#0":{s:"hana",g:"work, do",pp:"PPN *saŋa",cog:[["Māori","hanga"],["Tahitian","haʻa"],["Tongan","hanga"]]},"mana#0":{s:"mana",g:"power",pp:"PPN *mana",cog:[["Māori","mana"],["Tahitian","mana"],["Sāmoan","mana"]]},hanu:{s:"hanu",g:"breath, breathe",pp:"PPN *faŋu",cog:[["Sāmoan","fagufagu"],["Tongan","fangu"]]},paʻa:{s:"paʻa",g:"firm, solid",pp:"PPN *paka",cog:[["Māori","paka"],["Tahitian","paʻapaʻa"],["Rapa Nui","pakapaka"]]},"waha#0":{s:"waha",g:"mouth",pp:"PCE *waha",cog:[["Māori","waha"],["Tahitian","vaha"]]},"hau#0":{s:"hau",g:"dew, frost",pp:"PPN *sau",cog:[["Tahitian","hau"],["Sāmoan","sau"],["Rapa Nui","hau"]]},"pia#0":{s:"pia",g:"arrowroot, starch",pp:"PPN *pia",cog:[["Tahitian","pia"],["Sāmoan","pia"],["Rapa Nui","pia"]]},ʻeli:{s:"ʻeli",g:"dig",pp:"PPN *keli",cog:[["Māori","keri"],["Sāmoan","ʻeli"],["Tongan","keli"]]},"hau#mood":{s:"hau",g:"temperament",pp:"PPN *sau",cog:[]},ʻoli:{s:"ʻoli",g:"joy",pp:"PPN *koli",cog:[["Tahitian","ʻori"],["Sāmoan","ʻoliʻoli"],["Rapa Nui","kori"]]},hele:{s:"hele",g:"go, walk",pp:"",cog:[["Marquesan","heʻe"]]},"kū#0":{s:"kū",g:"stand",pp:"PPN *tuqu",cog:[["Māori","tū"],["Sāmoan","tū"],["Tahitian","tū"]]},"heʻe#1":{s:"heʻe",g:"slide, slip",pp:"PPN *seke",cog:[["Māori","heke"],["Tahitian","heʻe"],["Sāmoan","seʻe"]]},"nalu#0":{s:"nalu",g:"wave, surf",pp:"PPN *ŋalu",cog:[["Māori","ngaru"],["Sāmoan","galu"],["Tongan","ngalu"]]},"hiki?hikilele":{s:"hiki",g:"startle",pp:"",cog:[]},hiki:{s:"hiki",g:"arrive, appear",pp:"PNP *fiti",cog:[["Māori","whiti"],["Tahitian","hiti"],["Rapa Nui","hiti"]]},hiʻi:{s:"hiʻi",g:"carry in arms",pp:"PPN *siki",cog:[["Māori","hiki"],["Tahitian","hiʻi"],["Sāmoan","siʻi"]]},lani:{s:"lani",g:"sky, heaven",pp:"PPN *laŋi",cog:[["Māori","rangi"],["Tahitian","raʻi"],["Sāmoan","lagi"]]},"poi?hiʻipoi":{s:"poi",g:"to cover, protect, cherish",pp:"",cog:[]},"hoa#0":{s:"hoa",g:"companion, fellow",pp:"PPN *soa",cog:[["Māori","hoa"],["Tahitian","hoa"],["Sāmoan","soa"]]},aloha:{s:"aloha",g:"love, compassion",pp:"PPN *qarofa",cog:[["Māori","aroha"],["Tahitian","aroha"],["Sāmoan","alofa"]]},hanauna:{s:"hanauna",g:"generation, kin",pp:"PNP *fanau-ŋa",cog:[["Māori","whanaunga"],["Tahitian","fanauʻa"]]},hānau:{s:"hānau",g:"birth, born",pp:"PPN *faanau",cog:[["Māori","whānau"],["Tahitian","fānau"],["Sāmoan","fānau"]]},"koa#1":{s:"koa",g:"brave, warrior",pp:"PPN *toqa",cog:[["Māori","toa"],["Tahitian","toa"],["Sāmoan","toa"]]},lawaiʻa:{s:"lawaiʻa",g:"fishing, fisher",pp:"PCE *rawa-ika",cog:[["Tahitian","ravaʻai"]]},paio:{s:"paio",g:"contend, fight",pp:"",cog:[]},ʻai:{s:"ʻai",g:"food, eat",pp:"PPN *kai",cog:[["Māori","kai"],["Tahitian","ʻai"],["Sāmoan","ʻai"]]},hoe:{s:"hoe",g:"paddle",pp:"PPN *fohe",cog:[["Māori","hoe"],["Tahitian","hoe"],["Sāmoan","foe"]]},"uli#1":{s:"uli",g:"steer",pp:"PPN *quli",cog:[["Sāmoan","uli"],["Tongan","ʻuli"]]},"holo#0":{s:"holo",g:"run, sail",pp:"PPN *solo",cog:[["Māori","horo"],["Tahitian","horo"],["Sāmoan","solo"]]},kai:{s:"kai",g:"sea",pp:"PPN *tahi",cog:[["Māori","tai"],["Tahitian","tai"],["Sāmoan","tai"]]},lio:{s:"lio",g:"horse",pp:"",cog:[]},moku:{s:"moku",g:"island, ship",pp:"PPN *motu",cog:[["Māori","motu"],["Tahitian","motu"],["Sāmoan","motu"]]},"holo?holowaʻa":{s:"holo",g:"run, sail, go",pp:"",cog:[]},"holo#bundle":{s:"holo",g:"bundle",pp:"PNP *solo",cog:[]},hope:{s:"hope",g:"behind, last",pp:"PEP *sope",cog:[["Māori","hope"],["Tahitian","hope"],["Rapa Nui","hope"]]},poʻo:{s:"poʻo",g:"head",pp:"",cog:[]},hoʻi:{s:"hoʻi",g:"return",pp:"PPN *foki",cog:[["Māori","hoki"],["Tahitian","hoʻi"],["Sāmoan","foʻi"]]},hua:{s:"hua",g:"fruit, egg",pp:"PPN *fua",cog:[["Māori","hua"],["Sāmoan","fua"],["Tongan","fua"]]},"liʻi#0":{s:"liʻi",g:"small",pp:"PPN *riki",cog:[["Māori","riki"],["Tahitian","riʻi"],["Sāmoan","liʻi"]]},"hua#word":{s:"hua",g:"word, letter",pp:"",cog:[]},hue:{s:"hue",g:"gourd, calabash",pp:"PNP *fue",cog:[["Māori","hue"],["Tahitian","hue"],["Rapa Nui","hue"]]},ʻili:{s:"ʻili",g:"skin, surface",pp:"PPN *kili",cog:[["Māori","kiri"],["Tahitian","ʻiri"],["Tongan","kili"]]},hui:{s:"hui",g:"join, unite",pp:"PPN *fuhi",cog:[["Māori","hui"],["Tahitian","hui"],["Sāmoan","fuifui"]]},"kala#2":{s:"kala",g:"loosen, forgive",pp:"PPN *tala",cog:[["Māori","tara"],["Tahitian","tātara"],["Sāmoan","tala"]]},huki:{s:"huki",g:"pull, draw",pp:"PPN *futi",cog:[["Māori","huti"],["Tahitian","huti"],["Sāmoan","futi"]]},"huli#0":{s:"huli",g:"turn",pp:"PPN *fuli",cog:[["Māori","huri"],["Tahitian","huri"],["Sāmoan","fuli"]]},"lua#0":{s:"lua",g:"two",pp:"PPN *rua",cog:[["Māori","rua"],["Tahitian","rua"],["Sāmoan","lua"]]},"hulu#0":{s:"hulu",g:"feather, hair",pp:"PPN *fulu",cog:[["Sāmoan","fulu"]]},ʻiʻiwi:{s:"ʻiʻiwi",g:"scarlet honeycreeper",pp:"",cog:[]},"huna#0":{s:"huna",g:"fine particle",pp:"",cog:[["Māori","hungahunga"],["Tahitian","huʻa"],["Sāmoan","fugafuga"]]},"hā#2":{s:"hā",g:"leaf stalk",pp:"PPN *faqa",cog:[["Māori","whā"],["Sāmoan","fā"],["Tongan","faʻa"]]},ipu:{s:"ipu",g:"gourd",pp:"PPN *ipu",cog:[["Tahitian","ipu"],["Sāmoan","ipu"],["Tongan","ipu"]]},"kō#0":{s:"kō",g:"sugar cane",pp:"PEP *too",cog:[["Māori","tō"],["Tahitian","tō"]]},hāliʻi:{s:"haliʻi",g:"spread, cover",pp:"PPN *faaliki",cog:[["Māori","whāriki"],["Tahitian","fāriʻi"],["Tongan","faliki"]]},"kuli#1":{s:"kuli",g:"knee",pp:"PPN *turi",cog:[["Māori","turi"],["Sāmoan","tuli"],["Tahitian","turi"]]},"kahi#0":{s:"kahi",g:"one",pp:"PNP *tasi",cog:[["Māori","tahi"],["Tahitian","tahi"],["Sāmoan","tasi"]]},mua:{s:"mua",g:"first, front",pp:"PPN *muqa",cog:[["Māori","mua"],["Tahitian","mua"],["Sāmoan","mua"]]},"niu#0":{s:"niu",g:"coconut",pp:"PPN *niu",cog:[["Māori","niu"],["Tahitian","niu"],["Sāmoan","niu"]]},hōkū:{s:"hōkū",g:"star",pp:"PPN *fetuqu",cog:[["Māori","whetū"],["Sāmoan","fetū"],["Tongan","fetuʻu"]]},"ao#0":{s:"ao",g:"daylight, light",pp:"PPN *qaho",cog:[["Māori","ao"],["Tahitian","ao"],["Sāmoan","ao"]]},"naʻi#0":{s:"naʻi",g:"conquer",pp:"PCE *ŋaki",cog:[["Māori","ngaki"]]},ʻaeʻa:{s:"ʻaeʻa",g:"wandering",pp:"",cog:[]},"hū#0":{s:"hū",g:"rise, overflow",pp:"",cog:[]},"puna#0":{s:"puna",g:"spring",pp:"PPN *puna",cog:[["Māori","puna"],["Sāmoan","puna"],["Rapa Nui","puna"]]},iwi:{s:"iwi",g:"bone",pp:"PNP *iwi",cog:[["Māori","iwi"],["Tahitian","ivi"],["Sāmoan","ivi"]]},pona:{s:"pona",g:"joint, node",pp:"PPN *pona",cog:[["Māori","pona"],["Tahitian","pona"],["Sāmoan","pona"]]},"kaha#1":{s:"kaha",g:"place",pp:"PPN *tafa",cog:[["Māori","taha"],["Tahitian","taha"],["Sāmoan","tafa"]]},one:{s:"one",g:"sand",pp:"PPN *qone",cog:[["Māori","one"],["Tahitian","one"],["Sāmoan","oneone"]]},"kaha#0":{s:"kaha",g:"mark, line",pp:"PPN *tafa",cog:[["Sāmoan","tafa"],["Tongan","tafa"]]},pili:{s:"pili",g:"cling, join",pp:"PPN *pili",cog:[["Māori","piri"],["Tahitian","piri"],["Rapa Nui","piri"]]},pōʻai:{s:"pōʻai",g:"circle, encircle",pp:"PPN *pookai",cog:[["Māori","pōkai"],["Tahitian","pōʻai"]]},"kaha?kahawai":{s:"kaha",g:"to cut, mark; a place",pp:"",cog:[]},kahua:{s:"kahua",g:"foundation",pp:"PEP *tafuqa",cog:[["Māori","tahua"],["Tahitian","tahua"],["Marquesan","tohua"]]},"kahu#0":{s:"kahu",g:"keeper",pp:"PPN *tafu",cog:[["Māori","tahu"],["Tahitian","tahu"],["Sāmoan","tafu"]]},ahi:{s:"ahi",g:"fire",pp:"PPN *afi",cog:[["Māori","ahi"],["Tahitian","ahi"],["Sāmoan","afi"]]},akua:{s:"akua",g:"god, spirit",pp:"PPN *qatua",cog:[["Māori","atua"],["Tahitian","atua"],["Sāmoan","atua"]]},ea:{s:"ea",g:"rise; breath, air",pp:"PPN *eqa",cog:[["Māori","ea"],["Sāmoan","ea"],["Tongan","eʻa"]]},eʻe:{s:"eʻe",g:"climb on, board",pp:"PPN *heke",cog:[["Māori","eke"],["Tahitian","eʻe"],["Sāmoan","eʻe"]]},malolo:{s:"malolo",g:"ebbing, low",pp:"PPN *malolo",cog:[["Māori","maroro"],["Tongan","malolo"]]},"ʻau#1":{s:"ʻau",g:"swim",pp:"PPN *kau",cog:[["Māori","kau"],["Tahitian","ʻau"],["Rapa Nui","kau"]]},"kaka?kakaʻōlelo":{s:"kākā",g:"to strike, to fence",pp:"",cog:[]},"hala#0":{s:"hala",g:"fault, offense",pp:"PPN *sala",cog:[["Māori","hara"],["Tahitian","hara"],["Sāmoan","sala"]]},"kala#gable":{s:"kala",g:"gable end",pp:"PPN *tara",cog:[["Tahitian","tara"],["Sāmoan","tala"]]},kanaka:{s:"kanaka",g:"person",pp:"PPN *taŋata",cog:[["Māori","tangata"],["Tahitian","taʻata"],["Sāmoan","tagata"]]},makua:{s:"makua",g:"parent; mature",pp:"PPN *matuqa",cog:[["Māori","matua"],["Tahitian","metua"],["Sāmoan","matua"]]},kani:{s:"kani",g:"sound",pp:"PPN *taŋi",cog:[["Māori","tangi"],["Tahitian","taʻi"],["Sāmoan","tagi"]]},"kau#2":{s:"kau",g:"chant",pp:"",cog:[]},wāwae:{s:"wāwae",g:"leg, foot",pp:"PPN *waqe",cog:[["Māori","waewae"],["Tahitian","ʻāvae"],["Sāmoan","vae"]]},kapa:{s:"kapa",g:"bark cloth; edge",pp:"PPN *tapa",cog:[["Tahitian","tapa"],["Tongan","tapa"],["Rapa Nui","tapa"]]},komo:{s:"komo",g:"enter",pp:"PPN *tomo",cog:[["Māori","tomo"],["Tahitian","tomo"],["Sāmoan","tomo"]]},"kau?kaukahi":{s:"kau",g:"group of",pp:"PPN *tau-",cog:[]},kānāwai:{s:"kānāwai",g:"law",pp:"",cog:[]},kaula:{s:"kaula",g:"rope",pp:"PPN *taura",cog:[["Māori","taura"],["Tahitian","taura"],["Tongan","toua"]]},lei:{s:"lei",g:"garland",pp:"PPN *lei",cog:[["Māori","rei"],["Sāmoan","lei"],["Tahitian","rei"]]},like:{s:"like",g:"alike",pp:"PEP *rite",cog:[["Māori","rite"],["Rapa Nui","rite"]]},"kau?kaulua":{s:"kau",g:"group of",pp:"PPN *tau-",cog:[]},"kau?kaupale":{s:"kau",g:"to place, set, put",pp:"",cog:[]},"pale?kaupale":{s:"pale",g:"to ward off, fend off",pp:"",cog:[]},lalo:{s:"lalo",g:"below, down",pp:"PPN *lalo",cog:[["Māori","raro"],["Tahitian","raro"],["Sāmoan","lalo"]]},"luna?kaʻaluna":{s:"luna",g:"above, upper; one in command",pp:"",cog:[]},keiki:{s:"keiki",g:"child",pp:"PCE *ta-iti",cog:[["Marquesan","toiti"]]},kāne:{s:"kāne",g:"male, man",pp:"PPN *taqane",cog:[["Māori","tāne"],["Sāmoan","tāne"],["Tahitian","tāne"]]},"papa#0":{s:"papa",g:"flat surface, layer",pp:"PPN *papa",cog:[["Māori","papa"],["Tahitian","papa"],["Sāmoan","papa"]]},kolu:{s:"kolu",g:"three",pp:"PPN *tolu",cog:[["Māori","toru"],["Tahitian","toru"],["Sāmoan","tolu"]]},kiaʻi:{s:"kiaʻi",g:"guard, watch",pp:"PEP *tiaki",cog:[["Māori","tiaki"],["Tahitian","tīaʻi"],["Rapa Nui","tiaki"]]},puka:{s:"puka",g:"hole, opening",pp:"PPN *puta",cog:[["Māori","puta"],["Tahitian","puta"],["Marquesan","puta"]]},pō:{s:"pō",g:"night, darkness",pp:"PPN *poo",cog:[["Māori","pō"],["Tahitian","pō"],["Sāmoan","pō"]]},kiko:{s:"kiko",g:"dot, point",pp:"PEP *tito",cog:[["Tahitian","tito"],["Rapa Nui","tito"],["Marquesan","tito"]]},"lā#1":{s:"lā",g:"sun; day",pp:"PPN *laqaa",cog:[["Māori","rā"],["Tahitian","rā"],["Sāmoan","lā"]]},nīnau:{s:"nīnau",g:"question, ask",pp:"",cog:[]},kilo:{s:"kilo",g:"watch, observe",pp:"PPN *tiro",cog:[["Māori","tiro"],["Sāmoan","tilo"],["Tongan","sio"]]},"heʻe#0":{s:"heʻe",g:"octopus",pp:"PPN *feke",cog:[["Māori","wheke"],["Tahitian","feʻe"],["Sāmoan","feʻe"]]},kino:{s:"kino",g:"body",pp:"PPN *tino",cog:[["Māori","tino"],["Tahitian","tino"],["Sāmoan","tino"]]},wailua:{s:"wailua",g:"spirit, ghost",pp:"PEP *wai-rua",cog:[["Māori","wairua"],["Tahitian","vārua"]]},"kipi#0":{s:"kipi",g:"dig",pp:"PPN *tipi",cog:[["Māori","tipi"],["Tahitian","tipi"],["Sāmoan","tipi"]]},"kua#1":{s:"kua",g:"hew, chop",pp:"PNP *tua",cog:[["Māori","tua"],["Marquesan","tua"]]},"kiʻi#0":{s:"kiʻi",g:"image, picture",pp:"PCE *tiki",cog:[["Māori","tiki"],["Tahitian","tiʻi"]]},palapala:{s:"palapala",g:"writing, print",pp:"",cog:[]},pōhaku:{s:"pōhaku",g:"stone",pp:"PCE *poo-fatu",cog:[["Māori","pōhatu"]]},koʻi:{s:"koʻi",g:"adze, axe",pp:"PPN *toki",cog:[["Māori","toki"],["Tahitian","toʻi"],["Sāmoan","toʻi"]]},"kahi#1":{s:"kahi",g:"scrape, shave",pp:"PPN *tasi",cog:[["Māori","tahi"],["Rapa Nui","tahitahi"]]},lipi:{s:"lipi",g:"blade, edge",pp:"PPN *lipi",cog:[["Māori","ripi"],["Tongan","lipi"]]},"kua?kuahao":{s:"kua",g:"anvil, beating block",pp:"",cog:[]},"kua#0":{s:"kua",g:"back",pp:"PPN *tuqa",cog:[["Māori","tua"],["Tahitian","tua"],["Sāmoan","tua"]]},mauna:{s:"mauna",g:"mountain",pp:"PPN *maquŋa",cog:[["Māori","maunga"],["Sāmoan","mauga"],["Tongan","moʻunga"]]},moʻo:{s:"moʻo",g:"lizard",pp:"PPN *moko",cog:[["Māori","moko"],["Tahitian","moʻo"],["Sāmoan","moʻo"]]},puʻu:{s:"puʻu",g:"hill, lump",pp:"PPN *puku",cog:[["Māori","puku"],["Tahitian","puʻu"],["Rapa Nui","puku"]]},kuene:{s:"kuene",g:"lay out, arrange",pp:"",cog:[]},"kuhi#1":{s:"kuhi",g:"suppose",pp:"",cog:[]},hewa:{s:"hewa",g:"wrong, error",pp:"PPN *sewa",cog:[["Māori","hewa"],["Tongan","heva"],["Rapa Nui","heva"]]},"kui?kuilua":{s:"kuʻi",g:"add on",pp:"",cog:[]},"kuli#0":{s:"kuli",g:"deaf",pp:"PPN *tuli",cog:[["Māori","turi"],["Sāmoan","tuli"],["Tahitian","turi"]]},hiamoe:{s:"hiamoe",g:"sleep",pp:"PPN *fia-mohe",cog:[["Māori","hiamoe"],["Sāmoan","fiamoe"],["Tongan","fiemohe"]]},kumu:{s:"kumu",g:"base, source",pp:"PEP *tumu",cog:[["Māori","tumu"],["Tahitian","tumu"],["Rapa Nui","tumu"]]},"lau#0":{s:"lau",g:"leaf",pp:"PPN *lau",cog:[["Māori","rau"],["Sāmoan","lau"],["Tahitian","rau"]]},kupuna:{s:"kupuna",g:"grandparent, ancestor",pp:"PPN *tupuna",cog:[["Māori","tupuna"],["Rapa Nui","tupuna"],["Marquesan","tupuna"]]},"kuʻi#0":{s:"kuʻi",g:"pound, strike",pp:"PPN *tuki",cog:[["Māori","tuki"],["Tahitian","tui"],["Sāmoan","tuʻi"]]},"kuʻi#1":{s:"kuʻi",g:"join, unite",pp:"",cog:[]},kālai:{s:"kālai",g:"carve, hew",pp:"PPN *talai",cog:[["Māori","tārai"],["Sāmoan","talai"],["Tahitian","tarai"]]},"kā#0":{s:"kā",g:"strike, hit",pp:"PPN *taa",cog:[["Sāmoan","tā"],["Tongan","tā"]]},kāmaʻa:{s:"kāmaʻa",g:"sandal, shoe",pp:"PCE *taamaka",cog:[["Māori","tāmaka"],["Tahitian","tamaʻa"]]},make:{s:"make",g:"die; want",pp:"PPN *mate",cog:[["Māori","mate"],["Tahitian","mate"],["Sāmoan","mate"]]},kāwili:{s:"kāwili",g:"snare",pp:"PPN *taa-wili",cog:[["Māori","tāwiri"],["Tahitian","tāviri"],["Tongan","tāvilivili"]]},manu:{s:"manu",g:"bird",pp:"PPN *manu",cog:[["Māori","manu"],["Tahitian","manu"],["Sāmoan","manu"]]},kē:{s:"kē",g:"refuse",pp:"",cog:[["Sāmoan","lē"]]},"kōhi#0":{s:"kōhi",g:"dig, split off",pp:"",cog:[]},kea:{s:"kea",g:"white",pp:"PPN *tea",cog:[["Māori","tea"],["Tahitian","tea"],["Tongan","tea"]]},emi:{s:"emi",g:"draw back, recede",pp:"",cog:[]},"kū?kūhewa":{s:"kū",g:"be hit",pp:"",cog:[]},"kaha?kūkaha":{s:"kaha",g:"to turn aside, turn away",pp:"",cog:[]},"kala#1":{s:"kala",g:"proclaim",pp:"PPN *tala",cog:[["Māori","tara"],["Sāmoan","tala"],["Tongan","tala"]]},"kūkulu#0":{s:"kūkulu",g:"pillar; to build",pp:"PNP *tulu-tulu",cog:[["Māori","turuturu"],["Tahitian","turuturu"],["Rapa Nui","turuturu"]]},hema:{s:"hema",g:"left",pp:"PPN *sema",cog:[["Māori","hema"],["Tongan","hema"]]},lehu:{s:"lehu",g:"ashes",pp:"PPN *refu",cog:[["Tahitian","rehu"],["Sāmoan","lefu"],["Tongan","efuefu"]]},"kū?kūloko":{s:"kū",g:"belonging to",pp:"",cog:[]},loko:{s:"loko",g:"inside; pond",pp:"PPN *loto",cog:[["Māori","roto"],["Tahitian","roto"],["Sāmoan","loto"]]},kūlou:{s:"kūlou",g:"bow the head",pp:"PPN *tuulou",cog:[["Sāmoan","tulou"],["Tongan","tulou"]]},lālā:{s:"lālā",g:"branch",pp:"PPN *raqa-raqa",cog:[["Māori","rārā"],["Sāmoan","lālā"],["Tongan","vaʻavaʻa"]]},"kū?kūmaka":{s:"kū",g:"be hit",pp:"",cog:[]},"maka#0":{s:"maka",g:"eye, face",pp:"PPN *mata",cog:[["Māori","mata"],["Tahitian","mata"],["Sāmoan","mata"]]},nihi:{s:"nihi",g:"edge",pp:"PPN *nifi",cog:[["Māori","ninihi"],["Rapa Nui","nihi"],["Marquesan","nihinihi"]]},"nānā#1":{s:"nānā",g:"look, watch",pp:"PCE *naa-naa",cog:[["Māori","nānā"],["Tahitian","nānā"]]},ola:{s:"ola",g:"life, health",pp:"PPN *ola",cog:[["Māori","ora"],["Tahitian","ora"],["Sāmoan","ola"]]},pono:{s:"pono",g:"right, proper",pp:"PCE *pono",cog:[["Māori","pono"],["Marquesan","pono"]]},"kū?kūʻau":{s:"kū",g:"to stand",pp:"",cog:[]},"ʻau#0":{s:"ʻau",g:"handle, staff",pp:"PPN *kau",cog:[["Māori","kau"],["Sāmoan","ʻau"],["Tongan","kau"]]},"kū?kūʻauhau":{s:"kū",g:"to stand",pp:"",cog:[]},ʻauhau:{s:"ʻauhau",g:"tax, tribute",pp:"PCE *kaufau",cog:[["Māori","kauwhau"],["Tahitian","ʻaufau"]]},"ʻē#1":{s:"ʻē",g:"different",pp:"PPN *kehe",cog:[["Māori","kē"],["Tahitian","ʻē"],["Tongan","kehe"]]},"lae#0":{s:"lae",g:"brow, headland",pp:"PPN *laqe",cog:[["Māori","rae"],["Tahitian","rae"],["Sāmoan","lae"]]},"hala#1":{s:"hala",g:"pandanus",pp:"PPN *fara",cog:[["Tahitian","fara"],["Sāmoan","fala"],["Tongan","fā"]]},"lau#1":{s:"lau",g:"many",pp:"PPN *lau",cog:[["Māori","rau"],["Tahitian","rau"],["Tongan","lau"]]},"koa#0":{s:"koa",g:"koa tree",pp:"PPN *toa",cog:[["Tahitian","toa"],["Sāmoan","toa"],["Tongan","toa"]]},"kī#0":{s:"kī",g:"ti plant",pp:"PPN *tii",cog:[["Māori","tī"],["Sāmoan","tī"],["Tahitian","tī"]]},"lama#0":{s:"lama",g:"torch",pp:"PPN *rama",cog:[["Māori","rama"],["Sāmoan","lama"],["Tahitian","rama"]]},lima:{s:"lima",g:"hand",pp:"PPN *lima",cog:[["Tahitian","rima"],["Sāmoan","lima"],["Tongan","nima"]]},"lau#broad":{s:"lau",g:"breadth, expanse",pp:"PPN *lau",cog:[["Sāmoan","lau"]]},wili:{s:"wili",g:"twist, turn",pp:"PPN *wili",cog:[["Māori","wiri"],["Tahitian","viri"],["Sāmoan","vili"]]},ʻulu:{s:"ʻulu",g:"breadfruit",pp:"PPN *kulu",cog:[["Māori","kuru"],["Tahitian","ʻuru"],["Sāmoan","ʻulu"]]},"lawa#bind":{s:"lawa",g:"bind fast",pp:"PPN *lawa",cog:[["Tongan","lalava"]]},lawe:{s:"lawe",g:"take, carry",pp:"PPN *lawe",cog:[["Māori","rarawe"],["Tahitian","rave"],["Tongan","lave"]]},"laʻa#season":{s:"laʻa",g:"season",pp:"",cog:[]},"ulu#0":{s:"ulu",g:"grow, growth",pp:"",cog:[]},leo:{s:"leo",g:"voice",pp:"PPN *leqo",cog:[["Māori","reo"],["Sāmoan","leo"],["Tahitian","reo"]]},"kuhi#0":{s:"kuhi",g:"point",pp:"PPN *tusu",cog:[["Māori","tuhi"],["Sāmoan","tusi"],["Tongan","tuhu"]]},ʻākau:{s:"ʻākau",g:"right side",pp:"PCE *katau",cog:[["Māori","katau"],["Tahitian","ʻatau"]]},maikaʻi:{s:"maikaʻi",g:"good",pp:"PEP *maqitaki",cog:[["Māori","maitai"],["Tahitian","maitaʻi"]]},ʻino:{s:"ʻino",g:"bad",pp:"PPN *kino",cog:[["Māori","kino"],["Tahitian","ʻino"],["Rapa Nui","kino"]]},uila:{s:"uila",g:"lightning",pp:"PPN *quhila",cog:[["Māori","uira"],["Tahitian","uira"],["Sāmoan","uila"]]},"lua#1":{s:"lua",g:"pit, hole",pp:"PPN *lua",cog:[["Māori","rua"],["Tahitian","rua"],["Sāmoan","lua"]]},pele:{s:"pele",g:"lava, volcano",pp:"",cog:[]},"luna#1":{s:"luna",g:"overseer, officer",pp:"",cog:[]},kahiko:{s:"kahiko",g:"old",pp:"PCE *tafito",cog:[["Māori","tawhito"],["Tahitian","tahito"]]},"ʻohana#0":{s:"ʻohana",g:"family",pp:"PCE *koo-faŋa",cog:[["Māori","kōhanga"],["Tahitian","ʻōfaʻa"]]},lāhui:{s:"lāhui",g:"people, assembly",pp:"PPN *lafu",cog:[["Sāmoan","lafu"]]},mahi:{s:"mahi",g:"cultivate; strong",pp:"PPN *mafi",cog:[["Māori","mahi"],["Tongan","mafi"],["Rapa Nui","mahi"]]},"ala?makaala":{s:"ʻala",g:"",pp:"",cog:[]},luku:{s:"luku",g:"destroy",pp:"PEP *rutu",cog:[["Māori","rutu"],["Tahitian","rutu"],["Rapa Nui","rutu"]]},momi:{s:"momi",g:"pearl",pp:"",cog:[]},nahele:{s:"nahele",g:"forest, the wild",pp:"PCE *ŋasere",cog:[["Māori","ngahere"],["Tahitian","ʻaihere"]]},pouli:{s:"pōuli",g:"dark, darkness",pp:"PPN *poo-quli",cog:[["Māori","pōuri"],["Tahitian","pōuri"],["Tongan","poʻuli"]]},"make?makehewa":{s:"make",g:"exchange",pp:"",cog:[]},"liʻi#1":{s:"liʻi",g:"chief",pp:"",cog:[]},manawa:{s:"manawa",g:"disposition",pp:"",cog:[]},"ʻiʻo#0":{s:"ʻiʻo",g:"true, genuine",pp:"PPN *kiko",cog:[["Māori","kiko"],["Tahitian","ʻiʻo"],["Sāmoan","ʻiʻo"]]},ihu:{s:"ihu",g:"nose, prow",pp:"PPN *isu",cog:[["Māori","ihu"],["Tahitian","ihu"],["Sāmoan","isu"]]},maʻa:{s:"maʻa",g:"accustomed",pp:"",cog:[]},lahi:{s:"lahi",g:"thin, delicate",pp:"PNP *lafi",cog:[["Māori","rahirahi"],["Tahitian","rahirahi"]]},maʻawe:{s:"maʻawe",g:"strand; track",pp:"PNP *ma-kawe",cog:[["Māori","makawe"],["Sāmoan","maʻave"]]},"moana#0":{s:"moana",g:"ocean, open sea",pp:"PPN *moana",cog:[["Māori","moana"],["Tahitian","moana"],["Sāmoan","moana"]]},ʻuhane:{s:"ʻuhane",g:"soul, spirit",pp:"PEP *kuhane",cog:[["Rapa Nui","kuhane"],["Marquesan","kuhane"]]},"honua#0":{s:"honua",g:"land, earth",pp:"PNP *fenua",cog:[["Māori","whenua"],["Tahitian","fenua"],["Rapa Nui","henua"]]},luʻu:{s:"luʻu",g:"dive",pp:"PPN *ruku",cog:[["Māori","ruku"],["Tongan","uku"],["Rapa Nui","ruku"]]},māhu:{s:"māhu",g:"steam",pp:"PNP *ma-qafu",cog:[["Māori","māhu"],["Sāmoan","māfu"]]},mona:{s:"mona",g:"fat",pp:"",cog:[]},moʻa:{s:"moʻa",g:"cooked",pp:"PPN *maqoha",cog:[["Māori","maoa"],["Tahitian","maoa"]]},"maka#1":{s:"maka",g:"raw",pp:"PPN *mata",cog:[["Māori","mata"],["Sāmoan","mata"],["Tongan","mata"]]},"moʻo#line":{s:"moʻo",g:"line, succession",pp:"",cog:[]},kūʻauhau:{s:"kūʻauhau",g:"genealogy",pp:"PCE *kaufau",cog:[["Māori","kauwhau"]]},muli:{s:"muli",g:"last, after",pp:"PPN *muri",cog:[["Māori","muri"],["Tahitian","muri"],["Sāmoan","muli"]]},naʻau:{s:"naʻau",g:"mind, heart",pp:"PPN *ŋaakau",cog:[["Māori","ngākau"],["Tahitian","ʻāʻau"],["Tongan","ngākau"]]},noho:{s:"noho",g:"sit, dwell",pp:"PPN *nofo",cog:[["Māori","noho"],["Tahitian","noho"],["Sāmoan","nofo"]]},"nuku#0":{s:"nuku",g:"mouth, beak",pp:"PPN *ŋutu",cog:[["Māori","ngutu"],["Tahitian","ʻutu"],["Sāmoan","gutu"]]},"olo?olokaʻa":{s:"ʻolo",g:"to rub, saw back and forth",pp:"",cog:[]},omo:{s:"omo",g:"suck",pp:"PEP *qomo",cog:[["Māori","omo"],["Marquesan","omo"]]},liu:{s:"liu",g:"bilge water",pp:"PPN *liu",cog:[["Māori","riu"],["Tahitian","riu"],["Sāmoan","liu"]]},"ʻā#0":{s:"ʻā",g:"burning, fire",pp:"PPN *kaha",cog:[["Māori","kā"],["Tahitian","ʻā"],["Rapa Nui","kā"]]},"pahu#0":{s:"pahu",g:"drum, box",pp:"PCE *pasu",cog:[["Māori","pahū"],["Tahitian","pahu"],["Marquesan","pahu"]]},"pahu?pahukapu":{s:"pahu",g:"post, stake",pp:"",cog:[]},"kapu#0":{s:"kapu",g:"sacred, forbidden",pp:"PPN *tapu",cog:[["Māori","tapu"],["Tahitian","tapu"],["Sāmoan","tapu"]]},"paka#4":{s:"paka",g:"raindrop, patter",pp:"PPN *pata",cog:[["Māori","pata"],["Marquesan","pata"]]},"palai#avert":{s:"palai",g:"turn away",pp:"",cog:[]},"pale#1":{s:"pale",g:"ward off, defend",pp:"PPN *pale",cog:[["Māori","pare"],["Tahitian","pare"],["Tongan","pale"]]},"pale#0":{s:"pale",g:"covering",pp:"PPN *pale",cog:[["Māori","pare"],["Tongan","pale"]]},"uhi#1":{s:"uhi",g:"cover, covering",pp:"PPN *qufi",cog:[["Māori","uwhi"],["Sāmoan","ufi"],["Tongan","ʻufiʻufi"]]},pana:{s:"pana",g:"shoot, flick",pp:"PPN *pana",cog:[["Māori","pana"],["Tahitian","pana"],["Marquesan","pana"]]},pua:{s:"pua",g:"flower, arrow",pp:"PEP *pua",cog:[["Māori","pua"],["Tahitian","pua"],["Rapa Nui","pua"]]},"pane#head":{s:"pane",g:"back of head",pp:"PPN *pane",cog:[["Māori","pane"],["Marquesan","pane"]]},pani:{s:"pani",g:"close, stopper",pp:"PCE *pani",cog:[["Māori","pani"],["Tahitian","pani"]]},"pū#1":{s:"pū",g:"conch, gun",pp:"PPN *puu",cog:[["Māori","pū"],["Tahitian","pū"],["Sāmoan","pū"]]},"hola#0":{s:"hola",g:"spread",pp:"PPN *fola",cog:[["Māori","hora"],["Sāmoan","fola"],["Tongan","fola"]]},"mū#2":{s:"mū",g:"kōnane, checkers",pp:"",cog:[]},pāʻina:{s:"pāʻina",g:"meal",pp:"",cog:[]},"ʻaina#0":{s:"ʻaina",g:"meal",pp:"PNP *kai-ŋa",cog:[["Sāmoan","ʻaiga"],["Rapa Nui","kainga"],["Marquesan","kaika"]]},pau:{s:"pau",g:"finished, used up",pp:"PNP *pau",cog:[["Māori","pau"],["Tahitian","pau"],["Sāmoan","pau"]]},kāhili:{s:"kāhili",g:"feather standard",pp:"PCE *taafiri",cog:[["Māori","tāwhiri"],["Tahitian","tāhiri"]]},"luhi#0":{s:"luhi",g:"weary",pp:"PCE *rufi",cog:[["Māori","ruhi"]]},"pū?paʻapū":{s:"pū",g:"together, entirely",pp:"",cog:[]},"paʻi?paʻiaʻa":{s:"paʻi",g:"to slap, print, bunch",pp:"",cog:[]},paʻi:{s:"paʻi",g:"strike, print",pp:"PPN *paki",cog:[["Māori","papaki"],["Sāmoan","paʻi"],["Tongan","paki"]]},"paʻi?paʻiʻai":{s:"paʻi",g:"bundle",pp:"",cog:[]},piha:{s:"piha",g:"full",pp:"",cog:[]},"pipi#seep":{s:"pīpī",g:"seep, sprinkle",pp:"",cog:[]},"hina#0":{s:"hina",g:"gray-haired",pp:"PPN *sina",cog:[["Māori","hina"],["Tahitian","hinahina"],["Rapa Nui","hina"]]},kepa:{s:"kepa",g:"sideways",pp:"PPN *tepa",cog:[["Sāmoan","tepa"],["Tongan","tepa"]]},"kala#0":{s:"kala",g:"thorn, spike",pp:"PPN *tala",cog:[["Māori","tara"],["Tahitian","tara"],["Tongan","tala"]]},makani:{s:"makani",g:"wind",pp:"PPN *mataŋi",cog:[["Māori","matangi"],["Tahitian","mataʻi"],["Sāmoan","matagi"]]},"pā#0":{s:"pā",g:"fence, wall",pp:"PPN *paa",cog:[["Tahitian","pā"],["Sāmoan","pā"],["Tongan","pā"]]},"pā#4":{s:"pā",g:"touch, reach",pp:"PPN *paa",cog:[["Māori","pā"],["Tahitian","pā"]]},"nini#1":{s:"nini",g:"stone fence",pp:"",cog:[]},pāpale:{s:"pāpale",g:"hat",pp:"",cog:[]},"pī#sprinkle":{s:"pī",g:"sprinkle",pp:"",cog:[]},lōʻihi:{s:"lōʻihi",g:"long",pp:"",cog:[]},ʻaono:{s:"ʻaono",g:"six",pp:"",cog:[]},ʻele:{s:"ʻele",g:"dark, black",pp:"PEP *kele",cog:[["Māori","kere"],["Tahitian","ʻereʻere"],["Rapa Nui","kerekere"]]},wehi:{s:"wehi",g:"decoration",pp:"",cog:[]},hoʻoluʻu:{s:"hoʻoluʻu",g:"dip, dye",pp:"",cog:[]},ua:{s:"ua",g:"rain",pp:"PPN *quha",cog:[["Māori","ua"],["Tahitian","ua"],["Sāmoan","ua"]]},"ū#0":{s:"ū",g:"breast",pp:"PPN *huhu",cog:[["Māori","ū"],["Tahitian","ū"],["Sāmoan","susu"]]},"pā#plate":{s:"pā",g:"board, plate",pp:"PPN *paa",cog:[["Sāmoan","pā"]]},"ʻaha#0":{s:"ʻaha",g:"assembly, gathering",pp:"",cog:[]},ʻahu:{s:"ʻahu",g:"garment, covering",pp:"PPN *kafu",cog:[["Māori","kahu"],["Tahitian","ʻahu"],["Sāmoan","ʻafu"]]},"ao?ʻahuao":{s:"ao",g:"young leaf",pp:"",cog:[]},inu:{s:"inu",g:"drink",pp:"PPN *inu",cog:[["Māori","inu"],["Tahitian","inu"],["Sāmoan","inu"]]},ʻahā:{s:"ʻahā",g:"four",pp:"",cog:[]},alo:{s:"alo",g:"front, presence",pp:"PPN *qaro",cog:[["Tahitian","aro"]]},ʻauina:{s:"ʻauina",g:"decline, slope",pp:"",cog:[]},"ʻau?ʻaumakua":{s:"ʻau",g:"group, company",pp:"",cog:[]},"ʻau?ʻauwai":{s:"ʻau",g:"current, flow",pp:"",cog:[]},"ʻaʻa#0":{s:"ʻaʻa",g:"sheath, bag",pp:"PPN *kaka",cog:[["Māori","kaka"],["Tahitian","ʻaʻa"],["Sāmoan","ʻaʻa"]]},ʻike:{s:"ʻike",g:"knowledge",pp:"PPN *kite",cog:[["Māori","kite"],["Tahitian","ʻite"]]},ʻohā:{s:"ʻohā",g:"taro offshoot",pp:"",cog:[]},kulaʻi:{s:"kulaʻi",g:"push over",pp:"PPN *tulaki",cog:[["Māori","turaki"],["Tahitian","turaʻi"],["Tongan","tulaki"]]},ʻoi:{s:"ʻoi",g:"main, foremost",pp:"PCE *koi",cog:[["Māori","koi"],["Tahitian","ʻoi"],["Marquesan","koi"]]},ʻuala:{s:"ʻuala",g:"sweet potato",pp:"PPN *kumala",cog:[["Māori","kūmara"],["Sāmoan","ʻumala"],["Tongan","kumala"]]},"kahiki#0":{s:"kahiki",g:"foreign land",pp:"PCE *tafiti",cog:[["Māori","tawhiti"],["Tahitian","tahiti"],["Sāmoan","tahiti"]]},"ʻuku#0":{s:"ʻuku",g:"louse, flea",pp:"PPN *kutu",cog:[["Māori","kutu"],["Tahitian","ʻutu"],["Sāmoan","ʻutu"]]},aʻo:{s:"aʻo",g:"teach, learn",pp:"PPN *ako",cog:[["Māori","ako"],["Tahitian","aʻo"],["Sāmoan","aʻo"]]},ʻōpū:{s:"ʻōpū",g:"belly",pp:"",cog:[["Māori","kōpū"],["Tahitian","ʻōpū"],["Rapa Nui","kōpū"]]},ahe:{s:"ahe",g:"light breeze",pp:"PNP *afe",cog:[["Māori","awhe"]]},"aka#bright":{s:"aka",g:"bright, clear",pp:"",cog:[]},ani:{s:"ani",g:"blow softly",pp:"PPN *aŋi",cog:[["Māori","āngi"],["Sāmoan","agi"],["Tongan","angi"]]},anu:{s:"anu",g:"cold",pp:"PNP *qanu",cog:[["Māori","anu"],["Tahitian","anu"],["Marquesan","anu"]]},"haka#1":{s:"haka",g:"gap, opening",pp:"PNP *fata",cog:[["Rapa Nui","hata"],["Tahitian","fatafata"],["Marquesan","hatahata"]]},"haku#1":{s:"haku",g:"lump, stone",pp:"PPN *fatu",cog:[["Māori","whatu"],["Sāmoan","fatu"],["Rapa Nui","hatu"]]},"hana#1":{s:"hana",g:"warm, hot",pp:"PPN *fana",cog:[["Māori","hana"],["Rapa Nui","hana"]]},"hano#0":{s:"hano",g:"glorious, honored",pp:"",cog:[]},haʻa:{s:"haʻa",g:"low, short",pp:"PNP *saka",cog:[["Māori","hakahaka"],["Sāmoan","saʻa"],["Tahitian","haʻa"]]},haʻi:{s:"haʻi",g:"break",pp:"",cog:[]},"hea#0":{s:"hea",g:"call",pp:"PPN *seqa",cog:[["Tongan","heʻaki"]]},"helu#0":{s:"helu",g:"count",pp:"",cog:[]},hene:{s:"hene",g:"snicker, laugh",pp:"",cog:[]},hinu:{s:"hinu",g:"oil; lustrous",pp:"PPN *sinu",cog:[["Māori","hinu"],["Tahitian","hinu"],["Marquesan","hinu"]]},hiʻu:{s:"hiʻu",g:"tail, end",pp:"PCE *siku",cog:[["Māori","hiku"],["Tahitian","hiʻu"],["Marquesan","hiku"]]},hopo:{s:"hopo",g:"fear",pp:"PPN *sopo",cog:[["Māori","hopo"],["Marquesan","hopo"]]},humu:{s:"humu",g:"sew",pp:"PNP *sumu",cog:[["Marquesan","humu"]]},huʻa:{s:"huʻa",g:"foam",pp:"PNP *fuka",cog:[["Māori","huka"],["Tahitian","huʻa"]]},"huʻi#cold":{s:"huʻi",g:"cold",pp:"",cog:[]},"ihe#fish":{s:"ihe",g:"halfbeak",pp:"PPN *ise",cog:[["Māori","ihe"],["Sāmoan","ise"],["Tahitian","ihe"]]},"iho#0":{s:"iho",g:"core, pith",pp:"PCE *iso",cog:[["Māori","iho"],["Tahitian","iho"]]},ika:{s:"ika",g:"strong",pp:"PPN *kita",cog:[["Māori","kita"]]},keʻo:{s:"keʻo",g:"white, clear",pp:"PMQ *teko",cog:[["Marquesan","teko"]]},kihi:{s:"kihi",g:"corner, tip",pp:"PNP *tifi",cog:[["Māori","tihi"]]},"kila#0":{s:"kila",g:"high place",pp:"PPN *tila",cog:[["Māori","tira"],["Tahitian","tira"],["Sāmoan","tila"]]},kiʻe:{s:"kiʻe",g:"high, lofty",pp:"",cog:[["Māori","tiketike"],["Marquesan","tiketike"]]},kolo:{s:"kolo",g:"creep, crawl",pp:"PPN *tolo",cog:[["Māori","toro"],["Tahitian","toro"],["Sāmoan","tolo"]]},"kona#1":{s:"kona",g:"bump",pp:"",cog:[]},konā:{s:"konā",g:"contemptuous, brusque",pp:"",cog:[]},koʻo:{s:"koʻo",g:"prop, support",pp:"PPN *toko",cog:[["Māori","tokona"],["Tongan","tokoni"],["Marquesan","toko"]]},kupu:{s:"kupu",g:"sprout, grow",pp:"PPN *tupu",cog:[["Māori","tupu"],["Tahitian","tupu"],["Sāmoan","tupu"]]},kuʻu:{s:"kuʻu",g:"release, lower",pp:"PPN *tuku",cog:[["Māori","tuku"],["Sāmoan","tuʻu"],["Tongan","tuku"]]},"kō#1":{s:"kō",g:"fulfill; conceive",pp:"PNP *too",cog:[["Sāmoan","tō"]]},kūkā:{s:"kūkā",g:"consult, confer",pp:"",cog:[]},laha:{s:"laha",g:"spread out",pp:"PPN *lafa-lafa",cog:[["Māori","raha"],["Sāmoan","lafalafa"],["Tongan","lafalafa"]]},"lehu#number":{s:"lehu",g:"four hundred thousand",pp:"",cog:[]},lena:{s:"lena",g:"yellow",pp:"PPN *reŋa",cog:[["Māori","renga"],["Tahitian","reʻareʻa"]]},lihi:{s:"lihi",g:"edge; eyelash",pp:"",cog:[]},liki:{s:"liki",g:"tighten, gird",pp:"PNP *niti",cog:[["Marquesan","niti"],["Tahitian","nitiniti"]]},lino:{s:"lino",g:"calm, shining",pp:"PPN *liŋo",cog:[["Sāmoan","ligoligo"],["Tongan","lingolingo"]]},lohe:{s:"lohe",g:"hear",pp:"",cog:[]},"mana#1":{s:"mana",g:"branch",pp:"PPN *maŋa",cog:[["Māori","manga"],["Sāmoan","maga"],["Tongan","manga"]]},"maʻo#0":{s:"maʻo",g:"green",pp:"",cog:[]},meha:{s:"meha",g:"lonely, solitary",pp:"",cog:[["Māori","mehameha"],["Tahitian","mehameha"]]},"mele#1":{s:"mele",g:"yellow",pp:"",cog:[]},miko:{s:"miko",g:"salted, seasoned",pp:"",cog:[]},mili:{s:"mili",g:"handle, caress",pp:"PPN *mili",cog:[["Māori","miri"],["Sāmoan","mili"],["Tongan","mili"]]},"mū#4":{s:"mū",g:"silent",pp:"PNP *muu",cog:[["Māori","mū"],["Rapa Nui","mumū"]]},nahe:{s:"nahe",g:"soft, gentle",pp:"",cog:[["Māori","ngahengahe"],["Sāmoan","gasegase"]]},nau:{s:"nau",g:"chew",pp:"PPN *ŋau",cog:[["Māori","ngau"],["Sāmoan","gau"],["Tongan","ngau"]]},niho:{s:"niho",g:"tooth",pp:"PPN *nifo",cog:[["Māori","niho"],["Tahitian","niho"],["Sāmoan","nifo"]]},noʻo:{s:"noʻo",g:"think, reflect",pp:"",cog:[]},nū:{s:"nū",g:"hum, coo",pp:"PPN *ŋuu",cog:[["Māori","ngū"],["Sāmoan","gū"],["Tongan","ngū"]]},oka:{s:"oka",g:"dregs, crumbs",pp:"PPN *qota",cog:[["Māori","ota"],["Tahitian","ota"],["Marquesan","ota"]]},"pae#1":{s:"pae",g:"bank, platform",pp:"PCE *pae",cog:[["Māori","pae"],["Tahitian","pae"]]},pane:{s:"pane",g:"answer, reply",pp:"",cog:[]},peka:{s:"peka",g:"tattle",pp:"",cog:[]},peku:{s:"peku",g:"kick",pp:"PCE *petu",cog:[]},"pio#2":{s:"pio",g:"peep, chirp",pp:"",cog:[]},"poe#0":{s:"poe",g:"round",pp:"PEP *poe",cog:[["Tahitian","poe"],["Rapa Nui","poe"],["Marquesan","poe"]]},"pule#1":{s:"pule",g:"speckled",pp:"PPN *pule",cog:[["Māori","purepure"],["Sāmoan","pulepule"],["Tahitian","purepure"]]},"puni#1":{s:"puni",g:"fond of, craving",pp:"",cog:[]},"wai#1":{s:"wai",g:"retain, deposit",pp:"PPN *qai",cog:[["Tongan","ʻai"]]},wana:{s:"wana",g:"sea urchin",pp:"PPN *wana",cog:[["Māori","wanawana"],["Tahitian","vanavana"],["Rapa Nui","vanavana"]]},wehe:{s:"wehe",g:"open, undo",pp:"PCE *wese",cog:[["Māori","wehe"],["Tahitian","vehe"],["Marquesan","vehe"]]},welu:{s:"welu",g:"rag, ragged",pp:"PCE *weru",cog:[["Māori","weweru"]]},wiki:{s:"wiki",g:"quick, hurry",pp:"PCE *witi",cog:[["Tahitian","viti"]]},"wī#famine":{s:"wī",g:"famine",pp:"",cog:[]},"ʻaha#1":{s:"ʻaha",g:"sennit, cord",pp:"PPN *kafa",cog:[["Māori","kaha"],["Sāmoan","ʻafa"],["Tongan","kafa"]]},ʻaka:{s:"ʻaka",g:"laugh",pp:"PPN *kata",cog:[["Māori","kata"],["Tahitian","ʻata"],["Sāmoan","ʻata"]]},"ʻaki#0":{s:"ʻaki",g:"bite, nip",pp:"PPN *kati",cog:[["Māori","kati"],["Sāmoan","ʻati"]]},ʻale:{s:"ʻale",g:"wave, ripple",pp:"PNP *kale",cog:[["Māori","kare"],["Tahitian","ʻare"]]},ʻalo:{s:"ʻalo",g:"dodge, evade",pp:"PPN *kalo",cog:[["Māori","karo"],["Sāmoan","ʻalo"],["Tongan","kalo"]]},ʻalu:{s:"ʻalu",g:"slack, loose",pp:"PPN *kalu",cog:[["Māori","karu"],["Tongan","kalu"],["Rapa Nui","karukaru"]]},ʻape:{s:"ʻape",g:"giant taro",pp:"PPN *kape",cog:[["Sāmoan","ʻape"],["Tahitian","ʻape"],["Tongan","kape"]]},"ʻawa#bitter":{s:"ʻawa",g:"bitter, sour",pp:"PNP *kawa",cog:[["Māori","kawa"],["Tahitian","ʻavaʻava"],["Rapa Nui","kava"]]},ʻeha:{s:"ʻeha",g:"pain, hurt",pp:"",cog:[]},"ʻeke#cringe":{s:"ʻeke",g:"shrink from",pp:"PEP *qete",cog:[["Māori","eti"],["Tahitian","ete"]]},ʻie:{s:"ʻie",g:"climbing vine",pp:"PPN *kie",cog:[["Māori","kiekie"],["Sāmoan","ʻieʻie"],["Tahitian","ʻieʻie"]]},ʻimo:{s:"ʻimo",g:"wink",pp:"PCE *kimo",cog:[["Māori","kimo"],["Tongan","kimokimo"]]},"ʻiwa#fern":{s:"ʻiwa",g:"fern",pp:"PCE *kiwa",cog:[["Māori","kiwakiwa"]]},ʻohe:{s:"ʻohe",g:"native tree",pp:"PPN *kofe",cog:[["Sāmoan","ʻofe"],["Tongan","kofe"],["Tahitian","ʻofe"]]},ʻolu:{s:"ʻolu",g:"pleasant, comfortable",pp:"",cog:[]},ʻona:{s:"ʻona",g:"dizzy, unsteady",pp:"PPN *kona",cog:[["Tongan","kona"],["Sāmoan","ʻoʻona"],["Marquesan","kona"]]},ʻoni:{s:"ʻoni",g:"move, wriggle",pp:"PNP *koli",cog:[["Māori","koni"],["Marquesan","koʻi"]]},ʻopi:{s:"ʻopi",g:"fold, crease",pp:"PPN *kopi",cog:[["Tahitian","ʻopi"],["Marquesan","kopi"],["Māori","kokopi"]]},ʻuki:{s:"ʻuki",g:"flax lily",pp:"",cog:[]},"ʻō#0":{s:"ʻō",g:"pointed stick",pp:"PPN *koho",cog:[["Māori","kō"],["Tahitian","ʻō"],["Sāmoan","ʻoso"]]}},pi={lani:{key:"lani",label:"lani",en:"sky",place:"compass"},kai:{key:"kai",label:"kai",en:"sea",place:"fishpond"},ʻāina:{key:"ʻāina",label:"ʻāina",en:"land",place:"lava"},ulu:{key:"ulu",label:"ulu",en:"growth",place:"loi"},kanaka:{key:"kanaka",label:"kanaka",en:"people",place:"kauhale"},hana:{key:"hana",label:"hana",en:"work",place:"halau"},naʻau:{key:"naʻau",label:"naʻau",en:"mind",place:"cloud"},hele:{key:"hele",label:"hele",en:"motion",place:"stream"}},zt=Kh;function Da(a){return zt[a].s.toUpperCase()}function Wo(a){return a.includes("?")}const zc=[],Ar=new Set;for(const a of $h)Ar.has(a.w)||(Ar.add(a.w),zc.push({word:a.w,a:a.a,b:a.b,gloss:a.g,field:a.f,ev:a.ev,nodeal:!!a.nodeal}));function Mo(a,e,t){let n=a.get(e);n||a.set(e,n=[]),n.push(t)}function Oc(a){const e=new Map,t=new Map;for(const n of a)Mo(e,n.a,n),Mo(t,n.b,n);return{keepFirst:e,keepSecond:t}}function Zh(a){let e=a;for(;;){const{keepFirst:t,keepSecond:n}=Oc(e),i=e.filter(o=>n.get(o.b).length-1+t.get(o.a).length-1>=2);if(i.length===e.length)return e;e=i}}const Fn=Zh(zc),{keepFirst:Jh,keepSecond:Qh}=Oc(Fn),wo=new Map;for(const a of Fn)Mo(wo,a.a,a),a.b!==a.a&&Mo(wo,a.b,a);function Cn(a,e){const t=e===0?Qh.get(a.b):Jh.get(a.a);return t?t.filter(n=>n!==a):[]}function Pr(a){return Cn(a,0).length+Cn(a,1).length}const hi=new Map;for(const a of Fn){if(hi.has(a.word))continue;const e={size:0},t=[a];for(hi.set(a.word,e);t.length;){const n=t.pop();e.size++;for(const i of[0,1])for(const o of Cn(n,i))hi.has(o.word)||(hi.set(o.word,e),t.push(o))}}function eu(a){var e;return((e=hi.get(a.word))==null?void 0:e.size)??0}const ui=new Map;for(const a of Fn)ui.set(a.a,(ui.get(a.a)??0)+1),ui.set(a.b,(ui.get(a.b)??0)+1);const tu=2*Fn.length,nu=[...ui.values()].reduce((a,e)=>a+(e/tu)**2,0),qo=11.5*Math.max(5/11.5,Math.min(1,Math.sqrt(.01/Math.max(nu,1e-9)))),qe=Math.PI*2,hn=Math.PI/180,Bc=1.35,Gc=.21,Hc=1-Math.pow(Gc,Bc),Vc=45*hn,ca=21*hn,au=[["ʻĀkau",0],["Hikina",90],["Hema",180],["Komohana",270]],Rr=["Lā","ʻĀina","Noio","Manu","Nālani","Nā Leo","Haka"],Cr=[["Koʻolau",90,-1],["Malanai",90,1],["Kona",270,-1],["Hoʻolua",270,1]];function iu(a,e){const t=zu(a*7919+101),n=e.x1-e.x0,i=e.z1-e.z0,o=Math.min(n/42,i/29),s=Math.max(.62,o),r=su(e,o),l=2.2*s,c={x0:e.x0-l,x1:e.x1+l,z0:e.z0-l,z1:e.z1+l},h=ru(e,r,s,t),u=lu(h,o,t),f=cu(h,u,a),p=hu(h,f,s),v=u.map(te=>ir(h,f,te,te.head*h.rcAt(te.bearing),s)),g=u.map((te,F)=>uu(h,f,p,te,u[(F+1)%u.length],s)),m=pu(h,u,[(e.x0+e.x1)/2,(e.z0+e.z1)/2],t),d=Tu(c,f),x=new Uint8Array(d.n);for(let te=0;te<d.n;te++)x[te]=d.h[te]>0?1:0;const _=Zn({...d,h:Cu(d,x,0)},.5*s).filter(te=>te.closed).sort((te,F)=>F.pts.length-te.pts.length).map(te=>ti(te,2,.01*s))[0],w=gu(h,f,p,u[m.lava],s,t);Au(d,w.line,.02);const E=Yo(d),k=Zn(E,0).filter(te=>te.closed&&Math.abs(Zo(te.pts))>1.2*s*s);k.sort((te,F)=>Math.abs(Zo(F.pts))-Math.abs(Zo(te.pts)));const T=k[0].pts;w.edges=$o(w.line,([te,F])=>{const Ge=Math.round((te-d.x0)/d.step),Me=Math.round((F-d.z0)/d.step);return Gs(d,Ge,Me,te,F)>.06*s}).filter(te=>Yc(te)>.3*s);const S=te=>({stream:v[te],ridges:[g[(te-1+g.length)%g.length],g[te]]}),M=vu(d,T,S(m.fishpond),s,t);let b=null;for(const te of m.halau){const F=_u(d,T,S(te),s,t);if((!b||F.clear>b.clear)&&(b=F),F.clear>.12*s)break}delete b.clear;const D=xu(d,T,S(m.kauhale),s,t),N=Mu(h,f,S(m.loi),s,t),V=[.16,.36,.6,.9,1.26,1.7,2.22,2.8],R=Lu(d,M.line,.06*s,V.at(-1)*s),U=Yo({...d,h:R}),z=Yo({...d,h:Pu(d,R,3)}),Z=V.map(te=>({d:te*s,lines:Zn(z,te*s).map(F=>ti(F,2,.008*s))})),G=.82*s,O=ku(U,h,G,w,M,s,t),q=([te,F])=>Mi(w.line,te,F),W={..._,firm:$o(_.pts,te=>!q(te)),flow:$o(_.pts,q)},L=u.filter(te=>te.windward).length,C=g.map((te,F)=>{const Ge=fu(d,te,s);return{line:Ge,sea:du(d,R,Ge,G+.25*s,s),moku:F===L-1||F===u.length-1}}),B=C.map(te=>Iu(te.line,W.pts)).filter(Boolean),H=Math.max(10,Math.min(24,Math.round(h.meanR/.62))),Q=[];for(let te=1;te<H;te++){const F=te/H;Q.push({level:F,major:te%5===0,lines:Zn(E,F).filter(Ge=>Ge.pts.length>4).map(Ge=>ti(Ge,1,.012*s))})}const ee=[];for(let te=1;te<H;te++){const F=(te+.5)/H;if(!(F<=Hc))for(const Ge of Zn(E,F))Ge.pts.length>4&&ee.push(ti(Ge,1,.012*s))}const ae=bu(h,p,s,t),de=mu(h,f,p,u[m.stream],s),fe=[Su(r,t),{...M,field:"kai",kind:"fishpond"},{...w,field:"ʻāina",kind:"lava"},{...N,field:"ulu",kind:"loi"},{...D,field:"kanaka",kind:"kauhale"},{...b,field:"hana",kind:"halau"},{...ae,field:"naʻau",kind:"cloud"},{...de,field:"hele",kind:"stream"}];return{seed:a,k:s,sheet:c,summit:[h.S[0],h.S[1]],height:{x0:d.x0,z0:d.z0,step:d.step,nx:d.nx,nz:d.nz,h:d.h},coast:k.map(te=>ti(te,1,.008*s)),contours:Q,waterlines:Z,boundaries:C,trail:W,ahu:B,streams:v.map((te,F)=>({pts:Ei(ja(te,!1,2),.01*s),windward:u[F].windward})).filter((te,F)=>F!==m.lava&&F!==m.stream),reef:O,upland:{x:p.x,z:p.z,r:p.r,ring:p.ring,form:ee},moku:[{name:"Koʻolau",bearing:zn(h.mokuSplit[0]+ea(h.mokuSplit[0],h.mokuSplit[1])/2)},{name:"Kona",bearing:zn(h.mokuSplit[1]+ea(h.mokuSplit[1],h.mokuSplit[0])/2)}],swell:Eu(c,d,R,G,s),compass:fe[0],places:fe}}function Lr(a,e,t,n,i){const{ring:o,x:s,z:r,r:l}=a.upland;if(n<s-l||e>s+l||i<r-l||t>r+l)return!1;if(Mi(o,(e+n)/2,(t+i)/2))return!0;for(const[h,u]of o)if(h>=e&&h<=n&&u>=t&&u<=i)return!0;return[[e,t],[n,t],[n,i],[e,i]].some(([h,u])=>Mi(o,h,u))}function ou(a,e,t){if(a.line)return Ti(a.line,e,t);const n=e-a.x,i=t-a.z;if(a.hw!=null){if(!(Math.abs(n)<=a.hw&&Math.abs(i)<=a.hh))return[a.x+rt(n,-a.hw,a.hw),a.z+rt(i,-a.hh,a.hh)];const r=a.hw-Math.abs(n),l=a.hh-Math.abs(i);return r<l?[a.x+Math.sign(n||1)*a.hw,t]:[e,a.z+Math.sign(i||1)*a.hh]}const o=Math.hypot(n,i)||1;return[a.x+n/o*a.r,a.z+i/o*a.r]}function su(a,e){const t=rt(.15*Math.min(a.x1-a.x0,a.z1-a.z0),2.1,3.6);return{x:a.x1-t-4*e,z:a.z0+t+3*e,r:t,sx:1,sz:-1}}function ru(a,e,t,n){const o=2*t,s={x0:a.x0+o,x1:a.x1-o,z0:a.z0+o,z1:a.z1-o},r=1,l=(s.z1-s.z0)/(s.x1-s.x0)*(.92+.12*n()),c=(12+12*n())*hn,h=(W,L)=>[W*Math.cos(c)+L*Math.sin(c),L*Math.cos(c)-W*Math.sin(c)],u=[-1*(.1+.1*n()),1*(.06+.12*n())*l],[f,p]=h(...u),v=n()*qe,g=.1+.08*n(),m=[2,3,4,5,7,9,12,16].map(W=>[W,(.05+.04*n())/Math.pow(W,.75),n()*qe]),d=new Float64Array(720),x=[];for(let W=0;W<720;W++){const L=W/720*qe,[C,B]=Wt(L),[H,Q]=h(C,B),ee=H*H/(r*r)+Q*Q/(l*l),ae=2*(f*H/(r*r)+p*Q/(l*l)),de=f*f/(r*r)+p*p/(l*l)-1;let fe=(-ae+Math.sqrt(ae*ae-4*ee*de))/(2*ee);fe*=1+g*Math.pow(Math.max(0,Math.cos(L-v)),3);for(const[te,F,Ge]of m)fe*=1+F*Math.cos(te*L+Ge);d[W]=fe,x.push([u[0]+fe*C,u[1]+fe*B])}const _=x.map(W=>W[0]),w=x.map(W=>W[1]),E=Math.min(..._),k=Math.max(..._),T=Math.min(...w),S=Math.max(...w);let M=Math.min((s.x1-s.x0)/(k-E),(s.z1-s.z0)/(S-T)),b=0,D=0;for(let W=0;W<60;W++){const L=s.x1-s.x0-M*(k-E),C=s.z1-s.z0-M*(S-T);b=(s.x0+s.x1)/2-M*((E+k)/2)-e.sx*L/2,D=(s.z0+s.z1)/2-M*((T+S)/2)-e.sz*C/2;let B=1/0;for(const[H,Q]of x)B=Math.min(B,Math.hypot(b+M*H-e.x,D+M*Q-e.z));if(B>=e.r+1.25*t)break;M*=.97}const N=[b+M*u[0],D+M*u[1]],V=d.map(W=>W*M),R=W=>{const L=(W>=0&&W<qe?W:zn(W))/qe*720,C=Math.floor(L),B=L-C;return V[C%720]*(1-B)+V[(C+1)%720]*B},U=W=>{const[L,C]=Wt(W),B=R(W);return[N[0]+L*B,N[1]+C*B]},z=R(v)*.58,[Z,G]=Wt(v),O=[(315+(n()-.5)*24)*hn,(135+(n()-.5)*24)*hn];let q=0;for(const W of V)q+=W/720;return{S:N,rcAt:R,coastAt:U,meanR:q,shoulder:{x:N[0]+Z*z,z:N[1]+G*z,s:R(v)*.3,k:.16+.05*n()},mokuSplit:O}}function lu(a,e,t){const i=[];for(let u=0;u<=1440;u++)i.push(a.coastAt(a.mokuSplit[0]+u/1440*qe));const o=[0];for(let u=1;u<=1440;u++)o.push(o[u-1]+Math.hypot(i[u][0]-i[u-1][0],i[u][1]-i[u-1][1]));const s=ea(a.mokuSplit[0],a.mokuSplit[1]),r=Math.round(s/qe*1440),l=[{from:0,to:o[r],spacing:Math.max(2.8,3.4*e),windward:!0},{from:o[r],to:o[1440],spacing:Math.max(4.4,5.2*e),windward:!1}],c=[];for(const u of l){const f=u.to-u.from,p=Math.max(4,Math.round(f/u.spacing)),v=f/p;for(let g=0;g<p;g++){const m=u.from+(g+.5+(t()-.5)*.45)*v;let d=0;for(;o[d+1]<m;)d++;const x=zn(a.mokuSplit[0]+(d+(m-o[d])/(o[d+1]-o[d]))/1440*qe);c.push(u.windward?{bearing:x,windward:!0,depth:.13+.07*t(),head:Gc+.1+.14*t(),width:v*(.22+.06*t())}:{bearing:x,windward:!1,depth:.04+.03*t(),head:.5+.14*t(),width:v*(.17+.05*t())})}}const h=t()*qe;for(const u of c)u.bend=.24*Math.sin(2*u.bearing+h)+.08*(t()-.5),u.wobble=.015+.025*t(),u.phase=t()*qe,u.freq=4+4*t(),u.mouth=u.windward?t()<.2?.6+.2*t():.08+.4*t():.4+.5*t(),u.reach=3*u.width*1.2;return c}const xi=(a,e)=>a.bearing+a.bend*Math.max(0,e-a.head)**2+a.wobble*(Math.sin(e*a.freq+a.phase)+.5*Math.sin(e*a.freq*2.3+a.phase*1.7));function cu(a,e,t){const{S:n,shoulder:i}=a,o=$c(t*31+7),s=a.meanR/3.2,r=e.map(l=>1.5*l.wobble+Math.abs(l.bend));return(l,c)=>{const h=l-n[0],u=c-n[1],f=Math.hypot(h,u);let p=Math.atan2(h,-u);p<0&&(p+=qe);const v=f/a.rcAt(p);let g=1-Math.pow(v,Bc);if(g+=.035*(o(l/s,c/s)+.5*o(l/(s*.45)+17,c/(s*.45)-9)),v>=1.16)return g;if(v<1.02){const m=l-i.x,d=c-i.z;g+=i.k*Math.exp(-(m*m+d*d)/(i.s*i.s))*en(1.02,.6,v)}for(let m=0;m<e.length;m++){const d=e[m];if(v<d.head)continue;let x=p-d.bearing;if(x>Math.PI?x-=qe:x<-Math.PI&&(x+=qe),Math.abs(x)*f>d.reach+r[m]*f)continue;const _=f*hr(p,xi(d,v)),w=d.width*(.5+.6*v);if(Math.abs(_)>3*w)continue;const E=en(d.head,d.head+.16,v)*(1-(1-d.mouth)*en(.82,1,v))*(1-en(1.04,1.16,v));g-=d.depth*E*Math.exp(-((_/w)**2))}return g}}function hu(a,e,t){const i=[];for(let l=0;l<240;l++){const c=l/240*qe,[h,u]=Wt(c);let f=0;const p=.05*t;for(;e(a.S[0]+h*(f+p),a.S[1]+u*(f+p))>Hc;)f+=p;i.push(f+p/2)}const o=i.map((l,c)=>{let h=0;for(let u=-3;u<=3;u++)h+=i[(c+u+240)%240];return h/7}),s=o.map((l,c)=>{const[h,u]=Wt(c/240*qe);return[a.S[0]+h*l,a.S[1]+u*l]}),r=l=>{const c=zn(l)/qe*240,h=Math.floor(c),u=c-h;return o[h%240]*(1-u)+o[(h+1)%240]*u};return{x:a.S[0],z:a.S[1],r:Math.max(...o),ring:s,radiusAt:r}}function ir(a,e,t,n,i){const{S:o}=a,s=.12*i,r=[];let l=xi(t,n/a.rcAt(t.bearing)),c=null;for(let h=n;h<a.rcAt(l)*1.3;h+=s){let u=1/0,f=l;for(let d=-6;d<=6;d++){const x=l+d/6*(.5*s)/Math.max(h,s),[_,w]=Wt(x),E=(x-l)*h,k=e(o[0]+_*h,o[1]+w*h)+.002*E*E;k<u&&(u=k,f=x)}l=f+.15*hr(xi(t,h/a.rcAt(f)),f);const[p,v]=Wt(l),g=[o[0]+p*h,o[1]+v*h],m=e(g[0],g[1]);if(m<=0&&c){const d=c.h/(c.h-m);r.push([c.p[0]+(g[0]-c.p[0])*d,c.p[1]+(g[1]-c.p[1])*d]);break}r.push(g),c={p:g,h:m}}return r}function uu(a,e,t,n,i,o){const{S:s}=a,r=.12*o;let l=zn(n.bearing+ea(n.bearing,i.bearing)/2);const c=[];let h=null;for(let u=t.radiusAt(l);u<a.rcAt(l)*1.3;u+=r){const f=u/a.rcAt(l),p=xi(n,f),v=ea(p,xi(i,f)),g=p+v*.2,m=v*.6,d=ea(g,l);d>m&&(l=d-m<qe-d?g+m:g);let x=-1/0,_=l;for(let S=-6;S<=6;S++){const M=l+S/6*(.6*r)/u;if(ea(g,M)>m)continue;const[b,D]=Wt(M),N=(M-l)*u,V=e(s[0]+b*u,s[1]+D*u)-.003*N*N;V>x&&(x=V,_=M)}l=_;const[w,E]=Wt(l),k=[s[0]+w*u,s[1]+E*u],T=e(k[0],k[1]);if(T<=0&&h){const S=h.h/(h.h-T);c.push([h.p[0]+(k[0]-h.p[0])*S,h.p[1]+(k[1]-h.p[1])*S]);break}c.push(k),h={p:k,h:T}}return Ei(ja(c,!1,2),.008*o)}function fu(a,e,t){const[n,i]=e.at(-1);let o=Et(a,a.h,n,i);if(o<=0)return e;const[s,r]=e.at(-2),l=Math.hypot(n-s,i-r)||1,c=(n-s)/l,h=(i-r)/l,u=.04*t;for(let f=u;f<4*t;f+=u){const p=Et(a,a.h,n+c*f,i+h*f);if(p<=0){const v=f-u+u*o/(o-p);return[...e,[n+c*v,i+h*v]]}o=p}return e}function du(a,e,t,n,i){const[o,s]=t.at(-1),[r,l]=qc(a,e,o,s),c=Math.hypot(r,l)||1,[h,u]=t.at(-2);let f=r/c+(o-h)*2,p=l/c+(s-u)*2;const v=Math.hypot(f,p)||1;f/=v,p/=v;const g=[[o,s]];for(let m=.1*i;m<4*n;m+=.1*i){const d=[o+f*m,s+p*m];if(g.push(d),Et(a,e,d[0],d[1])>=n)break}return g}const Xo=.8;function pu(a,e,t,n){const i=e.length,o=[],s=()=>(n()-.5)*30,r=(w,E)=>Math.min(Math.abs(w-E),i-Math.abs(w-E)),l=e.map(w=>{const[E,k]=a.coastAt(w.bearing);return Math.hypot(E-t[0],k-t[1])/a.meanR}),c=(w,E,k=0)=>{for(const[T,S]of[[!0,2],[!0,1],[!1,2],[!1,1]]){const M=e.map((b,D)=>({i:D,score:Math.abs(hr(b.bearing,w*hn))+(b.windward?-b.depth:0)+k*l[D]})).filter(({i:b})=>(!T||E(e[b]))&&o.every(D=>r(b,D)>=S));if(M.length)return M.sort((b,D)=>b.score-D.score).map(({i:b})=>b)}throw new Error("island: no valley left for a place")},h=(...w)=>{const E=c(...w)[0];return o.push(E),E},u=w=>w.windward,f=w=>!w.windward,p=()=>!0,v=h(60+s(),u),g=h(n()<.5?105:15,u),m=h(245+s(),f),d=h(195+s(),f,Xo),x=h(140+s(),p,Xo),_=c(160+s(),p,Xo);return{stream:v,loi:g,lava:m,fishpond:d,halau:_,kauhale:x}}function mu(a,e,t,n,i){const o=t.radiusAt(n.bearing)+.25*i,s=Ei(ja(ir(a,e,n,o,i),!1,2),.008*i);return{...Do(s),line:s}}function gu(a,e,t,n,i,o){const s=t.radiusAt(n.bearing)+.2*(a.rcAt(n.bearing)-t.radiusAt(n.bearing)),r=ir(a,e,n,s,i),[l,c]=r.at(-1),[h,u]=r.at(-3),f=Math.hypot(l-h,c-u)||1;for(let O=.12*i;O<=.45*i;O+=.11*i)r.push([l+(l-h)/f*O,c+(c-u)/f*O]);const p=or(ja(r,!1,2),.06*i),v=(p.length-1)*.06*i,g=.5,m=Hs(o()*1e3),d=Hs(o()*1e3),x=(O,q)=>{const W=O/v,L=i*(.22+.62*en(0,.75,W)),C=q<0?m:d,B=.17*Math.pow(Math.abs(Math.sin(O/(.32*i)+q)),.7)*(1-en(g-.08,g+.04,W)),H=.06*C(O/(.07*i))*en(g-.04,g+.08,W);return L*(1+.12*C(O/(.9*i))+B+H)},_=Xc(p),w=_.map(([O,q,W,L],C)=>{const B=x(C*.06*i,-1);return[O-W*B,q-L*B]}),E=_.map(([O,q,W,L],C)=>{const B=x(C*.06*i,1);return[O+W*B,q+L*B]}),k=(O,q,W,L,C)=>{const B=[];for(let H=1;H<12;H++){const Q=H/12,ee=C?(o()-.5)*C:0,ae=Math.sin(Q*Math.PI)*(L+ee);B.push([O[0]+(q[0]-O[0])*Q+W[0]*ae,O[1]+(q[1]-O[1])*Q+W[1]*ae])}return B},[,,T,S]=_[0],[,,M,b]=_.at(-1),D=[-S,T],N=[b,-M],V=[...k(E[0],w[0],D,.6*Ba(E[0],w[0])*.5,0),...w,...k(w.at(-1),E.at(-1),N,.35*Ba(w.at(-1),E.at(-1)),.12*i),...E.slice().reverse()];V.push(V[0]);const R=[],U=[],z=(O,q)=>{const W=rt(Math.round(O/(.06*i)),0,_.length-1),[L,C,B,H]=_[W],Q=(x(O,-1)+x(O,1))/2;return[L+B*q*Q,C+H*q*Q]};for(let O=.5*i;O<v*g;O+=.55*i+o()*.25*i){const q=(o()-.5)*.9,W=.35+.25*o(),L=(C,B)=>{const H=[];for(let Q=0;Q<=8;Q++){const ee=(Q/8-.5)*2;H.push(z(O-C+.22*i*B*(1-ee*ee),q+ee*W*B))}return H};R.push(L(0,1));for(let C=1;C<=3;C++)U.push(L(.07*i*C,1-C*.2))}const Z=[],G=.13*i;for(let O=v*g;O<v;O+=G){const q=(x(O,-1)+x(O,1))/2,W=Math.max(2,Math.round(2*q/G));for(let L=0;L<W;L++){const C=(L+.2+.6*o())/W*2-1;Math.abs(C)>.92||Z.push(z(O+(o()-.5)*G,C))}}return{...Do(V),line:V,axis:p,lobes:R,ropes:U,stipple:Z}}function vu(a,e,t,n,i){const o=t.stream.at(-1),[s,r]=Ti(e,o[0],o[1]),[l,c]=Ua(a,s,r),h=-c,u=l,f=Math.min(...lr(e,s,r,t.ridges,n).map(S=>S.gap)),p=rt(.85*f,1.1*n,1.9*n),v=s-l*.2*p,g=r-c*.2*p,m=[];for(let S=0;S<=90;S++){const M=(S/90*2-1)*115*hn;m.push([v+p*(Math.cos(M)*l+Math.sin(M)*h),g+p*(Math.cos(M)*c+Math.sin(M)*u)])}const d=m.map(([S,M])=>Et(a,a.h,S,M)<0);let x=45,_=45;for(;x>0&&d[x-1];)x--;for(;_<90&&d[_+1];)_++;const w=Ei(m.slice(Math.max(0,x-1),Math.min(90,_+1)+1),.004*n),E=Yc(w),k=(E>2.4*n?[.3,.7]:[.5]).map(S=>{const[M,b,D,N]=Uu(w,S*E+(i()-.5)*.1*E);return{x:M,z:b,dx:D,dz:N,w:.16*n}}),T=[];for(let S=0;S<200&&T.length<5;S++){const M=i()*qe,b=Math.sqrt(i())*p*.8,D=v+Math.cos(M)*b,N=g+Math.sin(M)*b;Et(a,a.h,D,N)>-.01||T.some(V=>Math.hypot(V.x-D,V.z-N)<.45*n)||T.push({x:D,z:N,phase:i()*7,period:5+3*i()})}return{x:v+l*.4*p,z:g+c*.4*p,r:.85*p,line:w,gates:k,rings:T}}function _u(a,e,t,n,i){const o=t.stream.at(-1),[s,r]=Ti(e,o[0],o[1]),l=[t.stream,...t.ridges],c=lr(e,s,r,t.ridges,n).sort((G,O)=>O.gap-G.gap);let h=s,u=r,f=n,p=-1/0;e:for(const G of[1,.8,.65])for(const{s:O,gap:q}of c)for(const W of[.45,.55,.35,.65,.28]){const[L,C]=jc(e,s,r,O*rt(W*q,.35*n,1.4*n)),[B,H]=Ua(a,L,C);let Q=1/0;for(const ee of[-.24,0,.24])for(let ae=-.1;ae>=-2.2;ae-=.15){const de=L+(B*ae-H*ee)*n*G,fe=C+(H*ae+B*ee)*n*G;for(const te of l)Q=Math.min(Q,No(te,de,fe))}if(Q>p&&(p=Q,h=L,u=C,f=n*G),Q>.12*n)break e}const[v,g]=Ua(a,h,u),m=-g,d=v,x=(G,O)=>[h+v*G+m*O,u+g*G+d*O],_=1.1*f,w=.46*f,E=-1.05*f,k=[x(E,-w/2),x(E,w/2),x(E-_,w/2),x(E-_,-w/2)],T=[x(E,0),x(E-_,0)],S=[];for(let G=1;G<12;G++){const O=E-_*G/12;S.push([x(O,-w/2),x(O,-w*.06)],[x(O,w*.06),x(O,w/2)])}const M=.88*f,b=-.14*f,D=[-1,1].map(G=>{const O=G*.14*f,q=[];for(let W=0;W<=16;W++){const L=W/16,C=.042*f*Math.pow(Math.sin(L*Math.PI),.7)*(L<.5?1:1-.15*(L-.5));q.push(x(b-M*L,O-C))}for(let W=16;W>=0;W--){const L=W/16,C=.042*f*Math.pow(Math.sin(L*Math.PI),.7)*(L<.5?1:1-.15*(L-.5));q.push(x(b-M*L,O+C))}return q}),N=[.3,.5,.7].map(G=>[x(b-M*G,-.2*f),x(b-M*G,.2*f)]),V=[x(b-M*.42,-.09*f),x(b-M*.42,.09*f),x(b-M*.58,.09*f),x(b-M*.58,-.09*f)],R=[],U=sr(e,h,u);for(let G=-1.5*n;G<=1.5*n;G+=.08*n){const[O,q]=rr(e,U,G),[W,L]=Ua(a,O,q);for(let C=.03*n;C<.5*n;C+=.08*n){const B=[O-W*(C+i()*.06*n),q-L*(C+i()*.06*n)];Et(a,a.h,B[0],B[1])<=0||i()>(1-Math.abs(G)/(1.6*n))*(1-C/(.55*n))*1.6||Mi(k,B[0],B[1])||R.push(B)}}const z=[...k,k[0]],Z=[...k,...D[0],...D[1]];return{...Do(Z),line:z,shed:k,ridge:T,thatch:S,hulls:D,beams:N,deck:V,sand:R,clear:p}}function xu(a,e,t,n,i){const o=t.stream.at(-1),[s,r]=Ti(e,o[0],o[1]),{s:l,gap:c}=lr(e,s,r,t.ridges,n).sort((N,V)=>V.gap-N.gap)[0],h=[t.stream,...t.ridges],u=(N,V,R)=>h.every(U=>No(U,N,V)>R);let f=s,p=r,v=s,g=r;for(const N of[.5,.4,.6,.3]){[f,p]=jc(e,s,r,l*rt(N*c,.4*n,1.6*n));const[V,R]=Ua(a,f,p);if(v=f-V*.95*n,g=p-R*.95*n,u(v,g,.8*n))break}const[m,d]=Ua(a,f,p),x=Math.atan2(m,-d),_=[];for(let N=0;N<400&&_.length<5;N++){const V=i()*qe,R=Math.sqrt(i())*.75*n,U=v+Math.cos(V)*R,z=g+Math.sin(V)*R,Z=(.34+.18*i())*n,G=(.22+.12*i())*n,O=x+(i()-.5)*.4,q={x:U,z,w:Z,h:G,ang:O};Ko(q).some(([L,C])=>Et(a,a.h,L,C)<.004||!u(L,C,.12*n))||_.some(L=>Math.hypot(L.x-U,L.z-z)<(Math.max(L.w,L.h)+Math.max(Z,G))*.55+.05*n)||_.push(q)}const w=_.map((N,V)=>{const R=Ko(N);if(V>=3)return{paepae:R};const U={...N,w:N.w*.72,h:N.h*.62},z=Ko(U),Z=Math.cos(N.ang),G=Math.sin(N.ang),O=(U.w-U.h)/2,q=[[N.x-Z*O,N.z-G*O],[N.x+Z*O,N.z+G*O]],W=[[z[0],q[0]],[z[3],q[0]],[z[1],q[1]],[z[2],q[1]]];return{paepae:R,roof:z,ridge:q,hips:W}}),E=w.flatMap(N=>N.paepae),k=E.map(N=>N[0]),T=E.map(N=>N[1]),S=(Math.min(...k)+Math.max(...k))/2,M=(Math.min(...T)+Math.max(...T))/2,b=(Math.max(...k)-Math.min(...k))/2+.12*n,D=(Math.max(...T)-Math.min(...T))/2+.12*n;return{x:S,z:M,r:Math.hypot(b,D),hw:b,hh:D,houses:w}}function Mu(a,e,t,n,i){const o=.04*n,s=H=>Math.round(H/o),r=Xc(or(t.stream,o)),l=r.length-1,c=([H,Q])=>{const ee=H-a.S[0],ae=Q-a.S[1];return Math.hypot(ee,ae)/a.rcAt(cr(ee,ae))},h=l-s(.75*n);let u=r.findIndex(H=>c(H)>.6);(u<0||u>h-s(1.5*n))&&(u=Math.max(s(.8*n),h-s(2.2*n)));const f=Math.min(h,u+s(2.6*n)),p=[-1,1].map(H=>{let Q=2.5*n;for(let ee=0;ee<=1;ee+=.2){const[ae,de,fe,te]=r[Math.round(u-s(.6*n)+(f-u+s(.6*n))*ee)];for(let F=.1*n;F<Q;F+=.05*n)t.ridges.some(Ge=>No(Ge,ae+fe*F*H,de+te*F*H)<.25*n)&&(Q=F)}return Q}),v=p[0]>p[1]?-1:1,g=rt(.8*Math.max(...p),.6*n,1.3*n),m=(H,Q)=>{const ee=rt(Math.floor(H),0,l-1),ae=rt(H-ee,0,1),[de,fe,te,F]=r[ee],[Ge,Me,Te,ve]=r[ee+1],Je=de+(Ge-de)*ae,Re=fe+(Me-fe)*ae;return[Je+(te+(Te-te)*ae)*Q*v,Re+(F+(ve-F)*ae)*Q*v]},d=(H,Q)=>e(...m(H,Q)),x=.07*n,_=g,w=Hs(i()*1e3),E=H=>x+(_-x)*(.45+.55*en(u,u+.6*(f-u),H))*(1+.07*w(H*o/(.5*n))),k=rt(Math.round((f-u)*o/(.36*n)),5,8),T=Array.from({length:k},()=>.5+i()),S=T.reduce((H,Q)=>H+Q,0),M=[u];for(const H of T)M.push(M.at(-1)+(f-u)*H/S);const b=Array.from({length:13},(H,Q)=>x+(_-x)*Q/12),D=M.map(H=>{const Q=d(H,x);let ee=H;return b.map(ae=>(ee=wu(d,Q,ee,ae,s(1.6*n),l),ee))}),N=Math.max(...D.map((H,Q)=>Math.abs(H.at(-1)-M[Q])))*o,V=Math.min(1,.5*g/Math.max(N,1e-6));for(const[H,Q]of D.entries())for(let ee=0;ee<Q.length;ee++)Q[ee]=M[H]+(Q[ee]-M[H])*V;for(let H=1;H<D.length;H++)for(let Q=0;Q<b.length;Q++)D[H][Q]=Math.max(D[H][Q],D[H-1][Q]+s(.14*n));const R=.025*n,U=(H,Q,ee)=>{for(let ae=1;ae<b.length;ae++)if(Q<=b[ae]){const de=(Q-b[ae-1])/(b[ae]-b[ae-1]);return H[ae-1]+(H[ae]-H[ae-1])*de+ee}return H.at(-1)+ee},z=(H,Q,ee,ae)=>{const[de,fe]=[E(U(H,ae,0)),E(U(Q,ae,0))].map(F=>Math.min(ae,F-R)),te=F=>[ee,...b.filter(Ge=>Ge>ee+1e-9&&Ge<F-1e-9),F];return[...te(de).map(F=>m(U(H,F,R/o),F)),...te(fe).reverse().map(F=>m(U(Q,F,-R/o),F))]},Z=[];for(let H=0;H<k;H++){const Q=D[H],ee=D[H+1],ae=E(U(ee,_,0));if(ae-x>.6*n&&i()<.55){const de=x+(ae-x)*(.35+.3*i());Z.push(z(Q,ee,x,de-R),z(Q,ee,de+R,_))}else Z.push(z(Q,ee,x,_))}const G=[],O=Math.max(0,u-s(.6*n));for(let H=O;H<=u;H+=2)G.push(m(H,.02*n+(E(u)+.03*n)*en(O,u,H)));const q=U(D[k],_,0);for(let H=u+2;H<=q;H+=2)G.push(m(H,E(H)+.03*n));const W=E(q)*.5,L=U(D[k],W,0),C=[m(L,W),m(L+s(.16*n),W*.45),m(L+s(.3*n),0)],B=Fu(Z.flat());return B.push(B[0]),{...Do(B),line:B,terraces:Z,auwai:ja(G,!1,2),drain:C}}function wu(a,e,t,n,i,o){let s=t;const r=a(s,n)>e?1:-1;let l=s;for(let c=0;c<i;c++){const h=rt(l+r,0,o);if(h===l)return l;if(s=l,l=h,a(l,n)>e!=r>0)break}for(let c=0;c<6;c++){const h=(s+l)/2;a(h,n)>e==r>0?s=h:l=h}return(s+l)/2}function bu(a,e,t,n){const i=n()*qe,o=n()*qe,s=d=>.5+.3*Math.sin(3*d+i)+.2*Math.sin(5*d+o),r=d=>e.radiusAt(d)+(.12+.3*s(d))*t,l=d=>e.radiusAt(d)+.85*t,c=d=>{const x=[];for(let _=0;_<=180;_++){const w=_/180*qe,[E,k]=Wt(w),T=d(w);x.push([a.S[0]+E*T,a.S[1]+k*T])}return x},h=[],u=e.r+.9*t,f=.04*t,p=(d,x)=>{const _=d-a.S[0],w=x-a.S[1],E=cr(_,w);return{b:E,f:(Math.hypot(_,w)-r(E))/(l(E)-r(E))}},v=()=>.3*n()**1.5;for(let d=a.S[1]-u;d<=a.S[1]+u;d+=.085*t){let x=null,_=0,w=v(),E=!1;for(let k=a.S[0]-u;k<=a.S[0]+u+f;k+=f){const{f:T}=p(k,d),S=T>=w&&T<=1;if(S&&x==null&&(x=k+n()*.1*t,_=(.18+.4*n())*t),x!=null&&(!S||k-x>=_)){const M=S?k:k-f;M-x>.06*t&&h.push({x0:x,z0:d,x1:M,z1:d,...p((x+M)/2,d)}),x=S?k+(.05+.08*n())*t:null,_=(.18+.4*n())*t}E&&!S&&(w=v()),E=S}}const g=c(l);let m=0;for(const[d,x]of g)m=Math.max(m,Math.hypot(d-a.S[0],x-a.S[1]));return{x:a.S[0],z:a.S[1],r:m,line:g,strokes:h}}function Su(a,e){const t=au.map(([i,o])=>({name:i,bearing:o*hn,cardinal:!0}));for(const[i,o,s]of Cr)Rr.forEach((r,l)=>t.push({name:r,quadrant:i,bearing:(o+s*11.25*(l+1))*hn}));t.sort((i,o)=>i.bearing-o.bearing);const n=[];for(const i of["Koʻolau","Malanai"])for(const o of Rr.slice(0,6)){const s=t.find(l=>l.quadrant===i&&l.name===o),r=i==="Koʻolau"?"Hoʻolua":"Kona";n.push({name:o,rises:i,sets:r,path:yu(s.bearing)})}for(let i=n.length-1;i>0;i--){const o=Math.floor(e()*(i+1));[n[i],n[o]]=[n[o],n[i]]}return{field:"lani",kind:"compass",x:a.x,z:a.z,r:a.r,horizon:.56*a.r,houses:t,quadrants:Cr.map(([i],o)=>({name:i,bearing:(45+90*o)*hn})),stars:n}}function yu(a){const e=Math.cos(a)*Math.cos(ca),t=Math.asin(e),n=Math.acos(rt(-Math.tan(ca)*Math.tan(t),-1,1)),i=[];for(let o=0;o<=64;o++){const s=-n+2*n*o/64,r=-Math.cos(t)*Math.sin(s),l=e*Math.cos(ca)-Math.cos(t)*Math.cos(s)*Math.sin(ca),c=e*Math.sin(ca)+Math.cos(t)*Math.cos(s)*Math.cos(ca),h=Math.atan2(r,l),u=1-Math.asin(rt(c,-1,1))/(Math.PI/2);i.push([Math.sin(h)*u,-Math.cos(h)*u])}for(const o of[i[0],i.at(-1)]){const s=Math.hypot(o[0],o[1]);o[0]/=s,o[1]/=s}return i}function ku(a,e,t,n,i,o,s){const r=Zn(a,t).filter(_=>_.closed);r.sort((_,w)=>w.pts.length-_.pts.length);const l=or(r[0].pts,.02*o),c=[s(),s(),s()].map(_=>_*qe),h=_=>Math.sin(2*_+c[0])+.6*Math.sin(3*_+c[1])+.4*Math.sin(5*_+c[2]),u=n.axis.at(-1),f=l.map(([_,w])=>Math.hypot(_-u[0],w-u[1])<2.6*o?!1:Math.hypot(_-i.x,w-i.z)<i.r+1.4*o?!0:h(cr(_-e.S[0],w-e.S[1]))>-.25),p=[],v=[],g=Wt(Vc);let m=0,d=0,x=0;for(let _=1;_<l.length;_++){if(x+=.02*o,!f[_])continue;const[w,E]=l[_],[k,T]=qc(a,a.h,w,E),S=Math.hypot(k,T)||1,M=k/S,b=T/S;if(x>=m){const D=(s()-.5)*.08*o;p.push([w+M*D,E+b*D]),s()<.55&&p.push([w-M*(.13+s()*.06)*o,E-b*(.13+s()*.06)*o]),m=x+(.1+s()*.07)*o}if(x>=d&&M*g[0]+b*g[1]>.2){const D=-b,N=M,V=(s()-.5)*.06;for(const[R,U]of[[.15,.13],[.24,.08]]){const z=w+M*R*o,Z=E+b*R*o;v.push({x:z,z:Z,pts:[-1,0,1].map(G=>[z+(D+M*V)*G*U*o+M*(1-G*G)*.012*o,Z+(N+b*V)*G*U*o+b*(1-G*G)*.012*o])})}d=x+(.5+s()*.25)*o}}return{at:t,dots:p,surf:v}}function Eu(a,e,t,n,i){const o=Math.max(.24,.3*Math.min(1.2,i)),s=Math.ceil((a.x1-a.x0)/o)+1,r=Math.ceil((a.z1-a.z0)/o)+1,l=s*r,c=Wt(Vc+Math.PI),h=new Float32Array(l);for(let S=0;S<r;S++)for(let M=0;M<s;M++)h[S*s+M]=Et(e,t,a.x0+M*o,a.z0+S*o);const u=S=>h[S]<=.02*i,f=new Float32Array(l);for(let S=0;S<l;S++)f[S]=.5+.5*en(0,3*i,h[S]);const p=(S,M)=>(a.x0+S*o-a.x1)*c[0]+(a.z0+M*o-a.z0)*c[1],v=new Float64Array(l).fill(1/0),g=new Ou(l);for(let S=0;S<r;S++)for(let M=0;M<s;M++){if(M!==s-1&&S!==0)continue;const b=S*s+M;u(b)||(v[b]=p(M,S),g.push(b,v[b]))}const m=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1],[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]],d=m.map(([S,M])=>Math.hypot(S,M)*o*2);for(;g.size;){const S=g.pop(),M=g.key;if(M>v[S])continue;const b=S%s,D=(S-b)/s;for(let N=0;N<m.length;N++){const V=b+m[N][0],R=D+m[N][1];if(V<0||R<0||V>=s||R>=r)continue;const U=R*s+V;if(u(U))continue;const z=M+d[N]/(f[S]+f[U]);z<v[U]&&(v[U]=z,g.push(U,z))}}const x=new Float64Array(l);for(let S=0;S<l;S++)x[S]=p(S%s,Math.floor(S/s));const _=Uint32Array.from({length:l},(S,M)=>M).sort((S,M)=>x[S]-x[M]),w=new Float32Array(l),E=Math.exp(-o/(7*i));for(const S of _){if(u(S)){w[S]=1;continue}const M=S%s,b=(S-M)/s,D=Math.round(M-c[0]),N=Math.round(b-c[1]);w[S]=D>=0&&N>=0&&D<s&&N<r?w[N*s+D]*E:0}const k=2.4*i,T=new Float32Array(l);for(let S=0;S<l;S++){if(!Number.isFinite(v[S]))continue;const M=Math.max(0,v[S]-p(S%s,Math.floor(S/s)));T[S]=(1-.92*w[S])*Math.exp(-M/(1.4*k))*en(n+.3*i,n+1.6*i,h[S])}return{x0:a.x0,z0:a.z0,step:o,nx:s,nz:r,T:Float32Array.from(v),energy:T,lambda:k,period:42}}function Tu(a,e){const t=rt((a.x1-a.x0)/320,.1,.15),n=Math.ceil((a.x1-a.x0)/t)+1,i=Math.ceil((a.z1-a.z0)/t)+1,o=new Float32Array(n*i);for(let s=0;s<i;s++)for(let r=0;r<n;r++)o[s*n+r]=e(a.x0+r*t,a.z0+s*t);return{x0:a.x0,z0:a.z0,step:t,nx:n,nz:i,n:n*i,h:o}}function Au(a,e,t){const n=e.map(c=>c[0]),i=e.map(c=>c[1]),o=Math.max(0,Math.floor((Math.min(...n)-a.x0)/a.step)),s=Math.min(a.nx-1,Math.ceil((Math.max(...n)-a.x0)/a.step)),r=Math.max(0,Math.floor((Math.min(...i)-a.z0)/a.step)),l=Math.min(a.nz-1,Math.ceil((Math.max(...i)-a.z0)/a.step));for(let c=r;c<=l;c++)for(let h=o;h<=s;h++){const u=c*a.nx+h;a.h[u]<t&&Mi(e,a.x0+h*a.step,a.z0+c*a.step)&&(a.h[u]=t)}}function Pu(a,e,t){const{nx:n,nz:i}=a;let o=Float32Array.from(e),s=new Float32Array(o.length);for(let r=0;r<t;r++){for(let l=0;l<i;l++)for(let c=0;c<n;c++){const h=l*n+c;s[h]=(o[c>0?h-1:h]+2*o[h]+o[c<n-1?h+1:h])/4}for(let l=0;l<i;l++)for(let c=0;c<n;c++){const h=l*n+c;o[h]=(s[l>0?h-n:h]+2*s[h]+s[l<i-1?h+n:h])/4}}return o}function Ru(a,e,t,n){for(let i=1;i<t.length;i++){const[o,s]=t[i-1],[r,l]=t[i],c=Math.ceil(Math.hypot(r-o,l-s)/(a.step*.5));for(let h=0;h<=c;h++){const u=o+(r-o)*h/c,f=s+(l-s)*h/c,p=Math.ceil(n/a.step),v=Math.round((u-a.x0)/a.step),g=Math.round((f-a.z0)/a.step);for(let m=-p;m<=p;m++)for(let d=-p;d<=p;d++){const x=v+d,_=g+m;x<0||_<0||x>=a.nx||_>=a.nz||Math.hypot(d,m)*a.step<=n+a.step*.5&&(e[_*a.nx+x]=1)}}}}function Cu(a,e,t){const{d2:n}=Wc(a,e,t),i=new Float32Array(a.n);for(let o=0;o<a.n;o++)i[o]=Math.sqrt(n[o])*a.step;return i}function Wc(a,e,t){const{nx:n,nz:i,n:o}=a,s=1e20,r=new Float64Array(o);for(let d=0;d<o;d++)r[d]=e[d]===t?0:s;const l=new Int32Array(o),c=new Int32Array(o),h=Math.max(n,i),u=new Float64Array(h),f=new Int32Array(h),p=new Float64Array(h+1),v=new Float64Array(h),g=new Int32Array(h),m=d=>{let x=0;f[0]=0,p[0]=-s,p[1]=s;for(let _=1;_<d;_++){let w=(u[_]+_*_-(u[f[x]]+f[x]*f[x]))/(2*_-2*f[x]);for(;w<=p[x];)x--,w=(u[_]+_*_-(u[f[x]]+f[x]*f[x]))/(2*_-2*f[x]);x++,f[x]=_,p[x]=w,p[x+1]=s}x=0;for(let _=0;_<d;_++){for(;p[x+1]<_;)x++;v[_]=(_-f[x])*(_-f[x])+u[f[x]],g[_]=f[x]}};for(let d=0;d<n;d++){for(let x=0;x<i;x++)u[x]=r[x*n+d];m(i);for(let x=0;x<i;x++)r[x*n+d]=v[x],l[x*n+d]=g[x]}for(let d=0;d<i;d++){for(let x=0;x<n;x++)u[x]=r[d*n+x];m(n);for(let x=0;x<n;x++)r[d*n+x]=v[x],c[d*n+x]=l[d*n+g[x]]*n+g[x]}return{d2:r,near:c}}function Lu(a,e,t,n){const{nx:i,nz:o,n:s,step:r,h:l}=a,c=new Uint8Array(s);for(let _=0;_<s;_++)c[_]=l[_]>0?1:0;Ru(a,c,e,t);const{d2:h,near:u}=Wc(a,c,1),f=new Float32Array(s),p=(n/r+2)**2,v=Math.min(...e.map(_=>_[0]))-n,g=Math.max(...e.map(_=>_[0]))+n,m=Math.min(...e.map(_=>_[1]))-n,d=Math.max(...e.map(_=>_[1]))+n,x=(_,w)=>_>v&&_<g&&w>m&&w<d?No(e,_,w)-t:1/0;for(let _=0;_<s;_++){const w=_%i,E=(_-w)/i,k=a.x0+w*r,T=a.z0+E*r;if(c[_]){const S=l[_]>0&&(w>0&&!c[_-1]||w<i-1&&!c[_+1]||E>0&&!c[_-i]||E<o-1&&!c[_+i]);f[_]=l[_]>0?S?-Gs(a,w,E,k,T):-r:Math.min(0,x(k,T))}else if(h[_]>p)f[_]=Math.sqrt(h[_])*r;else{const S=u[_],M=S%i,b=Math.min(Gs(a,M,(S-M)/i,k,T),x(k,T));f[_]=b<1/0?b:Math.sqrt(h[_])*r}}return f}const Nu=new Float64Array(8);function Gs(a,e,t,n,i){const{nx:o,nz:s,step:r,h:l}=a,c=Nu;let h=1/0;for(let u=Math.max(0,t-2);u<=Math.min(s-2,t+1);u++)for(let f=Math.max(0,e-2);f<=Math.min(o-2,e+1);f++){const p=u*o+f,v=l[p],g=l[p+1],m=l[p+o+1],d=l[p+o],x=a.x0+f*r,_=a.z0+u*r;let w=Li(c,0,v,g,x,_,r,0);w=Li(c,w,g,m,x+r,_,0,r),w=Li(c,w,m,d,x+r,_+r,-r,0),w=Li(c,w,d,v,x,_+r,0,-r);for(let E=0;E+3<w;E+=4)h=Math.min(h,Du(n,i,c[E],c[E+1],c[E+2],c[E+3]))}return h}function Li(a,e,t,n,i,o,s,r){if(t>0==n>0)return e;const l=t/(t-n);return a[e]=i+s*l,a[e+1]=o+r*l,e+2}function Du(a,e,t,n,i,o){const s=i-t,r=o-n,l=s*s+r*r,c=l?rt(((a-t)*s+(e-n)*r)/l,0,1):0;return Math.hypot(t+s*c-a,n+r*c-e)}function Et(a,e,t,n){const i=rt((t-a.x0)/a.step,0,a.nx-1.001),o=rt((n-a.z0)/a.step,0,a.nz-1.001),s=Math.floor(i),r=Math.floor(o),l=i-s,c=o-r,h=r*a.nx+s;return(e[h]*(1-l)+e[h+1]*l)*(1-c)+(e[h+a.nx]*(1-l)+e[h+a.nx+1]*l)*c}function qc(a,e,t,n){const i=a.step;return[Et(a,e,t+i,n)-Et(a,e,t-i,n),Et(a,e,t,n+i)-Et(a,e,t,n-i)]}function Ua(a,e,t){const n=a.step*3,i=Et(a,a.h,e-n,t)-Et(a,a.h,e+n,t),o=Et(a,a.h,e,t-n)-Et(a,a.h,e,t+n),s=Math.hypot(i,o)||1;return[i/s,o/s]}const sn=8;function Yo(a){const{nx:e,nz:t,h:n}=a,i=Math.ceil((e-1)/sn),o=Math.ceil((t-1)/sn),s=new Float32Array(i*o).fill(1/0),r=new Float32Array(i*o).fill(-1/0);for(let l=0;l<t;l++){const c=Math.max(0,Math.floor((l-1)/sn)),h=Math.min(o-1,Math.floor(l/sn));for(let u=0;u<e;u++){const f=n[l*e+u],p=Math.max(0,Math.floor((u-1)/sn)),v=Math.min(i-1,Math.floor(u/sn));for(let g=c;g<=h;g++)for(let m=p;m<=v;m++){const d=g*i+m;f<s[d]&&(s[d]=f),f>r[d]&&(r[d]=f)}}}return{...a,blocks:{bx:i,bz:o,lo:s,hi:r}}}let jo={first:new Int32Array(0),second:new Int32Array(0)};function Zn(a,e){const{nx:t,nz:n,x0:i,z0:o,step:s,h:r}=a;jo.first.length<t*n*2&&(jo={first:new Int32Array(t*n*2).fill(-1),second:new Int32Array(t*n*2).fill(-1)});const{first:l,second:c}=jo,h=[],u=[],f=(_,w)=>{const E=h.length;h.push(_),u.push(w),l[_]<0?l[_]=E:c[_]=E,l[w]<0?l[w]=E:c[w]=E},p=_=>{const w=r[_],E=r[_+1],k=r[_+t+1],T=r[_+t],S=w>e|(E>e)<<1|(k>e)<<2|(T>e)<<3;if(S===0||S===15)return;const M=_*2,b=(_+1)*2+1,D=(_+t)*2,N=_*2+1;if(S===5||S===10){const R=(w+E+k+T)/4>e;S===5===R?(f(M,b),f(D,N)):(f(N,M),f(b,D));return}let V=-1;for(const[R,U]of[[(S&1)!==(S&2)>>1,M],[(S&2)>>1!==(S&4)>>2,b],[(S&4)>>2!==(S&8)>>3,D],[(S&8)>>3!==(S&1),N]])R&&(V<0?V=U:f(V,U))},v=a.blocks;if(v){const{bx:_,bz:w,lo:E,hi:k}=v;for(let T=0;T<w;T++)for(let S=0;S<_;S++){if(e<E[T*_+S]||e>=k[T*_+S])continue;const M=Math.min(n-1,(T+1)*sn),b=Math.min(t-1,(S+1)*sn);for(let D=T*sn;D<M;D++)for(let N=S*sn;N<b;N++)p(D*t+N)}}else for(let _=0;_<n-1;_++)for(let w=0;w<t-1;w++)p(_*t+w);const g=_=>{const w=_>>1,E=w%t,k=(w-E)/t,T=r[w];if(_&1){const M=(e-T)/(r[w+t]-T);return[i+E*s,o+(k+M)*s]}const S=(e-T)/(r[w+1]-T);return[i+(E+S)*s,o+k*s]},m=new Uint8Array(h.length),d=(_,w,E)=>{let k=_,T=w;for(;;){const S=l[T]===k?c[T]:l[T];if(S<0||m[S])return T;m[S]=1,T=h[S]===T?u[S]:h[S],E.push(T),k=S}},x=[];for(let _=0;_<h.length;_++){if(m[_])continue;m[_]=1;const w=[u[_]],E=d(_,u[_],w),k=[];d(_,h[_],k);const T=[...k.reverse(),h[_],...w];x.push({pts:T.map(g),closed:T[0]===E&&T.length>3})}for(let _=0;_<h.length;_++)l[h[_]]=l[u[_]]=-1,c[h[_]]=c[u[_]]=-1;return x}function ti(a,e,t){return{closed:a.closed,pts:Ei(ja(a.pts,a.closed,e),t)}}function $o(a,e){const t=a.length>2&&Ba(a[0],a.at(-1))<1e-9,n=t?a.length-1:a.length,i=a.slice(0,n).map(e),o=(c,h)=>[(c[0]+h[0])/2,(c[1]+h[1])/2];if(i.every(Boolean))return[a];const s=t?i.indexOf(!1):0,r=[];let l=null;for(let c=0;c<n;c++){const h=(s+c)%n,u=t||h>0?a[(h-1+n)%n]:null;i[h]?(l||(l=u?[o(u,a[h])]:[],r.push(l)),l.push(a[h])):l&&(l.push(o(u,a[h])),l=null)}return l&&t&&l.push(o(a[(s-1+n)%n],a[s])),r.filter(c=>c.length>1)}function ja(a,e,t){let n=a;for(let i=0;i<t;i++){const o=e?[]:[n[0]];for(let s=0;s<n.length-1;s++){const[r,l]=n[s],[c,h]=n[s+1];o.push([r*.75+c*.25,l*.75+h*.25],[r*.25+c*.75,l*.25+h*.75])}e?o.push(o[0]):o.push(n.at(-1)),n=o}return n}function Ei(a,e){if(a.length<3)return a;const t=new Uint8Array(a.length);t[0]=t[a.length-1]=1;const n=[[0,a.length-1]];for(;n.length;){const[i,o]=n.pop(),[s,r]=a[i],[l,c]=a[o],h=l-s,u=c-r,f=Math.hypot(h,u);let p=-1,v=e;for(let g=i+1;g<o;g++){const[m,d]=a[g],x=f>1e-9?Math.abs((m-s)*u-(d-r)*h)/f:Math.hypot(m-s,d-r);x>v&&(v=x,p=g)}p>=0&&(t[p]=1,n.push([i,p],[p,o]))}return a.filter((i,o)=>t[o])}function or(a,e){const t=[a[0]];let n=0;for(let i=1;i<a.length;i++){const[o,s]=a[i-1],[r,l]=a[i],c=Math.hypot(r-o,l-s);let h=e-n;for(;h<=c;)t.push([o+(r-o)*h/c,s+(l-s)*h/c]),h+=e;n=c-(h-e)}return t}function Xc(a){return a.map((e,t)=>{const n=a[Math.max(0,t-1)],i=a[Math.min(a.length-1,t+1)],o=i[0]-n[0],s=i[1]-n[1],r=Math.hypot(o,s)||1;return[e[0],e[1],-s/r,o/r]})}function Yc(a){let e=0;for(let t=1;t<a.length;t++)e+=Ba(a[t-1],a[t]);return e}function Uu(a,e){for(let t=1;t<a.length;t++){const n=Ba(a[t-1],a[t]);if(e<=n||t===a.length-1){const i=n?rt(e/n,0,1):0,[o,s]=a[t-1],[r,l]=a[t];return[o+(r-o)*i,s+(l-s)*i,(r-o)/(n||1),(l-s)/(n||1)]}e-=n}return[...a[0],1,0]}function jc(a,e,t,n){return rr(a,sr(a,e,t),n)}function sr(a,e,t){let n=0,i=1/0;for(let o=0;o<a.length;o++){const s=(a[o][0]-e)**2+(a[o][1]-t)**2;s<i&&(i=s,n=o)}return n}function rr(a,e,t){const n=a.length-1;let i=Math.abs(t);const o=t<0?-1:1;for(;i>0;){const s=(e+o+n)%n,r=Ba(a[e],a[s]);if(r>=i){const l=i/r;return[a[e][0]+(a[s][0]-a[e][0])*l,a[e][1]+(a[s][1]-a[e][1])*l]}i-=r,e=s}return a[e]}function lr(a,e,t,n,i){const o=n.map(r=>r.at(-1)),s=sr(a,e,t);return[-1,1].map(r=>{for(let l=.1*i;l<8*i;l+=.1*i){const[c,h]=rr(a,s,r*l);if(o.some(([u,f])=>Math.hypot(c-u,h-f)<.25*i))return{s:r,gap:l}}return{s:r,gap:8*i}})}function No(a,e,t){const[n,i]=Ti(a,e,t);return Math.hypot(n-e,i-t)}function Ti(a,e,t){let n=a[0],i=1/0;for(let o=1;o<a.length;o++){const[s,r]=a[o-1],[l,c]=a[o],h=l-s,u=c-r,f=h*h+u*u,p=f?rt(((e-s)*h+(t-r)*u)/f,0,1):0,v=s+h*p,g=r+u*p,m=(v-e)**2+(g-t)**2;m<i&&(i=m,n=[v,g])}return n}function Iu(a,e){for(let t=1;t<a.length;t++){const[n,i]=[a[t-1],a[t]];for(let o=1;o<e.length;o++){const[s,r]=[e[o-1],e[o]],l=i[0]-n[0],c=i[1]-n[1],h=r[0]-s[0],u=r[1]-s[1],f=l*u-c*h;if(!f)continue;const p=((s[0]-n[0])*u-(s[1]-n[1])*h)/f,v=((s[0]-n[0])*c-(s[1]-n[1])*l)/f;if(p>=0&&p<=1&&v>=0&&v<=1)return[n[0]+l*p,n[1]+c*p]}}return null}function Do(a){const e=a.map(s=>s[0]),t=a.map(s=>s[1]),n=(Math.min(...e)+Math.max(...e))/2,i=(Math.min(...t)+Math.max(...t))/2;let o=0;for(const[s,r]of a)o=Math.max(o,Math.hypot(s-n,r-i));return{x:n,z:i,r:o}}function Ko({x:a,z:e,w:t,h:n,ang:i}){const o=Math.cos(i),s=Math.sin(i);return[[-t/2,-n/2],[t/2,-n/2],[t/2,n/2],[-t/2,n/2]].map(([r,l])=>[a+r*o-l*s,e+r*s+l*o])}function Fu(a){const e=a.slice().sort((o,s)=>o[0]-s[0]||o[1]-s[1]),t=(o,s,r)=>(s[0]-o[0])*(r[1]-o[1])-(s[1]-o[1])*(r[0]-o[0]),n=[];for(const o of e){for(;n.length>=2&&t(n.at(-2),n.at(-1),o)<=0;)n.pop();n.push(o)}const i=[];for(const o of e.reverse()){for(;i.length>=2&&t(i.at(-2),i.at(-1),o)<=0;)i.pop();i.push(o)}return n.slice(0,-1).concat(i.slice(0,-1))}function Mi(a,e,t){let n=!1;for(let i=0,o=a.length-1;i<a.length;o=i++){const[s,r]=a[i],[l,c]=a[o];r>t!=c>t&&e<(l-s)*(t-r)/(c-r)+s&&(n=!n)}return n}function Zo(a){let e=0;for(let t=1;t<a.length;t++)e+=a[t-1][0]*a[t][1]-a[t][0]*a[t-1][1];return e/2}function Wt(a){return[Math.sin(a),-Math.cos(a)]}function cr(a,e){return zn(Math.atan2(a,-e))}function zn(a){return(a%qe+qe)%qe}function hr(a,e){let t=(a-e)%qe;return t>Math.PI&&(t-=qe),t<=-Math.PI&&(t+=qe),t}function ea(a,e){return zn(e-a)}function Ba(a,e){return Math.hypot(e[0]-a[0],e[1]-a[1])}function rt(a,e,t){return a<e?e:a>t?t:a}function en(a,e,t){const n=rt((t-a)/(e-a),0,1);return n*n*(3-2*n)}function zu(a){let e=a>>>0;return()=>{e=e+2654435769>>>0;let t=e^e>>>16;return t=Math.imul(t,569420461),t^=t>>>15,t=Math.imul(t,1935289751),t^=t>>>15,(t>>>0)/4294967296}}function Ni(a,e,t){let n=Math.imul(a|0,668265261)^Math.imul(e|0,374761393)^Math.imul(t|0,2654435761);return n=Math.imul(n^n>>>15,2246822507),n^=n>>>13,n=Math.imul(n,3266489909),n^=n>>>16,(n>>>0)/4294967296*2-1}function $c(a){return(e,t)=>{const n=Math.floor(e),i=Math.floor(t),o=e-n,s=t-i,r=o*o*(3-2*o),l=s*s*(3-2*s),c=Ni(n,i,a),h=Ni(n+1,i,a),u=Ni(n,i+1,a),f=Ni(n+1,i+1,a);return(c+(h-c)*r)*(1-l)+(u+(f-u)*r)*l}}function Hs(a){const e=$c(Math.floor(a));return t=>e(t,.5)}class Ou{constructor(e){this.ids=new Int32Array(e*4),this.keys=new Float64Array(e*4),this.size=0,this.key=0}push(e,t){if(this.size===this.ids.length){const i=new Int32Array(this.ids.length*2),o=new Float64Array(this.keys.length*2);i.set(this.ids),o.set(this.keys),this.ids=i,this.keys=o}let n=this.size++;for(;n>0;){const i=n-1>>1;if(this.keys[i]<=t)break;this.ids[n]=this.ids[i],this.keys[n]=this.keys[i],n=i}this.ids[n]=e,this.keys[n]=t}pop(){const e=this.ids[0];this.key=this.keys[0];const t=this.ids[--this.size],n=this.keys[this.size];let i=0;for(;;){let o=2*i+1;if(o>=this.size||(o+1<this.size&&this.keys[o+1]<this.keys[o]&&o++,this.keys[o]>=n))break;this.ids[i]=this.ids[o],this.keys[i]=this.keys[o],i=o}return this.ids[i]=t,this.keys[i]=n,e}}const Bu=Math.max(18,Math.min(65,Math.round(Fn.length/8))),Kc=Bu/.92,Nr=Math.max(4,Math.round(Math.sqrt(Kc/1.125))),wi={cols:Math.max(4,Math.round(Kc/Nr)),rows:Nr},Vs=21*wi.cols/9,Ws=14.5*wi.rows/8,tn={x0:-Vs,x1:Vs,z0:-Ws,z1:Ws},cn={w:2*Vs/wi.cols,h:2*Ws/wi.rows},un=1.5,ur={h:.12},Gu=ur.h/2+un,bi=1.45,Bn={slabs:{hx:Gu+.05,hz:.55},marks:{x0:-1.8,x1:2,z0:-.92,z1:bi},hides:{x0:-1.8,x1:2,z0:-1.3,z1:bi}};function Uo(a){let e=a>>>0;return()=>{e=e+1831565813>>>0;let t=e;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}const Ga={x:.35,z:.45},Hu=.08;function Vu(a,e){return Math.abs(a.x-e.x)<1.5*cn.w&&Math.abs(a.z-e.z)<1.5*cn.h}function Wu(a,e){const{cols:t,rows:n}=wi,i=[];for(let o=0;o<n;o++)for(let s=0;s<t;s++){const r=[tn.x0+(s+.5)*cn.w,tn.z0+(o+.5)*cn.h];if(a()<Hu&&e(r))continue;const l=r[0]+(a()-.5)*2*Ga.x,c=r[1]+(a()-.5)*2*Ga.z;i.push({x:l,z:c,dir:"h",cell:r})}return i}function Zc(){const a=(un+ur.h)/2;return[[-a,0],[a,0]]}function qu(a,e,t){const n=ou(a,e,t);if(!Ur(n,e,t))return n;let i=n,o=1/0;for(const s of Xu(a)){const r=Math.hypot(s[0]-e,s[1]-t);r<o&&!Ur(s,e,t)&&(i=s,o=r)}return i}const Dr=.5;function Ur([a,e],t,n){const{hx:i}=Bn.slabs;return Math.abs(a-t)<i+Dr&&e-n>-.55-Dr&&e-n<bi+.15}function Xu(a){if(a.line)return Ir(a.line);const{x:e,z:t}=a;if(a.hw!=null){const{hw:i,hh:o}=a;return Ir([[e-i,t-o],[e+i,t-o],[e+i,t+o],[e-i,t+o],[e-i,t-o]])}const n=Math.ceil(2*Math.PI*a.r/.05);return Array.from({length:n},(i,o)=>{const s=o/n*2*Math.PI;return[e+Math.cos(s)*a.r,t+Math.sin(s)*a.r]})}function Ir(a){const e=[a[0]];for(let t=1;t<a.length;t++){const[n,i]=a[t-1],[o,s]=a[t],r=Math.max(1,Math.ceil(Math.hypot(o-n,s-i)/.05));for(let l=1;l<=r;l++)e.push([n+(o-n)*l/r,i+(s-i)*l/r])}return e}function Jc(a,e,t){const n=Fr(a)%5-2,i=Fr(a+"#")%3;return ju(e.x,e.z,t.x,t.z,n*.09,i)}const Yu=.45;function ju(a,e,t,n,i,o){const s=t-a,r=n-e,l=Math.abs(s),c=Math.abs(r),h=Math.sign(s)||1,u=Math.sign(r)||1;let f;if(l>=c){const p=l-c,[v,g]=o===0?[p/2,p/2]:o===1?[0,p]:[p,0];f=[[a,e],[a+h*v,e],[t-h*g,n],[t,n]]}else{const p=c-l,[v,g]=o===0?[p/2,p/2]:o===1?[0,p]:[p,0];f=[[a,e],[a,e+u*v],[t,n-u*g],[t,n]]}if(i){const p=Math.hypot(s,r)||1,v=-r/p,g=s/p;f=f.map(([m,d])=>[m+v*i,d+g*i])}return f=f.filter((p,v)=>v===0||Math.hypot(p[0]-f[v-1][0],p[1]-f[v-1][1])>1e-4),$u(f,Yu)}function $u(a,e){if(a.length<3)return a;const t=[a[0]];for(let n=1;n<a.length-1;n++){const[i,o]=a[n-1],[s,r]=a[n],[l,c]=a[n+1],h=Math.hypot(s-i,r-o),u=Math.hypot(l-s,c-r),f=Math.min(e,h/2,u/2),p=[s+(i-s)/h*f,r+(o-r)/h*f],v=[s+(l-s)/u*f,r+(c-r)/u*f];for(let g=0;g<=6;g++){const m=g/6,d=1-m;t.push([d*d*p[0]+2*d*m*s+m*m*v[0],d*d*p[1]+2*d*m*r+m*m*v[1]])}}return t.push(a.at(-1)),t}function Fr(a){let e=2166136261;for(let t=0;t<a.length;t++)e=Math.imul(e^a.charCodeAt(t),16777619);return e>>>0}const Ku=6,Zu=60,Jo={depth:3,cap:40,dead:.1},Ju=12,Di={deal:3,turn:4},Qu=.5,ef=1/16,Ui=.12,zr=1.12,tf=.2,Or={fishpond:.15,loi:.15,kauhale:.15,halau:.15,lava:.2},nf=12.5,Ii={most:2.6,least:1.2,step:.1},af=Math.PI/18,of=[0,1,-1,2,-2,3,-3,4,-4,5,-5,6,-6],Vn={letter:5.5,gap:9,up:7,down:4.5,ppu:34*.965},Br=Math.PI/180,sf=[-8,2].flatMap(a=>[52.5,57.5].map(e=>({yaw:a*Br,pitch:e*Br})));class rf{constructor(e){const t=Uo(e);this.rng=t,this.island=iu(e,tn),this.features=this.island.places,this.featureOf=new Map(this.features.map(o=>[o.field,o])),this.clearPaths=new Map,this.fieldEnds=new Map,this.buried=this.features.filter(o=>Or[o.kind]).flatMap(o=>ff(o).map(s=>({pts:s,share:Or[o.kind],covered:new Set})));const n=Zc(),i=Wu(t,o=>this.whole(o)).map(o=>this.settle(o)).filter(Boolean);this.pairs=i.map(({x:o,z:s,dir:r},l)=>({id:l,x:o,z:s,dir:r,entry:null,history:[],turnedAt:-1/0,tiles:n.map(([c,h],u)=>({id:l*2+u,pair:l,index:u,x:o+c,z:s+h,stone:""}))})),this.tiles=this.pairs.flatMap(o=>o.tiles),this.used=new Set,this.turnCount=0,this.deal()}settle(e){let t=this.fits(e)?e:null;if(!t){const n=[];for(let i=-4;i<=4;i++)for(let o=-4;o<=4;o++)n.push({...e,x:e.cell[0]+i/4*Ga.x,z:e.cell[1]+o/4*Ga.z});n.sort((i,o)=>Math.hypot(i.x-e.x,i.z-e.z)-Math.hypot(o.x-e.x,o.z-e.z)),t=n.find(i=>this.fits(i))??null}if(t){const n=Qo(t);for(const{pts:i,covered:o}of this.buried)i.forEach((s,r)=>Vr(s,n)&&o.add(r))}return t}whole([e,t]){return this.clear({x0:e-1.5*cn.w,z0:t-1.5*cn.h,x1:e+1.5*cn.w,z1:t+1.5*cn.h})}fits(e){if(!this.clear(hf(e)))return!1;const t=Qo(e);return this.buried.every(({pts:n,share:i,covered:o})=>{let s=o.size;return n.forEach((r,l)=>!o.has(l)&&Vr(r,t)&&s++),s<=i*n.length})}clear(e){if(Lr(this.island,e.x0,e.z0,e.x1,e.z1))return!1;const t=this.island.compass,n=Math.max(e.x0-t.x,0,t.x-e.x1),i=Math.max(e.z0-t.z,0,t.z-e.z1);return Math.hypot(n,i)>=t.r*zr}deal(){const e=this.rng,t=g=>!g.nodeal&&!this.used.has(g.word)&&eu(g)>=Ju,n=g=>g[Math.floor(e()*g.length)],i=[...this.pairs];for(let g=i.length-1;g>0;g--){const m=Math.floor(e()*(g+1));[i[g],i[m]]=[i[m],i[g]]}const o=new Map,s=new Set,r=(g,m)=>{const{a:d,b:x}=g.entry;o.set(d,(o.get(d)??0)+m),o.set(x,(o.get(x)??0)+m),d===x&&(m>0?s.add(g):s.delete(g))},l=Math.max(1,Math.floor(this.pairs.length*ef)),c=g=>m=>{if(m.a!==m.b)return(o.get(m.a)??0)<Di.deal&&(o.get(m.b)??0)<Di.deal;if((o.get(m.a)??0)+2>Di.deal||s.size>=l)return!1;for(const d of s)if(Vu(d,g))return!1;return!0},h=[],u=new Set,f=new Set,p=g=>{for(const m of h)for(const d of g.tiles)for(const x of m.tiles)d.stone!==x.stone||Wo(d.stone)||Math.hypot(d.x-x.x,d.z-x.z)<=qo&&this.lineClear(d,x,d.stone)&&f.add(g).add(m)};for(const g of i){let m=null;const d=c(g),x=h.filter(_=>Math.hypot(_.x-g.x,_.z-g.z)<9);if(x.length&&f.size<Qu*h.length&&e()<.6){const _=n(x),w=e()<.5?_.entry.a:_.entry.b,E=(wo.get(w)??[]).filter(k=>t(k)&&Pr(k)>=3&&d(k));E.length&&(m=n(E))}for(const _ of[d,()=>!0])for(let w=5;!m&&w>=2;w--){const E=Fn.filter(k=>t(k)&&Pr(k)>=w&&_(k));E.length&&(m=n(E))}if(!m){u.add(g);continue}this.setWord(g,m),r(g,1),p(g),h.push(g)}const v=g=>[0,1].some(m=>Cn(g,m).some(d=>!this.used.has(d.word)));for(let g=0;g<4;g++){const m=h.filter(d=>!this.canTurn(d,1/0));if(!m.length)break;for(const d of m){r(d,-1);const x=Fn.filter(w=>t(w)&&v(w)),_=x.filter(c(d));x.length&&this.redeal(d,n(_.length?_:x)),r(d,1)}}u.size&&(this.pairs=this.pairs.filter(g=>!u.has(g)),this.pairs.forEach((g,m)=>{g.id=m,g.tiles.forEach((d,x)=>{d.id=m*2+x,d.pair=m})}),this.tiles=this.pairs.flatMap(g=>g.tiles))}redeal(e,t){this.used.delete(e.entry.word),e.entry=null,this.setWord(e,t)}setWord(e,t){e.entry&&(this.used.delete(e.entry.word),e.history.push(e.entry),e.history.length>Ku&&e.history.shift()),e.entry=t,this.used.add(t.word),e.tiles[0].stone=t.a,e.tiles[1].stone=t.b}targets(e,t,n=null){var l;const i=(l=e.history.at(-1))==null?void 0:l.word,o=t-e.turnedAt>=Zu,s=[];for(const c of n==null?[0,1]:[n])for(const h of Cn(e.entry,c)){if(this.used.has(h.word))continue;let u=0;if(e.history.some(f=>f.word===h.word)){if(!o)continue;u=h.word===i?2:1}s.push({index:c,entry:h,tier:u})}const r=Math.min(...s.map(c=>c.tier));return s.filter(c=>c.tier===r)}canTurn(e,t){return this.targets(e,t).length>0}canTurnTwice(e,t){return this.targets(e,t).some(({entry:n})=>[0,1].some(i=>Cn(n,i).some(o=>!this.used.has(o.word)&&!e.history.some(s=>s.word===o.word))))}chooseTurn(e,t,n=this.linkedFraction(),i=null){let o=this.targets(e,t,i);if(!o.length)return null;const s=new Map;for(const f of this.tiles)s.set(f.stone,(s.get(f.stone)??0)+1);const r=o.filter(({index:f,entry:p})=>(s.get(f===0?p.a:p.b)??0)<Di.turn);r.length&&(o=r);const l=e.tiles.map(f=>this.tiles.filter(p=>p.pair!==e.id&&Math.hypot(p.x-f.x,p.z-f.z)<=qo)),c=(f,p)=>!Wo(p)&&l[f].some(v=>v.stone===p&&this.lineClear(e.tiles[f],v,p)),h=o.map(({index:f,entry:p,tier:v})=>{const g=c(f,f===0?p.a:p.b),m=c(f,e.tiles[f].stone);let d=1;g&&(d+=n<.5?6:n>.55?0:1.5),m&&n>.55&&(d+=3),p.field!==e.entry.field&&(d+=.6);const x=this.reach(e,p);return d*=x===0?Jo.dead:x,{index:f,entry:p,tier:v,w:d}});let u=Math.random()*h.reduce((f,p)=>f+p.w,0);for(const f of h)if((u-=f.w)<=0)return f;return h.at(-1)}reach(e,t){const n=new Set(e.history.map(s=>s.word)).add(e.entry.word).add(t.word);let i=[t],o=0;for(let s=0;s<Jo.depth&&i.length;s++){const r=[];for(const l of i)for(const c of[0,1])for(const h of Cn(l,c))if(!(n.has(h.word)||this.used.has(h.word))&&(n.add(h.word),r.push(h),++o>=Jo.cap))return o;i=r}return o}turn(e,t,n){this.setWord(e,t.entry),e.turnedAt=n,this.turnCount++}linkedPairs(){const e=new Set;for(const t of this.desiredLinks().values())t.kind==="pair"&&e.add(t.a.pair).add(t.b.pair);return e}linkedFraction(){return this.linkedPairs().size/Math.max(1,this.pairs.length)}desiredLinks(){const e=new Map;for(const i of this.tiles){if(Wo(i.stone))continue;let o=e.get(i.stone);o||e.set(i.stone,o=[]),o.push(i)}const t=new Map,n=new Set;for(const[i,o]of e){if(o.length<2)continue;const s=[];for(let c=0;c<o.length;c++)for(let h=c+1;h<o.length;h++){if(o[c].pair===o[h].pair)continue;const u=Math.hypot(o[c].x-o[h].x,o[c].z-o[h].z);u<=qo&&this.lineClear(o[c],o[h],i)&&s.push([u,c,h])}s.sort((c,h)=>c[0]-h[0]);const r=o.map((c,h)=>h),l=c=>r[c]===c?c:r[c]=l(r[c]);for(const[,c,h]of s){const u=l(c),f=l(h);if(u===f)continue;r[u]=f;const[p,v]=Gr(o[c],o[h]),g=Hr(p,v,i);t.set(g,{key:g,kind:"pair",stone:i,a:p,b:v}),n.add(p.pair).add(v.pair)}}for(const i of this.pairs){if(n.has(i.id))continue;const o=i.entry.field,s=`f:${i.id}:${o}`,r=this.featureOf.get(o);t.set(s,{key:s,kind:"field",pair:i,feature:r,...this.fieldEnd(s,i,r)})}return t}lineClear(e,t,n){const[i,o]=Gr(e,t),s=Hr(i,o,n);let r=this.clearPaths.get(s);if(r===void 0){const l=Jc(s,i,o);r=l.every((c,h)=>h===0||this.reaches(l[h-1],c)===null),this.clearPaths.set(s,r)}return r}fieldEnd(e,t,n){let i=this.fieldEnds.get(e);if(i)return i;const o=qu(n,t.x,t.z),s=n.kind==="compass",r=Math.hypot(o[0]-t.x,o[1]-t.z),l=this.reaches([t.x,t.z],o,s)??1/0,c=Math.atan2(o[1]-t.z,o[0]-t.x);return i=r<=Math.min(nf,l)?{end:o,stub:!1}:this.connector(t,c,l,s,pi[n.field].label),this.fieldEnds.set(e,i),i}connector(e,t,n,i,o){const s=[e.x,e.z],r=(u,f)=>[e.x+Math.cos(u)*f,e.z+Math.sin(u)*f],l=(u,f)=>Math.min(Ii.most,(u===0?n:this.reaches(s,r(f,Ii.most+.3),i)??1/0)-.3);let c=r(t,Math.max(0,l(0,t))),h=1/0;for(const u of of){const f=t+u*af;for(let p=l(u,f);p>=Ii.least;p-=Ii.step){if(p-cf(f)<.3)continue;const v=r(f,p),g=this.cover(v,f,o);if(g===0)return{end:v,stub:!0};g<h&&(h=g,c=v)}}return{end:c,stub:!0}}cover(e,t,n){const i=lf(e,t,n);return this.clear(i)?this.pairs.reduce((o,s)=>o+uf(i,Qo(s)),0):1/0}reaches(e,t,n=!1){const i=this.reachesUpland(e,t),o=n?null:this.reachesCompass(e,t);return i===null?o:o===null?i:Math.min(i,o)}reachesUpland([e,t],[n,i]){const o=Math.hypot(n-e,i-t),s=Math.ceil(o/.1);for(let r=0;r<=s;r++){const l=e+(n-e)*r/s,c=t+(i-t)*r/s;if(Lr(this.island,l-Ui,c-Ui,l+Ui,c+Ui))return o*r/s}return null}reachesCompass([e,t],[n,i]){const o=this.island.compass,s=o.r*zr+tf,r=n-e,l=i-t,c=e-o.x,h=t-o.z,u=r*r+l*l,f=c*r+h*l,p=c*c+h*h-s*s;if(p<=0)return 0;const v=f*f-u*p;if(v<0||u===0)return null;const g=(-f-Math.sqrt(v))/u;return g>=0&&g<=1?g*Math.sqrt(u):null}}function lf([a,e],t,n){const i=n.length*Vn.letter,o=Math.cos(t),s=Math.sin(t),r={x0:a,x1:a,z0:e,z1:e};for(const{yaw:l,pitch:c}of sf){const h=Math.cos(l),u=Math.sin(l),f=Math.sin(c),p=Math.atan2(f*(u*o+h*s),h*o-u*s),v=Math.cos(p)*Vn.gap,g=Math.sin(p)*Vn.gap;for(const m of Math.cos(p)>=0?[v,v+i]:[v-i,v])for(const d of[g-Vn.up,g+Vn.down]){const x=a+(h*m+u*d/f)/Vn.ppu,_=e+(-u*m+h*d/f)/Vn.ppu;r.x0=Math.min(r.x0,x),r.x1=Math.max(r.x1,x),r.z0=Math.min(r.z0,_),r.z1=Math.max(r.z1,_)}}return r}function cf(a){const{hx:e,hz:t}=Bn.slabs;return Math.min(e/Math.abs(Math.cos(a)||1e-9),t/Math.abs(Math.sin(a)||1e-9))}function Gr(a,e){return a.id<e.id?[a,e]:[e,a]}function Hr(a,e,t){return`p:${a.id}-${e.id}:${t}`}function hf(a){return Qc(Bn.marks,a.x,a.z)}function Qo(a){return Qc(Bn.hides,a.x,a.z)}function Qc(a,e,t){return{x0:e+a.x0,z0:t+a.z0,x1:e+a.x1,z1:t+a.z1}}function Vr([a,e],t){return a>t.x0&&a<t.x1&&e>t.z0&&e<t.z1}function uf(a,e){const t=Math.min(a.x1,e.x1)-Math.max(a.x0,e.x0),n=Math.min(a.z1,e.z1)-Math.max(a.z0,e.z0);return t>0&&n>0?t*n:0}const es={halau:a=>[a.shed,...a.hulls],fishpond:a=>[a.line],lava:a=>[a.line],loi:a=>[a.line]};function ff(a){var u;const e=(u=es[a.kind])==null?void 0:u.call(es,a),t=e?e.flat():[[a.x-a.hw,a.z-a.hh],[a.x+a.hw,a.z+a.hh]],n=t.map(f=>f[0]),i=t.map(f=>f[1]),[o,s,r,l]=[Math.min(...n),Math.max(...n),Math.min(...i),Math.max(...i)],c=24,h=[];for(let f=0;f<c;f++)for(let p=0;p<c;p++){const v=o+(s-o)*(f+.5)/c,g=r+(l-r)*(p+.5)/c;(!e||e.some(m=>pf(m,v,g)))&&h.push([v,g])}return e?[h,e.flatMap(f=>df(f,48))]:[h]}function df(a,e){const t=[0];for(let i=1;i<a.length;i++)t.push(t[i-1]+Math.hypot(a[i][0]-a[i-1][0],a[i][1]-a[i-1][1]));const n=[];for(let i=0,o=1;i<e;i++){const s=t.at(-1)*(i+.5)/e;for(;t[o]<s;)o++;const r=(s-t[o-1])/(t[o]-t[o-1]||1);n.push([a[o-1][0]+(a[o][0]-a[o-1][0])*r,a[o-1][1]+(a[o][1]-a[o-1][1])*r])}return n}function pf(a,e,t){let n=!1;for(let i=0,o=a.length-1;i<a.length;o=i++){const[s,r]=a[i],[l,c]=a[o];r>t!=c>t&&e<(l-s)*(t-r)/(c-r)+s&&(n=!n)}return n}/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const fr="160",mf=0,Wr=1,gf=2,eh=1,vf=2,on=3,On=0,Dt=1,xn=2,Dn=0,Ia=1,qr=2,Xr=3,Yr=4,_f=5,Jn=100,xf=101,Mf=102,jr=103,$r=104,wf=200,bf=201,Sf=202,yf=203,qs=204,Xs=205,kf=206,Ef=207,Tf=208,Af=209,Pf=210,Rf=211,Cf=212,Lf=213,Nf=214,Df=0,Uf=1,If=2,bo=3,Ff=4,zf=5,Of=6,Bf=7,th=0,Gf=1,Hf=2,Un=0,Vf=1,Wf=2,qf=3,Xf=4,Yf=5,jf=6,nh=300,Ha=301,Va=302,Ys=303,js=304,Io=306,$s=1e3,Jt=1001,Ks=1002,wt=1003,Kr=1004,ts=1005,Ot=1006,$f=1007,Wa=1008,In=1009,Kf=1010,Zf=1011,dr=1012,ah=1013,Ln=1014,Nn=1015,Si=1016,ih=1017,oh=1018,ta=1020,Jf=1021,Qt=1023,Qf=1024,ed=1025,na=1026,qa=1027,td=1028,sh=1029,rh=1030,lh=1031,ch=1033,ns=33776,as=33777,is=33778,os=33779,Zr=35840,Jr=35841,Qr=35842,el=35843,hh=36196,tl=37492,nl=37496,al=37808,il=37809,ol=37810,sl=37811,rl=37812,ll=37813,cl=37814,hl=37815,ul=37816,fl=37817,dl=37818,pl=37819,ml=37820,gl=37821,ss=36492,vl=36494,_l=36495,nd=36283,xl=36284,Ml=36285,wl=36286,uh=3e3,aa=3001,ad=3200,id=3201,fh=0,od=1,Vt="",vt="srgb",bn="srgb-linear",pr="display-p3",Fo="display-p3-linear",So="linear",tt="srgb",yo="rec709",ko="p3",ha=7680,bl=519,sd=512,rd=513,ld=514,dh=515,cd=516,hd=517,ud=518,fd=519,Sl=35044,yl="300 es",Zs=1035,Mn=2e3,Eo=2001;class $a{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const i=this._listeners[e];if(i!==void 0){const o=i.indexOf(t);o!==-1&&i.splice(o,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let o=0,s=i.length;o<s;o++)i[o].call(this,e);e.target=null}}}const yt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let kl=1234567;const mi=Math.PI/180,yi=180/Math.PI;function Ka(){const a=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(yt[a&255]+yt[a>>8&255]+yt[a>>16&255]+yt[a>>24&255]+"-"+yt[e&255]+yt[e>>8&255]+"-"+yt[e>>16&15|64]+yt[e>>24&255]+"-"+yt[t&63|128]+yt[t>>8&255]+"-"+yt[t>>16&255]+yt[t>>24&255]+yt[n&255]+yt[n>>8&255]+yt[n>>16&255]+yt[n>>24&255]).toLowerCase()}function Ct(a,e,t){return Math.max(e,Math.min(t,a))}function mr(a,e){return(a%e+e)%e}function dd(a,e,t,n,i){return n+(a-e)*(i-n)/(t-e)}function pd(a,e,t){return a!==e?(t-a)/(e-a):0}function gi(a,e,t){return(1-t)*a+t*e}function md(a,e,t,n){return gi(a,e,1-Math.exp(-t*n))}function gd(a,e=1){return e-Math.abs(mr(a,e*2)-e)}function vd(a,e,t){return a<=e?0:a>=t?1:(a=(a-e)/(t-e),a*a*(3-2*a))}function _d(a,e,t){return a<=e?0:a>=t?1:(a=(a-e)/(t-e),a*a*a*(a*(a*6-15)+10))}function xd(a,e){return a+Math.floor(Math.random()*(e-a+1))}function Md(a,e){return a+Math.random()*(e-a)}function wd(a){return a*(.5-Math.random())}function bd(a){a!==void 0&&(kl=a);let e=kl+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Sd(a){return a*mi}function yd(a){return a*yi}function Js(a){return(a&a-1)===0&&a!==0}function kd(a){return Math.pow(2,Math.ceil(Math.log(a)/Math.LN2))}function To(a){return Math.pow(2,Math.floor(Math.log(a)/Math.LN2))}function Ed(a,e,t,n,i){const o=Math.cos,s=Math.sin,r=o(t/2),l=s(t/2),c=o((e+n)/2),h=s((e+n)/2),u=o((e-n)/2),f=s((e-n)/2),p=o((n-e)/2),v=s((n-e)/2);switch(i){case"XYX":a.set(r*h,l*u,l*f,r*c);break;case"YZY":a.set(l*f,r*h,l*u,r*c);break;case"ZXZ":a.set(l*u,l*f,r*h,r*c);break;case"XZX":a.set(r*h,l*v,l*p,r*c);break;case"YXY":a.set(l*p,r*h,l*v,r*c);break;case"ZYZ":a.set(l*v,l*p,r*h,r*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function Pa(a,e){switch(e.constructor){case Float32Array:return a;case Uint32Array:return a/4294967295;case Uint16Array:return a/65535;case Uint8Array:return a/255;case Int32Array:return Math.max(a/2147483647,-1);case Int16Array:return Math.max(a/32767,-1);case Int8Array:return Math.max(a/127,-1);default:throw new Error("Invalid component type.")}}function Pt(a,e){switch(e.constructor){case Float32Array:return a;case Uint32Array:return Math.round(a*4294967295);case Uint16Array:return Math.round(a*65535);case Uint8Array:return Math.round(a*255);case Int32Array:return Math.round(a*2147483647);case Int16Array:return Math.round(a*32767);case Int8Array:return Math.round(a*127);default:throw new Error("Invalid component type.")}}const Ra={DEG2RAD:mi,RAD2DEG:yi,generateUUID:Ka,clamp:Ct,euclideanModulo:mr,mapLinear:dd,inverseLerp:pd,lerp:gi,damp:md,pingpong:gd,smoothstep:vd,smootherstep:_d,randInt:xd,randFloat:Md,randFloatSpread:wd,seededRandom:bd,degToRad:Sd,radToDeg:yd,isPowerOfTwo:Js,ceilPowerOfTwo:kd,floorPowerOfTwo:To,setQuaternionFromProperEuler:Ed,normalize:Pt,denormalize:Pa};class He{constructor(e=0,t=0){He.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Ct(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),o=this.x-e.x,s=this.y-e.y;return this.x=o*n-s*i+e.x,this.y=o*i+s*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ze{constructor(e,t,n,i,o,s,r,l,c){ze.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,o,s,r,l,c)}set(e,t,n,i,o,s,r,l,c){const h=this.elements;return h[0]=e,h[1]=i,h[2]=r,h[3]=t,h[4]=o,h[5]=l,h[6]=n,h[7]=s,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,o=this.elements,s=n[0],r=n[3],l=n[6],c=n[1],h=n[4],u=n[7],f=n[2],p=n[5],v=n[8],g=i[0],m=i[3],d=i[6],x=i[1],_=i[4],w=i[7],E=i[2],k=i[5],T=i[8];return o[0]=s*g+r*x+l*E,o[3]=s*m+r*_+l*k,o[6]=s*d+r*w+l*T,o[1]=c*g+h*x+u*E,o[4]=c*m+h*_+u*k,o[7]=c*d+h*w+u*T,o[2]=f*g+p*x+v*E,o[5]=f*m+p*_+v*k,o[8]=f*d+p*w+v*T,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],o=e[3],s=e[4],r=e[5],l=e[6],c=e[7],h=e[8];return t*s*h-t*r*c-n*o*h+n*r*l+i*o*c-i*s*l}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],o=e[3],s=e[4],r=e[5],l=e[6],c=e[7],h=e[8],u=h*s-r*c,f=r*l-h*o,p=c*o-s*l,v=t*u+n*f+i*p;if(v===0)return this.set(0,0,0,0,0,0,0,0,0);const g=1/v;return e[0]=u*g,e[1]=(i*c-h*n)*g,e[2]=(r*n-i*s)*g,e[3]=f*g,e[4]=(h*t-i*l)*g,e[5]=(i*o-r*t)*g,e[6]=p*g,e[7]=(n*l-c*t)*g,e[8]=(s*t-n*o)*g,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,o,s,r){const l=Math.cos(o),c=Math.sin(o);return this.set(n*l,n*c,-n*(l*s+c*r)+s+e,-i*c,i*l,-i*(-c*s+l*r)+r+t,0,0,1),this}scale(e,t){return this.premultiply(rs.makeScale(e,t)),this}rotate(e){return this.premultiply(rs.makeRotation(-e)),this}translate(e,t){return this.premultiply(rs.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const rs=new ze;function ph(a){for(let e=a.length-1;e>=0;--e)if(a[e]>=65535)return!0;return!1}function Ao(a){return document.createElementNS("http://www.w3.org/1999/xhtml",a)}function Td(){const a=Ao("canvas");return a.style.display="block",a}const El={};function vi(a){a in El||(El[a]=!0,console.warn(a))}const Tl=new ze().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Al=new ze().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Fi={[bn]:{transfer:So,primaries:yo,toReference:a=>a,fromReference:a=>a},[vt]:{transfer:tt,primaries:yo,toReference:a=>a.convertSRGBToLinear(),fromReference:a=>a.convertLinearToSRGB()},[Fo]:{transfer:So,primaries:ko,toReference:a=>a.applyMatrix3(Al),fromReference:a=>a.applyMatrix3(Tl)},[pr]:{transfer:tt,primaries:ko,toReference:a=>a.convertSRGBToLinear().applyMatrix3(Al),fromReference:a=>a.applyMatrix3(Tl).convertLinearToSRGB()}},Ad=new Set([bn,Fo]),Ye={enabled:!0,_workingColorSpace:bn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(a){if(!Ad.has(a))throw new Error(`Unsupported working color space, "${a}".`);this._workingColorSpace=a},convert:function(a,e,t){if(this.enabled===!1||e===t||!e||!t)return a;const n=Fi[e].toReference,i=Fi[t].fromReference;return i(n(a))},fromWorkingColorSpace:function(a,e){return this.convert(a,this._workingColorSpace,e)},toWorkingColorSpace:function(a,e){return this.convert(a,e,this._workingColorSpace)},getPrimaries:function(a){return Fi[a].primaries},getTransfer:function(a){return a===Vt?So:Fi[a].transfer}};function Fa(a){return a<.04045?a*.0773993808:Math.pow(a*.9478672986+.0521327014,2.4)}function ls(a){return a<.0031308?a*12.92:1.055*Math.pow(a,.41666)-.055}let ua;class mh{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{ua===void 0&&(ua=Ao("canvas")),ua.width=e.width,ua.height=e.height;const n=ua.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=ua}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Ao("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),o=i.data;for(let s=0;s<o.length;s++)o[s]=Fa(o[s]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Fa(t[n]/255)*255):t[n]=Fa(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Pd=0;class gh{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Pd++}),this.uuid=Ka(),this.data=e,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let o;if(Array.isArray(i)){o=[];for(let s=0,r=i.length;s<r;s++)i[s].isDataTexture?o.push(cs(i[s].image)):o.push(cs(i[s]))}else o=cs(i);n.url=o}return t||(e.images[this.uuid]=n),n}}function cs(a){return typeof HTMLImageElement<"u"&&a instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&a instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&a instanceof ImageBitmap?mh.getDataURL(a):a.data?{data:Array.from(a.data),width:a.width,height:a.height,type:a.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Rd=0;class Lt extends $a{constructor(e=Lt.DEFAULT_IMAGE,t=Lt.DEFAULT_MAPPING,n=Jt,i=Jt,o=Ot,s=Wa,r=Qt,l=In,c=Lt.DEFAULT_ANISOTROPY,h=Vt){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Rd++}),this.uuid=Ka(),this.name="",this.source=new gh(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=o,this.minFilter=s,this.anisotropy=c,this.format=r,this.internalFormat=null,this.type=l,this.offset=new He(0,0),this.repeat=new He(1,1),this.center=new He(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ze,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(vi("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===aa?vt:Vt),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==nh)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case $s:e.x=e.x-Math.floor(e.x);break;case Jt:e.x=e.x<0?0:1;break;case Ks:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case $s:e.y=e.y-Math.floor(e.y);break;case Jt:e.y=e.y<0?0:1;break;case Ks:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return vi("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===vt?aa:uh}set encoding(e){vi("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=e===aa?vt:Vt}}Lt.DEFAULT_IMAGE=null;Lt.DEFAULT_MAPPING=nh;Lt.DEFAULT_ANISOTROPY=1;class ct{constructor(e=0,t=0,n=0,i=1){ct.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,o=this.w,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*i+s[12]*o,this.y=s[1]*t+s[5]*n+s[9]*i+s[13]*o,this.z=s[2]*t+s[6]*n+s[10]*i+s[14]*o,this.w=s[3]*t+s[7]*n+s[11]*i+s[15]*o,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,o;const l=e.elements,c=l[0],h=l[4],u=l[8],f=l[1],p=l[5],v=l[9],g=l[2],m=l[6],d=l[10];if(Math.abs(h-f)<.01&&Math.abs(u-g)<.01&&Math.abs(v-m)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+g)<.1&&Math.abs(v+m)<.1&&Math.abs(c+p+d-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const _=(c+1)/2,w=(p+1)/2,E=(d+1)/2,k=(h+f)/4,T=(u+g)/4,S=(v+m)/4;return _>w&&_>E?_<.01?(n=0,i=.707106781,o=.707106781):(n=Math.sqrt(_),i=k/n,o=T/n):w>E?w<.01?(n=.707106781,i=0,o=.707106781):(i=Math.sqrt(w),n=k/i,o=S/i):E<.01?(n=.707106781,i=.707106781,o=0):(o=Math.sqrt(E),n=T/o,i=S/o),this.set(n,i,o,t),this}let x=Math.sqrt((m-v)*(m-v)+(u-g)*(u-g)+(f-h)*(f-h));return Math.abs(x)<.001&&(x=1),this.x=(m-v)/x,this.y=(u-g)/x,this.z=(f-h)/x,this.w=Math.acos((c+p+d-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Cd extends $a{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new ct(0,0,e,t),this.scissorTest=!1,this.viewport=new ct(0,0,e,t);const i={width:e,height:t,depth:1};n.encoding!==void 0&&(vi("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===aa?vt:Vt),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ot,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new Lt(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(e,t,n=1){(this.width!==e||this.height!==t||this.depth!==n)&&(this.width=e,this.height=t,this.depth=n,this.texture.image.width=e,this.texture.image.height=t,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.texture.isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new gh(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class sa extends Cd{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class vh extends Lt{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=wt,this.minFilter=wt,this.wrapR=Jt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ld extends Lt{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=wt,this.minFilter=wt,this.wrapR=Jt,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ai{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,o,s,r){let l=n[i+0],c=n[i+1],h=n[i+2],u=n[i+3];const f=o[s+0],p=o[s+1],v=o[s+2],g=o[s+3];if(r===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u;return}if(r===1){e[t+0]=f,e[t+1]=p,e[t+2]=v,e[t+3]=g;return}if(u!==g||l!==f||c!==p||h!==v){let m=1-r;const d=l*f+c*p+h*v+u*g,x=d>=0?1:-1,_=1-d*d;if(_>Number.EPSILON){const E=Math.sqrt(_),k=Math.atan2(E,d*x);m=Math.sin(m*k)/E,r=Math.sin(r*k)/E}const w=r*x;if(l=l*m+f*w,c=c*m+p*w,h=h*m+v*w,u=u*m+g*w,m===1-r){const E=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=E,c*=E,h*=E,u*=E}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,i,o,s){const r=n[i],l=n[i+1],c=n[i+2],h=n[i+3],u=o[s],f=o[s+1],p=o[s+2],v=o[s+3];return e[t]=r*v+h*u+l*p-c*f,e[t+1]=l*v+h*f+c*u-r*p,e[t+2]=c*v+h*p+r*f-l*u,e[t+3]=h*v-r*u-l*f-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,o=e._z,s=e._order,r=Math.cos,l=Math.sin,c=r(n/2),h=r(i/2),u=r(o/2),f=l(n/2),p=l(i/2),v=l(o/2);switch(s){case"XYZ":this._x=f*h*u+c*p*v,this._y=c*p*u-f*h*v,this._z=c*h*v+f*p*u,this._w=c*h*u-f*p*v;break;case"YXZ":this._x=f*h*u+c*p*v,this._y=c*p*u-f*h*v,this._z=c*h*v-f*p*u,this._w=c*h*u+f*p*v;break;case"ZXY":this._x=f*h*u-c*p*v,this._y=c*p*u+f*h*v,this._z=c*h*v+f*p*u,this._w=c*h*u-f*p*v;break;case"ZYX":this._x=f*h*u-c*p*v,this._y=c*p*u+f*h*v,this._z=c*h*v-f*p*u,this._w=c*h*u+f*p*v;break;case"YZX":this._x=f*h*u+c*p*v,this._y=c*p*u+f*h*v,this._z=c*h*v-f*p*u,this._w=c*h*u-f*p*v;break;case"XZY":this._x=f*h*u-c*p*v,this._y=c*p*u-f*h*v,this._z=c*h*v+f*p*u,this._w=c*h*u+f*p*v;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+s)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],o=t[8],s=t[1],r=t[5],l=t[9],c=t[2],h=t[6],u=t[10],f=n+r+u;if(f>0){const p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(h-l)*p,this._y=(o-c)*p,this._z=(s-i)*p}else if(n>r&&n>u){const p=2*Math.sqrt(1+n-r-u);this._w=(h-l)/p,this._x=.25*p,this._y=(i+s)/p,this._z=(o+c)/p}else if(r>u){const p=2*Math.sqrt(1+r-n-u);this._w=(o-c)/p,this._x=(i+s)/p,this._y=.25*p,this._z=(l+h)/p}else{const p=2*Math.sqrt(1+u-n-r);this._w=(s-i)/p,this._x=(o+c)/p,this._y=(l+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ct(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,o=e._z,s=e._w,r=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+s*r+i*c-o*l,this._y=i*h+s*l+o*r-n*c,this._z=o*h+s*c+n*l-i*r,this._w=s*h-n*r-i*l-o*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,i=this._y,o=this._z,s=this._w;let r=s*e._w+n*e._x+i*e._y+o*e._z;if(r<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,r=-r):this.copy(e),r>=1)return this._w=s,this._x=n,this._y=i,this._z=o,this;const l=1-r*r;if(l<=Number.EPSILON){const p=1-t;return this._w=p*s+t*this._w,this._x=p*n+t*this._x,this._y=p*i+t*this._y,this._z=p*o+t*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,r),u=Math.sin((1-t)*h)/c,f=Math.sin(t*h)/c;return this._w=s*u+this._w*f,this._x=n*u+this._x*f,this._y=i*u+this._y*f,this._z=o*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=Math.random(),t=Math.sqrt(1-e),n=Math.sqrt(e),i=2*Math.PI*Math.random(),o=2*Math.PI*Math.random();return this.set(t*Math.cos(i),n*Math.sin(o),n*Math.cos(o),t*Math.sin(i))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class Y{constructor(e=0,t=0,n=0){Y.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Pl.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Pl.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,o=e.elements;return this.x=o[0]*t+o[3]*n+o[6]*i,this.y=o[1]*t+o[4]*n+o[7]*i,this.z=o[2]*t+o[5]*n+o[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,o=e.elements,s=1/(o[3]*t+o[7]*n+o[11]*i+o[15]);return this.x=(o[0]*t+o[4]*n+o[8]*i+o[12])*s,this.y=(o[1]*t+o[5]*n+o[9]*i+o[13])*s,this.z=(o[2]*t+o[6]*n+o[10]*i+o[14])*s,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,o=e.x,s=e.y,r=e.z,l=e.w,c=2*(s*i-r*n),h=2*(r*t-o*i),u=2*(o*n-s*t);return this.x=t+l*c+s*u-r*h,this.y=n+l*h+r*c-o*u,this.z=i+l*u+o*h-s*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*i,this.y=o[1]*t+o[5]*n+o[9]*i,this.z=o[2]*t+o[6]*n+o[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,o=e.z,s=t.x,r=t.y,l=t.z;return this.x=i*l-o*r,this.y=o*s-n*l,this.z=n*r-i*s,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return hs.copy(this).projectOnVector(e),this.sub(hs)}reflect(e){return this.sub(hs.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Ct(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=(Math.random()-.5)*2,t=Math.random()*Math.PI*2,n=Math.sqrt(1-e**2);return this.x=n*Math.cos(t),this.y=n*Math.sin(t),this.z=e,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const hs=new Y,Pl=new Ai;class Pi{constructor(e=new Y(1/0,1/0,1/0),t=new Y(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(qt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(qt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=qt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const o=n.getAttribute("position");if(t===!0&&o!==void 0&&e.isInstancedMesh!==!0)for(let s=0,r=o.count;s<r;s++)e.isMesh===!0?e.getVertexPosition(s,qt):qt.fromBufferAttribute(o,s),qt.applyMatrix4(e.matrixWorld),this.expandByPoint(qt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),zi.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),zi.copy(n.boundingBox)),zi.applyMatrix4(e.matrixWorld),this.union(zi)}const i=e.children;for(let o=0,s=i.length;o<s;o++)this.expandByObject(i[o],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,qt),qt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ni),Oi.subVectors(this.max,ni),fa.subVectors(e.a,ni),da.subVectors(e.b,ni),pa.subVectors(e.c,ni),Sn.subVectors(da,fa),yn.subVectors(pa,da),Wn.subVectors(fa,pa);let t=[0,-Sn.z,Sn.y,0,-yn.z,yn.y,0,-Wn.z,Wn.y,Sn.z,0,-Sn.x,yn.z,0,-yn.x,Wn.z,0,-Wn.x,-Sn.y,Sn.x,0,-yn.y,yn.x,0,-Wn.y,Wn.x,0];return!us(t,fa,da,pa,Oi)||(t=[1,0,0,0,1,0,0,0,1],!us(t,fa,da,pa,Oi))?!1:(Bi.crossVectors(Sn,yn),t=[Bi.x,Bi.y,Bi.z],us(t,fa,da,pa,Oi))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,qt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(qt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(dn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),dn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),dn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),dn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),dn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),dn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),dn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),dn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(dn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const dn=[new Y,new Y,new Y,new Y,new Y,new Y,new Y,new Y],qt=new Y,zi=new Pi,fa=new Y,da=new Y,pa=new Y,Sn=new Y,yn=new Y,Wn=new Y,ni=new Y,Oi=new Y,Bi=new Y,qn=new Y;function us(a,e,t,n,i){for(let o=0,s=a.length-3;o<=s;o+=3){qn.fromArray(a,o);const r=i.x*Math.abs(qn.x)+i.y*Math.abs(qn.y)+i.z*Math.abs(qn.z),l=e.dot(qn),c=t.dot(qn),h=n.dot(qn);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>r)return!1}return!0}const Nd=new Pi,ai=new Y,fs=new Y;class gr{constructor(e=new Y,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Nd.setFromPoints(e).getCenter(n);let i=0;for(let o=0,s=e.length;o<s;o++)i=Math.max(i,n.distanceToSquared(e[o]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ai.subVectors(e,this.center);const t=ai.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(ai,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(fs.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ai.copy(e.center).add(fs)),this.expandByPoint(ai.copy(e.center).sub(fs))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const pn=new Y,ds=new Y,Gi=new Y,kn=new Y,ps=new Y,Hi=new Y,ms=new Y;class _h{constructor(e=new Y,t=new Y(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,pn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=pn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(pn.copy(this.origin).addScaledVector(this.direction,t),pn.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){ds.copy(e).add(t).multiplyScalar(.5),Gi.copy(t).sub(e).normalize(),kn.copy(this.origin).sub(ds);const o=e.distanceTo(t)*.5,s=-this.direction.dot(Gi),r=kn.dot(this.direction),l=-kn.dot(Gi),c=kn.lengthSq(),h=Math.abs(1-s*s);let u,f,p,v;if(h>0)if(u=s*l-r,f=s*r-l,v=o*h,u>=0)if(f>=-v)if(f<=v){const g=1/h;u*=g,f*=g,p=u*(u+s*f+2*r)+f*(s*u+f+2*l)+c}else f=o,u=Math.max(0,-(s*f+r)),p=-u*u+f*(f+2*l)+c;else f=-o,u=Math.max(0,-(s*f+r)),p=-u*u+f*(f+2*l)+c;else f<=-v?(u=Math.max(0,-(-s*o+r)),f=u>0?-o:Math.min(Math.max(-o,-l),o),p=-u*u+f*(f+2*l)+c):f<=v?(u=0,f=Math.min(Math.max(-o,-l),o),p=f*(f+2*l)+c):(u=Math.max(0,-(s*o+r)),f=u>0?o:Math.min(Math.max(-o,-l),o),p=-u*u+f*(f+2*l)+c);else f=s>0?-o:o,u=Math.max(0,-(s*f+r)),p=-u*u+f*(f+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(ds).addScaledVector(Gi,f),p}intersectSphere(e,t){pn.subVectors(e.center,this.origin);const n=pn.dot(this.direction),i=pn.dot(pn)-n*n,o=e.radius*e.radius;if(i>o)return null;const s=Math.sqrt(o-i),r=n-s,l=n+s;return l<0?null:r<0?this.at(l,t):this.at(r,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,o,s,r,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return c>=0?(n=(e.min.x-f.x)*c,i=(e.max.x-f.x)*c):(n=(e.max.x-f.x)*c,i=(e.min.x-f.x)*c),h>=0?(o=(e.min.y-f.y)*h,s=(e.max.y-f.y)*h):(o=(e.max.y-f.y)*h,s=(e.min.y-f.y)*h),n>s||o>i||((o>n||isNaN(n))&&(n=o),(s<i||isNaN(i))&&(i=s),u>=0?(r=(e.min.z-f.z)*u,l=(e.max.z-f.z)*u):(r=(e.max.z-f.z)*u,l=(e.min.z-f.z)*u),n>l||r>i)||((r>n||n!==n)&&(n=r),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,pn)!==null}intersectTriangle(e,t,n,i,o){ps.subVectors(t,e),Hi.subVectors(n,e),ms.crossVectors(ps,Hi);let s=this.direction.dot(ms),r;if(s>0){if(i)return null;r=1}else if(s<0)r=-1,s=-s;else return null;kn.subVectors(this.origin,e);const l=r*this.direction.dot(Hi.crossVectors(kn,Hi));if(l<0)return null;const c=r*this.direction.dot(ps.cross(kn));if(c<0||l+c>s)return null;const h=-r*kn.dot(ms);return h<0?null:this.at(h/s,o)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ht{constructor(e,t,n,i,o,s,r,l,c,h,u,f,p,v,g,m){ht.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,o,s,r,l,c,h,u,f,p,v,g,m)}set(e,t,n,i,o,s,r,l,c,h,u,f,p,v,g,m){const d=this.elements;return d[0]=e,d[4]=t,d[8]=n,d[12]=i,d[1]=o,d[5]=s,d[9]=r,d[13]=l,d[2]=c,d[6]=h,d[10]=u,d[14]=f,d[3]=p,d[7]=v,d[11]=g,d[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ht().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,i=1/ma.setFromMatrixColumn(e,0).length(),o=1/ma.setFromMatrixColumn(e,1).length(),s=1/ma.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*o,t[5]=n[5]*o,t[6]=n[6]*o,t[7]=0,t[8]=n[8]*s,t[9]=n[9]*s,t[10]=n[10]*s,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,o=e.z,s=Math.cos(n),r=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(o),u=Math.sin(o);if(e.order==="XYZ"){const f=s*h,p=s*u,v=r*h,g=r*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=p+v*c,t[5]=f-g*c,t[9]=-r*l,t[2]=g-f*c,t[6]=v+p*c,t[10]=s*l}else if(e.order==="YXZ"){const f=l*h,p=l*u,v=c*h,g=c*u;t[0]=f+g*r,t[4]=v*r-p,t[8]=s*c,t[1]=s*u,t[5]=s*h,t[9]=-r,t[2]=p*r-v,t[6]=g+f*r,t[10]=s*l}else if(e.order==="ZXY"){const f=l*h,p=l*u,v=c*h,g=c*u;t[0]=f-g*r,t[4]=-s*u,t[8]=v+p*r,t[1]=p+v*r,t[5]=s*h,t[9]=g-f*r,t[2]=-s*c,t[6]=r,t[10]=s*l}else if(e.order==="ZYX"){const f=s*h,p=s*u,v=r*h,g=r*u;t[0]=l*h,t[4]=v*c-p,t[8]=f*c+g,t[1]=l*u,t[5]=g*c+f,t[9]=p*c-v,t[2]=-c,t[6]=r*l,t[10]=s*l}else if(e.order==="YZX"){const f=s*l,p=s*c,v=r*l,g=r*c;t[0]=l*h,t[4]=g-f*u,t[8]=v*u+p,t[1]=u,t[5]=s*h,t[9]=-r*h,t[2]=-c*h,t[6]=p*u+v,t[10]=f-g*u}else if(e.order==="XZY"){const f=s*l,p=s*c,v=r*l,g=r*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=f*u+g,t[5]=s*h,t[9]=p*u-v,t[2]=v*u-p,t[6]=r*h,t[10]=g*u+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Dd,e,Ud)}lookAt(e,t,n){const i=this.elements;return It.subVectors(e,t),It.lengthSq()===0&&(It.z=1),It.normalize(),En.crossVectors(n,It),En.lengthSq()===0&&(Math.abs(n.z)===1?It.x+=1e-4:It.z+=1e-4,It.normalize(),En.crossVectors(n,It)),En.normalize(),Vi.crossVectors(It,En),i[0]=En.x,i[4]=Vi.x,i[8]=It.x,i[1]=En.y,i[5]=Vi.y,i[9]=It.y,i[2]=En.z,i[6]=Vi.z,i[10]=It.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,o=this.elements,s=n[0],r=n[4],l=n[8],c=n[12],h=n[1],u=n[5],f=n[9],p=n[13],v=n[2],g=n[6],m=n[10],d=n[14],x=n[3],_=n[7],w=n[11],E=n[15],k=i[0],T=i[4],S=i[8],M=i[12],b=i[1],D=i[5],N=i[9],V=i[13],R=i[2],U=i[6],z=i[10],Z=i[14],G=i[3],O=i[7],q=i[11],W=i[15];return o[0]=s*k+r*b+l*R+c*G,o[4]=s*T+r*D+l*U+c*O,o[8]=s*S+r*N+l*z+c*q,o[12]=s*M+r*V+l*Z+c*W,o[1]=h*k+u*b+f*R+p*G,o[5]=h*T+u*D+f*U+p*O,o[9]=h*S+u*N+f*z+p*q,o[13]=h*M+u*V+f*Z+p*W,o[2]=v*k+g*b+m*R+d*G,o[6]=v*T+g*D+m*U+d*O,o[10]=v*S+g*N+m*z+d*q,o[14]=v*M+g*V+m*Z+d*W,o[3]=x*k+_*b+w*R+E*G,o[7]=x*T+_*D+w*U+E*O,o[11]=x*S+_*N+w*z+E*q,o[15]=x*M+_*V+w*Z+E*W,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],o=e[12],s=e[1],r=e[5],l=e[9],c=e[13],h=e[2],u=e[6],f=e[10],p=e[14],v=e[3],g=e[7],m=e[11],d=e[15];return v*(+o*l*u-i*c*u-o*r*f+n*c*f+i*r*p-n*l*p)+g*(+t*l*p-t*c*f+o*s*f-i*s*p+i*c*h-o*l*h)+m*(+t*c*u-t*r*p-o*s*u+n*s*p+o*r*h-n*c*h)+d*(-i*r*h-t*l*u+t*r*f+i*s*u-n*s*f+n*l*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],o=e[3],s=e[4],r=e[5],l=e[6],c=e[7],h=e[8],u=e[9],f=e[10],p=e[11],v=e[12],g=e[13],m=e[14],d=e[15],x=u*m*c-g*f*c+g*l*p-r*m*p-u*l*d+r*f*d,_=v*f*c-h*m*c-v*l*p+s*m*p+h*l*d-s*f*d,w=h*g*c-v*u*c+v*r*p-s*g*p-h*r*d+s*u*d,E=v*u*l-h*g*l-v*r*f+s*g*f+h*r*m-s*u*m,k=t*x+n*_+i*w+o*E;if(k===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const T=1/k;return e[0]=x*T,e[1]=(g*f*o-u*m*o-g*i*p+n*m*p+u*i*d-n*f*d)*T,e[2]=(r*m*o-g*l*o+g*i*c-n*m*c-r*i*d+n*l*d)*T,e[3]=(u*l*o-r*f*o-u*i*c+n*f*c+r*i*p-n*l*p)*T,e[4]=_*T,e[5]=(h*m*o-v*f*o+v*i*p-t*m*p-h*i*d+t*f*d)*T,e[6]=(v*l*o-s*m*o-v*i*c+t*m*c+s*i*d-t*l*d)*T,e[7]=(s*f*o-h*l*o+h*i*c-t*f*c-s*i*p+t*l*p)*T,e[8]=w*T,e[9]=(v*u*o-h*g*o-v*n*p+t*g*p+h*n*d-t*u*d)*T,e[10]=(s*g*o-v*r*o+v*n*c-t*g*c-s*n*d+t*r*d)*T,e[11]=(h*r*o-s*u*o-h*n*c+t*u*c+s*n*p-t*r*p)*T,e[12]=E*T,e[13]=(h*g*i-v*u*i+v*n*f-t*g*f-h*n*m+t*u*m)*T,e[14]=(v*r*i-s*g*i-v*n*l+t*g*l+s*n*m-t*r*m)*T,e[15]=(s*u*i-h*r*i+h*n*l-t*u*l-s*n*f+t*r*f)*T,this}scale(e){const t=this.elements,n=e.x,i=e.y,o=e.z;return t[0]*=n,t[4]*=i,t[8]*=o,t[1]*=n,t[5]*=i,t[9]*=o,t[2]*=n,t[6]*=i,t[10]*=o,t[3]*=n,t[7]*=i,t[11]*=o,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),o=1-n,s=e.x,r=e.y,l=e.z,c=o*s,h=o*r;return this.set(c*s+n,c*r-i*l,c*l+i*r,0,c*r+i*l,h*r+n,h*l-i*s,0,c*l-i*r,h*l+i*s,o*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,o,s){return this.set(1,n,o,0,e,1,s,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,o=t._x,s=t._y,r=t._z,l=t._w,c=o+o,h=s+s,u=r+r,f=o*c,p=o*h,v=o*u,g=s*h,m=s*u,d=r*u,x=l*c,_=l*h,w=l*u,E=n.x,k=n.y,T=n.z;return i[0]=(1-(g+d))*E,i[1]=(p+w)*E,i[2]=(v-_)*E,i[3]=0,i[4]=(p-w)*k,i[5]=(1-(f+d))*k,i[6]=(m+x)*k,i[7]=0,i[8]=(v+_)*T,i[9]=(m-x)*T,i[10]=(1-(f+g))*T,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;let o=ma.set(i[0],i[1],i[2]).length();const s=ma.set(i[4],i[5],i[6]).length(),r=ma.set(i[8],i[9],i[10]).length();this.determinant()<0&&(o=-o),e.x=i[12],e.y=i[13],e.z=i[14],Xt.copy(this);const c=1/o,h=1/s,u=1/r;return Xt.elements[0]*=c,Xt.elements[1]*=c,Xt.elements[2]*=c,Xt.elements[4]*=h,Xt.elements[5]*=h,Xt.elements[6]*=h,Xt.elements[8]*=u,Xt.elements[9]*=u,Xt.elements[10]*=u,t.setFromRotationMatrix(Xt),n.x=o,n.y=s,n.z=r,this}makePerspective(e,t,n,i,o,s,r=Mn){const l=this.elements,c=2*o/(t-e),h=2*o/(n-i),u=(t+e)/(t-e),f=(n+i)/(n-i);let p,v;if(r===Mn)p=-(s+o)/(s-o),v=-2*s*o/(s-o);else if(r===Eo)p=-s/(s-o),v=-s*o/(s-o);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,i,o,s,r=Mn){const l=this.elements,c=1/(t-e),h=1/(n-i),u=1/(s-o),f=(t+e)*c,p=(n+i)*h;let v,g;if(r===Mn)v=(s+o)*u,g=-2*u;else if(r===Eo)v=o*u,g=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=g,l[14]=-v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const ma=new Y,Xt=new ht,Dd=new Y(0,0,0),Ud=new Y(1,1,1),En=new Y,Vi=new Y,It=new Y,Rl=new ht,Cl=new Ai;class zo{constructor(e=0,t=0,n=0,i=zo.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,o=i[0],s=i[4],r=i[8],l=i[1],c=i[5],h=i[9],u=i[2],f=i[6],p=i[10];switch(t){case"XYZ":this._y=Math.asin(Ct(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-s,o)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Ct(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(r,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,o),this._z=0);break;case"ZXY":this._x=Math.asin(Ct(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-s,c)):(this._y=0,this._z=Math.atan2(l,o));break;case"ZYX":this._y=Math.asin(-Ct(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(l,o)):(this._x=0,this._z=Math.atan2(-s,c));break;case"YZX":this._z=Math.asin(Ct(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,o)):(this._x=0,this._y=Math.atan2(r,p));break;case"XZY":this._z=Math.asin(-Ct(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(r,o)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Rl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Rl,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Cl.setFromEuler(this),this.setFromQuaternion(Cl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}zo.DEFAULT_ORDER="XYZ";class vr{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Id=0;const Ll=new Y,ga=new Ai,mn=new ht,Wi=new Y,ii=new Y,Fd=new Y,zd=new Ai,Nl=new Y(1,0,0),Dl=new Y(0,1,0),Ul=new Y(0,0,1),Od={type:"added"},Bd={type:"removed"};class bt extends $a{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Id++}),this.uuid=Ka(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=bt.DEFAULT_UP.clone();const e=new Y,t=new zo,n=new Ai,i=new Y(1,1,1);function o(){n.setFromEuler(t,!1)}function s(){t.setFromQuaternion(n,void 0,!1)}t._onChange(o),n._onChange(s),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new ht},normalMatrix:{value:new ze}}),this.matrix=new ht,this.matrixWorld=new ht,this.matrixAutoUpdate=bt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=bt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new vr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ga.setFromAxisAngle(e,t),this.quaternion.multiply(ga),this}rotateOnWorldAxis(e,t){return ga.setFromAxisAngle(e,t),this.quaternion.premultiply(ga),this}rotateX(e){return this.rotateOnAxis(Nl,e)}rotateY(e){return this.rotateOnAxis(Dl,e)}rotateZ(e){return this.rotateOnAxis(Ul,e)}translateOnAxis(e,t){return Ll.copy(e).applyQuaternion(this.quaternion),this.position.add(Ll.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Nl,e)}translateY(e){return this.translateOnAxis(Dl,e)}translateZ(e){return this.translateOnAxis(Ul,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(mn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Wi.copy(e):Wi.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),ii.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?mn.lookAt(ii,Wi,this.up):mn.lookAt(Wi,ii,this.up),this.quaternion.setFromRotationMatrix(mn),i&&(mn.extractRotation(i.matrixWorld),ga.setFromRotationMatrix(mn),this.quaternion.premultiply(ga.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(Od)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Bd)),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),mn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),mn.multiply(e.parent.matrixWorld)),e.applyMatrix4(mn),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const s=this.children[n].getObjectByProperty(e,t);if(s!==void 0)return s}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let o=0,s=i.length;o<s;o++)i[o].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ii,e,Fd),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ii,zd,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++){const o=t[n];(o.matrixWorldAutoUpdate===!0||e===!0)&&o.updateMatrixWorld(e)}}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const i=this.children;for(let o=0,s=i.length;o<s;o++){const r=i[o];r.matrixWorldAutoUpdate===!0&&r.updateWorldMatrix(!1,!0)}}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(r=>({boxInitialized:r.boxInitialized,boxMin:r.box.min.toArray(),boxMax:r.box.max.toArray(),sphereInitialized:r.sphereInitialized,sphereRadius:r.sphere.radius,sphereCenter:r.sphere.center.toArray()})),i.maxGeometryCount=this._maxGeometryCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(e),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function o(r,l){return r[l.uuid]===void 0&&(r[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=o(e.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const l=r.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];o(e.shapes,u)}else o(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(o(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let l=0,c=this.material.length;l<c;l++)r.push(o(e.materials,this.material[l]));i.material=r}else i.material=o(e.materials,this.material);if(this.children.length>0){i.children=[];for(let r=0;r<this.children.length;r++)i.children.push(this.children[r].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let r=0;r<this.animations.length;r++){const l=this.animations[r];i.animations.push(o(e.animations,l))}}if(t){const r=s(e.geometries),l=s(e.materials),c=s(e.textures),h=s(e.images),u=s(e.shapes),f=s(e.skeletons),p=s(e.animations),v=s(e.nodes);r.length>0&&(n.geometries=r),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),f.length>0&&(n.skeletons=f),p.length>0&&(n.animations=p),v.length>0&&(n.nodes=v)}return n.object=i,n;function s(r){const l=[];for(const c in r){const h=r[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}}bt.DEFAULT_UP=new Y(0,1,0);bt.DEFAULT_MATRIX_AUTO_UPDATE=!0;bt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Yt=new Y,gn=new Y,gs=new Y,vn=new Y,va=new Y,_a=new Y,Il=new Y,vs=new Y,_s=new Y,xs=new Y;let qi=!1;class Kt{constructor(e=new Y,t=new Y,n=new Y){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),Yt.subVectors(e,t),i.cross(Yt);const o=i.lengthSq();return o>0?i.multiplyScalar(1/Math.sqrt(o)):i.set(0,0,0)}static getBarycoord(e,t,n,i,o){Yt.subVectors(i,t),gn.subVectors(n,t),gs.subVectors(e,t);const s=Yt.dot(Yt),r=Yt.dot(gn),l=Yt.dot(gs),c=gn.dot(gn),h=gn.dot(gs),u=s*c-r*r;if(u===0)return o.set(0,0,0),null;const f=1/u,p=(c*l-r*h)*f,v=(s*h-r*l)*f;return o.set(1-p-v,v,p)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,vn)===null?!1:vn.x>=0&&vn.y>=0&&vn.x+vn.y<=1}static getUV(e,t,n,i,o,s,r,l){return qi===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),qi=!0),this.getInterpolation(e,t,n,i,o,s,r,l)}static getInterpolation(e,t,n,i,o,s,r,l){return this.getBarycoord(e,t,n,i,vn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(o,vn.x),l.addScaledVector(s,vn.y),l.addScaledVector(r,vn.z),l)}static isFrontFacing(e,t,n,i){return Yt.subVectors(n,t),gn.subVectors(e,t),Yt.cross(gn).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Yt.subVectors(this.c,this.b),gn.subVectors(this.a,this.b),Yt.cross(gn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Kt.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Kt.getBarycoord(e,this.a,this.b,this.c,t)}getUV(e,t,n,i,o){return qi===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),qi=!0),Kt.getInterpolation(e,this.a,this.b,this.c,t,n,i,o)}getInterpolation(e,t,n,i,o){return Kt.getInterpolation(e,this.a,this.b,this.c,t,n,i,o)}containsPoint(e){return Kt.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Kt.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,o=this.c;let s,r;va.subVectors(i,n),_a.subVectors(o,n),vs.subVectors(e,n);const l=va.dot(vs),c=_a.dot(vs);if(l<=0&&c<=0)return t.copy(n);_s.subVectors(e,i);const h=va.dot(_s),u=_a.dot(_s);if(h>=0&&u<=h)return t.copy(i);const f=l*u-h*c;if(f<=0&&l>=0&&h<=0)return s=l/(l-h),t.copy(n).addScaledVector(va,s);xs.subVectors(e,o);const p=va.dot(xs),v=_a.dot(xs);if(v>=0&&p<=v)return t.copy(o);const g=p*c-l*v;if(g<=0&&c>=0&&v<=0)return r=c/(c-v),t.copy(n).addScaledVector(_a,r);const m=h*v-p*u;if(m<=0&&u-h>=0&&p-v>=0)return Il.subVectors(o,i),r=(u-h)/(u-h+(p-v)),t.copy(i).addScaledVector(Il,r);const d=1/(m+g+f);return s=g*d,r=f*d,t.copy(n).addScaledVector(va,s).addScaledVector(_a,r)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const xh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Tn={h:0,s:0,l:0},Xi={h:0,s:0,l:0};function Ms(a,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?a+(e-a)*6*t:t<1/2?e:t<2/3?a+(e-a)*6*(2/3-t):a}class Oe{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=vt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ye.toWorkingColorSpace(this,t),this}setRGB(e,t,n,i=Ye.workingColorSpace){return this.r=e,this.g=t,this.b=n,Ye.toWorkingColorSpace(this,i),this}setHSL(e,t,n,i=Ye.workingColorSpace){if(e=mr(e,1),t=Ct(t,0,1),n=Ct(n,0,1),t===0)this.r=this.g=this.b=n;else{const o=n<=.5?n*(1+t):n+t-n*t,s=2*n-o;this.r=Ms(s,o,e+1/3),this.g=Ms(s,o,e),this.b=Ms(s,o,e-1/3)}return Ye.toWorkingColorSpace(this,i),this}setStyle(e,t=vt){function n(o){o!==void 0&&parseFloat(o)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let o;const s=i[1],r=i[2];switch(s){case"rgb":case"rgba":if(o=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return n(o[4]),this.setRGB(Math.min(255,parseInt(o[1],10))/255,Math.min(255,parseInt(o[2],10))/255,Math.min(255,parseInt(o[3],10))/255,t);if(o=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return n(o[4]),this.setRGB(Math.min(100,parseInt(o[1],10))/100,Math.min(100,parseInt(o[2],10))/100,Math.min(100,parseInt(o[3],10))/100,t);break;case"hsl":case"hsla":if(o=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return n(o[4]),this.setHSL(parseFloat(o[1])/360,parseFloat(o[2])/100,parseFloat(o[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const o=i[1],s=o.length;if(s===3)return this.setRGB(parseInt(o.charAt(0),16)/15,parseInt(o.charAt(1),16)/15,parseInt(o.charAt(2),16)/15,t);if(s===6)return this.setHex(parseInt(o,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=vt){const n=xh[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Fa(e.r),this.g=Fa(e.g),this.b=Fa(e.b),this}copyLinearToSRGB(e){return this.r=ls(e.r),this.g=ls(e.g),this.b=ls(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=vt){return Ye.fromWorkingColorSpace(kt.copy(this),e),Math.round(Ct(kt.r*255,0,255))*65536+Math.round(Ct(kt.g*255,0,255))*256+Math.round(Ct(kt.b*255,0,255))}getHexString(e=vt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ye.workingColorSpace){Ye.fromWorkingColorSpace(kt.copy(this),t);const n=kt.r,i=kt.g,o=kt.b,s=Math.max(n,i,o),r=Math.min(n,i,o);let l,c;const h=(r+s)/2;if(r===s)l=0,c=0;else{const u=s-r;switch(c=h<=.5?u/(s+r):u/(2-s-r),s){case n:l=(i-o)/u+(i<o?6:0);break;case i:l=(o-n)/u+2;break;case o:l=(n-i)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=Ye.workingColorSpace){return Ye.fromWorkingColorSpace(kt.copy(this),t),e.r=kt.r,e.g=kt.g,e.b=kt.b,e}getStyle(e=vt){Ye.fromWorkingColorSpace(kt.copy(this),e);const t=kt.r,n=kt.g,i=kt.b;return e!==vt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(Tn),this.setHSL(Tn.h+e,Tn.s+t,Tn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Tn),e.getHSL(Xi);const n=gi(Tn.h,Xi.h,t),i=gi(Tn.s,Xi.s,t),o=gi(Tn.l,Xi.l,t);return this.setHSL(n,i,o),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,o=e.elements;return this.r=o[0]*t+o[3]*n+o[6]*i,this.g=o[1]*t+o[4]*n+o[7]*i,this.b=o[2]*t+o[5]*n+o[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const kt=new Oe;Oe.NAMES=xh;let Gd=0;class Za extends $a{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Gd++}),this.uuid=Ka(),this.name="",this.type="Material",this.blending=Ia,this.side=On,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=qs,this.blendDst=Xs,this.blendEquation=Jn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Oe(0,0,0),this.blendAlpha=0,this.depthFunc=bo,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=bl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ha,this.stencilZFail=ha,this.stencilZPass=ha,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ia&&(n.blending=this.blending),this.side!==On&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==qs&&(n.blendSrc=this.blendSrc),this.blendDst!==Xs&&(n.blendDst=this.blendDst),this.blendEquation!==Jn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==bo&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==bl&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ha&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ha&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ha&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(o){const s=[];for(const r in o){const l=o[r];delete l.metadata,s.push(l)}return s}if(t){const o=i(e.textures),s=i(e.images);o.length>0&&(n.textures=o),s.length>0&&(n.images=s)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let o=0;o!==i;++o)n[o]=t[o].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class _r extends Za{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Oe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=th,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const lt=new Y,Yi=new He;class Nt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Sl,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=Nn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,o=this.itemSize;i<o;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Yi.fromBufferAttribute(this,t),Yi.applyMatrix3(e),this.setXY(t,Yi.x,Yi.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)lt.fromBufferAttribute(this,t),lt.applyMatrix3(e),this.setXYZ(t,lt.x,lt.y,lt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)lt.fromBufferAttribute(this,t),lt.applyMatrix4(e),this.setXYZ(t,lt.x,lt.y,lt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)lt.fromBufferAttribute(this,t),lt.applyNormalMatrix(e),this.setXYZ(t,lt.x,lt.y,lt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)lt.fromBufferAttribute(this,t),lt.transformDirection(e),this.setXYZ(t,lt.x,lt.y,lt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Pa(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Pt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Pa(t,this.array)),t}setX(e,t){return this.normalized&&(t=Pt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Pa(t,this.array)),t}setY(e,t){return this.normalized&&(t=Pt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Pa(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Pt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Pa(t,this.array)),t}setW(e,t){return this.normalized&&(t=Pt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Pt(t,this.array),n=Pt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=Pt(t,this.array),n=Pt(n,this.array),i=Pt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,o){return e*=this.itemSize,this.normalized&&(t=Pt(t,this.array),n=Pt(n,this.array),i=Pt(i,this.array),o=Pt(o,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=o,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Sl&&(e.usage=this.usage),e}}class Mh extends Nt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class wh extends Nt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class ia extends Nt{constructor(e,t,n){super(new Float32Array(e),t,n)}}let Hd=0;const Gt=new ht,ws=new bt,xa=new Y,Ft=new Pi,oi=new Pi,mt=new Y;class la extends $a{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Hd++}),this.uuid=Ka(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(ph(e)?wh:Mh)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const o=new ze().getNormalMatrix(e);n.applyNormalMatrix(o),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Gt.makeRotationFromQuaternion(e),this.applyMatrix4(Gt),this}rotateX(e){return Gt.makeRotationX(e),this.applyMatrix4(Gt),this}rotateY(e){return Gt.makeRotationY(e),this.applyMatrix4(Gt),this}rotateZ(e){return Gt.makeRotationZ(e),this.applyMatrix4(Gt),this}translate(e,t,n){return Gt.makeTranslation(e,t,n),this.applyMatrix4(Gt),this}scale(e,t,n){return Gt.makeScale(e,t,n),this.applyMatrix4(Gt),this}lookAt(e){return ws.lookAt(e),ws.updateMatrix(),this.applyMatrix4(ws.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(xa).negate(),this.translate(xa.x,xa.y,xa.z),this}setFromPoints(e){const t=[];for(let n=0,i=e.length;n<i;n++){const o=e[n];t.push(o.x,o.y,o.z||0)}return this.setAttribute("position",new ia(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Pi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new Y(-1/0,-1/0,-1/0),new Y(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const o=t[n];Ft.setFromBufferAttribute(o),this.morphTargetsRelative?(mt.addVectors(this.boundingBox.min,Ft.min),this.boundingBox.expandByPoint(mt),mt.addVectors(this.boundingBox.max,Ft.max),this.boundingBox.expandByPoint(mt)):(this.boundingBox.expandByPoint(Ft.min),this.boundingBox.expandByPoint(Ft.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new gr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new Y,1/0);return}if(e){const n=this.boundingSphere.center;if(Ft.setFromBufferAttribute(e),t)for(let o=0,s=t.length;o<s;o++){const r=t[o];oi.setFromBufferAttribute(r),this.morphTargetsRelative?(mt.addVectors(Ft.min,oi.min),Ft.expandByPoint(mt),mt.addVectors(Ft.max,oi.max),Ft.expandByPoint(mt)):(Ft.expandByPoint(oi.min),Ft.expandByPoint(oi.max))}Ft.getCenter(n);let i=0;for(let o=0,s=e.count;o<s;o++)mt.fromBufferAttribute(e,o),i=Math.max(i,n.distanceToSquared(mt));if(t)for(let o=0,s=t.length;o<s;o++){const r=t[o],l=this.morphTargetsRelative;for(let c=0,h=r.count;c<h;c++)mt.fromBufferAttribute(r,c),l&&(xa.fromBufferAttribute(e,c),mt.add(xa)),i=Math.max(i,n.distanceToSquared(mt))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.array,i=t.position.array,o=t.normal.array,s=t.uv.array,r=i.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Nt(new Float32Array(4*r),4));const l=this.getAttribute("tangent").array,c=[],h=[];for(let b=0;b<r;b++)c[b]=new Y,h[b]=new Y;const u=new Y,f=new Y,p=new Y,v=new He,g=new He,m=new He,d=new Y,x=new Y;function _(b,D,N){u.fromArray(i,b*3),f.fromArray(i,D*3),p.fromArray(i,N*3),v.fromArray(s,b*2),g.fromArray(s,D*2),m.fromArray(s,N*2),f.sub(u),p.sub(u),g.sub(v),m.sub(v);const V=1/(g.x*m.y-m.x*g.y);isFinite(V)&&(d.copy(f).multiplyScalar(m.y).addScaledVector(p,-g.y).multiplyScalar(V),x.copy(p).multiplyScalar(g.x).addScaledVector(f,-m.x).multiplyScalar(V),c[b].add(d),c[D].add(d),c[N].add(d),h[b].add(x),h[D].add(x),h[N].add(x))}let w=this.groups;w.length===0&&(w=[{start:0,count:n.length}]);for(let b=0,D=w.length;b<D;++b){const N=w[b],V=N.start,R=N.count;for(let U=V,z=V+R;U<z;U+=3)_(n[U+0],n[U+1],n[U+2])}const E=new Y,k=new Y,T=new Y,S=new Y;function M(b){T.fromArray(o,b*3),S.copy(T);const D=c[b];E.copy(D),E.sub(T.multiplyScalar(T.dot(D))).normalize(),k.crossVectors(S,D);const V=k.dot(h[b])<0?-1:1;l[b*4]=E.x,l[b*4+1]=E.y,l[b*4+2]=E.z,l[b*4+3]=V}for(let b=0,D=w.length;b<D;++b){const N=w[b],V=N.start,R=N.count;for(let U=V,z=V+R;U<z;U+=3)M(n[U+0]),M(n[U+1]),M(n[U+2])}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Nt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let f=0,p=n.count;f<p;f++)n.setXYZ(f,0,0,0);const i=new Y,o=new Y,s=new Y,r=new Y,l=new Y,c=new Y,h=new Y,u=new Y;if(e)for(let f=0,p=e.count;f<p;f+=3){const v=e.getX(f+0),g=e.getX(f+1),m=e.getX(f+2);i.fromBufferAttribute(t,v),o.fromBufferAttribute(t,g),s.fromBufferAttribute(t,m),h.subVectors(s,o),u.subVectors(i,o),h.cross(u),r.fromBufferAttribute(n,v),l.fromBufferAttribute(n,g),c.fromBufferAttribute(n,m),r.add(h),l.add(h),c.add(h),n.setXYZ(v,r.x,r.y,r.z),n.setXYZ(g,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let f=0,p=t.count;f<p;f+=3)i.fromBufferAttribute(t,f+0),o.fromBufferAttribute(t,f+1),s.fromBufferAttribute(t,f+2),h.subVectors(s,o),u.subVectors(i,o),h.cross(u),n.setXYZ(f+0,h.x,h.y,h.z),n.setXYZ(f+1,h.x,h.y,h.z),n.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)mt.fromBufferAttribute(e,t),mt.normalize(),e.setXYZ(t,mt.x,mt.y,mt.z)}toNonIndexed(){function e(r,l){const c=r.array,h=r.itemSize,u=r.normalized,f=new c.constructor(l.length*h);let p=0,v=0;for(let g=0,m=l.length;g<m;g++){r.isInterleavedBufferAttribute?p=l[g]*r.data.stride+r.offset:p=l[g]*h;for(let d=0;d<h;d++)f[v++]=c[p++]}return new Nt(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new la,n=this.index.array,i=this.attributes;for(const r in i){const l=i[r],c=e(l,n);t.setAttribute(r,c)}const o=this.morphAttributes;for(const r in o){const l=[],c=o[r];for(let h=0,u=c.length;h<u;h++){const f=c[h],p=e(f,n);l.push(p)}t.morphAttributes[r]=l}t.morphTargetsRelative=this.morphTargetsRelative;const s=this.groups;for(let r=0,l=s.length;r<l;r++){const c=s[r];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const i={};let o=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,f=c.length;u<f;u++){const p=c[u];h.push(p.toJSON(e.data))}h.length>0&&(i[l]=h,o=!0)}o&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const s=this.groups;s.length>0&&(e.data.groups=JSON.parse(JSON.stringify(s)));const r=this.boundingSphere;return r!==null&&(e.data.boundingSphere={center:r.center.toArray(),radius:r.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const i=e.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(t))}const o=e.morphAttributes;for(const c in o){const h=[],u=o[c];for(let f=0,p=u.length;f<p;f++)h.push(u[f].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const s=e.groups;for(let c=0,h=s.length;c<h;c++){const u=s[c];this.addGroup(u.start,u.count,u.materialIndex)}const r=e.boundingBox;r!==null&&(this.boundingBox=r.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Fl=new ht,Xn=new _h,ji=new gr,zl=new Y,Ma=new Y,wa=new Y,ba=new Y,bs=new Y,$i=new Y,Ki=new He,Zi=new He,Ji=new He,Ol=new Y,Bl=new Y,Gl=new Y,Qi=new Y,eo=new Y;class nn extends bt{constructor(e=new la,t=new _r){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,s=i.length;o<s;o++){const r=i[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=o}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,o=n.morphAttributes.position,s=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const r=this.morphTargetInfluences;if(o&&r){$i.set(0,0,0);for(let l=0,c=o.length;l<c;l++){const h=r[l],u=o[l];h!==0&&(bs.fromBufferAttribute(u,e),s?$i.addScaledVector(bs,h):$i.addScaledVector(bs.sub(t),h))}t.add($i)}return t}raycast(e,t){const n=this.geometry,i=this.material,o=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ji.copy(n.boundingSphere),ji.applyMatrix4(o),Xn.copy(e.ray).recast(e.near),!(ji.containsPoint(Xn.origin)===!1&&(Xn.intersectSphere(ji,zl)===null||Xn.origin.distanceToSquared(zl)>(e.far-e.near)**2))&&(Fl.copy(o).invert(),Xn.copy(e.ray).applyMatrix4(Fl),!(n.boundingBox!==null&&Xn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Xn)))}_computeIntersections(e,t,n){let i;const o=this.geometry,s=this.material,r=o.index,l=o.attributes.position,c=o.attributes.uv,h=o.attributes.uv1,u=o.attributes.normal,f=o.groups,p=o.drawRange;if(r!==null)if(Array.isArray(s))for(let v=0,g=f.length;v<g;v++){const m=f[v],d=s[m.materialIndex],x=Math.max(m.start,p.start),_=Math.min(r.count,Math.min(m.start+m.count,p.start+p.count));for(let w=x,E=_;w<E;w+=3){const k=r.getX(w),T=r.getX(w+1),S=r.getX(w+2);i=to(this,d,e,n,c,h,u,k,T,S),i&&(i.faceIndex=Math.floor(w/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{const v=Math.max(0,p.start),g=Math.min(r.count,p.start+p.count);for(let m=v,d=g;m<d;m+=3){const x=r.getX(m),_=r.getX(m+1),w=r.getX(m+2);i=to(this,s,e,n,c,h,u,x,_,w),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}else if(l!==void 0)if(Array.isArray(s))for(let v=0,g=f.length;v<g;v++){const m=f[v],d=s[m.materialIndex],x=Math.max(m.start,p.start),_=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let w=x,E=_;w<E;w+=3){const k=w,T=w+1,S=w+2;i=to(this,d,e,n,c,h,u,k,T,S),i&&(i.faceIndex=Math.floor(w/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{const v=Math.max(0,p.start),g=Math.min(l.count,p.start+p.count);for(let m=v,d=g;m<d;m+=3){const x=m,_=m+1,w=m+2;i=to(this,s,e,n,c,h,u,x,_,w),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}}}function Vd(a,e,t,n,i,o,s,r){let l;if(e.side===Dt?l=n.intersectTriangle(s,o,i,!0,r):l=n.intersectTriangle(i,o,s,e.side===On,r),l===null)return null;eo.copy(r),eo.applyMatrix4(a.matrixWorld);const c=t.ray.origin.distanceTo(eo);return c<t.near||c>t.far?null:{distance:c,point:eo.clone(),object:a}}function to(a,e,t,n,i,o,s,r,l,c){a.getVertexPosition(r,Ma),a.getVertexPosition(l,wa),a.getVertexPosition(c,ba);const h=Vd(a,e,t,n,Ma,wa,ba,Qi);if(h){i&&(Ki.fromBufferAttribute(i,r),Zi.fromBufferAttribute(i,l),Ji.fromBufferAttribute(i,c),h.uv=Kt.getInterpolation(Qi,Ma,wa,ba,Ki,Zi,Ji,new He)),o&&(Ki.fromBufferAttribute(o,r),Zi.fromBufferAttribute(o,l),Ji.fromBufferAttribute(o,c),h.uv1=Kt.getInterpolation(Qi,Ma,wa,ba,Ki,Zi,Ji,new He),h.uv2=h.uv1),s&&(Ol.fromBufferAttribute(s,r),Bl.fromBufferAttribute(s,l),Gl.fromBufferAttribute(s,c),h.normal=Kt.getInterpolation(Qi,Ma,wa,ba,Ol,Bl,Gl,new Y),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a:r,b:l,c,normal:new Y,materialIndex:0};Kt.getNormal(Ma,wa,ba,u.normal),h.face=u}return h}class Ja extends la{constructor(e=1,t=1,n=1,i=1,o=1,s=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:o,depthSegments:s};const r=this;i=Math.floor(i),o=Math.floor(o),s=Math.floor(s);const l=[],c=[],h=[],u=[];let f=0,p=0;v("z","y","x",-1,-1,n,t,e,s,o,0),v("z","y","x",1,-1,n,t,-e,s,o,1),v("x","z","y",1,1,e,n,t,i,s,2),v("x","z","y",1,-1,e,n,-t,i,s,3),v("x","y","z",1,-1,e,t,n,i,o,4),v("x","y","z",-1,-1,e,t,-n,i,o,5),this.setIndex(l),this.setAttribute("position",new ia(c,3)),this.setAttribute("normal",new ia(h,3)),this.setAttribute("uv",new ia(u,2));function v(g,m,d,x,_,w,E,k,T,S,M){const b=w/T,D=E/S,N=w/2,V=E/2,R=k/2,U=T+1,z=S+1;let Z=0,G=0;const O=new Y;for(let q=0;q<z;q++){const W=q*D-V;for(let L=0;L<U;L++){const C=L*b-N;O[g]=C*x,O[m]=W*_,O[d]=R,c.push(O.x,O.y,O.z),O[g]=0,O[m]=0,O[d]=k>0?1:-1,h.push(O.x,O.y,O.z),u.push(L/T),u.push(1-q/S),Z+=1}}for(let q=0;q<S;q++)for(let W=0;W<T;W++){const L=f+W+U*q,C=f+W+U*(q+1),B=f+(W+1)+U*(q+1),H=f+(W+1)+U*q;l.push(L,C,H),l.push(C,B,H),G+=6}r.addGroup(p,G,M),p+=G,f+=Z}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ja(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Xa(a){const e={};for(const t in a){e[t]={};for(const n in a[t]){const i=a[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function Rt(a){const e={};for(let t=0;t<a.length;t++){const n=Xa(a[t]);for(const i in n)e[i]=n[i]}return e}function Wd(a){const e=[];for(let t=0;t<a.length;t++)e.push(a[t].clone());return e}function bh(a){return a.getRenderTarget()===null?a.outputColorSpace:Ye.workingColorSpace}const qd={clone:Xa,merge:Rt};var Xd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Yd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ra extends Za{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Xd,this.fragmentShader=Yd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Xa(e.uniforms),this.uniformsGroups=Wd(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const s=this.uniforms[i].value;s&&s.isTexture?t.uniforms[i]={type:"t",value:s.toJSON(e).uuid}:s&&s.isColor?t.uniforms[i]={type:"c",value:s.getHex()}:s&&s.isVector2?t.uniforms[i]={type:"v2",value:s.toArray()}:s&&s.isVector3?t.uniforms[i]={type:"v3",value:s.toArray()}:s&&s.isVector4?t.uniforms[i]={type:"v4",value:s.toArray()}:s&&s.isMatrix3?t.uniforms[i]={type:"m3",value:s.toArray()}:s&&s.isMatrix4?t.uniforms[i]={type:"m4",value:s.toArray()}:t.uniforms[i]={value:s}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class Sh extends bt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ht,this.projectionMatrix=new ht,this.projectionMatrixInverse=new ht,this.coordinateSystem=Mn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class Zt extends Sh{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=yi*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(mi*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return yi*2*Math.atan(Math.tan(mi*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(e,t,n,i,o,s){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=o,this.view.height=s,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(mi*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,o=-.5*i;const s=this.view;if(this.view!==null&&this.view.enabled){const l=s.fullWidth,c=s.fullHeight;o+=s.offsetX*i/l,t-=s.offsetY*n/c,i*=s.width/l,n*=s.height/c}const r=this.filmOffset;r!==0&&(o+=e*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(o,o+i,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Sa=-90,ya=1;class jd extends bt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new Zt(Sa,ya,e,t);i.layers=this.layers,this.add(i);const o=new Zt(Sa,ya,e,t);o.layers=this.layers,this.add(o);const s=new Zt(Sa,ya,e,t);s.layers=this.layers,this.add(s);const r=new Zt(Sa,ya,e,t);r.layers=this.layers,this.add(r);const l=new Zt(Sa,ya,e,t);l.layers=this.layers,this.add(l);const c=new Zt(Sa,ya,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,o,s,r,l]=t;for(const c of t)this.remove(c);if(e===Mn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),o.up.set(0,0,-1),o.lookAt(0,1,0),s.up.set(0,0,1),s.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Eo)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),o.up.set(0,0,1),o.lookAt(0,1,0),s.up.set(0,0,-1),s.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[o,s,r,l,c,h]=this.children,u=e.getRenderTarget(),f=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),v=e.xr.enabled;e.xr.enabled=!1;const g=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(t,o),e.setRenderTarget(n,1,i),e.render(t,s),e.setRenderTarget(n,2,i),e.render(t,r),e.setRenderTarget(n,3,i),e.render(t,l),e.setRenderTarget(n,4,i),e.render(t,c),n.texture.generateMipmaps=g,e.setRenderTarget(n,5,i),e.render(t,h),e.setRenderTarget(u,f,p),e.xr.enabled=v,n.texture.needsPMREMUpdate=!0}}class yh extends Lt{constructor(e,t,n,i,o,s,r,l,c,h){e=e!==void 0?e:[],t=t!==void 0?t:Ha,super(e,t,n,i,o,s,r,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class $d extends sa{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];t.encoding!==void 0&&(vi("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),t.colorSpace=t.encoding===aa?vt:Vt),this.texture=new yh(i,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Ot}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new Ja(5,5,5),o=new ra({name:"CubemapFromEquirect",uniforms:Xa(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Dt,blending:Dn});o.uniforms.tEquirect.value=t;const s=new nn(i,o),r=t.minFilter;return t.minFilter===Wa&&(t.minFilter=Ot),new jd(1,10,this).update(e,s),t.minFilter=r,s.geometry.dispose(),s.material.dispose(),this}clear(e,t,n,i){const o=e.getRenderTarget();for(let s=0;s<6;s++)e.setRenderTarget(this,s),e.clear(t,n,i);e.setRenderTarget(o)}}const Ss=new Y,Kd=new Y,Zd=new ze;class jn{constructor(e=new Y(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=Ss.subVectors(n,t).cross(Kd.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(Ss),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const o=-(e.start.dot(this.normal)+this.constant)/i;return o<0||o>1?null:t.copy(e.start).addScaledVector(n,o)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Zd.getNormalMatrix(e),i=this.coplanarPoint(Ss).applyMatrix4(e),o=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(o),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Yn=new gr,no=new Y;class xr{constructor(e=new jn,t=new jn,n=new jn,i=new jn,o=new jn,s=new jn){this.planes=[e,t,n,i,o,s]}set(e,t,n,i,o,s){const r=this.planes;return r[0].copy(e),r[1].copy(t),r[2].copy(n),r[3].copy(i),r[4].copy(o),r[5].copy(s),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Mn){const n=this.planes,i=e.elements,o=i[0],s=i[1],r=i[2],l=i[3],c=i[4],h=i[5],u=i[6],f=i[7],p=i[8],v=i[9],g=i[10],m=i[11],d=i[12],x=i[13],_=i[14],w=i[15];if(n[0].setComponents(l-o,f-c,m-p,w-d).normalize(),n[1].setComponents(l+o,f+c,m+p,w+d).normalize(),n[2].setComponents(l+s,f+h,m+v,w+x).normalize(),n[3].setComponents(l-s,f-h,m-v,w-x).normalize(),n[4].setComponents(l-r,f-u,m-g,w-_).normalize(),t===Mn)n[5].setComponents(l+r,f+u,m+g,w+_).normalize();else if(t===Eo)n[5].setComponents(r,u,g,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Yn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Yn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Yn)}intersectsSprite(e){return Yn.center.set(0,0,0),Yn.radius=.7071067811865476,Yn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Yn)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let o=0;o<6;o++)if(t[o].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(no.x=i.normal.x>0?e.max.x:e.min.x,no.y=i.normal.y>0?e.max.y:e.min.y,no.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(no)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function kh(){let a=null,e=!1,t=null,n=null;function i(o,s){t(o,s),n=a.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=a.requestAnimationFrame(i),e=!0)},stop:function(){a.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(o){t=o},setContext:function(o){a=o}}}function Jd(a,e){const t=e.isWebGL2,n=new WeakMap;function i(c,h){const u=c.array,f=c.usage,p=u.byteLength,v=a.createBuffer();a.bindBuffer(h,v),a.bufferData(h,u,f),c.onUploadCallback();let g;if(u instanceof Float32Array)g=a.FLOAT;else if(u instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(t)g=a.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else g=a.UNSIGNED_SHORT;else if(u instanceof Int16Array)g=a.SHORT;else if(u instanceof Uint32Array)g=a.UNSIGNED_INT;else if(u instanceof Int32Array)g=a.INT;else if(u instanceof Int8Array)g=a.BYTE;else if(u instanceof Uint8Array)g=a.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)g=a.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:v,type:g,bytesPerElement:u.BYTES_PER_ELEMENT,version:c.version,size:p}}function o(c,h,u){const f=h.array,p=h._updateRange,v=h.updateRanges;if(a.bindBuffer(u,c),p.count===-1&&v.length===0&&a.bufferSubData(u,0,f),v.length!==0){for(let g=0,m=v.length;g<m;g++){const d=v[g];t?a.bufferSubData(u,d.start*f.BYTES_PER_ELEMENT,f,d.start,d.count):a.bufferSubData(u,d.start*f.BYTES_PER_ELEMENT,f.subarray(d.start,d.start+d.count))}h.clearUpdateRanges()}p.count!==-1&&(t?a.bufferSubData(u,p.offset*f.BYTES_PER_ELEMENT,f,p.offset,p.count):a.bufferSubData(u,p.offset*f.BYTES_PER_ELEMENT,f.subarray(p.offset,p.offset+p.count)),p.count=-1),h.onUploadCallback()}function s(c){return c.isInterleavedBufferAttribute&&(c=c.data),n.get(c)}function r(c){c.isInterleavedBufferAttribute&&(c=c.data);const h=n.get(c);h&&(a.deleteBuffer(h.buffer),n.delete(c))}function l(c,h){if(c.isGLBufferAttribute){const f=n.get(c);(!f||f.version<c.version)&&n.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);const u=n.get(c);if(u===void 0)n.set(c,i(c,h));else if(u.version<c.version){if(u.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");o(u.buffer,c,h),u.version=c.version}}return{get:s,remove:r,update:l}}class ki extends la{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const o=e/2,s=t/2,r=Math.floor(n),l=Math.floor(i),c=r+1,h=l+1,u=e/r,f=t/l,p=[],v=[],g=[],m=[];for(let d=0;d<h;d++){const x=d*f-s;for(let _=0;_<c;_++){const w=_*u-o;v.push(w,-x,0),g.push(0,0,1),m.push(_/r),m.push(1-d/l)}}for(let d=0;d<l;d++)for(let x=0;x<r;x++){const _=x+c*d,w=x+c*(d+1),E=x+1+c*(d+1),k=x+1+c*d;p.push(_,w,k),p.push(w,E,k)}this.setIndex(p),this.setAttribute("position",new ia(v,3)),this.setAttribute("normal",new ia(g,3)),this.setAttribute("uv",new ia(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ki(e.width,e.height,e.widthSegments,e.heightSegments)}}var Qd=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,ep=`#ifdef USE_ALPHAHASH
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
#endif`,tp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,np=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ap=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,ip=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,op=`#ifdef USE_AOMAP
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
#endif`,sp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,rp=`#ifdef USE_BATCHING
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
#endif`,lp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,cp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,hp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,up=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,fp=`#ifdef USE_IRIDESCENCE
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
#endif`,dp=`#ifdef USE_BUMPMAP
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
#endif`,pp=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,mp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,gp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,vp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,_p=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,xp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Mp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,wp=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,bp=`#define PI 3.141592653589793
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
} // validated`,Sp=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,yp=`vec3 transformedNormal = objectNormal;
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
#endif`,kp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Ep=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Tp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Ap=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Pp="gl_FragColor = linearToOutputTexel( gl_FragColor );",Rp=`
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
}`,Cp=`#ifdef USE_ENVMAP
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
#endif`,Lp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Np=`#ifdef USE_ENVMAP
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
#endif`,Dp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Up=`#ifdef USE_ENVMAP
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
#endif`,Ip=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Fp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,zp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Op=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Bp=`#ifdef USE_GRADIENTMAP
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
}`,Gp=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,Hp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Vp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Wp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,qp=`uniform bool receiveShadow;
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
#endif`,Xp=`#ifdef USE_ENVMAP
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
#endif`,Yp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,jp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,$p=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Kp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Zp=`PhysicalMaterial material;
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
#endif`,Jp=`struct PhysicalMaterial {
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
}`,Qp=`
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
#endif`,em=`#if defined( RE_IndirectDiffuse )
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
#endif`,tm=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,nm=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,am=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,im=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,om=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,sm=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,rm=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,lm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,cm=`#if defined( USE_POINTS_UV )
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
#endif`,hm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,um=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,fm=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,dm=`#ifdef USE_MORPHNORMALS
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
#endif`,pm=`#ifdef USE_MORPHTARGETS
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
#endif`,mm=`#ifdef USE_MORPHTARGETS
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
#endif`,gm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,vm=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,_m=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,xm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Mm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,wm=`#ifdef USE_NORMALMAP
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
#endif`,bm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Sm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,ym=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,km=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Em=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Tm=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Am=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Pm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Rm=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Cm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Lm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Nm=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Dm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Um=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Im=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Fm=`float getShadowMask() {
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
}`,zm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Om=`#ifdef USE_SKINNING
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
#endif`,Bm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Gm=`#ifdef USE_SKINNING
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
#endif`,Hm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Vm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Wm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,qm=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Xm=`#ifdef USE_TRANSMISSION
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
#endif`,Ym=`#ifdef USE_TRANSMISSION
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
#endif`,jm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,$m=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Km=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Zm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Jm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Qm=`uniform sampler2D t2D;
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
}`,eg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,tg=`#ifdef ENVMAP_TYPE_CUBE
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
}`,ng=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ag=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ig=`#include <common>
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
}`,og=`#if DEPTH_PACKING == 3200
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
}`,sg=`#define DISTANCE
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
}`,rg=`#define DISTANCE
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
}`,lg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,cg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,hg=`uniform float scale;
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
}`,ug=`uniform vec3 diffuse;
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
}`,fg=`#include <common>
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
}`,dg=`uniform vec3 diffuse;
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
}`,pg=`#define LAMBERT
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
}`,mg=`#define LAMBERT
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
}`,gg=`#define MATCAP
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
}`,vg=`#define MATCAP
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
}`,_g=`#define NORMAL
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
}`,xg=`#define NORMAL
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
}`,Mg=`#define PHONG
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
}`,wg=`#define PHONG
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
}`,bg=`#define STANDARD
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
}`,Sg=`#define STANDARD
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
}`,yg=`#define TOON
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
}`,kg=`#define TOON
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
}`,Eg=`uniform float size;
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
}`,Tg=`uniform vec3 diffuse;
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
}`,Ag=`#include <common>
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
}`,Pg=`uniform vec3 color;
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
}`,Rg=`uniform float rotation;
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
}`,Cg=`uniform vec3 diffuse;
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
}`,Ne={alphahash_fragment:Qd,alphahash_pars_fragment:ep,alphamap_fragment:tp,alphamap_pars_fragment:np,alphatest_fragment:ap,alphatest_pars_fragment:ip,aomap_fragment:op,aomap_pars_fragment:sp,batching_pars_vertex:rp,batching_vertex:lp,begin_vertex:cp,beginnormal_vertex:hp,bsdfs:up,iridescence_fragment:fp,bumpmap_pars_fragment:dp,clipping_planes_fragment:pp,clipping_planes_pars_fragment:mp,clipping_planes_pars_vertex:gp,clipping_planes_vertex:vp,color_fragment:_p,color_pars_fragment:xp,color_pars_vertex:Mp,color_vertex:wp,common:bp,cube_uv_reflection_fragment:Sp,defaultnormal_vertex:yp,displacementmap_pars_vertex:kp,displacementmap_vertex:Ep,emissivemap_fragment:Tp,emissivemap_pars_fragment:Ap,colorspace_fragment:Pp,colorspace_pars_fragment:Rp,envmap_fragment:Cp,envmap_common_pars_fragment:Lp,envmap_pars_fragment:Np,envmap_pars_vertex:Dp,envmap_physical_pars_fragment:Xp,envmap_vertex:Up,fog_vertex:Ip,fog_pars_vertex:Fp,fog_fragment:zp,fog_pars_fragment:Op,gradientmap_pars_fragment:Bp,lightmap_fragment:Gp,lightmap_pars_fragment:Hp,lights_lambert_fragment:Vp,lights_lambert_pars_fragment:Wp,lights_pars_begin:qp,lights_toon_fragment:Yp,lights_toon_pars_fragment:jp,lights_phong_fragment:$p,lights_phong_pars_fragment:Kp,lights_physical_fragment:Zp,lights_physical_pars_fragment:Jp,lights_fragment_begin:Qp,lights_fragment_maps:em,lights_fragment_end:tm,logdepthbuf_fragment:nm,logdepthbuf_pars_fragment:am,logdepthbuf_pars_vertex:im,logdepthbuf_vertex:om,map_fragment:sm,map_pars_fragment:rm,map_particle_fragment:lm,map_particle_pars_fragment:cm,metalnessmap_fragment:hm,metalnessmap_pars_fragment:um,morphcolor_vertex:fm,morphnormal_vertex:dm,morphtarget_pars_vertex:pm,morphtarget_vertex:mm,normal_fragment_begin:gm,normal_fragment_maps:vm,normal_pars_fragment:_m,normal_pars_vertex:xm,normal_vertex:Mm,normalmap_pars_fragment:wm,clearcoat_normal_fragment_begin:bm,clearcoat_normal_fragment_maps:Sm,clearcoat_pars_fragment:ym,iridescence_pars_fragment:km,opaque_fragment:Em,packing:Tm,premultiplied_alpha_fragment:Am,project_vertex:Pm,dithering_fragment:Rm,dithering_pars_fragment:Cm,roughnessmap_fragment:Lm,roughnessmap_pars_fragment:Nm,shadowmap_pars_fragment:Dm,shadowmap_pars_vertex:Um,shadowmap_vertex:Im,shadowmask_pars_fragment:Fm,skinbase_vertex:zm,skinning_pars_vertex:Om,skinning_vertex:Bm,skinnormal_vertex:Gm,specularmap_fragment:Hm,specularmap_pars_fragment:Vm,tonemapping_fragment:Wm,tonemapping_pars_fragment:qm,transmission_fragment:Xm,transmission_pars_fragment:Ym,uv_pars_fragment:jm,uv_pars_vertex:$m,uv_vertex:Km,worldpos_vertex:Zm,background_vert:Jm,background_frag:Qm,backgroundCube_vert:eg,backgroundCube_frag:tg,cube_vert:ng,cube_frag:ag,depth_vert:ig,depth_frag:og,distanceRGBA_vert:sg,distanceRGBA_frag:rg,equirect_vert:lg,equirect_frag:cg,linedashed_vert:hg,linedashed_frag:ug,meshbasic_vert:fg,meshbasic_frag:dg,meshlambert_vert:pg,meshlambert_frag:mg,meshmatcap_vert:gg,meshmatcap_frag:vg,meshnormal_vert:_g,meshnormal_frag:xg,meshphong_vert:Mg,meshphong_frag:wg,meshphysical_vert:bg,meshphysical_frag:Sg,meshtoon_vert:yg,meshtoon_frag:kg,points_vert:Eg,points_frag:Tg,shadow_vert:Ag,shadow_frag:Pg,sprite_vert:Rg,sprite_frag:Cg},le={common:{diffuse:{value:new Oe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ze},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ze}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ze}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ze}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ze},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ze},normalScale:{value:new He(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ze},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ze}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ze}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ze}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Oe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Oe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0},uvTransform:{value:new ze}},sprite:{diffuse:{value:new Oe(16777215)},opacity:{value:1},center:{value:new He(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ze},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0}}},rn={basic:{uniforms:Rt([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.fog]),vertexShader:Ne.meshbasic_vert,fragmentShader:Ne.meshbasic_frag},lambert:{uniforms:Rt([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.fog,le.lights,{emissive:{value:new Oe(0)}}]),vertexShader:Ne.meshlambert_vert,fragmentShader:Ne.meshlambert_frag},phong:{uniforms:Rt([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.fog,le.lights,{emissive:{value:new Oe(0)},specular:{value:new Oe(1118481)},shininess:{value:30}}]),vertexShader:Ne.meshphong_vert,fragmentShader:Ne.meshphong_frag},standard:{uniforms:Rt([le.common,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.roughnessmap,le.metalnessmap,le.fog,le.lights,{emissive:{value:new Oe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ne.meshphysical_vert,fragmentShader:Ne.meshphysical_frag},toon:{uniforms:Rt([le.common,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.gradientmap,le.fog,le.lights,{emissive:{value:new Oe(0)}}]),vertexShader:Ne.meshtoon_vert,fragmentShader:Ne.meshtoon_frag},matcap:{uniforms:Rt([le.common,le.bumpmap,le.normalmap,le.displacementmap,le.fog,{matcap:{value:null}}]),vertexShader:Ne.meshmatcap_vert,fragmentShader:Ne.meshmatcap_frag},points:{uniforms:Rt([le.points,le.fog]),vertexShader:Ne.points_vert,fragmentShader:Ne.points_frag},dashed:{uniforms:Rt([le.common,le.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ne.linedashed_vert,fragmentShader:Ne.linedashed_frag},depth:{uniforms:Rt([le.common,le.displacementmap]),vertexShader:Ne.depth_vert,fragmentShader:Ne.depth_frag},normal:{uniforms:Rt([le.common,le.bumpmap,le.normalmap,le.displacementmap,{opacity:{value:1}}]),vertexShader:Ne.meshnormal_vert,fragmentShader:Ne.meshnormal_frag},sprite:{uniforms:Rt([le.sprite,le.fog]),vertexShader:Ne.sprite_vert,fragmentShader:Ne.sprite_frag},background:{uniforms:{uvTransform:{value:new ze},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ne.background_vert,fragmentShader:Ne.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Ne.backgroundCube_vert,fragmentShader:Ne.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ne.cube_vert,fragmentShader:Ne.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ne.equirect_vert,fragmentShader:Ne.equirect_frag},distanceRGBA:{uniforms:Rt([le.common,le.displacementmap,{referencePosition:{value:new Y},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ne.distanceRGBA_vert,fragmentShader:Ne.distanceRGBA_frag},shadow:{uniforms:Rt([le.lights,le.fog,{color:{value:new Oe(0)},opacity:{value:1}}]),vertexShader:Ne.shadow_vert,fragmentShader:Ne.shadow_frag}};rn.physical={uniforms:Rt([rn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ze},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ze},clearcoatNormalScale:{value:new He(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ze},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ze},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ze},sheen:{value:0},sheenColor:{value:new Oe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ze},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ze},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ze},transmissionSamplerSize:{value:new He},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ze},attenuationDistance:{value:0},attenuationColor:{value:new Oe(0)},specularColor:{value:new Oe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ze},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ze},anisotropyVector:{value:new He},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ze}}]),vertexShader:Ne.meshphysical_vert,fragmentShader:Ne.meshphysical_frag};const ao={r:0,b:0,g:0};function Lg(a,e,t,n,i,o,s){const r=new Oe(0);let l=o===!0?0:1,c,h,u=null,f=0,p=null;function v(m,d){let x=!1,_=d.isScene===!0?d.background:null;_&&_.isTexture&&(_=(d.backgroundBlurriness>0?t:e).get(_)),_===null?g(r,l):_&&_.isColor&&(g(_,1),x=!0);const w=a.xr.getEnvironmentBlendMode();w==="additive"?n.buffers.color.setClear(0,0,0,1,s):w==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,s),(a.autoClear||x)&&a.clear(a.autoClearColor,a.autoClearDepth,a.autoClearStencil),_&&(_.isCubeTexture||_.mapping===Io)?(h===void 0&&(h=new nn(new Ja(1,1,1),new ra({name:"BackgroundCubeMaterial",uniforms:Xa(rn.backgroundCube.uniforms),vertexShader:rn.backgroundCube.vertexShader,fragmentShader:rn.backgroundCube.fragmentShader,side:Dt,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(E,k,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),h.material.uniforms.envMap.value=_,h.material.uniforms.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=d.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=d.backgroundIntensity,h.material.toneMapped=Ye.getTransfer(_.colorSpace)!==tt,(u!==_||f!==_.version||p!==a.toneMapping)&&(h.material.needsUpdate=!0,u=_,f=_.version,p=a.toneMapping),h.layers.enableAll(),m.unshift(h,h.geometry,h.material,0,0,null)):_&&_.isTexture&&(c===void 0&&(c=new nn(new ki(2,2),new ra({name:"BackgroundMaterial",uniforms:Xa(rn.background.uniforms),vertexShader:rn.background.vertexShader,fragmentShader:rn.background.fragmentShader,side:On,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(c)),c.material.uniforms.t2D.value=_,c.material.uniforms.backgroundIntensity.value=d.backgroundIntensity,c.material.toneMapped=Ye.getTransfer(_.colorSpace)!==tt,_.matrixAutoUpdate===!0&&_.updateMatrix(),c.material.uniforms.uvTransform.value.copy(_.matrix),(u!==_||f!==_.version||p!==a.toneMapping)&&(c.material.needsUpdate=!0,u=_,f=_.version,p=a.toneMapping),c.layers.enableAll(),m.unshift(c,c.geometry,c.material,0,0,null))}function g(m,d){m.getRGB(ao,bh(a)),n.buffers.color.setClear(ao.r,ao.g,ao.b,d,s)}return{getClearColor:function(){return r},setClearColor:function(m,d=1){r.set(m),l=d,g(r,l)},getClearAlpha:function(){return l},setClearAlpha:function(m){l=m,g(r,l)},render:v}}function Ng(a,e,t,n){const i=a.getParameter(a.MAX_VERTEX_ATTRIBS),o=n.isWebGL2?null:e.get("OES_vertex_array_object"),s=n.isWebGL2||o!==null,r={},l=m(null);let c=l,h=!1;function u(R,U,z,Z,G){let O=!1;if(s){const q=g(Z,z,U);c!==q&&(c=q,p(c.object)),O=d(R,Z,z,G),O&&x(R,Z,z,G)}else{const q=U.wireframe===!0;(c.geometry!==Z.id||c.program!==z.id||c.wireframe!==q)&&(c.geometry=Z.id,c.program=z.id,c.wireframe=q,O=!0)}G!==null&&t.update(G,a.ELEMENT_ARRAY_BUFFER),(O||h)&&(h=!1,S(R,U,z,Z),G!==null&&a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,t.get(G).buffer))}function f(){return n.isWebGL2?a.createVertexArray():o.createVertexArrayOES()}function p(R){return n.isWebGL2?a.bindVertexArray(R):o.bindVertexArrayOES(R)}function v(R){return n.isWebGL2?a.deleteVertexArray(R):o.deleteVertexArrayOES(R)}function g(R,U,z){const Z=z.wireframe===!0;let G=r[R.id];G===void 0&&(G={},r[R.id]=G);let O=G[U.id];O===void 0&&(O={},G[U.id]=O);let q=O[Z];return q===void 0&&(q=m(f()),O[Z]=q),q}function m(R){const U=[],z=[],Z=[];for(let G=0;G<i;G++)U[G]=0,z[G]=0,Z[G]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:z,attributeDivisors:Z,object:R,attributes:{},index:null}}function d(R,U,z,Z){const G=c.attributes,O=U.attributes;let q=0;const W=z.getAttributes();for(const L in W)if(W[L].location>=0){const B=G[L];let H=O[L];if(H===void 0&&(L==="instanceMatrix"&&R.instanceMatrix&&(H=R.instanceMatrix),L==="instanceColor"&&R.instanceColor&&(H=R.instanceColor)),B===void 0||B.attribute!==H||H&&B.data!==H.data)return!0;q++}return c.attributesNum!==q||c.index!==Z}function x(R,U,z,Z){const G={},O=U.attributes;let q=0;const W=z.getAttributes();for(const L in W)if(W[L].location>=0){let B=O[L];B===void 0&&(L==="instanceMatrix"&&R.instanceMatrix&&(B=R.instanceMatrix),L==="instanceColor"&&R.instanceColor&&(B=R.instanceColor));const H={};H.attribute=B,B&&B.data&&(H.data=B.data),G[L]=H,q++}c.attributes=G,c.attributesNum=q,c.index=Z}function _(){const R=c.newAttributes;for(let U=0,z=R.length;U<z;U++)R[U]=0}function w(R){E(R,0)}function E(R,U){const z=c.newAttributes,Z=c.enabledAttributes,G=c.attributeDivisors;z[R]=1,Z[R]===0&&(a.enableVertexAttribArray(R),Z[R]=1),G[R]!==U&&((n.isWebGL2?a:e.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](R,U),G[R]=U)}function k(){const R=c.newAttributes,U=c.enabledAttributes;for(let z=0,Z=U.length;z<Z;z++)U[z]!==R[z]&&(a.disableVertexAttribArray(z),U[z]=0)}function T(R,U,z,Z,G,O,q){q===!0?a.vertexAttribIPointer(R,U,z,G,O):a.vertexAttribPointer(R,U,z,Z,G,O)}function S(R,U,z,Z){if(n.isWebGL2===!1&&(R.isInstancedMesh||Z.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;_();const G=Z.attributes,O=z.getAttributes(),q=U.defaultAttributeValues;for(const W in O){const L=O[W];if(L.location>=0){let C=G[W];if(C===void 0&&(W==="instanceMatrix"&&R.instanceMatrix&&(C=R.instanceMatrix),W==="instanceColor"&&R.instanceColor&&(C=R.instanceColor)),C!==void 0){const B=C.normalized,H=C.itemSize,Q=t.get(C);if(Q===void 0)continue;const ee=Q.buffer,ae=Q.type,de=Q.bytesPerElement,fe=n.isWebGL2===!0&&(ae===a.INT||ae===a.UNSIGNED_INT||C.gpuType===ah);if(C.isInterleavedBufferAttribute){const te=C.data,F=te.stride,Ge=C.offset;if(te.isInstancedInterleavedBuffer){for(let Me=0;Me<L.locationSize;Me++)E(L.location+Me,te.meshPerAttribute);R.isInstancedMesh!==!0&&Z._maxInstanceCount===void 0&&(Z._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let Me=0;Me<L.locationSize;Me++)w(L.location+Me);a.bindBuffer(a.ARRAY_BUFFER,ee);for(let Me=0;Me<L.locationSize;Me++)T(L.location+Me,H/L.locationSize,ae,B,F*de,(Ge+H/L.locationSize*Me)*de,fe)}else{if(C.isInstancedBufferAttribute){for(let te=0;te<L.locationSize;te++)E(L.location+te,C.meshPerAttribute);R.isInstancedMesh!==!0&&Z._maxInstanceCount===void 0&&(Z._maxInstanceCount=C.meshPerAttribute*C.count)}else for(let te=0;te<L.locationSize;te++)w(L.location+te);a.bindBuffer(a.ARRAY_BUFFER,ee);for(let te=0;te<L.locationSize;te++)T(L.location+te,H/L.locationSize,ae,B,H*de,H/L.locationSize*te*de,fe)}}else if(q!==void 0){const B=q[W];if(B!==void 0)switch(B.length){case 2:a.vertexAttrib2fv(L.location,B);break;case 3:a.vertexAttrib3fv(L.location,B);break;case 4:a.vertexAttrib4fv(L.location,B);break;default:a.vertexAttrib1fv(L.location,B)}}}}k()}function M(){N();for(const R in r){const U=r[R];for(const z in U){const Z=U[z];for(const G in Z)v(Z[G].object),delete Z[G];delete U[z]}delete r[R]}}function b(R){if(r[R.id]===void 0)return;const U=r[R.id];for(const z in U){const Z=U[z];for(const G in Z)v(Z[G].object),delete Z[G];delete U[z]}delete r[R.id]}function D(R){for(const U in r){const z=r[U];if(z[R.id]===void 0)continue;const Z=z[R.id];for(const G in Z)v(Z[G].object),delete Z[G];delete z[R.id]}}function N(){V(),h=!0,c!==l&&(c=l,p(c.object))}function V(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:u,reset:N,resetDefaultState:V,dispose:M,releaseStatesOfGeometry:b,releaseStatesOfProgram:D,initAttributes:_,enableAttribute:w,disableUnusedAttributes:k}}function Dg(a,e,t,n){const i=n.isWebGL2;let o;function s(h){o=h}function r(h,u){a.drawArrays(o,h,u),t.update(u,o,1)}function l(h,u,f){if(f===0)return;let p,v;if(i)p=a,v="drawArraysInstanced";else if(p=e.get("ANGLE_instanced_arrays"),v="drawArraysInstancedANGLE",p===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[v](o,h,u,f),t.update(u,o,f)}function c(h,u,f){if(f===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let v=0;v<f;v++)this.render(h[v],u[v]);else{p.multiDrawArraysWEBGL(o,h,0,u,0,f);let v=0;for(let g=0;g<f;g++)v+=u[g];t.update(v,o,1)}}this.setMode=s,this.render=r,this.renderInstances=l,this.renderMultiDraw=c}function Ug(a,e,t){let n;function i(){if(n!==void 0)return n;if(e.has("EXT_texture_filter_anisotropic")===!0){const T=e.get("EXT_texture_filter_anisotropic");n=a.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function o(T){if(T==="highp"){if(a.getShaderPrecisionFormat(a.VERTEX_SHADER,a.HIGH_FLOAT).precision>0&&a.getShaderPrecisionFormat(a.FRAGMENT_SHADER,a.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&a.getShaderPrecisionFormat(a.VERTEX_SHADER,a.MEDIUM_FLOAT).precision>0&&a.getShaderPrecisionFormat(a.FRAGMENT_SHADER,a.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const s=typeof WebGL2RenderingContext<"u"&&a.constructor.name==="WebGL2RenderingContext";let r=t.precision!==void 0?t.precision:"highp";const l=o(r);l!==r&&(console.warn("THREE.WebGLRenderer:",r,"not supported, using",l,"instead."),r=l);const c=s||e.has("WEBGL_draw_buffers"),h=t.logarithmicDepthBuffer===!0,u=a.getParameter(a.MAX_TEXTURE_IMAGE_UNITS),f=a.getParameter(a.MAX_VERTEX_TEXTURE_IMAGE_UNITS),p=a.getParameter(a.MAX_TEXTURE_SIZE),v=a.getParameter(a.MAX_CUBE_MAP_TEXTURE_SIZE),g=a.getParameter(a.MAX_VERTEX_ATTRIBS),m=a.getParameter(a.MAX_VERTEX_UNIFORM_VECTORS),d=a.getParameter(a.MAX_VARYING_VECTORS),x=a.getParameter(a.MAX_FRAGMENT_UNIFORM_VECTORS),_=f>0,w=s||e.has("OES_texture_float"),E=_&&w,k=s?a.getParameter(a.MAX_SAMPLES):0;return{isWebGL2:s,drawBuffers:c,getMaxAnisotropy:i,getMaxPrecision:o,precision:r,logarithmicDepthBuffer:h,maxTextures:u,maxVertexTextures:f,maxTextureSize:p,maxCubemapSize:v,maxAttributes:g,maxVertexUniforms:m,maxVaryings:d,maxFragmentUniforms:x,vertexTextures:_,floatFragmentTextures:w,floatVertexTextures:E,maxSamples:k}}function Ig(a){const e=this;let t=null,n=0,i=!1,o=!1;const s=new jn,r=new ze,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const p=u.length!==0||f||n!==0||i;return i=f,n=u.length,p},this.beginShadows=function(){o=!0,h(null)},this.endShadows=function(){o=!1},this.setGlobalState=function(u,f){t=h(u,f,0)},this.setState=function(u,f,p){const v=u.clippingPlanes,g=u.clipIntersection,m=u.clipShadows,d=a.get(u);if(!i||v===null||v.length===0||o&&!m)o?h(null):c();else{const x=o?0:n,_=x*4;let w=d.clippingState||null;l.value=w,w=h(v,f,_,p);for(let E=0;E!==_;++E)w[E]=t[E];d.clippingState=w,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,f,p,v){const g=u!==null?u.length:0;let m=null;if(g!==0){if(m=l.value,v!==!0||m===null){const d=p+g*4,x=f.matrixWorldInverse;r.getNormalMatrix(x),(m===null||m.length<d)&&(m=new Float32Array(d));for(let _=0,w=p;_!==g;++_,w+=4)s.copy(u[_]).applyMatrix4(x,r),s.normal.toArray(m,w),m[w+3]=s.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=g,e.numIntersection=0,m}}function Fg(a){let e=new WeakMap;function t(s,r){return r===Ys?s.mapping=Ha:r===js&&(s.mapping=Va),s}function n(s){if(s&&s.isTexture){const r=s.mapping;if(r===Ys||r===js)if(e.has(s)){const l=e.get(s).texture;return t(l,s.mapping)}else{const l=s.image;if(l&&l.height>0){const c=new $d(l.height/2);return c.fromEquirectangularTexture(a,s),e.set(s,c),s.addEventListener("dispose",i),t(c.texture,s.mapping)}else return null}}return s}function i(s){const r=s.target;r.removeEventListener("dispose",i);const l=e.get(r);l!==void 0&&(e.delete(r),l.dispose())}function o(){e=new WeakMap}return{get:n,dispose:o}}class Mr extends Sh{constructor(e=-1,t=1,n=1,i=-1,o=.1,s=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=o,this.far=s,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,o,s){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=o,this.view.height=s,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let o=n-e,s=n+e,r=i+t,l=i-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;o+=c*this.view.offsetX,s=o+c*this.view.width,r-=h*this.view.offsetY,l=r-h*this.view.height}this.projectionMatrix.makeOrthographic(o,s,r,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Ca=4,Hl=[.125,.215,.35,.446,.526,.582],Qn=20,ys=new Mr,Vl=new Oe;let ks=null,Es=0,Ts=0;const $n=(1+Math.sqrt(5))/2,ka=1/$n,Wl=[new Y(1,1,1),new Y(-1,1,1),new Y(1,1,-1),new Y(-1,1,-1),new Y(0,$n,ka),new Y(0,$n,-ka),new Y(ka,0,$n),new Y(-ka,0,$n),new Y($n,ka,0),new Y(-$n,ka,0)];class ql{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100){ks=this._renderer.getRenderTarget(),Es=this._renderer.getActiveCubeFace(),Ts=this._renderer.getActiveMipmapLevel(),this._setSize(256);const o=this._allocateTargets();return o.depthBuffer=!0,this._sceneToCubeUV(e,n,i,o),t>0&&this._blur(o,0,0,t),this._applyPMREM(o),this._cleanup(o),o}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=jl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Yl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(ks,Es,Ts),e.scissorTest=!1,io(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ha||e.mapping===Va?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),ks=this._renderer.getRenderTarget(),Es=this._renderer.getActiveCubeFace(),Ts=this._renderer.getActiveMipmapLevel();const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Ot,minFilter:Ot,generateMipmaps:!1,type:Si,format:Qt,colorSpace:bn,depthBuffer:!1},i=Xl(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Xl(e,t,n);const{_lodMax:o}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=zg(o)),this._blurMaterial=Og(o,e,t)}return i}_compileMaterial(e){const t=new nn(this._lodPlanes[0],e);this._renderer.compile(t,ys)}_sceneToCubeUV(e,t,n,i){const r=new Zt(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,f=h.toneMapping;h.getClearColor(Vl),h.toneMapping=Un,h.autoClear=!1;const p=new _r({name:"PMREM.Background",side:Dt,depthWrite:!1,depthTest:!1}),v=new nn(new Ja,p);let g=!1;const m=e.background;m?m.isColor&&(p.color.copy(m),e.background=null,g=!0):(p.color.copy(Vl),g=!0);for(let d=0;d<6;d++){const x=d%3;x===0?(r.up.set(0,l[d],0),r.lookAt(c[d],0,0)):x===1?(r.up.set(0,0,l[d]),r.lookAt(0,c[d],0)):(r.up.set(0,l[d],0),r.lookAt(0,0,c[d]));const _=this._cubeSize;io(i,x*_,d>2?_:0,_,_),h.setRenderTarget(i),g&&h.render(v,r),h.render(e,r)}v.geometry.dispose(),v.material.dispose(),h.toneMapping=f,h.autoClear=u,e.background=m}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===Ha||e.mapping===Va;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=jl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Yl());const o=i?this._cubemapMaterial:this._equirectMaterial,s=new nn(this._lodPlanes[0],o),r=o.uniforms;r.envMap.value=e;const l=this._cubeSize;io(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(s,ys)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;for(let i=1;i<this._lodPlanes.length;i++){const o=Math.sqrt(this._sigmas[i]*this._sigmas[i]-this._sigmas[i-1]*this._sigmas[i-1]),s=Wl[(i-1)%Wl.length];this._blur(e,i-1,i,o,s)}t.autoClear=n}_blur(e,t,n,i,o){const s=this._pingPongRenderTarget;this._halfBlur(e,s,t,n,i,"latitudinal",o),this._halfBlur(s,e,n,n,i,"longitudinal",o)}_halfBlur(e,t,n,i,o,s,r){const l=this._renderer,c=this._blurMaterial;s!=="latitudinal"&&s!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new nn(this._lodPlanes[i],c),f=c.uniforms,p=this._sizeLods[n]-1,v=isFinite(o)?Math.PI/(2*p):2*Math.PI/(2*Qn-1),g=o/v,m=isFinite(o)?1+Math.floor(h*g):Qn;m>Qn&&console.warn(`sigmaRadians, ${o}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Qn}`);const d=[];let x=0;for(let T=0;T<Qn;++T){const S=T/g,M=Math.exp(-S*S/2);d.push(M),T===0?x+=M:T<m&&(x+=2*M)}for(let T=0;T<d.length;T++)d[T]=d[T]/x;f.envMap.value=e.texture,f.samples.value=m,f.weights.value=d,f.latitudinal.value=s==="latitudinal",r&&(f.poleAxis.value=r);const{_lodMax:_}=this;f.dTheta.value=v,f.mipInt.value=_-n;const w=this._sizeLods[i],E=3*w*(i>_-Ca?i-_+Ca:0),k=4*(this._cubeSize-w);io(t,E,k,3*w,2*w),l.setRenderTarget(t),l.render(u,ys)}}function zg(a){const e=[],t=[],n=[];let i=a;const o=a-Ca+1+Hl.length;for(let s=0;s<o;s++){const r=Math.pow(2,i);t.push(r);let l=1/r;s>a-Ca?l=Hl[s-a+Ca-1]:s===0&&(l=0),n.push(l);const c=1/(r-2),h=-c,u=1+c,f=[h,h,u,h,u,u,h,h,u,u,h,u],p=6,v=6,g=3,m=2,d=1,x=new Float32Array(g*v*p),_=new Float32Array(m*v*p),w=new Float32Array(d*v*p);for(let k=0;k<p;k++){const T=k%3*2/3-1,S=k>2?0:-1,M=[T,S,0,T+2/3,S,0,T+2/3,S+1,0,T,S,0,T+2/3,S+1,0,T,S+1,0];x.set(M,g*v*k),_.set(f,m*v*k);const b=[k,k,k,k,k,k];w.set(b,d*v*k)}const E=new la;E.setAttribute("position",new Nt(x,g)),E.setAttribute("uv",new Nt(_,m)),E.setAttribute("faceIndex",new Nt(w,d)),e.push(E),i>Ca&&i--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Xl(a,e,t){const n=new sa(a,e,t);return n.texture.mapping=Io,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function io(a,e,t,n,i){a.viewport.set(e,t,n,i),a.scissor.set(e,t,n,i)}function Og(a,e,t){const n=new Float32Array(Qn),i=new Y(0,1,0);return new ra({name:"SphericalGaussianBlur",defines:{n:Qn,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${a}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:wr(),fragmentShader:`

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
		`,blending:Dn,depthTest:!1,depthWrite:!1})}function Yl(){return new ra({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:wr(),fragmentShader:`

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
		`,blending:Dn,depthTest:!1,depthWrite:!1})}function jl(){return new ra({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:wr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Dn,depthTest:!1,depthWrite:!1})}function wr(){return`

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
	`}function Bg(a){let e=new WeakMap,t=null;function n(r){if(r&&r.isTexture){const l=r.mapping,c=l===Ys||l===js,h=l===Ha||l===Va;if(c||h)if(r.isRenderTargetTexture&&r.needsPMREMUpdate===!0){r.needsPMREMUpdate=!1;let u=e.get(r);return t===null&&(t=new ql(a)),u=c?t.fromEquirectangular(r,u):t.fromCubemap(r,u),e.set(r,u),u.texture}else{if(e.has(r))return e.get(r).texture;{const u=r.image;if(c&&u&&u.height>0||h&&u&&i(u)){t===null&&(t=new ql(a));const f=c?t.fromEquirectangular(r):t.fromCubemap(r);return e.set(r,f),r.addEventListener("dispose",o),f.texture}else return null}}}return r}function i(r){let l=0;const c=6;for(let h=0;h<c;h++)r[h]!==void 0&&l++;return l===c}function o(r){const l=r.target;l.removeEventListener("dispose",o);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function s(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:s}}function Gg(a){const e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=a.getExtension("WEBGL_depth_texture")||a.getExtension("MOZ_WEBGL_depth_texture")||a.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=a.getExtension("EXT_texture_filter_anisotropic")||a.getExtension("MOZ_EXT_texture_filter_anisotropic")||a.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=a.getExtension("WEBGL_compressed_texture_s3tc")||a.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||a.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=a.getExtension("WEBGL_compressed_texture_pvrtc")||a.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=a.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(n){n.isWebGL2?(t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance")):(t("WEBGL_depth_texture"),t("OES_texture_float"),t("OES_texture_half_float"),t("OES_texture_half_float_linear"),t("OES_standard_derivatives"),t("OES_element_index_uint"),t("OES_vertex_array_object"),t("ANGLE_instanced_arrays")),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture")},get:function(n){const i=t(n);return i===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function Hg(a,e,t,n){const i={},o=new WeakMap;function s(u){const f=u.target;f.index!==null&&e.remove(f.index);for(const v in f.attributes)e.remove(f.attributes[v]);for(const v in f.morphAttributes){const g=f.morphAttributes[v];for(let m=0,d=g.length;m<d;m++)e.remove(g[m])}f.removeEventListener("dispose",s),delete i[f.id];const p=o.get(f);p&&(e.remove(p),o.delete(f)),n.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function r(u,f){return i[f.id]===!0||(f.addEventListener("dispose",s),i[f.id]=!0,t.memory.geometries++),f}function l(u){const f=u.attributes;for(const v in f)e.update(f[v],a.ARRAY_BUFFER);const p=u.morphAttributes;for(const v in p){const g=p[v];for(let m=0,d=g.length;m<d;m++)e.update(g[m],a.ARRAY_BUFFER)}}function c(u){const f=[],p=u.index,v=u.attributes.position;let g=0;if(p!==null){const x=p.array;g=p.version;for(let _=0,w=x.length;_<w;_+=3){const E=x[_+0],k=x[_+1],T=x[_+2];f.push(E,k,k,T,T,E)}}else if(v!==void 0){const x=v.array;g=v.version;for(let _=0,w=x.length/3-1;_<w;_+=3){const E=_+0,k=_+1,T=_+2;f.push(E,k,k,T,T,E)}}else return;const m=new(ph(f)?wh:Mh)(f,1);m.version=g;const d=o.get(u);d&&e.remove(d),o.set(u,m)}function h(u){const f=o.get(u);if(f){const p=u.index;p!==null&&f.version<p.version&&c(u)}else c(u);return o.get(u)}return{get:r,update:l,getWireframeAttribute:h}}function Vg(a,e,t,n){const i=n.isWebGL2;let o;function s(p){o=p}let r,l;function c(p){r=p.type,l=p.bytesPerElement}function h(p,v){a.drawElements(o,v,r,p*l),t.update(v,o,1)}function u(p,v,g){if(g===0)return;let m,d;if(i)m=a,d="drawElementsInstanced";else if(m=e.get("ANGLE_instanced_arrays"),d="drawElementsInstancedANGLE",m===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[d](o,v,r,p*l,g),t.update(v,o,g)}function f(p,v,g){if(g===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let d=0;d<g;d++)this.render(p[d]/l,v[d]);else{m.multiDrawElementsWEBGL(o,v,0,r,p,0,g);let d=0;for(let x=0;x<g;x++)d+=v[x];t.update(d,o,1)}}this.setMode=s,this.setIndex=c,this.render=h,this.renderInstances=u,this.renderMultiDraw=f}function Wg(a){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(o,s,r){switch(t.calls++,s){case a.TRIANGLES:t.triangles+=r*(o/3);break;case a.LINES:t.lines+=r*(o/2);break;case a.LINE_STRIP:t.lines+=r*(o-1);break;case a.LINE_LOOP:t.lines+=r*o;break;case a.POINTS:t.points+=r*o;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",s);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function qg(a,e){return a[0]-e[0]}function Xg(a,e){return Math.abs(e[1])-Math.abs(a[1])}function Yg(a,e,t){const n={},i=new Float32Array(8),o=new WeakMap,s=new ct,r=[];for(let c=0;c<8;c++)r[c]=[c,0];function l(c,h,u){const f=c.morphTargetInfluences;if(e.isWebGL2===!0){const v=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,g=v!==void 0?v.length:0;let m=o.get(h);if(m===void 0||m.count!==g){let U=function(){V.dispose(),o.delete(h),h.removeEventListener("dispose",U)};var p=U;m!==void 0&&m.texture.dispose();const _=h.morphAttributes.position!==void 0,w=h.morphAttributes.normal!==void 0,E=h.morphAttributes.color!==void 0,k=h.morphAttributes.position||[],T=h.morphAttributes.normal||[],S=h.morphAttributes.color||[];let M=0;_===!0&&(M=1),w===!0&&(M=2),E===!0&&(M=3);let b=h.attributes.position.count*M,D=1;b>e.maxTextureSize&&(D=Math.ceil(b/e.maxTextureSize),b=e.maxTextureSize);const N=new Float32Array(b*D*4*g),V=new vh(N,b,D,g);V.type=Nn,V.needsUpdate=!0;const R=M*4;for(let z=0;z<g;z++){const Z=k[z],G=T[z],O=S[z],q=b*D*4*z;for(let W=0;W<Z.count;W++){const L=W*R;_===!0&&(s.fromBufferAttribute(Z,W),N[q+L+0]=s.x,N[q+L+1]=s.y,N[q+L+2]=s.z,N[q+L+3]=0),w===!0&&(s.fromBufferAttribute(G,W),N[q+L+4]=s.x,N[q+L+5]=s.y,N[q+L+6]=s.z,N[q+L+7]=0),E===!0&&(s.fromBufferAttribute(O,W),N[q+L+8]=s.x,N[q+L+9]=s.y,N[q+L+10]=s.z,N[q+L+11]=O.itemSize===4?s.w:1)}}m={count:g,texture:V,size:new He(b,D)},o.set(h,m),h.addEventListener("dispose",U)}let d=0;for(let _=0;_<f.length;_++)d+=f[_];const x=h.morphTargetsRelative?1:1-d;u.getUniforms().setValue(a,"morphTargetBaseInfluence",x),u.getUniforms().setValue(a,"morphTargetInfluences",f),u.getUniforms().setValue(a,"morphTargetsTexture",m.texture,t),u.getUniforms().setValue(a,"morphTargetsTextureSize",m.size)}else{const v=f===void 0?0:f.length;let g=n[h.id];if(g===void 0||g.length!==v){g=[];for(let w=0;w<v;w++)g[w]=[w,0];n[h.id]=g}for(let w=0;w<v;w++){const E=g[w];E[0]=w,E[1]=f[w]}g.sort(Xg);for(let w=0;w<8;w++)w<v&&g[w][1]?(r[w][0]=g[w][0],r[w][1]=g[w][1]):(r[w][0]=Number.MAX_SAFE_INTEGER,r[w][1]=0);r.sort(qg);const m=h.morphAttributes.position,d=h.morphAttributes.normal;let x=0;for(let w=0;w<8;w++){const E=r[w],k=E[0],T=E[1];k!==Number.MAX_SAFE_INTEGER&&T?(m&&h.getAttribute("morphTarget"+w)!==m[k]&&h.setAttribute("morphTarget"+w,m[k]),d&&h.getAttribute("morphNormal"+w)!==d[k]&&h.setAttribute("morphNormal"+w,d[k]),i[w]=T,x+=T):(m&&h.hasAttribute("morphTarget"+w)===!0&&h.deleteAttribute("morphTarget"+w),d&&h.hasAttribute("morphNormal"+w)===!0&&h.deleteAttribute("morphNormal"+w),i[w]=0)}const _=h.morphTargetsRelative?1:1-x;u.getUniforms().setValue(a,"morphTargetBaseInfluence",_),u.getUniforms().setValue(a,"morphTargetInfluences",i)}}return{update:l}}function jg(a,e,t,n){let i=new WeakMap;function o(l){const c=n.render.frame,h=l.geometry,u=e.get(l,h);if(i.get(u)!==c&&(e.update(u),i.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",r)===!1&&l.addEventListener("dispose",r),i.get(l)!==c&&(t.update(l.instanceMatrix,a.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,a.ARRAY_BUFFER),i.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;i.get(f)!==c&&(f.update(),i.set(f,c))}return u}function s(){i=new WeakMap}function r(l){const c=l.target;c.removeEventListener("dispose",r),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:o,dispose:s}}class Eh extends Lt{constructor(e,t,n,i,o,s,r,l,c,h){if(h=h!==void 0?h:na,h!==na&&h!==qa)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===na&&(n=Ln),n===void 0&&h===qa&&(n=ta),super(null,i,o,s,r,l,h,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=r!==void 0?r:wt,this.minFilter=l!==void 0?l:wt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const Th=new Lt,Ah=new Eh(1,1);Ah.compareFunction=dh;const Ph=new vh,Rh=new Ld,Ch=new yh,$l=[],Kl=[],Zl=new Float32Array(16),Jl=new Float32Array(9),Ql=new Float32Array(4);function Qa(a,e,t){const n=a[0];if(n<=0||n>0)return a;const i=e*t;let o=$l[i];if(o===void 0&&(o=new Float32Array(i),$l[i]=o),e!==0){n.toArray(o,0);for(let s=1,r=0;s!==e;++s)r+=t,a[s].toArray(o,r)}return o}function ut(a,e){if(a.length!==e.length)return!1;for(let t=0,n=a.length;t<n;t++)if(a[t]!==e[t])return!1;return!0}function ft(a,e){for(let t=0,n=e.length;t<n;t++)a[t]=e[t]}function Oo(a,e){let t=Kl[e];t===void 0&&(t=new Int32Array(e),Kl[e]=t);for(let n=0;n!==e;++n)t[n]=a.allocateTextureUnit();return t}function $g(a,e){const t=this.cache;t[0]!==e&&(a.uniform1f(this.addr,e),t[0]=e)}function Kg(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(a.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ut(t,e))return;a.uniform2fv(this.addr,e),ft(t,e)}}function Zg(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(a.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(a.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(ut(t,e))return;a.uniform3fv(this.addr,e),ft(t,e)}}function Jg(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(a.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ut(t,e))return;a.uniform4fv(this.addr,e),ft(t,e)}}function Qg(a,e){const t=this.cache,n=e.elements;if(n===void 0){if(ut(t,e))return;a.uniformMatrix2fv(this.addr,!1,e),ft(t,e)}else{if(ut(t,n))return;Ql.set(n),a.uniformMatrix2fv(this.addr,!1,Ql),ft(t,n)}}function e0(a,e){const t=this.cache,n=e.elements;if(n===void 0){if(ut(t,e))return;a.uniformMatrix3fv(this.addr,!1,e),ft(t,e)}else{if(ut(t,n))return;Jl.set(n),a.uniformMatrix3fv(this.addr,!1,Jl),ft(t,n)}}function t0(a,e){const t=this.cache,n=e.elements;if(n===void 0){if(ut(t,e))return;a.uniformMatrix4fv(this.addr,!1,e),ft(t,e)}else{if(ut(t,n))return;Zl.set(n),a.uniformMatrix4fv(this.addr,!1,Zl),ft(t,n)}}function n0(a,e){const t=this.cache;t[0]!==e&&(a.uniform1i(this.addr,e),t[0]=e)}function a0(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(a.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ut(t,e))return;a.uniform2iv(this.addr,e),ft(t,e)}}function i0(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(a.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(ut(t,e))return;a.uniform3iv(this.addr,e),ft(t,e)}}function o0(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(a.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ut(t,e))return;a.uniform4iv(this.addr,e),ft(t,e)}}function s0(a,e){const t=this.cache;t[0]!==e&&(a.uniform1ui(this.addr,e),t[0]=e)}function r0(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(a.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(ut(t,e))return;a.uniform2uiv(this.addr,e),ft(t,e)}}function l0(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(a.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(ut(t,e))return;a.uniform3uiv(this.addr,e),ft(t,e)}}function c0(a,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(a.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(ut(t,e))return;a.uniform4uiv(this.addr,e),ft(t,e)}}function h0(a,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(a.uniform1i(this.addr,i),n[0]=i);const o=this.type===a.SAMPLER_2D_SHADOW?Ah:Th;t.setTexture2D(e||o,i)}function u0(a,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(a.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||Rh,i)}function f0(a,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(a.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||Ch,i)}function d0(a,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(a.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||Ph,i)}function p0(a){switch(a){case 5126:return $g;case 35664:return Kg;case 35665:return Zg;case 35666:return Jg;case 35674:return Qg;case 35675:return e0;case 35676:return t0;case 5124:case 35670:return n0;case 35667:case 35671:return a0;case 35668:case 35672:return i0;case 35669:case 35673:return o0;case 5125:return s0;case 36294:return r0;case 36295:return l0;case 36296:return c0;case 35678:case 36198:case 36298:case 36306:case 35682:return h0;case 35679:case 36299:case 36307:return u0;case 35680:case 36300:case 36308:case 36293:return f0;case 36289:case 36303:case 36311:case 36292:return d0}}function m0(a,e){a.uniform1fv(this.addr,e)}function g0(a,e){const t=Qa(e,this.size,2);a.uniform2fv(this.addr,t)}function v0(a,e){const t=Qa(e,this.size,3);a.uniform3fv(this.addr,t)}function _0(a,e){const t=Qa(e,this.size,4);a.uniform4fv(this.addr,t)}function x0(a,e){const t=Qa(e,this.size,4);a.uniformMatrix2fv(this.addr,!1,t)}function M0(a,e){const t=Qa(e,this.size,9);a.uniformMatrix3fv(this.addr,!1,t)}function w0(a,e){const t=Qa(e,this.size,16);a.uniformMatrix4fv(this.addr,!1,t)}function b0(a,e){a.uniform1iv(this.addr,e)}function S0(a,e){a.uniform2iv(this.addr,e)}function y0(a,e){a.uniform3iv(this.addr,e)}function k0(a,e){a.uniform4iv(this.addr,e)}function E0(a,e){a.uniform1uiv(this.addr,e)}function T0(a,e){a.uniform2uiv(this.addr,e)}function A0(a,e){a.uniform3uiv(this.addr,e)}function P0(a,e){a.uniform4uiv(this.addr,e)}function R0(a,e,t){const n=this.cache,i=e.length,o=Oo(t,i);ut(n,o)||(a.uniform1iv(this.addr,o),ft(n,o));for(let s=0;s!==i;++s)t.setTexture2D(e[s]||Th,o[s])}function C0(a,e,t){const n=this.cache,i=e.length,o=Oo(t,i);ut(n,o)||(a.uniform1iv(this.addr,o),ft(n,o));for(let s=0;s!==i;++s)t.setTexture3D(e[s]||Rh,o[s])}function L0(a,e,t){const n=this.cache,i=e.length,o=Oo(t,i);ut(n,o)||(a.uniform1iv(this.addr,o),ft(n,o));for(let s=0;s!==i;++s)t.setTextureCube(e[s]||Ch,o[s])}function N0(a,e,t){const n=this.cache,i=e.length,o=Oo(t,i);ut(n,o)||(a.uniform1iv(this.addr,o),ft(n,o));for(let s=0;s!==i;++s)t.setTexture2DArray(e[s]||Ph,o[s])}function D0(a){switch(a){case 5126:return m0;case 35664:return g0;case 35665:return v0;case 35666:return _0;case 35674:return x0;case 35675:return M0;case 35676:return w0;case 5124:case 35670:return b0;case 35667:case 35671:return S0;case 35668:case 35672:return y0;case 35669:case 35673:return k0;case 5125:return E0;case 36294:return T0;case 36295:return A0;case 36296:return P0;case 35678:case 36198:case 36298:case 36306:case 35682:return R0;case 35679:case 36299:case 36307:return C0;case 35680:case 36300:case 36308:case 36293:return L0;case 36289:case 36303:case 36311:case 36292:return N0}}class U0{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=p0(t.type)}}class I0{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=D0(t.type)}}class F0{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let o=0,s=i.length;o!==s;++o){const r=i[o];r.setValue(e,t[r.id],n)}}}const As=/(\w+)(\])?(\[|\.)?/g;function ec(a,e){a.seq.push(e),a.map[e.id]=e}function z0(a,e,t){const n=a.name,i=n.length;for(As.lastIndex=0;;){const o=As.exec(n),s=As.lastIndex;let r=o[1];const l=o[2]==="]",c=o[3];if(l&&(r=r|0),c===void 0||c==="["&&s+2===i){ec(t,c===void 0?new U0(r,a,e):new I0(r,a,e));break}else{let u=t.map[r];u===void 0&&(u=new F0(r),ec(t,u)),t=u}}}class mo{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const o=e.getActiveUniform(t,i),s=e.getUniformLocation(t,o.name);z0(o,s,this)}}setValue(e,t,n,i){const o=this.map[t];o!==void 0&&o.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let o=0,s=t.length;o!==s;++o){const r=t[o],l=n[r.id];l.needsUpdate!==!1&&r.setValue(e,l.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,o=e.length;i!==o;++i){const s=e[i];s.id in t&&n.push(s)}return n}}function tc(a,e,t){const n=a.createShader(e);return a.shaderSource(n,t),a.compileShader(n),n}const O0=37297;let B0=0;function G0(a,e){const t=a.split(`
`),n=[],i=Math.max(e-6,0),o=Math.min(e+6,t.length);for(let s=i;s<o;s++){const r=s+1;n.push(`${r===e?">":" "} ${r}: ${t[s]}`)}return n.join(`
`)}function H0(a){const e=Ye.getPrimaries(Ye.workingColorSpace),t=Ye.getPrimaries(a);let n;switch(e===t?n="":e===ko&&t===yo?n="LinearDisplayP3ToLinearSRGB":e===yo&&t===ko&&(n="LinearSRGBToLinearDisplayP3"),a){case bn:case Fo:return[n,"LinearTransferOETF"];case vt:case pr:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",a),[n,"LinearTransferOETF"]}}function nc(a,e,t){const n=a.getShaderParameter(e,a.COMPILE_STATUS),i=a.getShaderInfoLog(e).trim();if(n&&i==="")return"";const o=/ERROR: 0:(\d+)/.exec(i);if(o){const s=parseInt(o[1]);return t.toUpperCase()+`

`+i+`

`+G0(a.getShaderSource(e),s)}else return i}function V0(a,e){const t=H0(e);return`vec4 ${a}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function W0(a,e){let t;switch(e){case Vf:t="Linear";break;case Wf:t="Reinhard";break;case qf:t="OptimizedCineon";break;case Xf:t="ACESFilmic";break;case jf:t="AgX";break;case Yf:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+a+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function q0(a){return[a.extensionDerivatives||a.envMapCubeUVHeight||a.bumpMap||a.normalMapTangentSpace||a.clearcoatNormalMap||a.flatShading||a.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(a.extensionFragDepth||a.logarithmicDepthBuffer)&&a.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",a.extensionDrawBuffers&&a.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(a.extensionShaderTextureLOD||a.envMap||a.transmission)&&a.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(La).join(`
`)}function X0(a){return[a.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(La).join(`
`)}function Y0(a){const e=[];for(const t in a){const n=a[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function j0(a,e){const t={},n=a.getProgramParameter(e,a.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const o=a.getActiveAttrib(e,i),s=o.name;let r=1;o.type===a.FLOAT_MAT2&&(r=2),o.type===a.FLOAT_MAT3&&(r=3),o.type===a.FLOAT_MAT4&&(r=4),t[s]={type:o.type,location:a.getAttribLocation(e,s),locationSize:r}}return t}function La(a){return a!==""}function ac(a,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return a.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function ic(a,e){return a.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const $0=/^[ \t]*#include +<([\w\d./]+)>/gm;function Qs(a){return a.replace($0,Z0)}const K0=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function Z0(a,e){let t=Ne[e];if(t===void 0){const n=K0.get(e);if(n!==void 0)t=Ne[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Qs(t)}const J0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function oc(a){return a.replace(J0,Q0)}function Q0(a,e,t,n){let i="";for(let o=parseInt(e);o<parseInt(t);o++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+o+" ]").replace(/UNROLLED_LOOP_INDEX/g,o);return i}function sc(a){let e="precision "+a.precision+` float;
precision `+a.precision+" int;";return a.precision==="highp"?e+=`
#define HIGH_PRECISION`:a.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:a.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function ev(a){let e="SHADOWMAP_TYPE_BASIC";return a.shadowMapType===eh?e="SHADOWMAP_TYPE_PCF":a.shadowMapType===vf?e="SHADOWMAP_TYPE_PCF_SOFT":a.shadowMapType===on&&(e="SHADOWMAP_TYPE_VSM"),e}function tv(a){let e="ENVMAP_TYPE_CUBE";if(a.envMap)switch(a.envMapMode){case Ha:case Va:e="ENVMAP_TYPE_CUBE";break;case Io:e="ENVMAP_TYPE_CUBE_UV";break}return e}function nv(a){let e="ENVMAP_MODE_REFLECTION";if(a.envMap)switch(a.envMapMode){case Va:e="ENVMAP_MODE_REFRACTION";break}return e}function av(a){let e="ENVMAP_BLENDING_NONE";if(a.envMap)switch(a.combine){case th:e="ENVMAP_BLENDING_MULTIPLY";break;case Gf:e="ENVMAP_BLENDING_MIX";break;case Hf:e="ENVMAP_BLENDING_ADD";break}return e}function iv(a){const e=a.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function ov(a,e,t,n){const i=a.getContext(),o=t.defines;let s=t.vertexShader,r=t.fragmentShader;const l=ev(t),c=tv(t),h=nv(t),u=av(t),f=iv(t),p=t.isWebGL2?"":q0(t),v=X0(t),g=Y0(o),m=i.createProgram();let d,x,_=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(d=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(La).join(`
`),d.length>0&&(d+=`
`),x=[p,"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(La).join(`
`),x.length>0&&(x+=`
`)):(d=[sc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors&&t.isWebGL2?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(La).join(`
`),x=[p,sc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Un?"#define TONE_MAPPING":"",t.toneMapping!==Un?Ne.tonemapping_pars_fragment:"",t.toneMapping!==Un?W0("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ne.colorspace_pars_fragment,V0("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(La).join(`
`)),s=Qs(s),s=ac(s,t),s=ic(s,t),r=Qs(r),r=ac(r,t),r=ic(r,t),s=oc(s),r=oc(r),t.isWebGL2&&t.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,d=[v,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+d,x=["precision mediump sampler2DArray;","#define varying in",t.glslVersion===yl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===yl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+x);const w=_+d+s,E=_+x+r,k=tc(i,i.VERTEX_SHADER,w),T=tc(i,i.FRAGMENT_SHADER,E);i.attachShader(m,k),i.attachShader(m,T),t.index0AttributeName!==void 0?i.bindAttribLocation(m,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(m,0,"position"),i.linkProgram(m);function S(N){if(a.debug.checkShaderErrors){const V=i.getProgramInfoLog(m).trim(),R=i.getShaderInfoLog(k).trim(),U=i.getShaderInfoLog(T).trim();let z=!0,Z=!0;if(i.getProgramParameter(m,i.LINK_STATUS)===!1)if(z=!1,typeof a.debug.onShaderError=="function")a.debug.onShaderError(i,m,k,T);else{const G=nc(i,k,"vertex"),O=nc(i,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(m,i.VALIDATE_STATUS)+`

Program Info Log: `+V+`
`+G+`
`+O)}else V!==""?console.warn("THREE.WebGLProgram: Program Info Log:",V):(R===""||U==="")&&(Z=!1);Z&&(N.diagnostics={runnable:z,programLog:V,vertexShader:{log:R,prefix:d},fragmentShader:{log:U,prefix:x}})}i.deleteShader(k),i.deleteShader(T),M=new mo(i,m),b=j0(i,m)}let M;this.getUniforms=function(){return M===void 0&&S(this),M};let b;this.getAttributes=function(){return b===void 0&&S(this),b};let D=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return D===!1&&(D=i.getProgramParameter(m,O0)),D},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(m),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=B0++,this.cacheKey=e,this.usedTimes=1,this.program=m,this.vertexShader=k,this.fragmentShader=T,this}let sv=0;class rv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),o=this._getShaderStage(n),s=this._getShaderCacheForMaterial(e);return s.has(i)===!1&&(s.add(i),i.usedTimes++),s.has(o)===!1&&(s.add(o),o.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new lv(e),t.set(e,n)),n}}class lv{constructor(e){this.id=sv++,this.code=e,this.usedTimes=0}}function cv(a,e,t,n,i,o,s){const r=new vr,l=new rv,c=[],h=i.isWebGL2,u=i.logarithmicDepthBuffer,f=i.vertexTextures;let p=i.precision;const v={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(M){return M===0?"uv":`uv${M}`}function m(M,b,D,N,V){const R=N.fog,U=V.geometry,z=M.isMeshStandardMaterial?N.environment:null,Z=(M.isMeshStandardMaterial?t:e).get(M.envMap||z),G=Z&&Z.mapping===Io?Z.image.height:null,O=v[M.type];M.precision!==null&&(p=i.getMaxPrecision(M.precision),p!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",p,"instead."));const q=U.morphAttributes.position||U.morphAttributes.normal||U.morphAttributes.color,W=q!==void 0?q.length:0;let L=0;U.morphAttributes.position!==void 0&&(L=1),U.morphAttributes.normal!==void 0&&(L=2),U.morphAttributes.color!==void 0&&(L=3);let C,B,H,Q;if(O){const Tt=rn[O];C=Tt.vertexShader,B=Tt.fragmentShader}else C=M.vertexShader,B=M.fragmentShader,l.update(M),H=l.getVertexShaderID(M),Q=l.getFragmentShaderID(M);const ee=a.getRenderTarget(),ae=V.isInstancedMesh===!0,de=V.isBatchedMesh===!0,fe=!!M.map,te=!!M.matcap,F=!!Z,Ge=!!M.aoMap,Me=!!M.lightMap,Te=!!M.bumpMap,ve=!!M.normalMap,Je=!!M.displacementMap,Re=!!M.emissiveMap,P=!!M.metalnessMap,y=!!M.roughnessMap,$=M.anisotropy>0,oe=M.clearcoat>0,ie=M.iridescence>0,se=M.sheen>0,_e=M.transmission>0,ue=$&&!!M.anisotropyMap,me=oe&&!!M.clearcoatMap,ye=oe&&!!M.clearcoatNormalMap,De=oe&&!!M.clearcoatRoughnessMap,ne=ie&&!!M.iridescenceMap,Xe=ie&&!!M.iridescenceThicknessMap,Be=se&&!!M.sheenColorMap,Ae=se&&!!M.sheenRoughnessMap,we=!!M.specularMap,ge=!!M.specularColorMap,Le=!!M.specularIntensityMap,We=_e&&!!M.transmissionMap,at=_e&&!!M.thicknessMap,Ie=!!M.gradientMap,re=!!M.alphaMap,I=M.alphaTest>0,ce=!!M.alphaHash,he=!!M.extensions,ke=!!U.attributes.uv1,be=!!U.attributes.uv2,$e=!!U.attributes.uv3;let Ke=Un;return M.toneMapped&&(ee===null||ee.isXRRenderTarget===!0)&&(Ke=a.toneMapping),{isWebGL2:h,shaderID:O,shaderType:M.type,shaderName:M.name,vertexShader:C,fragmentShader:B,defines:M.defines,customVertexShaderID:H,customFragmentShaderID:Q,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:p,batching:de,instancing:ae,instancingColor:ae&&V.instanceColor!==null,supportsVertexTextures:f,outputColorSpace:ee===null?a.outputColorSpace:ee.isXRRenderTarget===!0?ee.texture.colorSpace:bn,map:fe,matcap:te,envMap:F,envMapMode:F&&Z.mapping,envMapCubeUVHeight:G,aoMap:Ge,lightMap:Me,bumpMap:Te,normalMap:ve,displacementMap:f&&Je,emissiveMap:Re,normalMapObjectSpace:ve&&M.normalMapType===od,normalMapTangentSpace:ve&&M.normalMapType===fh,metalnessMap:P,roughnessMap:y,anisotropy:$,anisotropyMap:ue,clearcoat:oe,clearcoatMap:me,clearcoatNormalMap:ye,clearcoatRoughnessMap:De,iridescence:ie,iridescenceMap:ne,iridescenceThicknessMap:Xe,sheen:se,sheenColorMap:Be,sheenRoughnessMap:Ae,specularMap:we,specularColorMap:ge,specularIntensityMap:Le,transmission:_e,transmissionMap:We,thicknessMap:at,gradientMap:Ie,opaque:M.transparent===!1&&M.blending===Ia,alphaMap:re,alphaTest:I,alphaHash:ce,combine:M.combine,mapUv:fe&&g(M.map.channel),aoMapUv:Ge&&g(M.aoMap.channel),lightMapUv:Me&&g(M.lightMap.channel),bumpMapUv:Te&&g(M.bumpMap.channel),normalMapUv:ve&&g(M.normalMap.channel),displacementMapUv:Je&&g(M.displacementMap.channel),emissiveMapUv:Re&&g(M.emissiveMap.channel),metalnessMapUv:P&&g(M.metalnessMap.channel),roughnessMapUv:y&&g(M.roughnessMap.channel),anisotropyMapUv:ue&&g(M.anisotropyMap.channel),clearcoatMapUv:me&&g(M.clearcoatMap.channel),clearcoatNormalMapUv:ye&&g(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:De&&g(M.clearcoatRoughnessMap.channel),iridescenceMapUv:ne&&g(M.iridescenceMap.channel),iridescenceThicknessMapUv:Xe&&g(M.iridescenceThicknessMap.channel),sheenColorMapUv:Be&&g(M.sheenColorMap.channel),sheenRoughnessMapUv:Ae&&g(M.sheenRoughnessMap.channel),specularMapUv:we&&g(M.specularMap.channel),specularColorMapUv:ge&&g(M.specularColorMap.channel),specularIntensityMapUv:Le&&g(M.specularIntensityMap.channel),transmissionMapUv:We&&g(M.transmissionMap.channel),thicknessMapUv:at&&g(M.thicknessMap.channel),alphaMapUv:re&&g(M.alphaMap.channel),vertexTangents:!!U.attributes.tangent&&(ve||$),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!U.attributes.color&&U.attributes.color.itemSize===4,vertexUv1s:ke,vertexUv2s:be,vertexUv3s:$e,pointsUvs:V.isPoints===!0&&!!U.attributes.uv&&(fe||re),fog:!!R,useFog:M.fog===!0,fogExp2:R&&R.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:V.isSkinnedMesh===!0,morphTargets:U.morphAttributes.position!==void 0,morphNormals:U.morphAttributes.normal!==void 0,morphColors:U.morphAttributes.color!==void 0,morphTargetsCount:W,morphTextureStride:L,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:M.dithering,shadowMapEnabled:a.shadowMap.enabled&&D.length>0,shadowMapType:a.shadowMap.type,toneMapping:Ke,useLegacyLights:a._useLegacyLights,decodeVideoTexture:fe&&M.map.isVideoTexture===!0&&Ye.getTransfer(M.map.colorSpace)===tt,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===xn,flipSided:M.side===Dt,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionDerivatives:he&&M.extensions.derivatives===!0,extensionFragDepth:he&&M.extensions.fragDepth===!0,extensionDrawBuffers:he&&M.extensions.drawBuffers===!0,extensionShaderTextureLOD:he&&M.extensions.shaderTextureLOD===!0,extensionClipCullDistance:he&&M.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()}}function d(M){const b=[];if(M.shaderID?b.push(M.shaderID):(b.push(M.customVertexShaderID),b.push(M.customFragmentShaderID)),M.defines!==void 0)for(const D in M.defines)b.push(D),b.push(M.defines[D]);return M.isRawShaderMaterial===!1&&(x(b,M),_(b,M),b.push(a.outputColorSpace)),b.push(M.customProgramCacheKey),b.join()}function x(M,b){M.push(b.precision),M.push(b.outputColorSpace),M.push(b.envMapMode),M.push(b.envMapCubeUVHeight),M.push(b.mapUv),M.push(b.alphaMapUv),M.push(b.lightMapUv),M.push(b.aoMapUv),M.push(b.bumpMapUv),M.push(b.normalMapUv),M.push(b.displacementMapUv),M.push(b.emissiveMapUv),M.push(b.metalnessMapUv),M.push(b.roughnessMapUv),M.push(b.anisotropyMapUv),M.push(b.clearcoatMapUv),M.push(b.clearcoatNormalMapUv),M.push(b.clearcoatRoughnessMapUv),M.push(b.iridescenceMapUv),M.push(b.iridescenceThicknessMapUv),M.push(b.sheenColorMapUv),M.push(b.sheenRoughnessMapUv),M.push(b.specularMapUv),M.push(b.specularColorMapUv),M.push(b.specularIntensityMapUv),M.push(b.transmissionMapUv),M.push(b.thicknessMapUv),M.push(b.combine),M.push(b.fogExp2),M.push(b.sizeAttenuation),M.push(b.morphTargetsCount),M.push(b.morphAttributeCount),M.push(b.numDirLights),M.push(b.numPointLights),M.push(b.numSpotLights),M.push(b.numSpotLightMaps),M.push(b.numHemiLights),M.push(b.numRectAreaLights),M.push(b.numDirLightShadows),M.push(b.numPointLightShadows),M.push(b.numSpotLightShadows),M.push(b.numSpotLightShadowsWithMaps),M.push(b.numLightProbes),M.push(b.shadowMapType),M.push(b.toneMapping),M.push(b.numClippingPlanes),M.push(b.numClipIntersection),M.push(b.depthPacking)}function _(M,b){r.disableAll(),b.isWebGL2&&r.enable(0),b.supportsVertexTextures&&r.enable(1),b.instancing&&r.enable(2),b.instancingColor&&r.enable(3),b.matcap&&r.enable(4),b.envMap&&r.enable(5),b.normalMapObjectSpace&&r.enable(6),b.normalMapTangentSpace&&r.enable(7),b.clearcoat&&r.enable(8),b.iridescence&&r.enable(9),b.alphaTest&&r.enable(10),b.vertexColors&&r.enable(11),b.vertexAlphas&&r.enable(12),b.vertexUv1s&&r.enable(13),b.vertexUv2s&&r.enable(14),b.vertexUv3s&&r.enable(15),b.vertexTangents&&r.enable(16),b.anisotropy&&r.enable(17),b.alphaHash&&r.enable(18),b.batching&&r.enable(19),M.push(r.mask),r.disableAll(),b.fog&&r.enable(0),b.useFog&&r.enable(1),b.flatShading&&r.enable(2),b.logarithmicDepthBuffer&&r.enable(3),b.skinning&&r.enable(4),b.morphTargets&&r.enable(5),b.morphNormals&&r.enable(6),b.morphColors&&r.enable(7),b.premultipliedAlpha&&r.enable(8),b.shadowMapEnabled&&r.enable(9),b.useLegacyLights&&r.enable(10),b.doubleSided&&r.enable(11),b.flipSided&&r.enable(12),b.useDepthPacking&&r.enable(13),b.dithering&&r.enable(14),b.transmission&&r.enable(15),b.sheen&&r.enable(16),b.opaque&&r.enable(17),b.pointsUvs&&r.enable(18),b.decodeVideoTexture&&r.enable(19),M.push(r.mask)}function w(M){const b=v[M.type];let D;if(b){const N=rn[b];D=qd.clone(N.uniforms)}else D=M.uniforms;return D}function E(M,b){let D;for(let N=0,V=c.length;N<V;N++){const R=c[N];if(R.cacheKey===b){D=R,++D.usedTimes;break}}return D===void 0&&(D=new ov(a,b,M,o),c.push(D)),D}function k(M){if(--M.usedTimes===0){const b=c.indexOf(M);c[b]=c[c.length-1],c.pop(),M.destroy()}}function T(M){l.remove(M)}function S(){l.dispose()}return{getParameters:m,getProgramCacheKey:d,getUniforms:w,acquireProgram:E,releaseProgram:k,releaseShaderCache:T,programs:c,dispose:S}}function hv(){let a=new WeakMap;function e(o){let s=a.get(o);return s===void 0&&(s={},a.set(o,s)),s}function t(o){a.delete(o)}function n(o,s,r){a.get(o)[s]=r}function i(){a=new WeakMap}return{get:e,remove:t,update:n,dispose:i}}function uv(a,e){return a.groupOrder!==e.groupOrder?a.groupOrder-e.groupOrder:a.renderOrder!==e.renderOrder?a.renderOrder-e.renderOrder:a.material.id!==e.material.id?a.material.id-e.material.id:a.z!==e.z?a.z-e.z:a.id-e.id}function rc(a,e){return a.groupOrder!==e.groupOrder?a.groupOrder-e.groupOrder:a.renderOrder!==e.renderOrder?a.renderOrder-e.renderOrder:a.z!==e.z?e.z-a.z:a.id-e.id}function lc(){const a=[];let e=0;const t=[],n=[],i=[];function o(){e=0,t.length=0,n.length=0,i.length=0}function s(u,f,p,v,g,m){let d=a[e];return d===void 0?(d={id:u.id,object:u,geometry:f,material:p,groupOrder:v,renderOrder:u.renderOrder,z:g,group:m},a[e]=d):(d.id=u.id,d.object=u,d.geometry=f,d.material=p,d.groupOrder=v,d.renderOrder=u.renderOrder,d.z=g,d.group=m),e++,d}function r(u,f,p,v,g,m){const d=s(u,f,p,v,g,m);p.transmission>0?n.push(d):p.transparent===!0?i.push(d):t.push(d)}function l(u,f,p,v,g,m){const d=s(u,f,p,v,g,m);p.transmission>0?n.unshift(d):p.transparent===!0?i.unshift(d):t.unshift(d)}function c(u,f){t.length>1&&t.sort(u||uv),n.length>1&&n.sort(f||rc),i.length>1&&i.sort(f||rc)}function h(){for(let u=e,f=a.length;u<f;u++){const p=a[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:i,init:o,push:r,unshift:l,finish:h,sort:c}}function fv(){let a=new WeakMap;function e(n,i){const o=a.get(n);let s;return o===void 0?(s=new lc,a.set(n,[s])):i>=o.length?(s=new lc,o.push(s)):s=o[i],s}function t(){a=new WeakMap}return{get:e,dispose:t}}function dv(){const a={};return{get:function(e){if(a[e.id]!==void 0)return a[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new Y,color:new Oe};break;case"SpotLight":t={position:new Y,direction:new Y,color:new Oe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new Y,color:new Oe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new Y,skyColor:new Oe,groundColor:new Oe};break;case"RectAreaLight":t={color:new Oe,position:new Y,halfWidth:new Y,halfHeight:new Y};break}return a[e.id]=t,t}}}function pv(){const a={};return{get:function(e){if(a[e.id]!==void 0)return a[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new He};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new He};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new He,shadowCameraNear:1,shadowCameraFar:1e3};break}return a[e.id]=t,t}}}let mv=0;function gv(a,e){return(e.castShadow?2:0)-(a.castShadow?2:0)+(e.map?1:0)-(a.map?1:0)}function vv(a,e){const t=new dv,n=pv(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)i.probe.push(new Y);const o=new Y,s=new ht,r=new ht;function l(h,u){let f=0,p=0,v=0;for(let N=0;N<9;N++)i.probe[N].set(0,0,0);let g=0,m=0,d=0,x=0,_=0,w=0,E=0,k=0,T=0,S=0,M=0;h.sort(gv);const b=u===!0?Math.PI:1;for(let N=0,V=h.length;N<V;N++){const R=h[N],U=R.color,z=R.intensity,Z=R.distance,G=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)f+=U.r*z*b,p+=U.g*z*b,v+=U.b*z*b;else if(R.isLightProbe){for(let O=0;O<9;O++)i.probe[O].addScaledVector(R.sh.coefficients[O],z);M++}else if(R.isDirectionalLight){const O=t.get(R);if(O.color.copy(R.color).multiplyScalar(R.intensity*b),R.castShadow){const q=R.shadow,W=n.get(R);W.shadowBias=q.bias,W.shadowNormalBias=q.normalBias,W.shadowRadius=q.radius,W.shadowMapSize=q.mapSize,i.directionalShadow[g]=W,i.directionalShadowMap[g]=G,i.directionalShadowMatrix[g]=R.shadow.matrix,w++}i.directional[g]=O,g++}else if(R.isSpotLight){const O=t.get(R);O.position.setFromMatrixPosition(R.matrixWorld),O.color.copy(U).multiplyScalar(z*b),O.distance=Z,O.coneCos=Math.cos(R.angle),O.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),O.decay=R.decay,i.spot[d]=O;const q=R.shadow;if(R.map&&(i.spotLightMap[T]=R.map,T++,q.updateMatrices(R),R.castShadow&&S++),i.spotLightMatrix[d]=q.matrix,R.castShadow){const W=n.get(R);W.shadowBias=q.bias,W.shadowNormalBias=q.normalBias,W.shadowRadius=q.radius,W.shadowMapSize=q.mapSize,i.spotShadow[d]=W,i.spotShadowMap[d]=G,k++}d++}else if(R.isRectAreaLight){const O=t.get(R);O.color.copy(U).multiplyScalar(z),O.halfWidth.set(R.width*.5,0,0),O.halfHeight.set(0,R.height*.5,0),i.rectArea[x]=O,x++}else if(R.isPointLight){const O=t.get(R);if(O.color.copy(R.color).multiplyScalar(R.intensity*b),O.distance=R.distance,O.decay=R.decay,R.castShadow){const q=R.shadow,W=n.get(R);W.shadowBias=q.bias,W.shadowNormalBias=q.normalBias,W.shadowRadius=q.radius,W.shadowMapSize=q.mapSize,W.shadowCameraNear=q.camera.near,W.shadowCameraFar=q.camera.far,i.pointShadow[m]=W,i.pointShadowMap[m]=G,i.pointShadowMatrix[m]=R.shadow.matrix,E++}i.point[m]=O,m++}else if(R.isHemisphereLight){const O=t.get(R);O.skyColor.copy(R.color).multiplyScalar(z*b),O.groundColor.copy(R.groundColor).multiplyScalar(z*b),i.hemi[_]=O,_++}}x>0&&(e.isWebGL2?a.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=le.LTC_FLOAT_1,i.rectAreaLTC2=le.LTC_FLOAT_2):(i.rectAreaLTC1=le.LTC_HALF_1,i.rectAreaLTC2=le.LTC_HALF_2):a.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=le.LTC_FLOAT_1,i.rectAreaLTC2=le.LTC_FLOAT_2):a.has("OES_texture_half_float_linear")===!0?(i.rectAreaLTC1=le.LTC_HALF_1,i.rectAreaLTC2=le.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),i.ambient[0]=f,i.ambient[1]=p,i.ambient[2]=v;const D=i.hash;(D.directionalLength!==g||D.pointLength!==m||D.spotLength!==d||D.rectAreaLength!==x||D.hemiLength!==_||D.numDirectionalShadows!==w||D.numPointShadows!==E||D.numSpotShadows!==k||D.numSpotMaps!==T||D.numLightProbes!==M)&&(i.directional.length=g,i.spot.length=d,i.rectArea.length=x,i.point.length=m,i.hemi.length=_,i.directionalShadow.length=w,i.directionalShadowMap.length=w,i.pointShadow.length=E,i.pointShadowMap.length=E,i.spotShadow.length=k,i.spotShadowMap.length=k,i.directionalShadowMatrix.length=w,i.pointShadowMatrix.length=E,i.spotLightMatrix.length=k+T-S,i.spotLightMap.length=T,i.numSpotLightShadowsWithMaps=S,i.numLightProbes=M,D.directionalLength=g,D.pointLength=m,D.spotLength=d,D.rectAreaLength=x,D.hemiLength=_,D.numDirectionalShadows=w,D.numPointShadows=E,D.numSpotShadows=k,D.numSpotMaps=T,D.numLightProbes=M,i.version=mv++)}function c(h,u){let f=0,p=0,v=0,g=0,m=0;const d=u.matrixWorldInverse;for(let x=0,_=h.length;x<_;x++){const w=h[x];if(w.isDirectionalLight){const E=i.directional[f];E.direction.setFromMatrixPosition(w.matrixWorld),o.setFromMatrixPosition(w.target.matrixWorld),E.direction.sub(o),E.direction.transformDirection(d),f++}else if(w.isSpotLight){const E=i.spot[v];E.position.setFromMatrixPosition(w.matrixWorld),E.position.applyMatrix4(d),E.direction.setFromMatrixPosition(w.matrixWorld),o.setFromMatrixPosition(w.target.matrixWorld),E.direction.sub(o),E.direction.transformDirection(d),v++}else if(w.isRectAreaLight){const E=i.rectArea[g];E.position.setFromMatrixPosition(w.matrixWorld),E.position.applyMatrix4(d),r.identity(),s.copy(w.matrixWorld),s.premultiply(d),r.extractRotation(s),E.halfWidth.set(w.width*.5,0,0),E.halfHeight.set(0,w.height*.5,0),E.halfWidth.applyMatrix4(r),E.halfHeight.applyMatrix4(r),g++}else if(w.isPointLight){const E=i.point[p];E.position.setFromMatrixPosition(w.matrixWorld),E.position.applyMatrix4(d),p++}else if(w.isHemisphereLight){const E=i.hemi[m];E.direction.setFromMatrixPosition(w.matrixWorld),E.direction.transformDirection(d),m++}}}return{setup:l,setupView:c,state:i}}function cc(a,e){const t=new vv(a,e),n=[],i=[];function o(){n.length=0,i.length=0}function s(u){n.push(u)}function r(u){i.push(u)}function l(u){t.setup(n,u)}function c(u){t.setupView(n,u)}return{init:o,state:{lightsArray:n,shadowsArray:i,lights:t},setupLights:l,setupLightsView:c,pushLight:s,pushShadow:r}}function _v(a,e){let t=new WeakMap;function n(o,s=0){const r=t.get(o);let l;return r===void 0?(l=new cc(a,e),t.set(o,[l])):s>=r.length?(l=new cc(a,e),r.push(l)):l=r[s],l}function i(){t=new WeakMap}return{get:n,dispose:i}}class xv extends Za{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=ad,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Mv extends Za{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const wv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,bv=`uniform sampler2D shadow_pass;
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
}`;function Sv(a,e,t){let n=new xr;const i=new He,o=new He,s=new ct,r=new xv({depthPacking:id}),l=new Mv,c={},h=t.maxTextureSize,u={[On]:Dt,[Dt]:On,[xn]:xn},f=new ra({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new He},radius:{value:4}},vertexShader:wv,fragmentShader:bv}),p=f.clone();p.defines.HORIZONTAL_PASS=1;const v=new la;v.setAttribute("position",new Nt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const g=new nn(v,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=eh;let d=this.type;this.render=function(k,T,S){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||k.length===0)return;const M=a.getRenderTarget(),b=a.getActiveCubeFace(),D=a.getActiveMipmapLevel(),N=a.state;N.setBlending(Dn),N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);const V=d!==on&&this.type===on,R=d===on&&this.type!==on;for(let U=0,z=k.length;U<z;U++){const Z=k[U],G=Z.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",Z,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;i.copy(G.mapSize);const O=G.getFrameExtents();if(i.multiply(O),o.copy(G.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(o.x=Math.floor(h/O.x),i.x=o.x*O.x,G.mapSize.x=o.x),i.y>h&&(o.y=Math.floor(h/O.y),i.y=o.y*O.y,G.mapSize.y=o.y)),G.map===null||V===!0||R===!0){const W=this.type!==on?{minFilter:wt,magFilter:wt}:{};G.map!==null&&G.map.dispose(),G.map=new sa(i.x,i.y,W),G.map.texture.name=Z.name+".shadowMap",G.camera.updateProjectionMatrix()}a.setRenderTarget(G.map),a.clear();const q=G.getViewportCount();for(let W=0;W<q;W++){const L=G.getViewport(W);s.set(o.x*L.x,o.y*L.y,o.x*L.z,o.y*L.w),N.viewport(s),G.updateMatrices(Z,W),n=G.getFrustum(),w(T,S,G.camera,Z,this.type)}G.isPointLightShadow!==!0&&this.type===on&&x(G,S),G.needsUpdate=!1}d=this.type,m.needsUpdate=!1,a.setRenderTarget(M,b,D)};function x(k,T){const S=e.update(g);f.defines.VSM_SAMPLES!==k.blurSamples&&(f.defines.VSM_SAMPLES=k.blurSamples,p.defines.VSM_SAMPLES=k.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),k.mapPass===null&&(k.mapPass=new sa(i.x,i.y)),f.uniforms.shadow_pass.value=k.map.texture,f.uniforms.resolution.value=k.mapSize,f.uniforms.radius.value=k.radius,a.setRenderTarget(k.mapPass),a.clear(),a.renderBufferDirect(T,null,S,f,g,null),p.uniforms.shadow_pass.value=k.mapPass.texture,p.uniforms.resolution.value=k.mapSize,p.uniforms.radius.value=k.radius,a.setRenderTarget(k.map),a.clear(),a.renderBufferDirect(T,null,S,p,g,null)}function _(k,T,S,M){let b=null;const D=S.isPointLight===!0?k.customDistanceMaterial:k.customDepthMaterial;if(D!==void 0)b=D;else if(b=S.isPointLight===!0?l:r,a.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0){const N=b.uuid,V=T.uuid;let R=c[N];R===void 0&&(R={},c[N]=R);let U=R[V];U===void 0&&(U=b.clone(),R[V]=U,T.addEventListener("dispose",E)),b=U}if(b.visible=T.visible,b.wireframe=T.wireframe,M===on?b.side=T.shadowSide!==null?T.shadowSide:T.side:b.side=T.shadowSide!==null?T.shadowSide:u[T.side],b.alphaMap=T.alphaMap,b.alphaTest=T.alphaTest,b.map=T.map,b.clipShadows=T.clipShadows,b.clippingPlanes=T.clippingPlanes,b.clipIntersection=T.clipIntersection,b.displacementMap=T.displacementMap,b.displacementScale=T.displacementScale,b.displacementBias=T.displacementBias,b.wireframeLinewidth=T.wireframeLinewidth,b.linewidth=T.linewidth,S.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const N=a.properties.get(b);N.light=S}return b}function w(k,T,S,M,b){if(k.visible===!1)return;if(k.layers.test(T.layers)&&(k.isMesh||k.isLine||k.isPoints)&&(k.castShadow||k.receiveShadow&&b===on)&&(!k.frustumCulled||n.intersectsObject(k))){k.modelViewMatrix.multiplyMatrices(S.matrixWorldInverse,k.matrixWorld);const V=e.update(k),R=k.material;if(Array.isArray(R)){const U=V.groups;for(let z=0,Z=U.length;z<Z;z++){const G=U[z],O=R[G.materialIndex];if(O&&O.visible){const q=_(k,O,M,b);k.onBeforeShadow(a,k,T,S,V,q,G),a.renderBufferDirect(S,null,V,q,k,G),k.onAfterShadow(a,k,T,S,V,q,G)}}}else if(R.visible){const U=_(k,R,M,b);k.onBeforeShadow(a,k,T,S,V,U,null),a.renderBufferDirect(S,null,V,U,k,null),k.onAfterShadow(a,k,T,S,V,U,null)}}const N=k.children;for(let V=0,R=N.length;V<R;V++)w(N[V],T,S,M,b)}function E(k){k.target.removeEventListener("dispose",E);for(const S in c){const M=c[S],b=k.target.uuid;b in M&&(M[b].dispose(),delete M[b])}}}function yv(a,e,t){const n=t.isWebGL2;function i(){let I=!1;const ce=new ct;let he=null;const ke=new ct(0,0,0,0);return{setMask:function(be){he!==be&&!I&&(a.colorMask(be,be,be,be),he=be)},setLocked:function(be){I=be},setClear:function(be,$e,Ke,dt,Tt){Tt===!0&&(be*=dt,$e*=dt,Ke*=dt),ce.set(be,$e,Ke,dt),ke.equals(ce)===!1&&(a.clearColor(be,$e,Ke,dt),ke.copy(ce))},reset:function(){I=!1,he=null,ke.set(-1,0,0,0)}}}function o(){let I=!1,ce=null,he=null,ke=null;return{setTest:function(be){be?de(a.DEPTH_TEST):fe(a.DEPTH_TEST)},setMask:function(be){ce!==be&&!I&&(a.depthMask(be),ce=be)},setFunc:function(be){if(he!==be){switch(be){case Df:a.depthFunc(a.NEVER);break;case Uf:a.depthFunc(a.ALWAYS);break;case If:a.depthFunc(a.LESS);break;case bo:a.depthFunc(a.LEQUAL);break;case Ff:a.depthFunc(a.EQUAL);break;case zf:a.depthFunc(a.GEQUAL);break;case Of:a.depthFunc(a.GREATER);break;case Bf:a.depthFunc(a.NOTEQUAL);break;default:a.depthFunc(a.LEQUAL)}he=be}},setLocked:function(be){I=be},setClear:function(be){ke!==be&&(a.clearDepth(be),ke=be)},reset:function(){I=!1,ce=null,he=null,ke=null}}}function s(){let I=!1,ce=null,he=null,ke=null,be=null,$e=null,Ke=null,dt=null,Tt=null;return{setTest:function(Ze){I||(Ze?de(a.STENCIL_TEST):fe(a.STENCIL_TEST))},setMask:function(Ze){ce!==Ze&&!I&&(a.stencilMask(Ze),ce=Ze)},setFunc:function(Ze,At,an){(he!==Ze||ke!==At||be!==an)&&(a.stencilFunc(Ze,At,an),he=Ze,ke=At,be=an)},setOp:function(Ze,At,an){($e!==Ze||Ke!==At||dt!==an)&&(a.stencilOp(Ze,At,an),$e=Ze,Ke=At,dt=an)},setLocked:function(Ze){I=Ze},setClear:function(Ze){Tt!==Ze&&(a.clearStencil(Ze),Tt=Ze)},reset:function(){I=!1,ce=null,he=null,ke=null,be=null,$e=null,Ke=null,dt=null,Tt=null}}}const r=new i,l=new o,c=new s,h=new WeakMap,u=new WeakMap;let f={},p={},v=new WeakMap,g=[],m=null,d=!1,x=null,_=null,w=null,E=null,k=null,T=null,S=null,M=new Oe(0,0,0),b=0,D=!1,N=null,V=null,R=null,U=null,z=null;const Z=a.getParameter(a.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let G=!1,O=0;const q=a.getParameter(a.VERSION);q.indexOf("WebGL")!==-1?(O=parseFloat(/^WebGL (\d)/.exec(q)[1]),G=O>=1):q.indexOf("OpenGL ES")!==-1&&(O=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),G=O>=2);let W=null,L={};const C=a.getParameter(a.SCISSOR_BOX),B=a.getParameter(a.VIEWPORT),H=new ct().fromArray(C),Q=new ct().fromArray(B);function ee(I,ce,he,ke){const be=new Uint8Array(4),$e=a.createTexture();a.bindTexture(I,$e),a.texParameteri(I,a.TEXTURE_MIN_FILTER,a.NEAREST),a.texParameteri(I,a.TEXTURE_MAG_FILTER,a.NEAREST);for(let Ke=0;Ke<he;Ke++)n&&(I===a.TEXTURE_3D||I===a.TEXTURE_2D_ARRAY)?a.texImage3D(ce,0,a.RGBA,1,1,ke,0,a.RGBA,a.UNSIGNED_BYTE,be):a.texImage2D(ce+Ke,0,a.RGBA,1,1,0,a.RGBA,a.UNSIGNED_BYTE,be);return $e}const ae={};ae[a.TEXTURE_2D]=ee(a.TEXTURE_2D,a.TEXTURE_2D,1),ae[a.TEXTURE_CUBE_MAP]=ee(a.TEXTURE_CUBE_MAP,a.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(ae[a.TEXTURE_2D_ARRAY]=ee(a.TEXTURE_2D_ARRAY,a.TEXTURE_2D_ARRAY,1,1),ae[a.TEXTURE_3D]=ee(a.TEXTURE_3D,a.TEXTURE_3D,1,1)),r.setClear(0,0,0,1),l.setClear(1),c.setClear(0),de(a.DEPTH_TEST),l.setFunc(bo),Re(!1),P(Wr),de(a.CULL_FACE),ve(Dn);function de(I){f[I]!==!0&&(a.enable(I),f[I]=!0)}function fe(I){f[I]!==!1&&(a.disable(I),f[I]=!1)}function te(I,ce){return p[I]!==ce?(a.bindFramebuffer(I,ce),p[I]=ce,n&&(I===a.DRAW_FRAMEBUFFER&&(p[a.FRAMEBUFFER]=ce),I===a.FRAMEBUFFER&&(p[a.DRAW_FRAMEBUFFER]=ce)),!0):!1}function F(I,ce){let he=g,ke=!1;if(I)if(he=v.get(ce),he===void 0&&(he=[],v.set(ce,he)),I.isWebGLMultipleRenderTargets){const be=I.texture;if(he.length!==be.length||he[0]!==a.COLOR_ATTACHMENT0){for(let $e=0,Ke=be.length;$e<Ke;$e++)he[$e]=a.COLOR_ATTACHMENT0+$e;he.length=be.length,ke=!0}}else he[0]!==a.COLOR_ATTACHMENT0&&(he[0]=a.COLOR_ATTACHMENT0,ke=!0);else he[0]!==a.BACK&&(he[0]=a.BACK,ke=!0);ke&&(t.isWebGL2?a.drawBuffers(he):e.get("WEBGL_draw_buffers").drawBuffersWEBGL(he))}function Ge(I){return m!==I?(a.useProgram(I),m=I,!0):!1}const Me={[Jn]:a.FUNC_ADD,[xf]:a.FUNC_SUBTRACT,[Mf]:a.FUNC_REVERSE_SUBTRACT};if(n)Me[jr]=a.MIN,Me[$r]=a.MAX;else{const I=e.get("EXT_blend_minmax");I!==null&&(Me[jr]=I.MIN_EXT,Me[$r]=I.MAX_EXT)}const Te={[wf]:a.ZERO,[bf]:a.ONE,[Sf]:a.SRC_COLOR,[qs]:a.SRC_ALPHA,[Pf]:a.SRC_ALPHA_SATURATE,[Tf]:a.DST_COLOR,[kf]:a.DST_ALPHA,[yf]:a.ONE_MINUS_SRC_COLOR,[Xs]:a.ONE_MINUS_SRC_ALPHA,[Af]:a.ONE_MINUS_DST_COLOR,[Ef]:a.ONE_MINUS_DST_ALPHA,[Rf]:a.CONSTANT_COLOR,[Cf]:a.ONE_MINUS_CONSTANT_COLOR,[Lf]:a.CONSTANT_ALPHA,[Nf]:a.ONE_MINUS_CONSTANT_ALPHA};function ve(I,ce,he,ke,be,$e,Ke,dt,Tt,Ze){if(I===Dn){d===!0&&(fe(a.BLEND),d=!1);return}if(d===!1&&(de(a.BLEND),d=!0),I!==_f){if(I!==x||Ze!==D){if((_!==Jn||k!==Jn)&&(a.blendEquation(a.FUNC_ADD),_=Jn,k=Jn),Ze)switch(I){case Ia:a.blendFuncSeparate(a.ONE,a.ONE_MINUS_SRC_ALPHA,a.ONE,a.ONE_MINUS_SRC_ALPHA);break;case qr:a.blendFunc(a.ONE,a.ONE);break;case Xr:a.blendFuncSeparate(a.ZERO,a.ONE_MINUS_SRC_COLOR,a.ZERO,a.ONE);break;case Yr:a.blendFuncSeparate(a.ZERO,a.SRC_COLOR,a.ZERO,a.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}else switch(I){case Ia:a.blendFuncSeparate(a.SRC_ALPHA,a.ONE_MINUS_SRC_ALPHA,a.ONE,a.ONE_MINUS_SRC_ALPHA);break;case qr:a.blendFunc(a.SRC_ALPHA,a.ONE);break;case Xr:a.blendFuncSeparate(a.ZERO,a.ONE_MINUS_SRC_COLOR,a.ZERO,a.ONE);break;case Yr:a.blendFunc(a.ZERO,a.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}w=null,E=null,T=null,S=null,M.set(0,0,0),b=0,x=I,D=Ze}return}be=be||ce,$e=$e||he,Ke=Ke||ke,(ce!==_||be!==k)&&(a.blendEquationSeparate(Me[ce],Me[be]),_=ce,k=be),(he!==w||ke!==E||$e!==T||Ke!==S)&&(a.blendFuncSeparate(Te[he],Te[ke],Te[$e],Te[Ke]),w=he,E=ke,T=$e,S=Ke),(dt.equals(M)===!1||Tt!==b)&&(a.blendColor(dt.r,dt.g,dt.b,Tt),M.copy(dt),b=Tt),x=I,D=!1}function Je(I,ce){I.side===xn?fe(a.CULL_FACE):de(a.CULL_FACE);let he=I.side===Dt;ce&&(he=!he),Re(he),I.blending===Ia&&I.transparent===!1?ve(Dn):ve(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),l.setFunc(I.depthFunc),l.setTest(I.depthTest),l.setMask(I.depthWrite),r.setMask(I.colorWrite);const ke=I.stencilWrite;c.setTest(ke),ke&&(c.setMask(I.stencilWriteMask),c.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),c.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),$(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?de(a.SAMPLE_ALPHA_TO_COVERAGE):fe(a.SAMPLE_ALPHA_TO_COVERAGE)}function Re(I){N!==I&&(I?a.frontFace(a.CW):a.frontFace(a.CCW),N=I)}function P(I){I!==mf?(de(a.CULL_FACE),I!==V&&(I===Wr?a.cullFace(a.BACK):I===gf?a.cullFace(a.FRONT):a.cullFace(a.FRONT_AND_BACK))):fe(a.CULL_FACE),V=I}function y(I){I!==R&&(G&&a.lineWidth(I),R=I)}function $(I,ce,he){I?(de(a.POLYGON_OFFSET_FILL),(U!==ce||z!==he)&&(a.polygonOffset(ce,he),U=ce,z=he)):fe(a.POLYGON_OFFSET_FILL)}function oe(I){I?de(a.SCISSOR_TEST):fe(a.SCISSOR_TEST)}function ie(I){I===void 0&&(I=a.TEXTURE0+Z-1),W!==I&&(a.activeTexture(I),W=I)}function se(I,ce,he){he===void 0&&(W===null?he=a.TEXTURE0+Z-1:he=W);let ke=L[he];ke===void 0&&(ke={type:void 0,texture:void 0},L[he]=ke),(ke.type!==I||ke.texture!==ce)&&(W!==he&&(a.activeTexture(he),W=he),a.bindTexture(I,ce||ae[I]),ke.type=I,ke.texture=ce)}function _e(){const I=L[W];I!==void 0&&I.type!==void 0&&(a.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function ue(){try{a.compressedTexImage2D.apply(a,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function me(){try{a.compressedTexImage3D.apply(a,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ye(){try{a.texSubImage2D.apply(a,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function De(){try{a.texSubImage3D.apply(a,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ne(){try{a.compressedTexSubImage2D.apply(a,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Xe(){try{a.compressedTexSubImage3D.apply(a,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Be(){try{a.texStorage2D.apply(a,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Ae(){try{a.texStorage3D.apply(a,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function we(){try{a.texImage2D.apply(a,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ge(){try{a.texImage3D.apply(a,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Le(I){H.equals(I)===!1&&(a.scissor(I.x,I.y,I.z,I.w),H.copy(I))}function We(I){Q.equals(I)===!1&&(a.viewport(I.x,I.y,I.z,I.w),Q.copy(I))}function at(I,ce){let he=u.get(ce);he===void 0&&(he=new WeakMap,u.set(ce,he));let ke=he.get(I);ke===void 0&&(ke=a.getUniformBlockIndex(ce,I.name),he.set(I,ke))}function Ie(I,ce){const ke=u.get(ce).get(I);h.get(ce)!==ke&&(a.uniformBlockBinding(ce,ke,I.__bindingPointIndex),h.set(ce,ke))}function re(){a.disable(a.BLEND),a.disable(a.CULL_FACE),a.disable(a.DEPTH_TEST),a.disable(a.POLYGON_OFFSET_FILL),a.disable(a.SCISSOR_TEST),a.disable(a.STENCIL_TEST),a.disable(a.SAMPLE_ALPHA_TO_COVERAGE),a.blendEquation(a.FUNC_ADD),a.blendFunc(a.ONE,a.ZERO),a.blendFuncSeparate(a.ONE,a.ZERO,a.ONE,a.ZERO),a.blendColor(0,0,0,0),a.colorMask(!0,!0,!0,!0),a.clearColor(0,0,0,0),a.depthMask(!0),a.depthFunc(a.LESS),a.clearDepth(1),a.stencilMask(4294967295),a.stencilFunc(a.ALWAYS,0,4294967295),a.stencilOp(a.KEEP,a.KEEP,a.KEEP),a.clearStencil(0),a.cullFace(a.BACK),a.frontFace(a.CCW),a.polygonOffset(0,0),a.activeTexture(a.TEXTURE0),a.bindFramebuffer(a.FRAMEBUFFER,null),n===!0&&(a.bindFramebuffer(a.DRAW_FRAMEBUFFER,null),a.bindFramebuffer(a.READ_FRAMEBUFFER,null)),a.useProgram(null),a.lineWidth(1),a.scissor(0,0,a.canvas.width,a.canvas.height),a.viewport(0,0,a.canvas.width,a.canvas.height),f={},W=null,L={},p={},v=new WeakMap,g=[],m=null,d=!1,x=null,_=null,w=null,E=null,k=null,T=null,S=null,M=new Oe(0,0,0),b=0,D=!1,N=null,V=null,R=null,U=null,z=null,H.set(0,0,a.canvas.width,a.canvas.height),Q.set(0,0,a.canvas.width,a.canvas.height),r.reset(),l.reset(),c.reset()}return{buffers:{color:r,depth:l,stencil:c},enable:de,disable:fe,bindFramebuffer:te,drawBuffers:F,useProgram:Ge,setBlending:ve,setMaterial:Je,setFlipSided:Re,setCullFace:P,setLineWidth:y,setPolygonOffset:$,setScissorTest:oe,activeTexture:ie,bindTexture:se,unbindTexture:_e,compressedTexImage2D:ue,compressedTexImage3D:me,texImage2D:we,texImage3D:ge,updateUBOMapping:at,uniformBlockBinding:Ie,texStorage2D:Be,texStorage3D:Ae,texSubImage2D:ye,texSubImage3D:De,compressedTexSubImage2D:ne,compressedTexSubImage3D:Xe,scissor:Le,viewport:We,reset:re}}function kv(a,e,t,n,i,o,s){const r=i.isWebGL2,l=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap;let u;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(P,y){return p?new OffscreenCanvas(P,y):Ao("canvas")}function g(P,y,$,oe){let ie=1;if((P.width>oe||P.height>oe)&&(ie=oe/Math.max(P.width,P.height)),ie<1||y===!0)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap){const se=y?To:Math.floor,_e=se(ie*P.width),ue=se(ie*P.height);u===void 0&&(u=v(_e,ue));const me=$?v(_e,ue):u;return me.width=_e,me.height=ue,me.getContext("2d").drawImage(P,0,0,_e,ue),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+P.width+"x"+P.height+") to ("+_e+"x"+ue+")."),me}else return"data"in P&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+P.width+"x"+P.height+")."),P;return P}function m(P){return Js(P.width)&&Js(P.height)}function d(P){return r?!1:P.wrapS!==Jt||P.wrapT!==Jt||P.minFilter!==wt&&P.minFilter!==Ot}function x(P,y){return P.generateMipmaps&&y&&P.minFilter!==wt&&P.minFilter!==Ot}function _(P){a.generateMipmap(P)}function w(P,y,$,oe,ie=!1){if(r===!1)return y;if(P!==null){if(a[P]!==void 0)return a[P];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let se=y;if(y===a.RED&&($===a.FLOAT&&(se=a.R32F),$===a.HALF_FLOAT&&(se=a.R16F),$===a.UNSIGNED_BYTE&&(se=a.R8)),y===a.RED_INTEGER&&($===a.UNSIGNED_BYTE&&(se=a.R8UI),$===a.UNSIGNED_SHORT&&(se=a.R16UI),$===a.UNSIGNED_INT&&(se=a.R32UI),$===a.BYTE&&(se=a.R8I),$===a.SHORT&&(se=a.R16I),$===a.INT&&(se=a.R32I)),y===a.RG&&($===a.FLOAT&&(se=a.RG32F),$===a.HALF_FLOAT&&(se=a.RG16F),$===a.UNSIGNED_BYTE&&(se=a.RG8)),y===a.RGBA){const _e=ie?So:Ye.getTransfer(oe);$===a.FLOAT&&(se=a.RGBA32F),$===a.HALF_FLOAT&&(se=a.RGBA16F),$===a.UNSIGNED_BYTE&&(se=_e===tt?a.SRGB8_ALPHA8:a.RGBA8),$===a.UNSIGNED_SHORT_4_4_4_4&&(se=a.RGBA4),$===a.UNSIGNED_SHORT_5_5_5_1&&(se=a.RGB5_A1)}return(se===a.R16F||se===a.R32F||se===a.RG16F||se===a.RG32F||se===a.RGBA16F||se===a.RGBA32F)&&e.get("EXT_color_buffer_float"),se}function E(P,y,$){return x(P,$)===!0||P.isFramebufferTexture&&P.minFilter!==wt&&P.minFilter!==Ot?Math.log2(Math.max(y.width,y.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?y.mipmaps.length:1}function k(P){return P===wt||P===Kr||P===ts?a.NEAREST:a.LINEAR}function T(P){const y=P.target;y.removeEventListener("dispose",T),M(y),y.isVideoTexture&&h.delete(y)}function S(P){const y=P.target;y.removeEventListener("dispose",S),D(y)}function M(P){const y=n.get(P);if(y.__webglInit===void 0)return;const $=P.source,oe=f.get($);if(oe){const ie=oe[y.__cacheKey];ie.usedTimes--,ie.usedTimes===0&&b(P),Object.keys(oe).length===0&&f.delete($)}n.remove(P)}function b(P){const y=n.get(P);a.deleteTexture(y.__webglTexture);const $=P.source,oe=f.get($);delete oe[y.__cacheKey],s.memory.textures--}function D(P){const y=P.texture,$=n.get(P),oe=n.get(y);if(oe.__webglTexture!==void 0&&(a.deleteTexture(oe.__webglTexture),s.memory.textures--),P.depthTexture&&P.depthTexture.dispose(),P.isWebGLCubeRenderTarget)for(let ie=0;ie<6;ie++){if(Array.isArray($.__webglFramebuffer[ie]))for(let se=0;se<$.__webglFramebuffer[ie].length;se++)a.deleteFramebuffer($.__webglFramebuffer[ie][se]);else a.deleteFramebuffer($.__webglFramebuffer[ie]);$.__webglDepthbuffer&&a.deleteRenderbuffer($.__webglDepthbuffer[ie])}else{if(Array.isArray($.__webglFramebuffer))for(let ie=0;ie<$.__webglFramebuffer.length;ie++)a.deleteFramebuffer($.__webglFramebuffer[ie]);else a.deleteFramebuffer($.__webglFramebuffer);if($.__webglDepthbuffer&&a.deleteRenderbuffer($.__webglDepthbuffer),$.__webglMultisampledFramebuffer&&a.deleteFramebuffer($.__webglMultisampledFramebuffer),$.__webglColorRenderbuffer)for(let ie=0;ie<$.__webglColorRenderbuffer.length;ie++)$.__webglColorRenderbuffer[ie]&&a.deleteRenderbuffer($.__webglColorRenderbuffer[ie]);$.__webglDepthRenderbuffer&&a.deleteRenderbuffer($.__webglDepthRenderbuffer)}if(P.isWebGLMultipleRenderTargets)for(let ie=0,se=y.length;ie<se;ie++){const _e=n.get(y[ie]);_e.__webglTexture&&(a.deleteTexture(_e.__webglTexture),s.memory.textures--),n.remove(y[ie])}n.remove(y),n.remove(P)}let N=0;function V(){N=0}function R(){const P=N;return P>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+i.maxTextures),N+=1,P}function U(P){const y=[];return y.push(P.wrapS),y.push(P.wrapT),y.push(P.wrapR||0),y.push(P.magFilter),y.push(P.minFilter),y.push(P.anisotropy),y.push(P.internalFormat),y.push(P.format),y.push(P.type),y.push(P.generateMipmaps),y.push(P.premultiplyAlpha),y.push(P.flipY),y.push(P.unpackAlignment),y.push(P.colorSpace),y.join()}function z(P,y){const $=n.get(P);if(P.isVideoTexture&&Je(P),P.isRenderTargetTexture===!1&&P.version>0&&$.__version!==P.version){const oe=P.image;if(oe===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(oe.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{H($,P,y);return}}t.bindTexture(a.TEXTURE_2D,$.__webglTexture,a.TEXTURE0+y)}function Z(P,y){const $=n.get(P);if(P.version>0&&$.__version!==P.version){H($,P,y);return}t.bindTexture(a.TEXTURE_2D_ARRAY,$.__webglTexture,a.TEXTURE0+y)}function G(P,y){const $=n.get(P);if(P.version>0&&$.__version!==P.version){H($,P,y);return}t.bindTexture(a.TEXTURE_3D,$.__webglTexture,a.TEXTURE0+y)}function O(P,y){const $=n.get(P);if(P.version>0&&$.__version!==P.version){Q($,P,y);return}t.bindTexture(a.TEXTURE_CUBE_MAP,$.__webglTexture,a.TEXTURE0+y)}const q={[$s]:a.REPEAT,[Jt]:a.CLAMP_TO_EDGE,[Ks]:a.MIRRORED_REPEAT},W={[wt]:a.NEAREST,[Kr]:a.NEAREST_MIPMAP_NEAREST,[ts]:a.NEAREST_MIPMAP_LINEAR,[Ot]:a.LINEAR,[$f]:a.LINEAR_MIPMAP_NEAREST,[Wa]:a.LINEAR_MIPMAP_LINEAR},L={[sd]:a.NEVER,[fd]:a.ALWAYS,[rd]:a.LESS,[dh]:a.LEQUAL,[ld]:a.EQUAL,[ud]:a.GEQUAL,[cd]:a.GREATER,[hd]:a.NOTEQUAL};function C(P,y,$){if($?(a.texParameteri(P,a.TEXTURE_WRAP_S,q[y.wrapS]),a.texParameteri(P,a.TEXTURE_WRAP_T,q[y.wrapT]),(P===a.TEXTURE_3D||P===a.TEXTURE_2D_ARRAY)&&a.texParameteri(P,a.TEXTURE_WRAP_R,q[y.wrapR]),a.texParameteri(P,a.TEXTURE_MAG_FILTER,W[y.magFilter]),a.texParameteri(P,a.TEXTURE_MIN_FILTER,W[y.minFilter])):(a.texParameteri(P,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE),a.texParameteri(P,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE),(P===a.TEXTURE_3D||P===a.TEXTURE_2D_ARRAY)&&a.texParameteri(P,a.TEXTURE_WRAP_R,a.CLAMP_TO_EDGE),(y.wrapS!==Jt||y.wrapT!==Jt)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),a.texParameteri(P,a.TEXTURE_MAG_FILTER,k(y.magFilter)),a.texParameteri(P,a.TEXTURE_MIN_FILTER,k(y.minFilter)),y.minFilter!==wt&&y.minFilter!==Ot&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),y.compareFunction&&(a.texParameteri(P,a.TEXTURE_COMPARE_MODE,a.COMPARE_REF_TO_TEXTURE),a.texParameteri(P,a.TEXTURE_COMPARE_FUNC,L[y.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){const oe=e.get("EXT_texture_filter_anisotropic");if(y.magFilter===wt||y.minFilter!==ts&&y.minFilter!==Wa||y.type===Nn&&e.has("OES_texture_float_linear")===!1||r===!1&&y.type===Si&&e.has("OES_texture_half_float_linear")===!1)return;(y.anisotropy>1||n.get(y).__currentAnisotropy)&&(a.texParameterf(P,oe.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,i.getMaxAnisotropy())),n.get(y).__currentAnisotropy=y.anisotropy)}}function B(P,y){let $=!1;P.__webglInit===void 0&&(P.__webglInit=!0,y.addEventListener("dispose",T));const oe=y.source;let ie=f.get(oe);ie===void 0&&(ie={},f.set(oe,ie));const se=U(y);if(se!==P.__cacheKey){ie[se]===void 0&&(ie[se]={texture:a.createTexture(),usedTimes:0},s.memory.textures++,$=!0),ie[se].usedTimes++;const _e=ie[P.__cacheKey];_e!==void 0&&(ie[P.__cacheKey].usedTimes--,_e.usedTimes===0&&b(y)),P.__cacheKey=se,P.__webglTexture=ie[se].texture}return $}function H(P,y,$){let oe=a.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(oe=a.TEXTURE_2D_ARRAY),y.isData3DTexture&&(oe=a.TEXTURE_3D);const ie=B(P,y),se=y.source;t.bindTexture(oe,P.__webglTexture,a.TEXTURE0+$);const _e=n.get(se);if(se.version!==_e.__version||ie===!0){t.activeTexture(a.TEXTURE0+$);const ue=Ye.getPrimaries(Ye.workingColorSpace),me=y.colorSpace===Vt?null:Ye.getPrimaries(y.colorSpace),ye=y.colorSpace===Vt||ue===me?a.NONE:a.BROWSER_DEFAULT_WEBGL;a.pixelStorei(a.UNPACK_FLIP_Y_WEBGL,y.flipY),a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),a.pixelStorei(a.UNPACK_ALIGNMENT,y.unpackAlignment),a.pixelStorei(a.UNPACK_COLORSPACE_CONVERSION_WEBGL,ye);const De=d(y)&&m(y.image)===!1;let ne=g(y.image,De,!1,i.maxTextureSize);ne=Re(y,ne);const Xe=m(ne)||r,Be=o.convert(y.format,y.colorSpace);let Ae=o.convert(y.type),we=w(y.internalFormat,Be,Ae,y.colorSpace,y.isVideoTexture);C(oe,y,Xe);let ge;const Le=y.mipmaps,We=r&&y.isVideoTexture!==!0&&we!==hh,at=_e.__version===void 0||ie===!0,Ie=E(y,ne,Xe);if(y.isDepthTexture)we=a.DEPTH_COMPONENT,r?y.type===Nn?we=a.DEPTH_COMPONENT32F:y.type===Ln?we=a.DEPTH_COMPONENT24:y.type===ta?we=a.DEPTH24_STENCIL8:we=a.DEPTH_COMPONENT16:y.type===Nn&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),y.format===na&&we===a.DEPTH_COMPONENT&&y.type!==dr&&y.type!==Ln&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),y.type=Ln,Ae=o.convert(y.type)),y.format===qa&&we===a.DEPTH_COMPONENT&&(we=a.DEPTH_STENCIL,y.type!==ta&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),y.type=ta,Ae=o.convert(y.type))),at&&(We?t.texStorage2D(a.TEXTURE_2D,1,we,ne.width,ne.height):t.texImage2D(a.TEXTURE_2D,0,we,ne.width,ne.height,0,Be,Ae,null));else if(y.isDataTexture)if(Le.length>0&&Xe){We&&at&&t.texStorage2D(a.TEXTURE_2D,Ie,we,Le[0].width,Le[0].height);for(let re=0,I=Le.length;re<I;re++)ge=Le[re],We?t.texSubImage2D(a.TEXTURE_2D,re,0,0,ge.width,ge.height,Be,Ae,ge.data):t.texImage2D(a.TEXTURE_2D,re,we,ge.width,ge.height,0,Be,Ae,ge.data);y.generateMipmaps=!1}else We?(at&&t.texStorage2D(a.TEXTURE_2D,Ie,we,ne.width,ne.height),t.texSubImage2D(a.TEXTURE_2D,0,0,0,ne.width,ne.height,Be,Ae,ne.data)):t.texImage2D(a.TEXTURE_2D,0,we,ne.width,ne.height,0,Be,Ae,ne.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){We&&at&&t.texStorage3D(a.TEXTURE_2D_ARRAY,Ie,we,Le[0].width,Le[0].height,ne.depth);for(let re=0,I=Le.length;re<I;re++)ge=Le[re],y.format!==Qt?Be!==null?We?t.compressedTexSubImage3D(a.TEXTURE_2D_ARRAY,re,0,0,0,ge.width,ge.height,ne.depth,Be,ge.data,0,0):t.compressedTexImage3D(a.TEXTURE_2D_ARRAY,re,we,ge.width,ge.height,ne.depth,0,ge.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):We?t.texSubImage3D(a.TEXTURE_2D_ARRAY,re,0,0,0,ge.width,ge.height,ne.depth,Be,Ae,ge.data):t.texImage3D(a.TEXTURE_2D_ARRAY,re,we,ge.width,ge.height,ne.depth,0,Be,Ae,ge.data)}else{We&&at&&t.texStorage2D(a.TEXTURE_2D,Ie,we,Le[0].width,Le[0].height);for(let re=0,I=Le.length;re<I;re++)ge=Le[re],y.format!==Qt?Be!==null?We?t.compressedTexSubImage2D(a.TEXTURE_2D,re,0,0,ge.width,ge.height,Be,ge.data):t.compressedTexImage2D(a.TEXTURE_2D,re,we,ge.width,ge.height,0,ge.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):We?t.texSubImage2D(a.TEXTURE_2D,re,0,0,ge.width,ge.height,Be,Ae,ge.data):t.texImage2D(a.TEXTURE_2D,re,we,ge.width,ge.height,0,Be,Ae,ge.data)}else if(y.isDataArrayTexture)We?(at&&t.texStorage3D(a.TEXTURE_2D_ARRAY,Ie,we,ne.width,ne.height,ne.depth),t.texSubImage3D(a.TEXTURE_2D_ARRAY,0,0,0,0,ne.width,ne.height,ne.depth,Be,Ae,ne.data)):t.texImage3D(a.TEXTURE_2D_ARRAY,0,we,ne.width,ne.height,ne.depth,0,Be,Ae,ne.data);else if(y.isData3DTexture)We?(at&&t.texStorage3D(a.TEXTURE_3D,Ie,we,ne.width,ne.height,ne.depth),t.texSubImage3D(a.TEXTURE_3D,0,0,0,0,ne.width,ne.height,ne.depth,Be,Ae,ne.data)):t.texImage3D(a.TEXTURE_3D,0,we,ne.width,ne.height,ne.depth,0,Be,Ae,ne.data);else if(y.isFramebufferTexture){if(at)if(We)t.texStorage2D(a.TEXTURE_2D,Ie,we,ne.width,ne.height);else{let re=ne.width,I=ne.height;for(let ce=0;ce<Ie;ce++)t.texImage2D(a.TEXTURE_2D,ce,we,re,I,0,Be,Ae,null),re>>=1,I>>=1}}else if(Le.length>0&&Xe){We&&at&&t.texStorage2D(a.TEXTURE_2D,Ie,we,Le[0].width,Le[0].height);for(let re=0,I=Le.length;re<I;re++)ge=Le[re],We?t.texSubImage2D(a.TEXTURE_2D,re,0,0,Be,Ae,ge):t.texImage2D(a.TEXTURE_2D,re,we,Be,Ae,ge);y.generateMipmaps=!1}else We?(at&&t.texStorage2D(a.TEXTURE_2D,Ie,we,ne.width,ne.height),t.texSubImage2D(a.TEXTURE_2D,0,0,0,Be,Ae,ne)):t.texImage2D(a.TEXTURE_2D,0,we,Be,Ae,ne);x(y,Xe)&&_(oe),_e.__version=se.version,y.onUpdate&&y.onUpdate(y)}P.__version=y.version}function Q(P,y,$){if(y.image.length!==6)return;const oe=B(P,y),ie=y.source;t.bindTexture(a.TEXTURE_CUBE_MAP,P.__webglTexture,a.TEXTURE0+$);const se=n.get(ie);if(ie.version!==se.__version||oe===!0){t.activeTexture(a.TEXTURE0+$);const _e=Ye.getPrimaries(Ye.workingColorSpace),ue=y.colorSpace===Vt?null:Ye.getPrimaries(y.colorSpace),me=y.colorSpace===Vt||_e===ue?a.NONE:a.BROWSER_DEFAULT_WEBGL;a.pixelStorei(a.UNPACK_FLIP_Y_WEBGL,y.flipY),a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),a.pixelStorei(a.UNPACK_ALIGNMENT,y.unpackAlignment),a.pixelStorei(a.UNPACK_COLORSPACE_CONVERSION_WEBGL,me);const ye=y.isCompressedTexture||y.image[0].isCompressedTexture,De=y.image[0]&&y.image[0].isDataTexture,ne=[];for(let re=0;re<6;re++)!ye&&!De?ne[re]=g(y.image[re],!1,!0,i.maxCubemapSize):ne[re]=De?y.image[re].image:y.image[re],ne[re]=Re(y,ne[re]);const Xe=ne[0],Be=m(Xe)||r,Ae=o.convert(y.format,y.colorSpace),we=o.convert(y.type),ge=w(y.internalFormat,Ae,we,y.colorSpace),Le=r&&y.isVideoTexture!==!0,We=se.__version===void 0||oe===!0;let at=E(y,Xe,Be);C(a.TEXTURE_CUBE_MAP,y,Be);let Ie;if(ye){Le&&We&&t.texStorage2D(a.TEXTURE_CUBE_MAP,at,ge,Xe.width,Xe.height);for(let re=0;re<6;re++){Ie=ne[re].mipmaps;for(let I=0;I<Ie.length;I++){const ce=Ie[I];y.format!==Qt?Ae!==null?Le?t.compressedTexSubImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+re,I,0,0,ce.width,ce.height,Ae,ce.data):t.compressedTexImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+re,I,ge,ce.width,ce.height,0,ce.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Le?t.texSubImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+re,I,0,0,ce.width,ce.height,Ae,we,ce.data):t.texImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+re,I,ge,ce.width,ce.height,0,Ae,we,ce.data)}}}else{Ie=y.mipmaps,Le&&We&&(Ie.length>0&&at++,t.texStorage2D(a.TEXTURE_CUBE_MAP,at,ge,ne[0].width,ne[0].height));for(let re=0;re<6;re++)if(De){Le?t.texSubImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,ne[re].width,ne[re].height,Ae,we,ne[re].data):t.texImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,ge,ne[re].width,ne[re].height,0,Ae,we,ne[re].data);for(let I=0;I<Ie.length;I++){const he=Ie[I].image[re].image;Le?t.texSubImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+re,I+1,0,0,he.width,he.height,Ae,we,he.data):t.texImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+re,I+1,ge,he.width,he.height,0,Ae,we,he.data)}}else{Le?t.texSubImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,Ae,we,ne[re]):t.texImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,ge,Ae,we,ne[re]);for(let I=0;I<Ie.length;I++){const ce=Ie[I];Le?t.texSubImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+re,I+1,0,0,Ae,we,ce.image[re]):t.texImage2D(a.TEXTURE_CUBE_MAP_POSITIVE_X+re,I+1,ge,Ae,we,ce.image[re])}}}x(y,Be)&&_(a.TEXTURE_CUBE_MAP),se.__version=ie.version,y.onUpdate&&y.onUpdate(y)}P.__version=y.version}function ee(P,y,$,oe,ie,se){const _e=o.convert($.format,$.colorSpace),ue=o.convert($.type),me=w($.internalFormat,_e,ue,$.colorSpace);if(!n.get(y).__hasExternalTextures){const De=Math.max(1,y.width>>se),ne=Math.max(1,y.height>>se);ie===a.TEXTURE_3D||ie===a.TEXTURE_2D_ARRAY?t.texImage3D(ie,se,me,De,ne,y.depth,0,_e,ue,null):t.texImage2D(ie,se,me,De,ne,0,_e,ue,null)}t.bindFramebuffer(a.FRAMEBUFFER,P),ve(y)?l.framebufferTexture2DMultisampleEXT(a.FRAMEBUFFER,oe,ie,n.get($).__webglTexture,0,Te(y)):(ie===a.TEXTURE_2D||ie>=a.TEXTURE_CUBE_MAP_POSITIVE_X&&ie<=a.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&a.framebufferTexture2D(a.FRAMEBUFFER,oe,ie,n.get($).__webglTexture,se),t.bindFramebuffer(a.FRAMEBUFFER,null)}function ae(P,y,$){if(a.bindRenderbuffer(a.RENDERBUFFER,P),y.depthBuffer&&!y.stencilBuffer){let oe=r===!0?a.DEPTH_COMPONENT24:a.DEPTH_COMPONENT16;if($||ve(y)){const ie=y.depthTexture;ie&&ie.isDepthTexture&&(ie.type===Nn?oe=a.DEPTH_COMPONENT32F:ie.type===Ln&&(oe=a.DEPTH_COMPONENT24));const se=Te(y);ve(y)?l.renderbufferStorageMultisampleEXT(a.RENDERBUFFER,se,oe,y.width,y.height):a.renderbufferStorageMultisample(a.RENDERBUFFER,se,oe,y.width,y.height)}else a.renderbufferStorage(a.RENDERBUFFER,oe,y.width,y.height);a.framebufferRenderbuffer(a.FRAMEBUFFER,a.DEPTH_ATTACHMENT,a.RENDERBUFFER,P)}else if(y.depthBuffer&&y.stencilBuffer){const oe=Te(y);$&&ve(y)===!1?a.renderbufferStorageMultisample(a.RENDERBUFFER,oe,a.DEPTH24_STENCIL8,y.width,y.height):ve(y)?l.renderbufferStorageMultisampleEXT(a.RENDERBUFFER,oe,a.DEPTH24_STENCIL8,y.width,y.height):a.renderbufferStorage(a.RENDERBUFFER,a.DEPTH_STENCIL,y.width,y.height),a.framebufferRenderbuffer(a.FRAMEBUFFER,a.DEPTH_STENCIL_ATTACHMENT,a.RENDERBUFFER,P)}else{const oe=y.isWebGLMultipleRenderTargets===!0?y.texture:[y.texture];for(let ie=0;ie<oe.length;ie++){const se=oe[ie],_e=o.convert(se.format,se.colorSpace),ue=o.convert(se.type),me=w(se.internalFormat,_e,ue,se.colorSpace),ye=Te(y);$&&ve(y)===!1?a.renderbufferStorageMultisample(a.RENDERBUFFER,ye,me,y.width,y.height):ve(y)?l.renderbufferStorageMultisampleEXT(a.RENDERBUFFER,ye,me,y.width,y.height):a.renderbufferStorage(a.RENDERBUFFER,me,y.width,y.height)}}a.bindRenderbuffer(a.RENDERBUFFER,null)}function de(P,y){if(y&&y.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(a.FRAMEBUFFER,P),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(y.depthTexture).__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),z(y.depthTexture,0);const oe=n.get(y.depthTexture).__webglTexture,ie=Te(y);if(y.depthTexture.format===na)ve(y)?l.framebufferTexture2DMultisampleEXT(a.FRAMEBUFFER,a.DEPTH_ATTACHMENT,a.TEXTURE_2D,oe,0,ie):a.framebufferTexture2D(a.FRAMEBUFFER,a.DEPTH_ATTACHMENT,a.TEXTURE_2D,oe,0);else if(y.depthTexture.format===qa)ve(y)?l.framebufferTexture2DMultisampleEXT(a.FRAMEBUFFER,a.DEPTH_STENCIL_ATTACHMENT,a.TEXTURE_2D,oe,0,ie):a.framebufferTexture2D(a.FRAMEBUFFER,a.DEPTH_STENCIL_ATTACHMENT,a.TEXTURE_2D,oe,0);else throw new Error("Unknown depthTexture format")}function fe(P){const y=n.get(P),$=P.isWebGLCubeRenderTarget===!0;if(P.depthTexture&&!y.__autoAllocateDepthBuffer){if($)throw new Error("target.depthTexture not supported in Cube render targets");de(y.__webglFramebuffer,P)}else if($){y.__webglDepthbuffer=[];for(let oe=0;oe<6;oe++)t.bindFramebuffer(a.FRAMEBUFFER,y.__webglFramebuffer[oe]),y.__webglDepthbuffer[oe]=a.createRenderbuffer(),ae(y.__webglDepthbuffer[oe],P,!1)}else t.bindFramebuffer(a.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer=a.createRenderbuffer(),ae(y.__webglDepthbuffer,P,!1);t.bindFramebuffer(a.FRAMEBUFFER,null)}function te(P,y,$){const oe=n.get(P);y!==void 0&&ee(oe.__webglFramebuffer,P,P.texture,a.COLOR_ATTACHMENT0,a.TEXTURE_2D,0),$!==void 0&&fe(P)}function F(P){const y=P.texture,$=n.get(P),oe=n.get(y);P.addEventListener("dispose",S),P.isWebGLMultipleRenderTargets!==!0&&(oe.__webglTexture===void 0&&(oe.__webglTexture=a.createTexture()),oe.__version=y.version,s.memory.textures++);const ie=P.isWebGLCubeRenderTarget===!0,se=P.isWebGLMultipleRenderTargets===!0,_e=m(P)||r;if(ie){$.__webglFramebuffer=[];for(let ue=0;ue<6;ue++)if(r&&y.mipmaps&&y.mipmaps.length>0){$.__webglFramebuffer[ue]=[];for(let me=0;me<y.mipmaps.length;me++)$.__webglFramebuffer[ue][me]=a.createFramebuffer()}else $.__webglFramebuffer[ue]=a.createFramebuffer()}else{if(r&&y.mipmaps&&y.mipmaps.length>0){$.__webglFramebuffer=[];for(let ue=0;ue<y.mipmaps.length;ue++)$.__webglFramebuffer[ue]=a.createFramebuffer()}else $.__webglFramebuffer=a.createFramebuffer();if(se)if(i.drawBuffers){const ue=P.texture;for(let me=0,ye=ue.length;me<ye;me++){const De=n.get(ue[me]);De.__webglTexture===void 0&&(De.__webglTexture=a.createTexture(),s.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(r&&P.samples>0&&ve(P)===!1){const ue=se?y:[y];$.__webglMultisampledFramebuffer=a.createFramebuffer(),$.__webglColorRenderbuffer=[],t.bindFramebuffer(a.FRAMEBUFFER,$.__webglMultisampledFramebuffer);for(let me=0;me<ue.length;me++){const ye=ue[me];$.__webglColorRenderbuffer[me]=a.createRenderbuffer(),a.bindRenderbuffer(a.RENDERBUFFER,$.__webglColorRenderbuffer[me]);const De=o.convert(ye.format,ye.colorSpace),ne=o.convert(ye.type),Xe=w(ye.internalFormat,De,ne,ye.colorSpace,P.isXRRenderTarget===!0),Be=Te(P);a.renderbufferStorageMultisample(a.RENDERBUFFER,Be,Xe,P.width,P.height),a.framebufferRenderbuffer(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0+me,a.RENDERBUFFER,$.__webglColorRenderbuffer[me])}a.bindRenderbuffer(a.RENDERBUFFER,null),P.depthBuffer&&($.__webglDepthRenderbuffer=a.createRenderbuffer(),ae($.__webglDepthRenderbuffer,P,!0)),t.bindFramebuffer(a.FRAMEBUFFER,null)}}if(ie){t.bindTexture(a.TEXTURE_CUBE_MAP,oe.__webglTexture),C(a.TEXTURE_CUBE_MAP,y,_e);for(let ue=0;ue<6;ue++)if(r&&y.mipmaps&&y.mipmaps.length>0)for(let me=0;me<y.mipmaps.length;me++)ee($.__webglFramebuffer[ue][me],P,y,a.COLOR_ATTACHMENT0,a.TEXTURE_CUBE_MAP_POSITIVE_X+ue,me);else ee($.__webglFramebuffer[ue],P,y,a.COLOR_ATTACHMENT0,a.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0);x(y,_e)&&_(a.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(se){const ue=P.texture;for(let me=0,ye=ue.length;me<ye;me++){const De=ue[me],ne=n.get(De);t.bindTexture(a.TEXTURE_2D,ne.__webglTexture),C(a.TEXTURE_2D,De,_e),ee($.__webglFramebuffer,P,De,a.COLOR_ATTACHMENT0+me,a.TEXTURE_2D,0),x(De,_e)&&_(a.TEXTURE_2D)}t.unbindTexture()}else{let ue=a.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(r?ue=P.isWebGL3DRenderTarget?a.TEXTURE_3D:a.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),t.bindTexture(ue,oe.__webglTexture),C(ue,y,_e),r&&y.mipmaps&&y.mipmaps.length>0)for(let me=0;me<y.mipmaps.length;me++)ee($.__webglFramebuffer[me],P,y,a.COLOR_ATTACHMENT0,ue,me);else ee($.__webglFramebuffer,P,y,a.COLOR_ATTACHMENT0,ue,0);x(y,_e)&&_(ue),t.unbindTexture()}P.depthBuffer&&fe(P)}function Ge(P){const y=m(P)||r,$=P.isWebGLMultipleRenderTargets===!0?P.texture:[P.texture];for(let oe=0,ie=$.length;oe<ie;oe++){const se=$[oe];if(x(se,y)){const _e=P.isWebGLCubeRenderTarget?a.TEXTURE_CUBE_MAP:a.TEXTURE_2D,ue=n.get(se).__webglTexture;t.bindTexture(_e,ue),_(_e),t.unbindTexture()}}}function Me(P){if(r&&P.samples>0&&ve(P)===!1){const y=P.isWebGLMultipleRenderTargets?P.texture:[P.texture],$=P.width,oe=P.height;let ie=a.COLOR_BUFFER_BIT;const se=[],_e=P.stencilBuffer?a.DEPTH_STENCIL_ATTACHMENT:a.DEPTH_ATTACHMENT,ue=n.get(P),me=P.isWebGLMultipleRenderTargets===!0;if(me)for(let ye=0;ye<y.length;ye++)t.bindFramebuffer(a.FRAMEBUFFER,ue.__webglMultisampledFramebuffer),a.framebufferRenderbuffer(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0+ye,a.RENDERBUFFER,null),t.bindFramebuffer(a.FRAMEBUFFER,ue.__webglFramebuffer),a.framebufferTexture2D(a.DRAW_FRAMEBUFFER,a.COLOR_ATTACHMENT0+ye,a.TEXTURE_2D,null,0);t.bindFramebuffer(a.READ_FRAMEBUFFER,ue.__webglMultisampledFramebuffer),t.bindFramebuffer(a.DRAW_FRAMEBUFFER,ue.__webglFramebuffer);for(let ye=0;ye<y.length;ye++){se.push(a.COLOR_ATTACHMENT0+ye),P.depthBuffer&&se.push(_e);const De=ue.__ignoreDepthValues!==void 0?ue.__ignoreDepthValues:!1;if(De===!1&&(P.depthBuffer&&(ie|=a.DEPTH_BUFFER_BIT),P.stencilBuffer&&(ie|=a.STENCIL_BUFFER_BIT)),me&&a.framebufferRenderbuffer(a.READ_FRAMEBUFFER,a.COLOR_ATTACHMENT0,a.RENDERBUFFER,ue.__webglColorRenderbuffer[ye]),De===!0&&(a.invalidateFramebuffer(a.READ_FRAMEBUFFER,[_e]),a.invalidateFramebuffer(a.DRAW_FRAMEBUFFER,[_e])),me){const ne=n.get(y[ye]).__webglTexture;a.framebufferTexture2D(a.DRAW_FRAMEBUFFER,a.COLOR_ATTACHMENT0,a.TEXTURE_2D,ne,0)}a.blitFramebuffer(0,0,$,oe,0,0,$,oe,ie,a.NEAREST),c&&a.invalidateFramebuffer(a.READ_FRAMEBUFFER,se)}if(t.bindFramebuffer(a.READ_FRAMEBUFFER,null),t.bindFramebuffer(a.DRAW_FRAMEBUFFER,null),me)for(let ye=0;ye<y.length;ye++){t.bindFramebuffer(a.FRAMEBUFFER,ue.__webglMultisampledFramebuffer),a.framebufferRenderbuffer(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0+ye,a.RENDERBUFFER,ue.__webglColorRenderbuffer[ye]);const De=n.get(y[ye]).__webglTexture;t.bindFramebuffer(a.FRAMEBUFFER,ue.__webglFramebuffer),a.framebufferTexture2D(a.DRAW_FRAMEBUFFER,a.COLOR_ATTACHMENT0+ye,a.TEXTURE_2D,De,0)}t.bindFramebuffer(a.DRAW_FRAMEBUFFER,ue.__webglMultisampledFramebuffer)}}function Te(P){return Math.min(i.maxSamples,P.samples)}function ve(P){const y=n.get(P);return r&&P.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function Je(P){const y=s.render.frame;h.get(P)!==y&&(h.set(P,y),P.update())}function Re(P,y){const $=P.colorSpace,oe=P.format,ie=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||P.format===Zs||$!==bn&&$!==Vt&&(Ye.getTransfer($)===tt?r===!1?e.has("EXT_sRGB")===!0&&oe===Qt?(P.format=Zs,P.minFilter=Ot,P.generateMipmaps=!1):y=mh.sRGBToLinear(y):(oe!==Qt||ie!==In)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",$)),y}this.allocateTextureUnit=R,this.resetTextureUnits=V,this.setTexture2D=z,this.setTexture2DArray=Z,this.setTexture3D=G,this.setTextureCube=O,this.rebindTextures=te,this.setupRenderTarget=F,this.updateRenderTargetMipmap=Ge,this.updateMultisampleRenderTarget=Me,this.setupDepthRenderbuffer=fe,this.setupFrameBufferTexture=ee,this.useMultisampledRTT=ve}function Ev(a,e,t){const n=t.isWebGL2;function i(o,s=Vt){let r;const l=Ye.getTransfer(s);if(o===In)return a.UNSIGNED_BYTE;if(o===ih)return a.UNSIGNED_SHORT_4_4_4_4;if(o===oh)return a.UNSIGNED_SHORT_5_5_5_1;if(o===Kf)return a.BYTE;if(o===Zf)return a.SHORT;if(o===dr)return a.UNSIGNED_SHORT;if(o===ah)return a.INT;if(o===Ln)return a.UNSIGNED_INT;if(o===Nn)return a.FLOAT;if(o===Si)return n?a.HALF_FLOAT:(r=e.get("OES_texture_half_float"),r!==null?r.HALF_FLOAT_OES:null);if(o===Jf)return a.ALPHA;if(o===Qt)return a.RGBA;if(o===Qf)return a.LUMINANCE;if(o===ed)return a.LUMINANCE_ALPHA;if(o===na)return a.DEPTH_COMPONENT;if(o===qa)return a.DEPTH_STENCIL;if(o===Zs)return r=e.get("EXT_sRGB"),r!==null?r.SRGB_ALPHA_EXT:null;if(o===td)return a.RED;if(o===sh)return a.RED_INTEGER;if(o===rh)return a.RG;if(o===lh)return a.RG_INTEGER;if(o===ch)return a.RGBA_INTEGER;if(o===ns||o===as||o===is||o===os)if(l===tt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(o===ns)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(o===as)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(o===is)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(o===os)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(o===ns)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(o===as)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(o===is)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(o===os)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(o===Zr||o===Jr||o===Qr||o===el)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(o===Zr)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(o===Jr)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(o===Qr)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(o===el)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(o===hh)return r=e.get("WEBGL_compressed_texture_etc1"),r!==null?r.COMPRESSED_RGB_ETC1_WEBGL:null;if(o===tl||o===nl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(o===tl)return l===tt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(o===nl)return l===tt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(o===al||o===il||o===ol||o===sl||o===rl||o===ll||o===cl||o===hl||o===ul||o===fl||o===dl||o===pl||o===ml||o===gl)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(o===al)return l===tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(o===il)return l===tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(o===ol)return l===tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(o===sl)return l===tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(o===rl)return l===tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(o===ll)return l===tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(o===cl)return l===tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(o===hl)return l===tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(o===ul)return l===tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(o===fl)return l===tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(o===dl)return l===tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(o===pl)return l===tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(o===ml)return l===tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(o===gl)return l===tt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(o===ss||o===vl||o===_l)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(o===ss)return l===tt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(o===vl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(o===_l)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(o===nd||o===xl||o===Ml||o===wl)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(o===ss)return r.COMPRESSED_RED_RGTC1_EXT;if(o===xl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(o===Ml)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(o===wl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return o===ta?n?a.UNSIGNED_INT_24_8:(r=e.get("WEBGL_depth_texture"),r!==null?r.UNSIGNED_INT_24_8_WEBGL:null):a[o]!==void 0?a[o]:null}return{convert:i}}class Tv extends Zt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class fi extends bt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Av={type:"move"};class Ps{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new fi,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new fi,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new Y,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new Y),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new fi,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new Y,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new Y),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,o=null,s=null;const r=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){s=!0;for(const g of e.hand.values()){const m=t.getJointPose(g,n),d=this._getHandJoint(c,g);m!==null&&(d.matrix.fromArray(m.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=m.radius),d.visible=m!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],f=h.position.distanceTo(u.position),p=.02,v=.005;c.inputState.pinching&&f>p+v?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=p-v&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(o=t.getPose(e.gripSpace,n),o!==null&&(l.matrix.fromArray(o.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,o.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(o.linearVelocity)):l.hasLinearVelocity=!1,o.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(o.angularVelocity)):l.hasAngularVelocity=!1));r!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&o!==null&&(i=o),i!==null&&(r.matrix.fromArray(i.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,i.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(i.linearVelocity)):r.hasLinearVelocity=!1,i.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(i.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(Av)))}return r!==null&&(r.visible=i!==null),l!==null&&(l.visible=o!==null),c!==null&&(c.visible=s!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new fi;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class Pv extends $a{constructor(e,t){super();const n=this;let i=null,o=1,s=null,r="local-floor",l=1,c=null,h=null,u=null,f=null,p=null,v=null;const g=t.getContextAttributes();let m=null,d=null;const x=[],_=[],w=new He;let E=null;const k=new Zt;k.layers.enable(1),k.viewport=new ct;const T=new Zt;T.layers.enable(2),T.viewport=new ct;const S=[k,T],M=new Tv;M.layers.enable(1),M.layers.enable(2);let b=null,D=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(C){let B=x[C];return B===void 0&&(B=new Ps,x[C]=B),B.getTargetRaySpace()},this.getControllerGrip=function(C){let B=x[C];return B===void 0&&(B=new Ps,x[C]=B),B.getGripSpace()},this.getHand=function(C){let B=x[C];return B===void 0&&(B=new Ps,x[C]=B),B.getHandSpace()};function N(C){const B=_.indexOf(C.inputSource);if(B===-1)return;const H=x[B];H!==void 0&&(H.update(C.inputSource,C.frame,c||s),H.dispatchEvent({type:C.type,data:C.inputSource}))}function V(){i.removeEventListener("select",N),i.removeEventListener("selectstart",N),i.removeEventListener("selectend",N),i.removeEventListener("squeeze",N),i.removeEventListener("squeezestart",N),i.removeEventListener("squeezeend",N),i.removeEventListener("end",V),i.removeEventListener("inputsourceschange",R);for(let C=0;C<x.length;C++){const B=_[C];B!==null&&(_[C]=null,x[C].disconnect(B))}b=null,D=null,e.setRenderTarget(m),p=null,f=null,u=null,i=null,d=null,L.stop(),n.isPresenting=!1,e.setPixelRatio(E),e.setSize(w.width,w.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(C){o=C,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(C){r=C,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||s},this.setReferenceSpace=function(C){c=C},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return u},this.getFrame=function(){return v},this.getSession=function(){return i},this.setSession=async function(C){if(i=C,i!==null){if(m=e.getRenderTarget(),i.addEventListener("select",N),i.addEventListener("selectstart",N),i.addEventListener("selectend",N),i.addEventListener("squeeze",N),i.addEventListener("squeezestart",N),i.addEventListener("squeezeend",N),i.addEventListener("end",V),i.addEventListener("inputsourceschange",R),g.xrCompatible!==!0&&await t.makeXRCompatible(),E=e.getPixelRatio(),e.getSize(w),i.renderState.layers===void 0||e.capabilities.isWebGL2===!1){const B={antialias:i.renderState.layers===void 0?g.antialias:!0,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:o};p=new XRWebGLLayer(i,t,B),i.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),d=new sa(p.framebufferWidth,p.framebufferHeight,{format:Qt,type:In,colorSpace:e.outputColorSpace,stencilBuffer:g.stencil})}else{let B=null,H=null,Q=null;g.depth&&(Q=g.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,B=g.stencil?qa:na,H=g.stencil?ta:Ln);const ee={colorFormat:t.RGBA8,depthFormat:Q,scaleFactor:o};u=new XRWebGLBinding(i,t),f=u.createProjectionLayer(ee),i.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),d=new sa(f.textureWidth,f.textureHeight,{format:Qt,type:In,depthTexture:new Eh(f.textureWidth,f.textureHeight,H,void 0,void 0,void 0,void 0,void 0,void 0,B),stencilBuffer:g.stencil,colorSpace:e.outputColorSpace,samples:g.antialias?4:0});const ae=e.properties.get(d);ae.__ignoreDepthValues=f.ignoreDepthValues}d.isXRRenderTarget=!0,this.setFoveation(l),c=null,s=await i.requestReferenceSpace(r),L.setContext(i),L.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode};function R(C){for(let B=0;B<C.removed.length;B++){const H=C.removed[B],Q=_.indexOf(H);Q>=0&&(_[Q]=null,x[Q].disconnect(H))}for(let B=0;B<C.added.length;B++){const H=C.added[B];let Q=_.indexOf(H);if(Q===-1){for(let ae=0;ae<x.length;ae++)if(ae>=_.length){_.push(H),Q=ae;break}else if(_[ae]===null){_[ae]=H,Q=ae;break}if(Q===-1)break}const ee=x[Q];ee&&ee.connect(H)}}const U=new Y,z=new Y;function Z(C,B,H){U.setFromMatrixPosition(B.matrixWorld),z.setFromMatrixPosition(H.matrixWorld);const Q=U.distanceTo(z),ee=B.projectionMatrix.elements,ae=H.projectionMatrix.elements,de=ee[14]/(ee[10]-1),fe=ee[14]/(ee[10]+1),te=(ee[9]+1)/ee[5],F=(ee[9]-1)/ee[5],Ge=(ee[8]-1)/ee[0],Me=(ae[8]+1)/ae[0],Te=de*Ge,ve=de*Me,Je=Q/(-Ge+Me),Re=Je*-Ge;B.matrixWorld.decompose(C.position,C.quaternion,C.scale),C.translateX(Re),C.translateZ(Je),C.matrixWorld.compose(C.position,C.quaternion,C.scale),C.matrixWorldInverse.copy(C.matrixWorld).invert();const P=de+Je,y=fe+Je,$=Te-Re,oe=ve+(Q-Re),ie=te*fe/y*P,se=F*fe/y*P;C.projectionMatrix.makePerspective($,oe,ie,se,P,y),C.projectionMatrixInverse.copy(C.projectionMatrix).invert()}function G(C,B){B===null?C.matrixWorld.copy(C.matrix):C.matrixWorld.multiplyMatrices(B.matrixWorld,C.matrix),C.matrixWorldInverse.copy(C.matrixWorld).invert()}this.updateCamera=function(C){if(i===null)return;M.near=T.near=k.near=C.near,M.far=T.far=k.far=C.far,(b!==M.near||D!==M.far)&&(i.updateRenderState({depthNear:M.near,depthFar:M.far}),b=M.near,D=M.far);const B=C.parent,H=M.cameras;G(M,B);for(let Q=0;Q<H.length;Q++)G(H[Q],B);H.length===2?Z(M,k,T):M.projectionMatrix.copy(k.projectionMatrix),O(C,M,B)};function O(C,B,H){H===null?C.matrix.copy(B.matrixWorld):(C.matrix.copy(H.matrixWorld),C.matrix.invert(),C.matrix.multiply(B.matrixWorld)),C.matrix.decompose(C.position,C.quaternion,C.scale),C.updateMatrixWorld(!0),C.projectionMatrix.copy(B.projectionMatrix),C.projectionMatrixInverse.copy(B.projectionMatrixInverse),C.isPerspectiveCamera&&(C.fov=yi*2*Math.atan(1/C.projectionMatrix.elements[5]),C.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(f===null&&p===null))return l},this.setFoveation=function(C){l=C,f!==null&&(f.fixedFoveation=C),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=C)};let q=null;function W(C,B){if(h=B.getViewerPose(c||s),v=B,h!==null){const H=h.views;p!==null&&(e.setRenderTargetFramebuffer(d,p.framebuffer),e.setRenderTarget(d));let Q=!1;H.length!==M.cameras.length&&(M.cameras.length=0,Q=!0);for(let ee=0;ee<H.length;ee++){const ae=H[ee];let de=null;if(p!==null)de=p.getViewport(ae);else{const te=u.getViewSubImage(f,ae);de=te.viewport,ee===0&&(e.setRenderTargetTextures(d,te.colorTexture,f.ignoreDepthValues?void 0:te.depthStencilTexture),e.setRenderTarget(d))}let fe=S[ee];fe===void 0&&(fe=new Zt,fe.layers.enable(ee),fe.viewport=new ct,S[ee]=fe),fe.matrix.fromArray(ae.transform.matrix),fe.matrix.decompose(fe.position,fe.quaternion,fe.scale),fe.projectionMatrix.fromArray(ae.projectionMatrix),fe.projectionMatrixInverse.copy(fe.projectionMatrix).invert(),fe.viewport.set(de.x,de.y,de.width,de.height),ee===0&&(M.matrix.copy(fe.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),Q===!0&&M.cameras.push(fe)}}for(let H=0;H<x.length;H++){const Q=_[H],ee=x[H];Q!==null&&ee!==void 0&&ee.update(Q,B,c||s)}q&&q(C,B),B.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:B}),v=null}const L=new kh;L.setAnimationLoop(W),this.setAnimationLoop=function(C){q=C},this.dispose=function(){}}}function Rv(a,e){function t(m,d){m.matrixAutoUpdate===!0&&m.updateMatrix(),d.value.copy(m.matrix)}function n(m,d){d.color.getRGB(m.fogColor.value,bh(a)),d.isFog?(m.fogNear.value=d.near,m.fogFar.value=d.far):d.isFogExp2&&(m.fogDensity.value=d.density)}function i(m,d,x,_,w){d.isMeshBasicMaterial||d.isMeshLambertMaterial?o(m,d):d.isMeshToonMaterial?(o(m,d),u(m,d)):d.isMeshPhongMaterial?(o(m,d),h(m,d)):d.isMeshStandardMaterial?(o(m,d),f(m,d),d.isMeshPhysicalMaterial&&p(m,d,w)):d.isMeshMatcapMaterial?(o(m,d),v(m,d)):d.isMeshDepthMaterial?o(m,d):d.isMeshDistanceMaterial?(o(m,d),g(m,d)):d.isMeshNormalMaterial?o(m,d):d.isLineBasicMaterial?(s(m,d),d.isLineDashedMaterial&&r(m,d)):d.isPointsMaterial?l(m,d,x,_):d.isSpriteMaterial?c(m,d):d.isShadowMaterial?(m.color.value.copy(d.color),m.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function o(m,d){m.opacity.value=d.opacity,d.color&&m.diffuse.value.copy(d.color),d.emissive&&m.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(m.map.value=d.map,t(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.bumpMap&&(m.bumpMap.value=d.bumpMap,t(d.bumpMap,m.bumpMapTransform),m.bumpScale.value=d.bumpScale,d.side===Dt&&(m.bumpScale.value*=-1)),d.normalMap&&(m.normalMap.value=d.normalMap,t(d.normalMap,m.normalMapTransform),m.normalScale.value.copy(d.normalScale),d.side===Dt&&m.normalScale.value.negate()),d.displacementMap&&(m.displacementMap.value=d.displacementMap,t(d.displacementMap,m.displacementMapTransform),m.displacementScale.value=d.displacementScale,m.displacementBias.value=d.displacementBias),d.emissiveMap&&(m.emissiveMap.value=d.emissiveMap,t(d.emissiveMap,m.emissiveMapTransform)),d.specularMap&&(m.specularMap.value=d.specularMap,t(d.specularMap,m.specularMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest);const x=e.get(d).envMap;if(x&&(m.envMap.value=x,m.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=d.reflectivity,m.ior.value=d.ior,m.refractionRatio.value=d.refractionRatio),d.lightMap){m.lightMap.value=d.lightMap;const _=a._useLegacyLights===!0?Math.PI:1;m.lightMapIntensity.value=d.lightMapIntensity*_,t(d.lightMap,m.lightMapTransform)}d.aoMap&&(m.aoMap.value=d.aoMap,m.aoMapIntensity.value=d.aoMapIntensity,t(d.aoMap,m.aoMapTransform))}function s(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,d.map&&(m.map.value=d.map,t(d.map,m.mapTransform))}function r(m,d){m.dashSize.value=d.dashSize,m.totalSize.value=d.dashSize+d.gapSize,m.scale.value=d.scale}function l(m,d,x,_){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.size.value=d.size*x,m.scale.value=_*.5,d.map&&(m.map.value=d.map,t(d.map,m.uvTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function c(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.rotation.value=d.rotation,d.map&&(m.map.value=d.map,t(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function h(m,d){m.specular.value.copy(d.specular),m.shininess.value=Math.max(d.shininess,1e-4)}function u(m,d){d.gradientMap&&(m.gradientMap.value=d.gradientMap)}function f(m,d){m.metalness.value=d.metalness,d.metalnessMap&&(m.metalnessMap.value=d.metalnessMap,t(d.metalnessMap,m.metalnessMapTransform)),m.roughness.value=d.roughness,d.roughnessMap&&(m.roughnessMap.value=d.roughnessMap,t(d.roughnessMap,m.roughnessMapTransform)),e.get(d).envMap&&(m.envMapIntensity.value=d.envMapIntensity)}function p(m,d,x){m.ior.value=d.ior,d.sheen>0&&(m.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),m.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(m.sheenColorMap.value=d.sheenColorMap,t(d.sheenColorMap,m.sheenColorMapTransform)),d.sheenRoughnessMap&&(m.sheenRoughnessMap.value=d.sheenRoughnessMap,t(d.sheenRoughnessMap,m.sheenRoughnessMapTransform))),d.clearcoat>0&&(m.clearcoat.value=d.clearcoat,m.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(m.clearcoatMap.value=d.clearcoatMap,t(d.clearcoatMap,m.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,t(d.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(m.clearcoatNormalMap.value=d.clearcoatNormalMap,t(d.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===Dt&&m.clearcoatNormalScale.value.negate())),d.iridescence>0&&(m.iridescence.value=d.iridescence,m.iridescenceIOR.value=d.iridescenceIOR,m.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(m.iridescenceMap.value=d.iridescenceMap,t(d.iridescenceMap,m.iridescenceMapTransform)),d.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=d.iridescenceThicknessMap,t(d.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),d.transmission>0&&(m.transmission.value=d.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),d.transmissionMap&&(m.transmissionMap.value=d.transmissionMap,t(d.transmissionMap,m.transmissionMapTransform)),m.thickness.value=d.thickness,d.thicknessMap&&(m.thicknessMap.value=d.thicknessMap,t(d.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=d.attenuationDistance,m.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(m.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(m.anisotropyMap.value=d.anisotropyMap,t(d.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=d.specularIntensity,m.specularColor.value.copy(d.specularColor),d.specularColorMap&&(m.specularColorMap.value=d.specularColorMap,t(d.specularColorMap,m.specularColorMapTransform)),d.specularIntensityMap&&(m.specularIntensityMap.value=d.specularIntensityMap,t(d.specularIntensityMap,m.specularIntensityMapTransform))}function v(m,d){d.matcap&&(m.matcap.value=d.matcap)}function g(m,d){const x=e.get(d).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function Cv(a,e,t,n){let i={},o={},s=[];const r=t.isWebGL2?a.getParameter(a.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(x,_){const w=_.program;n.uniformBlockBinding(x,w)}function c(x,_){let w=i[x.id];w===void 0&&(v(x),w=h(x),i[x.id]=w,x.addEventListener("dispose",m));const E=_.program;n.updateUBOMapping(x,E);const k=e.render.frame;o[x.id]!==k&&(f(x),o[x.id]=k)}function h(x){const _=u();x.__bindingPointIndex=_;const w=a.createBuffer(),E=x.__size,k=x.usage;return a.bindBuffer(a.UNIFORM_BUFFER,w),a.bufferData(a.UNIFORM_BUFFER,E,k),a.bindBuffer(a.UNIFORM_BUFFER,null),a.bindBufferBase(a.UNIFORM_BUFFER,_,w),w}function u(){for(let x=0;x<r;x++)if(s.indexOf(x)===-1)return s.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(x){const _=i[x.id],w=x.uniforms,E=x.__cache;a.bindBuffer(a.UNIFORM_BUFFER,_);for(let k=0,T=w.length;k<T;k++){const S=Array.isArray(w[k])?w[k]:[w[k]];for(let M=0,b=S.length;M<b;M++){const D=S[M];if(p(D,k,M,E)===!0){const N=D.__offset,V=Array.isArray(D.value)?D.value:[D.value];let R=0;for(let U=0;U<V.length;U++){const z=V[U],Z=g(z);typeof z=="number"||typeof z=="boolean"?(D.__data[0]=z,a.bufferSubData(a.UNIFORM_BUFFER,N+R,D.__data)):z.isMatrix3?(D.__data[0]=z.elements[0],D.__data[1]=z.elements[1],D.__data[2]=z.elements[2],D.__data[3]=0,D.__data[4]=z.elements[3],D.__data[5]=z.elements[4],D.__data[6]=z.elements[5],D.__data[7]=0,D.__data[8]=z.elements[6],D.__data[9]=z.elements[7],D.__data[10]=z.elements[8],D.__data[11]=0):(z.toArray(D.__data,R),R+=Z.storage/Float32Array.BYTES_PER_ELEMENT)}a.bufferSubData(a.UNIFORM_BUFFER,N,D.__data)}}}a.bindBuffer(a.UNIFORM_BUFFER,null)}function p(x,_,w,E){const k=x.value,T=_+"_"+w;if(E[T]===void 0)return typeof k=="number"||typeof k=="boolean"?E[T]=k:E[T]=k.clone(),!0;{const S=E[T];if(typeof k=="number"||typeof k=="boolean"){if(S!==k)return E[T]=k,!0}else if(S.equals(k)===!1)return S.copy(k),!0}return!1}function v(x){const _=x.uniforms;let w=0;const E=16;for(let T=0,S=_.length;T<S;T++){const M=Array.isArray(_[T])?_[T]:[_[T]];for(let b=0,D=M.length;b<D;b++){const N=M[b],V=Array.isArray(N.value)?N.value:[N.value];for(let R=0,U=V.length;R<U;R++){const z=V[R],Z=g(z),G=w%E;G!==0&&E-G<Z.boundary&&(w+=E-G),N.__data=new Float32Array(Z.storage/Float32Array.BYTES_PER_ELEMENT),N.__offset=w,w+=Z.storage}}}const k=w%E;return k>0&&(w+=E-k),x.__size=w,x.__cache={},this}function g(x){const _={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(_.boundary=4,_.storage=4):x.isVector2?(_.boundary=8,_.storage=8):x.isVector3||x.isColor?(_.boundary=16,_.storage=12):x.isVector4?(_.boundary=16,_.storage=16):x.isMatrix3?(_.boundary=48,_.storage=48):x.isMatrix4?(_.boundary=64,_.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),_}function m(x){const _=x.target;_.removeEventListener("dispose",m);const w=s.indexOf(_.__bindingPointIndex);s.splice(w,1),a.deleteBuffer(i[_.id]),delete i[_.id],delete o[_.id]}function d(){for(const x in i)a.deleteBuffer(i[x]);s=[],i={},o={}}return{bind:l,update:c,dispose:d}}class Lh{constructor(e={}){const{canvas:t=Td(),context:n=null,depth:i=!0,stencil:o=!0,alpha:s=!1,antialias:r=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=e;this.isWebGLRenderer=!0;let f;n!==null?f=n.getContextAttributes().alpha:f=s;const p=new Uint32Array(4),v=new Int32Array(4);let g=null,m=null;const d=[],x=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=vt,this._useLegacyLights=!1,this.toneMapping=Un,this.toneMappingExposure=1;const _=this;let w=!1,E=0,k=0,T=null,S=-1,M=null;const b=new ct,D=new ct;let N=null;const V=new Oe(0);let R=0,U=t.width,z=t.height,Z=1,G=null,O=null;const q=new ct(0,0,U,z),W=new ct(0,0,U,z);let L=!1;const C=new xr;let B=!1,H=!1,Q=null;const ee=new ht,ae=new He,de=new Y,fe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function te(){return T===null?Z:1}let F=n;function Ge(A,X){for(let K=0;K<A.length;K++){const J=A[K],j=t.getContext(J,X);if(j!==null)return j}return null}try{const A={alpha:!0,depth:i,stencil:o,antialias:r,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${fr}`),t.addEventListener("webglcontextlost",re,!1),t.addEventListener("webglcontextrestored",I,!1),t.addEventListener("webglcontextcreationerror",ce,!1),F===null){const X=["webgl2","webgl","experimental-webgl"];if(_.isWebGL1Renderer===!0&&X.shift(),F=Ge(X,A),F===null)throw Ge(X)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&F instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),F.getShaderPrecisionFormat===void 0&&(F.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}let Me,Te,ve,Je,Re,P,y,$,oe,ie,se,_e,ue,me,ye,De,ne,Xe,Be,Ae,we,ge,Le,We;function at(){Me=new Gg(F),Te=new Ug(F,Me,e),Me.init(Te),ge=new Ev(F,Me,Te),ve=new yv(F,Me,Te),Je=new Wg(F),Re=new hv,P=new kv(F,Me,ve,Re,Te,ge,Je),y=new Fg(_),$=new Bg(_),oe=new Jd(F,Te),Le=new Ng(F,Me,oe,Te),ie=new Hg(F,oe,Je,Le),se=new jg(F,ie,oe,Je),Be=new Yg(F,Te,P),De=new Ig(Re),_e=new cv(_,y,$,Me,Te,Le,De),ue=new Rv(_,Re),me=new fv,ye=new _v(Me,Te),Xe=new Lg(_,y,$,ve,se,f,l),ne=new Sv(_,se,Te),We=new Cv(F,Je,Te,ve),Ae=new Dg(F,Me,Je,Te),we=new Vg(F,Me,Je,Te),Je.programs=_e.programs,_.capabilities=Te,_.extensions=Me,_.properties=Re,_.renderLists=me,_.shadowMap=ne,_.state=ve,_.info=Je}at();const Ie=new Pv(_,F);this.xr=Ie,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){const A=Me.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=Me.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return Z},this.setPixelRatio=function(A){A!==void 0&&(Z=A,this.setSize(U,z,!1))},this.getSize=function(A){return A.set(U,z)},this.setSize=function(A,X,K=!0){if(Ie.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}U=A,z=X,t.width=Math.floor(A*Z),t.height=Math.floor(X*Z),K===!0&&(t.style.width=A+"px",t.style.height=X+"px"),this.setViewport(0,0,A,X)},this.getDrawingBufferSize=function(A){return A.set(U*Z,z*Z).floor()},this.setDrawingBufferSize=function(A,X,K){U=A,z=X,Z=K,t.width=Math.floor(A*K),t.height=Math.floor(X*K),this.setViewport(0,0,A,X)},this.getCurrentViewport=function(A){return A.copy(b)},this.getViewport=function(A){return A.copy(q)},this.setViewport=function(A,X,K,J){A.isVector4?q.set(A.x,A.y,A.z,A.w):q.set(A,X,K,J),ve.viewport(b.copy(q).multiplyScalar(Z).floor())},this.getScissor=function(A){return A.copy(W)},this.setScissor=function(A,X,K,J){A.isVector4?W.set(A.x,A.y,A.z,A.w):W.set(A,X,K,J),ve.scissor(D.copy(W).multiplyScalar(Z).floor())},this.getScissorTest=function(){return L},this.setScissorTest=function(A){ve.setScissorTest(L=A)},this.setOpaqueSort=function(A){G=A},this.setTransparentSort=function(A){O=A},this.getClearColor=function(A){return A.copy(Xe.getClearColor())},this.setClearColor=function(){Xe.setClearColor.apply(Xe,arguments)},this.getClearAlpha=function(){return Xe.getClearAlpha()},this.setClearAlpha=function(){Xe.setClearAlpha.apply(Xe,arguments)},this.clear=function(A=!0,X=!0,K=!0){let J=0;if(A){let j=!1;if(T!==null){const pe=T.texture.format;j=pe===ch||pe===lh||pe===sh}if(j){const pe=T.texture.type,xe=pe===In||pe===Ln||pe===dr||pe===ta||pe===ih||pe===oh,Se=Xe.getClearColor(),Ee=Xe.getClearAlpha(),Ue=Se.r,Pe=Se.g,Ce=Se.b;xe?(p[0]=Ue,p[1]=Pe,p[2]=Ce,p[3]=Ee,F.clearBufferuiv(F.COLOR,0,p)):(v[0]=Ue,v[1]=Pe,v[2]=Ce,v[3]=Ee,F.clearBufferiv(F.COLOR,0,v))}else J|=F.COLOR_BUFFER_BIT}X&&(J|=F.DEPTH_BUFFER_BIT),K&&(J|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),F.clear(J)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",re,!1),t.removeEventListener("webglcontextrestored",I,!1),t.removeEventListener("webglcontextcreationerror",ce,!1),me.dispose(),ye.dispose(),Re.dispose(),y.dispose(),$.dispose(),se.dispose(),Le.dispose(),We.dispose(),_e.dispose(),Ie.dispose(),Ie.removeEventListener("sessionstart",Tt),Ie.removeEventListener("sessionend",Ze),Q&&(Q.dispose(),Q=null),At.stop()};function re(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function I(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;const A=Je.autoReset,X=ne.enabled,K=ne.autoUpdate,J=ne.needsUpdate,j=ne.type;at(),Je.autoReset=A,ne.enabled=X,ne.autoUpdate=K,ne.needsUpdate=J,ne.type=j}function ce(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function he(A){const X=A.target;X.removeEventListener("dispose",he),ke(X)}function ke(A){be(A),Re.remove(A)}function be(A){const X=Re.get(A).programs;X!==void 0&&(X.forEach(function(K){_e.releaseProgram(K)}),A.isShaderMaterial&&_e.releaseShaderCache(A))}this.renderBufferDirect=function(A,X,K,J,j,pe){X===null&&(X=fe);const xe=j.isMesh&&j.matrixWorld.determinant()<0,Se=qh(A,X,K,J,j);ve.setMaterial(J,xe);let Ee=K.index,Ue=1;if(J.wireframe===!0){if(Ee=ie.getWireframeAttribute(K),Ee===void 0)return;Ue=2}const Pe=K.drawRange,Ce=K.attributes.position;let st=Pe.start*Ue,Ut=(Pe.start+Pe.count)*Ue;pe!==null&&(st=Math.max(st,pe.start*Ue),Ut=Math.min(Ut,(pe.start+pe.count)*Ue)),Ee!==null?(st=Math.max(st,0),Ut=Math.min(Ut,Ee.count)):Ce!=null&&(st=Math.max(st,0),Ut=Math.min(Ut,Ce.count));const pt=Ut-st;if(pt<0||pt===1/0)return;Le.setup(j,J,Se,K,Ee);let fn,nt=Ae;if(Ee!==null&&(fn=oe.get(Ee),nt=we,nt.setIndex(fn)),j.isMesh)J.wireframe===!0?(ve.setLineWidth(J.wireframeLinewidth*te()),nt.setMode(F.LINES)):nt.setMode(F.TRIANGLES);else if(j.isLine){let Fe=J.linewidth;Fe===void 0&&(Fe=1),ve.setLineWidth(Fe*te()),j.isLineSegments?nt.setMode(F.LINES):j.isLineLoop?nt.setMode(F.LINE_LOOP):nt.setMode(F.LINE_STRIP)}else j.isPoints?nt.setMode(F.POINTS):j.isSprite&&nt.setMode(F.TRIANGLES);if(j.isBatchedMesh)nt.renderMultiDraw(j._multiDrawStarts,j._multiDrawCounts,j._multiDrawCount);else if(j.isInstancedMesh)nt.renderInstances(st,pt,j.count);else if(K.isInstancedBufferGeometry){const Fe=K._maxInstanceCount!==void 0?K._maxInstanceCount:1/0,Bo=Math.min(K.instanceCount,Fe);nt.renderInstances(st,pt,Bo)}else nt.render(st,pt)};function $e(A,X,K){A.transparent===!0&&A.side===xn&&A.forceSinglePass===!1?(A.side=Dt,A.needsUpdate=!0,Ci(A,X,K),A.side=On,A.needsUpdate=!0,Ci(A,X,K),A.side=xn):Ci(A,X,K)}this.compile=function(A,X,K=null){K===null&&(K=A),m=ye.get(K),m.init(),x.push(m),K.traverseVisible(function(j){j.isLight&&j.layers.test(X.layers)&&(m.pushLight(j),j.castShadow&&m.pushShadow(j))}),A!==K&&A.traverseVisible(function(j){j.isLight&&j.layers.test(X.layers)&&(m.pushLight(j),j.castShadow&&m.pushShadow(j))}),m.setupLights(_._useLegacyLights);const J=new Set;return A.traverse(function(j){const pe=j.material;if(pe)if(Array.isArray(pe))for(let xe=0;xe<pe.length;xe++){const Se=pe[xe];$e(Se,K,j),J.add(Se)}else $e(pe,K,j),J.add(pe)}),x.pop(),m=null,J},this.compileAsync=function(A,X,K=null){const J=this.compile(A,X,K);return new Promise(j=>{function pe(){if(J.forEach(function(xe){Re.get(xe).currentProgram.isReady()&&J.delete(xe)}),J.size===0){j(A);return}setTimeout(pe,10)}Me.get("KHR_parallel_shader_compile")!==null?pe():setTimeout(pe,10)})};let Ke=null;function dt(A){Ke&&Ke(A)}function Tt(){At.stop()}function Ze(){At.start()}const At=new kh;At.setAnimationLoop(dt),typeof self<"u"&&At.setContext(self),this.setAnimationLoop=function(A){Ke=A,Ie.setAnimationLoop(A),A===null?At.stop():At.start()},Ie.addEventListener("sessionstart",Tt),Ie.addEventListener("sessionend",Ze),this.render=function(A,X){if(X!==void 0&&X.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),X.parent===null&&X.matrixWorldAutoUpdate===!0&&X.updateMatrixWorld(),Ie.enabled===!0&&Ie.isPresenting===!0&&(Ie.cameraAutoUpdate===!0&&Ie.updateCamera(X),X=Ie.getCamera()),A.isScene===!0&&A.onBeforeRender(_,A,X,T),m=ye.get(A,x.length),m.init(),x.push(m),ee.multiplyMatrices(X.projectionMatrix,X.matrixWorldInverse),C.setFromProjectionMatrix(ee),H=this.localClippingEnabled,B=De.init(this.clippingPlanes,H),g=me.get(A,d.length),g.init(),d.push(g),an(A,X,0,_.sortObjects),g.finish(),_.sortObjects===!0&&g.sort(G,O),this.info.render.frame++,B===!0&&De.beginShadows();const K=m.state.shadowsArray;if(ne.render(K,A,X),B===!0&&De.endShadows(),this.info.autoReset===!0&&this.info.reset(),Xe.render(g,A),m.setupLights(_._useLegacyLights),X.isArrayCamera){const J=X.cameras;for(let j=0,pe=J.length;j<pe;j++){const xe=J[j];br(g,A,xe,xe.viewport)}}else br(g,A,X);T!==null&&(P.updateMultisampleRenderTarget(T),P.updateRenderTargetMipmap(T)),A.isScene===!0&&A.onAfterRender(_,A,X),Le.resetDefaultState(),S=-1,M=null,x.pop(),x.length>0?m=x[x.length-1]:m=null,d.pop(),d.length>0?g=d[d.length-1]:g=null};function an(A,X,K,J){if(A.visible===!1)return;if(A.layers.test(X.layers)){if(A.isGroup)K=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(X);else if(A.isLight)m.pushLight(A),A.castShadow&&m.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||C.intersectsSprite(A)){J&&de.setFromMatrixPosition(A.matrixWorld).applyMatrix4(ee);const xe=se.update(A),Se=A.material;Se.visible&&g.push(A,xe,Se,K,de.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||C.intersectsObject(A))){const xe=se.update(A),Se=A.material;if(J&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),de.copy(A.boundingSphere.center)):(xe.boundingSphere===null&&xe.computeBoundingSphere(),de.copy(xe.boundingSphere.center)),de.applyMatrix4(A.matrixWorld).applyMatrix4(ee)),Array.isArray(Se)){const Ee=xe.groups;for(let Ue=0,Pe=Ee.length;Ue<Pe;Ue++){const Ce=Ee[Ue],st=Se[Ce.materialIndex];st&&st.visible&&g.push(A,xe,st,K,de.z,Ce)}}else Se.visible&&g.push(A,xe,Se,K,de.z,null)}}const pe=A.children;for(let xe=0,Se=pe.length;xe<Se;xe++)an(pe[xe],X,K,J)}function br(A,X,K,J){const j=A.opaque,pe=A.transmissive,xe=A.transparent;m.setupLightsView(K),B===!0&&De.setGlobalState(_.clippingPlanes,K),pe.length>0&&Wh(j,pe,X,K),J&&ve.viewport(b.copy(J)),j.length>0&&Ri(j,X,K),pe.length>0&&Ri(pe,X,K),xe.length>0&&Ri(xe,X,K),ve.buffers.depth.setTest(!0),ve.buffers.depth.setMask(!0),ve.buffers.color.setMask(!0),ve.setPolygonOffset(!1)}function Wh(A,X,K,J){if((K.isScene===!0?K.overrideMaterial:null)!==null)return;const pe=Te.isWebGL2;Q===null&&(Q=new sa(1,1,{generateMipmaps:!0,type:Me.has("EXT_color_buffer_half_float")?Si:In,minFilter:Wa,samples:pe?4:0})),_.getDrawingBufferSize(ae),pe?Q.setSize(ae.x,ae.y):Q.setSize(To(ae.x),To(ae.y));const xe=_.getRenderTarget();_.setRenderTarget(Q),_.getClearColor(V),R=_.getClearAlpha(),R<1&&_.setClearColor(16777215,.5),_.clear();const Se=_.toneMapping;_.toneMapping=Un,Ri(A,K,J),P.updateMultisampleRenderTarget(Q),P.updateRenderTargetMipmap(Q);let Ee=!1;for(let Ue=0,Pe=X.length;Ue<Pe;Ue++){const Ce=X[Ue],st=Ce.object,Ut=Ce.geometry,pt=Ce.material,fn=Ce.group;if(pt.side===xn&&st.layers.test(J.layers)){const nt=pt.side;pt.side=Dt,pt.needsUpdate=!0,Sr(st,K,J,Ut,pt,fn),pt.side=nt,pt.needsUpdate=!0,Ee=!0}}Ee===!0&&(P.updateMultisampleRenderTarget(Q),P.updateRenderTargetMipmap(Q)),_.setRenderTarget(xe),_.setClearColor(V,R),_.toneMapping=Se}function Ri(A,X,K){const J=X.isScene===!0?X.overrideMaterial:null;for(let j=0,pe=A.length;j<pe;j++){const xe=A[j],Se=xe.object,Ee=xe.geometry,Ue=J===null?xe.material:J,Pe=xe.group;Se.layers.test(K.layers)&&Sr(Se,X,K,Ee,Ue,Pe)}}function Sr(A,X,K,J,j,pe){A.onBeforeRender(_,X,K,J,j,pe),A.modelViewMatrix.multiplyMatrices(K.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),j.onBeforeRender(_,X,K,J,A,pe),j.transparent===!0&&j.side===xn&&j.forceSinglePass===!1?(j.side=Dt,j.needsUpdate=!0,_.renderBufferDirect(K,X,J,j,A,pe),j.side=On,j.needsUpdate=!0,_.renderBufferDirect(K,X,J,j,A,pe),j.side=xn):_.renderBufferDirect(K,X,J,j,A,pe),A.onAfterRender(_,X,K,J,j,pe)}function Ci(A,X,K){X.isScene!==!0&&(X=fe);const J=Re.get(A),j=m.state.lights,pe=m.state.shadowsArray,xe=j.state.version,Se=_e.getParameters(A,j.state,pe,X,K),Ee=_e.getProgramCacheKey(Se);let Ue=J.programs;J.environment=A.isMeshStandardMaterial?X.environment:null,J.fog=X.fog,J.envMap=(A.isMeshStandardMaterial?$:y).get(A.envMap||J.environment),Ue===void 0&&(A.addEventListener("dispose",he),Ue=new Map,J.programs=Ue);let Pe=Ue.get(Ee);if(Pe!==void 0){if(J.currentProgram===Pe&&J.lightsStateVersion===xe)return kr(A,Se),Pe}else Se.uniforms=_e.getUniforms(A),A.onBuild(K,Se,_),A.onBeforeCompile(Se,_),Pe=_e.acquireProgram(Se,Ee),Ue.set(Ee,Pe),J.uniforms=Se.uniforms;const Ce=J.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Ce.clippingPlanes=De.uniform),kr(A,Se),J.needsLights=Yh(A),J.lightsStateVersion=xe,J.needsLights&&(Ce.ambientLightColor.value=j.state.ambient,Ce.lightProbe.value=j.state.probe,Ce.directionalLights.value=j.state.directional,Ce.directionalLightShadows.value=j.state.directionalShadow,Ce.spotLights.value=j.state.spot,Ce.spotLightShadows.value=j.state.spotShadow,Ce.rectAreaLights.value=j.state.rectArea,Ce.ltc_1.value=j.state.rectAreaLTC1,Ce.ltc_2.value=j.state.rectAreaLTC2,Ce.pointLights.value=j.state.point,Ce.pointLightShadows.value=j.state.pointShadow,Ce.hemisphereLights.value=j.state.hemi,Ce.directionalShadowMap.value=j.state.directionalShadowMap,Ce.directionalShadowMatrix.value=j.state.directionalShadowMatrix,Ce.spotShadowMap.value=j.state.spotShadowMap,Ce.spotLightMatrix.value=j.state.spotLightMatrix,Ce.spotLightMap.value=j.state.spotLightMap,Ce.pointShadowMap.value=j.state.pointShadowMap,Ce.pointShadowMatrix.value=j.state.pointShadowMatrix),J.currentProgram=Pe,J.uniformsList=null,Pe}function yr(A){if(A.uniformsList===null){const X=A.currentProgram.getUniforms();A.uniformsList=mo.seqWithValue(X.seq,A.uniforms)}return A.uniformsList}function kr(A,X){const K=Re.get(A);K.outputColorSpace=X.outputColorSpace,K.batching=X.batching,K.instancing=X.instancing,K.instancingColor=X.instancingColor,K.skinning=X.skinning,K.morphTargets=X.morphTargets,K.morphNormals=X.morphNormals,K.morphColors=X.morphColors,K.morphTargetsCount=X.morphTargetsCount,K.numClippingPlanes=X.numClippingPlanes,K.numIntersection=X.numClipIntersection,K.vertexAlphas=X.vertexAlphas,K.vertexTangents=X.vertexTangents,K.toneMapping=X.toneMapping}function qh(A,X,K,J,j){X.isScene!==!0&&(X=fe),P.resetTextureUnits();const pe=X.fog,xe=J.isMeshStandardMaterial?X.environment:null,Se=T===null?_.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:bn,Ee=(J.isMeshStandardMaterial?$:y).get(J.envMap||xe),Ue=J.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,Pe=!!K.attributes.tangent&&(!!J.normalMap||J.anisotropy>0),Ce=!!K.morphAttributes.position,st=!!K.morphAttributes.normal,Ut=!!K.morphAttributes.color;let pt=Un;J.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(pt=_.toneMapping);const fn=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,nt=fn!==void 0?fn.length:0,Fe=Re.get(J),Bo=m.state.lights;if(B===!0&&(H===!0||A!==M)){const Bt=A===M&&J.id===S;De.setState(J,A,Bt)}let it=!1;J.version===Fe.__version?(Fe.needsLights&&Fe.lightsStateVersion!==Bo.state.version||Fe.outputColorSpace!==Se||j.isBatchedMesh&&Fe.batching===!1||!j.isBatchedMesh&&Fe.batching===!0||j.isInstancedMesh&&Fe.instancing===!1||!j.isInstancedMesh&&Fe.instancing===!0||j.isSkinnedMesh&&Fe.skinning===!1||!j.isSkinnedMesh&&Fe.skinning===!0||j.isInstancedMesh&&Fe.instancingColor===!0&&j.instanceColor===null||j.isInstancedMesh&&Fe.instancingColor===!1&&j.instanceColor!==null||Fe.envMap!==Ee||J.fog===!0&&Fe.fog!==pe||Fe.numClippingPlanes!==void 0&&(Fe.numClippingPlanes!==De.numPlanes||Fe.numIntersection!==De.numIntersection)||Fe.vertexAlphas!==Ue||Fe.vertexTangents!==Pe||Fe.morphTargets!==Ce||Fe.morphNormals!==st||Fe.morphColors!==Ut||Fe.toneMapping!==pt||Te.isWebGL2===!0&&Fe.morphTargetsCount!==nt)&&(it=!0):(it=!0,Fe.__version=J.version);let Gn=Fe.currentProgram;it===!0&&(Gn=Ci(J,X,j));let Er=!1,ei=!1,Go=!1;const St=Gn.getUniforms(),Hn=Fe.uniforms;if(ve.useProgram(Gn.program)&&(Er=!0,ei=!0,Go=!0),J.id!==S&&(S=J.id,ei=!0),Er||M!==A){St.setValue(F,"projectionMatrix",A.projectionMatrix),St.setValue(F,"viewMatrix",A.matrixWorldInverse);const Bt=St.map.cameraPosition;Bt!==void 0&&Bt.setValue(F,de.setFromMatrixPosition(A.matrixWorld)),Te.logarithmicDepthBuffer&&St.setValue(F,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(J.isMeshPhongMaterial||J.isMeshToonMaterial||J.isMeshLambertMaterial||J.isMeshBasicMaterial||J.isMeshStandardMaterial||J.isShaderMaterial)&&St.setValue(F,"isOrthographic",A.isOrthographicCamera===!0),M!==A&&(M=A,ei=!0,Go=!0)}if(j.isSkinnedMesh){St.setOptional(F,j,"bindMatrix"),St.setOptional(F,j,"bindMatrixInverse");const Bt=j.skeleton;Bt&&(Te.floatVertexTextures?(Bt.boneTexture===null&&Bt.computeBoneTexture(),St.setValue(F,"boneTexture",Bt.boneTexture,P)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}j.isBatchedMesh&&(St.setOptional(F,j,"batchingTexture"),St.setValue(F,"batchingTexture",j._matricesTexture,P));const Ho=K.morphAttributes;if((Ho.position!==void 0||Ho.normal!==void 0||Ho.color!==void 0&&Te.isWebGL2===!0)&&Be.update(j,K,Gn),(ei||Fe.receiveShadow!==j.receiveShadow)&&(Fe.receiveShadow=j.receiveShadow,St.setValue(F,"receiveShadow",j.receiveShadow)),J.isMeshGouraudMaterial&&J.envMap!==null&&(Hn.envMap.value=Ee,Hn.flipEnvMap.value=Ee.isCubeTexture&&Ee.isRenderTargetTexture===!1?-1:1),ei&&(St.setValue(F,"toneMappingExposure",_.toneMappingExposure),Fe.needsLights&&Xh(Hn,Go),pe&&J.fog===!0&&ue.refreshFogUniforms(Hn,pe),ue.refreshMaterialUniforms(Hn,J,Z,z,Q),mo.upload(F,yr(Fe),Hn,P)),J.isShaderMaterial&&J.uniformsNeedUpdate===!0&&(mo.upload(F,yr(Fe),Hn,P),J.uniformsNeedUpdate=!1),J.isSpriteMaterial&&St.setValue(F,"center",j.center),St.setValue(F,"modelViewMatrix",j.modelViewMatrix),St.setValue(F,"normalMatrix",j.normalMatrix),St.setValue(F,"modelMatrix",j.matrixWorld),J.isShaderMaterial||J.isRawShaderMaterial){const Bt=J.uniformsGroups;for(let Vo=0,jh=Bt.length;Vo<jh;Vo++)if(Te.isWebGL2){const Tr=Bt[Vo];We.update(Tr,Gn),We.bind(Tr,Gn)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return Gn}function Xh(A,X){A.ambientLightColor.needsUpdate=X,A.lightProbe.needsUpdate=X,A.directionalLights.needsUpdate=X,A.directionalLightShadows.needsUpdate=X,A.pointLights.needsUpdate=X,A.pointLightShadows.needsUpdate=X,A.spotLights.needsUpdate=X,A.spotLightShadows.needsUpdate=X,A.rectAreaLights.needsUpdate=X,A.hemisphereLights.needsUpdate=X}function Yh(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return E},this.getActiveMipmapLevel=function(){return k},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(A,X,K){Re.get(A.texture).__webglTexture=X,Re.get(A.depthTexture).__webglTexture=K;const J=Re.get(A);J.__hasExternalTextures=!0,J.__hasExternalTextures&&(J.__autoAllocateDepthBuffer=K===void 0,J.__autoAllocateDepthBuffer||Me.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),J.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(A,X){const K=Re.get(A);K.__webglFramebuffer=X,K.__useDefaultFramebuffer=X===void 0},this.setRenderTarget=function(A,X=0,K=0){T=A,E=X,k=K;let J=!0,j=null,pe=!1,xe=!1;if(A){const Ee=Re.get(A);Ee.__useDefaultFramebuffer!==void 0?(ve.bindFramebuffer(F.FRAMEBUFFER,null),J=!1):Ee.__webglFramebuffer===void 0?P.setupRenderTarget(A):Ee.__hasExternalTextures&&P.rebindTextures(A,Re.get(A.texture).__webglTexture,Re.get(A.depthTexture).__webglTexture);const Ue=A.texture;(Ue.isData3DTexture||Ue.isDataArrayTexture||Ue.isCompressedArrayTexture)&&(xe=!0);const Pe=Re.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(Pe[X])?j=Pe[X][K]:j=Pe[X],pe=!0):Te.isWebGL2&&A.samples>0&&P.useMultisampledRTT(A)===!1?j=Re.get(A).__webglMultisampledFramebuffer:Array.isArray(Pe)?j=Pe[K]:j=Pe,b.copy(A.viewport),D.copy(A.scissor),N=A.scissorTest}else b.copy(q).multiplyScalar(Z).floor(),D.copy(W).multiplyScalar(Z).floor(),N=L;if(ve.bindFramebuffer(F.FRAMEBUFFER,j)&&Te.drawBuffers&&J&&ve.drawBuffers(A,j),ve.viewport(b),ve.scissor(D),ve.setScissorTest(N),pe){const Ee=Re.get(A.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+X,Ee.__webglTexture,K)}else if(xe){const Ee=Re.get(A.texture),Ue=X||0;F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,Ee.__webglTexture,K||0,Ue)}S=-1},this.readRenderTargetPixels=function(A,X,K,J,j,pe,xe){if(!(A&&A.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Se=Re.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&xe!==void 0&&(Se=Se[xe]),Se){ve.bindFramebuffer(F.FRAMEBUFFER,Se);try{const Ee=A.texture,Ue=Ee.format,Pe=Ee.type;if(Ue!==Qt&&ge.convert(Ue)!==F.getParameter(F.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Ce=Pe===Si&&(Me.has("EXT_color_buffer_half_float")||Te.isWebGL2&&Me.has("EXT_color_buffer_float"));if(Pe!==In&&ge.convert(Pe)!==F.getParameter(F.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Pe===Nn&&(Te.isWebGL2||Me.has("OES_texture_float")||Me.has("WEBGL_color_buffer_float")))&&!Ce){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}X>=0&&X<=A.width-J&&K>=0&&K<=A.height-j&&F.readPixels(X,K,J,j,ge.convert(Ue),ge.convert(Pe),pe)}finally{const Ee=T!==null?Re.get(T).__webglFramebuffer:null;ve.bindFramebuffer(F.FRAMEBUFFER,Ee)}}},this.copyFramebufferToTexture=function(A,X,K=0){const J=Math.pow(2,-K),j=Math.floor(X.image.width*J),pe=Math.floor(X.image.height*J);P.setTexture2D(X,0),F.copyTexSubImage2D(F.TEXTURE_2D,K,0,0,A.x,A.y,j,pe),ve.unbindTexture()},this.copyTextureToTexture=function(A,X,K,J=0){const j=X.image.width,pe=X.image.height,xe=ge.convert(K.format),Se=ge.convert(K.type);P.setTexture2D(K,0),F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,K.flipY),F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,K.premultiplyAlpha),F.pixelStorei(F.UNPACK_ALIGNMENT,K.unpackAlignment),X.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,J,A.x,A.y,j,pe,xe,Se,X.image.data):X.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,J,A.x,A.y,X.mipmaps[0].width,X.mipmaps[0].height,xe,X.mipmaps[0].data):F.texSubImage2D(F.TEXTURE_2D,J,A.x,A.y,xe,Se,X.image),J===0&&K.generateMipmaps&&F.generateMipmap(F.TEXTURE_2D),ve.unbindTexture()},this.copyTextureToTexture3D=function(A,X,K,J,j=0){if(_.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const pe=A.max.x-A.min.x+1,xe=A.max.y-A.min.y+1,Se=A.max.z-A.min.z+1,Ee=ge.convert(J.format),Ue=ge.convert(J.type);let Pe;if(J.isData3DTexture)P.setTexture3D(J,0),Pe=F.TEXTURE_3D;else if(J.isDataArrayTexture||J.isCompressedArrayTexture)P.setTexture2DArray(J,0),Pe=F.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,J.flipY),F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,J.premultiplyAlpha),F.pixelStorei(F.UNPACK_ALIGNMENT,J.unpackAlignment);const Ce=F.getParameter(F.UNPACK_ROW_LENGTH),st=F.getParameter(F.UNPACK_IMAGE_HEIGHT),Ut=F.getParameter(F.UNPACK_SKIP_PIXELS),pt=F.getParameter(F.UNPACK_SKIP_ROWS),fn=F.getParameter(F.UNPACK_SKIP_IMAGES),nt=K.isCompressedTexture?K.mipmaps[j]:K.image;F.pixelStorei(F.UNPACK_ROW_LENGTH,nt.width),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,nt.height),F.pixelStorei(F.UNPACK_SKIP_PIXELS,A.min.x),F.pixelStorei(F.UNPACK_SKIP_ROWS,A.min.y),F.pixelStorei(F.UNPACK_SKIP_IMAGES,A.min.z),K.isDataTexture||K.isData3DTexture?F.texSubImage3D(Pe,j,X.x,X.y,X.z,pe,xe,Se,Ee,Ue,nt.data):K.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),F.compressedTexSubImage3D(Pe,j,X.x,X.y,X.z,pe,xe,Se,Ee,nt.data)):F.texSubImage3D(Pe,j,X.x,X.y,X.z,pe,xe,Se,Ee,Ue,nt),F.pixelStorei(F.UNPACK_ROW_LENGTH,Ce),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,st),F.pixelStorei(F.UNPACK_SKIP_PIXELS,Ut),F.pixelStorei(F.UNPACK_SKIP_ROWS,pt),F.pixelStorei(F.UNPACK_SKIP_IMAGES,fn),j===0&&J.generateMipmaps&&F.generateMipmap(Pe),ve.unbindTexture()},this.initTexture=function(A){A.isCubeTexture?P.setTextureCube(A,0):A.isData3DTexture?P.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?P.setTexture2DArray(A,0):P.setTexture2D(A,0),ve.unbindTexture()},this.resetState=function(){E=0,k=0,T=null,ve.reset(),Le.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Mn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===pr?"display-p3":"srgb",t.unpackColorSpace=Ye.workingColorSpace===Fo?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===vt?aa:uh}set outputEncoding(e){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=e===aa?vt:bn}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(e){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=e}}class Lv extends Lh{}Lv.prototype.isWebGL1Renderer=!0;class Nv extends bt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t}}class Dv extends Lt{constructor(e=null,t=1,n=1,i,o,s,r,l,c=wt,h=wt,u,f){super(null,s,r,l,c,h,i,o,u,f),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Uv extends Lt{constructor(e,t,n,i,o,s,r,l,c){super(e,t,n,i,o,s,r,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Iv extends Za{constructor(e){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new Oe(0),this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.fog=e.fog,this}}class Fv extends Za{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Oe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Oe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=fh,this.normalScale=new He(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Nh extends bt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Oe(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}}class zv extends Nh{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(bt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Oe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Rs=new ht,hc=new Y,uc=new Y;class Ov{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new He(512,512),this.map=null,this.mapPass=null,this.matrix=new ht,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new xr,this._frameExtents=new He(1,1),this._viewportCount=1,this._viewports=[new ct(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;hc.setFromMatrixPosition(e.matrixWorld),t.position.copy(hc),uc.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(uc),t.updateMatrixWorld(),Rs.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Rs),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Rs)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class Bv extends Ov{constructor(){super(new Mr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Gv extends Nh{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(bt.DEFAULT_UP),this.updateMatrix(),this.target=new bt,this.shadow=new Bv}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Hv{constructor(e,t,n=0,i=1/0){this.ray=new _h(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new vr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}intersectObject(e,t=!0,n=[]){return er(e,this,n,t),n.sort(fc),n}intersectObjects(e,t=!0,n=[]){for(let i=0,o=e.length;i<o;i++)er(e[i],this,n,t);return n.sort(fc),n}}function fc(a,e){return a.distance-e.distance}function er(a,e,t,n){if(a.layers.test(e.layers)&&a.raycast(e,t),n===!0){const i=a.children;for(let o=0,s=i.length;o<s;o++)er(i[o],e,t,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:fr}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=fr);function Vv(a,e=1e-4){e=Math.max(e,Number.EPSILON);const t={},n=a.getIndex(),i=a.getAttribute("position"),o=n?n.count:i.count;let s=0;const r=Object.keys(a.attributes),l={},c={},h=[],u=["getX","getY","getZ","getW"],f=["setX","setY","setZ","setW"];for(let x=0,_=r.length;x<_;x++){const w=r[x],E=a.attributes[w];l[w]=new Nt(new E.array.constructor(E.count*E.itemSize),E.itemSize,E.normalized);const k=a.morphAttributes[w];k&&(c[w]=new Nt(new k.array.constructor(k.count*k.itemSize),k.itemSize,k.normalized))}const p=e*.5,v=Math.log10(1/e),g=Math.pow(10,v),m=p*g;for(let x=0;x<o;x++){const _=n?n.getX(x):x;let w="";for(let E=0,k=r.length;E<k;E++){const T=r[E],S=a.getAttribute(T),M=S.itemSize;for(let b=0;b<M;b++)w+=`${~~(S[u[b]](_)*g+m)},`}if(w in t)h.push(t[w]);else{for(let E=0,k=r.length;E<k;E++){const T=r[E],S=a.getAttribute(T),M=a.morphAttributes[T],b=S.itemSize,D=l[T],N=c[T];for(let V=0;V<b;V++){const R=u[V],U=f[V];if(D[U](s,S[R](_)),M)for(let z=0,Z=M.length;z<Z;z++)N[z][U](s,M[z][R](_))}}t[w]=s,h.push(s),s++}}const d=a.clone();for(const x in a.attributes){const _=l[x];if(d.setAttribute(x,new Nt(_.array.slice(0,s*_.itemSize),_.itemSize,_.normalized)),x in c)for(let w=0;w<c[x].length;w++){const E=c[x][w];d.morphAttributes[x][w]=new Nt(E.array.slice(0,s*E.itemSize),E.itemSize,E.normalized)}}return d.setIndex(h),d}const je=a=>a<0?0:a>1?1:a,ot=a=>a*a*(3-2*a),oa=a=>a<.5?4*a*a*a:1-Math.pow(-2*a+2,3)/2,si=a=>1-Math.pow(1-a,3),go="#e8dcc3",Dh="#efe6d3",Mt="#2a211b",Ve="#5a4c40",Qe="#8d7d6c",Ea="#9c3f24",Wv="#33302c",qv="#b3aca1",Xv="#4a3a2c",vo="'PT Alegreya'",gt=(a,{weight:e=400,italic:t=!1}={})=>`${t?"italic ":""}${e} ${a}px ${vo}, serif`,oo=new Y(1,0,0),Uh=new Y(0,1,0),_o=.09,Yv=.06,Ih=6,Cs=.22,_n=384,Pn=256,dc=0,jv=1,$v=3;class Kv{constructor(e){const t=new Lh({canvas:e,antialias:!0,alpha:!0,premultipliedAlpha:!0});t.setClearColor(0,0),t.outputColorSpace=vt,t.shadowMap.enabled=!0,t.shadowMap.type=on,this.renderer=t;const n=new Nv;this.scene=n,this.camera=new Mr(-1,1,1,-1,.1,400),n.add(new zv(15985629,15127987,1.2));const i=new Gv(16772827,3.8);i.castShadow=!0,i.shadow.mapSize.set(1024,1024),i.shadow.radius=3,i.shadow.blurSamples=12,i.shadow.bias=-6e-4,i.shadow.camera.near=1,i.shadow.camera.far=120,n.add(i,i.target),this.sun=i,this.sunDir=Zv(42,12);const o=new nn(new ki(400,400),new Iv({color:new Oe(Xv),opacity:.2}));o.rotation.x=-Math.PI/2,o.receiveShadow=!0,n.add(o);const s=Qv();this.slabs=Array.from({length:Ih},(r,l)=>e_(s,Uo(24301+l*977))),s.dispose(),this.blobGeo=new ki(un+1.1,2.1),this.blobTex=f_(),this.glyphs=new d_,this.blocks=new Map,this.raycaster=new Hv,this.v=new Y,this.w=1,this.h=1}setSize(e,t,n){this.w=e,this.h=t,this.renderer.setPixelRatio(n),this.renderer.setSize(e,t,!1)}setView({tx:e,tz:t,yaw:n,pitch:i,ppu:o}){const s=this.camera,r=this.w/2/o,l=this.h/2/o;s.left=-r,s.right=r,s.top=l,s.bottom=-l,s.updateProjectionMatrix();const c=80;s.position.set(e+c*Math.sin(n)*Math.cos(i),c*Math.sin(i),t+c*Math.cos(n)*Math.cos(i)),s.up.copy(Uh),s.lookAt(e,0,t),s.updateMatrixWorld();const h=this.sun;h.target.position.set(e,0,t),h.position.copy(this.sunDir).multiplyScalar(40).add(h.target.position);const u=Math.max(r,l/Math.sin(i))+3,f=h.shadow.camera;f.left=-u,f.right=u,f.top=u,f.bottom=-u,f.updateProjectionMatrix()}project(e,t,n){const i=this.v.set(e,t,n).project(this.camera);return[(i.x+1)/2*this.w,(1-i.y)/2*this.h]}floorAffine(){const[e,t]=this.project(0,0,0),[n,i]=this.project(1,0,0),[o,s]=this.project(0,0,1);return[n-e,i-t,o-e,s-t,e,t]}addTile(e){const t=new Jv(this,e);return this.blocks.set(e.id,t),t}block(e){return this.blocks.get(e.id)}pick(e,t){const n=new He(e/this.w*2-1,-(t/this.h)*2+1);this.raycaster.setFromCamera(n,this.camera);const i=this.raycaster.intersectObjects([...this.blocks.values()].map(o=>o.stone),!1);return i.length?i[0].object.userData.tile:null}update(e){for(const t of this.blocks.values())t.update(e)}render(){this.renderer.render(this.scene,this.camera)}}function Zv(a,e){const t=Ra.degToRad(a),n=Ra.degToRad(e);return new Y(-Math.cos(t)*Math.cos(n),Math.sin(t),-Math.cos(t)*Math.sin(n))}class Jv{constructor(e,t){this.s=e,this.tile=t;const n=Uo(2654435761^t.id*2654435761),i=new fi;i.position.set(t.x,.5,t.z),this.u=n_(e,n);const o=new nn(e.slabs[Math.floor(n()*Ih)],l_(this.u));this.rolls=Math.floor(n()*4),o.quaternion.setFromAxisAngle(oo,this.rolls*Math.PI/2),o.castShadow=!0,o.receiveShadow=!0,o.userData.tile=t,i.add(o),e.scene.add(i),this.group=i,this.stone=o;const s=new nn(e.blobGeo,new _r({color:2826005,alphaMap:e.blobTex,transparent:!0,opacity:.55,depthWrite:!1}));s.rotation.x=-Math.PI/2,s.position.set(t.x,.002,t.z),s.renderOrder=-1,e.scene.add(s),this.blob=s,this.faces=[null,null,null,null],this.waiting=new Set,this.peck(this.face(dc),t.stone,1),this.roll=null,this.drop=null,this.tip=null}face(e){return(e-this.rolls+4)%4}peck(e,t,n){this.free(e);const i=Da(t);this.faces[e]=i,this.u.uLift.value.setComponent(e,n),this.u.uCut.value.setComponent(e,1),this.waiting.add(e),this.s.glyphs.acquire(i,o=>{this.faces[e]===i&&(this.u.uGlyph.value[e]=o,this.waiting.delete(e))})}free(e){const t=this.faces[e];t&&(this.s.glyphs.release(t),this.faces[e]=null,this.waiting.delete(e),this.u.uGlyph.value[e]=this.s.glyphs.blank,this.u.uLift.value.setComponent(e,0),this.u.uCut.value.setComponent(e,0))}dropIn(e,t=.7){this.drop={t0:e,dur:t,spin:(Math.random()-.5)*.9},this.group.position.y=99}turn(e,t,n=.86){this.roll&&this.finishRoll();const i={top:this.face(dc),front:this.face(jv),back:this.face($v)};return this.peck(i.back,e,1),this.tip=null,this.roll={t0:t,dur:n,faces:i,hop:.22+Math.random()*.12},t+n}nudge(e,t=.5){!this.roll&&!this.drop&&(this.tip={t0:e,dur:t})}landsAt(){return this.roll?this.roll.t0+this.roll.dur:0}hurry(e){if(!this.waiting.size||this.drop&&e<this.drop.t0)return;const t=this.roll,n=t&&e<t.t0+.2*t.dur?t.faces.back:-1;for(const i of this.waiting)i!==n&&this.s.glyphs.hurry(this.faces[i])}finishRoll(){const{faces:e}=this.roll;this.free(e.front),this.u.uLift.value.setComponent(e.top,Cs),this.rolls=(this.rolls+1)%4,this.stone.quaternion.setFromAxisAngle(oo,this.rolls*Math.PI/2),this.group.quaternion.identity(),this.group.position.y=.5,this.roll=null}update(e){this.hurry(e);const t=this.group;let n=0;if(this.drop){const s=je((e-this.drop.t0)/this.drop.dur);if(t.visible=e>=this.drop.t0,e<this.drop.t0)n=30;else if(s<.62){const r=s/.62;n=3.2*(1-r*r)}else{const r=(s-.62)/.38;n=.16*Math.sin(Math.PI*r)*(1-r*.4)}t.quaternion.setFromAxisAngle(Uh,this.drop.spin*(1-ot(s))),t.position.y=.5+n,s>=1&&(this.drop=null,t.quaternion.identity(),t.position.y=.5)}else if(this.roll){const s=this.roll,r=je((e-s.t0)/s.dur),c=(r<.8?1.04*oa(r/.8):1.04-.04*ot((r-.8)/.2))*(Math.PI/2);if(t.quaternion.setFromAxisAngle(oo,c),n=.5*(Math.abs(Math.cos(c))+Math.abs(Math.sin(c)))-.5+s.hop*Math.sin(Math.PI*Math.min(1,r/.85)),t.position.y=.5+n,this.u.uLift.value.setComponent(s.faces.top,1-(1-Cs)*ot(je((r-.15)/.7))),this.faces[s.faces.front]){const h=1-ot(je(r/.5));this.u.uLift.value.setComponent(s.faces.front,Cs*h),this.u.uCut.value.setComponent(s.faces.front,h)}r>=1&&this.finishRoll()}else if(this.tip){const s=je((e-this.tip.t0)/this.tip.dur),r=s<.6?.18*Math.sin(Math.PI*(s/.6)):-.035*Math.sin(Math.PI*((s-.6)/.4));t.quaternion.setFromAxisAngle(oo,r),n=.5*(Math.abs(Math.cos(r))+Math.abs(Math.sin(r)))-.5,t.position.y=.5+n,s>=1&&(this.tip=null,t.quaternion.identity(),t.position.y=.5)}const i=this.blob,o=Math.min(1,n/1.4);i.material.opacity=.55*(1-o)*(1-o),i.scale.setScalar(1+o*.7)}}const za=[un/2,.5,.5];function Qv(){const t=[8,5,5].map(s=>s+2*3),n=new Ja(1,1,1,...t);n.deleteAttribute("normal"),n.deleteAttribute("uv");const i=n.attributes.position;for(let s=0;s<i.count;s++){const r=[i.getX(s),i.getY(s),i.getZ(s)].map((l,c)=>{const h=Math.round((l+.5)*t[c]),u=za[c]-_o;return h<=3?-za[c]+h/3*_o:h>=t[c]-3?za[c]-(t[c]-h)/3*_o:-u+(h-3)/(t[c]-6)*2*u});i.setXYZ(s,...r)}const o=Vv(n,1e-6);return n.dispose(),o}function e_(a,e){const t=a.clone(),n=t_(e),i=[e()*50,e()*50,e()*50],o=new Y(e()-.5,e()-.5,e()-.5).multiplyScalar(.02),s=t.attributes.position,r=new Y,l=new Y,c=new Y;for(let h=0;h<s.count;h++){r.fromBufferAttribute(s,h);const u=[r.x*2.1+i[0],r.y*2.1+i[1],r.z*2.1+i[2]],f=.03+(_o-.03)*Ra.smoothstep(n(u[0]*.9,u[1]*.9,u[2]*.9),.3,.8);l.set(Ra.clamp(r.x,-.75+f,za[0]-f),Ra.clamp(r.y,-.5+f,za[1]-f),Ra.clamp(r.z,-.5+f,za[2]-f)),c.subVectors(r,l).normalize();const p=.006*(n(...u)*2-1)+.003*(n(u[0]*2.7,u[1]*2.7,u[2]*2.7)*2-1);r.copy(l).addScaledVector(c,f+p+o.dot(r)),s.setXYZ(h,r.x,r.y,r.z)}return t.computeVertexNormals(),t}function t_(a){const e=Uint8Array.from({length:256},(s,r)=>r);for(let s=255;s>0;s--){const r=Math.floor(a()*(s+1));[e[s],e[r]]=[e[r],e[s]]}const t=Float32Array.from({length:256},()=>a()),n=(s,r,l)=>t[e[e[e[s&255]+r&255]+l&255]],i=s=>s*s*(3-2*s),o=(s,r,l)=>s+(r-s)*l;return(s,r,l)=>{const c=Math.floor(s),h=Math.floor(r),u=Math.floor(l),f=i(s-c),p=i(r-h),v=i(l-u);return o(o(o(n(c,h,u),n(c+1,h,u),f),o(n(c,h+1,u),n(c+1,h+1,u),f),p),o(o(n(c,h,u+1),n(c+1,h,u+1),f),o(n(c,h+1,u+1),n(c+1,h+1,u+1),f),p),v)}}function n_(a,e){const t=a.glyphs.blank;return{uSeed:{value:new Y(e()*40,e()*40,e()*40)},uSun:{value:a.sunDir},uGlyph:{value:[t,t,t,t]},uLift:{value:new ct},uCut:{value:new ct}}}const Fh=r_(new Oe(Wv),.45).multiplyScalar(1.2),a_=Fh.clone().multiplyScalar(.72),i_=Fh.clone().multiplyScalar(1.45),o_=new Oe(qv),s_=new Oe("#5d6430");function r_(a,e){const t=.2126*a.r+.7152*a.g+.0722*a.b;return a.lerp(new Oe(t,t,t),e)}function l_(a){const e=new Fv({color:16777215,roughness:.9,metalness:0});return e.customProgramCacheKey=()=>"pohaku-basalt",e.onBeforeCompile=t=>{Object.assign(t.uniforms,a,{uDark:{value:a_},uLight:{value:i_},uPecked:{value:o_},uOlivine:{value:s_}}),t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
${c_}`).replace("#include <begin_vertex>",`#include <begin_vertex>
vObj = position;`).replace("#include <project_vertex>",`#include <project_vertex>
        vWorldY = (modelMatrix * vec4(transformed, 1.0)).y;
        vSunObj = uSun * mat3(modelMatrix);`),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
${h_}`).replace("#include <color_fragment>",`#include <color_fragment>
${u_}`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor = rough;`).replace("#include <normal_fragment_maps>","normal = bumpNormal(-vViewPosition, normal, height, faceDirection);").replace("#include <aomap_fragment>",`#include <aomap_fragment>
        // Darker toward the floor: the ambient occlusion a real renderer would
        // find where stone meets ground. In world space, so it stays put as
        // the stone rolls.
        float aoY = smoothstep(0.0, 0.5, vWorldY);
        aoY = aoY * aoY * (3.0 - 2.0 * aoY);
        reflectedLight.indirectDiffuse *= mix(0.45, 1.0, aoY);
        reflectedLight.directDiffuse *= mix(0.7, 1.0, aoY) * (1.0 - 0.85 * rim) * (1.0 - 0.45 * pit);
        reflectedLight.directSpecular *= 1.0 - rim;`)},e}const c_=`
uniform vec3 uSun;
varying vec3 vObj;
varying vec3 vSunObj;
varying float vWorldY;
`,h_=`
#define SLAB ${un.toFixed(4)}
#define HALF vec3(${(un/2).toFixed(4)}, 0.5, 0.5)
#define BEVEL ${Yv.toFixed(4)}
#define GLYPH vec2(${_n}.0, ${Pn}.0)
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
`,u_=`
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
`;function f_(){const t=document.createElement("canvas");t.width=192,t.height=128;const n=t.getContext("2d"),i=n.createImageData(192,128),o=(un+1.1)/2,s=2.1/2;for(let r=0;r<128;r++)for(let l=0;l<192;l++){const c=(l+.5)/192*2*o-o,h=(r+.5)/128*2*s-s,u=.07,f=Math.abs(c)-(un/2-u),p=Math.abs(h)-(.5-u),v=Math.hypot(Math.max(f,0),Math.max(p,0))+Math.min(Math.max(f,p),0)-u,g=v<=0?1:Math.pow(Math.max(0,1-v/.5),2.6),m=Math.round(g*255),d=(r*192+l)*4;i.data[d]=i.data[d+1]=i.data[d+2]=m,i.data[d+3]=255}return n.putImageData(i,0,0),new Uv(t)}class d_{constructor(){this.map=new Map,this.idle=[],this.queue=[],this.asked=!1,this.blank=zh(new Uint8Array([0,0]),1,1)}acquire(e,t){let n=this.map.get(e);n||(n={text:e,tex:null,refs:0,waiting:[]},this.map.set(e,n),this.queue.push(n),this.ask()),n.refs===0&&(this.idle=this.idle.filter(i=>i!==e)),n.refs++,n.tex?t(n.tex):n.waiting.push(t)}release(e){var n;const t=this.map.get(e);if(t&&(t.refs--,!(t.refs>0)))for(this.idle.push(e);this.idle.length>48;){const i=this.map.get(this.idle.shift());(n=i.tex)==null||n.dispose(),this.map.delete(i.text)}}hurry(e){const t=this.map.get(e);!t||t.tex||(this.queue.splice(this.queue.indexOf(t),1),this.peck(t))}peck(e){e.tex=v_(e.text);for(const t of e.waiting)t(e.tex);e.waiting=[]}ask(){if(this.asked)return;this.asked=!0;const e=t=>this.work(t);window.requestIdleCallback?requestIdleCallback(e,{timeout:50}):setTimeout(e,0)}work(e){this.asked=!1;const t=e&&!e.didTimeout,n=performance.now(),i=()=>t?e.timeRemaining()>3:performance.now()-n<8;for(let o=0;this.queue.length&&(o===0||i());o++){const s=this.queue.shift();this.map.get(s.text)===s&&this.peck(s)}this.queue.length&&this.ask()}}const p_=108,m_=84,tr=.88*_n,pc=.6,nr=.05,so=2.6;let ri=null,ro=0;function g_(a){if(ro)return ro;a.font=gt(100,{weight:600});let e=0;for(const t of wo.keys()){const n=Da(t),i=[...n].length;i<=5&&(e=Math.max(e,a.measureText(n).width/100+nr*(i-1)))}return ro=Math.max(m_,Math.min(p_,Math.floor(tr/e))),ro}function v_(a){ri||(ri=document.createElement("canvas"),ri.width=_n,ri.height=Pn);const e=ri.getContext("2d",{willReadFrequently:!0});e.setTransform(1,0,0,1,0,0),e.fillStyle="#000",e.fillRect(0,0,_n,Pn),e.fillStyle="#fff",e.textAlign="left",e.textBaseline="alphabetic";const t=Uo(__(a)),n=[...a],i=M=>{e.font=gt(M,{weight:600});const b=n.map((N,V)=>e.measureText(n.slice(0,V).join("")).width+nr*M*V),D=e.measureText(a).width+nr*M*(n.length-1);return{at:b,width:D}},o=g_(e);let s=o,r=i(s),l=Math.min(1,tr/r.width);l<pc&&(s=Math.floor(o*l/pc),r=i(s),l=Math.min(1,tr/r.width)),e.font=gt(s,{weight:600});const c=e.measureText("H").actualBoundingBoxAscent,h=Pn/2+c/2,u=_n/2-r.width*l/2;n.forEach((M,b)=>{e.save(),e.translate(u+r.at[b]*l,h+(t()-.5)*s*.025),e.rotate((t()-.5)*.035),e.scale(l,1),e.fillText(M,0,0),e.restore()});const f=e.measureText(a),p=Math.ceil(so*4),v=Math.max(0,Math.floor(u-p)),g=Math.max(0,Math.floor(h-f.actualBoundingBoxAscent-p)),m=Math.min(_n,Math.ceil(u+r.width*l+p))-v,d=Math.min(Pn,Math.ceil(h+f.actualBoundingBoxDescent+p))-g,x=e.getImageData(v,g,m,d).data,_=(M,b)=>{const D=Math.round(b)*m+Math.round(M);return M<0||b<0||M>m-1||b>d-1?0:x[D*4]/255},w=new Float32Array(m*d),E=new Float32Array(m*d),k=(M,b,D,N)=>{const V=D+.5,R=Math.max(0,Math.floor(M-V)),U=Math.min(m-1,Math.ceil(M+V)),z=Math.max(0,Math.floor(b-V)),Z=Math.min(d-1,Math.ceil(b+V));for(let G=z;G<=Z;G++){const O=G+.5-b;for(let q=R;q<=U;q++){const W=q+.5-M,L=W*W+O*O;if(L>=V*V)continue;const C=Math.min(1,V-Math.sqrt(L)),B=G*m+q;C>w[B]&&(w[B]=C),C>.5&&(E[B]=N)}}},T=so*1.15;for(let M=T/2;M<d;M+=T)for(let b=T/2;b<m;b+=T){const D=b+(t()-.5)*T,N=M+(t()-.5)*T,V=_(D,N),R=so*(.75+t()*.5),U=.35+.65*t()*t()+.35*t();if(V>.38+t()*.3)k(D,N,R,Math.min(1,U));else if(V>.02&&t()<.12){const z=so*2;k(D+(t()-.5)*z,N+(t()-.5)*z,R*.7,U*.7)}}const S=new Uint8Array(_n*Pn*2);for(let M=0;M<d;M++){const b=(Pn-1-(g+M))*_n+v;for(let D=0;D<m;D++){const N=M*m+D;S[(b+D)*2]=Math.round(w[N]*255),S[(b+D)*2+1]=Math.round(E[N]*255)}}return zh(S,_n,Pn)}function zh(a,e,t){const n=new Dv(a,e,t,rh);return n.unpackAlignment=1,n.generateMipmaps=!0,n.minFilter=Wa,n.magFilter=Ot,n.anisotropy=4,n.needsUpdate=!0,n.onUpdate=()=>{n.image.data=null},n}function __(a){let e=2166136261;for(let t=0;t<a.length;t++)e=Math.imul(e^a.charCodeAt(t),16777619);return e>>>0}class x_{constructor(){this.links=new Map}sync(e,t,{origin:n=null,holdUntil:i=()=>t}={}){let o=0;for(const[s,r]of e){const l=this.links.get(s);if(l){l.to===0&&this.animate(l,t,1,l.anchor);continue}const c=M_(r);c.p=0,c.from=0,c.to=0,c.anchor="start",r.kind==="pair"&&n!=null&&r.b.id===n&&(c.anchor="end"),this.links.set(s,c);const h=Math.max(t,i(r))+o;o+=.06,this.animate(c,h,1,c.anchor)}for(const[s,r]of this.links){if(e.has(s)||r.to===0)continue;let l=r.kind==="field"||n===r.a.id?"end":"start";r.p<.999&&(l=r.anchor),this.animate(r,t,0,l)}}animate(e,t,n,i){e.from=e.p,e.to=n,e.t0=t,e.anchor=i;const o=Math.abs(n-e.from)*e.len;e.dur=n?Math.min(1.25,Math.max(.45,o/14)):Math.min(.7,Math.max(.28,o/22))}update(e){for(const[t,n]of this.links){const i=je((e-n.t0)/n.dur);n.p=n.from+(n.to-n.from)*oa(i),n.moving=i<1&&e>=n.t0,n.to===1&&(n.doneAt=n.t0+n.dur),i>=1&&n.to===0&&this.links.delete(t)}}count(){let e=0;for(const t of this.links.values())t.to===1&&e++;return e}}function M_(a){if(a.kind==="pair"){const i={...a,...gc(Jc(a.key,a.a,a.b))};return i.portA=Ls(i,mc(a.a),!1),i.portB=Ls(i,mc(a.b),!0),i}const{pair:e,end:t}=a,n={...a,...gc([[e.x,e.z],t])};return n.portA=Ls(n,{x:e.x,z:e.z,...Bn.slabs},!1),n}function mc(a){return{x:a.x-Zc()[a.index][0],z:a.z,...Bn.slabs}}function gc(a){const e=[0];for(let t=1;t<a.length;t++)e.push(e[t-1]+Math.hypot(a[t][0]-a[t-1][0],a[t][1]-a[t-1][1]));return{pts:a,cum:e,len:e.at(-1)}}function Kn(a,e){const{pts:t,cum:n}=a;if(e<=0)return t[0];if(e>=a.len)return t.at(-1);let i=1;for(;n[i]<e;)i++;const o=(e-n[i-1])/(n[i]-n[i-1]||1);return[t[i-1][0]+(t[i][0]-t[i-1][0])*o,t[i-1][1]+(t[i][1]-t[i-1][1])*o]}function vc(a){const e=a.p*a.len;return a.anchor==="start"?[0,e]:[a.len-e,a.len]}function Ls(a,e,t){for(let i=0;i<=a.len;i+=.04){const[o,s]=Kn(a,t?a.len-i:i);if(Math.abs(o-e.x)>e.hx||Math.abs(s-e.z)>e.hz)return t?a.len-i:i}return t?0:a.len}const _t=Math.PI*2,w_=un+ur.h/2,b_=.5,Ns=A_(go,Qe,.34),_c=1.2,xt={frame:[0,.6],coast:[.05,.95],relief:[.45,1.25],bounds:[.9,1.7],marks:[1.2,1.95],labels:[1.45,2.2],stones:1.35};class S_{constructor(e){this.canvas=e,this.ctx=e.getContext("2d"),this.dpr=1,this.island=null}resize(e,t,n){this.w=e,this.h=t,this.dpr=n,this.canvas.width=Math.round(e*n),this.canvas.height=Math.round(t*n)}floor(e=1){const[t,n,i,o,s,r]=this.A,l=this.dpr;this.ctx.setTransform(t*l*e,n*l*e,i*l*e,o*l*e,s*l,r*l)}screen(){this.ctx.setTransform(this.dpr,0,0,this.dpr,0,0)}device(){this.ctx.setTransform(1,0,0,1,0,0)}toScreen(e,t){const[n,i,o,s,r,l]=this.A;return[n*e+o*t+r,i*e+s*t+l]}visibleRect(e=3){const[t,n,i,o,s,r]=this.A,l=t*o-n*i,c=(p,v)=>{const g=p-s,m=v-r;return[(o*g-i*m)/l,(-n*g+t*m)/l]},h=[c(0,0),c(this.w,0),c(0,this.h),c(this.w,this.h)],u=h.map(p=>p[0]),f=h.map(p=>p[1]);return{x0:Math.min(...u)-e,x1:Math.max(...u)+e,z0:Math.min(...f)-e,z1:Math.max(...f)+e}}project(e){const t=new Path2D;return t.addPath(e,this.M),t}ink(e,t,n,i=1,o=null,s=0){if(i<=0)return;const r=this.ctx;this.device(),r.globalAlpha=i,r.lineWidth=t*this.dpr,r.strokeStyle=n,r.setLineDash(o?o.map(l=>l*this.dpr):[]),r.lineDashOffset=s*this.dpr,r.stroke(this.project(e)),r.globalAlpha=1}fillWorld(e,t,n=1){if(n<=0)return;const i=this.ctx;this.device(),i.globalAlpha=n,i.fillStyle=t,i.fill(this.project(e)),i.globalAlpha=1}stroke(e,t,n){const i=this.ctx;this.screen(),i.lineWidth=e,i.strokeStyle=t,i.setLineDash(n??[]),i.stroke()}keepOut(e){const t=new Path2D;t.rect(0,0,this.canvas.width,this.canvas.height),t.addPath(e,this.M),this.device(),this.ctx.clip(t,"evenodd")}keepIn(e){this.device(),this.ctx.clip(this.project(e))}draw(e){const t=this.ctx,n=e.board.island;this.A=e.A,this.now=e.now;const[i,o,s,r,l,c]=e.A,h=this.dpr;this.M=new DOMMatrix([i*h,o*h,s*h,r*h,l*h,c*h]),this.island!==n&&this.prepare(n,e.board.pairs),this.device(),t.clearRect(0,0,this.canvas.width,this.canvas.height),t.lineCap="round",t.lineJoin="round";const u=e.intro,f=this.visibleRect();this.sheet(jt(u,xt.frame)),this.sea(u),this.relief(u),t.save(),this.keepOut(this.paths.upland),this.survey(u);const p=new Map;for(const _ of e.links.links.values())_.kind==="field"&&_.to===1&&p.set(_.feature,(p.get(_.feature)??0)+1);const v=jt(u,xt.marks),g=jt(u,xt.labels);n.places.forEach((_,w)=>{if(!xc(f,_.x,_.z,_.r+3))return;const E=si(je(v*1.4-w*.05));E>0&&this.place(_,E)}),this.mokuLabels(g);for(const _ of n.places)this.fieldLabel(_,g,p.get(_)??0);const m=ot(je((u-xt.stones)/.5)),d=ot(je((u-xt.stones-.6)/.8)),x=e.board.pairs.filter(_=>xc(f,_.x,_.z,2.5));this.pairMarks(x,e.noted,m,d);for(const _ of e.links.links.values())_.kind==="field"&&this.fieldLink(_,e.noted.has(_.pair));for(const _ of e.links.links.values())_.kind==="pair"&&this.pairLink(_);for(const _ of e.links.links.values())_.kind==="pair"&&this.pairLabel(_);for(const _ of e.ripples)this.ripple(_);t.restore()}prepare(e,t){this.island=e,this.K=e.k;const n=l=>et(l.map(c=>c.pts??c)),{sheet:i}=e,o=new Path2D;o.rect(i.x0,i.z0,i.x1-i.x0,i.z1-i.z0);const s=e.compass,r=new Path2D;r.arc(s.x,s.z,s.r*1.13,0,_t),this.paths={frame:o,disc:r,coast:n(e.coast),minor:y_(e),major:n(e.contours.filter(l=>l.major).flatMap(l=>l.lines)),water:e.waterlines.map(l=>n(l.lines)),ahupuaa:et(e.boundaries.filter(l=>!l.moku).map(l=>l.line)),moku:et(e.boundaries.filter(l=>l.moku).map(l=>l.line)),offshore:et(e.boundaries.map(l=>l.sea)),trail:et(e.trail.firm),trailFlow:et(e.trail.flow),windward:n(e.streams.filter(l=>l.windward)),leeward:n(e.streams.filter(l=>!l.windward)),reef:Ds(e.reef.dots),upland:et([e.upland.ring],!0),form:n(e.upland.form),pond:et([e.places.find(l=>l.kind==="fishpond").line],!0),cloud:et([e.places.find(l=>l.kind==="cloud").line],!0)},this.placeArt=new Map(e.places.map(l=>[l,this.art(l)])),this.crests=null,this.surfAt=null,this.layoutLabels(e,t),this.compassType(s)}art(e){const t=this.K;switch(e.kind){case"compass":{const{x:n,z:i,r:o,horizon:s}=e,r=new Path2D;r.arc(n,i,o,0,_t),r.moveTo(n+s,i),r.arc(n,i,s,0,_t);const l=new Path2D,c=new Path2D;for(const f of e.houses){const[p,v]=Rn(f.bearing-_t/64);l.moveTo(n+p*s,i+v*s),l.lineTo(n+p*o,i+v*o);const[g,m]=Rn(f.bearing);if(l.moveTo(n+g*o,i+m*o),l.lineTo(n+g*o*1.04,i+m*o*1.04),!f.cardinal)continue;const d=f.bearing-_t/64-Math.PI/2,x=f.bearing+_t/64-Math.PI/2;c.moveTo(n+Math.cos(d)*s,i+Math.sin(d)*s),c.arc(n,i,o,d,x),c.arc(n,i,s,x,d,!0),c.closePath()}const h=new Path2D;for(const f of[0,Math.PI/2]){const[p,v]=Rn(f);h.moveTo(n-p*s,i-v*s),h.lineTo(n+p*s,i+v*s)}const u=new Path2D;return u.arc(n,i,o*.035,0,_t),{rings:r,spokes:l,cardinal:c,axes:h,centre:u}}case"fishpond":{const n=e.gates.map(c=>[c.x,c.z,c.w/2]),i=new Path2D,o=new Path2D,s=.045*t,r=k_(Mc(e.line,.02*t));for(const c of[-1,1]){let h=!1;for(const[u,f,p,v]of r){if(n.some(([x,_,w])=>Math.hypot(u-x,f-_)<w)){h=!1;continue}const m=u+p*s*c,d=f+v*s*c;h?i.lineTo(m,d):i.moveTo(m,d),h=!0}}r.forEach(([c,h,u,f],p)=>{p%5||n.some(([v,g,m])=>Math.hypot(c-v,h-g)<m)||(o.moveTo(c-u*s,h-f*s),o.lineTo(c+u*s,h+f*s))});const l=new Path2D;for(const c of e.gates){const h=-c.dz,u=c.dx;for(const f of[-1,1]){const p=c.x+c.dx*f*c.w*.5,v=c.z+c.dz*f*c.w*.5;l.moveTo(p-h*s*2,v-u*s*2),l.lineTo(p+h*s*2,v+u*s*2)}l.moveTo(c.x-c.dx*c.w*.5,c.z-c.dz*c.w*.5),l.lineTo(c.x+c.dx*c.w*.5,c.z+c.dz*c.w*.5);for(let f=-1.5;f<=1.5;f++){const p=c.x+c.dx*c.w*.22*f,v=c.z+c.dz*c.w*.22*f;l.moveTo(p-h*s*.8,v-u*s*.8),l.lineTo(p+h*s*.8,v+u*s*.8)}}return{wall:i,joints:o,gates:l}}case"lava":return{edge:et(e.edges),lobes:et(e.lobes),ropes:et(e.ropes),stipple:Ds(e.stipple)};case"loi":return{banks:et(e.terraces,!0),auwai:et([e.auwai,e.drain])};case"kauhale":{const n=et(e.houses.map(r=>r.paepae),!0),i=et(e.houses.filter(r=>r.roof).map(r=>r.roof),!0),o=et(e.houses.filter(r=>r.roof).flatMap(r=>[r.ridge,...r.hips])),s=new Path2D;for(const r of e.houses){if(!r.roof)continue;const[l,c,h,u]=r.roof;for(let f=1;f<9;f++){const p=f/9,v=[l[0]+(c[0]-l[0])*p,l[1]+(c[1]-l[1])*p],g=[u[0]+(h[0]-u[0])*p,u[1]+(h[1]-u[1])*p];for(const[m,d]of[[v,g],[g,v]])s.moveTo(...m),s.lineTo(m[0]+(d[0]-m[0])*.32,m[1]+(d[1]-m[1])*.32)}}return{paepae:n,roofs:i,ridges:o,thatch:s}}case"halau":return{shed:et([e.shed],!0),ridge:et([e.ridge]),thatch:et(e.thatch),hulls:et(e.hulls,!0),beams:et([...e.beams,e.deck]),sand:Ds(e.sand)};case"cloud":return{};case"stream":return{line:et([e.line])}}return{}}measure(e,t,n,i=0){const o=this.ctx;o.font=gt(t,n),o.letterSpacing=`${i}px`;const s=o.measureText(e).width;return o.letterSpacing="0px",s/100}layoutLabels(e,t){const n=this.K,i=Math.round(92*n),o=Math.round(17*Math.max(.9,n));this.labelSize={word:i,small:o,gap:.36*Math.max(.9,n)};const s=[],r=e.places.find(S=>S.kind==="cloud"),l=e.places.find(S=>S.kind==="lava"),c=e.compass,{sheet:h}=e,u=S=>S.kind==="stream"||S.kind==="lava",f=e.places.filter(S=>!u(S)&&S!==r).map(S=>({p:S,x:S.x,z:S.z,r:S===c?S.r*1.28:S.r})),p=new Map,v=[...e.places.filter(u).map(S=>({own:S,cost:400,line:S.line})),...e.boundaries.map(S=>({own:null,cost:S.moku?120:40,line:S.line}))];for(const{own:S,cost:M,line:b}of v)for(const[D,N]of Mc(b,.1)){const V=Math.floor(D)*4096+Math.floor(N);p.has(V)||p.set(V,[]),p.get(V).push({x:D,z:N,own:S,cost:M})}const g=Bn.hides,m=t.map(S=>({x0:S.x+g.x0,x1:S.x+g.x1,z0:S.z+g.z0,z1:S.z+g.z1})),d=t.map(S=>({x0:S.x+g.x1,x1:S.x+g.x1+1.6,z0:S.z+.85,z1:S.z+g.z1})),x=[],_=(S,M,b,D)=>{let N=Math.hypot((S.x0+S.x1)/2,(S.z0+S.z1)/2)*3;(S.x0<h.x0+.3||S.x1>h.x1-.3||S.z0<h.z0+.3||S.z1>h.z1-.3)&&(N+=1e7);for(const R of m)N+=1e6*Us(S,R);if(N>=D)return N;const V=b?{x0:S.x0-b,x1:S.x1+b,z0:S.z0-b,z1:S.z1+b}:S;for(const R of s)N+=1e6*Us(V,R);if(N>=D)return N;(M===r?wc(S,e.upland.ring):bc(S,r.x,r.z,r.r+.2))&&(N+=1e7);for(const R of f){if(R.p===M)continue;const U=bc(S,R.x,R.z,R.r+.15);U&&(N+=R.p===c?1e7:3e3*U)}M!==l&&wc(S,l.line)&&(N+=2e4);for(const R of d)N+=2e4*Us(S,R);if(N>=D)return N;for(let R=Math.floor(S.x0);R<=Math.floor(S.x1);R++)for(let U=Math.floor(S.z0);U<=Math.floor(S.z1);U++)for(const z of p.get(R*4096+U)??x)z.own!==M&&z.x>S.x0&&z.x<S.x1&&z.z>S.z0&&z.z<S.z1&&(N+=z.cost);if(M){const R=e.height,U=wn(R,R.h,(S.x0+S.x1)/2,(S.z0+S.z1)/2)<=0,z=M.kind==="fishpond"||M.kind==="compass";U!==z&&(N+=z?600:250)}return N},w=(S,M,b,D)=>{let N=null,V=1/0;for(const R of S){const U=D(R),z=_(R,M,b,V-U)+U;z<V&&(V=z,N=R)}return N},E=(S,M,b,D)=>({x0:S-b/2,x1:S+b/2,z0:M-D/2,z1:M+D/2});this.labels=new Map;for(const S of e.places){const M=pi[S.field],b=Math.max(this.measure(M.label,i,{italic:!0}),this.measure(`${M.label.toUpperCase()} · ${M.en.toUpperCase()} — 00`,o,{weight:600},1.5)+.06),D=i/100*.74,N=D+this.labelSize.gap+.06,V=.25*n,R=[];if(u(S)){const z=S.kind==="stream"?S.line:S.axis,Z=S.kind==="lava"?1*n:0;for(let G=.1;G<=.91;G+=.05){const O=Math.round(G*(z.length-1)),[q,W]=z[O],[L,C]=z[Math.min(z.length-1,O+1)],B=Math.hypot(L-q,C-W)||1,H=-(C-W)/B,Q=(L-q)/B;for(const ee of[-1,1])for(const ae of[0,.5,1.1,1.8]){const de=H*ee,fe=Q*ee,te=V+Z+ae*n;R.push({...E(q+de*te+de*b/2,W+fe*te+fe*N/2,b,N),gap:ae})}}}else for(let z=0;z<24;z++){const Z=z/24*_t,G=Math.cos(Z),O=Math.sin(Z),q=S===r?T_(S.line,S.x,S.z,G,O):S.kind==="compass"?S.r*1.3:S.r;for(const W of[0,.5,1.1,1.8,2.6]){const L=q+V+W*n;R.push({...E(S.x+G*L+G*b/2,S.z+O*L+O*N/2,b,N),gap:W})}}const U=w(R,S,0,z=>500*z.gap);s.push(U),this.labels.set(S,{x:U.x0,z:U.z0+D,box:U})}const k=Math.round(34*n);this.moku=e.moku.map(S=>{const M=S.name.toUpperCase(),b=k*.5,D=this.measure(M,k,{},b),N=k/100*.9,V=[];for(let U=-.9;U<=.91;U+=.15){const z=S.bearing+U,Z=E_(e,z),[G,O]=Rn(z);for(let q=.3;q<=.86;q+=.06){const W=e.summit[0]+G*Z*q,L=e.summit[1]+O*Z*q;V.push({...E(W,L,D,N),db:U})}}const R=w(V,null,.9,U=>Math.abs(U.db)*40);return s.push(R),{text:M,px:k,spacing:b,x:R.x0,z:R.z1-.1*N,box:R}});const T=[...this.labels.values(),...this.moku].map(({box:S})=>{const M=new Path2D,b=.08;return M.rect(S.x0-b,S.z0-b,S.x1-S.x0+2*b,S.z1-S.z0+2*b),{path:M,when:xt.labels}});for(const S of e.places)if(S.kind==="kauhale"||S.kind==="halau"){const M=new Path2D;M.arc(S.x,S.z,S.r*.95,0,_t),T.push({path:M,when:xt.marks})}else S.kind==="loi"&&T.push({path:et([S.line],!0),when:xt.marks});this.gaps=T}fieldLabel(e,t,n){if(t<=0)return;const i=this.labels.get(e),o=pi[e.field],s=this.ctx;this.floor(.01),s.globalAlpha=t,s.textAlign="left",s.textBaseline="alphabetic",s.fillStyle=Ns,s.font=gt(this.labelSize.word,{italic:!0}),s.fillText(o.label,i.x*100,i.z*100),s.fillStyle=Qe,s.font=gt(this.labelSize.small,{weight:600}),s.letterSpacing="1.5px",s.fillText(`${o.label.toUpperCase()} · ${o.en.toUpperCase()} — ${String(n).padStart(2,"0")}`,i.x*100+4,(i.z+this.labelSize.gap)*100),s.letterSpacing="0px",s.globalAlpha=1}mokuLabels(e){if(e<=0)return;const t=this.ctx;this.floor(.01),t.globalAlpha=e*.75,t.fillStyle=Qe,t.textAlign="left",t.textBaseline="alphabetic";for(const n of this.moku)t.font=gt(n.px),t.letterSpacing=`${n.spacing}px`,t.fillText(n.text,n.x*100,n.z*100);t.letterSpacing="0px",t.globalAlpha=1}sheet(e){if(e<=0)return;const{sheet:t}=this.island,n=.16*this.K,i=new Path2D;i.rect(t.x0+n,t.z0+n,t.x1-t.x0-2*n,t.z1-t.z0-2*n),this.ink(this.paths.frame,1.4,Ve,e),this.ink(i,.7,Qe,e);const o=new Path2D,s=n*.5;for(let r=Math.ceil(t.x0);r<t.x1-1;r+=2)o.rect(r,t.z0,1,s),o.rect(r,t.z1-s,1,s);for(let r=Math.ceil(t.z0);r<t.z1-1;r+=2)o.rect(t.x0,r,s,1),o.rect(t.x1-s,r,s,1);this.fillWorld(o,Qe,e*.55)}sea(e){const t=this.ctx,n=jt(e,xt.relief);t.save(),this.keepIn(this.paths.frame),this.keepOut(this.paths.disc);const i=this.paths.water.length;t.save(),this.keepOut(this.paths.pond),this.paths.water.forEach((r,l)=>{const c=ot(je(n*1.6-l*.08));this.ink(r,.75,Qe,c*(.06+.6*Math.pow(1-l/i,1.5)))}),t.restore();const o=ot(jt(e,[xt.marks[0],xt.marks[1]+1]));o>0&&this.swell(o);const s=jt(e,xt.marks);this.ink(this.paths.reef,1.5,Ve,s*.7,[.01,1e4]),this.surf(s),t.restore()}swell(e){var i;const t=this.island.swell,n=this.now/t.period%1;if(!this.crests||Math.abs(n-this.crests.ph)*t.lambda>.02){const o=((i=this.crests)==null?void 0:i.S)??new Float32Array(t.nx*t.nz);for(let r=0;r<o.length;r++)o[r]=Number.isFinite(t.T[r])?Math.sin(_t*(t.T[r]/t.lambda-n)):-1;const s=[new Path2D,new Path2D,new Path2D];for(const r of Zn({...t,h:o},0)){let l=null,c=-1;for(const[h,u]of r.pts){const f=wn(t,t.T,h,u),v=Number.isFinite(f)&&Math.cos(_t*(f/t.lambda-n))>0?Math.min(3,Math.floor(wn(t,t.energy,h,u)*4))-1:-1;v!==c?(l&&c>=0&&l.lineTo(h,u),l=v>=0?s[v]:null,l&&l.moveTo(h,u),c=v):l&&l.lineTo(h,u)}}this.crests={ph:n,buckets:s,S:o}}this.crests.buckets.forEach((o,s)=>this.ink(o,.8,Qe,e*[.16,.28,.42][s],[6,7]))}surf(e){var i;if(e<=0)return;const t=this.island.swell,n=Math.floor(this.now/t.period%1*240);if(((i=this.surfAt)==null?void 0:i.at)!==n){const o=n/240,s=[new Path2D,new Path2D,new Path2D];for(const r of this.island.reef.surf){const l=wn(t,t.T,r.x,r.z),c=Number.isFinite(l)?((l/t.lambda-o)%1+1)%1:.5,h=s[Math.min(2,Math.floor(Math.pow(Math.cos(Math.PI*c),8)*3))];h.moveTo(r.pts[0][0],r.pts[0][1]);for(let u=1;u<r.pts.length;u++)h.lineTo(r.pts[u][0],r.pts[u][1])}this.surfAt={at:n,buckets:s}}this.surfAt.buckets.forEach((o,s)=>this.ink(o,.8,Ve,e*[.3,.5,.8][s]))}relief(e){const t=this.ctx,n=ot(jt(e,xt.relief));if(n>0){const[o,s,r,l]=this.A,c=o*o+s*s+r*r+l*l,h=o*l-s*r,u=Math.sqrt(Math.max(0,(c-Math.sqrt(Math.max(0,c*c-4*h*h)))/2));this.broken(e,f=>{for(const{lo:p,path:v}of this.paths.minor)this.ink(v,.7,Qe,n*f*.32*ot(je((p*u-3)/2)));this.ink(this.paths.major,1.05,Qe,n*f*.8)}),t.save(),this.keepIn(this.paths.upland),this.ink(this.paths.form,.7,Qe,n*.4,[4,3]),t.restore()}const i=jt(e,xt.coast);if(i>=1)this.ink(this.paths.coast,_c,Ve);else if(i>0){const o=new Path2D;for(const s of this.island.coast){const r=Math.max(2,Math.ceil(s.pts.length*si(i)));o.moveTo(...s.pts[0]);for(let l=1;l<r;l++)o.lineTo(...s.pts[l])}this.ink(o,_c,Ve)}}broken(e,t){const n=this.ctx;this.gapsAt!==this.M&&(this.gapsAt=this.M,this.gapsOut=this.gaps.map(i=>{const o=new Path2D;return o.rect(0,0,this.canvas.width,this.canvas.height),o.addPath(i.path,this.M),o})),n.save(),this.device();for(const i of this.gapsOut)n.clip(i,"evenodd");t(1),n.restore();for(const i of this.gaps){const o=1-jt(e,i.when);o<=0||(n.save(),this.keepIn(i.path),t(o),n.restore())}}survey(e){const t=this.island,n=this.ctx,i=jt(e,xt.bounds),o=(r,l)=>this.broken(e,c=>{n.save(),this.keepIn(this.paths.cloud),this.ink(r,.9,Ea,c*.12),this.ink(l,1.9,Ea,c*.25,[10,3,1.5,3]),n.restore(),n.save(),this.keepOut(this.paths.cloud),this.ink(r,.9,Ea,c*.45),this.ink(l,1.9,Ea,c*.85,[10,3,1.5,3]),n.restore()});if(i>=1)o(this.paths.ahupuaa,this.paths.moku),this.ink(this.paths.offshore,.9,Ea,.35,[2.5,3.5]);else if(i>0){const r=new Path2D,l=new Path2D;t.boundaries.forEach((c,h)=>{const u=je(i*1.5-h/t.boundaries.length*.5),f=c.moku?l:r,p=Math.ceil(c.line.length*ot(u));if(!(p<2)){f.moveTo(...c.line[0]);for(let v=1;v<p;v++)f.lineTo(...c.line[v])}}),o(r,l)}const s=jt(e,xt.marks);if(!(s<=0)){this.ink(this.paths.windward,.95,Ve,s*.75),this.ink(this.paths.leeward,.85,Qe,s*.85,[4,2.5]),this.broken(e,r=>{this.ink(this.paths.trail,1.35,Ve,s*r*.8,[.01,3.4]),this.ink(this.paths.trailFlow,1.35,Ve,s*r*.8,[.01,7])}),this.screen(),n.globalAlpha=s,n.setLineDash([]),n.lineWidth=.9,n.strokeStyle=Ve,n.fillStyle=go;for(const[r,l]of t.ahu){const[c,h]=this.toScreen(r,l);n.beginPath();for(const[u,f,p]of[[-2.1,0,1.75],[2.1,0,1.75],[0,-2.9,1.6]])n.moveTo(c+u+p,h+f),n.arc(c+u,h+f,p,0,_t);n.fill(),n.stroke()}n.globalAlpha=1}}place(e,t){const n=this.placeArt.get(e),i=this.now,o=this.K,s=this.ctx;switch(e.kind){case"compass":this.compass(e,n,t);break;case"fishpond":{this.ink(n.wall,.9,Ve,t),this.ink(n.joints,.6,Qe,t*.8),this.ink(n.gates,.8,Ve,t),this.floor(),s.beginPath();for(const r of e.rings){const l=(i+r.phase)%r.period/2.6;if(l>=1)continue;const c=(.04+.3*si(l))*o;s.moveTo(r.x+c,r.z),s.arc(r.x,r.z,c,0,_t)}s.globalAlpha=t*.55,this.stroke(.7,Qe),s.globalAlpha=1;break}case"lava":this.ink(n.edge,1,Ve,t),this.ink(n.lobes,.8,Ve,t*.8),this.ink(n.ropes,.65,Qe,t*.85),this.ink(n.stipple,1.1,Ve,t*.6,[.01,1e4]);break;case"loi":this.fillWorld(n.banks,Ns,t*.6),this.ink(n.banks,.85,Ve,t),this.ink(n.auwai,.9,Ve,t*.85,[2.5,2.5],-i*5);break;case"kauhale":this.ink(n.paepae,.85,Ve,t),this.ink(n.thatch,.55,Qe,t*.9),this.ink(n.roofs,.8,Ve,t),this.ink(n.ridges,.7,Ve,t);break;case"halau":this.ink(n.sand,1,Qe,t*.6,[.01,1e4]),this.ink(n.thatch,.55,Qe,t*.9),this.ink(n.shed,.85,Ve,t),this.ink(n.ridge,.75,Ve,t),this.ink(n.hulls,.85,Ve,t),this.ink(n.beams,.75,Ve,t);break;case"cloud":this.cloud(e,t);break;case"stream":this.ink(n.line,1.2,Ve,t*.9),this.ink(n.line,1.6,Mt,t*.7,[1.2,11],-i*7);break}}cloud(e,t){const n=this.now,i=this.ctx,o=this.island.seed,s=o*.37%_t,r=o*.71%_t,l=[[],[],[]];for(const c of e.strokes){const u=(.55+.3*Math.sin(3*c.b-n*.021+s)+.2*Math.sin(5*c.b+n*.013+r)+.12*Math.sin(11*c.b-n*.034))*Math.pow(Math.sin(Math.PI*c.f),.5);u<.3||l[Math.min(2,Math.floor((u-.3)*5))].push(c)}l.forEach((c,h)=>{if(c.length){this.floor(),i.beginPath();for(const u of c)i.moveTo(u.x0,u.z0),i.lineTo(u.x1,u.z1);i.globalAlpha=t*[.25,.42,.6][h],this.stroke(.6,Qe)}}),i.globalAlpha=1}compass(e,t,n){const i=this.ctx,{x:o,z:s,horizon:r}=e;this.fillWorld(t.cardinal,Ns,n*.8),this.ink(t.rings,1,Ve,n),this.ink(t.spokes,.7,Qe,n),this.ink(t.axes,.6,Qe,n*.6,[2,4]),this.ink(t.centre,.8,Ve,n);const l=66,c=Math.floor(this.now/l),h=e.stars[(c%e.stars.length+e.stars.length)%e.stars.length],u=(this.now-c*l)/60,f=u<=1?ot(je(u*12))*ot(je((1-u)*12)):0,p=g=>[o+g[0]*r,s+g[1]*r];if(f>0){const g=h.path,m=u*(g.length-1);this.floor(),i.beginPath(),g.forEach((S,M)=>M?i.lineTo(...p(S)):i.moveTo(...p(S))),i.globalAlpha=n*f*.6,this.stroke(.9,Qe,[.01,3]),this.floor(),i.beginPath(),i.moveTo(...p(g[0]));for(let S=1;S<=Math.floor(m);S++)i.lineTo(...p(g[S]));const d=Math.floor(m),x=m-d,_=g[d],w=g[Math.min(g.length-1,d+1)],E=p([_[0]+(w[0]-_[0])*x,_[1]+(w[1]-_[1])*x]);i.lineTo(...E),i.globalAlpha=n*f*.8,this.stroke(.9,Ve);const[k,T]=this.toScreen(...E);this.screen(),i.globalAlpha=n*f,i.fillStyle=Mt,i.beginPath(),i.arc(k,T,2.3,0,_t),i.fill(),i.strokeStyle=Mt,i.lineWidth=.8,i.beginPath();for(let S=0;S<4;S++){const M=S*Math.PI/2;i.moveTo(k+Math.cos(M)*3.8,T+Math.sin(M)*3.8),i.lineTo(k+Math.cos(M)*6.5,T+Math.sin(M)*6.5)}i.stroke(),i.globalAlpha=1}i.textAlign="center",i.textBaseline="middle";let v=null;for(const g of this.compassNames){const m=f>0&&g.name===h.name&&(g.quadrant===h.rises||g.quadrant===h.sets),d=m?g.lit:g.style;this.floor(.01),i.translate(g.x*100,g.z*100),i.rotate(g.ang),d!==v&&(i.font=d.font,i.letterSpacing=d.spacing,v=d),i.fillStyle=g.cardinal||m?Mt:Ve,i.globalAlpha=n*(g.cardinal||m?1:.85),i.fillText(g.text,0,0)}this.floor(.01),i.globalAlpha=n,i.letterSpacing="0px",i.font=this.compassQuadrantFont,i.fillStyle=Qe;for(const g of e.quadrants){const[m,d]=Rn(g.bearing);i.fillText(g.name,(o+m*r*.6)*100,(s+d*r*.6)*100)}i.font=this.compassCredit.font,i.textAlign="center",i.textBaseline="alphabetic",i.globalAlpha=n*.9;for(const g of this.compassCredit.chars)this.floor(.01),i.translate(g.x*100,g.z*100),i.rotate(g.ang),i.fillText(g.text,0,0);i.globalAlpha=1}compassType(e){const t=this.ctx,{x:n,z:i,r:o,horizon:s}=e,r=(s+o)/2,l=(o-s)*100*.86,c=Math.round(o*7.4),h=(d,x,_)=>{t.font=gt(x,{weight:_}),t.letterSpacing=`${x*.06}px`;const w=t.measureText(d).width;return w>l&&(x=Math.floor(x*l/w)),t.letterSpacing="0px",t.font=gt(x,{weight:_}),{font:t.font,spacing:`${x*.06}px`}};this.compassNames=e.houses.map(d=>{const x=d.name.toUpperCase(),_=d.cardinal?Math.round(c*1.1):c,[w,E]=Rn(d.bearing),k=h(x,_,600);return{name:d.name,quadrant:d.quadrant,cardinal:d.cardinal,text:x,x:n+w*r,z:i+E*r,ang:d.bearing-Math.PI/2+(d.bearing>Math.PI?Math.PI:0),style:d.cardinal?k:h(x,_,400),lit:k}}),t.font=gt(Math.round(c*1.05),{italic:!0}),this.compassQuadrantFont=t.font;const u=Math.round(c*.9);t.font=gt(u,{italic:!0});const f=[..."after PVS / Nainoa Thompson"],p=f.map(d=>t.measureText(d).width/100),v=p.reduce((d,x)=>d+x,0),g=o*1.05+u/100*.7;let m=-v/2;this.compassCredit={font:t.font,chars:f.map((d,x)=>{const _=Math.PI-(m+p[x]/2)/g;m+=p[x];const[w,E]=Rn(_);return{text:d,x:n+w*g,z:i+E*g,ang:_-Math.PI}})}}pairMarks(e,t,n,i){if(n<=0)return;const o=this.ctx,s=w_+.2,r=b_+.2;for(const h of[!1,!0]){this.floor(),o.beginPath();for(const u of e){if(t.has(u)!==h)continue;const f=h?.34:.22;for(const[p,v,g,m]of[[u.x-s,u.z-r,1,1],[u.x+s,u.z-r,-1,1],[u.x-s,u.z+r,1,-1],[u.x+s,u.z+r,-1,-1]])o.moveTo(p+g*f,v),o.lineTo(p,v),o.lineTo(p,v+m*f)}o.globalAlpha=n,this.stroke(h?1.4:1,h?Mt:Qe)}if(o.globalAlpha=1,i<=0)return;const l=this.now,c=e.map(h=>{const u=h.caption;let f=u.prev1,p=u.prev2,v=0;if(l>=u.t0){const d=Math.floor((l-u.t0)/.026);f=u.text1.slice(0,d),p=u.text2.slice(0,Math.max(0,d-u.text1.length*.4)),d<u.text1.length?v=1:p.length<u.text2.length&&(v=2)}else if(l>=u.t0-.3){const d=je((u.t0-l)/.3);f=u.prev1.slice(0,Math.ceil(u.prev1.length*d)),p=u.prev2.slice(0,Math.ceil(u.prev2.length*d))}const g=(h.x-s)*100,m=(h.z+r+.34)*100;return{p:h,x:g,y0:(h.z-r-.1)*100,y1:m,y2:m+27,l1:f,l2:p,cursor:v,noted:t.has(h)}});o.globalAlpha=i,this.floor(.01),o.textAlign="left",o.textBaseline="alphabetic",o.fillStyle=Qe,o.font=gt(14);for(const h of c)o.fillText(String(h.p.id+1).padStart(3,"0"),h.x,h.y0);for(const[h,u,f,p]of[["l1","y1",gt(17,{weight:600}),"1.6px"],["l2","y2",gt(17),"0px"]]){o.font=f,o.letterSpacing=p;const v=h==="l1"?1:2;for(const g of c)o.fillStyle=v===2?Qe:g.noted?Mt:Ve,o.fillText(g[h],g.x,g[u]),g.cursor===v&&(o.fillStyle=Mt,o.fillRect(g.x+o.measureText(g[h]).width+2,g[u]-14,9,17))}o.letterSpacing="0px",o.globalAlpha=1}span(e){const[t,n]=vc(e);if(n-t<.005)return null;const i=this.ctx;this.floor(),i.beginPath();const o=Kn(e,t);i.moveTo(o[0],o[1]);for(let r=1;r<e.pts.length;r++)if(!(e.cum[r]<=t)){if(e.cum[r]>=n)break;i.lineTo(e.pts[r][0],e.pts[r][1])}const s=Kn(e,n);return i.lineTo(s[0],s[1]),[t,n]}dot(e,t,n,i,o){const s=this.ctx,[r,l]=this.toScreen(e,t);this.screen(),s.beginPath(),s.arc(r,l,n,0,_t),i&&(s.fillStyle=i,s.fill()),o&&(s.setLineDash([]),s.lineWidth=1,s.strokeStyle=o,s.stroke())}pairLink(e){const t=this.span(e);if(!t)return;const[n,i]=t;this.stroke(1.3,Mt);for(const o of[e.portA,e.portB])if(o>=n-.001&&o<=i+.001){const[s,r]=Kn(e,o);this.dot(s,r,2.6,go,Mt)}if(e.moving){const[o,s]=Kn(e,e.anchor==="start"?i:n);this.dot(o,s,2.4,Mt)}}pairLabel(e){const[t,n]=vc(e),i=e.len/2;if(i<t||i>n)return;const o=e.anchor==="start"?n-i:i-t,s=ot(je(o/.8));if(s<=0)return;const r=this.ctx,[l,c]=Kn(e,i),[h,u]=this.toScreen(l,c),f=Da(e.stone),p=.6+.4*s;r.setTransform(this.dpr*p,0,0,this.dpr*p,h*this.dpr,u*this.dpr),r.font=gt(10.5,{weight:600}),r.letterSpacing="0.8px";const v=r.measureText(f).width+12,g=15;r.globalAlpha=s,r.beginPath(),r.roundRect(-v/2,-g/2,v,g,g/2),r.fillStyle=Dh,r.fill(),r.setLineDash([]),r.lineWidth=1,r.strokeStyle=Mt,r.stroke(),r.fillStyle=Mt,r.textAlign="center",r.textBaseline="middle",r.fillText(f,-.4,.8),r.textBaseline="alphabetic",r.letterSpacing="0px",r.globalAlpha=1,this.pulse(h,u,e,v/2,g/2)}pulse(e,t,n,i,o){const s=(this.now-n.doneAt)/.9;if(!(s>=0&&s<1))return;const r=this.ctx,l=16*si(s);this.screen(),r.beginPath(),r.roundRect(e-i-l,t-o-l,2*(i+l),2*(o+l),o+l),r.globalAlpha=(1-s)*.8,r.setLineDash([]),r.lineWidth=1,r.strokeStyle=Mt,r.stroke(),r.globalAlpha=1}fieldLink(e,t){const n=this.span(e);if(!n)return;const[i,o]=n,s=t?Ea:Ve;if(this.stroke(t?1.2:1,s,[3,3.5]),e.portA>=i&&e.portA<=o){const[g,m]=Kn(e,e.portA);this.dot(g,m,2.2,go,s)}if(o<e.len-.001)return;const r=this.ctx,[l,c]=e.pts.at(-1),[h,u]=this.toScreen(l,c),[f,p]=this.toScreen(...e.pts[0]),v=Math.atan2(u-p,h-f);this.screen(),r.setLineDash([]),r.strokeStyle=s,r.fillStyle=s,r.lineWidth=1,r.beginPath(),e.stub?(r.moveTo(h+Math.cos(v+2.6)*6,u+Math.sin(v+2.6)*6),r.lineTo(h,u),r.lineTo(h+Math.cos(v-2.6)*6,u+Math.sin(v-2.6)*6),r.stroke(),r.font=gt(12,{italic:!0}),r.textAlign=Math.cos(v)>=0?"left":"right",r.textBaseline="middle",r.fillText(pi[e.feature.field].label,h+Math.cos(v)*9,u+Math.sin(v)*9),r.textBaseline="alphabetic"):(r.moveTo(h+3.2,u),r.lineTo(h,u+3.2),r.lineTo(h-3.2,u),r.lineTo(h,u-3.2),r.closePath(),r.fill(),this.pulse(h,u,e,3,3))}ripple(e){const t=je((this.now-e.t0)/e.dur);if(t<=0||t>=1)return;const n=si(t),i=un/2+.06+.7*n,o=.56+.7*n,s=this.ctx;this.floor(),s.beginPath(),s.roundRect(e.x-i,e.z-o,2*i,2*o,.12+.5*n),s.globalAlpha=(1-t)*.7,this.stroke(1,Mt),s.globalAlpha=1}}function jt(a,[e,t]){return je((a-e)/(t-e))}function xc(a,e,t,n){return e+n>a.x0&&e-n<a.x1&&t+n>a.z0&&t-n<a.z1}function Rn(a){return[Math.sin(a),-Math.cos(a)]}function et(a,e=!1){const t=new Path2D;for(const n of a)if(!(!n||n.length<2)){t.moveTo(n[0][0],n[0][1]);for(let i=1;i<n.length;i++)t.lineTo(n[i][0],n[i][1]);e&&t.closePath()}return t}function Ds(a){const e=new Path2D;for(const[t,n]of a)e.moveTo(t,n),e.lineTo(t+.001,n);return e}const lo=[0,.04,.06,.08,.1,.125,.15,.2];function y_(a){const e=a.height,t=a.contours,n=t[1].level-t[0].level,i=e.step,o=(l,c)=>{const h=wn(e,e.h,l+i,c)-wn(e,e.h,l-i,c),u=wn(e,e.h,l,c+i)-wn(e,e.h,l,c-i);return n/(Math.hypot(h,u)/(2*i)||1e-9)},s=l=>{let c=0;for(;c+1<lo.length&&l>=lo[c+1];)c++;return c},r=lo.map(()=>[]);for(const l of t)if(!l.major)for(const{pts:c}of l.lines){let h=null,u=-1;for(let f=1;f<c.length;f++){const[p,v]=c[f-1],[g,m]=c[f],d=s(o((p+g)/2,(v+m)/2));d!==u&&(h=[c[f-1]],r[d].push(h),u=d),h.push(c[f])}}return lo.map((l,c)=>({lo:l,path:et(r[c])}))}function Mc(a,e){const t=[a[0]];for(let n=1;n<a.length;n++){const[i,o]=a[n-1],[s,r]=a[n],l=Math.max(1,Math.ceil(Math.hypot(s-i,r-o)/e));for(let c=1;c<=l;c++)t.push([i+(s-i)*c/l,o+(r-o)*c/l])}return t}function k_(a){return a.map((e,t)=>{const n=a[Math.max(0,t-1)],i=a[Math.min(a.length-1,t+1)],o=i[0]-n[0],s=i[1]-n[1],r=Math.hypot(o,s)||1;return[e[0],e[1],-s/r,o/r]})}function wn(a,e,t,n){const i=(t-a.x0)/a.step,o=(n-a.z0)/a.step,s=Math.max(0,Math.min(a.nx-2,Math.floor(i))),r=Math.max(0,Math.min(a.nz-2,Math.floor(o))),l=je(i-s),c=je(o-r),h=r*a.nx+s;return(e[h]*(1-l)+e[h+1]*l)*(1-c)+(e[h+a.nx]*(1-l)+e[h+a.nx+1]*l)*c}function E_(a,e){const[t,n]=Rn(e),i=a.height,[o,s]=a.summit;let r=0;for(;r<60&&wn(i,i.h,o+t*r,s+n*r)>0;)r+=.1;return r}function T_(a,e,t,n,i){let o=0;for(let s=1;s<a.length;s++){const[r,l]=a[s-1],[c,h]=a[s],u=c-r,f=h-l,p=n*f-i*u;if(!p)continue;const v=((r-e)*f-(l-t)*u)/p,g=((r-e)*i-(l-t)*n)/p;v>0&&g>=0&&g<=1&&(o=Math.max(o,v))}return o}function wc(a,e){const t=(i,o)=>{let s=!1;for(let r=0,l=e.length-1;r<e.length;l=r++){const[c,h]=e[r],[u,f]=e[l];h>o!=f>o&&i<(u-c)*(o-h)/(f-h)+c&&(s=!s)}return s};return[[a.x0,a.z0],[a.x1,a.z0],[a.x0,a.z1],[a.x1,a.z1],[(a.x0+a.x1)/2,(a.z0+a.z1)/2]].some(([i,o])=>t(i,o))||e.some(([i,o])=>i>a.x0&&i<a.x1&&o>a.z0&&o<a.z1)}function Us(a,e){const t=Math.min(a.x1,e.x1)-Math.max(a.x0,e.x0),n=Math.min(a.z1,e.z1)-Math.max(a.z0,e.z0);return t>0&&n>0?t*n:0}function bc(a,e,t,n){const i=Math.max(a.x0-e,0,e-a.x1),o=Math.max(a.z0-t,0,t-a.z1),s=Math.hypot(i,o);return s<n?n-s:0}function A_(a,e,t){const n=parseInt(a.slice(1),16),i=parseInt(e.slice(1),16),o=s=>Math.round((n>>s&255)*(1-t)+(i>>s&255)*t);return`rgb(${o(16)}, ${o(8)}, ${o(0)})`}const Sc={letters:"abcdefghijklmnopqrstuvwxyz"},Po={vowels:"aeiouaeiouāēīōū",consonants:"hklmnpw"},P_={vowels:"aeiou",consonants:Po.consonants},R_={vowels:Po.vowels.toUpperCase(),consonants:Po.consonants.toUpperCase()},Oa=/[\p{L}ʻ]/u,Is=/[aeiouāēīōū]/iu,_i="—",Fs="var(--ink-3)",C_=10,ln={gone:.15,settled:.57},yc=[ln.gone,ln.settled-ln.gone,.3];class L_{constructor(e,t){this.root=e,this.canvas=t,this.ctx=t.getContext("2d"),this.measure=document.createElement("canvas").getContext("2d"),this.list=[],this.queue=[],this.dpr=1}resize(e,t,n){this.w=e,this.h=t,this.dpr=n,this.canvas.width=Math.round(e*n),this.canvas.height=Math.round(t*n)}has(e){return this.list.some(t=>t.pair===e&&!t.closing)}noted(){return new Set(this.list.filter(e=>!e.closing).map(e=>e.pair))}open(e,t){const n=document.createElement("div");n.className="card",n.innerHTML=`
      <div class="card-head"><span class="no"></span><span class="rule"></span><span class="field"></span><button class="card-x" type="button" aria-label="Close card"></button></div>
      <div class="card-word" lang="haw"><span class="k"></span><span class="sep"></span><span class="k"></span><i class="ring"></i></div>
      <div class="card-gloss"></div>
      <div class="card-parts">
        <div><b lang="haw"></b><span class="sense"></span><p class="pp"><span class="code"></span><i></i></p></div>
        <div><b lang="haw"></b><span class="sense"></span><p class="pp"><span class="code"></span><i></i></p></div>
      </div>
      <div class="card-cog"></div>
      <div class="card-hist">was <i style="color: ${Fs}">${_i}</i></div>`,this.root.appendChild(n);const i=p=>n.querySelector(p),o={pair:e,el:n,no:i(".no"),field:i(".field"),word:i(".card-word"),ks:[...n.querySelectorAll(".k")],sep:i(".sep"),gloss:i(".card-gloss"),parts:[...n.querySelectorAll(".card-parts > div")].map(p=>({el:p,stone:p.querySelector("b"),gloss:p.querySelector(".sense"),anc:p.querySelector(".pp"),code:p.querySelector(".code"),pp:p.querySelector(".pp i")})),cog:i(".card-cog"),hist:i(".card-hist"),hot:null,tweens:[],t0:t,closing:null,x:null,y:null,side:null,from:null,offset:null,moved:0,hiding:null,pulse:-10},{gloss:s,anc:r,code:l,pp:c}=o.parts[0];for(const p of o.parts)p.gloss.style.textOverflow=p.anc.style.textOverflow="clip";o.room=o.word.clientWidth||200,o.wordPx=parseFloat(getComputedStyle(o.word).getPropertyValue("--word"))||36,o.glossRoom=o.gloss.clientWidth||200,o.glossFace=Ta(o.gloss),o.glossLine=parseFloat(getComputedStyle(o.gloss).lineHeight)||20,o.senseRoom=s.clientWidth||90,o.senseFace=Ta(s),o.senseTwo=s.getBoundingClientRect().height+r.getBoundingClientRect().height,o.ppFace=Ta(c);const h=getComputedStyle(l);o.codeFace={font:`normal small-caps ${h.fontWeight} ${h.fontSize} ${h.fontFamily}`,track:parseFloat(h.letterSpacing)||0,gap:parseFloat(h.marginRight)||0},o.cogRoom=o.cog.clientWidth||200,o.cogFace=Ta(o.cog),o.histRoom=o.hist.clientWidth,o.histFace=Ta(o.hist),o.histWordFace=Ta(o.hist.querySelector("i"));const u=e.entry,f=e.history.at(-1);return o.hot=f?f.a!==u.a?0:1:z_(u),this.fill(o,u,f),o.no.textContent=`No. ${String(e.id+1).padStart(3,"0")}`,this.list.push(o),this.queue.push({at:t+.32,run:()=>o.closing||n.classList.add("open")}),o}close(e,t){e.closing||(e.closing=t,e.el.classList.remove("open"))}fill(e,t,n){const i=kc(t);this.setWord(e,i,t),this.setSize(e,this.fit(e,i,t)),e.gloss.textContent=t.gloss,this.setField(e,t);for(const o of[0,1])this.setPart(e,o,o?t.b:t.a);e.parts.forEach((o,s)=>o.el.classList.toggle("hot",s===e.hot)),e.cogs=this.cognates(e,t,e.hot),e.cog.textContent=di(e.cogs),this.setHist(e,n)}setField(e,t){const n=pi[t.field];e.field.innerHTML=`<i lang="haw">${co(n.label)}</i><span class="dot">·</span><span class="sc">${co(n.en)}</span>`}setPart(e,t,n){e.parts[t].stone.textContent=Da(n),this.setAncestor(e,e.parts[t],n),this.setSense(e,e.parts[t],n)}setAncestor(e,t,n){const{code:i,form:o}=N_(n);t.code.textContent=i,t.pp.textContent=o;const s=this.measure;s.font=e.codeFace.font;let r=i?s.measureText(i.toLowerCase()).width+i.length*e.codeFace.track+e.codeFace.gap:0;s.font=e.ppFace.font,r+=s.measureText(o).width;const l=Math.min(1,(e.senseRoom-1)/r);t.anc.style.fontSize=l<1?`${(e.ppFace.px*l).toFixed(2)}px`:""}setSense(e,t,n){const i=this.sense(e,n);t.gloss.textContent=i.text,t.gloss.style.color=zt[n].g?"":Fs,t.gloss.style.whiteSpace=i.two?"pre":"",t.gloss.style.lineHeight=i.two?`${(e.senseTwo/2).toFixed(2)}px`:"",t.anc.style.display=i.two?"none":"",this.senseScale(e,t,i.scale)}sense(e,t){const{g:n,pp:i}=zt[t];if(!n)return{text:_i,scale:1};const o=this.measure,s=e.senseRoom-1;if(o.font=e.senseFace.font,!i&&o.measureText(n).width>s){const r=B_(o,n,s);if(r)return{text:r,scale:1,two:!0}}return ar(o,n,s,.9)}senseScale(e,t,n){t.gloss.style.fontSize=n<1?`${(e.senseFace.px*n).toFixed(2)}px`:""}width(e,t){return this.measure.font=e.font,this.measure.measureText(t).width}setWord(e,t,n){e.ks[0].textContent=t.a,e.ks[1].textContent=t.b,e.sep.textContent=t.sep,e.word.classList.toggle("pending",n.ev==="pending")}setHist(e,t){if(!t){e.hist.innerHTML=`was <i style="color: ${Fs}">${_i}</i>`;return}const n=t.ev==="pending",i=this.measure;i.font=e.histWordFace.font;let o=e.histRoom-1-i.measureText(t.word).width-(n?C_:0);i.font=e.histFace.font,o-=i.measureText("was  ").width;const s=o>0?ar(i,t.gloss,o).text:"";e.hist.innerHTML=`was <i lang="haw">${co(t.word)}</i>${n?'<i class="ring"></i>':""}${s?` ${co(s)}`:""}`}fit(e,t,n){const i=this.measure;i.font=gt(100,{weight:600});const o=[i.measureText(t.a).width/100,i.measureText(t.b).width/100];i.font=gt(100);const s=o[0]+o[1]+i.measureText(t.sep).width/100+(n.ev==="pending"?.36:0);return{ems:o,px:Math.min(e.wordPx,(e.room-2)/s)}}setSize(e,t){e.size=t,e.ks.forEach((n,i)=>n.style.width=`${t.ems[i].toFixed(3)}em`),e.word.style.fontSize=`${t.px.toFixed(2)}px`}cognates(e,t,n){const i=[];this.measure.font=e.cogFace.font;for(const o of zt[n?t.b:t.a].cog){if(i.length&&this.measure.measureText(di([...i,o])).width>e.cogRoom)break;i.push(o)}return i}turn(e,t,n,i){const o=this.list.find(s=>s.pair===e&&!s.closing);o&&this.queue.push({at:i,run:()=>this.startTurn(o,t,n,e.entry,i)})}startTurn(e,t,n,i,o){for(const x of e.tweens)V_(x);const s=kc(i),r=this.fit(e,s,i),l=[W_(e,t,e.size,r,o,()=>this.setWord(e,s,i))];e.size=r,e.pulse=o;const c=t?i.b:i.a,h=t?n.b:n.a,u=e.parts[t],f=this.cognates(e,i,t),p=[n.gloss,i.gloss].some(x=>this.width(e.glossFace,x)>e.glossRoom+.5);e.gloss.style.minHeight=p?`${2*e.glossLine}px`:"",e.gloss.style.whiteSpace=p?"":"nowrap",l.push(Os(e.gloss,o+.1,.7,Ec(n.gloss,i.gloss),()=>{e.gloss.style.minHeight="",e.gloss.style.whiteSpace=""}),Os(u.stone,o+ln.gone,ln.settled-ln.gone,X_(Da(h),Da(c),R_)));const v=this.sense(e,h),g=this.sense(e,c);zt[h].g&&zt[c].g&&!v.two&&!g.two?(this.senseScale(e,u,Math.min(v.scale,g.scale)),l.push(Os(u.gloss,o+ln.gone,.5,Ec(v.text,g.text),()=>this.setSense(e,u,c)))):v.text!==g.text&&l.push(fo(u.gloss,o,yc,()=>this.setSense(e,u,c))),zt[h].pp!==zt[c].pp&&l.push(fo(u.anc,o,yc,()=>this.setAncestor(e,u,c)));const m=()=>{e.hot=t,e.parts.forEach((x,_)=>x.el.classList.toggle("hot",_===t))};e.hot!==t||di(e.cogs)!==di(f)?(l.push(q_(e.cog,o,f)),this.queue.push({at:o+ln.gone,run:m})):m(),e.cogs=f;const d=[.15,xo.dur/2-.25];n.field!==i.field&&l.push(fo(e.field,o+.1,[...d,.3],()=>this.setField(e,i))),l.push(fo(e.hist,o+.1,[...d,.35],()=>this.setHist(e,n))),e.tweens=l}update(e,t,n,i){for(let s;(s=this.queue.filter(r=>r.at<=t)).length;){this.queue=this.queue.filter(r=>r.at>t);for(const r of s)r.run()}const o=this.list.map(s=>[s.el.offsetWidth||236,s.el.offsetHeight||180]);this.list.forEach((s,r)=>{const l=s.pair;[s.ax,s.ay]=e.project(l.x,1,l.z),s.marks=F_(e,l);const[c,h]=o[r];s.w=c,s.hMax=Math.max(s.hMax??0,h),s.hs=s.hs==null?h:s.hs+(s.hMax-s.hs)*(1-Math.exp(-n*6));const u=Math.max(70,s.marks.y+s.marks.h-s.ay+8),f=Math.max(s.marks.x+s.marks.w-s.ax,s.ax-s.marks.x)+16;s.offsets=I_(c,s.hs,u,f)}),this.place(this.list.filter(s=>!s.closing||!s.side),t,i);for(const s of this.list){const r=oa(je((t-s.moved)/$t.glide)),l=s.offsets[s.side];s.offset=[s.from[0]+(l[0]-s.from[0])*r,s.from[1]+(l[1]-s.from[1])*r],s.east=s.fromEast+(zs(s.side)-s.fromEast)*r,s.x=uo(s.ax+s.offset[0],8,this.w-s.w-8),s.y=uo(s.ay+s.offset[1],8,this.h-s.hs-8),s.el.style.transform=`translate3d(${s.x.toFixed(1)}px, ${s.y.toFixed(1)}px, 0)`;for(const c of s.tweens)H_(c,t)}for(const s of this.list)s.closing&&t-s.closing>=.9&&s.el.remove();this.list=this.list.filter(s=>!s.closing||t-s.closing<.9),this.draw(t)}place(e,t,n){const i=(p,v)=>({x:uo(p.ax+p.offsets[v][0],8,this.w-p.w-8),y:uo(p.ay+p.offsets[v][1],8,this.h-p.hs-8),w:p.w,h:p.hs}),o=(p,v)=>n.reduce((g,m)=>g+ci(v,m),ci(v,p.marks)*2),s=p=>p.hiding!=null&&t-p.hiding>$t.wait;let r=!1;for(const p of e)if(!p.side)r=!0;else if(t-p.moved>=$t.glide){const v=i(p,p.side);let g=o(p,v);for(const m of e)m!==p&&m.side&&(g+=ci(v,i(m,m.side),$t.air));p.hiding=g>v.w*v.h*$t.cover?p.hiding??t:null,s(p)&&(r=!0)}if(!r)return;const l=e.map(p=>{const v=e.filter(m=>m.t0>p.t0).length,g=(s(p)?$t.move:$t.room)+$t.age*v;return(!p.side||t-p.moved>=$t.glide?D_:[p.side]).map(m=>{const d=i(p,m);let x=o(p,d)*3;for(const _ of e)_!==p&&(x+=ci(d,_.marks)*2);return x+=(Math.abs(d.x-p.ax-p.offsets[m][0])*d.h+Math.abs(d.y-p.ay-p.offsets[m][1])*d.w)/2,!Oh.includes(m)&&this.h>=U_&&(x+=d.w*d.h*$t.aside),p.side&&m!==p.side&&(x+=d.w*d.h*g),{side:m,b:d,c:x}})});let c=null,h=1/0;const u=[],f=(p,v)=>{if(!(v>=h)){if(p===e.length){c=[...u],h=v;return}for(const g of l[p]){let m=v+g.c;for(let d=0;d<p;d++)m+=ci(g.b,u[d].b,$t.air)*3;u[p]=g,f(p+1,m)}}};f(0,0),e.forEach((p,v)=>c[v].side!==p.side&&this.move(p,c[v].side,t))}move(e,t,n){e.from=e.offset??e.offsets[t],e.fromEast=e.east??zs(t),e.side=t,e.moved=n,e.hiding=null,e.el.classList.toggle("from-right",!zs(t))}draw(e){const t=this.ctx;t.setTransform(1,0,0,1,0,0),t.clearRect(0,0,this.canvas.width,this.canvas.height),t.setTransform(this.dpr,0,0,this.dpr,0,0),t.lineCap="round",t.lineJoin="round";for(const n of this.list){const{ax:i,ay:o}=n,s=n.x+n.w*(1-n.east),r=s>=i?1:-1,l=n.y+34,c=l-o;let h=i+r*Math.abs(c);r*(h-s)>-12&&(h=s-r*12);const u=[[i,o],[h,l],[s,l]];let f=oa(je((e-n.t0)/.38));if(n.closing&&(f=Math.min(f,1-oa(je((e-n.closing-.4)/.35)))),f<=0)continue;const p=[Math.hypot(u[1][0]-u[0][0],u[1][1]-u[0][1]),Math.abs(u[2][0]-u[1][0])];let v=(p[0]+p[1])*f;t.beginPath(),t.moveTo(i,o);for(let d=0;d<2&&v>0;d++){const x=Math.min(1,v/(p[d]||1));t.lineTo(u[d][0]+(u[d+1][0]-u[d][0])*x,u[d][1]+(u[d+1][1]-u[d][1])*x),v-=p[d]}t.strokeStyle=Mt,t.lineWidth=1,t.stroke();const g=ot(je(f*3));t.beginPath(),t.arc(i,o,3.2*g,0,Math.PI*2),t.fillStyle=Mt,t.fill(),t.beginPath(),t.arc(i,o,7*g,0,Math.PI*2),t.strokeStyle=Mt,t.stroke();const m=(e-n.pulse)/.9;m>=0&&m<1&&(t.beginPath(),t.arc(i,o,7+26*ot(m),0,Math.PI*2),t.globalAlpha=1-m,t.stroke(),t.globalAlpha=1),f>=1&&!n.closing&&(t.beginPath(),t.arc(s,l,2.4,0,Math.PI*2),t.fillStyle=Dh,t.fill(),t.stroke())}}}function kc(a){const e=a.word,t=li(zt[a.a].s).length;if(li(e).replace(/ /g,"")===li(zt[a.a].s)+li(zt[a.b].s)){let n=0,i=0;for(;n<t;)li(e[i++])&&e[i-1]!==" "&&n++;const o=e.slice(i);return o[0]===" "?{a:e.slice(0,i),sep:" ",b:o.slice(1)}:{a:e.slice(0,i),sep:"·",b:o}}return{a:e,sep:"",b:""}}function N_(a){const e=zt[a].pp,t=e.match(/^(\S+) (\*.*)$/);return t?{code:t[1],form:t[2]}:{code:"",form:e}}function li(a){return a.toLowerCase().normalize("NFD").replace(/[\p{M}ʻ]/gu,"")}function co(a){return a.replace(/[&<>"]/g,e=>`&${{"&":"amp","<":"lt",">":"gt",'"':"quot"}[e]};`)}const Oh=["ne","nw","se","sw"],D_=[...Oh,"e","w"],U_=520,zs=a=>a.endsWith("e")?1:0,ho=44,$t={cover:.02,wait:.25,move:.05,room:.12,age:.02,glide:.6,air:6,aside:.05};function I_(a,e,t,n){return{ne:[ho,-64-e],nw:[-ho-a,-64-e],se:[ho,t],sw:[-ho-a,t],e:[n,-74],w:[-n-a,-74]}}function F_(a,e){const{hx:t,hz:n}=Bn.slabs,i=[a.project(e.x-t,1,e.z-n),a.project(e.x+t,1,e.z-n),a.project(e.x-t,0,e.z+bi),a.project(e.x+t,0,e.z+bi)],o=i.map(c=>c[0]),s=i.map(c=>c[1]),r=Math.min(...o),l=Math.min(...s);return{x:r,y:l,w:Math.max(...o)-r,h:Math.max(...s)-l}}function ci(a,e,t=0){const n=Math.min(a.x+a.w,e.x+e.w+t)-Math.max(a.x,e.x-t),i=Math.min(a.y+a.h,e.y+e.h+t)-Math.max(a.y,e.y-t);return Math.max(0,n)*Math.max(0,i)}const uo=(a,e,t)=>Math.max(e,Math.min(t,a));function di(a){return a.length?a.map(([e,t])=>`${e} ${t}`).join(" · "):_i}function Ta(a){const e=getComputedStyle(a);return{font:`${e.fontStyle} ${e.fontWeight} ${e.fontSize} ${e.fontFamily}`,px:parseFloat(e.fontSize)}}function z_(a){const e=t=>(zt[t?a.b:a.a].cog.length?1e3:0)+Cn(a,t).length;return e(1)>e(0)?1:0}const O_=/^(a|an|and|as|at|by|for|from|in|into|of|on|or|the|to|with)$/i;function ar(a,e,t,n=1){const i=h=>a.measureText(h).width<=t;if(i(e))return{text:e,scale:1};const[o,...s]=G_(e);let r=o;for(const h of s){if(!i(r+h))break;r+=h}if(i(r))return{text:r,scale:1};const l=t/a.measureText(r).width;if(l>=n)return{text:r,scale:l};const c=r.split(" ");for(let h=c.length-1;h>1;h--){const u=c.slice(0,h).join(" ");if(O_.test(c[h-1])||u.split("(").length!==u.split(")").length)continue;const f=`${u.replace(/[,;:(]+$/,"")}…`;if(i(f))return{text:f,scale:1}}return{text:`${c[0]}…`,scale:1}}function B_(a,e,t){const n=e.split(" "),i=s=>a.measureText(s).width<=t;if(!i(n[0]))return null;let o=1;for(;o<n.length&&i(n.slice(0,o+1).join(" "));)o++;return`${n.slice(0,o).join(" ")}
${ar(a,n.slice(o).join(" "),t).text}`}function G_(a){const e=[""];let t=0;for(let n=0;n<a.length;n++){const i=a[n];t+=i==="("?1:i===")"?-1:0,!t&&(i===","||i===";")&&a[n+1]===" "&&e.push(""),e[e.length-1]+=i}return e}function H_(a,e){const t=(e-a.t0)/a.dur;a.done||t<0||(a.step(Math.min(1,t)),a.done=t>=1)}function V_(a){a.done||(a.step(1),a.done=!0)}function Os(a,e,t,n,i){return{t0:e,dur:t,step(o){a.textContent=o<1?$_(n,o):n.text,o>=1&&(i==null||i())}}}const xo={dur:.62,glide:.6};function W_(a,e,t,n,i,o){const s=a.ks[e];let r=!1;return{t0:i,dur:xo.dur,step(l){const c=oa(je(l*xo.dur/xo.glide));a.word.style.fontSize=`${(t.px+(n.px-t.px)*c).toFixed(2)}px`,a.ks.forEach((f,p)=>{f.style.width=`${(t.ems[p]+(n.ems[p]-t.ems[p])*c).toFixed(3)}em`,f.style.clipPath=l<1?"inset(-0.4em -0.03em)":""});const h=l>=.5;h&&!r&&(r=!0,o());const u=oa(h?l*2-1:l*2);s.style.transform=l<1?`rotateX(${h?90*(1-u):-90*u}deg)`:"",s.style.opacity=l<1?String(h?.2+.8*u:1-.8*u):""}}}function fo(a,e,[t,n,i],o){const s=t+n+i;let r=!1;return{t0:e,dur:s,step(l){const c=l*s;c>=t&&!r&&(r=!0,o()),a.style.opacity=l>=1?"":String(c<t?1-ot(c/t):ot(je((c-t-n)/i)))}}}const Aa={in:.6,each:.3,step:.14};function q_(a,e,t){const n=t.length?t.map(([s,r],l)=>`${l?" · ":""}${s} ${r}`):[_i],i=Aa.in+(n.length-1)*Aa.step+Aa.each;let o=null;return{t0:e,dur:i,step(s){const r=s*i;s>=1?(a.style.opacity="",a.textContent=di(t)):r<ln.gone?a.style.opacity=String(1-ot(r/ln.gone)):(o||(a.textContent="",a.style.opacity="",o=n.map(l=>a.appendChild(Object.assign(document.createElement("span"),{textContent:l})))),o.forEach((l,c)=>l.style.opacity=String(ot(je((r-Aa.in-c*Aa.step)/Aa.each)))))}}}function X_(a,e,t){const n=Math.max([...a].length,[...e].length);return{from:[...a],to:[...e],sets:Array(n).fill(t),text:e}}function Ec(a,e){const t=[...a],n=[...e],i=Tc(t),o=Tc(n),s=t.indexOf(" ",n.length),r=Oa.test(n.at(-1)??"")?s<0?t.length:s:n.length,l=Array.from({length:Math.max(t.length,n.length)},(c,h)=>h<n.length?o[h]:h<r?o[n.length-1]:i[h]);return{from:t,to:n,sets:l,text:e}}const Y_=/[ʻāēīōū]/iu,j_=/^(?:[hklmnpw]?[aeiou])+$/i;function Tc(a){const e=a.map(()=>Sc);for(let t=0;t<a.length;t++){if(!Oa.test(a[t]))continue;let n=t;for(;n<a.length&&Oa.test(a[n]);)n++;const i=a.slice(t,n);e.fill(i.some(o=>Y_.test(o))?Po:j_.test(i.join(""))?P_:Sc,t,n),t=n}return e}function $_({from:a,to:e,sets:t},n){var h;const i=Math.max(a.length,e.length),o=u=>u/i*.75+.2;let s=Math.round(a.length+(e.length-a.length)*Math.min(1,n*1.6));for(;s<e.length&&n>=o(Math.max(0,s-1));)s++;const r=[];for(let u=0;u<s;u++)n>=o(u)||a[u]===e[u]?r.push(e[u]??""):a[u]===" "||e[u]!==void 0&&!Oa.test(e[u])?r.push(e[u]??" "):r.push(null);const l=s-1;(h=t[l])!=null&&h.vowels&&n<o(l)&&Oa.test(r[l]??"")&&!Is.test(r[l])&&(r[l]=null);let c="";for(let u=0;u<s;u++){if(r[u]!=null){c+=r[u];continue}const f=t[u];let p=f.letters;if(f.vowels){const v=r.slice(u+1).find(_=>_!==""),g=c.at(-1)??"",m=Oa.test(g)&&!Is.test(g),d=u+1<s&&r[u+1]===null&&e[u+1]==="ʻ";p=m||v===void 0||d||v!==null&&!Is.test(v)||e[u]!=="ʻ"&&Math.random()<.5?f.vowels:f.consonants}p=[...p].filter(v=>v!==a[u]&&v!==e[u]).join(""),c+=p[Math.floor(Math.random()*p.length)]}return c}const Bs=.86,K_=.15,Ac={wait:15,rest:40},Z_=180,J_=10;class Q_{constructor({board:e,scene:t,links:n,notes:i,ripples:o}){this.board=e,this.scene=t,this.links=n,this.notes=i,this.ripples=o,this.paused=!1,this.manual=!1,this.meta=new WeakMap,this.carded=new Map}start(e){this.t0=e,this.nextBackground=e+3.6,this.nextNoteCheck=e+1.7}setManual(e,t){if(e!==this.manual){if(this.manual=e,e){for(const n of this.notes.list)n.closing||this.closeNote(n,t);return}for(const n of this.notes.list)n.closing||this.meta.set(n,{nextTurn:t+1.6,turnsLeft:1});this.nextBackground=Math.max(this.nextBackground,t+1.5),this.nextNoteCheck=Math.max(this.nextNoteCheck,t+.9)}}capacity(){const{w:e,h:t}=this.scene,n=e<520?1:e<700?2:e<1440?3:4;return t<520?Math.min(n,1):t<700?Math.min(n,2):n}inView(e=.1){const{w:t,h:n}=this.scene;return this.board.pairs.filter(i=>{const[o,s]=this.scene.project(i.x,.5,i.z);return o>t*e&&o<t*(1-e)&&s>n*(e+.06)&&s<n*(1-e-.04)})}linkedInView(){const e=this.inView();if(!e.length)return;const t=this.board.linkedPairs();return e.filter(n=>t.has(n.id)).length/e.length}rolling(e){return e.tiles.some(t=>this.scene.block(t).roll||this.scene.block(t).drop)}turnPair(e,t,n=null){if(this.rolling(e))return!1;const i=this.board.chooseTurn(e,n==null?t:1/0,this.linkedInView(),n);if(!i)return!1;const o=e.entry,s=e.tiles[i.index];this.board.turn(e,i,t);const r=t+.12,l=this.scene.block(s).turn(s.stone,r,Bs),c=e.entry,h=e.caption;e.caption={prev1:h.text1,prev2:h.text2,text1:c.word.toUpperCase(),text2:c.gloss,t0:r+Bs*.62},this.notes.turn(e,i.index,o,r+Bs*.32),this.ripples.push({x:s.x,z:s.z,t0:l-.1,dur:.95});const u=f=>this.scene.block(f).landsAt();return this.links.sync(this.board.desiredLinks(),t,{origin:s.id,holdUntil:f=>f.kind==="pair"?Math.max(u(f.a),u(f.b)):Math.max(...f.pair.tiles.map(u))}),!0}openNote(e,t){const n=this.notes.open(e,t);return this.meta.set(n,{nextTurn:t+1.15,turnsLeft:2}),n}closeNote(e,t){this.notes.close(e,t),this.carded.set(e.pair,t)}poke(e,t){if(!this.board.canTurn(e,t))return;this.notes.has(e)||(this.makeRoom(t),this.openNote(e,t));const n=this.notes.list.find(i=>i.pair===e&&!i.closing);if(n){const i=this.meta.get(n);i.nextTurn=t+4.5,i.turnsLeft=Math.max(i.turnsLeft,1)}this.turnPair(e,t)}makeRoom(e){const t=this.notes.list.filter(n=>!n.closing);t.length>=this.capacity()&&this.closeNote(t[0],e)}press(e,t){const n=this.board.pairs[e.pair];this.notes.has(n)?!this.rolling(n)&&!this.turnPair(n,t,e.index)&&this.scene.block(e).nudge(t):(this.makeRoom(t),this.openNote(n,t))}update(e){if(this.ripples.splice(0,this.ripples.length,...this.ripples.filter(i=>e-i.t0<i.dur)),this.paused)return;const t=this.inView(),n=new Set(this.inView(-.05));for(const i of this.notes.list){if(i.closing)continue;const o=this.meta.get(i);if(!n.has(i.pair)){this.closeNote(i,e);continue}this.manual||e<o.nextTurn||(o.turnsLeft>0?this.turnPair(i.pair,e)?(o.turnsLeft--,o.nextTurn=e+(o.turnsLeft>0?4.2+Math.random()*1.6:3.4)):(o.nextTurn=e+.6,this.rolling(i.pair)||(o.turnsLeft=0)):this.closeNote(i,e))}if(!this.manual){if(e>=this.nextNoteCheck){this.nextNoteCheck=e+.45;const i=this.notes.list.filter(o=>!o.closing);if(i.length<this.capacity()){const o=this.pickForNote(t,i,e);o&&(this.openNote(o,e),this.nextNoteCheck=e+.9+Math.random()*.8)}}if(e>=this.nextBackground){const i=this.notes.noted(),o=t.filter(s=>!i.has(s)&&!this.rolling(s)&&e-s.turnedAt>6&&this.board.canTurn(s,e)&&!this.recalls(s,e));o.length&&this.turnPair(o[Math.floor(Math.random()*o.length)],e),this.nextBackground=e+(1.5+Math.random()*1.1)*Math.max(1,J_/Math.max(1,t.length))}}}recalls(e,t){const n=this.carded.get(e);return n==null||t-n>Z_||e.turnedAt>n?!1:this.board.targets(e,t).every(i=>i.tier===2)}pickForNote(e,t,n){const i=new Set(this.inView(K_)),o=t.map(l=>this.scene.project(l.pair.x,1,l.pair.z));let s=null,r=-1/0;for(const l of e){if(!i.has(l)||this.notes.has(l)||this.rolling(l)||!this.board.canTurnTwice(l,n))continue;const c=n-(this.carded.get(l)??-1/0);if(c<Ac.wait)continue;const[h,u]=this.scene.project(l.x,1,l.z);let f=1/0;for(const[v,g]of o)f=Math.min(f,Math.hypot(v-h,g-u));let p=Math.min(f,420)+Math.random()*160-(n-l.turnedAt<4?300:0);c<Ac.rest&&(p-=600),this.board.targets(l,n).some(v=>v.tier===0)||(p-=1e3),p>r&&(s=l,r=p)}return s}}const po={x:(tn.x0+tn.x1)/2,z:(tn.z0+tn.z1)/2},Ro={x:(tn.x1-tn.x0)/2,z:(tn.z1-tn.z0)/2},Pc={x:6,z:4},Co={x:Math.max(0,Ro.x-Pc.x),z:Math.max(0,Ro.z-Pc.z)},Rc=.4,Lo={x:Math.min(Rc,Co.x/3.9),z:Math.min(Rc,Co.z/1.8)},Ya={x:3.9*Lo.x,z:1.8*Lo.z},Cc={x:Ro.x-cn.w/2+Ga.x,z:Ro.z-cn.h/2+Ga.z},Lc=2,ex=1,Nc={x:2,z:1.5},tx=330,nx=.18,Dc={least:45,speed:.15},ax=.8,ix=.2,Uc={x:.4,y:.35},Bh=55,Gh=(a,e)=>Math.max(34,Math.min(60,Math.min(a,e)/17));function Hh(a,e){const t=Gh(a,e),n={x:Uc.x*a/t,z:Uc.y*e/t/Math.sin(Bh*Math.PI/180)},i=Math.max(Nc.x,Cc.x+Lc-n.x),o=Math.max(Nc.z,Cc.z+Lc-n.z),s=Math.min(ex,i,o),r=4*(i+o-2*s)+2*Math.PI*s,l=i-n.x>Ya.x&&o-n.z>Ya.z;return{a:i,b:o,r:s,length:r,lap:Math.max(tx,r/nx),inner:l?ax*Math.max(n.x/i,n.z/o):1,open:Math.max(Dc.least,1.5*o/Dc.speed)}}function Vh(a){return{x:Math.max(Co.x,a.a+Ya.x),z:Math.max(Co.z,a.b+Ya.z)}}function Ic(a,e){const t=Hh(a,e),n=Vh(t);return{x:n.x+t.a+Ya.x,z:n.z+t.b+Ya.z}}const Na=(a,e,t)=>Math.max(e-t,Math.min(e+t,a)),Fc=[[1,-1],[1,1],[-1,1],[-1,-1]];function ox(a,{a:e,b:t,r:n,length:i}){const o=e-n,s=t-n,r=Math.PI/2*n;let l=((a-Math.floor(a))*i+o)%i;for(let c=0;c<4;c++){const h=Fc[c][0]*o,u=Fc[c][1]*s,f=(c-1)*Math.PI/2,p=c%2?2*s:2*o;if(l<p){const v=p-l;return[h+n*Math.cos(f)+v*Math.sin(f),u+n*Math.sin(f)-v*Math.cos(f)]}if(l-=p,l<r)return[h+n*Math.cos(f+l/n),u+n*Math.sin(f+l/n)];l-=r}return[-o,-t]}function sx(a){const e=Math.round(a),t=ot(je((a-e)/ix+.5));return e%2?t:e>0?1-t:0}function rx(a,e,t,n,i={dx:0,dz:0,zoom:1}){const o=(f,p=0)=>Math.sin(e/f*Math.PI*2+p),s=Hh(t,n),r=Vh(s),l=e/s.lap,[c,h]=ox(l,s),u=ot(Math.min(1,e/s.open))*(1-(1-s.inner)*sx(l));return a.ppu=Gh(t,n)*i.zoom*(1+.035*o(53)),a.tx=Na(po.x+u*c+Lo.x*(2.5*o(97)+1.4*o(41))+i.dx,po.x,r.x),a.tz=Na(po.z+u*h+Lo.z*1.8*o(83,1)+i.dz,po.z,r.z),a.yaw=(-3+5*o(120))*Math.PI/180,a.pitch=(Bh+2.5*o(71))*Math.PI/180,a}const Ht=a=>document.getElementById(a),lx=Number(new URLSearchParams(location.search).get("slow"))||1,An=()=>performance.now()/1e3/lx,cx=matchMedia("(prefers-reduced-motion: reduce)").matches;async function hx(){const a="Pōhaku ʻāina";await Promise.all([document.fonts.load(`400 16px ${vo}`,a),document.fonts.load(`italic 400 16px ${vo}`,a),document.fonts.load(`600 16px ${vo}`,a)]).catch(()=>{});const e=new URLSearchParams(location.search),t=Number(e.get("seed"))||1031,n=new rf(t),i=new Kv(Ht("gl")),o=new S_(Ht("floor")),s=new L_(Ht("cards"),Ht("hud")),r=new x_,l=[],c={tx:0,tz:0,yaw:0,pitch:1,ppu:50},h={dx:0,dz:0,zoom:1},u=new Q_({board:n,scene:i,links:r,notes:s,ripples:l});let f=[];function p(){f=["title","mode","legend","stats"].map(L=>{const C=Ht(L).getBoundingClientRect();return{x:C.left-12,y:C.top-12,w:C.width+24,h:C.height+24}})}function v(){const L=innerWidth,C=innerHeight,B=Math.min(devicePixelRatio||1,2);i.setSize(L,C,B),o.resize(L,C,B),s.resize(L,C,B),p();const H=Ic(L,C);h.dx=Na(h.dx,0,H.x),h.dz=Na(h.dz,0,H.z)}addEventListener("resize",v),v();const g=n.island.compass,m=()=>{let L=1/0,C=1/0,B=-1/0,H=-1/0;for(let Q=0;Q<16;Q++){const ee=Q/16*Math.PI*2,[ae,de]=i.project(g.x+Math.cos(ee)*g.r,0,g.z+Math.sin(ee)*g.r);L=Math.min(L,ae),C=Math.min(C,de),B=Math.max(B,ae),H=Math.max(H,de)}return{x:L,y:C,w:B-L,h:H-C}};let d=0,x=null;function _(L){x!=null&&!u.manual&&(d+=L-x),x=L,rx(c,cx?0:d,innerWidth,innerHeight,h)}const w=An();_(w),i.setView(c);const E=w+xt.stones;for(const L of n.pairs){const C=Math.hypot(L.x-c.tx,L.z-c.tz),B=E+C*.035+Math.random()*.12;for(const Q of L.tiles)i.addTile(Q).dropIn(B+Q.index*.06);const H=L.entry;L.caption={prev1:"",prev2:"",text1:H.word.toUpperCase(),text2:H.gloss,t0:B+1}}const k=L=>{const C=L.kind==="pair"?[L.a,L.b]:L.pair.tiles;return Math.max(...C.map(B=>i.block(B).drop.t0+i.block(B).drop.dur))+.1},T=[...n.desiredLinks()].sort(([,L],[,C])=>k(L)-k(C));r.sync(new Map(T),w,{holdUntil:k});const S=[...r.links.values()];u.start(E-.15);const M=Ht("mode"),b=Ht("keys"),D={auto:b.textContent,manual:"drag · scroll · click: card, then turn"};function N(L){u.setManual(L,An()),document.body.classList.toggle("manual",L),M.setAttribute("aria-pressed",String(L)),b.textContent=L?D.manual:D.auto,p();try{const C=new URL(location.href);L?C.searchParams.set("manual","1"):C.searchParams.delete("manual"),history.replaceState(history.state,"",C)}catch{}}M.addEventListener("click",L=>{N(!u.manual),L.detail&&M.blur()}),e.has("manual")&&e.get("manual")!=="0"&&N(!0);const V=Ht("stage");let R=null;V.addEventListener("pointerdown",L=>{R={x:L.clientX,y:L.clientY,moved:0,id:L.pointerId},V.setPointerCapture(L.pointerId)}),V.addEventListener("pointermove",L=>{if(!R)return;const C=L.clientX-R.x,B=L.clientY-R.y;R.moved+=Math.abs(C)+Math.abs(B),R.x=L.clientX,R.y=L.clientY,R.moved>4&&V.classList.add("dragging");const[H,Q,ee,ae]=i.floorAffine(),de=H*ae-Q*ee,fe=Ic(innerWidth,innerHeight);h.dx=Na(h.dx-(ae*C-ee*B)/de,0,fe.x),h.dz=Na(h.dz-(-Q*C+H*B)/de,0,fe.z)});const U=L=>{if(R){if(R.moved<5){const C=i.pick(L.clientX,L.clientY);C&&u.manual?u.press(C,An()):C&&u.poke(n.pairs[C.pair],An())}R=null,V.classList.remove("dragging")}};V.addEventListener("pointerup",U),V.addEventListener("pointercancel",()=>{R=null,V.classList.remove("dragging")}),V.addEventListener("wheel",L=>{L.preventDefault(),h.zoom=Math.max(.6,Math.min(1.9,h.zoom*Math.exp(-L.deltaY*.0012)))},{passive:!1});const z=Ht("cards");z.addEventListener("pointerdown",L=>L.stopPropagation()),z.addEventListener("click",L=>{const C=L.target.closest(".card-x"),B=C&&s.list.find(H=>H.el.contains(C));B&&!B.closing&&u.closeNote(B,An())}),addEventListener("keydown",L=>{var C,B;if(L.code==="Space"){if((B=(C=L.target).closest)!=null&&B.call(C,"button"))return;L.preventDefault(),u.paused=!u.paused}else if(L.code==="KeyM"&&!(L.ctrlKey||L.metaKey||L.altKey))N(!u.manual);else if(L.code==="Escape"&&u.manual)for(const H of s.list)H.closing||u.closeNote(H,An())});const Z={turns:Ht("st-turns"),links:Ht("st-links"),pairs:Ht("st-pairs")};Z.pairs.textContent=String(n.pairs.length);let G=An(),O=!1,q=!1;function W(){const L=An(),C=Math.min(.1,L-G);G=L,_(L),i.setView(c),u.update(L),r.update(L),i.update(L),i.render(),o.draw({A:i.floorAffine(),board:n,links:r,ripples:l,now:L,intro:L-w,noted:s.noted()}),s.update(i,L,C,[...f,m()]),Z.turns.textContent=String(n.turnCount).padStart(4,"0"),Z.links.textContent=String(r.count()).padStart(2,"0"),O||(O=!0,document.body.classList.add("ready")),!q&&S.every(B=>B.p>=1||B.to===0)&&s.list.some(B=>B.el.classList.contains("open"))&&(q=!0,document.body.classList.add("opened")),requestAnimationFrame(W)}requestAnimationFrame(W)}hx();
