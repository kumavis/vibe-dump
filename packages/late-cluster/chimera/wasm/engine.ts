/**
 * The engine as the UI uses it: constants, planners, G2P, the anatomy model and the creature
 * catalogue, all from the Rust engine (crates/chimera) through its JSON interface. Import only
 * after `initChimera()` has resolved (main.tsx does this before loading any UI module): the
 * constants below are read from the engine when this module loads.
 */
import { call } from "./chimera.ts";
import { CREATURE_VISUALS } from "../ui/creatureVisuals.ts";
import type {
  ArticKey, ArticSpec, BeatPreset, BodyMix, BeatSound, BeatStep, CreatureDef, CreatureTelemetry, DemoSong, Gesture, HumanArtic, HumanBody,
  HumanFrame, Phrase, Plan, Segment, SungNote, Syllable, VoiceSource, VowelRef,
} from "./types.ts";

export type * from "./types.ts";

interface Catalog {
  neutral: HumanArtic;
  bodies: { male: HumanBody; female: HumanBody; child: HumanBody };
  articKeys: ArticKey[];
  articSpecs: Record<ArticKey, ArticSpec>;
  defaultSource: VoiceSource;
  exhaleLabel: string;
  bassNote: number;
  beatSounds: BeatSound[];
  beatPresets: BeatPreset[];
  vowelTargets: Record<string, Record<string, { artic: Partial<HumanArtic>; formants: number[] }>>;
  demoSongs: DemoSong[];
  vowels: VowelRef[];
  creatures: Omit<CreatureDef, "visual">[];
}

const CATALOG = call<Catalog>("catalog");

export const NEUTRAL: Readonly<HumanArtic> = CATALOG.neutral;
export const BODY_MALE: HumanBody = CATALOG.bodies.male;
export const BODY_FEMALE: HumanBody = CATALOG.bodies.female;
export const BODY_CHILD: HumanBody = CATALOG.bodies.child;
export const ARTIC_KEYS: readonly ArticKey[] = CATALOG.articKeys;
export const ARTIC_SPECS: Readonly<Record<ArticKey, ArticSpec>> = CATALOG.articSpecs;
export const DEFAULT_SOURCE: Readonly<VoiceSource> = CATALOG.defaultSource;
/** label of the end-of-breath-group abduction (a live note can drop it when the next one starts) */
export const EXHALE_LABEL: string = CATALOG.exhaleLabel;
/** default hum note of the beatbox bass (MIDI) */
export const BASS_NOTE: number = CATALOG.bassNote;
export const BEAT_SOUNDS: readonly BeatSound[] = CATALOG.beatSounds;
export const BEAT_PRESETS: readonly BeatPreset[] = CATALOG.beatPresets;
/** calibrated vowels per body: articulation and the formants it gives */
export const VOWEL_TARGETS = CATALOG.vowelTargets;
export const DEMO_SONGS: readonly DemoSong[] = CATALOG.demoSongs;
/** reference vowels (IPA chart, vowel map) */
export const VOWELS: readonly VowelRef[] = CATALOG.vowels;
/** the creatures, with how each is drawn */
export const CREATURES: readonly CreatureDef[] = CATALOG.creatures.map((c) => ({ ...c, visual: CREATURE_VISUALS[c.id] }));
export const creatureById = (id: string): CreatureDef | undefined => CREATURES.find((c) => c.id === id);

// ------------------------------------------------------------------ text → phonemes

/** IPA text → segments (stress marks, word breaks, multi-character symbols). */
export function tokenizeIpa(text: string): Segment[] {
  return call("tokenizeIpa", { text });
}

/**
 * English text → phonemes: CMUdict once loaded (fetched and gunzipped here, parsed by the
 * engine), letter-to-sound rules until then. One dictionary per page (the engine keeps it).
 */
export class EnglishG2P {
  private loading: Promise<void> | null = null;
  private isLoaded = false;

  get loaded(): boolean {
    return this.isLoaded;
  }

  /** Load the gzipped dictionary ("word\tPHONES" lines). */
  load(url = "/data/cmudict.txt.gz"): Promise<void> {
    if (this.isLoaded) return Promise.resolve();
    if (this.loading) return this.loading;
    this.loading = (async () => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`dictionary ${res.status}`);
        const bytes = new Uint8Array(await res.arrayBuffer());
        // servers differ: some send Content-Encoding: gzip (already inflated by the browser)
        let text: string;
        if (bytes[0] === 0x1f && bytes[1] === 0x8b) {
          const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
          text = await new Response(stream).text();
        } else text = new TextDecoder().decode(bytes);
        this.setDictionaryText(text);
      } catch (e) {
        this.loading = null; // allow a retry
        throw e;
      }
    })();
    return this.loading;
  }

  setDictionaryText(text: string): void {
    call("g2pLoad", { text });
    this.isLoaded = true;
  }

  /** Text → phrases of segments. */
  toPhrases(text: string): Phrase[] {
    return call("g2pPhrases", { text });
  }

  /** One word → segments with lexical stress. `reduce`: weak forms of function words (speech). */
  word(w: string, reduce = true): Segment[] {
    return call("g2pWord", { word: w, reduce });
  }
}

/** Lyrics → sung syllables, through the page's dictionary (see EnglishG2P). */
export function lyricsToSyllables(text: string): Syllable[] {
  return call("lyricsToSyllables", { text });
}

// ------------------------------------------------------------------ planning

