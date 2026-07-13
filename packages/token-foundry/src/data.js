// data.js — every number in the game, derived from the real LLM-serving
// engineering landscape and then tuned for play. Where a value is scaled for
// gameplay, the comment says what the real quantity is.
//
// World scale: one "pod" building ≈ a ~150-GPU cluster row (~0.12 MW at
// ~800 W/GPU). One item = a 1k-token block. $ is abstract revenue units.

export const TILE = 32
export const GRID_W = 72
export const GRID_H = 48
export const TPS = 10            // sim ticks per second
export const BELT_EVERY = 3      // belts advance every N ticks (~3.3 tiles/s)
export const START_MONEY = 3500

export const DX = [1, 0, -1, 0]  // dir: 0=E 1=S 2=W 3=N
export const DY = [0, 1, 0, -1]

// ---------------------------------------------------------------- items ----
export const ITEMS = {
  prompt: { name: 'Prompt', color: '#e8e3d8', desc: 'A user request (~1k tokens of raw text). Must be tokenized before a GPU can touch it.' },
  itok:   { name: 'Input tokens ×1k', color: '#4fc3f7', desc: 'Tokenized prompt text, ready for prefill.' },
  ctx:    { name: 'Agent context ×1k', color: '#2dd4bf', desc: 'Model output routed back as input for another round. Must be re-prefilled — agent loops pay the prefill tax every hop.' },
  kv:     { name: 'KV-cache block', color: '#b388ff', desc: 'Attention keys/values for 1k tokens, produced by prefill. In disaggregated serving this literally moves between pods over NVLink/InfiniBand — here, over belts.' },
  otok:   { name: 'Output tokens ×1k', color: '#ffd54f', desc: 'Generated tokens. Sell at the API gateway, or relay back as agent context.' },
  data:   { name: 'Raw web data', color: '#a1887f', desc: 'Scraped corpus. Tokenize it into training tokens.' },
  ttok:   { name: 'Training tokens ×1k', color: '#81c784', desc: 'Cleaned, tokenized corpus for the training cluster.' },
}

// --------------------------------------------------------------- models ----
// The core scaling trade-off, all consequences of parameter count N:
//  * prefill rate ∝ TFLOPs / (2·N)          — compute-bound
//  * KV bytes/token = 2·layers·kv_heads·head_dim·2B (GQA shrinks it)
//  * decode batch slots ∝ (HBM − weights) / KV_per_seq
//  * decode per-seq speed ∝ HBM bandwidth / bytes_read_per_token
//  * $/token: quality rises superlinearly with scale (why frontier labs exist)
//  * training tokens to a good checkpoint ≈ Chinchilla ~20 tokens/param
export const TIERS = [
  { key: 'nano', name: 'nano-125M', params: '125M',
    value: 2, prefillRate: 2.0, slots: 8, seqRate: 0.5,
    kvKB: 73,   // 2·12L·12H·64d·2B ≈ 73 kB/token
    trainNeed: 0,
    note: 'GPT-2-small class. Cache is featherweight, batches are huge, tokens are nearly worthless.' },
  { key: 'micro', name: 'micro-1.5B', params: '1.5B',
    value: 6, prefillRate: 1.6, slots: 6, seqRate: 0.45,
    kvKB: 196,  // 2·24L·16H·128d·2B
    trainNeed: 40,  // Chinchilla: ~30B tokens
    note: 'Edge-deployable class. Chinchilla-optimal budget ≈ 30B training tokens.' },
  { key: 'base', name: 'base-8B', params: '8B',
    value: 18, prefillRate: 1.2, slots: 5, seqRate: 0.4,
    kvKB: 524,  // 2·32L·32H·128d·2B ≈ 0.5 MB/token (dense MHA — the classic 7-8B layout)
    trainNeed: 250, // ~160B+ tokens
    note: 'Workhorse class. Dense attention: half a megabyte of KV per token adds up fast.' },
  { key: 'large', name: 'large-70B', params: '70B',
    value: 60, prefillRate: 0.8, slots: 3, seqRate: 0.35,
    kvKB: 327,  // 2·80L·8KV·128d·2B — GQA! fewer KV heads than the 8B despite 10× params
    trainNeed: 1000, // ~1.4T tokens
    note: 'Grouped-query attention: 8 KV heads instead of 64, so per-token cache is smaller than the 8B — but 140 GB of weights eat the HBM that batches need.' },
  { key: 'frontier', name: 'frontier-400B', params: '400B MoE',
    value: 200, prefillRate: 0.5, slots: 2, seqRate: 0.3,
    kvKB: 918,
    trainNeed: 4000, // ~8T+ tokens
    note: 'Mixture-of-experts frontier class. Every serving number hurts; every token prints money.' },
]

