// What the residents use to think with.
//
// There are two of these and they answer the same three questions — hold a
// conversation, have a thought, answer the player — so the simulation never has
// to know which one is installed:
//
//   OfflineBrain  grammar + memory retrieval. Instant, works with no GPU and no
//                 network, and is what you arrive with.
//   LiveBrain     a real LLM on the GPU (WebLLM / WebGPU, in a worker), with
//                 JSON-schema-constrained output so a 0.8B model can't wander
//                 off and return an essay instead of four lines of dialogue.
//
// BrainHub installs exactly one of them, chosen by the player, and never
// substitutes. See the note above the class for why that matters.

import { pick } from './util.js'

// The brains on offer, scripted first because it's what you arrive with and
// what you fall back to on a machine with no WebGPU. It is listed as a peer of
// the models, not hidden behind them, so choosing it is a choice.
export const SCRIPTED = {
  id: 'scripted',
  label: 'No model',
  note: 'a grammar per resident — instant, offline, and obviously not thinking',
  vram: 0,
}

export const MODELS = [
  {
    id: 'Qwen3.5-0.8B-q4f16_1-MLC',
    label: 'Qwen3.5 0.8B',
    note: 'the default — newest small model, ~1.6 GB of VRAM',
    vram: 1630,
  },
  {
    id: 'SmolLM2-360M-Instruct-q4f16_1-MLC',
    label: 'SmolLM2 360M',
    note: 'featherweight, ~0.4 GB — for laptops and impatience',
    vram: 376,
  },
  {
    id: 'Qwen3.5-2B-q4f16_1-MLC',
    label: 'Qwen3.5 2B',
    note: 'the good one, ~2.2 GB — noticeably better company',
    vram: 2245,
  },
]

const DIALOGUE_SCHEMA = JSON.stringify({
  type: 'object',
  properties: {
    lines: { type: 'array', items: { type: 'string' } },
  },
  required: ['lines'],
  additionalProperties: false,
})

const THOUGHT_SCHEMA = JSON.stringify({
  type: 'object',
  properties: { thought: { type: 'string' } },
  required: ['thought'],
  additionalProperties: false,
})

// Qwen3.x will happily emit a <think> block even when asked not to; the request
// turns thinking off, and this catches the case where it does it anyway.
function stripThinking(text) {
  return String(text ?? '')
    .replace(/<think>[\s\S]*?<\/think>/gi, '')
    .replace(/^[\s\S]*?<\/think>/i, '')
    .trim()
}

// Models under a couple of billion parameters put stage directions and speaker
// labels in things. Take the line, not the screenplay.
// The order here is load-bearing: the bullet has to go before the speaker label
// can be seen, the label before the quotes it wraps, and the stage directions
// before the bullet rule would mistake a leading "*" for one.
function cleanLine(text, speakerName) {
  let s = stripThinking(text).split('\n')[0].trim()
  // A list bullet — but not the opening "*" of "*wipes her hands*", which has
  // no space after it.
  s = s.replace(/^(?:[-•]\s+|\*\s+)/, '')
  const first = speakerName.split(' ')[0]
  s = s.replace(new RegExp(`^\\s*(${first}|${speakerName})\\s*[:–-]\\s*`, 'i'), '')
  // Stage directions, wherever in the line they landed.
  s = s.replace(/\*[^*]*\*/g, ' ')
  s = s.replace(/\s*\([^)]*\)\s*$/, '')
  s = s.replace(/\s+/g, ' ').trim()
  s = s.replace(/^["“](.*)["”]$/, '$1').trim()
  if (s.length > 160) {
    const cut = s.slice(0, 160)
    const stop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '), cut.lastIndexOf('? '))
    s = stop > 60 ? cut.slice(0, stop + 1) : `${cut.trimEnd()}…`
  }
  return s
}

// ---------------------------------------------------------------- offline ---

const MEMORY_FRAMES = [
  'Still turning over {topic}, if I’m honest.',
  'It’s {topic} I keep coming back to.',
  'Everything comes back to {topic} this week.',
  'I’ve had {topic} in my head since this morning.',
  'Don’t get me started on {topic}.',
]

