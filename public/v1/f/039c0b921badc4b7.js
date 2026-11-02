/* Between Tides 1.0.4: authored foreground pictures use the shared detail beat.
 * Run after the approved staging projections. Paths, line objects, text,
 * conditions and rewards are unchanged. Scene shots and action cues keep their
 * native surfaces. The shared engine alone owns reveal/continue/exit/cancel.
 */
(() => {
  'use strict';
  const E = globalThis.StoryEngine;
  if (!E?.plugin || E.plugins?.['bt-native-v104-details']) return;
  // Enumerated from the six-chapter effective source of the approved release.
  // These exact art states are intentional: intact/damaged label, pocket
  // before/after the vial, bagged evidence, and the two different cuffs.
  const details = [
    ['nodes.c1_open.36', 'it-claimfile'],
    ['nodes.c1_open.37', 'it-claimfile'],
    ['nodes.c1_lantern.20', 'cg-nell-tea'],
    ['nodes.c1_lantern.27', 'act-jumper'],
    ['nodes.c1_lantern.28.choice.0.then.3', 'cg-nell-hug'],
    ['nodes.c1_fergus.5', 'act-label-clean'],
    ['nodes.c1_fergus.18', 'lantern-bar'],
    ['nodes.c1_fergus.19', 'act-hatch-open'],
    ['nodes.c1_evening.23', 'cg-gideon-tom'],
    ['nodes.c1_evening.39', 'act-bell-duck'],
    ['nodes.c1_evening.42', 'act-nell-pour'],
    ['nodes.c1_evening.52', 'cg-tom-pass'],
    ['nodes.c1_bell.51', 'act-cuff'],
    ['nodes.c2_open.14', 'act-flask'],
    ['nodes.c2_bar.28', 'act-phonebox'],
    ['nodes.c2_harbour.29', 'act-lamp-wave'],
    ['nodes.c2_cottage.17.explore.spots.5.then.3', 'act-prints'],
    ['nodes.c2_cottage.17.explore.spots.6.then.0', 'act-tyres'],
    ['nodes.c2_slip.28', 'act-pocket-before'],
    ['nodes.c2_slip.29', 'act-pocket-before'],
    ['nodes.c2_slip.30', 'act-pocket'],
    ['nodes.c3_seat.9', 'act-cutting'],
    ['nodes.c3_fergus.26', 'act-bottle-hand'],
    ['nodes.c3_fergus.27', 'act-label'],
    ['nodes.c3_pocket.3', 'act-pocket-bagged'],
    ['nodes.c3_pocket.7.explore.spots.3.then.0', 'it-vial'],
    ['nodes.c4_open.43.choice.0.then.0.then.2', 'act-phonebox'],
    ['nodes.c4_cottage.16.explore.spots.1.then.3', 'act-1471'],
    ['nodes.c4_cottage.16.explore.spots.1.then.5', 'act-1471'],
    ['nodes.c4_boat.24.choice.1.then.9', 'act-logbook'],
    ['nodes.c4_boat.24.choice.1.then.10', 'act-logbook'],
    ['nodes.c4_boat.24.choice.1.then.11', 'act-logbook'],
    ['nodes.c5_after.18', 'act-turnback'],
    ['nodes.c5_after.24', 'act-missed'],
    ['nodes.c5_book.13', 'act-logbook'],
    ['nodes.c5_book.32', 'act-mapx'],
    ['nodes.c5_dunes.15.explore.spots.0.then.1', 'act-pegs'],
    ['nodes.c5_dunes.20', 'act-skerry'],
    ['nodes.c5_dunes.72.then.3', 'act-cuff-callum'],
    ['nodes.c5_yard.4.then.4', 'act-bonnet'],
    ['nodes.c5_yard.4.else.3', 'act-bonnet'],
    ['nodes.c5_card.1', 'act-card'],
    ['nodes.c5_jumper.7', 'act-cuff-callum'],
    ['nodes.c6_channel.4', 'cg-confront'],
    ['nodes.c6_channel.9.else.1', 'cg-confront-callum'],
    ['nodes.c6_too_late.8', 'cg-e2-channel'],
    ['places.c1_bar.views.bar.people.0.talk.topics.1.then.5', 'cg-fergus-toast'],
    ['places.c1_bar.views.shelf.zones.0.then.0.else.1.choice.0.then.8', 'cg-fergus-glare'],
    ['places.c1_island.views.priory.people.0.talk.hello.5', 'cg-leo-licence'],
  ];
  const mapped = new WeakSet();
  const lookup = path => path.split('.').reduce((v, key) => v?.[key], E.S());
  const install = () => {
    if (E.S()?.id !== 'between-tides') return;
    for (const [path, art] of details) {
      const step = lookup(path);
      if (!step) continue; // A later chapter has not been downloaded yet.
      if (step.overlay?.art === art && step.pic == null) { mapped.add(step); continue; }
      if (step.pic !== art || !['n', 'say', 'think'].some(k => Object.hasOwn(step, k))) {
        console.warn('[Between Tides] Detail mapping needs review:', path, art);
        continue;
      }
      delete step.pic;
      step.overlay = { art, detail: true };
      mapped.add(step);
    }
  };
  // A released save may still carry fx.js's presentation-only R.pic. When
  // that exact authored beat is now a native detail, restoring the old pic
  // would briefly draw a second, independently fading copy. Clear only this
  // matching live presentation field before delegating native restoration;
  // the saved authored cursor recreates the shared detail without replaying
  // rewards. Unrelated art, saved cursors and all progress stay untouched.
  const restore = E.ui.restore;
  E.ui.restore = function (...args) {
    const run = E.R(), frame = run?.stack?.at(-1);
    const step = frame && E.walk?.(frame)?.[frame.i];
    if (E.S()?.id === 'between-tides' && typeof run.pic === 'string' &&
        mapped.has(step) && step.overlay?.art === run.pic) run.pic = null;
    return restore.apply(this, args);
  };
  E.plugin({ id: 'bt-native-v104-details', on: { boot: install, chapter: install } });
  E.btNativeDetails = Object.freeze({ install, paths: details.map(([path, art]) => Object.freeze({ path, art })) });
})();
