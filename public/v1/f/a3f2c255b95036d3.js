// Rắn săn từ (Enmi Game SDK, 28/10/2026) — thể loại rắn ăn mồi: trên sân có 3 quả mang 3 từ, lượn tới ăn đúng TỪ của nghĩa đang hỏi.
// Đúng = dài thêm + điểm · sai / tự cắn đuôi = mất 1 mạng (3 mạng). Đi xuyên mép sân (dễ cho người mới). Điều khiển: vuốt · phím mũi tên · 4 nút.
// Vẽ canvas CHỈ khi rắn bước (không vòng rAF liên tục — nhẹ máy). Vật phẩm: shield (+1 mạng) · slow (chậm 8 giây) · hint (sáng quả đúng).
(async () => {
  const E = globalThis.Enmi, FX = globalThis.FX, G0 = globalThis.GK, T = G0.t;
  const app = document.getElementById("app");
  const all = await G0.words(30, 4);
  if (!all) return;
  app.innerHTML = `<div class="gk-top"><span class="gk-sc" id="sc">0</span><span class="gk-combo" id="cb"></span><span class="gk-sp"></span><span class="gk-chip" id="lv"></span></div>
    <div class="gk-q" id="q"></div>
    <div class="gk-stage" id="st"><canvas id="cv"></canvas></div>
    <div class="pad"><button data-d="L" aria-label="←">◀</button><button data-d="U" aria-label="↑">▲</button><button data-d="D" aria-label="↓">▼</button><button data-d="R" aria-label="→">▶</button></div>`;
  const $ = s => app.querySelector(s), cv = $("#cv"), x = cv.getContext("2d"), st = $("#st");
  const COLS = 12, DIR = { L: [-1, 0], R: [1, 0], U: [0, -1], D: [0, 1] };
  let W = 0, H = 0, cs = 0, rows = 0, dpr = 1, S = null, loop = 0, paused = false;
  const fit = () => {
    const r = st.getBoundingClientRect(); dpr = Math.min(2, devicePixelRatio || 1);
    cs = Math.floor(Math.min(r.width / COLS, 44)); rows = Math.max(8, Math.floor(r.height / cs));
    W = cs * COLS; H = cs * rows; cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + "px"; cv.style.height = H + "px";
    x.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const hud = () => {
    $("#sc").textContent = S.score;
    $("#lv").textContent = "♥ " + S.lives;
    const c = $("#cb"); c.textContent = T("combo", { n: S.combo }); c.classList.toggle("on", S.combo > 1);
  };
  const free = () => { for (let k = 0; k < 200; k++) { const p = [1 + Math.floor(Math.random() * (COLS - 2)), 1 + Math.floor(Math.random() * (rows - 2))]; if (!S.body.some(b => b[0] === p[0] && b[1] === p[1]) && !S.fruit.some(f => Math.abs(f.p[0] - p[0]) + Math.abs(f.p[1] - p[1]) < 3) && Math.abs(p[0] - S.body[0][0]) + Math.abs(p[1] - S.body[0][1]) > 2) return p; } return [1, 1]; };
  function round() {
    const ws = G0.shuffle(all.slice()).slice(0, 3), ans = ws[0];
    S.ans = ans; S.fruit = [];
    for (const w of G0.shuffle(ws)) S.fruit.push({ w, p: free(), ok: w === ans });
    $("#q").innerHTML = `<div><small></small><span></span></div>`; $("#q small").textContent = T("ask"); $("#q span").textContent = ans.m;
  }
  const COL = ["#f472b6", "#fbbf24", "#60a5fa"];
  function draw() {
    x.clearRect(0, 0, W, H);
    for (let i = 0; i < COLS; i++) for (let j = 0; j < rows; j++) if ((i + j) % 2) { x.fillStyle = "rgba(255,255,255,.035)"; x.fillRect(i * cs, j * cs, cs, cs); }
    // quả + nhãn từ
    S.fruit.forEach((f, k) => {
      const cx = f.p[0] * cs + cs / 2, cy = f.p[1] * cs + cs / 2, glow = S.hint > performance.now() && f.ok;
      x.beginPath(); x.arc(cx, cy, cs * 0.38, 0, 7); x.fillStyle = glow ? "#86efac" : COL[k % 3]; x.fill();
      x.beginPath(); x.arc(cx - cs * 0.12, cy - cs * 0.12, cs * 0.1, 0, 7); x.fillStyle = "rgba(255,255,255,.6)"; x.fill();
      x.font = `800 ${Math.max(12, cs * 0.42)}px system-ui, sans-serif`;
      const tw = x.measureText(f.w.w).width + 12, th = cs * 0.62, lx = Math.max(2, Math.min(W - tw - 2, cx - tw / 2)), ly = f.p[1] === 0 ? cy + cs * 0.5 : cy - cs * 0.52 - th;
      x.fillStyle = glow ? "#16a34a" : "rgba(0,0,0,.55)"; x.beginPath(); x.roundRect ? x.roundRect(lx, ly, tw, th, 8) : x.rect(lx, ly, tw, th); x.fill();
      x.fillStyle = "#fff"; x.textAlign = "left"; x.textBaseline = "middle"; x.fillText(f.w.w, lx + 6, ly + th / 2 + 1);
    });
    // rắn: thân bo tròn chuyển sắc, đầu có mắt
    S.body.forEach((b, i) => {
      const t = i / Math.max(1, S.body.length - 1);
      x.fillStyle = `hsl(${140 - t * 40}, 70%, ${55 - t * 15}%)`;
      const pad = i ? cs * 0.1 : cs * 0.04;
      x.beginPath(); x.roundRect ? x.roundRect(b[0] * cs + pad, b[1] * cs + pad, cs - pad * 2, cs - pad * 2, cs * 0.3) : x.rect(b[0] * cs + pad, b[1] * cs + pad, cs - pad * 2, cs - pad * 2); x.fill();
    });
    const h = S.body[0], [dx, dy] = DIR[S.dir], ex = h[0] * cs + cs / 2, ey = h[1] * cs + cs / 2;
    for (const s of [-1, 1]) { const px = ex + dx * cs * 0.15 + -dy * s * cs * 0.18, py = ey + dy * cs * 0.15 + dx * s * cs * 0.18; x.fillStyle = "#fff"; x.beginPath(); x.arc(px, py, cs * 0.11, 0, 7); x.fill(); x.fillStyle = "#052e16"; x.beginPath(); x.arc(px + dx * cs * 0.04, py + dy * cs * 0.04, cs * 0.055, 0, 7); x.fill(); }
  }
  const speed = () => (S.slow > performance.now() ? 260 : Math.max(105, 175 - S.eaten * 5));
  function hurt() {
    S.lives--; S.combo = 1; G0.tone("bad"); E.haptic("HEAVY"); FX.shake(st, 0.4); FX.flash("rgba(239,68,68,.35)");
    if (S.lives <= 0) { hud(); return finish(); }
  }
  function step() {
    if (!S || S.over) return;
    loop = setTimeout(step, speed());
    if (paused || document.hidden) return;
    if (S.next && !(DIR[S.next][0] === -DIR[S.dir][0] && DIR[S.next][1] === -DIR[S.dir][1])) S.dir = S.next;
    S.next = null;
    const [dx, dy] = DIR[S.dir], h = S.body[0], n = [(h[0] + dx + COLS) % COLS, (h[1] + dy + rows) % rows];
    if (S.body.slice(0, -1).some(b => b[0] === n[0] && b[1] === n[1])) { hurt(); S.body = S.body.slice(0, 3); draw(); hud(); return; }
    S.body.unshift(n);
    const f = S.fruit.find(f => f.p[0] === n[0] && f.p[1] === n[1]);
    if (f) {
      const px = n[0] * cs + cs / 2 + cv.getBoundingClientRect().left, py = n[1] * cs + cs / 2 + cv.getBoundingClientRect().top;
      if (f.ok) {
        S.eaten++; S.grow += 2; const pts = 10 * S.combo + S.body.length; S.score += pts; S.combo = Math.min(5, S.combo + 1);
        FX.burst(px, py, { c: ["#86efac", "#fde68a", "#fff"], n: 20 + S.combo * 3 }); FX.float(px, py - 20, "+" + pts, { c: "#fde68a", size: 22 });
        G0.tone("ok"); E.haptic("MEDIUM"); round();
      } else { S.fruit = S.fruit.filter(y => y !== f); FX.float(px, py - 20, f.w.m, { c: "#fca5a5", size: 15 }); hurt(); }
    }
    if (S.grow > 0) S.grow--; else S.body.pop();
    draw(); hud();
  }
  const turn = d => { if (S && !S.over) { S.next = d; G0.snd("flip"); } };
  addEventListener("keydown", e => { const d = { ArrowLeft: "L", ArrowRight: "R", ArrowUp: "U", ArrowDown: "D" }[e.key]; if (d) { e.preventDefault(); turn(d); } });
  app.querySelector(".pad").addEventListener("pointerdown", e => { const b = e.target.closest("[data-d]"); if (b) { e.preventDefault(); turn(b.dataset.d); } });
  let sw = null;
  st.addEventListener("pointerdown", e => { sw = [e.clientX, e.clientY]; });
  st.addEventListener("pointermove", e => { if (!sw) return; const dx = e.clientX - sw[0], dy = e.clientY - sw[1]; if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return; turn(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "R" : "L") : dy > 0 ? "D" : "U"); sw = [e.clientX, e.clientY]; });
  addEventListener("pointerup", () => { sw = null; });
  const pw = G0.pw(["shield", "slow", "hint"], k => {
    if (k === "shield") { S.lives++; FX.float(innerWidth / 2, 90, "+♥", { c: "#86efac", size: 28 }); }
    if (k === "slow") S.slow = performance.now() + 8000;
    if (k === "hint") { S.hint = performance.now() + 3000; draw(); setTimeout(() => S && !S.over && draw(), 3050); }
    hud();
  });
  pw.can = () => S && !S.over;
  function finish() {
    S.over = true; clearTimeout(loop);
    G0.end({ win: S.eaten >= 8, score: S.score, stars: S.eaten >= 20 ? 3 : S.eaten >= 12 ? 2 : S.eaten >= 5 ? 1 : 0, sub: T("sub", { n: S.eaten }) });
  }
  const start = () => {
    clearTimeout(loop); fit();
    const cy = Math.floor(rows / 2);
    S = { body: [[4, cy], [3, cy], [2, cy]], dir: "R", next: null, fruit: [], grow: 0, score: 0, combo: 1, lives: 3, eaten: 0, slow: 0, hint: 0, over: false };
    round(); draw(); hud(); loop = setTimeout(step, 400);
  };
  G0.again = start;
  E.on("pause", () => { paused = true; }); E.on("resume", () => { paused = false; });
  addEventListener("resize", () => { if (S && !S.over) { fit(); S.body = S.body.map(b => [b[0] % COLS, b[1] % rows]); S.fruit.forEach(f => (f.p = [f.p[0] % COLS, f.p[1] % rows])); draw(); } });
  G0.intro(`<svg viewBox="0 0 120 120"><path d="M20 80q0-24 24-24h30q20 0 20-18" fill="none" stroke="#4ade80" stroke-width="16" stroke-linecap="round"/><circle cx="94" cy="34" r="12" fill="#22c55e"/><circle cx="98" cy="30" r="3.4" fill="#fff"/><circle cx="99" cy="30" r="1.6" fill="#052e16"/><circle cx="34" cy="28" r="10" fill="#f472b6"/><circle cx="31" cy="25" r="3" fill="#fff" opacity=".7"/></svg>`, T("how"), start);
})();
