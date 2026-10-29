// Đúng hay sai (Enmi Game SDK, 28/10/2026) — thẻ hiện TỪ + 1 NGHĨA (một nửa là nghĩa đúng). Vuốt phải / chạm ✓ nếu đúng, vuốt trái / ✗ nếu sai.
// 45 giây, đúng liên tiếp tăng hệ số, sai −3 giây. Vật phẩm: shield (bỏ qua 1 lần sai) · slow (+8 giây) · hint (nháy đáp án của thẻ này).
(async () => {
  const E = globalThis.Enmi, FX = globalThis.FX, G0 = globalThis.GK, T = G0.t;
  const app = document.getElementById("app"), TIME = 45;
  const all = await G0.words(40, 4);
  if (!all) return;
  app.innerHTML = `<div class="gk-top"><span class="gk-sc" id="sc">0</span><span class="gk-combo" id="cb"></span><span class="gk-sp"></span><span class="gk-chip" id="sh" hidden>🛡</span></div>
    <div class="gk-time" id="tm"><i></i></div>
    <div class="gk-stage" id="st"><div class="deck" id="deck"></div></div>
    <div class="yn"><button class="no" data-a="0" aria-label="✗">✕</button><button class="yes" data-a="1" aria-label="✓">✓</button></div>`;
  const $ = s => app.querySelector(s), deck = $("#deck");
  let S = null, timer = 0, paused = false;
  const hud = () => {
    $("#sc").textContent = S.score;
    $("#tm i").style.width = Math.max(0, Math.min(1, S.time / TIME)) * 100 + "%"; $("#tm").classList.toggle("low", S.time <= 8);
    const c = $("#cb"); c.textContent = T("combo", { n: S.combo }); c.classList.toggle("on", S.combo > 1);
    $("#sh").hidden = !S.shield;
  };
  function card() {
    const w = G0.pick(all), truth = Math.random() < 0.5;
    let m = w.m;
    if (!truth) { const o = G0.shuffle(all.filter(y => y.m !== w.m)); m = o.length ? o[0].m : w.m; }
    S.cur = { w, m, ok: m === w.m };
    const el = document.createElement("div");
    el.className = "cd in";
    el.innerHTML = `<b></b><i></i><span></span><em class="lab y">✓</em><em class="lab n">✕</em>`;
    el.querySelector("b").textContent = w.w; el.querySelector("span").textContent = m;
    deck.querySelector(".cd:not(.out)")?.remove();
    deck.appendChild(el);
    bindDrag(el);
  }
  function answer(yes, el = deck.querySelector(".cd:not(.out)")) {
    if (!S || S.over || paused || !el) return;
    const right = yes === S.cur.ok;
    el.classList.add("out", yes ? "r" : "l"); el.style.transform = "";
    const [px, py] = G0.mid(el);
    if (right) {
      const pts = 10 * S.combo; S.score += pts; S.n++; S.combo = Math.min(6, S.combo + (S.n % 3 === 0 ? 1 : 0));
      FX.burst(px, py, { c: ["#86efac", "#fde68a", "#fff"], n: 14 + S.combo * 3 }); FX.float(px, py - 40, "+" + pts, { c: "#fde68a", size: 24 });
      G0.tone("ok"); E.haptic("LIGHT");
    } else if (S.shield) { S.shield = false; FX.float(px, py - 40, "🛡", { size: 34 }); G0.snd("pick"); }
    else {
      S.combo = 1; S.time -= 3; S.miss++; G0.tone("bad"); E.haptic("HEAVY"); FX.flash("rgba(239,68,68,.3)");
      FX.float(px, py - 40, S.cur.w.w + " = " + S.cur.w.m, { c: "#fca5a5", size: 16 });
    }
    setTimeout(() => el.remove(), 380);
    hud();
    if (S.time <= 0) return finish();
    card();
  }
  function bindDrag(el) {
    let x0 = null;
    el.addEventListener("pointerdown", e => { x0 = e.clientX; el.setPointerCapture(e.pointerId); el.classList.remove("in"); });
    el.addEventListener("pointermove", e => { if (x0 == null) return; const dx = e.clientX - x0; el.style.transform = `translateX(${dx}px) rotate(${dx / 18}deg)`; el.dataset.v = dx > 40 ? "y" : dx < -40 ? "n" : ""; });
    el.addEventListener("pointerup", e => { if (x0 == null) return; const dx = e.clientX - x0; x0 = null; el.dataset.v = ""; if (Math.abs(dx) > 70) answer(dx > 0, el); else el.style.transform = ""; });
  }
  app.querySelector(".yn").addEventListener("click", e => { const b = e.target.closest("[data-a]"); if (b) answer(b.dataset.a === "1"); });
  addEventListener("keydown", e => { if (e.key === "ArrowRight") answer(true); if (e.key === "ArrowLeft") answer(false); });
  const pw = G0.pw(["shield", "slow", "hint"], k => {
    if (k === "shield") S.shield = true;
    if (k === "slow") { S.time = Math.min(99, S.time + 8); FX.float(innerWidth / 2, 80, "+8s", { c: "#7dd3fc", size: 24 }); }
    if (k === "hint") { const c = deck.querySelector(".cd:not(.out)"); c?.classList.add(S.cur.ok ? "hy" : "hn"); }
    hud();
  });
  pw.can = k => S && !S.over && !(k === "shield" && S.shield);
  const tick = () => { if (!S || S.over || paused || document.hidden) return; S.time -= 0.25; if (S.time <= 0) { S.time = 0; hud(); return finish(); } hud(); };
  function finish() {
    if (S.over) return; S.over = true; clearInterval(timer);
    const acc = S.n / Math.max(1, S.n + S.miss);
    G0.end({ win: S.n >= 15 && acc >= 0.8, title: T("timeup"), score: S.score, stars: S.n >= 30 && acc >= 0.9 ? 3 : S.n >= 18 ? 2 : S.n >= 8 ? 1 : 0, sub: T("sub", { n: S.n, p: Math.round(acc * 100) }) });
  }
  const start = () => { clearInterval(timer); deck.innerHTML = ""; S = { score: 0, combo: 1, time: TIME, n: 0, miss: 0, shield: false, over: false }; card(); hud(); timer = setInterval(tick, 250); };
  G0.again = start;
  E.on("pause", () => { paused = true; }); E.on("resume", () => { paused = false; });
  G0.intro(`<svg viewBox="0 0 120 120"><rect x="22" y="18" width="76" height="92" rx="14" fill="#fff" transform="rotate(-8 60 64)"/><circle cx="40" cy="98" r="16" fill="#ef4444"/><path d="M33 91l14 14M47 91 33 105" stroke="#fff" stroke-width="5" stroke-linecap="round"/><circle cx="82" cy="98" r="16" fill="#22c55e"/><path d="M74 98l6 6 10-12" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><rect x="38" y="38" width="44" height="8" rx="4" fill="#fb923c" transform="rotate(-8 60 42)"/><rect x="38" y="56" width="34" height="6" rx="3" fill="#fdba74" transform="rotate(-8 55 59)"/></svg>`, T("how"), start);
})();
