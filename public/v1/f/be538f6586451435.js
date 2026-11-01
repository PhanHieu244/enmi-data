// Enmi Story Engine — SƠ ĐỒ NHÁNH kiểu Detroit: Become Human (nạp sau core.js, trước mech.js). Thay E.ui.flowSheet cũ.
// Dữ liệu = story.flow (giữ nguyên định dạng cũ, chỉ THÊM trường tuỳ chọn):
//   { ch, row, id, kind: "cp",  label, sum, scene }            mốc (cảnh) — chạm = xem “chuyện tới đây” của nhánh đó + chơi lại từ đây
//   { ch, row, kind: "opt", key, val, label, sum, hint }        1 nhánh của 1 quyết định (các opt cùng row = cùng 1 quyết định)
//   { ch, row, id, kind: "end", label, hint }                   kết thúc chương
//   sum = hậu quả / điều nhánh này dẫn tới (hiện khi đã khám phá) · hint = gợi ý mờ khi CHƯA khám phá (tuỳ chọn)
// 3 trạng thái mỗi ô (như Detroit): ĐANG ĐI (lần chơi này) · ĐÃ KHÁM PHÁ (lần chơi khác) · KHOÁ (chưa ai đi — ô có ổ khoá, không lộ chữ)
// Các row là hạng từ trái sang phải; mỗi hạng có nhiều làn nhánh. Chỉ vùng sơ đồ cuộn.
// Dây SVG đi sau thẻ, qua khe giữa các hạng hoặc vòng ngoài các thẻ khi bỏ qua cảnh.
(() => {
  const E = globalThis.StoryEngine, esc = E.esc, h = E.h;
  const nat = t => E.nat(t);
  const TX = {
    title: { en: "Flowchart", vi: "Sơ đồ nhánh" }, sum: { en: "Your path", vi: "Đường bạn đi" }, ch: { en: "Chapter", vi: "Chương" }, pro: { en: "Prologue", vi: "Mở đầu" },
    now: { en: "This playthrough", vi: "Lần chơi này" }, seen: { en: "Explored", vi: "Đã khám phá" }, lock: { en: "Unexplored", vi: "Chưa khám phá" },
    replay: { en: "Replay from here", vi: "Chơi lại từ đây" }, upto: { en: "What happened up to here (on that path)", vi: "Chuyện tới đây (theo nhánh đó)" },
    picked: { en: "You chose this", vi: "Bạn đã chọn" }, other: { en: "Chosen in another playthrough", vi: "Đã chọn ở lần chơi khác" },
    lockd: { en: "Nobody has taken this path yet. What happens if you choose differently?", vi: "Chưa đi nhánh này. Nếu chọn khác đi thì sao?" },
    end: { en: "Ending", vi: "Kết thúc" }, done: { en: "complete", vi: "hoàn thành" }, none: { en: "Nothing yet. Play to draw your path.", vi: "Chưa có gì. Chơi để vẽ đường đi." },
    cur: { en: "Your path this time", vi: "Đường đi lần này" }, story: { en: "Story so far", vi: "Tóm tắt" }, decisions: { en: "Decisions", vi: "Quyết định" },
    move: { en: "Scroll or drag the path. Select a card for details.", vi: "Cuộn hoặc kéo sơ đồ. Chọn thẻ để xem chi tiết." },
    viewport: { en: "Scrollable chapter path", vi: "Sơ đồ chương có thể cuộn" }, center: { en: "Find current path", vi: "Tìm tuyến đang chơi" },
    checkpoint: { en: "Checkpoint", vi: "Mốc truyện" }, branch: { en: "Choice", vi: "Lựa chọn" }, details: { en: "Path details", vi: "Chi tiết nhánh" }, close: { en: "Close details", vi: "Đóng chi tiết" },
  };
  const t = k => esc(nat(TX[k]));
  const chName = ch => (ch ? nat(TX.ch) + " " + ch : nat(TX.pro));

  E.on("end", id => { const ch = E.S().endings?.[id]?.ch ?? E.R().ch; (E.R().chapterEnds ||= {})[ch] = id; E.save(); });

  // trạng thái 1 ô
  const stateOf = (x, R, G) => {
    if (x.kind === "cp") return R.passed?.[x.id] ? "now" : G.cps?.[x.id] ? "seen" : "lock";
    if (x.kind === "opt") return R.f?.[x.key] === x.val ? "now" : G.opts?.[x.key + ":" + x.val] ? "seen" : "lock";
    if (x.kind === "end") return (R.done === x.id || R.chapterEnds?.[x.ch] === x.id) ? "now" : G.endings?.[x.id] ? "seen" : "lock";
    return "lock";
  };
  const chapters = S => {
    const ids = [...new Set((S.flow || []).map(x => x.ch || 0))].sort((a, b) => a - b);
    return ids.map(ch => {
      const rows = {}; let next = 0;
      for (const x of S.flow.filter(x => (x.ch || 0) === ch)) { const rank = Number.isFinite(+x.row) ? +x.row : next; (rows[rank] ||= []).push(x); next = Math.max(next, rank + 1); }
      return { ch, rows: Object.keys(rows).map(Number).sort((a, b) => a - b).map(r => rows[r]) };
    });
  };
  const pctOf = (c, R, G) => { const all = c.rows.flat(); return all.length ? Math.round(all.filter(x => stateOf(x, R, G) !== "lock").length / all.length * 100) : 0; };
  const idOf = x => x.id || (x.kind === "opt" ? x.key + ":" + x.val : "");
  // Build relationships before display layout. Ending cards are terminal;
  // splitting endings across authored ranks must not invent end-to-end edges.
  const graphOf = (chapter, R, G) => {
    const list = chapter.rows.flat(), index = new Map(list.map((x, i) => [x, i])), byId = new Map(list.map((x, i) => [idOf(x), i]));
    const columns = chapter.rows.map(row => row.map(x => index.get(x))), rank = new Map(columns.flatMap((row, r) => row.map(i => [i, r]))), edges = new Map();
    const add = (a, b) => { if (a == null || b == null || a === b) return; edges.set(a + ">" + b, { a, b }); };
    for (let a = 0; a < list.length; a++) if (list[a].to != null) for (const id of [].concat(list[a].to)) add(a, byId.get(id));
    for (let b = 0; b < list.length; b++) if (list[b].from != null) for (const id of [].concat(list[b].from)) {
      const a = byId.get(id); if (a != null && (list[a].to == null || [].concat(list[a].to).includes(idOf(list[b])))) add(a, b);
    }
    for (let r = 1; r < columns.length; r++) {
      let previous = r - 1; while (previous >= 0 && columns[previous].every(i => list[i].kind === "end")) previous--;
      if (previous < 0) continue;
      const A = columns[previous].filter(i => list[i].kind !== "end"), B = columns[r];
      A.forEach((a, i) => B.forEach((b, j) => { if (list[a].to == null && list[b].from == null && (A.length === 1 || B.length === 1 || i === j)) add(a, b); }));
    }
    const trace = (R.v8route || []).filter(x => byId.has(x.id)), runEdges = new Set();
    for (let i = 1; i < trace.length; i++) { const a = byId.get(trace[i - 1].id), b = byId.get(trace[i].id); add(a, b); runEdges.add(a + ">" + b); }
    for (const edge of edges.values()) {
      const a = stateOf(list[edge.a], R, G), b = stateOf(list[edge.b], R, G);
      edge.state = (runEdges.size ? runEdges.has(edge.a + ">" + edge.b) : a === "now" && b === "now") ? "now" : a !== "lock" && b !== "lock" ? "seen" : "lock";
    }
    return { list, columns, rank, edges: [...edges.values()], current: trace.length ? byId.get(trace[trace.length - 1].id) : list.map(x => stateOf(x, R, G)).lastIndexOf("now") };
  };

  const ICON_LOCK = `<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>`;
  const node = (x, i, R, G) => {
    const s = stateOf(x, R, G), en = x.kind === "end" ? E.S().endings?.[x.id] : null;
    const label = s === "lock" ? "" : x.kind === "end" ? nat(en?.title || x.label) : nat(x.label);
    const thumb = (x.kind === "cp" || x.scene) ? `<span class="fx-th">${s !== "lock" && x.scene ? `<i class="im-${esc(x.scene)}"></i>` : ""}${s === "lock" ? ICON_LOCK : ""}</span>` : "";
    const kind = x.kind === "cp" ? "checkpoint" : x.kind === "end" ? "end" : "branch";
    return `<button class="fx-n k-${x.kind} s-${s}" data-n="${i}" aria-expanded="false" aria-label="${esc(nat(TX[s]) + ' · ' + (s === 'lock' ? nat(TX[kind]) : label))}">${thumb}<span class="fx-l">${s === "lock" ? `${x.kind === "cp" ? "" : ICON_LOCK}<span>${t("lock")}</span>` : esc(label)}</span><em class="fx-node-kind">${t(kind)}</em></button>`;
  };

  const roundedPath = points => {
    const p = points.filter((p, i) => !i || p[0] !== points[i - 1][0] || p[1] !== points[i - 1][1]);
    const n = value => Math.round(value * 10) / 10; let path = `M${n(p[0][0])} ${n(p[0][1])}`;
    for (let i = 1; i < p.length - 1; i++) {
      const [a, b, c] = [p[i - 1], p[i], p[i + 1]], before = Math.hypot(b[0] - a[0], b[1] - a[1]), after = Math.hypot(c[0] - b[0], c[1] - b[1]), r = Math.min(8, before / 2, after / 2);
      path += ` L${n(b[0] - (b[0] - a[0]) * r / before)} ${n(b[1] - (b[1] - a[1]) * r / before)} Q${n(b[0])} ${n(b[1])} ${n(b[0] + (c[0] - b[0]) * r / after)} ${n(b[1] + (c[1] - b[1]) * r / after)}`;
    }
    return path + ` L${n(p[p.length - 1][0])} ${n(p[p.length - 1][1])}`;
  };
  // Adjacent columns use their shared gutter. Skips and return edges use a
  // perimeter lane; every bend stays outside nonincident card rectangles.
  const wire = (wrap, graph) => {
    const svg = wrap.querySelector("svg.fx-wire"); if (!svg) return;
    const box = wrap.getBoundingClientRect(), cards = new Map([...wrap.querySelectorAll('.fx-n')].map(el => { const r = el.getBoundingClientRect(); return [+el.dataset.n, { x: r.left - box.left, y: r.top - box.top, w: r.width, h: r.height }]; }));
    if (!cards.size) return;
    const top = Math.min(...[...cards.values()].map(p => p.y)), bottom = Math.max(...[...cards.values()].map(p => p.y + p.h));
    let topLane = 0, bottomLane = 0;
    svg.setAttribute("width", wrap.offsetWidth); svg.setAttribute("height", wrap.offsetHeight); svg.setAttribute('viewBox', `0 0 ${wrap.offsetWidth} ${wrap.offsetHeight}`);
    svg.innerHTML = graph.edges.slice().sort((a, b) => ['lock', 'seen', 'now'].indexOf(a.state) - ['lock', 'seen', 'now'].indexOf(b.state)).map(edge => {
      const a = cards.get(edge.a), b = cards.get(edge.b); if (!a || !b) return '';
      const start = [a.x + a.w, a.y + a.h / 2], end = [b.x, b.y + b.h / 2], delta = graph.rank.get(edge.b) - graph.rank.get(edge.a); let points;
      if (delta === 0) { const x = Math.max(a.x + a.w, b.x + b.w) + 24; end[0] = b.x + b.w; points = [start, [x, start[1]], [x, end[1]], end]; }
      else if (delta === 1) { const x = (start[0] + end[0]) / 2; points = [start, [x, start[1]], [x, end[1]], end]; }
      else { const useTop = start[1] + end[1] < top + bottom, y = useTop ? top - 20 - topLane++ * 8 : bottom + 20 + bottomLane++ * 8; points = [start, [start[0] + 24, start[1]], [start[0] + 24, y], [end[0] - 24, y], [end[0] - 24, end[1]], end]; }
      return `<path class="${edge.state}" data-from="${esc(idOf(graph.list[edge.a]))}" data-to="${esc(idOf(graph.list[edge.b]))}" d="${roundedPath(points)}"/>`;
    }).join('');
  };

  E.ui.flowSheet = (startCh) => {
    const S = E.S(), R = E.R(), G = E.G();
    const chs = chapters(S);
    if (!chs.length) return E.ui.sheet(nat(TX.title), `<p class="se-mute">${t("none")}</p>`, "tall");
    let closed = false, scrollTimer = 0, frame = 0, panCleanup = null, ignoreClickUntil = 0;
    const positions = new Map();
    let cur = startCh ?? (chs.find(c => c.ch === R.ch)?.ch ?? chs[chs.length - 1].ch), view = "map";
    const truths = Object.keys(G.truths || {}).length;
    const sh = E.ui.sheet(nat(TX.title), `<div class="fx-top"><div class="fx-tabs" role="group" aria-label="${t('ch')}"></div><div class="fx-seg" role="group" aria-label="${t('title')}"><button data-v="map" class="on" aria-pressed="true">${t("title")}</button><button data-v="sum" aria-pressed="false">${t("story")}</button></div></div><div class="fx-body"></div><div class="fx-det" role="region" aria-label="${t('details')}" hidden></div>`, "tall flowx");
    const tabs = sh.querySelector(".fx-tabs"), body = sh.querySelector(".fx-body"), det = sh.querySelector(".fx-det");
    const drawTabs = () => { tabs.innerHTML = chs.map(c => `<button data-ch="${c.ch}" class="${c.ch === cur ? "on" : ""}" aria-pressed="${c.ch === cur}" aria-label="${esc(chName(c.ch))}"><b>${c.ch || "0"}</b><small>${pctOf(c, R, G)}%</small></button>`).join(""); const active = tabs.querySelector(".on"); if (active) tabs.scrollLeft = active.offsetLeft - tabs.offsetLeft + active.offsetWidth / 2 - tabs.clientWidth / 2; };
    const rememberViewport = () => { const viewport = body.querySelector('.fx-viewport'); if (viewport) positions.set(body.dataset.chapter, { left: viewport.scrollLeft, top: viewport.scrollTop }); };
    const cleanMap = () => { clearTimeout(scrollTimer); cancelAnimationFrame(frame); body._ro?.disconnect(); panCleanup?.(); panCleanup = null; };
    const centerCurrent = () => {
      const viewport = body.querySelector('.fx-viewport'), wrap = body.querySelector('.fx-wrap'); if (!viewport || !wrap) return;
      const current = wrap.querySelector('[aria-current="step"]') || wrap.querySelector('.fx-n'); if (!current) return;
      const v = viewport.getBoundingClientRect(), p = current.getBoundingClientRect();
      viewport.scrollLeft += p.left - v.left + p.width / 2 - viewport.clientWidth / 2;
      viewport.scrollTop += p.top - v.top + p.height / 2 - viewport.clientHeight / 2;
    };
    const bindPan = viewport => {
      let drag = null;
      const down = e => { if (e.pointerType !== 'mouse' || e.button !== 0 || e.target.closest('button')) return; drag = { id: e.pointerId, x: e.clientX, y: e.clientY, left: viewport.scrollLeft, top: viewport.scrollTop, moved: false }; viewport.setPointerCapture?.(e.pointerId); };
      const move = e => { if (!drag || drag.id !== e.pointerId) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y; if (Math.hypot(dx, dy) > 5) drag.moved = true; if (!drag.moved) return; e.preventDefault(); viewport.scrollLeft = drag.left - dx; viewport.scrollTop = drag.top - dy; viewport.classList.add('is-panning'); };
      const up = e => { if (!drag || drag.id !== e.pointerId) return; if (drag.moved) ignoreClickUntil = performance.now() + 250; drag = null; viewport.classList.remove('is-panning'); try { viewport.releasePointerCapture?.(e.pointerId); } catch {} };
      const key = e => { if (e.target !== viewport || !['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key)) return; e.preventDefault(); const distance = e.shiftKey ? 240 : 80; if (e.key === 'Home' || e.key === 'End') viewport.scrollLeft = e.key === 'Home' ? 0 : viewport.scrollWidth; else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') viewport.scrollLeft += e.key === 'ArrowLeft' ? -distance : distance; else viewport.scrollTop += e.key === 'ArrowUp' ? -distance : distance; };
      viewport.addEventListener('pointerdown', down); viewport.addEventListener('pointermove', move); viewport.addEventListener('pointerup', up); viewport.addEventListener('pointercancel', up); viewport.addEventListener('keydown', key);
      panCleanup = () => { viewport.removeEventListener('pointerdown', down); viewport.removeEventListener('pointermove', move); viewport.removeEventListener('pointerup', up); viewport.removeEventListener('pointercancel', up); viewport.removeEventListener('keydown', key); };
    };
    const drawMap = () => {
      const c = chs.find(x => x.ch === cur) || chs[0];
      const meta = (S.chapters || []).find(x => x.ch === c.ch);
      const graph = graphOf(c, R, G), idx = graph.list, bypasses = graph.edges.filter(edge => Math.abs(graph.rank.get(edge.b) - graph.rank.get(edge.a)) > 1 || graph.rank.get(edge.b) < graph.rank.get(edge.a)).length;
      const rows = graph.columns.map((column, rank) => `<div class="fx-row fx-column" data-rank="${rank}">${column.map(i => node(idx[i], i, R, G)).join("")}</div>`).join("");
      body.dataset.view = 'map'; body.dataset.chapter = String(c.ch);
      body.innerHTML = `<div class="fx-chh"><small>${esc(chName(c.ch))}</small><b>${esc(nat(meta?.title) || "")}</b><span class="fx-pct"><i style="width:${pctOf(c, R, G)}%"></i></span><em>${pctOf(c, R, G)}% ${esc(nat({en:'routes discovered',vi:'nhánh đã khám phá'}))}${S.truthTotal ? ` · ${truths}/${S.truthTotal} ${esc(nat({ en: "truths", vi: "sự thật" }))}` : ""}</em></div>
        <div class="fx-key"><span class="s-now">${t("now")}</span><span class="s-seen">${t("seen")}</span><span class="s-lock">${t("lock")}</span></div>
        <div class="fx-map-tools"><p>${t('move')}</p><button type="button" data-flow-center>${t('center')}</button></div>
        <div class="fx-viewport" tabindex="0" role="region" aria-label="${t('viewport')}"><div class="fx-wrap" style="--fx-column-count:${graph.columns.length};--fx-route-space:${44 + bypasses * 8}px"><svg class="fx-wire" aria-hidden="true"></svg>${rows}</div></div>`;
      body._idx = idx;
      const wrap = body.querySelector('.fx-wrap'), viewport = body.querySelector('.fx-viewport');
      if (graph.current >= 0) wrap.querySelector(`[data-n="${graph.current}"]`)?.setAttribute('aria-current', 'step');
      const redraw = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => { if (!closed && wrap.isConnected) wire(wrap, graph); }); };
      redraw(); bindPan(viewport);
      // Text changes and orientation changes redraw connectors without moving
      // the user's viewport or changing the story's discovery state.
      try { body._ro = new ResizeObserver(redraw); body._ro.observe(wrap); wrap.querySelectorAll('.fx-n').forEach(n => body._ro.observe(n)); } catch {}
      scrollTimer = setTimeout(() => { if (closed || !wrap.isConnected) return; const saved = positions.get(String(c.ch)); if (saved) { viewport.scrollLeft = saved.left; viewport.scrollTop = saved.top; } else centerCurrent(); }, 60);
    };
    // TÓM TẮT THEO NHÁNH: đường đi lần này (các quyết định đã chọn, theo chương) + chuyện đã qua đúng nhánh đó
    const drawSum = () => {
      body.dataset.view = 'sum';
      const byCh = {};
      for (const p of R.path || []) { const x = (S.flow || []).find(f => f.kind === "opt" && f.key === p.k && f.val === p.v); if (x) (byCh[x.ch || 0] ||= []).push(x); }
      const list = E.recapList();
      const recapBy = {};
      for (const x of list) (recapBy[x.ch ?? 0] ||= []).push(x);
      const ids = [...new Set([...Object.keys(byCh), ...Object.keys(recapBy)].map(Number))].sort((a, b) => a - b);
      body.innerHTML = ids.length ? ids.map(ch => `<div class="fx-sch"><h4>${esc(chName(ch))}${(S.chapters || []).find(c => c.ch === ch)?.title ? ` · ${esc(nat(S.chapters.find(c => c.ch === ch).title))}` : ""}</h4>
        ${byCh[ch]?.length ? `<div class="fx-dec"><small>${t("decisions")}</small>${byCh[ch].map(x => `<div class="fx-dc"><b>${esc(nat(x.label))}</b>${x.sum ? `<span>${esc(nat(x.sum))}</span>` : ""}</div>`).join("")}</div>` : ""}
        ${(recapBy[ch] || []).map(x => `<p class="se-rcp">${esc(nat(x.t))}</p>`).join("")}</div>`).join("") : `<p class="se-mute">${t("none")}</p>`;
    };
    const draw = () => { rememberViewport(); cleanMap(); drawTabs(); det.hidden = true; sh.querySelectorAll('[data-v]').forEach(button => { const active = button.dataset.v === view; button.classList.toggle('on', active); button.setAttribute('aria-pressed', String(active)); }); view === "map" ? drawMap() : drawSum(); };
    // CHI TIẾT 1 ô (chạm): mốc = chuyện tới đây theo bản chụp của mốc đó + Chơi lại · nhánh = hậu quả · kết thúc = lời kết
    const detail = x => {
      const s = stateOf(x, R, G);
      let html = `<div class="fx-dh s-${s}"><small>${t(s === "now" ? "now" : s === "seen" ? "seen" : "lock")}</small>`;
      if (s === "lock") html += `<b>???</b><p>${x.hint ? esc(nat(x.hint)) : t("lockd")}</p>`;
      else if (x.kind === "cp") {
        const snap = G.cps?.[x.id];
        const rc = snap ? E.recapOf(snap, x.ch).filter(r => (r.ch ?? 0) === (x.ch || 0)) : [];
        html += `<b>${esc(nat(x.label))}</b>${x.sum ? `<p>${esc(nat(x.sum))}</p>` : ""}${rc.length ? `<div class="fx-upto"><small>${t("upto")}</small>${rc.slice(-6).map(r => `<p class="se-rcp">${esc(nat(r.t))}</p>`).join("")}</div>` : ""}${E.chOpen(x.ch || 1) ? `<button class="se-btn pri wide" data-cp="${esc(x.id)}">↺ ${t("replay")}</button>` : `<p class="se-mute">${esc(nat({ en: `Finish chapter ${(x.ch || 1) - 1} to replay from here.`, vi: `Xong chương ${(x.ch || 1) - 1} để chơi lại từ đây.` }))}</p>`}`;
      } else if (x.kind === "opt") {
        html += `<b>${esc(nat(x.label))}</b><p class="se-mute">${t(s === "now" ? "picked" : "other")}</p>${x.sum ? `<p>${esc(nat(x.sum))}</p>` : ""}`;
      } else {
        const en = S.endings?.[x.id] || {};
        html += `<b>${esc(nat(en.title || x.label))}</b>${en.sum ? `<p>${esc(nat(en.sum))}</p>` : ""}${en.text ? `<p class="fx-et">${esc(nat(en.text))}</p>` : ""}`;
      }
      det.innerHTML = html + `<button class="fx-dx" data-dx aria-label="${t('close')}">×</button></div>`;
      det.hidden = false;
      E.sfx("tap");
    };
    // .se-sheet dùng lại 1 phần tử cho mọi bảng → gắn bằng onclick (addEventListener sẽ cộng dồn mỗi lần mở)
    const base = sh.onclick;
    sh.onclick = e => {
      base?.(e);
      if (closed) return;
      const v = e.target.closest("[data-v]");
      if (v) { view = v.dataset.v; sh.querySelectorAll("[data-v]").forEach(b => b.classList.toggle("on", b === v)); E.sfx("tap"); return draw(); }
      const c = e.target.closest("[data-ch]");
      if (c) { cur = +c.dataset.ch; if (view !== "map") { view = "map"; sh.querySelectorAll("[data-v]").forEach(b => b.classList.toggle("on", b.dataset.v === "map")); } E.sfx("page"); return draw(); }
      // nút trong khung chi tiết xét TRƯỚC; ô sơ đồ chỉ nhận .fx-n (gốc .se của game cũng mang data-n = node đang chạy →
      //   closest("[data-n]") từng bắt nhầm mọi cú bấm trong khung chi tiết: “Chơi lại từ đây” và × không ăn)
      if (e.target.closest('[data-flow-center]')) { centerCurrent(); return; }
      if (e.target.closest("[data-dx]")) { det.hidden = true; sh.querySelectorAll(".fx-n.sel").forEach(x => { x.classList.remove("sel"); x.setAttribute('aria-expanded', 'false'); if (!e.detail) x.focus({ preventScroll: true }); }); return; }
      const cp = e.target.closest("[data-cp]")?.dataset.cp;
      if (cp) return E.ui.replayAsk({ cp });
      const n = e.target.closest(".fx-n[data-n]");
      if (n && performance.now() >= ignoreClickUntil) { sh.querySelectorAll(".fx-n.sel").forEach(x => { x.classList.remove("sel"); x.setAttribute('aria-expanded', 'false'); }); n.classList.add("sel"); n.setAttribute('aria-expanded', 'true'); detail(body._idx[+n.dataset.n]); if (!e.detail) det.querySelector('[data-dx]')?.focus({ preventScroll: true }); }
    };
    sh.onclose = () => { closed = true; cleanMap(); };
    draw();
    return sh;
  };
  // Stable map entry for engine controls; story plugins may keep a separate
  // flowSheet route journal without replacing the chapter graph itself.
  E.ui.chapterFlow = E.ui.flowSheet;
})();
