// The film: chapters of subtitle cues. Each cue carries its text (with
// citation markers), a camera shot, the state of the model it moves toward,
// the labels on screen, and an optional figure.
//
// Shots: f = 'w' (world: head millimetres) or 'o' (nerve-head frame, see
// anat.js). `at` is what the camera looks at, `from` where it stands.
import { MICRO, laneY, lamFront, wallX, fundus, FOVEA, SLICE_Z } from './anat.js'

const SZ = SLICE_Z + 0.03
const MX = MICRO.x, MY = MICRO.y

// id: [frame, anchor, text, [dx, dy] label offset in px at a 1280-wide stage]
export const LABELS = {
  eyeR: ['w', [-32, 0, 13], 'Right eye — the affected one in this model', [-150, -70]],
  eyeL: ['w', [32, 0, 13], 'Fellow eye', [120, -60]],
  nerveW: ['w', [-14, 3, -40], 'Optic nerve', [-170, 10]],
  chiasm: ['w', [0, 10, -62], 'Optic chiasm: about half the fibres cross', [190, 40]],
  lgn: ['w', [27, 8.5, -89], 'Relay station in the thalamus', [190, 0]],
  rad: ['w', [-35, 16, -125], 'Optic radiation', [-170, 0]],
  cortex: ['w', [0, 22, -168], 'Visual cortex', [0, -70]],
  ica: ['w', [-11, -22, -61.5], 'Internal carotid artery', [190, 20]],
  oph: ['w', [-16, 0.5, -42], 'Ophthalmic artery', [150, 70]],
  muscle: ['w', [-32, 12.5, -6], 'Eye muscle', [-90, -90]],
  nerveO: ['o', [9, 0, 2.4], 'Optic nerve in its sheath', [150, 90]],
  pca: ['o', [12, 1.9, -1.6], 'Posterior ciliary arteries', [-40, -110]],
  craIn: ['o', [11.2, -3.1, 0], 'Central retinal artery', [170, 70]],
  spca: ['o', [2.5, 2.1, 2.6], 'Short posterior ciliary arteries enter the sclera around the nerve', [230, -60]],
  globe: ['o', [-3.5, 7.5, 5], 'Back of the eyeball (sclera)', [-150, -70]],

  cornea: ['o', [-24.5, 0, SZ], 'Cornea', [-90, -90]],
  lens: ['o', [-19.6, 1.5, 1], 'Lens', [-30, -150]],
  vitreous: ['o', [-11, 3.5, -0.5], 'Vitreous gel', [0, 0], 'plain'],
  retinaA: ['o', [wallX(10.87, 7.5), 7.5, SZ], 'Retina', [150, -60]],
  choroidA: ['o', [wallX(11.12, 6), 6, SZ], 'Choroid (blood-vessel layer)', [190, -20]],
  scleraA: ['o', [wallX(11.7, -8.5), -8.5, SZ], 'Sclera', [130, 70]],
  foveaA: ['o', fundus(FOVEA.u, FOVEA.v), 'Fovea: centre of sharp vision', [-70, 110]],
  discA: ['o', [-1.45, 0, SZ], 'Optic disc', [-150, 60]],
  nerveA: ['o', [7, 0, SZ], 'Optic nerve', [40, 110]],

  rnfl: ['o', [wallX(10.8, 1.25), 1.25, SZ], 'Nerve-fibre layer', [-250, 20]],
  retB: ['o', [wallX(10.93, 1.7), 1.7, SZ], 'Retina', [-250, -10]],
  chorB: ['o', [wallX(11.12, 2.15), 2.15, SZ], 'Choroid', [-240, -40]],
  sclB: ['o', [-0.9, -1.75, SZ], 'Sclera', [-300, 30]],
  cup: ['o', [-1.31, 0, SZ], 'Cup', [-190, 0]],
  rim: ['o', [-1.5, -0.55, SZ], 'Rim of the disc: fibres turning into the nerve', [-290, 40]],
  prelam: ['o', [-1.13, -0.42, SZ], 'Prelaminar region: bare fibres', [-230, 130]],
  lam: ['o', [-0.78, -0.62, SZ], 'Lamina cribrosa', [-60, 190]],
  retro: ['o', [0.7, -0.75, SZ], 'Myelinated nerve', [120, 170]],
  pia: ['o', [2.4, -1.52, SZ], 'Pia', [60, 150]],
  csf: ['o', [3.2, -1.78, SZ], 'Fluid-filled space between the membranes', [200, 110]],
  duraB: ['o', [4.4, -2.2, SZ], 'Dura', [170, 60]],
  craB: ['o', [2.6, -0.06, SZ], 'Central retinal artery', [200, -130]],
  crvB: ['o', [3.8, 0.07, SZ], 'Central retinal vein', [230, -80]],
  spcaB: ['o', [2.6, 3.08, SZ], 'Short posterior ciliary artery', [170, -40]],
  zh: ['o', [-0.75, 1.38, SZ], 'Arterial circle in the sclera (cut across)', [220, -110]],
  brLam: ['o', [lamFront(0.62) + 0.15, 0.62, SZ], 'branch to the lamina', [250, 20]],
  brPre: ['o', [-1.21, 0.88, SZ], 'via the choroid to the prelaminar region', [-270, -40]],
  brPia: ['o', [1.2, 1.545, SZ], 'back along the pia', [230, -60]],
  upper: ['o', [-1.05, 0.5, SZ], 'Upper half of the nerve head', [-280, -110]],
  lower: ['o', [-1.05, -0.5, SZ], 'Lower half', [-250, 110]],
  swollen: ['o', [-1.5, 0.62, SZ], 'Swollen fibres heap up into the eye', [-250, -60]],
  wasted: ['o', [0.9, 0.6, SZ], 'Wasted fibres', [200, -150]],

  mAxon: ['o', [MX - 0.105, laneY(MICRO.lane + 1) + 0.012, SZ], 'Axons, about 1 µm thick', [-150, -120]],
  mPore: ['o', [MX + 0.012, laneY(MICRO.lane), SZ], 'Pore, about 25 µm', [150, 110]],
  mBeam: ['o', [MX + 0.1, MY + 0.012, SZ], 'Collagen beam', [200, -90]],
  mCap: ['o', [MX - 0.135, MY, SZ], 'Capillary: red cells in single file', [-240, 70]],
  mAstro: ['o', [MX - 0.075, MY - 0.0105, SZ], 'Astrocytes (support cells)', [-90, 150]],
  mCargo: ['o', [MX - 0.045, laneY(MICRO.lane) - 0.006, SZ], 'Cargo moving along the axons', [70, 170]],
  mPile: ['o', [MX - 0.03, laneY(MICRO.lane + 1) + 0.004, SZ], 'Cargo piles up; fibres balloon', [130, -130]],
  mSqueeze: ['o', [MX - 0.06, MY, SZ], 'Capillary squeezed shut', [-260, 60]],

  fDisc: ['o', [-1.56, -0.5, 0], 'Optic disc', [110, 120]],
  fMac: ['o', fundus(FOVEA.u, FOVEA.v, 0.02), 'Macula', [-60, 110]],
  fArt: ['o', fundus(3.2, 3.4, 0.06), 'Retinal artery and vein', [-120, -80]],
  fNfl: ['o', fundus(3.4, 1.9, 0.02), 'Upper nerve fibres', [-210, -20]],
  fEdge: ['o', [-1.56, 0.95, 0.35], 'Blurred, raised margin with splinter bleeds', [240, -90]],
  fPale: ['o', [-1.56, 0.45, 0], 'Pale upper half', [220, -80]],
}

