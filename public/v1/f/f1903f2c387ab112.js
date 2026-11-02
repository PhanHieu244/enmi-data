/* Vale 1.0.2 — explicit, reviewed destinations on existing story steps.
 * Load after the 0.9.x presentation plugins. Never insert/remove a step:
 * saved interpreter paths, prose, audio keys and evidence awards stay intact.
 * scene moves the world; shot only borrows an image and returns afterwards.
 */
(() => {
  'use strict';
  const E = globalThis.StoryEngine, V = globalThis.ValeDemo;
  if (!E || !V) return;
  const T = (en, vi) => ({ en, vi });
  const applied = new Map();
  const at = (S, node, path) => path.reduce((value, key) => value?.[key], S.nodes?.[node]);
  const anchor = (S, node, path, expected) => {
    const step = at(S, node, path);
    // This guard is deliberately literal: a local author may have rewritten
    // a scene. Do not apply a destination to a different narrative by index.
    return step?.n?.en === expected ? step : null;
  };
  const relocate = (S, node, path, expected, scene) => {
    const step = anchor(S, node, path, expected); if (!step) return;
    if (step.motion?.backdrop) return;
    delete step.shot; step.scene = scene; step.look = null; step.actionFrame = null;
    applied.set(node + ':' + path.join('.'), { node, path:[...path], scene });
  };

  // The shared chapter ending follows several routes. A withdrawn group is
  // already at the aunt's door; the observed/intervention routes are still at
  // Blackthorn. A runtime route cue avoids teleporting everyone back there.
  E.side('valeLocation102', async (value, step, context) => {
    if (!value || E.S()?.id !== 'vale-dossiers-part2-v01') return;
    const scene = value.routes?.[E.R()?.f?.[value.flag]] || value.fallback;
    if (!scene || !E.S()?.scenes?.[scene] || context?.live?.() === false) return;
    E.enterLocation?.(scene);
    await E.sides.scene(scene, step, context);
  });

  function install() {
    const S = E.S(); if (!S || !/^vale-dossiers(?:-|$)/.test(S.id || '')) return;
    if (S.id === 'vale-dossiers-part2-v01') {
      S.scenes.p2_aunt_door_v102 = { kind:'street', size:[1024,1536], name:T('At Lydia’s aunt’s door', 'Trước cửa nhà dì của Lydia'), amb:'room' };
      S.locations ||= {};
      S.locations.lydia_aunt = { scenes:['p2_aunt_door_v102'], places:[] };
      relocate(S, 'p2c5_withdraw', [9], 'At the aunt’s door, Lydia turns back once. She thanks Ruth first, then the driver, then you. The order seems right to you.', 'p2_aunt_door_v102');
      const arrival = anchor(S, 'p2c5_withdraw', [9], 'At the aunt’s door, Lydia turns back once. She thanks Ruth first, then the driver, then you. The order seems right to you.');
      if (arrival) {
        const cast = ['reed','lydia','ruth'], contexts = globalThis.ValeV8Config?.contexts?.p2c5_withdraw;
        if (Array.isArray(contexts)) {
          let entry = contexts.find(value => value.at === 9);
          if (!entry) { entry = { at:9 }; contexts.push(entry); contexts.sort((a,b) => a.at-b.at); }
          entry.present = [...cast];
        }
        arrival.valePresence = { ...arrival.valePresence, show:cast.map((id,i) => ({ id, at:['l','c','r'][i] })) };
        arrival.valeDirection = { cast, frame:'grounded', reedArt:'reed-full', stable:true,
          fullArt:{ reed:'reed-full', lydia:'lydia-resolute', ruth:'ruth-full' } };
      }

      const close = anchor(S, 'p2c5_close', [3], 'Before closing the notebook, you check on everyone. Lydia is safe, Ruth beside her. You call Reed; she answers. For tonight, that matters as much as the evidence.');
      if (close && !close.motion?.backdrop) {
        delete close.scene; delete close.shot;
        close.valeLocation102 = { flag:'p2_outcome_route', routes:{ withdrawn:'p2_aunt_door_v102' }, fallback:'p2_house_evening' };
        close.look = null; close.actionFrame = null;
        close.valePresence = { ...close.valePresence, show:[{ id:'reed', at:'l' }] };
        applied.set('p2c5_close:3', { node:'p2c5_close', path:[3], conditional:close.valeLocation102 });
      }
    }
    if (S.id === 'vale-dossiers-part3-v01') {
      S.scenes.p3_train_home_v102 = { kind:'carriage', size:[1024,1536], name:T('The train home · evening', 'Trên tàu về · buổi tối'), amb:'room' };
      S.locations ||= {};
      S.locations.train_home = { scenes:['p3_train_home_v102'], places:[] };
      relocate(S, 'p3c1_open', [20,'then',0], 'Before you leave the passage, Nora brings the doctor’s note. She waits while you read the two short paragraphs.', 'p3_stable');
      relocate(S, 'p3c2_open', [7], 'A constable leads you to the edge of the cordon. The body has been removed. He points out the place where Greaves was found.', 'p3_hollow');
      relocate(S, 'p3c5_true_route', [11], 'That evening, Reed ties both sections with one ribbon. Two questions, separate answers. On the train home, you leave the newspaper folded and watch the fields pass.', 'p3_train_home_v102');
    }
  }
  const apply = () => { install(); queueMicrotask(install); };
  E.on('boot', apply); E.on('chapter', apply);
  V.v102Spatial = () => ({ version:'1.0.2', applied:[...applied.values()] });
})();
