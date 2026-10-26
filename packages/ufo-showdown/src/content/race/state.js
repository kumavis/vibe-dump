// What the level (index.js) and its hazards (hazards.js) share: where along
// the course the ships are, and how fast it's going.

export const lv = {
  clock: 0, // race clock: 0 at "go"
  D: 0, // distance travelled
  v: 0, // course speed
  done: false,
  rings: [],
}

// The ships' line: the course is planned so that everything reaches this
// height on time, whatever the window's size.
export const yRef = (g) => g.H - 110

// Where something `s` along the course is on screen right now.
export const yOf = (g, s) => yRef(g) - (s - lv.D)

// And the other way: how far along the course a point on screen is.
export const sAt = (g, y) => lv.D + yRef(g) - y
