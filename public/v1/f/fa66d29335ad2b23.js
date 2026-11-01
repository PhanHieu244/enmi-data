/* Between Tides: the Chapter 2 kitchen opens once within the current run.
 * Native explore keeps its original spots, indices and five-clue requirement.
 * Do not use spot.if here: native explore clamps need to the visible clue count.
 */
(() => {
  'use strict';
  const E = globalThis.StoryEngine;
  if (!E?.plugin || E.plugins?.['bt-cottage']) return;
  // Native check.js provides a data-only registration facade, not a runtime.
  if (typeof document === 'undefined' && !E.mech && typeof E.S !== 'function') return;
  const nativeExplore = E.mech?.explore;
  if (typeof nativeExplore !== 'function') throw Error('Between Tides cottage plugin requires native explore to be loaded first');
  const FLAG = 'bt_cottage_kitchen_open';
  const CLOSED = 'cottage-closed', OPEN = 'cottage-open-dog';
  const LOCKED = new Set(['stove', 'cabinet', 'window', 'back']);
  const openingSteps = new WeakSet();
  let exploration = null, laterExploration = null, opening = null, exploreIndex = -1, laterKey = null;
  // Measured on the three approved 941 × 1672 painted variants. Names are
  // local to this plugin so old generated region names cannot take precedence.
  const commonRegions = {
    'bt-phone': [29, 44.5, 17, 9], 'bt-pegs': [22, 24, 11, 6],
    'bt-front': [2, 37, 12, 14], 'bt-cabinet': [56, 25, 12, 9],
    'bt-stove': [55, 45, 13, 13], 'bt-window': [69, 22, 17, 16],
    'bt-back': [84, 31, 12, 14], 'bt-dog': [47, 68, 49, 20],
  };
  const ours = () => E.S()?.id === 'between-tides';
  const root = () => document.querySelector('.se');
  const isOpen = () => !!E.R()?.f?.[FLAG];
  const markOpen = () => { if (!isOpen()) E.flag(FLAG, true); };
  const install = () => {
    if (!ours()) return;
    const S = E.S(), node = S.nodes?.c2_cottage;
    for (const id of [CLOSED, OPEN, 'cottage-dog']) {
      S.scenes[id] ||= { ...S.scenes.cottage, time: undefined, fx: undefined };
    }
    const regionData = {};
    for (const id of [CLOSED, OPEN, 'cottage-dog']) regionData[id] = {
      size: [941, 1672], fit: 'contain',
      r: { ...commonRegions, 'bt-kitchen': id === CLOSED ? [67, 36, 20, 18] : [70, 40, 14, 10] },
    };
    E.regions(regionData);
    const laterNode = S.nodes?.c4_cottage;
    laterExploration = laterNode?.find(st => st.explore?.spots?.some(sp => sp.id === 'label'))?.explore || null;
    if (laterExploration) {
      laterExploration.img = 'cottage-dog';
      for (const sp of laterExploration.spots) sp.r = 'bt-' + (sp.id === 'label' ? 'phone' : sp.id);
    }
    if (!node) return;
    exploreIndex = node.findIndex(st => st.explore?.spots?.some(sp => sp.id === 'kitchen'));
    if (exploreIndex < 0) return;
    exploration = node[exploreIndex].explore;
    for (const sp of exploration.spots) sp.r = 'bt-' + sp.id;
    const kitchen = exploration.spots.find(sp => sp.id === 'kitchen');
    opening = kitchen.then.find(st => st.n);
    // Side metadata selects the existing background mechanic at scene entry.
    const entry = node.find(st => st.bg === 'cottage' || st.bg === CLOSED || st.bg === OPEN);
    if (entry) { entry.bg = CLOSED; entry.btCottageEntry = true; }
    // All later kitchen lines carry the same scene so an older save resumed
    // inside this branch restores its already-open physical state correctly.
    let afterOpening = false;
    for (const st of kitchen.then) {
      if (st === opening) afterOpening = true;
      if (afterOpening && (st.n || st.think || st.say)) { st.scene = OPEN; openingSteps.add(st); }
    }
    for (const st of kitchen.again || []) { st.scene = OPEN; openingSteps.add(st); }
  };
  E.side('btCottageEntry', (value, st) => {
    if (!ours() || !value) return;
    // Re-entering the node without rewinding the run must not close the door.
    if (E.R().used?.['c2_cottage.' + exploreIndex + '.v.kitchen']) markOpen();
    st.bg = isOpen() ? OPEN : CLOSED;
  });
  E.plugin({
    id: 'bt-cottage',
    mechs: {
      explore(c) {
        if (!ours()) return nativeExplore(c);
        if (c.st.explore === laterExploration) {
          // The label and receiver belong to one small physical phone. Keep
          // both original clues in the native count, expose them in a readable
          // order, and honour an old save that has already used the receiver.
          laterKey = c.key();
          const labelRead = !!E.R().used?.[c.key('v', 'label')];
          root()?.classList.add('bt-cottage-phone');
          root()?.classList.toggle('bt-cottage-phone-next', labelRead);
          c.onExit?.(() => { laterKey = null; root()?.classList.remove('bt-cottage-phone', 'bt-cottage-phone-next'); });
          return nativeExplore(c);
        }
        if (c.st.explore !== exploration) return nativeExplore(c);
        const R = E.R();
        // Here no kitchen child frame is running. A native visited mark means
        // its sequence returned, including saves from the original release.
        if (R.used?.[c.key('v', 'kitchen')]) markOpen();
        exploration.img = isOpen() ? OPEN : CLOSED;
        root()?.classList.toggle('bt-cottage-locked', !isOpen());
        c.onExit?.(() => root()?.classList.remove('bt-cottage-locked'));
        return nativeExplore(c);
      },
    },
    on: {
      boot: install,
      chapter: install,
      step(type, st) {
        if (!ours()) return;
        if (openingSteps.has(st)) markOpen();
        if (type !== 'explore' || st.explore !== exploration) root()?.classList.remove('bt-cottage-locked');
      },
    },
    setup() {
      // CSS removes these buttons from pointer and keyboard reach. The capture
      // guard also rejects a stale/programmatically dispatched click before
      // native onSpot can increment used, award a clue or push a child frame.
      document.addEventListener('click', event => {
        if (!ours()) return;
        const button = event.target.closest?.('[data-sp]');
        if (!button) return;
        const id = button.dataset.sp;
        const kitchenLocked = root()?.classList.contains('bt-cottage-locked') && LOCKED.has(id);
        const labelRead = laterKey && !!E.R().used?.[laterKey + '.v.label'];
        const phoneLocked = laterKey && (id === 'phone' && !labelRead || id === 'label' && labelRead && !root()?.classList.contains('xp-inspecting'));
        if (kitchenLocked || phoneLocked) { event.preventDefault(); event.stopImmediatePropagation(); }
      }, true);
    },
  });
  E.btCottage = { isOpen, flag: FLAG, sceneIds: { closed: CLOSED, open: OPEN }, install };
})();
