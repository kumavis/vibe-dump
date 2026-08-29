// The discovery layer: a follow graph, posts, and a feed.
//
// This sits UPSTREAM of everything else. EigenTrust can only rank people the
// delegators have seen, and who they have seen is decided here — by a follow
// graph with preferential attachment and a recommender ranking on engagement.
// If discovery is power-law and engagement-optimised, the trust graph inherits
// that distribution however good everyone's taste is.
//
// Two graphs, deliberately distinct: following is free and wide, delegating
// costs (1 - alpha) of your issuance share and is narrow. People follow
// hundreds and delegate to a handful.

import { observe } from './perception.mjs'
import { trueOutput } from './population.mjs'

/** Seed the follow graph: a few edges each, weighted toward the well-connected. */
export function initFollowGraph (rng, agents, config) {
  const weights = agents.map((a) => 0.15 + a.traits.social)
  const total = weights.reduce((s, w) => s + w, 0)
  for (const agent of agents) {
    const k = Math.round(config.initialFollows * (0.4 + agent.traits.social))
    for (let e = 0; e < k; e++) {
      const j = rng.weightedIndex(weights, total)
      if (j === agent.id || agent.following.has(j)) continue
      agent.following.add(j)
      agents[j].followers.add(agent.id)
    }
    agent.followingArr = [...agent.following]
  }
}

export class Feed {
  constructor () {
    this.active = []
    this.cum = null
    this.cumTotal = 0
    this.nextId = 0
    this.stats = {
      posts: 0,
      impressions: 0,
      curatedImpressions: 0,
      follows: 0,
      unfollows: 0,
      reshares: 0,
      digs: 0,
      boosts: 0,
      rescued: 0 // posts a curator was the first to surface
    }
  }

  /**
   * Everyone who is putting effort into being seen publishes. `substance` is
   * the part of their real output that survives compression into a post —
   * gated by legibility, which is why research and infrastructure work are
   * structurally harder to discover this way than a picture is.
   */
  publish (rng, agents, config, tick) {
    for (const agent of agents) {
      const rate = config.postRate * (0.25 + agent.effort.hustle * 4 + agent.effort.craft)
      if (rng.next() > rate) continue

      const substance = trueOutput(agent) * agent.traits.legibility
      const packaging = agent.traits.hustle * agent.effort.hustle
      const post = {
        id: this.nextId++,
        author: agent.id,
        tick,
        substance,
        packaging,
        // What the recommender sees. It cannot see substance directly — only
        // the engagement signal, which packaging drives at least as much.
        engagement: substance + config.algoPackagingWeight * packaging +
          Math.abs(rng.normal(0, 0.02))
      }
      this.active.push(post)
      agent.recentPost = post
      this.stats.posts++
    }
  }

  /** Drop posts past their shelf life and rebuild the sampling weights. */
  refresh (config, tick) {
    const cutoff = tick - config.postTtl
    if (this.active.length > 0 && this.active[0].tick < cutoff) {
      let start = 0
      while (start < this.active.length && this.active[start].tick < cutoff) start++
      this.active = this.active.slice(start)
    }
    const n = this.active.length
    this.cum = new Float64Array(n)
    let acc = 0
    for (let i = 0; i < n; i++) {
      // gamma > 1 is the amplification: a post twice as engaging gets more than
      // twice the reach
      acc += Math.pow(Math.max(this.active[i].engagement, 1e-6), config.algoGamma)
      this.cum[i] = acc
    }
    this.cumTotal = acc
  }

  /** Weighted pick over active posts, by algorithmic score. */
  sampleAlgorithmic (rng) {
    const n = this.active.length
    if (n === 0 || this.cumTotal <= 0) return null
    const target = rng.next() * this.cumTotal
    let lo = 0
    let hi = n - 1
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      if (this.cum[mid] < target) lo = mid + 1
      else hi = mid
    }
    return this.active[lo]
  }

  /**
   * Unweighted pick. This is what digging looks like: the curator goes through
   * everything, not what the ranker served. It is the only sampling path in the
   * model that is indifferent to engagement.
   */
  sampleTail (rng) {
    const n = this.active.length
    return n === 0 ? null : this.active[rng.int(n)]
  }
}

/**
 * Curation, as a distinct discovery channel.
 *
 * A curator spends `effort.curate` digging through posts the ranker did not
 * surface, and reads them deeply enough to see past the legibility gate — they
 * read the paper rather than the abstract, they run the tool. That last part is
 * why this is the only mechanism in the model that can rescue illegible work:
 * everything else can only see `output * legibility`.
 *
 * What they find, they boost, which puts it in their followers' feeds carrying
 * their judgement with it.
 */