const HANDOFFS = [
  'Anyway.',
  'You see what I mean.',
  'Don’t say I said it.',
  'That’s all I’ll say.',
  'Make of that what you like.',
]

export class OfflineBrain {
  constructor(rng = Math.random) {
    this.rng = rng
    this.kind = 'offline'
  }

  // These three are deliberately synchronous: the warm start replays a few
  // hours of town history before the first frame, and it can only do that if
  // the offline brain answers in the same tick it's asked.
  //
  // A short exchange, alternating, starting with `a`.
  converse(ctx) {
    const rng = this.rng
    const them = ctx.b.name.split(' ')[0]
    const lines = []
    const open = pick(rng, ctx.a.voice.open).replace(/\{them\}/g, them)
    lines.push({ who: 'a', text: open })

    if (ctx.rumour) {
      lines.push({ who: 'b', text: pick(rng, ctx.b.voice.reply) })
      lines.push({ who: 'a', text: pick(rng, ctx.a.voice.gossip).replace(/\{rumor\}/g, ctx.rumour.text) })
      lines.push({ who: 'b', text: pick(rng, ctx.b.voice.hear) })
    } else {
      lines.push({ who: 'b', text: pick(rng, ctx.b.voice.reply) })
      const topic = ctx.a.topics[0]
      lines.push({
        who: 'a',
        text: topic
          ? pick(rng, MEMORY_FRAMES).replace('{topic}', topic)
          : pick(rng, ctx.a.voice.idle),
      })
      lines.push({ who: 'b', text: rng() < 0.4 ? pick(rng, HANDOFFS) : pick(rng, ctx.b.voice.reply) })
    }
    return { lines, source: 'offline' }
  }

  reflect(ctx) {
    const rng = this.rng
    const topic = ctx.topics[0] ?? 'the day'
    const frames = [
      `I think ${topic} is going to matter.`,
      `Nobody else has noticed ${topic} yet.`,
      `Whatever else happens, there’s ${topic}.`,
      `I’ve decided how I feel about ${topic}, and it’s complicated.`,
      `${topic[0].toUpperCase()}${topic.slice(1)} — that’s the thread.`,
      `I keep being wrong about ${topic}, and I keep going back.`,
      `If anyone asks, I never said a word about ${topic}.`,
      `Somebody ought to do something about ${topic}.`,
      `${topic[0].toUpperCase()}${topic.slice(1)} is not the problem. It’s next to the problem.`,
      `I’ll give it till Thursday, and then I’m asking about ${topic} outright.`,
    ]
    return { text: pick(rng, frames), source: 'offline' }
  }

  interview(ctx) {
    const rng = this.rng
    const bits = []
    bits.push(pick(rng, ctx.self.voice.reply))
    if (ctx.memories.length) {
      bits.push(`What I can tell you is this: ${ctx.memories[0]}.`)
    }
    if (ctx.rumours.length && rng() < 0.7) {
      bits.push(pick(rng, ctx.self.voice.gossip).replace(/\{rumor\}/g, ctx.rumours[0]))
    } else {
      bits.push(pick(rng, ctx.self.voice.idle))
    }
    return { text: bits.join(' '), source: 'offline' }
  }
}

// ------------------------------------------------------------------- live ---

export class LiveBrain {
  constructor() {
    this.kind = 'live'
    this.engine = null
    this.worker = null
    this.modelId = null
    this.busy = 0
    this.tokens = 0
    this.seconds = 0
  }

