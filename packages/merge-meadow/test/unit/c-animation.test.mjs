import test from 'node:test'
import assert from 'node:assert/strict'
import * as THREE from 'three'
import { pickClip, makeAnimator, animStats, FALLBACK } from '../../src/render/animation.js'

const clips = (...names) => names.map((name) => ({ name }))
const pick = (state, list, mapping) => { const r = pickClip(state, list, mapping); return r && [r.clip.name, r.as] }

test('explicit mapping wins, then exact name, then case-insensitive, then contains', () => {
  const L = clips('Idle', 'Walk_Cycle', 'CharacterArmature|Run', 'Bite')
  assert.deepEqual(pick('walk', L, { walk: 'Walk_Cycle' }), ['Walk_Cycle', 'walk'])
  assert.deepEqual(pick('walk', L, { walk: 'walk_cycle' }), ['Walk_Cycle', 'walk'], 'mapping is matched case-insensitively too')
  assert.deepEqual(pick('idle', L, null), ['Idle', 'idle'])
  assert.deepEqual(pick('run', L, null), ['CharacterArmature|Run', 'run'], 'contains match before the fallback')
  assert.deepEqual(pick('attack', L, { attack: 'Bite' }), ['Bite', 'attack'])
  assert.deepEqual(pick('walk', L, { walk: 'Missing' }), ['Walk_Cycle', 'walk'], 'a stale mapping falls through to names')
})

test('fallback chain: run > walk > idle, attack > idle, sit > idle; no die clip halts', () => {
  assert.deepEqual(FALLBACK.run, ['walk', 'idle'])
  assert.deepEqual(pick('run', clips('idle', 'walk'), null), ['walk', 'walk'])
  assert.deepEqual(pick('run', clips('idle'), null), ['idle', 'idle'])
  assert.deepEqual(pick('attack', clips('idle', 'walk'), null), ['idle', 'idle'])
  assert.deepEqual(pick('sit', clips('Idle'), null), ['Idle', 'idle'])
  assert.equal(pickClip('die', clips('idle', 'walk'), null), null)
  assert.deepEqual(pick('die', clips('idle', 'Death'), { die: 'Death' }), ['Death', 'die'])
  assert.deepEqual(pick('fly', clips('Hover', 'idle'), null), ['idle', 'idle'], 'unknown states fall back to idle')
  assert.deepEqual(pick('walk', clips('Armature'), null), ['Armature', 'idle'], 'nothing matches: first clip as idle')
  assert.equal(pickClip('idle', [], null), null)
})

function rigWithClips () {
  const root = new THREE.Group(); const bone = new THREE.Bone(); bone.name = 'hips'; root.add(bone)
  const clip = (name) => new THREE.AnimationClip(name, 1, [new THREE.VectorKeyframeTrack('hips.position', [0, 1], [0, 0, 0, 0, 1, 0])])
  return { root, bone, clips: [clip('idle'), clip('walk')] }
}

test('animator: fallback plays walk for run, die without a clip halts, dispose balances', () => {
  const live0 = animStats.live
  const { root, clips: cs } = rigWithClips()
  const a = makeAnimator(root, cs)
  assert.equal(animStats.live, live0 + 1)
  a.set('run'); a.update(0.1)
  assert.equal(a.clipName, 'walk')
  const act = a.action
  a.set('walk'); assert.equal(a.action, act, 'same clip: no restart')
  a.set('die', { fade: 0 }); a.update(0.5)
  assert.equal(a.clipName, 'walk', 'no die clip: the current action is halted, not swapped')
  a.set('idle'); a.update(0.1)
  assert.equal(a.clipName, 'idle')
  assert.ok(a.action.isRunning())
  a.dispose(); a.dispose()
  assert.equal(animStats.live, live0)
})
