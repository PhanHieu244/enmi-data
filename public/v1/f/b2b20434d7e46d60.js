/* Vale 0.9.1 — specific, witnessed actions in Parts II and III.
 * Presentation metadata only: no prose, choices, grants, arrays or save paths
 * change. A writing/tea pose illustrates the action; it is not a hand rig.
 * Existing location plates and original object art remain the source of truth.
 */
(() => {
  'use strict';
  const E = StoryEngine;
  const enabled = () => /^vale-dossiers-part[23]-v01$/.test(E.S()?.id || '');
  const at = (S, node, path) => path.reduce((v, k) => v?.[k], S.nodes?.[node]);
  const patch = (S, node, path, values) => {
    const st = at(S, node, path); if (st) Object.assign(st, values);
  };
  const reedProp = 'v091-reed-action23';
  const actionProps = [reedProp, ...['rusk', 'lydia', 'ruth', 'owen'].map(id => 'v091-stage-' + id), 'v091-ben-ember'];
  const remove = ids => {
    const R = E.R();
    for (const id of ids || []) {
      if (!id.startsWith('v091-')) continue;
      if (R.props) delete R.props[id];
      for (const el of document.querySelectorAll('.prp')) if (el.dataset.p === id) el.remove();
    }
  };
  E.side('valeActions23', async value => { if (enabled() && value) remove(value.remove); });

  const holdPose = (id, art, place, ms = 850) => ({
    id, ms,
    tracks: [{ id: reedProp, art, ...place, z: 4,
      frames: [{ offset: 0, opacity: 0 }, { offset: .3, opacity: 1 }, { offset: 1, opacity: 1 }] }]
  });
  const returnFromAction = (S, node, path, values = {}) => patch(S, node, path, {
    shot: null, look: null, actionFrame: null,
    valeActions23: { remove: actionProps }, ...values
  });
  const placeSpeaker = (S, place, view, zone, index, who, position = 'l') => {
    const st = S.places?.[place]?.views?.[view]?.zones?.[zone]?.then?.[index];
    if (st?.say !== who) return;
    // place() deliberately clears R.cast. These authored companion replies
    // need staging of their own; a name in narration does not grant presence.
    st.valePresence = { ...(st.valePresence || {}), show: [{ id: who, at: position }] };
    st.look = null; st.actionFrame = null;
  };

  // These bounds protect Reed's face, both hands and the actual notebook.
  // The neutral object insert uses the closed-case source, never the blade.
  E.regions({
    'evidence-p3_case_closed': { size: [1280, 1280], r: {
      v091_case_clasp: [36, 49, 23, 20], v091_closed_case: [0, 28, 100, 55]
    } },
    p3_stable: { r: {
      v091_empty_stall: [40, 27, 35, 25], v091_stall_context: [27, 16, 67, 49]
    } }
  });

  function writer(S, node, index, scene, id) {
    patch(S, node, Array.isArray(index) ? index : [index], {
      shot: scene, look: [48, 35, 20, 13], on: 'reed',
      actionFrame: { focus: [48, 35, 20, 13], context: [28, 15, 43, 33], zoom: 1.3 },
      motion: holdPose(id, 'reed-writing-v091', { at: [46, 54], w: 80, ar: 2 / 3 })
    });
  }

  // Blocking uses a whole original cutout. It depicts an entrance/exit, not
  // invented arm joints, a reversed walk cycle, or a new character costume.
  function blocking(S, node, path, scene, id, people, options = {}) {
    const st = at(S, node, path); if (!st) return;
    if (options.relocate) { delete st.shot; st.scene = scene; }
    else { delete st.scene; st.shot = scene; }
    const hide = [...new Set([...(options.hide || []), ...people.filter(p => p.exit).map(p => p.who)])];
    Object.assign(st, {
      look: options.focus || [30, 23, 43, 31],
      actionFrame: { focus: options.focus || [30, 23, 43, 31], context: options.context || [4, 17, 92, 43], zoom: 1.3 },
      motion: { id, ms: options.ms || 1600,
        actors: hide.map(id => ({ id, hide: true })),
        tracks: people.map(p => ({ id: 'v091-stage-' + p.who, art: p.art || p.who + '-full', at: p.from, w: p.w || 70, ar: 2 / 3, z: p.z || 4,
          frames: [{ offset: 0, at: p.from, opacity: p.exit || p.stay ? 1 : 0 },
            { offset: .18, opacity: 1 }, { offset: .82, at: p.to || p.from, opacity: 1 },
            { offset: 1, at: p.to || p.from, opacity: p.exit ? 0 : 1 }], ...(p.exit ? { remove: true } : {}) })) }
    });
  }

  function expanded(S) {
    if (S.id === 'vale-dossiers-part2-v01') {
      blocking(S, 'p2c3_open', [4], 'p2_corridor', 'p2-v091-rusk-blocks-door',
        [{ who: 'rusk', from: [99, 53], to: [78, 53], w: 64 }],
        { focus: [65, 24, 30, 32], context: [48, 19, 52, 44] });
      returnFromAction(S, 'p2c3_open', [5]);
      blocking(S, 'p2c3_open', [35], 'p2_corridor', 'p2-v091-lydia-waits-with-ruth',
        [{ who: 'lydia', from: [57, 54], to: [-24, 54], exit: true }]);
      returnFromAction(S, 'p2c3_open', [36]);

      // The drawing remains a record. Nothing reaches into or changes the vent.
      writer(S, 'p2c4_open', [12, 'explore', 'spots', 1, 'then', 2], 'p2_room', 'p2-v091-mark-both-vent-ends');
      returnFromAction(S, 'p2c4_open', [12, 'explore', 'spots', 1, 'then', 3]);
      blocking(S, 'p2c4_open', [28], 'p2_corridor', 'p2-v091-hale-joins-sketch',
        [{ who: 'owen', from: [8, 54], to: [50, 54] }]);
      returnFromAction(S, 'p2c4_open', [29]);
      writer(S, 'p2c4_open', [33, 'choice', 1, 'then', 1], 'p2_corridor', 'p2-v091-preserve-pencil-correction');
      returnFromAction(S, 'p2c4_open', [34]);
      blocking(S, 'p2c4_open', [37], 'p2_room', 'p2-v091-lydia-returns-to-plan',
        [{ who: 'lydia', art: 'lydia-resolute', from: [110, 54], to: [63, 54] }]);
      returnFromAction(S, 'p2c4_open', [38], { valePresence: { show: [{ id: 'lydia', at: 'r', face: 'resolute' }] } });
      blocking(S, 'p2c4_open', [40], 'p2_room', 'p2-v091-lydia-ruth-leave-room',
        [{ who: 'ruth', from: [66, 56], to: [130, 56], w: 58, exit: true },
          { who: 'lydia', art: 'lydia-calm', from: [40, 56], to: [117, 56], w: 58, exit: true }]);
      returnFromAction(S, 'p2c4_open', [41]);

      blocking(S, 'p2c5_withdraw', [6], 'p2_house_evening', 'p2-v091-witnesses-leave-safely',
        [{ who: 'ruth', from: [41, 56], to: [-30, 58], w: 58, exit: true },
          { who: 'lydia', art: 'lydia-resolute', from: [65, 56], to: [-12, 58], w: 58, exit: true }]);
      returnFromAction(S, 'p2c5_withdraw', [7]);
      blocking(S, 'p2c5_intervene', [5], 'p2_house_evening', 'p2-v091-rusk-returns-to-witnesses',
        [{ who: 'rusk', from: [108, 54], to: [65, 54] }]);
      returnFromAction(S, 'p2c5_intervene', [6]);
      blocking(S, 'p2c5_intervene', [13], 'p2_house_evening', 'p2-v091-lydia-leaves-front-door',
        [{ who: 'lydia', art: 'lydia-resolute', from: [65, 54], to: [-24, 58], exit: true }]);
      returnFromAction(S, 'p2c5_intervene', [14]);

      // The original full-Reed master is the closed-notebook endpoint. No
      // loose medical sheet or handwriting is fabricated over the source art.
      patch(S, 'p2c6_overreach', [4], {
        shot: 'p2_house_dawn', look: [47, 35, 24, 15],
        actionFrame: { focus: [47, 35, 24, 15], context: [28, 15, 43, 34], zoom: 1.3 },
        motion: { id: 'p2-v091-notebook-closed-on-overreach', ms: 1350, actors: [{ id: 'lydia', hide: true }, { id: 'ruth', hide: true }],
          tracks: [{ id: reedProp, art: 'reed-offer-notebook-v091', at: [46, 54], w: 80, ar: 2 / 3, z: 4,
            frames: [{ offset: 0 }, { offset: .55, art: 'reed-full' }, { offset: 1, art: 'reed-full' }] }] }
      });
      returnFromAction(S, 'p2c6_overreach', [5]);
      // The corridor relocation was already authored in the v0.6 layout. Keep
      // it as a real scene while Lydia passes Rusk, then leaves the frame.
      blocking(S, 'p2c6_intervention', [3], 'p2_corridor_dawn', 'p2-v091-lydia-passes-study',
        [{ who: 'rusk', from: [84, 53], w: 56, stay: true, z: 3 },
          { who: 'lydia', art: 'lydia-calm', from: [59, 55], to: [-25, 55], exit: true }],
        { relocate: true, hide: ['reed', 'lydia', 'ruth', 'rusk'], focus: [51, 26, 40, 30], context: [4, 18, 94, 43] });
      returnFromAction(S, 'p2c6_intervention', [4]);
      patch(S, 'p2c6_intervention', [6], { on: 'reed', valePresence: { show: [{ id: 'reed', at: 'l' }] } });
    } else {
      writer(S, 'p3c2_open', 31, 'p3_moor', 'p3-v091-shepherd-question-in-margin');
      returnFromAction(S, 'p3c2_open', [32]);
      writer(S, 'p3c4_open', [8, 'explore', 'spots', 1, 'then', 1], 'p3_office', 'p3-v091-handwriting-comparison-notes');
      returnFromAction(S, 'p3c4_open', [8, 'explore', 'spots', 1, 'then', 2]);
      writer(S, 'p3c5_supported', [0, 'then', 1], 'p3_dorn_open', 'p3-v091-date-the-public-correction');
      returnFromAction(S, 'p3c5_supported', [1], { valePresence: { show: [{ id: 'reed', at: 'l' }] } });

      const recovery = at(S, 'p3c5_recovery_route', [5]);
      if (recovery) {
        delete recovery.scene;
        Object.assign(recovery, { shot: 'p3_stable', look: [12, 46, 30, 31],
          actionFrame: { focus: [12, 46, 30, 31], context: [12, 28, 76, 51], zoom: 1.25 },
          motion: { id: 'p3-v091-stall-open-horse-home', ms: 1800,
            backdrop: { frames: [{ offset: 0, art: 'p3_stable' }, { offset: .5, art: 'p3_stable_return' }, { offset: 1, art: 'p3_stable_return' }] } } });
      }
      // The horse remains in the opened stall after this action. Returning to
      // the old empty-stall plate here would undo the physical outcome.
      for (const branch of ['then', 'else']) {
        const next = at(S, 'p3c5_recovery_route', [6, branch, 0]);
        if (next) { delete next.shot; Object.assign(next, { scene: 'p3_stable_return', look: null, actionFrame: null, valeActions23: { remove: actionProps } }); }
      }
      // One derived composite owns the lead rope and both silhouettes. Replace
      // the older solitary-horse prop, including when resuming a v0.9 save.
      patch(S, 'p3c5_late_route', [6], {
        shot: 'p3_finish', clearProps: true, look: [47, 38, 45, 28],
        actionFrame: { focus: [47, 38, 45, 28], context: [5, 31, 95, 42], zoom: 1.25 },
        motion: { id: 'p3-v091-ben-leads-ember-past-course', ms: 1900,
          actors: [{ id: 'ben', hide: true }],
          tracks: [{ id: 'v091-ben-ember', art: 'p3_ben_leading_ember_v091', at: [47, 55], w: 90, ar: 1.5, z: 4,
            frames: [{ offset: 0, at: [43, 55], opacity: 0 }, { offset: .15, opacity: 1 }, { offset: 1, at: [55, 55], opacity: 1 }] }] }
      });
      returnFromAction(S, 'p3c5_late_route', [7]);
    }
  }

  function install() {
    if (!enabled()) return;
    const S = E.S();
    if (S.id === 'vale-dossiers-part2-v01') {
      placeSpeaker(S, 'p2c2_house', 'yard', 0, 1, 'reed');
      placeSpeaker(S, 'p2c2_house', 'corridor', 0, 1, 'lydia', 'r');
      placeSpeaker(S, 'p2c2_house', 'room', 1, 0, 'lydia', 'r');
      // Tea is in her hands on the narrated beat, not first revealed later.
      patch(S, 'p2c1_open', [28], {
        shot: 'study', look: [48, 58, 30, 17], on: 'reed',
        actionFrame: { focus: [48, 58, 30, 17], context: [14, 25, 72, 60], zoom: 1.3 },
        motion: holdPose('p2-v091-reed-brings-tea', 'reed-tea', { at: [50, 54], w: 72, ar: 2 / 3 })
      });
      returnFromAction(S, 'p2c1_open', [29]);
      writer(S, 'p2c5_observe', 9, 'p2_corridor_night', 'p2-v091-separate-witness-notes');
      // The next step only sets existing story flags; cleanup is a side effect,
      // so the subsequent branch enters with its own original scene/cast.
      returnFromAction(S, 'p2c5_observe', [10]);
    } else {
      placeSpeaker(S, 'p3c2_ground', 'path', 0, 1, 'reed');
      placeSpeaker(S, 'p3c2_ground', 'hollow', 1, 1, 'reed');
      placeSpeaker(S, 'p3c3_yard_walk', 'yard', 0, 1, 'ben', 'r');
      placeSpeaker(S, 'p3c3_yard_walk', 'stall', 0, 1, 'reed');
      // Later dog replies already have Ben in the original Ben+Moss action
      // composite. Do not place a second native Ben over that same person.
      // The boy has no canonical sprite. Show the stall he reacts to, using
      // its exact original pixels; do not invent a substitute child/gesture.
      patch(S, 'p3c1_open', [12], {
        shot: 'p3_stable', look: 'v091_empty_stall',
        actionFrame: { focus: 'v091_empty_stall', context: 'v091_stall_context', zoom: 1.25 }
      });
      returnFromAction(S, 'p3c1_open', [13]);
      writer(S, 'p3c1_open', 24, 'p3_yard', 'p3-v091-two-investigation-headings');
      returnFromAction(S, 'p3c1_open', [25]);
      writer(S, 'p3c2_open', 10, 'p3_moor', 'p3-v091-record-the-crossing');
      returnFromAction(S, 'p3c2_open', [11]);

      // Keep the existing sleeping dog at its authored world coordinates.
      // Both the bowl and the sleeping dog belong to this opening narration.
      patch(S, 'p3c3_open', [4], {
        shot: 'p3_yard_morning_clean', look: [27, 53, 34, 17],
        actionFrame: { focus: [27, 53, 34, 17], context: [0, 32, 67, 48], zoom: 1.3 },
        motion: {
          id: 'p3-v091-reed-tea-and-sleeping-moss', ms: 850,
          tracks: [
            { id: 'moss', art: 'p3_moss_sleep', at: [50.7, 57.2], w: 20, ar: 2, z: 3,
              frames: [{ offset: 0 }, { offset: 1 }] },
            { id: reedProp, art: 'reed-tea', at: [24, 56], w: 48, ar: 2 / 3, z: 4,
              frames: [{ offset: 0, opacity: 0 }, { offset: .3, opacity: 1 }, { offset: 1 }] }
          ]
        }
      });
      returnFromAction(S, 'p3c3_open', [5], { face: 'tea' });

      // An explicit evidence insert keeps the instrument inside its case.
      // It does not claim to animate Nora's eyes or reveal an unreadable label.
      patch(S, 'p3c4_open', [12], {
        shot: 'evidence-p3_case_closed', look: 'v091_case_clasp',
        actionFrame: { focus: 'v091_case_clasp', context: 'v091_closed_case', zoom: 1.15 }
      });
      returnFromAction(S, 'p3c4_open', [13]);
    }
    expanded(S);
  }

  // Part-specific layouts register later. The second application runs after
  // those overlays without depending on prose or changing authored paths.
  E.on('boot', () => { install(); queueMicrotask(install); });
  E.on('chapter', () => { install(); queueMicrotask(install); });
})();