const HEAD = { f: 'w', at: [0, -8, -75], from: [215, 40, 560] }
const HEAD2 = { f: 'w', at: [0, -5, -80], from: [-150, 70, 590] }
const TOP = { f: 'w', at: [0, 8, -85], from: [0, 520, 170] }
const WHOLE = { f: 'o', at: [-6.5, 0, 0], from: [-6.5, 3, 66] }
const ONH = { f: 'o', at: [-0.45, 0, 0], from: [-0.45, 0.2, 11.5] }
const SUPPLY = { f: 'o', at: [-0.3, 0.75, 0], from: [-0.3, 0.75, 7.6] }
const MIC = { f: 'o', at: [MX - 0.035, MY, SLICE_Z], from: [MX - 0.035, MY, 0.52] }
const MIC2 = { f: 'o', at: [MX - 0.04, MY, SLICE_Z], from: [MX - 0.04, MY, 0.3] }
const FUND = { f: 'o', at: [-1.5, 0, -1.7], from: [-17, 0.2, -1.5] }
const FDISC = { f: 'o', at: [-1.5, 0, -0.5], from: [-10.5, 0.1, -0.5] }

const SLICED = { clip: 1, plate: 1, cap: 0, glass: 1, hideHead: 1 }
const NORMAL = { flowAll: 1, flow: 1, stasis: 0, swelling: 0 }

