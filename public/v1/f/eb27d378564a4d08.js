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

  // Each gesture owns one pointer. Cancellation is a reset, never a successful drop.
  const capture = (el, id) => { try { el.setPointerCapture(id); } catch {} };
  E.gesture("swipe", {
    html: A => `<div class="ga-sw d-${A.dir || "r"}"><i>${ARROW[A.dir || "r"]}</i><b></b></div>`,
    bind(el, A, api) {
      let s = null;
      const L = $(".se-act"), cancel = () => { s = null; el.classList.remove("on"); };
      L.onpointerdown = e => { if (!api.live() || s || e.button > 0 || !inside(e, el, api.pad)) return; s = [e.clientX, e.clientY, e.pointerId]; capture(L, e.pointerId); el.classList.add("on"); };
      L.onpointerup = e => {
        if (!s || e.pointerId !== s[2]) return; const dx = e.clientX - s[0], dy = e.clientY - s[1]; cancel();
        const d = A.dir || "r", ok = d === "r" ? dx > 50 && Math.abs(dx) > Math.abs(dy) : d === "l" ? dx < -50 && Math.abs(dx) > Math.abs(dy) : d === "u" ? dy < -50 && Math.abs(dy) > Math.abs(dx) : dy > 50 && Math.abs(dy) > Math.abs(dx);
        ok ? api.ok() : api.miss();
      };
      L.onpointercancel = e => { if (s && e.pointerId === s[2]) cancel(); };
      return cancel;
    },
  });
  E.gesture("drag", {
    html: (A, box) => `<div class="ga-dg">${A.art ? `<i class="ii im-${esc(A.art)}"></i>` : '<i class="ga-dot"></i>'}</div>${A.to ? `<div class="ga-to" style="${E.pctStyle(box.to)}"></div>` : ""}`,
    bind(el, A, api) {
      const dg = el.querySelector(".ga-dg"), to = $(".se-act .ga-to");
      let s = null, reset = 0;
      const cancel = () => { s = null; clearTimeout(reset); dg.classList.remove("on"); to?.classList.remove("on"); dg.style.transform = ""; dg.style.transition = ""; };
      dg.onpointerdown = e => { if (!api.live() || s || e.button > 0) return; s = [e.clientX, e.clientY, e.pointerId]; capture(dg, e.pointerId); dg.classList.add("on"); to?.classList.add("on"); E.haptic("LIGHT"); };
      dg.onpointermove = e => { if (s && e.pointerId === s[2]) dg.style.transform = `translate(${e.clientX - s[0]}px,${e.clientY - s[1]}px)`; };
      dg.onpointerup = e => {
        if (!s || e.pointerId !== s[2]) return; s = null; dg.classList.remove("on"); to?.classList.remove("on");
        if (to && inside(e, to, api.pad)) { dg.style.transition = "opacity .25s"; dg.style.opacity = 0; return api.ok(); }
        dg.style.transition = "transform .3s cubic-bezier(.2,1.4,.4,1)"; dg.style.transform = ""; reset = setTimeout(() => (dg.style.transition = ""), 320); api.miss();
      };
      dg.onpointercancel = e => { if (s && e.pointerId === s[2]) cancel(); };
      return cancel;
    },
  });
  E.gesture("hold", {
    html: () => `<div class="ga-hd"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="17"/><circle class="p" cx="20" cy="20" r="17"/></svg></div>`,
    bind(el, A, api) {
      const need = A.hold || 1600; let t0 = 0, raf = 0, pointer = null;
      const p = el.querySelector(".p"), L = $(".se-act");
      const cancel = () => { pointer = null; t0 = 0; cancelAnimationFrame(raf); el.classList.remove("on"); p.style.strokeDashoffset = 107; };
      const tick = () => { if (!api.live() || pointer == null) return cancel(); const k = Math.min(1, (performance.now() - t0) / need); p.style.strokeDashoffset = 107 * (1 - k); if (k >= 1) { pointer = null; t0 = 0; return api.ok(); } raf = requestAnimationFrame(tick); };
      L.onpointerdown = e => { if (!api.live() || pointer != null || e.button > 0 || !inside(e, el, api.pad)) return; pointer = e.pointerId; capture(L, pointer); t0 = performance.now(); el.classList.add("on"); E.haptic("LIGHT"); raf = requestAnimationFrame(tick); };
      L.onpointerup = e => { if (pointer !== e.pointerId) return; cancel(); api.miss(); };
      L.onpointercancel = e => { if (pointer === e.pointerId) cancel(); };
      return cancel;
    },
  });
  E.gesture("tap", {
    html: () => `<div class="ga-tp"><i></i></div>`,
    bind(el, A, api) { $(".se-act").onpointerdown = e => { if (e.button <= 0 && api.live()) inside(e, el, api.pad) ? api.ok() : api.miss(); }; },
  });
  E.gesture("mash", {
    html: A => `<div class="ga-ms"><i></i><b>${A.n || 10}</b></div>`,
    bind(el, A, api) {
      let n = A.n || 10; const b = el.querySelector("b");
      $(".se-act").onpointerdown = e => { if (!api.live() || e.button > 0 || !inside(e, el, api.pad + 30)) return; n--; b.textContent = Math.max(0, n); el.classList.remove("hit"); void el.offsetWidth; el.classList.add("hit"); E.sfx("hit"); E.haptic("LIGHT"); if (n <= 0) api.ok(); };
    },
  });
  E.gesture("torch", {
    html: () => ``,
    bind(el, A, api) {
      const L = $(".se-act"), dark = h(`<div class="ga-dark"></div>`); L.appendChild(dark);
      let t = 0, pointer = null;
      const cancel = () => { pointer = null; dark.classList.remove("on"); clearTimeout(t); t = 0; };
      const move = e => {
        if (!api.live() || e.pointerId !== pointer) return;
        const st = $(".se-stage").getBoundingClientRect();
        dark.style.setProperty("--tx", e.clientX - st.left + "px"); dark.style.setProperty("--ty", e.clientY - st.top + "px");
        if (inside(e, el, api.pad)) { if (!t) t = setTimeout(() => { t = 0; if (pointer != null && api.live()) api.ok(); }, A.hold || 600); } else { clearTimeout(t); t = 0; }
      };
      L.onpointerdown = e => { if (!api.live() || pointer != null || e.button > 0) return; pointer = e.pointerId; capture(L, pointer); dark.classList.add("on"); move(e); };
      L.onpointermove = move;
      L.onpointerup = L.onpointercancel = e => { if (e.pointerId === pointer) cancel(); };
      return cancel;
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
    let over = false, tm = 0, resultTm = 0, misses = 0, unbind = null;
    const live = () => c.live?.() !== false;
    const cleanup = () => { clearTimeout(tm); clearTimeout(resultTm); unbind?.(); unbind = null; L.onpointerdown = L.onpointermove = L.onpointerup = L.onpointercancel = null; L.remove(); };
    c.onCancel?.(() => { over = true; cleanup(); res(); });
    const end = ok => {
      if (over || !live()) return; over = true; clearTimeout(tm); unbind?.(); unbind = null;
      L.classList.add(ok ? "won" : "lost");
      if (ok) { E.sfx(A.sfx || "solve"); E.haptic("MEDIUM"); } else { E.sfx("wrong"); E.haptic("HEAVY"); E.ui.fx("shake"); }
      resultTm = setTimeout(() => { cleanup(); if (!live()) return res(); E.ui.urgent(false); if (ok && A.ok) c.push("act", "ok"); if (!ok && A.fail) c.push("act", "fail"); if (A.set) E.flag(A.set, ok); res(); }, E.auto ? 1 : 420);
    };
    const api = { ok: () => end(true), miss: () => { if (over || !live()) return; misses++; if (A.tries && misses >= A.tries) end(false); }, pad: easy ? 40 : 14, live: () => !over && live() && L.isConnected };
    unbind = impl.bind(el, A, api);
    // Existing custom gestures may return nothing; returning a cleanup function is optional.
    if (typeof unbind !== "function") unbind = null;
    if (A.ms && !easy) { E.ui.urgent(true); tm = setTimeout(() => end(false), A.ms); }
    E.autoRun(() => end(E.auto === "r" ? Math.random() < .6 : true));
  }));

  // ═════════ CHUỖI KHUNG HÀNH ĐỘNG ═════════
  def("beat", c => new Promise(async res => {
    const B = c.st.beat;
    E.ui.hideBox();
    const cap = h(`<div class="se-beat"><b></b></div>`), host = $(".se-stage");
    host.appendChild(cap);
    let skip = null, timer = 0, stopped = false;
    const onTap = e => { if (!e.target.closest("button, input, a")) skip?.(); };
    const cleanup = () => { stopped = true; clearTimeout(timer); host.removeEventListener("pointerdown", onTap); cap.remove(); skip?.(); skip = null; };
    c.onCancel?.(() => { cleanup(); res(); });
    host.addEventListener("pointerdown", onTap);
    for (const f of B) {
      if (stopped || c.live?.() === false) break;
      if (f.bg) E.ui.scene(f.bg);
      if (f.shot !== undefined) E.ui.shot(f.shot, { tr: f.tr || "cut" });
      if (f.look !== undefined) E.ui.look(f.look, f.lookMs || 500);
      if (f.cam !== undefined) E.ui.cam(f.cam, f.camMs);
      if (f.prop) E.mech.prop({ st: { prop: f.prop } });
      if (f.fx) E.effect.run(f.fx, f);
      if (f.sfx) E.sfx(f.sfx);
      const t = f.t ? E.narr(f.t) : null, b = cap.querySelector("b");
      b.textContent = t ? t.main : ""; cap.classList.toggle("on", !!t);
      cap.classList.remove("in"); void cap.offsetWidth; cap.classList.add("in");
      await new Promise(r => { let settled = false; skip = () => { if (settled) return; settled = true; clearTimeout(timer); r(); }; timer = setTimeout(skip, E.auto ? 1 : f.ms || (t ? 1600 + t.main.length * 28 : 700)); });
    }
    cleanup(); res();
  }));
})();
