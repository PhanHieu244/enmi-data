/* Vale 0.9.4 · later-scene actions that stay with the cast.
 * Additive presentation metadata: no prose, array positions, choices, items,
 * conditions or authorial knowledge changes. Existing motions keep ownership.
 *
 * These cues use native actor faces/poses. They do not cut to an invented
 * close-up, move a standing cutout to pretend that a hand performs an action,
 * or add a second Reed. Native motion owns finish/replay/resume endpoints.
 * Direction maps the full Reed pose assets onto one stable floor baseline.
 */
(() => {
  'use strict';
  const E = StoryEngine, V = ValeDemo;
  const enabled = () => /^vale-dossiers(?:-|$)/.test(E.S()?.id || '');
  const at = (S, node, path) => path.reduce((v, k) => v?.[k], S.nodes?.[node]);
  const added = new Map();
  const normalized = new Map();
  const genericOwners = {
    'c2_call.6': 'vale08-c2_call-6',
    'p3c3_open.18': 'vale08-p3c3_open-18',
    'p3c4_open.30': 'vale08-p3c4_open-30'
  };
  const oldNotebookProps = ['p1-v091-reed-notebook', 'v091-reed-action23'];
  const poseFaces = { 'reed-full': 'full', 'reed-writing-v091': 'writing-v091',
    'reed-offer-notebook-v091': 'offer-notebook-v091' };

  function clean(ids) {
    const R = E.R();
    for (const id of ids || []) {
      if (!oldNotebookProps.includes(id) && !['moss', 'v094-ben-moss-collar'].includes(id)) continue;
      if (R.props) delete R.props[id];
      for (const el of document.querySelectorAll('.prp')) if (el.dataset.p === id) el.remove();
    }
  }
  E.side('valeActions094', async value => { if (enabled() && value) clean(value.remove); });

  function cue(S, node, path, motion) {
    const st = at(S, node, path);
    if (!st?.n) return;
    // Other authoring overlays run twice, including after lazy chapter loads.
    // Never overwrite an action owned by an earlier release or another cue.
    const owner = genericOwners[[node, ...path].join('.')];
    if (st.motion && st.motion.id !== motion.id) {
      if (st.motion.id !== owner) return;
      motion = { ...motion, id: owner };
      normalized.set(owner, { node, path: [...path], id: owner, kind: 'generic-to-authored' });
    }
    st.motion = motion;
    if (motion.id === owner) normalized.set(owner, { node, path: [...path], id: owner, kind: 'generic-to-authored' });
    else added.set(motion.id, { node, path: [...path], id: motion.id });
  }
  function directory(S, talk, path, id) {
    const st = path.reduce((v, k) => v?.[k], S.talks?.[talk]);
    if (!st?.n || st.motion && st.motion.id !== id) return;
    st.motion = { id, ms: 2300, actors: [{ id: 'reed', show: true, frames: [
      { offset: 0, face: 'directory-read-v094' },
      { offset: .64, face: 'directory-read-v094' },
      { offset: .82, face: 'directory-check-v094' },
      { offset: 1, face: 'directory-check-v094' }
    ] }] };
    added.set(id, { root: 'talks', node: talk, path: [...path], id });
  }

  function nativeNotebook(S, node, path) {
    const st = at(S, node, path), M = st?.motion;
    if (!M?.id || !M.id.includes('v091')) return;
    const track = M.tracks?.find(t => oldNotebookProps.includes(t.id));
    if (!track) return; // Already normalized, or another action owns this step.
    let art = track.art;
    const frames = [];
    for (const f of track.frames || []) {
      art = f.art || art;
      if (!poseFaces[art]) return;
      frames.push({ offset: f.offset, face: poseFaces[art] });
    }
    if (!frames.length) return;
    const next = { ...M, actors: [...(M.actors || []).filter(a => a.id !== 'reed'),
      { id: 'reed', show: true, frames }] };
    delete next.tracks;
    // The writing occurs in the current authored room. Return to that room
    // without recentering Reed in a shot, then re-entering her native slot.
    Object.defineProperty(st, 'shot', { configurable: true, enumerable: true, writable: true, value: null });
    st.look = null; st.actionFrame = null; st.motion = next;
    st.valeActions094 = { ...st.valeActions094,
      remove: [...new Set([...(st.valeActions094?.remove || []), ...oldNotebookProps])] };
    normalized.set(M.id, { node, path: [...path], id: M.id });
  }
  const reaction = (id, who, face, ms = 1250) => ({
    id, ms,
    actors: [{ id: who, show: true, frames: [
      { offset: 0 }, { offset: .64, face }, { offset: 1, face }
    ] }]
  });

  function install() {
    if (!enabled()) return;
    const S = E.S();
    if (['vale-dossiers-p1c1-v01', 'vale-dossiers-chapter1-demo03'].includes(S.id)) {
      // A brief smile is explicitly narrated. Keep the same feet and coat;
      // only the compatible original full-body expression changes.
      cue(S, 'c2_call', [6], {
        id: 'p1-v094-celia-brief-smile', ms: 1500,
        actors: [{ id: 'celia', show: true, frames: [
          { offset: 0 }, { offset: .18, face: 'smiling' },
          { offset: .66, face: 'smiling' }, { offset: 1, face: '' }
        ] }]
      });
      // Her smile is gone when she considers the named client. This supports
      // the existing resolute answer; it does not fake her glove or eye rig.
      cue(S, 'c2_call', [7, 'choice', 0, 'then', 2],
        reaction('p1-v094-celia-considers-client', 'celia', 'resolute', 1400));
      directory(S, 'c2_bell', ['topics', 0, 'then', 2], 'p1-v094-directory-bell-checked');
      directory(S, 'c2_finn', ['topics', 0, 'then', 1], 'p1-v094-directory-finn-checked');
      for (const [node, path] of [
        ['c1_terms', [9]],
        ['c5_open', [13, 'choice', 2, 'then', 1]],
        ['c5_desk', [5, 'present', 'segs', 1, 'ok', 1]],
        ['c5_plan', [2, 'choice', 0, 'then', 2]],
        ['c5_plan', [2, 'choice', 2, 'then', 3]],
        ['c6_truth', [0, 'then', 1]], ['c6_truth', [3]],
        ['c6_delivery', [2, 'choice', 0, 'then', 2]],
        ['c6_visit', [0, 'then', 1]]
      ]) nativeNotebook(S, node, path);
    }
    if (S.id === 'vale-dossiers-part2-v01') {
      cue(S, 'p2c3_open', [33],
        reaction('p2-v094-lydia-recovers-after-crash', 'lydia', 'calm', 1700));
      for (const branch of ['then', 'else']) {
        cue(S, 'p2c5_withdraw', [2, branch, 0],
          reaction('p2-v094-lydia-ready-to-leave-' + branch, 'lydia', 'resolute', 1500));
      }
      // Start with the dated record already open. She puts it away once;
      // resume and reduced motion keep the closed endpoint, never an extra
      // opening/closing cycle after the line has settled.
      cue(S, 'p2c5_close', [2, 'else', 0], {
        id: 'p2-v094-night-record-dated-and-put-away', ms: 2400,
        sounds: [{ at: .12, cue: 'pen_write' }, { at: .78, cue: 'paper_fold' }],
        actors: [{ id: 'reed', show: true, frames: [
          { offset: 0, face: 'writing-v091' },
          { offset: .64, face: 'writing-v091' },
          { offset: .82, face: 'full' }, { offset: 1, face: 'full' }
        ] }]
      });
      // An open blank record supports the unfilled reply. Do not invent a
      // response, write new words, or show a letter that has not arrived.
      cue(S, 'p2c6_safe', [7], {
        id: 'p2-v094-room-left-for-reply', ms: 1300,
        actors: [{ id: 'reed', show: true, frames: [
          { offset: 0, face: 'full' },
          { offset: .34, face: 'offer-notebook-v091' },
          { offset: 1, face: 'offer-notebook-v091' }
        ] }]
      });
      for (const [node, path] of [
        ['p2c4_open', [12, 'explore', 'spots', 1, 'then', 2]],
        ['p2c4_open', [33, 'choice', 1, 'then', 1]],
        ['p2c5_observe', [9]], ['p2c6_overreach', [4]]
      ]) nativeNotebook(S, node, path);
    }
    if (S.id === 'vale-dossiers-part3-v01') {
      // Let the original concerned expression arrive during the silent
      // reading, before her next line. No repeated entrance or camera zoom.
      cue(S, 'p3c4_open', [30],
        reaction('p3-v094-elin-reads-in-silence', 'elin', 'concerned', 1800));
      const collar = at(S, 'p3c3_open', [18]);
      cue(S, 'p3c3_open', [18], {
        id: 'p3-v094-ben-straightens-moss-collar', ms: 2400, peek: true,
        actors: [{ id: 'ben', hide: true }],
        tracks: [{ id: 'v094-ben-moss-collar', art: 'p3_ben_moss_collar_v094',
          at: [56.4, 50.6], w: 49, ar: 1.5, z: 4,
          frames: [{ offset: 0 }, { offset: .48 },
            { offset: .76, art: 'p3_ben_moss_collar_done_v094' },
            { offset: 1, art: 'p3_ben_moss_collar_done_v094' }] }]
      });
      if (['p3-v094-ben-straightens-moss-collar', 'vale08-p3c3_open-18'].includes(collar?.motion?.id)) {
        // The full composite owns both silhouettes. A deliberate action
        // composition keeps the dog and the actual hand/collar contact above
        // the reader; a background-sized prop behind native Reed hid them.
        collar.shot = 'p3_yard_morning_open'; collar.look = null;
        collar.actionFrame = { focus: [31, 39, 51, 24], context: [22, 33, 68, 34], zoom: 1.55 };
        collar.valePresence = { ...collar.valePresence,
          show: (collar.valePresence?.show || []).filter(a => a.id !== 'ben'),
          hide: [...new Set([...(collar.valePresence?.hide || []), 'ben'])] };
        collar.valeActions094 = { ...collar.valeActions094, remove: ['moss'] };
      }
      for (const [node, path] of [
        ['p3c1_open', [24]], ['p3c2_open', [10]], ['p3c2_open', [31]],
        ['p3c4_open', [8, 'explore', 'spots', 1, 'then', 1]],
        ['p3c5_supported', [0, 'then', 1]]
      ]) nativeNotebook(S, node, path);
    }
  }

  E.on('boot', () => { install(); queueMicrotask(install); });
  E.on('chapter', () => { install(); queueMicrotask(install); });
  V.v094Actions = () => ({ enabled: enabled(), cues: [...added.values()], normalized: [...normalized.values()] });
})();
