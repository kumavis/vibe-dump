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
    this.stats = { posts: 0, impressions: 0, follows: 0, unfollows: 0, reshares: 0 }
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
}

/**
 * One day of feed consumption. Every impression writes an `exposure` belief,
 * and engagement feeds back into follows, reshares, and the recommender's
 * ranking — which is where preferential attachment comes from.
 */
export function runFeeds (rng, agents, feed, config, tick) {
  feed.refresh(config, tick)
  if (feed.active.length === 0) return

  const boosted = []

  for (const viewer of agents) {
    const attention = Math.round(config.feedSize * (0.3 + viewer.traits.social * 1.4))
    // cached; rebuilt only when the follow set actually changes
    const following = viewer.followingArr

    for (let slot = 0; slot < attention; slot++) {
      let post = null
      if (rng.next() < config.algoShare || following.length === 0) {
        post = feed.sampleAlgorithmic(rng)
      } else {
        const author = agents[following[rng.int(following.length)]]
        const own = author.recentPost
        const boost = author.recentBoost
        post = (boost && (!own || boost.tick > own.tick)) ? boost : own
        if (post && post.tick < tick - config.postTtl) post = null
      }
      if (!post || post.author === viewer.id) continue

      const author = agents[post.author]
      feed.stats.impressions++
      const signal = observe(rng, viewer, author, 'exposure', config, undefined, post.substance)

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
        viewer.recentBoost = post
        boosted.push(post)
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
