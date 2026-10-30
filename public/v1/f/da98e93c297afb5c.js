// Enmi Story Engine — LÕI dùng chung cho mọi game cốt truyện (trinh thám, trùng sinh, kinh dị…).
// Truyện = dữ liệu (globalThis.TIQ_STORY hoặc truyền vào boot). Mỗi bước (step) là 1 object; khoá đầu tiên trùng tên
// cơ chế đã đăng ký (StoryEngine.def) quyết định cách chạy. Cơ chế ở mech.js — thêm cơ chế mới = thêm 1 def, không sửa lõi.
// Trạng thái: G = chung mọi lần chơi (sự thật, kết thúc, điểm chơi lại, sổ từ, cài đặt) · R = lần chơi hiện tại (cờ, đồ, ngăn xếp bước).
// Lưu: localStorage (chạy riêng) + Enmi Game SDK nếu có (globalThis.EnmiGame — chạy trong app).
(() => {
  const E = (globalThis.StoryEngine = {});
  const MECH = {};
  // ───────── TRUYỆN NHIỀU FILE: story.js (khung: nhân vật, cảnh, sự thật…) + ch1.js, ch2.js… (mỗi chương 1 file) ─────────
  //   StoryEngine.story({ … })     khung truyện (1 lần)
  //   StoryEngine.chapter({ … })   mỗi chương: nodes, recap, flow, endings + đồ vật / từ / nhân vật / cảnh MỚI của chương đó
  //   StoryEngine.boot()           ghép tất cả rồi chạy. Đối tượng → gộp khoá; mảng → nối.
  const OBJ = ["chars", "scenes", "items", "truths", "words", "nodes", "endings", "vars", "remember", "places", "talks", "docs", "tags", "stats", "events", "outfits"], ARR = ["recap", "flow", "combos"];
  let BASE = null; const PARTS = [];
  E.story = b => { BASE = b; };
  // chương nạp SAU khi đã chạy (tải lần lượt) → gộp thẳng vào truyện đang chạy
  E.chapter = p => { PARTS.push(p); if (S) { E.normNodes(p.nodes); E.normNodes(p.places); E.normNodes(p.talks); E.normNodes(p.events); for (const k in p) { if (OBJ.includes(k)) Object.assign((S[k] ||= {}), p[k]); else if (ARR.includes(k)) (S[k] ||= []).push(...p[k]); else S[k] = p[k]; } E.emit("chapter", p); } };
  // CHUẨN HOÁ BƯỚC (engine 3): cơ chế khai báo E.norm(tên, fn) → mọi bước tên đó được sửa 1 lần lúc nạp truyện / chương
  //   (vd. place sinh mảng bước con cho người đứng trong cảnh). Chạy TRƯỚC khi chạy bước → đường dẫn ngăn xếp (R.stack) luôn hợp lệ khi tải lại.
  const NORM = {};
  E.norm = (k, fn) => { NORM[k] = fn; };
  E.normNodes = nodes => {
    const seen = new Set();
    const w = o => {
      if (!o || typeof o !== "object" || seen.has(o)) return; seen.add(o);
      if (Array.isArray(o)) return o.forEach(w);
      for (const k in o) if (NORM[k] && !o.__n) { try { NORM[k](o); } catch (e) { console.error("[story] chuẩn hoá", k, e); } o.__n = 1; break; }
      for (const k in o) if (typeof o[k] === "object" && k !== "__n") w(o[k]);
    };
    w(nodes);
  };
  // ───────── TẢI CHƯƠNG LẦN LƯỢT ─────────
  // index.html chỉ nạp story.js + ch1.js bằng <script>; chương sau khai báo bằng thẻ ẩn <i hidden data-chapter="2" src="story/ch2.js"></i>
  //   (host Game SDK đổi src của MỌI phần tử trong HTML sang file trong gói → engine đọc lại src đã đổi; chạy riêng = đường dẫn thường).
  //   story.chapters[].start = node đầu của chương → nhảy tới node chưa có thì nạp đúng chương đó; vào chương N thì nạp sẵn chương N+1 ở nền.
  //   Lớp phủ bản dịch tương tự: <i hidden data-lang="de" src="story/lang/de.js"></i> — chỉ nạp thứ tiếng đang dùng.
  const LOADED = {};
  const loadSrc = (sel) => { const el = document.querySelector(sel); const src = el?.getAttribute("src"); if (!src) return Promise.resolve(false); if (LOADED[src]) return LOADED[src];
    return (LOADED[src] = new Promise(res => { const s = document.createElement("script"); s.src = src; s.onload = () => res(true); s.onerror = () => res(false); document.head.appendChild(s); })); };
  const addCss = href => { if (!href || LOADED[href]) return; LOADED[href] = 1; const l = document.createElement("link"); l.rel = "stylesheet"; l.href = href; document.head.appendChild(l); ART = null; };
  // TRUYỆN ALBUM: trong app, chương chưa tải (src chưa thành blob:) → xin app tải gói game.<mã>.chN (Enmi.chapter) rồi dùng đường dẫn app trả về.
  //   Chạy riêng (không có app) → file nằm sẵn cạnh index.html.
  const CHP = {};
  E.loadChapter = ch => CHP[ch] ||= (async () => {
    const el = document.querySelector(`[data-chapter="${ch}"]`); if (!el) return false;
    let src = el.getAttribute("src"), css = document.querySelector(`[data-chapter-css="${ch}"]`)?.getAttribute("href");
    const sdk = SDK();
    if (sdk?.chapter && !/^blob:/.test(src)) {
      E.ui.loading?.(ch, true);
      const r = await sdk.chapter(ch).catch(() => null);
      E.ui.loading?.(ch, false);
      if (!r?.ok) { delete CHP[ch]; E.ui.toast(esc(E.nat({ en: "Couldn't download the next chapter. Check your connection.", vi: "Chưa tải được chương tiếp theo. Kiểm tra kết nối mạng." })), 4000); return false; }
      src = r.urls?.[`story/ch${ch}.js`] || src; css = r.urls?.[`art-ch${ch}.css`] || css;
    }
    addCss(css);
    return new Promise(res => { const s = document.createElement("script"); s.src = src; s.onload = () => res(true); s.onerror = () => { delete CHP[ch]; res(false); }; document.head.appendChild(s); });
  })();
  E.loadLang = code => loadSrc(`[data-lang="${code}"]`);
  // số các chương khai báo trong index.html (thẻ <i data-chapter>) · chương 1 luôn nạp sẵn bằng <script>
  const chNums = () => [...document.querySelectorAll("[data-chapter]")].map(e => +e.dataset.chapter).sort((a, b) => a - b);
  // node chưa có: chương có start trùng → chương đó; không ghi start → chương KẾ TIẾP chưa nạp (chương luôn đi lần lượt)
  E.chapterOf = node => (S?.chapters || []).find(c => c.start === node)?.ch || chNums().find(n => !CHP[n]);
  // nạp mọi chương ≤ n (chơi tiếp / chơi lại từ mốc ở chương sau: cần đồ vật, sự thật, tóm tắt của các chương trước)
  E.loadUpTo = async n => { for (const c of chNums()) if (c <= n && !(await E.loadChapter(c))) return false; return true; };
  E.merge = (base, parts) => {
    const s = { ...base };
    for (const k of OBJ) s[k] = { ...(s[k] || {}) };
    for (const k of ARR) s[k] = [...(s[k] || [])];
    for (const p of parts) for (const k in p) {
      if (OBJ.includes(k)) Object.assign(s[k], p[k]);
      else if (ARR.includes(k)) s[k].push(...p[k]);
      else s[k] = p[k];
    }
    return s;
  };
  E.def = (k, fn) => (MECH[k] = fn);
  // KHOÁ PHỤ (engine 3): trường gắn thêm vào BẤT KỲ bước nào, chạy TRƯỚC bước chính — vd. { n: {…}, look: "sign" } (máy quay tới vùng),
  //   { say: "nell", shot: "act-tea" } (đổi khung hình). E.side(tên, async (giá trị, bước, ctx) => …). Thứ tự = thứ tự đăng ký.
  const SIDE = {};
  E.side = (k, fn) => { SIDE[k] = fn; };
  E.sides = SIDE;
  E.mech = MECH;
  // PHIÊN BẢN engine (semver). Truyện ghi engine: "2" (bản chính tối thiểu) — engine cũ hơn thì báo, không chạy bừa.
  //   Luật tương thích (docs/story-engine/TUONG-THICH.md): bản phụ / vá CHỈ THÊM, không đổi nghĩa bước / trường đã có.
  E.VERSION = "3.0.0";
  // SỰ KIỆN cho plugin: E.on("line" | "choice" | "scene" | "truth" | "item" | "meet" | "end" | "step" | "boot", fn)
  const EV = {};
  E.on = (k, fn) => { (EV[k] ||= []).push(fn); return () => (EV[k] = EV[k].filter(f => f !== fn)); };
  E.emit = (k, ...a) => { for (const f of EV[k] || []) { try { f(...a); } catch (e) { console.error("[story] plugin", k, e); } } };
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
      for (const ch in d[KEY + ".g"]?.chAt || {}) d[KEY + ".g"].chAt[ch].log = [];
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
  const NEW_G = () => ({ truths: {}, endings: {}, cps: {}, chDone: {}, chAt: {}, opts: {}, words: {}, seen: {}, known: {}, set: { mode: "bi", vDlg: true, vNarr: false, sfx: true, amb: true, speed: 1, name: "An", g: "M", tr: true, shadow: true } });
  const NEW_R = () => ({ stack: [], f: {}, items: [], truths: {}, used: {}, notes: [], log: [], met: {}, scene: null, cast: {}, last: null, ch: 0, path: [] });

  // ───────── ngôn ngữ ─────────
  // L = thứ tiếng đang học (lời nhân vật) · N = ngôn ngữ gốc (dịch). Truyện ghi text dạng { en, easy, vi … }.
  E.L = "en"; E.N = "vi";
  // BẢN DỊCH NGOÀI FILE (lớp phủ): story/lang/<mã>.js gọi StoryEngine.lines("<mã>", { <khoá câu>: "bản dịch" }) — khoá = E.lineKey(câu en).
  //   Truyện soạn 1 lần bằng en (+ vi); các thứ tiếng học khác (de, ja, zh, ko…) do công cụ dịch (lang-tool.js) đổ ra lớp phủ, KHÔNG sửa file chương.
  //   Ngôn ngữ gốc không có sẵn → app dịch lúc chạy (Enmi.translate) theo từng cảnh, đệm vào cùng bảng này.
  const LINES = {};
  E.lines = (code, map) => { Object.assign((LINES[code] ||= {}), map); };
  E.lineKey = en => { let x = 2166136261; for (const ch of String(en)) x = Math.imul(x ^ ch.codePointAt(0), 16777619) >>> 0; return x.toString(36); };
  E.LINES = LINES;
  const tx = (t, k) => (t == null ? "" : typeof t === "string" ? t : t[k] ?? (t.en && LINES[k] ? LINES[k][E.lineKey(t.en)] : undefined) ?? "");
  const mode = () => G.set.mode; // imm = đắm chìm · bi = song hành · easy = dễ
  E.ui = { tr: k => tx(UI_TXT[k], E.N) || tx(UI_TXT[k], "en") || k };
  const T = E.ui.tr;
  // biến trong chữ: {name} + biến của truyện (S.vars: hàm (state, ngôn ngữ gốc) — vd. đại từ xưng hô riêng từng tiếng)
  const VARS = { name: () => G.set.name || "An" };
  const fill = s => String(s ?? "").replace(/\{(\w+)\}/g, (m, k) => (S.vars?.[k] ? S.vars[k](E.state(), E.N) : VARS[k] ? VARS[k]() : m));
  E.fill = fill;
  E.nat = t => fill(tx(t, E.N) || tx(t, "en")); // chữ theo ngôn ngữ gốc
  E.tgt = t => (typeof t === "string" ? fill((E.L !== "en" && LINES[E.L]?.[E.lineKey(t)]) || t) : fill(tx(t, E.L) || tx(t, "en"))); // chữ theo thứ tiếng học (thiếu bản → tiếng Anh)
  E.tx = tx;
  // bản dịch theo ngôn ngữ gốc — rỗng nếu thiếu hoặc TRÙNG câu thứ tiếng học (không hiện bản trùng)
  E.sub = t => { if (t == null || typeof t !== "object") return ""; const a = tx(t, E.N), b = tx(t, E.L) || tx(t, "en"); return a && a !== b ? fill(a) : ""; };
  // nhân vật nói tiếng gì: "@N" = tiếng mẹ đẻ của người chơi (người cùng quê) · "@L" / không ghi = thứ tiếng học · mã cụ thể = tiếng đó
  E.langOf = ch => (!ch?.lang || ch.lang === "@L" ? E.L : ch.lang === "@N" ? E.N : ch.lang);
  // tên nhân vật có thể theo ngôn ngữ gốc (người cùng quê mang tên quê người chơi): name: { vi: "Bảo", ja: "Kenta", … }
  const cname0 = (ch, short) => { const n = (short && ch?.short) || ch?.name; return typeof n === "object" ? n[E.N] || n.en || Object.values(n)[0] : n || ""; };
  // NHÂN VẬT CHƯA GẶP: tên = alias (vd. “Cậu bé”) hoặc “???” tới khi nhân vật chính gặp / biết tên (E.known)
  E.cname = (ch, short) => { const id = ch && S?.chars ? Object.keys(S.chars).find(k => S.chars[k] === ch) : null; if (id && !E.known(id)) return ch.alias ? E.nat(ch.alias) : "???"; return cname0(ch, short); };
  E.cnameReal = cname0;
  // BIẾT nhân vật này chưa (trong lần chơi này): known: true (biết từ trước khi truyện bắt đầu) · đã gặp (R.met)
  //   reveal: "manual" = bước ra / nói vẫn GIẤU (bóng đen + alias) tới bước { meet: "<mã>" } (người gọi bí ẩn, kẻ đứng trong bóng tối…)
  E.known = id => { const c = S?.chars?.[id]; return !c || c.known === true || !!R?.met?.[id]; };
  E.knownEver = id => { const c = S?.chars?.[id]; return !c || c.known === true || !!G?.known?.[id] || !!R?.met?.[id]; };
  E.meet = (id, force) => {
    const c = S.chars[id]; if (!c || R.met[id]) return false;
    if (c.reveal === "manual" && !force) return false;
    const first = !G.known[id];
    R.met[id] = 1; G.known[id] ||= Date.now();
    // thẻ “Nhân vật mới” (hồ sơ mở ra) — chỉ cho nhân vật CHƯA biết từ trước, không hiện ở người phụ (hideInBook)
    if (!c.known && !c.hideInBook && !E.quiet && E.ui.meetCard) E.ui.meetCard(id, first);
    E.emit("meet", id, first);
    // nhân vật đang đứng trên sân khấu → bỏ bóng đen, đổi tên
    root?.querySelector(`.se-ch[data-id="${id}"]`)?.classList.remove("anon");
    return true;
  };
  // lời nhân vật: nhân vật nói tiếng khác thứ tiếng học (vd. người cùng quê) → hiện đúng tiếng đó, phụ = nghĩa
  E.speech = (st, ch) => {
    const lang = E.langOf(ch);
    if (lang !== E.L) return { main: fill(tx(st, lang)), sub: fill(tx(st, lang === E.N ? E.L : E.N)), lang };
    // bản dễ: `easy` chỉ là tiếng Anh → thứ tiếng khác dùng easy_<mã> nếu có
    const easy = E.L === "en" ? st.easy : st["easy_" + E.L];
    const main = mode() === "easy" && easy ? easy : tx(st, E.L) || tx(st, "en");
    return { main: fill(main), sub: fill(tx(st, E.N)), lang: E.L, alt: easy && mode() !== "easy" ? fill(easy) : "" };
  };
  E.narr = t => (mode() === "imm" ? { main: fill(tx(t, E.L)), sub: fill(tx(t, E.N)), lang: E.L } : { main: fill(tx(t, E.N)), sub: fill(tx(t, E.L)), lang: E.N });

  // ───────── trạng thái cho điều kiện trong truyện (s => …) ─────────
  E.state = () => ({
    f: R.f, items: R.items, has: id => R.items.includes(id), truth: id => !!G.truths[id],
    acc: () => (R.f.accN ? (R.f.acc || 0) / R.f.accN : 1), G, R,
  });
  E.flag = (k, v) => {
    R.f[k] = v;
    // nhánh trên sơ đồ (flow kind "opt"): mở cho mọi lần chơi (G.opts) + ghi ĐƯỜNG ĐI của lần này (R.path) để sơ đồ tô đúng nhánh đã đi
    if (S.flow?.some(x => x.kind === "opt" && x.key === k && x.val === v)) {
      G.opts[k + ":" + v] ||= Date.now();
      (R.path ||= []).push({ k, v, at: R.ch || 0 });
      E.emit("branch", k, v);
    }
  };
  // cộng biến; biến là lòng tin của 1 nhân vật (mã nhân vật, hoặc khai báo ở story.remember) → nhãn “… sẽ nhớ điều này”
  E.add = (k, n) => {
    R.f[k] = (+R.f[k] || 0) + n;
    const m = S.remember?.[k] || (S.chars?.[k] && !S.chars[k].hideInBook ? { who: k } : null);
    if (!m || !n || !E.ui.remember || E.quiet) return;
    const nm = E.cname(S.chars[m.who] || {}, true);
    const t = n > 0 ? (m.up ? E.nat(m.up) : E.nat({ en: `${nm} will remember that.`, vi: `${nm} sẽ nhớ điều này.` })) : (m.down ? E.nat(m.down) : E.nat({ en: `${nm} didn't like that.`, vi: `${nm} không thích điều đó.` }));
    E.ui.remember(m.who, n, t);
  };
  E.apply = o => { if (!o) return; for (const k in o.set || {}) E.flag(k, o.set[k]); for (const k in o.add || {}) E.add(k, o.add[k]); };

  // ───────── lưu ─────────
  const saveG = () => store.set(KEY + ".g", G);
  // CHƠI THỬ (E.explore — kiểu Detroit “không lưu tiến độ”): lần chơi KHÔNG ghi đè lần chơi chính (R không lưu),
  //   không mở / khoá chương, mốc mới chỉ thêm vào sơ đồ (không đè bản chụp cũ); kết thúc / mở khoá vẫn vào bộ sưu tập (G).
  E.explore = false;
  const saveR = () => { if (!E.explore) store.set(KEY + ".r", R); };
  E.save = () => { saveR(); saveG(); };
  E.G = () => G; E.R = () => R; E.S = () => S;

  // ───────── chạy bước ─────────
  // node "@places" / "@talks" (engine 3) = bước nằm trong bảng dùng chung của truyện (địa điểm / cuộc trò chuyện khai báo 1 lần, ghé nhiều lần)
  const walk = (frame) => { let a = frame.n[0] === "@" ? S[frame.n.slice(1)] : S.nodes[frame.n]; for (const k of frame.p) a = a?.[k]; return Array.isArray(a) ? a : null; };
  E.walk = walk;
  const typeOf = st => Object.keys(st).find(k => MECH[k]);
  async function loop(my) {
    while (my === gen) {
      const fr = R.stack[R.stack.length - 1];
      if (!fr) { E.ui.toast(T("noMore")); return; }
      // node thuộc chương chưa nạp → nạp chương đó (+ các chương trước nếu thiếu) rồi chạy tiếp
      if (fr.n[0] !== "@" && !S.nodes[fr.n] && E.chapterOf(fr.n)) { const ok = await E.loadUpTo(E.chapterOf(fr.n)); if (my !== gen) return; if (!ok) { E.save(); return E.ui.title(); } continue; }
      const arr = walk(fr);
      if (!arr || fr.i >= arr.length) { R.stack.pop(); continue; }
      const idx = fr.i, st = arr[idx], type = typeOf(st);
      saveR();
      fr.i++;
      if (!type) { console.warn("[story] bước lạ", st); continue; }
      if ((idx === 0 || type === "bg") && !E.auto) setTimeout(() => { let n = 0; for (let k = idx + 1; k < arr.length && n < 3; k++) { const b = arr[k]?.bg; if (typeof b === "string") { E.preloadImg?.("im-" + b); n++; } } }, 60);
      const ctx = {
        st, type, s: E.state(), frame: fr, idx, path: [...fr.p, idx],
        push: (...keys) => { const p = [...fr.p, idx, ...keys]; if (walk({ n: fr.n, p })) R.stack.push({ n: fr.n, p, i: 0 }); },
        again: () => { fr.i = idx; },
        key: (...x) => [fr.n, ...fr.p, idx, ...x].join("."),
        live: () => my === gen,
      };
      // cơ chế cũ có thể còn gắn bộ bắt bấm lên khung chung .se-ui (mech-plus: ui().onclick) → gỡ trước bước mới,
      //   không thì cú bấm ở bước sau lọt vào bộ cũ (điền từ: “Tiếp tục” sau khi đúng lại chấm lần nữa → bảng kết quả hiện lại mãi)
      ui.onclick = ui.onpointerdown = ui.onpointerup = ui.onpointercancel = ui.onpointerleave = null; E.solveNow = null;
      try { for (const k in SIDE) if (k !== type && k in st) await SIDE[k](st[k], st, ctx); E.emit("step", type, st); await MECH[type](ctx); } catch (e) { console.error("[story] lỗi ở bước", type, st, e); }
    }
  }
  // LỜI GIẢI của bước đang chạy (cơ chế khai báo bằng E.autoRun): chế độ tự chơi (?auto) chạy ngay; bộ kiểm “khỉ bấm” (cover.js) gọi
  //   E.solveNow() khi bấm ngẫu nhiên mãi không giải được câu đố — sau đó vẫn phải tự bấm qua các nút như người chơi
  E.solveNow = null;
  E.autoRun = (fn, ms = 5) => { const run = () => { if (E.solveNow !== run) return; E.solveNow = null; fn(); }; E.solveNow = run; if (E.auto) setTimeout(run, ms); };
  E.jump = n => { R.stack = [{ n, p: [], i: 0 }]; G.seen[n] = 1; E.prefetch(n); const ch = E.chapterOf(n); if (ch) setTimeout(() => E.loadChapter(ch + 1), E.auto ? 0 : 4000); };
  // TỰ DỊCH LÚC CHẠY: ngôn ngữ gốc của người chơi chưa có bản dịch trong truyện (vd. truyện có vi + en, người chơi Nhật) →
  //   khi vào 1 cảnh, gom mọi câu của cảnh đó gửi app dịch 1 lượt (Enmi.translate), đổ vào lớp phủ LINES; rồi dịch dần các cảnh nó đi tới.
  //   Trong lúc chờ: hiện bản tiếng Anh. Không có app (chạy riêng) → giữ tiếng Anh.
  const asked = new Set();
  E.prefetch = n => {
    const sdk = SDK(), N = E.N;
    if (!sdk?.translate || !S || (S.natives || []).includes(N) || N === "en" || asked.has(n)) return;
    asked.add(n);
    const out = new Set(), next = new Set();
    const walk = o => {
      if (Array.isArray(o)) return o.forEach(walk);
      if (!o || typeof o !== "object") return;
      if (typeof o.en === "string" && o[N] == null && !LINES[N]?.[E.lineKey(o.en)]) out.add(o.en);
      if (typeof o.go === "string") next.add(o.go);
      for (const k in o) if (typeof o[k] === "object") walk(o[k]);
    };
    walk(S.nodes[n]);
    const list = [...out].slice(0, 240);
    for (let i = 0; i < list.length; i += 60) {
      const part = list.slice(i, i + 60);
      sdk.translate(part.map(x => x.replace(/\[\[|\]\]/g, "")), { from: "en", to: N })
        .then(r => { if (r?.ok) part.forEach((en, k) => { if (r.lines[k]) (LINES[N] ||= {})[E.lineKey(en)] = r.lines[k]; }); }).catch(() => {});
    }
    for (const x of next) if (!asked.has(x) && S.nodes[x]) setTimeout(() => E.prefetch(x), 1500);
  };
  E.play = () => { const my = ++gen; E.ui.reset(); E.ui.restore(); loop(my); };
  E.stop = () => { gen++; };
  E.newRun = () => { R = NEW_R(); E.jump(S.start); E.save(); E.play(); };
  // chơi tiếp / chơi lại giữa chừng → “Chuyện đã qua” theo đúng nhánh của lần chơi đó, rồi mới chạy
  E.resume = async () => { await E.loadUpTo(Math.max(R.ch || 1, E.chapterOf(R.stack[0]?.n) || 1)); if (E.recapList().length && !E.auto) await E.ui.recap(true); E.play(); };
  E.fromCp = id => { const snap = G.cps[id]; if (!snap) return; R = clone(snap); E.save(); E.resume(); };
  // CHƠI LẠI TỪ 1 MỐC / 1 CHƯƠNG (sơ đồ nhánh, màn tổng quan): có tiến độ phía sau → hỏi như Detroit: chơi lại & lưu (chương sau
  //   chơi lại theo lựa chọn mới) hoặc chơi thử không lưu (xong thì về, tiến độ chính giữ nguyên). Không mất gì → chơi luôn.
  E.ui.replayAsk = ({ cp, ch }) => {
    const snap = cp ? G.cps[cp] : null;
    if (cp && !snap) return;
    const c = ch ?? (S.flow || []).find(x => x.id === cp)?.ch ?? snap?.ch ?? 1;
    if (!E.chOpen(c)) return E.ui.toast(esc(E.nat({ en: `Finish chapter ${c - 1} to unlock`, vi: `Xong chương ${c - 1} để mở` })), 2600);
    if (!cp && !E.canPlayCh(c)) return E.ui.toast(esc(E.nat({ en: `Continue your story to reach chapter ${c}.`, vi: `Chơi tiếp truyện để tới chương ${c}.` })), 3200);
    const go = mode => {
      E.ui.closeSheet(); E.ui.clear(); if (top) top.hidden = false; E.stop(); E.ui.hide("*");
      E.explore = mode === "try";
      if (mode === "save") E.rewindTo(c);
      E.sfx("whoosh");
      setTimeout(() => {
        if (cp) E.fromCp(cp); else E.playCh(c);
        if (E.explore) E.ui.toast(esc(E.nat({ en: "Trying another path — your saved story won't change.", vi: "Đang chơi thử — tiến độ đã lưu của bạn không đổi." })), 3200);
      }, 50);
    };
    const loss = E.lossFrom(c, cp);
    if (!loss) return go("save");
    const span = loss.to > loss.from ? E.nat({ en: `chapters ${loss.from}–${loss.to}`, vi: `chương ${loss.from}–${loss.to}` }) : E.nat({ en: `chapter ${loss.from}`, vi: `chương ${loss.from}` });
    const sh = E.ui.sheet(E.nat({ en: "Replay from here?", vi: "Chơi lại từ đây?" }), `<div class="se-rp">
      <p>${esc(E.nat({ en: `Later chapters depend on what you chose before. If you save, your progress in ${span} is replaced by your new choices and those chapters lock until you play them again.`, vi: `Các chương sau phụ thuộc lựa chọn trước đó. Nếu lưu, tiến độ ở ${span} sẽ được thay bằng lựa chọn mới và các chương sau khoá lại tới khi bạn chơi lại.` }))}</p>
      <p class="se-mute">${esc(E.nat({ en: "Endings, truths and your flowchart stay unlocked.", vi: "Kết thúc, sự thật và sơ đồ nhánh đã mở vẫn được giữ." }))}</p>
      <button class="se-btn pri wide" data-rs>${esc(E.nat({ en: "Replay and save", vi: "Chơi lại và lưu" }))}</button>
      <button class="se-btn wide" data-rt>${esc(E.nat({ en: "Just try it (don't save)", vi: "Chơi thử, không lưu" }))}</button>
      <button class="se-btn wide" data-x>${esc(E.nat({ en: "Cancel", vi: "Huỷ" }))}</button></div>`);
    sh.querySelector("[data-rs]").onclick = e => { e.stopPropagation(); go("save"); };
    sh.querySelector("[data-rt]").onclick = e => { e.stopPropagation(); go("try"); };
  };

  // ───────── TÓM TẮT theo nhánh ─────────
  // story.recap: [{ ch, if: (s) => …, t: { en, vi } }] — chỉ lấy ý mà điều kiện đúng với lần chơi hiện tại.
  // Ý chỉ đúng SAU một mốc: ghi when: "<id mốc cp>" (mốc đã qua trong lần chơi này) — hoặc dùng cờ trong if.
  E.recapList = (upTo = 99) => E.recapOf(R, upTo);
  // tóm tắt theo 1 bản chụp lần chơi bất kỳ (mốc trên sơ đồ nhánh: “chuyện tới đây” của đúng nhánh đó)
  E.recapOf = (r, upTo = 99) => {
    const st = { f: r.f || {}, items: r.items || [], has: id => (r.items || []).includes(id), truth: id => !!G.truths[id] || !!r.truths?.[id], acc: () => (r.f?.accN ? (r.f.acc || 0) / r.f.accN : 1), G, R: r };
    return (S.recap || []).filter(x => (x.ch ?? 0) <= upTo && (!x.when || r.passed?.[x.when]) && (!x.if || (() => { try { return !!x.if(st); } catch { return false; } })()));
  };
  E.cp = id => { (R.passed ||= {})[id] = 1; if (!E.explore || !G.cps[id]) G.cps[id] = clone(R); saveG(); };
  // CHƯƠNG (album — người dùng 29/10: muốn chơi chương N phải xong chương N-1): G.chDone[ch] = lúc xong chương (tới kết thúc của chương,
  //   hoặc bước sang chương sau) · G.chAt[ch] = bản chụp lần chơi ngay đầu chương (thẻ tiêu đề chương) → “Chơi chương N” từ màn tổng quan.
  //   App đọc G.chDone trong bản lưu (lm.gs.game.<mã>) để cửa hàng hiện chương nào đã xong / đang khoá.
  E.chDone = ch => { if (ch > 0 && !E.explore && !G.chDone[ch]) { G.chDone[ch] = Date.now(); saveG(); } };
  E.chAt = ch => {
    if (!(ch > 0) || E.explore) return;
    // vòng chạy đã tăng i qua bước thẻ chương → lùi 1 để chơi lại từ chính thẻ chương
    const r = clone({ ...R, log: [] }), fr = r.stack[r.stack.length - 1]; if (fr?.i > 0) fr.i--;
    G.chAt[ch] = r; E.chDone(ch - 1); saveG();
  };
  E.chOpen = ch => ch <= 1 || !!G.chDone[ch - 1];
  // chương N chơi lại được không (có chỗ bắt đầu): chương 1 · bản chụp đầu chương · mốc đã qua · lần chơi chính đang dừng ở kết thúc chương N-1
  E.canPlayCh = ch => {
    if (!E.chOpen(ch)) return false;
    if (ch <= 1 || G.chAt[ch] || (S.flow || []).some(x => x.kind === "cp" && x.ch === ch && G.cps[x.id])) return true;
    const r = store.get(KEY + ".r", null), en = r?.done && S.endings?.[r.done];
    return !!(en?.next && (en.ch ?? r.ch) === ch - 1);
  };
  // CHƠI LẠI MÀ LƯU (Detroit): chương sau phụ thuộc lựa chọn ở chương trước → mọi chương từ chương này về sau khoá lại / chơi lại
  //   theo lựa chọn mới (bỏ “đã xong” + bản chụp đầu chương phía sau). Sơ đồ nhánh, kết thúc, sự thật đã mở = bộ sưu tập, giữ nguyên.
  E.rewindTo = ch => { for (const c in G.chDone) if (+c >= ch) delete G.chDone[c]; for (const c in G.chAt) if (+c > ch) delete G.chAt[c]; saveG(); };
  // chơi lại từ chương ch (mốc cp) sẽ làm mất tiến độ nào của lần chơi chính → null (không mất gì) | { from, to } chương bị chơi lại
  E.lossFrom = (ch, cp) => {
    const r0 = store.get(KEY + ".r", null), has = !!r0?.stack?.length || !!r0?.done;
    const doneLater = Object.keys(G.chDone).map(Number).filter(c => c >= ch);
    const at = has ? Math.max(1, r0.ch || 1) : 0;
    // lần chơi chính chưa tới chương này → không mất gì; đúng chương này: mất phần đã chơi trong chương (trừ khi vừa tới mốc đó, chưa đi tiếp)
    const inCh = at === ch && !(cp && r0?.stack?.length && G.cps[cp] && JSON.stringify(r0.stack) === JSON.stringify(G.cps[cp].stack));
    const to = Math.max(at > ch || inCh ? at : 0, ...doneLater, 0);
    return to >= ch ? { from: ch, to } : null;
  };
  // chơi đúng chương N: bản chụp đầu chương → mốc đầu tiên đã qua của chương → lần chơi đang dừng ở kết thúc chương N-1 → không có thì false
  E.playCh = ch => {
    if (!E.chOpen(ch)) return false;
    if (ch <= 1 && !G.chAt[1]) { E.newRun(); return true; }
    if (G.chAt[ch]) { R = clone(G.chAt[ch]); E.save(); E.resume(); return true; }
    const cp = (S.flow || []).find(x => x.kind === "cp" && x.ch === ch && G.cps[x.id]);
    if (cp) { E.fromCp(cp.id); return true; }
    const r = store.get(KEY + ".r", null), en = r?.done && S.endings?.[r.done];
    if (en?.next && (en.ch ?? r.ch) === ch - 1) { R = r; R.done = null; E.jump(en.next); E.save(); E.resume(); return true; }
    return false;
  };
  // ───────── ĐỒ VẬT CÒN DÙNG (29/10, người dùng: “đồ không còn hữu ích nữa thì nên ẩn đi”) ─────────
  // story/refs.js (sinh bởi refs.js lúc dựng) = { items: { <đồ>: chương cuối còn nhắc tới } }. Đồ hết dùng KHÔNG bị xoá khỏi túi —
  //   chỉ lui khỏi túi đồ khi khám phá / bảng đưa bằng chứng, và gập vào “Không cần nữa” trong Sổ tay. Truyện chưa có refs.js → hiện hết như cũ.
  let REFS = null, rKey = "", rStr = "";
  E.refs = o => { REFS = o || null; };
  const nodeStr = n => JSON.stringify(S.nodes[n], (k, v) => (typeof v === "function" ? v.toString() : v));
  // chữ của mọi node còn đi tới được từ chỗ đang đứng (cả node đang chạy, theo go / next / to) trong phần truyện đã nạp
  const reachStr = () => {
    const key = R.stack.map(f => f.n).join("|") + "|" + Object.keys(S.nodes).length;
    if (key === rKey) return rStr;
    const seen = new Set(), q = R.stack.map(f => f.n), out = [];
    while (q.length) {
      const n = q.pop(); if (seen.has(n) || !S.nodes[n]) continue; seen.add(n);
      const s = nodeStr(n); out.push(s);
      for (const m of s.matchAll(/"(?:go|next|to)":"([^"]+)"/g)) q.push(m[1]);
    }
    rKey = key; rStr = out.join("\n");
    return rStr;
  };
  const comboOf = id => (S.combos || []).map((k, i) => ({ k, i })).filter(({ k, i }) => (k.a === id || k.b === id) && !R.used?.["cmb:" + i]);
  E.itemLive = id => {
    const it = S.items?.[id];
    if (!it || it.keep || !REFS?.items) return true;
    // còn 1 phép ghép chưa làm mà đang có món kia → còn dùng
    if (comboOf(id).some(({ k }) => R.items.includes(k.a === id ? k.b : k.a))) return true;
    const last = REFS.items[id], ch = R.ch || 1;
    if (last == null || ch > last) return false;
    if (ch < last) return true;
    const q = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`["'\`]${q}["'\`]`).test(reachStr());
  };
  // túi đồ đang dùng được (ẩn đồ hết dùng)
  E.bag = () => R.items.filter(E.itemLive);
  // số cặp đồ đang ghép được (để nhắc “có thể ghép”, không nói cặp nào)
  E.canCombine = () => (S.combos || []).filter((k, i) => !R.used?.["cmb:" + i] && R.items.includes(k.a) && R.items.includes(k.b)).length;
  // GHÉP 2 món ở BẤT CỨ LÚC NÀO (Sổ tay → Đồ vật, không chỉ trong màn khám phá): ra đồ mới (make) ngay; cảnh đi kèm (then)
  //   chạy ngay sau bước đang diễn ra. → { ok, make } | { ok: false }
  E.combine = (a, b) => {
    const ci = (S.combos || []).findIndex(k => (k.a === a && k.b === b) || (k.b === a && k.a === b));
    if (ci < 0 || R.used?.["cmb:" + ci]) return { ok: false, done: ci >= 0 };
    const k = S.combos[ci];
    (R.used ||= {})["cmb:" + ci] = 1;
    if (k.make) { R.items = R.items.filter(x => x !== k.a && x !== k.b); R.items.push(k.make); }
    if (k.then) { S.nodes.__combo = (S.combos || []).map(x => x.then || []); R.stack.push({ n: "__combo", p: [ci], i: 0 }); }
    E.sfx("item"); E.save();
    return { ok: true, make: k.make, then: !!k.then };
  };
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
  // Trong app: câu thứ tiếng đang học đọc bằng GIỌNG CHUNG của app (Enmi.say — theo Cài đặt → Âm thanh: tự chọn / giọng AI / Giọng nam ·
  //   Giọng nữ riêng, như truyện nhập vai); nhân vật thứ 2 cùng giới = giọng thứ 2. Câu tiếng khác (lời dẫn tiếng mẹ đẻ…) hoặc app từ chối
  //   → giọng máy trong khung như cũ.
  const nthOf = who => { if (who === "me") return 1; const g = S.chars[who]?.g || "M"; const same = Object.keys(S.chars).filter(k => !S.chars[k].hideInBook && (S.chars[k].g || "M") === g); return same.indexOf(who) > 0 ? 2 : 1; };
  // GIỌNG ĐỌC SẴN (tools/games/_lib/story/voice.js → audio/*.mp3): art-css.js khai mỗi câu 1 lớp .au-<khoá>{background-image:url(audio/…)}
  //   (host Game SDK chỉ đổi đường dẫn trong HTML / CSS) → đọc url đã đổi qua getComputedStyle rồi phát. Khoá = băm(người nói | câu) như voice.js;
  //   lời "bạn" có 2 bản (me.F / me.M) theo giới tính người chơi. Chỉ thứ tiếng của bản ghi (S.voiceLang, mặc định en); tắt: Cài đặt → Giọng đọc sẵn.
  const recClean = t => String(t || "").replace(/\[\[|\]\]/g, "").replace(/\s+/g, " ").trim();
  E.recKey = (who, text) => hash(who + "|" + recClean(text)).toString(36);
  let probe = null, recAud = null, recHas = null;
  const recUrl = cls => {
    if (!probe) { probe = document.createElement("i"); probe.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none"; probe.hidden = true; document.body.append(probe); }
    probe.className = cls;
    const m = /url\(["']?(.*?)["']?\)/.exec(getComputedStyle(probe).backgroundImage || "");
    return m ? m[1] : null;
  };
  E.recHas = () => recHas ??= !!recUrl("au-has");
  const recPlay = (url, opts, done) => {
    try { recAud?.pause(); } catch {}
    const a = recAud = new Audio(url);
    a.playbackRate = (opts.slow ? 0.75 : 1) * (G.set.vRate || 1);
    a.volume = opts.whisper ? 0.7 : 1;
    let fin = false; const end = ok => { if (fin) return; fin = true; E.duck?.(false); done(ok); };
    E.duck?.(true);
    a.onended = () => end(true); a.onerror = () => end(false);
    a.play().catch(() => end(false));
  };
  let sayN = 0;
  E.say = (text, who, opts = {}) => new Promise(res => {
    if (!(opts.narr ? G.set.vNarr : G.set.vDlg) && !opts.force) return res();
    if (E.auto || !String(text || "").replace(/\[\[|\]\]/g, "").trim()) return res();
    const ch = who === "me" ? { g: G.set.g } : S.chars[who] || { g: "M" };
    const lang = opts.lang || E.langOf(ch);
    const n = ++sayN, sdk = SDK();
    if (G.set.vRec !== false && lang === (S.voiceLang || "en") && E.recHas()) {
      const w = opts.narr ? "narr" : who === "me" ? "me." + (G.set.g === "F" ? "F" : "M") : who, url = recUrl("au-" + E.recKey(w, text));
      if (url) {
        try { speechSynthesis.cancel(); } catch {}
        sdk?.hush?.().catch(() => {});
        return recPlay(url, opts, ok => (ok || n !== sayN ? res() : local(text, ch, lang, opts, res, who)));
      }
    }
    if (sdk?.say && (lang === E.L || lang === E.N)) {   // tiếng mẹ đẻ (lời dẫn) cũng qua app: giọng hệ điều hành
      try { speechSynthesis.cancel(); } catch {}
      const rate = (ch.rate || 1) * (opts.slow ? 0.72 : 1) * (opts.whisper ? 0.92 : 1);
      return sdk.say(String(text).replace(/\[\[|\]\]/g, ""), { g: ch.g || "M", n: nthOf(who), rate, lang }).then(r => (r?.ok || n !== sayN ? res() : local(text, ch, lang, opts, res, who))).catch(() => res());
    }
    sdk?.hush?.().catch(() => {});
    local(text, ch, lang, opts, res, who);
  });
  function local(text, ch, lang, opts, res, who = "") {
    try {
      speechSynthesis.cancel();
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
  }
  E.hush = () => { sayN++; try { recAud?.pause(); } catch {} try { speechSynthesis.cancel(); } catch {} try { SDK()?.hush?.().catch(() => {}); } catch {} };

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
    alwaysTr: { en: "Always translate", vi: "Luôn dịch" }, alwaysTr_d: { en: "Show the meaning under every line and choice.", vi: "Hiện nghĩa dưới mọi câu và lựa chọn." },
    trOn: { en: "Translation on", vi: "Đã bật luôn dịch" }, trOff: { en: "Translation off", vi: "Đã tắt luôn dịch" },
    shadow: { en: "Say your line", vi: "Nói theo câu đã chọn" }, shadow_d: { en: "After each choice, say it out loud and get a score.", vi: "Chọn xong thì nói to câu đó, máy nghe và chấm." },
    voice_d: { en: "Characters read their lines aloud.", vi: "Nhân vật đọc to lời thoại." },
    sound_d: { en: "Rain, sea, footsteps…", vi: "Mưa, sóng biển, tiếng bước chân…" },
    cast: { en: "Characters", vi: "Nhân vật" }, you: { en: "You", vi: "Bạn là ai" }, editMe: { en: "About you", vi: "Thông tin của bạn" }, done: { en: "Done", vi: "Xong" },
    g_lang: { en: "Language", vi: "Ngôn ngữ" }, g_voice: { en: "Voices", vi: "Giọng đọc" }, g_sound: { en: "Sound", vi: "Âm thanh" }, g_speak: { en: "Speaking practice", vi: "Luyện nói" },
    o_narr: { en: "Narration in", vi: "Lời dẫn truyện bằng" }, o_narr_d: { en: "Characters always speak the language you're learning.", vi: "Nhân vật luôn nói thứ tiếng bạn đang học." },
    o_tr: { en: "Always translate", vi: "Luôn dịch" }, o_tr_d: { en: "Meaning under every line and choice.", vi: "Hiện nghĩa dưới mọi câu và lựa chọn." },
    o_vDlg: { en: "Read dialogue", vi: "Đọc lời hội thoại" }, o_vDlg_d: { en: "Characters read their lines aloud.", vi: "Nhân vật đọc to lời của mình." },
    o_vRec: { en: "Recorded voices", vi: "Giọng đọc sẵn" }, o_vRec_d: { en: "Each character has their own recorded English voice. Off: Enmi reads.", vi: "Mỗi nhân vật có giọng tiếng Anh thu sẵn riêng. Tắt: Enmi đọc." },
    o_vNarr: { en: "Read narration", vi: "Đọc lời dẫn truyện" }, o_vNarr_d: { en: "Narration and thoughts are read aloud too.", vi: "Đọc cả lời dẫn và suy nghĩ của bạn." },
    o_sfx: { en: "Sound effects", vi: "Hiệu ứng âm thanh" }, o_sfx_d: { en: "Taps, clues, new items…", vi: "Tiếng chạm, manh mối, nhận đồ vật…" },
    o_amb: { en: "Ambience", vi: "Âm thanh không khí" }, o_amb_d: { en: "Rain, waves, quiet rooms.", vi: "Mưa, sóng biển, tiếng phòng vắng." },
    o_shadow: { en: "Say your line", vi: "Nói theo câu đã chọn" }, o_shadow_d: { en: "Say your choice out loud and get a score.", vi: "Chọn xong thì nói to câu đó, máy nghe và chấm." }, chapters: { en: "Chapters & your path", vi: "Chương & đường đi" }, soon: { en: "Coming soon", vi: "Sắp ra mắt" }, opts: { en: "Options", vi: "Tuỳ chọn" },
    restart: { en: "Start over", vi: "Chơi lại từ đầu" },
    g_text: { en: "Text", vi: "Chữ" }, o_speed: { en: "Text speed", vi: "Tốc độ chữ" }, o_speed_d: { en: "Tap while text is appearing to show it all.", vi: "Chạm khi chữ đang hiện để hiện hết ngay." },
    sp_slow: { en: "Slow", vi: "Chậm" }, sp_mid: { en: "Normal", vi: "Vừa" }, sp_fast: { en: "Fast", vi: "Nhanh" }, sp_now: { en: "Instant", vi: "Hiện ngay" },
    ovNote: { en: "Every choice changes the story. Tap any word to look it up.", vi: "Mỗi lựa chọn rẽ câu chuyện sang hướng khác. Chạm vào từ bất kỳ để tra." },
  };
  E.UI_TXT = UI_TXT;
  let root, box, ui, stage, charsEl, top;
  const lineQ = { res: null, revealing: false };

  function build(host) {
    root = h(`<div class="se">
      <div class="se-stage">
        <div class="se-bgw"><div class="se-bgl"></div><div class="se-bgl"></div></div>
        <div class="se-fx"></div><div class="se-fog"></div><div class="se-light"></div>
        <div class="se-chars"></div>
        <div class="se-vig"></div><div class="se-spots"></div>
        <div class="se-loc"><i></i><b></b><small></small></div>
      </div>
      <div class="se-top">
        <button class="se-ib" data-a="menu" aria-label="${T("menu")}">${ICON.menu}</button>
        <div class="se-grp">
          <button data-a="trall" class="se-trall" aria-label="${T("alwaysTr")}">${ICON.tr}</button>
          <button data-a="log" aria-label="${T("log")}">${ICON.log}</button>
          <button data-a="book" aria-label="${T("notebook")}">${ICON.book}<i class="se-dot" hidden></i></button>
          <button data-a="flow" aria-label="${T("flow")}">${ICON.flow}</button>
        </div>
      </div>
      <div class="se-mem"></div>
      <div class="se-box" hidden>
        <div class="se-name"></div>
        <div class="se-txt"></div>
        <div class="se-sub" hidden></div>
        <div class="se-tools"><button data-a="tr">${ICON.tr}<span>${T("translate")}</span></button><button data-a="re" aria-label="${T("listen")}">${ICON.spk}</button><span class="se-more">${ICON.next}</span></div>
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
    // âm thanh chỉ được bật sau 1 lần chạm (luật trình duyệt)
    root.addEventListener("pointerdown", () => { if (ac() && ambWant !== ambK) E.amb(ambWant); }, { passive: true });
  }
  function onClick(e) {
    const a = e.target.closest("[data-a]")?.dataset.a;
    const w = e.target.closest(".w[data-w]");
    if (w && !lineQ.revealing) { e.stopPropagation(); return wordPop(w.dataset.w, w); }
    if (a === "tr") { e.stopPropagation(); const sb = $(".se-sub", box); sb.hidden = !sb.hidden || !sb.textContent; E.sfx("tap"); return; }
    if (a === "trall") { e.stopPropagation(); return E.ui.setTr(!G.set.tr, true); }
    if (a === "re") { e.stopPropagation(); if (lineQ.cur) E.say(lineQ.cur.speak, lineQ.cur.who, { lang: lineQ.cur.lang, force: true, whisper: lineQ.cur.whisper }); return; }
    if (a === "menu") return E.sfx("tap"), E.ui.menu();
    if (a === "log") return E.sfx("tap"), E.ui.logSheet();
    if (a === "book") return E.sfx("tap"), E.ui.book();
    if (a === "flow") return E.sfx("tap"), E.ui.flowSheet();
    if (e.target.closest(".se-sheet,.se-ui button,.se-ui .se-card2,.se-top,.se-pop")) return;
    if (lineQ.res) advance();
  }
  function advance() {
    if (lineQ.revealing) { box.classList.add("done"); lineQ.revealing = false; clearTimeout(lineQ.t); return; }
    const r = lineQ.res; lineQ.res = null;
    $(".se-pop", root)?.remove();
    E.hush();
    r?.();
  }
  E.haptic = k => { try { SDK()?.haptic?.(k || "LIGHT"); } catch {} };

  // hiện 1 dòng (lời dẫn / suy nghĩ / lời thoại) → chờ chạm
  E.ui.line = ({ who = "", kind = "say", main, sub = "", lang = E.L, speak, tag = "", cls = "", whisper, on = "", pic }) => new Promise(res => {
    // ẢNH HÀNH ĐỘNG (fx.js): pic = "act-…" → khung ảnh nhỏ trên hộp lời (soi đèn, mở thư, bắt tay…); không ghi = ảnh trước đó tan
    E.ui.pic?.(pic);
    E.emit("line", { who, kind, main, sub, lang });
    const ch = who === "me" ? { short: G.set.name, color: "var(--se-me)" } : S.chars[who];
    const talker = kind === "say" && who !== "me" ? who : "";
    // hộp lời chỉ trượt lên khi VỪA HIỆN (trước: trượt lại mỗi câu — hộp kính mờ lớn chuyển động = giật trên điện thoại)
    const fresh = box.hidden;
    box.hidden = false;
    box.className = "se-box k-" + kind + (who === "me" ? " me" : "") + (cls ? " " + cls : "") + (whisper ? " whisper" : "");
    const nm = $(".se-name", box);
    nm.hidden = kind !== "say";
    nm.innerHTML = kind === "say" ? `<i></i>${esc(E.cname(ch, true) || who)}${tag ? `<small>${esc(tag)}</small>` : ""}` : "";
    nm.style.setProperty("--c", ch?.color || "#ccc");
    $(".se-txt", box).innerHTML = E.words(main, lang);
    const sb = $(".se-sub", box);
    // bản dịch TRÙNG câu đang hiện (cùng ngôn ngữ / chưa có bản dịch) → không hiện
    if (sub && String(sub).trim() === String(main).trim()) sub = "";
    sb.textContent = String(sub || "").replace(/\[\[|\]\]/g, "");
    sb.hidden = !(sub && (G.set.tr || (mode() === "easy" && kind === "say")));
    $("[data-a=tr]", box).hidden = !sub;
    $("[data-a=re]", box).hidden = kind !== "say";
    lineQ.cur = { speak: speak ?? main, who, lang, whisper };
    // người đang nói bước lên, sáng lên; người khác lùi lại, tối đi — lời dẫn / suy nghĩ: mọi người cùng mờ nhẹ
    root.dataset.talk = talker ? "1" : kind === "say" ? "me" : "0";
    // sân khấu “focus” (kiểu Choices / Episode): chỉ người đang nói đứng giữa. Ai còn hiện khi KHÔNG ai nói (người dùng 29/10: lời dẫn mà vẫn
    //   hiện người nói trước = sai):
    //   · lời của bạn → người bạn đang nói chuyện (người vừa nói) · suy nghĩ ngay sau lời thoại → người đó (bạn đang nhìn họ)
    //   · lời dẫn → chỉ người truyện chỉ định (bước { n, on: "<mã>" }) hoặc người VỪA bước ra mà chưa ai nói (lời dẫn tả người đó); còn lại trống
    if (talker) { R.lastTalk = talker; R.talkN = R.log.length; R.fresh = ""; }
    const prevSay = R.log[R.log.length - 1]?.kind === "say";
    const inCast = id => id && R.cast[id] ? id : "";
    // người nói trước chỉ còn đứng sau khi ĐANG trao đổi (họ vừa nói trong 3 dòng gần nhất) — hết chuyện rồi (bạn độc thoại,
    //   lời dẫn chen giữa…) thì lui hẳn, không đứng mờ phía sau tới khi có người khác nói (người dùng 29/10)
    const recent = R.talkN != null && R.log.length - R.talkN <= 3;
    const hold = talker ? "" : on ? inCast(on) : kind === "say" && recent ? inCast(R.lastTalk) : kind === "think" && prevSay && recent ? inCast(R.lastTalk) : inCast(R.fresh);
    for (const el of charsEl.children) { el.classList.toggle("talk", el.dataset.id === talker); el.classList.toggle("hold", el.dataset.id === hold); }
    R.log.push({ who: kind === "say" ? who : "", kind, main, sub, lang });
    if (R.log.length > 300) R.log.splice(0, R.log.length - 300);
    if (kind === "say") { R.last = { who, text: main, lang, sub }; if (who !== "me") E.meet(who); }
    // CHỮ HIỆN DẦN TỪNG KÝ TỰ kiểu visual novel (engine 3, người dùng 30/10): bọc từng ký tự trong <span class="c" style="--j">,
    //   dừng nhẹ sau dấu câu; chạm khi đang hiện = hiện hết ngay (lớp done), chạm lần nữa = câu sau. Từ tra cứu (.w) giữ nguyên bên ngoài.
    const n = G.set.speed === 0 ? 0 : typeify($(".se-txt", box));
    box.classList.remove("done");
    if (fresh) { box.classList.remove("in"); void box.offsetWidth; box.classList.add("in"); }
    lineQ.revealing = true;
    const dur = G.set.speed === 0 ? 0 : Math.min(12000, n * CPS / (G.set.speed || 1)) + 160;
    lineQ.t = setTimeout(() => { lineQ.revealing = false; box.classList.add("done"); }, dur);
    if (kind === "say") E.say(speak ?? main, who, { lang, whisper });
    // ĐỌC LỜI DẪN TRUYỆN (tuỳ chọn, mặc định tắt): lời dẫn + suy nghĩ, đúng thứ tiếng đang hiện
    else if ((kind === "n" || kind === "think") && G.set.vNarr) E.say(speak ?? main, "narr", { lang, narr: true });
    lineQ.res = res;
    if (E.auto) setTimeout(() => { lineQ.revealing = false; advance(); }, 5);
  });
  E.ui.hideBox = () => { box.hidden = true; };
  // ms / ký tự (≈ 25 ký tự / giây ở tốc độ Vừa) — Cài đặt → Tốc độ chữ: Chậm 0,7 · Vừa 1 · Nhanh 1,6 · Hiện ngay (speed 0 = không chạy chữ)
  const CPS = 40;
  function typeify(el) {
    let j = 0;
    const sp = G.set.speed || 1;
    el.style.setProperty("--cps", (CPS / sp).toFixed(1) + "ms");
    el.classList.add("ty");
    const walk = node => {
      for (const ch of [...node.childNodes]) {
        if (ch.nodeType === 3) {
          const txt = ch.nodeValue; if (!txt) continue;
          const frag = document.createDocumentFragment();
          for (const c of txt) {
            if (/\s/.test(c)) { frag.appendChild(document.createTextNode(c)); j++; continue; }
            const s = document.createElement("span"); s.className = "c"; s.style.setProperty("--j", j); s.textContent = c; frag.appendChild(s);
            j += /[.!?…。！？]/.test(c) ? 9 : /[,;:—，、]/.test(c) ? 4 : 1;
          }
          ch.replaceWith(frag);
        } else if (ch.nodeType === 1) walk(ch);
      }
    };
    walk(el);
    return j;
  }
  // “Luôn dịch” (nút trên thanh trên, như truyện nhập vai): bật = mọi lời có nghĩa hiện sẵn dưới câu + dưới lựa chọn
  E.ui.setTr = (on, tell) => {
    G.set.tr = !!on; saveG();
    top?.querySelector(".se-trall")?.classList.toggle("on", G.set.tr);
    const sb = box && $(".se-sub", box); if (sb && !box.hidden) sb.hidden = !(G.set.tr && sb.textContent);
    root?.querySelectorAll(".se-chs small:not(.se-lh)").forEach(x => (x.hidden = !G.set.tr && mode() !== "easy"));
    if (tell) { E.sfx("tap"); E.ui.toast(esc(T(G.set.tr ? "trOn" : "trOff")), 1400); }
  };
  // bảng thao tác: gắn data-m lên gốc để CSS đổi sân khấu theo cơ chế (khám phá / bản đồ → nhân vật lui ra)
  // bảng đang hiện CÙNG loại (vẽ lại sau mỗi lần chạm: chọn đoạn lời khai, điểm khám xét…) → thay nội dung TẠI CHỖ, giữ chỗ cuộn,
  //   không chạy lại hiệu ứng hiện bảng (trước: dựng lại cả bảng + trượt lên mỗi lần chạm = giật)
  E.ui.panel = (html, cls = "") => {
    const cur = ui.firstElementChild;
    if (cur && cur.dataset.cls === cls && ui.children.length === 1) { const y = cur.scrollTop; cur.innerHTML = html; cur.scrollTop = y; cur.classList.add("still"); return cur; }
    // bảng toàn màn (suy luận, biên bản, xem lại, bản đồ…) → thông báo / “… sẽ nhớ điều này” đang hiện tan ngay, không đè lên câu hỏi
    if (/^(deduce|present|review|map|full)/.test(cls)) root.querySelectorAll(".se-t:not(.out),.se-rm:not(.out)").forEach(t => { t.classList.add("out"); setTimeout(() => t.remove(), 400); });
    ui.innerHTML = ""; const el = h(`<div class="se-panel ${cls}">${html}</div>`); el.dataset.cls = cls; ui.appendChild(el); root.dataset.m = cls.split(" ")[0] || ""; return el;
  };
  E.ui.clear = () => { ui.innerHTML = ""; root.dataset.m = ""; root.classList.remove("urgent"); };
  // thông báo giữ LÂU hơn (người dùng 29/10: đọc không kịp): ×1,6 thời gian truyện ghi, ít nhất 3,2 giây
  // tối đa 2 thông báo cùng lúc (người dùng 29/10: “toast lên rất nhiều”) — thêm cái thứ 3 thì cái cũ nhất tan ngay; trùng nội dung = bỏ
  E.ui.toast = (html, ms = 2200, cls = "") => {
    ms = ms < 2000 ? ms * 1.4 : Math.max(3200, ms * 1.6);
    const box2 = $(".se-toast", root), live = [...box2.children].filter(x => !x.classList.contains("out"));
    if (live.some(x => x.dataset.h === html)) return;
    while (live.length >= 2) { const o = live.shift(); o.classList.add("out"); setTimeout(() => o.remove(), 400); }
    const t = h(`<div class="se-t ${cls}">${html}</div>`);
    t.dataset.h = html;
    box2.appendChild(t);
    setTimeout(() => t.classList.add("out"), ms);
    setTimeout(() => t.remove(), ms + 400);
  };
  // đang tải chương (gói album) — lớp mờ nhỏ giữa màn
  E.ui.loading = (ch, on) => {
    let el = root?.querySelector(".se-ld");
    if (!on) { el?.remove(); return; }
    if (!el) { el = h(`<div class="se-ld"><i></i><span></span></div>`); root.appendChild(el); }
    el.querySelector("span").textContent = E.nat({ en: `Downloading chapter ${ch}…`, vi: `Đang tải chương ${ch}…` });
  };
  // thẻ toàn màn (chương, sự thật, mốc thời gian): ms = 0 → chờ chạm
  E.ui.card = (html, ms = 2600, cls = "") => new Promise(res => {
    const c = $(".se-card", root);
    c.className = "se-card " + cls;
    c.innerHTML = html; c.hidden = false;
    let done = false;
    const fin = () => { if (done) return; done = true; c.classList.add("out"); setTimeout(() => { c.hidden = true; c.className = "se-card"; res(); }, 500); };
    setTimeout(() => (c.onclick = fin), 600);
    if (E.auto) setTimeout(fin, 5); else if (ms) setTimeout(fin, ms);
  });
  E.ui.fx = k => { root.classList.remove("fx-" + k); void root.offsetWidth; root.classList.add("fx-" + k); setTimeout(() => root.classList.remove("fx-" + k), 1000); if (k === "shake") E.haptic("MEDIUM"); };
  E.ui.urgent = on => root.classList.toggle("urgent", !!on);

  // ───────── CẢNH: 2 lớp nền thay nhau (mờ dần), hiện từ nhoè → rõ, máy quay trôi chậm (Ken Burns) ─────────
  // Ảnh: CSS class im-<tên> trong art.css (host Game SDK chỉ đổi đường dẫn trong HTML/CSS, không đổi chuỗi trong JS);
  // chưa có ảnh → tranh tạm TIQ_ART[kind] nằm dưới.
  // bgKey = thứ ĐANG hiện ở lớp nền ("s:<cảnh>" | "c:<tranh>") — trước đây so R.scene: tranh minh hoạ (cg) xong quay về cảnh cũ
  //   thì coi là “cùng cảnh” nên KHÔNG thay lớp → tranh cũ đọng lại làm nền (vào / ra điểm khám xét bị đổi nền, bậc thang tối lấy ảnh thi thể…)
  let flip = 0, bgKey = "";
  // ẢNH NỀN SẴN SÀNG trước khi chuyển (người dùng 30/10: nền cũ hiện thêm một lúc rồi mới đổi vì ảnh mới chưa tải / giải mã):
  //   lấy url từ class im-… (art.css), tải + decode; chờ tối đa 450 ms rồi chuyển dù chưa xong · E.preloadImg(cls) tải trước nền sắp tới
  const imgReady = new Set();
  const urlOf = el => { const m = /url\(["']?([^"')]+)/.exec((el && getComputedStyle(el).backgroundImage) || ""); return m ? m[1] : ""; };
  const loadUrl = u => new Promise(r => { if (!u || imgReady.has(u)) return r(); const im = new Image(); im.onload = () => { imgReady.add(u); (im.decode ? im.decode() : Promise.resolve()).catch(() => {}).then(r); }; im.onerror = () => r(); im.src = u; });
  const waitImg = el => { const u = urlOf(el); if (!u || imgReady.has(u)) return Promise.resolve(); return Promise.race([loadUrl(u), new Promise(r => setTimeout(r, 450))]); };
  E.preloadImg = cls => { try { const d = document.createElement("i"); d.className = cls; d.style.cssText = "position:absolute;width:1px;height:1px;opacity:0;pointer-events:none"; document.body.appendChild(d); const u = urlOf(d); d.remove(); loadUrl(u); } catch {} };
  let layerTok = 0;
  // tr (engine 3): kiểu chuyển — "" mờ dần + Ken Burns (mặc định) · "still" mờ dần, đứng yên (view khám phá, khung hình) ·
  //   "sl-l" / "sl-r" trượt sang (đi vòng quanh phòng ◀ ▶) · "zin" phóng vào từ điểm (ox, oy %) · "zout" lùi ra · "cut" thay ngay
  function layer(cls, inner, cg, key, tr = "", o = {}) {
    bgKey = key || "";
    const ls = root.querySelectorAll(".se-bgl"), nx = ls[flip ? 0 : 1], pv = ls[flip ? 1 : 0];
    flip ^= 1;
    nx.className = "se-bgl " + cls; nx.innerHTML = inner; nx.style.removeProperty("--fx"); nx.style.removeProperty("--fy");
    E._layerHook?.(nx, key || "");
    if (o.ox != null) { root.style.setProperty("--tox", o.ox + "%"); root.style.setProperty("--toy", o.oy + "%"); }
    const tk = ++layerTok;
    const go = () => {
      if (tk !== layerTok) return;
      pv.className = pv.className.replace(/\b(t-\S+|out-\S+)\b/g, "").trim();
      void nx.offsetWidth;
      nx.classList.add("on", tr ? "st" : cg ? "kz" : "kb");
      if (tr && tr !== "still") { nx.classList.add("t-" + tr); pv.classList.add("out-" + tr); }
      pv.classList.remove("on");
    };
    if (E.auto || tr === "cut") return go(), Promise.resolve();
    return waitImg(nx.querySelector(".ii")).then(go);
  }
  E.ui.layer = (key, inner, opts = {}) => { if (bgKey === key && !opts.force) return false; layer(opts.cls || "vw", inner, false, key, opts.tr || "still", opts); return true; };
  E.ui.bgKey = () => bgKey;
  E.ui.scene = (id, keepCg) => {
    const sc = S.scenes[id] || { kind: id };
    const same = bgKey === "s:" + id;
    R.scene = id;
    if (!keepCg) { R.cg = null; root.classList.remove("cg"); }
    let ready = Promise.resolve();
    if (!same) { E.ui.zoom(null); ready = layer("k-" + (sc.kind || id), `<div class="ph">${globalThis.TIQ_ART?.[sc.kind] || ""}</div><div class="ii im-${id}"></div>`, false, "s:" + id); }
    $(".se-fx", root).dataset.fx = sc.fx || (sc.rain ? "rain" : "");
    $(".se-fog", root).classList.toggle("on", !!sc.fog);
    root.dataset.scene = sc.kind || id;
    // thẻ địa điểm kiểu phim (góc dưới trái, hiện ~3 giây rồi tan) mỗi lần sang cảnh mới; giờ: scene.time
    const loc = $(".se-loc", root), name = E.nat(sc.name);
    if (!same && name && loc.dataset.n !== id) {
      loc.dataset.n = id;
      $("b", loc).textContent = name;
      $("small", loc).textContent = sc.time ? E.nat(sc.time) : "";
      loc.classList.remove("in"); void loc.offsetWidth; loc.classList.add("in");
    }
    E.amb(sc.amb || (sc.rain ? "rain" : sc.fog ? "sea" : sc.kind === "court" ? "hall" : "room"));
    return ready;
  };
  // CẬN CẢNH (khám xét): phóng nền vào điểm (x, y %) — mỗi điểm có khung riêng dù chưa có tranh minh hoạ. look: "" | "dark" | "torch"
  E.ui.zoom = (x, y, look = "") => {
    if (!root) return;
    if (x == null) { delete root.dataset.zoom; if (R) R.zoom = null; return; }
    root.style.setProperty("--zx", Math.max(15, Math.min(85, x)) + "%");
    root.style.setProperty("--zy", Math.max(15, Math.min(85, y)) + "%");
    root.dataset.zoom = look || "on";
    if (R) R.zoom = [x, y, look];
  };
  // tranh minh hoạ khoảnh khắc lớn (cg): toàn màn, nhân vật lui ra, máy quay đẩy vào chậm. { cg: null } = về lại cảnh
  E.ui.cg = name => {
    if (!name) { if (R.cg) { R.cg = null; root.classList.remove("cg"); E.ui.scene(R.scene); } return; }
    // chưa có tranh (art.css không có lớp im-<tên>) → giữ cảnh / cận cảnh đang có, không hiện khung trống (tranh vẽ sau tự dùng)
    if (!hasArt("im-" + name)) return;
    R.cg = name;
    root.classList.add("cg");
    if (bgKey !== "c:" + name) layer("cgl", `<div class="ph cgph"></div><div class="ii im-${name}"></div>`, true, "c:" + name);
    E.sfx("whoosh");
  };

  // ───────── NHÂN VẬT ĐỨNG TRƯỚC MẶT: vào từ cạnh, đổi biểu cảm nhún nhẹ, người đang nói bước lên ─────────
  // ảnh: im-<mã> (chính) + im-<mã>-<biểu cảm> (đè lên nếu có) — PNG nền trong suốt; chưa có ảnh → dáng người tạm
  const SIL = (c, id) => `<svg viewBox="0 0 200 300" class="se-sil"><defs><linearGradient id="sg-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c}"/><stop offset=".55" stop-color="${c}" stop-opacity=".55"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></linearGradient><radialGradient id="sr-${id}" cx=".5" cy=".18" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><path fill="url(#sg-${id})" d="M100 26c-26 0-43 20-43 47 0 20 9 36 23 44l-2 15c-36 8-60 30-65 70l-5 98h184l-5-98c-5-40-29-62-65-70l-2-15c14-8 23-24 23-44 0-27-17-47-43-47z"/><ellipse cx="100" cy="70" rx="40" ry="44" fill="url(#sr-${id})"/></svg>`;
  E.ui.show = (id, at = "c", face = "") => {
    const ch = S.chars[id]; if (!ch) return;
    let el = charsEl.querySelector(`[data-id="${id}"]`);
    const fresh = !el;
    if (fresh) {
      el = h(`<div class="se-ch" data-id="${id}"><div class="se-chi"><div class="ph">${SIL(ch.color || "#aaa", id)}</div><div class="ii im-${id}"></div><div class="ii f"></div></div><div class="se-tagn">${esc(E.cname(ch, true))}</div></div>`);
      el.style.setProperty("--c", ch.color || "#aaa");
      el.dataset.from = at === "l" || at === "ll" ? "l" : at === "r" || at === "rr" ? "r" : "b";
      charsEl.appendChild(el);
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("on")));
      // vừa bước ra = người được chú ý (lời dẫn ngay sau đó tả người này) tới khi có ai nói
      R.fresh = id;
      for (const x of charsEl.children) x.classList.toggle("hold", x === el && !x.classList.contains("talk"));
      if (charsEl.querySelector(".talk") && charsEl.querySelector(".talk") !== el) charsEl.querySelector(".talk").classList.remove("talk");
    }
    el.dataset.at = at;
    const prev = el.dataset.face || "";
    el.dataset.face = face || "";
    el.querySelector(".ii.f").className = "ii f" + (face ? ` im-${id}-${face}` : "");
    // ảnh biểu cảm là ảnh ĐẦY ĐỦ (đã tách nền) → ẩn ảnh gốc, không thì gốc lộ ra quanh viền (người dùng 29/10: Kieran đổi mặt vẫn thấy mặt cũ)
    el.classList.toggle("hasf", !!face && hasArt(`im-${id}-${face}`));
    if (!fresh && prev !== (face || "")) { el.classList.remove("mo"); void el.offsetWidth; el.classList.add("mo"); }
    R.cast[id] = { at, face };
    E.meet(id);
    // chưa gặp (reveal: "manual") → bóng đen + alias; gặp rồi → hiện mặt + tên thật
    el.classList.toggle("anon", !E.known(id));
    el.querySelector(".se-tagn").textContent = E.cname(ch, true);
    relayout();
  };
  // ảnh nào có trong art.css (đọc 1 lần; không đọc được thì coi như có)
  let ART = null;
  const hasArt = cls => {
    if (!ART) { ART = new Set(); try { for (const ss of document.styleSheets) for (const r of ss.cssRules || []) for (const m of (r.selectorText || "").matchAll(/\.(im-[\w-]+)/g)) ART.add(m[1]); } catch { ART = null; return true; } }
    if (!ART.size) { ART = null; return true; }
    return ART.has(cls);
  };
  E.hasArt = hasArt;
  E.ui.hide = id => {
    const list = id === "*" ? [...charsEl.children] : [charsEl.querySelector(`[data-id="${id}"]`)].filter(Boolean);
    for (const el of list) { el.classList.remove("on", "talk"); el.classList.add("out"); setTimeout(() => el.remove(), 450); delete R.cast[el.dataset.id]; }
    relayout();
  };
  // BỐ CỤC TỰ ĐỘNG theo số người đứng (at chỉ là thứ tự trái → phải): 1 = giữa · 2 = tách trái / phải · 3 = chia đều…
  // bề rộng co theo số người; mỗi người biết mình đứng phía nào (data-side) để khi người khác nói thì lùi ra phía đó
  const RANK = { ll: 0, l: 1, c: 2, r: 3, rr: 4 };
  const SLOTS = { 1: [50], 2: [24, 76], 3: [16, 50, 84], 4: [12, 37, 63, 88] }, WIDE = { 1: 86, 2: 64, 3: 50, 4: 42 };
  function relayout() {
    const els = [...charsEl.children].filter(e => !e.classList.contains("out"));
    els.sort((a, b) => (RANK[a.dataset.at] ?? 2) - (RANK[b.dataset.at] ?? 2));
    const n = Math.min(els.length, 4);
    els.forEach((e, i) => {
      e.style.left = (SLOTS[n]?.[i] ?? 50) + "%";
      e.style.setProperty("--wd", (WIDE[n] || 42) + "%");
      e.dataset.side = n === 1 || (n === 3 && i === 1) ? "c" : i < n / 2 ? "l" : "r";
    });
    root.dataset.n = n;
  }
  E.ui.reset = () => { E.ui.zoom(null); ui.innerHTML = ""; ui.onclick = null; box.hidden = true; $(".se-spots", root).innerHTML = ""; lineQ.res = null; root.dataset.m = ""; root.classList.remove("urgent"); E.hush(); };
  E.ui.restore = () => {
    charsEl.innerHTML = "";
    if (R.scene) E.ui.scene(R.scene, true);
    if (R.cg) { const c = R.cg; R.cg = null; E.ui.cg(c); }
    if (R.zoom) E.ui.zoom(...R.zoom); else E.ui.zoom(null);
    for (const id in R.cast) E.ui.show(id, R.cast[id].at, R.cast[id].face);
  };
  E.ui.dot = on => { $(".se-dot", root).hidden = !on; };

  // “… sẽ nhớ điều này” (kiểu game Telltale) khi lòng tin của 1 nhân vật đổi
  E.ui.remember = (who, d, text) => {
    const ch = S.chars[who] || {};
    const el = h(`<div class="se-rm ${d > 0 ? "up" : "down"}" style="--c:${ch.color || "#aaa"}"><span class="se-rmi"><b>${esc((E.cname(ch, true) || "?").charAt(0))}</b><i class="im-${who}"></i></span><span>${esc(text)}</span><em>${d > 0 ? "▲" : "▼"}</em></div>`);
    $(".se-mem", root).appendChild(el);
    setTimeout(() => el.classList.add("out"), 2800);
    setTimeout(() => el.remove(), 3300);
    E.sfx(d > 0 ? "up" : "down");
  };

  // ───────── ÂM THANH tự tổng hợp (WebAudio — không cần file, chạy trong iframe sandbox) ─────────
  let AC = null, amb = null, ambK = "", ambWant = "";
  const ac = () => {
    if (E.auto) return null;
    try { AC ||= new (globalThis.AudioContext || globalThis.webkitAudioContext)(); if (AC.state === "suspended") AC.resume(); } catch { AC = null; }
    return AC;
  };
  const tone = (f, t0, dur, type = "sine", vol = 0.2, f2) => {
    const a = AC, t = a.currentTime + t0, o = a.createOscillator(), g = a.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(a.destination); o.start(t); o.stop(t + dur + 0.05);
  };
  let NB = null;
  const noise = () => { if (NB) return NB; const n = AC.sampleRate * 3, b = AC.createBuffer(1, n, AC.sampleRate), d = b.getChannelData(0); let l = 0; for (let i = 0; i < n; i++) { l = (l + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = l * 3.5; } return (NB = b); };
  const burst = (dur, f0, f1, vol) => { const a = AC, s = a.createBufferSource(), fl = a.createBiquadFilter(), g = a.createGain(), t = a.currentTime; s.buffer = noise(); fl.type = "bandpass"; fl.frequency.setValueAtTime(f0, t); fl.frequency.exponentialRampToValueAtTime(f1, t + dur); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + dur * 0.3); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); s.connect(fl).connect(g).connect(a.destination); s.start(t); s.stop(t + dur); };
  const SFX = {
    tap: () => tone(700, 0, 0.05, "triangle", 0.04),
    open: () => { burst(0.35, 400, 1800, 0.25); },
    pick: () => { tone(520, 0, 0.09, "triangle", 0.08); tone(780, 0.06, 0.14, "triangle", 0.07); },
    item: () => { tone(880, 0, 0.14, "sine", 0.1); tone(1320, 0.09, 0.3, "sine", 0.08); },
    truth: () => { tone(98, 0, 2.2, "sine", 0.14); [392, 523, 659, 784, 1047].forEach((f, i) => tone(f, 0.12 + i * 0.1, 1.8 - i * 0.2, "sine", 0.07)); burst(1.2, 300, 3000, 0.12); },
    beat: () => { tone(62, 0, 0.14, "sine", 0.45, 42); tone(58, 0.18, 0.14, "sine", 0.3, 40); },
    up: () => { tone(620, 0, 0.1, "sine", 0.06); tone(930, 0.08, 0.18, "sine", 0.06); },
    down: () => { tone(480, 0, 0.12, "sine", 0.06); tone(320, 0.1, 0.26, "sine", 0.06); },
    hit: () => { tone(120, 0, 0.45, "sawtooth", 0.12, 50); burst(0.3, 2000, 400, 0.3); },
    solve: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.07, 0.35, "triangle", 0.07)),
    wrong: () => tone(210, 0, 0.25, "square", 0.04, 140),
    whoosh: () => burst(0.6, 200, 1200, 0.18),
    page: () => burst(0.18, 2500, 5000, 0.08),
    title: () => { tone(65, 0, 3, "sine", 0.16); tone(98, 0.3, 2.6, "sine", 0.08); burst(2.4, 150, 600, 0.06); },
  };
  // ÂM THANH THẬT từ file (art-css.js khai .sx-<tên> hiệu ứng / .am-<tên> âm nền, url đã được host đổi sang blob:). Khung game
  //   chặn fetch (CSP connect-src 'none') → phát bằng <audio>, nối qua WebAudio gain (iOS không cho đổi audio.volume) để mờ dần.
  const sndC = {};
  const sndUrl = cls => (sndC[cls] ??= recUrl(cls) || "");
  const sndPlay = (url, vol, loop) => {
    const a = new Audio(url); a.loop = !!loop; a.preload = "auto";
    let g = null;
    try { if (AC) { const src = AC.createMediaElementSource(a); g = AC.createGain(); g.gain.value = 0.0001; src.connect(g).connect(AC.destination); } } catch { g = null; }
    const set = (v, sec = 0) => { if (g) { const t = AC.currentTime; g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(Math.max(g.gain.value, 0.0001), t); g.gain.linearRampToValueAtTime(Math.max(v, 0.0001), t + sec); } else { try { a.volume = Math.min(1, v); } catch {} } };
    set(vol, 0); a.play().catch(() => {});
    return { a, set, stop: (sec = 0.8) => { set(0, sec); setTimeout(() => { try { a.pause(); a.src = ""; } catch {} }, sec * 1000 + 80); } };
  };
  E.sfx = k => {
    if (!G?.set?.sfx || E.auto) return;
    const u = sndUrl("sx-" + k);
    if (u) { ac(); try { sndPlay(u, 0.85 * (S.sfxVol?.[k] ?? 1)); } catch {} return; }
    if (!ac()) return; try { SFX[k]?.(); } catch {}
  };
  // plugin / truyện thêm âm tự tổng hợp: E.SFX.ten = () => E.sound.tone(440, 0, .2) — rồi { sfx: "ten" }
  E.SFX = SFX;
  E.sound = { tone: (...a) => AC && tone(...a), burst: (...a) => AC && burst(...a), ctx: () => ac() };
  // nền: sea = sóng (nhiễu nâu lọc thấp, to nhỏ theo nhịp sóng) · rain = mưa · room / hall = tiếng ù phòng
  E.amb = k => {
    ambWant = k || "";
    const want = G?.set?.amb ? ambWant : "";
    if (!ac() || ambK === want) return;
    const a = AC, t = a.currentTime;
    if (amb) { const old = amb; if (old.file) old.stop(); else { old.g.gain.setTargetAtTime(0.0001, t, 0.6); setTimeout(() => { try { old.s.stop(); old.l?.stop(); } catch {} }, 2500); } amb = null; }
    ambK = want;
    if (!want) return;
    // âm nền thật (file .am-<tên>): 2 bản chồng nhau, bản sau vào trước khi bản trước hết 2,5 giây → vòng lặp không hở / không giật
    const fu = sndUrl("am-" + want);
    if (fu) {
      const vol = 0.55 * (S.ambVol?.[want] ?? 1), L = { file: true, on: true, cur: null, tm: 0, vol, ducked: false };
      const next = () => {
        if (!L.on) return;
        const p = sndPlay(fu, 0.0001, false); p.set(L.ducked ? vol * 0.45 : vol, 2.5); L.cur = p;
        const arm = () => { const d = p.a.duration; if (!isFinite(d) || d < 6) { p.a.loop = true; return; } L.tm = setTimeout(() => { if (!L.on) return; p.stop(2.5); next(); }, (d - 2.6) * 1000); };
        if (isFinite(p.a.duration)) arm(); else p.a.addEventListener("loadedmetadata", arm, { once: true });
      };
      L.stop = () => { L.on = false; clearTimeout(L.tm); L.cur?.stop(1.6); };
      next(); amb = L; return;
    }
    // tên âm nền mới (pub, wind…) chưa có file → âm tổng hợp gần nhất
    const FB = { pub: "room", wind: "sea", harbour: "sea", night: "sea", gulls: "sea", storm: "rain", hut: "sea" };
    const PS = { sea: [380, "lowpass", 0.16, 0.09], rain: [3200, "bandpass", 0.07, 0], room: [180, "lowpass", 0.05, 0], hall: [260, "lowpass", 0.05, 0] };
    const P = PS[want] || PS[FB[want]];
    if (!P) return;
    const s = a.createBufferSource(), fl = a.createBiquadFilter(), g = a.createGain();
    s.buffer = noise(); s.loop = true; fl.type = P[1]; fl.frequency.value = P[0]; if (P[1] === "bandpass") fl.Q.value = 0.4;
    g.gain.setValueAtTime(0.0001, t); g.gain.setTargetAtTime(P[2], t, 1.2);
    s.connect(fl).connect(g).connect(a.destination); s.start();
    let l = null;
    if (P[3]) { l = a.createOscillator(); const lg = a.createGain(); l.frequency.value = 0.13; lg.gain.value = P[3]; l.connect(lg).connect(g.gain); l.start(); }
    amb = { s, g, l };
  };
  // hạ âm nền khi đang đọc lời (giọng sẵn) → nghe rõ chữ; đọc xong nâng lại
  E.duck = on => { if (!amb?.file || amb.ducked === !!on) return; amb.ducked = !!on; amb.cur?.set(on ? amb.vol * 0.45 : amb.vol, on ? 0.25 : 0.9); };
  E.ambStop = () => { const k = ambWant; E.amb(""); ambWant = k; };

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
    // TRONG APP: mọi từ → thẻ tra nhanh của Enmi (như truyện nhập vai / video; kèm câu chứa từ + vị trí chữ để thẻ mở cạnh đó);
    //   từ có trong sổ từ vụ án thì ghi luôn vào Sổ tay (tab Từ). Chạy riêng ngoài app → ô nhỏ của game như cũ.
    if (sdk?.lookup) {
      if (g && !G.words[w]) { G.words[w] = Date.now(); saveG(); }
      E.hush(); const r = el.getBoundingClientRect(); sdk.lookup(w, { ctx: el.closest(".se-txt,.se-lg,.se-pope")?.textContent || "", rect: { left: r.left, top: r.top, right: r.right, bottom: r.bottom } }).catch(() => {}); return; }
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

  // ẢNH VẬT PHẨM: ảnh minh hoạ img/it-<mã>.jpg (class im-it-<mã> do art-css.js sinh) phủ lên icon — chưa có ảnh thì vẫn thấy icon
  E.itemArt = (id, cls = "") => { const it = S.items?.[id]; return `<span class="se-ia ${cls}"><span class="ic">${ICON[it?.icon] || ICON.box}</span><i class="im-it-${esc(id)}"></i></span>`; };
  // SỔ TAY: dựng bảng 1 lần; đổi tab chỉ thay phần thân (trước: dựng lại cả bảng mỗi lần chạm tab → bảng trượt lại + nhảy lên đầu)
  const bookBody = tab => {
    if (tab === "items") {
      if (!R.items.length) return `<p class="se-mute">—</p>`;
      const card = id => { const it = S.items[id]; return `<button class="se-itc" data-it="${esc(id)}">${E.itemArt(id)}<b>${esc(E.nat(it?.name) || id)}</b></button>`; };
      const live = E.bag(), old = R.items.filter(id => !live.includes(id)), nc = E.canCombine();
      return `${nc ? `<p class="se-itcm">${esc(E.nat(nc > 1 ? { en: `${nc} pairs of items can be combined. Tap an item, then “Combine with…”.`, vi: `Có ${nc} cặp đồ ghép được. Chạm 1 món rồi “Ghép với…”.` } : { en: "Two of your items can be combined. Tap an item, then “Combine with…”.", vi: "Có 2 món đồ ghép được với nhau. Chạm 1 món rồi “Ghép với…”." }))}</p>` : ""}
        ${live.length ? `<div class="se-itg">${live.map(card).join("")}</div>` : `<p class="se-mute">—</p>`}
        ${old.length ? `<details class="se-itold"><summary>${esc(E.nat({ en: `No longer needed (${old.length})`, vi: `Không cần nữa (${old.length})` }))}</summary><div class="se-itg">${old.map(card).join("")}</div></details>` : ""}`;
    }
    if (tab === "truths") {
      const n = S.truthTotal || Object.keys(S.truths || {}).length;
      const ids = Object.keys(S.truths || {});
      return `<p class="se-mute">${Object.keys(G.truths).length} / ${n}</p>` + Array.from({ length: n }, (_, i) => {
        const id = ids[i], t = id && S.truths[id], known = id && G.truths[id];
        return known ? `<div class="se-tr on"><span>T${i + 1}</span><div><b>${esc(E.nat(t.name))}</b><p>${esc(E.nat(t.text))}</p></div></div>` : `<div class="se-tr"><span>T${i + 1}</span><div><b>???</b></div></div>`;
      }).join("");
    }
    // NHÂN VẬT: biết từ trước (known) + đã gặp trong lần chơi này → đủ mặt / tên / vai + điều đã biết thêm (c.notes: [{ if, t }]);
    //   còn lại (truyện có, chưa gặp) → bóng đen ??? (số người chưa gặp = tò mò)
    if (tab === "people") {
      const ids = Object.keys(S.chars).filter(id => !S.chars[id].hideInBook && S.chars[id].role);
      const st = E.state();
      const row = id => {
        const c = S.chars[id], v = +R.f[id] || 0;
        if (!E.known(id)) return `<div class="se-pp hid" style="--c:#555"><div class="se-ppi">${SIL("#333", "pp-" + id)}<i class="im-${id}"></i></div><div><b>${esc(c.alias ? E.nat(c.alias) : "???")}</b><p>${esc(E.nat(c.hint || { en: "Not met yet", vi: "Chưa gặp" }))}</p></div></div>`;
        const tr = id in R.f ? (v >= 2 ? T("trustHi") : v <= -1 ? T("trustLo") : T("trustMid")) : "";
        const more = (c.notes || []).filter(n => { try { return !n.if || n.if(st); } catch { return false; } }).map(n => `<li>${esc(E.nat(n.t))}</li>`).join("");
        return `<div class="se-pp" style="--c:${c.color}"><div class="se-ppi">${SIL(c.color, "pp-" + id)}<i class="im-${id}"></i></div><div><b>${esc(cname0(c))}</b><p>${esc(E.nat(c.role))}</p>${more ? `<ul class="se-ppn">${more}</ul>` : ""}${tr ? `<em>${tr}</em>` : ""}</div></div>`;
      };
      return ids.sort((a, b) => E.known(b) - E.known(a)).map(row).join("") || `<p class="se-mute">—</p>`;
    }
    return Object.keys(G.words).length ? Object.keys(G.words).map(w => { const g = S.words?.[w]; return `<div class="se-wd"><b>${esc(w)}</b><span>${esc(g?.[E.N] || g?.vi || "")}</span></div>`; }).join("") : `<p class="se-mute">${E.nat({ en: "Tap a highlighted word in the story to save it.", vi: "Chạm vào từ được tô trong truyện để lưu." })}</p>`;
  };
  // xem 1 vật: ảnh lớn + tên + mô tả, đè lên Sổ tay (không dựng lại Sổ tay); chạm đâu cũng đóng
  E.ui.itemView = id => {
    const it = S.items?.[id]; if (!it) return;
    $(".se-iv", root)?.remove();
    // ghép được ở bất cứ lúc nào: “Ghép với…” → chọn món kia trong túi (không lộ cặp nào đúng)
    const others = R.items.filter(x => x !== id), cmb = (S.combos || []).length && others.length;
    const v = h(`<div class="se-iv"><div class="se-ivc">${E.itemArt(id, "lg")}<b>${esc(E.nat(it.name))}</b><p>${esc(E.nat(it.desc))}</p>
      ${cmb ? `<button class="se-btn wide" data-cw>${esc(E.nat({ en: "Combine with…", vi: "Ghép với…" }))}</button><div class="se-cwl" hidden>${others.map(x => `<button class="se-bi" data-cwi="${esc(x)}" aria-label="${esc(E.nat(S.items[x]?.name) || x)}">${E.itemArt(x, "sm")}<small>${esc(E.nat(S.items[x]?.name) || x)}</small></button>`).join("")}</div><p class="se-cwm" hidden></p>` : ""}
      <small>${T("close")}</small></div></div>`);
    root.appendChild(v);
    const shut = () => { v.classList.add("out"); setTimeout(() => v.remove(), 220); };
    v.onclick = e => {
      if (e.target.closest("[data-cw]")) { e.target.closest("[data-cw]").hidden = true; $(".se-cwl", v).hidden = false; return E.sfx("tap"); }
      const w = e.target.closest("[data-cwi]");
      if (w) {
        const r = E.combine(id, w.dataset.cwi), m = $(".se-cwm", v);
        m.hidden = false;
        if (!r.ok) { E.sfx("wrong"); m.textContent = E.nat(r.done ? { en: "You've already combined these.", vi: "Hai món này bạn ghép rồi." } : { en: `${E.nat(it.name)} and ${E.nat(S.items[w.dataset.cwi]?.name)} don't go together.`, vi: `${E.nat(it.name)} và ${E.nat(S.items[w.dataset.cwi]?.name)} không ghép được.` }); return; }
        shut(); E.ui.closeSheet();
        E.ui.toast(r.make ? `${E.ICON.box}<span><small>${esc(E.nat({ en: "New item", vi: "Đồ mới" }))}</small><b>${esc(E.nat(S.items[r.make]?.name) || r.make)}</b></span>` : esc(E.nat({ en: "Combined.", vi: "Đã ghép." })), 2600, "item");
        return;
      }
      if (e.target.closest(".se-cwl")) return;
      shut();
    };
    E.sfx("tap");
  };
  E.ui.book = (tab = "items") => {
    E.ui.dot(false);
    const tabs = ["items", "truths", "people", "words"].map(t => `<button class="se-tab${t === tab ? " on" : ""}" data-tab="${t}">${T(t)}</button>`).join("");
    const sh = E.ui.sheet(T("notebook"), `<div class="se-tabs">${tabs}</div><div class="se-bookb">${bookBody(tab)}</div>`, "tall");
    const body = $(".se-bookb", sh), scr = $(".se-shb", sh);
    // .se-sheet dùng lại 1 phần tử → onclick (addEventListener cộng dồn mỗi lần mở Sổ tay)
    const base = sh.onclick;
    sh.onclick = e => {
      base?.(e);
      const b = e.target.closest("[data-tab]");
      if (b) {
        if (b.classList.contains("on")) return;
        sh.querySelectorAll("[data-tab]").forEach(x => x.classList.toggle("on", x === b));
        body.innerHTML = bookBody(b.dataset.tab);
        if (scr) scr.scrollTop = 0;
        return E.sfx("tap");
      }
      const it = e.target.closest("[data-it]");
      if (it) E.ui.itemView(it.dataset.it);
    };
  };

  // sơ đồ nhánh: dòng thời gian dọc — mốc có ảnh cảnh (chạm = chơi lại từ đó), nhánh = chip (đã đi / ?), kết thúc = huy hiệu
  E.ui.flowSheet = () => {
    const rows = {};
    for (const x of S.flow || []) (rows[(x.ch || 0) * 100 + x.row] ||= []).push(x);
    const keys = Object.keys(rows).map(Number).sort((a, b) => a - b);
    let lastCh = -1, html = "", open = false;
    const close = () => { if (open) { html += "</div>"; open = false; } };
    for (const k of keys) {
      const ch = Math.floor(k / 100), row = rows[k];
      if (ch !== lastCh) { close(); html += `<div class="se-flch">${esc(E.nat({ en: "Chapter " + ch, vi: "Chương " + ch }))}</div><div class="se-tl">`; open = true; lastCh = ch; }
      const kind = row[0].kind;
      if (kind === "cp") for (const x of row) {
        const on = !!G.cps[x.id];
        html += `<div class="se-tlr${on ? " on" : ""}"><button class="se-fn" ${on ? `data-cp="${x.id}"` : "disabled"}><span class="se-fth">${x.scene ? `<i class="im-${esc(x.scene)}"></i>` : ""}</span><span><b>${on ? esc(E.nat(x.label)) : "???"}</b>${on && x.sum ? `<span class="se-fsum">${esc(E.nat(x.sum))}</span>` : ""}<small>${on ? "↺ " + T("replayHere") : T("locked")}</small></span></button></div>`;
      }
      if (kind === "opt") html += `<div class="se-fops">${row.map(x => { const on = !!G.opts[x.key + ":" + x.val]; return `<span class="se-fop${on ? " on" : ""}">${on ? esc(E.nat(x.label)) : "?"}</span>`; }).join("")}</div>`;
      if (kind === "end") html += `<div class="se-fends">${row.map(x => { const on = !!G.endings[x.id], en = S.endings?.[x.id]; return `<div class="se-fend${on ? " on" : ""}"><b>${on ? esc(E.nat(x.label)) : "???"}</b><small>${on && en?.sum ? esc(E.nat(en.sum)) : T("endings")}</small></div>`; }).join("")}</div>`;
    }
    close();
    const t = Object.keys(G.truths).length, n = S.truthTotal || 0;
    const opts = (S.flow || []).filter(x => x.kind === "opt"), ends = (S.flow || []).filter(x => x.kind === "end");
    const exp = opts.filter(x => G.opts[x.key + ":" + x.val]).length + ends.filter(x => G.endings[x.id]).length;
    const sh = E.ui.sheet(T("flow"), `<div class="se-flsum"><div><b>${t}/${n}</b><small>${T("truths")}</small></div><div><b>${exp}/${opts.length + ends.length}</b><small>${esc(E.nat({ en: "Branches", vi: "Nhánh" }))}</small></div><div><b>${Object.keys(G.endings).length}</b><small>${T("endings")}</small></div></div>${html}`, "tall");
    sh.querySelectorAll("[data-cp]").forEach(b => (b.onclick = () => { E.sfx("whoosh"); E.ui.closeSheet(); E.ui.clear(); top.hidden = false; E.stop(); E.ui.hide("*"); setTimeout(() => E.fromCp(b.dataset.cp), 50); }));
  };

  // ───────── CÀI ĐẶT (29/10, người dùng: “gọn, chuẩn”) — 1 bộ dùng chung cho màn tổng quan + menu trong game, chia nhóm:
  //   Ngôn ngữ (lời dẫn bằng tiếng gốc / tiếng đang học · luôn dịch) · Giọng đọc (lời hội thoại · lời dẫn truyện) · Âm thanh (hiệu ứng ·
  //   không khí) · Luyện nói (nói theo câu đã chọn — chỉ khi chơi trong app). Chạm = đổi ngay, KHÔNG vẽ lại bảng.
  const langName = c => { try { const n = new Intl.DisplayNames([E.N], { type: "language" }).of(c); return n ? n[0].toUpperCase() + n.slice(1) : c; } catch { return c; } };
  E.langName = langName;
  const sw = (k, on) => `<button class="se-ovo" data-ov="${k}"><span><b>${T("o_" + k)}</b><small>${T("o_" + k + "_d")}</small></span><i class="se-sw${on ? " on" : ""}"></i></button>`;
  const optsHtml = () => `
    <div class="se-og"><h4>${T("g_lang")}</h4><div class="se-ovos">
      <div class="se-ovo st"><span><b>${T("o_narr")}</b><small>${T("o_narr_d")}</small></span></div>
      <div class="se-seg in">${[["bi", E.N], ["imm", E.L]].map(([m, c]) => `<button data-m="${m}" class="${G.set.mode === m ? "on" : ""}">${esc(langName(c))}</button>`).join("")}</div>
      ${sw("tr", G.set.tr)}</div></div>
    <div class="se-og"><h4>${T("g_text")}</h4><div class="se-ovos"><div class="se-ovo st"><span><b>${T("o_speed")}</b><small>${T("o_speed_d")}</small></span></div>
      <div class="se-seg in">${[[0.7, "sp_slow"], [1, "sp_mid"], [1.6, "sp_fast"], [0, "sp_now"]].map(([v, k]) => `<button data-sp="${v}" class="${(G.set.speed ?? 1) === v ? "on" : ""}">${T(k)}</button>`).join("")}</div></div></div>
    <div class="se-og"><h4>${T("g_voice")}</h4><div class="se-ovos">${sw("vDlg", G.set.vDlg)}${sw("vNarr", G.set.vNarr)}${E.recHas() ? sw("vRec", G.set.vRec !== false) : ""}</div></div>
    <div class="se-og"><h4>${T("g_sound")}</h4><div class="se-ovos">${sw("sfx", G.set.sfx)}${sw("amb", G.set.amb)}</div></div>
    ${SDK()?.shadow ? `<div class="se-og"><h4>${T("g_speak")}</h4><div class="se-ovos">${sw("shadow", G.set.shadow)}</div></div>` : ""}`;
  // 1 bộ nghe chạm cho cả khối (gắn vào phần tử chứa optsHtml)
  const bindOpts = el => el.addEventListener("click", e => {
    const b = e.target.closest("[data-ov]");
    if (b) {
      const o = b.dataset.ov;
      if (o === "tr") E.ui.setTr(!G.set.tr);
      else { G.set[o] = !G.set[o]; saveG(); }
      if ((o === "vDlg" || o === "vNarr") && !G.set[o]) E.hush();
      if (o === "amb") E.amb(ambWant);
      b.querySelector(".se-sw").classList.toggle("on", !!G.set[o]);
      return E.sfx("tap");
    }
    const sp = e.target.closest("button[data-sp]");
    if (sp) { G.set.speed = +sp.dataset.sp; saveG(); el.querySelectorAll("button[data-sp]").forEach(x => x.classList.toggle("on", x === sp)); return E.sfx("tap"); }
    const m = e.target.closest("button[data-m]");
    if (m) { G.set.mode = m.dataset.m; saveG(); el.querySelectorAll("button[data-m]").forEach(x => x.classList.toggle("on", x === m)); E.sfx("tap"); }
  });
  // BẠN LÀ AI: tên + giới tính (đổi được) + vai trong truyện (story.me.role) + điều bạn giấu (story.me.goal)
  const meCard = () => `<div class="se-me" style="--c:var(--se-me)"><span class="se-mep">${SIL("#f2b84b", "me-av")}${S.me?.img ? `<i class="im-${esc(E.meImg?.() || S.me.img)}"></i>` : ""}</span>
    <span class="se-met"><b>${esc(G.set.name || "An")}</b>${S.me?.role ? `<em>${esc(E.nat(S.me.role))}</em>` : ""}${S.me?.goal ? `<p>${esc(E.nat(S.me.goal))}</p>` : ""}</span>
    <button class="se-ib sm" data-me aria-label="${T("editMe")}">${ICON.pen}</button></div>`;
  // tên / giới tính đã cố định theo truyện (story.me.name / story.me.g) → chỉ hiện, không cho sửa
  const meHtml = () => `${S.me?.img ? `<div class="se-mebig"><i class="im-${esc(E.meImg?.() || S.me.img)}"></i></div>` : ""}${S.me?.name ? `<div class="se-fl">${T("yourName")}<b class="se-fixed">${esc(G.set.name)}</b></div>` : `<label class="se-fl">${T("yourName")}<input class="se-in" data-name maxlength="16" value="${esc(G.set.name)}"></label>`}
    ${S.me?.g ? `<div class="se-fl">${T("gender")}<b class="se-fixed">${T(S.me.g === "M" ? "male" : "female")}</b></div>` : `<div class="se-fl">${T("gender")}<div class="se-seg">${["M", "F"].map(g => `<button data-g="${g}" class="${G.set.g === g ? "on" : ""}">${T(g === "M" ? "male" : "female")}</button>`).join("")}</div></div>`}`;
  const bindMe = (sh, onDone) => {
    sh.querySelectorAll("[data-g]").forEach(b => (b.onclick = () => { G.set.g = b.dataset.g; sh.querySelectorAll("[data-g]").forEach(x => x.classList.toggle("on", x === b)); saveG(); }));
    const n = sh.querySelector("[data-name]"); if (n) n.oninput = () => { G.set.name = n.value.trim() || "An"; saveG(); onDone?.(); };
  };
  E.ui.menu = () => {
    const sh = E.ui.sheet(T("menu"), `<button class="se-btn wide" data-rc>${E.nat({ en: "Story so far", vi: "Tóm tắt truyện" })}</button>${optsHtml()}<div class="se-row"><button class="se-btn" data-new>${T("newGame")}</button><button class="se-btn" data-home>${E.nat({ en: "Overview", vi: "Màn tổng quan" })}</button>${SDK()?.close ? `<button class="se-btn" data-exit>${E.nat({ en: "Back to Enmi", vi: "Về Enmi" })}</button>` : ""}</div>`, "tall");
    bindOpts($(".se-shb", sh));
    sh.querySelector("[data-rc]").onclick = () => E.ui.recap(false);
    // xác nhận = chạm lần 2 (iframe sandbox của app chặn confirm())
    const nb = sh.querySelector("[data-new]");
    nb.onclick = () => {
      if (!nb.dataset.ok) { nb.dataset.ok = 1; nb.classList.add("pri"); nb.textContent = E.nat({ en: "Tap again to restart", vi: "Chạm lần nữa để chơi lại" }); E.ui.toast(esc(T("restartConfirm")), 3200); return; }
      E.ui.closeSheet(); E.stop(); E.ui.hide("*"); E.newRun();
    };
    sh.querySelector("[data-home]").onclick = () => { E.ui.closeSheet(); E.stop(); E.save(); E.ui.title(); };
    const ex = sh.querySelector("[data-exit]"); if (ex) ex.onclick = () => { E.save(); E.hush(); setTimeout(() => SDK().close(), 300); };
  };
  // MÀN TỔNG QUAN (người dùng 28/10: “như truyện nhập vai — có màn ngoài bao quát”): ảnh bìa + tên + giới thiệu, Tiếp tục / Chơi lại,
  //   nhân vật, kết thúc đã mở (sưu tầm), sự thật đã tìm, tuỳ chọn (luôn dịch · nói theo · giọng đọc · âm thanh · ngôn ngữ dẫn truyện).
  //   Trong app (toàn màn hình) có nút ‹ về Enmi ở góc trên.
  E.ui.title = () => {
    E.explore = false;
    E.ui.reset(); E.ui.hide("*");
    if (S.titleScene) E.ui.scene(S.titleScene);
    top.hidden = true;
    const has = E.hasRun(), sdk = SDK();
    const t = Object.keys(G.truths).length, ends = Object.entries(S.endings || {}), got = ends.filter(([id]) => G.endings[id]).length;
    // NHÂN VẬT: người nhân vật chính biết từ trước (known: true) + người đã gặp ở bất kỳ lần chơi nào → hiện mặt, tên, vai;
    //   chưa gặp → bóng đen, ???, “Chưa gặp” (người dùng 29/10: khi nào gặp mới hiện). Biết trước đứng đầu.
    const cast = Object.entries(S.chars || {}).filter(([, c]) => !c.hideInBook && c.role)
      .sort(([a, x], [b, y]) => (y.known === true) - (x.known === true))
      .map(([id, c]) => { const k = c.known === true || !!G.known[id]; return `<div class="se-ovm${k ? "" : " hid"}" style="--c:${k ? c.color || "#aaa" : "#555"}"><span class="se-ovp">${SIL(k ? c.color || "#888" : "#333", "ov-" + id)}<i class="im-${id}"></i></span><b>${esc(k ? cname0(c, true) : "???")}</b><small>${esc(k ? E.nat(c.role) : E.nat(c.hint || { en: "Not met yet", vi: "Chưa gặp" }))}</small></div>`; }).join("");
    // CHƯƠNG (gọn — người dùng 29/10): hàng số chương + CHỈ 1 thẻ chương đang chọn; đường đi các mốc thu gọn trong “Đường đi”.
    //   Chương chưa nạp (truyện album, chưa tải) → chỉ hiện tên + tóm tắt; chạy riêng / đã tải → nạp để có đường đi.
    const flow = () => S.flow || [];
    const chs = S.chapters?.length ? S.chapters : [...new Set(flow().map(x => x.ch || 0))].filter(Boolean).map(ch => ({ ch }));
    const saved = store.get(KEY + ".r", null);
    let curCh = Math.max(1, Math.min(chs.length || 1, saved?.ch || 1));
    const chCard = c => {
      const cps = flow().filter(x => x.kind === "cp" && (x.ch || 0) === c.ch), on = cps.filter(x => G.cps[x.id]);
      const path = cps.map((x, i) => { const ok = !!G.cps[x.id]; return `<button class="se-ovpt${ok ? " on" : ""}" ${ok ? `data-cp="${esc(x.id)}"` : "disabled"}><span class="se-ovpi">${ok && x.scene ? `<i class="im-${esc(x.scene)}"></i>` : `<em>${i + 1}</em>`}</span><span class="se-ovpx"><b>${ok ? esc(E.nat(x.label)) : "???"}</b><small>${ok ? esc(E.nat(x.sum)) : T("locked")}</small></span>${ok ? `<i class="se-ovre" aria-label="${T("replayHere")}">${ICON.replay}</i>` : ""}</button>`; }).join("");
      const open = !c.soon && E.chOpen(c.ch), done = !!G.chDone[c.ch];
      const act = c.soon ? "" : open
        ? `<button class="se-btn${has ? "" : " pri"} wide se-ovgo" data-play-ch="${c.ch}">${ICON.play} ${esc(E.nat(done ? { en: "Replay chapter " + c.ch, vi: "Chơi lại chương " + c.ch } : { en: "Play chapter " + c.ch, vi: "Chơi chương " + c.ch }))}</button>`
        : `<p class="se-ovlk">${ICON.lock}<span>${esc(E.nat({ en: `Finish chapter ${c.ch - 1} to unlock`, vi: `Xong chương ${c.ch - 1} để mở` }))}</span></p>`;
      return `<div class="se-ovch${c.soon ? " soon" : ""}${!c.soon && !open ? " lk" : ""}${done ? " done" : ""}"><div class="se-ovchh"><span class="se-ovno">${c.soon || !open ? ICON.lock : c.ch}</span><span><small>${esc(E.nat({ en: "Chapter " + c.ch, vi: "Chương " + c.ch }))}${c.soon ? " · " + T("soon") : cps.length ? ` · ${on.length}/${cps.length}` : ""}</small><b>${esc(E.nat(c.title) || "")}</b></span>${done ? `<i class="se-ovok" aria-label="${esc(E.nat({ en: "Finished", vi: "Đã xong" }))}">✓</i>` : ""}</div>${c.sum ? `<p>${esc(E.nat(c.sum))}</p>` : ""}${act}${!c.soon && cps.length ? `<details class="se-ovdt"${on.length ? "" : ""}><summary>${esc(E.nat({ en: "Your path", vi: "Đường đi" }))} <small>${on.length}/${cps.length}</small></summary><div class="se-ovpath">${path}</div></details>` : ""}</div>`;
    };
    const chPills = () => chs.length > 1 ? `<div class="se-ovpills">${chs.map(c => `<button data-ch="${c.ch}" class="${c.ch === curCh ? "on" : ""}${c.soon ? " soon" : !E.chOpen(c.ch) ? " lk" : G.chDone[c.ch] ? " done" : ""}">${c.soon || !E.chOpen(c.ch) ? ICON.lock : c.ch}</button>`).join("")}</div>` : "";
    const gotEnds = ends.filter(([id]) => G.endings[id]);
    const endRow = `<button class="se-ovend1" data-go="flow"><span><b>${T("endings")}</b><small>${gotEnds.length ? gotEnds.slice(-2).map(([, en]) => esc(E.nat(en.title))).join(" · ") : esc(E.nat({ en: "None yet", vi: "Chưa có" }))}</small></span><em>${got}/${ends.length}</em><i class="se-ovdots">${ends.map(([id]) => `<u class="${G.endings[id] ? "on" : ""}"></u>`).join("")}</i></button>`;
    const el = E.ui.panel(`<div class="se-ov">
      ${sdk?.close ? `<button class="se-ib se-ovx" data-go="exit" aria-label="${esc(E.nat({ en: "Back to Enmi", vi: "Về Enmi" }))}">${ICON.back}</button>` : ""}
      <div class="se-ovc"><i class="im-${esc(S.titleScene || "")}"></i><i class="im-cover"></i><span class="se-ovt">
        ${S.genre ? `<em>${esc([E.nat(S.genre), S.level].filter(Boolean).join(" · "))}</em>` : ""}
        <b>${esc(E.tgt(S.title))}</b>${E.nat(S.title) !== E.tgt(S.title) ? `<i>${esc(E.nat(S.title))}</i>` : ""}</span></div>
      <div class="se-ovb">
        ${S.tagline ? `<p class="se-ovd">${esc(E.nat(S.desc || S.tagline))}</p>` : ""}
        ${has ? `<div class="se-row"><button class="se-btn pri" data-go="cont">${ICON.play} ${T("cont")}</button><button class="se-btn" data-go="new">${T("restart")}</button></div>`
          : `<button class="se-btn pri wide" data-go="new">${ICON.play} ${T("start")}</button>`}
        <div data-mebox>${meCard()}</div>
        ${chs.length ? `<h3 class="se-ovh">${T("chapters")}</h3>${chPills()}<div data-chbox>${chCard(chs.find(c => c.ch === curCh) || chs[0])}</div>` : ""}
        ${cast ? `<h3 class="se-ovh">${T("cast")}</h3><div class="se-ovcast">${cast}</div>` : ""}
        <div class="se-ovs2">${ends.length ? endRow : ""}${S.truthTotal ? `<button class="se-ovtr" data-go="truths"><b>${t}/${S.truthTotal}</b><small>${T("truths")}</small></button>` : ""}</div>
        <details class="se-ovopt"><summary>${T("opts")}</summary><div data-opts>${optsHtml()}</div></details>
        <p class="se-mute se-ovn">${T("ovNote")}</p>
      </div></div>`, "ov");
    el.onclick = e => {
      if (e.target.closest("[data-opts]")) return;
      if (e.target.closest("[data-me]")) {
        const sh = E.ui.sheet(T("editMe"), `${meHtml()}<button class="se-btn pri wide" data-x>${T("done")}</button>`);
        bindMe(sh);
        sh.onclose = () => { const mb = el.querySelector("[data-mebox]"); if (mb) mb.innerHTML = meCard(); };
        return E.sfx("tap");
      }
      const pill = e.target.closest("[data-ch]");
      if (pill) {
        curCh = +pill.dataset.ch; el.querySelectorAll("[data-ch]").forEach(b => b.classList.toggle("on", b === pill));
        const box = el.querySelector("[data-chbox]"), meta = chs.find(c => c.ch === curCh);
        box.innerHTML = chCard(meta); E.sfx("page");
        // chương chưa có đường đi: nạp nếu file đã sẵn (chạy riêng / đã tải trong app) — KHÔNG tự tải gói mới chỉ để xem
        const ie = document.querySelector(`[data-chapter="${curCh}"]`), src = ie?.getAttribute("src") || "";
        if (ie && !flow().some(x => x.ch === curCh) && (!SDK()?.chapter || src.startsWith("blob:"))) E.loadChapter(curCh).then(() => { if (curCh === meta.ch) box.innerHTML = chCard(meta); });
        return;
      }
      const pc = e.target.closest("[data-play-ch]");
      if (pc) {
        return E.ui.replayAsk({ ch: +pc.dataset.playCh });
      }
      const cp = e.target.closest("[data-cp]")?.dataset.cp;
      if (cp) return E.ui.replayAsk({ cp });
      const go = e.target.closest("[data-go]")?.dataset.go; if (!go) return;
      if (go === "exit") { E.save(); E.hush(); return setTimeout(() => SDK().close(), 300); }
      if (go === "cont") { top.hidden = false; E.ui.clear(); R = store.get(KEY + ".r", NEW_R()); E.resume(); }
      if (go === "flow") { R = store.get(KEY + ".r", NEW_R()); E.ui.flowSheet(); }
      if (go === "truths") { R = store.get(KEY + ".r", NEW_R()); E.ui.book("truths"); }
      if (go === "new") {
        const sh = E.ui.sheet(T("newGame"), `${meHtml()}<button class="se-btn pri wide" data-st>${T("start")}</button>`);
        bindMe(sh);
        sh.querySelector("[data-st]").onclick = () => { E.ui.closeSheet(); E.ui.clear(); top.hidden = false; E.newRun(); };
      }
    };
    bindOpts(el.querySelector("[data-opts]"));
    top.querySelector(".se-trall")?.classList.toggle("on", !!G.set.tr);
    if (E.auto) { top.hidden = false; E.ui.clear(); E.newRun(); }
  };

  const ICON = {
    menu: `<svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>`,
    back: `<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>`,
    replay: `<svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4"/></svg>`,
    lock: `<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>`,
    play: `<svg viewBox="0 0 24 24" class="fill"><path d="M8 5.5v13l11-6.5z"/></svg>`,
    mic: `<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>`,
    log: `<svg viewBox="0 0 24 24"><path d="M5 5h14v14H5zM8 9h8M8 12h8M8 15h5"/></svg>`,
    book: `<svg viewBox="0 0 24 24"><path d="M6 4h11a1 1 0 0 1 1 1v15H7a2 2 0 0 1-2-2V5a1 1 0 0 1 1-1zM5 18a2 2 0 0 1 2-2h11M9 8h6"/></svg>`,
    flow: `<svg viewBox="0 0 24 24"><circle cx="6" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="12" r="2"/><path d="M6 7v10M6 12h4c2 0 3-0 6 0"/></svg>`,
    spk: `<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9zM16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/></svg>`,
    next: `<svg viewBox="0 0 24 24"><path d="M7 9l5 5 5-5"/></svg>`,
    tr: `<svg viewBox="0 0 24 24"><path d="M4 5h9M8.5 3v2M6 5c0 4 3 7 6 8M11 5c-1 4-4 7-7 8M13 21l4-9 4 9M14.5 18h5"/></svg>`,
    x: `<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>`,
    box: `<svg viewBox="0 0 24 24"><path d="M4 8l8-4 8 4v8l-8 4-8-4zM4 8l8 4 8-4M12 12v8"/></svg>`,
    photo: `<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-8 8"/></svg>`,
    clock: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/></svg>`,
    card: `<svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="8.5" cy="12" r="2"/><path d="M13 10h5M13 14h4"/></svg>`,
    sandal: `<svg viewBox="0 0 24 24"><path d="M8 3c3 0 5 3 5 8s-1 10-4 10-4-3-4-9 0-9 3-9zM6 9h7M6 13h7"/></svg>`,
    pen: `<svg viewBox="0 0 24 24"><path d="M4 20l4-1 11-11-3-3L5 16zM14 6l3 3"/></svg>`,
    phone: `<svg viewBox="0 0 24 24"><rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/></svg>`,
    key: `<svg viewBox="0 0 24 24"><circle cx="8" cy="12" r="4"/><path d="M12 12h9M18 12v3M21 12v2"/></svg>`,
    shoe: `<svg viewBox="0 0 24 24"><path d="M3 15c0-2 1-6 2-8 2 0 3 2 6 3l4 2c3 1 6 1 6 4v2H3zM3 17h18M9 11l1-2M12 12l1-2"/></svg>`,
    bulb: `<svg viewBox="0 0 24 24"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z"/></svg>`,
    doc: `<svg viewBox="0 0 24 24"><path d="M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h5"/></svg>`,
  };
  E.ICON = ICON;

  // ───────── khởi động ─────────
  E.boot = async (story, host = document.body) => {
    S = story || E.merge(BASE || {}, PARTS);
    E.normNodes(S.nodes); E.normNodes(S.places); E.normNodes(S.talks); E.normNodes(S.events);
    KEY = "se." + S.id;
    // truyện cần engine mới hơn → báo rõ (không chạy bừa rồi lỗi giữa chừng)
    if (S.engine && parseInt(S.engine) > parseInt(E.VERSION)) { host.innerHTML = `<p style="padding:24px;color:#eee;font:16px system-ui">This story needs Enmi Story Engine ${esc(S.engine)} (installed: ${E.VERSION}).</p>`; return; }
    if (SDK()) { try { MEM = (await SDK().load()) || {}; } catch { MEM = {}; } if (typeof MEM !== "object") MEM = {}; }
    G = Object.assign(NEW_G(), store.get(KEY + ".g", {}));
    G.set = Object.assign(NEW_G().set, G.set);
    // NHÂN VẬT CHÍNH cố định theo truyện (người dùng 30/10): truyện cần thì khoá giới tính / tên — không hỏi người chơi
    if (S.me?.g === "F" || S.me?.g === "M") G.set.g = S.me.g;
    if (S.me?.name) G.set.name = typeof S.me.name === "string" ? S.me.name : (S.me.name.en || Object.values(S.me.name)[0]);
    // bản lưu cũ (trước 29/10 chưa có chDone): chương < chương đang chơi = đã xong · kết thúc đã mở thuộc chương nào = chương đó xong
    { const r0 = store.get(KEY + ".r", null); for (let c = 1; c < (r0?.ch || 0); c++) G.chDone[c] ||= 1;
      for (const id in G.endings) { const e = S.endings?.[id]; if (e?.ch && (e.next || e.final)) G.chDone[e.ch] ||= 1; }
      for (const id in G.cps) for (let c = 1; c < (G.cps[id]?.ch || 0); c++) G.chDone[c] ||= 1; }
    // cài đặt cũ → mới (29/10): voice → đọc lời hội thoại · sound → hiệu ứng + không khí · chế độ “Dễ” bỏ → lời dẫn tiếng gốc
    if ("voice" in G.set) { G.set.vDlg = G.set.voice !== false; delete G.set.voice; }
    if ("sound" in G.set) { G.set.sfx = G.set.amb = G.set.sound !== false; delete G.set.sound; }
    if (G.set.mode !== "imm") G.set.mode = "bi";
    // ngôn ngữ: ?lang= (thử) → SDK của app → trình duyệt; chỉ nhận ngôn ngữ truyện đã có bản dịch (story.natives / story.learns)
    let sdk = null; try { sdk = SDK(); } catch {}
    // lớp phủ khai báo bằng thẻ ẩn <i data-lang> → chỉ NẠP thứ tiếng người chơi đang học / đang dùng (không tải cả 4 bản dịch)
    { const want0 = Q.get("lang") || sdk?.lang || (navigator.language || "en").slice(0, 2), wl0 = Q.get("learn") || sdk?.learn;
      await Promise.all([...new Set([want0, wl0].filter(Boolean))].map(c => E.loadLang(c))); }
    // ngôn ngữ có lớp phủ (story/lang/<mã>.js) = vừa học được, vừa làm ngôn ngữ gốc được
    //   (lớp phủ phải có ≥ 60 % số câu mới tính — đang dịch dở thì chưa nhận làm thứ tiếng học; ngôn ngữ gốc thiếu câu thì app dịch bù lúc chạy)
    const total = (() => { let n = 0; const w = o => { if (Array.isArray(o)) return o.forEach(w); if (o && typeof o === "object") { if (typeof o.en === "string") n++; for (const k in o) if (typeof o[k] === "object") w(o[k]); } }; w(S.nodes); return n || 1; })();
    const ready = Object.keys(LINES).filter(c => Object.keys(LINES[c]).length >= total * 0.6);
    const natives = [...new Set([...(S.natives || ["en"]), ...ready])], learns = [...new Set([...(S.learns || ["en"]), ...ready])];
    const want = Q.get("lang") || sdk?.lang || (navigator.language || "en").slice(0, 2);
    const wl = Q.get("learn") || sdk?.learn;
    E.L = learns.includes(wl) ? wl : learns[0];
    // ngôn ngữ gốc phải KHÁC thứ tiếng học (người Anh không học tiếng Anh) → lấy ngôn ngữ gốc đầu tiên khác
    const okN = natives.filter(n => n !== E.L);
    // ngôn ngữ gốc truyện CHƯA dịch sẵn nhưng app dịch được (Enmi.translate) → vẫn dùng tiếng của người chơi (tự dịch lúc chạy, E.prefetch)
    E.N = okN.includes(want) ? want : want && want !== E.L && sdk?.translate && /^[a-z]{2}$/.test(want) ? want : okN[0] || natives[0];
    // thứ tiếng học có lớp phủ story/lang/<mã>.js mà chưa ghi trong learns → vẫn nhận
    if (wl && wl !== E.L && ready.includes(wl)) { E.L = wl; if (E.N === E.L) E.N = natives.find(n => n !== E.L) || "en"; }
    document.documentElement.lang = E.N;
    R = NEW_R();
    build(host);
    // cách dàn nhân vật: "focus" (mặc định — chỉ người nói đứng giữa, kiểu Choices / Episode) · "group" (mọi người cùng đứng)
    root.dataset.stage = S.stage || "focus";
    if (S.theme) for (const k in S.theme) root.style.setProperty("--se-" + k, S.theme[k]); // màu riêng của truyện: theme: { ac: "#e44", glass: "…" }
    E.emit("boot", S);
    if (Q.get("reset")) { G = NEW_G(); saveG(); store.del(KEY + ".r"); }
    if (Q.get("at")) { top.hidden = false; R = NEW_R(); E.jump(Q.get("at")); E.play(); return; }
    E.ui.title();
  };
})();
