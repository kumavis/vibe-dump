// Tails & Scales — a pocket-sized tabletop wargame. The page boots in
// app/boot.js: the view (view/), the UI (ui/), the local human (input/) and
// the flow from the title screen to a battle and back (app/flow.js), over
// the core (core/), which plays every battle through a Session
// (match/session.js). DESIGN.md §1.1 has the whole tree.
import { boot } from './app/boot.js'

boot(location)
