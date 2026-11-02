/* Between Tides: one Lantern exterior, native location and bounded composition.
 * Only presentation metadata changes. Every story object, array index, choice,
 * hotspot visit and save pointer remains in its authored place.
 */
(() => {
  'use strict';
  const E = globalThis.StoryEngine;
  if (!E?.plugin || E.plugins?.['bt-lantern-stage']) return;
  if (typeof document === 'undefined' && !E.mech && typeof E.S !== 'function') return;

  const FRONT = 'lantern-front', YARD = 'lantern-yard';
  const PARKED = 'lantern-night-parked', EMPTY = 'lantern-night-empty';
  const LATE = 'lantern-bottle-gone';
  const text = st => st?.n?.en || st?.think?.en || st?.en || '';
  // Measured on the accepted canonical 941 × 1672 portrait. Both daytime
  // views share this physical arrangement; the phone box never changes side.
  const regions = {
    'bt-lantern-phonebox': [10, 48, 13, 20],
    'bt-lantern-door': [36, 49, 11, 18],
    'bt-lantern-landrover': [58, 56, 30, 14],
    'bt-lantern-facade': [5, 34, 90, 40],
    'bt-lantern-context': [3, 33, 94, 42],
    'bt-lantern-night-context': [0, 33, 100, 43],
  };
  const nightRegions = { 'bt-lantern-gideon': [3, 59, 48, 14] };
  const composition = (focus = 'bt-lantern-facade', night = false) => ({
    focus, context: night ? 'bt-lantern-night-context' : 'bt-lantern-context', zoom: 1,
  });
  const exterior = (st, scene, focus, night = false) => {
    if (!st) return;
    if (scene) st.scene = scene;
    st.actionFrame = composition(focus, night);
    // Native actionFrame keeps this semantic focus for resume without the
    // separate inspection zoom that previously cropped the vehicle away.
    st.look = focus || 'bt-lantern-facade';
  };
  const interior = st => {
    if (!st) return;
    st.scene = LATE; st.actionFrame = null; st.look = null;
  };
  const install = () => {
    const S = E.S();
    if (S?.id !== 'between-tides') return;
    const name = S.scenes.lantern.name;
    if (S.nodes?.c5_vigil || S.nodes?.c6_open) {
      // Same painted room and coordinates, after the bottle was seized.
      // Ch5's empty declaration makes the new art a first-use chapter asset.
      S.scenes[LATE] = { ...S.scenes.lantern, ...S.scenes[LATE] };
      const base = E.regionsAll?.lantern || {};
      E.regions({ [LATE]: { ...base,
        size: [...(base.size || [941, 1672])],
        r: JSON.parse(JSON.stringify(E.regionsOf?.('lantern') || base.r || {})),
      } });
    }
    for (const [id, time] of [[FRONT, '17:10'], [YARD, undefined], [PARKED, '01:45'], [EMPTY, '02:21']]) {
      S.scenes[id] = { ...S.scenes[id], kind: 'village', name, time, amb: 'sea', fit: 'contain' };
    }
    const data = {};
    for (const id of [FRONT, YARD, PARKED, EMPTY]) data[id] = {
      size: [941, 1672], fit: 'contain', r: { ...regions,
        ...(id === PARKED || id === EMPTY ? nightRegions : {}),
        phonebox: regions['bt-lantern-phonebox'], door: regions['bt-lantern-door'],
        landrover: regions['bt-lantern-landrover'],
      },
    };
    E.regions(data);

    const arrival = S.nodes?.c1_lantern;
    if (arrival) {
      const entry = arrival.find(st => st.shot === FRONT || st.bg === FRONT);
      if (entry) { delete entry.shot; entry.bg = FRONT; }
      exterior(arrival.find(st => text(st).startsWith('The Lantern is a low stone house')), FRONT);
      exterior(arrival.find(st => text(st).startsWith('A phone box stands beside the porch')), FRONT, 'bt-lantern-phonebox');
      exterior(arrival.find(st => text(st).startsWith('In the yard beside it stands an old Land Rover')), FRONT, 'bt-lantern-landrover');
    }

    const yard = S.places?.c1_bar?.views?.yard;
    if (yard) {
      yard.size = [941, 1672]; yard.fit = 'contain';
      for (const zone of yard.zones || []) {
        const focus = 'bt-lantern-' + zone.id;
        if (!regions[focus]) continue;
        zone.r = focus;
        for (const st of zone.then || []) if (st.n || st.think || st.say) exterior(st, null, focus);
      }
    }

    const vigil = S.nodes?.c5_vigil;
    if (vigil) {
      const entry = vigil.find(st => st.bg === 'lantern' || st.bg === LATE || st.bg === PARKED);
      if (entry) entry.bg = PARKED;
      const ambience = vigil.find(st => st.amb === 'room' || st.amb === 'sea');
      if (ambience) ambience.amb = 'sea';
      exterior(vigil.find(st => text(st).startsWith('The yard beside the porch is dark')), PARKED, null, true);
      exterior(vigil.find(st => text(st).startsWith('Quarter to two. The Lantern is still lit')), PARKED, 'bt-lantern-gideon', true);
      for (const branch of [vigil[7]?.then, vigil[7]?.else]) {
        for (const st of branch || []) if (st.think) exterior(st, PARKED, null, true);
      }
      interior(vigil.find(st => text(st).startsWith('Inside, a handful of people')));
    }

    const opening = S.nodes?.c6_open;
    if (opening) {
      const entry = opening.find(st => st.bg === 'lantern' || st.bg === LATE || st.bg === EMPTY);
      if (entry) entry.bg = EMPTY;
      exterior(opening[7], EMPTY, 'bt-lantern-door', true);
      exterior(opening[8], EMPTY, 'bt-lantern-landrover', true);
      for (const branch of [opening[9]?.then, opening[9]?.else]) {
        for (const st of branch || []) if (st.n) exterior(st, EMPTY, null, true);
      }
      interior(opening[10]);
    }
  };
  E.plugin({ id: 'bt-lantern-stage', on: { boot: install, chapter: install }, setup() {
    // Old saves can resume mid-line with the previous room ID. Let the native
    // scene renderer own the transition and stored presentation; never use
    // global chapter completion to change an earlier chapter's bottle.
    const nativeScene = E.ui?.scene;
    if (nativeScene) E.ui.scene = function (id, ...args) {
      const late = E.S()?.id === 'between-tides' && Number(E.R()?.ch) >= 5 && E.S().scenes?.[LATE];
      return nativeScene.call(this, late && id === 'lantern' ? LATE : id, ...args);
    };
  } });
  E.btLanternStage = { install, regions, nightRegions, sceneIds: { front: FRONT, yard: YARD, parked: PARKED, empty: EMPTY, lateInterior: LATE } };
})();
