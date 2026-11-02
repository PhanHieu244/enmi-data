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
  // Round 3: sixteen requested narration runs plus the nested wall inspection,
  // each with two or three meaningful views.
  // These are native presentation fields on existing objects. No new steps,
  // prose, conditions, rewards, voice entries or saved cursor indices.
  // The gentle location looks use measured painted landmarks. Evidence
  // inserts reuse only pictures already available at that point in the case.
  const view = (box, maxScale = 1.16) => ({ box, maxScale });
  const detail = art => ({ art, detail: true });
  const narration = {
    c2_open: [
      ['24', { look: null }],
      ['26', { look: view([0, 61, 43, 25], 1.12) }], // the table on the way out
      ['27', { look: view([47, 26, 23, 19], 1.12) }], // the moonlit window
      ['28', { look: null }],
    ],
    c2_cottage: [
      ['19.then.0', { scene: 'cottage-open-dog', look: view([48, 23, 47, 47], 1.08) }],
      ['19.then.1', { look: view([54, 43, 14, 18], 1.2) }], // warm stove, not a bagged exhibit
      ['19.then.3', { look: null }],
    ],
    c2_tellfull: [
      ['19', { look: view([62, 49, 38, 23], 1.12) }], // boat at the slip
      ['21', { look: null }], // whole slipway as people gather from the lane
      ['26', { look: view([1, 51, 32, 18], 1.08) }], // Dodd's bench
      ['27', { look: null }],
    ],
    c2_boat: [
      ['7', { look: null }],
      ['8', { look: view([49, 40, 45, 17], 1.16) }], // channel posts
      ['11', { look: view([10, 17, 40, 30], 1.18) }], // iron legs and ladder
      ['16', { look: null }],
      ['24', { look: null }],
      ['25', { look: view([15, 40, 29, 25], 1.16) }], // Tom's lowered face
      ['27', { look: null }], // the cramped whole refuge again
      ['28', { look: null }],
      // Additional recursive-census case: the physical wall during the rescue.
      // Reuse bt-refuge's exact inscription coordinates, then clear the look
      // on the existing note step before the native exploration menu returns.
      ['29.explore.spots.2.then.0', { look: view([10, 35.5, 33.5, 7.8], 3.2) }],
      ['29.explore.spots.2.then.1', { look: view([10.5, 35.7, 32.5, 2.3], 3.2) }],
      ['29.explore.spots.2.then.2', { look: view([10.5, 38.2, 32.5, 2.3], 3.2) }],
      ['29.explore.spots.2.then.4', { look: view([10, 35.5, 33.5, 7.8], 3.2) }],
      ['29.explore.spots.2.then.5', { look: null }],
    ],
    c3_open: [
      ['10', { look: view([25, 59, 66, 34], 1.12) }], // the slipway
      ['11', { look: view([0, 30, 34, 35], 1.12) }], // the shelter beside it
      ['13', { look: null }],
    ],
    c3_refuge: [
      ['4', { look: null }],
      ['5', { look: view([39, 49, 53, 30], 1.16) }], // water over the road
      ['9', { look: view([10, 25, 39, 32], 1.18) }], // the only refuge
      ['10', { look: null }],
    ],
    c3_photo: [
      ['3', { look: null }],
      ['4', { look: view([83, 28, 17, 40], 1.12) }], // the back-room door
      ['5', { look: null }],
      ['7', { shot: 'cg-car-recovered', look: null }], // show Photo 3 as its caption is read
      ['17', { look: view([25, 21, 60, 61], 1.08) }],
      ['19', { look: view([57, 32, 29, 43], 1.18) }], // wheel and pedals
      ['20', { look: view([24, 29, 39, 46], 1.18) }], // the recorded seat position
      ['21', { look: null }],
    ],
    c3_notsuicide: [
      ['0', { overlay: detail('it-vial') }],
      ['1', { overlay: detail('it-vial') }],
      ['2', { overlay: detail('it-flask') }],
      ['3', { overlay: detail('act-label') }],
    ],
    c4_cottage: [
      // bt-refuge owns the writing and the combined frame at20. These two
      // native looks follow its measured morning/last rows without changing ink.
      ['21', { look: view([10.5, 35.7, 32.5, 2.3], 3.2) }],
      ['22', { look: view([10.5, 38.2, 32.5, 2.3], 3.2) }],
      ['25', { look: 'refuge_readings' }],
      ['46', { look: null }],
      ['47', { overlay: detail('act-1471') }], // recap the already heard21:11 call
      ['49', { overlay: detail('lantern-bottle-gone') }], // the known bar telephone
    ],
    c4_boat: [
      ['15', { look: view([64, 51, 36, 22], 1.12) }],
      ['16', { overlay: detail('act-prints') }],
      ['18', { look: view([63, 57, 37, 21], 1.16) }],
      ['19', { look: null }],
    ],
    c5_vigil: [
      // bt-lantern-stage restores the whole interior at8.
      ['9', { look: view([82, 23, 16, 10], 1.16) }], // empty place on the shelf
      ['11', { look: view([48, 51, 24, 26], 1.12) }], // Fergus's stool
      ['13', { look: null }],
    ],
    c5_dunes: [
      ['39', { look: view([29, 60, 46, 17], 1.2) }], // disturbed hollow
      ['41', { look: view([37, 62, 28, 12], 1.36) }],
      ['45', { look: view([34, 63, 35, 14], 1.28) }],
      ['46', { look: null }],
      ['64', { look: view([41, 33, 26, 30], 1.12) }], // the ring and hands
      ['65', { look: view([28, 0, 65, 21], 1.12) }], // the receding water behind them
      ['68', { look: null }],
      ['70', { look: null }],
    ],
  };
  const narrationDone = new WeakSet();
  const frameNarration = S => {
    for (const [node, entries] of Object.entries(narration)) {
      for (const [path, presentation] of entries) {
        const st = path.split('.').reduce((value, key) => value?.[key], S.nodes?.[node]);
        if (!st || narrationDone.has(st)) continue;
        Object.assign(st, JSON.parse(JSON.stringify(presentation)));
        narrationDone.add(st);
      }
    }
  };
  const install = () => {
    const S = E.S();
    if (S?.id !== 'between-tides') return;
    S.fit = 'contain';
    S.detailExplore = true;
    // Narrow the native cellar hit regions to the visible inner objects.
    // Keep ch6.js byte-identical so existing save-map source revisions remain
    // valid; this is the same presentation-only chapter projection as below.
    if (S.places?.c6_cellar) {
      const cellar = E.regionsAll?.cellar || {};
      E.regions({ cellar: { ...cellar, size: [...(cellar.size || [941, 1672])], r: {
        ...(E.regionsOf?.('cellar') || cellar.r || {}),
        c6_phone: [10.5, 28, 8, 10.5], c6_sink: [10, 47, 26, 11], c6_steps: [75, 24, 12, 40],
      } } });
    }
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
          // The folder used to remain low on the passenger seat behind the
          // dialogue. Use its existing complete object art as a native detail
          // plate for both lines; the sealed photograph envelope stays closed.
          if (id === 'c1_open' && (en(st).startsWith('On the passenger seat, under the envelope') ||
            en(st).startsWith('You requested a copy in your first week'))) {
            st.pic = 'it-claimfile'; st.look = null;
          }
          if (id === 'c1_open' && st.look === 'seat') st.look = null;
          if (id === 'c1_open' && st.item === 'claimfile') delete st.from;
          if (st.bg === 'causeway') {
            if (id === 'c2_leo' || id === 'c3_refuge') st.bg = 'causeway-flooded';
            else if (!id.startsWith('c1_') || ['c1_evening', 'c1_bell'].includes(id)) st.bg = 'causeway-night';
          }
          if (id === 'c4_cottage' && st.bg === 'cottage') st.bg = 'cottage-dog';
          // Leo has secured TOM's bottle by the late-night return. Keep the
          // earlier pub artwork intact; only these later chapters use the
          // matching shelf with its empty space. Exterior staging runs after
          // this mapping and retains its own night images.
          if (/^c[56]_/.test(id)) {
            for (const key of ['bg', 'scene', 'pic', 'cg', 'shot', 'img']) {
              if (st[key] === 'lantern') st[key] = 'lantern-bottle-gone';
            }
          }
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
    for (const entry of S.flow || []) {
      if (Number(entry.ch) >= 5 && entry.scene === 'lantern') entry.scene = 'lantern-bottle-gone';
    }
    frameNarration(S);
  };
  E.plugin({ id: 'bt-direction', on: {
    boot: install,
    chapter: install,
  } });
})();
