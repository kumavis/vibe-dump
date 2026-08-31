// ---------------------------------------------------------------------------
// The bill of materials
//
// Every functional component in this project is a product somebody can order.
// Custom fabrication is allowed for exactly two things — the plywood and
// aluminium framing, and the hinges — because those are what a fabricator makes
// anyway. Everything else (the speakers, the griddle, the water tanks, the
// slides, the jacks, the masts, the gas struts) is a catalogue part with a model
// number, a price and a shop in Tokyo that stocks it.
//
// THIS FILE IS ALSO THE DIMENSION SOURCE. The geometry imports from here, so
// the bass bin in the scene is the size of the bass bin on the invoice. That
// matters more than it sounds: it is the only way the packing check means
// anything. A module that fits in the bed with imaginary boxes has not been
// checked, it has been drawn.
//
// THE MOUNTING FIELD IS THE POINT OF THE WHOLE EXERCISE. You cannot bolt a
// hinge to the side of a loudspeaker, or to a rotomoulded water tank, or to an
// LP cylinder — most of the things a module carries have no fixing points at
// all. So every item says exactly what holds it: a named threaded insert, an
// M20 pole socket, a rack ear, a bolt pattern — or, far more often, "no mount
// points: capture in a cradle", and then what the cradle has to grip. Anything
// captured rather than bolted needs a custom timber or aluminium part, and
// those appear in the list too, priced as fabrication.
//
// Prices are Japanese street prices in yen, tax included where known, gathered
// from Soundhouse, Monotaro, Misumi, Amazon.co.jp, Yodobashi, Kohnan and the
// makers' own trade lists. They are researched, not quoted: treat them as an
// order of magnitude for a build sheet, not as a purchase order.
// ---------------------------------------------------------------------------

/** millimetres, as the catalogues quote them. */
const mm = (v) => v

/**
 * @typedef {object} Item
 * @property {string} cat        category, used to group the readout
 * @property {string} maker
 * @property {string} model      the actual model / part number
 * @property {[number,number,number]} [size]  w x h x d in mm, as installed
 * @property {number} kg         each
 * @property {number} jpy        each
 * @property {number} qty
 * @property {string} where      a shop in Tokyo that stocks it
 * @property {string} mount      how it is held. This is the important one.
 * @property {'high'|'medium'|'low'} conf
 * @property {string} [note]
 */

// --- YATAI -------------------------------------------------------------------
// Three findings from the research drive this list, and all three are about the
// truck rather than the food.
//
// ONE BASIN, NOT THREE, and this correction is worth more than any part on the
// list. The 三槽シンク — two wash compartments plus a separate hand-wash — is a
// FIXED-PREMISES requirement, and the familiar 40 / 80 / 200 L supply tiers are
// the 自動車営業 (kitchen-car) tiers. A 露店 is neither of those things. What a
// stall must carry is a hand-wash basin with RUNNING WATER at the cook, and
// nothing more; bowls, tongs and plates go back dirty to a licensed 基地施設 and
// are washed there. That is not a loophole, it is the licence: no base premises,
// no permit.
//
// SO THE WATER HALVES. Two stainless wash bowls, two of the three taps and half
// the water come off the truck, and the tanks now run 20 L supply and 20 L waste
// instead of 40 and 40. Forty kilograms of payload handed back — more than the
// entire serving table costs.
//
// THE MENU FOLLOWS FROM THE PERMIT, not from the water. A stall permit is a
// 直前加熱 permit: reheat and assemble, serve straight into disposable
// containers, no raw handling and no holding. Takoyaki, yakisoba, karaage, oden.
// Which is a yatai menu, so the restriction costs nothing at all.
//
// AND NO EXTRACT AT ALL. An open-air stall is not a kitchen car: with the sky
// over the griddle there is nothing to duct to, so the hood, the grease filter,
// the 150 mm flexible and the 200 mm 有圧換気扇 come off the list. That is 16 kg
// and ¥48,873, and it is most of what pays for the serving table.
//
// THE GAS BOTTLE CANNOT BE ON THE DECK. It has to be outdoors, upright, vented
// at low level (propane sinks) and 2 m from any flame. On a 1940 mm deck with a
// griddle on it, 2 m does not exist — so the external rear locker is not
// styling, it is the only compliant answer.
export const YATAI = [
  {
    cat: 'cooking', maker: 'IKK (伊東金属工業所)', model: 'TKO18321 てっぱんたこ焼 3連式 LPガス',
    size: [595, 190, 358], kg: 38, jpy: 67880, qty: 1, where: 'テンポスバスターズ / 厨房卸売センター',
    mount: 'NO mount points — a sheet-steel case on four 30 mm feet. Captured: a 605 × 368 well cut through the 24 mm ply worktop, lined with calcium-silicate board and stainless (bare ply against a cast-iron gas griddle is a fire), with two straps over the case ends.',
    capture: true,
    conf: 'medium',
    note: 'The cast plates lift straight out of the frame. Roughly 20 kg of loose iron unless they are removed and stowed for transit — the single most dangerous item in the module.',
  },
  {
    cat: 'cooking', maker: '岩谷産業 (Iwatani)', model: 'CB-ETK-2 プロたこマルチ',
    size: [346, 135, 278], kg: 3.4, jpy: 9800, qty: 1, where: 'ヨドバシ / Amazon.co.jp',
    mount: 'Four rubber feet, no fixings. A 3 mm ply rebate 350 × 282 with a hinged retaining bar across the front, so it locates positively and still lifts out.',
    capture: true,
    conf: 'medium',
  },
  {
    cat: 'water', maker: '汎用 SUS304', model: '手洗い用シンクボウル 320 × 230 × 深120',
    size: [320, 120, 230], kg: 1.2, jpy: 3900, qty: 1, where: 'モノタロウ / 合羽橋',
    mount: 'Drop-in on a rolled rim over a 300 × 210 cut-out, bedded in food-grade silicone and pulled down by four stainless under-clips. It stands on its OWN carcass across the deck from the prep counter, at the cook’s elbow — this is the one plumbed fitting in the build and the one an inspector actually looks for.',
    conf: 'medium',
    note: 'The two 450 × 390 wash bowls that used to sit beside it are gone: washing-up is a fixed-premises requirement, done at the 基地施設, not on the truck.',
  },
  {
    cat: 'prep', maker: '汎用 SUS304', model: 'ホテルパン 1/3 × 深100 + 蓋',
    size: [325, 100, 176], kg: 0.7, jpy: 1800, qty: 6, where: '合羽橋 / モノタロウ',
    mount: 'Drop into three 250 × 320 wells cut through the prep counter’s stainless top and hang on their own flanges. Batter, cabbage, sauce and finished takoyaki — the pans that used to be a sink, without the plumbing.',
    conf: 'high',
  },
  {
    cat: 'water', maker: 'スイコー (Suiko)', model: 'HLT-50 ホームローリータンク 50 L',
    size: [400, 500, 380], kg: 3.5, jpy: 9000, qty: 2, where: 'モノタロウ / コーナン',
    mount: 'ZERO mount points — rotomoulded PE, smooth radiused body, one 100 mm filler and one 38 mm cock boss. Cannot be bolted anywhere. Captured in a three-sided ply well 405 × 505 with two cam straps over the shoulder.',
    capture: true,
    conf: 'high',
    note: 'One supply, one waste. Filled to 20 L each rather than 40, because a hand-wash is all that draws on them: 40 kg of water instead of 80. The 50 L tank stays — it is 3.5 kg empty and the headroom is free — so a longer pitch just means filling it fuller.',
  },
  {
    cat: 'water', maker: '汎用 (キャンピングカー部品)', model: 'DC12V 水中ポンプ 10 L/min',
    size: [50, 95, 50], kg: 0.4, jpy: 3500, qty: 1, where: 'Amazon.co.jp',
    mount: 'A hanging loop and nothing else. Drops into the supply tank through the filler and hangs on its own hose; the drilled tank cap is the restraint.',
    conf: 'medium',
  },
  {
    cat: 'water', maker: 'SANEI', model: '自在水栓 泡沫キャップ付 呼13',
    size: [150, 230, 60], kg: 0.5, jpy: 3200, qty: 1, where: 'コーナン / モノタロウ',
    mount: 'Deck-mount shank with a backnut through the hand-basin stand’s top. One tap, over the one basin: the other two went with the wash bowls.',
    conf: 'medium',
  },
  {
    cat: 'cold', maker: '山善 (Yamazen)', model: 'YFR-AC252(B) 車載用冷凍冷蔵庫 25 L',
    size: [593, 410, 345], kg: 11.2, jpy: 34800, qty: 1, where: 'ヨドバシ / Amazon.co.jp',
    mount: 'Moulded case with recessed side handles, no threaded inserts. A ply cradle gripping the base rim, plus one cam strap through the handle recesses.',
    capture: true,
    conf: 'medium',
  },
  {
    cat: 'gas', maker: 'LPガス販売事業者', model: 'LPガス容器 8 kg (内容積 19 L)',
    size: [290, 500, 290], kg: 18, jpy: 12000, qty: 1, where: '岩谷産業 販売店 (充填契約)',
    mount: 'LITERALLY no mount points — a smooth barrel with a foot skirt and a neck guard. Barrel bands are the only restraint that exists. Lives in an external vented locker off the rear crossmember, upright, vented at the BOTTOM because propane sinks.',
    capture: true,
    conf: 'high',
  },
  {
    cat: 'gas', maker: 'I・T・O (伊藤工機)', model: 'HS-5BP 単段式調整器 + ホース口',
    size: [110, 95, 80], kg: 0.8, jpy: 5800, qty: 1, where: 'モノタロウ',
    mount: 'Screws onto the cylinder valve; the hose is band-clamped to the burner tail.',
    conf: 'medium',
  },
  {
    cat: 'gas', maker: 'custom (アルミ)', model: 'ボンベ庫 — vented cylinder locker 340 × 340 × 620 internal',
    size: [380, 680, 380], kg: 8.5, jpy: 28000, qty: 1, where: 'fabrication',
    mount: 'Bolted M10 to the rear crossmember, outboard of the tail. Low-level louvres.',
    conf: 'low',
  },
  {
    cat: 'front of house', maker: '高橋提燈 (東京) / オゼキ (岐阜提灯)', model: '尺3丸 和紙提灯 380φ × 430h (文字入れ)',
    size: [380, 430, 380], kg: 0.35, jpy: 12000, qty: 1, where: '上野 / 浅草',
    mount: 'Wire hoops top and bottom; hangs from a hook.',
    conf: 'high',
  },
  {
    cat: 'front of house', maker: '和光産業', model: '9号丸型 ビニール提灯 260φ × 330h',
    size: [260, 330, 260], kg: 0.12, jpy: 1200, qty: 4, where: 'Amazon.co.jp / 浅草',
    mount: 'Hook through the top hoop, tied down at the bottom so it does not fly.',
    conf: 'high',
  },
  {
    cat: 'front of house', maker: '水野染工場', model: 'オーダー暖簾 一間巾 1800 × 600 三巾 乳付',
    size: [1800, 600, 5], kg: 0.9, jpy: 24000, qty: 1, where: 'made to order',
    mount: 'Sewn loops (乳) over a 25 mm aluminium rod in two clamps.',
    conf: 'medium',
  },
  {
    cat: 'prep', maker: '住べテクノプラスチック', model: '20SWK 抗菌スーパー耐熱まな板 600 × 300 × 20',
    size: [600, 20, 300], kg: 3.4, jpy: 8253, qty: 1, where: '合羽橋 / モノタロウ',
    mount: 'Loose on the worktop; stowed in a slot beside the tank well for transit.',
    capture: true,
    conf: 'high',
  },
  {
    cat: 'power', maker: '汎用 LiFePO4 + 正弦波インバーター', model: '12V 100Ah + 1500 W インバーター + 分電盤',
    size: [330, 215, 175], kg: 16, jpy: 68000, qty: 1, where: 'Amazon.co.jp / オートバックス',
    mount: 'Battery case has M6 hold-down lugs at the base; bolted to the subframe with a strap over the top.',
    conf: 'low',
  },
]

