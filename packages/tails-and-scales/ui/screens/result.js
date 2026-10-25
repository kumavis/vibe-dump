// The end screen (DESIGN §1.3): who won and why, worded from how the battle
// ended (the game.over event's `why` and the rounds played: 0 for a battle
// that ended in its deployment), Back to the war room, and (N3) Watch the
// replay. app/flow.js
// shows it as the table plays the battle's end, or, after a snap past it
// (N2's rejoin or scrub), as the table comes to rest there.
//
// (F4) The same panel asks the round limit's vote: the score so far, who
// has had their say, and Keep playing or End the battle for the seats
// played here (app/flow.js shows it while one of them is still to vote, the
// table caught up). Keep playing is held back once the battle's log is
// nearly full: the battle can only end then.
import { sfx } from '../../view/sfx.js'

const $ = (s) => document.querySelector(s)

export class ResultScreen {
  // whether it is up (the end, or the vote)
  get up() {
    return !$('#over').classList.contains('hidden')
  }
  // whether it is up asking the round limit's vote
  get voting() {
    return this.up && !$('#overVote').classList.contains('hidden')
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
    this.parts(false)
    $('#over').classList.remove('hidden')
    sfx.fanfare()
  }

  // (F4) The round limit's vote: `round` the round just scored, `vp` the
  // score, `votes` each human seat's say so far ({ seat: true | false },
  // none yet for a seat still deciding), `voters` every human seat,
  // `canMore` whether Keep playing is offered. Shown again as it stands each
  // time the HUD is (it plays no sound).
  showVote({ round, vp, votes, voters, canMore }, sides) {
    const lead = vp[0] === vp[1] ? `Level at ${vp[0]} – ${vp[1]}.` : `${sides[vp[0] > vp[1] ? 0 : 1].name} lead ${Math.max(...vp)} – ${Math.min(...vp)}.`
    const title = $('#overTitle')
    title.textContent = `Round ${round} is over`
    title.style.color = ''
    $('#overWhy').textContent = `${lead} Play another round? It takes everyone's yes.`
    const says = voters.map((s) => `${sides[s].name}: ${votes[s] === undefined ? 'deciding…' : votes[s] ? 'keep playing' : 'end it'}`)
    $('#overVotes').textContent = canMore ? says.join(' · ') : `The battle's log is nearly full: this round is the last. ${says.join(' · ')}`
    $('#keepPlaying').classList.toggle('hidden', !canMore)
    this.parts(true)
    $('#over').classList.remove('hidden')
  }

  hide() {
    $('#over').classList.add('hidden')
  }

  // the vote's parts, or the end's Back to the war room (and (N3) Watch the
  // replay)
  parts(vote) {
    $('#overVote').classList.toggle('hidden', !vote)
    $('#overVotes').classList.toggle('hidden', !vote)
    $('#again').classList.toggle('hidden', vote)
    $('#watchReplay').classList.toggle('hidden', vote)
  }

  // Back to the war room: `back()`; (F4) the vote: `vote(more)`
  // (app/flow.js); (N3) the battle watched back: `replay()` (app/boot.js)
  wire(back, vote, replay) {
    $('#again').onclick = back
    $('#watchReplay').onclick = () => {
      this.hide()
      replay()
    }
    $('#keepPlaying').onclick = () => vote(true)
    $('#endBattle').onclick = () => vote(false)
  }
}