  async load(modelId, onProgress) {
    if (!navigator.gpu) throw new Error('This browser has no WebGPU. Chrome or Edge 113+, or Safari 26+.')
    // One vendored copy, imported by URL from both sides — see llm-worker.js.
    // `document.baseURI` rather than `import.meta.url` so it resolves against
    // the page wherever the app is mounted, including the Pages sub-path.
    const lib = new URL('./vendor/web-llm.js', document.baseURI).href
    const webllm = await import(/* @vite-ignore */ lib)
    // Which wire format `decide` can use — see the note there.
    this.supportsTools = (webllm.functionCallingModelIds ?? []).includes(modelId)
    this.worker = new Worker(new URL('../llm-worker.js', import.meta.url), { type: 'module' })
    this.worker.postMessage({ kind: 'simville-init', lib })
    try {
      this.engine = await webllm.CreateWebWorkerMLCEngine(this.worker, modelId, {
        initProgressCallback: (r) => onProgress?.(r.progress ?? 0, r.text ?? ''),
      })
    } catch (err) {
      this.worker.terminate()
      this.worker = null
      // Whatever goes wrong inside the worker comes back across postMessage as
      // a plain string rather than an Error, so read it as text either way.
      const msg = err?.message ?? String(err)
      // "Failed to fetch" is what both an offline connection and a blocked one
      // look like from here — a Content-Security-Policy refusal is reported to
      // the console but reaches script as the same generic TypeError, so there
      // is nothing to tell them apart by. Say both, and don't advise a retry
      // that can't work. Being inside someone else's frame is the one strong
      // hint available, and it's the usual reason: an embedding host's
      // connect-src won't list huggingface.co.
      if (/failed to fetch|networkerror|load failed|err_/i.test(msg)) {
        const embedded = window.self !== window.top
        throw new Error(
          'Couldn’t reach Hugging Face for the weights. ' +
            (embedded
              ? 'This page is running inside another site, and that site’s content-security policy almost certainly blocks the download — open Simville on its own to load a model.'
              : 'Either the connection is down or something on the network is blocking it.'),
        )
      }
      if (/webgpu|adapter|device/i.test(msg)) {
        throw new Error(`WebGPU wouldn’t start: ${msg}`)
      }
      throw new Error(msg)
    }
    this.modelId = modelId
    return this
  }

  async unload() {
    try {
      await this.engine?.unload()
    } catch {
      /* the worker is going away regardless */
    }
    this.worker?.terminate()
    this.engine = null
    this.worker = null
  }