// --- SOUND SYSTEM ------------------------------------------------------------
// THE FIRST FINDING RESHAPED THE MODULE: not one powered speaker in this class
// has a single usable mounting point on its base, sides or back. The complete
// inventory of threaded features on a modern active PA box is a pole socket in
// the top (compression only — never a tie-down), sometimes M8 or M10 eyebolt
// inserts, and cast handle recesses. Everything else is 15 mm plywood and a
// rubber foot.
//
// So every box here is a CAPTURE item, and the trick that makes one survive
// 60 km/h is not the strap: it is hardwood battens screwed inside the well walls
// that hook into the cast side-handle apertures, so the strap only has to stop
// the box rocking rather than lifting.
//
// THE SECOND FINDING IS AN ABSENCE, and it is the largest single thing this list
// does not contain. THERE IS NO AMPLIFIER ANYWHERE IN THIS BUILD, and none is
// needed. Every cabinet is active and every cabinet is self-contained: the
// PRX918XLF has 2000 W of fanless Class D behind 6-band parametric EQ, delay and
// a selectable crossover; the DZR10 has 2000 W bi-amped behind a 96 kHz FIR
// crossover with its own presets. Mixer XLR out → sub input, sub thru → top
// input, and the signal chain is finished. There is no rack amp, no outboard
// DSP, no processing rack and no speakON cable on the truck.
//
// What the boxes genuinely do NOT provide is MAINS. Not one of these cabinets
// has an AC thru — they daisy-chain signal and never power — so four cabinets
// need four outlets, which is why this list carries two earth-leakage cord reels
// and a DI where a passive rig would carry an amp rack. A steel truck body
// feeding metal-grilled boxes standing on wet ground is exactly the case the
// 漏電遮断器 exists for, and the hum loop gets lifted at the DI, never at the
// mains earth.
//
// THE THIRD FINDING IS A HEIGHT, and it is what maximising the sub cost. A
// 610 mm tray takes the biggest 18 in the class — 610 + 610 + a 190 mm centre
// channel closes the 1410 deck exactly — but tray 60 + PRX918XLF 693 + a DZR10
// lying on it is 1098, which is 1208 above the deck against a 1120 ceiling. So
// the tops do not travel on the subs at all: they lie flat in their own bay
// forward of them and wind up a pair of distance rods before they tip.
//
// AND THE LIGHT RIG IS SCAFFOLD PIPE, which is the fourth. No crank-up stand in
// this class collapses below 1120 (the K&M 24730 stows at 1405), and nothing may
// stand on the cab roof — 0.7 mm of steel over three hoops, where the failure
// mode is the overturning moment rather than the pressure. φ48.6 単管 is
// 労働安全衛生規則 material, costs about ¥1,200 for the whole frame against
// ¥85,000 of crank-up mast, and STAGE EVOLUTION's φ48–51 clamps fit it exactly.
export const SOUND = [
  {
    cat: 'PA — low', maker: 'JBL Professional', model: 'PRX918XLF 18" powered subwoofer',
    size: [591, 693, 654], kg: 40.7, jpy: 238000, qty: 2, where: 'Soundhouse / ハーマンプロ (取寄せ)',
    mount: 'The ONLY threaded features are in the top panel: an M20 pole socket, rated for a pole in COMPRESSION and never usable as a tie-down. No base inserts, no flypoints. Captured in a 611 × 674 ply well with hardwood battens hooking the cast side-handle apertures, plus one 24 mm endless strap over the top.',
    capture: true,
    conf: 'medium',
    note: 'THE BIGGEST BOX THAT FITS, and that is the whole reason it is here. 591 mm across is what set the tray at 610 and the centre channel at 190. It is 0.7 kg heavier than the pair of DXS15XLFs it replaces and reaches 30 Hz instead of 33 — the extra octave is free on payload and expensive only on geometry.',
  },
  {
    cat: 'PA — mid/top', maker: 'YAMAHA', model: 'DZR10 10" powered top',
    size: [315, 537, 345], kg: 17.9, jpy: 217800, qty: 2, where: 'Soundhouse 254521',
    mount: 'M10 × 8 PLUS M8 × 2 threaded inserts — by far the richest flypoint pattern of any box here, and the reason it is specified over the cheaper DXR10mk3. It is the one speaker on this truck that can be BOLTED to a yoke instead of cradled, which is what lets it tip up on a hinge rather than be lifted clear.',
    conf: 'high',
    note: 'The DXR10mk3 is ¥143,800 and 14.5 kg, but only has Φ35 slip sockets and M8 × 15 rear inserts — cradle only.',
  },
  {
    cat: 'PA — mid/top', maker: 'K&M (König & Meyer)', model: '21336 distance rod',
    size: [35, 1475, 35], kg: 2.27, jpy: 9500, qty: 4, where: 'Soundhouse 47964 (在庫)',
    mount: 'A PAIR PER SIDE, standing either side of the mid-top’s own bay — forward of the sub, not on it. The M20 male base screws into a captive M20 boss recessed 50 mm into the tray pan through a Φ50 guide sleeve that takes the side load; the Φ35 upper tubes carry the top’s trunnion yoke between them. The sub’s top socket is capped and unused. 945–1475 mm each, 530 of travel, rated 35 kg against the 22 kg they share.',
    conf: 'high',
    note: 'Two short columns instead of one long one is what makes the tip possible: a single rod has nothing to pin a trunnion to. Their collapsed 945 is also what sets the carriage rise at 527.',
  },
  {
    cat: 'light', maker: 'ダイワ (単管パイプ)', model: '単管パイプ φ48.6 × t1.8 × 2000 めっき',
    size: [48.6, 2000, 48.6], kg: 4.16, jpy: 1180, qty: 3, where: 'コーナン / カインズ / モノタロウ',
    mount: 'The mast is one length cut to 1740, the crossbar a second cut to 1400, the third is the diagonal brace. Nothing about this is exotic — it is 労働安全衛生規則 scaffold material sold by the metre in every home centre in Japan, and the whole frame costs less than one lighting clamp on the stand it replaces.',
    conf: 'high',
    note: 'The coincidence the rig is built on: φ48.6 is inside STAGE EVOLUTION’s φ48–51 clamp jaw, so stage fixtures bolt to builders’ pipe with no adapter at all.',
  },
  {
    cat: 'light', maker: '大洋製器工業', model: '固定ベース KB48.6 (単管ベース)',
    size: [150, 60, 150], kg: 0.69, jpy: 398, qty: 2, where: 'モノタロウ / コーナン',
    mount: 'A 150 mm square plate with a φ48.6 spigot and four fixing holes. Bolted M10 to a 6 mm steel spreader over the front crossmember — the mast’s foot, and the only place on this truck taking a bending moment into the chassis rather than into a panel.',
    conf: 'high',
  },
  {
    cat: 'light', maker: '信和 (シンワ)', model: '直交クランプ φ48.6 用 (耐力 500 kgf)',
    size: [110, 100, 110], kg: 0.74, jpy: 300, qty: 4, where: 'コーナン / モノタロウ',
    mount: 'Two make the T where the crossbar crosses the mast; two take the diagonal brace. RIGHT-ANGLE clamps specifically — the 自在クランプ swivels but does NOT lock at an angle under load, so it can carry a brace but must never define the frame’s geometry.',
    conf: 'high',
  },
  {
    cat: 'light', maker: 'custom (鋼製)', model: 'マストヒンジ — fabricated fold-down knuckle + over-centre latch',
    size: [180, 160, 200], kg: 3.2, jpy: 24000, qty: 1, where: 'fabrication',
    mount: 'THIS PART HAS TO BE MADE, and the reason is the finding above: no catalogue scaffold fitting locks a pipe at a chosen angle, so the one joint that decides whether the frame is standing or lying cannot be bought. A 12 mm plate clevis on a φ16 pin between the base plate and the mast’s heel, with a drop-in pin at 90° and an over-centre latch holding it flat for transit.',
    conf: 'low',
  },
  {
    cat: 'light', maker: 'STAGE EVOLUTION', model: 'SCLAMP (φ48–51 jaw)',
    size: [70, 95, 55], kg: 0.4, jpy: 780, qty: 6, where: 'Soundhouse (在庫)',
    mount: 'Jaw range covers the φ48.6 pipe exactly. Fixture hangs on an M10 bolt through the clamp body; all six are done up on the bench with the frame lying flat, and never touched again.',
    conf: 'high',
  },
  {
    cat: 'light', maker: 'STAGE EVOLUTION', model: 'SC90 セーフティワイヤー (90 cm)',
    size: [10, 900, 10], kg: 0.2, jpy: 480, qty: 6, where: 'Soundhouse (在庫)',
    mount: 'One steel bond per suspended fixture, round the pipe and back to the yoke. Non-negotiable, and cheaper than any of the arguments about it.',
    conf: 'high',
  },
  {
    cat: 'light', maker: 'CHAUVET DJ', model: 'COLOR STRIP12 (12 × 3 W RGB batten, DMX)',
    size: [1060, 85, 115], kg: 2.5, jpy: 23800, qty: 1, where: 'Soundhouse (在庫)',
    mount: 'Two integral yokes onto two SCLAMPs, mounted along the crossbar rather than across it — which is why it can hang under a single pipe instead of needing a truss to span.',
    conf: 'medium',
  },
  {
    cat: 'light', maker: 'STAGE EVOLUTION', model: 'SLIMPAR12 (12 × 3 W RGB, DMX)',
    size: [193, 89, 180], kg: 0.6, jpy: 9980, qty: 4, where: 'Soundhouse 268702 (在庫)',
    mount: 'Double-yoke bracket, M8 through-hole into an SCLAMP, spread at 346 mm centres along the 1400 crossbar. They are clamped POINTING ALONG THE MAST toward its foot — forward while the frame is lying down, straight at the deck once it is up — so the quarter turn that stands the frame is also the aim, and nothing rolls on its clamp at the venue.',
    conf: 'high',
  },
  {
    cat: 'booth', maker: 'Pioneer DJ', model: 'DDJ-FLX4 controller',
    size: [482, 59, 273], kg: 2.1, jpy: 49500, qty: 1, where: 'Soundhouse 318895 (在庫)',
    mount: 'NO MOUNT POINTS AT ALL — four rubber feet. It is 482 mm wide, within a millimetre of 19 inches, and that will tempt you: it has no rack ears and no provision for them. Captured in a 486 × 277 × 12 mm routed recess in the counter with a hinged retaining bar, so it stays put while the counter folds.',
    capture: true,
    conf: 'high',
  },
  {
    cat: 'booth', maker: 'YAMAHA', model: 'MG10XU mixer',
    size: [244, 71, 294], kg: 2.1, jpy: 32400, qty: 1, where: 'Soundhouse 193650 (在庫)',
    mount: 'No rack ears; Yamaha’s RK-MG12 kit fits the MG12/16, NOT this chassis. Routed recess plus a rear retaining bar, same as the controller.',
    capture: true,
    conf: 'high',
    note: 'This is the entire signal chain upstream of the speakers. Its XLR outs go straight to the subs; there is nothing between them.',
  },
  {
    cat: 'booth', maker: 'BSS Audio', model: 'AR-133 active DI',
    size: [59, 143, 124], kg: 0.65, jpy: 17800, qty: 1, where: 'Soundhouse 15477 (在庫)',
    mount: 'A steel wedge with a rubber base and no fixings. Velcro to the underside of the counter inside the booth. It is here for its GROUND LIFT: the mains earth on a steel truck body stays connected, and the audio screen is what gets broken.',
    conf: 'high',
  },
  {
    cat: 'power', maker: 'EcoFlow', model: 'DELTA 2 Max (2048 Wh)',
    size: [497, 305, 242], kg: 23, jpy: 180000, qty: 1, where: 'EcoFlow Japan / Amazon.co.jp / ヨドバシ',
    mount: 'Moulded side handle recesses only, no inserts, no tie-down eyes. Ply well 505 × 250 internal with a 60 mm lip and tongues into the handle apertures, one 24 mm strap over the top.',
    capture: true,
    conf: 'low',
    note: 'The 4096 Wh DELTA Pro 3 gives about 4.5 h at 800 W but weighs 51.5 kg, which this module does not have. At 2048 Wh expect roughly 2 to 2.5 hours — the honest number.',
  },
  {
    cat: 'power', maker: '日動工業', model: 'NW-EB33 漏電遮断器付コードリール 30 m',
    size: [300, 350, 260], kg: 7.7, jpy: 43758, qty: 2, where: 'モノタロウ / コーナン',
    mount: 'Carry handle and a drum frame; sits in a strapped ply cradle under the stage floor. Two of them, because none of the four cabinets has an AC thru and two reels is also how you get two circuits.',
    conf: 'medium',
    note: 'The 15 mA / 0.1 s earth-leakage breaker is the item, not the cable. Metal-grilled boxes on wet ground fed from a steel body is the exact fault this protects against, and it is the one part of this list that is about the crowd rather than the show.',
  },
  {
    cat: 'mechanism', maker: 'LAMP / スガツネ工業', model: '3509-24 heavy-duty slide, 610 mm',
    size: [24, 76, 610], kg: 5, jpy: 28578, qty: 2, where: 'モノタロウ 00351811',
    mount: '3-stage over-travel steel slide, 632 mm stroke, rated 2117 N per pair (about 216 kgf) — but that is a STATIC rating at the rail midpoint. It says nothing about a 60 kg tray taking vertical shock at 60 km/h, so the trays latch closed with over-centre catches and bear on hardwood stops in transit.',
    conf: 'high',
  },
  {
    cat: 'mechanism', maker: 'モノタロウ', model: '荷締めベルト ラチェット式 エンドレス 24 mm × 5 m',
    size: [24, 1, 5000], kg: 0.8, jpy: 1099, qty: 6, where: 'モノタロウ 53262388',
    mount: 'Working load 100 kg, breaking 500. Take the ENDLESS variant — no hooks, a continuous loop — so it passes over the box and through M8 eye plates on the tray without a steel hook loose beside a speaker cone.',
    conf: 'high',
  },
]

