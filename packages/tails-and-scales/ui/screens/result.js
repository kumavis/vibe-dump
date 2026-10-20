// The end screen (DESIGN §1.3): who won and why, worded from how the battle
// ended (the game.over event's `why` and the rounds played: 0 for a battle
// that ended in its deployment), and Back to the war room. app/flow.js
// shows it as the table plays the battle's end, or, after a snap past it
// (N2's rejoin or scrub), as the table comes to rest there.
import { sfx } from '../../view/sfx.js'

const $ = (s) => document.querySelector(s)

export class ResultScreen {
  // whether it is up
  get up() {
    return !$('#over').classList.contains('hidden')
  }

  // `sides`: each seat's look (ui/theme.js); `ink`: the winner's colour in a
  // mirror match ('' for the stylesheet's)
  show({ win, why, vp, rounds }, sides, ink) {
    const t = win < 0 ? 'A bloody draw' : `${sides[win].name} win!`
    const when = rounds ? `in round ${rounds}` : 'in the deployment'
    const line = why === 'wipe' ? `${sides[1 - win].name} have been wiped from the table ${when}.`
      : why === 'concede' ? `${sides[1 - win].name} conceded ${when}.`
      : `Final score ${vp[0]} – ${vp[1]} after ${rounds} round${rounds === 1 ? '' : 's'}.`
    const title = $('#overTitle')
    title.textContent = `${win >= 0 ? sides[win].icon + ' ' : ''}${t}`
    title.style.color = ink
    $('#overWhy').textContent = line
    $('#over').classList.remove('hidden')
    sfx.fanfare()
  }

  hide() {
    $('#over').classList.add('hidden')
  }

  // Back to the war room: `back()` (app/flow.js)
  wire(back) {
    $('#again').onclick = back
  }
}
