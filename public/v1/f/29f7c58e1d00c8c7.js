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
  const cond = (c, s) => (c == null ? true : typeof c === "function" ? !!c(s) : typeof c === "string" ? s.truth(c) || s.has(c) || !!s.f[c] : typeof c === "object" && !Array.isArray(c) ? Object.entries(c).every(([k, v]) => (+s.f[k] || 0) >= v) : !!c);
  const optText = o => ({ main: E.tgt(o), sub: E.sub(o) });
  const L = (o) => nat(o);
  const investigationText = t => E.ui.investigationText?.(t) ?? esc(nat(t));
  // nhãn kiểu câu (hỏi cung / giọng điệu): o.tag
  const TAGS = {
    open: { en: "Open question", vi: "Câu hỏi mở" }, lead: { en: "Leading", vi: "Dẫn dắt" }, press: { en: "Pressure", vi: "Gây sức ép" },
    kind: { en: "Kind", vi: "Đồng cảm" }, bluff: { en: "Bluff", vi: "Tố khống" }, polite: { en: "Polite", vi: "Lịch sự" }, direct: { en: "Direct", vi: "Thẳng" }, lie: { en: "Lie", vi: "Nói dối" },
  };

  // ───────── cảnh, nhân vật, lời ─────────
  // chờ ảnh nền mới sẵn sàng (≤ 450 ms) rồi mới chạy lời dẫn tiếp — không còn cảnh “nền cũ + chữ mới”
  def("bg", async ({ st }) => { await E.ui.scene(st.bg); });
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
    if (!st.quiet) { E.ui.itemNotice(st.item); E.ui.dot(true); E.sfx("item"); E.haptic("LIGHT"); }
    E.emit("item", st.item);
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
  // tên chỉ số cho người chơi: story.stats.<mã> → nhãn thanh meter → mã viết hoa chữ đầu
  const statN = k => nat(E.S().stats?.[k] || E.R().meters?.[k]?.label || { en: k.charAt(0).toUpperCase() + k.slice(1) });
  // ───────── LỰA CHỌN: giờ · khoá (lockHint) · trực giác (need: id sự thật) · đồ vật (item) · lặp (loop + once) ─────────
  def("choice", (c) => new Promise(res => {
    const { st, s } = c, R = E.R(), G = E.G();
    c.resumeHere?.();
    // once nhớ theo vị trí bước — hoặc theo o.id (cùng 1 câu hỏi dùng ở nhiều chỗ, vd. then + again của 1 điểm khám xét)
    const onceK = (o, i) => (o.id ? "o:" + o.id : c.key(i));
    const list = [];
    st.choice.forEach((o, i) => {
      if (o.if && !cond(o.if, s)) return;
      if (o.once && R.used[onceK(o, i)]) return;
      if (o.item && !s.has(o.item)) return;
      let locked = false, why = "";
      // req = cần chỉ số ({ charm: 3 }) · cost = tốn ({ coins: 5 }) — thiếu thì khoá + ghi rõ cần gì (reqHide: true = ẩn hẳn)
      const lack = [...new Set([...Object.keys(o.req || {}), ...Object.keys(o.cost || {})])].map(k => [k, Math.max(o.req?.[k] || 0, o.cost?.[k] || 0)]).filter(([k, v]) => (+R.f[k] || 0) < v);
      if (lack.length) { if (o.reqHide) return; locked = true; why = lack.map(([k, v]) => nat({ en: `Needs ${statN(k)} ${v} (you have ${+R.f[k] || 0})`, vi: `Cần ${statN(k)} ${v} (bạn có ${+R.f[k] || 0})` })).join(" · "); }
      if (o.need) {
        const ok = typeof o.need === "string" ? !!G.truths[o.need] : cond(o.need, s);
        if (!ok) { if (o.lockHint) locked = true; else return; }
      }
      list.push({ o, i, locked, why });
    });
    const usable = list.filter(x => !x.locked);
    if (!usable.length && st.empty) { c.push("empty"); return res(); }
    // câu nhân vật vừa nói nhắc lại ở đầu bảng (đang trả lời ai, câu gì)
    const q = R.last && R.last.who && R.last.who !== "me" && R.log[R.log.length - 1]?.kind === "say" ? R.last : null;
    const qc = q && E.S().chars[q.who];
    // hộp lời nhường chỗ (câu vừa nói đã nhắc lại ở đầu bảng) — trừ khi câu cuối là lời dẫn / suy nghĩ (giữ làm ngữ cảnh)
    if (q || R.log[R.log.length - 1]?.who === "me") E.ui.hideBox();
    const box = E.ui.panel(`${q ? `<div class="se-q" style="--c:${qc?.color || "#aaa"}"><b>${esc(E.cname(qc, true))}</b><span>${E.words(q.text, q.lang)}</span></div>` : ""}${st.prompt ? `<div class="se-ask">${esc(L(st.prompt))}</div>` : ""}${st.timer ? `<div class="se-timer"><i style="animation-duration:${st.timer}s"></i></div>` : ""}<div class="se-chs">${list.map(({ o, i, locked, why }, k) => {
      const t = optText(o), act = /^\(/.test(t.main);
      const sub = t.sub ? `<small${E.G().set.tr || E.G().set.mode === "easy" ? "" : " hidden"}>${esc(t.sub)}</small>` : "";
      const tag = o.intuition ? `<em class="se-int">✦ ${T("intuition")}</em>` : o.item ? `<em class="se-itag">${E.ICON[E.S().items[o.item]?.icon] || E.ICON.box}</em>` : o.tag ? tagHtml(o.tag, act) : "";
      const hear = !act && !locked && !o.silent ? `<i class="se-hear" data-hear="${i}">${E.ICON.spk}</i>` : "";
      // huy hiệu chỉ số kiểu Disco Elysium: phương án mở nhờ chỉ số hiện “Tinh tế 3” · tốn tiền / sức hiện “−5 Xu”
      const badges = [...Object.entries(o.req || {}).map(([k, v]) => `<em class="se-req${locked ? "" : " ok"}">${esc(statN(k))} ${v}</em>`), ...Object.entries(o.cost || {}).map(([k, v]) => `<em class="se-cost">−${v} ${esc(statN(k))}</em>`)].join("");
      return `<button class="se-ch-b${act ? " act" : ""}${o.intuition ? " int" : ""}${locked ? " lock" : ""}" data-i="${i}" style="--k:${k}" ${locked ? "disabled" : ""}>${tag}${badges ? `<span class="se-badges">${badges}</span>` : ""}<span>${esc(t.main)}</span>${sub}${locked ? `<small class="se-lh">${E.ICON.lock}${esc(why || L(o.lockHint))}</small>` : ""}${hear}</button>`;
    }).join("")}</div>${!usable.length ? `<div class="se-hint" role="status">${esc(nat({ en: "No choices are available here.", vi: "Hiện không có lựa chọn nào khả dụng." }))}</div><button class="se-btn wide" data-empty>${T("cont")}</button>` : ""}`, "chs");
    E.sfx("open");
    let beat = null;
    if (st.timer && !E.auto) { E.ui.urgent(true); beat = setInterval(() => E.sfx("beat"), 1000); E.haptic("LIGHT"); }
    let tm = null, done = false;
    const live = () => !c.live || c.live();
    c.onCancel?.(() => { done = true; clearTimeout(tm); clearInterval(beat); res(); });
    const finish = async (o, i, instant = false) => {
      if (done || !live()) return; done = true; clearTimeout(tm); clearInterval(beat); E.ui.urgent(false);
      if (o) {
        // phương án được chọn sáng lên, phương án khác lùi ra
        const bt = box.querySelector(`[data-i="${i}"]`);
        bt?.classList.add("picked"); box.querySelectorAll(".se-ch-b").forEach(x => x !== bt && x.classList.add("off"));
        E.sfx("pick"); E.haptic("LIGHT");
        if (!E.auto && !instant) await new Promise(r => setTimeout(r, 380));
      }
      if (!live()) return res();
      c.resumeHere?.(false);
      E.ui.clear();
      if (o) {
        if (o.once) R.used[onceK(o, i)] = 1;
        for (const [k, v] of Object.entries(o.cost || {})) E.add(k, -v);
        // tone: kiểu trả lời → chỉ số tăng (story.tones = { tactful: "charm", clever: "smart" } hoặc { tactful: { charm: 1 } })
        const tn = o.tone && E.S().tones?.[o.tone]; if (tn) { if (typeof tn === "string") E.add(tn, 1); else for (const k in tn) E.add(k, tn[k]); }
        E.apply(o);
        if (o.loop === false || (st.loop && !o.once)) {} // vòng lặp kết thúc ở lựa chọn không có once
        else if (st.loop && !o.go) c.again();
        // Persist the chosen continuation before any optional voice/reading wait.
        if (o.go) E.jump(o.go);
        if (o.then) c.push("choice", i, "then");
        const t = optText(o);
        // NÓI THEO câu vừa chọn (như truyện nhập vai): app mở bảng micro, chấm từng từ — tắt ở màn tổng quan (Nói theo câu đã chọn)
        let said = false;
        if (!/^\(/.test(t.main) && !o.silent && E.G().set.shadow && globalThis.Enmi?.shadow && !E.auto) { E.hush(); said = !!(await globalThis.Enmi.shadow(t.main, { tr: t.sub }).catch(() => null))?.ok; }
        if (!live()) return res();
        if (!/^\(/.test(t.main) && !o.silent) await E.ui.line({ who: "me", kind: "say", main: t.main, sub: t.sub, lang: E.L, ...(said ? { speak: "" } : {}) });
        if (!live()) return res();

      } else if (st.timeout) c.push("timeout");
      res();
    };
    box.onclick = e => {
      if (done || !live()) return;
      if (e.target.closest("[data-empty]")) return finish(null);
      const hr = e.target.closest("[data-hear]");
      if (hr) { e.stopPropagation(); const o = st.choice[+hr.dataset.hear]; return E.say(optText(o).main, "me", { force: true, lang: E.L }); }
      const b = e.target.closest("[data-i]"); if (b && !b.disabled) finish(st.choice[+b.dataset.i], +b.dataset.i);
    };
    if (st.skipIfOne && usable.length === 1 && !usable[0].o.intuition) { const x = usable[0]; return void finish(x.o, x.i, true); }
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
    const direct = !!S.detailExplore && !!E.vbox && !!E.ui.look;
    const imageId = X.img || R.scene || E.curImg?.();
    const detailKey = c.key(), details = direct ? (R.xpDetail ||= {}) : {};
    const detail = () => direct ? details[detailKey] : null;
    const region = sp => E.regionOf?.(imageId, sp.r)?.box || [Number(sp.x ?? 50) - 8, Number(sp.y ?? 50) - 8, 16, 16];
    // A visible edge can carry the glint while inspection frames the complete
    // object. Both authored rectangles remain in the same image coordinates.
    const inspection = sp => E.regionOf?.(imageId, sp.inspectR)?.box || region(sp);
    if (detail() && !X.spots.some(sp => sp.id === detail().id)) delete details[detailKey];
    if (detail()) detail().box = [...inspection(X.spots.find(sp => sp.id === detail().id))];
    c.resumeHere?.();
    S.nodes.__combo = (S.combos || []).map(k => k.then || []);
    S.nodes.__xp_seen = [{ think: X.seen || { en: "You've already checked this. Nothing new.", vi: "Chỗ này bạn xem kỹ rồi. Không có gì mới." } }];
    E.ui.hideBox(); E.ui.zoom(null);
    if (direct) E.ui.hide("*");
    const vis = id => R.used[c.key("v", id)];
    const spots = X.spots.filter(sp => !sp.if || cond(sp.if, c.s));
    const clues = spots.filter(sp => sp.clue);
    const found = () => clues.filter(sp => vis(sp.id)).length;
    const normalLayer = document.querySelector(".se-spots"), stage = document.querySelector(".se-stage"), rt = document.querySelector(".se");
    let layer = normalLayer, planeEl = null, backHost = null, ro = null, offPlane = null, offKey = null;
    const nm = id => esc(nat(S.items[id]?.name) || id);
    let sel = null, mode = "", msg = "", ask = false, over = false, bagOpen = false, goalOpen = false, firstDraw = true;
    const clean = () => { layer.onclick = normalLayer.onclick = null; layer.innerHTML = ""; normalLayer.style.bottom = normalLayer.style.top = ""; planeEl?.remove(); backHost?.remove(); ro?.disconnect(); offPlane?.(); offKey?.(); rt.classList.remove("xp-inspecting"); };
    c.onCancel?.(() => { over = true; clean(); res(); });
    const makePlane = () => {
      if (!direct) return true;
      const L = document.querySelector(".se-bgl.on"); if (!L || L.dataset.image !== imageId) return false;
      if (!planeEl?.isConnected || planeEl.parentElement !== L) {
        planeEl?.remove(); L.insertAdjacentHTML("beforeend", E.vbox(imageId, "", "zones xp-zones")); planeEl = L.querySelector(":scope > .xp-zones");
      }
      layer = planeEl.querySelector(".vbx");
      layer.onclick = e => { const b = e.target.closest("[data-sp]"); if (b) onSpot(b.dataset.sp); };
      if (!backHost) { backHost = h('<div class="se-xpnav"></div>'); rt.appendChild(backHost); backHost.onclick = () => backDetail(); }
      E.syncImagePlanes?.(L);
      return true;
    };
    const draw = () => {
      if (over || c.live?.() === false) return;
      if (!makePlane()) return;
      if (direct) E.ui.sceneProps?.(imageId, spots.filter(sp => typeof sp.art === "string").map(sp => ({ id: sp.id, art: sp.art, box: sp.artR ? E.regionOf(imageId, sp.artR)?.box || region(sp) : region(sp), rotate: sp.artRot, z: sp.z })));
      layer.innerHTML = spots.filter(sp => !detail() || sp.id === detail().id).map(sp => {
        const need = sp.use && R.used[c.key("t", sp.id)] && !R.used[c.key("u", sp.id)];
        if (direct) {
          const b = region(sp);
          return `<button class="pz${vis(sp.id) ? " seen" : ""}${need ? " need" : ""}${sel ? " aim" : ""}${sp.glint === false ? " ng" : ""}" data-sp="${esc(sp.id)}" data-zone-id="${esc(sp.id)}" data-seen="${vis(sp.id) ? "true" : "false"}" style="left:${b[0] + b[2] / 2}%;top:${b[1] + b[3] / 2}%;width:${b[2]}%;height:${b[3]}%;transform:translate(-50%,-50%);z-index:2" aria-label="${esc(L(sp.label))}${vis(sp.id) ? " · " + esc(nat({en:"examined",vi:"đã xem"})) : ""}"><span class="pz-l">${esc(L(sp.label))}</span></button>`;
        }
        return `<button class="se-spot${vis(sp.id) ? " seen" : ""}${need ? " need" : ""}${sp.clue ? " clue" : ""}${sel ? " aim" : ""}" data-sp="${sp.id}" style="left:${Math.max(10, Math.min(90, sp.x))}%;top:${Math.max(12, Math.min(64, sp.y))}%"><i></i><span>${esc(L(sp.label))}</span></button>`;
      }).join("");
      const n = found(), tot = clues.length, need = Math.min(X.need ?? 0, tot), ok = n >= need;
      const items = R.items.filter(id => id === sel || E.itemLive(id));
      const bag = items.map(id => `<button class="se-bi${sel === id ? " on" : ""}${mode && sel && sel !== id ? " pick" : ""}" data-it="${id}" aria-label="${nm(id)}">${E.itemArt(id, "sm")}</button>`).join("");
      const it = sel && S.items[sel];
      const card = it ? `<div class="se-hold"><span class="se-hia">${E.itemArt(sel, "sm")}</span><div><b>${nm(sel)}</b><small>${mode ? esc(nat({ en: "Now tap the item to combine it with.", vi: "Giờ chạm món muốn ghép cùng." })) : esc(nat({ en: "Tap a place in the scene to use it there.", vi: "Chạm vào một chỗ trên cảnh để dùng." }))}</small></div>
          <span class="se-hbtn">${(S.combos || []).length ? `<button class="se-btn sm${mode ? " on" : ""}" data-cmb>${esc(nat({ en: "Combine", vi: "Ghép" }))}</button>` : ""}<button class="se-ib sm" data-unsel aria-label="${T("close")}">${E.ICON.x}</button></span></div>` : "";
      const askHtml = ask ? `<div class="se-ask2"><b>${esc(nat({ en: `${tot - n} place${tot - n > 1 ? "s" : ""} not checked yet.`, vi: `Còn ${tot - n} chỗ chưa xem.` }))}</b><p>${esc(nat({ en: "Missing clues can make your deductions wrong. Leave anyway?", vi: "Thiếu manh mối có thể khiến bạn suy luận sai. Vẫn rời đi?" }))}</p><div class="se-row"><button class="se-btn" data-ask-no>${esc(nat({ en: "Keep searching", vi: "Xem tiếp" }))}</button><button class="se-btn pri" data-ask-yes>${esc(nat({ en: "Leave", vi: "Vẫn rời đi" }))}</button></div></div>` : "";
      if (direct) {
        rt.classList.toggle("xp-inspecting", !!detail());
        backHost.innerHTML = detail() ? `<button class="pl-detail-back" data-xp-back>${E.ICON.left}<span>${esc(nat({en:"Back",vi:"Lùi"}))}</span></button>` : "";
        const label = detail() ? X.spots.find(sp => sp.id === detail().id)?.label : S.scenes?.[imageId]?.name;
        const goal = detail() ? nat({en:"Tap the detail to inspect it again. Use Back to return to the scene.",vi:"Chạm chi tiết để xem lại. Bấm Lùi để trở về cảnh."}) : L(X.goal);
        const tag = detail() ? "div" : "button";
        E.ui.panel(`${askHtml || `<div class="pl-location"><span>${esc(nat(label) || "")}</span></div>${goalOpen && !detail() ? `<div class="pl-objective">${esc(goal)}</div>` : ""}${card}${msg ? `<div class="pl-msg" role="status">${msg}</div>` : ""}${items.length && (bagOpen || mode) ? `<div class="se-bag">${bag}</div>` : ""}<div class="pl-bar"><${tag} class="pl-goal compact"${detail() ? "" : ` data-xp-objective aria-expanded="${goalOpen}"`}><span>${esc(goal)}</span>${!detail() && tot ? `<b>${n}/${tot}</b>` : ""}${!detail() ? `<i aria-hidden="true">${E.ICON.down}</i>` : ""}</${tag}>${items.length ? `<button class="pl-ib${bagOpen ? " on" : ""}" data-xp-bag aria-expanded="${bagOpen}" aria-label="${esc(nat({en:"Bag",vi:"Túi đồ"}))}">${E.ICON.box}<i>${items.length}</i></button>` : ""}${!detail() && ok ? `<button class="se-btn pri pl-go" data-done>${esc(L(X.done) || T("cont"))}</button>` : ""}</div>`}`, "xp");
      } else E.ui.panel(`<div class="se-xg${sel || ask ? " one" : ""}"><span>${esc(L(X.goal))}</span>${tot ? `<b title="${esc(nat({ en: "Clues found", vi: "Manh mối đã tìm" }))}">${n}/${tot}</b>` : ""}</div>
        ${askHtml || `${card}${msg ? `<div class="se-xmsg">${msg}</div>` : ""}
        ${items.length ? `<div class="se-bagl">${esc(nat({ en: sel ? "Your bag — tap another item to switch" : "Your bag — tap an item to hold it", vi: sel ? "Túi đồ — chạm món khác để đổi" : "Túi đồ — chạm 1 món để cầm lên" }))}</div><div class="se-bag">${bag}</div>` : ""}
        <button class="se-btn pri wide${ok ? "" : " dim"}" data-done ${ok ? "" : "disabled"}>${ok ? esc(L(X.done) || T("cont")) : esc(nat({ en: `Find ${need - n} more clue${need - n > 1 ? "s" : ""}`, vi: `Cần thêm ${need - n} manh mối` }))}</button>`}`, "xp");
      fitSpots();
    };
    // các điểm nằm TRỌN phía trên bảng: cầm 1 món thì bảng cao lên (thẻ món + túi đồ) và từng che mất điểm ở thấp (người dùng 29/10, khỉ bấm bắt được)
    //   → co vùng điểm lại theo chiều cao bảng (đo offsetHeight — bảng đang trượt lên thì vị trí đo được chưa đúng)
    const lookDetail = (d, ms = 0) => {
      if (d.light) E.ui.zoom(d.box[0] + d.box[2] / 2, d.box[1] + d.box[3] / 2, d.light); else E.ui.zoom(null);
      E.ui.look(d.box, ms, true);
    };
    const fitSpots = (refocus = false) => {
      if (over || c.live?.() === false) return;
      if (direct) {
        const [iw, ih] = E.imgSize(imageId); rt.style.setProperty("--vale-scene-ar", String(iw / ih));
        E.ui.frame(imageId, spots.map(region), { top: 68, bottom: 105 }); E.syncImagePlanes?.();
        if (detail() && (firstDraw || refocus)) lookDetail(detail(), 0);
        firstDraw = false; return;
      }
      const p = document.querySelector(".se-ui .se-panel"), u = document.querySelector(".se-ui"), frameRoot = document.querySelector(".se");
      if (!p || !u || !frameRoot) return;
      const R0 = frameRoot.getBoundingClientRect(), tb = document.querySelector(".se-top")?.getBoundingClientRect();
      layer.style.bottom = Math.max(0, R0.bottom - u.getBoundingClientRect().bottom + p.offsetHeight + 8) + "px";
      // dưới thanh trên cùng (nút menu / sổ tay…) — vùng co lại thì 12 % chiều cao có thể lọt dưới thanh đó
      layer.style.top = tb && !document.querySelector(".se-top").hidden ? Math.max(0, tb.bottom - R0.top - 20) + "px" : "";
    };
    const finish = () => { if (over || c.live?.() === false) return; over = true; c.resumeHere?.(false); delete details[detailKey]; layer.innerHTML = ""; normalLayer.style.bottom = normalLayer.style.top = ""; backHost?.remove(); E.ui.clear(); E.ui.zoom(null); if (direct) E.ui.look(null, 350); res(); };
    const enterDetail = (sp, light) => {
      if (!direct || sp.inspect === false || sp.look === false) return;
      details[detailKey] = { id: sp.id, img: imageId, box: [...inspection(sp)], light };
      ask = false; lookDetail(detail(), 650);
    };
    const backDetail = () => {
      if (over || c.live?.() === false || !detail()) return;
      delete details[detailKey]; sel = null; mode = ""; msg = ""; bagOpen = false;
      E.ui.zoom(null); E.ui.look(null, 350); E.sfx("tap"); E.save(); draw();
    };
    // vào 1 điểm: cận cảnh chỗ đó (nền phóng vào điểm) rồi chạy các bước; xong các bước → khám phá chạy lại (again) và thu cận cảnh
    const runSpot = (sp, look, go) => { if (over || c.live?.() === false) return; over = true; c.resumeHere?.(false); layer.innerHTML = ""; normalLayer.style.bottom = normalLayer.style.top = ""; backHost?.remove(); E.ui.clear(); if (direct) { enterDetail(sp, look); E.syncImagePlanes?.(); if (detail()) lookDetail(detail(), 650); } else E.ui.zoom(sp.x, sp.y, look); c.again(); go(); res(); };
    const onSpot = id => {
      if (over || c.live?.() === false || (detail() && detail().id !== id) || !spots.some(sp => sp.id === id)) return;
      const i = X.spots.findIndex(s => s.id === id), sp = X.spots[i];
      if (direct && !detail()) enterDetail(sp, sp.dark ? (R.used[c.key("u", id)] ? "torch" : "dark") : "");
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
      if (direct) E.save(); draw();
    };
    const onItem = id => {
      if (over || c.live?.() === false || !R.items.includes(id)) return;
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
      if (direct) bagOpen = false;
      draw();
    };
    layer.onclick = e => { const b = e.target.closest("[data-sp]"); if (b) onSpot(b.dataset.sp); };
    if (direct) {
      if (!detail()) E.ui.look(null, 0, true);
      const ready = E.curImg() === imageId ? E.ui.layerReady?.() : E.ui.scene(imageId, false);
      Promise.resolve(ready).then(() => { if (!over && c.live?.() !== false) draw(); });
      ro = globalThis.ResizeObserver ? new ResizeObserver(() => fitSpots(true)) : null; ro?.observe(stage);
      offPlane = E.on("image-plane", img => { if (img === imageId) fitSpots(true); });
      const onKey = e => { if (e.key === "Escape" && detail() && !document.querySelector(".se-sheet:not([hidden])")) { e.preventDefault(); backDetail(); } };
      addEventListener("keydown", onKey); offKey = () => removeEventListener("keydown", onKey);
    } else draw();
    document.querySelector(".se-ui").onclick = e => {
      if (over || c.live?.() === false) return;
      if (e.target.closest("[data-xp-objective]")) { goalOpen = !goalOpen; E.sfx("tap"); return draw(); }
      if (e.target.closest("[data-xp-bag]")) { bagOpen = !bagOpen; E.sfx("tap"); return draw(); }
      if (e.target.closest("[data-ask-yes]")) return finish();
      if (e.target.closest("[data-ask-no]")) { ask = false; E.sfx("tap"); return draw(); }
      if (e.target.closest("[data-done]")) { if (detail() || found() < Math.min(X.need ?? 0, clues.length)) return; if (found() < clues.length && !E.auto) { ask = true; sel = null; mode = ""; E.sfx("tap"); return draw(); } return finish(); }
      if (e.target.closest("[data-unsel]")) { sel = null; mode = ""; msg = ""; E.sfx("tap"); return draw(); }
      if (e.target.closest("[data-cmb]")) { mode = mode ? "" : "combine"; if (direct) bagOpen = !!mode; msg = ""; E.sfx("tap"); return draw(); }
      if (e.target.closest(".se-hia")) return sel && E.ui.itemView(sel);
      const it = e.target.closest("[data-it]"); if (it) onItem(it.dataset.it);
    };
    E.autoRun(() => {
      if (detail()) backDetail();
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
    c.resumeHere?.();
    const pairs = Array.isArray(D.a[0]) ? D.a : [D.a];
    const available = () => pairs.find(p => p.length === 2 && p.every(id => R.items.includes(id)));
    let tries = 0, warned = !!available(), bad = false, done = false, tm = 0, query = "", showAll = !Array.isArray(D.cards), category = "all";
    const slot = [null, null], live = () => !c.live || c.live();
    // Search only the names/descriptions of owned clues, in every supplied language.
    // Updating the grid alone keeps the input, caret and mobile keyboard in place.
    const fold = text => String(text || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/\s+/g, " ").trim();
    const textOf = value => typeof value === "string" ? value : Object.values(value || {}).filter(v => typeof v === "string").join(" ");
    const matching = () => {
      const words = fold(query).split(" ").filter(Boolean);
      const pool = showAll || words.length ? R.items : R.items.filter(id => D.cards.includes(id));
      return pool.filter(id => { const it = S.items[id], text = fold(textOf(it?.name) + " " + textOf(it?.desc)), group = E.evidenceMeta?.(id)?.group || (it?.kind === "testimony" ? "testimony" : "objects"); return (category === "all" || group === category) && words.every(word => text.includes(word)); });
    };
    const cards = ids => ids.map(id => `<button class="se-ddc${slot.includes(id) ? " on used" : ""}" data-c="${esc(id)}" aria-pressed="${slot.includes(id)}">${E.itemArt(id, "sm")}<b>${investigationText(S.items[id]?.name)}</b><small>${investigationText(S.items[id]?.brief || S.items[id]?.desc)}</small></button>`).join("");
    const searchStatus = count => nat(count ? { en: `${count} of ${R.items.length} clues`, vi: `${count}/${R.items.length} manh mối` } : { en: "No clues match. Try another name or description.", vi: "Không tìm thấy manh mối. Thử tên hoặc mô tả khác." });
    const filterCards = el => {
      const ids = matching();
      el.querySelector(".se-ddg").innerHTML = cards(ids);
      el.querySelector("[data-deduce-search-status]").textContent = searchStatus(ids.length);
      el.querySelector("[data-deduce-clear]").disabled = !query;
    };
    c.onCancel?.(() => { done = true; clearTimeout(tm); res(); });
    E.ui.hideBox();
    const head = () => `<div class="se-dd"><div class="se-ddh">${E.ICON.bulb}<small>${esc(nat({ en: "Deduction", vi: "Suy luận" }))}</small></div><b class="se-ddq">${investigationText(D.q)}</b>`;
    const nextK = () => slot.indexOf(null);
    const finish = (ok, delay = 0) => {
      if (done || !live()) return; done = true; c.resumeHere?.(false);
      if (ok ? D.ok : D.fail) c.push("deduce", ok ? "ok" : "fail");
      const go = () => { if (!live()) return res(); E.ui.clear(); res(); };
      if (delay && !E.auto) tm = setTimeout(go, delay); else go();
    };
    const draw = (msg = "") => {
      if (done || !live()) return;
      const left = D.tries ? Math.max(0, D.tries - tries) : 0, ids = matching();
      const el = !warned
        ? E.ui.panel(`${head()}</div><div class="se-ask2 warn"><b>${investigationText({ en: "You don't have enough clues to answer this for sure.", vi: "Bạn chưa đủ manh mối để trả lời chắc chắn." })}</b><p>${investigationText(D.missing || { en: "You may have missed something during the search.", vi: "Có thể bạn đã bỏ sót một chỗ khi khám xét." })}</p><div class="se-row"><button class="se-btn" data-skip>${esc(nat({ en: "Skip", vi: "Bỏ qua" }))}</button><button class="se-btn pri" data-try>${esc(nat({ en: "Try anyway", vi: "Vẫn thử" }))}</button></div></div>`, "deduce")
        : E.ui.panel(`${head()}<p class="se-mute">${investigationText({ en: "Drag or tap two clues into the slots. Check the pair, then confirm.", vi: "Kéo hoặc chạm để đặt hai manh mối vào ô. Xem lại cặp đã chọn rồi xác nhận." })}${D.tries ? ` · ${esc(nat({ en: `${left} tries left`, vi: `Còn ${left} lượt thử` }))}` : ""}</p></div>
        <div class="se-eq${bad ? " bad" : ""}">${[0, 1].map(k => { const id = slot[k]; return `<button class="se-eqs${id ? " on" : ""}${k === nextK() ? " next" : ""}" data-slot="${k}" aria-label="${esc(nat(id ? { en: `Remove ${nat(S.items[id]?.name)}`, vi: `Gỡ ${nat(S.items[id]?.name)}` } : { en: `Clue ${k + 1}`, vi: `Manh mối ${k + 1}` }))}">${id ? `${E.itemArt(id, "sm")}<b>${investigationText(S.items[id]?.name)}</b>` : `<small>${esc(nat({ en: `Clue ${k + 1}`, vi: `Manh mối ${k + 1}` }))}</small>`}</button>`; }).join("<b class='se-eqo'>+</b>")}<b class="se-eqo">→</b><span class="se-eqq">?</span></div>
        ${Array.isArray(D.cards) ? `<div class="se-deduce-focus"><span>${esc(nat(showAll ? { en: "All records from this route", vi: "Toàn bộ hồ sơ của lượt này" } : { en: "A few records to start with", vi: "Một nhóm hồ sơ để bắt đầu" }))}</span><button class="se-btn sm" data-deduce-scope aria-pressed="${showAll}">${esc(nat(showAll ? { en: "Focus", vi: "Thu gọn" } : { en: `All ${R.items.length} records`, vi: `Tất cả ${R.items.length} hồ sơ` }))}</button></div>` : ""}
        ${E.evidenceMeta ? `<div class="se-deduce-categories" role="group" aria-label="Evidence type · Loại chứng cứ">${[["all", { en: "All", vi: "Tất cả" }], ["objects", { en: "Objects / traces", vi: "Đồ vật / dấu vết" }], ["testimony", { en: "Testimony", vi: "Lời khai" }]].map(([id, label]) => `<button class="se-btn sm${category === id ? " on" : ""}" data-deduce-category="${id}" aria-pressed="${category === id}">${esc(nat(label))}</button>`).join("")}</div>` : ""}
        <div style="display:grid;gap:6px;margin:0 0 10px"><label class="se-mute" for="se-deduce-search" style="margin:0;font-size:13.5px">${esc(nat({ en: "Find evidence", vi: "Tìm bằng chứng" }))}</label><div class="se-row" style="margin:0;flex-wrap:nowrap"><input id="se-deduce-search" class="se-in" type="search" data-deduce-search autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="search" style="min-width:0;flex:1;min-height:44px;font-size:16px" placeholder="${esc(nat({ en: "Name or description · EN / VI", vi: "Tên hoặc mô tả · EN / VI" }))}" value="${esc(query)}"><button class="se-btn sm" data-deduce-clear style="flex:none;min-height:44px" ${query ? "" : "disabled"}>${esc(nat({ en: "Clear", vi: "Xóa" }))}</button></div><small class="se-mute" data-deduce-search-status role="status" aria-live="polite">${esc(searchStatus(ids.length))}</small></div>
        <div class="se-ddg">${cards(ids)}</div>
        ${msg}<button class="se-btn pri wide" data-deduce-confirm ${slot.every(Boolean) ? "" : "disabled"}>${esc(nat({ en: "Confirm connection", vi: "Xác nhận liên hệ" }))}</button>`, "deduce");
      el.onclick = e => {
        if (done || !live()) return;
        if (e.target.closest("[data-skip]")) return finish(false);
        if (e.target.closest("[data-try]")) { warned = true; E.sfx("tap"); return draw(); }
        if (E.dragged?.()) return;
        if (e.target.closest("[data-deduce-scope]")) { showAll = !showAll; E.sfx("tap"); return draw(); }
        const cat = e.target.closest("[data-deduce-category]"); if (cat) { category = cat.dataset.deduceCategory; el.querySelectorAll("[data-deduce-category]").forEach(b => { const on = b === cat; b.classList.toggle("on", on); b.setAttribute("aria-pressed", String(on)); }); filterCards(el); return; }
        if (e.target.closest("[data-deduce-clear]")) { query = ""; const input = el.querySelector("[data-deduce-search]"); input.value = ""; filterCards(el); input.focus({ preventScroll: true }); return; }
        if (e.target.closest("[data-deduce-confirm]")) return check();
        const sl = e.target.closest("[data-slot]"); if (sl && slot[+sl.dataset.slot]) { slot[+sl.dataset.slot] = null; E.sfx("tap"); return draw(); }
        const b = e.target.closest("[data-c]");
        if (b) { const id = b.dataset.c; if (slot.includes(id)) { slot[slot.indexOf(id)] = null; E.sfx("tap"); return draw(); } if (nextK() < 0) return; put(nextK(), id); }
      };
      el.oninput = e => { if (done || !live() || !e.target.matches("[data-deduce-search]")) return; query = e.target.value; filterCards(el); };
      el.onpointerdown = E.dragger?.({ src: "[data-c]", dst: "[data-slot]", drop: (a, d) => { if (!d || done || !live()) return; const k = +d.dataset.slot, id = a.dataset.c; if (slot.includes(id)) slot[slot.indexOf(id)] = null; put(k, id); } });
    };
    const put = (k, id) => { if (done || !live()) return; slot[k] = id; E.sfx("pick"); E.haptic("LIGHT"); draw(); };
    const check = () => {
      if (done || !live() || !slot.every(Boolean) || slot[0] === slot[1]) return;
      tries++;
      const ok = pairs.some(p => p.length === 2 && p.every(id => slot.includes(id)));
      if (ok) {
        E.ui.fx("solve"); E.sfx("solve"); E.haptic("MEDIUM"); E.add("deduced", 1);
        const q = document.querySelector(".se-eqq"); if (q) q.textContent = "✓";
        document.querySelector(".se-eq")?.classList.add("ok"); E.fxBurst?.(document.querySelector(".se-eq"), "#ffd166", 18);
        document.querySelectorAll(".se-ui button").forEach(b => b.disabled = true);
        return finish(true, 900);
      }
      E.ui.fx("shake"); E.sfx("wrong");
      if (D.tries && tries >= D.tries) return finish(false);
      slot[0] = slot[1] = null; bad = true; E.haptic("HEAVY");
      draw(`<div class="se-hint no" role="status">${investigationText({ en: "Those two don't explain it.", vi: "Hai manh mối đó không giải thích được." })}${D.hint ? `<p>${E.ICON.bulb}${investigationText(D.hint)}</p>` : ""}</div>`); bad = false;
    };
    draw();
    E.autoRun(() => { const p = available(); if (!p) return finish(false); slot[0] = p[0]; slot[1] = p[1]; check(); });
  }));

  // ───────── BẢN ĐỒ: chọn hướng đi / nơi đến ─────────
  // { map: { goal, img?, places: [{ id, x, y, label, desc, go | then, if, need, lockHint, once }] } }
  def("map", (c) => new Promise(res => {
    const { st, s } = c, M = st.map, R = E.R();
    c.resumeHere?.();
    E.ui.hideBox();
    const ps = (M.places || []).map((p, i) => ({ p, i })).filter(({ p }) => !p.if || cond(p.if, s)).filter(({ p, i }) => !(p.once && R.used[c.key(i)]));
    const usable = ps.filter(({ p }) => !p.need || cond(p.need, s));
    if (!usable.length) {
      let closed = false;
      const branch = Array.isArray(M.empty) ? "empty" : Array.isArray(M.fail) ? "fail" : null;
      const finish = () => {
        if (closed || c.live?.() === false) return;
        closed = true; c.resumeHere?.(false); E.ui.clear();
        if (branch) c.push("map", branch);
        res();
      };
      const empty = E.ui.panel(`<div class="se-ask" role="status">${esc(nat({ en: "No destination is available right now. You can continue without moving.", vi: "Hiện chưa có nơi nào có thể đến. Bạn có thể tiếp tục mà không di chuyển." }))}</div><button class="se-btn pri wide" data-unavailable>${T("cont")}</button>`, "map");
      empty.onclick = e => { if (e.target.closest("[data-unavailable]")) finish(); };
      c.onCancel?.(() => { closed = true; res(); });
      E.autoRun(finish);
      return;
    }
    const el = E.ui.panel(`<div class="se-map"${M.img ? ` style="background-image:url('${esc(M.img)}')"` : ""}>
      <div class="se-xg"><span>${esc(L(M.goal))}</span></div>
      ${ps.map(({ p, i }) => { const lock = p.need && !cond(p.need, s); const seen = R.used[c.key("v", i)]; return `<button class="se-pl${lock ? " lock" : ""}${seen ? " seen" : ""}" data-i="${i}" style="left:${p.x}%;top:${p.y}%" ${lock ? "disabled" : ""}><i></i><b>${esc(L(p.label))}</b>${p.desc ? `<small>${esc(L(p.desc))}</small>` : ""}${lock && p.lockHint ? `<small>${E.ICON.lock}${esc(L(p.lockHint))}</small>` : ""}</button>`; }).join("")}
    </div>`, "map");
    let done = false;
    const go = i => {
      if (done || c.live?.() === false) return; done = true; c.resumeHere?.(false);
      const p = M.places[i]; E.ui.clear(); R.used[c.key("v", i)] = 1; if (p.once) R.used[c.key(i)] = 1;
      E.apply(p);
      if (p.then) { if (M.loop) c.again(); c.push("map", "places", i, "then"); }
      if (p.go) E.jump(p.go);
      res();
    };
    el.onclick = e => { const b = e.target.closest("[data-i]"); if (b && !b.disabled) go(+b.dataset.i); };
    E.autoRun(() => { const x = pick(usable); go(x.i); });
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
      if (done || c.live?.() === false) return; done = true;
      const o = I.opts[i], best = I.opts.reduce((a, b) => ((b.acc || 0) > (a.acc || 0) ? b : a));
      E.ui.clear();
      E.add("acc", o.acc || 0); E.add("accN", 2);
      R.notes.push({ ch: R.ch, dir: I.dir, src: src.text, srcLang: src.lang, pick: tOf(o), best: tOf(best), acc: o.acc || 0, why: I.why || null });
      E.apply(o);
      await E.ui.line({ who: "me", kind: "say", main: tOf(o), sub: outLang === E.L ? docTr(o.t) : "", lang: outLang, tag: I.dir === "rec" ? nat({ en: "notebook", vi: "sổ tay" }) : I.dir === "e2v" ? "→ " + E.cname(E.S().chars[I.to] || {}, true) : nat({ en: "interpreting", vi: "dịch" }), cls: I.dir === "rec" ? "note" : "interp" });
      if (c.live?.() === false) return res();
      if (G.set.mode === "easy" || E.auto) {
        const a = o.acc || 0, lab = a === 2 ? nat({ en: "Accurate", vi: "Chính xác" }) : a === 1 ? nat({ en: "Close", vi: "Gần đúng" }) : nat({ en: "Meaning changed", vi: "Lệch nghĩa" });
        if (!E.auto) await feedback(`<div class="se-fb a${a}"><b>${a === 2 ? "✓" : a === 1 ? "≈" : "✗"} ${esc(lab)}</b>${a < 2 ? `<p>${esc(nat({ en: "Better:", vi: "Nên dịch:" }))} <i>${esc(tOf(best))}</i></p>` : ""}${I.why ? `<p>${esc(L(I.why))}</p>` : ""}</div>`, c);
      } else E.sfx("page");
      if (c.live?.() === false) return res();
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
  const feedback = (html, c) => new Promise(r => { let done = false; c?.onCancel?.(() => { done = true; r(); }); const el = E.ui.panel(`${html}<button class="se-btn pri wide" data-ok>${T("cont")}</button>`, "fbk"); el.onclick = e => { e.stopPropagation(); if (!done && c?.live?.() !== false && e.target.closest("[data-ok]")) { done = true; E.ui.clear(); r(); } }; });
  E.feedback = feedback;

  // ───────── VẠCH LỜI KHAI: chạm dòng sai → đưa bằng chứng; ký = kết thúc ─────────
  // { present: { title, goal, segs: [{ t: "…" | { en, vi }, fix, bad, evidence, ok, same }], sign, wrong, noEvidence } }
  // 29/10 (người dùng: khó hiểu, bấm nhầm là hội thoại chạy tiếp, không có chỗ dịch):
  //   3 bước hiện rõ ở đầu (chạm dòng sai → đưa bằng chứng → ký) · chạm dòng = ô bằng chứng mở NGAY dưới dòng đó (+ Huỷ) ·
  //   dòng đã sửa: chữ cũ gạch ngang + chữ mới · nút Gốc | Dịch đổi cả biên bản sang bản dịch · KÝ PHẢI XÁC NHẬN (ký rồi không sửa được).
  def("present", (c) => new Promise(res => {
    const { st, s } = c, P = st.present, R = E.R(), S = E.S(), G = E.G();
    E.ui.hideBox();
    let sel = -1, ask = false, query = "";
    const hasTr = E.N !== E.L && P.segs.some(g => docTr(g.t));
    let tr = !!G.set.docTr && hasTr;
    const fixed = i => R.used[c.key("fix", i)];
    const records = () => E.bag().slice().reverse();
    const foldRecord = t => String(t || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");
    const recordText = t => typeof t === "string" ? t : Object.values(t || {}).filter(x => typeof x === "string").join(" ");
    const searchBox = () => `<label class="se-present-search"><span>${esc(nat({en:"Find evidence · newest first",vi:"Tìm chứng cứ · mới nhất trước"}))}</span><input class="se-in" type="search" data-present-search autocomplete="off" spellcheck="false" value="${esc(query)}" placeholder="${esc(nat({en:"Name or description · EN / VI",vi:"Tên hoặc mô tả · EN / VI"}))}"></label><small data-present-count role="status" aria-live="polite"></small>`;
    const filterRecords = () => {
      const words = foldRecord(query).trim().split(/\s+/).filter(Boolean), els = [...document.querySelectorAll('.se-panel.present [data-ev],.se-panel.present [data-evd]')]; let shown = 0;
      els.forEach(el => { const it = S.items[el.dataset.ev || el.dataset.evd]; const text = foldRecord(recordText(it?.name) + " " + recordText(it?.desc)); el.hidden = !words.every(w => text.includes(w)); if (!el.hidden) shown++; });
      const status = document.querySelector('.se-panel.present [data-present-count]'); if (status) status.textContent = nat(shown ? {en:`${shown} of ${els.length} records`,vi:`${shown}/${els.length} hồ sơ`} : {en:"No matching records. Try another word.",vi:"Không có hồ sơ phù hợp. Thử từ khác."});
    };
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
          return line + `<div class="se-ev"><small>${esc(nat({ en: "Which evidence proves this line is wrong?", vi: "Bằng chứng nào cho thấy dòng này sai?" }))}</small>${searchBox()}<div class="se-bag">${records().map(id => `<button class="se-bi lg" data-ev="${id}">${E.itemArt(id, "md")}<small>${esc(nat(S.items[id]?.name))}</small></button>`).join("")}</div><button class="se-btn sm" data-cancel>${esc(nat({ en: "Cancel", vi: "Huỷ" }))}</button></div>`;
        }).join("")}
        </div>
        ${!ask && sel < 0 ? `<div class="se-evt"><small>${esc(nat({ en: "Evidence — drag onto a false line", vi: "Bằng chứng — kéo thả lên dòng sai" }))}</small>${searchBox()}<div>${records().map(id => `<button class="se-evi" data-evd="${id}">${E.itemArt(id, "sm")}<b>${esc(nat(S.items[id]?.name))}</b></button>`).join("")}</div></div>` : ""}
        ${ask ? `<div class="se-ask2"><b>${esc(nat({ en: "Sign this statement?", vi: "Ký biên bản này?" }))}</b><p>${esc(nat({ en: "Once you sign, you can't change it.", vi: "Ký rồi thì không sửa được nữa." }))}</p><div class="se-row"><button class="se-btn" data-ask-no>${esc(nat({ en: "Read again", vi: "Đọc lại" }))}</button><button class="se-btn pri" data-ask-yes>${esc(L(P.sign) || nat({ en: "Sign", vi: "Ký tên" }))}</button></div></div>`
          : `<button class="se-btn wide" data-sign>${E.ICON.pen} ${esc(L(P.sign) || nat({ en: "Nothing else is wrong — sign it", vi: "Không còn chỗ sai — ký tên" }))}</button>`}`, "present");
      const input = document.querySelector('.se-panel.present [data-present-search]'); if (input) input.oninput = e => { query = e.target.value; filterRecords(); }; filterRecords();
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
    document.querySelector(".se-ui").onpointerdown = E.dragger?.({ src: "[data-evd]", dst: "[data-s]", drop: (a, d) => { if (!d) return; sel = +d.dataset.s; onEv(a.dataset.evd); } });
    document.querySelector(".se-ui").onclick = e => {
      const v = e.target.closest("[data-trv]");
      if (v) { tr = v.dataset.trv === "1"; G.set.docTr = tr; E.save(); E.sfx("tap"); return draw(); }
      if (e.target.closest("[data-ask-yes]")) { E.ui.clear(); return res(); }
      if (e.target.closest("[data-ask-no]")) { ask = false; E.sfx("tap"); return draw(); }
      if (e.target.closest("[data-sign]")) { ask = true; sel = -1; E.sfx("tap"); return draw(); }
      if (e.target.closest("[data-cancel]")) { sel = -1; E.sfx("tap"); return draw(); }
      if (E.dragged?.()) return;
      const ev = e.target.closest("[data-ev]"); if (ev) return onEv(ev.dataset.ev);
      const evd = e.target.closest("[data-evd]"); if (evd) { if (sel >= 0) return onEv(evd.dataset.evd); E.sfx("wrong"); const t = document.querySelector(".se-evt small"); if (t) { t.textContent = nat({ en: "First tap the line you think is false.", vi: "Chạm vào dòng bạn cho là sai trước đã." }); t.classList.add("warn"); } return; }
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
    let qi = 0, plays = 0, right = 0, streak = 0, busy = false, fin = false;
    const live = () => c.live?.() !== false;
    c.onCancel?.(() => { fin = true; res(); });
    const draw = (msg = "") => {
      if (fin || !live()) return;
      const q = Q.qs[qi];
      E.ui.panel(`${withAudio ? `<div class="se-au"><button class="se-play" data-play>${E.ICON.spk}</button><div><b>${esc(nat({ en: "Voice message", vi: "Tin nhắn thoại" }))}</b><small>${esc(nat({ en: "No text — listen carefully.", vi: "Không có chữ — nghe thật kỹ." }))} ${plays ? `· ${plays}×` : ""}</small></div><button class="se-btn sm" data-slow>${esc(nat({ en: "Slow", vi: "Chậm" }))}</button></div>` : ""}
        ${q ? `<div class="se-ask">${esc(L(q.q))}</div><div class="se-chs">${q.opts.map((o, i) => `<button class="se-ch-b" data-a="${i}"><span>${esc(E.tgt(o))}</span></button>`).join("")}</div>` : `<button class="se-btn pri wide" data-finish>${T("cont")}</button>`}
        ${msg}`, "listen");
    };
    const play = slow => { if (fin || !live()) return; plays++; draw(); const a = document.querySelector(".se-au"); a?.classList.add("on"); E.say(E.tgt(Q.audio), Q.who || "caller", { force: true, slow }).then(() => document.querySelector(".se-au")?.classList.remove("on")); };
    const answer = async i => {
      if (busy || fin || !live()) return; busy = true;
      const q = Q.qs[qi], ok = i === q.a;
      if (ok) { right++; streak++; E.apply(q); E.sfx("up"); E.haptic("LIGHT"); } else { streak = 0; E.sfx("wrong"); E.haptic("HEAVY"); }
      // reveal: false (thiếu dữ kiện thì sai là bình thường) → không bật xanh đáp án đúng khi trả lời sai
      const hide = !ok && (Q.reveal === false || q.reveal === false);
      document.querySelectorAll(".se-ui [data-a]").forEach((b, k) => b.classList.add(k === i ? (ok ? "ok" : "no") : k === q.a && !hide ? "ok" : "dim"));
      const hit = document.querySelectorAll(".se-ui [data-a]")[q.a];
      if (ok && streak >= 2) E.fxFloat?.(hit, nat({ en: `${streak} in a row!`, vi: `${streak} câu liền!` }), "#6fcf97"); else if (ok) E.fxBurst?.(hit, "#6fcf97", 8);
      await new Promise(r => setTimeout(r, E.auto ? 1 : 900));
      if (!live()) return res();
      qi++; busy = false;
      if (qi < Q.qs.length) return draw();
      busy = true;
      E.add("qRight", right); E.add("qN", Q.qs.length);
      if (E.auto) {}
      else if (withAudio) {
        // hết câu hỏi → hiện lời gốc + nghĩa (học từ chính đoạn vừa nghe)
        if (Q.reveal !== false) await feedback(`<div class="se-fb"><b>${right}/${Q.qs.length}</b><p class="se-tsc">${E.words(E.tgt(Q.audio), E.L)}</p>${Q.tr?.[E.N] ? `<p class="se-mute">${esc(Q.tr[E.N])}</p>` : ""}</div>`, c);
      } else if (!E.auto) await feedback(`<div class="se-fb"><b>${right}/${Q.qs.length}</b></div>`, c);
      // có pass → kết quả rẽ nhánh (đạt / trượt); không có → như cũ (chỉ ghi điểm)
      const pass = Q.pass ?? (Q.ok || Q.fail ? Q.qs.length : 0), won = right >= pass;
      if (pass) { E.flag(Q.key || "q_" + c.key(), right); await E.verdict?.(won, nat(won ? { en: "Well understood!", vi: "Hiểu chuẩn!" } : { en: "Missed some", vi: "Còn sót ý" })); }
      if (!live()) return res();
      fin = true; E.ui.clear();
      if (pass && (won ? Q.ok : Q.fail)) c.push(withAudio ? "listen" : "quiz", won ? "ok" : "fail");
      res();
    };
    draw();
    document.querySelector(".se-ui").onclick = e => {
      if (fin || !live()) return;
      if (e.target.closest("[data-finish]")) { fin = true; E.ui.clear(); return res(); }
      if (e.target.closest("[data-play]")) return play(false);
      if (e.target.closest("[data-slow]")) return play(true);
      const a = e.target.closest("[data-a]"); if (a && !a.classList.contains("ok") && !a.classList.contains("no")) answer(+a.dataset.a);
    };
    if (withAudio && !E.auto) setTimeout(() => play(false), 400);
    E.autoRun(() => { const tick = () => { if (fin || !live()) return; if (!Q.qs.length) { fin = true; E.ui.clear(); return res(); } if (qi < Q.qs.length) { if (!busy) answer(Q.qs[qi].a); setTimeout(tick, E.auto ? 10 : 1000); } }; tick(); });
  });
  def("listen", c => { E.ui.hideBox(); return qflow(c, c.st.listen, true); });
  def("quiz", c => { E.ui.hideBox(); return qflow(c, c.st.quiz, false); });

  // ───────── GIẢI ĐỐ: KHOÁ số / chữ (bánh xe) ─────────
  // { lock: { prompt, kind: "digits"|"letters"|[ký tự…], answer, hints: [..], ok, fail, giveUp } }
  def("lock", (c) => new Promise(res => {
    const K = c.st.lock;
    const set = Array.isArray(K.kind) ? K.kind : K.kind === "letters" ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("") : "0123456789".split("");
    const ans = Array.from(String(K.answer).toUpperCase());
    const cur = ans.map(() => 0);
    let tries = 0, hint = 0, entry = false, typed = "", busy = false, over = false;
    c.onCancel?.(() => { over = busy = true; res(); });
    E.ui.hideBox();
    const draw = (msg = "") => {
      const el = E.ui.panel(`<div class="se-ask">${esc(L(K.prompt))}</div>
        ${entry
          ? `<input class="se-in big" data-code autocomplete="off" autocapitalize="characters" spellcheck="false" inputmode="${set.every(x => /^\d$/.test(String(x))) ? "numeric" : "text"}" aria-label="${esc(nat({ en: "Enter the code", vi: "Nhập mã" }))}" value="${esc(typed)}">`
          : `<div class="se-lock">${cur.map((v, i) => `<div class="se-wh"><button data-u="${i}" aria-label="${esc(nat({ en: `Increase character ${i + 1}`, vi: `Tăng ký tự ${i + 1}` }))}">▲</button><b aria-live="polite">${esc(set[v])}</b><button data-d="${i}" aria-label="${esc(nat({ en: `Decrease character ${i + 1}`, vi: `Giảm ký tự ${i + 1}` }))}">▼</button></div>`).join("")}</div>`}
        <div class="se-lock-tools"><button class="se-btn sm" data-mode>${esc(nat(entry ? { en: "Use wheels", vi: "Dùng vòng xoay" } : { en: "Type code", vi: "Gõ mã" }))}</button><button class="se-btn sm" data-reset>${esc(nat({ en: "Reset", vi: "Đặt lại" }))}</button></div>
        <div class="se-row"><button class="se-btn pri" data-try>${esc(nat({ en: "Try", vi: "Thử" }))}</button>${K.hints?.length ? `<button class="se-btn" data-hint>${esc(nat({ en: "Hint", vi: "Gợi ý" }))} (${K.hints.length - hint})</button>` : ""}${K.giveUp && tries >= 3 ? `<button class="se-btn" data-give>${esc(nat({ en: "Give up", vi: "Bỏ qua" }))}</button>` : ""}</div>${msg}`, "lockp");
      const input = el.querySelector("[data-code]");
      if (input) {
        input.oninput = () => { typed = input.value; };
        input.onkeydown = e => { if (e.key === "Enter") { e.preventDefault(); check(); } };
        setTimeout(() => { if (!input.isConnected || over || c.live?.() === false) return; input.focus({ preventScroll: true }); input.setSelectionRange(input.value.length, input.value.length); }, 0);
      }
    };
    draw();
    const fin = (keys) => { if (over || c.live?.() === false) return; over = true; E.ui.clear(); if (keys) c.push("lock", keys); res(); };
    const check = async () => {
      if (busy || over || c.live?.() === false) return;
      const value = entry ? typed.trim().toUpperCase() : cur.map(v => String(set[v])).join("").toUpperCase();
      if (entry && Array.from(value).length !== ans.length) return draw(`<div class="se-hint no">${esc(nat({ en: `Enter all ${ans.length} characters.`, vi: `Nhập đủ ${ans.length} ký tự.` }))}</div>`);
      busy = true; tries++;
      if (value === ans.join("")) { E.ui.fx("solve"); await E.verdict?.(true, nat({ en: "Unlocked!", vi: "Đã mở!" })); return fin(K.ok ? "ok" : null); }
      E.ui.fx("shake");
      if (K.fail && tries === 1) { await E.verdict?.(false, nat({ en: "Locked", vi: "Không mở được" })); return fin("fail") || c.again(); }
      busy = false; draw(`<div class="se-hint no">${esc(nat({ en: "It doesn't open.", vi: "Không mở được." }))}</div>`);
    };
    document.querySelector(".se-ui").onclick = e => {
      if (busy || over || c.live?.() === false) return;
      const u = e.target.closest("[data-u]"), d = e.target.closest("[data-d]");
      if (u) { const i = +u.dataset.u; cur[i] = (cur[i] + 1) % set.length; typed = cur.map(v => set[v]).join(""); return draw(); }
      if (d) { const i = +d.dataset.d; cur[i] = (cur[i] - 1 + set.length) % set.length; typed = cur.map(v => set[v]).join(""); return draw(); }
      if (e.target.closest("[data-mode]")) {
        if (entry) {
          const chars = Array.from(typed.toUpperCase());
          if (chars.length === cur.length && chars.every(ch => set.some(x => String(x).toUpperCase() === ch))) {
            cur.splice(0, cur.length, ...chars.map(ch => set.findIndex(x => String(x).toUpperCase() === ch)));
          }
          entry = false;
        } else {
          typed = cur.map(v => set[v]).join("");
          entry = true;
        }
        return draw();
      }
      if (e.target.closest("[data-reset]")) { cur.fill(0); typed = ""; return draw(); }
      if (e.target.closest("[data-hint]") && hint < K.hints.length) { hint++; return draw(`<div class="se-hint">${K.hints.slice(0, hint).map(x => `<p>${E.ICON.bulb}${esc(L(x))}</p>`).join("")}</div>`); }
      if (e.target.closest("[data-give]")) { E.flag("gaveUp_" + c.key(), 1); return fin(K.giveUp ? "giveUp" : null); }
      if (e.target.closest("[data-try]")) check();
    };
    E.autoRun(() => { ans.forEach((ch, i) => (cur[i] = Math.max(0, set.findIndex(x => String(x).toUpperCase() === ch)))); document.querySelector("[data-try]")?.click(); });
  }));

  // ───────── XẾP THỨ TỰ (dòng thời gian, các bước, câu đảo) ─────────
  // { order: { prompt, items: [{ t: "…" | { en, vi }, tag? }] (đúng thứ tự), ok, fail, tries } }
  // 29/10 (người dùng): KÉO tay nắm ≡ để đổi chỗ, như sắp xếp kênh đăng ký trên YouTube (trước: chạm 2 ô để đổi chỗ) · nút Gốc | Dịch
  def("order", (c) => new Promise(res => {
    const O = c.st.order, G = E.G();
    let cur = shuffle(O.items, c.key()).map(([, i]) => i);
    if (cur.every((v, i) => v === i)) cur.reverse();
    let tries = 0, msg = "", selected = -1, busy = false, over = false;
    c.onCancel?.(() => { over = busy = true; res(); });
    const hasTr = E.N !== E.L && O.items.some(it => docTr(it.t));
    let tr = !!G.set.docTr && hasTr;
    E.ui.hideBox();
    const draw = () => {
      if (over || c.live?.() === false) return;
      const el = E.ui.panel(`<div class="se-ask se-askr"><span>${esc(L(O.prompt))}</span>${trSeg(tr, hasTr)}</div><p class="se-order-help">${esc(nat(selected < 0
        ? { en: "Tap an event, then its destination — or drag ≡.", vi: "Chạm một sự việc rồi chạm vị trí mới — hoặc kéo ≡." }
        : { en: "Now tap where to place it.", vi: "Giờ chạm vào vị trí muốn chuyển tới." }))}</p><div class="se-ord">${cur.map((k, p) => `<div class="se-oi${selected === p ? " selected" : ""}" data-p="${p}"><em>${O.items[k].tag ? esc(O.items[k].tag) : p + 1}</em><button class="se-oit" data-select="${p}" aria-pressed="${selected === p}">${docLine(O.items[k].t, tr)}</button><button class="se-oh" data-h="${p}" aria-label="${esc(nat({ en: "Drag to move", vi: "Kéo để đổi chỗ" }))}"><svg viewBox="0 0 24 24"><path d="M5 8h14M5 12h14M5 16h14"/></svg></button></div>`).join("")}</div>${msg}<button class="se-btn pri wide" data-chk>${esc(nat({ en: "Check", vi: "Kiểm tra" }))}</button>`, "orderp");
      bindDrag(el.querySelector(".se-ord"));
    };
    // kéo: hàng đang kéo đi theo ngón tay, các hàng khác dạt lên / xuống chừa chỗ; thả = chốt vị trí mới
    const bindDrag = list => {
      list.onpointerdown = e => {
        if (busy || over || c.live?.() === false) return;
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
        const cleanup = () => {
          hd.removeEventListener("pointermove", move); hd.removeEventListener("pointerup", up); hd.removeEventListener("pointercancel", cancel);
        };
        const up = () => {
          cleanup();
          if (to !== from) { const [x] = cur.splice(from, 1); cur.splice(to, 0, x); msg = ""; E.sfx("tap"); }
          selected = -1;
          draw();
        };
        const cancel = () => { cleanup(); draw(); };
        hd.addEventListener("pointermove", move); hd.addEventListener("pointerup", up); hd.addEventListener("pointercancel", cancel);
      };
    };
    draw();
    document.querySelector(".se-ui").onclick = async e => {
      if (busy || over || c.live?.() === false) return;
      const v = e.target.closest("[data-trv]");
      if (v) { tr = v.dataset.trv === "1"; G.set.docTr = tr; E.save(); E.sfx("tap"); return draw(); }
      const item = e.target.closest("[data-select]");
      if (item) {
        const target = +item.dataset.select;
        if (selected < 0) selected = target;
        else if (selected === target) selected = -1;
        else { const [x] = cur.splice(selected, 1); cur.splice(target, 0, x); selected = -1; msg = ""; E.sfx("tap"); }
        return draw();
      }
      if (e.target.closest("[data-chk]")) {
        busy = true; tries++;
        const wrong = cur.filter((k, p) => k !== p).length;
        if (!wrong) { E.ui.fx("solve"); await E.verdict?.(true, nat({ en: "Right order!", vi: "Đúng thứ tự!" })); if (over || c.live?.() === false) return; over = true; E.ui.clear(); E.add("puzzles", 1); if (O.ok) c.push("order", "ok"); return res(); }
        E.ui.fx("shake");
        if (O.tries && tries >= O.tries) { await E.verdict?.(false, nat({ en: "Out of tries", vi: "Hết lượt" })); if (over || c.live?.() === false) return; over = true; E.ui.clear(); if (O.fail) c.push("order", "fail"); return res(); }
        msg = `<div class="se-hint no">${esc(nat({ en: `${wrong} in the wrong place.`, vi: `${wrong} ô chưa đúng chỗ.` }))}${O.tries ? ` ${esc(nat({ en: `${O.tries - tries} tries left.`, vi: `Còn ${O.tries - tries} lần thử.` }))}` : ""}</div>`;
        busy = false; draw();
      }
    };
    E.autoRun(() => { cur = O.items.map((_, i) => i); draw(); document.querySelector("[data-chk]").click(); });
  }));

  // ───────── GÕ CHỮ (mật khẩu, tin nhắn, điền mẫu) — chấm mềm: sai 1 ký tự / từ vẫn nhận, báo chỗ sai ─────────
  // { type: { prompt, ph, accept: ["..."], near: true, ok, fail, tries, hint } }
  const lev = (a, b) => { const d = Array.from({ length: a.length + 1 }, (_, i) => [i]); for (let j = 1; j <= b.length; j++) d[0][j] = j; for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); return d[a.length][b.length]; };
  const norm = s => String(s).toLowerCase().replace(/[’']/g, "'").replace(/[^\p{L}\p{N}' ]+/gu, " ").replace(/\s+/g, " ").trim();
  def("type", (c) => new Promise(res => {
    const Y = c.st.type; let tries = 0, value = "", busy = false, over = false;
    c.onCancel?.(() => { over = busy = true; res(); });
    // đáp án cho bộ kiểm “khỉ bấm” (tools/games/_lib/story/cover.js) — gõ đúng để đi tiếp, không phải người chơi thấy
    globalThis.__seAns = Y.accept?.[0];
    E.ui.hideBox();
    const draw = (msg = "") => {
      const el = E.ui.panel(`<div class="se-ask">${esc(L(Y.prompt))}</div><input class="se-in big" data-in autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="${esc(L(Y.prompt))}" placeholder="${esc(L(Y.ph) || "")}" value="${esc(value)}">${msg}<button class="se-btn pri wide" data-ok>${esc(nat({ en: "Send", vi: "Gửi" }))}</button>`, "typep");
      const inp = el.querySelector("[data-in]");
      inp.oninput = () => { value = inp.value; };
      setTimeout(() => { if (!inp.isConnected || over || c.live?.() === false) return; inp.focus({ preventScroll: true }); inp.setSelectionRange(inp.value.length, inp.value.length); }, 50);
      inp.onkeydown = e => { if (e.key === "Enter") { e.preventDefault(); check(inp.value); } };
      el.querySelector("[data-ok]").onclick = () => check(inp.value);
    };
    const check = async v => {
      if (busy || over || c.live?.() === false) return; busy = true;
      value = String(v ?? "");
      tries++;
      const got = norm(v), acc = Y.accept.map(norm);
      const exact = acc.includes(got);
      const near = !exact && Y.near !== false && acc.some(a => lev(a, got) <= Math.max(1, Math.floor(a.length / 12)));
      E.flash?.(document.querySelector(".se-ui [data-in]"), exact || near);
      if (exact || near) {
        await E.verdict?.(true, nat({ en: "Correct!", vi: "Chính xác!" })); if (over || c.live?.() === false) return; over = true; E.ui.clear(); E.add("typed", 1);
        if (near) E.ui.toast(`${esc(nat({ en: "Almost! Correct spelling:", vi: "Gần đúng! Viết đúng là:" }))} <b>${esc(Y.accept[0])}</b>`, 3000);
        if (Y.ok) c.push("type", "ok"); return res();
      }
      E.ui.fx("shake");
      if (Y.tries && tries >= Y.tries) { await E.verdict?.(false, nat({ en: "Out of tries", vi: "Hết lượt" })); if (over || c.live?.() === false) return; over = true; E.ui.clear(); if (Y.fail) c.push("type", "fail"); return res(); }
      busy = false; draw(Y.hint && tries >= 2 ? `<div class="se-hint">${E.ICON.bulb}${esc(L(Y.hint))}</div>` : `<div class="se-hint no">${esc(nat({ en: "Not quite. Try again.", vi: "Chưa đúng. Thử lại." }))}</div>`);
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
