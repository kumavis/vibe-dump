// The entry chapters 7 and 8 both look at: a left string u, a right string v,
// and the set Q of inner levels, which together pick one entry w of one
// product X_Q Y_Q. Each level keeps an outer choice (x_i, y_j) and an inner
// choice (p, q), and Q decides which one the string shows there. It starts
// at Figure 4 of the paper.

export const L = 6
export const M = 2

export const shared = {
  Q: [1, 4], // levels 2 and 5, in the order they were chosen
  uX: [0, 0, 1, 2, 0, 0], // x1 · x2 x3 · x1
  uP: [0, 0, 0, 0, 3, 0], // · p11 · · p22 ·
  vY: [2, 0, 0, 2, 0, 1], // y3 · y1 y3 · y2
  vQ: [0, 0, 0, 0, 3, 0], // · q11 · · q22 ·
}

const subs = new Set()
export function onShared(fn) {
  subs.add(fn)
}
export function setShared(patch, from) {
  Object.assign(shared, patch)
  subs.forEach((fn) => fn(shared, from))
}

export const inQ = (l, s = shared) => s.Q.includes(l)
export const sortedQ = (s = shared) => s.Q.slice().sort((a, b) => a - b)

// Per-level digits of u and v (base 7: x1 x2 x3 p11 p12 p21 p22) and of the
// output w (base 10: z11 … z33 z0).
export function strings(s = shared) {
  const u = []
  const v = []
  const w = []
  for (let l = 0; l < L; l++) {
    if (inQ(l, s)) {
      u.push(3 + s.uP[l])
      v.push(3 + s.vQ[l])
      w.push(9)
    } else {
      u.push(s.uX[l])
      v.push(s.vY[l])
      w.push(3 * s.uX[l] + s.vY[l])
    }
  }
  return { u, v, w }
}

// Where u, v and w sit in X_Q, Y_Q and X_Q Y_Q (0-based).
export function positions(s = shared) {
  let uRow = 0
  let uCol = 0
  let vRow = 0
  let vCol = 0
  for (let l = 0; l < L; l++) {
    if (inQ(l, s)) {
      uCol = uCol * 4 + s.uP[l]
      vRow = vRow * 4 + s.vQ[l]
    } else {
      uRow = uRow * 3 + s.uX[l]
      vCol = vCol * 3 + s.vY[l]
    }
  }
  return { uRow, uCol, vRow, vCol, wRow: uRow, wCol: vCol }
}

// Point the shared state at output string w (digits), keeping inner choices.
export function fromOutput(wDigits) {
  const Q = []
  const uX = shared.uX.slice()
  const vY = shared.vY.slice()
  wDigits.forEach((d, l) => {
    if (d === 9) Q.push(l)
    else {
      uX[l] = Math.floor(d / 3)
      vY[l] = d % 3
    }
  })
  return { Q, uX, vY }
}

export const LEFT_NAMES = ['x1', 'x2', 'x3', 'p11', 'p12', 'p21', 'p22']
export const RIGHT_NAMES = ['y1', 'y2', 'y3', 'q11', 'q12', 'q21', 'q22']
export const OUT_NAMES = ['z11', 'z12', 'z13', 'z21', 'z22', 'z23', 'z31', 'z32', 'z33', 'z0']
export const TERM_NAMES = ['P11', 'P12', 'P13', 'P21', 'P22', 'P23', 'P31', 'P32', 'P33', 'P0']
