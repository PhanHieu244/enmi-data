// Enmi Story Engine 3 — CẢNH HÀNH ĐỘNG (nạp sau place.js). Cử chỉ KHỚP với hình: đặt theo vùng của ảnh đang hiện.
//
// { act: { kind, r, prompt, ms, ok: [bước], fail: [bước], … } }
//   swipe  vuốt theo hướng dir: "l" | "r" | "u" | "d" bắt đầu trong vùng r (né, giật cửa, kéo người lên)
//   drag   kéo vật (art: ảnh PNG, hoặc tên vùng) từ r tới vùng to (giật chai khỏi tay, đặt cọc vào lỗ)
//   hold   giữ ngón tay trong r đủ hold ms (nín thở, giữ chặt mép thuyền) — nhấc sớm = làm lại
//   tap    chạm vào r trước khi hết giờ (chạm đúng lúc: kèm prop chạy qua vùng)
//   mash   chạm liên tục n lần (đạp cửa, bơi lên)
//   torch  màn tối, ngón tay là đèn pin — soi tới vùng find và giữ ~0,6 giây
//   ms: thời hạn (0 / không ghi = không giới hạn). Cài đặt “Hành động dễ” (G.set.easyAct) bỏ thời hạn + nới vùng.
//   Thất bại không phải màn thua: fail chạy bước rẽ nhánh (bị thương, mất đồ…), rồi truyện đi tiếp.
//
// { beat: [{ shot | bg, t: { en, vi }, ms, fx, sfx, look, prop, cam }, …] }   chuỗi khung hành động (truyện tranh động):
//   từng khung cắt nhanh, chữ to giữa màn, tự chạy theo ms (chạm = sang khung sau). Khung = ảnh riêng hoặc máy quay / đạo cụ trên cùng 1 ảnh.
//
// E.gesture(tên, { html(A, box), bind(el, A, api) }) — thêm kiểu cử chỉ mới.
(() => {
  const E = globalThis.StoryEngine, def = E.def, esc = E.esc, h = E.h;
  const nat = t => E.nat(t), T = (en, vi) => nat({ en, vi });
  const $ = (s, r = document) => r.querySelector(s);
  const GS = {};
  E.gesture = (k, impl) => { GS[k] = impl; };
  E.gestures = GS;
  const ARROW = { l: "←", r: "→", u: "↑", d: "↓" };
  const inside = (e, el, pad = 0) => { const b = el.getBoundingClientRect(); return e.clientX >= b.left - pad && e.clientX <= b.right + pad && e.clientY >= b.top - pad && e.clientY <= b.bottom + pad; };

  E.gesture("swipe", {
    html: A => `<div class="ga-sw d-${A.dir || "r"}"><i>${ARROW[A.dir || "r"]}</i><b></b></div>`,
    bind(el, A, api) {
      let s = null;
      const L = $(".se-act");
      L.onpointerdown = e => { if (inside(e, el, api.pad)) { s = [e.clientX, e.clientY]; el.classList.add("on"); } };
      L.onpointerup = e => {
        if (!s) return; const dx = e.clientX - s[0], dy = e.clientY - s[1]; s = null; el.classList.remove("on");
        const d = A.dir || "r", ok = d === "r" ? dx > 50 && Math.abs(dx) > Math.abs(dy) : d === "l" ? dx < -50 && Math.abs(dx) > Math.abs(dy) : d === "u" ? dy < -50 && Math.abs(dy) > Math.abs(dx) : dy > 50 && Math.abs(dy) > Math.abs(dx);
        ok ? api.ok() : api.miss();
      };
    },
  });
  E.gesture("drag", {
    html: (A, box) => `<div class="ga-dg">${A.art ? `<i class="ii im-${esc(A.art)}"></i>` : "<i class=\"ga-dot\"></i>"}</div>${A.to ? `<div class="ga-to" style="${E.pctStyle(box.to)}"></div>` : ""}`,
    bind(el, A, api) {
      const dg = el.querySelector(".ga-dg"), to = $(".se-act .ga-to");
      let s = null;
      dg.onpointerdown = e => { s = [e.clientX, e.clientY]; dg.setPointerCapture(e.pointerId); dg.classList.add("on"); to?.classList.add("on"); E.haptic("LIGHT"); };
      dg.onpointermove = e => { if (s) dg.style.transform = `translate(${e.clientX - s[0]}px,${e.clientY - s[1]}px)`; };
      dg.onpointerup = e => {
        if (!s) return; s = null; dg.classList.remove("on"); to?.classList.remove("on");
        if (to && inside(e, to, api.pad)) { dg.style.transition = "opacity .25s"; dg.style.opacity = 0; return api.ok(); }
        dg.style.transition = "transform .3s cubic-bezier(.2,1.4,.4,1)"; dg.style.transform = ""; setTimeout(() => (dg.style.transition = ""), 320); api.miss();
      };
    },
  });
  E.gesture("hold", {
    html: () => `<div class="ga-hd"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="17"/><circle class="p" cx="20" cy="20" r="17"/></svg></div>`,
    bind(el, A, api) {
      const need = A.hold || 1600; let t0 = 0, raf = 0;
      const p = el.querySelector(".p"), L = $(".se-act");
      const tick = () => { const k = Math.min(1, (performance.now() - t0) / need); p.style.strokeDashoffset = 107 * (1 - k); if (k >= 1) { t0 = 0; return api.ok(); } raf = requestAnimationFrame(tick); };
      L.onpointerdown = e => { if (!inside(e, el, api.pad)) return; t0 = performance.now(); el.classList.add("on"); E.haptic("LIGHT"); raf = requestAnimationFrame(tick); };
      L.onpointerup = L.onpointercancel = () => { if (!t0) return; t0 = 0; cancelAnimationFrame(raf); el.classList.remove("on"); p.style.strokeDashoffset = 107; api.miss(); };
    },
  });
  E.gesture("tap", {
    html: () => `<div class="ga-tp"><i></i></div>`,
    bind(el, A, api) { $(".se-act").onpointerdown = e => (inside(e, el, api.pad) ? api.ok() : api.miss()); },
  });
  E.gesture("mash", {
    html: A => `<div class="ga-ms"><i></i><b>${A.n || 10}</b></div>`,
    bind(el, A, api) {
      let n = A.n || 10; const b = el.querySelector("b");
      $(".se-act").onpointerdown = e => { if (!inside(e, el, api.pad + 30)) return; n--; b.textContent = Math.max(0, n); el.classList.remove("hit"); void el.offsetWidth; el.classList.add("hit"); E.sfx("hit"); E.haptic("LIGHT"); if (n <= 0) api.ok(); };
    },
  });
  E.gesture("torch", {
    html: () => ``,
    bind(el, A, api) {
      const L = $(".se-act"), dark = h(`<div class="ga-dark"></div>`); L.appendChild(dark);
      const st = $(".se-stage").getBoundingClientRect();
      let t = 0;
      const move = e => {
        dark.style.setProperty("--tx", e.clientX - st.left + "px"); dark.style.setProperty("--ty", e.clientY - st.top + "px");
        if (inside(e, el, api.pad)) { if (!t) t = setTimeout(api.ok, 600); } else { clearTimeout(t); t = 0; }
      };
      L.onpointerdown = e => { dark.classList.add("on"); move(e); };
      L.onpointermove = move;
      L.onpointerup = () => { dark.classList.remove("on"); clearTimeout(t); t = 0; };
    },
  });

  def("act", c => new Promise(res => {
    const A = c.st.act, G = E.G(), img = E.curImg();
    const easy = !!G.set.easyAct;
    const reg = n => E.regionOf(img, n)?.box || [30, 40, 40, 30];
    const box = reg(A.r || A.find), to = A.to ? reg(A.to) : null;
    const impl = GS[A.kind || "tap"]; if (!impl) { console.warn("[story] act lạ", A.kind); return res(); }
    E.ui.hideBox(); E.ui.clear();
    const old = $(".se-act"); old?.remove();
    const L = h(`<div class="se-act k-${esc(A.kind || "tap")}">${E.vbox(img, `<div class="ga" style="${E.pctStyle(box)}">${impl.html(A, { to })}</div>`)}
      <div class="ga-p">${A.prompt ? `<b>${esc(nat(A.prompt))}</b>` : ""}${A.ms && !easy ? `<i class="ga-t"><u style="animation-duration:${A.ms}ms"></u></i>` : ""}</div></div>`);
    $(".se-stage").appendChild(L);
    const el = L.querySelector(".ga");
    let over = false, tm = 0, misses = 0;
    const end = ok => {
      if (over) return; over = true; clearTimeout(tm);
      L.classList.add(ok ? "won" : "lost");
      if (ok) { E.sfx(A.sfx || "solve"); E.haptic("MEDIUM"); } else { E.sfx("wrong"); E.haptic("HEAVY"); E.ui.fx("shake"); }
      setTimeout(() => { L.remove(); E.ui.urgent(false); if (ok && A.ok) c.push("act", "ok"); if (!ok && A.fail) c.push("act", "fail"); if (A.set) E.flag(A.set, ok); res(); }, E.auto ? 1 : 420);
    };
    const api = { ok: () => end(true), miss: () => { misses++; if (A.tries && misses >= A.tries) end(false); }, pad: easy ? 40 : 14 };
    impl.bind(el, A, api);
    if (A.ms && !easy) { E.ui.urgent(true); tm = setTimeout(() => end(false), A.ms); }
    E.autoRun(() => end(E.auto === "r" ? Math.random() < .6 : true));
  }));

  // ═════════ CHUỖI KHUNG HÀNH ĐỘNG ═════════
  def("beat", c => new Promise(async res => {
    const B = c.st.beat, R = E.R();
    E.ui.hideBox();
    const cap = h(`<div class="se-beat"><b></b></div>`);
    $(".se-stage").appendChild(cap);
    let skip = null;
    const onTap = () => skip?.();
    cap.parentElement.addEventListener("pointerdown", onTap);
    for (const f of B) {
      if (f.bg) E.ui.scene(f.bg);
      if (f.shot !== undefined) E.ui.shot(f.shot, { tr: f.tr || "cut" });
      if (f.look !== undefined) E.ui.look(f.look, f.lookMs || 500);
      if (f.cam !== undefined) E.ui.cam(f.cam, f.camMs);
      if (f.prop) E.mech.prop({ st: { prop: f.prop } });
      if (f.fx) E.effect.run(f.fx, f);
      if (f.sfx) E.sfx(f.sfx);
      const t = f.t ? E.narr(f.t) : null;
      const b = cap.querySelector("b");
      b.textContent = t ? t.main : ""; cap.classList.toggle("on", !!t);
      cap.classList.remove("in"); void cap.offsetWidth; cap.classList.add("in");
      await new Promise(r => { skip = r; setTimeout(r, E.auto ? 1 : f.ms || (t ? 1600 + t.main.length * 28 : 700)); });
    }
    cap.parentElement?.removeEventListener("pointerdown", onTap);
    cap.remove();
    res();
  }));
})();
