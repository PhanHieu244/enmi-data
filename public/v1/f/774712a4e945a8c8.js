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
  E.plugin({ id: 'bt-cast-staging', on: {
    boot() { apply(); setAction(null); },
    step(type, st) { if (ours()) { apply(); setAction(st); } },
  } });
  E.btCastStaging = { costumeFor, apply };
})();
