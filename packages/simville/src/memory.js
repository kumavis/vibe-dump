// The memory stream, more or less as the generative-agents paper describes it:
// everything a resident notices is appended as a timestamped record, and asking
// "what's on your mind about X" scores the whole stream on recency, importance
// and relevance and returns the top few.
//
// The scores are what the inspector rail visualises, so they're kept on the
// record rather than recomputed for display.

const STOP = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be', 'been', 'to', 'of', 'in',
  'on', 'at', 'for', 'with', 'about', 'from', 'by', 'it', 'its', 'this', 'that', 'there', 'here',
  'i', 'me', 'my', 'you', 'your', 'he', 'she', 'they', 'them', 'his', 'her', 'their', 'we', 'us',
  'said', 'says', 'told', 'just', 'so', 'as', 'if', 'then', 'than', 'has', 'have', 'had', 'do',
  'does', 'did', 'not', 'no', 'yes', 'up', 'out', 'who', 'what', 'when', 'where', 'how',
])

export function keywords(text) {
  const out = new Set()
  for (const raw of String(text).toLowerCase().split(/[^a-z0-9']+/)) {
    const w = raw.replace(/^'+|'+$/g, '')
    if (w.length < 3 || STOP.has(w)) continue
    out.add(w)
  }
  return out
}

// Half-life of an hour of town time: a morning's memories have faded to a third
// of their weight by evening, which is what makes the stream feel like a day
// rather than a log file.
const RECENCY_HALFLIFE = 180

export class MemoryStream {
  constructor(limit = 160) {
    this.items = []
    this.limit = limit
    this.seq = 0
  }

  // kind: 'observation' | 'dialogue' | 'reflection' | 'plan' | 'rumor'
  add(now, kind, text, importance = 3, meta = {}) {
    const item = {
      id: ++this.seq,
      t: now,
      kind,
      text,
      importance,
      keys: keywords(text),
      ...meta,
    }
    this.items.push(item)
    // The stream is unbounded in principle and a browser tab is not, so the
    // oldest low-importance records are dropped once it gets long.
    if (this.items.length > this.limit) {
      let worst = 0
      let worstScore = Infinity
      for (let i = 0; i < this.items.length >> 1; i++) {
        const s = this.items[i].importance * 1000 + this.items[i].t
        if (s < worstScore) { worstScore = s; worst = i }
      }
      this.items.splice(worst, 1)
    }
    return item
  }

  recent(n = 6) {
    return this.items.slice(-n).reverse()
  }

  // Top-scoring memories for a query, with the component scores attached so the
  // UI can show why each one surfaced.
  retrieve(now, query, n = 4) {
    const q = query instanceof Set ? query : keywords(query)
    const scored = []
    for (const m of this.items) {
      const recency = Math.pow(0.5, (now - m.t) / RECENCY_HALFLIFE)
      let overlap = 0
      for (const k of q) if (m.keys.has(k)) overlap++
      const relevance = q.size ? overlap / Math.sqrt(q.size) : 0
      const score = recency * 0.9 + (m.importance / 10) * 1.1 + relevance * 1.3
      scored.push({ m, score, recency, relevance })
    }
    scored.sort((a, b) => b.score - a.score)
    return scored.slice(0, n)
  }

  // Everything since a moment, oldest first — used to decide when somebody has
  // enough unreflected experience to have a thought about it.
  since(t) {
    return this.items.filter((m) => m.t > t)
  }
}
