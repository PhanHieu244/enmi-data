// Between Tides — chuyển save của đúng bản zip gốc sang nội dung đã biên tập.
// Nạp sau bt-save-map.js và mobile-base.js, trước boot.js. Core giữ nguyên.
(() => {
  "use strict";
  const E = globalThis.StoryEngine;
  if (!E?.plugin || E.plugins?.["bt-save-compat"]) return;
  // check.js reads plugin names alphabetically without core/state/DOM. This
  // runtime-only adapter defines no new step types for that data-only pass.
  if (typeof document === "undefined" && !E.mech && typeof E.S !== "function") return;
  const M = E.btSaveMap;
  if (!M || M.format !== 1) throw Error("Between Tides save map missing");
  const ID = "between-tides", REV = M.revision, clone = x => JSON.parse(JSON.stringify(x));
  const sourceNodes = new Set(M.sourceNodes), targetNodes = new Set(M.targetNodes);
  const prefixes = Object.entries(M.prefixes).sort((a, b) => b[0].length - a[0].length);
  let starting = false, resumeSerial = 0, warned = "", blockedRun = null;
  const ours = () => E.S()?.id === ID;
  const errorText = "This save belongs to a different story revision. It has been kept unchanged. · Bản lưu thuộc bản truyện khác; dữ liệu được giữ nguyên.";
  const known = r => !r?.btRevision || r.btRevision === REV;
  const check = r => { if (!known(r)) throw Error(errorText); };
  const replace = (to, from) => { for (const k of Object.keys(to)) delete to[k]; Object.assign(to, from); };
  const mappedKey = key => {
    for (const [a, b] of prefixes) if (key === a || key.startsWith(a + ".")) return b + key.slice(a.length);
    return key;
  };
  const mapObject = obj => {
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) return obj;
    const out = {};
    for (const [key, value] of Object.entries(obj)) out[mappedKey(key)] = value;
    return out;
  };
  const hasText = (r, en, vi) => (r.log || []).some(l => l.main === en || l.sub === en || vi && (l.main === vi || l.sub === vi))
    || (r.jot || []).some(j => j.t?.en === en || vi && j.t?.vi === vi);
  const recoverObservedFlags = r => {
    // Chỉ công nhận lời/ghi chú có thật trong bản lưu; không suy từ bộ sưu tập.
    const proof = [
      ["c5_back_door", "I ran home. Went in the back. Didn't want the bar seeing my arm. Rooms were empty. November.", "Tôi chạy về nhà. Vào bằng cửa sau. Không muốn người trong quán thấy cánh tay tôi. Phòng trọ thì trống. Tháng Mười một mà."],
      ["c5_mam_account", "I told Mam. I don't remember what. She put me to bed and said I'd dreamed it.", "Tôi kể với mẹ. Tôi không nhớ đã kể những gì. Mẹ đưa tôi lên giường rồi bảo là tôi nằm mơ."],
      ["c5_mam_account", "Callum, 2004: 'I told Mam… She put me to bed and said I'd dreamed it.'", "Callum, 2004: “Tôi kể với mẹ… Mẹ đưa tôi lên giường rồi bảo là tôi nằm mơ.”"],
      ["c5_referred_mam", "Ask my mother where I was that night. Go on.", "Hỏi mẹ tôi xem đêm đó tôi ở đâu. Hỏi đi."],
      ["c5_callum_missed", "MISSED CALL — Tom — 21:12", "MISSED CALL — Tom — 21:12 · Cuộc gọi nhỡ — Tom — 21:12."],
      ["c5_callum_missed", "Callum's phone: MISSED CALL — Tom — 21:12. (He was at the buoys. Engine.)", "Điện thoại Callum: cuộc gọi nhỡ — Tom — 21:12. (Anh đang ở chỗ phao. Tiếng máy.)"],
      ["c3_gideon_call_seen", "Gideon's phone: Cllr R. Hale, incoming, 21:08, 7 min 12 s (to about 21:15).", "Điện thoại Gideon: ủy viên R. Hale gọi đến 21:08, dài 7 phút 12 giây (tới khoảng 21:15)."],
    ];
    for (const [flag, en, vi] of proof) if (!(flag in r.f) && hasText(r, en, vi)) r.f[flag] = true;
  };
  const fallback = (r, oldStack) => {
    const medical = oldStack.some(f => f.n === M.changedPuzzle.node);
    const nearest = [...oldStack].reverse().find(f => sourceNodes.has(f.n) && targetNodes.has(f.n));
    const node = medical ? M.changedPuzzle.node : nearest?.n;
    if (!node) throw Error("This old scene cannot be located safely. The save is unchanged. · Không tìm được cảnh cũ an toàn; bản lưu được giữ nguyên.");
    r.stack = [{ n: node, p: [], i: 0 }];
    r.btRecovery = { node, reason: medical ? "revised-evidence-puzzle" : "changed-nested-scene", pending: true };
    // Giữ frame gốc để người làm game có thể điều tra; không nhân bản toàn bộ save.
    r.btLegacyStack = oldStack;
  };
  const migrate = original => {
    if (!original || typeof original !== "object" || !Array.isArray(original.stack)) throw Error("Invalid story save · Bản lưu không hợp lệ");
    check(original);
    const r = clone(original);
    if (r.btRevision === REV) return r;
    const oldStack = clone(r.stack), frames = [];
    let recover = false;
    for (const frame of oldStack) {
      if (!frame || typeof frame.n !== "string" || !Array.isArray(frame.p) || !Number.isInteger(frame.i) || frame.i < 0) throw Error("Invalid scene cursor · Vị trí cảnh không hợp lệ");
      const sourceLength = M.sourceArrays?.[JSON.stringify([frame.n, frame.p])];
      const dynamic = /^__(present_wrong|present_noev|xp_seen|combo)$/.test(frame.n);
      if (M.sourceArrays && (!Number.isInteger(sourceLength) || frame.i > sourceLength) && !dynamic) throw Error("This scene does not match the original release. The save is unchanged. · Cảnh không khớp bản gốc; bản lưu được giữ nguyên.");
      const at = M.frames[JSON.stringify([frame.n, frame.p, frame.i])];
      if (!at) { recover = true; break; }
      frames.push({ ...frame, n: at[0], p: clone(at[1]), i: at[2] });
    }
    if (recover) fallback(r, oldStack); else r.stack = frames;
    for (const key of ["used", "xpDetail", "presentUI", "pl"]) if (r[key]) r[key] = mapObject(r[key]);
    if (r.vw?.pid) r.vw.pid = mappedKey(r.vw.pid);
    r.f ||= {};
    const flags = {};
    for (const [key, value] of Object.entries(r.f)) {
      const derived = /^(q_|board_|cmp_|qte_|theory_|gaveUp_|rhythm_)(.*)$/.exec(key);
      flags[derived ? derived[1] + mappedKey(derived[2]) : key] = value;
    }
    r.f = flags;
    recoverObservedFlags(r);
    r.btRevision = REV;
    return r;
  };
  const migrateGlobal = (g, strict = false) => {
    if (!g || typeof g !== "object") return;
    for (const key of ["cps", "chAt"]) for (const [id, snap] of Object.entries(g[key] || {})) {
      try { g[key][id] = migrate(snap); }
      catch (error) { if (strict) throw error; /* Conserve unsupported snapshots. */ }
    }
  };
  const resolveFrame = (run, index) => {
    const frame = run.stack[index], authored = E.walk(frame);
    if (Array.isArray(authored)) return authored;
    let generated = null;
    if (frame.n === "__combo") generated = (E.S().combos || []).map(x => x.then || []);
    if (["__present_wrong", "__present_noev", "__xp_seen"].includes(frame.n)) {
      for (let i = index - 1; i >= 0 && !generated; i--) {
        const parent = run.stack[i], step = E.walk(parent)?.[parent.i];
        if (step?.present && frame.n.startsWith("__present_")) generated = step.present[frame.n === "__present_wrong" ? "wrong" : "noEvidence"] || [];
        if (step?.explore && frame.n === "__xp_seen") generated = [{ think: step.explore.seen || { en: "You've already checked this. Nothing new.", vi: "Chỗ này bạn xem kỹ rồi. Không có gì mới." } }];
      }
    }
    for (const key of frame.p) generated = generated?.[key];
    return Array.isArray(generated) ? generated : null;
  };
  const restoreTransientNodes = run => {
    for (let index = 0; index < run.stack.length; index++) {
      const frame = run.stack[index];
      if (E.walk(frame) || !frame.n.startsWith("__")) continue;
      const rootFrame = { ...frame, p: [] }, rootRun = { ...run, stack: run.stack.map((f, i) => i === index ? rootFrame : f) };
      const steps = resolveFrame(rootRun, index);
      if (steps) E.S().nodes[frame.n] = steps;
    }
  };
  const notice = r => {
    if (!r.btRecovery?.pending) return;
    r.btRecovery.pending = false;
    const message = r.btRecovery.reason === "revised-evidence-puzzle"
      ? { en: "Save updated. This evidence puzzle has changed, so the medical scene resumes from its beginning. Your collected evidence and truths are kept.", vi: "Đã cập nhật bản lưu. Câu đố chứng cứ đã đổi, nên cảnh khám nghiệm bắt đầu lại. Vật chứng và sự thật đã tìm vẫn được giữ." }
      : { en: "Save updated. A revised scene resumes from its beginning. Your collected evidence and truths are kept.", vi: "Đã cập nhật bản lưu. Cảnh đã biên tập bắt đầu lại từ đầu. Vật chứng và sự thật đã tìm vẫn được giữ." };
    E.ui.toast(E.esc(E.nat(message)), 9000);
  };
  const refuse = error => {
    // Title dọn cast của R. Giữ snapshot trước khi dọn để unload/menu không
    // ghi biến thể đã bị UI thay đổi lên một save chưa thể tiếp tục an toàn.
    if (!blockedRun && E.R()) blockedRun = clone(E.snapshot());
    E.stop?.();
    E.ui.title?.();
    if (warned !== error.message) { warned = error.message; E.ui.toast(E.esc(error.message), 10000); }
    console.warn("[between-tides] save kept unchanged:", error.message);
    return false;
  };
  // API riêng cho kiểm tra / công cụ nhập. Không phải loại bước mới của engine.
  E.btSaveCompat = { revision: REV, migrate, migrateGlobal, resolveFrame,
    installRun(run) { check(run); if (run.btRevision !== REV) throw Error(errorText); blockedRun = null; replace(E.R(), clone(run)); E.btPersistence?.observeRun(run); },
  };

  const snapshot = E.snapshot;
  E.snapshot = function (...args) {
    if (ours() && blockedRun) return clone(blockedRun);
    const raw = snapshot.apply(this, args);
    if (!ours()) return raw;
    let result;
    if (starting) { result = raw; result.btRevision = REV; }
    else if (!known(raw)) return raw; // Không sửa save của phiên bản chưa biết.
    else {
      try { result = migrate(raw); }
      catch { return raw; } // Resume/import sẽ báo rõ, việc lưu không làm mất bản gốc.
    }
    E.btPersistence?.observeRun(result);
    return result;
  };
  const newRun = E.newRun;
  E.newRun = function (...args) {
    if (!ours()) return newRun.apply(this, args);
    resumeSerial++;
    blockedRun = null;
    starting = true;
    try { return newRun.apply(this, args); }
    finally { starting = false; }
  };
  const stop = E.stop;
  E.stop = function (...args) {
    if (ours()) resumeSerial++;
    return stop.apply(this, args);
  };
  const play = E.play;
  E.play = function (...args) {
    if (!ours()) return play.apply(this, args);
    try {
      check(E.R());
      // E.play được core gọi sau newRun hoặc resume đã chuyển đổi bên dưới.
      // Bước debug ?at= cũng khởi tạo một run mới bằng mã truyện hiện tại.
      E.R().btRevision = REV;
      const result = play.apply(this, args);
      notice(E.R());
      return result;
    } catch (error) { return refuse(error); }
  };
  const resume = E.resume;
  E.resume = async function (...args) {
    if (!ours()) return resume.apply(this, args);
    const serial = ++resumeSerial;
    try {
      check(E.R());
      const next = migrate(E.R());
      const needed = Math.max(next.ch || 1, ...next.stack.map(f => +(/^c(\d+)_/.exec(f.n)?.[1] || 1)));
      if (!(await E.loadUpTo(needed))) throw Error("Chapter data could not be loaded. Your save is unchanged. · Chưa nạp được chương; bản lưu được giữ nguyên.");
      if (serial !== resumeSerial) return false;
      if (!next.stack.every((f, i) => { const a = resolveFrame(next, i); return Array.isArray(a) && f.i <= a.length; })) throw Error("Saved scene is not available. Your save is unchanged. · Cảnh trong bản lưu chưa khả dụng; dữ liệu được giữ nguyên.");
      restoreTransientNodes(next);
      blockedRun = null;
      replace(E.R(), next);
      migrateGlobal(E.G());
      E.save();
      return await resume.apply(this, args);
    } catch (error) { return refuse(error); }
  };
  const fromCp = E.fromCp;
  E.fromCp = function (id, ...args) {
    if (!ours() || !E.G().cps?.[id]) return fromCp.call(this, id, ...args);
    try { E.G().cps[id] = migrate(E.G().cps[id]); blockedRun = null; return fromCp.call(this, id, ...args); }
    catch (error) { return refuse(error); }
  };
  const playCh = E.playCh;
  E.playCh = function (ch, ...args) {
    if (!ours()) return playCh.call(this, ch, ...args);
    try {
      if (E.G().chAt?.[ch]) E.G().chAt[ch] = migrate(E.G().chAt[ch]);
      else {
        const cp = (E.S().flow || []).find(x => x.kind === "cp" && x.ch === ch && E.G().cps?.[x.id]);
        if (cp) E.G().cps[cp.id] = migrate(E.G().cps[cp.id]);
        else if (ch > 1) {
          // Core đọc main save trực tiếp khi đi từ kết chương N sang N+1.
          // Chuyển trước lúc core E.jump thay stack bằng node mới của N+1.
          const old = E.btPersistence?.getRun();
          if (old?.done && old.btRevision !== REV) {
            const upgraded = migrate(old);
            replace(E.R(), upgraded); E.btPersistence?.observeRun(upgraded); E.save();
          }
        }
      }
      if (E.chOpen(ch)) blockedRun = null;
      return playCh.call(this, ch, ...args);
    } catch (error) { return refuse(error); }
  };

  E.plugin({ id: "bt-save-compat", on: { boot() {
    if (!ours()) return;
    migrateGlobal(E.G()); // Không E.save ở boot: core R lúc này còn rỗng.
    const V = globalThis.MobileVN;
    if (V && !V.btSaveMigration) {
      V.btSaveMigration = true;
      const prepare = V.prepareSave;
      V.prepareSave = async function (data, ...args) {
        await prepare?.call(this, data, ...args);
        if (!data) return;
        const nextRun = migrate(data.run), nextGlobal = clone(data.global);
        migrateGlobal(nextGlobal, true);
        data.run = nextRun; data.global = nextGlobal;
      };
    }
  } } });
})();
