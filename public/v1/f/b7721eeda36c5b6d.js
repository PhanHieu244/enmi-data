// Enmi Story Engine 3 — ĐỊA ĐIỂM kiểu Rusty Lake + HỎI CHUYỆN tự chọn + ĐỒNG HỒ (nạp sau stage.js).
//
// { place: { id, name, goal, start, ring: [view…], views: { <view>: VIEW }, need, until, done, leave, by, late } }   hoặc { place: "<mã>" } → story.places.<mã>
//   VIEW  = { img: "<ảnh>" | s => "<ảnh>", up: "<view cha>" (= cận cảnh, có nút ▼), regions: { <vùng>: [x, y, w, h] }, zones: [ZONE], people: [PERSON], amb,
//             left / right: "<view>" | { to, need, if, cost } = chỗ lân cận bấm ◀ ▶ (quầy bar → sân sau → bốt điện thoại; null = không đi được) — không ghi = theo vòng ring,
//             name + loc: true = đổi tới view này thì viên trạng thái hiện tên chỗ mới,
//             fg: true | "<ảnh>" = lớp TIỀN CẢNH trong suốt (<ảnh>-fg) đè lên người / đồ (quầy che trước người đứng sau), fgZ }
//   P.spatial = { title? } opts into an explicit spatial graph: no implicit ring.
//   VIEW.space identifies one physical area; left/right may turn only within it.
//   VIEW.up = string | {to, kind, label, if, need, cost}; upKind/upLabel are aliases.
//   VIEW.routes = [{id,to,label,kind,if,need,cost}] for an entrance outside the image.
//   ZONE.kind / route.kind = enter | exit | walk | back | detail. Only explicit
//   detail navigation zooms. VIEW.map = {x:1..3,y:1..N} places a read-only map node.
//   THỨ TỰ LỚP (trước / sau): nền 0 · vùng + đồ vật ghép z 2 · người z 3 · tiền cảnh fgZ 5 — ghi z riêng cho từng vùng / người khi cần (đồ trên quầy trước người: z 4)
//   ZONE  = { id, r: "<vùng>" | [x, y, w, h], shape: "ellipse", label, hint,
//             to: "<view>"              chạm = sang view đó (cận cảnh: phóng vào từ chỗ chạm)
//             take: "<đồ>"              nhặt đồ (vật bay ra từ chỗ nó nằm) — vùng biến mất sau khi nhặt
//             then / again              bước khi chạm (máy quay tự nhìn vào vùng, trừ look: false) · clue: true = manh mối (đếm)
//             use: { <đồ>: [bước] }, stuck: [bước]   dùng đồ lên vùng · chạm khi chưa có đồ
//             need: điều kiện (chưa đủ → stuck) · if / hide: hiện / ẩn theo điều kiện · once: chạm 1 lần rồi thôi
//             widget: { type: "wipe" | "dial" | "switch", …, ok: [bước] }   câu đố ngay trên cảnh
//             art: "<ảnh PNG>"          ĐỒ VẬT GHÉP lên ảnh đúng khung vùng (take tự dùng it-<đồ> nếu có) → vật và chỗ chạm luôn trùng, dù nền AI vẽ lệch
//           z: thứ tự lớp · exit: true chạm = rời địa điểm (khi đủ manh mối) · cost: phút (đồng hồ) · glint: false = không loé }
//   PERSON = { who, r: [x, y, w, h] (khung đứng, chân chạm đáy khung), pose (ảnh toàn thân <mã>-full-<pose>), face, talk: TALK | "<mã talks>", if, z }
//            Người đứng TRONG cảnh dùng ảnh TOÀN THÂN (art.json chars.<mã>.full) — thiếu thì tạm dùng ảnh nửa người.
//   need: số manh mối tối thiểu | [mã vùng…] · until: điều kiện → tự rời khi đúng · leave: false = không cho rời trước khi đủ
//   by: "03:05" + late: [bước] → đồng hồ chạy qua giờ đó (do cost của vùng / câu hỏi) thì địa điểm đóng lại, chạy late
// Trạng thái địa điểm giữ suốt lần chơi (R.pl[id]) → quay lại vẫn ở đúng view, vật đã nhặt không còn.
//
// { talk: { with, face, hello: [bước] (lần đầu), topics: [{ id, label, need, if, once (mặc định true), then, cost, end, new }],
//           show: { <đồ>: [bước], "*": [bước] }, bye: [bước], prompt } }  hoặc { talk: "<mã>" } → story.talks.<mã>
//   Hỏi tự chọn kiểu Rusty Lake / Ace Attorney: chủ đề mở dần theo manh mối; đưa đồ cho xem; Rời đi.
//
// E.widget(tên, { html(z, st), bind(el, z, st, api) }) — thêm câu đố trên cảnh (api.ok() khi giải xong, api.redraw()).
(() => {
  const E = globalThis.StoryEngine, def = E.def, esc = E.esc, h = E.h;
  const nat = t => E.nat(t), T = (en, vi) => nat({ en, vi });
  // Optional game renderer for substantive investigative text. Chrome stays native.
  const investigationText = t => E.ui.investigationText?.(t) ?? esc(nat(t));
  const inspectLook = (...args) => (E.ui.inspectionLook || E.ui.look)(...args);
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const cond = (c, s) => E.cond(c, s);
  const later = (f, ms = 5) => setTimeout(f, ms);

  // ═════════ ĐỒNG HỒ (phút tuyệt đối, không vòng qua nửa đêm) ═════════
  const toM = t => { const m = /^(\d{1,2}):(\d{2})/.exec(t || ""); return m ? +m[1] * 60 + +m[2] : null; };
  const fmt = m => { m = ((m % 1440) + 1440) % 1440; return String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0"); };
  E.time = {
    now: () => { const R = E.R(); if (R.clockM == null && R.clock?.t) R.clockM = toM(R.clock.t); return R.clockM; },
    add: (min, warnBy) => {
      const R = E.R(); if (!min || !R.clock) return;
      R.clockM = (E.time.now() ?? 0) + min;
      E.mech.clock({ st: { clock: fmt(R.clockM), warn: warnBy != null && warnBy - R.clockM <= 15 } });
    },
    abs: t => { const R = E.R(), now = E.time.now() ?? 0, m = toM(t); let a = now - (now % 1440) + m; if (a < now) a += 1440; return a; },
  };
  // { clock } đặt lại giờ → mốc tuyệt đối theo giờ mới
  E.on("step", type => { if (type === "clock") setTimeout(() => { const R = E.R(); R.clockM = R.clock ? toM(R.clock.t) : null; }, 0); });

  // ═════════ CÂU ĐỐ TRÊN CẢNH ═════════
  const WG = {};
  E.widget = (k, impl) => { WG[k] = impl; };
  E.widgets = WG;
  // LAU / CÀO (làm lại 30/10 — người dùng: “khó cào, hiệu ứng chưa đẹp”):
  //   · lớp phủ đọng hơi nước (mờ, hạt nước, sáng viền) hoặc bụi / sơn cào (w.look: "fog" | "dust" | "scratch")
  //   · cọ MỀM to (≥ 26 px, 22 % cạnh ngắn) nối liền giữa các điểm chạm (không lỗ chỗ khi miết nhanh) · vùng nhận miết rộng hơn khung 24 px
  //   · ~42 % sạch là đủ → phần còn lại tan dần + vệt sáng lướt qua + tiếng “xong” · chưa chạm 2 giây → bàn tay gợi ý miết qua lại
  E.widget("wipe", {
    html: (z, w) => `<canvas class="wg-wipe"></canvas><i class="wg-hand">${E.ICON.hand || ""}</i><b class="wg-tip">${esc(nat(w.tip || { en: "Rub to clear", vi: "Miết để lau" }))}</b>`,
    bind(el, z, w, api) {
      const cv = el.querySelector("canvas"), host = el.closest(".pz") || el;
      const W0 = Math.max(60, el.offsetWidth), H0 = Math.max(40, el.offsetHeight), dpr = Math.min(2, devicePixelRatio || 1);
      cv.width = W0 * dpr; cv.height = H0 * dpr;
      const x = cv.getContext("2d"); x.scale(dpr, dpr);
      const look = w.look || "fog";
      // lớp phủ
      const g = x.createLinearGradient(0, 0, W0, H0);
      if (look === "fog") { g.addColorStop(0, "rgba(214,226,232,.93)"); g.addColorStop(1, "rgba(176,192,202,.9)"); }
      else if (look === "dust") { g.addColorStop(0, "rgba(150,132,104,.95)"); g.addColorStop(1, "rgba(112,98,78,.95)"); }
      else { g.addColorStop(0, "rgba(196,196,200,.98)"); g.addColorStop(1, "rgba(150,150,158,.98)"); }
      x.fillStyle = g; x.fillRect(0, 0, W0, H0);
      for (let i = 0; i < (W0 * H0) / 90; i++) { // hạt nước / hạt bụi
        const r = Math.random() * (look === "fog" ? 2.6 : 1.4) + .4, px = Math.random() * W0, py = Math.random() * H0;
        x.fillStyle = look === "fog" ? `rgba(255,255,255,${.25 + Math.random() * .35})` : `rgba(0,0,0,${Math.random() * .18})`;
        x.beginPath(); x.arc(px, py, r, 0, 7); x.fill();
        if (look === "fog" && r > 2) { x.fillStyle = "rgba(90,110,125,.25)"; x.beginPath(); x.arc(px + .6, py + .8, r * .6, 0, 7); x.fill(); }
      }
      x.globalCompositeOperation = "destination-out";
      const R = Math.max(26, Math.min(W0, H0) * .22);
      const dab = (px, py) => { const rg = x.createRadialGradient(px, py, 0, px, py, R); rg.addColorStop(0, "rgba(0,0,0,1)"); rg.addColorStop(.6, "rgba(0,0,0,.85)"); rg.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = rg; x.beginPath(); x.arc(px, py, R, 0, 7); x.fill(); };
      let last = null, done = false, n = 0, idle = 0;
      const pos = e => { const b = cv.getBoundingClientRect(); return [(e.clientX - b.left) * W0 / b.width, (e.clientY - b.top) * H0 / b.height]; };
      const stroke = e => {
        const [px, py] = pos(e);
        if (last) { const d = Math.hypot(px - last[0], py - last[1]), st = Math.max(1, Math.ceil(d / (R * .35))); for (let i = 1; i <= st; i++) dab(last[0] + (px - last[0]) * i / st, last[1] + (py - last[1]) * i / st); }
        else dab(px, py);
        last = [px, py];
        if (++n % 4 === 0) { check(); if (n % 12 === 0) E.haptic("LIGHT"); }
      };
      const check = () => {
        if (done) return;
        const d = x.getImageData(0, 0, cv.width, cv.height).data; let c = 0, t = 0;
        for (let i = 3; i < d.length; i += 4 * 9) { t++; if (d[i] < 60) c++; }
        const k = c / t; host.style.setProperty("--wp", k.toFixed(2));
        if (k > (w.need || .42)) finish();
      };
      const finish = () => {
        done = true; el.classList.add("clear"); E.sfx("solve"); E.haptic("MEDIUM");
        cv.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 650, easing: "ease-out", fill: "forwards" });
        setTimeout(() => api.ok(), E.auto ? 1 : 750);
      };
      // nhận miết cả khi ngón tay trượt ra ngoài khung một chút
      const onDown = e => { if (done) return; e.preventDefault(); e.stopPropagation(); el.classList.add("on"); try { cv.setPointerCapture(e.pointerId); } catch {} last = null; stroke(e); E.sfx("tap"); };
      cv.addEventListener("pointerdown", onDown);
      cv.addEventListener("pointermove", e => { if (el.classList.contains("on") && !done) stroke(e); });
      const up = () => { el.classList.remove("on"); last = null; check(); };
      cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
      cv.addEventListener("click", e => e.stopPropagation());
      // gợi ý: chưa ai chạm sau 2 giây → bàn tay miết qua lại
      idle = setTimeout(() => !n && el.classList.add("hint"), 2000);
    },
    auto: (el, z, w, api) => api.ok(),
  });
  // KHOÁ SỐ ngay trên vật: { type: "dial", answer: "0601", kind: "digits" | "letters" } — chạm nửa trên / dưới bánh xe để đổi
  E.widget("dial", {
    html: (z, w) => `<div class="wg-dial">${[...String(w.answer)].map((_, i) => `<button data-d="${i}"><i>▲</i><b>${w.kind === "letters" ? "A" : "0"}</b><i>▼</i></button>`).join("")}</div>`,
    bind(el, z, w, api) {
      const set = w.kind === "letters" ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "0123456789", val = [...String(w.answer)].map(() => 0);
      el.querySelector(".wg-dial").onclick = e => {
        e.stopPropagation();
        const b = e.target.closest("[data-d]"); if (!b) return;
        const i = +b.dataset.d, up = e.clientY < b.getBoundingClientRect().top + b.offsetHeight / 2;
        val[i] = (val[i] + (up ? 1 : set.length - 1)) % set.length;
        b.querySelector("b").textContent = set[val[i]]; E.sfx("tap"); E.haptic("LIGHT");
        if (val.map(v => set[v]).join("") === String(w.answer).toUpperCase()) { E.sfx("solve"); el.classList.add("ok"); setTimeout(api.ok, 500); }
      };
    },
    auto: (el, z, w, api) => api.ok(),
  });
  // CÔNG TẮC: bật / tắt 1 cờ ngay (đèn, vòi nước…) — view đổi ảnh theo cờ (img: s => …); then (nếu có) chạy sau khi bật
  E.widget("switch", {
    html: () => ``,
    tap: (z, w, api) => { const R = E.R(); R.f[w.flag] = !R.f[w.flag]; E.sfx(w.sfx || "tap"); E.haptic("LIGHT"); if (R.f[w.flag] && w.ok) api.ok(); else api.redraw(true); },
  });

  // ═════════ ĐỊA ĐIỂM ═════════
  // người đứng trong cảnh / vùng có talk → sinh mảng bước con (đường dẫn ngăn xếp cố định khi tải lại)
  E.norm("views", P => {
    for (const v of Object.values(P.views || {})) {
      (v.people || []).forEach(p => { p.go = [{ talk: typeof p.talk === "string" ? p.talk : { with: p.who, ...(p.talk || {}) } }]; });
      (v.zones || []).forEach(z => { if (z.talk) z.go = [{ talk: typeof z.talk === "string" ? z.talk : { with: z.who, ...z.talk } }]; });
    }
  });
  const SIL = c => `<svg viewBox="0 0 200 300" preserveAspectRatio="xMidYMax meet"><path fill="${c}" fill-opacity=".55" d="M100 26c-26 0-43 20-43 47 0 20 9 36 23 44l-2 15c-36 8-60 30-65 70l-5 98h184l-5-98c-5-40-29-62-65-70l-2-15c14-8 23-24 23-44 0-27-17-47-43-47z"/></svg>`;
  const MAP_ICON = `<svg viewBox="0 0 24 24"><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15M15 6v15"/></svg>`;
  const DOOR_ICON = `<svg viewBox="0 0 24 24"><path d="M4 21V3h11v18M2 21h16M8 12h1M12 12h9m-3-3 3 3-3 3"/></svg>`;

  // One image rule for normal entry and a suspended place's saved child.
  const placeImage = (v, PS, R) => {
    const base = (typeof v.img === "function" ? v.img(E.state()) : v.img) || PS.v;
    const taken = (v.zones || []).filter(z => z.take && z.art === false && typeof z.r === "string" && (PS.took?.[z.take] || R.items.includes(z.take))).map(z => base + "--" + z.r).find(n => E.artReal("im-" + n));
    return taken || base;
  };
  const placeLayer = (v, viewId, img, tr, options = {}) => {
    if (v.regions || v.size || v.fit) E.regions({ [img]: { ...(v.regions ? { r: v.regions } : {}), ...(v.size ? { size: v.size } : {}), ...(v.fit ? { fit: v.fit } : {}) } });
    const has = E.hasArt("im-" + img);
    return E.ui.layer("v:" + img, `<div class="ph vph"><b>${esc(nat(v.name) || viewId)}</b></div>${has ? `<div class="ii im-${esc(img)}"></div>` : ""}${E.vbox(img, E.fxHtml(img) + E.wireHtml(img, !has || E.wire), "deco")}${E.vbox(img, "", "zones")}`, { tr, ...options });
  };
  const changesVisual = st => !!st && typeof st === "object" && (["bg", "scene", "shot", "cg", "look", "actionFrame"].some(key => Object.prototype.hasOwnProperty.call(st, key)) || !!st.motion?.backdrop);
  const branchChangesVisual = (value, seen = new Set()) => {
    if (!value || typeof value !== "object" || seen.has(value)) return false;
    seen.add(value);
    if (changesVisual(value)) return true;
    return Object.values(value).some(child => branchChangesVisual(child, seen));
  };
  E.ui.restorePlaceView = () => {
    const R = E.R(), S = E.S(), vw = R.vw, PS = vw && R.pl?.[vw.pid];
    if (!vw || !PS || PS.v !== vw.v || R.shot || R.cg || R.look || R.actionFrame || R.zoom) return false;
    // snapshot() supplies the actual resumable index. A live reading frame's
    // raw i points to the NEXT step and must not select that step's backdrop.
    const stack = E.snapshot().stack || [];
    for (let owner = stack.length - 2; owner >= 0; owner--) {
      const f = stack[owner], spec = E.walk(f)?.[f.i]?.place, named = typeof spec === "string";
      const P = named ? S.places?.[spec] : spec, v = P?.views?.[vw.v], child = stack[owner + 1];
      if (!P || typeof P !== "object" || !v) continue;
      const pid = P.id || (named ? spec : [f.n, ...f.p, f.i].join("."));
      const prefix = named ? [spec, "views", vw.v] : [...f.p, f.i, "place", "views", vw.v];
      if (pid !== vw.pid || child.n !== (named ? "@places" : f.n) || !prefix.every((key, i) => child.p?.[i] === key)) continue;
      for (const frame of stack.slice(owner + 1)) {
        const steps = E.walk(frame), st = steps?.[frame.i];
        if (!steps || !Number.isInteger(frame.i) || frame.i < 0 || frame.i > steps.length) return false;
        // A completed conditional may have moved the scene before this line.
        // Decline ambiguous histories instead of re-evaluating old conditions.
        if (steps.slice(0, frame.i).some(step => branchChangesVisual(step)) || changesVisual(st)) return false;
        const talk = frame.n === "@talks" ? S.talks?.[frame.p?.[0]] : typeof st?.talk === "string" ? S.talks?.[st.talk] : st?.talk;
        // Hello or a previously completed topic may already have relocated.
        // Such conversations retain the normal explicit-scene restore path.
        if (talk && branchChangesVisual(talk)) return false;
      }
      const img = placeImage(v, PS, R), sc = S.scenes?.[R.scene] || { kind: R.scene }, rt = $(".se");
      placeLayer(v, vw.v, img, "cut");
      E.ui.frame(img, [...(v.zones || []).map(z => E.regionOf(img, z.r)?.box), ...(v.people || []).map(p => E.regionOf(img, p.r)?.box)], { top: 64, bottom: 150 });
      if (R.sceneProps?.img === img) E.ui.sceneProps?.(img);
      // Restore ambient presentation without calling scene(view), which would
      // overwrite the narrative return location. No live zones/people or visit
      // counters are recreated while the child is still reading.
      if (rt) {
        rt.dataset.scene = sc.kind || R.scene || "";
        $(".se-fx", rt).dataset.fx = sc.fx || (sc.rain ? "rain" : "");
        $(".se-fog", rt).classList.toggle("on", !!sc.fog);
      }
      E.amb(v.amb || sc.amb || (sc.rain ? "rain" : sc.fog ? "sea" : sc.kind === "court" ? "hall" : "room"));
      return true;
    }
    return false;
  };

  def("place", c => new Promise(res0 => {
    const S = E.S(), R = E.R();
    const ref = typeof c.st.place === "string" ? c.st.place : null;
    const P = ref ? S.places?.[ref] : c.st.place;
    if (!P) { console.warn("[story] place không có", c.st.place); return res0(); }
    if (!P.views || !Object.keys(P.views).length) { console.warn("[story] place has no views", ref); return res0(); }
    c.resumeHere?.();
    const pid = P.id || ref || c.key();
    const location = E.enterLocation(P.location || pid);
    const spatial = !!P.spatial;
    const PS = ((R.pl ||= {})[pid] ||= { v: P.start || Object.keys(P.views)[0], seen: {}, took: {}, vis: {}, hint: 0, solved: {}, n: {} });
    const direct = P.direct ?? S.exploreDirect ?? /^vale-dossiers/.test(S.id || "");
    const assist = () => !direct || !!E.G()?.set?.vdExploreAssist;
    if (PS.detail?.v !== PS.v) delete PS.detail;
    // With inspection magnification disabled, an ordinary hotspot is read in
    // place. There is no separate viewpoint to retreat from. Explicit focused
    // interactions can still opt into detail mode with inspect:true.
    if (PS.detail && S.inspectionZoom === false && !P.views[PS.v]?.zones?.some((z, i) => (z.id || String(i)) === PS.detail.id && z.inspect === true)) delete PS.detail;
    let done = false;
    const timers = new Set(), defer = (fn, ms) => { const id = setTimeout(() => { timers.delete(id); if (!done && c.live()) fn(); }, ms); timers.add(id); return id; };
    const stage = $(".se-stage"), uiHost = $(".se-ui");
    // Navigation sits above the actual HUD, including wrapped goals, bags and
    // translated text. Read layout height, not the panel's animated transform;
    // this measurement never feeds back into the scene/camera hit plane.
    const measureNav = () => {
      if (done || !c.live()) return;
      const nav = navEl(), a = nav.getBoundingClientRect(), b = uiHost?.getBoundingClientRect();
      // In a split landscape layout the HUD is beside the scene, not below it.
      const overlaps = b && Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1;
      nav.style.setProperty("--place-ui-height", Math.ceil(overlaps ? uiHost.offsetHeight : 0) + "px");
    };
    let spatialSheet = null;
    let unhook = () => { E.cancelDrag?.(); if (spatialSheet && !spatialSheet.hidden && spatialSheet.classList.contains("pl-spatial-sheet")) E.ui.closeSheet(); spatialSheet = null; stage.onclick = stage.onpointerdown = stage.onpointerup = stage.onpointercancel = null; navEl().innerHTML = ""; navEl().onclick = null; navEl().style.removeProperty("--place-ui-height"); $(".se")?.classList.remove("pl-inspecting"); };
    const res = () => { if (done) return; done = true; unhook(); timers.forEach(clearTimeout); res0(); };
    c.onExit?.(() => { done = true; timers.forEach(clearTimeout); unhook(); });
    // chạy mảng bước con của địa điểm (khai báo tại chỗ → theo đường dẫn bước; story.places → node "@places")
    const run = keys => (ref ? R.stack.push({ n: "@places", p: [ref, ...keys], i: 0 }) : c.push("place", ...keys));
    const ring = P.ring || Object.keys(P.views).filter(k => !P.views[k].up);
    if (PS.by == null && P.by && R.clock) PS.by = E.time.abs(P.by);
    const VIEW = () => P.views[PS.v] || P.views[ring[0]];
    // ảnh của view · nhặt đồ xong → ảnh nền “đã nhặt” <ảnh>--<vùng> (gen-art tự sinh bằng Qwen-Edit xoá vật đó khỏi chính ảnh gốc → luôn khớp)
    const imgOf = v => placeImage(v, PS, R);
    const zid = (z, i) => z.id || String(i);
    const seenK = (z, i, v = PS.v) => v + "/" + zid(z, i);
    // Looking at a mechanism is not the same as finishing its useful actions.
    // Authored completion also reconciles saves from before an item-use gate.
    const exhausted = (z, i) => z.complete != null ? !!cond(z.complete, E.state()) : !!PS.seen[seenK(z, i)] && (!z.use && !z.widget || !!PS.solved[seenK(z, i)]);
    for (const [vk, v] of Object.entries(P.views)) for (const [i, z] of (v.zones || []).entries()) if (z.complete != null && cond(z.complete, E.state())) { PS.seen[seenK(z, i, vk)] = 1; PS.solved[seenK(z, i, vk)] = 1; }
    const zones = () => (VIEW().zones || []).map((z, i) => ({ z, i })).filter(({ z, i }) => (!z.if || cond(z.if, E.state())) && !(z.hide && cond(z.hide, E.state())) && !(z.take && (PS.took[z.take] || R.items.includes(z.take))) && !(z.once && PS.seen[seenK(z, i)]));
    const people = () => (VIEW().people || []).map((p, i) => ({ p, i })).filter(({ p }) => !p.if || cond(p.if, E.state()));
    const detail = () => direct && PS.detail?.v === PS.v ? PS.detail : null;
    // In direct exploration, a pure navigation region must not duplicate the
    // left/right control. Detail glints inspect; edge controls change views.
    // Keep non-adjacent doorways and regions with authored interactions intact.
    const redundantNav = z => direct && !(spatial && z.kind && z.kind !== "turn") && z.to && !z.then && !z.again && !z.use && !z.take && !z.widget && !z.talk && !z.need && !z.cost && [side(-1), side(1)].includes(z.to);
    const shownZones = () => zones().filter(({ z, i }) => (!detail() || zid(z, i) === detail().id) && !redundantNav(z));
    const targetStyle = box => direct ? `left:${box[0] + box[2] / 2}%;top:${box[1] + box[3] / 2}%;width:${box[2]}%;height:${box[3]}%;transform:translate(-50%,-50%)` : E.pctStyle(box);
    const artOf = z => typeof z.art === "string" ? z.art : z.take && z.art !== false && E.artReal("im-it-" + z.take) ? "it-" + z.take : "";
    const physicalProps = img => [...zones().map(({ z, i }) => ({ id: zid(z, i), art: artOf(z), box: E.regionOf(img, z.artR || z.r)?.box, rotate: z.artRot, z: z.z })), ...(VIEW().props || []).filter(p => !p.if || cond(p.if, E.state())).map(p => ({ id: p.id, art: p.art, box: E.regionOf(img, p.r)?.box, rotate: p.artRot, z: p.z }))].filter(p => p.art && p.box);
    // manh mối: vùng clue của mọi view
    const allClues = () => Object.entries(P.views).flatMap(([vk, v]) => (v.zones || []).map((z, i) => ({ vk, z, i })).filter(x => x.z.clue && (!x.z.if || cond(x.z.if, E.state()))));
    const found = () => allClues().filter(x => PS.seen[seenK(x.z, x.i, x.vk)]).length;
    // need: số manh mối · [mã vùng] · hàm điều kiện s => … (vd. đã nói chuyện đủ người) — progress: s => [đã, tổng] cho thanh dưới
    const needN = () => Array.isArray(P.need) ? P.need.length : typeof P.need === "function" ? 0 : Math.min(P.need ?? 0, allClues().length);
    const needOk = () => Array.isArray(P.need) ? P.need.every(id => Object.keys(PS.seen).some(k => k.endsWith("/" + id))) : typeof P.need === "function" ? !!P.need(E.state()) : found() >= needN();
    let hold = null, bagOpen = false, mapOpen = false, listOpen = false, goalOpen = false, viewBusy = false, paintN = 0, msg = "", ask = false;

    // ── ảnh nền của view (tr: kiểu chuyển)
    const paint = (tr = "cut", o = {}) => {
      const v = VIEW(), img = imgOf(v);
      const changed = placeLayer(v, PS.v, img, tr, o);
      if (direct) E.ui.sceneProps?.(img, physicalProps(img));
      PS.vis[PS.v] = 1;
      // mọi vùng chạm + người của view nằm trong phần màn thấy được (điện thoại dài / máy tính bảng / máy tính)
      E.ui.frame(img, [...(v.zones || []).map(z => E.regionOf(img, z.r)?.box), ...(v.people || []).map(pp => E.regionOf(img, pp.r)?.box)], { top: 64, bottom: 150 });
      if (v.amb) E.amb(v.amb);
      R.vw = { pid, v: PS.v };
      return changed;
    };
    // ── vùng + người (trong khung ảnh → khớp ảnh khi màn dài / ngắn) + nút quay / lùi + thanh dưới
    const draw = () => {
      if (done || !c.live()) return;
      const v = VIEW(), img = imgOf(v), L = $(".se-bgl.on .vbw.zones .vbx");
      const [iw, ih] = E.imgSize(img); $(".se")?.style.setProperty("--vale-scene-ar", String(iw / ih));
      $(".se")?.classList.toggle("pl-inspecting", !!detail());
      if (direct) E.ui.sceneProps?.(img, physicalProps(img));
      if (L) {
        const lt = v.light || P.light || E.S().light;
        L.style.setProperty("--vf", lt ? `brightness(${lt.b ?? 1}) saturate(${lt.s ?? 1}) sepia(${lt.warm ?? 0}) hue-rotate(${lt.cool ? -(lt.cool * 25) : 0}deg)` : "none");
        L.innerHTML = shownZones().map(({ z, i }, k) => {
          const r = E.regionOf(img, z.r); if (!r) { console.warn("[story] place: vùng không có", z.r, "trên", img); return ""; }
          const sk = seenK(z, i), sn = PS.seen[sk], complete = exhausted(z, i), w = z.widget, inl = w && WG[w.type]?.html && !PS.solved[sk];
          // ĐỒ VẬT GHÉP LÊN ẢNH (art): ảnh PNG riêng đặt đúng khung vùng → vật và chỗ chạm luôn trùng nhau, dù ảnh nền AI vẽ lệch
          // vật GHÉP lên nền (người dùng 30/10: “nổi lên tí cũng không sao, chủ yếu bố cục ổn”): art = ảnh PNG; nhặt được (take) có it-<đồ> → tự ghép.
          //   art: false = vật đã VẼ SẴN trong nền (nhặt xong engine đổi sang ảnh “đã nhặt” <ảnh>--<vùng>)
          const art = direct ? "" : artOf(z);
          return `<button class="pz${complete ? " seen" : ""}${hold ? " aim" : ""}${(r.shape || z.shape) === "ellipse" ? " el" : ""}${z.glint === false || (!direct && complete) || (direct && (z.to || z.exit)) ? " ng" : ""}${z.to ? " pz-nav" : ""}${z.exit ? " ex" : ""}${inl ? " wg" : ""}${art ? " ha" : ""}" data-z="${i}" data-zone-id="${esc(zid(z, i))}" data-seen="${sn ? "true" : "false"}" data-exhausted="${complete ? "true" : "false"}" style="${targetStyle(r.box)};z-index:${z.z ?? 2};--gd:${(0.8 + k * 2.1 + (E.hash(zid(z, i) + img) % 30) / 10).toFixed(1)}s" aria-label="${esc(nat(z.label) || zid(z, i))}${complete ? " · " + esc(T("examined", "đã xem")) : ""}">${art ? `<i class="pz-sh"></i><i class="pz-art ii im-${esc(art)}"${z.artRot ? ` style="transform:rotate(${z.artRot}deg)"` : ""}></i>` : ""}${inl ? `<div class="wg">${WG[w.type].html(z, w)}</div>` : ""}<span class="pz-l">${esc(nat(z.label) || "")}</span>${z.exit || (direct && z.to) ? `<em class="pz-x">${spatial && z.to && z.kind !== "detail" && z.kind !== "turn" ? (z.kind === "walk" ? E.ICON.shoe : DOOR_ICON) : E.ICON.right}</em>` : ""}</button>`;
        }).join("") + (detail() && S.inspectionZoom !== false ? [] : people()).map(({ p, i }) => {
          let r = E.regionOf(img, p.r) || { box: [30, 38, 40, 62] }, ch = S.chars[p.who] || {}, face = p.face ? `im-${p.who}-${p.face}` : "";
          // ảnh TOÀN THÂN (đầu tới chân) theo dáng: <mã>-full-<pose> → <mã>-full → ảnh nửa người cũ
          const full = [p.pose && `im-${p.who}-full-${p.pose}`, p.face && `im-${p.who}-full-${p.face}`, `im-${p.who}-full`].find(x => x && E.hasArt(x) && E.artReal?.(x));
          // chưa có ảnh toàn thân → ảnh NỬA NGƯỜI: kéo khung xuống CHẠM ĐÁY ảnh + mờ dần mép dưới → không lộ đường cắt ngang thân giữa cảnh
          if (!full) { const bx = r.box; r = { ...r, box: [bx[0], bx[1], bx[2], 100 - bx[1]] }; }
          const fresh = !R.used["tkh:" + p.who];
          return `<button class="pp${fresh ? " new" : ""}${full ? " full" : " half"}${detail() ? " scenery" : ""}" data-p="${i}" data-who="${esc(p.who)}"${detail() ? ' inert tabindex="-1" aria-hidden="true"' : ` aria-label="${esc(T("Talk to ", "Nói chuyện với ") + E.cname(ch, true))}"`} style="${E.pctStyle(r.box)};z-index:${p.z ?? 3};--c:${ch.color || "#aaa"}"><div class="pp-i${full ? " full" : ""}">${full ? "" : `<div class="ph">${SIL(ch.color || "#aaa")}</div>`}${full ? `<div class="ii ${full}"></div>` : `<div class="ii im-${p.who}"></div>${face && E.hasArt(face) ? `<div class="ii ${face}"></div>` : ""}`}</div>${detail() ? "" : `<span class="pp-n">${E.ICON.talk}<b>${esc(E.known(p.who) ? E.cname(ch, true) : (nat(ch.hint) || "").replace(/[.。]$/, "") || E.cname(ch, true))}</b></span>`}</button>`;
        }).join("") + (v.fg ? `<i class="vfg ii im-${esc(typeof v.fg === "string" ? v.fg : img + "-fg")}" style="z-index:${v.fgZ ?? 5}"></i>` : "");
        for (const { z, i } of shownZones()) { const w = z.widget; if (w && WG[w.type]?.bind && !PS.solved[seenK(z, i)]) { const el = L.querySelector(`[data-z="${i}"] .wg`); if (el) WG[w.type].bind(el, z, w, api(z, i)); } }
        for (const sprite of L.querySelectorAll(".pp.full .pp-i > .ii")) E.fitSprite?.(sprite);
      }
      const nb = side(-1), nb2 = side(1), back = !spatial && parentEdge();
      navEl().innerHTML = detail() ? `<button class="pl-detail-back" data-detail-back>${E.ICON.left}<span>${esc(T("Back", "Lùi"))}</span></button>` : `${nb || nb2 ? `${nb ? `<button class="pl-ar l" data-nav="-1" aria-label="${esc(T("Turn left", "Quay trái"))}">${E.ICON.left}</button>` : ""}${nb2 ? `<button class="pl-ar r" data-nav="1" aria-label="${esc(T("Turn right", "Quay phải"))}">${E.ICON.right}</button>` : ""}` : ""}${back ? `<button class="pl-back" data-up aria-label="${esc(T("Step back", "Lùi lại"))}">${E.ICON.down}</button>` : ""}`;
      hud();
    };
    const hud = () => {
      if (done || !c.live()) return;
      const pg = P.progress?.(E.state()), tot = pg ? pg[1] : allClues().length, n = pg ? pg[0] : found(), ok = needOk() || P.leave === true, it = hold && S.items[hold];
      const contextual = P.contextInventory ?? S.contextInventory;
      const candidates = contextual ? E.contextItems(location) : R.items.filter(E.itemLive);
      const items = R.items.filter(id => S.items[id] && (id === hold || candidates.includes(id)));
      const short = typeof P.need === "function" ? (needOk() ? 0 : Math.max(1, tot - n)) : Array.isArray(P.need) ? P.need.filter(id => !Object.keys(PS.seen).some(k => k.endsWith("/" + id))).length : Math.max(0, needN() - found());
      // Custom objective progress and unchecked physical clues are different counts.
      // A completed 2/2 objective must not produce a "0 places left" warning.
      const unchecked = Math.max(0, allClues().length - found());
      const askHtml = ask ? `<div class="pl-ask"><b>${esc(short ? T(`Find ${short} more clue${short > 1 ? "s" : ""} first?`, `Còn thiếu ${short} manh mối.`) : T(`${unchecked} clue-marked spot${unchecked > 1 ? "s" : ""} not checked yet.`, `Còn ${unchecked} điểm có manh mối chưa xem.`))}</b><p>${esc(short ? T("Missing clues can make your deductions wrong. Leave anyway?", "Thiếu manh mối có thể khiến bạn suy luận sai. Vẫn rời đi?") : T("You have what you need to continue. You can look around more, or leave now.", "Bạn đã đủ thông tin để đi tiếp. Có thể xem thêm hoặc rời đi ngay."))}</p><div class="se-row"><button class="se-btn" data-ask-no>${esc(T("Keep looking", "Xem tiếp"))}</button><button class="se-btn pri" data-ask-yes>${esc(T("Leave", "Rời đi"))}</button></div></div>` : "";
      const holdHtml = it ? `<div class="pl-hold"><button class="pl-hia" data-view data-held-item="${esc(hold)}" aria-label="${esc(T("Inspect or drag: ", "Xem hoặc kéo: ") + nat(it.name))}">${E.itemArt(hold, "sm")}</button><span><b>${esc(nat(it.name))}</b><small>${esc(T("Drag to a detail, or tap where to use it", "Kéo tới chi tiết, hoặc chạm chỗ muốn dùng"))}</small></span><button class="se-ib sm" data-unhold aria-label="${esc(T("Put away", "Cất đi"))}">${E.ICON.x}</button></div>` : "";
      const near = detail() ? [] : [...new Set([side(-1), side(1), parentEdge()?.to].filter(Boolean))];
      const routeHtml = mapOpen && assist() && !detail() ? `<div class="pl-routes" aria-label="${esc(T("Nearby places", "Chỗ lân cận"))}">${near.map(to => `<button class="se-btn sm" data-place-to="${esc(to)}">${esc(nat(P.views[to]?.name) || to)}${PS.vis[to] ? " ✓" : ""}</button>`).join("") || `<small>${esc(T("No adjoining view", "Không có góc nhìn kế bên"))}</small>`}</div>` : "";
      const doorways = spatial && !detail() ? routeEntries().map(({ edge, i }) => `<button class="se-btn sm" data-place-route="${i}"${edge.allowed ? "" : " disabled"}>${edge.allowed ? DOOR_ICON : E.ICON.lock}<span>${esc(nat(edge.label) || nat(P.views[edge.to]?.name) || edge.to)}</span></button>`).join("") : "";
      const doorHtml = doorways ? `<div class="pl-doorways" aria-label="${esc(T("Ways through", "Lối đi"))}">${doorways}</div>` : "";
      const targetsHtml = listOpen && assist() && !detail() ? `<div class="pl-targets" aria-label="${esc(T("Visible objects and people", "Đồ vật và người trong cảnh"))}">${zones().map(({z,i}) => `<button class="se-btn sm" data-place-z="${i}">${PS.seen[seenK(z,i)] ? "✓ " : ""}${esc(nat(z.label) || zid(z,i))}</button>`).join("")}${people().map(({p,i}) => `<button class="se-btn sm" data-place-p="${i}">${E.ICON.talk}${esc(E.cname(S.chars[p.who]))}</button>`).join("")}</div>` : "";
      const bag = bagOpen && items.length ? `${contextual ? `<small class="se-context-bag-label">${esc(T("Items in this location", "Đồ trong khu vực này"))}</small>` : ""}<div class="pl-bag">${items.map(id => `<button class="se-bi${hold === id ? " on" : ""}" data-it="${id}" aria-label="${esc(nat(S.items[id]?.name))}">${E.itemArt(id, "sm")}</button>`).join("")}</div>` : "";
      const goalText = detail() ? T("Tap the detail to inspect it again. Use Back to return to the scene.", "Chạm chi tiết để xem lại. Bấm Lùi để trở về cảnh.") : nat(E.ui.explorationObjective?.({place:pid}) || P.goal) || nat(P.name) || "";
      E.ui.setObjective?.({id:"place:" + pid, text:goalText});
      const goalTag = direct && !detail() ? "button" : "div";
      const back = spatial && !detail() && parentEdge();
      const backLabel = back && (nat(back.label) || T("Back to ", "Trở lại ") + nat(P.views[back.to]?.name || back.to));
      const backHtml = back ? `<button class="se-btn sm pl-spatial-back" data-up>${E.ICON.down}<span>${esc(backLabel)}</span></button>` : "";
      const goalHtml = `<${goalTag} class="pl-goal${direct ? " compact" : ""}"${goalTag === "button" ? ` type="button" data-objective aria-expanded="${goalOpen}" aria-label="${esc(T("Objective: ", "Mục tiêu: ") + goalText)}"` : ""}><span>${esc(S.collapsibleObjectives && goalTag === "button" ? T("Objective", "Mục tiêu") : goalText)}</span>${tot && !detail() ? `<b>${n}/${tot}</b>` : ""}${goalTag === "button" ? `<i aria-hidden="true">${E.ICON.down}</i>` : ""}</${goalTag}>`;
      E.ui.panel(`${askHtml || `<div class="pl-location"><span>${esc(nat(detail()?.label) || nat(VIEW().name) || nat(P.name) || "")}</span>${assist() && !detail() ? `<button class="se-btn sm" data-objects aria-expanded="${listOpen}">${esc(T("Objects", "Điểm chạm"))}</button>${!spatial && near.length ? `<button class="se-btn sm" data-scenes aria-expanded="${mapOpen}">${esc(T("Move", "Di chuyển"))}</button>` : ""}` : ""}</div>${routeHtml}${targetsHtml}${direct && goalOpen && !detail() ? `<div class="pl-objective" role="note">${esc(goalText)}</div>` : ""}${msg ? `<div class="pl-msg" role="status">${msg}</div>` : ""}${holdHtml}${bag}${doorHtml}
        <div class="pl-bar">${goalHtml}${backHtml}
          ${!detail() ? `<button class="pl-ib" data-hint aria-label="${esc(T("Hint", "Gợi ý"))}">${E.ICON.hint}</button>` : ""}
          ${spatial && !detail() ? `<button class="pl-ib" data-place-map aria-haspopup="dialog" aria-label="${esc(T("Area map", "Sơ đồ khu vực"))}">${MAP_ICON}</button>` : ""}
          ${items.length ? `<button class="pl-ib${bagOpen ? " on" : ""}${hold ? " hold" : ""}" data-bag aria-label="${esc(T("Bag", "Túi đồ"))}">${E.ICON.box}<i>${items.length}</i></button>` : ""}
          ${detail() || (P.leave === false && !ok) ? "" : `<button class="se-btn pri pl-go${ok ? "" : " dim"}" data-leave>${esc(nat(P.done) || T("Leave", "Rời đi"))}</button>`}</div>`}`, "pl");
      measureNav();
    };
    const api = (z, i) => ({
      live: () => !done && c.live(),
      defer,
      ok: () => { if (done || !c.live()) return; const k = seenK(z, i); if (PS.solved[k]) return; PS.solved[k] = 1; PS.seen[k] = 1; E.ui.fx("solve"); if (z.widget.ok) { leaveUI(); c.again(); run(["views", PS.v, "zones", i, "widget", "ok"]); res(); } else draw(); },
      redraw: repaint => { if (done || !c.live()) return; if (repaint) paintReady("still", { force: true }); else draw(); },
    });
    // Holding an item changes controls and dots only. It must not rebuild
    // people, reframe the background, or move the image-coordinate hit plane.
    const refreshTargets = () => $$(".se-bgl.on .pz[data-z]").forEach(el => el.classList.toggle("aim", !!hold));
    const refreshHold = () => { refreshTargets(); hud(); };
    // dọn giao diện địa điểm trước khi chạy bước con
    const leaveUI = () => { E.cancelDrag?.(); E.ui.setObjective?.(null); const L = $(".se-bgl.on .vbw.zones .vbx"); if (L) L.innerHTML = ""; navEl().innerHTML = ""; E.ui.clear(); };
    const finish = () => { if (done || !c.live()) return; delete PS.detail; leaveUI(); inspectLook(null, 400); R.vw = null; res(); };
    const rectOf = el => { const b = el?.getBoundingClientRect?.(); return b ? { x: b.left, y: b.top, w: b.width, h: b.height } : null; };
    const late = () => { if (PS.by != null && !PS.lateDone && E.time.now() >= PS.by && P.late) { PS.lateDone = 1; finish(); run(["late"]); return true; } return false; };
    const spend = min => { if (min) E.time.add(min, PS.by); };

    const paintReady = (tr, o) => {
      viewBusy = true; const token = ++paintN; paint(tr, o);
      Promise.resolve(E.ui.layerReady?.()).then(() => {
        if (done || !c.live() || token !== paintN) return;
        viewBusy = false;
        const v = VIEW(), img = imgOf(v);
        E.ui.frame(img, [...(v.zones || []).map(z => E.regionOf(img, z.r)?.box), ...(v.people || []).map(p => E.regionOf(img, p.r)?.box)], {top:64,bottom:150});
        if (detail()) inspectLook(detail().box, 0, true);
        E.syncImagePlanes?.();
        draw();
      });
    };
    const goView = (to, tr, o) => { if (done || !c.live() || !P.views[to] || viewBusy) return; E.cancelDrag?.(); delete PS.detail; inspectLook(null, 0, true); const oldZones = $(".se-bgl.on .vbw.zones .vbx"); if (oldZones) oldZones.innerHTML = ""; E.ui.hide("*"); PS.v = to; mapOpen = listOpen = false; hold = null; bagOpen = false; msg = ""; ask = false; paintReady(tr, o); E.sfx(tr === "zin" || tr === "zout" ? "whoosh" : "steps"); E.haptic("LIGHT"); E.save(); };
    const enterDetail = (z, i) => {
      if (!direct || z.to || z.exit || z.look === false || z.inspect === false || S.inspectionZoom === false && z.inspect !== true || detail()) return;
      const r = E.regionOf(imgOf(VIEW()), z.inspectR || z.r); if (!r) return;
      PS.detail = { v: PS.v, id: zid(z, i), box: [...r.box], label: z.label };
      mapOpen = listOpen = false; ask = false; msg = "";
      inspectLook(r.box, 650);
      draw();
    };
    const backDetail = () => {
      if (done || viewBusy || !c.live() || !detail()) return;
      delete PS.detail; hold = null; bagOpen = false; msg = "";
      inspectLook(null, 350); E.sfx("tap"); E.save();
      if (P.until && cond(P.until, E.state())) return finish();
      draw();
    };

    // One permission resolver serves controls, gestures, maps and automation.
    // A visible but locked route may be labelled; hidden edges never reveal a map node.
    function resolveEdge(value, defaults = {}) {
      const x = typeof value === "string" ? { to: value } : value;
      if (!x || !P.views[x.to]) return null;
      const edge = { ...defaults, ...x }, st = E.state();
      if (edge.if && !cond(edge.if, st) || edge.hide && cond(edge.hide, st)) return null;
      return { ...edge, allowed: !edge.need || !!cond(edge.need, st) };
    }
    function parentEdge(viewId = PS.v) {
      const v = P.views[viewId], edge = resolveEdge(v?.up, { kind: v?.upKind || (spatial ? "back" : "detail"), label: v?.upLabel, need: v?.upNeed, if: v?.upIf });
      return edge?.allowed ? edge : null;
    }
    function routeEntries(viewId = PS.v) {
      return (P.views[viewId]?.routes || []).map((x, i) => ({ edge: resolveEdge(x, { kind: "walk" }), i })).filter(x => x.edge);
    }
    function rawSide(d, viewId = PS.v) {
      if (viewId === PS.v && detail()) return null;
      const v = P.views[viewId], k = d < 0 ? "left" : "right", x = v?.[k];
      if (x !== undefined) {
        const edge = resolveEdge(x, { kind: "turn" });
        return edge?.allowed && (!spatial || v.space && v.space === P.views[edge.to].space) ? edge.to : null;
      }
      if (spatial) return null;
      const i = ring.indexOf(viewId); if (i < 0 || ring.length < 2) return null;
      return ring[(i + d + ring.length) % ring.length];
    }
    // Resolve the same visible neighbour for arrows, gestures and the route
    // list. A two-view ring must not retain a hidden second swipe target.
    function side(d, viewId = PS.v) {
      const to = rawSide(d, viewId);
      if (!to || to !== rawSide(-d, viewId)) return to;
      const v = P.views[viewId], own = d < 0 ? "left" : "right", other = d < 0 ? "right" : "left";
      if (v[own] !== undefined && v[other] === undefined) return to;
      if (v[own] === undefined && v[other] !== undefined) return null;
      return (ring.indexOf(viewId) === 0 ? d > 0 : d < 0) ? to : null;
    }
    function spatialEdges(viewId) {
      const v = P.views[viewId], out = [];
      for (const d of [-1, 1]) { const to = side(d, viewId); if (to) out.push({ from: viewId, to, type: "turn", d }); }
      const back = parentEdge(viewId); if (back) out.push({ ...back, from: viewId, type: "up" });
      for (const { edge, i } of routeEntries(viewId)) if (edge.allowed) out.push({ ...edge, from: viewId, type: "route", i });
      for (const [i, z] of (v?.zones || []).entries()) {
        if (!z.to || z.once && PS.seen[seenK(z, i, viewId)] || z.take && (PS.took[z.take] || R.items.includes(z.take))) continue;
        const edge = resolveEdge(z, { kind: "enter" });
        if (edge?.allowed) out.push({ ...edge, from: viewId, type: "zone", i });
      }
      return out;
    }
    const roomTransition = (edge, backwards = false) => edge?.kind === "detail" ? backwards ? "zout" : "zin" : "still";
    const nav = d => { if (viewBusy || done || !c.live()) return; const to = side(d); if (!to) return; const x = VIEW()[d < 0 ? "left" : "right"]; if (x?.cost) spend(x.cost); goView(to, d > 0 ? "sl-r" : "sl-l"); const nv = P.views[to]; if (nv.name && (x || nv.loc)) E.ui.loc?.(nat(nv.name), R.clock?.t || ""); };
    const up = () => { if (detail() || viewBusy || done || !c.live()) return; const edge = parentEdge(); if (edge) { spend(edge.cost); goView(edge.to, spatial ? roomTransition(edge, true) : "zout"); } };
    const onRoute = i => { if (!spatial || detail() || viewBusy || done || !c.live()) return; const entry = routeEntries().find(x => x.i === i); if (!entry?.edge.allowed) return; spend(entry.edge.cost); goView(entry.edge.to, roomTransition(entry.edge)); };
    function showSpatialMap() {
      if (!spatial || detail() || viewBusy || done || !c.live()) return;
      const all = Object.keys(P.views), known = new Set([PS.v, ...all.filter(id => PS.vis[id]), ...spatialEdges(PS.v).map(e => e.to)]);
      const nodes = all.filter(id => known.has(id));
      const validGrid = nodes.every(id => Number.isInteger(P.views[id].map?.x) && P.views[id].map.x >= 1 && P.views[id].map.x <= 3 && Number.isInteger(P.views[id].map?.y) && P.views[id].map.y >= 1 && P.views[id].map.y <= 20) && new Set(nodes.map(id => P.views[id].map.x + ":" + P.views[id].map.y)).size === nodes.length;
      const pos = Object.fromEntries(nodes.map((id, i) => [id, validGrid ? P.views[id].map : { x: 1, y: i + 1 }]));
      const cols = Math.max(...nodes.map(id => pos[id].x)), rows = Math.max(...nodes.map(id => pos[id].y));
      const edges = nodes.flatMap(spatialEdges).filter(e => known.has(e.to)), pairs = new Set(), drawn = edges.filter(e => { const key = [e.from, e.to].sort().join("\u0000"); if (pairs.has(key)) return false; pairs.add(key); return true; });
      const label = id => nat(P.views[id]?.name) || id;
      const lines = drawn.map(e => { const a = pos[e.from], b = pos[e.to]; return `<path d="M${(a.x - .5) * 100} ${(a.y - .5) * 100}L${(b.x - .5) * 100} ${(b.y - .5) * 100}"/>`; }).join("");
      const cards = nodes.map(id => `<div class="pl-map-node${id === PS.v ? " current" : ""}" data-map-view="${esc(id)}" style="grid-column:${pos[id].x};grid-row:${pos[id].y}"${id === PS.v ? ' aria-current="location"' : ""}><b>${esc(label(id))}</b><small>${esc(id === PS.v ? T("You are here", "Bạn đang ở đây") : PS.vis[id] ? T("Visited", "Đã tới") : T("Not entered yet", "Chưa vào"))}</small></div>`).join("");
      const links = drawn.map(e => `<li>${esc(label(e.from))} ${edges.some(r => r.from === e.to && r.to === e.from) ? "↔" : "→"} ${esc(label(e.to))}</li>`).join("");
      spatialSheet = E.ui.sheet(nat(P.spatial.title) || T("Area map", "Sơ đồ khu vực"), `<p class="pl-map-note">${esc(T("Only places you have seen and the ways visible from here. Use doors and paths in the scene to move.", "Các nơi bạn đã thấy và lối đi nhìn được từ đây. Đi qua cửa và lối đi trong cảnh để di chuyển."))}</p><div class="pl-map-grid" style="--map-cols:${cols};--map-rows:${rows}"><svg aria-hidden="true" viewBox="0 0 ${cols * 100} ${rows * 100}" preserveAspectRatio="none">${lines}</svg>${cards}</div><details class="pl-map-connections"><summary>${esc(T("Connections", "Các lối nối"))}</summary><ul>${links}</ul></details>`, "pl-spatial-sheet");
      spatialSheet.onclose = () => { spatialSheet = null; };
      E.sfx("tap");
    }
    // chạy bước con của 1 vùng: thu giao diện, máy quay nhìn vào vùng, xong bước con thì địa điểm vẽ lại (again)
    const go = (keys, z) => { leaveUI(); c.again(); E.syncImagePlanes?.(); if (z && z.look !== false) inspectLook(z.inspectR || z.r, 900); run(keys); res(); };

    const onZone = (i, el) => {
      if (done || viewBusy || !c.live() || !shownZones().some(x => x.i === i)) return;
      const z = VIEW().zones[i], k = seenK(z, i), st = E.state();
      E._zoneRect = rectOf(el);
      const base = ["views", PS.v, "zones", i];
      const feedback = value => { const text = typeof value === "function" ? value(st) : value; if (!text) return; if (S.transientHints && E.ui.hintToast) E.ui.hintToast(nat(text), {label:false}); else { msg = esc(nat(text)); hud(); } };
      if (z.complete != null && exhausted(z, i)) { hold = null; msg = ""; refreshHold(); return feedback(z.completeText); }
      // An untouched tool may deliberately say nothing until it has a purpose.
      if (z.need && !cond(z.need, st) && z.silentLocked) return;
      enterDetail(z, i);
      // cầm đồ → dùng lên vùng
      if (hold) {
        const it = hold;
        if (z.use?.[it] && PS.solved[k]) { hold = null; refreshHold(); return feedback(z.completeText || {en:"You have already used that here.",vi:"Bạn đã dùng món này ở đây rồi."}); }
        if (z.use?.[it]) { hold = null; PS.seen[k] = 1; PS.solved[k] = 1; spend(z.cost); return go([...base, "use", it], z); }
        E.sfx("wrong"); E.haptic("LIGHT"); el?.classList.add("no"); setTimeout(() => el?.classList.remove("no"), 400);
        msg = esc(nat(z.noUse || P.noUse || { en: "That doesn't help here.", vi: "Món này không dùng được ở đây." })); return hud();
      }
      // chưa đủ điều kiện
      if (z.need && !cond(z.need, st)) {
        if (z.stuck) { PS.n[k] = (PS.n[k] || 0) + 1; return go([...base, "stuck"], z); }
        E.sfx("wrong"); msg = esc(nat(z.lock || { en: "Not yet.", vi: "Chưa được." })); return hud();
      }
      if (z.useOnly) return feedback(z.tapText);
      // câu đố trên cảnh
      const w = z.widget;
      if (w && !PS.solved[k]) { if (WG[w.type]?.tap) return WG[w.type].tap(z, w, api(z, i)); if (w.then && !PS.seen[k]) { PS.seen[k] = 1; return go([...base, "widget", "then"], z); } return; }
      // sang view khác / cận cảnh: phóng vào từ đúng chỗ chạm
      if (z.to) {
        const edge = resolveEdge(z, { kind: "enter" });
        if (!edge?.allowed) { msg = esc(T("This way is not available.", "Chưa thể đi lối này.")); return hud(); }
        PS.seen[k] = 1; spend(z.cost);
        const b = el?.getBoundingClientRect?.(), sr = stage.getBoundingClientRect();
        const o = b ? { ox: ((b.left + b.width / 2 - sr.left) / sr.width * 100).toFixed(1), oy: ((b.top + b.height / 2 - sr.top) / sr.height * 100).toFixed(1) } : {};
        const tr = spatial ? roomTransition(edge) : P.views[z.to]?.up ? "zin" : "still";
        if (z.then && !PS.n["to:" + k]) { PS.n["to:" + k] = 1; goView(z.to, tr, o); return go([...base, "then"], null); }
        return goView(z.to, tr, o);
      }
      if (z.exit) { if (!needOk() && P.leave !== true) { if (P.leave === false) { msg = esc(T("Finish the investigation here first.", "Hãy hoàn thành việc tìm hiểu ở đây trước.")); return hud(); } ask = true; return hud(); } PS.seen[k] = 1; finish(); if (z.then) run([...base, "then"]); return; }
      // nhặt đồ: vào túi ngay (an toàn khi tải lại) → vật bay ra từ chỗ nó nằm → bước then
      if (z.take) {
        PS.took[z.take] = 1; PS.seen[k] = 1; spend(z.cost);
        if (direct) E.ui.sceneProps?.(imgOf(VIEW()), physicalProps(imgOf(VIEW())));
        leaveUI(); c.again();
        if (z.then) run([...base, "then"]);
        if (!R.items.includes(z.take)) { R.items.push(z.take); E.ui.dot(true); E.emit("item", z.take); }
        R.reveal = z.take; R.stack.push({ n: "@__take", p: [], i: 0 });
        return res();
      }
      const solved = !z.use || PS.solved[k], first = !PS.seen[k];
      const n = (PS.n[k] = (PS.n[k] || 0) + 1);
      if (solved) PS.seen[k] = 1;
      if (first) spend(z.cost);
      let keys = null;
      if (!solved) keys = z.stuck ? ["stuck"] : z.then ? ["then"] : null;
      else if (!first && z.again) keys = Array.isArray(z.again[0]) ? ["again", (n - 2) % z.again.length] : ["again"];
      else if (!first && (z.clue || z.then)) keys = "seen";
      else if (z.then) keys = ["then"];
      else if (z.go) keys = ["go"];
      if (!keys) { if (!solved) { msg = esc(nat(z.lock || { en: "You'll need something for this.", vi: "Cần thứ gì đó cho chỗ này." })); E.sfx("wrong"); } E.save(); return draw(); }
      if (keys === "seen") { leaveUI(); c.again(); E.syncImagePlanes?.(); if (z.look !== false) inspectLook(z.inspectR || z.r, 700); R.stack.push({ n: "@__seen", p: [], i: 0 }); return res(); }
      go([...base, ...keys], z);
    };
    const onPerson = (i, el) => { if (done || viewBusy || detail() || !c.live() || !people().some(x => x.i === i)) return; E._zoneRect = rectOf(el); leaveUI(); c.again(); run(["views", PS.v, "people", i, "go"]); res(); };
    // GỢI Ý 3 MỨC: 1 = mọi chỗ chưa xem loé cùng lúc · 2 = hiện tên các chỗ đó · 3 = chỉ đúng 1 chỗ nên làm + lời gợi ý (zone.hint)
    const onHint = () => {
      PS.hint = (PS.hint || 0) + 1; E.sfx("tap");
      const L = $(".se-bgl.on .vbw.zones .vbx"); if (!L) return;
      const lvl = ((PS.hint - 1) % 3) + 1;
      L.classList.remove("hint1", "hint2", "hint3"); $$(".pz.pick", L).forEach(x => x.classList.remove("pick")); void L.offsetWidth; L.classList.add("hint" + lvl);
      defer(() => { L.classList.remove("hint1", "hint2", "hint3"); $$(".pz.pick", L).forEach(x => x.classList.remove("pick")); }, 3400);
      msg = "";
      if (lvl === 3) {
        const nx = zones().find(({ z, i }) => (z.clue || z.use || z.widget || z.to || z.take) && !exhausted(z, i));
        if (nx) { L.querySelector(`[data-z="${nx.i}"]`)?.classList.add("pick"); msg = esc(nat(E.ui.explorationHint?.({place:pid,level:lvl}) || nx.z.hint || nx.z.label) || T("Look here.", "Xem chỗ này.")); }
        else msg = esc((spatial ? spatialEdges(PS.v).length : ring.length > 1 || parentEdge()) ? T("Nothing more here. Try somewhere else.", "Chỗ này hết rồi. Thử chỗ khác xem.") : T("You've seen everything here.", "Bạn đã xem hết chỗ này."));
      } else msg = esc(lvl === 1 ? T("Look for the shimmer.", "Để ý chỗ loé sáng.") : T("Places you haven't checked.", "Những chỗ bạn chưa xem."));
      if (S.transientHints && E.ui.hintToast) { const text = document.createElement("span"); text.innerHTML = msg; E.ui.hintToast(text.textContent, {onDismiss:() => { L.classList.remove("hint1", "hint2", "hint3"); $$(".pz.pick", L).forEach(x => x.classList.remove("pick")); }}); msg = ""; }
      hud();
    };

    // ── vào / quay lại sau bước con
    if (late()) return;
    if (P.until && cond(P.until, E.state()) && !detail()) return finish();
    E.ui.hideBox(); E.ui.hide("*"); if (!detail()) inspectLook(null, 0, true);
    const first = !PS.entered; PS.entered = 1;
    const warmActions = steps => {
      if (Array.isArray(steps)) return steps.forEach(warmActions);
      if (!steps || typeof steps !== "object") return;
      if (typeof steps.shot === "string") E.preloadImg?.("im-" + steps.shot);
      for (const key of ["then", "again", "else", "choice"]) if (steps[key]) warmActions(steps[key]);
    };
    for (const v of Object.values(P.views)) {
      E.preloadImg?.("im-" + imgOf(v));
      for (const p of v.people || []) E.preloadImg?.("im-" + p.who + "-full");
      for (const z of v.zones || []) warmActions(z);
    }
    paintReady(first ? "" : "still");
    if (first && P.name) E.ui.loc?.(nat(P.name), R.clock ? R.clock.t : "");

    stage.onclick = e => {
      if (done || !c.live() || E.dragged?.()) return;
      if (swiped) { swiped = false; e.stopPropagation(); return; }
      if (e.target.closest(".wg canvas, .wg-dial")) return;
      const z = e.target.closest(".pz[data-z]"); if (z) { E.sfx("tap"); return onZone(+z.dataset.z, z); }
      const p = e.target.closest(".pp[data-p]"); if (p) { E.sfx("tap"); return onPerson(+p.dataset.p, p); }
      // chạm chỗ trống khi đang cầm đồ → cất đồ
      if (hold) { hold = null; msg = ""; refreshHold(); }
    };
    // vuốt ngang = quay trái / phải · vuốt xuống ở cận cảnh = lùi
    let sx = null, swiped = false;
    // Suppression belongs to one gesture. A new button tap must clear a
    // previous cancelled/blocked swipe before the target exclusion returns.
    stage.onpointerdown = e => { sx = null; swiped = false; if (detail() || viewBusy || hold || e.target.closest(".wg,.pz,.pp,button")) return; sx = [e.clientX, e.clientY]; };
    stage.onpointerup = e => { if (!sx || done || !c.live()) return; const dx = e.clientX - sx[0], dy = e.clientY - sx[1]; sx = null; const d = (P.swipe || S.placeSwipe) === "direction" ? (dx < 0 ? -1 : 1) : (dx < 0 ? 1 : -1); if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) { swiped = true; if (side(d)) nav(d); } else if (dy > 90 && Math.abs(dy) > Math.abs(dx) * 1.5 && parentEdge()) { swiped = true; up(); } };
    stage.onpointercancel = () => { sx = null; swiped = true; };
    const onUi = e => {
      if (done || !c.live() || E.dragged?.()) return;
      const t = e.target;
      if (t.closest("[data-detail-back]")) return backDetail();
      if (t.closest("[data-objective]")) { goalOpen = !goalOpen; E.sfx("tap"); return hud(); }
      if (t.closest("[data-objects]")) { listOpen = !listOpen; mapOpen = false; return hud(); }
      if (t.closest("[data-scenes]")) { mapOpen = !mapOpen; listOpen = false; return hud(); }
      if (t.closest("[data-place-map]")) return showSpatialMap();
      const route = t.closest("[data-place-route]"); if (route) return onRoute(+route.dataset.placeRoute);
      const dest = t.closest("[data-place-to]"); if (dest) { const to = dest.dataset.placeTo; if (to === parentEdge()?.to) return up(); if (to === side(-1)) return nav(-1); if (to === side(1)) return nav(1); return; }
      const target = t.closest("[data-place-z]"); if (target) return onZone(+target.dataset.placeZ, $(".se-bgl.on [data-z='" + target.dataset.placeZ + "']"));
      const person = t.closest("[data-place-p]"); if (person) return onPerson(+person.dataset.placeP, $(".se-bgl.on [data-p='" + person.dataset.placeP + "']"));
      if (t.closest("[data-nav]")) return nav(+t.closest("[data-nav]").dataset.nav);
      if (t.closest("[data-up]")) return up();
      if (t.closest("[data-hint]")) return onHint();
      if (t.closest("[data-bag]")) { bagOpen = !bagOpen; E.sfx("tap"); return hud(); }
      if (t.closest("[data-unhold]")) { hold = null; msg = ""; E.sfx("tap"); return refreshHold(); }
      if (t.closest("[data-view]")) return hold && E.ui.itemView(hold);
      const it = t.closest("[data-it]"); if (it) { const id = it.dataset.it; if (!R.items.includes(id) || !S.items[id]) return; E.sfx("pick"); if (hold === id) return E.ui.itemView(id); hold = id; msg = ""; bagOpen = false; return refreshHold(); }
      if (t.closest("[data-ask-no]")) { ask = false; E.sfx("tap"); return hud(); }
      if (t.closest("[data-ask-yes]")) { if (P.leave === false && !needOk()) return; return finish(); }
      if (t.closest("[data-leave]")) { if (!needOk() && P.leave === false) return; if (!E.auto && (!needOk() || (allClues().length && found() < allClues().length))) { ask = true; E.sfx("tap"); return hud(); } return finish(); }
    };
    $(".se-ui").onclick = onUi; navEl().onclick = onUi;
    $(".se-ui").onpointerdown = E.dragger?.({
      src:"[data-it],[data-held-item]", dst:".se-bgl.on .pz[data-z]", ghostClass:"vale-item-ghost",
      ok:(el,event) => !(event.pointerType === 'touch' && el.matches('[data-it]') && el.closest('.se-bag,.pl-bag')) && !done && !viewBusy && c.live() && R.items.includes(el.dataset.it || el.dataset.heldItem),
      start:() => { $(".se")?.classList.add("item-dragging"); $$(".se-bgl.on .pz[data-z]").forEach(el => el.classList.add("aim")); },
      end:() => { $(".se")?.classList.remove("item-dragging"); refreshTargets(); },
      drop:(from,to) => { if (!to || done || !c.live()) return; hold = from.dataset.it || from.dataset.heldItem; msg = ""; bagOpen = false; onZone(+to.dataset.z, to); if (!done) refreshHold(); },
    });
    let rz = 0; const onResize = () => { clearTimeout(rz); rz = defer(() => { if (!done && !viewBusy) { const v = VIEW(), img = imgOf(v); E.ui.frame(img, [...(v.zones || []).map(z => E.regionOf(img, z.r)?.box), ...(v.people || []).map(pp => E.regionOf(img, pp.r)?.box)], { top: 64, bottom: 150 }); if (detail()) inspectLook(detail().box, 0, true); } }, 32); };
    addEventListener("resize", onResize);
    const ro = globalThis.ResizeObserver ? new ResizeObserver(onResize) : null; ro?.observe(stage);
    const navRO = globalThis.ResizeObserver ? new ResizeObserver(measureNav) : null; if (uiHost) navRO?.observe(uiHost);
    const offPlane = E.on("image-plane", img => { if (img === imgOf(VIEW())) onResize(); });
    const offAssist = E.on("exploreAssist", () => { if (!done && c.live()) hud(); });
    const onKey = e => { if (e.key === "Escape" && detail() && !$(".se-sheet.on")) { e.preventDefault(); backDetail(); } }; addEventListener("keydown", onKey);
    const un0 = unhook; unhook = () => { un0(); clearTimeout(rz); ro?.disconnect(); navRO?.disconnect(); offPlane?.(); offAssist?.(); removeEventListener("resize", onResize); removeEventListener("keydown", onKey); };

    // ── tự chơi: câu đố → dùng đồ → người chưa hỏi → vùng chưa xem → cận cảnh chưa vào → lùi → quay → lối ra / rời
    function spatialWorkAt(viewId) {
      if (!PS.vis[viewId]) return true;
      const v = P.views[viewId], st = E.state();
      if ((v.people || []).some(p => (!p.if || cond(p.if, st)) && !PS.n["auto:p:" + p.who])) return true;
      return (v.zones || []).some((z, i) => {
        const key = seenK(z, i, viewId);
        if (z.to || z.exit || z.if && !cond(z.if, st) || z.hide && cond(z.hide, st) || z.once && PS.seen[key] || z.take && (PS.took[z.take] || R.items.includes(z.take))) return false;
        if (z.widget) return !PS.solved[key] && (!z.need || cond(z.need, st));
        if (z.use && !PS.solved[key] && Object.keys(z.use).some(id => R.items.includes(id))) return true;
        return !PS.seen[key] && (PS.n["auto:" + key] || 0) < 2 && (!z.use || z.stuck || z.then);
      });
    }
    function nextSpatialEdge() {
      const queue = [{ view: PS.v, first: null }], seen = new Set([PS.v]);
      for (let at = 0; at < queue.length; at++) {
        const path = queue[at];
        for (const edge of spatialEdges(path.view)) {
          if (seen.has(edge.to)) continue;
          seen.add(edge.to);
          const first = path.first || edge;
          if (spatialWorkAt(edge.to)) return first;
          queue.push({ view: edge.to, first });
        }
      }
      return null;
    }
    let guard = 0;
    const autoStep = () => {
      if (done || !c.live()) return;
      if (spatial && viewBusy) { defer(() => E.autoRun(autoStep), 20); return; }
      if (detail()) { backDetail(); if (!done) defer(() => E.autoRun(autoStep), 5); return; }
      if (++guard > 120) { if (spatial) { console.warn("[story] spatial navigation guard reached", pid); return; } return finish(); }
      const L = () => $(".se-bgl.on .vbw.zones .vbx"), elOf = i => L()?.querySelector(`[data-z="${i}"]`);
      const zs = zones(), st = E.state();
      const w = zs.find(({ z, i }) => z.widget && !PS.solved[seenK(z, i)] && (!z.need || cond(z.need, st)));
      const u = zs.find(({ z, i }) => z.use && !PS.solved[seenK(z, i)] && Object.keys(z.use).some(it => R.items.includes(it)));
      const pp = people().find(({ p }) => !PS.n["auto:p:" + p.who]);
      const nz = zs.find(({ z, i }) => !PS.seen[seenK(z, i)] && !z.exit && !z.to && !z.widget && (PS.n["auto:" + seenK(z, i)] || 0) < 2 && (!z.use || z.stuck || z.then));
      const tz = (spatial ? shownZones() : zs).find(({ z }) => z.to && !PS.vis[z.to] && (!z.need || cond(z.need, st)));
      const nv = [side(-1), side(1)].find(v => v && !PS.vis[v]) || ring.find(v => !PS.vis[v]);
      const ex = zs.find(({ z }) => z.exit);
      if (w) { const impl = WG[w.z.widget.type]; impl?.tap ? impl.tap(w.z, w.z.widget, api(w.z, w.i)) : (impl?.auto || ((a, b, c2, x) => x.ok()))(elOf(w.i), w.z, w.z.widget, api(w.z, w.i)); }
      else if (u) { hold = Object.keys(u.z.use).find(it => R.items.includes(it)); onZone(u.i, elOf(u.i)); }
      else if (pp) { PS.n["auto:p:" + pp.p.who] = 1; onPerson(pp.i, null); }
      else if (nz) { const k = "auto:" + seenK(nz.z, nz.i); PS.n[k] = (PS.n[k] || 0) + 1; onZone(nz.i, elOf(nz.i)); }
      else if (tz) onZone(tz.i, elOf(tz.i));
      else if (spatial) {
        const edge = nextSpatialEdge();
        if (edge?.type === "zone") onZone(edge.i, elOf(edge.i));
        else if (edge?.type === "route") onRoute(edge.i);
        else if (edge?.type === "turn") nav(edge.d);
        else if (edge?.type === "up") up();
        else if (ex && needOk()) onZone(ex.i, elOf(ex.i));
        else if (P.leave !== false || needOk()) finish();
        else { console.warn("[story] spatial place has no reachable unfinished action", pid); return; }
      }
      else if (parentEdge()) up();
      else if (nv) goView(nv, "cut");
      else if (!needOk() && typeof P.need === "function") { const vv = Object.keys(P.views).find(k => (P.views[k].people || []).some(p => !PS.n["auto:p:" + p.who])); if (vv && vv !== PS.v) goView(vv, "cut"); else finish(); }
      else if (ex && needOk()) onZone(ex.i, elOf(ex.i));
      else finish();
      if (!done) defer(() => E.autoRun(autoStep), 5);
    };
    E.autoRun(autoStep);
  }));
  // nút quay / lùi nằm GIỮA màn (ngoài bảng dưới)
  const navEl = () => { let n = $(".se-plnav"); if (!n) { n = h(`<div class="se-plnav"></div>`); $(".se")?.appendChild(n); } return n; };
  // bảng bước dùng chung cho địa điểm: “đã xem rồi”, vật vừa nhặt hiện ra
  def("reveal", async ({ st }) => { const R = E.R(), id = typeof st.reveal === "string" ? st.reveal : R.reveal; R.reveal = null; if (id) { E.ui.hideBox(); await E.ui.reveal(id, { fresh: st.reveal === 1 || st.reveal === true, from: E._zoneRect }); E._zoneRect = null; } });
  E.on("boot", S => { S.__seen = [{ think: { en: "You've already looked at that.", vi: "Chỗ này bạn xem rồi." } }]; S.__take = [{ reveal: 1 }]; });
  E.on("chapter", () => { const S = E.S(); S.__seen ||= [{ think: { en: "You've already looked at that.", vi: "Chỗ này bạn xem rồi." } }]; S.__take ||= [{ reveal: 1 }]; });


  // ═════════ HỎI CHUYỆN ═════════
  def("talk", c => new Promise(res => {
    c.resumeHere?.();
    let done = false; c.onExit?.(() => { done = true; });
    const S = E.S(), R = E.R();
    const ref = typeof c.st.talk === "string" ? c.st.talk : null;
    const K = ref ? S.talks?.[ref] : c.st.talk;
    if (!K) { console.warn("[story] talk không có", c.st.talk); return res(); }
    const who = K.with, ch = S.chars[who] || {}, tid = ref || K.id || who;
    const run = keys => (ref ? R.stack.push({ n: "@talks", p: [ref, ...keys], i: 0 }) : c.push("talk", ...keys));
    const askedK = (t, i) => `tk:${tid}:${t.id || i}`;
    // xuất hiện: đứng giữa, đúng biểu cảm
    if (!R.cast[who]) E.ui.show(who, "c", K.face || "");
    R.used["tkh:" + who] = 1;
    // lần đầu: chào hỏi
    if (K.hello && !R.used[`tk:${tid}:hello`]) { R.used[`tk:${tid}:hello`] = 1; c.again(); run(["hello"]); return res(); }
    const s = E.state();
    const list = (K.topics || []).map((t, i) => ({ t, i })).filter(({ t }) => !t.if || cond(t.if, s));
    const usable = ({ t, i }) => !(t.once !== false && R.used[askedK(t, i)]) && (!t.need || cond(t.need, s));
    const shown = list.filter(x => usable(x) || R.used[askedK(x.t, x.i)]);
    const showKeys = Object.keys(K.show || {});
    const contextual = K.contextInventory ?? S.contextInventory;
    // A person uses the same whole-location candidates as the surrounding
    // views. Wrong guesses remain available and use authored feedback.
    const location = K.location ? E.enterLocation(K.location) : E.currentLocation();
    const ownedRecords = () => (contextual ? E.contextItems(location) : R.items.filter(E.itemLive)).filter(id => S.items[id]).slice().reverse();
    const canShow = showKeys.length && ownedRecords().length;
    const guidedRecords = S.recordPresentation === "compact";
    const recordState = guidedRecords ? ((R.talkUI ||= {})[tid] ||= {query:"",category:"all"}) : null;
    let picking = false, preview = null, query = recordState?.query || "", category = recordState?.category || "all";
    const fold = value => String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");
    const both = value => typeof value === "string" ? value : Object.values(value || {}).filter(v => typeof v === "string").join(" ");
    const recordGroup = id => E.evidenceMeta?.(id)?.group || ((S.items[id].recordType || S.items[id].kind) === "testimony" ? "testimony" : "objects");
    const filterRecords = () => {
      let count = 0; const words = fold(query).trim().split(/\s+/).filter(Boolean);
      $$(".tk-pick [data-show]").forEach(el => { const id=el.dataset.show,it=S.items[id],search=fold(E.recordSearchText?.(id)||both(it?.name)+" "+both(it?.desc)); el.hidden=!(category==="all"||recordGroup(id)===category)||!words.every(w=>search.includes(w));if(!el.hidden)count++; });
      const status=$(".tk-pick [data-talk-count]");if(status)status.textContent=count?T(`${count} records · tap one to review before showing it.`,`${count} hồ sơ · chạm để xem trước khi đưa.`):T("No matching records. Clear the search or choose All.","Không tìm thấy hồ sơ. Xóa từ tìm hoặc chọn Tất cả.");
      if(recordState){recordState.query=query;recordState.category=category;}
    };
    const picker = () => {
      if (!guidedRecords) return `<small>${esc(T("Show them…", "Đưa cho xem…"))}</small><div class="se-bag">${ownedRecords().map(id => `<button class="se-bi" data-show="${id}">${E.itemArt(id,"sm")}<small>${investigationText(S.items[id].name)}</small></button>`).join("")}</div><button class="se-btn wide" data-unpick>${esc(T("Never mind", "Thôi"))}</button>`;
      if (preview && ownedRecords().includes(preview)) { const it=S.items[preview]; return `<div class="v93-record-preview"><div class="v93-record-preview-head">${E.itemArt(preview,"md")}<b>${investigationText(it.name)}</b></div><div class="v93-record-preview-text">${investigationText(it.desc)}</div><button class="se-btn" data-talk-details="${esc(preview)}">${esc(T("Open complete record", "Mở hồ sơ đầy đủ"))}</button><div class="se-row"><button class="se-btn" data-talk-back>${esc(T("Back to records", "Về danh sách"))}</button><button class="se-btn pri" data-confirm-show="${esc(preview)}">${esc(T("Show to ", "Đưa cho ")+E.cname(ch,true)+T("", " xem"))}</button></div></div>`; }
      return `<p class="v93-record-purpose">${esc(T("Choose a record to discuss with ","Chọn hồ sơ muốn hỏi ")+E.cname(ch,true)+T(". You can read it before showing it.",". Bạn có thể xem nội dung trước khi đưa."))}</p><label class="v93-record-search"><span>${esc(T("Find a record", "Tìm hồ sơ"))}</span><input class="se-in" type="search" data-talk-search value="${esc(query)}" placeholder="${esc(T("Name or description", "Tên hoặc nội dung"))}" autocomplete="off"></label><div class="v93-record-filters">${[["all",T("All","Tất cả")],["objects",T("Objects & traces","Đồ vật / dấu vết")],["testimony",T("Statements","Lời khai")]].map(([id,label])=>`<button class="se-btn sm${category===id?" on":""}" data-talk-filter="${id}" aria-pressed="${category===id}">${esc(label)}</button>`).join("")}</div><small data-talk-count role="status"></small><div class="v93-record-list">${ownedRecords().map(id=>{const it=S.items[id];return `<button class="v93-record-card" data-show="${esc(id)}">${E.itemArt(id,"sm")}<span><b>${investigationText(it.name)}</b><small>${investigationText(it.brief||it.desc)}</small></span></button>`;}).join("")}</div><button class="se-btn wide" data-unpick>${esc(T("Back to questions", "Trở lại hỏi chuyện"))}</button>`;
    };
    // không còn gì để hỏi / đưa → không mở bảng hỏi, người đó lui ra (cảnh chỉ có lời chào)
    if (!shown.length && !canShow) { if (K.bye && R.used[`tk:${tid}:hello`] && !R.used[`tk:${tid}:bye`]) { R.used[`tk:${tid}:bye`] = 1; run(["bye"]); } E.ui.hide(who); return res(); }
    const draw = () => {
      const lastLine = R.last && R.last.who === who ? R.last : null;
      E.ui.panel(`<div class="tk-h" style="--c:${ch.color || "#aaa"}"><b>${esc(E.cname(ch, true))}</b>${K.prompt ? `<span>${investigationText(K.prompt)}</span>` : ""}</div>
        ${picking ? `<div class="tk-pick">${picker()}</div>`
        : `<div class="tk-l">${shown.map(({ t, i }) => { const a = R.used[askedK(t, i)], u = usable({ t, i }); return `<button class="tk-t${a ? " asked" : ""}${!a && !R.used["tks:" + askedK(t, i)] ? " fresh" : ""}" data-t="${i}" ${u ? "" : "disabled"}><span>${investigationText(t.label)}</span>${a ? `<em>✓</em>` : t.cost ? `<em class="tk-c">${t.cost}′</em>` : ""}</button>`; }).join("")}</div>
        <div class="se-row tk-f">${canShow ? `<button class="se-btn" data-pick>${E.ICON.box}<span>${esc(T("Show something", "Đưa đồ cho xem"))}</span></button>` : ""}<button class="se-btn pri" data-bye>${K.byeLabel ? investigationText(K.byeLabel) : esc(T("Leave", "Rời đi"))}</button></div>`}`, "tk");
      shown.forEach(({ t, i }) => (R.used["tks:" + askedK(t, i)] = 1));
      const input=$(".tk-pick [data-talk-search]");if(input)input.oninput=e=>{query=e.target.value;filterRecords();};if(picking&&!preview)filterRecords();
    };
    const finish = keys => { if (done || !c.live()) return; done = true; E.ui.clear(); if (keys) { if (keys !== "bye-only") run(keys); } res(); };
    E.ui.hideBox();
    draw();
    $(".se-ui").onclick = e => {
      if (done || !c.live()) return;
      const t = e.target;
      if (t.closest("[data-pick]")) { picking = true; preview = null; E.sfx("tap"); return draw(); }
      if (t.closest("[data-unpick]")) { picking = false; preview = null; E.sfx("tap"); return draw(); }
      if (t.closest("[data-talk-back]")) { preview = null; return draw(); }
      const filter=t.closest("[data-talk-filter]");if(filter){category=filter.dataset.talkFilter;return draw();}
      const info=t.closest("[data-talk-details]");if(info){E.hush();return E.ui.itemView(info.dataset.talkDetails);}
      const sh = t.closest("[data-show]");
      if (sh && guidedRecords) { preview=sh.dataset.show;E.sfx("tap");draw();$(".v93-record-preview")?.scrollIntoView({block:"nearest",behavior:"instant"});return; }
      const confirm=t.closest("[data-confirm-show]");
      if (sh || confirm) { const id = confirm?.dataset.confirmShow || sh.dataset.show; if(!ownedRecords().includes(id))return; const k = K.show[id] ? id : K.show["*"] ? "*" : null; E.sfx("pick"); E._zoneRect = null; c.again(); if (k) run(["show", k]); return finish(); }
      const b = t.closest("[data-t]");
      if (b && !b.disabled) { const i = +b.dataset.t, tp = K.topics[i]; R.used[askedK(tp, i)] = 1; E.sfx("pick"); if (tp.cost) E.time.add(tp.cost); if (!tp.end) c.again(); else E.ui.hide(who); run(["topics", i, "then"]); return finish(); }
      if (t.closest("[data-bye]")) { E.sfx("tap"); if (K.bye) run(["bye"]); if (!K.stay) E.ui.hide(who); return finish(); }
    };
    E.autoRun(() => {
      if (done || !c.live()) return;
      const nx = list.find(usable);
      if (nx) { R.used[askedK(nx.t, nx.i)] = 1; if (!nx.t.end) c.again(); run(["topics", nx.i, "then"]); return finish(); }
      if (canShow && !R.used[`tk:${tid}:autoshow`]) { R.used[`tk:${tid}:autoshow`] = 1; const records = ownedRecords(); const id = records.find(x => K.show[x]) || (K.show["*"] ? records[0] : null); if (id) { c.again(); run(["show", K.show[id] ? id : "*"]); return finish(); } }
      if (K.bye) run(["bye"]); E.ui.hide(who); finish();
    });
  }));
})();
