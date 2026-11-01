// JSON save transfer cho trình duyệt VÀ Enmi iframe không có localStorage.
// Ghi qua E.G/R + E.save của core; không ghi thẳng vào SDK hay reload trang.
(() => {
  "use strict";
  const E = globalThis.StoryEngine, V = globalThis.MobileVN, C = E?.btSaveCompat;
  if (!E?.plugin || !V || !C || E.plugins?.["bt-save-transfer"]) return;
  const clone = x => JSON.parse(JSON.stringify(x));
  const object = x => x && typeof x === "object" && !Array.isArray(x);
  const reject = (en, vi) => { throw Error(en + " · " + vi); };
  const safeKeys = x => {
    if (!x || typeof x !== "object") return;
    for (const [key, value] of Object.entries(x)) {
      if (["__proto__", "prototype", "constructor"].includes(key)) reject("Invalid save key", "Khóa bản lưu không hợp lệ");
      safeKeys(value);
    }
  };
  const validateRun = run => {
    if (!object(run) || !object(run.f) || !Array.isArray(run.stack) || !Array.isArray(run.items) || !Array.isArray(run.log)) reject("Invalid run data", "Dữ liệu lần chơi không hợp lệ");
    if (run.btRevision !== C.revision) reject("Unsupported story revision", "Phiên bản truyện không được hỗ trợ");
    const maxChapter = Math.max(1, ...(E.S().chapters || []).map(c => c.ch));
    if (!Number.isInteger(run.ch) || run.ch < 0 || run.ch > maxChapter || run.stack.length > 256) reject("Invalid chapter or scene", "Chương hoặc cảnh không hợp lệ");
    for (let i = 0; i < run.stack.length; i++) {
      const f = run.stack[i];
      if (!object(f) || typeof f.n !== "string" || !Array.isArray(f.p) || !f.p.every(k => typeof k === "string" || Number.isInteger(k) && k >= 0) || !Number.isInteger(f.i) || f.i < 0) reject("Invalid scene cursor", "Vị trí cảnh không hợp lệ");
      const a = C.resolveFrame(run, i);
      if (!Array.isArray(a) || f.i > a.length) reject("Unavailable scene", "Cảnh chưa khả dụng");
    }
    if (!run.items.every(id => typeof id === "string" && Object.hasOwn(E.S().items || {}, id))) reject("Unavailable evidence", "Vật chứng không hợp lệ");
    if (run.scene != null && (typeof run.scene !== "string" || !Object.hasOwn(E.S().scenes || {}, run.scene))) reject("Unavailable location", "Địa điểm không hợp lệ");
    if (!run.log.every(line => object(line) && typeof line.main === "string" && (line.sub == null || typeof line.sub === "string"))) reject("Invalid dialogue history", "Lịch sử thoại không hợp lệ");
    for (const key of ["truths", "used", "cast", "met"]) if (run[key] != null && !object(run[key])) reject("Invalid run state", "Trạng thái lần chơi không hợp lệ");
  };
  const prepare = async data => {
    safeKeys(data);
    if (!object(data) || data.format !== "mobile-vn-save" || data.version !== 1 || data.story !== E.S().id || !object(data.global) || !object(data.global.set)) reject("Incompatible save", "Bản lưu không tương thích");
    // Chuyển trên bản sao; validation thất bại không đổi file hay trạng thái live.
    const next = clone(data);
    await V.prepareSave(next);
    validateRun(next.run);
    for (const key of ["cps", "chAt"]) {
      if (next.global[key] != null && !object(next.global[key])) reject("Invalid checkpoint collection", "Bộ mốc lưu không hợp lệ");
      for (const run of Object.values(next.global[key] || {})) validateRun(run);
    }
    for (const key of ["truths", "endings", "chDone", "opts", "words", "seen", "known"]) if (next.global[key] != null && !object(next.global[key])) reject("Invalid collection data", "Dữ liệu bộ sưu tập không hợp lệ");
    return next;
  };
  const exportSave = () => {
    const run = V.persist();
    const data = { format: "mobile-vn-save", version: 1, story: E.S().id, exportedAt: new Date().toISOString(), global: clone(E.G()), run };
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
    const link = document.createElement("a"); link.href = url; link.download = "Between_Tides_Save.json"; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
    E.ui.toast(E.esc(E.nat({ en: "Save exported", vi: "Đã xuất bản lưu" })));
  };
  let chooser = 0;
  const importSave = () => {
    const request = ++chooser, input = document.createElement("input");
    input.type = "file"; input.accept = ".json,application/json";
    input.onchange = async () => {
      const file = input.files?.[0]; if (!file) return;
      try {
        if (file.size > 2000000) reject("Save file too large", "Tệp bản lưu quá lớn");
        const data = await prepare(JSON.parse(await file.text()));
        if (request !== chooser) return;
        const sh = E.ui.sheet("Load this save? · Nạp bản lưu?", '<p>This replaces the current route and collection with the selected file.</p><p class="vd-vi">Tuyến đang chơi và bộ sưu tập sẽ được thay bằng dữ liệu trong tệp đã chọn. Bạn có thể xuất tiến độ hiện tại trước.</p><div class="se-row"><button class="se-btn" data-export>Export current · Xuất hiện tại</button><button class="se-btn pri" data-load>Load save · Nạp</button></div>');
        sh.querySelector("[data-export]").onclick = exportSave;
        let loading = false;
        sh.querySelector("[data-load]").onclick = async event => {
          event.preventDefault(); event.stopPropagation(); if (loading) return; loading = true;
          const oldRun = E.snapshot(), oldGlobal = clone(E.G());
          try {
            // Không có write trước nút xác nhận này. Giữ identity của G/R mà
            // core và plugin đang tham chiếu, nhưng thay toàn bộ nội dung.
            E.ui.closeSheet(); V.closeQuickMenu?.(); E.stop(); E.explore = false;
            const g = E.G(); for (const key of Object.keys(g)) delete g[key]; Object.assign(g, clone(data.global));
            // Các dictionary core mong có vẫn được tạo cho export tối giản hợp lệ.
            for (const key of ["truths", "endings", "cps", "chAt", "chDone", "opts", "words", "seen", "known"]) g[key] ||= {};
            // Cùng phép chuyển thiết lập như boot gốc; đánh dấu trước bước
            // truyện đầu để mobile-base không đặt lại sở thích vừa nhập.
            g.set = { mode: "bi", vDlg: true, vNarr: false, sfx: true, amb: true, speed: 1,
              name: "An", g: "M", tr: true, shadow: true, ...g.set, vdNativeControls: true };
            if ("voice" in g.set) { g.set.vDlg = g.set.voice !== false; delete g.set.voice; }
            if ("sound" in g.set) { g.set.sfx = g.set.amb = g.set.sound !== false; delete g.set.sound; }
            if (g.set.mode !== "imm") g.set.mode = "bi";
            C.installRun(data.run);
            document.querySelector(".se")?.classList.toggle("vd-large", !!g.set.vdLarge);
            E.save();
            const top = document.querySelector(".se-top"); if (top) top.hidden = false;
            await E.resume();
          } catch (error) {
            const g = E.G(); for (const key of Object.keys(g)) delete g[key]; Object.assign(g, oldGlobal);
            C.installRun(oldRun); E.save(); E.ui.title();
            E.ui.toast(E.esc(error.message), 8000); loading = false;
          }
        };
      } catch (error) { E.ui.toast(E.esc(error.message), 8000); }
    };
    input.click();
  };
  E.plugin({ id: "bt-save-transfer", on: { boot() {
    if (E.S()?.id !== "between-tides") return;
    V.exportSave = exportSave; V.importSave = importSave;
  } } });
})();