// --- HOKORA ------------------------------------------------------------------
// --- HOKORA ------------------------------------------------------------------
// The shrine list is the one where almost nothing has a part number, and that is
// not sloppiness — it is how the trade works. A chochin is ordered by size, 張り
// and crest; a saisenbako by 寸 and timber; a shimenawa by length and thickness.
// So the "model" column here is the ORDER SPEC a shop would take, not a SKU
// somebody invented, and where a maker is named (オゼキ for the lanterns,
// 高岡銅器 for the bell) it is a real house that takes that order.
//
// The mount column matters more here than anywhere else on the truck, because
// shrine fittings are the least fastenable objects in the whole project. A cast
// bell has one eye at its crown and nothing else. A chochin has a steel bail
// through the top ring and a paper body that splits if you screw into it. A
// glazed ceramic vase has nothing at all and will not take adhesive. Every one
// of them is captured, and the capture is drawn.
//
// The timber and the copper are on the list too. They are not gear, they are the
// shrine — but somebody still has to buy them, and 檜 45 × 45 × 1820 is a real
// home-centre section at a real price.
export const HOKORA = [
  {
    cat: 'chochin lantern', maker: 'オゼキ (岐阜提灯協同組合)', model: '尺丸 白張提灯 (径約300mm) 家紋・社号入れ 別注',
    size: [300, 420, 300], kg: 0.35, jpy: 14300, qty: 2, where: 'オゼキ（岐阜提灯協同組合員）ほか浅野商店・平出商店、または岐阜提灯取扱の神具店・Amazon.co.jp出品。家紋/文字入れは受注生産、納期2〜3週間。無地の白張なら在庫品あり。',
    mount: 'The chochin has exactly ONE approved attachment provision: the 吊り手 (steel hanging bail) riveted into the 上輪 (top ring). The 竹ひご+和紙 body has literally no mount points and must never be pierced, clamped, screwed or taped — a screw into the 輪 splits it. Hang from a 真鍮フック or a stainless eye screwed into the kasagi underside, through the 吊り手 only. The 下輪 is a locating ring, not a load path, so nothing hangs off the bottom. For transit the lantern collapses flat (~40mm) and drops into a padded plywood well in the stow deck with a 5mm felt liner and a lid — a hung chochin will beat itself to death against the pillars on the road.',
    capture: true,
    conf: 'medium',
    note: 'オゼキ is a real Gifu chochin house — 高山商店, which the first draft named, sells ビニール提灯 and does not make washi lanterns at all; chochin are sold by descriptive spec (size + 張り + 紋), not by catalogue part number, so the \'model\' here is the order spec rather than an invented SKU. Rejected 高張提灯 (pole-mounted): the 2m pole exceeds the 1120mm stowed headroom and needs its own stayed base.',
  },
  {
    cat: 'chochin light source', maker: 'generic (岐阜提灯店 取扱)', model: '提灯用LED電池灯 単3×2 電球色 (ちょうちん用LEDローソク)',
    size: [40, 180, 40], kg: 0.08, jpy: 2080, qty: 2, where: '提灯を買う店で同時手配（岐阜提灯店の付属品棚）、またはAmazon.co.jp「提灯 LED 電池」。在庫品。',
    mount: 'Designed to mount to the chochin and nothing else: the unit is a candle-shaped LED on a base that either sits inside the 下輪 or clips to it with a sprung wire. That clip IS the approved provision — no adhesive, no screws, no modification to the paper or the ribs. Nothing about the chochin is drilled. Battery change is by lifting the unit out through the collapsed lantern\'s bottom ring.',
    conf: 'medium',
    note: 'Sold by every chochin shop under a dozen names — 「ちょうちん安光」, LC301, 盆提灯用LEDローソク電池灯 — from ¥1,265 to ¥2,090. An order-desk item rather than a SKU, and its 165 to 185 mm length is the figure that matters, because it sets the collapsed lantern\'s stow depth. Do NOT use a real candle: an open flame in a vermilion-lacquered paper-and-cedar box on a truck bed is a fire, and カシュー coating is solvent-borne.',
  },
  {
    cat: 'suzu bell', maker: '高岡銅器 (神仏具卸 経由)', model: '本坪鈴 四寸 (φ120mm) 真鍮磨き',
    size: [122, 150, 122], kg: 1.7, jpy: 20700, qty: 1, where: '神具店（伊勢・宮忠、翠雲堂ほか）、Amazon.co.jp/楽天の神具専門店出品。四寸は定番在庫、通常3〜7日。',
    mount: 'Cast one-piece bell. The ONLY attachment provision is the integral 吊り環 (cast eye/loop) at the crown — no threads, no flange, no holes anywhere else. Suspend it from an M8 stainless eye bolt bolted THROUGH the kasagi (nut and large washer on top, not a wood screw) with a rated 3mm stainless shackle or a 鈴鐶 between eye bolt and 吊り環. Never bolt through, drill or clamp the bell body — it is a resonator and a hole kills the tone as surely as it kills the casting. Budget 1.7kg plus the 鈴緒\'s pull load (call it 40kg dynamic when a child hauls on it) into the kasagi; the kasagi therefore needs a hardwood or steel-plated core over the eye bolt, not just 檜.',
    capture: true,
    conf: 'medium',
    note: 'Four-sun is small for a public shrine but correct for a hokora at this scale, and it keeps the kasagi load sane. A 六寸 brass bell is ~5kg and would need the eye bolt taken down into the pillar, not the lintel.',
  },
  {
    cat: 'suzuo bell rope', maker: '神具店 別注品', model: '鈴緒 紅白 太さ36mm × 長さ1200mm 四尺 (麻芯・化繊巻)',
    size: [36, 1200, 36], kg: 0.8, jpy: 13200, qty: 1, where: '神具店（宮忠ほか）。太さ×長さ指定の別注、納期1〜2週間。既製の1.2m紅白なら在庫あり。',
    mount: 'A rope: no hardware, and that is its correct provision — it terminates in a 上部の環/結び designed to be lashed or hooked to the bell\'s 吊り環 or to the same shackle. Nothing is fastened to the rope\'s body. Because it will be pulled sideways as well as down, the shackle above it must be the rated part, not the rope. Stows by coiling into the same plywood ring as the shimenawa; do not leave it hanging in transit — a swinging 800g rope will chip the vermilion off a pillar in one trip.',
    conf: 'medium',
    note: 'Chose 化繊巻 over pure 麻: the piece lives outdoors on a truck and hemp goes furry and grey in one wet season. Length 1200mm is set by the deployed kasagi height minus a comfortable grab at ~1100mm off the deck.',
  },
  {
    cat: 'offering box', maker: '神具店 (国産檜)', model: '賽銭箱 一尺 (幅303mm) 檜製 格子天板・鍵付',
    size: [303, 250, 220], kg: 3.5, jpy: 45000, qty: 1, where: '神具店（宮忠、神棚の里ほか）、Amazon.co.jp神具専門店出品。一尺は定番、在庫〜2週間。',
    mount: 'Mitred solid-hinoki box: literally no threaded inserts, no flange, no bolt-through provision anywhere. It must be captured, not fastened through its faces. Build a 12mm plywood well in the deck sized 306×223mm with a 3mm felt-lined rebate so it drops in with no rattle, then take two M6 stainless bolts UP through the deck into the box\'s bottom 桟 (the internal cleats are the only timber with enough meat) — or, if you won\'t drill the box at all, one ラチェット荷締めベルト over the lid seat into two deck-mounted D-rings. Never screw into the sides or the lid frame: they are 12mm boards and the box is the one item on the module a stranger will put their hands on.',
    capture: true,
    conf: 'medium',
    note: 'Sold by 寸 size and material rather than part number. A 一尺 box is deliberately modest — anything bigger reads as a collection tin rather than shrine carpentry, and it also has to clear the 1120mm stowed headroom with the platform folded down over it.',
  },
  {
    cat: 'sakaki vase', maker: '瀬戸物 神具 (白陶器)', model: '榊立 三寸 白 (高さ約95mm, 口径約45mm)',
    size: [55, 95, 55], kg: 0.15, jpy: 660, qty: 2, where: '神具店・ホームセンター仏具コーナー（コーナン/カインズ）、Amazon.co.jp。常時在庫、数百円台。',
    mount: 'Glazed ceramic — literally no mount points, and adhesive will not bond reliably to a glazed foot. Capture with a φ58mm × 12mm deep counterbored well routed into the hinoki offering platform, lined with a 2mm EPDM ring so the glaze doesn\'t chip against end grain. For transit the vases lift out entirely into a foam-cut stow box: a water-filled vase on a moving truck bed is a spill onto the カシュー finish, which will bloom. Fill on site only.',
    capture: true,
    conf: 'medium',
    note: 'Cheap and replaceable, which is the point — this is the one item that will get broken. Buy four, install two. Use 造花の榊 (artificial sakaki, ~¥1,000/pair, same shops) rather than cut sakaki unless the piece is deployed the same day.',
  },
  {
    cat: 'offering stand', maker: '静岡木工 / 神棚の里 (吉野桧)', model: '三宝 六寸 (折敷182mm角) 吉野桧 くり形三方',
    size: [182, 105, 182], kg: 0.5, jpy: 2400, qty: 1, where: '神具店（宮忠ほか）、Amazon.co.jp神具専門店。六寸は定番在庫。',
    mount: 'Feet only — a three-sided 台 with the traditional くり形 apertures cut through each side and a loose 折敷 top. No fixings, no inserts, and the くり形 are decorative cut-outs, not rated handle apertures, so don\'t run a strap through them. Capture in a 3mm-deep rebate routed into the platform with a removable hinoki cleat at the rear; the whole stand lifts out for transit and stows flat. If it must stay put, a single stainless 皿ビス up through the deck into the rear foot is the only acceptable fixing — the sides are 9mm and will split.',
    capture: true,
    conf: 'medium',
    note: '六寸 matches the 一尺 offering box and the platform depth. 折敷 alone would be cheaper (~¥2,000) but the 三方 raises the offering off the deck, which is the whole visual point of the platform.',
  },
  {
    cat: 'gohei / shide', maker: '神具店 (奉書紙・木串)', model: '御幣 中 (高さ約300mm) 木串付 + 紙垂用 奉書紙 半紙判',
    size: [90, 300, 30], kg: 0.05, jpy: 3500, qty: 2, where: '神具店、Amazon.co.jp神具店出品。奉書紙は書道用品店・伊東屋でも可。在庫品。',
    mount: 'A paper-and-wood object with a 木串 (stick) — it is designed to be stood in the 三方 or slotted into a 台, and that slot is the entire mount story. Drill a φ9mm × 25mm blind hole in a hinoki block let into the platform, or use the 三方. Nothing is fastened to the paper. Treat as a consumable: 紙垂 are hand-cut from 奉書紙 to a standard four-fold pattern and are replaced whenever they get rain-marked — cut a dozen at a time and stow them flat between two boards.',
    conf: 'medium',
    note: 'Sold by size (小/中/大), not part number. The 紙垂 for the shimenawa are separate from the 御幣 and get cut to suit the rope\'s length — four on a 1200mm 注連縄.',
  },
  {
    cat: 'shimenawa', maker: '神具店 (合成藁)', model: '注連縄 大根注連 ビニール製 長さ1200mm (径約110mm 中央部)',
    size: [1200, 110, 110], kg: 1.2, jpy: 9800, qty: 1, where: '神具店（宮忠、神棚の里ほか）、Amazon.co.jp神具専門店。ビニール製1.2mは定番在庫、3〜7日。',
    mount: 'No fittings at all, and that is correct: a shimenawa is lashed. Bind it to the kasagi at three points with 麻縄 or 3mm白ロープ passed around the rope and through pre-drilled φ8mm holes in the kasagi\'s top face, knots hidden above. Do not staple, screw, wire or cable-tie through the rope — the twist carries the shape and a fastener through it will unwind a strand within a season. Stowed, it coils to a ~400mm hoop and drops into a plywood ring in the deck well.',
    conf: 'medium',
    note: 'ビニール（合成藁）over 本藁 specifically because this thing lives outdoors on a vehicle: real rice straw sheds, mildews and comes apart in one wet season, and the difference is invisible at two metres. Real straw is the right call only if the piece is rebuilt annually, which is arguably the more respectful answer — worth deciding deliberately rather than by default.',
  },
  {
    cat: 'shrine curtain', maker: '神具店 (テトロン製)', model: '神棚幕(神前幕) 巴紋 紫 巾三尺(900mm) × 丈一尺(300mm) テトロン',
    size: [900, 300, 5], kg: 0.4, jpy: 3080, qty: 1, where: '神具店（宮忠ほか）、Amazon.co.jp神具専門店。既製三尺は在庫、紋替え別注は2週間。',
    mount: 'Sewn 乳 (chi — cloth loops) along the top hem, typically five to seven on a three-shaku curtain. Those loops are the ONE approved provision. Thread a φ6mm stainless rod or a taut rope through the 乳 and support the rod on two brass hooks in the pillars, or on the nuki itself. Never pin, staple, screw, clip or velcro the cloth — the 乳 exist precisely so nothing pierces the field, and a 巴紋 with a hole through it is worse than no curtain. In transit the curtain comes off the rod, rolls (not folds — creases across the 紋 are permanent in テトロン) around a 50mm tube and stows in the dry box.',
    conf: 'medium',
    note: 'テトロン rather than 綿: it sheds rain, doesn\'t shrink and holds vermilion dye against UV, which matters when the module spends its life outdoors. Width is set at 900mm to match the torii\'s clear span between pillar inner faces.',
  },
  {
    cat: 'shinkyo mirror', maker: '神具店 (真鍮鏡 + 木製雲形台)', model: '神鏡 二寸 (鏡径60mm) 雲形台付',
    size: [95, 125, 30], kg: 0.35, jpy: 4950, qty: 1, where: '神具店、Amazon.co.jp神具専門店、ホームセンターの神具コーナー。二寸は定番在庫。',
    mount: 'Two parts, and only one of them can be touched. The 鏡 itself has literally no mount points — it drops into a machined slot in the 雲形台 and is held by fit alone. The 台 has feet only: no inserts, no flange. Capture the 台 in a 3mm rebate routed into the 御神体棚 with a hinoki fillet in front, or run one M4 stainless 皿ビス up through the shelf into the 台\'s solid base block — the base is the only part with acceptable meat, and never into the cloud carving, which is 6mm and cross-grained. The mirror lifts out for transit; a 60mm brass disc rattling in a wooden slot over 1940mm of leaf-sprung kei truck will polish its own edge off.',
    capture: true,
    conf: 'medium',
    note: '二寸 is small but sized to the hokora\'s internal height; a 三寸 (¥8,000-ish) would crowd the 三方 in front of it.',
  },
  {
    cat: 'shrine lantern', maker: '神具店 (木製神前灯籠)', model: 'LED神前灯籠 木目屋根 6号 電池式 (高さ約250mm)',
    size: [120, 250, 120], kg: 0.4, jpy: 6139, qty: 2, where: '神具店、Amazon.co.jp神具専門店。コード式(AC)は定番在庫、電池式は取扱店が限られ要確認。',
    mount: 'Wooden lantern on a turned or blocked base. AC (コード式) versions have a φ8mm cord grommet hole through the base which doubles as a usable bolt-through provision — an M6 stainless bolt up through the platform into a T-nut in the base. Battery versions typically have feet only and literally nothing else, in which case capture in a shallow 3mm well with a rear cleat. Do not screw into the 火袋 (the paper/shoji light box): it is 4mm frame stock. Whichever version, the lantern lifts out for transit.',
    capture: true,
    conf: 'medium',
    note: 'I could not confirm a battery-powered 神前灯籠 as a current stocked line — the standard product is コード式 for a kamidana. If the battery version doesn\'t exist at order time, take the AC pair and run them off the Jackery\'s AC outlet through a short cord dressed inside a pillar, or drop this line entirely and let the Snow Peak lanterns do the night work. Marked low deliberately: real category, unconfirmed current variant.',
  },
  {
    cat: 'LED uplight', maker: 'スノーピーク (Snow Peak)', model: 'たねほおずき ES-041',
    size: [62, 75, 62], kg: 0.095, jpy: 4400, qty: 3, where: 'スノーピーク直営/オンラインストア、Amazon.co.jp、ヨドバシ.com、好日山荘。定番在庫、当日〜翌日。',
    mount: 'Two designed attachment provisions and no drilling: an integrated MAGNET in the base, and a shock-cord loop with a moulded hook at the top. Hang two from small brass hooks screwed into the underside of the nuki (they weigh 55g — a 4×15 brass screw is ample), and magnet the third to a 20mm × 2mm steel washer let flush into the underside of the kasagi and secured from above, so nothing steel is visible. The housing is a sealed IPX4 shell: do not drill it, do not clamp it, do not glue it. Runs on 3 × AAA, so it is independent of the power station — the shrine still lights if the battery is flat.',
    conf: 'medium',
    note: 'Product and mount features I\'m confident in; dimensions and current price estimated. Chose these over a mains LED strip because the warm dimmable glow reads as lantern light rather than display lighting, and because the magnet-and-hook mount means zero fasteners into the vermilion work. Snow Peak ほおずき ES-070 (larger, ~¥8,000) is the alternative if you want one bright source instead of three soft ones.',
  },
  {
    cat: 'power station', maker: 'Jackery', model: 'Jackery ポータブル電源 300 Plus (288Wh / AC300W)',
    size: [230, 167, 155], kg: 3.75, jpy: 29800, qty: 1, where: 'Jackery Japan公式 (jackery.jp)、Amazon.co.jp、ヨドバシ.com。在庫潤沢、実売はセールで¥25,000前後。',
    mount: 'Moulded carry handle and rubber FEET ONLY — literally no threaded inserts, no bolt-through holes, no rack ears, no flange. The case is the battery enclosure and must never be drilled or screwed into. Capture it: a 12mm plywood well 236×160mm × 60mm deep, lined with 10mm EVA foam, with the vents unobstructed on the fan side, plus one ラチェット荷締めベルト over the top into two deck D-rings — or two 面ファスナーベルト through slots cut in the well walls. Orient it so the AC outlet faces the pillar cable route, and leave 50mm clearance at the fan end. It lives in the truck; it is not part of the fold-out.',
    capture: true,
    conf: 'high',
    note: 'Confirmed today that jackery.jp\'s current catalogue carries a 288Wh unit in this class (listed there as Explorer 300D alongside the 300 Plus lineage) — check which designation is actually orderable at purchase. 288Wh is generous for the load: two LED lantern pairs plus a phone is under 20W, so this is several nights. Rejected anything over 500Wh purely on mass — every kg here is a kg not available for copper and hinoki.',
  },
  {
    cat: 'timber - framing/pillars', maker: '国産檜 (ホームセンター規格材)', model: 'ヒノキ 角材 45×45×1820mm 節有',
    size: [45, 1820, 45], kg: 1.6, jpy: 1780, qty: 6, where: 'コーナン/カインズ/ジョイフル本田 木材売場。常時在庫、店頭カット可。無節・上小節は木材屋で別注（3〜4倍価格）。',
    mount: 'Raw stock — this is the structure everything else mounts TO, not a bought fitting. Where fold hinges land, install 鬼目ナット (M6 threaded inserts, Eタイプ) into the end grain and faces rather than relying on wood screws: the torii pillars will be raised and lowered hundreds of times and a screw thread in hinoki strips after a few dozen cycles. Count on 8 × M6 inserts per pillar foot. Where the suzu\'s eye bolt passes through the kasagi, laminate a hardwood or 3mm steel core into the member first — 檜 alone will crush under a 40kg pull.',
    conf: 'medium',
    note: '1820mm (六尺) is the standard sold length and it lies down the 1940mm bed diagonal-free when stowed, which is why the torii is 1820-based. Deployed, the pillars stand well above the 1120mm stowed headroom — that is the whole trick of the module. Spruce/SPF (1×4 19×89×1820, ~¥600) is real and half the price but goes grey and fuzzy under vermilion; hinoki is the honest choice for a piece meant to read as shrine carpentry.',
  },
  {
    cat: 'timber - floor/platform', maker: '国産檜 (集成材)', model: 'ヒノキ集成材 910×450×15mm',
    size: [910, 15, 450], kg: 2.7, jpy: 4980, qty: 2, where: 'コーナン/カインズ/ジョイフル本田 木材売場、DIY通販。定番サイズ、在庫品。',
    mount: 'Board stock, not a fitting. This becomes the raised offering platform and every captured item lands in a well routed into it: φ58 wells for the 榊立, a 3mm rebate for the 三方, a rebate and fillet for the 神鏡台. Rout all wells BEFORE finishing. Underside gets the T-nuts and D-ring backing plates so no fastener head shows on the visible face. Seal the end grain — a 15mm glulam panel left raw on a truck bed will cup within a season.',
    conf: 'medium',
    note: '集成材 rather than solid 一枚板 specifically for dimensional stability: a solid 450mm-wide hinoki board will move 4-5mm across the grain between a Tokyo August and a February, which will jam every rebate and crack the vermilion at the joints. Solid hinoki is more correct traditionally and the right answer if the piece is built to be re-fettled each year.',
  },
  {
    cat: 'roofing - copper sheet', maker: '銅板 圧延材 (C1100 タフピッチ銅)', model: '銅板 t0.35 × 365 × 1200mm',
    size: [365, 1, 1200], kg: 1.4, jpy: 7800, qty: 4, where: 'MonotaRO 金属素材、または板金材料商・金物店。t0.3〜0.4の一文字葺き用は定番。銅相場連動で価格変動大、要都度見積。',
    mount: 'Raw sheet — literally no mount points, and correctly so: a copper roof is never fastened through its visible face. Each of the six facets gets its copper folded over the plywood substrate\'s edges (掴み込み) and held by 銅製吊子 (copper cleats) nailed into the ply behind, so the weather surface stays unpierced. CRITICAL for a folding roof: the copper must STOP SHORT of every hinge line. Terminate each facet\'s sheet 15mm back from the fold, hinge the plywood beneath, and cover the joint with a loose copper cap flashing fixed on ONE side only so it slides as the facet swings. Copper folded repeatedly across a hinge work-hardens and cracks within a few dozen cycles — the hinge lives in the ply, never in the metal.',
    capture: true,
    conf: 'medium',
    note: 't0.35 is a real roofing gauge and stiff enough not to oil-can over 350mm facets. Four sheets covers ~1.75m² of facet with folding allowance. Genuine copper over copper-look ガルバリウム because the whole point is that it will go brown then green over a decade; the coated steel alternative (~¥2,500/sheet, a third the mass) is defensible if payload or budget bites, but it will never patinate.',
  },
  {
    cat: 'roofing fasteners', maker: '銅製 (板金用)', model: '銅釘 25mm (平頭) 1kg箱 + 銅製吊子 60mm 100枚',
    size: [150, 80, 100], kg: 1.6, jpy: 10000, qty: 1, where: 'MonotaRO、板金材料商、金物店（浅草橋・蔵前の建築金物店）。在庫品。',
    mount: 'Consumable fastener — it is the mount provision for the copper above. Nails go through the 吊子 into the 12mm plywood substrate only, never through the visible copper face. MUST be copper, not steel and not galvanised: dissimilar metals in contact with a copper roof set up galvanic corrosion, and the runoff will stain the vermilion below within a single wet season — the green streak down a red pillar is the classic tell of a roof fastened with the wrong nails. Same rule applies to any screw within the copper\'s drip line: brass, copper or 316 stainless only.',
    conf: 'medium',
    note: 'Real product category stocked by every 板金材料商; I could not confirm a current SKU or price without web access, so treat the figure as a counter order. Buy the cleats and nails from the same supplier as the sheet.',
  },
  {
    cat: 'finish - vermilion', maker: 'カシュー株式会社', model: 'カシュー 自然乾燥 NO.69 朱 (T011-22-7569) 1kg + 専用下塗り 1kg + うすめ液',
    size: [110, 150, 110], kg: 1.2, jpy: 19000, qty: 2, where: 'Amazon.co.jp、東急ハンズ、塗料専門店（大阪・道具屋筋、東京・新橋の塗料店）。1kg缶は在庫品。色番号は発注時に要確認。',
    mount: 'Not a mounted item — a coating. Stated for completeness: it goes on the hinoki pillars, kasagi and nuki after the 鬼目ナット inserts are fitted, not before, or the threads fill with lacquer. Mask every insert and every mating face of a fold joint; カシュー builds a film thick enough to bind a 0.3mm-clearance hinge pocket shut. Three coats over the primer, sanded between, and give it a full week to harden before the module is folded for the first time.',
    conf: 'medium',
    note: 'カシュー is a genuine cashew-nutshell lacquer sold in consumer cans and is the standard urushi-look coating for shrine and temple work in Japan — but I could not verify the current colour number for 朱 against a live page, so specify by colour name at the counter and do not order against a guessed number. The traditional alternative is 弁柄 (bengara) iron-oxide pigment ground in 荏油 or 柿渋: cheaper, properly matte, historically correct for a wayside hokora, and far less durable on a piece that lives on a vehicle. Solvent-borne — mask the copper, and never bring the LED candles near a wet coat.',
  },
  {
    cat: 'hardware - fold hinges', maker: 'モノタロウ (own brand)', model: 'ステンレス 平丁番 51×51×t1.0mm (2枚入)',
    size: [51, 51, 2], kg: 0.05, jpy: 480, qty: 12, where: 'MonotaRO、コーナン/カインズ金物売場。定番在庫、翌日出荷。',
    mount: 'The hinge IS mount hardware — four φ4.5mm countersunk holes per leaf, drilled and dished for 木ネジ, which is its designed and only provision. Into 15mm hinoki that is fine with M4×20 stainless 木ネジ. Into the 12mm plywood roof substrate, do NOT use wood screws: fit 鬼目ナット M4 inserts from the back face and bolt through, because these six facet joints are the ones cycled every single deployment and a stripped screw in ply end-grain is unrepairable in the field. Stainless or brass only — anything zinc-plated within the copper roof\'s drip line will streak the vermilion.',
    conf: 'low',
    note: 'Generic-but-real MonotaRO own-brand stock rather than a guessed model number; confirm the item code at order. If the facets need to hold an intermediate angle rather than flop, スガツネ (Sugatsune/LAMP) torque hinges and their LDD-S soft-down lid stays are the right upgrade — both makers\' sites are reachable and their catalogues carry rated equivalents, but I could not pin a specific part number this session, so I have specified the honest plain hinge and flagged the upgrade.',
  },
]

