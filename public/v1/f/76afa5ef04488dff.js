// Enmi Story Engine — CÁC CƠ CHẾ (mỗi cơ chế = StoryEngine.def(tên, async ctx => …)). Truyện nào cũng dùng chung.
// ctx: st (bước) · s (trạng thái cho điều kiện) · push(...khoá) chạy mảng bước con (vd. push("choice", 2, "then")) ·
//      again() chạy lại chính bước này sau khi bước con xong (vòng lặp: khám phá, chọn lặp, giải đố) · key(...) khoá duy nhất của bước.
// Danh sách: bg show hide n think say · set add item drop truth word go if cp wait fx title · choice (giờ, khoá, trực giác, đồ vật, lặp) ·
//   explore (điểm nóng, dùng đồ lên cảnh, ghép đồ) · map (chọn hướng đi) · interpret (phiên dịch 2 chiều) · present (vạch lời khai sai) ·
//   listen (nghe không chữ) · quiz · lock (khoá số / chữ) · order (xếp thứ tự / dòng thời gian) · type (gõ câu trả lời) · review · end
(() => {
  const E = globalThis.StoryEngine, def = E.def, esc = E.esc, h = E.h;
  const T = k => E.ui.tr(k);
  const nat = t => E.nat(t), tgt = t => E.tgt(t);
  const pick = (arr) => arr[E.auto === "r" ? Math.floor(Math.random() * arr.length) : 0];
  const later = (fn, ms = 5) => setTimeout(fn, ms);
  // trộn ổn định theo khoá bước (tải lại không đổi thứ tự)
  const shuffle = (arr, seed) => { const a = arr.map((x, i) => [x, i]); let s = E.hash(seed); for (let i = a.length - 1; i > 0; i--) { s = (s * 1103515245 + 12345) >>> 0; const j = s % (i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const cond = (c, s) => (c == null ? true : typeof c === "function" ? !!c(s) : typeof c === "string" ? s.truth(c) || s.has(c) || !!s.f[c] : !!c);
  const optText = o => ({ main: E.tgt(o), sub: E.sub(o) });
  const L = (o) => nat(o);
  // nhãn kiểu câu (hỏi cung / giọng điệu): o.tag
  const TAGS = {
    open: { en: "Open question", vi: "Câu hỏi mở" }, lead: { en: "Leading", vi: "Dẫn dắt" }, press: { en: "Pressure", vi: "Gây sức ép" },
    kind: { en: "Kind", vi: "Đồng cảm" }, bluff: { en: "Bluff", vi: "Tố khống" }, polite: { en: "Polite", vi: "Lịch sự" }, direct: { en: "Direct", vi: "Thẳng" }, lie: { en: "Lie", vi: "Nói dối" },
  };

  // ───────── cảnh, nhân vật, lời ─────────
  def("bg", async ({ st }) => E.ui.scene(st.bg));
  // face có thể là hàm theo trạng thái: face: s => (s.f.angry ? "cold" : "")
  def("show", async ({ st }) => E.ui.show(st.show, st.at, typeof st.face === "function" ? st.face(E.state()) || "" : st.face));
  def("hide", async ({ st }) => E.ui.hide(st.hide));
  def("n", async ({ st }) => { const t = E.narr(st.n); await E.ui.line({ kind: "n", ...t, on: st.on, pic: st.pic }); });
  def("think", async ({ st }) => { const t = E.narr(st.think); await E.ui.line({ kind: "think", ...t, on: st.on, pic: st.pic }); });
  def("say", async ({ st }) => {
    const who = st.say, ch = who === "me" ? null : E.S().chars[who];
    if (st.face && who !== "me" && E.R().cast[who]) E.ui.show(who, E.R().cast[who].at, st.face);
    // bạn nói tiếng mẹ đẻ với người cùng quê: say: "me", lang: "@N"
    const t = E.speech(st, who === "me" ? (st.lang ? { lang: st.lang } : null) : ch);
    await E.ui.line({ who, kind: "say", ...t, whisper: st.whisper, cls: st.phone ? "phone" : "", tag: st.phone ? "☎" : st.tag || "", pic: st.pic });
  });

  // ───────── trạng thái ─────────
  def("set", async ({ st }) => { for (const k in st.set) E.flag(k, st.set[k]); });
  def("add", async ({ st }) => { for (const k in st.add) E.add(k, st.add[k]); });
  def("item", async ({ st }) => {
    const R = E.R(); if (R.items.includes(st.item)) return;
    R.items.push(st.item);
    const it = E.S().items[st.item];
    // nhận vật mới: thông báo có ẢNH vật + mô tả ngắn (người dùng 29/10)
    if (!st.quiet) { E.ui.toast(`${E.itemArt(st.item, "t")}<span><small>${T("newItem")}</small><b>${esc(nat(it?.name))}</b>${it?.desc ? `<em>${esc(nat(it.desc))}</em>` : ""}</span>`, 3200, "item"); E.ui.dot(true); E.sfx("item"); E.haptic("LIGHT"); }
  });
  def("drop", async ({ st }) => { const R = E.R(); R.items = R.items.filter(x => x !== st.drop); });
  def("truth", async ({ st }) => {
    const G = E.G(), R = E.R(), id = st.truth, t = E.S().truths?.[id];
    R.truths[id] = 1;
    if (G.truths[id]) return;
    G.truths[id] = Date.now(); E.save();
    E.ui.dot(true);
    E.ui.hideBox();
    E.sfx("truth"); E.haptic("HEAVY");
    await E.ui.card(`<div class="se-tc"><small>${T("newTruth")}</small><div class="se-tcn">${Object.keys(G.truths).length}<span>/${E.S().truthTotal || "?"}</span></div><b>${esc(nat(t?.name))}</b><p>${esc(nat(t?.text))}</p><i>${T("tapNext")}</i></div>`, 0, "truth");
  });
  def("word", async ({ st }) => { const G = E.G(); for (const w of [].concat(st.word)) G.words[w] ||= Date.now(); });
  def("go", async ({ st }) => E.jump(st.go));
  def("if", async (c) => { const ok = cond(c.st.if, c.s); if (ok && c.st.then) c.push("then"); else if (!ok && c.st.else) c.push("else"); if (ok && c.st.go) E.jump(c.st.go); });
  def("cp", async ({ st }) => E.cp(st.cp));
  def("wait", ({ st }) => new Promise(r => setTimeout(r, E.auto ? 1 : st.wait)));
  def("fx", async ({ st }) => (E.effect?.run ? E.effect.run(st.fx, st) : E.ui.fx(st.fx)));
  // gặp / biết tên 1 nhân vật (nhân vật reveal: "manual", hoặc biết tên trước khi bước ra): { meet: "<mã>" }
  def("meet", async ({ st }) => { for (const id of [].concat(st.meet)) E.meet(id, true); });
  // tranh minh hoạ khoảnh khắc lớn: { cg: "cg-sandal" } · { cg: null } = về cảnh
  def("cg", async ({ st }) => E.ui.cg(st.cg));
  // thẻ chương (viền điện ảnh, chữ hiện dần) / thẻ mốc thời gian ({ title } không có ch)
  def("title", async ({ st }) => {
    E.ui.hideBox(); E.ui.hide("*");
    const t = st.title;
    // vào chương mới: ghi chương trước đã xong + chụp lần chơi đầu chương (“Chơi chương N” ở màn tổng quan)
    if (t.ch) { E.R().ch = t.ch; E.chAt?.(t.ch); }
    E.sfx("title");
    await E.ui.card(t.ch
      ? `<div class="se-ct"><small>${esc(nat({ en: "Chapter " + t.ch, vi: "Chương " + t.ch }))}</small><b>${esc(tgt(t))}</b><em></em>${E.L !== E.N && tx2(t) ? `<i>${esc(tx2(t))}</i>` : ""}</div>`
      : `<div class="se-ct time"><b>${esc(tgt(t))}</b>${E.L !== E.N && tx2(t) ? `<i>${esc(tx2(t))}</i>` : ""}</div>`, t.ch ? 3600 : 2400, t.ch ? "chap" : "time");
  });
  const tx2 = t => E.sub(t);

  // NHÃN GIỌNG ĐIỆU của lựa chọn (engine 3, người dùng 30/10: “tag dẫn dắt, thẳng thắn… nhiều chỗ không hợp”):
  //   · truyện tự khai bộ nhãn của mình: story.tags = { warm: { en: "Warm", vi: "Ấm áp", c: "#f59e0b" }, cold: {…} } (chương thêm được) —
  //     ghi đè / bổ sung bộ có sẵn (open lead press kind bluff polite direct lie = bộ HỎI CUNG, chỉ hợp cảnh thẩm vấn)
  //   · story.tags = false → không hiện nhãn nào · nhãn ngay tại chỗ: tag: { en: "Sarcastic", vi: "Mỉa mai" }
  //   · lựa chọn HÀNH ĐỘNG “(…)” không hiện nhãn hỏi cung có sẵn (chỉ nhãn truyện tự khai) · mã nhãn không ai khai → không hiện (không lộ mã thô)
  const tagHtml = (t, act) => {
    const ST = E.S().tags;
    if (ST === false) return "";
    const own = typeof t === "object" ? t : ST?.[t];
    const def = own || (!act ? TAGS[t] : null);
    if (!def) return "";
    const c = def.c || def.color;
    return `<em class="se-tag${typeof t === "string" && !own ? " t-" + esc(t) : ""}"${c ? ` style="background:color-mix(in srgb, ${c} 22%, #fff);color:color-mix(in srgb, ${c} 70%, #000)"` : ""}>${esc(nat(def))}</em>`;
  };
  // ───────── LỰA CHỌN: giờ · khoá (lockHint) · trực giác (need: id sự thật) · đồ vật (item) · lặp (loop + once) ─────────
  def("choice", (c) => new Promise(res => {
    const { st, s } = c, R = E.R(), G = E.G();
    // once nhớ theo vị trí bước — hoặc theo o.id (cùng 1 câu hỏi dùng ở nhiều chỗ, vd. then + again của 1 điểm khám xét)
    const onceK = (o, i) => (o.id ? "o:" + o.id : c.key(i));
    const list = [];
    st.choice.forEach((o, i) => {
      if (o.if && !cond(o.if, s)) return;
      if (o.once && R.used[onceK(o, i)]) return;
      if (o.item && !s.has(o.item)) return;
      let locked = false;
      if (o.need) {
        const ok = typeof o.need === "string" ? !!G.truths[o.need] : cond(o.need, s);
        if (!ok) { if (o.lockHint) locked = true; else return; }
      }
      list.push({ o, i, locked });
    });
    const usable = list.filter(x => !x.locked);
    if (st.skipIfOne && usable.length <= 1 && !usable.some(x => x.o.intuition)) return res();
    // câu nhân vật vừa nói nhắc lại ở đầu bảng (đang trả lời ai, câu gì)
    const q = R.last && R.last.who && R.last.who !== "me" && R.log[R.log.length - 1]?.kind === "say" ? R.last : null;
    const qc = q && E.S().chars[q.who];
    // hộp lời nhường chỗ (câu vừa nói đã nhắc lại ở đầu bảng) — trừ khi câu cuối là lời dẫn / suy nghĩ (giữ làm ngữ cảnh)
    if (q || R.log[R.log.length - 1]?.who === "me") E.ui.hideBox();
    const box = E.ui.panel(`${q ? `<div class="se-q" style="--c:${qc?.color || "#aaa"}"><b>${esc(E.cname(qc, true))}</b><span>${E.words(q.text, q.lang)}</span></div>` : ""}${st.prompt ? `<div class="se-ask">${esc(L(st.prompt))}</div>` : ""}${st.timer ? `<div class="se-timer"><i style="animation-duration:${st.timer}s"></i></div>` : ""}<div class="se-chs">${list.map(({ o, i, locked }, k) => {
      const t = optText(o), act = /^\(/.test(t.main);
      const sub = t.sub ? `<small${E.G().set.tr || E.G().set.mode === "easy" ? "" : " hidden"}>${esc(t.sub)}</small>` : "";
      const tag = o.intuition ? `<em class="se-int">✦ ${T("intuition")}</em>` : o.item ? `<em class="se-itag">${E.ICON[E.S().items[o.item]?.icon] || E.ICON.box}</em>` : o.tag ? tagHtml(o.tag, act) : "";
      const hear = !act && !locked && !o.silent ? `<i class="se-hear" data-hear="${i}">${E.ICON.spk}</i>` : "";
      return `<button class="se-ch-b${act ? " act" : ""}${o.intuition ? " int" : ""}${locked ? " lock" : ""}" data-i="${i}" style="--k:${k}" ${locked ? "disabled" : ""}>${tag}<span>${esc(t.main)}</span>${sub}${locked ? `<small class="se-lh">🔒 ${esc(L(o.lockHint))}</small>` : ""}${hear}</button>`;
    }).join("")}</div>`, "chs");
    E.sfx("open");
    let beat = null;
    if (st.timer && !E.auto) { E.ui.urgent(true); beat = setInterval(() => E.sfx("beat"), 1000); E.haptic("LIGHT"); }
    let tm = null, done = false;
    const finish = async (o, i) => {
      if (done) return; done = true; clearTimeout(tm); clearInterval(beat); E.ui.urgent(false);
      if (o) {
        // phương án được chọn sáng lên, phương án khác lùi ra
        const bt = box.querySelector(`[data-i="${i}"]`);
        bt?.classList.add("picked"); box.querySelectorAll(".se-ch-b").forEach(x => x !== bt && x.classList.add("off"));
        E.sfx("pick"); E.haptic("LIGHT");
        if (!E.auto) await new Promise(r => setTimeout(r, 380));
      }
      E.ui.clear();
      if (o) {
        if (o.once) R.used[onceK(o, i)] = 1;
        E.apply(o);
        if (o.loop === false || (st.loop && !o.once)) {} // vòng lặp kết thúc ở lựa chọn không có once
        else if (st.loop) c.again();
        const t = optText(o);
        // NÓI THEO câu vừa chọn (như truyện nhập vai): app mở bảng micro, chấm từng từ — tắt ở màn tổng quan (Nói theo câu đã chọn)
        let said = false;
        if (!/^\(/.test(t.main) && !o.silent && E.G().set.shadow && globalThis.Enmi?.shadow && !E.auto) { E.hush(); said = !!(await globalThis.Enmi.shadow(t.main, { tr: t.sub }).catch(() => null))?.ok; }
        if (!/^\(/.test(t.main) && !o.silent) await E.ui.line({ who: "me", kind: "say", main: t.main, sub: t.sub, lang: E.L, ...(said ? { speak: "" } : {}) });
        if (o.then) c.push("choice", i, "then");
      } else if (st.timeout) c.push("timeout");
      res();
    };
    box.onclick = e => {
      const hr = e.target.closest("[data-hear]");
      if (hr) { e.stopPropagation(); const o = st.choice[+hr.dataset.hear]; return E.say(optText(o).main, "me", { force: true, lang: E.L }); }
      const b = e.target.closest("[data-i]"); if (b && !b.disabled) finish(st.choice[+b.dataset.i], +b.dataset.i);
    };
    if (st.timer) tm = setTimeout(() => finish(null), st.timer * 1000);
    E.autoRun(() => { const x = pick(usable); x ? finish(x.o, x.i) : finish(null); });
  }));

  // ───────── KHÁM PHÁ: điểm nóng trên cảnh + túi đồ (dùng đồ lên điểm, ghép 2 đồ) ─────────
  // spot: { id, x, y, label, then, again, clue, dark, use: { <đồ>: [bước] }, if }  · story.combos: [{ a, b, make, then }]
  //   again = lần chạm sau (khác lần đầu — người dùng 29/10: chạm lại không được lặp nguyên cảnh): [bước] hoặc [[bước], [bước]…] (lần lượt).
  //     Không ghi again: điểm manh mối → 1 câu “đã xem rồi” · điểm khác (nói chuyện…) → chạy lại then.
  //   stuck = chạm lại chỗ cần đồ mà chưa dùng đồ (gợi ý rõ hơn lần đầu).
  //   dark = chỗ tối: chưa dùng đồ → cận cảnh tối om; dùng đồ → vùng sáng đèn pin.
  // TÚI ĐỒ (29/10, theo kiểu game phiêu lưu điểm-và-chạm): chạm 1 món = CẦM món đó (thẻ nhỏ hiện tên + mô tả ngay trong bảng, không toast);
  //   chạm món khác = ĐỔI sang món đó (trước: chạm món khác là GHÉP → người chơi muốn đổi đồ lại thành ghép). Ghép = nút “Ghép với…” rồi chạm món kia.
  //   Mọi phản hồi (không dùng được, không ghép được) hiện tại chỗ trong bảng.
  // ĐẾM MANH MỐI: đã tìm / tổng số điểm manh mối (không còn “3/3” khiến tưởng đã xong); đủ tối thiểu (need) mới bấm Xong được,
  //   còn chỗ chưa xem thì hỏi lại trước khi rời.
  def("explore", (c) => new Promise(res => {
    const { st } = c, X = st.explore, R = E.R(), S = E.S();
    S.nodes.__combo = (S.combos || []).map(k => k.then || []);
    S.nodes.__xp_seen = [{ think: X.seen || { en: "You've already checked this. Nothing new.", vi: "Chỗ này bạn xem kỹ rồi. Không có gì mới." } }];
    E.ui.hideBox(); E.ui.zoom(null);
    const vis = id => R.used[c.key("v", id)];
    const spots = X.spots.filter(sp => !sp.if || cond(sp.if, c.s));
    const clues = spots.filter(sp => sp.clue);
    const found = () => clues.filter(sp => vis(sp.id)).length;
    const layer = document.querySelector(".se-spots");
    const nm = id => esc(nat(S.items[id]?.name) || id);
    let sel = null, mode = "", msg = "", ask = false;
    const draw = () => {
      layer.innerHTML = spots.map(sp => {
        const need = sp.use && R.used[c.key("t", sp.id)] && !R.used[c.key("u", sp.id)];
        return `<button class="se-spot${vis(sp.id) ? " seen" : ""}${need ? " need" : ""}${sp.clue ? " clue" : ""}${sel ? " aim" : ""}" data-sp="${sp.id}" style="left:${Math.max(10, Math.min(90, sp.x))}%;top:${Math.max(12, Math.min(64, sp.y))}%"><i></i><span>${esc(L(sp.label))}</span></button>`;
      }).join("");
      const n = found(), tot = clues.length, need = Math.min(X.need ?? 0, tot), ok = n >= need;
      const items = R.items.filter(id => id === sel || E.itemLive(id));
      const bag = items.map(id => `<button class="se-bi${sel === id ? " on" : ""}${mode && sel && sel !== id ? " pick" : ""}" data-it="${id}" aria-label="${nm(id)}">${E.itemArt(id, "sm")}</button>`).join("");
      const it = sel && S.items[sel];
      const card = it ? `<div class="se-hold"><span class="se-hia">${E.itemArt(sel, "sm")}</span><div><b>${nm(sel)}</b><small>${mode ? esc(nat({ en: "Now tap the item to combine it with.", vi: "Giờ chạm món muốn ghép cùng." })) : esc(nat({ en: "Tap a place in the scene to use it there.", vi: "Chạm vào một chỗ trên cảnh để dùng." }))}</small></div>
          <span class="se-hbtn">${(S.combos || []).length ? `<button class="se-btn sm${mode ? " on" : ""}" data-cmb>${esc(nat({ en: "Combine", vi: "Ghép" }))}</button>` : ""}<button class="se-ib sm" data-unsel aria-label="${T("close")}">${E.ICON.x}</button></span></div>` : "";
      const askHtml = ask ? `<div class="se-ask2"><b>${esc(nat({ en: `${tot - n} place${tot - n > 1 ? "s" : ""} not checked yet.`, vi: `Còn ${tot - n} chỗ chưa xem.` }))}</b><p>${esc(nat({ en: "Missing clues can make your deductions wrong. Leave anyway?", vi: "Thiếu manh mối có thể khiến bạn suy luận sai. Vẫn rời đi?" }))}</p><div class="se-row"><button class="se-btn" data-ask-no>${esc(nat({ en: "Keep searching", vi: "Xem tiếp" }))}</button><button class="se-btn pri" data-ask-yes>${esc(nat({ en: "Leave", vi: "Vẫn rời đi" }))}</button></div></div>` : "";
      E.ui.panel(`<div class="se-xg${sel || ask ? " one" : ""}"><span>${esc(L(X.goal))}</span>${tot ? `<b title="${esc(nat({ en: "Clues found", vi: "Manh mối đã tìm" }))}">${n}/${tot}</b>` : ""}</div>
        ${askHtml || `${card}${msg ? `<div class="se-xmsg">${msg}</div>` : ""}
        ${items.length ? `<div class="se-bagl">${esc(nat({ en: sel ? "Your bag — tap another item to switch" : "Your bag — tap an item to hold it", vi: sel ? "Túi đồ — chạm món khác để đổi" : "Túi đồ — chạm 1 món để cầm lên" }))}</div><div class="se-bag">${bag}</div>` : ""}
        <button class="se-btn pri wide${ok ? "" : " dim"}" data-done ${ok ? "" : "disabled"}>${ok ? esc(L(X.done) || T("cont")) : esc(nat({ en: `Find ${need - n} more clue${need - n > 1 ? "s" : ""}`, vi: `Cần thêm ${need - n} manh mối` }))}</button>`}`, "xp");
      fitSpots();
    };
    // các điểm nằm TRỌN phía trên bảng: cầm 1 món thì bảng cao lên (thẻ món + túi đồ) và từng che mất điểm ở thấp (người dùng 29/10, khỉ bấm bắt được)
    //   → co vùng điểm lại theo chiều cao bảng (đo offsetHeight — bảng đang trượt lên thì vị trí đo được chưa đúng)
    const fitSpots = () => {
      const p = document.querySelector(".se-ui .se-panel"), u = document.querySelector(".se-ui"), rt = document.querySelector(".se");
      if (!p || !u || !rt) return;
      const R0 = rt.getBoundingClientRect(), tb = document.querySelector(".se-top")?.getBoundingClientRect();
      layer.style.bottom = Math.max(0, R0.bottom - u.getBoundingClientRect().bottom + p.offsetHeight + 8) + "px";
      // dưới thanh trên cùng (nút menu / sổ tay…) — vùng co lại thì 12 % chiều cao có thể lọt dưới thanh đó
      layer.style.top = tb && !document.querySelector(".se-top").hidden ? Math.max(0, tb.bottom - R0.top - 20) + "px" : "";
    };
    const finish = () => { layer.innerHTML = ""; layer.style.bottom = layer.style.top = ""; E.ui.clear(); E.ui.zoom(null); res(); };
    // vào 1 điểm: cận cảnh chỗ đó (nền phóng vào điểm) rồi chạy các bước; xong các bước → khám phá chạy lại (again) và thu cận cảnh
    const runSpot = (sp, look, go) => { layer.innerHTML = ""; layer.style.bottom = layer.style.top = ""; E.ui.clear(); E.ui.zoom(sp.x, sp.y, look); c.again(); go(); res(); };
    const onSpot = id => {
      const i = X.spots.findIndex(s => s.id === id), sp = X.spots[i];
      if (sel) {
        const it = sel;
        // dùng đúng đồ = tìm ra manh mối của điểm này (điểm có `use` chỉ tính là đã tìm khi dùng đồ)
        // đã dùng đúng món này ở đây rồi → 1 câu “đã thử rồi”, không chạy lại cả cảnh
        if (sp.use?.[it] && R.used[c.key("ui", id, it)]) { sel = null; mode = ""; msg = esc(nat({ en: "You already tried that here.", vi: "Bạn đã thử món này ở đây rồi." })); return draw(); }
        if (sp.use?.[it]) R.used[c.key("ui", id, it)] = 1;
        if (sp.use?.[it]) { sel = null; mode = ""; msg = ""; R.used[c.key("v", id)] = 1; R.used[c.key("u", id)] = 1; return runSpot(sp, sp.dark ? "torch" : "", () => c.push("explore", "spots", i, "use", it)); }
        E.sfx("wrong");
        msg = esc(nat(X.noUse || { en: `${nat(S.items[it]?.name)} doesn't help at "${nat(sp.label)}".`, vi: `${nat(S.items[it]?.name)} không dùng được ở “${nat(sp.label)}”.` }));
        return draw();
      }
      const solved = !sp.use || R.used[c.key("u", id)];
      const n = (R.used[c.key("n", id)] = (+R.used[c.key("n", id)] || 0) + 1);
      const first = !vis(id) && !R.used[c.key("t", id)];
      if (solved) R.used[c.key("v", id)] = 1; else R.used[c.key("t", id)] = 1;
      msg = "";
      const look = sp.dark && !solved ? "dark" : sp.dark ? "torch" : "";
      // chạm lại chỗ CHƯA giải (vd. bậc thang tối, chưa dùng đèn pin) → stuck (gợi ý rõ hơn) hoặc lại then
      if (!first && !solved) return runSpot(sp, look, () => c.push("explore", "spots", i, sp.stuck ? "stuck" : "then"));
      if (!first && sp.again) return runSpot(sp, look, () => Array.isArray(sp.again[0]) ? c.push("explore", "spots", i, "again", (n - 2) % sp.again.length) : c.push("explore", "spots", i, "again"));
      if (!first && sp.clue && solved) return runSpot(sp, look, () => R.stack.push({ n: "__xp_seen", p: [], i: 0 }));
      if (sp.then) return runSpot(sp, look, () => c.push("explore", "spots", i, "then"));
      draw();
    };
    const onItem = id => {
      E.sfx("tap");
      if (mode && sel && sel !== id) {
        const a = sel, ci = (S.combos || []).findIndex(k => (k.a === a && k.b === id) || (k.b === a && k.a === id));
        mode = "";
        if (ci < 0) { msg = esc(nat({ en: `${nat(S.items[a]?.name)} and ${nat(S.items[id]?.name)} don't go together.`, vi: `${nat(S.items[a]?.name)} và ${nat(S.items[id]?.name)} không ghép được.` })); return draw(); }
        const k = S.combos[ci];
        if (R.used["cmb:" + ci]) { msg = esc(nat({ en: "You've already combined these.", vi: "Hai món này bạn ghép rồi." })); sel = null; return draw(); }
        R.used["cmb:" + ci] = 1;
        sel = null;
        if (k.make) { R.items = R.items.filter(x => x !== k.a && x !== k.b); R.items.push(k.make); sel = k.make; msg = `✓ ${esc(nat({ en: "New item:", vi: "Đồ mới:" }))} <b>${nm(k.make)}</b>`; E.sfx("item"); }
        if (k.then) { layer.innerHTML = ""; E.ui.clear(); c.again(); R.stack.push({ n: "__combo", p: [ci], i: 0 }); return res(); }
        return draw();
      }
      msg = ""; mode = "";
      sel = sel === id ? null : id;
      draw();
    };
    layer.onclick = e => { const b = e.target.closest("[data-sp]"); if (b) onSpot(b.dataset.sp); };
    draw();
    document.querySelector(".se-ui").onclick = e => {
      if (e.target.closest("[data-ask-yes]")) return finish();
      if (e.target.closest("[data-ask-no]")) { ask = false; E.sfx("tap"); return draw(); }
      if (e.target.closest("[data-done]")) { if (found() < clues.length && !E.auto) { ask = true; sel = null; mode = ""; E.sfx("tap"); return draw(); } return finish(); }
      if (e.target.closest("[data-unsel]")) { sel = null; mode = ""; msg = ""; E.sfx("tap"); return draw(); }
      if (e.target.closest("[data-cmb]")) { mode = mode ? "" : "combine"; msg = ""; E.sfx("tap"); return draw(); }
      if (e.target.closest(".se-hia")) return sel && E.ui.itemView(sel);
      const it = e.target.closest("[data-it]"); if (it) onItem(it.dataset.it);
    };
    E.autoRun(() => {
      // thử dùng đồ đúng chỗ → ghép đồ → xem điểm chưa xem
      const u = spots.find(sp => sp.use && !R.used[c.key("u", sp.id)] && Object.keys(sp.use).some(it => R.items.includes(it)));
      if (u) { sel = Object.keys(u.use).find(it => R.items.includes(it)); return onSpot(u.id); }
      const k = (S.combos || []).find(k => R.items.includes(k.a) && R.items.includes(k.b));
      if (k) { sel = k.a; mode = "combine"; return onItem(k.b); }
      const nx = spots.find(sp => !vis(sp.id) && !R.used[c.key("t", sp.id)]);
      nx ? onSpot(nx.id) : finish();
    });
  }));

  // ───────── SUY LUẬN: câu hỏi của vụ án → chọn 2 manh mối (đồ vật / ghi chú trong hồ sơ) → nối ─────────
  // { deduce: { q, a: [id, id] (không cần thứ tự) | [[id,id], [id,id]] (nhiều cặp đúng), hint, tries, ok, fail } }
  def("deduce", (c) => new Promise(res => {
    const D = c.st.deduce, R = E.R(), S = E.S();
    const pairs = Array.isArray(D.a[0]) ? D.a : [D.a];
    // thiếu manh mối (không cặp đúng nào có đủ trong hồ sơ) → BÁO TRƯỚC (người dùng 29/10), cho chọn thử hay bỏ qua
    const can = pairs.some(p => p.every(id => R.items.includes(id)));
    let sel = [], tries = 0, warned = can;
    E.ui.hideBox();
    const head = `<div class="se-dd"><div class="se-ddh">${E.ICON.bulb}<small>${esc(nat({ en: "Deduction", vi: "Suy luận" }))}</small></div><b class="se-ddq">${esc(L(D.q))}</b>`;
    const draw = (msg = "") => {
      const left = D.tries ? D.tries - tries : 0;
      const el = !warned
        ? E.ui.panel(`${head}</div><div class="se-ask2 warn"><b>${esc(nat({ en: "You don't have enough clues to answer this for sure.", vi: "Bạn chưa đủ manh mối để trả lời chắc chắn." }))}</b><p>${esc(nat(D.missing || { en: "You may have missed something during the search.", vi: "Có thể bạn đã bỏ sót một chỗ khi khám xét." }))}</p><div class="se-row"><button class="se-btn" data-skip>${esc(nat({ en: "Skip", vi: "Bỏ qua" }))}</button><button class="se-btn pri" data-try>${esc(nat({ en: "Try anyway", vi: "Vẫn thử" }))}</button></div></div>`, "deduce")
        : E.ui.panel(`${head}<p class="se-mute">${esc(nat({ en: "Pick the two clues that answer it.", vi: "Chọn 2 manh mối trả lời được câu này." }))}${left && tries ? ` · ${esc(nat({ en: `${left} tries left`, vi: `còn ${left} lần thử` }))}` : ""}</p></div>
        <div class="se-ddg">${R.items.map(id => `<button class="se-ddc${sel.includes(id) ? " on" : ""}" data-c="${id}">${E.itemArt(id, "sm")}<b>${esc(nat(S.items[id]?.name))}</b><small>${esc(nat(S.items[id]?.desc))}</small>${sel.includes(id) ? `<em>${sel.indexOf(id) + 1}</em>` : ""}</button>`).join("")}</div>
        ${msg}<button class="se-btn pri wide${sel.length === 2 ? "" : " dim"}" data-go ${sel.length === 2 ? "" : "disabled"}>${esc(sel.length === 2 ? nat({ en: "Connect these two", vi: "Nối 2 manh mối này" }) : nat({ en: `Choose ${2 - sel.length} more`, vi: `Chọn thêm ${2 - sel.length}` }))}</button>`, "deduce");
      el.onclick = e => {
        if (e.target.closest("[data-skip]")) { E.ui.clear(); if (D.fail) c.push("deduce", "fail"); return res(); }
        if (e.target.closest("[data-try]")) { warned = true; E.sfx("tap"); return draw(); }
        const b = e.target.closest("[data-c]");
        if (b) { const id = b.dataset.c; sel = sel.includes(id) ? sel.filter(x => x !== id) : [...sel.slice(-1), id]; E.sfx("tap"); return draw(); }
        if (e.target.closest("[data-go]") && sel.length === 2) check();
      };
    };
    const check = () => {
      tries++;
      const ok = pairs.some(p => p.includes(sel[0]) && p.includes(sel[1]));
      if (ok) { E.ui.fx("solve"); E.sfx("solve"); E.haptic("MEDIUM"); E.add("deduced", 1); E.ui.clear(); if (D.ok) c.push("deduce", "ok"); return res(); }
      E.ui.fx("shake"); E.sfx("wrong");
      if (D.tries && tries >= D.tries) { E.ui.clear(); if (D.fail) c.push("deduce", "fail"); return res(); }
      sel = [];
      // gợi ý ngay sau lần sai đầu (trước: phải sai 2 lần)
      draw(`<div class="se-hint no">${esc(nat({ en: "Those two don't explain it.", vi: "Hai thứ đó không giải thích được." }))}${D.hint ? `<p>💡 ${esc(L(D.hint))}</p>` : ""}</div>`);
    };
    draw();
    E.autoRun(() => { sel = [...pairs[0]].filter(id => R.items.includes(id)); if (sel.length === 2) check(); else { E.ui.clear(); if (D.fail) c.push("deduce", "fail"); res(); } });
  }));

  // ───────── BẢN ĐỒ: chọn hướng đi / nơi đến ─────────
  // { map: { goal, img?, places: [{ id, x, y, label, desc, go | then, if, need, lockHint, once }] } }
  def("map", (c) => new Promise(res => {
    const { st, s } = c, M = st.map, R = E.R();
    E.ui.hideBox();
    const ps = M.places.map((p, i) => ({ p, i })).filter(({ p }) => !p.if || cond(p.if, s)).filter(({ p, i }) => !(p.once && R.used[c.key(i)]));
    const el = E.ui.panel(`<div class="se-map"${M.img ? ` style="background-image:url('${esc(M.img)}')"` : ""}>
      <div class="se-xg"><span>${esc(L(M.goal))}</span></div>
      ${ps.map(({ p, i }) => { const lock = p.need && !cond(p.need, s); const seen = R.used[c.key("v", i)]; return `<button class="se-pl${lock ? " lock" : ""}${seen ? " seen" : ""}" data-i="${i}" style="left:${p.x}%;top:${p.y}%" ${lock ? "disabled" : ""}><i></i><b>${esc(L(p.label))}</b>${p.desc ? `<small>${esc(L(p.desc))}</small>` : ""}${lock && p.lockHint ? `<small>🔒 ${esc(L(p.lockHint))}</small>` : ""}</button>`; }).join("")}
    </div>`, "map");
    const go = i => {
      const p = M.places[i]; E.ui.clear(); R.used[c.key("v", i)] = 1; if (p.once) R.used[c.key(i)] = 1;
      E.apply(p);
      if (p.then) { if (M.loop) c.again(); c.push("map", "places", i, "then"); }
      if (p.go) E.jump(p.go);
      res();
    };
    el.onclick = e => { const b = e.target.closest("[data-i]"); if (b && !b.disabled) go(+b.dataset.i); };
    E.autoRun(() => { const x = pick(ps.filter(({ p }) => !(p.need && !cond(p.need, s)))); if (x) go(x.i); else res(); });
  }));

  // NÚT GỐC | DỊCH dùng chung cho giấy tờ (sổ tay, biên bản, dòng thời gian): đổi cả trang sang bản dịch rồi đổi lại
  //   (người dùng 29/10: ghi sổ tay / ký biên bản không có chỗ bấm dịch). Nhớ lựa chọn ở G.set.docTr.
  const docTx = x => (x == null ? "" : E.tgt(x));
  const docTr = x => E.sub(x);
  const trSeg = (on, has = true) => (has ? `<span class="se-trs" role="group"><button data-trv="0" class="${on ? "" : "on"}">${esc(E.langName(E.L))}</button><button data-trv="1" class="${on ? "on" : ""}">${esc(E.langName(E.N))}</button></span>` : "");
  // chữ của 1 dòng: bản dịch (nếu đang bật và có) — kèm bản gốc nhỏ bên dưới để vẫn thấy chữ thật
  const docLine = (x, tr) => { const t = docTr(x); return tr && t ? `<span class="se-dl tr">${esc(t)}</span><small class="se-dlo">${esc(docTx(x))}</small>` : `<span class="se-dl">${esc(docTx(x))}</span>`; };
  E.doc = { tx: docTx, tr: docTr, seg: trSeg, line: docLine };

  // ───────── PHIÊN DỊCH / GHI SỔ: rec = ghi lời nhân chứng vào sổ tay · e2v = nghe tiếng học → nói lại bằng tiếng mẹ đẻ · v2e = ngược lại ─────────
  // { interpret: { dir: "rec"|"v2e"|"e2v", to, prompt, key, opts: [{ t: "…" | { en, vi }, acc: 0|1|2, set, add, then }], why } }
  def("interpret", (c) => new Promise(res => {
    const { st } = c, I = st.interpret, R = E.R(), G = E.G();
    const src = R.last || { text: "" };
    const outLang = I.dir === "e2v" ? E.N : E.L;
    const tOf = o => E.fill(typeof o.t === "string" ? o.t : o.t?.[outLang] ?? o.t?.en ?? "");
    const order = shuffle(I.opts, c.key());
    const hasTr = outLang === E.L && E.N !== E.L && (I.opts.some(o => docTr(o.t)) || src.sub);
    let tr = !!G.set.docTr && hasTr;
    E.ui.hideBox();
    const head = I.dir === "rec" ? nat({ en: "Write it in your notebook", vi: "Ghi vào sổ tay" }) : I.dir === "e2v" ? nat({ en: "Interpret into your language", vi: "Dịch cho người nghe" }) : nat({ en: "Interpret", vi: "Phiên dịch" });
    const draw = () => {
      const el = E.ui.panel(`<div class="se-int-h">${E.ICON.pen}<b>${esc(head)}</b>${trSeg(tr, hasTr)}${I.key ? `<em>${esc(L(I.prompt) || "")}</em>` : ""}</div>
        <blockquote class="se-src">${tr && src.sub ? `${esc(String(src.sub).replace(/\[\[|\]\]/g, ""))}<small class="se-dlo">${esc(String(src.text).replace(/\[\[|\]\]/g, ""))}</small>` : E.words(src.text, src.lang)}</blockquote>
        <div class="se-chs">${order.map(([o, i]) => { const t = tr ? docTr(o.t) : ""; return `<button class="se-ch-b tr" data-i="${i}"><span class="se-ln">${esc(t || tOf(o))}</span>${t ? `<small class="se-ln o">${esc(tOf(o))}</small>` : ""}</button>`; }).join("")}</div>`, "interp" + (I.key ? " key" : ""));
      return el;
    };
    let done = false;
    const go = async i => {
      if (done) return; done = true;
      const o = I.opts[i], best = I.opts.reduce((a, b) => ((b.acc || 0) > (a.acc || 0) ? b : a));
      E.ui.clear();
      E.add("acc", o.acc || 0); E.add("accN", 2);
      R.notes.push({ ch: R.ch, dir: I.dir, src: src.text, srcLang: src.lang, pick: tOf(o), best: tOf(best), acc: o.acc || 0, why: I.why || null });
      E.apply(o);
      await E.ui.line({ who: "me", kind: "say", main: tOf(o), sub: outLang === E.L ? docTr(o.t) : "", lang: outLang, tag: I.dir === "rec" ? nat({ en: "notebook", vi: "sổ tay" }) : I.dir === "e2v" ? "→ " + E.cname(E.S().chars[I.to] || {}, true) : nat({ en: "interpreting", vi: "dịch" }), cls: I.dir === "rec" ? "note" : "interp" });
      if (G.set.mode === "easy" || E.auto) {
        const a = o.acc || 0, lab = a === 2 ? nat({ en: "Accurate", vi: "Chính xác" }) : a === 1 ? nat({ en: "Close", vi: "Gần đúng" }) : nat({ en: "Meaning changed", vi: "Lệch nghĩa" });
        if (!E.auto) await feedback(`<div class="se-fb a${a}"><b>${a === 2 ? "✓" : a === 1 ? "≈" : "✗"} ${esc(lab)}</b>${a < 2 ? `<p>${esc(nat({ en: "Better:", vi: "Nên dịch:" }))} <i>${esc(tOf(best))}</i></p>` : ""}${I.why ? `<p>${esc(L(I.why))}</p>` : ""}</div>`);
      } else E.sfx("page");
      if (o.then) c.push("interpret", "opts", i, "then");
      res();
    };
    draw();
    document.querySelector(".se-ui").onclick = e => {
      const v = e.target.closest("[data-trv]");
      if (v) { e.stopPropagation(); tr = v.dataset.trv === "1"; G.set.docTr = tr; E.save(); E.sfx("tap"); return draw(); }
      if (e.target.closest(".w")) return;
      const b = e.target.closest("[data-i]"); if (b) go(+b.dataset.i);
    };
    E.autoRun(() => go(pick(order)[1]));
  }));
  const feedback = (html) => new Promise(r => { const el = E.ui.panel(`${html}<button class="se-btn pri wide" data-ok>${T("cont")}</button>`, "fbk"); el.onclick = e => { e.stopPropagation(); if (e.target.closest("[data-ok]")) { E.ui.clear(); r(); } }; });
  E.feedback = feedback;

  // ───────── VẠCH LỜI KHAI: chạm dòng sai → đưa bằng chứng; ký = kết thúc ─────────
  // { present: { title, goal, segs: [{ t: "…" | { en, vi }, fix, bad, evidence, ok, same }], sign, wrong, noEvidence } }
  // 29/10 (người dùng: khó hiểu, bấm nhầm là hội thoại chạy tiếp, không có chỗ dịch):
  //   3 bước hiện rõ ở đầu (chạm dòng sai → đưa bằng chứng → ký) · chạm dòng = ô bằng chứng mở NGAY dưới dòng đó (+ Huỷ) ·
  //   dòng đã sửa: chữ cũ gạch ngang + chữ mới · nút Gốc | Dịch đổi cả biên bản sang bản dịch · KÝ PHẢI XÁC NHẬN (ký rồi không sửa được).
  def("present", (c) => new Promise(res => {
    const { st, s } = c, P = st.present, R = E.R(), S = E.S(), G = E.G();
    E.ui.hideBox();
    let sel = -1, ask = false;
    const hasTr = E.N !== E.L && P.segs.some(g => docTr(g.t));
    let tr = !!G.set.docTr && hasTr;
    const fixed = i => R.used[c.key("fix", i)];
    const draw = () => {
      const step = ask ? 3 : sel >= 0 ? 2 : 1;
      const steps = [{ en: "Tap a wrong line", vi: "Chạm dòng sai" }, { en: "Show evidence", vi: "Đưa bằng chứng" }, { en: "Sign", vi: "Ký" }].map((t, k) => `<span class="${k + 1 === step ? "on" : ""}"><em>${k + 1}</em>${esc(nat(t))}</span>`).join("");
      E.ui.panel(`<div class="se-doc"><div class="se-doch">${E.ICON.doc}<b>${esc(L(P.title))}</b></div>
        ${P.goal || hasTr ? `<div class="se-dgoal"><span>${esc(L(P.goal) || "")}</span>${trSeg(tr, hasTr)}</div>` : ""}
        <div class="se-steps">${steps}</div>
        ${P.segs.map((g, i) => {
          if (fixed(i) && g.fix) return `<div class="se-seg-l fixed"><s>${esc(tr && docTr(g.t) ? docTr(g.t) : docTx(g.t))}</s>${docLine(g.fix, tr)}</div>`;
          const line = `<button class="se-seg-l${sel === i ? " on" : ""}" data-s="${i}">${docLine(g.t, tr)}</button>`;
          if (sel !== i) return line;
          return line + `<div class="se-ev"><small>${esc(nat({ en: "Which evidence proves this line is wrong?", vi: "Bằng chứng nào cho thấy dòng này sai?" }))}</small><div class="se-bag">${E.bag().map(id => `<button class="se-bi lg" data-ev="${id}">${E.itemArt(id, "md")}<small>${esc(nat(S.items[id]?.name))}</small></button>`).join("")}</div><button class="se-btn sm" data-cancel>${esc(nat({ en: "Cancel", vi: "Huỷ" }))}</button></div>`;
        }).join("")}
        </div>
        ${ask ? `<div class="se-ask2"><b>${esc(nat({ en: "Sign this statement?", vi: "Ký biên bản này?" }))}</b><p>${esc(nat({ en: "Once you sign, you can't change it.", vi: "Ký rồi thì không sửa được nữa." }))}</p><div class="se-row"><button class="se-btn" data-ask-no>${esc(nat({ en: "Read again", vi: "Đọc lại" }))}</button><button class="se-btn pri" data-ask-yes>${esc(L(P.sign) || nat({ en: "Sign", vi: "Ký tên" }))}</button></div></div>`
          : `<button class="se-btn wide" data-sign>${E.ICON.pen} ${esc(L(P.sign) || nat({ en: "Nothing else is wrong — sign it", vi: "Không còn chỗ sai — ký tên" }))}</button>`}`, "present");
    };
    const after = (steps) => { E.ui.clear(); c.again(); steps(); res(); };
    const onEv = id => {
      const i = sel, g = P.segs[i]; sel = -1;
      if (!cond(g.bad, s)) return after(() => (g.same ? c.push("present", "segs", i, "same") : R.stack.push({ n: "__present_wrong", p: [], i: 0 })));
      if (g.evidence && id !== g.evidence) return after(() => R.stack.push({ n: "__present_noev", p: [], i: 0 }));
      R.used[c.key("fix", i)] = 1;
      E.ui.fx("objection");
      after(() => c.push("present", "segs", i, "ok"));
    };
    // lời “sai rồi” / “chưa đủ bằng chứng” dùng chung — gắn tạm vào nodes
    S.nodes.__present_wrong = P.wrong || [];
    S.nodes.__present_noev = P.noEvidence || [];
    draw();
    document.querySelector(".se-ui").onclick = e => {
      const v = e.target.closest("[data-trv]");
      if (v) { tr = v.dataset.trv === "1"; G.set.docTr = tr; E.save(); E.sfx("tap"); return draw(); }
      if (e.target.closest("[data-ask-yes]")) { E.ui.clear(); return res(); }
      if (e.target.closest("[data-ask-no]")) { ask = false; E.sfx("tap"); return draw(); }
      if (e.target.closest("[data-sign]")) { ask = true; sel = -1; E.sfx("tap"); return draw(); }
      if (e.target.closest("[data-cancel]")) { sel = -1; E.sfx("tap"); return draw(); }
      const ev = e.target.closest("[data-ev]"); if (ev) return onEv(ev.dataset.ev);
      if (e.target.closest(".w") && !e.target.closest("[data-s]")) return;
      const sg = e.target.closest("[data-s]"); if (sg) { sel = +sg.dataset.s === sel ? -1 : +sg.dataset.s; ask = false; E.sfx("tap"); return draw(); }
    };
    E.autoRun(() => {
      const i = P.segs.findIndex((g, k) => !fixed(k) && cond(g.bad, s));
      if (i < 0) { E.ui.clear(); return res(); }
      sel = i; onEv(P.segs[i].evidence || R.items[0]);
    });
  }));

  // ───────── NGHE (không chữ) + CÂU HỎI ─────────
  const qflow = (c, Q, withAudio) => new Promise(res => {
    const R = E.R();
    // busy = đang chấm 1 câu (bấm đáp án thứ 2 trong lúc chờ từng làm chấm 2 lần → 2 luồng cùng tới cuối, luồng thừa xoá bảng của bước SAU = kẹt)
    //   fin = đã xong bước (hẹn giờ phát âm thanh muộn không được vẽ lại bảng)
    let qi = 0, plays = 0, right = 0, busy = false, fin = false;
    const draw = (msg = "") => {
      if (fin) return;
      const q = Q.qs[qi];
      E.ui.panel(`${withAudio ? `<div class="se-au"><button class="se-play" data-play>${E.ICON.spk}</button><div><b>${esc(nat({ en: "Voice message", vi: "Tin nhắn thoại" }))}</b><small>${esc(nat({ en: "No text — listen carefully.", vi: "Không có chữ — nghe thật kỹ." }))} ${plays ? `· ${plays}×` : ""}</small></div><button class="se-btn sm" data-slow>${esc(nat({ en: "Slow", vi: "Chậm" }))}</button></div>` : ""}
        ${q ? `<div class="se-ask">${esc(L(q.q))}</div><div class="se-chs">${q.opts.map((o, i) => `<button class="se-ch-b" data-a="${i}"><span>${esc(E.tgt(o))}</span></button>`).join("")}</div>` : ""}
        ${msg}`, "listen");
    };
    const play = slow => { if (fin) return; plays++; draw(); E.say(E.tgt(Q.audio), Q.who || "caller", { force: true, slow }); };
    const answer = async i => {
      if (busy || fin) return; busy = true;
      const q = Q.qs[qi], ok = i === q.a;
      if (ok) { right++; E.apply(q); }
      document.querySelectorAll(".se-ui [data-a]").forEach((b, k) => b.classList.add(k === q.a ? "ok" : k === i ? "no" : "dim"));
      await new Promise(r => setTimeout(r, E.auto ? 1 : 900));
      qi++; busy = false;
      if (qi < Q.qs.length) return draw();
      busy = true;
      E.add("qRight", right); E.add("qN", Q.qs.length);
      if (E.auto) {}
      else if (withAudio) {
        // hết câu hỏi → hiện lời gốc + nghĩa (học từ chính đoạn vừa nghe)
        await feedback(`<div class="se-fb"><b>${right}/${Q.qs.length}</b><p class="se-tsc">${E.words(E.tgt(Q.audio), E.L)}</p>${Q.tr?.[E.N] ? `<p class="se-mute">${esc(Q.tr[E.N])}</p>` : ""}</div>`);
      } else if (!E.auto) await feedback(`<div class="se-fb"><b>${right}/${Q.qs.length}</b></div>`);
      fin = true; E.ui.clear(); res();
    };
    draw();
    document.querySelector(".se-ui").onclick = e => {
      if (e.target.closest("[data-play]")) return play(false);
      if (e.target.closest("[data-slow]")) return play(true);
      const a = e.target.closest("[data-a]"); if (a && !a.classList.contains("ok") && !a.classList.contains("no")) answer(+a.dataset.a);
    };
    if (withAudio && !E.auto) setTimeout(() => play(false), 400);
    E.autoRun(() => { const tick = () => { if (qi < Q.qs.length) { busy = false; answer(Q.qs[qi].a); setTimeout(tick, E.auto ? 10 : 1000); } }; tick(); });
  });
  def("listen", c => { E.ui.hideBox(); return qflow(c, c.st.listen, true); });
  def("quiz", c => { E.ui.hideBox(); return qflow(c, c.st.quiz, false); });

  // ───────── GIẢI ĐỐ: KHOÁ số / chữ (bánh xe) ─────────
  // { lock: { prompt, kind: "digits"|"letters"|[ký tự…], answer, hints: [..], ok, fail, giveUp } }
  def("lock", (c) => new Promise(res => {
    const K = c.st.lock;
    const set = Array.isArray(K.kind) ? K.kind : K.kind === "letters" ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("") : "0123456789".split("");
    const ans = String(K.answer).toUpperCase().split("");
    const cur = ans.map(() => 0);
    let tries = 0, hint = 0;
    E.ui.hideBox();
    const draw = (msg = "") => E.ui.panel(`<div class="se-ask">${esc(L(K.prompt))}</div>
      <div class="se-lock">${cur.map((v, i) => `<div class="se-wh"><button data-u="${i}">▲</button><b>${esc(set[v])}</b><button data-d="${i}">▼</button></div>`).join("")}</div>
      ${msg}<div class="se-row"><button class="se-btn pri" data-try>${esc(nat({ en: "Try", vi: "Thử" }))}</button>${K.hints?.length ? `<button class="se-btn" data-hint>${esc(nat({ en: "Hint", vi: "Gợi ý" }))} (${K.hints.length - hint})</button>` : ""}${K.giveUp && tries >= 3 ? `<button class="se-btn" data-give>${esc(nat({ en: "Give up", vi: "Bỏ qua" }))}</button>` : ""}</div>`, "lockp");
    draw();
    const fin = (keys) => { E.ui.clear(); if (keys) c.push("lock", keys); res(); };
    document.querySelector(".se-ui").onclick = e => {
      const u = e.target.closest("[data-u]"), d = e.target.closest("[data-d]");
      if (u) { const i = +u.dataset.u; cur[i] = (cur[i] + 1) % set.length; return draw(); }
      if (d) { const i = +d.dataset.d; cur[i] = (cur[i] - 1 + set.length) % set.length; return draw(); }
      if (e.target.closest("[data-hint]") && hint < K.hints.length) { hint++; return draw(`<div class="se-hint">${K.hints.slice(0, hint).map(x => `<p>💡 ${esc(L(x))}</p>`).join("")}</div>`); }
      if (e.target.closest("[data-give]")) { E.flag("gaveUp_" + c.key(), 1); return fin(K.giveUp ? "giveUp" : null); }
      if (e.target.closest("[data-try]")) {
        tries++;
        if (cur.map(v => set[v]).join("") === ans.join("")) { E.ui.fx("solve"); return fin(K.ok ? "ok" : null); }
        E.ui.fx("shake");
        if (K.fail && tries === 1) return fin("fail") || c.again();
        draw(`<div class="se-hint no">${esc(nat({ en: "It doesn't open.", vi: "Không mở được." }))}</div>`);
      }
    };
    E.autoRun(() => { ans.forEach((ch, i) => (cur[i] = Math.max(0, set.indexOf(ch)))); document.querySelector("[data-try]")?.click(); });
  }));

  // ───────── XẾP THỨ TỰ (dòng thời gian, các bước, câu đảo) ─────────
  // { order: { prompt, items: [{ t: "…" | { en, vi }, tag? }] (đúng thứ tự), ok, fail, tries } }
  // 29/10 (người dùng): KÉO tay nắm ≡ để đổi chỗ, như sắp xếp kênh đăng ký trên YouTube (trước: chạm 2 ô để đổi chỗ) · nút Gốc | Dịch
  def("order", (c) => new Promise(res => {
    const O = c.st.order, G = E.G();
    let cur = shuffle(O.items, c.key()).map(([, i]) => i);
    if (cur.every((v, i) => v === i)) cur.reverse();
    let tries = 0, msg = "";
    const hasTr = E.N !== E.L && O.items.some(it => docTr(it.t));
    let tr = !!G.set.docTr && hasTr;
    E.ui.hideBox();
    const draw = () => {
      const el = E.ui.panel(`<div class="se-ask se-askr"><span>${esc(L(O.prompt))}</span>${trSeg(tr, hasTr)}</div><div class="se-ord">${cur.map((k, p) => `<div class="se-oi" data-p="${p}"><em>${O.items[k].tag ? esc(O.items[k].tag) : p + 1}</em><span class="se-oit">${docLine(O.items[k].t, tr)}</span><button class="se-oh" data-h="${p}" aria-label="${esc(nat({ en: "Drag to move", vi: "Kéo để đổi chỗ" }))}"><svg viewBox="0 0 24 24"><path d="M5 8h14M5 12h14M5 16h14"/></svg></button></div>`).join("")}</div>${msg}<button class="se-btn pri wide" data-chk>${esc(nat({ en: "Check", vi: "Kiểm tra" }))}</button>`, "orderp");
      bindDrag(el.querySelector(".se-ord"));
    };
    // kéo: hàng đang kéo đi theo ngón tay, các hàng khác dạt lên / xuống chừa chỗ; thả = chốt vị trí mới
    const bindDrag = list => {
      list.onpointerdown = e => {
        const hd = e.target.closest("[data-h]"); if (!hd) return;
        e.preventDefault();
        const rows = [...list.children], from = +hd.dataset.h, row = rows[from];
        const step = rows.length > 1 ? rows[1].offsetTop - rows[0].offsetTop : row.offsetHeight + 7;
        const y0 = e.clientY; let to = from;
        row.classList.add("drag"); E.haptic("LIGHT");
        try { hd.setPointerCapture(e.pointerId); } catch {}
        const move = ev => {
          const dy = Math.max(-from * step - 8, Math.min((rows.length - 1 - from) * step + 8, ev.clientY - y0));
          row.style.transform = `translateY(${dy}px) scale(1.03)`;
          const t = Math.max(0, Math.min(rows.length - 1, from + Math.round(dy / step)));
          if (t !== to) { to = t; E.haptic("LIGHT"); }
          rows.forEach((r, k) => { if (r !== row) r.style.transform = k > from && k <= to ? `translateY(${-step}px)` : k < from && k >= to ? `translateY(${step}px)` : ""; });
        };
        const up = () => {
          hd.removeEventListener("pointermove", move); hd.removeEventListener("pointerup", up); hd.removeEventListener("pointercancel", up);
          if (to !== from) { const [x] = cur.splice(from, 1); cur.splice(to, 0, x); msg = ""; E.sfx("tap"); }
          draw();
        };
        hd.addEventListener("pointermove", move); hd.addEventListener("pointerup", up); hd.addEventListener("pointercancel", up);
      };
    };
    draw();
    document.querySelector(".se-ui").onclick = e => {
      const v = e.target.closest("[data-trv]");
      if (v) { tr = v.dataset.trv === "1"; G.set.docTr = tr; E.save(); E.sfx("tap"); return draw(); }
      if (e.target.closest("[data-chk]")) {
        tries++;
        const wrong = cur.filter((k, p) => k !== p).length;
        if (!wrong) { E.ui.fx("solve"); E.ui.clear(); E.add("puzzles", 1); if (O.ok) c.push("order", "ok"); return res(); }
        E.ui.fx("shake");
        if (O.tries && tries >= O.tries) { E.ui.clear(); if (O.fail) c.push("order", "fail"); return res(); }
        msg = `<div class="se-hint no">${esc(nat({ en: `${wrong} in the wrong place.`, vi: `${wrong} ô chưa đúng chỗ.` }))}${O.tries ? ` ${esc(nat({ en: `${O.tries - tries} tries left.`, vi: `Còn ${O.tries - tries} lần thử.` }))}` : ""}</div>`;
        draw();
      }
    };
    E.autoRun(() => { cur = O.items.map((_, i) => i); draw(); document.querySelector("[data-chk]").click(); });
  }));

  // ───────── GÕ CHỮ (mật khẩu, tin nhắn, điền mẫu) — chấm mềm: sai 1 ký tự / từ vẫn nhận, báo chỗ sai ─────────
  // { type: { prompt, ph, accept: ["..."], near: true, ok, fail, tries, hint } }
  const lev = (a, b) => { const d = Array.from({ length: a.length + 1 }, (_, i) => [i]); for (let j = 1; j <= b.length; j++) d[0][j] = j; for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); return d[a.length][b.length]; };
  const norm = s => String(s).toLowerCase().replace(/[’']/g, "'").replace(/[^\p{L}\p{N}' ]+/gu, " ").replace(/\s+/g, " ").trim();
  def("type", (c) => new Promise(res => {
    const Y = c.st.type; let tries = 0;
    // đáp án cho bộ kiểm “khỉ bấm” (tools/games/_lib/story/cover.js) — gõ đúng để đi tiếp, không phải người chơi thấy
    globalThis.__seAns = Y.accept?.[0];
    E.ui.hideBox();
    const draw = (msg = "") => {
      const el = E.ui.panel(`<div class="se-ask">${esc(L(Y.prompt))}</div><input class="se-in big" data-in autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${esc(L(Y.ph) || "")}">${msg}<button class="se-btn pri wide" data-ok>${esc(nat({ en: "Send", vi: "Gửi" }))}</button>`, "typep");
      const inp = el.querySelector("[data-in]"); setTimeout(() => inp.focus(), 50);
      inp.onkeydown = e => { if (e.key === "Enter") check(inp.value); };
      el.querySelector("[data-ok]").onclick = () => check(inp.value);
    };
    const check = v => {
      tries++;
      const got = norm(v), acc = Y.accept.map(norm);
      const exact = acc.includes(got);
      const near = !exact && Y.near !== false && acc.some(a => lev(a, got) <= Math.max(1, Math.floor(a.length / 12)));
      if (exact || near) {
        E.ui.clear(); E.add("typed", 1);
        if (near) E.ui.toast(`${esc(nat({ en: "Almost! Correct spelling:", vi: "Gần đúng! Viết đúng là:" }))} <b>${esc(Y.accept[0])}</b>`, 3000);
        if (Y.ok) c.push("type", "ok"); return res();
      }
      E.ui.fx("shake");
      if (Y.tries && tries >= Y.tries) { E.ui.clear(); if (Y.fail) c.push("type", "fail"); return res(); }
      draw(Y.hint && tries >= 2 ? `<div class="se-hint">💡 ${esc(L(Y.hint))}</div>` : `<div class="se-hint no">${esc(nat({ en: "Not quite. Try again.", vi: "Chưa đúng. Thử lại." }))}</div>`);
    };
    draw();
    E.autoRun(() => check(Y.accept[0]));
  }));

  // ───────── XEM LẠI CÁCH DỊCH (cuối chương — Ruth nhận xét) ─────────
  def("review", (c) => new Promise(res => {
    const R = E.R(), notes = R.notes.filter(n => n.ch === R.ch);
    if (!notes.length || E.auto) return res();
    E.ui.hideBox();
    const pct = Math.round((notes.reduce((a, n) => a + n.acc, 0) / (notes.length * 2)) * 100);
    const el = E.ui.panel(`<div class="se-rv"><div class="se-rvh"><b>${esc(nat({ en: "Your translations", vi: "Các câu bạn đã dịch" }))}</b><span class="se-pct">${pct}%</span></div>
      ${notes.map(n => `<div class="se-rvi a${n.acc}"><blockquote>${esc(n.src)}</blockquote><p><em>${n.acc === 2 ? "✓" : n.acc === 1 ? "≈" : "✗"}</em> ${esc(n.pick)}</p>${n.acc < 2 ? `<p class="best">→ ${esc(n.best)}</p>` : ""}${n.why && n.acc < 2 ? `<p class="why">${esc(L(n.why))}</p>` : ""}</div>`).join("")}
      </div><button class="se-btn pri wide" data-ok>${T("cont")}</button>`, "review");
    el.onclick = e => { if (e.target.closest("[data-ok]")) { E.ui.clear(); res(); } };
  }));

  // ───────── KẾT THÚC CHƯƠNG / TRUYỆN ─────────
  def("end", (c) => new Promise(() => {
    const S = E.S(), G = E.G(), R = E.R(), id = c.st.end, en = S.endings?.[id] || {};
    const first = !G.endings[id];
    G.endings[id] = G.endings[id] || Date.now(); R.done = id;
    // tới kết thúc DẪN SANG chương sau (next) / kết thúc cuối / chương cuối đã ra = xong chương đó (mở khoá chương sau);
    //   kết thúc cụt giữa truyện (thua, không có next) không tính
    { const ch = en.ch ?? R.ch; if (en.next || en.final || !(S.chapters || []).some(c => c.ch > ch && !c.soon)) E.chDone?.(ch); }
    E.save();
    // kết thúc CHƯƠNG có next = node đầu chương sau → nút “Chơi tiếp”; không có next = kết thúc TRUYỆN
    // chơi thử (không lưu) → dừng ở cuối chương, không đi tiếp (Detroit)
    const nx = !E.explore && en.next && (S.nodes[en.next] || E.chapterOf(en.next)) ? en.next : null; // chương sau có thể chưa nạp (tải lần lượt)
    E.emit("end", id, !!nx);
    if (E.auto) { if (nx) { E.jump(nx); return E.play(); } document.title = "END:" + id; console.log("[story] END", id, JSON.stringify(R.f)); return; }
    E.ui.hideBox(); E.ui.hide("*");
    const notes = R.notes.filter(n => n.ch === (en.ch ?? R.ch));
    const pct = notes.length ? Math.round((notes.reduce((a, n) => a + n.acc, 0) / (notes.length * 2)) * 100) : null;
    const flow = (S.flow || []).filter(x => x.ch === (en.ch ?? R.ch));
    const opts = flow.filter(x => x.kind === "opt"), ends = flow.filter(x => x.kind === "end");
    const explored = opts.filter(x => G.opts[x.key + ":" + x.val]).length + ends.filter(x => G.endings[x.id]).length;
    const total = opts.length + ends.length;
    const el = E.ui.panel(`<div class="se-end">
      <small>${first ? esc(nat({ en: "NEW ENDING", vi: "KẾT THÚC MỚI" })) : esc(nat({ en: "ENDING", vi: "KẾT THÚC" }))}</small>
      <h2>${esc(tgt(en.title))}</h2>${E.L !== E.N && en.title?.[E.N] ? `<div class="se-mute">${esc(nat(en.title))}</div>` : ""}
      <p class="se-endt">${E.words(tgt(en.text), E.L)}</p>
      ${en.text?.[E.N] ? `<details><summary>${T("translate")}</summary>${esc(nat(en.text))}</details>` : ""}
      ${(() => { const l = E.recapList(en.ch ?? R.ch).filter(x => (x.ch ?? 0) === (en.ch ?? R.ch)); return l.length ? `<div class="se-recap box"><b>${esc(nat({ en: "What happened on your path", vi: "Chuyện trong nhánh của bạn" }))}</b>${l.map(x => `<p class="se-rcp">${esc(nat(x.t))}</p>`).join("")}</div>` : ""; })()}
      <div class="se-stats">
        ${pct != null ? `<div><b>${pct}%</b><small>${esc(nat({ en: "Translation accuracy", vi: "Độ chính xác khi dịch" }))}</small></div>` : ""}
        <div><b>${Object.keys(G.truths).length}/${S.truthTotal || "?"}</b><small>${T("truths")}</small></div>
        <div><b>${explored}/${total}</b><small>${esc(nat({ en: "Branches explored", vi: "Nhánh đã khám phá" }))}</small></div>
        <div><b>${Object.keys(G.words).length}</b><small>${T("words")}</small></div>
      </div>
      ${explored < total ? `<p class="se-tease">${esc(nat({ en: "Some choices are still unexplored. What happens if you choose differently?", vi: "Vẫn còn lựa chọn chưa khám phá. Nếu chọn khác đi thì sao?" }))}</p>` : ""}
      ${!nx && S.next && !en.final ? `<p class="se-next">${esc(nat(S.next))} — ${esc(nat({ en: "coming soon", vi: "sắp ra mắt" }))}</p>` : ""}
      ${en.final ? `<p class="se-next">${esc(nat({ en: "THE END", vi: "HẾT" }))}</p>` : ""}
      ${E.explore ? `<p class="se-next">${esc(nat({ en: "That was a trial run — your saved story hasn't changed.", vi: "Đây là lần chơi thử — tiến độ đã lưu của bạn không đổi." }))}</p>` : ""}
      <div class="se-col">${nx ? `<button class="se-btn pri" data-nx>${E.ICON.play} ${esc(nat(en.nextTitle || { en: "Continue", vi: "Chơi tiếp" }))}</button>` : ""}<button class="se-btn${nx ? "" : " pri"}" data-f>${T("flow")}</button><button class="se-btn" data-b>${T("notebook")}</button><button class="se-btn" data-t>${esc(nat({ en: "Title screen", vi: "Màn hình chính" }))}</button></div>
    </div>`, "full end");
    el.onclick = e => {
      if (e.target.closest("[data-f]")) E.ui.flowSheet();
      if (e.target.closest("[data-b]")) E.ui.book("truths");
      if (e.target.closest("[data-t]")) { E.stop(); E.ui.title(); }
      if (e.target.closest("[data-nx]")) { E.sfx("whoosh"); E.ui.clear(); R.done = null; E.jump(nx); E.save(); E.play(); }
    };
  }));
})();
