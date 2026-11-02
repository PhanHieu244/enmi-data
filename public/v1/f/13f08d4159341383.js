/* Reopen physical observations through the native read-only paper viewer.
 * First-visit actions, clues, inventory, flags and meaningful authored `again`
 * branches remain owned by the native place/explore mechanics.
 */
(() => {
  'use strict';
  const E = globalThis.StoryEngine;
  if (!E?.plugin || E.plugins?.['bt-revisit']) return;
  const installed = new WeakSet();
  const clone = x => JSON.parse(JSON.stringify(x));
  let count = 0;
  const textValue = x => x && typeof x === 'object' && typeof x.en === 'string';
  const observations = steps => {
    const lines = []; let title = null;
    for (const st of steps || []) {
      // Never flatten both sides of a condition, a choice or an investigation.
      // Everything shown here is an unconditional observation in this hotspot.
      if (st.if || st.choice || st.ask || st.go || st.talk || st.place || st.explore || st.compare || st.act) break;
      const line = st.n || st.think;
      if (textValue(line)) lines.push(clone(line));
      if (st.read) {
        const doc = typeof st.read === 'string' ? E.S().items?.[st.read]?.doc || E.S().docs?.[st.read] : st.read;
        if (!title && textValue(doc?.title)) title = clone(doc.title);
        for (const entry of doc?.lines || []) if (textValue(entry)) lines.push(clone(entry));
      }
    }
    return { lines, title };
  };
  const genericAgain = steps => Array.isArray(steps) && steps.length > 0 && steps.every(st =>
    Object.keys(st).every(k => ['n', 'think', 'on'].includes(k)) &&
    /already (?:checked|looked|read|seen)|nothing new/i.test(st.n?.en || st.think?.en || ''));
  const install = () => {
    if (E.S()?.id !== 'between-tides') return;
    const seen = new WeakSet();
    const walk = value => {
      if (!value || typeof value !== 'object' || seen.has(value)) return;
      seen.add(value);
      for (const group of [value.zones, value.spots]) if (Array.isArray(group)) for (const spot of group) {
        // Native place invokes `again` only once a widget has been solved.
        // Reopen its successful observation without replaying the gesture.
        const steps = spot.widget ? spot.widget.ok : spot.then;
        if (installed.has(spot) || !Array.isArray(steps) || spot.talk || spot.go) continue;
        installed.add(spot);
        if (spot.again && !genericAgain(spot.again)) continue;
        const { lines, title } = observations(steps);
        if (!lines.length) continue;
        spot.again = [{ read: { paper: 'report', hand: 'type', title: title || clone(spot.label || spot.name || { en: 'Observation', vi: 'Chi tiết đã ghi nhận' }), lines } }];
        count++;
      }
      for (const [key, child] of Object.entries(value)) if (key !== 'again') walk(child);
    };
    for (const key of ['nodes', 'places']) walk(E.S()[key]);
  };
  E.plugin({ id: 'bt-revisit', on: { boot: install, chapter: install } });
  E.btRevisit = { install, count: () => count };
})();
