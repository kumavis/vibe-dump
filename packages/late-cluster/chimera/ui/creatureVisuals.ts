/**
 * How each creature is drawn (UI-only data, keyed by creature id; the engine defines the creature
 * itself): body outline, tissue shapes, airway centrelines per tube, and source glyphs.
 */
export interface CreatureVisual {
  /** body outline in drawing units (≈ cm; y up) */
  silhouette: [number, number][];
  /** extra shapes drawn in tissue tones (shade 0 black … 1 white) */
  parts?: { shade: number; pts: [number, number][]; stroke?: boolean }[];
  /** airway centrelines per tube name (tube nodes are distributed along the path); inView: false
   *  keeps the label out of the cross-section (it still names the tube's lane) */
  tubes: { tube: string; path: [number, number][]; label?: string; inView?: boolean }[];
  /** how much wider than life to draw the airway (narrow tubes stay legible) */
  tubeScale?: number;
  /** drawing extents */
  view: { x0: number; x1: number; y0: number; y1: number };
  /** sound sources to draw, keyed into the creature's source state */
  sources?: { key: string; at: [number, number]; label: string }[];
}

export const CREATURE_VISUALS: Record<string, CreatureVisual> = {
  "songbird": {
    view: { x0: -4, x1: 14, y0: -6, y1: 8 },
    silhouette: [[-3.2, -1.2], [-1.6, -3.4], [1.6, -4.6], [5.2, -4.4], [7.8, -2.6], [9.0, -0.4], [9.6, 1.8], [10.4, 2.4], [12.8, 2.6], [10.6, 3.0], [9.8, 3.6], [9.2, 4.6], [7.6, 5.2], [6.0, 4.6], [4.2, 2.8], [2.0, 2.0], [-0.2, 1.6], [-3.6, 1.4], [-3.4, 0.2]],
    parts: [{ shade: 0.2, pts: [[8.6, 4.0], [8.95, 4.3], [9.2, 4.0], [8.95, 3.7]] }],
    tubes: [
      { tube: "bronchusL", path: [[3.4, -1.9], [4.4, -1.4]], label: "Left bronchus", inView: false },
      { tube: "bronchusR", path: [[3.4, -0.9], [4.4, -1.2]], label: "Right bronchus", inView: false },
      { tube: "trachea", path: [[4.4, -1.3], [5.6, -0.4], [6.8, 0.8], [7.8, 1.9], [8.6, 2.5]], label: "Trachea" },
      { tube: "beak", path: [[9.4, 2.75], [10.6, 2.75], [12.4, 2.7]], label: "Beak" },
    ],
    tubeScale: 1.6,
    sources: [{ key: "left", at: [4.2, -1.6], label: "Left voice" }, { key: "right", at: [4.2, -1.0], label: "Right voice" }],
  },
  "seal": {
    view: { x0: -60, x1: 60, y0: -30, y1: 30 },
    silhouette: [[-58, -2], [-50, -8], [-30, -14], [-5, -16], [20, -14], [38, -10], [48, -6], [55, -3], [58, 1], [56, 5], [50, 8], [42, 10], [30, 11], [10, 13], [-15, 13], [-35, 10], [-50, 6], [-56, 3], [-62, 8], [-64, 4], [-60, 0], [-64, -4], [-62, -8]],
    parts: [{ shade: 0.15, pts: [[47, 4], [48.5, 5], [50, 4], [48.5, 3]] }],
    tubes: [
      { tube: "trachea", path: [[8, -4], [20, -3], [30, -2]], label: "Trachea" },
      { tube: "pharynx", path: [[30, -2], [38, 0], [44, 1.5]], label: "Pharynx" },
      { tube: "oral", path: [[44, 1.5], [50, 0.5], [57, -0.5]], label: "Mouth" },
    ],
    tubeScale: 1.3,
    sources: [{ key: "glottis", at: [30, -2], label: "Larynx" }],
  },
  "alligator": {
    view: { x0: -120, x1: 120, y0: -40, y1: 40 },
    silhouette: [[-118, 2], [-90, -4], [-60, -8], [-30, -14], [0, -16], [30, -14], [50, -10], [70, -8], [95, -5], [114, -3], [118, 0], [115, 3], [98, 5], [75, 7], [52, 9], [40, 12], [20, 14], [-10, 14], [-40, 11], [-70, 7], [-100, 4]],
    parts: [{ shade: 0.15, pts: [[54, 9], [56, 11], [58, 9], [56, 8]] }],
    tubes: [
      { tube: "trachea", path: [[0, -6], [18, -5], [36, -4]], label: "Trachea" },
      { tube: "pharynx", path: [[36, -4], [46, -2], [54, 0]], label: "Pharynx" },
      { tube: "oral", path: [[54, 0], [80, -1], [112, -1]], label: "Mouth" },
      { tube: "nasal", path: [[54, 2], [80, 4], [113, 2]], label: "Nostrils" },
    ],
    tubeScale: 1.05,
    sources: [{ key: "glottis", at: [36, -4], label: "Larynx" }],
  },
  "elephant": {
    view: { x0: -170, x1: 170, y0: -170, y1: 130 },
    silhouette: [[-160, 20], [-150, 70], [-110, 105], [-40, 118], [30, 115], [70, 100], [95, 112], [120, 108], [140, 85], [148, 55], [146, 25], [140, 5], [132, -20], [128, -60], [122, -110], [118, -150], [108, -152], [112, -100], [110, -50], [104, -20], [96, -5], [80, 0], [70, -10], [66, -90], [40, -95], [44, -30], [-90, -30], [-95, -95], [-125, -95], [-122, -10], [-150, -5]],
    parts: [{ shade: 0.15, pts: [[118, 62], [122, 66], [126, 62], [122, 58]] }, { shade: 0.62, pts: [[70, 100], [40, 60], [55, 25], [85, 40], [95, 80]] }],
    tubes: [
      { tube: "trachea", path: [[40, 20], [70, 30], [95, 38]], label: "Trachea" },
      { tube: "pharynx", path: [[95, 38], [112, 50], [124, 58]], label: "Pharynx" },
      { tube: "oral", path: [[124, 58], [130, 42], [134, 30]], label: "Mouth" },
      { tube: "trunk", path: [[136, 70], [142, 40], [136, 0], [128, -50], [120, -100], [113, -148]], label: "Trunk" },
    ],
    tubeScale: 3,
    sources: [{ key: "glottis", at: [95, 38], label: "Vocal folds" }, { key: "lips", at: [136, 70], label: "Trunk valve" }],
  },
};