// --- CABIN -------------------------------------------------------------------
// --- CABIN -------------------------------------------------------------------
// The camper is the module where the list, not the geometry, is the binding
// constraint — and the number that binds it is 350 kg.
//
// THIS LIST TOTALS 98 KG AND THE MODULE FITS 84 OF IT. The difference is one
// line: the EcoFlow WAVE 2, 14.5 kg of portable air conditioner. It survived the
// first draft and then did not survive the check, because a Seitz S4 turns out
// to weigh 8.5 kg rather than the 5.5 the draft assumed and two of them took the
// margin. The line stays here with its price, because the trade — an air
// conditioner, or fourteen kilograms of anything else — is the decision, and
// deleting the row would hide it. What it buys instead is the roof fan running
// all night off a battery that is already aboard.
//
// WATER IS 20 L, CARRIED. Two full 20 L tanks is 40 kg and 40 kg is more than
// the whole margin, so the second tank on this list is exactly what it looks
// like — a spare, filled at the tap, not carried full.
//
// The bellows is 11号帆布 by the metre rather than a proprietary pop-top skirt,
// because nobody sells a pop-top skirt for a truck this size and canvas is what
// the coachbuilders use.
export const CABIN = [
  {
    cat: 'sleeping / bunk mattress', maker: 'DOD (ディーオーディー)', model: 'ソトネノキワミ M / CM2-650 (1150 × 2080 × 100)',
    size: [1150, 100, 2080], kg: 6.3, jpy: 27500, qty: 1, where: 'DOD公式オンラインストア / ヨドバシ / Amazon.co.jp。M は現在 販売終了、後継は同幅の ソトネノキワミエアー。',
    mount: 'Literally no mount points — a TPU-welded bladder in a fabric shell whose only hard feature is the inflation valve boss, which is a seal and not an anchor. Capture it geometrically: rout the cabover bunk deck as a shallow well with a 12 mm ply kerb 60 mm proud all round, so the mat cannot walk while the bunk slides its 950 mm. For travel add two 25 mm webbing straps on Fastex buckles across the mat, anchored to M6 rivet nuts set into the deck outside the kerb. Nothing is screwed, stapled or hooked into the mat itself.',
    capture: true,
    conf: 'medium',
    note: 'DOD list nine ソトネノキワミ SKUs — S/M/L across two tiers — and no D; the D in the first draft was invented, and that is exactly the kind of part number that reads plausible and buys the wrong thing. The M at 1150 wide is also the one that FITS: the L is 1380, and a 1380 mat on a 1280 bunk rides up the sides all night.',
  },
  {
    cat: 'sleeping / lower platform + day bench', maker: 'マニフレックス (Magniflex)', model: 'メッシュ・ウィング セミダブル (tri-fold high-resilience Elioce core)',
    size: [1170, 110, 1980], kg: 8.0, jpy: 47300, qty: 1, where: 'マニフレックス正規販売店 / Amazon.co.jp / 楽天。Made to order in some colours — allow 1-2 weeks.',
    mount: 'No mount points; a foam block in a zipped removable cover, and the zip is not structural. Two capture modes. Flat: the same 12 mm ply kerb around the main 1940 mm deck section holds it. Folded into a day bench: two 50 mm cam-buckle straps pass right around the tri-folded block and hook to two M8 stainless D-rings bolted through the floor deck on 40 x 40 x 3 mm backing plates. Do NOT screw hinges, snap studs or Velcro plates to the cover — the cover is meant to come off and be washed, and a fastener through it tears the foam edge.',
    capture: true,
    conf: 'medium',
    note: 'Folds in three so the same mattress is the mattress at night and the porch bench by day, which is the whole reason for a tri-fold over a one-piece. Rejected a 敷き布団: cotton futon in a pop-top with a fabric bellows will mildew in a Japanese summer. Price and weight for the SD size are approximate.',
  },
  {
    cat: 'sleeping / bags', maker: 'スノーピーク (Snow Peak)', model: 'セパレートオフトンワイド700 / BDD-103',
    size: [250, 250, 500], kg: 2.05, jpy: 44800, qty: 2, where: 'Snow Peak直営 / Amazon.co.jp / ヨドバシ / 好日山荘。Seasonal stock; commonly available, allow a week in peak season.',
    mount: 'No mount points at all beyond the stuff sack\'s drawcord and its two compression straps — those are for compressing the bag, not for restraining mass, though at 1.65 kg the mass case is trivial. Stow both bags in the cabover nose locker (the dead volume ahead of the sleeping area once the bunk is run out) behind a 6 mm shockcord net laced to six M5 eye bolts in rivet nuts around the locker mouth. Nothing is fixed to the bag.',
    capture: true,
    conf: 'medium',
    note: 'Futon-form bag rather than a mummy: the two unzip into quilts and zip to each other, which is what you actually want on a fixed 1280 mm double platform. Rejected NANGA オーロラライト 600DX (lighter, warmer, ~2x the price and it fights a shared platform). Model code BDD-104 and price believed current but unverified.',
  },
  {
    cat: 'soft goods / pop-top bellows', maker: '富士金梅 (川島商事)', model: '11号帆布 (paraffin-finished cotton canvas, 920 mm bolt width)',
    size: [1900, 400, 1250], kg: 3.2, jpy: 11500, qty: 1, where: '生地の森 / 帆布屋 / オカダヤ新宿本店 — sold by the metre off the bolt; buy an 8 m cut for a 6.3 m lid perimeter at 400 mm rise plus seam and keder allowance. In stock, cut to order.',
    mount: 'Fabric has no fixings whatsoever, so ALL load goes into mechanical capture at both edges. Sew a 6 mm polypropylene keder (welt) cord into the top and bottom hems, then slide each hem into an aluminium keder/awning rail — Misumi extruded profile or a Takigen weatherstrip channel — screwed to the pop-top lid rim and to the shell top rail with M4 x 12 stainless pan screws into rivet nuts at 100 mm centres, on a continuous butyl tape bead. Corners get a moulded radius in the rail, never a mitre. Never staple the canvas and never trap it under a flat batten: a batten pulls out of the weave in one gust.',
    capture: true,
    conf: 'medium',
    note: '11号 (~430 g/m2) is the lightest 帆布 that still stands up as a bellows wall. Real trade-off: cotton canvas breathes beautifully and folds flat, but it will mould in a Kanto summer if you close the lid wet. The right upgrade is Sunbrella marine acrylic or a PU-coated polyester from 平岡織染 — I could not pin a current 平岡織染 pattern code this session, so the 帆布 is the safe named answer. Metre price and finished weight are estimates.',
  },
  {
    cat: 'soft goods / flyscreen', maker: 'ダイオ化成 (Dio Chemical)', model: 'クラウンネット 24メッシュ グラスファイバー グレイ 910 mm × 6 m',
    size: [910, 1, 6000], kg: 0.5, jpy: 1280, qty: 1, where: 'コーナン / カインズ / ジョイフル本田 の網戸コーナー、または MonotaRO。Sold by the metre or as a 910 mm x 2 m pack. Always in stock.',
    mount: 'No fixings. Two approved captures depending on the opening. Fixed openings (the two S4 window bays already carry their own cassette screens, so this is for the gullwing apertures): tension the mesh into a groove in an aluminium screen frame with standard 網戸用ゴム glazing spline, and screw the FRAME, not the mesh, to the opening. Removable porch screen: sew the mesh to a 25 mm YKK #5 coil zip on three sides and to a hook-and-loop tape strip on the fourth; the loop tape is bonded to the framing with 3M VHB and the mesh never sees a screw or a grommet.',
    capture: true,
    conf: 'medium',
    note: 'Glass-fibre 24-mesh rather than 18-mesh polyester: 24 stops ヌカカ/ブヨ, and glass fibre does not sag after a summer stretched over a warm gullwing. Cheap and replaceable, which is the point — it is the part that gets torn.',
  },
  {
    cat: 'soft goods / blackout', maker: 'ブラームス (BRAHMS)', model: 'ブラインドシェード ハイゼットトラック S500P/S510P フロント3面セット',
    size: [1300, 15, 700], kg: 1.2, jpy: 19580, qty: 1, where: 'アイズ公式 / Amazon.co.jp / 楽天。Vehicle-specific, cut to pattern — allow 1-2 weeks if the S500P/S510P pattern is not on the shelf.',
    mount: 'No fixings, and that is the design: a semi-rigid mesh panel with neodymium magnets sewn into the hem that grip the painted steel window surround of the cab. Nothing is screwed, suckered or taped to glass. This covers the cab only — the camper shell\'s own glazing does NOT need a separate curtain track, because the Dometic S4 windows below carry an integral Rastrollo pleated blackout in the inner frame. That avoids a curtain rail across the gullwing panels, which would foul the props.',
    capture: true,
    conf: 'medium',
    note: 'Confirm the pattern matches your cab generation (S500P/S510P vs the older S201P) before ordering — an aiz shade is cut per body code and will not fudge. Price estimated.',
  },
  {
    cat: 'cooking / stove', maker: '岩谷産業 (Iwatani)', model: 'カセットフー タフまる CB-ODX-1',
    size: [343, 129, 284], kg: 2.4, jpy: 9800, qty: 1, where: 'ヨドバシ・ドット・コム / Amazon.co.jp / コーナン / カインズ。Staple item, always in stock.',
    mount: 'No threaded inserts, no bolt holes, no flange — a sheet-steel body on four rubber feet, and the maker explicitly forbids modifying or enclosing it. Capture, do not fasten: rout a 350 x 290 x 25 mm well into the porch worktop lined with 1.0 mm stainless, so the stove drops in and cannot slide while cooking on the dropped tailgate. For travel, one 25 mm cam strap over the body to two M6 rivet-nut D-rings either side of the well. The CB-250-OR cassette must be removed and stowed separately before driving — the magnetic cartridge holder is a gas seal, not a travel restraint, and a cartridge left in a hot cab is the single worst failure mode in this whole module. Keep 150 mm clear of any wall and never build a surround.',
    capture: true,
    conf: 'high',
    note: 'Double windbreak ring and a wide-body burner mean it actually works on an open porch, which the flat ジュニアバーナー does not. Iwatani has no true twin-burner cassette stove in this class; two タフまる is the honest twin-burner answer if you need it, at 4.8 kg.',
  },
  {
    cat: 'water / tank', maker: 'モノタロウ (MonotaRO)', model: 'ポリタンク 白 20L (食品衛生法適合)',
    size: [350, 416, 178], kg: 1.4, jpy: 3078, qty: 2, where: 'MonotaRO (own-brand polytank, 20 L white food-grade). Next-day in Tokyo. コーナン PRO equivalent is interchangeable.',
    mount: 'Handle aperture and the moulded body — no inserts, no flange. The moulded handle is rated to carry 20 kg by hand and nothing more, so it is a strap route, not a structural anchor. Build a three-sided 12 mm ply well under the porch deck sized 360 x 245 per tank with a hinged ply lid closing the fourth side, and run one 25 mm webbing strap through each handle to an M8 eye bolt through the floor on a 40 x 40 x 3 mm washer plate. 40 kg of water is the largest movable mass in the module and it sits high in a short-wheelbase kei truck — strap it, and put it as far forward and as low as the porch deck allows.',
    capture: true,
    conf: 'medium',
    note: 'Two 20 L tanks rather than one 40 L: 20 kg is the most a person carries to a tap, and one tank can be the grey-water catch. Generic own-brand deliberately, per the no-invented-model rule — a コーナン or ヒシエス equivalent is the same part. Price is per tank.',
  },
  {
    cat: 'water / pump', maker: 'SEAFLO', model: 'SFDP1-012-035-21 12V ダイヤフラム自吸式給水ポンプ (約4.5 L/min, 35 PSI, 圧力スイッチ付)',
    size: [180, 100, 100], kg: 1.2, jpy: 8800, qty: 1, where: 'Amazon.co.jp (SEAFLO日本正規取扱) / 楽天。In stock. Exact SFDP1 suffix (flow/pressure variant) must be confirmed at order — do not order on the designation above alone.',
    mount: 'Four M5 bolt-through holes in the moulded base plate, on rubber isolator bushes — that IS the approved and only mount, and the isolators are the reason it is quiet. Bolt through 12 mm ply with M5 x 30 stainless and nyloc nuts, tightened until the bush just seats and NO further; crush the rubber and the whole shell becomes a soundboard at 3 a.m. Never clamp the pump head or the motor can. Plumb both ports with 1/2" flexible hose and a short loop, not rigid pipe, or the isolators are bypassed.',
    conf: 'medium',
    note: 'Confidence is low only on the exact SFDP1 variant code — SEAFLO is a real, widely stocked brand and any 3-4 L/min 12 V diaphragm pump with a pressure switch works here. Rejected the foot pump (Whale Babyfoot GP4618, four bolt-through feet, no electrical load) purely because the sink sits on the porch and a foot pump wants a fixed footwell. A foot pump is the better answer if you want zero draw.',
  },
  {
    cat: 'water / sink', maker: 'カクダイ (KAKUDAI)', model: '丸型手洗器 φ300 × 深100（はめ込み／アンダーカウンター仕様）+ 折りたたみ水栓',
    size: [300, 100, 300], kg: 1.4, jpy: 25000, qty: 1, where: 'カクダイ取扱の水道材料商 / モノタロウ。493-338 は同寸の置型（オーバーカウンター）で、そちらは在庫豊富。',
    mount: 'A drop-in bowl hangs on its own rim and is pulled down onto a silicone bed by four clips under the worktop — the rim IS the fixing and there is no other. Cut the 40 mm top for a 290 mm hole and take a 30 x 3 mm hardwood ring right round the underside of the cut, because a 300 mm hole in a 1800 mm worktop over a slide-out galley is a hole where the stiffness was, and the ring puts it back.',
    conf: 'low',
    note: 'The verified over-counter part, カクダイ 493-338, stands 100 mm PROUD of the top. There is no 100 mm to be had here: the bunk deck hangs 40 mm above the worktop when the lid is down, so nothing on this counter may stand up at all. That is also why the tap folds and the hob lives in the locker. Price is carried across from 493-338; the drop-in variant is the same bowl in a different rim and will be within a few thousand yen either way.',
  },
  {
    cat: 'cold / 12V compressor fridge', maker: '澤藤電機 (ENGEL)', model: 'MHD14F-D (14 L, DC12/24V + AC100V, swing motor)',
    size: [442, 398, 284], kg: 11.5, jpy: 64900, qty: 1, where: 'ENGEL正規販売店 / Amazon.co.jp / ヨドバシ。Usually in stock; ENGEL runs periodic backorders on the small bodies, allow 2 weeks.',
    mount: 'The case has moulded carry handles and moulded feet, and no threaded inserts anywhere on the shell — the swing compressor and its charge sit directly behind that skin, so a screw into the case is a scrapped fridge. ENGEL\'s own tie-down bracket, which captures the case rather than piercing it, is the sanctioned hardware; absent that, build a three-sided 12 mm ply cradle with a 15 mm EVA foam liner and run two 25 mm cam straps over the lid seam to four M6 rivet-nut anchors in the deck. Leave 50 mm clear air at the condenser end and do not box it in — a fridge in a sealed locker in a Japanese August draws its rated current continuously and flattens the DELTA 2 overnight.',
    capture: true,
    conf: 'medium',
    note: 'Chosen for mass, not volume: a swing-motor ENGEL at 9.5 kg and ~1 A average is the cheapest cold per kilo here, and it is a Japanese product with Japanese service. 14 L is genuinely small for two people — the honest upgrade is the ENGEL MT-series or a Dometic CFX3 25 at ~12.7 kg and roughly +35,000 yen. Dimensions and price estimated.',
  },
  {
    cat: 'power / battery station', maker: 'EcoFlow', model: 'DELTA 2 (1024 Wh LiFePO4, 1500 W AC出力)',
    size: [400, 281, 211], kg: 12, jpy: 110000, qty: 1, where: 'EcoFlow公式ストア / Amazon.co.jp / ヨドバシ。Always in stock, frequently discounted below list.',
    mount: 'Literally no mount points — moulded shell, two recessed grab handles, four rubber feet, and the handles are explicitly NOT rated tie-downs. Floor-mount it at the bulkhead in a 410 x 220 mm ply well with 20 mm EVA underneath, restrained by two 38 mm cam-buckle straps passing over the case (over the body, not through the handles) down to four M8 stainless eye bolts through the plinth into a 4 mm steel backing plate. Keep it on the floor and forward: 12 kg loose at bunk height in a rollover is the argument that decides this. Its vents are on the two short ends — 100 mm clear both ends or it throttles.',
    capture: true,
    conf: 'high',
    note: 'LiFePO4 matters more than the headline Wh in a vehicle that will bake in a コインパーキング. Rejected Jackery 1000 New (1070 Wh, 10.8 kg, near-identical) only because DELTA 2\'s XT60 solar input and the WAVE 2 pairing keep the whole electrical side one ecosystem. Running the WAVE 2 aircon flat out, this is roughly 1 hour — plan a DELTA 2 Extra Battery or accept the fan-only night.',
  },
  {
    cat: 'power / solar', maker: 'Renogy', model: '100W フレキシブルソーラーパネル（単結晶・薄型）',
    size: [1050, 3, 540], kg: 2, jpy: 19800, qty: 2, where: 'Renogy Japan公式 / Amazon.co.jp。In stock. Confirm the current flexible-series part code at order — Renogy renumbers the flexible line often.',
    mount: 'The panel ships with six pre-drilled 8 mm grommet holes around the perimeter, and on a pop-top lid you must NOT use them. Through-bolting a flexing FRP lid gives you six leak paths and a cracked cell layer inside two seasons. Approved method here is a full-face adhesive bond: abrade and prime the lid, lay continuous beads of Sikaflex-252 (or 3M VHB 5952 tape in a grid), weight the panel down for 24 h, then fillet the whole edge with Sikaflex-221 so no water sits under the laminate. Cable exits through a proper deck gland, not a drilled hole with sealant smeared over it. Two panels, one each side of the roof vent.',
    conf: 'medium',
    note: 'Semi-flexible at 2.0 kg each rather than a 100 W rigid framed panel at 7 kg: the pop-top lid rises on its own props and every kilo up there is a kilo the props and the bellows fight. Trade-off is real — bonded flexible panels run hot against the lid and lose 10-15% yield versus an air-gapped rigid frame, and they are not repairable. 200 W is roughly a day\'s fridge plus lights in Kanto shoulder season.',
  },
  {
    cat: 'climate / air conditioner', maker: 'EcoFlow', model: 'WAVE 2 (ポータブルエアコン, 冷房 5100 BTU / 暖房 6100 BTU)',
    size: [518, 336, 297], kg: 14.5, jpy: 143000, qty: 1, where: 'EcoFlow公式ストア / Amazon.co.jp。In stock, heavily discounted in autumn.',
    mount: 'No mount points: four rubber feet, two side grab handles, and moulded duct collars — the collars take ducting only and will not take load. It rides on the floor at the tailgate end in a 530 x 310 mm ply well and straps down with two 38 mm cam straps to M8 eye bolts through the deck on backing plates. In use, the hot-side exhaust duct passes through a 130 mm bulkhead port cut in the porch face and closed with a ply blanking plug when stowed; condensate drains through the spigot into a hose exiting the floor through a bulkhead gland. Never run it ducted into the cabin volume it is cooling.',
    capture: true,
    conf: 'medium',
    note: 'It fits the weight budget but it eats the whole energy budget: ~1 hour on the DELTA 2 alone, so this is a hook-up-site and shoulder-season item, or it needs the DELTA 2 Extra Battery. The honest alternative for a free camp is the MaxxFan below on reverse-draw plus the flyscreen — that is 3 W, not 500. Included because you asked whether one exists in budget: it does, at 14.5 kg.',
  },
  {
    cat: 'lighting / 12V LED', maker: '汎用 (モノタロウ / Amazon.co.jp 取扱)', model: '12V LEDテープライト 電球色 3000K IP65 5 m + アルミチャンネル・拡散カバー 1 m × 4',
    size: [5000, 12, 10], kg: 0.4, jpy: 4200, qty: 1, where: 'モノタロウ / Amazon.co.jp。常時在庫。チャンネルは 1 m 押出材を切って使う。',
    mount: 'Self-adhesive backing, which is not a fixing on a vehicle: 3M tape lets go the first hot afternoon over a galley. Run the tape inside an anodised aluminium channel and screw the CHANNEL to the carcass with M3 countersunk into pilot holes every 250 mm. The channel is also the heatsink and the diffuser, so it is not trim.',
    conf: 'low',
    note: 'The first draft named an エーモン 12 V tape at 600 mm. amon make 15, 30 and 45 cm only — 2704, 2705, 2709 — and their white is 8000 K, which is a headlamp colour and wrong for a bed. A generic 3000 K reel in channel is what actually gets fitted.',
  },
  {
    cat: 'safety / CO alarm', maker: '輸入品 (Amazon.co.jp / モノタロウ 取扱)', model: '一酸化炭素警報器（EN 50291 または UL 2034 表示の電池式）',
    size: [100, 100, 35], kg: 0.2, jpy: 4000, qty: 1, where: 'Amazon.co.jp / モノタロウ。国内メーカー品が存在しないので、輸入品を EN/UL 表示で選ぶ。',
    mount: 'Keyhole slots and two screws into the wall — a real fixing, and it belongs at head height near the bunk rather than at floor level: CO is close to air density and a low mount is a smoke-alarm habit applied to the wrong gas.',
    conf: 'low',
    note: 'The first draft credited this to 新コスモス電機 with EN 50291. They make 住宅用火災警報器 and industrial CO detectors, not a household CO alarm, and Japan has no approval scheme for one at all — EN 50291 is European. So it is an imported EN- or UL-marked unit, bought on that marking. Fit a 住宅用火災警報器 as well: a cassette stove in a 2.7 m² box with the lid down is the one place on this truck where both matter.',
  },
  {
    cat: 'ventilation / roof vent', maker: 'MaxxAir', model: 'MaxxFan Deluxe 6200K (10段可変・双方向・リモコン・雨天走行可能フード)',
    size: [586, 236, 417], kg: 4.5, jpy: 72000, qty: 1, where: 'オグショー (OGUshow) / VANTECH / Amazon.co.jp の並行輸入。Often on backorder from the US — allow 2-4 weeks. Fiamma Turbo-Vent Premium is the直接的な代替 at a similar price.',
    mount: 'The flange IS the mount, and this is the one item that dictates structure before it dictates hardware. Cut a 355 x 355 mm (14" x 14") opening in the hard shell roof — the fixed shell, not the pop-top lid, which flexes and would work the seal loose. Frame a 30 x 30 mm hardwood kerb right around the opening and laminate it in BEFORE cutting the skin. Bed the vent\'s outer flange on continuous butyl tape and screw through with #8 x 25 mm stainless pan screws at ~100 mm centres into that kerb, then fillet the flange edge with a self-levelling roof sealant. The internal garnish ring screws up into the flange from below and is what carries the ceiling lining — it takes trim weight only.',
    conf: 'medium',
    note: 'The lid design is the reason for this over a plain 40 x 40 vent: it runs open in rain and at speed, so you can drive with it extracting. It is also the whole fan strategy — reverse-draw plus the porch flyscreen is 3 W of cooling versus 500 W for the WAVE 2. Price is a Japanese parallel-import estimate; the US list is far lower.',
  },
  {
    cat: 'glazing / camper windows', maker: 'Dometic (Seitz)', model: 'SEITZ S4 900 x 450（アクリル二重窓・網戸+遮光プリーツ内蔵）',
    size: [900, 450, 60], kg: 8.5, jpy: 68000, qty: 2, where: 'オグショー / ホワイトハウス / VANTECH ほか国内キャンピングカー部材商社。Made-to-order sizes; allow 3-6 weeks from Europe.',
    mount: 'A sandwich-clamp frame — no fastener ever touches the acrylic, which is the entire point of buying a caravan window rather than glazing a hole yourself. The outer frame goes in from outside onto a bead of butyl/sealant; the inner frame, which carries the Rastrollo pleated blackout blind and the cassette flyscreen, screws to the outer frame from inside and clamps the wall between the two. S4 accepts a wall thickness of roughly 26-42 mm, so the gullwing panel core MUST be built to that band or the window simply will not clamp — decide the window before you decide the panel sandwich. Cut-out is nominal size +2 mm with radiused corners; square corners crack the panel skin.',
    conf: 'medium',
    note: 'One per gullwing. These carry the blackout and the bug screen internally, which is why no curtain track is needed across the gullwings — a track there would foul the props. The acrylic scratches and yellows and is the maintenance item; that is the accepted price for 5.5 kg instead of ~14 kg of glass. Price and mass per unit are estimates.',
  },
  {
    cat: 'safety / fire extinguisher', maker: 'モリタ宮田工業 (Morita Miyata)', model: 'MVF1HB 住宅用消火器「キッチンアイ」（強化液・中性 1.0 L）',
    size: [85, 375, 145], kg: 2.2, jpy: 5800, qty: 1, where: 'コーナン / カインズ / Amazon.co.jp / MonotaRO。In stock. Note the 5-year design life stamped on the body.',
    mount: 'Supplied with its own wall hanger/bracket — that bracket is the approved provision and the only one; the cylinder itself has no fixing feature and must never be banded, clamped or hose-clipped to a frame member, because a dent in a pressurised cylinder wall is a condemned extinguisher. Screw the bracket with two M5 pan screws into a hardwood or 18 mm ply pad, not into shell skin. Site it within 600 mm of the porch step so it is reachable from OUTSIDE the camper — a fire at the stove is between you and an extinguisher mounted deep inside.',
    capture: true,
    conf: 'medium',
    note: 'Wet-chemical/強化液 rather than ABC powder on purpose: powder in a 1120 mm-headroom box coats every soft good you own and the fire you are actually planning for is a cassette-stove cooking-oil fire, which is what 強化液 is formulated for. Exact catalogue suffix not verified this session — buy on the 住宅用消火器 marking and the 天ぷら油 rating.',
  },
  {
    cat: 'safety / first aid', maker: '日進医療器（リーダー）', model: '救急セット（携帯用ケース入り）',
    size: [270, 90, 190], kg: 0.9, jpy: 3200, qty: 1, where: 'MonotaRO / Amazon.co.jp / マツモトキヨシ。In stock. A 白十字 or ミドリ安全 kit of the same class substitutes directly.',
    mount: 'A soft or moulded case with a carry handle and no fixings of any kind. Two options, both non-invasive: bond a 100 mm strip of loop tape into a shallow wall pocket and a matching hook strip to the case back (the case is the consumable, not the wall), or stow it in the same cabover nose locker as the sleeping bags under the shockcord net. It must be findable in the dark from the bunk — put it at the head end, not in the porch locker.',
    capture: true,
    conf: 'medium',
    note: 'Restock it as a camper kit rather than a car kit: add burn gel for the stove, tweezers and a triangular bandage, and keep a 保険証 copy and the 消防 119 procedure card in the lid. Whole-module mass runs roughly 90 kg dry plus 40 kg of water, before the shell structure itself and two occupants — against a 350 kg payload the shell is the number to watch, not this list.',
  },
]

