/* Between Tides: scene continuity and native presentation metadata.
 * No interpreter changes, new story frames, state awards or save-path shifts.
 * Refuge art/state/inscriptions are owned exclusively by bt-refuge.js.
 */
(() => {
  'use strict';
  const E = globalThis.StoryEngine;
  if (!E?.plugin || E.plugins?.['bt-direction']) return;
  const done = new WeakSet();
  const en = st => st.n?.en || st.en || '';
  // v093 forwards `on` for narration but omits it for spoken player lines.
  // The public line renderer already supports the addressee. Keep this
  // adapter scoped to the conversation with Nell; no interpreter replacement.
  const nativeLine = E.ui?.line;
  if (nativeLine) E.ui.line = function (options) {
    const addressingNell = E.S()?.id === 'between-tides' && options?.who === 'me' &&
      E.R()?.stack?.some(frame => frame.n === 'c6_nell_case');
    return nativeLine.call(this, addressingNell ? { ...options, on: 'nell' } : options);
  };
  let disconnectPictures = () => {};
  const fitPictures = () => {
    const root = document.querySelector('.se'), stage = root?.querySelector('.se-stage');
    const picture = stage?.querySelector('.se-pic:not(.out)');
    if (!root || !stage || !picture) return;
    const stageBox = stage.getBoundingClientRect();
    const top = root.querySelector('.se-top')?.getBoundingClientRect();
    const dialogue = root.querySelector('.se-box');
    const bottom = dialogue && !dialogue.hidden ? dialogue.getBoundingClientRect().top : stageBox.bottom - 16;
    const y = Math.max(stageBox.top + 14, (top?.bottom || stageBox.top) + 12);
    const height = Math.max(70, bottom - y - 12);
    const [w, h] = E.imgSize(E.R()?.pic || '');
    const ratio = w / h;
    const width = Math.min(stageBox.width - 32, 390, height * ratio);
    Object.assign(picture.style, {
      top: (y - stageBox.top + Math.max(0, height - width / ratio) / 2) + 'px',
      width: width + 'px', height: width / ratio + 'px', aspectRatio: String(ratio),
    });
  };
  const objects = {
    ring: ['it-ring', 1], note: ['it-note', 1], claimfile: ['it-claimfile', 1],
    roomkey: ['it-roomkey', 1], jumper: ['it-jumper', 1], cutting: ['it-cutting', 3],
    draft: ['it-draft', 2], vial: ['it-vial', 2], tombottle: ['it-tombottle', 3],
    flask: ['it-flask', 2], logbook: ['it-logbook', 4], skull: ['it-skull', 5],
    peg: ['it-peg', 5], calllist: ['it-calllist', 6],
    c6_nell_letter: ['it-c6_nell_letter', 6],
  };
  const aliases = {
    'causeway-night': 'causeway', 'causeway-flooded': 'causeway',
    'causeway-dawn': 'causeway', 'harbour-dawn': 'harbour',
    'lantern-yard-dawn': 'lantern', 'cottage-dog': 'cottage',
    'surgery-inside': 'surgery',
    'harbour-lamp-car': 'harbour', 'act-pocket-bagged': 'lifeboat',
  };
  const visit = (value, callback) => {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) { value.forEach(v => visit(v, callback)); return; }
    callback(value);
    for (const child of Object.values(value)) if (child && typeof child === 'object') visit(child, callback);
  };
  const install = () => {
    const S = E.S();
    if (S?.id !== 'between-tides') return;
    S.fit = 'contain';
    S.detailExplore = true;
    for (const [name, base] of Object.entries(aliases)) {
      S.scenes[name] ||= { ...S.scenes[base], time: undefined, fx: undefined };
    }
    for (const [id, [art, chapter]] of Object.entries(objects)) {
      const it = S.items?.[id];
      if (!it) continue;
      if (art) it.art = art;
      it.kind = 'object';
      it.recordType = 'object';
      it.chapter = chapter;
    }
    // Frames are patched once in place. Returning to a checkpoint cannot add
    // presentation data twice, and lazy chapters receive the same treatment.
    for (const collection of ['nodes', 'places', 'talks', 'events']) {
      for (const [id, value] of Object.entries(S[collection] || {})) {
        visit(value, st => {
          if (done.has(st)) return;
          done.add(st);
          // Slow camera drift used to continue behind dialogue and hotspots.
          // Native actionFrame/motion owns deliberate action shots instead.
          if (Object.hasOwn(st, 'cam')) st.cam = null;
          if (st.bg === 'causeway') {
            if (id === 'c2_leo' || id === 'c3_refuge') st.bg = 'causeway-flooded';
            else if (!id.startsWith('c1_') || ['c1_evening', 'c1_bell'].includes(id)) st.bg = 'causeway-night';
          }
          if (id === 'c4_cottage' && st.bg === 'cottage') st.bg = 'cottage-dog';
          // The early call rings upstairs; the cellar handset is only seen
          // much later, when the player can inspect the source of that call.
          if (id.startsWith('c1_') && st.pic === 'act-handset') st.pic = 'lantern-bar';
          if (id === 'c4_cottage' && st.sfx === 'phone') st.sfx = 'phone_keys';
          if (id === 'c1_evening' && st.pic === 'act-bottle-hand') st.pic = 'act-nell-pour';
          if (id === 'c3_pocket' && st.pic === 'act-pocket') st.pic = 'act-pocket-bagged';
          if (id === 'c3_pocket' && st.explore) {
            st.explore.img = 'act-pocket-bagged';
            const centres = { matches: [10, 49], pencil: [29, 49], hanky: [48, 49], vial: [66, 49], flask: [87, 49] };
            for (const spot of st.explore.spots || []) {
              const xy = centres[spot.id];
              if (xy) [spot.x, spot.y] = xy;
            }
          }
          if (id === 'c5_dunes' && st.explore) {
            const centres = { pegs: [24, 62], hollow: [51, 66], house: [90, 34] };
            for (const spot of st.explore.spots || []) {
              const xy = centres[spot.id];
              if (xy) [spot.x, spot.y] = xy;
            }
          }
          // Distinguish the recovery photograph from the two childhood
          // memories without moving an authored frame or saved pointer.
          if (id === 'c3_photo' && st.cg === 'cg-mem-nails') {
            delete st.cg; st.shot = 'cg-car-recovered';
          }
          if (id === 'c3_photo' && en(st).startsWith('You can hear her nails tapping')) st.shot = 'cg-mem-nails';
          if (id === 'c3_photo' && st.cg === 'cg-photo-seat') {
            delete st.cg; st.shot = 'cg-photo-seat';
          }
          if (id === 'c3_seat' && en(st).startsWith('Behind her seat')) st.shot = 'cg-mem-seat';
          if (id === 'c3_seat' && st.cg === null) {
            delete st.cg; st.shot = null;
          }
          if (id === 'c3_notsuicide' && en(st).startsWith('Suppose Tom added')) st.scene = 'lifeboat';
          if (id === 'c2_slip' && st.pic === 'act-pocket') st.pic = 'act-pocket-before';
          if (id === 'c2_slip' && en(st).startsWith('Then, from the same pocket')) st.pic = 'act-pocket';
          // A location used as a CG hides the cast in the native engine.
          // Helen's confession needs her visible beside her parked car.
          if ((id === 'c3_out' || id === 'c4_open') && st.cg === 'harbour-lamp') {
            delete st.cg;
            st.bg = 'harbour-lamp-car';
          }
          if (id === 'c4_open' && st.bg === 'harbour') st.bg = 'harbour-lamp-car';
          if (id === 'c5_card' && en(st).startsWith('Dr Vosper goes to a grey cabinet')) {
            delete st.pic;
            st.scene = 'surgery-inside';
          }
          if (id === 'c6_nell_case' && en(st).startsWith('The call came from your cellar, Nell')) st.on = 'nell';
          if ((id === 'c5_dunes' || id === 'c5_jumper') && st.pic === 'act-cuff') st.pic = 'act-cuff-callum';
          // Two matching views show a physical change. Native motion owns
          // skip/replay, endpoint saves, reduced motion and cancellation.
          if (id === 'c2_bar' && en(st).startsWith('She lifts the hatch')) {
            delete st.pic;
            st.shot = 'act-hatch-open';
            st.actionFrame = { focus: [25, 32, 50, 46], context: [5, 5, 90, 90], zoom: 1 };
            st.motion = { id: 'cellar-hatch-closes', ms: 1100, peek: true,
              backdrop: { frames: [{ offset: 0, art: 'act-hatch-open' }, { offset: .65, art: 'act-hatch' }] } };
          }
          if (id === 'c2_bar' && en(st).startsWith('The tap goes on coughing')) {
            delete st.pic; st.shot = 'act-hatch';
            st.actionFrame = { focus: [25, 32, 50, 46], context: [5, 5, 90, 90], zoom: 1 };
          }
          if (id === 'c2_bar' && en(st).startsWith('Through the window, headlights')) st.shot = null;
          if (id === 'c2_bar' && en(st).startsWith('The tap stops coughing')) {
            delete st.pic;
            st.shot = 'act-hatch';
            st.actionFrame = { focus: [25, 32, 50, 46], context: [5, 5, 90, 90], zoom: 1 };
            st.motion = { id: 'cellar-hatch-opens', ms: 1100, peek: true,
              backdrop: { frames: [{ offset: 0, art: 'act-hatch' }, { offset: .45, art: 'act-hatch-open' }] } };
          }
          if (id === 'c2_bar' && en(st).startsWith('Fergus eases himself')) st.shot = null;
          if (st.act?.kind === 'swipe' && st.act?.r === 'ladder') {
            st.actionFrame = { focus: 'ladder', context: [5, 5, 90, 88], zoom: 1.15 };
          }
        });
      }
    }
  };
  E.plugin({ id: 'bt-direction', on: {
    boot() {
      install(); disconnectPictures();
      if (E.S()?.id !== 'between-tides') return;
      const observer = new ResizeObserver(() => requestAnimationFrame(fitPictures));
      for (const el of document.querySelectorAll('.se-stage,.se-box')) observer.observe(el);
      const dialogue = document.querySelector('.se-box');
      const settled = () => requestAnimationFrame(fitPictures);
      dialogue?.addEventListener('transitionend', settled);
      dialogue?.addEventListener('animationend', settled);
      disconnectPictures = () => {
        observer.disconnect();
        dialogue?.removeEventListener('transitionend', settled);
        dialogue?.removeEventListener('animationend', settled);
      };
      requestAnimationFrame(fitPictures);
    },
    chapter: install,
    line: () => requestAnimationFrame(fitPictures),
  } });
})();
