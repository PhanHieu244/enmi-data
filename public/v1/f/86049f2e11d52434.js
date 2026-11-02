// A checkpoint is entered before its scene is read. Recaps must wait for the
// supporting scene, using this run's milestones, never the global collection.
(() => {
  "use strict";
  const E = globalThis.StoryEngine;
  if (!E?.plugin || E.plugins?.["bt-recap-progress"]) return;
  const ID = "between-tides";
  const counts = { 1: 15, 2: 10, 3: 18, 4: 14, 5: 18, 6: 8 };
  const reached = (r, ...nodes) => nodes.some(n => !!r.passed?.[n] || r.stack?.some(f => f.n === n));
  // Only the normal chapter end certifies the whole chapter. The early Ch3
  // refuge ending does not certify the photographs, interviews or release.
  const finished = (r, ch) => Number(r.ch) > ch || r.done === "c" + ch + "_end";
  const after = (r, ch, ...nodes) => finished(r, ch) || reached(r, ...nodes);
  const c5AfterDunes = r => after(r, 5, "c5_yard", "c5_surgery", "c5_jumper", "c5_close")
    || !!r.f?.c5_helen_examined;
  const c5AfterYard = r => after(r, 5, "c5_surgery", "c5_jumper", "c5_close");
  const c5AfterMedical = r => after(r, 5, "c5_jumper", "c5_close");
  // Ordinals refer to authored recap rows, not runtime story frame indices.
  // A changed row count fails closed until this reviewed mapping is updated.
  const gates = {
    1: [
      r => after(r, 1, "c1_lantern"),
      r => after(r, 1, "c1_lantern"), r => after(r, 1, "c1_lantern"),
      r => after(r, 1, "c1_fergus", "c1_island", "c1_evening", "c1_bell"),
      r => after(r, 1, "c1_fergus", "c1_island", "c1_evening", "c1_bell"),
      r => after(r, 1, "c1_fergus", "c1_island", "c1_evening", "c1_bell"),
      ...Array.from({ length: 4 }, () => r => after(r, 1, "c1_island", "c1_evening", "c1_bell")),
      ...Array.from({ length: 3 }, () => r => after(r, 1, "c1_evening", "c1_bell")),
      r => after(r, 1, "c1_bell"), r => finished(r, 1),
    ],
    2: [
      r => after(r, 2, "c2_bar", "c2_harbour", "c2_cottage", "c2_leo", "c2_slip"),
      r => after(r, 2, "c2_cottage", "c2_leo", "c2_slip"),
      r => after(r, 2, "c2_cottage", "c2_leo", "c2_slip"),
      ...Array.from({ length: 3 }, () => r => after(r, 2, "c2_leo", "c2_slip")),
      r => after(r, 2, "c2_slip"), r => after(r, 2, "c2_slip"),
      r => finished(r, 2), r => finished(r, 2),
    ],
    3: [
      r => after(r, 3, "c3_station"), r => after(r, 3, "c3_station"),
      ...Array.from({ length: 4 }, () => r => after(r, 3, "c3_photo")),
      r => after(r, 3, "c3_fergus"),
      ...Array.from({ length: 5 }, () => r => after(r, 3, "c3_gideon")),
      ...Array.from({ length: 3 }, () => r => after(r, 3, "c3_pocket")),
      ...Array.from({ length: 3 }, () => r => finished(r, 3)),
    ],
    4: [
      ...Array.from({ length: 5 }, () => r => after(r, 4, "c4_cottage")),
      ...Array.from({ length: 3 }, () => r => after(r, 4, "c4_walk")),
      ...Array.from({ length: 3 }, () => r => after(r, 4, "c4_boat")),
      ...Array.from({ length: 3 }, () => r => finished(r, 4)),
    ],
    5: [
      ...Array.from({ length: 4 }, () => r => after(r, 5, "c5_book")),
      r => after(r, 5, "c5_vigil"),
      r => after(r, 5, "c5_dunes", "c5_wait", "c5_jumper", "c5_close"),
      ...Array.from({ length: 4 }, () => c5AfterDunes),
      r => finished(r, 5), c5AfterDunes,
      r => r.f?.dunes_with === "wait" ? finished(r, 5) : c5AfterYard(r),
      r => !!r.f?.c5_helen_examined,
      c5AfterMedical,
      r => after(r, 5, "c5_close"),
      r => finished(r, 5), r => finished(r, 5),
    ],
    6: [
      r => !!r.f?.c6_phone_verified,
      r => !!r.f?.c6_read_letter,
      r => reached(r, "c6_accuse"), r => reached(r, "c6_accuse"),
      // The usual poison admission and rinse admission are separate branches.
      // Wrongly accusing Callum has one later statement admitting both acts.
      r => !!r.f?.c6_tom_confession && (!!r.f?.c6_rinse_confession || r.f?.c6_wrong_accused === "callum"),
      r => !!r.f?.c6_anna_confession,
      r => r.f?.dunes_with === "wait",
      r => r.done === "e10_keeper",
    ],
  };
  E.plugin({ id: "bt-recap-progress", on: { boot() {
    if (E.S()?.id !== ID) return;
    const nativeRecap = E.recapOf, nativePanel = E.ui.panel;
    E.recapOf = function (r, upTo = 99) {
      if (E.S()?.id !== ID) return nativeRecap.call(this, r, upTo);
      const byChapter = {};
      for (const row of E.S().recap || []) (byChapter[row.ch] ||= []).push(row);
      return nativeRecap.call(this, r, upTo).filter(row => {
        const ch = Number(row.ch), rows = byChapter[ch];
        if (!r || ch > Number(r.ch || 0) || rows?.length !== counts[ch]) return false;
        const gate = gates[ch]?.[rows.indexOf(row)];
        // Previous chapters were completed on this route; retain authored
        // branch predicates. Current-chapter facts need the reviewed milestone.
        return typeof gate === "function" && (Number(r.ch) > ch || gate(r));
      });
    };
    E.ui.panel = function (...args) {
      const panel = nativePanel.apply(this, args);
      if (E.S()?.id !== ID) return panel;
      const ending = E.S().endings?.[E.R()?.done];
      const label = panel?.querySelector?.(".se-end > small");
      if (label && ending?.next) label.textContent = E.nat({ en: "CHAPTER COMPLETE", vi: "HOÀN THÀNH CHƯƠNG" });
      return panel;
    };
  } } });
})();
