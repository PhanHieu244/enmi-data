// Enmi Story Engine — CƠ CHẾ MỞ RỘNG dựng sẵn (nạp sau mech.js). Truyện dùng bước nào thì bước đó chạy; không dùng = không ảnh hưởng.
// Mỗi cơ chế: StoryEngine.def(tên, ctx => Promise). Có chế độ tự chơi (E.auto) để autoplay.js kiểm hồi quy.
// Đặc tả đầy đủ + ví dụ: docs/story-engine/CO-CHE.md
//
// TRINH THÁM / HỒI HỘP
//   chat     nhắn tin điện thoại (tin đến lần lượt, có “đang gõ…”, chọn câu trả lời)
//   call     cuộc gọi đến (nghe / từ chối / để nhỡ khi hết giờ)
//   board    bảng manh mối: nối NHIỀU cặp manh mối → mỗi cặp đúng = 1 kết luận
//   compare  so 2 văn bản (băng gốc ↔ biên bản…): chạm dòng bị sửa
//   sneak    lẻn qua: mỗi đoạn chọn đường, rủi ro cộng vào thanh “tiếng động”, đầy = bị phát hiện
//   qte      bấm nhanh: tap (chạm liên tục) · seq (chạm đúng thứ tự) · hold (giữ đủ lâu)
//   whom     chọn 1 người (lưới chân dung): buộc tội, cứu ai, rủ ai…
//   note     ghi 1 dòng vào sổ ghi chép vụ án (tab Ghi chú)
// HẸN HÒ / TÌNH CẢM
//   gift     tặng quà: mỗi người thích / ghét khác nhau → phản ứng love · like · meh · hate, cộng thiện cảm
//   topics   chọn chủ đề nói chuyện (mỗi lượt 1 chủ đề, người kia thích / chán) → thiện cảm
//   date     lên lịch hẹn: chọn N hoạt động theo thứ tự → chạy lần lượt, chấm độ hợp
//   gallery  chọn 1 trong nhiều ẢNH (trang phục, món quà, căn phòng…) có gắn thẻ, so với điều người kia muốn
//   meter    thanh chỉ số luôn hiện (thiện cảm ♥, nghi ngờ, ôxy, thời gian…) · { meter: "<khoá>", off: true } để ẩn
// PHIÊU LƯU / NHẬP VAI / SINH TỒN / ĐỜI THƯỜNG
//   check    tung xúc xắc theo chỉ số (d6 / d20 + chỉ số ≥ độ khó) → ok / fail
//   shop     cửa hàng: tiền là 1 biến (vd. coins), mua đồ vào túi
//   schedule lên lịch tuần: mỗi ô chọn 1 hoạt động → cộng chỉ số, trừ tiền / sức
//   gauge    thanh trượt chọn mức (mạnh tay / nhẹ nhàng, bao nhiêu tiền…) → vùng kết quả
//   spin     vòng quay may mắn (kết quả định trước theo khoá bước — tải lại không đổi)
// HỌC TIẾNG (lồng vào truyện)
//   fill     điền từ vào chỗ trống (chọn từ đúng ngữ pháp)
//   memory   lật thẻ ghép cặp (từ ↔ nghĩa, người ↔ đồ vật…)
(() => {
  const E = globalThis.StoryEngine, def = E.def, esc = E.esc, h = E.h;
  const nat = t => E.nat(t), T = k => E.ui.tr(k);
  const later = (fn, ms = 5) => setTimeout(fn, ms);
  const pickAuto = arr => arr[E.auto === "r" ? Math.floor(Math.random() * arr.length) : 0];
  const tgtOr = o => E.tgt(o);
  const sub = o => E.sub(o);
  const cond = (c, s) => (c == null ? true : typeof c === "function" ? !!c(s) : typeof c === "string" ? s.truth(c) || s.has(c) || !!s.f[c] : !!c);
  const seedRnd = key => { let x = E.hash(key) || 1; return () => ((x = (x * 1103515245 + 12345) >>> 0) % 10000) / 10000; };
  const cname = id => (id === "me" ? E.G().set.name : E.cname(E.S().chars[id] || {}, true));
  const color = id => (id === "me" ? "var(--se-me)" : E.S().chars[id]?.color || "#aaa");
  const face = id => `<span class="sp-av" style="--c:${color(id)}"><i class="im-${esc(id)}"></i><b>${esc((cname(id) || "?").charAt(0))}</b></span>`;
  const trOn = () => E.G().set.tr;
  const subHtml = o => { const s = sub(o); return s ? `<small class="sp-sub"${trOn() ? "" : " hidden"}>${esc(s)}</small>` : ""; };
  const ui = () => document.querySelector(".se-ui");
  // xong 1 bước — CHỈ 1 LẦN mỗi bước (bấm 2 lần / hẹn giờ muộn gọi lại từng xoá bảng của bước SAU → kẹt; khỉ bấm của cover.js bắt được)
  const DONE = new WeakSet();
  // TÊN CHỈ SỐ cho người chơi (không lộ mã thô “courage”): story.stats.<mã> = { en, vi } → thanh chỉ số (meter) → mã viết hoa chữ đầu
  const WHEEL = ["#f2b84b", "#7fb2e5", "#ef7a6c", "#6fcf97", "#a78bfa", "#f472b6", "#22d3ee", "#fb923c"];
  const statName = k => nat(E.S().stats?.[k] || E.R().meters?.[k]?.label || { en: k.charAt(0).toUpperCase() + k.slice(1) });
  // biểu tượng: tên icon SVG của engine (E.ICON) — emoji truyện cũ ghi vào thì bỏ, dùng icon mặc định (người dùng không thích emoji)
  const icon = (name, dflt = "talk") => E.ICON[name] || E.ICON[dflt] || "";
  const done = (res, c, key, ...path) => { if (DONE.has(res)) return; DONE.add(res); E.ui.clear(); if (key) c.push(...path); res(); };

  // ═════════ CHAT — nhắn tin ═════════
  // { chat: { with: "ellie", msgs: [{ from: "ellie" | "me", en, vi, pic }], reply: [{ en, vi, set, add, then, if }], wait } }
  def("chat", c => new Promise(res => {
    const C = c.st.chat, R = E.R(), who = C.with;
    E.ui.hideBox();
    const log = (R.chats ||= {})[who] ||= [];
    let shown = [];
    // tin cũ = tin TRƯỚC lần nhắn này (tin mới vừa gửi đã nằm trong shown — trước đây lấy cả log → tin mới hiện 2 lần)
    const base = log.length;
    const draw = (typing, opts) => {
      E.ui.panel(`<div class="sp-phone"><div class="sp-ph">${face(who)}<b>${esc(cname(who))}</b><small>${esc(nat({ en: "online", vi: "đang hoạt động" }))}</small></div>
        <div class="sp-msgs">${[...log.slice(Math.max(0, base - 6), base).map(m => ({ ...m, old: 1 })), ...shown].map(m => `<div class="sp-m ${m.from === "me" ? "me" : "them"}${m.old ? " old" : ""}">${m.pic ? `<i class="sp-mp im-${esc(m.pic)}"></i>` : ""}${E.words(tgtOr(m), E.L)}${subHtml(m)}</div>`).join("")}${typing ? `<div class="sp-m them typing"><i></i><i></i><i></i></div>` : ""}</div>
        ${opts ? `<div class="sp-rep">${opts.map(({ o, i }) => `<button class="se-ch-b" data-r="${i}"><span>${esc(tgtOr(o))}</span>${subHtml(o)}</button>`).join("")}</div>` : ""}</div>`, "chat");
      const m = document.querySelector(".sp-msgs"); if (m) m.scrollTop = m.scrollHeight;
    };
    (async () => {
      for (const m of C.msgs || []) {
        if (m.from !== "me" && !E.auto) { draw(true); await new Promise(r => setTimeout(r, Math.min(1800, 500 + tgtOr(m).length * 22))); }
        shown.push(m); log.push({ ...m }); E.sfx(m.from === "me" ? "tap" : "phone"); draw(false);
        if (!E.auto) await new Promise(r => setTimeout(r, 260));
      }
      const opts = (C.reply || []).map((o, i) => ({ o, i })).filter(({ o }) => cond(o.if, c.s));
      if (!opts.length) { if (!E.auto) await new Promise(r => setTimeout(r, C.wait ?? 900)); return done(res); }
      draw(false, opts);
      let sent = false;
      const go = i => { if (sent) return; sent = true; const o = C.reply[i]; shown.push({ from: "me", ...o }); log.push({ from: "me", en: o.en, [E.N]: o[E.N], [E.L]: o[E.L] }); draw(false); E.apply(o); E.sfx("tap"); setTimeout(() => done(res, c, o.then, "chat", "reply", i, "then"), E.auto ? 1 : 700); };
      ui().onclick = e => { const b = e.target.closest("[data-r]"); if (b) go(+b.dataset.r); };
      E.autoRun(() => go(pickAuto(opts).i));
    })();
  }));

  // ═════════ CALL — cuộc gọi đến ═════════
  // { call: { from: "ruth", ring: 8, accept: [bước], decline: [bước], missed: [bước] } }
  def("call", c => new Promise(res => {
    const C = c.st.call; E.ui.hideBox();
    E.ui.panel(`<div class="sp-call">${face(C.from)}<b>${esc(cname(C.from))}</b><small>${esc(nat({ en: "Incoming call…", vi: "Cuộc gọi đến…" }))}</small>
      <div class="sp-callb"><button class="sp-no" data-k="decline" aria-label="decline">✕</button><button class="sp-yes" data-k="accept" aria-label="accept">✆</button></div></div>`, "call");
    const ring = setInterval(() => E.sfx("phone"), 1400); E.sfx("phone"); E.haptic("MEDIUM");
    let fin = false;
    const go = k => { if (fin) return; fin = true; clearInterval(ring); clearTimeout(tm); const key = C[k] ? k : k === "missed" && C.decline ? "decline" : null; done(res, c, key, "call", key); };
    const tm = setTimeout(() => go("missed"), (C.ring || 10) * 1000);
    ui().onclick = e => { const b = e.target.closest("[data-k]"); if (b) go(b.dataset.k); };
    E.autoRun(() => go(E.auto === "r" && Math.random() < 0.3 ? "decline" : "accept"));
  }));

  // ═════════ METER — thanh chỉ số luôn hiện ═════════
  // { meter: { key: "mia", label: { en, vi }, max: 10, min: 0, icon: "♥", color: "#ff7aa8", invert } } · { meter: "mia", off: true }
  const HUD = () => { let el = document.querySelector(".sp-hud"); if (!el) { el = h(`<div class="sp-hud"></div>`); document.querySelector(".se")?.appendChild(el); } return el; };
  const drawHud = () => {
    const R = E.R(); if (!R) return;
    const ms = R.meters || {}, el = HUD();
    el.innerHTML = Object.entries(ms).map(([k, m]) => {
      const v = +R.f[k] || 0, pct = Math.max(0, Math.min(100, ((v - (m.min || 0)) / ((m.max || 10) - (m.min || 0))) * 100));
      return `<div class="sp-mt${m.invert && pct > 70 ? " hot" : ""}" style="--c:${m.color || "var(--se-ac)"}"><span>${esc(m.icon || "")}</span><b>${esc(nat(m.label))}</b><i><em style="width:${pct}%"></em></i><small>${v}</small></div>`;
    }).join("");
    el.hidden = !Object.keys(ms).length;
  };
  E.ui.hud = drawHud;
  def("meter", async ({ st }) => {
    const R = E.R(), m = st.meter; R.meters ||= {};
    if (typeof m === "string") { if (st.off) delete R.meters[m]; }
    else R.meters[m.key] = { label: m.label, max: m.max, min: m.min, icon: m.icon, color: m.color, invert: m.invert };
    drawHud();
  });
  E.on("step", () => { if (E.R()?.meters) drawHud(); });
  const add0 = E.add; E.add = (k, n) => { add0(k, n); if (E.R()?.meters?.[k]) drawHud(); };
  const restore0 = E.ui.restore; E.ui.restore = () => { restore0(); drawHud(); };

  // ═════════ BOARD — bảng manh mối nhiều cặp ═════════
  // { board: { q, links: [{ a, b, label: { en, vi }, then }], need, ok, fail, tries } } — a / b = mã đồ vật trong túi
  def("board", c => new Promise(res => {
    const B = c.st.board, R = E.R(), S = E.S();
    const got = new Set((R.used[c.key("got")] || "").split(",").filter(Boolean));
    let sel = [], miss = 0;
    E.ui.hideBox();
    const need = B.need ?? B.links.length;
    const draw = (msg = "") => {
      // bảng manh mối DỄ HIỂU (30/10): 1 câu hướng dẫn · ô kết luận đánh số (đã tìm = câu kết luận, chưa = “Mối liên hệ N”) · món đang chọn có số 1 / 2
      E.ui.panel(`<div class="sp-bd"><div class="se-ddh">${E.ICON.bulb}<small>${esc(nat({ en: "Case board", vi: "Bảng manh mối" }))}</small><em class="sp-bdn">${got.size}/${B.links.length}</em></div><b class="se-ddq">${esc(nat(B.q))}</b>
        <p class="se-mute">${esc(nat({ en: "Pick two clues that belong together, then connect them. Each right pair is a conclusion.", vi: "Chọn 2 manh mối có liên quan với nhau rồi bấm Nối. Mỗi cặp đúng là 1 kết luận." }))}</p>
        <div class="sp-bdl">${B.links.map((l, i) => `<div class="sp-bdc${got.has(i + "") ? " on" : ""}"><em>${i + 1}</em><span>${got.has(i + "") ? esc(nat(l.label)) : esc(nat({ en: "Link not found yet", vi: "Mối liên hệ chưa tìm ra" }))}</span></div>`).join("")}</div></div>
        <div class="se-ddg">${R.items.map(id => `<button class="se-ddc${sel.includes(id) ? " on" : ""}" data-c="${id}">${E.itemArt(id, "sm")}<b>${esc(nat(S.items[id]?.name))}</b>${S.items[id]?.desc ? `<small>${esc(nat(S.items[id].desc))}</small>` : ""}${sel.includes(id) ? `<em>${sel.indexOf(id) + 1}</em>` : ""}</button>`).join("")}</div>
        ${msg}<button class="se-btn pri wide${sel.length === 2 ? "" : " dim"}" data-go ${sel.length === 2 ? "" : "disabled"}>${esc(sel.length === 2 ? nat({ en: "Connect these two", vi: "Nối 2 manh mối này" }) : nat({ en: `Choose ${2 - sel.length} more`, vi: `Chọn thêm ${2 - sel.length}` }))}</button>
        <button class="se-btn wide ghost" data-end>${esc(nat(got.size >= need ? { en: "Done", vi: "Xong" } : { en: "I can't find more — move on", vi: "Không tìm thêm được — đi tiếp" }))}</button>`, "deduce board");
    };
    const finish = () => { R.used[c.key("got")] = [...got].join(","); E.flag(B.key || "board_" + c.key(), got.size); done(res, c, got.size >= need ? B.ok : B.fail, "board", got.size >= need ? "ok" : "fail"); };
    const check = () => {
      const i = B.links.findIndex(l => (l.a === sel[0] && l.b === sel[1]) || (l.a === sel[1] && l.b === sel[0]));
      sel = [];
      if (i >= 0 && !got.has(i + "")) { got.add(i + ""); E.sfx("solve"); E.ui.fx("solve"); E.apply(B.links[i]); if (B.links[i].then) { R.used[c.key("got")] = [...got].join(","); E.ui.clear(); c.again(); c.push("board", "links", i, "then"); return res(); } return got.size >= B.links.length ? finish() : draw(); }
      miss++; E.sfx("wrong"); E.ui.fx("shake");
      if (B.tries && miss >= B.tries) return finish();
      draw(`<div class="se-hint no">${esc(nat({ en: "No link there.", vi: "Hai thứ này không liên quan." }))}</div>`);
    };
    ui().onclick = e => {
      const b = e.target.closest("[data-c]"); if (b) { const id = b.dataset.c; sel = sel.includes(id) ? sel.filter(x => x !== id) : [...sel.slice(-1), id]; E.sfx("tap"); return draw(); }
      if (e.target.closest("[data-go]") && sel.length === 2) return check();
      if (e.target.closest("[data-end]")) finish();
    };
    if (got.size >= B.links.length) return finish();
    draw();
    E.autoRun(function step() { const l = B.links.find((l, i) => !got.has(i + "") && R.items.includes(l.a) && R.items.includes(l.b)); if (!l) return finish(); sel = [l.a, l.b]; check(); if (document.querySelector(".sp-bd")) later(step); });
  }));

  // ═════════ COMPARE — so 2 văn bản, chạm dòng bị sửa ═════════
  // { compare: { title, left: { title, lines: [{ en, vi }] }, right: { title, lines: [...] }, diffs: [chỉ số dòng bên phải bị sửa], tries, ok, fail } }
  def("compare", c => new Promise(res => {
    const C = c.st.compare, found = new Set(); let wrong = 0, view = "r";
    E.ui.hideBox();
    const line = (l, i, side) => `<button class="sp-cl${side === "r" && found.has(i) ? " hit" : ""}" data-l="${side}${i}"><em>${i + 1}</em><span>${esc(tgtOr(l))}</span>${subHtml(l)}</button>`;
    const draw = (msg = "") => E.ui.panel(`<div class="se-doc sp-cmp"><div class="se-doch">${E.ICON.doc}<b>${esc(nat(C.title))}</b></div>
      <div class="fx-seg sp-cmps"><button data-v="l" class="${view === "l" ? "on" : ""}">${esc(nat(C.left.title))}</button><button data-v="r" class="${view === "r" ? "on" : ""}">${esc(nat(C.right.title))} · ${found.size}/${C.diffs.length}</button></div>
      <div class="sp-cll">${(view === "l" ? C.left : C.right).lines.map((l, i) => line(l, i, view)).join("")}</div>
      <p class="se-mute">${esc(nat(view === "l" ? { en: "This is what was really said. Switch tabs and tap every line that was changed.", vi: "Đây là lời thật. Đổi tab và chạm mọi dòng đã bị sửa." } : { en: "Tap each line that is different from the original.", vi: "Chạm từng dòng khác với bản gốc." }))}</p></div>
      ${msg}<button class="se-btn pri wide" data-ok>${esc(nat({ en: "Done", vi: "Xong" }))}</button>`, "present cmp");
    const fin = () => { const ok = found.size >= C.diffs.length; E.flag(C.key || "cmp_" + c.key(), found.size); done(res, c, ok ? C.ok : C.fail, "compare", ok ? "ok" : "fail"); };
    ui().onclick = e => {
      const v = e.target.closest("[data-v]"); if (v) { view = v.dataset.v; E.sfx("page"); return draw(); }
      const l = e.target.closest("[data-l]");
      if (l && l.dataset.l[0] === "r") { const i = +l.dataset.l.slice(1); if (found.has(i)) return; if (C.diffs.includes(i)) { found.add(i); E.sfx("solve"); E.ui.fx("objection"); return found.size === C.diffs.length ? setTimeout(fin, E.auto ? 1 : 700) : draw(); } wrong++; E.sfx("wrong"); E.ui.fx("shake"); if (C.tries && wrong >= C.tries) return fin(); return draw(`<div class="se-hint no">${esc(nat({ en: "That line matches the original.", vi: "Dòng đó giống bản gốc." }))}</div>`); }
      if (e.target.closest("[data-ok]")) fin();
    };
    draw();
    E.autoRun(() => { C.diffs.forEach(i => found.add(i)); fin(); });
  }));

  // ═════════ SNEAK — lẻn qua ═════════
  // { sneak: { goal, max: 6, key, rows: [{ t: { en, vi }, opts: [{ en, vi, risk: 0-3, then, set }] }], caught: [bước], ok: [bước] } }
  def("sneak", c => new Promise(res => {
    // trạng thái (đoạn đang đi, tiếng động) lưu theo khoá bước → chọn đường có bước con (then) thì NHƯỜNG cho bước con chạy, xong quay lại đúng đoạn
    const N = c.st.sneak, R = E.R(), sk = c.key("st");
    const st0 = R.used[sk] || { row: 0, noise: 0 };
    let { row, noise } = st0;
    const max = N.max || 6, rnd = seedRnd(c.key() + ":" + row + ":" + noise);
    E.ui.hideBox();
    const draw = (msg = "") => {
      const r = N.rows[row];
      E.ui.panel(`<div class="sp-sn"><div class="se-xg"><span>${esc(nat(N.goal))}</span><b>${row + 1}/${N.rows.length}</b></div>
        <div class="sp-noise"><small>${esc(nat({ en: "Noise — full means you're caught", vi: "Tiếng động — đầy là bị phát hiện" }))}</small><i><em style="width:${Math.min(100, (noise / max) * 100)}%"></em></i><b>${noise}/${max}</b></div>
        <p class="sp-snt">${esc(nat(r.t))}</p>${msg}
        <div class="se-chs">${r.opts.map((o, i) => { const k = Math.max(0, Math.min(3, o.risk || 0)); return `<button class="se-ch-b act" data-i="${i}"><span>${esc(nat(o))}</span><small class="sp-risk r${k}">${esc(nat([{ en: "Safe", vi: "An toàn" }, { en: "Low risk", vi: "Rủi ro thấp" }, { en: "Risky", vi: "Rủi ro vừa" }, { en: "Very risky", vi: "Rủi ro cao" }][k]))}</small></button>`; }).join("")}</div></div>`, "sneak");
    };
    const finish = key => { delete R.used[sk]; done(res, c, !!N[key], "sneak", key); };
    const go = i => {
      const o = N.rows[row].opts[i], risk = o.risk || 0;
      // rủi ro: luôn +risk/2 (làm tròn lên), xui thì +1 nữa (xác suất theo rủi ro) — định trước theo khoá bước + vị trí
      const add = Math.ceil(risk / 2) + (rnd() < risk * 0.22 ? 1 : 0);
      noise += add; E.apply(o); E.sfx(add > 1 ? "wrong" : "steps");
      if (add > 1) E.ui.fx("pulse");
      if (noise >= max) { E.flag(N.key || "caught", 1); return finish("caught"); }
      const thenOf = row;
      row++;
      if (row >= N.rows.length && !o.then) { E.flag((N.key || "sneak") + "_noise", noise); return finish("ok"); }
      if (o.then) {
        // bước con chạy trước, rồi quay lại bước sneak này (row đã +1); hết đoạn → lần quay lại sẽ kết thúc ở “ok”
        R.used[sk] = { row, noise };
        E.ui.clear(); c.again(); c.push("sneak", "rows", thenOf, "opts", i, "then");
        return res();
      }
      R.used[sk] = { row, noise };
      draw(add > 1 ? `<div class="se-hint no">${esc(nat({ en: "Something creaked…", vi: "Có tiếng cót két…" }))}</div>` : "");
    };
    if (row >= N.rows.length) { E.flag((N.key || "sneak") + "_noise", noise); return finish("ok"); }
    ui().onclick = e => { const b = e.target.closest("[data-i]"); if (b) go(+b.dataset.i); };
    draw();
    E.autoRun(() => { const r = N.rows[row]; const i = E.auto === "r" ? Math.floor(Math.random() * r.opts.length) : r.opts.reduce((b, o, k) => ((o.risk || 0) < (r.opts[b].risk || 0) ? k : b), 0); go(i); if (document.querySelector(".sp-sn") && E.auto) { const tick = () => { if (!document.querySelector(".sp-sn")) return; const r2 = N.rows[row]; if (!r2) return; go(E.auto === "r" ? Math.floor(Math.random() * r2.opts.length) : 0); setTimeout(tick, 5); }; setTimeout(tick, 5); } });
  }));


  // ═════════ QTE — bấm nhanh ═════════
  // { qte: { prompt, kind: "tap" | "seq" | "hold", n: 12, seq: ["←","↑","→"], ms: 5000, ok, fail } }
  def("qte", c => new Promise(res => {
    const Q = c.st.qte, kind = Q.kind || "tap", ms = Q.ms || 5000;
    E.ui.hideBox(); E.ui.urgent(true);
    let cnt = 0, fin = false, t0 = performance.now(), holdT = 0;
    const seq = Q.seq || ["◀", "▲", "▶", "▼"].sort(() => 0.5 - Math.random()).slice(0, Q.n || 4);
    const draw = () => E.ui.panel(`<div class="sp-qte"><div class="se-ask">${esc(nat(Q.prompt))}</div><div class="se-timer"><i style="animation-duration:${ms / 1000}s"></i></div>
      ${kind === "tap" ? `<button class="sp-qb" data-q>${cnt}/${Q.n || 12}</button>` : kind === "hold" ? `<button class="sp-qb hold" data-h><i></i>${esc(nat({ en: "HOLD", vi: "GIỮ" }))}</button>` : `<div class="sp-seq">${seq.map((k, i) => `<span class="${i < cnt ? "on" : ""}">${esc(k)}</span>`).join("")}</div><div class="sp-qpad">${["◀", "▲", "▼", "▶"].map(k => `<button data-s="${k}">${k}</button>`).join("")}</div>`}</div>`, "qte");
    const end = ok => { if (fin) return; fin = true; clearTimeout(tm); E.ui.urgent(false); E.flag(Q.key || "qte_" + c.key(), ok ? 1 : 0); if (ok) { E.sfx("solve"); E.ui.fx("punch"); } else { E.sfx("hit"); E.ui.fx("redflash"); } done(res, c, ok ? Q.ok : Q.fail, "qte", ok ? "ok" : "fail"); };
    const tm = setTimeout(() => end(false), ms);
    draw();
    const el = ui();
    el.onclick = e => {
      if (kind === "tap" && e.target.closest("[data-q]")) { cnt++; E.sfx("tap"); E.haptic("LIGHT"); if (cnt >= (Q.n || 12)) end(true); else e.target.closest("[data-q]").textContent = `${cnt}/${Q.n || 12}`; }
      const s = e.target.closest("[data-s]"); if (kind === "seq" && s) { if (s.dataset.s === seq[cnt]) { cnt++; E.sfx("tap"); if (cnt >= seq.length) end(true); else draw(); } else { E.sfx("wrong"); E.ui.fx("shake"); cnt = 0; draw(); } }
    };
    if (kind === "hold") {
      el.onpointerdown = e => { if (e.target.closest("[data-h]")) { holdT = performance.now(); e.target.closest("[data-h]").classList.add("on"); } };
      el.onpointerup = el.onpointercancel = () => { if (holdT && performance.now() - holdT >= (Q.hold || 1800)) end(true); holdT = 0; el.querySelector("[data-h]")?.classList.remove("on"); };
    }
    E.autoRun(() => end(E.auto === "r" ? Math.random() < 0.7 : true));
    void t0;
  }));

  // ═════════ WHOM — chọn 1 người ═════════
  // { whom: { prompt, chars: ["tom", "owen"], then: { tom: [bước], owen: [bước] }, set: "accused" } }
  def("whom", c => new Promise(res => {
    const W = c.st.whom, list = W.chars.filter(id => !W.if?.[id] || cond(W.if[id], c.s));
    E.ui.hideBox();
    E.ui.panel(`<div class="se-ask">${esc(nat(W.prompt))}</div><div class="sp-whom">${list.map(id => `<button data-w="${id}" style="--c:${color(id)}"><span class="sp-wp"><i class="im-${esc(id)}"></i></span><b>${esc(cname(id))}</b></button>`).join("")}</div>`, "whom");
    const go = id => { if (W.set) E.flag(W.set, id); E.sfx("pick"); done(res, c, W.then?.[id], "whom", "then", id); };
    ui().onclick = e => { const b = e.target.closest("[data-w]"); if (b) go(b.dataset.w); };
    E.autoRun(() => go(pickAuto(list)));
  }));

  // ═════════ NOTE — sổ ghi chép ═════════
  def("note", async ({ st }) => { const R = E.R(); (R.jot ||= []).push({ ch: R.ch, t: st.note }); if (!st.quiet) E.ui.toast(`${E.ICON.pen}<span><small>${esc(nat({ en: "Noted", vi: "Đã ghi chép" }))}</small><b>${esc(nat(st.note))}</b></span>`, 2400, "item"); E.ui.dot(true); });

  // ═════════ GIFT — tặng quà ═════════
  // { gift: { to: "mia", key: "mia", from: "bag" | [{ id, en, vi, pic }], likes: { <id>: 3 | 1 | 0 | -2 }, react: { love, like, meh, hate }, take: true } }
  def("gift", c => new Promise(res => {
    const G0 = c.st.gift, R = E.R(), S = E.S();
    const opts = Array.isArray(G0.from) ? G0.from : R.items.map(id => ({ id, ...S.items[id]?.name, item: 1 }));
    E.ui.hideBox();
    E.ui.panel(`<div class="se-ask">${esc(nat(G0.prompt || { en: "Choose a gift for " + cname(G0.to), vi: "Chọn quà tặng " + cname(G0.to) }))}</div>
      <div class="sp-gift">${opts.map((o, i) => `<button data-g="${i}">${o.item ? E.itemArt(o.id, "md") : o.pic ? `<span class="se-ia md"><i class="im-${esc(o.pic)}"></i></span>` : `<span class="sp-gi">🎁</span>`}<b>${esc(o.item ? nat(S.items[o.id]?.name) : nat(o))}</b></button>`).join("")}</div>
      ${G0.skip ? `<button class="se-btn wide" data-skip>${esc(nat(G0.skip))}</button>` : ""}`, "gift");
    const go = i => {
      const o = opts[i], v = G0.likes?.[o.id] ?? 0;
      const tier = v >= 3 ? "love" : v >= 1 ? "like" : v >= 0 ? "meh" : "hate";
      E.add(G0.key || G0.to, v);
      if (o.item && G0.take !== false) R.items = R.items.filter(x => x !== o.id);
      E.flag((G0.key || G0.to) + "_gift", o.id);
      E.sfx(v >= 1 ? "up" : "down"); if (v >= 3) E.effect.run("particles", { kind: "petals", ms: 3000 });
      const key = G0.react?.[tier] ? tier : null;
      done(res, c, key, "gift", "react", key);
    };
    ui().onclick = e => { const b = e.target.closest("[data-g]"); if (b) go(+b.dataset.g); if (e.target.closest("[data-skip]")) done(res); };
    if (!opts.length) return done(res);
    E.autoRun(() => go(E.auto === "r" ? Math.floor(Math.random() * opts.length) : 0));
  }));

  // ═════════ TOPICS — chọn chủ đề nói chuyện ═════════
  // { topics: { with: "mia", key: "mia", rounds: 3, list: [{ id, en, vi, score: 2 | 1 | 0 | -1, then }] , end } }
  def("topics", c => new Promise(res => {
    const P = c.st.topics, R = E.R(), usedK = c.key("used");
    const used = new Set((R.used[usedK] || "").split(",").filter(Boolean));
    const rounds = P.rounds || 3;
    if (used.size >= rounds) { delete R.used[usedK]; return done(res, c, P.end, "topics", "end"); }
    E.ui.hideBox();
    const left = P.list.filter(t => !used.has(t.id) && cond(t.if, c.s));
    E.ui.panel(`<div class="se-ask">${esc(nat(P.prompt || { en: "What do you talk about?", vi: "Bạn nói chuyện gì?" }))} <small class="se-mute">${used.size + 1}/${rounds}</small></div>
      <div class="sp-top">${left.map(t => `<button data-t="${esc(t.id)}"><span>${icon(t.icon, "talk")}</span><b>${esc(nat(t))}</b></button>`).join("")}</div>`, "topics");
    const go = id => {
      const t = P.list.find(x => x.id === id); used.add(id); R.used[usedK] = [...used].join(",");
      E.add(P.key || P.with, t.score || 0); E.sfx((t.score || 0) > 0 ? "up" : (t.score || 0) < 0 ? "down" : "tap");
      E.ui.clear(); c.again();
      if (t.then) c.push("topics", "list", P.list.indexOf(t), "then");
      res();
    };
    ui().onclick = e => { const b = e.target.closest("[data-t]"); if (b) go(b.dataset.t); };
    if (!left.length) { delete R.used[usedK]; return done(res, c, P.end, "topics", "end"); }
    E.autoRun(() => go(pickAuto(left).id));
  }));

  // ═════════ DATE — lên lịch hẹn ═════════
  // { date: { with, key, slots: 3, spots: [{ id, en, vi, pic, desc, score, then }], good: 5, great: [bước], ok: [bước], bad: [bước] } }
  def("date", c => new Promise(res => {
    const D = c.st.date, pickd = [];
    E.ui.hideBox();
    const n = D.slots || 3;
    const draw = () => E.ui.panel(`<div class="se-ask">${esc(nat(D.prompt || { en: "Plan the date", vi: "Lên kế hoạch buổi hẹn" }))}</div>
      <div class="sp-plan">${Array.from({ length: n }, (_, i) => { const s = D.spots.find(x => x.id === pickd[i]); return `<div class="sp-slot${s ? " on" : ""}${!s && i === pickd.length ? " next" : ""}"><em>${i + 1}</em><span>${s ? esc(nat(s)) : esc(nat(i === pickd.length ? { en: "Choose a place", vi: "Chọn 1 nơi" } : { en: "Later", vi: "Sau đó" }))}</span></div>`; }).join("")}</div>
      <div class="sp-spots">${D.spots.filter(s => !pickd.includes(s.id) && cond(s.if, c.s)).map(s => `<button data-s="${esc(s.id)}">${s.pic ? `<i class="im-${esc(s.pic)}"></i>` : ""}<b>${esc(nat(s))}</b>${s.desc ? `<small>${esc(nat(s.desc))}</small>` : ""}</button>`).join("")}</div>
      <div class="se-row"><button class="se-btn" data-undo ${pickd.length ? "" : "disabled"}>${esc(nat({ en: "Undo last", vi: "Bỏ nơi cuối" }))}</button><button class="se-btn pri${pickd.length === n ? "" : " dim"}" data-go ${pickd.length === n ? "" : "disabled"}>${esc(pickd.length === n ? nat({ en: "Let's go", vi: "Đi thôi" }) : nat({ en: `${n - pickd.length} more to choose`, vi: `Chọn thêm ${n - pickd.length} nơi` }))}</button></div>`, "date");
    const run = () => {
      const R = E.R();
      const score = pickd.reduce((a, id) => a + (D.spots.find(s => s.id === id).score || 0), 0);
      E.add(D.key || D.with, score); E.flag((D.key || D.with) + "_date", pickd.join(">"));
      const tier = score >= (D.great_at ?? (D.good ?? 4) + 2) && D.great ? "great" : score >= (D.good ?? 4) ? "ok" : "bad";
      E.ui.clear();
      // chạy hoạt động theo đúng thứ tự đã chọn, rồi kết quả — xếp ngăn xếp ngược (cuối chạy trước bị đè)
      if (D[tier]) c.push("date", tier);
      for (const id of [...pickd].reverse()) { const i = D.spots.findIndex(s => s.id === id); if (D.spots[i].then) c.push("date", "spots", i, "then"); }
      void R; res();
    };
    ui().onclick = e => {
      const s = e.target.closest("[data-s]"); if (s && pickd.length < n) { pickd.push(s.dataset.s); E.sfx("pick"); return draw(); }
      if (e.target.closest("[data-undo]")) { pickd.pop(); return draw(); }
      if (e.target.closest("[data-go]") && pickd.length === n) run();
    };
    draw();
    E.autoRun(() => { const pool = D.spots.filter(s => cond(s.if, c.s)).map(s => s.id); while (pickd.length < n && pool.length) pickd.push(pool.splice(E.auto === "r" ? Math.floor(Math.random() * pool.length) : 0, 1)[0]); run(); });
  }));

  // ═════════ GALLERY — chọn 1 ảnh (trang phục, quà, phòng…) ═════════
  // { gallery: { prompt, key, want: ["casual"], opts: [{ id, pic, en, vi, tags: [...], then }], match: [bước], miss: [bước] } }
  def("gallery", c => new Promise(res => {
    const P = c.st.gallery; let cur = 0;
    E.ui.hideBox();
    const draw = () => { const o = P.opts[cur]; E.ui.panel(`<div class="se-ask">${esc(nat(P.prompt))}</div>
      <div class="sp-gal"><button data-p="-1">‹</button><div class="sp-galc"><i class="im-${esc(o.pic || "")}"></i><b>${esc(nat(o))}</b>${o.desc ? `<small>${esc(nat(o.desc))}</small>` : ""}<em>${cur + 1}/${P.opts.length}</em></div><button data-p="1">›</button></div>
      <button class="se-btn pri wide" data-ok>${esc(nat({ en: "Choose this", vi: "Chọn cái này" }))}</button>`, "gallery"); };
    const go = () => {
      const o = P.opts[cur], hit = (P.want || []).filter(t => o.tags?.includes(t)).length;
      E.flag(P.key || "gallery", o.id); E.apply(o); if (P.score) E.add(P.score, hit);
      E.ui.clear();
      const k = P.want ? (hit ? "match" : "miss") : null;
      if (k && P[k]) c.push("gallery", k);
      if (o.then) c.push("gallery", "opts", cur, "then");
      res();
    };
    ui().onclick = e => { const p = e.target.closest("[data-p]"); if (p) { cur = (cur + +p.dataset.p + P.opts.length) % P.opts.length; E.sfx("page"); return draw(); } if (e.target.closest("[data-ok]")) go(); };
    draw();
    E.autoRun(() => { cur = E.auto === "r" ? Math.floor(Math.random() * P.opts.length) : 0; go(); });
  }));

  // ═════════ CHECK — tung xúc xắc theo chỉ số ═════════
  // { check: { stat: "courage", dc: 8, die: 6 | 20, label, ok, fail, bonus: { <đồ>: 2 } } }
  def("check", c => new Promise(res => {
    const K = c.st.check, R = E.R(), die = K.die || 6;
    const statV = +R.f[K.stat] || 0, bonus = Object.entries(K.bonus || {}).reduce((a, [it, n]) => a + (R.items.includes(it) || R.f[it] ? n : 0), 0);
    const roll = 1 + Math.floor(seedRnd(c.key() + ":" + (R.f.__checks = (R.f.__checks || 0) + 1))() * die);
    const total = roll + statV + bonus, ok = total >= K.dc;
    E.ui.hideBox();
    E.ui.panel(`<div class="sp-dice"><div class="se-ask">${esc(nat(K.label || { en: "Skill check", vi: "Thử thách" }))}</div><div class="sp-die" data-d>?</div>
      <p class="sp-dsum">${esc(nat({ en: "Dice", vi: "Xúc xắc" }))} <b data-r>?</b> + ${esc(K.statLabel ? nat(K.statLabel) : statName(K.stat))} ${statV}${bonus ? ` + ${esc(nat({ en: "items", vi: "đồ" }))} ${bonus}` : ""} = <b data-t>?</b></p><p class="se-mute">${esc(nat({ en: `You need ${K.dc} or more.`, vi: `Cần đạt ${K.dc} trở lên.` }))}</p><button class="se-btn pri wide" data-roll="1">${esc(nat({ en: "Roll", vi: "Tung" }))}</button></div>`, "check");
    const fin = () => { E.flag(K.key || "check_" + K.stat, ok ? 1 : 0); done(res, c, ok ? K.ok : K.fail, "check", ok ? "ok" : "fail"); };
    const doRoll = () => {
      const d = document.querySelector("[data-d]"); let k = 0;
      const spin = setInterval(() => { d.textContent = 1 + Math.floor(Math.random() * die); E.sfx("tap"); if (++k > 9) { clearInterval(spin); d.textContent = roll; d.classList.add(ok ? "ok" : "no"); document.querySelector("[data-r]").textContent = roll; document.querySelector("[data-t]").textContent = total; E.sfx(ok ? "solve" : "wrong"); const b = document.querySelector("[data-roll]"); b.textContent = T("cont"); b.dataset.roll = ""; b.onclick = fin; } }, 80);
    };
    ui().onclick = e => { const b = e.target.closest("[data-roll]"); if (b && b.dataset.roll !== "") { b.disabled = true; doRoll(); setTimeout(() => (b.disabled = false), 900); } };
    E.autoRun(fin);
  }));

  // ═════════ SHOP — cửa hàng ═════════
  // { shop: { money: "coins", title, items: [{ id, price }], leave } } — đồ = mã trong story.items
  def("shop", c => new Promise(res => {
    const P = c.st.shop, R = E.R(), S = E.S(), cur = P.money || "coins";
    E.ui.hideBox();
    const draw = (msg = "") => E.ui.panel(`<div class="se-xg"><span>${esc(nat(P.title || { en: "Shop", vi: "Cửa hàng" }))}</span><b>${esc(statName(cur))} ${+R.f[cur] || 0}</b></div>
      <div class="sp-shop">${P.items.map(x => { const own = R.items.includes(x.id); return `<button data-b="${x.id}" ${own ? "disabled" : ""}>${E.itemArt(x.id, "md")}<b>${esc(nat(S.items[x.id]?.name))}</b><small>${own ? esc(nat({ en: "Bought", vi: "Đã mua" })) : x.price + " " + esc(statName(cur))}</small></button>`; }).join("")}</div>${msg}
      <button class="se-btn wide" data-x2>${esc(nat(P.leave || { en: "Leave", vi: "Rời đi" }))}</button>`, "shop");
    ui().onclick = e => {
      const b = e.target.closest("[data-b]");
      if (b) { const x = P.items.find(i => i.id === b.dataset.b); if ((+R.f[cur] || 0) < x.price) { E.sfx("wrong"); return draw(`<div class="se-hint no">${esc(nat({ en: "Not enough money.", vi: "Không đủ tiền." }))}</div>`); } R.f[cur] -= x.price; R.items.push(x.id); E.sfx("item"); E.ui.dot(true); return draw(); }
      if (e.target.closest("[data-x2]")) done(res);
    };
    draw();
    E.autoRun(() => { const x = P.items.find(i => (+R.f[cur] || 0) >= i.price && !R.items.includes(i.id)); if (x && E.auto === "r") { R.f[cur] -= x.price; R.items.push(x.id); } done(res); });
  }));

  // ═════════ SCHEDULE — lên lịch tuần ═════════
  // { schedule: { slots: [{ en, vi }…], acts: [{ id, en, vi, icon, gain: { stat: n }, cost: { coins: n } }], then } }
  def("schedule", c => new Promise(res => {
    const P = c.st.schedule, plan = [];
    E.ui.hideBox();
    const draw = () => E.ui.panel(`<div class="se-ask">${esc(nat(P.prompt || { en: "Plan your week", vi: "Lên lịch cho tuần này" }))}</div>
      <div class="sp-plan">${P.slots.map((s, i) => { const a = P.acts.find(x => x.id === plan[i]); return `<div class="sp-slot${a ? " on" : ""}${!a && i === plan.length ? " next" : ""}"><em>${esc(nat(s))}</em><span>${a ? esc(nat(a)) : esc(nat(i === plan.length ? { en: "Choose", vi: "Chọn" } : { en: "Free", vi: "Trống" }))}</span></div>`; }).join("")}</div>
      <div class="sp-top">${P.acts.map(a => `<button data-a2="${a.id}"><span>${icon(a.icon, "clock")}</span><b>${esc(nat(a))}</b><small>${[...Object.entries(a.gain || {}).map(([k, v]) => `${statName(k)} ${v > 0 ? "+" : ""}${v}`), ...Object.entries(a.cost || {}).map(([k, v]) => `${statName(k)} −${v}`)].join(" · ")}</small></button>`).join("")}</div>
      <div class="se-row"><button class="se-btn" data-undo ${plan.length ? "" : "disabled"}>${esc(nat({ en: "Undo last", vi: "Bỏ ô cuối" }))}</button><button class="se-btn pri${plan.length === P.slots.length ? "" : " dim"}" data-go ${plan.length === P.slots.length ? "" : "disabled"}>${esc(nat({ en: "Start the week", vi: "Bắt đầu tuần" }))}</button></div>`, "date sched");
    const run = () => {
      for (const id of plan) { const a = P.acts.find(x => x.id === id); for (const k in a.gain || {}) E.add(k, a.gain[k]); for (const k in a.cost || {}) E.add(k, -a.cost[k]); }
      E.flag(P.key || "week", plan.join(","));
      done(res, c, P.then, "schedule", "then");
    };
    ui().onclick = e => {
      const a = e.target.closest("[data-a2]"); if (a && plan.length < P.slots.length) { plan.push(a.dataset.a2); E.sfx("pick"); return draw(); }
      if (e.target.closest("[data-undo]")) { plan.pop(); return draw(); }
      if (e.target.closest("[data-go]") && plan.length === P.slots.length) run();
    };
    draw();
    E.autoRun(() => { while (plan.length < P.slots.length) plan.push(pickAuto(P.acts).id); run(); });
  }));

  // ═════════ GAUGE — thanh trượt chọn mức ═════════
  // { gauge: { prompt, min: 0, max: 100, step: 10, unit, key, zones: [{ to: 30, then }, { to: 70, then }, { to: 100, then }] } }
  def("gauge", c => new Promise(res => {
    const P = c.st.gauge, mn = P.min ?? 0, mx = P.max ?? 100;
    E.ui.hideBox();
    E.ui.panel(`<div class="se-ask">${esc(nat(P.prompt))}</div><div class="sp-gauge"><b data-v>${Math.round((mn + mx) / 2)}${esc(P.unit || "")}</b><input type="range" min="${mn}" max="${mx}" step="${P.step || 1}" value="${Math.round((mn + mx) / 2)}" data-r>
      <div class="sp-gl"><small>${esc(nat(P.lo || ""))}</small><small>${esc(nat(P.hi || ""))}</small></div></div><button class="se-btn pri wide" data-ok>${T("cont")}</button>`, "gauge");
    const r = document.querySelector("[data-r]");
    r.oninput = () => (document.querySelector("[data-v]").textContent = r.value + (P.unit || ""));
    const go = v => { E.flag(P.key || "gauge", v); const zi = P.zones.findIndex(z => v <= z.to); E.apply(P.zones[zi]); done(res, c, P.zones[zi]?.then, "gauge", "zones", zi, "then"); };
    ui().onclick = e => { if (e.target.closest("[data-ok]")) go(+r.value); };
    E.autoRun(() => go(E.auto === "r" ? mn + Math.floor(Math.random() * (mx - mn)) : +r.value));
  }));

  // ═════════ SPIN — vòng quay may mắn ═════════
  // { spin: { prompt, key, opts: [{ en, vi, w: 1, then }] } } — kết quả định trước theo khoá bước (tải lại không đổi kết quả)
  def("spin", c => new Promise(res => {
    const P = c.st.spin, tot = P.opts.reduce((a, o) => a + (o.w || 1), 0);
    let r = seedRnd(c.key() + (E.R().f.__spins = (E.R().f.__spins || 0) + 1))() * tot, k = 0;
    while (r > (P.opts[k].w || 1)) { r -= P.opts[k].w || 1; k++; }
    E.ui.hideBox();
    const seg = 360 / P.opts.length;
    E.ui.panel(`<div class="se-ask">${esc(nat(P.prompt || { en: "Spin!", vi: "Quay!" }))}</div><div class="sp-wheel"><div class="sp-wh" data-w style="background:conic-gradient(${P.opts.map((o, i) => `${WHEEL[i % WHEEL.length]} ${i * seg}deg ${(i + 1) * seg}deg`).join(",")})">${P.opts.map((o, i) => `<span style="--r:${i * seg + seg / 2}deg">${i + 1}</span>`).join("")}</div><i class="sp-pin"></i></div><div class="sp-leg">${P.opts.map((o, i) => `<span><i style="background:${WHEEL[i % WHEEL.length]}">${i + 1}</i>${esc(nat(o))}</span>`).join("")}</div><button class="se-btn pri wide" data-go>${esc(nat({ en: "Spin", vi: "Quay" }))}</button>`, "spin");
    const fin = () => { E.flag(P.key || "spin", k); E.apply(P.opts[k]); done(res, c, P.opts[k].then, "spin", "opts", k, "then"); };
    ui().onclick = e => { const b = e.target.closest("[data-go]"); if (!b || b.dataset.done) return; b.dataset.done = 1; const w = document.querySelector("[data-w]"); w.style.transform = `rotate(${360 * 5 - (k * seg + seg / 2)}deg)`; E.sfx("whoosh"); setTimeout(() => { E.sfx("solve"); b.textContent = T("cont"); b.onclick = fin; }, 3200); };
    E.autoRun(fin);
  }));

  // ═════════ FILL — điền từ vào chỗ trống ═════════
  // { fill: { prompt, t: "I ___ him yesterday.", opts: ["saw", "see", "seen"], a: 0, why: { en, vi }, ok, fail } } — nhiều chỗ trống: t có nhiều ___, opts = [[…],[…]], a = [i, j]
  def("fill", c => new Promise(res => {
    const F = c.st.fill, multi = Array.isArray(F.opts[0]), opts = multi ? F.opts : [F.opts], ans = multi ? F.a : [F.a];
    const pick = opts.map(() => -1); let blank = 0, tries = 0;
    E.ui.hideBox();
    const draw = (msg = "") => {
      let k = 0;
      const sent = esc(tgtOr(F.t)).replace(/_{3,}/g, () => { const i = k++; return `<button class="sp-bl${blank === i ? " on" : ""}${pick[i] >= 0 ? " set" : ""}" data-b="${i}">${pick[i] >= 0 ? esc(opts[i][pick[i]]) : "____"}</button>`; });
      E.ui.panel(`<div class="se-ask">${esc(nat(F.prompt || { en: "Fill in the blank", vi: "Điền vào chỗ trống" }))}</div><p class="sp-fill">${sent}</p>${subHtml(F.t)}
        <div class="sp-wb">${opts[blank].map((w, i) => `<button data-o="${i}">${esc(w)}</button>`).join("")}</div>${msg}
        <button class="se-btn pri wide${pick.every(p => p >= 0) ? "" : " dim"}" data-ok ${pick.every(p => p >= 0) ? "" : "disabled"}>${esc(nat({ en: "Check", vi: "Kiểm tra" }))}</button>`, "fill");
    };
    const check = async () => {
      tries++;
      const ok = pick.every((p, i) => p === ans[i]);
      E.add("fillN", 1); if (ok) E.add("fillOk", 1);
      if (ok || tries >= (F.tries || 2)) {
        if (ok) { E.sfx("solve"); E.ui.fx("solve"); } else E.sfx("wrong");
        if (!E.auto && (F.why || !ok)) await E.feedback(`<div class="se-fb a${ok ? 2 : 0}"><b>${ok ? "✓" : "✗"} ${esc(tgtOr(F.t).replace(/_{3,}/g, (() => { let k = 0; return () => opts[k][ans[k++]]; })()))}</b>${F.why ? `<p>${esc(nat(F.why))}</p>` : ""}</div>`);
        return done(res, c, ok ? F.ok : F.fail, "fill", ok ? "ok" : "fail");
      }
      E.sfx("wrong"); E.ui.fx("shake"); draw(`<div class="se-hint no">${esc(nat({ en: "Not quite — try again.", vi: "Chưa đúng — thử lại." }))}</div>`);
    };
    ui().onclick = e => {
      const b = e.target.closest("[data-b]"); if (b) { blank = +b.dataset.b; return draw(); }
      const o = e.target.closest("[data-o]"); if (o) { pick[blank] = +o.dataset.o; E.sfx("tap"); const nx = pick.findIndex(p => p < 0); if (nx >= 0) blank = nx; return draw(); }
      if (e.target.closest("[data-ok]") && pick.every(p => p >= 0)) check();
    };
    draw();
    E.autoRun(() => { ans.forEach((a, i) => (pick[i] = E.auto === "r" && Math.random() < 0.3 ? (a + 1) % opts[i].length : a)); tries = 9; check(); });
  }));

  // ═════════ MEMORY — lật thẻ ghép cặp ═════════
  // { memory: { prompt, pairs: [["harbour", "bến cảng"], …], moves: 0 (không giới hạn), ok, fail } }
  def("memory", c => new Promise(res => {
    const M = c.st.memory, rnd = seedRnd(c.key());
    const cards = M.pairs.flatMap((p, i) => [{ i, t: tgtOr(p[0]) }, { i, t: typeof p[1] === "string" ? p[1] : nat(p[1]) }]).map(x => [x, rnd()]).sort((a, b) => a[1] - b[1]).map(x => x[0]);
    // over = bước đã xong: hẹn giờ lật úp thẻ (650 ms) không được vẽ lại bảng đè lên bước sau
    const open = [], got = new Set(); let moves = 0, lock = false, over = false;
    E.ui.hideBox();
    const draw = () => over || E.ui.panel(`<div class="se-ask">${esc(nat(M.prompt || { en: "Match the pairs", vi: "Ghép các cặp" }))} <small class="se-mute">${moves}${M.moves ? "/" + M.moves : ""}</small></div>
      <div class="sp-mem">${cards.map((x, k) => `<button data-k="${k}" class="${got.has(x.i) ? "got" : open.includes(k) ? "open" : ""}"><span>${got.has(x.i) || open.includes(k) ? esc(x.t) : "?"}</span></button>`).join("")}</div>`, "memory");
    const fin = ok => { if (over) return; over = true; done(res, c, ok ? M.ok : M.fail, "memory", ok ? "ok" : "fail"); };
    ui().onclick = e => {
      const b = e.target.closest("[data-k]"); if (!b || lock) return; const k = +b.dataset.k;
      if (open.includes(k) || got.has(cards[k].i)) return;
      open.push(k); E.sfx("page"); draw();
      if (open.length === 2) {
        moves++; lock = true;
        setTimeout(() => {
          if (cards[open[0]].i === cards[open[1]].i) { got.add(cards[open[0]].i); E.sfx("solve"); }
          open.length = 0; lock = false; draw();
          if (got.size === M.pairs.length) return setTimeout(() => fin(true), 400);
          if (M.moves && moves >= M.moves) fin(false);
        }, 650);
      }
    };
    draw();
    E.autoRun(() => fin(true));
  }));

  // ═════════ REWIND — vòng lặp thời gian / trùng sinh ═════════
  // { rewind: { to: "morning", keep: ["knows_code", "agnes"], keepItems: ["key"], title: { en: "LOOP {n}", vi: "VÒNG {n}" }, max: 7, over: [bước khi hết vòng] } }
  // Xoá cờ / đồ / người đã gặp của vòng này (TRỪ keep / keepItems / mọi cờ bắt đầu bằng “k_” = kiến thức), tăng biến “loop”, hiện thẻ vòng mới,
  //   rồi nhảy về node `to`. Sự thật (truths) vốn giữ qua mọi lần chơi. Đồ “k_…” cũng được giữ.
  def("rewind", c => new Promise(res => {
    const W = c.st.rewind, R = E.R();
    const n = (+R.f.loop || 1) + 1;
    if (W.max && n > W.max) { if (W.over) c.push("rewind", "over"); return res(); }
    const keep = new Set(W.keep || []);
    const f = {};
    for (const k in R.f) if (keep.has(k) || k.startsWith("k_") || k.startsWith("__") || ["acc", "accN"].includes(k)) f[k] = R.f[k];
    f.loop = n;
    R.f = f;
    R.items = R.items.filter(id => (W.keepItems || []).includes(id) || id.startsWith("k_"));
    R.met = {}; R.cast = {}; R.used = {}; R.mood = null; R.cam = null; R.pic = null;
    if (R.meters) R.meters = {};
    E.ui.hide("*"); E.ui.clear(); E.ui.hud?.();
    E.effect.run("glitch"); E.sfx("whoosh");
    const t = W.title || { en: "LOOP {n}", vi: "VÒNG {n}" };
    E.ui.card(`<div class="se-ct time sp-loop"><small>${esc(nat({ en: "Again.", vi: "Lại nữa." }))}</small><b>${esc(nat(t).replace("{n}", n))}</b></div>`, 2600, "time").then(() => { E.jump(W.to); res(); });
  }));

  // ═════════ CLOCK — giờ trong truyện (góc trên, cạnh thanh chỉ số) ═════════
  // { clock: "08:10" } · { clock: "21:00", warn: true } (đỏ, nhấp nháy) · { clock: null } (ẩn)
  def("clock", async ({ st }) => {
    const R = E.R(); R.clock = st.clock ? { t: st.clock, warn: !!st.warn } : null;
    let el = document.querySelector(".sp-clock");
    if (!el) { el = h(`<div class="sp-clock"></div>`); document.querySelector(".se")?.appendChild(el); }
    el.hidden = !R.clock; if (!R.clock) return;
    el.textContent = R.clock.t; el.classList.toggle("warn", R.clock.warn);
    el.classList.remove("tick"); void el.offsetWidth; el.classList.add("tick");
    E.sfx("clock");
  });
  const restore1 = E.ui.restore; E.ui.restore = () => { restore1(); const R = E.R(), el = document.querySelector(".sp-clock"); if (R?.clock) E.mech.clock({ st: { clock: R.clock.t, warn: R.clock.warn } }); else if (el) el.hidden = true; };

  // ═════════ Sổ tay: tab GHI CHÚ (note) — thêm vào Sổ tay khi có ghi chép ═════════
  E.on("boot", () => {
    const book0 = E.ui.book;
    E.ui.book = (tab) => {
      book0(tab);
      const R = E.R(); if (!R.jot?.length) return;
      const tabs = document.querySelector(".se-sheet .se-tabs"); if (!tabs || tabs.querySelector("[data-jot]")) return;
      const b = h(`<button class="se-tab" data-jot>${esc(nat({ en: "Notes", vi: "Ghi chú" }))}</button>`); tabs.appendChild(b);
      b.onclick = e => { e.stopPropagation(); tabs.querySelectorAll(".se-tab").forEach(x => x.classList.toggle("on", x === b)); document.querySelector(".se-bookb").innerHTML = R.jot.slice().reverse().map(j => `<div class="se-wd"><b>${j.ch ? esc(nat({ en: "Ch. " + j.ch, vi: "Ch. " + j.ch })) : "•"}</b><span>${esc(nat(j.t))}</span></div>`).join(""); E.sfx("tap"); };
    };
  });
})();
