/* Vale 0.9.5 · held objects and later hand actions.
 * Original text, branches, grants, step paths and existing motion IDs stay
 * intact. Native actor poses share their original floor and conversation
 * frame. These are two-pose cues, not simulated hand actions made by sliding
 * an entire cutout. The derived art is registered statically before boot.
 */
(() => {
  'use strict';
  const E = StoryEngine, V = ValeDemo;
  const enabled = () => /^vale-dossiers(?:-|$)/.test(E.S()?.id || '');
  const at = (S, root, node, path) => path.reduce((v, k) => v?.[k], S[root]?.[node]);
  const added = new Map(), refined = new Map();
  const textIs = (st, text) => st?.n?.en === text;

  function heldArt(st, who, art) {
    if (!st) return;
    // Direction profiles are shared by neighboring steps. Clone before
    // overriding a held object, otherwise it leaks into another scene.
    const direction = st.valeDirection;
    if (direction) st.valeDirection = { ...direction, fullArt: { ...direction.fullArt, [who]: art } };
    st.valeActionReading = true;
  }
  function cue(S, root, node, path, text, motion, owner = null) {
    const st = at(S, root, node, path);
    if (!textIs(st, text)) return null;
    // A missing owner can be normal before the later layout hook runs. The
    // queued install will see it. Never take over an unknown authored cue.
    if (owner ? st.motion?.id !== owner : st.motion && st.motion.id !== motion.id) return null;
    st.motion = motion;
    st.valeActionReading = true;
    (owner ? refined : added).set(motion.id, { root, node, path: [...path], id: motion.id });
    return st;
  }
  function walkLines(value, fn) {
    if (!value || typeof value !== 'object') return;
    if (value.n || value.say || value.think || value.choice) fn(value);
    for (const [key, child] of Object.entries(value)) {
      if (['motion', 'valeDirection', 'valePresence'].includes(key)) continue;
      if (child && typeof child === 'object') walkLines(child, fn);
    }
  }

  function install() {
    if (!enabled()) return;
    const S = E.S();
    if (S.id === 'vale-dossiers-part2-v01') {
      const night = cue(S, 'nodes', 'p2c5_close', [2, 'else', 0],
        'Reed dates each page and puts it away, leaving the missing observation blank. Tomorrow, you must decide what the file can honestly say.', {
          id: 'p2-v094-night-record-dated-and-put-away', ms: 2400,
          sounds: [{ at: .12, cue: 'pen_write' }],
          actors: [{ id: 'reed', show: true, frames: [
            { offset: 0, face: 'writing-v091' },
            { offset: .64, face: 'writing-v091' },
            { offset: .82, face: 'offer-notebook-v091' },
            { offset: 1, face: 'offer-notebook-v091' }
          ] }]
        }, 'p2-v094-night-record-dated-and-put-away');
      heldArt(night, 'reed', 'reed-offer-notebook-v091');
      const check = at(S, 'nodes', 'p2c5_close', [3]);
      if (night && textIs(check, 'Before closing the notebook, you check on everyone. Lydia is safe, Ruth beside her. You call Reed; she answers. For tonight, that matters as much as the evidence.')) {
        // The wording does not specify a bag or establish whose notebook the
        // next sentence refers to. Retain the visible open-record endpoint;
        // do not invent a stow, add a fold sound, or close it before this line.
        heldArt(check, 'reed', 'reed-offer-notebook-v091');
      }
    }
    if (S.id !== 'vale-dossiers-part3-v01') return;
    for (const [who, anchors] of Object.entries({
      nora: { 'nora-brush-contact-v095': 1502, 'nora-brush-paused-v095': 1505 },
      ben: { 'ben-report-open-v095': 1466, 'ben-report-folded-v095': 1466 }
    })) if (S.chars[who]) S.chars[who].bodyFeet = { ...S.chars[who].bodyFeet, ...anchors };

    const hello = cue(S, 'talks', 'p3c3_nora', ['hello', 0],
      'Nora is brushing dried mud from her bag. She stops when you ask about Sunday night, but leaves the brush in her hand.', {
        id: 'p3-v095-nora-brush-pause', ms: 2300,
        actors: [{ id: 'nora', show: true, frames: [
          { offset: 0, face: 'brush-contact-v095' },
          { offset: .52, face: 'brush-contact-v095' },
          { offset: .74, face: 'brush-paused-v095' },
          { offset: 1, face: 'brush-paused-v095' }
        ] }]
      });
    if (hello) {
      const talk = S.talks.p3c3_nora;
      for (const value of [talk.hello, talk.topics]) walkLines(value, st => {
        heldArt(st, 'nora', 'nora-brush-paused-v095');
        // The old concerned portrait has no brush. Keep the hand/object state
        // through the actual conversation instead of swapping it away.
        if (st.say === 'nora') st.face = 'brush-paused-v095';
      });
      const bye = talk.bye?.[0];
      if (textIs(bye, 'She puts the brush away. Its little cloud of dust hangs in the light after her hand has stopped.')) {
        heldArt(bye, 'nora', 'nora-full');
        bye.valePresence = { ...bye.valePresence, show: [
          ...(bye.valePresence?.show || []).filter(a => a.id !== 'nora'),
          { id: 'nora', face: '' }
        ] };
        // This is the correct brush-free endpoint. No claim is made that the
        // two brush poses animate a full stow or the lingering dust cloud.
      }
    }

    const receive = cue(S, 'nodes', 'p3c3_open', [30],
      'Outside, Ben is cleaning the unused bridle. You hand him the corrected copy. He reads the sentence about the supper twice, lips moving on the second reading.', {
        id: 'p3-v06-corrected-report', ms: 1500,
        actors: [{ id: 'elin', hide: true }, { id: 'reed', hide: true },
          { id: 'ben', show: true, at: 'c', frames: [
            { offset: 0, face: 'report-open-v095' },
            { offset: 1, face: 'report-open-v095' }
          ] }]
      }, 'p3-v06-corrected-report');
    if (receive) {
      // The existing layout owns the explicit return outside. Keep its scene
      // and cast transition; do not introduce a shot or a second camera move.
      for (const index of [30, 31, 32]) heldArt(at(S, 'nodes', 'p3c3_open', [index]), 'ben', 'ben-report-open-v095');
      const ask = at(S, 'nodes', 'p3c3_open', [31]);
      if (ask?.say === 'ben') ask.face = 'report-open-v095';
    }
    const fold = cue(S, 'nodes', 'p3c3_open', [33],
      'Ben folds the paper, careful not to get grease on it. Behind him, the stall is still empty. One false accusation has gone.', {
        id: 'vale08-p3c3_open-33', ms: 2200,
        sounds: [{ at: .64, cue: 'paper_fold' }],
        actors: [{ id: 'ben', show: true, frames: [
          { offset: 0, face: 'report-open-v095' },
          { offset: .5, face: 'report-open-v095' },
          { offset: .76, face: 'report-folded-v095' },
          { offset: 1, face: 'report-folded-v095' }
        ] }]
      }, 'vale08-p3c3_open-33');
    heldArt(fold, 'ben', 'ben-report-folded-v095');
  }

  // Some part layouts are registered after the common plugins. The queued
  // pass therefore applies to the final composed data, including lazy loads.
  E.on('boot', () => { install(); queueMicrotask(install); });
  E.on('chapter', () => { install(); queueMicrotask(install); });
  V.v095Actions = () => ({ enabled: enabled(), cues: [...added.values()], refined: [...refined.values()] });
})();
