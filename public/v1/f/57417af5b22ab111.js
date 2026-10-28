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
  const optText = o => ({ main: E.fill(o[E.L] ?? o.en ?? ""), sub: E.fill(o[E.N] ?? "") });
  const L = (o) => nat(o);
  // nhãn kiểu câu (hỏi cung / giọng điệu): o.tag
  const TAGS = {
    open: { en: "Open question", vi: "Câu hỏi mở" }, lead: { en: "Leading", vi: "Dẫn dắt" }, press: { en: "Pressure", vi: "Gây sức ép" },
    kind: { en: "Kind", vi: "Đồng cảm" }, bluff: { en: "Bluff", vi: "Tố khống" }, polite: { en: "Polite", vi: "Lịch sự" }, direct: { en: "Direct", vi: "Thẳng" }, lie: { en: "Lie", vi: "Nói dối" },
  };

  // ───────── cảnh, nhân vật, lời ─────────
  def("bg", async ({ st }) => E.ui.scene(st.bg));
  def("show", async ({ st }) => E.ui.show(st.show, st.at, st.face));
  def("hide", async ({ st }) => E.ui.hide(st.hide));
  def("n", async ({ st }) => { const t = E.narr(st.n); await E.ui.line({ kind: "n", ...t }); });
  def("think", async ({ st }) => { const t = E.narr(st.think); await E.ui.line({ kind: "think", ...t }); });
  def("say", async ({ st }) => {
    const who = st.say, ch = who === "me" ? null : E.S().chars[who];
    if (st.face && who !== "me" && E.R().cast[who]) E.ui.show(who, E.R().cast[who].at, st.face);
    // bạn nói tiếng mẹ đẻ với người cùng quê: say: "me", lang: "@N"
    const t = E.speech(st, who === "me" ? (st.lang ? { lang: st.lang } : null) : ch);
    await E.ui.line({ who, kind: "say", ...t, whisper: st.whisper, cls: st.phone ? "phone" : "", tag: st.phone ? "☎" : st.tag || "" });
  });

  // ───────── trạng thái ─────────
  def("set", async ({ st }) => { for (const k in st.set) E.flag(k, st.set[k]); });
  def("add", async ({ st }) => { for (const k in st.add) E.add(k, st.add[k]); });
  def("item", async ({ st }) => {
    const R = E.R(); if (R.items.includes(st.item)) return;
    R.items.push(st.item);
    const it = E.S().items[st.item];
    if (!st.quiet) { E.ui.toast(`<span class="se-ti">${E.ICON[it?.icon] || E.ICON.box}</span><span><small>${T("newItem")}</small><b>${esc(nat(it?.name))}</b></span>`, 2400, "item"); E.ui.dot(true); E.sfx("item"); E.haptic("LIGHT"); }
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
  def("fx", async ({ st }) => E.ui.fx(st.fx));
  // tranh minh hoạ khoảnh khắc lớn: { cg: "cg-sandal" } · { cg: null } = về cảnh
  def("cg", async ({ st }) => E.ui.cg(st.cg));
  // thẻ chương (viền điện ảnh, chữ hiện dần) / thẻ mốc thời gian ({ title } không có ch)
  def("title", async ({ st }) => {
    E.ui.hideBox(); E.ui.hide("*");
    const t = st.title;
    if (t.ch) E.R().ch = t.ch;
    E.sfx("title");
    await E.ui.card(t.ch
      ? `<div class="se-ct"><small>${esc(nat({ en: "Chapter " + t.ch, vi: "Chương " + t.ch }))}</small><b>${esc(tgt(t))}</b><em></em>${E.L !== E.N && tx2(t) ? `<i>${esc(tx2(t))}</i>` : ""}</div>`
      : `<div class="se-ct time"><b>${esc(tgt(t))}</b>${E.L !== E.N && tx2(t) ? `<i>${esc(tx2(t))}</i>` : ""}</div>`, t.ch ? 3600 : 2400, t.ch ? "chap" : "time");
  });
  const tx2 = t => (t[E.N] && t[E.N] !== t[E.L] ? E.fill(t[E.N]) : "");

  // ───────── LỰA CHỌN: giờ · khoá (lockHint) · trực giác (need: id sự thật) · đồ vật (item) · lặp (loop + once) ─────────
  def("choice", (c) => new Promise(res => {
    const { st, s } = c, R = E.R(), G = E.G();
    const list = [];
    st.choice.forEach((o, i) => {
      if (o.if && !cond(o.if, s)) return;
      if (o.once && R.used[c.key(i)]) return;
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
      const sub = E.G().set.mode !== "imm" && t.sub ? `<small>${esc(t.sub)}</small>` : "";
      const tag = o.intuition ? `<em class="se-int">✦ ${T("intuition")}</em>` : o.item ? `<em class="se-itag">${E.ICON[E.S().items[o.item]?.icon] || E.ICON.box}</em>` : o.tag ? `<em class="se-tag t-${esc(o.tag)}">${esc(nat(TAGS[o.tag] || { en: o.tag }))}</em>` : "";
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
        if (o.once) R.used[c.key(i)] = 1;
        E.apply(o);
        if (o.loop === false || (st.loop && !o.once)) {} // vòng lặp kết thúc ở lựa chọn không có once
        else if (st.loop) c.again();
        const t = optText(o);
        if (!/^\(/.test(t.main) && !o.silent) await E.ui.line({ who: "me", kind: "say", main: t.main, sub: t.sub, lang: E.L });
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
    if (E.auto) later(() => { const x = pick(usable); x ? finish(x.o, x.i) : finish(null); });
  }));

  // ───────── KHÁM PHÁ: điểm nóng trên cảnh + túi đồ (dùng đồ lên điểm, ghép 2 đồ) ─────────
  // spot: { id, x, y, label, then, clue, use: { <đồ>: [bước] }, if, hidden }  · story.combos: [{ a, b, make, then }]
  def("explore", (c) => new Promise(res => {
    const { st } = c, X = st.explore, R = E.R(), S = E.S();
    S.nodes.__combo = (S.combos || []).map(k => k.then || []);
    E.ui.hideBox();
    const vis = id => R.used[c.key("v", id)];
    const spots = X.spots.filter(sp => !sp.if || cond(sp.if, c.s));
    const found = () => spots.filter(sp => sp.clue && vis(sp.id)).length;
    const layer = document.querySelector(".se-spots");
    let hold = null;
    const draw = () => {
      layer.innerHTML = spots.map(sp => `<button class="se-spot${vis(sp.id) ? " seen" : ""}${sp.clue ? " clue" : ""}" data-sp="${sp.id}" style="left:${Math.max(10, Math.min(90, sp.x))}%;top:${Math.max(12, Math.min(64, sp.y))}%"><i></i><span>${esc(L(sp.label))}</span></button>`).join("");
      const n = found(), need = X.need ?? 0, ok = n >= need;
      const bag = R.items.map(id => `<button class="se-bi${hold === id ? " on" : ""}" data-it="${id}" title="${esc(nat(S.items[id]?.name))}">${E.ICON[S.items[id]?.icon] || E.ICON.box}</button>`).join("");
      E.ui.panel(`<div class="se-xg"><span>${esc(L(X.goal))}</span>${need ? `<b>${Math.min(n, need)}/${need}</b>` : ""}</div>
        ${hold ? `<div class="se-hold">${esc(nat({ en: "Using: ", vi: "Đang cầm: " }))}<b>${esc(nat(S.items[hold]?.name))}</b> — ${esc(nat({ en: "tap a spot or another item", vi: "chạm vào cảnh hoặc đồ khác" }))}</div>` : ""}
        <div class="se-bag">${bag}</div>
        <button class="se-btn pri${ok ? "" : " dim"}" data-done ${ok ? "" : "disabled"}>${esc(L(X.done) || T("cont"))}</button>`, "xp");
    };
    const finish = () => { layer.innerHTML = ""; E.ui.clear(); res(); };
    const runSpot = (sp, steps) => { layer.innerHTML = ""; E.ui.clear(); c.again(); steps(); res(); };
    const onSpot = id => {
      const i = X.spots.findIndex(s => s.id === id), sp = X.spots[i];
      if (hold) {
        const it = hold; hold = null;
        // dùng đúng đồ = tìm ra manh mối của điểm này (điểm có `use` chỉ tính là đã tìm khi dùng đồ)
        if (sp.use?.[it]) { R.used[c.key("v", id)] = 1; R.used[c.key("u", id)] = 1; return runSpot(sp, () => c.push("explore", "spots", i, "use", it)); }
        E.ui.toast(esc(nat(X.noUse || { en: "That doesn't help here.", vi: "Dùng ở đây không được." })));
        return draw();
      }
      if (!sp.use || R.used[c.key("u", id)]) R.used[c.key("v", id)] = 1;
      else R.used[c.key("t", id)] = 1;
      if (sp.then) runSpot(sp, () => c.push("explore", "spots", i, "then"));
      else draw();
    };
    const onItem = id => {
      if (!hold) { hold = id; E.ui.toast(`<b>${esc(nat(S.items[id]?.name))}</b><small>${esc(nat(S.items[id]?.desc))}</small>`, 2600); return draw(); }
      if (hold === id) { hold = null; return draw(); }
      const ci = (S.combos || []).findIndex(k => (k.a === hold && k.b === id) || (k.b === hold && k.a === id));
      hold = null;
      if (ci < 0) { E.ui.toast(esc(nat({ en: "These don't go together.", vi: "Hai thứ này không ghép được." }))); return draw(); }
      const k = S.combos[ci];
      if (k.make) { R.items = R.items.filter(x => x !== k.a && x !== k.b); R.items.push(k.make); E.ui.toast(`<small>${T("newItem")}</small><b>${esc(nat(S.items[k.make]?.name))}</b>`, 2400, "item"); }
      if (k.then) { layer.innerHTML = ""; E.ui.clear(); c.again(); R.stack.push({ n: "__combo", p: [ci], i: 0 }); return res(); }
      draw();
    };
    layer.onclick = e => { const b = e.target.closest("[data-sp]"); if (b) onSpot(b.dataset.sp); };
    draw();
    document.querySelector(".se-ui").onclick = e => {
      if (e.target.closest("[data-done]")) return finish();
      const it = e.target.closest("[data-it]"); if (it) onItem(it.dataset.it);
    };
    if (E.auto) later(() => {
      // thử dùng đồ đúng chỗ → ghép đồ → xem điểm chưa xem
      const u = spots.find(sp => sp.use && !R.used[c.key("u", sp.id)] && Object.keys(sp.use).some(it => R.items.includes(it)));
      if (u) { hold = Object.keys(u.use).find(it => R.items.includes(it)); return onSpot(u.id); }
      const k = (S.combos || []).find(k => R.items.includes(k.a) && R.items.includes(k.b));
      if (k) { hold = k.a; return onItem(k.b); }
      const nx = spots.find(sp => !vis(sp.id) && !R.used[c.key("t", sp.id)]);
      nx ? onSpot(nx.id) : finish();
    });
  }));

  // ───────── SUY LUẬN: câu hỏi của vụ án → chọn 2 manh mối (đồ vật / ghi chú trong hồ sơ) → nối ─────────
  // { deduce: { q, a: [id, id] (không cần thứ tự) | [[id,id], [id,id]] (nhiều cặp đúng), hint, tries, ok, fail } }
  def("deduce", (c) => new Promise(res => {
    const D = c.st.deduce, R = E.R(), S = E.S();
    const pairs = Array.isArray(D.a[0]) ? D.a : [D.a];
    let sel = [], tries = 0;
    E.ui.hideBox();
    const draw = (msg = "") => {
      const el = E.ui.panel(`<div class="se-dd"><div class="se-ddh">${E.ICON.bulb}<small>${esc(nat({ en: "Deduction", vi: "Suy luận" }))}</small></div><b class="se-ddq">${esc(L(D.q))}</b><p class="se-mute">${esc(nat({ en: "Connect two clues from your case file.", vi: "Nối 2 manh mối trong hồ sơ." }))}</p></div>
        <div class="se-ddg">${R.items.map(id => `<button class="se-ddc${sel.includes(id) ? " on" : ""}" data-c="${id}"><span>${E.ICON[S.items[id]?.icon] || E.ICON.box}</span><b>${esc(nat(S.items[id]?.name))}</b><small>${esc(nat(S.items[id]?.desc))}</small></button>`).join("")}</div>
        ${msg}<button class="se-btn pri wide${sel.length === 2 ? "" : " dim"}" data-go ${sel.length === 2 ? "" : "disabled"}>${esc(nat({ en: "Connect", vi: "Nối lại" }))}</button>`, "deduce");
      el.onclick = e => {
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
      draw(`<div class="se-hint no">${esc(nat({ en: "Those two don't explain it.", vi: "Hai thứ đó không giải thích được." }))}${D.hint && tries >= 2 ? `<p>💡 ${esc(L(D.hint))}</p>` : ""}</div>`);
    };
    draw();
    if (E.auto) later(() => { sel = [...pairs[0]].filter(id => R.items.includes(id)); if (sel.length === 2) check(); else { E.ui.clear(); if (D.fail) c.push("deduce", "fail"); res(); } });
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
    if (E.auto) later(() => { const x = pick(ps.filter(({ p }) => !(p.need && !cond(p.need, s)))); if (x) go(x.i); else res(); });
  }));

  // ───────── PHIÊN DỊCH: e2v = nghe tiếng học → chọn cách nói lại bằng tiếng mẹ đẻ · v2e = ngược lại ─────────
  // { interpret: { dir: "v2e"|"e2v", to, prompt, key, opts: [{ t, acc: 0|1|2, set, add, then }], why } }
  def("interpret", (c) => new Promise(res => {
    const { st } = c, I = st.interpret, R = E.R(), G = E.G();
    const src = R.last || { text: "" };
    const outLang = I.dir === "e2v" ? E.N : E.L;
    const tOf = o => E.fill(typeof o.t === "string" ? o.t : o.t?.[outLang] ?? o.t?.en ?? "");
    const order = shuffle(I.opts, c.key());
    E.ui.hideBox();
    const head = I.dir === "rec" ? nat({ en: "Write it in your notebook", vi: "Ghi vào sổ tay" }) : I.dir === "e2v" ? nat({ en: "Interpret into your language", vi: "Dịch cho người nghe" }) : nat({ en: "Interpret", vi: "Phiên dịch" });
    const el = E.ui.panel(`<div class="se-int-h">${E.ICON.pen}<b>${esc(head)}</b>${I.key ? `<em>${esc(L(I.prompt) || "")}</em>` : ""}</div>
      <blockquote class="se-src">${E.words(src.text, src.lang)}</blockquote>
      <div class="se-chs">${order.map(([o, i]) => `<button class="se-ch-b tr" data-i="${i}"><span>${esc(tOf(o))}</span></button>`).join("")}</div>`, "interp" + (I.key ? " key" : ""));
    let done = false;
    const go = async i => {
      if (done) return; done = true;
      const o = I.opts[i], best = I.opts.reduce((a, b) => ((b.acc || 0) > (a.acc || 0) ? b : a));
      E.ui.clear();
      E.add("acc", o.acc || 0); E.add("accN", 2);
      R.notes.push({ ch: R.ch, dir: I.dir, src: src.text, srcLang: src.lang, pick: tOf(o), best: tOf(best), acc: o.acc || 0, why: I.why || null });
      E.apply(o);
      await E.ui.line({ who: "me", kind: "say", main: tOf(o), lang: outLang, tag: I.dir === "rec" ? nat({ en: "notebook", vi: "sổ tay" }) : I.dir === "e2v" ? "→ " + E.cname(E.S().chars[I.to] || {}, true) : nat({ en: "interpreting", vi: "dịch" }), cls: I.dir === "rec" ? "note" : "interp" });
      if (G.set.mode === "easy" || E.auto) {
        const a = o.acc || 0, lab = a === 2 ? nat({ en: "Accurate", vi: "Chính xác" }) : a === 1 ? nat({ en: "Close", vi: "Gần đúng" }) : nat({ en: "Meaning changed", vi: "Lệch nghĩa" });
        if (!E.auto) await feedback(`<div class="se-fb a${a}"><b>${a === 2 ? "✓" : a === 1 ? "≈" : "✗"} ${esc(lab)}</b>${a < 2 ? `<p>${esc(nat({ en: "Better:", vi: "Nên dịch:" }))} <i>${esc(tOf(best))}</i></p>` : ""}${I.why ? `<p>${esc(L(I.why))}</p>` : ""}</div>`);
      } else E.sfx("page");
      if (o.then) c.push("interpret", "opts", i, "then");
      res();
    };
    el.onclick = e => { const b = e.target.closest("[data-i]"); if (b) go(+b.dataset.i); };
    if (E.auto) later(() => go(pick(order)[1]));
  }));
  const feedback = (html) => new Promise(r => { const el = E.ui.panel(`${html}<button class="se-btn pri wide" data-ok>${T("cont")}</button>`, "fbk"); el.onclick = e => { if (e.target.closest("[data-ok]")) { E.ui.clear(); r(); } }; });
  E.feedback = feedback;

  // ───────── VẠCH LỜI KHAI: chạm dòng sai → đưa bằng chứng; ký = kết thúc ─────────
  def("present", (c) => new Promise(res => {
    const { st, s } = c, P = st.present, R = E.R(), S = E.S();
    E.ui.hideBox();
    let sel = -1;
    const fixed = i => R.used[c.key("fix", i)];
    const draw = () => {
      E.ui.panel(`<div class="se-doc"><div class="se-doch">${E.ICON.doc}<b>${esc(L(P.title))}</b></div>
        <div class="se-xg sm"><span>${esc(L(P.goal))}</span></div>
        ${P.segs.map((g, i) => `<button class="se-seg-l${sel === i ? " on" : ""}${fixed(i) ? " fixed" : ""}" data-s="${i}" ${fixed(i) ? "disabled" : ""}>${esc(E.fill(fixed(i) && g.fix ? g.fix : g.t))}</button>`).join("")}
        </div>
        ${sel >= 0 ? `<div class="se-ev"><small>${esc(nat({ en: "Show evidence:", vi: "Đưa bằng chứng:" }))}</small><div class="se-bag">${R.items.map(id => `<button class="se-bi lg" data-ev="${id}"><span>${E.ICON[S.items[id]?.icon] || E.ICON.box}</span><small>${esc(nat(S.items[id]?.name))}</small></button>`).join("")}</div></div>` : ""}
        <button class="se-btn" data-sign>${esc(L(P.sign) || "OK")}</button>`, "present");
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
      if (e.target.closest("[data-sign]")) { E.ui.clear(); return res(); }
      const sg = e.target.closest("[data-s]"); if (sg) { sel = +sg.dataset.s === sel ? -1 : +sg.dataset.s; return draw(); }
      const ev = e.target.closest("[data-ev]"); if (ev) onEv(ev.dataset.ev);
    };
    if (E.auto) later(() => {
      const i = P.segs.findIndex((g, k) => !fixed(k) && cond(g.bad, s));
      if (i < 0) { E.ui.clear(); return res(); }
      sel = i; onEv(P.segs[i].evidence || R.items[0]);
    });
  }));

  // ───────── NGHE (không chữ) + CÂU HỎI ─────────
  const qflow = (c, Q, withAudio) => new Promise(res => {
    const R = E.R();
    let qi = 0, plays = 0, right = 0;
    const draw = (msg = "") => {
      const q = Q.qs[qi];
      E.ui.panel(`${withAudio ? `<div class="se-au"><button class="se-play" data-play>${E.ICON.spk}</button><div><b>${esc(nat({ en: "Voice message", vi: "Tin nhắn thoại" }))}</b><small>${esc(nat({ en: "No text — listen carefully.", vi: "Không có chữ — nghe thật kỹ." }))} ${plays ? `· ${plays}×` : ""}</small></div><button class="se-btn sm" data-slow>${esc(nat({ en: "Slow", vi: "Chậm" }))}</button></div>` : ""}
        ${q ? `<div class="se-ask">${esc(L(q.q))}</div><div class="se-chs">${q.opts.map((o, i) => `<button class="se-ch-b" data-a="${i}"><span>${esc(E.fill(typeof o === "string" ? o : o[E.L] ?? o.en))}</span></button>`).join("")}</div>` : ""}
        ${msg}`, "listen");
    };
    const play = slow => { plays++; draw(); E.say(Q.audio, Q.who || "caller", { force: true, slow }); };
    const answer = async i => {
      const q = Q.qs[qi], ok = i === q.a;
      if (ok) { right++; E.apply(q); }
      document.querySelectorAll(".se-ui [data-a]").forEach((b, k) => b.classList.add(k === q.a ? "ok" : k === i ? "no" : "dim"));
      await new Promise(r => setTimeout(r, E.auto ? 1 : 900));
      qi++;
      if (qi < Q.qs.length) return draw();
      E.add("qRight", right); E.add("qN", Q.qs.length);
      if (E.auto) {}
      else if (withAudio) {
        // hết câu hỏi → hiện lời gốc + nghĩa (học từ chính đoạn vừa nghe)
        await feedback(`<div class="se-fb"><b>${right}/${Q.qs.length}</b><p class="se-tsc">${E.words(Q.audio, E.L)}</p>${Q.tr?.[E.N] ? `<p class="se-mute">${esc(Q.tr[E.N])}</p>` : ""}</div>`);
      } else if (!E.auto) await feedback(`<div class="se-fb"><b>${right}/${Q.qs.length}</b></div>`);
      E.ui.clear(); res();
    };
    draw();
    document.querySelector(".se-ui").onclick = e => {
      if (e.target.closest("[data-play]")) return play(false);
      if (e.target.closest("[data-slow]")) return play(true);
      const a = e.target.closest("[data-a]"); if (a && !a.classList.contains("ok") && !a.classList.contains("no")) answer(+a.dataset.a);
    };
    if (withAudio && !E.auto) setTimeout(() => play(false), 400);
    if (E.auto) { const tick = () => { if (qi < Q.qs.length) { answer(Q.qs[qi].a); setTimeout(tick, 10); } }; later(tick); }
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
    if (E.auto) later(() => { ans.forEach((ch, i) => (cur[i] = Math.max(0, set.indexOf(ch)))); document.querySelector("[data-try]")?.click(); });
  }));

  // ───────── XẾP THỨ TỰ (dòng thời gian, các bước, câu đảo) ─────────
  // { order: { prompt, items: [{ t, tag? }] (đúng thứ tự), ok, fail, tries } } — chạm 1 ô rồi chạm ô khác = đổi chỗ
  def("order", (c) => new Promise(res => {
    const O = c.st.order;
    let cur = shuffle(O.items, c.key()).map(([, i]) => i);
    if (cur.every((v, i) => v === i)) cur.reverse();
    let sel = -1, tries = 0;
    E.ui.hideBox();
    const txt = it => E.fill(typeof it.t === "string" ? it.t : it.t[E.L] ?? it.t.en);
    const draw = (msg = "") => E.ui.panel(`<div class="se-ask">${esc(L(O.prompt))}</div><div class="se-ord">${cur.map((k, p) => `<button class="se-oi${sel === p ? " on" : ""}" data-p="${p}"><em>${O.items[k].tag ? esc(O.items[k].tag) : p + 1}</em><span>${E.words(txt(O.items[k]), E.L)}</span></button>`).join("")}</div>${msg}<button class="se-btn pri wide" data-chk>${esc(nat({ en: "Check", vi: "Kiểm tra" }))}</button>`, "orderp");
    draw();
    document.querySelector(".se-ui").onclick = e => {
      if (e.target.closest(".w")) return;
      const b = e.target.closest("[data-p]");
      if (b) { const p = +b.dataset.p; if (sel < 0) sel = p; else { [cur[sel], cur[p]] = [cur[p], cur[sel]]; sel = -1; } return draw(); }
      if (e.target.closest("[data-chk]")) {
        tries++;
        const wrong = cur.filter((k, p) => k !== p).length;
        if (!wrong) { E.ui.fx("solve"); E.ui.clear(); E.add("puzzles", 1); if (O.ok) c.push("order", "ok"); return res(); }
        E.ui.fx("shake");
        if (O.tries && tries >= O.tries) { E.ui.clear(); if (O.fail) c.push("order", "fail"); return res(); }
        draw(`<div class="se-hint no">${esc(nat({ en: `${wrong} in the wrong place.`, vi: `${wrong} ô chưa đúng chỗ.` }))}</div>`);
      }
    };
    if (E.auto) later(() => { cur = O.items.map((_, i) => i); draw(); document.querySelector("[data-chk]").click(); });
  }));

  // ───────── GÕ CHỮ (mật khẩu, tin nhắn, điền mẫu) — chấm mềm: sai 1 ký tự / từ vẫn nhận, báo chỗ sai ─────────
  // { type: { prompt, ph, accept: ["..."], near: true, ok, fail, tries, hint } }
  const lev = (a, b) => { const d = Array.from({ length: a.length + 1 }, (_, i) => [i]); for (let j = 1; j <= b.length; j++) d[0][j] = j; for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); return d[a.length][b.length]; };
  const norm = s => String(s).toLowerCase().replace(/[’']/g, "'").replace(/[^\p{L}\p{N}' ]+/gu, " ").replace(/\s+/g, " ").trim();
  def("type", (c) => new Promise(res => {
    const Y = c.st.type; let tries = 0;
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
    if (E.auto) later(() => check(Y.accept[0]));
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
    G.endings[id] = G.endings[id] || Date.now(); R.done = id; E.save();
    if (E.auto) { document.title = "END:" + id; console.log("[story] END", id, JSON.stringify(R.f)); return; }
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
      ${S.next ? `<p class="se-next">${esc(nat(S.next))} — ${esc(nat({ en: "coming soon", vi: "sắp ra mắt" }))}</p>` : ""}
      <div class="se-col"><button class="se-btn pri" data-f>${T("flow")}</button><button class="se-btn" data-b>${T("notebook")}</button><button class="se-btn" data-t>${esc(nat({ en: "Title screen", vi: "Màn hình chính" }))}</button></div>
    </div>`, "full end");
    el.onclick = e => {
      if (e.target.closest("[data-f]")) E.ui.flowSheet();
      if (e.target.closest("[data-b]")) E.ui.book("truths");
      if (e.target.closest("[data-t]")) { E.stop(); E.ui.title(); }
    };
  }));
})();
