// Tiny tween engine on wall-clock seconds. Tweens own their keys: when a new
// tween on the same object starts, it takes over any keys an older one was
// still driving, so interrupted moves never fight.

export const ease = {
  linear: (t) => t,
  in: (t) => t * t * t,
  out: (t) => 1 - Math.pow(1 - t, 3),
  outQuint: (t) => 1 - Math.pow(1 - t, 5),
  inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  outBack: (t) => {
    const c1 = 1.4
    const c3 = c1 + 1
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
  },
}

let active = []
let clock = 0

export function tween(target, to, dur, opts = {}) {
  return new Promise((resolve) => {
    active.push({
      target,
      to: { ...to },
      dur: Math.max(dur, 1e-4),
      ease: opts.ease ?? ease.inOut,
      t0: clock + (opts.delay ?? 0),
      from: null,
      arc: opts.arc,
      onUpdate: opts.onUpdate,
      resolve,
    })
  })
}

export const after = (sec) => tween({}, {}, sec)

export function killTweens(target) {
  active = target ? active.filter((t) => t.target !== target) : []
}

export function stepTweens(now) {
  clock = now
  for (const tw of active.slice()) {
    if (now < tw.t0) continue
    if (!tw.from) {
      for (const o of active) {
        if (o !== tw && o.from && o.target === tw.target) for (const k in tw.to) delete o.to[k]
      }
      tw.from = {}
      for (const k in tw.to) tw.from[k] = tw.target[k]
    }
    const u = Math.min(1, (now - tw.t0) / tw.dur)
    const e = tw.ease(u)
    for (const k in tw.to) {
      tw.target[k] = tw.from[k] + (tw.to[k] - tw.from[k]) * e
      if (tw.arc && tw.arc[k]) tw.target[k] += Math.sin(Math.PI * u) * tw.arc[k]
    }
    tw.onUpdate?.(u)
    if (u >= 1) {
      active.splice(active.indexOf(tw), 1)
      tw.resolve()
    }
  }
}

export function setClock(now) {
  clock = now
}