export function runCuration (rng, agents, feed, config, tick) {
  if (feed.active.length === 0) return

  for (const curator of agents) {
    const rate = config.digRate * curator.effort.curate * (0.3 + curator.traits.taste)
    let digs = Math.floor(rate)
    if (rng.next() < rate - digs) digs++

    for (let d = 0; d < digs; d++) {
      const post = feed.sampleTail(rng)
      if (!post || post.author === curator.id) continue
      const author = agents[post.author]

      // Depth: attention and discernment recover part of what the post format
      // threw away. A perfect curator reading closely sees the real work.
      const depth = config.curationDepth * curator.traits.taste * (0.3 + curator.effort.curate * 3)
      const leg = author.traits.legibility
      const recovered = trueOutput(author) * Math.min(leg + (1 - leg) * depth, 1)

      feed.stats.digs++
      const belief = observe(rng, curator, author, 'curated', config, {
        visible: recovered,
        vetterTaste: curator.traits.taste
      })

      // The bar is relative to what this curator normally sees, not absolute.
      // An absolute threshold just re-encodes the legibility gate: quiet work
      // produces a small signal however good it is, and would never clear it.
      curator.seenMean += (belief - curator.seenMean) * 0.02
      if (belief < curator.seenMean * config.curateBarMultiple) continue

      // A curator carries a list, not a single item — capping them at one
      // find per day caps curation throughput regardless of how much they dig.
      curator.recentBoosts.push({ post, tick })
      if (curator.recentBoosts.length > config.boostQueueSize) curator.recentBoosts.shift()
      post.engagement += config.curatorBoostWeight
      feed.stats.boosts++
      if (!post.everBoosted) { post.everBoosted = true; feed.stats.rescued++ }
    }
  }
}

/**
 * One day of feed consumption. Every impression writes an `exposure` belief,
 * and engagement feeds back into follows, reshares, and the recommender's
 * ranking — which is where preferential attachment comes from.
 */
export function runFeeds (rng, agents, feed, config, tick) {
  if (feed.active.length === 0) return

  for (const viewer of agents) {
    const attention = Math.round(config.feedSize * (0.3 + viewer.traits.social * 1.4))
    // cached; rebuilt only when the follow set actually changes
    const following = viewer.followingArr

    for (let slot = 0; slot < attention; slot++) {
      let post = null
      let vetter = null
      if (rng.next() < config.algoShare || following.length === 0) {
        post = feed.sampleAlgorithmic(rng)
      } else {
        const via = agents[following[rng.int(following.length)]]
        // What this account is putting in front of you today: their own post,
        // or anything on their boost list.
        const fresh = tick - config.postTtl
        const own = via.recentPost && via.recentPost.tick >= fresh ? via.recentPost : null
        const boosts = via.recentBoosts
        const choices = own ? boosts.length + 1 : boosts.length
        if (choices > 0) {
          const pick = rng.int(choices)
          if (own && pick === boosts.length) {
            post = own
          } else {
            const entry = boosts[pick]
            if (entry && entry.post.tick >= fresh) {
              post = entry.post
              vetter = via // it reached the viewer through this person's judgement
            }
          }
        }
      }
      if (!post || post.author === viewer.id) continue

      const author = agents[post.author]
      feed.stats.impressions++
      let signal
      if (vetter && vetter.id !== author.id) {
        feed.stats.curatedImpressions++
        signal = observe(rng, viewer, author, 'curated', config, {
          visible: post.substance,
          vetterTaste: vetter.traits.taste
        })
      } else {
        signal = observe(rng, viewer, author, 'exposure', config, { visible: post.substance })
      }

      // How much this landed. Note the viewer reacts to the *perceived* value,
      // which packaging inflated — so engagement is not a quality signal, and
      // the recommender optimising on it is optimising on packaging.
      const resonance = Math.max(0, signal) / config.engageScale
      if (rng.next() > Math.min(resonance, 1)) continue

      post.engagement += config.engageWeight
      if (!viewer.following.has(author.id) && rng.next() < config.followRate) {
        follow(agents, viewer, author, config, feed)
      }
      if (rng.next() < config.reshareRate) {
        viewer.recentBoosts.push({ post, tick })
        if (viewer.recentBoosts.length > config.boostQueueSize) viewer.recentBoosts.shift()
        post.engagement += config.reshareWeight
        feed.stats.reshares++
      }
    }
  }
}

function follow (agents, viewer, author, config, feed) {
  viewer.following.add(author.id)
  author.followers.add(viewer.id)
  feed.stats.follows++

  // Attention is finite. Past the cap, drop whoever the viewer has the least
  // belief in — which quietly entrenches whoever got in early.
  if (viewer.following.size > config.maxFollowing) {
    let worst = -1
    let worstValue = Infinity
    for (const j of viewer.following) {
      const belief = viewer.beliefs.get(j)
      const v = belief ? belief.value : 0
      if (v < worstValue) { worstValue = v; worst = j }
    }
    if (worst >= 0) {
      viewer.following.delete(worst)
      agents[worst].followers.delete(viewer.id)
      feed.stats.unfollows++
    }
  }
  viewer.followingArr = [...viewer.following]
}
