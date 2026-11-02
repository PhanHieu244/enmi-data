// Between Tides save lineage bridge. Engine 1.0.4 owns snapshots, storage,
// resume and the menu; this adapter retains the released JSON save format.
(() => {
  "use strict";
  const E = globalThis.StoryEngine;
  if (!E?.plugin || E.plugins?.["bt-native-v104-save"] || typeof E.snapshot !== "function") return;
  const ID = "between-tides", clone = value => JSON.parse(JSON.stringify(value));
  const nativeSnapshot = E.snapshot;
  let savedPreferences = false;

  // The native boot merges defaults into G.set. Read only whether preferences
  // already existed before that merge, so the BT first-run language defaults
  // cannot replace an existing player's explicit settings. Writes remain in E.save.
  const boot = E.boot;
  E.boot = async function (...args) {
    savedPreferences = false;
    if (!new URLSearchParams(location.search).get("reset")) {
      try {
        const sdk = globalThis.Enmi;
        const global = sdk ? (await sdk.load())?.["se." + ID + ".g"]
          : JSON.parse(localStorage.getItem("se." + ID + ".g") || "null");
        savedPreferences = !!global?.set && typeof global.set === "object" && !Array.isArray(global.set);
      } catch { /* Unavailable storage uses the engine's normal defaults. */ }
    }
    return boot.apply(this, args);
  };

  E.btPersistence = {
    hasSavedPreferences: () => savedPreferences,
    // During overview, the native snapshot reads the preserved stored run.
    // Keep the unconverted revision available to the lineage playCh adapter.
    getRun: () => clone(nativeSnapshot.call(E)),
    persist() { const run = E.snapshot(); E.save(); return clone(run); },
    async prepareSave(data) {
      const lastChapter = Math.max(1, ...(E.S().chapters || []).map(chapter => chapter.ch));
      if (!(await E.loadUpTo(lastChapter))) throw Error("Chapter data could not be loaded. Your save is unchanged. · Chưa nạp được chương; bản lưu được giữ nguyên.");
      const compat = E.btSaveCompat, nextGlobal = clone(data.global);
      const nextRun = compat.migrate(data.run);
      compat.migrateGlobal(nextGlobal, true);
      data.run = nextRun; data.global = nextGlobal;
    },
  };

  const controls = host => {
    if (!host || host.querySelector("[data-bt-save-transfer]")) return;
    const section = document.createElement("div");
    section.className = "se-og"; section.dataset.btSaveTransfer = "";
    section.innerHTML = '<h4>Save file · Tệp lưu</h4><div class="se-row"><button type="button" class="se-btn" data-export>Export save · Xuất bản lưu</button><button type="button" class="se-btn" data-import>Import save · Nhập bản lưu</button></div>';
    section.querySelector("[data-export]").onclick = () => E.btSaveTransfer.exportSave();
    section.querySelector("[data-import]").onclick = () => E.btSaveTransfer.importSave();
    host.append(section);
  };
  E.plugin({ id: "bt-native-v104-save", on: { boot() {
    if (E.S()?.id !== ID) return;
    const menu = E.ui.menu, title = E.ui.title;
    E.ui.menu = function (...args) {
      const result = menu.apply(this, args);
      controls(document.querySelector(".se-sheet:not([hidden]) .se-shb"));
      return result;
    };
    E.ui.title = function (...args) {
      const result = title.apply(this, args);
      controls(document.querySelector(".se-ov [data-opts]"));
      return result;
    };
  } } });
})();
