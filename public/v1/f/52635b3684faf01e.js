// Cứu bóng bay (Enmi Game SDK, 28/10/2026) — thể loại đoán chữ: thấy NGHĨA, chọn từng chữ cái để lộ TỪ. Mỗi lần chọn sai = vỡ 1 quả bóng
// đang nâng Enmi (6 quả). Giải xong 1 từ = +1 bóng (tối đa 6) và sang từ mới; hết bóng = kết thúc. Bàn phím = chữ của từ + chữ nhiễu
// (mọi thứ tiếng: tách theo ký tự hiển thị). Vật phẩm: hint (lộ 1 chữ) · shield (+1 bóng) · bomb (bỏ 3 phím sai).
(async () => {
  const E = globalThis.Enmi, FX = globalThis.FX, G0 = globalThis.GK, T = G0.t;
  const app = document.getElementById("app"), MAXB = 6;
  const all = await G0.words(40, 4);
  if (!all) return;
  const ok = all.filter(x => { const n = G0.chars(x.w.trim()).length; return n >= 2 && n <= 14; });
  const list = ok.length >= 4 ? ok : all;
  const letters = [...new Set(list.flatMap(x => G0.chars(x.w.toLowerCase()).filter(c => c.trim())))];
  app.innerHTML = `<div class="gk-top"><span class="gk-sc" id="sc">0</span><span class="gk-combo" id="cb"></span><span class="gk-sp"></span><span class="gk-chip" id="n"></span></div>
    <div class="gk-q" id="q"></div>
    <div class="gk-stage" id="st"><div class="sky" id="sky"></div><div class="word" id="wd"></div></div>
    <div class="keys" id="keys"></div>`;
  const $ = s => app.querySelector(s);
  let S = null;
  const COLS = ["#f43f5e", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7", "#ec4899"];
  const ROBOT = `<svg class="bot" viewBox="0 0 64 64"><rect x="12" y="16" width="40" height="30" rx="12" fill="#fff"/><rect x="17" y="22" width="30" height="16" rx="7" fill="#12233f"/><circle cx="26" cy="30" r="3.4" fill="#67e8f9"/><circle cx="38" cy="30" r="3.4" fill="#67e8f9"/><rect x="24" y="47" width="16" height="12" rx="5" fill="#3b82f6"/></svg>`;
  function sky() {
    const b = S.balloons, x0 = 50 - (b - 1) * 7;
    $("#sky").innerHTML = `<svg class="str" viewBox="0 0 100 100" preserveAspectRatio="none">${Array.from({ length: b }, (_, i) => `<path d="M${x0 + i * 14} ${30 + (i % 2) * 6} Q ${50 + (i - b / 2) * 2} 70 50 84" stroke="rgba(255,255,255,.6)" stroke-width=".5" fill="none" vector-effect="non-scaling-stroke"/>`).join("")}</svg>` +
      Array.from({ length: b }, (_, i) => `<i class="bl" style="left:${x0 + i * 14}%;top:${18 + (i % 2) * 6}%;--c:${COLS[i % 6]};--d:${i * 0.3}s"></i>`).join("") + `<div class="botw ${b <= 2 ? "low" : ""}" style="top:${84 - (6 - b) * 1.5}%">${ROBOT}</div>`;
  }
  const hud = () => {
    $("#sc").textContent = S.score; $("#n").textContent = "✓ " + S.done;
    const c = $("#cb"); c.textContent = T("combo", { n: S.combo }); c.classList.toggle("on", S.combo > 1);
  };
  function round() {
    const w = G0.pick(list), ch = G0.chars(w.w.trim()), low = ch.map(c => c.toLowerCase());
    const need = [...new Set(low.filter(c => c.trim()))];
    const decoy = G0.shuffle(letters.filter(c => !need.includes(c))).slice(0, Math.max(4, 14 - need.length));
    S.cur = { w, ch, low, open: new Set([" ", "-", "'", "’"]), keys: G0.shuffle([...need, ...decoy]), bad: new Set(), miss: 0 };
    $("#q").innerHTML = `<div><small></small><span></span></div>`; $("#q small").textContent = T("ask"); $("#q span").textContent = w.m;
    draw();
  }
  function draw() {
    const c = S.cur;
    $("#wd").innerHTML = c.ch.map((ch, i) => (ch === " " ? `<i class="sp"></i>` : `<b class="${c.open.has(c.low[i]) ? "on" : ""}"></b>`)).join("");
    [...$("#wd").children].forEach((b, i) => { if (b.tagName === "B" && c.open.has(c.low[i])) b.textContent = c.ch[i]; });
    $("#keys").innerHTML = c.keys.map((k, i) => `<button data-k="${i}" class="${c.open.has(k) ? "ok" : c.bad.has(k) ? "no" : ""}"></button>`).join("");
    [...$("#keys").children].forEach((b, i) => (b.textContent = c.keys[i]));
  }
  const solved = () => S.cur.low.every(c => S.cur.open.has(c));
  function press(k) {
    const c = S.cur; if (!S || S.over || c.open.has(k) || c.bad.has(k)) return;
    if (c.low.includes(k)) {
      c.open.add(k); G0.snd("tap"); E.haptic("LIGHT"); draw();
      if (solved()) {
        S.done++; const pts = (10 + c.ch.length * 2) * S.combo - c.miss * 3; S.score += Math.max(5, pts); S.combo = c.miss ? 1 : Math.min(5, S.combo + 1);
        const [x, y] = G0.mid($("#wd")); FX.burst(x, y, { c: ["#86efac", "#fde68a", "#fff"], n: 26 }); FX.float(x, y - 30, "+" + Math.max(5, pts), { c: "#fde68a", size: 26 });
        G0.tone("ok"); E.haptic("MEDIUM");
        if (S.balloons < MAXB) { S.balloons++; sky(); }
        hud(); setTimeout(() => !S.over && round(), 700);
      }
    } else {
      c.bad.add(k); c.miss++; S.balloons--; G0.tone("bad"); E.haptic("HEAVY");
      const bl = $("#sky").querySelectorAll(".bl"), last = bl[bl.length - 1];
      if (last) { const [x, y] = G0.mid(last); FX.burst(x, y, { c: [getComputedStyle(last).getPropertyValue("--c"), "#fff"], n: 16, power: 0.8, ring: false }); }
      sky(); draw(); hud();
      if (S.balloons <= 0) finish();
    }
  }
  $("#keys").addEventListener("click", e => { const b = e.target.closest("[data-k]"); if (b) press(S.cur.keys[+b.dataset.k]); });
  addEventListener("keydown", e => { if (S && !S.over && e.key.length === 1) press(e.key.toLowerCase()); });
  const pw = G0.pw(["hint", "shield", "bomb"], k => {
    const c = S.cur;
    if (k === "hint") { const m = c.low.find(x => !c.open.has(x)); if (m) press(m); }
    if (k === "shield") { S.balloons = Math.min(MAXB + 2, S.balloons + 1); sky(); }
    if (k === "bomb") { G0.shuffle(c.keys.filter(x => !c.low.includes(x) && !c.bad.has(x))).slice(0, 3).forEach(x => c.bad.add(x)); FX.flash("rgba(251,146,60,.35)"); draw(); }
    hud();
  });
  pw.can = () => S && !S.over;
  function finish() {
    S.over = true;
    $("#sky .botw")?.classList.add("fall");
    G0.end({ win: S.done >= 5, score: S.score, stars: S.done >= 12 ? 3 : S.done >= 7 ? 2 : S.done >= 3 ? 1 : 0, sub: T("sub", { n: S.done, w: S.cur.w.w }) });
  }
  const start = () => { S = { score: 0, combo: 1, done: 0, balloons: MAXB, over: false }; sky(); round(); hud(); };
  G0.again = start;
  G0.intro(`<svg viewBox="0 0 120 120"><path d="M40 50 60 92M60 40v52M82 50 60 92" stroke="#fff" stroke-width="1.6" fill="none"/><ellipse cx="40" cy="36" rx="14" ry="17" fill="#f43f5e"/><ellipse cx="60" cy="26" rx="14" ry="17" fill="#f59e0b"/><ellipse cx="82" cy="36" rx="14" ry="17" fill="#3b82f6"/><rect x="47" y="88" width="26" height="22" rx="8" fill="#fff"/><rect x="51" y="93" width="18" height="9" rx="4" fill="#12233f"/><circle cx="56" cy="97.5" r="2" fill="#67e8f9"/><circle cx="64" cy="97.5" r="2" fill="#67e8f9"/></svg>`, T("how"), start);
})();
