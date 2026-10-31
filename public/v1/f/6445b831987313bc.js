// Enmi Story Engine — CƠ CHẾ THEO THỂ LOẠI (nạp sau mech-plus.js). Truyện không dùng = không ảnh hưởng.
// Đặc tả + ví dụ: docs/story-engine/MECHANICS.md (mục “Genre mechanics”). Mỗi cơ chế có E.autoRun cho autoplay.js / cover.js.
//
//   theory   TRINH THÁM — dựng lại vụ án kiểu Golden Idol: điền từ (người / giờ / đồ vật / động cơ) vào các câu kết luận;
//            sai thì chỉ biết SỐ chỗ sai (khi ≤ near), không biết chỗ nào → phải suy luận, không đoán mò được
//   vibe     HẸN HÒ — cuộc trò chuyện nhiều lượt có nhịp: người kia nói, mình trả lời trong thời gian giới hạn (im lặng = ngượng),
//            thanh “cảm xúc” chạy theo từng câu, mặt nhân vật đổi theo, nói hợp liên tiếp = “ăn ý”; kết quả theo tổng điểm
//   serve    ĐỜI THƯỜNG — đứng quầy (quán cà phê, chợ, tiệm hoa…): khách gọi món bằng tiếng đang học (đọc hoặc chỉ NGHE),
//            chọn đúng món lên khay trước khi khách hết kiên nhẫn → tiền boa; sai thì thấy khách thật sự gọi gì (học từ)
(() => {
  const E = globalThis.StoryEngine, def = E.def, esc = E.esc;
  const nat = t => E.nat(t), tgt = o => E.tgt(o), sub = o => E.sub(o);
  const ui = () => document.querySelector(".se-ui");
  const pickAuto = arr => arr[E.auto === "r" ? Math.floor(Math.random() * arr.length) : 0];
  const cond = (c, s) => (c == null ? true : typeof c === "function" ? !!c(s) : typeof c === "string" ? s.truth(c) || s.has(c) || !!s.f[c] : typeof c === "object" && !Array.isArray(c) ? Object.entries(c).every(([k, v]) => (+s.f[k] || 0) >= v) : !!c);
  const subHtml = o => { const s = sub(o); return s ? `<small class="sp-sub"${E.G().set.tr ? "" : " hidden"}>${esc(s)}</small>` : ""; };
  const cname = id => (id === "me" ? E.G().set.name : E.cname(E.S().chars[id] || {}, true));
  const color = id => (id === "me" ? "var(--se-me)" : E.S().chars[id]?.color || "#aaa");
  // chân dung nhỏ có biểu cảm: ảnh im-<mã>-<mặt> đè lên im-<mã> (thiếu ảnh biểu cảm thì vẫn thấy mặt gốc)
  const face = (id, f) => `<span class="sp-av lf-av" style="--c:${color(id)}"><i class="im-${esc(id)}"></i>${f ? `<i class="im-${esc(id)}-${esc(f)}"></i>` : ""}<b>${esc((cname(id) || "?").charAt(0))}</b></span>`;
  const burst = (...a) => E.fxBurst?.(...a), floatTxt = (...a) => E.fxFloat?.(...a), verdict = (...a) => E.verdict?.(...a) || Promise.resolve();
  const wait = ms => new Promise(r => setTimeout(r, E.auto ? 0 : ms));
  // xong bước đúng 1 lần (hẹn giờ muộn / bấm đúp không được xoá bảng của bước SAU)
  const DONE = new WeakSet(), FINISHING = new WeakSet();
  const live = c => c?.live?.() !== false;
  const done = (res, c, key, ...path) => { if (DONE.has(res)) return; DONE.add(res); if (live(c)) { E.ui.clear(); if (key) c.push(...path); } res(); };
  // đổi mặt nhân vật đang đứng trên sân khấu (nếu có) — để cảm xúc thấy cả ở cảnh chứ không chỉ trong bảng
  // tên chỉ số cho người chơi (giống mech-plus): story.stats.<mã> → nhãn thanh chỉ số → mã viết hoa chữ đầu
  const statName = k => nat(E.S().stats?.[k] || E.R().meters?.[k]?.label || { en: k.charAt(0).toUpperCase() + k.slice(1) });
  const stageFace = (id, f) => { const R = E.R(); if (f != null && R.cast?.[id]) E.ui.show(id, R.cast[id].at, f); };

  // ═════════ THEORY — dựng lại vụ án (điền từ vào kết luận) ═════════
  // { theory: { title, lines: [{ en: "[who] met Tom at [when].", vi: "[who] gặp Tom lúc [when]." }],
  //     answer: { who: "owen", when: "t947" }, words: [{ id, en, vi, kind: "who" | "when" | …, if }],
  //     kinds: { who: { en: "Person", vi: "Người" } }, near: 2, tries: 0, giveUp: true, key, ok, fail } }
  // Chỗ trống [mã] trong câu; từ cùng `kind` với đáp án của chỗ trống thì mới thả vào được (thiếu kind = mọi từ).
  const BL = /\[(\w+)\](?!\])/g;
  def("theory", c => new Promise(res => {
    const T = c.st.theory, ans = T.answer || {}, near = T.near ?? 2;
    const words = (T.words || []).filter(w => cond(w.if, c.s)), W = id => (T.words || []).find(w => w.id === id);
    const slots = [...new Set(T.lines.flatMap(l => [...String(l.en || "").matchAll(BL)].map(m => m[1])))];
    const kindOf = b => W(ans[b])?.kind;
    const pick = {}; let act = slots[0], tries = 0, msg = "", over = false;
    E.ui.hideBox();
    const fillLine = (s, lang) => String(s || "").replace(BL, (m, b) => { const w = W(pick[b]); return w ? (lang === "n" ? nat(w) : tgt(w)) : "____"; });
    const chip = b => { const w = W(pick[b]); return `<button class="lf-bl${w ? " on" : ""}${act === b ? " act" : ""}" data-b="${esc(b)}">${w ? esc(tgt(w)) : esc(nat(T.kinds?.[kindOf(b)] || { en: "?", vi: "?" }))}</button>`; };
    const line = l => `<p class="lf-tl">${tgt(l).split(BL).map((x, i) => (i % 2 ? chip(x) : esc(x))).join("")}</p>${sub(l) ? `<small class="sp-sub"${E.G().set.tr ? "" : " hidden"}>${esc(fillLine(nat(l), "n"))}</small>` : ""}`;
    const full = () => slots.every(b => pick[b]);
    const draw = () => {
      const kinds = [...new Set(words.map(w => w.kind || ""))];
      const ak = act ? kindOf(act) : null;
      E.ui.panel(`<div class="lf-th"><div class="se-ddh">${E.ICON.bulb}<small>${esc(nat(T.title || { en: "What really happened?", vi: "Chuyện thật sự là gì?" }))}</small></div>
        <div class="lf-lines">${T.lines.map(line).join("")}</div>
        <p class="se-mute lf-help">${esc(nat(act ? { en: "Tap a word below to fill the highlighted blank.", vi: "Chạm 1 từ bên dưới để điền vào ô đang sáng." } : { en: "Tap a blank to change it.", vi: "Chạm 1 ô để đổi từ." }))}</p>
        <div class="lf-bank">${kinds.map(k => `<div class="lf-grp${ak && k && k !== ak ? " off" : ""}">${k && T.kinds?.[k] ? `<em>${esc(nat(T.kinds[k]))}</em>` : ""}<div>${words.filter(w => (w.kind || "") === k).map(w => { const used = Object.values(pick).includes(w.id); return `<button class="lf-w${used ? " used" : ""}" data-w="${esc(w.id)}"${ak && k && k !== ak ? " disabled" : ""}>${esc(tgt(w))}${sub(w) ? `<small>${esc(sub(w))}</small>` : ""}</button>`; }).join("")}</div></div>`).join("")}</div>
        ${msg}<div class="se-row">${T.giveUp !== false && tries >= 2 ? `<button class="se-btn" data-give>${esc(nat({ en: "I'm not sure — move on", vi: "Chưa chắc — đi tiếp" }))}</button>` : ""}<button class="se-btn pri${full() ? "" : " dim"}" data-chk ${full() ? "" : "disabled"}>${esc(nat({ en: "That's what happened", vi: "Chuyện là như vậy" }))}</button></div></div>`, "theory");
    };
    const nextEmpty = from => slots.find((b, i) => i > slots.indexOf(from) && !pick[b]) || slots.find(b => !pick[b]) || null;
    const fin = async ok => {
      if (over || !live(c)) return; over = true;
      E.flag(T.key || "theory_" + c.key(), ok ? 1 : 0); if (ok) E.add("puzzles", 1);
      await verdict(ok, nat(ok ? { en: "Case reconstructed!", vi: "Đã dựng lại vụ án!" } : { en: "Not solved", vi: "Chưa phá được" }));
      done(res, c, ok ? T.ok : T.fail, "theory", ok ? "ok" : "fail");
    };
    // kéo từ → ô trống (chỉ ô cùng loại); kéo ô đã điền → ô khác = đổi chỗ, ra ngoài = gỡ
    const fillB = (k, id) => { for (const x in pick) if (pick[x] === id) delete pick[x]; pick[k] = id; E.sfx("pick"); E.haptic("LIGHT"); msg = ""; act = nextEmpty(k); draw(); document.querySelector(`[data-b="${k}"]`)?.classList.add("pop"); };
    ui().onpointerdown = E.dragger?.({ src: "[data-w], .lf-bl.on", dst: "[data-b]", drop: (a, d) => {
      if (over || !live(c)) return;
      if (a.dataset.w) { if (!d) return; const k = d.dataset.b, w = W(a.dataset.w); if (kindOf(k) && w?.kind && w.kind !== kindOf(k)) { E.sfx("wrong"); d.classList.add("bad"); return; } return fillB(k, a.dataset.w); }
      const from = a.dataset.b; if (!d) { delete pick[from]; act = from; E.sfx("tap"); return draw(); }
      const to = d.dataset.b; if (kindOf(to) !== kindOf(from)) { E.sfx("wrong"); return; } [pick[from], pick[to]] = [pick[to], pick[from]]; if (!pick[from]) delete pick[from]; E.sfx("pick"); draw();
    } });
    ui().onclick = e => {
      if (over || !live(c)) return;
      if (E.dragged?.()) return;
      const b = e.target.closest("[data-b]");
      if (b) { const k = b.dataset.b; if (act === k && pick[k]) delete pick[k]; act = k; E.sfx("tap"); msg = ""; return draw(); }
      const w = e.target.closest("[data-w]");
      if (w && act) {
        for (const k in pick) if (pick[k] === w.dataset.w) delete pick[k];
        pick[act] = w.dataset.w; E.sfx("pick"); E.haptic("LIGHT"); msg = "";
        const was = act; act = nextEmpty(act); draw();
        const el = document.querySelector(`[data-b="${was}"]`); el?.classList.add("pop");
        return;
      }
      if (e.target.closest("[data-give]")) return fin(false);
      if (e.target.closest("[data-chk]") && full()) {
        tries++;
        const wrong = slots.filter(k => pick[k] !== ans[k]).length;
        E.flash?.(document.querySelector(".lf-lines"), !wrong);
        if (!wrong) { E.sfx("solve"); E.ui.fx("solve"); burst(document.querySelector(".lf-lines"), "#ffd166", 22); return fin(true); }
        E.sfx("wrong"); E.ui.fx("shake"); E.haptic("HEAVY");
        if (T.tries && tries >= T.tries) return fin(false);
        // Golden Idol: chỉ nói SỐ chỗ sai khi đã gần đúng — không nói chỗ nào
        msg = `<div class="se-hint no">${esc(nat(wrong <= near ? { en: wrong === 1 ? "One detail is wrong." : `${wrong} details are wrong.`, vi: `Còn ${wrong} chi tiết sai.` } : { en: "That doesn't add up yet.", vi: "Vẫn chưa khớp." }))}${T.tries ? ` ${esc(nat({ en: `${T.tries - tries} tries left.`, vi: `Còn ${T.tries - tries} lần.` }))}` : ""}</div>`;
        draw();
      }
    };
    draw();
    E.autoRun(() => { Object.assign(pick, ans); if (E.auto === "r" && Math.random() < 0.3 && slots.length) pick[slots[0]] = null; if (!full()) return fin(false); fin(true); });
  }));

  // ═════════ VIBE — trò chuyện có nhịp (hẹn hò, làm quen, xin việc…) ═════════
  // { vibe: { with: "mia", key: "mia", ms: 9000, goal: 4, great: 7,
  //     rounds: [{ line: { en, vi }, face: "smile", opts: [{ en, vi, v: 2, face: "blush", re: { en, vi }, set, add, if }] }],
  //     silence: { v: -1, face: "sad", re: { en, vi } }, great: [bước], ok: [bước], fail: [bước] } }
  // great/ok/fail: bước theo tổng; goal = ngưỡng ok, greatAt = ngưỡng great (mặc định goal + 3). ms: 0 = không giới hạn giờ.
  def("vibe", c => new Promise(res => {
    const V = c.st.vibe, who = V.with, key = V.key || who, ms = V.ms ?? 9000;
    const rounds = V.rounds.filter(r => cond(r.if, c.s)), goal = V.goal ?? Math.ceil(rounds.length * 1.2), greatAt = V.greatAt ?? goal + 3;
    const lo = -Math.max(3, rounds.length * 2), hi = Math.max(greatAt + 1, rounds.length * 2);
    let sum = 0, streak = 0, curFace = "";
    E.ui.hideBox();
    const pct = v => Math.max(0, Math.min(100, ((v - lo) / (hi - lo)) * 100));
    const bar = () => `<div class="lf-vb"><i><em style="width:${pct(sum)}%"></em><u style="left:${pct(goal)}%"></u><u class="g" style="left:${pct(greatAt)}%"></u></i><b>${esc(nat(sum >= greatAt ? { en: "Sparks", vi: "Rung động" } : sum >= goal ? { en: "Warm", vi: "Ấm áp" } : sum >= 0 ? { en: "Polite", vi: "Lịch sự" } : { en: "Awkward", vi: "Ngượng" }))}</b></div>`;
    const head = (k) => `<div class="lf-vh">${face(who, curFace)}<div><b>${esc(cname(who))}</b><span class="sp-dots">${rounds.map((_, i) => `<i class="${i < k ? "on" : i === k ? "cur" : ""}"></i>`).join("")}</span></div>${streak >= 2 ? `<em class="lf-sync">${esc(nat({ en: "In sync", vi: "Ăn ý" }))} ×${streak}</em>` : ""}</div>`;
    const bubble = (o, me) => `<div class="lf-bub${me ? " me" : ""}"><span>${E.words(tgt(o), E.L)}</span>${subHtml(o)}</div>`;
    const draw = (k, body) => E.ui.panel(`<div class="lf-vibe">${head(k)}${bar()}${body}</div>`, "vibe");
    const round = (k) => new Promise(r => {
      const R0 = rounds[k], opts = R0.opts.map((o, i) => ({ o, i })).filter(({ o }) => cond(o.if, c.s));
      if (!live(c)) return r();
      if (R0.face != null) { curFace = R0.face; stageFace(who, R0.face); }
      draw(k, `${bubble(R0.line)}${ms ? `<div class="se-timer lf-vt"><i style="animation-duration:${ms / 1000}s"></i></div>` : ""}
        <div class="se-chs">${opts.map(({ o, i }) => `<button class="se-ch-b" data-v="${i}"><span>${esc(tgt(o))}</span>${subHtml(o)}</button>`).join("")}</div>`);
      if (R0.line && !E.auto) E.say(tgt(R0.line), who);
      let fin = false;
      const pickIt = async i => {
        if (fin || !live(c)) return; fin = true; clearTimeout(tm); E.hush();
        const o = i < 0 ? { ...(V.silence || {}), v: V.silence?.v ?? -1, re: V.silence?.re } : R0.opts[i];
        const v = +o.v || 0; sum += v; E.add(key, v); E.apply(o);
        streak = v > 0 ? streak + 1 : 0;
        if (o.face != null) { curFace = o.face; stageFace(who, o.face); }
        E.sfx(v > 0 ? "up" : v < 0 ? "down" : "tap"); E.haptic(v < 0 ? "HEAVY" : "LIGHT");
        const mine = i < 0 ? `<div class="lf-bub me sil"><span>…</span></div>` : bubble(o, true);
        draw(k + 1, `${bubble(R0.line)}${mine}${o.re ? bubble(o.re) : ""}`);
        const b = document.querySelector(".lf-vb");
        floatTxt(b, v ? "♥" + (v > 0 ? "+" : "") + v : "…", v > 0 ? "#ff7eb6" : v < 0 ? "#fca5a5" : "#c9ced9");
        if (v >= 2) burst(b, "#ff7eb6", 12);
        if (o.re && !E.auto) await E.say(tgt(o.re), who);
        await wait(o.re ? 1100 + tgt(o.re).length * 25 : 700);
        r();
      };
      const tm = ms && !E.auto ? setTimeout(() => pickIt(-1), ms) : 0;
      ui().onclick = e => { const b = e.target.closest("[data-v]"); if (b) { b.classList.add("sel"); pickIt(+b.dataset.v); } };
      c.onCancel?.(() => { fin = true; clearTimeout(tm); r(); });
      if (!opts.length) return void pickIt(-1);
      E.autoRun(() => pickIt(pickAuto(opts).i));
    });
    (async () => {
      for (let k = 0; k < rounds.length; k++) { if (!live(c)) return res(); await round(k); }
      if (!live(c)) return res();
      const tier = sum >= greatAt && V.great ? "great" : sum >= goal ? "ok" : "fail";
      E.flag((V.key || who) + "_vibe", tier);
      await verdict(tier !== "fail", nat(tier === "great" ? { en: "Sparks flew!", vi: "Có rung động!" } : tier === "ok" ? { en: "That went well", vi: "Khá suôn sẻ" } : { en: "A bit awkward…", vi: "Hơi ngượng…" }));
      // không khai great → dùng ok · không khai gì cho mức này → câu kết mặc định của người kia (diễn biến sau)
      const key2 = V[tier] ? tier : tier === "great" && V.ok ? "ok" : null;
      if (!live(c)) return res();
      if (!key2) await E.aftermath?.(who, tier === "great" ? { en: "I really enjoyed this. Text me?", vi: "Mình thích lắm. Nhắn tin cho mình nhé?" } : tier === "ok" ? { en: "Nice talking to you.", vi: "Nói chuyện vui ghê." } : { en: "Anyway… I should go.", vi: "Thôi… mình phải đi rồi." }, `${cname(who)} ♥ ${sum >= 0 ? "+" : "−"}${Math.abs(sum)}`, tier === "fail" ? "sad" : "happy");
      done(res, c, key2, "vibe", key2);
    })();
  }));

  // ═════════ SERVE — đứng quầy phục vụ (luyện nghe / đọc tên món) ═════════
  // { serve: { title, money: "coins", menu: [{ id, en, vi, pic, icon }], listen: false, ms: 20000, need,
  //     orders: [{ who, line: { en, vi }, want: ["latte", "croissant"], tip: 2, re: { en, vi }, if }], ok, fail, key } }
  // listen: true = khách chỉ NÓI (bấm loa nghe lại), chữ ẩn tới khi bấm “Xem chữ” (mất boa). ms = kiên nhẫn mỗi khách (0 = vô hạn).
  def("serve", c => new Promise(res => {
    const P = c.st.serve, menu = P.menu, M = id => menu.find(m => m.id === id), cur = P.money || "coins";
    const R0 = E.R(), seen = (R0.ev ||= { n: {}, last: {}, t: 0, seed: (Date.now() % 1e9) | 0 }).n;
    let orders = P.orders.filter(o => cond(o.if, c.s) && !(o.once && seen["cust_" + (o.id || o.who)]));
    if (P.pick && orders.length > P.pick) { const r = seed(R0.ev.seed + c.key()); orders = orders.map(o => [o, r() / (o.w ?? 1)]).sort((x, y) => x[1] - y[1]).slice(0, P.pick).map(x => x[0]); }
    for (const o of orders) if (o.once) seen["cust_" + (o.id || o.who)] = 1;
    const need = P.need ?? Math.ceil(orders.length * 0.6), ms = P.ms ?? 20000;
    let k = 0, tray = [], served = 0, earned = 0, shown = !P.listen, t0 = 0, tm = 0, iv = 0, busy = false;
    c.onCancel?.(() => { busy = true; clearTimeout(tm); clearInterval(iv); DONE.add(res); res(); });
    E.ui.hideBox();
    const same = (a, b) => a.length === b.length && [...a].sort().join("|") === [...b].sort().join("|");
    const tile = m => m.pic ? `<i class="im-${esc(m.pic)}"></i>` : E.S().items?.[m.id] ? E.itemArt(m.id, "sm") : `<span class="lf-mi">${E.ICON[m.icon] || esc(tgt(m).charAt(0).toUpperCase())}</span>`;
    const draw = (msg = "") => {
      const O = orders[k];
      E.ui.panel(`<div class="lf-sv"><div class="se-xg"><span>${esc(nat(P.title || { en: "Behind the counter", vi: "Sau quầy" }))} · ${k + 1}/${orders.length}</span><b>${esc(statName(cur))} +${earned}</b></div>
        <div class="lf-cust">${face(O.who)}<div class="lf-bub"><span>${shown ? E.words(tgt(O.line), E.L) : `<i class="lf-wave"><b></b><b></b><b></b><b></b><b></b></i>`}</span>${shown ? subHtml(O.line) : ""}</div>
          <div class="lf-ctl"><button class="se-ib sm" data-hear aria-label="${esc(nat({ en: "Listen again", vi: "Nghe lại" }))}">${E.ICON.spk}</button>${shown ? "" : `<button class="se-btn sm" data-show>${esc(nat({ en: "Show text", vi: "Xem chữ" }))}</button>`}</div></div>
        ${ms ? `<div class="lf-pat"><i><em data-pat></em></i></div>` : ""}
        <div class="lf-tray">${tray.length ? tray.map((id, i) => `<button data-rm="${i}">${tile(M(id))}<b>${esc(tgt(M(id)))}</b><u>×</u></button>`).join("") : `<small class="se-mute">${esc(nat({ en: "Tray is empty — tap the menu to add", vi: "Khay trống — chạm thực đơn để thêm" }))}</small>`}</div>
        <div class="lf-menu">${menu.map(m => `<button data-mi="${esc(m.id)}">${tile(m)}<b>${esc(tgt(m))}</b>${sub(m) ? `<small>${esc(sub(m))}</small>` : ""}</button>`).join("")}</div>
        ${msg}<button class="se-btn pri wide${tray.length ? "" : " dim"}" data-serve ${tray.length ? "" : "disabled"}>${esc(nat({ en: "Serve", vi: "Phục vụ" }))}</button></div>`, "serve");
      tickPat();
    };
    const tickPat = () => { const e = document.querySelector("[data-pat]"); if (!e || !ms) return; const left = Math.max(0, 1 - (performance.now() - t0) / ms); e.style.width = left * 100 + "%"; e.classList.toggle("low", left < .3); };
    const hear = () => { const O = orders[k]; E.say(tgt(O.line), O.who, { force: true }); };
    const start = () => {
      tray = []; shown = !P.listen; busy = false; t0 = performance.now(); draw();
      if (!E.auto) { if (P.listen || E.G().set.vDlg) hear(); E.sfx("open"); }
      clearTimeout(tm); clearInterval(iv);
      if (ms && !E.auto) { tm = setTimeout(() => judge(true), ms); iv = setInterval(tickPat, 250); }
    };
    const judge = async (timeout) => {
      if (busy || !live(c) || DONE.has(res)) return; busy = true; clearTimeout(tm); clearInterval(iv); E.hush();
      const O = orders[k], ok = !timeout && same(tray, O.want);
      if (ok) {
        served++; const tip = (O.tip ?? 1) * (shown && P.listen ? 0 : 1); earned += tip; if (tip) E.add(cur, tip);
        E.sfx("solve"); E.haptic("MEDIUM"); burst(document.querySelector(".lf-tray"), "#ffd166", 14);
        floatTxt(document.querySelector(".lf-cust"), tip ? "+" + tip : nat({ en: "Thanks!", vi: "Cảm ơn!" }), "#ffd166");
        if (O.re && !E.auto) E.say(tgt(O.re), O.who);
        draw(`<div class="se-hint">${O.re ? esc(tgt(O.re)) : esc(nat({ en: "Perfect, thanks!", vi: "Chuẩn rồi, cảm ơn!" }))}</div>`);
      } else {
        E.sfx("wrong"); E.haptic("HEAVY"); E.ui.fx("shake"); shown = true;
        // học từ: hiện đúng món khách gọi
        draw(`<div class="se-hint no">${esc(nat(timeout ? { en: "The customer gave up and left.", vi: "Khách chờ lâu quá nên bỏ đi." } : { en: "That's not what they ordered.", vi: "Không đúng món khách gọi." }))}<br><b>${esc(nat({ en: "They wanted:", vi: "Khách gọi:" }))}</b> ${O.want.map(id => esc(tgt(M(id)))).join(" · ")}</div>`);
      }
      await wait(ok ? 1300 : 2600);
      if (!live(c)) return res();
      k++;
      if (k < orders.length) return start();
      const win = served >= need;
      E.flag(P.key || "serve_" + c.key(), served);
      await verdict(win, nat(win ? { en: `${served}/${orders.length} served`, vi: `Phục vụ ${served}/${orders.length}` } : { en: "Rough shift…", vi: "Ca làm vất vả…" }));
      done(res, c, win ? P.ok : P.fail, "serve", win ? "ok" : "fail");
    };
    // kéo món lên khay · kéo món trên khay ra ngoài = bỏ
    ui().onpointerdown = E.dragger?.({ src: "[data-mi], [data-rm]", dst: ".lf-tray", drop: (a, d) => {
      if (busy) return;
      if (a.dataset.mi) { if (d) { tray.push(a.dataset.mi); E.sfx("pick"); E.haptic("LIGHT"); draw(); const t = document.querySelectorAll(".lf-tray button"); t[t.length - 1]?.classList.add("pop"); } return; }
      if (!d) { tray.splice(+a.dataset.rm, 1); E.sfx("tap"); draw(); }
    } });
    ui().onclick = e => {
      if (busy || E.dragged?.()) return;
      const m = e.target.closest("[data-mi]"); if (m) { tray.push(m.dataset.mi); E.sfx("pick"); E.haptic("LIGHT"); draw(); const t = document.querySelectorAll(".lf-tray button"); t[t.length - 1]?.classList.add("pop"); return; }
      const r = e.target.closest("[data-rm]"); if (r) { tray.splice(+r.dataset.rm, 1); E.sfx("tap"); return draw(); }
      if (e.target.closest("[data-hear]")) return hear();
      if (e.target.closest("[data-show]")) { shown = true; E.sfx("page"); return draw(); }
      if (e.target.closest("[data-serve]") && tray.length) judge(false);
    };
    if (!orders.length) return done(res, c, P.fail, "serve", "fail");
    start();
    // tự chơi / lời giải của cover.js: phục vụ lần lượt từng khách (đang chấm thì chờ)
    E.autoRun(async () => {
      while (live(c) && !DONE.has(res) && orders[k]) {
        if (busy) { await new Promise(r => setTimeout(r, 60)); continue; }
        tray = E.auto === "r" && Math.random() < 0.25 ? [menu[0].id] : [...orders[k].want];
        await judge(false);
      }
    });
  }));
  // ═════════ PRESSURE — hỏi cung kiểu L.A. Noire (tin · nghi · vạch trần bằng chứng) ═════════
  // { pressure: { who: "owen", trust: 3, guard, key,
  //     claims: [{ t: { en, vi }, face, is: "true" | "doubt" | "lie", evidence: "cap", yes: { en, vi }, no: { en, vi }, yesFace, noFace, if }],
  //     ok: [bước — khai thật], fail: [bước — im lặng / đòi luật sư] } }
  // Mỗi lời khai: Tin (đúng là thật) · Nghi ngờ (có gì đó không ổn) · Nói dối (phải đưa ĐÚNG bằng chứng). Đúng với lời không thật → “bình tĩnh” −1;
  // sai → “chịu nói” −1. Bình tĩnh về 0 = nghi phạm vỡ, khai (ok) · chịu nói về 0 hoặc hết lời khai mà chưa vỡ = fail.
  def("pressure", c => new Promise(res => {
    const P = c.st.pressure, who = P.who, R = E.R(), S = E.S();
    const claims = P.claims.filter(x => cond(x.if, c.s));
    const maxG = P.guard ?? Math.max(1, claims.filter(x => x.is !== "true").length), maxT = P.trust ?? 3;
    let k = 0, guard = maxG, trust = maxT, right = 0, f0 = "", busy = false, picking = false;
    E.ui.hideBox();
    const pips = (n, max) => Array.from({ length: max }, (_, i) => `<i class="${i < n ? "on" : ""}"></i>`).join("");
    const bub = (o, me) => `<div class="lf-bub${me ? " me" : ""}"><span>${E.words(tgt(o), E.L)}</span>${subHtml(o)}</div>`;
    const draw = body => E.ui.panel(`<div class="lf-pr"><div class="lf-vh">${face(who, f0)}<div><b>${esc(cname(who))}</b><span class="sp-dots">${claims.map((_, i) => `<i class="${i < k ? "on" : i === k ? "cur" : ""}"></i>`).join("")}</span></div></div>
      <div class="lf-prm"><span>${esc(nat({ en: "Composure", vi: "Bình tĩnh" }))}<em class="g">${pips(guard, maxG)}</em></span><span>${esc(nat({ en: "Willing to talk", vi: "Còn chịu nói" }))}<em class="t">${pips(trust, maxT)}</em></span></div>${body}</div>`, "pressure");
    const ask = () => {
      const C = claims[k]; picking = false;
      if (C.face != null) { f0 = C.face; stageFace(who, C.face); }
      draw(`${bub(C.t)}<div class="lf-prb">
        <button class="se-btn" data-p="true">${esc(nat({ en: "Believe", vi: "Tin" }))}</button>
        <button class="se-btn" data-p="doubt">${esc(nat({ en: "Doubt", vi: "Nghi ngờ" }))}</button>
        <button class="se-btn pri" data-p="lie">${esc(nat({ en: "Lie — show proof", vi: "Nói dối — đưa bằng chứng" }))}</button></div>`);
      if (!E.auto) E.say(tgt(C.t), who);
    };
    const proof = () => {
      picking = true;
      draw(`${bub(claims[k].t)}<p class="se-ask">${esc(nat({ en: "Which evidence proves it?", vi: "Bằng chứng nào chứng minh?" }))}</p>
        <div class="se-ddg">${R.items.map(id => `<button class="se-ddc" data-ev="${esc(id)}">${E.itemArt(id, "sm")}<b>${esc(nat(S.items[id]?.name))}</b></button>`).join("") || `<p class="se-mute">${esc(nat({ en: "You have no evidence.", vi: "Bạn không có bằng chứng nào." }))}</p>`}</div>
        <button class="se-btn wide" data-back>${esc(nat({ en: "Back", vi: "Quay lại" }))}</button>`);
    };
    const finish = async ok => {
      E.flag(P.key || "press_" + who, right);
      await verdict(ok, nat(ok ? { en: `${cname(who)} cracks!`, vi: `${cname(who)} khai rồi!` } : { en: `${cname(who)} stops talking`, vi: `${cname(who)} im lặng` }));
      done(res, c, ok ? P.ok : P.fail, "pressure", ok ? "ok" : "fail");
    };
    const judge = async (pick, ev) => {
      if (busy || !live(c) || DONE.has(res)) return; busy = true; E.hush();
      const C = claims[k], ok = pick === C.is && (pick !== "lie" || ev === C.evidence);
      if (ok) { right++; if (C.is !== "true") guard--; } else trust--;
      const line = ok ? C.yes || (C.is === "true" ? { en: "Thank you.", vi: "Cảm ơn." } : C.is === "lie" ? { en: "…Where did you get that?", vi: "…Anh / chị lấy cái đó ở đâu?" } : { en: "I… I don't remember exactly.", vi: "Tôi… tôi không nhớ rõ." })
        : C.no || (pick === "lie" ? { en: "That proves nothing.", vi: "Cái đó chẳng chứng minh được gì." } : pick === "true" ? { en: "Good. So we're done here?", vi: "Tốt. Vậy xong rồi chứ?" } : { en: "You think I'm lying? Unbelievable.", vi: "Nghĩ tôi nói dối à? Không thể tin nổi." });
      const fc = ok ? C.yesFace : C.noFace; if (fc != null) { f0 = fc; stageFace(who, fc); }
      E.sfx(ok ? (C.is === "true" ? "tap" : "hit") : "wrong"); E.haptic(ok ? "MEDIUM" : "HEAVY"); if (ok && C.is === "lie") E.ui.fx("objection"); else if (!ok) E.ui.fx("shake");
      draw(`${bub(C.t)}${bub(line)}`);
      const m = document.querySelector(ok ? ".lf-prm .g" : ".lf-prm .t"); m?.classList.add("hit");
      floatTxt(m, ok ? (C.is === "true" ? "✓" : nat({ en: "Shaken", vi: "Lung lay" })) : nat({ en: "Wrong call", vi: "Nhầm rồi" }), ok ? "#ffd166" : "#fca5a5");
      if (!E.auto) await E.say(tgt(line), who);
      await wait(1100 + tgt(line).length * 22);
      if (!live(c)) return res();
      busy = false; k++;
      if (guard <= 0) return finish(true);
      if (trust <= 0 || k >= claims.length) return finish(false);
      ask();
    };
    ui().onclick = e => {
      if (busy) return;
      const p = e.target.closest("[data-p]"); if (p) { if (p.dataset.p === "lie") { E.sfx("open"); return proof(); } return judge(p.dataset.p); }
      const ev = e.target.closest("[data-ev]"); if (ev && picking) return judge("lie", ev.dataset.ev);
      if (e.target.closest("[data-back]")) { E.sfx("tap"); return ask(); }
    };
    if (!claims.length) return done(res, c, P.fail, "pressure", "fail");
    ask();
    E.autoRun(async () => { while (live(c) && !DONE.has(res) && claims[k]) { if (busy) { await new Promise(r => setTimeout(r, 40)); continue; } const C = claims[k]; await judge(E.auto === "r" && Math.random() < 0.25 ? "true" : C.is, C.evidence); } });
  }));

  // ═════════ TAIL — bám đuôi (giữ khoảng cách, đừng để bị phát hiện, đừng để mất dấu) ═════════
  // { tail: { who: "owen", ms: 18000, near: 22, far: 72, looks: 3, ok: [bước], spotted: [bước], lost: [bước] } }
  // Giữ nút = đi nhanh, thả = chậm lại. Gần quá (< near) → “nghi ngờ” tăng; xa quá (> far) → “mất dấu” tăng. Người đó quay lại nhìn (looks lần):
  // có cảnh báo “!” trước ~0,7 s — đang đi nhanh lúc họ nhìn = nghi ngờ tăng vọt. Đầy thanh nào thì thua kiểu đó; trụ hết giờ = ok.
  def("tail", c => new Promise(res => {
    const P = c.st.tail, who = P.who, ms = P.ms ?? 18000, near = P.near ?? 22, far = P.far ?? 72, nl = P.looks ?? 3;
    let x = 1; { let h = E.hash(c.key()) || 1; x = h; }
    const rnd = () => ((x = (x * 1103515245 + 12345) >>> 0) % 10000) / 10000;
    // lịch quay lại nhìn định trước theo khoá bước (tải lại không đổi)
    const looks = Array.from({ length: nl }, (_, i) => (ms * (i + 1)) / (nl + 1) + (rnd() - 0.5) * ms * 0.12).map(t => ({ t, warn: t - 700, end: t + 1100 }));
    let gap = 45, sus = 0, lost = 0, hold = false, t0 = 0, last = 0, raf = 0, over = false, phase = "";
    E.ui.hideBox();
    E.ui.panel(`<div class="lf-tl2"><div class="se-xg"><span>${esc(nat(P.goal || { en: `Follow ${cname(who)} — don't get seen`, vi: `Bám theo ${cname(who)} — đừng để bị thấy` }))}</span><b data-tt>${Math.ceil(ms / 1000)}s</b></div>
      <div class="lf-st"><div class="lf-zone" style="left:${near}%;width:${far - near}%"></div><span class="lf-me">${esc(nat({ en: "You", vi: "Bạn" }))}</span><span class="lf-tg" data-tg style="--c:${color(who)}">${face(who)}<b data-lk>!</b></span></div>
      <div class="lf-bars"><span>${esc(nat({ en: "Suspicion", vi: "Bị nghi" }))}<i><em data-sus></em></i></span><span>${esc(nat({ en: "Losing them", vi: "Mất dấu" }))}<i><em data-lost></em></i></span></div>
      <p class="se-mute lf-th2" data-msg>${esc(nat({ en: "Hold to walk faster, let go to slow down.", vi: "Giữ để đi nhanh, thả ra để chậm lại." }))}</p>
      <button class="lf-hold" data-hold>${esc(nat({ en: "HOLD — walk faster", vi: "GIỮ — đi nhanh" }))}</button></div>`, "tail");
    const $ = s => document.querySelector(s);
    const end = async kind => {
      if (over || !live(c)) return; over = true; cancelAnimationFrame(raf); document.removeEventListener("keydown", kd); document.removeEventListener("keyup", ku);
      E.flag(P.key || "tail_" + who, kind);
      if (kind === "ok") { E.sfx("solve"); E.haptic("MEDIUM"); } else { E.sfx("hit"); E.haptic("HEAVY"); E.ui.fx("redflash"); }
      await verdict(kind === "ok", nat(kind === "ok" ? { en: "Still on their trail", vi: "Vẫn bám được" } : kind === "spotted" ? { en: "Spotted!", vi: "Bị phát hiện!" } : { en: "Lost them", vi: "Mất dấu rồi" }));
      const k2 = P[kind] ? kind : kind !== "ok" && P.fail ? "fail" : null;
      done(res, c, k2, "tail", k2);
    };
    const frame = now => {
      if (over || !live(c)) return;
      const dt = Math.min(0.05, (now - last) / 1000), t = now - t0; last = now;
      // mục tiêu đi lúc nhanh lúc chậm (sóng + giật nhẹ); mình: giữ = 15, thả = 5
      const tv = 9 + 5 * Math.sin(t / 1300) + 3 * Math.sin(t / 470 + 1), mv = hold ? 15 : 5;
      gap = Math.max(2, Math.min(98, gap + (tv - mv) * dt * 2.4));
      const L = looks.find(l => t >= l.warn && t < l.end), watching = L && t >= L.t;
      phase = L ? (watching ? "look" : "warn") : "";
      if (gap < near) sus += dt * 34; else if (gap > far) lost += dt * 30; else { sus = Math.max(0, sus - dt * 6); lost = Math.max(0, lost - dt * 8); }
      if (watching && hold) sus += dt * 95;
      if (watching && gap < near + 10) sus += dt * 30;
      const tg = $("[data-tg]"); if (tg) { tg.style.left = gap + "%"; tg.classList.toggle("warn", phase === "warn"); tg.classList.toggle("look", phase === "look"); }
      const s1 = $("[data-sus]"), s2 = $("[data-lost]"); if (s1) s1.style.width = Math.min(100, sus) + "%"; if (s2) s2.style.width = Math.min(100, lost) + "%";
      const tt = $("[data-tt]"); if (tt) tt.textContent = Math.max(0, Math.ceil((ms - t) / 1000)) + "s";
      const msg = $("[data-msg]"); if (msg) { const m = phase === "look" ? nat({ en: "They're looking back — freeze!", vi: "Họ đang ngoái lại — đứng im!" }) : phase === "warn" ? nat({ en: "They're slowing down…", vi: "Họ chậm lại…" }) : gap < near ? nat({ en: "Too close!", vi: "Gần quá!" }) : gap > far ? nat({ en: "Too far — catch up!", vi: "Xa quá — bắt kịp!" }) : nat({ en: "Good distance.", vi: "Khoảng cách tốt." }); if (msg.textContent !== m) msg.textContent = m; msg.className = "se-mute lf-th2" + (phase || gap < near || gap > far ? " bad" : ""); }
      if (sus >= 100) return end("spotted");
      if (lost >= 100) return end("lost");
      if (t >= ms) return end("ok");
      raf = requestAnimationFrame(frame);
    };
    const on = v => { if (over || !live(c)) return; hold = v; $("[data-hold]")?.classList.toggle("on", v); if (v) E.haptic("LIGHT"); };
    ui().onpointerdown = e => { if (e.target.closest("[data-hold]")) { e.preventDefault(); on(true); } };
    ui().onpointerup = ui().onpointercancel = ui().onpointerleave = () => on(false);
    const kd = e => { if (e.code === "Space") { e.preventDefault(); on(true); } }, ku = e => { if (e.code === "Space") on(false); };
    document.addEventListener("keydown", kd); document.addEventListener("keyup", ku);
    c.onCancel?.(() => { over = true; cancelAnimationFrame(raf); document.removeEventListener("keydown", kd); document.removeEventListener("keyup", ku); DONE.add(res); res(); });
    if (!E.auto) { t0 = last = performance.now(); raf = requestAnimationFrame(frame); }
    E.autoRun(() => end(E.auto === "r" && Math.random() < 0.25 ? "spotted" : "ok"));
  }));

  // ═════════ COMPOSE — xếp chữ thành câu (học trật tự từ) ═════════
  // { compose: { t: { vi: "Tôi chưa từng đến đó." }, a: "I have never been there." | ["…", "…"], extra: ["ever", "went"], tries: 3, why, ok, fail, key, who } }
  // t = nghĩa (ngôn ngữ gốc); a = câu đúng (có thể nhiều cách); extra = chữ gây nhiễu. Sai → chỉ chữ đầu tiên lệch; hết lượt → hiện câu đúng.
  const words = s => String(s).replace(/[.!?]+$/, "").split(/\s+/).filter(Boolean);
  const nrm = s => String(s).toLowerCase().replace(/[’']/g, "'").replace(/[^\p{L}\p{N}' ]+/gu, " ").replace(/\s+/g, " ").trim();
  def("compose", c => new Promise(res => {
    const K = c.st.compose, acc = [].concat(typeof K.a === "object" && !Array.isArray(K.a) ? tgt(K.a) : K.a).map(a => typeof a === "string" ? a : tgt(a));
    let x = E.hash(c.key()) || 1; const rnd = () => ((x = (x * 1103515245 + 12345) >>> 0) % 10000) / 10000;
    const tiles = [...words(acc[0]), ...(K.extra || [])].map((w, i) => ({ w, i, r: rnd() })).sort((a, b) => a.r - b.r);
    let line = [], tries = 0, msg = "", bad = -1, over = false;
    E.ui.hideBox();
    const draw = () => E.ui.panel(`<div class="lf-cp"><div class="se-ask">${esc(nat(K.prompt || { en: "Say it in the language you're learning", vi: "Nói câu này bằng tiếng đang học" }))}</div>
      <p class="lf-cpt">${esc(nat(K.t))}</p>
      <div class="lf-cpl">${line.map((ti, p) => `<button class="lf-w on${p === bad ? " bad" : ""}" data-o="${p}">${esc(tiles[ti].w)}</button>`).join("") || `<small class="se-mute">${esc(nat({ en: "Tap the words in order", vi: "Chạm các chữ theo thứ tự" }))}</small>`}</div>
      <div class="lf-cpb">${tiles.map((t, k) => `<button class="lf-w${line.includes(k) ? " gone" : ""}" data-k="${k}" ${line.includes(k) ? "disabled" : ""}>${esc(t.w)}</button>`).join("")}</div>
      ${msg}<button class="se-btn pri wide${line.length ? "" : " dim"}" data-ok ${line.length ? "" : "disabled"}>${esc(nat({ en: "Check", vi: "Kiểm tra" }))}</button></div>`, "compose");
    const fin = async ok => {
      if (over || !live(c)) return; over = true;
      E.flag(K.key || "compose_" + c.key(), ok ? 1 : 0); if (ok) E.add("composed", 1);
      if (!E.auto) E.say(acc[0], K.who || "narr", { force: true, narr: !K.who });
      await verdict(ok, nat(ok ? { en: "Perfect sentence!", vi: "Câu chuẩn!" } : { en: "Not this time", vi: "Lần này chưa được" }));
      if (!live(c)) return;
      if (!E.auto && (ok ? K.why : K.reveal !== false)) await E.feedback(`<div class="se-fb a${ok ? 2 : 0}"><b>${esc(acc[0])}</b>${K.why ? `<p>${esc(nat(K.why))}</p>` : ""}</div>`);
      done(res, c, ok ? K.ok : K.fail, "compose", ok ? "ok" : "fail");
    };
    // kéo chữ vào câu (thả lên 1 chữ trong câu = chèn trước chữ đó) · kéo chữ trong câu để đổi vị trí · kéo ra ngoài = bỏ
    ui().onpointerdown = E.dragger?.({ src: "[data-k], [data-o]", dst: "[data-o], .lf-cpl", drop: (a, d) => {
      if (over || !live(c)) return;
      const fromLine = a.dataset.o != null, ti = fromLine ? line[+a.dataset.o] : +a.dataset.k;
      if (!d) { if (fromLine) { line.splice(+a.dataset.o, 1); E.sfx("tap"); draw(); } return; }
      if (fromLine) line.splice(+a.dataset.o, 1);
      let at = d.dataset.o != null ? +d.dataset.o : line.length; if (fromLine && d.dataset.o != null && +d.dataset.o > +a.dataset.o) at--;
      line.splice(Math.max(0, Math.min(line.length, at)), 0, ti); bad = -1; msg = ""; E.sfx("pick"); E.haptic("LIGHT"); draw();
    } });
    ui().onclick = e => {
      if (over || !live(c)) return;
      if (E.dragged?.()) return;
      const k = e.target.closest("[data-k]"); if (k) { line.push(+k.dataset.k); bad = -1; msg = ""; E.sfx("pick"); E.haptic("LIGHT"); return draw(); }
      const o = e.target.closest("[data-o]"); if (o) { line.splice(+o.dataset.o, 1); bad = -1; E.sfx("tap"); return draw(); }
      if (e.target.closest("[data-ok]") && line.length) {
        tries++;
        const got = line.map(i => tiles[i].w).join(" ");
        E.flash?.(document.querySelector(".lf-cpl"), acc.some(a => nrm(a) === nrm(got)));
        if (acc.some(a => nrm(a) === nrm(got))) { E.sfx("solve"); E.ui.fx("solve"); burst(document.querySelector(".lf-cpl"), "#6fcf97", 18); return fin(true); }
        // chữ đầu tiên lệch so với câu đúng gần nhất (cùng chữ đầu dài nhất)
        const gw = words(got).map(nrm), best = acc.map(a => words(a).map(nrm)).map(aw => { let p = 0; while (p < aw.length && aw[p] === gw[p]) p++; return p; });
        bad = Math.min(line.length - 1, Math.max(...best));
        E.sfx("wrong"); E.ui.fx("shake"); E.haptic("HEAVY");
        if (K.tries && tries >= K.tries) return fin(false);
        msg = `<div class="se-hint no">${esc(nat({ en: "Almost — check the highlighted word.", vi: "Gần đúng — xem lại chữ đang sáng." }))}${K.tries ? ` ${esc(nat({ en: `${K.tries - tries} tries left.`, vi: `Còn ${K.tries - tries} lần.` }))}` : ""}</div>`;
        draw();
      }
    };
    draw();
    E.autoRun(() => fin(!(E.auto === "r" && Math.random() < 0.25)));
  }));

  // ═════════ BARGAIN — mặc cả (chợ, tiệm đồ cũ, taxi…) ═════════
  // { bargain: { who: "vendor", item: { en, vi } | "<mã đồ vật>", ask: 40, floor: 26, money: "coins", patience: 3, give: "<mã đồ>",
  //     ok: [bước — mua được], fail: [bước — không mua] , key } }
  // floor = giá thấp nhất người bán chịu (người chơi không thấy). Mỗi lượt: kéo giá muốn trả + chọn CÁCH nói:
  //   lịch sự (ít mất kiên nhẫn, người bán giảm ít) · cứng rắn (giảm nhiều hơn, mất kiên nhẫn) · bỏ đi (đòn tâm lý: còn lời thì người bán gọi lại).
  // Trả ≥ floor = chốt. Trả quá thấp (< 70 % floor) = xúc phạm, mất 2 kiên nhẫn. Hết kiên nhẫn = người bán đuổi khéo.
  def("bargain", c => new Promise(res => {
    const B = c.st.bargain, who = B.who, R = E.R(), S = E.S(), cur = B.money || "coins";
    const item = typeof B.item === "string" ? S.items?.[B.item]?.name || { en: B.item } : B.item;
    const floor = B.floor ?? Math.round(B.ask * 0.65), lo = Math.max(1, Math.round(B.ask * 0.3));
    let price = B.ask, patience = B.patience ?? 3, offer = Math.round((lo + B.ask) / 2), line = B.hello || { en: `${tgt(item)}? %n. Best quality.`, vi: `${nat(item)}? %n. Hàng tốt nhất.` }, busy = false, f0 = "";
    E.ui.hideBox();
    const fmt = (o, n) => tgt(o).split("%n").join(n), fmtN = (o, n) => nat(o).split("%n").join(n);
    const bubble = o => `<div class="lf-bub"><span>${esc(fmt(o, price))}</span>${sub(o) ? `<small class="sp-sub"${E.G().set.tr ? "" : " hidden"}>${esc(fmtN(o, price))}</small>` : ""}</div>`;
    const money = () => +R.f[cur] || 0;
    const draw = (msg = "") => {
      offer = Math.min(offer, price);
      E.ui.panel(`<div class="lf-bg"><div class="lf-vh">${face(who, f0)}<div><b>${esc(cname(who))}</b><span class="lf-pat2">${Array.from({ length: B.patience ?? 3 }, (_, i) => `<i class="${i < patience ? "on" : ""}"></i>`).join("")}</span></div><em class="lf-tag">${esc(nat(item))}</em></div>
        ${bubble(line)}
        <div class="lf-pr2"><span>${esc(nat({ en: "Their price", vi: "Họ đòi" }))} <b>${price}</b></span><span>${esc(nat({ en: "You have", vi: "Bạn có" }))} <b>${money()}</b> ${esc(statName(cur))}</span></div>
        <div class="sp-gauge"><b data-of>${offer}</b><input type="range" min="${lo}" max="${price}" step="1" value="${offer}" data-r aria-label="${esc(nat({ en: "Your offer", vi: "Giá bạn trả" }))}"></div>
        ${msg}<div class="lf-bt">
          <button class="se-ch-b" data-t="polite"><span>${esc(fmt({ en: "Could you do %n?", vi: "%n được không ạ?" }, offer))}</span><small>${esc(nat({ en: "Polite", vi: "Lịch sự" }))}</small></button>
          <button class="se-ch-b" data-t="firm"><span>${esc(fmt({ en: "%n. That's my final offer.", vi: "%n. Giá chót đấy." }, offer))}</span><small>${esc(nat({ en: "Firm", vi: "Cứng rắn" }))}</small></button>
          <button class="se-ch-b" data-t="walk"><span>${esc(tgt({ en: "Never mind. I'll look elsewhere.", vi: "Thôi, tôi xem chỗ khác." }))}</span><small>${esc(nat({ en: "Walk away", vi: "Bỏ đi" }))}</small></button></div>
        <button class="se-btn pri wide" data-deal ${money() >= price ? "" : "disabled"}>${esc(nat({ en: `Deal — pay ${price}`, vi: `Chốt — trả ${price}` }))}</button></div>`, "bargain");
      const r = document.querySelector("[data-r]"); if (r) r.oninput = () => { offer = +r.value; document.querySelector("[data-of]").textContent = offer; document.querySelectorAll("[data-t] span").forEach((s, i) => { if (i < 2) s.textContent = fmt(i ? { en: "%n. That's my final offer.", vi: "%n. Giá chót đấy." } : { en: "Could you do %n?", vi: "%n được không ạ?" }, offer); }); };
    };
    const say = async (o, fc) => { line = o; if (fc != null) { f0 = fc; stageFace(who, fc); } draw(); if (!E.auto) await E.say(fmt(o, price), who); };
    const buy = async p => {
      busy = true; price = p; E.add(cur, -p); if (B.give && !R.items.includes(B.give)) R.items.push(B.give);
      E.flag(B.key || "bargain_" + c.key(), p); E.sfx("item"); E.haptic("MEDIUM");
      const saved = Math.round((1 - p / B.ask) * 100);
      await say({ en: "Deal. Pleasure doing business.", vi: "Chốt. Rất vui được bán." }, "smile");
      burst(document.querySelector(".lf-pr2"), "#ffd166", 16);
      await verdict(true, nat(saved > 0 ? { en: `Bought for ${p} — saved ${saved}%`, vi: `Mua được ${p} — bớt ${saved}%` } : { en: `Bought for ${p}`, vi: `Mua được ${p}` }));
      done(res, c, B.ok, "bargain", "ok");
    };
    const leave = async () => { busy = true; E.flag(B.key || "bargain_" + c.key(), 0); await verdict(false, nat({ en: "No deal", vi: "Không mua được" })); done(res, c, B.fail, "bargain", "fail"); };
    const turn = async t => {
      if (busy) return; busy = true;
      if (t === "walk") {
        if (price > floor * 1.12) { price = Math.max(floor, Math.round(price * 0.85)); E.sfx("up"); await say({ en: "Wait, wait! For you… %n.", vi: "Khoan, khoan! Với bạn thì… %n." }, "worried"); busy = false; return; }
        await say({ en: "Suit yourself.", vi: "Tuỳ bạn." }, "sad"); return leave();
      }
      if (offer >= floor) { if (money() < offer) { busy = false; return draw(`<div class="se-hint no">${esc(nat({ en: "You can't afford that.", vi: "Bạn không đủ tiền." }))}</div>`); } return buy(offer); }
      const insult = offer < floor * 0.7;
      patience -= insult ? 2 : t === "firm" ? 1 : 0;
      if (patience <= 0) { E.sfx("down"); E.haptic("HEAVY"); await say({ en: "Enough. I'm not selling to you.", vi: "Đủ rồi. Tôi không bán cho bạn nữa." }, "angry"); return leave(); }
      // người bán nhượng: cứng rắn → về gần floor hơn; sát floor + cứng rắn → về đúng floor
      const k = t === "firm" ? 0.45 : 0.25;
      price = t === "firm" && offer >= floor * 0.9 ? floor : Math.max(floor, Math.round(price - (price - Math.max(offer, floor)) * k));
      E.sfx(insult ? "wrong" : "tap"); if (insult) E.ui.fx("shake");
      floatTxt(document.querySelector(".lf-pr2"), insult ? nat({ en: "Insulted!", vi: "Phật ý!" }) : "−" + Math.max(0, B.ask - price), insult ? "#fca5a5" : "#ffd166");
      await say(insult ? { en: "Is that a joke? %n.", vi: "Đùa à? %n." } : t === "firm" ? { en: "You drive a hard bargain. %n.", vi: "Bạn mặc cả ghê thật. %n." } : { en: "Hmm… I can do %n.", vi: "Ừm… %n thì được." }, insult ? "angry" : "");
      busy = false;
    };
    ui().onclick = e => {
      const t = e.target.closest("[data-t]"); if (t) return turn(t.dataset.t);
      if (e.target.closest("[data-deal]") && !busy && money() >= price) buy(price);
    };
    draw(); if (!E.auto) E.say(fmt(line, price), who);
    E.autoRun(() => { if (E.auto === "r" && Math.random() < 0.25) return leave(); if (money() >= floor) buy(floor); else leave(); });
  }));
  // ─── dùng chung cho nhóm dưới: số ngẫu nhiên định trước theo khoá bước · xáo · kết thúc ok / fail có biển ───
  const seed = key => { let x = E.hash(key) || 1; return () => ((x = (x * 1103515245 + 12345) >>> 0) % 10000) / 10000; };
  const shuf = (arr, key) => { const r = seed(key); return arr.map(v => [v, r()]).sort((a, b) => a[1] - b[1]).map(v => v[0]); };
  const finish = async (res, c, name, ok, txt, val) => {
    if (DONE.has(res) || FINISHING.has(res) || !live(c)) return; FINISHING.add(res);
    const S0 = c.st[name]; E.flag(S0.key || name + "_" + c.key(), val ?? (ok ? 1 : 0));
    await verdict(ok, txt ? nat(txt) : undefined);
    done(res, c, ok ? S0.ok : S0.fail, name, ok ? "ok" : "fail");
  };
  const L = o => (o == null ? "" : typeof o === "string" ? o : tgt(o));

  // ═════════ CIPHER — giải mật mã dịch chữ (Caesar) ═════════
  // { cipher: { plain: "THE KEY IS UNDER THE MAT", shift: 3, hint: { en: "Count the candles", vi }, tr: { vi: "Chìa khoá dưới thảm" }, ok, fail } }
  // Người chơi xoay vòng chữ (◀ ▶ / kéo) — bản giải hiện ngay theo độ xoay; đúng độ xoay thì chữ khoá lại sáng lên.
  def("cipher", c => new Promise(res => {
    const C = c.st.cipher, A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", plain = String(C.plain).toUpperCase(), sh = ((C.shift ?? 3) % 26 + 26) % 26;
    const rot = (s, n) => s.replace(/[A-Z]/g, ch => A[(A.indexOf(ch) + n + 26) % 26]);
    const code = rot(plain, sh);
    let off = 0, over = false;
    E.ui.hideBox();
    const draw = () => {
      const dec = rot(code, -off), ok = off === sh;
      E.ui.panel(`<div class="lf-ci"><div class="se-ask">${esc(nat(C.prompt || { en: "Crack the code", vi: "Giải mật mã" }))}</div>
        <p class="lf-cic">${esc(code)}</p>
        <div class="lf-ciw"><button class="se-ib" data-d="-1" aria-label="−">◀</button><div class="lf-cir"><b>A → ${A[(26 - off) % 26]}</b><small>${esc(nat({ en: "shift", vi: "dịch" }))} ${off}</small></div><button class="se-ib" data-d="1" aria-label="+">▶</button></div>
        <input type="range" min="0" max="25" value="${off}" data-r aria-label="shift">
        <p class="lf-cid${ok ? " ok" : ""}">${esc(dec)}</p>
        ${ok && C.tr ? `<small class="sp-sub">${esc(nat(C.tr))}</small>` : ""}
        ${C.hint ? `<p class="se-hint">${E.ICON.bulb}${esc(nat(C.hint))}</p>` : ""}</div>`, "cipher");
      const r = document.querySelector("[data-r]"); if (r) r.oninput = () => { off = +r.value; E.sfx("tap"); draw(); check(); };
    };
    const check = () => { if (off !== sh || over) return; over = true; E.sfx("solve"); E.haptic("MEDIUM"); burst(document.querySelector(".lf-cid"), "#6fcf97", 18); if (!E.auto) E.say(plain.toLowerCase(), "narr", { force: true, narr: true }); setTimeout(() => finish(res, c, "cipher", true, { en: "Decoded!", vi: "Giải được rồi!" }), E.auto ? 0 : 1400); };
    ui().onclick = e => { const d = e.target.closest("[data-d]"); if (d && !over) { off = (off + +d.dataset.d + 26) % 26; E.sfx("tap"); E.haptic("LIGHT"); draw(); check(); } };
    draw();
    E.autoRun(() => { off = sh; check(); });
  }));

  // ═════════ EAVESDROP — nghe lén: chạm “Ghi lại” đúng lúc câu quan trọng vang lên ═════════
  // { eavesdrop: { title, lines: [{ who, en, vi, key: true }], need: 2, slips: 2, ok, fail } }
  // Câu hiện lần lượt (có giọng đọc), mỗi câu chỉ ghi được khi đang nói. Ghi câu quan trọng = +1 · ghi câu thừa = 1 lần “lỡ tay” (quá slips = trượt).
  def("eavesdrop", c => new Promise(res => {
    const V = c.st.eavesdrop, lines = V.lines.filter(l => cond(l.if, c.s)), need = V.need ?? lines.filter(l => l.key).length, slips = V.slips ?? 2;
    let k = -1, got = 0, bad = 0; const noted = new Set();
    E.ui.hideBox();
    const draw = () => E.ui.panel(`<div class="lf-ea"><div class="se-xg"><span>${esc(nat(V.title || { en: "Listen in — note what matters", vi: "Nghe lén — ghi lại điều quan trọng" }))}</span><b>${got}/${need}</b></div>
      <div class="lf-eal">${lines.slice(0, k + 1).map((l, i) => `<div class="lf-eai${i === k ? " now" : ""}${noted.has(i) ? (l.key ? " hit" : " miss") : ""}"><em style="color:${color(l.who)}">${esc(cname(l.who))}</em><span>${E.words(L(l), E.L)}</span>${subHtml(l)}</div>`).join("")}</div>
      <button class="lf-hold" data-note ${k >= 0 && !noted.has(k) ? "" : "disabled"}>${E.ICON.pen} ${esc(nat({ en: "Note that!", vi: "Ghi lại!" }))}</button></div>`, "eaves");
    const next = async () => {
      if (!live(c) || DONE.has(res) || FINISHING.has(res)) return;
      k++;
      if (k >= lines.length) return finish(res, c, "eavesdrop", got >= need && bad <= slips, got >= need && bad <= slips ? { en: "Got the key details", vi: "Nắm được chi tiết chính" } : { en: "You missed something", vi: "Bạn bỏ lỡ gì đó" }, got);
      draw(); const el = document.querySelector(".lf-eal"); if (el) el.scrollTop = el.scrollHeight;
      const l = lines[k];
      if (!E.auto) await Promise.all([E.say(L(l), l.who), wait(1700 + L(l).length * 45)]);
      next();
    };
    ui().onclick = e => {
      if (!live(c) || FINISHING.has(res) || !e.target.closest("[data-note]") || k < 0 || k >= lines.length || noted.has(k)) return;
      noted.add(k); const ok = !!lines[k].key; if (ok) got++; else bad++;
      E.sfx(ok ? "up" : "wrong"); E.haptic(ok ? "MEDIUM" : "HEAVY"); draw();
      floatTxt(document.querySelector(".lf-eai.now"), ok ? nat({ en: "Noted!", vi: "Đã ghi!" }) : nat({ en: "Not important", vi: "Không quan trọng" }), ok ? "#6fcf97" : "#fca5a5");
    };
    next();
    E.autoRun(() => {});
  }));

  // ═════════ LINEUP — nhận dạng theo lời nhân chứng (đọc hiểu mô tả) ═════════
  // { lineup: { who: "witness", desc: { en: "Tall, glasses, a red cap.", vi }, people: [{ id, name, pic, traits: [{ en, vi }] }], a: "id", tries: 2, ok, fail } }
  def("lineup", c => new Promise(res => {
    const P = c.st.lineup; let tries = 0, over = false; const out = new Set();
    E.ui.hideBox();
    const nm = p => p.name ? L(p.name) : cname(p.id);
    const draw = (msg = "") => E.ui.panel(`<div class="lf-lu">${P.who ? `<div class="lf-cust">${face(P.who)}<div class="lf-bub"><span>${E.words(L(P.desc), E.L)}</span>${subHtml(P.desc)}</div></div>` : `<div class="lf-bub"><span>${E.words(L(P.desc), E.L)}</span>${subHtml(P.desc)}</div>`}
      <div class="lf-lug">${P.people.map(p => `<button class="lf-lup${out.has(p.id) ? " out" : ""}" data-p="${esc(p.id)}" ${out.has(p.id) ? "disabled" : ""}>${p.pic ? `<span class="sp-av" style="--c:#888"><i class="im-${esc(p.pic)}"></i></span>` : face(p.id)}<b>${esc(nm(p))}</b><span class="lf-tr">${(p.traits || []).map(t => `<i>${esc(L(t))}</i>`).join("")}</span></button>`).join("")}</div>
      ${msg}</div>`, "lineup");
    const pick = id => {
      if (over) return; tries++;
      E.flash?.(document.querySelector(`[data-p="${id}"]`), id === P.a);
      if (id === P.a) { over = true; E.sfx("solve"); burst(document.querySelector(`[data-p="${id}"]`), "#6fcf97", 16); return finish(res, c, "lineup", true, { en: "That's them!", vi: "Chính là người đó!" }); }
      out.add(id); E.sfx("wrong"); E.ui.fx("shake"); E.haptic("HEAVY");
      if (P.tries && tries >= P.tries) { over = true; return finish(res, c, "lineup", false, { en: "Wrong person", vi: "Nhận nhầm người" }); }
      draw(`<div class="se-hint no">${esc(nat({ en: "That doesn't match the description. Read it again.", vi: "Không khớp lời mô tả. Đọc lại nhé." }))}</div>`);
    };
    ui().onclick = e => { const b = e.target.closest("[data-p]"); if (b) pick(b.dataset.p); };
    draw(); if (P.who && !E.auto) E.say(L(P.desc), P.who);
    // tự chơi: có thể chọn nhầm 1 lần (thử nhánh sai) rồi chọn đúng
    E.autoRun(() => { const w = P.people.find(p => p.id !== P.a)?.id; if (E.auto === "r" && w && Math.random() < 0.3) pick(w); pick(P.a); });
  }));

  // ═════════ HEARTBEAT — giữ bình tĩnh theo nhịp tim (tỏ tình, phỏng vấn, đối mặt) ═════════
  // { heartbeat: { prompt, beats: 8, bpm: 70, need: 5, ok, fail } } — chạm đúng lúc vòng co về tâm; trượt = tim đập nhanh hơn (khó hơn)
  def("heartbeat", c => new Promise(res => {
    const H = c.st.heartbeat, total = H.beats ?? 8, need = H.need ?? Math.ceil(total * 0.6);
    let bpm = H.bpm ?? 70, n = 0, good = 0, t0 = 0, per = 60000 / bpm, raf = 0, over = false, tapped = false;
    c.onCancel?.(() => { over = true; cancelAnimationFrame(raf); DONE.add(res); res(); });
    E.ui.hideBox();
    E.ui.panel(`<div class="lf-hb"><div class="se-ask">${esc(nat(H.prompt || { en: "Breathe. Tap with your heartbeat.", vi: "Hít thở. Chạm theo nhịp tim." }))}</div>
      <button class="lf-hbb" data-tap><i data-ring></i><b>♥</b></button>
      <div class="lf-hbs"><span>${esc(nat({ en: "Steady", vi: "Đều nhịp" }))} <b data-g>0</b>/${need}</span><span><b data-bpm>${bpm}</b> bpm</span></div></div>`, "heartbeat");
    const $ = s => document.querySelector(s);
    const beat = () => { n++; tapped = false; t0 = performance.now(); if (n > total) return end(); };
    const end = () => { if (over || !live(c)) return; over = true; cancelAnimationFrame(raf); const ok = good >= need; finish(res, c, "heartbeat", ok, ok ? { en: "Calm and steady", vi: "Bình tĩnh rồi" } : { en: "Your heart is racing", vi: "Tim đập loạn" }, good); };
    const frame = now => { if (over || !live(c)) return; const p = (now - t0) / per; if (p >= 1) { if (!tapped) miss(); beat(); } const r = $("[data-ring]"); if (r) r.style.transform = `scale(${1.55 - Math.min(1, p) * 0.55})`; raf = requestAnimationFrame(frame); };
    const miss = () => { bpm = Math.min(150, bpm + 8); per = 60000 / bpm; const b = $("[data-bpm]"); if (b) b.textContent = bpm; E.haptic("HEAVY"); $(".lf-hbb")?.classList.add("bad"); setTimeout(() => $(".lf-hbb")?.classList.remove("bad"), 250); };
    ui().onpointerdown = e => {
      if (!e.target.closest("[data-tap]") || over || tapped) return; tapped = true;
      const p = (performance.now() - t0) / per, hit = p > 0.8 || p < 0.08;
      if (hit) { good++; bpm = Math.max(55, bpm - 3); per = 60000 / bpm; E.sfx("beat"); E.haptic("LIGHT"); const g = $("[data-g]"); if (g) g.textContent = good; floatTxt($(".lf-hbb"), "♥", "#ff7eb6"); if (good >= need && n >= total - 1) return end(); }
      else miss();
    };
    if (!E.auto) { beat(); raf = requestAnimationFrame(frame); }
    E.autoRun(() => { good = E.auto === "r" && Math.random() < 0.25 ? 0 : need; end(); });
  }));

  // ═════════ SWIPE — quẹt thẻ trái / phải (app hẹn hò, thật / giả, giữ / bỏ…) ═════════
  // { swipe: { prompt, left: { en: "Nope" }, right: { en: "Like" }, cards: [{ t: { en, vi }, title, pic, a: "right" | "left", right: { add, set }, left: { … } }], need, ok, fail, key } }
  // Có `a` = có đúng / sai (đếm điểm, need) · không có = chỉ ghi lựa chọn (flag <key>.<chỉ số> = "l" | "r") và áp add / set.
  def("swipe", c => new Promise(res => {
    const W = c.st.swipe, cards = W.cards.filter(x => cond(x.if, c.s)), scored = cards.some(x => x.a), need = W.need ?? Math.ceil(cards.filter(x => x.a).length * 0.7);
    let k = 0, right = 0, busy = false;
    E.ui.hideBox();
    if (!cards.length) return done(res, c, W.empty || W.then, "swipe", W.empty ? "empty" : "then");
    const draw = () => {
      const C = cards[k];
      E.ui.panel(`<div class="lf-sw"><div class="se-ask">${esc(nat(W.prompt || { en: "Swipe", vi: "Quẹt" }))} <small class="se-mute">${k + 1}/${cards.length}</small></div>
        <div class="lf-swd">${cards[k + 1] ? `<div class="lf-swc back"></div>` : ""}<div class="lf-swc" data-card>${C.pic ? `<i class="lf-swp im-${esc(C.pic)}"></i>` : ""}${C.title ? `<b>${esc(L(C.title))}</b>` : ""}<p>${E.words(L(C.t), E.L)}</p>${subHtml(C.t)}<em class="lf-swl">${esc(nat(W.left || { en: "No", vi: "Không" }))}</em><em class="lf-swr">${esc(nat(W.right || { en: "Yes", vi: "Có" }))}</em></div></div>
        <div class="se-row"><button class="se-btn" data-s="left">◀ ${esc(nat(W.left || { en: "No", vi: "Không" }))}</button><button class="se-btn pri" data-s="right">${esc(nat(W.right || { en: "Yes", vi: "Có" }))} ▶</button></div></div>`, "swipe");
      const card = document.querySelector("[data-card]"); if (!card) return;
      card.onpointerdown = e => {
        if (busy || !live(c)) return; const x0 = e.clientX; try { card.setPointerCapture(e.pointerId); } catch {}
        card.onpointermove = ev => { const dx = ev.clientX - x0; card.style.transform = `translateX(${dx}px) rotate(${dx / 18}deg)`; card.classList.toggle("l", dx < -40); card.classList.toggle("r", dx > 40); };
        card.onpointercancel = () => { card.onpointermove = card.onpointerup = card.onpointercancel = null; card.style.transform = ""; card.classList.remove("l", "r"); };
        card.onpointerup = ev => { card.onpointermove = card.onpointerup = null; const dx = ev.clientX - x0; if (Math.abs(dx) > 90) go(dx > 0 ? "right" : "left"); else { card.style.transform = ""; card.classList.remove("l", "r"); } };
      };
    };
    const go = async side => {
      if (busy || !live(c) || FINISHING.has(res) || DONE.has(res)) return; busy = true;
      const C = cards[k]; E.apply(C[side]); E.flag((W.key || "swipe") + "." + k, side[0]);
      const ok = !C.a || C.a === side; if (C.a && ok) right++;
      const card = document.querySelector("[data-card]"); if (card) { card.style.transition = "transform .3s, opacity .3s"; card.style.transform = `translateX(${side === "right" ? 420 : -420}px) rotate(${side === "right" ? 20 : -20}deg)`; card.style.opacity = "0"; }
      E.sfx(scored ? (ok ? "up" : "wrong") : "whoosh"); E.haptic(ok ? "LIGHT" : "HEAVY");
      if (scored) floatTxt(document.querySelector(".lf-swd"), ok ? "✓" : "✗", ok ? "#6fcf97" : "#fca5a5");
      await wait(320); if (!live(c)) return res(); k++; busy = false;
      if (k >= cards.length) return scored ? finish(res, c, "swipe", right >= need, { en: `${right}/${cards.filter(x => x.a).length} right`, vi: `Đúng ${right}/${cards.filter(x => x.a).length}` }, right) : done(res, c, W.then, "swipe", "then");
      draw();
    };
    ui().onclick = e => { const b = e.target.closest("[data-s]"); if (b) go(b.dataset.s); };
    draw();
    E.autoRun(async () => { while (live(c) && k < cards.length && !DONE.has(res)) { const C = cards[k]; await go(E.auto === "r" ? (Math.random() < 0.5 ? "left" : "right") : C.a || "right"); } });
  }));

  // ═════════ COOK — nấu ăn theo công thức (đọc hướng dẫn + thao tác) ═════════
  // { cook: { dish: { en, vi }, steps: [{ t: { en: "Crack two eggs.", vi }, act: "tap", n: 2 } | { t, act: "hold", zone: [70, 92] }
  //     | { t, act: "time", zone: [45, 60], speed } | { t, act: "pick", opts: [{ en: "salt" }, { en: "sugar" }], a: 0 }], need, ok, fail } }
  def("cook", c => new Promise(res => {
    const K = c.st.cook, steps = K.steps, need = K.need ?? Math.max(1, steps.length - 1);
    let k = 0, good = 0, raf = 0, busy = false;
    c.onCancel?.(() => { busy = true; cancelAnimationFrame(raf); DONE.add(res); res(); });
    E.ui.hideBox();
    if (!steps.length) return done(res, c, K.fail, "cook", "fail");
    const head = () => `<div class="se-xg"><span>${esc(nat(K.dish || { en: "Cooking", vi: "Nấu ăn" }))}</span><b>${"★".repeat(good)}${"☆".repeat(Math.max(0, steps.length - good))}</b></div><div class="lf-ckt"><em>${k + 1}/${steps.length}</em><p>${E.words(L(steps[k].t), E.L)}</p>${subHtml(steps[k].t)}</div>`;
    const stepDone = async ok => {
      if (busy || !live(c) || DONE.has(res)) return; busy = true; cancelAnimationFrame(raf);
      if (ok) { good++; E.sfx("solve"); E.haptic("MEDIUM"); burst(document.querySelector(".lf-ckt"), "#ffd166", 12); } else { E.sfx("wrong"); E.haptic("HEAVY"); E.ui.fx("shake"); }
      floatTxt(document.querySelector(".lf-ckt"), nat(ok ? { en: "Nice!", vi: "Khéo!" } : { en: "Oops…", vi: "Hỏng rồi…" }), ok ? "#ffd166" : "#fca5a5");
      await wait(800); if (!live(c)) return res(); k++; busy = false;
      if (k >= steps.length) return finish(res, c, "cook", good >= need, good >= need ? { en: "Delicious!", vi: "Ngon tuyệt!" } : { en: "Edible… barely", vi: "Ăn được… tạm" }, good);
      run();
    };
    const run = () => {
      const S0 = steps[k], act = S0.act || "tap";
      if (act === "tap") {
        let n = 0; const N = S0.n || 3;
        E.ui.panel(`<div class="lf-ck">${head()}<button class="sp-qb ring" data-ct style="--p:0"><b>${N}</b><small>${esc(nat({ en: "TAP", vi: "CHẠM" }))}</small></button></div>`, "cook");
        ui().onclick = e => { const b = e.target.closest("[data-ct]"); if (!b || busy) return; n++; E.sfx("tap"); E.haptic("LIGHT"); b.style.setProperty("--p", n / N); b.querySelector("b").textContent = N - n; if (n >= N) stepDone(true); };
      } else if (act === "pick") {
        E.ui.panel(`<div class="lf-ck">${head()}<div class="lf-menu">${S0.opts.map((o, i) => `<button data-cp="${i}"><b>${esc(L(o))}</b>${sub(o) ? `<small>${esc(sub(o))}</small>` : ""}</button>`).join("")}</div></div>`, "cook");
        ui().onclick = e => { const b = e.target.closest("[data-cp]"); if (b) stepDone(+b.dataset.cp === (S0.a ?? 0)); };
      } else {
        // hold: giữ để đầy, thả trong vùng xanh · time: kim chạy, bấm trong vùng xanh
        const [z0, z1] = S0.zone || (act === "hold" ? [70, 92] : [42, 58]);
        E.ui.panel(`<div class="lf-ck">${head()}<div class="lf-ckm"><i style="left:${z0}%;width:${z1 - z0}%"></i><em data-nd></em></div><button class="lf-hold" data-ch>${esc(nat(act === "hold" ? { en: "HOLD — release in the green", vi: "GIỮ — thả ở vùng xanh" } : { en: "NOW!", vi: "NGAY!" }))}</button></div>`, "cook");
        let v = 0, holding = false, t1 = performance.now(), last = t1; const sp = S0.speed || 1;
        const nd = () => document.querySelector("[data-nd]");
        const frame = now => { if (busy || !live(c)) return; const dt = (now - last) / 1000; last = now; if (act === "hold") { if (holding) v = Math.min(100, v + dt * 55 * sp); if (v >= 100) return stepDone(false); } else { const ph = ((now - t1) / 1000 * 0.9 * sp) % 2; v = (ph < 1 ? ph : 2 - ph) * 100; } const e = nd(); if (e) e.style.left = v + "%"; raf = requestAnimationFrame(frame); };
        if (!E.auto) raf = requestAnimationFrame(frame);
        if (act === "hold") { ui().onpointerdown = e => { if (e.target.closest("[data-ch]")) { holding = true; E.haptic("LIGHT"); } }; ui().onpointercancel = () => { holding = false; v = 0; const e = nd(); if (e) e.style.left = "0%"; }; ui().onpointerup = () => { if (holding) { holding = false; ui().onpointerdown = null; stepDone(v >= z0 && v <= z1); } }; }
        else ui().onclick = e => { if (e.target.closest("[data-ch]")) stepDone(v >= z0 && v <= z1); };
      }
    };
    run();
    E.autoRun(async () => { while (live(c) && k < steps.length && !DONE.has(res)) { if (busy) { await new Promise(r => setTimeout(r, 40)); continue; } await stepDone(!(E.auto === "r" && Math.random() < 0.25)); } });
  }));

  // ═════════ BUDGET — đi chợ với ngân sách (đủ nhu cầu, không vượt tiền) ═════════
  // { budget: { money: 20 | "coins", spend: true, list: [{ id, en, vi, price, tags: ["food"] }], need: { food: 2, drink: 1 }, needName: { food: { en, vi } }, ok, fail, key } }
  def("budget", c => new Promise(res => {
    const B = c.st.budget, R = E.R(), cap = typeof B.money === "string" ? +R.f[B.money] || 0 : B.money ?? 20, cart = new Set();
    let paid = false;
    E.ui.hideBox();
    const total = () => [...cart].reduce((a, id) => a + B.list.find(x => x.id === id).price, 0);
    const have = t => [...cart].filter(id => B.list.find(x => x.id === id).tags?.includes(t)).length;
    const met = () => Object.entries(B.need || {}).every(([t, n]) => have(t) >= n);
    const draw = (msg = "") => {
      const tot = total(), over = tot > cap;
      E.ui.panel(`<div class="lf-bu"><div class="se-xg"><span>${esc(nat(B.title || { en: "Shopping list", vi: "Danh sách đi chợ" }))}</span><b class="${over ? "no" : ""}">${tot} / ${cap}</b></div>
        <div class="lf-bun">${Object.entries(B.need || {}).map(([t, n]) => `<span class="${have(t) >= n ? "ok" : ""}">${have(t) >= n ? "✓" : "○"} ${esc(nat(B.needName?.[t] || { en: t }))} ${have(t)}/${n}</span>`).join("")}</div>
        <div class="lf-menu">${B.list.map(x => `<button data-bi="${esc(x.id)}" class="${cart.has(x.id) ? "on" : ""}"><b>${esc(L(x))}</b>${sub(x) ? `<small>${esc(sub(x))}</small>` : ""}<em class="sp-price">${x.price}</em></button>`).join("")}</div>
        ${msg}<button class="se-btn pri wide${!over && cart.size ? "" : " dim"}" data-pay ${!over && cart.size ? "" : "disabled"}>${esc(nat(over ? { en: "Over budget", vi: "Vượt ngân sách" } : { en: "Check out", vi: "Thanh toán" }))}</button></div>`, "budget");
    };
    const pay = () => { if (paid || !live(c)) return; paid = true; const ok = met() && total() <= cap; if (B.spend !== false && typeof B.money === "string") E.add(B.money, -total()); E.flag((B.key || "budget") + "_items", [...cart].join(",")); finish(res, c, "budget", ok, ok ? { en: `Everything you need — ${cap - total()} left`, vi: `Đủ hết — còn dư ${cap - total()}` } : { en: "You forgot something", vi: "Bạn quên mua thứ cần thiết" }, total()); };
    ui().onclick = e => {
      if (paid || !live(c)) return;
      const b = e.target.closest("[data-bi]"); if (b) { const id = b.dataset.bi; cart.has(id) ? cart.delete(id) : cart.add(id); E.sfx(cart.has(id) ? "pick" : "tap"); E.haptic("LIGHT"); return draw(); }
      if (e.target.closest("[data-pay]") && total() <= cap && cart.size) pay();
    };
    draw();
    // tự chơi: tham lam rẻ nhất cho mỗi nhu cầu
    E.autoRun(() => { for (const [t, n] of Object.entries(B.need || {})) B.list.filter(x => x.tags?.includes(t)).sort((a, b) => a.price - b.price).slice(0, n).forEach(x => cart.add(x.id)); pay(); });
  }));

  // ═════════ SORT — phân loại thẻ vào ngăn (hộp thư, bằng chứng liên quan / không, đồ giữ / bỏ…) ═════════
  // { sort: { prompt, bins: [{ id: "work", en, vi }], cards: [{ t: { en, vi }, bin: "work" }], ms: 0, need, ok, fail } }
  def("sort", c => new Promise(res => {
    const P = c.st.sort, cards = shuf(P.cards.filter(x => cond(x.if, c.s)), c.key()), need = P.need ?? Math.ceil(cards.length * 0.7);
    let k = 0, right = 0, streak = 0, busy = false;
    E.ui.hideBox();
    if (!cards.length) return done(res, c, P.empty || P.ok, "sort", P.empty ? "empty" : "ok");
    const draw = () => E.ui.panel(`<div class="lf-so"><div class="se-ask">${esc(nat(P.prompt || { en: "Sort them", vi: "Phân loại" }))} <small class="se-mute">${k + 1}/${cards.length}</small></div>
      <div class="lf-soc" data-card><p>${E.words(L(cards[k].t), E.L)}</p>${subHtml(cards[k].t)}</div>
      <div class="lf-sob" style="--n:${P.bins.length}">${P.bins.map(b => `<button data-bn="${esc(b.id)}"><b>${esc(L(b))}</b>${sub(b) ? `<small>${esc(sub(b))}</small>` : ""}</button>`).join("")}</div>
      ${streak >= 3 ? `<p class="lf-sync">${esc(nat({ en: "Streak", vi: "Chuỗi" }))} ×${streak}</p>` : ""}</div>`, "sort");
    const go = async id => {
      if (busy || !live(c) || FINISHING.has(res) || DONE.has(res)) return; busy = true;
      const ok = cards[k].bin === id; if (ok) { right++; streak++; } else streak = 0;
      const b = document.querySelector(`[data-bn="${id}"]`); b?.classList.add(ok ? "ok" : "no");
      E.sfx(ok ? "up" : "wrong"); E.haptic(ok ? "LIGHT" : "HEAVY"); if (!ok) { const r = document.querySelector(`[data-bn="${cards[k].bin}"]`); r?.classList.add("ok"); }
      await wait(ok ? 350 : 900); if (!live(c)) return res(); k++; busy = false;
      if (k >= cards.length) return finish(res, c, "sort", right >= need, { en: `${right}/${cards.length} sorted right`, vi: `Đúng ${right}/${cards.length}` }, right);
      draw();
    };
    ui().onclick = e => { const b = e.target.closest("[data-bn]"); if (b) go(b.dataset.bn); };
    draw();
    E.autoRun(async () => { while (live(c) && k < cards.length && !DONE.has(res)) await go(E.auto === "r" && Math.random() < 0.25 ? P.bins[0].id : cards[k].bin); });
  }));

  // ═════════ ROUTE — đi theo lời chỉ đường (trái / phải / thẳng) trên bản đồ ô phố ═════════
  // { route: { w: 5, h: 5, start: [0, 4], dir: "N", goal: [3, 1], marks: [{ at: [3, 1], en: "bank", vi: "ngân hàng" }], line: { en: "Go straight, then turn right at the café…", vi }, who, tries: 2, ok, fail } }
  // Nút: đi thẳng 1 ô · rẽ trái · rẽ phải · “Tới rồi”. Lời chỉ đường bằng tiếng đang học (có giọng đọc).
  def("route", c => new Promise(res => {
    const P = c.st.route, w = P.w || 5, h = P.h || 5, D = ["N", "E", "S", "W"], mv = { N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] };
    let pos = [...P.start], dir = D.indexOf(P.dir || "N"), path = [P.start.join(",")], tries = 0;
    E.ui.hideBox();
    const markAt = (x, y) => (P.marks || []).find(m => m.at[0] === x && m.at[1] === y);
    const draw = (msg = "") => E.ui.panel(`<div class="lf-ro"><div class="lf-cust">${P.who ? face(P.who) : ""}<div class="lf-bub"><span>${E.words(L(P.line), E.L)}</span>${subHtml(P.line)}</div>${P.who || P.line ? `<button class="se-ib sm" data-hear aria-label="listen">${E.ICON.spk}</button>` : ""}</div>
      <div class="lf-rog" style="--w:${w}">${Array.from({ length: w * h }, (_, i) => { const x = i % w, y = Math.floor(i / w), m = markAt(x, y), me = pos[0] === x && pos[1] === y; return `<i class="${path.includes(x + "," + y) ? "on" : ""}${me ? " me" : ""}">${me ? `<b style="transform:rotate(${dir * 90}deg)">▲</b>` : m ? `<small>${esc(L(m))}</small>` : ""}</i>`; }).join("")}</div>
      ${msg}<div class="lf-roc"><button class="se-btn" data-m="l">↰ ${esc(nat({ en: "Left", vi: "Trái" }))}</button><button class="se-btn" data-m="f">↑ ${esc(nat({ en: "Straight", vi: "Thẳng" }))}</button><button class="se-btn" data-m="r">${esc(nat({ en: "Right", vi: "Phải" }))} ↱</button></div>
      <div class="se-row"><button class="se-btn" data-m="x">${esc(nat({ en: "Start over", vi: "Đi lại" }))}</button><button class="se-btn pri" data-m="here">${esc(nat({ en: "I'm here", vi: "Tới rồi" }))}</button></div></div>`, "route");
    const reset = () => { pos = [...P.start]; dir = D.indexOf(P.dir || "N"); path = [P.start.join(",")]; };
    const here = () => {
      tries++;
      if (pos[0] === P.goal[0] && pos[1] === P.goal[1]) { E.sfx("solve"); burst(document.querySelector(".lf-rog .me"), "#6fcf97", 16); return finish(res, c, "route", true, { en: "You found it!", vi: "Tìm thấy rồi!" }); }
      E.sfx("wrong"); E.ui.fx("shake");
      if (P.tries && tries >= P.tries) return finish(res, c, "route", false, { en: "Lost", vi: "Lạc đường" });
      reset(); draw(`<div class="se-hint no">${esc(nat({ en: "This isn't the place. Listen again and start over.", vi: "Không phải chỗ này. Nghe lại rồi đi lại nhé." }))}</div>`);
    };
    // data-m ở đây là nút trong bảng — closest() dừng ở nút trước khi chạm khung gốc .se[data-m] (luôn kiểm trong .se-panel)
    ui().onclick = e => {
      if (e.target.closest("[data-hear]")) return E.say(L(P.line), P.who || "narr", { force: true, narr: !P.who });
      const b = e.target.closest(".se-panel [data-m]"); if (!b) return; const m = b.dataset.m;
      if (m === "l") dir = (dir + 3) % 4; else if (m === "r") dir = (dir + 1) % 4;
      else if (m === "f") { const [dx, dy] = mv[D[dir]], nx = pos[0] + dx, ny = pos[1] + dy; if (nx < 0 || ny < 0 || nx >= w || ny >= h) { E.sfx("wrong"); return; } pos = [nx, ny]; path.push(pos.join(",")); }
      else if (m === "x") reset(); else if (m === "here") return here();
      E.sfx("tap"); E.haptic("LIGHT"); draw();
    };
    draw(); if (!E.auto) E.say(L(P.line), P.who || "narr", { force: true, narr: !P.who });
    E.autoRun(() => { pos = [...P.goal]; here(); });
  }));

  // ═════════ SCRAMBLE — xếp lại chữ cái thành từ ═════════
  // { scramble: { words: [{ w: "harbour", hint: { vi: "bến cảng" } }], ms: 0, need, ok, fail } }
  def("scramble", c => new Promise(res => {
    const P = c.st.scramble, ws = P.words, need = P.need ?? ws.length;
    let k = 0, got = 0, line = [], tiles = [], busy = false;
    E.ui.hideBox();
    if (!ws.length) return done(res, c, P.empty || P.ok, "scramble", P.empty ? "empty" : "ok");
    const deal = () => { const w = ws[k].w.toUpperCase(); tiles = shuf(Array.from(w), c.key() + k); if (tiles.join("") === w) tiles.reverse(); line = []; };
    const draw = () => E.ui.panel(`<div class="lf-sc"><div class="se-ask">${esc(nat(P.prompt || { en: "Unscramble the word", vi: "Xếp lại thành từ" }))} <small class="se-mute">${k + 1}/${ws.length}</small></div>
      ${ws[k].hint ? `<p class="lf-cpt">${esc(nat(ws[k].hint))}</p>` : ""}
      <div class="lf-scl">${Array.from(ws[k].w).map((_, i) => `<i>${line[i] != null ? esc(tiles[line[i]]) : ""}</i>`).join("")}</div>
      <div class="lf-cpb">${tiles.map((t, i) => `<button class="lf-w${line.includes(i) ? " gone" : ""}" data-k="${i}" ${line.includes(i) ? "disabled" : ""}>${esc(t)}</button>`).join("")}</div>
      <div class="se-row"><button class="se-btn" data-back>${esc(nat({ en: "Undo", vi: "Xoá chữ" }))}</button><button class="se-btn" data-skip>${esc(nat({ en: "Skip", vi: "Bỏ qua" }))}</button></div></div>`, "scramble");
    const nextW = async ok => {
      if (busy || !live(c) || FINISHING.has(res) || DONE.has(res)) return; busy = true;
      if (ok) { got++; E.sfx("solve"); burst(document.querySelector(".lf-scl"), "#6fcf97", 14); if (!E.auto) E.say(ws[k].w, "narr", { force: true, narr: true }); } else E.sfx("down");
      await wait(ok ? 700 : 300); if (!live(c)) return res(); k++;
      if (k >= ws.length) return finish(res, c, "scramble", got >= need, { en: `${got}/${ws.length} words`, vi: `${got}/${ws.length} từ` }, got);
      busy = false; deal(); draw();
    };
    ui().onclick = e => {
      if (busy || !live(c) || FINISHING.has(res) || DONE.has(res)) return;
      const t = e.target.closest("[data-k]");
      if (t) { line.push(+t.dataset.k); E.sfx("pick"); draw(); if (line.length === tiles.length) { const g = line.map(i => tiles[i]).join(""); if (g === ws[k].w.toUpperCase()) return nextW(true); E.sfx("wrong"); E.ui.fx("shake"); E.haptic("HEAVY"); line = []; setTimeout(draw, 250); } return; }
      if (e.target.closest("[data-back]")) { line.pop(); return draw(); }
      if (e.target.closest("[data-skip]")) nextW(false);
    };
    deal(); draw();
    E.autoRun(async () => { while (live(c) && k < ws.length && !DONE.has(res)) await nextW(!(E.auto === "r" && Math.random() < 0.25)); });
  }));

  // ═════════ MATCH — nối 2 cột (từ ↔ nghĩa, người ↔ lời khai, câu hỏi ↔ câu trả lời) ═════════
  // { match: { prompt, pairs: [["pier", { vi: "cầu tàu" }], [{ en: "Who?" }, { en: "Tom." }]], slips: 2, ok, fail } }
  def("match", c => new Promise(res => {
    const P = c.st.match, n = P.pairs.length, lt = shuf(P.pairs.map((_, i) => i), c.key() + "l"), rt = shuf(P.pairs.map((_, i) => i), c.key() + "r");
    const got = new Set(); let sel = -1, miss = 0, flash = -1;
    // cả 2 cột hiện chữ tiếng đang học (học từ); nghĩa / bản dịch nhỏ bên dưới khi bật Dịch
    const lab = o => (typeof o === "string" ? esc(o) : `${esc(L(o))}${sub(o) ? `<small>${esc(sub(o))}</small>` : ""}`);
    E.ui.hideBox();
    const draw = () => E.ui.panel(`<div class="lf-ma"><div class="se-ask">${esc(nat(P.prompt || { en: "Match them up", vi: "Nối cho đúng" }))} <small class="se-mute">${got.size}/${n}</small></div>
      <div class="lf-mag"><div>${lt.map(i => `<button class="lf-w${got.has(i) ? " used" : ""}${sel === i ? " act" : ""}" data-l="${i}" ${got.has(i) ? "disabled" : ""}>${lab(P.pairs[i][0])}</button>`).join("")}</div>
      <div>${rt.map(i => `<button class="lf-w${got.has(i) ? " used" : ""}${flash === i ? " bad" : ""}" data-r="${i}" ${got.has(i) ? "disabled" : ""}>${lab(P.pairs[i][1])}</button>`).join("")}</div></div>
      ${P.slips != null ? `<p class="se-mute">${esc(nat({ en: "Mistakes", vi: "Lỗi" }))} ${miss}/${P.slips}</p>` : ""}</div>`, "match");
    ui().onclick = e => {
      const l = e.target.closest("[data-l]"); if (l) { sel = +l.dataset.l; flash = -1; E.sfx("tap"); return draw(); }
      const r = e.target.closest("[data-r]"); if (!r || sel < 0) return;
      const i = +r.dataset.r;
      if (i === sel) { got.add(i); sel = -1; E.sfx("up"); E.haptic("LIGHT"); draw(); burst(document.querySelector(`[data-r="${i}"]`), "#6fcf97", 8); if (got.size === n) finish(res, c, "match", true, { en: "All matched!", vi: "Nối đủ rồi!" }, miss); return; }
      miss++; flash = i; E.sfx("wrong"); E.haptic("HEAVY"); draw();
      if (P.slips != null && miss > P.slips) finish(res, c, "match", false, { en: "Too many mistakes", vi: "Sai nhiều quá" }, miss);
    };
    draw();
    E.autoRun(() => finish(res, c, "match", !(E.auto === "r" && Math.random() < 0.2), null, 0));
  }));

  // ═════════ DEFUSE — gỡ bom theo sổ hướng dẫn (đọc hiểu dưới áp lực thời gian) ═════════
  // { defuse: { ms: 40000, wires: ["red", "blue", "red", "yellow"], manual: [{ en: "If there is more than one red wire, cut the last red wire.", vi }], a: 2, ok, fail } }
  const WIRE = { red: "#d64545", blue: "#3d7be0", yellow: "#e8c33a", white: "#e8e4da", black: "#2a2a2a", green: "#3aa864" };
  const WNAME = { red: { en: "red", vi: "đỏ" }, blue: { en: "blue", vi: "xanh dương" }, yellow: { en: "yellow", vi: "vàng" }, white: { en: "white", vi: "trắng" }, black: { en: "black", vi: "đen" }, green: { en: "green", vi: "xanh lá" } };
  def("defuse", c => new Promise(res => {
    const P = c.st.defuse, ms = P.ms ?? 40000, t0 = performance.now(); let over = false, iv = 0;
    c.onCancel?.(() => { over = true; clearInterval(iv); DONE.add(res); res(); });
    E.ui.hideBox(); E.ui.urgent(true);
    E.ui.panel(`<div class="lf-df"><div class="lf-dfh"><b data-dt>${Math.ceil(ms / 1000)}</b><small>${esc(nat({ en: "seconds", vi: "giây" }))}</small></div>
      <div class="lf-dfw">${P.wires.map((w, i) => `<button data-wi="${i}" style="--wc:${WIRE[w] || w}" aria-label="${esc(L(WNAME[w] || { en: w }))}"><i></i><small>${i + 1}</small></button>`).join("")}</div>
      <div class="lf-dfm"><em>${esc(nat({ en: "Manual", vi: "Sổ hướng dẫn" }))}</em>${P.manual.map(m => `<p>${E.words(L(m), E.L)}</p>${subHtml(m)}`).join("")}</div></div>`, "defuse");
    const end = async ok => {
      if (over || !live(c)) return; over = true; clearInterval(iv); E.ui.urgent(false);
      if (ok) { E.sfx("solve"); E.haptic("MEDIUM"); } else { E.sfx("hit"); E.haptic("HEAVY"); E.ui.fx("redflash"); E.ui.fx("shake"); }
      finish(res, c, "defuse", ok, ok ? { en: "Defused!", vi: "Gỡ được rồi!" } : { en: "BOOM", vi: "BÙM" });
    };
    iv = setInterval(() => { const left = ms - (performance.now() - t0), d = document.querySelector("[data-dt]"); if (d) { d.textContent = Math.max(0, Math.ceil(left / 1000)); d.classList.toggle("low", left < 10000); } if (left <= 0) end(false); else if (left < 10000) E.sfx("tap"); }, 1000);
    ui().onclick = e => { const b = e.target.closest("[data-wi]"); if (!b || over) return; b.classList.add("cut"); end(+b.dataset.wi === P.a); };
    E.autoRun(() => end(!(E.auto === "r" && Math.random() < 0.25)));
  }));

  // ═════════ TUNE — dò sóng radio / bộ đàm: tới đúng tần số thì tiếng rè tan, nghe được tin nhắn ═════════
  // { tune: { at: 91.4, min: 87, max: 108, who, msg: { en, vi }, ms: 0, ok, fail } }
  def("tune", c => new Promise(res => {
    const P = c.st.tune, mn = P.min ?? 87, mx = P.max ?? 108, at = P.at, rnd = seed(c.key());
    let f = +(mn + (mx - mn) * (0.15 + rnd() * 0.2)).toFixed(1), over = false;
    const text = L(P.msg), noise = Array.from(text).map(() => rnd());
    E.ui.hideBox();
    const draw = () => {
      const d = Math.abs(f - at), clear = Math.max(0, 1 - d / 3), sig = Math.round(clear * 5);
      const shown = Array.from(text).map((ch, i) => (ch === " " || noise[i] < clear * 1.05 ? ch : "░")).join("");
      E.ui.panel(`<div class="lf-tu"><div class="se-ask">${esc(nat(P.prompt || { en: "Find the signal", vi: "Dò tìm sóng" }))}</div>
        <div class="lf-tuf"><b>${f.toFixed(1)}</b><small>MHz</small><span class="lf-tus">${Array.from({ length: 5 }, (_, i) => `<i class="${i < sig ? "on" : ""}" style="height:${6 + i * 4}px"></i>`).join("")}</span></div>
        <input type="range" min="${mn}" max="${mx}" step="0.1" value="${f}" data-r aria-label="MHz">
        <div class="lf-bub lf-tum${d < 0.25 ? " ok" : ""}"><span>${esc(shown)}</span>${d < 0.25 ? subHtml(P.msg) : ""}</div></div>`, "tune");
      const r = document.querySelector("[data-r]"); if (r) r.oninput = () => { f = +(+r.value).toFixed(1); const q = document.querySelector(".lf-tuf b"); draw(); if (Math.abs(f - at) < 0.25) lock(); else if (q) E.haptic(Math.abs(f - at) < 1 ? "MEDIUM" : "LIGHT"); };
    };
    const lock = async () => {
      if (over) return; over = true; E.sfx("solve"); E.haptic("HEAVY");
      if (!E.auto) await E.say(text, P.who || "narr", { force: true, narr: !P.who });
      await wait(900);
      finish(res, c, "tune", true, { en: "Signal found", vi: "Bắt được sóng" });
    };
    draw();
    E.autoRun(() => { f = at; lock(); });
  }));
  // ═════════ EVENT — sự kiện ngẫu nhiên (đời thường: đang làm thì có chuyện xảy ra) ═════════
  // story.events = { cafe: [{ id: "cat", w: 2, once: true, if, max, cool, then: [bước — cảnh truyện đầy đủ] }, …] } (chương cũng khai được)
  // Bước: { event: "cafe" } · { event: { pool: "cafe" | [danh sách tại chỗ], chance: 0.5, else: [bước] } }
  //   chance = xác suất có sự kiện · w = trọng số · once = chỉ 1 lần mỗi lượt chơi · max = tối đa N lần · cool = phải cách N lần gieo mới lặp lại
  //   if = điều kiện. Sự kiện chạy như cảnh thường rồi QUAY VỀ đúng chỗ cũ; trong sự kiện lại có { event } = sự kiện lồng nhau.
  //   Kết quả định trước theo hạt giống của lượt chơi (tải lại không đổi, chơi lượt mới thì khác). Cờ ev_<id> = số lần đã xảy ra.
  def("event", async c => {
    const V = typeof c.st.event === "string" ? { pool: c.st.event } : c.st.event, R = E.R();
    const inline = Array.isArray(V.pool), list = inline ? V.pool : E.S().events?.[V.pool] || [];
    const ev = (R.ev ||= { n: {}, last: {}, t: 0, seed: (Date.now() % 1e9) | 0 });
    const rnd = seed(ev.seed + ":" + c.key() + ":" + ev.t), t = ev.t++;
    const ok = (e, i) => { const id = e.id || i; return cond(e.if, c.s) && !(e.once && ev.n[id]) && !(e.max && (ev.n[id] || 0) >= e.max) && !(e.cool && ev.last[id] != null && t - ev.last[id] <= e.cool); };
    const elig = list.map((e, i) => [e, i]).filter(([e, i]) => ok(e, i));
    if (!elig.length || rnd() >= (V.chance ?? 1)) { if (V.else) c.push("event", "else"); return; }
    let r = rnd() * elig.reduce((a, [e]) => a + (e.w ?? 1), 0), pick = elig[0];
    for (const x of elig) { r -= x[0].w ?? 1; if (r <= 0) { pick = x; break; } }
    const [e, i] = pick, id = e.id || i;
    ev.n[id] = (ev.n[id] || 0) + 1; ev.last[id] = t; E.flag("ev_" + id, ev.n[id]);
    if (e.go) return E.jump(e.go);
    if (!e.then) return;
    if (inline) c.push("event", "pool", i, "then");
    else R.stack.push({ n: "@events", p: [V.pool, i, "then"], i: 0 });
  });

  // ═════════ GUESS — đoán từ kiểu Wordle (mật khẩu, tên bài hát, món cô ấy thích…) ═════════
  // { guess: { word: "VINYL", tries: 6, hint: { en, vi }, words: ["SOCKS", …] (gợi ý bàn phím không cần), ok, fail } }
  // Xanh = đúng chữ đúng chỗ · vàng = có chữ nhưng sai chỗ · xám = không có. Chỉ nhận đúng số chữ.
  def("guess", c => new Promise(res => {
    const G0 = c.st.guess, W = String(G0.word).toUpperCase(), n = W.length, max = G0.tries ?? 5, rows = []; let cur = "", over = false, shake = false, judging = false;
    const KB = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
    E.ui.hideBox();
    const score = g => { const r = Array(n).fill("x"), left = {}; for (let i = 0; i < n; i++) if (g[i] === W[i]) r[i] = "g"; else left[W[i]] = (left[W[i]] || 0) + 1; for (let i = 0; i < n; i++) if (r[i] !== "g" && left[g[i]]) { r[i] = "y"; left[g[i]]--; } return r; };
    const keyState = ch => { let st = ""; for (const g of rows) { const sc = score(g); for (let i = 0; i < n; i++) if (g[i] === ch) { if (sc[i] === "g") return "g"; if (sc[i] === "y") st = "y"; else if (!st) st = "x"; } } return st; };
    const draw = (msg = "") => E.ui.panel(`<div class="lf-gs"><div class="se-ask">${esc(nat(G0.prompt || { en: `Guess the ${n}-letter word`, vi: `Đoán từ ${n} chữ cái` }))}</div>
      ${G0.hint ? `<p class="se-hint">${E.ICON.bulb}${esc(nat(G0.hint))}</p>` : ""}
      <p class="lf-gsl"><span><i class="g"></i>${esc(nat({ en: "right letter, right place", vi: "đúng chữ, đúng chỗ" }))}</span><span><i class="y"></i>${esc(nat({ en: "in the word, wrong place", vi: "có trong từ, sai chỗ" }))}</span><span><i class="x"></i>${esc(nat({ en: "not in the word", vi: "không có" }))}</span></p>
      <div class="lf-gsg${shake ? " bad" : ""}" style="--n:${n}">${Array.from({ length: Math.min(max, rows.length + 1) }, (_, r) => { const g = rows[r] || (r === rows.length ? cur.padEnd(n) : " ".repeat(n)), sc = rows[r] ? score(rows[r]) : null; return Array.from(g).map((ch, i) => `<i class="${sc ? sc[i] : ch.trim() ? "t" : ""}">${esc(ch.trim())}</i>`).join(""); }).join("")}</div>
      <small class="se-mute lf-gsn">${esc(nat({ en: `${max - rows.length} tries left`, vi: `Còn ${max - rows.length} lượt đoán` }))}</small>
      ${msg}<div class="lf-kb">${KB.map((row, ri) => `<div>${ri === 2 ? `<button data-k="⏎" class="wide">${esc(nat({ en: "Enter", vi: "Gửi" }))}</button>` : ""}${Array.from(row).map(ch => `<button data-k="${ch}" class="${keyState(ch)}">${ch}</button>`).join("")}${ri === 2 ? `<button data-k="⌫" class="wide" aria-label="delete">⌫</button>` : ""}</div>`).join("")}</div></div>`, "guess");
    const fin = async ok => { if (over || !live(c)) return; over = true; document.removeEventListener("keydown", kd); E.flag(G0.key || "guess_" + c.key(), ok ? rows.length : 0); if (!E.auto) E.say(W.toLowerCase(), "narr", { force: true, narr: true }); await verdict(ok, ok ? nat({ en: `${W} — in ${rows.length}!`, vi: `${W} — ${rows.length} lần!` }) : W); done(res, c, ok ? G0.ok : G0.fail, "guess", ok ? "ok" : "fail"); };
    const press = k => {
      if (over || judging || !live(c)) return;
      if (k === "⌫") { cur = cur.slice(0, -1); return draw(); }
      if (k === "⏎") {
        if (cur.length < n) { shake = true; E.sfx("wrong"); draw(`<div class="se-hint no">${esc(nat({ en: `Type ${n} letters.`, vi: `Gõ đủ ${n} chữ.` }))}</div>`); shake = false; return; }
        rows.push(cur); cur = ""; E.sfx(rows[rows.length - 1] === W ? "solve" : "page"); E.haptic("LIGHT"); draw();
        if (rows[rows.length - 1] === W) { judging = true; burst(document.querySelector(".lf-gsg"), "#6fcf97", 18); return setTimeout(() => fin(true), E.auto ? 0 : 700); }
        if (rows.length >= max) { judging = true; return setTimeout(() => fin(false), E.auto ? 0 : 500); }
        return;
      }
      if (cur.length < n && /^[A-Z]$/.test(k)) { cur += k; E.sfx("tap"); draw(); }
    };
    const kd = e => { const k = e.key === "Enter" ? "⏎" : e.key === "Backspace" ? "⌫" : e.key.length === 1 ? e.key.toUpperCase() : ""; if (k) { e.preventDefault(); press(k); } };
    document.addEventListener("keydown", kd);
    c.onCancel?.(() => { over = true; document.removeEventListener("keydown", kd); DONE.add(res); res(); });
    ui().onclick = e => { const b = e.target.closest("[data-k]"); if (b) press(b.dataset.k); };
    draw();
    E.autoRun(() => { if (E.auto === "r" && Math.random() < 0.25) { rows.push(...Array(max).fill("Z".repeat(n))); return fin(false); } rows.push(W); fin(true); });
  }));

  // ═════════ PACK — xếp đồ vào túi theo lời dặn (đọc hiểu) ═════════
  // { pack: { note: { en: "Bring something warm, something to read and snacks for two.", vi }, who, slots: 4,
  //     items: [{ id, en, vi, icon, pic, tags: ["warm"] }], need: { warm: 1, read: 1, snack: 2 }, ok, fail } }
  def("pack", c => new Promise(res => {
    const P = c.st.pack, slots = P.slots ?? 4, bag = [];
    let over = false;
    E.ui.hideBox();
    const it = id => P.items.find(x => x.id === id);
    const met = () => Object.entries(P.need || {}).every(([t, n]) => bag.filter(id => it(id).tags?.includes(t)).length >= n);
    const tile = x => x.pic ? `<i class="im-${esc(x.pic)}"></i>` : `<span class="lf-mi">${E.ICON[x.icon] || esc(tgt(x).charAt(0).toUpperCase())}</span>`;
    const draw = (msg = "") => E.ui.panel(`<div class="lf-pk">${P.who ? `<div class="lf-cust">${face(P.who)}<div class="lf-bub"><span>${E.words(tgt(P.note), E.L)}</span>${subHtml(P.note)}</div></div>` : `<div class="lf-cpt">${E.words(tgt(P.note), E.L)}${subHtml(P.note)}</div>`}
      <div class="lf-bag" data-bag>${Array.from({ length: slots }, (_, i) => bag[i] ? `<button data-out="${i}">${tile(it(bag[i]))}<b>${esc(tgt(it(bag[i])))}</b></button>` : `<i></i>`).join("")}<small>${bag.length}/${slots}</small></div>
      <div class="lf-menu">${P.items.filter(x => !bag.includes(x.id)).map(x => `<button data-mi="${esc(x.id)}">${tile(x)}<b>${esc(tgt(x))}</b>${sub(x) ? `<small>${esc(sub(x))}</small>` : ""}</button>`).join("")}</div>
      ${msg}<button class="se-btn pri wide${bag.length ? "" : " dim"}" data-go ${bag.length ? "" : "disabled"}>${esc(nat({ en: "Zip the bag", vi: "Kéo khoá túi" }))}</button></div>`, "pack");
    const add = id => { if (over || !live(c) || bag.includes(id)) return; if (bag.length >= slots) { E.sfx("wrong"); return draw(`<div class="se-hint no">${esc(nat({ en: "The bag is full — take something out.", vi: "Túi đầy rồi — bỏ bớt ra." }))}</div>`); } bag.push(id); E.sfx("pick"); E.haptic("LIGHT"); draw(); };
    const fin = async () => { if (over || !live(c)) return; over = true; const ok = met(); E.flag(P.key || "pack_" + c.key(), bag.join(",")); for (const id of bag) E.apply(it(id)); await verdict(ok, nat(ok ? { en: "Packed and ready!", vi: "Xếp xong, sẵn sàng!" } : { en: "You forgot something…", vi: "Hình như quên gì đó…" })); done(res, c, ok ? P.ok : P.fail, "pack", ok ? "ok" : "fail"); };
    ui().onpointerdown = E.dragger?.({ src: "[data-mi], [data-out]", dst: "[data-bag]", drop: (a, d) => { if (a.dataset.mi) { if (d) add(a.dataset.mi); return; } if (!d) { bag.splice(+a.dataset.out, 1); E.sfx("tap"); draw(); } } });
    ui().onclick = e => {
      if (over || !live(c)) return;
      if (E.dragged?.()) return;
      const m = e.target.closest("[data-mi]"); if (m) return add(m.dataset.mi);
      const o = e.target.closest("[data-out]"); if (o) { bag.splice(+o.dataset.out, 1); E.sfx("tap"); return draw(); }
      if (e.target.closest("[data-go]") && bag.length) fin();
    };
    draw(); if (P.who && !E.auto) E.say(tgt(P.note), P.who);
    E.autoRun(() => { for (const [t, n] of Object.entries(P.need || {})) P.items.filter(x => x.tags?.includes(t) && !bag.includes(x.id)).slice(0, n).forEach(x => bag.length < slots && bag.push(x.id)); fin(); });
  }));

  // ═════════ RHYTHM — nhảy / đánh trống theo nhịp (buổi hẹn nhạc sống, lễ hội, tập nhảy) ═════════
  // { rhythm: { prompt, bpm: 96, beats: 16, lanes: 3, need: 0.6, ok, fail } } — nốt rơi xuống, chạm làn đúng lúc nốt chạm vạch
  def("rhythm", c => new Promise(res => {
    const P = c.st.rhythm, bpm = P.bpm ?? 96, nb = P.beats ?? 16, lanes = P.lanes ?? 3, per = 60000 / bpm, fall = per * 3, rnd = seed(c.key());
    const notes = Array.from({ length: nb }, (_, i) => ({ t: per * (i + 2) + (rnd() < 0.2 ? per / 2 : 0), l: Math.floor(rnd() * lanes), hit: 0 }));
    let t0 = 0, raf = 0, over = false, good = 0, combo = 0, best = 0, beat = 0;
    c.onCancel?.(() => { over = true; cancelAnimationFrame(raf); DONE.add(res); res(); });
    E.ui.hideBox();
    E.ui.panel(`<div class="lf-rh"><div class="se-ask">${esc(nat(P.prompt || { en: "Feel the beat!", vi: "Bắt nhịp nào!" }))}</div>
      <div class="lf-rhs"><span>${esc(nat({ en: "Combo", vi: "Combo" }))} <b data-cb>0</b></span><span>${esc(nat({ en: "Hits", vi: "Trúng" }))} <b data-gd>0</b>/${nb}</span></div>
      <div class="lf-rhf" style="--l:${lanes}" data-f>${Array.from({ length: lanes }, (_, l) => `<div class="lf-rhl" data-l="${l}"></div>`).join("")}<i class="lf-rhline"></i></div>
      <div class="lf-rhb" style="--l:${lanes}">${Array.from({ length: lanes }, (_, l) => `<button data-lane="${l}" aria-label="lane ${l + 1}"></button>`).join("")}</div></div>`, "rhythm");
    const field = () => document.querySelector("[data-f]");
    const end = () => { if (over || !live(c)) return; over = true; cancelAnimationFrame(raf); const ok = good >= Math.ceil(nb * (P.need ?? 0.6)); E.flag(P.key || "rhythm_" + c.key(), good); finish(res, c, "rhythm", ok, ok ? { en: `Nailed it! Best combo ${best}`, vi: `Chuẩn nhịp! Combo cao nhất ${best}` } : { en: "Out of step…", vi: "Lệch nhịp rồi…" }, good); };
    const frame = now => {
      if (over || !live(c)) return; const t = now - t0, f = field(); if (!f) return;
      const h = f.clientHeight;
      f.querySelectorAll(".lf-note").forEach(n => n.remove());
      for (const n of notes) { if (n.hit) continue; const dt = n.t - t; if (dt < -180) { n.hit = -1; combo = 0; const cb = document.querySelector("[data-cb]"); if (cb) cb.textContent = 0; continue; } if (dt > fall) continue; const y = h * (1 - dt / fall) - 12; f.querySelector(`[data-l="${n.l}"]`)?.insertAdjacentHTML("beforeend", `<i class="lf-note" style="top:${y}px"></i>`); }
      const b = Math.floor(t / per); if (b !== beat) { beat = b; f.classList.remove("pulse"); void f.offsetWidth; f.classList.add("pulse"); }
      if (!notes.length || t > notes[notes.length - 1].t + 600) return end();
      raf = requestAnimationFrame(frame);
    };
    ui().onpointerdown = e => {
      const b = e.target.closest("[data-lane]"); if (!b || over) return; e.preventDefault();
      const l = +b.dataset.lane, t = performance.now() - t0, n = notes.find(x => !x.hit && x.l === l && Math.abs(x.t - t) < 160);
      b.classList.remove("hit", "miss"); void b.offsetWidth;
      if (n) { n.hit = 1; good++; combo++; best = Math.max(best, combo); b.classList.add("hit"); E.sfx("beat"); E.haptic("LIGHT"); if (combo % 5 === 0) floatTxt(b, "×" + combo, "#ffd166"); }
      else { combo = 0; b.classList.add("miss"); }
      const cb = document.querySelector("[data-cb]"), gd = document.querySelector("[data-gd]"); if (cb) cb.textContent = combo; if (gd) gd.textContent = good;
    };
    if (!E.auto) { t0 = performance.now(); raf = requestAnimationFrame(frame); }
    E.autoRun(() => { good = E.auto === "r" && Math.random() < 0.25 ? 0 : nb; best = good; end(); });
  }));

  // ═════════ HUD — tim / chỉ số / tiền luôn hiện (đời thường, hẹn hò…) ═════════
  // story.hud = ["coins", "charm", "smart", "mia"] (cả truyện) · bước { hud: [...] } đổi danh sách · { hud: false } tắt
  // Chip góc trên (dưới thanh công cụ): nhân vật = ♥ + tên · chỉ số = tên + số. Chạm → bảng “Chỉ số”: mọi story.stats (thanh theo max),
  // thiện cảm từng người đã gặp, tiền. Chỉ số trong story.stats có thể khai { en, vi, max: 10, icon: "<tên E.ICON>" }.
  const hudKeys = () => { const R = E.R(); const k = R && R.hud !== undefined ? R.hud : E.S()?.hud; return Array.isArray(k) ? k : []; };
  const isChar = k => E.S().chars?.[k] && !E.S().stats?.[k];
  const val = k => +E.R().f[k] || 0;
  let hudLast = {};
  // nút CHỈ SỐ tròn ngay dưới nút menu (người dùng 30/10: dải chip nhìn thô) — chỉ số đổi thì nút nảy + chấm báo; bấm = bảng chỉ số
  // icon chỉ số thường gặp (story.stats.<mã>.icon = tên) — thêm vào E.ICON nếu chưa có
  Object.assign(E.ICON, Object.fromEntries(Object.entries({
    coin: "<svg viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"8\"/><path d=\"M12 8v8M9.5 10.5c0-1 1-1.5 2.5-1.5s2.5.6 2.5 1.6c0 2.4-5 1.2-5 3.6 0 1 1 1.8 2.5 1.8s2.5-.6 2.5-1.5\"/></svg>",
    gym: "<svg viewBox=\"0 0 24 24\"><path d=\"M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10\"/></svg>",
    star: "<svg viewBox=\"0 0 24 24\"><path d=\"M12 4l2.4 5 5.4.6-4 3.7 1.1 5.3L12 16l-4.9 2.6 1.1-5.3-4-3.7 5.4-.6z\"/></svg>",
    heart: "<svg viewBox=\"0 0 24 24\"><path d=\"M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z\"/></svg>",
    smile: "<svg viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"8\"/><path d=\"M9 14c1.5 1.5 4.5 1.5 6 0M9.5 10h.01M14.5 10h.01\"/></svg>",
  }).filter(([k]) => !E.ICON[k])));
  const IC_ME = `<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></svg>`;
  const IC_STATS = `<svg viewBox="0 0 24 24"><path d="M5 20V11M12 20V5M19 20v-6"/></svg>`;
  const drawHud2 = () => {
    if (!E.R()) return;
    const keys = hudKeys(), host = document.querySelector(".se"); if (!host) return;
    let el = host.querySelector(".lf-hud");
    const on = keys.length || (E.S().profile && E.R().hud !== false && !(Array.isArray(E.R().hud) && !E.R().hud.length && E.R().hudOff));
    if (!on) { el?.remove(); return; }
    if (!el) { el = document.createElement("button"); el.className = "lf-hud"; el.setAttribute("aria-label", nat({ en: "Profile", vi: "Cá nhân" })); el.innerHTML = IC_ME + "<i></i>"; el.onclick = e => { e.stopPropagation(); el.classList.remove("new"); E.sfx("open"); openStats(); }; host.appendChild(el); }
    const changed = keys.some(k => hudLast[k] != null && hudLast[k] !== val(k));
    if (changed) { el.classList.add("new"); el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }
    hudLast = Object.fromEntries(keys.map(k => [k, val(k)]));
  };
  const openStats = () => {
    const S = E.S(), R = E.R(), keys = hudKeys();
    const stats = [...new Set([...keys.filter(k => !isChar(k)), ...Object.keys(S.stats || {})])];
    const people = [...new Set([...keys.filter(isChar), ...Object.keys(S.chars || {}).filter(id => id !== "me" && R.met?.[id] && R.f[id] != null)])];
    const card = k => { const st = S.stats?.[k] || {}, v = val(k), max = st.max, ic = st.icon && E.ICON[st.icon] ? E.ICON[st.icon] : IC_STATS;
      return `<div class="lf-sc2"><span class="lf-sci">${ic}</span><div><small>${esc(statName(k))}</small><b>${v}${max ? `<em>/${max}</em>` : ""}</b>${max ? `<i><u style="width:${Math.max(0, Math.min(100, (v / max) * 100))}%"></u></i>` : ""}</div></div>`; };
    const person = id => { const v = val(id), max = S.chars[id].max || 10, h = Math.max(0, Math.min(5, Math.round((v / max) * 5)));
      return `<div class="lf-pp2">${face(id)}<b>${esc(cname(id))}</b><span class="lf-hearts" style="--c:${color(id)}">${"♥".repeat(h)}<s>${"♥".repeat(5 - h)}</s></span><em>${v}</em></div>`; };
    // story.profile = { role: { en, vi } | (s) => …, lines: [{ label: { en, vi }, value: { en, vi } | (s) => chữ | số, if }], bag: true }
    const P = S.profile || {}, st = E.state(), txt = v => (typeof v === "function" ? v(st) : v), show = v => { const x = txt(v); return x == null ? "" : typeof x === "object" ? nat(x) : String(x); };
    const lines = (P.lines || []).filter(l => cond(l.if, st)).map(l => `<div class="lf-pl"><span>${esc(show(l.label))}</span><b>${esc(show(l.value))}</b></div>`).join("");
    // TAB (người dùng 30/10): Tổng quan · Chỉ số · Tình cảm · Đồ đạc · Trang phục — tab nào không có gì thì ẩn;
    //   story.profile.tabs = [{ id, label: { en, vi }, html: (s) => chuỗi HTML }] thêm tab riêng của truyện
    const bagHtml = R.items.length ? `<div class="lf-bagl">${R.items.map(id => `<span>${E.itemArt(id, "sm")}<small>${esc(nat(S.items[id]?.name))}</small>${S.items[id]?.desc ? `<em>${esc(nat(S.items[id].desc))}</em>` : ""}</span>`).join("")}</div>` : "";
    const head = `<div class="lf-meh">${E.meImg() ? `<span class="lf-mepic"><i class="im-${esc(E.meImg())}"></i></span>` : face("me")}<div><b>${esc(E.G().set.name || nat({ en: "You", vi: "Bạn" }))}</b>${P.role ? `<small>${esc(show(P.role))}</small>` : ""}${curOutfit() && S.outfits?.[curOutfit()] ? `<small class="lf-wearing">${esc(nat({ en: "Wearing", vi: "Đang mặc" }))}: <b>${esc(nat(S.outfits[curOutfit()]))}</b></small>` : ""}</div></div>`;
    const T = [
      ["me", { en: "Overview", vi: "Tổng quan" }, () => head + (lines ? `<div class="lf-pls">${lines}</div>` : "") + (stats.length ? `<div class="lf-scg mini">${stats.slice(0, 4).map(card).join("")}</div>` : "")],
      ["stats", { en: "Stats", vi: "Chỉ số" }, () => stats.length ? `<div class="lf-scg">${stats.map(card).join("")}</div>` : ""],
      ["people", { en: "People", vi: "Tình cảm" }, () => people.map(person).join("")],
      ["bag", { en: "Items", vi: "Đồ đạc" }, () => P.bag !== false ? bagHtml : ""],
      ["wear", { en: "Outfits", vi: "Trang phục" }, () => P.wardrobe !== false && outfits().length > 1 ? (canWear() ? `<p class="se-mute">${esc(nat({ en: "Tap an outfit to wear it.", vi: "Chạm 1 bộ để mặc." }))}</p>` : `<p class="se-hint lf-wlock">${E.ICON.lock}${esc(lockWhy())}</p>`) + `<div class="${canWear() ? "" : "lf-wdoff"}">${wardHtml(outfits(), curOutfit())}</div>` : ""],
      ...(P.tabs || []).filter(t => cond(t.if, st)).map(t => [t.id, t.label, () => t.html(st)]),
    ].map(([id, label, fn]) => [id, label, fn()]).filter(([id, , html]) => id === "me" || html);
    let tab = openStats.tab && T.some(t => t[0] === openStats.tab) ? openStats.tab : "me";
    const body = () => `<div class="lf-pt">${T.length > 1 ? `<div class="lf-ptabs">${T.map(([id, label]) => `<button data-pt="${id}" class="${id === tab ? "on" : ""}">${esc(nat(label))}</button>`).join("")}</div>` : ""}<div class="lf-sts">${T.find(t => t[0] === tab)[2]}</div></div>`;
    const sh = E.ui.sheet(nat({ en: "Profile", vi: "Cá nhân" }), body(), "tall");
    const showTab = () => sh.querySelector(".lf-ptabs .on")?.scrollIntoView({ inline: "center", block: "nearest" }); showTab();
    sh.onclick = e => {
      if (e.target.closest("[data-x]")) return E.ui.closeSheet();
      const t = e.target.closest("[data-pt]"); if (t) { openStats.tab = tab = t.dataset.pt; E.sfx("page"); sh.querySelector(".se-shb").innerHTML = body(); showTab(); return; }
      const b = e.target.closest("[data-wear]"); if (b && !canWear()) { E.sfx("wrong"); return; }
      if (b) { wear(b.dataset.wear); E.sfx("pick"); E.haptic("LIGHT"); openStats.tab = "wear"; openStats(); }
    };
  };
  E.ui.stats = openStats;

  // ═════════ TRANG PHỤC — nhân vật chính mặc gì (ảnh đổi theo) ═════════
  // story.outfits = { casual: { en, vi, img: "me-casual", tags: ["casual"], if }, suit: { … } } · story.me.outfit = bộ mặc lúc đầu
  // Bước { wear: "suit" } = mặc ngay · { wardrobe: { prompt, opts: [mã…], want: ["formal"], score: "mia", match, miss, then } } = tự chọn (có chấm hợp dịp)
  // Bảng Cá nhân có nút “Thay đồ” khi story.profile.wardrobe !== false và có ≥ 2 bộ mở khoá. Cờ outfit = mã bộ đang mặc (dùng trong if).
  const outfits = () => Object.entries(E.S().outfits || {}).filter(([, o]) => cond(o.if, E.state()));
  const curOutfit = () => E.R()?.f.outfit || E.S().me?.outfit || outfits()[0]?.[0];
  E.meImg = () => E.S().outfits?.[curOutfit()]?.img || E.S().me?.img;
  // được thay đồ trong bảng Cá nhân không: không khoá (R.wearLock) + profile.wardrobe (true / điều kiện / hàm) cho phép
  const canWear = () => !E.R()?.wearLock && cond(E.S().profile?.wardrobe ?? true, E.state());
  const lockWhy = () => { const w = E.R()?.wearLock; return w && typeof w === "object" ? nat(w) : nat({ en: "You've already picked today's outfit.", vi: "Hôm nay đã chọn đồ rồi." }); };
  def("wearLock", async ({ st }) => { E.R().wearLock = st.wearLock === false ? null : st.wearLock === true ? 1 : st.wearLock; });
  // sang mốc mới (ngày / chương) = mở khoá thay đồ
  E.on("step", type => { if (type === "cp" && E.R()?.wearLock) E.R().wearLock = null; });
  const wear = id => { if (!E.S().outfits?.[id]) return; E.flag("outfit", id); drawHud2(); };
  def("wear", async ({ st }) => { wear(st.wear); if (!st.quiet && !E.auto) E.ui.toast(`${E.ICON.box}<span><small>${esc(nat({ en: "Now wearing", vi: "Đang mặc" }))}</small>${esc(nat(E.S().outfits[st.wear] || {}))}</span>`, 1800); });
  const wardHtml = (list, sel) => `<div class="lf-wd">${list.map(([id, o]) => `<button class="lf-wdi${id === sel ? " on" : ""}" data-wear="${esc(id)}">${o.img ? `<i class="im-${esc(o.img)}"></i>` : `<span class="lf-mi">${E.ICON.box}</span>`}<b>${esc(nat(o))}</b>${id === curOutfit() ? `<small>${esc(nat({ en: "Wearing", vi: "Đang mặc" }))}</small>` : ""}</button>`).join("")}</div>`;
  def("wardrobe", c => new Promise(res => {
    const W = c.st.wardrobe, list = outfits().filter(([id]) => !W.opts || W.opts.includes(id));
    if (!list.length) return done(res, c, W.empty, "wardrobe", "empty");
    let sel = list.some(([id]) => id === curOutfit()) ? curOutfit() : list[0][0];
    E.ui.hideBox();
    const draw = () => E.ui.panel(`<div class="lf-wdp"><div class="se-ask">${esc(nat(W.prompt || { en: "What will you wear?", vi: "Bạn mặc gì?" }))}</div>
      <div class="lf-wdv">${E.S().outfits?.[sel]?.img ? `<i class="im-${esc(E.S().outfits[sel].img)}"></i>` : face("me")}</div>
      ${wardHtml(list, sel)}<button class="se-btn pri wide" data-ok>${esc(nat({ en: "Wear this", vi: "Mặc bộ này" }))}</button></div>`, "wardrobe");
    ui().onclick = e => {
      const b = e.target.closest("[data-wear]"); if (b) { sel = b.dataset.wear; E.sfx("pick"); E.haptic("LIGHT"); return draw(); }
      if (e.target.closest("[data-ok]")) go(sel);
    };
    const go = async id => {
      if (DONE.has(res) || !live(c) || !list.some(([key]) => key === id)) return;
      wear(id); const o = E.S().outfits[id] || {};
      // đồ chọn cho dịp này = đồ hôm nay: khoá thay trong bảng Cá nhân tới mốc kế tiếp (lock: false để không khoá)
      if (W.lock !== false) E.R().wearLock = W.lockWhy || 1;
      let k = "then";
      if (W.want) { const hit = (o.tags || []).some(t => W.want.includes(t)); if (W.score) E.add(W.score, hit ? 1 : -1); k = hit ? "match" : "miss"; }
      done(res, c, W[k], "wardrobe", k);
    };
    draw();
    E.autoRun(() => go(pickAuto(list)?.[0] || sel));
  }));
  def("hud", async ({ st }) => { const R = E.R(); R.hud = st.hud === false ? [] : [].concat(st.hud); R.hudOff = st.hud === false; drawHud2(); });
  E.on("step", () => drawHud2());
  const flag0 = E.flag; E.flag = (k, v) => { const r = flag0(k, v); try { if (hudKeys().includes(k)) setTimeout(drawHud2, 0); } catch {} return r; };

  // ═════════ CẢM GIÁC GAME dùng chung (mọi màn, mọi truyện) ═════════
  // 1) chỉ số người chơi thấy được đổi (story.stats · thanh meter) → chip nổi giữa trên “Mia ♥ +2” / “Can đảm +1”
  //    (gộp các lần đổi cùng lúc; tự chơi thì bỏ). Biến nội bộ (puzzles, fillN…) không hiện.
  // thiện cảm nhân vật đã có thông báo “… sẽ nhớ điều này” của core → không hiện chip trùng (trừ khi có thanh meter riêng)
  const visible = k => E.S()?.stats?.[k] || E.R()?.meters?.[k];
  let chipQ = {}, chipT = 0;
  const flushChips = () => {
    const host = document.querySelector(".se"); if (!host) { chipQ = {}; return; }
    const box = host.querySelector(".fx-chips") || host.appendChild(Object.assign(document.createElement("div"), { className: "fx-chips" }));
    for (const [k, v] of Object.entries(chipQ)) {
      if (!v) continue;
      const ch = E.S().chars?.[k] && !E.S().stats?.[k], el = document.createElement("b");
      el.className = "fx-chip " + (v > 0 ? "up" : "down"); el.textContent = `${ch ? cname(k) + " ♥" : statName(k)} ${v > 0 ? "+" : "−"}${Math.abs(v)}`;
      box.appendChild(el); setTimeout(() => el.remove(), 2300);
    }
    chipQ = {};
  };
  const add0 = E.add;
  E.add = (k, n) => { const r = add0(k, n); try { if (!E.auto && +n && visible(k)) { chipQ[k] = (chipQ[k] || 0) + +n; clearTimeout(chipT); chipT = setTimeout(flushChips, 140); } } catch {} try { if (hudKeys().includes(k)) setTimeout(drawHud2, 0); } catch {} return r; };
  // 2) nhấn mọi nút trong game: rung nhẹ (nút lún xuống ở ui.css)
  document.addEventListener("pointerdown", e => { const b = e.target.closest?.(".se button"); if (b && !b.disabled && !E.auto) E.haptic("LIGHT"); }, true);
})();
