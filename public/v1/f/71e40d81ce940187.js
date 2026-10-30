// Enmi Story Engine 3 — ĐỊA ĐIỂM kiểu Rusty Lake + HỎI CHUYỆN tự chọn + ĐỒNG HỒ (nạp sau stage.js).
//
// { place: { id, name, goal, start, ring: [view…], views: { <view>: VIEW }, need, until, done, leave, by, late } }   hoặc { place: "<mã>" } → story.places.<mã>
//   VIEW  = { img: "<ảnh>" | s => "<ảnh>", up: "<view cha>" (= cận cảnh, có nút ▼), regions: { <vùng>: [x, y, w, h] }, zones: [ZONE], people: [PERSON], amb,
//             left / right: "<view>" | { to, need, if, cost } = chỗ lân cận bấm ◀ ▶ (quầy bar → sân sau → bốt điện thoại; null = không đi được) — không ghi = theo vòng ring,
//             name + loc: true = đổi tới view này thì viên trạng thái hiện tên chỗ mới,
//             fg: true | "<ảnh>" = lớp TIỀN CẢNH trong suốt (<ảnh>-fg) đè lên người / đồ (quầy che trước người đứng sau), fgZ }
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

  def("place", c => new Promise(res0 => {
    const S = E.S(), R = E.R();
    const ref = typeof c.st.place === "string" ? c.st.place : null;
    const P = ref ? S.places?.[ref] : c.st.place;
    if (!P) { console.warn("[story] place không có", c.st.place); return res0(); }
    const pid = P.id || ref || c.key();
    const PS = ((R.pl ||= {})[pid] ||= { v: P.start || Object.keys(P.views)[0], seen: {}, took: {}, vis: {}, hint: 0, solved: {}, n: {} });
    let done = false;
    const stage = $(".se-stage");
    let unhook = () => { stage.onclick = stage.onpointerdown = stage.onpointerup = null; navEl().innerHTML = ""; };
    const res = () => { done = true; unhook(); res0(); };
    // chạy mảng bước con của địa điểm (khai báo tại chỗ → theo đường dẫn bước; story.places → node "@places")
    const run = keys => (ref ? R.stack.push({ n: "@places", p: [ref, ...keys], i: 0 }) : c.push("place", ...keys));
    const ring = P.ring || Object.keys(P.views).filter(k => !P.views[k].up);
    if (PS.by == null && P.by && R.clock) PS.by = E.time.abs(P.by);
    const VIEW = () => P.views[PS.v] || P.views[ring[0]];
    // ảnh của view · nhặt đồ xong → ảnh nền “đã nhặt” <ảnh>--<vùng> (gen-art tự sinh bằng Qwen-Edit xoá vật đó khỏi chính ảnh gốc → luôn khớp)
    const imgOf = v => {
      const base = (typeof v.img === "function" ? v.img(E.state()) : v.img) || PS.v;
      const tk = (v.zones || []).filter(z => z.take && z.art === false && typeof z.r === "string" && (PS.took[z.take] || R.items.includes(z.take))).map(z => base + "--" + z.r).find(n => E.artReal("im-" + n));
      return tk || base;
    };
    const zid = (z, i) => z.id || String(i);
    const seenK = (z, i, v = PS.v) => v + "/" + zid(z, i);
    const zones = () => (VIEW().zones || []).map((z, i) => ({ z, i })).filter(({ z, i }) => (!z.if || cond(z.if, E.state())) && !(z.hide && cond(z.hide, E.state())) && !(z.take && (PS.took[z.take] || R.items.includes(z.take))) && !(z.once && PS.seen[seenK(z, i)]));
    const people = () => (VIEW().people || []).map((p, i) => ({ p, i })).filter(({ p }) => !p.if || cond(p.if, E.state()));
    // manh mối: vùng clue của mọi view
    const allClues = () => Object.entries(P.views).flatMap(([vk, v]) => (v.zones || []).map((z, i) => ({ vk, z, i })).filter(x => x.z.clue && (!x.z.if || cond(x.z.if, E.state()))));
    const found = () => allClues().filter(x => PS.seen[seenK(x.z, x.i, x.vk)]).length;
    // need: số manh mối · [mã vùng] · hàm điều kiện s => … (vd. đã nói chuyện đủ người) — progress: s => [đã, tổng] cho thanh dưới
    const needN = () => Array.isArray(P.need) ? P.need.length : typeof P.need === "function" ? 0 : Math.min(P.need ?? 0, allClues().length);
    const needOk = () => Array.isArray(P.need) ? P.need.every(id => Object.keys(PS.seen).some(k => k.endsWith("/" + id))) : typeof P.need === "function" ? !!P.need(E.state()) : found() >= needN();
    let hold = null, bagOpen = false, msg = "", ask = false;

    // ── ảnh nền của view (tr: kiểu chuyển)
    const paint = (tr = "cut", o = {}) => {
      const v = VIEW(), img = imgOf(v);
      if (v.regions) E.regions({ [img]: { r: v.regions, ...(v.size ? { size: v.size } : {}) } });
      const has = E.hasArt("im-" + img);
      const changed = E.ui.layer("v:" + img, `<div class="ph vph"><b>${esc(nat(v.name) || PS.v)}</b></div>${has ? `<div class="ii im-${esc(img)}"></div>` : ""}${E.vbox(img, E.fxHtml(img) + E.wireHtml(img, !has || E.wire), "deco")}${E.vbox(img, "", "zones")}`, { tr, ...o });
      PS.vis[PS.v] = 1;
      // mọi vùng chạm + người của view nằm trong phần màn thấy được (điện thoại dài / máy tính bảng / máy tính)
      E.ui.frame(img, [...(v.zones || []).map(z => E.regionOf(img, z.r)?.box), ...(v.people || []).map(pp => E.regionOf(img, pp.r)?.box)], { top: 64, bottom: 130 });
      if (v.amb) E.amb(v.amb);
      R.vw = { pid, v: PS.v };
      return changed;
    };
    // ── vùng + người (trong khung ảnh → khớp ảnh khi màn dài / ngắn) + nút quay / lùi + thanh dưới
    const draw = () => {
      if (done) return;
      const v = VIEW(), img = imgOf(v), L = $(".se-bgl.on .vbw.zones .vbx");
      if (L) {
        const lt = v.light || P.light || E.S().light;
        L.style.setProperty("--vf", lt ? `brightness(${lt.b ?? 1}) saturate(${lt.s ?? 1}) sepia(${lt.warm ?? 0}) hue-rotate(${lt.cool ? -(lt.cool * 25) : 0}deg)` : "none");
        L.innerHTML = zones().map(({ z, i }, k) => {
          const r = E.regionOf(img, z.r); if (!r) { console.warn("[story] place: vùng không có", z.r, "trên", img); return ""; }
          const sk = seenK(z, i), sn = PS.seen[sk], w = z.widget, inl = w && WG[w.type]?.html && !PS.solved[sk];
          // ĐỒ VẬT GHÉP LÊN ẢNH (art): ảnh PNG riêng đặt đúng khung vùng → vật và chỗ chạm luôn trùng nhau, dù ảnh nền AI vẽ lệch
          // vật GHÉP lên nền (người dùng 30/10: “nổi lên tí cũng không sao, chủ yếu bố cục ổn”): art = ảnh PNG; nhặt được (take) có it-<đồ> → tự ghép.
          //   art: false = vật đã VẼ SẴN trong nền (nhặt xong engine đổi sang ảnh “đã nhặt” <ảnh>--<vùng>)
          const art = typeof z.art === "string" ? z.art : z.take && z.art !== false && E.artReal("im-it-" + z.take) ? "it-" + z.take : "";
          return `<button class="pz${sn ? " seen" : ""}${hold ? " aim" : ""}${(r.shape || z.shape) === "ellipse" ? " el" : ""}${z.glint === false || sn ? " ng" : ""}${z.exit ? " ex" : ""}${inl ? " wg" : ""}${art ? " ha" : ""}" data-z="${i}" style="${E.pctStyle(r.box)};z-index:${z.z ?? 2};--gd:${(0.8 + k * 2.1 + (E.hash(zid(z, i) + img) % 30) / 10).toFixed(1)}s" aria-label="${esc(nat(z.label) || zid(z, i))}">${art ? `<i class="pz-sh"></i><i class="pz-art ii im-${esc(art)}"${z.artRot ? ` style="transform:rotate(${z.artRot}deg)"` : ""}></i>` : ""}${inl ? `<div class="wg">${WG[w.type].html(z, w)}</div>` : ""}<span class="pz-l">${esc(nat(z.label) || "")}</span>${z.exit ? `<em class="pz-x">${E.ICON.right}</em>` : ""}</button>`;
        }).join("") + people().map(({ p, i }) => {
          let r = E.regionOf(img, p.r) || { box: [30, 38, 40, 62] }, ch = S.chars[p.who] || {}, face = p.face ? `im-${p.who}-${p.face}` : "";
          // ảnh TOÀN THÂN (đầu tới chân) theo dáng: <mã>-full-<pose> → <mã>-full → ảnh nửa người cũ
          const full = [p.pose && `im-${p.who}-full-${p.pose}`, `im-${p.who}-full`].find(x => x && E.hasArt(x) && E.artReal?.(x));
          // chưa có ảnh toàn thân → ảnh NỬA NGƯỜI: kéo khung xuống CHẠM ĐÁY ảnh + mờ dần mép dưới → không lộ đường cắt ngang thân giữa cảnh
          if (!full) { const bx = r.box; r = { ...r, box: [bx[0], bx[1], bx[2], 100 - bx[1]] }; }
          const fresh = !R.used["tkh:" + p.who];
          return `<button class="pp${fresh ? " new" : ""}${full ? " full" : " half"}" data-p="${i}" style="${E.pctStyle(r.box)};z-index:${p.z ?? 3};--c:${ch.color || "#aaa"}"><div class="pp-i${full ? " full" : ""}"><div class="ph">${SIL(ch.color || "#aaa")}</div>${full ? `<div class="ii ${full}"></div>` : `<div class="ii im-${p.who}"></div>${face && E.hasArt(face) ? `<div class="ii ${face}"></div>` : ""}`}</div><span class="pp-n">${E.ICON.talk}<b>${esc(E.known(p.who) ? E.cname(ch, true) : (nat(ch.hint) || "").replace(/[.。]$/, "") || E.cname(ch, true))}</b></span></button>`;
        }).join("") + (v.fg ? `<i class="vfg ii im-${esc(typeof v.fg === "string" ? v.fg : img + "-fg")}" style="z-index:${v.fgZ ?? 5}"></i>` : "");
        for (const { z, i } of zones()) { const w = z.widget; if (w && WG[w.type]?.bind && !PS.solved[seenK(z, i)]) { const el = L.querySelector(`[data-z="${i}"] .wg`); if (el) WG[w.type].bind(el, z, w, api(z, i)); } }
      }
      const nb = side(-1), nb2 = side(1);
      navEl().innerHTML = `${nb || nb2 ? `${nb ? `<button class="pl-ar l" data-nav="-1" aria-label="${esc(T("Turn left", "Quay trái"))}">${E.ICON.left}</button>` : ""}${nb2 ? `<button class="pl-ar r" data-nav="1" aria-label="${esc(T("Turn right", "Quay phải"))}">${E.ICON.right}</button>` : ""}` : ""}${v.up ? `<button class="pl-back" data-up aria-label="${esc(T("Step back", "Lùi lại"))}">${E.ICON.down}</button>` : ""}`;
      hud();
    };
    const hud = () => {
      if (done) return;
      const pg = P.progress?.(E.state()), tot = pg ? pg[1] : allClues().length, n = pg ? pg[0] : found(), ok = needOk() || P.leave === true, it = hold && S.items[hold];
      const items = R.items.filter(id => id === hold || E.itemLive(id));
      const short = typeof P.need === "function" ? (needOk() ? 0 : Math.max(1, tot - n)) : Math.max(0, needN() - n);
      const askHtml = ask ? `<div class="pl-ask"><b>${esc(short ? T(`Find ${short} more clue${short > 1 ? "s" : ""} first?`, `Còn thiếu ${short} manh mối.`) : T(`${tot - n} place${tot - n > 1 ? "s" : ""} not checked yet.`, `Còn ${tot - n} chỗ chưa xem.`))}</b><p>${esc(T("Missing clues can make your deductions wrong. Leave anyway?", "Thiếu manh mối có thể khiến bạn suy luận sai. Vẫn rời đi?"))}</p><div class="se-row"><button class="se-btn" data-ask-no>${esc(T("Keep looking", "Xem tiếp"))}</button><button class="se-btn pri" data-ask-yes>${esc(T("Leave", "Vẫn rời đi"))}</button></div></div>` : "";
      const holdHtml = it ? `<div class="pl-hold"><span class="pl-hia" data-view>${E.itemArt(hold, "sm")}</span><span><b>${esc(nat(it.name))}</b><small>${esc(T("Tap where to use it", "Chạm chỗ muốn dùng"))}</small></span><button class="se-ib sm" data-unhold aria-label="${esc(T("Put away", "Cất đi"))}">${E.ICON.x}</button></div>` : "";
      const bag = bagOpen && items.length ? `<div class="pl-bag">${items.map(id => `<button class="se-bi${hold === id ? " on" : ""}" data-it="${id}" aria-label="${esc(nat(S.items[id]?.name))}">${E.itemArt(id, "sm")}</button>`).join("")}</div>` : "";
      E.ui.panel(`${askHtml || `${msg ? `<div class="pl-msg">${msg}</div>` : ""}${holdHtml}${bag}
        <div class="pl-bar"><div class="pl-goal"><span>${esc(nat(P.goal) || nat(P.name) || "")}</span>${tot ? `<b>${n}/${tot}</b>` : ""}</div>
          <button class="pl-ib" data-hint aria-label="${esc(T("Hint", "Gợi ý"))}">${E.ICON.hint}</button>
          ${items.length ? `<button class="pl-ib${bagOpen ? " on" : ""}${hold ? " hold" : ""}" data-bag aria-label="${esc(T("Bag", "Túi đồ"))}">${E.ICON.box}<i>${items.length}</i></button>` : ""}
          ${P.leave === false && !ok ? "" : `<button class="se-btn pri pl-go${ok ? "" : " dim"}" data-leave>${esc(nat(P.done) || T("Leave", "Rời đi"))}</button>`}</div>`}`, "pl");
    };
    const api = (z, i) => ({
      ok: () => { const k = seenK(z, i); PS.solved[k] = 1; PS.seen[k] = 1; E.ui.fx("solve"); if (z.widget.ok) { leaveUI(); c.again(); run(["views", PS.v, "zones", i, "widget", "ok"]); res(); } else draw(); },
      redraw: repaint => { if (repaint) paint("still", { force: true }); draw(); },
    });
    // dọn giao diện địa điểm trước khi chạy bước con
    const leaveUI = () => { const L = $(".se-bgl.on .vbw.zones .vbx"); if (L) L.innerHTML = ""; navEl().innerHTML = ""; E.ui.clear(); };
    const finish = () => { if (done) return; leaveUI(); E.ui.look(null, 400); R.vw = null; res(); };
    const rectOf = el => { const b = el?.getBoundingClientRect?.(); return b ? { x: b.left, y: b.top, w: b.width, h: b.height } : null; };
    const late = () => { if (PS.by != null && !PS.lateDone && E.time.now() >= PS.by && P.late) { PS.lateDone = 1; finish(); run(["late"]); return true; } return false; };
    const spend = min => { if (min) E.time.add(min, PS.by); };

    const goView = (to, tr, o) => { PS.v = to; hold = null; bagOpen = false; msg = ""; ask = false; paint(tr, o); draw(); E.sfx(tr === "zin" ? "whoosh" : tr === "zout" ? "whoosh" : "steps"); E.haptic("LIGHT"); };
    // view bên trái / phải: view.left / view.right (địa điểm lân cận, có thể khoá bằng need) → không có thì theo vòng ring
    function side(d) {
      const v = VIEW(), k = d < 0 ? "left" : "right", x = v[k];
      if (x !== undefined) { const to = typeof x === "string" ? x : x?.to; return to && P.views[to] && (!x.need || cond(x.need, E.state())) && (!x.if || cond(x.if, E.state())) ? to : null; }
      const i = ring.indexOf(PS.v); if (i < 0 || ring.length < 2) return null;
      return ring[(i + d + ring.length) % ring.length];
    }
    const nav = d => { const to = side(d); if (!to) return; const x = VIEW()[d < 0 ? "left" : "right"]; if (x?.cost) spend(x.cost); goView(to, d > 0 ? "sl-r" : "sl-l"); const nv = P.views[to]; if (nv.name && (x || nv.loc)) E.ui.loc?.(nat(nv.name), R.clock?.t || ""); };
    const up = () => { const v = VIEW(); if (v.up) goView(v.up, "zout"); };
    // chạy bước con của 1 vùng: thu giao diện, máy quay nhìn vào vùng, xong bước con thì địa điểm vẽ lại (again)
    const go = (keys, z) => { leaveUI(); c.again(); if (z && z.look !== false) E.ui.look(z.r, 900); run(keys); res(); };

    const onZone = (i, el) => {
      const z = VIEW().zones[i], k = seenK(z, i), st = E.state();
      E._zoneRect = rectOf(el);
      const base = ["views", PS.v, "zones", i];
      // cầm đồ → dùng lên vùng
      if (hold) {
        const it = hold;
        if (z.use?.[it]) { hold = null; PS.seen[k] = 1; PS.solved[k] = 1; spend(z.cost); return go([...base, "use", it], z); }
        E.sfx("wrong"); E.haptic("LIGHT"); el?.classList.add("no"); setTimeout(() => el?.classList.remove("no"), 400);
        msg = esc(nat(z.noUse || P.noUse || { en: "That doesn't help here.", vi: "Món này không dùng được ở đây." })); return hud();
      }
      // chưa đủ điều kiện
      if (z.need && !cond(z.need, st)) {
        if (z.stuck) { PS.n[k] = (PS.n[k] || 0) + 1; return go([...base, "stuck"], z); }
        E.sfx("wrong"); msg = esc(nat(z.lock || { en: "Not yet.", vi: "Chưa được." })); return hud();
      }
      // câu đố trên cảnh
      const w = z.widget;
      if (w && !PS.solved[k]) { if (WG[w.type]?.tap) return WG[w.type].tap(z, w, api(z, i)); if (w.then && !PS.seen[k]) { PS.seen[k] = 1; return go([...base, "widget", "then"], z); } return; }
      // sang view khác / cận cảnh: phóng vào từ đúng chỗ chạm
      if (z.to) {
        PS.seen[k] = 1; spend(z.cost);
        const b = el?.getBoundingClientRect?.(), sr = stage.getBoundingClientRect();
        const o = b ? { ox: ((b.left + b.width / 2 - sr.left) / sr.width * 100).toFixed(1), oy: ((b.top + b.height / 2 - sr.top) / sr.height * 100).toFixed(1) } : {};
        if (z.then && !PS.n["to:" + k]) { PS.n["to:" + k] = 1; }
        return goView(z.to, P.views[z.to]?.up ? "zin" : "still", o);
      }
      if (z.exit) { if (!needOk() && P.leave !== true) { ask = true; return hud(); } PS.seen[k] = 1; finish(); if (z.then) run([...base, "then"]); return; }
      // nhặt đồ: vào túi ngay (an toàn khi tải lại) → vật bay ra từ chỗ nó nằm → bước then
      if (z.take) {
        PS.took[z.take] = 1; PS.seen[k] = 1; spend(z.cost);
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
      if (!keys) { if (!solved) { msg = esc(nat(z.lock || { en: "You'll need something for this.", vi: "Cần thứ gì đó cho chỗ này." })); E.sfx("wrong"); } return draw(); }
      if (keys === "seen") { leaveUI(); c.again(); if (z.look !== false) E.ui.look(z.r, 700); R.stack.push({ n: "@__seen", p: [], i: 0 }); return res(); }
      go([...base, ...keys], z);
    };
    const onPerson = (i, el) => { E._zoneRect = rectOf(el); leaveUI(); c.again(); run(["views", PS.v, "people", i, "go"]); res(); };
    // GỢI Ý 3 MỨC: 1 = mọi chỗ chưa xem loé cùng lúc · 2 = hiện tên các chỗ đó · 3 = chỉ đúng 1 chỗ nên làm + lời gợi ý (zone.hint)
    const onHint = () => {
      PS.hint = (PS.hint || 0) + 1; E.sfx("tap");
      const L = $(".se-bgl.on .vbw.zones .vbx"); if (!L) return;
      const lvl = ((PS.hint - 1) % 3) + 1;
      L.classList.remove("hint1", "hint2", "hint3"); $$(".pz.pick", L).forEach(x => x.classList.remove("pick")); void L.offsetWidth; L.classList.add("hint" + lvl);
      setTimeout(() => L.classList.remove("hint1", "hint2"), 3400);
      msg = "";
      if (lvl === 3) {
        const nx = zones().find(({ z, i }) => (z.clue || z.use || z.widget || z.to || z.take) && !PS.seen[seenK(z, i)]);
        if (nx) { L.querySelector(`[data-z="${nx.i}"]`)?.classList.add("pick"); msg = esc(nat(nx.z.hint || nx.z.label) || T("Look here.", "Xem chỗ này.")); }
        else msg = esc(ring.length > 1 || VIEW().up ? T("Nothing more here. Try somewhere else.", "Chỗ này hết rồi. Thử chỗ khác xem.") : T("You've seen everything here.", "Bạn đã xem hết chỗ này."));
      } else msg = esc(lvl === 1 ? T("Look for the shimmer.", "Để ý chỗ loé sáng.") : T("Places you haven't checked.", "Những chỗ bạn chưa xem."));
      hud();
    };

    // ── vào / quay lại sau bước con
    if (late()) return;
    if (P.until && cond(P.until, E.state())) return finish();
    E.ui.hideBox(); E.ui.hide("*"); E.ui.look(null, 0, true);
    const first = !PS.entered; PS.entered = 1;
    const changed = paint(first ? "" : "still");
    if (first && P.name) E.ui.loc?.(nat(P.name), R.clock ? R.clock.t : "");
    if (changed && first && !E.auto) setTimeout(draw, 450); else draw();

    stage.onclick = e => {
      if (done) return;
      if (e.target.closest(".wg canvas, .wg-dial")) return;
      const z = e.target.closest(".pz[data-z]"); if (z) { E.sfx("tap"); return onZone(+z.dataset.z, z); }
      const p = e.target.closest(".pp[data-p]"); if (p) { E.sfx("tap"); return onPerson(+p.dataset.p, p); }
      // chạm chỗ trống khi đang cầm đồ → cất đồ
      if (hold) { hold = null; msg = ""; draw(); }
    };
    // vuốt ngang = quay trái / phải · vuốt xuống ở cận cảnh = lùi
    let sx = null;
    stage.onpointerdown = e => { if (e.target.closest(".wg")) return; sx = [e.clientX, e.clientY]; };
    stage.onpointerup = e => { if (!sx || done) return; const dx = e.clientX - sx[0], dy = e.clientY - sx[1]; sx = null; if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5 && side(dx < 0 ? 1 : -1)) nav(dx < 0 ? 1 : -1); else if (dy > 90 && Math.abs(dy) > Math.abs(dx) * 1.5 && VIEW().up) up(); };
    const onUi = e => {
      if (done) return;
      const t = e.target;
      if (t.closest("[data-nav]")) return nav(+t.closest("[data-nav]").dataset.nav);
      if (t.closest("[data-up]")) return up();
      if (t.closest("[data-hint]")) return onHint();
      if (t.closest("[data-bag]")) { bagOpen = !bagOpen; E.sfx("tap"); return hud(); }
      if (t.closest("[data-unhold]")) { hold = null; msg = ""; E.sfx("tap"); return draw(); }
      if (t.closest("[data-view]")) return hold && E.ui.itemView(hold);
      const it = t.closest("[data-it]"); if (it) { const id = it.dataset.it; E.sfx("pick"); if (hold === id) return E.ui.itemView(id); hold = id; msg = ""; bagOpen = false; return draw(); }
      if (t.closest("[data-ask-no]")) { ask = false; E.sfx("tap"); return hud(); }
      if (t.closest("[data-ask-yes]")) return finish();
      if (t.closest("[data-leave]")) { if (!needOk() && P.leave === false) return; if (!E.auto && (!needOk() || (allClues().length && found() < allClues().length))) { ask = true; E.sfx("tap"); return hud(); } return finish(); }
    };
    $(".se-ui").onclick = onUi; navEl().onclick = onUi;
    let rz = 0; const onResize = () => { clearTimeout(rz); rz = setTimeout(() => { if (!done) { const v = VIEW(), img = imgOf(v); E.ui.frame(img, [...(v.zones || []).map(z => E.regionOf(img, z.r)?.box), ...(v.people || []).map(pp => E.regionOf(img, pp.r)?.box)], { top: 64, bottom: 130 }); } }, 150); };
    addEventListener("resize", onResize);
    const un0 = unhook; unhook = () => { un0(); removeEventListener("resize", onResize); };

    // ── tự chơi: câu đố → dùng đồ → người chưa hỏi → vùng chưa xem → cận cảnh chưa vào → lùi → quay → lối ra / rời
    let guard = 0;
    const autoStep = () => {
      if (done) return;
      if (++guard > 120) return finish();
      const L = () => $(".se-bgl.on .vbw.zones .vbx"), elOf = i => L()?.querySelector(`[data-z="${i}"]`);
      const zs = zones(), st = E.state();
      const w = zs.find(({ z, i }) => z.widget && !PS.solved[seenK(z, i)] && (!z.need || cond(z.need, st)));
      const u = zs.find(({ z, i }) => z.use && !PS.solved[seenK(z, i)] && Object.keys(z.use).some(it => R.items.includes(it)));
      const pp = people().find(({ p }) => !PS.n["auto:p:" + p.who]);
      const nz = zs.find(({ z, i }) => !PS.seen[seenK(z, i)] && !z.exit && !z.to && !z.widget && (PS.n["auto:" + seenK(z, i)] || 0) < 2 && (!z.use || z.stuck || z.then));
      const tz = zs.find(({ z }) => z.to && !PS.vis[z.to] && (!z.need || cond(z.need, st)));
      const nv = [side(-1), side(1)].find(v => v && !PS.vis[v]) || ring.find(v => !PS.vis[v]);
      const ex = zs.find(({ z }) => z.exit);
      if (w) { const impl = WG[w.z.widget.type]; impl?.tap ? impl.tap(w.z, w.z.widget, api(w.z, w.i)) : (impl?.auto || ((a, b, c2, x) => x.ok()))(elOf(w.i), w.z, w.z.widget, api(w.z, w.i)); }
      else if (u) { hold = Object.keys(u.z.use).find(it => R.items.includes(it)); onZone(u.i, elOf(u.i)); }
      else if (pp) { PS.n["auto:p:" + pp.p.who] = 1; onPerson(pp.i, null); }
      else if (nz) { const k = "auto:" + seenK(nz.z, nz.i); PS.n[k] = (PS.n[k] || 0) + 1; onZone(nz.i, elOf(nz.i)); }
      else if (tz) onZone(tz.i, elOf(tz.i));
      else if (VIEW().up) up();
      else if (nv) goView(nv, "cut");
      else if (!needOk() && typeof P.need === "function") { const vv = Object.keys(P.views).find(k => (P.views[k].people || []).some(p => !PS.n["auto:p:" + p.who])); if (vv && vv !== PS.v) goView(vv, "cut"); else finish(); }
      else if (ex && needOk()) onZone(ex.i, elOf(ex.i));
      else finish();
      if (!done) setTimeout(() => E.autoRun(autoStep), 5);
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
    const canShow = showKeys.length && R.items.some(id => E.itemLive(id));
    let picking = false;
    // không còn gì để hỏi / đưa → không mở bảng hỏi, người đó lui ra (cảnh chỉ có lời chào)
    if (!shown.length && !canShow) { if (K.bye && R.used[`tk:${tid}:hello`] && !R.used[`tk:${tid}:bye`]) { R.used[`tk:${tid}:bye`] = 1; run(["bye"]); } setTimeout(() => E.ui.hide(who), 10); return res(); }
    const draw = () => {
      const lastLine = R.last && R.last.who === who ? R.last : null;
      E.ui.panel(`<div class="tk-h" style="--c:${ch.color || "#aaa"}"><b>${esc(E.cname(ch, true))}</b>${K.prompt ? `<span>${esc(nat(K.prompt))}</span>` : ""}</div>
        ${picking ? `<div class="tk-pick"><small>${esc(T("Show them…", "Đưa cho xem…"))}</small><div class="se-bag">${R.items.filter(id => E.itemLive(id)).map(id => `<button class="se-bi" data-show="${id}" aria-label="${esc(nat(S.items[id]?.name))}">${E.itemArt(id, "sm")}<small>${esc(nat(S.items[id]?.name))}</small></button>`).join("")}</div><button class="se-btn wide" data-unpick>${esc(T("Never mind", "Thôi"))}</button></div>`
        : `<div class="tk-l">${shown.map(({ t, i }) => { const a = R.used[askedK(t, i)], u = usable({ t, i }); return `<button class="tk-t${a ? " asked" : ""}${!a && !R.used["tks:" + askedK(t, i)] ? " fresh" : ""}" data-t="${i}" ${u ? "" : "disabled"}><span>${esc(nat(t.label))}</span>${a ? `<em>✓</em>` : t.cost ? `<em class="tk-c">${t.cost}′</em>` : ""}</button>`; }).join("")}</div>
        <div class="se-row tk-f">${canShow ? `<button class="se-btn" data-pick>${E.ICON.box}<span>${esc(T("Show something", "Đưa đồ cho xem"))}</span></button>` : ""}<button class="se-btn pri" data-bye>${esc(nat(K.byeLabel) || T("Leave", "Rời đi"))}</button></div>`}`, "tk");
      shown.forEach(({ t, i }) => (R.used["tks:" + askedK(t, i)] = 1));
    };
    const finish = keys => { E.ui.clear(); if (keys) { if (keys !== "bye-only") run(keys); } res(); };
    E.ui.hideBox();
    draw();
    $(".se-ui").onclick = e => {
      const t = e.target;
      if (t.closest("[data-pick]")) { picking = true; E.sfx("tap"); return draw(); }
      if (t.closest("[data-unpick]")) { picking = false; E.sfx("tap"); return draw(); }
      const sh = t.closest("[data-show]");
      if (sh) { const id = sh.dataset.show, k = K.show[id] ? id : K.show["*"] ? "*" : null; E.sfx("pick"); E._zoneRect = null; c.again(); if (k) run(["show", k]); return finish(); }
      const b = t.closest("[data-t]");
      if (b && !b.disabled) { const i = +b.dataset.t, tp = K.topics[i]; R.used[askedK(tp, i)] = 1; E.sfx("pick"); if (tp.cost) E.time.add(tp.cost); if (!tp.end) c.again(); else E.ui.hide(who); run(["topics", i, "then"]); return finish(); }
      if (t.closest("[data-bye]")) { E.sfx("tap"); if (K.bye) run(["bye"]); if (!K.stay) setTimeout(() => E.ui.hide(who), 10); return finish(); }
    };
    E.autoRun(() => {
      const nx = list.find(usable);
      if (nx) { R.used[askedK(nx.t, nx.i)] = 1; if (!nx.t.end) c.again(); run(["topics", nx.i, "then"]); return finish(); }
      if (canShow && !R.used[`tk:${tid}:autoshow`]) { R.used[`tk:${tid}:autoshow`] = 1; const id = R.items.find(x => K.show[x]) || (K.show["*"] ? R.items[0] : null); if (id) { c.again(); run(["show", K.show[id] ? id : "*"]); return finish(); } }
      if (K.bye) run(["bye"]); E.ui.hide(who); finish();
    });
  }));
})();
