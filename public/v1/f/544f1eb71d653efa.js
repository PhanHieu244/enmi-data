/* Keep the visible native location pill in sync with the native story clock.
 * No time arithmetic, story steps, flags, sound cues or save cursors change.
 */
(() => {
  'use strict';
  const E = globalThis.StoryEngine;
  if (!E?.plugin || E.plugins?.['bt-clock-header']) return;
  if (typeof document === 'undefined' && !E.mech && typeof E.S !== 'function') return;
  const nativeClock = E.mech?.clock, nativeTitle = E.mech?.title, nativeLocation = E.ui?.loc;
  if (typeof nativeClock !== 'function' || typeof nativeLocation !== 'function') return;
  const ours = () => E.S()?.id === 'between-tides';
  let titlePreview = null;
  // A scene may carry a nominal time for title/no-clock views. Once a run
  // clock exists, it is the current time and must win over that fallback.
  E.ui.loc = function (name, time) {
    const preview = titlePreview && titlePreview.run === E.R() && titlePreview.context.live?.()
      ? titlePreview.time : null;
    const current = ours() && (preview || E.R()?.clock?.t);
    return nativeLocation.call(this, name, current || time);
  };
  const sync = () => {
    if (!ours()) return;
    const R = E.R(), fallback = E.S()?.scenes?.[R?.scene]?.time;
    E.ui.loc(null, R?.clock?.t || (fallback ? E.nat(fallback) : ''));
  };
  E.plugin({
    id: 'bt-clock-header',
    mechs: {
      async clock(context) {
        await nativeClock(context);
        if (!context?.live || context.live()) sync();
      },
      async title(context) {
        const next = context.frame && E.walk?.(context.frame)?.[context.idx + 1];
        const time = next?.clock;
        if (!ours() || context.st.title?.ch || !/^\d{2}:\d{2}$/.test(time || '')) return nativeTitle(context);
        // A time card announces the next authored clock. Preview that label
        // only; native clock state/gates and its one SFX still change on the
        // following existing frame, never early and never twice.
        const token = { run: E.R(), context, time };
        titlePreview = token; sync();
        try { return await nativeTitle(context); }
        finally {
          if (titlePreview === token) {
            titlePreview = null;
            if (!context.live || context.live()) sync();
          }
        }
      },
    },
  });
  E.btClockHeader = { sync };
})();