  async #complete(messages, { schema, maxTokens = 220, temperature = 0.9 }) {
    this.busy++
    const t0 = performance.now()
    try {
      const reply = await this.engine.chat.completions.create({
        messages,
        temperature,
        top_p: 0.95,
        max_tokens: maxTokens,
        // Qwen3.x is a hybrid-reasoning model and a town sim does not need it
        // narrating its own deliberation into a speech bubble.
        extra_body: { enable_thinking: false },
        ...(schema ? { response_format: { type: 'json_object', schema } } : {}),
      })
      const text = reply.choices?.[0]?.message?.content ?? ''
      const used = reply.usage?.completion_tokens ?? 0
      this.tokens += used
      this.seconds += (performance.now() - t0) / 1000
      return text
    } finally {
      this.busy--
    }
  }

  get tokensPerSecond() {
    return this.seconds > 0.5 ? this.tokens / this.seconds : 0
  }

  async converse(ctx) {
    const sys =
      'You write dialogue for a small English town simulation. Write how people actually speak: ' +
      'short, plain, mid-conversation. No narration, no stage directions, no names in front of lines. ' +
      'Answer with JSON only.'
    const brief = [
      `A is ${ctx.a.name}, ${ctx.a.role}. ${ctx.a.bio}`,
      `B is ${ctx.b.name}, ${ctx.b.role}. ${ctx.b.bio}`,
      `They meet at ${ctx.place}, ${ctx.timeOfDay}. A is ${ctx.a.doing}; B is ${ctx.b.doing}.`,
      ctx.a.memories.length ? `A has been thinking about: ${ctx.a.memories.join('; ')}.` : '',
      ctx.b.memories.length ? `B has been thinking about: ${ctx.b.memories.join('; ')}.` : '',
      ctx.rumour ? `A wants to bring up a rumour: "${ctx.rumour.text}". B reacts in character.` : '',
      ctx.tie > 0.4 ? 'They like each other.' : ctx.tie < -0.2 ? 'They get on each other’s nerves.' : '',
      '',
      'Return {"lines": [...]} with exactly 4 strings: A, then B, then A, then B.',
      'Each under 18 words. No quotation marks, no speaker labels.',
    ]
      .filter(Boolean)
      .join('\n')

    const raw = await this.#complete(
      [
        { role: 'system', content: sys },
        { role: 'user', content: brief },
      ],
      { schema: DIALOGUE_SCHEMA, maxTokens: 220 },
    )

    const parsed = JSON.parse(stripThinking(raw))
    const strings = (parsed.lines ?? []).filter((s) => typeof s === 'string' && s.trim())
    if (strings.length < 2) throw new Error('model returned no usable dialogue')
    const lines = strings.slice(0, 4).map((s, i) => ({
      who: i % 2 === 0 ? 'a' : 'b',
      text: cleanLine(s, i % 2 === 0 ? ctx.a.name : ctx.b.name),
    }))
    return { lines: lines.filter((l) => l.text), source: 'live' }
  }

  // Free-time behaviour, chosen by the model itself. This is the one place the
  // LLM moves a body rather than a mouth, and it only ever runs when somebody
  // has nothing scheduled — a wrong answer costs a wasted walk, never a broken
  // day, and a refusal just leaves the schedule in charge.
  //
  // Two wire formats, one decision. WebLLM implements OpenAI-style tool calling
  // but hard-gates `tools` to an allowlist of five Hermes models
  // (`functionCallingModelIds`) — passing it with anything else throws
  // UnsupportedModelIdError, regardless of what that model's own chat template
  // can do. So: tools when the loaded model is on the list, and the same choice
  // as a JSON schema when it isn't. Both run through the same constrained
  // decoder underneath, so the answer is equally parseable either way.
  async decide(ctx) {
    const placeIds = ctx.places.map((p) => p.id)
    const peopleIds = ctx.people.map((p) => p.id)
    const messages = [
      {
        role: 'system',
        content:
          'You decide what a character in a small-town simulation does next. ' +
          'Pick exactly one action. Stay in character and keep it ordinary — this is a quiet town.',
      },
      {
        role: 'user',
        content:
          `You are ${ctx.name}, ${ctx.role}. ${ctx.bio}\n` +
          `It is ${ctx.timeOfDay}. You are at ${ctx.place}, ${ctx.doing}, and you have a free hour.\n` +
          (ctx.memories.length ? `Lately: ${ctx.memories.join('; ')}.\n` : '') +
          (ctx.rumours.length ? `You have heard: ${ctx.rumours.join('; ')}.\n` : '') +
          `Places: ${ctx.places.map((p) => `${p.id} (${p.name})`).join(', ')}.\n` +
          `People: ${ctx.people.map((p) => `${p.id} (${p.name}, ${p.role})`).join(', ')}.\n` +
          'What do you do?',
      },
    ]

    if (this.supportsTools) {
      const arg = (extra) => ({
        type: 'object',
        properties: { ...extra, because: { type: 'string', description: 'a few words, in character' } },
        required: [...Object.keys(extra), 'because'],
      })
      const reply = await this.engine.chat.completions.create({
        messages,
        tools: [
          {
            type: 'function',
            function: {
              name: 'go_to',
              description: 'Walk somewhere in town and spend some time there.',
              parameters: arg({ place: { type: 'string', enum: placeIds } }),
            },
          },
          {
            type: 'function',
            function: {
              name: 'seek_out',
              description: 'Go and find a particular person, wherever they are.',
              parameters: arg({ person: { type: 'string', enum: peopleIds } }),
            },
          },
          {
            type: 'function',
            function: {
              name: 'stay',
              description: 'Stay where you are and carry on with what you were doing.',
              parameters: arg({}),
            },
          },
        ],
        tool_choice: 'auto',
        temperature: 0.8,
        max_tokens: 160,
      })
      const call = reply.choices?.[0]?.message?.tool_calls?.[0]
      if (!call) return null
      try {
        return { action: call.function.name, ...JSON.parse(call.function.arguments || '{}'), source: 'live' }
      } catch {
        return null
      }
    }

    const schema = JSON.stringify({
      type: 'object',
      properties: {
        action: { type: 'string', enum: ['go_to', 'seek_out', 'stay'] },
        place: { type: 'string', enum: placeIds },
        person: { type: 'string', enum: peopleIds },
        because: { type: 'string' },
      },
      required: ['action', 'because'],
      additionalProperties: false,
    })
    const raw = await this.#complete(
      [
        messages[0],
        {
          role: 'user',
          content:
            `${messages[1].content}\n` +
            'Answer as JSON: {"action": "go_to"|"seek_out"|"stay", "place": <place id, for go_to>, ' +
            '"person": <person id, for seek_out>, "because": "<a few words, in character>"}',
        },
      ],
      { schema, maxTokens: 130, temperature: 0.8 },
    )
    try {
      return { ...JSON.parse(stripThinking(raw)), source: 'live' }
    } catch {
      return null
    }
  }

  async reflect(ctx) {
    const raw = await this.#complete(
      [
        {
          role: 'system',
          content: 'You are a person thinking to yourself at the end of a stretch of day. One sentence. JSON only.',
        },
        {
          role: 'user',
          content:
            `You are ${ctx.name}, ${ctx.role}. ${ctx.bio}\n` +
            `Today you noticed: ${ctx.memories.join('; ')}.\n` +
            'Return {"thought": "..."} — one sentence, first person, under 22 words, a conclusion rather than a summary.',
        },
      ],
      { schema: THOUGHT_SCHEMA, maxTokens: 110, temperature: 0.95 },
    )
    const parsed = JSON.parse(stripThinking(raw))
    const text = cleanLine(parsed.thought ?? '', ctx.name)
    if (!text) throw new Error('empty reflection')
    return { text, source: 'live' }
  }

  async interview(ctx, onToken) {
    this.busy++
    const t0 = performance.now()
    try {
      const messages = [
        {
          role: 'system',
          content:
            `You are ${ctx.self.name}, ${ctx.self.role} in the town of Simville. ${ctx.self.bio}\n` +
            `It is ${ctx.timeOfDay} and you are at ${ctx.place}, ${ctx.doing}.\n` +
            (ctx.memories.length ? `Recently: ${ctx.memories.join('; ')}.\n` : '') +
            (ctx.rumours.length ? `Rumours you've heard: ${ctx.rumours.join('; ')}.\n` : '') +
            'Answer in character, in two or three short sentences. Never break character or mention being a model.',
        },
        { role: 'user', content: ctx.question },
      ]
      const stream = await this.engine.chat.completions.create({
        messages,
        temperature: 0.85,
        top_p: 0.95,
        max_tokens: 180,
        stream: true,
        stream_options: { include_usage: true },
        extra_body: { enable_thinking: false },
      })
      // The raw stream is accumulated untouched and only cleaned on the way to
      // the screen. Cleaning the accumulator instead trims its trailing space,
      // and the next chunk then arrives welded onto the last word.
      let raw = ''
      for await (const chunk of stream) {
        const delta = chunk.choices?.[0]?.delta?.content ?? ''
        if (chunk.usage) this.tokens += chunk.usage.completion_tokens ?? 0
        if (!delta) continue
        raw += delta
        // Mid-deliberation: show nothing rather than show the thinking and
        // snatch it back once the closing tag turns up.
        if (/<think>/i.test(raw) && !/<\/think>/i.test(raw)) continue
        const visible = stripThinking(raw)
        if (visible) onToken?.(visible)
      }
      this.seconds += (performance.now() - t0) / 1000
      const text = stripThinking(raw)
      if (!text) throw new Error('empty answer')
      return { text, source: 'live' }
    } finally {
      this.busy--
    }
  }
}

