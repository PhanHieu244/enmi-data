// Enmi Story Engine — LÕI dùng chung cho mọi game cốt truyện (trinh thám, trùng sinh, kinh dị…).
// Truyện = dữ liệu (globalThis.TIQ_STORY hoặc truyền vào boot). Mỗi bước (step) là 1 object; khoá đầu tiên trùng tên
// cơ chế đã đăng ký (StoryEngine.def) quyết định cách chạy. Cơ chế ở mech.js — thêm cơ chế mới = thêm 1 def, không sửa lõi.
// Trạng thái: G = chung mọi lần chơi (sự thật, kết thúc, điểm chơi lại, sổ từ, cài đặt) · R = lần chơi hiện tại (cờ, đồ, ngăn xếp bước).
// Lưu: localStorage (chạy riêng) + Enmi Game SDK nếu có (globalThis.EnmiGame — chạy trong app).
(() => {
  const E = (globalThis.StoryEngine = {});
  const MECH = {};
  E.def = (k, fn) => (MECH[k] = fn);
  E.mech = MECH;
  const clone = o => JSON.parse(JSON.stringify(o));
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  E.esc = esc;
  // Trong app: chạy trong iframe sandbox của Enmi Game SDK (tools/../mobile/game/host.js) — KHÔNG có localStorage,
  // dữ liệu = 1 object lưu qua Enmi.load() / Enmi.save() (≤ 64 KB). Chạy riêng (thử trên trình duyệt) → localStorage.
  const SDK = () => globalThis.Enmi || null;
  let MEM = null, ft = 0;
  // gọn để vừa 64 KB: nhật ký lời thoại chỉ giữ 40 dòng cuối, ảnh chụp ở các mốc (cps) bỏ nhật ký
  const slim = m => JSON.parse(JSON.stringify(m, (k, v) => (k === "log" && Array.isArray(v) ? v.slice(-40) : v)));
  const flush = () => { clearTimeout(ft); ft = setTimeout(() => {
    try {
      const d = slim(MEM);
      for (const id in d[KEY + ".g"]?.cps || {}) d[KEY + ".g"].cps[id].log = [];
      SDK().save(d).catch(() => {});
    } catch {}
  }, 400); };
  const store = {
    get(k, d) { if (MEM) return k in MEM ? JSON.parse(JSON.stringify(MEM[k])) : d; try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { if (MEM) { MEM[k] = v; return flush(); } try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
    del(k) { if (MEM) { delete MEM[k]; return flush(); } try { localStorage.removeItem(k); } catch {} },
  };
  const Q = new URLSearchParams(location.search);
  E.auto = Q.get("auto"); // chạy thử tự động: ?auto=1 (chọn đầu) · ?auto=r (ngẫu nhiên)
  const $ = (s, r = document) => r.querySelector(s);
  const h = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  E.h = h;

  let S, R, G, KEY, gen = 0;
  const NEW_G = () => ({ truths: {}, endings: {}, cps: {}, opts: {}, words: {}, seen: {}, set: { mode: "bi", voice: true, speed: 1, name: "An", g: "M" } });
  const NEW_R = () => ({ stack: [], f: {}, items: [], truths: {}, used: {}, notes: [], log: [], met: {}, scene: null, cast: {}, last: null, ch: 0 });

  // ───────── ngôn ngữ ─────────
  // L = thứ tiếng đang học (lời nhân vật) · N = ngôn ngữ gốc (dịch). Truyện ghi text dạng { en, easy, vi … }.
  E.L = "en"; E.N = "vi";
  const tx = (t, k) => (t == null ? "" : typeof t === "string" ? t : t[k] ?? "");
  const mode = () => G.set.mode; // imm = đắm chìm · bi = song hành · easy = dễ
  E.ui = { tr: k => tx(UI_TXT[k], E.N) || tx(UI_TXT[k], "en") || k };
  const T = E.ui.tr;
  // biến trong chữ: {name} + biến của truyện (S.vars: hàm (state, ngôn ngữ gốc) — vd. đại từ xưng hô riêng từng tiếng)
  const VARS = { name: () => G.set.name || "An" };
  const fill = s => String(s ?? "").replace(/\{(\w+)\}/g, (m, k) => (S.vars?.[k] ? S.vars[k](E.state(), E.N) : VARS[k] ? VARS[k]() : m));
  E.fill = fill;
  E.nat = t => fill(tx(t, E.N) || tx(t, "en")); // chữ theo ngôn ngữ gốc
  E.tgt = t => fill(tx(t, E.L)); // chữ theo thứ tiếng học
  // nhân vật nói tiếng gì: "@N" = tiếng mẹ đẻ của người chơi (người cùng quê) · "@L" / không ghi = thứ tiếng học · mã cụ thể = tiếng đó
  E.langOf = ch => (!ch?.lang || ch.lang === "@L" ? E.L : ch.lang === "@N" ? E.N : ch.lang);
  // tên nhân vật có thể theo ngôn ngữ gốc (người cùng quê mang tên quê người chơi): name: { vi: "Bảo", ja: "Kenta", … }
  E.cname = (ch, short) => { const n = (short && ch?.short) || ch?.name; return typeof n === "object" ? n[E.N] || n.en || Object.values(n)[0] : n || ""; };
  // lời nhân vật: nhân vật nói tiếng khác thứ tiếng học (vd. người cùng quê) → hiện đúng tiếng đó, phụ = nghĩa
  E.speech = (st, ch) => {
    const lang = E.langOf(ch);
    if (lang !== E.L) return { main: fill(tx(st, lang)), sub: fill(tx(st, lang === E.N ? E.L : E.N)), lang };
    const main = mode() === "easy" && st.easy ? st.easy : tx(st, E.L);
    return { main: fill(main), sub: fill(tx(st, E.N)), lang: E.L, alt: st.easy && mode() !== "easy" ? fill(st.easy) : "" };
  };
  E.narr = t => (mode() === "imm" ? { main: fill(tx(t, E.L)), sub: fill(tx(t, E.N)), lang: E.L } : { main: fill(tx(t, E.N)), sub: fill(tx(t, E.L)), lang: E.N });

  // ───────── trạng thái cho điều kiện trong truyện (s => …) ─────────
  E.state = () => ({
    f: R.f, items: R.items, has: id => R.items.includes(id), truth: id => !!G.truths[id],
    acc: () => (R.f.accN ? (R.f.acc || 0) / R.f.accN : 1), G, R,
  });
  E.flag = (k, v) => {
    R.f[k] = v;
    if (S.flow?.some(x => x.kind === "opt" && x.key === k && x.val === v)) G.opts[k + ":" + v] = 1;
  };
  E.add = (k, n) => { R.f[k] = (+R.f[k] || 0) + n; };
  E.apply = o => { if (!o) return; for (const k in o.set || {}) E.flag(k, o.set[k]); for (const k in o.add || {}) E.add(k, o.add[k]); };

  // ───────── lưu ─────────
  const saveG = () => store.set(KEY + ".g", G);
  const saveR = () => store.set(KEY + ".r", R);
  E.save = () => { saveR(); saveG(); };
  E.G = () => G; E.R = () => R; E.S = () => S;

  // ───────── chạy bước ─────────
  const walk = (frame) => { let a = S.nodes[frame.n]; for (const k of frame.p) a = a?.[k]; return Array.isArray(a) ? a : null; };
  const typeOf = st => Object.keys(st).find(k => MECH[k]);
  async function loop(my) {
    while (my === gen) {
      const fr = R.stack[R.stack.length - 1];
      if (!fr) { E.ui.toast(T("noMore")); return; }
      const arr = walk(fr);
      if (!arr || fr.i >= arr.length) { R.stack.pop(); continue; }
      const idx = fr.i, st = arr[idx], type = typeOf(st);
      saveR();
      fr.i++;
      if (!type) { console.warn("[story] bước lạ", st); continue; }
      const ctx = {
        st, type, s: E.state(), frame: fr, idx, path: [...fr.p, idx],
        push: (...keys) => { const p = [...fr.p, idx, ...keys]; if (walk({ n: fr.n, p })) R.stack.push({ n: fr.n, p, i: 0 }); },
        again: () => { fr.i = idx; },
        key: (...x) => [fr.n, ...fr.p, idx, ...x].join("."),
        live: () => my === gen,
      };
      try { await MECH[type](ctx); } catch (e) { console.error("[story] lỗi ở bước", type, st, e); }
    }
  }
  E.jump = n => { R.stack = [{ n, p: [], i: 0 }]; G.seen[n] = 1; };
  E.play = () => { const my = ++gen; E.ui.reset(); E.ui.restore(); loop(my); };
  E.stop = () => { gen++; };
  E.newRun = () => { R = NEW_R(); E.jump(S.start); E.save(); E.play(); };
  // chơi tiếp / chơi lại giữa chừng → “Chuyện đã qua” theo đúng nhánh của lần chơi đó, rồi mới chạy
  E.resume = async () => { if (E.recapList().length && !E.auto) await E.ui.recap(true); E.play(); };
  E.fromCp = id => { const snap = G.cps[id]; if (!snap) return; R = clone(snap); E.save(); E.resume(); };

  // ───────── TÓM TẮT theo nhánh ─────────
  // story.recap: [{ ch, if: (s) => …, t: { en, vi } }] — chỉ lấy ý mà điều kiện đúng với lần chơi hiện tại.
  // Ý chỉ đúng SAU một mốc: ghi when: "<id mốc cp>" (mốc đã qua trong lần chơi này) — hoặc dùng cờ trong if.
  E.recapList = (upTo = 99) => (S.recap || []).filter(x => (x.ch ?? 0) <= upTo && (!x.when || R.passed?.[x.when]) && (!x.if || (() => { try { return !!x.if(E.state()); } catch { return false; } })()));
  E.cp = id => { (R.passed ||= {})[id] = 1; G.cps[id] = clone(R); saveG(); };
  E.ui_recapHtml = (list) => {
    let ch = -1, out = "";
    for (const x of list) {
      if ((x.ch ?? 0) !== ch) { ch = x.ch ?? 0; out += `<div class="se-rch">${ch ? esc(E.nat({ en: "Chapter " + ch, vi: "Chương " + ch })) : esc(E.nat({ en: "Prologue", vi: "Mở đầu" }))}</div>`; }
      out += `<p class="se-rcp">${esc(E.nat(x.t))}</p>`;
    }
    return out;
  };
  E.hasRun = () => !!store.get(KEY + ".r", null)?.stack?.length;

  // ───────── giọng đọc (tạm: speechSynthesis; sau: file âm thanh soạn sẵn ở st.audio / char.voice) ─────────
  const F_RE = /female|zira|susan|hazel|samantha|karen|moira|tessa|libby|sonia|aria|jenny|emma|amy|serena|victoria|fiona|kate|ava|allison|hoaimy|linh|mai\b|an\b/i;
  const M_RE = /\bmale|david|mark|george|daniel|james|ryan|guy|alex|fred|tom\b|oliver|arthur|thomas|brian|christopher|eric|namminh|nam\b/i;
  let VOICES = [];
  const loadVoices = () => { try { VOICES = speechSynthesis.getVoices(); } catch {} };
  try { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; } catch {}
  const hash = s => { let x = 7; for (const c of String(s)) x = (x * 31 + c.charCodeAt(0)) >>> 0; return x; };
  E.hash = hash;
  function pickVoice(lang, g, seed) {
    const all = VOICES.filter(v => v.lang?.toLowerCase().startsWith(lang));
    if (!all.length) return null;
    const re = g === "F" ? F_RE : M_RE, other = g === "F" ? M_RE : F_RE;
    const pool = all.filter(v => re.test(v.name)).length ? all.filter(v => re.test(v.name)) : all.filter(v => !other.test(v.name)).length ? all.filter(v => !other.test(v.name)) : all;
    const gb = pool.filter(v => /GB|UK|British/i.test(v.lang + v.name));
    const p = gb.length && lang === "en" ? gb : pool;
    return p[hash(seed) % p.length];
  }
  E.voice = { busy: false };
  E.say = (text, who, opts = {}) => new Promise(res => {
    if (!G.set.voice && !opts.force) return res();
    if (E.auto) return res();
    try {
      speechSynthesis.cancel();
      const ch = who === "me" ? { g: G.set.g } : S.chars[who] || { g: "M" };
      const lang = opts.lang || E.langOf(ch);
      const u = new SpeechSynthesisUtterance(String(text).replace(/\[\[|\]\]/g, ""));
      const v = pickVoice(lang, ch.g, who + (lang === E.L ? "" : lang));
      if (v) u.voice = v;
      u.lang = v?.lang || (lang === "vi" ? "vi-VN" : "en-GB");
      u.rate = (ch.rate || 1) * (opts.slow ? 0.72 : 1) * (opts.whisper ? 0.92 : 1);
      u.pitch = ch.pitch || 1;
      u.volume = opts.whisper ? 0.55 : 1;
      u.onend = u.onerror = () => res();
      speechSynthesis.speak(u);
    } catch { res(); }
  });
  E.hush = () => { try { speechSynthesis.cancel(); } catch {} };

  // ───────── chữ có thể chạm (từ trong sổ / tra từ) ─────────
  E.words = (text, lang) => {
    if (lang !== E.L) return esc(String(text).replace(/\[\[|\]\]/g, ""));
    let i = 0, out = "";
    for (const part of String(text).split(/(\[\[[^\]]+\]\])/)) {
      if (!part) continue;
      const m = part.match(/^\[\[([^\]]+)\]\]$/);
      if (m) { out += `<span class="w gl" data-w="${esc(m[1].toLowerCase())}" style="--i:${i++}">${esc(m[1])}</span>`; continue; }
      for (const tok of part.split(/(\s+)/)) {
        if (!tok) continue;
        if (/^\s+$/.test(tok)) { out += tok; continue; }
        const core = tok.replace(/^[^\p{L}\p{N}']+|[^\p{L}\p{N}']+$/gu, "");
        const k = core.toLowerCase();
        const gl = S.words?.[k] ? " gl2" : "";
        out += core ? `<span class="w${gl}" data-w="${esc(k)}" style="--i:${i++}">${esc(tok)}</span>` : `<span class="w0" style="--i:${i++}">${esc(tok)}</span>`;
      }
    }
    return out;
  };

  // ───────── giao diện ─────────
  const UI_TXT = {
    tapNext: { en: "Tap to continue", vi: "Chạm để tiếp" },
    translate: { en: "Translate", vi: "Dịch" },
    hide: { en: "Hide", vi: "Ẩn" },
    log: { en: "Log", vi: "Nhật ký" },
    notebook: { en: "Case file", vi: "Hồ sơ" },
    flow: { en: "Story map", vi: "Sơ đồ nhánh" },
    settings: { en: "Settings", vi: "Cài đặt" },
    noMore: { en: "To be continued…", vi: "Còn tiếp…" },
    newItem: { en: "Added to your bag", vi: "Đã thêm vào túi" },
    newTruth: { en: "TRUTH UNCOVERED", vi: "SỰ THẬT MỚI" },
    items: { en: "Items", vi: "Đồ vật" },
    truths: { en: "Truths", vi: "Sự thật" },
    people: { en: "People", vi: "Nhân vật" },
    words: { en: "Words", vi: "Sổ từ" },
    you: { en: "You", vi: "Bạn" },
    cont: { en: "Continue", vi: "Tiếp tục" },
    newGame: { en: "New game", vi: "Chơi mới" },
    replayHere: { en: "Replay from here", vi: "Chơi lại từ đây" },
    locked: { en: "Not reached yet", vi: "Chưa tới" },
    unknown: { en: "Unexplored", vi: "Chưa khám phá" },
    trustHi: { en: "Trusts you", vi: "Tin bạn" },
    trustLo: { en: "Doubts you", vi: "Nghi ngờ bạn" },
    trustMid: { en: "Neutral", vi: "Bình thường" },
    intuition: { en: "Intuition", vi: "Trực giác" },
    save: { en: "Save word", vi: "Lưu từ" },
    saved: { en: "Saved", vi: "Đã lưu" },
    notInList: { en: "Full dictionary is available when you play inside Enmi.", vi: "Tra từ đầy đủ khi chơi trong app Enmi." },
    listen: { en: "Listen", vi: "Nghe" },
    close: { en: "Close", vi: "Đóng" },
    mode: { en: "Story language", vi: "Ngôn ngữ dẫn truyện" },
    m_imm: { en: "Immersion", vi: "Đắm chìm" }, m_imm_d: { en: "Everything in English. Tap Translate when stuck.", vi: "Toàn bộ bằng tiếng Anh. Bí thì bấm Dịch." },
    m_bi: { en: "Side by side", vi: "Song hành" }, m_bi_d: { en: "Narration in your language, characters speak English.", vi: "Lời dẫn tiếng Việt, nhân vật nói tiếng Anh." },
    m_easy: { en: "Easy", vi: "Dễ" }, m_easy_d: { en: "Simpler English, translation always shown, feedback after each translation.", vi: "Tiếng Anh dễ hơn, luôn hiện nghĩa, chấm ngay sau mỗi câu dịch." },
    voice: { en: "Voices", vi: "Giọng đọc" },
    on: { en: "On", vi: "Bật" }, off: { en: "Off", vi: "Tắt" },
    yourName: { en: "Your name", vi: "Tên của bạn" },
    gender: { en: "You are", vi: "Bạn là" }, male: { en: "Male", vi: "Nam" }, female: { en: "Female", vi: "Nữ" },
    start: { en: "Start", vi: "Bắt đầu" },
    menu: { en: "Menu", vi: "Menu" },
    restartConfirm: { en: "Start a new game? Truths, endings and the story map are kept.", vi: "Chơi lại từ đầu? Sự thật, kết thúc và sơ đồ nhánh vẫn được giữ." },
    endings: { en: "Endings", vi: "Kết thúc" },
  };
  E.UI_TXT = UI_TXT;
  let root, box, ui, stage, charsEl, top;
  const lineQ = { res: null, revealing: false };

  function build(host) {
    root = h(`<div class="se">
      <div class="se-stage"><div class="se-bg"></div><div class="se-fog"></div><div class="se-rain"></div><div class="se-chars"></div><div class="se-spots"></div><div class="se-vig"></div></div>
      <div class="se-top">
        <button class="se-ib" data-a="menu" aria-label="${T("menu")}">${ICON.menu}</button>
        <div class="se-loc"></div>
        <button class="se-ib" data-a="log" aria-label="${T("log")}">${ICON.log}</button>
        <button class="se-ib" data-a="book" aria-label="${T("notebook")}">${ICON.book}<i class="se-dot" hidden></i></button>
        <button class="se-ib" data-a="flow" aria-label="${T("flow")}">${ICON.flow}</button>
      </div>
      <div class="se-box" hidden>
        <div class="se-name"></div>
        <div class="se-txt"></div>
        <div class="se-sub" hidden></div>
        <div class="se-tools"><button data-a="tr">${T("translate")}</button><button data-a="re" aria-label="${T("listen")}">${ICON.spk}</button><span class="se-more">${ICON.next}</span></div>
      </div>
      <div class="se-ui"></div>
      <div class="se-card" hidden></div>
      <div class="se-sheet" hidden></div>
      <div class="se-toast"></div>
    </div>`);
    host.appendChild(root);
    box = $(".se-box", root); ui = $(".se-ui", root); stage = $(".se-stage", root); charsEl = $(".se-chars", root); top = $(".se-top", root);
    root.addEventListener("click", onClick);
    document.addEventListener("keydown", e => { if ((e.key === " " || e.key === "Enter") && lineQ.res && !$(".se-sheet:not([hidden])", root)) { e.preventDefault(); advance(); } });
  }
  function onClick(e) {
    const a = e.target.closest("[data-a]")?.dataset.a;
    const w = e.target.closest(".w[data-w]");
    if (w && !lineQ.revealing) { e.stopPropagation(); return wordPop(w.dataset.w, w); }
    if (a === "tr") { e.stopPropagation(); const sb = $(".se-sub", box); sb.hidden = !sb.hidden || !sb.textContent; return; }
    if (a === "re") { e.stopPropagation(); if (lineQ.cur) E.say(lineQ.cur.speak, lineQ.cur.who, { lang: lineQ.cur.lang, force: true, whisper: lineQ.cur.whisper }); return; }
    if (a === "menu") return E.ui.menu();
    if (a === "log") return E.ui.logSheet();
    if (a === "book") return E.ui.book();
    if (a === "flow") return E.ui.flowSheet();
    if (e.target.closest(".se-sheet,.se-ui button,.se-ui .se-card2,.se-top,.se-pop")) return;
    if (lineQ.res) advance();
  }
  function advance() {
    if (lineQ.revealing) { box.classList.add("done"); lineQ.revealing = false; clearTimeout(lineQ.t); return; }
    const r = lineQ.res; lineQ.res = null;
    $(".se-pop", root)?.remove();
    r?.();
  }

  // hiện 1 dòng (lời dẫn / suy nghĩ / lời thoại) → chờ chạm
  E.ui.line = ({ who = "", kind = "say", main, sub = "", lang = E.L, speak, tag = "", cls = "", whisper, alt }) => new Promise(res => {
    const ch = who === "me" ? { short: G.set.name, color: "#e8e3d6" } : S.chars[who];
    box.hidden = false;
    box.className = "se-box k-" + kind + (cls ? " " + cls : "") + (whisper ? " whisper" : "");
    const nm = $(".se-name", box);
    nm.hidden = kind !== "say";
    nm.innerHTML = kind === "say" ? `${esc(E.cname(ch, true) || who)}${tag ? `<small>${esc(tag)}</small>` : ""}` : "";
    nm.style.setProperty("--c", ch?.color || "#ccc");
    $(".se-txt", box).innerHTML = E.words(main, lang);
    const sb = $(".se-sub", box);
    sb.textContent = String(sub || "").replace(/\[\[|\]\]/g, "");
    sb.hidden = !(sub && mode() === "easy" && kind === "say");
    $("[data-a=tr]", box).hidden = !sub;
    $("[data-a=re]", box).hidden = kind !== "say";
    R.log.push({ who: kind === "say" ? who : "", kind, main, sub, lang });
    if (R.log.length > 300) R.log.splice(0, R.log.length - 300);
    if (kind === "say") { R.last = { who, text: main, lang, sub }; if (who !== "me") R.met[who] = 1; }
    lineQ.cur = { speak: speak ?? main, who, lang, whisper };
    // nhân vật đang nói sáng lên
    for (const el of charsEl.children) el.classList.toggle("talk", el.dataset.id === who);
    const n = $(".se-txt", box).querySelectorAll("[style*='--i']").length;
    box.classList.remove("done");
    void box.offsetWidth;
    box.classList.add("in");
    lineQ.revealing = true;
    const dur = Math.min(2600, n * 32 / (G.set.speed || 1)) + 120;
    lineQ.t = setTimeout(() => { lineQ.revealing = false; box.classList.add("done"); }, dur);
    if (kind === "say") E.say(speak ?? main, who, { lang, whisper });
    lineQ.res = res;
    if (E.auto) setTimeout(() => { lineQ.revealing = false; advance(); }, 5);
  });
  E.ui.hideBox = () => { box.hidden = true; };
  // bảng thao tác: gắn lớp “m-<loại>” lên gốc để CSS đổi sân khấu theo cơ chế (vd. khám phá → ẩn nhân vật)
  E.ui.panel = (html, cls = "") => { ui.innerHTML = ""; const el = h(`<div class="se-panel ${cls}">${html}</div>`); ui.appendChild(el); root.dataset.m = cls.split(" ")[0] || ""; return el; };
  E.ui.clear = () => { ui.innerHTML = ""; root.dataset.m = ""; };
  E.ui.toast = (html, ms = 2200, cls = "") => {
    const t = h(`<div class="se-t ${cls}">${html}</div>`);
    $(".se-toast", root).appendChild(t);
    setTimeout(() => t.classList.add("out"), ms);
    setTimeout(() => t.remove(), ms + 400);
  };
  E.ui.card = (html, ms = 2600) => new Promise(res => {
    const c = $(".se-card", root);
    c.innerHTML = html; c.hidden = false; c.classList.remove("out");
    let done = false;
    const fin = () => { if (done) return; done = true; c.classList.add("out"); setTimeout(() => { c.hidden = true; res(); }, 450); };
    c.onclick = fin;
    setTimeout(fin, E.auto ? 5 : ms);
  });
  E.ui.fx = k => { root.classList.remove("fx-" + k); void root.offsetWidth; root.classList.add("fx-" + k); setTimeout(() => root.classList.remove("fx-" + k), 900); };

  // cảnh + nhân vật
  E.ui.scene = id => {
    const sc = S.scenes[id] || { kind: id };
    R.scene = id;
    const bg = $(".se-bg", root);
    bg.className = "se-bg k-" + (sc.kind || id);
    bg.style.backgroundImage = sc.img ? `url("${sc.img}")` : "";
    bg.classList.toggle("img", !!sc.img);
    bg.innerHTML = sc.img ? "" : (globalThis.TIQ_ART?.[sc.kind] || "");
    $(".se-fog", root).classList.toggle("on", !!sc.fog);
    $(".se-rain", root).classList.toggle("on", !!sc.rain);
    $(".se-loc", root).textContent = E.nat(sc.name);
    bg.classList.remove("swap"); void bg.offsetWidth; bg.classList.add("swap");
  };
  const SIL = (c) => `<svg viewBox="0 0 200 300" class="se-sil"><defs><linearGradient id="g${c.replace("#", "")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c}" stop-opacity=".95"/><stop offset="1" stop-color="${c}" stop-opacity=".25"/></linearGradient></defs><path fill="url(#g${c.replace("#", "")})" d="M100 28c-27 0-44 21-44 49 0 21 10 38 25 46l-2 16c-38 8-62 30-67 70l-4 91h184l-4-91c-5-40-29-62-67-70l-2-16c15-8 25-25 25-46 0-28-17-49-44-49z"/></svg>`;
  E.ui.show = (id, at = "c", face = "") => {
    const ch = S.chars[id]; if (!ch) return;
    let el = charsEl.querySelector(`[data-id="${id}"]`);
    if (!el) {
      el = h(`<div class="se-ch" data-id="${id}"><div class="se-chi"></div><div class="se-tagn">${esc(E.cname(ch, true))}</div></div>`);
      el.style.setProperty("--c", ch.color || "#aaa");
      charsEl.appendChild(el);
      requestAnimationFrame(() => el.classList.add("on"));
    }
    el.dataset.at = at;
    el.dataset.face = face || "";
    const src = (face && ch.faces?.[face]) || ch.img;
    const inner = $(".se-chi", el);
    const want = src ? `img:${src}` : "sil";
    if (inner.dataset.k !== want) { inner.dataset.k = want; inner.innerHTML = src ? `<img src="${esc(src)}" alt="">` : SIL(ch.color || "#aaa"); }
    R.cast[id] = { at, face };
    R.met[id] = 1;
  };
  E.ui.hide = id => {
    const list = id === "*" ? [...charsEl.children] : [charsEl.querySelector(`[data-id="${id}"]`)].filter(Boolean);
    for (const el of list) { el.classList.remove("on"); setTimeout(() => el.remove(), 350); delete R.cast[el.dataset.id]; }
  };
  E.ui.reset = () => { ui.innerHTML = ""; box.hidden = true; $(".se-spots", root).innerHTML = ""; lineQ.res = null; E.hush(); };
  E.ui.restore = () => {
    charsEl.innerHTML = "";
    if (R.scene) E.ui.scene(R.scene);
    for (const id in R.cast) E.ui.show(id, R.cast[id].at, R.cast[id].face);
  };
  E.ui.dot = on => { $(".se-dot", root).hidden = !on; };

  // ───────── bảng (sheet) ─────────
  E.ui.sheet = (title, html, cls = "") => {
    const sh = $(".se-sheet", root);
    sh.className = "se-sheet " + cls;
    sh.innerHTML = `<div class="se-shbg" data-x></div><div class="se-shc"><div class="se-shh"><b>${esc(title)}</b><button class="se-ib" data-x aria-label="${T("close")}">${ICON.x}</button></div><div class="se-shb">${html}</div></div>`;
    sh.hidden = false;
    sh.onclick = e => { if (e.target.closest("[data-x]")) E.ui.closeSheet(); };
    return sh;
  };
  E.ui.closeSheet = () => { const sh = $(".se-sheet", root); sh.hidden = true; sh.innerHTML = ""; sh.onclose?.(); sh.onclose = null; };
  // “Chuyện đã qua” — gate = true: chờ người chơi bấm Tiếp tục (dùng khi chơi tiếp / chơi lại từ mốc)
  E.ui.recap = (gate) => new Promise(res => {
    const list = E.recapList();
    const sh = E.ui.sheet(E.nat({ en: "Previously…", vi: "Chuyện đã qua…" }), `<div class="se-recap">${E.ui_recapHtml(list) || `<p class="se-mute">—</p>`}</div>${gate ? `<button class="se-btn pri wide" data-x>${T("cont")}</button>` : ""}`, "tall");
    sh.onclose = res;
  });

  function wordPop(w, el) {
    $(".se-pop", root)?.remove();
    const g = S.words?.[w] || S.words?.[w.replace(/(es|s)$/, "")] || S.words?.[w.replace(/'s$/, "")];
    const sdk = SDK();
    if (!g && sdk?.lookup) { sdk.lookup(w); return; }
    const saved = !!G.words[w];
    const p = h(`<div class="se-pop"><div class="se-poph"><b>${esc(w)}</b><button class="se-ib sm" data-sp>${ICON.spk}</button></div>${g ? `<div class="se-popm">${esc(g[E.N] || g.vi || "")}</div>${g.ex ? `<div class="se-pope">${E.words(g.ex, E.L)}</div>` : ""}<button class="se-btn sm${saved ? " on" : ""}" data-sv>${saved ? "✓ " + T("saved") : T("save")}</button>` : `<div class="se-pope">${T("notInList")}</div>`}</div>`);
    root.appendChild(p);
    const r = el.getBoundingClientRect(), rr = root.getBoundingClientRect();
    p.style.left = Math.max(8, Math.min(rr.width - 268, r.left - rr.left - 40)) + "px";
    p.style.top = Math.max(60, r.top - rr.top - p.offsetHeight - 10) + "px";
    p.onclick = e => {
      e.stopPropagation();
      if (e.target.closest("[data-sp]")) E.say(w, "me", { force: true, lang: E.L });
      if (e.target.closest("[data-sv]") && g) { G.words[w] = Date.now(); saveG(); e.target.closest("[data-sv]").classList.add("on"); e.target.closest("[data-sv]").textContent = "✓ " + T("saved"); try { SDK()?.saveWord?.({ word: w, meaning: g.vi, example: g.ex }); } catch {} }
    };
    setTimeout(() => document.addEventListener("click", function off(e) { if (!p.contains(e.target)) { p.remove(); document.removeEventListener("click", off, true); } }, true), 0);
  }

  E.ui.logSheet = () => {
    const rows = R.log.slice(-120).map(l => {
      const ch = l.who === "me" ? { short: G.set.name, color: "#e8e3d6" } : S.chars[l.who];
      return `<div class="se-lg k-${l.kind}">${l.who ? `<b style="color:${ch?.color || "#ccc"}">${esc(E.cname(ch, true) || l.who)}</b>` : ""}<div>${E.words(l.main, l.lang)}</div>${l.sub ? `<details><summary>${T("translate")}</summary>${esc(String(l.sub).replace(/\[\[|\]\]/g, ""))}</details>` : ""}</div>`;
    }).join("");
    const sh = E.ui.sheet(T("log"), `<div class="se-log">${rows}</div>`, "tall");
    const b = $(".se-shb", sh); b.scrollTop = b.scrollHeight;
  };

  E.ui.book = (tab = "items") => {
    E.ui.dot(false);
    const tabs = ["items", "truths", "people", "words"].map(t => `<button class="se-tab${t === tab ? " on" : ""}" data-tab="${t}">${T(t)}</button>`).join("");
    let body = "";
    if (tab === "items") body = R.items.map(id => { const it = S.items[id]; return `<div class="se-it"><span class="se-iti">${ICON[it?.icon] || ICON.box}</span><div><b>${esc(E.nat(it?.name) || id)}</b><p>${esc(E.nat(it?.desc))}</p></div></div>`; }).join("") || `<p class="se-mute">—</p>`;
    if (tab === "truths") {
      const n = S.truthTotal || Object.keys(S.truths || {}).length;
      const ids = Object.keys(S.truths || {});
      body = `<p class="se-mute">${Object.keys(G.truths).length} / ${n}</p>` + Array.from({ length: n }, (_, i) => {
        const id = ids[i], t = id && S.truths[id], known = id && G.truths[id];
        return known ? `<div class="se-tr on"><span>T${i + 1}</span><div><b>${esc(E.nat(t.name))}</b><p>${esc(E.nat(t.text))}</p></div></div>` : `<div class="se-tr"><span>T${i + 1}</span><div><b>???</b></div></div>`;
      }).join("");
    }
    if (tab === "people") body = Object.keys(R.met).filter(id => S.chars[id] && !S.chars[id].hideInBook).map(id => {
      const c = S.chars[id], v = +R.f[id] || 0;
      const tr = id in R.f ? (v >= 2 ? T("trustHi") : v <= -1 ? T("trustLo") : T("trustMid")) : "";
      return `<div class="se-pp" style="--c:${c.color}"><div class="se-ppi">${SIL(c.color)}</div><div><b>${esc(E.cname(c))}</b><p>${esc(E.nat(c.role))}</p>${tr ? `<i>${tr}</i>` : ""}</div></div>`;
    }).join("");
    if (tab === "words") body = Object.keys(G.words).length ? Object.keys(G.words).map(w => { const g = S.words?.[w]; return `<div class="se-wd"><b>${esc(w)}</b><span>${esc(g?.[E.N] || g?.vi || "")}</span></div>`; }).join("") : `<p class="se-mute">${E.nat({ en: "Tap a highlighted word in the story to save it.", vi: "Chạm vào từ được tô trong truyện để lưu." })}</p>`;
    const sh = E.ui.sheet(T("notebook"), `<div class="se-tabs">${tabs}</div><div class="se-bookb">${body}</div>`, "tall");
    sh.querySelectorAll("[data-tab]").forEach(b => (b.onclick = () => E.ui.book(b.dataset.tab)));
  };

  // sơ đồ nhánh: hàng theo row; điểm cp chạm = chơi lại từ đó
  E.ui.flowSheet = () => {
    const rows = {};
    for (const x of S.flow || []) (rows[(x.ch || 0) * 100 + x.row] ||= []).push(x);
    const keys = Object.keys(rows).map(Number).sort((a, b) => a - b);
    let lastCh = -1, html = "";
    for (const k of keys) {
      const ch = Math.floor(k / 100);
      if (ch !== lastCh) { html += `<div class="se-flch">${ch ? E.nat({ en: "Chapter " + ch, vi: "Chương " + ch }) : ""}</div>`; lastCh = ch; }
      html += `<div class="se-flr">${rows[k].map(x => {
        if (x.kind === "cp") { const on = !!G.cps[x.id]; return `<button class="se-fn cp${on ? " on" : ""}" ${on ? `data-cp="${x.id}"` : "disabled"}><b>${esc(E.nat(x.label))}</b>${on && x.sum ? `<span class="se-fsum">${esc(E.nat(x.sum))}</span>` : ""}<small>${on ? "↺ " + T("replayHere") : T("locked")}</small></button>`; }
        if (x.kind === "end" && G.endings[x.id] && S.endings?.[x.id]?.sum) return `<div class="se-fn end on"><b>${esc(E.nat(x.label))}</b><span class="se-fsum">${esc(E.nat(S.endings[x.id].sum))}</span><small>${T("endings")}</small></div>`;
        if (x.kind === "opt") { const on = !!G.opts[x.key + ":" + x.val]; return `<div class="se-fn opt${on ? " on" : ""}">${on ? esc(E.nat(x.label)) : "?"}</div>`; }
        if (x.kind === "end") { const on = !!G.endings[x.id]; return `<div class="se-fn end${on ? " on" : ""}"><b>${on ? esc(E.nat(x.label)) : "???"}</b><small>${T("endings")}</small></div>`; }
        return "";
      }).join("")}</div>`;
    }
    const t = Object.keys(G.truths).length, n = S.truthTotal || 0;
    const sh = E.ui.sheet(T("flow"), `<p class="se-mute">${T("truths")}: ${t}/${n} · ${T("endings")}: ${Object.keys(G.endings).length}</p><div class="se-flow">${html}</div>`, "tall");
    sh.querySelectorAll("[data-cp]").forEach(b => (b.onclick = () => { E.ui.closeSheet(); E.stop(); E.ui.hide("*"); setTimeout(() => E.fromCp(b.dataset.cp), 50); }));
  };

  // menu + cài đặt + màn bắt đầu
  const setupHtml = (first) => `
    ${first ? `<label class="se-fl">${T("yourName")}<input class="se-in" data-name maxlength="16" value="${esc(G.set.name)}"></label>
    <div class="se-fl">${T("gender")}<div class="se-seg">${["M", "F"].map(g => `<button data-g="${g}" class="${G.set.g === g ? "on" : ""}">${T(g === "M" ? "male" : "female")}</button>`).join("")}</div></div>` : ""}
    <div class="se-fl">${T("mode")}${["imm", "bi", "easy"].map(m => `<button class="se-opt${G.set.mode === m ? " on" : ""}" data-m="${m}"><b>${T("m_" + m)}</b><small>${T("m_" + m + "_d")}</small></button>`).join("")}</div>
    <div class="se-fl">${T("voice")}<div class="se-seg">${[true, false].map(v => `<button data-v="${v}" class="${G.set.voice === v ? "on" : ""}">${T(v ? "on" : "off")}</button>`).join("")}</div></div>`;
  const bindSetup = (sh) => {
    sh.querySelectorAll("[data-g]").forEach(b => (b.onclick = () => { G.set.g = b.dataset.g; sh.querySelectorAll("[data-g]").forEach(x => x.classList.toggle("on", x === b)); saveG(); }));
    sh.querySelectorAll("[data-m]").forEach(b => (b.onclick = () => { G.set.mode = b.dataset.m; sh.querySelectorAll("[data-m]").forEach(x => x.classList.toggle("on", x === b)); saveG(); }));
    sh.querySelectorAll("[data-v]").forEach(b => (b.onclick = () => { G.set.voice = b.dataset.v === "true"; sh.querySelectorAll("[data-v]").forEach(x => x.classList.toggle("on", x === b)); saveG(); if (!G.set.voice) E.hush(); }));
    const n = sh.querySelector("[data-name]"); if (n) n.oninput = () => { G.set.name = n.value.trim() || "An"; saveG(); };
  };
  E.ui.menu = () => {
    const sh = E.ui.sheet(T("menu"), `<button class="se-btn wide" data-rc>${E.nat({ en: "Story so far", vi: "Tóm tắt truyện" })}</button>${setupHtml(false)}<div class="se-row"><button class="se-btn" data-new>${T("newGame")}</button><button class="se-btn" data-home>${E.nat({ en: "Title screen", vi: "Màn hình chính" })}</button>${SDK()?.close ? `<button class="se-btn" data-exit>${E.nat({ en: "Back to Enmi", vi: "Về Enmi" })}</button>` : ""}</div>`);
    bindSetup(sh);
    sh.querySelector("[data-rc]").onclick = () => E.ui.recap(false);
    // xác nhận = chạm lần 2 (iframe sandbox của app chặn confirm())
    const nb = sh.querySelector("[data-new]");
    nb.onclick = () => {
      if (!nb.dataset.ok) { nb.dataset.ok = 1; nb.classList.add("pri"); nb.textContent = E.nat({ en: "Tap again to restart", vi: "Chạm lần nữa để chơi lại" }); E.ui.toast(esc(T("restartConfirm")), 3200); return; }
      E.ui.closeSheet(); E.stop(); E.ui.hide("*"); E.newRun();
    };
    sh.querySelector("[data-home]").onclick = () => { E.ui.closeSheet(); E.stop(); E.save(); E.ui.title(); };
    const ex = sh.querySelector("[data-exit]"); if (ex) ex.onclick = () => { E.save(); setTimeout(() => SDK().close(), 450); };
  };
  E.ui.title = () => {
    E.ui.reset(); E.ui.hide("*");
    if (S.titleScene) E.ui.scene(S.titleScene);
    top.hidden = true;
    const has = E.hasRun();
    const t = Object.keys(G.truths).length;
    const el = E.ui.panel(`<div class="se-title">
      <div class="se-tt1">${esc(E.tgt(S.title))}</div>${E.nat(S.title) !== E.tgt(S.title) ? `<div class="se-tt2">${esc(E.nat(S.title))}</div>` : ""}
      ${S.tagline ? `<p class="se-tt3">${esc(E.nat(S.tagline))}</p>` : ""}
      <div class="se-col">
        ${has ? `<button class="se-btn pri" data-go="cont">${T("cont")}</button>` : ""}
        <button class="se-btn${has ? "" : " pri"}" data-go="new">${T("newGame")}</button>
        ${Object.keys(G.cps).length ? `<button class="se-btn" data-go="flow">${T("flow")}</button>` : ""}
        ${SDK()?.close ? `<button class="se-btn" data-go="exit">${E.nat({ en: "Back to Enmi", vi: "Về Enmi" })}</button>` : ""}
      </div>
      ${t ? `<p class="se-mute">${T("truths")}: ${t}/${S.truthTotal || "?"} · ${T("endings")}: ${Object.keys(G.endings).length}</p>` : ""}
    </div>`, "full");
    el.onclick = e => {
      const go = e.target.closest("[data-go]")?.dataset.go; if (!go) return;
      if (go === "exit") { E.save(); return setTimeout(() => SDK().close(), 450); }
      if (go === "cont") { top.hidden = false; E.ui.clear(); R = store.get(KEY + ".r", NEW_R()); E.resume(); }
      if (go === "flow") { R = store.get(KEY + ".r", NEW_R()); top.hidden = false; E.ui.flowSheet(); }
      if (go === "new") {
        const sh = E.ui.sheet(T("newGame"), `${setupHtml(true)}<button class="se-btn pri wide" data-st>${T("start")}</button>`);
        bindSetup(sh);
        sh.querySelector("[data-st]").onclick = () => { E.ui.closeSheet(); top.hidden = false; E.newRun(); };
      }
    };
    if (E.auto) { top.hidden = false; E.newRun(); }
  };

  const ICON = {
    menu: `<svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>`,
    log: `<svg viewBox="0 0 24 24"><path d="M5 5h14v14H5zM8 9h8M8 12h8M8 15h5"/></svg>`,
    book: `<svg viewBox="0 0 24 24"><path d="M6 4h11a1 1 0 0 1 1 1v15H7a2 2 0 0 1-2-2V5a1 1 0 0 1 1-1zM5 18a2 2 0 0 1 2-2h11M9 8h6"/></svg>`,
    flow: `<svg viewBox="0 0 24 24"><circle cx="6" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="12" r="2"/><path d="M6 7v10M6 12h4c2 0 3-0 6 0"/></svg>`,
    spk: `<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9zM16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/></svg>`,
    next: `<svg viewBox="0 0 24 24"><path d="M7 9l5 5 5-5"/></svg>`,
    x: `<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>`,
    box: `<svg viewBox="0 0 24 24"><path d="M4 8l8-4 8 4v8l-8 4-8-4zM4 8l8 4 8-4M12 12v8"/></svg>`,
    photo: `<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-8 8"/></svg>`,
    clock: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/></svg>`,
    card: `<svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="8.5" cy="12" r="2"/><path d="M13 10h5M13 14h4"/></svg>`,
    sandal: `<svg viewBox="0 0 24 24"><path d="M8 3c3 0 5 3 5 8s-1 10-4 10-4-3-4-9 0-9 3-9zM6 9h7M6 13h7"/></svg>`,
    pen: `<svg viewBox="0 0 24 24"><path d="M4 20l4-1 11-11-3-3L5 16zM14 6l3 3"/></svg>`,
    phone: `<svg viewBox="0 0 24 24"><rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/></svg>`,
    key: `<svg viewBox="0 0 24 24"><circle cx="8" cy="12" r="4"/><path d="M12 12h9M18 12v3M21 12v2"/></svg>`,
    doc: `<svg viewBox="0 0 24 24"><path d="M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h5"/></svg>`,
  };
  E.ICON = ICON;

  // ───────── khởi động ─────────
  E.boot = async (story, host = document.body) => {
    S = story;
    KEY = "se." + story.id;
    if (SDK()) { try { MEM = (await SDK().load()) || {}; } catch { MEM = {}; } if (typeof MEM !== "object") MEM = {}; }
    G = Object.assign(NEW_G(), store.get(KEY + ".g", {}));
    G.set = Object.assign(NEW_G().set, G.set);
    // ngôn ngữ: ?lang= (thử) → SDK của app → trình duyệt; chỉ nhận ngôn ngữ truyện đã có bản dịch (story.natives / story.learns)
    let sdk = null; try { sdk = SDK(); } catch {}
    const natives = story.natives || ["en"], learns = story.learns || ["en"];
    const want = Q.get("lang") || sdk?.lang || (navigator.language || "en").slice(0, 2);
    const wl = Q.get("learn") || sdk?.learn;
    E.L = learns.includes(wl) ? wl : learns[0];
    // ngôn ngữ gốc phải KHÁC thứ tiếng học (người Anh không học tiếng Anh) → lấy ngôn ngữ gốc đầu tiên khác
    const okN = natives.filter(n => n !== E.L);
    E.N = okN.includes(want) ? want : okN[0] || natives[0];
    document.documentElement.lang = E.N;
    R = NEW_R();
    build(host);
    if (Q.get("reset")) { G = NEW_G(); saveG(); store.del(KEY + ".r"); }
    if (Q.get("at")) { top.hidden = false; R = NEW_R(); E.jump(Q.get("at")); E.play(); return; }
    E.ui.title();
  };
})();