export interface PlanOptions {
  body: BodyMix;
  /** voice-clock start time (s) */
  t0: number;
  /** speaking-rate multiplier (>1 = faster) */
  rate?: number;
  /** baseline pitch (Hz) */
  f0?: number;
  intonation?: "statement" | "question" | "flat";
  /** pitch excursion for stressed syllables (fraction) */
  accent?: number;
  /** the last segment is held open-ended (a sung note): no end-of-breath release */
  openEnd?: boolean;
  /** a sung phrase (planSong sets it): consonants given a pitch hold it, and pitch ramps shrink
   *  to fit short notes */
  sung?: boolean;
}

export function planUtterance(segments: Segment[], options: PlanOptions): Plan {
  return call("planUtterance", { segments, options });
}

/** How many planned segments each segment becomes (a diphthong is planned as its two vowels). */
export function plannedCounts(ipa: string[]): number[] {
  return call("plannedCounts", { ipa });
}

export function planPhrases(phrases: { segments: Segment[]; intonation?: "statement" | "question" | "flat"; pause?: number }[], options: PlanOptions): Plan {
  return call("planPhrases", { phrases: phrases.map((p) => ({ segments: p.segments, intonation: p.intonation, pause: p.pause })), options });
}

export function planSong(notes: SungNote[], options: { body: BodyMix; bpm: number; t0: number; vibrato: number }): Plan {
  return call("planSong", { notes, options });
}

export function planNoteOn(syl: Syllable, midi: number, options: { body: BodyMix; vibrato: number; tag: number; legatoFrom?: { syl: Syllable; midi: number } }): Gesture[] {
  return call("planNoteOn", { syl, midi, options });
}

export function planMelisma(midi: number, options: { vibrato: number; tag: number }): Gesture[] {
  return call("planMelisma", { midi, options });
}

export function planNoteOff(syl: Syllable, midi: number, body: BodyMix): Gesture[] {
  return call("planNoteOff", { syl, midi, body });
}

/** Smooth activation 0..1..0 with cosine ramps (for drawing the score; the engine's own blend uses its Rust twin). */
export function activation(g: Gesture, t: number): number {
  if (t <= g.t0 - g.rampIn || t >= g.t1 + g.rampOut) return 0;
  if (t < g.t0) return 0.5 - 0.5 * Math.cos((Math.PI * (t - (g.t0 - g.rampIn))) / Math.max(1e-6, g.rampIn));
  if (t > g.t1) return 0.5 + 0.5 * Math.cos((Math.PI * (t - g.t1)) / Math.max(1e-6, g.rampOut));
  return 1;
}

// ------------------------------------------------------------------ beatbox

export function parseBeat(text: string): (BeatStep | null)[] {
  return call("parseBeat", { text });
}

export function formatBeat(steps: readonly (BeatStep | null)[]): string {
  return call("formatBeat", { steps });
}

/** A beatboxer's ready posture for this body. */
export function beatReady(body: BodyMix): Partial<HumanArtic> {
  return call("beatReady", { body });
}

// ------------------------------------------------------------------ anatomy

/** Resting tongue-tip position (template coordinates) for a jaw and tongue body. */
export function restTip(jaw: number, tbX: number, tbY: number): { x: number; y: number } {
  return call("restTip", { jaw, tbX, tbY });
}

/** Template ↔ body coordinates of one body (mirrors HumanVocalTract::p / un_p, for drawing and dragging). */
export class TractMap {
  readonly scale: number;
  private readonly ph: number;
  constructor(body: HumanBody) {
    this.scale = body.scale;
    this.ph = body.pharynx;
  }
  P(x: number, y: number): { x: number; y: number } {
    const k = this.scale;
    const xx = x > 0.5 ? 0.5 + (x - 0.5) * 0.86 : x;
    const yy = y < 7 ? 7 - (7 - y) * this.ph : y;
    return { x: xx * k, y: yy * k };
  }
  unP(x: number, y: number): { x: number; y: number } {
    const k = this.scale;
    let xx = x / k, yy = y / k;
    if (xx > 0.5) xx = 0.5 + (xx - 0.5) / 0.86;
    if (yy < 7) yy = 7 - (7 - yy) / this.ph;
    return { x: xx, y: yy };
  }
}

/** The main thread's mirror of the worklet's airway for one body and sample rate. */
export interface AirwayModel {
  model: number;
  body: HumanBody;
  nPh: number;
  nOr: number;
  pharynxBranches: { base: number; n: number };
  oralBranches: { base: number; n: number };
  glottisPort: number;
}

export function airwayModel(body: BodyMix, sampleRate: number): AirwayModel {
  return call("model", { body, sampleRate });
}

/** Free a model (its id is invalid afterwards). */
export function dropAirwayModel(m: AirwayModel): void {
  call("dropModel", { model: m.model });
}

export function airwayFrame(m: AirwayModel, artic: HumanArtic): HumanFrame {
  return call("frame", { model: m.model, artic });
}

/** The tract's area function (what the worklet's airway would be given) for an articulation. */
export function airwayAreas(m: AirwayModel, artic: HumanArtic): { phAreas: number[]; orAreas: number[]; phLen: number; orLen: number } {
  return call("apply", { model: m.model, artic });
}

/** Transfer function (dB at 360 log-spaced frequencies 60 Hz–8 kHz) and formants. */
export function airwayTransfer(m: AirwayModel, artic: HumanArtic): { freqs: number[]; db: number[]; formants: number[] } {
  return call("transfer", { model: m.model, artic });
}

// ------------------------------------------------------------------ creatures

/** A creature's telemetry right after construction at these settings (drawn before audio starts). */
export function creaturePreview(id: string, params?: Record<string, number>): CreatureTelemetry {
  return call("creaturePreview", { id, params: params ?? {} });
}