// -------------------------------------------------------------------- hub ---

// Which brain is installed is a mode the player picks, not something the hub
// decides per request.
//
// It used to fall back to the grammar whenever the model was busy, slow or
// threw, which meant a town running a real model still emitted scripted lines
// several times a minute with nothing to tell them apart — the one genuinely
// dishonest thing this could do. So: `scripted` gives you the grammar and says
// so, `live` gives you the model and nothing else. A model that can't take a
// request right now produces silence, and the town carries on without words,
// because a conversation you can't hear is true and a fake one isn't.
export class BrainHub {
  constructor(rng = Math.random) {
    this.offline = new OfflineBrain(rng)
    this.live = null
    this.mode = 'scripted' // scripted | live
    this.status = 'scripted' // scripted | loading | live | failed
    this.progress = 0
    this.detail = ''
    this.error = null
    this.modelId = null
    this.pending = 0
    this.listeners = new Set()
    // Two in flight is enough to keep the GPU busy without the town drifting
    // minutes behind the words coming out of it. Anything past that is a
    // conversation nobody hears.
    this.maxPending = 2
    this.skipped = 0 // conversations the model was too busy to speak for
  }

  onChange(fn) {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  #emit() {
    for (const fn of this.listeners) fn(this)
  }

  get isLive() {
    return this.status === 'live' && this.live?.engine
  }

