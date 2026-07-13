# Token Foundry

A Factorio-like where the factory is an LLM inference company. Design method:
identify the real engineering landscape of LLM serving/training first, then
derive every game mechanic from a real constraint.

## The engineering landscape → mechanics

| Real system | Real constraint | Game mechanic |
|---|---|---|
| Tokenization | Cheap CPU work ahead of the GPUs | 🔤 Tokenizer: prompts → 4× input-token blocks; tiny power draw |
| Prefill | **Compute-bound**: FLOPs ≈ 2·params·prompt_tokens, parallel over the prompt; writes the KV cache | ⚙️ Prefill pod turns input tokens into KV blocks; rate scales down with deployed model size |
| KV cache | Bytes/token = 2·layers·kv_heads·head_dim·dtype; lives in HBM; GQA shrinks it (70B has cheaper KV/token than dense 8B) | 💠 KV blocks are physical items; per-tier `kvKB` cited from real architectures; decode batch slots shrink as weights eat HBM |
| Decode | **Memory-bandwidth-bound**: every token re-reads all weights + KV; batching amortizes; roofline caps throughput | 🧠 Decode pod holds KV blocks as live sequences; throughput = min(batch × seqRate, 0.7 roofline); panel reports *batch-underfilled / bandwidth-bound / kv-capacity* |
| Disaggregated serving (DistServe/Mooncake/Dynamo) | KV cache physically transfers prefill→decode over NVLink/IB; redeploys invalidate in-flight cache | Belts carry KV between pods; deploying a new model purges stale KV blocks with a toast |
| Power & cooling | ~1 kW/GPU, MW pods, PUE overhead, grid contention | Gas turbines (fuel = marginal $/token) and nuclear SMRs; pylon coverage networks; brownouts throttle proportionally; uncooled GPUs run at 40% |
| Training | Data pipeline (scrape→clean→tokenize) + Chinchilla ~20 tokens/param + megawatts | 🕸 Scraper → tokenizer → 🎓 training cluster burns training tokens toward checkpoints; tier `trainNeed` scales with params |
| Scaling trade-off | Bigger model: higher $/token quality, slower prefill, fatter KV, smaller batches, hungrier | The five model tiers (125M → 400B MoE) move every serving stat in the realistic direction |
| Hardware generations | A100→H100→B200: ~3×/2× FLOPs & bandwidth jumps at higher watts | Fleet upgrades multiply pod rate, batch slots, and power draw |
| Agentic composition | Outputs re-enter as context; every hop **re-prefills**; context window bounds depth | 🔁 Relay converts output→context (depth+1, max 3); gateway pays +60%/depth; deep loops cost real compute |

All numbers live in `src/data.js` with comments citing the real quantities they
were scaled from. The same primer ships in-game (`?` button / `H`).

## Code layout

- `src/data.js` — items, model tiers, hardware gens, building stats, objectives
- `src/sim.js` — fixed-step deterministic sim: power networks (union of coverage
  discs), cooling, building logic, cellular belt movement, research, save/load.
  No DOM — it can run headless in Node.
- `src/render.js` — canvas renderer (camera, belts, coverage overlays, ghosts)
- `src/ui.js` — toolbar, HUD, tabbed panel, input, tooltips
- `src/help.js` — the in-game engineering primer
