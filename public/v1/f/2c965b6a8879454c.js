// Nối từ (Enmi Game SDK, 28/10/2026) — 2 cột: 5 TỪ bên trái, 5 NGHĨA bên phải (xáo). Chạm 1 ô bên này rồi 1 ô bên kia để nối dây;
// đúng = dây sáng màu + điểm, sai = rung + mất combo. Nối hết 5 cặp = lượt mới (4 lượt / ván), 80 giây cho cả ván, xong lượt +8 giây.
// Vật phẩm: hint (nháy 1 cặp) · slow (+10 giây) · bomb (tự nối 1 cặp).
(async () => {
  const E = globalThis.Enmi, FX = globalThis.FX, G0 = globalThis.GK, T = G0.t;
  const app = document.getElementById("app"), K = 5, ROUNDS = 4, TIME = 80;
  const all = await G0.words(40, 5);
  if (!all) return;
  app.innerHTML = `<div class="gk-top"><span class="gk-sc" id="sc">0</span><span class="gk-combo" id="cb"></span><span class="gk-sp"></span><span class="gk-chip" id="rd"></span></div>
    <div class="gk-time" id="tm"><i></i></div>
    <div class="gk-stage" id="st"><svg class="wires" id="wr"></svg><div class="col l" id="L"></div><div class="col r" id="R"></div></div>`;
  const $ = s => app.querySelector(s), st = $("#st");
  let S = null, timer = 0, paused = false;
  const HUE = [330, 38, 145, 205, 270];
  const hud = () => {
    $("#sc").textContent = S.score; $("#rd").textContent = `${Math.min(S.round, ROUNDS)}/${ROUNDS}`;
    $("#tm i").style.width = Math.max(0, Math.min(1, S.time / TIME)) * 100 + "%"; $("#tm").classList.toggle("low", S.time <= 10);
    const c = $("#cb"); c.textContent = T("combo", { n: S.combo }); c.classList.toggle("on", S.combo > 1);
  };
  function round() {
    S.round++;
    const ws = G0.shuffle(all.slice()).slice(0, K);
    S.ws = ws; S.done = new Set(); S.pick = null;
    const lo = G0.shuffle(ws.map((_, i) => i)), ro = G0.shuffle(ws.map((_, i) => i));
    $("#L").innerHTML = lo.map(i => `<button data-s="L" data-i="${i}"></button>`).join("");
    $("#R").innerHTML = ro.map(i => `<button data-s="R" data-i="${i}"></button>`).join("");
    lo.forEach((i, k) => ($("#L").children[k].textContent = ws[i].w));
    ro.forEach((i, k) => ($("#R").children[k].textContent = ws[i].m));
    $("#wr").innerHTML = ""; hud();
  }
  const btn = (s, i) => app.querySelector(`[data-s="${s}"][data-i="${i}"]`);
  function wire(i, hue) {
    const r = st.getBoundingClientRect(), a = btn("L", i).getBoundingClientRect(), b = btn("R", i).getBoundingClientRect();
    const x1 = a.right - r.left - 4, y1 = a.top + a.height / 2 - r.top, x2 = b.left - r.left + 4, y2 = b.top + b.height / 2 - r.top, mx = (x1 + x2) / 2;
    $("#wr").setAttribute("viewBox", `0 0 ${r.width} ${r.height}`);
    $("#wr").insertAdjacentHTML("beforeend", `<path d="M${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}" stroke="hsl(${hue} 90% 62%)" stroke-width="5" fill="none" stroke-linecap="round" class="w"/>`);
  }
  function link(i) {
    S.done.add(i);
    const hue = HUE[S.done.size % HUE.length];
    for (const s of ["L", "R"]) { const b = btn(s, i); b.classList.add("ok"); b.style.setProperty("--h", hue); b.classList.remove("on"); }
    wire(i, hue);
    const pts = 10 * S.combo; S.score += pts; S.combo = Math.min(5, S.combo + 1);
    const [x, y] = G0.mid(btn("R", i)); FX.burst(x, y, { c: [`hsl(${hue} 90% 65%)`, "#fff"], n: 16 + S.combo * 3 }); FX.float(x, y - 24, "+" + pts, { c: "#fde68a", size: 22 });
    G0.tone("ok"); E.haptic("MEDIUM");
    if (S.done.size === K) { S.time = Math.min(TIME, S.time + 8); if (S.round >= ROUNDS) finish(true); else setTimeout(() => !S.over && round(), 600); }
    hud();
  }
  app.addEventListener("click", e => {
    const b = e.target.closest("[data-s]"); if (!b || !S || S.over || paused || b.classList.contains("ok")) return;
    const s = b.dataset.s, i = +b.dataset.i;
    if (!S.pick || S.pick.s === s) { app.querySelectorAll("[data-s].on").forEach(x => x.classList.remove("on")); b.classList.add("on"); S.pick = { s, i }; G0.snd("tap"); E.haptic("LIGHT"); return; }
    const p = S.pick; S.pick = null;
    if (p.i === i) link(i);
    else {
      S.combo = 1; S.miss++; G0.tone("bad"); E.haptic("HEAVY");
      const o = btn(p.s, p.i); o.classList.remove("on"); [o, b].forEach(x => { x.classList.add("bad"); setTimeout(() => x.classList.remove("bad"), 420); });
      hud();
    }
  });
  const pw = G0.pw(["hint", "slow", "bomb"], k => {
    const left = S.ws.map((_, i) => i).filter(i => !S.done.has(i));
    if (k === "slow") { S.time = Math.min(99, S.time + 10); FX.float(innerWidth / 2, 80, "+10s", { c: "#7dd3fc", size: 24 }); }
    if (k === "hint" && left.length) { const i = left[0]; for (const s of ["L", "R"]) { const b = btn(s, i); b.classList.add("hint"); setTimeout(() => b.classList.remove("hint"), 1600); } }
    if (k === "bomb" && left.length) { FX.flash("rgba(251,146,60,.35)"); link(left[0]); }
    hud();
  });
  pw.can = () => S && !S.over;
  const tick = () => { if (!S || S.over || paused || document.hidden) return; S.time -= 0.25; if (S.time <= 0) { S.time = 0; hud(); return finish(false); } hud(); };
  function finish(win) {
    if (S.over) return; S.over = true; clearInterval(timer);
    if (win) S.score += Math.ceil(S.time) * 2;
    const n = (S.round - 1) * K + S.done.size;
    G0.end({ win, title: win ? T("win") : T("timeup"), score: S.score, stars: win ? (S.miss <= 2 ? 3 : S.miss <= 6 ? 2 : 1) : n >= 10 ? 1 : 0, sub: T("sub", { n }) });
  }
  const start = () => { clearInterval(timer); S = { score: 0, combo: 1, time: TIME, round: 0, miss: 0, over: false }; round(); timer = setInterval(tick, 250); };
  G0.again = start;
  E.on("pause", () => { paused = true; }); E.on("resume", () => { paused = false; });
  addEventListener("resize", () => { if (!S || S.over) return; $("#wr").innerHTML = ""; [...S.done].forEach((i, k) => wire(i, HUE[(k + 1) % HUE.length])); });
  G0.intro(`<svg viewBox="0 0 120 120"><rect x="10" y="20" width="34" height="18" rx="8" fill="#fff"/><rect x="10" y="51" width="34" height="18" rx="8" fill="#fff"/><rect x="10" y="82" width="34" height="18" rx="8" fill="#fff"/><rect x="76" y="20" width="34" height="18" rx="8" fill="#fbcfe8"/><rect x="76" y="51" width="34" height="18" rx="8" fill="#fbcfe8"/><rect x="76" y="82" width="34" height="18" rx="8" fill="#fbcfe8"/><path d="M44 29C60 29 60 91 76 91" stroke="#f472b6" stroke-width="4" fill="none"/><path d="M44 60C60 60 60 29 76 29" stroke="#fbbf24" stroke-width="4" fill="none"/></svg>`, T("how"), start);
})();
