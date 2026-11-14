# Mushroom Solitaire

A cozy, responsive, draw-one Klondike game using Lani’s original hand-drawn cards.
The supplied sheets were sliced into individual cards, preserving the artwork.

Run `npm run dev -w @vibe-dump/mushroom-solitaire` from the repository root.
Run `npm test -w @vibe-dump/mushroom-solitaire` for the rules tests.
After building, run `npm run test:browser -w @vibe-dump/mushroom-solitaire`
for WebKit and Chromium tests with iPad touch emulation. Install the matching
test browsers with `npx playwright install chromium webkit` if needed. These
cover real touch taps, explicit double taps, pointer drags, cancellation,
extra fingers, edge scrolling, orientation changes, saves, and keyboard play.
Chromium additionally exercises a native touch drag through CDP; WebKit drag
sequences use dispatched pointer events. Physical iPad testing is still useful.

Tap a face-up card and its destination, or drag a card or stack. Double-click a
top card to send it to its foundation. Gather collects available foundation
cards in a single undoable batch. Undo, hints, same-deal restarts, optional
synthesized sounds, keyboard controls, a victory celebration, and local saved
progress are included. No account or server is needed to play.

iPad and other touch browsers support tap-to-select/tap-to-move, explicit
double-tap gathering, and dragging individual cards or full stacks. The game
captures the active pointer, ignores extra fingers, highlights legal drops,
and scrolls near the screen edges while dragging. Cancelling a gesture or
rotating the tablet clears the drag without changing the game. Touch layouts
use 44px controls and exposed card strips; scrolling remains available between
cards and around the board, and browser pinch zoom remains enabled.

The light suits are Sand and Lemon. The dark suits are Scarlet and Chestnut.
Tableau columns descend while alternating these families. Each foundation
ascends in its own mushroom suit from Ace to King. Empty columns require Kings.
The stock draws one card with unlimited recycling.

All card assets and fonts are bundled locally. Fonts use the same OFL-licensed
Fraunces and Inter assets included elsewhere in this repository.
