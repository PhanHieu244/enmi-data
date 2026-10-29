// Tìm chữ ẩn (Enmi Game SDK, 28/10/2026) — thể loại tìm từ trong lưới: 5 từ đang học giấu ngang / dọc / chéo (xuôi chiều), dưới lưới là
// 5 NGHĨA. Kéo ngón tay qua các ô (hoặc chạm ô đầu rồi ô cuối) để khoanh từ. Tìm hết = sang lưới mới, điểm theo tốc độ. 3 lưới / ván.
// Mọi thứ tiếng (ô = ký tự hiển thị; chữ nhiễu lấy từ chính các từ đang học). Vật phẩm: hint (nháy ô đầu 1 từ) · slow (+20 giây).
(async () => {
  const E = globalThis.Enmi, FX = globalThis.FX, G0 = globalThis.GK, T = G0.t;
  const app = document.getElementById("app"), N = 8, ROUNDS = 3, TIME = 150;
  const all = await G0.words(40, 5);
  if (!all) return;
  const fit = all.map(x => ({ ...x, c: G0.chars(x.w.toUpperCase().replace(/[\s'’-]/g, "")) })).filter(x => x.c.length >= 2 && x.c.length <= N);
  const list = fit.length >= 5 ? fit : all.map(x => ({ ...x, c: G0.chars(x.w.toUpperCase().replace(/\s/g, "")).slice(0, N) }));
  const alpha = [...new Set(list.flatMap(x => x.c))];
  app.innerHTML = `<div class="gk-top"><span class="gk-sc" id="sc">0</span><span class="gk-sp"></span><span class="gk-chip" id="rd"></span></div>
    <div class="gk-time" id="tm"><i></i></div>
    <div class="gk-stage" id="st"><div class="gw"><div class="grid" id="grid"></div><svg class="ln" id="ln"></svg></div></div>
    <div class="clues" id="cl"></div>`;
  const $ = s => app.querySelector(s), grid = $("#grid");
  let S = null, timer = 0, paused = false;
  const DIRS = [[1, 0], [0, 1], [1, 1], [1, -1]];
  function build() {
    for (let tries = 0; tries < 40; tries++) {
      const g = Array.from({ length: N }, () => Array(N).fill("")), put = [];
      for (const w of G0.shuffle(list.slice())) {
        if (put.length >= 5) break;
        for (let k = 0; k < 60; k++) {
          const [dx, dy] = G0.pick(DIRS), L = w.c.length;
          const x0 = Math.floor(Math.random() * N), y0 = Math.floor(Math.random() * N), x1 = x0 + dx * (L - 1), y1 = y0 + dy * (L - 1);
          if (x1 < 0 || x1 >= N || y1 < 0 || y1 >= N) continue;
          if (!w.c.every((ch, i) => { const v = g[y0 + dy * i][x0 + dx * i]; return !v || v === ch; })) continue;
          w.c.forEach((ch, i) => (g[y0 + dy * i][x0 + dx * i] = ch));
          put.push({ w, cells: w.c.map((_, i) => [x0 + dx * i, y0 + dy * i]), found: false });
          break;
        }
      }
      if (put.length >= Math.min(5, list.length)) { for (const r of g) for (let i = 0; i < N; i++) if (!r[i]) r[i] = G0.pick(alpha); return { g, put }; }
    }
    return null;
  }
  const hud = () => {
    $("#sc").textContent = S.score; $("#rd").textContent = `${S.round}/${ROUNDS}`;
    $("#tm i").style.width = Math.max(0, Math.min(1, S.time / TIME)) * 100 + "%"; $("#tm").classList.toggle("low", S.time <= 15);
  };
  function round() {
    S.B = build(); S.round++;
    grid.innerHTML = S.B.g.flatMap((r, y) => r.map((ch, x) => `<b data-x="${x}" data-y="${y}"></b>`)).join("");
    S.B.g.forEach((r, y) => r.forEach((ch, x) => (grid.children[y * N + x].textContent = ch)));
    $("#cl").innerHTML = S.B.put.map((p, i) => `<span data-i="${i}"></span>`).join("");
    S.B.put.forEach((p, i) => ($("#cl").children[i].textContent = p.w.m));
    $("#ln").innerHTML = ""; hud();
  }
  const cell = (x, y) => grid.children[y * N + x];
  const at = e => { const el = document.elementFromPoint(e.clientX, e.clientY)?.closest("[data-x]"); return el ? [+el.dataset.x, +el.dataset.y] : null; };
  // đường thẳng từ a tới b (ngang / dọc / chéo đúng 45°) → các ô
  const line = (a, b) => { const dx = Math.sign(b[0] - a[0]), dy = Math.sign(b[1] - a[1]), n = Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1])); if (dx && dy && Math.abs(b[0] - a[0]) !== Math.abs(b[1] - a[1])) return null; return Array.from({ length: n + 1 }, (_, i) => [a[0] + dx * i, a[1] + dy * i]); };
  let sel = null, cur = [];
  const mark = cs => { grid.querySelectorAll(".sel").forEach(b => b.classList.remove("sel")); (cs || []).forEach(([x, y]) => cell(x, y).classList.add("sel")); };
  function tryWord(cs) {
    if (!cs || cs.length < 2) return false;
    const key = c => c.join(",");
    const p = S.B.put.find(p => !p.found && (p.cells.map(key).join() === cs.map(key).join() || p.cells.map(key).join() === cs.slice().reverse().map(key).join()));
    if (!p) return false;
    p.found = true;
    const r = grid.getBoundingClientRect(), sz = r.width / N, pt = ([x, y]) => [x * sz + sz / 2, y * sz + sz / 2], [a, b] = [pt(p.cells[0]), pt(p.cells[p.cells.length - 1])];
    $("#ln").setAttribute("viewBox", `0 0 ${r.width} ${r.height}`);
    $("#ln").insertAdjacentHTML("beforeend", `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="hsl(${(S.found * 67) % 360} 85% 60%)" stroke-opacity=".55" stroke-width="${sz * 0.78}" stroke-linecap="round"/>`);
    p.cells.forEach(([x, y]) => cell(x, y).classList.add("got"));
    const ci = $("#cl").children[S.B.put.indexOf(p)]; ci.classList.add("got"); ci.textContent = p.w.w + " · " + p.w.m;
    S.found++; const pts = 20 + p.cells.length * 3 + Math.ceil(S.time / 10); S.score += pts;
    const [mx, my] = [r.left + (a[0] + b[0]) / 2, r.top + (a[1] + b[1]) / 2]; FX.burst(mx, my, { c: ["#c4b5fd", "#fde68a", "#fff"], n: 22 }); FX.float(mx, my - 20, "+" + pts, { c: "#fde68a", size: 22 });
    G0.tone("ok"); E.haptic("MEDIUM"); hud();
    if (S.B.put.every(p => p.found)) { if (S.round >= ROUNDS) finish(true); else setTimeout(() => !S.over && round(), 700); }
    return true;
  }
  grid.addEventListener("pointerdown", e => { if (!S || S.over || paused) return; const c = at(e); if (!c) return; e.preventDefault(); grid.setPointerCapture(e.pointerId); sel = c; cur = [c]; mark(cur); G0.snd("tap"); });
  grid.addEventListener("pointermove", e => { if (!sel) return; const c = at(e); if (!c) return; const l = line(sel, c); if (l && l.length !== cur.length) { cur = l; mark(cur); G0.snd("flip"); } });
  grid.addEventListener("pointerup", () => { if (!sel) return; const ok = tryWord(cur); if (!ok && cur.length > 1) { FX.shake(grid, 0.2); E.haptic("LIGHT"); } mark(null); sel = null; cur = []; });
  const pw = G0.pw(["hint", "slow"], k => {
    if (k === "slow") { S.time = Math.min(TIME + 60, S.time + 20); FX.float(innerWidth / 2, 80, "+20s", { c: "#7dd3fc", size: 24 }); }
    if (k === "hint") { const p = S.B.put.find(p => !p.found); if (p) { const b = cell(...p.cells[0]); b.classList.add("hint"); setTimeout(() => b.classList.remove("hint"), 2600); } }
    hud();
  });
  pw.can = () => S && !S.over;
  const tick = () => { if (!S || S.over || paused || document.hidden) return; S.time -= 0.25; if (S.time <= 0) { S.time = 0; hud(); return finish(false); } hud(); };
  function finish(win) {
    if (S.over) return; S.over = true; clearInterval(timer);
    if (win) S.score += Math.ceil(S.time) * 2;
    G0.end({ win, title: win ? T("win") : T("timeup"), score: S.score, stars: win ? (S.time > 60 ? 3 : S.time > 25 ? 2 : 1) : S.found >= 6 ? 1 : 0, sub: T("sub", { n: S.found }) });
  }
  const start = () => { clearInterval(timer); S = { score: 0, time: TIME, round: 0, found: 0, over: false }; round(); timer = setInterval(tick, 250); };
  G0.again = start;
  E.on("pause", () => { paused = true; }); E.on("resume", () => { paused = false; });
  G0.intro(`<svg viewBox="0 0 120 120"><rect x="14" y="14" width="92" height="92" rx="16" fill="rgba(255,255,255,.14)"/>${Array.from({ length: 16 }, (_, i) => `<rect x="${22 + (i % 4) * 20}" y="${22 + Math.floor(i / 4) * 20}" width="16" height="16" rx="4" fill="rgba(255,255,255,.75)"/>`).join("")}<line x1="30" y1="30" x2="90" y2="90" stroke="#facc15" stroke-opacity=".75" stroke-width="14" stroke-linecap="round"/></svg>`, T("how"), start);
})();