// --- SHARED HARDWARE ---------------------------------------------------------
// The mechanical parts every module uses. Priced once, since only one module is
// on the truck at a time and the jacks, the subframe and the tie-downs stay.
// --- SHARED ------------------------------------------------------------------
// The ironmongery every module runs on, and the stock sections the custom
// framing is cut from. This is the list that makes "hinges and framing can be
// custom" into something a fabricator can quote.
//
// Read the mount column here as the inverse of the gear lists: these parts are
// ALL mount point, and the failure mode is using them wrong. A piano hinge has a
// factory hole line and drilling near the knuckle ruins it. A heavy slide is
// rated only if every hole is used and the pair is parallel within a millimetre.
// A gas spring is a 100-bar pressure vessel with two threaded ends and no third
// attachment anywhere. Plywood has no fixings of its own — it is the thing you
// put fixings INTO, which is why the insert line exists.
//
// Every line here went back out to be checked, and the hardware list is where
// that paid best. Three Takigen part numbers named sizes the series does not
// make. A gas spring was priced at half its list. The trim seal was a series
// that does not exist. And the one that mattered: the platform slide had been
// written up as a 100 kg-plus pair on the strength of Accuride's American
// reputation, when the C3832 is a medium-duty rail derating to about 33 kgf per
// pair at full extension — a slide chosen off a remembered figure rather than
// the extension-derated one is how fold-out decks fail.
//
// Confidence is still worth reading. Where a price came off the maker's own page
// it says high; where the part is catalogue-real and the yen is inferred from a
// neighbouring size it says medium, and it is marked rather than dressed up.
export const SHARED = [
  {
    cat: 'piano hinge (stainless)', maker: 'タキゲン製造 (TAKIGEN)', model: 'B-1007-12 ステンレス長蝶番 (SUS304, 幅50 × 板厚1.5 × L1000)',
    size: [1000, 50, 1.5], kg: 0.74, jpy: 4498, qty: 8, where: 'タキゲン直販／WEBショップ takigen.co.jp 品番 B-1007（幅25/32/38/50 × 板厚0.8/1.5/2.0 × 長さ120〜1800 の組合せで枝番 B-1007-1〜-54）。カタログ標準在庫、1〜3営業日出荷。MonotaRO でもタキゲン扱いあり。長尺は別途送料。',
    mount: 'Approved provision is ONLY the factory hole line: ø3.5 at 20 mm pitch down both leaves. That is an M3 or M4 countersunk screw — an M5 will not go through, which is worth knowing before you buy the fasteners. Do not drill new holes within about 10 mm of the knuckle and never drill through the barrel. Into 15 mm plywood run M4 × 25 SUS pan-heads right through the leaf, the ply and a 25 × 3 mm SUS backing strap; wood screws into a 15 mm panel pull out the first time a 60 kg wing folds down. With 20 mm pitch you have plenty of holes, so use every third one and you still have a fixing every 60 mm. The hinge is designed to be cut to length: cut between holes, deburr, and passivate the cut end. The barrel itself is not a mount point — no clamps, no straps around it.',
    conf: 'medium',
    note: 'Model, material, widths/thicknesses and length range verified on Takigen\'s product page; price is estimated. B-7-12 is the identical geometry in SPCC zinc-chromate at ¥2,498 — 56 per cent of the SUS price, not the third it is easy to assume, so use B-7 on dry interior fold lines and keep SUS304 for the weather side.',
  },
  {
    cat: 'lift-off butt hinge (stainless)', maker: 'タキゲン製造 (TAKIGEN)', model: 'B-1065-10 ステンレス抜差蝶番 穴あき (SUS304, 幅100 × 全長125 × t4)',
    size: [100, 125, 4], kg: 0.28, jpy: 2474, qty: 12, where: 'タキゲン直販 takigen.co.jp 品番 B-1065（B-65 の SUS304 版）。標準在庫、1〜3営業日。',
    mount: 'Bolt-through holes in each leaf only — typically 4 × ø7 for M6, or ø9 for M8 on the heavy sizes. That drilled pattern is the whole approved provision; the leaf is not to be welded (it is a polished SUS304 leaf carrying the panel and welding needs re-passivation). Loose-pin geometry means the male/pin leaf must go on the FIXED frame so the panel lifts off upward — mount it the other way and the panel drops off over a bump. Use three hinges minimum on a 60–80 kg panel and load-share by shimming so all three barrels are collinear within ~0.5 mm; two hinges out of line puts the whole panel on one.',
    conf: 'medium',
    note: 'Series and material verified on Takigen; the exact size枝番 and price are estimated. B-1365 (超重量用厚口, 150–200 mm tall × 120–160 mm wide, SUS304) is the same family scaled for ship and floodgate doors — genuinely rated far past 80 kg but physically far too big and expensive for a kei-truck fold-out.',
  },
  {
    cat: 'weld-on lift-off hinge (stainless)', maker: 'タキゲン製造 (TAKIGEN)', model: 'B-1026-2 ステンレス両抜旗蝶番 超重量用厚口 (全長114)',
    size: [114, 65, 12], kg: 1.3, jpy: 7488, qty: 8, where: 'タキゲン直販 takigen.co.jp 品番 B-1026（B-26 の SUS304 版）。受注生産寄り、目安 3〜7営業日。',
    mount: 'This is the one with LITERALLY NO SCREW HOLES. A 旗蝶番 (flag hinge) is a weld-on part: the approved provision is a full fillet weld of each half to steel or stainless, all round the flag plate. So it cannot touch plywood directly — it needs a steel sub-frame. The buildable path is: weld both halves to a 4.5 mm SUS304 or SS400 angle (40×40 or 50×50), then bolt that angle to the HFS5-4040 extrusion with M8 through the T-slot, or through-bolt it to the ply with M8 + 60×60×6 backing plates. Weld first, bolt second — welding an angle that is already bolted to ply sets the ply on fire and warps the bolt line.',
    conf: 'medium',
    note: 'Series verified on Takigen\'s 抜差蝶番 category page (両抜旗蝶番: B-3/B-1003 heavy, B-26/B-1026 ultra-heavy thick). Price and exact dimensions estimated. This is the hinge for the one module face that has to come off completely for servicing.',
  },
  {
    cat: 'platform slide — READ THE RATING', maker: 'スガツネ工業 LAMP / Accuride', model: 'C3832-24 フルエクステンションスライド (ストローク 610 mm)',
    size: [600, 48, 13], kg: 2.3, jpy: 7000, qty: 4, where: 'スガツネ工業 search.sugatsune.co.jp（LAMP 扱いの Accuride C3832）。ストローク 250–700 mm。3〜10営業日。',
    mount: 'Both members carry a full row of round and slotted bolt-through holes for M5/M6, and those holes are the entire approved provision — every one of them is meant to be used. The cabinet member must sit on a flat, continuously supported face, never on a plywood edge or a spacer stack, and the two rails of a pair must be parallel within about a millimetre or the ball retainers bind. Never drill extra holes: the raceway is directly behind the web.',
    conf: 'medium',
    note: 'THE RATING IS THE FINDING HERE. The first draft called this a 100 kg-plus pair on the strength of Accuride\'s American 500 lb reputation. The C3832 is a MEDIUM-duty side-mount rail: 441 N per pair at best, about 324 N (33 kgf) at 600 mm of extension. It will carry a battery drawer or a stove tray and it must never carry the 60–80 kg standing platform. For that, the sound module\'s LAMP 3509-24 at 2117 N per pair is the right class, or 日本アキュライド C3441 at roughly ten times this price. A slide chosen off a remembered figure rather than the extension-derated one is how fold-out decks fail.',
  },
  {
    cat: '3-stage slide (mid duty)', maker: 'スガツネ工業 LAMP', model: '3618-700 (3段引きスライドレール, 全長700 mm)',
    size: [700, 36, 12.7], kg: 2, jpy: 2820, qty: 6, where: 'スガツネ工業 search.sugatsune.co.jp 品番 3618-700。¥2,820 税別 / ¥3,102 税込（1セット）。150〜700 mm を50 mm刻み、黒染 BL 仕様は 150〜600 mm。カタログ在庫品。',
    mount: 'Bolt-through / screw holes down both members only; no clamping, no welding, no drilling. Same rule as the 3832: continuous flat backing and a parallel pair. On a kei-truck this rail wants its own 12 mm ply cheeks tied top and bottom to the frame, otherwise bed flex twists the pair and it jams closed on a corner.',
    conf: 'high',
    note: 'Model and price read directly off Sugatsune\'s own product page — the one fully verified price in this list. Rated well under 100 kg per pair (mid-duty class), so use it for the stove tray, the battery drawer, the tool drawer; NOT for the 60–80 kg standing platform, which is what line 4 exists for.',
  },
  {
    cat: 'gas spring', maker: '不二ラテックス (FUJI LATEX)', model: 'FGS-19-250-BB-300（φ19 チューブ／ストローク250 mm／反力300 N）',
    size: [564, 19, 19], kg: 0.35, jpy: 9800, qty: 8, where: '不二ラテックス fujilatex.co.jp（ガススプリング FGS シリーズ）、流通は MonotaRO / ミスミ / 機械商社。反力は10 N刻みで指定、ストロークは20〜750 mm。指定品につき目安 5〜10営業日。',
    mount: 'The strut\'s approved provision is the male thread at each end (M8 on the φ19 size) — nothing else. Never clamp, strap or drill the tube: it is a sealed pressure vessel at well over 100 bar and a hose clamp on the barrel scores the seal path. End fittings screw onto those threads, and the load then transfers to a ball stud (next line). Mount rod-end DOWN so the piston seal stays in oil, and set the geometry so the strut is never side-loaded — a gas spring is an axial-only part and a bent rod is a scrapped rod. For a 30 kg lid hinged at the back, two struts of ~300 N each with the pivot ~60–80 mm off the hinge line is the usual starting point; buy one pair, measure, then order the rest at the corrected force.',
    conf: 'medium',
    note: 'Series names (FGS-10/12/15/19/22/28, SUS and vacuum variants), the 10 N force increments and the stroke range are verified on Fuji Latex\'s own page; the specific stroke/force suffix format and the price are estimated. Chose a Japanese maker over Stabilus Lift-O-Mat because the 10 N-step made-to-order force is exactly what you need when the lid mass is still moving during the build.',
  },
  {
    cat: 'gas spring end fittings', maker: '不二ラテックス (FUJI LATEX)', model: 'ガススプリング用 ボールスタッド（M8 おねじ軸）＋ ボールソケット（M8 めねじ）',
    size: [45, 16, 16], kg: 0.03, jpy: 950, qty: 16, where: '不二ラテックス純正付属品として同時手配、または ミスミ / MonotaRO のガススプリング用ボールスタッド。ストラット本体と同時発注が確実。',
    mount: 'The ball stud IS a fastener: an M8 male shank that goes through an 8.5 mm bolt-through hole in the frame with a nyloc and a flat washer on the back, or screws into an M8 threaded boss. On plywood this is the one place a 鬼目ナット is NOT good enough — the socket loads the stud in bending, so it needs a through-bolt with a backing plate, or the stud tapped into a 6 mm steel tab welded/bolted to the frame. Eyelet (アイ型) ends bolted through a clevis are the stiffer alternative if the geometry has no side load. Ball sockets clip on and clip off with a screwdriver — that is a feature: it lets you swap strut force without dismantling the lid.',
    conf: 'low',
    note: 'Fuji Latex confirm their FGS ends are threaded and the fittings are replaceable, but the accessory part numbers could not be pinned down without search — do not order blind, ring the distributor with the strut spec and let them quote the matching stud/socket set.',
  },
  {
    cat: 'over-centre / draw latch', maker: 'タキゲン製造 (TAKIGEN)', model: 'C-174-S クランプファスナー（締込み式ファスナー）',
    size: [110, 30, 22], kg: 0.15, jpy: 1800, qty: 12, where: 'タキゲン直販 takigen.co.jp 品番 C-174-S。同ファミリーに C-124、C-432-A（折りたたみレバークランプ）、C-1174-T（SUS T型クランプ錠）。標準在庫、1〜3営業日。',
    mount: 'Two-part latch: the lever body and the strike each have their own bolt-through hole pattern (typically 2 × ø5.5 for M5). Those four holes are the whole approved provision. An over-centre latch only develops its clamping preload if the two halves sit within a couple of millimetres of the designed spacing — shim with washers under the strike to tune it, do NOT slot the holes to make it fit, because a slotted hole lets the latch walk under vibration and it will be loose by the far end of the Chuo Expressway. Through-bolt into 鬼目ナット or a backing plate; a latch is a cyclic load and a screw in ply will egg out its hole.',
    conf: 'medium',
    note: 'Model verified on Takigen\'s 締込み式ファスナー category page; price estimated. C-1174-T is the stainless one in the family — spend the extra on the two latches that live on the outside face and use C-174-S internally.',
  },
  {
    cat: 'rated hasp', maker: 'モノタロウ (MonotaRO PB)', model: 'ステンレス製 掛金（ハスプ）※SKU未確認 — 全長130 mm クラス、南京錠対応',
    size: [130, 45, 3], kg: 0.15, jpy: 1200, qty: 4, where: 'MonotaRO / コーナン / カインズ 店頭。ステンレス掛金は常時在庫、当日〜翌日。',
    mount: 'A hasp\'s provision is bolt-through holes only, and the only ones worth having are the pattern where the staple plate hides its own fixings when the hasp is closed and locked. It MUST be through-bolted — M6 SUS carriage bolts with a 40×40×3 washer plate on the inside face. A hasp screwed to plywood is decoration: the failure mode is the whole plate tearing out with the ply face veneer still attached to it. Fit it so the shackle takes shear, not prising, and put a second one at the far end rather than one big one in the middle.',
    conf: 'low',
    note: 'Could not pin a specific SKU — web search was unavailable in this session, so this is deliberately a generic-but-real home-centre/MonotaRO stainless hasp bought by dimension over the counter rather than an invented model number. Takigen\'s 止め金 range (AC-25 / AC-1025 series) is real and stainless but those are cam-lock tongues used with a 平面ハンドル, not padlockable hasps — the wrong part for this job.',
  },
  {
    cat: 'stabiliser jack / corner steady', maker: 'モノタロウ (MonotaRO) 取扱', model: 'ねじ式スクリュージャッキ（トレーラー用サイドジャッキ相当）※SKU未確認、静荷重500 kg/脚クラス',
    size: [90, 320, 90], kg: 2.6, jpy: 4980, qty: 8, where: 'MonotaRO / Amazon.co.jp のトレーラー用品。ねじ式コーナーステディは国内では輸入品が中心、在庫変動あり、目安 2〜7日。',
    mount: 'Trailer corner steadies ship with a bolt-through mounting flange, typically 4 × ø11. That flange is the entire provision — the tube and the screw are not mount points. The flange has to land on the steel sub-frame or on a 6 mm steel plate through-bolted to the extrusion; bolted straight to plywood it will punch through, because the leg puts a concentrated point load in exactly the direction ply is weakest. Use M10 through-bolts with 60×60×6 washer plates on the inside. Critically: these are STEADIES, not jacks — wind them down to just past contact to stop the bed rocking when someone steps onto a fold-out. Do not use them to lift the Hijet; the 350 kg payload rating says nothing about point loads through a jack pad.',
    conf: 'low',
    note: 'Real product class, widely sold in Japan, but no verifiable model number without web search — flagged low rather than fabricating one. Rejected alternative: Misumi levelling feet / アジャスターボルト, which are cheaper and definitely real but have far too little travel to take up the 30–60 mm of ground unevenness a truck parks on.',
  },
  {
    cat: 'aluminium extrusion (structural)', maker: 'ミスミ (MISUMI)', model: 'HFS5-4040（アルミフレーム 5系列 40×40、指定長カット）',
    size: [1000, 40, 40], kg: 1.35, jpy: 1400, qty: 12, where: 'ミスミ jp.misumi-ec.com 型番 HFS5-4040-1000（1 mm単位の指定長カット可、カット費別途）。標準出荷 目安3日。表面処理は白アルマイト／黒アルマイト等を選択。',
    mount: 'The extrusion\'s provision is its four T-slots plus optionally tapped ends — and that is deliberate: you never drill it. Every bracket, hinge sub-plate and panel bolt lands on a post-assembly nut in the slot (next line). Bolting a ply panel to the slot requires a washer that spans the slot lip; a bare M5 socket head will pull through the lip under a shock load. End-tapping for M8 is a Misumi option (counterbore + tap) — order it with the cut, because tapping a 40×40 end square by hand in the field is miserable. For the 60–80 kg fold-outs, 4040 is the minimum section for any member that cantilevers more than ~500 mm.',
    conf: 'medium',
    note: 'HFS5 series and the cut-to-length service verified on Misumi; the 4040 price is scaled from the 2020 page and is an estimate. Mass ~1.35 kg/m matters: the whole four-module frame in 4040 must be budgeted against the Hijet\'s 350 kg payload before any gear goes in.',
  },
  {
    cat: 'aluminium extrusion (light)', maker: 'ミスミ (MISUMI)', model: 'HFS5-2020（アルミフレーム 5系列 20×20、指定長カット）',
    size: [1000, 20, 20], kg: 0.5, jpy: 510, qty: 20, where: 'ミスミ jp.misumi-ec.com 型番 HFS5-2020-1000。ページ記載で 1000 mm の指定長が概ね ¥220〜380（表面処理・数量で変動、カット費別）。標準出荷 目安3日。',
    mount: 'Same T-slot logic as the 4040, sized for M5 post-assembly nuts. Because 2020 has a single slot per face, a bracket on it can only be located, not triangulated — so treat 2020 as door frames, screen rails, awning battens and cable runs, never as anything a person stands on or that a 30 kg lid hangs off. Corner brackets (Misumi HBLFSN5 family) bolt into the slot and are the approved way to make a joint; a self-tapper into the slot is not.',
    conf: 'medium',
    note: 'Part number, 20×20 square section and 0.5 kg/m verified on the Misumi product page; the exact yen figure moves with surface treatment, quantity tier and the per-cut charge, so budget ~¥500/m delivered rather than the headline number.',
  },
  {
    cat: 'extrusion T-nuts', maker: 'ミスミ (MISUMI)', model: 'HNTP5-5（5系列 後入れスプリングナット M5）',
    size: [10, 6, 10], kg: 0.004, jpy: 86, qty: 300, where: 'ミスミ jp.misumi-ec.com 型番 HNTP5-5。単品／まとめ買い設定あり、標準出荷 目安3日。',
    mount: 'This part IS the mount-point provision for the whole extrusion frame — it is what makes a T-slot into a threaded hole. Drops into the slot after the frame is assembled and springs/rotates to lock, so you can add a bracket later without dismantling. Stay on M5×0.8 in a 5-series slot, torque to the slot\'s rating (not the bolt\'s — the aluminium lip yields long before an SUS M5 does), and never stack two nuts at one position hoping to double the load. Where the joint is genuinely structural, use two nuts spaced apart on the same slot rather than one nut torqued harder.',
    conf: 'medium',
    note: 'Part number and function verified as Misumi\'s standard 5-series post-assembly nut; unit price estimated. HNTT5-5 (pre-insert T-nut) is cheaper per piece but must be threaded in before the frame closes — buy 30% more of whichever you choose than the drawing says, because they get dropped inside sections and lost.',
  },
  {
    cat: 'structural plywood', maker: 'JAS認定各社（セイホク等）', model: '構造用合板 針葉樹 12 mm × 910 × 1820（F☆☆☆☆、2級）',
    size: [1820, 910, 12], kg: 11, jpy: 2180, qty: 10, where: 'コーナン／カインズ／ジョイフル本田 店頭、サブロク板は常時在庫。店内カットサービス 1カット ¥50前後、直線カットは前日受付の店舗あり。',
    mount: 'Plywood has NO mount points of its own — it is the thing you create mount points in, and that is the single most important rule in this whole build. Every load path into ply must be one of: (a) a through-bolt with a washer of at least 25 mm diameter or a steel backing plate, (b) an M6 鬼目ナット driven into the FACE (never the edge), or (c) a steel strap or angle sandwiching the panel. Screwing into the 12 mm edge is not a mount point at any load — the edge of 12 mm ply is five glue lines and air. Where a hinge line or slide rail lands, laminate a second sheet locally so the fixing has 24 mm of face to bite, or bond a hardwood cleat behind it.',
    conf: 'medium',
    note: 'Commodity, so there is no model number to get wrong — spec is the JAS grade stamp. Prices moved a lot in 2024–25; ¥2,180/sheet is a mid-2025-ish home-centre figure for 12 mm 針葉樹. シナ合板 (shina-faced, same 910×1820) runs roughly ¥5,500–7,000 at 12 mm and is what you use where the face is seen inside the modules; ラワン sits between. Use 針葉樹 for hidden structure and pay for シナ only on visible faces.',
  },
  {
    cat: 'composite panel (weight saving)', maker: '三菱ケミカルインフラテック', model: 'ALPOLIC / アルポリック 3 mm アルミ樹脂複合板（1220 × 2440）',
    size: [2440, 1220, 3], kg: 14, jpy: 19800, qty: 2, where: '建材商社・看板材料店経由（ジョイフル本田の資材館でも定尺取扱あり）。定尺は在庫、切売り・指定寸法は 3〜7日。',
    mount: 'No fixings of its own and it must not be treated like plywood. The approved provisions are: captured in a channel (the T-slot of the 2020 with a suitable insert, or an aluminium edge trim), or ø4.8 aluminium blind rivets through the face into a frame at ~150 mm pitch. Never rely on a bolt clamping through the panel — the polyethylene core creeps under clamp load and the bolt goes loose within weeks of a vibrating truck bed. If a fitting must land on it, put a steel or aluminium plate on the back and rivet through both.',
    conf: 'low',
    note: 'Product line is real and standard for signage/vehicle bodywork in Japan; the sheet price is an estimate. Worth it only where a panel is large and non-structural — a roof, a door skin, an awning leaf. Rejected: aluminium honeycomb (昭和飛行機工業 アルミハニカムパネル) — genuinely stiffer per kilo but four to six times the price, and only pays back if the panel spans more than ~600 mm unsupported.',
  },
  {
    cat: 'lashing system', maker: 'タキゲン製造 (TAKIGEN)', model: 'C-1998 ステンレスラチェットバックル ＋ C-1994 シリーズ エンドフィッティング',
    size: [180, 70, 45], kg: 0.9, jpy: 14000, qty: 8, where: 'タキゲン直販 takigen.co.jp、ラッシングシステム分類。C-1998（巻取り式ラチェット）、C-1997（オーバーセンター式）、C-996（カムバックル）、C-1994-A〜N（エンド金具）、C-993 系（縫製のみ）。目安 3〜7営業日。',
    mount: 'The buckle is not fastened to the structure at all — it lives inline in the webbing, so it has no mount point and needs none. The mount point is the END FITTING (C-1994 series): a hook or flat plate that the webbing is sewn to, and its rating is only as good as whatever it hooks onto. So this line\'s real mount question is answered by the next one — put rated anchors in the frame first, then pick the C-1994 variant whose throat matches them. Do not hook a lashing end onto an extrusion slot, a handle, or a hinge barrel; none of those are rated for a dynamic strap load.',
    conf: 'medium',
    note: 'Buckle and end-fitting series verified on Takigen\'s ラッシングシステム category page; prices estimated. A plain ラッシングベルト from MonotaRO or a home centre is ¥1,500–3,000 with LC 300–500 kgf and is fine for loose kit; the Takigen SUS system earns its price only on the straps that live permanently outdoors on the module.',
  },
  {
    cat: 'tie-down anchor', maker: 'JIS B 1168 準拠品（MonotaRO PB 等）', model: 'アイボルト SUS304 M12（使用荷重 0.40 t 軸方向）',
    size: [50, 51, 12], kg: 0.12, jpy: 780, qty: 16, where: 'MonotaRO / コーナン 店頭。JIS アイボルトは M8〜M24 まで常時在庫、当日〜翌日。',
    mount: 'An eyebolt\'s rating exists ONLY when it is screwed into a full-depth tapped hole with at least 1.5 × d of thread engagement in steel, pulled along its own axis, and seated hard against the face. None of that is true of plywood, so through ply it needs either a tapped steel boss or a plain nut plus a 60×60×6 backing plate, torqued until the shoulder is bedded. And the moment you side-load it, the 0.63 t drops to roughly a fifth. For any strap that pulls at an angle — which is most of them — use a proper D-ring / eye plate with two to four bolt-through holes instead, so the load goes into a plate in shear rather than into a bolt in bending.',
    conf: 'medium',
    note: 'JIS B 1168 is a real national standard with a published load table, so the designation and rating are solid even though the retailer SKU is generic; price estimated. This is the deliberate choice over inventing a branded D-ring part number.',
  },
  {
    cat: 'threaded inserts for plywood', maker: 'ムラコシ精工', model: '鬼目ナット E タイプ M6 × 13（打込み・ねじ込み式インサート）',
    size: [9, 13, 9], kg: 0.004, jpy: 55, qty: 200, where: 'コーナン／カインズ／MonotaRO／Amazon.co.jp。M4〜M10、鉄・黄銅・ステンレスあり、袋入り常時在庫、当日〜翌日。',
    mount: 'This is HOW you create a mount point in plywood, and it is the part that makes the rest of this list buildable. Drill ø8.7 for M6, drive the E-type in square with a hex key (a crooked insert strips the ply and is unrecoverable). In 12 mm ply an M6 insert holds roughly 1.5–2 kN pulled straight out of the FACE, and a small fraction of that out of the edge — never put one in the edge grain of plywood. For the 60–80 kg fold-outs, either back the insert with a hardwood pad or a 3 mm steel plate, or skip the insert and through-bolt. Set them 25 mm minimum from any panel edge.',
    conf: 'medium',
    note: 'Deliberate correction to the brief: rivnuts are the wrong part for plywood — they need thin, stiff sheet to form a bulge against and simply crush ply. For 1–3 mm sheet aluminium and steel in the frame, ロブテックス (LOBSTER) エビナット with a hand nutter is the right and genuinely available product, but I could not verify a specific エビナット part number without search, so it is named as a family rather than a model.',
  },
  {
    cat: 'stainless fasteners', maker: 'モノタロウ (MonotaRO PB)', model: '六角穴付ボルト ステンレス SUS304 M8 × 30（および M5/M6 各サイズ、ナイロンナット・平座金セット）',
    size: [13, 30, 13], kg: 0.021, jpy: 45, qty: 200, where: 'MonotaRO 通販、箱売り（50本/100本入）。SUS 六角穴付は定番在庫、翌日出荷。ホームセンターのバラ売りは 1本 ¥50〜80 で割高。',
    mount: 'Not applicable — this is the fastener. Two warnings that matter here: SUS304 against aluminium extrusion galls, so use anti-seize or a nylon washer under the head and never re-run a bolt that has picked up. And torque SUS M8 to roughly 18 N·m, not the ~25 N·m you would use on a steel bolt — stainless work-hardens and snaps with very little warning, usually at the worst moment, halfway through assembling a module at a campsite. Buy a box of each size; running out of M6 in a rural home centre on a Sunday is the classic build-stopper.',
    conf: 'medium',
    note: 'MonotaRO own-brand stainless socket-head bolts are a real, catalogued, always-in-stock line; unit price is an estimate around the usual box-quantity rate. Named generically on purpose rather than fabricating a branded fastener part number.',
  },
  {
    cat: 'weather sealing', maker: '岩田製作所 (IWATA)', model: '4100-B-3X16CT-L2 トリムシール（EPDM・バルブ付、対応板厚3 mm、2 m）',
    size: [1000, 22, 14], kg: 0.12, jpy: 2250, qty: 20, where: 'ミスミ jp.misumi-ec.com（岩田製作所ブランド取扱）／MonotaRO。指定長カット対応、目安 3〜5営業日。iwata-fa.jp の「トリム＆トリムシール」分類に EPDM・TPE・PVC の設定あり。',
    mount: 'The good news: this needs NO fasteners at all, which is exactly why it is the right seal for a folding structure. The trim section has a steel-cored U channel that grips a panel edge of a specified thickness, and the bulb sits proud of it. The approved provision is therefore a clean, continuous, correctly-thick edge — so specify the grip range to match what it is going onto. A raw 12 mm ply edge is outside most trim seals\' grip range, so either fit an aluminium edge trim first to bring the edge into range, or order the wide-grip variant. Corners are the failure point: mitre-relieve the channel rather than forcing it round, and finish the run on a straight, so the joint is not on a corner.',
    conf: 'medium',
    note: '岩田製作所 is confirmed as a real Japanese maker of trim and trim-seal in EPDM; the series page returned no populated part list, so the full suffix code is described rather than invented — the trailing digits encode grip thickness, bulb size and cut length and are set at order. Cheaper option is a self-adhesive EPDM D-profile from コーナン at about ¥600 per 2 m, but adhesive-only seals peel at the corners after one summer in a truck bed; the mechanically-gripping trim seal is the one that survives the Hijet.',
  },
]

export const BOM = {
  'sound-system': SOUND,
  yatai: YATAI,
  hokora: HOKORA,
  cabin: CABIN,
  shared: SHARED,
}

/** Totals for a module's list, plus the shared hardware. */
export function bomTotals(items) {
  let jpy = 0
  let kg = 0
  let lines = 0
  for (const i of items) {
    jpy += i.jpy * i.qty
    kg += i.kg * i.qty
    lines += 1
  }
  return { jpy, kg, lines }
}

/** Group a list by category, preserving first-seen order. */
export function byCategory(items) {
  const out = new Map()
  for (const i of items) {
    if (!out.has(i.cat)) out.set(i.cat, [])
    out.get(i.cat).push(i)
  }
  return out
}

/**
 * How many items in a list have no fixing points of their own.
 *
 * Flagged by hand rather than sniffed out of the prose, because "no rack ears"
 * and "no mount points" are the same fact written two ways and a regex over the
 * mount notes quietly undercounted the things that actually need a cradle.
 */
export function captureCount(items) {
  return items.filter((i) => i.capture === true).length
}

export { mm }
