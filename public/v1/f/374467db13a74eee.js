/* Vale 0.9.3 · authored direction.
 * Keep interpreter arrays, prose, awards and choice paths unchanged. A room
 * change belongs to a physical entrance; a conversation keeps its screen axis
 * and actor scale until a real action changes the shot.
 */
(() => {
  'use strict';
  const E = StoryEngine, V = ValeDemo, q = s => document.querySelector(s);
  const enabled = () => /^vale-dossiers(?:-|$)/.test(E.S()?.id || '');
  const at = (node, path) => path.reduce((value, key) => value?.[key], E.S()?.nodes?.[node]);
  const patch = (node, path, values) => {
    const step = at(node, path); if (step) Object.assign(step, values); return step;
  };
  const profile = (cast, frame, reedArt = 'reed-full') => ({ cast, frame, reedArt });
  const standingClient = profile(['reed', 'matthias'], 'standing', 'reed-writing-v091');
  const interview = profile(['reed', 'matthias'], 'interview', 'reed-writing-v091');
  const lydiaVisit = { ...profile(['reed', 'lydia'], 'standing'), stable: true };
  const yardVisit = { ...profile(['reed', 'elin'], 'standing'), stable: true };
  const finnVisit = { ...profile(['reed', 'finn'], 'standing'), stable: true, fullArt: { finn: 'finn-full' }, floor: .82 };
  const driverProp = 'v093-driver-at-horse';
  // The rest of the case uses the same explicit presence authoring as the
  // opening. A mentioned name is never a reason to put a body in the room.
  // These bodies have measured feet; the older Reed expression portraits do
  // not. Never stretch a waist-up expression over one of these full poses.
  const bodyArt = {
    reed: 'reed-full', finn: 'finn-full', bell: 'bell-full',
    celia: 'celia-full', hart: 'hart-full', c3_clerk: 'c3_clerk-full', c5_walker: 'c5_walker-full',
    lydia: 'lydia-full', rusk: 'rusk-full', ruth: 'ruth-full', owen: 'owen-full',
    elin: 'elin-full', ben: 'ben-full', nora: 'nora-full', dorn: 'dorn-full'
  };
  const feet = { reed: 1506, finn: 1488, bell: 1524, celia: 1519, hart: 1462,
    c3_clerk: 1493, c5_walker: 1497, lydia: 1520, rusk: 1509, ruth: 1519,
    owen: 1508, elin: 1516, ben: 1491, nora: 1526, dorn: 1509, matthias: 1521 };
  const reedBodies = new Set(['reed-full', 'reed-writing-v091', 'reed-offer-notebook-v091',
    'reed-candle-letters', 'reed-directory-read-v094', 'reed-directory-check-v094', 'reed-tea-v094']);
  const reedFeet = { 'reed-full': 1506, 'reed-writing-v091': 1505, 'reed-offer-notebook-v091': 1505,
    'reed-candle-letters': 1505, 'reed-directory-read-v094': 1505, 'reed-directory-check-v094': 1503, 'reed-tea-v094': 1505 };
  // These authored native cues need the hands and their actual book visible
  // while the player reads. A shorter scrollable reader leaves their world
  // coordinates untouched; moving or enlarging the people would break the
  // stable conversation frame. New prop cues can opt in explicitly.
  const handReaderFaces = new Set(['writing-v091', 'offer-notebook-v091', 'directory-read-v094', 'directory-check-v094']);
  const handReading = step => step?.valeActionReading === true || step?.motion?.actors?.some(actor =>
    actor.id === 'reed' && actor.frames?.some(frame => handReaderFaces.has(frame.face)));
  const exteriorFloors = new Set(['alder_lane', 'service_lane', 'wren_door', 'cab_stand', 'cab_stand_departed',
    'c2_lane_day', 'c2_front_day', 'c2_gate_day', 'c3_court', 'c4_steps', 'c4_lane',
    'c5_door', 'c5_corner', 'c5_corner_departed', 'c5_wren', 'c6_wren', 'p2_house',
    'p2_house_evening', 'p2_house_dawn', 'p3_stable', 'p3_yard', 'p3_moor', 'p3_hollow',
    'p3_dorn_yard', 'p3_dorn_gate_closed', 'p3_finish']);
  // Only these inspected paintings have this exact desk contour. Repaint the
  // original foreground in its original source plane; never put a generic
  // blur or an invented floor across an unknown room.
  const deskContours = {
    p3_office: 'polygon(0 52%,28% 50.5%,69% 52%,100% 57%,100% 100%,0 100%)'
  };
  for (const id of ['study', 'study_clear', 'study_by_lamp', 'c4_study', 'c5_study', 'p2_after'])
    deskContours[id] = 'polygon(0 70.2%,24% 71.5%,54% 73.3%,100% 76.3%,100% 100%,0 100%)';
  const laterProfile = (cast, frame = 'grounded') => ({
    ...profile(cast, frame), stable: true, fullArt: Object.fromEntries(cast.filter(id => bodyArt[id]).map(id => [id, bodyArt[id]]))
  });
  function direct(value, framing) {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) { for (const item of value) direct(item, framing); return; }
    // A choice echoes its selected line without emitting a new story step.
    // That echo belongs to the same authored conversation frame.
    if (value.n || value.say || value.think || value.choice) value.valeDirection = framing;
    for (const [key, child] of Object.entries(value)) {
      if (key === 'valeDirection' || key === 'motion') continue;
      if (child && typeof child === 'object') direct(child, framing);
    }
  }
  function span(node, from, to, cast, frame = 'grounded', placement = {}) {
    const steps = E.S().nodes?.[node]; if (!steps) return;
    const direction = { ...laterProfile(cast, frame), ...placement };
    // Chapter 6 explicitly describes the client arriving unmasked. The last
    // chapter-1 flag records him masking at the door; it is not a costume
    // instruction for this later visit and must not override the written scene.
    if (/^c6_/.test(node) && cast.includes('matthias')) direction.fullArt.matthias = 'matthias-unmasked';
    for (let i = from; i <= Math.min(to, steps.length - 1); i++) direct(steps[i], direction);
  }
  function presentAt(node, path, ids) {
    const step = at(node, path); if (!step) return;
    const prior = step.valePresence?.show || [];
    step.valePresence = { ...step.valePresence, show: [
      ...prior, ...ids.filter(id => !prior.some(p => p.id === id)).map((id, i) => ({ id, at: id === 'reed' ? 'l' : i ? 'r' : 'c' }))
    ] };
  }
  function installLaterDirection() {
    const S = E.S();
    const yard = S.nodes?.p3c1_open && globalThis.ValeV8Config?.contexts?.p3c1_open;
    if (yard && !yard.some(entry => entry.at === 27)) yard.push({ at: 27, present: ['reed', 'ben'] });
    // This table already records physical entrances, exits and remote voices.
    // Reuse those authored intervals for geometry, not for automatic spawning.
    for (const [node, entries] of Object.entries(globalThis.ValeV8Config?.contexts || {})) {
      if (!S.nodes?.[node]) continue;
      for (const [i, entry] of entries.entries())
        span(node, entry.at, (entries[i + 1]?.at ?? S.nodes[node].length) - 1, entry.present);
    }
    const conversations = {
      c2_bell: ['reed', 'bell'], c2_finn: ['reed', 'finn'], c3_hart_before: ['reed', 'hart'], c3_clerk_talk: ['reed', 'c3_clerk'],
      p2c1_lydia: ['reed', 'lydia'], p2c2_owen: ['reed', 'lydia', 'owen'], p2c2_ruth: ['reed', 'lydia', 'ruth'],
      p2c3_rusk: ['reed', 'lydia', 'rusk'], p3c1_ben: ['reed', 'ben', 'nora'], p3c1_nora: ['reed', 'ben', 'nora'],
      p3c3_nora: ['reed', 'ben', 'nora']
    };
    for (const [id, cast] of Object.entries(conversations)) {
      const talk = S.talks?.[id]; if (!talk) continue;
      const direction = laterProfile(cast, id === 'p2c1_lydia' ? 'medium' : 'grounded');
      // The topic/record picker is still the same conversation. Give its
      // parent the same authored profile so reload and menu phases cannot
      // fall back to a much larger portrait between two grounded lines.
      talk.valeDirection = direction;
      direct(talk, direction);
    }
    // These two original place owners keep their talk inline rather than in
    // S.talks. Their replies already have the authored Reed-only frame; the
    // picker must inherit that exact profile, including the go copy created
    // by native place normalization before or after this install hook.
    for (const [node, index, view, id] of [
      ['c1_open', 15, 'window', 'c1_reed_wait'],
      ['c1_departure', 9, 'cab', 'c1_reed_routes']
    ]) {
      const person = at(node, [index, 'place', 'views', view, 'people', 0]);
      if (person?.talk?.id !== id) continue;
      const direction = person.talk.topics?.flatMap(topic => topic.then || [])
        .find(step => step.valeDirection?.stable)?.valeDirection;
      if (!direction) continue;
      person.talk.valeDirection = direction;
      for (const step of person.go || [])
        if (step.talk?.id === id) step.talk.valeDirection = direction;
    }
    for (const place of Object.values(S.places || {})) for (const view of Object.values(place.views || {})) {
      const cast = [...new Set(['reed', ...(view.people || []).map(p => p.who).filter(id => S.chars[id])])];
      // Named place/topic arrays live outside nodes and therefore need their
      // own presentation metadata. Existing presence/remote filters still own
      // who can appear; the painting's interaction icons are not extra actors.
      direct(view, laterProfile(cast));
    }
    // Seated conversations without a matching seated cutout use an honest
    // medium group shot. Do not show standing legs or shrink one person to
    // imitate sitting. The camera and crop remain fixed through every reply.
    span('c1_departure', 3, 7, ['reed'], 'medium');
    span('p2c1_open', 13, 31, ['reed', 'lydia'], 'medium');
    span('c3_open', 41, 46, ['reed', 'celia', 'hart'], 'medium');
    span('c4_open_visit', 6, 16, ['reed', 'celia', 'hart'], 'medium');
    span('c4_open_explore', 0, 4, ['reed', 'celia', 'hart'], 'medium');
    span('c1_terms', 9, 13, ['reed'], 'grounded', { slots: [25] });
    // This line is about the bowl in her hands. Keep that complete contact
    // area above a short phone's reader, on the same yard floor throughout the
    // exchange; a technically visible head alone does not show the action.
    span('p3c3_open', 5, 10, ['reed'], 'grounded', { slots: [25], bodyHeight: .5 });
    // Explicit epilogue/departure boundaries. The old context may describe the
    // whole preceding conversation; an exited client must not become scenery.
    span('c6_truth', 6, 10, ['reed']);
    span('c6_delivery', 6, 9, ['reed']);
    span('c1_neighbourhood', 24, 24, ['reed']);
    span('p3c1_open', 27, 29, ['reed', 'ben']);
    // Confirmed entrances/companions after the native hide/explore boundary.
    // Every entry below was checked against the authored scene, not a search
    // for a character's name in a memory, letter, quotation or distant action.
    const entrances = [
      ['c2_call', [1], ['reed', 'celia']], ['c2_call', [8], ['reed', 'celia', 'hart']],
      ['c3_open', [11], ['reed', 'celia', 'hart', 'c3_clerk']], ['c3_open', [27], ['reed', 'celia', 'hart']],
      ['c4_open_visit', [1], ['reed', 'bell']], ['c4_open_visit', [6], ['reed', 'celia', 'hart']],
      ['c5_return', [1], ['bell']], ['c5_return', [12], ['reed']],
      ['c6_open', [5], ['reed', 'matthias']], ['c6_truth', [6], ['reed']],
      ['c6_open_file', [5], ['reed']], ['c6_terms', [6], ['reed', 'matthias', 'celia', 'hart', 'c3_clerk']],
      ['c6_terms', [19], ['reed']],
      ['p2c2_open', [14], ['reed', 'lydia']], ['p2c3_open', [4], ['reed', 'lydia', 'rusk']],
      ['p2c4_open', [14], ['reed', 'ruth']], ['p2c4_open', [28], ['reed', 'owen']],
      ['p2c5_withdraw', [2], ['reed', 'lydia', 'ruth']], ['p2c5_intervene', [2], ['reed', 'lydia', 'ruth']],
      ['p2c6_open', [4], ['reed', 'lydia', 'ruth']], ['p2c6_safe', [7], ['reed']],
      ['p2c6_intervention', [6], ['reed']],
      ['p3c3_open', [22], ['reed', 'elin']], ['p3c4_open', [12], ['reed', 'nora']],
      ['p3c1_open', [27], ['reed', 'ben']],
      ['p3c4_open', [30], ['reed', 'elin']], ['p3c5_open', [7], ['nora', 'dorn']],
      ['p3c5_open', [23], ['nora', 'dorn']], ['p3c5_true_route', [3], ['nora', 'elin', 'ben']],
      ['p3c5_true_route', [7], ['reed', 'elin', 'ben']], ['p3c5_late_route', [3], ['elin', 'ben']],
      ['p3c5_recovery_route', [7], ['reed', 'ben']]
    ];
    for (const [node, path, ids] of entrances) presentAt(node, path, ids);
  }
  // The anonymous flower carrier is scenery, not a new conversational cast
  // member. A completed/Skipped/restored cue leaves the flower picked up and
  // both temporary tracks gone. Replay uses the engine's same saved endpoint.
  const porterMotion = () => ({
    id: 'p1-v093-porter-rescues-flower', ms: 6200, peek: true,
    tracks: [
      { id: 'v093-porter', art: 'porter-flowers-v093', at: [-18, 59.8],
        w: 34, ar: 2 / 3, z: 3, remove: true, ease: 'linear', frames: [
          { offset: 0, at: [-18, 59.8], opacity: 0 },
          { offset: .12, at: [10, 59.8], opacity: 1 },
          { offset: .28, at: [49, 59.8], opacity: 1 },
          { offset: .38, at: [60, 59.8], opacity: 1 },
          { offset: .46, at: [42.2, 59.8], opacity: 1 },
          { offset: .50, art: 'porter-pickup-v093', at: [42.2, 60.44] },
          { offset: .63, art: 'porter-pickup-v093', at: [42.2, 60.44] },
          { offset: .68, art: 'porter-flowers-v093', at: [42.2, 59.8] },
          { offset: .78, at: [70, 59.8] },
          { offset: .97, at: [116, 59.8], opacity: 0 },
          { offset: 1, at: [120, 59.8], opacity: 0 }
        ] },
      { id: 'v093-fallen-flower', art: 'v093-white-blossom', at: [55, 53.5],
        w: 2.4, ar: 1, z: 4, remove: true, ease: 'ease-in', frames: [
          { offset: 0, at: [55, 53.5], opacity: 0 },
          { offset: .279, at: [55, 53.5], opacity: 0 },
          { offset: .28, at: [55, 53.5], opacity: 1 },
          { offset: .36, at: [55, 70.5], rotate: 75, opacity: 1 },
          { offset: .56, at: [55, 70.5], rotate: 75, opacity: 1 },
          { offset: .60, at: [55, 70], rotate: 50, opacity: 1 },
          { offset: .63, at: [55, 69.5], opacity: 0 },
          { offset: 1, opacity: 0 }
        ] }
    ]
  });
  function install() {
    if (!enabled()) return;
    const S = E.S();
    installLaterDirection();
    if (S.nodes.c1_arrival) {
      // The prior exploration can end at any angle. Returning an inspection
      // shot is not an entrance into the room: explicitly enter the study.
      // The existing physical-letter scene wrapper selects its exact state.
      const entrance = patch('c1_arrival', [3], {
        scene: 'study', look: null, actionFrame: null,
        valePresence: { show: [{ id: 'reed', at: 'l' }] }
      });
      if (entrance) delete entrance.shot;
      for (let i = 3; i <= 9; i++) direct(at('c1_arrival', [i]), standingClient);
      for (let i = 10; i < S.nodes.c1_arrival.length; i++) direct(at('c1_arrival', [i]), interview);
      for (const node of ['c1_account', 'c1_questions', 'c1_review']) direct(S.nodes[node], interview);
      for (let i = 0; i <= 3; i++) direct(at('c1_terms', [i]), interview);
      for (let i = 3; i <= 21; i++) direct(at('c1_neighbourhood', [i]), finnVisit);

      // This original plate actually includes the chair. It establishes the
      // sitting position without bending a standing sprite or inventing art.
      patch('c1_arrival', [10], {
        shot: 'act-mask-before', look: null,
        actionFrame: { focus: 'p1-action-focus', context: 'p1-action-context', zoom: 1.12 }
      });
      patch('c1_arrival', [11], { shot: null, look: null, actionFrame: null });

      const walk = at('c1_departure', [9, 'place']);
      if (walk?.views?.corner && walk.views.cab) {
        // The painted cab is to the left of the front-door view. Explicit
        // edges also make button and swipe navigation share the same axis.
        walk.ring = ['cab', 'corner'];
        walk.views.corner.left = 'cab'; walk.views.corner.right = null;
        walk.views.cab.left = null; walk.views.cab.right = 'corner';
        const reed = walk.views.cab.people?.find(p => p.who === 'reed');
        if (reed) reed.r = [27, 36, 30, 45];
        // The driver continues to tend his horse after the short action
        // insert. This is scenery, not an introduction or a new talk target.
        walk.views.cab.props = [
          ...(walk.views.cab.props || []).filter(p => p.id !== driverProp),
          { id: driverProp, art: 'finn-full', r: [45, 39, 23, 28], z: 1,
            if: s => !s.f.p1_finn_cab_departed }
        ];
      }
      patch('c1_neighbourhood', [3], { look: null, actionFrame: null,
        valeDirectionCleanup: { sceneProps: [driverProp] } });
    }
    const clock = S.places?.c3_church?.views?.court?.zones?.find(z => z.id === 'church_clock');
    if (clock) {
      clock.artR = [44.8, 15.2, 9.4, 6.27]; clock.glint = false;
      if (clock.then?.[0]) Object.assign(clock.then[0], { look: null, motion: porterMotion() });
    }
    // Equivalent first meetings: the two people remain on their authored
    // sides. Candle/mail and stable-action shots keep their existing staging.
    if (S.nodes.p2c1_open) {
      // The original narration already describes this woman before the
      // following show step. Move only that authored presence boundary.
      const entry = globalThis.ValeV8Config?.contexts?.p2c1_open?.find(c => c.at === 9 && c.present.includes('lydia'));
      if (entry) entry.at = 8;
      patch('p2c1_open', [8], { valePresence: { show: [{ id: 'reed', at: 'l' }, { id: 'lydia', at: 'r' }] } });
      for (let i = 8; i <= 12; i++) direct(at('p2c1_open', [i]), lydiaVisit);
    }
    if (S.nodes.p3c1_open) for (let i = 7; i <= 16; i++) direct(at('p3c1_open', [i]), yardVisit);
  }

  E.side('valeDirectionCleanup', async value => {
    if (!enabled() || !value) return;
    const saved = E.R().sceneProps;
    if (saved && value.sceneProps?.length) {
      E.ui.sceneProps(saved.img, saved.items.filter(p => !value.sceneProps.includes(p.id)));
    }
  });

  // This is foreground framing only. It never moves the background camera,
  // derives presence from a mentioned name, or duplicates an actor in action
  // art. It is recomputed from the active authored step after save/resume.
  const originals = new WeakMap();
  let frame = 0, current = null;
  function clearFraming() {
    cancelAnimationFrame(frame); frame = 0; current = null;
    const root = q('.se'); if (!root) return;
    delete root.dataset.v093Direction;
    delete root.dataset.v094Grounded;
    delete root.dataset.v095ActionReading;
    root.querySelector('.v094-foreground')?.remove();
    for (const el of root.querySelectorAll('.se-ch')) {
      el.classList.remove('v093-posed', 'v094-body', 'v094-body-face', 'v094-out-of-frame');
      for (const art of el.querySelectorAll('.se-chi > .ii')) {
        art.classList.remove('v094-incompatible');
        if (art.classList.contains('v094-tea-body')) art.classList.remove('v094-tea-body', 'im-reed-tea-v094');
        const previous = originals.get(art);
        if (!previous) continue;
        if (previous.replaced) art.className = previous.cls;
        art.style.backgroundSize = previous.size;
        art.style.backgroundPosition = previous.position;
        originals.delete(art);
      }
    }
  }
  function remember(art) {
    if (!originals.has(art)) originals.set(art, {
      cls: art.className, size: art.style.backgroundSize, position: art.style.backgroundPosition
    });
  }
  function positionCast() {
    const root = q('.se'); if (!root || !current) return;
    const rr = root.getBoundingClientRect();
    const landscape = current.stable && matchMedia('(min-width:600px) and (max-height:500px)').matches;
    const castWidth = root.clientWidth * (landscape ? .52 : 1);
    const viewState = E.R().vw, view = viewState && E.S().places?.[viewState.pid]?.views?.[viewState.v];
    if (current.stable && view) {
      const image = (typeof view.img === 'function' ? view.img(E.state()) : view.img) || viewState.v;
      const shownImage = E.curImg();
      if (shownImage === image || shownImage.startsWith(image + '--')) {
        // Native place framing is transient, while its return address is
        // saved. Recompute that same authored region frame on resume/rotate
        // instead of centering the painting or retaining stale pixel offsets.
        // Use the native place margins, never the changing reader rectangle.
        E.ui.frame(shownImage, [...(view.zones || []), ...(view.people || [])]
          .map(region => E.regionOf(shownImage, region.r)?.box), { top: 64, bottom: 150 });
      }
    }
    const bars = [q('.se-top'), q('.v8-contextbar'), ...(!current.stable ? [q('.lf-hud')] : [])].filter(el =>
      el && !el.hidden && getComputedStyle(el).display !== 'none');
    // Reserve the existing scene-control row before its button is mounted.
    // Waiting for that button's next paint lets it cover a medium-shot face.
    const safeTop = Math.max(0, ...bars.map(el => el.getBoundingClientRect().bottom - rr.top)) + (current.stable ? 62 : 10);
    const wide = current.frame === 'standing' || current.frame === 'seated' || current.frame === 'grounded';
    const count = current.actors.length;
    const plane = E.coverBox(E.curImg());
    const contour = current.stable && deskContours[E.curImg()];
    if (contour) {
      let foreground = root.querySelector('.v094-foreground');
      if (!foreground) {
        foreground = document.createElement('i'); foreground.setAttribute('aria-hidden', 'true');
        root.querySelector('.se-stage').append(foreground);
      }
      foreground.className = 'v094-foreground ii im-' + E.curImg();
      Object.assign(foreground.style, { left: plane.x + 'px', top: plane.y + 'px', width: plane.w + 'px', height: plane.h + 'px', clipPath: contour });
    } else root.querySelector('.v094-foreground')?.remove();
    const authoredFloor = current.floor || (current.stable ? exteriorFloors.has(E.curImg()) ? .82 : .74 : current.cast.includes('elin') ? .82 : .74);
    const floor = current.stable ? Math.min(root.clientHeight * .86, Math.max(safeTop + 100, plane.y + plane.h * authoredFloor))
      : plane.y + plane.h * authoredFloor;
    // A group may overlap at the shoulders like people standing together.
    // Fitting five whole rectangular canvases side by side makes the people
    // miniature and pushes every face below a normal narration panel.
    const groupHeight = current.stable && count > 2 ? castWidth * (count >= 5 ? .70 : count === 4 ? .76 : .86) : Infinity;
    const height = wide ? Math.max(current.stable ? 100 : 140, Math.min(plane.h * (current.bodyHeight || .4), current.stable ? root.clientHeight * Math.max(.44, current.bodyHeight || 0) : Infinity, groupHeight, floor - safeTop))
      : Math.max(140, root.clientHeight - safeTop);
    const top = wide ? floor - height : safeTop;
    root.style.setProperty('--v093-cast-top', top + 'px');
    root.style.setProperty('--v093-cast-height', height + 'px');
    const slots = current.slots || (current.stable ? ({ 1: [50], 2: [25, 70], 3: [18, 50, 82], 4: [18, 39, 61, 82], 5: [16, 33, 50, 67, 84] }[Math.min(count, 5)] || [50]) : count > 1 ? [25, 70] : [50]);
    for (const [i, el] of current.actors.entries()) {
      el.style.setProperty('--v093-cast-left', (slots[i] ?? 50) + '%');
      el.style.setProperty('--v093-cast-width', (count > 1 ? 60 : 90) + '%');
      const reed = current.stable && el.dataset.id === 'reed';
      if (reed) {
        const face = el.querySelector('.se-chi > .ii.f');
        const compatible = !!face && ([...face.classList].some(c => c.startsWith('im-') && reedBodies.has(c.slice(3)) && E.artReal(c)) || face.classList.contains('im-reed-tea') && E.artReal('im-reed-tea-v094'));
        el.classList.toggle('v094-body-face', compatible);
      }
      for (const art of el.querySelectorAll('.se-chi > .ii')) {
        remember(art);
        if (reed) {
          if (art.classList.contains('im-reed-tea') && E.artReal('im-reed-tea-v094')) art.classList.add('v094-tea-body', 'im-reed-tea-v094');
          const compatible = [...art.classList].some(c => c.startsWith('im-') && reedBodies.has(c.slice(3)));
          art.classList.toggle('v094-incompatible', !compatible && [...art.classList].some(c => c.startsWith('im-reed')));
        }
        if (wide) {
          const seated = art.className.includes('matthias-seated');
          const factor = seated ? .88 : 1;
          const scale = height / 1536 * factor;
          // Fullbody variants can preserve their photographed floor without
          // changing the actor slot or scale. Anchors are source pixels on
          // the shared 1024×1536 body canvas; malformed values fall back to
          // the existing per-person anchors.
          const bodyFeet = E.S().chars?.[el.dataset.id]?.bodyFeet;
          const validFoot = value => Number.isFinite(value) && value > 0 && value <= 1536;
          const artIds = [...art.classList].filter(c => c.startsWith('im-')).map(c => c.slice(3));
          const authoredFoot = artIds.map(id => bodyFeet?.[id]).find(validFoot);
          const poseFoot = authoredFoot || (reed ? artIds.map(id => reedFeet[id]).find(validFoot) : null);
          const foot = seated ? 1439 : current.stable ? poseFoot || feet[el.dataset.id] || 1520 : el.dataset.id === 'reed' ? 1505 : 1520;
          art.style.backgroundSize = `${1024 * scale}px ${1536 * scale}px`;
          art.style.backgroundPosition = `50% ${height - foot * scale}px`;
        } else if (current.stable && current.frame === 'medium') {
          // A medium composition uses one fixed image scale for every person.
          // Its lower canvas extends beneath the reader/viewport, so no alpha
          // ramp or severed portrait edge is exposed when text gets shorter.
          const imageHeight = root.clientHeight * 1.06;
          art.style.backgroundSize = `${imageHeight * 2 / 3}px ${imageHeight}px`;
          art.style.backgroundPosition = '50% 0';
        } else {
          art.style.backgroundSize = '250% auto'; art.style.backgroundPosition = '50% 0';
        }
      }
    }
  }
  function applyFraming(line) {
    clearFraming();
    if (!enabled()) return;
    const active = V.active, R = E.R(), root = q('.se');
    const step = active ? E.walk({ n: active.n, p: JSON.parse(active.p) })?.[active.i] : null;
    const talk = typeof step?.talk === 'string' ? E.S().talks?.[step.talk] : step?.talk;
    const d = step?.valeDirection || talk?.valeDirection, context = V.v8Debug?.().context;
    // A place keeps R.vw while its person/topic/inspection child is reading:
    // it is the return address, not proof that the exploration UI is active.
    // Honor the child's authored frame and keep the saved place untouched.
    const readingStep = !!(step?.n || step?.say || step?.think || step?.choice || talk?.valeDirection);
    if (!d || !root || R.shot || R.cg || R.look || R.actionFrame || R.vw && !readingStep) return;
    const present = new Set((context?.present || []).filter(id => !context.remote?.[id]));
    const actors = d.cast.filter(id => present.has(id) && R.cast?.[id])
      .map(id => root.querySelector('.se-ch[data-id="' + CSS.escape(id) + '"]')).filter(Boolean);
    if (!actors.length) return;
    const seatedArt = R.f.matthias_masked === false ? 'matthias-seated-unmasked-v093' : 'matthias-seated-v093';
    const seated = d.frame === 'interview' && actors.some(el => el.dataset.id === 'matthias') && E.artReal('im-' + seatedArt);
    current = { ...d, frame: seated ? 'seated' : d.frame, actors };
    root.dataset.v093Direction = current.frame;
    if (current.stable) {
      root.dataset.v094Grounded = current.frame;
      if (handReading(step)) root.dataset.v095ActionReading = 'true';
      for (const el of root.querySelectorAll('.se-ch')) {
        el.classList.toggle('v094-out-of-frame', !actors.includes(el));
        el.classList.toggle('v094-body', actors.includes(el));
      }
    }
    root.dataset.stage = actors.length > 1 ? 'ensemble' : 'focus';
    const reed = actors.find(el => el.dataset.id === 'reed');
    if (reed) {
      const base = reed.querySelector('.se-chi > .ii:not(.f)');
      if (base) {
        remember(base);
        originals.get(base).replaced = true;
        base.className = 'ii im-' + d.reedArt;
        // A full action pose carries its real held objects. Keep the existing
        // candle/mail expression when present; the notebook pose owns its face.
        if (d.reedArt === 'reed-writing-v091') reed.classList.add('v093-posed');
      }
    }
    if (seated) {
      const king = actors.find(el => el.dataset.id === 'matthias');
      const base = king?.querySelector('.se-chi > .ii:not(.f)');
      if (base) { remember(base); originals.get(base).replaced = true; base.className = 'ii im-' + seatedArt; king.classList.add('v093-posed'); }
    }
    for (const [id, art] of Object.entries(d.fullArt || {})) {
      const actor = actors.find(el => el.dataset.id === id), base = actor?.querySelector('.se-chi > .ii:not(.f)');
      if (base && E.artReal('im-' + art)) {
        remember(base); originals.get(base).replaced = true; base.className = 'ii im-' + art;
        if (!d.stable) actor.classList.add('v093-posed');
      }
    }
    positionCast();
    frame = requestAnimationFrame(positionCast);
  }
  const line = E.ui.line;
  E.ui.line = value => { const pending = line(value); applyFraming(value); return pending; };
  const show = E.ui.show;
  E.ui.show = (...args) => {
    const result = show(...args);
    // Native motion updates expressions through show(). Recompute the pose in
    // the same frame; a full-body notebook/directory cue must not flash a
    // portrait, lose its feet or wait for the next spoken line to settle.
    if (current?.stable && current.cast.includes(args[0])) {
      applyFraming();
    }
    return result;
  };
  // A stable landscape frame owns a narrower scene plane. Release it only
  // after the engine has frozen the outgoing image, before it measures the
  // incoming plane; a pre-step reset would briefly expand the old painting.
  E.on('visual-transition-prepared', () => { if (current) clearFraming(); });
  E.on('step', (type, step) => {
    if (type === 'talk') {
      const talk = typeof step.talk === 'string' ? E.S().talks?.[step.talk] : step.talk;
      if (talk?.valeDirection) {
        // Native talk creates its picker (and an absent speaker) synchronously
        // after this hook. Retain the old frame now and rebind after that UI
        // is ready, only if this is still the same interpreter step.
        const active = V.active;
        if (current?.stable) applyFraming();
        queueMicrotask(() => { if (V.active === active) applyFraming(); });
        return;
      }
    }
    // Bookkeeping steps between two lines do not constitute a camera cut.
    // Keep later authored frames through choice panels and expression cues.
    if (current?.stable && /^(show|hide|set|if|item|drop|cp|prop|choice|sfx|wait)$/.test(type)) return;
    if (current?.stable && /^(bg|shot|cg)$/.test(type)) return;
    if (current?.stable && /^(place|explore)$/.test(type)) {
      // Re-entering an exploration of the same image may not create a layer
      // or emit the transition boundary. Its synchronous setup gets the first
      // chance to do so; otherwise clear before its deferred hotspot draw.
      const prior = current;
      queueMicrotask(() => { if (current === prior) clearFraming(); });
      return;
    }
    if (!/^(n|say|think)$/.test(type)) clearFraming();
  });
  E.on('end', clearFraming);
  const reset = E.ui.reset;
  E.ui.reset = (...args) => { clearFraming(); return reset(...args); };
  const card = E.ui.card;
  E.ui.card = (html, ms, cls) => {
    const pending = card(html, ms, cls);
    if (!enabled() || !String(cls || '').split(/\s+/).includes('chap')) return pending;
    const active = V.active, steps = active ? E.walk({ n: active.n, p: JSON.parse(active.p) }) : [];
    const next = steps?.slice((active?.i ?? -1) + 1, (active?.i ?? -1) + 6).find(st => typeof st.bg === 'string' || typeof st.scene === 'string');
    const img = next?.bg || next?.scene || E.curImg(), panel = q('.se-card');
    if (panel && E.artReal('im-' + img)) {
      const art = document.createElement('i'); art.className = 'v093-chapter-art ii im-' + img;
      art.setAttribute('aria-hidden', 'true'); panel.prepend(art);
      const prompt = document.createElement('span'); prompt.className = 'v093-chapter-prompt';
      prompt.textContent = E.nat({ en: 'Tap to continue', vi: 'Chạm để tiếp tục' }); panel.append(prompt);
    }
    return pending;
  };
  E.on('boot', () => {
    if (!enabled()) return;
    const style = document.createElement('style'); style.dataset.valeDirection = 'v093';
    style.textContent = `
      .se.vd[data-v093-direction] .se-chars{top:var(--v093-cast-top)!important;bottom:auto!important;height:var(--v093-cast-height)!important}
      .se.vd[data-v093-direction][data-stage] .se-chars .se-ch{top:0;bottom:0;height:100%;left:var(--v093-cast-left)!important;width:var(--v093-cast-width)!important;max-width:none;transform:translateX(-50%)!important}
      .se.vd[data-v093-direction] .se-chars .se-ch.on:not(.out){opacity:.88;filter:brightness(.9);transform:translateX(-50%)!important}
      .se.vd[data-v093-direction] .se-chars .se-ch.on.talk,.se.vd[data-v093-direction] .se-chars .se-ch.on.hold{opacity:1;filter:none}
      .se.vd[data-v093-direction] .se-chi>.ph{display:none}
      .se.vd[data-v093-direction] .se-ch.v093-posed .se-chi>.ii:not(.f){opacity:1!important;visibility:visible!important}
      .se.vd[data-v093-direction] .se-ch.v093-posed .se-chi>.ii.f{opacity:0!important;visibility:hidden!important}
      .se.vd[data-v094-grounded] .se-ch.v094-out-of-frame{visibility:hidden!important;pointer-events:none!important}
      .se.vd[data-v094-grounded] .se-ch.v094-body.on:not(.out){opacity:1;filter:brightness(.92)}
      .se.vd[data-v094-grounded] .se-ch.v094-body.on.talk,.se.vd[data-v094-grounded] .se-ch.v094-body.on.hold{filter:none}
      .se.vd[data-v094-grounded] .se-ch.v094-body .se-chi>.ii{-webkit-mask-image:none;mask-image:none}
      .se.vd[data-v094-grounded] .se-ch[data-id="reed"] .se-chi>.ii.v094-incompatible{opacity:0!important;visibility:hidden!important}
      .se.vd[data-v094-grounded] .se-ch[data-id="reed"]:not(.v094-body-face) .se-chi>.ii:not(.f):not(.fo):not(.bk):not(.v094-incompatible){opacity:1!important;visibility:visible!important}
      .se.vd[data-v094-grounded] .se-ch[data-id="reed"]:not(.v094-body-face) .se-chi>.ii.f{opacity:0!important;visibility:hidden!important}
      .se.vd[data-v094-grounded] .se-ch[data-id="reed"].v094-body-face .se-chi>.ii.f{opacity:1!important;visibility:visible!important}
      .se.vd[data-v094-grounded] .se-ch.v094-body .se-chi{transform-origin:50% 100%;animation:v094-body-breathe 6s ease-in-out infinite}
      .se.vd[data-v094-grounded] .se-box{max-height:44dvh}
      @media(max-width:599px) and (max-height:700px) and (orientation:portrait){
        .se.vd[data-v094-grounded][data-v095-action-reading] .se-box{max-height:max(196px,36dvh)}
      }
      @media(max-width:599px) and (orientation:portrait){
        .se.vd[data-v094-grounded] .se-panel.tk:has(.tk-l){max-height:max(260px,48dvh);padding-top:12px;grid-template-rows:auto minmax(0,1fr) auto}
        .se.vd[data-v094-grounded] .se-panel.tk .tk-l{min-height:0;max-height:none;overflow-y:auto;scrollbar-width:thin;scrollbar-color:#d6b878 #0b131b}
      }
      @keyframes v094-body-breathe{50%{transform:scaleY(1.002)}}
      .se.vd .v094-foreground{position:absolute;inset:auto;z-index:3;pointer-events:none;background-repeat:no-repeat;background-size:100% 100%;background-position:center;opacity:1;mask-image:none;-webkit-mask-image:none;animation:none}
      .se.vd:is([data-m="pl"],[data-m="xp"]) .v094-foreground{display:none}
      @media(min-width:600px) and (max-height:500px){
        .se.vd[data-v094-grounded]>.se-stage{width:52%;right:auto}
        .se.vd[data-v094-grounded] .se-chars{width:100%;right:0}
        .se.vd[data-v094-grounded] .se-box{left:calc(52% + 8px);right:8px;bottom:6px;max-height:calc(100dvh - 78px)}
        .se.vd[data-v094-grounded] .se-panel:is(.chs,.tk:has(.tk-l)){margin-left:52%;padding-inline:8px;max-height:calc(100dvh - 74px)}
        .se.vd[data-v094-grounded] .se-panel.tk:has(.tk-l){max-height:calc(100dvh - 44px);padding-top:12px;grid-template-rows:auto minmax(0,1fr) auto}
        .se.vd[data-v094-grounded] .se-panel.tk .tk-l{min-height:0;max-height:none;overflow-y:auto;scrollbar-width:thin;scrollbar-color:#d6b878 #0b131b}
        .se.vd[data-v094-grounded] .se-panel.tk:has(.tk-l) .tk-f .se-btn{padding-inline:8px}
        .se.vd[data-v094-grounded]>.se-motion-control{right:auto;left:calc(52% - 56px)}
      }
      .se.vd [data-scene-prop="church_clock"]{transform:matrix(.96,-.14,.04,1,0,0);transform-origin:50% 50%;filter:sepia(.13) brightness(.9) drop-shadow(1px 3px 2px #241d16b3)}
      .se.vd .se-card.chap{background:#161511;animation:se-fade .45s ease}
      .se.vd .se-card.chap .v093-chapter-art{position:absolute;inset:0;background-size:cover;background-position:50% 45%;background-repeat:no-repeat;opacity:.65}
      .se.vd .se-card.chap::before{inset:0;height:auto;z-index:1;background:linear-gradient(180deg,#0d171a88,#101719c2 45%,#131310c7);animation:none}
      .se.vd .se-card.chap::after{display:none}
      .se.vd .se-card.chap .se-ct{z-index:2;max-width:390px;animation:v093-chapter-in .65s ease-out both}
      .se.vd .se-card.chap .se-ct>*{animation:none!important}
      .se.vd .se-card.chap .se-ct small{font-size:12px;letter-spacing:.24em}
      .se.vd .se-card.chap .se-ct b{font-size:clamp(30px,8vw,38px);line-height:1.17;text-shadow:0 2px 8px #0008}
      .se.vd .se-card.chap .se-ct em{width:64px;height:1px;opacity:.8}
      .se.vd .se-card.chap .se-ct i{font-size:17px;color:#ded6c5}
      .se.vd .v093-chapter-prompt{position:absolute;bottom:max(28px,env(safe-area-inset-bottom));z-index:2;color:#dbd2bc;font:12px/1.4 system-ui;letter-spacing:.04em}
      @keyframes v093-chapter-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
      .se.vd.se-motion-reduced .se-card.chap,.se.vd.se-motion-reduced .se-card.chap .se-ct{animation:none}
      @media(prefers-reduced-motion:reduce){.se.vd .se-card.chap,.se.vd .se-card.chap .se-ct{animation:none}}
    `;
    // A precise 9:45 clock remains vector-authored. The small mounted dial
    // matches the wall plane; it is no longer an oversized flat yellow disc.
    const marks = Array.from({ length: 60 }, (_, i) => {
      const a = i * Math.PI / 30, r = i % 5 ? 45.5 : 42.5;
      return `<path d="M${60 + Math.sin(a) * r} ${60 - Math.cos(a) * r}L${60 + Math.sin(a) * 48} ${60 - Math.cos(a) * 48}" stroke-width="${i % 5 ? .55 : 1.2}"/>`;
    }).join('');
    const numerals = ['XII','I','II','III','IV','V','VI','VII','VIII','IX','X','XI'].map((n, i) => {
      const a = i * Math.PI / 6; return `<text x="${60 + Math.sin(a) * 35}" y="${63 + -Math.cos(a) * 35}">${n}</text>`;
    }).join('');
    const clock = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><radialGradient id="dial" cx=".35" cy=".25"><stop stop-color="#c8c1a4"/><stop offset=".72" stop-color="#a9a58d"/><stop offset="1" stop-color="#777966"/></radialGradient><linearGradient id="rim" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#5f5949"/><stop offset=".45" stop-color="#2f342d"/><stop offset=".7" stop-color="#77715a"/><stop offset="1" stop-color="#383b31"/></linearGradient></defs><circle cx="60" cy="60" r="58" fill="url(#rim)" stroke="#262c25" stroke-width="1.5"/><circle cx="60" cy="60" r="53" fill="url(#dial)" stroke="#8d866e" stroke-width="1.3"/><circle cx="60" cy="60" r="50" fill="none" stroke="#5c6051" stroke-width=".6"/><g stroke="#343a30" fill="none">${marks}</g><g fill="#34382e" font-family="Georgia,serif" font-size="9" text-anchor="middle">${numerals}</g><path d="M62 62L32.28 48.52L31 46L35 47L61 57z" fill="#272e27"/><path d="M61 62L15 60L61 58z" fill="#272e27"/><circle cx="60" cy="60" r="3.1" fill="#514d3d" stroke="#b6ab88" stroke-width=".7"/></svg>`;
    style.textContent += `.se.vd .im-vale-clock{background-image:url("data:image/svg+xml,${encodeURIComponent(clock)}")}`;
    document.head.append(style);
    const resize = new ResizeObserver(() => {
      if (!current) return; cancelAnimationFrame(frame); frame = requestAnimationFrame(positionCast);
    });
    for (const el of [q('.se'), q('.se-top'), q('.v8-contextbar'), q('.lf-hud')]) if (el) resize.observe(el);
    install(); queueMicrotask(install);
  });
  E.on('chapter', () => { install(); queueMicrotask(install); });
  V.v093Direction = () => ({ frame: q('.se')?.dataset.v093Direction || null,
    actors: current?.actors.map(el => el.dataset.id) || [] });
})();