export const CUES = [
  // ------------------------------------------------------------------ 1
  { ch: 'The route from eye to brain',
    text: 'This film follows one eye from the outside in, to the spot where a condition called non-arteritic anterior ischemic optic neuropathy — NAION — does its damage. NAION is the most common cause of sudden optic-nerve damage in people over 50.[[ew]]',
    shot: HEAD, set: { glass: 0 }, labels: [] },
  { text: 'It strikes roughly 2 to 10 people in every 100,000 each year. The average age is about 60, but in one hospital series nearly a quarter of patients were under 50.[[ew]][[atk]]',
    shot: HEAD2, set: { glass: 1 }, labels: ['eyeR'] },
  { text: 'Seeing begins in the retina, the light-sensitive lining at the back of each eye. About a million nerve fibres — one from each of the retina’s output cells — leave the eye together as the optic nerve.[[wpd]][[wpn]]',
    shot: TOP, labels: ['eyeR', 'eyeL', 'nerveW'] },
  { text: 'The nerve is 4 to 5 cm long. It runs back through the eye socket and a canal in the skull to the optic chiasm, where about half of its fibres cross to the other side.[[ken]][[wpn]]',
    shot: { f: 'w', at: [0, 8, -60], from: [40, 330, 60] }, labels: ['nerveW', 'chiasm'] },
  { text: 'After a relay in the thalamus, the signals fan out to the visual cortex at the very back of the head. Each eye feeds both halves of the brain.[[wpn]][[wpc]]',
    shot: TOP, labels: ['chiasm', 'lgn', 'rad', 'cortex'] },
  { text: 'One fact shapes everything that follows. The optic nerve is not an ordinary nerve but an outgrowth of the brain, insulated by the same cells as the brain. Like the brain, it does not regrow once badly damaged.[[ken]][[wpn]]',
    shot: { f: 'w', at: [-18, 4, -40], from: [120, 210, 120] }, labels: ['nerveW'] },

  // ------------------------------------------------------------------ 2
  { ch: 'The blood supply',
    text: 'Blood reaches the eye from the internal carotid artery in the neck. Its branch to the eye socket is the ophthalmic artery.[[ken]]',
    shot: { f: 'w', at: [-20, 2, -36], from: [-125, 105, 35] }, set: { hideHead: 0.75 }, labels: ['ica', 'oph', 'muscle', 'nerveW'] },
  { text: 'The ophthalmic artery divides. The central retinal artery enters the optic nerve behind the eye and runs up its core. The posterior ciliary arteries, a lateral and a medial, run forward beside the nerve.[[ken]][[hay]]',
    shot: { f: 'o', at: [9, 0, 0], from: [30, 15, 26] }, set: { hideHead: 1 }, labels: ['oph', 'pca', 'craIn', 'nerveO'] },
  { text: 'They break up into short posterior ciliary arteries that pierce the white wall of the eye in a ring around the nerve. These small vessels, not the central retinal artery, are the main blood supply of the front of the optic nerve.[[hay]][[berry]]',
    shot: { f: 'o', at: [1.5, 0, 0], from: [27, 10, 17] }, labels: ['spca', 'globe', 'nerveO'] },

  // ------------------------------------------------------------------ 3
  { ch: 'Inside the eye',
    text: 'Now cut the eye and its nerve down the middle. From the front: the cornea and lens that focus light, the clear gel that fills the eye, and the wall — retina innermost, then the blood-rich choroid, then the tough white sclera.[[std]]',
    shot: WHOLE, set: { clip: 1, plate: [1, 5], glass: 1, hideHead: 1 }, move: 4.5,
    labels: ['cornea', 'lens', 'vitreous', 'retinaA', 'choroidA', 'scleraA', 'foveaA', 'discA', 'nerveA'] },
  { text: 'Nerve fibres run across the inner surface of the retina and converge on a single exit, the optic disc, about 1.8 mm across. The disc has no light sensors, which is why each eye has a blind spot.[[wpd]][[wpb]]',
    shot: ONH, set: SLICED, labels: ['rnfl', 'retB', 'chorB', 'sclB', 'cup', 'rim'] },
  { text: 'At the disc the fibres turn through a right angle and pass through the lamina cribrosa, a sieve of collagen spanning the hole in the sclera. In healthy human eyes its pores average 25 micrometres across and its beams 47.[[wang]]',
    shot: { f: 'o', at: [-0.95, 0, 0], from: [-0.95, 0.1, 5.4] }, labels: ['rim', 'cup', 'prelam', 'lam', 'retro'] },
  { text: 'In front of the sieve the fibres are bare. Behind it each one gains an insulating sheath of myelin, and the nerve doubles in width, from about 1.6 mm to 3.5 mm. From here back it is wrapped in the same three membranes as the brain, with a fluid-filled space between them.[[ken]][[wpn]][[yang]]',
    shot: { f: 'o', at: [1.1, 0, 0], from: [1.1, 0.2, 13] }, labels: ['prelam', 'lam', 'retro', 'pia', 'csf', 'duraB'] },
  { text: 'This is the vulnerable part. The central retinal artery passes straight through, on its way to the retina. The nerve head is fed from the side: by an arterial circle within the sclera, formed by short posterior ciliary arteries, and by the neighbouring choroid.[[atk]][[hay]][[ken]]',
    shot: SUPPLY, labels: ['craB', 'crvB', 'spcaB', 'zh', 'brLam', 'brPre', 'brPia'] },
  { text: 'The circle is described as having separate upper and lower halves. That matches a striking feature of NAION: it often destroys the top or bottom half of the nerve head and spares the other. The circle is not complete in every eye.[[atk]][[ken]]',
    shot: { f: 'o', at: [-0.6, 0, 0], from: [-0.6, 0, 8.6] }, labels: ['upper', 'lower', 'zh'] },
  { text: 'Closer. Each pore of the sieve carries a bundle of fibres, each fibre about a thousandth of a millimetre thick. In primate eyes every beam of the sieve has a capillary running through it, and more capillaries lie in the tissue between the bundles.[[yang]][[std]]',
    shot: MIC, set: { micro: [1, 3.5] }, move: 5, labels: ['mAxon', 'mPore', 'mBeam', 'mCap', 'mAstro'] },
  { text: 'Each fibre is part of a living cell, centimetres long. Material made in the cell body, back in the retina, is carried down the fibre continuously, and spent material is carried back. This traffic, called axonal transport, needs a steady supply of energy — and therefore of blood.[[yang]][[std]]',
    shot: MIC2, labels: ['mCargo', 'mCap'] },

  // ------------------------------------------------------------------ 4
  { ch: 'A disc at risk',
    text: 'Optic discs differ. Most have a central hollow, the cup, which leaves the fibres some slack. In nearly all eyes that develop NAION the disc is small and the cup tiny or absent: a cup-to-disc ratio below about 0.2. Doctors call this a disc at risk.[[ew]][[atk]]',
    shot: ONH, set: { micro: 0 }, labels: ['cup', 'rim', 'lam'], fig: 'discs' },
  { text: 'The same number of fibres is packed into a smaller opening, just in front of a rigid sieve. Nothing is wrong yet, and the eye sees normally. Whether crowding helps cause NAION, or only makes it worse once it starts, is disputed.[[hay]][[ew]]',
    shot: { f: 'o', at: [-1.0, 0, 0], from: [-1.0, 0, 6.2] }, labels: ['prelam', 'lam'], fig: 'discs' },

  // ------------------------------------------------------------------ 5
  { ch: 'The fall in blood flow',
    text: 'Flow through the nerve head depends on perfusion pressure: the mean blood pressure minus the pressure inside the eye. Normally the small vessels widen or narrow to hold the flow steady as that pressure changes. This is autoregulation.[[hay]]',
    shot: SUPPLY, set: { hud: 1 }, labels: ['spcaB', 'zh'], fig: 'auto' },
  { text: 'Autoregulation works only within a range. Below it, flow falls with pressure. One influential theory holds that the normal dip in blood pressure during sleep — sometimes deepened by blood-pressure tablets taken at bedtime — carries a susceptible nerve head below that range.[[hay]]',
    shot: SUPPLY, set: { night: 1, flowAll: [0.55, 7], flow: [0.5, 7] }, labels: ['spcaB', 'zh'], fig: 'auto' },
  { text: 'The evidence is mixed. In one series 73% of patients found their vision gone on waking. But the largest treatment trial did not confirm that timing, and a study comparing patients with healthy controls found no difference in night-time blood pressure.[[hay]][[ew]][[atk]]',
    shot: { f: 'o', at: [-0.5, 0.75, 0], from: [-1.4, 0.9, 7.4] }, labels: ['brLam', 'brPre'], fig: 'auto' },
  { text: 'What is better established is what NAION usually is not: a blood clot. In nerves examined after death no blocked or inflamed vessel was found. The accepted view is a shortfall of flow in the smallest vessels, most often in people with high blood pressure, diabetes or sleep apnoea.[[atk]][[hay]][[ew]]',
    shot: { f: 'o', at: [-0.8, 0.6, 0], from: [-0.8, 0.6, 5.2] }, labels: ['upper'] },

  // ------------------------------------------------------------------ 6
  { ch: 'The vicious circle',
    text: 'Follow one capillary as its flow falls. The fibres beside it run short of oxygen, and of the energy that drives their internal transport.[[hay]][[atk]]',
    shot: MIC, set: { micro: [1, 3.5], flow: 0.4 }, move: 5, labels: ['mCap', 'mCargo'] },
  { text: 'Transport stalls. Cargo that should pass through the sieve piles up in front of it, and the fibres balloon. This is the swelling that an eye doctor sees at the disc.[[hay]][[atk]][[yang]]',
    shot: MIC2, set: { stasis: [1, 6], swelling: [0.55, 9] }, labels: ['mPile'] },
  { text: 'In a crowded disc the swollen fibres have nowhere to expand. As Hayreh put it, the only thing they can squeeze to make room is the fine capillaries lying among them. Flow falls further, and more fibres swell.[[hay]]',
    shot: MIC, set: { swelling: [1, 7], flow: [0.06, 7] }, labels: ['mSqueeze', 'mPile'] },
  { text: 'A vicious circle: less blood, more swelling, less blood. It has been likened to a compartment syndrome, in which tissue is strangled by its own swelling inside a space that cannot stretch. This is the leading explanation. It has not been proven.[[hay]][[atk]][[berry]][[ew]]',
    shot: { f: 'o', at: [-1.05, 0.3, 0], from: [-1.05, 0.3, 4.6] }, set: { micro: 0, damage: [0.6, 9] }, labels: ['swollen', 'lam'] },

  // ------------------------------------------------------------------ 7
  { ch: 'What the eye sees',
    text: 'Seen through the pupil, the disc is swollen from the first day of visual loss. Its margin is blurred and raised, often with small splinter-shaped bleeds.[[hay]][[atk]]',
    shot: FUND, set: { clip: [0, 5], plate: [0, 1.5], cap: [1, 3], night: 0, flowAll: 1, damage: 0.75 }, move: 6, labels: ['fDisc', 'fMac', 'fArt', 'fEdge'], fig: 'vision' },
  { text: 'Fibres from the upper half of the retina enter the top of the disc. Because the optics of the eye turn the image upside down, those fibres carry the lower half of what the eye sees.[[wpc]][[std]]',
    shot: { f: 'o', at: [-1.5, 0.9, -1.9], from: [-15, 1.4, -1.9] }, labels: ['fNfl', 'fDisc', 'fMac'], fig: 'vision' },
  { text: 'So when the upper half of the nerve head fails, the lower half of that eye’s view dims or goes, usually without pain. Lower-field loss is the commonest pattern; careful testing often shows it densest in the lower corner nearest the nose.[[ew]][[atk]][[hay]]',
    shot: FUND, set: { damage: [1, 8] }, labels: ['fNfl'], fig: 'vision' },
  { text: 'The loss can deepen over the first two weeks, then holds steady. Sharpness of central vision varies widely. About two thirds of patients keep better than 20/200, and a third keep 20/20 with part of their field missing.[[ew]][[atk]][[hay]]',
    shot: FDISC, labels: ['fEdge'], fig: 'vision' },

  // ------------------------------------------------------------------ 8
  { ch: 'The weeks and months after',
    text: 'Over about two months the swelling subsides. As it does, the affected part of the disc turns pale: the damaged fibres are wasting away.[[hay]][[atk]][[berry]]',
    shot: FDISC, set: { swelling: [0.08, 9], pallor: [1, 9], stasis: 0, flow: 0.5 }, labels: ['fPale'], fig: 'vision' },
  { text: 'Scans show the layer of nerve fibres around the disc thinning over two to three months and levelling off by about six.[[ew]]',
    shot: { f: 'o', at: [-0.5, 0.3, 0], from: [-0.5, 0.5, 8.4] }, set: { clip: 1, plate: [1, 4], cap: 0, atrophy: [1, 8] }, move: 6, labels: ['wasted', 'lower'], fig: 'vision' },
  { text: 'These fibres do not regrow. Even so, in studies between 13% and 43% of patients regained three or more lines on the eye chart — perhaps partly as fluid under the central retina clears. Missing areas of the visual field recover less often.[[ew]][[atk]][[berry]]',
    shot: TOP, set: { clip: 0, plate: 0, hideHead: 0 }, move: 6, labels: ['eyeR', 'chiasm', 'cortex'], fig: 'vision' },

  // ------------------------------------------------------------------ 9
  { ch: 'What can be done',
    text: 'No treatment has been shown to work. The one rigorous trial tested surgery to open the sheath around the nerve. It did not help and may have harmed: 33% of operated patients improved, against 43% of those left alone.[[atk]][[ew]]',
    shot: { f: 'o', at: [4, 0, 0], from: [22, 9, 15] }, set: { hideHead: 1 }, labels: ['nerveO'], fig: 'vision' },
  { text: 'Steroid tablets looked helpful in one large study, but patients chose their own treatment, so the comparison is disputed. Aspirin has not been shown to improve the outcome.[[atk]][[hay]][[berry]]',
    shot: HEAD2, set: { hideHead: 0 }, labels: [] },
  { text: 'The other eye is affected in about 15 to 24% of people within five years. A second attack in the same eye is uncommon: 3 to 8%.[[ew]][[atk]]',
    shot: { f: 'w', at: [0, 0, -10], from: [0, 60, 330] }, labels: ['eyeR', 'eyeL'] },
  { text: 'Reasonable steps are the ones that protect small blood vessels in general: controlling blood pressure, diabetes and cholesterol, and treating sleep apnoea. None has been proven in a trial to protect the second eye. Some specialists advise against taking blood-pressure tablets at bedtime — a question for the prescribing doctor.[[ew]][[hay]]',
    shot: { f: 'w', at: [-20, 2, -36], from: [-135, 90, 60] }, set: { hideHead: 0.6 }, labels: ['ica', 'oph'] },
  { text: 'Links with some medicines — amiodarone, drugs for erectile dysfunction and, more recently, semaglutide — have been reported and remain debated. Ophthalmology societies advise against stopping semaglutide on the strength of a single study.[[ew]][[atk]]',
    shot: HEAD, set: { hideHead: 0 }, labels: [] },
  { text: 'One thing is urgent. A rarer form of this condition is caused by giant cell arteritis, an inflammation of the arteries that can take the second eye within days and is treated at once with steroids. Sudden loss of vision, especially with headache, a tender scalp or jaw pain on chewing, needs assessment the same day.[[ew]][[aaion]][[hay90]]',
    shot: { f: 'w', at: [0, 0, -10], from: [0, 30, 300] }, labels: ['eyeR', 'eyeL'] },
  { text: 'Much is still unknown: why the flow falls, why the damage stops where it does, and how to break the circle once it has begun. What you have watched is the leading account, not a settled one.[[ew]][[berry]]',
    shot: HEAD, set: { glass: 0.55 }, labels: [] },
]

export const DEFAULTS = {
  glass: 0, hideHead: 0, clip: 0, plate: 0, cap: 0, micro: 0, night: 0, hud: 0,
  flowAll: 1, flow: 1, stasis: 0, swelling: 0, damage: 0, atrophy: 0, pallor: 0,
}
void NORMAL