  async wake(modelId) {
    if (this.status === 'loading') return
    this.mode = 'live'
    this.status = 'loading'
    this.progress = 0
    this.detail = 'starting up'
    this.error = null
    this.modelId = modelId
    this.#emit()
    try {
      const live = new LiveBrain()
      await live.load(modelId, (p, text) => {
        this.progress = p
        this.detail = text
        this.#emit()
      })
      this.live = live
      this.status = 'live'
      this.detail = ''
    } catch (err) {
      this.error = err?.message ?? String(err)
      this.status = 'failed'
      this.live = null
      // A model that never arrived must not leave the town silently running on
      // the grammar while the header claims a model is in.
      this.mode = 'scripted'
      this.modelId = null
    }
    this.#emit()
  }

  // Back to the grammar, deliberately. Unloading frees the GPU memory.
  async sleep() {
    const live = this.live
    this.live = null
    this.mode = 'scripted'
    this.status = 'scripted'
    this.modelId = null
    this.progress = 0
    this.error = null
    this.#emit()
    // The mode has already flipped; a failure tearing the engine down must not
    // propagate and leave the UI thinking the switch didn't happen.
    try {
      await live?.unload()
    } catch (err) {
      console.warn('[simville] unloading the model failed:', err)
    }
  }

  // Route one request to whichever brain is installed. In `live` mode the
  // grammar is not a fallback — if the model can't take this one, nobody says
  // anything, and `null` tells the sim to run the conversation silently.
  async #route(name, args) {
    if (this.mode !== 'live') return this.offline[name](...args)
    if (!this.isLive || this.pending >= this.maxPending) {
      this.skipped++
      return null
    }
    this.pending++
    this.#emit()
    try {
      return await this.live[name](...args)
    } catch (err) {
      // One bad generation isn't worth tearing the model down for, and a dead
      // engine will simply keep returning nothing.
      console.warn(`[simville] ${name} failed; staying quiet rather than faking it:`, err)
      return null
    } finally {
      this.pending--
      this.#emit()
    }
  }

  converse(ctx) {
    return this.#route('converse', [ctx])
  }

  reflect(ctx) {
    return this.#route('reflect', [ctx])
  }

  // Straight to the grammar, no promise. The warm start replays hours of town
  // history before the first frame draws and can't await anything; it only ever
  // runs at startup, when no model has been loaded yet.
  converseSync(ctx) {
    return this.offline.converse(ctx)
  }

  reflectSync(ctx) {
    return this.offline.reflect(ctx)
  }

  // Only the live brain has an opinion about what to do next; offline, the
  // schedule is the whole plan, and null tells the sim to leave it alone.
  async decide(ctx) {
    if (!this.isLive || this.pending >= this.maxPending) return null
    this.pending++
    this.#emit()
    try {
      return await this.live.decide(ctx)
    } catch (err) {
      console.warn('[simville] live decide failed, keeping the schedule:', err)
      return null
    } finally {
      this.pending--
      this.#emit()
    }
  }

  // The player's own question jumps the queue — they asked, and they're waiting.
  // In live mode a failure is reported rather than papered over with a grammar
  // line the player would have no way of recognising as one.
  async interview(ctx, onToken) {
    if (this.mode !== 'live') return this.offline.interview(ctx)
    if (!this.isLive) return null
    this.pending++
    this.#emit()
    try {
      return await this.live.interview(ctx, onToken)
    } catch (err) {
      console.warn('[simville] interview failed:', err)
      return null
    } finally {
      this.pending--
      this.#emit()
    }
  }

  get stats() {
    if (!this.isLive) return null
    return { tps: this.live.tokensPerSecond, tokens: this.live.tokens, skipped: this.skipped }
  }
}
