/* Between Tides mix uses the supplied engine's gain and voice-ducking controls. */
(() => {
  "use strict";
  const E = globalThis.StoryEngine;
  if (!E?.plugin || E.plugins?.["bt-audio-mix"]) return;
  const preferences = () => {
    if (E.S()?.id !== "between-tides") return;
    const g = E.G().set;
    let changed = false;
    for (const [key, value] of [["ambLevel", .65], ["sfxLevel", .7]]) {
      if (g[key] == null || !Number.isFinite(Number(g[key]))) { g[key] = value; changed = true; }
    }
    if (changed) E.sound?.refresh?.();
  };
  E.plugin({ id: "bt-audio-mix", on: { boot() {
    const S = E.S();
    if (S?.id !== "between-tides") return;
    S.ambVol = { sea: .9, room: .8, pub: .8, hall: .85, hut: .9, harbour: .85, night: .8, rain: .75, ...S.ambVol };
    S.sfxVol = { bell: .7, phone: .75, phone_keys: .5, thunder: .65, sting: .7, beat: .8, wind: .8, car: .8, gulls: .8, ...S.sfxVol };
    preferences();
    E.sound?.refresh?.();
  }, step: preferences } });
})();