// ------------------------------------------------------------- hardware ----
// Generations multiply pod throughput, HBM (batch slots) and power draw.
export const HW = [
  { key: 'a100', name: 'A100 pods', rate: 1, slots: 1, power: 1, cost: 0,
    note: '312 TFLOPs bf16 · 2.0 TB/s HBM2e · 80 GB · 400 W' },
  { key: 'h100', name: 'H100 pods', rate: 2, slots: 1.5, power: 1.4, cost: 50000,
    note: '~1000 TFLOPs bf16 · 3.35 TB/s HBM3 · 80 GB · 700 W' },
  { key: 'b200', name: 'B200 pods', rate: 4, slots: 2.5, power: 1.9, cost: 250000,
    note: '~2250 TFLOPs bf16 · 8 TB/s HBM3e · 192 GB · 1000 W' },
]

// Decode roofline: max pod throughput as a fraction of (slots × seqRate).
// A full batch is memory-bandwidth-bound — you can't get the last 30%.
export const DECODE_ROOFLINE = 0.7
export const GEN_LEN = 2         // output blocks generated per KV block
export const MAX_DEPTH = 3       // agent context-window cap
export const DEPTH_BONUS = 0.6   // sale multiplier = 1 + 0.6 × depth
export const UNCOOLED = 0.4      // thermal-throttle factor without cooling

