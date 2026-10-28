// Lật cặp (Enmi Game SDK) — lật 2 thẻ từ ↔ nghĩa cho khớp trước khi hết giờ.
// Thuần trong game: chỉ đọc từ qua Enmi.words, vật phẩm qua Enmi.use, báo điểm Enmi.score. Không đụng dữ liệu học.
(async () => {
  const E = globalThis.Enmi, FX = globalThis.FX, T = (k, v) => E.t(k, v);
  const $ = s => document.querySelector(s);
  const app = $("#app"), grid = $("#grid");
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const PWK = ["hint", "slow", "bomb"], N = 6, TIME = 60;

  const all = await E.words(24).catch(() => []);
  if (all.length < 4) {
    const f = document.createElement("div");
    f.className = "few";
    f.innerHTML = `<p></p><button></button>`;
    f.querySelector("p").textContent = T("few");
    f.querySelector("button").textContent = T("close");
    f.querySelector("button").onclick = () => E.close();
    app.appendChild(f);
    return;
  }

  let inv = await E.inv().catch(() => ({})), G = null, timer = 0, paused = false;
  $("#bar").innerHTML = PWK.map(k => `<button class="pw" data-pw="${k}" style="--pc:${E.pw[k]?.c || "#888"}" aria-label="${(E.pw[k]?.name || k).replace(/"/g, "")}">${E.pw[k]?.svg || ""}<b>0</b></button>`).join("");

  const btn = n => grid.querySelector(`[data-c="${n}"]`);
  const mid = el => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
  const hud = () => {
    $("#sc").textContent = G.score;
    $("#ts").textContent = Math.ceil(G.time);
    $("#tm").style.width = Math.max(0, Math.min(1, G.time / TIME)) * 100 + "%";
    document.querySelector(".time").classList.toggle("low", G.time <= 10);
    const c = $("#combo"); c.textContent = T("combo", { n: G.combo }); c.classList.toggle("on", G.combo > 1);
    for (const k of PWK) { const b = document.querySelector(`[data-pw="${k}"]`); b.querySelector("b").textContent = inv[k] || 0; b.classList.toggle("zero", !(inv[k] > 0)); }
  };

  const deal = () => {
    const ws = shuffle(all.slice()).slice(0, N);
    G = { ws, cards: shuffle(ws.flatMap((w, i) => [{ i, t: w.w, k: "w" }, { i, t: w.m, k: "m" }])), open: [], done: 0, score: 0, combo: 1, time: TIME, lock: false, over: false };
    grid.innerHTML = G.cards.map((c, n) => `<button class="c deal ${c.k}" data-c="${n}" style="--i:${n}"><span class="f"></span><span class="b"></span></button>`).join("");
    G.cards.forEach((c, n) => (btn(n).querySelector(".b").textContent = c.t));
    // hết hiệu ứng chia bài thì gỡ lớp (animation giữ transform → lật thẻ mất chuyển động)
    setTimeout(() => grid.querySelectorAll(".c.deal").forEach(b => b.classList.remove("deal")), 1100);
    // 12 thẻ: 3 cột × 4 hàng (máy ngang: 4 cột)
    grid.style.gridTemplateColumns = `repeat(${innerWidth > innerHeight ? 4 : 3}, minmax(0, 1fr))`;
    hud();
  };

  const match = (a, b) => {
    const A = btn(a), B = btn(b);
    A.classList.add("ok"); B.classList.add("ok");
    G.done++;
    const pts = 20 * G.combo + Math.ceil(G.time / 6);
    G.score += pts;
    const [ax, ay] = mid(A), [bx, by] = mid(B);
    FX.burst(ax, ay, { c: ["#86efac", "#fde68a", "#fff"], n: 18 + G.combo * 3, power: 0.9 + G.combo * 0.1 });
    FX.burst(bx, by, { c: ["#86efac", "#f9a8d4", "#fff"], n: 18 + G.combo * 3, power: 0.9 + G.combo * 0.1 });
    FX.float((ax + bx) / 2, (ay + by) / 2, "+" + pts, { c: "#fde68a", size: 24 + G.combo * 2 });
    if (G.combo >= 3) { FX.shake(grid, 0.12 + G.combo * 0.06); FX.float(innerWidth / 2, innerHeight * 0.3, T("combo", { n: G.combo }), { c: "#f9a8d4", size: 30 }); }
    G.combo = Math.min(4, G.combo + 1);
    FX.pop($("#sc"));
    E.haptic(G.combo >= 3 ? "MEDIUM" : "LIGHT");
    setTimeout(() => { A.classList.add("gone"); B.classList.add("gone"); }, 550);
    if (G.done === G.ws.length) finish(true);
  };

  grid.addEventListener("click", e => {
    const b = e.target.closest("[data-c]");
    if (!b || !G || G.lock || G.over || paused || b.classList.contains("on") || b.classList.contains("ok")) return;
    b.classList.remove("deal");
    b.classList.add("on"); G.open.push(+b.dataset.c);
    E.haptic("LIGHT");
    if (G.open.length < 2) return;
    const [a, c] = G.open; G.open = [];
    if (G.cards[a].i === G.cards[c].i && G.cards[a].k !== G.cards[c].k) { match(a, c); hud(); return; }
    G.combo = 1; G.lock = true; E.haptic("HEAVY");
    btn(a).classList.add("bad"); btn(c).classList.add("bad");
    FX.shake(grid, 0.25);
    setTimeout(() => { for (const n of [a, c]) btn(n)?.classList.remove("on", "bad"); G.lock = false; }, 700);
    hud();
  });

  $("#bar").addEventListener("click", async e => {
    const b = e.target.closest("[data-pw]");
    if (!b || !G || G.over) return;
    const k = b.dataset.pw;
    const r = await E.use(k).catch(() => ({ ok: false }));
    if (!r.ok) { FX.shake(b, 0.4); return; }
    inv[k] = r.n;
    const [px, py] = mid(b);
    FX.burst(px, py - 20, { c: [E.pw[k].c, "#fff"], n: 14, power: 0.6, ring: false });
    const left = [...new Set(G.cards.map((c, n) => (btn(n).classList.contains("ok") ? -1 : c.i)).filter(i => i >= 0))];
    const pair = i => G.cards.map((c, n) => (c.i === i ? n : -1)).filter(n => n >= 0);
    if (k === "slow") { G.time = Math.min(99, G.time + 10); FX.float(innerWidth / 2, 70, T("bonus", { n: "10s" }), { c: "#7dd3fc", size: 24 }); }
    if (k === "hint" && left.length) { const p = pair(left[0]); p.forEach(n => btn(n).classList.add("peek")); setTimeout(() => p.forEach(n => btn(n)?.classList.remove("peek")), 1300); }
    if (k === "bomb" && left.length) {
      const [a, c] = pair(left[0]);
      G.open = []; grid.querySelectorAll(".c.on:not(.ok)").forEach(x => x.classList.remove("on"));
      btn(a).classList.add("on"); btn(c).classList.add("on");
      FX.flash("rgba(251,146,60,.45)");
      match(a, c);
    }
    E.haptic("MEDIUM"); hud();
  });

  const tick = () => {
    if (!G || G.over || paused || document.hidden) return;
    G.time -= 0.25;
    if (G.time <= 0) { G.time = 0; hud(); return finish(false); }
    hud();
  };

  async function finish(win) {
    if (G.over) return;
    G.over = true; clearInterval(timer);
    const bonus = win ? 50 + Math.ceil(G.time) * 2 : 0;
    G.score += bonus;
    hud();
    if (win) { const [cx, cy] = mid(grid); for (let i = 0; i < 4; i++) setTimeout(() => FX.burst(cx + (Math.random() - 0.5) * 200, cy + (Math.random() - 0.5) * 200, { c: ["#fde68a", "#f472b6", "#a78bfa", "#86efac"], n: 30, power: 1.4 }), i * 160); }
    else FX.shake(app, 0.5);
    const r = await E.score(G.score).catch(() => ({ best: G.score, record: false }));
    const stars = !win ? (G.done >= 4 ? 1 : 0) : G.time >= 25 ? 3 : G.time >= 10 ? 2 : 1;
    setTimeout(() => FX.end({ title: T(win ? "win" : "timeup"), sub: T("sub", { n: G.done, all: G.ws.length }), score: G.score, stars, record: r.record,
      bestTxt: T("best", { n: r.best }), recordTxt: T("record"), againTxt: T("again"), homeTxt: T("home"),
      again: start, home: () => E.close() }), win ? 700 : 300);
  }

  const start = () => {
    clearInterval(timer);
    deal();
    $("#intro").hidden = true;
    timer = setInterval(tick, 250);
  };

  E.on("pause", () => { paused = true; });
  E.on("resume", () => { paused = false; });

  deal();
  const st = await E.load().catch(() => null) || {};
  $("#how").textContent = T("how");
  $("#go").textContent = T("start");
  $("#intro").hidden = false;
  $("#go").onclick = () => { if (!st.seen) { st.seen = 1; E.save(st).catch(() => {}); } start(); };
})();
