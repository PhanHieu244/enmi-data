/* Vale 0.9.1 · authored Part I actions.
 * Presentation metadata only: no new spoken line, branch, item or array index.
 * Poses are matched derivatives of Reed's original full-body reference.
 */
(() => {
  'use strict';
  const E = StoryEngine, V = ValeDemo;
  const enabled = () => ['vale-dossiers-p1c1-v01', 'vale-dossiers-chapter1-demo03'].includes(E.S()?.id);
  const at = (node, path) => path.reduce((value, key) => value?.[key], E.S().nodes?.[node]);
  const patch = (node, path, values) => {
    const step = at(node, path);
    if (step) Object.assign(step, values);
    return step;
  };
  const notebook = 'p1-v091-reed-notebook', visitor = 'p1-v091-masked-exit';
  const celiaStep = 'p1-v091-celia-step', passenger = 'p1-v091-cab-passenger';
  const vestryActors = ['p1-v091-vestry-reed', 'p1-v091-vestry-celia', 'p1-v091-vestry-hart'];
  const noteFrame = () => ({ focus: 'p1-v091-notebook-focus', context: 'p1-v091-notebook-context', zoom: 1.25 });
  const doorFrame = () => ({ focus: 'p1-v091-door-focus', context: 'p1-v091-door-context', zoom: 1.25 });
  const studyImage = () => ['study', 'study_clear', 'study_by_lamp'].includes(E.R()?.scene) ? E.R().scene : 'study_clear';
  const noteTrack = (frames, at = [50, 52]) => ({ id: notebook, art: frames[0].art, at, w: 62, ar: 2 / 3, z: 3, frames });
  function removeOn(step, ids) {
    if (!step) return;
    step.valePhysical = { ...step.valePhysical,
      remove: [...new Set([...(step.valePhysical?.remove || []), ...ids])] };
  }
  function returnAt(node, path, ids = [notebook]) {
    const step = patch(node, path, { shot: null, look: null, actionFrame: null });
    removeOn(step, ids);
  }
  function stageNotebook(node, path, motion, scene = studyImage) {
    const step = patch(node, path, { look: null, on: 'reed', actionFrame: noteFrame(), motion });
    if (!step) return;
    // Use the actual room's letter state. A held letter must not reappear on
    // the desk just because this is a close view of Reed's notebook.
    Object.defineProperty(step, 'shot', { configurable: true, enumerable: true, get: scene });
    step.valePresence = { ...step.valePresence, show: [{ id: 'reed', at: 'l' }] };
    removeOn(step, [visitor]);
  }
  function install() {
    if (!enabled()) return;
    E.regions(Object.fromEntries(['study', 'study_clear', 'study_by_lamp'].map(image => [image, {
      size: [941, 1672], r: {
        'p1-v091-notebook-context': [20, 23, 60, 42],
        'p1-v091-notebook-focus': [32, 34, 36, 24]
      }
    }])));
    E.regions({ study_door: { size: [941, 1672], r: {
      'p1-v091-door-context': [29, 20, 57, 55],
      'p1-v091-door-focus': [38, 22, 40, 37]
    } } });
    E.regions(Object.fromEntries([['c5_door', [1024, 1536]], ['c5_study', [941, 1672]], ['c6_study', [941, 1672]]].map(([image, size]) => [image, {
      size, r: {
        'p1-v091-notebook-context': [20, 23, 60, 42],
        'p1-v091-notebook-focus': [32, 34, 36, 24]
      }
    }])));
    E.regions({
      c2_front_day: { size: [1024, 1536], r: { 'p1-v091-front-context': [28, 22, 46, 40], 'p1-v091-front-focus': [36, 27, 26, 28] } },
      c3_vestry: { size: [1024, 1536], r: { 'p1-v091-vestry-context': [9, 30, 82, 50], 'p1-v091-vestry-focus': [20, 39, 60, 33] } },
      c4_parlour: { size: [1024, 1536], r: { 'p1-v091-return-context': [61, 24, 38, 49], 'p1-v091-return-focus': [68, 32, 29, 32] } },
      c5_corner: { size: [1024, 1536], r: { 'p1-v091-cab-context': [36, 30, 45, 28], 'p1-v091-cab-focus': [48, 34, 29, 20] } }
    });
    E.regions({ c6_room: { size: [1024, 1536], r: {
      'p1-v091-notebook-context': [20, 23, 60, 42],
      'p1-v091-notebook-focus': [32, 34, 36, 24]
    } } });

    // This is the same nearby driver and horse seen on the cab route. The
    // glance is temporary: he turns back to the horse, without being named,
    // met, questioned or added to the present conversational cast.
    // The place step runs again after its nested inspection. Reset the shot
    // there as well as the visible layer so a save cannot retain the old cue.
    patch('c1_departure', [9], { shot: null, look: null, actionFrame: null });
    patch('c1_departure', [9, 'place', 'views', 'cab', 'zones', 0, 'then', 0], {
      shot: 'act-finn-care', look: null,
      actionFrame: { focus: 'p1-action-focus', context: 'p1-action-context', zoom: 1.3 },
      motion: { id: 'p1-v091-cab-driver-glance', ms: 2300, backdrop: { frames: [
        { offset: 0, art: 'act-finn-care' },
        { offset: .32, art: 'act-finn-turn' },
        { offset: .72, art: 'act-finn-care' },
        { offset: 1, art: 'act-finn-care' }
      ] } }
    });

    // A named-place inspection clears the conversational cast. Reed is
    // physically beside Vale here; the shared presence side validates that
    // authored context before restoring her native speaker portrait.
    const directoryReply = E.S().places?.c2_lane?.views?.rank?.zones?.[0]?.then?.[1];
    if (directoryReply?.say === 'reed') {
      directoryReply.look = null;
      directoryReply.valePresence = { ...directoryReply.valePresence, show: [{ id: 'reed', at: 'l' }] };
    }

    // Two original standing states show the mask's return at the doorway.
    // Reversing the seated unmasking plates here would put him back in the
    // chair. The foreground track is the sole visible Matthias in this shot.
    patch('c1_terms', [4], {
      shot: 'study_door', look: null, actionFrame: doorFrame(),
      motion: { id: 'p1-v091-mask-at-door', ms: 2100, tracks: [{
        id: visitor, art: 'matthias-unmasked', at: [57, 51], w: 48, ar: 2 / 3, z: 3,
        frames: [
          { offset: 0, art: 'matthias-unmasked', opacity: 1 },
          { offset: .52, art: 'matthias-entry-full' },
          { offset: 1, art: 'matthias-entry-full' }
        ]
      }] }
    });
    returnAt('c1_terms', [8], [visitor]);

    // The notebook is already open in the prose. Show the writing pose at
    // entry instead of inventing an extra close/open cycle. The following
    // turn and closure are real changes of the held notebook's visible state.
    for (const [index, id] of [[6, 'p1-v091-notebook-columns'], [18, 'p1-v091-notebook-admission']]) {
      stageNotebook('c1_account', [index], {
        id, ms: 1600, sounds: [{ at: .12, cue: 'pen_write' }],
        tracks: [noteTrack([
          { offset: 0, art: 'reed-writing-v091', opacity: 0 },
          { offset: .18, art: 'reed-writing-v091', opacity: 1 },
          { offset: 1, art: 'reed-writing-v091', opacity: 1 }
        ])]
      });
      returnAt('c1_account', [index + 1]);
    }
    stageNotebook('c1_review', [0], {
      id: 'p1-v091-notebook-turned', ms: 1900,
      tracks: [noteTrack([
        { offset: 0, art: 'reed-writing-v091' },
        { offset: .48, art: 'reed-offer-notebook-v091' },
        { offset: 1, art: 'reed-offer-notebook-v091' }
      ])]
    });
    returnAt('c1_review', [1]);
    stageNotebook('c1_terms', [9], {
      id: 'p1-v091-notebook-closed', ms: 1800, sounds: [{ at: .52, cue: 'paper_fold' }],
      tracks: [noteTrack([
        { offset: 0, art: 'reed-writing-v091' },
        { offset: .55, art: 'reed-full' },
        { offset: 1, art: 'reed-full' }
      ])]
    });
    returnAt('c1_terms', [10]);

    // Celia pauses on the top step. The coat/gloves come from her original
    // full-body sprite; the motion only establishes her physical entrance.
    // Naming her still belongs to the untouched meet step that follows.
    patch('c2_call', [1], {
      shot: 'c2_front_day', look: null, on: 'celia',
      actionFrame: { focus: 'p1-v091-front-focus', context: 'p1-v091-front-context', zoom: 1.15 },
      valePresence: { show: [{ id: 'celia', at: 'r' }] },
      motion: { id: 'p1-v091-celia-top-step', ms: 1900, tracks: [{
        id: celiaStep, art: 'celia-full', at: [50, 38.5], w: 24, ar: 2 / 3, z: 3,
        frames: [
          { offset: 0, at: [50, 38.5], w: 24, opacity: 0 },
          { offset: .22, opacity: 1 },
          { offset: .75, at: [50, 41], w: 27, opacity: 1 },
          { offset: 1, at: [50, 41], w: 27, opacity: 1 }
        ]
      }] }
    });
    returnAt('c2_call', [2], [celiaStep]);

    // The envelope is held openly after the glove search, then tucked under
    // Hart's arm. Both plates share the same doorway and closed contents.
    patch('c2_call', [14], {
      shot: 'act-hart-envelope-gloves', look: 'p1-contact',
      actionFrame: { focus: 'p1-action-focus', context: 'p1-action-context', zoom: 1.25 },
      motion: { id: 'p1-v091-envelope-under-arm', ms: 1700, backdrop: { frames: [
        { offset: 0, art: 'act-hart-envelope-gloves' },
        { offset: .55, art: 'act-hart-envelope-tucked' },
        { offset: 1, art: 'act-hart-envelope-tucked' }
      ] } }
    });
    returnAt('c2_call', [15], []);

    // Hart briefly goes to settle the clerk's fee and returns to the same
    // group. Celia and Reed remain in the vestry; there is no invented clerk
    // or Bell cutaway, payment prop, new evidence or new conversation.
    patch('c3_open', [33], {
      shot: 'c3_vestry', look: null, on: 'hart',
      actionFrame: { focus: 'p1-v091-vestry-focus', context: 'p1-v091-vestry-context', zoom: 1.1 },
      motion: { id: 'p1-v091-hart-leaves-and-returns', ms: 3200, tracks: [
        { id: vestryActors[0], art: 'reed-full', at: [23, 65], w: 55, ar: 2 / 3, z: 2,
          frames: [{ offset: 0, opacity: 1 }, { offset: 1, opacity: 1 }] },
        { id: vestryActors[1], art: 'celia-full', at: [76, 65], w: 55, ar: 2 / 3, z: 2,
          frames: [{ offset: 0, opacity: 1 }, { offset: 1, opacity: 1 }] },
        { id: vestryActors[2], art: 'hart-full', at: [49, 65], w: 55, ar: 2 / 3, z: 3,
          frames: [
            { offset: 0, at: [49, 65], opacity: 1 },
            { offset: .32, at: [115, 65], opacity: 0 },
            { offset: .6, at: [115, 65], opacity: 0 },
            { offset: .93, at: [49, 65], opacity: 1 },
            { offset: 1, at: [49, 65], opacity: 1 }
          ] }
      ] }
    });
    returnAt('c3_open', [34], vestryActors);

    // The hall door is at the right edge of this exact parlour painting.
    // Reed remains outside on this route; this entrance represents Celia only.
    patch('c4_alarm_explore', [2], {
      shot: 'c4_parlour', look: null, on: 'celia',
      actionFrame: { focus: 'p1-v091-return-focus', context: 'p1-v091-return-context', zoom: 1.15 },
      valePresence: { show: [{ id: 'celia', at: 'r' }] },
      motion: { id: 'p1-v091-celia-returns', ms: 2000, tracks: [{
        id: celiaStep, art: 'celia-full', at: [97, 40], w: 25, ar: 2 / 3, z: 3,
        frames: [
          { offset: 0, at: [97, 40], w: 25, opacity: 0 },
          { offset: .2, opacity: 1 },
          { offset: .8, at: [84, 51], w: 38, opacity: 1 },
          { offset: 1, at: [84, 51], w: 38, opacity: 1 }
        ]
      }] }
    });
    returnAt('c4_alarm_explore', [3], [celiaStep]);

    // Match the visible cab door, then remove the silhouette after boarding.
    // This is the anonymous passer-by, not a new sighting of named Celia.
    patch('c5_follow', [1], {
      shot: 'c5_corner', look: null,
      actionFrame: { focus: 'p1-v091-cab-focus', context: 'p1-v091-cab-context', zoom: 1.2 },
      motion: { id: 'p1-v091-passenger-boards', ms: 2600, tracks: [{
        id: passenger, art: 'c5_walker-full', at: [44, 47], w: 18, ar: 2 / 3, z: 3, remove: true,
        frames: [
          { offset: 0, at: [44, 47], w: 18, opacity: 1 },
          { offset: .55, at: [60, 42], w: 11, opacity: 1 },
          { offset: .75, at: [62, 40], w: 10, opacity: 1 },
          { offset: .9, at: [62, 40], w: 10, opacity: 0 },
          { offset: 1, opacity: 0 }
        ]
      }] }
    });
    returnAt('c5_follow', [2], [passenger]);

    // These anchors explicitly describe Reed writing in the running record.
    // Keep her in the actual scene; never reassign Vale's writing to Reed.
    for (const cue of [
      { node: 'c5_open', path: [13, 'choice', 2, 'then', 1], next: [13, 'choice', 2, 'then', 2], image: 'c5_door', id: 'p1-v091-greeting-recorded' },
      { node: 'c5_desk', path: [5, 'present', 'segs', 1, 'ok', 1], next: [6], image: 'c5_study', id: 'p1-v091-claim-struck-through' },
      { node: 'c5_plan', path: [2, 'choice', 0, 'then', 2], next: [3], image: 'c5_study', id: 'p1-v091-unknown-name-marked' },
      { node: 'c5_plan', path: [2, 'choice', 2, 'then', 3], next: [3], image: 'c5_study', id: 'p1-v091-accusation-recorded' },
      { node: 'c6_truth', path: [0, 'then', 1], next: [1], image: 'c6_room', id: 'p1-v091-accusation-corrected' },
      { node: 'c6_truth', path: [3], next: [4], image: 'c6_room', id: 'p1-v091-no-more-men-recorded' },
      { node: 'c6_delivery', path: [2, 'choice', 0, 'then', 2], next: [3], image: 'c6_study', id: 'p1-v091-method-recorded' }
    ]) {
      stageNotebook(cue.node, cue.path, {
        id: cue.id, ms: 1700,
        tracks: [noteTrack([
          { offset: 0, art: 'reed-writing-v091', opacity: 0 },
          { offset: .2, art: 'reed-writing-v091', opacity: 1 },
          { offset: 1, art: 'reed-writing-v091', opacity: 1 }
        ], ['c5_door', 'c6_room'].includes(cue.image) ? [50, 55] : [50, 52])]
      }, () => cue.image);
      returnAt(cue.node, cue.next);
    }
    // The presentation mechanism re-enters its parent after the correction
    // reaction. Clear the notebook there before its native paper view returns.
    returnAt('c5_desk', [5]);
    // She opens the notebook here but has not begun correcting the accusation.
    // No pen sound or altered words are added to the original narration.
    stageNotebook('c6_visit', [0, 'then', 1], {
      id: 'p1-v091-correction-space-opened', ms: 1900,
      tracks: [noteTrack([
        { offset: 0, art: 'reed-full' },
        { offset: .52, art: 'reed-writing-v091' },
        { offset: 1, art: 'reed-writing-v091' }
      ])]
    }, () => 'c6_study');
    returnAt('c6_visit', [1]);
  }
  E.on('boot', () => { install(); queueMicrotask(install); });
  E.on('chapter', () => { install(); queueMicrotask(install); });
  V.v091P1Actions = () => ({ enabled: enabled(), notebookProp: notebook, visitorProp: visitor });
})();
