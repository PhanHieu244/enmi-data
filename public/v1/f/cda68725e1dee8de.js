// Between Tides — adapter cho giao diện mobile v07; nạp TRƯỚC mobile-base.js.
// Không sửa engine/SDK. Chỉ dùng E.boot, E.snapshot và các hàm MobileVN công khai.
(() => {
  "use strict";
  const E = globalThis.StoryEngine, ID = "between-tides", KEY = "se." + ID;
  if (!E?.plugin || E.plugins?.["bt-mobile-compat"]) return;
  const clone = x => x == null ? x : JSON.parse(JSON.stringify(x));
  let storedRun = null, storedGlobal = null;
  const active = r => !!(r && (r.stack?.length || r.done));
  const ours = () => E.S()?.id === ID;
  const overview = () => document.querySelector(".se")?.dataset.m === "ov";
  const resetRequested = () => new URLSearchParams(location.search).has("reset");
  const remember = r => {
    if (!E.explore && r && Array.isArray(r.stack)) storedRun = clone(r);
    return r;
  };
  E.btPersistence = {
    getRun: () => clone(storedRun),
    observeRun: remember,
    hasSavedPreferences: () => !!storedGlobal?.set,
  };

  const boot = E.boot;
  E.boot = async function (...args) {
    storedRun = null; storedGlobal = null;
    // Enmi.load là API đọc. Giữ một bản sao để menu tổng quan không lưu NEW_R
    // rỗng của core lên lần chơi chính; core vẫn tự nạp/lưu bằng SDK của nó.
    if (!resetRequested() && (!args[0] || args[0].id === ID)) {
      try {
        if (globalThis.Enmi?.load) {
          const saved = await globalThis.Enmi.load();
          storedRun = clone(saved?.[KEY + ".r"] || null);
          storedGlobal = clone(saved?.[KEY + ".g"] || null);
        } else {
          storedRun = JSON.parse(localStorage.getItem(KEY + ".r") || "null");
          storedGlobal = JSON.parse(localStorage.getItem(KEY + ".g") || "null");
        }
      } catch { /* Core sẽ thực hiện luồng tải và báo lỗi của nền tảng. */ }
    }
    return boot.apply(this, args);
  };

  const snapshot = E.snapshot;
  E.snapshot = function (...args) {
    const run = snapshot.apply(this, args);
    if (!ours()) return run;
    if (overview() && !active(run) && active(storedRun)) return clone(storedRun);
    return remember(run);
  };

  E.plugin({ id: "bt-mobile-compat", on: { boot() {
    if (!ours()) return;
    // mobile-base khởi tạo mặc định lần đầu. Cài đặt đã được lưu trước đó phải
    // qua bước nâng cấp native của core, không bị giao diện mẫu đặt lại.
    if (storedGlobal?.set) E.G().set.vdNativeControls = true;
    const V = globalThis.MobileVN;
    if (!V || V.btSafeOverview) return;
    V.btSafeOverview = true;
    // Native snapshot biết lùi con trỏ ở lời thoại/cử chỉ chưa hoàn thành.
    // Không đọc lại localStorage cũ khi core đang dùng Enmi MEM.
    V.snapshot = () => E.snapshot();
  } } });
})();
