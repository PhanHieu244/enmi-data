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
  const cond = (c, s) => (c == null ? true : typeof c === "function" ? !!c(s) : typeof c === "string" ? s.truth(c) || s.has(c) || !!s.f[c] : typeof c === "object" && !Array.isArray(c) ? Object.entries(c).every(([k, v]) => (+s.f[k] || 0) >= v) : !!c);
  const seedRnd = key => { let x = E.hash(key) || 1; return () => ((x = (x * 1103515245 + 12345) >>> 0) % 10000) / 10000; };
  const cname = id => (id === "me" ? E.G().set.name : E.cname(E.S().chars[id] || {}, true));
  const color = id => (id === "me" ? "var(--se-me)" : E.S().chars[id]?.color || "#aaa");
  const face = id => `<span class="sp-av" style="--c:${color(id)}"><i class="im-${esc(id)}"></i><b>${esc((cname(id) || "?").charAt(0))}</b></span>`;
  const trOn = () => E.G().set.tr;
  const subHtml = o => { const s = sub(o); return s ? `<small class="sp-sub"${trOn() ? "" : " hidden"}>${esc(s)}</small>` : ""; };
  const ui = () => document.querySelector(".se-ui");
  // game feel: tia sáng nổ ra từ phần tử el (đúng = vàng/xanh, sai = đỏ) + chữ nổi bay lên (điểm, combo)
  const burst = (el, color = "#ffd166", n = 12) => {
    if (E.auto || !el) return;
    const r = el.getBoundingClientRect(), host = document.querySelector(".se-ui") || document.body, h = host.getBoundingClientRect();
    for (let i = 0; i < n; i++) {
      const p = document.createElement("i"), a = (i / n) * 6.283 + Math.random() * .5, d = 40 + Math.random() * 40;
      p.className = "se-pt"; p.style.cssText = `left:${r.left - h.left + r.width / 2}px;top:${r.top - h.top + r.height / 2}px;background:${color};--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d}px`;
      host.appendChild(p); setTimeout(() => p.remove(), 750);
    }
  };
  const floatTxt = (el, txt, color = "#ffd166") => {
    if (E.auto || !el) return;
    const r = el.getBoundingClientRect(), host = document.querySelector(".se-ui") || document.body, h = host.getBoundingClientRect();
    const t = document.createElement("b"); t.className = "se-fl"; t.textContent = txt;
    t.style.cssText = `left:${r.left - h.left + r.width / 2}px;top:${r.top - h.top}px;color:${color}`;
    host.appendChild(t); setTimeout(() => t.remove(), 900);
  };
  // xong 1 bước — CHỈ 1 LẦN mỗi bước (bấm 2 lần / hẹn giờ muộn gọi lại từng xoá bảng của bước SAU → kẹt; khỉ bấm của cover.js bắt được)
  const DONE = new WeakSet();
  const live = c => c?.live?.() !== false;
  // TÊN CHỈ SỐ cho người chơi (không lộ mã thô “courage”): story.stats.<mã> = { en, vi } → thanh chỉ số (meter) → mã viết hoa chữ đầu
  const WHEEL = ["#f2b84b", "#7fb2e5", "#ef7a6c", "#6fcf97", "#a78bfa", "#f472b6", "#22d3ee", "#fb923c"];
  const statName = k => nat(E.S().stats?.[k] || E.R().meters?.[k]?.label || { en: k.charAt(0).toUpperCase() + k.slice(1) });
  // biểu tượng: tên icon SVG của engine (E.ICON) — emoji truyện cũ ghi vào thì bỏ, dùng icon mặc định (người dùng không thích emoji)
  const icon = (name, dflt = "talk") => E.ICON[name] || E.ICON[dflt] || "";
  // kết luận THẮNG / THUA rõ ràng: biển lớn giữa màn (xanh ✓ / đỏ ✗) giữ ~1,2 giây trước khi sang bước sau (autoplay bỏ qua)
  const verdict = (ok, txt) => new Promise(r => {
    // gắn vào CẢ MÀN game (.se) — .se-ui chỉ cao bằng bảng đang mở nên biển bị cắt / không hiện
    const host = document.querySelector(".se") || ui(); if (E.auto || !host) return r();
    const d = document.createElement("div"); d.className = "se-verdict " + (ok ? "ok" : "no");
    d.innerHTML = `<i>${ok ? "✓" : "✗"}</i><b>${esc(txt || nat(ok ? { en: "Success!", vi: "Thành công!" } : { en: "Failed", vi: "Thất bại" }))}</b>`;
    host.appendChild(d); E.haptic(ok ? "MEDIUM" : "HEAVY");
    if (ok) { const i = d.querySelector("i"); ["#ffd166", "#6fcf97", "#7fb2e5", "#ff9ec7"].forEach((col, k) => setTimeout(() => burst(i, col, 10), k * 90)); }
    setTimeout(() => { d.remove(); r(); }, 1200);
  });
  E.verdict = verdict;
  // DIỄN BIẾN SAU mặc định (người dùng 30/10): truyện chưa viết phản ứng cho kết quả thì engine tự diễn 1 đoạn ngắn —
  //   nhân vật hiện ra nói 1 câu (có giọng) + dòng hệ quả (“Mia ♥ +3”) — để người chơi hiểu chuyện gì vừa xảy ra. Truyện có bước riêng thì dùng bước riêng.
  const aftermath = (who, line, note, fc) => new Promise(r => {
    if (E.auto) return r();
    if (who && who !== "me" && E.R().cast?.[who] && fc != null) E.ui.show(who, E.R().cast[who].at, fc);
    const el = E.ui.panel(`<div class="sp-after">${who ? face(who) : ""}<div class="lf-bub"><span>${esc(tgtOr(line))}</span>${subHtml(line)}</div></div>${note ? `<p class="sp-afn">${esc(note)}</p>` : ""}<button class="se-btn pri wide" data-ok>${T("cont")}</button>`, "after");
    if (who) E.say(tgtOr(line), who);
    el.onclick = e => { if (e.target.closest("[data-ok]")) { e.stopPropagation(); E.hush(); E.ui.clear(); r(); } };
  });
  E.aftermath = aftermath;
  const heart = (id, v) => `${cname(id)} ♥ ${v > 0 ? "+" : v < 0 ? "−" : "±"}${Math.abs(v)}`;
  // KÉO THẢ dùng chung: ui().onpointerdown = E.dragger({ src, dst, drop(srcEl, dstEl | null), ok(srcEl) })
  //   kéo > 8 px mới là kéo (chạm nhanh vẫn là click) · bóng theo ngón tay · ô thả đang trỏ có lớp .hov · E.dragged() = vừa thả xong (chặn click lỡ)
  let dragAt = 0, activeDrag = null;
  E.dragged = () => Date.now() - dragAt < 150;
  E.dragAt = () => { dragAt = Date.now(); };
  E.on("step", () => activeDrag?.());
  E.dragger = o => e => {
    const sEl = e.target.closest(o.src); if (activeDrag || !sEl || sEl.disabled || e.button > 0 || (o.ok && !o.ok(sEl))) return;
    const x0 = e.clientX, y0 = e.clientY, pid = e.pointerId; let ghost = null, over = null;
    const at = (x, y) => { const t = document.elementFromPoint(x, y)?.closest(o.dst); return t && t !== sEl ? t : null; };
    const cleanup = () => {
      document.removeEventListener("pointermove", mv); document.removeEventListener("pointerup", up); document.removeEventListener("pointercancel", up);
      ghost?.remove(); sEl.classList.remove("lifted"); over?.classList.remove("hov"); activeDrag = null;
    };
    const mv = ev => {
      if (ev.pointerId !== pid) return;
      if (!sEl.isConnected) return cleanup();
      if (!ghost) { if (Math.hypot(ev.clientX - x0, ev.clientY - y0) < 8) return; const r = sEl.getBoundingClientRect(); ghost = sEl.cloneNode(true); ghost.classList.add("se-ghost"); ghost.style.width = r.width + "px"; document.body.appendChild(ghost); sEl.classList.add("lifted"); E.haptic("LIGHT"); }
      ev.preventDefault(); ghost.style.left = ev.clientX + "px"; ghost.style.top = ev.clientY + "px";
      const t = at(ev.clientX, ev.clientY); if (t !== over) { over?.classList.remove("hov"); over = t; over?.classList.add("hov"); }
    };
    const up = ev => {
      if (ev.pointerId !== pid) return;
      const moved = !!ghost, target = ev.type === "pointercancel" ? null : at(ev.clientX, ev.clientY), connected = sEl.isConnected;
      cleanup(); if (!moved) return; dragAt = Date.now();
      // A cancelled gesture must not remove a card, gift, ingredient or planned stop.
      if (ev.type !== "pointercancel" && connected) o.drop(sEl, target);
    };
    activeDrag = cleanup;
    document.addEventListener("pointermove", mv, { passive: false }); document.addEventListener("pointerup", up); document.addEventListener("pointercancel", up);
  };
  // NHÁY ĐÚNG / SAI (người dùng 30/10): phần tử vừa trả lời sáng xanh / đỏ ~0,8 s cho dễ biết đúng hay sai
  E.flash = (el, ok, ms = 800) => { if (!el || E.auto) return; el.classList.remove("fx-ok", "fx-no"); void el.offsetWidth; el.classList.add(ok ? "fx-ok" : "fx-no"); setTimeout(() => el.classList.remove("fx-ok", "fx-no"), ms); };
  // cho cơ chế ở file khác (mech-life.js) dùng chung hiệu ứng
  E.fxBurst = burst; E.fxFloat = floatTxt;
  const done = (res, c, key, ...path) => { if (DONE.has(res)) return; DONE.add(res); if (live(c)) { E.ui.clear(); if (key) c.push(...path); } res(); };
  // A missing set of choices is not a successful play. Keep the original negative
  // branch contracts and allow authors to distinguish unavailable content with empty.
  const unavailable = (res, c, kind, message, branches) => {
    const spec = c.st[kind], branch = branches.find(k => Array.isArray(spec[k]));
    c.resumeHere?.(); E.ui.hideBox();
    const finish = () => {
      if (!live(c) || DONE.has(res)) return;
      c.resumeHere?.(false); done(res, c, branch && spec[branch], kind, branch);
    };
    const el = E.ui.panel(`<div class="se-ask" role="status">${esc(nat(message))}</div><button class="se-btn pri wide" data-unavailable>${T("cont")}</button>`, kind);
    el.onclick = e => { if (e.target.closest("[data-unavailable]")) finish(); };
    c.onCancel?.(() => { DONE.add(res); res(); });
    E.autoRun(finish);
  };

  // ═════════ CHAT — nhắn tin ═════════
  // { chat: { with: "ellie", msgs: [{ from: "ellie" | "me", en, vi, pic }], reply: [{ en, vi, set, add, then, if }], wait } }
  def("chat", c => new Promise(res => {
    const C = c.st.chat, R = E.R(), who = C.with;
    E.ui.hideBox();
    const log = (R.chats ||= {})[who] ||= [];
    let shown = [], seen = false;
    c.onCancel?.(() => { DONE.add(res); res(); });
    // tin cũ = tin TRƯỚC lần nhắn này (tin mới vừa gửi đã nằm trong shown — trước đây lấy cả log → tin mới hiện 2 lần)
    const base = log.length;
    const draw = (typing, opts) => {
      if (DONE.has(res) || !live(c)) return;
      E.ui.panel(`<div class="sp-phone"><div class="sp-ph">${face(who)}<b>${esc(cname(who))}</b><small>${esc(nat({ en: "online", vi: "đang hoạt động" }))}</small></div>
        <div class="sp-msgs">${[...log.slice(Math.max(0, base - 6), base).map(m => ({ ...m, old: 1 })), ...shown].map(m => `<div class="sp-m ${m.from === "me" ? "me" : m.from === "sys" ? "sys" : "them"}${m.old ? " old" : ""}">${m.pic ? `<i class="sp-mp im-${esc(m.pic)}"></i>` : ""}${E.words(tgtOr(m), E.L)}${subHtml(m)}</div>`).join("")}${!typing && shown.length && shown[shown.length - 1].from === "me" && seen ? `<small class="sp-seen">${esc(nat({ en: "Seen", vi: "Đã xem" }))}</small>` : ""}${typing ? `<div class="sp-m them typing"><i></i><i></i><i></i></div>` : ""}</div>
        ${opts ? `<div class="sp-rep">${opts.map(({ o, i }) => `<button class="se-ch-b" data-r="${i}"><span>${esc(tgtOr(o))}</span>${subHtml(o)}</button>`).join("")}</div>` : ""}</div>`, "chat");
      const m = document.querySelector(".sp-msgs"); if (m) m.scrollTop = m.scrollHeight;
    };
    (async () => {
      for (const m of C.msgs || []) {
        if (!live(c) || DONE.has(res)) return;
        if (m.from !== "me" && !E.auto) { draw(true); await new Promise(r => setTimeout(r, Math.min(1800, 500 + tgtOr(m).length * 22))); }
        if (!live(c) || DONE.has(res)) return;
        shown.push(m); log.push({ ...m }); E.sfx(m.from === "me" ? "tap" : "phone"); draw(false);
        if (!E.auto) await new Promise(r => setTimeout(r, 260));
      }
      if (!live(c) || DONE.has(res)) return;
      const opts = (C.reply || []).map((o, i) => ({ o, i })).filter(({ o }) => cond(o.if, c.s));
      if (!opts.length) { if (!E.auto) await new Promise(r => setTimeout(r, C.wait ?? 900)); return done(res, c); }
      draw(false, opts);
      if (C.ms && !E.auto) document.querySelector(".sp-rep")?.insertAdjacentHTML("beforebegin", `<div class="se-timer sp-rt"><i style="animation-duration:${C.ms / 1000}s"></i></div>`);
      let sent = false;
      const tmo = C.ms && !E.auto ? setTimeout(() => { if (sent || !live(c) || DONE.has(res)) return; sent = true; E.sfx("down"); E.flag((C.key || "chat_" + who) + "_missed", 1); shown.push({ from: "sys", en: "You didn't reply.", vi: "Bạn đã không trả lời." }); draw(false); setTimeout(() => done(res, c, C.timeout, "chat", "timeout"), 1100); }, C.ms) : 0;
      const go = i => { if (sent || !live(c) || DONE.has(res)) return; sent = true; clearTimeout(tmo); const o = C.reply[i]; shown.push({ from: "me", ...o }); log.push({ from: "me", en: o.en, [E.N]: o[E.N], [E.L]: o[E.L] }); draw(false); E.apply(o); E.sfx("tap"); if (!E.auto) setTimeout(() => { seen = true; if (!DONE.has(res) && live(c)) draw(false); }, 450); setTimeout(() => done(res, c, o.then, "chat", "reply", i, "then"), E.auto ? 1 : 1000); };
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
    const go = k => { if (fin || !live(c)) return; fin = true; clearInterval(ring); clearTimeout(tm); const key = C[k] ? k : k === "missed" && C.decline ? "decline" : null; done(res, c, key, "call", key); };
    const tm = setTimeout(() => go("missed"), (C.ring || 10) * 1000);
    c.onCancel?.(() => { fin = true; clearInterval(ring); clearTimeout(tm); DONE.add(res); res(); });
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

  // ═════════ LỜI KHAI làm manh mối ═════════
  // { quote: { id, who, en, vi } } · hoặc gắn vào câu thoại: { say: "rex", en: "I was home.", vi, quote: "rex_home" | true }
  //   → lưu vào R.quotes, thành thẻ “lời khai” trên bảng điều tra (mã thẻ q:<id>). story.quotes = { id: { who, en, vi } } khai sẵn cũng được.
  const quoteOf = id => E.R().quotes?.[id] || E.S().quotes?.[id];
  const addQuote = (id, q, quiet) => {
    const R = E.R(); R.quotes ||= {}; if (R.quotes[id]) return;
    R.quotes[id] = { who: q.who, en: q.en, [E.N]: q[E.N], [E.L]: q[E.L], vi: q.vi };
    if (!quiet && !E.auto) E.ui.toast(`${E.ICON.pen}<span><small>${esc(nat({ en: "Statement saved", vi: "Đã lưu lời khai" }))}</small>${esc(cname(q.who))}</span>`, 1800);
  };
  E.addQuote = addQuote;
  def("quote", async ({ st }) => { const q = typeof st.quote === "string" ? { id: st.quote, ...(E.S().quotes?.[st.quote] || {}) } : st.quote; addQuote(q.id, q, q.quiet); });
  E.side("quote", async (v, st) => { if (!st.say) return; const id = v === true ? "q" + E.hash(st.say + (st.en || "")) : v; addQuote(id, { who: st.say, en: st.en, vi: st.vi, [E.N]: st[E.N], [E.L]: st[E.L] }); });

  // ═════════ BOARD — bảng điều tra kiểu bảng vẽ ═════════
  // { board: { q, links: [{ id, ids: ["cap", "q:rex_home"] | a, b, label: { en, vi }, gives: ["receipt", "q:x"], then }], cards: [mã thêm], need, tries, hint, ok, fail } }
  // Thẻ = đồ vật trong túi · lời khai (q:<id>) · kết luận đã tìm (k:<id của link>, nối tiếp được). Khay dưới cuộn ngang, lọc theo loại.
  // Kéo thẻ từ khay lên bảng (chỗ tuỳ ý), kéo thẻ để sắp xếp · chạm thẻ = xem trước (Đưa lên / Bỏ xuống / Nối với…) · kéo từ ĐINH ĐỎ sang thẻ khác = nối dây.
  // Chỉ nối được 2 thẻ cùng thuộc 1 kết luận (sai = mất lượt nếu có tries). Kết luận ra khi MỌI thẻ của nó nối thành 1 cụm → thẻ kết luận mới + gives mở thêm manh mối.
  // Vị trí thẻ, dây, kết luận lưu theo bước (quay lại bảng vẫn y nguyên).
  // màu dây theo kết luận: đỏ · xanh dương · xanh lá · tím · cam · hồng (đủ tương phản trên nền bảng gỗ)
  const STR = ["#d63c32", "#2f6fdb", "#2f9e5b", "#8e5bd6", "#e07b1f", "#d6457f"];
  def("board", c => new Promise(res => {
    const B = c.st.board, R = E.R(), S = E.S();
    c.resumeHere?.();
    const idsOf = l => l.ids || [l.a, l.b];
    const lid = (l, i) => l.id || "L" + i;
    const st = (R.used[c.key("bd")] ||= { pos: {}, str: [], got: [] });
    const old = R.used[c.key("got")]; if (old && !st.got.length) st.got = String(old).split(",").filter(Boolean).map(Number);
    const need = B.need ?? B.links.length;
    let tab = st.tab || "all", pv = null, link = st.link || null, miss = st.miss || 0, msg = "", busy = false, ending = false;
    let dragCleanup = null, resultTimer = null, keyDown = null, focusAfterPreview = null;
    let lastPin = null, lastPinAt = 0;
    const persist = () => { st.tab = tab; st.link = link; st.miss = miss; E.save(); };
    c.onCancel?.(() => { ending = busy = true; clearTimeout(resultTimer); dragCleanup?.(true); if (keyDown) ui().removeEventListener("keydown", keyDown); DONE.add(res); res(); });
    E.ui.hideBox();
    const info = id => {
      if (id.startsWith("q:")) { const q = quoteOf(id.slice(2)); return q && { kind: "q", name: cname(q.who), text: q, who: q.who }; }
      if (id.startsWith("k:")) { const i = B.links.findIndex((l, k) => lid(l, k) === id.slice(2)); return i >= 0 && st.got.includes(i) && { kind: "k", name: nat({ en: "Conclusion", vi: "Kết luận" }), text: B.links[i].label }; }
      const it = S.items[id]; return it && R.items.includes(id) && { kind: "i", name: nat(it.name), desc: it.desc };
    };
    const pool = () => [...new Set([...R.items, ...Object.keys(R.quotes || {}).map(k => "q:" + k), ...(B.cards || []), ...st.got.map(i => "k:" + lid(B.links[i], i))])].filter(id => info(id));
    const onB = id => !!st.pos[id];
    const art = id => { const f = info(id); return f.kind === "i" ? E.itemArt(id, "sm") : f.kind === "q" ? `<span class="sp-qav">${face(f.who)}</span>` : `<span class="sp-kav">${E.ICON.bulb}</span>`; };
    const short = id => { const f = info(id); return f.kind === "i" ? esc(f.name) : `<b>${esc(f.name)}</b><small>${esc(tgtOr(f.text))}</small>`; };
    const W = 640, H = 520;
    const freeSpot = () => { const n = Object.keys(st.pos).length, col = n % 5, row = Math.floor(n / 5); return [24 + col * 120 + (row % 2) * 30, 30 + row * 110]; };
    const put = (id, xy) => { st.pos[id] = xy || freeSpot(); E.sfx("pick"); E.haptic("LIGHT"); persist(); };
    const draw = () => {
      if (!live(c) || ending) return;
      if (link && (!info(link) || !onB(link))) link = null;
      const active = document.activeElement, focusedPin = active?.dataset?.tack, focusedCard = active?.dataset?.cardOpen;
      const oldBoard = document.querySelector("[data-bw]"), oldTray = document.querySelector("[data-tray]"), oldPanel = document.querySelector(".se-panel.board");
      const scroll = oldBoard ? { left: oldBoard.scrollLeft, top: oldBoard.scrollTop, tray: oldTray?.scrollLeft || 0, panel: oldPanel?.scrollTop || 0 } : (st.scroll || { left: 0, top: 0, tray: 0, panel: 0 });
      st.scroll = scroll;
      const all = pool(), tray = all.filter(id => !onB(id) && (tab === "all" || info(id).kind === tab));
      const hl = B.hint !== false && miss >= 2 ? B.links.find((l, i) => !st.got.includes(i) && idsOf(l).every(id => info(id))) : null;
      E.ui.panel(`<div class="sp-bd3"><div class="se-ddh">${E.ICON.bulb}<small>${esc(nat({ en: "Case board", vi: "Bảng điều tra" }))}</small><span class="sp-pips2">${B.links.map((_, i) => `<i class="${st.got.includes(i) ? "on" : ""}"></i>`).join("")}</span></div>
        <b class="se-ddq">${esc(nat(B.q))}</b>
        <p class="se-mute sp-bdh" aria-live="polite">${esc(nat(link ? { en: `Connect “${info(link)?.name || ""}”: tap another red pin or card. Tap the selected pin again, or the empty board, to cancel.`, vi: `Nối “${info(link)?.name || ""}”: chạm ghim đỏ hoặc thẻ khác. Chạm lại ghim đã chọn, hoặc chỗ trống trên bảng, để hủy.` } : { en: "Tap a clue and choose Put on the board, or drag it up. Tap two red pins to connect them, or drag from a pin to another card. Tap a card to inspect it.", vi: "Chạm thẻ rồi chọn Đưa lên bảng, hoặc kéo thẻ lên. Chạm lần lượt hai ghim đỏ để nối, hoặc kéo từ ghim sang thẻ khác. Chạm thẻ để xem kỹ." }))}</p>
        <div class="sp-bw" data-bw><div class="sp-bc" data-bc style="width:${W}px;height:${H}px"><svg class="sp-str" data-str viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"></svg>
          ${Object.entries(st.pos).filter(([id]) => info(id)).map(([id, [x, y]]) => `<div class="sp-card k-${info(id).kind}${link === id ? " on" : ""}${hl && idsOf(hl)[0] === id ? " hint" : ""}" data-bid="${esc(id)}" style="left:${x}px;top:${y}px;--r:${((E.hash(id) % 7) - 3) * 0.8}deg"><button type="button" class="sp-tack" data-tack="${esc(id)}" aria-label="${esc(nat({ en: `Connect from ${info(id).name}`, vi: `Nối từ ${info(id).name}` }))}" aria-pressed="${link === id}" style="width:44px;height:44px;min-width:44px;min-height:44px;top:-14px;margin-left:-22px;padding:0;border:0;background:transparent;box-shadow:none"><i aria-hidden="true" style="position:absolute;left:13px;top:13px;width:18px;height:18px;border-radius:50%;background:#d63c32;box-shadow:0 2px 3px rgba(0,0,0,.4);pointer-events:none"></i></button><button type="button" data-card-open="${esc(id)}" aria-label="${esc(nat({ en: `Inspect ${info(id).name}`, vi: `Xem kỹ ${info(id).name}` }))}" style="display:grid;justify-items:center;gap:3px;width:100%;padding:0;border:0;background:transparent;color:inherit;font:inherit;text-align:inherit;touch-action:none">${art(id)}<span class="sp-cn">${short(id)}</span></button></div>`).join("")}
          ${Object.keys(st.pos).length ? "" : `<p class="sp-bempty">${esc(nat({ en: "Tap a clue below to place it here, or drag it up", vi: "Chạm thẻ bên dưới để đưa lên bảng, hoặc kéo thẻ lên" }))}</p>`}</div></div>
        <div class="sp-trh"><span>${E.ICON.box}${esc(nat({ en: "Your clues — tap or drag onto the board", vi: "Manh mối — chạm hoặc kéo lên bảng" }))} · <b>${all.filter(id => !onB(id)).length}</b></span><div class="fx-seg sp-tabs">${[["all", { en: "All", vi: "Tất cả" }], ["i", { en: "Items", vi: "Đồ vật" }], ["q", { en: "Statements", vi: "Lời khai" }], ["k", { en: "Conclusions", vi: "Kết luận" }]].map(([k, t]) => `<button data-tab="${k}" class="${tab === k ? "on" : ""}">${esc(nat(t))}</button>`).join("")}</div></div>
        <div class="sp-tray" data-tray>${tray.map(id => `<button class="sp-tc k-${info(id).kind}" data-tid="${esc(id)}">${art(id)}<span class="sp-cn">${short(id)}</span></button>`).join("") || `<small class="se-mute">${esc(nat(all.length ? { en: "Everything is on the board.", vi: "Đã đưa hết lên bảng." } : { en: "No clues yet.", vi: "Chưa có manh mối." }))}</small>`}</div>
        ${msg}
        <div class="sp-bdl2">${B.links.map((l, i) => st.got.includes(i) ? `<div class="sp-con" data-kc="${i}" style="border-left-color:${STR[i % STR.length]}"><em style="color:${STR[i % STR.length]}">${i + 1}</em><span>${esc(nat(l.label))}</span></div>` : "").join("") || ""}${B.links.length - st.got.length ? `<div class="sp-con off"><em>?</em><span>${esc(nat({ en: `${B.links.length - st.got.length} conclusions still hidden`, vi: `Còn ${B.links.length - st.got.length} kết luận chưa tìm ra` }))}</span></div>` : ""}</div>
        <button class="se-btn wide${st.got.length >= need ? " pri" : " ghost"}" data-end>${esc(nat(st.got.length >= need ? { en: "Done", vi: "Xong" } : { en: "I can't find more — move on", vi: "Không tìm thêm được — đi tiếp" }))}</button>
        ${pv ? preview(pv) : ""}</div>`, "deduce board");
      strings(); msg = "";
      const bw = document.querySelector("[data-bw]"), tr = document.querySelector("[data-tray]"), panel = document.querySelector(".se-panel.board");
      if (bw) { bw.scrollLeft = scroll.left; bw.scrollTop = scroll.top; } if (tr) tr.scrollLeft = scroll.tray; if (panel) panel.scrollTop = scroll.panel;
      if (pv) document.querySelector("[data-pvon], [data-pvlink]")?.focus({ preventScroll: true });
      else { const sel = focusedPin ? `[data-tack="${CSS.escape(focusedPin)}"]` : (focusedCard || focusAfterPreview) ? `[data-card-open="${CSS.escape(focusedCard || focusAfterPreview)}"]` : null; if (sel) document.querySelector(sel)?.focus({ preventScroll: true }); focusAfterPreview = null; }
      persist();
    };
    // xem trước 1 thẻ: ảnh to, mô tả / lời khai (+ nghe lại) · nút theo chỗ thẻ đang nằm
    const preview = id => { const f = info(id); if (!f) return ""; const on = onB(id);
      return `<div class="sp-pv" data-pvbg><div class="sp-pvc k-${f.kind}"><button class="sp-pvx" data-pvx aria-label="close">${E.ICON.x}</button>
        <div class="sp-pva">${f.kind === "i" ? E.itemArt(id, "md") : f.kind === "q" ? face(f.who) : `<span class="sp-kav lg">${E.ICON.bulb}</span>`}</div>
        <b>${esc(f.name)}</b>${f.kind === "i" ? (f.desc ? `<p>${esc(nat(f.desc))}</p>` : "") : `<p class="sp-pvq">${E.words(tgtOr(f.text), E.L)}</p>${subHtml(f.text)}`}
        <div class="se-row">${f.kind === "q" ? `<button class="se-btn" data-pvsay>${E.ICON.spk} ${esc(nat({ en: "Listen", vi: "Nghe" }))}</button>` : ""}${on ? `<button class="se-btn" data-pvoff>${esc(nat({ en: "Take off the board", vi: "Bỏ khỏi bảng" }))}</button><button class="se-btn pri" data-pvlink>${esc(nat({ en: "Connect to…", vi: "Nối với…" }))}</button>` : `<button class="se-btn pri" data-pvon>${esc(nat({ en: "Put on the board", vi: "Đưa lên bảng" }))}</button>`}</div></div></div>`; };
    const strings = () => {
      const svg = document.querySelector("[data-str]"); if (!svg) return;
      const ctr = id => { const p = st.pos[id]; return p && [p[0] + 50, p[1] + 8]; };
      // mỗi kết luận 1 màu dây (người dùng 30/10: dây qua cùng 1 thẻ phải phân biệt được) · độ võng khác nhau theo kết luận để dây không chồng
      svg.innerHTML = st.str.map(k => { const [a, b] = k.split("|"), p = ctr(a), q = ctr(b); if (!p || !q) return ""; const li = linkOfStr(k), dx = q[0] - p[0], dy = q[1] - p[1], dist = Math.hypot(dx, dy) || 1, sag = Math.min(30, 6 + dist * 0.09) + (li % 3) * 4;
        // võng nhẹ như sợi chỉ: lệch vuông góc với đoạn nối (ngang → võng xuống, dọc → lệch sang bên), tỉ lệ với độ dài
        const nx = -dy / dist, ny = dx / dist, sgn = ny < 0 || (ny === 0 && li % 2) ? -1 : 1, cx = (p[0] + q[0]) / 2 + nx * sag * sgn, cy = (p[1] + q[1]) / 2 + ny * sag * sgn;
        return `<path style="stroke:${STR[li % STR.length]}" d="M${p[0]} ${p[1]} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${q[0]} ${q[1]}"/>`; }).join("");
    };
    // dây a|b thuộc kết luận nào: ưu tiên kết luận đã tìm, rồi kết luận đầu tiên chứa cả 2 thẻ
    const linkOfStr = k => { const [a, b] = k.split("|"), has = l => idsOf(l).includes(a) && idsOf(l).includes(b); const f = B.links.findIndex((l, i) => st.got.includes(i) && has(l)); return Math.max(0, f >= 0 ? f : B.links.findIndex(has)); };
    const finish = async () => { if (ending || !live(c)) return; ending = busy = true; c.resumeHere?.(false); E.flag(B.key || "board_" + c.key(), st.got.length); const branch = st.got.length >= need ? "ok" : "fail"; if (B[branch]) c.push("board", branch); persist(); if (B.ok || B.fail) await verdict(st.got.length >= need); done(res, c, false); };
    // nối a–b: chỉ khi có kết luận chứa cả 2 · rồi xem kết luận nào đã đủ cụm
    const connect = (a, b) => {
      if (ending || !live(c)) return;
      link = null; if (!a || !b || a === b || !info(a) || !info(b) || !onB(a) || !onB(b)) return draw();
      const k = [a, b].sort().join("|");
      if (st.str.includes(k)) { msg = `<div class="se-hint">${esc(nat({ en: "Already connected.", vi: "Đã nối rồi." }))}</div>`; return draw(); }
      if (!B.links.some(l => idsOf(l).includes(a) && idsOf(l).includes(b))) {
        miss++; E.sfx("wrong"); E.haptic("HEAVY");
        if (B.tries && miss >= B.tries) return finish();
        msg = `<div class="se-hint no">${esc(nat({ en: "Those two don't connect.", vi: "Hai thứ này không liên quan." }))}${B.tries ? " " + esc(nat({ en: `${B.tries - miss} tries left.`, vi: `Còn ${B.tries - miss} lần.` })) : ""}</div>`;
        draw(); [a, b].forEach(id => document.querySelector(`[data-bid="${CSS.escape(id)}"]`)?.classList.add("bad")); return;
      }
      st.str.push(k); E.sfx("tap"); E.haptic("LIGHT");
      const fresh = [];
      B.links.forEach((l, i) => {
        if (st.got.includes(i)) return;
        const ids = idsOf(l); if (!ids.every(id => st.pos[id])) return;
        // cụm liên thông qua dây giữa các thẻ của kết luận này
        const seen = new Set([ids[0]]), q = [ids[0]];
        while (q.length) { const x = q.pop(); for (const s2 of st.str) { const [u, v] = s2.split("|"); const y = u === x ? v : v === x ? u : null; if (y && ids.includes(y) && !seen.has(y)) { seen.add(y); q.push(y); } } }
        if (ids.every(id => seen.has(id))) fresh.push(i);
      });
      if (!fresh.length) return draw();
      for (const i of fresh) { st.got.push(i); E.apply(B.links[i]); for (const g of B.links[i].gives || []) { if (g.startsWith("q:")) { const q = S.quotes?.[g.slice(2)]; if (q) addQuote(g.slice(2), q, true); } else if (!R.items.includes(g)) R.items.push(g); } }
      E.sfx("solve"); E.haptic("MEDIUM"); E.ui.fx("solve");
      const got1 = B.links[fresh[0]], gives = fresh.flatMap(i => B.links[i].gives || []);
      msg = `<div class="se-hint sp-new">${esc(nat({ en: "New conclusion", vi: "Kết luận mới" }))}: <b>${esc(nat(got1.label))}</b>${gives.length ? `<br>${esc(nat({ en: `+${gives.length} new clue(s) in your tray`, vi: `+${gives.length} manh mối mới trong khay` }))}` : ""}</div>`;
      draw(); burst(document.querySelector(`[data-bid="${CSS.escape(b)}"]`), "#e0523f", 16);
      const th = fresh.find(i => B.links[i].then);
      if (th != null || st.got.length >= B.links.length) { busy = true; if (th != null) { c.resumeHere?.(false); c.again(); c.push("board", "links", th, "then"); persist(); } resultTimer = setTimeout(() => { if (!live(c) || ending) return; if (th != null) { E.ui.clear(); return res(); } finish(); }, E.auto ? 0 : 1400); }
    };
    // con trỏ: kéo thẻ khay → bảng · kéo thẻ trên bảng = di chuyển · kéo từ đinh = dây (vẽ dây tạm theo ngón tay)
    ui().onpointerdown = e => {
      if (busy || pv || dragCleanup || !live(c)) return;
      const tack = e.target.closest("[data-tack]"), card = e.target.closest("[data-bid]"), tc = e.target.closest("[data-tid]");
      const el = tack || card || tc; if (!el || e.button > 0) return;
      const bc = document.querySelector("[data-bc]"), x0 = e.clientX, y0 = e.clientY, pointer = e.pointerId; let moved = false, ghost = null;
      const local = ev => { const r = bc.getBoundingClientRect(); return [ev.clientX - r.left, ev.clientY - r.top]; };
      const id = tack ? tack.dataset.tack : card ? card.dataset.bid : tc.dataset.tid, p0 = st.pos[id] && [...st.pos[id]];
      const mv = ev => {
        if (ev.pointerId !== pointer || !live(c)) return;
        if (!moved && Math.hypot(ev.clientX - x0, ev.clientY - y0) < 8) return; moved = true; ev.preventDefault();
        if (tack) { const p = st.pos[id], [x, y] = local(ev), svg = document.querySelector("[data-str]"); svg.querySelector(".tmp")?.remove(); svg.insertAdjacentHTML("beforeend", `<path class="tmp" d="M${p[0] + 50} ${p[1] + 8} L${x} ${y}"/>`); return; }
        if (card) { const [x, y] = local(ev); st.pos[id] = [Math.max(0, Math.min(W - 100, x - 50)), Math.max(0, Math.min(H - 90, y - 20))]; card.style.left = st.pos[id][0] + "px"; card.style.top = st.pos[id][1] + "px"; strings(); return; }
        if (!ghost) { ghost = tc.cloneNode(true); ghost.classList.add("se-ghost"); document.body.appendChild(ghost); tc.classList.add("lifted"); E.haptic("LIGHT"); }
        ghost.style.left = ev.clientX + "px"; ghost.style.top = ev.clientY + "px";
      };
      const up = ev => {
        if (ev.pointerId !== pointer) return;
        dragCleanup?.(false);
        if (!moved) return;
        E.dragAt?.();
        if (ev.type === "pointercancel" || !live(c)) { ghost?.remove(); tc?.classList.remove("lifted"); if (card && p0) st.pos[id] = p0; if (live(c)) draw(); return; }
        if (tack) { document.querySelector("[data-str] .tmp")?.remove(); const t = document.elementFromPoint(ev.clientX, ev.clientY)?.closest("[data-bid]"); return t ? connect(id, t.dataset.bid) : strings(); }
        if (card) return persist();
        ghost?.remove(); tc.classList.remove("lifted");
        const over = document.elementFromPoint(ev.clientX, ev.clientY)?.closest("[data-bw]");
        if (over) { const [x, y] = local(ev); put(id, [Math.max(0, Math.min(W - 100, x - 50)), Math.max(0, Math.min(H - 90, y - 20))]); } else if (p0) st.pos[id] = p0;
        draw();
      };
      dragCleanup = cancel => { document.removeEventListener("pointermove", mv); document.removeEventListener("pointerup", up); document.removeEventListener("pointercancel", up); dragCleanup = null; if (cancel) { ghost?.remove(); tc?.classList.remove("lifted"); document.querySelector("[data-str] .tmp")?.remove(); if (card && p0) st.pos[id] = p0; } };
      document.addEventListener("pointermove", mv, { passive: false }); document.addEventListener("pointerup", up); document.addEventListener("pointercancel", up);
    };
    ui().onclick = e => {
      if (busy || E.dragged() || !live(c)) return;
      const t = e.target;
      if (pv) {
        if (t.closest("[data-pvx]") || (t.closest("[data-pvbg]") && !t.closest(".sp-pvc"))) { focusAfterPreview = pv; pv = null; return draw(); }
        if (t.closest("[data-pvsay]")) { const f = info(pv); return E.say(tgtOr(f.text), f.who, { force: true }); }
        if (t.closest("[data-pvon]")) { put(pv); focusAfterPreview = pv; pv = null; return draw(); }
        if (t.closest("[data-pvoff]")) { delete st.pos[pv]; st.str = st.str.filter(k => !k.split("|").includes(pv)); pv = null; E.sfx("tap"); return draw(); }
        if (t.closest("[data-pvlink]")) { link = pv; pv = null; return draw(); }
        return;
      }
      const tb = t.closest("[data-tab]"); if (tb) { tab = tb.dataset.tab; E.sfx("tap"); return draw(); }
      const pin = t.closest("[data-tack]");
      if (pin) { const id = pin.dataset.tack, now = performance.now(); if (lastPin === id && now - lastPinAt < 280) return; lastPin = id; lastPinAt = now; if (link === id) { link = null; return draw(); } if (link) return connect(link, id); link = id; E.sfx("tap"); return draw(); }
      const card = t.closest("[data-bid]");
      if (card) { if (link) return connect(link, card.dataset.bid); pv = card.dataset.bid; E.sfx("page"); return draw(); }
      const tc = t.closest("[data-tid]"); if (tc) { pv = tc.dataset.tid; E.sfx("page"); return draw(); }
      if (link && t.closest("[data-bw]")) { link = null; return draw(); }
      if (t.closest("[data-end]")) finish();
    };
    keyDown = e => { if (e.repeat && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); return; } if (e.key === "Escape" && (pv || link)) { e.preventDefault(); e.stopPropagation(); if (pv) focusAfterPreview = pv; pv = null; link = null; draw(); } };
    ui().addEventListener("keydown", keyDown);
    if (st.got.length >= B.links.length) return finish();
    draw();
    // tự chơi: đưa thẻ của từng kết luận lên bảng rồi nối lần lượt (kết luận mở ra thẻ mới thì làm tiếp)
    E.autoRun(function step() {
      if (DONE.has(res) || ending || !live(c)) return;
      const i = B.links.findIndex((l, k) => !st.got.includes(k) && idsOf(l).every(id => info(id)));
      if (i < 0) return finish();
      const ids = idsOf(B.links[i]); ids.forEach(id => st.pos[id] || (st.pos[id] = freeSpot()));
      busy = false; for (let k = 1; k < ids.length; k++) connect(ids[k - 1], ids[k]);
      if (!DONE.has(res) && !B.links[i].then) later(step);
    });
  }));

  // ═════════ COMPARE v2 — bắt lỗi biên bản: tìm đúng TỪ bị sửa ═════════
  // { compare: { title, left: { title: "Recording", lines: [{ en, vi }] }, right: { title: "Transcript", lines }, diffs: [dòng có sửa], tries: 3, listen, who, ok, fail } }
  // Mỗi dòng: bản GỐC ở trên (listen: true = chỉ nghe ▶, xem chữ mất 1 tim), bản SAO ở dưới — chạm vào TỪ bị sửa trong bản sao.
  // Từ bị sửa engine tự tìm (so từng từ với bản gốc); cụm sửa liền nhau = 1 lỗi. Dòng chỉ bị xoá bớt chữ → chạm cả dòng.
  // Đúng: đóng dấu đỏ, hiện chữ gốc ngay trên · sai: mất 1 tim. Tìm đủ = ok; hết tim / bấm Xong khi chưa đủ = fail.
  const cwords = t => String(t).split(/\s+/).filter(Boolean), ckey = w => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
  const keepOf = (a, b) => {
    const m = a.length, n = b.length, d = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = m - 1; i >= 0; i--) for (let j = n - 1; j >= 0; j--) d[i][j] = ckey(a[i]) === ckey(b[j]) ? d[i + 1][j + 1] + 1 : Math.max(d[i + 1][j], d[i][j + 1]);
    const keep = new Set(); let i = 0, j = 0;
    while (i < m && j < n) { if (ckey(a[i]) === ckey(b[j])) { keep.add(j); i++; j++; } else if (d[i + 1][j] >= d[i][j + 1]) i++; else j++; }
    return keep;
  };
  def("compare", c => new Promise(res => {
    const C = c.st.compare, hearts = C.tries ?? 3, who = C.who || "narr";
    const rows = C.right.lines.map((l, i) => {
      const org = C.left.lines[i] || "", cw = cwords(tgtOr(l)), keep = keepOf(cwords(tgtOr(org)), cw), hit = C.diffs.includes(i);
      const bad = cw.map((_, j) => hit && !keep.has(j));
      return { i, l, org, cw, bad, whole: hit && !bad.some(Boolean) };
    });
    const targets = []; rows.forEach(r => { if (r.whole) targets.push(r.i + ":-1"); else r.bad.forEach((b, j) => { if (b && !(j > 0 && r.bad[j - 1])) targets.push(r.i + ":" + j); }); });
    const tOf = (r, j) => { const R0 = rows[r]; if (R0.whole) return r + ":-1"; if (j < 0 || !R0.bad[j]) return null; while (j > 0 && R0.bad[j - 1]) j--; return r + ":" + j; };
    const found = new Set(), shown = new Set(), missW = new Set(); let wrong = 0, over = false;
    E.ui.hideBox();
    const rowHtml = r => {
      const lis = C.listen && !shown.has(r.i) && !rows[r.i].cw.every((_, j) => found.has(tOf(r.i, j)));
      const top = lis ? `<button class="sp-cplay" data-play="${r.i}">${E.ICON.spk}<span>${esc(nat({ en: "Listen", vi: "Nghe" }))}</span></button><button class="sp-cshow" data-show="${r.i}">${esc(nat({ en: "Show text (−1 ♥)", vi: "Xem chữ (−1 ♥)" }))}</button>`
        : `${C.listen ? `<button class="sp-cplay sm" data-play="${r.i}" aria-label="listen">${E.ICON.spk}</button>` : ""}<span>${esc(tgtOr(r.org))}</span>`;
      const doneLine = r.whole && found.has(r.i + ":-1");
      const words = r.cw.map((w, j) => { const t = tOf(r.i, j), f = t && found.has(t); return `<button class="sp-cw${f ? " hit" : ""}${missW.has(r.i + ":" + j) ? " miss" : ""}" data-w="${r.i}:${j}">${esc(w)}</button>`; }).join(" ");
      const anyHit = rows[r.i].cw.some((_, j) => { const t = tOf(r.i, j); return t && found.has(t); }) || doneLine;
      return `<div class="sp-crow${anyHit ? " fixed" : ""}"><div class="sp-corg"><em>${esc(nat(C.left.title || { en: "Original", vi: "Gốc" }))}</em>${top}</div>
        <div class="sp-ccpy${doneLine ? " hitline" : ""}" ${r.whole ? `data-line="${r.i}"` : ""}><em>${esc(nat(C.right.title || { en: "Copy", vi: "Bản sao" }))}</em><span>${words}</span>${anyHit ? `<i class="sp-stamp">${esc(nat({ en: "ALTERED", vi: "ĐÃ SỬA" }))}</i>` : ""}</div></div>`;
    };
    const draw = (msg = "") => E.ui.panel(`<div class="se-doc sp-cmp2"><div class="se-doch">${E.ICON.doc}<b>${esc(nat(C.title))}</b></div>
      <div class="sp-pips">${targets.map((_, k) => `<i class="${k < found.size ? "on" : ""}"></i>`).join("")}<b>${"♥".repeat(Math.max(0, hearts - wrong))}<s>${"♥".repeat(Math.min(hearts, wrong))}</s></b></div>
      <p class="se-mute sp-chelp">${esc(nat(C.listen ? { en: "Listen to the original, then tap the word in the copy that's different.", vi: "Nghe bản gốc rồi chạm vào từ bị sửa trong bản sao." } : { en: "Compare each pair. Tap the word in the copy that's different from the original.", vi: "So từng cặp. Chạm vào từ trong bản sao bị sửa khác bản gốc." }))}</p>
      <div class="sp-crows">${rows.map(rowHtml).join("")}</div></div>
      ${msg}<button class="se-btn pri wide" data-ok>${esc(nat(found.size >= targets.length ? { en: "Done", vi: "Xong" } : { en: `Done (${targets.length - found.size} left)`, vi: `Xong (còn ${targets.length - found.size} chỗ)` }))}</button>`, "present cmp");
    const fin = async () => { if (over) return; over = true; const ok = found.size >= targets.length; E.flag(C.key || "cmp_" + c.key(), found.size); await verdict(ok, nat(ok ? { en: "All changes found!", vi: "Tìm đủ chỗ bị sửa!" } : { en: "Missed some", vi: "Còn sót chỗ" })); done(res, c, ok ? C.ok : C.fail, "compare", ok ? "ok" : "fail"); };
    const lose = el => { wrong++; E.sfx("wrong"); E.haptic("HEAVY"); E.ui.fx("shake"); if (wrong >= hearts) return fin(), true; return false; };
    const hit = (t, el) => { found.add(t); E.sfx("solve"); E.haptic("MEDIUM"); E.ui.fx("objection"); draw(); burst(el && document.querySelector(`[data-w="${el}"]`) || document.querySelector(".sp-crows"), "#e0523f", 14); if (found.size >= targets.length) setTimeout(fin, E.auto ? 1 : 900); };
    ui().onclick = e => {
      if (over) return;
      const p = e.target.closest("[data-play]"); if (p) return E.say(tgtOr(rows[+p.dataset.play].org), who, { force: true, narr: who === "narr" });
      const sh = e.target.closest("[data-show]"); if (sh) { shown.add(+sh.dataset.show); E.sfx("page"); if (!lose()) draw(); return; }
      const w = e.target.closest("[data-w]");
      if (w) {
        const [r, j] = w.dataset.w.split(":").map(Number), t = tOf(r, j) || (rows[r].whole ? r + ":-1" : null);
        if (t && !found.has(t)) return hit(t, w.dataset.w);
        if (t) return;
        missW.add(w.dataset.w); if (!lose()) draw(`<div class="se-hint no">${esc(nat({ en: "That word matches the original.", vi: "Từ đó giống bản gốc." }))}</div>`); return;
      }
      if (e.target.closest("[data-ok]")) fin();
    };
    draw();
    E.autoRun(() => { targets.forEach(t => found.add(t)); fin(); });
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
        <div class="sp-noise${noise / max >= .66 ? " hi" : ""}"><small>${esc(nat({ en: "Noise — full means you're caught", vi: "Tiếng động — đầy là bị phát hiện" }))}</small><i><em style="width:${Math.min(100, (noise / max) * 100)}%"></em></i><b>${noise}/${max}</b></div>
        <p class="sp-snt">${esc(nat(r.t))}</p>${msg}
        <div class="se-chs">${r.opts.map((o, i) => { const k = Math.max(0, Math.min(3, o.risk || 0)); return `<button class="se-ch-b act" data-i="${i}"><span>${esc(nat(o))}</span>${N.showRisk ? `<small class="sp-risk r${k}">${esc(nat([{ en: "Safe", vi: "An toàn" }, { en: "Low risk", vi: "Rủi ro thấp" }, { en: "Risky", vi: "Rủi ro vừa" }, { en: "Very risky", vi: "Rủi ro cao" }][k]))}</small>` : ""}</button>`; }).join("")}</div></div>`, "sneak");
    };
    const finish = async key => { delete R.used[sk]; await verdict(key === "ok", nat(key === "ok" ? { en: "Slipped past!", vi: "Qua được rồi!" } : { en: "Caught!", vi: "Bị phát hiện!" })); done(res, c, !!N[key], "sneak", key); };
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
      if (add > 0) { const nz = document.querySelector(".sp-noise"); floatTxt(nz, "+" + add, add > 1 ? "#ef4444" : "#f2b84b"); if (add > 1) { nz.classList.add("bump"); E.ui.fx("shake"); E.haptic("HEAVY"); } }
      else burst(document.querySelector(".sp-snt"), "#6fcf97", 6);
    };
    if (row >= N.rows.length) { E.flag((N.key || "sneak") + "_noise", noise); return finish("ok"); }
    ui().onclick = e => { const b = e.target.closest("[data-i]"); if (b) go(+b.dataset.i); };
    draw();
    E.autoRun(() => { const r = N.rows[row]; const i = E.auto === "r" ? Math.floor(Math.random() * r.opts.length) : r.opts.reduce((b, o, k) => ((o.risk || 0) < (r.opts[b].risk || 0) ? k : b), 0); go(i); if (document.querySelector(".sp-sn") && E.auto) { const tick = () => { if (!document.querySelector(".sp-sn")) return; const r2 = N.rows[row]; if (!r2) return; go(E.auto === "r" ? Math.floor(Math.random() * r2.opts.length) : 0); setTimeout(tick, 5); }; setTimeout(tick, 5); } });
  }));


  // ═════════ QTE — bấm nhanh ═════════
  // { qte: { prompt, kind: "tap" | "seq" | "hold", n: 12, seq: ["←","↑","→"], ms: 5000, ok, fail } }
  def("qte", c => new Promise(res => {
    const Q = c.st.qte, kind = Q.kind || "tap", ms = Q.ms || 5000, need = Q.n || 12, holdMs = Q.hold || 1800;
    E.ui.hideBox(); E.ui.urgent(true);
    let cnt = 0, fin = false, holdT = 0, raf = 0, lastTap = 0;
    const t0 = performance.now();
    const seq = Q.seq || ["◀", "▲", "▶", "▼"].sort(() => 0.5 - Math.random()).slice(0, Q.n || 4);
    let pad = ["◀", "▲", "▼", "▶"]; const KEY = { ArrowLeft: "◀", ArrowUp: "▲", ArrowRight: "▶", ArrowDown: "▼" };
    // vẽ lại giữa chừng (seq) không được làm đồng hồ chạy lại từ đầu → trừ phần đã trôi qua
    const draw = () => E.ui.panel(`<div class="sp-qte"><div class="se-ask">${esc(nat(Q.prompt))}</div>
      <div class="se-timer"><i style="animation-duration:${ms / 1000}s;animation-delay:-${((performance.now() - t0) / 1000).toFixed(2)}s"></i></div><small class="sp-sec" data-sec>${Math.ceil(ms / 1000)}s</small>
      ${kind === "tap" ? `<button class="sp-qb ring" data-q style="--p:${cnt / need}"><b>${need - cnt}</b><small>${esc(nat({ en: "TAP!", vi: "CHẠM!" }))}</small></button>`
        : kind === "hold" ? `<button class="sp-qb ring hold" data-h style="--p:0"><b>${esc(nat({ en: "HOLD", vi: "GIỮ" }))}</b><small data-hs>${esc(nat({ en: "press and keep holding", vi: "nhấn và giữ chặt" }))}</small></button>`
        : `<div class="sp-seq">${seq.map((k, i) => `<span class="${i < cnt ? "on" : i === cnt ? "next" : ""}">${esc(k)}</span>`).join("")}</div><div class="sp-qpad">${pad.map(k => `<button data-s="${k}">${k}</button>`).join("")}</div>`}</div>`, "qte");
    const end = async (ok, why) => {
      if (fin || !live(c)) return; fin = true; clearTimeout(tm); clearInterval(iv); cancelAnimationFrame(raf); document.removeEventListener("keydown", key); E.ui.urgent(false); E.flag(Q.key || "qte_" + c.key(), ok ? 1 : 0);
      const b = document.querySelector(".sp-qb, .sp-seq");
      if (ok) { burst(b, "#5eead4", 18); E.sfx("solve"); E.haptic("MEDIUM"); E.ui.fx("punch"); } else { E.sfx("hit"); E.haptic("HEAVY"); E.ui.fx("redflash"); }
      await verdict(ok, ok ? 0 : why === "time" ? nat({ en: "Time's up!", vi: "Hết giờ!" }) : 0);
      done(res, c, ok ? Q.ok : Q.fail, "qte", ok ? "ok" : "fail");
    };
    const tm = setTimeout(() => end(false, "time"), ms);
    // đếm ngược số giây + đồng hồ chuyển đỏ khi còn dưới 1/3
    const iv = setInterval(() => {
      if (kind === "tap" && !Q.easy && cnt > 0 && !fin && performance.now() - lastTap > 350) { cnt = Math.max(0, cnt - (Q.decay ?? 0.35)); const q = document.querySelector("[data-q]"); if (q) { q.style.setProperty("--p", cnt / need); q.querySelector("b").textContent = Math.ceil(need - cnt); } }
      const left = Math.max(0, ms - (performance.now() - t0)), s = document.querySelector("[data-sec]"); if (s) { s.textContent = Math.ceil(left / 1000) + "s"; s.classList.toggle("low", left < ms / 3); } }, 200);
    const tapBtn = b => { b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop"); };
    const seqPress = k => {
      if (fin || !k) return;
      if (k === seq[cnt]) { cnt++; E.sfx("tap"); E.haptic("LIGHT"); if (!Q.easy) pad = pad.slice().sort(() => 0.5 - Math.random()); if (cnt >= seq.length) { draw(); return end(true); } draw(); burst(document.querySelector(".sp-seq span.on:last-of-type") || document.querySelector(".sp-seq"), "#5eead4", 6); }
      else { E.sfx("wrong"); E.haptic("HEAVY"); cnt = 0; draw(); const s = document.querySelector(".sp-seq"); s && s.classList.add("bad"); floatTxt(s, nat({ en: "Wrong — again!", vi: "Sai — làm lại!" }), "#ff6b5a"); }
    };
    const key = e => { if (kind === "seq" && KEY[e.key]) { e.preventDefault(); seqPress(KEY[e.key]); } };
    document.addEventListener("keydown", key);
    c.onCancel?.(() => { fin = true; clearTimeout(tm); clearInterval(iv); cancelAnimationFrame(raf); document.removeEventListener("keydown", key); DONE.add(res); res(); });
    draw();
    const el = ui();
    el.onclick = e => {
      if (fin || !live(c)) return;
      const q = e.target.closest("[data-q]");
      if (kind === "tap" && q) { cnt++; lastTap = performance.now(); E.sfx("tap"); E.haptic("LIGHT"); floatTxt(q, "+1", "#ffd166"); tapBtn(q); if (cnt >= need) { q.style.setProperty("--p", 1); return end(true); } q.style.setProperty("--p", cnt / need); q.querySelector("b").textContent = Math.ceil(need - cnt); }
      const s = e.target.closest("[data-s]"); if (kind === "seq" && s) seqPress(s.dataset.s);
    };
    if (kind === "hold") {
      const stop = early => {
        cancelAnimationFrame(raf); const b = el.querySelector("[data-h]");
        if (holdT && early && !fin) { E.sfx("wrong"); b && b.classList.add("bad"); const h = el.querySelector("[data-hs]"); if (h) h.textContent = nat({ en: "Too soon! Hold again", vi: "Buông sớm! Giữ lại nào" }); setTimeout(() => b && b.classList.remove("bad"), 400); }
        holdT = 0; if (b) { b.classList.remove("on"); b.style.setProperty("--p", 0); }
      };
      const loop = () => { const p = Math.min(1, (performance.now() - holdT) / holdMs), b = el.querySelector("[data-h]"); b && b.style.setProperty("--p", p); if (p >= 1) { holdT = 0; return end(true); } raf = requestAnimationFrame(loop); };
      el.onpointerdown = e => { const b = e.target.closest("[data-h]"); if (!b || holdT || fin) return; holdT = performance.now(); b.classList.add("on"); E.sfx("tap"); E.haptic("LIGHT"); loop(); };
      el.onpointerup = el.onpointercancel = () => stop(true);
    }
    E.autoRun(() => end(E.auto === "r" ? Math.random() < 0.7 : true));
  }));

  // ═════════ WHOM — chọn 1 người ═════════
  // { whom: { prompt, chars: ["tom", "owen"], then: { tom: [bước], owen: [bước] }, set: "accused" } }
  def("whom", c => new Promise(res => {
    const W = c.st.whom, list = W.chars.filter(id => !W.if?.[id] || cond(W.if[id], c.s));
    E.ui.hideBox();
    if (!list.length) return done(res, c, W.empty, "whom", "empty");
    E.ui.panel(`<div class="se-ask">${esc(nat(W.prompt))}</div><div class="sp-whom">${list.map(id => `<button data-w="${id}" style="--c:${color(id)}"><span class="sp-wp"><i class="im-${esc(id)}"></i></span><b>${esc(cname(id))}</b></button>`).join("")}</div>`, "whom");
    let lock = false, pend = null;
    const go = id => { if (!live(c) || DONE.has(res) || !list.includes(id)) return; if (W.set) E.flag(W.set, id); E.sfx("pick"); done(res, c, W.then?.[id], "whom", "then", id); };
    ui().onclick = e => {
      if (e.target.closest("[data-wno]")) { pend = null; E.sfx("tap"); document.querySelector(".sp-whom")?.classList.remove("chosen"); document.querySelectorAll(".sp-whom .sel").forEach(x => x.classList.remove("sel")); document.querySelector(".sp-wcf")?.remove(); return; }
      const yes = e.target.closest("[data-wyes]");
      const b = yes ? document.querySelector(`[data-w="${pend}"]`) : e.target.closest("[data-w]"); if (!b || lock) return;
      if (W.confirm && !yes) {
        pend = b.dataset.w; document.querySelectorAll(".sp-whom .sel").forEach(x => x.classList.remove("sel")); document.querySelector(".sp-whom")?.classList.add("chosen"); b.classList.add("sel"); E.sfx("pick"); E.haptic("LIGHT");
        document.querySelector(".sp-wcf")?.remove();
        b.closest(".se-panel").insertAdjacentHTML("beforeend", `<div class="sp-wcf"><b>${esc(nat(typeof W.confirm === "object" ? W.confirm : { en: "Are you sure? There’s no going back.", vi: "Chắc chưa? Không quay lại được đâu." }))}</b><div class="se-row"><button class="se-btn" data-wno>${esc(nat({ en: "Think again", vi: "Nghĩ lại" }))}</button><button class="se-btn pri" data-wyes>${esc(cname(pend))}</button></div></div>`);
        return;
      }
      lock = true; document.querySelector(".sp-wcf")?.remove();
      document.querySelector(".sp-whom")?.classList.add("chosen"); b.classList.add("sel"); burst(b, color(b.dataset.w), 10); E.haptic("LIGHT");
      setTimeout(() => go(b.dataset.w), E.auto ? 0 : 420);
    };
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
      <div class="sp-gto" data-to>${face(G0.to)}<span>${esc(nat({ en: `Drag a gift to ${cname(G0.to)} — or tap it`, vi: `Kéo quà tới ${cname(G0.to)} — hoặc chạm vào quà` }))}</span></div>
      <div class="sp-gift">${opts.map((o, i) => `<button data-g="${i}">${o.item ? E.itemArt(o.id, "md") : o.pic ? `<span class="se-ia md"><i class="im-${esc(o.pic)}"></i></span>` : `<span class="sp-gi">${E.ICON.box}</span>`}<b>${esc(o.item ? nat(S.items[o.id]?.name) : nat(o))}</b></button>`).join("")}</div>
      ${G0.skip ? `<button class="se-btn wide" data-skip>${esc(nat(G0.skip))}</button>` : ""}`, "gift");
    let lock = false;
    const go = i => {
      if (lock) return; lock = true;
      const o = opts[i], v = G0.likes?.[o.id] ?? 0;
      const btn = document.querySelector('[data-g="' + i + '"]');
      if (btn && !E.auto) {
        document.querySelector(".sp-gift")?.classList.add("chosen"); btn.classList.add("sel");
        const em = nat(v >= 3 ? { en: "Loves it!", vi: "Rất thích!" } : v >= 1 ? { en: "Likes it", vi: "Thích" } : v >= 0 ? { en: "Hmm…", vi: "Ừm…" } : { en: "Hates it", vi: "Ghét" });
        burst(btn, v >= 1 ? "#ff7eb6" : "#8a8fa0", v >= 3 ? 18 : 8); floatTxt(btn, em + (v ? " ♥" + (v > 0 ? "+" : "") + v : ""), v >= 1 ? "#ff7eb6" : "#fca5a5");
        E.haptic(v >= 1 ? "MEDIUM" : "HEAVY");
        setTimeout(() => fin(o, v), 750); return;
      }
      fin(o, v);
    };
    const fin = async (o, v) => {
      const tier = v >= 3 ? "love" : v >= 1 ? "like" : v >= 0 ? "meh" : "hate";
      E.add(G0.key || G0.to, v);
      if (o.item && G0.take !== false) R.items = R.items.filter(x => x !== o.id);
      E.flag((G0.key || G0.to) + "_gift", o.id);
      E.sfx(v >= 1 ? "up" : "down"); if (v >= 3) E.effect.run("particles", { kind: "petals", ms: 3000 });
      const key = G0.react?.[tier] ? tier : null;
      if (!key) await aftermath(G0.to, { love: { en: "Oh wow… this is perfect. Thank you!", vi: "Ôi… cái này tuyệt quá. Cảm ơn nhé!" }, like: { en: "That's sweet of you. Thanks.", vi: "Dễ thương ghê. Cảm ơn nha." }, meh: { en: "Oh. Um… thanks.", vi: "À. Ừm… cảm ơn." }, hate: { en: "…Why would you give me this?", vi: "…Sao lại tặng mình cái này?" } }[tier], heart(G0.to, v), { love: "happy", like: "smile", meh: "", hate: "sad" }[tier]);
      done(res, c, key, "gift", "react", key);
    };
    ui().onpointerdown = E.dragger({ src: "[data-g]", dst: "[data-to]", drop: (a, b) => { if (b) go(+a.dataset.g); } });
    ui().onclick = e => { if (E.dragged()) return; const b = e.target.closest("[data-g]"); if (b) go(+b.dataset.g); if (e.target.closest("[data-skip]")) done(res, c); };
    if (!opts.length) return done(res, c);
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
    E.ui.panel(`<div class="se-ask">${esc(nat(P.prompt || { en: "What do you talk about?", vi: "Bạn nói chuyện gì?" }))} <span class="sp-dots">${Array.from({ length: rounds }, (_, i) => `<i class="${i < used.size ? "on" : i === used.size ? "cur" : ""}"></i>`).join("")}</span></div>
      <div class="sp-top">${left.map(t => `<button data-t="${esc(t.id)}"><span>${icon(t.icon, "talk")}</span><b>${esc(nat(t))}</b></button>`).join("")}</div>`, "topics");
    const go = id => {
      const t = P.list.find(x => x.id === id); used.add(id); R.used[usedK] = [...used].join(",");
      const sc = t.score || 0;
      E.add(P.key || P.with, sc); E.sfx(sc > 0 ? "up" : sc < 0 ? "down" : "tap");
      const nxt = async () => { if (!t.then && P.with) await aftermath(P.with, sc > 0 ? { en: "Oh, I love talking about this!", vi: "Ôi, mình thích nói chuyện này lắm!" } : sc < 0 ? { en: "Hmm. Can we talk about something else?", vi: "Ừm. Nói chuyện khác được không?" } : { en: "Sure, I guess.", vi: "Ừ, cũng được." }, heart(P.key || P.with, sc), sc > 0 ? "happy" : sc < 0 ? "sad" : ""); E.ui.clear(); c.again(); if (t.then) c.push("topics", "list", P.list.indexOf(t), "then"); res(); };
      const b = document.querySelector('[data-t="' + id + '"]');
      if (!b || E.auto) return nxt();
      b.classList.add("sel"); document.querySelector(".sp-top")?.classList.add("chosen");
      floatTxt(b, sc ? "♥" + (sc > 0 ? "+" : "") + sc : "…", sc > 0 ? "#6fcf97" : sc < 0 ? "#fca5a5" : "#c9ced9"); if (sc > 0) burst(b, "#6fcf97", 10);
      setTimeout(nxt, 650);
    };
    let lk = false;
    ui().onclick = e => { const b = e.target.closest("[data-t]"); if (b && !lk) { lk = true; go(b.dataset.t); } };
    if (!left.length) { delete R.used[usedK]; return done(res, c, P.end, "topics", "end"); }
    E.autoRun(() => go(pickAuto(left).id));
  }));

  // ═════════ DATE — lên lịch hẹn ═════════
  // { date: { with, key, slots: 3, spots: [{ id, en, vi, pic, desc, score, then }], good: 5, great: [bước], ok: [bước], bad: [bước] } }
  def("date", c => new Promise(res => {
    const D = c.st.date;
    E.ui.hideBox();
    const n = D.slots ?? 3, available = new Set((D.spots || []).filter(s => cond(s.if, c.s)).map(s => s.id));
    if (!Number.isInteger(n) || n < 1 || available.size < n) return unavailable(res, c, "date", { en: "There are not enough available places to complete this plan. No outing has been booked.", vi: "Chưa có đủ địa điểm để hoàn thành kế hoạch này. Chưa có buổi đi chơi nào được sắp xếp." }, ["empty", "bad", "fail"]);
    const slot = Array(n).fill(null), nF = () => slot.filter(Boolean).length, nx = () => slot.indexOf(null);
    let pickd = [];
    const draw = () => E.ui.panel(`<div class="se-ask">${esc(nat(D.prompt || { en: "Plan the date", vi: "Lên kế hoạch buổi hẹn" }))}</div>
      <div class="sp-plan">${Array.from({ length: n }, (_, i) => { const s = D.spots.find(x => x.id === slot[i]); return `<div class="sp-slot${s ? " on" : ""}${!s && i === nx() ? " next" : ""}" data-slot="${i}"${s ? ` data-rm="${i}"` : ""}><em>${i + 1}</em><span>${s ? esc(nat(s)) : esc(nat(i === nx() ? { en: "Drop a place here", vi: "Thả 1 nơi vào đây" } : { en: "Later", vi: "Sau đó" }))}</span>${s ? "<u>×</u>" : ""}</div>`; }).join("")}</div>
      <p class="se-mute sp-sh">${esc(nat({ en: "Drag places into the plan · drag to swap · tap to remove", vi: "Kéo nơi vào lịch · kéo để đổi chỗ · chạm để gỡ" }))}</p>
      <div class="sp-spots">${D.spots.filter(s => !slot.includes(s.id) && cond(s.if, c.s)).map(s => `<button data-s="${esc(s.id)}">${s.pic ? `<i class="im-${esc(s.pic)}"></i>` : ""}<b>${esc(nat(s))}</b>${s.desc ? `<small>${esc(nat(s.desc))}</small>` : ""}</button>`).join("")}</div>
      <div class="se-row"><button class="se-btn" data-undo ${nF() ? "" : "disabled"}>${esc(nat({ en: "Undo last", vi: "Bỏ nơi cuối" }))}</button><button class="se-btn pri${nF() === n ? "" : " dim"}" data-go ${nF() === n ? "" : "disabled"}>${esc(nF() === n ? nat({ en: "Let's go", vi: "Đi thôi" }) : nat({ en: `${n - nF()} more to choose`, vi: `Chọn thêm ${n - nF()} nơi` }))}</button></div>`, "date");
    let ran = false;
    const run = async () => {
      if (ran || !live(c) || nF() !== n) return; ran = true; pickd = slot.filter(Boolean);
      const R = E.R();
      const score = pickd.reduce((a, id) => a + (D.spots.find(s => s.id === id).score || 0), 0);
      E.add(D.key || D.with, score); E.flag((D.key || D.with) + "_date", pickd.join(">"));
      const tier = score >= (D.great_at ?? (D.good ?? 4) + 2) && D.great ? "great" : score >= (D.good ?? 4) ? "ok" : "bad";
      E.ui.clear();
      if (!D[tier] && D.with) await aftermath(D.with, { great: { en: "Best day ever. Let's do this again.", vi: "Ngày tuyệt nhất luôn. Mình đi nữa nhé." }, ok: { en: "That was fun. Thanks for today.", vi: "Vui ghê. Cảm ơn vì hôm nay nhé." }, bad: { en: "Well… that was a day.", vi: "Chà… cũng là một ngày." } }[tier], heart(D.key || D.with, score), tier === "bad" ? "sad" : "happy");
      // chạy hoạt động theo đúng thứ tự đã chọn, rồi kết quả — xếp ngăn xếp ngược (cuối chạy trước bị đè)
      if (D[tier]) c.push("date", tier);
      for (const id of [...pickd].reverse()) { const i = D.spots.findIndex(s => s.id === id); if (D.spots[i].then) c.push("date", "spots", i, "then"); }
      void R; res();
    };
    ui().onclick = e => {
      if (E.dragged()) return;
      const s = e.target.closest("[data-s]"); if (s && nx() >= 0) return put(nx(), s.dataset.s);
      const rm = e.target.closest("[data-rm]"); if (rm) { slot[+rm.dataset.rm] = null; E.sfx("tap"); return draw(); }
      if (e.target.closest("[data-undo]")) { const k = slot.map((v, i) => v ? i : -1).filter(i => i >= 0).pop(); if (k >= 0) slot[k] = null; return draw(); }
      if (e.target.closest("[data-go]") && nF() === n) run();
    };
    const put = (i, id) => { slot[i] = id; E.sfx("pick"); E.haptic("LIGHT"); draw(); const sl = document.querySelectorAll(".sp-slot")[i]; sl?.classList.add("fill"); burst(sl, "#ff9ec7", 8); if (nF() === n) floatTxt(document.querySelector("[data-go]"), "♥", "#ff7eb6"); };
    // kéo: nơi → ô (ô có sẵn thì nơi cũ trả về danh sách) · ô → ô khác = đổi chỗ · ô → ra ngoài = gỡ
    ui().onpointerdown = E.dragger({ src: "[data-s], [data-rm]", dst: "[data-slot]", drop: (a, b) => {
      if (a.dataset.s != null) { if (b) put(+b.dataset.slot, a.dataset.s); return; }
      const from = +a.dataset.rm; if (!b) { slot[from] = null; E.sfx("tap"); return draw(); }
      const to = +b.dataset.slot; [slot[from], slot[to]] = [slot[to], slot[from]]; E.sfx("pick"); draw();
    } });
    draw();
    E.autoRun(() => { const pool = D.spots.filter(s => cond(s.if, c.s) && !slot.includes(s.id)).map(s => s.id); for (let i = 0; i < n && pool.length; i++) if (!slot[i]) slot[i] = pool.splice(E.auto === "r" ? Math.floor(Math.random() * pool.length) : 0, 1)[0]; run(); });
  }));

  // ═════════ GALLERY — chọn 1 ảnh (trang phục, quà, phòng…) ═════════
  // { gallery: { prompt, key, want: ["casual"], opts: [{ id, pic, en, vi, tags: [...], then }], match: [bước], miss: [bước] } }
  def("gallery", c => new Promise(res => {
    const P = c.st.gallery; let cur = 0;
    E.ui.hideBox();
    if (!P.opts?.length) return unavailable(res, c, "gallery", { en: "There are no pictures to choose from here. No selection has been made.", vi: "Ở đây chưa có ảnh để chọn. Bạn chưa chọn ảnh nào." }, ["empty", "miss", "fail"]);
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
      <p class="sp-dsum">${esc(nat({ en: "Dice", vi: "Xúc xắc" }))} <b data-r>?</b> + ${esc(K.statLabel ? nat(K.statLabel) : statName(K.stat))} ${statV}${bonus ? ` + ${esc(nat({ en: "items", vi: "đồ" }))} ${bonus}` : ""} = <b data-t>?</b></p><div class="sp-need"><i><em data-bar style="width:0"></em><u style="left:${Math.min(100, K.dc / (die + statV + bonus) * 100)}%"></u></i></div><p class="se-mute">${esc(nat({ en: `You need ${K.dc} or more.`, vi: `Cần đạt ${K.dc} trở lên.` }))}</p><button class="se-btn pri wide" data-roll="1">${esc(nat({ en: "Roll", vi: "Tung" }))}</button></div>`, "check");
    const fin = async () => { E.flag(K.key || "check_" + K.stat, ok ? 1 : 0); await verdict(ok); done(res, c, ok ? K.ok : K.fail, "check", ok ? "ok" : "fail"); };
    const doRoll = () => {
      const d = document.querySelector("[data-d]"); let k = 0; d.classList.add("roll");
      // xúc xắc chậm dần rồi mới dừng cho hồi hộp
      const step = () => {
        if (++k > 12) {
          d.classList.remove("roll"); d.textContent = roll; d.classList.add("land"); E.sfx("tap");
          document.querySelector("[data-r]").textContent = roll;
          setTimeout(() => {
            document.querySelector("[data-t]").textContent = total;
            const bar = document.querySelector("[data-bar]"); bar.style.width = Math.min(100, total / (die + statV + bonus) * 100) + "%"; bar.classList.add(ok ? "ok" : "no");
            setTimeout(() => {
              d.classList.add(ok ? "ok" : "no"); E.sfx(ok ? "solve" : "wrong"); E.haptic(ok ? "MEDIUM" : "HEAVY");
              if (ok) { burst(d, "#6fcf97", 16); if (roll === die) floatTxt(d, nat({ en: "MAX!", vi: "TỐI ĐA!" }), "#ffd166"); } else { E.ui.fx("shake"); if (total === K.dc - 1) floatTxt(d, nat({ en: "So close!", vi: "Suýt nữa!" }), "#f2b84b"); }
              const b = document.querySelector("[data-roll]"); if (!b) return; b.textContent = T("cont"); b.dataset.roll = ""; b.disabled = false; b.onclick = fin;
            }, 750);
          }, 500);
          return;
        }
        d.textContent = 1 + Math.floor(Math.random() * die); E.sfx("tap"); setTimeout(step, 50 + k * k * 3);
      };
      step();
    };
    ui().onclick = e => { const b = e.target.closest("[data-roll]"); if (b && b.dataset.roll === "1") { b.disabled = true; b.dataset.roll = "0"; doRoll(); } };
    E.autoRun(fin);
  }));

  // ═════════ SHOP — cửa hàng ═════════
  // { shop: { money: "coins", title, items: [{ id, price }], leave } } — đồ = mã trong story.items
  def("shop", c => new Promise(res => {
    const P = c.st.shop, R = E.R(), S = E.S(), cur = P.money || "coins";
    E.ui.hideBox();
    const draw = (msg = "") => E.ui.panel(`<div class="se-xg"><span>${esc(nat(P.title || { en: "Shop", vi: "Cửa hàng" }))}</span><b>${esc(statName(cur))} ${+R.f[cur] || 0}</b></div>
      <div class="sp-shop">${P.items.map(x => { const own = R.items.includes(x.id), poor = !own && (+R.f[cur] || 0) < x.price, d = S.items[x.id]?.desc; return `<button data-b="${x.id}" class="${own ? "own" : poor ? "poor" : "can"}" ${own ? "disabled" : ""}><span class="sp-sa">${E.itemArt(x.id, "md")}</span><b>${esc(nat(S.items[x.id]?.name))}</b>${d ? `<small class="sp-sd">${esc(nat(d))}</small>` : ""}<em class="sp-price">${own ? "✓ " + esc(nat({ en: "Owned", vi: "Đã có" })) : "● " + x.price}</em></button>`; }).join("")}</div>${msg}
      <button class="se-btn wide" data-x2>${esc(nat(P.leave || { en: "Leave", vi: "Rời đi" }))}</button>`, "shop");
    ui().onclick = e => {
      const b = e.target.closest("[data-b]");
      if (b) { const x = P.items.find(i => i.id === b.dataset.b); if ((+R.f[cur] || 0) < x.price) { E.sfx("wrong"); E.ui.fx("shake"); draw(`<div class="se-hint no">${esc(nat({ en: "Not enough money.", vi: "Không đủ tiền." }))}</div>`); return; } R.f[cur] -= x.price; R.items.push(x.id); E.sfx("item"); E.haptic("MEDIUM"); E.ui.dot(true); draw(); const nb = document.querySelector('[data-b="' + x.id + '"]'); burst(nb, "#ffd166", 14); floatTxt(nb, "−" + x.price, "#ffd166"); nb?.classList.add("got"); return; }
      if (e.target.closest("[data-x2]")) done(res, c);
    };
    draw();
    E.autoRun(() => { const x = P.items.find(i => (+R.f[cur] || 0) >= i.price && !R.items.includes(i.id)); if (x && E.auto === "r") { R.f[cur] -= x.price; R.items.push(x.id); } done(res, c); });
  }));

  // ═════════ SCHEDULE — lên lịch tuần ═════════
  // { schedule: { slots: [{ en, vi }…], acts: [{ id, en, vi, icon, gain: { stat: n }, cost: { coins: n } }], then } }
  const P0 = P => Array(P.slots.length).fill(null);
  def("schedule", c => new Promise(res => {
    const P = c.st.schedule;
    if (!P.slots?.length || !P.acts?.length) return unavailable(res, c, "schedule", { en: "There are no available activities or time slots for this schedule. No activities have been completed.", vi: "Lịch này chưa có hoạt động hoặc khung giờ khả dụng. Chưa có hoạt động nào được thực hiện." }, ["empty", "fail"]);
    const plan = P0(P), nF = () => plan.filter(Boolean).length, nxt = () => plan.indexOf(null);
    E.ui.hideBox();
    const tot = () => { const t = {}; for (const id of plan.filter(Boolean)) { const a = P.acts.find(x => x.id === id); for (const k in a.gain || {}) t[k] = (t[k] || 0) + a.gain[k]; for (const k in a.cost || {}) t[k] = (t[k] || 0) - a.cost[k]; } return t; };
    const draw = () => E.ui.panel(`<div class="se-ask">${esc(nat(P.prompt || { en: "Plan your week", vi: "Lên lịch cho tuần này" }))}</div>
      <div class="sp-plan">${P.slots.map((s, i) => { const a = P.acts.find(x => x.id === plan[i]); return `<button class="sp-slot${a ? " on" : ""}${!a && i === nxt() ? " next" : ""}" ${a ? `data-rm="${i}" data-slot="${i}" title="${esc(nat({ en: "Tap to remove", vi: "Chạm để gỡ" }))}"` : `data-slot="${i}"`}><em>${esc(nat(s))}</em><i>${a ? icon(a.icon, "clock") : i === nxt() ? "+" : ""}</i><span>${a ? esc(nat(a)) : ""}</span>${a ? "<u>×</u>" : ""}</button>`; }).join("")}</div>
      <p class="se-mute sp-sh">${esc(nat({ en: "Drag an activity into a slot · drag slots to swap · tap a slot to remove", vi: "Kéo hoạt động vào ô · kéo ô để đổi chỗ · chạm ô để gỡ" }))}</p>
      <div class="sp-sum">${Object.entries(tot()).map(([k, v]) => `<span class="${v < 0 ? "neg" : "pos"}">${esc(statName(k))} ${v > 0 ? "+" : ""}${v}</span>`).join("") || `<span>${esc(nat({ en: "Pick activities — see the total here", vi: "Chọn hoạt động — tổng hiện ở đây" }))}</span>`}</div>
      <div class="sp-top">${P.acts.map(a => `<button data-a2="${a.id}"><span>${icon(a.icon, "clock")}</span><b>${esc(nat(a))}</b><small>${[...Object.entries(a.gain || {}).map(([k, v]) => `${statName(k)} ${v > 0 ? "+" : ""}${v}`), ...Object.entries(a.cost || {}).map(([k, v]) => `${statName(k)} −${v}`)].join(" · ")}</small></button>`).join("")}</div>
      <div class="se-row"><button class="se-btn" data-undo ${nF() ? "" : "disabled"}>${esc(nat({ en: "Undo last", vi: "Bỏ ô cuối" }))}</button><button class="se-btn pri${nF() === P.slots.length ? "" : " dim"}" data-go ${nF() === P.slots.length ? "" : "disabled"}>${esc(nat({ en: "Start the week", vi: "Bắt đầu tuần" }))}</button></div>`, "sched");
    let ran = false;
    const run = async () => {
      if (ran) return; ran = true;
      for (const id of plan.filter(Boolean)) { const a = P.acts.find(x => x.id === id); for (const k in a.gain || {}) E.add(k, a.gain[k]); for (const k in a.cost || {}) E.add(k, -a.cost[k]); }
      E.flag(P.key || "week", plan.join(","));
      // acts[].day = cảnh truyện ĐẦY ĐỦ cho ngày đó (chạy lần lượt theo thứ tự ô, có thể chứa { event } — sự kiện ngẫu nhiên) → rồi mới tới then
      if (P.acts.some(a => a.day)) {
        if (DONE.has(res)) return; DONE.add(res); E.ui.clear();
        if (P.then) c.push("schedule", "then");
        for (let i = plan.length - 1; i >= 0; i--) { const ai = P.acts.findIndex(x => x.id === plan[i]); if (P.acts[ai]?.day) c.push("schedule", "acts", ai, "day"); }
        return res();
      }
      if (!E.auto && P.play !== false && P.acts.some(a => a.narr || a.img)) { ui().onpointerdown = null; await montage(); }
      done(res, c, P.then, "schedule", "then");
    };
    // ĐOẠN DIỄN TUẦN: lần lượt từng ô — thẻ ngày (ảnh im-<img> | icon) + lời dẫn + chỉ số cộng / trừ; chạm = sang ngày sau, tự sang sau ~3 s + độ dài lời dẫn, “Bỏ qua” = hết
    const montage = () => new Promise(r => {
      let i = 0, tm = 0, skip = false;
      const show = () => {
        clearTimeout(tm);
        if (skip || i >= plan.length) { ui().onclick = null; return r(); }
        const a = P.acts.find(x => x.id === plan[i]), d = [...Object.entries(a.gain || {}), ...Object.entries(a.cost || {}).map(([k, v]) => [k, -v])];
        E.ui.panel(`<div class="sp-week">
          <div class="sp-wk-d">${P.slots.map((s, k) => `<i class="${k < i ? "on" : k === i ? "cur" : ""}">${esc(nat(s))}</i>`).join("")}</div>
          <div class="sp-wk-c" data-next>${a.img ? `<span class="sp-wk-im im-${esc(a.img)}"></span>` : `<span class="sp-wk-ic">${icon(a.icon, "clock")}</span>`}
            <em>${esc(nat(P.slots[i]))} · ${esc(nat(a))}</em>
            ${a.narr ? `<p>${esc(tgtOr(a.narr))}</p>${subHtml(a.narr)}` : ""}
            <div class="sp-sum">${d.map(([k, v]) => `<span class="${v < 0 ? "neg" : "pos"}">${esc(statName(k))} ${v > 0 ? "+" : "−"}${Math.abs(v)}</span>`).join("")}</div></div>
          <div class="se-row"><button class="se-btn" data-skip>${esc(nat({ en: "Skip", vi: "Bỏ qua" }))}</button><button class="se-btn pri" data-next>${esc(nat(i === plan.length - 1 ? { en: "End of the week", vi: "Hết tuần" } : { en: "Next day", vi: "Ngày tiếp" }))}</button></div></div>`, "sched week");
        E.sfx("page");
        tm = setTimeout(() => { i++; show(); }, 3000 + (a.narr ? tgtOr(a.narr).length * 35 : 0));
      };
      ui().onclick = e => { if (e.target.closest("[data-skip]")) { skip = true; show(); } else if (e.target.closest("[data-next]")) { i++; E.sfx("tap"); show(); } };
      show();
    });
    const put = (i, id) => {
      plan[i] = id; E.sfx("pick"); E.haptic("LIGHT"); draw();
      const sl = document.querySelectorAll(".sp-slot")[i]; sl?.classList.add("fill"); burst(sl, "#7dd3fc", 8);
      if (nF() === P.slots.length) floatTxt(document.querySelector("[data-go]"), nat({ en: "Ready!", vi: "Sẵn sàng!" }), "#6fcf97");
    };
    // kéo thả: thẻ hoạt động → ô; ô → ô khác (đổi chỗ); thả ra ngoài ô = gỡ; chạm nhanh thì vẫn dùng như cũ
    ui().onpointerdown = e => {
      const act = e.target.closest("[data-a2]"), src = e.target.closest("[data-rm]");
      const el = act || src; if (!el || e.button > 0) return;
      const id = act ? act.dataset.a2 : plan[+src.dataset.rm], from = act ? -1 : +src.dataset.rm, x0 = e.clientX, y0 = e.clientY;
      let ghost = null, over = -1;
      const slotAt = (x, y) => { const t = document.elementFromPoint(x, y)?.closest("[data-slot]"); return t ? +t.dataset.slot : -1; };
      const mv = ev => {
        if (!ghost) {
          if (Math.hypot(ev.clientX - x0, ev.clientY - y0) < 9) return;
          ghost = el.cloneNode(true); ghost.className = "sp-ghost"; document.body.appendChild(ghost); el.classList.add("lifted");
        }
        ghost.style.left = ev.clientX + "px"; ghost.style.top = ev.clientY + "px";
        const o = slotAt(ev.clientX, ev.clientY);
        if (o !== over) { document.querySelectorAll(".sp-slot.hov").forEach(n => n.classList.remove("hov")); over = o; if (o >= 0) document.querySelectorAll(".sp-slot")[o]?.classList.add("hov"); }
      };
      const up = ev => {
        document.removeEventListener("pointermove", mv); document.removeEventListener("pointerup", up); document.removeEventListener("pointercancel", up);
        if (!ghost) return;
        ghost.remove(); el.classList.remove("lifted"); ui().dataset.dragged = "1"; setTimeout(() => ui() && delete ui().dataset.dragged, 60);
        const o = slotAt(ev.clientX, ev.clientY);
        if (from < 0) { if (o >= 0) put(o, id); else draw(); }
        else if (o >= 0 && o !== from) { const t = plan[o]; plan[o] = id; plan[from] = t || null; E.sfx("pick"); draw(); }
        else if (o < 0) { plan[from] = null; E.sfx("tap"); draw(); }
        else draw();
      };
      document.addEventListener("pointermove", mv); document.addEventListener("pointerup", up); document.addEventListener("pointercancel", up);
    };
    ui().onclick = e => {
      if (ui().dataset.dragged) return;
      const a = e.target.closest("[data-a2]"); if (a && nxt() >= 0) return put(nxt(), a.dataset.a2);
      const rm = e.target.closest("[data-rm]"); if (rm) { plan[+rm.dataset.rm] = null; E.sfx("tap"); E.haptic("LIGHT"); return draw(); }
      if (e.target.closest("[data-undo]")) { const k = plan.map((v, i) => v ? i : -1).filter(i => i >= 0).pop(); if (k >= 0) plan[k] = null; return draw(); }
      if (e.target.closest("[data-go]") && nF() === P.slots.length) run();
    };
    draw();
    E.autoRun(() => { for (let i = 0; i < plan.length; i++) if (!plan[i]) plan[i] = pickAuto(P.acts).id; run(); });
  }));

  // ═════════ GAUGE — thanh trượt chọn mức ═════════
  // { gauge: { prompt, min: 0, max: 100, step: 10, unit, key, zones: [{ to: 30, then }, { to: 70, then }, { to: 100, then }] } }
  def("gauge", c => new Promise(res => {
    const P = c.st.gauge, mn = P.min ?? 0, mx = P.max ?? 100, unit = P.unit || "", mid = Math.round((mn + mx) / 2), span = mx - mn || 1;
    // dải màu theo vùng: lạnh → nóng; khoảng nào thuộc vùng nào hiện luôn trên thanh để người chơi biết mình đang chọn gì
    const hue = i => Math.round(200 - (P.zones.length < 2 ? 0 : (i / (P.zones.length - 1)) * 200)), zi = v => { const k = P.zones.findIndex(z => v <= z.to); return k < 0 ? P.zones.length - 1 : k; };
    let from = mn; const bands = P.zones.map((z, i) => { const a = (from - mn) / span * 100, b = (Math.min(z.to, mx) - mn) / span * 100; from = z.to; return `hsl(${hue(i)} 70% 45%) ${a}% ${b}%`; }).join(",");
    E.ui.hideBox();
    E.ui.panel(`<div class="se-ask">${esc(nat(P.prompt))}</div><div class="sp-gauge"><b data-v>${mid}${esc(unit)}</b><small class="sp-gz" data-z></small>
      <div class="sp-gtrack" style="--bands:${bands}"><input type="range" min="${mn}" max="${mx}" step="${P.step || 1}" value="${mid}" data-r aria-label="${esc(nat(P.prompt))}"></div>
      <div class="sp-gl"><small>${esc(nat(P.lo || ""))}</small><small>${esc(nat(P.hi || ""))}</small></div></div><button class="se-btn pri wide" data-ok>${T("cont")}</button>`, "gauge");
    const r = document.querySelector("[data-r]"), vEl = document.querySelector("[data-v]"), zEl = document.querySelector("[data-z]");
    let last = -1;
    const upd = () => {
      const v = +r.value, k = zi(v), z = P.zones[k];
      vEl.textContent = v + unit; vEl.style.color = `hsl(${hue(k)} 80% 62%)`;
      if (zEl) zEl.textContent = z && z.label ? nat(z.label) : "";
      if (k !== last) { if (last >= 0) { E.sfx("tap"); E.haptic("LIGHT"); vEl.classList.remove("pop"); void vEl.offsetWidth; vEl.classList.add("pop"); } last = k; }
    };
    r.oninput = upd; upd();
    const go = v => { E.flag(P.key || "gauge", v); const k = zi(v); E.apply(P.zones[k]); done(res, c, P.zones[k]?.then, "gauge", "zones", k, "then"); };
    // moving: kim chạy qua lại, bấm DỪNG đúng lúc — càng nhanh càng khó
    let sweep = 0, locked = false;
    const okBtn = document.querySelector("[data-ok]");
    if (P.moving) {
      r.disabled = true; r.classList.add("auto"); okBtn.textContent = nat({ en: "STOP!", vi: "DỪNG!" });
      const sp = P.speed || 1.1, t1 = performance.now(), step = P.step || 1;
      const tick = () => { if (locked) return; const ph = ((performance.now() - t1) / 1000 * sp) % 2, x = ph < 1 ? ph : 2 - ph; r.value = Math.round((mn + x * span) / step) * step; upd(); sweep = requestAnimationFrame(tick); };
      tick();
    }
    ui().onclick = e => {
      if (!e.target.closest("[data-ok]") || locked) return;
      locked = true; cancelAnimationFrame(sweep); E.sfx("solve"); E.haptic("MEDIUM");
      if (P.moving) { vEl.classList.add("pop"); burst(vEl, "#ffd166", 12); setTimeout(() => go(+r.value), 650); } else go(+r.value);
    };
    E.autoRun(() => { locked = true; cancelAnimationFrame(sweep); go(E.auto === "r" ? mn + Math.floor(Math.random() * (mx - mn)) : +r.value)});
  }));

  // ═════════ SPIN — vòng quay may mắn ═════════
  // { spin: { prompt, key, opts: [{ en, vi, w: 1, then }] } } — kết quả định trước theo khoá bước (tải lại không đổi kết quả)
  def("spin", c => new Promise(res => {
    const P = c.st.spin;
    if (!P.opts?.length) return unavailable(res, c, "spin", { en: "This wheel has no available results. No spin or reward has been recorded.", vi: "Vòng quay này chưa có kết quả khả dụng. Chưa ghi nhận lượt quay hay phần thưởng nào." }, ["empty", "fail"]);
    const tot = P.opts.reduce((a, o) => a + (o.w || 1), 0);
    let r = seedRnd(c.key() + (E.R().f.__spins = (E.R().f.__spins || 0) + 1))() * tot, k = 0;
    while (r > (P.opts[k].w || 1)) { r -= P.opts[k].w || 1; k++; }
    E.ui.hideBox();
    const seg = 360 / P.opts.length;
    E.ui.panel(`<div class="se-ask">${esc(nat(P.prompt || { en: "Spin!", vi: "Quay!" }))}</div><div class="sp-wheel"><div class="sp-wh" data-w style="background:conic-gradient(${P.opts.map((o, i) => `${WHEEL[i % WHEEL.length]} ${i * seg}deg ${(i + 1) * seg}deg`).join(",")})">${P.opts.map((o, i) => `<span style="--r:${i * seg + seg / 2}deg">${i + 1}</span>`).join("")}</div><i class="sp-pin"></i></div><div class="sp-leg">${P.opts.map((o, i) => `<span><i style="background:${WHEEL[i % WHEEL.length]}">${i + 1}</i>${esc(nat(o))}</span>`).join("")}</div><button class="se-btn pri wide" data-go>${esc(nat({ en: "Spin", vi: "Quay" }))}</button>`, "spin");
    const fin = () => { E.flag(P.key || "spin", k); E.apply(P.opts[k]); done(res, c, P.opts[k].then, "spin", "opts", k, "then"); };
    ui().onclick = e => { const b = e.target.closest("[data-go]"); if (!b || b.dataset.done) return; b.dataset.done = 1; const w = document.querySelector("[data-w]"); w.style.transform = `rotate(${360 * 5 - (k * seg + seg / 2)}deg)`; E.sfx("whoosh"); setTimeout(() => { E.sfx("solve"); E.haptic("HEAVY"); burst(document.querySelector(".sp-wheel"), "#ffd166", 20); b.textContent = T("cont"); b.onclick = fin; }, 3200); };
    E.autoRun(fin);
  }));

  // ═════════ FILL — điền từ vào chỗ trống ═════════
  // { fill: { prompt, t: "I ___ him yesterday.", opts: ["saw", "see", "seen"], a: 0, why: { en, vi }, ok, fail } } — nhiều chỗ trống: t có nhiều ___, opts = [[…],[…]], a = [i, j]
  def("fill", c => new Promise(res => {
    const F = c.st.fill, multi = Array.isArray(F.opts[0]), opts = multi ? F.opts : [F.opts], ans = multi ? F.a : [F.a];
    const pick = opts.map(() => -1); let blank = 0, tries = 0, busy = false;
    c.onCancel?.(() => { busy = true; DONE.add(res); res(); });
    E.ui.hideBox();
    const draw = (msg = "") => {
      let k = 0;
      const sent = esc(tgtOr(F.t)).replace(/_{3,}/g, () => { const i = k++; return `<button class="sp-bl${blank === i ? " on" : ""}${pick[i] >= 0 ? " set" : ""}" data-b="${i}">${pick[i] >= 0 ? esc(opts[i][pick[i]]) : "____"}</button>`; });
      E.ui.panel(`<div class="se-ask">${esc(nat(F.prompt || { en: "Fill in the blank", vi: "Điền vào chỗ trống" }))}</div><p class="sp-fill">${sent}</p>${subHtml(F.t)}
        <div class="sp-wb">${opts[blank].map((w, i) => `<button data-o="${i}">${esc(w)}</button>`).join("")}</div>${msg}
        <button class="se-btn pri wide${pick.every(p => p >= 0) ? "" : " dim"}" data-ok ${pick.every(p => p >= 0) ? "" : "disabled"}>${esc(nat({ en: "Check", vi: "Kiểm tra" }))}</button>`, "fill");
    };
    const check = async () => {
      if (busy || DONE.has(res) || !live(c)) return; busy = true;
      tries++;
      const ok = pick.every((p, i) => p === ans[i]);
      E.add("fillN", 1); if (ok) E.add("fillOk", 1);
      E.flash(document.querySelector(".sp-fill"), ok); if (!E.auto) await new Promise(r => setTimeout(r, 450));
      if (!live(c) || DONE.has(res)) return;
      if (ok || tries >= (F.tries || 2)) {
        if (ok) { E.sfx("solve"); E.ui.fx("solve"); E.haptic("MEDIUM"); burst(document.querySelector(".sp-fill"), "#6fcf97", 16); } else E.sfx("wrong");
        await verdict(ok, nat(ok ? { en: "Correct!", vi: "Chính xác!" } : { en: "Wrong", vi: "Sai rồi" }));
        if (!live(c) || DONE.has(res)) return;
        if (!E.auto && (ok ? F.why : F.reveal !== false)) await E.feedback(`<div class="se-fb a${ok ? 2 : 0}"><b>${ok ? "✓" : "✗"} ${esc(tgtOr(F.t).replace(/_{3,}/g, (() => { let k = 0; return () => opts[k][ans[k++]]; })()))}</b>${F.why ? `<p>${esc(nat(F.why))}</p>` : ""}</div>`);
        return done(res, c, ok ? F.ok : F.fail, "fill", ok ? "ok" : "fail");
      }
      busy = false; E.sfx("wrong"); E.ui.fx("shake"); draw(`<div class="se-hint no">${esc(nat({ en: "Not quite — try again.", vi: "Chưa đúng — thử lại." }))}</div>`);
    };
    ui().onclick = e => {
      if (busy || DONE.has(res) || !live(c)) return;
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
    const open = [], got = new Set(); let moves = 0, lock = false, over = false, fresh = -1, combo = 0, best = 0, score = 0; const t0 = Date.now(); let tick = null;
    c.onCancel?.(() => { over = true; clearInterval(tick); DONE.add(res); res(); });
    const clock = () => { const s = Math.floor((Date.now() - t0) / 1000); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
    E.ui.hideBox();
    const draw = () => over || !live(c) || E.ui.panel(`<div class="se-ask">${esc(nat(M.prompt || { en: "Match the pairs", vi: "Ghép các cặp" }))} <small class="se-mute">${moves}${M.moves ? "/" + M.moves : ""}</small></div>
      <div class="sp-stats"><span>${E.ICON.clock}<b data-clk>${clock()}</b></span><span class="${combo > 1 ? "hot" : ""}">×${combo}</span><span>★ ${score}</span></div>
      <div class="sp-mem">${cards.map((x, k) => `<button data-k="${k}" class="${got.has(x.i) ? "got" : open.includes(k) ? "open" : ""}${fresh === k ? " flip" : ""}" aria-label="${got.has(x.i) || open.includes(k) ? esc(x.t) : "?"}"><span>${got.has(x.i) || open.includes(k) ? esc(x.t) : "✦"}</span></button>`).join("")}</div>`, "memory");
    const fin = async ok => { if (over || !live(c)) return; over = true; clearInterval(tick); E.add("memScore", score); await verdict(ok, nat(ok ? { en: "All matched!", vi: "Ghép đủ rồi!" } : { en: "Out of moves", vi: "Hết lượt" })); done(res, c, ok ? M.ok : M.fail, "memory", ok ? "ok" : "fail"); };
    if (!E.auto) tick = setInterval(() => { const e = document.querySelector("[data-clk]"); if (e) e.textContent = clock(); else if (over) clearInterval(tick); }, 500);
    ui().onclick = e => {
      const b = e.target.closest("[data-k]"); if (!b || lock || over || !live(c)) return; const k = +b.dataset.k;
      if (open.includes(k) || got.has(cards[k].i)) return;
      open.push(k); fresh = k; E.sfx("page"); draw(); fresh = -1;
      if (open.length === 2) {
        moves++; lock = true;
        setTimeout(() => {
          if (over || !live(c)) return;
          const hit = cards[open[0]].i === cards[open[1]].i, bs = document.querySelectorAll(".sp-mem button");
          if (hit) { got.add(cards[open[0]].i); combo++; best = Math.max(best, combo); const gain = 10 * combo; score += gain; E.sfx("solve"); E.haptic("MEDIUM"); burst(bs[open[1]], "#6fcf97"); burst(bs[open[0]], "#6fcf97", 8); floatTxt(bs[open[1]], "+" + gain + (combo > 1 ? " ×" + combo : "")); }
          else { combo = 0; E.sfx("wrong"); }
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
    E.ui.card(`<div class="se-ct time sp-loop"><small>${esc(nat({ en: "Again.", vi: "Lại nữa." }))}</small><b>${esc(nat(t).replace("{n}", n))}</b></div>`, 2600, "time").then(() => { if (live(c)) E.jump(W.to); res(); });
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
