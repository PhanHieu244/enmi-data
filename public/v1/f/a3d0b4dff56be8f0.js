// Xếp chữ (Enmi Game SDK, 28/10/2026) — thấy NGHĨA, chạm các ô chữ đã xáo để ghép lại đúng TỪ. 90 giây, combo khi ghép liền tay.
// Chạm ô đã đặt = trả về. Vật phẩm: hint (lộ 1 chữ tiếp) · slow (+10 giây) · bomb (bỏ ô thừa). Chạy mọi thứ tiếng (tách theo ký tự hiển thị).
// Thuần trong game: chỉ đọc từ qua Enmi.words, báo điểm Enmi.score.
(async () => {
  const E = globalThis.Enmi, FX = globalThis.FX, G0 = globalThis.GK, T = G0.t;
  const app = document.getElementById("app");
  const TIME = 90;
  const all = await G0.words(40, 4);
  if (!all) return;
  const pool = all.filter(x => { const n = G0.chars(x.w.trim()).length; return n >= 2 && n <= 12; });
  const list = pool.length >= 4 ? pool : all;
  app.innerHTML = `<div class="gk-top"><span class="gk-sc" id="sc">0</span><span class="gk-combo" id="cb"></span><span class="gk-sp"></span><span class="gk-chip" id="n"></span></div>
    <div class="gk-time" id="tm"><i></i></div>
    <div class="gk-q" id="q"></div>
    <div class="gk-stage"><div class="slots" id="slots"></div><div class="tiles" id="tiles"></div></div>`;
  const $ = s => app.querySelector(s);
  let S = null, timer = 0, paused = false;
  const pool2 = () => G0.shuffle(list.slice());

  const hud = () => {
    $("#sc").textContent = S.score;
    $("#n").textContent = "✓ " + S.done;
    $("#tm i").style.width = Math.max(0, Math.min(1, S.time / TIME)) * 100 + "%";
    $("#tm").classList.toggle("low", S.time <= 10);
    const c = $("#cb"); c.textContent = T("combo", { n: S.combo }); c.classList.toggle("on", S.combo > 1);
  };
  // 1 vòng: từ + ô chữ xáo (thêm 1–2 chữ thừa lấy từ từ khác khi từ ngắn)
  function round() {
    const w = S.deck.pop() || (S.deck = pool2()).pop();
    const ch = G0.chars(w.w.trim());
    const extra = ch.length <= 6 ? G0.shuffle(G0.chars(G0.pick(list).w.replace(/\s/g, ""))).slice(0, ch.length <= 3 ? 2 : 1) : [];
    S.cur = { w, ch, put: [], tiles: G0.shuffle([...ch.map((c, i) => ({ c, i, real: true })), ...extra.map(c => ({ c, real: false }))]).map((t, k) => ({ ...t, k, used: false })) };
    $("#q").innerHTML = `<div><small></small><span></span></div>`;
    $("#q small").textContent = T("ask");
    $("#q span").textContent = w.m;
    draw();
  }
  function draw() {
    const c = S.cur;
    $("#slots").innerHTML = c.ch.map((ch, i) => ch === " " ? `<i class="gap"></i>` : `<button class="sl ${c.put[i] != null ? "on" : ""}" data-s="${i}">${c.put[i] != null ? "" : ""}</button>`).join("");
    c.ch.forEach((ch, i) => { const b = $(`[data-s="${i}"]`); if (b && c.put[i] != null) b.textContent = c.tiles[c.put[i]].c; });
    $("#tiles").innerHTML = c.tiles.filter(t => t.c !== " ").map(t => `<button class="tl ${t.used ? "used" : ""}" data-t="${t.k}"></button>`).join("");
    c.tiles.forEach(t => { const b = $(`[data-t="${t.k}"]`); if (b) b.textContent = t.c; });
  }
  const nextSlot = () => S.cur.ch.findIndex((ch, i) => ch !== " " && S.cur.put[i] == null);
  function place(k) {
    const c = S.cur, t = c.tiles[k], i = nextSlot();
    if (i < 0 || t.used) return;
    t.used = true; c.put[i] = k; G0.snd("tap"); E.haptic("LIGHT");
    draw();
    if (nextSlot() < 0) check();
  }
  function check() {
    const c = S.cur, got = c.ch.map((ch, i) => (ch === " " ? " " : c.tiles[c.put[i]].c)).join("");
    if (got === c.ch.join("")) {
      S.done++; const pts = 10 * c.ch.length * S.combo; S.score += pts;
      const [x, y] = G0.mid($("#slots")); FX.burst(x, y, { c: ["#86efac", "#fde68a", "#fff"], n: 22 + S.combo * 4 }); FX.float(x, y - 30, "+" + pts, { c: "#fde68a", size: 26 });
      if (S.combo >= 3) FX.float(innerWidth / 2, innerHeight * 0.28, T("combo", { n: S.combo }), { c: "#f9a8d4", size: 30 });
      S.combo = Math.min(5, S.combo + 1); S.time = Math.min(TIME, S.time + 3); G0.tone("ok"); E.haptic("MEDIUM");
      $("#slots").classList.add("win"); hud();
      setTimeout(() => { $("#slots").classList.remove("win"); if (!S.over) round(); }, 520);
    } else {
      S.combo = 1; G0.tone("bad"); E.haptic("HEAVY"); FX.shake($("#slots"), 0.35);
      setTimeout(() => { c.put = []; c.tiles.forEach(t => (t.used = false)); draw(); hud(); }, 450);
    }
  }
  app.addEventListener("click", e => {
    if (!S || S.over || paused) return;
    const t = e.target.closest("[data-t]"), s = e.target.closest("[data-s]");
    if (t) place(+t.dataset.t);
    else if (s && S.cur.put[+s.dataset.s] != null) { const i = +s.dataset.s; S.cur.tiles[S.cur.put[i]].used = false; delete S.cur.put[i]; G0.snd("flip"); draw(); }
  });
  const pw = G0.pw(["hint", "slow", "bomb"], k => {
    const c = S.cur;
    if (k === "slow") { S.time = Math.min(99, S.time + 10); FX.float(innerWidth / 2, 80, "+10s", { c: "#7dd3fc", size: 24 }); }
    if (k === "hint") { const i = nextSlot(); if (i >= 0) { const t = c.tiles.find(t => t.real && !t.used && t.c === c.ch[i]); if (t) place(t.k); } }
    if (k === "bomb") { c.tiles.forEach(t => { if (!t.real) t.used = true; }); FX.flash("rgba(251,146,60,.4)"); draw(); }
    hud();
  });
  pw.can = () => S && !S.over;

  const tick = () => { if (!S || S.over || paused || document.hidden) return; S.time -= 0.25; if (S.time <= 0) { S.time = 0; hud(); return finish(); } hud(); };
  function finish() {
    S.over = true; clearInterval(timer);
    G0.end({ win: S.done >= 5, title: T("timeup"), score: S.score, stars: S.done >= 15 ? 3 : S.done >= 9 ? 2 : S.done >= 4 ? 1 : 0, sub: T("sub", { n: S.done }) });
  }
  const start = () => { clearInterval(timer); S = { deck: pool2(), score: 0, combo: 1, time: TIME, done: 0, over: false }; round(); hud(); timer = setInterval(tick, 250); };
  G0.again = start;
  E.on("pause", () => { paused = true; }); E.on("resume", () => { paused = false; });
  G0.intro(`<svg viewBox="0 0 120 120"><rect x="8" y="40" width="30" height="36" rx="8" fill="#fde68a"/><rect x="45" y="30" width="30" height="36" rx="8" fill="#f9a8d4" transform="rotate(8 60 48)"/><rect x="82" y="44" width="30" height="36" rx="8" fill="#a5f3fc" transform="rotate(-6 97 62)"/><text x="23" y="66" font-size="22" font-weight="900" text-anchor="middle" fill="#78350f">A</text><text x="60" y="56" font-size="22" font-weight="900" text-anchor="middle" fill="#831843" transform="rotate(8 60 48)">b</text><text x="97" y="70" font-size="22" font-weight="900" text-anchor="middle" fill="#155e75" transform="rotate(-6 97 62)">c</text><rect x="14" y="90" width="92" height="8" rx="4" fill="rgba(255,255,255,.5)"/></svg>`, T("how"), start);
})();