// ------------------------------------------------------------ buildings ----
export const BUILDINGS = {
  belt: { name: 'Conveyor', cat: 'logistics', w: 1, h: 1, cost: 5, power: 0,
    glyph: '', color: '#3a4149',
    desc: 'Moves one item block per tile. Stand-in for the datacenter fabric: NVLink, InfiniBand, PCIe. KV cache really does travel like this between disaggregated prefill and decode pods.' },
  buffer: { name: 'Staging buffer', cat: 'logistics', w: 1, h: 1, cost: 120, power: 0.005,
    glyph: '🗄', color: '#4a5568',
    desc: 'Holds 8 blocks FIFO. Smooths bursty flows — the KV-transfer staging memory of a disaggregated serving stack.' },
  intake: { name: 'API intake', cat: 'inference', w: 2, h: 2, cost: 60, power: 0.005,
    glyph: '🌐', color: '#374d5e', rate: 0.3,
    desc: 'A customer contract: emits ~1 prompt every 3.3 s. Build more to take more traffic.' },
  tokenizer: { name: 'Tokenizer', cat: 'inference', w: 2, h: 2, cost: 120, power: 0.01,
    glyph: '🔤', color: '#33555e', rate: 0.5,
    desc: 'CPU work, nearly free next to the GPUs. Prompts → 4× input-token blocks. Also cleans raw web data → 4× training-token blocks.' },
  prefill: { name: 'Prefill pod', cat: 'inference', w: 2, h: 2, cost: 900, power: 0.12, gpu: true,
    glyph: '⚙️', color: '#2d4a8a',
    desc: 'COMPUTE-BOUND. Chews the whole prompt in parallel (FLOPs ≈ 2·params·tokens) and writes the KV cache. Bigger deployed model ⇒ slower prefill.' },
  decode: { name: 'Decode pod', cat: 'inference', w: 2, h: 2, cost: 900, power: 0.12, gpu: true,
    glyph: '🧠', color: '#553c8a',
    desc: 'MEMORY-BANDWIDTH-BOUND. Holds KV blocks in HBM as live sequences, streaming output tokens. Batch deeper to amortize weight reads — until you hit the bandwidth roofline.' },
  egress: { name: 'API gateway', cat: 'inference', w: 2, h: 2, cost: 120, power: 0.005, rate: 4,
    glyph: '📤', color: '#7a5c2e',
    desc: 'Sells output tokens. Deeper agent context sells for more (+60%/hop).' },
  relay: { name: 'Agent relay', cat: 'inference', w: 1, h: 1, cost: 300, power: 0.01, rate: 2,
    glyph: '🔁', color: '#2e6e64',
    desc: 'Feeds output tokens back as agent context for another round. Each hop must re-prefill (the agent-loop tax) but the final answer sells higher. Context window caps depth at 3.' },
  scraper: { name: 'Data scraper', cat: 'training', w: 2, h: 2, cost: 350, power: 0.03, rate: 0.25,
    glyph: '🕸', color: '#5a4a3a',
    desc: 'Crawls the web for raw corpus. Route it through a tokenizer to clean it into training tokens.' },
  trainer: { name: 'Training cluster', cat: 'training', w: 3, h: 3, cost: 2800, power: 0.6, gpu: true, rate: 2,
    glyph: '🎓', color: '#2e5e3a',
    desc: 'Burns training tokens (and 0.6 MW) toward the next checkpoint. Budgets follow Chinchilla: ~20 tokens per parameter.' },
  gas: { name: 'Gas turbine', cat: 'power', w: 3, h: 3, cost: 600, powerOut: 1.2, fuel: 0.6, r: 6,
    glyph: '🔥', color: '#6e5a2e',
    desc: 'Generates 1.2 MW. Burns $0.60/s of fuel at full load — the marginal cost of every token you serve.' },
  nuke: { name: 'Nuclear SMR', cat: 'power', w: 4, h: 4, cost: 9000, powerOut: 12, r: 9,
    glyph: '⚛️', color: '#3e6e5a',
    desc: 'Generates 12 MW, no fuel cost. What every frontier lab is signing PPAs for.' },
  pylon: { name: 'Power pylon', cat: 'power', w: 1, h: 1, cost: 25, power: 0, r: 5,
    glyph: '⚡', color: '#6e6e3a',
    desc: 'Extends grid coverage. Buildings must sit inside coverage to draw power.' },
  cool: { name: 'Cooling tower', cat: 'power', w: 2, h: 2, cost: 250, power: 0.05, coolR: 5,
    glyph: '❄️', color: '#2e5a6e',
    desc: 'GPU pods outside cooling coverage thermally throttle to 40%. The 0.05 MW it draws is your PUE overhead.' },
}

export const CATS = [
  ['logistics', 'Logistics'],
  ['inference', 'Inference'],
  ['power', 'Power & cooling'],
  ['training', 'Training'],
]

// ----------------------------------------------------------- objectives ----
export const OBJECTIVES = [
  { id: 'power', text: 'Energize the grid — a powered, loaded network', hint: 'Gas turbine near your buildings (pylons extend reach).' },
  { id: 'first', text: 'Serve your first output token', hint: 'Intake → Tokenizer → Prefill → Decode → Gateway, connected by belts.' },
  { id: 'rate2', text: 'Sustain 2 output blocks/s sold', hint: 'More intakes; keep the decode pod fed with KV.' },
  { id: 'batch5', text: 'Run a decode pod at batch ≥ 5', hint: 'Continuous batching: queue enough KV blocks at one decode pod.' },
  { id: 'agent', text: 'Sell a token at context depth ≥ 2', hint: 'Relay outputs back through prefill twice before selling.' },
  { id: 'train1', text: 'Train and deploy micro-1.5B', hint: 'Scraper → Tokenizer → Training cluster, then Deploy in Research.' },
  { id: 'h100', text: 'Refresh the fleet to H100s', hint: 'Upgrades tab. $50k.' },
  { id: 'large', text: 'Deploy large-70B', hint: '~1T training tokens. GQA makes its KV cheaper than the 8B’s.' },
  { id: 'rich', text: 'Bank $100k', hint: 'Frontier tokens at agent depth 3 print money.' },
]
