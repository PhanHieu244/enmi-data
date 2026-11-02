/* Between Tides: context-specific costume framing on the native cast layer.
 * The engine still owns actor state, expressions, focus, transitions and saves.
 * No story frames, dialogue, flags, choices or core functions are replaced.
 */
(() => {
  'use strict';
  const E = globalThis.StoryEngine;
  if (!E?.plugin || E.plugins?.['bt-cast-staging']) return;
  const root = () => document.querySelector('.se');
  const ours = () => E.S()?.id === 'between-tides';
  const install = () => {
    if (!ours()) return;
    // The seated sprite includes its own stool. The approved bar plate now
    // leaves the customer-side floor empty, so there is one grounded seat.
    // A wider native region gives the seated torso its proper counter height.
    E.regions({ 'lantern-bar': { r: { 'bt-fergus-stool': [40, 27, 60, 69] } } });
    for (const person of E.S().places?.c1_bar?.views?.bar?.people || [])
      if (person.who === 'fergus') person.r = 'bt-fergus-stool';
  };
  const node = () => [...(E.R()?.stack || [])].reverse().find(f => /^c[1-6]_/.test(f.n))?.n || '';
  const DODD_COAT = new Set(['c2_harbour', 'c2_wait', 'c3_fergus', 'c5_vigil']);
  const NELL_COAT = new Set(['c2_tellfull', 'c2_wait', 'c2_slip']);
  const costumeFor = (id, n = node()) => id === 'dodd' && DODD_COAT.has(n) ? 'dodd-full-sit' : id === 'nell' && NELL_COAT.has(n) ? 'nell-full-outside' : '';
  const apply = () => {
    if (!ours()) return;
    for (const actor of root()?.querySelectorAll('.se-ch') || []) {
      const costume = costumeFor(actor.dataset.id);
      let image = actor.querySelector('.bt-cast-costume');
      if (!costume || !E.hasArt('im-' + costume)) {
        delete actor.dataset.btCostume;
        image?.remove();
        continue;
      }
      actor.dataset.btCostume = costume;
      if (!image) {
        image = document.createElement('div');
        image.setAttribute('aria-hidden', 'true');
        actor.querySelector('.se-chi').appendChild(image);
      }
      image.className = 'ii bt-cast-costume im-' + costume;
    }
  };
  const nativeShow = E.ui.show;
  E.ui.show = function (...args) {
    const result = nativeShow.apply(this, args);
    apply();
    return result;
  };
  const actionLine = st => {
    const en = st?.n?.en || '';
    return en.startsWith('At 22:39 Nell comes back down, her arms full of blankets.') ||
      en.startsWith('Nell kneels and tucks a blanket in under his chin');
  };
  const setAction = st => root()?.classList.toggle('bt-nell-action-narration', actionLine(st));
  const tomConversation = st => {
    if (node() !== 'c1_evening' || !st) return;
    const line = st.en || st.n?.en || '';
    const atTable = (st.whisper && (st.say === 'tom' || st.say === 'me')) ||
      line.startsWith('Tom touches the table with two fingers');
    if (!atTable) return;
    // The passing-table CG hid the actor. Native `say` intentionally does not
    // summon a hidden actor, so restore Tom at this authored conversation only.
    // This also handles an old save resumed on either player's question.
    E.ui.show('tom', 'c', st.face || E.R()?.cast?.tom?.face || 'soft');
    if (st.n) st.on = 'tom';
  };
  const nativeLine = E.ui.line;
  E.ui.line = function (options) {
    const addressTom = ours() && node() === 'c1_evening' && options?.who === 'me' && options?.whisper;
    return nativeLine.call(this, addressTom ? { ...options, on: 'tom' } : options);
  };
  E.plugin({ id: 'bt-cast-staging', on: {
    boot() { install(); apply(); setAction(null); },
    chapter: install,
    step(type, st) { if (ours()) { tomConversation(st); apply(); setAction(st); } },
  } });
  E.btCastStaging = { costumeFor, apply };
})();
