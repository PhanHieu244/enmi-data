/* Vale 0.9.7 · measured people and intentional close views.
 * Presentation metadata only: keep every story array, ID, choice, award and
 * spoken sentence intact. A close view owns one line; it is not an entrance.
 */
(() => {
  'use strict';
  const E = StoryEngine, V = ValeDemo, q = s => document.querySelector(s);
  const enabled = () => /^vale-dossiers(?:-|$)/.test(E.S()?.id || '');
  const at = path => path.reduce((o, k) => o?.[k], E.S());
  const changes = new Map();
  const patch = (path, value, reason) => {
    const step = at(path); if (!step) return;
    Object.assign(step, value);
    changes.set(path.join('.'), { path: [...path], reason });
  };
  // Measured on the shipped transparent sources, alpha > 96/255. Canvas
  // dimensions alone are not body dimensions: Hart has 67 px above his head
  // and 75 px below his feet, versus Reed's 25 and 30. Preserve proportions.
  const bounds = {
    'reed-full': [176, 25, 853, 1506],
    'reed-writing-v091': [160, 28, 871, 1505],
    'reed-offer-notebook-v091': [167, 21, 872, 1504],
    'reed-directory-read-v094': [153, 31, 873, 1506],
    'reed-directory-check-v094': [144, 31, 877, 1505],
    'reed-tea-v094': [171, 25, 866, 1507],
    'reed-candle-letters': [160, 26, 862, 1504],
    'hart-full': [294, 67, 720, 1461],
    'hart-smiling': [296, 66, 721, 1461],
    'celia-full': [201, 16, 783, 1514],
    'celia-resolute': [192, 16, 793, 1519],
    'celia-smiling': [196, 16, 793, 1513],
    'celia-holding': [181, 16, 812, 1520],
    'bell-full': [112, 16, 907, 1523],
    'finn-full': [245, 19, 844, 1488],
    'c3_clerk-full': [282, 32, 738, 1492],
    'c5_walker-full': [296, 14, 733, 1496],
    'c5-walker-salute': [297, 15, 780, 1497],
    'matthias-unmasked': [84, 13, 986, 1521],
    'matthias-entry-full': [90, 12, 979, 1520],
    'lydia-full': [283, 16, 781, 1520],
    'lydia-calm': [282, 16, 787, 1519],
    'lydia-resolute': [281, 17, 788, 1520],
    'rusk-full': [259, 14, 762, 1509],
    'ruth-full': [256, 11, 764, 1519],
    'owen-full': [283, 20, 745, 1507],
    'elin-full': [269, 15, 868, 1514],
    'elin-concerned': [268, 15, 873, 1515],
    'ben-full': [268, 18, 727, 1490],
    'ben-relieved': [269, 18, 727, 1491],
    'ben-report-open-v095': [283, 15, 789, 1466],
    'ben-report-folded-v095': [283, 15, 749, 1467],
    'nora-full': [191, 6, 848, 1525],
    'nora-concerned': [189, 6, 850, 1525],
    'nora-brush-contact-v095': [215, 7, 839, 1502],
    'nora-brush-paused-v095': [214, 5, 846, 1505],
    'dorn-full': [226, 21, 757, 1508],
    'dorn-uneasy': [225, 21, 759, 1509]
  };
  for (const id of ['hart', 'celia', 'c3_clerk', 'c5_walker', 'lydia', 'rusk', 'ruth', 'owen', 'elin', 'ben', 'nora', 'dorn'])
    bounds[id] = bounds[id + '-full'];
  bounds['ben-calm'] = bounds['ben-smiling'] = bounds['ben-relieved'];
  const parcelCaption = {
    en: 'Label: J. Hart, solicitor · 8 Grange Court',
    vi: 'Nhãn: J. Hart, luật sư · số 8 Grange Court'
  };
  // A bag belongs to the connected location, not the current camera angle.
  // Morning/evening images and separate chapter place IDs share provenance.
  const locations = {
    vale_rooms: { scenes: ['study', 'study_desk', 'study_window', 'study_door', 'study_clear', 'study_desk_clear', 'study_by_lamp', 'study_desk_lamp', 'c4_study', 'c5_study', 'c6_study', 'c6_after', 'p2_after', 'c5_door', 'c5_corner', 'c5_corner_departed'], places: ['c1_desk'] },
    wren_house: { scenes: ['alder_lane', 'service_lane', 'wren_door', 'cab_stand', 'cab_stand_departed', 'c2_lane_day', 'c2_front_day', 'c2_gate_day', 'c4_steps', 'c4_lane', 'c4_parlour', 'parlour-day-empty-panel', 'parlour-panel-open', 'parlour-terms', 'c5_wren', 'c6_wren', 'c6_room'], places: ['c1_alder_walk', 'c2_lane'] },
    st_anselm: { scenes: ['c3_court', 'c3_chapel', 'c3_vestry'], places: ['c3_church'] },
    blackthorn: { scenes: ['p2_house', 'p2_corridor', 'p2_room', 'p2_study', 'p2_room_shut', 'p2_room_night', 'p2_house_evening', 'p2_house_dawn', 'p2_corridor_night', 'p2_corridor_dawn'], places: ['p2c2_house'] },
    wycliffe: { scenes: ['p3_stable', 'p3_stable_outer_closed', 'p3_stable_return', 'p3_yard', 'p3_yard_morning', 'p3_yard_morning_alert', 'p3_yard_morning_clean', 'p3_yard_morning_open', 'p3_office', 'p3_office_stored'], places: ['p3c1_stable_walk', 'p3c3_yard_walk'] },
    moor: { scenes: ['p3_moor', 'p3_hollow'], places: ['p3c2_ground'] },
    greybank: { scenes: ['p3_dorn_yard', 'p3_dorn_gate_closed', 'p3_dorn_morning', 'p3_dorn_open'], places: [] },
    wessex: { scenes: ['p3_finish', 'p3_race'], places: [] }
  };
  const talkLocations = { c2_bell: 'wren_house', c2_finn: 'wren_house', c3_hart_before: 'st_anselm', c3_clerk_talk: 'st_anselm', p2c1_lydia: 'vale_rooms', p2c2_owen: 'blackthorn', p2c2_ruth: 'blackthorn', p2c3_rusk: 'blackthorn', p3c1_ben: 'wycliffe', p3c1_nora: 'wycliffe', p3c3_nora: 'wycliffe' };
  const exploreLocations = { c4_open_explore: 'wren_house', c4_alarm_explore: 'wren_house', c5_follow: 'vale_rooms', c6_visit: 'wren_house', c6_terms: 'wren_house', p2c4_open: 'blackthorn', p3c4_open: 'wycliffe', p3c5_open: 'greybank' };
  function installLocations(S) {
    S.locations = { ...(S.locations || {}) };
    for (const [id, entry] of Object.entries(locations)) {
      S.locations[id] = { ...entry, scenes: [...entry.scenes], places: [...entry.places] };
      for (const pid of entry.places) if (S.places?.[pid]) S.places[pid].location = id;
    }
    for (const [id, location] of Object.entries(talkLocations)) if (S.talks?.[id]) S.talks[id].location = location;
    for (const [node, location] of Object.entries(exploreLocations)) for (const step of S.nodes?.[node] || []) if (step.explore) step.explore.location = location;
    const desk = S.nodes?.c1_open?.[15]?.place;
    if (desk?.id === 'c1_desk') desk.location = 'vale_rooms';
    const lane = S.nodes?.c1_departure?.[9]?.place;
    if (lane?.id === 'c1_alder_walk') lane.location = 'wren_house';
  }
  function install() {
    if (!enabled()) return;
    const S = E.S();
    S.conversationFraming = 'adaptive';
    S.contextInventory = true;
    installLocations(S);
    for (const [id, box] of Object.entries(bounds)) {
      const who = id.replace(/-full$/, '');
      if (S.chars?.[who]) S.chars[who].bodyBounds = [...box];
    }
    const parcel = S.places?.c2_lane?.views?.rank?.zones?.find(z => z.id === 'parcel');
    if (parcel) for (const branch of ['then', 'again']) {
      const line = parcel[branch]?.[0]; if (!line?.n) continue;
      line.overlay = { art: 'evidence-parcel', aspect: 1, caption: { ...parcelCaption } };
      line.valeDetail097 = 'parcel';
      changes.set('places.c2_lane.views.rank.parcel.' + branch, {
        path: ['places', 'c2_lane', 'views', 'rank', 'zones', 'parcel', branch, 0],
        reason: 'First and repeat inspection show the same real parcel image and readable address, without moving the parcel or granting another record.'
      });
    }
    const table = S.places?.c3_church?.views?.door?.zones?.find(z => z.id === 'ceremony');
    if (table?.then?.[0]?.n) {
      table.then[0].focus = { r: [38, 37, 28, 12], scale: 1.12, ms: 650, returnMs: 420 };
      changes.set('places.c3_church.views.door.ceremony.then.0', {
        reason: 'One restrained push towards the actual chapel table; native line cleanup restores the exact previous view.'
      });
    }
    const chapel = S.places?.c3_church?.views?.door;
    if (chapel) {
      // The narrated couple is physically inside, seen from the threshold.
      // Place props share the painting's perspective during the small table
      // focus. They are released before the closer conversational cast enters.
      const distantBody = (id, centre, stature = 1) => {
        const [left, crown, right, foot] = bounds[id + '-full'];
        const size = 18 * stature * 1536 / (foot - crown);
        return { id: 'v097-chapel-' + id, art: id + '-full',
          r: [centre - size * (left + right) / 2048, 48 - size * foot / 1536, size, size], z: 2 };
      };
      chapel.props = [...(chapel.props || []).filter(p => !p.id?.startsWith('v097-chapel-')),
        distantBody('celia', 34), distantBody('hart', 68, 1.025)];
      patch(['nodes', 'c3_open', 9], { valeReleaseSceneProps097: ['v097-chapel-celia', 'v097-chapel-hart'] },
        'The threshold figures belong to the distant view; the original closer conversation stages the same people once.');
      changes.set('places.c3_church.views.door.props', { reason: 'The couple described during the first and repeat chapel inspection is visibly present at the altar, using unchanged full-body art.' });
    }
    const clerk = S.talks?.c3_clerk_talk?.bye?.[0];
    if (clerk?.n) patch(['talks', 'c3_clerk_talk', 'bye', 0], {
      overlay: { art: 'evidence-register', aspect: 1 }, valeDetail097: 'register'
    }, 'A real register detail supports the narrated handling; the original clerk actor is retained underneath.');
    // The wedding already has two genuine, detailed signing/blotting plates.
    // Keep that action and its saved cue; soften the extra magnification.
    const register = S.nodes?.c3_open?.[18];
    if (register?.n && register.motion?.id === 'p1-c3-register-signed') {
      register.actionFrame = { ...(register.actionFrame || {}), focus: 'p1-action-focus', context: 'p1-action-context', zoom: 1.14 };
      changes.set('nodes.c3_open.18.actionFrame', { reason: 'Keep the detailed two-plate register action, with a modest 1.14 composition scale and its existing authored return.' });
    }
  }
  const activeStep = () => {
    const a = V.active;
    return a ? E.walk({ n: a.n, p: JSON.parse(a.p) })?.[a.i] : null;
  };
  E.side('valeReleaseSceneProps097', async ids => {
    const R = E.R(), saved = R?.sceneProps;
    if (!enabled() || !saved || !Array.isArray(ids)) return;
    // Retain the outgoing painted plane until the native scene transition
    // captures it. Only the incoming scene loses these distant figures.
    R.sceneProps = { ...saved, items: saved.items.filter(p => !ids.includes(p.id)) };
  });
  let raf = 0, scheduled = false;
  const artMetric = el => {
    const ids = [...el.classList].filter(c => c.startsWith('im-')).map(c => c.slice(3));
    const id = ids.reverse().find(id => bounds[id]);
    return id ? { id, box: bounds[id] } : null;
  };
  function clearGeometry() {
    const root = q('.se'); if (!root) return;
    delete root.dataset.v097Metric; delete root.dataset.v097Frame;
    for (const art of root.querySelectorAll('[data-v097-art]')) {
      delete art.dataset.v097Art;
      art.style.removeProperty('--v097-art-size');
      art.style.removeProperty('--v097-art-position');
    }
  }
  function layout() {
    raf = 0;
    const root = q('.se'); if (!root || !enabled()) return;
    root.dataset.depth = 'subtle';
    const step = activeStep(), R = E.R(), direction = V.v093Direction?.();
    // Exact prose remains in the reader; no generated handwriting is treated
    // as evidence. Reserve the real reader boundary, including long VI text.
    const overlay = root.querySelector('.se-action-overlay');
    if (step?.valeDetail097 && overlay) {
      root.dataset.v097Detail = step.valeDetail097;
      const stage = q('.se-stage').getBoundingClientRect(), rr = root.getBoundingClientRect();
      const reader = q('.se-box'), rb = reader?.getBoundingClientRect();
      const bars = [q('.se-top'), q('.v8-contextbar')].filter(el => el && !el.hidden && getComputedStyle(el).display !== 'none');
      const top = Math.max(72, ...bars.map(el => el.getBoundingClientRect().bottom - rr.top)) + 14;
      const landscape = matchMedia('(min-width:600px) and (max-height:500px)').matches;
      const bottom = !landscape && reader && !reader.hidden ? Math.max(12, rr.bottom - rb.top + 10) : 16;
      const space = Math.max(72, stage.height - top - bottom);
      root.style.setProperty('--v097-insert-top', top + 'px');
      root.style.setProperty('--v097-insert-bottom', bottom + 'px');
      root.style.setProperty('--v097-insert-width', Math.min(stage.width - 24, space) + 'px');
      // The caption occupies its own measured strip. On a short phone it
      // must never cover the bitmap it is meant to describe.
      overlay.style.setProperty('--v097-caption-height', (overlay.querySelector('span')?.offsetHeight || 0) + 'px');
    } else delete root.dataset.v097Detail;
    if (!direction?.frame || !direction.actors.length || R.shot || R.cg || R.look || R.actionFrame) {
      clearGeometry(); return;
    }
    const actors = direction.actors.map(id => root.querySelector('.se-ch[data-id="' + CSS.escape(id) + '"]')).filter(Boolean);
    const handAction = root.dataset.v095ActionReading === 'true';
    const medium = direction.frame === 'medium';
    const bust = actors.length === 1 && R.dialogueFrame === 'bust' && !handAction && !medium;
    root.dataset.v097Frame = bust ? 'bust' : medium ? 'medium' : 'full';
    root.dataset.v097Metric = 'true';
    let bustHeight = 0;
    if (bust) {
      const rr = root.getBoundingClientRect();
      const bars = [q('.se-top'), q('.v8-contextbar')].filter(el => el && !el.hidden && getComputedStyle(el).display !== 'none');
      const top = Math.max(80, ...bars.map(el => el.getBoundingClientRect().bottom - rr.top)) + 18;
      root.style.setProperty('--v097-cast-top', top + 'px');
      root.style.setProperty('--v097-cast-height', Math.max(140, root.clientHeight - top) + 'px');
      bustHeight = Math.min(root.clientHeight * 1.08, q('.se-stage').clientWidth * 2.8);
    }
    const mediumHeight = medium && actors.length > 2
      ? Math.min(root.clientHeight * 1.06, q('.se-stage').clientWidth * 1.78)
      : root.clientHeight * 1.06;
    for (const [index, actor] of actors.entries()) {
      // A three-person seated crop needs room for complete hands/books.
      // Fitting by phone height alone made the left actor's fingers protrude
      // beside the centre actor's waist, like an unrelated extra hand.
      if (medium && actors.length === 3) actor.style.setProperty('--v097-medium-slot', [14, 50, 86][index] + '%');
      else actor.style.removeProperty('--v097-medium-slot');
      for (const art of actor.querySelectorAll('.se-chi > .ii')) {
        const metric = artMetric(art); if (!metric) continue;
        const [left, crown, right, foot] = metric.box;
        const ratio = actor.dataset.id === 'hart' ? 1.025 : 1;
        const targetBody = (bust ? bustHeight : medium ? mediumHeight : actor.clientHeight) * 1481 / 1536 * ratio;
        const scale = targetBody / (foot - crown);
        const x = art.clientWidth / 2 - (left + right) / 2 * scale;
        const y = bust || medium ? -crown * scale : actor.clientHeight - foot * scale;
        art.dataset.v097Art = metric.id;
        art.style.setProperty('--v097-art-size', `${1024 * scale}px ${1536 * scale}px`);
        art.style.setProperty('--v097-art-position', `${x}px ${y}px`);
      }
    }
  }
  function schedule() {
    if (scheduled) return; scheduled = true;
    queueMicrotask(() => { scheduled = false; layout(); if (!raf) raf = requestAnimationFrame(layout); });
  }
  const line = E.ui.line;
  E.ui.line = (...args) => { const result = line(...args); schedule(); return result; };
  const show = E.ui.show;
  E.ui.show = (...args) => { const result = show(...args); schedule(); return result; };
  E.on('step', schedule);
  E.on('line', schedule);
  E.on('action-peek', active => {
    // These explicitly authored seated shots use a medium crop of existing
    // standing art. Revealing the legs would contradict the seated action.
    if (active && q('.se')?.dataset.v097Frame === 'medium') E.ui.actionPeek?.(false);
  });
  E.on('visual-transition-prepared', clearGeometry);
  E.on('end', clearGeometry);
  const reset = E.ui.reset;
  E.ui.reset = (...args) => { clearGeometry(); return reset(...args); };
  E.on('boot', () => {
    if (!enabled()) return;
    install(); queueMicrotask(install);
    const observer = new ResizeObserver(schedule);
    for (const el of [q('.se'), q('.se-top'), q('.v8-contextbar'), q('.se-box')]) if (el) observer.observe(el);
    addEventListener('resize', schedule, { passive: true });
    schedule();
  });
  E.on('chapter', () => { install(); queueMicrotask(install); schedule(); });
  V.v097Presentation = () => ({
    enabled: enabled(), frame: q('.se')?.dataset.v097Frame || null,
    detail: q('.se')?.dataset.v097Detail || null,
    changes: [...changes.values()], bounds, locations: E.S()?.locations,
    scaleBasis: 'alpha>96 crown-to-foot, shared existing floor; Hart 1.025 relative stature',
    noStoryArrayEdits: true
  });
})();
