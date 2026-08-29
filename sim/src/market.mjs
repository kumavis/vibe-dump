// The RAIN/USD venue: a constant-product AMM.
//
// An order book would be more precise and less true. A small token trades
// against a shallow pool, and the thing that matters for this model is that a
// forced seller in a thin pool eats their own price move. Constant product
// makes that visible and makes depth an explicit parameter.

export class Pool {
  /**
   * @param feeBps  liquidity fee — stays in the pool as depth
   * @param burnBps EIP-1559-style base fee on the RAIN leg of every transaction.
   *                Burned, not paid to anyone: it leaves total supply. This is
   *                the paper's optional deflationary lever, and it is the one
   *                knob that can offset issuance without touching allocation.
   */
  constructor (usd, rain, feeBps = 30, burnBps = 0) {
    this.usd = usd
    this.rain = rain
    this.feeBps = feeBps
    this.burnBps = burnBps
    this.volumeUsd = 0
    this.buyUsd = 0
    this.sellUsd = 0
    this.burnedTotal = 0
    this.burnedPending = 0 // model drains this into the supply figure each tick
  }

  get price () { return this.usd / this.rain }

  burn (amount) {
    if (amount <= 0) return 0
    this.burnedTotal += amount
    this.burnedPending += amount
    return amount
  }

  /** Spend `usdIn`, receive RAIN. Returns { rainOut, price, slippage, burned }. */
  buy (usdIn) {
    if (usdIn <= 0) return { rainOut: 0, price: this.price, slippage: 0, burned: 0 }
    const spot = this.price
    const net = usdIn * (1 - this.feeBps / 10000)
    const k = this.usd * this.rain
    const newUsd = this.usd + net
    const gross = this.rain - k / newUsd
    this.usd += usdIn // fee stays in the pool as depth
    this.rain -= gross
    // base fee is taken out of the RAIN the buyer receives and destroyed
    const burned = this.burn(gross * (this.burnBps / 10000))
    const rainOut = gross - burned
    this.volumeUsd += usdIn
    this.buyUsd += usdIn
    const effective = usdIn / Math.max(rainOut, 1e-12)
    return { rainOut, price: effective, slippage: (effective - spot) / spot, burned }
  }

  /** Sell `rainIn`, receive USD. Returns { usdOut, price, slippage, burned }. */
  sell (rainIn) {
    if (rainIn <= 0) return { usdOut: 0, price: this.price, slippage: 0, burned: 0 }
    const spot = this.price
    // base fee is destroyed before the rest reaches the pool
    const burned = this.burn(rainIn * (this.burnBps / 10000))
    const arriving = rainIn - burned
    const net = arriving * (1 - this.feeBps / 10000)
    const k = this.usd * this.rain
    const newRain = this.rain + net
    const usdOut = this.usd - k / newRain
    this.rain += arriving
    this.usd -= usdOut
    this.volumeUsd += usdOut
    this.sellUsd += usdOut
    const effective = usdOut / rainIn
    return { usdOut, price: effective, slippage: (effective - spot) / spot, burned }
  }

  /** RAIN needed to realise approximately `usdWanted`, capped at `available`. */
  rainForUsd (usdWanted, available) {
    if (usdWanted <= 0) return 0
    const k = this.usd * this.rain
    const targetUsd = Math.max(this.usd - usdWanted, 1e-9)
    const needed = k / targetUsd - this.rain
    const grossed = needed / (1 - this.feeBps / 10000)
    return Math.min(Math.max(grossed, 0), available)
  }

  resetFlow () { this.buyUsd = 0; this.sellUsd = 0; this.volumeUsd = 0 }
}

/**
 * A single aggregate momentum trader. Real markets have many; one is enough to
 * supply liquidity on both sides and to make the price path look like a price
 * path rather than a ramp.
 */
export class Speculator {
  constructor (usd, config) {
    this.usd = usd
    this.rain = 0
    this.config = config
    this.history = []
  }

  step (pool) {
    this.history.push(pool.price)
    if (this.history.length > 120) this.history.shift()
    if (this.history.length < 31) return { bought: 0, sold: 0 }

    const now = pool.price
    const then = this.history[this.history.length - 31]
    const momentum = (now - then) / then

    let bought = 0
    let sold = 0
    if (momentum > this.config.specThreshold && this.usd > 1) {
      const spend = this.usd * this.config.specAggression
      const { rainOut } = pool.buy(spend)
      this.usd -= spend
      this.rain += rainOut
      bought = spend
    } else if (momentum < -this.config.specThreshold && this.rain > 1) {
      const amount = this.rain * this.config.specAggression
      const { usdOut } = pool.sell(amount)
      this.rain -= amount
      this.usd += usdOut
      sold = usdOut
    }
    return { bought, sold }
  }
}
