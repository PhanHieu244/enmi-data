// Enmi Story Engine — HIỆU ỨNG + PLUGIN (nạp sau core.js, trước mech.js).
// Mọi thứ ở đây là TUỲ CHỌN: truyện không dùng thì không đổi gì. Truyện / bên thứ 3 thêm hiệu ứng, cơ chế, âm thanh riêng bằng plugin
//   (file plugins/*.js trong gói truyện) — KHÔNG sửa engine. Đặc tả: docs/story-engine/PLUGIN.md
//
// Bước mới:
//   { fx: "shake" | "flash shake" | "glitch" … }        hiệu ứng tức thời (nhiều tên cách nhau dấu cách = chạy cùng lúc)
//   { fx: "particles", kind: "embers", ms: 5000 }        hạt bay (embers · sparks · petals · dust · snow · ash · bubbles · confetti · leaves)
//   { mood: "flashback" | "danger" | … | null }          bộ lọc màu GIỮ tới khi đổi (hồi tưởng, nguy hiểm, mơ, lạnh, ấm, đen trắng, ánh đèn đỏ)
//   { cam: "push" | "pull" | "pan-l" | "pan-r" | "tilt" | "sway" | "still" | null, ms } máy quay
//   { pic: "act-…", cap: { en, vi } } · hoặc pic: "act-…" gắn vào { n } / { think } / { say }   ẢNH HÀNH ĐỘNG (khung ảnh nhỏ trên hộp lời)
//   { sfx: "hit" }  · { amb: "rain" | null }             âm thanh 1 lần · đổi âm nền
//   { meet: "<mã>" }  (mech.js)                          nhân vật chính biết mặt / tên người này
(() => {
  const E = globalThis.StoryEngine, esc = E.esc, h = E.h;
  const $ = s => document.querySelector(s);
  const R0 = () => $(".se");

  // ───────── KHO HIỆU ỨNG ─────────
  const FX = {};
  E.effect = (name, fn) => { FX[name] = fn; };
  E.effect.list = FX;
  E.effect.run = (spec, st = {}) => {
    const root = R0(); if (!root || !spec) return;
    for (const n of String(spec).split(/[\s,+]+/).filter(Boolean)) {
      if (G().set.fx === false && !CORE_FX.has(n)) continue; // tắt hiệu ứng (người say xe / máy yếu) — vẫn giữ rung / chớp cốt lõi
      try { FX[n] ? FX[n](root, st) : E.ui.fx(n); } catch (e) { console.error("[story] hiệu ứng", n, e); }
    }
  };
  const G = () => E.G() || { set: {} };
  const CORE_FX = new Set(["shake", "flash", "solve", "objection"]);
  // hiệu ứng = gắn lớp fx-<tên> vào gốc trong ms (CSS ở ui.css, mục HIỆU ỨNG v2)
  const css = (name, ms, extra) => E.effect(name, (root, st) => {
    root.classList.remove("fx-" + name); void root.offsetWidth; root.classList.add("fx-" + name);
    setTimeout(() => root.classList.remove("fx-" + name), st.ms || ms);
    extra?.(root, st);
  });
  css("glitch", 900, () => { E.sfx("glitch"); E.haptic("LIGHT"); });
  css("blur", 1400);
  css("punch", 700, () => E.haptic("MEDIUM"));      // máy quay giật vào
  css("pulse", 1200);                               // viền tối đập như nhịp tim
  css("heartbeat", 2600, () => { E.sfx("beat"); setTimeout(() => E.sfx("beat"), 900); setTimeout(() => E.sfx("beat"), 1800); });
  css("blackout", 1800);                            // tối hẳn rồi sáng lại (thời gian trôi, ngất)
  css("whiteout", 1800);
  css("lightning", 1100, () => { E.sfx("thunder"); E.haptic("HEAVY"); });
  css("redflash", 900, () => E.haptic("HEAVY"));    // bị đánh, đau
  css("shiver", 1600);                              // rùng mình, lạnh
  css("tilt", 1400);                                // nghiêng (choáng)
  css("zoomout", 1400);
  css("ripple", 1600);                              // gợn sóng (ký ức / mơ)
  css("spotlight", 2400);                           // tối xung quanh, sáng giữa
  css("hit", 600, () => { E.sfx("hit"); E.haptic("HEAVY"); });

  // ───────── HẠT BAY (canvas) ─────────
  const KINDS = {
    embers: { n: 46, c: ["#ffb347", "#ff7a3c", "#ffd27f"], r: [1, 2.6], vy: [-0.9, -0.35], vx: [-0.25, 0.25], glow: 1, from: "bottom" },
    sparks: { n: 60, c: ["#fff3b0", "#ffd166"], r: [0.8, 1.8], vy: [-2.4, -0.8], vx: [-1.6, 1.6], glow: 1, from: "bottom", g: 0.03 },
    petals: { n: 30, c: ["#ffc6d9", "#ffb0c8", "#fff0f5"], r: [2.5, 4.5], vy: [0.4, 1], vx: [0.2, 0.9], spin: 1, from: "top" },
    leaves: { n: 26, c: ["#d98b3a", "#b5651d", "#e6b04a"], r: [3, 5], vy: [0.5, 1.1], vx: [0.3, 1.1], spin: 1, from: "top" },
    dust: { n: 50, c: ["#fff7e0"], r: [0.6, 1.4], vy: [-0.15, 0.15], vx: [-0.15, 0.15], a: 0.5, from: "all" },
    snow: { n: 70, c: ["#ffffff"], r: [1, 2.8], vy: [0.5, 1.4], vx: [-0.3, 0.3], from: "top" },
    ash: { n: 50, c: ["#777", "#999", "#555"], r: [1, 2.4], vy: [0.2, 0.7], vx: [-0.4, 0.4], from: "top" },
    bubbles: { n: 26, c: ["#bfe8ff"], r: [2, 6], vy: [-1, -0.4], vx: [-0.2, 0.2], ring: 1, from: "bottom" },
    confetti: { n: 90, c: ["#f2b84b", "#6fcf97", "#7fb2e5", "#ef7a6c", "#a78bfa"], r: [2, 4], vy: [1, 2.6], vx: [-1, 1], spin: 1, from: "top", sq: 1 },
    rain: { n: 120, c: ["#cfe3ff"], r: [0.6, 1], vy: [9, 13], vx: [-1.4, -0.8], streak: 1, from: "top", a: 0.5 },
  };
  E.particles = KINDS; // plugin thêm loại hạt: E.particles.ten = { n, c, r, vy, vx, … }
  let cv = null, raf = 0, parts = [], until = 0;
  const rnd = (a, b) => a + Math.random() * (b - a);
  E.effect("particles", (root, st) => {
    const K = KINDS[st.kind || "embers"]; if (!K || E.auto) return;
    const stage = root.querySelector(".se-stage");
    if (!cv) { cv = document.createElement("canvas"); cv.className = "se-pcv"; stage.appendChild(cv); }
    const W = (cv.width = stage.clientWidth * (devicePixelRatio > 1 ? 1.5 : 1)), H = (cv.height = stage.clientHeight * (devicePixelRatio > 1 ? 1.5 : 1));
    const mk = (init) => ({ x: rnd(0, W), y: K.from === "bottom" ? (init ? rnd(0, H) : H + 10) : K.from === "top" ? (init ? rnd(0, H) : -10) : rnd(0, H),
      r: rnd(...K.r) * (W / 400), vx: rnd(...K.vx), vy: rnd(...K.vy), c: K.c[(Math.random() * K.c.length) | 0], a: K.a ?? rnd(0.5, 1), t: Math.random() * 6, K });
    parts = Array.from({ length: K.n }, () => mk(true));
    until = st.ms === 0 ? Infinity : performance.now() + (st.ms || 5000);
    cv.classList.add("on");
    cancelAnimationFrame(raf);
    const ctx = cv.getContext("2d");
    const tick = now => {
      ctx.clearRect(0, 0, W, H);
      const fading = now > until;
      for (const p of parts) {
        p.t += 0.03; p.x += p.vx + (p.K.spin ? Math.sin(p.t) * 0.6 : 0); p.y += p.vy; if (p.K.g) p.vy += p.K.g;
        if (!fading && (p.y < -20 || p.y > H + 20 || p.x < -20 || p.x > W + 20)) Object.assign(p, mk(false));
        ctx.globalAlpha = p.a * (p.K.glow ? 0.6 + 0.4 * Math.sin(p.t * 3) : 1);
        ctx.fillStyle = ctx.strokeStyle = p.c;
        if (p.K.glow) { ctx.shadowBlur = p.r * 6; ctx.shadowColor = p.c; } else ctx.shadowBlur = 0;
        ctx.beginPath();
        if (p.K.streak) { ctx.lineWidth = p.r; ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 2, p.y - p.vy * 2); ctx.stroke(); }
        else if (p.K.ring) { ctx.lineWidth = 1; ctx.arc(p.x, p.y, p.r, 0, 7); ctx.stroke(); }
        else if (p.K.sq || p.K.spin) { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.t); ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); ctx.restore(); }
        else { ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill(); }
      }
      if (fading) parts = parts.filter(p => p.y > -20 && p.y < H + 20 && p.x > -20 && p.x < W + 20);
      if (parts.length) raf = requestAnimationFrame(tick); else { cv.classList.remove("on"); ctx.clearRect(0, 0, W, H); }
    };
    raf = requestAnimationFrame(tick);
  });
  E.effect("particles-off", () => { until = 0; });

  // ───────── BỘ LỌC MÀU giữ lâu (mood) + MÁY QUAY (cam) ─────────
  const MOODS = ["flashback", "danger", "dream", "cold", "warm", "noir", "red", "night", "memory", "sick"];
  E.moods = MOODS;
  E.ui.mood = (m, ns) => { const r = R0(); if (!r) return; if (m) r.dataset.mood = m; else delete r.dataset.mood; const RR = E.R(); if (RR && !ns) RR.mood = m || null; };
  E.ui.cam = (k, ms, ns) => {
    const w = $(".se-bgw"); if (!w) return;
    w.dataset.cam = k || "";
    if (ms) w.style.setProperty("--cam-ms", ms + "ms"); else w.style.removeProperty("--cam-ms");
    const RR = E.R(); if (RR && !ns) RR.cam = k || null;
  };

  // ───────── ẢNH HÀNH ĐỘNG (khung ảnh nhỏ) ─────────
  // ảnh: img/<tên>.jpg → class im-<tên> (art-css.js). Chưa có ảnh → không hiện gì (vẽ sau tự dùng).
  let picName = "";
  E.ui.pic = (name, cap, ns) => {
    const root = R0(); if (!root) return;
    if (name === picName && !cap) return;
    const old = root.querySelector(".se-pic:not(.out)");
    if (old) { old.classList.add("out"); setTimeout(() => old.remove(), 450); }
    picName = name || "";
    const RR = E.R(); if (RR && !ns) RR.pic = picName || null;
    if (!name || !E.hasArt("im-" + name)) return;
    const el = h(`<div class="se-pic"><b class="fr"><i class="im-${esc(name)}"></i></b>${cap ? `<span>${esc(E.nat(cap))}</span>` : ""}</div>`);
    root.querySelector(".se-stage").appendChild(el);
    E.sfx("page");
  };

  // ───────── THẺ “NHÂN VẬT MỚI” (lần đầu gặp — hồ sơ mở ra) ─────────
  E.ui.meetCard = (id, first) => {
    const root = R0(); if (!root || E.auto) return;
    const S = E.S(), c = S.chars[id];
    const box = root.querySelector(".se-mem"); if (!box) return;
    const el = h(`<div class="se-meet" style="--c:${c.color || "#aaa"}"><span class="se-meeti"><i class="im-${id}"></i></span><span><small>${esc(E.nat(first ? { en: "NEW CHARACTER", vi: "NHÂN VẬT MỚI" } : { en: "MET", vi: "ĐÃ GẶP" }))}</small><b>${esc(E.cnameReal(c))}</b>${c.role ? `<em>${esc(E.nat(c.role))}</em>` : ""}</span></div>`);
    box.appendChild(el);
    E.sfx("up");
    setTimeout(() => el.classList.add("out"), 3600);
    setTimeout(() => el.remove(), 4100);
  };

  // ───────── ÂM THANH THÊM (tự tổng hợp, không file) ─────────
  Object.assign(E.SFX, {
    glitch: () => { for (let i = 0; i < 5; i++) E.sound.tone(200 + Math.random() * 1600, i * 0.05, 0.04, "square", 0.03); },
    thunder: () => { E.sound.burst(2.2, 90, 40, 0.5); E.sound.tone(45, 0, 1.6, "sine", 0.3, 30); },
    door: () => { E.sound.tone(180, 0, 0.25, "sawtooth", 0.05, 90); E.sound.burst(0.2, 600, 200, 0.25); },
    knock: () => [0, 0.22, 0.44].forEach(t => E.sound.burst(0.08, 900, 300, 0.4 + t * 0 )),
    steps: () => [0, 0.45, 0.9, 1.35].forEach(t => setTimeout(() => E.sound.burst(0.09, 500, 160, 0.3), t * 1000)),
    phone: () => [0, 0.5].forEach(t => { E.sound.tone(1350, t, 0.18, "sine", 0.06); E.sound.tone(1650, t + 0.02, 0.18, "sine", 0.05); }),
    buzz: () => E.sound.tone(130, 0, 0.6, "sawtooth", 0.04),
    splash: () => { E.sound.burst(0.9, 1800, 200, 0.45); },
    glass: () => [2800, 3600, 4400].forEach((f, i) => E.sound.tone(f, i * 0.03, 0.5, "triangle", 0.04)),
    clock: () => [0, 0.5, 1, 1.5].forEach(t => E.sound.tone(2200, t, 0.03, "square", 0.04)),
    heart: () => { E.sfx("beat"); },
    wind: () => E.sound.burst(3, 300, 900, 0.18),
    bell: () => [523, 1046, 1568].forEach((f, i) => E.sound.tone(f, 0, 2.4 - i * 0.6, "sine", 0.07)),
    sting: () => { E.sound.tone(110, 0, 1.4, "sawtooth", 0.08, 55); E.sound.tone(660, 0, 0.6, "triangle", 0.05, 330); },
  });

  // ───────── PLUGIN ─────────
  // StoryEngine.plugin({ id, css: "…", mechs: { tên: async ctx => … }, effects: { tên: (root, st) => … }, sfx: { tên: () => … },
  //   particles: { tên: {…} }, on: { line: fn, … }, setup: E => … })
  const PLUGINS = {};
  E.plugin = p => {
    if (!p?.id || PLUGINS[p.id]) return;
    PLUGINS[p.id] = p;
    if (p.css) { const s = document.createElement("style"); s.dataset.plugin = p.id; s.textContent = p.css; document.head.appendChild(s); }
    for (const k in p.mechs || {}) E.def(k, p.mechs[k]);
    for (const k in p.effects || {}) E.effect(k, p.effects[k]);
    Object.assign(E.SFX, p.sfx || {});
    Object.assign(KINDS, p.particles || {});
    for (const k in p.on || {}) E.on(k, p.on[k]);
    try { p.setup?.(E); } catch (e) { console.error("[story] plugin", p.id, e); }
  };
  E.plugins = PLUGINS;

  // ───────── BƯỚC ─────────
  const def = E.def;
  def("mood", async ({ st }) => E.ui.mood(st.mood));
  def("cam", async ({ st }) => E.ui.cam(st.cam, st.ms));
  def("pic", async ({ st }) => {
    E.ui.pic(st.pic, st.cap);
    // có chú thích → chờ chạm (như 1 lời dẫn ngắn); không → chỉ hiện ảnh, bước sau tiếp ngay
    if (st.cap) { const t = E.narr(st.cap); await E.ui.line({ kind: "n", ...t, pic: st.pic }); }
  });
  def("sfx", async ({ st }) => E.sfx(st.sfx));
  def("amb", async ({ st }) => E.amb(st.amb || ""));

  // khôi phục khi chơi tiếp / chơi lại từ mốc: bộ lọc + máy quay + ảnh đang hiện
  const restore0 = E.ui.restore;
  E.ui.restore = () => { restore0(); const RR = E.R(); E.ui.mood(RR.mood); E.ui.cam(RR.cam); picName = ""; if (RR.pic) E.ui.pic(RR.pic); };
  const reset0 = E.ui.reset;
  E.ui.reset = () => { reset0(); E.ui.pic(null, null, 1); E.ui.mood(null, 1); E.ui.cam(null, 0, 1); until = 0; };
})();
