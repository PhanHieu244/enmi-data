// Mưa sao từ (Enmi Game SDK) — sao băng mang từ rơi xuống, chạm đúng sao có từ khớp nghĩa ở dưới.
// Thuần trong game: chỉ đọc từ qua Enmi.words, vật phẩm qua Enmi.use, báo điểm Enmi.score. Không đụng dữ liệu học.
(async () => {
  const E = globalThis.Enmi, FX = globalThis.FX, T = (k, v) => E.t(k, v);
  const $ = s => document.querySelector(s);
  const app = $("#app"), cv = $("#cv"), x = cv.getContext("2d");
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const PWK = ["shield", "slow", "bomb", "hint"];
  const COLS = ["#a78bfa", "#38bdf8", "#f472b6", "#fbbf24", "#34d399", "#fb7185"];

  const pool = await E.words(40).catch(() => []);
  if (pool.length < 4) {
    const f = document.createElement("div");
    f.className = "few";
    f.innerHTML = `<p></p><button></button>`;
    f.querySelector("p").textContent = T("few");
    f.querySelector("button").textContent = T("close");
    f.querySelector("button").onclick = () => E.close();
    app.appendChild(f);
    return;
  }

  // ---------- khung vẽ + nền (vẽ sẵn 1 lần mỗi lần đổi cỡ) ----------
  let W = 0, H = 0, dpr = Math.min(2, devicePixelRatio || 1), bg = null;
  const far = Array.from({ length: 80 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.2 + 0.3, t: Math.random() * 6 }));
  const near = Array.from({ length: 26 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.8 + 0.8, v: 0.02 + Math.random() * 0.03 }));
  const fit = () => {
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0);
    bg = document.createElement("canvas"); bg.width = W * dpr; bg.height = H * dpr;
    const b = bg.getContext("2d"); b.scale(dpr, dpr);
    const g = b.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#070a1f"); g.addColorStop(0.55, "#1b1150"); g.addColorStop(1, "#3b1572");
    b.fillStyle = g; b.fillRect(0, 0, W, H);
    // tinh vân
    for (const [cx, cy, r, c] of [[0.2, 0.25, 0.55, "rgba(124,58,237,.28)"], [0.85, 0.5, 0.5, "rgba(236,72,153,.2)"], [0.4, 0.85, 0.6, "rgba(56,189,248,.14)"]]) {
      const n = b.createRadialGradient(cx * W, cy * H, 0, cx * W, cy * H, r * Math.max(W, H));
      n.addColorStop(0, c); n.addColorStop(1, "rgba(0,0,0,0)"); b.fillStyle = n; b.fillRect(0, 0, W, H);
    }
    // đất phát sáng
    const gg = b.createLinearGradient(0, H - 120, 0, H); gg.addColorStop(0, "rgba(167,139,250,0)"); gg.addColorStop(1, "rgba(167,139,250,.5)");
    b.fillStyle = gg; b.fillRect(0, H - 120, W, 120);
  };
  fit();
  addEventListener("resize", fit);

  // ---------- trạng thái ----------
  let S, raf = 0, last = 0, paused = false, inv = await E.inv().catch(() => ({}));
  const floorY = () => H - 150 - (E.safe?.b || 0);
  const reset = () => (S = { score: 0, lives: 3, combo: 1, round: 0, right: 0, met: [], trail: [], slowT: 0, hintT: 0, shake: 0, target: null, over: false, lvl: 1 });

  // ---------- HUD ----------
  const hearts = (gain) => {
    const l = $("#lives"), have = l.children.length;
    if (S.lives < have) for (let i = have - 1; i >= S.lives; i--) { const h = l.children[i]; h.classList.add("out"); setTimeout(() => h.remove(), 500); }
    else for (let i = have; i < S.lives; i++) { const h = document.createElement("span"); h.innerHTML = FX.icon.heart; if (gain) h.className = "in"; l.appendChild(h); }
  };
  const hud = () => {
    $("#sc").textContent = S.score;
    const c = $("#combo");
    c.textContent = T("combo", { n: S.combo });
    c.classList.toggle("on", S.combo > 1); c.classList.toggle("hot", S.combo >= 4);
    for (const k of PWK) { const b = document.querySelector(`[data-pw="${k}"]`); if (!b) continue; b.querySelector("b").textContent = inv[k] || 0; b.classList.toggle("zero", !(inv[k] > 0)); }
    document.querySelector('[data-pw="slow"]')?.classList.toggle("act", S.slowT > 0);
    document.querySelector('[data-pw="hint"]')?.classList.toggle("act", S.hintT > 0);
  };
  $("#bar").innerHTML = PWK.map(k => `<button class="pw" data-pw="${k}" style="--pc:${E.pw[k]?.c || "#888"}" aria-label="${(E.pw[k]?.name || k).replace(/"/g, "")}">${E.pw[k]?.svg || ""}<b>0</b></button>`).join("");
  $("#askL").textContent = T("ask");

  // toạ độ canvas → màn hình (canvas phủ kín nên trùng nhau)
  const next = () => {
    S.round++;
    S.target = pool[S.round % pool.length];
    const k = Math.min(3, 1 + Math.floor(S.round / 6));
    const opts = shuffle([S.target, ...shuffle(pool.filter(p => p !== S.target)).slice(0, k)]);
    const sp = 38 + Math.min(80, S.round * 3);
    S.met = opts.map((o, i) => ({ o, x: (W / (opts.length + 1)) * (i + 1) + (Math.random() - 0.5) * 24, y: -50 - Math.random() * 110, vy: sp * (0.85 + Math.random() * 0.3), c: COLS[(S.round + i) % COLS.length], dead: false, ph: Math.random() * 6 }));
    const a = $("#askBox"); a.classList.remove("new"); void a.offsetWidth; a.classList.add("new");
    $("#ask").textContent = S.target.m;
    hud();
  };

  const lose = (m, why) => {
    S.lives--; S.combo = 1; S.shake = 0.45;
    FX.burst(m.x, m.y, { c: ["#f87171", "#fb7185", "#fff"], n: 22, power: 0.9 });
    FX.shake(app, 0.7); FX.flash("rgba(239,68,68,.55)");
    if (why === "floor") FX.float(m.x, Math.min(m.y, floorY()) - 30, T("miss"), { c: "#fca5a5" });
    E.haptic("HEAVY");
    hearts();
    if (S.lives <= 0) return end();
    hud();
  };
  const win = m => {
    m.dead = true;
    const pts = 10 * S.combo;
    S.score += pts; S.right++;
    FX.burst(m.x, m.y, { c: [m.c, "#fff", "#fde68a"], n: 26 + S.combo * 4, power: 1 + S.combo * 0.12 });
    FX.float(m.x, m.y - 26, "+" + pts, { c: m.c, size: 22 + S.combo * 2 });
    if (S.combo >= 3) { FX.float(W / 2, H * 0.36, T("combo", { n: S.combo }), { c: "#fde68a", size: 30 }); FX.shake(app, 0.15 + S.combo * 0.05); }
    S.combo = Math.min(5, S.combo + 1);
    FX.pop($("#sc"));
    E.haptic(S.combo >= 4 ? "MEDIUM" : "LIGHT");
    if (S.right % 8 === 0) { S.lvl++; setTimeout(() => FX.float(W / 2, H * 0.28, T("level", { n: S.lvl }), { c: "#a5f3fc", size: 34 }), 250); }
    next();
  };

  cv.addEventListener("pointerdown", e => {
    if (S.over || paused) return;
    const m = S.met.filter(m => !m.dead).sort((a, b) => Math.hypot(a.x - e.clientX, a.y - e.clientY) - Math.hypot(b.x - e.clientX, b.y - e.clientY))[0];
    if (!m || Math.hypot(m.x - e.clientX, m.y - e.clientY) > 50) return;
    if (m.o === S.target) win(m);
    else { m.dead = true; lose(m, "wrong"); if (!S.over && S.met.every(z => z.dead || z.o !== S.target)) next(); }
  });

  $("#bar").addEventListener("click", async e => {
    const b = e.target.closest("[data-pw]");
    if (!b || S.over) return;
    const k = b.dataset.pw;
    const r = await E.use(k).catch(() => ({ ok: false }));
    if (!r.ok) { FX.shake(b, 0.4); return; }
    inv[k] = r.n;
    const bx = b.getBoundingClientRect();
    FX.burst(bx.left + bx.width / 2, bx.top, { c: [E.pw[k].c, "#fff"], n: 14, power: 0.6, ring: false });
    if (k === "shield") { S.lives = Math.min(5, S.lives + 1); hearts(true); }
    if (k === "slow") S.slowT = 6;
    if (k === "hint") S.hintT = 4;
    if (k === "bomb") {
      for (const m of S.met) if (!m.dead) FX.burst(m.x, m.y, { c: [m.c, "#fde68a", "#fff"], n: 30, power: 1.4 });
      FX.flash("rgba(251,191,36,.5)"); FX.shake(app, 0.6);
      S.score += 10 * S.combo; S.right++;
      FX.float(W / 2, H * 0.4, "+" + 10 * S.combo, { c: "#fde68a", size: 30 });
      next();
    }
    E.haptic("MEDIUM"); hud();
  });

  // ---------- vẽ ----------
  const draw = now => {
    const t = now / 1000;
    x.save();
    if (S.shake > 0 && !E.rm) x.translate((Math.random() - 0.5) * 12 * S.shake, (Math.random() - 0.5) * 12 * S.shake);
    x.drawImage(bg, -6, -6, W + 12, H + 12);
    for (const s of far) { x.globalAlpha = 0.3 + 0.7 * Math.abs(Math.sin(t * 0.7 + s.t)); x.fillStyle = "#fff"; x.beginPath(); x.arc(s.x * W, s.y * H, s.r, 0, 7); x.fill(); }
    x.globalAlpha = 0.7; x.fillStyle = "#c4b5fd";
    for (const s of near) { x.beginPath(); x.arc(s.x * W, s.y * H, s.r, 0, 7); x.fill(); }
    x.globalAlpha = 1;
    // vệt đuôi (hạt nhỏ)
    x.globalCompositeOperation = "lighter";
    for (const p of S.trail) { const a = Math.max(0, p.l / 0.5); x.globalAlpha = a * 0.8; x.fillStyle = p.c; x.beginPath(); x.arc(p.x, p.y, 2 + 4 * a, 0, 7); x.fill(); }
    x.globalAlpha = 1;
    for (const m of S.met) {
      if (m.dead) continue;
      const dim = S.hintT > 0 && m.o !== S.target;
      x.globalAlpha = dim ? 0.22 : 1;
      const tl = x.createLinearGradient(m.x, m.y - 90, m.x, m.y);
      tl.addColorStop(0, "rgba(255,255,255,0)"); tl.addColorStop(1, m.c);
      x.strokeStyle = tl; x.lineWidth = 18; x.lineCap = "round";
      x.beginPath(); x.moveTo(m.x - 8, m.y - 90); x.lineTo(m.x, m.y - 12); x.stroke();
      const pulse = 1 + 0.05 * Math.sin(t * 6 + m.ph);
      const halo = x.createRadialGradient(m.x, m.y, 10, m.x, m.y, 62 * pulse);
      halo.addColorStop(0, m.c); halo.addColorStop(1, "rgba(0,0,0,0)");
      x.globalAlpha *= 0.55; x.fillStyle = halo; x.beginPath(); x.arc(m.x, m.y, 62 * pulse, 0, 7); x.fill();
      x.globalAlpha = dim ? 0.22 : 1;
    }
    x.globalCompositeOperation = "source-over";
    for (const m of S.met) {
      if (m.dead) continue;
      const dim = S.hintT > 0 && m.o !== S.target;
      x.globalAlpha = dim ? 0.22 : 1;
      const rg = x.createRadialGradient(m.x - 10, m.y - 12, 3, m.x, m.y, 40);
      rg.addColorStop(0, "#fff"); rg.addColorStop(0.35, m.c); rg.addColorStop(1, "rgba(20,10,60,.85)");
      x.fillStyle = rg; x.beginPath(); x.arc(m.x, m.y, 38, 0, 7); x.fill();
      x.strokeStyle = "rgba(255,255,255,.55)"; x.lineWidth = 1.5; x.stroke();
      x.fillStyle = "#fff"; x.font = `800 ${m.o.w.length > 10 ? 12 : m.o.w.length > 7 ? 14 : 16}px system-ui,-apple-system,sans-serif`;
      x.textAlign = "center"; x.textBaseline = "middle"; x.shadowColor = "rgba(0,0,0,.7)"; x.shadowBlur = 6;
      x.fillText(m.o.w, m.x, m.y + 1, 84); x.shadowBlur = 0;
    }
    x.globalAlpha = 1;
    x.restore();
  };

  const loop = now => {
    if (S.over) return;
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (!paused) {
      const k = S.slowT > 0 ? 0.4 : 1;
      S.slowT = Math.max(0, S.slowT - dt); S.hintT = Math.max(0, S.hintT - dt); S.shake = Math.max(0, S.shake - dt);
      for (const s of near) { s.y += s.v * dt * k; if (s.y > 1) { s.y = 0; s.x = Math.random(); } }
      for (const m of S.met) {
        if (m.dead) continue;
        m.y += m.vy * dt * k;
        if (!E.rm && Math.random() < 0.7) S.trail.push({ x: m.x + (Math.random() - 0.5) * 16, y: m.y - 30 - Math.random() * 20, l: 0.5, c: m.c });
        if (m.y > floorY()) {
          m.dead = true;
          if (m.o === S.target) { lose(m, "floor"); if (S.over) return; next(); break; }
        }
      }
      if (!S.over && S.met.every(m => m.dead)) next();
      for (const p of S.trail) { p.l -= dt; p.y -= 20 * dt; }
      S.trail = S.trail.filter(p => p.l > 0);
      app.classList.toggle("slow", S.slowT > 0);
      if (Math.round(now / 250) !== Math.round((now - dt * 1000) / 250)) hud();
    }
    draw(now);
    raf = requestAnimationFrame(loop);
  };

  const start = () => {
    reset();
    $("#lives").innerHTML = ""; hearts();
    $("#intro").hidden = true;
    last = performance.now();
    next();
    raf = requestAnimationFrame(loop);
  };

  async function end() {
    S.over = true; cancelAnimationFrame(raf);
    app.classList.remove("slow");
    draw(performance.now());
    const r = await E.score(S.score).catch(() => ({ best: S.score, record: false }));
    const stars = S.score >= 300 ? 3 : S.score >= 140 ? 2 : S.score >= 40 ? 1 : 0;
    E.haptic(r.record ? "MEDIUM" : "LIGHT");
    FX.end({ title: T("over"), sub: T("sub", { n: S.right }), score: S.score, stars, record: r.record,
      bestTxt: T("best", { n: r.best }), recordTxt: T("record"), againTxt: T("again"), homeTxt: T("home"),
      again: start, home: () => E.close() });
  }

  E.on("pause", () => { paused = true; });
  E.on("resume", () => { paused = false; last = performance.now(); });
  document.addEventListener("visibilitychange", () => { paused = document.hidden; last = performance.now(); });

  // màn mở đầu: lần đầu có lời chỉ dẫn; vẽ nền phía sau
  reset(); hud(); draw(performance.now());
  const st = await E.load().catch(() => null) || {};
  $("#how").textContent = T("how");
  $("#go").textContent = T("start");
  $("#intro").hidden = false;
  $("#go").onclick = () => { if (!st.seen) { st.seen = 1; E.save(st).catch(() => {}); } start(); };
})();
