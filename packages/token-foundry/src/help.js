// help.js — the engineering primer shown in-game. The game's mechanics were
// derived from this document, not the other way around.
export const HELP_HTML = `
<h1>Token Foundry — the real engineering, then the game</h1>
<p class="lede">Every mechanic here is a real constraint from LLM serving and training,
scaled to belt-and-building size. Read this once and the factory designs itself.</p>

<h2>1 · The serving pipeline</h2>
<p>A production LLM request goes: <b>tokenize → prefill → decode → detokenize</b>.
Tokenization is cheap CPU work. The two GPU phases are physically different workloads,
which is the central fact of inference engineering:</p>
<ul>
<li><b>Prefill is compute-bound.</b> The whole prompt is processed in parallel;
FLOPs ≈ 2 × params × prompt_tokens. Its product is the <b>KV cache</b> — the attention
keys and values for every prompt token. In the game: the ⚙️ Prefill pod turns
<span class="i itok">input tokens</span> into <span class="i kv">KV blocks</span>,
and its speed drops as your deployed model grows.</li>
<li><b>Decode is memory-bandwidth-bound.</b> Each new token requires re-reading
<i>all</i> the weights plus that sequence's KV cache from HBM, to do a tiny amount of math.
The fix is <b>batching</b>: serve many sequences per pass so the weight read is amortized.
In the game: the 🧠 Decode pod holds KV blocks as live sequences and streams
<span class="i otok">output tokens</span>; throughput ≈ min(batch × per-seq rate, roofline).
Keep it batch-full or you're wasting a pod.</li>
</ul>

<h2>2 · KV cache is a real object — hence the belts</h2>
<p>KV bytes per token = 2 × layers × kv_heads × head_dim × dtype_bytes.
An 8B dense model spends ~0.5&nbsp;MB per token; a 70B with <b>grouped-query attention</b>
(8 KV heads instead of 64) spends <i>less per token than the 8B</i> — but its 140&nbsp;GB of
weights eat the HBM that batches need, so batch slots shrink anyway. That's why bigger
models in the game have fewer decode slots.</p>
<p>Modern serving stacks (DistServe, Mooncake, NVIDIA Dynamo) run <b>disaggregated
prefill/decode</b>: separate pods, with the KV cache physically shipped between them over
NVLink or InfiniBand. Your conveyor belts carrying purple KV blocks are that interconnect.
A redeploy really does invalidate every in-flight cache block — the game does it too.</p>

<h2>3 · Electricity and cooling are the binding constraint</h2>
<p>A modern GPU draws 700–1000&nbsp;W; a pod row is ~0.12&nbsp;MW; frontier training runs
are gigawatt-scale campus negotiations. Datacenters also pay a <b>PUE</b> overhead —
cooling and power delivery on top of the silicon. In the game: build generation
(🔥 gas has fuel cost — your marginal cost per token; ⚛️ nuclear is the PPA every lab wants),
extend coverage with pylons, and keep GPU pods inside ❄️ cooling radius or they
thermally throttle to 40%. Oversubscribed grids brown-out everything proportionally.</p>

<h2>4 · Training: Chinchilla budgets and the scaling trade</h2>
<p>Pretraining consumes tokens at Chinchilla-scale (~20 tokens per parameter:
a 70B wants ~1.4T tokens) and megawatts for weeks. The data side is its own factory:
scrape → clean/dedupe → tokenize. In the game: 🕸 scraper → 🔤 tokenizer →
🎓 training cluster, which burns <span class="i ttok">training tokens</span> toward the
next checkpoint. Deploying a bigger model raises $/token (quality is superlinear in scale)
but makes prefill slower, KV heavier, batches smaller, and everything hungrier — the
actual dilemma every serving team lives in.</p>

<h2>5 · Hardware generations</h2>
<p>A100 → H100 → B200 is roughly 3×/2× jumps in FLOPs and bandwidth per generation, at
higher watts. Fleet refreshes in the Upgrades tab multiply pod throughput and batch slots —
and your power bill.</p>

<h2>6 · Agentic composition</h2>
<p>Agent systems feed a model's output back in as context for another round. Two real costs:
the context must be <b>re-prefilled</b> every hop (the agent-loop tax), and the context
window caps how deep you can go. In the game: the 🔁 relay converts
<span class="i otok">output tokens</span> to <span class="i ctx">agent context</span>
(depth +1, max 3), which must flow through prefill again; the gateway pays +60% per depth.
Deep loops are lucrative exactly in proportion to the extra compute they burn.</p>

<h2>How to start</h2>
<p>You begin with a working nano-125M line:
🌐 Intake → 🔤 Tokenizer → ⚙️ Prefill → 🧠 Decode → 📤 Gateway, on a gas turbine with cooling.</p>
<ol>
<li>Click the decode pod: <i>batch-underfilled</i> means it's wasting weight reads —
add intakes and prefill until it says <i>bandwidth-bound</i>, then add another decode pod.</li>
<li>Add 🔁 relays to loop outputs back through prefill for depth money.</li>
<li>🕸 Scraper → 🔤 Tokenizer → 🎓 Training cluster to unlock bigger checkpoints; deploy from the Research tab.</li>
<li>Every step of scale needs more MW, more pylon coverage, and more ❄️ cooling.</li>
</ol>
<p class="keys"><b>Controls</b> — build: click/drag · rotate: <kbd>R</kbd> · delete: right-click ·
pan: arrows/WASD or middle-drag · zoom: wheel · power overlay: <kbd>P</kbd> · cancel: <kbd>Esc</kbd> · help: <kbd>H</kbd></p>
`
